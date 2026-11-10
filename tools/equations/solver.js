/* Equation Helper: solves one-variable equations and inequalities and explains every step.
   Works with exact fractions (BigInt), so 1/3 stays 1/3. Handles parentheses, fractions, decimals, like terms, x on both sides,
   linear equations and inequalities, and quadratics (factoring when it works, otherwise the quadratic formula).
   Runs entirely in the browser. DOK_SOLVE.solve(text) returns { ok, steps:[{title, math, why}], answer, check:[...] } or { ok:false, error }. */
(function (root) {
  "use strict";
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { const t = a % b; a = b; b = t; } return a; };

  // ---------- exact fractions ----------
  class Q {
    constructor(n, d) { n = BigInt(n); d = d === undefined ? 1n : BigInt(d); if (d === 0n) throw new Error("Division by zero"); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g; }
    add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { return new Q(this.n * o.n, this.d * o.d); }
    div(o) { if (o.n === 0n) throw new Error("Division by zero"); return new Q(this.n * o.d, this.d * o.n); }
    neg() { return new Q(-this.n, this.d); }
    isZero() { return this.n === 0n; }
    isInt() { return this.d === 1n; }
    sign() { return this.n === 0n ? 0 : this.n > 0n ? 1 : -1; }
    abs() { return this.n < 0n ? this.neg() : this; }
    cmp(o) { const a = this.n * o.d, b = o.n * this.d; return a < b ? -1 : a > b ? 1 : 0; }
    eq(o) { return this.n === o.n && this.d === o.d; }
    num() { return Number(this.n) / Number(this.d); }
    str() { return this.d === 1n ? String(this.n) : this.n + "/" + this.d; }
  }
  const q = (n, d) => new Q(n, d);
  const ZERO = q(0), ONE = q(1);
  function qFromDecimal(s) {
    const m = /^(\d*)\.?(\d*)$/.exec(s); if (!m || (m[1] === "" && m[2] === "")) throw new Error("Bad number: " + s);
    const frac = m[2] || ""; return new Q(BigInt((m[1] || "0") + frac), 10n ** BigInt(frac.length));
  }
  function decimalStr(x, places) {
    places = places || 4; const v = x.num(); if (!isFinite(v)) return "";
    let s = v.toFixed(places); s = s.replace(/\.?0+$/, ""); return s === "-0" ? "0" : s;
  }
  // number as text: 5, -3, 7/2
  const fq = x => x.str();

  // ---------- polynomials in one variable: { degree: Q } ----------
  const MAXDEG = 4;
  const padd = (a, b) => { const r = {}; Object.keys(a).forEach(k => { r[k] = a[k]; }); Object.keys(b).forEach(k => { r[k] = r[k] ? r[k].add(b[k]) : b[k]; }); return clean(r); };
  const pneg = a => { const r = {}; Object.keys(a).forEach(k => { r[k] = a[k].neg(); }); return r; };
  const psub = (a, b) => padd(a, pneg(b));
  const pmul = (a, b) => { const r = {}; Object.keys(a).forEach(i => Object.keys(b).forEach(j => { const d = +i + +j; if (d > MAXDEG) throw new Error("This helper handles equations up to x² (and expressions up to x^" + MAXDEG + " along the way)."); r[d] = r[d] ? r[d].add(a[i].mul(b[j])) : a[i].mul(b[j]); })); return clean(r); };
  function clean(p) { const r = {}; Object.keys(p).forEach(k => { if (!p[k].isZero()) r[k] = p[k]; }); return r; }
  const pconst = x => (x.isZero() ? {} : { 0: x });
  const pvar = () => ({ 1: ONE });
  const deg = p => { const ks = Object.keys(p).map(Number); return ks.length ? Math.max.apply(null, ks) : -1; };
  const coef = (p, d) => p[d] || ZERO;
  const isConst = p => deg(p) <= 0;
  function ppow(a, e) { let r = pconst(ONE); for (let i = 0; i < e; i++) r = pmul(r, a); return r; }
  function pEval(p, x) { let r = ZERO; Object.keys(p).forEach(k => { let t = p[k]; for (let i = 0; i < +k; i++) t = t.mul(x); r = r.add(t); }); return r; }

  // ---------- tokenizer + parser ----------
  function normalize(s) {
    return String(s).replace(/\s+/g, "").replace(/[−–—]/g, "-").replace(/×|·/g, "*").replace(/÷/g, "/").replace(/≤/g, "<=").replace(/≥/g, ">=")
      .replace(/²/g, "^2").replace(/³/g, "^3").replace(/\*\*/g, "^").replace(/½/g, "(1/2)").replace(/¼/g, "(1/4)").replace(/¾/g, "(3/4)");
  }
  function tokenize(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ t: "num", v: s.slice(i, j) }); i = j; }
      else if (/[a-zA-Z]/.test(c)) { out.push({ t: "var", v: c.toLowerCase() }); i++; }
      else if ("+-*/^()".indexOf(c) > -1) { out.push({ t: c }); i++; }
      else throw new Error("I don't understand the character \"" + c + "\".");
    }
    // implicit multiplication: 2x, 3(x+1), (x+1)(x-2), x(x+1), 2(3)
    const res = [];
    out.forEach((tk, k) => {
      const prev = res[res.length - 1];
      if (prev && (prev.t === "num" || prev.t === "var" || prev.t === ")") && (tk.t === "num" || tk.t === "var" || tk.t === "(")) {
        if (!(prev.t === "num" && tk.t === "num")) res.push({ t: "*" });
      }
      res.push(tk);
    });
    return res;
  }
  function parseExpr(str, vars) {
    const tk = tokenize(str); let i = 0;
    const peek = () => tk[i], next = () => tk[i++];
    function expr() { let a = term(); while (peek() && (peek().t === "+" || peek().t === "-")) { const o = next().t; const b = term(); a = o === "+" ? padd(a, b) : psub(a, b); } return a; }
    function term() {
      let a = unary();
      while (peek() && (peek().t === "*" || peek().t === "/")) {
        const o = next().t; const b = unary();
        if (o === "*") a = pmul(a, b);
        else { if (!isConst(b)) throw new Error("I can't divide by an expression that has the variable in it."); if (coef(b, 0).isZero()) throw new Error("Division by zero."); const inv = ONE.div(coef(b, 0)); a = pmul(a, pconst(inv)); }
      }
      return a;
    }
    function unary() { if (peek() && peek().t === "-") { next(); return pneg(unary()); } if (peek() && peek().t === "+") { next(); return unary(); } return power(); }
    function power() {
      const base = atom();
      if (peek() && peek().t === "^") {
        next(); let neg = false; if (peek() && peek().t === "-") { next(); neg = true; }
        const e = atom(); if (!isConst(e) || !coef(e, 0).isInt()) throw new Error("The exponent must be a whole number."); let n = Number(coef(e, 0).n); if (neg) n = -n;
        if (n < 0) throw new Error("Negative exponents aren't supported."); if (n > MAXDEG) throw new Error("That exponent is too big for this helper.");
        return ppow(base, n);
      }
      return base;
    }
    function atom() {
      const t = next(); if (!t) throw new Error("The expression ends too soon. Check for a missing number or bracket.");
      if (t.t === "num") return pconst(qFromDecimal(t.v));
      if (t.t === "var") { vars.add(t.v); return pvar(); }
      if (t.t === "(") { const e = expr(); if (!peek() || peek().t !== ")") throw new Error("A bracket ( is never closed."); next(); return e; }
      throw new Error("I didn't expect \"" + (t.t === "num" || t.t === "var" ? t.v : t.t) + "\" there.");
    }
    const r = expr(); if (i < tk.length) throw new Error("I didn't expect \"" + (tk[i].v || tk[i].t) + "\" there. Check for a missing + or - or an extra bracket.");
    return r;
  }

  // ---------- pretty printing ----------
  const SUP = { 2: "²", 3: "³", 4: "⁴" };
  function fmtPoly(p, v) {
    const ds = Object.keys(p).map(Number).sort((a, b) => b - a); if (!ds.length) return "0";
    let out = "";
    ds.forEach((d, idx) => {
      const c = p[d]; const neg = c.sign() < 0, ab = c.abs(); let body;
      const cs = ab.isInt() ? (ab.eq(ONE) && d > 0 ? "" : ab.str()) : "(" + ab.str() + ")";
      if (d === 0) body = ab.str(); else body = cs + v + (d > 1 ? SUP[d] || "^" + d : "");
      if (idx === 0) out += (neg ? "-" : "") + body; else out += (neg ? " - " : " + ") + body;
    });
    return out;
  }
  const REL_TEXT = { "=": "=", "<": "<", "<=": "≤", ">": ">", ">=": "≥" };
  const flip = r => ({ "=": "=", "<": ">", ">": "<", "<=": ">=", ">=": "<=" }[r]);
  const eqStr = (L, R, rel, v) => fmtPoly(L, v) + " " + REL_TEXT[rel] + " " + fmtPoly(R, v);
  const num2 = x => (x.isInt() ? fq(x) : fq(x) + " (about " + decimalStr(x) + ")");
  const signed = x => (x.sign() < 0 ? "- " + x.abs().str() : "+ " + x.str());

  function splitRelation(text) {
    const m = /(<=|>=|<|>|=)/.exec(text); if (!m) throw new Error("Type an equation or an inequality, like 3x + 5 = 20.");
    const rest = text.slice(m.index + m[0].length); if (/(<=|>=|<|>|=)/.test(rest)) throw new Error("There is more than one = or < > sign. Type just one.");
    return { L: text.slice(0, m.index), R: rest, rel: m[0] };
  }

  // ---------- the solver ----------
  function solve(input) {
    try { return doSolve(input); } catch (e) { return { ok: false, error: e.message || String(e) }; }
  }
  function doSolve(input) {
    const txt = normalize(input); if (!txt) throw new Error("Type an equation first, like 2(x + 3) = 14.");
    const sp = splitRelation(txt); if (!sp.L || !sp.R) throw new Error("Each side of the = sign needs something on it.");
    const vars = new Set(); const L0 = parseExpr(sp.L, vars), R0 = parseExpr(sp.R, vars);
    if (vars.size > 1) throw new Error("This helper works with one variable at a time (found " + [...vars].join(", ") + ").");
    const v = vars.size ? [...vars][0] : "x";
    let rel = sp.rel; const steps = []; const typed = input.trim();
    let L = L0, R = R0;
    const push = (title, math, why) => steps.push({ title, math, why });
    push("Start", typed, "This is the problem we are solving.");
    // 1. simplify each side
    const simp = eqStr(L, R, rel, v);
    if (simp.replace(/\s/g, "") !== txt.replace(/\^2/g, "²").replace(/<=/g, "≤").replace(/>=/g, "≥").replace(/\s/g, "").replace(/\*/g, "")) {
      const hasParen = /\(/.test(sp.L + sp.R), hasDiv = /\//.test(sp.L + sp.R);
      push("Simplify each side", simp, (hasParen ? "Distribute (multiply the number outside each bracket by everything inside). " : "") + (hasDiv ? "Do the division. " : "") + "Then combine like terms: add or subtract the terms that have the same variable part, and the plain numbers together.");
    }
    const d = Math.max(deg(L), deg(R));
    if (d > 2) throw new Error("This helper solves equations up to x². This one has a higher power of " + v + ".");
    if (d <= 1) return linear(v, L, R, rel, L0, R0, steps, typed);
    if (rel !== "=") throw new Error("Inequalities with x² aren't supported yet. Try an equation, or a linear inequality.");
    return quadratic(v, L, R, L0, R0, steps);
  }

  // ----- linear equations and inequalities -----
  function linear(v, L, R, rel, L0, R0, steps, typed) {
    const push = (title, math, why) => steps.push({ title, math, why });
    let a1 = coef(L, 1), b1 = coef(L, 0), a2 = coef(R, 1), b2 = coef(R, 0);
    // move the variable terms to the left
    if (!a2.isZero()) {
      const op = a2.sign() > 0 ? "Subtract " : "Add ", amt = a2.abs();
      a1 = a1.sub(a2);
      const t = (amt.eq(ONE) ? "" : amt.isInt() ? amt.str() : "(" + amt.str() + ")") + v;
      L = padd(pmul(pconst(a1), pvar()), pconst(b1)); R = pconst(b2);
      push("Get the " + v + " terms on one side", eqStr(L, R, rel, v), op + t + (a2.sign() > 0 ? " from" : " to") + " both sides so all the " + v + "'s are on the left. What you do to one side you must do to the other.");
    }
    if (a1.isZero()) {
      // the variable cancelled: only numbers are left
      const trueStmt = (() => { const c = b1.cmp(b2); return rel === "=" ? c === 0 : rel === "<" ? c < 0 : rel === "<=" ? c <= 0 : rel === ">" ? c > 0 : c >= 0; })();
      push("The " + v + " cancelled out", fq(b1) + " " + REL_TEXT[rel] + " " + fq(b2), "No " + v + " is left, so we just ask: is this statement true?");
      if (trueStmt) { push("Answer", rel === "=" ? "Infinitely many solutions (any number works)" : "All real numbers", "The statement " + fq(b1) + " " + REL_TEXT[rel] + " " + fq(b2) + " is always true, no matter what " + v + " is."); return { ok: true, steps, answer: rel === "=" ? "Infinitely many solutions: every real number works." : "All real numbers.", check: [], kind: "all" }; }
      push("Answer", "No solution", "The statement " + fq(b1) + " " + REL_TEXT[rel] + " " + fq(b2) + " is never true, so no value of " + v + " can make the problem true.");
      return { ok: true, steps, answer: "No solution.", check: [], kind: "none" };
    }
    // move the constants to the right
    if (!b1.isZero()) {
      const op = b1.sign() > 0 ? "Subtract " : "Add "; const amt = b1.abs();
      b2 = b2.sub(b1); b1 = ZERO;
      L = pmul(pconst(a1), pvar()); R = pconst(b2);
      push("Get the plain numbers on the other side", eqStr(L, R, rel, v), op + amt.str() + (op === "Subtract " ? " from" : " to") + " both sides to move the number away from the " + v + ".");
    }
    // divide by the coefficient
    let sol = b2.div(a1), newRel = rel;
    if (!a1.eq(ONE)) {
      const neg = a1.sign() < 0 && rel !== "=";
      if (neg) newRel = flip(rel);
      push("Divide both sides by " + a1.str(), v + " " + REL_TEXT[newRel] + " " + fq(sol),
        "The " + v + " is being multiplied by " + a1.str() + ", so divide both sides by " + a1.str() + " to get " + v + " alone." + (neg ? " Important: dividing by a negative number FLIPS the inequality sign (" + REL_TEXT[rel] + " becomes " + REL_TEXT[newRel] + ")." : ""));
    }
    const ans = v + " " + REL_TEXT[newRel] + " " + fq(sol) + (sol.isInt() ? "" : "   (" + v + " " + REL_TEXT[newRel] + " " + decimalStr(sol) + " as a decimal)");
    push("Answer", ans, rel === "=" ? "This is the value of " + v + " that makes both sides equal." : "Every number that makes this true is a solution.");
    // check
    const check = [];
    if (rel === "=") {
      const lv = pEval(L0, sol), rv = pEval(R0, sol);
      check.push("Put " + v + " = " + fq(sol) + " back into the original problem.");
      check.push("Left side: " + fq(lv) + (lv.isInt() ? "" : " (about " + decimalStr(lv) + ")"));
      check.push("Right side: " + fq(rv) + (rv.isInt() ? "" : " (about " + decimalStr(rv) + ")"));
      check.push(lv.eq(rv) ? "Both sides are equal, so the answer is correct. ✓" : "The sides are not equal, so check your typing.");
    } else {
      const strict = rel === "<" || rel === ">"; const lv = pEval(L0, sol), rv = pEval(R0, sol);
      check.push("Boundary: at " + v + " = " + fq(sol) + " the two sides are " + fq(lv) + " and " + fq(rv) + (lv.eq(rv) ? ", equal, so this number " + (strict ? "is NOT included (open circle)." : "IS included (closed circle).") : "."));
      const wantLess = newRel === "<" || newRel === "<="; const test = wantLess ? sol.sub(ONE) : sol.add(ONE);
      const tl = pEval(L0, test), tr = pEval(R0, test); const c = tl.cmp(tr);
      const ok = rel === "<" ? c < 0 : rel === "<=" ? c <= 0 : rel === ">" ? c > 0 : c >= 0;
      check.push("Test a number in the solution set, " + v + " = " + fq(test) + ": left " + fq(tl) + ", right " + fq(tr) + ". Is " + fq(tl) + " " + REL_TEXT[rel] + " " + fq(tr) + "? " + (ok ? "Yes. ✓" : "No, so check your typing."));
    }
    return { ok: true, steps, answer: ans, check, kind: "linear", variable: v, solution: sol.num(), relation: newRel };
  }

  // ----- quadratics -----
  function isqrt(n) { if (n < 0n) return null; if (n < 2n) return n; let x = BigInt(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; }
  function simplifyRadical(n) { // n > 0 integer -> [outside, inside] with sqrt(n) = outside * sqrt(inside)
    let out = 1n, inside = n; for (let f = 2n; f * f <= inside; f++) { while (inside % (f * f) === 0n) { inside /= f * f; out *= f; } } return [out, inside];
  }
  function quadratic(v, L, R, L0, R0, steps) {
    const push = (title, math, why) => steps.push({ title, math, why });
    let P = psub(L, R); // everything on the left
    {
      if (Object.keys(R).length) push("Move everything to one side", fmtPoly(P, v) + " = 0", "Subtract the right side from both sides so that one side is 0. A quadratic is easiest to solve in the form ax² + bx + c = 0.");
    }
    let a = coef(P, 2), b = coef(P, 1), c = coef(P, 0);
    // clear fractions
    let lcd = 1n; [a, b, c].forEach(x => { lcd = (lcd * x.d) / gcd(lcd, x.d); });
    if (lcd !== 1n) {
      a = a.mul(q(lcd)); b = b.mul(q(lcd)); c = c.mul(q(lcd));
      push("Clear the fractions", fmtPoly({ 2: a, 1: b, 0: c }, v) + " = 0", "Multiply every term by " + lcd + " (the common denominator) so all the numbers are whole numbers. Both sides stay equal.");
    }
    // divide by common factor, keep a positive
    let g = gcd(gcd(a.n, b.n), c.n); if (a.sign() < 0) g = -g;
    if (g !== 1n && g !== 0n) { a = a.div(q(g)); b = b.div(q(g)); c = c.div(q(g)); push("Make the numbers smaller", fmtPoly({ 2: a, 1: b, 0: c }, v) + " = 0", "Divide every term by " + g + " to get smaller numbers. (This does not change the answers.)"); }
    const A = a.n, B = b.n, C = c.n;
    push("Name a, b and c", "a = " + A + ",  b = " + B + ",  c = " + C, "In ax² + bx + c = 0, a is the number in front of " + v + "², b is the number in front of " + v + ", and c is the plain number.");
    const D = B * B - 4n * A * C;
    const par = n => (n < 0n ? "(" + n + ")" : String(n));
    // try factoring when the roots are rational
    const check = []; let answer, roots = [];
    const sq = D >= 0n ? isqrt(D) : null; const perfect = sq !== null && sq * sq === D;
    if (perfect) {
      const r1 = q(-B + sq, 2n * A), r2 = q(-B - sq, 2n * A);
      // each root p/q gives the bracket (q x - p); the leftover whole number goes in front
      const fac = (r) => { const den = r.d, nm = r.n; const lead = den === 1n ? v : den + v; return nm === 0n ? "(" + lead + ")" : nm > 0n ? "(" + lead + " - " + nm + ")" : "(" + lead + " + " + (-nm) + ")"; };
      const k = A / (r1.d * r2.d); const lead = k === 1n ? "" : k === -1n ? "-" : k + "";
      if (r1.eq(r2)) push("Factor", lead + fac(r1) + "² = 0", "Because the discriminant is 0, this is a perfect square: " + v + " has just one solution.");
      else push("Factor", lead + fac(r1) + fac(r2) + " = 0", "This quadratic factors. Check: multiplying the brackets back out gives " + fmtPoly({ 2: a, 1: b, 0: c }, v) + ".");
      if (!r1.eq(r2)) push("Use the zero product property", fac(r1) + " = 0   or   " + fac(r2) + " = 0", "If two things multiply to give 0, then at least one of them must be 0. Set each bracket equal to 0 and solve.");      roots = r1.eq(r2) ? [r1] : [r1, r2].sort((x, y) => x.cmp(y));
      push("Solutions", roots.map(r => v + " = " + fq(r)).join("   or   "), "These are the values of " + v + " that make the equation true.");
      push("Why it factored", "D = b² - 4ac = " + par(B) + "² - 4(" + A + ")(" + C + ") = " + D, "The discriminant D = " + D + " is a perfect square (" + sq + "²), which is why the answers are whole numbers or fractions and why factoring worked.");
      answer = roots.map(r => v + " = " + fq(r) + (r.isInt() ? "" : " (about " + decimalStr(r) + ")")).join("   or   ");
    } else {
      push("Use the quadratic formula", v + " = (-b ± √(b² - 4ac)) / (2a)", "This doesn't factor with whole numbers, so use the quadratic formula. It works for every quadratic.");
      push("Find the discriminant", "D = b² - 4ac = " + par(B) + "² - 4(" + A + ")(" + C + ") = " + D, "The number under the square root, D, tells you how many real solutions there are: D > 0 gives two, D = 0 gives one, D < 0 gives none.");
      if (D < 0n) {
        push("Answer", "No real solutions", "D is negative and you can't take the square root of a negative number with real numbers. (With complex numbers the answers would be " + v + " = (" + (-B) + " ± √" + (-D) + " i) / " + (2n * A) + ".)");
        answer = "No real solutions (the discriminant " + D + " is negative).";
        return { ok: true, steps, answer, check: [], kind: "quad", roots: [] };
      }
      const [out, ins] = simplifyRadical(D);
      const rad = out === 1n ? "√" + ins : out + "√" + ins;
      push("Put the numbers in", v + " = (" + (-B) + " ± √" + D + ") / " + (2n * A), "Replace a, b and D. Notice -b means the opposite of " + B + ".");
      const r1n = (-Number(B) + Math.sqrt(Number(D))) / (2 * Number(A)), r2n = (-Number(B) - Math.sqrt(Number(D))) / (2 * Number(A));
      push("Simplify the square root", "√" + D + " = " + rad, out === 1n ? "√" + D + " can't be simplified." : "Pull out the perfect square: " + D + " = " + out * out + " × " + ins + ", so √" + D + " = " + out + "√" + ins + ".");
      const lo = Math.min(r1n, r2n), hi = Math.max(r1n, r2n);
      // reduce the fraction: divide the number, the outside-the-root part, and the bottom by what they share
      let gg = gcd(gcd(B < 0n ? -B : B, out), 2n * A < 0n ? -2n * A : 2n * A), n1 = -B / gg, o1 = out / gg, d1 = 2n * A / gg; if (d1 < 0n) { d1 = -d1; n1 = -n1; }
      const radR = o1 === 1n ? "√" + ins : o1 + "√" + ins;
      const top = (n1 === 0n ? "" : n1 + " ") + (n1 === 0n ? "± " : "± ") + radR;
      const exact = d1 === 1n ? v + " = " + top : v + " = (" + top + ") / " + d1;
      push("Solutions", exact + "   ≈   " + v + " = " + (+lo.toFixed(4)) + "   or   " + v + " = " + (+hi.toFixed(4)), "The ± gives two answers: one with + and one with -. The fraction is reduced, and the decimals are rounded to 4 places.");
      answer = exact + "  ≈  " + (+lo.toFixed(4)) + " or " + (+hi.toFixed(4));
      roots = [q(0)]; // not used for exact check
      check.push("Check one answer with the decimal: put " + v + " ≈ " + (+lo.toFixed(4)) + " into " + fmtPoly({ 2: a, 1: b, 0: c }, v) + ". You get about " + (+(Number(A) * lo * lo + Number(B) * lo + Number(C)).toFixed(3)) + ", which is very close to 0. ✓");
      return { ok: true, steps, answer, check, kind: "quad", roots: [lo, hi] };
    }
    roots.forEach(r => { const lv = pEval(L0, r), rv = pEval(R0, r); check.push(v + " = " + fq(r) + ": left side = " + fq(lv) + ", right side = " + fq(rv) + (lv.eq(rv) ? "  ✓ equal" : "  (not equal, check your typing)")); });
    return { ok: true, steps, answer, check, kind: "quad", roots: roots.map(r => r.num()) };
  }

  // ---------- practice problems ----------
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function practice(level) {
    const pick = arr => arr[rnd(0, arr.length - 1)]; let x = rnd(-9, 12); if (x === 0) x = 3;
    const nz = (a, b) => { let n = 0; while (n === 0) n = rnd(a, b); return n; };
    const sg = n => (n < 0 ? "- " + -n : "+ " + n);
    const coefStr = n => (n === 1 ? "" : n === -1 ? "-" : String(n));
    const lv = level || pick(["one", "two", "both", "paren", "quad"]);
    if (lv === "one") { const b = nz(2, 15); return v1("x " + sg(b) + " = " + (x + b)); }
    if (lv === "two") { const a = nz(-6, 9), b = nz(-15, 15); if (Math.abs(a) < 2) return practice("two"); return "" + coefStr(a) + "x " + sg(b) + " = " + (a * x + b); }
    if (lv === "both") { let a = nz(2, 9), c = nz(-5, 8); if (a === c) c = a + 1; const b = nz(-12, 12), d = (a - c) * x + b; return coefStr(a) + "x " + sg(b) + " = " + coefStr(c) + "x " + sg(d); }
    if (lv === "paren") { const a = nz(2, 6), b = nz(-8, 8), c = nz(-10, 10); return a + "(x " + sg(b) + ") " + sg(c) + " = " + (a * (x + b) + c); }
    const r1 = rnd(-7, 7), r2 = rnd(-7, 7);
    return fmtPoly(clean({ 2: ONE, 1: q(-(r1 + r2)), 0: q(r1 * r2) }), "x") + " = 0";
    function v1(s) { return s; }
  }

  root.DOK_SOLVE = { solve, practice, normalize, _Q: Q, _parse: (s) => { const vs = new Set(); const p = parseExpr(normalize(s), vs); return fmtPoly(p, [...vs][0] || "x"); } };
  if (typeof module !== "undefined" && module.exports) module.exports = root.DOK_SOLVE;
})(typeof window !== "undefined" ? window : globalThis);
