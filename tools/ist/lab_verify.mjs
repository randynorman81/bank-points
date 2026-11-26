/* Checks every walkthrough/assignment id in lab_models.mjs against the REAL step-check code the editor and the server use:
   1. the model solution scores 100;  2. harmless re-typings of it (indent, blank lines, CRLF, style spacing, trailing semicolons, quote style) still score 100;
   3. mutants (every line deleted, every word of text changed) must score under 100 (a mutant that still scores 100 is an UNCHECKED part of the page: reported).
   Run: node tools/ist/lab_verify.mjs [id ...] */
import { createRequire } from "module";
import { MODELS, FREE, SLACK } from "./lab_models.mjs";
const require = createRequire(import.meta.url), D = "../../ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "answers-w.js", "answers-w2.js"].forEach((f) => require(D + f));
const SC = globalThis.U7_STEPCHECKS;
const want = process.argv.slice(2);
const score = (id, html) => SC.score(id, html, "");
function variants(src) {
  const v = {};
  v.indent = src.split("\n").map((l, i, a) => { let d = 0; for (let k = 0; k < i; k++) { const t = a[k]; d += (t.match(/<(?!\/|!|br|hr|img|link|meta)[a-z][^>]*>/gi) || []).length - (t.match(/<\/[a-z]+>/gi) || []).length; } return "  ".repeat(Math.max(0, d)) + l.trim(); }).join("\n");
  v.blank = src.split("\n").join("\n\n");
  v.crlf = src.replace(/\n/g, "\r\n");
  v.tight = src.replace(/style="([^"]*)"/g, (m, s) => 'style="' + s.replace(/\s*:\s*/g, ":").replace(/\s*;\s*/g, ";") + '"');
  v.semi = src.replace(/style="([^"]*?);?\s*"/g, (m, s) => 'style="' + s + ';"');
  v.spaced = src.replace(/style="([^"]*)"/g, (m, s) => 'style="  ' + s.replace(/:\s*/g, " :  ").replace(/;\s*/g, " ;  ") + '"');
  v.upper = src.replace(/<(\/?)(h1|h2|h3|p|body|head|title|html)\b/g, (m, a, t) => "<" + a + t.toUpperCase());
  v.trail = src.replace(/\n$/, "") + "\n\n\n";
  v.crowded = src.split("\n").map((l) => l.trim()).join("");   /* the whole page on one line */
  return v;
}
let bad = 0;
/* the text of every step has exactly as many bullets as there are check lists (otherwise a box is shown with the wrong checks) */
for (const id of Object.keys(SC.LESSONS).filter((k) => /\.\d+[wa]$/.test(k))) {
  const steps = []; let cur = null; (globalThis.U7_ANSWERS[id] || []).forEach((b) => { if (b.h && /^Step \d+/.test(b.h)) { cur = { h: b.h, n: 0 }; steps.push(cur); } else if (b.build && cur) cur.n += b.build.length; });
  const keys = Object.keys(SC.LESSONS[id].steps);
  if (steps.length !== keys.length) { console.log("MISALIGNED", id, "steps", steps.length, "vs", keys.length); bad++; }
  steps.forEach((st, i) => { if (keys[i] && st.n !== SC.LESSONS[id].steps[keys[i]].length) { console.log("MISALIGNED", id, st.h, st.n, "bullets vs", SC.LESSONS[id].steps[keys[i]].length, "check lists"); bad++; } });
}
for (const id of Object.keys(MODELS)) {
  if (want.length && !want.includes(id)) continue;
  const src = MODELS[id], base = score(id, src);
  const out = [];
  if (!base || base.pct !== 100) { out.push("MODEL SCORES " + (base && base.pct)); bad++; }
  for (const [k, s] of Object.entries(variants(src))) {
    const r = score(id, s); if (!r || r.pct !== 100) { out.push("variant " + k + " scores " + (r && r.pct)); bad++; }
  }
  const lines = src.split("\n"), unchecked = [];
  lines.forEach((l, i) => { if (!l.trim() || (SLACK[id] || []).some((f) => l.includes(f))) return;   /* SLACK = lines the page has more of than the assignment asks for, so deleting one is allowed to stay at 100 */
       const m = lines.slice(0, i).concat(lines.slice(i + 1)).join("\n"), r = score(id, m); if (r && r.pct === 100) unchecked.push("line " + (i + 1) + ": " + l.trim()); });
  /* change one word of each text node */
  const re = />([^<>\n]*[A-Za-z][^<>\n]*)</g; let mm, k = 0;
  while ((mm = re.exec(src))) { const t = mm[1], pos = mm.index + 1; const mut = src.slice(0, pos) + t.replace(/[A-Za-z]/, (c) => (c === "z" ? "y" : String.fromCharCode(c.charCodeAt(0) + 1))) + src.slice(pos + t.length); const r = score(id, mut); if (r && r.pct === 100 && !(FREE[id] || []).includes(t.trim())) unchecked.push("text: " + t.trim()); k++; }
  console.log(id.padEnd(7), out.length ? "FAIL " + out.join("; ") : "ok", "| boxes", base && base.boxes, "| unchecked parts:", unchecked.length ? "\n      " + unchecked.join("\n      ") : "none");
}
process.exit(bad ? 1 : 0);
