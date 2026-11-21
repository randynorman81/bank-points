/* GAME PLAY TEST: starts the dev server (real pycode.js, in-memory data), publishes the game missions, then plays every game in a real browser
   through the on-screen controls using the teacher preview's solutions. Checks a perfect run scores 100, a bad run ends the game, and takes screenshots.
   usage: node tools/missions/gameplay.mjs [shots-folder] */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire(import.meta.url);
const { start } = await import("./devserver.mjs");
const { launch } = require("./testkit/cdp.js");
const core = require("./index.js");
const SHOTS = process.argv[2] || "/tmp/gameshots"; fs.mkdirSync(SHOTS, { recursive: true });
const PORT = 8130, BASE = "http://localhost:" + PORT;
await start(PORT);
async function call(body) { const r = await fetch(BASE + "/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({ pin: "1234" }, body)) }); return r.json(); }
const GAMES = core.RECORDS.filter((r) => r.kind === "game");
for (const g of GAMES) { const rec = g.rec; const up = await call({ action: "adminSetAssignment", slot: g.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: [], tips: rec.tips, game: rec.game, live: false }); if (!up.ok) throw new Error("seed failed " + JSON.stringify(up)); await call({ action: "adminSetLive", slot: g.slot, live: false, part: "mission", passMin: 90, seq: rec.seq, points: 100 }); }
let bad = 0; const say = (m) => { bad++; console.log("  PROBLEM: " + m); };
const b = await launch(9800, 1100, 1000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (x) => b.ev(x);
async function state() { return await ev("window.__pgState ? window.__pgState() : null"); }
async function waitFor(cond, ms, what) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await ev(cond); if (v) return v; await sleep(120); } say("timed out waiting for " + what); return null; }

/* brute-force the list-operation puzzle, like the server's own test does */
function applyOps(start, ops) { const l = start.slice(); for (const op of ops) { const [k, a, c] = op.split(":"); if (k === "append") l.push(a); else if (k === "insert") l.splice(Number(a), 0, c); else if (k === "remove") { const i = l.indexOf(a); if (i < 0) return null; l.splice(i, 1); } else if (k === "pop") { if (!l.length) return null; l.pop(); } } return l; }
function solveOps(q) { const want = q.target.join("|"); const go = (seq) => { const r = applyOps(q.start, seq); if (r && r.join("|") === want) return seq; if (seq.length >= q.max) return null; for (const p of q.palette) { const x = go(seq.concat([p])); if (x) return x; } return null; }; return go([]); }
const opText = (op) => { const p = op.split(":"); return p[0] === "append" ? `cast.append("${p[1]}")` : p[0] === "insert" ? `cast.insert(${p[1]}, "${p[2]}")` : p[0] === "remove" ? `cast.remove("${p[1]}")` : "cast.pop()"; };

async function playRound(q, wrong) {
  const a = q.sol.answer;
  if (q.type === "choice") { const idx = wrong ? (a.idx + 1) % q.choices.length : a.idx; await ev(`document.querySelectorAll('#controls .btn.pick')[${idx}].click()`); }
  else if (q.type === "bits") { const v = wrong ? (a.value + 1) % 256 : a.value; for (let i = 0; i < 8; i++) if ((v >> (7 - i)) & 1) await ev(`document.querySelectorAll('#controls .sw')[${i}].click()`); await ev(`document.querySelector('#controls .btn.red').click()`); }
  else if (q.type === "bitsip") { const vals = wrong ? a.values.map((x) => (x + 1) % 256) : a.values; for (let k = 0; k < 4; k++) for (let i = 0; i < 8; i++) if ((vals[k] >> (7 - i)) & 1) await ev(`document.querySelectorAll('#controls .sw')[${k * 8 + i}].click()`); await ev(`document.querySelector('#controls .btn.red').click()`); }
  else if (q.type === "route") {
    if (wrong) { await ev(`window.__pgSubmit(${JSON.stringify(a.none ? { path: ["Home", "R1"] } : { none: true })})`); }
    else if (a.none) { await ev(`document.querySelector('#controls .btn.red').click()`); }
    else {
      /* breadth-first path avoiding the failed routers, then click each router on the canvas */
      const E = [["Home", "R1"], ["Home", "R2"], ["Home", "R3"], ["R1", "R2"], ["R2", "R3"], ["R1", "R4"], ["R2", "R5"], ["R3", "R6"], ["R4", "R5"], ["R5", "R6"], ["R4", "R7"], ["R5", "R7"], ["R5", "R8"], ["R6", "R8"], ["R7", "R8"], ["R7", "School"], ["R8", "Cloud"], ["R8", "School"]];
      const nb = (n) => E.flatMap((e) => (e[0] === n ? [e[1]] : e[1] === n ? [e[0]] : []));
      const prev = { [a.src]: null }, qu = [a.src]; while (qu.length) { const n = qu.shift(); for (const m of nb(n)) if (!(m in prev) && !a.down.includes(m)) { prev[m] = n; qu.push(m); } }
      const path = []; for (let x = a.dst; x; x = prev[x]) path.unshift(x);
      for (const n of path.slice(1)) await ev(`(function(){ var c=document.getElementById('stage'), r=c.getBoundingClientRect(), p=Scenes.npos(${JSON.stringify(n)}); c.dispatchEvent(new MouseEvent('click',{clientX:r.left+p[0]*r.width/c.width, clientY:r.top+p[1]*r.height/c.height, bubbles:true})); })()`);
      await sleep(150); await ev(`document.querySelector('#controls .btn.go').click()`);
    }
  }
  else if (q.type === "assemble") { const order = wrong ? Array.from({ length: a.total }, (_, k) => a.total - k) : Array.from({ length: a.total }, (_, k) => k + 1); for (const s of order) await ev(`(function(){ var cs=document.querySelectorAll('#controls .belt .pkt'); for (var i=0;i<cs.length;i++) if (cs[i].textContent.indexOf('seq ${s}')===0 || cs[i].querySelector('.h').textContent==='seq ${s}') { cs[i].click(); break; } })()`); await ev(`document.querySelector('#controls .btn.go').click()`); }
  else if (q.type === "missing") { const pick = wrong ? [] : a.gone; for (const n of pick) await ev(`document.querySelectorAll('#controls .numbtn')[${n - 1}].click()`); if (wrong) { const bad = Array.from({ length: q.total }, (_, k) => k + 1).find((n) => !a.gone.includes(n) && !q.shown.includes(n)) ; const notGone = Array.from({ length: q.total }, (_, k) => k + 1).filter((n) => a.gone.indexOf(n) < 0 && q.shown.indexOf(n) < 0); if (!notGone.length) { for (const n of a.gone.slice(0, 1)) await ev(`document.querySelectorAll('#controls .numbtn')[${n - 1}].click()`); if (a.gone.length === 1) { /* a single missing packet cannot be answered wrongly with the buttons; time out instead */ await ev(`document.querySelector('#controls .btn.go').click()`); return; } } } await ev(`document.querySelector('#controls .btn.go').click()`); }
  else if (q.type === "pickindex") { const idx = wrong ? (a.idx + 1) % q.cast.length : a.idx; await ev(`document.querySelectorAll('#controls .cc')[${idx}].click()`); }
  else if (q.type === "ops") { const seq = wrong ? ["pop"] : solveOps(q); if (!seq) { say("no solution for the ops puzzle"); return; } for (const op of seq) await ev(`(function(){ var b=document.querySelectorAll('#controls .palette .btn'); for (var i=0;i<b.length;i++) if (b[i].textContent===${JSON.stringify(opText(op))}) { b[i].click(); break; } })()`); await ev(`document.querySelector('#controls .btn.go').click()`); }
  else say("unknown question type " + q.type);
}

async function playGame(g, mode) {
  const name = g.rec.game; console.log(`\n${g.slot} ${g.rec.title}  (${mode})`);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${g.slot}&teacher` });
  await ev(`sessionStorage.setItem('pypin','1234')`);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${g.slot}&teacher` });
  await waitFor(`!document.getElementById('intro').classList.contains('hidden')`, 12000, "the intro screen");
  if (mode === "perfect") await b.shot(`${SHOTS}/${name}-0-intro.png`);
  await ev(`document.getElementById('startBtn').click()`);
  let n = 0, wrongGiven = 0;
  for (let round = 0; round < 10; round++) {
    const st = await waitFor(`(function(){ var s=window.__pgState(); return s && s.q && !s.busy && s.n===${n} ? s : null })()`, 8000, `round ${round + 1}`); if (!st) break;
    const q = st.q;
    if (round === 3 || round === 7) await b.shot(`${SHOTS}/${name}-${round + 1}-question.png`);
    const wrong = mode === "bad" && round < 3 + 0 ? true : false;
    if (wrong && q.type === "missing" && q.sol.answer.gone.length === 1 && q.total === q.shown.length + 1) { /* cannot pick a wrong number: just give a wrong one */ }
    await playRound(q, wrong);
    await waitFor(`window.__pgState().n===${n + 1}`, 6000, `the verdict for round ${round + 1}`);
    const s2 = await state(); const why = await ev(`document.getElementById('why').className`);
    if (round === 3 || round === 7) await b.shot(`${SHOTS}/${name}-${round + 1}-${why === "ok" ? "right" : "wrong"}.png`);
    if (!wrong && why !== "ok") say(`round ${round + 1} (${q.type}) was a right answer but the page says ${why}`);
    n = s2.n;
    if (s2.strikes >= 3) break;
    await sleep(1000); await ev(`(function(){ var b=document.querySelector('#why .btn'); if (b) b.click(); })()`);
  }
  await waitFor(`!document.getElementById('result').classList.contains('hidden')`, 12000, "the result screen");
  const res = await ev(`({title: document.getElementById('rTitle').textContent, big: document.getElementById('rBig').textContent, msg: document.getElementById('rMsg').textContent})`);
  await b.shot(`${SHOTS}/${name}-9-result-${mode}.png`);
  console.log(`  result: ${res.title}, score ${res.big}  "${res.msg.slice(0, 60)}"`);
  if (mode === "perfect" && res.big !== "100") say(`a perfect run scored ${res.big} instead of 100`);
  if (mode === "bad" && !(Number(res.big) < 100 && res.title === "GAME OVER")) say(`three wrong answers should end the game (got ${res.title} ${res.big})`);
}
for (const g of GAMES) { await playGame(g, "perfect"); await playGame(g, "bad"); }
const errs = b.errs.slice(0, 5); if (errs.length) say("page errors: " + JSON.stringify(errs));
console.log(bad ? `\n${bad} PROBLEMS` : "\nall five games play from start to finish: perfect runs score 100 and three mistakes end the game");
b.close(); process.exit(bad ? 1 : 0);
