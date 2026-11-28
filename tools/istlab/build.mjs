// Builds the reading labs (walkthroughs and assignments) for non-code IST units.
//   node tools/istlab/build.mjs
// Reads  tools/istlab/lessons/*.mjs  (one file per lesson, default export = the lesson spec)
// Writes ist/lab/data.js (what the browser sees: NO answers) and netlify/functions/istlab-key.js (answers, hints and explanations: server only)
//
// Authoring shortcuts for an item (all fields below are per item; `id` is made up when left out):
//   mc     { t:"mc", q, c:"the right option", w:["wrong","wrong","wrong"] }           (options are shuffled; right answers rotate through A-D)
//   multi  { t:"multi", q, c:["right","right"], w:["wrong","wrong"] }
//   text   { t:"text", q, a:["accepted answer", ...], re:"optional regex source" }
//   num    { t:"num", q, a:12, tol:0 }
//   order  { t:"order", q, items:["first","second","third"] }                         (list the items in the RIGHT order; they are shuffled for the student)
//   match  { t:"match", q, pairs:[["left","right"], ...] }
//   karel  { t:"karel", q, starter:"function main() {\n  \n}", world:{cols,rows,x,y,dir,balls:[[x,y,n]],walls:[[x,y,"E"|"N"]]}, hidden:[world,...], solution:"reference program",
//           compare:["pos","dir","balls"], rules:{mustDefine:[], mustCall:[], mustUse:["for"], mustNotUse:[], maxCommands:n, maxLines:n, requireMain:true, allowLoose:true, superKarel:true}, wrong:["a program that must fail"], showGoal:true }
//          the expected result is what the reference program does on every world, so nothing is typed twice.
//   write  { t:"write", q, min:20, kw:[["word","alt"],["word"]], need:2 }
//   any item may carry hint (shown when wrong) and why (shown when right and always in the assignment), w (weight).
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { karelCheck } from "../../netlify/functions/istlab-score.js";
new Function(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "ist", "karel", "engine.js"), "utf8")).call(globalThis);
const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, "..", "..");
const dir = path.join(HERE, "lessons");

function rng(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

let rot = 0;   // rotates the position of the right answer so A, B, C and D are used equally
function prepItem(raw, lessonId, kind, n) {
  const id = raw.id || ("q" + n), r = rng(lessonId + kind + id), pub = { id, type: raw.t, q: raw.q }, key = { id, type: raw.t };
  if (raw.w != null && raw.t !== "mc" && raw.t !== "multi") key.w = raw.w;
  if (raw.t === "mc" || raw.t === "multi") {
    const rights = raw.t === "mc" ? [raw.c] : raw.c, all = rights.map((t) => ({ t, ok: true })).concat(raw.w.map((t) => ({ t, ok: false })));
    let opts;
    if (raw.t === "mc") { const wrong = shuffle(raw.w, r), pos = rot++ % (wrong.length + 1); opts = wrong.slice(); opts.splice(pos, 0, raw.c); }
    else opts = shuffle(all.map((x) => x.t), r);
    pub.opts = opts;
    key.a = raw.t === "mc" ? opts.indexOf(raw.c) : rights.map((t) => opts.indexOf(t)).sort((a, b) => a - b);
    if (new Set(opts).size !== opts.length) throw new Error(lessonId + kind + " " + id + ": duplicate options");
    if (raw.t === "multi") pub.hint = undefined;
  } else if (raw.t === "text") { key.a = raw.a || []; if (raw.re) key.re = raw.re; if (raw.ph) pub.ph = raw.ph; }
  else if (raw.t === "num") { key.a = raw.a; key.tol = raw.tol || 0; if (raw.ph) pub.ph = raw.ph; }
  else if (raw.t === "order") {
    let sh, tries = 0; do { sh = shuffle(raw.items.map((_, i) => i), r); tries++; } while (sh.every((v, i) => v === i) && tries < 20);
    pub.items = sh.map((i) => raw.items[i]);
    key.a = raw.items.map((_, rightPos) => sh.indexOf(rightPos));   // displayed index of the item that belongs at each place
  } else if (raw.t === "match") {
    const rights = raw.pairs.map((p) => p[1]); let sh, tries = 0; do { sh = shuffle(rights.map((_, i) => i), r); tries++; } while (sh.every((v, i) => v === i) && tries < 20);
    pub.left = raw.pairs.map((p) => p[0]); pub.right = sh.map((i) => rights[i]);
    key.a = raw.pairs.map((_, i) => sh.indexOf(i));
  } else if (raw.t === "write") { pub.min = raw.min || 15; if (raw.ph) pub.ph = raw.ph; key.min = pub.min; key.kw = raw.kw || []; if (raw.need != null) key.need = raw.need; }
  else if (raw.t === "karel") {
    const K = globalThis.KarelEngine, R = raw.rules || {}, opt = { superKarel: !!R.superKarel, allowLoose: !!R.allowLoose, requireMain: !!R.requireMain, maxSteps: 30000, maxCommands: 3000 };
    const worlds = [raw.world].concat(raw.hidden || []).map((w) => {
      const res = K.run(raw.solution, w, opt); if (!res.ok) throw new Error(lessonId + kind + " " + id + ": the reference solution fails: " + JSON.stringify(res.error));
      return { world: w, expect: { final: res.final } };
    });
    key.solution = raw.solution; key.wrong = raw.wrong || []; key.worlds = worlds; key.compare = raw.compare || ["pos", "dir", "balls"]; key.rules = R;
    const chk = karelCheck(key, raw.solution); if (!chk.ok) throw new Error(lessonId + kind + " " + id + ": reference fails its own check: " + chk.why);
    (raw.wrong || []).forEach((w, i) => { if (karelCheck(key, w).ok) throw new Error(lessonId + kind + " " + id + ": wrong program #" + (i + 1) + " is accepted but should fail"); });
    const req = []; (R.mustDefine || []).forEach((n) => req.push("Define a function called <code>" + n + "</code>")); (R.mustCall || []).forEach((n) => req.push("Call <code>" + n + "()</code>"));
    const W2 = { for: "a for loop", while: "a while loop", if: "an if statement", else: "an else" }; (R.mustUse || []).forEach((n) => req.push("Use " + W2[n])); (R.mustNotUse || []).forEach((n) => req.push("Do not use " + (W2[n] || "<code>" + n + "()</code>")));
    (R.mustNotDefine || []).forEach((n) => req.push("Do not define <code>" + n + "</code>: this Karel already has it")); if (R.minComments) req.push("Include at least " + R.minComments + " comment" + (R.minComments > 1 ? "s" : "")); if (R.commentEachFunction) req.push("Put a comment line above every function"); if (R.indent) req.push("Indent your code correctly (2 or 4 spaces per level)");
    if (R.maxCommands) req.push("Karel may use at most " + R.maxCommands + " commands"); if (R.maxLines) req.push("Use " + R.maxLines + " lines of code or fewer"); if (R.requireMain) req.push("Start your program in <code>function main()</code>");
    if ((raw.hidden || []).length) req.push("It must also work on " + raw.hidden.length + " other world" + (raw.hidden.length > 1 ? "s" : "") + " you cannot see (a different size or layout)");
    pub.starter = raw.starter || "function main() {\n  \n}\n"; pub.world = raw.world; pub.req = req; pub.kopts = { superKarel: !!R.superKarel, allowLoose: !!R.allowLoose, requireMain: !!R.requireMain };
    if (raw.showGoal !== false) pub.goal = worlds[0].expect.final;
  }
  else throw new Error("unknown item type " + raw.t);
  if (raw.hint) key.hint = raw.hint;
  if (raw.why) key.why = raw.why;
  return { pub, key };
}
function prepPart(part, lessonId, kind) {
  const pubSteps = [], items = []; let n = 0; const ids = new Set();
  for (const s of part.steps) {
    const ps = { h: s.h, read: s.read || "", links: s.links || [], items: [] };
    for (const raw of s.items) {
      n++; const { pub, key } = prepItem(raw, lessonId, kind, n);
      if (ids.has(key.id)) throw new Error(lessonId + kind + ": duplicate item id " + key.id); ids.add(key.id);
      if (raw.t === "write" && !key.kw.length) throw new Error(lessonId + kind + " " + key.id + ": write item needs keywords");
      ps.items.push(pub); items.push(key);
    }
    pubSteps.push(ps);
  }
  const pub = Object.assign({}, part, { steps: pubSteps }); delete pub.items;
  return { pub, key: { pts: part.pts, items } };
}

const lessons = {}, keyLessons = {};
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mjs")).sort();
for (const f of files) {
  const spec = (await import(pathToFileURL(path.join(dir, f)).href + "?t=" + Date.now())).default;
  const L = { id: spec.id, title: spec.title, back: spec.back || "../unit-1/index.html" }, K = { title: spec.title };
  for (const k of ["w", "a"]) { if (!spec[k]) continue; const p = prepPart(spec[k], spec.id, k); L[k] = p.pub; K[k] = p.key; }
  lessons[spec.id] = L; keyLessons[spec.id] = K;
}
const byId = (o) => Object.fromEntries(Object.entries(o).sort((a, b) => { const x = a[0].split(".").map(Number), y = b[0].split(".").map(Number); return x[0] - y[0] || x[1] - y[1]; }));
for (const k of Object.keys(lessons)) { /* keep */ }
const lessonsS = byId(lessons), keyS = byId(keyLessons);
fs.writeFileSync(path.join(ROOT, "ist", "lab", "data.js"), "/* GENERATED by tools/istlab/build.mjs: the questions the lab pages show (no answers). */\nwindow.ISTLAB = " + JSON.stringify({ lessons: lessonsS }) + ";\n");
fs.writeFileSync(path.join(ROOT, "netlify", "functions", "istlab-key.js"), "// GENERATED by tools/istlab/build.mjs: answers, hints and explanations. Server only.\nexport default " + JSON.stringify({ lessons: keyS }) + ";\n");
let items = 0; for (const k of Object.values(keyLessons)) for (const p of ["w", "a"]) if (k[p]) items += k[p].items.length;
console.log("lessons:", Object.keys(lessons).join(" "), "| items:", items);
