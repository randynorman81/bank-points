// IST Unit 1: the Caught by Their Own Data page in real Chrome.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9706, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-1/caught-by-their-data.html" }); await b.sleep(900);
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const n = await b.ev("document.querySelectorAll('#picker .pick').length"); if (n !== 8) fail("8 cases expected", n);
for (let i = 0; i < n; i++) {
  await b.ev(`document.querySelectorAll('#picker .pick')[${i}].click()`);
  const info = JSON.parse(await b.ev(`(function(){ var c = __CASES[${i}], tabs = document.querySelectorAll('#tabs .tab'); var out = {name: c.name, tabs: tabs.length, steps: c.steps.length, first: document.getElementById('sh').textContent};
    tabs[2].click(); for (var k = 1; k < c.steps.length; k++) document.getElementById('next').click(); out.last = document.getElementById('sh').textContent; out.nextDisabled = document.getElementById('next').disabled; out.dots = document.querySelectorAll('#dots .dot.on').length;
    tabs[3].click(); out.didnt = document.getElementById('p3').innerText.length; out.seen = document.querySelectorAll('#picker .pick.seen').length; return JSON.stringify(out); })()`));
  if (info.tabs !== 4 || !info.nextDisabled || info.dots !== info.steps || info.didnt < 120) fail(JSON.stringify(info));
  console.log(i + 1, info.name, "| steps:", info.steps, "| seen:", info.seen);
}
if ((await b.ev("document.querySelectorAll('#picker .pick.seen').length")) !== 8) fail("all cases should be marked read");
// match game: every wrong pair is rejected, every right pair accepted, final message
await b.ev(`(function(){ var L = [].slice.call(document.querySelectorAll('#mL button')), R = [].slice.call(document.querySelectorAll('#mR button')); L[0].click(); R.filter(function(r){return r.getAttribute('data-t') !== 'Hidden file properties on a floppy disk'})[0].click(); })()`);
if (!/1 wrong/.test(await b.ev("document.getElementById('mScore').textContent"))) fail("wrong match not counted");
const pairs = [["BTK (Rader)","Hidden file properties on a floppy disk"],["Kohberger","Cell-tower records: a gap and a pattern"],["Golden State Killer","A cousin's DNA on a genealogy site"],["Ross Ulbricht","An old forum post with an email address"],["John McAfee","GPS coordinates inside a photo"],["Reality Winner","Tracking dots printed on a page"],["Richard Dabate","A step counter on a wrist"],["Rodney Bradford","A Facebook server record"]];
for (const [l, r] of pairs) await b.ev(`(function(){ [].filter.call(document.querySelectorAll('#mL button'), function(x){return x.getAttribute('data-c')===${JSON.stringify(l)}})[0].click(); [].filter.call(document.querySelectorAll('#mR button'), function(x){return x.getAttribute('data-t')===${JSON.stringify(r)}})[0].click(); })()`);
const sc = await b.ev("document.getElementById('mScore').textContent"); if (!/8 of 8/.test(sc)) fail("match game did not finish", sc);
await b.ev("document.querySelector('#audit input').click()"); if (!(await b.ev("document.querySelector('#audit .check').classList.contains('done')"))) fail("audit checkbox");
console.log("errors:", JSON.stringify(await b.ev("window.__errs"))); if ((await b.ev("window.__errs")).length) fail("page errors");
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
