/* PUBLISH the Walkthrough + Mission records to the live grading server (hidden from students: live false).
   usage:  ADMIN_PIN=xxxx node tools/missions/publish.mjs [--dry] [--verify=path/to/verify.json] [slot,slot]
   - uploads each record with adminSetAssignment, then sets points, part, seq and passMin with adminSetLive (live stays false)
   - --verify: sends each finished reference program to the REAL server score action and compares the percent with what the tests expect
   Nothing here opens anything for students. Open a record by changing its line in teacher-settings/python-editor.js (live: true). */
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const core = require("./index.js");
const BASE = process.env.API || "https://schscomputerscience.com/api/pycode";
const PIN = process.env.ADMIN_PIN;
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const verifyArg = args.find((a) => a.startsWith("--verify="));
const only = args.find((a) => !a.startsWith("--"));
const recs = core.RECORDS.filter((r) => !only || only.split(",").includes(r.slot));
if (!dry && !PIN) { console.error("Set ADMIN_PIN first."); process.exit(1); }
async function call(body) {
  const res = await fetch(BASE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ pin: PIN }, body)) });
  const text = await res.text(); let j; try { j = JSON.parse(text); } catch (e) { throw new Error("bad answer: " + text.slice(0, 200)); }
  return j;
}
let failed = 0;
for (const r of recs) {
  const rec = r.rec;
  const size = JSON.stringify(rec).length;
  console.log(`${r.slot}  ${rec.title}  (${rec.points} pts, ${size} chars, ${rec.checks.length} checks)`);
  if (dry) continue;
  const up = await call({ action: "adminSetAssignment", slot: r.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: rec.checks, tips: rec.tips, autoRun: rec.autoRun || [], game: rec.game, live: false });
  if (!up.ok) { console.log("   upload FAILED: " + JSON.stringify(up)); failed++; continue; }
  const set = { action: "adminSetLive", slot: r.slot, live: false, points: rec.points, seq: rec.seq };
  if (rec.part) set.part = rec.part;
  if (rec.passMin !== undefined) set.passMin = rec.passMin;
  const lv = await call(set);
  console.log(lv.ok ? `   published hidden (live ${lv.live}, passMin ${lv.passMin})` : "   settings FAILED: " + JSON.stringify(lv));
  if (!lv.ok) failed++;
}
if (verifyArg && !dry) {
  const list = JSON.parse(fs.readFileSync(verifyArg.split("=")[1], "utf8"));
  console.log("\nVerifying against the live grader...");
  for (const v of list) {
    if (only && !only.split(",").includes(v.slot)) continue;
    const j = await call({ action: "score", slot: v.slot, code: v.code, output: v.output });
    const same = j.ok && j.pct === v.expected;
    console.log(`  ${v.slot}: live server says ${j.pct}% (expected ${v.expected}%) ${same ? "OK" : "MISMATCH"}` + (same ? "" : "  " + JSON.stringify(j.missing || j).slice(0, 300)));
    if (!same) failed++;
  }
}
console.log(failed ? `\n${failed} PROBLEMS` : "\ndone");
process.exit(failed ? 1 : 0);
