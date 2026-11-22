/* ADVENTURE PLAY TEST: plays Castle Byte (a122) and Dead Signal (a123) in a real headless browser, in both Learn and Challenge mode, by clicking the hotspots like a player.
   Checks: every room can be walked, every clue page opens (learn) or not (challenge), every lock opens its question window, a perfect run scores 100, and a run of wrong answers ends in GAME OVER.
   usage: node tools/missions/advplay.mjs [shots-folder] [slots] [modes] */
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { start } = await import("./devserver.mjs");
const { launch } = require("./testkit/cdp.js");
const core = require("./index.js");
const SHOTS = process.argv[2] || "/tmp/advshots"; fs.mkdirSync(SHOTS, { recursive: true });
const SLOTS = (process.argv[3] || "a122,a123").split(","), MODES = (process.argv[4] || "learn,challenge").split(",");
const PORT = 8133, BASE = "http://localhost:" + PORT; await start(PORT);
async function call(body) { const r = await fetch(BASE + "/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign({ pin: "1234" }, body)) }); return r.json(); }
for (const g of core.RECORDS.filter((r) => SLOTS.includes(r.slot))) { const rec = g.rec; await call({ action: "adminSetAssignment", slot: g.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: [], tips: rec.tips, game: rec.game, live: true }); }
let bad = 0; const say = (m) => { bad++; console.log("  PROBLEM: " + m); };
const b = await launch(9810, 1100, 1000); const sleep = (ms) => new Promise((r) => setTimeout(r, ms)); const ev = (x) => b.ev(x);
async function waitFor(cond, ms, what) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await ev(cond); if (v) return v; await sleep(100); } say("timed out waiting for " + what); return null; }
const AS = () => ev("window.__advState()");
const clickAt = (lx, ly) => ev(`(function(){var s=document.getElementById('stage'),r=s.getBoundingClientRect();s.dispatchEvent(new MouseEvent('click',{clientX:r.left+${lx}*r.width/240,clientY:r.top+${ly}*r.height/135,bubbles:true}))})()`);
async function playRound(q, wrong) {
  const a = q.sol.answer;
  if (q.type === "choice") { const idx = wrong ? (a.idx + 1) % q.choices.length : a.idx; await ev(`document.querySelectorAll('#controls .btn.pick')[${idx}].click()`); }
  else if (q.type === "bits") { const v = wrong ? (a.value + 1) % 256 : a.value; for (let i = 0; i < 8; i++) if ((v >> (7 - i)) & 1) await ev(`document.querySelectorAll('#controls .sw')[${i}].click()`); await ev(`document.querySelector('#controls .btn.red').click()`); }
  else if (q.type === "bitsip") { const vals = wrong ? a.values.map((x) => (x + 1) % 256) : a.values; for (let k = 0; k < 4; k++) for (let i = 0; i < 8; i++) if ((vals[k] >> (7 - i)) & 1) await ev(`document.querySelectorAll('#controls .sw')[${k * 8 + i}].click()`); await ev(`document.querySelector('#controls .btn.red').click()`); }
  else if (q.type === "assemble") { const order = wrong ? Array.from({ length: a.total }, (_, k) => a.total - k) : Array.from({ length: a.total }, (_, k) => k + 1); for (const s of order) await ev(`(function(){var cs=document.querySelectorAll('#controls .belt .pkt');for(var i=0;i<cs.length;i++)if(cs[i].textContent.indexOf('seq ${s}')>-1&&!cs[i].classList.contains('used')){cs[i].click();return}})()`); await ev(`document.querySelector('#controls .btn.go').click()`); }
  else if (q.type === "missing") { if (wrong) await ev(`window.__pgSubmit({missing:[]})`); else { for (const n of a.gone) await ev(`document.querySelectorAll('#controls .numbtn')[${n - 1}].click()`); await ev(`document.querySelector('#controls .btn.go').click()`); } }
  else if (q.type === "grid") { const rows = wrong ? a.rows.map((r, k) => (k === 0 ? r.split("").map((c) => (c === "1" ? "0" : "1")).join("") : r)) : a.rows; for (let y = 0; y < rows.length; y++) for (let x = 0; x < rows[y].length; x++) if (rows[y][x] === "1") await ev(`document.querySelectorAll('#controls .pcell')[${y * q.w + x}].click()`); await ev(`document.querySelector('#controls .btn.go').click()`); }
  else if (q.type === "rgb") { const vals = wrong ? a.rgb.map((v) => (v === 255 ? 0 : 255)) : a.rgb; for (let ch = 0; ch < 3; ch++) { const k = q.levels.indexOf(vals[ch]); await ev(`document.querySelectorAll('#controls .rgbrow')[${ch}].querySelectorAll('.lvl')[${k}].click()`); } await ev(`document.querySelector('#controls .btn.go').click()`); }
  else say("unknown question type " + q.type);
}
/* click a hotspot, wait for the hero to walk there and the thing to happen */
async function useSpot(hot, expectModal, expectPuzzle) {
  const st = await AS(); const sp = st.spots.find((s) => s.hot === hot); if (!sp) { say("no hotspot " + hot + " in room " + st.ri); return false; }
  await clickAt(sp.cx, sp.cy);
  if (expectPuzzle) return !!(await waitFor("window.__advState().open", 9000, "the lock window for " + hot + " in room " + (st.ri + 1)));
  if (expectModal) return !!(await waitFor("window.__advState().modal", 9000, "the lesson page for " + hot));
  await sleep(2500); return true;
}
async function solveLock(wrong, shot) {
  const stt = await ev("window.__pgState()"), q = stt.q;
  if (shot) await b.shot(shot);
  await playRound(q, wrong);
  await waitFor("(function(){var w=document.querySelector('#why .btn');return !!w})()", 6000, "the verdict");
  const why = await ev("document.getElementById('why').className"); const txt = await ev("document.getElementById('why').textContent");
  if (!wrong && why !== "ok") say("a right answer was marked " + why);
  await ev("document.querySelector('#why .btn').click()"); await sleep(400);
  return { ok: why === "ok", txt };
}
async function play(slot, mode, perfect) {
  const g = core.RECORDS.find((r) => r.slot === slot); console.log(`\n${slot} ${g.rec.title} (${mode}, ${perfect ? "perfect run" : "wrong answers"})`);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${slot}&teacher` }); await ev(`sessionStorage.setItem('pypin','1234')`);
  await b.send("Page.navigate", { url: `${BASE}/python/games/play.html?slot=${slot}&teacher` });
  await waitFor(`!document.getElementById('intro').classList.contains('hidden')`, 12000, "the intro");
  if (perfect && mode === "learn") await b.shot(`${SHOTS}/${slot}-0-intro.png`);
  await ev(`document.getElementById('${mode === "learn" ? "modeLearn" : "modeChallenge"}').click()`);
  await waitFor("window.__advState && window.__advState() && window.__advState().slides", 8000, "the opening story");
  if (perfect && mode === "learn") { await sleep(1500); await b.shot(`${SHOTS}/${slot}-1-story.png`); }
  await ev("document.getElementById('advSkip').click()");
  const rooms = (await ev("window.__advState && 1")) ? null : null; void rooms;
  let strikesSeen = 0, roomNo = 0;
  for (let guard = 0; guard < 40; guard++) {
    await waitFor("window.__advState().state==='play'", 15000, "play state"); const st = await AS();
    if (await ev("!document.getElementById('result').classList.contains('hidden')")) break;
    if (st.boss) {
      if (perfect && roomNo !== -1) { await sleep(2500); await b.shot(`${SHOTS}/${slot}-boss.png`); roomNo = -1; }
      for (let k = 0; k < 4; k++) {
        const ok = await useSpot("boss", false, true); if (!ok) break; const r = await solveLock(!perfect, k === 1 && perfect ? `${SHOTS}/${slot}-${mode}-boss-lock.png` : null);
        if (await ev("!document.getElementById('result').classList.contains('hidden')")) break;
        const s2 = await ev("window.__pgState()"); if (!perfect && s2.strikes >= (mode === "learn" ? 10 : 6)) break; await sleep(700);
        if (await waitFor("window.__advState().state==='play'||window.__advState().state==='dead'||window.__advState().state==='win'||window.__advState().slides", 8000, "after the boss lock") === null) break;
      }
      break;
    }
    roomNo = st.ri + 1;
    /* clue pages */
    for (let c = 0; c < 3; c++) {
      if (!(await AS()).spots.some((s) => s.hot === "clue" + c)) continue;
      if (mode === "learn") { const ok = await useSpot("clue" + c, true, false); if (ok) { if (st.ri === 2 && c === 1 && perfect) await b.shot(`${SHOTS}/${slot}-learn-page.png`); await ev("document.getElementById('advModalX').click()"); await sleep(300); } }
      else { await useSpot("clue" + c, false, false); const m = await AS(); if (m.modal) say("challenge mode must not open lesson pages"); }
    }
    if (perfect && st.ri === 0) { await useSpot("lockA", false, true) && (await solveLock(false, `${SHOTS}/${slot}-${mode}-lock.png`)); }
    else { if (!(await useSpot("lockA", false, true))) break; await solveLock(!perfect, null); }
    { const s3 = await ev("window.__pgState()"); if (!perfect && s3.strikes >= (mode === "learn" ? 10 : 6)) break; }
    const mid = await AS(); if (mid.state === "dead" || (await ev("!document.getElementById('result').classList.contains('hidden')"))) break;
    await waitFor("window.__advState().state==='play'", 8000, "play after lock A");
    if (perfect && st.ri === 4) await b.shot(`${SHOTS}/${slot}-${mode}-room5.png`);
    if (!(await useSpot("lockB", false, true))) break; await solveLock(!perfect, null);
    { const s3 = await ev("window.__pgState()"); if (!perfect && s3.strikes >= (mode === "learn" ? 10 : 6)) break; }
    const mid2 = await AS(); if (mid2.state === "dead") break;
    await waitFor("window.__advState().state==='play'", 8000, "play after lock B"); await sleep(1800);
    await useSpot("lockB", false, false);   /* walk through the open door */
    if (!(await waitFor(`window.__advState().ri===${st.ri + 1}||window.__advState().state==='dead'`, 9000, "the next room"))) { console.log("  debug", JSON.stringify(await AS())); await b.shot(`${SHOTS}/debug-stuck.png`); break; }
    if (!perfect) { const s2 = await ev("window.__pgState()"); if (s2.strikes >= (mode === "learn" ? 10 : 6)) break; }
  }
  for (let k = 0; k < 60; k++) { if (await ev("!document.getElementById('result').classList.contains('hidden')")) break; if (await ev("(window.__advState()||{}).slides")) await ev("document.getElementById('advSkip').click()"); await sleep(400); }
  await waitFor(`!document.getElementById('result').classList.contains('hidden')`, 10000, "the result screen");
  const res = await ev(`({title:document.getElementById('rTitle').textContent,big:document.getElementById('rBig').textContent,msg:document.getElementById('rMsg').textContent,rev:document.getElementById('rReview').style.display})`);
  await b.shot(`${SHOTS}/${slot}-${mode}-${perfect ? "win" : "dead"}.png`);
  console.log(`  result: ${res.title}, score ${res.big}, review ${res.rev}`);
  if (perfect && res.big !== "100") say(`a perfect run scored ${res.big}`);
  if (!perfect && res.title !== "GAME OVER") say(`wrong answers should end in GAME OVER (got ${res.title} ${res.big})`);
  if (!perfect && res.rev !== "block") say("the review of missed questions should show at the end");
}
const SCEN = (process.argv[5] || "perfect,wrong").split(",");
for (const slot of SLOTS) for (const mode of MODES) { if (SCEN.includes("perfect")) await play(slot, mode, true); if (SCEN.includes("wrong")) await play(slot, mode, false); }
const errs = b.errs.slice(0, 5); if (errs.length) say("page errors: " + JSON.stringify(errs));
console.log(bad ? `\n${bad} PROBLEMS` : "\nboth adventures play from start to finish in both modes");
b.close(); process.exit(bad ? 1 : 0);
