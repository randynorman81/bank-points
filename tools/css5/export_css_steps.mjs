/* adds the Unit 5 walkthrough text (ist/unit-6/css-labs*.js) to tools/guides/work/ist/lab_steps.json for the printed guides. Run after export_lab.mjs. */
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js"].forEach((f) => require(D + f));
const f = "/Users/randynorman/bank-points/tools/guides/work/ist/lab_steps.json"; const out = JSON.parse(fs.readFileSync(f, "utf8"));
for (const id of ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"]) out[id] = globalThis.U7_ANSWERS[id + "w"];
fs.writeFileSync(f, JSON.stringify(out)); console.log(Object.keys(out).length, "walkthroughs");
