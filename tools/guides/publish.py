"""Copy finished PDFs into the website folder (apcsp/downloads) and build the all-units zip.
usage: .venv/bin/python publish.py 3 [4 5 ...]   (units whose unit PDF and lesson PDFs go on the site; the zip always holds every unit PDF)"""
import glob, os, shutil, sys, zipfile
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
SRC = os.path.join(ROOT, "study-guides"); DST = os.path.join(ROOT, "apcsp", "downloads")
units = [int(x) for x in sys.argv[1:]]
for sub in ("units", "lessons"):
    d = os.path.join(DST, sub)
    if os.path.isdir(d): shutil.rmtree(d)
    os.makedirs(d)
for u in units:
    for f in glob.glob(os.path.join(SRC, "AP-CSP-Unit-%02d-*.pdf" % u)): shutil.copy(f, os.path.join(DST, "units"))
    for f in glob.glob(os.path.join(SRC, "lessons", "AP-CSP-Lesson-%02d-*.pdf" % u)): shutil.copy(f, os.path.join(DST, "lessons"))
z = os.path.join(DST, "AP-CSP-Study-Guides-All-Units.zip")
if os.path.exists(z): os.remove(z)
with zipfile.ZipFile(z, "w", zipfile.ZIP_STORED) as zf:
    for f in sorted(glob.glob(os.path.join(SRC, "AP-CSP-Unit-*.pdf"))): zf.write(f, "AP-CSP-Study-Guides/" + os.path.basename(f))
tot = 0
for dp, _, fs in os.walk(DST):
    for f in fs: tot += os.path.getsize(os.path.join(dp, f))
print("published units", units, "-", len(os.listdir(os.path.join(DST, 'units'))), "unit PDFs,", len(os.listdir(os.path.join(DST, 'lessons'))), "lesson PDFs; zip %.1f MB; total %.1f MB" % (os.path.getsize(z) / 1e6, tot / 1e6))
