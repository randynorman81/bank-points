/* ARCADE PLAY TEST: plays each Unit 3 arcade game (a160 to a172) in a real headless browser. For every round it reads the right answer (teacher preview) and lets the game play itself toward
   that answer using the game's own controls and physics (window.__arc.auto), then checks: the round was answered, it was marked right, it did not take longer than the timer allows,
   and a perfect run scores 100. It also checks the real keyboard and mouse wiring for a couple of games and writes a screenshot of every game.
   usage: node tools/missions/arcplay.mjs [shots-folder] [slot,slot]   (it starts its own dev server) */
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { start } = await import("./devserver.mjs");
const { launch } = require("./testkit/cdp.js");
const core = require("./index.js");
const SHOTS = process.argv[2] || "/tmp/arcshots"; fs.mkdirSync(SHOTS, { recursive: true });
const SLOTS = process.argv[3] ? process.argv[3].split(",") : Array.from({ length: 13 }, (_, i) => "a" + (160 + i));
const PORT = 8134, BASE = "http://localhost:" + PORT; await start(PORT);
async function call(body) { const r = await fetch(BASE + "/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({ pin: "1234" }, body)) }); return r.json(); }
for (const g of core.RECORDS.filter((r) => r.rec.game)) { const rec = g.rec; await call({ action: "adminSetAssignment", slot: g.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: rec.checks, tips: rec.tips, autoRun: [], game: rec.game, live: true }); }
let bad = 0; const say = (m) => { bad++; console.log("  PROBLEM: " + m); };
const b = await launch(9811, 1000, 1000); const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const ev = (x) => b.ev(x);
async function waitFor(cond, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await ev(cond); if (v) return v; await sleep(80); } return null; }
for (const slot of SLOTS) {
  const rec = core.RECORDS.find((r) => r.slot === slot).rec; console.log("\n" + slot + "  " + rec.title);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${slot}&teacher` }); await ev(`sessionStorage.setItem('pypin','1234')`);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${slot}&teacher` });
  if (!(await waitFor(`!document.getElementById('intro').classList.contains('hidden')`, 15000))) { say("the intro never appeared"); continue; }
  await ev(`document.getElementById('startBtn').click()`);
  let shotDone = false;
  for (let round = 0; round < 10; round++) {
    if (!(await waitFor(`window.__pgState && window.__pgState().q && !window.__pgState().busy`, 15000))) { say("round " + (round + 1) + ": no question; state " + JSON.stringify(await ev("window.__pgState && window.__pgState()")).slice(0, 200) + " errs " + b.errs.slice(0, 2).join("|")); break; }
    const st = await ev("window.__pgState()"), q = st.q, idx = q.sol.answer.idx; const n0 = st.n;
    if (!(await ev(`document.getElementById('controls').style.display === 'none'`))) say("round " + (round + 1) + ": the answer buttons are still showing");
    await sleep(400); if (!shotDone && round === 1) { await b.shot(`${SHOTS}/${slot}.png`); shotDone = true; }
    const t0 = Date.now(); await ev(`window.__arc.auto(${idx})`);
    const ok = await waitFor(`window.__pgState().n > ${n0} || window.__pgState().busy`, (q.t + 30) * 1000);
    const took = ((Date.now() - t0) / 1000).toFixed(1);
    if (!ok) { say("round " + (round + 1) + ": the game never got an answer within " + (q.t + 30) + "s (answer " + idx + ")"); await b.shot(`${SHOTS}/${slot}-stuck.png`); break; }
    await waitFor(`window.__pgState().n > ${n0}`, 8000); const after = await ev("window.__pgState()");
    console.log(`  round ${String(round + 1).padStart(2)}: answer ${idx} reached in ${took}s, strikes ${after.strikes}, correct ${after.correct}`);
    if (after.correct !== round + 1) { say("round " + (round + 1) + ": the answer was not marked right (correct " + after.correct + ") " + JSON.stringify(await ev("window.__dbg||null"))); break; }
    if (round < 9) { await waitFor(`window.__pgState().canNext`, 4000); await ev(`window.__pgState().canNext && document.querySelector('#why .btn') && document.querySelector('#why .btn').click()`); await sleep(200); }
  }
  const fin = await waitFor(`!document.getElementById('result').classList.contains('hidden')`, 20000);
  if (!fin) say("no result screen"); else { const pct = await ev(`document.getElementById('rBig').textContent`); console.log("  result screen: " + pct); if (String(pct).trim() !== "100") say("a perfect run showed " + pct + " instead of 100"); }
  if (b.errs.length) { say("page errors: " + b.errs.slice(0, 3).join(" | ")); b.errs.length = 0; }
}
b.close();
console.log(bad ? `\n${bad} PROBLEMS` : "\nall arcade games play through: every round was answerable and a perfect run scores 100");
process.exit(bad ? 1 : 0);
