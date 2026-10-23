/* A live, clickable mini circuit simulator for the notes pages (ec/unit-2/*-notes.html).
   Needs compiler.js, circuit.js, sim.js, render.js, coach.js and tips.js on the page first.

   ArduinoEmbed.mount(host, {
     preset: "led5v" | "dual" | "blink" | "bytecount" | "pwm" | "traffic" | "button" | "walk"   (a ready-made circuit)  or  project: {parts, wires}
     code, editable, title, intro, slot (opens the real editor on that assignment),
     experiments: [{ label, tip, apply(project), undo(project) }]    toggle buttons that break or change the circuit
     variants:    [{ label, code }]                                    buttons that swap in different code
     goals:       [{ text, say, when(state) }]                         little missions that tick off (and pop up a card) when they happen
     events:      [{ id, when(ctx), title, html, help }]               extra pop-up cards for this page
     speed, height
   }) */
(function (root) {
  "use strict";
  var C = root.ArduinoCircuit, R = root.ArduinoRender, Sim = root.ArduinoSim, TIPS = root.ARD_TIPS || { topics: {}, order: [], cats: [] };
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function fmt(t) { return esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>"); }

  /* ---------------------------------------------------------------- styles (once) */
  var CSS = ".aem{margin:18px 0 26px;border:1px solid #2a3a4f;border-radius:14px;background:#0b1018;overflow:hidden;color:#E8ECF3;font:14px/1.5 Manrope,system-ui,sans-serif}" +
    ".aem *{box-sizing:border-box}.aem-top{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 14px;background:#0f1a26;border-bottom:1px solid #22324a}" +
    ".aem-top .aem-t{font:700 12px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#67E8F9;margin-right:auto}" +
    ".aem-intro{padding:10px 14px 0;color:#B8C4D6;font-size:14px}.aem-stagewrap{position:relative;margin:10px 14px;border:1px solid #1f2b3d;border-radius:10px;background:#0d1118;overflow:hidden}" +
    ".aem-stagewrap svg{display:block;width:100%;height:auto;max-height:420px;touch-action:none}.aem-btn{background:#17202e;color:#E8ECF3;border:1px solid #2f4058;border-radius:8px;padding:6px 12px;font:600 13px Manrope,sans-serif;cursor:pointer}" +
    ".aem-btn:hover{border-color:#5FD8DF}.aem-btn.run{background:#0b6b3a;border-color:#14a35a}.aem-btn.stop{background:#7f1d1d;border-color:#dc2626}.aem-btn.on{background:#3a2d12;border-color:#FBBF24;color:#FDE68A}" +
    ".aem select{background:#17202e;color:#E8ECF3;border:1px solid #2f4058;border-radius:8px;padding:5px 8px;font:600 12.5px Manrope,sans-serif}" +
    ".aem-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:0 14px 10px}.aem-row .aem-l{font:700 11px 'JetBrains Mono',monospace;color:#8B9AAE;text-transform:uppercase;letter-spacing:.05em}" +
    ".aem-pins{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}.aem-chip{font:600 11.5px 'JetBrains Mono',monospace;padding:2px 9px;border-radius:100px;background:#132033;border:1px solid #2a3d57;color:#9FB3CC}" +
    ".aem-chip.hi{background:#3a2d12;border-color:#FBBF24;color:#FDE68A}.aem-chip.pwm{background:#1c2a4a;border-color:#60A5FA;color:#BFDBFE}.aem-chip.in{background:#10281f;border-color:#34D399;color:#A7F3D0}" +
    ".aem-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 14px 12px}@media(max-width:760px){.aem-cols{grid-template-columns:1fr}}" +
    ".aem textarea{width:100%;min-height:150px;background:#05070B;color:#E8ECF3;border:1px solid #26334a;border-radius:8px;padding:8px 10px;font:12.5px/1.55 'JetBrains Mono',monospace;resize:vertical;white-space:pre;tab-size:2}" +
    ".aem pre.aem-out{margin:0;min-height:150px;max-height:230px;overflow:auto;background:#05070B;border:1px solid #26334a;border-radius:8px;padding:8px 10px;font:12.5px/1.5 'JetBrains Mono',monospace;color:#A7F3D0;white-space:pre-wrap}" +
    ".aem-h{font:700 11px 'JetBrains Mono',monospace;color:#67E8F9;text-transform:uppercase;letter-spacing:.05em;margin:0 0 4px}.aem-msg{padding:0 14px 8px;font-size:13px;color:#FCA5A5;min-height:1px}" +
    ".aem-goals{margin:0;padding:0 14px 12px;list-style:none;display:grid;gap:6px}.aem-goals li{display:flex;gap:8px;align-items:flex-start;padding:6px 10px;border:1px dashed #33465f;border-radius:9px;color:#B8C4D6;font-size:13.5px}" +
    ".aem-goals li:before{content:'\\25CB';color:#67E8F9}.aem-goals li.done{border:1px solid #14532d;background:#07241a;color:#A7F3D0}.aem-goals li.done:before{content:'\\2714';color:#34D399}" +
    ".aem-tip{font-size:12.5px;color:#8B9AAE;padding:0 14px 12px}.aem code{font:12px 'JetBrains Mono',monospace;background:#0f1522;padding:0 4px;border-radius:4px;color:#7DD3FC}.aem a{color:#9FEAEE}" +
    ".aem .coachcard{position:absolute;left:10px;bottom:10px;z-index:30;max-width:min(400px,92%);padding:11px 14px 10px;border-radius:12px;background:#0b1a24;border:1.5px solid #22D3EE;box-shadow:0 10px 30px rgba(0,0,0,.55);color:#E8ECF3;font-size:13px;line-height:1.5;opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .25s,transform .25s}" +
    ".aem .coachcard.show{opacity:1;transform:none;pointer-events:auto}.aem .coachtop{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:4px}.aem .coachtop b{font-size:14.5px;color:#67E8F9}" +
    ".aem .coachx{background:none;border:0;color:#93A0B8;font-size:20px;line-height:1;cursor:pointer;padding:0 2px}.aem .coachhelp{margin-top:7px}" +
    ".tipbtn{display:inline-block;margin:3px 4px 3px 0;padding:2px 10px;border-radius:100px;border:1px solid #FBBF24;background:#2A2110;color:#FDE68A;font:600 12px Manrope,sans-serif;cursor:pointer;line-height:1.5;text-align:left}.tipbtn:hover{background:#3a2d12;border-color:#FDE047}" +
    ".aem-modal{position:fixed;inset:0;background:rgba(0,0,0,.65);display:none;align-items:center;justify-content:center;z-index:1000;padding:16px}.aem-modal.show{display:flex}" +
    ".aem-box{background:#10141C;border:1px solid #2a3a4f;border-radius:12px;max-width:760px;width:100%;max-height:88vh;display:flex;flex-direction:column;color:#E8ECF3;font:14px/1.6 Manrope,sans-serif}" +
    ".aem-boxh{display:flex;gap:10px;align-items:center;padding:12px 16px;border-bottom:1px solid #232B38}.aem-boxh b{font:600 18px Fraunces,Georgia,serif;margin-right:auto}.aem-boxb{padding:12px 18px 16px;overflow:auto}" +
    ".aem-boxb pre.tipcode{background:#05070B;border:1px solid #232B38;border-radius:8px;padding:10px 14px;margin:8px 0 12px;font:12.5px/1.6 'JetBrains Mono',monospace;overflow:auto}" +
    ".aem-boxb table{width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:13px}.aem-boxb td,.aem-boxb th{padding:6px 8px;border-bottom:1px solid #1d2638;vertical-align:top;text-align:left}" +
    "@keyframes ardspin{to{transform:rotate(360deg)}}.aem-boxb .tipgood{margin:10px 0;padding:9px 12px;border:1px solid #14532d;border-radius:9px;background:#07241a;color:#A7F3D0}.aem-boxb .tipwarn{margin:10px 0;padding:9px 12px;border:1px solid #7f1d1d;border-radius:9px;background:#2a0f0f;color:#FECACA}";
  function injectCSS() { if (document.getElementById("aem-css")) return; var s = document.createElement("style"); s.id = "aem-css"; s.textContent = CSS; document.head.appendChild(s); }

  /* ---------------------------------------------------------------- help pop-up */
  var modal = null, tipStack = [];
  function section(s) {
    if (s.p) return "<p>" + fmt(s.p) + "</p>"; if (s.ex) return '<pre class="tipcode">' + esc(s.ex.join("\n")) + "</pre>";
    if (s.anno) return "<table>" + s.anno.map(function (r) { return "<tr><td><code>" + esc(r[0]) + "</code></td><td>" + fmt(r[1]) + "</td></tr>"; }).join("") + "</table>";
    if (s.list) return "<ul>" + s.list.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ul>"; if (s.steps) return "<ol>" + s.steps.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ol>";
    if (s.rows) return "<table>" + (s.head ? "<tr>" + s.head.map(function (h) { return "<th>" + fmt(h) + "</th>"; }).join("") + "</tr>" : "") + s.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + fmt(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
    if (s.good) return '<div class="tipgood">&#128161; ' + fmt(s.good) + "</div>"; if (s.warn) return '<div class="tipwarn">&#9888;&#65039; ' + fmt(s.warn) + "</div>"; if (s.svg) return "<div>" + s.svg + "</div>";
    if (s.links) return "<div><b>Related:</b> " + s.links.filter(function (id) { return TIPS.topics[id]; }).map(function (id) { return '<button type="button" class="tipbtn" data-etip="' + id + '">&#128161; ' + esc(TIPS.topics[id].title) + "</button>"; }).join("") + "</div>";
    return "";
  }
  function openTip(id, noPush) {
    var t = TIPS.topics[id]; if (!t) return;
    if (!modal) {
      modal = document.createElement("div"); modal.className = "aem-modal"; modal.innerHTML = '<div class="aem-box"><div class="aem-boxh"><button type="button" class="aem-btn" id="aemBack">&larr; Back</button><b id="aemTitle"></b><button type="button" class="aem-btn" id="aemClose">Close</button></div><div class="aem-boxb" id="aemBody"></div></div>';
      document.body.appendChild(modal);
      modal.addEventListener("click", function (e) {
        var t2 = e.target; if (t2 === modal || t2.id === "aemClose") { modal.className = "aem-modal"; tipStack = []; return; }
        if (t2.id === "aemBack") { tipStack.pop(); var p = tipStack.pop(); if (p) openTip(p); else { modal.className = "aem-modal"; tipStack = []; } return; }
        var b = t2.closest ? t2.closest("[data-etip]") : null; if (b) openTip(b.getAttribute("data-etip"));
      });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") { modal.className = "aem-modal"; tipStack = []; } });
    }
    if (!noPush) tipStack.push(id);
    modal.querySelector("#aemTitle").textContent = t.title; modal.querySelector("#aemBody").innerHTML = t.sections.map(section).join("");
    modal.querySelector("#aemBack").style.display = tipStack.length > 1 ? "" : "none"; modal.className = "aem-modal show"; modal.querySelector("#aemBody").scrollTop = 0;
  }

  /* ---------------------------------------------------------------- ready-made circuits */
  function Builder() {
    var n = 0, p = { parts: [{ id: "uno1", type: "uno", x: 70, y: 20, rot: 0, props: {} }, { id: "bb1", type: "breadboard", x: 20, y: 290, rot: 0, props: { size: "half" } }], wires: [] };
    function hole(id) { return C.worldTerms(p.parts[1]).filter(function (t) { return t.id === id; })[0]; }
    var b = {
      p: p,
      put: function (type, term, holeId, rot, props) {
        var h = hole(holeId), part = { id: type.slice(0, 1) + (++n), type: type, x: 0, y: 0, rot: rot || 0, props: props || {} }, t0 = C.worldTerms(part).filter(function (t) { return t.id === term; })[0];
        part.x = h.x - t0.x; part.y = h.y - t0.y; p.parts.push(part); return part;
      },
      wire: function (a, bb, color) { p.wires.push({ id: "w" + (++n), a: { term: a }, b: { term: bb }, color: color || "green" }); },
      gnds: function () { b.wire("uno1:GND_t", "bb1:tn0", "black"); b.wire("uno1:GND_b1", "bb1:bn0", "black"); },
      led: function (pin, col, color, span) { span = span || 4; b.wire("uno1:D" + pin, "bb1:c" + col + "a", "green"); b.put("resistor", "1", "c" + col + "b", 0, { ohms: 220, span: span }); var l = b.put("led", "A", "c" + (col + span) + "c", 0, { color: color }); b.wire("bb1:c" + (col + span + 1) + "a", "bb1:tn0", "black"); return l; },
      power: function () { b.wire("uno1:5V", "bb1:tp0", "red"); },
      button: function (pin, col) { b.put("button", "TL", "c" + col + "e", 0, {}); b.wire("uno1:D" + pin, "bb1:c" + col + "a", "orange"); b.wire("bb1:c" + col + "j", "bb1:bn0", "black"); }
    };
    return b;
  }
  var PRESETS = {
    led5v: function () { var b = Builder(); b.wire("uno1:5V", "bb1:tp0", "red"); b.wire("uno1:GND_t", "bb1:tn0", "black"); b.put("resistor", "2", "c11a", 1, { ohms: 220, span: 4 }); b.put("led", "A", "c11e", 2, { color: "red" }); b.wire("bb1:c10a", "bb1:tn0", "black"); return { project: b.p, code: "" }; },
    dual: function () { var b = Builder(); b.wire("uno1:5V", "bb1:tp0", "red"); b.wire("uno1:GND_t", "bb1:tn0", "black");[[11, "red"], [21, "green"]].forEach(function (x) { b.put("resistor", "2", "c" + x[0] + "a", 1, { ohms: 220, span: 4 }); b.put("led", "A", "c" + x[0] + "e", 2, { color: x[1] }); b.wire("bb1:c" + (x[0] - 1) + "a", "bb1:tn0", "black"); }); return { project: b.p, code: "" }; },
    blink: function () { var b = Builder(); b.gnds(); b.led(8, 5, "red"); return { project: b.p, code: "int ledPin = 8;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(1000);\n  digitalWrite(ledPin, LOW);\n  delay(1000);\n}\n" }; },
    bytecount: function () { var b = Builder(); b.gnds(); b.led(8, 5, "red"); return { project: b.p, code: "int ledPin = 8;\nint blinkSpeed = 100;\nboolean ledState = false;\nbyte blinkCount = 0;\nlong totalBlinks = 0;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  ledState = !ledState;\n  digitalWrite(ledPin, ledState);\n  blinkCount = blinkCount + 1;\n  totalBlinks = totalBlinks + 1;\n  Serial.print(\"blinkCount: \");\n  Serial.print(blinkCount);\n  Serial.print(\"   totalBlinks: \");\n  Serial.println(totalBlinks);\n  delay(blinkSpeed);\n}\n" }; },
    pwm: function () { var b = Builder(); b.gnds(); b.led(9, 5, "red"); return { project: b.p, code: "int ledPin = 9;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(ledPin, 20);\n  delay(1000);\n  analogWrite(ledPin, 100);\n  delay(1000);\n  analogWrite(ledPin, 255);\n  delay(1000);\n}\n" }; },
    traffic: function () { var b = Builder(); b.gnds(); b.led(8, 1, "red"); b.led(9, 8, "yellow"); b.led(10, 15, "green"); return { project: b.p, code: "int redPin = 8;\nint yellowPin = 9;\nint greenPin = 10;\nint greenTime = 3000;\nint yellowTime = 1000;\nint redTime = 2500;\n\nvoid setup() {\n  pinMode(redPin, OUTPUT);\n  pinMode(yellowPin, OUTPUT);\n  pinMode(greenPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(greenPin, HIGH);\n  delay(greenTime);\n  digitalWrite(greenPin, LOW);\n  digitalWrite(yellowPin, HIGH);\n  delay(yellowTime);\n  digitalWrite(yellowPin, LOW);\n  digitalWrite(redPin, HIGH);\n  delay(redTime);\n  digitalWrite(redPin, LOW);\n}\n" }; },
    button: function () { var b = Builder(); b.gnds(); b.button(8, 5); b.led(9, 12, "red"); return { project: b.p, code: "int buttonPin = 8;\nint ledPin = 9;\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  pinMode(ledPin, OUTPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int buttonState = digitalRead(buttonPin);\n  Serial.println(buttonState);\n  digitalWrite(ledPin, !buttonState);\n  delay(100);\n}\n" }; },
    rgb: function () { var b = Builder(); b.gnds(); b.put("rgb", "R", "c10c", 0, {}); [[9, 6], [10, 8], [11, 9]].forEach(function (x) { b.wire("uno1:D" + x[0], "bb1:c" + x[1] + "a", "green"); b.put("resistor", "1", "c" + x[1] + "b", 0, { ohms: 220, span: 4 }); }); b.wire("bb1:c11a", "bb1:tn0", "black"); return { project: b.p, code: "const int RED = 9;\nconst int GREEN = 10;\nconst int BLUE = 11;\n\nvoid setup() {\n  pinMode(RED, OUTPUT);\n  pinMode(GREEN, OUTPUT);\n  pinMode(BLUE, OUTPUT);\n}\n\nvoid setColor(int r, int g, int b) {\n  analogWrite(RED, r);\n  analogWrite(GREEN, g);\n  analogWrite(BLUE, b);\n}\n\nvoid loop() {\n  setColor(255, 0, 0);\n  delay(1000);\n  setColor(0, 255, 0);\n  delay(1000);\n  setColor(0, 0, 255);\n  delay(1000);\n}\n" }; },
    buzzer: function () { var b = Builder(); b.gnds(); b.put("buzzer", "P", "c5c", 0, {}); b.wire("uno1:D8", "bb1:c5a", "green"); b.wire("bb1:c7a", "bb1:tn0", "black"); b.button(2, 15); return { project: b.p, code: "const int BUZZER = 8;\nint notes[] = {262, 262, 392, 392, 440, 440, 392, 349};\nint beats[] = {400, 400, 400, 400, 400, 400, 800, 400};\n\nvoid setup() {\n  pinMode(2, INPUT_PULLUP);\n}\n\nvoid loop() {\n  if (digitalRead(2) == LOW) {\n    for (int i = 0; i < 8; i++) {\n      tone(BUZZER, notes[i], beats[i]);\n      delay(beats[i] + 50);\n    }\n    noTone(BUZZER);\n  }\n}\n" }; },
    servo: function () { var b = Builder(); b.gnds(); b.power(); b.put("servo", "G", "c5c", 0, {}); b.wire("bb1:tn0", "bb1:c5a", "black"); b.wire("bb1:tp0", "bb1:c6a", "red"); b.wire("uno1:D9", "bb1:c7a", "orange"); b.button(2, 15); return { project: b.p, code: "#include <Servo.h>\n\nServo myServo;\nbool locked = true;\n\nvoid setup() {\n  pinMode(2, INPUT_PULLUP);\n  myServo.attach(9);\n  myServo.write(0);\n}\n\nvoid loop() {\n  if (digitalRead(2) == LOW) {\n    if (locked) {\n      myServo.write(90);\n      locked = false;\n    } else {\n      myServo.write(0);\n      locked = true;\n    }\n    delay(400);\n  }\n}\n" }; },
    motor: function () { var b = Builder(); b.gnds(); b.power(); b.wire("uno1:D9", "bb1:c3a", "green"); b.put("resistor", "1", "c3b", 0, { ohms: 1000, span: 4 }); b.put("npn", "B", "c7c", 0, {}); b.wire("bb1:c8a", "bb1:tn1", "black"); b.wire("bb1:c6a", "bb1:c13a", "green"); b.put("motor", "1", "c13e", 0, {}); b.wire("bb1:tp1", "bb1:c16a", "red"); b.put("diode", "A", "c13d", 0, {}); b.wire("bb1:c17a", "bb1:c16a", "green"); return { project: b.p, code: "const int MOTOR = 9;\n\nvoid setup() {\n  pinMode(MOTOR, OUTPUT);\n}\n\nvoid loop() {\n  analogWrite(MOTOR, 255);\n  delay(2000);\n  analogWrite(MOTOR, 128);\n  delay(2000);\n  analogWrite(MOTOR, 0);\n  delay(2000);\n}\n" }; },
    seg7: function () { var b = Builder(); b.gnds(); b.power(); b.put("seg7", "+", "c10c", 0, {}); b.wire("bb1:tp0", "bb1:c10a", "red"); b.wire("bb1:tn0", "bb1:c11a", "black"); b.wire("uno1:A4", "bb1:c12a", "green"); b.wire("uno1:A5", "bb1:c13a", "blue"); b.button(2, 20); return { project: b.p, code: "#include <Wire.h>\n#include \"Adafruit_LEDBackpack.h\"\n\nAdafruit_7segment matrix = Adafruit_7segment();\nint count = 0;\n\nvoid setup() {\n  matrix.begin(0x70);\n  pinMode(2, INPUT_PULLUP);\n}\n\nvoid loop() {\n  if (digitalRead(2) == LOW) {\n    count++;\n    if (count > 9999) count = 0;\n    delay(150);\n  }\n  matrix.print(count);\n  matrix.writeDisplay();\n}\n" }; },
    pot: function () { var b = Builder(); b.gnds(); b.power(); b.put("pot", "1", "c3c", 0, { pos: 0.5 }); b.wire("bb1:tp0", "bb1:c3a", "red"); b.wire("bb1:tn0", "bb1:c5a", "black"); b.wire("uno1:A0", "bb1:c4a", "green"); b.put("servo", "G", "c8c", 0, {}); b.wire("bb1:tn0", "bb1:c8a", "black"); b.wire("bb1:tp0", "bb1:c9a", "red"); b.wire("uno1:D9", "bb1:c10a", "orange"); b.put("buzzer", "P", "c15c", 0, {}); b.wire("uno1:D8", "bb1:c15a", "green"); b.wire("bb1:tn0", "bb1:c17a", "black"); return { project: b.p, code: "#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int reading = analogRead(A0);\n  int angle = map(reading, 0, 1023, 0, 180);\n  myServo.write(angle);\n  Serial.println(angle);\n  delay(15);\n}\n" }; },
    scan: function () { var b = Builder(); b.gnds(); [[2, 1], [3, 6], [4, 11], [5, 16], [6, 21]].forEach(function (x) { b.led(x[0], x[1], "red", 3); }); return { project: b.p, code: "const int ledPins[] = {2, 3, 4, 5, 6};\nconst int NUM_LEDS = 5;\n\nvoid setup() {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    pinMode(ledPins[i], OUTPUT);\n  }\n}\n\nvoid allOff() {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    digitalWrite(ledPins[i], LOW);\n  }\n}\n\nvoid showLed(int index) {\n  allOff();\n  digitalWrite(ledPins[index], HIGH);\n}\n\nvoid scan(int speed) {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    showLed(i);\n    delay(speed);\n  }\n  for (int i = NUM_LEDS - 2; i >= 1; i--) {\n    showLed(i);\n    delay(speed);\n  }\n}\n\nvoid loop() {\n  scan(100);\n}\n" }; },
    debug: function () { var b = Builder(); b.gnds(); b.led(8, 1, "red"); b.led(9, 8, "yellow"); b.led(10, 15, "green"); return { project: b.p, code: "void setup() {\n  pinMode(8, OUTPUT);\n  pinMode(9, OUTPUT);\n  pinMode(10, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(8, HIGH);\n  digitalWrite(9, HIGH);\n  digitalWrite(10, HIGH);\n  delay(500);\n  digitalWrite(8, LOW);\n  digitalWrite(9, LOW);\n  digitalWrite(10, LOW);\n  delay(500);\n}\n" }; },
    walk: function () { var b = Builder(); b.gnds(); b.button(8, 2); b.led(9, 9, "red"); b.led(10, 16, "green"); return { project: b.p, code: "int buttonPin = 8;\nint redPin = 9;\nint walkPin = 10;\n\nvoid setup() {\n  pinMode(buttonPin, INPUT_PULLUP);\n  pinMode(redPin, OUTPUT);\n  pinMode(walkPin, OUTPUT);\n}\n\nvoid loop() {\n  int buttonState = digitalRead(buttonPin);\n  digitalWrite(redPin, buttonState);\n  digitalWrite(walkPin, !buttonState);\n}\n" }; }
  };

  /* ---------------------------------------------------------------- handy experiments */
  function ledPart(p) { return p.parts.filter(function (x) { return x.type === "led"; })[0]; }
  function flipLed(p, led) {
    var A = C.worldTerms(led).filter(function (t) { return t.id === "A"; })[0], K = C.worldTerms(led).filter(function (t) { return t.id === "K"; })[0];
    led.rot = ((led.rot || 0) + 2) % 4; var A2 = C.worldTerms(led).filter(function (t) { return t.id === "A"; })[0]; led.x += K.x - A2.x; led.y += K.y - A2.y;
  }
  function flipTwo(part, ta, tb) {
    var wt = function (id) { return C.worldTerms(part).filter(function (x) { return x.id === id; })[0]; }, A0 = wt(ta), B0 = wt(tb);
    part.rot = ((part.rot || 0) + 2) % 4; var A1 = wt(ta); part.x += B0.x - A1.x; part.y += B0.y - A1.y;
  }
  function firstOf(p, type) { return p.parts.filter(function (x) { return x.type === type; })[0]; }
  var EXP = {
    flipDiode: { label: "Turn the diode around", tip: "Puts the stripe on the wrong end.", apply: function (p) { var d = firstOf(p, "diode"); if (d) flipTwo(d, "A", "K"); }, undo: function (p) { var d = firstOf(p, "diode"); if (d) flipTwo(d, "A", "K"); } },
    noBaseRes: { label: "Take the base resistor out (use a plain wire)", tip: "Sets the 1 kilohm resistor to 1 ohm.", apply: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x._o = x.props.ohms; x.props.ohms = 1; } }); }, undo: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x.props.ohms = x._o || 1000; delete x._o; } }); } },
    flipFirstLed: { label: "Turn LED 1 around", tip: "Swaps the anode and cathode of the first LED.", apply: function (p) { var l = firstOf(p, "led"); if (l) flipLed(p, l); }, undo: function (p) { var l = firstOf(p, "led"); if (l) flipLed(p, l); } },
    unplugD: { label: "Swap the D and C wires", tip: "D goes to A5 and C goes to A4: backwards.", apply: function (p) { p.wires.forEach(function (w) { if (w.a.term === "uno1:A4") { w.a.term = "uno1:A5"; w._s = 1; } else if (w.a.term === "uno1:A5") { w.a.term = "uno1:A4"; w._s = 1; } }); }, undo: function (p) { p.wires.forEach(function (w) { if (w._s) { w.a.term = w.a.term === "uno1:A4" ? "uno1:A5" : "uno1:A4"; delete w._s; } }); } },
    reverseLed: { label: "Turn the LED around", tip: "Swaps the anode and cathode legs. An LED only works one way.", apply: function (p) { var l = ledPart(p); if (l) flipLed(p, l); }, undo: function (p) { var l = ledPart(p); if (l) flipLed(p, l); } },
    noResistor: { label: "Replace the resistor with a plain wire", tip: "Takes the only current limiter out of the loop.", apply: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x._o = x.props.ohms; x.props.ohms = 1; } }); }, undo: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x.props.ohms = x._o || 220; delete x._o; } }); } },
    bigResistor: { label: "Use a 10,000 Ω resistor", tip: "A huge resistor lets almost no current through.", apply: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x._o = x.props.ohms; x.props.ohms = 10000; } }); }, undo: function (p) { p.parts.forEach(function (x) { if (x.type === "resistor") { x.props.ohms = x._o || 220; delete x._o; } }); } },
    moveWire8: { label: "Move the LED wire to pin 8", tip: "Pin 8 has no ~ so it cannot dim. (The code changes to ledPin = 8 to match.)", codeFrom: /int ledPin = 9;/, codeTo: "int ledPin = 8;", codeUndoFrom: /int ledPin = 8;/, codeUndoTo: "int ledPin = 9;", apply: function (p) { p.wires.forEach(function (w) { if (w.a.term === "uno1:D9") { w.a.term = "uno1:D8"; w._m = 1; } }); }, undo: function (p) { p.wires.forEach(function (w) { if (w._m) { w.a.term = "uno1:D9"; delete w._m; } }); } },
    cutGnd: { label: "Unplug the button's GND wire", tip: "Now the button's other side is not connected to anything.", apply: function (p) { p.wires.forEach(function (w) { if (w.a.term === "bb1:c5j" && w.b.term === "bb1:bn0") { w._h = 1; w.b.term = "bb1:c29j"; } }); }, undo: function (p) { p.wires.forEach(function (w) { if (w._h) { w.b.term = "bb1:bn0"; delete w._h; } }); } }
  };

  /* ---------------------------------------------------------------- page bounds */
  function bbox(p) {
    var d = { uno: [-16, 0, C.UNO_W, C.UNO_H], led: [-16, -62, 40, 66], resistor: [-4, -14, 8 + 12 * Math.max(3, Math.min(12, Math.round(+(p.props && p.props.span) || 4))), 24], button: [-10, -10, 38, 56], buzzer: [-6, -40, 40, 44] }[p.type] || (C.PARTS[p.type] && C.PARTS[p.type].box);
    if (p.type === "breadboard") { var q = C.PARTS.breadboard.dims(p); d = [0, 0, q.w, q.h]; }
    var pts = [[d[0], d[1]], [d[0] + d[2], d[1]], [d[0], d[1] + d[3]], [d[0] + d[2], d[1] + d[3]]].map(function (q2) { var r = C.rot(q2[0], q2[1], p.rot || 0); return [p.x + r[0], p.y + r[1]]; });
    var xs = pts.map(function (q2) { return q2[0]; }), ys = pts.map(function (q2) { return q2[1]; }); return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
  }
  function viewBox(project) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; project.parts.forEach(function (p) { var b = bbox(p); x0 = Math.min(x0, b.x0); y0 = Math.min(y0, b.y0); x1 = Math.max(x1, b.x1); y1 = Math.max(y1, b.y1); });
    return [x0 - 14, y0 - 14, x1 - x0 + 28, y1 - y0 + 28].join(" ");
  }

  /* ---------------------------------------------------------------- mount */
  function mount(host, cfg) {
    injectCSS();
    var pre = cfg.preset ? PRESETS[cfg.preset]() : { project: cfg.project, code: cfg.code || "" };
    var original = JSON.stringify(pre.project), project = JSON.parse(original), code0 = cfg.code != null ? cfg.code : pre.code, applied = {}, doneGoals = {};
    var exps = (cfg.experiments || []).map(function (e) { return typeof e === "string" ? Object.assign({ id: e }, EXP[e]) : e; });
    host.className = (host.className ? host.className + " " : "") + "aem";
    host.innerHTML = '<div class="aem-top"><span class="aem-t">' + esc(cfg.title || "Try it live") + '</span><button type="button" class="aem-btn run" data-a="run">&#9654; Start</button><button type="button" class="aem-btn" data-a="reset">&#8635; Reset</button>' +
      '<select data-a="speed" aria-label="Speed"><option value="1">1x speed</option><option value="4">4x</option><option value="10">10x</option></select>' + (cfg.slot ? '<a class="aem-btn" style="text-decoration:none" target="_blank" rel="noopener" href="../../arduino/editor.html?slot=' + cfg.slot + '">Open in the editor &rarr;</a>' : "") + "</div>" +
      (cfg.intro ? '<div class="aem-intro">' + cfg.intro + "</div>" : "") + '<div class="aem-stagewrap"><svg xmlns="http://www.w3.org/2000/svg"></svg></div><div class="aem-pins" data-r="pins"></div>' +
      (exps.length ? '<div class="aem-row"><span class="aem-l">Experiments</span>' + exps.map(function (e, i) { return '<button type="button" class="aem-btn" data-exp="' + i + '" title="' + esc(e.tip || "") + '">' + esc(e.label) + "</button>"; }).join("") + "</div>" : "") +
      ((cfg.variants || []).length ? '<div class="aem-row"><span class="aem-l">Try different code</span>' + cfg.variants.map(function (v, i) { return '<button type="button" class="aem-btn" data-var="' + i + '">' + esc(v.label) + "</button>"; }).join("") + "</div>" : "") +
      (cfg.goals && cfg.goals.length ? '<ul class="aem-goals">' + cfg.goals.map(function (g, i) { return '<li data-g="' + i + '">' + g.text + "</li>"; }).join("") + "</ul>" : "") +
      (code0 || cfg.editable ? '<div class="aem-cols"><div><div class="aem-h">Code' + (cfg.editable ? " (you can change it)" : "") + '</div><textarea spellcheck="false"' + (cfg.editable ? "" : " readonly") + "></textarea></div><div><div class=\"aem-h\">Serial Monitor</div><pre class=\"aem-out\"></pre></div></div>" : "") +
      '<div class="aem-msg" data-r="msg"></div>' + (cfg.tip ? '<div class="aem-tip">' + cfg.tip + "</div>" : "");
    var svg = host.querySelector("svg"), wrap = host.querySelector(".aem-stagewrap"), ta = host.querySelector("textarea"), out = host.querySelector(".aem-out"), msg = host.querySelector('[data-r="msg"]'), pinsEl = host.querySelector('[data-r="pins"]'), runB = host.querySelector('[data-a="run"]');
    if (ta) ta.value = code0 || "";
    svg.setAttribute("height", cfg.height || 340);
    var sim, coach, lastRes = null, armed = false, serialBlink = 0, goalState = {};
    function draw() { svg.setAttribute("viewBox", viewBox(project)); svg.innerHTML = R.projectSVG(project); wirePress(); }
    function wirePress() {
      project.parts.forEach(function (p) {
        if (p.type === "pot") {
          var kn = svg.querySelector("#p-" + p.id + " [data-pot]"); if (!kn) return;
          kn.addEventListener("pointerdown", function (e) {
            e.preventDefault(); armed = true; try { kn.setPointerCapture(e.pointerId); } catch (x) {} var y0 = e.clientY, p0 = p.props.pos !== undefined ? +p.props.pos : 0.5;
            function mv(ev) { p.props.pos = Math.max(0, Math.min(1, p0 + (y0 - ev.clientY) / 110)); sim.markDirty(); }
            function up() { kn.removeEventListener("pointermove", mv); kn.removeEventListener("pointerup", up); }
            kn.addEventListener("pointermove", mv); kn.addEventListener("pointerup", up);
          });
          return;
        }
        if (p.type !== "button") return; var g = svg.querySelector("#p-" + p.id); if (!g) return; g.style.cursor = "pointer";
        function down(e) { e.preventDefault(); armed = true; sim.press(p.id, true); } function up() { sim.press(p.id, false); }
        g.addEventListener("pointerdown", down); g.addEventListener("pointerup", up); g.addEventListener("pointerleave", up); g.addEventListener("pointercancel", up);
      });
    }
    function chips(io) {
      var h = ""; Object.keys(io.pins || {}).forEach(function (k) {
        var s = io.pins[k]; if (!s || s.mode === undefined || +k > 13) return; var name = "D" + k;
        if (s.mode === 1) h += '<span class="aem-chip ' + (s.pwm !== null && s.pwm !== undefined ? "pwm" : s.value ? "hi" : "") + '">' + name + " OUT " + (s.pwm !== null && s.pwm !== undefined ? "PWM " + s.pwm + "/255" : s.value ? "HIGH" : "LOW") + "</span>";
        else { var rv = lastRes && lastRes.pinVolt ? lastRes.pinVolt(+k) : 0, fl = lastRes && lastRes.pinFloating && lastRes.pinFloating(+k) && !s.pullup; h += '<span class="aem-chip in">' + name + " IN" + (s.pullup ? "+pullup " : " ") + (fl ? "floating" : rv > 2.5 ? "HIGH" : "LOW") + "</span>"; }
      });
      pinsEl.innerHTML = h;
    }
    function state() { return { res: lastRes, io: sim.io, sim: sim, project: project, serial: sim.serialOut, code: ta ? ta.value : "", running: sim.running }; }
    function goals() {
      (cfg.goals || []).forEach(function (g, i) {
        if (doneGoals[i]) return; var ok = false; try { ok = !!g.when(state(), goalState); } catch (e) { ok = false; } if (!ok) return;
        doneGoals[i] = true; host.querySelector('[data-g="' + i + '"]').classList.add("done");
        coach.show({ id: "goal" + i, title: "✔ " + (g.title || "Nice!"), html: g.say || g.text, help: g.help || [] });
      });
    }
    function check(res, io) { lastRes = res || lastRes; if (!armed) { return; } var ctx = state(); ctx.res = lastRes; ctx.io = io || sim.io; coach.check(ctx); goals(); }
    sim = new Sim({
      getProject: function () { return project; },
      onUpdate: function (res, io) { lastRes = res; R.update(svg, project, res, io, { serialActive: Date.now() - serialBlink < 250 }); chips(io); check(res, io); },
      onSerial: function (t) { serialBlink = Date.now(); if (out) { out.textContent += t; if (out.textContent.length > 4000) out.textContent = out.textContent.slice(-3000); out.scrollTop = out.scrollHeight; } check(lastRes, sim.io); },
      onError: function (e) { msg.textContent = "Stopped at line " + e.line + ": " + e.msg; },
      onStop: function () { runB.className = "aem-btn run"; runB.innerHTML = "&#9654; Start"; lastRes = sim.analysis(); R.update(svg, project, lastRes, sim.io, {}); chips(sim.io); }
    });
    sim.speed = cfg.speed || 1; host.querySelector('[data-a="speed"]').value = String(sim.speed);
    coach = root.ArduinoCoach.attach(wrap, { topics: TIPS.topics, openTopic: openTip, events: cfg.events || [] });
    function refresh() { draw(); sim.markDirty(); lastRes = sim.analysis(); R.update(svg, project, lastRes, sim.io, {}); chips(sim.io); check(lastRes, sim.io); }
    function start() {
      if (sim.running) { sim.stop(true); return; }
      armed = true; msg.textContent = ""; if (out) out.textContent = ""; goalState = {};
      var r = sim.start(ta ? ta.value : "void setup() {}\nvoid loop() {}");
      if (!r.ok) { msg.textContent = "Code error on line " + r.errors[0].line + ": " + r.errors[0].msg; return; }
      runB.className = "aem-btn stop"; runB.innerHTML = "&#9632; Stop";
    }
    function reset() { if (sim.running) sim.stop(true); project = JSON.parse(original); applied = {}; host.querySelectorAll("[data-exp]").forEach(function (b) { b.classList.remove("on"); }); if (ta) ta.value = code0 || ""; if (out) out.textContent = ""; msg.textContent = ""; sim.resetPins(); coach.reset(); doneGoals = {}; host.querySelectorAll(".aem-goals li").forEach(function (l) { l.classList.remove("done"); }); armed = false; refresh(); }
    host.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-a],[data-exp],[data-var]") : null; if (!b) return;
      var a = b.getAttribute("data-a");
      if (a === "run") start(); else if (a === "reset") reset();
      else if (b.hasAttribute("data-exp")) {
        var i = +b.getAttribute("data-exp"), ex = exps[i], wasRunning = sim.running; if (wasRunning) sim.stop(true);
        if (applied[i]) { ex.undo(project); if (ta && ex.codeUndoFrom) ta.value = ta.value.replace(ex.codeUndoFrom, ex.codeUndoTo); applied[i] = false; b.classList.remove("on"); } else { ex.apply(project); if (ta && ex.codeFrom) ta.value = ta.value.replace(ex.codeFrom, ex.codeTo); applied[i] = true; b.classList.add("on"); armed = true; }
        refresh(); if (wasRunning) start();
      } else if (b.hasAttribute("data-var")) { var v = cfg.variants[+b.getAttribute("data-var")]; if (sim.running) sim.stop(true); if (ta) ta.value = v.code; if (out) out.textContent = ""; start(); }
    });
    host.querySelector('[data-a="speed"]').addEventListener("change", function () { sim.speed = +this.value || 1; });
    refresh(); host._aem = { sim: sim, start: start, reset: reset, project: function () { return project; } };
    return host._aem;
  }
  root.ArduinoEmbed = { mount: mount, presets: PRESETS, openTip: openTip };
  document.addEventListener("click", function (e) { var b = e.target.closest ? e.target.closest("[data-coachtip],[data-tip]") : null; if (b && b.getAttribute("data-tip")) openTip(b.getAttribute("data-tip")); });
})(typeof window !== "undefined" ? window : globalThis);
