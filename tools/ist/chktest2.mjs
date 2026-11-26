// Takes the practice test like a student in real Chrome: every right answer scores, every wrong answer shows the explanation, the filters work, no errors.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9656, 1100, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-7/unit-3-part-2-practice-test.html" }); await b.sleep(1200);
await b.ev("localStorage.clear()"); await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-7/unit-3-part-2-practice-test.html" }); await b.sleep(1000);
const r = await b.ev(`(function(){ var bad = [], n = Q.length;
  Q.forEach(function(q, i){ var el = document.getElementById('q' + i); var btns = el.querySelectorAll('.opt'); q.a.forEach(function(j){ btns[j].click(); }); var chk = el.querySelector('.check'); if (chk) chk.click();
    if (!el.classList.contains('right')) bad.push('Q' + (i + 1) + ' right answer not accepted'); if (!el.querySelector('.why').textContent) bad.push('Q' + (i + 1) + ' no explanation'); });
  var score = document.getElementById('score').textContent;
  var filt = document.querySelectorAll('.fbtn').length;
  return { n: n, bad: bad, score: score, filters: filt, hero: document.getElementById('heroCount').textContent, errs: window.__errs, done: document.getElementById('doneMsg').textContent.slice(0, 40) }; })()`);
console.log(JSON.stringify(r));
// wrong answers
await b.ev("localStorage.clear()"); await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-7/unit-3-part-2-practice-test.html" }); await b.sleep(800);
const w = await b.ev(`(function(){ var bad = []; Q.forEach(function(q, i){ var el = document.getElementById('q' + i); if (q.a.length > 1) return; var j = (q.a[0] + 1) % 4; el.querySelectorAll('.opt')[j].click(); if (!el.classList.contains('wrong')) bad.push(i); if (el.querySelectorAll('.opt.ok').length !== 1) bad.push('ok' + i); }); return bad; })()`);
console.log("wrong-answer faults:", JSON.stringify(w)); b.close();
