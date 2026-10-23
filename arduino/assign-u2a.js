/* EC Unit 2 assignments, part 1: 2.2 First Circuit, 2.2A Dual-LED, 2.3 Blink, 2.3 Flashing Signal.
   (Rebuilt from the Google Classroom versions so they run in the circuit editor instead of Tinkercad.) */
(function (root) {
  "use strict";
  var A = root.ARD_ASSIGN, H = root.ARD_H, I = H.I, ASK = H.ASK, MATCH = H.MATCH, CLOZE = H.CLOZE, NOTE = H.NOTE;
  function lit(c) { return c.litFromPower(); }
  function ledRes(c) { return c.staticRun({}).leds; }
  function ohmsAre(c, v) { var r = c.parts("resistor"); return r.length > 0 && r.every(function (p) { return +(p.props && p.props.ohms) === v; }); }
  function resBetween(c, hole) { return c.parts("resistor").some(function (p) { var a = c.holeOf(p, "1"), b = c.holeOf(p, "2"); return (a === hole && /^rail/.test(c.strip(p, "2"))) || (b === hole && /^rail/.test(c.strip(p, "1"))); }); }
  function redLed(c) { return c.parts("led").filter(function (p) { return (p.props && p.props.color) === "red"; })[0]; }
  function greenLed(c) { return c.parts("led").filter(function (p) { return (p.props && p.props.color) === "green"; })[0]; }
  function blinkOn(r, pin) { var seen = {}, flips = 0, last = null; r.samples.forEach(function (s) { var v = s.pins[pin]; seen[v] = 1; if (last !== null && v !== last) flips++; last = v; }); return seen[0] && seen[1] && flips >= 3; }

  /* ===================================================================================== 2.2 */
  A["u2-2"] = { title: "2.2 First Circuit", short: "2.2", intro: "Build your first real circuit: an LED, a 220 ohm resistor, and power from the Arduino's 5V and GND pins. There is no code in this one. The LED stays on because 5V never switches off. [[How does this editor work?|tour]]", help: ["tour", "circuit", "polarity"], steps: [
    { h: "Step 1: Build the circuit", intro: "Everything goes on the breadboard. The LED needs the <b>resistor</b> and a complete path from 5V back to GND.", items: [
      I("Click, <b>hold</b>, and drag an <b>LED</b> and a <b>Resistor</b> from the parts bar onto the breadboard. All their leg dots must turn green.", function (c) { return c.count("led") >= 1 && c.count("resistor") >= 1 && c.parts("led").concat(c.parts("resistor")).every(c.plugged); }, ["dragpart", "plugged", "breadboard"]),
      I("Click the resistor and set it to <b>220</b> ohms (the box under the canvas). Its color bands should read red, red, brown.", function (c) { return ohmsAre(c, 220); }, ["resistor", "resistorvalue"]),
      I("Use a <b>red wire</b> to connect the Arduino's <b>5V</b> pin to the breadboard's <b>red (+) rail</b>.", function (c) { return c.wireBetween(c.v5, c.rail("plus"), "red"); }, ["makewire", "fivev", "rails"]),
      I("Use a <b>black wire</b> to connect the Arduino's <b>GND</b> pin to the breadboard's <b>blue (&minus;) rail</b>.", function (c) { return c.wireBetween(c.gnd, c.rail("minus"), "black"); }, ["makewire", "gnd", "rails"]),
      I("Finish the loop: connect the + rail to the LED's <b>anode (long, bent leg)</b> through the resistor, and the LED's <b>cathode (short leg)</b> to the &minus; rail. The LED should glow!", function (c) { return lit(c).length >= 1; }, ["circuit", "ledhow", "ledresistor", "trouble-nolight"]),
      NOTE("<b>Stuck on the layout?</b> A resistor can stretch: click it and use the <b>Legs + / &minus;</b> buttons so it reaches from the rail to a hole. A wire can also carry power from a rail to a column.", ["resistorspan", "breadboard"])
    ] },
    { h: "Step 2: Add a second LED across the divide", items: [
      I("Add a <b>second LED with its own 220 &Omega; resistor</b> on the <b>other half</b> of the breadboard, across the center divide (rows f to j). Both LEDs should now glow.", function (c) { var ids = lit(c); if (ids.length < 2) return false; var halves = {}; ids.forEach(function (id) { halves[H.sameHalf(c, c.part(id))] = 1; }); return !!(halves.u && halves.l); }, ["breadboard", "seriesparallel"])
    ] },
    { h: "Step 3: Switch the polarity", items: [
      I("Add a <b>third LED</b> that is wired <b>backwards</b> (anode and cathode swapped). It should stay dark while the other two stay lit.", function (c) { var r = c.staticRun({}); var rev = Object.keys(r.leds).filter(function (id) { return r.leds[id].reversed; }); return rev.length >= 1 && lit(c).length >= 2; }, ["ledhow", "polarity"])
    ] },
    { h: "Step 4: Explain what you saw", items: [
      ASK("Explain what happened when you reversed the polarity of the LED. <b>Why</b> did it happen? (3 to 5 sentences)", 25, ["ledhow", "polarity"]),
      ASK("What does the <b>resistor</b> do? (3 to 5 sentences)", 25, ["resistor", "ohmslaw", "voltage"]),
      ASK("What happens when you take the resistor off and run the LED without it? <b>Why</b> does that happen? (3 to 5 sentences)", 25, ["ledresistor", "ledburn", "shortcircuit"]),
      NOTE("<b>Try it:</b> replace a resistor with a plain wire and watch the LED. The coach will tell you what happened. Press <b>Reset</b> to put in a fresh LED.", ["ledburn"])
    ] }
  ] };

  /* ===================================================================================== 2.2A */
  A["u2-2a"] = { title: "2.2A Dual-LED Circuit Design", short: "2.2A", intro: "Power <b>two LEDs independently</b> from a single Arduino using shared power rails. Then answer the deep-dive questions and run two fault experiments. [[What is a parallel circuit?|seriesparallel]]", help: ["tour", "seriesparallel", "rails"], steps: [
    { h: "Part 1: Gather the parts", items: [
      I("Add <b>2 LEDs</b> (change one to <b>red</b> and one to <b>green</b> in the box under the canvas) and <b>2 resistors</b>. Everything starts plugged into the breadboard.", function (c) { var l = c.parts("led"); return l.length >= 2 && !!redLed(c) && !!greenLed(c) && c.count("resistor") >= 2; }, ["dragpart", "ledhow"]),
      I("Set <b>both resistors to 220 ohms</b>. (Color bands: red, red, brown.)", function (c) { return c.count("resistor") >= 2 && ohmsAre(c, 220); }, ["resistorvalue"])
    ] },
    { h: "Part 2: Build the dual-LED circuit", items: [
      I("Wire the Arduino <b>5V</b> to the <b>red (+) rail</b> with a <b>red</b> wire.", function (c) { return c.wireBetween(c.v5, c.rail("plus"), "red"); }, ["makewire", "rails"]),
      I("Wire the Arduino <b>GND</b> to the <b>blue (&minus;) rail</b> with a <b>black</b> wire.", function (c) { return c.wireBetween(c.gnd, c.rail("minus"), "black"); }, ["makewire", "rails", "gnd"]),
      I("<b>Red LED:</b> cathode (straight leg) in hole <b>e10</b>, anode (bent leg) in hole <b>e11</b>. Hover over the legs to check which is which!", function (c) { var l = redLed(c); return !!l && c.holeOf(l, "K") === "c10e" && c.holeOf(l, "A") === "c11e"; }, ["ledhow", "breadboard"]),
      I("<b>Green LED:</b> cathode in <b>e20</b>, anode in <b>e21</b>.", function (c) { var l = greenLed(c); return !!l && c.holeOf(l, "K") === "c20e" && c.holeOf(l, "A") === "c21e"; }, ["ledhow", "breadboard"]),
      I("<b>Resistor 1</b> goes between the <b>red (+) rail</b> and hole <b>a11</b> (the Red LED's anode column). Press <b>R</b> to rotate it so it stands up between the rail and the row.", function (c) { return resBetween(c, "c11a"); }, ["resistorspan", "dragpart", "rails"]),
      I("<b>Resistor 2</b> goes between the <b>red (+) rail</b> and hole <b>a21</b> (the Green LED's anode column).", function (c) { return resBetween(c, "c21a"); }, ["resistorspan", "rails"]),
      I("Connect a <b>black wire</b> from hole <b>a10</b> (Red LED cathode) to the <b>&minus; rail</b>, and another from <b>a20</b> (Green LED cathode) to the <b>&minus; rail</b>.", function (c) { var r = redLed(c), g = greenLed(c); return !!r && !!g && c.wireBetween(c.netOf(r, "K"), c.rail("minus"), "black") && c.wireBetween(c.netOf(g, "K"), c.rail("minus"), "black"); }, ["makewire", "gnd"]),
      I("<b>Verify:</b> both LEDs glow brightly, <b>red and green</b>.", function (c) { var ids = lit(c), r = redLed(c), g = greenLed(c); return !!r && !!g && ids.indexOf(r.id) > -1 && ids.indexOf(g.id) > -1; }, ["trouble-nolight", "circuit"])
    ] },
    { h: "Part 3: Deep-dive technical questions", intro: "Finish all the building first, then answer in your own words. Use the help bubbles if you need a reminder.", items: [
      ASK("<b>1a.</b> Why do the <b>power rails</b> (the long rows on the sides) run continuously from end to end?", 20, ["rails", "breadboard"]),
      ASK("<b>1b.</b> Why are the terminal rows split into two halves (a&ndash;e and f&ndash;j) with a <b>center divider (trench)</b>?", 20, ["breadboard", "button"]),
      ASK("<b>1c.</b> If you plugged the Red LED's anode into a11 and its cathode into <b>b11</b> (the exact same row), what would happen? Why?", 25, ["breadboard", "shortcircuit"]),
      ASK("<b>2a.</b> Trace the electrical path for the <b>Green LED</b> step by step, from the Arduino's 5V pin all the way to GND. Name each hole and part you pass through, in order.", 35, ["tracepath", "circuit"]),
      ASK("<b>2b.</b> Are these two LEDs connected in <b>series</b> or <b>parallel</b>? How can you tell?", 20, ["seriesparallel"]),
      ASK("<b>2c.</b> If you unplug the Red LED, does the Green LED stay lit or turn off? Why?", 20, ["seriesparallel"]),
      ASK("<b>2d.</b> Both LEDs share the same 5V and GND connection points on the Arduino. Explain how one power pin can power several parts through the breadboard's rails.", 30, ["rails", "seriesparallel"]),
      ASK("<b>3a.</b> LED stands for Light Emitting <b>Diode</b>. What is the fundamental property of a diode regarding current flow?", 20, ["ledhow", "polarity"]),
      ASK("<b>3b.</b> Which leg of an LED connects to the <b>higher</b> potential (5V, the positive side)? Which connects to the <b>0V</b> reference (GND)? Name the legs.", 20, ["ledhow", "polarity"]),
      ASK("<b>3c.</b> Why can't we use just <b>one shared resistor</b> at the 5V pin for both LEDs, instead of giving each LED its own? (Hint: what happens to the total current when you add branches?)", 30, ["ohmslaw", "seriesparallel", "ledresistor"])
    ] },
    { h: "Part 4: Fault analysis experiments", intro: "Break your circuit on purpose to learn from it. <b>Stop the simulation</b> before you move wires or parts, then start it again to test.", items: [
      NOTE("<b>Experiment A: short-circuit the LED.</b> Leave the Red LED correctly wired. For the <b>Green LED</b>, move the black ground wire from row 20 (cathode) into row <b>21</b> (the anode, on the same row as its resistor). Watch the Green LED.", ["shortcircuit", "makewire"]),
      ASK("<b>A1.</b> What happens to the Green LED? Does it light up?", 8, ["shortcircuit"]),
      ASK("<b>A2.</b> Explain why the electricity <b>bypasses</b> the Green LED completely when it is wired this way (a short circuit).", 30, ["shortcircuit", "circuit"]),
      NOTE("<b>Experiment B: overcurrent.</b> Fix the Green LED's ground wire. Then, on the <b>Red LED</b>, delete its 220 &Omega; resistor and put a plain <b>jumper wire</b> from the red (+) rail straight to row 11 (the anode). Watch the Red LED, and hover over it.", ["ledburn", "makewire"]),
      ASK("<b>B1.</b> What visual symbol appears on the Red LED? (Hover over it.) What warning does it show?", 15, ["ledburn"]),
      ASK("<b>B2.</b> Why did the <b>Green LED</b> stay unharmed while the Red LED failed?", 25, ["ledresistor", "seriesparallel"])
    ] }
  ] };

  /* ===================================================================================== 2.3 */
  A["u2-3"] = { title: "2.3 Blink Sketch", short: "2.3 Blink", from: "u2-2", intro: "Build the classic <b>Blink</b> sketch, get it working, then make it your own. <b>Why the wiring is different from 2.2:</b> in 2.2 your LED hung on the 5V pin, so it was always on. Today it hangs on a <b>digital pin</b>. Set to OUTPUT and driven HIGH, that pin becomes its own tiny 5V source, like the 5V pin, except your <b>code</b> controls it. [[What goes in setup() and loop()?|setuploop]]", help: ["tour", "skeleton", "setuploop"], steps: [
    { h: "Section 1: Vocabulary and concept matching", items: [
      MATCH("Match each term or function with its description. Choose the letter for each one.", [["1. setup()", "D"], ["2. loop()", "B"], ["3. pinMode()", "E"], ["4. digitalWrite(pin, HIGH)", "F"], ["5. digitalWrite(pin, LOW)", "C"], ["6. delay(ms)", "A"], ["7. int (integer variable)", "G"]],
        [["A", "Pauses the program for a number of milliseconds."], ["B", "Runs continuously, over and over, until power is disconnected."], ["C", "Sets a digital pin to 0V (ground), turning off the power sent to a component."], ["D", "Runs exactly once, when the Arduino first receives power."], ["E", "Configures a digital pin to behave as an INPUT or an OUTPUT."], ["F", "Sends 5 volts of power out of a digital pin."], ["G", "Stores a whole number; used to name pin numbers at the top of the code."]], ["skeleton", "pinmode", "digitalwrite", "delay", "variables"])
    ] },
    { h: "Section 2: Fill in the blanks", items: [
      CLOZE("Read the passage and choose the right word for each blank from the word bank.", [
        "In Lab 2.2, the LED was continuously powered by connecting it directly to the {0} pin.",
        "To control an LED with software, we connect it to a digital pin and configure that pin as an {1} pin using the {2} function.",
        "The {3} function is executed only one time when the Arduino boots up, making it the perfect place to initialize pin settings.",
        "When you call digitalWrite(ledPin, {4}), the pin acts like a tiny {5} power source and turns the LED on.",
        "To turn the LED off, you use digitalWrite(ledPin, {6}), which drops the pin's voltage down to 0V, matching the {7} pin.",
        "The {8} function repeats its code blocks infinitely in a continuous cycle.",
        "The number inside the delay(1000) function represents time measured in {9}."],
        ["OUTPUT", "setup()", "5V", "loop()", "milliseconds", "HIGH", "LOW", "GND", "pinMode()", "digitalWrite()"], ["5V", "OUTPUT", "pinMode()", "setup()", "HIGH", "5V", "LOW", "GND", "loop()", "milliseconds"], ["setuploop", "pinmode", "digitalwrite", "constants-hl"])
    ] },
    { h: "Section 3: Part 1, the core Blink build", intro: "Every Arduino program needs exactly two functions: <b>setup()</b> runs once when the board powers on, and <b>loop()</b> runs over and over after that. Type the code into the code box, one line at a time. Use your own pin number if it is not 8.", code: "int ledPin = 8;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(1000);\n  digitalWrite(ledPin, LOW);\n  delay(1000);\n}", items: [
      I("Build the circuit: an <b>LED and a 220 &Omega; resistor</b> wired to a <b>digital pin</b> (like 8) and to <b>GND</b>, laid out like your 2.2 circuit. Don't use 5V this time: the pin does that job now. (Tip: the <b>Start from my circuit</b> button at the top of these instructions copies your 2.2 circuit.)", function (c) { var l = c.parts("led")[0]; return !!l && c.count("resistor") >= 1 && ohmsAre(c, 220) && c.pinOfLed(l) > 0 && lit(c).indexOf(l.id) === -1; }, ["makewire", "pins", "ledresistor"]),
      I("<b>Above</b> setup() and loop(): <code>int ledPin = 8;</code> (your own pin number if you used a different one). <b>Inside setup():</b> <code>pinMode(ledPin, OUTPUT);</code>", function (c) { var l = c.parts("led")[0], m = /int\s+ledPin\s*=\s*(\d+)\s*;/.exec(c.noComments); return !!l && !!m && +m[1] === c.pinOfLed(l) && H.setupStmts(c).indexOf("pinMode(ledPin,OUTPUT)") > -1; }, ["variables", "constants", "pinmode", "semicolon"]),
      I("<b>Inside loop(),</b> in order: <code>digitalWrite(ledPin, HIGH);</code> then <code>delay(1000);</code> then <code>digitalWrite(ledPin, LOW);</code> then <code>delay(1000);</code>", function (c) { var s = H.loopStmts(c); return s.length === 4 && /^digitalWrite\(ledPin,HIGH\)$/.test(s[0]) && /^delay\(\d+\)$/.test(s[1]) && /^digitalWrite\(ledPin,LOW\)$/.test(s[2]) && /^delay\(\d+\)$/.test(s[3]); }, ["digitalwrite", "delay", "constants-hl"]),
      I("Click <b>Start Simulation</b>. Your LED should <b>blink</b> on and off.", function (c) { var l = c.parts("led")[0], pin = l ? c.pinOfLed(l) : 0; if (!pin || !c.compiled) return false; return c.run({ until: 12000, samples: H.sampleTimes(12000, 150) }).then(function (r) { return blinkOn(r, pin); }); }, ["startsim", "trouble-nolight"]),
      I("Change your <b>delay()</b> numbers so they are <b>no longer 1000 and 1000</b>: make it blink faster, slower, or in an uneven pattern.", function (c) { var d = H.delaysIn(c); return d.length >= 2 && !(d[0] === 1000 && d[1] === 1000); }, ["delay"]),
      I("<b>Comment every line</b> of your code to explain what it does (end each line with <code>// explanation</code>).", function (c) { return H.everyLineCommented(c.raw); }, ["comments"])
    ] },
    { h: "Section 4: Analysis questions", items: [
      ASK("<b>Execution order:</b> What would happen to your LED's blinking if you accidentally put <code>pinMode(ledPin, OUTPUT);</code> inside <b>loop()</b> instead of setup()? Explain why.", 30, ["setuploop", "pinmode"]),
      ASK("<b>Timing calculation:</b> You want your LED <b>ON for a quarter of a second</b> and <b>OFF for 2 full seconds</b>. Write the exact four lines of code you would put inside loop().", 8, ["delay", "digitalwrite"], { mono: true, rows: 5, test: function (a) { return /digitalWrite\s*\(\s*\w+\s*,\s*HIGH\s*\)\s*;?\s*delay\s*\(\s*250\s*\)\s*;?\s*digitalWrite\s*\(\s*\w+\s*,\s*LOW\s*\)\s*;?\s*delay\s*\(\s*2000\s*\)/.test(a); }, ph: "digitalWrite(...);\ndelay(...);\n..." }),
      ASK("<b>Code debugging:</b> A student forgets the <b>second delay()</b> at the bottom of loop(). Describe what the LED will look like and explain why it behaves that way.", 30, ["delay", "setuploop"])
    ] }
  ] };

  /* ===================================================================================== 2.3 Flashing Signal */
  A["u2-3b"] = { title: "2.3 Part 2: Flashing Red Signal", short: "2.3 Flashing Signal", from: "u2-3", intro: "You've seen a traffic light that just <b>flashes red</b>: at railroad crossings, and at intersections late at night, it means \"treat this like a stop sign.\" All the red lights blink <b>together</b>. <b>Each LED needs its OWN digital pin</b> (and its own resistor). You make them flash together with your <b>code</b>, not your wiring.", help: ["tour", "pins", "setuploop"], steps: [
    { h: "Step 1: Wire three LEDs", items: [
      I("Add <b>2 more LEDs</b> (3 total, red works well). Each gets <b>its own 220 &Omega; resistor</b> and <b>its own digital pin</b>. All three can share one GND connection.", function (c) { var l = c.parts("led"); if (l.length < 3 || c.count("resistor") < 3) return false; var pins = l.map(function (x) { return c.pinOfLed(x); }); return pins.every(Boolean) && pins.filter(function (p, i) { return pins.indexOf(p) === i; }).length === pins.length; }, ["pins", "ledresistor", "gnd", "makewire"])
    ] },
    { h: "Step 2: The code", intro: "Repeat the same pattern for all three LEDs.", code: "int led1Pin = 8;\nint led2Pin = 9;\nint led3Pin = 10;\n\nvoid setup() {\n  pinMode(led1Pin, OUTPUT);\n  pinMode(led2Pin, OUTPUT);\n  pinMode(led3Pin, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(led1Pin, HIGH);\n  digitalWrite(led2Pin, HIGH);\n  digitalWrite(led3Pin, HIGH);\n  delay(500);\n  digitalWrite(led1Pin, LOW);\n  digitalWrite(led2Pin, LOW);\n  digitalWrite(led3Pin, LOW);\n  delay(500);\n}", items: [
      I("<b>Above</b> setup() and loop(): three pin variables (<code>led1Pin</code>, <code>led2Pin</code>, <code>led3Pin</code>). <b>Inside setup():</b> three <code>pinMode(..., OUTPUT)</code> lines.", function (c) { var m = c.noComments.match(/int\s+led[123]Pin\s*=\s*\d+\s*;/g) || []; var s = H.setupStmts(c).filter(function (x) { return /^pinMode\(led[123]Pin,OUTPUT\)$/.test(x); }); return m.length >= 3 && s.length >= 3; }, ["variables", "pinmode", "constants"]),
      I("<b>Inside loop():</b> all three LEDs <b>HIGH</b> one right after another, then <b>one</b> <code>delay()</code>, then all three <b>LOW</b>, then one more <code>delay()</code>.", function (c) { var s = H.loopStmts(c); return s.length === 8 && s.slice(0, 3).every(function (x) { return /^digitalWrite\(led[123]Pin,HIGH\)$/.test(x); }) && /^delay\(\d+\)$/.test(s[3]) && s.slice(4, 7).every(function (x) { return /^digitalWrite\(led[123]Pin,LOW\)$/.test(x); }) && /^delay\(\d+\)$/.test(s[7]); }, ["digitalwrite", "delay"])
    ] },
    { h: "Step 3: Run it and tune it", items: [
      I("Click <b>Start Simulation</b>. All 3 LEDs should flash <b>together, in sync</b>.", function (c) { var ids = c.parts("led").map(function (l) { return l.id; }); if (ids.length < 3 || !c.compiled) return false; return c.run({ until: 8000, samples: H.sampleTimes(8000, 100) }).then(function (r) { var states = {}; var ok = r.samples.every(function (s) { var n = H.litAt(s, ids).length; states[n] = 1; return n === 0 || n === ids.length; }); return ok && states[0] && states[ids.length]; }); }, ["startsim", "trouble-nolight"]),
      ASK("Look up roughly how fast a <b>real flashing traffic signal</b> blinks. How long is it on and off, and where did you find it?", 15, ["trafficlight"]),
      I("Adjust your <b>delay()</b> numbers to match a real flashing signal reasonably well (about a quarter second to one second each).", function (c) { var d = H.delaysIn(c); return d.length >= 2 && d.every(function (x) { return x >= 250 && x <= 1000; }); }, ["delay", "trafficlight"]),
      I("Add <b>one comment</b> in your code explaining why each LED needs its own pin instead of sharing one.", function (c) { return /\/\/[^\n]*\bpin\b[^\n]*/i.test(c.raw) && /\/\/[^\n]*(own|separate|each|different|individual|share)/i.test(c.raw); }, ["comments", "pins"])
    ] }
  ] };

  root.ARD_SLOT_ADD("u2-2", "2.2 First Circuit"); root.ARD_SLOT_ADD("u2-2a", "2.2A Dual-LED Circuit Design"); root.ARD_SLOT_ADD("u2-3", "2.3 Blink Sketch"); root.ARD_SLOT_ADD("u2-3b", "2.3 Part 2: Flashing Red Signal");
})(typeof window !== "undefined" ? window : globalThis);
