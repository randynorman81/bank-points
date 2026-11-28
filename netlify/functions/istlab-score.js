// Scoring for the IST reading labs (walkthroughs and assignments for units with no code to check).
// Pure functions: the server (istlab.js) and the tests (tools/istlab/test.mjs) both use this file.
// An ITEM is { id, type, ...answer }.  Types:
//   mc     a: index of the right option
//   multi  a: [indexes]            all right options and no wrong ones
//   text   a: ["accepted answer", ...]  (compared after lower-casing and dropping punctuation)   re: optional regular-expression source
//   num    a: number, tol: allowed difference (default 0)
//   order  a: [indexes in the right order]   (the student orders the items listed in `items`)
//   match  a: [right-hand index for each left-hand row]
//   karel  worlds: [{world, expect:{final}}], compare: ["pos","dir","balls"], rules: {...}   the answer is the student's Karel program (text); it is run on every world and compared with the reference result
//   write  min: minimum words, kw: [[alt, alt], [alt]] each group needs one of its words (case-insensitive), need: groups required (default all)
import "../../ist/karel/engine.js";   // puts KarelEngine on globalThis (plain script, no eval)
export function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9.%$' -]+/g, " ").replace(/\s+/g, " ").trim().replace(/\.$/, ""); }
export function words(s) { return (String(s || "").match(/[A-Za-z0-9'’-]+/g) || []).length; }
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) > -1);
const KARRULES = { for: /\bfor\s*\(/, while: /\bwhile\s*\(/, if: /\bif\s*\(/, else: /\belse\b/ };
const KWORD = { for: "a for loop", while: "a while loop", if: "an if statement", else: "an else" };
// consistent indentation: every line is indented by (nesting depth x 2) or (nesting depth x 4) spaces, and a closing brace lines up with the line that opened it
export function indentProblem(code) {
  const lines = String(code).split("\n"); let best = null;
  for (const unit of [2, 4]) {
    let depth = 0, bad = null;
    for (let i = 0; i < lines.length && !bad; i++) {
      const raw = lines[i], t = raw.trim(); if (!t || /^\/\//.test(t)) continue;
      const lead = /^[ \t]*/.exec(raw)[0]; if (lead.indexOf("\t") > -1) { bad = "Line " + (i + 1) + " is indented with a tab. Use spaces."; break; }
      const closes = (t.match(/^\}+/) || [""])[0].length, d = Math.max(0, depth - closes);
      if (lead.length !== d * unit) bad = "Line " + (i + 1) + " should be indented " + d * unit + " spaces (" + d + " level" + (d === 1 ? "" : "s") + ") but has " + lead.length + ".";
      depth += (t.match(/\{/g) || []).length - (t.match(/\}/g) || []).length;
    }
    if (!bad) return null; if (!best) best = bad;
  }
  return best;
}
// the Karel check: returns { ok, why } where why says which world or rule failed
export function karelCheck(it, code) {
  const K = globalThis.KarelEngine; code = String(code == null ? "" : code);
  if (code.length > 8000) return { ok: false, why: "That program is too long." };
  if (!code.trim()) return { ok: false, why: "Write your program first." };
  const R = it.rules || {}, clean = K.stripComments(code), opt = { superKarel: !!R.superKarel, allowLoose: !!R.allowLoose, requireMain: !!R.requireMain, maxSteps: 30000, maxCommands: 3000 };
  const first = K.run(code, it.worlds[0].world, opt);
  for (const name of R.mustDefine || []) if (first.defined.indexOf(name) < 0) return { ok: false, why: "Define a function named " + name + " (function " + name + "() { ... })." };
  for (const name of R.mustCall || []) if (!(new RegExp("\\b" + name + "\\s*\\(")).test(clean)) return { ok: false, why: "Your program should call " + name + "()." };
  for (const kw of R.mustUse || []) if (!KARRULES[kw].test(clean)) return { ok: false, why: "Your program should use " + KWORD[kw] + "." };
  for (const kw of R.mustNotUse || []) { const re = KARRULES[kw] || new RegExp("\\b" + kw + "\\s*\\("); if (re.test(clean)) return { ok: false, why: "This task asks you not to use " + (KWORD[kw] || kw + "()") + "." }; }
  for (const name of R.mustNotDefine || []) if (first.defined.indexOf(name) > -1) return { ok: false, why: "You do not need to define " + name + "() here. This Karel already has it built in." };
  if (R.minComments) { const n = (code.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) || []).length; if (n < R.minComments) return { ok: false, why: "Add comments: this task needs at least " + R.minComments + " (a // note explaining what the code is for)." }; }
  if (R.commentEachFunction) { for (const name of first.defined) { if (name === "main" && R.commentEachFunction === "helpers") continue; if (!(new RegExp("(\\/\\/[^\\n]*\\n|\\*\\/)\\s*function\\s+" + name + "\\b")).test(code)) return { ok: false, why: "Put a comment line right above function " + name + " that says what it does." }; } }
  if (R.indent) { const bad = indentProblem(code); if (bad) return { ok: false, why: bad }; }
  if (R.maxLines && clean.split("\n").filter((l) => l.trim()).length > R.maxLines) return { ok: false, why: "That is more than " + R.maxLines + " lines of code. Look for a shorter way." };
  for (let i = 0; i < it.worlds.length; i++) {
    const w = it.worlds[i], res = i === 0 ? first : K.run(code, w.world, opt);
    const c = K.compare(res, w.expect, it.compare);
    if (!c.ok) return { ok: false, why: (it.worlds.length > 1 ? (i === 0 ? "On the world shown: " : "On another world (" + (i + 1) + " of " + it.worlds.length + ", a different size or layout): ") : "") + c.why };
    if (R.maxCommands && res.commands > R.maxCommands) return { ok: false, why: "Karel used " + res.commands + " commands; the goal is " + R.maxCommands + " or fewer. Look for a loop or a function that saves steps." };
  }
  return { ok: true };
}
export function itemOk(it, v) {
  try {
    switch (it.type) {
      case "karel": return karelCheck(it, v).ok;
      case "mc": return Number(v) === it.a;
      case "multi": { const arr = (Array.isArray(v) ? v : []).map(Number); return sameSet(arr.slice().sort(), it.a.slice().sort()) && new Set(arr).size === arr.length; }
      case "text": { const raw = String(v == null ? "" : v).trim(); if (raw && it.a && it.a.some((x) => String(x).trim() === raw)) return true; const n = norm(v); if (!n) return false; if (it.a && it.a.some((x) => norm(x) === n)) return true; return !!(it.re && new RegExp(it.re, "i").test(n)); }
      case "num": { const m = String(v == null ? "" : v).replace(/,/g, "").match(/-?\d+(\.\d+)?/); if (!m) return false; return Math.abs(parseFloat(m[0]) - it.a) <= (it.tol || 0); }
      case "order": { const arr = (Array.isArray(v) ? v : []).map(Number); return arr.length === it.a.length && arr.every((x, i) => x === it.a[i]); }
      case "match": { const arr = (Array.isArray(v) ? v : []).map(Number); return arr.length === it.a.length && arr.every((x, i) => x === it.a[i]); }
      case "write": {
        const t = String(v || ""); if (words(t) < (it.min || 1)) return false;
        const low = t.toLowerCase(); const groups = it.kw || []; const hit = groups.filter((g) => g.some((w) => low.indexOf(w.toLowerCase()) > -1)).length;
        return hit >= (it.need == null ? groups.length : it.need);
      }
    }
  } catch (e) { return false; }
  return false;
}
// score a part ("w" or "a") of one lesson: returns { pct: 0-100, right, total, results: {id: true|false} }
export function scorePart(part, answers) {
  const results = {}, notes = {}; let got = 0, tot = 0;
  for (const it of part.items) {
    const w = it.w || 1; tot += w; let ok;
    if (it.type === "karel") { const c = karelCheck(it, answers ? answers[it.id] : undefined); ok = c.ok; if (!ok) notes[it.id] = c.why; } else ok = itemOk(it, answers ? answers[it.id] : undefined);
    results[it.id] = ok; if (ok) got += w;
  }
  return { pct: tot ? Math.round((100 * got) / tot) : 0, right: Object.values(results).filter(Boolean).length, total: part.items.length, results, notes };
}
