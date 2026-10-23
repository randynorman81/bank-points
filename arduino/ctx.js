/* The "context" that assignment checks look at: the student's circuit and code, ready to ask questions of.
   ArduinoCtx.make(project, code) -> c   (used by the editor, the grading page and the tests) */
(function (root) {
  "use strict";
  var C = root.ArduinoCircuit, Sim = root.ArduinoSim, Comp = root.ArduinoCompiler, runCache = {};
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function stripComments(c) { return c.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""); }

  function make(project, code) {
    code = String(code || ""); var noC = stripComments(code);
    var base = C.analyze(project, { pins: {}, pressed: {}, blown: {} });
    var uno = project.parts.filter(function (p) { return p.type === "uno"; })[0], unoId = uno ? uno.id : "uno1";
    var comp = Comp.compile(code), pkey = JSON.stringify([project.parts, project.wires]), c = {};
    var pinCache = {};
    c.project = project; c.compiled = comp.ok; c.compileErrors = comp.errors; c.base = base; c.raw = code; c.noComments = noC;
    c.code = function (re, incl) { return re.test(incl ? code : noC); };
    c.count = function (type) { return project.parts.filter(function (p) { return p.type === type; }).length; };
    c.parts = function (type) { return project.parts.filter(function (p) { return p.type === type; }); };
    c.wires = function () { return project.wires; };
    c.part = function (id) { return project.parts.filter(function (p) { return p.id === id; })[0]; };
    function nearest(part, term) { var t = C.worldTerms(part).filter(function (x) { return x.id === term; })[0]; return t && C.nearestBoardTerm(project, t.x, t.y, 4, part.id); }
    c.strip = function (part, term) { var h = nearest(part, term); return h ? (h.strip || h.id) : ""; };
    c.holeOf = function (part, term) { var h = nearest(part, term); return h ? h.id : ""; };
    c.plugged = function (part) { return C.worldTerms(part).every(function (t) { return base.legs[t.key]; }); };
    c.netOf = function (part, term) { return base.netOf(part.id + ":" + term); };
    c.pin = function (label) { return base.netOf(unoId + ":" + label); };
    c.gnd = base.netOf(unoId + ":GND_b1"); c.v5 = base.netOf(unoId + ":5V");
    /* the nets of the breadboards' power rails: kind is "plus" or "minus" */
    c.rail = function (kind) { var out = []; c.parts("breadboard").forEach(function (b) { (kind === "plus" ? ["tp0", "bp0"] : ["tn0", "bn0"]).forEach(function (id) { var n = base.netOf(b.id + ":" + id); if (n >= 0) out.push(n); }); }); return out; };
    c.isRail = function (net, kind) { return c.rail(kind).indexOf(net) > -1; };
    /* is there a wire between a pin or net and one of a list of nets? (color optional) */
    c.wireBetween = function (netA, netsB, color) {
      return project.wires.some(function (w) {
        var a = base.netOf(w.a.term), b = base.netOf(w.b.term); if (color && w.color !== color) return false;
        return (a === netA && netsB.indexOf(b) > -1) || (b === netA && netsB.indexOf(a) > -1);
      });
    };
    c.staticRun = function (o) { return C.analyze(project, { pins: o.pins || {}, pressed: o.pressed || {}, blown: {} }); };
    function pinHigh(pin) { var o = {}; o[pin] = { mode: 1, value: 1, pwm: null, tone: 0 }; return o; }
    /* with this pin HIGH, which LEDs light up (about 5 to 25 mA, not burned)? */
    c.ledsOnPin = function (pin) {
      if (pinCache[pin]) return pinCache[pin];
      var r = c.staticRun({ pins: pinHigh(pin) }), out = Object.keys(r.leds).filter(function (id) { var l = r.leds[id]; return !l.blown && l.current >= 4 && l.current <= 26; });
      pinCache[pin] = out; return out;
    };
    /* the digital pin (2 to 13) that this LED lights from, or 0 if none */
    c.pinOfLed = function (led) { for (var p = 2; p <= 13; p++) if (c.ledsOnPin(p).indexOf(led.id) > -1) return p; return 0; };
    /* LEDs that glow from the 5V pin alone (no code needed) */
    c.litFromPower = function () { var r = c.staticRun({}); return Object.keys(r.leds).filter(function (id) { var l = r.leds[id]; return !l.blown && l.current >= 4 && l.current <= 26; }); };
    c.run = function (opts) { var k = pkey + "|" + code + "|" + JSON.stringify(opts); if (!runCache[k]) { if (Object.keys(runCache).length > 40) runCache = {}; runCache[k] = Sim.virtual(clone(project), code, opts); } return runCache[k]; };
    return c;
  }
  root.ArduinoCtx = { make: make, stripComments: stripComments };
  if (typeof module !== "undefined" && module.exports) module.exports = root.ArduinoCtx;
})(typeof window !== "undefined" ? window : globalThis);
