"""One PDF per IST lesson (cover, the lesson, its glossary and answer key) plus copies of the two unit PDFs and a ZIP, written to ist/downloads/.
usage: ./.venv/bin/python build_ist_lessons.py   (run build_ist.py and build_ist2.py first: the pictures are made there)"""
import os, sys, re, shutil, zipfile, importlib, importlib.util
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
import ist_lib, gl, fitz
spec = importlib.util.spec_from_file_location("guide_build", os.path.join(HERE, "build.py")); B = importlib.util.module_from_spec(spec); spec.loader.exec_module(B)   # NOT `import build` (tools/notes/build.py shadows it)
DL = os.path.join(ROOT, "ist", "downloads"); os.makedirs(os.path.join(DL, "lessons"), exist_ok=True); os.makedirs(os.path.join(DL, "units"), exist_ok=True)
PARTS = [("units.ist01", "IST-Unit-01-Digital-Footprint-Study-Guide.pdf", "IST-Unit-01-Digital-Footprint-Study-Guide.pdf", "Unit 1: Digital Footprint", "IST-Unit-1-Study-Guides.zip"),
         ("units.ist03", "IST-Unit-03-Web-Design-HTML-Study-Guide.pdf", "IST-Unit-03-Web-Design-HTML-Study-Guide.pdf", "Unit 3: Web Design (HTML)", "IST-Unit-3-Study-Guides.zip"),
         ("units.ist03p2", "IST-Unit-04-Advanced-HTML-Study-Guide.pdf", "IST-Unit-04-Advanced-HTML-Study-Guide.pdf", "Unit 4: Advanced HTML", "IST-Unit-4-Study-Guides.zip"),
         ("units.ist05", "IST-Unit-05-Intro-to-CSS-Study-Guide.pdf", "IST-Unit-05-Intro-to-CSS-Study-Guide.pdf", "Unit 5: Intro to CSS", "IST-Unit-5-Study-Guides.zip"),
         ("units.ist06", "IST-Unit-06-Bootstrap-Study-Guide.pdf", "IST-Unit-06-Bootstrap-Study-Guide.pdf", "Unit 6: Bootstrap", "IST-Unit-6-Study-Guides.zip")]
if os.environ.get("IST_UNITS"): PARTS = [p for p in PARTS if p[0] in os.environ["IST_UNITS"].split(",")]
FIXED = {}   # Randy's own corrected lesson PDFs are used as they are
made = []
for modname, unit_name, src_name, label, zip_name in PARTS:
    shutil.copy(os.path.join(B.OUT, src_name), os.path.join(DL, "units", unit_name))
    mod = importlib.import_module(modname); unit = mod.UNIT; gl.LANG = "html"; ist_lib.SPLIT_TABLES = (modname == "units.ist01")
    for ch in unit.chapters:
        cid = ch["id"]
        html, titles, extras = gl.build_html(unit, only=cid); html = ist_lib.finalize(html)
        tag = "ISTL_%s" % cid.replace(".", "_"); h = os.path.join(B.WORK, tag + ".html"); p = os.path.join(B.WORK, tag + ".pdf")
        open(h, "w", encoding="utf-8").write(html); B.chrome(h, p)
        ids = [c for c, _ in titles] + extras; pages, total = B.find_pages(p, ids)
        d = fitz.open(p); title = re.sub("<[^>]+>", "", titles[0][1])
        d.set_metadata({"title": "Intro to Software Technology Study Guide: Lesson %s, %s" % (cid, title), "author": "Social Circle High School Computer Science", "subject": label,
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
        final = os.path.join(DL, "lessons", name)
        if cid in FIXED: d.close(); shutil.copy(FIXED[cid], final); n = len(fitz.open(final)); made.append((cid, name, n)); print("Lesson %s: %d pages (Randys fixed file) -> %s" % (cid, n, name)); continue
        d.save(final, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); n = len(fitz.open(final)); d.close()
        made.append((cid, name, n)); print("Lesson %s: %d pages -> %s" % (cid, n, name))
for zip_name, prefix in (("IST-Unit-1-Study-Guides.zip", "IST-Unit-01-"), ("IST-Unit-3-Study-Guides.zip", "IST-Unit-03-"), ("IST-Unit-4-Study-Guides.zip", "IST-Unit-04-"), ("IST-Unit-5-Study-Guides.zip", "IST-Unit-05-"), ("IST-Unit-6-Study-Guides.zip", "IST-Unit-06-")):
    if os.environ.get("IST_UNITS") and not any(zip_name.startswith("IST-Unit-%s-" % m[-1]) for m in os.environ["IST_UNITS"].split(",")): continue
    lp = "IST-Lesson-%s-" % prefix[9:11]
    zp = os.path.join(DL, zip_name)
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(os.listdir(os.path.join(DL, "units"))):
            if f.startswith(prefix): z.write(os.path.join(DL, "units", f), "units/" + f)
        for f in sorted(os.listdir(os.path.join(DL, "lessons"))):
            if f.startswith(lp): z.write(os.path.join(DL, "lessons", f), "lessons/" + f)
    print("zip %s: %.1f MB" % (zip_name, os.path.getsize(zp) / 1e6))
