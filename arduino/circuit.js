/* Circuit model and solver for the SCHS Arduino editor.
   - PARTS describes every part: where its legs/holes are, and how it behaves electrically.
   - analyze() works out which holes and pins are wired together (nets), then solves the voltages
     (a small nodal analysis with resistors, LEDs as diodes, buttons as switches) so the editor can
     light the LEDs, answer digitalRead/analogRead, and warn about the classic mistakes. */
(function (root) {
  "use strict";
  var P = 12;                                   /* hole pitch in pixels */
  var ROWS_U = ["a", "b", "c", "d", "e"], ROWS_L = ["f", "g", "h", "i", "j"];
  var LED_VF = { red: 1.9, yellow: 2.1, green: 2.2, orange: 2.0, blue: 3.0, white: 3.1 };
  var RESISTOR_VALUES = [100, 220, 330, 470, 1000, 2200, 4700, 10000, 47000, 100000, 1000000];

  /* ------------------------------------------------------------------ geometry of each part (local coordinates) */
  function breadboardInfo(size) {
    var cols = size === "mini" ? 17 : 30, rails = size === "mini" ? 10 : 25;
    var x0 = 30, yRail1 = 12, yRail2 = 24, yTop = 54;               /* rows a..e start at yTop, 12 apart */
    var yLow = yTop + 4 * P + 3 * P;                              /* row f is 3 pitches below row e (the center gap) */
    var yBot1 = yLow + 4 * P + 2 * P + 6, yBot2 = yBot1 + P;
    return { cols: cols, rails: rails, x0: x0, yRail1: yRail1, yRail2: yRail2, yTop: yTop, yLow: yLow, yBot1: yBot1, yBot2: yBot2,
      w: x0 * 2 + (cols - 1) * P, h: yBot2 + 14 };
  }
  function railX(info, k) { return info.x0 + k * P + Math.floor(k / 5) * (P / 2); }
  function breadboardTerms(size) {
    var b = breadboardInfo(size), t = [], c, r, k;
    for (c = 1; c <= b.cols; c++) {
      ROWS_U.forEach(function (row, i) { t.push({ id: "c" + c + row, x: b.x0 + (c - 1) * P, y: b.yTop + i * P, strip: "col" + c + "u" }); });
      ROWS_L.forEach(function (row, i) { t.push({ id: "c" + c + row, x: b.x0 + (c - 1) * P, y: b.yLow + i * P, strip: "col" + c + "l" }); });
    }
    for (k = 0; k < b.rails; k++) {
      t.push({ id: "tp" + k, x: railX(b, k), y: b.yRail1, strip: "railTP" });
      t.push({ id: "tn" + k, x: railX(b, k), y: b.yRail2, strip: "railTN" });
      t.push({ id: "bp" + k, x: railX(b, k), y: b.yBot1, strip: "railBP" });
      t.push({ id: "bn" + k, x: railX(b, k), y: b.yBot2, strip: "railBN" });
    }
    return t;
  }
  /* the Uno: USB at the left, digital header on top, power and analog header on the bottom */
  var UNO_W = 300, UNO_H = 190;
  function unoTerms() {
    var t = [], top = ["SCL", "SDA", "AREF", "GND_t", "13", "12", "11", "10", "9", "8", null, "7", "6", "5", "4", "3", "2", "1", "0"], x = 52, i;
    top.forEach(function (n) { if (n === null) { x += P; return; } t.push({ id: /^\d+$/.test(n) ? "D" + n : n, x: x, y: 14 }); x += P; });
    var bot = ["NC", "IOREF", "RESET", "3V3", "5V", "GND_b1", "GND_b2", "VIN", null, "A0", "A1", "A2", "A3", "A4", "A5"]; x = 112;
    bot.forEach(function (n) { if (n === null) { x += P; return; } t.push({ id: n, x: x, y: UNO_H - 14 }); x += P; });
    return t;
  }
  function pinNumber(id) { if (/^D\d+$/.test(id)) return +id.slice(1); if (/^A[0-5]$/.test(id)) return 14 + (+id.slice(1)); return null; }
  function pinLabel(n) { return n < 14 ? "D" + n : "A" + (n - 14); }

  var PARTS = {
    uno: { label: "Arduino Uno", w: UNO_W, h: UNO_H, terms: function () { return unoTerms(); }, board: true },
    breadboard: { label: "Breadboard", terms: function (p) { return breadboardTerms(p.props && p.props.size); }, board: true,
      dims: function (p) { var b = breadboardInfo(p.props && p.props.size); return { w: b.w, h: b.h }; } },
    led: { label: "LED", w: 24, h: 40, terms: function () { return [{ id: "A", x: 0, y: 0, name: "anode (+, long leg)" }, { id: "K", x: P, y: 0, name: "cathode (-, short leg)" }]; } },
    resistor: { label: "Resistor", w: 4 * P, h: 14, terms: function () { return [{ id: "1", x: 0, y: 0 }, { id: "2", x: 4 * P, y: 0 }]; } },
    button: { label: "Pushbutton", w: 2 * P, h: 3 * P, terms: function () { return [{ id: "TL", x: 0, y: 0 }, { id: "TR", x: 2 * P, y: 0 }, { id: "BL", x: 0, y: 3 * P }, { id: "BR", x: 2 * P, y: 3 * P }]; } },
    buzzer: { label: "Piezo buzzer", w: 2 * P, h: 30, terms: function () { return [{ id: "P", x: 0, y: 0, name: "+" }, { id: "N", x: 2 * P, y: 0, name: "-" }]; } }
  };
  function rot(x, y, r) { switch (((r % 4) + 4) % 4) { case 1: return [-y, x]; case 2: return [-x, -y]; case 3: return [y, -x]; default: return [x, y]; } }
  /* world position of every terminal of a part */
  function worldTerms(part) {
    var def = PARTS[part.type]; if (!def) return [];
    return def.terms(part).map(function (t) { var r = rot(t.x, t.y, part.rot || 0); return { key: part.id + ":" + t.id, id: t.id, part: part.id, x: part.x + r[0], y: part.y + r[1], strip: t.strip, name: t.name }; });
  }
  function allTerms(project) { var out = []; project.parts.forEach(function (p) { worldTerms(p).forEach(function (t) { out.push(t); }); }); return out; }
  /* where is the nearest board terminal (hole or Arduino pin) to a point? */
  function nearestBoardTerm(project, x, y, maxD, skipPart) {
    var best = null, bd = maxD * maxD;
    project.parts.forEach(function (p) {
      if (!PARTS[p.type].board || p.id === skipPart) return;
      worldTerms(p).forEach(function (t) { var d = (t.x - x) * (t.x - x) + (t.y - y) * (t.y - y); if (d <= bd) { bd = d; best = t; } });
    });
    return best;
  }

  /* ------------------------------------------------------------------ nets */
  function UF() { var par = {}; function f(a) { if (par[a] === undefined) par[a] = a; while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; } return { find: f, union: function (a, b) { a = f(a); b = f(b); if (a !== b) par[a] = b; } }; }

  function ohmsText(o) { return o >= 1e6 ? (o / 1e6) + "M" : o >= 1000 ? (o / 1000) + "k" : String(o); }

  /* prepare(project): works out the wiring (which holes and pins are joined). It is the slow part, so the result is remembered until the circuit changes. */
  var prepCache = { key: null, prep: null };
  function prepare(project, fixed) {
    if (fixed && prepCache.proj === project) return prepCache.prep;                 /* a test run never changes its circuit, so it is the same object every time */
    var key = JSON.stringify([project.parts, project.wires]);
    if (prepCache.key === key) { if (fixed) prepCache.proj = project; return prepCache.prep; }
    var uf = UF(), terms = allTerms(project), byKey = {}, legs = {};
    terms.forEach(function (t) { byKey[t.key] = t; uf.find(t.key); });
    /* breadboard strips and the Arduino's GND pins */
    var stripFirst = {};
    terms.forEach(function (t) { if (t.strip) { var k = t.part + "|" + t.strip; if (stripFirst[k]) uf.union(stripFirst[k], t.key); else stripFirst[k] = t.key; } });
    var gnds = terms.filter(function (t) { return /^GND/.test(t.id) && project.parts.some(function (p) { return p.id === t.part && p.type === "uno"; }); });
    for (var gi = 1; gi < gnds.length; gi++) uf.union(gnds[0].key, gnds[gi].key);
    /* wires */
    project.wires.forEach(function (w) { var a = w.a && w.a.term, b = w.b && w.b.term; if (a && b && byKey[a] && byKey[b]) uf.union(a, b); });
    /* part legs plugged into a board hole or Arduino pin */
    project.parts.forEach(function (p) {
      if (PARTS[p.type].board) return;
      worldTerms(p).forEach(function (t) { var h = nearestBoardTerm(project, t.x, t.y, 4, p.id); legs[t.key] = !!h; if (h) uf.union(t.key, h.key); });
    });
    /* buttons: the two legs on the same side are always joined */
    project.parts.forEach(function (p) { if (p.type !== "button") return; uf.union(p.id + ":TL", p.id + ":TR"); uf.union(p.id + ":BL", p.id + ":BR"); });
    var netIdx = {}, nets = 0, keyNet = {};
    terms.forEach(function (t) { var r = uf.find(t.key); if (netIdx[r] === undefined) netIdx[r] = nets++; keyNet[t.key] = netIdx[r]; });
    var net = function (k) { return keyNet[k] === undefined ? -1 : keyNet[k]; };
    var uno = project.parts.filter(function (p) { return p.type === "uno"; })[0], unoNet = function (id) { return uno ? net(uno.id + ":" + id) : -1; };
    var elems = [];
    project.parts.forEach(function (p) {
      var n = function (id) { return net(p.id + ":" + id); };
      if (p.type === "resistor") elems.push({ type: "R", a: n("1"), b: n("2"), r: Math.max(1, +(p.props && p.props.ohms) || 220), part: p.id });
      else if (p.type === "led") elems.push({ type: "LED", a: n("A"), b: n("K"), vf: LED_VF[(p.props && p.props.color) || "red"] || 2, part: p.id });
      else if (p.type === "buzzer") elems.push({ type: "R", a: n("P"), b: n("N"), r: 1000, part: p.id, buzzer: true });
      else if (p.type === "button") elems.push({ type: "BTN", a: n("TL"), b: n("BL"), part: p.id });
    });
    var pinNets = {}; for (var pn = 0; pn < 20; pn++) pinNets[pn] = unoNet(pn < 14 ? "D" + pn : "A" + (pn - 14));
    /* only the nets that something is connected to take part in the math (the other 600 holes would just slow it down), so renumber those */
    var power = { gndNet: unoNet("GND_b1"), v5Net: unoNet("5V"), v33Net: unoNet("3V3"), vinNet: unoNet("VIN") }, cmap = {}, count = 0;
    function use(n) { if (n >= 0 && cmap[n] === undefined) cmap[n] = count++; }
    elems.forEach(function (e) { use(e.a); use(e.b); }); Object.keys(pinNets).forEach(function (k) { use(pinNets[k]); }); Object.keys(power).forEach(function (k) { use(power[k]); });
    var cm = function (n) { return n >= 0 ? cmap[n] : -1; };
    elems.forEach(function (e) { e.a = cm(e.a); e.b = cm(e.b); }); Object.keys(pinNets).forEach(function (k) { pinNets[k] = cm(pinNets[k]); });
    var prep = { N: count, keyNet: keyNet, legs: legs, elems: elems, pinNets: pinNets, gndNet: cm(power.gndNet), v5Net: cm(power.v5Net), v33Net: cm(power.v33Net), vinNet: cm(power.vinNet) };
    prepCache = { key: key, prep: prep, proj: fixed ? project : null };
    return prep;
  }

  /* analyze(project, io) -> everything the editor needs to draw and to answer the code.
     io = { pins: {n: {mode, value, pwm, tone}}, pressed: {partId: true}, blown: {partId: true} } (blown is updated) */
  function analyze(project, io, fixed) {
    io = io || {}; io.pins = io.pins || {}; io.pressed = io.pressed || {}; io.blown = io.blown || {};
    var P = prepare(project, fixed), N = P.N, warnings = [], res = { warnings: warnings, leds: {}, buzzers: {}, legs: P.legs, netOf: function (key) { var v = P.keyNet[key]; return v === undefined ? -1 : v; }, volt: null };
    var gndNet = P.gndNet;
    var elems = [];
    P.elems.forEach(function (e) {
      if (e.type === "BTN") { if (io.pressed[e.part]) elems.push({ type: "R", a: e.a, b: e.b, r: 0.1, part: e.part }); }
      else elems.push({ type: e.type, a: e.a, b: e.b, r: e.r, vf: e.vf, part: e.part, buzzer: e.buzzer, on: false });
    });
    if (!N || gndNet < 0) return finish(res, N);

    /* ---- fixed-voltage nets and driven pins */
    var fixed = {}, drives = [];
    fixed[gndNet] = 0;
    function fix(net, v, name) { if (net < 0) return; if (fixed[net] !== undefined && Math.abs(fixed[net] - v) > 0.01) { warnings.push({ msg: "Short circuit! " + name + " is wired straight to another power pin or to GND. Unplug that wire before something gets hot." }); res.short = true; return; } fixed[net] = v; }
    fix(P.v5Net, 5, "5V"); fix(P.v33Net, 3.3, "3.3V"); fix(P.vinNet, 7, "VIN");
    for (var pn = 0; pn < 20; pn++) {
      var net = P.pinNets[pn]; if (net < 0) continue;
      var st = io.pins[pn];
      if (!st || st.mode === undefined || st.mode === null) continue;
      if (st.mode === 1) {                                              /* OUTPUT */
        var vs = st.tone ? 5 : (st.pwm !== null && st.pwm !== undefined ? 5 : (st.value ? 5 : 0));
        drives.push({ net: net, v: vs, r: 25, pin: pn, duty: st.tone ? 1 : (st.pwm !== null && st.pwm !== undefined ? st.pwm / 255 : 1) });
      } else if (st.mode === 2) drives.push({ net: net, v: 5, r: 30000, pin: pn, pullup: true, duty: 1 });
    }

    /* ---- solve (nodal analysis, iterating the LED on/off states) */
    function solveOnce() {
      var G = [], I = [], i, j;
      for (i = 0; i < N; i++) { G.push(new Array(N).fill(0)); I.push(0); G[i][i] += 1e-9; }
      function stampG(a, b, g) { if (a < 0 || b < 0) return; G[a][a] += g; G[b][b] += g; G[a][b] -= g; G[b][a] -= g; }
      elems.forEach(function (e) {
        if (e.type === "R") stampG(e.a, e.b, 1 / e.r);
        else if (e.type === "LED") { if (e.on) { var g = 1 / 4; stampG(e.a, e.b, g); I[e.a] += e.vf * g; I[e.b] -= e.vf * g; } }
      });
      drives.forEach(function (d) { G[d.net][d.net] += 1 / d.r; I[d.net] += d.v / d.r; });
      Object.keys(fixed).forEach(function (k) { k = +k; for (j = 0; j < N; j++) G[k][j] = 0; G[k][k] = 1; I[k] = fixed[k]; });
      return gauss(G, I);
    }
    var iter = 0, volts;
    for (; iter < 30; iter++) {
      volts = solveOnce();
      var changed = false;
      elems.forEach(function (e) {
        if (e.type !== "LED") return;
        var vd = volts[e.a] - volts[e.b];
        if (!e.on && vd > e.vf + 1e-6) { e.on = true; changed = true; }
        else if (e.on) { var cur = (vd - e.vf) / 4; if (cur < -1e-9) { e.on = false; changed = true; } }
      });
      if (!changed) break;
    }
    res.volt = function (n) { return n >= 0 && volts ? volts[n] : 0; };

    /* ---- read-outs */
    var duties = {}; drives.forEach(function (d) { if (d.net >= 0) duties[d.net] = Math.max(duties[d.net] || 0, d.duty); });
    elems.forEach(function (e) {
      if (e.type === "LED") {
        var vd = volts[e.a] - volts[e.b], cur = e.on ? Math.max(0, (vd - e.vf) / 4) : 0;
        var duty = 1, anodeDuty = duties[e.a]; if (anodeDuty !== undefined && anodeDuty < 1) duty = anodeDuty;
        var mA = cur * 1000 * duty, blown = !!io.blown[e.part];
        if (cur * 1000 > 40 && !blown) { io.blown[e.part] = true; blown = true; }
        var r = { current: mA, brightness: blown ? 0 : Math.min(1, mA / 15), blown: blown, reversed: !e.on && (volts[e.b] - volts[e.a]) > 1.5 };
        res.leds[e.part] = r;
        if (blown) warnings.push({ part: e.part, msg: "An LED burned out because too much current went through it (" + Math.round(cur * 1000) + " mA). Put a resistor (like 220 ohms) in series with every LED." });
        else if (r.reversed) warnings.push({ part: e.part, msg: "An LED is backwards. The long leg (anode) must go toward the + side and the short leg (cathode) toward GND." });
      } else if (e.buzzer) {
        var dv = Math.abs(volts[e.a] - volts[e.b]), toneFreq = 0;
        [e.a, e.b].forEach(function (nn) { drives.forEach(function (d) { var s = io.pins[d.pin]; if (d.net !== nn || !s) return; if (s.tone) toneFreq = s.tone; else if (s.pwm !== null && s.pwm !== undefined && !toneFreq && s.pwm > 0 && s.pwm < 255) toneFreq = 490; }); });
        res.buzzers[e.part] = { sounding: dv > 1.5 && toneFreq > 0, freq: toneFreq, volts: dv };
      }
    });
    /* pins that supply too much current */
    drives.forEach(function (d) {
      if (d.pullup) return;
      var cur = Math.abs((d.v - volts[d.net]) / d.r) * 1000;
      if (cur > 40) warnings.push({ msg: "Pin " + pinLabel(d.pin) + " is supplying " + Math.round(cur) + " mA. An Arduino pin can only give about 20 mA (40 mA at most). Check for a missing resistor or a short circuit." });
    });
    /* which nets are connected to a source (so a pin on them is not "floating") */
    var linked = new Array(N).fill(false), adj = [];
    for (var q = 0; q < N; q++) adj.push([]);
    elems.forEach(function (e) { if (e.type === "R" || (e.type === "LED" && e.on)) { adj[e.a].push(e.b); adj[e.b].push(e.a); } });
    var stack = Object.keys(fixed).map(Number).concat(drives.map(function (d) { return d.net; }));
    while (stack.length) { var s = stack.pop(); if (s < 0 || linked[s]) continue; linked[s] = true; adj[s].forEach(function (x) { if (!linked[x]) stack.push(x); }); }
    res.floating = function (n) { return n >= 0 ? !linked[n] : true; };
    res.pinNet = function (pin) { return P.pinNets[pin] === undefined ? -1 : P.pinNets[pin]; };
    res.pinVolt = function (pin) { var n = P.pinNets[pin]; return n >= 0 ? volts[n] : 0; };
    res.pinFloating = function (pin) { var n = P.pinNets[pin]; return n === undefined || n < 0 ? true : !linked[n]; };
    return finish(res, N);
  }
  function finish(res, N) {
    if (!res.volt) res.volt = function () { return 0; };
    if (!res.floating) res.floating = function () { return true; };
    if (!res.pinVolt) { res.pinVolt = function () { return 0; }; res.pinFloating = function () { return true; }; res.pinNet = function () { return -1; }; }
    return res;
  }
  /* Gaussian elimination with partial pivoting */
  function gauss(A, b) {
    var n = b.length, i, j, k, M = A.map(function (r, idx) { return r.concat([b[idx]]); });
    for (i = 0; i < n; i++) {
      var piv = i; for (k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
      if (Math.abs(M[piv][i]) < 1e-18) continue;
      var tmp = M[i]; M[i] = M[piv]; M[piv] = tmp;
      for (k = i + 1; k < n; k++) { var f = M[k][i] / M[i][i]; if (f === 0) continue; for (j = i; j <= n; j++) M[k][j] -= f * M[i][j]; }
    }
    var x = new Array(n).fill(0);
    for (i = n - 1; i >= 0; i--) { var s = M[i][n]; for (j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = Math.abs(M[i][i]) < 1e-18 ? 0 : s / M[i][i]; }
    return x;
  }

  /* resistor color bands for the picture */
  function bands(ohms) {
    var C = ["#000", "#7b3f00", "#e11d1d", "#f97316", "#facc15", "#16a34a", "#2563eb", "#7c3aed", "#6b7280", "#f8fafc"];
    var e = 0, v = ohms; while (v >= 100) { v /= 10; e++; } if (ohms < 10) { return [C[Math.floor(ohms)], C[0], "#d4a017"]; }
    var d1 = Math.floor(v / 10), d2 = Math.floor(v % 10); if (ohms < 100) { d1 = Math.floor(ohms / 10); d2 = ohms % 10; e = 0; return [C[d1], C[d2], C[0]]; }
    return [C[d1], C[d2], C[e]];
  }

  root.ArduinoCircuit = { PARTS: PARTS, P: P, UNO_W: UNO_W, UNO_H: UNO_H, worldTerms: worldTerms, allTerms: allTerms, nearestBoardTerm: nearestBoardTerm, analyze: analyze,
    breadboardInfo: breadboardInfo, railX: railX, pinNumber: pinNumber, pinLabel: pinLabel, LED_VF: LED_VF, RESISTOR_VALUES: RESISTOR_VALUES, ohmsText: ohmsText, bands: bands, rot: rot,
    ROWS_U: ROWS_U, ROWS_L: ROWS_L };
  if (typeof module !== "undefined" && module.exports) module.exports = root.ArduinoCircuit;
})(typeof window !== "undefined" ? window : globalThis);
