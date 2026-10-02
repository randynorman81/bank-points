/* Notes content for Unit 10: Conditionals (CodeHS Unit 4). Rendered by ../notes-engine.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", soft: "#8B9AAE", ink: "#EAEFF6", bg: "#151A24" };
  function fileOf(k, name) { return "10-" + k + "-" + name + ".html"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function fork(q, yes, no, after) {
    var o = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#8B9AAE" stroke-width="1.8"/></marker></defs>';
    o += '<polygon points="280,10 380,60 280,110 180,60" fill="' + C.bg + '" stroke="' + C.amb + '" stroke-width="2.5"/>' + t(280, 66, q, 14, C.ink, "middle");
    o += '<path d="M180 60 H100 V150" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#ar)"/>' + t(138, 52, "True", 12, C.acc, "middle");
    o += '<path d="M380 60 H460 V150" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#ar)"/>' + t(422, 52, "False", 12, C.red, "middle");
    o += '<rect x="20" y="152" width="160" height="50" rx="8" fill="' + C.bg + '" stroke="' + C.acc + '" stroke-width="2"/>' + t(100, 183, yes, 13, C.ink, "middle");
    o += '<rect x="380" y="152" width="160" height="50" rx="8" fill="' + C.bg + '" stroke="' + C.red + '" stroke-width="2"/>' + t(460, 183, no, 13, C.ink, "middle");
    o += '<path d="M100 202 V228 H280 M460 202 V228 H280" fill="none" stroke="#8B9AAE" stroke-width="2"/><rect x="200" y="214" width="160" height="40" rx="8" fill="' + C.bg + '" stroke="#8B9AAE" stroke-width="2"/>' + t(280, 239, after, 13, C.ink, "middle");
    return '<svg viewBox="0 0 560 262" role="img" aria-label="if else flowchart">' + o + "</svg>";
  }

  D["10.1"] = {
    id: "10.1", title: "Booleans", lessonFile: fileOf(1, "booleans"), codehs: "CodeHS 4.1", tags: ["Python", "bool"],
    deck: "The simplest data type: True or False. How booleans represent yes-or-no facts, and how a comparison produces one.",
    sections: [
      { h: "Yes or No, Nothing Else", f: "Section 1", story: "A boolean can only ever be one of two values: True or False. Think of a light switch, or a question like is it raining. Programs use booleans to remember yes-or-no facts and to make decisions.",
        b: [["gfx", "compare", { left: { title: "Question", items: ["Is it raining?", "Is the door locked?", "Is the score above 90?"] }, right: { title: "Boolean value", items: ["is_raining = True", "door_locked = False", "high_score = score > 90"] } }, "Each yes-or-no question becomes a True or False value."],
          ["py", { code: "is_raining = True\nprint(is_raining)\nprint(type(is_raining))", presets: [["A boolean", "is_raining = True\nprint(is_raining)\nprint(type(is_raining))"], ["From a comparison", "score = 95\nhigh_score = score > 90\nprint(high_score)"], ["Capitalization", "print(True)\nprint(true)"]], note: "The last preset is an error on purpose. Python's booleans are capitalized." }],
          ["cards", [["Boolean", "A value that is either True or False."], ["True / False (capitalized in Python)", "These are special words. true and false in lowercase are just unknown names to Python."]]]] },
      { h: "Booleans from Comparisons", f: "Section 2", story: "You rarely type True or False yourself. Most of the time a comparison makes one. 5 > 3 asks a question, and the answer comes back as a boolean you can store or print.",
        b: [["py", { code: "age = 15\nprint(age >= 16)\nprint(age == 15)\ncan_drive = age >= 16\nprint(can_drive)", presets: [["Age checks", "age = 15\nprint(age >= 16)\nprint(age == 15)\ncan_drive = age >= 16\nprint(can_drive)"], ["Text", "name = \"Ada\"\nprint(name == \"Ada\")\nprint(name == \"ada\")"]] }],
          ["predict", { code: "print(7 > 10)", q: "What prints?", opts: ["True", "False", "7", "An error"], ans: 1, why: "7 is not greater than 10, so the answer to the question is False." }],
          ["match", [["True", "The yes answer"], ["False", "The no answer"], ["bool", "The type of True and False"], ["5 < 3", "A comparison that gives False"]]]] }
    ],
    quiz: [["How many values can a boolean have?", ["1", "2", "10", "Unlimited"], 1, "Just True and False."], ["Which is written correctly in Python?", ["true", "TRUE", "True", "\"True\""], 2, "Capital T, no quotes."], ["What does 5 == 5 give?", ["5", "True", "False", "Error"], 1, "They are equal."], ["What type is the value of 4 > 9?", ["int", "str", "bool", "float"], 2, "Comparisons give booleans."]],
    end: ["Everything a program decides comes down to True or False.", "The next lessons are about using that to choose what to do."]
  };

  D["10.2"] = {
    id: "10.2", title: "If Statements", lessonFile: fileOf(2, "if-statements"), codehs: "CodeHS 4.2", tags: ["Python", "if / elif / else"],
    deck: "How if, elif, and else let a program choose between paths, and why Python's indentation is part of the logic.",
    sections: [
      { h: "A Fork in the Road", f: "Section 1", story: "An if statement runs a block of code only when a condition is True. Add else and you get a second path for when it is False. The program picks exactly one way forward, then continues.",
        b: [["svg", fork("age >= 16 ?", "print(\"Can drive\")", "print(\"Too young\")", "program continues"), "A condition sends the program down one of two paths."],
          ["py", { code: "age = int(input(\"Age? \"))\nif age >= 16:\n    print(\"You can drive\")\nelse:\n    print(\"Not yet\")", inputs: "17", note: "Change the age in the box under the code and run again.", presets: [["if / else", "age = int(input(\"Age? \"))\nif age >= 16:\n    print(\"You can drive\")\nelse:\n    print(\"Not yet\")", "17"], ["if only", "score = int(input(\"Score? \"))\nif score > 90:\n    print(\"Great job\")\nprint(\"Done\")", "95"], ["Not triggered", "score = int(input(\"Score? \"))\nif score > 90:\n    print(\"Great job\")\nprint(\"Done\")", "70"]] }],
          ["cards", [["if", "Runs its indented block only when the condition is True."], ["else", "Runs when the if condition was False."], ["Indentation", "In Python, the spaces at the start of a line show which lines belong to the if."]]]] },
      { h: "More Than Two Choices", f: "Section 2", story: "elif means else if. Python checks the conditions from the top and runs the first one that is True, then skips the rest. Order matters.",
        b: [["trace", { code: ["score = 85", "if score >= 90:", "    grade = \"A\"", "elif score >= 80:", "    grade = \"B\"", "else:", "    grade = \"C\"", "print(grade)"], steps: [[0, { score: "85" }, "", "Start with a score of 85."], [1, { score: "85" }, "", "85 >= 90 is False, so skip the A block."], [3, { score: "85" }, "", "85 >= 80 is True, so this branch runs."], [4, { score: "85", grade: "\"B\"" }, "", "grade becomes B. The else is skipped entirely."], [7, { score: "85", grade: "\"B\"" }, "B", "The program continues after the whole chain."]] }],
          ["py", { code: "temp = int(input(\"Temperature? \"))\nif temp >= 85:\n    print(\"Hot\")\nelif temp >= 60:\n    print(\"Nice\")\nelse:\n    print(\"Cold\")", inputs: "72", presets: [["Weather", "temp = int(input(\"Temperature? \"))\nif temp >= 85:\n    print(\"Hot\")\nelif temp >= 60:\n    print(\"Nice\")\nelse:\n    print(\"Cold\")", "72"], ["Wrong order", "score = int(input(\"Score? \"))\nif score >= 60:\n    print(\"Pass\")\nelif score >= 90:\n    print(\"Honors\")", "95"]] }],
          ["hint", "The Wrong order preset prints Pass for 95. The first True condition wins, so put the strictest test first."]] },
      { h: "Indentation Is Part of the Code", f: "Check yourself", story: "A missing indent is one of the most common first errors. The indented lines are the ones that belong to the if.",
        b: [["py", { code: "if 5 > 3:\nprint(\"yes\")", autorun: true, presets: [["Missing indent", "if 5 > 3:\nprint(\"yes\")"], ["Fixed", "if 5 > 3:\n    print(\"yes\")"]] }],
          ["order", { q: "Put these lines in an order that works.", lines: ["if temp > 90:", "    print(\"Stay inside\")", "else:", "    print(\"Go play\")"], why: "The if line comes first, its block is indented, and else lines up with if.", hint: "if, then its indented line, then else, then its indented line." }]] }
    ],
    quiz: [["When does an if block run?", ["Always", "When the condition is True", "When it is False", "Never"], 1, "Only on True."], ["What does else do?", ["Runs when the if condition was False", "Repeats the code", "Ends the program", "Prints text"], 0, "It is the other path."], ["With if score >= 60 first, then elif score >= 90, what does 95 print?", ["The 90 message", "The 60 message", "Both", "Neither"], 1, "The first True condition wins."], ["How does Python know which lines belong to an if?", ["Brackets", "Indentation", "Semicolons", "Capitals"], 1, "Spaces at the start of the line."]],
    end: ["Test, branch, continue.", "Every decision a program makes starts with a condition like these."]
  };

  D["10.3"] = {
    id: "10.3", title: "Comparison Operators", lessonFile: fileOf(3, "comparison-operators"), codehs: "CodeHS 4.3", tags: ["Python", "Comparisons"],
    deck: "The six operators that compare two values and return a boolean, and the common mix-up between = and ==.",
    sections: [
      { h: "Six Ways to Compare", f: "Section 1", story: "Comparison operators ask a question about two values and answer with True or False. Slide x and y and watch all six answers change at once.",
        b: [["table", ["Operator", "Question it asks", "Example"], [["==", "equal to?", "5 == 5 is True"], ["!=", "not equal to?", "5 != 3 is True"], ["<", "less than?", "3 < 5 is True"], ["<=", "less than or equal?", "5 <= 5 is True"], [">", "greater than?", "3 > 5 is False"], [">=", "greater than or equal?", "3 >= 5 is False"]]],
          ["widget", { html: '<svg viewBox="0 0 560 76" id="nl" role="img" aria-label="number line with x and y" style="width:100%;display:block;margin-bottom:8px"></svg><div class="wrow"><label>x = <b id="xv"></b></label><input type="range" id="xs" min="-5" max="10" value="4" style="max-width:260px"></div><div class="wrow"><label>y = <b id="yv"></b></label><input type="range" id="ys" min="-5" max="10" value="7" style="max-width:260px"></div><div class="rgrid" id="res" style="margin-top:12px"></div>', js: function (w) {
            var xs = w.querySelector("#xs"), ys = w.querySelector("#ys"), res = w.querySelector("#res"), nl = w.querySelector("#nl"), ops = [["==", function (a, b) { return a === b; }], ["!=", function (a, b) { return a !== b; }], ["<", function (a, b) { return a < b; }], ["<=", function (a, b) { return a <= b; }], [">", function (a, b) { return a > b; }], [">=", function (a, b) { return a >= b; }]];
            function px(v) { return 20 + (v + 5) * 520 / 15; }
            function up() { var x = +xs.value, y = +ys.value, s = "", k; for (k = -5; k <= 10; k++) s += '<line x1="' + px(k) + '" y1="34" x2="' + px(k) + '" y2="42" stroke="#8B9AAE"/><text x="' + px(k) + '" y2="60" y="58" font-size="10" fill="#8B9AAE" text-anchor="middle">' + k + "</text>"; s += '<line x1="20" y1="38" x2="540" y2="38" stroke="#3A4658" stroke-width="2"/><circle cx="' + px(x) + '" cy="38" r="8" fill="#FDD877"/><text x="' + px(x) + '" y="22" font-size="13" fill="#FDD877" text-anchor="middle">x</text><circle cx="' + px(y) + '" cy="38" r="8" fill="none" stroke="#5FD8DF" stroke-width="3"/><text x="' + px(y) + '" y="12" font-size="13" fill="#5FD8DF" text-anchor="middle">y</text>'; nl.innerHTML = s; w.querySelector("#xv").textContent = x; w.querySelector("#yv").textContent = y; res.innerHTML = ops.map(function (o) { var r = o[1](x, y); return '<div class="mi ' + (r ? "done" : "") + '" style="cursor:default">x ' + o[0] + " y &rarr; <b>" + (r ? "True" : "False") + "</b></div>"; }).join(""); }
            xs.oninput = ys.oninput = up; up(); } }],
          ["cards", [["Comparison operators", "== != < <= > >= compare two values and give a boolean."]]]] },
      { h: "= Versus ==", f: "Section 2", story: "One equals sign stores a value. Two equals signs ask a question. Mixing them up is one of the most common mistakes.",
        b: [["py", { code: "x = 5          # store 5 in x\nprint(x == 5)  # ask: is x equal to 5?\nprint(x == 6)", presets: [["Store vs ask", "x = 5          # store 5 in x\nprint(x == 5)  # ask: is x equal to 5?\nprint(x == 6)"], ["Wrong in an if", "x = 5\nif x = 5:\n    print(\"five\")"], ["Right in an if", "x = 5\nif x == 5:\n    print(\"five\")"]] }],
          ["predict", { code: "age = 16\nprint(age != 16)", q: "What prints?", opts: ["True", "False", "16", "An error"], ans: 1, why: "age is 16, so age is NOT different from 16, and the answer is False." }],
          ["match", [["=", "Store a value"], ["==", "Ask if two values are equal"], ["!=", "Ask if two values are different"], [">=", "Greater than or equal to"]]]] }
    ],
    quiz: [["What does == do?", ["Stores a value", "Compares for equality", "Adds", "Prints"], 1, "== is a question."], ["What does 3 != 4 give?", ["True", "False", "3", "Error"], 0, "They are different."], ["Which is the correct test inside an if?", ["if x = 5:", "if x == 5:", "if x := 5", "if x 5:"], 1, "Use ==."], ["What is 5 >= 5?", ["True", "False", "5", "Error"], 0, "Equal counts."]],
    end: ["= stores. == asks.", "If a condition does not behave, check you used the right one."]
  };

  D["10.4"] = {
    id: "10.4", title: "Logical Operators", lessonFile: fileOf(4, "logical-operators"), codehs: "CodeHS 4.4", tags: ["Python", "and / or / not"],
    deck: "How and, or, and not combine booleans into bigger conditions, with a truth table you can flip yourself.",
    sections: [
      { h: "and, or, not", f: "Section 1", story: "Sometimes one condition is not enough. I go to sleep when I am tired OR it is after 9 pm. I wear flip flops when I am outside AND it is NOT raining. Python has the same three words.",
        b: [["table", ["Operator", "Meaning", "True when..."], [["and", "both must be True", "A and B are both True"], ["or", "at least one is True", "A or B (or both) is True"], ["not", "flips it", "not True is False"]]],
          ["widget", { html: '<div class="chips2" id="vc"></div><svg viewBox="0 0 330 160" id="vn" role="img" aria-label="Venn diagram of A and B" style="width:100%;max-width:420px;display:block;margin:0 auto"></svg><div class="wout" id="vt" style="text-align:center"></div>', js: function (w) {
            var modes = [["A and B", "Both: only the overlap"], ["A or B", "Either: everything in A or B"], ["not A", "Everything outside A"]], cur = 0, box = w.querySelector("#vc"), svg = w.querySelector("#vn"), note = w.querySelector("#vt");
            function draw() {
              var d = '<defs><clipPath id="cpa"><circle cx="130" cy="80" r="60"/></clipPath></defs><rect x="2" y="2" width="326" height="156" rx="8" fill="#10141C" stroke="#3A4658"/>', sh = "";
              if (cur === 0) sh = '<circle cx="200" cy="80" r="60" fill="#FDD877" fill-opacity=".55" clip-path="url(#cpa)"/>'; else if (cur === 1) sh = '<circle cx="130" cy="80" r="60" fill="#FDD877" fill-opacity=".55"/><circle cx="200" cy="80" r="60" fill="#FDD877" fill-opacity=".55"/>'; else sh = '<path fill-rule="evenodd" d="M4 4 H326 V156 H4 Z M70 80 a60 60 0 1 0 120 0 a60 60 0 1 0 -120 0 Z" fill="#FDD877" fill-opacity=".55"/>';
              svg.innerHTML = d + sh + '<circle cx="130" cy="80" r="60" fill="none" stroke="#5FD8DF" stroke-width="3"/><circle cx="200" cy="80" r="60" fill="none" stroke="#FCA5A5" stroke-width="3"/><text x="95" y="84" font-size="16" fill="#EAEFF6" text-anchor="middle">A</text><text x="235" y="84" font-size="16" fill="#EAEFF6" text-anchor="middle">B</text>';
              note.textContent = modes[cur][0] + ": " + modes[cur][1]; [].forEach.call(box.children, function (c, k) { c.classList.toggle("on", k === cur); }); }
            modes.forEach(function (m, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = m[0]; b.onclick = function () { cur = i; draw(); }; box.appendChild(b); }); draw(); } }],
          ["widget", { html: '<div class="wrow"><button class="btn" id="ta" type="button"></button><button class="btn" id="tb" type="button"></button></div><div class="rgrid" id="tr" style="margin-top:12px"></div><div class="small">Click A and B to flip them.</div>', js: function (w) {
            var a = true, b = false, ba = w.querySelector("#ta"), bb = w.querySelector("#tb"), tr = w.querySelector("#tr");
            function up() { ba.textContent = "A = " + (a ? "True" : "False"); bb.textContent = "B = " + (b ? "True" : "False"); ba.classList.toggle("on", a); bb.classList.toggle("on", b); function cell(label, v) { return '<div class="mi ' + (v ? "done" : "") + '" style="cursor:default">' + label + " &rarr; <b>" + (v ? "True" : "False") + "</b></div>"; } tr.innerHTML = cell("A and B", a && b) + cell("A or B", a || b) + cell("not A", !a) + cell("not B", !b); }
            ba.onclick = function () { a = !a; up(); }; bb.onclick = function () { b = !b; up(); }; up(); } }],
          ["cards", [["and", "True only if both sides are True."], ["or", "True if at least one side is True."], ["not", "Reverses a boolean: not True is False."]]]] },
      { h: "Combining Conditions", f: "Section 2", story: "Put the operators inside an if to test more than one thing. not is handy for reading naturally, and parentheses make the order clear.",
        b: [["py", { code: "age = int(input(\"Age? \"))\nhas_ticket = input(\"Ticket (yes/no)? \") == \"yes\"\nif age >= 13 and has_ticket:\n    print(\"Welcome in\")\nelse:\n    print(\"Sorry\")", inputs: "15\nyes", presets: [["and", "age = int(input(\"Age? \"))\nhas_ticket = input(\"Ticket (yes/no)? \") == \"yes\"\nif age >= 13 and has_ticket:\n    print(\"Welcome in\")\nelse:\n    print(\"Sorry\")", "15\nyes"], ["or", "day = input(\"Day? \")\nif day == \"Saturday\" or day == \"Sunday\":\n    print(\"Weekend\")\nelse:\n    print(\"School day\")", "Sunday"], ["not", "raining = input(\"Raining (yes/no)? \") == \"yes\"\nif not raining:\n    print(\"Go outside\")", "no"]] }],
          ["predict", { code: "print(True and False)", q: "What prints?", opts: ["True", "False", "None", "An error"], ans: 1, why: "and needs both sides True, and one side is False." }],
          ["predict", { code: "print(not (3 > 5))", q: "What prints?", opts: ["True", "False", "3", "An error"], ans: 0, why: "3 > 5 is False, and not False is True." }]] }
    ],
    quiz: [["True and False gives...", ["True", "False", "Error", "None"], 1, "and needs both."], ["True or False gives...", ["True", "False", "Error", "None"], 0, "or needs one."], ["not False gives...", ["True", "False", "Error", "0"], 0, "not flips it."], ["Which tests that age is between 13 and 19?", ["age >= 13 or age <= 19", "age >= 13 and age <= 19", "age = 13 and 19", "age > 13 or 19"], 1, "Both parts must be true."]],
    end: ["and needs both. or needs one. not flips.", "Combine them to describe real rules, one condition at a time."]
  };

  D["10.5"] = {
    id: "10.5", title: "Floating Point Numbers and Rounding", lessonFile: fileOf(5, "floating-point-numbers-and-rounding"), codehs: "CodeHS 4.5", tags: ["Python", "float", "round()"],
    deck: "Why decimal numbers sometimes compare in surprising ways, and how round() makes comparisons behave.",
    sections: [
      { h: "Floats Aren't Always Exact", f: "Section 1", story: "Computers store decimals in binary, and some simple decimals like 0.1 can't be stored exactly. Usually the tiny error is invisible. But when you compare two floats with ==, that tiny error can make Python say two obviously equal numbers are different.",
        b: [["py", { code: "print(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)", presets: [["Surprise", "print(0.1 + 0.2)\nprint(0.1 + 0.2 == 0.3)"], ["Fine with ints", "print(1 + 2 == 3)"], ["Another one", "print(1.1 + 2.2)\nprint(1.1 + 2.2 == 3.3)"]] }],
          ["gfx", "compare", { left: { title: "What you expect", items: ["0.1 + 0.2 = 0.3", "0.3 == 0.3 is True"] }, right: { title: "What Python stores", items: ["0.1 + 0.2 = 0.30000000000000004", "so == 0.3 is False"] } }, "Floats are very close, not exact."],
          ["cards", [["Floating point number", "A number with a decimal point, stored approximately."]]]] },
      { h: "round() to the Rescue", f: "Section 2", story: "round(x, n) rounds x to n decimal places. Round both sides before you compare, and the tiny error disappears. round(x) with no second number rounds to a whole number.",
        b: [["py", { code: "x = 0.1 + 0.2\nprint(round(x, 2))\nprint(round(x, 2) == 0.3)\nprint(round(3.7))", presets: [["Fixed comparison", "x = 0.1 + 0.2\nprint(round(x, 2))\nprint(round(x, 2) == 0.3)"], ["Places", "pi = 3.14159265\nprint(round(pi))\nprint(round(pi, 2))\nprint(round(pi, 4))"], ["Money", "price = 19.99\ntax = price * 0.07\nprint(tax)\nprint(round(tax, 2))"]] }],
          ["slider", { label: "decimal places", min: 0, max: 6, step: 1, val: 2, f: function (n) { var v = Math.PI, r = n === 0 ? Math.round(v) : Number(v.toFixed(n)); return "round(3.14159265, " + n + ") &rarr; <b>" + (n === 0 ? r + "" : r) + "</b>"; } }],
          ["predict", { code: "print(round(7.846, 1))", q: "What prints?", opts: ["7.8", "7.9", "8", "7.85"], ans: 0, why: "Keep one decimal place and look at the digit after it. 7.846 has a 4 next, so it rounds down to 7.8." }]] }
    ],
    quiz: [["Why can 0.1 + 0.2 == 0.3 be False?", ["Python is broken", "Floats are stored approximately", "0.3 is too big", "You forgot parentheses"], 1, "A tiny stored error makes them differ."], ["What does round(2.678, 1) give?", ["2.6", "2.7", "3", "2.68"], 1, "One decimal place: 2.7."], ["What does round(4.5) round to?", ["4", "5", "Depends: Python rounds to the nearest even number", "4.5"], 2, "Python rounds halves to the nearest even number, so 4."], ["How do you safely compare two floats?", ["Use ==", "Round both first", "Use =", "Use and"], 1, "Rounding removes the tiny error."]],
    end: ["Floats are close, not exact.", "Round before you compare."]
  };

  D["10.6"] = {
    id: "10.6", title: "Conditionals Quiz", lessonFile: fileOf(6, "conditionals-quiz"), codehs: "CodeHS 4.6", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: booleans, if/elif/else, comparison and logical operators, and rounding floats.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Say each answer out loud before you flip the card.",
        b: [["svg", fork("score >= 60 ?", "print(\"Pass\")", "print(\"Try again\")", "continue"), "Every if statement is a fork like this one."],
          ["cards", [["Booleans", "True or False. Comparisons produce them."], ["if / elif / else", "Run the first branch whose condition is True."], ["Comparison operators", "== != < <= > >= give booleans."], ["Logical operators", "and, or, not combine booleans."], ["Floats", "Not exact. Use round() before comparing."], ["Indentation", "Defines which lines belong to a branch."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict first, then check.",
        b: [["predict", { code: "x = 7\nif x > 5 and x < 10:\n    print(\"in range\")\nelse:\n    print(\"out\")", q: "What prints?", opts: ["in range", "out", "Both", "Error"], ans: 0, why: "7 is greater than 5 and less than 10." }],
          ["predict", { code: "n = 4\nif n % 2 == 0:\n    print(\"even\")\nelif n > 0:\n    print(\"positive\")", q: "What prints?", opts: ["even", "positive", "even and positive", "Nothing"], ans: 0, why: "The first True branch runs and the rest are skipped, even though n is also positive." }],
          ["match", [["==", "equal to"], ["!=", "not equal to"], ["and", "both must be True"], ["or", "at least one True"], ["round(x, 2)", "two decimal places"]]],
          ["py", { code: "temp = 72\nraining = False\nif temp > 60 and not raining:\n    print(\"Go for a run\")\nelse:\n    print(\"Stay in\")", note: "Change temp and raining, then run it." }]] }
    ],
    quiz: [["Which value can a boolean be?", ["Any number", "True or False", "Any text", "None only"], 1, "Two values."], ["What does 3 != 3 give?", ["True", "False", "3", "Error"], 1, "They are equal, so not-equal is False."], ["Which keyword gives the second path of an if?", ["otherwise", "else", "then", "next"], 1, "else."], ["True or False gives...", ["True", "False", "Error", "None"], 0, "or needs one True."], ["Why round floats before comparing?", ["It looks nicer", "Floats are stored approximately", "Python requires it", "It runs faster"], 1, "Tiny errors can break ==."]],
    end: ["That is the whole module.", "Loops come next: the same decisions, repeated."]
  };
})();
