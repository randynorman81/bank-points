/* THE GRADED ASSIGNMENTS for Units 3 to 6 (the "assignment" part of every lesson: notes, walkthrough, ASSIGNMENT, game).
   Each one is a real-company job (Spotify, Apple, TikTok, Nintendo...) the student solves by writing the program from a description. No code and no hints are shown.
   A student does about half the work of the walkthrough, and the assignment covers its main ideas.
   The reference program for each step is hidden; node tools/missions/test.mjs proves each one scores 100 through the real editor and the real server scorer.
   The content is in asg-u3.js (Unit 3), asg-u4.js (Unit 4) and asg-u5.js (Units 5 and 6); helpers are in asg-kit.js. Slots and points come from py-table.js. All are published hidden and do not gate anything (passMin 0). */
"use strict";
const M = require("./core.js");
const T = require("./py-table.js");
const { ASG } = require("./asg-kit.js");
require("./asg-u3a.js");
require("./asg-u3b.js");
require("./asg-u3c.js");
require("./asg-u4a.js");
require("./asg-u4b.js");
require("./asg-u4c.js");
require("./asg-u5a.js");
require("./asg-u5b.js");
require("./asg-u6.js");

/* ---- build every record (hidden, not gating) ---- */
T.rows.forEach((row) => {
  const a = ASG[row.id]; if (!a) throw new Error("no assignment written for " + row.id);
  const w = { title: "Assignment " + row.n + ": " + a.name, intro: a.intro.concat(["**Scoring:** worth **" + row.pts[0] + " points**. There is no code to copy: read the job, then write the program yourself. Use the names in **bold** exactly. The auto-checker under each box turns green when your code (and its output) has what the step asks for. **100%** is full points."]), learn: a.learn,
    stages: a.stages.map((s) => ({ title: s.title, say: s.say, type: s.type, ref: s.ref, refCode: s.refCode, chk: s.chk, run: s.run, runChk: s.runChk, inp: s.inp })), autoRun: a.auto };
  M.addMission(row.asg, w, { unit: row.UNIT, num: Math.floor(row.wt), points: row.pts[0], seq: row.wt + (row.wt % 1 ? 0.05 : 0.5), passMin: 0, part: "project" });
});
module.exports = { ASG };
