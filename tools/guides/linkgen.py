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
CSS = ('<style>.sg{margin:14px 0 26px;padding:18px 20px;border:1px solid #d9dee7;border-radius:10px;background:#f7f9fc}.sg h2{margin:0 0 6px}.sg p{margin:6px 0}'
       '.sg .big{display:inline-block;margin:6px 10px 6px 0;padding:10px 16px;border-radius:8px;background:#1d4ed8;color:#fff;font-weight:700;text-decoration:none}.sg .big.alt{background:#0f172a}.sg .big.open{background:#fff;color:#1d4ed8;border:2px solid #1d4ed8;padding:8px 14px}'
       '.sg .big:hover{filter:brightness(1.12)}.sg small{color:#5b6472}.sg table{border-collapse:collapse;width:100%;margin-top:10px}.sg td{padding:6px 8px;border-top:1px solid #e3e7ee;vertical-align:top}'
       '.sg td.n{width:84px;white-space:nowrap;font-weight:700}.sg .soon{color:#8a93a3}a.sg-l{font-size:.82em;white-space:nowrap;margin-left:8px}</style>')
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
        '<a class="big" href="downloads/%s" download>&#128230; Download ALL units (ZIP)</a> <small>%s</small>'
        '<table>%s</table><p><small>Each unit page also has a download link for every individual lesson.</small></p></div>' % (zip_name, size(zip_path), rows))
put(os.path.join(ROOT, "apcsp", "index.html"), "study-guides", home, '  <h2 style="margin-bottom:4px;">Units</h2>')
# ---- unit pages
for n in live:
    up = glob.glob(os.path.join(DL, "units", "AP-CSP-Unit-%02d-*.pdf" % n))[0]
    ls = sorted(glob.glob(os.path.join(DL, "lessons", "AP-CSP-Lesson-%02d-*.pdf" % n)))
    items = "".join('<tr><td class="n">%d.%d</td><td>%s</td><td><a href="../downloads/lessons/%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="../downloads/lessons/%s" download>Download PDF</a> <small>(%d pages)</small></td></tr>' % (
        n, int(re.match(r".*Lesson-\d+-(\d+)-", f).group(1)), fitz.open(f).metadata["title"].split(", ", 1)[1], os.path.basename(f), os.path.basename(f), pages(f)) for f in ls)
    unit_html = (CSS + '<div class="sg" id="study-guide"><h2>Unit %d Study Guide</h2><p>Printable PDFs for this unit: the whole guide, or one lesson at a time. Every lesson has the key ideas in plain words, worked examples, '
                 'tracing practice, common mistakes, and practice questions with answers.</p>'
                 '<a class="big" href="../downloads/units/%s" download>&#128196; Download Whole Unit %d (PDF)</a> <a class="big open" href="../downloads/units/%s" target="_blank" rel="noopener">&#128065; Open in browser</a> <small>%d pages, %s</small> '
                 '<a class="big alt" href="../downloads/%s" download>&#128230; All units (ZIP)</a>'
                 '<h3 style="margin:16px 0 0">Individual lessons</h3><table>%s</table></div>' % (n, os.path.basename(up), n, os.path.basename(up), pages(up), size(up), zip_name, items))
    page = os.path.join(ROOT, "apcsp", "unit-%d" % n, "index.html")
    put(page, "study-guide", unit_html, "      <h2>Walkthroughs, Projects, and Quizzes</h2>")
print("links written for units", live)
