/* EC Unit 3 assignments, part 2: 3.5 Displays, 3.6 Inputs Drive Outputs, 3.7 Functions and Arrays, 3.8 Test and Debug. */
(function (root) {
  "use strict";
  var A = root.ARD_ASSIGN, H = root.ARD_H, I = H.I, ASK = H.ASK, NOTE = H.NOTE;
  function bodyOf(c, name) {
    var m = new RegExp("\\b(?:void|int|long|float|bool|boolean|byte|char)\\s+" + name + "\\s*\\([^)]*\\)\\s*\\{").exec(c.noComments); if (!m) return null;
    var s = c.noComments, i = m.index + m[0].length, d = 1, j = i; for (; j < s.length && d > 0; j++) { if (s[j] === "{") d++; else if (s[j] === "}") d--; }
    return s.slice(i, j - 1);
  }
  function stmtsOf(c, name) { var b = bodyOf(c, name); return b ? H.stmts(b) : []; }
  function btnPin(c, want) {
    var b = c.parts("button")[0]; if (!b || !c.plugged(b) || c.netOf(b, "TL") === c.netOf(b, "BL")) return false;
    var sides = [c.netOf(b, "TL"), c.netOf(b, "BL")];
    for (var s = 0; s < 2; s++) if (sides[s] === c.gnd && c.pin("D" + want) === sides[1 - s]) return true;
    return false;
  }
  function userFns(c) {
    var out = [], re = /\b(void|int|long|float|bool|boolean|byte|char)\s+(\w+)\s*\(([^)]*)\)\s*\{/g, m;
    while ((m = re.exec(c.noComments))) if (m[2] !== "setup" && m[2] !== "loop") out.push({ type: m[1], name: m[2], params: m[3].trim() });
    return out;
  }
  function commentsCheck(oldRe, newRe) { return function (c) { return H.sixComments(c.raw, function (l) { if (newRe.test(l)) return "new"; if (oldRe.test(l)) return "old"; return null; }); }; }
  var SIX = function (olds, news) { return "<b>Comments:</b> choose <b>6 lines of code</b> you wrote and add a comment to each one (above the line or at the end of it) saying what it does in your own words. Pick <b>3 lines from earlier lessons</b> (" + olds + ") and <b>3 lines with this lesson's new ideas</b> (" + news + "). Don't comment lines that are only brackets."; };

  /* ===================================================================================== 3.5 */
  A["u3-5"] = { title: "3.5 Displays: 7-Segment Counter", short: "3.5", parts: ["seg7", "button"], intro: "Build a <b>4-digit 7-segment display</b> and make it count up, like a microwave or a scoreboard. This display is special: instead of the 11 separate wires a raw 7-segment display would need, it uses a 2-wire protocol called <b>I2C</b>, so it only needs <b>4 wires</b>. A small chip on the back (the <b>HT16K33</b>) does all the hard work. [[What is I2C?|i2c]] [[How does the display work?|sevenseg]]", help: ["tour", "sevenseg", "i2c", "include"], steps: [
    { h: "Step 1 to 2: Wire it up", intro: "Drag in the <b>7-segment display</b> and a <b>pushbutton</b>. Look at the pins on the display: <b>+</b>, <b>&minus;</b>, <b>D</b> (data) and <b>C</b> (clock).", items: [
      I("Add the <b>4-digit 7-segment display</b> and a <b>pushbutton</b> to the breadboard (all leg dots green).", function (c) { var d = c.parts("seg7")[0], k = c.parts("button")[0]; return !!d && !!k && c.plugged(d) && c.plugged(k); }, ["dragpart", "plugged", "sevenseg"]),
      I("Display <b>+</b> &rarr; Arduino <b>5V</b> and display <b>&minus;</b> &rarr; <b>GND</b>.", function (c) { var d = c.parts("seg7")[0], s = d && c.statics().seg[d.id]; return !!s && s.powered; }, ["sevenseg", "fivev", "gnd", "makewire"]),
      I("Display <b>D</b> (data) &rarr; Arduino <b>A4</b> (also called SDA) and display <b>C</b> (clock) &rarr; Arduino <b>A5</b> (also called SCL).", function (c) { var d = c.parts("seg7")[0], s = d && c.statics().seg[d.id]; return !!s && s.sda && s.scl; }, ["i2c", "makewire", "pins"]),
      I("<b>Button</b>: one side &rarr; <b>pin 2</b>, the other side &rarr; <b>GND</b>.", function (c) { return btnPin(c, 2); }, ["button", "pullup", "makewire"])
    ] },
    { h: "Step 3 to 4: Set up the display in code", code: "#include <Wire.h>\n#include \"Adafruit_LEDBackpack.h\"\n\nAdafruit_7segment matrix = Adafruit_7segment();\nint count = 0;\n\nvoid setup() {\n  matrix.begin(0x70);\n  pinMode(2, INPUT_PULLUP);\n}", intro: "The editor already includes the library for this display. You load it with the two <code>#include</code> lines. <code>0x70</code> is the display's <b>I2C address</b>: the &quot;name&quot; the chip listens for on the shared wires.", items: [
      I("<b>Very first line:</b> <code>#include &lt;Wire.h&gt;</code>. <b>Next line:</b> <code>#include \"Adafruit_LEDBackpack.h\"</code>", function (c) { var ls = c.raw.split("\n").filter(function (l) { return l.trim(); }); return /^\s*#\s*include\s*<\s*Wire\.h\s*>/.test(ls[0] || "") && /^\s*#\s*include\s*"\s*Adafruit_LEDBackpack\.h\s*"/.test(ls[1] || ""); }, ["include", "i2c"]),
      I("<b>Above</b> setup(): <code>Adafruit_7segment matrix = Adafruit_7segment();</code> and <code>int count = 0;</code>", function (c) { return /Adafruit_7segment\s+matrix\s*=\s*Adafruit_7segment\s*\(\s*\)\s*;/.test(c.noComments) && /int\s+count\s*=\s*0\s*;/.test(c.noComments); }, ["sevenseg", "variables"]),
      I("<b>Inside setup():</b> <code>matrix.begin(0x70);</code> and <code>pinMode(2, INPUT_PULLUP);</code>", function (c) { var s = H.setupStmts(c); return s.indexOf("matrix.begin(0x70)") > -1 && s.indexOf("pinMode(2,INPUT_PULLUP)") > -1; }, ["i2c", "pinmode", "pullup"])
    ] },
    { h: "Step 5: Show a number", code: "void loop() {\n  matrix.print(count);\n  matrix.writeDisplay();\n}", intro: "<code>print()</code> loads the number into the display's memory, the same way <code>Serial.print()</code> works. <code>writeDisplay()</code> is what actually sends it over I2C and lights up the display. You need <b>both</b> lines every time you want the screen to update.", items: [
      I("<b>Inside loop(), last two lines:</b> <code>matrix.print(count);</code> then <code>matrix.writeDisplay();</code>", function (c) { var b = H.squash(H.body(c.noComments, "loop") || ""); return /matrix\.print\(count\);matrix\.writeDisplay\(\);$/.test(b); }, ["sevenseg", "i2c"]),
      I("Click <b>Start Simulation</b>. You should see <b>0</b> on the display.", function (c) { var d = c.parts("seg7")[0]; if (!d || !c.compiled) return false; return c.run({ until: 600, samples: [300] }).then(function (r) { var s = r.samples[0]; return !!s && !!s.seg && s.seg.digits.map(function (x) { return x.ch; }).join("") === "   0"; }); }, ["startsim", "sevenseg", "trouble-nolight"])
    ] },
    { h: "Step 6: Count up with the button", code: "void loop() {\n  if (digitalRead(2) == LOW) {\n    count++;\n    if (count > 9999) count = 0;\n    delay(150);\n  }\n  matrix.print(count);\n  matrix.writeDisplay();\n}", intro: "Add this <b>above</b> the two lines from Step 5, so the display always shows the most current count.", items: [
      I("<b>Inside loop(), above the two display lines:</b> an <code>if (digitalRead(2) == LOW) { ... }</code> with <code>count++;</code>, <code>if (count &gt; 9999) count = 0;</code> and <code>delay(150);</code> inside it.", function (c) { var b = H.body(c.noComments, "loop") || ""; return /if\s*\(\s*digitalRead\s*\(\s*2\s*\)\s*==\s*LOW\s*\)/.test(b) && /count\s*(\+\+|\+=\s*1|=\s*count\s*\+\s*1)/.test(b) && /if\s*\(\s*count\s*>\s*9999\s*\)\s*(\{\s*)?count\s*=\s*0/.test(b) && /delay\s*\(\s*150\s*\)/.test(b); }, ["ifelse", "digitalread", "sevenseg"]),
      I("Click the pushbutton <b>3 times</b> in the simulation. The display climbs to <b>3</b>.", function (c) { var d = c.parts("seg7")[0], b = c.parts("button")[0]; if (!d || !b || !c.compiled) return false; var ev = []; [500, 1000, 1500].forEach(function (t) { ev.push({ t: t, press: b.id, down: true }); ev.push({ t: t + 100, press: b.id, down: false }); }); return c.run({ until: 2400, samples: [400, 2200], events: ev }).then(function (r) { var s = r.samples; return s.length === 2 && !!s[0].seg && !!s[1].seg && s[0].seg.digits.map(function (x) { return x.ch; }).join("") === "   0" && s[1].seg.digits.map(function (x) { return x.ch; }).join("") === "   3"; }); }, ["button", "sevenseg", "pullup"]),
      I(SIX("<code>pinMode</code>, <code>digitalRead</code>, <code>delay</code>, <code>int count</code>", "the <code>#include</code>, <code>matrix.begin</code>, <code>matrix.print</code> and <code>matrix.writeDisplay</code> lines"), commentsCheck(/pinMode|digitalRead|delay|\bint\b/, /include|matrix/), ["comments"])
    ] },
    { h: "Reflection (type your answers)", items: [
      ASK("This display connects with only <b>4 wires</b>. What does each one do (+, &minus;, D and C)?", 30, ["sevenseg", "i2c"]),
      ASK("How does the <b>pushbutton</b> work? What does pin 2 read when the button is <b>not</b> pressed, and what does it read when you press it?", 30, ["pullup", "button"]),
      ASK("What does <code>matrix.writeDisplay()</code> do, and why do you need it after <code>matrix.print(count)</code>?", 25, ["sevenseg"]),
      ASK("What is <b>I2C</b>, and what does it do for this display?", 25, ["i2c"])
    ] }
  ], events: [
    { id: "seg-shows", when: function (c) { return !!(c.sim && c.sim.dev && c.sim.dev.seg && c.sim.dev.seg.shown); }, title: "The display is showing a number! 🔢", help: ["sevenseg", "i2c"], html: "Your <code>print()</code> put the number in the display chip's memory, and <code>writeDisplay()</code> sent it over the two I2C wires. The chip lights each digit's segments by itself, all the time. You never touch a segment." },
    { id: "seg-swapped", when: function (c) { var s = c.res && c.res.seg; return !!(s && Object.keys(s).some(function (k) { return s[k].swapped; })); }, title: "D and C are swapped", help: ["i2c"], html: "On an Uno, <b>D (data)</b> goes to <b>A4 (SDA)</b> and <b>C (clock)</b> goes to <b>A5 (SCL)</b>. You have them the other way around, so the chip can not hear the Arduino." },
    { id: "seg-nobegin", when: function (c) { return !!(c.sim && c.sim.history && c.sim.history.segNoBegin); }, title: "The display was never started", help: ["sevenseg", "i2c"], html: "Add <code>matrix.begin(0x70);</code> inside setup(). That tells the Arduino to start talking to the chip at I2C address <b>0x70</b>." }
  ] };

  /* ===================================================================================== 3.6 */
  A["u3-6"] = { title: "3.6 Inputs Drive Outputs", short: "3.6", parts: ["pot", "servo", "buzzer"], intro: "So far you've made outputs do things on a timer. Today a <b>dial in your hand controls them live</b>. This is how nearly every embedded system works: <b>read an input, think about it, then act</b>. A <b>potentiometer</b> is a dial with 3 legs: the middle leg (the <b>wiper</b>) gives a voltage from 0V to 5V depending on where the dial is. [[What is a potentiometer?|pot]] [[What does analogRead do?|analogread]] [[What does map() do?|map]]", help: ["tour", "pot", "analogread", "map", "servo"], steps: [
    { h: "Part 1: Build the circuit", items: [
      I("Add a <b>potentiometer</b>, a <b>servo</b> and a <b>piezo buzzer</b> to the breadboard (all leg dots green).", function (c) { var p = c.parts("pot")[0], s = c.parts("servo")[0], b = c.parts("buzzer")[0]; return !!p && !!s && !!b && [p, s, b].every(c.plugged); }, ["dragpart", "plugged", "pot"]),
      I("<b>Pot, one outer leg</b> &rarr; <b>5V</b>. <b>Other outer leg</b> &rarr; <b>GND</b>.", function (c) { var p = c.parts("pot")[0]; if (!p) return false; var a = c.netOf(p, "1"), b = c.netOf(p, "2"); return (a === c.v5 && b === c.gnd) || (a === c.gnd && b === c.v5); }, ["pot", "fivev", "gnd", "makewire"]),
      I("<b>Pot middle leg (wiper)</b> &rarr; <b>A0</b>.", function (c) { var p = c.parts("pot")[0]; return !!p && c.netOf(p, "W") === c.pin("A0"); }, ["pot", "analogread", "pins"]),
      I("<b>Servo signal wire</b> &rarr; <b>pin 9</b>, and the servo's <b>power and ground</b> &rarr; 5V and GND.", function (c) { var s = c.parts("servo")[0], v = c.statics().servos; return !!s && !!v[s.id] && v[s.id].pin === 9 && v[s.id].powered; }, ["servo", "makewire", "fivev", "gnd"]),
      I("<b>Buzzer positive (+)</b> &rarr; <b>pin 8</b>, <b>negative (&minus;)</b> &rarr; <b>GND</b>.", function (c) { var b = c.parts("buzzer")[0]; return !!b && c.buzzerOnPin(8).indexOf(b.id) > -1; }, ["buzzer", "makewire"])
    ] },
    { h: "Part 2: The dial moves the servo", code: "#include <Servo.h>\n\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int reading = analogRead(A0);\n  int angle = map(reading, 0, 1023, 0, 180);\n  myServo.write(angle);\n  Serial.println(angle);\n  delay(15);\n}", intro: "<code>analogRead(A0)</code> reads the wiper's voltage and gives you a number from <b>0 to 1023</b> (it only works on the analog pins A0 to A5). <code>map(value, fromLow, fromHigh, toLow, toHigh)</code> rescales a number from one range to another: <code>map(512, 0, 1023, 0, 180)</code> gives about 90.", items: [
      I("<b>First line</b> of the file: <code>#include &lt;Servo.h&gt;</code>. <b>Above</b> setup(): <code>Servo myServo;</code>", function (c) { var first = c.raw.split("\n").filter(function (l) { return l.trim(); })[0] || ""; return /^\s*#\s*include\s*<\s*Servo\.h\s*>/.test(first) && /\bServo\s+myServo\s*;/.test(c.noComments); }, ["include", "servo"]),
      I("<b>Inside setup():</b> <code>myServo.attach(9);</code> and <code>Serial.begin(9600);</code>", function (c) { var s = H.setupStmts(c); return s.indexOf("myServo.attach(9)") > -1 && s.indexOf("Serial.begin(9600)") > -1; }, ["servo", "serial"]),
      I("<b>Inside loop(),</b> in order: <code>int reading = analogRead(A0);</code>, <code>int angle = map(reading, 0, 1023, 0, 180);</code>, <code>myServo.write(angle);</code>, <code>Serial.println(angle);</code>, <code>delay(15);</code>", function (c) { var s = H.loopStmts(c); return H.startsWith(s, ["intreading=analogRead(A0)", "intangle=map(reading,0,1023,0,180)", "myServo.write(angle)", "Serial.println(angle)", "delay(15)"]); }, ["analogread", "map", "servo", "serial"]),
      I("Click <b>Start Simulation</b>, then <b>click and drag the dial</b> on the canvas (or use the slider under it). The servo <b>follows the dial</b> from one end to the other, and the Serial Monitor shows the angle.", function (c) { var p = c.parts("pot")[0], sv = c.parts("servo")[0]; if (!p || !sv || !c.compiled) return false; return c.run({ until: 1600, samples: [100], events: [{ t: 300, pot: p.id, pos: 0 }, { t: 800, pot: p.id, pos: 1 }] }).then(function (r) { var log = (r.history && r.history.servoLog) || [], mn = Math.min.apply(null, log), mx = Math.max.apply(null, log); return log.length > 10 && mn <= 5 && mx >= 175 && /\d/.test(r.serial); }); }, ["startsim", "pot", "serialmon"])
    ] },
    { h: "Reflection (type your answers)", items: [
      ASK("What does a <b>potentiometer</b> do? What changes on the middle leg (the wiper) when you turn the dial?", 30, ["pot"]),
      ASK("<code>analogRead(A0)</code> gives a number from 0 to 1023. What is that number <b>actually representing</b>?", 25, ["analogread", "voltage"]),
      ASK("Which Arduino pin is the servo's signal wire connected to, and <b>which line of code</b> tells the Arduino to use that pin?", 20, ["servo", "pins"]),
      ASK("What does <code>Serial.println(angle)</code> do, and <b>where do you see</b> what it prints?", 20, ["serial", "serialmon"])
    ] }
  ], events: [
    { id: "pot-turn", when: function (c) { return !!(c.sim && c.sim.running && c.project && c.project.parts.some(function (p) { return p.type === "pot" && p.props && p.props.pos !== undefined && Math.abs(+p.props.pos - 0.5) > 0.05; })); }, title: "You turned the dial! 🎛️", help: ["pot", "analogread"], html: "Turning the knob slides the wiper along a strip of resistance, so the voltage on the middle leg moves between <b>0V and 5V</b>. <code>analogRead</code> turns that voltage into a number from <b>0 to 1023</b>." }
  ] };

  /* ===================================================================================== 3.7 */
  A["u3-7"] = { title: "3.7 Code Toolkit: Functions and Arrays", short: "3.7", parts: ["led", "resistor"], intro: "Learn to write code that stays <b>short and easy to fix</b>, using functions and arrays. You'll build a <b>scanner light</b> like the front of a robot car in a movie. A <b>function</b> is a named chunk of code you can reuse (you can hand it a value, a <b>parameter</b>, and it can hand one back, a <b>return value</b>). An <b>array</b> is a list stored under one name, and its positions (<b>indexes</b>) start at 0. An array with 5 items has indexes 0 to 4. There is no index 5! [[Functions|functions]] [[Arrays|arrays]] [[Return values|returns]]", help: ["tour", "functions", "arrays", "returns", "loops"], steps: [
    { h: "Part 1: Build the circuit", intro: "Five LEDs in a row. Each pin goes through its own resistor to the LED's long leg (anode), and the short leg (cathode) goes to GND.", items: [
      I("Add <b>five LEDs</b> and <b>five 220 &Omega; resistors</b> to the breadboard.", function (c) { return c.count("led") >= 5 && c.count("resistor") >= 5 && c.parts("led").concat(c.parts("resistor")).every(c.plugged) && c.parts("resistor").every(function (r) { return +(r.props && r.props.ohms) === 220; }); }, ["dragpart", "ledresistor", "resistorvalue"]),
      I("Wire LED 1 to <b>pin 2</b>, LED 2 to <b>pin 3</b>, LED 3 to <b>pin 4</b>, LED 4 to <b>pin 5</b> and LED 5 to <b>pin 6</b> (each through its own resistor, all cathodes to GND). Pin by pin, <b>exactly one LED</b> lights.", function (c) { var seen = {}; for (var p = 2; p <= 6; p++) { var on = c.ledsOnPin(p); if (on.length !== 1 || seen[on[0]]) return false; seen[on[0]] = 1; } return true; }, ["pins", "ledresistor", "gnd", "makewire"])
    ] },
    { h: "Part 2: Setup with an array", code: "const int ledPins[] = {2, 3, 4, 5, 6};\nconst int NUM_LEDS = 5;\n\nvoid setup() {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    pinMode(ledPins[i], OUTPUT);\n  }\n}", items: [
      I("<b>Above</b> setup(): <code>const int ledPins[] = {2, 3, 4, 5, 6};</code> and <code>const int NUM_LEDS = 5;</code>", function (c) { return /const\s+int\s+ledPins\s*\[\s*\]\s*=\s*\{\s*2\s*,\s*3\s*,\s*4\s*,\s*5\s*,\s*6\s*\}\s*;/.test(c.noComments) && /const\s+int\s+NUM_LEDS\s*=\s*5\s*;/.test(c.noComments); }, ["arrays", "constants"]),
      I("<b>Inside setup():</b> a <code>for</code> loop (<code>i</code> from 0 while <code>i &lt; NUM_LEDS</code>) with <code>pinMode(ledPins[i], OUTPUT);</code> inside.", function (c) { var b = H.body(c.noComments, "setup") || ""; return /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*NUM_LEDS\s*;\s*i\s*\+\+\s*\)/.test(b) && /pinMode\s*\(\s*ledPins\s*\[\s*i\s*\]\s*,\s*OUTPUT\s*\)/.test(b); }, ["loops", "arrays", "pinmode"])
    ] },
    { h: "Part 3: Your functions", code: "void allOff() {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    digitalWrite(ledPins[i], LOW);\n  }\n}\n\nvoid showLed(int index) {\n  allOff();\n  digitalWrite(ledPins[index], HIGH);\n}\n\nvoid scan(int speed) {\n  for (int i = 0; i < NUM_LEDS; i++) {\n    showLed(i);\n    delay(speed);\n  }\n  for (int i = NUM_LEDS - 2; i >= 1; i--) {\n    showLed(i);\n    delay(speed);\n  }\n}\n\nvoid loop() {\n  scan(100);\n}", intro: "Add each of these functions <b>above</b> loop(), after setup().", items: [
      I("<code>void allOff()</code>: a <code>for</code> loop that does <code>digitalWrite(ledPins[i], LOW);</code> for every LED.", function (c) { var b = bodyOf(c, "allOff"); return !!b && /for\s*\(/.test(b) && /digitalWrite\s*\(\s*ledPins\s*\[\s*i\s*\]\s*,\s*LOW\s*\)/.test(b); }, ["functions", "loops", "digitalwrite"]),
      I("<code>void showLed(int index)</code>: calls <code>allOff();</code> then <code>digitalWrite(ledPins[index], HIGH);</code>", function (c) { var s = stmtsOf(c, "showLed"); return /void\s+showLed\s*\(\s*int\s+index\s*\)/.test(c.noComments) && s.indexOf("allOff()") === 0 && s.indexOf("digitalWrite(ledPins[index],HIGH)") === 1; }, ["functions", "digitalwrite"]),
      I("<code>void scan(int speed)</code>: one <code>for</code> loop sweeping <b>forward</b> through the LEDs and one sweeping <b>back</b>, each with <code>showLed(i);</code> and <code>delay(speed);</code>.", function (c) { var b = bodyOf(c, "scan") || ""; var f = b.match(/for\s*\([^)]*\)/g) || []; return /void\s+scan\s*\(\s*int\s+speed\s*\)/.test(c.noComments) && f.length >= 2 && (b.match(/showLed\s*\(\s*i\s*\)/g) || []).length >= 2 && (b.match(/delay\s*\(\s*speed\s*\)/g) || []).length >= 2; }, ["functions", "loops"]),
      I("<b>Inside loop():</b> <code>scan(100);</code> (the scan function plus other things is fine, but loop() must call <code>scan</code>).", function (c) { return H.loopStmts(c).some(function (s) { return /^scan\(.+\)$/.test(s); }); }, ["functions"]),
      I("Run it. <b>One light sweeps back and forth</b>, one LED at a time.", function (c) { if (!c.compiled || c.count("led") < 5) return false; var byPin = []; for (var p = 2; p <= 6; p++) byPin.push(c.ledsOnPin(p)[0]); return c.run({ until: 900, samples: [50, 150, 250, 350, 450, 550, 650, 750] }).then(function (r) { var want = [0, 1, 2, 3, 4, 3, 2, 1]; return r.samples.length === 8 && r.samples.every(function (s, i) { var lit = byPin.filter(function (id) { return (s.leds[id] || 0) > 0.25; }); return lit.length === 1 && byPin.indexOf(lit[0]) === want[i]; }); }); }, ["startsim", "loops"])
    ] },
    { h: "Part 4: Make it your own", intro: "Now add to your toolkit. Write <b>a function with a parameter</b>, <b>a function that returns a value</b>, and <b>a second pattern</b> for your LEDs.", items: [
      I("Write <b>at least 2 new functions</b> of your own (besides allOff, showLed and scan), and <b>use at least one parameter</b> in a new function.", function (c) { var f = userFns(c).filter(function (x) { return ["allOff", "showLed", "scan"].indexOf(x.name) === -1; }); return f.length >= 2 && f.some(function (x) { return x.params.length > 0 && x.params !== "void"; }); }, ["functions"]),
      I("One of your functions <b>returns a value</b> (like <code>int something() { ... return ...; }</code>) and your code uses it.", function (c) { var f = userFns(c).filter(function (x) { return x.type !== "void"; }); return f.some(function (x) { var b = bodyOf(c, x.name) || ""; return /\breturn\b/.test(b) && new RegExp("\\b" + x.name + "\\s*\\(").test(c.noComments.replace(new RegExp("\\b(int|long|float|bool|boolean)\\s+" + x.name + "\\s*\\("), "")); }); }, ["functions", "returns"]),
      I("<b>A second pattern:</b> <code>loop()</code> calls <b>two or more different functions</b> you wrote (for example <code>scan(100)</code> and your new pattern).", function (c) { var names = userFns(c).map(function (x) { return x.name; }), called = {}; (H.body(c.noComments, "loop") || "").replace(/\b(\w+)\s*\(/g, function (m, n) { if (names.indexOf(n) > -1) called[n] = 1; return m; }); return Object.keys(called).length >= 2; }, ["functions", "loops"]),
      I(SIX("<code>pinMode</code>, <code>digitalWrite</code>, <code>delay</code>, <code>const int</code>", "the <b>function lines</b> (<code>void allOff()</code>, <code>void showLed(...)</code>, <code>void scan(...)</code> and your own)"), commentsCheck(/pinMode|digitalWrite|delay|\bconst\b/, /\b(void|int|long|float|bool|boolean)\s+\w+\s*\([^)]*\)\s*\{|\bshowLed\s*\(|\bscan\s*\(|\ballOff\s*\(/), ["comments"])
    ] },
    { h: "Reflection (type your answers)", items: [
      ASK("What is <b>one thing that you learned</b> today?", 15, ["functions", "arrays"]),
      ASK("What is the <b>purpose of the for loop</b> in this example?", 20, ["loops", "arrays"]),
      ASK("Could we use the <b>ANALOG pins</b> for this example instead of the DIGITAL pins? Why or why not?", 25, ["pins", "analogread"])
    ] }
  ] };

  /* ===================================================================================== 3.8 */
  function ledStates(c) {                                   /* run the program and report, for every LED, whether it ever lights, is backwards or burned out */
    var leds = c.parts("led"); if (!c.compiled || !leds.length) return Promise.resolve(null);
    return c.run({ until: 8000, samples: H.sampleTimes(8000, 100), maxMs: 2500 }).then(function (r) {
      var lit = {}; r.samples.forEach(function (s) { leds.forEach(function (l) { if ((s.leds[l.id] || 0) > 0.2) lit[l.id] = true; }); });
      var fin = r.final || { leds: {}, warnings: [] }, bad = {}; leds.forEach(function (l) { var x = fin.leds[l.id]; if (x && (x.blown || x.reversed)) bad[l.id] = true; });
      return { lit: lit, bad: bad, leds: leds, runtimeError: r.runtimeError, burned: Object.keys(r.io && r.io.blown || {}).length };
    });
  }
  A["u3-8"] = { title: "3.8 Test and Debug: Break It", short: "3.8 Break", parts: ["led", "resistor", "button", "buzzer"], intro: "You are going to build a circuit that is <b>broken in at least 3 places</b>, and then you will fix it (that is the next assignment, <b>3.8 Part 2</b>). Make your program have <b>at least three LED lights</b>. Some of the broken things can be actual <b>components</b> (a backwards LED, a missing resistor, a wire on the wrong pin) and some can be <b>code</b>. <b>Don't</b> do things like a missing bracket. Make errors in actual written code (a wrong pin number, a missing <code>pinMode</code>, a <code>LOW</code> that should be <code>HIGH</code>...). [[Debugging tips|debugging]]", help: ["tour", "debugging", "trouble"], steps: [
    { h: "Part 1: Build the broken program", items: [
      I("Build a circuit with <b>at least 3 LEDs</b> (each with a resistor) and write code that is <b>meant</b> to make them do something. It must <b>compile</b> (no typos or missing brackets: the errors must be in how it behaves).", function (c) { return c.count("led") >= 3 && c.count("resistor") >= 1 && c.compiled && /void\s+loop/.test(c.noComments) && c.noComments.length > 60; }, ["makewire", "ledresistor", "errors"]),
      I("<b>It really is broken:</b> when you run it, at least one LED <b>never lights</b>, is <b>backwards</b>, or <b>burns out</b>.", function (c) { return ledStates(c).then(function (s) { if (!s) return false; return s.leds.some(function (l) { return !s.lit[l.id] || s.bad[l.id]; }) || s.burned > 0; }); }, ["debugging", "trouble-nolight", "ledburn"]),
      ASK("Tell me <b>the three parts or things that are broken</b> (some can be components, some can be code). Be exact: which LED, which line, what is wrong.", 30, ["debugging"], { test: function (a) { return a.split(/\n|\d[.)]|;|,\s*and\s/).filter(function (x) { return x.trim().length > 6; }).length >= 3; } })
    ] },
    { h: "Reflection (type your answers)", items: [
      ASK("What is <b>harder</b>: creating a sketch that works, or deliberately creating a sketch that doesn't? Why?", 35, ["debugging"]),
      ASK("Which part of code causes <b>more problems</b> if it is written incorrectly: <code>void setup()</code> or <code>void loop()</code>? Why?", 35, ["setuploop", "debugging"])
    ] }
  ] };
  A["u3-8b"] = { title: "3.8 Test and Debug: Fix It", short: "3.8 Fix", from: "u3-8", parts: ["led", "resistor", "button", "buzzer"], intro: "Now <b>fix</b> the circuit and code you broke in the last assignment. Press <b>Start from my circuit and code</b> to bring it over, fix all three problems, and then <b>tell me how you fixed each one</b>.", help: ["tour", "debugging", "trouble"], steps: [
    { h: "Part 2: Fix it", items: [
      I("Your circuit still has <b>at least 3 LEDs</b> and your code compiles.", function (c) { return c.count("led") >= 3 && c.compiled; }, ["makewire"]),
      I("<b>Every LED works now</b>: all your LEDs light up at some point when you run it, none is backwards, and none burns out.", function (c) { return ledStates(c).then(function (s) { return !!s && !s.runtimeError && s.burned === 0 && s.leds.every(function (l) { return s.lit[l.id] && !s.bad[l.id]; }); }); }, ["debugging", "trouble-nolight", "ledburn"]),
      ASK("Tell me <b>how you fixed each of the three problems</b>: what was wrong, and exactly what you changed.", 40, ["debugging"], { test: function (a) { return a.split(/\n|\d[.)]|;|,\s*and\s/).filter(function (x) { return x.trim().length > 6; }).length >= 3; } })
    ] },
    { h: "Reflection (type your answers)", items: [
      ASK("Which of the three problems was the <b>hardest to find</b>, and what clue helped you find it?", 30, ["debugging"]),
      ASK("What is <b>one habit</b> you will use from now on to catch bugs <b>before</b> they happen?", 25, ["debugging"])
    ] }
  ] };

  root.ARD_SLOT_ADD("u3-5", "3.5 Displays: 7-Segment Counter"); root.ARD_SLOT_ADD("u3-6", "3.6 Inputs Drive Outputs"); root.ARD_SLOT_ADD("u3-7", "3.7 Code Toolkit: Functions and Arrays");
  root.ARD_SLOT_ADD("u3-8", "3.8 Test and Debug: Break It"); root.ARD_SLOT_ADD("u3-8b", "3.8 Test and Debug: Fix It");
})(typeof window !== "undefined" ? window : globalThis);
