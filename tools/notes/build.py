"""Write the notes pages. usage: python3 tools/notes/build.py [unit10|bigidea5]"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
import unit10
mods = [("unit10", unit10)]
try:
    import bigidea5
    mods.append(("bigidea5", bigidea5))
except ImportError:
    pass
only = sys.argv[1] if len(sys.argv) > 1 else None
for name, m in mods:
    if only and only != name:
        continue
    for slug, fn in m.PAGES.items():
        path = os.path.join(ROOT, "apcsp", slug + ".html")
        open(path, "w", encoding="utf-8").write(fn())
        print("wrote apcsp/%s.html" % slug)
    for d, idx in getattr(m, "INDEXES", {}).items():
        os.makedirs(os.path.join(ROOT, "apcsp", d), exist_ok=True)
        open(os.path.join(ROOT, "apcsp", d, "index.html"), "w", encoding="utf-8").write(idx())
        print("wrote apcsp/%s/index.html" % d)
