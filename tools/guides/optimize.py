"""Shrink finished PDFs in place (about 40 percent smaller). usage: .venv/bin/python optimize.py"""
import fitz, glob, os
tot0 = tot1 = 0
for f in sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "study-guides", "**", "*.pdf"), recursive=True)):
    d = fitz.open(f); toc = d.get_toc(); md = d.metadata; n = len(d)
    tmp = f + ".tmp"; d.save(tmp, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, use_objstms=1, clean=True); d.close()
    chk = fitz.open(tmp); assert len(chk) == n and chk.get_toc() == toc and chk.metadata["title"] == md["title"]; chk.close()
    tot0 += os.path.getsize(f); tot1 += os.path.getsize(tmp); os.replace(tmp, f)
print("%.1f MB -> %.1f MB" % (tot0 / 1e6, tot1 / 1e6))
