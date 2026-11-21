/* The five game scenes. Each scene draws the world on the canvas and reacts to what happens:
     begin(q)        a new question is on screen
     verdict(ok, r)  the server said right or wrong (r.over means that was the last life)
     over()          the game is lost       win()   all rounds done
     frame(t, dt)    draw one frame         click(x, y) / choose(i)   optional player input
   G (set by engine.js) holds the live game state: G.tleft, G.tmax, G.strikes, G.correct, G.n */
(function () {
  "use strict";
  var W = 800, H = 380, TAU = 6.2832;
  var ctx = null, G = { tleft: 30, tmax: 30, strikes: 0, correct: 0, n: 0 };
  var rnd = Math.random;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function txt(s, x, y, size, color, align, font) { ctx.font = (font || "700") + " " + size + 'px "Silkscreen","JetBrains Mono",monospace'; ctx.fillStyle = color || "#fff"; ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); }
  function stars(seed, n, ymax) { for (var i = 0; i < n; i++) { var x = (i * 97 + seed * 31) % W, y = (i * 53 + seed * 17) % ymax, tw = 0.5 + 0.5 * Math.sin(Date.now() / 400 + i); ctx.fillStyle = "rgba(255,255,255," + (0.35 + 0.5 * tw) + ")"; ctx.fillRect(x, y, 2, 2); } }
  function sound(n) { if (window.Snd) window.Snd[n] && window.Snd[n](); }
  function spawn(list, x, y, n, o) { o = o || {}; for (var i = 0; i < n; i++) { var a = rnd() * TAU, sp = (o.speed || 200) * (0.3 + rnd()); list.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.up || 0), life: 0, max: (o.life || 1) * (0.6 + rnd() * 0.8), c: (o.colors || ["#fde047"])[Math.floor(rnd() * (o.colors || [1]).length)], s: (o.size || 5) * (0.5 + rnd()), g: o.g === undefined ? 400 : o.g }); } }
  function stepParts(list, dt) { for (var i = list.length - 1; i >= 0; i--) { var p = list[i]; p.life += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.life > p.max) list.splice(i, 1); } }
  function drawParts(list) { list.forEach(function (p) { ctx.globalAlpha = clamp(1 - p.life / p.max, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }); ctx.globalAlpha = 1; }

  /* ============================================================ 1. BOMB: defuse the house ============ */
  var Bomb = {
    parts: [], shake: 0, flash: 0, flashC: "255,40,40", boom: -1, safe: 0, display: "????", pulse: 0, debris: [], click: 0,
    init: function () { this.parts = []; this.boom = -1; this.safe = 0; this.debris = []; },
    begin: function (q) { this.display = q.type === "bits" ? String(q.target) : q.type === "bitsip" ? q.targets.join(".") : q.code ? "?" : "????"; this.pulse = 1; },
    verdict: function (ok, r) {
      if (ok) { this.flash = 0.7; this.flashC = "60,255,120"; spawn(this.parts, 400, 205, 26, { colors: ["#4ade80", "#fde047", "#fff"], speed: 220, life: 0.9, g: 200 }); sound("good"); }
      else { this.flash = 1; this.flashC = "255,40,40"; this.shake = 0.6; sound("bad"); }
    },
    over: function () { this.boom = 0; this.shake = 1.4; sound("boom"); var cx = 400, cy = 230; spawn(this.debris, cx, cy, 60, { colors: ["#b45309", "#78350f", "#fb923c", "#fde047", "#444"], speed: 520, life: 2.4, size: 14, g: 600, up: 200 }); },
    win: function () { this.safe = 1; this.display = "SAFE"; if (window.FX) window.FX.confetti(120); sound("win"); },
    frame: function (t, dt) {
      var sh = this.shake > 0 ? (rnd() - 0.5) * this.shake * 22 : 0, sv = this.shake > 0 ? (rnd() - 0.5) * this.shake * 14 : 0;
      this.shake = Math.max(0, this.shake - dt * 1.6); this.flash = Math.max(0, this.flash - dt * 1.8); this.pulse = Math.max(0, this.pulse - dt * 2);
      if (this.boom >= 0) this.boom += dt;
      ctx.save(); ctx.translate(sh, sv);
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0b1030"); g.addColorStop(1, "#1d2a5c"); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
      stars(3, 40, 150);
      ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(700, 60, 22, 0, TAU); ctx.fill(); ctx.fillStyle = "#1d2a5c"; ctx.beginPath(); ctx.arc(710, 55, 20, 0, TAU); ctx.fill();
      ctx.fillStyle = "#14532d"; ctx.fillRect(-20, 318, W + 40, 100); ctx.fillStyle = "#166534"; ctx.fillRect(-20, 318, W + 40, 10);
      var gone = this.boom > 0.35;
      if (!gone) {
        /* the house */
        ctx.fillStyle = "#7c2d12"; ctx.beginPath(); ctx.moveTo(210, 150); ctx.lineTo(400, 70); ctx.lineTo(590, 150); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#431407"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#57534e"; ctx.fillRect(500, 70, 30, 55);
        ctx.fillStyle = "#fcd9a6"; rr(225, 150, 350, 168, 4); ctx.fill(); ctx.strokeStyle = "#92400e"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#fef3c7"; ctx.fillRect(250, 172, 300, 120);
        ctx.fillStyle = "#a16207"; ctx.fillRect(250, 292, 300, 6);
        var lit = this.safe ? "#fde047" : "#fbbf24";
        [[236, 170], [532, 170]].forEach(function (w) { ctx.fillStyle = "#1e293b"; ctx.fillRect(w[0], w[1], 32, 46); ctx.fillStyle = lit; ctx.fillRect(w[0] + 3, w[1] + 3, 26, 40); });
        ctx.fillStyle = "#7c2d12"; ctx.fillRect(375, 255, 50, 63); ctx.fillStyle = "#fbbf24"; ctx.fillRect(415, 285, 5, 5);
        /* the table and the bomb */
        ctx.fillStyle = "#92400e"; ctx.fillRect(350, 246, 100, 8); ctx.fillRect(360, 254, 8, 40); ctx.fillRect(432, 254, 8, 40);
        var bx = 400, by = 222, br = 26 + this.pulse * 2;
        ctx.fillStyle = "#111827"; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(bx - 9, by - 9, 7, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#a16207"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx + 14, by - 22); ctx.quadraticCurveTo(bx + 30, by - 44, bx + 18, by - 52); ctx.stroke();
        if (!this.safe) { var sp = (Math.sin(Date.now() / 60) + 1) / 2; ctx.fillStyle = sp > 0.5 ? "#fde047" : "#fb923c"; ctx.beginPath(); ctx.arc(bx + 18, by - 52, 5 + sp * 3, 0, TAU); ctx.fill(); }
        /* the timer on the bomb */
        var left = Math.max(0, Math.ceil(G.tleft)); ctx.fillStyle = "#020617"; rr(bx - 20, by - 3, 40, 18, 3); ctx.fill();
        txt(this.safe ? "OK" : ("0:" + (left < 10 ? "0" : "") + left), bx, by + 6, 13, this.safe ? "#4ade80" : (left <= 5 ? "#f87171" : "#4ade80"));
        /* the big display above it */
        ctx.fillStyle = "#020617"; rr(300, 100, 200, 44, 8); ctx.fill(); ctx.strokeStyle = this.safe ? "#4ade80" : "#ef4444"; ctx.lineWidth = 3; ctx.stroke();
        txt(this.display, 400, 123, this.display.length > 9 ? 17 : 26, this.safe ? "#4ade80" : "#f87171");
        /* lives: three lights on the roof */
        for (var s = 0; s < 3; s++) { ctx.fillStyle = s < G.strikes ? "#ef4444" : "#1f2937"; ctx.beginPath(); ctx.arc(360 + s * 40, 85 + 6, 9, 0, TAU); ctx.fill(); ctx.strokeStyle = "#475569"; ctx.lineWidth = 2; ctx.stroke(); }
      } else {
        ctx.fillStyle = "#44403c"; for (var k = 0; k < 7; k++) ctx.fillRect(230 + k * 50, 300 - (k % 3) * 8, 46, 20 + (k % 3) * 8);
        ctx.fillStyle = "#78350f"; ctx.fillRect(300, 290, 120, 18);
        txt("BOOM!", 400, 150, 54, "#fb923c"); txt("The house is gone...", 400, 205, 18, "#fde68a");
      }
      if (this.boom >= 0) {
        var b = this.boom, r1 = b * 520, a1 = clamp(1.2 - b * 0.9, 0, 1);
        ctx.fillStyle = "rgba(255,200,60," + a1 * 0.9 + ")"; ctx.beginPath(); ctx.arc(400, 230, r1 * 0.7, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,90,20," + a1 + ")"; ctx.beginPath(); ctx.arc(400, 230, r1 * 0.45, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255," + clamp(1 - b * 3, 0, 1) + ")"; ctx.fillRect(-20, -20, W + 40, H + 40);
        for (var sm = 0; sm < 5; sm++) { ctx.fillStyle = "rgba(60,60,60," + clamp(0.5 - b * 0.12, 0, 0.5) + ")"; ctx.beginPath(); ctx.arc(330 + sm * 36, 210 - b * 60 - sm * 12, 30 + b * 24, 0, TAU); ctx.fill(); }
        stepParts(this.debris, dt); drawParts(this.debris);
      }
      stepParts(this.parts, dt); drawParts(this.parts);
      if (this.flash > 0) { ctx.fillStyle = "rgba(" + this.flashC + "," + this.flash * 0.35 + ")"; ctx.fillRect(-20, -20, W + 40, H + 40); }
      ctx.restore();
    }
  };

  /* ============================================================ 2. CLIFF ROAD: DNS =================== */
  var Cliff = {
    scroll: 0, speed: 160, lane: 1, laneX: 1, mode: "idle", mt: 0, badLane: -1, carY: 0, carRot: 0, carS: 1, banner: "", bannerT: 0, parts: [], ended: "",
    init: function () { this.mode = "idle"; this.ended = ""; this.lane = 1; this.laneX = 1; this.speed = 160; this.carY = 0; this.carRot = 0; this.carS = 1; this.badLane = -1; },
    begin: function (q) { this.mode = "idle"; this.badLane = -1; this.carY = 0; this.carRot = 0; this.carS = 1; this.banner = ""; },
    choose: function (i) { this.lane = i; sound("tick"); },
    verdict: function (ok, r) {
      this.mode = ok ? "pass" : "fall"; this.mt = 0;
      if (!ok) { this.badLane = this.lane; sound("bad"); } else { sound("good"); this.banner = "GATE PASSED!"; this.bannerT = 1.4; }
    },
    over: function () { this.ended = "over"; sound("boom"); },
    win: function () { this.ended = "win"; this.speed = 260; if (window.FX) window.FX.confetti(120); sound("win"); },
    frame: function (t, dt) {
      this.laneX = lerp(this.laneX, this.lane, clamp(dt * 7, 0, 1));
      var sp = this.speed, t0 = this.mt; this.mt += dt;
      if (this.mode === "pass") sp = 160 + Math.min(this.mt, 1) * 520;
      if (this.mode === "fall") sp = 160 + Math.min(this.mt, 0.9) * 300 * (this.mt < 0.9 ? 1 : 0.1);
      if (this.ended === "over") sp = 0;
      this.scroll += sp * dt;
      var g = ctx.createLinearGradient(0, 0, 0, 180); g.addColorStop(0, this.ended === "win" ? "#fda4af" : "#60a5fa"); g.addColorStop(1, this.ended === "win" ? "#fde68a" : "#bae6fd"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 180);
      ctx.fillStyle = "#fef9c3"; ctx.beginPath(); ctx.arc(130 + (this.scroll * 0.02) % 40, 70, 28, 0, TAU); ctx.fill();
      [["#7c8db5", 0.15, 120], ["#5b6b96", 0.3, 90]].forEach(function (m, k) { ctx.fillStyle = m[0]; ctx.beginPath(); ctx.moveTo(0, 180); for (var x = 0; x <= W; x += 40) ctx.lineTo(x, 180 - m[2] * (0.45 + 0.55 * Math.abs(Math.sin((x + Cliff.scroll * m[1] * 0.2 + k * 150) / 120)))); ctx.lineTo(W, 180); ctx.closePath(); ctx.fill(); });
      /* the canyon (the cliff) and the road */
      var hz = 180, topW = 150, botW = 700, cx = W / 2;
      var gg = ctx.createLinearGradient(0, hz, 0, H); gg.addColorStop(0, "#7c2d12"); gg.addColorStop(1, "#1c0a02"); ctx.fillStyle = gg; ctx.fillRect(0, hz, W, H - hz);
      ctx.fillStyle = "#b45309"; for (var i = 0; i < 9; i++) { var yy = hz + 10 + i * 24, pw = (yy - hz) / (H - hz); ctx.fillRect(cx - lerp(topW, botW, pw) / 2 - 40 - pw * 40, yy, 36 + pw * 30, 5); ctx.fillRect(cx + lerp(topW, botW, pw) / 2 + 4 + pw * 40, yy, 36 + pw * 30, 5); }
      /* road, with the end of the road in the bad lane while falling */
      var cut = this.mode === "fall" && this.mt > 0.15 ? this.badLane : -1, lanes = 3;
      for (var ln = 0; ln < lanes; ln++) {
        var y0 = hz, y1 = H, x0a = cx - topW / 2 + (ln / lanes) * topW, x0b = cx - topW / 2 + ((ln + 1) / lanes) * topW, x1a = cx - botW / 2 + (ln / lanes) * botW, x1b = cx - botW / 2 + ((ln + 1) / lanes) * botW;
        if (ln === cut) { var ye = hz + (H - hz) * 0.5; var xe = lerp(x0a, x1a, 0.5), xf = lerp(x0b, x1b, 0.5); ctx.fillStyle = "#374151"; ctx.beginPath(); ctx.moveTo(xe, ye); ctx.lineTo(xf, ye); ctx.lineTo(x1b, y1); ctx.lineTo(x1a, y1); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#facc15"; for (var z = 0; z < 8; z++) ctx.fillRect(lerp(xe, xf, z / 8), ye - 4, (xf - xe) / 16, 6); continue; }
        ctx.fillStyle = ln % 2 ? "#4b5563" : "#434c5a"; ctx.beginPath(); ctx.moveTo(x0a, y0); ctx.lineTo(x0b, y0); ctx.lineTo(x1b, y1); ctx.lineTo(x1a, y1); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 4; [cx - topW / 2, cx + topW / 2].forEach(function (x, k) { ctx.beginPath(); ctx.moveTo(x, hz); ctx.lineTo(k ? cx + botW / 2 : cx - botW / 2, H); ctx.stroke(); });
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3;
      for (var d = 0; d < 14; d++) { var f = ((d * 0.075 + (this.scroll / 900)) % 1), f2 = f + 0.035; [1, 2].forEach(function (ln) { var a = hz + (H - hz) * f * f, b2 = hz + (H - hz) * f2 * f2; var xa = lerp(cx - topW / 2 + (ln / 3) * topW, cx - botW / 2 + (ln / 3) * botW, f * f), xb = lerp(cx - topW / 2 + (ln / 3) * topW, cx - botW / 2 + (ln / 3) * botW, f2 * f2); ctx.beginPath(); ctx.moveTo(xa, a); ctx.lineTo(xb, b2); ctx.stroke(); }); }
      /* the car */
      var carX = lerp(cx - botW / 2 + botW / 6, cx + botW / 2 - botW / 6, this.laneX / 2) * 0.9 + cx * 0.1 - (cx * 0.1) * 0, cY = 300, scl = this.carS;
      if (this.mode === "fall") { var m = this.mt; if (m > 0.9) { this.carY = (m - 0.9) * (m - 0.9) * 700; this.carRot = (m - 0.9) * 3; this.carS = Math.max(0.2, 1 - (m - 0.9) * 0.9); } }
      if (this.mode === "fall" && this.mt > 1.9) this.mode = "idle";
      if (this.mode === "pass" && this.mt > 1.4) this.mode = "idle";
      if (this.mode === "idle" && this.carY > 0) { this.carY = 0; this.carRot = 0; this.carS = 1; }
      ctx.save(); ctx.translate(carX, cY + this.carY - 36 * (1 - 1)); ctx.rotate(this.carRot); ctx.scale(this.carS, this.carS);
      if (this.ended === "over") ctx.rotate(0.35);
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(0, 40, 62, 10, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#dc2626"; rr(-58, -2, 116, 44, 9); ctx.fill(); ctx.fillStyle = "#b91c1c"; rr(-44, -30, 88, 36, 10); ctx.fill();
      ctx.fillStyle = "#93c5fd"; rr(-36, -25, 72, 22, 6); ctx.fill(); ctx.fillStyle = "#111827"; ctx.fillRect(-62, 28, 22, 18); ctx.fillRect(40, 28, 22, 18);
      ctx.fillStyle = "#fde047"; ctx.fillRect(-52, 8, 18, 9); ctx.fillRect(34, 8, 18, 9); ctx.fillStyle = "#f8fafc"; ctx.fillRect(-14, 24, 28, 12);
      ctx.restore();
      if (this.mode === "fall" && this.mt > 0.9 && this.mt < 1.5 && !this.fellText) txt("AAAAH!", carX, 240, 28, "#fff");
      if (this.mode === "fall" && this.mt > 1.2) txt("OFF THE CLIFF!", W / 2, 120, 34, "#fecaca");
      if (this.banner && this.bannerT > 0) { this.bannerT -= dt; txt(this.banner, W / 2, 110, 34, "#bbf7d0"); }
      if (this.ended === "over") { ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(0, 0, W, H); txt("ROAD CLOSED", W / 2, 150, 48, "#fca5a5"); ctx.fillStyle = "#f59e0b"; for (var bq = 0; bq < 6; bq++) ctx.fillRect(160 + bq * 80, 210, 50, 14); }
      if (this.ended === "win") txt("FINISH LINE!", W / 2, 100, 44, "#fef08a");
      for (var s = 0; s < 3; s++) txt(s < G.strikes ? "X" : "o", 28 + s * 26, 22, 20, s < G.strikes ? "#ef4444" : "#94a3b8");
    }
  };

  /* ============================================================ 3. STORM DASH: routing ============== */
  var NODES = { Home: [8, 50], R1: [24, 20], R2: [24, 50], R3: [24, 80], R4: [46, 20], R5: [46, 50], R6: [46, 80], R7: [68, 34], R8: [68, 66], School: [92, 30], Cloud: [92, 70] };
  var EDGES = [["Home", "R1"], ["Home", "R2"], ["Home", "R3"], ["R1", "R2"], ["R2", "R3"], ["R1", "R4"], ["R2", "R5"], ["R3", "R6"], ["R4", "R5"], ["R5", "R6"], ["R4", "R7"], ["R5", "R7"], ["R5", "R8"], ["R6", "R8"], ["R7", "R8"], ["R7", "School"], ["R8", "Cloud"], ["R8", "School"]];
  function linked(a, b) { return EDGES.some(function (e) { return (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a); }); }
  function npos(n) { var p = NODES[n]; return [40 + (W - 80) * p[0] / 100, 50 + (H - 100) * p[1] / 100]; }
  var Storm = {
    q: null, path: [], hover: "", rain: [], lightning: 0, packet: null, result: null, banner: "", bannerT: 0, parts: [], dark: 0, shake: 0, msg: "", msgT: 0, locked: false,
    init: function () { this.rain = []; for (var i = 0; i < 90; i++) this.rain.push({ x: rnd() * W, y: rnd() * H, s: 300 + rnd() * 300 }); this.dark = 0; this.locked = false; },
    begin: function (q) { this.q = q; this.path = q.type === "route" ? [q.src] : []; this.packet = null; this.result = null; this.banner = ""; this.locked = false; this.msg = ""; if (q.type === "route" && q.down.length) { this.lightning = 1; sound("zap"); } },
    getPath: function () { return this.path.slice(); },
    reset: function () { if (this.q && this.q.type === "route") this.path = [this.q.src]; },
    done: function () { return !!this.q && this.q.type === "route" && this.path[this.path.length - 1] === this.q.dst; },
    click: function (x, y) {
      var q = this.q; if (!q || q.type !== "route" || this.locked) return null;
      var hit = ""; Object.keys(NODES).forEach(function (n) { var p = npos(n); if (Math.hypot(p[0] - x, p[1] - y) < 30) hit = n; });
      if (!hit) return null;
      var last = this.path[this.path.length - 1];
      if (hit === last && this.path.length > 1) { this.path.pop(); sound("tick"); return "undo"; }
      if (this.path.indexOf(hit) > -1) return null;
      if (q.down.indexOf(hit) > -1) { this.say(hit + " is down! Route around it."); this.shake = 0.3; sound("bad"); return "down"; }
      if (!linked(last, hit)) { this.say("No cable from " + last + " to " + hit + "."); sound("bad"); return "nolink"; }
      this.path.push(hit); sound("tick"); return "add";
    },
    say: function (m) { this.msg = m; this.msgT = 1.8; },
    verdict: function (ok, r) {
      var q = this.q; this.locked = true;
      if (q.type !== "route") { if (ok) { sound("good"); this.banner = "GOOD ANSWER!"; } else { this.shake = 0.5; sound("bad"); } this.bannerT = 1.4; return; }
      var pts = this.path.slice(), stop = pts.length - 1;
      if (!ok) { for (var k = 0; k < pts.length; k++) { if (q.down.indexOf(pts[k]) > -1 || (k > 0 && !linked(pts[k - 1], pts[k]))) { stop = k - 1; break; } } if (pts.length < 2) stop = 0; }
      this.packet = { i: 0, t: 0, stop: Math.max(0, ok ? pts.length - 1 : Math.min(stop, pts.length - 1)), ok: ok };
      this.banner = ok ? (q.canFail && this.path.length < 2 ? "NO ROUTE: correct!" : "DELIVERED!") : "PACKET LOST!"; this.bannerT = 2.2;
      if (ok) { sound("good"); } else { sound("bad"); this.shake = 0.5; }
    },
    over: function () { this.dark = 1; sound("boom"); },
    win: function () { if (window.FX) window.FX.confetti(120); this.banner = "NETWORK SAVED!"; this.bannerT = 99; sound("win"); },
    frame: function (t, dt) {
      var q = this.q, sh = this.shake > 0 ? (rnd() - 0.5) * this.shake * 18 : 0; this.shake = Math.max(0, this.shake - dt * 1.5); this.lightning = Math.max(0, this.lightning - dt * 2.2); this.msgT -= dt; this.bannerT -= dt;
      ctx.save(); ctx.translate(sh, 0);
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, q && q.down && q.down.length ? "#1b2038" : "#13294b"); g.addColorStop(1, "#0b1228"); ctx.fillStyle = g; ctx.fillRect(-20, 0, W + 40, H);
      ctx.strokeStyle = "rgba(100,140,220,.08)"; ctx.lineWidth = 1; for (var gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); } for (var gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      var down = q && q.down ? q.down : [], pathSet = this.path;
      /* cables */
      EDGES.forEach(function (e) { var a = npos(e[0]), b = npos(e[1]), bad = down.indexOf(e[0]) > -1 || down.indexOf(e[1]) > -1, used = false; for (var i = 0; i < pathSet.length - 1; i++) if ((pathSet[i] === e[0] && pathSet[i + 1] === e[1]) || (pathSet[i] === e[1] && pathSet[i + 1] === e[0])) used = true; ctx.strokeStyle = bad ? "rgba(239,68,68,.35)" : used ? "#34d399" : "#52618f"; ctx.lineWidth = used ? 7 : 3; if (bad) ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]); });
      /* devices */
      Object.keys(NODES).forEach(function (n) {
        var p = npos(n), isDown = down.indexOf(n) > -1, onPath = pathSet.indexOf(n) > -1, end = q && q.type === "route" && (n === q.src || n === q.dst), kind = n === "Home" ? "home" : n === "School" ? "school" : n === "Cloud" ? "cloud" : "router";
        if (onPath) { ctx.strokeStyle = "#34d399"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 27, 0, TAU); ctx.stroke(); }
        if (end && !onPath) { ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 3; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(p[0], p[1], 27, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
        ctx.fillStyle = isDown ? "#3b1d24" : kind === "router" ? "#fbbf24" : kind === "cloud" ? "#a5b4fc" : kind === "school" ? "#f472b6" : "#38bdf8";
        if (kind === "router" || isDown) { ctx.beginPath(); ctx.arc(p[0], p[1], 19, 0, TAU); ctx.fill(); ctx.strokeStyle = isDown ? "#ef4444" : "#92400e"; ctx.lineWidth = 3; ctx.stroke(); }
        else { rr(p[0] - 22, p[1] - 17, 44, 34, 8); ctx.fill(); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 3; ctx.stroke(); }
        if (isDown) { ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.moveTo(p[0] + 4, p[1] - 17); ctx.lineTo(p[0] - 8, p[1] + 2); ctx.lineTo(p[0], p[1] + 2); ctx.lineTo(p[0] - 5, p[1] + 17); ctx.lineTo(p[0] + 10, p[1] - 3); ctx.lineTo(p[0] + 2, p[1] - 3); ctx.closePath(); ctx.fill(); }
        else if (kind === "router") { ctx.strokeStyle = "#78350f"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0] - 9, p[1]); ctx.lineTo(p[0] + 9, p[1]); ctx.moveTo(p[0], p[1] - 9); ctx.lineTo(p[0], p[1] + 9); ctx.stroke(); }
        txt(n === "Home" ? "HOME" : n === "School" ? "SCHOOL" : n === "Cloud" ? "CLOUD" : n, p[0], p[1] + 34, 11, isDown ? "#fca5a5" : "#e2e8f0");
      });
      /* storm */
      if (down.length) { ctx.fillStyle = "rgba(15,20,40,.35)"; ctx.fillRect(-20, 0, W + 40, H); }
      if (down.length || this.dark) { ctx.strokeStyle = "rgba(147,197,253,.55)"; ctx.lineWidth = 1.5; for (var i = 0; i < this.rain.length; i++) { var rn = this.rain[i]; rn.y += rn.s * dt; rn.x -= 60 * dt; if (rn.y > H) { rn.y = -10; rn.x = rnd() * W + 40; } ctx.beginPath(); ctx.moveTo(rn.x, rn.y); ctx.lineTo(rn.x - 4, rn.y + 12); ctx.stroke(); } }
      if (this.lightning > 0) { ctx.fillStyle = "rgba(255,255,255," + this.lightning * 0.22 + ")"; ctx.fillRect(-20, 0, W + 40, H); }
      /* the packet flying along the player's route */
      var pk = this.packet;
      if (pk) {
        var pts = this.path; pk.t += dt * 3.2;
        if (pk.i < pk.stop) { var A = npos(pts[pk.i]), B = npos(pts[pk.i + 1]), f = Math.min(1, pk.t); pk.x = lerp(A[0], B[0], f); pk.y = lerp(A[1], B[1], f); if (pk.t >= 1) { pk.i++; pk.t = 0; } }
        else { var Z = npos(pts[pk.stop]); pk.x = Z[0]; pk.y = Z[1]; if (!pk.ok && !pk.boomed) { pk.boomed = true; spawn(this.parts, Z[0], Z[1], 30, { colors: ["#fb923c", "#fde047", "#ef4444"], speed: 260, life: 0.8, g: 100 }); } if (pk.ok && !pk.cheer) { pk.cheer = true; spawn(this.parts, Z[0], Z[1], 30, { colors: ["#34d399", "#fde047", "#fff"], speed: 240, life: 1, g: 150 }); } }
        if (!pk.boomed) { ctx.fillStyle = "#fbbf24"; rr(pk.x - 14, pk.y - 10, 28, 20, 4); ctx.fill(); ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.moveTo(pk.x - 14, pk.y - 10); ctx.lineTo(pk.x, pk.y + 2); ctx.lineTo(pk.x + 14, pk.y - 10); ctx.stroke(); }
      }
      stepParts(this.parts, dt); drawParts(this.parts);
      if (this.msgT > 0 && this.msg) { ctx.fillStyle = "rgba(0,0,0,.65)"; rr(W / 2 - 200, H - 44, 400, 30, 8); ctx.fill(); txt(this.msg, W / 2, H - 29, 13, "#fde68a"); }
      if (this.banner && this.bannerT > 0) txt(this.banner, W / 2, 28, 28, this.banner.indexOf("LOST") > -1 ? "#fecaca" : "#bbf7d0");
      if (this.dark) { ctx.fillStyle = "rgba(0,0,0," + 0.55 * this.dark + ")"; ctx.fillRect(-20, 0, W + 40, H); txt("NETWORK DOWN", W / 2, H / 2, 46, "#fca5a5"); }
      ctx.restore();
      for (var s = 0; s < 3; s++) txt(s < G.strikes ? "X" : "o", 24 + s * 24, 18, 18, s < G.strikes ? "#ef4444" : "#94a3b8");
    }
  };

  /* ============================================================ 4. PACKET POST OFFICE =============== */
  var Post = {
    off: 0, jam: 0, truck: 0, truckGo: false, sacks: [], parts: [], q: null, banner: "", bannerT: 0, shake: 0, pile: 0, ended: "", crates: [],
    init: function () { this.off = 0; this.jam = 0; this.truck = 0; this.truckGo = false; this.crates = []; this.pile = 0; this.ended = ""; },
    begin: function (q) { this.q = q; this.jam = 0; this.crates = []; for (var i = 0; i < 5; i++) this.crates.push({ x: -40 - i * 140, c: ["#fbbf24", "#f59e0b", "#fb923c", "#fde68a"][i % 4], n: 1 + ((i * 7) % 9) }); },
    verdict: function (ok) { if (ok) { this.truckGo = true; this.truck = 0; this.banner = "DELIVERED!"; this.bannerT = 1.6; sound("good"); } else { this.jam = 1.6; this.shake = 0.6; this.pile = Math.min(5, this.pile + 1); this.banner = "MAIL JAM!"; this.bannerT = 1.6; sound("bad"); } },
    over: function () { this.ended = "over"; this.pile = 7; sound("boom"); },
    win: function () { this.ended = "win"; this.truckGo = true; this.truck = 0; if (window.FX) window.FX.confetti(120); sound("win"); },
    frame: function (t, dt) {
      var sh = this.shake > 0 ? (rnd() - 0.5) * this.shake * 18 : 0; this.shake = Math.max(0, this.shake - dt * 1.6); this.bannerT -= dt;
      var run = this.jam <= 0 && this.ended !== "over"; if (this.jam > 0) this.jam -= dt; if (run) this.off = (this.off + dt * 110) % 40;
      ctx.save(); ctx.translate(sh, 0);
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1e293b"); g.addColorStop(1, "#0f172a"); ctx.fillStyle = g; ctx.fillRect(-20, 0, W + 40, H);
      ctx.fillStyle = "#334155"; ctx.fillRect(0, 60, W, 120); ctx.fillStyle = "#475569"; for (var wx = 30; wx < W; wx += 120) ctx.fillRect(wx, 80, 70, 60);
      ctx.fillStyle = "#1e293b"; ctx.fillRect(0, 60, W, 14); txt("PACKET POST OFFICE", 400, 36, 22, "#fbbf24");
      /* the conveyor belt */
      ctx.fillStyle = "#111827"; ctx.fillRect(0, 215, W, 70); ctx.fillStyle = "#1f2937"; for (var x = -40 + this.off; x < W; x += 40) ctx.fillRect(x, 215, 4, 70);
      ctx.fillStyle = "#0b1220"; ctx.fillRect(0, 285, W, 12); ctx.fillStyle = "#475569"; for (var rx = 30; rx < W; rx += 110) { ctx.beginPath(); ctx.arc(rx, 291, 8, 0, TAU); ctx.fill(); }
      var sp = run ? 150 : 0;
      this.crates.forEach(function (c) { c.x += sp * dt; if (c.x > W + 40) c.x = -80; ctx.fillStyle = c.c; rr(c.x, 185, 54, 40, 5); ctx.fill(); ctx.strokeStyle = "#92400e"; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.moveTo(c.x, 185); ctx.lineTo(c.x + 27, 207); ctx.lineTo(c.x + 54, 185); ctx.stroke(); txt("#" + c.n, c.x + 27, 217, 11, "#451a03"); });
      /* the truck */
      var tx = 600; if (this.truckGo) { this.truck += dt; tx = 600 + Math.max(0, this.truck - 0.5) * 520; if (this.truck > 2.4) { this.truckGo = false; this.truck = 0; } }
      ctx.fillStyle = "#e11d48"; rr(tx, 300, 130, 46, 6); ctx.fill(); ctx.fillStyle = "#fb7185"; rr(tx + 130, 312, 42, 34, 6); ctx.fill(); ctx.fillStyle = "#bae6fd"; ctx.fillRect(tx + 140, 317, 24, 14);
      ctx.fillStyle = "#0b1220"; [tx + 26, tx + 100, tx + 148].forEach(function (wx) { ctx.beginPath(); ctx.arc(wx, 348, 11, 0, TAU); ctx.fill(); }); txt("MAIL", tx + 65, 323, 14, "#fff");
      /* jam sign and overflow */
      if (this.jam > 0 || this.ended === "over") { var bl = Math.floor(Date.now() / 150) % 2; ctx.fillStyle = bl ? "#ef4444" : "#7f1d1d"; rr(310, 100, 180, 42, 8); ctx.fill(); txt("JAM!", 400, 122, 26, "#fff"); }
      for (var p = 0; p < this.pile; p++) { ctx.fillStyle = ["#fbbf24", "#f59e0b", "#fb923c"][p % 3]; rr(60 + p * 62 + (p % 2) * 14, 250 - (p % 3) * 6, 50, 36, 5); ctx.fill(); ctx.strokeStyle = "#92400e"; ctx.lineWidth = 3; ctx.stroke(); }
      if (this.ended === "over") { ctx.fillStyle = "rgba(0,0,0,.5)"; ctx.fillRect(-20, 0, W + 40, H); txt("TOO MUCH MAIL!", 400, 160, 42, "#fca5a5"); }
      if (this.ended === "win") txt("ALL MAIL DELIVERED!", 400, 120, 36, "#fef08a");
      if (this.banner && this.bannerT > 0 && !this.ended) txt(this.banner, 400, 118, 32, this.banner.indexOf("JAM") > -1 ? "#fecaca" : "#bbf7d0");
      ctx.restore();
      for (var s = 0; s < 3; s++) txt(s < G.strikes ? "X" : "o", 24 + s * 24, 18, 18, s < G.strikes ? "#ef4444" : "#94a3b8");
    }
  };

  /* ============================================================ 5. CARTOON CAST DIRECTOR ============ */
  var Cast = {
    q: null, cast: [], bob: 0, stars: [], slip: 0, frames: [], banner: "", bannerT: 0, shake: 0, ended: "", spot: 0.5, closed: 0, parts: [],
    init: function () { this.frames = []; this.ended = ""; this.closed = 0; },
    begin: function (q) { this.q = q; var list = q.cast || (q.type === "ops" ? q.start.map(function (n) { var k = window.Chars.CAST[n]; return { name: n, kind: k[0], color: k[1] }; }) : []); this.cast = list; this.slip = 0; this.banner = ""; },
    verdict: function (ok) { if (ok) { this.banner = "BRAVO!"; this.bannerT = 1.4; this.frames.push((this.q && this.q.cast && this.q.cast.length ? this.q.cast : this.cast)[this.frames.length % Math.max(1, this.cast.length)] || null); spawn(this.parts, 400, 160, 30, { colors: ["#fde047", "#f472b6", "#38bdf8", "#fff"], speed: 260, life: 1, g: 140 }); sound("good"); } else { this.slip = 1.2; this.shake = 0.4; this.banner = "OOPS!"; this.bannerT = 1.4; sound("bad"); } },
    over: function () { this.ended = "over"; sound("boom"); },
    win: function () { this.ended = "win"; if (window.FX) window.FX.confetti(120); sound("win"); },
    frame: function (t, dt) {
      this.bob += dt; this.bannerT -= dt; this.slip = Math.max(0, this.slip - dt); this.shake = Math.max(0, this.shake - dt * 1.5);
      var sh = this.shake > 0 ? (rnd() - 0.5) * this.shake * 16 : 0; ctx.save(); ctx.translate(sh, 0);
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#3b0764"); g.addColorStop(1, "#1e1b4b"); ctx.fillStyle = g; ctx.fillRect(-20, 0, W + 40, H);
      /* spotlights */
      ctx.fillStyle = "rgba(255,240,180,.10)"; ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(60, 300); ctx.lineTo(300, 300); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(650, 0); ctx.lineTo(500, 300); ctx.lineTo(740, 300); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#7c3aed"; ctx.fillRect(0, 285, W, 100); ctx.fillStyle = "#6d28d9"; for (var px = 0; px < W; px += 50) ctx.fillRect(px, 285, 24, 100);
      /* curtains */
      var cw = 62 + (this.ended ? this.closed * 340 : 0); if (this.ended) this.closed = Math.min(1, this.closed + dt * 0.5);
      ctx.fillStyle = "#be123c"; ctx.fillRect(0, 0, cw, 300); ctx.fillRect(W - cw, 0, cw, 300); ctx.fillStyle = "#9f1239"; for (var cx = 8; cx < cw; cx += 18) { ctx.fillRect(cx, 0, 4, 300); ctx.fillRect(W - cx - 4, 0, 4, 300); } ctx.fillStyle = "#e11d48"; ctx.fillRect(0, 0, W, 22);
      /* the cast */
      var n = this.cast.length, gap = Math.min(150, 560 / Math.max(1, n)), x0 = W / 2 - (n - 1) * gap / 2;
      for (var i = 0; i < n; i++) {
        var c = this.cast[i], bx = x0 + i * gap, by = 150 + Math.sin(this.bob * 3 + i) * 4, mood = this.slip > 0 && i === Math.min(n - 1, 1) ? "surprised" : "happy";
        ctx.save(); if (this.slip > 0 && i === Math.min(n - 1, 1)) { ctx.translate(bx, 270); ctx.rotate(Math.sin(this.slip * 9) * 0.5); ctx.translate(-bx, -270); }
        window.Chars.draw(ctx, c.kind, bx, by, c.color, this.ended === "over" ? "sad" : mood, 62); ctx.restore();
        txt(c.name, bx, 292, 12, "#e9d5ff");
      }
      if (this.slip > 0) { ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.ellipse(x0 + Math.min(n - 1, 1) * gap + 40, 288, 26, 9, 0.3, 0, TAU); ctx.fill(); txt("slip!", x0 + Math.min(n - 1, 1) * gap + 40, 288, 10, "#78350f"); }
      /* the film strip at the bottom: one frame for every right answer */
      ctx.fillStyle = "#111"; ctx.fillRect(0, 332, W, 48); ctx.fillStyle = "#334155"; for (var f = 0; f < 10; f++) { ctx.fillRect(14 + f * 78, 338, 70, 36); }
      this.frames.forEach(function (c, f) { ctx.fillStyle = "#c4b5fd"; ctx.fillRect(14 + f * 78, 338, 70, 36); if (c) window.Chars.draw(ctx, c.kind, 49 + f * 78, 351, c.color, "happy", 22); });
      for (var f2 = 0; f2 < 10; f2++) txt(String(f2 + 1), 22 + f2 * 78, 384, 9, "#64748b");
      stepParts(this.parts, dt); drawParts(this.parts);
      if (this.banner && this.bannerT > 0) txt(this.banner, 400, 60, 34, this.banner === "OOPS!" ? "#fecaca" : "#fde68a");
      if (this.ended === "over") txt("CANCELLED!", 400, 100, 44, "#fca5a5");
      if (this.ended === "win") txt("PREMIERE NIGHT!", 400, 100, 44, "#fde68a");
      ctx.restore();
      for (var s = 0; s < 3; s++) txt(s < G.strikes ? "X" : "o", 24 + s * 24, 38, 18, s < G.strikes ? "#ef4444" : "#94a3b8");
    }
  };

  window.Scenes = { bomb: Bomb, dns: Cliff, storm: Storm, packets: Post, cast: Cast, W: W, H: H,
    setup: function (context, state) { ctx = context; G = state; Object.keys(this).forEach(function (k) { var s = window.Scenes[k]; if (s && s.init) s.init(); }); },
    NODES: NODES, EDGES: EDGES, linked: linked, npos: npos };
})();
