"""Writes ist/unit-6/index.html (Unit 3) and ist/unit-7/index.html (Unit 4: Advanced HTML) in the SAME layout as the AP CSP unit pages (apcsp/unit-3/index.html):
practice buttons, a study-guide box (unit PDF, ZIP, open in browser), a card for every lesson (study guide PDF, notes, walkthrough, assignment, quiz game, practice) and a Review list.
Walkthrough and assignment rows switch on by themselves when the lesson id is listed in live.js (U7_LIVE). usage: python3 tools/ist/mk_unit_pages.py"""
import os, re, glob, fitz
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); DL = os.path.join(ROOT, 'ist', 'downloads')
ap = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'index.html'), encoding='utf-8').read()
def css_of(marker):
    m = re.search(r'<!-- %s:start -->\s*(<style>.*?</style>)' % marker, ap, re.S); return m.group(1)
PB_CSS, SG_CSS, LC_CSS = css_of('practice-buttons'), css_of('study-guide'), css_of('lesson-cards')
LAYOUT_CSS = '<style>/* no sidebar: content uses the whole page width */.lesson-layout{grid-template-columns:1fr;max-width:none}.lesson-sidebar{display:none}.lprow.off{opacity:.55;cursor:default}.lprow.off:hover{background:#eaf4ff;border-color:#b9d3f0}</style>'
SVG_P = re.search(r'<a class="pbtn" href="[^"]*hub=p[^"]*">(<svg.*?</svg>)', ap, re.S).group(1)
SVG_T = re.search(r'<a class="pbtn" href="[^"]*hub=t[^"]*">(<svg.*?</svg>)', ap, re.S).group(1)
SVG_G = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="11" rx="3"/><path d="M8 10v5M5.5 12.5h5"/><circle cx="15.5" cy="11.5" r=".6"/><circle cx="17.5" cy="13.5" r=".6"/></svg>'
SVG_B = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4L19 6"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>'
def pdf_pages(p): return len(fitz.open(p))
def mb(p): return '%.1f MB' % (os.path.getsize(p) / 1e6)
PARTS = [
 dict(folder='unit-6', part=1, num=3, zip='IST-Unit-3-Study-Guides.zip', title='Unit 3 &mdash; Web Design: HTML', short='Unit 3: Web Design - HTML', unit_pdf='IST-Unit-03-Web-Design-HTML-Study-Guide.pdf', test='unit-3-practice-test.html', test_label='Unit 3 Practice Test (75 questions, lessons 3.1&ndash;3.10)',
      practice='practice.html', other=('../unit-7/index.html', 'Unit 4: Advanced HTML (box model, colors, display, div and tables)'),
      lessons=[('3.1', '6.1', 'Intro to HTML and the HTML Skeleton', 'html-intro-notes.html', 'i3l1', 1), ('3.2', '6.2', 'The Style Attribute and Colors', 'style-attribute-notes.html', 'i3l2', 2), ('3.3', '6.20', 'Text Size, Alignment and Case', 'text-size-align-notes.html', 'i3l3', 3),
               ('3.4', '6.3', 'Editing Tags: strong, em, br, hr and span', 'editing-tags-notes.html', 'i3l4', 4), ('3.5', '6.35', 'Google Fonts', 'google-fonts-notes.html', 'i3l5', 5), ('3.6', '6.4', 'Borders', 'borders-notes.html', 'i3l6', 6),
               ('3.7', '6.7', 'Images and the Favicon', 'images-notes.html', 'i3l7', 7), ('3.8', '6.75', 'Emojis and Symbols', 'emojis-symbols-notes.html', 'i3l8', 8), ('3.9', '6.6', 'Links', 'links-notes.html', 'i3l9', 9), ('3.10', '6.5', 'Lists and Menus', 'lists-notes.html', 'i3l10', 10)],
      review=[('../unit-6/study-guide.html', '&#128214; Unit 3 Study Guide, the web version'), ('../unit-6/html-colors.html', '&#127912; HTML Color Names (140+ colors)'), ('../unit-6/editor.html', '&#128187; HTML sandbox (practice writing HTML, not graded)')], notes_dir='../unit-6/'),
 dict(folder='unit-7', part=2, num=4, zip='IST-Unit-4-Study-Guides.zip', title='Unit 4 &mdash; Advanced HTML', short='Unit 4: Advanced HTML', unit_pdf='IST-Unit-04-Advanced-HTML-Study-Guide.pdf', test='unit-4-practice-test.html', test_label='Unit 4 Practice Test (45 questions, lessons 4.1&ndash;4.5)',
      practice='practice-2.html', other=('../unit-6/index.html', 'Unit 3: Web Design - HTML (the skeleton, text styles, fonts, borders, images, links and lists)'),
      lessons=[('4.1', '7.1', 'Box Model', 'box-model-notes.html', 'i7l1', 11), ('4.2', '7.2', 'Colors (Names and Hex)', 'colors-notes.html', 'i7l2', 12), ('4.3', '7.3', 'Display (Block vs Inline)', 'display-notes.html', 'i7l3', 13), ('4.4', '7.4', 'Div Tag', 'div-tag-notes.html', 'i7l4', 14), ('4.5', '7.5', 'Tables', 'tables-notes.html', 'i7l5', 15)],
      review=[('7-6-unit-test.html', '&#128221; Unit 4 Test'), ('study-guide.html', '&#128214; Unit 4 Study Guide, the web version'), ('../unit-6/html-colors.html', '&#127912; HTML Color Names (140+ colors)'), ('../unit-6/editor.html', '&#128187; HTML sandbox (practice writing HTML, not graded)')], notes_dir=''),
]
def lesson_pdf(cid):
    f = sorted(glob.glob(os.path.join(DL, 'lessons', 'IST-Lesson-%02d-%02d-*.pdf' % tuple(int(x) for x in cid.split('.')))))[0]; return f
def card(P, l):
    num, eid, title, notes, pid, gid = l; f = lesson_pdf(num); base = os.path.basename(f); pz = P['practice']
    rows = ('<div class="lprow sg"><span class="ic">&#128196;</span><span class="tx"><b>Study guide</b><span>%d-page PDF</span></span><span class="st"><a href="../downloads/lessons/%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="../downloads/lessons/%s" download>Download</a></span></div>' % (pdf_pages(f), base, base))
    rows += '<a class="lprow" href="%s%s" target="_blank" rel="noopener"><span class="ic">&#128214;</span><span class="tx"><b>Notes</b><span>%s</span></span><span class="st">read</span></a>' % (P['notes_dir'], notes, title)
    rows += '<a class="lprow lab" data-lab="%sw" href="../unit-6/editor.html?lesson=%sw"><span class="ic">&#128187;</span><span class="tx"><b>Walkthrough</b><span>Build the page step by step</span></span><span class="st">auto-scored</span></a>' % (eid, eid)
    rows += '<a class="lprow lab" data-lab="%sa" href="../unit-6/editor.html?lesson=%sa"><span class="ic">&#128221;</span><span class="tx"><b>Assignment</b><span>Assignment %s: a real company page</span></span><span class="st">auto-scored</span></a>' % (eid, eid, num)
    rows += '<a class="lprow" href="../unit-6/game.html?l=%d"><span class="ic">&#127918;</span><span class="tx"><b>Quiz game</b><span>Game %s: %s</span></span><span class="st">practice</span></a>' % (gid, num, title)
    return '<div class="lpcard"><div class="lpch"><span class="ln">%s</span><span class="lt">%s</span></div>%s</div>' % (num, title, rows)
def page(P):
    up = os.path.join(DL, 'units', P['unit_pdf']); zp = os.path.join(DL, P['zip']); cards = ''.join(card(P, l) for l in P['lessons'])
    if P['part'] == 2: cards += '<div class="lpcard"><div class="lpch"><span class="ln">Test</span><span class="lt">Unit Test</span></div><a class="lprow" href="7-6-unit-test.html" target="_blank" rel="noopener"><span class="ic">&#128221;</span><span class="tx"><b>Unit test</b><span>Covers all of Unit 4</span></span><span class="st">test</span></a></div>'
    pb = ('<div class="pbtns"><a class="pbtn" href="../unit-6/%s?hub=p">%s<span>Parsons Problems<small>10 per lesson</small></span></a>'
          '<a class="pbtn" href="../unit-6/game.html">%s<span>Quiz games<small>one per lesson</small></span></a></div>') % (P['practice'], SVG_P, SVG_G)
    sg = ('<div class="sg" id="study-guide"><h2>Unit %d Study Guide</h2><p>Printable PDFs for this unit: the whole guide, or one lesson at a time. Every lesson has the key ideas in plain words, worked examples with the page the code makes, common mistakes, and practice questions with answers.</p>'
          '<div class="btns3"><div class="b1"><a class="big alt" href="../downloads/%s" download>&#128230; Whole unit and every lesson (ZIP)</a><small>%s</small></div>'
          '<div class="b1"><a class="big" href="../downloads/units/%s" download>&#128196; Download Whole Unit %d (PDF)</a><small>%d pages, %s</small></div>'
          '<div class="b1"><a class="big open" href="../downloads/units/%s" target="_blank" rel="noopener">&#128065; Open Unit %d in browser</a><small>opens in a new tab</small></div></div></div>') % (P['num'], os.path.basename(zp), mb(zp), P['unit_pdf'], P['num'], pdf_pages(up), mb(up), P['unit_pdf'], P['num'])
    review = '<h2>Review</h2><a class="resource-link" href="%s">&#9989; %s</a>' % (P['test'], P['test_label']) + ''.join('<br><a class="resource-link" href="%s">%s</a>' % (h, t) for h, t in P['review']) + '<br><a class="resource-link" href="%s">&#10145;&#65039; %s</a>' % P['other']
    js = '''<script src="../unit-6/live.js?v=20261126"></script>
<script>
/* walkthrough and assignment rows are links only when the teacher has opened that lesson (U7_LIVE in live.js); until then they show "Opens soon" */
(function () { var live = window.U7_LIVE || []; [].forEach.call(document.querySelectorAll(".lprow.lab"), function (a) { if (live.indexOf(a.getAttribute("data-lab")) > -1) return; a.removeAttribute("href"); a.classList.add("off"); a.querySelector(".st").textContent = "opens soon"; }); })();
</script>'''
    return '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%s | Intro to Software Technology</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
<link rel="stylesheet" href="../../assets/style.css">
<link rel="icon" href="../../assets/logo.png">
%s
</head>
<body>

<div id="site-header-root"></div>

<div style="max-width:none;margin:0 auto;padding:24px clamp(16px,3vw,56px) 0;">
  <div class="breadcrumb"><a href="../../index.html">CS Home</a><span class="sep">/</span><a href="../../ist/index.html">Intro to Software Technology</a><span class="sep">/</span>%s</div>
</div>

  <div class="lesson-layout">
    <aside class="lesson-sidebar" id="lesson-sidebar-root"></aside>

    <article class="lesson-content">
      <h1>%s</h1>
      <p class="hint">All work is built and submitted in the Web Editor. Every lesson has a study guide, a walkthrough, an assignment, a quiz game and practice puzzles. %s.</p>

%s
%s
%s
      <h2>Lessons</h2>
      <p>Each lesson has its study guide, notes, walkthrough, assignment, quiz game and practice. The walkthrough and assignment open in the Web Editor when your teacher opens them.</p>
      <div class="lpgrid">%s</div>

      %s
    </article>
  </div>

<footer class="site-footer">
  Social Circle High School &middot; Computer Science &middot; questions? see Mr. Norman
</footer>

<script src="../../assets/nav.js"></script>
<script>renderHeader();</script>
%s
</body>
</html>
''' % (P['short'], PB_CSS + SG_CSS + LC_CSS + LAYOUT_CSS, P['short'], P['title'], 'Next: <a href="%s">%s</a>' % P['other'] if P['part'] == 1 else 'Before this: <a href="%s">%s</a>' % P['other'], pb, sg, '', cards, review, js)
for P in PARTS:
    open(os.path.join(ROOT, 'ist', P['folder'], 'index.html'), 'w', encoding='utf-8').write(page(P)); print('wrote ist/%s/index.html' % P['folder'])
