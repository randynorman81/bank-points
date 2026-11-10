/* Finds the lines of a table in a photo or scan, even when the page is tilted or the photo is taken at an angle.
   Returns the horizontal and vertical lines (each as y = b + k*x or x = b + k*y in full-size pixels) and the four corners of every cell. */
(function (root) {
  "use strict";
  var KMAX = 0.14, KSTEP = 0.004;

  function detect(canvas) {
    var W0 = canvas.width, H0 = canvas.height, s = Math.min(1, 900 / W0), W = Math.round(W0 * s), H = Math.round(H0 * s);
    var c = document.createElement("canvas"); c.width = W; c.height = H; var cx = c.getContext("2d"); cx.drawImage(canvas, 0, 0, W, H);
    var d = cx.getImageData(0, 0, W, H).data, g = new Float32Array(W * H), i, X, Y;
    for (i = 0; i < W * H; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    /* "ink" = darker than the area around it (works for faint gray lines and uneven lighting) */
    var r = Math.max(6, Math.round(W * 0.012)), I = new Float64Array((W + 1) * (H + 1)), ink = new Uint8Array(W * H), pts = [];
    for (Y = 0; Y < H; Y++) { var rs = 0; for (X = 0; X < W; X++) { rs += g[Y * W + X]; I[(Y + 1) * (W + 1) + X + 1] = I[Y * (W + 1) + X + 1] + rs; } }
    for (Y = 0; Y < H; Y++) { var y0 = Math.max(0, Y - r), y1 = Math.min(H, Y + r + 1); for (X = 0; X < W; X++) { var x0 = Math.max(0, X - r), x1 = Math.min(W, X + r + 1), sum = I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0]; if (sum / ((x1 - x0) * (y1 - y0)) - g[Y * W + X] > 11) { ink[Y * W + X] = 1; pts.push(X, Y); } } }
    var hs = findLines(pts, ink, W, H, "h"), vs = findLines(pts, ink, W, H, "v");
    root.GridLines = root.GridLines || {}; root.GridLines.last = { hs: hs.slice(), vs: vs.slice(), W: W, H: H, ink: pts.length / 2 };
    /* the table's vertical lines all run the same stretch, so take the biggest group that does (this drops the paper edge, the desk, rulers) */
    var seed = null, members = [];
    vs.forEach(function (v) { var m = vs.filter(function (o) { return Math.abs(o.t0 - v.t0) < 0.07 * H && Math.abs(o.t1 - v.t1) < 0.07 * H; }); if (m.length > members.length || (m.length === members.length && seed && v.votes > seed.votes)) { members = m; seed = v; } });
    if (members.length < 3) return null;
    vs = members; var yA = median(vs.map(function (v) { return v.t0; })), yB = median(vs.map(function (v) { return v.t1; })), xm = (yA + yB) / 2;
    var xs = vs.map(function (v) { return v.b + v.k * xm; }), xL = Math.min.apply(null, xs), xR = Math.max.apply(null, xs);
    /* horizontal lines: inside that stretch and drawn across most of the table's width */
    hs = hs.filter(function (h) {
      var yc = h.b + h.k * ((xL + xR) / 2); if (yc < yA - 0.03 * H || yc > yB + 0.03 * H) return false;
      var hit = 0, n = 0, t, d; for (t = Math.round(xL); t <= Math.round(xR); t++) { n++; var yy = Math.round(h.b + h.k * t), ok = false; for (d = -2; d <= 2 && !ok; d++) { var q = yy + d; if (q >= 0 && q < H && t >= 0 && t < W && ink[q * W + t]) ok = true; } if (ok) hit++; }
      return n > 0 && hit / n >= 0.6;
    });
    if (hs.length < 3 || vs.length < 3) return null;
    hs.sort(function (a, b) { return (a.b + a.k * W / 2) - (b.b + b.k * W / 2); }); vs.sort(function (a, b) { return (a.b + a.k * H / 2) - (b.b + b.k * H / 2); });
    /* back to full-size pixels */
    var up = function (l) { return { k: l.k, b: l.b / s, t0: l.t0 / s, t1: l.t1 / s }; }; hs = hs.map(up); vs = vs.map(up);
    var cells = [], a, b2;
    for (a = 0; a < hs.length - 1; a++) { var row = []; for (b2 = 0; b2 < vs.length - 1; b2++) row.push([ix(hs[a], vs[b2]), ix(hs[a], vs[b2 + 1]), ix(hs[a + 1], vs[b2 + 1]), ix(hs[a + 1], vs[b2])]); cells.push(row); }
    return { h: hs, v: vs, cells: cells, scale: s };
  }
  function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
  function ix(h, v) { var x = (v.b + v.k * h.b) / (1 - v.k * h.k), y = h.b + h.k * x; return { x: x, y: y }; }
  function crosses(h, v) { /* small-scale coordinates */
    var p = ix(h, v), tol = 18; return p.x >= h.t0 - tol && p.x <= h.t1 + tol && p.y >= v.t0 - tol && p.y <= v.t1 + tol;
  }
  /* Hough vote for near-horizontal (y = b + k*x) or near-vertical (x = b + k*y) lines */
  function findLines(pts, ink, W, H, orient) {
    var nk = Math.round(2 * KMAX / KSTEP) + 1, along = orient === "h" ? W : H, across = orient === "h" ? H : W, off = Math.ceil(KMAX * along) + 2, B = across + 2 * off;
    var votes = new Uint16Array(nk * B), ki, p, k, bi;
    for (p = 0; p < pts.length; p += 2) {
      var u = orient === "h" ? pts[p] : pts[p + 1], v = orient === "h" ? pts[p + 1] : pts[p];
      for (ki = 0; ki < nk; ki++) { k = -KMAX + ki * KSTEP; bi = Math.round(v - k * (u - along / 2)) + off; votes[ki * B + bi]++; }
    }
    var P = new Uint16Array(B), PK = new Int16Array(B), best = 0, bb;
    for (bb = 0; bb < B; bb++) { var m = 0, mk = 0; for (ki = 0; ki < nk; ki++) { var vv = votes[ki * B + bb]; if (vv > m) { m = vv; mk = ki; } } P[bb] = m; PK[bb] = mk; if (m > best) best = m; }
    var thr = Math.max(0.3 * best, 0.15 * along), peaks = [], used = new Uint8Array(B);
    for (;;) {
      var bi2 = -1, bv = 0; for (bb = 0; bb < B; bb++) if (!used[bb] && P[bb] > bv) { bv = P[bb]; bi2 = bb; }
      if (bi2 < 0 || bv < thr || peaks.length >= 60) break;
      for (bb = Math.max(0, bi2 - 7); bb <= Math.min(B - 1, bi2 + 7); bb++) used[bb] = 1;
      var kk = -KMAX + PK[bi2] * KSTEP; peaks.push({ k: kk, b: (bi2 - off) - kk * along / 2, votes: bv });
    }
    var out = [];
    peaks.forEach(function (l) {
      var ext = extent(l, ink, W, H, orient); if (ext && ext.t1 - ext.t0 >= 0.2 * along) { l.t0 = ext.t0; l.t1 = ext.t1; out.push(l); }
    });
    return out;
  }
  /* the longest unbroken stretch of ink along the line */
  function extent(l, ink, W, H, orient) {
    var along = orient === "h" ? W : H, across = orient === "h" ? H : W, run0 = -1, last = -1, bestA = 0, bestB = 0, t, d, gap = 9;
    for (t = 0; t < along; t++) {
      var pos = Math.round(l.b + l.k * t), hit = false;
      for (d = -2; d <= 2 && !hit; d++) { var q = pos + d; if (q < 0 || q >= across) continue; if (ink[orient === "h" ? q * W + t : t * W + q]) hit = true; }
      if (hit) { if (run0 < 0) run0 = t; last = t; }
      else if (run0 >= 0 && t - last > gap) { if (last - run0 > bestB - bestA) { bestA = run0; bestB = last; } run0 = -1; }
    }
    if (run0 >= 0 && last - run0 > bestB - bestA) { bestA = run0; bestB = last; }
    return bestB > bestA ? { t0: bestA, t1: bestB } : null;
  }
  var prev = root.GridLines || {}; root.GridLines = { detect: detect, ix: ix, last: prev.last };
})(window);
