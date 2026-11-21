/* MISSIONS ENGINE: builds the server records for the Walkthrough + Mission pairs.
   A pair = a Walkthrough (50 points, notes + labs, must reach 100 on the auto-checker) that unlocks a Mission (100 points, a game the student programs;
   90 opens the next walkthrough). Records are published to the grading server (see publish.mjs); nothing here runs for students.
   Reuses the step builder from python/appendix-a-core.js (blocks, help popups, checks) and B.seq from python/appendix-b-core.js. */
"use strict";
const path = require("path");
const PYA = require(path.join(__dirname, "../../python/appendix-a-core.js"));
const PYB = require(path.join(__dirname, "../../python/appendix-b-core.js"));
const RECORDS = [];

/* the server runs a check against: the code (comments removed), "comments" = every comment line (text after the #), "notes" = comments that read like sentences,
   "output" = what the program printed. So a "# ROUTER: ..." label is checked with where "comments" and a pattern WITHOUT the #. */
function toRecord(w, o) {
  const rec = PYA.build(Object.assign({}, w, { unit: o.unit }));
  delete rec.apx;
  rec.live = false;                       /* published hidden; the teacher opens it from teacher-settings/python-editor.js */
  rec.num = o.num; rec.points = o.points; rec.seq = o.seq;
  if (o.part) rec.part = o.part;
  if (o.passMin !== undefined) rec.passMin = o.passMin;
  if (w.autoRun) rec.autoRun = w.autoRun;
  rec.checks = rec.checks.map((c) => ({ label: c.label, re: c.re, flags: (c.flags || "").replace(/m/g, "") + "m", min: c.min || 1, pts: 1, where: c.where, box: c.box }));
  if (rec.checks.some((c) => !c.re)) throw new Error(w.title + ": a check has no pattern (functions are not allowed in server checks)");
  return rec;
}
/* A Mission: the student writes the code themselves, so the stages carry a hidden reference solution (ref / refEdit) instead of a code sample.
   The reference is only used by the tests (it must score 100). Returns the walkthrough-style definition to build, plus the reference program for each stage. */
function missionDef(w) {
  const refStages = w.stages.map((s) => ({ title: s.title, add: s.ref, edit: s.refEdit, code: s.refCode }));
  PYB.seq(refStages);
  const stages = w.stages.map((s) => { const c = Object.assign({}, s); delete c.ref; delete c.refEdit; delete c.refCode; return c; });
  return { def: Object.assign({}, w, { stages, check: false, finish: w.finish || [] }), refs: refStages.map((s) => s.code), final: refStages.final };
}
function addMission(slot, w, o) {
  const m = missionDef(w), rec = toRecord(m.def, o); rec.slot = slot;
  RECORDS.push({ slot, rec, w: m.def, refs: m.refs, final: m.final, kind: "mission" }); return rec;
}
function addWalkthrough(slot, w, o) {
  PYB.seq(w.stages);
  const rec = toRecord(w, o); rec.slot = slot;
  RECORDS.push({ slot, rec, w, refs: w.stages.map((s) => s.code), final: w.stages.final, kind: "walkthrough" }); return rec;
}
function add(slot, w, o) { const rec = toRecord(w, o); rec.slot = slot; RECORDS.push({ slot, rec, w }); return rec; }

module.exports = { PYA, PYB, seq: PYB.seq, bring: PYB.bring, add, addMission, addWalkthrough, RECORDS, toRecord, TIPS: PYA.TIPS };
