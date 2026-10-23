/* Drawing code for the SCHS Arduino editor: turns parts and wires into SVG, and updates the lights and sounds of a solved circuit.
   Used by the editor and by the teacher's grading page. */
(function (root) {
  "use strict";
  var C = root.ArduinoCircuit, P = C.P;
  var LED_COLORS = { red: "#ef4444", yellow: "#facc15", green: "#22c55e", blue: "#3b82f6", white: "#f1f5f9", orange: "#fb923c" };
  var WIRE_COLORS = { red: "#e11d48", black: "#1f2937", green: "#16a34a", blue: "#2563eb", yellow: "#eab308", orange: "#f97316", white: "#e5e7eb", purple: "#9333ea" };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function attrT(part) { return "translate(" + part.x + " " + part.y + ")" + (part.rot ? " rotate(" + (((part.rot % 4) + 4) % 4) * 90 + ")" : ""); }

  /* ---------- the breadboard */
  function breadboardSVG(part) {
    var b = C.breadboardInfo(part.props && part.props.size), s = "", c, k, i, holes = "";
    s += '<rect x="0" y="0" width="' + b.w + '" height="' + b.h + '" rx="7" fill="#e7e2d3" stroke="#b9b29d" stroke-width="1.5"/>';
    var yc1 = b.yTop + 4 * P + 4, yc2 = b.yLow - 4;
    s += '<rect x="8" y="' + yc1 + '" width="' + (b.w - 16) + '" height="' + (yc2 - yc1) + '" rx="2" fill="#cfc9b6"/>';
    s += '<line x1="12" y1="' + (b.yRail1 - 8) + '" x2="' + (b.w - 12) + '" y2="' + (b.yRail1 - 8) + '" stroke="#e11d48" stroke-width="1.6"/>';
    s += '<line x1="12" y1="' + (b.yRail2 + 8) + '" x2="' + (b.w - 12) + '" y2="' + (b.yRail2 + 8) + '" stroke="#2563eb" stroke-width="1.6"/>';
    s += '<line x1="12" y1="' + (b.yBot1 - 8) + '" x2="' + (b.w - 12) + '" y2="' + (b.yBot1 - 8) + '" stroke="#e11d48" stroke-width="1.6"/>';
    s += '<line x1="12" y1="' + (b.yBot2 + 8) + '" x2="' + (b.w - 12) + '" y2="' + (b.yBot2 + 8) + '" stroke="#2563eb" stroke-width="1.6"/>';
    s += '<text x="12" y="' + (b.yRail1 + 3) + '" font-size="9" fill="#e11d48" font-weight="700">+</text><text x="12" y="' + (b.yRail2 + 3) + '" font-size="9" fill="#2563eb" font-weight="700">&#8722;</text>';
    s += '<text x="12" y="' + (b.yBot1 + 3) + '" font-size="9" fill="#e11d48" font-weight="700">+</text><text x="12" y="' + (b.yBot2 + 3) + '" font-size="9" fill="#2563eb" font-weight="700">&#8722;</text>';
    var rowsAll = C.ROWS_U.concat(C.ROWS_L);
    for (i = 0; i < 5; i++) { s += '<text x="' + (b.x0 - 16) + '" y="' + (b.yTop + i * P + 3) + '" font-size="8" fill="#6b6657" text-anchor="middle">' + C.ROWS_U[i] + '</text><text x="' + (b.x0 - 16) + '" y="' + (b.yLow + i * P + 3) + '" font-size="8" fill="#6b6657" text-anchor="middle">' + C.ROWS_L[i] + '</text>'; }
    for (c = 1; c <= b.cols; c++) { if (c === 1 || c % 5 === 0) s += '<text x="' + (b.x0 + (c - 1) * P) + '" y="' + (b.yTop - 8) + '" font-size="8" fill="#6b6657" text-anchor="middle">' + c + '</text>'; }
    /* holes in one path */
    for (c = 0; c < b.cols; c++) for (i = 0; i < 5; i++) { holes += "M" + (b.x0 + c * P - 2.6) + " " + (b.yTop + i * P - 2.6) + "h5.2v5.2h-5.2z"; holes += "M" + (b.x0 + c * P - 2.6) + " " + (b.yLow + i * P - 2.6) + "h5.2v5.2h-5.2z"; }
    for (k = 0; k < b.rails; k++) { var rx = C.railX(b, k); [b.yRail1, b.yRail2, b.yBot1, b.yBot2].forEach(function (y) { holes += "M" + (rx - 2.6) + " " + (y - 2.6) + "h5.2v5.2h-5.2z"; }); }
    s += '<path d="' + holes + '" fill="#34312a"/>';
    return s;
  }

  /* ---------- the Arduino Uno */
  function unoSVG() {
    var W = C.UNO_W, H = C.UNO_H, s = "", terms = C.PARTS.uno.terms();
    s += '<g data-uno-part="usb"><rect x="-16" y="30" width="46" height="36" rx="2" fill="#c7cbd3" stroke="#8d93a0"/><rect x="-10" y="36" width="30" height="24" fill="#9aa0ac"/><text x="4" y="52" font-size="6" fill="#444" text-anchor="middle">USB</text></g>';
    s += '<g data-uno-part="jack"><rect x="-12" y="118" width="38" height="40" rx="3" fill="#1b1e24"/><circle cx="8" cy="138" r="9" fill="#2c3038"/><circle cx="8" cy="138" r="3" fill="#0a0b0e"/></g>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="9" fill="#0b7285" stroke="#064f5d" stroke-width="2"/>';
    s += '<rect x="6" y="6" width="' + (W - 12) + '" height="' + (H - 12) + '" rx="6" fill="none" stroke="#0e8aa0" stroke-width="1"/>';
    s += '<circle cx="14" cy="14" r="4" fill="#06323b"/><circle cx="14" cy="' + (H - 14) + '" r="4" fill="#06323b"/><circle cx="' + (W - 12) + '" cy="14" r="4" fill="#06323b"/><circle cx="' + (W - 12) + '" cy="' + (H - 14) + '" r="4" fill="#06323b"/>';
    s += '<g data-uno-part="chip"><rect x="122" y="76" width="92" height="30" rx="2" fill="#15171c"/><circle cx="130" cy="91" r="3" fill="#0a0b0e"/><text x="168" y="95" font-size="7" fill="#aab" text-anchor="middle">ATMEGA328P</text></g>';
    /* every other part on a real Uno */
    s += '<g data-uno-part="usbchip"><rect x="62" y="56" width="26" height="26" rx="2" fill="#15171c"/><circle cx="67" cy="61" r="2" fill="#0a0b0e"/><text x="75" y="72" font-size="5.5" fill="#aab" text-anchor="middle">16U2</text></g>';
    s += '<g data-uno-part="usbxtal"><rect x="94" y="62" width="12" height="7" rx="3" fill="#cbd0d8" stroke="#8d93a0"/></g>';
    s += '<g data-uno-part="fuse"><rect x="34" y="38" width="14" height="8" rx="1" fill="#c9a227" stroke="#7a6212"/><text x="41" y="44.5" font-size="5" fill="#3b2f06" text-anchor="middle">F</text></g>';
    s += '<g data-uno-part="xtal"><rect x="146" y="112" width="28" height="10" rx="5" fill="#cbd0d8" stroke="#8d93a0"/><text x="160" y="119.5" font-size="5.5" fill="#444" text-anchor="middle">16MHz</text></g>';
    s += '<g data-uno-part="caps"><circle cx="40" cy="134" r="7" fill="#1f2937" stroke="#4b5563"/><rect x="36" y="128" width="3" height="12" fill="#d1d5db"/><circle cx="40" cy="152" r="7" fill="#1f2937" stroke="#4b5563"/><rect x="36" y="146" width="3" height="12" fill="#d1d5db"/></g>';
    s += '<g data-uno-part="reg5"><rect x="54" y="130" width="18" height="14" rx="1" fill="#15171c"/><rect x="56" y="125" width="14" height="5" fill="#9aa0ac"/><text x="63" y="140" font-size="5" fill="#aab" text-anchor="middle">5V</text></g>';
    s += '<g data-uno-part="reg33"><rect x="82" y="132" width="12" height="9" rx="1" fill="#15171c"/><text x="88" y="139" font-size="4.5" fill="#aab" text-anchor="middle">3.3</text></g>';
    s += '<g data-uno-part="diode"><rect x="58" y="150" width="14" height="6" rx="1" fill="#15171c"/><rect x="69" y="150" width="2" height="6" fill="#cbd0d8"/></g>';
    var ic = [["MISO", 0, 0], ["5V", 6, 0], ["SCK", 0, 6], ["MOSI", 6, 6], ["RESET", 0, 12], ["GND", 6, 12]];
    function icsp(ox, oy, key, label) { s += '<rect x="' + (ox - 4) + '" y="' + (oy - 4) + '" width="14" height="24" rx="1.5" fill="#16181d" data-uno-part="' + key + '"/><text x="' + (ox + 3) + '" y="' + (oy + 30) + '" font-size="5" fill="#d7eef2" text-anchor="middle">' + label + '</text>'; ic.forEach(function (p) { s += '<rect x="' + (ox + p[1] - 2) + '" y="' + (oy + p[2] - 2) + '" width="4" height="4" fill="#d4af37" data-uno-part="' + key + '-' + p[0].toLowerCase() + '"/>'; }); }
    icsp(272, 92, "icsp", "ICSP"); icsp(36, 62, "icsp2", "ICSP");
    s += '<g data-uno-part="reset"><circle cx="52" cy="100" r="9" fill="#d1d5db" stroke="#6b7280"/><circle cx="52" cy="100" r="5.5" fill="#dc2626"/></g><text x="52" y="120" font-size="6.5" fill="#cfe9ee" text-anchor="middle">RESET</text>';
    s += '<text x="150" y="150" font-size="13" font-weight="800" fill="#fff" letter-spacing="1" text-anchor="middle">ARDUINO UNO</text>';
    /* headers */
    var topT = terms.filter(function (t) { return t.y < 40; }), botT = terms.filter(function (t) { return t.y > 100; });
    function hdr(list, y, groupSplit) {
      var g = [], cur = [], prev = null; list.forEach(function (t) { if (prev !== null && t.x - prev > P * 1.5) { g.push(cur); cur = []; } cur.push(t); prev = t.x; }); g.push(cur);
      g.forEach(function (grp) { s += '<rect x="' + (grp[0].x - 7) + '" y="' + (y - 8) + '" width="' + (grp[grp.length - 1].x - grp[0].x + 14) + '" height="16" rx="2" fill="#16181d"/>'; });
    }
    hdr(topT, 14); hdr(botT, H - 14);
    terms.forEach(function (t) {
      s += '<rect x="' + (t.x - 2.6) + '" y="' + (t.y - 2.6) + '" width="5.2" height="5.2" fill="#d4af37"/>';
      var n = C.pinNumber(t.id), label = n !== null ? (n >= 14 ? "A" + (n - 14) : ({ 3: "~3", 5: "~5", 6: "~6", 9: "~9", 10: "~10", 11: "~11" }[n] || String(n))) : t.id.replace(/_.*/, "").replace("NC", "");
      if (t.id === "IOREF") label = "IOREF"; if (t.id === "3V3") label = "3.3V";
      var top = t.y < 40; s += '<text x="' + t.x + '" y="' + (top ? t.y + 16 : t.y - 10) + '" font-size="6.2" fill="#d7eef2" text-anchor="middle">' + esc(label) + '</text>';
    });
    s += '<text x="88" y="42" font-size="6.5" fill="#bfe6ee" text-anchor="middle">DIGITAL (PWM ~)</text><text x="238" y="' + (H - 34) + '" font-size="6.5" fill="#bfe6ee" text-anchor="middle">ANALOG IN</text><text x="152" y="' + (H - 34) + '" font-size="6.5" fill="#bfe6ee" text-anchor="middle">POWER</text>';
    /* the little lights */
    s += '<rect x="132" y="36" width="9" height="5" rx="1" fill="#7c4a0a" data-uno="L" data-uno-part="ledl"/><text x="136.5" y="50" font-size="6" fill="#d7eef2" text-anchor="middle">L</text>';
    s += '<rect x="146" y="36" width="9" height="5" rx="1" fill="#6b5a05" data-uno="TX" data-uno-part="ledtx"/><text x="150.5" y="50" font-size="6" fill="#d7eef2" text-anchor="middle">TX</text>';
    s += '<rect x="160" y="36" width="9" height="5" rx="1" fill="#6b5a05" data-uno="RX" data-uno-part="ledrx"/><text x="164.5" y="50" font-size="6" fill="#d7eef2" text-anchor="middle">RX</text>';
    s += '<rect x="186" y="36" width="9" height="5" rx="1" fill="#16a34a" data-uno="ON" data-uno-part="ledon"/><text x="190.5" y="50" font-size="6" fill="#d7eef2" text-anchor="middle">ON</text>';
    return s;
  }

  /* ---------- little parts */
  function legDots(part) {
    return C.worldTerms(part).map(function (t) { var lt = C.PARTS[part.type].terms(part).filter(function (x) { return x.id === t.id; })[0]; return '<circle cx="' + lt.x + '" cy="' + lt.y + '" r="2.6" fill="#22c55e" data-leg="' + part.id + ":" + t.id + '"/>'; }).join("");
  }
  function ledSVG(part) {
    var col = LED_COLORS[(part.props && part.props.color) || "red"] || "#ef4444";
    var s = '<circle cx="6" cy="-44" r="28" fill="' + col + '" opacity="0" data-glow="' + part.id + '" style="filter:blur(8px)"/>';
    /* the two legs: the anode (+) is the longer one and has a bend; the cathode (-) is the shorter, straight one */
    s += '<path d="M0,0 L0,-9 L-4,-14 L-4,-24" fill="none" stroke="#0b0b0b" stroke-width="2.8" stroke-linejoin="round" data-legline="A"/>';
    s += '<path d="M12,0 L12,-24" fill="none" stroke="#0b0b0b" stroke-width="2.8" data-legline="K"/>';
    s += '<path d="M-6,-26 L-6,-44 A12,12 0 0 1 18,-44 L18,-26 Z" fill="' + col + '" fill-opacity="0.55" stroke="' + col + '" stroke-width="1.2" data-ledbody="' + part.id + '"/>';
    s += '<rect x="-8" y="-28" width="28" height="4" rx="1.5" fill="' + col + '" fill-opacity="0.85"/>';
    s += '<path d="M19.5,-27 L19.5,-34" stroke="#0b1220" stroke-width="1.5" opacity=".55"/>';              /* the flat edge on the cathode side */
    s += '<path d="M-1,-30 L-1,-42 M2,-30 L2,-34" stroke="#fff" stroke-opacity="0.5" stroke-width="1.4" fill="none"/>';
    s += '<g data-burn="' + part.id + '" style="display:none"><path d="M-3,-46 L15,-30 M15,-46 L-3,-30" stroke="#111" stroke-width="2.6"/></g>';
    s += '<text x="-12" y="-6" font-size="11" font-weight="800" fill="#fb7185" text-anchor="middle" stroke="#0b1220" stroke-width="2.4" paint-order="stroke">+</text>';
    s += '<text x="20" y="-6" font-size="12" font-weight="800" fill="#60a5fa" text-anchor="middle" stroke="#0b1220" stroke-width="2.4" paint-order="stroke">&#8722;</text>';
    return s + legDots(part);
  }
  function resistorSVG(part) {
    var ohms = +(part.props && part.props.ohms) || 220, b = C.bands(ohms), sp = Math.max(3, Math.min(12, Math.round(+(part.props && part.props.span) || 4))), len = sp * P, mid = len / 2, x0 = mid - 16, x1 = mid + 16;
    var s = '<line x1="0" y1="0" x2="' + (x0 + 2) + '" y2="0" stroke="#cbd5e1" stroke-width="2"/><line x1="' + (x1 - 2) + '" y1="0" x2="' + len + '" y2="0" stroke="#cbd5e1" stroke-width="2"/>';
    s += '<path d="M' + x0 + ',-5 Q' + x0 + ',-7 ' + (x0 + 4) + ',-7 L' + (x1 - 4) + ',-7 Q' + x1 + ',-7 ' + x1 + ',-5 L' + x1 + ',5 Q' + x1 + ',7 ' + (x1 - 4) + ',7 L' + (x0 + 4) + ',7 Q' + x0 + ',7 ' + x0 + ',5 Z" fill="#d9c28f" stroke="#a88f55"/>';
    s += '<rect x="' + (x0 + 6) + '" y="-7" width="4" height="14" fill="' + b[0] + '"/><rect x="' + (x0 + 13) + '" y="-7" width="4" height="14" fill="' + b[1] + '"/><rect x="' + (x0 + 20) + '" y="-7" width="4" height="14" fill="' + b[2] + '"/><rect x="' + (x0 + 26.5) + '" y="-7" width="3" height="14" fill="#d4a017"/>';
    s += '<text x="' + mid + '" y="-11" font-size="8" fill="#e5e7eb" text-anchor="middle" font-weight="700" data-reslabel="1">' + C.ohmsText(ohms) + '&#937;</text>';
    return s + legDots(part);
  }
  function buttonSVG(part) {
    var s = '<rect x="-8" y="-8" width="40" height="52" rx="4" fill="#1f2937" stroke="#0b1220"/>';
    s += '<line x1="0" y1="0" x2="24" y2="0" stroke="#9ca3af" stroke-width="1.5"/><line x1="0" y1="36" x2="24" y2="36" stroke="#9ca3af" stroke-width="1.5"/>';
    s += '<circle cx="12" cy="18" r="13" fill="#9ca3af" stroke="#4b5563" stroke-width="2" data-cap="' + part.id + '"/><circle cx="12" cy="18" r="8" fill="#d1d5db" data-cap2="' + part.id + '"/>';
    return s + legDots(part);
  }
  function buzzerSVG(part) {
    var s = '<circle cx="12" cy="-20" r="17" fill="#111827" stroke="#374151" stroke-width="2"/><circle cx="12" cy="-20" r="4" fill="#374151"/>';
    s += '<text x="3" y="-26" font-size="9" fill="#e5e7eb" font-weight="800">+</text>';
    s += '<text x="-9" y="-4" font-size="11" font-weight="800" fill="#fb7185" text-anchor="middle" stroke="#0b1220" stroke-width="2.4" paint-order="stroke">+</text><text x="33" y="-4" font-size="12" font-weight="800" fill="#60a5fa" text-anchor="middle" stroke="#0b1220" stroke-width="2.4" paint-order="stroke">&#8722;</text>';
    s += '<line x1="0" y1="0" x2="0" y2="-10" stroke="#cbd5e1" stroke-width="2"/><line x1="24" y1="0" x2="24" y2="-10" stroke="#cbd5e1" stroke-width="2"/>';
    s += '<g data-wave="' + part.id + '" style="display:none" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"><path d="M34,-30 Q40,-20 34,-10"/><path d="M40,-34 Q50,-20 40,-6"/><path d="M46,-38 Q60,-20 46,-2"/></g>';
    return s + legDots(part);
  }
  function innerSVG(part) {
    switch (part.type) {
      case "uno": return unoSVG(); case "breadboard": return breadboardSVG(part); case "led": return ledSVG(part); case "resistor": return resistorSVG(part);
      case "button": return buttonSVG(part); case "buzzer": return buzzerSVG(part);
    }
    return "";
  }
  function partGroup(part) { return '<g class="part" id="p-' + part.id + '" data-id="' + part.id + '" transform="' + attrT(part) + '">' + innerSVG(part) + "</g>"; }

  /* ---------- wires */
  function wireD(ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay, d = Math.sqrt(dx * dx + dy * dy), k = Math.min(70, 14 + d * 0.22);
    return "M" + ax + " " + ay + " C" + ax + " " + (ay - k) + " " + bx + " " + (by - k) + " " + bx + " " + by;
  }
  function termPos(project, key) {
    if (!key) return null; var pid = key.split(":")[0], part = project.parts.filter(function (p) { return p.id === pid; })[0]; if (!part) return null;
    var t = C.worldTerms(part).filter(function (x) { return x.key === key; })[0]; return t ? { x: t.x, y: t.y } : null;
  }
  function wireSVG(project, w) {
    var a = termPos(project, w.a && w.a.term), b = termPos(project, w.b && w.b.term); if (!a || !b) return "";
    var col = WIRE_COLORS[w.color] || w.color || "#16a34a", d = wireD(a.x, a.y, b.x, b.y);
    return '<g class="wire" data-wire="' + w.id + '"><path d="' + d + '" fill="none" stroke="#0b1220" stroke-opacity="0.45" stroke-width="5.5" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3.6" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="transparent" stroke-width="12" class="hit"/>' +
      '<circle cx="' + a.x + '" cy="' + a.y + '" r="3.2" fill="' + col + '" stroke="#0b1220" stroke-width="1"/><circle cx="' + b.x + '" cy="' + b.y + '" r="3.2" fill="' + col + '" stroke="#0b1220" stroke-width="1"/></g>';
  }

  /* ---------- the whole project */
  function projectSVG(project) {
    var s = "";
    project.parts.filter(function (p) { return C.PARTS[p.type].board; }).forEach(function (p) { s += partGroup(p); });
    project.parts.filter(function (p) { return !C.PARTS[p.type].board; }).forEach(function (p) { s += partGroup(p); });
    s += '<g id="wires">' + project.wires.map(function (w) { return wireSVG(project, w); }).join("") + "</g>";
    return s;
  }

  /* ---------- lights and sounds of a solved circuit */
  function update(svgRoot, project, res, io, extra) {
    extra = extra || {};
    project.parts.forEach(function (p) {
      var g = svgRoot.querySelector("#p-" + p.id); if (!g) return;
      if (p.type === "led") {
        var r = res && res.leds[p.id], glow = g.querySelector("[data-glow]"), body = g.querySelector("[data-ledbody]"), burn = g.querySelector("[data-burn]");
        var b = r ? r.brightness : 0;
        if (glow) glow.setAttribute("opacity", String(Math.min(0.95, b * 0.95)));
        if (body) body.setAttribute("fill-opacity", String(0.5 + b * 0.5));
        if (burn) burn.style.display = r && r.blown ? "" : "none";
      } else if (p.type === "button") {
        var down = io && io.pressed && io.pressed[p.id], cap = g.querySelector("[data-cap]"), cap2 = g.querySelector("[data-cap2]");
        if (cap) cap.setAttribute("fill", down ? "#6b7280" : "#9ca3af"); if (cap2) cap2.setAttribute("fill", down ? "#9ca3af" : "#d1d5db");
      } else if (p.type === "buzzer") {
        var bz = res && res.buzzers[p.id], wv = g.querySelector("[data-wave]"); if (wv) wv.style.display = bz && bz.sounding ? "" : "none";
      } else if (p.type === "uno") {
        var l13 = io && io.pins && io.pins[13] && io.pins[13].mode === 1 && io.pins[13].value, L = g.querySelector('[data-uno="L"]');
        if (L) { L.setAttribute("fill", l13 ? "#fb923c" : "#7c4a0a"); L.style.filter = l13 ? "drop-shadow(0 0 4px #fb923c)" : ""; }
        var tx = g.querySelector('[data-uno="TX"]'); if (tx) tx.setAttribute("fill", extra.serialActive ? "#facc15" : "#6b5a05");
      }
      /* leg dots: green when plugged in, red when not */
      if (res && res.legs) g.querySelectorAll("[data-leg]").forEach(function (c) { var ok = res.legs[c.getAttribute("data-leg")]; c.setAttribute("fill", ok ? "#22c55e" : "#ef4444"); c.setAttribute("opacity", ok ? "0.9" : "1"); });
    });
  }

  root.ArduinoRender = { partGroup: partGroup, wireSVG: wireSVG, wireD: wireD, projectSVG: projectSVG, update: update, attrT: attrT, termPos: termPos, LED_COLORS: LED_COLORS, WIRE_COLORS: WIRE_COLORS, esc: esc };
  if (typeof module !== "undefined" && module.exports) module.exports = root.ArduinoRender;
})(typeof window !== "undefined" ? window : globalThis);
