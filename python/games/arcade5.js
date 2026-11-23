/* THE UNIT 5 AND 6 ARCADE GAMES: 5.1 to 5.6 and 6.1 to 6.3.
   Function Kick (penalty shootout), Putt Params (mini golf), Return Bowling, Swing Drop (a swinging crane), API Slingshot, High Striker (hold and release), Rules Plinko, Wind Layers (hot air balloon), Color Invaders. */
(function () {
  "use strict";
  var K = window.ArcadeKit, W = K.W, H = K.H, TAU = K.TAU, OC = K.OC, LET = K.LET, clamp = K.clamp, rr = K.rr, txt = K.txt, sound = K.sound, label = K.label, badge = K.badge, spawn = K.spawn;
  function shuffled(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); a.sort(function () { return Math.random() - 0.5; }); return a; }

  /* ============================================================ 5.1 FUNCTION KICK (penalty shootout) ============ */
  K.make("u5l1", {
    GX: 80, GW: 640, GT: 34, GB: 176, FLY: 0.42,
    build: function () { this.ax = W / 2; this.ay = 110; this.ball = null; this.cool = 0; this.saved = 0; this.gz = this.GW / this.n; this.kw = this.gz * 0.82; this.kc = 0; },
    keeperX: function (t) { var A = this.GW / 2 - this.kw / 2 - 4; return this.GX + this.GW / 2 + A * Math.sin(t * 1.45); },
    fire: function () { if (this.ball || this.cool > 0) return; this.ball = { t: 0, tx: this.ax, ty: this.ay }; sound("zap"); },
    key: function (e) { if (e.code === "Space") this.fire(); },
    down: function (x, y) { this.move(x, y); this.fire(); },
    move: function (x, y) { this.ax = clamp(x, this.GX + 4, this.GX + this.GW - 4); this.ay = clamp(y, this.GT + 6, this.GB - 6); },
    step: function (dt) {
      this.cool -= dt; this.saved = Math.max(0, this.saved - dt);
      if (this.bot !== null) { var tc = this.GX + (this.bot + 0.5) * this.gz; this.ax = tc; this.ay = (this.GT + this.GB) / 2; if (!this.ball && this.cool <= 0 && Math.abs(this.keeperX(this.time + this.FLY) - tc) > this.kw / 2 + 14 && Math.abs(this.keeperX(this.time) - tc) > this.kw / 2 + 6) this.fire(); }
      else { if (K.keys.ArrowLeft) this.ax -= 300 * dt; if (K.keys.ArrowRight) this.ax += 300 * dt; if (K.keys.ArrowUp) this.ay -= 300 * dt; if (K.keys.ArrowDown) this.ay += 300 * dt; this.move(this.ax, this.ay); }
      var b = this.ball; if (b) {
        b.t += dt; if (b.t >= this.FLY) {
          this.ball = null; var kx = this.keeperX(this.time);
          if (Math.abs(b.tx - kx) < this.kw / 2 + 4) { this.saved = 0.8; this.cool = 0.7; this.shake = 0.3; sound("bad"); }
          else { this.cool = 0.3; this.focus = [b.tx, b.ty]; K.commit(this, Math.min(this.n - 1, Math.floor((b.tx - this.GX) / this.gz))); }
        }
      }
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1e3a8a"); g.addColorStop(0.3, "#1e3a8a"); g.addColorStop(0.31, "#15803d"); g.addColorStop(1, "#166534"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.05)"; ctx.fillRect(0, 140 + i * 28, W, 28); }
      ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(this.GX, this.GT, this.GW, this.GB - this.GT);
      for (i = 0; i < this.n; i++) { var x0 = this.GX + i * this.gz; ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1; for (var q = 1; q < 5; q++) { ctx.beginPath(); ctx.moveTo(x0 + q * this.gz / 5, this.GT); ctx.lineTo(x0 + q * this.gz / 5, this.GB); ctx.stroke(); } ctx.fillStyle = "rgba(15,23,42,.8)"; rr(x0 + 8, this.GT + 6, this.gz - 16, 38, 8); ctx.fill(); badge(i, x0 + 24, this.GT + 25, 9); label(this.opts[i], x0 + 32 + (this.gz - 48) / 2, this.GT + 25, this.gz - 56, 34, "#f8fafc", 12); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.strokeRect(x0 + 2, this.GT + 2, this.gz - 4, this.GB - this.GT - 4); }
      ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 7; ctx.strokeRect(this.GX, this.GT, this.GW, this.GB - this.GT);
      var kx = this.keeperX(this.time), ky = this.GB - 40; ctx.fillStyle = "#facc15"; rr(kx - this.kw / 2, ky - 8, this.kw, 20, 8); ctx.fill(); ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(kx, ky - 24, 14, 0, TAU); ctx.fill(); ctx.strokeStyle = "#facc15"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(kx - this.kw / 2 + 2, ky); ctx.lineTo(kx - this.kw / 2 - 14, ky - 22); ctx.moveTo(kx + this.kw / 2 - 2, ky); ctx.lineTo(kx + this.kw / 2 + 14, ky - 22); ctx.stroke(); ctx.fillStyle = "#1e293b"; ctx.fillRect(kx - 14, ky + 12, 10, 26); ctx.fillRect(kx + 4, ky + 12, 10, 26);
      var b = this.ball, p = b ? b.t / this.FLY : 0; if (b) { var bx = W / 2 + (b.tx - W / 2) * p, by = H - 40 + (b.ty - (H - 40)) * p, r = 16 - 9 * p; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bx, by, r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.stroke(); } else { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(W / 2, H - 40, 16, 0, TAU); ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(W / 2, H - 40, 5, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(this.ax, this.ay, 13, 0, TAU); ctx.moveTo(this.ax - 20, this.ay); ctx.lineTo(this.ax + 20, this.ay); ctx.moveTo(this.ax, this.ay - 20); ctx.lineTo(this.ax, this.ay + 20); ctx.stroke();
      if (this.saved > 0) txt("SAVED! Shoot again", W / 2, 230, 26, "#fecaca");
      else if (this.time < 7 && this.res.length === 0) txt("aim at an answer, click or SPACE to shoot. Don't shoot where the keeper is!", W / 2, 210, 12, "#e0f2fe");
    }
  });

  /* ============================================================ 5.2 PUTT PARAMS (mini golf) ============ */
  K.make("u5l2", {
    FR: 300, PM: 2.2,
    build: function () { this.sx = W / 2; this.sy = H - 52; this.ball = { x: this.sx, y: this.sy, vx: 0, vy: 0, mv: false }; this.aim = -Math.PI / 2; this.pow = 280; this.holes = []; for (var i = 0; i < this.n; i++) this.holes.push({ x: (i + 0.5) * (W - 80) / this.n + 40, y: 120 + (i % 2) * 36 }); this.rest = 0; this.mouseAim = false; },
    putt: function () { var b = this.ball; if (b.mv) return; b.vx = Math.cos(this.aim) * this.pow; b.vy = Math.sin(this.aim) * this.pow; b.mv = true; sound("zap"); },
    aimAt: function (x, y) { var dx = x - this.ball.x, dy = y - this.ball.y; this.aim = Math.atan2(dy, dx); this.pow = clamp(Math.hypot(dx, dy) * this.PM, 70, 520); },
    key: function (e) { if (e.code === "Space") this.putt(); },
    down: function (x, y) { this.aimAt(x, y); this.putt(); },
    move: function (x, y) { if (!this.ball.mv) this.aimAt(x, y); },
    reset: function () {},
    step: function (dt) {
      var b = this.ball, i;
      if (!b.mv) {
        if (this.bot !== null) { var h = this.holes[this.bot], L = Math.hypot(h.x - b.x, h.y - b.y); this.aim = Math.atan2(h.y - b.y, h.x - b.x); this.pow = Math.sqrt(140 * 140 + 2 * this.FR * L); this.putt(); }
        else { if (K.keys.ArrowLeft) this.aim -= 1.4 * dt; if (K.keys.ArrowRight) this.aim += 1.4 * dt; if (K.keys.ArrowUp) this.pow = clamp(this.pow + 240 * dt, 70, 520); if (K.keys.ArrowDown) this.pow = clamp(this.pow - 240 * dt, 70, 520); }
        return;
      }
      var steps = 4, k; for (k = 0; k < steps; k++) {
        var sp = Math.hypot(b.vx, b.vy); if (sp > 0) { var ns = Math.max(0, sp - this.FR * dt / steps); b.vx *= ns / sp; b.vy *= ns / sp; } b.x += b.vx * dt / steps; b.y += b.vy * dt / steps;
        if (b.x < 18) { b.x = 18; b.vx = -b.vx * 0.75; } if (b.x > W - 18) { b.x = W - 18; b.vx = -b.vx * 0.75; } if (b.y < 18) { b.y = 18; b.vy = -b.vy * 0.75; } if (b.y > H - 18) { b.y = H - 18; b.vy = -b.vy * 0.75; }
        for (i = 0; i < this.holes.length; i++) { var h2 = this.holes[i]; if (Math.hypot(b.x - h2.x, b.y - h2.y) < 16 && Math.hypot(b.vx, b.vy) < 320) { this.focus = [h2.x, h2.y]; b.mv = false; b.vx = b.vy = 0; b.x = h2.x; b.y = h2.y; K.commit(this, i); return; } }
      }
      if (Math.hypot(b.vx, b.vy) < 6) { this.rest += dt; if (this.rest > 0.5) { this.rest = 0; b.mv = false; b.vx = b.vy = 0; b.x = this.sx; b.y = this.sy; } } else this.rest = 0;
    },
    draw: function (t) {
      var ctx = K.ctx, i, b = this.ball; ctx.fillStyle = "#14532d"; ctx.fillRect(0, 0, W, H); for (i = 0; i < 30; i++) { ctx.fillStyle = i % 2 ? "#166534" : "#15803d"; ctx.fillRect(i * 27, 0, 27, H); }
      ctx.strokeStyle = "#78350f"; ctx.lineWidth = 14; ctx.strokeRect(5, 5, W - 10, H - 10);
      for (i = 0; i < this.n; i++) { var h = this.holes[i]; ctx.fillStyle = "#020617"; ctx.beginPath(); ctx.arc(h.x, h.y, 16, 0, TAU); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(h.x, h.y - 44); ctx.stroke(); ctx.fillStyle = "rgba(15,23,42,.88)"; var bw = Math.min(150, (W - 80) / this.n - 6); rr(h.x - bw / 2, h.y - 90, bw, 44, 8); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 2; ctx.stroke(); badge(i, h.x - bw / 2 + 16, h.y - 68, 9); label(this.opts[i], h.x + 8, h.y - 68, bw - 40, 40, "#f8fafc", 12); }
      if (!b.mv) { var len = this.pow / this.PM; ctx.strokeStyle = "rgba(253,224,71,.85)"; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + Math.cos(this.aim) * len, b.y + Math.sin(this.aim) * len); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "rgba(15,23,42,.8)"; ctx.fillRect(20, H - 36, 120, 12); ctx.fillStyle = "#fde047"; ctx.fillRect(20, H - 36, 120 * (this.pow - 70) / 450, 12); txt("POWER", 80, H - 46, 10, "#fef9c3"); }
      ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(b.x + 2, b.y + 4, 10, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(b.x, b.y, 9, 0, TAU); ctx.fill(); ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 2; ctx.stroke();
      if (this.time < 7 && this.res.length === 0) txt("aim with the mouse (the farther away, the harder the putt), then click. Roll in slowly!", W / 2, H - 14, 12, "#dcfce7");
    }
  });

  /* ============================================================ 5.3 RETURN BOWLING ============ */
  K.make("u5l3", {
    LX: 100, LW: 600, PY: 118,
    build: function () { this.bx = W / 2; this.by = H - 36; this.ball = null; this.cool = 0; this.cw = this.LW / this.n; this.pinsDown = []; },
    cxs: function (i) { return this.LX + (i + 0.5) * this.cw; },
    roll: function () { if (this.ball || this.cool > 0) return; this.ball = { x: this.bx, y: this.by, vx: 0 }; sound("zap"); },
    key: function (e) { if (e.code === "Space") this.roll(); },
    down: function (x) { if (!this.ball) this.bx = clamp(x, this.LX + 14, this.LX + this.LW - 14); this.roll(); },
    move: function (x) { if (!this.ball) this.mx = x; },
    step: function (dt) {
      this.cool -= dt; var b = this.ball;
      if (!b) { if (this.bot !== null) { this.bx += clamp(this.cxs(this.bot) - this.bx, -400 * dt, 400 * dt); if (Math.abs(this.bx - this.cxs(this.bot)) < 3 && this.cool <= 0) this.roll(); } else { if (this.mx !== undefined && this.mx !== null) { this.bx += clamp(this.mx - this.bx, -420 * dt, 420 * dt); } if (K.keys.ArrowLeft) { this.bx -= 260 * dt; this.mx = null; } if (K.keys.ArrowRight) { this.bx += 260 * dt; this.mx = null; } } this.bx = clamp(this.bx, this.LX + 14, this.LX + this.LW - 14); return; }
      if (this.bot === null) { if (K.keys.ArrowLeft) b.vx -= 230 * dt; if (K.keys.ArrowRight) b.vx += 230 * dt; b.vx = clamp(b.vx, -140, 140); }
      b.x += b.vx * dt; b.y -= 330 * dt;
      if (b.x < this.LX - 4 || b.x > this.LX + this.LW + 4) b.gutter = true;
      if (b.y <= this.PY + 26) {
        this.ball = null; this.cool = 0.4;
        if (!b.gutter) { var hit = Math.min(this.n - 1, Math.max(0, Math.floor((b.x - this.LX) / this.cw))); if (Math.abs(b.x - this.cxs(hit)) < this.cw / 2) { this.focus = [this.cxs(hit), this.PY]; spawn(this.parts, this.cxs(hit), this.PY, 22, { colors: ["#fff", "#ef4444"], speed: 240 }); K.commit(this, hit); return; } }
        sound("bad");
      }
    },
    draw: function (t) {
      var ctx = K.ctx, i, b = this.ball; ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, W, H); for (i = 0; i < 8; i++) { ctx.fillStyle = "rgba(244,114,182,.08)"; ctx.fillRect(i * 110, 0, 50, H); }
      ctx.fillStyle = "#a16207"; ctx.fillRect(this.LX, 0, this.LW, H); for (i = 0; i < 9; i++) { ctx.fillStyle = i % 2 ? "#b45309" : "#ca8a04"; ctx.fillRect(this.LX + i * this.LW / 9, 0, this.LW / 9, H); }
      ctx.fillStyle = "#0f172a"; ctx.fillRect(this.LX - 30, 0, 30, H); ctx.fillRect(this.LX + this.LW, 0, 30, H); ctx.fillStyle = "rgba(255,255,255,.35)"; for (i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(this.LX + 40 + i * 60, 250 + (i % 2) * 14); ctx.lineTo(this.LX + 48 + i * 60, 268 + (i % 2) * 14); ctx.lineTo(this.LX + 32 + i * 60, 268 + (i % 2) * 14); ctx.fill(); }
      for (i = 0; i < this.n; i++) {
        var cx = this.cxs(i); ctx.fillStyle = "rgba(15,23,42,.9)"; rr(cx - this.cw / 2 + 4, 4, this.cw - 8, 54, 8); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.stroke(); badge(i, cx - this.cw / 2 + 20, 31, 9); label(this.opts[i], cx + 10, 31, this.cw - 52, 48, "#f8fafc", 12);
        [[0, 0], [-16, 22], [16, 22]].forEach(function (p) { ctx.fillStyle = "#f8fafc"; rr(cx + p[0] - 7, this.PY + p[1] - 13, 14, 26, 6); ctx.fill(); ctx.fillStyle = "#ef4444"; ctx.fillRect(cx + p[0] - 7, this.PY + p[1] - 5, 14, 4); ctx.strokeStyle = "#64748b"; ctx.lineWidth = 1.5; rr(cx + p[0] - 7, this.PY + p[1] - 13, 14, 26, 6); ctx.stroke(); }, this);
      }
      var x = b ? b.x : this.bx, y = b ? b.y : this.by; if (!b) { ctx.strokeStyle = "rgba(253,224,71,.5)"; ctx.setLineDash([6, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, this.PY + 30); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(x + 3, y + 5, 16, 9, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#1d4ed8"; ctx.beginPath(); ctx.arc(x, y, 15, 0, TAU); ctx.fill(); ctx.fillStyle = "#93c5fd"; ctx.beginPath(); ctx.arc(x - 5, y - 6, 4, 0, TAU); ctx.fill(); ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(x + 3, y + 1, 2.5, 0, TAU); ctx.arc(x + 7, y + 5, 2.5, 0, TAU); ctx.arc(x + 1, y + 6, 2.5, 0, TAU); ctx.fill();
      if (this.time < 7 && this.res.length === 0) txt("slide with the mouse or LEFT/RIGHT, click or SPACE to roll. LEFT/RIGHT curves the ball.", W / 2, H - 8, 11, "#fde68a");
    }
  });

  /* ============================================================ 5.4 SWING DROP (swinging crane) ============ */
  K.make("u5l4", {
    L: 250, A: 1.0, OM: 1.6, PX: W / 2, PY: 14, BX0: 130, BX1: 670, BY: H - 64, G: 900,
    build: function () { this.rel = null; this.cool = 0; this.bw = (this.BX1 - this.BX0) / this.n; },
    state: function (t) { var th = this.A * Math.sin(this.OM * t), w = this.A * this.OM * Math.cos(this.OM * t); return { x: this.PX + this.L * Math.sin(th), y: this.PY + this.L * Math.cos(th), vx: this.L * Math.cos(th) * w, vy: -this.L * Math.sin(th) * w }; },
    landing: function (s) { var d = this.BY - s.y, tt = (-s.vy + Math.sqrt(s.vy * s.vy + 2 * this.G * d)) / this.G; return s.x + s.vx * tt; },
    drop: function () { if (this.rel || this.cool > 0) return; var s = this.state(this.time); this.rel = { x: s.x, y: s.y, vx: s.vx, vy: s.vy }; sound("tick"); },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowDown") this.drop(); },
    down: function () { this.drop(); },
    step: function (dt) {
      this.cool -= dt;
      if (this.bot !== null && !this.rel && this.cool <= 0) { var lx = this.landing(this.state(this.time)), tc = this.BX0 + (this.bot + 0.5) * this.bw; if (Math.abs(lx - tc) < Math.min(20, this.bw * 0.18)) this.drop(); }
      var r = this.rel; if (r) {
        r.vy += this.G * dt; r.x += r.vx * dt; r.y += r.vy * dt;
        if (r.y >= this.BY) { this.rel = null; this.cool = 0.6; if (r.x >= this.BX0 && r.x <= this.BX1) { this.focus = [r.x, this.BY]; K.commit(this, Math.min(this.n - 1, Math.floor((r.x - this.BX0) / this.bw))); } else sound("bad"); }
      }
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7c2d12"); g.addColorStop(1, "#fdba74"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#1c1917"; ctx.fillRect(0, 0, W, 10); ctx.fillStyle = "#facc15"; for (i = 0; i < 20; i++) ctx.fillRect(i * 44 + (i % 2) * 6, 0, 22, 10);
      ctx.fillStyle = "#44403c"; ctx.fillRect(this.PX - 24, 0, 48, 24); ctx.fillStyle = "#64748b"; ctx.fillRect(0, H - 22, W, 22);
      for (i = 0; i < this.n; i++) { var x0 = this.BX0 + i * this.bw; ctx.fillStyle = "rgba(15,23,42,.85)"; ctx.fillRect(x0 + 3, this.BY, this.bw - 6, H - 22 - this.BY); ctx.strokeStyle = OC[i]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0 + 3, this.BY - 8); ctx.lineTo(x0 + 3, H - 22); ctx.lineTo(x0 + this.bw - 3, H - 22); ctx.lineTo(x0 + this.bw - 3, this.BY - 8); ctx.stroke(); badge(i, x0 + 20, this.BY + 20, 10); label(this.opts[i], x0 + 28 + (this.bw - 38) / 2, this.BY + 20, this.bw - 50, 38, "#f8fafc", 12); }
      var s = this.rel ? this.rel : this.state(this.time); if (!this.rel) { ctx.strokeStyle = "#e5e7eb"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(this.PX, this.PY + 8); ctx.lineTo(s.x, s.y); ctx.stroke(); var lx = this.landing(s); ctx.fillStyle = "rgba(253,224,71,.9)"; ctx.beginPath(); ctx.moveTo(lx, this.BY - 14); ctx.lineTo(lx - 8, this.BY - 28); ctx.lineTo(lx + 8, this.BY - 28); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#475569"; rr(s.x - 22, s.y - 6, 44, 36, 6); ctx.fill(); ctx.fillStyle = "#facc15"; ctx.fillRect(s.x - 22, s.y - 6, 44, 8); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 3; rr(s.x - 22, s.y - 6, 44, 36, 6); ctx.stroke(); txt("KG", s.x, s.y + 16, 14, "#f8fafc");
      if (this.time < 7 && this.res.length === 0) txt("press SPACE (or click) to let go. The yellow arrow shows where it will land.", W / 2, H - 8, 11, "#fff");
    }
  });

  /* ============================================================ 5.5 API SLINGSHOT ============ */
  K.make("u5l5", {
    AX: 110, AY: 250, G: 600, GROUND: H - 28,
    build: function () {
      var P = [[520, 90], [690, 150], [520, 230], [690, 300]].slice(0, this.n), o = shuffled(this.n); this.tg = []; for (var i = 0; i < this.n; i++) this.tg.push({ i: i, x: P[o[i]][0], y: P[o[i]][1], w: 148, h: 54 });
      this.bird = null; this.drag = null; this.pv = { x: 0, y: 0 }; this.acc = 0; this.cool = 0; this.ang = 0.7; this.pw = 450;
    },
    hitT: function (x, y) { for (var j = 0; j < this.tg.length; j++) { var t = this.tg[j]; if (Math.abs(x - t.x) < t.w / 2 + 10 && Math.abs(y - t.y) < t.h / 2 + 10) return j; } return -1; },
    sim: function (vx, vy) { var x = this.AX, y = this.AY, dt = 1 / 120, k; for (k = 0; k < 1200; k++) { vy += this.G * dt; x += vx * dt; y += vy * dt; var h = this.hitT(x, y); if (h >= 0) return h; if (y > this.GROUND || x > W + 20) return -1; } return -1; },
    launch: function (vx, vy) { if (this.bird || this.cool > 0) return; this.bird = { x: this.AX, y: this.AY, vx: vx, vy: vy }; this.acc = 0; sound("zap"); },
    pullTo: function (x, y) { var dx = this.AX - x, dy = this.AY - y, l = Math.hypot(dx, dy) || 1, m = Math.min(l, 100); this.pv = { x: dx / l * m, y: dy / l * m }; },
    down: function (x, y) { if (this.bird || this.cool > 0) return; this.drag = true; this.pullTo(x, y); },
    move: function (x, y) { if (this.drag) this.pullTo(x, y); },
    up: function () { if (this.drag) { this.drag = null; if (Math.hypot(this.pv.x, this.pv.y) > 14) this.launch(this.pv.x * 7.5, this.pv.y * 7.5); this.pv = { x: 0, y: 0 }; } },
    key: function (e) { if (e.code === "Space") this.launch(Math.cos(this.ang) * this.pw, -Math.sin(this.ang) * this.pw); },
    step: function (dt) {
      this.cool -= dt;
      if (this.bot !== null && !this.bird && this.cool <= 0) { var a, sp, found = null; outer: for (sp = 220; sp <= 750; sp += 10) for (a = 0.1; a <= 1.35; a += 0.02) { var vx = Math.cos(a) * sp, vy = -Math.sin(a) * sp; if (this.sim(vx, vy) === this.bot) { found = [vx, vy]; break outer; } } if (found) { this.pv = { x: found[0] / 7.5, y: found[1] / 7.5 }; this.launch(found[0], found[1]); this.pv = { x: 0, y: 0 }; } }
      else if (this.bot === null && !this.bird) { if (K.keys.ArrowUp) this.ang = clamp(this.ang + dt, 0.1, 1.4); if (K.keys.ArrowDown) this.ang = clamp(this.ang - dt, 0.1, 1.4); if (K.keys.ArrowRight) this.pw = clamp(this.pw + 200 * dt, 150, 750); if (K.keys.ArrowLeft) this.pw = clamp(this.pw - 200 * dt, 150, 750); }
      var b = this.bird; if (!b) return; this.acc += dt;
      while (this.acc >= 1 / 120) {
        this.acc -= 1 / 120; b.vy += this.G / 120; b.x += b.vx / 120; b.y += b.vy / 120; var h = this.hitT(b.x, b.y);
        if (h >= 0) { this.focus = [b.x, b.y]; this.bird = null; K.commit(this, h); return; }
        if (b.y > this.GROUND || b.x > W + 30) { this.bird = null; this.cool = 0.5; sound("bad"); return; }
      }
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#38bdf8"); g.addColorStop(1, "#e0f2fe"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#65a30d"; ctx.fillRect(0, this.GROUND, W, H - this.GROUND); ctx.fillStyle = "#4d7c0f"; ctx.fillRect(0, this.GROUND, W, 5);
      this.tg.forEach(function (T) { ctx.fillStyle = "#b45309"; rr(T.x - T.w / 2, T.y - T.h / 2, T.w, T.h, 8); ctx.fill(); ctx.strokeStyle = "#451a03"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "rgba(15,23,42,.85)"; rr(T.x - T.w / 2 + 6, T.y - T.h / 2 + 6, T.w - 12, T.h - 12, 6); ctx.fill(); badge(T.i, T.x - T.w / 2 + 22, T.y, 9); label(this.opts[T.i], T.x + 10, T.y, T.w - 54, T.h - 12, "#f8fafc", 12); }, this);
      var b = this.bird, bx = this.AX - this.pv.x, by = this.AY - this.pv.y; ctx.strokeStyle = "#78350f"; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(this.AX, this.GROUND); ctx.lineTo(this.AX, this.AY + 22); ctx.moveTo(this.AX, this.AY + 22); ctx.lineTo(this.AX - 14, this.AY - 14); ctx.moveTo(this.AX, this.AY + 22); ctx.lineTo(this.AX + 14, this.AY - 14); ctx.stroke();
      if (!b) { ctx.strokeStyle = "#451a03"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(this.AX - 14, this.AY - 12); ctx.lineTo(bx, by); ctx.lineTo(this.AX + 14, this.AY - 12); ctx.stroke(); var vx = this.pv.x * 7.5, vy = this.pv.y * 7.5; if (this.drag || (this.bot === null && (K.keys.ArrowUp || K.keys.ArrowDown || K.keys.ArrowLeft || K.keys.ArrowRight))) { if (!this.drag) { vx = Math.cos(this.ang) * this.pw; vy = -Math.sin(this.ang) * this.pw; } var px = this.AX, py = this.AY; ctx.fillStyle = "rgba(255,255,255,.8)"; for (i = 0; i < 16; i++) { vy += this.G / 14; px += vx / 14; py += vy / 14; ctx.beginPath(); ctx.arc(px, py, 3, 0, TAU); ctx.fill(); } } }
      var bxp = b ? b.x : bx, byp = b ? b.y : by; ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(bxp, byp, 13, 0, TAU); ctx.fill(); ctx.strokeStyle = "#7f1d1d"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(bxp + 5, byp - 3, 4, 0, TAU); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(bxp + 6, byp - 3, 1.8, 0, TAU); ctx.fill(); ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.moveTo(bxp + 10, byp); ctx.lineTo(bxp + 18, byp + 3); ctx.lineTo(bxp + 10, byp + 6); ctx.fill();
      if (this.time < 7 && this.res.length === 0) txt("drag back from the slingshot and let go. (Keys: arrows aim, SPACE fires.)", W / 2, H - 10, 12, "#0c4a6e");
    }
  });

  /* ============================================================ 5.6 HIGH STRIKER (hold and release) ============ */
  K.make("u5l6", {
    TX: 150, TW: 70, TOP: 20, BOT: H - 28,
    build: function () { this.order = shuffled(this.n); this.charging = false; this.p = 0; this.dirn = 1; this.puck = null; this.cool = 0; this.bh = (this.BOT - this.TOP) / this.n; },
    startC: function () { if (this.puck || this.cool > 0) return; this.charging = true; this.p = 0; this.dirn = 1; },
    release: function () { if (!this.charging) return; this.charging = false; var s = Math.min(this.n - 1, Math.floor(this.p * this.n)); this.puck = { p: 0, to: this.p, slot: s }; sound("zap"); },
    key: function (e) { if (e.code === "Space") this.startC(); },
    down: function () { this.startC(); },
    up: function () { this.release(); },
    step: function (dt) {
      this.cool -= dt;
      if (this.bot !== null && !this.puck && this.cool <= 0) { if (!this.charging) this.startC(); else { var slot = this.order.indexOf(this.bot), c = (slot + 0.5) / this.n; if (Math.abs(this.p - c) < 0.5 / this.n * 0.5) this.release(); } }
      if (this.charging) { this.p += this.dirn * 1.1 * dt; if (this.p >= 1) { this.p = 1; this.dirn = -1; } if (this.p <= 0) { this.p = 0; this.dirn = 1; } if (this.bot === null && !K.keys.Space && !K.mouse.down) this.release(); }
      var u = this.puck; if (u) { u.p += dt * 2.2; if (u.p >= u.to) { var s = u.slot; this.puck = null; this.cool = 0.5; this.focus = [this.TX + this.TW / 2, this.BOT - (s + 0.5) * this.bh]; K.commit(this, this.order[s]); } }
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#581c87"); g.addColorStop(1, "#be185d"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(0, H - 28, W, 28);
      for (i = 0; i < this.n; i++) {
        var yTop = this.BOT - (i + 1) * this.bh, a = this.order[i], lit = this.puck ? (this.puck.p * 1 >= (i + 0.5) / this.n * 0 + 0 && this.puck.to >= i / this.n) : false;
        ctx.fillStyle = "#1e293b"; ctx.fillRect(this.TX, yTop, this.TW, this.bh); ctx.strokeStyle = OC[a]; ctx.lineWidth = 4; ctx.strokeRect(this.TX + 2, yTop + 2, this.TW - 4, this.bh - 4);
        ctx.fillStyle = "rgba(15,23,42,.85)"; rr(this.TX + this.TW + 20, yTop + 4, 460, this.bh - 8, 10); ctx.fill(); ctx.strokeStyle = OC[a]; ctx.lineWidth = 3; ctx.stroke(); badge(a, this.TX + this.TW + 44, yTop + this.bh / 2, 12); label(this.opts[a], this.TX + this.TW + 60 + 215, yTop + this.bh / 2, 410, this.bh - 14, "#f8fafc", 15);
      }
      var pf = this.puck ? Math.min(this.puck.p, this.puck.to) : (this.charging ? 0 : 0), py = this.BOT - pf * (this.BOT - this.TOP); ctx.fillStyle = "#f8fafc"; ctx.fillRect(this.TX + this.TW / 2 - 4, this.TOP, 8, this.BOT - this.TOP); ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(this.TX + this.TW / 2, py, 14, 0, TAU); ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#0f172a"; ctx.fillRect(40, this.TOP, 36, this.BOT - this.TOP); ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3; ctx.strokeRect(40, this.TOP, 36, this.BOT - this.TOP); var pw = this.charging ? this.p : 0; ctx.fillStyle = pw > 0.66 ? "#ef4444" : pw > 0.33 ? "#f59e0b" : "#22c55e"; ctx.fillRect(43, this.BOT - 3 - pw * (this.BOT - this.TOP - 6), 30, pw * (this.BOT - this.TOP - 6)); txt("POWER", 58, this.TOP - 8 + 0, 9, "#fef9c3");
      if (this.time < 8 && this.res.length === 0 && !this.charging) txt("HOLD SPACE (or the mouse button) to charge, let go to launch", W / 2 + 70, H - 10, 11, "#fce7f3");
    }
  });

  /* ============================================================ 6.1 RULES PLINKO ============ */
  K.make("u6l1", {
    X0: 100, X1: 700, BY: H - 78, G: 700,
    build: function () {
      this.pegs = []; var r, c; for (r = 0; r < 6; r++) for (c = 0; c < 11; c++) { var x = this.X0 + 30 + c * 54 + (r % 2 ? 27 : 0); if (x > this.X1 - 14) continue; this.pegs.push({ x: x, y: 70 + r * 36 }); }
      this.ball = { x: W / 2, y: 28, vx: 0, vy: 0, on: false }; this.bw = (this.X1 - this.X0) / this.n; this.still = 0; this.sx = null;
    },
    dropIt: function () { var b = this.ball; if (b.on) return; b.on = true; b.vx = (Math.random() - 0.5) * 16; sound("tick"); },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowDown") this.dropIt(); },
    down: function (x) { if (!this.ball.on) { this.ball.x = clamp(x, this.X0 + 12, this.X1 - 12); this.dropIt(); } },
    move: function (x) { if (!this.ball.on) this.sx = x; },
    step: function (dt) {
      var b = this.ball, k, j;
      if (!b.on) { if (this.bot !== null) { b.x += clamp((this.X0 + (this.bot + 0.5) * this.bw) - b.x, -300 * dt, 300 * dt); if (Math.abs(b.x - (this.X0 + (this.bot + 0.5) * this.bw)) < 3) this.dropIt(); } else { if (this.sx !== null) b.x += clamp(this.sx - b.x, -400 * dt, 400 * dt); if (K.keys.ArrowLeft) { b.x -= 280 * dt; this.sx = null; } if (K.keys.ArrowRight) { b.x += 280 * dt; this.sx = null; } } b.x = clamp(b.x, this.X0 + 12, this.X1 - 12); return; }
      var ax = 0; if (this.bot !== null) { var tx = this.X0 + (this.bot + 0.5) * this.bw; ax = clamp((tx - b.x) * 14 - b.vx * 5, -420, 420); } else { if (K.keys.ArrowLeft) ax = -420; if (K.keys.ArrowRight) ax = 420; }
      for (k = 0; k < 3; k++) {
        var d = dt / 3; b.vx += ax * d; b.vy += this.G * d; b.x += b.vx * d; b.y += b.vy * d;
        if (b.x < this.X0 + 9) { b.x = this.X0 + 9; b.vx = Math.abs(b.vx) * 0.5; } if (b.x > this.X1 - 9) { b.x = this.X1 - 9; b.vx = -Math.abs(b.vx) * 0.5; }
        for (j = 0; j < this.pegs.length; j++) { var p = this.pegs[j], dx = b.x - p.x, dy = b.y - p.y, dist = Math.hypot(dx, dy), mind = 16; if (dist < mind) { if (dist < 0.001) { dx = 0.01; dy = -1; dist = 1; } var nx = dx / dist, ny = dy / dist, vn = b.vx * nx + b.vy * ny; b.x = p.x + nx * mind; b.y = p.y + ny * mind; if (vn < 0) { b.vx -= 1.55 * vn * nx; b.vy -= 1.55 * vn * ny; b.vx += (Math.random() - 0.5) * 30; } } }
      }
      if (b.vy < 8 && b.y > 50) { this.still += dt; if (this.still > 0.8) { b.vy = 60; b.vx += (Math.random() - 0.5) * 80; this.still = 0; } } else this.still = 0;
      if (b.y >= this.BY) { this.focus = [b.x, this.BY]; K.commit(this, Math.min(this.n - 1, Math.floor((b.x - this.X0) / this.bw))); b.y = this.BY; b.vy = 0; b.vx = 0; }
    },
    draw: function (t) {
      var ctx = K.ctx, i, b = this.ball; ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#1e1b4b"; ctx.fillRect(this.X0, 0, this.X1 - this.X0, H); ctx.fillStyle = "#312e81"; ctx.fillRect(this.X0 - 8, 0, 8, H); ctx.fillRect(this.X1, 0, 8, H);
      this.pegs.forEach(function (p) { ctx.fillStyle = "#e2e8f0"; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, TAU); ctx.fill(); ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 2; ctx.stroke(); });
      for (i = 0; i < this.n; i++) { var x0 = this.X0 + i * this.bw; ctx.fillStyle = "rgba(15,23,42,.9)"; ctx.fillRect(x0 + 2, this.BY, this.bw - 4, H - this.BY); ctx.strokeStyle = OC[i]; ctx.lineWidth = 4; ctx.strokeRect(x0 + 2, this.BY, this.bw - 4, H - this.BY - 2); badge(i, x0 + 20, this.BY + 20, 10); label(this.opts[i], x0 + 28 + (this.bw - 38) / 2, this.BY + 38, this.bw - 16, 50, "#f8fafc", 12); }
      ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(b.x, b.y, 8, 0, TAU); ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.stroke();
      if (!b.on) { ctx.strokeStyle = "rgba(253,224,71,.5)"; ctx.setLineDash([5, 7]); ctx.beginPath(); ctx.moveTo(b.x, b.y + 12); ctx.lineTo(b.x, 60); ctx.stroke(); ctx.setLineDash([]); }
      if (this.time < 8 && this.res.length === 0) { ["click or SPACE", "drops the ball", "LEFT/RIGHT", "nudge it", "on the way down"].forEach(function (l, k) { txt(l, 50, 40 + k * 16, 10, "#c7d2fe"); }); }
    }
  });

  /* ============================================================ 6.2 WIND LAYERS (hot air balloon) ============ */
  K.make("u6l2", {
    LAY: [[30, 125, -90], [125, 215, 90], [215, 400, 0]], GY: H - 70,
    build: function () { this.b = { x: 150 + Math.random() * 500, y: 260, vy: 0 }; this.cl = []; for (var i = 0; i < 9; i++) this.cl.push([Math.random() * W, 40 + Math.random() * 250, 0.5 + Math.random()]); this.burn = 0; this.desc = false; },
    windAt: function (y) { for (var i = 0; i < this.LAY.length; i++) if (y >= this.LAY[i][0] && y < this.LAY[i][1]) return this.LAY[i][2]; return 0; },
    key: function () {},
    step: function (dt) {
      var b = this.b, self = this, up = false;
      if (this.bot !== null) {
        var tx = (this.bot + 0.5) * W / this.n, pw = W / this.n, x = b.x, y = b.y, k; for (k = 0; k < 600 && y < this.GY; k++) { x += this.windAt(y) * 0.02; y += 70 * 0.02; }
        if (Math.abs(x - tx) < pw / 2 - (this.desc ? 6 : 28)) { up = false; this.desc = true; } else { this.desc = false; up = b.y > (x < tx ? 170 : 78); }
      } else up = !!(K.keys.ArrowUp || K.keys.Space || K.mouse.down);
      b.y += (up ? -90 : 70) * dt; b.y = clamp(b.y, 40, this.GY + 4); b.x += this.windAt(b.y) * dt; b.x = clamp(b.x, 22, W - 22); this.up = up;
      if (b.y >= this.GY) { this.focus = [b.x, this.GY]; K.commit(this, Math.min(this.n - 1, Math.floor(b.x / (W / this.n)))); b.y = this.GY; }
    },
    draw: function (t, dt) {
      var ctx = K.ctx, i, b = this.b, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#60a5fa"); g.addColorStop(1, "#fde68a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      var self = this; this.LAY.slice(0, 2).forEach(function (L) { ctx.fillStyle = L[2] > 0 ? "rgba(34,197,94,.14)" : "rgba(244,114,182,.16)"; ctx.fillRect(0, L[0], W, L[1] - L[0]); var arrows = L[2] > 0 ? "→  →  →  →  →  →  →  →" : "←  ←  ←  ←  ←  ←  ←  ←"; txt(arrows, W / 2, (L[0] + L[1]) / 2, 14, "rgba(255,255,255,.55)"); txt(L[2] > 0 ? "WIND RIGHT" : "WIND LEFT", W - 70, L[0] + 12, 10, "rgba(15,23,42,.6)"); });
      txt("CALM", W - 40, 232, 10, "rgba(15,23,42,.6)");
      this.cl.forEach(function (c) { c[0] += self.windAt(c[1]) * dt * c[2] * 0.4; if (c[0] > W + 50) c[0] = -50; if (c[0] < -50) c[0] = W + 50; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(c[0], c[1], 16 * c[2], 0, TAU); ctx.arc(c[0] + 20 * c[2], c[1] + 4, 12 * c[2], 0, TAU); ctx.arc(c[0] - 20 * c[2], c[1] + 4, 12 * c[2], 0, TAU); ctx.fill(); });
      var pw = W / this.n; for (i = 0; i < this.n; i++) { ctx.fillStyle = OC[i]; ctx.fillRect(i * pw, this.GY + 10, pw, H - this.GY - 10); ctx.fillStyle = "rgba(15,23,42,.88)"; ctx.fillRect(i * pw + 4, this.GY + 16, pw - 8, H - this.GY - 20); badge(i, i * pw + 22, this.GY + 40, 10); label(this.opts[i], i * pw + 30 + (pw - 40) / 2, this.GY + 40, pw - 50, 48, "#f8fafc", 12); }
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(this.windAt(b.y) / 900); ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.ellipse(0, -34, 28, 34, 0, 0, TAU); ctx.fill(); ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.ellipse(0, -34, 10, 34, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = "#78350f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-18, -8); ctx.lineTo(-9, 10); ctx.moveTo(18, -8); ctx.lineTo(9, 10); ctx.stroke(); ctx.fillStyle = "#92400e"; ctx.fillRect(-11, 10, 22, 14); if (this.up) { ctx.fillStyle = "#fb923c"; ctx.beginPath(); ctx.moveTo(-5, -2); ctx.lineTo(0, -16 - Math.random() * 6); ctx.lineTo(5, -2); ctx.fill(); } ctx.restore();
      if (this.time < 8 && this.res.length === 0) txt("HOLD SPACE (or the mouse button) to climb, let go to sink. Ride the winds to the right landing.", W / 2, 14, 11, "#1e3a8a");
    }
  });

  /* ============================================================ 6.3 COLOR INVADERS ============ */
  K.make("u6l3", {
    build: function () { var n = this.n; this.aw = Math.min(150, (W - 120) / n - 12); this.ship = { x: W / 2, cd: 0, stun: 0 }; this.bul = []; this.eb = []; this.al = []; for (var i = 0; i < n; i++) this.al.push({ i: i, bx: 60 + (i + 0.5) * (W - 120) / n, dead: false }); this.fx = 0; this.fy = 0; this.ebT = 1.2; this.stars = []; for (var s = 0; s < 50; s++) this.stars.push([Math.random() * W, Math.random() * H, Math.random() * 2 + 0.5]); },
    fire: function () { var s = this.ship; if (s.cd <= 0 && s.stun <= 0) { this.bul.push({ x: s.x, y: H - 54 }); s.cd = 0.3; sound("zap"); } },
    key: function (e) { if (e.code === "Space") this.fire(); },
    down: function (x) { this.mx = x; this.fire(); },
    move: function (x) { this.mx = x; },
    form: function () { var t = this.time; this.fx = Math.sin(t * 0.9) * (W - 120 - this.aw * this.n) / 2 + 0; this.fy = 70 + (Math.sin(t * 0.35) * 0.5 + 0.5) * 70; },
    step: function (dt) {
      var s = this.ship, i, j; s.cd -= dt; s.stun = Math.max(0, s.stun - dt); this.form();
      var self = this; this.al.forEach(function (a) { a.x = a.bx + self.fx; a.y = self.fy; });
      if (this.bot !== null) { var tx = this.al[this.bot].x; if (s.stun <= 0) { if (Math.abs(s.x - tx) < 8) this.fire(); else s.x += Math.sign(tx - s.x) * 320 * dt; } }
      else if (s.stun <= 0) { if (K.keys.ArrowLeft) { s.x -= 320 * dt; this.mx = null; } if (K.keys.ArrowRight) { s.x += 320 * dt; this.mx = null; } if (this.mx !== null && this.mx !== undefined) s.x += clamp(this.mx - s.x, -320 * dt, 320 * dt); }
      s.x = clamp(s.x, 30, W - 30);
      this.ebT -= dt; if (this.ebT <= 0) { this.ebT = 1.1 + Math.random() * 0.9; var a = this.al[Math.floor(Math.random() * this.n)]; this.eb.push({ x: a.x + (Math.random() - 0.5) * 40, y: a.y + 30 }); }
      for (i = this.eb.length - 1; i >= 0; i--) { var e = this.eb[i]; e.y += 190 * dt; if (e.y > H) { this.eb.splice(i, 1); continue; } if (Math.abs(e.x - s.x) < 22 && e.y > H - 56 && e.y < H - 14 && s.stun <= 0) { s.stun = 0.9; spawn(this.parts, s.x, H - 40, 14, { colors: ["#f87171", "#fde047"], speed: 160 }); sound("bad"); this.eb.splice(i, 1); } }
      for (i = this.bul.length - 1; i >= 0; i--) { var b = this.bul[i]; b.y -= 540 * dt; if (b.y < -10) { this.bul.splice(i, 1); continue; } for (j = 0; j < this.n; j++) { var al = this.al[j]; if (al.dead) continue; if (Math.abs(b.x - al.x) < this.aw / 2 && Math.abs(b.y - al.y) < 30) { this.bul.splice(i, 1); this.focus = [al.x, al.y]; spawn(this.parts, al.x, al.y, 24, { colors: ["#a3e635", "#fff", "#fde047"], speed: 260 }); al.dead = true; K.commit(this, j); break; } } }
    },
    draw: function (t) {
      var ctx = K.ctx, i, s = this.ship; ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H); this.stars.forEach(function (q) { ctx.fillStyle = "rgba(255,255,255," + (0.3 + 0.5 * Math.sin(t * 2 + q[0])) + ")"; ctx.fillRect(q[0], (q[1] + t * 10 * q[2]) % H, q[2], q[2]); });
      for (i = 0; i < this.n; i++) { var a = this.al[i]; if (a.dead || a.x === undefined) continue; var w = this.aw; ctx.fillStyle = OC[i]; rr(a.x - w / 2, a.y - 28, w, 56, 14); ctx.fill(); ctx.fillStyle = OC[i]; ctx.fillRect(a.x - w / 2 + 8, a.y + 24, 10, 10 + Math.sin(t * 8 + i) * 4); ctx.fillRect(a.x + w / 2 - 18, a.y + 24, 10, 10 + Math.cos(t * 8 + i) * 4); ctx.fillStyle = "#0f172a"; rr(a.x - w / 2 + 6, a.y - 20, w - 12, 40, 8); ctx.fill(); badge(i, a.x - w / 2 + 20, a.y, 9); label(this.opts[i], a.x + 8, a.y, w - 48, 38, "#f8fafc", 12); }
      this.eb.forEach(function (e) { ctx.fillStyle = "#f87171"; ctx.fillRect(e.x - 2, e.y - 8, 4, 16); ctx.fillStyle = "rgba(248,113,113,.4)"; ctx.fillRect(e.x - 4, e.y - 14, 8, 8); });
      this.bul.forEach(function (b) { ctx.fillStyle = "#fde047"; ctx.fillRect(b.x - 2, b.y - 10, 4, 14); });
      if (s.stun <= 0 || Math.floor(t * 14) % 2) { ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.moveTo(s.x, H - 70); ctx.lineTo(s.x + 22, H - 30); ctx.lineTo(s.x, H - 40); ctx.lineTo(s.x - 22, H - 30); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#e0f2fe"; ctx.lineWidth = 2; ctx.stroke(); }
      if (s.stun > 0) txt("HIT! back in " + s.stun.toFixed(1) + "s", s.x, H - 82, 11, "#fca5a5");
      if (this.time < 6 && this.res.length === 0) txt("LEFT/RIGHT (or the mouse) move, SPACE or click fires. Dodge the red shots!", W / 2, H - 8, 11, "#a5b4fc");
    }
  });
})();
