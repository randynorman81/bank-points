/* THE UNIT 3 ARCADE GAMES (part 1): the shared toolkit and games 3.1 to 3.7.
   Every game turns the server's question into something to PLAY: the four answers are in the game world (pipe windows, lily pads, capsules, asteroids, ...) and the
   player makes their answer by doing something in the game. The answer is still judged by the server (engine.js sends it with PGE.submit), so nothing about the questions changed.
   Each game is a scene like the ones in scenes.js: begin(q), verdict(ok), over(), win(), frame(t, dt). K.make() fills in the common parts.
   window.__arc is the hook for the automated tests (tools/missions/arcplay.mjs): __arc.auto(idx) makes the game play itself toward answer idx using the game's own controls. */
(function () {
  "use strict";
  var W = 800, H = 380, TAU = Math.PI * 2, ctx = null, G = { strikes: 0, correct: 0, n: 0 };
  var OC = ["#38bdf8", "#f472b6", "#a3e635", "#fbbf24"], LET = ["A", "B", "C", "D"];
  var K = window.ArcadeKit = { W: W, H: H, TAU: TAU, OC: OC, LET: LET, cur: null, keys: {}, mouse: { x: W / 2, y: H / 2, down: false }, games: {} };
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function txt(s, x, y, size, color, align) { ctx.font = "700 " + size + 'px "Silkscreen","JetBrains Mono",monospace'; ctx.fillStyle = color || "#fff"; ctx.textAlign = align || "center"; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); }
  function sound(n) { if (window.Snd && window.Snd[n]) window.Snd[n](); }
  function wrap(text, maxW, size) { ctx.font = "700 " + size + 'px "JetBrains Mono",monospace'; var words = String(text).split(" "), lines = [], cur = ""; words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); lines.push(cur); return lines; }
  /* an answer label that shrinks and wraps until it fits the box */
  function label(text, cx, cy, maxW, maxH, color, maxSize) {
    var size = maxSize || 15, lines;
    for (; size >= 8; size--) { lines = wrap(text, maxW, size); if (lines.length * size * 1.25 <= maxH && lines.every(function (l) { return ctx.measureText(l).width <= maxW; })) break; }
    if (!(lines.length * size * 1.25 <= maxH && lines.every(function (l) { return ctx.measureText(l).width <= maxW; }))) { size = 9; lines = wrap(text, maxW, size); var ml = Math.max(1, Math.floor(maxH / (size * 1.25))); if (lines.length > ml) { lines = lines.slice(0, ml); var ll = lines[ml - 1]; while (ll.length > 1 && ctx.measureText(ll + "\u2026").width > maxW) ll = ll.slice(0, -1); lines[ml - 1] = ll + "\u2026"; } }   /* too long even at the smallest size: cut it with "..." (the full answer is listed under the game) */
    ctx.font = "700 " + size + 'px "JetBrains Mono",monospace'; ctx.fillStyle = color || "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var y0 = cy - (lines.length - 1) * size * 0.625; lines.forEach(function (l, i) { ctx.fillText(l, cx, y0 + i * size * 1.25); });
  }
  function badge(i, x, y, r) { ctx.fillStyle = OC[i]; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.lineWidth = 2; ctx.stroke(); txt(LET[i], x, y + 1, r * 1.15, "#0f172a"); }
  /* the list of answers on the right (snake and maze) */
  function legend(opts, x, y, w) {
    ctx.fillStyle = "rgba(2,6,23,.86)"; rr(x, y, w, H - 2 * y, 12); ctx.fill(); ctx.strokeStyle = "#334155"; ctx.lineWidth = 2; ctx.stroke(); txt("ANSWERS", x + w / 2, y + 18, 12, "#94a3b8");
    var rowH = (H - 2 * y - 36) / opts.length; opts.forEach(function (o, i) { var cy = y + 36 + rowH * i + rowH / 2; badge(i, x + 24, cy, 14); label(o, x + 28 + (w - 38) / 2 + 12, cy, w - 62, rowH - 8, "#e2e8f0", 14); });
  }
  function spawn(list, x, y, n, o) { o = o || {}; var cols = o.colors || ["#fff"]; for (var i = 0; i < n; i++) { var a = Math.random() * TAU, sp = (o.speed || 200) * (0.3 + Math.random()); list.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (o.up || 0), g: o.g === undefined ? 300 : o.g, life: 0, max: (o.life || 0.8) * (0.6 + Math.random() * 0.6), s: (o.size || 5) * (0.6 + Math.random()), c: cols[i % cols.length] }); } }
  function stepParts(l, dt) { for (var i = l.length - 1; i >= 0; i--) { var p = l[i]; p.life += dt; p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.life > p.max) l.splice(i, 1); } }
  function drawParts(l) { l.forEach(function (p) { ctx.globalAlpha = clamp(1 - p.life / p.max, 0, 1); ctx.fillStyle = p.c; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }); ctx.globalAlpha = 1; }
  Object.assign(K, { clamp: clamp, rr: rr, txt: txt, sound: sound, label: label, badge: badge, legend: legend, spawn: spawn, wrap: wrap, ctxGet: function () { return ctx; } });

  /* answer committed by doing something in the game: the server judges it */
  K.commit = function (sc, idx) { if (!sc.live || sc.locked || !sc.q) return false; sc.locked = true; sc.chosen = idx; window.PGE.submit({ idx: idx }); return true; };

  /* ---- a scene made from a spec: the common parts are filled in ---- */
  K.make = function (id, spec) {
    var info = (window.ArcadeInfo && window.ArcadeInfo[id]) || {};
    var s = Object.assign({ arcade: true, id: id, help: info.help || "", live: false, locked: false, parts: [], flash: 0, flashC: "255,40,40", shake: 0, res: [], ended: "", q: null, time: 0, bot: null, focus: [W / 2, H / 2] }, spec);
    s.init = function () { this.live = false; this.locked = false; this.parts = []; this.res = []; this.ended = ""; this.flash = 0; this.shake = 0; this.q = null; this.bot = null; this.time = 0; if (this.reset) this.reset(); };
    s.begin = function (q) { K.cur = this; this.q = q; this.opts = q.choices || []; this.n = this.opts.length; this.live = true; this.locked = false; this.bot = null; this.chosen = -1; this.build(q); };
    s.verdict = function (ok) {
      this.res.push(ok); this.live = false; var f = this.focus || [W / 2, H / 2];
      if (ok) { this.flash = 0.6; this.flashC = "60,255,120"; spawn(this.parts, f[0], f[1], 28, { colors: ["#4ade80", "#fde047", "#fff"], speed: 240, life: 0.9, g: 220 }); sound("good"); }
      else { this.flash = 1; this.flashC = "255,40,40"; this.shake = 0.6; spawn(this.parts, f[0], f[1], 16, { colors: ["#f87171", "#fca5a5"], speed: 200, life: 0.7, g: 260 }); sound("bad"); }
      if (this.after) this.after(ok);
    };
    s.over = function () { this.ended = "over"; sound("boom"); };
    s.win = function () { this.ended = "win"; if (window.FX) window.FX.confetti(140); sound("win"); };
    s.frame = function (t, dt) {
      dt = Math.min(dt || 0.016, 0.05); if (!this.q) { ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, W, H); return; }
      this.time += dt; if (this.live) this.step(dt);
      this.flash = Math.max(0, this.flash - dt * 1.8); this.shake = Math.max(0, this.shake - dt * 1.6);
      ctx.save(); if (this.shake > 0) ctx.translate((Math.random() - 0.5) * this.shake * 16, (Math.random() - 0.5) * this.shake * 10);
      this.draw(this.time, dt); stepParts(this.parts, dt); drawParts(this.parts);
      if (this.flash > 0) { ctx.fillStyle = "rgba(" + this.flashC + "," + this.flash * 0.3 + ")"; ctx.fillRect(-20, -20, W + 40, H + 40); }
      ctx.restore();
      txt("ROUND " + Math.min(10, G.n + 1) + " / 10", W - 70, 16, 11, "rgba(255,255,255,.85)");
      if (this.ended === "over") { ctx.fillStyle = "rgba(127,29,29,.6)"; ctx.fillRect(0, 0, W, H); txt("GAME OVER", W / 2, H / 2, 60, "#fff"); }
      if (this.ended === "win") { txt("YOU WIN!", W / 2, 58, 46, "#fde68a"); }
    };
    window.Scenes[id] = s; K.games[id] = s; return s;
  };

  /* ---- input: keyboard and pointer go to the game on screen ---- */
  var KEYS = { Space: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 };
  window.addEventListener("keydown", function (e) { var c = K.cur; if (!c || !c.arcade) return; K.keys[e.code] = true; if (c.live && KEYS[e.code]) e.preventDefault(); if (c.live && !e.repeat && c.key) c.key(e); });
  window.addEventListener("keyup", function (e) { K.keys[e.code] = false; });
  window.addEventListener("blur", function () { K.keys = {}; });
  function ptr(e) { var cv = document.getElementById("stage"), r = cv.getBoundingClientRect(); K.mouse.x = (e.clientX - r.left) * W / r.width; K.mouse.y = (e.clientY - r.top) * H / r.height; }
  (function () {
    var cv = document.getElementById("stage"); if (!cv) return; cv.style.touchAction = "none";
    cv.addEventListener("pointerdown", function (e) { ptr(e); K.mouse.down = true; var c = K.cur; if (c && c.arcade && c.live && c.down) c.down(K.mouse.x, K.mouse.y); });
    cv.addEventListener("pointermove", function (e) { ptr(e); var c = K.cur; if (c && c.arcade && c.live && c.move) c.move(K.mouse.x, K.mouse.y); });
    window.addEventListener("pointerup", function () { K.mouse.down = false; var c = K.cur; if (c && c.arcade && c.up) c.up(); });
  })();
  /* wrap Scenes.setup so the kit also gets the canvas context and the live game state */
  var baseSetup = window.Scenes.setup; window.Scenes.setup = function (c, s) { ctx = c; G = s; K.ctx = c; K.G = s; return baseSetup.apply(this, arguments); };
  window.__arc = { auto: function (i) { var c = K.cur; if (c) c.bot = i; }, cur: function () { return K.cur; }, kit: K };

  /* ============================================================ 3.1 FLAPPY VARIABLE ============ */
  K.make("u3l1", {
    build: function () { var n = this.n, bl = 12; this.bl = bl; this.gh = (H - 30 - (n + 1) * bl) / n; this.bird = { x: 170, y: H / 2, vy: 0 }; this.col = { x: W + 30, w: 150, v: 120 }; this.clouds = [{ x: 90, y: 60 }, { x: 420, y: 110 }, { x: 690, y: 48 }]; this.wing = 0; },
    gapTop: function (i) { return 6 + this.bl * (i + 1) + this.gh * i; },
    flap: function (weak) { this.bird.vy = weak ? -170 : -240; this.wing = 0.18; },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") this.flap(); },
    down: function () { this.flap(); },
    crash: function () { this.flash = 0.7; this.flashC = "255,60,60"; spawn(this.parts, this.bird.x, this.bird.y, 14, { colors: ["#fde047", "#f97316"], speed: 160 }); sound("bad"); this.bird.y = H / 2; this.bird.vy = 0; this.col.x = W + 30; },
    step: function (dt) {
      var b = this.bird, c = this.col, r = 11, i; this.wing = Math.max(0, this.wing - dt);
      if (this.bot !== null) { var ty = this.gapTop(this.bot) + this.gh / 2; if (b.y > ty + 4 && b.vy > 0) this.flap(true); }
      b.vy += 700 * dt; b.y += b.vy * dt; if (b.y > H - 30) { b.y = H - 30; b.vy = 0; } if (b.y < r) { b.y = r; b.vy = 0; }
      c.x -= c.v * dt; if (c.x < -c.w) c.x = W + 30;
      if (b.x + r > c.x && b.x - r < c.x + c.w) {
        var g = -1; for (i = 0; i < this.n; i++) { var t = this.gapTop(i); if (b.y - r >= t && b.y + r <= t + this.gh) g = i; }
        if (g < 0) { this.crash(); return; }
        if (b.x > c.x + c.w / 2) { this.focus = [b.x, b.y]; K.commit(this, g); }
      }
    },
    draw: function (t, dt) {
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#38bdf8"); g.addColorStop(1, "#bae6fd"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      this.clouds.forEach(function (c) { c.x -= 14 * dt; if (c.x < -90) c.x = W + 60; ctx.fillStyle = "rgba(255,255,255,.85)"; [[0, 0, 26], [28, 6, 22], [-28, 8, 20], [8, -12, 20]].forEach(function (p) { ctx.beginPath(); ctx.arc(c.x + p[0], c.y + p[1], p[2], 0, TAU); ctx.fill(); }); });
      ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.moveTo(0, H - 20); for (var x = 0; x <= W; x += 40) ctx.lineTo(x, H - 50 - 14 * Math.sin(x / 90)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
      var c = this.col, n = this.n, i;
      for (i = 0; i <= n; i++) {
        var y0 = i === 0 ? 0 : this.gapTop(i - 1) + this.gh, y1 = i === n ? H - 20 : this.gapTop(i); ctx.fillStyle = "#22c55e"; ctx.fillRect(c.x, y0, c.w, y1 - y0); ctx.fillStyle = "#4ade80"; ctx.fillRect(c.x + 6, y0, 10, y1 - y0); ctx.strokeStyle = "#14532d"; ctx.lineWidth = 3; ctx.strokeRect(c.x, y0, c.w, y1 - y0);
      }
      for (i = 0; i < n; i++) { var gt = this.gapTop(i); ctx.fillStyle = "rgba(15,23,42,.78)"; ctx.fillRect(c.x + 3, gt, c.w - 6, this.gh); badge(i, c.x + 20, gt + this.gh / 2, 11); label(this.opts[i], c.x + 20 + (c.w - 30) / 2 + 6, gt + this.gh / 2, c.w - 52, this.gh - 6, "#f8fafc", 13); }
      ctx.fillStyle = "#65a30d"; ctx.fillRect(0, H - 20, W, 20); ctx.fillStyle = "#4d7c0f"; ctx.fillRect(0, H - 20, W, 4);
      var b = this.bird; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(clamp(b.vy / 600, -0.5, 0.9));
      ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, TAU); ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#fb923c"; ctx.beginPath(); ctx.moveTo(10, -1); ctx.lineTo(21, 3); ctx.lineTo(10, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(5, -5, 5, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(7, -5, 2, 0, TAU); ctx.fill();
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.ellipse(-4, this.wing > 0 ? -4 : 4, 8, 5, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
  });

  /* ============================================================ 3.2 TYPE CROSSING (frogger) ============ */
  K.make("u3l2", {
    CELL: 50, COLS: 16, TOP: 30,
    build: function () {
      var rows = [6, 5, 4, 3, 2, 1], sp = [90, -120, 75, -150, 105, -85]; this.lanes = [];
      for (var l = 0; l < 5; l++) { var cars = [], k = 2 + (l % 2), v = sp[l], gap = (W + 200) / k; for (var c = 0; c < k; c++) cars.push({ x: c * gap + l * 61 - 100, w: 70 + (l % 3) * 10, col: ["#ef4444", "#3b82f6", "#f59e0b", "#a855f7", "#14b8a6"][(c + l) % 5] }); this.lanes.push({ r: l + 1, v: v, cars: cars }); }
      this.frog = { c: 7, r: 6, hop: 0 }; this.pw = Math.floor(this.COLS / this.n); this.dead = 0;
    },
    pad: function (c) { return Math.min(this.n - 1, Math.floor(c / this.pw)); },
    key: function (e) {
      var f = this.frog; if (this.dead > 0) return;
      if (e.code === "ArrowUp") f.r = Math.max(0, f.r - 1); else if (e.code === "ArrowDown") f.r = Math.min(6, f.r + 1); else if (e.code === "ArrowLeft") f.c = Math.max(0, f.c - 1); else if (e.code === "ArrowRight") f.c = Math.min(this.COLS - 1, f.c + 1); else return;
      f.hop = 0.12; sound("tick");
      if (f.r === 0) { this.focus = [f.c * this.CELL + 25, this.TOP + 25]; K.commit(this, this.pad(f.c)); }
    },
    hitCar: function () { var f = this.frog, fx = f.c * this.CELL + 25, fy = this.TOP + f.r * this.CELL + 25; for (var i = 0; i < this.lanes.length; i++) { var L = this.lanes[i]; if (L.r !== f.r) continue; for (var j = 0; j < L.cars.length; j++) { var c = L.cars[j]; if (Math.abs(fx - (c.x + c.w / 2)) < c.w / 2 + 12) return true; } } return false; },
    botMove: function () {
      if (this.botCd > 0) return; var f = this.frog, self = this, tc = this.bot * this.pw + Math.floor(this.pw / 2);
      if (f.r === 6 && f.c !== tc) { this.key({ code: f.c < tc ? "ArrowRight" : "ArrowLeft" }); this.botCd = 0.06; return; }
      var safe = function (row) { var fx = f.c * self.CELL + 25, ok = true; self.lanes.forEach(function (L) { if (L.r !== row) return; L.cars.forEach(function (c) { if (Math.abs(fx - (c.x + c.w / 2)) < c.w / 2 + 52) ok = false; }); }); return ok; };
      if (f.r > 0 && f.r < 6 && !safe(f.r)) { if (safe(f.r - 1)) this.key({ code: "ArrowUp" }); else if (safe(f.r + 1)) this.key({ code: "ArrowDown" }); this.botCd = 0.08; return; }
      if (safe(f.r - 1)) { this.key({ code: "ArrowUp" }); this.botCd = 0.08; }
    },
    step: function (dt) {
      var f = this.frog; f.hop = Math.max(0, f.hop - dt); this.botCd = Math.max(0, (this.botCd || 0) - dt);
      this.lanes.forEach(function (L) { L.cars.forEach(function (c) { c.x += L.v * dt; if (c.x > W + 100) c.x -= W + 200; if (c.x < -100) c.x += W + 200; }); });
      if (this.dead > 0) { this.dead -= dt; if (this.dead <= 0) { this.frog = { c: 7, r: 6, hop: 0 }; } return; }
      if (this.bot !== null) this.botMove();
      if (f.r > 0 && this.hitCar()) { this.dead = 0.7; spawn(this.parts, f.c * this.CELL + 25, this.TOP + f.r * this.CELL + 25, 18, { colors: ["#4ade80", "#166534", "#fff"], speed: 220 }); sound("bad"); this.shake = 0.3; }
    },
    draw: function (t) {
      var C = this.CELL, T = this.TOP, i, c; ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H);
      /* pads (top row) */
      ctx.fillStyle = "#0e7490"; ctx.fillRect(0, T, W, C);
      for (i = 0; i < this.n; i++) { var x0 = i * this.pw * C, w = (i === this.n - 1 ? this.COLS - i * this.pw : this.pw) * C; ctx.fillStyle = "#16a34a"; rr(x0 + 6, T + 5, w - 12, C - 10, 14); ctx.fill(); ctx.strokeStyle = "#14532d"; ctx.lineWidth = 3; ctx.stroke(); badge(i, x0 + 24, T + C / 2, 13); label(this.opts[i], x0 + 30 + (w - 36) / 2, T + C / 2, w - 66, C - 14, "#f0fdf4", 14); }
      /* road */
      for (var r = 1; r <= 5; r++) { ctx.fillStyle = "#334155"; ctx.fillRect(0, T + r * C, W, C); ctx.fillStyle = "rgba(250,250,250,.5)"; if (r < 5) for (var x = 0; x < W; x += 60) ctx.fillRect(x, T + (r + 1) * C - 2, 30, 3); }
      ctx.fillStyle = "#4d7c0f"; ctx.fillRect(0, T + 6 * C, W, C); ctx.fillStyle = "#65a30d"; for (i = 0; i < W; i += 24) ctx.fillRect(i, T + 6 * C + (i % 48 ? 8 : 20), 6, 6);
      this.lanes.forEach(function (L) { L.cars.forEach(function (c) { var y = T + L.r * C + 8; ctx.fillStyle = c.col; rr(c.x, y, c.w, C - 16, 8); ctx.fill(); ctx.fillStyle = "rgba(186,230,253,.9)"; var fw = L.v > 0 ? c.w - 26 : 8; ctx.fillRect(c.x + (L.v > 0 ? c.w - 24 : 6), y + 5, 18, C - 26); ctx.fillStyle = "#111"; ctx.fillRect(c.x + 8, y + C - 18, 12, 4); ctx.fillRect(c.x + c.w - 20, y + C - 18, 12, 4); }); });
      if (this.dead <= 0) { var f = this.frog, fx = f.c * C + 25, fy = T + f.r * C + 25 - (f.hop > 0 ? 8 : 0); ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.ellipse(fx, fy, 16, 14, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "#14532d"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(fx - 7, fy - 11, 5, 0, TAU); ctx.arc(fx + 7, fy - 11, 5, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(fx - 7, fy - 11, 2, 0, TAU); ctx.arc(fx + 7, fy - 11, 2, 0, TAU); ctx.fill(); }
    }
  });

  /* ============================================================ 3.3 INPUT CLAW MACHINE ============ */
  K.make("u3l3", {
    build: function () { this.claw = { x: W / 2, y: 40, st: "idle", grab: -1, mx: W / 2 }; this.floorY = H - 112; },
    cx: function (i) { return (i + 0.5) * W / this.n; },
    drop: function () { var c = this.claw; if (c.st === "idle") { c.st = "down"; sound("tick"); } },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowDown") this.drop(); },
    down: function () { this.drop(); },
    move: function (x) { if (this.claw.st === "idle") this.claw.mx = clamp(x, 40, W - 40); },
    step: function (dt) {
      var c = this.claw, i;
      if (c.st === "idle") {
        if (this.bot !== null) { var tx = this.cx(this.bot); if (Math.abs(c.x - tx) < 6) this.drop(); else c.x += Math.sign(tx - c.x) * 260 * dt; }
        else { var kk = false; if (K.keys.ArrowLeft) { c.x -= 260 * dt; kk = true; } if (K.keys.ArrowRight) { c.x += 260 * dt; kk = true; } if (kk) c.mx = c.x; else if (this.useMouse) c.x += (c.mx - c.x) * Math.min(1, dt * 9); }
        c.x = clamp(c.x, 40, W - 40);
      } else if (c.st === "down") { c.y += 330 * dt; if (c.y >= this.floorY) { c.y = this.floorY; var best = -1; for (i = 0; i < this.n; i++) if (Math.abs(c.x - this.cx(i)) < 60) best = i; c.grab = best; c.st = "up"; sound(best >= 0 ? "zap" : "bad"); } }
      else if (c.st === "up") { c.y -= 330 * dt; if (c.y <= 40) { c.y = 40; if (c.grab >= 0) { this.focus = [c.x, c.y + 20]; K.commit(this, c.grab); c.st = "done"; } else c.st = "idle"; } }
    },
    draw: function (t) {
      var c = this.claw, i, bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1e1b4b"); bg.addColorStop(1, "#312e81"); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0f172a"; ctx.fillRect(0, H - 66, W, 66); for (i = 0; i < 16; i++) { ctx.fillStyle = i % 2 ? "#f472b6" : "#38bdf8"; ctx.fillRect(i * 52 + 8, 14, 30, 8); }
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 36); ctx.lineTo(W, 36); ctx.stroke();
      for (i = 0; i < this.n; i++) {
        var x = this.cx(i), lifted = c.grab === i && (c.st === "up" || c.st === "done"), y = lifted ? c.y + 50 : this.floorY + 30, w = Math.min(170, W / this.n - 16);
        ctx.fillStyle = OC[i]; rr(x - w / 2, y - 36, w, 72, 24); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.32)"; rr(x - w / 2 + 6, y - 32, w - 12, 20, 10); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.5)"; ctx.lineWidth = 3; rr(x - w / 2, y - 36, w, 72, 24); ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.82)"; rr(x - w / 2 + 8, y - 22, w - 16, 44, 12); ctx.fill(); label(this.opts[i], x, y, w - 28, 40, "#f8fafc", 14);
      }
      ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(c.x, 36); ctx.lineTo(c.x, c.y); ctx.stroke();
      var open = c.st === "down" ? 1 : c.st === "idle" ? 0.7 : (c.grab >= 0 ? 0.15 : 0.9);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 7; ctx.lineCap = "round"; [-1, 1].forEach(function (s) { ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + s * 28 * open, c.y + 24); ctx.lineTo(c.x + s * 14 * open, c.y + 44); ctx.stroke(); }); ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.arc(c.x, c.y, 9, 0, TAU); ctx.fill(); ctx.lineCap = "butt";
      if (c.st === "idle" && this.bot === null && !this.hinted) txt("move the claw, then SPACE", W / 2, 70, 13, "#a5b4fc");
    },
    reset: function () { this.useMouse = false; }
  });
  (function () { var s = K.games.u3l3, mv = s.move; s.move = function (x, y) { this.useMouse = true; mv.call(this, x, y); }; })();

  /* ============================================================ 3.4 ASTEROID JOINER (shooter) ============ */
  K.make("u3l4", {
    build: function () { this.ship = { x: W / 2, cd: 0 }; this.bullets = []; this.rocks = []; for (var i = 0; i < this.n; i++) this.rocks.push({ x: (i + 0.5) * W / this.n, y: 62, vy: 14 + i * 2, a: Math.random() * 6, dead: false }); this.stars = []; for (var s = 0; s < 50; s++) this.stars.push([Math.random() * W, Math.random() * H, Math.random() * 2 + 0.5]); },
    fire: function () { var s = this.ship; if (s.cd <= 0) { this.bullets.push({ x: s.x, y: H - 52 }); s.cd = 0.28; sound("zap"); } },
    key: function (e) { if (e.code === "Space") this.fire(); },
    down: function () { this.fire(); },
    move: function (x) { this.mx = clamp(x, 30, W - 30); },
    step: function (dt) {
      var s = this.ship, i, j; s.cd -= dt;
      if (this.bot !== null) { var tx = this.rocks[this.bot].x; if (Math.abs(s.x - tx) < 8) this.fire(); else s.x += Math.sign(tx - s.x) * 300 * dt; }
      else { if (K.keys.ArrowLeft) s.x -= 300 * dt; if (K.keys.ArrowRight) s.x += 300 * dt; }
      s.x = clamp(s.x, 30, W - 30);
      this.rocks.forEach(function (r) { r.y += r.vy * dt; r.a += dt; if (r.y > H - 130) r.y = 62; });
      for (i = this.bullets.length - 1; i >= 0; i--) {
        var b = this.bullets[i]; b.y -= 520 * dt; if (b.y < -10) { this.bullets.splice(i, 1); continue; }
        for (j = 0; j < this.n; j++) { var r = this.rocks[j], hw = Math.min(88, W / this.n / 2 - 6); if (Math.abs(b.x - r.x) < hw && Math.abs(b.y - r.y) < 36) { this.bullets.splice(i, 1); this.focus = [r.x, r.y]; spawn(this.parts, r.x, r.y, 24, { colors: ["#fdba74", "#94a3b8", "#fff"], speed: 260 }); r.dead = true; K.commit(this, j); break; } }
      }
    },
    draw: function (t) {
      ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H); this.stars.forEach(function (s) { ctx.fillStyle = "rgba(255,255,255," + (0.4 + 0.5 * Math.sin(t * 2 + s[0])) + ")"; ctx.fillRect(s[0], (s[1] + t * 8 * s[2]) % H, s[2], s[2]); });
      var i; for (i = 0; i < this.n; i++) {
        var r = this.rocks[i]; if (r.dead) continue; var hw = Math.min(88, W / this.n / 2 - 6);
        ctx.fillStyle = "#64748b"; ctx.beginPath(); for (var k = 0; k < 12; k++) { var a = k / 12 * TAU + r.a * 0.1, rad = (k % 2 ? 0.88 : 1) * 1; ctx.lineTo(r.x + Math.cos(a) * hw * rad, r.y + Math.sin(a) * 34 * rad); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#334155"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.72)"; rr(r.x - hw + 14, r.y - 22, hw * 2 - 28, 44, 10); ctx.fill(); badge(i, r.x - hw + 24, r.y, 10); label(this.opts[i], r.x + 10, r.y, hw * 2 - 60, 38, "#f8fafc", 13);
      }
      this.bullets.forEach(function (b) { ctx.fillStyle = "#fde047"; ctx.fillRect(b.x - 2, b.y - 10, 4, 14); ctx.fillStyle = "rgba(253,224,71,.4)"; ctx.fillRect(b.x - 4, b.y, 8, 16); });
      var s = this.ship; ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(s.x, H - 70); ctx.lineTo(s.x + 22, H - 30); ctx.lineTo(s.x, H - 40); ctx.lineTo(s.x - 22, H - 30); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#e0f2fe"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(s.x - 8, H - 32); ctx.lineTo(s.x, H - 14 + Math.sin(t * 30) * 4); ctx.lineTo(s.x + 8, H - 32); ctx.fill();
    }
  });

  /* ============================================================ 3.5 INDEX SNAKE ============ */
  K.make("u3l5", {
    CELL: 20, COLS: 27, ROWS: 19,
    build: function () {
      var keep = this.snake ? Math.min(14, 4 + this.res.filter(Boolean).length) : 4; this.want = keep; this.snake = []; for (var i = 0; i < keep; i++) this.snake.push({ c: 8 - i, r: 9 }); this.dir = { c: 1, r: 0 }; this.next = { c: 1, r: 0 }; this.tick = 0;
      this.food = []; var used = {}; for (i = 0; i < this.n; i++) { var c, r, tries = 0; do { c = 3 + Math.floor(Math.random() * (this.COLS - 6)); r = 1 + Math.floor(Math.random() * (this.ROWS - 2)); tries++; } while ((used[c + "," + r] || (r === 9 && c < 14)) && tries < 50); used[c + "," + r] = 1; this.food.push({ c: c, r: r, i: i }); }
    },
    key: function (e) { var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.code]; if (d && !(d[0] === -this.dir.c && d[1] === -this.dir.r)) this.next = { c: d[0], r: d[1] }; },
    steer: function () {
      var h = this.snake[0], f = this.food[this.bot], self = this, dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]], best = null, bd = 1e9;
      dirs.forEach(function (d) { if (d[0] === -self.dir.c && d[1] === -self.dir.r) return; var nc = (h.c + d[0] + self.COLS) % self.COLS, nr = (h.r + d[1] + self.ROWS) % self.ROWS; if (self.snake.some(function (s) { return s.c === nc && s.r === nr; })) return; if (self.food.some(function (o) { return o.i !== self.bot && o.c === nc && o.r === nr; })) return; var dist = Math.min(Math.abs(nc - f.c), self.COLS - Math.abs(nc - f.c)) + Math.min(Math.abs(nr - f.r), self.ROWS - Math.abs(nr - f.r)); if (dist < bd) { bd = dist; best = d; } });
      if (best) this.next = { c: best[0], r: best[1] };
    },
    step: function (dt) {
      this.tick += dt; if (this.tick < 0.09) return; this.tick = 0; if (this.bot !== null) this.steer();
      this.dir = this.next; var h = this.snake[0], nc = (h.c + this.dir.c + this.COLS) % this.COLS, nr = (h.r + this.dir.r + this.ROWS) % this.ROWS, k;
      if (this.snake.slice(0, -1).some(function (s) { return s.c === nc && s.r === nr; })) { this.snake = this.snake.slice(0, Math.max(3, Math.floor(this.snake.length / 2))); this.flash = 0.5; sound("bad"); }
      this.snake.unshift({ c: nc, r: nr }); if (this.snake.length > this.want) this.snake.pop();
      for (k = 0; k < this.food.length; k++) { var f = this.food[k]; if (f.c === nc && f.r === nr) { this.focus = [nc * this.CELL + 10, nr * this.CELL + 10]; K.commit(this, f.i); break; } }
    },
    draw: function (t) {
      var C = this.CELL, i; ctx.fillStyle = "#14532d"; ctx.fillRect(0, 0, W, H); for (var c = 0; c < this.COLS; c++) for (var r = 0; r < this.ROWS; r++) { ctx.fillStyle = (c + r) % 2 ? "#166534" : "#15803d"; ctx.fillRect(c * C, r * C, C, C); }
      for (i = 0; i < this.food.length; i++) { var f = this.food[i]; ctx.fillStyle = OC[f.i]; ctx.beginPath(); ctx.arc(f.c * C + 10, f.r * C + 10, 9 + Math.sin(t * 6 + i) * 1.2, 0, TAU); ctx.fill(); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.stroke(); txt(LET[f.i], f.c * C + 10, f.r * C + 11, 11, "#0f172a"); }
      this.snake.forEach(function (s, k) { ctx.fillStyle = k === 0 ? "#fde047" : k % 2 ? "#4ade80" : "#22c55e"; rr(s.c * C + 1, s.r * C + 1, C - 2, C - 2, k === 0 ? 8 : 5); ctx.fill(); if (k === 0) { ctx.fillStyle = "#111"; ctx.fillRect(s.c * C + 5, s.r * C + 6, 3, 3); ctx.fillRect(s.c * C + 12, s.r * C + 6, 3, 3); } });
      legend(this.opts, 546, 8, 248);
    },
    reset: function () { this.snake = null; }
  });

  /* ============================================================ 3.6 SLICE NINJA (fruit slicing) ============ */
  K.make("u3l6", {
    FR: ["#ef4444", "#f59e0b", "#22c55e", "#a855f7"],
    build: function () { this.fruits = []; this.trail = []; this.halves = []; this.wave = 0; this.launch(); },
    launch: function () { var n = this.n; this.fruits = []; for (var i = 0; i < n; i++) { var x = (i + 0.5) * W / n; this.fruits.push({ i: i, x: x + (Math.random() - 0.5) * 30, y: H + 50 + i * 24, vx: (Math.random() - 0.5) * 36, vy: -(560 + Math.random() * 60), r: 46, sliced: false }); } this.wave = 0; },
    slash: function (x0, y0, x1, y1) {
      for (var k = 0; k < this.fruits.length; k++) { var f = this.fruits[k]; if (f.sliced || !this.live) continue; var dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy || 1, t = clamp(((f.x - x0) * dx + (f.y - y0) * dy) / l2, 0, 1), px = x0 + t * dx, py = y0 + t * dy; if (Math.hypot(f.x - px, f.y - py) < f.r) { f.sliced = true; this.halves.push({ x: f.x, y: f.y, vx: -60, vy: -80, a: 0, i: f.i, s: -1 }, { x: f.x, y: f.y, vx: 60, vy: -80, a: 0, i: f.i, s: 1 }); this.focus = [f.x, f.y]; spawn(this.parts, f.x, f.y, 22, { colors: [this.FR[f.i], "#fff"], speed: 240 }); sound("zap"); K.commit(this, f.i); return; } }
    },
    down: function (x, y) { this.trail = [[x, y, this.time]]; this.slash(x - 1, y, x + 1, y); },
    move: function (x, y) { if (!K.mouse.down) return; var l = this.trail[this.trail.length - 1]; this.trail.push([x, y, this.time]); if (l) this.slash(l[0], l[1], x, y); },
    step: function (dt) {
      var self = this; this.wave += dt; this.fruits.forEach(function (f) { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 520 * dt; });
      if (this.bot !== null) { var f = this.fruits[this.bot]; if (f && !f.sliced && f.y < H - 80 && f.y > 60) this.slash(f.x - 40, f.y, f.x + 40, f.y); }
      if (this.wave > 3.6 || this.fruits.every(function (f) { return f.y > H + 80 && f.vy > 0; })) this.launch();
      this.trail = this.trail.filter(function (p) { return self.time - p[2] < 0.25; });
    },
    draw: function (t, dt) {
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#292524"); g.addColorStop(1, "#57534e"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); for (var s = 0; s < 8; s++) { ctx.fillStyle = "rgba(255,255,255,.04)"; ctx.fillRect(s * 110 - 20, 0, 40, H); }
      var self = this; this.halves.forEach(function (h) { h.x += h.vx * dt; h.y += h.vy * dt; h.vy += 520 * dt; h.a += h.s * dt * 5; ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(h.a); ctx.fillStyle = self.FR[h.i]; ctx.beginPath(); ctx.arc(0, 0, 46, h.s < 0 ? Math.PI / 2 : -Math.PI / 2, h.s < 0 ? Math.PI * 1.5 : Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fff7ed"; ctx.beginPath(); ctx.arc(0, 0, 38, h.s < 0 ? Math.PI / 2 : -Math.PI / 2, h.s < 0 ? Math.PI * 1.5 : Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.restore(); }); this.halves = this.halves.filter(function (h) { return h.y < H + 80; });
      this.fruits.forEach(function (f) { if (f.sliced) return; ctx.fillStyle = self.FR[f.i]; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.28)"; ctx.beginPath(); ctx.arc(f.x - 14, f.y - 16, 12, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(15,23,42,.78)"; rr(f.x - 38, f.y - 22, 76, 44, 12); ctx.fill(); badge(f.i, f.x - 28, f.y - 14, 8); label(self.opts[f.i], f.x + 4, f.y + 2, 66, 38, "#f8fafc", 12); });
      if (this.trail.length > 1) { ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath(); this.trail.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.lineCap = "butt"; }
      if (this.time < 4 && this.res.length === 0) txt("swipe through a fruit", W / 2, H - 16, 13, "#d6d3d1");
    }
  });

  /* ============================================================ 3.7 FIND IT IN THE DARK (flashlight) ============ */
  K.make("u3l7", {
    build: function () { var n = this.n, xs = []; this.chests = []; for (var i = 0; i < n; i++) xs.push(i); xs.sort(function () { return Math.random() - 0.5; }); for (i = 0; i < n; i++) this.chests.push({ i: i, x: 100 + (xs[i] + 0.5) * (W - 200) / n, y: 130 + Math.random() * 130, w: 130, h: 70 }); this.torch = { x: W / 2, y: H / 2 }; this.tx = W / 2; this.ty = H / 2; },
    pick: function () { var t = this.torch, best = -1, bd = 1e9; this.chests.forEach(function (c) { var d = Math.hypot(t.x - c.x, t.y - c.y); if (d < 75 && d < bd) { bd = d; best = c.i; } }); if (best >= 0) { var c = this.chests[best]; this.focus = [c.x, c.y]; K.commit(this, best); } },
    key: function (e) { if (e.code === "Space" || e.code === "Enter") this.pick(); },
    down: function (x, y) { this.torch.x = x; this.torch.y = y; this.pick(); },
    move: function (x, y) { this.tx = x; this.ty = y; },
    step: function (dt) {
      var t = this.torch; if (this.bot !== null) { var c = this.chests[this.bot]; this.tx = c.x; this.ty = c.y; if (Math.hypot(t.x - c.x, t.y - c.y) < 20) this.pick(); }
      else { if (K.keys.ArrowLeft) this.tx -= 280 * dt; if (K.keys.ArrowRight) this.tx += 280 * dt; if (K.keys.ArrowUp) this.ty -= 280 * dt; if (K.keys.ArrowDown) this.ty += 280 * dt; }
      this.tx = clamp(this.tx, 0, W); this.ty = clamp(this.ty, 0, H); t.x += (this.tx - t.x) * Math.min(1, dt * 12); t.y += (this.ty - t.y) * Math.min(1, dt * 12);
    },
    draw: function (t) {
      var self = this; ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, W, H); for (var x = 0; x < W; x += 50) { ctx.fillStyle = x % 100 ? "#292524" : "#322d2a"; ctx.fillRect(x, 0, 48, H - 60); } ctx.fillStyle = "#3f2f22"; ctx.fillRect(0, H - 60, W, 60);
      this.chests.forEach(function (c) { var lit = Math.hypot(self.torch.x - c.x, self.torch.y - c.y) < 105; ctx.fillStyle = "#92400e"; rr(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 10); ctx.fill(); ctx.fillStyle = "#b45309"; ctx.fillRect(c.x - c.w / 2, c.y - c.h / 2, c.w, 16); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; rr(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 10); ctx.stroke(); ctx.fillStyle = "#fde047"; ctx.fillRect(c.x - 7, c.y - 4, 14, 18);
        if (lit) { ctx.fillStyle = "rgba(15,23,42,.88)"; rr(c.x - 58, c.y - 26, 116, 40, 8); ctx.fill(); badge(c.i, c.x - 46, c.y - 6, 9); label(self.opts[c.i], c.x + 8, c.y - 6, 86, 34, "#fde68a", 12); } });
      var tt = this.torch, g = ctx.createRadialGradient(tt.x, tt.y, 20, tt.x, tt.y, 130); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.7, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,.97)");
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,.97)"; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(tt.x, tt.y, 130, 0, TAU, true); ctx.fill("evenodd"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tt.x, tt.y, 130, 0, TAU); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "rgba(253,224,71,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(tt.x, tt.y, 14, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(tt.x - 22, tt.y); ctx.lineTo(tt.x + 22, tt.y); ctx.moveTo(tt.x, tt.y - 22); ctx.lineTo(tt.x, tt.y + 22); ctx.stroke();
    }
  });
})();
