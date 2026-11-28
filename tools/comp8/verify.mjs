// Verifies the Unit 8 question banks, the games and the practice test in real Chrome (file:// pages).
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
import fs from "fs";
const ROOT = "/Users/randynorman/bank-points/ist/";
const U = process.argv[2] || "8";
const CF = { "8": { from: 28, to: 32, test: "unit-3/unit-8-practice-test.html", hub: "Unit 8: Computing Basics", last: "8.5", n: 40 }, "9": { from: 33, to: 36, test: "unit-4/unit-9-practice-test.html", hub: "Unit 9: Operating Systems and Software", last: "9.4", n: 40 } }[U];
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
// 1. structure of every game bank
const posCount = [0, 0, 0, 0], seen = new Set(); let longest = 0, total = 0;
for (let l = CF.from; l <= CF.to; l++) {
  global.window = {}; global.IST_GAME = undefined;
  const src = fs.readFileSync(ROOT + "unit-6/game-data/l" + l + ".js", "utf8"); new Function("window", src.replace(/IST_GAME\[/, "window.IST_GAME[").replace("window.IST_GAME = window.IST_GAME || {};", "window.IST_GAME = {};"))(global.window);
  const bank = global.window.IST_GAME[l];
  if (!bank || bank.length < 20) fail("lesson", l, "too few questions", bank && bank.length);
  const topics = {}; bank.forEach((q) => { topics[q.t] = (topics[q.t] || 0) + 1; });
  if (Object.keys(topics).length < 5) fail("lesson", l, "few topics", Object.keys(topics).length);
  bank.forEach((q, i) => { total++;
    if (q.o.length !== 4 || new Set(q.o).size !== 4) fail(l, i, "options not 4 distinct"); if (!(q.a >= 0 && q.a < 4)) fail(l, i, "bad answer index");
    if (!q.e || !q.s) fail(l, i, "missing text"); if (seen.has(q.s)) fail(l, i, "duplicate stem"); seen.add(q.s); posCount[q.a]++;
    const lens = q.o.map((o) => o.length); if (lens.every((x, k) => k === q.a || x < lens[q.a])) longest++;
    if (/<(?!\/?(b|code)\b)/.test(q.s + q.o.join("") + q.e)) fail(l, i, "stray tag");
  });
}
console.log("game questions:", total, "answer positions A-D:", posCount.join("/"), "correct is strictly the longest option:", Math.round(longest / total * 100) + "%");
if (Math.max(...posCount) - Math.min(...posCount) > 6) fail("answer positions uneven");
if (longest / total > 0.5) fail("correct answer is the longest too often");
// 2. play every game in Chrome
const b = await launch(9697, 1100, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
for (let l = CF.from; l <= CF.to; l++) {
  await b.send("Page.navigate", { url: "file://" + ROOT + "unit-6/game.html?l=" + l }); await b.sleep(900);
  for (let r = 0; r < 10; r++) {
    const st = await b.ev(`(function(){ var o=document.querySelectorAll('.opt'); if(!o.length) return null; o[cur.a].click(); return [document.querySelectorAll('.opt.ok').length, document.querySelectorAll('.opt.no').length]; })()`);
    if (!st) { fail("game", l, "round", r, "no options"); break; }
    if (st[0] !== 1 || st[1] !== 0) fail("game", l, r, JSON.stringify(st));
    await b.ev(`document.getElementById('nx').click()`); await b.sleep(30);
  }
  const end = await b.ev(`document.body.innerText.match(/(\\d+) \\/ 100/)`); if (!end || end[1] !== "100") fail("game", l, "score", end && end[0]);
  await b.send("Page.navigate", { url: "file://" + ROOT + "unit-6/game.html?l=" + l }); await b.sleep(700);
  let n = 0; while (n < 6) { const done = await b.ev(`(function(){ var o=document.querySelectorAll('.opt'); if(!o.length) return true; o[(cur.a+1)%4].click(); document.getElementById('nx').click(); return false; })()`); if (done) break; n++; }
  const over = await b.ev(`document.body.innerText.indexOf('game over')>-1`); if (!over || n !== 3) fail("game", l, "three wrong should end the game", n);
  const errs = await b.ev(`window.__errs`); if (errs.length) fail("game errors", l, errs);
}
// the hub lists the Unit 8 games
await b.send("Page.navigate", { url: "file://" + ROOT + "unit-6/game.html" }); await b.sleep(900);
const hub = await b.ev(`document.body.innerText`); if (!hub.includes(CF.hub) || !hub.includes(CF.last)) fail("hub missing Unit 8");
// 3. practice test: all right, all wrong, start over
await b.send("Page.navigate", { url: "file://" + ROOT + CF.test }); await b.sleep(1000);
const n = await b.ev(`document.querySelectorAll('.pq').length`); if (n !== CF.n) fail("practice test count", n);
await b.ev(`[].forEach.call(document.querySelectorAll('.pq'), function(q){ q.querySelectorAll('input')[Number(q.getAttribute('data-a'))].checked = true; }); document.getElementById('check').click()`);
const all = await b.ev(`document.getElementById('sum').textContent`); if (all !== CF.n + " of " + CF.n + " right") fail("all right gave", all);
await b.ev(`document.getElementById('again').click(); [].forEach.call(document.querySelectorAll('.pq'), function(q){ q.querySelectorAll('input')[(Number(q.getAttribute('data-a'))+1)%4].checked = true; }); document.getElementById('check').click()`);
const none = await b.ev(`document.getElementById('sum').textContent`); if (none !== "0 of " + CF.n + " right") fail("all wrong gave", none);
const perr = await b.ev(`window.__errs`); if (perr.length) fail("practice errors", perr);
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
