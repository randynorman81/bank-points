// Checks every reading lab: right answers score 100, every single wrong answer fails its item, answer positions are balanced, every item has a hint (walkthrough) or why (assignment).
//   node tools/istlab/test.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { scorePart, itemOk } from "../../netlify/functions/istlab-score.js";
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "..", "..");
const KEY = (await import(pathToFileURL(path.join(ROOT, "netlify/functions/istlab-key.js")).href)).default;
const win = {}; new Function("window", fs.readFileSync(path.join(ROOT, "ist/lab/data.js"), "utf8"))(win);
const PUB = win.ISTLAB;
let fails = 0; const bad = (m) => { fails++; console.log("FAIL", m); };
const pos = [0, 0, 0, 0]; let clear = 0, longest = 0, mcCount = 0;

function rightAnswer(k, p) {
  if (k.type === "mc" || k.type === "multi" || k.type === "order" || k.type === "match") return k.a;
  if (k.type === "text") return k.a[0] || "";
  if (k.type === "num") return k.a;
  if (k.type === "write") return (k.kw.map((g) => g[0]).join(" ") + " " + "word ".repeat(k.min));
}
function wrongAnswers(k, p) {
  const out = [];
  if (k.type === "mc") for (let i = 0; i < p.opts.length; i++) if (i !== k.a) out.push(i);
  if (k.type === "multi") { out.push([]); for (let i = 0; i < p.opts.length; i++) { if (k.a.indexOf(i) < 0) out.push(k.a.concat(i)); else out.push(k.a.filter((x) => x !== i)); } }
  if (k.type === "text") out.push("", "zzz not an answer");
  if (k.type === "num") out.push("", k.a + 1, k.a - 1 - (k.tol || 0), "abc");
  if (k.type === "order") { const n = k.a.length; for (let i = 0; i < n - 1; i++) { const a = k.a.slice(); [a[i], a[i + 1]] = [a[i + 1], a[i]]; out.push(a); } out.push(k.a.slice().reverse().join() === k.a.join() ? [] : k.a.slice().reverse()); }
  if (k.type === "match") { const n = k.a.length; for (let i = 0; i < n; i++) { const a = k.a.slice(); a[i] = (a[i] + 1) % p.right.length; out.push(a); } }
  if (k.type === "write") { out.push("", "too short", "word ".repeat(k.min + 5)); }
  return out;
}
for (const [id, L] of Object.entries(KEY.lessons)) {
  for (const kind of ["w", "a"]) {
    const part = L[kind]; if (!part) continue; const pub = PUB.lessons[id][kind];
    const pubItems = pub.steps.flatMap((s) => s.items);
    if (pubItems.length !== part.items.length) bad(id + kind + " item count mismatch");
    const right = {}; part.items.forEach((k) => { right[k.id] = rightAnswer(k, pubItems.find((x) => x.id === k.id)); });
    const sc = scorePart(part, right); if (sc.pct !== 100) bad(id + kind + " right answers score " + sc.pct + " " + JSON.stringify(sc.results));
    for (const k of part.items) {
      const p = pubItems.find((x) => x.id === k.id);
      if (JSON.stringify(p).indexOf('"a":') > -1 || p.kw || p.re || p.hint || p.why) bad(id + kind + " " + k.id + " leaks answer data to the browser");
      if (k.type === "mc") { pos[k.a]++; mcCount++; const lens = p.opts.map((o) => o.replace(/<[^>]+>/g, "").length); if (lens[k.a] === Math.max(...lens) && lens.filter((x) => x === lens[k.a]).length === 1) { longest++; if (lens[k.a] > 1.25 * Math.max(...lens.filter((_, i) => i !== k.a))) { clear++; if (process.env.SHOWLONG) console.log('  CLEAR', id + kind, k.id); } const others = lens.filter((_, i) => i !== k.a); if (process.env.SHOWLONG) console.log('  longest', id + kind, k.id, 'right', lens[k.a], 'others', others.join('/')); } }
      for (const w of wrongAnswers(k, p)) { if (itemOk(k, w)) bad(id + kind + " " + k.id + " wrong answer accepted: " + JSON.stringify(w)); }
      if (kind === "w" && !k.hint) bad(id + kind + " " + k.id + " has no hint");
      if (kind === "a" && !k.why) bad(id + kind + " " + k.id + " has no explanation");
      if (k.type === "text" && !k.a.length && !k.re) bad(id + kind + " " + k.id + " text item has no accepted answers");
    }
    console.log(id + kind, "items", part.items.length, "right answers ->", sc.pct);
  }
}
console.log("clearly longer (25%+):", clear, "of", mcCount); if (mcCount && clear / mcCount > 0.2) bad("too many right answers are clearly the longest option"); console.log("mc answer positions A-D:", pos.join("/"), "| right option strictly longest:", mcCount ? Math.round(100 * longest / mcCount) + "%" : "n/a");
console.log("failures:", fails); process.exit(fails ? 1 : 0);
