import json, random, html, sys
import importlib
CFG = {"8": dict(mod="bank", test="/Users/randynorman/bank-points/ist/unit-3/unit-8-practice-test.html", n=8, unit="Unit 8", back="Unit 8: Computing Basics", lessons="8.1 to 8.5"),
       "9": dict(mod="bank9", test="/Users/randynorman/bank-points/ist/unit-4/unit-9-practice-test.html", n=10, unit="Unit 9", back="Unit 9: Operating Systems and Software", lessons="9.1 to 9.4")}
C = CFG[sys.argv[1] if len(sys.argv) > 1 else "8"]
bank = importlib.import_module(C["mod"]); TESTN = C["n"]
OUT_GAME = "/Users/randynorman/bank-points/ist/unit-6/game-data/"
esc = lambda s: html.escape(s, quote=False)
def shuffled(q, rnd, want_pos):
    opts = [q["c"]] + q["w"]
    others = opts[1:]; rnd.shuffle(others)
    opts = others[:want_pos] + [q["c"]] + others[want_pos:]
    return opts, want_pos
games = {}; tests = []
for lid, (num, title, qs) in bank.B.items():
    rnd = random.Random(8000 + lid)
    game, test = qs[:-TESTN], qs[-TESTN:]
    items = []
    for i, q in enumerate(qs):
        pos = (i * 3 + lid) % 4   # spread the correct answers evenly over A-D
        opts, a = shuffled(q, rnd, pos)
        items.append(dict(s=esc(q["s"]), c=None, o=[esc(o) for o in opts], a=a, e=esc(q["e"]), t=q["t"]))
    games[lid] = items[:-TESTN]
    tests += [(num, title, it) for it in items[-TESTN:]]
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
<title>__UNIT__ Practice Test | Intro to Software Technology</title>
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
  <div class="breadcrumb"><a href="../../index.html">CS Home</a><span class="sep">/</span><a href="../../ist/index.html">Intro to Software Technology</a><span class="sep">/</span><a href="index.html">__BACK__</a><span class="sep">/</span>Practice Test</div>
  <h1>__UNIT__ Practice Test</h1>
  <p class="hint">__N__ questions covering lessons __LESSONS__. This is practice only and does not change your grade. Pick an answer for every question, then check your answers.</p>
  <div id="qs">
__ROWS__
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
'''
page = page.replace('__UNIT__', C['unit']).replace('__BACK__', C['back']).replace('__LESSONS__', C['lessons']).replace('__N__', str(n)).replace('__ROWS__', "\n".join(rows))
open(C["test"], "w").write(page)
print("games", {k: len(v) for k, v in games.items()}, "test questions", n)
