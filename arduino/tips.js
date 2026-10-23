/* Help topics for the Arduino editor (the clickable bubbles). One place to learn how everything works.
   A topic is  add(id, category, title, [sections])  and a section is one of:
     { p: "text" }  { ex: ["code line", ...] }  { anno: [["code", "what it does"], ...] }  { list: [...] }  { steps: [...] }
     { rows: [["a","b","c"], ...] , head: ["A","B","C"] }  { good: "tip" }  { warn: "watch out" }  { links: ["topic-id", ...] }  { svg: "<svg ...>" }
   Text supports `code` and **bold**. */
(function (root) {
  "use strict";
  var T = root.ARD_TIPS = { topics: {}, order: [], cats: [] };
  function cat(name) { T.cats.push(name); return name; }
  function add(id, c, title, sections, keys) { T.topics[id] = { id: id, cat: c, title: title, sections: sections, keys: keys || "" }; T.order.push(id); }

  /* ---------- little pictures */
  var SVG_CIRCUIT = '<svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" style="max-width:100%"><rect x="10" y="10" width="500" height="170" rx="12" fill="#0b1220" stroke="#26304A"/><text x="60" y="48" fill="#fda4af" font-size="14" font-weight="700">5V or a pin set HIGH (+)</text><path d="M60 62 H210" stroke="#fb7185" stroke-width="4" fill="none"/><rect x="210" y="48" width="90" height="28" rx="6" fill="#d9c28f" stroke="#a88f55"/><text x="255" y="67" fill="#222" font-size="12" text-anchor="middle" font-weight="700">resistor</text><path d="M300 62 H380" stroke="#fb7185" stroke-width="4" fill="none"/><circle cx="410" cy="62" r="26" fill="#ef4444" fill-opacity=".6" stroke="#ef4444" stroke-width="2"/><text x="410" y="67" fill="#fff" font-size="12" text-anchor="middle" font-weight="700">LED</text><path d="M436 62 H470 V140 H60 V62" stroke="#60a5fa" stroke-width="4" fill="none"/><text x="260" y="130" fill="#93c5fd" font-size="14" text-anchor="middle" font-weight="700">GND (-) : the way back</text><path d="M120 62 l12 -6 v12 z" fill="#fff"/><path d="M330 62 l12 -6 v12 z" fill="#fff"/><text x="260" y="168" fill="#a5f3fc" font-size="12" text-anchor="middle">Current flows around a complete loop: out of the + side, through the parts, and back to GND.</text></svg>';
  var SVG_LED = '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%"><rect x="4" y="4" width="352" height="192" rx="12" fill="#0b1220" stroke="#26304A"/><path d="M120,100 L120,50 A40,40 0 0 1 200,50 L200,100 Z" fill="#ef4444" fill-opacity=".55" stroke="#ef4444" stroke-width="2"/><rect x="110" y="96" width="100" height="10" rx="3" fill="#ef4444" fill-opacity=".85"/><path d="M210 98 L210 80" stroke="#0b1220" stroke-width="3"/><path d="M135,106 L135,130 L125,142 L125,175" stroke="#e5e7eb" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M195,106 L195,160" stroke="#e5e7eb" stroke-width="5" fill="none"/><text x="125" y="192" fill="#fb7185" font-size="26" font-weight="800" text-anchor="middle">+</text><text x="195" y="192" fill="#60a5fa" font-size="30" font-weight="800" text-anchor="middle">&#8722;</text><text x="30" y="140" fill="#fda4af" font-size="13" font-weight="700">ANODE (+)</text><text x="30" y="156" fill="#fda4af" font-size="11">longer, bent leg</text><text x="228" y="140" fill="#93c5fd" font-size="13" font-weight="700">CATHODE (&#8722;)</text><text x="228" y="156" fill="#93c5fd" font-size="11">shorter, straight leg</text><text x="228" y="86" fill="#cbd5e1" font-size="11">flat edge on</text><text x="228" y="99" fill="#cbd5e1" font-size="11">the cathode side</text></svg>';
  var SVG_BOARD = '<svg viewBox="0 0 440 210" xmlns="http://www.w3.org/2000/svg" style="max-width:100%"><rect x="4" y="4" width="432" height="202" rx="10" fill="#e7e2d3" stroke="#b9b29d"/><rect x="12" y="100" width="416" height="22" fill="#cfc9b6"/><line x1="14" y1="16" x2="426" y2="16" stroke="#e11d48" stroke-width="2"/><line x1="14" y1="194" x2="426" y2="194" stroke="#2563eb" stroke-width="2"/><g fill="#34312a"><rect x="60" y="30" width="7" height="7"/><rect x="60" y="48" width="7" height="7"/><rect x="60" y="66" width="7" height="7"/><rect x="60" y="84" width="7" height="7"/><rect x="60" y="130" width="7" height="7"/><rect x="60" y="148" width="7" height="7"/><rect x="60" y="166" width="7" height="7"/><rect x="60" y="184" width="7" height="7"/><rect x="120" y="30" width="7" height="7"/><rect x="120" y="48" width="7" height="7"/><rect x="120" y="66" width="7" height="7"/><rect x="120" y="84" width="7" height="7"/></g><path d="M63.5 33 V88" stroke="#16a34a" stroke-width="5" stroke-linecap="round" opacity=".7"/><path d="M63.5 134 V188" stroke="#2563eb" stroke-width="5" stroke-linecap="round" opacity=".7"/><text x="80" y="62" font-size="12" fill="#14532d" font-weight="700">these 5 are connected</text><text x="80" y="164" font-size="12" fill="#1e3a8a" font-weight="700">these 5 are connected (but NOT to the top 5)</text><text x="220" y="116" font-size="12" fill="#6b6657" text-anchor="middle">center gap: the top half and bottom half are separate</text><text x="14" y="12" font-size="9" fill="#e11d48" font-weight="700">+ power rail: the whole long row is connected</text><text x="14" y="206" font-size="9" fill="#2563eb" font-weight="700">&#8722; ground rail: the whole long row is connected</text></svg>';

  /* ====================================================================== USING THE EDITOR */
  var ED = cat("Using the editor");
  add("tour", ED, "How does this editor work? (start here)", [
    { p: "This editor lets you build a circuit and the program for it, then run both in a simulation. It is like a real Arduino lab, but nothing can break and nothing can get lost." },
    { steps: ["**Add parts.** Click a part in the bar above the canvas, **hold** the mouse button down, and **drag** it onto the breadboard.", "**Plug it in.** When the little dots on the legs turn **green**, the part is plugged in.", "**Add wires.** Drag from an Arduino pin (or a breadboard hole) to another pin or hole.", "**Write code.** Type your program in the code box on the right.", "**Run it.** Click **Start Simulation**. The LEDs light up, the Serial Monitor prints, and you can press buttons with your mouse."] },
    { good: "Hover your mouse over any leg, pin or hole. A tip pops up that tells you what it is, and whether it is positive (+) or negative (-)." },
    { links: ["dragpart", "makewire", "startsim", "skeleton", "autocheck"] }
  ], "start begin overview how");
  add("dragpart", ED, "How do I add, move, rotate or delete a part?", [
    { p: "Parts come from the bar above the canvas (LED, Resistor, Button, Buzzer, Breadboard)." },
    { steps: ["**Click, hold, and drag** the part from the bar onto the canvas. A faded copy follows your mouse.", "Let go over the breadboard. The part **snaps** into the nearest holes.", "To move it later, drag the part by its body (not its legs).", "To **rotate** it, click the part and press **R** (or click the Rotate button).", "To **delete** it, click the part and press **Delete** (or click the Delete button)."] },
    { warn: "A plain click on the bar does not add a part. You have to hold and drag it. That is on purpose, so you practice placing parts." },
    { good: "Made a mistake? **Ctrl + Z** undoes it, and **Ctrl + Y** does it again." },
    { links: ["plugged", "makewire"] }
  ], "add place put move rotate delete remove drag undo");
  add("plugged", ED, "How do I know a part is plugged in?", [
    { p: "Look at the small dot at the end of each leg." },
    { rows: [["Green dot", "The leg is in a breadboard hole (or an Arduino pin). It is connected."], ["Red dot", "The leg is just floating in the air. Nothing is connected to it."]], head: ["Dot", "Meaning"] },
    { p: "If a dot is red, drag the part a little until it snaps into the holes. All legs of one part must be in **different columns** (or a different half of the board for a button)." },
    { links: ["breadboard", "dragpart"] }
  ], "green red dot connected snap leg");
  add("makewire", ED, "How do I make a wire?", [
    { steps: ["Move your mouse over an Arduino pin or a breadboard hole. It lights up.", "**Press and hold** on it, then **drag** to another pin or hole.", "Let go when the second spot lights up. A wire appears."] },
    { list: ["Click a wire to select it. Then you can **change its color** (under the canvas) or press **Delete** to remove it.", "Drag the blue dots at the ends of a selected wire to move an end.", "Use wire colors to stay organized: **red** for power (+), **black** for GND (-)."] },
    { warn: "A wire has to start and end on a pin or hole. If you let go on empty space, no wire is made." },
    { links: ["gnd", "fivev", "rails"] }
  ], "wire jumper connect cable drag color");
  add("zoom", ED, "How do I zoom and move around?", [
    { list: ["**Scroll** the mouse wheel to zoom in and out.", "Use the **+**, **-** and **Fit** buttons.", "**Drag the empty background** to slide the whole picture around.", "Click **Fit** if you get lost. It puts everything back on screen."] }
  ], "scroll pan zoom lost");
  add("startsim", ED, "How do I run my program? (Start, Stop, Reset, speed)", [
    { list: ["**Start Simulation** compiles your code and runs it on the simulated Arduino. It runs **setup()** once, then **loop()** over and over.", "**Stop** ends the program. All the pins turn off.", "**Reset** stops the program, replaces any burned-out LEDs, and starts again if it was running.", "The **speed** box makes time pass faster (2x, 5x, 10x), useful for long delays."] },
    { p: "While it runs, the **pin bar** under the canvas shows each pin you use (HIGH, LOW, PWM). Your `Serial.print` text shows in the **Serial Monitor**. Click and hold a button on the canvas to press it." },
    { warn: "If the red error box appears, your code has a mistake. Read it: it tells you the line number and what is wrong." },
    { links: ["errors", "serialmon", "trouble-nolight"] }
  ], "run start stop reset play simulate speed");
  add("serialmon", ED, "What is the Serial Monitor?", [
    { p: "The Serial Monitor is a small screen where your Arduino can **print messages** to you. It is the best way to see what your program is doing." },
    { ex: ["void setup() {", "  Serial.begin(9600);          // turn the Serial Monitor on (once!)", "}", "void loop() {", "  Serial.println(\"Hello!\");   // prints a line of text", "  delay(1000);", "}"] },
    { list: ["Always call `Serial.begin(9600);` in `setup()` first.", "You can **type** into the box at the bottom and press Enter to send text to the Arduino. Your code can read it with `Serial.available()` and `Serial.read()`.", "The **TX** light on the Arduino blinks when it prints."] },
    { links: ["serial", "serialnothing"] }
  ], "serial monitor print output console");
  add("savesubmit", ED, "How do I save and submit my work?", [
    { steps: ["Click **Sign in with Google** and use your school account.", "Your circuit and code **save to your account automatically** (look for the cloud message at the top).", "Pick your **class period** at the top.", "When the steps are done, click **Submit**. You can submit again to replace it."] },
    { good: "You can sign in on any school computer and your work will be there." },
    { warn: "If it says \"Saved on this computer only\", you are not signed in. Sign in or your work could be lost." }
  ], "save submit sign in google login period turn in");
  add("autocheck", ED, "What does \"auto-check\" mean?", [
    { p: "Each step has a box that the computer checks for you. It looks at your circuit and runs your program to see if it does what the step asks." },
    { rows: [["auto-check: met", "The step is done. Nice!"], ["auto-check: not yet", "Something is missing. Re-read the step and look at your circuit and code."]], head: ["Badge", "Meaning"] },
    { p: "The **Auto score** at the top is the percent of steps that are met. Your teacher also looks at your circuit and code." },
    { links: ["stuck"] }
  ], "check score grade step badge");
  add("stuck", ED, "I'm stuck. What should I do?", [
    { steps: ["Re-read the step slowly. Look for **exact numbers** (like pin 8 or 220 ohms).", "Hover over the legs and pins to see what they are.", "Click the yellow help bubbles under the step.", "Check the **leg dots**: are they all green?", "Click **Start Simulation** and watch the pin bar and Serial Monitor.", "Ask a classmate, then your teacher."] },
    { links: ["trouble-nolight", "errors", "tour"] }
  ], "help stuck lost problem");

  /* ====================================================================== ELECTRONICS */
  var EL = cat("How circuits work");
  add("circuit", EL, "What is a circuit?", [
    { p: "A circuit is a **complete loop** that electricity can flow around. Electricity needs a path from the **positive (+)** side, through your parts, and back to the **negative (-)** side (GND). If the loop is broken anywhere, nothing flows and nothing lights up." },
    { svg: SVG_CIRCUIT },
    { list: ["**Source:** gives the push (5V, or a pin set to HIGH).", "**Load:** the part that does something (an LED lights, a buzzer buzzes).", "**Return:** the path back to GND."] },
    { good: "When an LED does not light, ask: is the loop complete? Is there a wire to GND?" },
    { links: ["voltage", "gnd", "polarity"] }
  ], "loop path electricity flow complete");
  add("voltage", EL, "What are voltage, current and resistance?", [
    { p: "Think of **water flowing in a pipe**:" },
    { rows: [["Voltage (volts, V)", "The water pressure. How hard electricity is pushed. An Arduino pin is 5V (HIGH) or 0V (LOW)."], ["Current (amps, A or mA)", "How much water flows. An LED needs about 10 to 20 mA (milliamps) to glow."], ["Resistance (ohms, Ω)", "How narrow the pipe is. A resistor squeezes the flow so it does not get too big."]], head: ["Word", "Water picture"] },
    { p: "They are connected by **Ohm's law**: `current = voltage / resistance`." },
    { links: ["ohmslaw", "ledresistor"] }
  ], "volts amps ohms electricity");
  add("ohmslaw", EL, "Ohm's law: why is the resistor 220 ohms?", [
    { p: "Ohm's law says: **current = voltage / resistance** (I = V / R)." },
    { p: "An LED \"uses up\" about 2 volts of the 5 volts. The resistor has to handle the other 3 volts:" },
    { ex: ["voltage left over  = 5 V - 2 V = 3 V", "current           = 3 V / 220 ohms = 0.0136 A = about 13.6 mA"] },
    { p: "13 mA is a safe, bright amount for an LED. A smaller resistor means more current (brighter, but it can burn out). A bigger resistor means less current (dimmer)." },
    { rows: [["100 ohms", "about 30 mA", "very bright, close to the limit"], ["220 ohms", "about 14 mA", "bright and safe (use this one)"], ["1 k ohms", "about 3 mA", "dim"], ["10 k ohms", "about 0.3 mA", "almost off"]], head: ["Resistor", "Current", "Result"] },
    { links: ["ledresistor", "resistor"] }
  ], "ohm law math calculate 220 current");
  add("polarity", EL, "What do positive (+) and negative (-) mean? What is polarity?", [
    { p: "Some parts only work when electricity flows through them in **one direction**. These parts have **polarity**: a positive (+) leg and a negative (-) leg. Put them in backwards and they do not work (or can be damaged)." },
    { rows: [["LED", "Yes: anode (+, long leg) and cathode (-, short leg)"], ["Piezo buzzer", "Yes: + leg and - leg"], ["Resistor", "No. Either way works."], ["Pushbutton", "No. Either way works."], ["Wires", "No."]], head: ["Part", "Has polarity?"] },
    { good: "Hover over a leg in the editor. The tip says POSITIVE (+) or NEGATIVE (-) or \"no polarity\"." },
    { links: ["ledhow", "gnd", "fivev"] }
  ], "positive negative plus minus polarity backwards direction");
  add("gnd", EL, "What is GND (ground)?", [
    { p: "**GND** means ground. It is **0 volts**, the **negative** side of your circuit, and the place electricity returns to. Every working circuit needs a path back to GND." },
    { list: ["The Arduino has several GND pins. They are all connected together.", "Connect GND to the breadboard's **blue (-) rail** with a black wire. Then you can use that whole row as a ground for many parts.", "A pin set to **LOW** is also 0 volts, so it can act like GND for a part."] },
    { warn: "Never connect 5V directly to GND with a wire. That is a short circuit." },
    { links: ["rails", "fivev", "shortcircuit"] }
  ], "ground gnd zero return negative");
  add("fivev", EL, "What is 5V and when do I use it?", [
    { p: "The **5V** pin gives a steady 5 volts, the **positive** supply. Use it to power parts and to build a pull-up. A pin that is set to **HIGH** also outputs 5 volts (but only a tiny bit of current, about 20 mA)." },
    { list: ["An output **pin** can power one LED. The **5V pin** can power much more.", "Connect 5V to the breadboard's **red (+) rail** with a red wire."] },
    { links: ["rails", "gnd", "pins"] }
  ], "5v power positive volt supply");
  add("breadboard", EL, "How does a breadboard work?", [
    { p: "A breadboard lets you build circuits without solder. Under the plastic, metal strips connect certain holes together." },
    { svg: SVG_BOARD },
    { list: ["The **5 holes in one column** (a to e, or f to j) are connected to each other.", "The **center gap** separates the top half from the bottom half. That is why a button goes across it.", "The long rows at the very top and bottom are the **power rails**. The whole row is connected.", "To connect two parts, plug their legs into holes in the **same column**."] },
    { links: ["rails", "plugged", "button"] }
  ], "breadboard holes column row strip connected gap");
  add("rails", EL, "What are the power rails (the red and blue rows)?", [
    { p: "The long rows along the top and bottom of the breadboard are **power rails**. Every hole in one rail row is connected." },
    { rows: [["Red row (+)", "Connect to 5V. Use it for the positive side of parts."], ["Blue row (-)", "Connect to GND. Use it for the negative side of parts."]], head: ["Rail", "Use"] },
    { good: "Run one wire from Arduino GND to the blue rail. Then any part that needs GND can use a hole in that rail, instead of needing its own long wire." },
    { links: ["gnd", "fivev", "makewire"] }
  ], "rail power red blue plus minus");
  add("pins", EL, "What can each Arduino pin do?", [
    { rows: [["D0 to D13", "Digital pins. Can be an input or output. HIGH = 5V, LOW = 0V."], ["~3 ~5 ~6 ~9 ~10 ~11", "Digital pins with a ~ can also do PWM: analogWrite() to dim an LED."], ["A0 to A5", "Analog inputs: analogRead() gives 0 to 1023. They can also be digital pins."], ["5V / 3.3V", "Power outputs (positive)."], ["GND", "Ground (negative, 0 volts)."], ["VIN", "Power coming in. Leave alone."], ["RESET", "Connect to GND to restart the program."]], head: ["Pin", "What it does"] },
    { warn: "Pins 0 and 1 are also used by the Serial Monitor. Use pins 2 to 13 for your parts." },
    { good: "Each output pin can only give about 20 mA. That is enough for one LED (with a resistor), but not a motor." },
    { links: ["pwm", "digitalwrite", "analogread"] }
  ], "pin digital analog pwm which pins");
  add("builtinled", EL, "What is the orange L light on the Arduino?", [
    { p: "The small orange **L** light on the Arduino board is wired to **pin 13**. When pin 13 is HIGH it lights up. That means you can test code with **no wires at all**." },
    { ex: ["void setup() { pinMode(13, OUTPUT); }", "void loop() {", "  digitalWrite(13, HIGH);", "  delay(500);", "  digitalWrite(13, LOW);", "  delay(500);", "}"] },
    { p: "`LED_BUILTIN` is a name for pin 13, so `pinMode(LED_BUILTIN, OUTPUT);` does the same thing." }
  ], "l light pin 13 built in led_builtin onboard");
  add("shortcircuit", EL, "What is a short circuit?", [
    { p: "A short circuit happens when the **positive side connects straight to the negative side** with nothing in between to limit the current (for example 5V wired directly to GND, or a HIGH pin wired directly to GND)." },
    { list: ["The current gets huge, and real parts can get hot or break.", "The editor warns you: \"Short circuit!\" or \"Pin D8 is supplying 200 mA\".", "Fix it by finding the wire that goes from + to - with no part (or resistor) in the path."] },
    { links: ["ledresistor", "circuit"] }
  ], "short circuit hot damage warning");

  /* ----- parts */
  var PA = cat("The parts");
  add("ledhow", PA, "How does an LED work? (anode and cathode)", [
    { p: "An LED (light emitting diode) glows when current flows through it. It has **two legs that are different**, because current can only flow one way through it." },
    { svg: SVG_LED },
    { rows: [["Anode (+)", "The longer, bent leg. The positive side. Current goes IN."], ["Cathode (-)", "The shorter, straight leg, next to the flat edge. The negative side. Current goes OUT."]], head: ["Leg", "Which one?"] },
    { p: "The **current path** is: pin or 5V -> resistor -> LED anode -> LED cathode -> GND." },
    { warn: "If you plug an LED in backwards, nothing happens (it will not light). The editor shows a warning \"An LED is backwards\"." },
    { links: ["ledresistor", "polarity"] }
  ], "led anode cathode leg long short");
  add("ledresistor", PA, "Why does an LED need a resistor?", [
    { p: "An LED has almost no resistance by itself. Without a resistor, far too much current flows, and the LED **burns out in a flash**." },
    { rows: [["With a 220 ohm resistor", "about 14 mA", "safe and bright"], ["No resistor", "over 100 mA", "LED burns out (a black X shows)"]], head: ["Circuit", "Current", "Result"] },
    { list: ["The resistor can go on **either side** of the LED, as long as it is **in series** (in the same path).", "Use **220 ohms** for the LEDs in these assignments."] },
    { links: ["ohmslaw", "ledburn"] }
  ], "resistor led burn out protect why");
  add("ledburn", PA, "Why did my LED burn out (black X)?", [
    { p: "Too much current went through it. This happens when:" },
    { list: ["There is **no resistor** in the LED's path.", "The resistor is too small (like 10 ohms).", "The LED's path connects a HIGH pin straight to GND."] },
    { steps: ["Add a **220 ohm resistor** in series with the LED.", "Click **Reset** at the top. That replaces the burned-out LED.", "Run it again."] },
    { links: ["ledresistor", "shortcircuit"] }
  ], "burn blown black x broken dead");
  add("resistor", PA, "What does a resistor do?", [
    { p: "A resistor **limits the current** in a circuit. Its value is measured in **ohms** (Ω). Resistors have **no polarity**, so either leg can go either way." },
    { list: ["Click a resistor, then pick its value (like 220 ohms) in the box under the canvas.", "The **colored bands** show the value (see the next bubble)."] },
    { links: ["resistorvalue", "ohmslaw"] }
  ], "resistor ohm limit current value");
  add("resistorvalue", PA, "How do I read a resistor's colors?", [
    { p: "The first two bands are digits, the third band is how many zeros to add." },
    { rows: [["Black", "0"], ["Brown", "1"], ["Red", "2"], ["Orange", "3"], ["Yellow", "4"], ["Green", "5"], ["Blue", "6"], ["Violet", "7"], ["Gray", "8"], ["White", "9"]], head: ["Color", "Number"] },
    { ex: ["220 ohms   = red, red, brown    -> 2, 2, then 1 zero = 220", "1,000 ohms = brown, black, red -> 1, 0, then 2 zeros = 1000 (1k)", "10,000 ohms = brown, black, orange -> 1, 0, then 3 zeros = 10k"] },
    { good: "The gold band at the end just means the resistor is accurate to within 5%." }
  ], "color band stripe read value code");
  add("button", PA, "How does a pushbutton work? (and why across the gap?)", [
    { p: "A pushbutton is a **switch**. Pressing it connects two sides of a circuit. It has 4 legs, but they are joined in pairs inside:" },
    { list: ["The two legs on the **same side** are always connected to each other.", "**Pressing** the button connects the top pair to the bottom pair."] },
    { p: "That is why you place it **across the center gap** of the breadboard: the top legs go in the top half, the bottom legs in the bottom half. Then pressing it joins the two halves." },
    { warn: "If you place it so both pairs are in the same half, it never does anything (or is always connected). The editor's auto-check will tell you." },
    { links: ["pullup", "breadboard", "digitalread"] }
  ], "button switch press push gap legs");
  add("buzzer", PA, "How does the piezo buzzer work?", [
    { p: "A piezo buzzer makes a sound when it is **vibrated** by a signal that switches on and off very fast. Your code makes that signal with `tone()`." },
    { steps: ["Connect the **+ leg** to an Arduino pin (like pin 9).", "Connect the **- leg** to GND.", "In code: `tone(9, 440);` plays 440 Hz (the note A). `noTone(9);` stops it."] },
    { good: "Turn up your computer speakers. The wave marks appear next to the buzzer while it plays." },
    { warn: "`digitalWrite(pin, HIGH)` on a piezo only makes a click. Use `tone()` for a steady sound." },
    { links: ["tone"] }
  ], "buzzer piezo sound speaker tone noise");
  add("pwm", PA, "What is PWM? (analogWrite and the ~ pins)", [
    { p: "A digital pin is either fully ON (5V) or fully OFF (0V). **PWM** (pulse width modulation) switches a pin on and off **very fast** (about 490 times a second). The more of the time it is on, the brighter an LED looks." },
    { rows: [["analogWrite(pin, 0)", "always off", "LED off"], ["analogWrite(pin, 64)", "on 25% of the time", "dim"], ["analogWrite(pin, 128)", "on 50% of the time", "medium"], ["analogWrite(pin, 255)", "always on", "full brightness"]], head: ["Code", "Pin", "LED"] },
    { warn: "Only pins with a **~** (3, 5, 6, 9, 10, 11) can do PWM. On other pins, analogWrite is only ON (128 or more) or OFF." },
    { links: ["analogwrite"] }
  ], "pwm fade dim brightness tilde analog write");
  add("pullup", PA, "What is INPUT_PULLUP? (and why does a button read LOW when pressed?)", [
    { p: "An input pin needs a definite voltage. If nothing is connected, it \"floats\" and reads random 0s and 1s. **INPUT_PULLUP** turns on a tiny resistor inside the Arduino that **pulls the pin up to 5V (HIGH)** when nothing else is connected." },
    { ex: ["pinMode(2, INPUT_PULLUP);   // pin 2 reads HIGH by default"] },
    { steps: ["Wire one side of the button to **pin 2** and the other side to **GND**.", "Button NOT pressed: pin 2 is pulled up to 5V, so `digitalRead(2)` is **HIGH**.", "Button pressed: pin 2 is connected to GND (0V), so `digitalRead(2)` is **LOW**."] },
    { warn: "It feels backwards: **LOW means pressed.** That is normal. Write `if (digitalRead(2) == LOW)` to check for a press." },
    { links: ["floating", "digitalread", "button"] }
  ], "pullup pull up input_pullup button low high pressed");
  add("floating", PA, "Why does my input read random 0s and 1s? (floating pin)", [
    { p: "A pin set as INPUT that is **not connected to anything** is \"floating\". It picks up electrical noise and reads random HIGH and LOW." },
    { list: ["Use **INPUT_PULLUP** so the pin has a default value.", "Make sure your button is wired between the pin and GND.", "Check the leg dots: a red dot means that leg is not connected."] },
    { links: ["pullup", "button"] }
  ], "floating random noise input unconnected flicker");

  /* ====================================================================== CODE */
  var CO = cat("Writing the code");
  add("skeleton", CO, "The skeleton of every Arduino program (read this first)", [
    { p: "Every Arduino program (called a **sketch**) has the same skeleton. It is written in **C++**. You always have two special functions: **setup()** and **loop()**." },
    { anno: [["// notes to yourself", "A comment. The Arduino ignores everything after //. Use comments to explain your code."], ["const int ledPin = 8;", "Global variables (at the top, outside any function). Give a name to a pin number so your code is easy to read and change."], ["void setup() {", "setup() runs ONE time, when the program starts. The { starts the function."], ["  pinMode(ledPin, OUTPUT);", "Inside setup(): tell the Arduino whether each pin is an OUTPUT (sends) or INPUT (listens)."], ["  Serial.begin(9600);", "Also in setup(): turn on the Serial Monitor if you use it."], ["}", "The } ends setup()."], ["void loop() {", "loop() runs OVER AND OVER, forever. This is where your program does its work."], ["  digitalWrite(ledPin, HIGH);", "Inside loop(): the actions. Turn the pin ON."], ["  delay(1000);", "Wait 1000 milliseconds (1 second)."], ["  digitalWrite(ledPin, LOW);", "Turn the pin OFF."], ["  delay(1000);", "Wait again. Then loop() starts over from the top."], ["}", "The } ends loop()."]] },
    { rows: [["setup()", "runs once", "pinMode(...), Serial.begin(...), starting values"], ["loop()", "runs forever", "digitalWrite, digitalRead, if statements, delay, Serial.print"]], head: ["Function", "How often", "What goes inside"] },
    { list: ["Every statement ends with a **semicolon ;**", "Code blocks are wrapped in **curly braces { }**. Every { needs a matching }.", "Function calls use **parentheses ( )**, like `delay(1000)`.", "**Capital letters matter:** `digitalWrite` works, `digitalwrite` does not.", "`void` means the function does not give back an answer."] },
    { good: "Try this order: (1) global variables, (2) setup(), (3) loop(). It is the same every time." },
    { href: ["cheat-sheet.html", "Print the one-page cheat sheet"] },
    { links: ["setuploop", "semicolon", "comments", "variables", "functions-all"] }
  ], "skeleton structure basics c++ template setup loop void");
  add("setuploop", CO, "What goes in setup() and what goes in loop()?", [
    { rows: [["Put in setup()", "pinMode() for each pin, Serial.begin(9600), and anything that only needs to happen ONCE (like setting a starting value)."], ["Put in loop()", "Everything that repeats: reading buttons and sensors, if statements, digitalWrite/analogWrite, tone, delay, Serial.print."]], head: ["Where", "What belongs there"] },
    { p: "Example: blink an LED on pin 8." },
    { ex: ["void setup() {", "  pinMode(8, OUTPUT);       // once: pin 8 is an output", "}", "", "void loop() {", "  digitalWrite(8, HIGH);    // over and over: on", "  delay(500);               // wait half a second", "  digitalWrite(8, LOW);     // off", "  delay(500);               // wait half a second", "}"] },
    { warn: "Don't put `pinMode` in loop() (it works, but it is wasteful), and don't put the blinking in setup() (it would only happen once!)." },
    { links: ["skeleton", "pinmode", "digitalwrite"] }
  ], "setup loop what goes where once forever");
  add("semicolon", CO, "Semicolons, braces and parentheses", [
    { rows: [[";", "Ends a statement. Almost every line inside a function ends with one.", "digitalWrite(8, HIGH);"], ["{ }", "Wrap a block of code: a function, an if, a loop. Every { needs a }.", "void loop() { ... }"], ["( )", "Hold the values you give a function, or a condition.", "delay(500)  /  if (x > 5)"], ["\" \"", "Double quotes wrap text.", "Serial.println(\"Hi\");"], ["' '", "Single quotes wrap ONE character.", "char c = 'A';"]], head: ["Symbol", "Use", "Example"] },
    { warn: "No semicolon after `if (...)`, `for (...)`, `while (...)`, or after the } of a function." },
    { good: "The most common mistake is a missing semicolon. The error box says \"I expected a semicolon\" and gives the line number. Look at the end of that line (or the one above)." },
    { links: ["errors"] }
  ], "semicolon brace curly parenthesis bracket quote syntax missing");
  add("comments", CO, "How do I write comments?", [
    { p: "A comment is a note for humans. The Arduino skips it." },
    { ex: ["// This is a one-line comment", "digitalWrite(8, HIGH);   // a comment at the end of a line", "", "/* This is a comment", "   that goes over many lines */"] },
    { good: "In the editor, select lines and press **Ctrl + /** to turn them into comments (and again to turn them back). That is great for testing: \"comment out\" a line to turn it off without deleting it." }
  ], "comment note slash ignore explain");
  add("variables", CO, "What is a variable? (int, float, bool, ...)", [
    { p: "A variable is a **named box** that holds a value. You make one by writing its **type**, a **name**, and (optionally) a starting value." },
    { ex: ["int ledPin = 8;        // a whole number", "float volts = 4.75;    // a number with a decimal", "bool lightOn = true;   // true or false", "String name = \"Ada\";   // text"] },
    { rows: [["int", "whole numbers, -32768 to 32767", "int count = 10;"], ["long", "bigger whole numbers", "long big = 100000;"], ["unsigned long", "big whole numbers, never negative (used for millis)", "unsigned long t = millis();"], ["float", "numbers with a decimal point", "float v = 3.14;"], ["bool", "true or false", "bool on = false;"], ["byte", "0 to 255", "byte level = 200;"], ["char", "one character", "char c = 'A';"], ["String", "text", "String s = \"hi\";"]], head: ["Type", "Holds", "Example"] },
    { list: ["Names can use letters, numbers and _, and cannot start with a number.", "Use clear names: `ledPin` is better than `x`.", "A variable made **outside** all functions is **global** (every function can use it). One made inside a function only works there."] },
    { warn: "On a real Arduino, an `int` can only go up to 32767. Adding 1 to 32767 wraps around to -32768!" },
    { links: ["constants", "intdiv", "operators"] }
  ], "variable int float bool string type declare data");
  add("constants", CO, "const and #define: giving names to pin numbers", [
    { p: "Instead of typing `8` everywhere, give the pin a name. If you move the wire to pin 9, you only change one line." },
    { ex: ["const int ledPin = 8;      // a constant variable (it can never change)", "#define BUTTON 2           // another way (no = and no ;)", "", "void setup() {", "  pinMode(ledPin, OUTPUT);", "  pinMode(BUTTON, INPUT_PULLUP);", "}"] },
    { good: "Use `const` for pin numbers. The word `const` makes sure you never change it by accident." }
  ], "const define constant name pin number");
  add("operators", CO, "Math, comparison and logic operators", [
    { rows: [["+  -  *  /", "add, subtract, multiply, divide", "total = a + b;"], ["%", "remainder after dividing", "7 % 3  is  1"], ["==", "is equal to (two equals signs!)", "if (x == 5)"], ["!=", "is not equal to", "if (x != 5)"], ["<  >  <=  >=", "less, greater, less or equal, greater or equal", "if (x >= 10)"], ["&&", "AND: both must be true", "if (a > 1 && b < 5)"], ["||", "OR: at least one is true", "if (a || b)"], ["!", "NOT: flips true/false", "if (!on)"], ["=", "put a value into a variable", "x = 5;"], ["++  --  +=", "add one, subtract one, add to", "i++;  count += 2;"]], head: ["Operator", "Meaning", "Example"] },
    { warn: "`=` puts a value in. `==` asks \"are these equal?\". Writing `if (x = 5)` is a common bug. The editor warns you." },
    { links: ["intdiv", "ifelse"] }
  ], "operator math plus minus equal compare and or not logic");
  add("intdiv", CO, "Why does 7 / 2 equal 3? (whole-number math)", [
    { p: "When you divide two **whole numbers** (ints), the Arduino throws away the decimal part. This is called **integer division**." },
    { rows: [["7 / 2", "3", "both are ints, so the .5 is dropped"], ["7 / 2.0", "3.5", "one is a decimal (float), so you get the decimal"], ["7 % 2", "1", "the remainder"]], head: ["Math", "Answer", "Why"] },
    { ex: ["float half = 7 / 2;      // 3.00  (the decimal was lost BEFORE storing!)", "float half2 = 7 / 2.0;   // 3.50  (correct)"] },
    { warn: "An `int` is only 16 bits: 32767 + 1 becomes -32768 (it wraps around). Use `long` for big numbers." },
    { links: ["variables", "operators"] }
  ], "integer division decimal float whole overflow wrap");
  add("ifelse", CO, "How do I use if / else?", [
    { p: "An `if` runs code **only when a condition is true**." },
    { ex: ["if (digitalRead(2) == LOW) {", "  digitalWrite(8, HIGH);   // button pressed: LED on", "} else {", "  digitalWrite(8, LOW);    // otherwise: LED off", "}"] },
    { list: ["The condition goes in ( ), and the code to run goes in { }.", "`else` is optional. It runs when the condition is false.", "Use `else if` for more choices.", "Use `==` to compare (two equals signs)."] },
    { ex: ["if (level > 200) {", "  Serial.println(\"bright\");", "} else if (level > 100) {", "  Serial.println(\"medium\");", "} else {", "  Serial.println(\"dark\");", "}"] },
    { links: ["operators", "digitalread"] }
  ], "if else condition decision branch");
  add("loops", CO, "How do I repeat things? (for and while)", [
    { p: "`loop()` already repeats forever, but sometimes you want to repeat something a certain number of times **inside** your code." },
    { ex: ["// for loop: count from 0 to 4 (5 times)", "for (int i = 0; i < 5; i++) {", "  digitalWrite(8, HIGH);", "  delay(200);", "  digitalWrite(8, LOW);", "  delay(200);", "}", "", "// while loop: repeat as long as something is true", "while (digitalRead(2) == HIGH) {", "  // wait here until the button is pressed", "}"] },
    { rows: [["int i = 0", "start", ""], ["i < 5", "keep going while this is true", ""], ["i++", "add 1 after each time", ""]], head: ["Part of the for ( )", "Meaning", ""] },
    { warn: "A `while` loop with a condition that never becomes false repeats forever and your program is stuck." }
  ], "for while loop repeat count iterate");
  add("functions", CO, "How do I write my own function?", [
    { p: "A function is a **named chunk of code** you can reuse. Write it once, call it many times." },
    { ex: ["void blinkOnce() {            // void = gives back nothing", "  digitalWrite(8, HIGH);", "  delay(200);", "  digitalWrite(8, LOW);", "  delay(200);", "}", "", "int doubleIt(int n) {         // int = gives back a whole number", "  return n * 2;", "}", "", "void loop() {", "  blinkOnce();                // call it by name", "  blinkOnce();", "  int x = doubleIt(5);        // x is 10", "}"] },
    { list: ["Write the **return type** (void, int, float...), the **name**, and the **inputs** in ( ).", "`return` hands an answer back.", "Your functions go **above or below** setup() and loop(), not inside them."] }
  ], "function method define return void reuse");
  add("arrays", CO, "What is an array?", [
    { p: "An array is a **row of boxes** with the same type. Each box has a number called its **index**, and the first one is **0**." },
    { ex: ["int pins[] = {2, 3, 4};   // three pins", "", "void setup() {", "  for (int i = 0; i < 3; i++) {", "    pinMode(pins[i], OUTPUT);   // pins[0] is 2, pins[1] is 3, pins[2] is 4", "  }", "}"] },
    { warn: "An array with 3 spots has indexes 0, 1, 2. Using `pins[3]` is out of range and stops your program." }
  ], "array list index brackets");
  add("millis", CO, "delay() vs millis(): doing two things at once", [
    { p: "`delay()` **freezes** your whole program. While it waits, the Arduino cannot read buttons or do anything else." },
    { p: "`millis()` tells you how many milliseconds have passed since the program started. You can use it as a stopwatch without freezing:" },
    { ex: ["unsigned long lastTime = 0;", "", "void loop() {", "  if (millis() - lastTime >= 1000) {   // 1 second has passed", "    lastTime = millis();", "    digitalWrite(8, !digitalRead(8));  // flip the LED", "  }", "  // the button can still be read here, with no freezing", "}"] },
    { links: ["delay", "millisfn"] }
  ], "millis delay timing without blocking stopwatch");
  add("caps", CO, "Capital letters matter!", [
    { p: "C++ treats `A` and `a` as different. `ledPin`, `ledpin` and `LEDPIN` are three different names." },
    { rows: [["digitalWrite", "works"], ["digitalwrite", "ERROR: unknown function"], ["HIGH", "works"], ["high", "ERROR: unknown name"], ["void Loop()", "ERROR: it must be loop()"]], head: ["You typed", "Result"] },
    { good: "When you spell a name wrong, the editor often says \"Did you mean ...?\"." }
  ], "capital case uppercase lowercase spelling typo");
  add("errors", CO, "How do I read an error message?", [
    { p: "When the editor shows a red box, read the **line number** first, then the message." },
    { rows: [["I expected a semicolon ;", "A line is missing its ; at the end (check that line or the one above)."], ["I do not know what 'x' is", "You used a name that was never made. Check spelling and capitals, or declare it (like `int x = 0;`)."], ["I do not know a function called ...", "The function name is spelled wrong, or it is not part of Arduino."], ["This { is never closed", "You are missing a closing brace }."], ["needs 2 values ...", "You gave a function too few or too many values."], ["You can not join text and a number with +", "In Arduino, print text and numbers with two print lines."], ["Your program stopped at line N", "A runtime error: for example dividing by zero or using an array spot that does not exist."]], head: ["Message", "What it means"] },
    { steps: ["Look at the red **line number** in the left margin.", "Read the message under the code box.", "Fix one problem at a time. Errors often make later errors disappear."] }
  ], "error red message compile fix bug debug");

  /* ====================================================================== FUNCTION REFERENCE */
  var FN = cat("Arduino functions (all of them)");
  add("functions-all", FN, "Cheat sheet: every function you will use", [
    { p: "Click any name to learn more." },
    { href: ["cheat-sheet.html", "Print the one-page cheat sheet"] },
    { rows: [["pinMode(pin, mode)", "Set a pin to OUTPUT, INPUT or INPUT_PULLUP. (setup)"], ["digitalWrite(pin, value)", "Set an output pin HIGH (5V) or LOW (0V)."], ["digitalRead(pin)", "Read a pin: HIGH or LOW."], ["analogWrite(pin, 0-255)", "PWM on a ~ pin: dim an LED."], ["analogRead(A0)", "Read a voltage: 0 to 1023."], ["delay(ms)", "Wait that many milliseconds."], ["millis()", "Milliseconds since the program started."], ["tone(pin, hz)  noTone(pin)", "Play and stop a note on a buzzer."], ["Serial.begin(9600)", "Turn on the Serial Monitor."], ["Serial.print / println", "Print to the Serial Monitor."], ["Serial.available() / read()", "Read what you typed into the Serial Monitor."], ["map(v, a, b, c, d)", "Scale a number from one range to another."], ["constrain(v, lo, hi)", "Keep a number between two limits."], ["random(min, max)", "A random whole number (max is not included)."], ["min  max  abs  pow  sqrt", "Math helpers."]], head: ["Function", "What it does"] },
    { links: ["pinmode", "digitalwrite", "digitalread", "analogwrite", "analogread", "delay", "millisfn", "tone", "serial", "map", "random", "mathfns", "constants-hl"] }
  ], "functions list reference cheat sheet all commands");
  add("pinmode", FN, "pinMode(pin, mode)", [
    { p: "Tells the Arduino how a pin will be used. Do this once, in **setup()**, for every pin you use." },
    { ex: ["pinMode(8, OUTPUT);          // pin 8 will send signals (LED)", "pinMode(2, INPUT);           // pin 2 will listen (a sensor)", "pinMode(2, INPUT_PULLUP);    // pin 2 listens, with the built-in pull-up (a button)"] },
    { rows: [["OUTPUT", "the Arduino controls the pin (sends 5V or 0V)", "LEDs, buzzers"], ["INPUT", "the Arduino reads the voltage on the pin", "sensors"], ["INPUT_PULLUP", "INPUT plus a built-in resistor to 5V", "buttons wired to GND"]], head: ["Mode", "Meaning", "Use for"] },
    { warn: "Forgetting pinMode(OUTPUT) is why an LED often will not light." },
    { links: ["pullup", "digitalwrite"] }
  ], "pinmode output input mode setup");
  add("digitalwrite", FN, "digitalWrite(pin, HIGH or LOW)", [
    { p: "Turns an **output** pin on (5 volts) or off (0 volts)." },
    { ex: ["digitalWrite(8, HIGH);   // pin 8 gives 5V: LED on", "digitalWrite(8, LOW);    // pin 8 gives 0V: LED off"] },
    { list: ["The pin must be set to OUTPUT with pinMode first.", "HIGH = 5V = 1 = on.   LOW = 0V = 0 = off."] },
    { links: ["pinmode", "constants-hl", "delay"] }
  ], "digitalwrite high low on off turn");
  add("digitalread", FN, "digitalRead(pin)", [
    { p: "Looks at an **input** pin and gives back **HIGH** (about 5V) or **LOW** (about 0V)." },
    { ex: ["int state = digitalRead(2);", "if (state == LOW) {", "  Serial.println(\"button pressed\");", "}"] },
    { list: ["With **INPUT_PULLUP** and a button to GND: **LOW = pressed**, HIGH = not pressed.", "Use `==` (two equals signs) to compare."] },
    { links: ["pullup", "ifelse", "floating"] }
  ], "digitalread read input button state");
  add("analogwrite", FN, "analogWrite(pin, value)", [
    { p: "Sends a **PWM** signal to a ~ pin. The value is **0 (off) to 255 (full on)**. Great for dimming an LED." },
    { ex: ["analogWrite(9, 0);      // off", "analogWrite(9, 64);     // dim", "analogWrite(9, 128);    // medium", "analogWrite(9, 255);    // full"] },
    { warn: "Only the ~ pins (3, 5, 6, 9, 10, 11) can do PWM." },
    { links: ["pwm"] }
  ], "analogwrite pwm dim fade brightness");
  add("analogread", FN, "analogRead(pin)", [
    { p: "Measures the **voltage** on an analog pin (A0 to A5) and gives back a number from **0 (0 volts) to 1023 (5 volts)**." },
    { ex: ["int v = analogRead(A0);", "float volts = v * 5.0 / 1023;   // turn it into volts", "Serial.println(volts);"] },
    { rows: [["0 volts", "0"], ["2.5 volts", "about 512"], ["5 volts", "1023"]], head: ["Voltage on the pin", "analogRead gives"] }
  ], "analogread analog voltage sensor 1023 a0");
  add("delay", FN, "delay(milliseconds)", [
    { p: "Pauses your program. 1000 milliseconds = 1 second." },
    { rows: [["delay(1000)", "1 second"], ["delay(500)", "half a second"], ["delay(100)", "a tenth of a second"], ["delay(1)", "one millisecond"]], head: ["Code", "Wait"] },
    { warn: "While `delay()` is waiting, nothing else happens (the Arduino cannot read buttons)." },
    { links: ["millis"] }
  ], "delay wait pause time sleep");
  add("millisfn", FN, "millis() and micros()", [
    { p: "`millis()` returns how many **milliseconds** passed since the program started (`unsigned long`). `micros()` counts microseconds." },
    { ex: ["unsigned long start = millis();", "// ... later ...", "unsigned long elapsed = millis() - start;"] },
    { links: ["millis"] }
  ], "millis micros time clock stopwatch");
  add("tone", FN, "tone(pin, frequency) and noTone(pin)", [
    { p: "Plays a note on a buzzer. The **frequency** is in hertz (Hz): bigger numbers make higher notes." },
    { ex: ["tone(9, 440);          // note A, plays until noTone", "tone(9, 880, 500);     // plays for 500 milliseconds", "noTone(9);             // stop"] },
    { rows: [["262", "C (middle C)"], ["294", "D"], ["330", "E"], ["349", "F"], ["392", "G"], ["440", "A"], ["494", "B"], ["523", "C (one octave up)"]], head: ["Frequency", "Note"] },
    { links: ["buzzer"] }
  ], "tone notrone buzzer note music frequency hz");
  add("serial", FN, "Serial.begin, Serial.print, Serial.println", [
    { ex: ["void setup() {", "  Serial.begin(9600);            // do this once", "}", "void loop() {", "  Serial.print(\"Light: \");        // no new line after", "  Serial.println(42);            // prints 42, then a new line", "  Serial.println(3.14159, 3);    // prints 3.142 (3 decimals)", "  delay(500);", "}"] },
    { list: ["`print` stays on the same line. `println` moves to the next line after.", "Text goes in \"double quotes\". Numbers and variables do not.", "`Serial.available()` says how many typed characters are waiting. `Serial.read()` takes one."] },
    { warn: "You cannot join text and a number with +. Use two lines: `Serial.print(\"Score: \"); Serial.println(score);`" },
    { links: ["serialmon"] }
  ], "serial print println begin read available monitor");
  add("serialnothing", FN, "My Serial Monitor shows nothing", [
    { list: ["Did you call `Serial.begin(9600);` in setup()?", "Did you click Start Simulation (and does the pin bar show activity)?", "Is the code reaching the print line? (It might be stuck in a loop or an if that is never true.)", "Is the **Serial Monitor** panel cleared? Click Clear and run again."] }
  ], "serial nothing blank empty no output");
  add("map", FN, "map(value, fromLow, fromHigh, toLow, toHigh) and constrain()", [
    { p: "`map` changes a number from one range to another. For example, turn a sensor reading (0 to 1023) into an LED brightness (0 to 255)." },
    { ex: ["int level = analogRead(A0);                  // 0 to 1023", "int brightness = map(level, 0, 1023, 0, 255);   // 0 to 255", "analogWrite(9, brightness);"] },
    { p: "`constrain(x, low, high)` keeps `x` inside the limits:" },
    { ex: ["int safe = constrain(300, 0, 255);   // 255"] }
  ], "map constrain scale range convert");
  add("random", FN, "random(min, max) and randomSeed()", [
    { p: "Gives a random whole number from `min` up to **but not including** `max`." },
    { ex: ["int roll = random(1, 7);     // 1, 2, 3, 4, 5 or 6 (a die)", "int pick = random(10);       // 0 to 9", "randomSeed(analogRead(A0)); // optional: mix up the starting point"] }
  ], "random dice number seed");
  add("mathfns", FN, "min, max, abs, pow, sqrt, sq", [
    { rows: [["min(3, 9)", "3", "the smaller one"], ["max(3, 9)", "9", "the bigger one"], ["abs(-5)", "5", "remove the minus sign"], ["pow(2, 3)", "8.0", "2 to the power 3"], ["sqrt(16)", "4.0", "square root"], ["sq(5)", "25", "5 squared"]], head: ["Code", "Answer", "Meaning"] }
  ], "min max abs pow sqrt sq math");
  add("constants-hl", FN, "HIGH, LOW, INPUT, OUTPUT, true, false, LED_BUILTIN, A0", [
    { rows: [["HIGH", "1", "5 volts. On."], ["LOW", "0", "0 volts. Off."], ["OUTPUT", "", "pin sends signals"], ["INPUT", "", "pin listens"], ["INPUT_PULLUP", "", "pin listens, pulled up to 5V"], ["true / false", "1 / 0", "for bool variables and conditions"], ["LED_BUILTIN", "13", "the orange L light"], ["A0 ... A5", "14 ... 19", "the analog pins"]], head: ["Name", "Value", "Meaning"] },
    { good: "These are built into Arduino. Type them exactly, with capital letters." }
  ], "high low input output true false led_builtin a0 constants");

  /* ====================================================================== TROUBLESHOOTING */
  var TR = cat("Fixing problems");
  add("trouble-nolight", TR, "My LED does not light up", [
    { p: "Go down this list in order:" },
    { steps: ["**Leg dots:** are both LED legs and both resistor legs green (plugged in)?", "**Direction:** is the **long leg (anode, +)** toward the pin side, and the **short leg (cathode, -)** toward GND?", "**Complete loop:** is there a wire from the LED's short leg (through its column) to **GND**?", "**Same column:** do the resistor and LED share a column so they connect?", "**Code:** did you set `pinMode(pin, OUTPUT);` and `digitalWrite(pin, HIGH);` with the SAME pin number as your wire?", "**Running:** did you click Start Simulation? Look at the pin bar: does it say HIGH?", "**Burned out?** A black X on the LED means it burned out. Click Reset and add a resistor."] },
    { links: ["ledhow", "breadboard", "ledburn"] }
  ], "led not light off dark nothing wrong fix");
  add("buttonfix", TR, "My button does nothing", [
    { steps: ["Is the button placed **across the center gap**? All four leg dots must be green.", "Is one side wired to the pin and the other side to **GND**?", "Did you use `pinMode(pin, INPUT_PULLUP);`?", "Remember: with INPUT_PULLUP, **LOW means pressed**. Check for `== LOW`.", "While the simulation runs, **click and hold** the button on the canvas."] },
    { links: ["button", "pullup"] }
  ], "button not working does nothing press");
  add("nosound", TR, "My buzzer makes no sound", [
    { steps: ["Is the + leg wired to a pin and the - leg to GND?", "Do you use `tone(pin, 440);` (not digitalWrite)?", "Are your computer speakers on? (You must click Start Simulation first.)", "Look for the yellow wave marks next to the buzzer. If you see them, it is playing."] },
    { links: ["buzzer", "tone"] }
  ], "buzzer sound silent noise tone");
  add("stoppedline", TR, "Why did my program stop at line N?", [
    { p: "A **runtime error** means the code was fine to start, but something went wrong while it ran. The editor shows the line number." },
    { list: ["**Array index out of range:** you used a spot number that does not exist.", "**Divided by zero:** the number you divide by was 0.", "**Pin does not exist:** use pins 0 to 13 and A0 to A5."] }
  ], "stopped runtime error line crash");
  add("trouble", TR, "Quick fixes for common problems", [
    { rows: [["LED never lights", "No pinMode OUTPUT, wrong pin number, missing GND wire, or LED backwards."], ["LED is dim", "Resistor too big (try 220 ohms)."], ["LED burned out", "No resistor. Click Reset."], ["Button seems backwards", "INPUT_PULLUP: LOW means pressed."], ["Random 0s and 1s", "A floating input. Use INPUT_PULLUP."], ["Nothing in Serial Monitor", "Missing Serial.begin(9600)."], ["Red error box", "Read the line number and message."], ["Part will not stay put", "Drag it so the leg dots turn green."]], head: ["Problem", "Fix"] },
    { links: ["trouble-nolight", "buttonfix", "nosound", "errors"] }
  ], "problem fix troubleshooting common mistakes");

  /* ---------- Unit 2 extras */
  add("resistorspan", EL, "How do I stretch a resistor across the breadboard?", [
    { p: "A resistor has no polarity, so either leg can go either way. Its legs can be spread **3 to 12 holes apart**. Click the resistor, then use the **Longer / Shorter** buttons in the box under the canvas to change how far apart the legs are." },
    { good: "A resistor that spans the center gap lets one leg sit in the top half and one in the bottom half." }
  ], "resistor span stretch long short legs holes");
  add("seriesparallel", EL, "Series and parallel: two ways to join parts", [
    { p: "**Series:** parts one after another in a single path, like beads on a string. The same current flows through all of them. **Parallel:** parts side by side, each with its own path between the same two points. Each branch gets the full voltage." },
    { rows: [["Series", "One path. Break it anywhere and everything stops.", "Two resistors in a row make the current smaller."], ["Parallel", "Several paths. One branch can be off while others stay on.", "Two LEDs each with their own resistor."]], head: ["Type", "Idea", "Example"] },
    { good: "Each LED gets its own resistor. That is how a traffic light works: three parallel branches." }
  ], "series parallel branch path current");
  add("tracepath", EL, "How do I trace where the electricity flows?", [
    { p: "Put your finger on the **5V** pin (or a pin set HIGH) and follow the wire. Every time you reach a part, ask: which leg did I enter, and which leg leaves? Keep going until you get back to **GND**. If you cannot get all the way to GND, the circuit is not complete and nothing will light." },
    { steps: ["Start at 5V or an output pin.", "Follow the wire to a breadboard strip (the 5 holes in a column are joined).", "Cross the part (resistor, LED, button).", "Follow wires or strips to GND."] }
  ], "trace path flow follow current loop complete");
  add("trafficlight", CO, "How does a traffic light sequence work in code?", [
    { p: "A traffic light is a list of steps that repeats forever: **turn one light on, wait, turn it off, move to the next light**. Because loop() repeats automatically, you only write the cycle once." },
    { ex: ["digitalWrite(greenPin, HIGH);", "delay(greenTime);", "digitalWrite(greenPin, LOW);", "// then yellow, then red"] },
    { warn: "If you forget to turn a light LOW, it stays on forever and two lights are on at once." }
  ], "traffic light sequence order green yellow red");
  add("datatypes", CO, "Data types: boolean, byte, int, long, float, char", [
    { rows: [["boolean", "true or false", "1 byte"], ["byte", "0 to 255", "1 byte"], ["char", "one character like 'A'", "1 byte"], ["int", "-32,768 to 32,767", "2 bytes"], ["long", "about -2.1 billion to 2.1 billion", "4 bytes"], ["float", "decimal numbers like 0.5", "4 bytes"]], head: ["Type", "Holds", "Size"] },
    { p: "The Uno has only **2,048 bytes** of memory for variables, so use the smallest box that fits." },
    { links: ["variables", "bytewrap", "globalvar"] }
  ], "data type boolean byte int long float char size range memory");
  add("globalvar", CO, "Global variables: why declare them at the top?", [
    { p: "A variable declared **above setup()** is global: every function can use it, and it **keeps its value** between loops. A variable declared **inside loop()** is created fresh every time loop() restarts, so it forgets what it learned last time." },
    { ex: ["int blinkSpeed = 500;   // global", "void loop() {", "  int x = 0;           // local: reset every loop", "}"] }
  ], "global local scope variable top declare reset");
  add("notop", CO, "The NOT operator (!) and flipping a value", [
    { p: "The exclamation point means **NOT**. It flips true to false and false to true. So `ledState = !ledState;` toggles the variable every time it runs. In the button circuit, `!buttonState` turns the reading (LOW when pressed) into true when pressed." },
    { rows: [["!true", "false"], ["!false", "true"], ["!HIGH", "LOW"], ["!LOW", "HIGH"]], head: ["Expression", "Result"] }
  ], "not operator exclamation flip toggle invert boolean");
  add("bytewrap", CO, "What happens when a byte goes past 255?", [
    { p: "A byte can only hold 0 to 255. Add 1 to 255 and it **wraps around to 0**, like a car odometer rolling over. The same thing happens to an int at 32,767 (it wraps to -32,768)." },
    { good: "Use a bigger type (int or long) for anything that might count past 255." }
  ], "byte wrap overflow 255 rollover odometer");
  add("sourcesink", EL, "Source and sink: where the current goes", [
    { p: "A pin set HIGH can **source** current: push it out to a part. A pin set LOW can **sink** current: pull it in. An LED wired from a pin to GND is **sourced** (HIGH turns it on). An LED wired from 5V to a pin is **sunk** (LOW turns it on). Either way current needs a full loop from + to -." },
    { warn: "A pin can only safely handle about 20 mA, so always use a resistor." }
  ], "source sink current high low direction");
  add("doorbell", PA, "The doorbell analogy for a button", [
    { p: "A doorbell button is a gap in a wire. While nobody pushes, the gap is open and nothing happens. When a visitor **pushes**, the gap closes, current flows, and the bell rings. In the Arduino circuit, pressing the button connects the input pin to GND, so the pin reads **LOW**. Letting go lets the pull-up resistor pull the pin back to **HIGH**." }
  ], "doorbell analogy button press circuit gap");
})(typeof window !== "undefined" ? window : globalThis);
