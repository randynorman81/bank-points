/* Verify and publish the Unit 8 walkthroughs (a45 to a54).
   usage: node tools/missions/u8-build.mjs            verify everything, then write teacher-settings/python-unit8.js
          node tools/missions/u8-build.mjs --check    verify only
   1. every step's code (and "below it" code) is run in REAL Python and must print exactly what the Try-it line says
   2. every check is run through the REAL server scorer (netlify/functions/pycode.js) against the reference program:
        - the finished program scores 100%
        - after each step, everything up to that step is complete (no box of an earlier step is missing)
        - the same program with every code line commented out (what Ctrl + / does) still scores 100%
        - taking out any one line, or any one end-of-line comment, drops the score below 100%
        - a program with none of the work scores near 0 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const { buildAll, referenceProgram } = require("./u8-walk.js");
const { scoreCode } = await import("./testkit/serverscore.mjs");
const FILES = [{ name: "u8", file: path.join(here, "u8-walk.txt") }, { name: "concepts", file: path.join(here, "concepts-walk.txt") }];
let problems = 0, STDIN = "";
const bad = (m) => { problems++; console.log("   PROBLEM: " + m); };

function py(code) {
  const r = spawnSync("python3", ["-I", "-c", code], { encoding: "utf8", input: STDIN, env: Object.assign({}, process.env, { PYTHONIOENCODING: "utf-8" }), timeout: 20000 });
  if (r.status !== 0) return { err: (r.stderr || "").trim().split("\n").pop() || "failed", lines: [] };
  const o = r.stdout.replace(/\n$/, ""); return { lines: o === "" ? [] : o.split("\n") };
}
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function verify(all) {
for (const slot of Object.keys(all)) {
  const rec = all[slot];
  STDIN = rec.stdin ? String(rec.stdin).split("|").join("\n") + "\n" : "";
  console.log(`${slot}  ${rec.title}: ${rec.steps.length} steps, ${rec.checks.length} checks, ${Math.max.apply(null, rec.checks.map((c) => c.box)) + 1} boxes`);
  /* 1. real Python */
  const codeOf = (n) => rec.steps[n - 1].code.join("\n");
  rec.steps.forEach((s) => {
    const prefix = s.uses.map(codeOf).join("\n"), pre = prefix ? py(prefix) : { lines: [] };
    if (pre.err) { bad(`step ${s.n} prefix: ${pre.err}`); return; }
    const isBuild = s.items && s.items.length;
    const lines = isBuild ? s.items.reduce((a, it) => a.concat(it.lines), []) : s.code;
    const whole = py((prefix ? prefix + "\n" : "") + lines.join("\n"));
    if (whole.err) { bad(`step ${s.n} (${s.title}) code: ${whole.err}`); return; }
    const mine = whole.lines.slice(pre.lines.length);
    if (s.out && s.out.length && !same(mine, s.out)) bad(`step ${s.n} (${s.title}) prints ${JSON.stringify(mine)} but the page says ${JSON.stringify(s.out)}`);
    if (!isBuild && s.own.length) {
      const both = py((prefix ? prefix + "\n" : "") + lines.join("\n") + "\n" + s.own.join("\n"));
      if (both.err) { bad(`step ${s.n} own lines: ${both.err}`); return; }
      const own = both.lines.slice(pre.lines.length + mine.length);
      if (!same(own, s.ownOut)) bad(`step ${s.n} (${s.title}) own lines print ${JSON.stringify(own)} but the page says ${JSON.stringify(s.ownOut)}`);
    }
  });
  /* the whole reference program must run, too */
  const ref = referenceProgram(rec);
  const run = py(ref.replace(/^# Step.*$/gm, ""));
  if (run.err) bad("the whole reference program fails: " + run.err);
  /* 2. the real scorer */
  const full = scoreCode(rec.checks, ref, "");
  if (full.pct !== 100) bad(`the finished program scores ${full.pct}%: ` + (full.missing || []).slice(0, 4).map((m) => m.label).join(" | "));
  rec.steps.forEach((s) => {
    const part = scoreCode(rec.checks, referenceProgram(rec, s.n), "");
    const mine = (part.missing || []).filter((m) => { const k = /^Step (\d+):/.exec(m.label); return k && +k[1] <= s.n; });
    if (mine.length) bad(`after step ${s.n} these are still missing: ` + mine.slice(0, 3).map((m) => m.label).join(" | "));
  });
  const commented = ref.split("\n").map((l) => (l.trim() === "" || /^#/.test(l) ? l : "# " + l)).join("\n");
  const cm = scoreCode(rec.checks, commented, "");
  if (cm.pct !== 100) bad(`with every code line commented out it scores ${cm.pct}%: ` + (cm.missing || []).slice(0, 3).map((m) => m.label).join(" | "));
  /* any single removed line, or removed end-of-line comment, must cost something */
  let weak = 0; const lines = ref.split("\n");
  lines.forEach((l, i) => {
    if (!l.trim() || /^# Step/.test(l)) return;
    const cut = lines.slice(0, i).concat(lines.slice(i + 1)).join("\n");
    const r = scoreCode(rec.checks, cut, "");
    /* a line typed twice with the same text is allowed to survive one removal only if its count check says so; every removal must lower the score */
    if (r.pct === 100) { weak++; if (weak <= 3) bad(`removing line ${i + 1} (${l.trim().slice(0, 60)}) still scores 100%`); }
  });
  const noComments = scoreCode(rec.checks, ref.replace(/(\S)[ \t]+#.*$/gm, "$1"), "");
  if (noComments.pct === 100) bad("a program without any end-of-line comments still scores 100%");
  const empty = scoreCode(rec.checks, "print('hello')\n", "hello");
  if (empty.pct > 5) bad(`an unrelated program scores ${empty.pct}%`);
  const ids = []; rec.blocks.forEach((b) => (b.tips || []).forEach((t) => ids.push(t)));
  const linked = []; JSON.stringify(rec.blocks).replace(/\[\[[^\]|]*\|([A-Za-z0-9]+)\]\]/g, (m, t) => linked.push(t));
  const known = new Set(Object.keys(rec.tips).concat(["houserules", "commentout", "notekinds", "runit", "readerror", "kn1", "kn2", "kn3"]));
  ids.concat(linked).forEach((t) => { if (!known.has(t)) bad("a help link points at a tip that does not exist: " + t); });
  (rec.mc || []).forEach((q, i) => { if (q.choices.length < 2 || rec.mcKey[i] < 0 || rec.mcKey[i] >= q.choices.length) bad("question " + (i + 1) + " has no right answer marked"); });
}
}

const built = {};
FILES.forEach((f) => { built[f.name] = buildAll(f.file); console.log("\n== " + f.name); verify(built[f.name]); });
console.log(problems ? `\n${problems} PROBLEMS` : "\nall Unit 8 walkthroughs verify");
if (problems) process.exit(1);
if (!process.argv.includes("--check")) {
  const all = built.u8, out = {};
  Object.keys(all).forEach((s) => { out[s] = { blocks: all[s].blocks, tips: all[s].tips, checks: all[s].checks }; });
  fs.writeFileSync(path.join(here, "../../teacher-settings/python-unit8.js"),
    "/* GENERATED by tools/missions/u8-build.mjs from tools/missions/u8-walk.txt. Do not edit by hand.\n   The long Unit 8 walkthroughs (a45 to a54): blocks, help popups and auto-check rules. python-editor.js lays them over the short versions saved on the grading server. */\nexport const UNIT8 = " + JSON.stringify(out) + ";\n");
  console.log("wrote teacher-settings/python-unit8.js");
  const std = JSON.parse(fs.readFileSync(path.join(here, "std-tips.json"), "utf8")), cr = {};
  Object.keys(built.concepts).forEach((s) => {
    const r = built.concepts[s];
    cr[s] = { title: r.title, unit: r.unit, num: r.num, points: 0, mc: r.mc, mcKey: r.mcKey, mcReleased: false, autoRun: [], mcOnly: false, live: true, hold: false, needBoth: true, passMin: 100, ungated: true,
      blocks: r.blocks, tips: Object.assign({}, std, r.tips), checks: r.checks };
  });
  fs.writeFileSync(path.join(here, "../../teacher-settings/python-concepts.js"),
    "/* GENERATED by tools/missions/u8-build.mjs from tools/missions/concepts-walk.txt. Do not edit by hand.\n   The walkthroughs for Unit 10.8, Unit 11 and Unit 16 (a194 to a201): complete records (text, help popups, auto-check rules, and the multiple-choice questions with their answer key). */\nexport const CONCEPTS = " + JSON.stringify(cr) + ";\n");
  console.log("wrote teacher-settings/python-concepts.js");
}
