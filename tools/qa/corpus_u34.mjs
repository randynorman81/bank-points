// Writes tools/qa/_corpus_u34.json: every student-facing string of Units 3 and 4 with where it comes from.
// Walkthroughs a1-a13 come from the saved export (tools/guides/work/src/pub.json) with the same text patches the server applies; a16-a28 come from the live list (QA_CACHE json).
import fs from "fs";
const root = "/Users/randynorman/bank-points/";
const mod = await import(root + "teacher-settings/python-editor.js");
const { PY_RECORDS } = await import(root + "teacher-settings/python-records.js");
const live = JSON.parse(fs.readFileSync(process.env.QA_CACHE || "/private/tmp/claude-501/assign_live4.json", "utf8")); const L = live.assignments || live;
const pub = JSON.parse(fs.readFileSync(root + "tools/guides/work/src/pub.json", "utf8")); const P = pub.assignments || pub;
const out = []; const add = (src, t) => { if (typeof t === "string" && t.trim()) out.push({ src, t }); };
const skip = new Set(["re", "flags", "label", "id", "game", "sol", "ex", "expect", "pieces", "valid", "checks", "mcKey", "slot", "ins", "autoRun", "refs", "unit", "title_"]);
function walk(o, src, inCode) {
  if (typeof o === "string") return add(src, o);
  if (Array.isArray(o)) return o.forEach((x) => walk(x, src));
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { if (skip.has(k)) continue; if (k === "code") { add(src + " [code]", String(v)); continue; } walk(v, src + (k === "p" || k === "make" || k === "h" ? "" : "." + k)); }
}
const wt = {};
for (let n = 1; n <= 13; n++) { const s = "a" + n; let r = P[s]; if (mod.PY_PATCHES[s]) r = mod.PY_PATCHES[s](JSON.parse(JSON.stringify(r))); wt[s] = r; }
for (const n of [16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28]) wt["a" + n] = L["a" + n];
for (const [s, r] of Object.entries(wt)) { add(s + " title", r.title); (r.blocks || []).forEach((b, i) => walk(b, s + " block " + i)); for (const [tid, t] of Object.entries(r.tips || {})) { add(s + " tip " + tid + " title", t.title); walk(t.sections, s + " tip " + tid); } for (const q of r.mc || []) { add(s + " quiz", q.q); (q.choices || []).forEach((c) => add(s + " quiz choice", c)); } }
for (const n of [...Array(13).keys()].map((i) => 126 + i).concat([...Array(12).keys()].map((i) => 139 + i))) { const s = "a" + n, r = PY_RECORDS[s]; add(s + " title", r.title); (r.blocks || []).forEach((b, i) => walk(b, s + " block " + i)); for (const [tid, t] of Object.entries(r.tips || {})) { add(s + " tip " + tid + " title", t.title); walk(t.sections, s + " tip " + tid); } }
fs.writeFileSync(root + "tools/qa/_corpus_u34.json", JSON.stringify(out)); console.log("strings:", out.length, "| walkthroughs:", Object.keys(wt).length);
