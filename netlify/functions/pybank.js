/* PYTHON LESSON VAULTS: one 10-round game for each Python lesson in Units 3 to 6 (the third part of every lesson: notes, walkthrough, assignment, GAME).
   Same engine and rules as the Unit 8 lesson vaults (gamebank.js): questions are made here on the server from a seed, answers never leave the server.
   Every code question also carries x.py = { code, out, inp } (the program and exactly what it prints) so tools/missions/pycheck.mjs can run each one
   in real Python and prove the answer key is right. x.py is never sent to the browser. */
import { unit3 } from "./pybank3.js";
import { unit4to6 } from "./pybank4.js";

export function buildPyVaults(H) {
  const { int, pick, shuffle, uniq, M3, G, PG } = H;
  const NAMES = ["Ava", "Ben", "Cara", "Dev", "Eli", "Fay", "Gus", "Hana", "Ivy", "Jon", "Kai", "Lena", "Max", "Nia", "Omar", "Pia", "Quinn", "Rae", "Sam", "Tess"];
  const ITEMS = ["apples", "pencils", "tickets", "cookies", "stickers", "books", "coins", "cards", "marbles", "stamps"];
  const WORDS = ["python", "coding", "banana", "purple", "rocket", "silver", "planet", "castle", "dragon", "forest", "garden", "bridge", "market", "puzzle", "button", "window", "pirate", "jungle", "turtle", "guitar"];
  const VARS = ["score", "lives", "total", "count", "points", "coins", "level", "speed", "bonus", "price", "age", "width", "height", "steps", "money"];
  const fl = (x) => (Number.isInteger(x) ? x.toFixed(1) : String(x));          /* how Python prints a float */
  const fdiv = (a, b) => Math.floor(a / b), pmod = (a, b) => ((a % b) + b) % b;
  const q1 = (s) => '"' + s + '"';
  /* Python slice of a string (step may be negative) */
  const sliceOf = (s, a, b, st) => {
    const n = s.length; st = st || 1; let out = "";
    if (st > 0) { let i = a === null ? 0 : a < 0 ? Math.max(0, n + a) : Math.min(a, n); const j = b === null ? n : b < 0 ? Math.max(0, n + b) : Math.min(b, n); for (; i < j; i += st) out += s[i]; }
    else { let i = a === null ? n - 1 : a < 0 ? n + a : Math.min(a, n - 1); const j = b === null ? -1 : b < 0 ? n + b : b; for (; i > j && i >= 0; i += st) out += s[i]; }
    return out;
  };
  /* a code question: "What does this program print?" The wrong answers are real mistakes students make. py is the test hook. */
  const run = (r, prompt, code, out, wrong, why, opt) => {
    /* several printed lines are shown on one line joined with " then "; no output at all is shown as "Nothing is printed" */
    const shown = out === "" ? "Nothing is printed" : String(out).split("\n").join(" then ");
    const x = M3(r, prompt, shown, wrong, why, { code }, (opt && opt.t) || 40);
    x.py = opt && opt.fake ? null : { code, out, inp: (opt && opt.inp) || [], err: (opt && opt.err) || "" };
    return x;
  };
  const fact = (r, p, right, wrong, why) => M3(r, p, right, wrong, why, {}, 30);
  /* round the number of wrong answers up to three using near misses */
  const near = (n, k) => [n + 1, n - 1, n + 2, n - 2, n * 2, n + 10, n - 10, k].filter((v) => v !== undefined && v !== n);
  const K = { H, int, pick, shuffle, uniq, M3, G, PG, NAMES, ITEMS, WORDS, VARS, fl, fdiv, pmod, q1, sliceOf, run, fact, near };
  /* an arithmetic expression question: print(a OP b) */
  K.gExpr = (key, ops, lo, hi, tag) => G(key, (r) => {
    const op = pick(r, ops); let a = int(r, lo, hi), b = int(r, Math.max(2, lo), Math.min(hi, 12)); if (op === "/") b = pick(r, [2, 4, 5, 8, 10]); else if (op === "//" || op === "%") b = pick(r, [2, 3, 4, 5, 6, 7, 8]); if (op === "**") { a = int(r, 2, 6); b = int(r, 2, 4); }
    if (op === "-" && a < b) { const t = a; a = b; b = t; }
    const val = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : op === "/" ? a / b : op === "//" ? fdiv(a, b) : op === "%" ? pmod(a, b) : Math.pow(a, b);
    const out = op === "/" ? fl(val) : String(val), code = "print(" + a + " " + op + " " + b + ")";
    const wrong = op === "/" ? [String(a / b), String(fdiv(a, b)), String(pmod(a, b)), fl(a * b)] : op === "//" ? [fl(a / b), String(Math.ceil(a / b)), String(pmod(a, b)), String(Math.round(a / b))] : op === "%" ? [String(fdiv(a, b)), fl(a / b), String(b - pmod(a, b)), String(a)] : op === "**" ? [String(a * b), String(a + b), String(Math.pow(b, a)), String(a * a + b)] : near(val).map(String);
    const why = { "+": "Plain addition.", "-": "Plain subtraction.", "*": "Multiplication uses *.", "/": "A single slash is true division. It ALWAYS gives a float, even when the answer is whole, so it ends in .0 when there is no remainder.", "//": "Two slashes is floor division: divide, then throw away everything after the decimal point (round DOWN). " + a + " // " + b + " = " + val + ".", "%": "The % sign gives the REMAINDER. " + a + " divided by " + b + " leaves " + val + ".", "**": "Two stars means 'to the power of'. " + a + " ** " + b + " means " + a + " multiplied by itself " + b + " times = " + val + "." }[op];
    return run(r, tag || "What does this program print?", code, out, wrong, why);
  });
  return [].concat(unit3(K), unit4to6(K)).map((L) => L);
}
