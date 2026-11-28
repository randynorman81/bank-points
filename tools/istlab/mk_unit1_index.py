"""Writes ist/unit-1/index.html in the same lesson-card layout as the other IST units (ist/unit-8/index.html is the template for the head, styles and footer).
usage: tools/guides/.venv/bin/python tools/istlab/mk_unit1_index.py"""
import os, re, glob, html
import fitz
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
tpl = open(os.path.join(ROOT, "ist", "unit-8", "index.html"), encoding="utf-8").read()
head = tpl[:tpl.index('<div style="max-width:none;margin:0 auto;padding:24px')]
head = head.replace("Unit 5: Intro to CSS | Intro to Software Technology", "Unit 1: Digital Footprint | Intro to Software Technology")
LESSONS = [
 ("1.1", "The CIA Triad", "1-1-intro-to-ist-and-dig-footprint-cia-triad.html", "1-1-notes.html", "The CIA Triad", [("1-1-cia-sorter.html", "&#127919;", "Interactive", "CIA Sorter: name the pillar that failed", "play")], [1], "Spotify triage"),
 ("1.2", "OSINT: Open Source Intelligence", "1-2-1-23-1-25-osint.html", "1-2-osint-guide.html", "The OSINT Guide", [], [2], "Zillow trust team"),
 ("1.3", "Police and the 4th Amendment", "1-3-4th-amendment-rights.html", "1-3-notes.html", "Police and the 4th Amendment", [("1-3-interrogation-room.html", "&#127919;", "Interactive", "The Interrogation Room", "play")], [3], "Discord safety card"),
 ("1.4", "Your Phone's Invisible Footprint", "1-4-your-phones-invisible-footprint.html", "caught-by-their-data.html", "Caught by Their Own Data (8 case files)", [], [4, 5], "Apple privacy guide"),
 ("1.5", "How Strong Is Your Password?", "1-5-how-strong-is-your-password.html", "1-5-notes.html", "Password Security: every term you need", [("/tools/cipherlab/", "&#128273;", "Lab", "CipherLab: crack passwords", "play"), ("1-5-demobank-phish-demo.html", "&#127907;", "Interactive", "DemoBank phishing demo", "play")], [6], "Netflix accounts"),
 ("1.6", "How Hackers Track You Online", "1-6-how-hackers-track-you-online.html", "whos-watching-you.html", "Who's Watching You", [], [7], "Instagram map review"),
 ("1.7", "Copyright and Ethics", "1-7-copyright-and-ethics.html", "copyright-case-file.html", "The Copyright Case File", [], [8], "YouTube creator support"),
 ("1.8", "Hacking Ethics", "1-8-hacking-ethics.html", "hacking-ethics-briefing.html", "Rules of Engagement", [], [9], "Google security outreach"),
 ("1.9", "Common Security Problems", "1-9-common-security-problems.html", "the-front-door.html", "The Front Door", [], [10], "Ticketmaster inspection"),
]
GAME = {1: "The CIA Triad", 2: "OSINT", 3: "Police and the 4th Amendment", 4: "Your Phone's Invisible Footprint", 5: "Caught by Their Own Data", 6: "Password Security", 7: "Online Tracking", 8: "Copyright and Ethics", 9: "Hacking Ethics", 10: "Common Security Problems"}
def pdfinfo(cid):
    n = cid.split("."); f = sorted(glob.glob(os.path.join(ROOT, "ist", "downloads", "lessons", "IST-Lesson-%02d-%02d-*.pdf" % (int(n[0]), int(n[1])))))
    return (os.path.basename(f[0]), len(fitz.open(f[0]))) if f else (None, 0)
def row(href, ic, kind, text, st, extra="", target=False, cls=""):
    a = ' href="%s"' % href if href else ""
    t = ' target="_blank" rel="noopener"' if target else ""
    return '<a class="lprow%s"%s%s%s><span class="ic">%s</span><span class="tx"><b>%s</b><span>%s</span></span><span class="st">%s</span></a>' % (cls, a, extra, t, ic, kind, text, st)
cards = ""
for cid, title, lesson, notes, ntitle, extras, games, comp in LESSONS:
    pdf, pages = pdfinfo(cid); unit_pdf = "../downloads/lessons/" + (pdf or "")
    c = '<div class="lpcard"><div class="lpch"><span class="ln">%s</span><span class="lt">%s</span></div>' % (cid, html.escape(title))
    if pdf: c += '<div class="lprow sg"><span class="ic">&#128196;</span><span class="tx"><b>Study guide</b><span>%d-page PDF</span></span><span class="st"><a href="%s" target="_blank" rel="noopener">Open</a> &nbsp;|&nbsp; <a href="%s" download>Download</a></span></div>' % (pages, unit_pdf, unit_pdf)
    c += row(lesson, "&#128203;", "Lesson page", "Bell ringer and the class assignment", "open")
    c += row(notes, "&#128214;", "Notes", html.escape(ntitle), "read")
    for href, ic, kind, text, st in extras: c += row(href, ic, kind, text, st)
    c += row("../lab/lab.html?lab=%sw" % cid, "&#128187;", "Walkthrough", "Go through the notes step by step", "auto-scored", ' data-lab="%sw"' % cid, cls=" lab")
    c += row("../lab/lab.html?lab=%sa" % cid, "&#128221;", "Assignment", "Assignment %s: %s" % (cid, comp), "auto-scored", ' data-lab="%sa"' % cid, cls=" lab")
    for g in games: c += row("game.html?l=%d" % g, "&#127918;", "Quiz game", "Game: %s" % GAME[g], "practice")
    cards += c + "</div>"
cards += '<div class="lpcard"><div class="lpch"><span class="ln">Test</span><span class="lt">Unit Test</span></div>' + row("unit-1-test.html", "&#128221;", "Unit test", "Covers all of Unit 1", "test", target=True) + "</div>"
zipn = "IST-Unit-1-Study-Guides.zip"; unit_pdf = "IST-Unit-01-Digital-Footprint-Study-Guide.pdf"
upages = len(fitz.open(os.path.join(ROOT, "ist", "downloads", "units", unit_pdf))); usz = os.path.getsize(os.path.join(ROOT, "ist", "downloads", "units", unit_pdf)) / 1e6; zsz = os.path.getsize(os.path.join(ROOT, "ist", "downloads", zipn)) / 1e6
sg = ('<div class="sg" id="study-guide"><h2>Unit 1 Study Guide</h2><p>Printable PDFs for this unit: the whole guide, or one lesson at a time. Every lesson has the key ideas in plain words, tables you can study, real cases, '
      'common mistakes, a roadmap of the walkthrough and assignment, a checklist, and practice questions with answers.</p><div class="btns3"><div class="b1"><a class="big alt" href="../downloads/%s" download>&#128230; Whole unit and every lesson (ZIP)</a><small>%.1f MB</small></div>'
      '<div class="b1"><a class="big" href="../downloads/units/%s" download>&#128196; Download Whole Unit 1 (PDF)</a><small>%d pages, %.1f MB</small></div>'
      '<div class="b1"><a class="big open" href="../downloads/units/%s" target="_blank" rel="noopener">&#128065; Open Unit 1 in browser</a><small>opens in a new tab</small></div></div></div>') % (zipn, zsz, unit_pdf, upages, usz, unit_pdf)
pb = ('<div class="pbtns"><a class="pbtn" href="game.html"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="11" rx="3"/><path d="M8 10v5M5.5 12.5h5"/><circle cx="15.5" cy="11.5" r=".6"/><circle cx="17.5" cy="13.5" r=".6"/></svg><span>Quiz games<small>one per lesson</small></span></a>'
      '<a class="pbtn" href="caught-by-their-data.html"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#4F46E5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg><span>Case files<small>8 real cases</small></span></a></div>')
body = '''<div style="max-width:none;margin:0 auto;padding:24px clamp(16px,3vw,56px) 0;">
  <div class="breadcrumb"><a href="../../index.html">CS Home</a><span class="sep">/</span><a href="../../ist/index.html">Intro to Software Technology</a><span class="sep">/</span>Unit 1: Digital Footprint</div>
</div>

  <div class="lesson-layout">
    <aside class="lesson-sidebar" id="lesson-sidebar-root"></aside>

    <article class="lesson-content">
      <h1>Unit 1 &mdash; Digital Footprint</h1>
      <p class="hint">Digital citizenship, online privacy and security: the CIA triad, OSINT, your legal rights, what your phone gives away, passwords, tracking, copyright, hacking ethics and the four locks on every website. Every lesson has a study guide, notes, a walkthrough, an assignment and a quiz game. Sign in with your school Google account to do the walkthroughs and assignments.</p>

''' + pb + sg + '''
      <h2>Lessons</h2>
      <p class="hint">Each lesson has its study guide, class page, notes, walkthrough, assignment and quiz game. The walkthrough makes you go through the notes, and you need 100% on it to open the assignment. They open when your teacher opens them.</p>
      <div class="lpgrid">''' + cards + '''</div>

      <h2>Review</h2><a class="resource-link" href="unit-1-practice-test.html">&#9989; Unit 1 Practice Test (60 questions, lessons 1.1&ndash;1.9)</a><br><a class="resource-link" href="unit-1-test.html">&#128221; Unit 1 Test</a><br><a class="resource-link" href="study-guide.html">&#128214; Unit 1 Study Guide, the web version</a><br><a class="resource-link" href="unit-1-study-guide.html">&#128203; Original Unit 1 study guide page</a>
    </article>
  </div>

<footer class="site-footer">
  Social Circle High School &middot; Computer Science &middot; questions? see Mr. Norman
</footer>

<script src="../../assets/nav.js"></script>
<script>renderHeader();</script>
<script>
/* walkthrough and assignment rows are links only when the teacher has opened that lab (the list lives on the server: ist/lab/teacher.html); until then they show "opens soon" */
(function () {
  var rows = [].slice.call(document.querySelectorAll(".lprow.lab"));
  function closeRow(a) { a.removeAttribute("href"); a.classList.add("off"); a.querySelector(".st").textContent = "opens soon"; }
  rows.forEach(function (a) { a.setAttribute("data-href", a.getAttribute("href")); closeRow(a); });
  fetch("/api/istlab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "open" }) }).then(function (r) { return r.json(); }).then(function (d) {
    var open = (d && d.open) || [];
    rows.forEach(function (a) { if (open.indexOf(a.getAttribute("data-lab")) > -1) { a.setAttribute("href", a.getAttribute("data-href")); a.classList.remove("off"); a.querySelector(".st").textContent = "auto-scored"; } });
  }).catch(function () {});
})();
</script>
</body>
</html>
'''
open(os.path.join(ROOT, "ist", "unit-1", "index.html"), "w", encoding="utf-8").write(head + body)
print("wrote ist/unit-1/index.html")
