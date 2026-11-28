/* KAREL UI for the IST labs: a code box, the world drawn on a canvas, Run / Step / Reset, and the goal picture.
   KarelUI.mount(el, item, {get: function(){return code}, set: function(code){}}) ; needs ist/karel/engine.js first. */
(function (root) {
  "use strict";
  var K = root.KarelEngine, DX = { N: 0, E: 1, S: 0, W: -1 }, DY = { N: 1, E: 0, S: -1, W: 0 }, ANG = { N: 0, E: 90, S: 180, W: 270 };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function stateFrom(world) { var balls = {}; (world.balls || []).forEach(function (b) { balls[b[0] + "," + b[1]] = (balls[b[0] + "," + b[1]] || 0) + b[2]; }); return { x: world.x, y: world.y, dir: world.dir, balls: balls }; }
  function draw(canvas, world, st, opts) {
    opts = opts || {}; var cols = world.cols, rows = world.rows, pad = 26, maxW = opts.maxW || 380, cell = Math.max(22, Math.min(54, Math.floor((maxW - pad - 8) / cols)));
    var W = pad + cols * cell + 8, H = rows * cell + pad + 8, dpr = root.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px";
    var g = canvas.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    var X = function (c) { return pad + (c - 1) * cell; }, Y = function (r) { return 4 + (rows - r) * cell; };
    g.fillStyle = "#0F1520"; g.fillRect(pad, 4, cols * cell, rows * cell);
    g.strokeStyle = "#2A3446"; g.lineWidth = 1;
    for (var c = 0; c <= cols; c++) { g.beginPath(); g.moveTo(pad + c * cell + .5, 4); g.lineTo(pad + c * cell + .5, 4 + rows * cell); g.stroke(); }
    for (var r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(pad, 4 + r * cell + .5); g.lineTo(pad + cols * cell, 4 + r * cell + .5); g.stroke(); }
    g.fillStyle = "#8B9AAE"; g.font = "600 10px Manrope, sans-serif"; g.textAlign = "center";
    for (c = 1; c <= cols; c++) g.fillText(c, X(c) + cell / 2, H - 3);
    g.textAlign = "right"; for (r = 1; r <= rows; r++) g.fillText(r, pad - 6, Y(r) + cell / 2 + 3);
    g.strokeStyle = "#E5E7EB"; g.lineWidth = 4; g.lineCap = "round";
    (world.walls || []).forEach(function (w) { g.beginPath(); if (w[2] === "E") { g.moveTo(X(w[0]) + cell, Y(w[1])); g.lineTo(X(w[0]) + cell, Y(w[1]) + cell); } else { g.moveTo(X(w[0]), Y(w[1])); g.lineTo(X(w[0]) + cell, Y(w[1])); } g.stroke(); });
    g.strokeStyle = "#E5E7EB"; g.lineWidth = 3; g.strokeRect(pad, 4, cols * cell, rows * cell);
    Object.keys(st.balls).forEach(function (k) { var p = k.split(","), cx = X(+p[0]) + cell / 2, cy = Y(+p[1]) + cell / 2 + (opts.small ? 0 : 5);
      g.fillStyle = "#F59E0B"; g.strokeStyle = "#92400E"; g.lineWidth = 1.5; g.beginPath(); g.arc(cx + cell * .18, cy + cell * .18, cell * .2, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "#451A03"; g.font = "800 " + Math.round(cell * .26) + "px Manrope, sans-serif"; g.textAlign = "center"; g.fillText(st.balls[k], cx + cell * .18, cy + cell * .18 + cell * .09); });
    var kx = X(st.x) + cell / 2, ky = Y(st.y) + cell / 2; g.save(); g.translate(kx, ky); g.rotate(ANG[st.dir] * Math.PI / 180);
    var s = cell * .36; g.fillStyle = opts.ghost ? "rgba(56,189,248,.35)" : "#38BDF8"; g.strokeStyle = opts.ghost ? "rgba(56,189,248,.8)" : "#0C4A6E"; g.lineWidth = 2; g.lineJoin = "round";
    g.beginPath(); g.moveTo(0, -s * 1.15); g.lineTo(s, s); g.lineTo(0, s * .45); g.lineTo(-s, s); g.closePath(); g.fill(); g.stroke(); g.restore();
  }
  function mount(el, item, io) {
    var world = item.world, st = stateFrom(world), events = [], cursor = 0, timer = null, result = null, speed = 2;
    var code = io.get() || item.starter;
    el.innerHTML = '<div class="kwrap"><div class="kleft"><div class="klabel">Karel&#39;s world <span class="kdim">(avenues across, streets up)</span></div><canvas class="kcv"></canvas>' +
      '<div class="kbtns"><button type="button" class="kb run">&#9654; Run</button><button type="button" class="kb step">Step</button><button type="button" class="kb rst">Reset</button><label class="kspd">Speed <input type="range" min="0" max="3" value="2"></label></div>' +
      (item.goal ? '<div class="klabel" style="margin-top:12px">Goal: how the world should end <span class="kdim">(Karel shown faint)</span></div><canvas class="kgoal"></canvas>' : "") +
      '</div><div class="kright"><div class="klabel">Your program <button type="button" class="kb ghost krs">Start over</button></div><div class="kcode"><div class="kgut"></div><textarea class="kta" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div><div class="kout"></div></div></div>' +
      (item.req && item.req.length ? '<ul class="kreq">' + item.req.map(function (r) { return "<li>" + r + "</li>"; }).join("") + "</ul>" : "");
    var cv = el.querySelector(".kcv"), gcv = el.querySelector(".kgoal"), ta = el.querySelector(".kta"), gut = el.querySelector(".kgut"), out = el.querySelector(".kout"), errLine = 0, curLine = 0;
    ta.value = code;
    function lines() { return ta.value.split("\n").length; }
    function drawGut() { var n = lines(), h = ""; for (var i = 1; i <= n; i++) h += '<div class="' + (i === errLine ? "err" : i === curLine ? "cur" : "") + '">' + i + "</div>"; gut.innerHTML = h; gut.scrollTop = ta.scrollTop; }
    function sizeTa() { ta.style.height = "auto"; ta.style.height = Math.max(210, Math.min(560, ta.scrollHeight + 4)) + "px"; gut.style.height = ta.style.height; }
    function paint() { draw(cv, world, st); }
    function say(html, cls) { out.className = "kout " + (cls || ""); out.innerHTML = html; }
    function reset() { clearInterval(timer); timer = null; st = stateFrom(world); events = []; cursor = 0; result = null; errLine = 0; curLine = 0; paint(); drawGut(); say("Press Run to watch Karel follow your program.", ""); }
    function compile() {
      var r = K.run(ta.value, world, Object.assign({ maxSteps: 60000, maxCommands: 3000 }, item.kopts || {})); result = r; events = r.events; cursor = 0; st = stateFrom(world); errLine = 0; paint(); return r;
    }
    function applyEvent(e) { st.x = e.x; st.y = e.y; st.dir = e.dir; if (e.type === "put" || e.type === "take") { var k = e.x + "," + e.y; if (e.balls) st.balls[k] = e.balls; else delete st.balls[k]; } curLine = e.line || 0; paint(); drawGut(); }
    function finish() {
      clearInterval(timer); timer = null; curLine = 0;
      if (result.error) { errLine = result.error.line; drawGut(); say("<b>Line " + result.error.line + ":</b> " + esc(result.error.message), "bad"); }
      else { st = { x: result.final.x, y: result.final.y, dir: result.final.dir, balls: JSON.parse(JSON.stringify(result.final.balls)) }; paint(); drawGut(); say("Karel finished at avenue " + st.x + ", street " + st.y + ", facing " + ({ N: "North", E: "East", S: "South", W: "West" })[st.dir] + ". Karel used " + result.commands + " command" + (result.commands === 1 ? "" : "s") + ". Press <b>Check my answers</b> at the bottom to score it.", "ok"); }
    }
    function stepOnce() { if (cursor >= events.length) { finish(); return false; } applyEvent(events[cursor++]); return true; }
    el.querySelector(".run").onclick = function () {
      if (timer) return; var r = compile(); if (speed === 0) { while (cursor < events.length) applyEvent(events[cursor++]); finish(); return; }
      var ms = [0, 380, 140, 45][speed]; say("Running...", ""); timer = setInterval(function () { if (!stepOnce()) { } }, ms);
    };
    el.querySelector(".step").onclick = function () { if (timer) { clearInterval(timer); timer = null; } if (!result || cursor === 0 && events.length === 0) compile(); stepOnce(); if (cursor < events.length) say("Step " + cursor + " of " + events.length + (curLine ? " (line " + curLine + ")" : ""), ""); };
    el.querySelector(".rst").onclick = reset;
    el.querySelector(".krs").onclick = function () { if (ta.value.trim() === item.starter.trim() || confirm("Replace your program with the starting code?")) { ta.value = item.starter; io.set(ta.value); sizeTa(); reset(); } };
    var sp = el.querySelector(".kspd input"); sp.oninput = function () { speed = +sp.value; if (timer) { clearInterval(timer); var ms = [0, 380, 140, 45][speed] || 45; timer = setInterval(stepOnce, ms); } };
    ta.addEventListener("input", function () { io.set(ta.value); sizeTa(); errLine = 0; drawGut(); });
    ta.addEventListener("scroll", function () { gut.scrollTop = ta.scrollTop; });
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Tab") { e.preventDefault(); var s0 = ta.selectionStart, e0 = ta.selectionEnd; ta.value = ta.value.slice(0, s0) + "  " + ta.value.slice(e0); ta.selectionStart = ta.selectionEnd = s0 + 2; ta.dispatchEvent(new Event("input")); }
      if (e.key === "Enter") { var pos = ta.selectionStart, before = ta.value.slice(0, pos), ln = before.slice(before.lastIndexOf("\n") + 1), ind = /^\s*/.exec(ln)[0]; if (/\{\s*$/.test(ln)) ind += "  "; e.preventDefault(); ta.value = before + "\n" + ind + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = pos + 1 + ind.length; ta.dispatchEvent(new Event("input")); }
    });
    if (gcv) draw(gcv, world, item.goal, { ghost: true, maxW: 300, small: true });
    sizeTa(); reset();
    el.__karel = { code: function () { return ta.value; }, run: function () { return compile(); }, world: function () { return st; } };
  }
  root.KarelUI = { mount: mount, draw: draw };
})(window);
