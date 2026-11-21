/* MISSIONS TEST. For every record: lint the shape the server will keep, then run each step's reference program in the real editor and score it with the REAL server grader.
   usage: node tools/missions/test.mjs [slot,slot]   (needs the site served on http://localhost:8124) */
import { createRequire } from "module";
import path from "path";
const require = createRequire(import.meta.url);
const { scoreCode } = await import("./testkit/serverscore.mjs");
const { launch } = require("./testkit/cdp.js");
const VERIFY_FILE = process.env.VERIFY_FILE || path.join(path.dirname(new URL(import.meta.url).pathname), "testkit", "verify.json");
const core = require("./index.js");
const only = process.argv[2] ? process.argv[2].split(",") : null;
const recs = core.RECORDS.filter((r) => !only || only.includes(r.slot));
const VERIFY = [];
let bad = 0; const say = (m) => { bad++; console.log("  PROBLEM: " + m); };

/* ---- lint: what the server keeps ---- */
function lint(r) {
  const rec = r.rec;
  if (JSON.stringify(rec).length > 380000) say("record is too big");
  rec.checks.forEach((c, i) => { if (c.label.length > 140) say("check label too long: " + c.label.slice(0, 40)); if (c.re.length > 1200) say("pattern too long: " + c.label); try { new RegExp(c.re, c.flags); } catch (e) { say("bad pattern: " + c.label); } if (c.min > 200) say("min too big"); });
  const nBoxes = rec.blocks.reduce((n, b) => n + (b.make || b.build || b.where || []).length, 0);
  rec.checks.forEach((c) => { if (c.box >= nBoxes) say("check points at a missing checkbox: " + c.label); });
  Object.keys(rec.tips || {}).forEach((id) => { if (!/^[a-z0-9_-]{1,40}$/.test(id)) say("bad help id " + id); const t = rec.tips[id]; if ((t.sections || []).length > 14) say("tip " + id + " has more than 14 sections");
    (t.sections || []).forEach((sec) => { if (sec.ex && (sec.ex.length > 16 || sec.ex.some((l) => l.length > 220))) say("tip " + id + ": an example is longer than the server keeps (16 lines of 220)"); if (sec.p && sec.p.length > 1800) say("tip " + id + ": a paragraph is too long"); (sec.rows || []).forEach((row) => { if (String(row[0]).length > 160 || String(row[1]).length > 160) say("tip " + id + ": a table cell is too long"); }); }); });
  (rec.blocks || []).forEach((b) => ["h", "p"].forEach((k) => { if (b[k] && /—|–/.test(b[k])) say("dash character in text: " + b[k].slice(0, 50)); }));
  const used = new Set(); rec.blocks.forEach((b) => (b.tips || []).forEach((t) => used.add(t)));
  used.forEach((t) => { if (!rec.tips[t]) say("help button points at a missing tip: " + t); });
  if (r.final && r.final.length > 14000) say("final program is " + r.final.length + " characters; live scoring stops at 15000");
}

/* ---- run each stage in the real editor ---- */
const b = await launch(9600, 1300, 900);
await b.send("Page.navigate", { url: "http://localhost:8124/python/editor.html" });
for (let i = 0; i < 100; i++) { await b.sleep(400); if ((await b.ev("document.getElementById('run') && !document.getElementById('run').disabled")) === true) break; }
async function runVisible(code, inputs) {
  await b.ev(`(function(){ window.__q=${JSON.stringify(inputs || [])}.slice(); window.prompt=function(q){ return window.__q.length? window.__q.shift(): null; }; var t=document.getElementById('code'); t.value=${JSON.stringify(code)}; t.dispatchEvent(new Event('input')); document.getElementById('out').innerHTML=''; })()`);
  await b.ev("document.getElementById('run').click()");
  for (let i = 0; i < 480; i++) { await b.sleep(250); const o = (await b.ev("document.getElementById('out').innerText")) || ""; if (/Finished|Error|❌|closed the input/.test(o) && !(await b.ev("document.getElementById('run').disabled"))) break; }
  return (await b.ev("document.getElementById('out').innerText")) || "";
}
await runVisible("import netlab\nimport toonlab\nprint('warm')");   /* loads Pillow and the libraries once, like a student's first Run */
async function hidden(code, autoRun) { return await b.ev(`hiddenOutput(${JSON.stringify(code)}, {autoRun: ${JSON.stringify(autoRun)}})`); }

for (const r of recs) {
  console.log(`\n${r.slot}  ${r.rec.title}   [${r.kind}, ${r.rec.points} pts, passMin ${r.rec.passMin}]`);
  lint(r);
  const stages = r.w.stages, rec = r.rec; let last = "", lastOut = "";
  for (let k = 0; k < stages.length; k++) {
    const code = r.refs[k] !== undefined ? r.refs[k] : last;
    const out = r.rec.autoRun && r.rec.autoRun.length ? await hidden(code, r.rec.autoRun) : await runVisible(code, (stages[k].inp || []));
    last = code; lastOut = out;
    const res = scoreCode(rec.checks, code, out);
    /* every checkbox that belongs to steps up to k must be complete */
    const boxesUpTo = new Set(rec.checks.filter((c) => c.stage === undefined).map((c) => c.box));
    const stageOf = {}; r.w.__stageOfBox; /* built below */
    const missing = res.missing.filter((m) => true);
    const wantBoxes = rec.checks.filter((c) => c.box !== undefined).map((c) => c.box);
    /* which boxes belong to stages <= k: build.build() numbered boxes in order, so use the label order of the original stage list */
    const own = ownBoxes(r, k);
    const notDone = own.filter((bx) => !(res.boxes[bx] && res.boxes[bx].f >= res.boxes[bx].t - 1e-9));
    const flag = notDone.length ? "FAIL" : "ok  ";
    console.log(`  step ${String(k + 1).padStart(2)} ${flag} ${stages[k].title.slice(0, 46).padEnd(46)} score ${res.pct}%` + (notDone.length ? "   unfinished boxes: " + notDone.join(",") + "  missing: " + res.missing.filter((m) => own.includes(m.box)).map((m) => m.label.slice(0, 50)).join(" | ") : ""));
    if (notDone.length) bad++;
  }
  const fin = scoreCode(rec.checks, last, lastOut);
  VERIFY.push({ slot: r.slot, code: last, output: lastOut, expected: fin.pct });
  console.log(`  FINAL program: ${last.length} characters, auto-checker ${fin.pct}%` + (fin.pct === 100 ? "" : "  <-- must be 100; missing: " + fin.missing.map((m) => m.label).join(" | ")));
  if (fin.pct !== 100) bad++;
  /* a second run in the same session must score the same (test data must not leak between runs) */
  const again = rec.autoRun && rec.autoRun.length ? await hidden(last, rec.autoRun) : await runVisible(last, stages[stages.length - 1].inp || []);
  const fin2 = scoreCode(rec.checks, last, again);
  if (fin2.pct !== fin.pct) say(`running the finished program a second time scored ${fin2.pct}% instead of ${fin.pct}%`);
  /* nobody should pass by faking the output or handing in nothing */
  const fake = 'print("*** MISSION COMPLETE ***")\nprint("Tests passed: 99 of 99")\nprint("ADMITTED: 8.8.8.8 (public)")\nprint("PASS")\n';
  const f1 = scoreCode(rec.checks, fake, fake.replace(/print\("|"\)/g, ""));
  const f2 = scoreCode(rec.checks, "print('hello')\n", "hello");
  console.log(`  cheat checks: printing the magic words scores ${f1.pct}%, an unrelated program scores ${f2.pct}%`);
  if (f1.pct >= 60 || f2.pct >= 30) say("a fake or unrelated program scores too high");
}
function ownBoxes(r, k) {
  /* boxes in the record are numbered in step order; count how many each step made (type box, do boxes, run box) */
  const counts = r.w.stages.map((s) => (s.type ? 1 : 0) + (s.do ? s.do.length : 0) + (s.run ? 1 : 0));
  /* the record has intro boxes? no: boxes start at step 1 */
  let start = 0; for (let i = 0; i < k; i++) start += counts[i];
  const all = []; for (let i = 0; i <= k; i++) { const s0 = (() => { let st = 0; for (let j = 0; j < i; j++) st += counts[j]; return st; })(); for (let j = 0; j < counts[i]; j++) all.push(s0 + j); }
  const withChecks = new Set(r.rec.checks.map((c) => c.box));
  return all.filter((bx) => withChecks.has(bx));
}
import fs from "fs"; fs.writeFileSync(VERIFY_FILE, JSON.stringify(VERIFY));
console.log(bad ? `\n${bad} PROBLEMS` : "\nall records pass: every step scores correctly and the final program is 100%");
b.close();
