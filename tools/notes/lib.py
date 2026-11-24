"""Notes page generator for the AP CSP notes (Units 10, 11 and 16).
Every page gets the same look as the Unit 8 notes pages (dark theme, pill nav, hero, numbered parts, tables, figures,
click-through steppers, "Try it" widgets) plus a "Check yourself" quiz, and an "On the AP exam" list.
Content lives in tools/notes/unit10.py and tools/notes/bigidea5.py; run `python3 tools/notes/build.py` to write the pages."""
import html as _h, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
BASE_CSS = open(os.path.join(HERE, "base.css"), encoding="utf-8").read()

EXTRA_CSS = """
.qz{margin:10px 0 30px;background:#0B0F16;border:1px solid var(--rule);border-radius:10px;padding:18px 18px 8px}
.qz>h4{margin:0 0 4px;font:700 13px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--acc-ink)}
.qz>.qsub{margin:0 0 14px;font-size:14.5px;color:var(--ink-soft)}
.qz .q{border-top:1px solid var(--rule);padding:14px 0 12px}
.qz .qs{margin:0 0 10px;font-weight:600;color:#fff}
.qz .qs code{font-weight:500}
.qz .opts{display:grid;gap:8px}
.qz .opts button{text-align:left;font:500 15px Manrope,system-ui,sans-serif;color:var(--ink);background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:10px 14px;cursor:pointer;line-height:1.45}
.qz .opts button:hover:not(:disabled){border-color:#A3E635}
.qz .opts button.right{border-color:#34D399;background:rgba(52,211,153,.16)}
.qz .opts button.wrong{border-color:var(--bad);background:var(--bad-tint)}
.qz .why{margin:10px 0 0;padding:10px 14px;border-left:4px solid var(--acc);background:var(--acc-tint);border-radius:0 6px 6px 0;font-size:14.5px;color:#F1FAD9;display:none}
.qz .why.on{display:block}
.qz .score{margin:6px 0 10px;font:700 14px 'JetBrains Mono',monospace;color:var(--acc-ink)}
.asgw{background:linear-gradient(120deg,var(--acc-tint),var(--card) 65%);border:2px solid var(--acc);border-radius:10px;padding:20px 24px;margin:26px 0 6px}
.asgw .lb{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc-ink)}
.asgw h3{font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;color:#fff;margin:4px 0 12px}
.asgw .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}
.asgw .card{background:rgba(0,0,0,.25);border:1px solid var(--rule);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.asgw .card b{color:#fff;font-size:16px}.asgw .card p{margin:0;font-size:14.5px;color:#C4CDD8}
.asgw .card .n{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--acc)}
.asgw a.go{display:inline-block;align-self:flex-start;background:var(--acc);color:#0B0E14;font-weight:800;font-size:15px;text-decoration:none;border-radius:8px;padding:10px 16px}
.asgw a.go:hover{filter:brightness(1.1)}
.wg .bar{height:22px;border-radius:6px;background:#1B2330;border:1px solid var(--rule);overflow:hidden;margin:6px 0}
.wg .bar>i{display:block;height:100%;background:#A3E635;transition:width .2s}
.wg .bar>i.hot{background:#F87171}
.wg label{font-size:14.5px;color:var(--ink)}
.wg .chip{display:inline-block;border:1px solid var(--rule);border-radius:100px;padding:4px 12px;margin:3px 4px 3px 0;font:600 13px 'JetBrains Mono',monospace;background:var(--card)}
.wg .chip.on{background:#A3E635;color:#0B0E14;border-color:#A3E635}
.wg .chip.bad{background:var(--bad-tint);color:var(--bad-ink);border-color:var(--bad)}
.wg .seg{display:inline-block;padding:6px 10px;margin:2px;border-radius:6px;font:600 15px 'JetBrains Mono',monospace;border:1px solid var(--rule);background:var(--card)}
.wg .grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.mono{font-family:'JetBrains Mono',monospace}
"""

SHARED_JS = r"""
(function(){
  document.querySelectorAll(".stp").forEach(function(r){
    var f=r.querySelectorAll(".frame"),c=r.querySelector(".cnt"),i=0;
    function s(){f.forEach(function(x,k){x.classList.toggle("on",k===i)});c.textContent="Step "+(i+1)+" of "+f.length}
    r.querySelectorAll("button").forEach(function(b){b.onclick=function(){i=Math.max(0,Math.min(f.length-1,i+Number(b.dataset.d)));s()}});s();
  });
  document.querySelectorAll(".qz").forEach(function(z){
    var qs=z.querySelectorAll(".q"),got=0,done=0,sc=z.querySelector(".score");
    qs.forEach(function(q){
      var a=Number(q.dataset.a),bs=q.querySelectorAll("button"),why=q.querySelector(".why");
      bs.forEach(function(b,i){b.onclick=function(){
        if(q.dataset.done)return;q.dataset.done=1;done++;
        bs.forEach(function(x,k){x.disabled=true;if(k===a)x.classList.add("right")});
        if(i===a)got++;else b.classList.add("wrong");
        why.classList.add("on");
        sc.textContent=got+" of "+qs.length+" right"+(done<qs.length?" so far":(got===qs.length?" - perfect!":""));
      }});
    });
  });
})();
"""

MARKERS = "".join(
    '<marker id="m%s" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#%s"/></marker>' % (c, c)
    for c in ["EAEFF6", "8B9AAE", "60A5FA", "34D399", "FBBF24", "F472B6", "C084FC", "FB923C", "F87171", "2DD4BF", "A3E635"])
SVG_STYLE = ".cd{font:600 20px 'JetBrains Mono',monospace}.ix{font:600 15px 'JetBrains Mono',monospace}.cp{font:500 15px Manrope,system-ui,sans-serif;fill:#D5DDE8}.tt{font:700 16px 'JetBrains Mono',monospace}"

COL = dict(green="#A3E635", blue="#60A5FA", teal="#34D399", yellow="#FBBF24", pink="#F472B6", purple="#C084FC", orange="#FB923C", red="#F87171", gray="#8B9AAE", white="#EAEFF6")


def esc(t):
    return _h.escape(str(t), quote=True)


# ------------------------------------------------------------------ svg helpers
def svg(w, h, body, label="diagram"):
    return ('<svg class="diagram" viewBox="0 0 %d %d" role="img" aria-label="%s" xmlns="http://www.w3.org/2000/svg" style="width:100%%;height:auto;display:block;max-width:%dpx;margin:0 auto">'
            '<defs>%s</defs><style>%s</style>%s</svg>' % (w, h, esc(label), w, MARKERS, SVG_STYLE, body))


def sbox(x, y, w, h, title, sub="", color="teal", tcls="tt", fill="#151A24"):
    c = COL.get(color, color)
    out = '<rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="%s" stroke="%s" stroke-width="2.4"/>' % (x, y, w, h, fill, c)
    if sub:
        out += '<text x="%s" y="%s" class="%s" text-anchor="middle" fill="%s">%s</text>' % (x + w / 2, y + h / 2 - 4, tcls, c, esc(title))
        out += '<text x="%s" y="%s" class="cp" text-anchor="middle" style="font-size:13.5px">%s</text>' % (x + w / 2, y + h / 2 + 18, esc(sub))
    else:
        out += '<text x="%s" y="%s" class="%s" text-anchor="middle" fill="%s">%s</text>' % (x + w / 2, y + h / 2 + 5, tcls, c, esc(title))
    return out


def sarrow(x1, y1, x2, y2, color="gray", label="", dash=False, lx=None, ly=None):
    c = COL.get(color, color)
    mid = c.lstrip("#")
    out = '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="2.6" %s marker-end="url(#m%s)"/>' % (x1, y1, x2, y2, c, 'stroke-dasharray="6 5"' if dash else "", mid)
    if label:
        out += '<text x="%s" y="%s" class="cp" text-anchor="middle" style="font-size:13px">%s</text>' % (lx if lx is not None else (x1 + x2) / 2, ly if ly is not None else (y1 + y2) / 2 - 8, esc(label))
    return out


def sline(x1, y1, x2, y2, color="gray", w=2.6, dash=False):
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" %s/>' % (x1, y1, x2, y2, COL.get(color, color), w, 'stroke-dasharray="6 5"' if dash else "")


def stext(x, y, text, color="white", size=14, anchor="middle", cls="cp", weight=None):
    st = "font-size:%spx" % size + (";font-weight:%s" % weight if weight else "")
    return '<text x="%s" y="%s" class="%s" text-anchor="%s" style="%s" fill="%s">%s</text>' % (x, y, cls, anchor, st, COL.get(color, color), esc(text))


def scircle(x, y, r, color="teal", label="", fill="#151A24"):
    c = COL.get(color, color)
    out = '<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="2.4"/>' % (x, y, r, fill, c)
    if label:
        out += '<text x="%s" y="%s" class="tt" text-anchor="middle" fill="%s" style="font-size:13px">%s</text>' % (x, y + 5, c, esc(label))
    return out


# ------------------------------------------------------------------ html components
def tbl(headers, rows, bad=None):
    th = "".join("<th>%s</th>" % h for h in headers)
    trs = ""
    for r in rows:
        trs += "<tr>" + "".join("<td%s>%s</td>" % (' class="bad"' if bad is not None and i == bad else "", c) for i, c in enumerate(r)) + "</tr>"
    return '<div class="tblwrap"><div class="tblscroll"><table class="cmp"><tr>%s</tr>%s</table></div></div>' % (th, trs)


def ex(t): return '<div class="example">%s</div>' % t
def warn(t): return '<div class="warn">%s</div>' % t
def hint(t): return '<div class="hint-panel">%s</div>' % t
def callout(t, sub=""): return '<div class="callout">%s%s</div>' % (t, "<span>%s</span>" % sub if sub else "")
def code(t): return '<div class="code">%s</div>' % esc(t)
def chk(items): return '<ul class="chk">%s</ul>' % "".join("<li>%s</li>" % i for i in items)
def two(a, b): return '<div class="two">%s%s</div>' % (a, b)
def box(title, body, kind=""): return '<div class="box %s"><h3>%s</h3><p>%s</p></div>' % (kind, title, body)


def cards(items):
    out = '<div class="cards">'
    for n, t, b in items:
        out += '<div class="cardx"><div class="num">%s</div><h4>%s</h4><p>%s</p></div>' % (n, t, b)
    return out + "</div>"


def fig(svg_html, caption):
    return '<figure class="fig">%s<figcaption>%s</figcaption></figure>' % (svg_html, caption)


def stepper(sid, title, frames):
    """frames = [(svg_html, caption), ...]"""
    out = '<div class="stp" id="%s"><p style="margin:0 0 8px;text-align:center;font-weight:700">%s</p>' % (sid, title)
    for i, (s, cap) in enumerate(frames):
        out += '<div class="frame%s">%s<div class="say">%s</div></div>' % (" on" if i == 0 else "", s, cap)
    out += '<div class="ctl"><button data-d="-1">&larr; Back</button><span class="cnt"></span><button data-d="1">Next step &rarr;</button></div></div>'
    return out


def quiz(qid, questions, title="Check yourself", sub="Answer each one. You see why right away, so read the explanation even when you are right."):
    """questions = [(stem, [choices], correct_index, why)]"""
    out = '<div class="qz" id="%s"><h4>%s</h4><p class="qsub">%s</p>' % (qid, title, sub)
    for stem, choices, a, why in questions:
        out += '<div class="q" data-a="%d"><p class="qs">%s</p><div class="opts">%s</div><div class="why">%s</div></div>' % (
            a, stem, "".join("<button>%s</button>" % c for c in choices), why)
    return out + '<div class="score"></div></div>'


def widget(wid, title, sub, inner, js):
    """A Try-it widget. js runs with `root` = the widget element."""
    return ('<div class="wg" id="%s"><h4>%s</h4><p class="wsub">%s</p>%s</div><script>(function(root){%s})(document.getElementById("%s"));</script>'
            % (wid, title, sub, inner, js, wid))


def part(n, title, lede, *body):
    return ('<section class="part"><div class="wrap"><div class="part-head"><div class="part-tag">%02d</div><h2>%s</h2></div>%s%s</div></section>'
            % (n, title, ('<p class="lede">%s</p>' % lede) if lede else "", "".join(body)))


def exam(items, lede="These are the ideas the exam asks about. Be ready to explain each one in your own words."):
    return ('<section class="part"><div class="wrap"><div class="part-head"><div class="part-tag">AP</div><h2>On the AP Exam</h2></div>'
            '<p class="lede">%s</p>%s</div></section>' % (lede, chk(items)))


# ------------------------------------------------------------------ page shell
def panel(unit_label, concept, walk=None, asg=None, game=None, walk_text=None):
    """The 'do this in the Python editor' panel. walk/asg/game are slot ids (or None)."""
    cards_html = ""
    if walk:
        cards_html += ('<div class="card"><span class="n">STEP 1 &middot; THE DOOR</span><b>Walkthrough</b><p>%s</p><a class="go" href="../python/editor.html?a=%s">Open the walkthrough</a></div>'
                       % (walk_text or "Walk through these notes in the Python Editor. Type the notes as comments and run the small programs. Get <b>every box and every question right (100%)</b>.", walk))
    if asg:
        cards_html += ('<div class="card"><span class="n">STEP 2 &middot; GRADED</span><b>Assignment</b><p>Use what you learned to build it yourself. <b>This is the one your teacher grades.</b></p><a class="go" href="../python/editor.html?a=%s">Open the assignment</a></div>' % asg)
    if game:
        cards_html += ('<div class="card"><span class="n">BONUS</span><b>Game</b><p>Play for extra practice. It never blocks the next lesson.</p><a class="go" href="../python/editor.html?a=%s">Play the game</a></div>' % game)
    if not cards_html:
        return ""
    return '<div class="asgw"><div class="lb">Your work &middot; %s</div><h3>%s</h3><div class="two">%s</div></div>' % (unit_label, concept, cards_html)


def page(slug, title, subject, deck, unit_dir, unit_label, lessons, parts_html, final_h, final_p, prev=None, nxt=None, walk=None, asg=None, game=None, concept=None, walk_text=None):
    """lessons = [(file, label), ...] for the pill nav. prev / nxt = (file, label) or None."""
    nav = '<a href="%s/index.html">&larr; %s</a>' % (unit_dir, unit_label.split(":")[0] if ":" in unit_label else unit_label)
    for f, l in lessons:
        nav += '<a href="%s"%s>%s</a>' % (f, ' class="current"' if f == slug + ".html" else "", l)
    pan = panel(unit_label.split(":")[0], concept or title, walk, asg, game, walk_text)
    back = ""
    if nxt: back += '<a class="back" href="%s">%s &rarr;</a>' % (nxt[0], nxt[1])
    if prev: back += '<a class="back" href="%s">&larr; %s</a>' % (prev[0], prev[1])
    back += '<a class="back" href="%s/index.html">&larr; %s</a>' % (unit_dir, unit_label.split(":")[0])
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s | AP CSP Notes</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="../assets/logo.png">
<style>
%(css)s
</style>
</head>
<body>

<nav class="pillnav">
  %(nav)s
</nav>

<header class="hero">
  <div class="wrap">
    <div class="brief-no">AP CSP NOTES &nbsp;/&nbsp; SUBJECT: %(subject)s</div>
    <h1>%(title)s</h1>
    <p class="deck">%(deck)s</p>
  </div>
</header>
<div class="wrap">%(pan)s</div>

%(parts)s

<footer class="final">
  <div class="wrap">
    <h2>%(fh)s</h2>
    <p>%(fp)s</p>
    <div style="margin-bottom:10px">%(pan2)s</div>
    %(back)s
    <p class="sig">AP CSP Notes &nbsp;/&nbsp; %(title)s &nbsp;/&nbsp; end of file</p>
  </div>
</footer>

<script>%(js)s</script>
</body>
</html>
""" % dict(title=title, css=BASE_CSS + EXTRA_CSS, nav=nav, subject=subject, deck=deck, pan=pan, pan2="", parts=parts_html, fh=final_h, fp=final_p, back=back, js=SHARED_JS)


def unit_index(unit_title, unit_no, intro, lessons, extra=""):
    """lessons = [(label, file, sub), ...] ; writes the unit overview in the same layout as apcsp/unit-8/index.html"""
    ul = ",\n".join('  { title: %s, file: %s, sub: %s }' % (json.dumps(l), json.dumps(f), json.dumps(s)) for l, f, s in lessons)
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%(ut)s | AP Computer Science Principles</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
<link rel="stylesheet" href="../../assets/style.css">
<link rel="icon" href="../../assets/logo.png">
</head>
<body>

<div id="site-header-root"></div>

<div style="max-width:1200px;margin:0 auto;padding:24px 20px 0;">
  <div class="breadcrumb"><a href="../../index.html">CS Home</a><span class="sep">/</span><a href="../../apcsp/index.html">AP Computer Science Principles</a><span class="sep">/</span>%(ut)s</div>
</div>

  <div class="lesson-layout">
    <aside class="lesson-sidebar" id="lesson-sidebar-root"></aside>

    <article class="lesson-content">
      <h1>Unit %(n)s &mdash; %(name)s</h1>
      %(intro)s
      %(extra)s
      <div class="unit-grid" id="lesson-grid-root"></div>

      <div id="prev-next-root" class="prev-next-nav"></div>
    </article>
  </div>

<footer class="site-footer">
  Social Circle High School &middot; Computer Science &middot; questions? see Mr. Norman
</footer>

<script src="../../assets/nav.js"></script>
<script>
renderHeader();

const UNIT_TITLE = %(utj)s;
const UNIT_BASE = "../";
const UNIT_LESSONS = [
%(ul)s
];
const CURRENT_FILE = "";

const lessonGrid = document.getElementById("lesson-grid-root");
if (lessonGrid) {
  lessonGrid.innerHTML = UNIT_LESSONS.map(l => {
    return `<a class="unit-card" href="${UNIT_BASE}${l.file}"><h3>${l.title}</h3><p style="margin:6px 0 0;font-size:14px;opacity:.85">${l.sub}</p></a>`;
  }).join("");
}
</script>
<script src="../../assets/course-nav.js"></script>
</body>
</html>
""" % dict(ut=unit_title, n=unit_no, name=unit_title.split(": ", 1)[-1], intro=intro, extra=extra, utj=json.dumps(unit_title), ul=ul)
