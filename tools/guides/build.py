"""Render the study guides.  usage: .venv/bin/python build.py 10 [11 12 ...]   (no arguments = every unit that has a spec)
Pass 1 renders the PDF and finds the page each chapter starts on. Pass 2 fills in the contents page numbers, then the PDF gets metadata, bookmarks and clickable contents."""
import importlib, os, re, subprocess, sys, shutil
import fitz
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gl
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = os.path.join(gl.ROOT, "study-guides"); WORK = os.path.join(HERE, "work")
os.makedirs(OUT, exist_ok=True); os.makedirs(WORK, exist_ok=True)


def chrome(html_path, pdf_path):
    r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", "--virtual-time-budget=20000", "--print-to-pdf=" + pdf_path, "file://" + html_path], capture_output=True, text=True, timeout=240)
    if not os.path.exists(pdf_path): raise RuntimeError(r.stderr[-500:])


def find_pages(pdf, ids):
    d = fitz.open(pdf); found = {}
    for i, page in enumerate(d):
        t = page.get_text()
        for cid in ids:
            if cid not in found and ("ZZC%sZZ" % cid) in t: found[cid] = i + 1
    n = len(d); d.close(); return found, n


def build(n):
    mod = importlib.import_module("units.u%02d" % n); unit = mod.UNIT
    html, titles, extras = gl.build_html(unit)
    h = os.path.join(WORK, "u%02d.html" % n); p = os.path.join(WORK, "u%02d.pdf" % n)
    open(h, "w", encoding="utf-8").write(html); chrome(h, p)
    ids = [c for c, _ in titles] + extras
    pages, total = find_pages(p, ids)
    html2, _, _ = gl.build_html(unit, toc_pages=pages)
    open(h, "w", encoding="utf-8").write(html2); chrome(h, p)
    pages2, total2 = find_pages(p, ids)
    assert pages2 == pages and total2 == total, "contents numbers moved between passes: %s vs %s" % (pages, pages2)
    # metadata, bookmarks, clickable contents
    d = fitz.open(p)
    d.set_metadata({"title": "AP Computer Science Principles Study Guide: Unit %d, %s" % (unit.n, unit.title), "author": "Social Circle High School Computer Science",
                    "subject": unit.bigidea, "keywords": "AP CSP, Computer Science Principles, study guide, Unit %d, %s" % (unit.n, unit.title), "creator": "Social Circle High School Computer Science", "producer": "Social Circle High School Computer Science"})
    toc = [[1, "Cover", 1], [1, "Contents", 3]]
    for cid, t in titles: toc.append([1, "%s  %s" % (cid, re.sub("<[^>]+>", "", t)), pages[cid]])
    for k, lab in (("cheat", "Quick Reference"), ("gloss", "Glossary"), ("key", "Answer Key")):
        if k in pages: toc.append([1, lab, pages[k]])
    d.set_toc(toc)
    # strip the invisible page-finding markers from the text layer (they would show up when copying or searching)
    for pg in d:
        before = re.sub(r"ZZC[\w.]+?ZZ", "", pg.get_text()); hits = pg.search_for("ZZC") if "ZZC" in pg.get_text() else []
        if not hits: continue
        for m in re.finditer(r"ZZC[\w.]+?ZZ", pg.get_text()):
            for r in pg.search_for(m.group(0)): pg.add_redact_annot(r)
        pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE, graphics=fitz.PDF_REDACT_LINE_ART_NONE if hasattr(fitz, "PDF_REDACT_LINE_ART_NONE") else 0)
        after = pg.get_text()
        assert "ZZC" not in after and re.sub(r"\s+", "", after) == re.sub(r"\s+", "", before), "redaction changed page %d text" % (pg.number + 1)
    name = "AP-CSP-Unit-%02d-%s-Study-Guide.pdf" % (unit.n, re.sub(r"[^A-Za-z0-9]+", "-", unit.title).strip("-"))
    final = os.path.join(OUT, name); d.save(final, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); d.close()
    print("Unit %d: %d pages -> %s (%.1f MB)" % (unit.n, total, final, os.path.getsize(final) / 1e6)); return final


if __name__ == "__main__" and False:
    units = [int(x) for x in sys.argv[1:]] or sorted(int(f[1:3]) for f in os.listdir(os.path.join(HERE, "units")) if re.match(r"u\d\d\.py$", f))
    for u in units: build(u)


def build_lesson(n, cid):
    """One lesson as its own PDF: cover, the lesson, and its glossary and answer key."""
    mod = importlib.import_module("units.u%02d" % n); unit = mod.UNIT
    html, titles, extras = gl.build_html(unit, only=cid)
    tag = "L%02d_%s" % (n, cid.replace(".", "_"))
    h = os.path.join(WORK, tag + ".html"); p = os.path.join(WORK, tag + ".pdf")
    open(h, "w", encoding="utf-8").write(html); chrome(h, p)
    ids = [c for c, _ in titles] + extras
    pages, total = find_pages(p, ids)
    d = fitz.open(p)
    title = re.sub("<[^>]+>", "", titles[0][1])
    d.set_metadata({"title": "AP Computer Science Principles Study Guide: Lesson %s, %s" % (cid, title), "author": "Social Circle High School Computer Science",
                    "subject": "Unit %d: %s" % (unit.n, unit.title), "keywords": "AP CSP, study guide, Lesson %s, %s" % (cid, title), "creator": "Social Circle High School Computer Science", "producer": "Social Circle High School Computer Science"})
    toc = [[1, "Cover", 1], [1, "Lesson %s  %s" % (cid, title), pages[cid]]]
    for k, lab in (("gloss", "Glossary"), ("key", "Answer Key")):
        if k in pages: toc.append([1, lab, pages[k]])
    d.set_toc(toc)
    for pg in d:
        for m in re.finditer(r"ZZC[\w.]+?ZZ", pg.get_text()):
            for r in pg.search_for(m.group(0)): pg.add_redact_annot(r)
        pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
    num = cid.split(".")
    name = "AP-CSP-Lesson-%02d-%02d-%s.pdf" % (int(num[0]), int(num[1]) if num[1].isdigit() else 0, re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-")[:60])
    os.makedirs(os.path.join(OUT, "lessons"), exist_ok=True)
    final = os.path.join(OUT, "lessons", name); d.save(final, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); d.close()
    return final, len(fitz.open(final))

if __name__ == "__main__":
    args = sys.argv[1:]
    if args and args[0] == "lessons":
        for u in [int(x) for x in args[1:]]:
            unit = importlib.import_module("units.u%02d" % u).UNIT
            for ch in unit.chapters:
                f, n = build_lesson(u, ch["id"]); print("Lesson %s: %d pages -> %s" % (ch["id"], n, os.path.basename(f)))
    else:
        units = [int(x) for x in args] or sorted(int(f[1:3]) for f in os.listdir(os.path.join(HERE, "units")) if re.match(r"u\d\d\.py$", f))
        for u in units: build(u)
