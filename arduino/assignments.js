/* The Arduino assignments for the editor (arduino/editor.html).
   Each step item has a text and an auto-check. The check gets a context (c) with the student's circuit and code:
     c.count("led")  c.parts("resistor")  c.code(/regex/)  c.comments()  c.compiled  c.pin("D8")  c.netOf(part, "A")  c.gnd
     await c.run({ until, samples, events })  -> a simulated run (pin values and LED brightness at the sample times)
   A check returns true or false. Add more assignments below the same way (a4, a5, ...). */
(function (root) {
  "use strict";
  function every(r, t, fn) { return r.samples.length > 0 && r.samples.every(function (s, i) { return fn(s, i); }); }
  function ledOnPin(c) { return c.parts("led")[0]; }
  /* is there a working LED circuit on the given pin (with a resistor)? */
  function ledCircuit(c, pin, lo, hi) {
    var led = ledOnPin(c); if (!led) return false;
    var r = c.staticRun({ pins: (function () { var o = {}; o[pin] = { mode: 1, value: 1, pwm: null, tone: 0 }; return o; })() });
    var L = r.leds[led.id]; return !!L && !L.blown && L.current >= lo && L.current <= hi;
  }
  var A = {};

  A.a1 = { title: "Blink the Built-in Light", intro: "The Arduino has a small orange light marked <b>L</b> that is wired to pin 13. You will make it blink. No wires are needed for this one.", steps: [
    { h: "Step 1: Type the blink program", code: "void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}", items: [
      { t: "Type the program from the code box above into the code editor (the Code tab on the right). Type it yourself, line by line.", check: function (c) { return c.compiled && c.code(/void\s+setup\s*\(\s*\)\s*\{[^}]*pinMode\s*\(\s*(13|LED_BUILTIN)\s*,\s*OUTPUT\s*\)\s*;/) && c.code(/void\s+loop\s*\(\s*\)\s*\{[^}]*digitalWrite\s*\(\s*(13|LED_BUILTIN)\s*,\s*HIGH\s*\)\s*;[^}]*delay\s*\(/) && c.code(/digitalWrite\s*\(\s*(13|LED_BUILTIN)\s*,\s*LOW\s*\)\s*;/); } }
    ] },
    { h: "Step 2: Run it", items: [
      { t: "Click <b>Start Simulation</b>. Watch the orange <b>L</b> light on the Arduino. It should be on for one second, then off for one second.", check: function (c) { return c.run({ until: 4200, samples: [500, 1500, 2500, 3500] }).then(function (r) { return every(r, 0, function (s, i) { return s.pins[13] === (i % 2 === 0 ? 1 : 0); }); }); } }
    ] },
    { h: "Step 3: Blink faster", items: [
      { t: "Change both <b>delay(1000)</b> numbers to <b>delay(200)</b>. The light should now blink 5 times as fast.", check: function (c) { return c.run({ until: 900, samples: [100, 300, 500, 700] }).then(function (r) { return every(r, 0, function (s, i) { return s.pins[13] === (i % 2 === 0 ? 1 : 0); }); }); } },
      { t: "Add a comment at the end of the <b>pinMode</b> line that says what it does (start the comment with //).", check: function (c) { return c.code(/pinMode\s*\([^)]*\)\s*;[ \t]*\/\/[ \t]*\S/, true); } }
    ] }
  ] };

  A.a2 = { title: "Wire an External LED", intro: "Now you will build a real circuit: an LED and a resistor on the breadboard, wired to pin 8. The resistor protects the LED. Without it the LED burns out!", steps: [
    { h: "Step 1: Add the parts", items: [
      { t: "Click <b>LED</b> in the parts bar, and click <b>Resistor</b>. They appear on the canvas.", check: function (c) { return c.count("led") >= 1 && c.count("resistor") >= 1; } },
      { t: "Click the resistor, then choose <b>220</b> ohms in the box under the canvas.", check: function (c) { return c.parts("resistor").some(function (p) { return +(p.props && p.props.ohms) === 220; }); } }
    ] },
    { h: "Step 2: Build the circuit", items: [
      { t: "Drag the resistor onto the breadboard so <b>both</b> of its legs go into holes (the leg dots turn green).", check: function (c) { return c.parts("resistor").some(function (p) { return c.plugged(p); }); } },
      { t: "Drag the LED onto the breadboard so its <b>long leg</b> (the + leg, marked +) is in the same column as <b>one leg of the resistor</b>, and its short leg is in a different column.", check: function (c) { var l = ledOnPin(c), r = c.parts("resistor")[0]; return !!l && !!r && c.plugged(l) && (c.netOf(l, "A") === c.netOf(r, "1") || c.netOf(l, "A") === c.netOf(r, "2")) && c.netOf(l, "A") !== c.netOf(l, "K"); } },
      { t: "Use a wire to connect <b>pin 8</b> on the Arduino to the <b>other leg of the resistor</b> (click a hole or pin, drag, and let go on the other one).", check: function (c) { var l = ledOnPin(c), r = c.parts("resistor")[0]; if (!l || !r) return false; var d8 = c.pin("D8"), a1 = c.netOf(r, "1"), a2 = c.netOf(r, "2"), la = c.netOf(l, "A"); return (d8 === a1 && a2 === la) || (d8 === a2 && a1 === la); } },
      { t: "Use a wire to connect the LED's <b>short leg</b> to <b>GND</b> on the Arduino (the GND pin on the top row, or the blue &minus; rail).", check: function (c) { var l = ledOnPin(c); return !!l && c.netOf(l, "K") === c.gnd; } },
      { t: "Test: when pin 8 is HIGH, the LED should glow (about 10 to 15 mA flows). Look for the <b>green leg dots</b> if it does not.", check: function (c) { return ledCircuit(c, 8, 5, 25); } }
    ] },
    { h: "Step 3: Make it blink", code: "void setup() {\n  pinMode(8, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(8, HIGH);\n  delay(500);\n  digitalWrite(8, LOW);\n  delay(500);\n}", items: [
      { t: "Type the program from the code box into the code editor.", check: function (c) { return c.compiled && c.code(/pinMode\s*\(\s*8\s*,\s*OUTPUT\s*\)/) && c.code(/digitalWrite\s*\(\s*8\s*,\s*HIGH\s*\)/) && c.code(/digitalWrite\s*\(\s*8\s*,\s*LOW\s*\)/); } },
      { t: "Click <b>Start Simulation</b>. Your LED should blink twice every second.", check: function (c) { var l = ledOnPin(c); if (!l) return false; return c.run({ until: 2200, samples: [250, 750, 1250, 1750] }).then(function (r) { return every(r, 0, function (s, i) { var b = s.leds[l.id] || 0; return i % 2 === 0 ? b > 0.3 : b < 0.05; }); }); } }
    ] }
  ] };

  A.a3 = { title: "Pushbutton Controls the LED", intro: "A button is a switch. When you press it, it joins two sides of a circuit. You will wire a button to pin 2 so that holding it turns the LED on.", steps: [
    { h: "Step 1: The LED circuit", items: [
      { t: "Build the LED circuit from Assignment 2 again: <b>pin 8</b> to a <b>220 &#937; resistor</b> to the LED's <b>long leg</b>, and the LED's <b>short leg</b> to <b>GND</b>.", check: function (c) { return ledCircuit(c, 8, 5, 25); } }
    ] },
    { h: "Step 2: Add the button", items: [
      { t: "Click <b>Pushbutton</b>. Drag it onto the breadboard so it <b>straddles the center gap</b>: two legs on the top half and two legs on the bottom half. All four leg dots must turn green.", check: function (c) { var b = c.parts("button")[0]; return !!b && c.plugged(b) && c.netOf(b, "TL") !== c.netOf(b, "BL"); } },
      { t: "Use a wire to connect <b>one side</b> of the button to <b>pin 2</b> on the Arduino.", check: function (c) { var b = c.parts("button")[0]; if (!b) return false; var d2 = c.pin("D2"); return c.netOf(b, "TL") === d2 || c.netOf(b, "BL") === d2; } },
      { t: "Use a wire to connect the <b>other side</b> of the button to <b>GND</b>.", check: function (c) { var b = c.parts("button")[0]; if (!b) return false; return (c.netOf(b, "TL") === c.gnd && c.netOf(b, "BL") === c.pin("D2")) || (c.netOf(b, "BL") === c.gnd && c.netOf(b, "TL") === c.pin("D2")); } }
    ] },
    { h: "Step 3: The program", code: "void setup() {\n  pinMode(2, INPUT_PULLUP);\n  pinMode(8, OUTPUT);\n}\n\nvoid loop() {\n  if (digitalRead(2) == LOW) {\n    digitalWrite(8, HIGH);\n  } else {\n    digitalWrite(8, LOW);\n  }\n}", items: [
      { t: "Type the program from the code box. <b>INPUT_PULLUP</b> keeps pin 2 HIGH until the button connects it to GND (LOW).", check: function (c) { return c.compiled && c.code(/pinMode\s*\(\s*2\s*,\s*INPUT_PULLUP\s*\)/) && c.code(/digitalRead\s*\(\s*2\s*\)/) && c.code(/digitalWrite\s*\(\s*8\s*,\s*HIGH\s*\)/) && c.code(/digitalWrite\s*\(\s*8\s*,\s*LOW\s*\)/); } },
      { t: "Click <b>Start Simulation</b>, then <b>press and hold</b> the button on the canvas. The LED should be on only while you hold it.", check: function (c) { var l = ledOnPin(c), b = c.parts("button")[0]; if (!l || !b) return false; return c.run({ until: 1300, samples: [150, 600, 1100], events: [{ t: 300, press: b.id, down: true }, { t: 800, press: b.id, down: false }] }).then(function (r) { var s = r.samples; return s.length === 3 && (s[0].leds[l.id] || 0) < 0.05 && (s[1].leds[l.id] || 0) > 0.3 && (s[2].leds[l.id] || 0) < 0.05; }); } },
      { t: "Add a comment above the <b>if</b> line that explains why the program checks for LOW.", check: function (c) { return c.code(/\/\/[^\n]*\n\s*if\s*\(/, true); } }
    ] }
  ] };

  root.ARD_ASSIGN = A;
  root.ARD_SLOTS = [["free", "Free build (practice)"], ["a1", "Assignment 1: Blink the Built-in Light"], ["a2", "Assignment 2: Wire an External LED"], ["a3", "Assignment 3: Pushbutton Controls the LED"]];
})(typeof window !== "undefined" ? window : globalThis);
