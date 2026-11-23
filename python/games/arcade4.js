/* THE UNIT 4 ARCADE GAMES (part 2): 4.7 to 4.11.
   Loop Racer (lane racing), Gold Digger (drill through the dirt), Bounce Shot (bubble shooter with wall bounces), While Fishing (hold to lower the hook), Skydive Break-Out (steer the parachute), Random Roulette (stop the wheel). */
(function () {
  "use strict";
  var K = window.ArcadeKit, W = K.W, H = K.H, TAU = K.TAU, OC = K.OC, LET = K.LET, clamp = K.clamp, rr = K.rr, txt = K.txt, sound = K.sound, label = K.label, badge = K.badge, legend = K.legend, spawn = K.spawn;
  function shuffled(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); a.sort(function () { return Math.random() - 0.5; }); return a; }

  /* ============================================================ 4.7 LOOP RACER ============ */
  K.make("u4l7", {
    D: 3300, SPEED: 300, ROADW: 660,
    build: function () { this.lane = Math.floor(this.n / 2); this.cx = this.laneX(this.lane); this.d = 0; this.slow = 0; this.traf = []; this.spawnT = 0.4; this.gate = null; this.cool = 0; this.scroll = 0; },
    laneX: function (l) { var lw = this.ROADW / this.n; return W / 2 - this.ROADW / 2 + (l + 0.5) * lw; },
    go: function (d) { this.lane = clamp(this.lane + d, 0, this.n - 1); sound("tick"); },
    key: function (e) { if (e.code === "ArrowLeft") this.go(-1); else if (e.code === "ArrowRight") this.go(1); },
    down: function (x) { var lw = this.ROADW / this.n, l = Math.floor((x - (W / 2 - this.ROADW / 2)) / lw); if (l >= 0 && l < this.n) this.lane = l; },
    step: function (dt) {
      var sp = this.slow > 0 ? 130 : this.SPEED, self = this, i; this.slow = Math.max(0, this.slow - dt); this.cool -= dt; this.d += sp * dt; this.scroll += sp * dt;
      if (this.bot !== null && this.cool <= 0) {
        var want = this.lane;
        if (this.d > this.D - 1500) want = this.bot; else { var near = this.traf.filter(function (c) { return c.lane === self.lane && c.y > H - 340 && c.y < H - 90; }).length; if (near) { var free = []; for (i = 0; i < this.n; i++) if (!this.traf.some(function (c) { return c.lane === i && c.y > H - 340 && c.y < H - 60; })) free.push(i); if (free.length) { free.sort(function (a, b) { return Math.abs(a - self.lane) - Math.abs(b - self.lane); }); want = free[0]; } } }
        if (want !== this.lane) { this.lane += Math.sign(want - this.lane); this.cool = 0.22; }
      }
      this.cx += (this.laneX(this.lane) - this.cx) * Math.min(1, dt * 14);
      this.spawnT -= dt; if (this.spawnT <= 0 && this.d < this.D - 650) { this.spawnT = 0.75 + Math.random() * 0.4; var l = Math.floor(Math.random() * this.n); this.traf.push({ lane: l, y: -60, col: ["#ef4444", "#3b82f6", "#f59e0b", "#a855f7", "#14b8a6"][Math.floor(Math.random() * 5)] }); }
      for (i = this.traf.length - 1; i >= 0; i--) { var c = this.traf[i]; c.y += (sp - 130) * dt; if (c.y > H + 80) { this.traf.splice(i, 1); continue; } if (c.lane === this.lane && Math.abs(c.y - (H - 80)) < 56) { this.slow = 1.2; this.shake = 0.3; spawn(this.parts, this.cx, H - 80, 14, { colors: ["#fde047", "#f97316", "#fff"], speed: 200 }); sound("bad"); this.traf.splice(i, 1); } }
      if (!this.gate && this.d >= this.D) this.gate = { y: -60 };
      if (this.gate) { this.gate.y += sp * dt; if (this.gate.y >= H - 80) { this.focus = [this.cx, H - 80]; K.commit(this, this.lane); this.gate.y = H + 200; } }
    },
    draw: function (t) {
      var ctx = K.ctx, i, lw = this.ROADW / this.n, x0 = W / 2 - this.ROADW / 2; ctx.fillStyle = "#166534"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#15803d"; for (i = 0; i < 14; i++) { var yy = ((i * 60 + this.scroll) % (H + 60)) - 30; ctx.fillRect(10, yy, 40, 12); ctx.fillRect(W - 50, yy + 20, 40, 12); }
      ctx.fillStyle = "#334155"; ctx.fillRect(x0, 0, this.ROADW, H); ctx.fillStyle = "#e2e8f0"; ctx.fillRect(x0 - 6, 0, 6, H); ctx.fillRect(x0 + this.ROADW, 0, 6, H);
      for (i = 1; i < this.n; i++) for (var k = 0; k < 9; k++) { var y = ((k * 50 + this.scroll) % (H + 50)) - 25; ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(x0 + i * lw - 2, y, 4, 26); }
      this.traf.forEach(function (c) { var x = x0 + (c.lane + 0.5) * lw; ctx.fillStyle = c.col; rr(x - 24, c.y - 34, 48, 68, 10); ctx.fill(); ctx.fillStyle = "rgba(186,230,253,.9)"; ctx.fillRect(x - 17, c.y - 14, 34, 18); ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineWidth = 2; rr(x - 24, c.y - 34, 48, 68, 10); ctx.stroke(); });
      if (this.gate) { var gy = this.gate.y; ctx.fillStyle = "#0f172a"; ctx.fillRect(x0 - 8, gy - 8, this.ROADW + 16, 16); for (i = 0; i < this.n; i++) { ctx.fillStyle = "rgba(15,23,42,.92)"; rr(x0 + i * lw + 6, gy - 66, lw - 12, 56, 8); ctx.fill(); ctx.strokeStyle = OC[i]; ctx.lineWidth = 3; ctx.stroke(); badge(i, x0 + i * lw + 24, gy - 38, 10); label(this.opts[i], x0 + i * lw + 32 + (lw - 50) / 2, gy - 38, lw - 58, 50, "#f8fafc", 13); } for (i = 0; i < 24; i++) { ctx.fillStyle = i % 2 ? "#fff" : "#111"; ctx.fillRect(x0 + i * this.ROADW / 24, gy + 8, this.ROADW / 24, 8); } }
      var sp = this.slow > 0; ctx.save(); ctx.translate(this.cx, H - 80); if (sp) ctx.rotate(Math.sin(t * 40) * 0.12); ctx.fillStyle = "#facc15"; rr(-24, -34, 48, 68, 10); ctx.fill(); ctx.fillStyle = "#1e293b"; ctx.fillRect(-17, -14, 34, 18); ctx.fillStyle = "#ef4444"; ctx.fillRect(-24, 22, 10, 8); ctx.fillRect(14, 22, 10, 8); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 3; rr(-24, -34, 48, 68, 10); ctx.stroke(); ctx.restore();
      var pr = clamp(this.d / this.D, 0, 1); ctx.fillStyle = "rgba(15,23,42,.7)"; ctx.fillRect(20, 20, 10, H - 60); ctx.fillStyle = "#38bdf8"; ctx.fillRect(20, 20 + (H - 60) * (1 - pr), 10, (H - 60) * pr);
      if (this.time < 5 && this.res.length === 0) txt("LEFT / RIGHT change lane. Cross the line in the right lane.", W / 2, 16, 12, "#fff");
    }
  });

  /* ============================================================ 4.8 GOLD DIGGER ============ */
  K.make("u4l8", {
    CELL: 20, COLS: 27, ROWS: 19,
    build: function () {
      var i, c, r, tries; this.dug = {}; this.px = 13; this.py = 1; this.dir = [0, 1]; this.tick = 0; this.chests = []; this.gems = [];
      for (i = 0; i < this.n; i++) { tries = 0; do { c = 2 + Math.floor(Math.random() * (this.COLS - 4)); r = 5 + Math.floor(Math.random() * (this.ROWS - 6)); tries++; } while (tries < 80 && this.chests.some(function (o) { return Math.abs(o.c - c) + Math.abs(o.r - r) < 6; })); this.chests.push({ c: c, r: r, i: i }); }
      for (i = 0; i < 26; i++) this.gems.push([Math.floor(Math.random() * this.COLS), 3 + Math.floor(Math.random() * 15)]);
      this.dug["13,1"] = 1;
    },
    isChest: function (c, r) { for (var i = 0; i < this.chests.length; i++) if (this.chests[i].c === c && this.chests[i].r === r) return this.chests[i]; return null; },
    move: function (d) { var c = this.px + d[0], r = this.py + d[1]; if (c < 0 || c >= this.COLS || r < 1 || r >= this.ROWS) return; this.px = c; this.py = r; this.dir = d; this.dug[c + "," + r] = 1; var ch = this.isChest(c, r); if (ch) { this.focus = [c * this.CELL + 10, r * this.CELL + 10]; spawn(this.parts, this.focus[0], this.focus[1], 14, { colors: ["#fde047", "#fff"], speed: 160 }); K.commit(this, ch.i); } },
    botDir: function () {
      var self = this, t = this.chests[this.bot], q = [[this.px, this.py]], from = {}, k = this.px + "," + this.py; from[k] = null; var D = [[1, 0], [-1, 0], [0, 1], [0, -1]], end = null;
      while (q.length) { var cur = q.shift(); if (cur[0] === t.c && cur[1] === t.r) { end = cur; break; } D.forEach(function (d) { var c = cur[0] + d[0], r = cur[1] + d[1], kk = c + "," + r; if (c < 0 || c >= self.COLS || r < 1 || r >= self.ROWS || kk in from) return; var ch = self.isChest(c, r); if (ch && ch.i !== self.bot) return; from[kk] = cur; q.push([c, r]); }); }
      if (!end) return null; var node = end; while (from[node[0] + "," + node[1]] && (from[node[0] + "," + node[1]][0] !== this.px || from[node[0] + "," + node[1]][1] !== this.py)) node = from[node[0] + "," + node[1]]; return [node[0] - this.px, node[1] - this.py];
    },
    step: function (dt) {
      this.tick += dt; if (this.tick < 0.085) return; this.tick = 0; var d = null;
      if (this.bot !== null) d = this.botDir(); else { if (K.keys.ArrowLeft) d = [-1, 0]; else if (K.keys.ArrowRight) d = [1, 0]; else if (K.keys.ArrowDown) d = [0, 1]; else if (K.keys.ArrowUp) d = [0, -1]; }
      if (d) { this.move(d); if (this.dug[this.px + "," + this.py] && this.time % 0.2 < 0.1) sound("tick"); }
    },
    draw: function (t) {
      var ctx = K.ctx, C = this.CELL, c, r, i, self = this; ctx.fillStyle = "#7dd3fc"; ctx.fillRect(0, 0, 540, C); ctx.fillStyle = "#65a30d"; ctx.fillRect(0, C, 540, C / 2);
      for (c = 0; c < this.COLS; c++) for (r = 1; r < this.ROWS; r++) { var d = this.dug[c + "," + r]; ctx.fillStyle = d ? "#1c1917" : (r < 6 ? ((c + r) % 2 ? "#a16207" : "#92400e") : r < 12 ? ((c + r) % 2 ? "#78350f" : "#6b3410") : ((c + r) % 2 ? "#57280d" : "#4a2208")); ctx.fillRect(c * C, r * C + (r === 1 ? 10 : 0), C, C - (r === 1 ? 10 : 0)); }
      this.gems.forEach(function (g) { if (self.dug[g[0] + "," + g[1]]) return; ctx.fillStyle = "rgba(125,211,252,.7)"; ctx.fillRect(g[0] * C + 7, g[1] * C + 7, 5, 5); });
      for (i = 0; i < this.chests.length; i++) { var ch = this.chests[i]; ctx.fillStyle = "#b45309"; rr(ch.c * C + 1, ch.r * C + 3, C - 2, C - 6, 3); ctx.fill(); ctx.fillStyle = "#fde047"; ctx.fillRect(ch.c * C + 8, ch.r * C + 8, 4, 5); ctx.strokeStyle = OC[ch.i]; ctx.lineWidth = 2; rr(ch.c * C + 1, ch.r * C + 3, C - 2, C - 6, 3); ctx.stroke(); txt(LET[ch.i], ch.c * C + 10, ch.r * C - 5, 12, OC[ch.i]); }
      var x = this.px * C + 10, y = this.py * C + 10; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(this.dir[1], this.dir[0])); ctx.fillStyle = "#f97316"; rr(-9, -8, 15, 16, 4); ctx.fill(); ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(6, -7); ctx.lineTo(15, 0); ctx.lineTo(6, 7); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#e0f2fe"; ctx.fillRect(-4, -4, 6, 6); ctx.restore();
      legend(this.opts, 546, 8, 248);
    }
  });

  /* ============================================================ 4.9 BOUNCE SHOT (bubble shooter) ============ */
  K.make("u4l9", {
    SPEED: 560,
    build: function () {
      var n = this.n; this.bx = W / 2; this.by = H - 26; this.aim = -Math.PI / 2; this.ball = null; this.cool = 0; this.tg = []; this.r = Math.min(54, (W - 60) / n / 2 - 6);
      for (var i = 0; i < n; i++) this.tg.push({ x: 30 + (i + 0.5) * (W - 60) / n, y: 78, i: i });
      var att = 0, ok = false; while (!ok && att++ < 25) {   /* stones go in random places, but every answer must stay reachable (with margin) */
        this.stones = []; var st = 2 + Math.floor(Math.random() * 2), tries = 0; while (this.stones.length < st && tries++ < 60) { var s = { x: 80 + Math.random() * (W - 160), y: 170 + Math.random() * 60, r: 22 }; if (!this.stones.some(function (o) { return Math.hypot(o.x - s.x, o.y - s.y) < 90; })) this.stones.push(s); }
        ok = true; for (var ti = 0; ti < n && ok; ti++) { var f = false; for (var a = -Math.PI + 0.12; a <= -0.12 && !f; a += 0.012) if (this.trace(a, false, 16).hit === ti) f = true; if (!f) ok = false; }
      }
    },
    trace: function (a, rec, pad) {
      pad = pad || 0;
      var x = this.bx, y = this.by - 14, vx = Math.cos(a), vy = Math.sin(a), pts = [[x, y]], i, j, hit = -1, step = 4, bounces = 0;
      for (i = 0; i < 700; i++) {
        x += vx * step; y += vy * step; if (x < 14) { x = 14; vx = -vx; bounces++; if (rec) pts.push([x, y]); } if (x > W - 14) { x = W - 14; vx = -vx; bounces++; if (rec) pts.push([x, y]); } if (y < 0) break;
        for (j = 0; j < this.tg.length; j++) if (Math.hypot(x - this.tg[j].x, y - this.tg[j].y) < this.r + 11) { hit = j; break; }
        if (hit >= 0) break; var dead = false; for (j = 0; j < this.stones.length; j++) if (Math.hypot(x - this.stones[j].x, y - this.stones[j].y) < this.stones[j].r + 11 + pad) dead = true; if (dead) break;
      }
      if (rec) pts.push([x, y]); return { hit: hit, pts: pts, bounces: bounces };
    },
    fire: function () { if (this.ball || this.cool > 0) return; this.ball = { x: this.bx, y: this.by - 14, vx: Math.cos(this.aim) * this.SPEED, vy: Math.sin(this.aim) * this.SPEED }; sound("zap"); },
    key: function (e) { if (e.code === "Space" || e.code === "ArrowUp") this.fire(); },
    down: function (x, y) { this.aimAt(x, y); this.fire(); },
    aimAt: function (x, y) { this.aim = clamp(Math.atan2(y - (this.by - 14), x - this.bx), -Math.PI + 0.12, -0.12); },
    move: function (x, y) { this.aimAt(x, y); },
    step: function (dt) {
      this.cool -= dt;
      if (this.bot !== null && !this.ball && this.cool <= 0) { var a, best = null, bd = 9; for (a = -Math.PI + 0.12; a <= -0.12; a += 0.006) { var tr = this.trace(a, false, 16); if (tr.hit === this.bot) { var dd = Math.abs(a + Math.PI / 2) - 0 + tr.bounces * 0.2; if (dd < bd) { bd = dd; best = a; } } } if (best !== null) { this.aim = best; this.fire(); } }
      else if (this.bot === null) { if (K.keys.ArrowLeft) this.aim = clamp(this.aim - 1.6 * dt, -Math.PI + 0.12, -0.12); if (K.keys.ArrowRight) this.aim = clamp(this.aim + 1.6 * dt, -Math.PI + 0.12, -0.12); }
      var b = this.ball; if (!b) return; var steps = 3, k, j;
      for (k = 0; k < steps; k++) {
        b.x += b.vx * dt / steps; b.y += b.vy * dt / steps; if (b.x < 14) { b.x = 14; b.vx = -b.vx; sound("tick"); } if (b.x > W - 14) { b.x = W - 14; b.vx = -b.vx; sound("tick"); }
        if (b.y < -20) { this.ball = null; this.cool = 0.3; return; }
        for (j = 0; j < this.stones.length; j++) if (Math.hypot(b.x - this.stones[j].x, b.y - this.stones[j].y) < this.stones[j].r + 11) { spawn(this.parts, b.x, b.y, 10, { colors: ["#94a3b8", "#fff"], speed: 150 }); this.ball = null; this.cool = 0.3; sound("bad"); return; }
        for (j = 0; j < this.tg.length; j++) if (Math.hypot(b.x - this.tg[j].x, b.y - this.tg[j].y) < this.r + 11) { this.focus = [this.tg[j].x, this.tg[j].y]; this.ball = null; K.commit(this, j); return; }
      }
    },
    draw: function (t) {
      var ctx = K.ctx, i, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1e1b4b"); g.addColorStop(1, "#4c1d95"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(0, 0, 10, H); ctx.fillRect(W - 10, 0, 10, H);
      this.stones.forEach(function (s) { ctx.fillStyle = "#64748b"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill(); ctx.strokeStyle = "#334155"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.2)"; ctx.beginPath(); ctx.arc(s.x - 7, s.y - 7, 6, 0, TAU); ctx.fill(); });
      for (i = 0; i < this.n; i++) { var T = this.tg[i]; ctx.fillStyle = OC[i]; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(T.x, T.y, this.r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = "rgba(15,23,42,.82)"; rr(T.x - this.r + 6, T.y - 24, this.r * 2 - 12, 48, 10); ctx.fill(); badge(i, T.x - this.r + 20, T.y - 12, 8); label(this.opts[i], T.x + 4, T.y + 4, this.r * 2 - 22, 40, "#f8fafc", 12); }
      if (!this.ball) { var tr = this.trace(this.aim, true); ctx.strokeStyle = "rgba(253,224,71,.65)"; ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.beginPath(); tr.pts.forEach(function (p, k) { k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.setLineDash([]); }
      var b = this.ball; if (b) { ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(b.x, b.y, 11, 0, TAU); ctx.fill(); ctx.strokeStyle = "#a16207"; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.save(); ctx.translate(this.bx, this.by); ctx.rotate(this.aim + Math.PI / 2); ctx.fillStyle = "#e2e8f0"; rr(-9, -34, 18, 42, 6); ctx.fill(); ctx.restore(); ctx.fillStyle = "#475569"; ctx.beginPath(); ctx.arc(this.bx, this.by, 20, Math.PI, 0); ctx.fill(); ctx.fillRect(this.bx - 20, this.by, 40, 14);
      if (this.time < 6 && this.res.length === 0) txt("aim with the mouse (or LEFT/RIGHT), click or SPACE to shoot. Shots bounce off the walls.", W / 2, H - 10, 11, "#c4b5fd");
    }
  });

  /* ============================================================ 4.10 WHILE FISHING ============ */
  K.make("u4l10", {
    build: function () {
      var n = this.n, o = shuffled(n); this.fish = []; for (var i = 0; i < n; i++) { var dir = Math.random() < 0.5 ? 1 : -1; this.fish.push({ i: i, y: 130 + o[i] * 52, x: 80 + Math.random() * (W - 160), v: dir * (30 + Math.random() * 28), got: false }); }
      this.boat = { x: W / 2 }; this.hy = 78; this.caught = -1; this.down = false; this.mx = null;
    },
    key: function () {},
    move: function (x) { this.mx = x; },
    step: function (dt) {
      var self = this, b = this.boat, hook = this.hy;
      this.fish.forEach(function (f) { if (f.got) return; f.x += f.v * dt; if (f.x > W + 80) f.x = -80; if (f.x < -80) f.x = W + 80; });
      var hold = false;
      if (this.bot !== null) {
        var f = this.fish[this.bot], tx = f.x + f.v * 0.25; b.x += clamp(tx - b.x, -300 * dt, 300 * dt);
        if (this.caught < 0) { var td = (f.y - 78) / 230 + 0.25, clear = !this.fish.some(function (o) { if (o.i === self.bot || o.y >= f.y - 10) return false; for (var tt = 0; tt <= td; tt += 0.1) if (Math.abs(o.x + o.v * tt - (f.x + f.v * tt)) < 84) return true; return false; }); if (this.hy > 90 || (Math.abs(b.x - f.x) < 12 && clear)) hold = true; }
      } else {
        if (K.keys.ArrowLeft) { b.x -= 280 * dt; this.mx = null; } if (K.keys.ArrowRight) { b.x += 280 * dt; this.mx = null; } if (this.mx !== null) b.x += clamp(this.mx - b.x, -320 * dt, 320 * dt);
        hold = !!(K.keys.Space || K.keys.ArrowDown || K.mouse.down);
      }
      b.x = clamp(b.x, 40, W - 40);
      if (this.caught >= 0) { this.hy -= 330 * dt; var cf = this.fish[this.caught]; cf.x = b.x; cf.y = this.hy; if (this.hy <= 78) { this.hy = 78; this.focus = [b.x, 80]; K.commit(this, this.caught); this.caught = -2; } return; }
      if (this.caught === -2) return;
      this.hy = clamp(this.hy + (hold ? 230 : -300) * dt, 78, H - 12);
      this.fish.forEach(function (f) { if (self.caught < 0 && !f.got && Math.abs(b.x - f.x) < 62 && Math.abs(self.hy - f.y) < 22) { f.got = true; self.caught = f.i; sound("zap"); } });
    },
    draw: function (t) {
      var ctx = K.ctx, i, b = this.boat, g = ctx.createLinearGradient(0, 80, 0, H); g.addColorStop(0, "#0ea5e9"); g.addColorStop(1, "#0c4a6e"); ctx.fillStyle = "#bae6fd"; ctx.fillRect(0, 0, W, 80); ctx.fillStyle = g; ctx.fillRect(0, 80, W, H - 80);
      for (i = 0; i < 12; i++) { ctx.fillStyle = "rgba(255,255,255,.12)"; ctx.fillRect(((i * 97 + t * 14) % W), 100 + (i * 41) % 260, 30, 3); }
      ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 3; ctx.beginPath(); for (var x = 0; x <= W; x += 10) { var y = 80 + Math.sin(x / 30 + t * 2) * 3; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      this.fish.forEach(function (f, k) {
        ctx.save(); ctx.translate(f.x, f.y); if (f.v < 0 && !f.got) ctx.scale(-1, 1); ctx.fillStyle = OC[f.i]; ctx.beginPath(); ctx.ellipse(0, 0, 62, 21, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-58, 0); ctx.lineTo(-84, -18); ctx.lineTo(-84, 18); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 62, 21, 0, 0, TAU); ctx.stroke(); ctx.restore();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(f.x + (f.v < 0 && !f.got ? -48 : 48), f.y - 6, 5, 0, TAU); ctx.fill(); ctx.fillStyle = "rgba(15,23,42,.82)"; rr(f.x - 46, f.y - 15, 84, 30, 8); ctx.fill(); badge(f.i, f.x - 34, f.y, 8); label(this.opts[f.i], f.x + 8, f.y, 60, 26, "#f8fafc", 11);
      }, this);
      ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x, 60); ctx.lineTo(b.x, this.hy); ctx.stroke(); ctx.fillStyle = "#cbd5e1"; ctx.beginPath(); ctx.arc(b.x, this.hy + 3, 5, 0, Math.PI); ctx.stroke();
      ctx.fillStyle = "#b45309"; ctx.beginPath(); ctx.moveTo(b.x - 46, 52); ctx.lineTo(b.x + 46, 52); ctx.lineTo(b.x + 32, 72); ctx.lineTo(b.x - 32, 72); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#f8fafc"; ctx.fillRect(b.x - 4, 24, 4, 28); ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.moveTo(b.x, 24); ctx.lineTo(b.x + 26, 48); ctx.lineTo(b.x, 48); ctx.fill();
      if (this.time < 6 && this.res.length === 0) txt("move the boat, HOLD SPACE (or the mouse button) to lower the hook", W / 2, H - 10, 11, "#e0f2fe");
    }
  });

  /* ============================================================ 4.10b SKYDIVE BREAK-OUT ============ */
  K.make("u4l11", {
    build: function () { this.d = { x: W / 2 + (Math.random() - 0.5) * 300, y: 36, vx: 0 }; this.ph = Math.random() * 6; this.cl = []; for (var i = 0; i < 10; i++) this.cl.push([Math.random() * W, Math.random() * H, 0.4 + Math.random() * 0.8]); this.mx = null; this.wind = 0; },
    move: function (x) { this.mx = x; },
    step: function (dt) {
      var d = this.d, ctl = 0, fall = 52; this.wind = Math.sin(this.time * 0.8 + this.ph) * 70 + Math.sin(this.time * 1.9) * 25;
      if (this.bot !== null) { var tx = (this.bot + 0.5) * W / this.n; ctl = clamp((tx - d.x) * 3 - this.wind, -190, 190); }
      else { if (K.keys.ArrowLeft) { ctl = -190; this.mx = null; } if (K.keys.ArrowRight) { ctl = 190; this.mx = null; } if (!ctl && this.mx !== null) ctl = clamp((this.mx - d.x) * 3 - this.wind, -190, 190); if (K.keys.ArrowUp) fall = 22; if (K.keys.ArrowDown) fall = 120; }
      d.vx += (ctl - d.vx) * Math.min(1, dt * 5); d.x += (d.vx + this.wind) * dt; if (d.x < 12) d.x = 12; if (d.x > W - 12) d.x = W - 12; d.y += fall * dt; this.fall = fall;
      if (d.y >= H - 70) { this.focus = [d.x, H - 70]; K.commit(this, Math.min(this.n - 1, Math.floor(d.x / (W / this.n)))); d.y = H - 70; }
    },
    draw: function (t, dt) {
      var ctx = K.ctx, i, d = this.d, g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1d4ed8"); g.addColorStop(1, "#bae6fd"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      this.cl.forEach(function (c) { c[1] -= 30 * c[2] * dt * 1.4; if (c[1] < -30) { c[1] = H + 30; c[0] = Math.random() * W; } ctx.fillStyle = "rgba(255,255,255," + (0.35 + c[2] * 0.3) + ")"; ctx.beginPath(); ctx.arc(c[0], c[1], 22 * c[2] + 8, 0, TAU); ctx.arc(c[0] + 26 * c[2], c[1] + 4, 16 * c[2] + 6, 0, TAU); ctx.arc(c[0] - 26 * c[2], c[1] + 4, 15 * c[2] + 6, 0, TAU); ctx.fill(); });
      var pw = W / this.n; for (i = 0; i < this.n; i++) { ctx.fillStyle = OC[i]; ctx.fillRect(i * pw, H - 56, pw, 56); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(i * pw, H - 56, pw, 6); ctx.fillStyle = "rgba(15,23,42,.85)"; ctx.fillRect(i * pw + 4, H - 48, pw - 8, 44); badge(i, i * pw + 22, H - 26, 10); label(this.opts[i], i * pw + 30 + (pw - 40) / 2, H - 26, pw - 50, 40, "#f8fafc", 13); }
      var sway = Math.sin(t * 2) * 0.05 + clamp(d.vx / 900, -0.2, 0.2); ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(sway); ctx.fillStyle = "#f43f5e"; ctx.beginPath(); ctx.arc(0, -34, 42, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(0, -34, 42, Math.PI * 1.35, Math.PI * 1.65); ctx.lineTo(0, -34); ctx.fill(); ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.5; [[-42, -34], [-14, -34], [14, -34], [42, -34]].forEach(function (p) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(0, 0); ctx.stroke(); });
      ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(0, -4, 7, 0, TAU); ctx.fill(); ctx.fillStyle = "#1e293b"; ctx.fillRect(-6, 3, 12, 16); ctx.fillRect(-6, 19, 4, 9); ctx.fillRect(2, 19, 4, 9); ctx.restore();
      var wd = this.wind; txt(wd > 8 ? "wind → " + Math.round(wd) : wd < -8 ? "← wind " + Math.round(-wd) : "calm", 70, 18, 11, "#e0f2fe");
      if (this.time < 6 && this.res.length === 0) txt("steer with LEFT/RIGHT (UP slows, DOWN speeds up). The wind pushes you!", W / 2, 18, 11, "#fff");
    }
  });

  /* ============================================================ 4.11 RANDOM ROULETTE ============ */
  K.make("u4l12", {
    CX: 270, CY: 196, R: 160, W0: 3.4, A: 5.5,
    build: function () { this.th = Math.random() * TAU; this.om = this.W0; this.stopping = false; this.done = false; },
    segOf: function (th) { var a = ((-Math.PI / 2 - th) % TAU + TAU) % TAU; return a / (TAU / this.n); },
    stop: function () { if (!this.stopping) { this.stopping = true; sound("tick"); } },
    key: function (e) { if (e.code === "Space" || e.code === "Enter") this.stop(); },
    down: function () { this.stop(); },
    step: function (dt) {
      if (this.done) return;
      if (this.bot !== null && !this.stopping) { var fin = this.th + this.om * this.om / (2 * this.A), s = this.segOf(fin); if (Math.floor(s) === this.bot && s - this.bot > 0.3 && s - this.bot < 0.7) this.stop(); }
      if (this.stopping) { this.om = Math.max(0, this.om - this.A * dt); if (this.om === 0) { this.done = true; this.focus = [this.CX, this.CY - this.R]; K.commit(this, Math.min(this.n - 1, Math.floor(this.segOf(this.th)))); } }
      this.th += this.om * dt;
    },
    draw: function (t) {
      var ctx = K.ctx, i, n = this.n, seg = TAU / n, cx = this.CX, cy = this.CY, R = this.R; ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#1e1b4b"; ctx.fillRect(0, 0, 548, H);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(this.th);
      for (i = 0; i < n; i++) { var a0 = -Math.PI / 2 + i * seg - (-Math.PI / 2); ctx.fillStyle = OC[i]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a0, a0 + seg); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 4; ctx.stroke(); ctx.save(); ctx.rotate(a0 + seg / 2); badge(i, R * 0.62, 0, 22); ctx.restore(); }
      ctx.restore();
      ctx.strokeStyle = "#fde047"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, TAU); ctx.stroke(); for (i = 0; i < 24; i++) { var a = i / 24 * TAU; ctx.fillStyle = (i + Math.floor(t * 6)) % 2 ? "#fff" : "#f59e0b"; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (R + 14), cy + Math.sin(a) * (R + 14), 4, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, TAU); ctx.fill(); ctx.strokeStyle = "#fde047"; ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(cx, cy - R + 8); ctx.lineTo(cx - 14, cy - R - 22); ctx.lineTo(cx + 14, cy - R - 22); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke();
      legend(this.opts, 556, 8, 238);
      if (!this.stopping && this.time < 8) txt("press SPACE (or click) to stop the wheel. It keeps turning a little!", cx, H - 12, 12, "#c4b5fd");
    }
  });
})();
