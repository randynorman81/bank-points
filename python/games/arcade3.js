/* THE UNIT 4 ARCADE GAMES (part 1): 4.1 to 4.6.  Same idea as arcade.js: the answers are IN the game, the player answers by playing, the server still judges the answer.
   Boolean Bash (whack-a-mole), Logic Archery, Comparison Lander, If Climb (a Doodle-Jump style climber), Elif Express (a train with track switches), Key Beat (arrow-key rhythm). */
(function () {
  "use strict";
  var K = window.ArcadeKit, W = K.W, H = K.H, TAU = K.TAU, OC = K.OC, LET = K.LET, clamp = K.clamp, rr = K.rr, txt = K.txt, sound = K.sound, label = K.label, badge = K.badge, spawn = K.spawn;
  function shuffled(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); a.sort(function () { return Math.random() - 0.5; }); return a; }

  /* ============================================================ 4.1 BOOLEAN BASH (whack-a-mole) ============ */
  K.make("u4l1", {
    build: function () {
      var n = this.n, cols = n <= 2 ? n : Math.ceil(n / 2), rows = n <= 2 ? 1 : 2, o = shuffled(n), k; this.holes = []; this.sw = 0;
      for (k = 0; k < n; k++) { var c = k % cols, r = Math.floor(k / cols); this.holes[o[k]] = { x: (c + 0.5) * W / cols, y: rows === 1 ? 250 : 175 + r * 140, off: k * 0.7 }; }
    },
    upAmt: function (h, t) { var u = ((t + h.off) % 2.8) / 2.8; return u < 0.14 ? u / 0.14 : u < 0.62 ? 1 : u < 0.78 ? 1 - (u - 0.62) / 0.16 : 0; },
    hit: function (i) { var h = this.holes[i]; this.sw = 0.2; if (this.upAmt(h, this.time) > 0.5) { this.focus = [h.x, h.y - 50]; K.commit(this, i); } },
    key: function (e) { var d = /^Digit([1-4])$/.exec(e.code); if (d && +d[1] <= this.n) this.hit(+d[1] - 1); },
    down: function (x, y) { for (var i = 0; i < this.n; i++) { var h = this.holes[i]; if (this.upAmt(h, this.time) > 0.5 && Math.hypot(x - h.x, y - (h.y - 40)) < 66) { this.hit(i); return; } } this.sw = 0.2; },
    step: function (dt) { this.sw = Math.max(0, this.sw - dt); if (this.bot !== null && this.upAmt(this.holes[this.bot], this.time) > 0.85) this.hit(this.bot); },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7dd3fc"); g.addColorStop(0.35, "#bae6fd"); g.addColorStop(0.36, "#65a30d"); g.addColorStop(1, "#3f6212"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < 9; i++) { ctx.fillStyle = "#854d0e"; ctx.fillRect(i * 100 + 10, 100, 12, 46); ctx.fillStyle = "#a16207"; ctx.fillRect(i * 100 - 2, 96, 100, 8); }
      for (i = 0; i < this.n; i++) {
        var h = this.holes[i], u = this.upAmt(h, t);
        ctx.fillStyle = "#1c1917"; ctx.beginPath(); ctx.ellipse(h.x, h.y, 74, 22, 0, 0, TAU); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, h.y + 2); ctx.clip(); var top = h.y + 24 - u * 136;
        ctx.fillStyle = "#a16207"; rr(h.x - 52, top, 104, 130, 40); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.ellipse(h.x, top + 40, 36, 26, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(h.x - 14, top + 14, 5, 0, TAU); ctx.arc(h.x + 14, top + 14, 5, 0, TAU); ctx.fill(); ctx.fillStyle = "#f472b6"; ctx.beginPath(); ctx.ellipse(h.x, top + 26, 9, 6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fef3c7"; rr(h.x - 62, top + 54, 124, 50, 8); ctx.fill(); ctx.strokeStyle = "#78350f"; ctx.lineWidth = 3; ctx.stroke(); badge(i, h.x - 48, top + 79, 9); label(this.opts[i], h.x + 8, top + 79, 90, 44, "#1c1917", 13);
        ctx.restore();
        ctx.fillStyle = "#78350f"; ctx.beginPath(); ctx.ellipse(h.x, h.y + 4, 80, 20, 0, 0, Math.PI); ctx.fill();
      }
      var m = K.mouse, a = this.sw > 0 ? -0.9 * (this.sw / 0.2) : 0.4; ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(a); ctx.fillStyle = "#92400e"; ctx.fillRect(-4, -4, 8, 60); ctx.fillStyle = "#ef4444"; rr(-28, -34, 56, 34, 8); ctx.fill(); ctx.strokeStyle = "#7f1d1d"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
      if (this.time < 5 && this.res.length === 0) txt("whack the mole holding the right answer", W / 2, H - 14, 13, "#fff");
    }
  });

  /* ============================================================ 4.2 LOGIC ARCHERY ============ */
  K.make("u4l2", {
    build: function () { var n = this.n; this.tg = []; this.r = Math.min(58, W / n / 2 - 14); for (var i = 0; i < n; i++) this.tg.push({ x: (i + 0.5) * W / n, y: 150, ph: i * 1.7 }); this.ax = W / 2; this.ay = 170; this.arrow = null; this.stuck = []; this.cd = 0; this.wx = 0; this.wy = 0; },
    fire: function () {
      if (this.cd > 0) return; this.cd = 0.5; var tx = this.ax + this.wx, ty = this.ay + this.wy; this.arrow = { t: 0, x: tx, y: ty }; sound("zap");
    },
    key: function (e) { if (e.code === "Space") this.fire(); },
    down: function (x, y) { this.ax = x; this.ay = y; this.fire(); },
    move: function (x, y) { this.ax = x; this.ay = y; },
    step: function (dt) {
      var self = this; this.cd -= dt; this.wx = Math.sin(this.time * 2.3) * 17 + Math.sin(this.time * 5.1) * 6; this.wy = Math.cos(this.time * 1.9) * 15 + Math.sin(this.time * 4.3) * 5;
      this.tg.forEach(function (g) { g.cy = g.y + Math.sin(self.time * 1.2 + g.ph) * 12; });
      if (this.bot !== null) { var g = this.tg[this.bot]; this.ax = g.x - this.wx; this.ay = g.cy - this.wy; if (Math.abs(this.ax + this.wx - g.x) < 8 && Math.abs(this.ay + this.wy - g.cy) < 8 && this.cd <= 0) this.fire(); }
      else { if (K.keys.ArrowLeft) this.ax -= 260 * dt; if (K.keys.ArrowRight) this.ax += 260 * dt; if (K.keys.ArrowUp) this.ay -= 260 * dt; if (K.keys.ArrowDown) this.ay += 260 * dt; }
      this.ax = clamp(this.ax, 10, W - 10); this.ay = clamp(this.ay, 40, H - 60);
      var a = this.arrow; if (a) { a.t += dt; if (a.t >= 0.16) { this.arrow = null; var hit = -1; this.tg.forEach(function (g, i) { if (Math.hypot(a.x - g.x, a.y - g.cy) < self.r) hit = i; }); this.stuck.push({ x: a.x, y: a.y, t: 1.6 }); if (hit >= 0) { this.focus = [a.x, a.y]; K.commit(this, hit); } } }
      this.stuck.forEach(function (s) { s.t -= dt; }); this.stuck = this.stuck.filter(function (s) { return s.t > 0; });
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#fef3c7"); g.addColorStop(1, "#fcd34d"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#65a30d"; ctx.fillRect(0, H - 40, W, 40);
      for (i = 0; i < this.n; i++) {
        var T = this.tg[i], r = this.r; ctx.fillStyle = "#78350f"; ctx.fillRect(T.x - 5, T.cy + r - 4, 10, H - 40 - T.cy - r + 4);
        [[1, "#f8fafc"], [0.78, "#111827"], [0.58, OC[i]], [0.38, "#f8fafc"], [0.2, "#ef4444"]].forEach(function (c) { ctx.fillStyle = c[1]; ctx.beginPath(); ctx.arc(T.x, T.cy, r * c[0], 0, TAU); ctx.fill(); }); ctx.strokeStyle = "#1c1917"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(T.x, T.cy, r, 0, TAU); ctx.stroke();
        ctx.fillStyle = "rgba(15,23,42,.88)"; rr(T.x - W / this.n / 2 + 8, 252, W / this.n - 16, 60, 10); ctx.fill(); badge(i, T.x - W / this.n / 2 + 26, 282, 11); label(this.opts[i], T.x + 12, 282, W / this.n - 62, 54, "#f8fafc", 13);
      }
      this.stuck.forEach(function (s) { ctx.strokeStyle = "#78350f"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + 14, s.y + 30); ctx.stroke(); ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(s.x, s.y, 3, 0, TAU); ctx.fill(); });
      var a = this.arrow; if (a) { var p = a.t / 0.16, ax = W / 2 + (a.x - W / 2) * p, ay = H - 20 + (a.y - (H - 20)) * p; ctx.strokeStyle = "#451a03"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax - (a.x - W / 2) * 0.1, ay + 40 + (1 - p) * 20); ctx.stroke(); ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.arc(ax, ay, 5, 0, TAU); ctx.fill(); }
      var cx = this.ax + this.wx, cy = this.ay + this.wy; ctx.strokeStyle = "#dc2626"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, TAU); ctx.moveTo(cx - 26, cy); ctx.lineTo(cx + 26, cy); ctx.moveTo(cx, cy - 26); ctx.lineTo(cx, cy + 26); ctx.stroke();
      ctx.fillStyle = "#7c2d12"; ctx.fillRect(W / 2 - 3, H - 62, 6, 26); ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(W / 2, H - 26, 24, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
  });

  /* ============================================================ 4.3 COMPARISON LANDER ============ */
  K.make("u4l3", {
    build: function () { this.s = { x: W / 2, y: 50, vx: 0, vy: 0, fire: 0 }; this.pw = Math.min(150, W / this.n - 24); this.gy = H - 34; this.stars = []; for (var i = 0; i < 40; i++) this.stars.push([Math.random() * W, Math.random() * (H - 70), Math.random() * 2 + 0.5]); this.warn = 0; },
    px: function (i) { return (i + 0.5) * W / this.n; },
    crash: function () { var s = this.s; this.shake = 0.5; this.flash = 0.7; this.flashC = "255,120,40"; spawn(this.parts, s.x, s.y, 26, { colors: ["#fb923c", "#fde047", "#94a3b8"], speed: 240 }); sound("bad"); this.s = { x: W / 2, y: 50, vx: 0, vy: 0, fire: 0 }; },
    step: function (dt) {
      var s = this.s, thr = false, l = false, r = false, i; s.fire = Math.max(0, s.fire - dt); this.warn = Math.max(0, this.warn - dt);
      if (this.bot !== null) {
        var tx = this.px(this.bot), dvx = clamp((tx - s.x) * 1.2, -90, 90); if (s.vx < dvx - 8) r = true; else if (s.vx > dvx + 8) l = true;
        var aligned = Math.abs(tx - s.x) < this.pw / 2 - 20, dvy = aligned ? 75 : -5; if (s.vy > dvy && s.y > 30) thr = true;
      } else { thr = !!(K.keys.ArrowUp || K.keys.Space || K.keys.KeyW); l = !!K.keys.ArrowLeft; r = !!K.keys.ArrowRight; if (K.mouse.down) thr = true; }
      s.vy += 100 * dt; if (thr) { s.vy -= 220 * dt; s.fire = 0.1; } if (l) s.vx -= 170 * dt; if (r) s.vx += 170 * dt; s.vx *= 1 - 0.25 * dt;
      s.x += s.vx * dt; s.y += s.vy * dt; if (s.x < 16) { s.x = 16; s.vx = 0; } if (s.x > W - 16) { s.x = W - 16; s.vx = 0; } if (s.y < 14) { s.y = 14; s.vy = 0; }
      if (s.y >= this.gy - 20) {
        s.y = this.gy - 20; var on = -1; for (i = 0; i < this.n; i++) if (Math.abs(s.x - this.px(i)) <= this.pw / 2) on = i;
        if (on >= 0 && s.vy <= 100 && Math.abs(s.vx) <= 70) { this.focus = [s.x, s.y]; K.commit(this, on); s.vy = 0; s.vx = 0; } else this.crash();
      }
      this.tooFast = s.vy > 100 && s.y > this.gy - 120;
    },
    draw: function (t) {
      var ctx = K.ctx, i, s = this.s; ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H); this.stars.forEach(function (q) { ctx.fillStyle = "rgba(255,255,255," + (0.4 + 0.5 * Math.sin(t * 2 + q[0])) + ")"; ctx.fillRect(q[0], q[1], q[2], q[2]); });
      ctx.fillStyle = "#475569"; ctx.fillRect(0, this.gy, W, H - this.gy); ctx.fillStyle = "#64748b"; for (i = 0; i < 20; i++) ctx.fillRect(i * 44 + 10, this.gy + 6, 14, 5);
      for (i = 0; i < this.n; i++) { var x = this.px(i); ctx.fillStyle = OC[i]; ctx.fillRect(x - this.pw / 2, this.gy - 5, this.pw, 7); ctx.fillStyle = "rgba(15,23,42,.88)"; rr(x - this.pw / 2, this.gy - 62, this.pw, 52, 8); ctx.fill(); badge(i, x - this.pw / 2 + 16, this.gy - 36, 10); label(this.opts[i], x + 10, this.gy - 36, this.pw - 46, 48, "#f8fafc", 13); }
      ctx.save(); ctx.translate(s.x, s.y); ctx.fillStyle = "#e2e8f0"; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(14, 6); ctx.lineTo(-14, 6); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(0, -6, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, 6); ctx.lineTo(-17, 20); ctx.moveTo(10, 6); ctx.lineTo(17, 20); ctx.stroke();
      if (s.fire > 0) { ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.moveTo(-8, 8); ctx.lineTo(0, 26 + Math.random() * 10); ctx.lineTo(8, 8); ctx.fill(); } ctx.restore();
      txt("speed " + Math.round(Math.max(0, s.vy)) + "  (land under 100)", 120, 16, 11, s.vy > 100 ? "#fca5a5" : "#86efac");
      if (this.time < 6 && this.res.length === 0) txt("UP thrusts, LEFT and RIGHT steer. Land softly on the right pad.", W / 2, 44, 12, "#a5b4fc");
    }
  });

  /* ============================================================ 4.4 IF CLIMB (jump up the platforms) ============ */
  K.make("u4l4", {
    GOAL: 1250,
    build: function () {
      var y = -85, self = this; this.pl = []; this.p = { x: W / 2, y: -20, vx: 0, vy: -640, face: 1 }; this.cam = -(H - 40); this.clouds = []; for (var i = 0; i < 8; i++) this.clouds.push([Math.random() * W, Math.random() * 1400 - 1300, 0.3 + Math.random() * 0.4]);
      this.pw = W / this.n;   /* one staircase of platforms under every answer ledge: pick your staircase, then climb it */
      for (var c = 0; c < this.n; c++) { var px = (c + 0.5) * this.pw - 45, yy = -85; for (;;) { this.pl.push({ x: px, y: yy, w: 90, col: c }); if (yy <= -this.GOAL + 110) break; yy = Math.max(yy - (70 + Math.random() * 30), -this.GOAL + 85); px = clamp(px + (Math.random() - 0.5) * 230, c * this.pw + 3, (c + 1) * this.pw - 93); } }
      this.mx = null; this.pick = true;
    },
    move: function (x) { this.mx = x; },
    step: function (dt) {
      var p = this.p, self = this, i, tx = null, ledgeY = -this.GOAL; p.vy += 1300 * dt; var oy = p.y; p.y += p.vy * dt;
      if (this.bot !== null) {
        if (this.pick !== false) {   /* choose the next platform ONCE per bounce, then steer to it */
          var best = null, bxx = null, gx = (this.bot + 0.5) * this.pw, self = this, low = null;
          if (ledgeY > p.y - 120 && ledgeY < p.y - 10 && Math.abs(gx - p.x) <= 150) bxx = gx;
          else {
            this.pl.forEach(function (q) { if (q.col !== self.bot) return; if (low === null || q.y > low.y) low = q; if (!(q.y < p.y - 25 && q.y > p.y - 120)) return; var dx = q.x + q.w / 2 - p.x; if (dx > W / 2) dx -= W; if (dx < -W / 2) dx += W; if (Math.abs(dx) > 150) return; if (best === null || q.y < best.y) { best = q; bxx = p.x + dx; } });
            if (best === null) {   /* nothing to jump to from here: head for the nearest lower platform of my staircase (or the first one, from the ground) */
              var near = null, nd = 1e9; this.pl.forEach(function (q) { if (q.col !== self.bot || q.y < p.y + 20 - 40) return; var d = Math.abs(q.x + q.w / 2 - p.x); if (d < nd) { nd = d; near = q; } });
              bxx = p.y > -40 ? (low ? low.x + low.w / 2 : p.x) : (near ? near.x + near.w / 2 : p.x);
            }
          }
          this.btx = bxx; this.pick = false;
        }
        var bx = this.btx - p.x; if (bx > W / 2) bx -= W; if (bx < -W / 2) bx += W;
        p.vx = Math.abs(bx) > 8 ? Math.sign(bx) * 245 : 0;
      } else { p.vx = 0; if (K.keys.ArrowLeft) p.vx = -245; if (K.keys.ArrowRight) p.vx = 245; if (this.mx !== null && !p.vx) { var d = this.mx - p.x; p.vx = clamp(d * 6, -245, 245); } }
      if (p.vx) p.face = p.vx > 0 ? 1 : -1; p.x += p.vx * dt; if (p.x < 0) p.x += W; if (p.x > W) p.x -= W;
      if (p.vy > 0) {
        for (i = 0; i < this.pl.length; i++) { var q = this.pl[i]; if (oy + 14 <= q.y + 1 && p.y + 14 >= q.y && p.x > q.x - 8 && p.x < q.x + q.w + 8) { p.y = q.y - 14; p.vy = -640; this.pick = true; sound("tick"); break; } }
        if (p.y + 14 >= ledgeY && oy + 14 <= ledgeY + 1) { p.y = ledgeY - 14; this.focus = [p.x, H / 2]; p.vy = -300; K.commit(this, Math.min(this.n - 1, Math.floor(p.x / this.pw))); }
        if (p.y >= -14) { p.y = -14; p.vy = -640; this.pick = true; }
      }
      this.cam = Math.min(this.cam, p.y - 170); if (this.cam > -(H - 40)) this.cam = -(H - 40);
    },
    draw: function (t) {
      var ctx = K.ctx, cam = this.cam, i, p = this.p, prog = clamp(-cam / this.GOAL, 0, 1), g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, prog > 0.6 ? "#312e81" : "#38bdf8"); g.addColorStop(1, prog > 0.3 ? "#7dd3fc" : "#bae6fd"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      this.clouds.forEach(function (c) { var y = c[1] - cam * c[2] * 0.5 - cam * 0; ctx.fillStyle = "rgba(255,255,255,.55)"; var sy = (c[1] * 1 - cam * (1 - c[2] * 0.3)) % (H + 80); if (sy < -40) sy += H + 80; ctx.beginPath(); ctx.arc(c[0], sy, 20, 0, TAU); ctx.arc(c[0] + 24, sy + 5, 16, 0, TAU); ctx.arc(c[0] - 24, sy + 5, 15, 0, TAU); ctx.fill(); });
      ctx.fillStyle = "#65a30d"; ctx.fillRect(0, -cam, W, 60); for (i = 0; i < this.n; i++) { var gx0 = i * this.pw; ctx.fillStyle = "rgba(15,23,42,.88)"; rr(gx0 + 8, -cam - 62, this.pw - 16, 50, 8); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.stroke(); badge(i, gx0 + 24, -cam - 37, 9); label(this.opts[i], gx0 + 32 + (this.pw - 46) / 2, -cam - 37, this.pw - 52, 44, "#f8fafc", 12); }
      this.pl.forEach(function (q) { var sy = q.y - cam; if (sy < -20 || sy > H + 20) return; ctx.fillStyle = "#4ade80"; rr(q.x, sy, q.w, 14, 6); ctx.fill(); ctx.strokeStyle = "#166534"; ctx.lineWidth = 2; ctx.stroke(); });
      var ly = -this.GOAL - cam;
      if (ly > -120) { for (i = 0; i < this.n; i++) { var x0 = i * this.pw; ctx.fillStyle = OC[i]; ctx.fillRect(x0 + 3, ly, this.pw - 6, 18); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2; ctx.strokeRect(x0 + 3, ly, this.pw - 6, 18); ctx.fillStyle = "rgba(15,23,42,.9)"; rr(x0 + 6, ly - 62, this.pw - 12, 56, 8); ctx.fill(); badge(i, x0 + 22, ly - 34, 10); label(this.opts[i], x0 + 30 + (this.pw - 46) / 2, ly - 34, this.pw - 52, 50, "#f8fafc", 13); } }
      var sy = p.y - cam; ctx.save(); ctx.translate(p.x, sy); ctx.scale(p.face, 1); ctx.fillStyle = "#a3e635"; rr(-12, -22, 24, 30, 10); ctx.fill(); ctx.strokeStyle = "#365314"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(2, -12, 6, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(4, -12, 2.5, 0, TAU); ctx.fill(); ctx.fillStyle = "#facc15"; ctx.fillRect(-8, 8, 6, 8); ctx.fillRect(2, 8, 6, 8); ctx.restore();
      ctx.fillStyle = "rgba(15,23,42,.6)"; ctx.fillRect(14, 30, 10, H - 80); ctx.fillStyle = "#fde047"; ctx.fillRect(14, 30 + (H - 80) * (1 - prog), 10, (H - 80) * prog);
      if (this.time < 6 && this.res.length === 0) txt("LEFT/RIGHT (or the mouse) steer. You bounce by yourself. Climb to the answers!", W / 2, H - 14, 12, "#1e3a8a");
    }
  });

  /* ============================================================ 4.5 ELIF EXPRESS (train and track switches) ============ */
  K.make("u4l5", {
    X1: 260, X2: 480,
    build: function () {
      var n = this.n, h = Math.ceil(n / 2); this.Y = []; for (var i = 0; i < n; i++) this.Y.push(48 + (i + 0.5) * (H - 70) / n); this.halves = [[], []]; for (i = 0; i < n; i++) this.halves[i < h ? 0 : 1].push(i);
      if (!this.halves[1].length) this.halves.pop(); this.sw = [0, 0]; this.train = { x: 30 }; this.wait = 3.2; this.mid = (this.Y[0] + this.Y[n - 1]) / 2;
    },
    yh: function (hh) { var s = this.halves[hh], a = 0; s.forEach(function (i) { a += this.Y[i]; }, this); return a / s.length; },
    dest: function () { var hh = Math.min(this.sw[0], this.halves.length - 1), s = this.halves[hh], k = Math.min(this.sw[1], s.length - 1); return s[k]; },
    pathY: function (x) {
      var hh = Math.min(this.sw[0], this.halves.length - 1), yh = this.yh(hh), ys = this.Y[this.dest()], sm = function (u) { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
      if (x < this.X1) return this.mid; if (x < this.X1 + 120) return this.mid + (yh - this.mid) * sm((x - this.X1) / 120); if (x < this.X2) return yh; if (x < this.X2 + 120) return yh + (ys - yh) * sm((x - this.X2) / 120); return ys;
    },
    setNext: function (d) { var k = this.train.x < this.X1 - 20 ? 0 : this.train.x < this.X2 - 20 ? 1 : -1; if (k >= 0) { this.sw[k] = d; sound("tick"); } },
    key: function (e) { if (e.code === "ArrowUp") this.setNext(0); else if (e.code === "ArrowDown") this.setNext(1); else if (e.code === "Space") { var k = this.train.x < this.X1 - 20 ? 0 : 1; this.setNext(this.sw[k] ? 0 : 1); } },
    down: function (x, y) { this.setNext(y < H / 2 ? 0 : 1); },
    step: function (dt) {
      var tr = this.train; if (this.bot !== null) { var tgt = this.bot, hh = this.halves[0].indexOf(tgt) >= 0 ? 0 : 1; this.sw[0] = hh; this.sw[1] = this.halves[hh].indexOf(tgt); }
      if (this.wait > 0) { this.wait -= dt; return; } tr.x += 115 * dt;
      if (tr.x >= W - 150) { this.focus = [tr.x, this.pathY(tr.x)]; K.commit(this, this.dest()); tr.x = W - 150; }
    },
    draw: function (t) {
      var ctx = K.ctx, i, self = this; ctx.fillStyle = "#14532d"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#166534"; for (i = 0; i < 60; i++) ctx.fillRect((i * 97) % W, (i * 53) % H, 8, 5);
      var track = function (col, wd, fn) { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); for (var x = 0; x <= W - 100; x += 6) { var y = fn(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
      var save = this.sw.slice(); this.halves.forEach(function (hs, hh) { hs.forEach(function (st, k) { self.sw = [hh, k]; track("#78350f", 9, function (x) { return self.pathY(x); }); }); });
      this.halves.forEach(function (hs, hh) { hs.forEach(function (st, k) { self.sw = [hh, k]; track("#d6d3d1", 3, function (x) { return self.pathY(x); }); }); });
      this.sw = save; track("#fde047", 4, function (x) { return self.pathY(x); });
      for (i = 0; i < this.n; i++) { var y = this.Y[i]; ctx.fillStyle = "rgba(15,23,42,.9)"; rr(W - 150, y - 25, 148, 50, 10); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.stroke(); badge(i, W - 130, y, 10); label(this.opts[i], W - 66, y, 100, 46, "#f8fafc", 12); }
      [this.X1, this.X2].forEach(function (x, k) { var y = k === 0 ? self.mid : self.yh(Math.min(self.sw[0], self.halves.length - 1)); ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(x, y, 16, 0, TAU); ctx.fill(); ctx.fillStyle = "#fde047"; ctx.font = "700 18px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(self.sw[k] ? "↓" : "↑", x, y + 1); txt(k === 0 ? "SWITCH 1" : "SWITCH 2", x, y - 26, 10, "#fef9c3"); });
      var tr = this.train, ty = this.pathY(tr.x), ang = Math.atan2(this.pathY(tr.x + 6) - this.pathY(tr.x - 6), 12);
      ctx.save(); ctx.translate(tr.x, ty); ctx.rotate(ang); ctx.fillStyle = "#dc2626"; rr(-30, -13, 56, 26, 6); ctx.fill(); ctx.fillStyle = "#1e293b"; ctx.fillRect(10, -20, 12, 10); ctx.fillStyle = "#fde68a"; ctx.fillRect(-20, -8, 12, 10); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(-18, 13, 5, 0, TAU); ctx.arc(10, 13, 5, 0, TAU); ctx.fill(); ctx.restore();
      if (this.wait > 0) txt("train leaves in " + Math.ceil(this.wait), W / 2, 20, 14, "#fde68a"); else if (this.time < 9 && this.res.length === 0) txt("UP / DOWN (or click the top or bottom) set the next switch", W / 2, 20, 12, "#fde68a");
    }
  });

  /* ============================================================ 4.6 KEY BEAT (arrow rhythm) ============ */
  K.make("u4l6", {
    KEYS: ["ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"], GLYPH: ["←", "↓", "↑", "→"], LINE: H - 62, V: 100,
    build: function () { this.lw = W / this.n; this.off = shuffled(this.n).map(function (v, k) { return v * 1.35 + k * 0.05; }); this.press = []; this.zone = 42; this.cool = 0; },
    ny: function (i) { var per = (H + 130) / this.V; return ((this.time + this.off[i]) % per) * this.V - 40; },
    tap: function (i) {
      if (this.cool > 0) return; this.press[i] = 0.18; var y = this.ny(i); if (Math.abs(y - this.LINE) <= this.zone) { this.focus = [(i + 0.5) * this.lw, this.LINE]; K.commit(this, i); } else { this.cool = 0.25; this.press[i] = 0.18; sound("tick"); }
    },
    key: function (e) { var k = this.KEYS.indexOf(e.code); if (k < 0) { var d = /^Digit([1-4])$/.exec(e.code); if (d) k = +d[1] - 1; } if (k >= 0 && k < this.n) this.tap(k); },
    down: function (x, y) { if (y > this.LINE - 40) this.tap(Math.min(this.n - 1, Math.floor(x / this.lw))); },
    step: function (dt) { this.cool -= dt; for (var i = 0; i < this.n; i++) if (this.press[i] > 0) this.press[i] -= dt; if (this.bot !== null && Math.abs(this.ny(this.bot) - this.LINE) < 12) this.tap(this.bot); },
    draw: function (t) {
      var ctx = K.ctx, i, lw = this.lw; var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#0f0a2e"); g.addColorStop(1, "#2e1065"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < this.n; i++) {
        ctx.fillStyle = i % 2 ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.08)"; ctx.fillRect(i * lw, 0, lw, H); var y = this.ny(i), ink = Math.abs(y - this.LINE) <= this.zone;
        ctx.fillStyle = ink ? "rgba(253,224,71,.9)" : OC[i]; rr(i * lw + 12, y - 24, lw - 24, 48, 12); ctx.fill(); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 3; ctx.stroke(); badge(i, i * lw + 30, y, 10); label(this.opts[i], i * lw + 40 + (lw - 64) / 2, y, lw - 76, 44, "#0f172a", 13);
        var pr = this.press[i] > 0; ctx.fillStyle = pr ? "#fde047" : "rgba(15,23,42,.9)"; rr(i * lw + lw / 2 - 30, this.LINE - 26, 60, 52, 12); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 4; ctx.stroke(); txt(this.GLYPH[i], i * lw + lw / 2, this.LINE + 2, 28, pr ? "#0f172a" : OC[i]);
      }
      ctx.strokeStyle = "rgba(253,224,71,.6)"; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(0, this.LINE - this.zone); ctx.lineTo(W, this.LINE - this.zone); ctx.moveTo(0, this.LINE + this.zone); ctx.lineTo(W, this.LINE + this.zone); ctx.stroke(); ctx.setLineDash([]);
      if (this.time < 7 && this.res.length === 0) txt("press the arrow key under the right answer when it is on the line", W / 2, H - 12, 12, "#c4b5fd");
    }
  });
})();
