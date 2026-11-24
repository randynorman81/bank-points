"""usage: .venv/bin/python preview.py <pdf> <page> [<page> ...]  -> work/pg<N>.png at 80 dpi (use --sheet for a contact sheet of the given pages)"""
import sys, fitz, os
from PIL import Image
args = sys.argv[1:]; sheet = "--sheet" in args; args = [a for a in args if a != "--sheet"]
pdf = args[0]; pages = [int(a) for a in args[1:]]
d = fitz.open(pdf); out = []
for n in pages:
    pix = d[n - 1].get_pixmap(dpi=(46 if sheet else 85)); f = os.path.join(os.path.dirname(__file__), "work", "pg%d.png" % n); pix.save(f); out.append(f)
if sheet:
    ims = [Image.open(f) for f in out]; w, h = ims[0].size; cols = min(4, len(ims)); rows = (len(ims) + cols - 1) // cols
    S = Image.new("RGB", (cols * (w + 8) + 8, rows * (h + 8) + 8), (120, 120, 120))
    for i, im in enumerate(ims): S.paste(im, (8 + (i % cols) * (w + 8), 8 + (i // cols) * (h + 8)))
    S.save(os.path.join(os.path.dirname(__file__), "work", "sheet.png")); print("work/sheet.png", S.size)
else: print(out)
