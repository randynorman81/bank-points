// Runs the PAGE'S OWN grading function (python/parsons.html) over every ordering of every Parsons problem and compares with what real Python accepted (tools/qa/_parsons_ok.json, written by parsons_exhaustive.py).
// Also: every accepted ordering with ANY wrong piece added at EVERY position must be rejected; every accepted ordering with ONE line missing must be rejected.
import fs from "fs"; import vm from "vm";
const root = "/Users/randynorman/bank-points/";
const html = fs.readFileSync(root + "python/parsons.html", "utf8");
const g = html.slice(html.indexOf("function grade(placed, P)"), html.indexOf("function bt(t)"));
const ctx = {}; vm.createContext(ctx); vm.runInContext(g + "; this.grade = grade;", ctx);
const OK = JSON.parse(fs.readFileSync(root + "tools/qa/_parsons_ok.json", "utf8"));
const FILES = { 3: ["parsons-u3.js", "PARSONS"], 4: ["parsons-u4.js", "PARSONS4"], 5: ["parsons-u5.js", "PARSONS5"] };
function perms(a) { if (a.length <= 1) return [a.slice()]; const out = [], seen = new Set(); for (let i = 0; i < a.length; i++) { if (seen.has(a[i])) continue; seen.add(a[i]); const rest = a.slice(0, i).concat(a.slice(i + 1)); for (const p of perms(rest)) out.push([a[i]].concat(p)); } return out; }
let checked = 0, wrong = 0, ran = 0;
for (const u of [3, 4, 5]) {
  const sb = { window: {} }; vm.createContext(sb); vm.runInContext(fs.readFileSync(root + "python/" + FILES[u][0], "utf8"), sb);
  const D = sb.window[FILES[u][1]];
  for (const [lid, L] of Object.entries(D.lessons)) L.problems.forEach((P, k) => {
    checked++; const ids = {}; let n = 0; P.sol.forEach((t) => { if (!(t in ids)) ids[t] = n++; });
    const texts = Object.keys(ids), seq = P.sol.map((t) => ids[t]), good = new Set(OK[lid][k]);
    const mk = (order) => order.map((i) => ({ t: texts[i], d: false }));
    for (const perm of perms(seq)) { ran++; const key = perm.join(""), r = ctx.grade(mk(perm), P); if (r.full !== good.has(key)) { wrong++; console.log("DISAGREE", lid, k + 1, key, "page says", r.full, "real Python says", good.has(key)); } }
    const dis = P.pieces.filter((p) => p.d).map((p) => p.t);
    for (const key of good) { const order = key.split("").map(Number);
      for (const d of dis) for (let pos = 0; pos <= order.length; pos++) { const arr = mk(order); arr.splice(pos, 0, { t: d, d: true }); ran++; if (ctx.grade(arr, P).full) { wrong++; console.log("ACCEPTED a wrong piece", lid, k + 1, d, pos); } }
      for (let drop = 0; drop < order.length; drop++) { const arr = mk(order); arr.splice(drop, 1); ran++; if (ctx.grade(arr, P).full) { wrong++; console.log("ACCEPTED a missing line", lid, k + 1, drop); } } }
  });
}
console.log("Parsons problems: " + checked + " | arrangements graded by the page: " + ran + " | disagreements with real Python: " + wrong);
process.exit(wrong ? 1 : 0);
