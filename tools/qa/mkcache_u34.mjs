// Writes /private/tmp/claude-501/assign_u34.json: the live list (Units 4 and up) plus Unit 3 walkthroughs a1-a13 from the saved export with the server's text patches applied.
// Use with QA_CACHE=/private/tmp/claude-501/assign_u34.json for every wt_*/tips/tryit tool.   (Unit 3 is locked so the public list does not carry it.)
import fs from "fs";
const root = "/Users/randynorman/bank-points/";
const mod = await import(root + "teacher-settings/python-editor.js");
const live = JSON.parse(fs.readFileSync("/private/tmp/claude-501/assign_live4.json", "utf8")); const L = live.assignments || live;
const pub = JSON.parse(fs.readFileSync(root + "tools/guides/work/src/pub.json", "utf8")); const P = pub.assignments || pub;
const out = Object.assign({}, L);
for (let n = 1; n <= 13; n++) { const s = "a" + n; let r = JSON.parse(JSON.stringify(P[s])); if (mod.PY_PATCHES[s]) r = mod.PY_PATCHES[s](r); out[s] = r; }
fs.writeFileSync("/private/tmp/claude-501/assign_u34.json", JSON.stringify({ assignments: out })); console.log("slots:", Object.keys(out).length);
