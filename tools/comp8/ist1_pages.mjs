// IST Unit 1: every page loads clean with working links; the Case Sorter and Interrogation Room play correctly; the study guide and lesson pages link the new case file.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
import fs from "fs"; import path from "path";
const DIR = "/Users/randynorman/bank-points/ist/unit-1/";
const b = await launch(9708, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const pages = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
for (const f of pages) {
  await b.send("Page.navigate", { url: "file://" + DIR + f }); await b.sleep(700);
  const errs = await b.ev("window.__errs"); if (errs.length) fail(f, "script errors", errs);
  const links = await b.ev(`[].map.call(document.querySelectorAll('a[href]'), function(a){return a.getAttribute('href')})`);
  for (const h of links) { if (/^(https?:|mailto:|#|javascript:)/.test(h)) continue; const p = path.resolve(DIR, h.split("#")[0].split("?")[0]); if (!fs.existsSync(p)) fail(f, "broken link", h); }
}
console.log("pages checked:", pages.length);
// case sorter: right answers = 50/50
await b.send("Page.navigate", { url: "file://" + DIR + "1-1-cia-sorter.html" }); await b.sleep(700);
const keys = JSON.parse(await b.ev(`JSON.stringify(cases.map(function(c){return c.answer}))`)); const kinds = [...new Set(keys)];
console.log("sorter cases:", keys.length, "answer keys:", kinds.join(","));
if (keys.length !== 50) fail("sorter should have 50 cases", keys.length);
await b.ev(`(function(){ start(); })()`);
for (let i = 0; i < 50; i++) { await b.ev(`(function(){ var c = order[idx]; var btns = document.querySelectorAll('[data-key], .bucket, .pick-btn, button'); pick(c.answer, document.querySelector('button')); next(); })()`); }
const done = await b.ev(`document.body.innerText`); const m = done.match(/(\d+)\s*(?:\/|out of|of)\s*50/); console.log("sorter result text:", m ? m[0] : done.slice(0, 120)); if (!m || m[1] !== "50") fail("sorter all-right should score 50/50", m && m[0]);
// interrogation room: always the safe move = 10/10
await b.send("Page.navigate", { url: "file://" + DIR + "1-3-interrogation-room.html" }); await b.sleep(700);
if ((await b.ev("scenarios.length")) !== 10) fail("10 scenarios expected");
await b.ev(`start()`);
for (let i = 0; i < 10; i++) { await b.ev(`(function(){ var s = order[idx], k = s.options.findIndex(function(o){return o.correct}); choose(k, document.querySelectorAll('.choice')[k]); var nx = document.querySelector('#next, .next, button.primary, [onclick*="next"]'); if (typeof next === 'function') next(); })()`); }
const idone = await b.ev(`document.body.innerText`); const im = idone.match(/(\d+)\s*(?:\/|out of|of)\s*10/); console.log("interrogation result:", im ? im[0] : idone.slice(0, 100)); if (!im || im[1] !== "10") fail("interrogation all-right should score 10/10", im && im[0]);
// the new case file is linked from the lesson page, the unit index and the study guide mentions the cases
const l4 = fs.readFileSync(DIR + "1-4-your-phones-invisible-footprint.html", "utf8"), ix = fs.readFileSync(DIR + "index.html", "utf8"), sg = fs.readFileSync(DIR + "unit-1-study-guide.html", "utf8");
if (!l4.includes("caught-by-their-data.html")) fail("1.4 lesson does not link the case file"); if (!ix.includes("caught-by-their-data.html")) fail("index does not link the case file");
for (const w of ["Dennis Rader", "Kohberger", "Golden State Killer", "Christ Lutheran Church", "Carpenter"]) if (!sg.includes(w)) fail("study guide missing", w);
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
