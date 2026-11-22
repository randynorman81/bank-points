/* GAME LOGIC TEST (offline). For many random seeds of every game: every round is well formed, the public question never contains the answer,
   every round is solvable, a perfect player scores 100, wrong answers are marked wrong, and the same seed always gives the same game.
   usage: node tools/missions/gametest.mjs */
import { GAMES, ROUNDS, STRIKES, NODES, EDGES, makeQuestion, checkAnswer, roundsOf } from "../../netlify/functions/gamebank.js";
let bad = 0; const seen = {}; const say = (m) => { bad++; const k = m.replace(/seed \d+ /, "").replace(/\d+/g, "N"); seen[k] = (seen[k] || 0) + 1; if (seen[k] <= 2) console.log("  PROBLEM: " + m); };
const linked = (a, b) => EDGES.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
const nbrs = (n) => EDGES.flatMap((e) => (e[0] === n ? [e[1]] : e[1] === n ? [e[0]] : []));
function bfsPath(src, dst, down) { if (down.includes(src) || down.includes(dst)) return null; const prev = { [src]: null }, q = [src]; while (q.length) { const n = q.shift(); if (n === dst) { const p = []; for (let x = dst; x; x = prev[x]) p.unshift(x); return p; } nbrs(n).forEach((m) => { if (!(m in prev) && !down.includes(m)) { prev[m] = n; q.push(m); } }); } return null; }
function applyOps(start, ops) { const l = start.slice(); for (const op of ops) { const [k, a, b] = op.split(":"); if (k === "append") l.push(a); else if (k === "insert") l.splice(Number(a), 0, b); else if (k === "remove") { const i = l.indexOf(a); if (i < 0) return null; l.splice(i, 1); } else if (k === "pop") { if (!l.length) return null; l.pop(); } else return null; } return l; }
function solveOps(q) { const P = q.palette, want = q.target.join("|"); const go = (seq) => { if (applyOps(q.start, seq) && applyOps(q.start, seq).join("|") === want) return seq; if (seq.length >= q.max) return null; for (const p of P) { const r = go(seq.concat([p])); if (r) return r; } return null; }; return go([]); }
function solve(game, x) {
  const a = x.a;
  if ("idx" in a) return { idx: a.idx };
  if ("value" in a) return { value: a.value };
  if (a.values) return { values: a.values };
  if (a.rows) return { rows: a.rows };
  if (a.rgb) return { rgb: a.rgb };
  if (x.q.type === "route") return a.none ? { none: true } : { path: bfsPath(a.src, a.dst, a.down) };
  if (x.q.type === "assemble") return { order: Array.from({ length: a.total }, (_, k) => k + 1) };
  if (x.q.type === "missing") return { missing: a.gone };
  if (x.q.type === "ops") { const s = solveOps(x.q); return s ? { ops: s } : null; }
  return null;
}
const wrongFor = (game, x) => {
  const a = x.a, q = x.q;
  if ("idx" in a) return { idx: (a.idx + 1) % (q.choices ? q.choices.length : (q.cast || []).length || 2) };
  if ("value" in a) return { value: a.value + 1 };
  if (a.values) return { values: a.values.map((v) => v + 1) };
  if (a.rows) return { rows: a.rows.map((r, k) => (k === 0 ? r.split("").map((c) => (c === "1" ? "0" : "1")).join("") : r)) };
  if (a.rgb) return { rgb: a.rgb.map((v) => (v === 255 ? 0 : 255)) };
  if (q.type === "route") return a.none ? { path: ["Home", "R1"] } : { none: true };
  if (q.type === "assemble") return { order: Array.from({ length: a.total }, (_, k) => a.total - k) };
  if (q.type === "missing") return { missing: [] };
  if (q.type === "ops") return { ops: [] };
  return { timeout: true };
};
const dash = /[—–]/;
for (const game of Object.keys(GAMES)) {
  let rounds = 0, prompts = new Set(), types = new Set();
  for (let s = 1; s <= 400; s++) {
    const seed = (s * 2654435761) >>> 0; const inRun = new Set();
    for (let i = 0; i < roundsOf(game); i++) {
      const x = makeQuestion(game, seed, i), y = makeQuestion(game, seed, i), q = x.q;
      rounds++; types.add(q.type); prompts.add(q.prompt);
      if (/^(vault|castle|signal|u\d+l)/.test(game)) { const key = q.prompt + "|" + (q.code || ""); if (inRun.has(key)) say(`${game} seed ${seed} r${i}: the same question appears twice in one game (${q.prompt.slice(0, 50)})`); inRun.add(key); }
      if (JSON.stringify(x) !== JSON.stringify(y)) say(`${game} seed ${seed} round ${i}: not repeatable`);
      if (!q.prompt || typeof q.t !== "number") say(`${game} round ${i}: missing prompt or time`);
      if (dash.test(JSON.stringify(q)) || dash.test(x.why || "")) say(`${game} round ${i}: dash character in text`);
      if (JSON.stringify(q).indexOf('"sol"') > -1 || "a" in q || "idx" in q || "gone" in q || "answer" in q) say(`${game} round ${i}: the public question leaks the answer`);
      if (!x.why) say(`${game} round ${i}: no explanation`);
      if (q.type === "choice") { if (!q.choices || q.choices.length < 2 || q.choices.length > 4) say(`${game} r${i}: ${q.choices && q.choices.length} choices (${q.prompt.slice(0, 40)})`); if (new Set(q.choices).size !== q.choices.length) say(`${game} r${i}: duplicate choices`); if (!(x.a.idx >= 0 && x.a.idx < q.choices.length)) say(`${game} r${i}: right answer is not among the choices`); }
      const ans = solve(game, x);
      if (!ans) { say(`${game} seed ${seed} r${i} (${q.type}): NO SOLUTION found`); continue; }
      if (!checkAnswer(game, x.a, ans)) say(`${game} seed ${seed} r${i} (${q.type}): the perfect answer was marked wrong`);
      const w = wrongFor(game, x);
      if (checkAnswer(game, x.a, w)) say(`${game} seed ${seed} r${i} (${q.type}): a wrong answer was marked right`);
      if (checkAnswer(game, x.a, { timeout: true }) || checkAnswer(game, x.a, null) || checkAnswer(game, x.a, {}) || checkAnswer(game, x.a, { idx: "x", path: 5, order: "no" })) say(`${game} r${i}: junk answers must be wrong`);
    }
  }
  console.log(`${game.padEnd(8)} ${rounds} rounds checked over 400 seeds, ${prompts.size} different prompts, types: ${[...types].join(", ")}`);
}
/* a perfect run is 100, one mistake is 90, three mistakes end the game */
console.log(`rules: ${ROUNDS} rounds, ${STRIKES} strikes end the game; 9 of 10 right = ${Math.round(9 / ROUNDS * 100)}%`);
console.log(bad ? `\n${bad} PROBLEMS` : "\nall the games: every round is solvable, never leaks the answer, and marks right and wrong correctly");
process.exit(bad ? 1 : 0);
