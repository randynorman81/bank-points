/* Helpers shared by the assignment files (asg-u3.js, asg-u4.js, asg-u5.js). Not loaded by index.js on its own. */
"use strict";
const V = (n, v) => new RegExp("^\\s*" + n + "\\s*=\\s*" + (v || "\\S"), "m");                 /* a variable assignment, optionally with a value pattern */
const FN = (n, p) => new RegExp("^\\s*def\\s+" + n + "\\s*\\(\\s*" + (p === undefined ? "" : p) + "\\s*\\)\\s*:", "m");
const note = (label, words) => new RegExp("^\\s*" + label + ":\\s*\\S+(?:\\s+\\S+){" + ((words || 3) - 1) + ",}", "i");   /* a labeled comment with at least N words (default 3) */
const S = (title, say, type, ref, chk, run, rc, refCode) => ({ title, say: Array.isArray(say) ? say : [say], type, ref, chk, run, runChk: rc, refCode });   /* ref = lines ADDED to the hidden solution; refCode = the whole solution so far */
const ASG = {};
const def = (id, name, intro, learn, stages, auto) => { ASG[id] = { name, intro, learn, stages, auto }; };
module.exports = { V, FN, note, S, ASG, def };
