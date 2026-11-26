"""One PDF per IST lesson (cover, the lesson, its glossary and answer key) plus copies of the two unit PDFs and a ZIP, written to ist/downloads/.
usage: ./.venv/bin/python build_ist_lessons.py   (run build_ist.py and build_ist2.py first: the pictures are made there)"""
import os, sys, re, shutil, zipfile, importlib, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
import ist_lib, gl, fitz
spec = importlib.util.spec_from_file_location("guide_build", os.path.join(HERE, "build.py")); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)   # NOT `import build` (tools/notes/build.py shadows it)
DL = os.path.join(ROOT, "ist", "downloads"); os.makedirs(os.path.join(DL, "lessons"), exist_ok=True); os.makedirs(os.path.join(DL, "units"), exist_ok=True)
PARTS = [("units.ist03", "IST-Unit-03-Part-1-Web-Design-HTML-Study-Guide.pdf", "IST-Unit-03-Web-Design-1-HTML-Part-1-Study-Guide.pdf", "Part 1"), ("units.ist03p2", "IST-Unit-03-Part-2-HTML-Layout-and-Tables-Study-Guide.pdf", "IST-Unit-03-Part-2-HTML-Layout-and-Tables-Study-Guide.pdf", "Part 2")]
made = []
for modname, unit_name, src_name, label in PARTS:
    shutil.copy(os.path.join(B.OUT, src_name), os.path.join(DL, "units", unit_name))
    mod = importlib.import_module(modname); unit = mod.UNIT; gl.LANG = "html"
    for ch in unit.chapters:
        cid = ch["id"]
        html, titles, extras = gl.build_html(unit, only=cid)
        tag = "ISTL_%s" % cid.replace(".", "_"); h = os.path.join(B.WORK, tag + ".html"); p = os.path.join(B.WORK, tag + ".pdf")
        open(h, "w", encoding="utf-8").write(html); B.chrome(h, p)
        ids = [c for c, _ in titles] + extras; pages, total = B.find_pages(p, ids)
        d = fitz.open(p); title = re.sub("<[^>]+>", "", titles[0][1])
        d.set_metadata({"title": "Intro to Software Technology Study Guide: Lesson %s, %s" % (cid, title), "author": "Social Circle High School Computer Science", "subject": "Unit 3 %s" % label,
                        "keywords": "HTML, web design, study guide, Lesson %s, %s" % (cid, title), "creator": "Social Circle High School Computer Science", "producer": "Social Circle High School Computer Science"})
        toc = [[1, "Cover", 1], [1, "Lesson %s  %s" % (cid, title), pages[cid]]]
        for k, lab in (("gloss", "Glossary"), ("key", "Answer Key")):
            if k in pages: toc.append([1, lab, pages[k]])
        d.set_toc(toc)
        for pg in d:
            for m in re.finditer(r"ZZC[\w.]+?ZZ", pg.get_text()):
                for r in pg.search_for(m.group(0)): pg.add_redact_annot(r)
            pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        num = cid.split("."); name = "IST-Lesson-%02d-%02d-%s.pdf" % (int(num[0]), int(num[1]), re.sub(r"[^A-Za-z0-9]+", "-", title).strip("-")[:60])
        final = os.path.join(DL, "lessons", name); d.save(final, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); n = len(fitz.open(final)); d.close()
        made.append((cid, name, n)); print("Lesson %s: %d pages -> %s" % (cid, n, name))
zp = os.path.join(DL, "IST-Unit-3-Study-Guides.zip")
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(os.listdir(os.path.join(DL, "units"))): z.write(os.path.join(DL, "units", f), "units/" + f)
    for f in sorted(os.listdir(os.path.join(DL, "lessons"))): z.write(os.path.join(DL, "lessons", f), "lessons/" + f)
print("zip: %.1f MB" % (os.path.getsize(zp) / 1e6))
