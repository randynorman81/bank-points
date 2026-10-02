/* Notes content for Unit 9: Intro to Arduino (CodeHS Unit 3). Rendered by ../notes-engine.js and ../notes-arduino.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", soft: "#8B9AAE", ink: "#EAEFF6" };
  function fileOf(k, name) { return "9-" + k + "-" + name + ".html"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function board(hi) {
    hi = hi || []; var o = '<rect x="10" y="30" width="640" height="150" rx="10" fill="#0B5C63" stroke="#5FD8DF" stroke-width="2"/>' + t(330, 110, "ARDUINO UNO", 22, "#EAEFF6", "middle") + t(330, 132, "Tinkercad Circuits", 12, "#BFEFF2", "middle"), i, x;
    o += t(30, 22, "Digital pins (0 to 13). Pins marked ~ can do PWM: 3, 5, 6, 9, 10, 11", 11, C.soft);
    for (i = 13; i >= 0; i--) { x = 30 + (13 - i) * 42; var on = hi.indexOf("D" + i) >= 0, pw = [3, 5, 6, 9, 10, 11].indexOf(i) >= 0; o += '<rect x="' + x + '" y="34" width="26" height="22" rx="3" fill="' + (on ? C.amb : "#10141C") + '" stroke="#8B9AAE"/>' + t(x + 13, 49, (pw ? "~" : "") + i, 11, on ? "#05070B" : C.ink, "middle"); }
    var low = ["5V", "GND", "A0", "A1", "A2", "A3", "A4", "A5"];
    o += t(30, 200, "Power pin and analog inputs", 11, C.soft);
    low.forEach(function (p, k) { var xx = 150 + k * 52, on2 = hi.indexOf(p) >= 0; o += '<rect x="' + xx + '" y="152" width="40" height="22" rx="3" fill="' + (on2 ? C.amb : "#10141C") + '" stroke="#8B9AAE"/>' + t(xx + 20, 167, p, 11, on2 ? "#05070B" : C.ink, "middle"); });
    return '<svg viewBox="0 0 660 210" role="img" aria-label="Arduino Uno pin layout">' + o + "</svg>";
  }
  function waves() {
    var o = t(10, 18, "Digital: only two levels", 12, C.acc) + t(300, 18, "Analog: any level in between", 12, C.amb), i, p = "M10 100";
    o += '<path d="M10 110 H60 V50 H130 V110 H190 V50 H250 V110 H280" fill="none" stroke="#5FD8DF" stroke-width="3"/>' + t(10, 128, "LOW (0 V)", 11, C.soft) + t(10, 44, "HIGH (5 V)", 11, C.soft);
    for (i = 0; i <= 270; i += 5) p += " L" + (300 + i) + " " + (80 - Math.sin(i / 270 * Math.PI * 2.4) * 32 + (i > 0 ? 0 : 0)); p = p.replace("M10 100 L", "M");
    o += '<path d="' + p + '" fill="none" stroke="#FDD877" stroke-width="3"/>' + t(300, 128, "0 V to 5 V, smoothly", 11, C.soft);
    return '<svg viewBox="0 0 600 140" role="img" aria-label="Digital versus analog signals">' + o + "</svg>";
  }

  D["9.1"] = {
    id: "9.1", title: "Welcome to Arduino!", lessonFile: fileOf(1, "welcome-to-arduino"), codehs: "CodeHS 3.1", tags: ["Arduino", "Tinkercad"],
    deck: "What physical computing is, what an Arduino does in the middle of a circuit, and how to read the board and a simple circuit in Tinkercad.",
    sections: [
      { h: "Computers That Touch the World", f: "Section 1", story: "Until now your programs only lived on a screen. Physical computing connects code to the real world: a sensor notices something, the code decides what to do, and an output like a light or motor responds. A thermostat and an automatic door both work this way.",
        b: [["gfx", "flow", { steps: ["Input|button, dial, sensor", "Arduino|runs your code", "Output|LED, motor, buzzer"], perRow: 3, colors: ["#FDD877", "#5FD8DF", "#FCA5A5"] }, "Every circuit in this unit follows input, then code, then output."],
          ["cards", [["Physical computing", "Programming that senses or controls things in the real world."], ["Arduino", "A small, cheap computer board (a microcontroller) that reads inputs and controls outputs."], ["Tinkercad Circuits", "A free simulator where you build circuits and run Arduino code in your browser."], ["Component", "One part of a circuit, like an LED, resistor, or button."], ["Circuit", "A complete loop that electricity can flow around."], ["Simulator", "Software that behaves like real hardware so you can test safely."]]]] },
      { h: "Know Your Board", f: "Section 2", story: "The Arduino Uno has a row of digital pins, a few analog inputs, and power pins. Click a name below to see where it lives on the board.",
        b: [["widget", { html: '<div class="chips2" id="bc"></div><div class="fig" id="bf" style="margin:0"></div><div class="wout" id="bn"></div>', js: function (w) {
          var info = [["Digital pins", ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"], "Each one can be set HIGH (5 V) or LOW (0 V), or read as on or off."], ["PWM pins", ["D3", "D5", "D6", "D9", "D10", "D11"], "The ~ pins can fake an in-between level with analogWrite()."], ["Analog inputs", ["A0", "A1", "A2", "A3", "A4", "A5"], "They read a voltage between 0 V and 5 V as a number from 0 to 1023."], ["Power", ["5V", "GND"], "5V supplies power. GND is the return path (ground)."], ["Pin 13", ["D13"], "Pin 13 also has a tiny built-in LED, which is why it is used for the first Blink program."]], fig = w.querySelector("#bf"), note = w.querySelector("#bn"), box = w.querySelector("#bc");
          function show(i) { fig.innerHTML = board(info[i][1]); note.textContent = info[i][2]; [].forEach.call(box.children, function (c, k) { c.classList.toggle("on", k === i); }); }
          info.forEach(function (x, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = x[0]; b.onclick = function () { show(i); }; box.appendChild(b); }); show(0); } }]] },
      { h: "A Circuit Is a Loop", f: "Try it", story: "Electricity only flows if it has a complete loop to travel around. Flip the switch to close or break the loop.",
        b: [["widget", { html: '<svg viewBox="0 0 440 200" id="cl" style="width:100%;max-width:440px;display:block;margin:0 auto" role="img" aria-label="Simple circuit with a switch"></svg><div class="btns"><button class="btn" id="sw" type="button">Flip the switch</button></div><div class="wout" id="cs" style="text-align:center"></div>', js: function (w) {
          var on = false, svg = w.querySelector("#cl"), s = w.querySelector("#cs");
          function draw() {
            svg.innerHTML = '<path d="M60 40 H150" stroke="#8B9AAE" stroke-width="4" fill="none"/><path d="M230 40 H380 V100" stroke="#8B9AAE" stroke-width="4" fill="none"/><path d="M380 150 V180 H60 V40" stroke="#8B9AAE" stroke-width="4" fill="none"/>' +
              '<rect x="30" y="80" width="60" height="70" rx="6" fill="#151A24" stroke="#5FD8DF" stroke-width="2"/><text x="60" y="120" font-size="13" fill="#EAEFF6" text-anchor="middle">5V</text>' +
              '<path d="M60 80 V40 M60 150 V180" stroke="#8B9AAE" stroke-width="4"/><circle cx="380" cy="125" r="26" fill="' + (on ? "#EF4444" : "#4B1D1D") + '" stroke="#94A3B8" stroke-width="3"/>' + (on ? '<circle cx="380" cy="125" r="42" fill="#EF4444" opacity=".25"/>' : "") +
              '<line x1="150" y1="40" x2="' + (on ? 230 : 215) + '" y2="' + (on ? 40 : 14) + '" stroke="#FDD877" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="40" r="5" fill="#FDD877"/><circle cx="230" cy="40" r="5" fill="#FDD877"/><text x="190" y="72" font-size="12" fill="#8B9AAE" text-anchor="middle">switch</text>';
            s.textContent = on ? "The loop is closed. Current flows and the LED lights." : "The loop is open. Nothing flows, so the LED stays off."; }
          w.querySelector("#sw").onclick = function () { on = !on; draw(); }; draw(); } }],
          ["match", [["LED", "Lights up when current flows through it"], ["Resistor", "Limits current so the LED is not damaged"], ["Breadboard", "A board that connects parts without soldering"], ["Arduino Uno", "The board that runs your code"]]]] }
    ],
    quiz: [["What is physical computing?", ["Programming only on paper", "Code that senses or controls the real world", "Typing quickly", "Building only websites"], 1, "Sensors in, outputs out."], ["What does an Arduino do in a circuit?", ["Only stores power", "Runs code that reads inputs and controls outputs", "Replaces the LED", "Draws the circuit"], 1, "It is the brain in the middle."], ["Why does a circuit need to be a complete loop?", ["For looks", "Electricity needs a path to flow around", "To save memory", "It does not"], 1, "A broken loop stops the current."], ["What is Tinkercad Circuits?", ["A real Arduino", "A browser simulator for building circuits", "A language", "A sensor"], 1, "You build and test without hardware."]],
    end: ["Input, code, output.", "Every Arduino project, big or small, follows that pattern."]
  };

  D["9.2"] = {
    id: "9.2", title: "Setting Up your Arduino", lessonFile: fileOf(2, "setting-up-your-arduino"), codehs: "CodeHS 3.2", tags: ["Arduino", "digitalWrite", "delay"],
    deck: "How an Arduino program is organized into setup() and loop(), how digitalWrite() switches a pin on and off, and how delay() sets the rhythm.",
    sections: [
      { h: "Two Parts to Every Sketch", f: "Section 1", story: "An Arduino program has two required functions. setup() runs once when the board starts. loop() then runs again and again, forever. Anything the board should keep doing belongs in loop().",
        b: [["gfx", "flow", { steps: ["Power on|board starts", "setup()|runs once", "loop()|runs over and over"], perRow: 3, colors: ["#8B9AAE", "#5FD8DF", "#FDD877"] }, "Once loop() finishes it starts again immediately."],
          ["cards", [["setup()", "Runs one time at startup. Use it to prepare pins with pinMode()."], ["loop()", "Runs repeatedly after setup(). Your main program lives here."], ["digitalWrite()", "Sets a pin HIGH (5 V, on) or LOW (0 V, off)."], ["delay()", "Pauses the program for that many milliseconds. 1000 ms is one second."], ["HIGH / LOW", "The two states of a digital pin: on and off."], ["Pin", "A numbered connection on the board that your code can control or read."]]]] },
      { h: "Watch Blink Run", f: "Try it", story: "This is the classic first Arduino program. Slide the delays and watch the highlighted line move. The line that is highlighted is the one the Arduino is waiting on.",
        b: [["ard", "blink", { pin: 13, on: 1000, off: 1000 }], ["hint", "Make both delays 100 and the LED flickers fast. Make them 2000 and it blinks slowly. Only the numbers inside delay() changed."]] },
      { h: "Order Matters", f: "Check yourself", story: "Computers run lines in order. Rebuild the Blink program in the right order.",
        b: [["order", { q: "Put the Blink program in order.", lines: ["pinMode(13, OUTPUT);", "digitalWrite(13, HIGH);", "delay(1000);", "digitalWrite(13, LOW);", "delay(1000);"], why: "Set the pin up first, then switch on, wait, switch off, wait.", hint: "A pin has to be set up as an output before you write to it." }],
          ["predict", { lang: "cpp", code: "digitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);\ndelay(1500);", q: "In each loop, how long is the LED on?", opts: ["500 ms", "1500 ms", "2000 ms", "1000 ms"], ans: 0, why: "The LED is on during the first delay (500 ms) and off during the second (1500 ms)." }]] }
    ],
    quiz: [["How many times does setup() run?", ["Forever", "Once", "Twice", "Every second"], 1, "It runs once at startup."], ["What does digitalWrite(13, HIGH) do?", ["Reads pin 13", "Turns pin 13 on (5 V)", "Waits 13 ms", "Turns pin 13 off"], 1, "HIGH means on."], ["How long is delay(2000)?", ["2 ms", "20 ms", "2 seconds", "2 minutes"], 2, "Delays are in milliseconds."], ["Where does code that should repeat go?", ["setup()", "loop()", "Above everything", "Nowhere"], 1, "loop() repeats."]],
    end: ["setup() once, loop() forever.", "Almost every Arduino program is built on those two ideas."]
  };

  D["9.3"] = {
    id: "9.3", title: "Comments & Pseudocode", lessonFile: fileOf(3, "comments-and-pseudocode"), codehs: "CodeHS 3.3", tags: ["Arduino", "analogWrite", "PWM"],
    deck: "Planning with pseudocode, explaining with comments, and the difference between digital and analog that makes analogWrite() and brightness control possible.",
    sections: [
      { h: "Plan First: Pseudocode", f: "Section 1", story: "Pseudocode is a plan for your program written in plain English. It is not real code, so no computer will run it, but it makes the real code much easier to write. Comments keep that plan inside your code for the next reader.",
        b: [["code", "cpp", "// PSEUDOCODE\n// 1. set up the LED pin as an output\n// 2. turn the LED on\n// 3. wait one second\n// 4. turn the LED off\n// 5. wait one second\n\nvoid setup() {\n  pinMode(9, OUTPUT);      // step 1\n}\nvoid loop() {\n  digitalWrite(9, HIGH);   // step 2\n  delay(1000);             // step 3\n  digitalWrite(9, LOW);    // step 4\n  delay(1000);             // step 5\n}"],
          ["match", [["set up the LED pin as an output", "pinMode(9, OUTPUT);"], ["turn the LED on", "digitalWrite(9, HIGH);"], ["wait one second", "delay(1000);"], ["turn the LED off", "digitalWrite(9, LOW);"]]],
          ["table", ["", "Python", "Arduino (C++)"], [["Single-line comment", "# note", "// note"], ["Multi-line comment", "(none, use several #)", "/* note */"]]],
          ["cards", [["Comment", "A note in your code that the computer ignores."], ["Pseudocode", "A plain-English plan for a program, written before the real code."]]]] },
      { h: "Digital vs. Analog", f: "Section 2", story: "A light switch is digital: on or off. A dimmer is analog: anywhere in between. The Arduino's pins are digital, but there is a trick that lets them fake in-between levels.",
        b: [["svg", waves(), "A digital pin only has two levels. An analog signal can take any value in a range."], ["cards", [["Analog vs. digital", "Digital has two states (on or off). Analog has a smooth range of values."]]]] },
      { h: "analogWrite() and PWM", f: "Try it", story: "analogWrite() takes a value from 0 to 255. The Arduino switches the pin on and off thousands of times a second. The longer it stays on each cycle (the duty cycle), the brighter the LED looks. This trick is called PWM, pulse width modulation, and it only works on the ~ pins.",
        b: [["ard", "pwm", { pin: 9 }], ["predict", { lang: "cpp", code: "analogWrite(9, 255);", q: "How bright is the LED?", opts: ["Off", "Half brightness", "Full brightness", "It depends"], ans: 2, why: "255 is the maximum value, so the pin stays on all the time." }],
          ["cards", [["analogWrite()", "Sets a PWM pin to a value from 0 (always off) to 255 (always on)."], ["PWM (pulse width modulation)", "Switching a pin on and off very fast so the average level looks in between."]]]] }
    ],
    quiz: [["What is pseudocode?", ["Code that runs faster", "A plain-English plan for a program", "A type of LED", "A bug"], 1, "It is a plan, not real code."], ["Which symbol starts a comment in Arduino code?", ["#", "//", "--", "**"], 1, "C++ uses // for single-line comments."], ["What range does analogWrite() accept?", ["0 to 1", "0 to 100", "0 to 255", "0 to 1023"], 2, "255 is full."], ["analogWrite(9, 0) makes the LED...", ["Full bright", "Half bright", "Off", "Blink"], 2, "0 means always off."]],
    end: ["Plan in words, then write the code.", "And use PWM when you need a level between on and off."]
  };

  D["9.4"] = {
    id: "9.4", title: "Variables", lessonFile: fileOf(4, "variables"), codehs: "CodeHS 3.4", tags: ["Arduino", "analogRead", "map"],
    deck: "Variables in Arduino code, how a breadboard connects parts, and how analogRead() and map() turn a dial into the right range for an LED.",
    sections: [
      { h: "Variables Store Readings", f: "Section 1", story: "A variable holds a value so you can use it again. In Arduino C++ you declare the type, like int for a whole number. A very common job: read a sensor into a variable, then use that variable to control something.",
        b: [["trace", { lang: "cpp", code: ["int reading = analogRead(A0);", "int brightness = map(reading, 0, 1023, 0, 255);", "analogWrite(9, brightness);"], steps: [[0, { reading: "512" }, "", "analogRead gives a number from 0 to 1023. The dial is halfway."], [1, { reading: "512", brightness: "127" }, "", "map rescales 0 to 1023 into 0 to 255."], [2, { reading: "512", brightness: "127" }, "analogWrite(9, 127)", "The LED gets half brightness."]] }],
          ["cards", [["Variable", "A named place that stores a value."], ["analogRead()", "Reads an analog pin and returns 0 to 1023."], ["map()", "Rescales a number from one range to another."], ["Potentiometer", "A dial that changes its resistance, so a pin can read how far it is turned."]]]] },
      { h: "Dial to Brightness", f: "Try it", story: "Turn the virtual dial. The reading goes from 0 to 1023, but analogWrite() only understands 0 to 255, so map() shrinks the range.",
        b: [["ard", "map", { inLow: 0, inHigh: 1023, outLow: 0, outHigh: 255, out: "analogWrite(9, brightness)" }],
          ["predict", { lang: "cpp", code: "map(512, 0, 1023, 0, 180)", q: "What is about the result?", opts: ["512", "180", "90", "255"], ans: 2, why: "512 is about halfway through 0 to 1023, so halfway through 0 to 180 is about 90." }]] },
      { h: "How a Breadboard Connects", f: "Section 2", story: "A breadboard lets you build circuits without soldering. Inside, the five holes in each short column strip are connected to each other. Click a hole to see what it is wired to.",
        b: [["widget", { html: '<svg viewBox="0 0 420 190" id="bb" style="width:100%;max-width:480px;display:block;margin:0 auto;cursor:pointer" role="img" aria-label="breadboard"></svg><div class="wout" id="bt" style="text-align:center">Click a hole.</div>', js: function (w) {
          var svg = w.querySelector("#bb"), note = w.querySelector("#bt"), o = "", c, r, sel = null;
          function draw() { o = '<rect x="5" y="5" width="410" height="180" rx="8" fill="#151A24" stroke="#3A4658" stroke-width="2"/><rect x="5" y="88" width="410" height="14" fill="#0B0E14"/>'; for (c = 0; c < 10; c++) { for (r = 0; r < 10; r++) { var half = r < 5 ? 0 : 1, y = half ? 118 + (r - 5) * 14 : 22 + r * 14, same = sel && sel.c === c && sel.half === half; o += '<rect x="' + (30 + c * 38) + '" y="' + y + '" width="12" height="12" rx="3" fill="' + (same ? "#FDD877" : "#0B0E14") + '" stroke="#3A4658" data-c="' + c + '" data-h="' + half + '"/>'; } } svg.innerHTML = o; }
          svg.onclick = function (e) { var d = e.target.getAttribute && e.target.getAttribute("data-c"); if (d == null) return; sel = { c: +d, half: +e.target.getAttribute("data-h") }; draw(); note.textContent = "These 5 holes in column " + (sel.c + 1) + " are connected. The gap in the middle keeps the top and bottom halves separate."; }; draw(); } }],
          ["hint", "Plug an LED leg and a resistor leg into the same column strip and they are connected. Plug them into different strips and they are not."]] }
    ],
    quiz: [["What does analogRead() return?", ["0 or 1", "0 to 255", "0 to 1023", "A letter"], 2, "A 10-bit reading: 0 to 1023."], ["Why use map()?", ["To draw a map", "To rescale a value into another range", "To read a pin", "To delay"], 1, "It converts one range into another."], ["What is a variable?", ["A named storage place", "A kind of wire", "A pin", "A comment"], 0, "It stores a value."], ["Which holes on a breadboard are connected?", ["All of them", "The 5 holes in the same short strip", "Every other hole", "None"], 1, "Each short column strip is connected."]],
    end: ["Read it. Rescale it. Use it.", "That input, process, output pattern runs through most of the projects you will build."]
  };

  D["9.5"] = {
    id: "9.5", title: "Debugging", lessonFile: fileOf(5, "debugging"), codehs: "CodeHS 3.5", tags: ["Arduino", "Serial Monitor"],
    deck: "A step-by-step way to debug a circuit and a program, and how the Serial Monitor lets your Arduino tell you what it is thinking.",
    sections: [
      { h: "A Process for Finding Bugs", f: "Section 1", story: "When something does not work, guessing wastes time. A circuit can fail because of the wiring or the code, so check one thing at a time and keep notes on what you tried.",
        b: [["gfx", "flow", { steps: ["What should happen?|say it out loud", "What does happen?|observe closely", "Check the wiring|every connection", "Check the code|print the values", "Change one thing|then test again"], perRow: 5 }, "Change only one thing at a time, or you won't know which change fixed it."],
          ["match", [["LED never lights", "Backwards LED or missing pinMode"], ["LED always on", "Pin wired to 5V, not the pin"], ["Number never changes", "Dial wired to the wrong analog pin"], ["Code won't upload", "A typo or missing semicolon"]]],
          ["cards", [["Debugging", "Finding and fixing problems in code or a circuit."], ["Bug", "A mistake that makes a program or circuit not work as intended."]]]] },
      { h: "The Serial Monitor", f: "Section 2", story: "The Serial Monitor is a text window on your computer where the Arduino prints messages while it runs. Serial.begin(9600) opens the connection in setup(). Serial.print() prints and stays on the same line. Serial.println() prints and then starts a new line.",
        b: [["ard", "serial", {}], ["cards", [["Serial Monitor", "A window that shows text your Arduino sends back to the computer."], ["Serial.print()", "Prints a value and stays on the same line."], ["Serial.println()", "Prints a value, then moves to a new line."]]],
          ["hint", "Pick a different version above, then run loop() a few times. Notice how print and println change where the next value appears."]] },
      { h: "Find the Bug", f: "Practice", story: "Read each program and decide what is wrong before you answer.",
        b: [["predict", { lang: "cpp", code: "void setup() {\n}\nvoid loop() {\n  digitalWrite(9, HIGH);\n}", q: "The LED never turns on. What is missing?", opts: ["A delay()", "pinMode(9, OUTPUT) in setup()", "A comment", "Serial.begin()"], ans: 1, why: "The pin must be set up as an output first." }],
          ["predict", { lang: "cpp", code: "analogWrite(9, 300);", q: "What is wrong?", opts: ["Nothing", "analogWrite only accepts 0 to 255", "9 is not a pin", "It needs a delay"], ans: 1, why: "300 is out of range. Use map() to shrink a larger range." }],
          ["predict", { q: "You print a sensor value with Serial.println() but see nothing. What did you forget?", opts: ["delay()", "Serial.begin(9600) in setup()", "analogWrite()", "A comment"], ans: 1, why: "Without Serial.begin the connection never opens." }]] }
    ],
    quiz: [["What does Serial.println() do?", ["Prints and stays on the line", "Prints and starts a new line", "Deletes text", "Waits"], 1, "ln means new line."], ["Where does Serial.begin(9600) go?", ["loop()", "setup()", "Anywhere", "Nowhere"], 1, "Open the connection once in setup()."], ["The best way to debug is to...", ["Change many things at once", "Change one thing and test", "Rewrite everything", "Give up"], 1, "One change at a time."], ["Why print values?", ["To waste time", "To see what the program actually sees", "To change the wiring", "To save memory"], 1, "Printing reveals the real values."]],
    end: ["Say what should happen. See what does happen.", "The gap between those two is the bug."]
  };

  D["9.6"] = {
    id: "9.6", title: "Intro to Arduino Quiz", lessonFile: fileOf(6, "intro-to-arduino-quiz"), codehs: "CodeHS 3.6", tags: ["Arduino", "Review"],
    deck: "A review of the whole unit: Tinkercad and the board, setup() and loop(), digitalWrite and delay, pseudocode, analogWrite and PWM, analogRead and map, and the Serial Monitor.",
    sections: [
      { h: "The Unit at a Glance", f: "Review", story: "Click each card and say the answer out loud before you flip it.",
        b: [["svg", board(["D13", "D9", "A0", "5V", "GND"]), "Highlighted: pin 13 (built-in LED), pin 9 (PWM), A0 (analog input), and the power pins."],
          ["cards", [["setup() and loop()", "setup() runs once. loop() repeats forever."], ["digitalWrite() and delay()", "Switch a pin HIGH or LOW, and pause in milliseconds."], ["Pseudocode and comments", "Plain-English plan, and notes the computer ignores."], ["analogWrite()", "0 to 255 on a ~ pin. PWM makes it look in between."], ["analogRead() and map()", "0 to 1023 in. map() rescales it for output."], ["Serial Monitor", "Serial.begin(9600) in setup(), then print or println."], ["Breadboard", "Short strips of 5 holes are connected."]]]] },
      { h: "Test Your Recall", f: "Practice", story: "Pair each command with its job, then predict what a few lines do.",
        b: [["match", [["pinMode(9, OUTPUT)", "Prepare pin 9 to send signals"], ["delay(250)", "Wait a quarter second"], ["analogRead(A0)", "Read a value from 0 to 1023"], ["map(v, 0, 1023, 0, 255)", "Rescale a reading"], ["Serial.println(x)", "Print x on its own line"]]],
          ["predict", { lang: "cpp", code: "digitalWrite(13, HIGH);\ndelay(250);\ndigitalWrite(13, LOW);\ndelay(250);", q: "How many times does the LED blink each second?", opts: ["1", "2", "4", "8"], ans: 1, why: "One cycle takes 500 ms, so there are 2 cycles per second." }],
          ["predict", { lang: "cpp", code: "int v = analogRead(A0);          // 1023\nanalogWrite(9, map(v, 0, 1023, 0, 255));", q: "How bright is the LED when the dial is turned all the way up?", opts: ["Off", "Half", "Full", "Blinking"], ans: 2, why: "1023 maps to 255, which is full brightness." }]] }
    ],
    quiz: [["Which runs only once?", ["loop()", "setup()", "delay()", "analogRead()"], 1, "setup() runs once."], ["Which pins can use analogWrite()?", ["Any digital pin", "Only the ~ PWM pins", "Only A0", "Only pin 13"], 1, "PWM pins only."], ["analogRead() returns a value from...", ["0 to 1", "0 to 255", "0 to 1023", "0 to 5"], 2, "A 10-bit value."], ["Which comment style is for Arduino?", ["# note", "// note", "-- note", "<!-- note -->"], 1, "C++ comments use //."], ["Where do you open the Serial Monitor connection?", ["In setup() with Serial.begin(9600)", "In loop()", "In delay()", "It opens itself"], 0, "Serial.begin goes in setup()."]],
    end: ["Input, code, output.", "Program Control with Arduino adds sensors, buttons, and decisions to everything you just learned."]
  };
})();
