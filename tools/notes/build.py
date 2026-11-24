"""Write the notes pages. usage: python3 tools/notes/build.py [unit10|bigidea5|data12|algos7|creative19|strings14|projects|review18]"""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
import unit10, bigidea5, data12, algos7, creative19, strings14, projects, review18
mods = [("unit10", unit10), ("bigidea5", bigidea5), ("data12", data12), ("algos7", algos7), ("creative19", creative19), ("strings14", strings14), ("projects", projects), ("review18", review18)]
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


def patch_unit7():
    """Unit 7 got three new lessons (7.7 to 7.9). The six older Unit 7 pages and the unit overview are not generated, so add the new links to them (safe to run again)."""
    A = os.path.join(ROOT, "apcsp")
    new = [("developing-algorithms.html", "Developing Algorithms"), ("algorithm-efficiency.html", "Efficiency and Heuristics"), ("undecidable-problems.html", "Undecidable Problems")]
    for f in ["lists-indexing.html", "list-operations.html", "lists-for-loops.html", "simulations.html", "searching-efficiency.html", "data-abstraction.html"]:
        p = os.path.join(A, f)
        t = open(p, encoding="utf-8").read()
        if "developing-algorithms.html" in t:
            continue
        pill = re.search(r'(  <a href="data-abstraction\.html"[^>]*>[^<]*</a>\n)', t)
        assert pill, f
        t = t.replace(pill.group(1), pill.group(1) + "".join('  <a href="%s">%s</a>\n' % n for n in new), 1)
        if f == "data-abstraction.html":
            t = t.replace('    <a class="back" href="searching-efficiency.html">&larr; Searching and Efficiency</a>', '    <a class="back" href="developing-algorithms.html">Developing Algorithms &rarr;</a>\n    <a class="back" href="searching-efficiency.html">&larr; Searching and Efficiency</a>', 1)
        open(p, "w", encoding="utf-8").write(t)
        print("patched", f)
    p = os.path.join(A, "unit-7", "index.html")
    t = open(p, encoding="utf-8").read()
    if "developing-algorithms.html" not in t:
        old = '  { title: "Data Abstraction and the Create Task (7.6)", file: "data-abstraction.html", wt: 6 }\n'
        assert old in t
        add = old.rstrip("\n") + ",\n" + ",\n".join('  { title: "%s", file: "%s", wt: %d }' % (algos7.TITLES[f], f, 7 + i) for i, f in enumerate(algos7.NEW)) + "\n"
        t = t.replace(old, add, 1)
        open(p, "w", encoding="utf-8").write(t)
        print("patched unit-7/index.html")


if not only or only == "algos7":
    patch_unit7()
