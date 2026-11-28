/* KAREL ENGINE for the IST Unit 2 labs.  One file used by the browser (animation) and by the server (scoring): plain script, no eval, no DOM.
   It runs the CodeHS-style JavaScript Karel the notes teach:   function main() { move(); turnLeft(); putBall(); }
   Language: function declarations (no parameters), calls, if / else if / else, while, for (var i = 0; i < n; i++), var/let/const numbers, ++, --, +=, -=,
   comparisons, && || !, numbers, and // and block comments.
   Commands: move, turnLeft, putBall, takeBall (+ turnRight, turnAround when options.superKarel is on, or when the program defines them itself).
   Conditions: frontIsClear, frontIsBlocked, leftIsClear, leftIsBlocked, rightIsClear, rightIsBlocked, ballsPresent, noBallsPresent,
               facingNorth, facingSouth, facingEast, facingWest, notFacingNorth, notFacingSouth, notFacingEast, notFacingWest.
   World: { cols, rows, x, y, dir ("N","E","S","W"), balls: [[x,y,n],...], walls: [[x,y,"E"|"N"],...] }   x = avenue (1..cols, left to right), y = street (1..rows, bottom to top).
   KarelEngine.run(source, world, options) -> { ok, error: {line, message} | null, steps, commands, final: { x, y, dir, balls: {"x,y": n} }, events: [...] , calls: {name: count}, defined: [...], used: {for, while, if, else} } */
(function (root) {
  "use strict";
  var DIRS = ["N", "E", "S", "W"], DX = { N: 0, E: 1, S: 0, W: -1 }, DY = { N: 1, E: 0, S: -1, W: 0 };
  var COMMANDS = ["move", "turnLeft", "putBall", "takeBall"], SUPER = ["turnRight", "turnAround"];
  var PREDICATES = ["frontIsClear", "frontIsBlocked", "leftIsClear", "leftIsBlocked", "rightIsClear", "rightIsBlocked", "ballsPresent", "noBallsPresent", "facingNorth", "facingSouth", "facingEast", "facingWest", "notFacingNorth", "notFacingSouth", "notFacingEast", "notFacingWest"];
  var KEYWORDS = ["function", "if", "else", "while", "for", "var", "let", "const", "true", "false", "return", "break", "continue"];

  function KErr(line, message) { var e = new Error(message); e.karel = true; e.line = line; return e; }

  /* ---------------- tokenizer ---------------- */
  function tokenize(src) {
    var toks = [], i = 0, line = 1, n = src.length, c;
    while (i < n) {
      c = src[i];
      if (c === "\n") { line++; i++; continue; }
      if (c === " " || c === "\t" || c === "\r") { i++; continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "/" && src[i + 1] === "*") { var j = src.indexOf("*/", i + 2); if (j < 0) throw KErr(line, "A comment that starts with /* never ends with */"); for (var k = i; k < j; k++) if (src[k] === "\n") line++; i = j + 2; continue; }
      if (/[0-9]/.test(c)) { var m = /^[0-9]+/.exec(src.slice(i)); toks.push({ t: "num", v: parseInt(m[0], 10), line: line }); i += m[0].length; continue; }
      if (/[A-Za-z_$]/.test(c)) { var m2 = /^[A-Za-z0-9_$]+/.exec(src.slice(i)); toks.push({ t: KEYWORDS.indexOf(m2[0]) > -1 ? "kw" : "id", v: m2[0], line: line }); i += m2[0].length; continue; }
      var three = src.substr(i, 3), two = src.substr(i, 2);
      if (three === "===" || three === "!==") { toks.push({ t: "op", v: three, line: line }); i += 3; continue; }
      if (["==", "!=", "<=", ">=", "&&", "||", "++", "--", "+=", "-=", "*=", "/="].indexOf(two) > -1) { toks.push({ t: "op", v: two, line: line }); i += 2; continue; }
      if ("(){};,+-*/%<>=!".indexOf(c) > -1) { toks.push({ t: "op", v: c, line: line }); i++; continue; }
      if (c === '"' || c === "'" || c === "`") throw KErr(line, "Karel programs do not use quotation marks (strings). Remove the " + c);
      throw KErr(line, "Karel does not understand the character " + c);
    }
    toks.push({ t: "eof", v: "end of the program", line: line });
    return toks;
  }

  /* ---------------- parser ---------------- */
  function parse(src) {
    var toks = tokenize(src), p = 0, program = { funcs: {}, order: [], top: [] }, used = { for: 0, while: 0, if: 0, else: 0 };
    function peek() { return toks[p]; }
    function next() { return toks[p++]; }
    function isOp(v) { return peek().t === "op" && peek().v === v; }
    function expectOp(v, why) {
      var t = peek(); if (t.t === "op" && t.v === v) return next();
      var prev = p > 0 ? toks[p - 1] : t, ln = (v === ";" || v === "}" || v === ")") && p > 0 ? prev.line : t.line;
      throw KErr(ln, "Expected " + v + (why ? " " + why : "") + " but found " + (t.t === "eof" ? "the end of the program" : t.v));
    }
    function parseBlock() {
      expectOp("{", "to start the block"); var body = [];
      while (!isOp("}")) { if (peek().t === "eof") throw KErr(toks[p - 1].line, "A { was never closed: add a matching } at the end"); body.push(parseStatement()); }
      next(); return body;
    }
    function parseBlockOrStatement() { return isOp("{") ? parseBlock() : [parseStatement()]; }
    function parseExpr() { return parseOr(); }
    function parseOr() { var l = parseAnd(); while (isOp("||")) { next(); l = { k: "or", a: l, b: parseAnd() }; } return l; }
    function parseAnd() { var l = parseCmp(); while (isOp("&&")) { next(); l = { k: "and", a: l, b: parseCmp() }; } return l; }
    function parseCmp() {
      var l = parseAdd();
      while (peek().t === "op" && ["==", "!=", "===", "!==", "<", ">", "<=", ">="].indexOf(peek().v) > -1) { var op = next().v; l = { k: "cmp", op: op.replace("===", "==").replace("!==", "!="), a: l, b: parseAdd() }; }
      return l;
    }
    function parseAdd() { var l = parseMul(); while (isOp("+") || isOp("-")) { var op = next().v; l = { k: "bin", op: op, a: l, b: parseMul() }; } return l; }
    function parseMul() { var l = parseUnary(); while (isOp("*") || isOp("/") || isOp("%")) { var op = next().v; l = { k: "bin", op: op, a: l, b: parseUnary() }; } return l; }
    function parseUnary() { if (isOp("!")) { next(); return { k: "not", a: parseUnary() }; } if (isOp("-")) { next(); return { k: "neg", a: parseUnary() }; } return parsePrimary(); }
    function parsePrimary() {
      var t = peek();
      if (t.t === "num") { next(); return { k: "num", v: t.v }; }
      if (t.t === "kw" && (t.v === "true" || t.v === "false")) { next(); return { k: "bool", v: t.v === "true" }; }
      if (isOp("(")) { next(); var e = parseExpr(); expectOp(")", "to close the ("); return e; }
      if (t.t === "id") {
        next();
        if (isOp("(")) { next(); expectOp(")", "(commands in Karel take nothing between the parentheses)"); return { k: "call", name: t.v, line: t.line }; }
        return { k: "var", name: t.v, line: t.line };
      }
      throw KErr(t.line, "Expected a condition or a number but found " + (t.t === "eof" ? "the end of the program" : t.v));
    }
    function parseSimpleStatement(needSemi) {
      var t = peek();
      if (t.t === "kw" && (t.v === "var" || t.v === "let" || t.v === "const")) {
        next(); var id = next(); if (id.t !== "id") throw KErr(id.line, "Expected a name after " + t.v);
        var init = null; if (isOp("=")) { next(); init = parseExpr(); }
        if (needSemi) expectOp(";", "at the end of the line"); return { k: "decl", name: id.v, init: init, line: t.line };
      }
      if (t.t === "id") {
        var nx = toks[p + 1];
        if (nx.t === "op" && (nx.v === "++" || nx.v === "--")) { next(); next(); if (needSemi) expectOp(";", "at the end of the line"); return { k: "assign", name: t.v, op: nx.v === "++" ? "+=" : "-=", expr: { k: "num", v: 1 }, line: t.line }; }
        if (nx.t === "op" && ["=", "+=", "-=", "*=", "/="].indexOf(nx.v) > -1) { next(); next(); var ex = parseExpr(); if (needSemi) expectOp(";", "at the end of the line"); return { k: "assign", name: t.v, op: nx.v, expr: ex, line: t.line }; }
        if (nx.t === "op" && nx.v === "(") {
          next(); next();
          if (!isOp(")")) throw KErr(t.line, t.v + "() takes nothing between the parentheses");
          next(); if (needSemi) { if (!isOp(";")) throw KErr(t.line, "Missing a ; at the end of " + t.v + "();"); next(); }
          return { k: "callst", name: t.v, line: t.line };
        }
        throw KErr(t.line, "Karel does not understand " + t.v + ". A command needs () after it, like " + t.v + "();");
      }
      throw KErr(t.line, "Expected a command but found " + (t.t === "eof" ? "the end of the program" : t.v));
    }
    function parseStatement() {
      var t = peek();
      if (t.t === "kw" && t.v === "function") throw KErr(t.line, "A function can only be defined at the top level, not inside another function or block");
      if (t.t === "kw" && t.v === "if") {
        next(); used.if++; expectOp("(", "after if"); var cond = parseExpr(); expectOp(")", "after the condition");
        var then = parseBlockOrStatement(), els = null;
        if (peek().t === "kw" && peek().v === "else") { next(); used.else++; if (peek().t === "kw" && peek().v === "if") els = [parseStatement()]; else els = parseBlockOrStatement(); }
        return { k: "if", cond: cond, then: then, els: els, line: t.line };
      }
      if (t.t === "kw" && t.v === "while") { next(); used.while++; expectOp("(", "after while"); var c = parseExpr(); expectOp(")", "after the condition"); return { k: "while", cond: c, body: parseBlockOrStatement(), line: t.line }; }
      if (t.t === "kw" && t.v === "for") {
        next(); used.for++; expectOp("(", "after for");
        var init = isOp(";") ? null : parseSimpleStatement(false); expectOp(";", "after the start of the for loop");
        var cond2 = isOp(";") ? { k: "bool", v: true } : parseExpr(); expectOp(";", "after the for loop condition");
        var step = isOp(")") ? null : parseSimpleStatement(false); expectOp(")", "to close the for loop");
        return { k: "for", init: init, cond: cond2, step: step, body: parseBlockOrStatement(), line: t.line };
      }
      if (t.t === "kw" && (t.v === "return" || t.v === "break" || t.v === "continue")) throw KErr(t.line, t.v + " is not used in these Karel programs");
      if (isOp("{")) throw KErr(t.line, "A { that does not belong to a function, if or loop");
      if (isOp("}")) throw KErr(t.line, "A } with no { to match");
      return parseSimpleStatement(true);
    }
    while (peek().t !== "eof") {
      var t = peek();
      if (t.t === "kw" && t.v === "function") {
        next(); var nm = next(); if (nm.t !== "id") throw KErr(nm.line, "Expected a function name after the word function");
        expectOp("(", "after the function name"); if (!isOp(")")) throw KErr(nm.line, "Functions in these Karel programs take nothing between the parentheses"); next();
        var body = parseBlock();
        if (program.funcs[nm.v]) throw KErr(nm.line, "The function " + nm.v + " is defined twice");
        program.funcs[nm.v] = { name: nm.v, body: body, line: nm.line }; program.order.push(nm.v);
      } else if (isOp("}")) throw KErr(t.line, "A } with no { to match");
      else program.top.push(parseStatement());
    }
    program.used = used; return program;
  }

  /* ---------------- world ---------------- */
  function cloneWorld(w) {
    var balls = {}; (w.balls || []).forEach(function (b) { balls[b[0] + "," + b[1]] = (balls[b[0] + "," + b[1]] || 0) + b[2]; });
    var walls = {}; (w.walls || []).forEach(function (x) { walls[x[0] + "," + x[1] + "," + x[2]] = true; });
    return { cols: w.cols, rows: w.rows, x: w.x, y: w.y, dir: w.dir, balls: balls, walls: walls, bag: w.bag == null ? Infinity : w.bag };
  }
  function blocked(W, x, y, d) {
    var nx = x + DX[d], ny = y + DY[d];
    if (nx < 1 || ny < 1 || nx > W.cols || ny > W.rows) return true;
    if (d === "E") return !!W.walls[x + "," + y + ",E"];
    if (d === "W") return !!W.walls[(x - 1) + "," + y + ",E"];
    if (d === "N") return !!W.walls[x + "," + y + ",N"];
    return !!W.walls[x + "," + (y - 1) + ",N"];
  }
  var LEFT = { N: "W", W: "S", S: "E", E: "N" }, RIGHT = { N: "E", E: "S", S: "W", W: "N" }, BACK = { N: "S", S: "N", E: "W", W: "E" };

  /* ---------------- interpreter ---------------- */
  function run(source, world, options) {
    options = options || {};
    var maxCommands = options.maxCommands || 5000, maxSteps = options.maxSteps || 200000, W = cloneWorld(world), events = [], calls = {}, commands = 0, steps = 0, vars = [{}];
    var out = { ok: false, error: null, steps: 0, commands: 0, final: null, events: events, calls: calls, defined: [], used: { for: 0, while: 0, if: 0, else: 0 } };
    var prog;
    try { prog = parse(String(source || "")); } catch (e) { if (e.karel) { out.error = { line: e.line, message: e.message }; out.final = snapshot(W); return out; } throw e; }
    out.defined = prog.order.slice(); out.used = prog.used;
    function snapshot(w) { return { x: w.x, y: w.y, dir: w.dir, balls: JSON.parse(JSON.stringify(w.balls)) }; }
    function tick(line) { if (++steps > maxSteps) throw KErr(line, "The program ran for too long. Check that every loop can end (an endless loop never stops)."); }
    function ev(type, line) { events.push({ type: type, x: W.x, y: W.y, dir: W.dir, line: line, balls: W.balls[W.x + "," + W.y] || 0 }); }
    function builtin(name, line) {
      if (COMMANDS.indexOf(name) > -1 || ((options.superKarel) && SUPER.indexOf(name) > -1)) {
        if (++commands > maxCommands) throw KErr(line, "Karel did too many things. Check that every loop can end.");
        calls[name] = (calls[name] || 0) + 1;
        if (name === "move") { if (blocked(W, W.x, W.y, W.dir)) throw KErr(line, "Karel ran into a wall and cannot move forward"); W.x += DX[W.dir]; W.y += DY[W.dir]; ev("move", line); }
        else if (name === "turnLeft") { W.dir = LEFT[W.dir]; ev("turn", line); }
        else if (name === "turnRight") { W.dir = RIGHT[W.dir]; ev("turn", line); }
        else if (name === "turnAround") { W.dir = BACK[W.dir]; ev("turn", line); }
        else if (name === "putBall") { if (W.bag <= 0) throw KErr(line, "Karel has no balls in the bag to put down"); var k = W.x + "," + W.y; W.balls[k] = (W.balls[k] || 0) + 1; if (W.bag !== Infinity) W.bag--; ev("put", line); }
        else if (name === "takeBall") { var k2 = W.x + "," + W.y; if (!W.balls[k2]) throw KErr(line, "There is no ball here for Karel to take"); W.balls[k2]--; if (!W.balls[k2]) delete W.balls[k2]; if (W.bag !== Infinity) W.bag++; ev("take", line); }
        return true;
      }
      return false;
    }
    function pred(name, line) {
      switch (name) {
        case "frontIsClear": return !blocked(W, W.x, W.y, W.dir);
        case "frontIsBlocked": return blocked(W, W.x, W.y, W.dir);
        case "leftIsClear": return !blocked(W, W.x, W.y, LEFT[W.dir]);
        case "leftIsBlocked": return blocked(W, W.x, W.y, LEFT[W.dir]);
        case "rightIsClear": return !blocked(W, W.x, W.y, RIGHT[W.dir]);
        case "rightIsBlocked": return blocked(W, W.x, W.y, RIGHT[W.dir]);
        case "ballsPresent": return !!W.balls[W.x + "," + W.y];
        case "noBallsPresent": return !W.balls[W.x + "," + W.y];
        case "facingNorth": return W.dir === "N"; case "facingSouth": return W.dir === "S"; case "facingEast": return W.dir === "E"; case "facingWest": return W.dir === "W";
        case "notFacingNorth": return W.dir !== "N"; case "notFacingSouth": return W.dir !== "S"; case "notFacingEast": return W.dir !== "E"; case "notFacingWest": return W.dir !== "W";
      }
      throw KErr(line, name + "() is not a condition Karel knows");
    }
    function lookup(name, line) { for (var i = vars.length - 1; i >= 0; i--) if (Object.prototype.hasOwnProperty.call(vars[i], name)) return vars[i]; throw KErr(line, "The name " + name + " has not been created yet"); }
    function ev2(e) {
      tick(e.line || 0);
      switch (e.k) {
        case "num": return e.v; case "bool": return e.v;
        case "var": return lookup(e.name, e.line)[e.name];
        case "call": if (PREDICATES.indexOf(e.name) > -1) return pred(e.name, e.line); throw KErr(e.line, e.name + "() is a command, not a condition. Conditions look like frontIsClear()");
        case "not": return !ev2(e.a);
        case "neg": return -ev2(e.a);
        case "and": return ev2(e.a) && ev2(e.b);
        case "or": return ev2(e.a) || ev2(e.b);
        case "bin": { var a = ev2(e.a), b = ev2(e.b); if (e.op === "+") return a + b; if (e.op === "-") return a - b; if (e.op === "*") return a * b; if (e.op === "/") return b === 0 ? 0 : Math.trunc(a / b); return b === 0 ? 0 : a % b; }
        case "cmp": { var x = ev2(e.a), y = ev2(e.b); switch (e.op) { case "==": return x === y; case "!=": return x !== y; case "<": return x < y; case ">": return x > y; case "<=": return x <= y; default: return x >= y; } }
      }
      throw KErr(0, "Karel could not work out that expression");
    }
    function execList(list, depth) { for (var i = 0; i < list.length; i++) exec(list[i], depth); }
    function callFunc(name, line, depth) {
      if (depth > 400) throw KErr(line, "A function keeps calling itself without stopping");
      var f = prog.funcs[name];
      if (f) { calls[name] = (calls[name] || 0) + 1; vars.push({}); execList(f.body, depth + 1); vars.pop(); return; }
      if (builtin(name, line)) return;
      if (name === "turnRight" || name === "turnAround") throw KErr(line, name + "() is not built in here. Define it yourself with function " + name + "() { ... }");
      throw KErr(line, "Karel does not know the command " + name + "(). Check the spelling, or define it with function " + name + "() { ... }");
    }
    function exec(s, depth) {
      tick(s.line);
      switch (s.k) {
        case "callst": callFunc(s.name, s.line, depth); return;
        case "decl": vars[vars.length - 1][s.name] = s.init ? ev2(s.init) : 0; return;
        case "assign": { var sc = lookup(s.name, s.line), v = ev2(s.expr); if (s.op === "=") sc[s.name] = v; else if (s.op === "+=") sc[s.name] += v; else if (s.op === "-=") sc[s.name] -= v; else if (s.op === "*=") sc[s.name] *= v; else sc[s.name] = v === 0 ? 0 : Math.trunc(sc[s.name] / v); return; }
        case "if": if (ev2(s.cond)) execList(s.then, depth); else if (s.els) execList(s.els, depth); return;
        case "while": while (ev2(s.cond)) { tick(s.line); execList(s.body, depth); } return;
        case "for": vars.push({}); if (s.init) exec(s.init, depth); while (ev2(s.cond)) { execList(s.body, depth); if (s.step) exec(s.step, depth); } vars.pop(); return;
      }
      throw KErr(s.line || 0, "Karel could not run that line");
    }
    try {
      if (prog.funcs.main) {
        if (prog.top.length && !options.allowLoose) throw KErr(prog.top[0].line, "This command is outside every function. Put it inside main() or inside a function that main() calls");
        callFunc("main", prog.funcs.main.line, 0);
      } else {
        if (options.requireMain) throw KErr(1, "Every program needs a function main() { ... } where Karel starts");
        if (!prog.top.length) throw KErr(1, "There are no commands to run yet");
        execList(prog.top, 0);
      }
      out.ok = true;
    } catch (e) { if (e.karel) out.error = { line: e.line, message: e.message }; else throw e; }
    out.steps = steps; out.commands = commands; out.final = snapshot(W); return out;
  }

  /* ---------------- helpers for the labs ---------------- */
  function sameBalls(a, b) { var ka = Object.keys(a).sort(), kb = Object.keys(b).sort(); if (ka.length !== kb.length) return false; for (var i = 0; i < ka.length; i++) if (ka[i] !== kb[i] || a[ka[i]] !== b[kb[i]]) return false; return true; }
  function describeBalls(b) { var k = Object.keys(b).sort(); return k.length ? k.map(function (x) { return b[x] + " at (" + x + ")"; }).join(", ") : "none"; }
  /* compare a student's run with the reference run. parts: any of "pos", "dir", "balls" */
  function compare(student, ref, parts) {
    parts = parts || ["pos", "dir", "balls"];
    if (student.error) return { ok: false, why: "Line " + student.error.line + ": " + student.error.message };
    var f = student.final, r = ref.final;
    if (parts.indexOf("pos") > -1 && (f.x !== r.x || f.y !== r.y)) return { ok: false, why: "Karel finished at avenue " + f.x + ", street " + f.y + ", but the goal is avenue " + r.x + ", street " + r.y };
    if (parts.indexOf("dir") > -1 && f.dir !== r.dir) return { ok: false, why: "Karel finished facing " + ({ N: "North", E: "East", S: "South", W: "West" })[f.dir] + ", but the goal is facing " + ({ N: "North", E: "East", S: "South", W: "West" })[r.dir] };
    if (parts.indexOf("balls") > -1 && !sameBalls(f.balls, r.balls)) return { ok: false, why: "The balls on the world are wrong: yours has " + describeBalls(f.balls) + ", the goal has " + describeBalls(r.balls) };
    return { ok: true };
  }
  /* what the code uses, read from the text (comments removed): used for rules like "must use a for loop" */
  function stripComments(src) { return String(src || "").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, ""); }

  root.KarelEngine = { run: run, parse: parse, compare: compare, stripComments: stripComments, cloneWorld: cloneWorld, blocked: blocked, DIRS: DIRS, COMMANDS: COMMANDS, PREDICATES: PREDICATES };
})(typeof window !== "undefined" ? window : globalThis);
