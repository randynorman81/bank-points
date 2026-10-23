/* Simulation runtime for the SCHS Arduino editor: connects the compiled sketch to the circuit.
   - Real-time mode (the editor): delay() really waits (speed 1x, 2x, 5x, 10x), the program runs until Stop.
   - Virtual mode (auto-checks): time is simulated, so a 10 second blink is tested instantly.
   Sim.virtual(project, code, opts) -> {ok, errors, serial, samples, pinsUsed, ...} */
(function (root) {
  "use strict";
  var STOP = { stopped: true };
  var PWM_PINS = { 3: 1, 5: 1, 6: 1, 9: 1, 10: 1, 11: 1 };

  function Sim(env) {
    this.env = env || {}; this.running = false; this.stopFlag = false; this.speed = 1; this.virtualMode = !!(env && env.virtual);
    this.io = { pins: {}, pressed: {}, blown: {} }; this.res = null; this.dirty = true; this.serialOut = ""; this.serialIn = []; this.rngState = (Date.now() & 0x7fffffff) || 1;
    this.t0 = 0; this.vt = 0; this.events = []; this.lastYield = 0; this.status = ""; this.history = { ledOn: {}, ledOff: {}, maxLed: {}, pinHigh: {}, pinLow: {}, toneSeen: {}, serialBytes: 0 };
    this.userPinMode = {}; this.resetPins();
  }
  Sim.prototype.resetPins = function () { var pins = {}; for (var i = 0; i < 20; i++) pins[i] = { mode: undefined, pullup: false, value: 0, pwm: null, tone: 0 }; this.io.pins = pins; };
  Sim.prototype.markDirty = function () { this.dirty = true; this.schedule(); };
  Sim.prototype.schedule = function () {
    var self = this; if (this.virtualMode || this.pending) return;
    this.pending = true;
    var fired = false, go = function () { if (fired) return; fired = true; self.pending = false; if (self.env.onUpdate) self.env.onUpdate(self.analysis(), self.io); };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(go); setTimeout(go, 40);   /* the timer is a backup for background tabs, where animation frames pause */
  };
  /* the circuit solved for the current pin states (cached until something changes) */
  Sim.prototype.analysis = function () {
    if (this.dirty || !this.res) {
      var io = { pins: {}, pressed: this.io.pressed, blown: this.io.blown }, self = this;
      Object.keys(this.io.pins).forEach(function (k) { var s = self.io.pins[k]; io.pins[k] = { mode: s.mode === 0 && s.pullup ? 2 : s.mode, value: s.value, pwm: s.pwm, tone: s.tone }; });
      this.res = root.ArduinoCircuit.analyze(this.env.getProject(), io, this.virtualMode); this.dirty = false;
      /* history for the auto-checks */
      var h = this.history, res = this.res;
      Object.keys(res.leds).forEach(function (id) { var b = res.leds[id].brightness; if (b > 0.05) h.ledOn[id] = (h.ledOn[id] || 0) + 1; else if (h.ledSeenOn && h.ledSeenOn[id]) h.ledOff[id] = (h.ledOff[id] || 0) + 1; h.ledSeenOn = h.ledSeenOn || {}; if (b > 0.05) h.ledSeenOn[id] = true; h.maxLed[id] = Math.max(h.maxLed[id] || 0, b); });
      Object.keys(res.buzzers).forEach(function (id) { if (res.buzzers[id].sounding) h.toneSeen[id] = true; });
    }
    return this.res;
  };
  Sim.prototype.press = function (partId, down) { if (this.io.pressed[partId] === !!down) return; this.io.pressed[partId] = !!down; this.markDirty(); };

  /* ---------- clock */
  Sim.prototype.now = function () { return this.virtualMode ? this.vt : (performance.now() - this.t0) * this.speed; };
  Sim.prototype.sleep = function (ms, tok) {
    var self = this;
    if (this.virtualMode) {
      this.vt += ms; this.runEvents();
      if (this.limit !== undefined && this.vt > this.limit) throw STOP;
      return Promise.resolve();
    }
    return new Promise(function (resolve, reject) {
      var wait = ms / self.speed, end = performance.now() + wait;
      (function step() { if (self.stopFlag || (tok && tok.stop)) { reject(STOP); return; } var left = end - performance.now(); if (left <= 0) { resolve(); return; } setTimeout(step, Math.min(left, 50)); })();
    });
  };
  Sim.prototype.runEvents = function () {
    while (this.events.length && this.events[0].t <= this.vt) { var e = this.events.shift(); e.fn(this); }
    if (this.samples) { while (this.nextSample < this.samples.length && this.samples[this.nextSample] <= this.vt) { this.takeSample(this.samples[this.nextSample]); this.nextSample++; } }
  };
  Sim.prototype.takeSample = function (t) {
    var r = this.analysis(), leds = {}, buz = {}, pins = {};
    Object.keys(r.leds).forEach(function (id) { leds[id] = r.leds[id].brightness; });
    Object.keys(r.buzzers).forEach(function (id) { buz[id] = r.buzzers[id].sounding; });
    for (var i = 0; i < 20; i++) pins[i] = this.io.pins[i].value;
    this.out.samples.push({ t: t, leds: leds, buzzers: buz, pins: pins });
  };
  var chan = null;
  function yieldNow() {
    if (typeof MessageChannel === "function") {
      return new Promise(function (resolve) { if (!chan) { chan = new MessageChannel(); chan.port1.onmessage = function () { var f = chan.q.shift(); if (f) f(); }; chan.q = []; } chan.q.push(resolve); chan.port2.postMessage(0); });
    }
    return new Promise(function (r) { setTimeout(r, 0); });
  }

  /* ---------- the runtime handed to the compiled sketch */
  Sim.prototype.makeRuntime = function (tok) {
    tok = tok || { stop: false };
    var self = this, rt = { L: 0, n: 0 }, pins = function () { return self.io.pins; };
    function badPin(p, what) { throw new Error("Pin " + p + " does not exist on the Arduino Uno. Use pins 0 to 13 and A0 to A5 (" + what + ")."); }
    function pinOk(p, what) { p = Math.trunc(p); if (!(p >= 0 && p <= 19)) badPin(p, what); return p; }
    rt.tick = function () {
      if (tok.stop) throw STOP;
      if (self.virtualMode) { self.guard = (self.guard || 0) + 1; if (self.guard > 3000000 || (self.deadline && Date.now() > self.deadline)) throw STOP; return Promise.resolve(); }
      return yieldNow().then(function () { if (tok.stop) throw STOP; });
    };
    rt.delay = function (ms) { ms = +ms; if (!(ms >= 0)) ms = 0; return self.sleep(ms, tok); };
    var usAcc = 0;
    rt.delayUs = function (us) { usAcc += +us || 0; if (usAcc >= 1000) { var m = Math.floor(usAcc / 1000); usAcc -= m * 1000; return self.sleep(m, tok); } return Promise.resolve(); };
    rt.millis = function () { return Math.floor(self.now()) >>> 0; };
    rt.micros = function () { return Math.floor(self.now() * 1000) >>> 0; };
    rt.pinMode = function (p, m) { p = pinOk(p, "pinMode"); var s = pins()[p]; s.mode = m === 1 ? 1 : m === 2 ? 0 : 0; s.pullup = m === 2; self.userPinMode[p] = m; if (m === 1) { s.pwm = null; } self.markDirty(); };
    rt.digitalWrite = function (p, v) {
      p = pinOk(p, "digitalWrite"); var s = pins()[p];
      if (s.mode === 1) { s.value = v ? 1 : 0; s.pwm = null; s.tone = 0; if (s.value) self.history.pinHigh[p] = (self.history.pinHigh[p] || 0) + 1; else self.history.pinLow[p] = (self.history.pinLow[p] || 0) + 1; }
      else s.pullup = !!v;                                  /* writing HIGH to an INPUT pin turns on its pull-up, like a real Uno */
      self.markDirty();
    };
    rt.analogWrite = function (p, v) {
      p = pinOk(p, "analogWrite"); var s = pins()[p]; v = Math.max(0, Math.min(255, Math.trunc(v)));
      s.mode = 1; s.tone = 0;
      if (PWM_PINS[p]) { s.pwm = v === 0 || v === 255 ? null : v; s.value = v >= 128 ? 1 : 0; if (v === 255) s.value = 1; if (v === 0) s.value = 0; }
      else { s.pwm = null; s.value = v >= 128 ? 1 : 0; self.history.badPwm = true; if (!self.warnedPwm || !self.warnedPwm[p]) { self.warnedPwm = self.warnedPwm || {}; self.warnedPwm[p] = 1; self.say("Pin " + pinName(p) + " can not do PWM (the ~ pins can: 3, 5, 6, 9, 10, 11), so analogWrite only turns it fully on or off.\n"); } }
      self.history.pwmUsed = self.history.pwmUsed || {}; self.history.pwmUsed[p] = true; self.markDirty();
    };
    rt.digitalRead = function (p) {
      p = pinOk(p, "digitalRead"); var s = pins()[p];
      if (s.mode === 1) return s.value ? 1 : 0;
      var r = self.analysis();
      if (r.pinFloating(p) && !s.pullup) { self.history.floatRead = true; return Math.random() < 0.5 ? 1 : 0; }
      return r.pinVolt(p) > 2.5 ? 1 : 0;
    };
    rt.analogRead = function (p) {
      p = Math.trunc(p); if (p >= 0 && p <= 5) p += 14; if (!(p >= 14 && p <= 19)) throw new Error("analogRead needs an analog pin: A0 to A5.");
      var s = pins()[p], r = self.analysis();
      if (s.mode === 1) return s.value ? 1023 : 0;
      if (r.pinFloating(p) && !s.pullup) { self.history.floatRead = true; return Math.floor(Math.random() * 1024); }
      return Math.max(0, Math.min(1023, Math.round(r.pinVolt(p) / 5 * 1023)));
    };
    rt.tone = function (p, f, d) {
      p = pinOk(p, "tone"); var s = pins()[p]; s.mode = 1; s.tone = Math.max(0, Math.trunc(f)); s.pwm = null; s.value = 1; self.markDirty();
      if (d > 0) { var tt = self.now() + d; if (self.virtualMode) { self.events.push({ t: self.vt + d, fn: function () { s.tone = 0; s.value = 0; self.markDirty(); } }); self.events.sort(function (a, b) { return a.t - b.t; }); } else setTimeout(function () { if (s.tone) { s.tone = 0; s.value = 0; self.markDirty(); } }, d / self.speed); }
    };
    rt.noTone = function (p) { p = pinOk(p, "noTone"); var s = pins()[p]; s.tone = 0; s.value = 0; self.markDirty(); };
    rt.random = function (a, b) { if (b <= a) return a; self.rngState = (self.rngState * 1103515245 + 12345) & 0x7fffffff; var u = (self.rngState >>> 8) / 8388608; return a + Math.floor((u >= 1 ? 0.999999 : u) * (b - a)); };
    rt.randomSeed = function (s) { self.rngState = (Math.abs(Math.trunc(s)) & 0x7fffffff) || 1; };
    rt.map = function (x, a, b, c, d) { if (b === a) return c; var r = (x - a) * (d - c) / (b - a) + c; return Math.trunc(r); };
    rt.div = function (a, b) { if (b === 0) throw new Error("You divided by zero. Make sure the number you divide by is never 0."); return Math.trunc(a / b); };
    rt.mod = function (a, b) { if (b === 0) throw new Error("You used % with 0. Make sure the number after % is never 0."); return a % b; };
    rt.ci = function (arr, i) { if (!Array.isArray(arr)) throw new Error("That is not an array."); i = Math.trunc(i); if (i < 0 || i >= arr.length) throw new Error("Array index " + i + " is out of range. This array has " + arr.length + " spot" + (arr.length === 1 ? "" : "s") + " (numbered 0 to " + (arr.length - 1) + ")."); return i; };
    rt.makeArray = function (dims, z) { function mk(d) { var a = new Array(dims[d]); for (var i = 0; i < dims[d]; i++) a[i] = d === dims.length - 1 ? z : mk(d + 1); return a; } return mk(0); };
    rt.numstr = function (v, t) { return t === "float" ? fmtFloat(v, 2) : String(v); };
    function fmtFloat(v, d) { if (!isFinite(v)) return isNaN(v) ? "nan" : (v < 0 ? "-inf" : "inf"); return v.toFixed(d); }
    function fmt(v, kind, f) {
      if (kind === "float") return fmtFloat(v, typeof f === "number" ? f : 2);
      if (kind === "char") return String.fromCharCode(v);
      if (kind === "str") return String(v);
      if (f === 16) return (v >>> 0).toString(16).toUpperCase(); if (f === 2) return (v >>> 0).toString(2); if (f === 8) return (v >>> 0).toString(8);
      return String(v);
    }
    rt.print = function (v, k, f) { self.say(fmt(v, k, f)); };
    rt.println = function (v, k, f) { self.say(fmt(v, k, f) + "\n"); };
    rt.serialBegin = function (b) { self.serialStarted = true; };
    rt.serialWrite = function (n) { self.say(String.fromCharCode(n)); };
    rt.serialAvailable = function () { return self.serialIn.length; };
    rt.serialRead = function () { return self.serialIn.length ? self.serialIn.shift() : -1; };
    rt.serialParseInt = function () { var s = ""; while (self.serialIn.length && !/[-0-9]/.test(String.fromCharCode(self.serialIn[0]))) self.serialIn.shift(); while (self.serialIn.length && /[-0-9]/.test(String.fromCharCode(self.serialIn[0]))) s += String.fromCharCode(self.serialIn.shift()); return parseInt(s, 10) || 0; };
    rt.serialParseFloat = function () { var s = ""; while (self.serialIn.length && !/[-0-9.]/.test(String.fromCharCode(self.serialIn[0]))) self.serialIn.shift(); while (self.serialIn.length && /[-0-9.]/.test(String.fromCharCode(self.serialIn[0]))) s += String.fromCharCode(self.serialIn.shift()); return parseFloat(s) || 0; };
    rt.serialReadString = function () { var s = ""; while (self.serialIn.length) { var c = self.serialIn.shift(); if (c === 10) break; s += String.fromCharCode(c); } return s; };
    rt.unsupported = function (w) { throw new Error(w + " is not supported in this editor yet."); };
    return rt;
  };
  function pinName(p) { return p < 14 ? String(p) : "A" + (p - 14); }
  Sim.prototype.say = function (text) {
    if (!text) return; if (!this.serialStarted && !this.warnedSerial) { this.warnedSerial = true; this.serialOut += ""; }
    this.serialOut += text; this.history.serialBytes += text.length;
    if (this.env.onSerial) this.env.onSerial(text);
  };

  /* ---------- running */
  Sim.prototype.start = function (code) {
    var c = root.ArduinoCompiler.compile(code);
    if (!c.ok) return c;
    this.stop(true);
    var tok = this.token = { stop: false }; this.stopFlag = false; this.running = true; this.t0 = performance.now(); this.vt = 0; this.guard = 0; this.serialOut = ""; this.serialStarted = false; this.warnedSerial = false; this.warnedPwm = null;
    this.io.blown = {}; this.io.pressed = this.io.pressed || {}; this.resetPins(); this.res = null; this.dirty = true;
    this.history = { ledOn: {}, ledOff: {}, maxLed: {}, pinHigh: {}, pinLow: {}, toneSeen: {}, serialBytes: 0 };
    var rt = this.makeRuntime(tok), self = this, prog;
    try { prog = c.make(rt); } catch (e) { this.running = false; return { ok: false, errors: [{ line: 1, msg: "The program could not start: " + e.message }], warnings: [] }; }
    this.rt = rt; this.markDirty();
    var done = (async function () {
      try {
        prog.init(); await prog.setup();
        for (;;) { if (tok.stop) throw STOP; await prog.loop(); await rt.tick(); }
      } catch (e) {
        if (e !== STOP && self.token === tok) { self.runtimeError = { line: rt.L, msg: e && e.message ? e.message : String(e) }; if (self.env.onError) self.env.onError(self.runtimeError); }
      } finally { if (self.token === tok) { self.running = false; self.markDirty(); if (self.env.onStop) self.env.onStop(); } }
    })();
    this.promise = done;
    return { ok: true, errors: [], warnings: c.warnings };
  };
  Sim.prototype.stop = function (quiet) {
    if (this.token) this.token.stop = true; this.stopFlag = true; this.running = false; this.resetPins(); this.io.pressed = {}; this.markDirty();
    if (!quiet && this.env.onStop) this.env.onStop();
  };
  Sim.prototype.sendSerial = function (text) { for (var i = 0; i < text.length; i++) this.serialIn.push(text.charCodeAt(i)); };

  /* ---------- virtual-time test run (used by the auto-checks) */
  Sim.virtual = async function (project, code, opts) {
    opts = opts || {};
    var out = { ok: false, errors: [], samples: [], serial: "" }, sim = new Sim({ virtual: true, getProject: function () { return project; } });
    sim.limit = opts.until || 5000; sim.samples = (opts.samples || []).slice().sort(function (a, b) { return a - b; }); sim.nextSample = 0; sim.out = out; sim.deadline = Date.now() + (opts.maxMs || 1500);
    sim.events = (opts.events || []).map(function (e) { return { t: e.t, fn: function (s) { if (e.press !== undefined) s.press(e.press, e.down !== false); if (e.serial) s.sendSerial(e.serial); } }; }).sort(function (a, b) { return a.t - b.t; });
    var c = root.ArduinoCompiler.compile(code);
    if (!c.ok) { out.errors = c.errors; return out; }
    sim.io.pressed = {}; sim.stopFlag = false; sim.running = true;
    var rt = sim.makeRuntime({ stop: false }), prog = c.make(rt);
    try {
      prog.init(); await prog.setup();
      for (;;) { await prog.loop(); await rt.tick(); sim.vt += 0.2; sim.runEvents(); if (sim.vt > sim.limit) break; }
    } catch (e) { if (e !== STOP) { out.runtimeError = { line: rt.L, msg: e && e.message ? e.message : String(e) }; } }
    sim.runEvents();
    out.ok = !out.runtimeError; out.serial = sim.serialOut; out.history = sim.history; out.io = sim.io; out.final = sim.analysis(); out.vt = sim.vt; out.userPinMode = sim.userPinMode;
    return out;
  };

  root.ArduinoSim = Sim;
  if (typeof module !== "undefined" && module.exports) module.exports = Sim;
})(typeof window !== "undefined" ? window : globalThis);
