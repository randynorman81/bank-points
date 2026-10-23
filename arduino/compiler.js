/* Arduino sketch compiler for the SCHS Arduino editor.
   Turns the Arduino C++ that students type (the part of the language a first embedded-computing class uses) into JavaScript that the
   browser can run. It also catches the common mistakes and explains them in plain words, with the line number.

   ArduinoCompiler.compile(source) -> { ok, errors:[{line,msg}], warnings:[{line,msg}], make(rt) -> {init, setup, loop} }

   Supported: setup/loop, your own functions (with return values and array parameters), int long float double bool byte char String,
   unsigned and sized types, arrays, #define, const, if/else, for, while, do/while, switch, break/continue/return, ++ -- += etc,
   the ternary operator, casts, and the Arduino functions (pinMode, digitalWrite, digitalRead, analogRead, analogWrite, delay, millis,
   tone, random, map, constrain, Serial.print/println/begin/available/read/parseInt, and more).
   Numbers behave like the real Uno: int is 16 bits and wraps around, int / int is a whole number, and so on. */
(function (root) {
  "use strict";

  /* ------------------------------------------------------------------ constants */
  var CONSTS = {
    HIGH: [1, "int"], LOW: [0, "int"], INPUT: [0, "int"], OUTPUT: [1, "int"], INPUT_PULLUP: [2, "int"], LED_BUILTIN: [13, "int"],
    A0: [14, "int"], A1: [15, "int"], A2: [16, "int"], A3: [17, "int"], A4: [18, "int"], A5: [19, "int"],
    PI: [Math.PI, "float"], HALF_PI: [Math.PI / 2, "float"], TWO_PI: [Math.PI * 2, "float"], DEG_TO_RAD: [Math.PI / 180, "float"], RAD_TO_DEG: [180 / Math.PI, "float"],
    DEC: [10, "int"], HEX: [16, "int"], BIN: [2, "int"], OCT: [8, "int"], LSBFIRST: [0, "int"], MSBFIRST: [1, "int"],
    true: [1, "bool"], false: [0, "bool"], NULL: [0, "int"]
  };
  var TYPE_WORDS = { void: 1, int: 1, long: 1, short: 1, char: 1, float: 1, double: 1, bool: 1, boolean: 1, byte: 1, word: 1, unsigned: 1, signed: 1, String: 1,
    uint8_t: 1, uint16_t: 1, uint32_t: 1, int8_t: 1, int16_t: 1, int32_t: 1, size_t: 1, const: 1, static: 1, volatile: 1 };
  var UNSUPPORTED = { struct: "structs", class: "classes", enum: "enums", typedef: "typedef", template: "templates", namespace: "namespaces", goto: "goto", union: "unions" };
  var RESERVED_JS = {};
  var INTLIKE = { int: 1, uint: 1, long: 1, ulong: 1, byte: 1, char: 1, bool: 1 };

  function isNum(t) { return INTLIKE[t] || t === "float"; }
  function isInt(t) { return !!INTLIKE[t]; }
  function isUnsigned(t) { return t === "uint" || t === "ulong" || t === "byte"; }
  var TYPE_NAME = { int: "int", uint: "unsigned int", long: "long", ulong: "unsigned long", byte: "byte", char: "char", bool: "bool", float: "float", String: "String", cstr: "text", void: "void" };
  function binType(a, b) {
    if (a === "float" || b === "float") return "float";
    if (a === "ulong" || b === "ulong") return "ulong";
    if (a === "long" || b === "long") return (a === "uint" || b === "uint") ? "long" : "long";
    if (a === "uint" || b === "uint") return "uint";
    return "int";
  }
  function wrapCode(code, t) {
    switch (t) {
      case "int": return "((" + code + ")<<16>>16)";
      case "uint": return "((" + code + ")&65535)";
      case "long": return "((" + code + ")|0)";
      case "ulong": return "((" + code + ")>>>0)";
      case "byte": return "((" + code + ")&255)";
      case "char": return "((" + code + ")<<24>>24)";
      case "bool": return "((" + code + ")?1:0)";
      default: return code;
    }
  }
  /* convert code of type `from` to type `to` (assignments, arguments, returns). Returns null if the types do not mix. */
  function coerce(code, from, to) {
    if (from === to) return code;
    if (to === "float") return isNum(from) ? code : null;
    if (isInt(to)) {
      if (from === "float") return wrapCode("Math.trunc(" + code + ")", to);
      if (isInt(from)) {
        if (to === "bool") return "((" + code + ")?1:0)";
        var narrower = { byte: 0, char: 1, bool: 0, int: 2, uint: 2, long: 3, ulong: 3 };
        if (from === "bool" || (narrower[from] < narrower[to] && !(isUnsigned(from) !== isUnsigned(to) && to !== "int" && to !== "long")) ) return code;
        if (from === "byte" && (to === "int" || to === "uint" || to === "long" || to === "ulong" || to === "char")) return to === "char" ? wrapCode(code, to) : code;
        return wrapCode(code, to);
      }
      return null;
    }
    if (to === "String") { if (from === "cstr") return code; if (from === "char") return "String.fromCharCode(" + code + ")"; if (isNum(from)) return null; return null; }
    if (to === "cstr") return from === "String" || from === "cstr" ? code : null;
    return null;
  }

  /* ------------------------------------------------------------------ helpers for friendly messages */
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function suggest(name, pool) {
    var best = null, bd = 99, low = name.toLowerCase();
    pool.forEach(function (p) {
      if (p.toLowerCase() === low && p !== name) { if (bd > 0) { best = p; bd = 0; } return; }
      var d = lev(name, p); if (d < bd && d <= Math.max(1, Math.floor(name.length / 3))) { best = p; bd = d; }
    });
    return best;
  }
  function CompileError(line, msg) { this.line = line; this.msg = msg; }

  /* ------------------------------------------------------------------ tokenizer */
  function tokenize(src, errors) {
    var toks = [], i = 0, line = 1, n = src.length, macros = {};
    function err(msg) { errors.push({ line: line, msg: msg }); }
    function push(t, v, extra) { var o = { t: t, v: v, line: line }; if (extra) for (var k in extra) o[k] = extra[k]; toks.push(o); return o; }
    var OPS3 = ["<<=", ">>="], OPS2 = ["++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "==", "!=", "<=", ">=", "&&", "||", "<<", ">>", "->", "::"];
    while (i < n) {
      var c = src[i];
      if (c === "\n") { line++; i++; continue; }
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "/" && src[i + 1] === "*") {
        var startLine = line; i += 2;
        while (i < n && !(src[i] === "*" && src[i + 1] === "/")) { if (src[i] === "\n") line++; i++; }
        if (i >= n) { errors.push({ line: startLine, msg: "A comment that starts with /* is never closed. Finish it with */" }); break; }
        i += 2; continue;
      }
      if (c === "#") {
        var s = i; while (i < n && src[i] !== "\n") i++;
        var dl = src.slice(s, i).replace(/\/\/.*$/, "").trim(), m;
        if ((m = /^#\s*define\s+([A-Za-z_]\w*)(\(([^)]*)\))?\s*(.*)$/.exec(dl))) {
          var sub = []; var e2 = []; var body = m[4] || "";
          var mt = tokenize(body, e2); mt.pop();
          mt.forEach(function (tk) { tk.line = line; });
          macros[m[1]] = { params: m[2] ? m[3].split(",").map(function (x) { return x.trim(); }).filter(Boolean) : null, body: mt };
        } else if (/^#\s*(include|ifdef|ifndef|endif|else|if|pragma|undef)/.test(dl)) { /* ignored */ }
        else err("I do not understand this line: " + dl);
        continue;
      }
      if (/[A-Za-z_]/.test(c)) { var j = i; while (j < n && /\w/.test(src[j])) j++; push("id", src.slice(i, j)); i = j; continue; }
      if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1] || ""))) {
        var k = i, text, isF = false, type = "int", val;
        if (c === "0" && /[xX]/.test(src[i + 1] || "")) { k = i + 2; while (k < n && /[0-9a-fA-F]/.test(src[k])) k++; val = parseInt(src.slice(i + 2, k), 16); }
        else if (c === "0" && /[bB]/.test(src[i + 1] || "") && /[01]/.test(src[i + 2] || "")) { k = i + 2; while (k < n && /[01]/.test(src[k])) k++; val = parseInt(src.slice(i + 2, k), 2); }
        else {
          while (k < n && /[0-9]/.test(src[k])) k++;
          if (src[k] === "." && /[0-9]/.test(src[k + 1] || "") || (src[k] === "." && !/[A-Za-z_.]/.test(src[k + 1] || ""))) { isF = true; k++; while (k < n && /[0-9]/.test(src[k])) k++; }
          if (/[eE]/.test(src[k] || "") && /[-+0-9]/.test(src[k + 1] || "")) { isF = true; k += 2; while (k < n && /[0-9]/.test(src[k])) k++; }
          text = src.slice(i, k); val = isF ? parseFloat(text) : (/^0[0-7]+$/.test(text) ? parseInt(text, 8) : parseInt(text, 10));
        }
        var suf = ""; while (k < n && /[uUlLfF]/.test(src[k])) { suf += src[k].toLowerCase(); k++; }
        if (isF || suf === "f") type = "float";
        else if (suf.indexOf("u") > -1) type = "ulong";
        else if (suf.indexOf("l") > -1 || val > 32767) type = val > 2147483647 ? "ulong" : "long";
        push("num", val, { type: type }); i = k;
        if (/[A-Za-z_]/.test(src[i] || "")) err("A number can not be followed by letters here (look near " + src.slice(i - 1, i + 3) + ")");
        continue;
      }
      if (c === '"') {
        var j2 = i + 1, out = "";
        while (j2 < n && src[j2] !== '"' && src[j2] !== "\n") {
          if (src[j2] === "\\") { var e = src[j2 + 1]; out += e === "n" ? "\n" : e === "t" ? "\t" : e === "r" ? "\r" : e === "0" ? "\0" : e; j2 += 2; } else { out += src[j2]; j2++; }
        }
        if (src[j2] !== '"') { err('A text in "quotes" is not closed. Add the closing " at the end of the text.'); i = j2; continue; }
        push("str", out); i = j2 + 1; continue;
      }
      if (c === "'") {
        var ch, j3 = i + 1;
        if (src[j3] === "\\") { var e3 = src[j3 + 1]; ch = e3 === "n" ? 10 : e3 === "t" ? 9 : e3 === "r" ? 13 : e3 === "0" ? 0 : e3.charCodeAt(0); j3 += 2; } else { ch = (src[j3] || "").charCodeAt(0); j3++; }
        if (src[j3] !== "'") { err("A single character needs a ' on both sides, like 'A'. For longer text use double quotes, like \"Hello\"."); i = j3; continue; }
        push("num", ch, { type: "char" }); i = j3 + 1; continue;
      }
      var three = src.substr(i, 3), two = src.substr(i, 2);
      if (OPS3.indexOf(three) > -1) { push("op", three); i += 3; continue; }
      if (OPS2.indexOf(two) > -1) { push("op", two); i += 2; continue; }
      if ("+-*/%=<>!&|^~?:;,.(){}[]".indexOf(c) > -1) { push("op", c); i++; continue; }
      err("I do not know what this character is: " + c); i++;
    }
    push("eof", "");
    /* expand #define macros */
    if (Object.keys(macros).length) {
      var out2 = [], guard = 0;
      (function expand(list, depth) {
        for (var x = 0; x < list.length; x++) {
          var tk = list[x];
          if (tk.t === "id" && macros[tk.v] && depth < 8) {
            var mc = macros[tk.v];
            if (mc.params) {
              if (!(list[x + 1] && list[x + 1].v === "(")) { out2.push(tk); continue; }
              var args = [], cur = [], lvl = 0, y = x + 2;
              for (; y < list.length; y++) {
                var tt = list[y];
                if (tt.v === "(" && tt.t === "op") lvl++;
                if (tt.v === ")" && tt.t === "op") { if (lvl === 0) break; lvl--; }
                if (tt.v === "," && tt.t === "op" && lvl === 0) { args.push(cur); cur = []; continue; }
                cur.push(tt);
              }
              args.push(cur);
              var body2 = [];
              mc.body.forEach(function (bt) { var pi = bt.t === "id" ? mc.params.indexOf(bt.v) : -1; if (pi > -1 && args[pi]) args[pi].forEach(function (a) { body2.push(a); }); else body2.push(bt); });
              body2.forEach(function (b2) { b2 = Object.assign({}, b2); b2.line = tk.line; });
              expand(body2.map(function (b2) { return Object.assign({}, b2, { line: tk.line }); }), depth + 1); x = y;
            } else expand(mc.body.map(function (b2) { return Object.assign({}, b2, { line: tk.line }); }), depth + 1);
          } else out2.push(tk);
        }
      })(toks, 0);
      toks = out2;
      if (!toks.length || toks[toks.length - 1].t !== "eof") toks.push({ t: "eof", v: "", line: line });
    }
    return toks;
  }

  /* ------------------------------------------------------------------ the compiler (parser + code generator in one pass) */
  function compile(source) {
    var errors = [], warnings = [];
    var toks = tokenize(String(source || ""), errors), p = 0;
    if (errors.length) return { ok: false, errors: errors, warnings: warnings };

    var globals = {}, funcs = {}, funcOrder = [], tmpCount = 0, curFn = null, curFnDefined = {}, scopes = [], pass = 1;
    var out = [], gdecl = [], ginit = [];

    function peek(o) { return toks[Math.min(p + (o || 0), toks.length - 1)]; }
    function next() { var t = toks[p]; if (p < toks.length - 1) p++; return t; }
    function isOp(v, o) { var t = peek(o); return t.t === "op" && t.v === v; }
    function isId(v, o) { var t = peek(o); return t.t === "id" && t.v === v; }
    function fail(line, msg) { throw new CompileError(line, msg); }
    function prevLine() { return p > 0 ? toks[p - 1].line : 1; }
    function expectOp(v, why) {
      if (isOp(v)) return next();
      var t = peek(), ln = (v === ";" || v === ")" || v === "]") && t.line > prevLine() ? prevLine() : t.line;
      var what = v === ";" ? "I expected a semicolon ; here. Every statement ends with a ;" : v === ")" ? "I expected a closing parenthesis ) here. Check that every ( has a matching )." : v === "}" ? "I expected a closing brace } here. Check that every { has a matching }." : v === "(" ? "I expected an opening parenthesis ( here." : "I expected " + v + " here.";
      if (why) what += " " + why;
      if (t.t === "eof" && v === "}") what = "Your code ends before a { is closed. You are missing a closing brace }.";
      fail(ln, what);
    }
    function describe(t) { return t.t === "eof" ? "the end of your code" : t.t === "str" ? 'the text "' + t.v + '"' : "'" + t.v + "'"; }

    /* ---- scopes */
    function pushScope() { scopes.push({}); }
    function popScope() { scopes.pop(); }
    function declare(name, info, line) {
      var sc = scopes.length ? scopes[scopes.length - 1] : globals;
      if (sc[name] && !(info.fn)) fail(line, "You already made a variable called " + name + " in this same place. Pick a different name, or remove one of them.");
      sc[name] = info; return info;
    }
    function lookup(name) {
      for (var i = scopes.length - 1; i >= 0; i--) if (scopes[i][name]) return scopes[i][name];
      return globals[name] || null;
    }
    function allNames() {
      var pool = Object.keys(CONSTS).concat(Object.keys(globals), Object.keys(funcs));
      scopes.forEach(function (s) { pool = pool.concat(Object.keys(s)); });
      return pool;
    }
    function jsName(n) { return "$" + n; }
    function tmp() { var n = "$t" + (++tmpCount); curFn && curFn.temps.push(n); return n; }

    /* ---- types */
    function parseType() {
      /* returns {type, isConst} or null */
      var start = p, words = [], isConst = false;
      while (peek().t === "id" && TYPE_WORDS[peek().v]) { var w = next().v; if (w === "const") { isConst = true; continue; } if (w === "static" || w === "volatile") continue; words.push(w); }
      if (!words.length) { p = start; return isConst ? null : null; }
      var uns = words.indexOf("unsigned") > -1, lng = words.filter(function (w) { return w === "long"; }).length, t;
      var base = words.filter(function (w) { return w !== "unsigned" && w !== "signed" && w !== "long" && w !== "short"; })[0];
      if (base === "String") t = "String";
      else if (base === "void") t = "void";
      else if (base === "float" || base === "double") t = "float";
      else if (base === "bool" || base === "boolean") t = "bool";
      else if (base === "byte" || base === "uint8_t") t = "byte";
      else if (base === "word" || base === "uint16_t") t = "uint";
      else if (base === "uint32_t" || base === "size_t") t = "ulong";
      else if (base === "int8_t") t = "char";
      else if (base === "int16_t") t = "int";
      else if (base === "int32_t") t = "long";
      else if (base === "char") t = uns ? "byte" : "char";
      else if (base === "int" || base === undefined) {
        if (lng) t = uns ? "ulong" : "long"; else t = uns ? "uint" : "int";
        if (words.indexOf("short") > -1) t = uns ? "uint" : "int";
      } else t = "int";
      /* pointers: only char* (text) */
      if (isOp("*")) {
        if (t === "char") { next(); t = "cstr"; } else fail(peek().line, "Pointers (the * after a type) are not used in this editor. Use a normal variable instead.");
      }
      if (isOp("&")) fail(peek().line, "References (the & after a type) are not supported in this editor yet. Return the value from the function instead.");
      return { type: t, isConst: isConst };
    }
    function startsType() {
      var t = peek(); return t.t === "id" && !!TYPE_WORDS[t.v];
    }

    /* ---- expressions: each returns {c: code, t: type, lv: lvalue-info or undefined} */
    var BUILTINS = buildBuiltins();
    function expression() { return assignment(); }
    function assignment() {
      var left = ternary(), t = peek();
      if (t.t === "op" && /^(=|\+=|-=|\*=|\/=|%=|&=|\|=|\^=|<<=|>>=)$/.test(t.v)) {
        next();
        if (!left.lv) fail(t.line, "You can only put a value into a variable (or an array spot). The left side of = is not a variable.");
        if (left.lv.isConst) fail(t.line, "'" + left.lv.name + "' was declared const, so its value can not change.");
        var right = assignment();
        if (t.v === "=") {
          var rc = coerceChecked(right.c, right.t, left.t, t.line, left.lv.name);
          return { c: left.lv.set(rc), t: left.t };
        }
        var op = t.v.slice(0, -1);
        var opr = binaryOp(op, { c: left.lv.get, t: left.t }, right, t.line);
        var rc2 = coerceChecked(opr.c, opr.t, left.t, t.line, left.lv.name, true);
        return { c: left.lv.set(rc2), t: left.t };
      }
      return left;
    }
    function coerceChecked(code, from, to, line, name, quiet) {
      if (from === "void") fail(line, "This function does not give back a value (it is void), so there is nothing to use here.");
      var r = coerce(code, from, to);
      if (r === null) {
        if (to === "String" && isNum(from)) fail(line, "You can not put a number straight into a String. Use String(number) to turn it into text first.");
        if (isNum(to) && (from === "String" || from === "cstr")) fail(line, "You can not store text in " + (name ? "'" + name + "'" : "a number variable") + " (it is a " + TYPE_NAME[to] + "). Text and numbers do not mix.");
        fail(line, "You can not put a " + TYPE_NAME[from] + " into " + (name ? "'" + name + "'" : "a " + TYPE_NAME[to]) + ".");
      }
      return r;
    }
    function ternary() {
      var cond = logicalOr();
      if (isOp("?")) {
        var q = next(); var a = expression(); expectOp(":"); var b = ternary();
        var t = (isNum(a.t) && isNum(b.t)) ? binType(a.t, b.t) : a.t;
        if (a.t === "bool" && b.t === "bool") t = "int";
        return { c: "((" + cond.c + ")?(" + coerce(a.c, a.t, t) + "):(" + (coerce(b.c, b.t, t) || b.c) + "))", t: t };
      }
      return cond;
    }
    function logicalOr() { var l = logicalAnd(); while (isOp("||")) { next(); var r = logicalAnd(); l = { c: "((" + l.c + "||" + r.c + ")?1:0)", t: "int" }; } return l; }
    function logicalAnd() { var l = bitOr(); while (isOp("&&")) { next(); var r = bitOr(); l = { c: "((" + l.c + "&&" + r.c + ")?1:0)", t: "int" }; } return l; }
    function bitOr() { var l = bitXor(); while (isOp("|") ) { var t = next(); l = binaryOp("|", l, bitXor(), t.line); } return l; }
    function bitXor() { var l = bitAnd(); while (isOp("^")) { var t = next(); l = binaryOp("^", l, bitAnd(), t.line); } return l; }
    function bitAnd() { var l = equality(); while (isOp("&")) { var t = next(); l = binaryOp("&", l, equality(), t.line); } return l; }
    function equality() { var l = relational(); while (isOp("==") || isOp("!=")) { var t = next(); l = binaryOp(t.v, l, relational(), t.line); } return l; }
    function relational() { var l = shift(); while (isOp("<") || isOp(">") || isOp("<=") || isOp(">=")) { var t = next(); l = binaryOp(t.v, l, shift(), t.line); } return l; }
    function shift() { var l = additive(); while (isOp("<<") || isOp(">>")) { var t = next(); l = binaryOp(t.v, l, additive(), t.line); } return l; }
    function additive() { var l = multiplicative(); while (isOp("+") || isOp("-")) { var t = next(); l = binaryOp(t.v, l, multiplicative(), t.line); } return l; }
    function multiplicative() { var l = unary(); while (isOp("*") || isOp("/") || isOp("%")) { var t = next(); l = binaryOp(t.v, l, unary(), t.line); } return l; }

    function binaryOp(op, a, b, line) {
      if (a.t === "void" || b.t === "void") fail(line, "A function that does not give back a value (void) can not be used in math or a comparison.");
      var strA = a.t === "String" || a.t === "cstr", strB = b.t === "String" || b.t === "cstr";
      if (strA || strB) {
        if (op === "+") {
          if (a.t === "String" || b.t === "String") {
            var ac = a.t === "String" || a.t === "cstr" ? a.c : (a.t === "char" ? "String.fromCharCode(" + a.c + ")" : "rt.numstr(" + a.c + ",\"" + a.t + "\")");
            var bc = b.t === "String" || b.t === "cstr" ? b.c : (b.t === "char" ? "String.fromCharCode(" + b.c + ")" : "rt.numstr(" + b.c + ",\"" + b.t + "\")");
            return { c: "(" + ac + "+" + bc + ")", t: "String" };
          }
          if (strA && strB) fail(line, "You can not add two pieces of text with + like this. Make the first one a String, like String(\"Hello \") + \"world\", or print them with two Serial.print lines.");
          fail(line, "You can not join text and a number with +. Print them separately (Serial.print(\"Score: \"); Serial.println(score);) or turn the first part into a String with String(\"Score: \") + score.");
        }
        if (op === "==" || op === "!=") {
          if (strA && strB) return { c: "((" + a.c + (op === "==" ? "===" : "!==") + b.c + ")?1:0)", t: "int" };
          fail(line, "You can not compare text with a number.");
        }
        fail(line, "The operator " + op + " does not work on text.");
      }
      var t;
      switch (op) {
        case "+": case "-": case "*":
          t = binType(a.t, b.t);
          return { c: t === "float" ? "(" + a.c + op + b.c + ")" : wrapCode(a.c + op + b.c, t), t: t };
        case "/":
          t = binType(a.t, b.t);
          if (t === "float") return { c: "(" + a.c + "/" + b.c + ")", t: t };
          return { c: wrapCode("rt.div(" + a.c + "," + b.c + ")", t), t: t };
        case "%":
          if (a.t === "float" || b.t === "float") fail(line, "The % (remainder) operator only works on whole numbers, not on float numbers.");
          t = binType(a.t, b.t);
          return { c: wrapCode("rt.mod(" + a.c + "," + b.c + ")", t), t: t };
        case "==": case "!=": case "<": case ">": case "<=": case ">=":
          return { c: "((" + a.c + (op === "==" ? "===" : op === "!=" ? "!==" : op) + b.c + ")?1:0)", t: "int" };
        case "&": case "|": case "^":
          if (a.t === "float" || b.t === "float") fail(line, "The operator " + op + " only works on whole numbers, not on float numbers.");
          t = binType(a.t, b.t);
          return { c: wrapCode(a.c + op + b.c, t), t: t };
        case "<<": case ">>":
          if (a.t === "float" || b.t === "float") fail(line, "The operator " + op + " only works on whole numbers.");
          t = binType(a.t, "int");
          if (op === "<<") return { c: wrapCode("(" + a.c + ")<<(" + b.c + ")", t), t: t };
          return { c: (isUnsigned(t) ? "((" + a.c + ")>>>(" + b.c + "))" : "((" + a.c + ")>>(" + b.c + "))"), t: t };
      }
      fail(line, "I do not know how to do " + op);
    }

    function unary() {
      var t = peek();
      if (t.t === "op") {
        if (t.v === "-") { next(); var u = unary(); if (!isNum(u.t)) fail(t.line, "The minus sign - only works on numbers."); var ty = u.t === "byte" || u.t === "char" || u.t === "bool" ? "int" : u.t; return { c: ty === "float" ? "(-" + u.c + ")" : wrapCode("-" + u.c, ty), t: ty }; }
        if (t.v === "+") { next(); return unary(); }
        if (t.v === "!") { next(); var u2 = unary(); return { c: "(" + u2.c + "?0:1)", t: "int" }; }
        if (t.v === "~") { next(); var u3 = unary(); return { c: wrapCode("~" + u3.c, binType(u3.t, "int")), t: binType(u3.t, "int") }; }
        if (t.v === "++" || t.v === "--") {
          next(); var tg = unary();
          if (!tg.lv) fail(t.line, "++ and -- only work on a variable.");
          if (!isNum(tg.t)) fail(t.line, "++ and -- only work on numbers.");
          var nv = tg.t === "float" ? tg.lv.get + (t.v === "++" ? "+1" : "-1") : wrapCode(tg.lv.get + (t.v === "++" ? "+1" : "-1"), tg.t);
          return { c: tg.lv.set(nv), t: tg.t };
        }
        if (t.v === "(" && (function () { var save = p; next(); var is = startsType(); p = save; return is; })()) {
          /* a cast like (int)x or (float)total */
          next(); var ty2 = parseType(); expectOp(")");
          var e = unary();
          if (!ty2) fail(t.line, "I do not understand this cast.");
          if (ty2.type === "String") fail(t.line, "Use String(value) instead of (String).");
          var cc = ty2.type === "float" && isNum(e.t) ? e.c : (isInt(ty2.type) && isNum(e.t) ? (e.t === "float" ? wrapCode("Math.trunc(" + e.c + ")", ty2.type) : wrapCode(e.c, ty2.type)) : null);
          if (cc === null) fail(t.line, "You can not turn this into a " + TYPE_NAME[ty2.type] + ".");
          return { c: cc, t: ty2.type };
        }
        if (t.v === "&" || t.v === "*") fail(t.line, "Pointers (& and * on a variable) are not used in this editor.");
      }
      return postfix();
    }

    function postfix() {
      var e = primary();
      for (;;) {
        var t = peek();
        if (t.t === "op" && t.v === "[") {
          next(); var idx = expression(); expectOp("]");
          if (!e.arr && e.t !== "cstr" && e.t !== "String") fail(t.line, "You used [ ] on something that is not an array.");
          if (e.arr && e.arr.dims > 1) {
            /* 2D arrays: a[i][j] */
            var bs = e.c, nm0 = e.lv ? e.lv.name : "array", cst = e.lv && e.lv.isConst; e = { c: bs + "[rt.ci(" + bs + "," + idx.c + ")]", t: e.t, arr: { dims: e.arr.dims - 1 }, lv: { name: nm0, isConst: cst, get: bs, set: function () { fail(t.line, "You need two index numbers for this array, like " + nm0 + "[row][column]."); } } };
            continue;
          }
          if (e.t === "cstr" || e.t === "String") { e = { c: "(" + e.c + ".charCodeAt(" + idx.c + ")||0)", t: "char" }; continue; }
          var base = e.c, ic = idx.c, isConst = e.lv && e.lv.isConst, nm = e.lv ? e.lv.name : "array";
          var elemT = e.t;
          e = { c: base + "[rt.ci(" + base + "," + ic + ")]", t: elemT, lv: { name: nm, isConst: isConst, get: base + "[rt.ci(" + base + "," + ic + ")]", set: function (v) { var a = tmp(), ix = tmp(); return "(" + a + "=" + base + "," + ix + "=rt.ci(" + a + "," + ic + ")," + a + "[" + ix + "]=" + v + ")"; } } };
          /* compound assignments evaluate base/index twice, which is fine for simple array/index expressions */
          e.lv.get = base + "[rt.ci(" + base + "," + ic + ")]";
          continue;
        }
        if (t.t === "op" && (t.v === "++" || t.v === "--")) {
          next(); if (!e.lv) fail(t.line, "++ and -- only work on a variable."); if (!isNum(e.t)) fail(t.line, "++ and -- only work on numbers.");
          var nv = e.t === "float" ? e.lv.get + (t.v === "++" ? "+1" : "-1") : wrapCode(e.lv.get + (t.v === "++" ? "+1" : "-1"), e.t);
          var tv = tmp();
          e = { c: "(" + tv + "=" + e.lv.get + "," + e.lv.set(nv) + "," + tv + ")", t: e.t, post: true, simple: e.lv.set(nv) };
          continue;
        }
        if (t.t === "op" && t.v === ".") {
          next(); var m = next(); if (m.t !== "id") fail(m.line, "I expected a method name after the dot."); expectOp("(");
          var args = []; if (!isOp(")")) { do { args.push(expression()); } while (isOp(",") && next()); } expectOp(")");
          e = stringMethod(e, m.v, args, m.line); continue;
        }
        break;
      }
      return e;
    }
    function stringMethod(e, name, args, line) {
      if (e.t !== "String" && e.t !== "cstr") fail(line, "." + name + "() is a method for text (a String). This is not a String.");
      var s = e.c;
      function need(n) { if (args.length !== n) fail(line, name + "() needs " + n + " value" + (n === 1 ? "" : "s") + "."); }
      switch (name) {
        case "length": need(0); return { c: s + ".length", t: "int" };
        case "toInt": need(0); return { c: "(parseInt(" + s + ",10)||0)", t: "long" };
        case "toFloat": need(0); return { c: "(parseFloat(" + s + ")||0)", t: "float" };
        case "charAt": need(1); return { c: "(" + s + ".charCodeAt(" + args[0].c + ")||0)", t: "char" };
        case "substring": if (args.length < 1 || args.length > 2) fail(line, "substring() needs 1 or 2 values."); return { c: s + ".substring(" + args.map(function (a) { return a.c; }).join(",") + ")", t: "String" };
        case "indexOf": need(1); return { c: s + ".indexOf(" + (args[0].t === "char" ? "String.fromCharCode(" + args[0].c + ")" : args[0].c) + ")", t: "int" };
        case "toUpperCase": need(0); return { c: s + ".toUpperCase()", t: "String" };
        case "toLowerCase": need(0); return { c: s + ".toLowerCase()", t: "String" };
        case "trim": need(0); return { c: s + ".trim()", t: "String" };
        case "equals": need(1); return { c: "((" + s + "===" + args[0].c + ")?1:0)", t: "int" };
        case "startsWith": need(1); return { c: "((" + s + ".startsWith(" + args[0].c + "))?1:0)", t: "int" };
        case "endsWith": need(1); return { c: "((" + s + ".endsWith(" + args[0].c + "))?1:0)", t: "int" };
        case "concat": need(1); if (!e.lv) fail(line, "concat() needs a String variable."); return { c: e.lv.set("(" + s + "+" + (args[0].t === "String" || args[0].t === "cstr" ? args[0].c : "rt.numstr(" + args[0].c + ",\"" + args[0].t + "\")") + ")"), t: "int" };
      }
      fail(line, "A String does not have a method called " + name + "().");
    }

    function primary() {
      var t = next();
      if (t.t === "num") return { c: (t.type === "float" && !/[.eE]/.test(String(t.v)) ? String(t.v) : (t.v < 0 ? "(" + t.v + ")" : String(t.v))), t: t.type };
      if (t.t === "str") return { c: JSON.stringify(t.v), t: "cstr" };
      if (t.t === "op" && t.v === "(") { var e = expression(); expectOp(")"); return { c: "(" + e.c + ")", t: e.t, lv: undefined, arr: e.arr }; }
      if (t.t === "id") {
        var name = t.v;
        /* Serial.xxx(...) */
        if (name === "Serial") {
          if (!isOp(".")) fail(t.line, "Serial needs a dot and a command after it, like Serial.println(\"Hi\");");
          next(); var m = next(); if (m.t !== "id") fail(m.line, "I expected a command after Serial.");
          expectOp("("); var sargs = []; if (!isOp(")")) { do { sargs.push(expression()); } while (isOp(",") && next()); } expectOp(")");
          return serialCall(m.v, sargs, m.line);
        }
        /* function-style cast / constructor: int(x), float(x), String(x) */
        if ((name === "int" || name === "float" || name === "long" || name === "byte" || name === "char" || name === "double" || name === "String" || name === "bool" || name === "boolean") && isOp("(")) {
          next(); var a = expression(); expectOp(")");
          if (name === "String") {
            if (a.t === "String" || a.t === "cstr") return { c: a.c, t: "String" };
            if (isOp(",") ) { }
            return { c: a.t === "char" ? "String.fromCharCode(" + a.c + ")" : "rt.numstr(" + a.c + ",\"" + a.t + "\")", t: "String" };
          }
          var tt = name === "double" ? "float" : name === "boolean" ? "bool" : name;
          if (!isNum(a.t)) fail(t.line, "You can not turn this into a " + TYPE_NAME[tt] + ".");
          return { c: tt === "float" ? a.c : wrapCode(a.t === "float" ? "Math.trunc(" + a.c + ")" : a.c, tt), t: tt };
        }
        if (name === "F" && isOp("(")) { next(); var f = expression(); expectOp(")"); return f; }
        var v = lookup(name);
        if (v && !v.fn) {
          var base = jsName(name);
          if (v.isArray) return { c: base, t: v.type, arr: { dims: v.dims }, lv: { name: name, isConst: v.isConst, get: base, set: function () { fail(t.line, "You can not assign a whole array with =. Change one spot at a time, like " + name + "[0] = 5;"); } } };
          return { c: base, t: v.type, lv: { name: name, isConst: v.isConst, get: base, set: function (val) { return "(" + base + "=" + val + ")"; } } };
        }
        if (CONSTS[name]) { var cv = CONSTS[name]; return { c: String(cv[0]), t: cv[1] }; }
        if (isOp("(")) return callExpr(name, t);
        var sg = suggest(name, allNames().filter(function (x) { return !/^(true|false)$/.test(x); }));
        fail(t.line, "I do not know what '" + name + "' is." + (sg ? " Did you mean '" + sg + "'? (Capital letters matter.)" : " Did you forget to declare it, like int " + name + " = 0; ?"));
      }
      fail(t.line, t.t === "eof" ? "Your code ends in the middle of an instruction." : "I did not expect " + describe(t) + " here. Check the line above it for a missing ; or ) too.");
    }

    function serialCall(name, args, line) {
      function a(i) { return args[i]; }
      function kind(e) { return e.t === "float" ? "float" : e.t === "char" ? "char" : (e.t === "String" || e.t === "cstr") ? "str" : "int"; }
      switch (name) {
        case "begin": if (args.length < 1) fail(line, "Serial.begin needs a speed, like Serial.begin(9600);"); return { c: "rt.serialBegin(" + a(0).c + ")", t: "void" };
        case "print": case "println":
          if (args.length === 0) { if (name === "println") return { c: "rt.println(\"\",\"str\")", t: "void" }; fail(line, "Serial.print needs something to print."); }
          if (args.length > 2) fail(line, "Serial." + name + " takes the value, and optionally a format.");
          if (a(0).t === "void") fail(line, "That function does not give back a value, so there is nothing to print.");
          return { c: "rt." + name + "(" + a(0).c + ",\"" + kind(a(0)) + "\"" + (args[1] ? "," + args[1].c : "") + ")", t: "void" };
        case "write": return { c: "rt.serialWrite(" + (args[0] ? a(0).c : "0") + ")", t: "void" };
        case "available": return { c: "rt.serialAvailable()", t: "int" };
        case "read": return { c: "rt.serialRead()", t: "int" };
        case "parseInt": return { c: "rt.serialParseInt()", t: "long" };
        case "parseFloat": return { c: "rt.serialParseFloat()", t: "float" };
        case "readString": case "readStringUntil": return { c: "rt.serialReadString()", t: "String" };
        case "flush": case "setTimeout": case "end": return { c: "0", t: "void" };
      }
      fail(line, "Serial does not have a command called " + name + ". Try Serial.begin, Serial.print, Serial.println, Serial.available or Serial.read.");
    }

    function callExpr(name, tok) {
      var line = tok.line;
      expectOp("(");
      var args = []; if (!isOp(")")) { do { args.push(expression()); } while (isOp(",") && next()); }
      expectOp(")");
      var fn = funcs[name];
      if (fn) {
        if (args.length !== fn.params.length) fail(line, name + "() needs " + fn.params.length + " value" + (fn.params.length === 1 ? "" : "s") + " but you gave it " + args.length + ".");
        var codes = args.map(function (arg, i) {
          var pr = fn.params[i];
          if (pr.isArray) { if (!arg.arr) fail(line, "Value " + (i + 1) + " of " + name + "() must be an array."); return arg.c; }
          return coerceChecked(arg.c, arg.t, pr.type, line, "");
        });
        return { c: "(await " + jsName(name) + "(" + codes.join(",") + "))", t: fn.ret };
      }
      var b = BUILTINS[name];
      if (b) {
        if (args.length < b.min || args.length > b.max) {
          fail(line, name + "() needs " + (b.min === b.max ? b.min : b.min + " to " + b.max) + " value" + (b.max === 1 ? "" : "s") + (b.usage ? ", like " + b.usage : "") + ", but you gave it " + args.length + ".");
        }
        args.forEach(function (arg) { if (arg.t === "void") fail(line, "A void function can not be used as a value."); if (arg.t === "String" && !b.strOk) fail(line, name + "() needs numbers, not text."); });
        return b.gen(args, line);
      }
      var names = Object.keys(funcs).concat(Object.keys(BUILTINS)), sg = suggest(name, names);
      fail(line, "I do not know a function called " + name + "()." + (sg ? " Did you mean " + sg + "()? (Capital letters matter.)" : " Check the spelling, or make sure you wrote the function in your code."));
    }

    function buildBuiltins() {
      var B = {};
      function def(name, min, max, ret, emit, usage, strOk) { B[name] = { min: min, max: max, usage: usage, strOk: strOk, gen: function (args) { return { c: emit(args), t: typeof ret === "function" ? ret(args) : ret }; } }; }
      function cs(args) { return args.map(function (a) { return a.c; }).join(","); }
      def("pinMode", 2, 2, "void", function (a) { return "rt.pinMode(" + cs(a) + ")"; }, "pinMode(pin, OUTPUT)");
      def("digitalWrite", 2, 2, "void", function (a) { return "rt.digitalWrite(" + cs(a) + ")"; }, "digitalWrite(pin, HIGH)");
      def("digitalRead", 1, 1, "int", function (a) { return "rt.digitalRead(" + cs(a) + ")"; }, "digitalRead(pin)");
      def("analogRead", 1, 1, "int", function (a) { return "rt.analogRead(" + cs(a) + ")"; }, "analogRead(A0)");
      def("analogWrite", 2, 2, "void", function (a) { return "rt.analogWrite(" + cs(a) + ")"; }, "analogWrite(pin, 128)");
      def("analogReference", 1, 1, "void", function () { return "0"; });
      def("delay", 1, 1, "void", function (a) { return "(await rt.delay(" + cs(a) + "))"; }, "delay(1000)");
      def("delayMicroseconds", 1, 1, "void", function (a) { return "(await rt.delayUs(" + cs(a) + "))"; });
      def("millis", 0, 0, "ulong", function () { return "rt.millis()"; });
      def("micros", 0, 0, "ulong", function () { return "rt.micros()"; });
      def("tone", 2, 3, "void", function (a) { return "rt.tone(" + cs(a) + ")"; }, "tone(pin, 440)");
      def("noTone", 1, 1, "void", function (a) { return "rt.noTone(" + cs(a) + ")"; });
      def("random", 1, 2, "long", function (a) { return a.length === 1 ? "rt.random(0," + a[0].c + ")" : "rt.random(" + cs(a) + ")"; }, "random(1, 7)");
      def("randomSeed", 1, 1, "void", function (a) { return "rt.randomSeed(" + cs(a) + ")"; });
      def("map", 5, 5, function (a) { return a.some(function (x) { return x.t === "float"; }) ? "float" : "long"; }, function (a) { return "rt.map(" + cs(a) + ")"; }, "map(value, fromLow, fromHigh, toLow, toHigh)");
      def("constrain", 3, 3, function (a) { return binType(binType(a[0].t, a[1].t), a[2].t); }, function (a) { return "Math.min(Math.max(" + a[0].c + "," + a[1].c + ")," + a[2].c + ")"; }, "constrain(x, low, high)");
      def("min", 2, 2, function (a) { return binType(a[0].t, a[1].t); }, function (a) { return "Math.min(" + cs(a) + ")"; });
      def("max", 2, 2, function (a) { return binType(a[0].t, a[1].t); }, function (a) { return "Math.max(" + cs(a) + ")"; });
      def("abs", 1, 1, function (a) { return a[0].t === "float" ? "float" : binType(a[0].t, "int"); }, function (a) { return "Math.abs(" + a[0].c + ")"; });
      def("pow", 2, 2, "float", function (a) { return "Math.pow(" + cs(a) + ")"; });
      def("sqrt", 1, 1, "float", function (a) { return "Math.sqrt(" + cs(a) + ")"; });
      def("sq", 1, 1, function (a) { return a[0].t === "float" ? "float" : binType(a[0].t, "int"); }, function (a) { return "(" + a[0].c + "*" + a[0].c + ")"; });
      ["sin", "cos", "tan", "log", "exp", "floor", "ceil"].forEach(function (f) { def(f, 1, 1, "float", function (a) { return "Math." + f + "(" + cs(a) + ")"; }); });
      def("round", 1, 1, "long", function (a) { return "Math.round(" + cs(a) + ")"; });
      def("radians", 1, 1, "float", function (a) { return "(" + a[0].c + "*Math.PI/180)"; });
      def("degrees", 1, 1, "float", function (a) { return "(" + a[0].c + "*180/Math.PI)"; });
      def("lowByte", 1, 1, "byte", function (a) { return "((" + a[0].c + ")&255)"; });
      def("highByte", 1, 1, "byte", function (a) { return "(((" + a[0].c + ")>>8)&255)"; });
      def("bitRead", 2, 2, "int", function (a) { return "(((" + a[0].c + ")>>(" + a[1].c + "))&1)"; });
      def("isDigit", 1, 1, "int", function (a) { return "(/[0-9]/.test(String.fromCharCode(" + a[0].c + "))?1:0)"; });
      def("isAlpha", 1, 1, "int", function (a) { return "(/[A-Za-z]/.test(String.fromCharCode(" + a[0].c + "))?1:0)"; });
      def("attachInterrupt", 3, 3, "void", function () { return "rt.unsupported('attachInterrupt (interrupts)')"; });
      def("digitalPinToInterrupt", 1, 1, "int", function (a) { return a[0].c; });
      return B;
    }

    /* ---- statements. Each returns JS source (a string). */
    var loopDepth = 0, switchDepth = 0;
    function block() {
      var open = expectOp("{"); pushScope(); var s = "";
      while (!isOp("}")) { if (peek().t === "eof") fail(open.line, "This { is never closed. You are missing a closing brace } later in your code."); s += statement(); }
      next(); popScope(); return "{" + s + "}";
    }
    function bodyStatement() {
      /* the body of if/for/while: a block or a single statement */
      if (isOp("{")) return block();
      pushScope(); var s = statement(); popScope(); return "{" + s + "}";
    }
    function lineMark(line) { return "rt.L=" + line + ";"; }
    function condition(line, what) {
      expectOp("(", "Put the condition in parentheses after " + what + ".");
      var save = p;
      var c = expression();
      /* warn about = inside a condition */
      for (var q = save; q < p; q++) if (toks[q].t === "op" && toks[q].v === "=" ) { warnings.push({ line: toks[q].line, msg: "You used = (put a value in) inside a condition. To compare two values, use == (two equals signs)." }); break; }
      expectOp(")");
      if (c.t === "void") fail(line, "That function does not give back a value, so it can not be used as a condition.");
      return c.c;
    }
    function localDecl(typ, isConst, endWith) {
      /* after the type was parsed: name [dims] [= init] {, name ...} */
      var s = "";
      do {
        var nameTok = next();
        if (nameTok.t !== "id" || TYPE_WORDS[nameTok.v]) fail(nameTok.line, "I expected a variable name here" + (nameTok.t === "id" ? ", but '" + nameTok.v + "' is a reserved word." : "."));
        var name = nameTok.v, dims = 0, lens = [];
        while (isOp("[")) { next(); if (isOp("]")) { lens.push(null); } else { var le = expression(); lens.push(le); } expectOp("]"); dims++; }
        var info = { type: typ, isArray: dims > 0, dims: dims, isConst: isConst };
        var init = null;
        if (isOp("=")) {
          next();
          if (isOp("{")) {
            if (!dims) fail(nameTok.line, "Curly braces { } with values are for arrays, like int pins[] = {2, 3, 4};");
            init = arrayInit(typ, dims, nameTok.line);
          } else {
            var ex = expression();
            if (dims) {
              if (typ === "char" && ex.t === "cstr") { init = { text: ex.c }; }
              else fail(nameTok.line, "To fill an array, put the values in curly braces, like int pins[] = {2, 3, 4};");
            } else init = { c: coerceChecked(ex.c, ex.t, typ, nameTok.line, name) };
          }
        } else if (isConst && !dims) fail(nameTok.line, "A const variable needs a value, like const int ledPin = 13;");
        if (dims && typ === "char" && init && init.text) {
          /* char name[] = "text": treated like text */
          info.isArray = false; info.dims = 0; info.type = "cstr"; init = { c: init.text };
        }
        declare(name, info, nameTok.line);
        var js = jsName(name);
        if (info.isArray) {
          var dimCodes = lens.map(function (l) { return l ? l.c : null; });
          if (init && init.arr) { if (dimCodes[0] === null) dimCodes[0] = String(init.len); }
          if (dimCodes.some(function (d) { return d === null; })) fail(nameTok.line, "An array needs a size, like int pins[3]; or values, like int pins[] = {2, 3, 4};");
          var zero = isNum(typ) ? "0" : "\"\"";
          s += "let " + js + "=" + (init && init.arr ? init.arr : "rt.makeArray([" + dimCodes.join(",") + "]," + zero + ")") + ";";
        } else {
          var dflt = typ === "String" || typ === "cstr" ? "\"\"" : "0";
          s += "let " + js + "=" + (init ? init.c : dflt) + ";";
        }
      } while (isOp(",") && next());
      if (endWith !== false) expectOp(";");
      return s;
    }
    function arrayInit(typ, dims, line) {
      /* {1, 2, 3} or {{1,2},{3,4}} */
      function one(depth) {
        expectOp("{"); var items = [], count = 0;
        if (!isOp("}")) {
          do {
            if (isOp("}")) break;
            if (isOp("{")) { if (depth >= dims) fail(line, "Too many nested { } for this array."); items.push(one(depth + 1).code); }
            else { var e = expression(); items.push(coerceChecked(e.c, e.t, typ === "cstr" ? "cstr" : typ, line, "")); }
            count++;
          } while (isOp(",") && next());
        }
        expectOp("}");
        return { code: "[" + items.join(",") + "]", len: items.length };
      }
      var r = one(1); return { arr: r.code, len: r.len };
    }
    function statement() {
      var t = peek();
      if (t.t === "op") {
        if (t.v === "{") return block();
        if (t.v === ";") { next(); return ""; }
      }
      if (t.t === "id") {
        var k = t.v;
        if (UNSUPPORTED[k]) fail(t.line, UNSUPPORTED[k] + " are not part of this editor's Arduino code.");
        if (startsType() && !(isOp("(", 1) && k !== "const")) {
          var line0 = t.line, ty = parseType();
          if (!ty) fail(t.line, "I do not understand this declaration.");
          if (ty.type === "void") fail(line0, "A variable can not be void.");
          return lineMark(line0) + localDecl(ty.type, ty.isConst);
        }
        if (k === "if") {
          next(); var cnd = condition(t.line, "if"); var th = bodyStatement(); var s = lineMark(t.line) + "if(" + cnd + ")" + th;
          if (isId("else")) { next(); if (isId("if")) s += "else{" + statement() + "}"; else s += "else" + bodyStatement(); }
          return s;
        }
        if (k === "while") {
          next(); var wc = condition(t.line, "while"); loopDepth++; var wb = bodyStatement(); loopDepth--;
          return lineMark(t.line) + "while(" + wc + "){if((++rt.n&1023)===0)await rt.tick();" + wb + "}";
        }
        if (k === "do") {
          next(); loopDepth++; var db = bodyStatement(); loopDepth--;
          if (!isId("while")) fail(peek().line, "A do { ... } needs a while (condition); after it.");
          next(); var dc = condition(t.line, "while"); expectOp(";");
          return "do{if((++rt.n&1023)===0)await rt.tick();" + db + "}while(" + dc + ");";
        }
        if (k === "for") {
          next(); expectOp("("); pushScope(); var init = "";
          if (isOp(";")) next();
          else if (startsType()) { var ty2 = parseType(); init = localDecl(ty2.type, ty2.isConst, true); }
          else { init = exprStmt(); }
          var cnd2 = "true"; if (!isOp(";")) { var ce = expression(); cnd2 = ce.c; } expectOp(";");
          var step = ""; if (!isOp(")")) { var se = expression(); step = se.post && se.simple ? se.simple : se.c; } expectOp(")");
          loopDepth++; var fb = bodyStatement(); loopDepth--; popScope();
          return lineMark(t.line) + "{" + init.replace(/^rt\.L=\d+;/, "") + "for(;" + cnd2 + ";" + step + "){if((++rt.n&1023)===0)await rt.tick();" + fb + "}}";
        }
        if (k === "switch") {
          next(); expectOp("("); var sv = expression(); expectOp(")"); expectOp("{"); pushScope(); switchDepth++;
          var body = "", sw = tmp();
          while (!isOp("}")) {
            if (peek().t === "eof") fail(t.line, "This switch { is never closed.");
            if (isId("case")) { var ct = next(); var ce2 = ternary(); expectOp(":"); body += "case " + ce2.c + ":"; }
            else if (isId("default")) { next(); expectOp(":"); body += "default:"; }
            else body += statement();
          }
          next(); popScope(); switchDepth--;
          return lineMark(t.line) + "switch(" + sv.c + "){" + body + "}";
        }
        if (k === "break") { next(); expectOp(";"); if (!loopDepth && !switchDepth) fail(t.line, "break can only be used inside a loop or a switch."); return "break;"; }
        if (k === "continue") { next(); expectOp(";"); if (!loopDepth) fail(t.line, "continue can only be used inside a loop."); return "continue;"; }
        if (k === "return") {
          next(); var rv = "";
          if (!isOp(";")) {
            if (curFn.ret === "void") fail(t.line, "This function is void, so it can not give back a value with return.");
            var re = expression(); rv = coerceChecked(re.c, re.t, curFn.ret, t.line, "");
          } else if (curFn.ret !== "void") fail(t.line, "This function must give back a " + TYPE_NAME[curFn.ret] + " value with return.");
          expectOp(";"); return lineMark(t.line) + "return " + rv + ";";
        }
      }
      return lineMark(t.line) + exprStmt();
    }
    function exprStmt() {
      var t = peek(); var e = expression();
      if (!(e.c.indexOf("(") > -1 || e.c.indexOf("=") > -1)) { /* something like  x;  does nothing */ }
      expectOp(";");
      var code = e.post && e.simple ? e.simple : e.c;
      return code + ";";
    }

    /* ---- top level */
    function topLevel() {
      while (peek().t !== "eof") {
        var t = peek();
        if (t.t === "op" && t.v === ";") { next(); continue; }
        if (t.t === "id" && UNSUPPORTED[t.v]) fail(t.line, UNSUPPORTED[t.v] + " are not part of this editor's Arduino code.");
        if (!startsType()) fail(t.line, "I did not expect " + describe(t) + " here. Outside of functions you can only declare variables and write functions, like void setup() { ... }");
        var ty = parseType(); if (!ty) fail(t.line, "I do not understand this.");
        var nameTok = peek(1);
        if (peek().t === "id" && isOp("(", 1)) { functionDef(ty, t.line); continue; }
        /* global variable(s) */
        if (pass === 1) { var depth = 0; while (peek().t !== "eof") { var q = next(); if (q.t === "op") { if (q.v === "{") depth++; else if (q.v === "}") depth--; else if (q.v === ";" && depth <= 0) break; } } continue; }
        curFn = { temps: [], ret: "void", name: "(global)" };
        localDeclGlobal(ty); curFn = null;
      }
    }
    function localDeclGlobal(ty) {
      /* reuse localDecl but split declaration and initialisation so global initialisers run in init() */
      var code = localDecl(ty.type, ty.isConst);
      var m = code.split(/;(?=let )/); /* each declaration */
      code.replace(/let (\$\w+)=([\s\S]*?);(?=let |$)/g, function (_, nm, val) { gdecl.push("let " + nm + ";"); ginit.push(nm + "=" + val + ";"); return ""; });
      return code;
    }
    function functionDef(ty, line) {
      var nameTok = next(), name = nameTok.v;
      if (pass === 1 && funcs[name]) fail(nameTok.line, "You already wrote a function called " + name + ". Each function needs its own name.");
      if (pass === 1 && (BUILTINS[name] || CONSTS[name])) fail(nameTok.line, name + " is already an Arduino name, so pick a different name for your function.");
      expectOp("(");
      var params = [];
      if (!isOp(")")) {
        if (isId("void") && isOp(")", 1)) next();
        else do {
          var pt = parseType(); if (!pt) fail(peek().line, "I expected the type of this value, like int or float.");
          var pn = next(); if (pn.t !== "id") fail(pn.line, "I expected a name for this value.");
          var isArr = false; while (isOp("[")) { next(); if (!isOp("]")) expression(); expectOp("]"); isArr = true; }
          params.push({ name: pn.v, type: pt.type, isArray: isArr });
        } while (isOp(",") && next());
      }
      expectOp(")");
      var fn;
      if (pass === 1) { fn = { ret: ty.type, params: params, fn: true, temps: [], name: name, type: ty.type }; funcs[name] = fn; globals[name] = Object.assign(globals[name] || {}, { fn: true }); }
      else fn = funcs[name];
      if (isOp(";")) { next(); return; }
      if (!isOp("{")) fail(peek().line, "I expected { after the function's ( ) to start the code of " + name + ".");
      if (pass === 1) { var dep = 0; do { var q = next(); if (q.t === "eof") fail(nameTok.line, "The { of " + name + "() is never closed. You are missing a closing brace }."); if (q.t === "op" && q.v === "{") dep++; else if (q.t === "op" && q.v === "}") dep--; } while (dep > 0); return; }
      curFn = fn; tmpCount = 0; fn.temps = []; pushScope();
      params.forEach(function (pr) { declare(pr.name, { type: pr.type, isArray: pr.isArray, dims: pr.isArray ? 1 : 0 }, line); });
      var body = block(); popScope();
      var js = "async function " + jsName(name) + "(" + params.map(function (pr) { return jsName(pr.name); }).join(",") + "){" + (fn.temps.length ? "let " + fn.temps.join(",") + ";" : "") + "rt.n++;" + body.slice(1, -1) + "}";
      out.push(js); curFn = null;
    }

    try {
      topLevel(); pass = 2; p = 0; tmpCount = 0; scopes = [];
      Object.keys(globals).forEach(function (k) { if (!(globals[k] && globals[k].fn)) delete globals[k]; });
      topLevel();
    } catch (e) {
      if (e instanceof CompileError) return { ok: false, errors: [{ line: e.line, msg: e.msg }], warnings: warnings };
      return { ok: false, errors: [{ line: 1, msg: "Something in your code confused the editor (" + (e && e.message) + "). Check for a missing ; ) or }." }], warnings: warnings };
    }
    if (!funcs.setup) return { ok: false, errors: [{ line: 1, msg: "Your sketch needs a function called void setup() { }. It runs once when the program starts." }], warnings: warnings };
    if (!funcs.loop) return { ok: false, errors: [{ line: 1, msg: "Your sketch needs a function called void loop() { }. It runs over and over again." }], warnings: warnings };
    if (funcs.setup.params.length || funcs.loop.params.length) return { ok: false, errors: [{ line: 1, msg: "setup() and loop() do not take any values. Leave the ( ) empty." }], warnings: warnings };
    var js = "\"use strict\";\n" + gdecl.join("") + "\n" + out.join("\n") + "\nfunction $init(){" + ginit.join("") + "}\nreturn {init:$init,setup:$setup,loop:$loop};";
    var factory;
    try { factory = new Function("rt", js); } catch (e2) { return { ok: false, errors: [{ line: 1, msg: "The editor could not build your program: " + e2.message }], warnings: warnings }; }
    return { ok: true, errors: [], warnings: warnings, js: js, make: function (rt) { return factory(rt); } };
  }

  root.ArduinoCompiler = { compile: compile, tokenize: tokenize };
  if (typeof module !== "undefined" && module.exports) module.exports = root.ArduinoCompiler;
})(typeof window !== "undefined" ? window : globalThis);
