/* Arduino Circuit Editor: the canvas, the code editor, the simulation controls, the assignment checker and cloud saving. */
(function () {
  "use strict";
  var C = window.ArduinoCircuit, R = window.ArduinoRender, Sim = window.ArduinoSim, ASSIGN = window.ARD_ASSIGN || {}, SLOTS = window.ARD_SLOTS || [["free", "Free build (practice)"]];
  var $ = function (id) { return document.getElementById(id); };
  var API = "/api/arduinocode", GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
  var TEACHER_EMAILS = ["randy.norman@socialcircleschools.org"];
  var PERIODS = ["1A", "2B", "3A", "3B", "4A"];          /* the class periods students can pick; edit this list for your classes */
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

  /* ------------------------------------------------------------------ simulation */
  var sim, lastRes = null, audio = null, osc = {}, serialBlink = 0;
  function makeSim() {
    sim = new Sim({
      getProject: function () { return project; },
      onUpdate: function (res, io) { lastRes = res; R.update($("stage"), project, res, io, { serialActive: Date.now() - serialBlink < 250 }); updatePins(io); updateWarnings(res); updateAudio(res); scheduleEval(); },
      onSerial: appendOut,
      onError: function (e) { status("Stopped. Line " + e.line + ": " + e.msg, true); showRuntimeError(e); },
      onStop: function () { $("run").className = "btn run"; $("run").innerHTML = "&#9654; Start Simulation"; $("stage").classList.remove("running"); lastRes = sim.analysis(); R.update($("stage"), project, lastRes, sim.io, {}); updatePins(sim.io); updateAudio(lastRes); if (!sim.runtimeError) status("Stopped"); }
    });
    sim.speed = +$("speed").value || 1;
  }
  function refreshVisuals() { if (!sim) return; sim.markDirty(); lastRes = sim.analysis(); R.update($("stage"), project, lastRes, sim.io, {}); updateWarnings(lastRes); }
  function startSim() {
    ensureAudio();
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
      case "led": return [-10, -44, 24, 48]; case "resistor": return [-4, -14, 56, 24]; case "button": return [-10, -10, 38, 56]; case "buzzer": return [-6, -40, 40, 44];
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
    if (overlay.hover) h += '<circle cx="' + overlay.hover.x + '" cy="' + overlay.hover.y + '" r="6.5" fill="#22D3EE" fill-opacity=".3" stroke="#22D3EE" stroke-width="2"/>';
    if (overlay.wirePreview) { var wp = overlay.wirePreview; h += '<path d="' + R.wireD(wp.a.x, wp.a.y, wp.b.x, wp.b.y) + '" fill="none" stroke="' + (R.WIRE_COLORS[wireColor] || "#16a34a") + '" stroke-width="3.6" stroke-linecap="round" stroke-dasharray="6 5" opacity=".9"/>'; }
    overG.innerHTML = h;
  }

  /* ------------------------------------------------------------------ the canvas: history */
  function persist() { lsSet("proj:" + slot, serialize()); lsSet("pt:" + slot, String(Date.now())); }
  function commit(noHist) {
    if (!noHist) { hist.push(serialize()); if (hist.length > 80) hist.shift(); redo = []; }
    persist(); rebuildTerms(); updateUndo(); changed();
  }
  function updateUndo() { $("undo").disabled = hist.length < 2; $("redo").disabled = !redo.length; }
  function doUndo() { if (hist.length < 2) return; redo.push(hist.pop()); project = JSON.parse(hist[hist.length - 1]); sel = null; buildStage(); persist(); updateUndo(); showProps(); changed(); }
  function doRedo() { if (!redo.length) return; var s = redo.pop(); hist.push(s); project = JSON.parse(s); sel = null; buildStage(); persist(); updateUndo(); showProps(); changed(); }
  $("undo").onclick = doUndo; $("redo").onclick = doRedo;
  var changeT; function changed() { clearTimeout(changeT); changeT = setTimeout(function () { sim && sim.markDirty(); scheduleEval(); cloudSoon(); }, 80); }

  /* ------------------------------------------------------------------ the canvas: parts */
  function addPart(kind) {
    var type = kind, props = {};
    if (kind === "breadboard-mini") { type = "breadboard"; props = { size: "mini" }; } else if (kind === "breadboard") props = { size: "half" };
    else if (kind === "led") props = { color: "red" }; else if (kind === "resistor") props = { ohms: 220 };
    var r = stage.getBoundingClientRect(), cx = (r.width / 2 - view.x) / view.z, cy = (r.height / 2 - view.y) / view.z, off = (project.parts.length % 5) * 14;
    var p = { id: nextId(PREFIX[type], project.parts), type: type, x: Math.round(cx / P) * P + off, y: Math.round(cy / P) * P + off, rot: 0, props: props };
    if (type === "led" || type === "buzzer") p.y += 40;
    project.parts.push(p); sel = { type: "part", id: p.id }; buildStage(); commit(); showProps();
    setHint("Drag the " + C.PARTS[type].label.toLowerCase() + " onto the breadboard. The leg dots turn green when it is plugged in.");
  }
  document.querySelectorAll("[data-add]").forEach(function (b) { b.onclick = function () { addPart(b.getAttribute("data-add")); }; });
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
    if (e.button === 2) return; stage.setPointerCapture(e.pointerId); var w = toWorld(e), tgt = e.target, z = 1 / view.z;
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
    if (!drag) { var n = nearestTerm(w, Math.max(5, 6 / view.z)), h = n.part || n.board; overlay.hover = h ? { x: h.x, y: h.y } : null; drawOverlay(); return; }
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
  stage.addEventListener("pointerleave", function () { if (!drag) { overlay.hover = null; drawOverlay(); } });
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
    else if (p && p.type === "resistor") h = "<b>Resistor</b> value: <select id=\"ohms\">" + C.RESISTOR_VALUES.map(function (v) { return '<option value="' + v + '"' + (v === (+p.props.ohms || 220) ? " selected" : "") + ">" + C.ohmsText(v) + " ohms</option>"; }).join("") + '</select> <span style="color:var(--soft)">220 ohms is a good size for an LED.</span>';
    else if (p && p.type === "button") h = "<b>Pushbutton</b> <span style=\"color:var(--soft)\">Put it across the center gap of the breadboard. While the simulation runs, click and hold it to press it.</span>";
    else if (p && p.type === "buzzer") h = "<b>Piezo buzzer</b> <span style=\"color:var(--soft)\">Connect one leg to a pin and the other to GND, then use tone(pin, 440); in your code. Turn up your speakers!</span>";
    else if (p && p.type === "breadboard") h = "<b>Breadboard</b> <span style=\"color:var(--soft)\">The 5 holes in each column (a to e, or f to j) are connected. The long rows at the top and bottom are power rails: each whole row is connected.</span>";
    else if (p && p.type === "uno") h = "<b>Arduino Uno</b> <span style=\"color:var(--soft)\">Drag from any pin to a breadboard hole to make a wire. The orange L light shows pin 13.</span>";
    else if (w) h = "<b>Wire</b> color: " + swatches(R.WIRE_COLORS, w.color || "green", "wirec") + ' <span style="color:var(--soft)">Drag the blue end dots to move an end. Press Delete to remove it.</span>';
    else h = '<span style="color:var(--soft)">Click a part or a wire to change it. To make a wire, <b>drag from a pin or hole</b> to another pin or hole. Scroll to zoom, drag the background to move around.</span>';
    box.innerHTML = h;
    box.querySelectorAll("[data-ledc]").forEach(function (b) { b.onclick = function () { p.props.color = b.getAttribute("data-ledc"); buildStage(); commit(); showProps(); }; });
    box.querySelectorAll("[data-wirec]").forEach(function (b) { b.onclick = function () { w.color = b.getAttribute("data-wirec"); wireColor = w.color; renderWires(); commit(); showProps(); }; });
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

  /* ------------------------------------------------------------------ assignments and auto-checks */
  var evalT, evalSeq = 0, runCache = {}, autoState = { pct: null, passed: 0, total: 0 };
  function stripComments(c) { return c.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, ""); }
  function makeCtx() {
    var code = ta.value, noC = stripComments(code), base = C.analyze(project, { pins: {}, pressed: {}, blown: {} }), uno = project.parts.filter(function (p) { return p.type === "uno"; })[0], unoId = uno ? uno.id : "uno1";
    var comp = ArduinoCompiler.compile(code), pkey = serialize();
    return {
      project: project, compiled: comp.ok, base: base,
      code: function (re, incl) { return re.test(incl ? code : noC); },
      count: function (type) { return project.parts.filter(function (p) { return p.type === type; }).length; },
      parts: function (type) { return project.parts.filter(function (p) { return p.type === type; }); },
      plugged: function (part) { return C.worldTerms(part).every(function (t) { return base.legs[t.key]; }); },
      netOf: function (part, term) { return base.netOf(part.id + ":" + term); },
      pin: function (label) { return base.netOf(unoId + ":" + label); }, gnd: base.netOf(unoId + ":GND_b1"),
      staticRun: function (o) { return C.analyze(project, { pins: o.pins || {}, pressed: o.pressed || {}, blown: {} }); },
      run: function (opts) { var k = pkey + "|" + code + "|" + JSON.stringify(opts); if (!runCache[k]) { if (Object.keys(runCache).length > 40) runCache = {}; runCache[k] = Sim.virtual(clone(project), code, opts); } return runCache[k]; }
    };
  }
  function renderAssignment() {
    var A = ASSIGN[slot], body = $("assBody"); $("assTitle").textContent = A ? A.title : "Free build";
    $("assHead").className = A ? "show" : ""; document.body.classList.toggle("free", !A);
    if (!A) { body.innerHTML = '<p class="intro">This is a free build. Add parts, wire them up, and write code to try your own ideas. Nothing here is graded.</p><div class="hintbox"><b>How to build a circuit</b><br>1. Click a part in the bar above the canvas (it appears in the middle).<br>2. Drag it onto the breadboard. When its leg dots turn <span style="color:#22c55e">green</span>, it is plugged in.<br>3. <b>Drag from a pin or hole to another pin or hole</b> to make a wire.<br>4. Type your code on the right and click <b>Start Simulation</b>.</div>'; return; }
    var h = '<p class="intro">' + A.intro + "</p>", n = 0;
    A.steps.forEach(function (s, si) {
      h += "<h3>" + esc(s.h) + "</h3>"; if (s.code) h += '<pre class="codebox">' + esc(s.code) + "</pre>";
      s.items.forEach(function (it, ii) { h += '<label class="item" data-si="' + si + '" data-ii="' + ii + '"><span class="box">&#10003;</span><span class="txt">' + it.t + '</span><span class="badge">checking</span></label>'; n++; });
    });
    body.innerHTML = h; scheduleEval(true);
  }
  function scheduleEval(now) { if (!ASSIGN[slot]) return; clearTimeout(evalT); evalT = setTimeout(evaluate, now ? 50 : 900); }
  async function evaluate() {
    var A = ASSIGN[slot]; if (!A) return; var seq = ++evalSeq, ctx = makeCtx(), passed = 0, total = 0, results = [];
    for (var si = 0; si < A.steps.length; si++) for (var ii = 0; ii < A.steps[si].items.length; ii++) {
      var ok = false; try { ok = !!(await A.steps[si].items[ii].check(ctx)); } catch (e) { ok = false; }
      if (seq !== evalSeq) return; total++; if (ok) passed++; results.push([si, ii, ok]);
    }
    results.forEach(function (r) { var el = $("assBody").querySelector('[data-si="' + r[0] + '"][data-ii="' + r[1] + '"]'); if (!el) return; el.className = "item" + (r[2] ? " done" : ""); el.querySelector(".badge").textContent = r[2] ? "auto-check: met" : "auto-check: not yet"; });
    var pct = total ? Math.floor(100 * passed / total) : 0; autoState = { pct: pct, passed: passed, total: total };
    $("assCount").innerHTML = "<b>" + passed + "</b> of " + total + " steps done"; $("assScore").innerHTML = "Auto score: <b>" + pct + " / 100</b>";
  }

  /* ------------------------------------------------------------------ slots and local storage */
  function loadSlot(s) {
    slot = s; lsSet("slot", s); sim && sim.stop(true);
    var pj = lsGet("proj:" + s), cd = lsGet("code:" + s), pr = null; try { pr = pj ? JSON.parse(pj) : null; } catch (e) { pr = null; }
    project = validProject(pr) ? pr : defaultProject(); ta.value = cd != null ? cd : STARTER; hist = [serialize()]; redo = []; sel = null;
    $("out").textContent = ""; $("errbox").className = ""; errLines = {}; $("teach").className = "teach"; $("teach").innerHTML = "";
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
  function currentPeriod() { return lsGet("period") || ""; }
  function buildPeriods() {
    var h = '<span class="pl">Period:</span> ' + PERIODS.map(function (p) { return '<button type="button" class="btn pbtn' + (p === currentPeriod() ? " on" : "") + '" data-p="' + p + '">' + p + "</button>"; }).join(" ");
    $("periodBtns").innerHTML = h;
    $("periodBtns").querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { lsSet("period", b.getAttribute("data-p")); buildPeriods(); }; });
  }
  function isBlankWork() { return serialize() === JSON.stringify(defaultProject()) && (ta.value === STARTER || !ta.value.trim()); }
  function applyRecord(rec) {
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
      showTeacher(sub); lastCloud = serialize() + "||" + ta.value; updateSaveInd();
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
    if (!CRED) return Promise.resolve(); var sig = serialize() + "||" + ta.value;
    if (sig === lastCloud || (isBlankWork())) return Promise.resolve();
    return api({ action: "saveDraft", slot: slot, project: project, code: ta.value, auto: autoState, period: currentPeriod() }).then(function (j) {
      if (j && j.ok) { lastCloud = sig; saveFailed = false; savedAtTxt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); if (!MY[slot]) { MY[slot] = "draft"; buildSlots(); } }
      else if (j && !j.needLogin) saveFailed = true; updateSaveInd();
    }).catch(function () { saveFailed = true; updateSaveInd(); });
  }
  function updateSaveInd() {
    var el = $("saveInd"), t, c = "saveind";
    if (!CRED) { t = "Saved on this computer only. Sign in to save to your account."; c += " warn"; }
    else if (saveFailed) { t = "Not saved to your account! Check your internet or sign in again."; c += " bad"; }
    else if (serialize() + "||" + ta.value === lastCloud) { t = "☁ Saved to your account" + (savedAtTxt ? " " + savedAtTxt : ""); c += " ok"; }
    else { t = "Saving..."; }
    el.textContent = t; el.className = c;
  }
  window.addEventListener("beforeunload", function () { if (CRED && serialize() + "||" + ta.value !== lastCloud && !isBlankWork()) { try { navigator.sendBeacon && 0; } catch (e) {} } });

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
    api({ action: "submit", slot: slot, project: project, code: ta.value, auto: autoState, period: currentPeriod(), output: $("out").textContent.slice(-3000) }).then(function (j) {
      b.disabled = false;
      if (j && j.ok) { $("mSub").className = "modal"; MY[slot] = "sub"; buildSlots(); toast("Submitted! (" + j.count + (j.count === 1 ? " time" : " times") + ")"); status("Submitted " + new Date(j.submittedAt).toLocaleString()); }
      else { toast((j && j.error) || "Could not submit. Try again."); }
    }).catch(function () { b.disabled = false; toast("Could not reach the server. Try again."); });
  };

  /* ------------------------------------------------------------------ start up */
  makeSim(); buildPeriods(); buildSlots();
  var want = lsGet("slot") || "free"; if (!SLOTS.some(function (x) { return x[0] === want; })) want = "free";
  var q = /[?&]slot=([\w]+)/.exec(location.search); if (q && SLOTS.some(function (x) { return x[0] === q[1]; })) want = q[1];
  if (lsGet("ass") === "0") document.body.classList.add("noass");
  loadSlot(want); $("slot").value = want; initGoogle();
  setTimeout(fitView, 60); window.addEventListener("resize", function () { setTimeout(fitView, 80); });
  updatePins({ pins: {} });
  window.ARD = { get project() { return project; }, get sim() { return sim; }, ta: ta, evaluate: evaluate, fitView: fitView };
})();
