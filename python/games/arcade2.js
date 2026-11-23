/* THE UNIT 3 ARCADE GAMES (part 2): games 3.8 to 3.13. See arcade.js for the shared toolkit (ArcadeKit) and how the answer is made in the game and judged by the server. */
(function () {
  "use strict";
  var K = window.ArcadeKit, W = K.W, H = K.H, TAU = K.TAU, OC = K.OC, LET = K.LET, clamp = K.clamp, rr = K.rr, txt = K.txt, label = K.label, badge = K.badge, spawn = K.spawn, sound = K.sound;

  /* ============================================================ 3.8 MATH PLATFORMER ============ */
  K.make("u3l8", {
    GY: 340, PW: 150,
    build: function () { var n = this.n, self = this; this.plats = []; for (var i = 0; i < n; i++) this.plats.push({ i: i, x: (i + 0.5) * W / n, top: i % 2 ? 248 : 292 }); this.p = { x: 50, y: this.GY, vx: 0, vy: 0, on: -1, face: 1 }; this.stand = 0; this.lastOn = -1; },
    jump: function () { var p = this.p; if (p.on !== -2 && (p.y >= this.GY || p.on >= 0)) { p.vy = -480; p.on = -2; sound("tick"); } },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") this.jump(); },
    step: function (dt) {
      var p = this.p, self = this, dir = 0;
      if (this.bot !== null) {
        var tp = this.plats[this.bot], dx = tp.x - p.x; dir = Math.abs(dx) > 14 ? Math.sign(dx) : 0;
        if (p.on !== this.bot && Math.abs(dx) < this.PW / 2 + 70 && p.on !== -2) this.jump();
      } else { if (K.keys.ArrowLeft || K.keys.KeyA) dir -= 1; if (K.keys.ArrowRight || K.keys.KeyD) dir += 1; }
      p.vx = dir * 215; if (dir) p.face = dir; var prev = p.y; p.x = clamp(p.x + p.vx * dt, 14, W - 14); p.vy += 1100 * dt; p.y += p.vy * dt;
      var landed = -1;
      if (p.vy >= 0) this.plats.forEach(function (pl) { if (Math.abs(p.x - pl.x) <= self.PW / 2 + 6 && prev <= pl.top + 1 && p.y >= pl.top) landed = pl.i; });
      if (landed >= 0) { p.y = this.plats[landed].top; p.vy = 0; p.on = landed; }
      else if (p.y >= this.GY) { p.y = this.GY; p.vy = 0; p.on = -1; }
      else if (p.on >= 0 && p.vy !== 0) p.on = -2;
      if (p.on >= 0) { var pl = this.plats[p.on]; if (Math.abs(p.x - pl.x) > this.PW / 2 + 6) p.on = -2; }
      if (p.on >= 0 && Math.abs(p.vx) < 1) { this.stand += dt; if (this.stand >= 1) { this.focus = [p.x, p.y - 20]; K.commit(this, p.on); } } else this.stand = 0;
    },
    draw: function (t) {
      var ctx = K.ctx, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1e3a8a"); g.addColorStop(1, "#7c3aed"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (var s = 0; s < 30; s++) { ctx.fillStyle = "rgba(255,255,255," + (0.3 + 0.4 * Math.sin(t + s)) + ")"; ctx.fillRect((s * 83) % W, (s * 37) % 160, 2, 2); }
      ctx.fillStyle = "#312e81"; ctx.beginPath(); ctx.moveTo(0, 330); for (var x = 0; x <= W; x += 50) ctx.lineTo(x, 300 - 40 * Math.abs(Math.sin(x / 130))); ctx.lineTo(W, 340); ctx.fill();
      ctx.fillStyle = "#166534"; ctx.fillRect(0, this.GY, W, H - this.GY); ctx.fillStyle = "#22c55e"; ctx.fillRect(0, this.GY, W, 8);
      this.plats.forEach(function (pl) {
        ctx.fillStyle = "#78350f"; rr(pl.x - 75, pl.top, 150, 22, 6); ctx.fill(); ctx.fillStyle = "#22c55e"; rr(pl.x - 75, pl.top, 150, 9, 4); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 2; rr(pl.x - 75, pl.top, 150, 22, 6); ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.82)"; rr(pl.x - 72, pl.top - 66, 144, 56, 10); ctx.fill(); ctx.strokeStyle = OC[pl.i]; ctx.lineWidth = 3; ctx.stroke(); badge(pl.i, pl.x - 58, pl.top - 52, 9); label(K.cur.opts[pl.i], pl.x + 6, pl.top - 36, 116, 40, "#f8fafc", 13);
      });
      var p = this.p; ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = "#f97316"; rr(-10, -30, 20, 22, 5); ctx.fill(); ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(0, -38, 11, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillRect(p.face * 3 - 3, -41, 3, 4); ctx.fillRect(p.face * 3 + 3, -41, 3, 4); ctx.fillStyle = "#1e293b"; var lg = Math.sin(this.time * 14) * (Math.abs(p.vx) > 0 && p.on !== -2 ? 5 : 0); ctx.fillRect(-8 + lg, -8, 6, 8); ctx.fillRect(2 - lg, -8, 6, 8); ctx.restore();
      if (this.stand > 0) { ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(p.x, p.y - 62, 12, -Math.PI / 2, -Math.PI / 2 + this.stand * TAU); ctx.stroke(); }
    }
  });

  /* ============================================================ 3.9 BRICK DIVIDER (breakout) ============ */
  K.make("u3l9", {
    build: function () { var n = this.n, bw = (W - 24) / n - 6; this.bricks = []; for (var i = 0; i < n; i++) this.bricks.push({ i: i, x: 12 + i * (bw + 6), y: 24, w: bw, h: 66 }); this.pad = { x: W / 2, w: 120 }; this.ball = { x: W / 2, y: H - 40, vx: 0, vy: 0, r: 8, stuck: true }; this.lost = 0; },
    launch: function () { var b = this.ball; if (b.stuck) { b.stuck = false; b.vx = (Math.random() < 0.5 ? -1 : 1) * (80 + Math.random() * 80); b.vy = -310; if (this.bot !== null) { var tb = this.bricks[this.bot]; b.vx = clamp((tb.x + tb.w / 2 - b.x) / ((b.y - 95) / 310), -330, 330); } sound("tick"); } },
    key: function (e) { if (e.code === "Space") this.launch(); },
    down: function () { this.launch(); },
    move: function (x) { this.pad.x = clamp(x, 60, W - 60); },
    step: function (dt) {
      var b = this.ball, p = this.pad, i, py = H - 26, sp = Math.hypot(b.vx, b.vy);
      if (this.bot !== null) {
        var tb = this.bricks[this.bot], tx = tb.x + tb.w / 2;
        if (b.vy > 0 && b.y > H - 190) { var t = Math.max(0.05, (b.y - 95) / Math.max(150, Math.abs(b.vy))), want = clamp((tx - b.x) / t, -300, 300); p.x = clamp(b.x - want / 320 * (p.w / 2), 60, W - 60); }
        else p.x += (b.x - p.x) * Math.min(1, dt * 7);
      } else { if (K.keys.ArrowLeft) p.x -= 420 * dt; if (K.keys.ArrowRight) p.x += 420 * dt; p.x = clamp(p.x, 60, W - 60); }
      if (b.stuck) { b.x = p.x; b.y = H - 26 - b.r; if (this.bot !== null) this.launch(); return; }
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx); } if (b.x > W - b.r) { b.x = W - b.r; b.vx = -Math.abs(b.vx); } if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy); }
      if (b.vy > 0 && b.y + b.r >= py && b.y + b.r <= py + 16 && Math.abs(b.x - p.x) <= p.w / 2 + b.r) { b.vy = -Math.max(300, Math.abs(b.vy)); b.vx = (b.x - p.x) / (p.w / 2) * 320; b.y = py - b.r; sound("tick"); }
      if (b.y > H + 20) { this.lost++; b.stuck = true; b.vx = 0; b.vy = 0; }
      for (i = 0; i < this.bricks.length; i++) { var br = this.bricks[i]; if (b.x + b.r > br.x && b.x - b.r < br.x + br.w && b.y + b.r > br.y && b.y - b.r < br.y + br.h) { this.focus = [br.x + br.w / 2, br.y + br.h / 2]; spawn(this.parts, this.focus[0], this.focus[1], 26, { colors: [OC[i], "#fff"], speed: 280 }); br.dead = true; K.commit(this, i); break; } }
    },
    draw: function (t) {
      var ctx = K.ctx, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0f172a"); g.addColorStop(1, "#1e1b4b"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); for (var y = 100; y < H; y += 40) { ctx.fillStyle = "rgba(255,255,255,.03)"; ctx.fillRect(0, y, W, 1); }
      var self = this; this.bricks.forEach(function (br) { if (br.dead) return; ctx.fillStyle = OC[br.i]; rr(br.x, br.y, br.w, br.h, 10); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.28)"; rr(br.x + 4, br.y + 4, br.w - 8, 14, 6); ctx.fill(); ctx.fillStyle = "rgba(15,23,42,.82)"; rr(br.x + 8, br.y + 20, br.w - 16, br.h - 28, 8); ctx.fill(); badge(br.i, br.x + 20, br.y + 42, 9); label(self.opts[br.i], br.x + 26 + (br.w - 40) / 2, br.y + 42, br.w - 56, br.h - 34, "#f8fafc", 13); });
      var p = this.pad, b = this.ball; ctx.fillStyle = "#e2e8f0"; rr(p.x - p.w / 2, H - 26, p.w, 12, 6); ctx.fill(); ctx.fillStyle = "#38bdf8"; rr(p.x - p.w / 2 + 6, H - 24, p.w - 12, 4, 2); ctx.fill();
      ctx.fillStyle = "rgba(253,224,71,.25)"; ctx.beginPath(); ctx.arc(b.x - b.vx * 0.03, b.y - b.vy * 0.03, b.r, 0, TAU); ctx.fill(); ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.fill(); if (b.stuck) txt("SPACE or click to launch", W / 2, H - 56, 12, "#a5b4fc");
    }
  });

  /* ============================================================ 3.10 FLOOR CATCH ============ */
  K.make("u3l10", {
    build: function () { this.items = []; for (var i = 0; i < this.n; i++) this.items.push({ i: i, x: (i + 0.5) * W / this.n, y: -40 - i * 95, vy: 82 + i * 9 }); this.bk = { x: W / 2, w: 130 }; },
    move: function (x) { this.bk.x = clamp(x, 65, W - 65); },
    step: function (dt) {
      var bk = this.bk, self = this;
      if (this.bot !== null) { var it = this.items[this.bot]; bk.x += clamp(it.x - bk.x, -520 * dt, 520 * dt); }
      else { if (K.keys.ArrowLeft) bk.x -= 440 * dt; if (K.keys.ArrowRight) bk.x += 440 * dt; bk.x = clamp(bk.x, 65, W - 65); }
      var hit = -1; this.items.forEach(function (it) { it.y += it.vy * dt; if (it.y > H + 50) it.y = -50; if (it.y > H - 92 && it.y < H - 40 && Math.abs(it.x - bk.x) < 85) hit = it.i; });
      if (hit >= 0) { var h = this.items[hit]; this.focus = [h.x, H - 60]; K.commit(this, hit); h.y = -200; }
    },
    draw: function (t) {
      var ctx = K.ctx, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#082f49"); g.addColorStop(1, "#0e7490"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#155e75"; ctx.fillRect(0, 0, W, 14);
      var self = this; this.items.forEach(function (it) { if (it.y < -30) return; var hw = Math.min(80, W / self.n / 2 - 8); ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(it.x - 30, it.y - 26); ctx.lineTo(it.x, it.y - 120); ctx.lineTo(it.x + 30, it.y - 26); ctx.stroke(); ctx.fillStyle = "#b45309"; rr(it.x - hw, it.y - 26, hw * 2, 52, 8); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "rgba(15,23,42,.8)"; rr(it.x - hw + 6, it.y - 20, hw * 2 - 12, 40, 6); ctx.fill(); badge(it.i, it.x - hw + 18, it.y, 9); label(self.opts[it.i], it.x + 8, it.y, hw * 2 - 44, 36, "#f8fafc", 12); });
      var bk = this.bk; ctx.fillStyle = "#a16207"; ctx.beginPath(); ctx.moveTo(bk.x - 68, H - 62); ctx.lineTo(bk.x + 68, H - 62); ctx.lineTo(bk.x + 52, H - 14); ctx.lineTo(bk.x - 52, H - 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = "#ca8a04"; ctx.lineWidth = 2; for (var k = -40; k <= 40; k += 20) { ctx.beginPath(); ctx.moveTo(bk.x + k, H - 62); ctx.lineTo(bk.x + k * 0.8, H - 14); ctx.stroke(); }
    }
  });

  /* ============================================================ 3.11 REMAINDER CANNON ============ */
  K.make("u3l11", {
    CX: 70, CY: 306, G: 520,
    build: function () {
      var spots = [[520, 96], [695, 96], [520, 214], [695, 214]], order = [0, 1, 2, 3].sort(function () { return Math.random() - 0.5; }); this.boards = [];
      for (var i = 0; i < this.n; i++) this.boards.push({ i: i, x: spots[order[i]][0], y: spots[order[i]][1], w: 150, h: 76 });
      this.ang = 0.7; this.pow = 520; this.ball = null; this.cool = 0; this.botPlan = null; this.acc = 0;
    },
    sim: function (ang, pow, keep) {
      var x = this.CX, y = this.CY, vx = Math.cos(ang) * pow, vy = -Math.sin(ang) * pow, pts = [], dt = 1 / 90, i, j;
      for (i = 0; i < 700; i++) { vy += this.G * dt; x += vx * dt; y += vy * dt; if (keep && i % 4 === 0) pts.push([x, y]); for (j = 0; j < this.boards.length; j++) { var b = this.boards[j]; if (x > b.x - b.w / 2 && x < b.x + b.w / 2 && y > b.y - b.h / 2 && y < b.y + b.h / 2) return keep ? { hit: j, pts: pts } : j; } if (x > W + 40 || y > H - 10 || x < -20) break; }
      return keep ? { hit: -1, pts: pts } : -1;
    },
    fire: function () { if (this.ball || this.cool > 0) return; this.ball = { x: this.CX, y: this.CY, vx: Math.cos(this.ang) * this.pow, vy: -Math.sin(this.ang) * this.pow }; sound("zap"); this.shake = 0.15; },
    aimAt: function (x, y) { var dx = x - this.CX, dy = this.CY - y; this.ang = clamp(Math.atan2(dy, dx), 0.09, 1.4); this.pow = clamp(Math.hypot(dx, dy) * 1.5, 240, 760); },
    key: function (e) { if (e.code === "Space") this.fire(); },
    down: function (x, y) { this.aimAt(x, y); this.fire(); },
    move: function (x, y) { this.aimAt(x, y); },
    plan: function (target) { var best = null, bd = 1e9; for (var a = 0.12; a < 1.35; a += 0.02) for (var pw = 240; pw <= 760; pw += 10) { if (this.sim(a, pw) === target) { var d = Math.abs(a - 0.7) + Math.abs(pw - 520) / 900; if (d < bd) { bd = d; best = [a, pw]; } } } return best; },
    step: function (dt) {
      this.cool = Math.max(0, this.cool - dt);
      if (this.bot !== null && !this.ball && this.cool <= 0) { if (!this.botPlan) this.botPlan = this.plan(this.bot) || [0.7, 520]; this.ang = this.botPlan[0]; this.pow = this.botPlan[1]; this.fire(); return; }
      if (!this.ball) { if (K.keys.ArrowUp) this.ang = clamp(this.ang + 0.8 * dt, 0.09, 1.4); if (K.keys.ArrowDown) this.ang = clamp(this.ang - 0.8 * dt, 0.09, 1.4); if (K.keys.ArrowRight) this.pow = clamp(this.pow + 260 * dt, 240, 760); if (K.keys.ArrowLeft) this.pow = clamp(this.pow - 260 * dt, 240, 760); return; }
      this.acc = (this.acc || 0) + dt; while (this.acc >= 1 / 90 && this.ball) { this.acc -= 1 / 90; this.stepBall(1 / 90); }
    },
    stepBall: function (dt) {
      var b = this.ball, j; b.vy += this.G * dt; b.x += b.vx * dt; b.y += b.vy * dt;
      for (j = 0; j < this.boards.length; j++) { var bd = this.boards[j]; if (b.x > bd.x - bd.w / 2 && b.x < bd.x + bd.w / 2 && b.y > bd.y - bd.h / 2 && b.y < bd.y + bd.h / 2) { this.focus = [bd.x, bd.y]; spawn(this.parts, bd.x, bd.y, 24, { colors: [OC[j], "#fff", "#fde047"], speed: 260 }); bd.dead = true; this.ball = null; K.commit(this, j); return; } }
      if (b.y > H - 14 || b.x > W + 30 || b.x < -30) { this.ball = null; this.cool = 0.4; spawn(this.parts, clamp(b.x, 0, W), H - 14, 8, { colors: ["#a16207", "#78350f"], speed: 120 }); }
    },
    draw: function (t) {
      var ctx = K.ctx, self = this, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#fb923c"); g.addColorStop(1, "#fde68a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#b45309"; ctx.beginPath(); ctx.moveTo(0, 300); for (var x = 0; x <= W; x += 40) ctx.lineTo(x, 280 - 30 * Math.sin(x / 100)); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillStyle = "#78350f"; ctx.fillRect(0, H - 14, W, 14);
      this.boards.forEach(function (bd) { if (bd.dead) return; ctx.fillStyle = "#92400e"; rr(bd.x - bd.w / 2, bd.y - bd.h / 2, bd.w, bd.h, 8); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = OC[bd.i]; ctx.lineWidth = 5; rr(bd.x - bd.w / 2 + 5, bd.y - bd.h / 2 + 5, bd.w - 10, bd.h - 10, 6); ctx.stroke(); ctx.fillStyle = "rgba(15,23,42,.8)"; rr(bd.x - bd.w / 2 + 9, bd.y - bd.h / 2 + 9, bd.w - 18, bd.h - 18, 5); ctx.fill(); badge(bd.i, bd.x - bd.w / 2 + 22, bd.y, 9); label(self.opts[bd.i], bd.x + 10, bd.y, bd.w - 54, bd.h - 22, "#f8fafc", 13); });
      if (!this.ball && this.live) { var s = this.sim(this.ang, this.pow, true); ctx.fillStyle = "rgba(15,23,42,.55)"; s.pts.forEach(function (p, i) { if (i % 2 === 0) { ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, TAU); ctx.fill(); } }); }
      ctx.save(); ctx.translate(this.CX, this.CY); ctx.rotate(-this.ang); ctx.fillStyle = "#334155"; rr(-6, -13, 62, 26, 8); ctx.fill(); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.arc(this.CX, this.CY, 26, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(this.CX - 14, this.CY + 4, 14, 0, TAU); ctx.arc(this.CX + 14, this.CY + 4, 14, 0, TAU); ctx.fill();
      if (this.ball) { ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(this.ball.x, this.ball.y, 9, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.arc(this.ball.x - 3, this.ball.y - 3, 3, 0, TAU); ctx.fill(); }
      txt("POWER " + Math.round((this.pow - 240) / 520 * 100) + "%", 70, 352, 11, "#7c2d12"); txt("ANGLE " + Math.round(this.ang * 180 / Math.PI) + "°", 70, 336, 11, "#7c2d12");
    }
  });

  /* ============================================================ 3.12 ORDER MAZE ============ */
  K.make("u3l12", {
    CW: 19, CH: 11, S: 32, OX: 6, OY: 14,
    build: function () {
      var CW = this.CW, CH = this.CH, r, c, i, seen = [], self = this; this.right = []; this.down = [];
      for (r = 0; r < CH; r++) { this.right.push([]); this.down.push([]); seen.push([]); for (c = 0; c < CW; c++) { this.right[r].push(true); this.down[r].push(true); seen[r].push(false); } }
      var st = [[5, 0]]; seen[5][0] = true;
      while (st.length) { var cur = st[st.length - 1], nb = [[0, 1], [1, 0], [0, -1], [-1, 0]].filter(function (d) { var nr = cur[0] + d[0], nc = cur[1] + d[1]; return nr >= 0 && nr < CH && nc >= 0 && nc < CW - 1 && !seen[nr][nc]; }); if (!nb.length) { st.pop(); continue; } var d = nb[Math.floor(Math.random() * nb.length)], nr = cur[0] + d[0], nc = cur[1] + d[1]; if (d[1] === 1) this.right[cur[0]][cur[1]] = false; else if (d[1] === -1) this.right[nr][nc] = false; else if (d[0] === 1) this.down[cur[0]][cur[1]] = false; else this.down[nr][nc] = false; seen[nr][nc] = true; st.push([nr, nc]); }
      for (i = 0; i < 26; i++) { r = Math.floor(Math.random() * (CH - 1)); c = Math.floor(Math.random() * (CW - 3)); if (Math.random() < 0.5) this.right[r][c] = false; else this.down[r][c] = false; }
      this.me = { r: 5, c: 0 }; this.mv = 0; this.exits = []; var rows = [1, 4, 6, 9]; if (this.n === 3) rows = [1, 5, 9]; for (i = 0; i < this.n; i++) this.exits.push({ i: i, r: rows[i], c: CW - 1 });
      /* the exit doors are dead-end rooms you can only enter from the left, so you cannot walk through one on the way to another */
      for (r = 0; r < CH; r++) { this.right[r][CW - 2] = true; this.down[r][CW - 1] = true; }
      this.exits.forEach(function (e) { self.right[e.r][CW - 2] = false; });
    },
    can: function (r, c, d) { if (d === "R") return c < this.CW - 1 && !this.right[r][c]; if (d === "L") return c > 0 && !this.right[r][c - 1]; if (d === "D") return r < this.CH - 1 && !this.down[r][c]; return r > 0 && !this.down[r - 1][c]; },
    go: function (d) { var m = this.me; if (!this.can(m.r, m.c, d)) return false; if (d === "R") m.c++; else if (d === "L") m.c--; else if (d === "D") m.r++; else m.r--; sound("tick"); var self = this; this.exits.forEach(function (e) { if (e.r === m.r && e.c === m.c) { self.focus = [self.OX + m.c * self.S + 16, self.OY + m.r * self.S + 16]; K.commit(self, e.i); } }); return true; },
    path: function (target) { var e = this.exits[target], self = this, q = [[this.me.r, this.me.c, []]], seen = {}; seen[this.me.r + "," + this.me.c] = 1; while (q.length) { var cur = q.shift(); if (cur[0] === e.r && cur[1] === e.c) return cur[2]; ["R", "L", "D", "U"].forEach(function (d) { if (!self.can(cur[0], cur[1], d)) return; var nr = cur[0] + (d === "D" ? 1 : d === "U" ? -1 : 0), nc = cur[1] + (d === "R" ? 1 : d === "L" ? -1 : 0); if (seen[nr + "," + nc]) return; seen[nr + "," + nc] = 1; q.push([nr, nc, cur[2].concat([d])]); }); } return []; },
    step: function (dt) {
      this.mv -= dt; if (this.mv > 0) return;
      if (this.bot !== null) { var p = this.path(this.bot); if (p.length) { this.go(p[0]); this.mv = 0.07; } return; }
      var d = K.keys.ArrowRight ? "R" : K.keys.ArrowLeft ? "L" : K.keys.ArrowDown ? "D" : K.keys.ArrowUp ? "U" : null; if (d && this.go(d)) this.mv = 0.12;
    },
    key: function (e) { var d = { ArrowRight: "R", ArrowLeft: "L", ArrowDown: "D", ArrowUp: "U" }[e.code]; if (d && this.go(d)) this.mv = 0.14; },
    draw: function (t) {
      var ctx = K.ctx, S = this.S, ox = this.OX, oy = this.OY, r, c; ctx.fillStyle = "#1e1b4b"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#312e81"; ctx.fillRect(ox, oy, this.CW * S, this.CH * S);
      for (r = 0; r < this.CH; r++) for (c = 0; c < this.CW; c++) { ctx.fillStyle = (r + c) % 2 ? "#3730a3" : "#312e81"; ctx.fillRect(ox + c * S, oy + r * S, S, S); }
      ctx.fillStyle = "#0f0b2e"; ctx.fillRect(ox + (this.CW - 1) * S, oy, S, this.CH * S);
      this.exits.forEach(function (e) { ctx.fillStyle = "rgba(" + (e.i === 0 ? "56,189,248" : e.i === 1 ? "244,114,182" : e.i === 2 ? "163,230,53" : "251,191,36") + "," + (0.35 + 0.2 * Math.sin(t * 4 + e.i)) + ")"; ctx.fillRect(ox + e.c * S, oy + e.r * S, S, S); badge(e.i, ox + e.c * S + 16, oy + e.r * S + 16, 12); });
      ctx.strokeStyle = "#c7d2fe"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.rect(ox, oy, this.CW * S, this.CH * S); ctx.stroke();
      for (r = 0; r < this.CH; r++) for (c = 0; c < this.CW; c++) { if (this.right[r][c] && c < this.CW - 1) { ctx.beginPath(); ctx.moveTo(ox + (c + 1) * S, oy + r * S); ctx.lineTo(ox + (c + 1) * S, oy + (r + 1) * S); ctx.stroke(); } if (this.down[r][c] && r < this.CH - 1) { ctx.beginPath(); ctx.moveTo(ox + c * S, oy + (r + 1) * S); ctx.lineTo(ox + (c + 1) * S, oy + (r + 1) * S); ctx.stroke(); } }
      ctx.lineCap = "butt"; var m = this.me, px = ox + m.c * S + 16, py = oy + m.r * S + 16; ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(px, py, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#111"; ctx.fillRect(px - 5, py - 3, 3, 3); ctx.fillRect(px + 2, py - 3, 3, 3);
      txt("START", ox + 18, oy - 7, 9, "#a5b4fc"); K.legend(this.opts, 624, 8, 172);
    }
  });

  /* ============================================================ 3.13 THE TRACE MYSTERY ============ */
  var SUSPECTS = [["Ada", "the intern", "#f9a8d4", "#7c2d12"], ["Bit", "the janitor", "#fde68a", "#1e293b"], ["Cy", "the coach", "#fdba74", "#44403c"], ["Dee", "the tech", "#a5b4fc", "#be123c"]];
  var CLUES = ["The grade book was changed at 3:15 pm. A torn note was left behind.", "A sticky note on the monitor holds a short program.", "The janitor's cart has a printout with a few lines of code.", "Someone left a program running on the teacher's computer.", "A trail of variables leads from the desk to the door.", "The coach's whiteboard shows a trace with one line missing.", "The tech's notebook has a program with a smudged answer.", "A torn page from the report card printer shows more code.", "The last clue is a program taped to the grade book itself.", "One final trace will name the culprit. Think it through!"];
  K.make("u3l13", {
    build: function () { var self = this; if (this.culprit === undefined) { this.culprit = Math.floor(Math.random() * 4); this.order = [0, 1, 2, 3].filter(function (x) { return x !== self.culprit; }).sort(function () { return Math.random() - 0.5; }); } this.cards = []; for (var i = 0; i < this.n; i++) { var w = Math.min(184, (W - 40) / this.n - 12); this.cards.push({ i: i, x: W / 2 - (this.n * (w + 12) - 12) / 2 + i * (w + 12), y: 236, w: w, h: 118 }); } this.hover = -1; this.botT = 0; this.clue = CLUES[Math.min(9, G().n)]; },
    reset: function () { this.culprit = undefined; },
    pickAt: function (x, y) { for (var i = 0; i < this.cards.length; i++) { var c = this.cards[i]; if (x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) return i; } return -1; },
    down: function (x, y) { var i = this.pickAt(x, y); if (i >= 0) { this.focus = [this.cards[i].x + this.cards[i].w / 2, this.cards[i].y]; K.commit(this, i); } },
    move: function (x, y) { this.hover = this.pickAt(x, y); },
    key: function (e) { var d = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[e.code]; if (d !== undefined && d < this.n) { this.focus = [this.cards[d].x + this.cards[d].w / 2, this.cards[d].y]; K.commit(this, d); } },
    step: function (dt) { if (this.bot !== null) { this.botT += dt; this.hover = this.bot; if (this.botT > 0.7) { this.focus = [this.cards[this.bot].x + 80, 250]; K.commit(this, this.bot); } } },
    draw: function (t) {
      var ctx = K.ctx, i, self = this; ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, W, H); var g = ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, "#292524"); g.addColorStop(1, "#44403c"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 215);
      ctx.fillStyle = "rgba(250,204,21,.07)"; ctx.beginPath(); ctx.moveTo(300, 0); ctx.lineTo(500, 0); ctx.lineTo(640, 215); ctx.lineTo(160, 215); ctx.fill();
      var cleared = Math.min(3, K.cur.res.filter(Boolean).length), done = this.ended === "win";
      for (i = 0; i < 4; i++) {
        var s = SUSPECTS[i], x = 100 + i * 200, y = 22, isC = i === this.culprit, out = this.order.indexOf(i) >= 0 && this.order.indexOf(i) < cleared;
        ctx.save(); ctx.translate(x, y); ctx.rotate((i % 2 ? 0.04 : -0.04)); ctx.fillStyle = "#fefce8"; ctx.fillRect(-52, 0, 104, 128); ctx.fillStyle = "#e7e5e4"; ctx.fillRect(-46, 6, 92, 92);
        ctx.fillStyle = s[2]; ctx.beginPath(); ctx.arc(0, 52, 26, 0, TAU); ctx.fill(); ctx.fillStyle = s[3]; ctx.beginPath(); ctx.arc(0, 40, 27, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#111"; ctx.fillRect(-11, 50, 5, 5); ctx.fillRect(6, 50, 5, 5); ctx.fillRect(-7, 66, 14, 3);
        ctx.fillStyle = "#292524"; ctx.font = '700 11px "Silkscreen",monospace'; ctx.textAlign = "center"; ctx.fillText(s[0].toUpperCase(), 0, 112); ctx.font = '700 8px "JetBrains Mono",monospace'; ctx.fillText(s[1], 0, 123);
        if (out) { ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-44, 8); ctx.lineTo(44, 96); ctx.moveTo(44, 8); ctx.lineTo(-44, 96); ctx.stroke(); ctx.fillStyle = "#dc2626"; ctx.font = '700 10px "Silkscreen",monospace'; ctx.fillText("CLEARED", 0, 4); }
        else if (cleared >= 3 || done) { ctx.strokeStyle = done ? "#22c55e" : "#facc15"; ctx.lineWidth = 4; ctx.strokeRect(-52, 0, 104, 128); if (done) { ctx.fillStyle = "#22c55e"; ctx.font = '700 12px "Silkscreen",monospace'; ctx.fillText("CAUGHT!", 0, -8); } else { ctx.fillStyle = "#facc15"; ctx.font = '700 10px "Silkscreen",monospace'; ctx.fillText("SUSPECT", 0, -8); } }
        ctx.restore();
      }
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(0, 170, W, 44); label(CLUES[Math.min(9, K.cur.res.length)], W / 2, 192, W - 60, 38, "#fde68a", 14);
      ctx.fillStyle = "#44403c"; ctx.fillRect(0, 215, W, H - 215); ctx.fillStyle = "#57534e"; ctx.fillRect(0, 215, W, 6);
      this.cards.forEach(function (c) { var hov = self.hover === c.i, y = c.y - (hov ? 6 : 0); ctx.fillStyle = "rgba(0,0,0,.35)"; rr(c.x + 4, y + 6, c.w, c.h, 10); ctx.fill(); ctx.fillStyle = "#fef9c3"; rr(c.x, y, c.w, c.h, 10); ctx.fill(); ctx.strokeStyle = hov ? OC[c.i] : "#a16207"; ctx.lineWidth = hov ? 5 : 3; ctx.stroke(); ctx.fillStyle = OC[c.i]; rr(c.x, y, c.w, 26, 10); ctx.fill(); ctx.fillRect(c.x, y + 14, c.w, 12); txt("EVIDENCE " + LET[c.i], c.x + c.w / 2, y + 14, 11, "#0f172a"); label(self.opts[c.i], c.x + c.w / 2, y + 28 + (c.h - 28) / 2, c.w - 18, c.h - 38, "#1c1917", 15); });
      if (this.hover >= 0) { var hc = this.cards[this.hover], mx = hc.x + hc.w - 20, my = hc.y + hc.h - 4; ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(mx, my, 14, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(mx + 10, my + 10); ctx.lineTo(mx + 26, my + 26); ctx.stroke(); }
      for (i = 0; i < 3; i++) { ctx.fillStyle = i < K.G.strikes ? "#ef4444" : "#292524"; ctx.beginPath(); ctx.arc(26 + i * 22, 12, 7, 0, TAU); ctx.fill(); } txt("THE CULPRIT IS GETTING AWAY", 140, 12, 8, "#a8a29e");
    }
  });
  function G() { return K.G || { n: 0 }; }
})();
