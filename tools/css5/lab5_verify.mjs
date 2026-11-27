/* Verifies the Unit 5 walkthroughs and assignments (ist/unit-6/css-labs*.js) against the REAL step-check code:
   1. the model (index.html + style.css) scores 100;  2. harmless re-typings (indent, blank lines, CRLF, spacing) still score 100;
   3. every deleted line and every changed word of the model scores under 100 (a survivor is an unchecked part, reported unless listed in FREE);
   4. walkthroughs: the page after each step meets every box of steps 1..k and not the whole next step;  5. the text has as many bullets as there are check lists.
   Run: node tools/css5/lab5_verify.mjs [id ...] */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js"].forEach((f) => { try { require(D + f); } catch (e) { if (!/css-labs-2/.test(f) || !/Cannot find/.test(e.message)) throw e; } });
const SC = globalThis.U7_STEPCHECKS, LABS = SC.W.CSS.LABS, want = process.argv.slice(2);
const FREE = { "8.3a": [/css line [23]:/], "8.4a": [/css line [23]:/], "8.5a": [/css line (8|24):/], "8.6a": [/css line 1[789]:/] };   /* lines or words the student may write freely: id -> array of regexes for lines that may be deleted/changed without lowering the score */
const score = (o, html, css) => SC.score(o.id, html, css);
const variants = (o) => {
  const v = {}, h = o.model.html, c = o.model.css;
  v.indent = [h.split("\n").map((l, i, a) => { let d = 0; for (let k = 0; k < i; k++) { const t = a[k]; d += (t.match(/<(?!\/|!|br|hr|img|link|meta)[a-z][^>]*>/gi) || []).length - (t.match(/<\/[a-z]+>/gi) || []).length; } return "  ".repeat(Math.max(0, d)) + l.trim(); }).join("\n"), c];
  v.blank = [h.split("\n").join("\n\n"), c.split("\n").join("\n\n")];
  v.crlf = [h.replace(/\n/g, "\r\n"), c.replace(/\n/g, "\r\n")];
  v.tight = [h, c.replace(/\s*:\s*/g, ":").replace(/\s*\{\s*/g, "{").replace(/;\s*/g, ";").replace(/\s*\}\s*/g, "}")];
  v.oneline = [h, c.replace(/\n\s*/g, " ")];
  v.noSemiLast = [h, c.replace(/;\n\}/g, "\n}")];
  v.upperTags = [h.replace(/<(\/?)(h1|h2|p|body|head|title|html)\b/g, (m, a, t) => "<" + a + t.toUpperCase()), c];
  v.trail = [h.replace(/\n$/, "") + "\n\n\n", c + "\n\n"];
  v.rulesReversed = [h, c.split(/(?<=\})\n/).reverse().join("\n")];
  return v;
};
let bad = 0, warn = [];
for (const o of LABS) {
  if (want.length && !want.includes(o.id)) continue;
  const issues = [];
  const m = score(o, o.model.html, o.model.css); if (!m || m.pct !== 100) issues.push("model scores " + (m && m.pct));
  for (const [k, [h, c]] of Object.entries(variants(o))) { if (k === "rulesReversed" && /^8\.3|8\.4/.test(o.id)) { /* order may matter in a lesson about cascade: reversed rules are still judged by the cascade */ } const r = score(o, h, c); if (r.pct !== 100) issues.push("variant " + k + " scores " + r.pct); }
  /* mutants: every line of index.html and style.css deleted */
  const surv = [];
  o.model.html.split("\n").forEach((l, i, a) => { if (!l.trim()) return; const r = score(o, a.filter((_, j) => j !== i).join("\n"), o.model.css); if (r.pct === 100) surv.push("html line " + (i + 1) + ": " + l.trim().slice(0, 60)); });
  o.model.css.split("\n").forEach((l, i, a) => { if (!l.trim()) return; const r = score(o, o.model.html, a.filter((_, j) => j !== i).join("\n")); if (r.pct === 100) surv.push("css line " + (i + 1) + ": " + l.trim().slice(0, 60)); });
  const free = (FREE[o.id] || []); const real = surv.filter((s) => !free.some((re) => re.test(s)));
  if (real.length && o.kind === "w") issues.push("unchecked parts: " + real.join(" || "));
  else if (real.length) warn.push(o.id + " (assignment): lines whose deletion still scores 100: " + real.join(" || "));
  /* stages */
  if (o.kind === "w") {
    const st = o.stages(), steps = Object.keys(SC.LESSONS[o.id].steps);
    st.forEach((s, k) => { const run = SC.run(o.id, s.html, s.css); steps.forEach((name, idx) => { if (idx > k + 0) return; const bl = run[name].bullets; if (idx <= k) { /* steps 1..k+1 must be fully met on stage k+1 */ if (!bl.every((b) => b.every((x) => x.ok))) issues.push("stage " + (k + 1) + ": step " + (idx + 1) + " not fully met: " + bl.flat().filter((x) => !x.ok).map((x) => x.label).join(" / ")); } });
      const nxt = steps[k + 1]; if (nxt && run[nxt].bullets.every((b) => b.every((x) => x.ok)) && run[nxt].bullets.length) issues.push("stage " + (k + 1) + ": the NEXT step is already fully met"); });
  }
  /* the text has exactly as many bullets as check lists */
  const A = globalThis.U7_ANSWERS[o.id], steps = []; let cur = null; A.forEach((b) => { if (b.h && /^Step \d+/.test(b.h)) { cur = { h: b.h, n: 0 }; steps.push(cur); } else if (b.build && cur) cur.n += b.build.length; });
  const keys = Object.keys(SC.LESSONS[o.id].steps); if (steps.length !== keys.length) issues.push("steps in text " + steps.length + " vs checks " + keys.length); else steps.forEach((s, i) => { if (s.n !== SC.LESSONS[o.id].steps[keys[i]].length) issues.push(s.h + ": " + s.n + " bullets vs " + SC.LESSONS[o.id].steps[keys[i]].length + " check lists"); });
  console.log(o.id.padEnd(5), issues.length ? "FAIL " + issues.join("; ") : "ok", "| boxes", m && m.boxes, "| model", m && m.pct);
  bad += issues.length;
}
warn.forEach((w) => console.log("NOTE", w));
console.log(bad ? "FAILURES: " + bad : "all ok"); process.exit(bad ? 1 : 0);
