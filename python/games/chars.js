/* Cartoon characters drawn on a canvas (used by the Cartoon Cast Director game). Same four kinds as the toonlab Python library. */
(function () {
  "use strict";
  var INK = "#1e1832";
  var CAST = { Bolt: ["robot", "#fb923c"], Pixel: ["cat", "#f472b6"], Zed: ["alien", "#4ade80"], Mochi: ["blob", "#fbbf24"], Nova: ["robot", "#38bdf8"], Luna: ["cat", "#c4b5fd"], Blip: ["alien", "#a3e635"], Gus: ["blob", "#f87171"] };

  /* (x, y) is the middle of the head, size is the head width */
  function draw(c, kind, x, y, color, mood, size) {
    var r = size / 2;
    c.save(); c.lineWidth = Math.max(2, size / 22); c.strokeStyle = INK; c.fillStyle = color; c.lineCap = "round";
    /* body and legs */
    c.beginPath(); c.ellipse(x, y + r * 1.9, r * 0.55, r * 0.95, 0, 0, 6.2832); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x - r * 0.5, y + r * 1.3); c.lineTo(x - r * 1.1, y + r * 1.9); c.moveTo(x + r * 0.5, y + r * 1.3); c.lineTo(x + r * 1.1, y + r * 1.9); c.stroke();
    c.beginPath(); c.moveTo(x - r * 0.25, y + r * 2.75); c.lineTo(x - r * 0.4, y + r * 3.3); c.moveTo(x + r * 0.25, y + r * 2.75); c.lineTo(x + r * 0.4, y + r * 3.3); c.stroke();
    if (kind === "robot") {
      c.beginPath(); c.moveTo(x, y - r); c.lineTo(x, y - r * 1.4); c.stroke();
      c.fillStyle = "#ef4444"; c.beginPath(); c.arc(x, y - r * 1.5, r * 0.14, 0, 6.2832); c.fill(); c.stroke(); c.fillStyle = color;
      rr(c, x - r, y - r, r * 2, r * 2, r * 0.25); c.fill(); c.stroke();
    } else if (kind === "cat") {
      c.beginPath(); c.moveTo(x - r, y - r * 0.3); c.lineTo(x - r * 0.55, y - r * 1.45); c.lineTo(x - r * 0.05, y - r * 0.85); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(x + r, y - r * 0.3); c.lineTo(x + r * 0.55, y - r * 1.45); c.lineTo(x + r * 0.05, y - r * 0.85); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); c.stroke();
      c.lineWidth = Math.max(1.5, size / 40); c.beginPath(); c.moveTo(x - r * 1.35, y + r * 0.25); c.lineTo(x - r * 0.6, y + r * 0.2); c.moveTo(x - r * 1.3, y + r * 0.5); c.lineTo(x - r * 0.6, y + r * 0.35); c.moveTo(x + r * 1.35, y + r * 0.25); c.lineTo(x + r * 0.6, y + r * 0.2); c.moveTo(x + r * 1.3, y + r * 0.5); c.lineTo(x + r * 0.6, y + r * 0.35); c.stroke(); c.lineWidth = Math.max(2, size / 22);
    } else if (kind === "alien") {
      c.beginPath(); c.moveTo(x - r * 0.5, y - r * 0.9); c.lineTo(x - r * 0.75, y - r * 1.5); c.moveTo(x + r * 0.5, y - r * 0.9); c.lineTo(x + r * 0.75, y - r * 1.5); c.stroke();
      c.fillStyle = "#a3e635"; c.beginPath(); c.arc(x - r * 0.75, y - r * 1.55, r * 0.15, 0, 6.2832); c.fill(); c.stroke(); c.beginPath(); c.arc(x + r * 0.75, y - r * 1.55, r * 0.15, 0, 6.2832); c.fill(); c.stroke(); c.fillStyle = color;
      c.beginPath(); c.ellipse(x, y, r * 1.05, r * 1.1, 0, 0, 6.2832); c.fill(); c.stroke();
    } else { c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); c.stroke(); }
    /* face */
    var e = Math.max(2.5, r * 0.17);
    c.fillStyle = INK;
    [-1, 1].forEach(function (s) {
      var ex = x + s * r * 0.45, ey = y - r * 0.2;
      if (mood === "sleepy") { c.beginPath(); c.moveTo(ex - e * 1.4, ey); c.lineTo(ex + e * 1.4, ey); c.stroke(); }
      else if (mood === "surprised") { c.fillStyle = "#fff"; c.beginPath(); c.arc(ex, ey, e * 1.5, 0, 6.2832); c.fill(); c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(ex, ey, e * 0.7, 0, 6.2832); c.fill(); }
      else { c.beginPath(); c.arc(ex, ey, e, 0, 6.2832); c.fill(); }
    });
    if (mood === "angry") { c.beginPath(); c.moveTo(x - r * 0.85, y - r * 0.6); c.lineTo(x - r * 0.2, y - r * 0.35); c.moveTo(x + r * 0.85, y - r * 0.6); c.lineTo(x + r * 0.2, y - r * 0.35); c.stroke(); }
    var my = y + r * 0.45; c.beginPath();
    if (mood === "sad") c.arc(x, my + r * 0.3, r * 0.3, 3.4, 6.0); else if (mood === "surprised") c.ellipse(x, my, r * 0.14, r * 0.2, 0, 0, 6.2832); else if (mood === "angry") { c.moveTo(x - r * 0.28, my + 2); c.lineTo(x + r * 0.28, my + 2); } else if (mood === "sleepy") c.arc(x, my, r * 0.1, 0, 6.2832); else c.arc(x, my - r * 0.1, r * 0.34, 0.3, 2.85);
    c.stroke(); c.restore();
  }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  /* a little square canvas with one character in it */
  function icon(name, px, mood) {
    var cv = document.createElement("canvas"), s = px || 96; cv.width = s; cv.height = s;
    var k = CAST[name] || ["blob", "#fbbf24"], c = cv.getContext("2d");
    draw(c, k[0], s / 2, s * 0.25, k[1], mood || "happy", s * 0.42);
    return cv;
  }
  window.Chars = { draw: draw, icon: icon, CAST: CAST, rr: rr };
})();
