/* Arduino Circuit Editor: the canvas, the code editor, the simulation controls, the assignment checker and cloud saving. */
(function () {
  "use strict";
  var C = window.ArduinoCircuit, R = window.ArduinoRender, Sim = window.ArduinoSim, ASSIGN = window.ARD_ASSIGN || {}, SLOTS = window.ARD_SLOTS || [["free", "Free build (practice)"]];
  var $ = function (id) { return document.getElementById(id); };
  var API = "/api/arduinocode", GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
  var TEACHER_EMAILS = ["randy.norman@socialcircleschools.org"];
  var PERIODS = ["4B"];          /* the class periods students can pick; edit this list for your classes */
  var STARTER = "void setup() {\n  \n}\n\nvoid loop() {\n  \n}\n";
  var P = C.P;

  /* ------------------------------------------------------------------ small helpers */
  function lsGet(k) { try { return localStorage.getItem("ard:" + k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem("ard:" + k, v); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var toastT; function toast(msg) { var t = $("toast"); t.textContent = msg; t.className = "show"; clearTimeout(toastT); toastT = setTimeout(function () { t.className = ""; }, 2600); }
  function status(msg, bad) { var s = $("status"); s.textContent = msg; s.className = "status" + (bad ? " bad" : ""); s.title = msg; }

  /* ------------------------------------------------------------------ the project (parts and wires) */
  var project, slot = "free", view = { x: 20, y: 20, z: 1 }, sel = null, wireColor = "green", hist = [], redo = [], termCache = [];
  function defaultProject() { return { parts: [{ id: "uno1", type: "uno", x: 70, y: 20, rot: 0, props: {} }, { id: "bb1", type: "breadboard", x: 20, y: 290, rot: 0, props: { size: "half" } }], wires: [] }; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function partById(id) { for (var i = 0; i < project.parts.length; i++) if (project.parts[i].id === id) return project.parts[i]; return null; }
  function wireById(id) { for (var i = 0; i < project.wires.length; i++) if (project.wires[i].id === id) return project.wires[i]; return null; }
  var PREFIX = { uno: "uno", breadboard: "bb", led: "led", resistor: "r", button: "btn", buzzer: "bz" };
  function nextId(prefix, list) { var n = 1; for (;;) { var id = prefix + n; if (!list.some(function (x) { return x.id === id; })) return id; n++; } }
  function rebuildTerms() { termCache = C.allTerms(project); }
  function validProject(p) { return p && Array.isArray(p.parts) && Array.isArray(p.wires) && p.parts.every(function (x) { return x && C.PARTS[x.type] && typeof x.x === "number" && typeof x.y === "number"; }); }
  function serialize() { return JSON.stringify(project); }
  function sigNow() { return serialize() + "||" + ta.value + "||" + JSON.stringify(ANS); }

  /* ------------------------------------------------------------------ simulation */
  var sim, lastRes = null, audio = null, osc = {}, serialBlink = 0, coach = null, coachArmed = false;
  function coachCheck(res, io) { if (!coach || !coachArmed) return; coach.check({ res: res || lastRes, io: io || (sim && sim.io), project: project, sim: sim, serial: sim ? sim.serialOut : "", slot: slot }); }
  function makeSim() {
    sim = new Sim({
      getProject: function () { return project; },
      onUpdate: function (res, io) { lastRes = res; R.update($("stage"), project, res, io, { serialActive: Date.now() - serialBlink < 250 }); updatePins(io); updateWarnings(res); updateAudio(res); coachCheck(res, io); scheduleEval(); },
      onSerial: function (t) { appendOut(t); coachCheck(lastRes, sim && sim.io); },
      onError: function (e) { status("Stopped. Line " + e.line + ": " + e.msg, true); showRuntimeError(e); },
      onStop: function () { $("run").className = "btn run"; $("run").innerHTML = "&#9654; Start Simulation"; $("stage").classList.remove("running"); lastRes = sim.analysis(); R.update($("stage"), project, lastRes, sim.io, {}); updatePins(sim.io); updateAudio(lastRes); if (!sim.runtimeError) status("Stopped"); }
    });
    sim.speed = +$("speed").value || 1;
  }
  function refreshVisuals() { if (!sim) return; sim.markDirty(); lastRes = sim.analysis(); R.update($("stage"), project, lastRes, sim.io, {}); updateWarnings(lastRes); coachCheck(lastRes, sim.io); }
  function startSim() {
    ensureAudio(); coachArmed = true;
    var r = sim.start($("ta").value);
    if (!r.ok) { showCompile(r); status("Fix the red error first", true); return; }
    sim.runtimeError = null; showCompile(r);
    $("run").className = "btn stop"; $("run").innerHTML = "&#9632; Stop"; $("stage").classList.add("running"); status("Running... press the buttons on the canvas");
    if (!sim.serialStartedHint) sim.serialStartedHint = true;
    setHint("");
  }
  function stopSim() { sim.stop(); }
  $("run").onclick = function () { if (sim.running) stopSim(); else startSim(); };
  $("reset").onclick = function () { var was = sim.running; sim.stop(); $("out").textContent = ""; sim.io.blown = {}; refreshVisuals(); if (was) setTimeout(startSim, 60); else status("Reset"); };
  $("speed").onchange = function () { sim.speed = +$("speed").value || 1; };

  /* ------------------------------------------------------------------ sound */
  function ensureAudio() {
    try { if (!audio) { var AC = window.AudioContext || window.webkitAudioContext; if (AC) audio = new AC(); } if (audio && audio.state === "suspended") audio.resume(); } catch (e) {}
  }
  function updateAudio(res) {
    if (!audio) return;
    var wanted = {}; if (res && res.buzzers && sim.running) Object.keys(res.buzzers).forEach(function (id) { var b = res.buzzers[id]; if (b.sounding && b.freq > 0) wanted[id] = b.freq; });
    Object.keys(osc).forEach(function (id) { if (!wanted[id]) { try { osc[id].o.stop(); } catch (e) {} delete osc[id]; } });
    Object.keys(wanted).forEach(function (id) {
      if (!osc[id]) { var o = audio.createOscillator(), g = audio.createGain(); o.type = "square"; g.gain.value = 0.04; o.connect(g); g.connect(audio.destination); o.frequency.value = wanted[id]; o.start(); osc[id] = { o: o, g: g }; }
      else osc[id].o.frequency.setTargetAtTime(wanted[id], audio.currentTime, 0.01);
    });
  }

  /* ------------------------------------------------------------------ pins bar and warnings */
  function updatePins(io) {
    var h = "", i, s, cls, txt;
    for (i = 0; i < 20; i++) {
      s = io.pins[i]; if (!s || s.mode === undefined) { continue; }
      var name = i < 14 ? "D" + i : "A" + (i - 14);
      if (s.mode === 1) { if (s.tone) { cls = "pw"; txt = "tone " + s.tone; } else if (s.pwm !== null && s.pwm !== undefined) { cls = "pw"; txt = "PWM " + s.pwm; } else { cls = s.value ? "hi" : "lo"; txt = s.value ? "HIGH" : "LOW"; } }
      else { cls = "in"; txt = s.pullup ? "IN+pullup" : "INPUT"; }
      h += '<span class="' + cls + '">' + name + ": " + txt + "</span>";
    }
    $("pinbar").innerHTML = h || '<span>Pins you use in your code show up here while the simulation runs.</span>';
  }
  function updateWarnings(res) {
    var box = $("warnbox"), h = "", seen = {};
    if (res && sim.running) {
      res.warnings.forEach(function (w) { if (!seen[w.msg]) { seen[w.msg] = 1; h += "<div>" + esc(w.msg) + "</div>"; } });
      if (sim.history && sim.history.floatRead) h += '<div class="tip">One of your input pins is not connected to anything, so digitalRead gives random 0s and 1s. Connect it (a button to GND with INPUT_PULLUP works well).</div>';
      Object.keys(res.leds).forEach(function (id) { });
    }
    box.innerHTML = h;
  }
  var hintT; function setHint(msg) { var h = $("hint"); h.textContent = msg; h.className = msg ? "show" : ""; clearTimeout(hintT); if (msg) hintT = setTimeout(function () { h.className = ""; }, 4000); }

  /* ------------------------------------------------------------------ the canvas: drawing */
  var stage = $("stage"), worldG, partsG, wiresG, overG;
  function buildStage() {
    stage.innerHTML = '<g id="world"><g id="layerParts"></g><g id="layerWires"></g><g id="layerOver"></g></g>';
    worldG = stage.querySelector("#world"); partsG = stage.querySelector("#layerParts"); wiresG = stage.querySelector("#layerWires"); overG = stage.querySelector("#layerOver");
    var html = ""; var boards = project.parts.filter(function (p) { return C.PARTS[p.type].board; }), rest = project.parts.filter(function (p) { return !C.PARTS[p.type].board; });
    boards.concat(rest).forEach(function (p) { html += R.partGroup(p).replace('class="part"', 'class="part" data-type="' + p.type + '"'); });
    partsG.innerHTML = html; renderWires(); applyView(); drawOverlay(); rebuildTerms(); refreshVisuals();
  }
  function renderWires() { wiresG.innerHTML = project.wires.map(function (w) { return R.wireSVG(project, w); }).join(""); }
  function applyView() { worldG.setAttribute("transform", "translate(" + view.x + " " + view.y + ") scale(" + view.z + ")"); }
  function toWorld(e) { var r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left - view.x) / view.z, y: (e.clientY - r.top - view.y) / view.z }; }
  function bboxLocal(p) {
    switch (p.type) {
      case "uno": return [-16, 0, C.UNO_W, C.UNO_H]; case "breadboard": var d = C.PARTS.breadboard.dims(p); return [0, 0, d.w, d.h];
      case "led": return [-16, -62, 40, 66]; case "resistor": return [-4, -14, Math.max(3, Math.min(12, Math.round(+(p.props && p.props.span) || 4))) * P + 8, 24]; case "button": return [-10, -10, 38, 56]; case "buzzer": return [-6, -40, 40, 44];
    }
    return [0, 0, 10, 10];
  }
  function bboxWorld(p) {
    var b = bboxLocal(p), pts = [[b[0], b[1]], [b[0] + b[2], b[1]], [b[0], b[1] + b[3]], [b[0] + b[2], b[1] + b[3]]].map(function (q) { var r = C.rot(q[0], q[1], p.rot || 0); return [p.x + r[0], p.y + r[1]]; });
    var xs = pts.map(function (q) { return q[0]; }), ys = pts.map(function (q) { return q[1]; });
    return { x: Math.min.apply(null, xs), y: Math.min.apply(null, ys), w: Math.max.apply(null, xs) - Math.min.apply(null, xs), h: Math.max.apply(null, ys) - Math.min.apply(null, ys) };
  }
  var overlay = { snap: null, wirePreview: null, hover: null };
  function drawOverlay() {
    if (!overG) return; var h = "";
    if (sel && sel.type === "part") { var p = partById(sel.id); if (p) { var b = bboxWorld(p); h += '<rect x="' + (b.x - 3) + '" y="' + (b.y - 3) + '" width="' + (b.w + 6) + '" height="' + (b.h + 6) + '" rx="5" fill="none" stroke="#22D3EE" stroke-width="1.6" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/>'; } }
    if (sel && sel.type === "wire") {
      var w = wireById(sel.id); if (w) { var a = R.termPos(project, w.a.term), bb = R.termPos(project, w.b.term); if (a && bb) h += '<circle cx="' + a.x + '" cy="' + a.y + '" r="6" fill="#22D3EE" fill-opacity=".35" stroke="#22D3EE" stroke-width="2" data-whandle="a"/><circle cx="' + bb.x + '" cy="' + bb.y + '" r="6" fill="#22D3EE" fill-opacity=".35" stroke="#22D3EE" stroke-width="2" data-whandle="b"/>'; }
    }
    if (overlay.snap) h += '<circle cx="' + overlay.snap.x + '" cy="' + overlay.snap.y + '" r="7" fill="none" stroke="#34D399" stroke-width="2.5"/>';
    if (overlay.hover) { var hc = overlay.hover.pol === "+" ? "#fb7185" : overlay.hover.pol === "-" ? "#60a5fa" : "#22D3EE"; h += '<circle cx="' + overlay.hover.x + '" cy="' + overlay.hover.y + '" r="7" fill="' + hc + '" fill-opacity=".3" stroke="' + hc + '" stroke-width="2"/>'; }
    if (overlay.wirePreview) { var wp = overlay.wirePreview; h += '<path d="' + R.wireD(wp.a.x, wp.a.y, wp.b.x, wp.b.y) + '" fill="none" stroke="' + (R.WIRE_COLORS[wireColor] || "#16a34a") + '" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="6 5" opacity=".9"/>'; }
    overG.innerHTML = h;
  }

  /* ------------------------------------------------------------------ the canvas: history */
  function persist() { lsSet("proj:" + slot, serialize()); lsSet("pt:" + slot, String(Date.now())); }
  function commit(noHist) {
    if (!noHist) { hist.push(serialize()); if (hist.length > 80) hist.shift(); redo = []; }
    coachArmed = true; persist(); rebuildTerms(); updateUndo(); changed();
  }
  function updateUndo() { $("undo").disabled = hist.length < 2; $("redo").disabled = !redo.length; }
  function doUndo() { if (hist.length < 2) return; redo.push(hist.pop()); project = JSON.parse(hist[hist.length - 1]); sel = null; buildStage(); persist(); updateUndo(); showProps(); changed(); }
  function doRedo() { if (!redo.length) return; var s = redo.pop(); hist.push(s); project = JSON.parse(s); sel = null; buildStage(); persist(); updateUndo(); showProps(); changed(); }
  $("undo").onclick = doUndo; $("redo").onclick = doRedo;
  var changeT; function changed() { clearTimeout(changeT); changeT = setTimeout(function () { sim && sim.markDirty(); scheduleEval(); cloudSoon(); }, 80); }

  /* ------------------------------------------------------------------ the canvas: parts */
  /* ---- adding parts: click, hold, and drag a part from the parts bar onto the canvas (a plain click only shows how) */
  var KIND_NAME = { led: "LED", resistor: "resistor", button: "pushbutton", buzzer: "buzzer", breadboard: "breadboard", "breadboard-mini": "mini breadboard" };
  function partProps(kind) {
    if (kind === "breadboard-mini") return { type: "breadboard", props: { size: "mini" } };
    if (kind === "breadboard") return { type: "breadboard", props: { size: "half" } };
    if (kind === "led") return { type: "led", props: { color: "red" } };
    if (kind === "resistor") return { type: "resistor", props: { ohms: 220 } };
    return { type: kind, props: {} };
  }
  function placePart(kind, wx, wy) {
    var k = partProps(kind), p = { id: nextId(PREFIX[k.type], project.parts), type: k.type, x: Math.round(wx), y: Math.round(wy), rot: 0, props: k.props };
    if (C.PARTS[k.type].board) { p.x -= 20; p.y -= 20; } else snapPart(p);
    project.parts.push(p); sel = { type: "part", id: p.id }; buildStage(); commit(); showProps();
    var plugged = !C.PARTS[k.type].board && C.worldTerms(p).every(function (t) { return lastRes && lastRes.legs[t.key]; });
    setHint(C.PARTS[k.type].board ? "Drag it to where you want it." : plugged ? "Plugged in! The leg dots are green. Hover over a leg to learn what it is." : "Not plugged in yet. Drag it so its legs go into the breadboard holes (the leg dots turn green).");
  }
  var pal = null;
  function paletteDown(e) {
    if (e.button !== undefined && e.button !== 0) return; e.preventDefault();
    var kind = e.currentTarget.getAttribute("data-add"), k = partProps(kind), ns = "http://www.w3.org/2000/svg";
    var ghost = document.createElementNS(ns, "svg"); ghost.setAttribute("style", "position:fixed;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;z-index:300;opacity:.9");
    var tmp = { id: "ghost", type: k.type, x: 0, y: 0, rot: 0, props: k.props };
    ghost.innerHTML = '<g class="ghostg">' + R.partGroup(tmp) + "</g>"; document.body.appendChild(ghost);
    pal = { kind: kind, ghost: ghost, sx: e.clientX, sy: e.clientY, moved: false, type: k.type };
    paletteMove(e); document.addEventListener("pointermove", paletteMove); document.addEventListener("pointerup", paletteUp); document.addEventListener("pointercancel", paletteCancel);
    hideTip();
  }
  function paletteMove(e) {
    if (!pal) return; if (Math.abs(e.clientX - pal.sx) + Math.abs(e.clientY - pal.sy) > 6) pal.moved = true;
    var z = view.z; pal.ghost.firstChild.setAttribute("transform", "translate(" + e.clientX + " " + e.clientY + ") scale(" + z + ")");
    var r = stage.getBoundingClientRect(), over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (over && !C.PARTS[pal.type].board) {
      var w = toWorld(e), h = C.nearestBoardTerm(project, w.x, w.y, 16, null); overlay.snap = h ? { x: h.x, y: h.y } : null;
    } else overlay.snap = null;
    drawOverlay();
  }
  function paletteEnd() { document.removeEventListener("pointermove", paletteMove); document.removeEventListener("pointerup", paletteUp); document.removeEventListener("pointercancel", paletteCancel); if (pal && pal.ghost.parentNode) pal.ghost.parentNode.removeChild(pal.ghost); overlay.snap = null; drawOverlay(); }
  function paletteUp(e) {
    var p = pal; paletteEnd(); pal = null; if (!p) return;
    var r = stage.getBoundingClientRect(), over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!p.moved) { setHint("To add a " + (KIND_NAME[p.kind] || "part") + ": click it, HOLD the mouse button, and drag it onto the canvas. Let go over the breadboard."); return; }
    if (!over) { setHint("Let go over the canvas to place the part. Try again."); return; }
    if (sim.running) { sim.stop(); }
    var w = toWorld(e); placePart(p.kind, w.x, w.y);
  }
  function paletteCancel() { paletteEnd(); pal = null; }
  document.querySelectorAll("[data-add]").forEach(function (b) { b.addEventListener("pointerdown", paletteDown); b.addEventListener("click", function (e) { e.preventDefault(); }); b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHint("To add a " + (KIND_NAME[b.getAttribute("data-add")] || "part") + ": click it, HOLD the mouse button, and drag it onto the canvas."); } }); });

  /* ---- hover help: what is this leg, pin or hole? (positive, negative, or neither) */
  var PWM_PINS = { 3: 1, 5: 1, 6: 1, 9: 1, 10: 1, 11: 1 };
  function ohmsWords(o) { return C.ohmsText(o) + " ohms"; }
  function termInfo(t) {
    var p = partById(t.part); if (!p) return null; var id = t.id;
    switch (p.type) {
      case "led":
        if (id === "A") return { t: "LED anode", pol: "+", d: "The LONGER, bent leg. Current flows IN here, so connect it toward the positive side (a pin or 5V), with a resistor in the path." };
        return { t: "LED cathode", pol: "-", d: "The SHORTER, straight leg (next to the flat edge of the LED). Current flows OUT here, so connect it toward GND." };
      case "resistor": return { t: "Resistor leg", pol: null, d: "Resistors have NO polarity: either leg can go either way. This one is " + ohmsWords(+p.props.ohms || 220) + ". It limits how much current flows." };
      case "button":
        return { t: "Pushbutton leg", pol: null, d: "No polarity. The two legs on the same side are always connected to each other. Pressing the button connects the top pair to the bottom pair, so place it across the center gap." };
      case "buzzer":
        if (id === "P") return { t: "Buzzer positive leg", pol: "+", d: "The + leg. Connect it to an Arduino pin, then play it with tone(pin, 440)." };
        return { t: "Buzzer negative leg", pol: "-", d: "The - leg. Connect it to GND." };
      case "uno": return unoPinInfo(id);
      case "breadboard": return boardHoleInfo(t);
    }
    return null;
  }
  function unoPinInfo(id) {
    var n = C.pinNumber(id);
    if (n !== null && n < 14) { var x = "Digital pin " + n + ". Can be an INPUT or an OUTPUT: use pinMode(" + n + ", OUTPUT) in setup()."; if (PWM_PINS[n]) x += " The ~ means it also does PWM: analogWrite(" + n + ", 0 to 255) can dim an LED."; if (n < 2) x += " Pins 0 and 1 are also used for the Serial Monitor, so avoid them when you use Serial."; return { t: "Pin D" + n, pol: null, d: x }; }
    if (n !== null) return { t: "Pin A" + (n - 14), pol: null, d: "Analog input " + "A" + (n - 14) + ". analogRead(A" + (n - 14) + ") returns 0 to 1023 for 0 to 5 volts. It can also be used as a digital pin." };
    if (/^GND/.test(id)) return { t: "GND (ground)", pol: "-", d: "Ground: 0 volts, the NEGATIVE side of your circuit. All GND pins are connected together. Every circuit needs a path back to GND." };
    if (id === "5V") return { t: "5V power", pol: "+", d: "A steady 5 volts: the POSITIVE supply. Use it to power parts, or to feed a pull-up." };
    if (id === "3V3") return { t: "3.3V power", pol: "+", d: "A steady 3.3 volts (positive). Not needed for the parts in this editor." };
    if (id === "VIN") return { t: "VIN", pol: "+", d: "The voltage that comes in from the power plug or battery (positive). Leave it alone for now." };
    if (id === "AREF") return { t: "AREF", pol: null, d: "Analog reference voltage. You will not need it in this editor." };
    if (id === "RESET") return { t: "RESET", pol: null, d: "Connect to GND to restart the program (like the red reset button)." };
    if (id === "IOREF") return { t: "IOREF", pol: null, d: "Tells shields what voltage the board uses. Not needed here." };
    if (id === "SDA" || id === "SCL") return { t: id, pol: null, d: "Used by I2C sensors and displays. Not needed in this editor." };
    return { t: "Not connected", pol: null, d: "This pin is not used." };
  }
  function boardHoleInfo(t) {
    var m = /^col(\d+)(u|l)$/.exec(t.strip || "");
    if (m) return { t: "Breadboard hole (column " + m[1] + ", row " + t.id.slice(-1) + ")", pol: null, d: "These 5 holes are connected under the board: column " + m[1] + ", rows " + (m[2] === "u" ? "a to e" : "f to j") + ". Anything plugged into one of them is connected to the other four. The center gap keeps the top and bottom halves apart." };
    if (/^rail(TP|BP)$/.test(t.strip || "")) return { t: "Power rail (+)", pol: "+", d: "Every hole in this long red row is connected. Connect it to 5V and use it for the positive side of many parts." };
    return { t: "Ground rail (-)", pol: "-", d: "Every hole in this long blue row is connected. Connect it to GND and use it for the negative side of many parts." };
  }
  var PART_BODY = {
    led: { t: "LED (light emitting diode)", d: "Lights up when current flows in the anode (+, long leg) and out the cathode (-, short leg). It has two legs that are NOT the same, so check the order. Always use a resistor." },
    resistor: { t: "Resistor", d: "Limits the current. No polarity. The colored bands tell the value." },
    button: { t: "Pushbutton", d: "A switch you hold down. While the simulation runs, click and hold it to press it." },
    buzzer: { t: "Piezo buzzer", d: "Makes a sound when a pin plays a tone: tone(pin, 440). Has a + leg and a - leg." },
    uno: { t: "Arduino Uno", d: "The brain. Your code runs here. The orange L light is pin 13. Hover over the pins to learn what they do." },
    breadboard: { t: "Breadboard", d: "Plug parts into the holes and they connect without soldering. Holes in a column of 5 are connected, and the long power rails run along the top and bottom." }
  };
  var UNO_PARTS = {
    usb: { t: "USB-B port", d: "Plug a USB cable in here. It powers the board (5V) AND carries your program and Serial Monitor text to your computer. In this simulator it is already plugged in.", pol: null },
    jack: { t: "Barrel jack (DC power)", d: "Power the Uno from a wall adapter or battery pack, 7 to 12 volts. Use it when the board is not connected to a computer. The Vin pin connects to this input.", pol: null },
    chip: { t: "ATmega328P microcontroller", d: "The brain of the Uno. It stores your sketch and runs it, one line at a time, over and over in loop(). It has 32 KB of program memory and 2 KB for variables.", pol: null },
    usbchip: { t: "ATmega16U2 (USB chip)", d: "A second, small chip that translates between USB and the main chip's Serial pins (0 and 1). It is why Serial.print shows up on your computer.", pol: null },
    usbxtal: { t: "16 MHz crystal (USB chip)", d: "A tiny quartz crystal that vibrates 16 million times a second. It gives the USB chip a steady clock.", pol: null },
    xtal: { t: "16 MHz crystal (main chip)", d: "The Uno's heartbeat. The ATmega328P ticks 16 million times a second to this crystal, which is how delay() and millis() keep time.", pol: null },
    fuse: { t: "Resettable fuse (polyfuse)", d: "Protects your computer's USB port. If more than about 500 mA flows, it heats up and cuts the current, then resets itself when it cools.", pol: null },
    caps: { t: "Capacitors", d: "Little energy tanks that smooth out the power so the voltage stays steady even when a part suddenly pulls current.", pol: null },
    reg5: { t: "5V voltage regulator", d: "Turns the 7 to 12 volts from the barrel jack into a steady 5 volts for the chip and your circuit.", pol: null },
    reg33: { t: "3.3V voltage regulator", d: "Makes the 3.3 volts that comes out of the 3.3V pin, for parts that cannot handle 5V.", pol: null },
    diode: { t: "Protection diode", d: "A one-way street for current. It stops power from flowing backwards into the barrel jack and damaging the board.", pol: null },
    reset: { t: "Reset button", d: "Press it to restart your program from the very start of setup(). It briefly connects the RESET pin to GND.", pol: null },
    ledl: { t: "L light (pin 13)", d: "A small orange LED wired to digital pin 13. It lights up when your code sets pin 13 HIGH, which is why the basic Blink example works with no parts at all.", pol: null },
    ledtx: { t: "TX light", d: "Blinks when the Uno is TRANSMITTING (sending) data to the computer, like Serial.print.", pol: null },
    ledrx: { t: "RX light", d: "Blinks when the Uno is RECEIVING data from the computer, like when you upload a program.", pol: null },
    ledon: { t: "ON light (power)", d: "Green when the board has power. If it is off, nothing will run.", pol: null },
    icsp: { t: "ICSP header (main chip)", d: "In-Circuit Serial Programming. A 6-pin port that talks straight to the ATmega328P, used to load a new bootloader or program the chip without USB. Not needed in this class.", pol: null },
    icsp2: { t: "ICSP header (USB chip)", d: "A 6-pin port that talks to the ATmega16U2 USB chip, used to update its firmware. Not needed in this class.", pol: null }
  };
  [["miso", "MISO", "Master In Slave Out: data coming from the chip.", null], ["5v", "5V", "Power. Connected to the Uno's 5V.", "+"], ["sck", "SCK", "Serial Clock: the beat that keeps the data in step.", null], ["mosi", "MOSI", "Master Out Slave In: data going to the chip.", null], ["reset", "RESET", "Pulling this low restarts the chip.", null], ["gnd", "GND", "Ground (0 volts).", "-"]].forEach(function (p) {
    UNO_PARTS["icsp-" + p[0]] = { t: "ICSP pin: " + p[1], d: p[2], pol: p[3] }; UNO_PARTS["icsp2-" + p[0]] = { t: "ICSP pin: " + p[1] + " (USB chip)", d: p[2], pol: p[3] };
  });
  var ttEl = $("tt");
  function showTip(info, cx, cy) {
    if (!info) { hideTip(); return; }
    var pol = info.pol === "+" ? '<span class="pol plus">POSITIVE (+)</span>' : info.pol === "-" ? '<span class="pol minus">NEGATIVE (&minus;)</span>' : (info.pol === null && info.nopol !== false && info.showNone ? '<span class="pol none">no polarity</span>' : "");
    ttEl.innerHTML = "<b>" + esc(info.t) + "</b> " + pol + "<br>" + esc(info.d) + (info.live ? '<br><i class="live">' + esc(info.live) + "</i>" : "");
    ttEl.className = "show"; var w = ttEl.offsetWidth, h = ttEl.offsetHeight, x = cx + 16, y = cy + 18;
    if (x + w > window.innerWidth - 8) x = cx - w - 14; if (y + h > window.innerHeight - 8) y = cy - h - 14; ttEl.style.left = Math.max(6, x) + "px"; ttEl.style.top = Math.max(6, y) + "px";
  }
  function hideTip() { ttEl.className = ""; }
  function hoverInfo(w, e) {
    var n = nearestTerm(w, Math.max(5, 7 / view.z)), t = n.part || (n.board && (partById(n.board.part) || {}).type === "uno" ? n.board : null);
    if (t) {
      var info = termInfo(t); if (info) { info = Object.assign({}, info); var p = partById(t.part);
        if (p && p.type === "led" && lastRes && lastRes.leds[p.id] && sim.running) info.live = lastRes.leds[p.id].blown ? "This LED is burned out." : "Right now: " + lastRes.leds[p.id].current.toFixed(1) + " mA flows through this LED.";
        if (p && p.type === "resistor") info.showNone = true; if (p && p.type === "button") info.showNone = true; if (p && p.type === "uno" && info.pol === null) info.showNone = false;
        return { info: info, pt: t }; }
    }
    var up = e.target.closest ? e.target.closest("[data-uno-part]") : null; if (up && UNO_PARTS[up.getAttribute("data-uno-part")]) return { info: Object.assign({}, UNO_PARTS[up.getAttribute("data-uno-part")]), pt: null };
    var partEl = e.target.closest ? e.target.closest(".part") : null;
    if (partEl) { var pp = partById(partEl.getAttribute("data-id")); if (pp && pp.type !== "breadboard" && PART_BODY[pp.type]) return { info: Object.assign({}, PART_BODY[pp.type], pp.type === "resistor" ? { t: "Resistor (" + ohmsWords(+pp.props.ohms || 220) + ")" } : {}), pt: null }; }
    return null;
  }
  function selectedPart() { return sel && sel.type === "part" ? partById(sel.id) : null; }
  function deleteSel() {
    if (!sel) return;
    if (sel.type === "part") {
      var p = partById(sel.id); if (!p) return; if (p.type === "uno") { setHint("The Arduino can not be deleted."); return; }
      project.parts = project.parts.filter(function (x) { return x.id !== p.id; });
      project.wires = project.wires.filter(function (w) { return w.a.term.split(":")[0] !== p.id && w.b.term.split(":")[0] !== p.id; });
    } else project.wires = project.wires.filter(function (w) { return w.id !== sel.id; });
    sel = null; buildStage(); commit(); showProps();
  }
  $("delete").onclick = deleteSel;
  function rotateSel() { var p = selectedPart(); if (!p || C.PARTS[p.type].board) return; p.rot = ((p.rot || 0) + 1) % 4; snapPart(p); buildStage(); commit(); showProps(); }
  $("rotate").onclick = rotateSel;
  $("clearc").onclick = function () { if (!project.parts.some(function (p) { return !C.PARTS[p.type].board; }) && !project.wires.length) return; if (!confirm("Remove all your parts and wires and start the circuit over?")) return; if (sim.running) sim.stop(); project = defaultProject(); sel = null; buildStage(); commit(); fitView(); showProps(); };
  function snapPart(p) {
    if (C.PARTS[p.type].board) return;
    var t0 = C.worldTerms(p)[0], h = C.nearestBoardTerm(project, t0.x, t0.y, 16, p.id);
    if (h) { p.x += h.x - t0.x; p.y += h.y - t0.y; }
  }
  function attachedTo(board) {
    var set = []; var bt = C.worldTerms(board);
    project.parts.forEach(function (p) { if (C.PARTS[p.type].board) return; if (C.worldTerms(p).some(function (t) { return bt.some(function (h) { return Math.abs(h.x - t.x) < 2 && Math.abs(h.y - t.y) < 2; }); })) set.push(p); });
    return set;
  }

  /* ------------------------------------------------------------------ the canvas: pointer interaction */
  var drag = null;
  function nearestTerm(w, maxD) {
    var best = null, bd = maxD * maxD, board = null, bb = maxD * maxD, i, t, d;
    for (i = 0; i < termCache.length; i++) {
      t = termCache[i]; d = (t.x - w.x) * (t.x - w.x) + (t.y - w.y) * (t.y - w.y);
      if (d <= bd) { var isBoard = C.PARTS[partById(t.part).type].board; if (isBoard) { if (d < bb) { bb = d; board = t; } } else if (!best || d < bd) { bd = d; best = t; } }
    }
    return { part: best, board: board };
  }
  stage.addEventListener("pointerdown", function (e) {
    hideTip(); if (e.button === 2) return; stage.setPointerCapture(e.pointerId); var w = toWorld(e), tgt = e.target, z = 1 / view.z;
    ensureAudio();
    var wh = tgt.closest ? tgt.closest("[data-whandle]") : null;
    if (wh && sel && sel.type === "wire") { drag = { kind: "wend", id: sel.id, end: wh.getAttribute("data-whandle") }; return; }
    var wireEl = tgt.closest ? tgt.closest(".wire") : null;
    var near = nearestTerm(w, wireEl ? 4 * z : 6 * z);
    var partEl0 = tgt.closest ? tgt.closest(".part") : null, part0 = partEl0 ? partById(partEl0.getAttribute("data-id")) : null;
    /* a free hole or pin starts a wire (but not when you grab the body of a part sitting on top of it) */
    if (near.board && !near.part && !(part0 && !C.PARTS[part0.type].board && !wireEl)) { drag = { kind: "wire", from: near.board.key, start: { x: near.board.x, y: near.board.y } }; sel = null; drawOverlay(); showProps(); return; }
    var partEl = tgt.closest ? tgt.closest(".part") : null;
    if (partEl && !(wireEl)) {
      var p = partById(partEl.getAttribute("data-id")); if (!p) return;
      if (p.type === "button" && sim.running) { drag = { kind: "press", id: p.id }; sim.press(p.id, true); refreshVisualsSoon(); return; }
      sel = { type: "part", id: p.id }; showProps(); drawOverlay();
      if (sim.running) { setHint("Stop the simulation to move parts. You can still add wires and press buttons."); drag = { kind: "none" }; return; }
      var group = [{ id: p.id, ox: p.x, oy: p.y }];
      if (C.PARTS[p.type].board) attachedTo(p).forEach(function (a) { group.push({ id: a.id, ox: a.x, oy: a.y }); });
      drag = { kind: "part", id: p.id, sx: w.x, sy: w.y, group: group, moved: false }; return;
    }
    if (wireEl) { sel = { type: "wire", id: wireEl.getAttribute("data-wire") }; drawOverlay(); showProps(); drag = { kind: "none" }; return; }
    sel = null; drawOverlay(); showProps();
    drag = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; stage.classList.add("panning");
  });
  var pressRefresh; function refreshVisualsSoon() { sim.markDirty(); }
  stage.addEventListener("pointermove", function (e) {
    var w = toWorld(e);
    if (!drag) { var hv = pal ? null : hoverInfo(w, e); overlay.hover = hv && hv.pt ? { x: hv.pt.x, y: hv.pt.y, pol: hv.info.pol } : null; drawOverlay(); if (hv) showTip(hv.info, e.clientX, e.clientY); else hideTip(); return; }
    hideTip();
    if (drag.kind === "pan") { view.x = drag.vx + (e.clientX - drag.sx); view.y = drag.vy + (e.clientY - drag.sy); applyView(); }
    else if (drag.kind === "part") {
      var dx = w.x - drag.sx, dy = w.y - drag.sy; if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 3 / view.z) return; drag.moved = true;
      drag.group.forEach(function (g) { var p = partById(g.id); p.x = g.ox + dx; p.y = g.oy + dy; var el = stage.querySelector("#p-" + p.id); if (el) el.setAttribute("transform", R.attrT(p)); });
      var main = partById(drag.id); if (!C.PARTS[main.type].board) { var t0 = C.worldTerms(main)[0], h2 = C.nearestBoardTerm(project, t0.x, t0.y, 16, main.id); overlay.snap = h2 ? { x: h2.x, y: h2.y } : null; } else overlay.snap = null;
      renderWires(); drawOverlay();
    } else if (drag.kind === "wire") {
      var n2 = nearestTerm(w, Math.max(7, 8 / view.z)), tgt2 = n2.board || n2.part;
      overlay.hover = tgt2 ? { x: tgt2.x, y: tgt2.y } : null; overlay.wirePreview = { a: drag.start, b: tgt2 ? { x: tgt2.x, y: tgt2.y } : w }; drawOverlay();
      setHint(tgt2 ? "Let go to connect the wire here" : "Drag to a pin or hole, then let go");
    } else if (drag.kind === "wend") {
      var wr = wireById(drag.id), n3 = nearestTerm(w, Math.max(7, 8 / view.z)), t3 = n3.board || n3.part, other = R.termPos(project, wr[drag.end === "a" ? "b" : "a"].term);
      overlay.hover = t3 ? { x: t3.x, y: t3.y } : null; overlay.wirePreview = { a: other, b: t3 ? { x: t3.x, y: t3.y } : w }; drawOverlay();
    }
  });
  function endDrag(e) {
    if (!drag) return; var d = drag; drag = null; stage.classList.remove("panning"); var w = toWorld(e);
    if (d.kind === "part") {
      if (d.moved) {
        var p = partById(d.id); if (!C.PARTS[p.type].board) snapPart(p); overlay.snap = null;
        d.group.forEach(function (g) { var q = partById(g.id); q.x = Math.round(q.x * 100) / 100; q.y = Math.round(q.y * 100) / 100; });
        buildStage(); commit(); showProps();
      }
    } else if (d.kind === "wire") {
      var n = nearestTerm(w, Math.max(7, 8 / view.z)), t = n.board || n.part; overlay.wirePreview = null; overlay.hover = null;
      if (t && t.key !== d.from) {
        var dupe = project.wires.some(function (x) { return (x.a.term === d.from && x.b.term === t.key) || (x.b.term === d.from && x.a.term === t.key); });
        if (!dupe) { var nw = { id: nextId("w", project.wires), a: { term: d.from }, b: { term: t.key }, color: wireColor }; project.wires.push(nw); sel = { type: "wire", id: nw.id }; renderWires(); commit(); showProps(); setHint("Wire added. Click it to change its color, or press Delete to remove it."); }
      } else setHint("Wires go from one pin or hole to another. Drag and let go on a second pin or hole.");
      drawOverlay();
    } else if (d.kind === "wend") {
      var n4 = nearestTerm(w, Math.max(7, 8 / view.z)), t4 = n4.board || n4.part; overlay.wirePreview = null; overlay.hover = null;
      if (t4) { var wr = wireById(d.id); wr[d.end].term = t4.key; renderWires(); commit(); } drawOverlay();
    } else if (d.kind === "press") { sim.press(d.id, false); }
  }
  stage.addEventListener("pointerup", endDrag); stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("pointerleave", function () { hideTip(); if (!drag) { overlay.hover = null; drawOverlay(); } });
  stage.addEventListener("wheel", function (e) {
    e.preventDefault(); var r = stage.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, f = e.deltaY < 0 ? 1.12 : 1 / 1.12, nz = Math.max(0.25, Math.min(4, view.z * f));
    view.x = mx - (mx - view.x) * (nz / view.z); view.y = my - (my - view.y) * (nz / view.z); view.z = nz; applyView();
  }, { passive: false });
  function zoomBy(f) { var r = stage.getBoundingClientRect(), mx = r.width / 2, my = r.height / 2, nz = Math.max(0.25, Math.min(4, view.z * f)); view.x = mx - (mx - view.x) * (nz / view.z); view.y = my - (my - view.y) * (nz / view.z); view.z = nz; applyView(); }
  $("zin").onclick = function () { zoomBy(1.2); }; $("zout").onclick = function () { zoomBy(1 / 1.2); };
  function fitView() {
    var r = stage.getBoundingClientRect(); if (!r.width) return; var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    project.parts.forEach(function (p) { var b = bboxWorld(p); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y - 20); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); });
    if (x1 < x0) return; var z = Math.min(2, Math.max(0.3, Math.min((r.width - 40) / (x1 - x0), (r.height - 40) / (y1 - y0))));
    view.z = z; view.x = (r.width - (x1 - x0) * z) / 2 - x0 * z; view.y = (r.height - (y1 - y0) * z) / 2 - y0 * z; applyView();
  }
  $("zfit").onclick = fitView;
  window.addEventListener("resize", function () { /* keep the view */ });
  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || ""; if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;
    if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); deleteSel(); }
    else if (e.key === "r" || e.key === "R") rotateSel();
    else if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); }
    else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) { e.preventDefault(); doRedo(); }
    else if (e.key === "Escape") { sel = null; drag = null; overlay.wirePreview = null; drawOverlay(); showProps(); }
  });

  /* ------------------------------------------------------------------ properties under the canvas */
  function showProps() {
    var h = "", box = $("props"), p = selectedPart(), w = sel && sel.type === "wire" ? wireById(sel.id) : null;
    function swatches(map, cur, attr) { return Object.keys(map).map(function (k) { return '<button type="button" class="sw' + (k === cur ? " on" : "") + '" style="background:' + map[k] + '" data-' + attr + '="' + k + '" title="' + k + '"></button>'; }).join(""); }
    if (p && p.type === "led") h = "<b>LED</b> color: " + swatches(R.LED_COLORS, p.props.color || "red", "ledc") + ' <span style="color:var(--soft)">The long leg (+) goes toward power. Always use a resistor with an LED.</span>';
    else if (p && p.type === "resistor") h = "<b>Resistor</b> value: <select id=\"ohms\">" + C.RESISTOR_VALUES.map(function (v) { return '<option value="' + v + '"' + (v === (+p.props.ohms || 220) ? " selected" : "") + ">" + C.ohmsText(v) + " ohms</option>"; }).join("") + '</select> &nbsp; Legs <button type="button" class="btn sm" id="spanM">&minus;</button> <b>' + (Math.max(3, Math.min(12, Math.round(+p.props.span || 4)))) + '</b> holes apart <button type="button" class="btn sm" id="spanP">+</button> <span style="color:var(--soft)">220 ohms is a good size for an LED. Spread the legs to reach a rail or another column.</span>';
    else if (p && p.type === "button") h = "<b>Pushbutton</b> <span style=\"color:var(--soft)\">Put it across the center gap of the breadboard. While the simulation runs, click and hold it to press it.</span>";
    else if (p && p.type === "buzzer") h = "<b>Piezo buzzer</b> <span style=\"color:var(--soft)\">Connect one leg to a pin and the other to GND, then use tone(pin, 440); in your code. Turn up your speakers!</span>";
    else if (p && p.type === "breadboard") h = "<b>Breadboard</b> <span style=\"color:var(--soft)\">The 5 holes in each column (a to e, or f to j) are connected. The long rows at the top and bottom are power rails: each whole row is connected.</span>";
    else if (p && p.type === "uno") h = "<b>Arduino Uno</b> <span style=\"color:var(--soft)\">Drag from any pin to a breadboard hole to make a wire. The orange L light shows pin 13.</span>";
    else if (w) h = "<b>Wire</b> color: " + swatches(R.WIRE_COLORS, w.color || "green", "wirec") + ' <span style="color:var(--soft)">Drag the blue end dots to move an end. Press Delete to remove it.</span>';
    else h = '<span style="color:var(--soft)">Click a part or a wire to change it. To make a wire, <b>drag from a pin or hole</b> to another pin or hole. Scroll to zoom, drag the background to move around.</span>';
    box.innerHTML = h;
    box.querySelectorAll("[data-ledc]").forEach(function (b) { b.onclick = function () { p.props.color = b.getAttribute("data-ledc"); buildStage(); commit(); showProps(); }; });
    box.querySelectorAll("[data-wirec]").forEach(function (b) { b.onclick = function () { w.color = b.getAttribute("data-wirec"); wireColor = w.color; renderWires(); commit(); showProps(); }; });
    function spanBy(d) { p.props.span = Math.max(3, Math.min(12, (Math.round(+p.props.span || 4)) + d)); snapPart(p); buildStage(); commit(); showProps(); }
    var sm = $("spanM"), spn = $("spanP"); if (sm) sm.onclick = function () { spanBy(-1); }; if (spn) spn.onclick = function () { spanBy(1); };
    var oh = $("ohms"); if (oh) oh.onchange = function () { p.props.ohms = +oh.value; buildStage(); commit(); showProps(); };
  }

  /* ------------------------------------------------------------------ the code editor */
  var ta = $("ta"), hlEl = $("hl"), gut = $("gut"), marksIn = $("marksIn");
  var KW = "void int long float double bool boolean byte char short unsigned signed const static volatile String word if else for while do switch case default break continue return true false HIGH LOW INPUT OUTPUT INPUT_PULLUP LED_BUILTIN";
  var FN = "setup loop pinMode digitalWrite digitalRead analogRead analogWrite delay delayMicroseconds millis micros tone noTone random randomSeed map constrain min max abs pow sqrt sq sin cos tan Serial begin print println available read parseInt write";
  var KWS = {}, FNS = {}; KW.split(" ").forEach(function (w) { KWS[w] = 1; }); FN.split(" ").forEach(function (w) { FNS[w] = 1; });
  var TOKRE = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(#[^\n]*)|\b(0[xX][0-9a-fA-F]+|0[bB][01]+|\d+\.?\d*(?:[eE][-+]?\d+)?[uUlLfF]*)\b|([A-Za-z_]\w*)/g;
  function highlight(code) {
    return esc(code).replace(/(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(#[^\n]*)|\b(0[xX][0-9a-fA-F]+|0[bB][01]+|\d+\.?\d*(?:[eE][-+]?\d+)?[uUlLfF]*)\b|\b([A-Za-z_]\w*)\b/g, function (m, cm, str, pre, num, id) {
      if (cm) return '<span class="c">' + cm + "</span>"; if (str) return '<span class="s">' + str + "</span>"; if (pre) return '<span class="q">' + pre + "</span>"; if (num) return '<span class="n">' + num + "</span>";
      if (id) { if (KWS[id]) return '<span class="k">' + id + "</span>"; if (FNS[id]) return '<span class="f">' + id + "</span>"; } return m;
    }) + "\n";
  }
  var errLines = {};
  function paintEditor() {
    var v = ta.value, n = v.split("\n").length, g = "", i;
    hlEl.innerHTML = highlight(v);
    for (i = 1; i <= n; i++) g += (errLines[i] === "e" ? "<b>" + i + "</b>" : i) + "\n";
    gut.innerHTML = g; gut.style.width = Math.max(38, String(n).length * 9 + 22) + "px";
    var m = ""; Object.keys(errLines).forEach(function (l) { m += '<div class="' + (errLines[l] === "w" ? "w" : "") + '" style="top:' + (10 + (l - 1) * 20) + 'px"></div>'; });
    marksIn.innerHTML = m; syncScroll();
  }
  function syncScroll() { hlEl.scrollTop = ta.scrollTop; hlEl.scrollLeft = ta.scrollLeft; gut.scrollTop = ta.scrollTop; marksIn.style.top = -ta.scrollTop + "px"; }
  ta.addEventListener("scroll", syncScroll);
  ta.addEventListener("input", function () { paintEditor(); lsSet("code:" + slot, ta.value); lsSet("ct:" + slot, String(Date.now())); compileSoon(); scheduleEval(); cloudSoon(); });
  ta.addEventListener("keydown", function (e) {
    if (e.key === "Tab") { e.preventDefault(); ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); return; }
    if (e.key === "Enter") {
      var s = ta.selectionStart, before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf("\n") + 1), ind = /^\s*/.exec(line)[0];
      var extra = /\{\s*$/.test(line) ? "  " : ""; e.preventDefault();
      var after = ta.value.slice(ta.selectionEnd), closeNow = extra && /^\s*\}/.test(after);
      ta.setRangeText("\n" + ind + extra + (closeNow ? "\n" + ind : ""), s, ta.selectionEnd, "end"); if (closeNow) { var pos = s + 1 + ind.length + extra.length; ta.setSelectionRange(pos, pos); }
      ta.dispatchEvent(new Event("input")); return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault(); var v = ta.value, a = ta.selectionStart, b = ta.selectionEnd, ls = v.lastIndexOf("\n", a - 1) + 1, le = v.indexOf("\n", b); if (le < 0) le = v.length;
      var lines = v.slice(ls, le).split("\n"), all = lines.every(function (l) { return /^\s*\/\//.test(l) || !l.trim(); });
      var out = lines.map(function (l) { return all ? l.replace(/^(\s*)\/\/ ?/, "$1") : (l.trim() ? l.replace(/^(\s*)/, "$1// ") : l); }).join("\n");
      ta.setRangeText(out, ls, le, "select"); ta.dispatchEvent(new Event("input"));
    }
  });
  var compT; function compileSoon() { clearTimeout(compT); compT = setTimeout(function () { var r = ArduinoCompiler.compile(ta.value); if (!sim.running || !r.ok) showCompile(r, true); }, 600); }
  function showCompile(r, quiet) {
    var box = $("errbox"); errLines = {};
    if (!r.ok) {
      var h = r.errors.map(function (e) { errLines[e.line] = "e"; return "<b>Line " + e.line + ":</b> " + esc(e.msg); }).join("<br>"); box.innerHTML = "&#10060; " + h; box.className = "show";
    } else if (r.warnings && r.warnings.length) {
      box.innerHTML = "&#9888;&#65039; " + r.warnings.map(function (e) { errLines[e.line] = "w"; return "<b>Line " + e.line + ":</b> " + esc(e.msg); }).join("<br>"); box.className = "show warnmsg";
    } else { box.className = ""; box.innerHTML = ""; }
    paintEditor();
  }
  function showRuntimeError(e) { var box = $("errbox"); errLines = {}; errLines[e.line] = "e"; box.innerHTML = "&#10060; <b>Your program stopped at line " + e.line + ":</b> " + esc(e.msg); box.className = "show"; paintEditor(); }
  $("starter").onclick = function () { if (ta.value.trim() && ta.value !== STARTER && !confirm("Replace your code with a blank sketch?")) return; ta.value = STARTER; ta.dispatchEvent(new Event("input")); };

  /* serial monitor */
  var outBuf = "", outT;
  function appendOut(t) {
    serialBlink = Date.now(); outBuf += t; if (outT) return;
    outT = setTimeout(function () { outT = null; var o = $("out"), near = o.scrollHeight - o.scrollTop - o.clientHeight < 40; o.textContent += outBuf; outBuf = ""; if (o.textContent.length > 60000) o.textContent = o.textContent.slice(-40000); if (near) o.scrollTop = o.scrollHeight; }, 40);
  }
  $("clearOut").onclick = function () { $("out").textContent = ""; };
  function sendSerial() { var i = $("serIn"); if (!i.value && !sim.running) return; if (!sim.running) { toast("Start the simulation first."); return; } sim.sendSerial(i.value + "\n"); appendOut("> " + i.value + "\n"); i.value = ""; }
  $("serSend").onclick = sendSerial; $("serIn").addEventListener("keydown", function (e) { if (e.key === "Enter") sendSerial(); });

  /* ------------------------------------------------------------------ help bubbles and the help pop-up */
  var TIPS = window.ARD_TIPS || { topics: {}, order: [], cats: [] }, tipStack = [];
  function fmtText(t) { return esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); }
  function inlineBubbles(html) { return String(html).replace(/\[\[([^|\]]+)\|([a-z0-9-]+)\]\]/g, function (m, label, id) { return TIPS.topics[id] ? '<button type="button" class="tipbtn" data-tip="' + id + '">' + label + "</button>" : label; }); }
  function pillsHTML(ids) {
    var seen = {}, out = ""; (ids || []).forEach(function (id) { if (!TIPS.topics[id] || seen[id]) return; seen[id] = 1; out += '<button type="button" class="tipbtn" data-tip="' + id + '">&#128161; ' + esc(TIPS.topics[id].title) + "</button>"; });
    return out;
  }
  function sectionHTML(s) {
    if (s.p) return "<p>" + fmtText(s.p) + "</p>";
    if (s.ex) return '<pre class="tipcode">' + esc(s.ex.join("\n")) + "</pre>";
    if (s.anno) return '<table class="annot">' + s.anno.map(function (r) { return '<tr><td><code class="cl">' + esc(r[0]) + "</code></td><td>" + fmtText(r[1]) + "</td></tr>"; }).join("") + "</table>";
    if (s.list) return "<ul>" + s.list.map(function (x) { return "<li>" + fmtText(x) + "</li>"; }).join("") + "</ul>";
    if (s.steps) return "<ol>" + s.steps.map(function (x) { return "<li>" + fmtText(x) + "</li>"; }).join("") + "</ol>";
    if (s.rows) return '<table class="tiptbl">' + (s.head ? "<thead><tr>" + s.head.map(function (h) { return "<th>" + fmtText(h) + "</th>"; }).join("") + "</tr></thead>" : "") + "<tbody>" + s.rows.map(function (r) { return "<tr>" + r.map(function (c, i) { return (i === 0 ? "<td><b>" : "<td>") + fmtText(c) + (i === 0 ? "</b>" : "") + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table>";
    if (s.good) return '<div class="tipgood">&#128161; ' + fmtText(s.good) + "</div>";
    if (s.warn) return '<div class="tipwarn">&#9888;&#65039; ' + fmtText(s.warn) + "</div>";
    if (s.svg) return '<div class="tipsvg">' + s.svg + "</div>";
    if (s.href) return '<p><a class="tipbtn" href="' + s.href[0] + '" target="_blank" rel="noopener">&#128424; ' + esc(s.href[1]) + "</a></p>";
    if (s.links) return '<div class="tiplinks"><b>Related:</b> ' + pillsHTML(s.links) + "</div>";
    return "";
  }
  function showTipModal(title, html, canBack) {
    $("tipTitle").textContent = title; $("tipBody").innerHTML = html; $("tipBack").style.display = canBack ? "" : "none";
    $("mTip").className = "modal show"; $("tipBody").scrollTop = 0;
  }
  function openTip(id, noPush) {
    var t = TIPS.topics[id]; if (!t) return;
    if (!noPush) tipStack.push({ kind: "tip", id: id });
    showTipModal(t.title, t.sections.map(sectionHTML).join("") + '<div class="tipfoot"><button type="button" class="tipbtn" id="tipAll">&#128218; All help topics</button></div>', tipStack.length > 1);
  }
  function openList(title, ids, noPush) {
    if (!noPush) tipStack.push({ kind: "list", title: title, ids: ids });
    showTipModal(title, '<div class="helplist">' + pillsHTML(ids) + '</div><div class="tipfoot"><button type="button" class="tipbtn" id="tipAll">&#128218; All help topics</button></div>', tipStack.length > 1);
  }
  function openHelpCenter(noPush) {
    if (!noPush) tipStack.push({ kind: "center" });
    var h = '<input id="tipSearch" class="tipsearch" placeholder="Search help (try: LED, button, pullup, setup, error...)" autocomplete="off"><div id="tipResults"></div>';
    showTipModal("Help center: everything you might wonder", h, tipStack.length > 1);
    function draw(q) {
      q = (q || "").toLowerCase().trim(); var out = "";
      TIPS.cats.forEach(function (c) {
        var ids = TIPS.order.filter(function (id) { var t = TIPS.topics[id]; return t.cat === c && (!q || (t.title + " " + t.keys).toLowerCase().indexOf(q) > -1); });
        if (ids.length) out += "<h4 class=\"tipcat\">" + esc(c) + '</h4><div class="helplist">' + pillsHTML(ids) + "</div>";
      });
      $("tipResults").innerHTML = out || "<p>Nothing found. Try a different word, like <i>LED</i>, <i>wire</i>, or <i>error</i>.</p>";
    }
    draw(""); $("tipSearch").addEventListener("input", function () { draw(this.value); }); setTimeout(function () { try { $("tipSearch").focus(); } catch (e) {} }, 50);
  }
  function tipBack() {
    tipStack.pop(); var prev = tipStack[tipStack.length - 1]; if (!prev) { $("mTip").className = "modal"; return; }
    if (prev.kind === "tip") openTip(prev.id, true); else if (prev.kind === "list") openList(prev.title, prev.ids, true); else openHelpCenter(true);
  }
  function closeTip() { $("mTip").className = "modal"; tipStack = []; }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-tip],[data-tiplist],#tipAll,#tipBack,#tipClose,#helpBtn,#codeGuide") : null; if (!t) { if (e.target === $("mTip")) closeTip(); return; }
    e.preventDefault();
    if (t.id === "tipAll") openHelpCenter(); else if (t.id === "tipBack") tipBack(); else if (t.id === "tipClose") closeTip();
    else if (t.id === "helpBtn") { tipStack = []; openHelpCenter(); } else if (t.id === "codeGuide") { tipStack = []; openTip("skeleton"); }
    else if (t.getAttribute("data-tiplist")) { var ids = JSON.parse(t.getAttribute("data-tiplist")); openList("Help for this step", ids); }
    else openTip(t.getAttribute("data-tip"));
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && $("mTip").className.indexOf("show") > -1) closeTip(); });

  /* ------------------------------------------------------------------ assignments and auto-checks */
  var evalT, evalSeq = 0, runCache = {}, autoState = { pct: null, passed: 0, total: 0 };
  function stripComments(c) { return c.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""); }
  function makeCtx() { return ArduinoCtx.make(project, ta.value); }
  /* ---- written answers, matching and fill-in-the-blank items are saved with the student's work */
  var ANS = {};
  function loadAns() { try { ANS = JSON.parse(lsGet("ans:" + slot) || "{}") || {}; } catch (e) { ANS = {}; } }
  function saveAns() { lsSet("ans:" + slot, JSON.stringify(ANS)); lsSet("pt:" + slot, String(Date.now())); cloudSoon(); }
  function wordCount(s) { return (String(s || "").trim().match(/\S+/g) || []).length; }
  function widgetHTML(it, k) {
    if (it.kind === "ask") {
      var v = ANS[k] || "";
      return '<textarea class="askbox" data-k="' + k + '" rows="' + (it.rows || 4) + '" placeholder="' + esc(it.ph || "Type your answer here...") + '"' + (it.mono ? ' style="font-family:JetBrains Mono,monospace"' : "") + ">" + esc(v) + '</textarea><div class="askmeta" data-meta="' + k + '">' + wordCount(v) + " / " + (it.min || 15) + " words</div>";
    }
    if (it.kind === "match") {
      var a = ANS[k] || [], h = '<div class="matchopts">' + it.options.map(function (o) { return "<div><b>" + o[0] + ".</b> " + o[1] + "</div>"; }).join("") + '</div><table class="matchtbl">';
      it.rows.forEach(function (r, i) { h += "<tr><td>" + r[0] + '</td><td><select data-k="' + k + '" data-r="' + i + '"><option value="">--</option>' + it.options.map(function (o) { return '<option value="' + o[0] + '"' + (a[i] === o[0] ? " selected" : "") + ">" + o[0] + "</option>"; }).join("") + "</select></td></tr>"; });
      return h + "</table>";
    }
    if (it.kind === "cloze") {
      var a2 = ANS[k] || [];
      return '<div class="bank">Word bank: ' + it.bank.map(esc).join(" &nbsp;|&nbsp; ") + '</div><ol class="cloze">' + it.sentences.map(function (s) {
        return "<li>" + s.replace(/\{(\d+)\}/g, function (m, n) { n = +n; return '<select class="cz" data-k="' + k + '" data-r="' + n + '"><option value="">____</option>' + it.bank.map(function (w) { return '<option value="' + esc(w) + '"' + (a2[n] === w ? " selected" : "") + ">" + esc(w) + "</option>"; }).join("") + "</select>"; }) + "</li>";
      }).join("") + "</ol>";
    }
    return "";
  }
  function markRows(el, it, k) {
    var a = ANS[k] || [], want = it.kind === "match" ? it.rows.map(function (r) { return r[1]; }) : it.answers;
    el.querySelectorAll("select[data-r]").forEach(function (s) { var i = +s.getAttribute("data-r"); s.className = (s.className || "").replace(/\b(ok|bad)\b/g, "").trim() + (a[i] ? (a[i] === want[i] ? " ok" : " bad") : ""); });
  }
  function renderAssignment() {
    var A = ASSIGN[slot], body = $("assBody"); $("assTitle").textContent = A ? A.title : "Free build";
    $("assHead").className = A ? "show" : ""; document.body.classList.toggle("free", !A);
    if (coach) { coach.reset(); coach.setExtra(A && A.events ? A.events : []); }
    if (!A) { body.innerHTML = '<p class="intro">This is a free build. Add parts, wire them up, and write code to try your own ideas. Nothing here is graded.</p><div class="hintbox"><b>How to build a circuit</b><br>1. <b>Click, hold, and drag</b> a part from the bar above the canvas onto the breadboard.<br>2. When its leg dots turn <span style="color:#22c55e">green</span>, it is plugged in. <b>Hover over any leg, pin or hole</b> to learn what it is and whether it is positive (+) or negative (&minus;).<br>3. <b>Drag from a pin or hole to another pin or hole</b> to make a wire.<br>4. Type your code on the right and click <b>Start Simulation</b>.</div><div class="helprow"><span class="helplbl">Help bubbles:</span>' + pillsHTML(["tour", "skeleton", "functions-all", "dragpart", "makewire", "startsim", "trouble"]) + "</div>"; return; }
    var h = '<p class="intro">' + inlineBubbles(A.intro) + "</p>";
    if (A.from && ASSIGN[A.from]) h += '<div class="fromrow"><button type="button" class="btn sm" id="fromPrev">&#8635; Start from my circuit and code from ' + esc(ASSIGN[A.from].short || ASSIGN[A.from].title) + "</button></div>";
    if (A.help) h += '<div class="helprow"><span class="helplbl">Start here:</span>' + pillsHTML(A.help) + "</div>";
    A.steps.forEach(function (s, si) {
      var ids = (s.help || []).slice(); s.items.forEach(function (it) { (it.help || []).forEach(function (x) { if (ids.indexOf(x) < 0) ids.push(x); }); });
      var real = ids.filter(function (x) { return TIPS.topics[x]; });
      h += "<h3>" + esc(s.h) + "</h3>";
      if (s.intro) h += '<p class="intro">' + inlineBubbles(s.intro) + "</p>";
      if (real.length) h += '<div class="helprow"><button type="button" class="helpstep" data-tiplist="' + esc(JSON.stringify(real)).replace(/"/g, "&quot;") + '">&#128161; Help for this step <small>(' + real.length + " topic" + (real.length === 1 ? "" : "s") + ")</small></button></div>";
      if (s.code) h += '<pre class="codebox">' + esc(s.code) + "</pre>";
      s.items.forEach(function (it, ii) {
        var k = si + "." + ii, info = it.kind === "note";
        h += '<div class="item' + (info ? " info" : "") + '" data-si="' + si + '" data-ii="' + ii + '"><span class="box">' + (info ? "i" : "&#10003;") + '</span><div class="txt">' + inlineBubbles(it.t) + widgetHTML(it, k) + (it.help && it.help.length ? '<span class="helprow">' + pillsHTML(it.help) + "</span>" : "") + "</div>" + (info ? "" : '<span class="badge">checking</span>') + "</div>";
      });
    });
    body.innerHTML = h;
    A.steps.forEach(function (s, si) { s.items.forEach(function (it, ii) { if (it.kind === "match" || it.kind === "cloze") { var el = body.querySelector('[data-si="' + si + '"][data-ii="' + ii + '"]'); if (el) markRows(el, it, si + "." + ii); } }); });
    var fp = $("fromPrev"); if (fp) fp.onclick = function () { copyFrom(A.from); };
    scheduleEval(true);
  }
  /* typing in an answer box or choosing a word saves it and re-checks */
  $("assBody").addEventListener("input", function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute("data-k"); if (!k) return;
    if (t.tagName === "TEXTAREA") { ANS[k] = t.value; var m = $("assBody").querySelector('[data-meta="' + k + '"]'); var A = ASSIGN[slot], p = k.split("."), it = A && A.steps[p[0]].items[p[1]]; if (m) m.textContent = wordCount(t.value) + " / " + ((it && it.min) || 15) + " words"; saveAns(); scheduleEval(); }
  });
  $("assBody").addEventListener("change", function (e) {
    var t = e.target, k = t.getAttribute && t.getAttribute("data-k"); if (!k || t.tagName !== "SELECT") return;
    var r = +t.getAttribute("data-r"); ANS[k] = ANS[k] || []; ANS[k][r] = t.value; saveAns();
    var A = ASSIGN[slot], p = k.split("."), it = A && A.steps[p[0]].items[p[1]]; if (it) markRows(t.closest(".item"), it, k); scheduleEval(true);
  });
  function copyFrom(from) {
    if (!from) return; var pj = lsGet("proj:" + from), cd = lsGet("code:" + from);
    function apply(p, c) { if (!p && !c) { toast("Nothing saved yet in that assignment."); return; } if (p && validProject(p)) project = p; if (typeof c === "string") ta.value = c; hist = [serialize()]; redo = []; sel = null; persist(); lsSet("code:" + slot, ta.value); buildStage(); fitView(); paintEditor(); showProps(); updateUndo(); compileSoon(); scheduleEval(true); toast("Copied your circuit and code."); }
    if (!isBlankWork() && !confirm("Replace what is here with your circuit and code from the earlier assignment?")) return;
    var pr = null; try { pr = pj ? JSON.parse(pj) : null; } catch (e) {}
    if (pr || cd) { apply(pr, cd); return; }
    if (CRED) api({ action: "mine", slot: from }).then(function (j) { var r = j && (j.draft || j.submission); if (r) apply(r.project, r.code); else toast("Nothing saved yet in that assignment."); });
    else toast("Nothing saved on this computer for that assignment. Sign in to load it from your account.");
  }
  function scheduleEval(now) { if (!ASSIGN[slot]) return; clearTimeout(evalT); evalT = setTimeout(evaluate, now ? 50 : 900); }
  async function evaluate() {
    var A = ASSIGN[slot]; if (!A) return; var seq = ++evalSeq, ctx = makeCtx(), passed = 0, total = 0, results = [];
    for (var si = 0; si < A.steps.length; si++) for (var ii = 0; ii < A.steps[si].items.length; ii++) {
      var it = A.steps[si].items[ii], k = si + "." + ii, ok = false, label = null;
      if (it.kind === "note") continue;
      try {
        if (it.kind === "ask") { var w = wordCount(ANS[k]); ok = w >= (it.min || 15) && (!it.test || !!it.test(ANS[k] || "", ctx)); label = w + " / " + (it.min || 15) + " words"; }
        else if (it.kind === "match") { var a = ANS[k] || [], good = it.rows.filter(function (r, i) { return a[i] === r[1]; }).length; ok = good === it.rows.length; label = good + " / " + it.rows.length + " right"; }
        else if (it.kind === "cloze") { var a3 = ANS[k] || [], g3 = it.answers.filter(function (x, i) { return a3[i] === x; }).length; ok = g3 === it.answers.length; label = g3 + " / " + it.answers.length + " right"; }
        else ok = !!(await it.check(ctx));
      } catch (e) { ok = false; }
      if (seq !== evalSeq) return; total++; if (ok) passed++; results.push([si, ii, ok, label]);
    }
    results.forEach(function (r) { var el = $("assBody").querySelector('[data-si="' + r[0] + '"][data-ii="' + r[1] + '"]'); if (!el) return; el.className = "item" + (r[2] ? " done" : ""); el.querySelector(".badge").textContent = r[3] ? (r[2] ? "done: " : "") + r[3] : (r[2] ? "auto-check: met" : "auto-check: not yet"); });
    var pct = total ? Math.floor(100 * passed / total) : 0; autoState = { pct: pct, passed: passed, total: total };
    $("assCount").innerHTML = "<b>" + passed + "</b> of " + total + " steps done"; $("assScore").innerHTML = "Auto score: <b>" + pct + " / 100</b>";
    paintLeft(A, results, passed, total);
    coachCheck(lastRes, sim && sim.io);
  }
  /* "still to do": a progress bar and one button per step that is not done yet (click it to jump to the step) */
  function plain(h) { var d = document.createElement("div"); d.innerHTML = h; return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function paintLeft(A, results, passed, total) {
    var bar = document.querySelector("#assBar i"), box = $("assLeft"); if (!box) return;
    if (bar) bar.style.width = (total ? Math.round(100 * passed / total) : 0) + "%";
    var left = results.filter(function (r) { return !r[2]; });
    if (!left.length) { box.innerHTML = '<span class="alldone">&#10003; Every step is checked off. Check your work, then Submit!</span>'; return; }
    var n = 0, nums = {}; A.steps.forEach(function (s, si) { s.items.forEach(function (it, ii) { if (it.kind !== "note") nums[si + "." + ii] = ++n; }); });
    box.innerHTML = '<div class="lt">STILL TO DO (' + left.length + "): click one to jump to it</div>" + left.map(function (r) {
      var it = A.steps[r[0]].items[r[1]], txt = plain(it.t), part = it.kind === "ask" ? "write" : it.kind === "match" || it.kind === "cloze" ? "answer" : "build";
      return '<button type="button" class="' + (it.kind ? "w" : "") + '" data-jump="' + r[0] + "." + r[1] + '" title="' + esc(txt) + '">' + nums[r[0] + "." + r[1]] + ". " + esc(part) + ": " + esc(txt.length > 56 ? txt.slice(0, 54) + "..." : txt) + "</button>";
    }).join("");
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-jump]") : null; if (!b) return; var p = b.getAttribute("data-jump").split("."), el = $("assBody").querySelector('[data-si="' + p[0] + '"][data-ii="' + p[1] + '"]');
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); }
  });

  /* ------------------------------------------------------------------ slots and local storage */
  function loadSlot(s) {
    slot = s; lsSet("slot", s); sim && sim.stop(true);
    var pj = lsGet("proj:" + s), cd = lsGet("code:" + s), pr = null; try { pr = pj ? JSON.parse(pj) : null; } catch (e) { pr = null; }
    project = validProject(pr) ? pr : defaultProject(); ta.value = cd != null ? cd : STARTER; hist = [serialize()]; redo = []; sel = null;
    loadAns(); $("out").textContent = ""; $("errbox").className = ""; errLines = {}; $("teach").className = "teach"; $("teach").innerHTML = "";
    buildStage(); fitView(); paintEditor(); showProps(); renderAssignment(); updateUndo(); status("Ready"); updatePins({ pins: {} }); $("warnbox").innerHTML = "";
    afterSlot();
  }
  function buildSlots() {
    $("slot").innerHTML = SLOTS.map(function (x) { return '<option value="' + x[0] + '">' + esc(x[1]) + (MY[x[0]] === "sub" ? " (submitted)" : MY[x[0]] === "draft" ? " (saved)" : "") + "</option>"; }).join("");
    $("slot").value = slot;
  }
  $("slot").onchange = function () { cloudSave(); loadSlot($("slot").value); };
  function setAssOpen(on) { document.body.classList.toggle("noass", !on); $("assBtn").classList.toggle("on", on); lsSet("ass", on ? "1" : "0"); setTimeout(fitView, 50); }
  $("assBtn").onclick = function () { setAssOpen(document.body.classList.contains("noass")); };
  /* resizing the columns */
  function splitter(id, prop, dir, min, max, key) {
    var sp = $(id), mainEl = $("main"), v = parseInt(lsGet(key), 10); if (v >= min && v <= max) mainEl.style.setProperty(prop, v + "px");
    sp.addEventListener("pointerdown", function (e) {
      e.preventDefault(); sp.setPointerCapture(e.pointerId); mainEl.classList.add("dragging");
      function mv(ev) { var r = mainEl.getBoundingClientRect(), x = dir > 0 ? ev.clientX - r.left : r.right - ev.clientX; x = Math.max(min, Math.min(max, x)); mainEl.style.setProperty(prop, x + "px"); lsSet(key, String(Math.round(x))); }
      function up() { mainEl.classList.remove("dragging"); sp.removeEventListener("pointermove", mv); sp.removeEventListener("pointerup", up); fitView(); }
      sp.addEventListener("pointermove", mv); sp.addEventListener("pointerup", up);
    });
    sp.addEventListener("dblclick", function () { mainEl.style.removeProperty(prop); lsSet(key, ""); fitView(); });
  }
  splitter("split0", "--aw", 1, 220, 700, "aw"); splitter("split1", "--cw", -1, 300, 900, "cw");

  /* ------------------------------------------------------------------ Google sign-in and cloud save */
  var CRED = null, USER = "", userEmail = "", MY = {}, CLOUD = null, lastCloud = "", saveFailed = false, savedAtTxt = "", cloudT;
  function decodeJwt(t) { try { var p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"); return JSON.parse(decodeURIComponent(escape(atob(p)))); } catch (e) { return {}; } }
  function credLeft(t) { var p = decodeJwt(t); return (p.exp || 0) - Math.floor(Date.now() / 1000); }
  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) { setTimeout(initGoogle, 300); return; }
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onCredential, hd: "socialcircleschools.org", auto_select: true });
    var kept = lsGet("cred") || ""; if (kept && credLeft(kept) > 120) setTimeout(function () { onCredential({ credential: kept }); }, 0);
    showSignIn(); if (!CRED) google.accounts.id.prompt();
    setInterval(function () { if (CRED && credLeft(CRED) < 600) { try { google.accounts.id.prompt(); } catch (e) {} } }, 60000);
  }
  function showSignIn() { var g = $("gbtn"); g.innerHTML = ""; if (window.google && google.accounts && google.accounts.id) google.accounts.id.renderButton(g, { theme: "filled_blue", size: "medium", text: "signin_with", shape: "rectangular" }); }
  function onCredential(resp) {
    var p = decodeJwt(resp.credential); lsSet("cred", resp.credential);
    if (CRED && String(p.email || "").toLowerCase() === userEmail) { CRED = resp.credential; return; }
    if ((p.hd || "").toLowerCase() !== "socialcircleschools.org") { alert("Please sign in with your school account (@socialcircleschools.org)."); return; }
    CRED = resp.credential; USER = p.name || p.email || ""; userEmail = String(p.email || "").toLowerCase();
    var owner = lsGet("owner"); if (owner && owner !== userEmail) { try { Object.keys(localStorage).filter(function (k) { return /^ard:(proj|code|pt|ct):/.test(k); }).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} lsSet("owner", userEmail); loadSlot(slot); }
    lsSet("owner", userEmail);
    $("who").innerHTML = "Signed in: " + esc(USER) + ' <a href="#" id="signOut">Sign out</a>'; $("gbtn").innerHTML = ""; $("signOut").onclick = function (e) { e.preventDefault(); signOut(); };
    api({ action: "mySlots" }).then(function (j) { if (j && j.ok) { (j.slots || []).forEach(function (x) { MY[x.slot] = x.submitted ? "sub" : "draft"; }); buildSlots(); } });
    afterSlot(); updateSaveInd();
  }
  function signOut() {
    if (!confirm("Sign out? Your work is saved to your account first, and this computer's copy is cleared.")) return;
    cloudSave().catch(function () {}).then(function () {
      try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch (e) {}
      try { localStorage.removeItem("ard:cred"); Object.keys(localStorage).filter(function (k) { return /^ard:(proj|code|pt|ct|slot|period):/.test(k) || k === "ard:slot"; }).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
      CRED = null; location.reload();
    });
  }
  function api(body) {
    body.credential = CRED;
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.needLogin) { CRED = null; try { google.accounts.id.prompt(); } catch (e) {} $("who").textContent = "Sign-in timed out. Sign in again (your work is safe)."; showSignIn(); }
      return j;
    });
  }
  function currentPeriod() { var p = lsGet("period") || ""; return PERIODS.indexOf(p) > -1 ? p : PERIODS[0]; }
  function buildPeriods() {
    var h = '<span class="pl">Period:</span> ' + PERIODS.map(function (p) { return '<button type="button" class="btn pbtn' + (p === currentPeriod() ? " on" : "") + '" data-p="' + p + '">' + p + "</button>"; }).join(" ");
    $("periodBtns").innerHTML = h;
    $("periodBtns").querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { lsSet("period", b.getAttribute("data-p")); buildPeriods(); }; });
  }
  function isBlankWork() { return serialize() === JSON.stringify(defaultProject()) && (ta.value === STARTER || !ta.value.trim()) && !Object.keys(ANS).some(function (k) { var v = ANS[k]; return v && (typeof v === "string" ? v.trim() : v.some(Boolean)); }); }
  function applyRecord(rec) {
    if (rec.answers && typeof rec.answers === "object") { ANS = rec.answers; lsSet("ans:" + slot, JSON.stringify(ANS)); }
    if (rec.project && validProject(rec.project)) project = rec.project; if (typeof rec.code === "string") ta.value = rec.code;
    hist = [serialize()]; redo = []; sel = null; persist(); lsSet("code:" + slot, ta.value); buildStage(); fitView(); paintEditor(); showProps(); renderAssignment(); updateUndo(); compileSoon();
  }
  function afterSlot() {
    if (!CRED) return; var sl = slot;
    api({ action: "mine", slot: sl }).then(function (j) {
      if (!j || j.error || sl !== slot) return; CLOUD = j; var dr = j.draft, sub = j.submission, rec = dr || sub;
      if (rec) {
        var localT = +lsGet("pt:" + sl) || 0, cloudT2 = Date.parse(rec.savedAt || rec.submittedAt || 0) || 0;
        if (isBlankWork() || cloudT2 > localT + 1000) { applyRecord(rec); toast("Loaded your saved work"); }
      }
      showTeacher(sub); lastCloud = sigNow(); updateSaveInd();
      if (sub) status("Submitted " + new Date(sub.submittedAt).toLocaleString());
    });
  }
  function showTeacher(sub) {
    var t = $("teach");
    if (sub && sub.teacher && (sub.teacher.score !== null && sub.teacher.score !== undefined || sub.teacher.comment)) { t.className = "teach show"; t.innerHTML = "<b>Teacher feedback</b>" + (sub.teacher.score !== null && sub.teacher.score !== undefined ? " &middot; Score: <b>" + esc(sub.teacher.score) + "</b>" : "") + (sub.teacher.comment ? "<br>" + esc(sub.teacher.comment) : ""); }
    else { t.className = "teach"; t.innerHTML = ""; }
  }
  function cloudSoon() { clearTimeout(cloudT); cloudT = setTimeout(cloudSave, 4000); updateSaveInd(); }
  function cloudSave() {
    if (!CRED) return Promise.resolve(); var sig = sigNow();
    if (sig === lastCloud || (isBlankWork())) return Promise.resolve();
    return api({ action: "saveDraft", slot: slot, project: project, code: ta.value, answers: ANS, auto: autoState, period: currentPeriod() }).then(function (j) {
      if (j && j.ok) { lastCloud = sig; saveFailed = false; savedAtTxt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); if (!MY[slot]) { MY[slot] = "draft"; buildSlots(); } }
      else if (j && !j.needLogin) saveFailed = true; updateSaveInd();
    }).catch(function () { saveFailed = true; updateSaveInd(); });
  }
  function updateSaveInd() {
    var el = $("saveInd"), t, c = "saveind";
    if (!CRED) { t = "Saved on this computer only. Sign in to save to your account."; c += " warn"; }
    else if (saveFailed) { t = "Not saved to your account! Check your internet or sign in again."; c += " bad"; }
    else if (sigNow() === lastCloud) { t = "☁ Saved to your account" + (savedAtTxt ? " " + savedAtTxt : ""); c += " ok"; }
    else { t = "Saving..."; }
    el.textContent = t; el.className = c;
  }
  window.addEventListener("beforeunload", function () { if (CRED && sigNow() !== lastCloud && !isBlankWork()) { try { navigator.sendBeacon && 0; } catch (e) {} } });

  /* submit */
  $("submit").onclick = function () {
    if (!CRED) { toast("Sign in with your school account first."); return; }
    if (!ASSIGN[slot]) { toast("Choose an assignment at the top to submit."); return; }
    if (!currentPeriod()) { toast("Choose your class period at the top first."); return; }
    $("mSubBody").innerHTML = "<h3 style=\"margin:0 0 8px\">Submit " + esc(ASSIGN[slot].title) + "?</h3><p>Your circuit and your code will be sent to your teacher. Your auto score right now is <b>" + (autoState.pct === null ? "?" : autoState.pct) + " / 100</b> (" + autoState.passed + " of " + autoState.total + " steps). You can submit again to replace it.</p><p>Period: <b>" + esc(currentPeriod()) + "</b></p>";
    $("mSub").className = "modal show";
  };
  $("mCancel").onclick = function () { $("mSub").className = "modal"; };
  $("mGo").onclick = function () {
    var b = $("mGo"); b.disabled = true;
    api({ action: "submit", slot: slot, project: project, code: ta.value, answers: ANS, auto: autoState, period: currentPeriod(), output: $("out").textContent.slice(-3000) }).then(function (j) {
      b.disabled = false;
      if (j && j.ok) { $("mSub").className = "modal"; MY[slot] = "sub"; buildSlots(); toast("Submitted! (" + j.count + (j.count === 1 ? " time" : " times") + ")"); status("Submitted " + new Date(j.submittedAt).toLocaleString()); }
      else { toast((j && j.error) || "Could not submit. Try again."); }
    }).catch(function () { b.disabled = false; toast("Could not reach the server. Try again."); });
  };

  /* ------------------------------------------------------------------ start up */
  makeSim(); buildPeriods(); buildSlots();
  var want = lsGet("slot") || "free"; if (!SLOTS.some(function (x) { return x[0] === want; })) want = "free";
  var q = /[?&]slot=([\w-]+)/.exec(location.search); if (q && SLOTS.some(function (x) { return x[0] === q[1]; })) want = q[1];
  if (lsGet("ass") === "0") document.body.classList.add("noass");
  coach = ArduinoCoach.attach($("stagewrap"), { topics: TIPS.topics, openTopic: openTip });
  (function () { var on = lsGet("coach") !== "0"; coach.enabled(on); $("coachBtn").className = "btn" + (on ? " on" : ""); $("coachBtn").onclick = function () { on = !on; lsSet("coach", on ? "1" : "0"); coach.enabled(on); this.className = "btn" + (on ? " on" : ""); toast(on ? "Coach tips are on." : "Coach tips are off."); }; })();
  loadSlot(want); $("slot").value = want; initGoogle();
  setTimeout(fitView, 60); window.addEventListener("resize", function () { setTimeout(fitView, 80); });
  updatePins({ pins: {} });
  /* ---- no copy and paste from outside: students type their own code and answers.
     Text copied inside the code box or an answer box can still be moved around in it. */
  (function () {
    var own = "";
    function teacher() { return userEmail === "randy.norman@socialcircleschools.org"; }
    setInterval(function () { document.body.classList.toggle("teacher", teacher()); }, 700);
    function typing(el) { return !teacher() && el && el.tagName === "TEXTAREA" && (el.id === "ta" || (el.classList && el.classList.contains("askbox"))); }
    function say() { status("Pasting is turned off. Type it in your own words and your own code.", true); }
    document.addEventListener("copy", function (e) {
      var el = e.target; if (typing(el)) { own = String(window.getSelection ? window.getSelection() : "") || (el.value || "").slice(el.selectionStart, el.selectionEnd); return; }
      if (!teacher() && e.target && e.target.closest && e.target.closest("#assBody, .modal, #out, .codebox")) { e.preventDefault(); }
    }, true);
    document.addEventListener("cut", function (e) { var el = e.target; if (typing(el)) own = (el.value || "").slice(el.selectionStart, el.selectionEnd); }, true);
    document.addEventListener("paste", function (e) {
      var el = e.target; if (!typing(el)) return;
      var txt = (e.clipboardData && e.clipboardData.getData("text")) || "";
      e.preventDefault();
      if (txt && own && txt === own) { var s = el.selectionStart, en = el.selectionEnd; el.setRangeText(txt, s, en, "end"); el.dispatchEvent(new Event("input", { bubbles: true })); }
      else say();
    }, true);
    document.addEventListener("drop", function (e) { if (typing(e.target)) { e.preventDefault(); say(); } }, true);
    document.addEventListener("dragover", function (e) { if (typing(e.target)) e.preventDefault(); }, true);
    document.addEventListener("keydown", function (e) { if (typing(e.target) && e.shiftKey && e.key === "Insert") { e.preventDefault(); say(); } }, true);
    ["#assBody", "#out"].forEach(function (s) { var el = document.querySelector(s); if (el) { el.addEventListener("contextmenu", function (e) { if (!teacher() && e.target.closest(".codebox")) e.preventDefault(); }); } });
  })();
  window.ARD = { get project() { return project; }, get sim() { return sim; }, ta: ta, evaluate: evaluate, fitView: fitView };
})();
