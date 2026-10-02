/* Notes content for Unit 13: Sensors, Program Control with Arduino (CodeHS Unit 7). Rendered by ../notes-engine.js and ../notes-arduino.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", soft: "#8B9AAE", ink: "#EAEFF6", bg: "#151A24" };
  function fileOf(k, name) { return "13-" + k + "-" + name + ".html"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function wiring(rows) {
    var o = "", n = rows.length;
    rows.forEach(function (r, i) { var y = 14 + i * 40; o += '<rect x="10" y="' + y + '" width="190" height="30" rx="5" fill="' + C.bg + '" stroke="' + C.acc + '" stroke-width="1.5"/>' + t(105, y + 20, r[0], 13, C.ink, "middle") + '<line x1="200" y1="' + (y + 15) + '" x2="360" y2="' + (y + 15) + '" stroke="' + r[2] + '" stroke-width="3"/><rect x="360" y="' + y + '" width="190" height="30" rx="5" fill="' + C.bg + '" stroke="' + C.amb + '" stroke-width="1.5"/>' + t(455, y + 20, r[1], 13, C.ink, "middle"); });
    return '<svg viewBox="0 0 560 ' + (n * 40 + 20) + '" role="img" aria-label="wiring connections">' + o + "</svg>";
  }

  D["13.1"] = {
    id: "13.1", title: "Loops (Servo)", lessonFile: fileOf(1, "loops-servo"), codehs: "CodeHS 7.1", tags: ["Arduino", "Servo", "for / while"],
    deck: "Using a for loop to sweep a servo through angles, what the Servo library gives you, and how write() points the horn.",
    sections: [
      { h: "A Motor That Points", f: "Section 1", story: "A servo is a small motor that can turn its horn to a specific angle from 0 to 180 degrees and hold it there. That makes it perfect for steering, robot arms, and gauges. You do not write the pulse timing yourself. The Servo library does that, and you just call write(angle).",
        b: [["svg", wiring([["Servo signal (orange)", "Arduino pin 9", "#FDD877"], ["Servo power (red)", "Arduino 5V", "#EF4444"], ["Servo ground (brown)", "Arduino GND", "#8B9AAE"]]), "A servo needs three connections: signal, power, and ground."],
          ["cards", [["Servo library", "Code that comes with Arduino that handles the servo's timing for you."], ["#include <Servo.h>", "Loads a library so you can use its commands."], ["attach()", "Tells the Servo object which pin the servo's signal wire is on."], ["write(angle)", "Moves the servo horn to an angle from 0 to 180."]]],
          ["ard", "servo", {}]] },
      { h: "Sweeping with a for Loop", f: "Section 2", story: "Typing write(0), write(30), write(60) over and over is tedious. A for loop changes the angle for you. The loop variable angle starts at 0 and grows by the step each pass until it passes 180.",
        b: [["trace", { lang: "cpp", code: ["for (int angle = 0; angle <= 120; angle += 60) {", "  myServo.write(angle);", "  delay(500);", "}"], steps: [[0, { angle: "0" }, "", "Start with angle = 0."], [1, { angle: "0" }, "write(0)", "Move the horn to 0 degrees."], [2, { angle: "0" }, "", "Wait half a second."], [0, { angle: "60" }, "", "Add the step: angle becomes 60. 60 <= 120 is true."], [1, { angle: "60" }, "write(60)", "Move to 60."], [2, { angle: "60" }, "", "Wait."], [0, { angle: "120" }, "", "angle becomes 120. 120 <= 120 is still true."], [1, { angle: "120" }, "write(120)", "Move to 120."], [2, { angle: "120" }, "", "Wait."], [0, { angle: "180" }, "", "angle becomes 180. 180 <= 120 is false, so the loop ends."]] }],
          ["predict", { lang: "cpp", code: "for (int angle = 0; angle <= 90; angle += 30) {\n  myServo.write(angle);\n}", q: "How many times does write() run?", opts: ["3", "4", "90", "30"], ans: 1, why: "angle is 0, 30, 60, and 90. That is four passes." }]] },
      { h: "Back and Forth", f: "Section 3", story: "To sweep back, add a second loop that counts down. Put both inside loop() and the servo will sweep forever.",
        b: [["code", "cpp", "void loop() {\n  for (int angle = 0; angle <= 180; angle += 10) {\n    myServo.write(angle);   // sweep up\n    delay(30);\n  }\n  for (int angle = 180; angle >= 0; angle -= 10) {\n    myServo.write(angle);   // sweep back\n    delay(30);\n  }\n}"],
          ["order", { q: "Put the servo setup in a working order.", lines: ["#include <Servo.h>", "Servo myServo;", "void setup() { myServo.attach(9); }", "void loop() { myServo.write(90); }"], why: "Include the library, create the Servo object, attach it in setup(), then use it in loop().", hint: "A library must be included before you use its commands." }],
          ["hint", "While loops work too. Use one when the stopping point depends on something other than a count, like a button press."]] }
    ],
    quiz: [["What angles can a servo move to?", ["0 to 10", "0 to 180", "0 to 1023", "Any number"], 1, "0 to 180 degrees."], ["What does #include <Servo.h> do?", ["Draws a servo", "Loads the Servo library", "Moves the servo", "Defines a pin"], 1, "It makes the library's commands available."], ["What does attach(9) do?", ["Writes 9 degrees", "Tells the Servo object which pin to use", "Waits 9 ms", "Reads pin 9"], 1, "It links the object to pin 9."], ["Which loop sweeps from 180 down to 0?", ["for (a = 180; a >= 0; a -= 10)", "for (a = 0; a <= 180; a += 10)", "while (a > 180)", "if (a < 0)"], 0, "Start high, count down."]],
    end: ["Libraries do the hard timing work.", "You choose the angle and the loop decides how it changes."]
  };

  D["13.2"] = {
    id: "13.2", title: "If/Else Statements (Buttons)", lessonFile: fileOf(2, "if-else-statements-buttons"), codehs: "CodeHS 7.2", tags: ["Arduino", "digitalRead", "if / else"],
    deck: "How a pushbutton gives your program input, how digitalRead() sees it, and how if/else turns that into an action.",
    sections: [
      { h: "Reading a Button", f: "Section 1", story: "A button is an input. digitalRead() asks a pin whether it is HIGH or LOW. With INPUT_PULLUP the pin is held HIGH by a built-in resistor, and pressing the button connects it to GND, which makes it read LOW. That sounds backwards, but it saves you from adding a resistor.",
        b: [["svg", wiring([["Button, one side", "Arduino pin 2", "#FDD877"], ["Button, other side", "Arduino GND", "#8B9AAE"]]), "With INPUT_PULLUP the button connects the pin to ground when pressed."],
          ["ard", "button", {}],
          ["cards", [["digitalRead()", "Returns HIGH or LOW for a digital pin."], ["INPUT_PULLUP", "A pin mode that holds the pin HIGH until something pulls it LOW."]]]] },
      { h: "if and else", f: "Section 2", story: "Now the button can make decisions. if checks a condition and runs one block, else runs the other. Notice the double equals sign: it asks a question. A single equals sign would store a value.",
        b: [["predict", { lang: "cpp", code: "int state = digitalRead(2);\nif (state == LOW) {\n  digitalWrite(13, HIGH);\n} else {\n  digitalWrite(13, LOW);\n}", q: "The button is NOT pressed (INPUT_PULLUP). What does the LED do?", opts: ["On", "Off", "Blinks", "It depends on the delay"], ans: 1, why: "Not pressed means the pin reads HIGH, so the else branch runs and the LED turns off." }],
          ["predict", { lang: "cpp", code: "if (digitalRead(2) = LOW) {", q: "What is wrong with this line?", opts: ["Nothing", "It uses = instead of ==", "pin 2 is invalid", "It needs a delay"], ans: 1, why: "One equals sign assigns. Use == to compare." }],
          ["match", [["HIGH", "Pin at 5 V (button not pressed with INPUT_PULLUP)"], ["LOW", "Pin at 0 V (button pressed with INPUT_PULLUP)"], ["==", "Compares two values"], ["else", "Runs when the if was false"]]]] }
    ],
    quiz: [["What does digitalRead() return?", ["A number 0 to 1023", "HIGH or LOW", "A letter", "An angle"], 1, "A digital state."], ["With INPUT_PULLUP, a pressed button reads...", ["HIGH", "LOW", "Nothing", "1023"], 1, "Pressing connects the pin to ground."], ["Which tests if state equals LOW?", ["state = LOW", "state == LOW", "state := LOW", "state LOW"], 1, "== compares."], ["What does else do?", ["Runs when the if condition is false", "Repeats the code", "Reads the pin", "Waits"], 0, "It is the other branch."]],
    end: ["A button is a question the user answers.", "digitalRead() hears the answer. if/else acts on it."]
  };

  D["13.3"] = {
    id: "13.3", title: "Arithmetic, Comparison, and Logical Operators (Ultrasonic Sensor)", lessonFile: fileOf(3, "arithmetic-comparison-and-logical-operators-ultrasonic-sensor"), codehs: "CodeHS 7.3", tags: ["Arduino", "Ultrasonic", "Operators"],
    deck: "How an ultrasonic range finder measures distance with sound, the arithmetic that turns a time into centimeters, and the comparison and logical operators that turn a distance into a decision.",
    sections: [
      { h: "Measuring With Sound", f: "Section 1", story: "A sensor lets the Arduino notice the world. An ultrasonic range finder sends out a pulse of sound too high to hear and times how long the echo takes to come back. Sound travels at a known speed, so time converts into distance.",
        b: [["svg", wiring([["Sensor VCC", "Arduino 5V", "#EF4444"], ["Sensor GND", "Arduino GND", "#8B9AAE"], ["Trig pin", "Arduino pin 7", "#FDD877"], ["Echo pin", "Arduino pin 6", "#5FD8DF"]]), "The trig pin sends the pulse. The echo pin reports how long it took to return."],
          ["ard", "ultra", {}],
          ["cards", [["Sensor", "A part that measures something in the world and gives your program a number."], ["pulseIn()", "Measures how long a pin stays HIGH, in microseconds."], ["Arithmetic operators", "+ - * / % to calculate with values. Dividing the echo time by 58 gives centimeters."]]]] },
      { h: "Comparison and Logic", f: "Section 2", story: "A distance by itself does nothing. A comparison turns it into a yes or no, and logical operators combine several yes or no answers. && means AND, || means OR, and ! means NOT.",
        b: [["table", ["Operator", "Meaning", "Example"], [["<  >  <=  >=", "Compare sizes", "distance < 30"], ["==  !=", "Equal / not equal", "state == LOW"], ["&&", "Both must be true", "distance > 10 && distance < 50"], ["||", "At least one is true", "distance < 5 || buttonPressed"], ["!", "Reverse true and false", "!buttonPressed"]]],
          ["code", "cpp", "if (distance < 30 && !alarmSilenced) {\n  digitalWrite(8, HIGH);   // buzzer on\n} else {\n  digitalWrite(8, LOW);\n}"],
          ["predict", { lang: "cpp", code: "int distance = 45;\nif (distance > 20 && distance < 50) {\n  // zone A\n}", q: "Does zone A run?", opts: ["Yes", "No", "Only if distance is 20", "It depends on pulseIn"], ans: 0, why: "45 is greater than 20 and less than 50, so both parts are true." }],
          ["predict", { lang: "cpp", code: "int duration = 1160;\nint distance = duration / 58;", q: "What is distance?", opts: ["10", "20", "58", "1160"], ans: 1, why: "1160 divided by 58 is exactly 20 centimeters." }]] }
    ],
    quiz: [["How does an ultrasonic sensor measure distance?", ["With light", "By timing an echo of sound", "With heat", "By touch"], 1, "It times a sound pulse's echo."], ["What does && mean?", ["OR", "AND", "NOT", "Equals"], 1, "Both sides must be true."], ["What does duration / 58 estimate?", ["Volts", "Distance in centimeters", "Speed", "Temperature"], 1, "Echo time in microseconds divided by 58 gives centimeters."], ["Which means \"closer than 30 cm\"?", ["distance > 30", "distance < 30", "distance == 30", "distance != 30"], 1, "Smaller than 30."]],
    end: ["Sense, calculate, decide.", "Every sensor project follows those three steps."]
  };

  D["13.4"] = {
    id: "13.4", title: "Functions (More Sensors)", lessonFile: fileOf(4, "functions-more-sensors"), codehs: "CodeHS 7.4", tags: ["Arduino", "Functions", "Sensors"],
    deck: "How to wrap a sensor reading in a function, functions with and without parameters, and how a temperature sensor's voltage becomes degrees.",
    sections: [
      { h: "Name What You Read", f: "Section 1", story: "A sketch with several sensors gets messy fast. Put each job in its own function. A function can take parameters to adapt, and it can return a value so loop() stays short and readable.",
        b: [["code", "cpp", "float readTemperatureC() {\n  int reading = analogRead(A0);\n  float voltage = reading * 5.0 / 1024;\n  return (voltage - 0.5) * 100;\n}\n\nvoid showAlert(int pin, int times) {\n  for (int i = 0; i < times; i++) {\n    digitalWrite(pin, HIGH);\n    delay(200);\n    digitalWrite(pin, LOW);\n    delay(200);\n  }\n}\n\nvoid loop() {\n  if (readTemperatureC() > 30) {\n    showAlert(13, 3);\n  }\n}"],
          ["gfx", "compare", { left: { title: "With a parameter", items: ["showAlert(13, 3)", "Pin and count change per call", "One function, many uses"] }, right: { title: "Without", items: ["readTemperatureC()", "Always does the same job", "Returns a value to the caller"] } }, "Parameters adapt a function. A return value hands a result back."],
          ["cards", [["Function with a parameter", "Takes a value when called, like showAlert(13, 3)."], ["Function without a parameter", "Does the same thing every time, like readTemperatureC()."], ["Return value", "The result a function gives back, declared by its type, like float."]]]] },
      { h: "A Temperature Sensor", f: "Try it", story: "A temperature sensor outputs a voltage that changes with heat. analogRead() turns that voltage into a number from 0 to 1023, and your function turns that number into degrees. Slide the reading and watch each step of the conversion.",
        b: [["ard", "temp", {}],
          ["predict", { lang: "cpp", code: "float readTemperatureC() { ... }\nif (readTemperatureC() > 30) {\n  showAlert(13, 3);\n}", q: "How many times does the LED on pin 13 blink when the temperature is 35 C?", opts: ["0", "3", "35", "30"], ans: 1, why: "35 is greater than 30, so showAlert(13, 3) runs and blinks 3 times." }],
          ["hint", "Notice how short loop() stays. The details live in functions with names that say what they do."]] }
    ],
    quiz: [["Why put sensor code in a function?", ["It is faster", "It is cleaner and reusable", "It is required", "It uses less power"], 1, "Names and reuse."], ["What does a function's return type float mean?", ["It prints a float", "It gives back a decimal number", "It takes a float", "It floats"], 1, "float is the type of the returned value."], ["In showAlert(13, 3), what are 13 and 3?", ["Return values", "Arguments", "Libraries", "Comments"], 1, "Values passed in."], ["analogRead() returns a value from...", ["0 to 1", "0 to 255", "0 to 1023", "0 to 5"], 2, "A 10-bit reading."]],
    end: ["Small functions, clear names.", "A good loop() reads like a short list of what the project does."]
  };

  D["13.5"] = {
    id: "13.5", title: "Using Motors", lessonFile: fileOf(5, "using-motors"), codehs: "CodeHS 7.5", tags: ["Arduino", "Motors", "PWM"],
    deck: "Why a motor needs a motor controller instead of a direct pin connection, how two direction pins pick forward or reverse, and how PWM sets the speed.",
    sections: [
      { h: "Why a Motor Controller?", f: "Section 1", story: "A motor needs far more current than an Arduino pin can supply, and it needs to spin both ways. A motor controller (an H-bridge) sits between them. Your Arduino sends small control signals, and the controller switches the larger current.",
        b: [["gfx", "flow", { steps: ["Arduino pins|small signals", "Motor controller|handles the current", "DC motor|spins either way"], perRow: 3, colors: ["#5FD8DF", "#FDD877", "#34D399"] }, "The controller is the muscle. The Arduino is the brain."],
          ["cards", [["Motor controller", "A circuit that lets small Arduino signals drive a larger motor, in either direction."], ["Direction pins", "Two pins that decide which way current flows through the motor."], ["Enable (speed) pin", "A PWM pin that sets how much power the motor gets."]]]] },
      { h: "Direction and Speed", f: "Try it", story: "One direction pin HIGH and the other LOW makes the motor spin. Swap them and it spins the other way. analogWrite() on the enable pin sets the speed. Try each combination.",
        b: [["ard", "motor", {}],
          ["code", "cpp", "void forward(int speed) {\n  digitalWrite(in1, HIGH);\n  digitalWrite(in2, LOW);\n  analogWrite(enablePin, speed);\n}\n\nvoid reverse(int speed) {\n  digitalWrite(in1, LOW);\n  digitalWrite(in2, HIGH);\n  analogWrite(enablePin, speed);\n}\n\nvoid stopMotor() {\n  digitalWrite(in1, LOW);\n  digitalWrite(in2, LOW);\n}"],
          ["predict", { q: "in1 is LOW and in2 is HIGH. What does the motor do?", opts: ["Spins forward", "Spins in reverse", "Stops", "Speeds up"], ans: 1, why: "Opposite of the forward setting, so the current flows the other way." }],
          ["predict", { lang: "cpp", code: "analogWrite(enablePin, 0);", q: "What happens to the motor?", opts: ["Full speed", "Half speed", "It stops", "It reverses"], ans: 2, why: "A value of 0 means no power." }]] }
    ],
    quiz: [["Why use a motor controller?", ["Motors need more current than a pin can give", "It is cheaper", "It makes the motor quieter", "It is required for LEDs"], 0, "Pins can't power motors directly."], ["What do the two direction pins decide?", ["Speed", "Direction of spin", "Color", "Voltage"], 1, "Which way the motor turns."], ["What sets the motor's speed?", ["The delay", "analogWrite() on the enable pin", "digitalRead()", "map()"], 1, "PWM controls speed."], ["Both direction pins LOW means...", ["Forward", "Reverse", "Stopped", "Full speed"], 2, "No current flows."]],
    end: ["Direction from two pins. Speed from PWM.", "Combine them and a robot can drive, turn, and stop."]
  };

  D["13.6"] = {
    id: "13.6", title: "Program Control with Arduino Quiz", lessonFile: fileOf(6, "program-control-with-arduino-quiz"), codehs: "CodeHS 7.6", tags: ["Arduino", "Review"],
    deck: "A review of the whole unit: servo loops, buttons with digitalRead, the ultrasonic sensor and its operators, functions with sensors, and motors.",
    sections: [
      { h: "The Unit at a Glance", f: "Review", story: "Say each answer out loud before you flip the card.",
        b: [["svg", wiring([["Servo signal", "Pin 9 (PWM)", "#FDD877"], ["Button", "Pin 2 + GND", "#8B9AAE"], ["Ultrasonic trig / echo", "Pins 7 and 6", "#5FD8DF"], ["Motor controller", "Direction pins + PWM enable", "#34D399"]]), "A typical project wires several parts at once. Keep a table like this while you build."],
          ["cards", [["Servo", "#include <Servo.h>, attach(pin), write(angle 0 to 180)."], ["Button", "pinMode(2, INPUT_PULLUP), then digitalRead(2) == LOW when pressed."], ["Ultrasonic", "pulseIn() gives microseconds. Divide by 58 for centimeters."], ["Operators", "&& and, || or, ! not, plus < > <= >= == !=."], ["Functions", "Wrap each job: sensors return values, actions take parameters."], ["Motor", "Two direction pins and a PWM enable pin."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict each result first.",
        b: [["predict", { lang: "cpp", code: "if (distance < 20 || buttonPressed) {\n  stopMotor();\n}", q: "The distance is 100 cm and the button IS pressed. Does the motor stop?", opts: ["Yes", "No", "Only if distance < 20", "It depends on delay"], ans: 0, why: "|| needs only one side true, and buttonPressed is true." }],
          ["predict", { lang: "cpp", code: "for (int a = 0; a <= 180; a += 45) { myServo.write(a); }", q: "How many positions does the servo visit?", opts: ["4", "5", "180", "45"], ans: 1, why: "0, 45, 90, 135, 180." }],
          ["match", [["INPUT_PULLUP", "Pin held HIGH until pulled LOW"], ["pulseIn()", "Time a pin stays HIGH"], ["attach()", "Link a Servo object to a pin"], ["analogWrite()", "PWM level 0 to 255"], ["&&", "Both conditions true"]]]] }
    ],
    quiz: [["Which command moves a servo?", ["digitalWrite", "write", "analogRead", "pulseIn"], 1, "myServo.write(angle)."], ["A button wired with INPUT_PULLUP reads LOW when...", ["Pressed", "Released", "Never", "The LED is on"], 0, "Pressed connects to ground."], ["What converts echo time into centimeters?", ["Dividing by 58", "Multiplying by 58", "Adding 58", "map(58)"], 0, "duration / 58."], ["What does a motor controller allow?", ["Powering a motor and reversing it from small pin signals", "Faster code", "Servo sweeping", "Reading buttons"], 0, "It handles the current."], ["Which loop sweeps a servo through angles?", ["for", "else", "include", "attach"], 0, "A for loop changes the angle."]],
    end: ["Sense, decide, act.", "Advanced Arduino combines everything in this unit into larger projects."]
  };
})();
