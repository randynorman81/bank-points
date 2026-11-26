"""Write the study-guide download links into the website pages (idempotent: replaces the block between the markers).
usage: .venv/bin/python linkgen.py 3 [...]   (units that are live)"""
import glob, json, os, re, sys, fitz
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
DL = os.path.join(ROOT, "apcsp", "downloads"); live = [int(x) for x in sys.argv[1:]]
UNITS = {1: "Introduction to Programming", 2: "Paired Programming Project", 3: "Programming with Python", 4: "Python Control Structures", 5: "Functions and Parameters", 6: "Practice Performance Task",
         7: "Basic Data Structures", 8: "Digital Information", 9: "Practice PT: The Shopping List", 10: "The Internet", 11: "The Effects of the Internet", 12: "Data", 13: "Project: Present a Data-Driven Insight",
         14: "Strings", 15: "Practice PT: Personal Data Tracker", 16: "The Impact of Computing", 17: "Create Performance Task", 18: "AP Exam Review", 19: "Creative Development"}
def size(p): return "%.1f MB" % (os.path.getsize(p) / 1e6)
def pages(p): return len(fitz.open(p))
zip_name = "AP-CSP-Study-Guides-All-Units.zip"; zip_path = os.path.join(DL, zip_name)
CSS = ('<style>.sg{margin:14px 0 26px;padding:18px 20px;border:1px solid #d9dee7;border-radius:10px;background:#f7f9fc}.sg h2{margin:0 0 6px;font-size:1.15rem}.sg p{margin:6px 0;font-size:.9rem}'
       '.sg .big{display:inline-block;margin:6px 10px 6px 0;padding:8px 14px;font-size:.9rem;line-height:1.3;border-radius:8px;background:#1d4ed8;color:#fff;font-weight:700;text-decoration:none}.sg .big.alt{background:#0f172a}.sg .btns3{display:flex;flex-wrap:wrap;gap:14px 22px;justify-content:center;align-items:flex-start;margin:14px 0}.sg .btns3 .b1{display:flex;flex-direction:column;align-items:center;text-align:center}.sg .btns3 .big{margin:0}.sg .btns3 small{margin-top:5px;font-size:.78rem}.sg .btnrow{display:flex;flex-direction:column;align-items:center;text-align:center;margin:12px 0}.sg .btnrow .btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.sg .btnrow .big{margin:0}.sg .btnrow small{display:block;margin-top:5px;font-size:.78rem}.sg .big{box-sizing:border-box;border:2px solid transparent}.sg .big.open{background:#fff;color:#1d4ed8;border-color:#1d4ed8}'
       '.sg .big:hover{filter:brightness(1.12)}.sg small{color:#5b6472}.sg table{border-collapse:collapse;width:100%;margin-top:10px}.sg td{font-size:.88rem;padding:5px 8px;border-top:1px solid #e3e7ee;vertical-align:top}'
       '.sg td.n{width:84px;white-space:nowrap;font-weight:700}.sg .soon{color:#8a93a3}a.sg-l{font-size:.82em;white-space:nowrap;margin-left:8px}</style>')
ANCHOR = '      <div class="unit-grid" id="lesson-grid-root"></div>'
LMAP = json.load(open(os.path.join(HERE, "lessons-map.json")))
CARD_CSS = ('<style>.lpgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin:18px 0 26px}.lpcard{border:1px solid #c9dcf3;border-radius:12px;background:#f4f9ff;padding:14px 14px 6px}'
            '.lpch{display:flex;gap:9px;align-items:baseline;margin-bottom:8px}.lpch .ln{color:#b45309;font:700 .95em ui-monospace,Menlo,monospace}.lpch .lt{font-weight:700;line-height:1.25}'
            '.lprow{display:flex;gap:11px;align-items:center;padding:9px 11px;margin:0 0 9px;border:1px solid #b9d3f0;border-radius:9px;background:#eaf4ff;color:#0f172a;text-decoration:none}'
            'a.lprow:hover{background:#dcecff;border-color:#7fb0e8}a.lprow,a.lprow .tx span{color:#0f172a;text-decoration:none}.lprow .ic{font-size:1.25em}.lprow .tx{min-width:0}.lprow .tx b{display:block;font:700 .68em ui-monospace,Menlo,monospace;letter-spacing:.09em;text-transform:uppercase;color:#475569}'
            '.lprow .tx span{display:block;line-height:1.25}.lprow .st{margin-left:auto;font-size:.8em;color:#475569;white-space:nowrap;text-align:right}.lprow .st a{white-space:nowrap}.lprow.sg{background:#fff7ed;border-color:#f3c99b}</style>')
PZ_UNITS = {3, 4}   # units that have Parsons puzzles and code tracing (python/parsons.html)
PZ_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1"/></svg>'
TR_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5"/></svg>'
def lessid(n, f):
    """lesson id from a lesson PDF name: Lesson-04-10b-... -> 4.10b"""
    g = re.match(r".*Lesson-\d+-(\d+)(b?)-", f)
    return "%d.%d%s" % (n, int(g.group(1)), g.group(2))
def cards_html(n, ls):
    ed = "../../python/editor.html#"; cards = ""
    for f in ls:
        lid = lessid(n, f); m = LMAP[lid]; base = os.path.basename(f)
        rows = ('<div class="lprow sg"><span class="ic">&#128196;</span><span class="tx"><b>Study guide</b><span>%d-page PDF</span></span><span class="st"><a href="../downloads/lessons/%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="../downloads/lessons/%s" download>Download</a></span></div>' % (pages(f), base, base))
        for w in m["w"]: rows += '<a class="lprow" href="%s%s"><span class="ic">&#128187;</span><span class="tx"><b>Walkthrough</b><span>%s</span></span><span class="st">100 pts</span></a>' % (ed, w["id"], m["title"])
        if m["p"]: rows += '<a class="lprow" href="%s%s"><span class="ic">&#128221;</span><span class="tx"><b>Assignment</b><span>Assignment %s: %s</span></span><span class="st">%d pts</span></a>' % (ed, m["p"]["id"], lid, m["p"]["title"], m["p"]["pts"])
        if m["g"]: rows += '<a class="lprow" href="%s%s"><span class="ic">&#127918;</span><span class="tx"><b>%s</b><span>%s %s: %s</span></span><span class="st">%d pts</span></a>' % (ed, m["g"]["id"], "Mission" if m["g"]["pts"] >= 100 else "Bonus game", "Mission" if m["g"]["pts"] >= 100 else "Bonus Game", lid, m["g"]["title"], m["g"]["pts"])
        cards += '<div class="lpcard"><div class="lpch"><span class="ln">%s</span><span class="lt">%s</span></div>%s</div>' % (lid, m["title"], rows)
    return CARD_CSS + '<h2>Lessons</h2><p>Each lesson has its study guide, walkthrough, assignment, and bonus game. The walkthrough, assignment, and game open in the Python Editor.</p><div class="lpgrid">%s</div>' % cards
PRACTICE_CSS = ('<style>.pbtns{display:flex;flex-wrap:wrap;gap:14px;margin:6px 0 22px}.pbtn{display:flex;align-items:center;gap:14px;flex:1 1 280px;max-width:520px;padding:16px 20px;border:1.5px solid #c7d2fe;border-radius:14px;background:#eef0ff;color:#1e1b4b;text-decoration:none;font-weight:800;font-size:1.15rem;box-shadow:0 2px 8px rgba(79,70,229,.12)}'
                '.pbtn:hover{background:#e0e7ff;border-color:#818cf8}.pbtn svg{flex:none}.pbtn small{display:block;font-weight:500;font-size:.82rem;color:#4338ca;margin-top:2px}.lesson-content a.pbtn,.lesson-content a.pbtn span{color:#1e1b4b;text-decoration:none}.lesson-content a.pbtn small{color:#4338ca}</style>')
def practice_html(n):
    return (PRACTICE_CSS + '<div class="pbtns"><a class="pbtn" href="../../python/parsons.html?hub=p&u=%d">%s<span>Parsons Problems<small>10 per lesson</small></span></a>'
            '<a class="pbtn" href="../../python/parsons.html?hub=t&u=%d">%s<span>Code tracing<small>10 per lesson</small></span></a></div>' % (n, PZ_SVG, n, TR_SVG)).replace('width="22" height="22"', 'width="30" height="30"')
def block(marker, html):
    return "<!-- %s:start -->\n%s\n<!-- %s:end -->" % (marker, html, marker)
def put(path, marker, html, before):
    s = open(path, encoding="utf-8").read(); b = block(marker, html)
    if "<!-- %s:start -->" % marker in s: s = re.sub(r"<!-- %s:start -->.*?<!-- %s:end -->" % (marker, marker), lambda m: b, s, flags=re.S)
    else:
        assert before in s, (path, before); s = s.replace(before, b + "\n" + before, 1)
    open(path, "w", encoding="utf-8").write(s)
# ---- course home page
rows = ""
for n in sorted(UNITS):
    f = glob.glob(os.path.join(DL, "units", "AP-CSP-Unit-%02d-*.pdf" % n))
    if n in live and f:
        rows += '<tr><td class="n">Unit %d</td><td>%s</td><td><a href="downloads/units/%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="downloads/units/%s" download>Download PDF</a> <small>(%d pages, %s)</small></td></tr>' % (n, UNITS[n], os.path.basename(f[0]), os.path.basename(f[0]), pages(f[0]), size(f[0]))
    else: rows += '<tr><td class="n">Unit %d</td><td>%s</td><td class="soon">Coming soon</td></tr>' % (n, UNITS[n])
home = (CSS + '<div class="sg" id="study-guides"><h2>Study Guides (printable PDFs)</h2><p>A complete, illustrated study guide for every lesson: key ideas in plain words, worked examples with arrows and captions, '
        'step-by-step code tracing, common mistakes, and practice questions with an answer key.</p>'
        '<div class="btnrow"><div class="btns"><a class="big" href="downloads/%s" download>&#128230; Download ALL units (ZIP)</a></div><small>%s</small></div>'
        '<table>%s</table><p><small>Each unit page also has a download link for every individual lesson.</small></p></div>' % (zip_name, size(zip_path), rows))
put(os.path.join(ROOT, "apcsp", "index.html"), "study-guides", home, '</main>')
# ---- unit pages
for n in live:
    up = glob.glob(os.path.join(DL, "units", "AP-CSP-Unit-%02d-*.pdf" % n))[0]
    ls = sorted(glob.glob(os.path.join(DL, "lessons", "AP-CSP-Lesson-%02d-*.pdf" % n)))
    items = "".join('<tr><td class="n">%d.%s</td><td>%s</td><td><a href="../downloads/lessons/%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="../downloads/lessons/%s" download>Download PDF</a> <small>(%d pages)</small></td></tr>' % (
        n, lessid(n, f).split(".", 1)[1], fitz.open(f).metadata["title"].split(", ", 1)[1], os.path.basename(f), os.path.basename(f), pages(f)) for f in ls)
    unit_html = (CSS + '<div class="sg" id="study-guide"><h2>Unit %d Study Guide</h2><p>Printable PDFs for this unit: the whole guide, or one lesson at a time. Every lesson has the key ideas in plain words, worked examples, '
                 'tracing practice, common mistakes, and practice questions with answers.</p>'
                 '<div class="btns3"><div class="b1"><a class="big alt" href="../downloads/%s" download>&#128230; All units (ZIP)</a><small>every unit, 19 PDFs</small></div>'
                 '<div class="b1"><a class="big" href="../downloads/units/%s" download>&#128196; Download Whole Unit %d (PDF)</a><small>%d pages, %s</small></div>'
                 '<div class="b1"><a class="big open" href="../downloads/units/%s" target="_blank" rel="noopener">&#128065; Open Unit %d in browser</a><small>opens in a new tab</small></div></div>'
                 '</div>' % (n, zip_name, os.path.basename(up), n, pages(up), size(up), os.path.basename(up), n))
    page = os.path.join(ROOT, "apcsp", "unit-%d" % n, "index.html")
    put(page, "study-guide", unit_html, ANCHOR)
    if n in PZ_UNITS: put(page, "practice-buttons", practice_html(n), "<!-- study-guide:start -->")
    put(page, "lesson-cards", cards_html(n, ls), ANCHOR)
for n in sorted(PZ_UNITS - set(live)):      # units with practice pages but no study guide yet: just the two practice buttons
    page = os.path.join(ROOT, "apcsp", "unit-%d" % n, "index.html")
    if os.path.exists(page): put(page, "practice-buttons", practice_html(n), ANCHOR)
print("links written for units", live)
