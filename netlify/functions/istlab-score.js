// Scoring for the IST reading labs (walkthroughs and assignments for units with no code to check).
// Pure functions: the server (istlab.js) and the tests (tools/istlab/test.mjs) both use this file.
// An ITEM is { id, type, ...answer }.  Types:
//   mc     a: index of the right option
//   multi  a: [indexes]            all right options and no wrong ones
//   text   a: ["accepted answer", ...]  (compared after lower-casing and dropping punctuation)   re: optional regular-expression source
//   num    a: number, tol: allowed difference (default 0)
//   order  a: [indexes in the right order]   (the student orders the items listed in `items`)
//   match  a: [right-hand index for each left-hand row]
//   write  min: minimum words, kw: [[alt, alt], [alt]] each group needs one of its words (case-insensitive), need: groups required (default all)
export function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9.%$' -]+/g, " ").replace(/\s+/g, " ").trim().replace(/\.$/, ""); }
export function words(s) { return (String(s || "").match(/[A-Za-z0-9'’-]+/g) || []).length; }
const sameSet = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) > -1);
export function itemOk(it, v) {
  try {
    switch (it.type) {
      case "mc": return Number(v) === it.a;
      case "multi": { const arr = (Array.isArray(v) ? v : []).map(Number); return sameSet(arr.slice().sort(), it.a.slice().sort()) && new Set(arr).size === arr.length; }
      case "text": { const n = norm(v); if (!n) return false; if (it.a && it.a.some((x) => norm(x) === n)) return true; return !!(it.re && new RegExp(it.re, "i").test(n)); }
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
  const results = {}; let got = 0, tot = 0;
  for (const it of part.items) {
    const w = it.w || 1; tot += w; const ok = itemOk(it, answers ? answers[it.id] : undefined); results[it.id] = ok; if (ok) got += w;
  }
  return { pct: tot ? Math.round((100 * got) / tot) : 0, right: Object.values(results).filter(Boolean).length, total: part.items.length, results };
}
