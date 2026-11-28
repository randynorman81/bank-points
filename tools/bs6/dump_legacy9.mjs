/* prints the text students see for the older (non-walkthrough) Unit 3/4 assignments as JSON, for audit_order.py (legacy). Loads the files in the same order as the editor. */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = new URL("../../ist/unit-6/", import.meta.url).pathname;
globalThis.window = undefined;
["concepts.js","checklist-config.js","answers.js","answers-early.js","answers-html2.js","answers-v2.js","answers-site.js","answers-u3.js","answers-w.js","answers-w2.js","html-check.js","lab-lessons.js","step-checks.js","step-checks-a.js","step-checks-b.js","step-checks-w.js","step-checks-w2.js","tips-web.js"].forEach((f) => { try { require(D + f); } catch (e) { console.error("ERR", f, e.message); } });
const A = globalThis.U7_ANSWERS, SC = globalThis.U7_STEPCHECKS, C = globalThis.U7_CONCEPTS, H = globalThis.HTMLCheck;
const out = {};
for (const id of ["9.1","9.2","9.3","9.4","9.5","9.6"]) {
  const L = SC.LESSONS[id]; const chk = [];
  if (L) for (const [st, groups] of Object.entries(L.steps || {})) for (const g of groups) for (const it of g) chk.push(it && (it.label || it[0] || String(it)));
  const r = C.reviewFor(id), n = C.newFor(id);
  const HL = H.LESSONS[id];
  out[id] = { answers: JSON.stringify(A[id] || ""), checks: chk, concepts: JSON.stringify(n || "") , rules: ((HL && HL.rules) || []).map(x => x.label || ""), hasStep: !!L };
}
console.log(JSON.stringify(out));
