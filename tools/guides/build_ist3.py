"""Builds the IST Unit 5 study guide PDF.  usage: ./.venv/bin/python build_ist.py   (needs Chrome and the dev server on 8124 for the pictures and trace checks)
1) writes the book once to find what to photograph, 2) shots.mjs photographs every example page and checks every trace row in real Chrome, 3) the final book and PDF."""
import os, sys, re, subprocess, importlib, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import importlib.util
import ist_lib, gl
spec = importlib.util.spec_from_file_location("guide_build", os.path.join(HERE, "build.py")); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)   # NOT `import build`: tools/notes has a build.py that rewrites the AP pages
import fitz
ROOT_T = os.path.abspath(os.path.join(HERE, "..")); mod = importlib.import_module("units.ist05"); unit = mod.UNIT
gl.LANG = "html"
html, titles, extras = gl.build_html(unit); ist_lib.save_jobs()
r = subprocess.run(["node", os.path.join(HERE, "work", "ist", "shots.mjs")], capture_output=True, text=True); print(r.stdout.strip(), r.stderr.strip()[-300:])
if r.returncode: sys.exit("browser checks failed")
importlib.reload(ist_lib)
for m in [k for k in list(sys.modules) if k.startswith("units.")]: del sys.modules[m]
import units.ist05 as mod2; unit = mod2.UNIT; gl.LANG = "html"
html, titles, extras = gl.build_html(unit); html = ist_lib.finalize(html)
h = os.path.join(B.WORK, "ist05.html"); p = os.path.join(B.WORK, "ist05.pdf")
open(h, "w", encoding="utf-8").write(html); B.chrome(h, p)
ids = [c for c, _ in titles] + extras
pages, total = B.find_pages(p, ids)
html2, _, _ = gl.build_html(unit, toc_pages=pages); html2 = ist_lib.finalize(html2)
open(h, "w", encoding="utf-8").write(html2); B.chrome(h, p)
pages2, total2 = B.find_pages(p, ids); assert pages2 == pages and total2 == total, "contents numbers moved: %s vs %s" % (pages, pages2)
d = fitz.open(p)
d.set_metadata({"title": "Intro to Software Technology Study Guide: Unit 5, Intro to CSS", "author": "Social Circle High School Computer Science", "subject": "Unit 5: Intro to CSS",
                "keywords": "CSS, web design, study guide, Unit 5, Intro to Software Technology", "creator": "Social Circle High School Computer Science", "producer": "Social Circle High School Computer Science"})
toc = [[1, "Cover", 1], [1, "Contents", 3]]
for cid, t in titles: toc.append([1, "%s  %s" % (cid, re.sub("<[^>]+>", "", t)), pages[cid]])
for k, lab in (("gloss", "Glossary"), ("key", "Answer Key")):
    if k in pages: toc.append([1, lab, pages[k]])
d.set_toc(toc)
for pg in d:
    if "ZZC" not in pg.get_text(): continue
    for m in re.finditer(r"ZZC[\w.]+?ZZ", pg.get_text()):
        for r_ in pg.search_for(m.group(0)): pg.add_redact_annot(r_)
    pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
gq = sys.modules["units.ist_q5"].GUIDE_QS
json.dump(gq, open(os.path.join(ROOT_T, "ist", "_guide_qs3.json"), "w"), ensure_ascii=False)
os.makedirs(B.OUT, exist_ok=True)
final = os.path.join(B.OUT, "IST-Unit-05-Intro-to-CSS-Study-Guide.pdf"); d.save(final, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); d.close()
print("pages:", total, "->", final, "%.1f MB" % (os.path.getsize(final) / 1e6))
