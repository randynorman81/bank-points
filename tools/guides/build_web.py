"""Builds the online study guides: ist/unit-6/study-guide.html (Unit 3) and ist/unit-7/study-guide.html (Unit 4).
They hold the same lessons as the printed guides (same text, examples, traces, mistakes, guided build, paper exercises, checklist and practice questions),
and add what a screen can do: live examples the reader can edit, a line-by-line trace stepper, questions that mark themselves, a checklist that remembers, quick links.
usage: ./.venv/bin/python build_web.py"""
import os, sys, re, json, html as _html, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
import gl, ist_lib
from units import ist_extra
gl.LANG = "html"
import units.ist03 as U3, units.ist03p2 as U4
CONF = {3: dict(unit=U3.UNIT, out="ist/unit-6/study-guide.html", folder="unit-6", other=("../unit-7/study-guide.html", "Unit 4: Advanced HTML study guide"), title="Unit 3 Study Guide", sub="Web Design: HTML",
                 pdf="IST-Unit-03-Web-Design-HTML-Study-Guide.pdf", notes=["html-intro-notes", "style-attribute-notes", "text-size-align-notes", "editing-tags-notes", "google-fonts-notes", "borders-notes", "images-notes", "emojis-symbols-notes", "links-notes", "lists-notes"],
                 lab=["6.1", "6.2", "6.20", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6", "6.5"], game=list(range(1, 11)), home="index.html"),
        4: dict(unit=U4.UNIT, out="ist/unit-7/study-guide.html", folder="unit-7", other=("../unit-6/study-guide.html", "Unit 3: Web Design study guide"), title="Unit 4 Study Guide", sub="Advanced HTML",
                 pdf="IST-Unit-04-Advanced-HTML-Study-Guide.pdf", notes=["box-model-notes", "colors-notes", "display-notes", "div-tag-notes", "tables-notes"],
                 lab=["7.1", "7.2", "7.3", "7.4", "7.5"], game=list(range(11, 16)), home="index.html")}

def lesson_pdf(cid):
    n = cid.split("."); f = sorted(glob.glob(os.path.join(ROOT, "ist", "downloads", "lessons", "IST-Lesson-%02d-%02d-*.pdf" % (int(n[0]), int(n[1])))))
    return os.path.basename(f[0]) if f else None

def web_css(unit):
    css = gl.css_for(unit)
    css = re.sub(r"@page[^{]*\{(?:[^{}]|\{[^{}]*\})*\}", "", css)           # no paper rules on a screen
    return css

PAGE_CSS = """
body { background: #EEF2F7; margin: 0; font-size: 10.6pt; }
.topbar { position: sticky; top: 0; z-index: 20; background: #0F172A; color: #fff; padding: 8px 14px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; box-shadow: 0 2px 10px #0004; }
.topbar a { color: #E2E8F0; text-decoration: none; font: 700 13px Manrope, sans-serif; padding: 5px 11px; border-radius: 999px; background: #1E293B; }
.topbar a:hover, .topbar a.on { background: __ACCENT__; color: #fff; }
.topbar .t { font: 800 13px Manrope, sans-serif; margin-right: 8px; letter-spacing: .04em; }
.topbar .sp { flex: 1; }
.topbar button { font: 700 13px Manrope, sans-serif; border: 0; border-radius: 8px; padding: 6px 12px; background: #334155; color: #fff; cursor: pointer; }
.book { max-width: 880px; margin: 0 auto; padding: 18px 16px 60px; }
.hero { background: linear-gradient(135deg, #0B0F1A, __ACCENT_DK__); color: #fff; border-radius: 16px; padding: 28px 26px; margin: 8px 0 18px; }
.hero h1 { color: #fff; font-size: 30pt; margin: 0 0 6px; } .hero p { margin: 0; color: #CBD5E1; font-size: 12pt; }
.hero .how { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; } .hero .how span { background: #FFFFFF22; border-radius: 999px; padding: 4px 11px; font: 700 11px Manrope; }
section.lesson { background: #fff; border-radius: 14px; padding: 22px 26px 26px; margin: 0 0 22px; box-shadow: 0 1px 8px #0F172A14; scroll-margin-top: 64px; }
.lesson .chapter { break-before: auto; }
.lesson .chead { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
.links { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 14px; }
.links a { font: 700 12.5px Manrope, sans-serif; text-decoration: none; padding: 6px 12px; border-radius: 8px; background: __ACCENT_TINT__; color: __ACCENT_DK__; border: 1px solid #00000014; }
.links a:hover { background: __ACCENT__; color: #fff; }
.hx { break-inside: auto; }
.live { border: 1.2pt solid #CBD5E1; border-radius: 9px; overflow: hidden; margin: 8px 0 14px; background: #fff; }
.live .bar { background: #F1F5F9; border-bottom: 1px solid #CBD5E1; padding: 5px 10px; display: flex; gap: 8px; align-items: center; font: 700 11px Manrope; color: #64748B; letter-spacing: .08em; }
.live .bar button { margin-left: auto; font: 700 11px Manrope; border: 1px solid #CBD5E1; background: #fff; border-radius: 6px; padding: 3px 9px; cursor: pointer; color: #334155; }
.live .bar button + button { margin-left: 4px; }
.live .body { display: grid; grid-template-columns: 1fr 1fr; } @media (max-width: 720px) { .live .body { grid-template-columns: 1fr; } }
.live textarea { width: 100%; min-height: 190px; border: 0; border-right: 1px solid #E2E8F0; padding: 10px 12px; font: 500 12px/1.55 "JetBrains Mono", monospace; resize: vertical; background: #0B1220; color: #E8ECF3; box-sizing: border-box; tab-size: 2; }
.live iframe { width: 100%; min-height: 190px; border: 0; background: #fff; }
.live textarea[hidden] { display: none; } .live .body.one { grid-template-columns: 1fr; }
.stepper { display: flex; gap: 8px; align-items: center; margin: 4px 0 8px; flex-wrap: wrap; font: 700 12px Manrope, sans-serif; }
.stepper button { font: 700 12px Manrope; border: 1px solid #CBD5E1; background: #fff; border-radius: 7px; padding: 5px 11px; cursor: pointer; }
.stepper button.pri { background: __ACCENT__; border-color: __ACCENT__; color: #fff; }
.stepper .msg { color: #475569; }
.trace.stepping tr.hid { display: none; } .trace.stepping .tcode .cur { background: __ACCENT_TINT__; outline: 1px solid __ACCENT__; border-radius: 3px; }
.q { border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px 14px; margin: 0 0 10px; background: #fff; }
.q .qn { display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: __ACCENT_DK__; color: #fff; align-items: center; justify-content: center; font: 800 11px Manrope; margin-right: 8px; }
.q .qs { font-weight: 600; margin-bottom: 6px; } .q pre.code { margin: 6px 0 8px; font-size: 11px; }
.q label { display: flex; gap: 9px; align-items: flex-start; padding: 6px 9px; border: 1px solid #E5E7EB; border-radius: 8px; margin: 4px 0; cursor: pointer; }
.q label:hover { background: #F8FAFC; } .q label.ok { background: #DCFCE7; border-color: #16A34A; } .q label.no { background: #FEE2E2; border-color: #DC2626; }
.q .why { display: none; margin-top: 7px; padding: 8px 10px; border-radius: 8px; background: #F1F5F9; font-size: 10pt; } .q.done .why { display: block; }
.score { position: sticky; bottom: 0; background: #fff; border-top: 2px solid __ACCENT__; padding: 8px 12px; border-radius: 10px 10px 0 0; font: 700 13px Manrope; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; box-shadow: 0 -4px 12px #0001; }
.score button { font: 700 12px Manrope; border: 1px solid #CBD5E1; background: #fff; border-radius: 7px; padding: 4px 10px; cursor: pointer; }
ul.chk.tick { list-style: none; padding-left: 0; } ul.chk.tick li { padding: 3px 0; } ul.chk.tick label { cursor: pointer; display: flex; gap: 9px; align-items: flex-start; } ul.chk.tick input { margin-top: 4px; transform: scale(1.25); }
details.ans { margin: 6px 0 12px; } details.ans summary { cursor: pointer; font: 700 12px Manrope; color: __ACCENT_DK__; } details.ans pre { background: #0B1220; color: #E8ECF3; padding: 9px 12px; border-radius: 7px; font-size: 11px; overflow-x: auto; }
.glossary { columns: 2 320px; column-gap: 24px; } .glossary .g { break-inside: avoid; }
.srch { width: 100%; box-sizing: border-box; font: 600 14px Manrope; padding: 9px 12px; border-radius: 8px; border: 1px solid #CBD5E1; margin: 0 0 10px; }
.backtop { position: fixed; right: 16px; bottom: 70px; background: __ACCENT_DK__; color: #fff; border: 0; border-radius: 999px; padding: 9px 13px; font: 800 12px Manrope; cursor: pointer; box-shadow: 0 2px 8px #0005; }
@media print { .topbar, .stepper, .live .bar, .score, .backtop, .links { display: none !important; } body { background: #fff; } section.lesson { box-shadow: none; break-before: page; } .live textarea { display: none; } .live .body { grid-template-columns: 1fr; } }
"""

def render_lesson(cfg, ch, idx, ctx):
    unit = cfg["unit"]; cid = ch["id"]
    html, titles, extras = gl.build_html(unit, only=cid)
    # the chapter body of the print build is exactly what we want; take it and wire it
    a = html.index('<section class="chapter">'); b = html.index("</section>", a)
    chap = html[a:b + 10]
    chap = re.sub(r'<span class="mk"[^>]*>ZZC[\w.]+ZZ</span>', "", chap)
    chap = chap.replace('<section class="chapter">', '<div class="chapter">', 1)
    chap = chap[:chap.rindex("</section>")] + "</div>"
    # the printed answers-at-the-back questions become interactive ones: remove the print block and render our own
    chap = re.sub(r'<div class="practice">.*?</div></div>\s*(?=<div class="practice">|$|</div>)', "", chap, flags=re.S) if False else chap
    chap = re.sub(r'<div class="practice">.*', "</div>", chap, flags=re.S) if '<div class="practice">' in chap else chap
    return chap, titles[0][1]

def questions_json(ch):
    out = []
    for q in ch.get("questions", []):
        out.append(dict(s=q["s"], o=q["o"], a=q["a"], e=q["e"], c=(q.get("c") or "")))
    return out

JS = r"""
(function () {
  function $(s, r) { return (r || document).querySelector(s); } function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  var UNIT = document.body.getAttribute("data-unit");
  /* ---- live, editable examples ---- */
  $$(".hx[data-page]").forEach(function (hx) {
    var page = hx.getAttribute("data-page"); var figs = $$("figure.fig", hx); var pic = figs[figs.length - 1];
    if (!pic || !/page this code makes/i.test(pic.textContent)) return;
    var box = document.createElement("div"); box.className = "live";
    box.innerHTML = '<div class="bar"><span>THE PAGE THIS CODE MAKES, LIVE</span><button type="button" class="ed">Edit the code</button><button type="button" class="rs" hidden>Reset</button></div><div class="body one"><textarea spellcheck="false" hidden></textarea><iframe sandbox="allow-same-origin" title="the page the code makes"></iframe></div>';
    var ta = $("textarea", box), fr = $("iframe", box), body = $(".body", box);
    function draw() { fr.srcdoc = ta.value; }
    ta.value = page; fr.srcdoc = page;
    fr.addEventListener("load", function () { try { var h = fr.contentDocument.documentElement.scrollHeight; fr.style.height = Math.min(Math.max(h + 4, 120), 520) + "px"; ta.style.height = fr.style.height; } catch (e) {} });
    $(".ed", box).onclick = function () { var on = ta.hidden; ta.hidden = !on; body.classList.toggle("one", !on); this.textContent = on ? "Hide the code" : "Edit the code"; $(".rs", box).hidden = !on; };
    $(".rs", box).onclick = function () { ta.value = page; draw(); };
    var t; ta.addEventListener("input", function () { clearTimeout(t); t = setTimeout(draw, 250); });
    pic.parentNode.replaceChild(box, pic);
  });
  /* ---- trace stepper ---- */
  $$(".trace").forEach(function (tr, n) {
    var rows = $$("table tr", tr).slice(1), lines = $$(".tcode > div", tr); if (rows.length < 2) return;
    var bar = document.createElement("div"); bar.className = "stepper"; bar.innerHTML = '<button type="button" class="pri go">Step through it</button><button type="button" class="nx" hidden>Next line &rarr;</button><button type="button" class="rst" hidden>Show all</button><span class="msg"></span>';
    tr.parentNode.insertBefore(bar, tr); var cur = -1, msg = $(".msg", bar);
    function show() { rows.forEach(function (r, i) { r.classList.toggle("hid", i > cur); }); lines.forEach(function (l, i) { l.classList.toggle("cur", i === cur); }); msg.textContent = cur < 0 ? "Predict what line 1 does, then click Next." : "Line " + (cur + 1) + " of " + rows.length + (cur === rows.length - 1 ? " (done)" : ""); $(".nx", bar).disabled = cur >= rows.length - 1; }
    $(".go", bar).onclick = function () { tr.classList.add("stepping"); cur = 0; this.hidden = true; $(".nx", bar).hidden = false; $(".rst", bar).hidden = false; show(); };
    $(".nx", bar).onclick = function () { if (cur < rows.length - 1) { cur++; show(); } };
    $(".rst", bar).onclick = function () { tr.classList.remove("stepping"); rows.forEach(function (r) { r.classList.remove("hid"); }); lines.forEach(function (l) { l.classList.remove("cur"); }); $(".go", bar).hidden = false; $(".nx", bar).hidden = true; this.hidden = true; msg.textContent = ""; };
  });
  /* ---- self-marking questions ---- */
  var Q = window.GUIDE_Q || {};
  Object.keys(Q).forEach(function (cid) {
    var host = document.getElementById("q-" + cid.replace(".", "-")); if (!host) return; var qs = Q[cid], saved = store("istguide:" + UNIT + ":" + cid) || {}, done = 0, right = 0;
    var sc = document.createElement("div"); sc.className = "score"; sc.innerHTML = '<span class="s"></span><button type="button">Start over</button>';
    function upd() { done = 0; right = 0; Object.keys(saved).forEach(function (k) { done++; if (saved[k].ok) right++; }); $(".s", sc).textContent = "Lesson " + cid + " questions: " + right + " right of " + done + " answered (" + qs.length + " in all)"; }
    qs.forEach(function (q, i) {
      var d = document.createElement("div"); d.className = "q"; var multi = q.a.length > 1;
      d.innerHTML = '<div class="qs"><span class="qn">' + (i + 1) + '</span>' + q.s + (multi ? ' <i>(pick ' + q.a.length + ')</i>' : '') + '</div>' + (q.c ? '<pre class="code"></pre>' : "") + q.o.map(function (o, k) { return '<label><input type="' + (multi ? "checkbox" : "radio") + '" name="q' + cid + i + '" value="' + k + '"><span>' + o + '</span></label>'; }).join("") + '<button type="button" class="chk" style="margin-top:6px;font:700 12px Manrope;border:1px solid #CBD5E1;background:#fff;border-radius:7px;padding:4px 11px;cursor:pointer">Check my answer</button><div class="why"></div>';
      if (q.c) $("pre", d).textContent = q.c;
      function mark(sel) { var ok = sel.slice().sort().join() === q.a.slice().sort().join(); $$("label", d).forEach(function (l, k) { l.classList.remove("ok", "no"); if (q.a.indexOf(k) > -1) l.classList.add("ok"); else if (sel.indexOf(k) > -1) l.classList.add("no"); }); $(".why", d).innerHTML = (ok ? "<b>Correct.</b> " : "<b>Not quite.</b> The answer is highlighted in green. ") + q.e; d.classList.add("done"); return ok; }
      $(".chk", d).onclick = function () { var sel = $$("input", d).filter(function (x) { return x.checked; }).map(function (x) { return +x.value; }); if (!sel.length) return; var ok = mark(sel); saved[i] = { ok: ok, sel: sel }; store("istguide:" + UNIT + ":" + cid, saved); upd(); };
      if (saved[i]) { saved[i].sel.forEach(function (k) { $$("input", d)[k].checked = true; }); mark(saved[i].sel); }
      host.appendChild(d);
    });
    $("button", sc).onclick = function () { saved = {}; store("istguide:" + UNIT + ":" + cid, saved); $$(".q", host).forEach(function (d) { d.classList.remove("done"); $$("label", d).forEach(function (l) { l.classList.remove("ok", "no"); }); $$("input", d).forEach(function (x) { x.checked = false; }); }); upd(); };
    host.appendChild(sc); upd();
  });
  /* ---- checklist that remembers ---- */
  $$("ul.chk.tick").forEach(function (ul) {
    var cid = ul.getAttribute("data-l"), saved = store("istguide:" + UNIT + ":chk:" + cid) || {};
    $$("li", ul).forEach(function (li, i) { var cb = $("input", li); cb.checked = !!saved[i]; cb.onchange = function () { saved[i] = cb.checked; store("istguide:" + UNIT + ":chk:" + cid, saved); }; });
  });
  /* ---- glossary search ---- */
  var gs = $("#gsearch"); if (gs) gs.oninput = function () { var v = gs.value.toLowerCase(); $$("#glossary .g").forEach(function (g) { g.style.display = g.textContent.toLowerCase().indexOf(v) > -1 ? "" : "none"; }); };
  /* ---- the top bar: highlight the lesson in view ---- */
  var chips = $$(".topbar a[data-l]"), secs = $$("section.lesson");
  function spy() { var y = window.scrollY + 120, cur = null; secs.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; }); chips.forEach(function (c) { c.classList.toggle("on", c.getAttribute("href") === "#" + cur); }); }
  window.addEventListener("scroll", spy); spy();
  var bt = $(".backtop"); if (bt) bt.onclick = function () { window.scrollTo({ top: 0, behavior: "smooth" }); };
  var pr = $("#printAll"); if (pr) pr.onclick = function () { window.print(); };
})();
"""

def build(n):
    cfg = CONF[n]; unit = cfg["unit"]; ctx = gl.Ctx(unit); sections = ""; chips = ""; qjson = {}; gloss = {}
    for idx, ch in enumerate(unit.chapters):
        cid = ch["id"]; chap, title = render_lesson(cfg, ch, idx, ctx)
        # the checklist becomes tickable
        def tick(m):
            items = re.findall(r"<li>(.*?)</li>", m.group(0), re.S)
            return '<ul class="chk tick" data-l="%s">%s</ul>' % (cid, "".join('<li><label><input type="checkbox"> <span>%s</span></label></li>' % i for i in items))
        chap = re.sub(r'<ul class="chk">.*?</ul>', tick, chap, count=1, flags=re.S) if "CHECKLIST" in chap else chap
        # the paper exercises get a reveal for their answers
        pap = ist_extra.parsons().get(ist_extra.PARSONS[cid]); ans = ""
        if pap:
            picks = [i for i in (1, 3, 5, 7, 8, 9) if i < len(pap["problems"])]
            ans = '<details class="ans"><summary>Show my answers to the paper exercises</summary>%s</details>' % "".join('<p><b>P%d.</b> %s</p><pre>%s</pre>' % (k, _html.escape(pap["problems"][i]["title"]), _html.escape("\n".join(pap["problems"][i]["sol"]))) for k, i in enumerate(picks, 1))
        chap = chap.replace("</div></div></div>", "</div></div>" + "", 0)
        li = cfg["lab"][idx]; nf = cfg["notes"][idx]; pdf = lesson_pdf(cid)
        links = '<div class="links">'
        links += '<a href="%s.html">Read the notes</a>' % nf
        links += '<a href="../unit-6/editor.html?lesson=%sw">Walkthrough</a><a href="../unit-6/editor.html?lesson=%sa">Assignment</a>' % (li, li)
        links += '<a href="../unit-6/game.html?l=%d">Quiz game</a><a href="../unit-6/%s?l=%s&amp;p=0">Parsons puzzles</a>' % (cfg["game"][idx], "practice.html" if n == 3 else "practice-2.html", ist_extra.PARSONS[cid])
        if pdf: links += '<a href="../downloads/lessons/%s" target="_blank" rel="noopener">Printable PDF for this lesson</a>' % pdf
        links += "</div>"
        head_end = chap.index('</p></div>', chap.index('class="chead"')) + 10                  # after the heading block
        qs = questions_json(ch); qjson[cid] = qs
        qblock = '<div class="sec t-watch" style="border-color:#99f6e4"><h3><span class="tag">CHECK YOURSELF</span>Practice questions</h3><p class="lede">Choose an answer, then click <b>Check my answer</b>. Your answers are saved on this device.</p><div id="q-%s"></div></div>' % cid.replace(".", "-")
        chap = chap[:head_end] + links + chap[head_end:] + ans + qblock
        sections += '<section class="lesson" id="L%s">%s</section>' % (cid.replace(".", "-"), chap)
        chips += '<a href="#L%s" data-l="1">%s</a>' % (cid.replace(".", "-"), cid)
        for w, d in ch.get("words", []): gloss[re.sub(r"[`*]", "", w)] = re.sub(r"[`*]", "", d)
    gl_html = "".join('<div class="g"><b>%s</b> %s</div>' % (_html.escape(k), _html.escape(v)) for k, v in sorted(gloss.items(), key=lambda kv: kv[0].lower()))
    pdf_unit = cfg["pdf"]; zipn = "IST-Unit-%d-Study-Guides.zip" % n
    css = web_css(unit).replace("__ACCENT__", unit.accent).replace("__ACCENT_DK__", unit.dk).replace("__ACCENT_TINT__", unit.tint) + PAGE_CSS.replace("__ACCENT_DK__", unit.dk).replace("__ACCENT_TINT__", unit.tint).replace("__ACCENT__", unit.accent)
    fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Fraunces:wght@600;700&family=JetBrains+Mono:wght@500;700&display=swap">'
    doc = ('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>%s | %s</title>%s<style>%s</style></head><body data-unit="%d">'
           '<div class="topbar"><span class="t">UNIT %d</span>%s<span class="sp"></span><a href="%s">Unit page</a><a href="%s">%s</a><a href="../downloads/units/%s" target="_blank" rel="noopener">PDF</a><button id="printAll" type="button">Print</button></div>'
           '<div class="book"><div class="hero"><h1>%s</h1><p>%s &middot; %d lessons. Everything in the printed study guide, plus examples you can edit, traces you can step through, and questions that mark themselves.</p>'
           '<div class="how"><span>Read a lesson</span><span>Edit the live examples</span><span>Step through the traces</span><span>Build it yourself</span><span>Check the questions</span></div></div>%s'
           '<section class="lesson" id="words"><h2 style="margin-bottom:8px">Glossary</h2><input id="gsearch" class="srch" placeholder="Search the words" aria-label="Search the words"><div class="glossary" id="glossary">%s</div></section>'
           '<p style="text-align:center;margin:18px 0"><a href="../downloads/units/%s" download>Download the whole printable guide (PDF)</a> &nbsp;|&nbsp; <a href="../downloads/%s" download>Download the unit ZIP (every lesson PDF)</a></p></div>'
           '<button class="backtop" type="button">Top</button><script>window.GUIDE_Q = %s;</script><script>%s</script></body></html>') % (
        cfg["title"], cfg["sub"], fonts, css, n, n, chips, cfg["home"], cfg["other"][0], cfg["other"][1], pdf_unit, cfg["title"], cfg["sub"], len(unit.chapters),
        sections, gl_html, pdf_unit, zipn, json.dumps(qjson, ensure_ascii=False).replace("</", "<\\/"), JS)
    doc = ist_lib.finalize(doc)
    # the print zoom belongs to the PDF only
    doc = re.sub(r' style="zoom:[0-9.]+;width:[0-9.]+%;margin-left:auto;margin-right:auto"', "", doc)
    path = os.path.join(ROOT, cfg["out"]); open(path, "w", encoding="utf-8").write(doc); print("wrote", cfg["out"], "%.0f KB" % (len(doc) / 1024))

if __name__ == "__main__":
    for n in ([int(a) for a in sys.argv[1:]] or [3, 4]): build(n)
