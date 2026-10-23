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
  /* ---------- Unit 3 parts */
  function rgbSVG(part) {
    var s = '<circle cx="18" cy="-38" r="30" fill="#fff" opacity="0" data-rgbglow="' + part.id + '" style="filter:blur(9px)"/>';
    s += '<path d="M0,0 L0,-8 M24,0 L24,-8 M36,0 L36,-8" stroke="#0b0b0b" stroke-width="2.8" fill="none"/><path d="M12,0 L12,-30" stroke="#0b0b0b" stroke-width="3" fill="none"/>';
    s += '<path d="M-4,-24 L40,-24 L40,-38 Q40,-62 18,-62 Q-4,-62 -4,-38 Z" fill="#e5e7eb" fill-opacity=".55" stroke="#9ca3af" stroke-width="1.5" data-rgbbody="' + part.id + '"/>';
    s += '<path d="M-4,-24 L6,-24" stroke="#6b7280" stroke-width="2"/>';
    s += '<text x="0" y="-12" font-size="7" font-weight="800" fill="#ef4444" text-anchor="middle" stroke="#0b1220" stroke-width="2" paint-order="stroke">R</text><text x="12" y="-33" font-size="8" font-weight="800" fill="#93c5fd" text-anchor="middle" stroke="#0b1220" stroke-width="2" paint-order="stroke">&#8722;</text><text x="24" y="-12" font-size="7" font-weight="800" fill="#22c55e" text-anchor="middle" stroke="#0b1220" stroke-width="2" paint-order="stroke">G</text><text x="36" y="-12" font-size="7" font-weight="800" fill="#3b82f6" text-anchor="middle" stroke="#0b1220" stroke-width="2" paint-order="stroke">B</text>';
    s += '<g data-rgbburn="' + part.id + '" style="display:none"><path d="M6,-50 L30,-26 M30,-50 L6,-26" stroke="#111" stroke-width="4"/></g>';
    return s + legDots(part);
  }
  function servoSVG(part) {
    var s = '<path d="M0,0 L0,-24" stroke="#7c4a1e" stroke-width="3"/><path d="M12,0 L12,-24" stroke="#dc2626" stroke-width="3"/><path d="M24,0 L24,-24" stroke="#f97316" stroke-width="3"/>';
    s += '<rect x="-16" y="-72" width="58" height="48" rx="4" fill="#1e40af" stroke="#172554" stroke-width="2"/><rect x="-24" y="-60" width="8" height="22" rx="2" fill="#1e40af" stroke="#172554"/><rect x="42" y="-60" width="8" height="22" rx="2" fill="#1e40af" stroke="#172554"/>';
    s += '<text x="13" y="-34" font-size="8" fill="#bfdbfe" text-anchor="middle" font-weight="800">SERVO</text>';
    s += '<g transform="translate(30 -62)"><circle r="9" fill="#e5e7eb" stroke="#6b7280"/><g data-horn="' + part.id + '" style="transform:rotate(0deg);transition:transform .3s ease-out"><rect x="-3.5" y="-36" width="7" height="38" rx="3.5" fill="#f3f4f6" stroke="#6b7280"/><circle cx="0" cy="-30" r="1.6" fill="#6b7280"/><circle cx="0" cy="-22" r="1.6" fill="#6b7280"/><circle cx="0" cy="-14" r="1.6" fill="#6b7280"/></g><circle r="3.5" fill="#6b7280"/></g>';
    s += '<g data-servoangle="' + part.id + '"></g><text x="13" y="-76" font-size="8" fill="#e5e7eb" text-anchor="middle" font-weight="800" data-servotext="' + part.id + '" stroke="#0b1220" stroke-width="2" paint-order="stroke"></text>';
    return s + legDots(part);
  }
  function potSVG(part) {
    var pos = Math.max(0, Math.min(1, part.props && part.props.pos !== undefined ? +part.props.pos : 0.5));
    var s = '<path d="M0,0 L0,-12 M12,0 L12,-12 M24,0 L24,-12" stroke="#cbd5e1" stroke-width="2.2"/>';
    s += '<rect x="-12" y="-24" width="48" height="14" rx="3" fill="#0e7490" stroke="#164e63"/>';
    s += '<g data-pot="' + part.id + '" style="cursor:grab"><circle cx="12" cy="-38" r="19" fill="#1f2937" stroke="#4b5563" stroke-width="2"/><g data-potknob="' + part.id + '" transform="translate(12 -38) rotate(' + (-135 + pos * 270) + ')"><circle r="14" fill="#9ca3af" stroke="#6b7280"/><rect x="-1.8" y="-15" width="3.6" height="12" rx="1.5" fill="#111827"/></g></g>';
    s += '<text x="0" y="-14" font-size="7" font-weight="800" fill="#e0f2fe" text-anchor="middle">1</text><text x="12" y="-14" font-size="7" font-weight="800" fill="#fde68a" text-anchor="middle">W</text><text x="24" y="-14" font-size="7" font-weight="800" fill="#e0f2fe" text-anchor="middle">2</text>';
    return s + legDots(part);
  }
  function npnSVG(part) {
    var s = '<path d="M0,0 L0,-12 M12,0 L12,-12 M24,0 L24,-12" stroke="#cbd5e1" stroke-width="2.2"/>';
    s += '<path d="M-5,-12 L29,-12 L29,-26 Q29,-44 12,-44 Q-5,-44 -5,-26 Z" fill="#111827" stroke="#374151" stroke-width="1.5"/><path d="M-5,-12 L29,-12" stroke="#6b7280" stroke-width="2"/>';
    s += '<text x="12" y="-28" font-size="8" fill="#e5e7eb" text-anchor="middle" font-weight="800">NPN</text><text x="0" y="-17" font-size="7" fill="#fbbf24" text-anchor="middle" font-weight="800">C</text><text x="12" y="-17" font-size="7" fill="#a7f3d0" text-anchor="middle" font-weight="800">B</text><text x="24" y="-17" font-size="7" fill="#93c5fd" text-anchor="middle" font-weight="800">E</text>';
    return s + legDots(part);
  }
  function motorSVG(part) {
    var s = '<path d="M0,0 L0,-14 M36,0 L36,-14" stroke="#cbd5e1" stroke-width="2.2"/>';
    s += '<rect x="-10" y="-58" width="56" height="44" rx="10" fill="#9ca3af" stroke="#4b5563" stroke-width="2"/><rect x="-10" y="-34" width="56" height="4" fill="#6b7280"/>';
    s += '<text x="18" y="-20" font-size="10" fill="#111827" text-anchor="middle" font-weight="800">M</text>';
    s += '<g transform="translate(18 -68)"><rect x="-2" y="0" width="4" height="12" fill="#e5e7eb"/><g data-spin="' + part.id + '"><rect x="-13" y="-1.5" width="26" height="3" rx="1.5" fill="#f97316"/><rect x="-1.5" y="-13" width="3" height="26" rx="1.5" fill="#f97316"/></g></g>';
    s += '<text x="-6" y="-6" font-size="9" font-weight="800" fill="#e5e7eb" stroke="#0b1220" stroke-width="2" paint-order="stroke" text-anchor="middle" data-motortext="' + part.id + '"></text>';
    return s + legDots(part);
  }
  function diodeSVG(part) {
    var s = '<path d="M0,0 L48,0" stroke="#cbd5e1" stroke-width="2.2"/>';
    s += '<rect x="12" y="-6" width="24" height="12" rx="4" fill="#111827" stroke="#374151" stroke-width="1.5"/><rect x="30" y="-6" width="5" height="12" fill="#e5e7eb"/>';
    s += '<text x="22" y="3" font-size="6" fill="#9ca3af" text-anchor="middle">1N</text><text x="0" y="-5" font-size="7" font-weight="800" fill="#fb7185" text-anchor="middle">+</text><text x="48" y="-5" font-size="8" font-weight="800" fill="#60a5fa" text-anchor="middle">&#8722;</text>';
    return s + legDots(part);
  }
  var SEG = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g", A: "abcefg", B: "cdefg", C: "adef", D: "bcdeg", E: "adefg", F: "aefg" };
  function digitSVG(i, x) {
    var segs = { a: [1, 0, 8, 2], b: [8, 1, 2, 8], c: [8, 9, 2, 8], d: [1, 16, 8, 2], e: [0, 9, 2, 8], f: [0, 1, 2, 8], g: [1, 8, 8, 2] }, s = '<g transform="translate(' + x + ' -64)" data-digit="' + i + '">';
    Object.keys(segs).forEach(function (k) { var r = segs[k]; s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" rx="0.8" fill="#3b0d0d" data-sg="' + k + '"/>'; });
    return s + '<circle cx="11.5" cy="17.5" r="1.3" fill="#3b0d0d" data-sg="dp"/></g>';
  }
  function seg7SVG(part) {
    var s = '<path d="M0,0 L0,-10 M12,0 L12,-10 M24,0 L24,-10 M36,0 L36,-10" stroke="#cbd5e1" stroke-width="2.2"/>';
    s += '<rect x="-16" y="-78" width="80" height="68" rx="5" fill="#7f1d1d" stroke="#450a0a" stroke-width="2"/><rect x="-10" y="-72" width="68" height="30" rx="3" fill="#0a0a0a"/>';
    s += digitSVG(0, -6) + digitSVG(1, 8) + digitSVG(2, 28) + digitSVG(3, 42);
    s += '<circle cx="24" cy="-60" r="1.6" fill="#3b0d0d" data-colon="1"/><circle cx="24" cy="-52" r="1.6" fill="#3b0d0d" data-colon="2"/>';
    s += '<text x="0" y="-16" font-size="7" font-weight="800" fill="#fecaca" text-anchor="middle">+</text><text x="12" y="-16" font-size="8" font-weight="800" fill="#fecaca" text-anchor="middle">&#8722;</text><text x="24" y="-16" font-size="7" font-weight="800" fill="#fecaca" text-anchor="middle">D</text><text x="36" y="-16" font-size="7" font-weight="800" fill="#fecaca" text-anchor="middle">C</text>';
    s += '<text x="24" y="-36" font-size="5.5" fill="#fca5a5" text-anchor="middle">HT16K33</text>';
    return s + legDots(part);
  }
  function innerSVG(part) {
    switch (part.type) {
      case "uno": return unoSVG(); case "breadboard": return breadboardSVG(part); case "led": return ledSVG(part); case "resistor": return resistorSVG(part);
      case "button": return buttonSVG(part); case "buzzer": return buzzerSVG(part);
      case "rgb": return rgbSVG(part); case "servo": return servoSVG(part); case "pot": return potSVG(part); case "npn": return npnSVG(part);
      case "motor": return motorSVG(part); case "diode": return diodeSVG(part); case "seg7": return seg7SVG(part);
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
      } else if (p.type === "rgb") {
        var rr = res && res.rgb && res.rgb[p.id] || { R: 0, G: 0, B: 0, blown: false }, rgl = g.querySelector("[data-rgbglow]"), rbd = g.querySelector("[data-rgbbody]"), rbn = g.querySelector("[data-rgbburn]");
        var cc = "rgb(" + Math.round(255 * rr.R) + "," + Math.round(255 * rr.G) + "," + Math.round(255 * rr.B) + ")", lum = Math.max(rr.R, rr.G, rr.B);
        if (rgl) { rgl.setAttribute("fill", cc); rgl.setAttribute("opacity", String(Math.min(0.95, lum * 0.95))); }
        if (rbd) { rbd.setAttribute("fill", lum > 0.05 ? cc : "#e5e7eb"); rbd.setAttribute("fill-opacity", String(lum > 0.05 ? 0.55 + lum * 0.45 : 0.55)); }
        if (rbn) rbn.style.display = rr.blown ? "" : "none";
      } else if (p.type === "servo") {
        var sv = res && res.servos && res.servos[p.id], hn = g.querySelector("[data-horn]"), stx = g.querySelector("[data-servotext]"), ang = sv && io && io.dev && io.dev.servo ? io.dev.servo[sv.pin] : undefined;
        if (hn && ang !== undefined && sv.powered) { hn.style.transform = "rotate(" + (ang - 90) + "deg)"; if (stx) stx.textContent = ang + "\u00B0"; }
        else if (hn && stx && !(sv && sv.powered)) stx.textContent = "";
      } else if (p.type === "motor") {
        var mo = res && res.motors && res.motors[p.id], sp = g.querySelector("[data-spin]"), mtx = g.querySelector("[data-motortext]");
        if (sp) { var spd = mo ? mo.speed : 0; if (spd > 0.03) { sp.style.transformBox = "fill-box"; sp.style.transformOrigin = "center"; sp.style.animation = "ardspin " + (0.9 - 0.8 * Math.min(1, spd)).toFixed(2) + "s linear infinite"; } else sp.style.animation = "none"; }
        if (mtx) mtx.textContent = mo && mo.speed > 0.03 ? Math.round(mo.speed * 100) + "%" : "";
      } else if (p.type === "pot") {
        var kb = g.querySelector("[data-potknob]"), pv = io && io.pots && io.pots[p.id] !== undefined ? io.pots[p.id] : (p.props && p.props.pos !== undefined ? +p.props.pos : 0.5);
        if (kb) kb.setAttribute("transform", "translate(12 -38) rotate(" + (-135 + Math.max(0, Math.min(1, pv)) * 270) + ")");
      } else if (p.type === "seg7") {
        var so = res && res.seg && res.seg[p.id], shown = so && so.wired && io && io.dev && io.dev.seg ? io.dev.seg.shown : null, on = "#ff3b30", off = "#3b0d0d";
        g.querySelectorAll("[data-digit]").forEach(function (dg) {
          var di = +dg.getAttribute("data-digit"), d = shown && shown.digits[di], lit = d && SEG[String(d.ch).toUpperCase()] ? SEG[String(d.ch).toUpperCase()] : "";
          dg.querySelectorAll("[data-sg]").forEach(function (sgEl) { var k = sgEl.getAttribute("data-sg"); sgEl.setAttribute("fill", k === "dp" ? (d && d.dot ? on : off) : (lit.indexOf(k) > -1 ? on : off)); });
        });
        g.querySelectorAll("[data-colon]").forEach(function (c2) { c2.setAttribute("fill", shown && shown.colon ? on : off); });
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
