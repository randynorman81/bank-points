/* ADVENTURE ART: all the pixel art for the two survival-horror adventures, drawn with code on a small canvas (240 x 135 "pixels") and scaled up sharp.
   Rooms (stone, wood, metal, concrete, street), props, characters, monsters, lighting, fog, rain and effects. No image files: everything is made here. */
(function () {
  "use strict";
  var W = 240, H = 135, FL = 108;   /* logical size, and the y where the floor starts */

  function rect(c, col, x, y, w, h) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0; return h; }
  function rnd(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function shade(hex, k) { var v = rgb(hex); function f(x) { return Math.max(0, Math.min(255, Math.round(k < 0 ? x * (1 + k) : x + (255 - x) * k))); } return "rgb(" + f(v[0]) + "," + f(v[1]) + "," + f(v[2]) + ")"; }
  function mix(a, b, t) { var x = rgb(a), y = rgb(b); return "rgb(" + Math.round(x[0] + (y[0] - x[0]) * t) + "," + Math.round(x[1] + (y[1] - x[1]) * t) + "," + Math.round(x[2] + (y[2] - x[2]) * t) + ")"; }
  /* a solid block with a dark outline, a light top edge and a dark bottom edge: the basic building piece */
  function blk(c, x, y, w, h, col) { rect(c, "#0d0a14", x - 1, y - 1, w + 2, h + 2); rect(c, col, x, y, w, h); rect(c, shade(col, 0.28), x, y, w, 1); rect(c, shade(col, 0.14), x, y, 1, h); rect(c, shade(col, -0.35), x, y + h - 1, w, 1); rect(c, shade(col, -0.2), x + w - 1, y, 1, h); }
  function disc(c, col, cx, cy, r) { c.fillStyle = col; for (var y = -r; y <= r; y++) { var w = Math.round(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1); } }

  /* ============================================================== rooms: walls and floors ==== */
  function paintWall(c, r, rd) {
    var P = r.pal, k = r.wall || "stone", x, y;
    rect(c, P[0], 0, 0, W, FL);
    if (k === "stone") {
      var bh = 9, bw = 22;
      for (y = 0; y < FL; y += bh) { var off = (y / bh) % 2 ? bw / 2 : 0; for (x = -off; x < W; x += bw) { var v = (rd() - 0.5) * 0.3; rect(c, shade(P[0], v), x + 1, y + 1, bw - 1, bh - 1); if (rd() < 0.25) rect(c, shade(P[0], 0.18), x + 2, y + 1, bw - 5, 1); if (rd() < 0.2) rect(c, shade(P[0], -0.3), x + 2 + Math.floor(rd() * (bw - 6)), y + 2 + Math.floor(rd() * 4), 2, 1); } rect(c, shade(P[0], -0.5), 0, y, W, 1); }
      for (y = 0; y < FL; y += bh) { var off2 = (y / bh) % 2 ? bw / 2 : 0; for (x = -off2; x < W; x += bw) rect(c, shade(P[0], -0.5), x, y, 1, bh); }
    } else if (k === "wood") {
      for (x = 0; x < W; x += 12) { rect(c, shade(P[0], (rd() - 0.5) * 0.22), x, 0, 11, FL); rect(c, shade(P[0], -0.5), x + 11, 0, 1, FL); for (var g = 0; g < 9; g++) rect(c, shade(P[0], -0.25), x + 2 + Math.floor(rd() * 7), Math.floor(rd() * FL), 1, 3 + Math.floor(rd() * 8)); }
      rect(c, shade(P[0], -0.4), 0, 54, W, 2); rect(c, shade(P[0], 0.2), 0, 56, W, 1);
    } else if (k === "metal") {
      for (x = 0; x < W; x += 40) for (y = 0; y < FL; y += 30) { rect(c, shade(P[0], (rd() - 0.5) * 0.14), x + 1, y + 1, 38, 28); rect(c, shade(P[0], 0.2), x + 1, y + 1, 38, 1); rect(c, shade(P[0], -0.45), x, y, 40, 1); rect(c, shade(P[0], -0.45), x, y, 1, 30); [[3, 3], [36, 3], [3, 26], [36, 26]].forEach(function (p) { rect(c, shade(P[0], 0.3), x + p[0], y + p[1], 2, 2); rect(c, shade(P[0], -0.5), x + p[0] + 1, y + p[1] + 1, 1, 1); }); }
      for (x = 0; x < W; x += 6) if (rd() < 0.15) rect(c, "rgba(120,60,20,.35)", x, 20 + Math.floor(rd() * 80), 2, 12 + Math.floor(rd() * 20));
    } else if (k === "concrete") {
      for (y = 0; y < FL; y += 4) rect(c, shade(P[0], (rd() - 0.5) * 0.1), 0, y, W, 4);
      for (var s = 0; s < 260; s++) rect(c, shade(P[0], rd() < 0.5 ? -0.25 : 0.22), Math.floor(rd() * W), Math.floor(rd() * FL), 1 + Math.floor(rd() * 2), 1);
      for (x = 40; x < W; x += 60) rect(c, shade(P[0], -0.3), x, 0, 1, FL);
      for (var cr = 0; cr < 3; cr++) { var cx = 20 + Math.floor(rd() * 200), cy = 10 + Math.floor(rd() * 40); for (var q = 0; q < 22; q++) { rect(c, shade(P[0], -0.55), cx, cy, 1, 1); cx += Math.round(rd() * 2 - 1); cy += 1 + Math.floor(rd() * 2); } }
      for (x = 0; x < W; x += 16) { rect(c, "#d6a40f", x, FL - 8, 8, 6); rect(c, "#171717", x + 8, FL - 8, 8, 6); }
    } else if (k === "street") {
      for (y = 0; y < FL; y++) rect(c, mix(P[0], P[1], y / FL), 0, y, W, 1);
      for (var st = 0; st < 40; st++) rect(c, "rgba(255,255,255,.55)", Math.floor(rd() * W), Math.floor(rd() * 40), 1, 1);
      disc(c, "#cfd8e8", 190, 24, 11); disc(c, "#aab6cc", 193, 21, 3); disc(c, "#aab6cc", 186, 28, 2);
      for (var b = 0, bx = 0; bx < W; b++) { var bw2 = 18 + Math.floor(rd() * 26), bh2 = 30 + Math.floor(rd() * 50), col = shade(P[0], -0.35 - rd() * 0.2); rect(c, col, bx, FL - bh2, bw2, bh2); for (var wy = FL - bh2 + 4; wy < FL - 6; wy += 7) for (var wx = bx + 3; wx < bx + bw2 - 3; wx += 6) if (rd() < 0.16) rect(c, "#f6d56a", wx, wy, 3, 4); bx += bw2 + 1; }
    } else if (k === "tile") {
      for (x = 0; x < W; x += 12) for (y = 0; y < FL; y += 12) { rect(c, shade(P[0], (rd() - 0.5) * 0.12), x + 1, y + 1, 11, 11); }
      rect(c, shade(P[0], -0.3), 0, FL - 14, W, 2);
    }
    if (r.panel) { for (x = 0; x < W; x += 80) { rect(c, "rgba(0,0,0,.25)", x, 0, 2, FL); } }
    for (var i = 0; i < 12; i++) rect(c, "rgba(0,0,0," + (0.45 - i * 0.04) + ")", 0, i, W, 1);   /* shadow under the ceiling */
    for (var j = 0; j < 14; j++) rect(c, "rgba(0,0,0," + (0.4 - j * 0.028) + ")", j, 0, 1, FL); for (var j2 = 0; j2 < 14; j2++) rect(c, "rgba(0,0,0," + (0.4 - j2 * 0.028) + ")", W - 1 - j2, 0, 1, FL);   /* dark corners */
  }
  function paintFloor(c, r, rd) {
    var P = r.pal, k = r.floor || "flag", x, y, rows = [FL, FL + 5, FL + 11, FL + 19, FL + 28];
    rect(c, P[2], 0, FL, W, H - FL);
    for (var i = 0; i < rows.length; i++) {
      var y0 = rows[i], y1 = i + 1 < rows.length ? rows[i + 1] : H, hh = y1 - y0;
      if (k === "plank") { rect(c, shade(P[2], (rd() - 0.5) * 0.1), 0, y0, W, hh); rect(c, shade(P[2], -0.5), 0, y0, W, 1); for (x = (i % 2) * 17; x < W; x += 34 + i * 8) rect(c, shade(P[2], -0.5), x, y0, 1, hh); }
      else if (k === "tile") { for (x = 0; x < W; x += 16 + i * 4) rect(c, ((x / (16 + i * 4)) + i) % 2 ? P[2] : P[3], x, y0, 16 + i * 4, hh); rect(c, shade(P[2], -0.4), 0, y0, W, 1); }
      else if (k === "grate") { rect(c, P[2], 0, y0, W, hh); for (x = 0; x < W; x += 6 + i * 2) rect(c, P[3], x, y0, 1, hh); rect(c, shade(P[2], -0.5), 0, y0, W, 1); }
      else { for (x = -(i % 2) * 14; x < W; x += 30 + i * 8) { rect(c, shade(P[(x / 30 + i) % 2 > 0.5 ? 2 : 3], (rd() - 0.5) * 0.12), x + 1, y0 + 1, 29 + i * 8, hh - 1); } rect(c, shade(P[2], -0.5), 0, y0, W, 1); }
    }
    for (var s = 0; s < 70; s++) rect(c, shade(P[2], rd() < 0.5 ? -0.3 : 0.2), Math.floor(rd() * W), FL + 2 + Math.floor(rd() * (H - FL - 2)), 1 + Math.floor(rd() * 3), 1);
    rect(c, "rgba(0,0,0,.55)", 0, FL, W, 2); rect(c, "rgba(0,0,0,.3)", 0, FL + 2, W, 2);   /* where the wall meets the floor */
    for (var v = 0; v < 22; v++) rect(c, "rgba(0,0,0," + (v * 0.012) + ")", 0, H - 22 + v, W, 1);
  }
  function paintRoom(c, r) {
    var rd = rnd(hash(r.name || "room"));
    paintWall(c, r, rd); paintFloor(c, r, rd);
  }

  /* ============================================================== props ==== */
  var PROPS = {};
  function def(name, w, h, anchor, draw) { PROPS[name] = { w: w, h: h, anchor: anchor, draw: draw }; }
  function flame(c, x, y, t, s, seed) { var f = Math.sin(t * 14 + (seed || 0)) * 0.5 + Math.sin(t * 23 + (seed || 0) * 2) * 0.5; var hh = Math.round(s * (1 + f * 0.25)); rect(c, "#ff7a1a", x - 1, y - hh, 3, hh); rect(c, "#ffd24a", x, y - hh + 1, 1, hh - 1); rect(c, "#fff3b0", x, y - Math.max(1, hh - 3), 1, 2); rect(c, "#ff7a1a", x - 2, y - 2, 5, 2); }
  function glowSpot(c, x, y, r, col, a) { var g = c.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, col.replace("A", a)); g.addColorStop(1, col.replace("A", 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }

  /* ---- castle ---- */
  def("torch", 8, 22, "c", function (c, x, y, t, o) { rect(c, "#2a1d12", x - 1, y, 3, 9); rect(c, "#5a5a66", x - 3, y - 1, 7, 3); rect(c, "#3b3b46", x - 2, y - 3, 5, 3); flame(c, x, y - 3, t, 8, x); });
  def("window", 30, 44, "c", function (c, x, y, t, o) {
    var l = x - 13, tp = y - 20; rect(c, "#0d0a14", l - 2, tp - 2, 30, 46); rect(c, o.sky || "#16204a", l, tp + 8, 26, 34); disc(c, o.sky || "#16204a", x, tp + 8, 13);
    disc(c, "#dfe7ff", x + 4, tp + 10, 5); disc(c, "#16204a", x + 6, tp + 9, 4);
    for (var i = 0; i < 6; i++) rect(c, "#ffffff", l + 3 + ((i * 7) % 20), tp + 12 + ((i * 11) % 22), 1, 1);
    rect(c, "#3b3045", x - 1, tp - 4, 2, 46); rect(c, "#3b3045", l, tp + 20, 26, 2); rect(c, "#524360", l - 2, tp + 42, 30, 3);
  });
  def("painting", 24, 30, "c", function (c, x, y, t, o) {
    blk(c, x - 11, y - 14, 22, 28, "#7a5a1e"); rect(c, o.bg || "#2c2540", x - 8, y - 11, 16, 22); var v = o.variant || 0;
    if (v === 0) { disc(c, "#d8c6a8", x, y - 2, 5); rect(c, "#2a1d12", x - 6, y - 8, 12, 4); rect(c, "#0d0a14", x - 3, y - 3, 2, 2); rect(c, "#0d0a14", x + 1, y - 3, 2, 2); rect(c, "#3a2850", x - 7, y + 3, 14, 8); if (Math.sin(t * 0.7) > 0.93) { rect(c, "#ff3b3b", x - 3, y - 3, 2, 2); rect(c, "#ff3b3b", x + 1, y - 3, 2, 2); } }
    else if (v === 1) { rect(c, "#34506b", x - 8, y - 11, 16, 12); rect(c, "#3f5b32", x - 8, y + 1, 16, 10); rect(c, "#e8e0c0", x + 2, y - 8, 4, 4); }
    else { for (var py = 0; py < 5; py++) for (var px = 0; px < 5; px++) rect(c, ((px * 3 + py * 5 + (o.seed || 0)) % 4) < 2 ? "#e2e8f0" : "#0f172a", x - 7 + px * 3, y - 10 + py * 4, 3, 4); }
  });
  def("armor", 20, 46, "b", function (c, x, y, t, o) {
    var d = "#6d7384", l = "#a8afc2"; rect(c, "#0d0a14", x - 9, y - 46, 18, 46); rect(c, d, x - 4, y - 46, 8, 7); rect(c, l, x - 3, y - 46, 3, 4); rect(c, "#0d0a14", x - 2, y - 43, 5, 2);
    rect(c, d, x - 8, y - 38, 16, 16); rect(c, l, x - 7, y - 38, 5, 15); rect(c, d, x - 10, y - 38, 4, 12); rect(c, d, x + 6, y - 38, 4, 12); rect(c, d, x - 6, y - 22, 5, 22); rect(c, d, x + 1, y - 22, 5, 22); rect(c, "#8c93a8", x - 7, y - 3, 7, 3); rect(c, "#8c93a8", x, y - 3, 7, 3);
    rect(c, "#5b4a2e", x + 11, y - 46, 2, 44); rect(c, "#c9ced8", x + 10, y - 50, 4, 6);
    if (o.glow) rect(c, "#ff4040", x - 2, y - 43, 5, 2);
  });
  def("shelf", 42, 66, "b", function (c, x, y, t, o) {
    var l = x - 20; blk(c, l, y - 66, 40, 66, "#4a301c"); var rows = [y - 62, y - 42, y - 22], cols = ["#8b2f2f", "#2f5e8b", "#2f7a4a", "#8b6a2f", "#5e2f8b", "#8b4a2f", "#2f8b84"];
    rows.forEach(function (ry, ri) { rect(c, "#1e130b", l + 2, ry + 15, 36, 3); for (var b = 0, bx = l + 3; bx < l + 36; b++) { var bw = 3 + ((b * 5 + ri * 3) % 3), bh = 11 + ((b * 7 + ri) % 5); rect(c, cols[(b + ri * 2) % cols.length], bx, ry + 15 - bh, bw, bh); rect(c, "rgba(255,255,255,.25)", bx, ry + 15 - bh, 1, bh); bx += bw + 1; } });
    if (o.glow) { rect(c, "#a5f3fc", l + 18, y - 52, 3, 12); }
  });
  def("table", 38, 24, "b", function (c, x, y, t, o) {
    var l = x - 18; rect(c, "#0d0a14", l - 1, y - 21, 38, 4); rect(c, "#6a4528", l, y - 20, 36, 3); rect(c, "#8a5d36", l, y - 20, 36, 1); rect(c, "#3f2916", l + 3, y - 17, 4, 17); rect(c, "#3f2916", l + 29, y - 17, 4, 17);
    rect(c, "#d8cbb0", x + 5, y - 28, 10, 8); rect(c, "#8b2f2f", x - 12, y - 25, 9, 5); rect(c, "#e8e0c0", x - 11, y - 24, 7, 1);
    rect(c, "#e8dfc4", x + 20 - 1, y - 28, 3, 8); flame(c, x + 20, y - 28, t, 5, x);
  });
  def("chest", 30, 22, "b", function (c, x, y, t, o) {
    var l = x - 14; if (o.open) { blk(c, l, y - 14, 28, 14, "#7a4a1e"); rect(c, "#2a1306", l + 2, y - 12, 24, 4); rect(c, "#fff1a8", l + 6, y - 12, 16, 2); blk(c, l + 1, y - 26, 26, 11, "#8a5628"); }
    else { blk(c, l, y - 14, 28, 14, "#7a4a1e"); blk(c, l, y - 22, 28, 9, "#8a5628"); rect(c, "#c9a227", l + 11, y - 17, 6, 7); rect(c, "#0d0a14", l + 13, y - 14, 2, 3); }
    rect(c, "#c9a227", l + 3, y - 14, 2, 14); rect(c, "#c9a227", l + 23, y - 14, 2, 14);
    if (o.open) glowSpot(c, x, y - 12, 22, "rgba(255,230,130,A)", 0.5);
  });
  def("door", 36, 60, "b", function (c, x, y, t, o) {
    var l = x - 17; rect(c, "#0d0a14", l - 2, y - 62, 40, 62); rect(c, "#3b3b46", l - 1, y - 60, 38, 60);
    if (o.open) { rect(c, "#06040c", l + 2, y - 56, 30, 56); glowSpot(c, x, y - 28, 36, "rgba(255,220,150,A)", 0.35); rect(c, "#5b3a1f", l + 2, y - 56, 6, 56); rect(c, "#3b2312", l + 6, y - 54, 3, 54); }
    else { rect(c, "#6a4528", l + 2, y - 56, 30, 56); for (var i = 0; i < 4; i++) { rect(c, "#4f3119", l + 2 + i * 8, y - 56, 1, 56); rect(c, "#85572f", l + 3 + i * 8, y - 56, 1, 56); } rect(c, "#2a1a0d", l + 2, y - 40, 30, 3); rect(c, "#2a1a0d", l + 2, y - 18, 30, 3); disc(c, "#6a4528", x, y - 56, 15); rect(c, "#4f3119", l + 2, y - 56, 30, 1);
      rect(c, "#c9a227", l + 22, y - 28, 5, 5); rect(c, "#0d0a14", l + 24, y - 26, 1, 2);
      if (!o.unlocked) { rect(c, "#8a8f9c", l + 4, y - 34, 26, 3); rect(c, "#8a8f9c", l + 4, y - 24, 26, 3); rect(c, "#c9a227", x - 4, y - 32, 9, 9); rect(c, "#0d0a14", x - 1, y - 29, 3, 4); rect(c, "#c9a227", x - 3, y - 36, 7, 5); rect(c, "#6a4528", x - 1, y - 35, 3, 3); } }
    if (o.unlocked && !o.open) glowSpot(c, x, y - 28, 24, "rgba(130,255,170,A)", 0.4);
  });
  def("banner", 18, 44, "c", function (c, x, y, t, o) { var sw = Math.round(Math.sin(t * 1.2 + x) * 1); rect(c, "#2a1d12", x - 10, y - 22, 20, 2); rect(c, o.col || "#7a1f2b", x - 8 + sw, y - 20, 16, 38); rect(c, shade(o.col || "#7a1f2b", -0.3), x - 8 + sw, y - 20, 2, 38); for (var i = 0; i < 4; i++) rect(c, "#d8c27a", x - 5 + sw + (i % 2) * 5, y - 14 + i * 7, 3, 4); rect(c, o.col || "#7a1f2b", x - 8 + sw, y + 18, 5, 5); rect(c, o.col || "#7a1f2b", x + 3 + sw, y + 18, 5, 5); });
  def("skeleton", 22, 34, "b", function (c, x, y, t, o) {
    var b = "#d8d2bc", d = "#9d977f"; rect(c, "#2a2a33", x - 2, y - 34, 4, 3); rect(c, b, x - 4, y - 31, 8, 8); rect(c, "#0d0a14", x - 3, y - 28, 2, 3); rect(c, "#0d0a14", x + 1, y - 28, 2, 3); rect(c, "#0d0a14", x - 1, y - 24, 3, 1);
    rect(c, b, x - 1, y - 23, 2, 14); for (var i = 0; i < 4; i++) rect(c, b, x - 5, y - 21 + i * 3, 10, 1); rect(c, b, x - 9, y - 21, 3, 2); rect(c, b, x - 9, y - 19, 2, 12); rect(c, b, x + 6, y - 21, 3, 2); rect(c, b, x + 7, y - 19, 2, 12);
    rect(c, d, x - 6, y - 9, 12, 2); rect(c, b, x - 6, y - 7, 3, 7); rect(c, b, x + 3, y - 7, 3, 7); rect(c, "#8a8f9c", x - 9, y - 21, 1, 14); rect(c, "#8a8f9c", x + 8, y - 21, 1, 14);
  });
  def("barrel", 18, 22, "b", function (c, x, y, t, o) { blk(c, x - 8, y - 22, 16, 22, "#6a4528"); rect(c, "#3a3a44", x - 8, y - 17, 16, 2); rect(c, "#3a3a44", x - 8, y - 6, 16, 2); rect(c, "rgba(0,0,0,.25)", x - 1, y - 22, 1, 22); });
  def("crate", 22, 20, "b", function (c, x, y, t, o) { blk(c, x - 10, y - 20, 20, 20, o.col || "#6a5030"); rect(c, shade(o.col || "#6a5030", -0.4), x - 10, y - 11, 20, 1); rect(c, shade(o.col || "#6a5030", -0.4), x - 1, y - 20, 1, 20); });
  def("candelabra", 18, 38, "b", function (c, x, y, t, o) { rect(c, "#8a8f9c", x - 1, y - 24, 3, 24); rect(c, "#8a8f9c", x - 5, y - 2, 11, 2); rect(c, "#8a8f9c", x - 7, y - 24, 15, 2); rect(c, "#8a8f9c", x - 7, y - 28, 2, 4); rect(c, "#8a8f9c", x + 6, y - 28, 2, 4); rect(c, "#e8dfc4", x - 7, y - 33, 2, 5); rect(c, "#e8dfc4", x, y - 33, 2, 9); rect(c, "#e8dfc4", x + 6, y - 33, 2, 5); flame(c, x - 6, y - 33, t, 4, 1); flame(c, x + 1, y - 33, t, 5, 2); flame(c, x + 7, y - 33, t, 4, 3); });
  def("cauldron", 28, 24, "b", function (c, x, y, t, o) { disc(c, "#26262e", x, y - 9, 12); rect(c, "#26262e", x - 12, y - 14, 25, 3); rect(c, "#0d0a14", x - 13, y - 15, 27, 1); rect(c, "#5ad66c", x - 10, y - 15, 21, 3); for (var i = 0; i < 3; i++) { var bb = (t * 6 + i * 3) % 9; disc(c, "#9cf5a8", x - 6 + i * 6, y - 15 - bb, 2); } rect(c, "#3a3a44", x - 10, y - 1, 3, 3); rect(c, "#3a3a44", x + 8, y - 1, 3, 3); glowSpot(c, x, y - 18, 20, "rgba(90,230,110,A)", 0.4); });
  def("mirror", 26, 54, "b", function (c, x, y, t, o) { blk(c, x - 11, y - 54, 22, 52, "#6b4a28"); rect(c, "#0d1a26", x - 8, y - 51, 16, 46); rect(c, "#324d6b", x - 8, y - 51, 16, 46); for (var i = 0; i < 6; i++) rect(c, "rgba(255,255,255,.12)", x - 8 + i * 3, y - 51, 2, 46); if (o.flip) { /* a reflection that moves differently */ } rect(c, "rgba(255,255,255,.35)", x - 6, y - 49, 2, 10); rect(c, "#3f2916", x - 7, y - 2, 3, 3); rect(c, "#3f2916", x + 4, y - 2, 3, 3); if (Math.sin(t * 0.6) > 0.8) { rect(c, "#ffffff", x - 3, y - 36, 2, 2); rect(c, "#ffffff", x + 2, y - 36, 2, 2); } });
  def("stained", 32, 50, "c", function (c, x, y, t, o) {
    var l = x - 14, tp = y - 24; rect(c, "#0d0a14", l - 2, tp - 2, 32, 52); var cols = ["#d63a3a", "#2fbf5a", "#3a6bd6", "#e6c43a", "#9b3ad6", "#2fb8c4"];
    for (var py = 0; py < 4; py++) for (var px = 0; px < 3; px++) { rect(c, cols[(px + py * 2) % cols.length], l + px * 9, tp + 6 + py * 10, 8, 9); rect(c, "rgba(255,255,255,.25)", l + px * 9, tp + 6 + py * 10, 8, 1); }
    disc(c, "#e6c43a", x, tp + 6, 13); rect(c, "#0d0a14", x - 14, tp + 6, 28, 1); rect(c, "#0d0a14", x, tp - 6, 1, 48);
    glowSpot(c, x, tp + 20, 34, "rgba(200,160,255,A)", 0.18);
  });
  def("statue", 20, 38, "b", function (c, x, y, t, o) { var s = "#7f8594"; rect(c, "#0d0a14", x - 9, y - 38, 18, 38); rect(c, "#5b6070", x - 8, y - 6, 16, 6); rect(c, s, x - 5, y - 24, 10, 18); rect(c, s, x - 4, y - 34, 8, 9); rect(c, "#5b6070", x - 7, y - 36, 3, 4); rect(c, "#5b6070", x + 4, y - 36, 3, 4); rect(c, s, x - 11, y - 28, 6, 4); rect(c, s, x + 5, y - 28, 6, 4); rect(c, o.glow ? "#ff4a4a" : "#222", x - 3, y - 31, 2, 2); rect(c, o.glow ? "#ff4a4a" : "#222", x + 1, y - 31, 2, 2); rect(c, "rgba(255,255,255,.18)", x - 5, y - 24, 2, 18); });
  def("throne", 44, 66, "b", function (c, x, y, t, o) { blk(c, x - 18, y - 66, 36, 62, "#4a1f2b"); rect(c, "#2a0f18", x - 14, y - 60, 28, 38); rect(c, "#c9a227", x - 18, y - 66, 36, 3); [[-18, -72], [-8, -76], [2, -76], [12, -72]].forEach(function (p) { rect(c, "#c9a227", x + p[0], y + p[1], 5, 8); }); blk(c, x - 20, y - 26, 40, 8, "#6a1f33"); blk(c, x - 22, y - 18, 8, 18, "#5a1a2a"); blk(c, x + 14, y - 18, 8, 18, "#5a1a2a"); rect(c, "#c9a227", x - 3, y - 54, 6, 6); });
  def("cage", 44, 58, "b", function (c, x, y, t, o) { var l = x - 20; rect(c, "#0d0a14", l - 1, y - 56, 42, 58); rect(c, "#10101a", l + 1, y - 54, 38, 54); if (!o.empty) girl(c, x, y - 4, 0, 1, { sad: 1, t: t }); for (var i = 0; i < 8; i++) rect(c, "#6d7384", l + 2 + i * 5, y - 54, 2, 54); rect(c, "#8a8f9c", l, y - 55, 42, 3); rect(c, "#8a8f9c", l, y - 3, 42, 3); rect(c, "#c9a227", x - 3, y - 26, 6, 6); });
  def("clock", 20, 60, "b", function (c, x, y, t, o) { blk(c, x - 9, y - 60, 18, 60, "#4a301c"); disc(c, "#e8dfc4", x, y - 46, 6); rect(c, "#0d0a14", x, y - 51, 1, 5); var a = t * 0.8; rect(c, "#0d0a14", x + Math.round(Math.sin(a) * 3), y - 46 + Math.round(-Math.cos(a) * 3), 1, 1); rect(c, "#0d0a14", x, y - 46, 1, 1); rect(c, "#1e130b", x - 6, y - 36, 12, 28); var sw = Math.round(Math.sin(t * 3) * 4); rect(c, "#c9a227", x + sw - 1, y - 22, 3, 3); rect(c, "#c9a227", x, y - 36, 1, 14); });
  def("fireplace", 46, 44, "b", function (c, x, y, t, o) { blk(c, x - 22, y - 44, 44, 44, "#5a5a66"); rect(c, "#06040c", x - 14, y - 32, 28, 32); for (var i = 0; i < 5; i++) flame(c, x - 10 + i * 5, y - 2, t + i, 10 + (i % 2) * 5, i); rect(c, "#3f2916", x - 12, y - 4, 24, 3); rect(c, "#2a1d12", x - 24, y - 48, 48, 4); glowSpot(c, x, y - 16, 40, "rgba(255,150,60,A)", 0.45); });
  def("coffin", 36, 22, "b", function (c, x, y, t, o) { blk(c, x - 17, y - 20, 34, 20, "#3a2a1c"); rect(c, "#2a1d12", x - 14, y - 17, 28, 14); rect(c, "#c9a227", x - 1, y - 16, 2, 12); rect(c, "#c9a227", x - 5, y - 12, 10, 2); });
  def("skulls", 26, 16, "b", function (c, x, y, t, o) { [[-8, 0], [0, 0], [8, 0], [-4, -6], [4, -6], [0, -11]].forEach(function (p) { rect(c, "#d8d2bc", x + p[0] - 3, y + p[1] - 6, 7, 6); rect(c, "#0d0a14", x + p[0] - 2, y + p[1] - 4, 2, 2); rect(c, "#0d0a14", x + p[0] + 1, y + p[1] - 4, 2, 2); }); });
  def("desk", 40, 26, "b", function (c, x, y, t, o) { var l = x - 19; blk(c, l, y - 14, 38, 4, "#6a4528"); rect(c, "#3f2916", l + 2, y - 10, 4, 10); rect(c, "#3f2916", l + 32, y - 10, 4, 10); rect(c, "#d8cbb0", l + 6, y - 20, 12, 6); rect(c, "#8b8a7a", l + 8, y - 19, 8, 1); rect(c, "#8b8a7a", l + 8, y - 17, 6, 1); rect(c, "#1e1b4b", l + 22, y - 19, 8, 5); rect(c, "#2a2a33", l + 31, y - 24, 2, 10); rect(c, "#e8e0c0", l + 31, y - 28, 2, 4); });
  def("cobweb", 24, 24, "c", function (c, x, y, t, o) { c.fillStyle = "rgba(220,225,240,.5)"; for (var i = 0; i < 12; i++) c.fillRect(x - 12 + i, y - 12 + Math.round(i * 0.4), 1, 1); for (var j = 0; j < 12; j++) c.fillRect(x - 12, y - 12 + j, 1, 1); for (var k = 1; k < 4; k++) for (var m = 0; m < k * 3; m++) c.fillRect(x - 12 + m + k, y - 12 + k * 3 - m, 1, 1); });
  def("rug", 80, 8, "b", function (c, x, y, t, o) { rect(c, o.col || "#6a1f2b", x - 40, y - 6, 80, 7); rect(c, "#c9a227", x - 40, y - 6, 80, 1); rect(c, "#c9a227", x - 40, y, 80, 1); for (var i = 0; i < 8; i++) rect(c, "#d8c27a", x - 34 + i * 10, y - 4, 4, 3); });
  def("chain", 6, 40, "c", function (c, x, y, t, o) { for (var i = 0; i < 10; i++) { rect(c, "#8a8f9c", x - 1 + (i % 2), y - 20 + i * 4, 2, 3); } rect(c, "#8a8f9c", x - 3, y + 18, 6, 4); });
  def("scroll", 22, 12, "b", function (c, x, y, t, o) { rect(c, "#0d0a14", x - 11, y - 11, 22, 12); rect(c, "#e8dfc4", x - 10, y - 10, 20, 9); rect(c, "#c9b88a", x - 10, y - 10, 3, 9); rect(c, "#c9b88a", x + 7, y - 10, 3, 9); for (var i = 0; i < 4; i++) rect(c, "#6b5a3a", x - 5, y - 8 + i * 2, 9 - (i % 2) * 3, 1); });
  def("gargoyle", 20, 22, "c", function (c, x, y, t, o) { rect(c, "#5b6070", x - 8, y - 6, 16, 12); rect(c, "#7f8594", x - 6, y - 10, 12, 10); rect(c, "#5b6070", x - 9, y - 14, 4, 6); rect(c, "#5b6070", x + 5, y - 14, 4, 6); rect(c, "#ff4a4a", x - 4, y - 7, 2, 2); rect(c, "#ff4a4a", x + 2, y - 7, 2, 2); rect(c, "#0d0a14", x - 3, y - 2, 6, 2); });

  /* ---- the network world ---- */
  def("pole", 22, 84, "b", function (c, x, y, t, o) { rect(c, "#2a1d12", x - 2, y - 84, 5, 84); rect(c, "#3f2916", x - 1, y - 84, 2, 84); rect(c, "#2a1d12", x - 12, y - 80, 25, 3); rect(c, "#2a1d12", x - 9, y - 68, 19, 3); [-11, -5, 5, 11].forEach(function (d) { rect(c, "#9fb8c8", x + d, y - 83, 2, 4); rect(c, "#9fb8c8", x + d, y - 71, 2, 4); }); rect(c, "#1a1a22", x - 3, y - 56, 7, 12); rect(c, "#2a2a33", x - 2, y - 54, 5, 3); rect(c, "#3a3a44", x - 3, y - 40, 7, 4); if (Math.floor(t * 2) % 2) rect(c, "#ff4040", x, y - 48, 2, 2); });
  def("lamp", 14, 70, "b", function (c, x, y, t, o) { rect(c, "#2a2a33", x - 1, y - 62, 3, 62); rect(c, "#2a2a33", x - 5, y - 64, 11, 3); var on = Math.sin(t * 9 + x) > -0.6 || o.steady; rect(c, "#3a3a44", x - 6, y - 61, 13, 3); if (on) { rect(c, "#fff0a8", x - 5, y - 58, 11, 2); glowSpot(c, x, y - 50, 30, "rgba(255,240,170,A)", 0.4); } });
  def("mailbox", 16, 24, "b", function (c, x, y, t, o) { rect(c, "#2a1d12", x - 1, y - 12, 3, 12); blk(c, x - 7, y - 22, 14, 10, "#3a5aa0"); rect(c, "#c0392b", x + 7, y - 24, 2, 8); });
  def("router", 32, 22, "b", function (c, x, y, t, o) { var l = x - 15; rect(c, "#2a1d12", l, y - 3, 30, 3); blk(c, l + 1, y - 12, 28, 9, "#2a2e3a"); rect(c, "#5b6070", l + 3, y - 18, 2, 7); rect(c, "#5b6070", l + 25, y - 18, 2, 7); rect(c, "#5b6070", l + 14, y - 20, 2, 9); for (var i = 0; i < 5; i++) { var on = Math.sin(t * (3 + i) + i * 2) > -0.3; rect(c, on ? (i === 4 ? "#ff5050" : "#4ade80") : "#143020", l + 5 + i * 5, y - 8, 2, 2); } });
  def("modem", 20, 22, "b", function (c, x, y, t, o) { var l = x - 9; blk(c, l, y - 18, 18, 18, "#d8d8e0"); rect(c, "#9aa0ae", l + 2, y - 16, 14, 2); for (var i = 0; i < 4; i++) rect(c, Math.sin(t * 2 + i) > -0.2 ? "#4ade80" : "#14532d", l + 3 + i * 3, y - 11, 2, 2); rect(c, "#3b6bd6", l + 4, y - 6, 10, 3); rect(c, "#e8c24a", l + 6, y, 6, 2); });
  def("rack", 28, 64, "b", function (c, x, y, t, o) { var l = x - 12; blk(c, l, y - 64, 24, 64, "#23262f"); for (var i = 0; i < 8; i++) { rect(c, "#0d0f14", l + 2, y - 61 + i * 7, 20, 5); rect(c, "#3a3f4c", l + 2, y - 61 + i * 7, 20, 1); for (var j = 0; j < 4; j++) { var on = Math.sin(t * (2 + j) + i * 3 + j) > 0; rect(c, on ? (j === 3 && i % 3 === 0 ? "#ff5050" : "#4ade80") : "#14301f", l + 4 + j * 3, y - 59 + i * 7, 2, 2); } rect(c, "#5b6070", l + 15, y - 59 + i * 7, 6, 1); } });
  def("monitor", 30, 28, "b", function (c, x, y, t, o) { var l = x - 13; blk(c, l, y - 26, 26, 20, "#2a2e3a"); rect(c, "#04120a", l + 2, y - 24, 22, 15); var seed = Math.floor(t * 5); for (var i = 0; i < 5; i++) { var wv = 4 + ((seed * 7 + i * 11) % 14); rect(c, o.bad ? "#ff4a4a" : "#4ade80", l + 3, y - 22 + i * 3, wv, 1); } if (o.bad) rect(c, "rgba(255,255,255,.12)", l + 2, y - 24 + (Math.floor(t * 30) % 15), 22, 1); rect(c, "#2a2e3a", x - 3, y - 6, 6, 3); rect(c, "#2a2e3a", x - 8, y - 3, 16, 3); glowSpot(c, x, y - 16, 24, o.bad ? "rgba(255,70,70,A)" : "rgba(70,255,140,A)", 0.25); });
  def("cables", 46, 10, "b", function (c, x, y, t, o) { var cols = ["#ef4444", "#3b82f6", "#22c55e", "#facc15", "#f472b6"]; for (var i = 0; i < 5; i++) for (var k = -20; k < 20; k++) rect(c, cols[i], x + k, y - 2 - i + Math.round(Math.sin(k * 0.3 + i) * 2), 2, 2); });
  def("dish", 32, 38, "b", function (c, x, y, t, o) { rect(c, "#5b6070", x - 1, y - 20, 3, 20); rect(c, "#5b6070", x - 6, y - 2, 13, 3); c.fillStyle = "#dfe3ee"; for (var i = -13; i <= 13; i++) { var h = Math.round(Math.sqrt(Math.max(0, 169 - i * i)) * 0.6); c.fillRect(x + i, y - 36 + 8 - h + 7, 1, 2 + (h > 6 ? 0 : 1)); } disc(c, "#cfd5e6", x, y - 28, 11); disc(c, "#8c93a8", x, y - 28, 8); rect(c, "#ff4040", x - 1, y - 33, 2, 5); });
  def("sign", 22, 22, "c", function (c, x, y, t, o) { rect(c, "#2a2a33", x - 1, y + 5, 3, 12); blk(c, x - 10, y - 10, 20, 16, "#d6a40f"); rect(c, "#0d0a14", x - 1, y - 7, 2, 8); rect(c, "#0d0a14", x - 1, y + 3, 2, 2); });
  def("steeldoor", 38, 60, "b", function (c, x, y, t, o) { var l = x - 17; blk(c, l - 1, y - 60, 38, 60, "#4a4f5e"); if (o.open) { rect(c, "#04060c", l + 2, y - 56, 30, 56); glowSpot(c, x, y - 28, 36, "rgba(120,255,200,A)", 0.35); } else { rect(c, "#6b7184", l + 2, y - 56, 30, 56); for (var i = 0; i < 4; i++) rect(c, "#555b6c", l + 3, y - 52 + i * 13, 28, 2); rect(c, "#2a2e3a", l + 22, y - 30, 7, 3); rect(c, o.unlocked ? "#4ade80" : "#ff4a4a", l + 5, y - 52, 5, 5); if (!o.unlocked) { rect(c, "#1e222c", x - 6, y - 32, 12, 12); rect(c, "#ff4a4a", x - 3, y - 29, 6, 1); rect(c, "#ff4a4a", x - 3, y - 26, 6, 1); } } });
  def("generator", 34, 28, "b", function (c, x, y, t, o) { blk(c, x - 16, y - 24, 32, 24, "#b5551d"); rect(c, "#2a2a33", x - 13, y - 21, 12, 14); for (var i = 0; i < 4; i++) rect(c, "#1e1e26", x - 12, y - 20 + i * 3, 10, 1); rect(c, "#facc15", x + 4, y - 20, 8, 5); rect(c, "#0d0a14", x + 6, y - 18, 4, 1); rect(c, "#2a2a33", x + 5, y - 11, 4, 4); rect(c, Math.sin(t * 5) > 0 ? "#ff4040" : "#601010", x + 11, y - 11, 3, 3); });
  def("cabinet", 26, 44, "b", function (c, x, y, t, o) { blk(c, x - 12, y - 44, 24, 44, "#6b7184"); for (var i = 0; i < 3; i++) { rect(c, "#555b6c", x - 10, y - 41 + i * 14, 20, 12); rect(c, "#2a2e3a", x - 3, y - 36 + i * 14, 6, 2); rect(c, "#d8d8e0", x - 8, y - 40 + i * 14, 8, 3); } });
  def("fan", 24, 24, "c", function (c, x, y, t, o) { disc(c, "#2a2e3a", x, y, 11); disc(c, "#12141a", x, y, 9); var a = t * 12; for (var i = 0; i < 4; i++) { var aa = a + i * 1.5708; for (var d = 1; d < 8; d++) rect(c, "#8c93a8", x + Math.round(Math.cos(aa) * d), y + Math.round(Math.sin(aa) * d), 2, 2); } disc(c, "#5b6070", x, y, 2); });
  def("vending", 26, 50, "b", function (c, x, y, t, o) { blk(c, x - 12, y - 50, 24, 50, "#b5251d"); rect(c, "#0d1a26", x - 9, y - 46, 14, 34); for (var i = 0; i < 12; i++) rect(c, ["#3b82f6", "#facc15", "#22c55e", "#f472b6"][i % 4], x - 8 + (i % 3) * 4, y - 44 + Math.floor(i / 3) * 8, 3, 6); rect(c, "#2a2e3a", x + 6, y - 44, 5, 20); rect(c, Math.sin(t * 7) > 0 ? "#fff1a8" : "#6a5a20", x + 7, y - 42, 3, 3); rect(c, "#0d0a14", x - 8, y - 8, 16, 5); });
  def("scales", 30, 40, "b", function (c, x, y, t, o) { rect(c, "#c9a227", x - 1, y - 34, 3, 34); rect(c, "#c9a227", x - 7, y - 2, 15, 3); rect(c, "#c9a227", x - 14, y - 34, 29, 2); [-12, 13].forEach(function (d, i) { rect(c, "#c9a227", x + d, y - 32, 1, 8 + i * 2); rect(c, "#c9a227", x + d - 4, y - 24 + i * 2, 9, 2); }); });
  def("column", 18, 100, "b", function (c, x, y, t, o) { blk(c, x - 8, y - 100, 16, 100, "#9a9fae"); rect(c, "#b9bdca", x - 8, y - 100, 16, 5); rect(c, "#b9bdca", x - 8, y - 6, 16, 6); for (var i = 0; i < 4; i++) rect(c, "#7c8190", x - 5 + i * 3, y - 94, 1, 88); });
  def("billboard", 50, 34, "c", function (c, x, y, t, o) { blk(c, x - 24, y - 16, 48, 28, "#161a26"); var n = Math.floor(t * 4); for (var i = 0; i < 7; i++) rect(c, (n + i) % 5 === 0 ? "#ff4a4a" : "#3b4a6b", x - 21 + i * 6, y - 12 + ((i * 7 + n) % 3) * 6, 5, 4); rect(c, "#0d0a14", x - 20, y + 12, 3, 8); rect(c, "#0d0a14", x + 17, y + 12, 3, 8); });
  def("tv", 30, 26, "b", function (c, x, y, t, o) { blk(c, x - 13, y - 22, 26, 20, "#3a2a1c"); rect(c, "#9aa0ae", x - 10, y - 19, 17, 14); var seed = Math.floor(t * 12); for (var i = 0; i < 40; i++) rect(c, ((i * 7 + seed * 13) % 5) < 2 ? "#e2e8f0" : "#2a2e3a", x - 10 + ((i * 5 + seed) % 17), y - 19 + ((i * 3 + seed * 2) % 14), 1, 1); rect(c, "#5b6070", x - 4, y - 28, 1, 6); rect(c, "#5b6070", x + 4, y - 28, 1, 6); glowSpot(c, x, y - 12, 26, "rgba(200,220,255,A)", 0.25); });
  def("phone", 12, 20, "c", function (c, x, y, t, o) { blk(c, x - 5, y - 8, 10, 14, "#2a2e3a"); rect(c, "#4a5368", x - 3, y - 6, 6, 5); rect(c, "#5b6070", x - 5, y - 11, 10, 3); if (Math.floor(t * 3) % 2) rect(c, "#ff4040", x, y + 1, 2, 2); });
  def("gate", 40, 60, "b", function (c, x, y, t, o) { var l = x - 18; rect(c, "#0d0a14", l - 2, y - 62, 40, 62); if (o.open) { rect(c, "#04060c", l, y - 58, 36, 58); glowSpot(c, x, y - 28, 36, "rgba(120,255,200,A)", 0.35); } else { for (var i = 0; i < 9; i++) { var wob = Math.sin(t * 5 + i) > 0.7 ? 1 : 0; rect(c, "#ff7a1a", l + 1 + i * 4, y - 58, 3, 58 - wob * 2); rect(c, "#ffd24a", l + 2 + i * 4, y - 58, 1, 58); } for (var r = 0; r < 6; r++) rect(c, "#7a2a10", l, y - 56 + r * 10, 36, 2); disc(c, "#3a3a44", x, y - 30, 7); rect(c, "#0d0a14", x - 1, y - 33, 3, 6); glowSpot(c, x, y - 28, 40, "rgba(255,130,40,A)", 0.35); } });
  def("core", 56, 60, "b", function (c, x, y, t, o) { var pulse = 0.5 + Math.sin(t * 3) * 0.5; blk(c, x - 24, y - 56, 48, 56, "#161a26"); rect(c, "#04060c", x - 20, y - 52, 40, 36); for (var i = 0; i < 6; i++) rect(c, i % 2 ? "#14301f" : "#0f2a40", x - 20, y - 52 + i * 6, 40, 3); disc(c, "#ff3b3b", x, y - 34, 11 + Math.round(pulse * 2)); disc(c, "#ffd0d0", x, y - 34, 5); rect(c, "#0d0a14", x - 1, y - 38, 3, 8); for (var j = 0; j < 8; j++) rect(c, Math.sin(t * 4 + j) > 0 ? "#4ade80" : "#14301f", x - 18 + j * 5, y - 12, 3, 3); glowSpot(c, x, y - 34, 40, "rgba(255,60,60,A)", 0.4); });

  function propOf(p) { return PROPS[p.t]; }
  function propBox(p) { var d = propOf(p); if (!d) return null; var y = p.y !== undefined ? p.y : FL + 4; return d.anchor === "b" ? { x: p.x - d.w / 2, y: y - d.h, w: d.w, h: d.h } : { x: p.x - d.w / 2, y: y - d.h / 2, w: d.w, h: d.h }; }
  function drawProp(c, p, t, o) { var d = propOf(p); if (!d) return; var y = p.y !== undefined ? p.y : (d.anchor === "b" ? FL + 4 : 46); d.draw(c, Math.round(p.x), Math.round(y), t, o || {}); }

  /* ============================================================== characters ==== */
  function shadow(c, x, y, w) { c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(Math.round(x - w / 2), Math.round(y - 1), w, 2); c.fillRect(Math.round(x - w / 2 + 1), Math.round(y - 2), w - 2, 1); }
  /* the player: x is the middle, y is the feet. frame 0 stands, 1 and 2 walk. dir 1 faces right. */
  function hero(c, x, y, frame, dir, o) {
    o = o || {}; var P = o.pal || { hair: "#5a3416", skin: "#f1c59a", coat: "#3b82c4", coatD: "#26578a", pant: "#33384f", boot: "#2a1b12", hat: null, vest: null };
    c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1); shadow(c, 0, 0, 14);
    var l1 = frame === 1 ? -2 : frame === 2 ? 2 : 0, l2 = -l1, bob = frame ? (frame === 1 ? -1 : 0) : 0;
    rect(c, P.boot, -4 + l1, -3, 4, 3); rect(c, P.pant, -4 + l1, -9, 4, 6); rect(c, P.boot, 1 + l2, -3, 4, 3); rect(c, P.pant, 1 + l2, -9, 4, 6);
    rect(c, P.coat, -5, -17 + bob, 10, 9); rect(c, P.coatD, -5, -10 + bob, 10, 1); rect(c, P.coatD, 4, -17 + bob, 1, 9);
    if (P.vest) { rect(c, P.vest, -3, -17 + bob, 2, 9); rect(c, P.vest, 1, -17 + bob, 2, 9); rect(c, "#eaeaea", -3, -13 + bob, 2, 1); rect(c, "#eaeaea", 1, -13 + bob, 2, 1); }
    rect(c, P.coat, -7, -16 + bob, 2, 7); rect(c, P.skin, -7, -10 + bob, 2, 2); rect(c, P.coat, 5, -16 + bob, 2, 7); rect(c, P.skin, 5, -10 + bob, 2, 2);
    rect(c, "#0d0a14", -5, -26 + bob, 10, 1); rect(c, P.skin, -4, -25 + bob, 8, 8); rect(c, P.hair, -5, -27 + bob, 10, 4); rect(c, P.hair, -5, -24 + bob, 2, 4);
    if (P.hat) { rect(c, P.hat, -5, -29 + bob, 10, 3); rect(c, shade(P.hat, -0.3), -6, -26 + bob, 12, 1); rect(c, "#fff6a0", 1, -28 + bob, 3, 1); }
    rect(c, "#14101c", 1, -22 + bob, 1, 2); rect(c, "#14101c", 3, -22 + bob, 1, 2); rect(c, "#c4726a", 2, -19 + bob, 2, 1);
    rect(c, "#ffe98a", 7, -12 + bob, 3, 2); if (o.beam) { c.fillStyle = "rgba(255,240,170,.16)"; c.beginPath(); c.moveTo(10, -11 + bob); c.lineTo(34, -20); c.lineTo(34, 0); c.closePath(); c.fill(); }
    if (o.hurt) { c.globalCompositeOperation = "source-atop"; rect(c, "rgba(255,40,40,.6)", -10, -32, 22, 34); }
    c.restore();
  }
  function girl(c, x, y, frame, dir, o) {
    o = o || {}; c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1); shadow(c, 0, 0, 11);
    var b = o.t ? Math.round(Math.sin(o.t * 2) * 0.6) : 0;
    rect(c, "#f1c59a", -3, -4, 2, 4); rect(c, "#f1c59a", 1, -4, 2, 4); rect(c, "#f472b6", -5, -12 + b, 10, 8); rect(c, "#d9559a", -5, -5 + b, 10, 1); rect(c, "#f472b6", -6, -12 + b, 2, 5); rect(c, "#f472b6", 4, -12 + b, 2, 5);
    rect(c, "#f1c59a", -3, -19 + b, 7, 7); rect(c, "#6b3a1a", -4, -21 + b, 9, 4); rect(c, "#6b3a1a", -4, -19 + b, 2, 8); rect(c, "#6b3a1a", 4, -19 + b, 2, 9);
    rect(c, "#14101c", -1, -16 + b, 1, 2); rect(c, "#14101c", 2, -16 + b, 1, 2); if (o.sad) rect(c, "#6ab8ff", 3, -14 + b, 1, 2); else rect(c, "#c4726a", 0, -13 + b, 2, 1);
    c.restore();
  }
  function ghost(c, x, y, t, dir, o) {
    o = o || {}; var a = o.alpha === undefined ? 0.8 : o.alpha, fl = Math.sin(t * 2.5) * 2; y += fl; c.save(); c.globalAlpha = a; c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1);
    rect(c, "#0d0a14", -8, -24, 16, 1); disc(c, "#d6e2ff", 0, -16, 8); rect(c, "#d6e2ff", -8, -16, 17, 14);
    for (var i = 0; i < 5; i++) { var h = 2 + ((i + Math.floor(t * 4)) % 3) * 2; rect(c, "#d6e2ff", -8 + i * 4, -3, 4, h); }
    rect(c, "#0d0a14", -5, -18, 3, 5); rect(c, "#0d0a14", 2, -18, 3, 5); rect(c, "#0d0a14", -2, -9, 4, 4); rect(c, "#ff4a4a", -4, -16, 1, 1); rect(c, "#ff4a4a", 3, -16, 1, 1);
    rect(c, "#d6e2ff", -11, -12 + Math.round(Math.sin(t * 5) * 2), 4, 3); rect(c, "#d6e2ff", 8, -12 + Math.round(Math.cos(t * 5) * 2), 4, 3);
    c.restore();
  }
  function bat(c, x, y, t, o) { var f = Math.floor(t * 12) % 2; c.save(); c.translate(Math.round(x), Math.round(y)); rect(c, "#1a1320", -2, -2, 5, 4); rect(c, "#ff4a4a", -1, -1, 1, 1); rect(c, "#ff4a4a", 1, -1, 1, 1); if (f) { rect(c, "#2a1f38", -8, -5, 6, 3); rect(c, "#2a1f38", 3, -5, 6, 3); rect(c, "#2a1f38", -10, -7, 3, 2); rect(c, "#2a1f38", 8, -7, 3, 2); } else { rect(c, "#2a1f38", -8, 0, 6, 3); rect(c, "#2a1f38", 3, 0, 6, 3); rect(c, "#2a1f38", -10, 2, 3, 2); rect(c, "#2a1f38", 8, 2, 3, 2); } c.restore(); }
  function skel(c, x, y, frame, dir, o) { c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1); shadow(c, 0, 0, 13); var l = frame === 1 ? -2 : frame === 2 ? 2 : 0; var b = "#d8d2bc"; rect(c, b, -4 + l, -9, 2, 9); rect(c, b, 2 - l, -9, 2, 9); rect(c, b, -5, -11, 10, 2); rect(c, b, -1, -20, 2, 9); for (var i = 0; i < 3; i++) rect(c, b, -4, -19 + i * 3, 8, 1); rect(c, b, -7, -20, 2, 9); rect(c, b, 5, -20, 2, 9); rect(c, b, -4, -28, 8, 8); rect(c, "#0d0a14", -3, -26, 2, 3); rect(c, "#0d0a14", 1, -26, 2, 3); rect(c, "#ff4a4a", -3, -25, 1, 1); rect(c, "#ff4a4a", 1, -25, 1, 1); rect(c, "#0d0a14", -2, -21, 4, 1); rect(c, "#a8afc2", 8, -24, 2, 18); c.restore(); }
  function baron(c, x, y, t, o) {
    o = o || {}; c.save(); c.translate(Math.round(x), Math.round(y + Math.round(Math.sin(t * 2) * 1.5))); shadow(c, 0, 0, 30);
    var cape = o.hurt ? "#a02020" : "#1a0f2a"; for (var i = 0; i < 40; i++) { var w = 6 + Math.round(i * 0.5); rect(c, i % 7 === 0 ? "#2a1a40" : cape, -w, -44 + i, w * 2, 1); }
    rect(c, "#7a1f33", -14, -44, 28, 4); rect(c, "#c9a227", -14, -48, 28, 3); rect(c, "#0d0a14", -9, -66, 18, 18); rect(c, "#d8d2bc", -7, -64, 14, 14);
    rect(c, "#c9a227", -9, -70, 18, 4); [[-9, -75], [-4, -77], [1, -77], [6, -75]].forEach(function (p) { rect(c, "#c9a227", p[0], p[1], 3, 5); });
    rect(c, "#ff3b3b", -5, -60, 3, 3); rect(c, "#ff3b3b", 2, -60, 3, 3); rect(c, "#0d0a14", -3, -54, 6, 3); rect(c, "#ffffff", -2, -53, 1, 1); rect(c, "#ffffff", 1, -53, 1, 1);
    rect(c, "#1a0f2a", -20, -42, 6, 18); rect(c, "#d8d2bc", -21, -25, 4, 4); rect(c, "#1a0f2a", 14, -42, 6, 18); rect(c, "#d8d2bc", 17, -25, 4, 4);
    glowSpot(c, 0, -57, 40, "rgba(255,60,90,A)", 0.3); c.restore();
  }
  /* network monsters */
  function staticMon(c, x, y, t, dir, o) {
    o = o || {}; c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1); shadow(c, 0, 0, 14); var rd = rnd(Math.floor(t * 10) + 5);
    for (var i = 0; i < 28; i++) { var off = rd() < 0.3 ? Math.round((rd() - 0.5) * 7) : 0, w = i < 8 ? 8 : i < 20 ? 12 : 9; rect(c, rd() < 0.12 ? "#6ee7ff" : rd() < 0.15 ? "#ff3b8a" : (i % 2 ? "#3a3f4c" : "#2a2e3a"), -w / 2 + off, -30 + i, w, 1); }
    rect(c, "#ffffff", -3, -24, 2, 3); rect(c, "#ffffff", 2, -24, 2, 3); rect(c, "#0d0a14", -2, -23, 1, 1); rect(c, "#0d0a14", 3, -23, 1, 1);
    for (var k = 0; k < 6; k++) rect(c, "#dfe6ff", -6 + k * 2, -15, 1, 2 + (k % 2));
    c.restore();
  }
  function crawler(c, x, y, t, dir, o) { c.save(); c.translate(Math.round(x), Math.round(y)); c.scale(dir < 0 ? -1 : 1, 1); shadow(c, 0, 0, 22); for (var i = 0; i < 9; i++) { var yy = -5 + Math.round(Math.sin(t * 8 + i * 0.9) * 2); rect(c, i % 2 ? "#3b82f6" : "#22c55e", -14 + i * 3, yy, 4, 4); } rect(c, "#ef4444", 12, -8, 6, 6); rect(c, "#ffffff", 15, -7, 2, 2); rect(c, "#0d0a14", 16, -6, 1, 1); rect(c, "#facc15", 15, -3, 2, 3); c.restore(); }
  function coreMon(c, x, y, t, o) { o = o || {}; c.save(); c.translate(Math.round(x), Math.round(y)); var p = Math.sin(t * 3) * 2; disc(c, o.hurt ? "#ffffff" : "#1a0f2a", 0, -34, 22 + p); disc(c, "#ff3b3b", 0, -34, 15); disc(c, "#ffd0d0", 0, -34, 9); rect(c, "#0d0a14", -1, -39, 3, 10); var rd = rnd(Math.floor(t * 8) + 3); for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283 + t, r1 = 24 + rd() * 8; rect(c, i % 2 ? "#6ee7ff" : "#ff3b8a", Math.round(Math.cos(a) * r1), -34 + Math.round(Math.sin(a) * r1), 3, 3); } glowSpot(c, 0, -34, 50, "rgba(255,40,70,A)", 0.4); c.restore(); }
  var SKIN = { tech: { hair: "#3a2a1a", skin: "#e0b08a", coat: "#f97316", coatD: "#b45309", pant: "#2a3350", boot: "#2a1b12", hat: "#facc15", vest: "#fde68a" } };

  /* ============================================================== light and weather ==== */
  function lighting(lc, lights, dark, tint) {
    lc.globalCompositeOperation = "source-over"; lc.clearRect(0, 0, W, H); lc.fillStyle = tint || "rgba(6,3,16,1)"; lc.globalAlpha = dark; lc.fillRect(0, 0, W, H); lc.globalAlpha = 1; lc.globalCompositeOperation = "destination-out";
    lights.forEach(function (l) { var g = lc.createRadialGradient(l.x, l.y, 2, l.x, l.y, l.r); g.addColorStop(0, "rgba(0,0,0," + (l.a === undefined ? 1 : l.a) + ")"); g.addColorStop(0.6, "rgba(0,0,0," + (l.a === undefined ? 1 : l.a) * 0.45 + ")"); g.addColorStop(1, "rgba(0,0,0,0)"); lc.fillStyle = g; lc.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2); });
    lc.globalCompositeOperation = "source-over";
  }
  function dust(c, t, n) { c.fillStyle = "rgba(255,240,200,.35)"; for (var i = 0; i < n; i++) { var x = (i * 53 + t * (3 + (i % 4))) % W, y = (i * 29 + Math.sin(t * 0.7 + i) * 8 + t * 2) % (FL + 20); c.fillRect(Math.round(x), Math.round(y), 1, 1); } }
  function fog(c, t, a) { for (var i = 0; i < 8; i++) { var x = ((i * 47 + t * (4 + (i % 3) * 2)) % (W + 120)) - 60, y = FL - 6 + Math.sin(t * 0.5 + i) * 6 + (i % 3) * 8; c.save(); c.translate(x, y); c.scale(1, 0.3); var g = c.createRadialGradient(0, 0, 2, 0, 0, 52); g.addColorStop(0, "rgba(190,205,225," + (0.2 * a) + ")"); g.addColorStop(1, "rgba(190,205,225,0)"); c.fillStyle = g; c.fillRect(-52, -52, 104, 104); c.restore(); } }
  function rain(c, t, n) { c.fillStyle = "rgba(170,190,230,.55)"; for (var i = 0; i < n; i++) { var x = (i * 37 + t * 40) % (W + 20), y = (i * 61 + t * 190) % H; c.fillRect(Math.round(x - y * 0.15), Math.round(y), 1, 3); } }
  function vignette(c) { var g = c.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 150); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.55)"); c.fillStyle = g; c.fillRect(0, 0, W, H); }

  /* ============================================================== outside scenes (story slides) ==== */
  function exterior(c, t, kind) {
    var rd = rnd(11), x, y;
    if (kind === "castle") {
      for (y = 0; y < H; y++) rect(c, mix("#0a0d24", "#2a1f4a", y / H), 0, y, W, 1);
      for (var s = 0; s < 50; s++) rect(c, "rgba(255,255,255,.7)", Math.floor(rd() * W), Math.floor(rd() * 60), 1, 1);
      disc(c, "#e6ecff", 56, 30, 14); disc(c, "#0a0d24", 62, 27, 12); disc(c, "#b9c4e6", 52, 36, 2);
      rect(c, "#0d0a18", 0, 100, W, 35); for (x = 0; x < W; x += 4) rect(c, "#0d0a18", x, 96 + Math.round(Math.sin(x * 0.08) * 4), 4, 10);
      function tower(tx, tw, th, roof) { rect(c, "#14102a", tx, 100 - th, tw, th); rect(c, "#1c1738", tx, 100 - th, 3, th); for (var m = 0; m < tw; m += 6) rect(c, "#14102a", tx + m, 100 - th - 4, 3, 4); if (roof) { for (var r = 0; r < 14; r++) rect(c, "#2a1f4a", tx - 2 + r, 100 - th - r, tw + 4 - r * 2, 1); } }
      tower(120, 46, 56, false); tower(104, 18, 80, true); tower(166, 20, 70, true); tower(92, 14, 46, false); tower(186, 18, 52, false);
      for (var w = 0; w < 9; w++) { var wx = [112, 126, 140, 152, 108, 172, 128, 146, 190][w], wy = [60, 66, 62, 66, 40, 46, 78, 78, 70][w]; if (Math.sin(t * 2 + w * 2.1) > -0.7) { rect(c, "#ffcf5a", wx, wy, 3, 5); glowSpot(c, wx + 1, wy + 2, 9, "rgba(255,200,90,A)", 0.5); } }
      rect(c, "#0d0a18", 134, 86, 14, 14); rect(c, "#ffb347", 138, 90, 6, 10); rain(c, t, 70);
      if (Math.sin(t * 0.9) > 0.985) rect(c, "rgba(220,230,255,.6)", 0, 0, W, H);
      /* a bat crossing the moon */ bat(c, (t * 22) % (W + 60) - 30, 28 + Math.sin(t * 2) * 6, t);
    } else if (kind === "town") {
      for (y = 0; y < H; y++) rect(c, mix("#1a2030", "#3a4256", y / H), 0, y, W, 1);
      for (var b = 0, bx = 0; bx < W; b++) { var bw = 16 + Math.floor(rd() * 24), bh = 40 + Math.floor(rd() * 55); rect(c, "#10131c", bx, 108 - bh, bw, bh); for (var wy = 108 - bh + 4; wy < 100; wy += 7) for (var wx = bx + 3; wx < bx + bw - 3; wx += 6) if (rd() < 0.12) rect(c, "#f6d56a", wx, wy, 3, 4); bx += bw + 1; }
      rect(c, "#161a26", 0, 108, W, 27); rect(c, "#d6a40f", 0, 118, W, 1);
      fog(c, t, 1.4); rect(c, "#ff4040", 200, 40, 3, 3); rect(c, "#161a26", 199, 40, 1, 68);
    } else if (kind === "dark") { rect(c, "#05030a", 0, 0, W, H); }
    else if (kind === "dawn") { for (y = 0; y < H; y++) rect(c, mix("#1a1650", "#f6a35a", y / H), 0, y, W, 1); disc(c, "#ffe9a8", 120, 96, 18); rect(c, "#0d0a18", 0, 100, W, 35); for (var q = 0; q < 6; q++) rect(c, "#0d0a18", 40 + q * 30, 86 - (q % 3) * 6, 14, 20); }
    else if (kind === "connected") { for (y = 0; y < H; y++) rect(c, mix("#061426", "#0f3b52", y / H), 0, y, W, 1); for (var p = 0; p < 26; p++) { var px = (p * 37 + t * 40) % W, py = 30 + (p * 23) % 80; rect(c, p % 3 ? "#4ade80" : "#6ee7ff", px, py, 4, 2); rect(c, "rgba(110,231,255,.2)", px - 12, py, 12, 1); } for (var bb = 0, bbx = 0; bbx < W; bb++) { var ww = 18 + (bb * 7) % 20, hh = 30 + (bb * 13) % 40; rect(c, "#08111c", bbx, 108 - hh, ww, hh); for (var wy2 = 108 - hh + 4; wy2 < 104; wy2 += 6) for (var wx2 = bbx + 3; wx2 < bbx + ww - 3; wx2 += 5) rect(c, Math.sin(t * 2 + wx2 + wy2) > -0.5 ? "#f6d56a" : "#2a3350", wx2, wy2, 3, 3); bbx += ww + 1; } rect(c, "#08111c", 0, 108, W, 27); }
  }

  window.AdvArt = { W: W, H: H, FL: FL, rect: rect, disc: disc, shade: shade, rnd: rnd, hash: hash, paintRoom: paintRoom, drawProp: drawProp, propBox: propBox, PROPS: PROPS, hero: hero, girl: girl, ghost: ghost, bat: bat, skel: skel, baron: baron, staticMon: staticMon, crawler: crawler, coreMon: coreMon, SKIN: SKIN, lighting: lighting, dust: dust, fog: fog, rain: rain, vignette: vignette, exterior: exterior, glowSpot: glowSpot, flame: flame };
})();
