import json, random, html, sys
import bank
OUT_GAME = "/Users/randynorman/bank-points/ist/unit-6/game-data/"
OUT_TEST = "/Users/randynorman/bank-points/ist/unit-3/unit-8-practice-test.html"
esc = lambda s: html.escape(s, quote=False)
def shuffled(q, rnd, want_pos):
    opts = [q["c"]] + q["w"]
    others = opts[1:]; rnd.shuffle(others)
    opts = others[:want_pos] + [q["c"]] + others[want_pos:]
    return opts, want_pos
games = {}; tests = []
for lid, (num, title, qs) in bank.B.items():
    rnd = random.Random(8000 + lid)
    game, test = qs[:-8], qs[-8:]
    items = []
    for i, q in enumerate(qs):
        pos = (i * 3 + lid) % 4   # spread the correct answers evenly over A-D
        opts, a = shuffled(q, rnd, pos)
        items.append(dict(s=esc(q["s"]), c=None, o=[esc(o) for o in opts], a=a, e=esc(q["e"]), t=q["t"]))
    games[lid] = items[:-8]
    tests += [(num, title, it) for it in items[-8:]]
    open(OUT_GAME + "l%d.js" % lid, "w").write("window.IST_GAME = window.IST_GAME || {};\nIST_GAME[%d] = %s;\n" % (lid, json.dumps(games[lid], ensure_ascii=False)))
# practice test page: 5 questions from each lesson's test set (all 8 each = 40)
rows = []; n = 0; cur = None
for num, title, it in tests:
    if num != cur:
        rows.append('<h2>%s %s</h2>' % (num, esc(title))); cur = num
    n += 1
    opts = "".join('<label class="po"><input type="radio" name="q%d" value="%d"> <span>%s</span></label>' % (n, k, o) for k, o in enumerate(it["o"]))
    rows.append('<div class="pq" data-a="%d"><p class="ps"><b>%d.</b> %s</p>%s<div class="pe"></div></div>' % (it["a"], n, it["s"], opts))
    tests_json = None
page = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Unit 8 Practice Test | Intro to Software Technology</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Special+Elite&display=swap">
<link rel="stylesheet" href="../../assets/style.css">
<link rel="icon" href="../../assets/logo.png">
<style>
.pq{border:1px solid rgba(128,128,128,.4);border-radius:10px;padding:12px 14px;margin:12px 0}
.ps{margin:0 0 8px}
.po{display:block;padding:5px 8px;border-radius:6px;cursor:pointer}
.po:hover{background:rgba(128,128,128,.12)}
.po.ok{background:rgba(26,127,55,.25)}
.po.no{background:rgba(198,40,40,.25)}
.pe{display:none;margin-top:8px;font-size:14px;opacity:.85}
.pq.done .pe{display:block}
.psum{font-size:22px;font-weight:700;margin:16px 0}
</style>
</head>
<body>
<div id="site-header-root"></div>
<main>
  <div class="breadcrumb"><a href="../../index.html">CS Home</a><span class="sep">/</span><a href="../../ist/index.html">Intro to Software Technology</a><span class="sep">/</span><a href="index.html">Unit 8: Computing Basics</a><span class="sep">/</span>Practice Test</div>
  <h1>Unit 8 Practice Test</h1>
  <p class="hint">%d questions covering lessons 8.1 to 8.5. This is practice only and does not change your grade. Pick an answer for every question, then check your answers.</p>
  <div id="qs">
%s
  </div>
  <p><button class="btn" id="check" type="button">Check my answers</button> <button class="btn" id="again" type="button">Start over</button></p>
  <div class="psum" id="sum"></div>
</main>
<footer class="site-footer">Social Circle High School &middot; Computer Science &middot; questions? see Mr. Norman</footer>
<script src="../../assets/nav.js"></script>
<script>renderHeader();</script>
<script>
(function () {
  var qs = [].slice.call(document.querySelectorAll(".pq"));
  document.getElementById("check").onclick = function () {
    var right = 0, blank = 0;
    qs.forEach(function (q) {
      var a = Number(q.getAttribute("data-a")), picked = q.querySelector("input:checked");
      [].forEach.call(q.querySelectorAll(".po"), function (l, k) { l.classList.remove("ok", "no"); if (k === a) l.classList.add("ok"); });
      if (!picked) { blank++; } else if (Number(picked.value) === a) { right++; } else { picked.parentNode.classList.add("no"); }
      q.classList.add("done");
    });
    document.getElementById("sum").textContent = right + " of " + qs.length + " right" + (blank ? " (" + blank + " unanswered)" : "");
  };
  document.getElementById("again").onclick = function () {
    qs.forEach(function (q) { q.classList.remove("done"); [].forEach.call(q.querySelectorAll(".po"), function (l) { l.classList.remove("ok", "no"); l.querySelector("input").checked = false; }); });
    document.getElementById("sum").textContent = ""; window.scrollTo(0, 0);
  };
})();
</script>
</body>
</html>
''' % (n, "\n".join(rows))
open(OUT_TEST, "w").write(page)
print("games", {k: len(v) for k, v in games.items()}, "test questions", n)
