/* dumps, for each Unit 3 assignment, every step: its text, its checks (indexed), its run checks, and the OUTPUT of the reference program at that step (so the "What you should see" boxes are exact) */
import { createRequire } from "module"; import fs from "fs"; import { execFileSync } from "child_process";
const require = createRequire(import.meta.url);
const core = require("./index.js"); const { ASG } = require("./asg-kit.js");
const T = require("./py-table.js");
const out = {};
for (const row of T.rows) {
  if (!/^u[34]l/.test(row.id)) continue;
  const r = core.RECORDS.find((x) => x.slot === row.asg); const a = ASG[row.id];
  const answers = (a.auto && a.auto[0] && a.auto[0].answers) || [];
  const stages = a.stages.map((s, k) => {
    const code = r.refs[k];
    return { title: s.title, say: s.say, type: s.type, chk: (s.chk || []).map((c) => c[0]), run: s.run, runChk: (s.runChk || []).map((c) => c[0]), code };
  });
  out[row.id] = { slot: row.asg, name: a.name, answers: answers.map((x) => x[1]), stages };
}
fs.writeFileSync(new URL("./testkit/u34-dump.json", import.meta.url), JSON.stringify(out));
console.log("dumped", Object.keys(out).length);
