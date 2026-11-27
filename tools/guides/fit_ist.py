"""Fits the IST (Unit 3 / Unit 4) study guides to their pages.
For every lesson: each example (annotated code + the page it makes) and each page trace (code + table) is ONE unit that must sit on ONE page.
A unit that does not fit in the space left on its page is scaled down just enough (never below MIN) to stay with the content before it; a unit taller than a page is scaled to fit one page.
Scales are written to ist_fit.json (ist_lib.finalize applies them in every build).  Then the whole lesson is checked: no block (paragraph, box, table, question, figure ...) may cross a page, nothing may pass the margins.
usage: .venv/bin/python fit_ist.py [lesson id ...]        (no ids = every lesson of both units)   add  --check  to only check"""
import os, sys, re, json, importlib, importlib.util
import fitz
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import ist_lib, gl
spec = importlib.util.spec_from_file_location("guide_build", os.path.join(HERE, "build.py")); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)
spec2 = importlib.util.spec_from_file_location("guide_splitcheck", os.path.join(HERE, "splitcheck.py")); SC = importlib.util.module_from_spec(spec2); spec2.loader.exec_module(SC)
gl.LANG = "html"
MIN = 0.60                       # smallest scale (code and picture text must stay readable)
BOTTOM = 792 - 72.0              # the page text area ends 1in above the page bottom
TOP = 68.4                       # and starts 0.95in below the page top
LEFT, RIGHT = 64.8, 612 - 64.8   # 0.9in side margins
PARTS = ["units.ist03", "units.ist03p2"]

def units():
    out = []
    for m in PARTS:
        mod = importlib.import_module(m); out.append(mod.UNIT)
    return out

def render(unit, cid, html_fn):
    html, titles, extras = gl.build_html(unit, only=cid); html = html_fn(html)
    tag = "FIT_%s" % cid.replace(".", "_"); h = os.path.join(B.WORK, tag + ".html"); p = os.path.join(B.WORK, tag + ".pdf")
    open(h, "w", encoding="utf-8").write(html); B.chrome(h, p); return p

def content_bottom(page):
    """where the content of a page ends (text, pictures, boxes), ignoring the running header and footer"""
    y = TOP
    for b in page.get_text("blocks"):
        if b[1] >= TOP - 2 and b[3] <= BOTTOM + 2 and b[4].strip(): y = max(y, b[3])
    for im in page.get_image_info():
        r = fitz.Rect(im["bbox"])
        if r.y1 <= BOTTOM + 2 and r.y0 >= TOP - 2: y = max(y, r.y1)
    for d in page.get_drawings():
        r = d["rect"]
        if r.y1 <= BOTTOM + 2 and r.y0 >= TOP - 2 and r.height < 600 and r.width > 2: y = max(y, r.y1)
    return y

def units_on(pdf):
    """{id: (start page, start y, end page, end y)} of every example/trace unit"""
    d = fitz.open(pdf); st = {}; en = {}
    for i, pg in enumerate(d):
        t = pg.get_text()
        for m in re.finditer(r"ZZH(\w+?)([se])ZZ", t):
            for r in pg.search_for(m.group(0)):
                (st if m.group(2) == "s" else en)[m.group(1)] = (i, r.y0 if m.group(2) == "s" else r.y1)
    return d, {k: (st[k][0], st[k][1], en[k][0], en[k][1]) for k in st if k in en}

def fit_lesson(unit, cid, fit):
    """returns the number of renders used; fit is updated in place"""
    # the order of the units in the lesson
    base = lambda html: html
    for it in range(40):
        p = render(unit, cid, lambda h: ist_lib.finalize(h, mark=True, fit=fit))
        d, U = units_on(p)
        ordered = sorted(U.items(), key=lambda kv: (kv[1][0], kv[1][1]))
        problem = None
        for wid, (p0, y0, p1, y1) in ordered:
            s = fit.get(wid, 1.0)
            if p1 != p0:                                           # taller than the space it has: shrink to one page
                h_total = (BOTTOM - y0) + (y1 - TOP) + (p1 - p0 - 1) * (BOTTOM - TOP)
                new = s * (BOTTOM - TOP - 14) / h_total * 0.98; problem = (wid, new, "taller than a page"); break
            h = (y1 - y0) + 15 * s                                # plus the space under the last figure
            if p0 >= 2 and y0 < TOP + 90:                           # starts at the top of a page: was it pushed there by too little room above?
                gap = BOTTOM - content_bottom(d[p0 - 1])
                head = y0 - TOP                                   # a heading that travels with the unit does not scale
                if gap > 40 and h + head > gap - 6:
                    new = s * (gap - 8 - head) / h
                    if new >= MIN: problem = (wid, new, "pushed to a new page with %.0fpt free above" % gap); break
        if not problem: return it + 1
        wid, new, why = problem
        if new < MIN * 0.75: new = MIN * 0.75
        fit[wid] = round(max(0.35, new) - 0.0005, 3)
        if fit[wid] >= 0.999: fit.pop(wid, None)
        for w2, v2 in ordered:                                      # everything after it moves: start those from full size again
            if (v2[0], v2[1]) > (U[wid][0], U[wid][1]): fit.pop(w2, None)
        print("   %s %s -> %.3f" % (wid, why, fit.get(wid, 1.0)))
    raise RuntimeError("fit did not settle for " + cid)

def check_lesson(unit, cid, fit):
    """no block may cross a page; nothing may pass the side margins; reports the biggest empty gap and the scales used"""
    html, titles, extras = gl.build_html(unit, only=cid); html = ist_lib.finalize(html, mark=False, fit=fit)
    marked, cnt = SC.mark(html)
    tag = "CHK_%s" % cid.replace(".", "_"); h = os.path.join(B.WORK, tag + ".html"); p = os.path.join(B.WORK, tag + ".pdf")
    open(h, "w", encoding="utf-8").write(marked); B.chrome(h, p)
    d = fitz.open(p); start = {}; end = {}
    for i, pg in enumerate(d):
        for m in re.finditer(r"ZZB(\d+)([se])ZZ", pg.get_text()): (start if m.group(2) == "s" else end)[int(m.group(1))] = i
    def stray(k):
        """a block whose only thing on the next page is its own invisible end marker is not split (the 1pt marker line fell over the page edge)"""
        t = d[end[k]].get_text(); i = t.find("ZZB%deZZ" % k)
        before = re.sub(r"ZZB\d+[se]ZZ", "", t[:i]); before = re.sub(r"INTRO TO SOFTWARE TECHNOLOGY.*?Computer Science", "", before, flags=re.S)
        return len(re.sub(r"[\s\d]", "", before.replace("UNIT", "").replace("STUDY GUIDE", ""))) < 40
    bad = [(k, start[k] + 1, end[k] + 1) for k in start if k in end and start[k] != end[k] and not (end[k] == start[k] + 1 and stray(k))]
    soup = BeautifulSoup(marked, "lxml"); desc = {}
    for sel in SC.SEL:
        for el in soup.select(sel):
            m = re.search(r"ZZB(\d+)sZZ", el.get_text(" ", strip=True))
            if m: desc[int(m.group(1))] = (sel, re.sub(r"ZZB\d+[se]ZZ", "", el.get_text(" ", strip=True))[:60])
    # the same document without markers: margins and gaps
    clean = render(unit, cid, lambda h_: ist_lib.finalize(h_, mark=False, fit=fit)); dd = fitz.open(clean)
    over = []; gaps = []
    for i, pg in enumerate(dd):
        if i == 0: continue
        for b in pg.get_text("blocks"):
            if b[1] < TOP - 2 or b[3] > BOTTOM + 2: continue          # running header and footer
            if b[0] < LEFT - 2 or b[2] > RIGHT + 2: over.append((i + 1, round(b[0]), round(b[2]), b[4][:30].replace("\n", " ")))
        for im in pg.get_image_info():
            r = fitz.Rect(im["bbox"])
            if TOP - 2 <= r.y0 and r.y1 <= BOTTOM + 2 and (r.x0 < LEFT - 2 or r.x1 > RIGHT + 2): over.append((i + 1, round(r.x0), round(r.x1), "image"))
        if i < len(dd) - 1: gaps.append(round(BOTTOM - content_bottom(pg)))
    return dict(pages=len(dd), blocks=len(start), split=[(a, b, desc.get(k, ("?", ""))) for k, a, b in bad], over=over, gaps=gaps)

def check_unit(unit, fit):
    """the same checks on the whole unit book (the one people download): no block crosses a page, nothing passes the margins"""
    html, titles, extras = gl.build_html(unit); html = ist_lib.finalize(html, mark=False, fit=fit)
    marked, cnt = SC.mark(html)
    tag = "CHKU_%d" % unit.n; h = os.path.join(B.WORK, tag + ".html"); p = os.path.join(B.WORK, tag + ".pdf")
    open(h, "w", encoding="utf-8").write(marked); B.chrome(h, p)
    d = fitz.open(p); start = {}; end = {}
    for i, pg in enumerate(d):
        for m in re.finditer(r"ZZB(\d+)([se])ZZ", pg.get_text()): (start if m.group(2) == "s" else end)[int(m.group(1))] = i
    bad = [(k, start[k] + 1, end[k] + 1) for k in start if k in end and start[k] != end[k]]
    return len(d), len(start), bad

def lessons(only):
    out = []
    for u in units():
        for ch in u.chapters:
            if not only or ch["id"] in only: out.append((u, ch["id"]))
    return out

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]; only_check = "--check" in sys.argv
    fit = ist_lib.load_fit(); total_bad = 0
    for u, cid in lessons(set(args)):
        if not only_check:
            n = fit_lesson(u, cid, fit); json.dump(fit, open(ist_lib.FITFILE, "w"), indent=0, sort_keys=True)
        r = check_lesson(u, cid, fit)
        bad = len(r["split"]) + len(r["over"]); total_bad += bad
        print("Lesson %s: %d pages, %d blocks checked, %d split, %d past margins, biggest empty gap %spt %s" % (cid, r["pages"], r["blocks"], len(r["split"]), len(r["over"]), max(r["gaps"] or [0]), "OK" if not bad else "PROBLEM"))
        for s in r["split"]: print("    split pages %d-%d %s: %s" % (s[0], s[1], s[2][0], s[2][1]))
        for o in r["over"]: print("    margin", o)
    if "--unit" in sys.argv:
        for u in units():
            n, blocks, bad = check_unit(u, fit); total_bad += len(bad)
            print("Unit %d book: %d pages, %d blocks checked, %d split %s" % (u.n, n, blocks, len(bad), "OK" if not bad else "PROBLEM")); [print("   split", b) for b in bad]
    print("TOTAL problems:", total_bad); sys.exit(1 if total_bad else 0)
