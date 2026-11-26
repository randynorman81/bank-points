/* Walkthrough STAGES: on the page a student has after finishing step k, every box of steps 1..k must be met (so nothing is "undone" by a later step),
   and the NEXT step must not already be fully met (so a box never ticks before the student does the work). Step 1 content that later steps change is written to allow it. */
import { createRequire } from "module";
import { STAGES } from "./lab_stages.mjs";
import { MODELS } from "./lab_models.mjs";
const require = createRequire(import.meta.url), D = "../../ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js"].forEach((f) => require(D + f));
const SC = globalThis.U7_STEPCHECKS;
let bad = 0;
for (const [id, stages] of Object.entries(STAGES)) {
  const steps = Object.keys(SC.LESSONS[id].steps);
  const notes = [];
  /* the last stage must equal the model */
  const fin = SC.run(id, stages[stages.length - 1], ""), mod = SC.run(id, MODELS[id], "");
  const fullOk = (r, st) => r[st].bullets.every((b) => b.every((x) => x.ok));
  stages.forEach((page, k) => {
    const r = SC.run(id, page, "");
    for (let s = 0; s <= k; s++) { const st = steps[s]; r[st].bullets.forEach((b, bi) => b.forEach((x) => { if (!x.ok) { notes.push("stage " + (k + 1) + ": " + st + " bullet " + (bi + 1) + " NOT met: " + x.label); bad++; } })); }
    const nx = steps[k + 1];
    if (nx && r[nx].bullets.some((b) => b.length) && r[nx].bullets.filter((b) => b.length).every((b) => b.every((x) => x.ok)) && k + 1 < steps.length - 1) { notes.push("stage " + (k + 1) + ": the next step (" + nx + ") is ALREADY fully met"); bad++; }
  });
  const modOk = steps.slice(0, -1).every((st) => fullOk(mod, st)), finOk = steps.slice(0, -1).every((st) => fullOk(fin, st));
  if (!modOk || !finOk) { notes.push("final stage / model not fully met"); bad++; }
  console.log(id.padEnd(7), stages.length + " stages", notes.length ? "\n   " + notes.join("\n   ") : "ok");
}
process.exit(bad ? 1 : 0);
