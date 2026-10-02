/* MiniPy: a small Python subset interpreter for the notes pages. Exposes window.MiniPy.run(src, {inputs:[...]}) -> {out, err}.
   Supports: numbers, strings, f-strings, bool/None, lists, tuples, dicts, slicing, if/elif/else, while, for, break/continue,
   def/return, try/except/raise, comprehensions, common builtins and string/list/dict methods. Not full Python. */
(function () {
  "use strict";
  function PyErr(type, msg) { this.type = type; this.msg = msg; }
  function Flt(v) { this.v = v; }
  function Tup(a) { this.a = a; }
  function Rng(a, b, c) { this.a = a; this.b = b; this.c = c; }
  function Fn(name, params, defs, body, scope) { this.name = name; this.params = params; this.defs = defs; this.body = body; this.scope = scope; }
  function Mod(name, o) { this.name = name; this.o = o; }
  var isF = function (x) { return x instanceof Flt; };
  var isNum = function (x) { return typeof x === "number" || isF(x) || typeof x === "boolean"; };
  var nv = function (x) { return isF(x) ? x.v : (typeof x === "boolean" ? (x ? 1 : 0) : x); };
  function typeName(x) {
    if (x === null) return "NoneType"; if (typeof x === "boolean") return "bool"; if (typeof x === "number") return "int"; if (isF(x)) return "float"; if (typeof x === "string") return "str";
    if (Array.isArray(x)) return "list"; if (x instanceof Tup) return "tuple"; if (x instanceof Map) return "dict"; if (x instanceof Rng) return "range"; if (x instanceof Fn || typeof x === "function") return "function"; if (x instanceof PyErr) return x.type; return "object";
  }
  function fmtFloat(v) {
    if (v === Infinity) return "inf"; if (v === -Infinity) return "-inf"; if (v !== v) return "nan";
    if (Number.isInteger(v) && Math.abs(v) < 1e16) return v.toFixed(1);
    var s = String(v); return s.replace("e+", "e+").replace(/e(\d)/, "e+$1");
  }
  function repr(x) {
    if (x === null) return "None"; if (x === true) return "True"; if (x === false) return "False"; if (typeof x === "number") return String(x); if (isF(x)) return fmtFloat(x.v);
    if (typeof x === "string") return "'" + x.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "'";
    if (Array.isArray(x)) return "[" + x.map(repr).join(", ") + "]";
    if (x instanceof Tup) return "(" + x.a.map(repr).join(", ") + (x.a.length === 1 ? "," : "") + ")";
    if (x instanceof Map) { var p = []; x.forEach(function (v, k) { p.push(repr(k) + ": " + repr(v)); }); return "{" + p.join(", ") + "}"; }
    if (x instanceof Rng) return "range(" + x.a + ", " + x.b + (x.c !== 1 ? ", " + x.c : "") + ")";
    if (x instanceof Fn) return "<function " + x.name + ">"; if (x instanceof Mod) return "<module '" + x.name + "'>"; if (typeof x === "function") return "<built-in function " + (x.pyname || "") + ">";
    if (x instanceof PyErr) return x.type + "(" + repr(x.msg) + ")";
    return String(x);
  }
  function str(x) { if (typeof x === "string") return x; if (x instanceof PyErr) return x.msg; return repr(x); }
  function truthy(x) {
    if (x === null || x === false) return false; if (x === true) return true; if (typeof x === "number") return x !== 0; if (isF(x)) return x.v !== 0; if (typeof x === "string") return x.length > 0;
    if (Array.isArray(x)) return x.length > 0; if (x instanceof Tup) return x.a.length > 0; if (x instanceof Map) return x.size > 0; if (x instanceof Rng) return rlen(x) > 0; return true;
  }
  function rlen(r) { return Math.max(0, Math.ceil((r.b - r.a) / r.c)); }
  function toList(x) {
    if (Array.isArray(x)) return x.slice(); if (x instanceof Tup) return x.a.slice(); if (typeof x === "string") return x.split(""); if (x instanceof Map) return Array.from(x.keys());
    if (x instanceof Rng) { var o = []; for (var i = x.a; x.c > 0 ? i < x.b : i > x.b; i += x.c) o.push(i); return o; }
    throw new PyErr("TypeError", "'" + typeName(x) + "' object is not iterable");
  }
  function eq(a, b) {
    if (isNum(a) && isNum(b)) return nv(a) === nv(b); if (typeof a === "string" || typeof b === "string") return a === b;
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every(function (v, i) { return eq(v, b[i]); });
    if (a instanceof Tup && b instanceof Tup) return eq(a.a, b.a); if (a instanceof Map && b instanceof Map) { if (a.size !== b.size) return false; var ok = true; a.forEach(function (v, k) { if (!b.has(k) || !eq(v, b.get(k))) ok = false; }); return ok; }
    return a === b;
  }
  function cmp(a, b, op) {
    var x, y;
    if (isNum(a) && isNum(b)) { x = nv(a); y = nv(b); }
    else if (typeof a === "string" && typeof b === "string") { x = a; y = b; }
    else if ((Array.isArray(a) && Array.isArray(b)) || (a instanceof Tup && b instanceof Tup)) {
      var A = Array.isArray(a) ? a : a.a, B = Array.isArray(b) ? b : b.a;
      for (var i = 0; i < Math.min(A.length, B.length); i++) { if (!eq(A[i], B[i])) return cmp(A[i], B[i], op); } x = A.length; y = B.length;
    } else throw new PyErr("TypeError", "'" + op + "' not supported between instances of '" + typeName(a) + "' and '" + typeName(b) + "'");
    return op === "<" ? x < y : op === ">" ? x > y : op === "<=" ? x <= y : x >= y;
  }
  function mkNum(v, fl) { return fl ? new Flt(v) : v; }
  function arith(op, a, b) {
    if (op === "+") {
      if (typeof a === "string" && typeof b === "string") return a + b; if (Array.isArray(a) && Array.isArray(b)) return a.concat(b); if (a instanceof Tup && b instanceof Tup) return new Tup(a.a.concat(b.a));
      if (typeof a === "string" || typeof b === "string") { if (typeof a === "string") throw new PyErr("TypeError", 'can only concatenate str (not "' + typeName(b) + '") to str'); throw new PyErr("TypeError", "unsupported operand type(s) for +: '" + typeName(a) + "' and '" + typeName(b) + "'"); }
    }
    if (op === "*") {
      if (typeof a === "string" && typeof b === "number") return b > 0 ? a.repeat(b) : ""; if (typeof b === "string" && typeof a === "number") return a > 0 ? b.repeat(a) : "";
      if (Array.isArray(a) && typeof b === "number") { var o = []; for (var i = 0; i < b; i++) o = o.concat(a); return o; }
    }
    if (op === "%" && typeof a === "string") return fmtPercent(a, b);
    if (!isNum(a) || !isNum(b)) throw new PyErr("TypeError", "unsupported operand type(s) for " + op + ": '" + typeName(a) + "' and '" + typeName(b) + "'");
    var x = nv(a), y = nv(b), fl = isF(a) || isF(b);
    switch (op) {
      case "+": return mkNum(x + y, fl); case "-": return mkNum(x - y, fl); case "*": return mkNum(x * y, fl);
      case "/": if (y === 0) throw new PyErr("ZeroDivisionError", "division by zero"); return new Flt(x / y);
      case "//": if (y === 0) throw new PyErr("ZeroDivisionError", "integer division or modulo by zero"); return mkNum(Math.floor(x / y), fl);
      case "%": if (y === 0) throw new PyErr("ZeroDivisionError", "integer modulo by zero"); return mkNum(x - Math.floor(x / y) * y, fl);
      case "**": var r = Math.pow(x, y); return mkNum(r, fl || y < 0);
    }
  }
  function fmtPercent(s, v) { var args = v instanceof Tup ? v.a.slice() : [v]; return s.replace(/%([sdif])/g, function (m, t) { var a = args.shift(); return t === "s" ? str(a) : t === "f" ? nv(a).toFixed(6) : String(Math.trunc(nv(a))); }); }
  function fmtSpec(v, spec) {
    var m = spec.match(/^(?:(.)?([<>^]))?(\d+)?(,)?(?:\.(\d+))?([dfs%]?)$/); if (!m) throw new PyErr("ValueError", "Invalid format specifier");
    var s, t = m[6], p = m[5];
    if (t === "f" || (p != null && isNum(v) && !t)) s = nv(v).toFixed(p == null ? 6 : +p); else if (t === "%") s = (nv(v) * 100).toFixed(p == null ? 6 : +p) + "%"; else if (t === "d") s = String(Math.trunc(nv(v))); else s = str(v);
    if (m[4]) { var pr = s.split("."); pr[0] = pr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); s = pr.join("."); }
    var w = m[3] ? +m[3] : 0, fill = m[1] || " ", al = m[2] || (isNum(v) ? ">" : "<");
    while (s.length < w) { if (al === "<") s += fill; else if (al === ">") s = fill + s; else s = (s.length % 2 ? s + fill : fill + s); }
    return s;
  }

  /* ---------- tokenizer ---------- */
  var KEY = { "if": 1, "elif": 1, "else": 1, "while": 1, "for": 1, "in": 1, "def": 1, "return": 1, "break": 1, "continue": 1, "pass": 1, "and": 1, "or": 1, "not": 1, "is": 1, "try": 1, "except": 1, "finally": 1, "raise": 1, "global": 1, "import": 1, "from": 1, "as": 1, "lambda": 1, "True": 1, "False": 1, "None": 1 };
  function tokenize(src) {
    var T = [], ind = [0], i = 0, n = src.length, line = 1, depth = 0, atStart = true, c;
    function push(t, v) { T.push({ t: t, v: v, line: line }); }
    while (i < n) {
      if (atStart && depth === 0) {
        var sp = 0; while (i < n && (src[i] === " " || src[i] === "\t")) { sp += src[i] === "\t" ? 4 : 1; i++; }
        if (i >= n) break; if (src[i] === "\n") { i++; line++; continue; } if (src[i] === "#") { while (i < n && src[i] !== "\n") i++; continue; }
        if (sp > ind[ind.length - 1]) { ind.push(sp); push("INDENT"); } else { while (sp < ind[ind.length - 1]) { ind.pop(); push("DEDENT"); } if (sp !== ind[ind.length - 1]) throw new PyErr("IndentationError", "unindent does not match any outer indentation level (line " + line + ")"); }
        atStart = false;
      }
      c = src[i];
      if (c === " " || c === "\t") { i++; continue; }
      if (c === "#") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "\n") { i++; if (depth === 0) { push("NL"); atStart = true; } line++; continue; }
      if (c === "\\" && src[i + 1] === "\n") { i += 2; line++; continue; }
      var m;
      if ((m = /^(?:[fF])?("""|'''|"|')/.exec(src.slice(i, i + 5)))) {
        var f = /^[fF]/.test(src.slice(i, i + 1)), q = m[1]; i += (f ? 1 : 0) + q.length; var s = "";
        while (i < n && src.substr(i, q.length) !== q) {
          if (src[i] === "\\" && i + 1 < n) { var e = src[i + 1]; s += e === "n" ? "\n" : e === "t" ? "\t" : e === "\\" ? "\\" : e === "'" ? "'" : e === '"' ? '"' : "\\" + e; i += 2; continue; }
          if (src[i] === "\n") { if (q.length === 1) throw new PyErr("SyntaxError", "unterminated string literal (line " + line + ")"); line++; }
          s += src[i++];
        }
        if (i >= n) throw new PyErr("SyntaxError", "unterminated string literal (line " + line + ")"); i += q.length; push(f ? "FSTR" : "STR", s); continue;
      }
      if ((m = /^\d+\.?\d*(?:[eE][+-]?\d+)?|^\.\d+/.exec(src.slice(i)))) { var txt = m[0]; i += txt.length; push("NUM", /[.eE]/.test(txt) ? new Flt(parseFloat(txt)) : parseInt(txt, 10)); continue; }
      if ((m = /^[A-Za-z_]\w*/.exec(src.slice(i)))) { i += m[0].length; if (KEY[m[0]]) push("KW", m[0]); else push("NAME", m[0]); continue; }
      if ((m = /^(\*\*=|\/\/=|\*\*|\/\/|==|!=|<=|>=|\+=|-=|\*=|\/=|%=|->|[-+*\/%<>=()[\]{},:.])/.exec(src.slice(i)))) { var op = m[0]; i += op.length; if ("([{".indexOf(op) >= 0) depth++; if (")]}".indexOf(op) >= 0) depth--; push("OP", op); continue; }
      throw new PyErr("SyntaxError", "invalid character '" + c + "' (line " + line + ")");
    }
    push("NL"); while (ind.length > 1) { ind.pop(); push("DEDENT"); } push("EOF"); return T;
  }

  /* ---------- parser ---------- */
  function parse(T) {
    var p = 0;
    function pk() { return T[p]; }
    function isOp(v) { return T[p].t === "OP" && T[p].v === v; }
    function isKw(v) { return T[p].t === "KW" && T[p].v === v; }
    function eatOp(v) { if (!isOp(v)) err("expected '" + v + "'"); return T[p++]; }
    function eatKw(v) { if (!isKw(v)) err("expected '" + v + "'"); return T[p++]; }
    function err(m) { var t = T[p]; throw new PyErr("SyntaxError", "invalid syntax" + (m ? " (" + m + ")" : "") + " on line " + t.line); }
    function skipNL() { while (T[p].t === "NL") p++; }
    function block() {
      eatOp(":");
      if (T[p].t !== "NL") { return [simple()]; }
      p++; skipNL(); if (T[p].t !== "INDENT") err("expected an indented block"); p++;
      var b = []; while (T[p].t !== "DEDENT" && T[p].t !== "EOF") { skipNL(); if (T[p].t === "DEDENT" || T[p].t === "EOF") break; b.push(stmt()); }
      if (T[p].t === "DEDENT") p++; return b;
    }
    function stmt() {
      var t = T[p], line = t.line;
      if (t.t === "KW") {
        switch (t.v) {
          case "if": { p++; var node = { k: "if", line: line, c: expr(), b: block(), e: [] }, cur = node; skipNL();
            while (isKw("elif")) { p++; var n2 = { k: "if", line: T[p].line, c: expr(), b: block(), e: [] }; cur.e = [n2]; cur = n2; skipNL(); }
            if (isKw("else")) { p++; cur.e = block(); } return node; }
          case "while": p++; return { k: "while", line: line, c: expr(), b: block() };
          case "for": { p++; var tg = target(); eatKw("in"); var it = exprList(); return { k: "for", line: line, tg: tg, it: it, b: block() }; }
          case "def": { p++; var name = T[p++].v; eatOp("("); var ps = [], ds = {}; while (!isOp(")")) { var pn = T[p++].v; ps.push(pn); if (isOp("=")) { p++; ds[pn] = expr(); } if (isOp(",")) p++; } eatOp(")"); return { k: "def", line: line, name: name, ps: ps, ds: ds, b: block() }; }
          case "try": { p++; var tb = block(), hs = [], fin = null; skipNL();
            while (isKw("except")) { p++; var ty = null, as = null; if (!isOp(":")) { ty = expr(); if (isKw("as")) { p++; as = T[p++].v; } } hs.push({ ty: ty, as: as, b: block() }); skipNL(); }
            if (isKw("finally")) { p++; fin = block(); } return { k: "try", line: line, b: tb, h: hs, f: fin }; }
        }
      }
      return simple();
    }
    function simple() {
      var t = T[p], line = t.line, node;
      if (t.t === "KW") {
        if (t.v === "return") { p++; node = { k: "return", line: line, v: (T[p].t === "NL" ? null : exprList()) }; }
        else if (t.v === "break") { p++; node = { k: "break", line: line }; } else if (t.v === "continue") { p++; node = { k: "continue", line: line }; } else if (t.v === "pass") { p++; node = { k: "pass", line: line }; }
        else if (t.v === "global") { p++; var g = []; while (T[p].t === "NAME") { g.push(T[p++].v); if (isOp(",")) p++; } node = { k: "global", line: line, n: g }; }
        else if (t.v === "raise") { p++; node = { k: "raise", line: line, v: (T[p].t === "NL" ? null : expr()) }; }
        else if (t.v === "import") { p++; var mn = T[p++].v; var al = mn; if (isKw("as")) { p++; al = T[p++].v; } node = { k: "import", line: line, m: mn, a: al }; }
        else if (t.v === "from") { p++; var m2 = T[p++].v; eatKw("import"); var nm = []; while (T[p].t === "NAME" || isOp("*")) { nm.push(T[p++].v); if (isOp(",")) p++; } node = { k: "from", line: line, m: m2, n: nm }; }
      }
      if (!node) {
        var e = exprList();
        if (isOp("=")) { var tgs = [e]; while (isOp("=")) { p++; e = exprList(); tgs.push(e); } node = { k: "assign", line: line, tg: tgs.slice(0, -1), v: tgs[tgs.length - 1] }; }
        else if (T[p].t === "OP" && /^(\+|-|\*|\/|%|\*\*|\/\/)=$/.test(T[p].v)) { var o = T[p++].v.slice(0, -1); node = { k: "aug", line: line, op: o, tg: e, v: exprList() }; }
        else node = { k: "expr", line: line, e: e };
      }
      if (T[p].t !== "NL" && T[p].t !== "EOF") err("unexpected '" + (T[p].v === undefined ? T[p].t : T[p].v) + "'");
      return node;
    }
    function target() { var first = tgAtom(); if (isOp(",")) { var a = [first]; while (isOp(",")) { p++; if (isKw("in")) break; a.push(tgAtom()); } return { k: "tuple", a: a }; } return first; }
    function tgAtom() { if (T[p].t === "NAME") return { k: "name", v: T[p++].v }; err("bad loop variable"); }
    function exprList() { var e = expr(); if (isOp(",")) { var a = [e]; while (isOp(",")) { p++; if (T[p].t === "NL" || isOp("=") || isOp(")") || isOp(":")) break; a.push(expr()); } return { k: "tuple", a: a }; } return e; }
    function expr() {
      var e = orE();
      if (isKw("if")) { p++; var c = orE(); eatKw("else"); var o = expr(); return { k: "tern", c: c, a: e, b: o }; }
      return e;
    }
    function orE() { var l = andE(); while (isKw("or")) { p++; l = { k: "or", a: l, b: andE() }; } return l; }
    function andE() { var l = notE(); while (isKw("and")) { p++; l = { k: "and", a: l, b: notE() }; } return l; }
    function notE() { if (isKw("not")) { p++; return { k: "not", a: notE() }; } return cmpE(); }
    function cmpE() {
      var l = add(), ops = [];
      for (;;) {
        var op = null;
        if (T[p].t === "OP" && /^(==|!=|<=|>=|<|>)$/.test(T[p].v)) { op = T[p++].v; }
        else if (isKw("in")) { p++; op = "in"; } else if (isKw("not") && T[p + 1].t === "KW" && T[p + 1].v === "in") { p += 2; op = "not in"; }
        else if (isKw("is")) { p++; if (isKw("not")) { p++; op = "is not"; } else op = "is"; }
        if (!op) break; ops.push([op, add()]);
      }
      return ops.length ? { k: "cmp", l: l, ops: ops } : l;
    }
    function add() { var l = mul(); while (isOp("+") || isOp("-")) { var o = T[p++].v; l = { k: "bin", op: o, a: l, b: mul() }; } return l; }
    function mul() { var l = unary(); while (isOp("*") || isOp("/") || isOp("//") || isOp("%")) { var o = T[p++].v; l = { k: "bin", op: o, a: l, b: unary() }; } return l; }
    function unary() { if (isOp("-")) { p++; return { k: "neg", a: unary() }; } if (isOp("+")) { p++; return unary(); } return pow(); }
    function pow() { var b = postfix(); if (isOp("**")) { p++; return { k: "bin", op: "**", a: b, b: unary() }; } return b; }
    function postfix() {
      var e = atom();
      for (;;) {
        if (isOp("(")) { p++; var args = [], kw = {}; while (!isOp(")")) { if (T[p].t === "NAME" && T[p + 1].t === "OP" && T[p + 1].v === "=") { var kn = T[p].v; p += 2; kw[kn] = expr(); } else args.push(expr()); if (isOp(",")) p++; } eatOp(")"); e = { k: "call", f: e, args: args, kw: kw, line: T[p - 1].line }; }
        else if (isOp("[")) { p++; var lo = null, hi = null, st = null, sl = false; if (!isOp(":")) lo = expr(); if (isOp(":")) { sl = true; p++; if (!isOp("]") && !isOp(":")) hi = expr(); if (isOp(":")) { p++; if (!isOp("]")) st = expr(); } } eatOp("]"); e = sl ? { k: "slice", o: e, lo: lo, hi: hi, st: st } : { k: "idx", o: e, i: lo }; }
        else if (isOp(".")) { p++; e = { k: "attr", o: e, n: T[p++].v }; }
        else break;
      }
      return e;
    }
    function atom() {
      var t = T[p];
      if (t.t === "NUM") { p++; return { k: "const", v: t.v }; }
      if (t.t === "STR" || t.t === "FSTR") { var parts = []; while (T[p].t === "STR" || T[p].t === "FSTR") { parts.push(T[p].t === "FSTR" ? fstr(T[p].v, T[p].line) : { k: "const", v: T[p].v }); p++; } return parts.length === 1 ? parts[0] : { k: "join", a: parts }; }
      if (t.t === "NAME") { p++; return { k: "name", v: t.v, line: t.line }; }
      if (t.t === "KW") { if (t.v === "True") { p++; return { k: "const", v: true }; } if (t.v === "False") { p++; return { k: "const", v: false }; } if (t.v === "None") { p++; return { k: "const", v: null }; } }
      if (isOp("(")) { p++; if (isOp(")")) { p++; return { k: "tuple", a: [] }; } var e = expr(); if (isOp(",")) { var a = [e]; while (isOp(",")) { p++; if (isOp(")")) break; a.push(expr()); } eatOp(")"); return { k: "tuple", a: a }; } eatOp(")"); return e; }
      if (isOp("[")) { p++; if (isOp("]")) { p++; return { k: "list", a: [] }; } var first = expr(); if (isKw("for")) { var cl = comp(); eatOp("]"); return { k: "listcomp", e: first, cl: cl }; } var a2 = [first]; while (isOp(",")) { p++; if (isOp("]")) break; a2.push(expr()); } eatOp("]"); return { k: "list", a: a2 }; }
      if (isOp("{")) { p++; var ks = [], vs = []; while (!isOp("}")) { ks.push(expr()); eatOp(":"); vs.push(expr()); if (isOp(",")) p++; } eatOp("}"); return { k: "dict", ks: ks, vs: vs }; }
      err("unexpected '" + (t.v === undefined ? t.t : t.v) + "'");
    }
    function comp() { var cl = []; while (isKw("for") || isKw("if")) { if (isKw("for")) { p++; var tg = target(); eatKw("in"); cl.push({ f: tg, it: orE() }); } else { p++; cl.push({ c: orE() }); } } return cl; }
    function fstr(s, line) {
      var parts = [], i = 0, lit = "";
      while (i < s.length) {
        if (s[i] === "{" && s[i + 1] === "{") { lit += "{"; i += 2; continue; } if (s[i] === "}" && s[i + 1] === "}") { lit += "}"; i += 2; continue; }
        if (s[i] === "{") { if (lit) { parts.push({ k: "const", v: lit }); lit = ""; } var d = 1, j = i + 1; while (j < s.length && d) { if (s[j] === "{") d++; if (s[j] === "}") d--; j++; } var inner = s.slice(i + 1, j - 1), spec = null, depth = 0, cut = -1;
          for (var q = 0; q < inner.length; q++) { var ch = inner[q]; if ("([{".indexOf(ch) >= 0) depth++; else if (")]}".indexOf(ch) >= 0) depth--; else if (ch === ":" && depth === 0) { cut = q; break; } }
          if (cut >= 0) { spec = inner.slice(cut + 1); inner = inner.slice(0, cut); }
          var sub = parse(tokenize(inner.trim() + "\n")); parts.push({ k: "fmt", e: sub[0].e, spec: spec }); i = j; continue; }
        lit += s[i++];
      }
      if (lit) parts.push({ k: "const", v: lit }); return { k: "join", a: parts };
    }
    var prog = []; skipNL(); while (T[p].t !== "EOF") { skipNL(); if (T[p].t === "EOF") break; prog.push(stmt()); skipNL(); } return prog;
  }

  /* ---------- evaluator ---------- */
  function Brk() { } function Cnt() { } function Ret(v) { this.v = v; }
  function run(src, opts) {
    opts = opts || {}; var out = "", inputs = (opts.inputs || []).slice(), steps = 0;
    function w(s) { out += s; if (out.length > 20000) throw new PyErr("RuntimeError", "too much output, so this looks like an infinite loop"); }
    var globals = new Map(), builtins = {};
    function def(name, f) { f.pyname = name; builtins[name] = f; }
    function idx(x, i) {
      if (x instanceof Map) { if (!x.has(i)) throw new PyErr("KeyError", repr(i)); return x.get(i); }
      if (typeof i !== "number" && typeof i !== "boolean") throw new PyErr("TypeError", typeName(x) + " indices must be integers or slices, not " + typeName(i));
      var L = typeof x === "string" ? x : Array.isArray(x) ? x : x instanceof Tup ? x.a : toList(x), k = nv(i); if (k < 0) k += L.length;
      if (k < 0 || k >= L.length) throw new PyErr("IndexError", (typeof x === "string" ? "string" : Array.isArray(x) ? "list" : "tuple") + " index out of range");
      return typeof x === "string" ? x[k] : L[k];
    }
    function slice(x, lo, hi, st) {
      var isS = typeof x === "string", L = isS ? x.split("") : Array.isArray(x) ? x : x instanceof Tup ? x.a : null; if (!L) throw new PyErr("TypeError", "'" + typeName(x) + "' object is not subscriptable");
      st = st == null ? 1 : st; if (st === 0) throw new PyErr("ValueError", "slice step cannot be zero"); var n = L.length, a, b;
      if (st > 0) { a = lo == null ? 0 : lo < 0 ? Math.max(0, lo + n) : Math.min(lo, n); b = hi == null ? n : hi < 0 ? Math.max(0, hi + n) : Math.min(hi, n); }
      else { a = lo == null ? n - 1 : lo < 0 ? Math.max(-1, lo + n) : Math.min(lo, n - 1); b = hi == null ? -1 : hi < 0 ? Math.max(-1, hi + n) : Math.min(hi, n - 1); }
      var o = []; for (var i = a; st > 0 ? i < b : i > b; i += st) o.push(L[i]);
      return isS ? o.join("") : (x instanceof Tup ? new Tup(o) : o);
    }
    function lookup(scope, name) { var s = scope; while (s) { if (s.vars.has(name)) return s.vars.get(name); s = s.parent; } if (builtins.hasOwnProperty(name)) return builtins[name]; throw new PyErr("NameError", "name '" + name + "' is not defined"); }
    function assign(tg, v, scope) {
      if (tg.k === "name") { var s = scope; if (scope.glob && scope.glob[tg.v]) s = globalScope; s.vars.set(tg.v, v); }
      else if (tg.k === "tuple") { var L = toList(v); if (L.length !== tg.a.length) throw new PyErr("ValueError", L.length > tg.a.length ? "too many values to unpack (expected " + tg.a.length + ")" : "not enough values to unpack (expected " + tg.a.length + ", got " + L.length + ")"); tg.a.forEach(function (t, i) { assign(t, L[i], scope); }); }
      else if (tg.k === "idx") { var o = ev(tg.o, scope), i = ev(tg.i, scope); if (Array.isArray(o)) { var k = nv(i); if (k < 0) k += o.length; if (k < 0 || k >= o.length) throw new PyErr("IndexError", "list assignment index out of range"); o[k] = v; } else if (o instanceof Map) o.set(i, v); else if (typeof o === "string") throw new PyErr("TypeError", "'str' object does not support item assignment"); else if (o instanceof Tup) throw new PyErr("TypeError", "'tuple' object does not support item assignment"); else throw new PyErr("TypeError", "'" + typeName(o) + "' object does not support item assignment"); }
      else throw new PyErr("SyntaxError", "cannot assign to expression");
    }
    var globalScope = { vars: globals, parent: null };
    function callFn(f, args, kw, scope) {
      if (++steps > 300000) throw new PyErr("RuntimeError", "program ran too long (is there an infinite loop?)");
      if (typeof f === "function") return f(args, kw || {});
      if (!(f instanceof Fn)) throw new PyErr("TypeError", "'" + typeName(f) + "' object is not callable");
      var s = { vars: new Map(), parent: f.scope, glob: {} }; kw = kw || {};
      if (args.length > f.params.length) throw new PyErr("TypeError", f.name + "() takes " + f.params.length + " positional argument" + (f.params.length === 1 ? "" : "s") + " but " + args.length + " were given");
      f.params.forEach(function (pn, i) { if (i < args.length) s.vars.set(pn, args[i]); else if (kw.hasOwnProperty(pn)) s.vars.set(pn, kw[pn]); else if (f.defs.hasOwnProperty(pn)) s.vars.set(pn, f.defs[pn]); else throw new PyErr("TypeError", f.name + "() missing 1 required positional argument: '" + pn + "'"); });
      try { execBlock(f.body, s); } catch (e) { if (e instanceof Ret) return e.v; throw e; } return null;
    }
    function strMethod(s, n, a) {
      switch (n) {
        case "upper": return s.toUpperCase(); case "lower": return s.toLowerCase(); case "capitalize": return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); case "title": return s.replace(/\w\S*/g, function (t) { return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); });
        case "strip": return a.length ? s.replace(new RegExp("^[" + a[0].replace(/[\]\\^-]/g, "\\$&") + "]+|[" + a[0].replace(/[\]\\^-]/g, "\\$&") + "]+$", "g"), "") : s.trim(); case "lstrip": return s.replace(/^\s+/, ""); case "rstrip": return s.replace(/\s+$/, "");
        case "split": { var r = a.length && a[0] !== null ? s.split(a[0]) : s.trim().split(/\s+/); return r[0] === "" && !a.length ? [] : r; } case "join": return toList(a[0]).map(function (x) { if (typeof x !== "string") throw new PyErr("TypeError", "sequence item 0: expected str instance, " + typeName(x) + " found"); return x; }).join(s);
        case "replace": return s.split(a[0]).join(a[1]); case "find": return s.indexOf(a[0]); case "index": { var ix = s.indexOf(a[0]); if (ix < 0) throw new PyErr("ValueError", "substring not found"); return ix; } case "count": return a[0] === "" ? s.length + 1 : s.split(a[0]).length - 1;
        case "startswith": return s.startsWith(a[0]); case "endswith": return s.endsWith(a[0]); case "isdigit": return /^\d+$/.test(s); case "isalpha": return /^[A-Za-z]+$/.test(s); case "isalnum": return /^[A-Za-z0-9]+$/.test(s); case "isupper": return s !== s.toLowerCase() && s === s.toUpperCase(); case "islower": return s !== s.toUpperCase() && s === s.toLowerCase(); case "isspace": return /^\s+$/.test(s);
        case "format": { var ai = 0; return s.replace(/\{(\d*)(?::([^}]*))?\}/g, function (m, i2, sp) { var v = a[i2 === "" ? ai++ : +i2]; return sp ? fmtSpec(v, sp) : str(v); }); }
        case "zfill": { var z = s; while (z.length < a[0]) z = "0" + z; return z; } case "center": { var c = s; while (c.length < a[0]) c = c.length % 2 ? c + " " : " " + c; return c; }
      }
      throw new PyErr("AttributeError", "'str' object has no attribute '" + n + "'");
    }
    function listMethod(L, n, a) {
      switch (n) {
        case "append": L.push(a[0]); return null; case "extend": toList(a[0]).forEach(function (x) { L.push(x); }); return null; case "insert": { var k = nv(a[0]); if (k < 0) k = Math.max(0, k + L.length); L.splice(Math.min(k, L.length), 0, a[1]); return null; }
        case "remove": { var i = -1; for (var q = 0; q < L.length; q++) if (eq(L[q], a[0])) { i = q; break; } if (i < 0) throw new PyErr("ValueError", "list.remove(x): x not in list"); L.splice(i, 1); return null; }
        case "pop": { if (!L.length) throw new PyErr("IndexError", "pop from empty list"); var j = a.length ? nv(a[0]) : -1; if (j < 0) j += L.length; if (j < 0 || j >= L.length) throw new PyErr("IndexError", "pop index out of range"); return L.splice(j, 1)[0]; }
        case "sort": { var rev = a.rev; L.sort(function (x, y) { return cmp(x, y, "<") ? -1 : cmp(y, x, "<") ? 1 : 0; }); if (rev) L.reverse(); return null; } case "reverse": L.reverse(); return null;
        case "index": { for (var m = 0; m < L.length; m++) if (eq(L[m], a[0])) return m; throw new PyErr("ValueError", repr(a[0]) + " is not in list"); } case "count": return L.filter(function (x) { return eq(x, a[0]); }).length; case "copy": return L.slice(); case "clear": L.length = 0; return null;
      }
      throw new PyErr("AttributeError", "'list' object has no attribute '" + n + "'");
    }
    function dictMethod(D, n, a) {
      switch (n) {
        case "keys": return Array.from(D.keys()); case "values": return Array.from(D.values()); case "items": return Array.from(D.entries()).map(function (e) { return new Tup([e[0], e[1]]); });
        case "get": return D.has(a[0]) ? D.get(a[0]) : (a.length > 1 ? a[1] : null); case "pop": { if (!D.has(a[0])) { if (a.length > 1) return a[1]; throw new PyErr("KeyError", repr(a[0])); } var v = D.get(a[0]); D.delete(a[0]); return v; }
        case "update": a[0].forEach(function (v, k) { D.set(k, v); }); return null; case "clear": D.clear(); return null; case "copy": return new Map(D);
      }
      throw new PyErr("AttributeError", "'dict' object has no attribute '" + n + "'");
    }
    function ev(n, sc) {
      switch (n.k) {
        case "const": return n.v;
        case "name": return lookup(sc, n.v);
        case "join": return n.a.map(function (x) { return str(ev(x, sc)); }).join("");
        case "fmt": { var v = ev(n.e, sc); return n.spec ? fmtSpec(v, n.spec) : str(v); }
        case "tuple": return new Tup(n.a.map(function (x) { return ev(x, sc); }));
        case "list": return n.a.map(function (x) { return ev(x, sc); });
        case "dict": { var m = new Map(); n.ks.forEach(function (k, i) { m.set(ev(k, sc), ev(n.vs[i], sc)); }); return m; }
        case "listcomp": { var res = []; (function rec(i, s2) { if (i === n.cl.length) { res.push(ev(n.e, s2)); return; } var c = n.cl[i]; if (c.c) { if (truthy(ev(c.c, s2))) rec(i + 1, s2); return; } toList(ev(c.it, s2)).forEach(function (x) { var s3 = { vars: new Map(s2.vars), parent: s2.parent, glob: s2.glob }; assign(c.f, x, s3); if (++steps > 300000) throw new PyErr("RuntimeError", "program ran too long"); rec(i + 1, s3); }); })(0, { vars: new Map(), parent: sc }); return res; }
        case "neg": { var a = ev(n.a, sc); if (!isNum(a)) throw new PyErr("TypeError", "bad operand type for unary -: '" + typeName(a) + "'"); return isF(a) ? new Flt(-a.v) : -nv(a); }
        case "not": return !truthy(ev(n.a, sc));
        case "and": { var l = ev(n.a, sc); return truthy(l) ? ev(n.b, sc) : l; }
        case "or": { var l2 = ev(n.a, sc); return truthy(l2) ? l2 : ev(n.b, sc); }
        case "tern": return truthy(ev(n.c, sc)) ? ev(n.a, sc) : ev(n.b, sc);
        case "bin": return arith(n.op, ev(n.a, sc), ev(n.b, sc));
        case "cmp": { var left = ev(n.l, sc); for (var i = 0; i < n.ops.length; i++) { var op = n.ops[i][0], right = ev(n.ops[i][1], sc), ok;
            if (op === "==") ok = eq(left, right); else if (op === "!=") ok = !eq(left, right); else if (op === "in" || op === "not in") { var f; if (typeof right === "string") { if (typeof left !== "string") throw new PyErr("TypeError", "'in <string>' requires string as left operand, not " + typeName(left)); f = right.indexOf(left) >= 0; } else if (right instanceof Map) f = right.has(left); else f = toList(right).some(function (x) { return eq(x, left); }); ok = op === "in" ? f : !f; }
            else if (op === "is") ok = left === right || (isNum(left) && isNum(right) && nv(left) === nv(right) && typeof left === typeof right); else if (op === "is not") ok = !(left === right); else ok = cmp(left, right, op);
            if (!ok) return false; left = right; } return true; }
        case "idx": return idx(ev(n.o, sc), ev(n.i, sc));
        case "slice": return slice(ev(n.o, sc), n.lo ? ev(n.lo, sc) : null, n.hi ? ev(n.hi, sc) : null, n.st ? ev(n.st, sc) : null);
        case "attr": { var o = ev(n.o, sc); if (o instanceof Mod) { if (!o.o.hasOwnProperty(n.n)) throw new PyErr("AttributeError", "module '" + o.name + "' has no attribute '" + n.n + "'"); return o.o[n.n]; } return { bound: o, name: n.n }; }
        case "call": {
          var args = n.args.map(function (x) { return ev(x, sc); }), kw = {}; Object.keys(n.kw).forEach(function (k) { kw[k] = ev(n.kw[k], sc); });
          if (n.f.k === "attr") { var obj = ev(n.f.o, sc), nm = n.f.n;
            if (obj instanceof Mod) return callFn(obj.o[nm], args, kw, sc);
            if (typeof obj === "string") return strMethod(obj, nm, args); if (Array.isArray(obj)) { if (nm === "sort") args.rev = kw.reverse; return listMethod(obj, nm, args); } if (obj instanceof Map) return dictMethod(obj, nm, args);
            throw new PyErr("AttributeError", "'" + typeName(obj) + "' object has no attribute '" + nm + "'"); }
          return callFn(ev(n.f, sc), args, kw, sc);
        }
      }
      throw new PyErr("SyntaxError", "unsupported expression");
    }
    function execBlock(b, sc) { for (var i = 0; i < b.length; i++) exec(b[i], sc); }
    function exec(n, sc) {
      if (++steps > 300000) throw new PyErr("RuntimeError", "program ran too long (is there an infinite loop?)");
      switch (n.k) {
        case "expr": ev(n.e, sc); return;
        case "assign": { var v = ev(n.v, sc); n.tg.forEach(function (t) { assign(t, v, sc); }); return; }
        case "aug": { var cur = ev(n.tg, sc); assign(n.tg, (Array.isArray(cur) && n.op === "+") ? (function () { var r = toList(ev(n.v, sc)); r.forEach(function (x) { cur.push(x); }); return cur; })() : arith(n.op, cur, ev(n.v, sc)), sc); return; }
        case "if": if (truthy(ev(n.c, sc))) execBlock(n.b, sc); else execBlock(n.e, sc); return;
        case "while": { while (truthy(ev(n.c, sc))) { try { execBlock(n.b, sc); } catch (e) { if (e instanceof Brk) break; if (e instanceof Cnt) continue; throw e; } if (++steps > 300000) throw new PyErr("RuntimeError", "program ran too long (is there an infinite loop?)"); } return; }
        case "for": { var L = toList(ev(n.it, sc)); for (var i = 0; i < L.length; i++) { assign(n.tg, L[i], sc); try { execBlock(n.b, sc); } catch (e) { if (e instanceof Brk) break; if (e instanceof Cnt) continue; throw e; } } return; }
        case "def": { var defs = {}; Object.keys(n.ds).forEach(function (k) { defs[k] = ev(n.ds[k], sc); }); sc.vars.set(n.name, new Fn(n.name, n.ps, defs, n.b, sc)); return; }
        case "return": throw new Ret(n.v ? ev(n.v, sc) : null);
        case "break": throw new Brk(); case "continue": throw new Cnt(); case "pass": return;
        case "global": n.n.forEach(function (g) { sc.glob = sc.glob || {}; sc.glob[g] = true; }); return;
        case "import": { var mods = { math: new Mod("math", { pi: new Flt(Math.PI), e: new Flt(Math.E), sqrt: function (a) { if (nv(a[0]) < 0) throw new PyErr("ValueError", "math domain error"); return new Flt(Math.sqrt(nv(a[0]))); }, floor: function (a) { return Math.floor(nv(a[0])); }, ceil: function (a) { return Math.ceil(nv(a[0])); }, pow: function (a) { return new Flt(Math.pow(nv(a[0]), nv(a[1]))); } }), random: new Mod("random", { randint: function (a) { return a[0] + Math.floor(Math.random() * (a[1] - a[0] + 1)); }, choice: function (a) { var L = toList(a[0]); return L[Math.floor(Math.random() * L.length)]; }, random: function () { return new Flt(Math.random()); } }) };
          if (!mods[n.m]) throw new PyErr("ModuleNotFoundError", "No module named '" + n.m + "'"); sc.vars.set(n.a, mods[n.m]); return; }
        case "from": { var mm = { math: { sqrt: 1, pi: 1, floor: 1, ceil: 1 }, random: { randint: 1, choice: 1 } }; if (!mm[n.m]) throw new PyErr("ModuleNotFoundError", "No module named '" + n.m + "'"); var hold = new Map(); exec({ k: "import", m: n.m, a: "__m" }, { vars: hold }); n.n.forEach(function (nm) { sc.vars.set(nm, hold.get("__m").o[nm]); }); return; }
        case "raise": { var ex = n.v ? ev(n.v, sc) : new PyErr("RuntimeError", "No active exception to reraise"); if (typeof ex === "function") ex = ex([], {}); throw ex; }
        case "try": { try { try { execBlock(n.b, sc); } catch (e) { if (!(e instanceof PyErr)) throw e; var done = false; for (var h = 0; h < n.h.length; h++) { var hd = n.h[h], ok = !hd.ty; if (hd.ty) { var ty = ev(hd.ty, sc); var tl = ty instanceof Tup ? ty.a : [ty]; ok = tl.some(function (z) { return z.pyname === e.type || z.pyname === "Exception"; }); } if (ok) { if (hd.as) sc.vars.set(hd.as, e); execBlock(hd.b, sc); done = true; break; } } if (!done) throw e; } } finally { if (n.f) execBlock(n.f, sc); } return; }
      }
    }
    function mkExc(name) { def(name, function (a) { return new PyErr(name, a.length ? str(a[0]) : ""); }); }
    ["Exception", "ValueError", "TypeError", "ZeroDivisionError", "IndexError", "KeyError", "NameError", "RuntimeError", "AttributeError"].forEach(mkExc);
    def("print", function (a, kw) { var sep = kw.sep != null ? kw.sep : " ", end = kw.end != null ? kw.end : "\n"; w(a.map(str).join(sep) + end); return null; });
    def("len", function (a) { var x = a[0]; if (typeof x === "string") return x.length; if (Array.isArray(x)) return x.length; if (x instanceof Tup) return x.a.length; if (x instanceof Map) return x.size; if (x instanceof Rng) return rlen(x); throw new PyErr("TypeError", "object of type '" + typeName(x) + "' has no len()"); });
    def("range", function (a) { var s = 0, e, st = 1; if (a.length === 1) e = a[0]; else { s = a[0]; e = a[1]; if (a.length > 2) st = a[2]; } [s, e, st].forEach(function (z) { if (typeof z !== "number") throw new PyErr("TypeError", "'" + typeName(z) + "' object cannot be interpreted as an integer"); }); if (st === 0) throw new PyErr("ValueError", "range() arg 3 must not be zero"); return new Rng(s, e, st); });
    def("int", function (a) { var x = a[0]; if (x === undefined) return 0; if (typeof x === "string") { var t = x.trim(); if (!/^[+-]?\d+$/.test(t)) throw new PyErr("ValueError", "invalid literal for int() with base 10: " + repr(x)); return parseInt(t, 10); } if (isNum(x)) return Math.trunc(nv(x)); throw new PyErr("TypeError", "int() argument must be a string or a number, not '" + typeName(x) + "'"); });
    def("float", function (a) { var x = a[0]; if (x === undefined) return new Flt(0); if (typeof x === "string") { var t = x.trim(); if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) throw new PyErr("ValueError", "could not convert string to float: " + repr(x)); return new Flt(parseFloat(t)); } if (isNum(x)) return new Flt(nv(x)); throw new PyErr("TypeError", "float() argument must be a string or a number, not '" + typeName(x) + "'"); });
    def("str", function (a) { return a.length ? str(a[0]) : ""; });
    def("bool", function (a) { return a.length ? truthy(a[0]) : false; });
    def("list", function (a) { return a.length ? toList(a[0]) : []; });
    def("tuple", function (a) { return new Tup(a.length ? toList(a[0]) : []); });
    def("dict", function () { return new Map(); });
    def("abs", function (a) { return isF(a[0]) ? new Flt(Math.abs(a[0].v)) : Math.abs(nv(a[0])); });
    def("round", function (a) { var x = nv(a[0]); if (a.length > 1 && a[1] !== null) { var d = Math.pow(10, a[1]); return new Flt(Number((Math.round(x * d) / d).toFixed(a[1]))); } var f = Math.floor(x), diff = x - f; return diff < 0.5 ? f : diff > 0.5 ? f + 1 : (f % 2 === 0 ? f : f + 1); });
    def("min", function (a) { var L = a.length === 1 ? toList(a[0]) : a; return L.reduce(function (m, x) { return cmp(x, m, "<") ? x : m; }); });
    def("max", function (a) { var L = a.length === 1 ? toList(a[0]) : a; return L.reduce(function (m, x) { return cmp(x, m, ">") ? x : m; }); });
    def("sum", function (a) { return toList(a[0]).reduce(function (s, x) { return arith("+", s, x); }, 0); });
    def("sorted", function (a, kw) { var L = toList(a[0]); L.sort(function (x, y) { return cmp(x, y, "<") ? -1 : cmp(y, x, "<") ? 1 : 0; }); if (kw.reverse) L.reverse(); return L; });
    def("reversed", function (a) { return toList(a[0]).reverse(); });
    def("enumerate", function (a) { return toList(a[0]).map(function (x, i) { return new Tup([i, x]); }); });
    def("zip", function (a) { var Ls = a.map(toList), n = Math.min.apply(null, Ls.map(function (l) { return l.length; })), o = []; for (var i = 0; i < n; i++) o.push(new Tup(Ls.map(function (l) { return l[i]; }))); return o; });
    def("type", function (a) { return "<class '" + typeName(a[0]) + "'>"; });
    def("isinstance", function (a) { var t = a[1].pyname; var tn = typeName(a[0]); return tn === t || (t === "int" && tn === "bool") || (t === "float" && tn === "float"); });
    def("input", function (a) { var pr = a.length ? str(a[0]) : ""; var val = inputs.length ? inputs.shift() : ""; w(pr + val + "\n"); return val; });
    def("repr", function (a) { return repr(a[0]); });
    def("any", function (a) { return toList(a[0]).some(truthy); }); def("all", function (a) { return toList(a[0]).every(truthy); });
    def("ord", function (a) { return a[0].charCodeAt(0); }); def("chr", function (a) { return String.fromCharCode(a[0]); });
    try { execBlock(parse(tokenize(src)), globalScope); return { out: out, err: "" }; }
    catch (e) {
      if (e instanceof PyErr) return { out: out, err: e.type + ": " + e.msg };
      if (e instanceof Brk || e instanceof Cnt) return { out: out, err: "SyntaxError: 'break' or 'continue' outside loop" };
      if (e instanceof Ret) return { out: out, err: "SyntaxError: 'return' outside function" };
      return { out: out, err: "Error: " + e.message };
    }
  }
  window.MiniPy = { run: run };
})();
