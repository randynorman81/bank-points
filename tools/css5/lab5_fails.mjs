import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js"].forEach((f) => { try { require(D + f); } catch (e) { if (!/Cannot find/.test(e.message)) throw e; } });
const SC = globalThis.U7_STEPCHECKS, LABS = SC.W.CSS.LABS;
for (const o of LABS) { if (process.argv[2] && o.id !== process.argv[2]) continue; const r = SC.run(o.id, o.model.html, o.model.css); Object.keys(r).forEach((s) => r[s].bullets.forEach((b) => b.forEach((x) => { if (!x.ok) console.log(o.id, s, "FAIL:", x.label); }))); }
