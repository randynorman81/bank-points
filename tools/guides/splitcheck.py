"""Prove that no block splits across a page: mark the start and end of every block, render, and compare the pages.
usage: .venv/bin/python splitcheck.py N [N ...]"""
import importlib, os, re, sys
import fitz
from bs4 import BeautifulSoup
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import gl, importlib.util
_sp = importlib.util.spec_from_file_location('guidebuild', os.path.join(HERE, 'build.py')); build = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(build)
SEL = ["figure.fig", "table.cmp", ".sec.t-watch", ".glance", ".example", ".warn", ".hint-panel", ".callout", ".pq", ".code", "pre", ".tblwrap", "p", "ul", "ol", ".sec.exam", ".cardx", ".box", ".frames .fr", ".chead", ".gloss .g", ".ans .a"]

def mark(html):
    soup = BeautifulSoup(html, "lxml"); n = 0; seen = set()
    for sel in SEL:
        for el in soup.select(sel):
            if id(el) in seen or el.find_parent("style"): continue
            seen.add(id(el)); n += 1
            a = soup.new_tag("span", style="font-size:1pt;color:#fff;line-height:0"); a.string = "ZZB%dsZZ" % n
            b = soup.new_tag("span", style="font-size:1pt;color:#fff;line-height:0"); b.string = "ZZB%deZZ" % n
            el.insert(0, a); el.append(b)
    return str(soup), n

def check(n):
    unit = importlib.import_module("units.u%02d" % n).UNIT
    html, titles, extras = gl.build_html(unit); ids = [c for c, _ in titles] + extras
    pdf0 = os.path.join(build.WORK, "u%02d.pdf" % n)
    pages = build.find_pages(pdf0, ids)[0] if os.path.exists(pdf0) else {}
    html2, _, _ = gl.build_html(unit, toc_pages=pages)
    marked, cnt = mark(html2)
    h = os.path.join(build.WORK, "sc%02d.html" % n); p = os.path.join(build.WORK, "sc%02d.pdf" % n)
    open(h, "w", encoding="utf-8").write(marked); build.chrome(h, p)
    d = fitz.open(p); start = {}; end = {}
    for i, pg in enumerate(d):
        t = pg.get_text()
        for m in re.finditer(r"ZZB(\d+)([se])ZZ", t):
            (start if m.group(2) == "s" else end)[int(m.group(1))] = i + 1
    bad = [(k, start[k], end[k]) for k in start if k in end and start[k] != end[k]]
    soup = BeautifulSoup(marked, "lxml"); els = {}
    # describe offenders
    seen = 0; desc = {}
    for sel in SEL:
        for el in soup.select(sel):
            txt = el.get_text(" ", strip=True)
            m = re.search(r"ZZB(\d+)sZZ", txt)
            if m: desc[int(m.group(1))] = (sel, re.sub(r"ZZB\d+[se]ZZ", "", txt)[:70])
    print("Unit %d: %d blocks checked, %d split across pages" % (n, len(start), len(bad)))
    for k, a, b in bad[:40]: print("   pages %d-%d  %s  %s" % (a, b, desc.get(k, ("?", ""))[0], desc.get(k, ("?", ""))[1]))
    return len(bad)

if __name__ == "__main__":
    for u in sys.argv[1:]: check(int(u))
