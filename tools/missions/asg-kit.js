/* Helpers shared by the assignment files (asg-u3.js, asg-u4.js, asg-u5.js). Not loaded by index.js on its own. */
"use strict";
const V = (n, v) => new RegExp("^\\s*" + n + "\\s*=\\s*" + (v || "\\S"), "m");                 /* a variable assignment, optionally with a value pattern */
const FN = (n, p) => new RegExp("^\\s*def\\s+" + n + "\\s*\\(\\s*" + (p === undefined ? "" : p) + "\\s*\\)\\s*:", "m");
const note = (label, words) => new RegExp("^\\s*" + label + ":\\s*\\S+(?:\\s+\\S+){" + ((words || 3) - 1) + ",}", "i");   /* a labeled comment with at least N words (default 3) */
const S = (title, say, type, ref, chk, run, rc, refCode) => ({ title, say: Array.isArray(say) ? say : [say], type, ref, chk, run, runChk: rc, refCode });   /* ref = lines ADDED to the hidden solution; refCode = the whole solution so far */
/* A STRETCH step: optional extra-credit work after the regular steps. Every check in it is worth +1 bonus point (they add on top of the 100 once the regular work is complete). */
const X = (title, say, type, ref, chk, run, rc, refCode) => {
  const s = S("Stretch: " + title, say, type, ref, chk, run, rc, refCode), tag = (c) => ["Bonus (+1): " + c[0]].concat(c.slice(1));
  s.chk = (s.chk || []).map(tag); s.runChk = s.runChk ? s.runChk.map(tag) : undefined; return s;
};
const ASG = {};
const def = (id, name, intro, learn, stages, auto) => { ASG[id] = { name, intro, learn, stages, auto }; };
module.exports = { V, FN, note, S, X, ASG, def };
