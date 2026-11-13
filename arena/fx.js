/* The arena itself: a canvas where every player is a glowing piece on a ringed platform.
   Rank decides where you stand (rank 1 holds the center, lower ranks sit on the outer rings), correct answers send out shockwaves
   (the fastest first), duels are visible clashes where points fly from the loser to the winner, and a streak lights a heat ring.
   usage:  var fx = new ArenaFX(canvas, { me: playerId, labels: true });
           fx.setBoard([{id,name,score,rank,streak,answered}], "play"|"lobby"|"final")
           fx.playReveal(board, duels)        // board entries carry ps (score before), pr (rank before), ok, pts, duel, ms */
(function (root) {
  var HUES = [188, 12, 148, 45, 275, 330, 100, 215], SHAPES = ["circle", "diamond", "tri", "hex", "square", "pent"];
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function ease(t) { return t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3); }
  function ArenaFX(canvas, opt) {
    this.cv = canvas; this.ctx = canvas.getContext("2d"); this.opt = opt || {}; this.me = this.opt.me || null;
    this.av = {}; this.fxs = []; this.tl = []; this.t = 0; this.mode = "lobby"; this.shake = 0; this.burst = 0; this.last = 0; this.stars = [];
    for (var i = 0; i < 60; i++) this.stars.push({ a: Math.random() * 6.283, d: Math.random(), s: Math.random() * 1.4 + .3, v: Math.random() * .02 + .005 });
    var self = this; this.resize(); if (window.ResizeObserver) new ResizeObserver(function () { self.resize(); }).observe(canvas); else window.addEventListener("resize", function () { self.resize(); });
    var loop = function (ts) { self.frame(ts); self.raf = requestAnimationFrame(loop); }; this.raf = requestAnimationFrame(loop);
  }
  var P = ArenaFX.prototype;
  P.resize = function () {
    var dpr = Math.min(2, window.devicePixelRatio || 1), w = this.cv.clientWidth || 300, h = this.cv.clientHeight || 300;
    this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr); this.w = w; this.h = h; this.dpr = dpr;
    this.cx = w / 2; this.cy = h / 2; this.R = Math.min(w, h) * 0.47; this.snap = true;
  };
  P.destroy = function () { cancelAnimationFrame(this.raf); };
  P.color = function (a, l, al) { return "hsla(" + a.hue + "," + (l ? 90 : 85) + "%," + (l || 62) + "%," + (al == null ? 1 : al) + ")"; };

  /* ----- who is on the platform ----- */
  P.setBoard = function (list, mode) {
    var self = this, seen = {}; this.mode = mode || this.mode;
    list.forEach(function (p, i) {
      seen[p.id] = 1; var a = self.av[p.id], hh = hash(p.id);
      if (!a) { a = self.av[p.id] = { id: p.id, hue: HUES[hh % HUES.length], shape: SHAPES[(hh >> 4) % SHAPES.length], x: self.cx, y: self.cy, scale: 0, glow: 0, flash: 0, dim: 0, born: self.t, order: i }; a.fresh = true; self.ring(a, .5); }
      a.name = p.name; a.score = p.score || 0; a.dscore = a.dscore == null ? a.score : a.dscore; a.rank = p.rank || i + 1; a.streak = p.streak || 0; a.charged = !!p.answered; a.order = i;
    });
    Object.keys(this.av).forEach(function (id) { if (!seen[id]) delete self.av[id]; });
    if (this.mode === "final" && !this.finalAt) { this.finalAt = this.t; this.burst = 1; }
    if (this.mode !== "final") this.finalAt = 0;
  };
  /* where an avatar wants to stand */
  P.target = function (a, n) {
    var R = this.R, rk = a.rank, slot, cnt, ring, base, spd;
    if (this.mode === "lobby") { var all = Object.keys(this.av).length || 1; ring = .62; cnt = all; slot = a.order; base = this.t * .05; return { x: this.cx + Math.cos(base + slot / cnt * 6.283) * R * ring, y: this.cy + Math.sin(base + slot / cnt * 6.283) * R * ring * .92 }; }
    if (rk === 1) return { x: this.cx, y: this.cy };
    if (rk <= 4) { ring = .33; cnt = Math.min(3, n - 1); slot = rk - 2; base = this.t * .09; }
    else if (rk <= 10) { ring = .62; cnt = Math.min(6, n - 4); slot = rk - 5; base = -this.t * .06 + 1; }
    else { ring = .89; cnt = Math.max(1, n - 10); slot = rk - 11; base = this.t * .035 + 2; }
    var ang = base + slot / Math.max(1, cnt) * 6.283;
    return { x: this.cx + Math.cos(ang) * R * ring, y: this.cy + Math.sin(ang) * R * ring * .92 };
  };

  /* ----- effects ----- */
  P.ring = function (a, size, col) { this.fxs.push({ k: "ring", id: a.id, t0: this.t, dur: .9, size: size || 1, hue: col != null ? col : a.hue }); };
  P.text = function (a, txt, col, dy) { this.fxs.push({ k: "text", id: a.id, t0: this.t, dur: 1.4, txt: txt, col: col, dy: dy || 0 }); };
  P.after = function (sec, fn) { this.tl.push({ at: this.t + sec, fn: fn }); };
  P.orbs = function (from, to, n, hue) { for (var i = 0; i < n; i++) this.fxs.push({ k: "orb", from: from.id, to: to.id, t0: this.t + i * .035, dur: .7 + Math.random() * .25, hue: hue, off: Math.random() * 40 - 20 }); };

  /* the reveal: pulses (fastest first), then duel clashes, then everybody glides to their new place */
  P.playReveal = function (board, duels) {
    var self = this, byId = {}; board.forEach(function (b) { byId[b.id] = b; });
    /* start from the old standings */
    board.forEach(function (b) { var a = self.av[b.id]; if (a) { if (b.pr) a.rank = b.pr; a.dscore = b.ps; a.streak = b.ok ? Math.max(0, b.streak - 1) : (b.streak ? b.streak : 0); a.score = b.ps; } });
    var ok = board.filter(function (b) { return b.ok; }).sort(function (a, b) { return a.ms - b.ms; });
    var n = ok.length, span = Math.min(1.3, .06 * n + .2);
    ok.forEach(function (b, i) { self.after(i / Math.max(1, n) * span, function () { var a = self.av[b.id]; if (!a) return; self.ring(a, 1.7); a.flash = 1; a.glow = 1; self.text(a, "+" + (b.pts || 0), "#3ddc97"); a.streak = b.streak; }); });
    board.filter(function (b) { return !b.ok; }).forEach(function (b) { self.after(.15, function () { var a = self.av[b.id]; if (!a) return; if (b.none) a.dim = 1; else { self.ring(a, 1, 8); a.shake = 1; } a.streak = 0; }); });
    var t = span + .9;
    (duels || []).forEach(function (d) {
      if (!d.bId || !d.winnerId) return; var A = self.av[d.aId], B = self.av[d.bId]; if (!A || !B) return;
      var W = d.winnerId === d.aId ? A : B, L = W === A ? B : A;
      self.after(t, function () { A.hold = B.hold = { until: self.t + 2.1, x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, pair: [A, B], from: self.t }; self.fxs.push({ k: "beam", a: A.id, b: B.id, t0: self.t, dur: 1.1 }); });
      self.after(t + .85, function () { var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2; self.fxs.push({ k: "clash", x: mx, y: my, t0: self.t, dur: .7, hue: W.hue }); self.shake = Math.max(self.shake, .8); self.flashAll = .5; });
      self.after(t + .95, function () { self.orbs(L, W, Math.max(4, Math.round(d.amt / 25)), W.hue); self.text(W, "+" + d.amt, "#ffc857", -14); self.text(L, "-" + d.amt, "#ff5a3c", 14); });
      t += 0;
    });
    var dueling = (duels || []).some(function (d) { return d.winnerId; });
    self.after(span + (dueling ? 3.2 : 1.5), function () { board.forEach(function (b) { var a = self.av[b.id]; if (!a) return; a.rank = b.rank; a.score = b.score; a.streak = b.streak; a.hold = null; }); });
  };

  /* ----- drawing ----- */
  function path(ctx, shape, x, y, r) {
    ctx.beginPath();
    if (shape === "circle") { ctx.arc(x, y, r, 0, 6.2832); return; }
    var n = shape === "diamond" ? 4 : shape === "tri" ? 3 : shape === "hex" ? 6 : shape === "square" ? 4 : 5, rot = shape === "square" ? Math.PI / 4 : -Math.PI / 2, rr = shape === "square" ? r * .95 : shape === "tri" ? r * 1.15 : r * 1.05;
    for (var i = 0; i < n; i++) { var an = rot + i / n * 6.2832; var px = x + Math.cos(an) * rr, py = y + Math.sin(an) * rr * (shape === "diamond" ? 1.2 : 1); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath();
  }
  P.frame = function (ts) {
    var dt = Math.min(.05, (ts - (this.last || ts)) / 1000); this.last = ts; this.t += dt;
    var ctx = this.ctx, self = this, w = this.w, h = this.h, R = this.R, cx = this.cx, cy = this.cy;
    for (var i = this.tl.length - 1; i >= 0; i--) if (this.t >= this.tl[i].at) { var f = this.tl[i].fn; this.tl.splice(i, 1); f(); }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    if (this.shake > 0) { this.shake = Math.max(0, this.shake - dt * 2.2); ctx.translate((Math.random() - .5) * 9 * this.shake, (Math.random() - .5) * 9 * this.shake); }
    this.drawPlatform(ctx, dt);
    var ids = Object.keys(this.av), n = ids.length, list = ids.map(function (id) { return self.av[id]; });
    /* movement */
    list.forEach(function (a) {
      var tg = self.target(a, n), hold = a.hold && self.t < a.hold.until ? a.hold : null;
      if (hold) { var k = Math.min(1, (self.t - hold.from) / .8), side = hold.pair[0] === a ? -1 : 1, dx = hold.pair[1].x - hold.pair[0].x, dy = hold.pair[1].y - hold.pair[0].y, L = Math.sqrt(dx * dx + dy * dy) || 1; var gap = self.t - hold.from > .85 ? 1.6 : .55;
        tg = { x: hold.x + side * dx / L * 22 * gap * (self.w / 420 + .4), y: hold.y + side * dy / L * 22 * gap * (self.w / 420 + .4) }; a.x += (tg.x - a.x) * Math.min(1, dt * 9); a.y += (tg.y - a.y) * Math.min(1, dt * 9); }
      else if (self.snap) { a.hold = null; a.x = tg.x; a.y = tg.y; }
      else { a.hold = null; var sp = a.fresh ? 3 : 4.2; a.x += (tg.x - a.x) * Math.min(1, dt * sp); a.y += (tg.y - a.y) * Math.min(1, dt * sp); }
      if (a.fresh && Math.abs(a.x - tg.x) < 3) a.fresh = false;
      a.scale += (1 - a.scale) * Math.min(1, dt * 5); a.glow = Math.max(0, a.glow - dt * 1.4); a.flash = Math.max(0, a.flash - dt * 2.5); a.shake = Math.max(0, (a.shake || 0) - dt * 2.4); a.dim = Math.max(0, a.dim - dt * .6);
      a.dscore += (a.score - a.dscore) * Math.min(1, dt * 4);
    });
    this.snap = false;
    /* back-to-front: lowest rank first so the leader is on top */
    list.sort(function (a, b) { return b.rank - a.rank; });
    this.drawFx(ctx, "under");
    list.forEach(function (a) { self.drawAv(ctx, a, n); });
    this.drawFx(ctx, "over");
    if (this.burst > 0) { this.drawBurst(ctx, dt); }
    if (this.flashAll > 0) { ctx.fillStyle = "rgba(255,255,255," + this.flashAll * .18 + ")"; ctx.fillRect(0, 0, w, h); this.flashAll = Math.max(0, this.flashAll - dt * 2); }
  };
  P.drawPlatform = function (ctx, dt) {
    var cx = this.cx, cy = this.cy, R = this.R, t = this.t, g;
    g = ctx.createRadialGradient(cx, cy, R * .05, cx, cy, R * 1.12); g.addColorStop(0, "rgba(22,34,52,.95)"); g.addColorStop(.7, "rgba(10,14,22,.9)"); g.addColorStop(1, "rgba(9,11,15,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.12, R * 1.03, 0, 0, 6.2832); ctx.fill();
    /* drifting dust */
    this.stars.forEach(function (s) { s.a += s.v * dt; var rr = (.25 + s.d * .85) * R, x = cx + Math.cos(s.a) * rr, y = cy + Math.sin(s.a) * rr * .92; ctx.fillStyle = "rgba(160,200,255," + (.08 + s.s * .1) + ")"; ctx.fillRect(x, y, s.s, s.s); });
    var rings = [.33, .62, .89];
    rings.forEach(function (k, i) { ctx.strokeStyle = "rgba(61,217,255," + (.16 - i * .03) + ")"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, cy, R * k, R * k * .92, 0, 0, 6.2832); ctx.stroke(); });
    /* rotating dashed outer edge + ticks */
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * .06); ctx.setLineDash([R * .06, R * .05]); ctx.strokeStyle = "rgba(61,217,255,.32)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, R * 1.0, R * .92, 0, 0, 6.2832); ctx.stroke(); ctx.restore(); ctx.setLineDash([]);
    for (var i = 0; i < 48; i++) { var an = i / 48 * 6.2832; ctx.strokeStyle = i % 4 ? "rgba(120,150,190,.18)" : "rgba(120,150,190,.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * R * 1.04, cy + Math.sin(an) * R * .96); ctx.lineTo(cx + Math.cos(an) * R * (i % 4 ? 1.07 : 1.1), cy + Math.sin(an) * R * (i % 4 ? .99 : 1.01)); ctx.stroke(); }
    /* the center: the throne */
    var pulse = .5 + .5 * Math.sin(t * 2); g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * .22); g.addColorStop(0, "rgba(255,200,87," + (.16 + pulse * .1) + ")"); g.addColorStop(1, "rgba(255,200,87,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * .22, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = "rgba(255,200,87," + (.35 + pulse * .25) + ")"; ctx.lineWidth = 1.6; path(ctx, "hex", cx, cy, R * .13); ctx.stroke();
    if (this.mode === "lobby") { ctx.fillStyle = "rgba(180,200,230,.5)"; ctx.font = "600 " + Math.max(9, R * .055) + "px JetBrains Mono,monospace"; ctx.textAlign = "center"; ctx.fillText("WAITING FOR START", cx, cy + R * .02); }
  };
  P.drawAv = function (ctx, a, n) {
    var big = this.R > 150, r = Math.max(10, this.R * (big ? .062 : .075)) * (a.rank === 1 && this.mode !== "lobby" ? 1.35 : 1) * a.scale, mine = a.id === this.me;
    var x = a.x + (a.shake ? (Math.random() - .5) * 7 * a.shake : 0), y = a.y, hue = a.hue, alpha = 1 - a.dim * .65;
    ctx.save(); ctx.globalAlpha = alpha;
    /* shadow on the platform */
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(x, y + r * 1.15, r * .95, r * .35, 0, 0, 6.2832); ctx.fill();
    /* heat ring: a streak lights up segments around the piece */
    if (a.streak >= 2) { var seg = Math.min(5, a.streak); for (var i = 0; i < 5; i++) { var an = this.t * 1.4 + i / 5 * 6.2832; ctx.strokeStyle = i < seg ? "rgba(255,110,60,.95)" : "rgba(255,110,60,.15)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r * 1.55, an, an + .9); ctx.stroke(); } }
    /* charged: this player has locked in an answer */
    if (a.charged) { ctx.strokeStyle = "rgba(61,217,255," + (.6 + .3 * Math.sin(this.t * 6)) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * 1.35, 0, 6.2832); ctx.stroke(); }
    ctx.shadowColor = this.color(a, 60, .9); ctx.shadowBlur = (12 + a.glow * 26 + (mine ? 10 : 0)) * (this.dpr > 1 ? 1 : 1);
    var g = ctx.createLinearGradient(x - r, y - r, x + r, y + r); g.addColorStop(0, this.color(a, 70 + a.flash * 20)); g.addColorStop(1, this.color(a, 36 + a.flash * 25));
    path(ctx, a.shape, x, y, r); ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0;
    ctx.lineWidth = mine ? 2.6 : 1.5; ctx.strokeStyle = mine ? "#ffffff" : "rgba(255,255,255,.55)"; path(ctx, a.shape, x, y, r); ctx.stroke();
    var ini = (a.name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
    ctx.fillStyle = "rgba(4,10,16,.9)"; ctx.font = "700 " + Math.round(r * .78) + "px Rajdhani,sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(ini, x, y + r * .06);
    ctx.restore();
    /* labels */
    var showName = this.opt.labels !== false && (mine || n <= (big ? 40 : 6) || a.rank <= 3);
    if (showName) { ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.globalAlpha = alpha; ctx.font = "600 " + Math.max(9, Math.round(r * (big ? .62 : .75))) + "px Rajdhani,sans-serif"; ctx.fillStyle = mine ? "#ffffff" : "rgba(220,230,245,.85)"; ctx.fillText((a.name || "").toUpperCase().slice(0, 12) + (mine && !big ? " (YOU)" : ""), x, y + r * 2.15);
      if (big && this.opt.scores !== false) { ctx.font = "500 " + Math.max(9, Math.round(r * .5)) + "px JetBrains Mono,monospace"; ctx.fillStyle = "rgba(160,176,200,.85)"; ctx.fillText(Math.round(a.dscore).toLocaleString(), x, y + r * 2.15 + Math.max(10, r * .62)); } ctx.globalAlpha = 1; }
    if (a.rank === 1 && this.mode !== "lobby") { var cr = r * 1.25; ctx.strokeStyle = "rgba(255,200,87,.9)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - cr * .7, y - cr * 1.25); ctx.lineTo(x - cr * .4, y - cr * 1.7); ctx.lineTo(x, y - cr * 1.3); ctx.lineTo(x + cr * .4, y - cr * 1.7); ctx.lineTo(x + cr * .7, y - cr * 1.25); ctx.closePath(); ctx.stroke(); ctx.fillStyle = "rgba(255,200,87,.25)"; ctx.fill(); }
    if (this.mode === "final" && a.rank === 1) { var k = ((this.t - this.finalAt) * .8) % 1; ctx.strokeStyle = "rgba(255,200,87," + (1 - k) * .7 + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * (1.6 + k * 4), 0, 6.2832); ctx.stroke(); }
  };
  P.drawFx = function (ctx, layer) {
    var self = this, t = this.t;
    this.fxs = this.fxs.filter(function (f) { return t < f.t0 + f.dur + .05; });
    this.fxs.forEach(function (f) {
      var k = (t - f.t0) / f.dur; if (k < 0) return;
      var a = f.id && self.av[f.id], bigR = self.R;
      if (f.k === "ring" && layer === "under" && a) { ctx.strokeStyle = "hsla(" + f.hue + ",90%,65%," + (1 - k) * .85 + ")"; ctx.lineWidth = 2.5 * (1 - k) + .5; ctx.beginPath(); ctx.arc(a.x, a.y, bigR * .05 + k * bigR * .24 * f.size, 0, 6.2832); ctx.stroke(); }
      if (f.k === "text" && layer === "over" && a) { ctx.globalAlpha = 1 - Math.pow(k, 2.5); ctx.fillStyle = f.col; ctx.font = "700 " + Math.max(13, Math.round(bigR * .075)) + "px Rajdhani,sans-serif"; ctx.textAlign = "center"; ctx.shadowColor = f.col; ctx.shadowBlur = 8; ctx.fillText(f.txt, a.x, a.y - bigR * .1 - k * bigR * .16 + f.dy); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
      if (f.k === "beam" && layer === "under") { var A = self.av[f.a], B = self.av[f.b]; if (A && B) { ctx.strokeStyle = "rgba(255,90,60," + (.3 + .5 * Math.sin(k * 20) * .5 + .3) * (1 - k * .6) + ")"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); ctx.setLineDash([]); } }
      if (f.k === "clash" && layer === "over") { var rr = bigR * .04 + k * bigR * .38; ctx.strokeStyle = "rgba(255,255,255," + (1 - k) + ")"; ctx.lineWidth = 4 * (1 - k) + 1; ctx.beginPath(); ctx.arc(f.x, f.y, rr, 0, 6.2832); ctx.stroke(); ctx.strokeStyle = "hsla(" + f.hue + ",95%,65%," + (1 - k) * .8 + ")"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, rr * .66, 0, 6.2832); ctx.stroke();
        for (var i = 0; i < 12; i++) { var an = i / 12 * 6.2832 + .3, d1 = rr * .5, d2 = rr * (.9 + k * .3); ctx.strokeStyle = "rgba(255,255,255," + (1 - k) * .7 + ")"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(f.x + Math.cos(an) * d1, f.y + Math.sin(an) * d1); ctx.lineTo(f.x + Math.cos(an) * d2, f.y + Math.sin(an) * d2); ctx.stroke(); } }
      if (f.k === "orb" && layer === "over") { var F = self.av[f.from], T = self.av[f.to]; if (F && T) { var e = ease(k), mx = (F.x + T.x) / 2 + f.off, my = (F.y + T.y) / 2 - 30 - Math.abs(f.off), u = 1 - e; var x = u * u * F.x + 2 * u * e * mx + e * e * T.x, y = u * u * F.y + 2 * u * e * my + e * e * T.y; ctx.fillStyle = "rgba(255,200,87," + (1 - k * .3) + ")"; ctx.shadowColor = "#ffc857"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, Math.max(2, bigR * .016), 0, 6.2832); ctx.fill(); ctx.shadowBlur = 0; if (k > .9) T.glow = 1; } }
    });
  };
  P.drawBurst = function (ctx, dt) {
    this.burst = Math.max(0, this.burst - dt * .6); var k = 1 - this.burst;
    for (var i = 0; i < 36; i++) { var an = i / 36 * 6.2832, d1 = this.R * (.1 + k * .9), d2 = d1 + this.R * .18; ctx.strokeStyle = "rgba(255,200,87," + this.burst * .7 + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(this.cx + Math.cos(an) * d1, this.cy + Math.sin(an) * d1 * .92); ctx.lineTo(this.cx + Math.cos(an) * d2, this.cy + Math.sin(an) * d2 * .92); ctx.stroke(); }
  };
  root.ArenaFX = ArenaFX;
})(window);
