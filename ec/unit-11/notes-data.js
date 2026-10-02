/* Notes content for Unit 11: Looping (CodeHS Unit 5). Rendered by ../notes-engine.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", soft: "#8B9AAE", ink: "#EAEFF6", bg: "#151A24" };
  function fileOf(k, name) { return "11-" + k + "-" + name + ".html"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function loopFlow(cond, body) {
    var o = '<defs><marker id="al" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#8B9AAE" stroke-width="1.8"/></marker></defs>';
    o += '<polygon points="170,10 270,55 170,100 70,55" fill="' + C.bg + '" stroke="' + C.amb + '" stroke-width="2.5"/>' + t(170, 60, cond, 14, C.ink, "middle");
    o += '<path d="M270 55 H350 V145 H250" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#al)"/>' + t(310, 46, "True", 12, C.acc, "middle");
    o += '<rect x="90" y="120" width="160" height="50" rx="8" fill="' + C.bg + '" stroke="' + C.acc + '" stroke-width="2"/>' + t(170, 150, body, 13, C.ink, "middle");
    o += '<path d="M90 145 H20 V55 H68" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#al)"/>';
    o += '<path d="M170 100 V108" stroke="none"/>' + t(390, 22, "False: leave the loop", 12, C.red, "end") + '<path d="M170 10 V0" stroke="none"/>';
    return '<svg viewBox="0 0 560 182" role="img" aria-label="while loop flowchart">' + o + "</svg>";
  }

  D["11.1"] = {
    id: "11.1", title: "While Loops", lessonFile: fileOf(1, "while-loops"), codehs: "CodeHS 5.1", tags: ["Python", "while"],
    deck: "How a while loop repeats code as long as a condition stays True, how to count with one, and how to spot and fix an infinite loop.",
    sections: [
      { h: "Repeat While It's True", f: "Section 1", story: "A while loop checks a condition, runs its block, and then checks again. It keeps going until the condition becomes False. Anything you would otherwise copy and paste many times can go inside one.",
        b: [["svg", loopFlow("count <= 3 ?", "print(count); count += 1"), "Check, run the block, go back and check again. The loop stops only when the check fails."],
          ["trace", { code: ["count = 1", "while count <= 3:", "    print(count)", "    count = count + 1", "print(\"Done\")"], steps: [[0, { count: "1" }, "", "Start counting at 1."], [1, { count: "1" }, "", "1 <= 3 is True, so enter the loop."], [2, { count: "1" }, "1", "Print 1."], [3, { count: "2" }, "", "Add 1 to count."], [1, { count: "2" }, "", "2 <= 3 is True, so loop again."], [2, { count: "2" }, "2", "Print 2."], [3, { count: "3" }, "", "count becomes 3."], [1, { count: "3" }, "", "3 <= 3 is True."], [2, { count: "3" }, "3", "Print 3."], [3, { count: "4" }, "", "count becomes 4."], [1, { count: "4" }, "", "4 <= 3 is False, so the loop ends."], [4, { count: "4" }, "Done", "Execution continues after the loop."]] }],
          ["cards", [["While loop", "Repeats a block of code as long as its condition is True."], ["Loop counter", "A variable that changes each time through the loop so the loop can eventually stop."]]]] },
      { h: "Try Your Own", f: "Try it", story: "Change the starting number or the condition and predict how many times the loop will run before you press Run.",
        b: [["py", { code: "count = 5\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint(\"Liftoff!\")", presets: [["Countdown", "count = 5\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint(\"Liftoff!\")"], ["Add up", "total = 0\nn = 1\nwhile n <= 5:\n    total = total + n\n    n = n + 1\nprint(total)"], ["Doubling", "x = 1\nwhile x < 100:\n    print(x)\n    x = x * 2"]] }],
          ["predict", { code: "n = 10\nwhile n < 5:\n    print(n)", q: "What happens?", opts: ["Prints 10 forever", "Prints nothing", "Prints 10 once", "Error"], ans: 1, why: "The condition is False from the start, so the body never runs." }]] },
      { h: "The Infinite Loop", f: "Section 2", story: "If nothing inside the loop ever makes the condition False, the loop never ends. That is an infinite loop, and it freezes your program. The fix is almost always a counter that never changes.",
        b: [["py", { code: "count = 1\nwhile count <= 3:\n    print(count)", presets: [["Forgot to update", "count = 1\nwhile count <= 3:\n    print(count)"], ["Fixed", "count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1"]], note: "The first preset never updates count. The notes page stops it after too many steps." }],
          ["order", { q: "Put these lines in an order that counts from 1 to 3 and ends.", lines: ["count = 1", "while count <= 3:", "    print(count)", "    count = count + 1"], why: "Set the counter, test it, use it, then change it so the test can eventually fail.", hint: "The counter must exist before the while line." }]] }
    ],
    quiz: [["When does a while loop stop?", ["After 10 times", "When its condition becomes False", "Never", "When it prints"], 1, "The condition is checked every time."], ["What causes an infinite loop?", ["A condition that never becomes False", "Too many lines", "Using print", "Using numbers"], 0, "Nothing changes the condition."], ["How many times does while False: run its body?", ["0", "1", "Forever", "Twice"], 0, "It never starts."], ["What goes inside the loop to make it end?", ["A comment", "Something that changes the counter", "A new loop", "Nothing"], 1, "Update the variable in the condition."]],
    end: ["Check, run, repeat.", "Always ask: what makes this loop stop?"]
  };

  D["11.2"] = {
    id: "11.2", title: "For Loops", lessonFile: fileOf(2, "for-loops"), codehs: "CodeHS 5.2", tags: ["Python", "for / range()"],
    deck: "How for loops repeat a block a set number of times, how i takes its values, and how range(start, stop, step) controls them.",
    sections: [
      { h: "Count With range()", f: "Section 1", story: "A for loop is perfect when you know how many times to repeat. The loop variable, usually called i, takes a new value each time through. range() decides which values.",
        b: [["py", { code: "for i in range(5):\n    print(i)", presets: [["range(5)", "for i in range(5):\n    print(i)"], ["Start and stop", "for i in range(2, 6):\n    print(i)"], ["Step of 3", "for i in range(0, 10, 3):\n    print(i)"], ["Backward", "for i in range(5, 0, -1):\n    print(i)"]] }],
          ["cards", [["For loop", "Repeats a block once for each value in a sequence."], ["i (loop variable)", "A counter that holds the current value on each pass."], ["range(start, stop, step)", "Makes the numbers: start is included, stop is NOT, step is how much to add."]]]] },
      { h: "What Does range() Make?", f: "Try it", story: "Set the start, stop, and step. Watch which numbers the loop visits. Remember that stop is never included.",
        b: [["widget", { html: '<div class="wrow"><label>start <b id="av"></b></label><input type="range" id="as" min="0" max="10" value="2" style="max-width:200px"><label>stop <b id="bv"></b></label><input type="range" id="bs" min="0" max="20" value="10" style="max-width:200px"><label>step <b id="cv"></b></label><input type="range" id="cs" min="1" max="5" value="3" style="max-width:150px"></div><div class="fig" style="margin-top:10px"><svg id="rg" viewBox="0 0 560 90" role="img" aria-label="range values on a number line"></svg></div><div class="wout" id="ro"></div>', js: function (w) {
            var as = w.querySelector("#as"), bs = w.querySelector("#bs"), cs = w.querySelector("#cs"), rg = w.querySelector("#rg"), ro = w.querySelector("#ro");
            function up() { var a = +as.value, b = +bs.value, c = +cs.value, vals = [], s = "", i, x; for (i = a; i < b; i += c) vals.push(i); w.querySelector("#av").textContent = a; w.querySelector("#bv").textContent = b; w.querySelector("#cv").textContent = c;
              s += '<line x1="20" y1="50" x2="540" y2="50" stroke="#3A4658" stroke-width="2"/>'; for (i = 0; i <= 20; i++) { x = 20 + i * 26; s += '<line x1="' + x + '" y1="44" x2="' + x + '" y2="56" stroke="#8B9AAE"/><text x="' + x + '" y="74" font-size="10" fill="#8B9AAE" text-anchor="middle">' + i + "</text>"; }
              vals.forEach(function (v) { s += '<circle cx="' + (20 + v * 26) + '" cy="50" r="9" fill="#FDD877"/>'; }); s += '<path d="M' + (20 + b * 26) + ' 30 V70" stroke="#FCA5A5" stroke-width="2" stroke-dasharray="4 3"/><text x="' + (20 + b * 26) + '" y="24" font-size="11" fill="#FCA5A5" text-anchor="middle">stop (not included)</text>'; rg.innerHTML = s;
              ro.innerHTML = "for i in range(" + a + ", " + b + ", " + c + "):<br>&nbsp;&nbsp;i takes the values: <b>" + (vals.length ? vals.join(", ") : "none (the loop does not run)") + "</b>"; }
            as.oninput = bs.oninput = cs.oninput = up; up(); } }],
          ["predict", { code: "for i in range(1, 4):\n    print(i * 2)", q: "What prints?", opts: ["2 4 6 (each on its own line)", "2 4 6 8", "1 2 3", "0 2 4"], ans: 0, why: "i is 1, 2, 3. Doubling gives 2, 4, 6." }]] },
      { h: "While vs. For", f: "Section 2", story: "Both repeat code. Use for when you know how many times. Use while when you repeat until something happens.",
        b: [["gfx", "compare", { left: { title: "for", items: ["Known number of passes", "for i in range(10):", "The counter is built in"] }, right: { title: "while", items: ["Repeat until a condition fails", "while guess != secret:", "You manage the counter yourself"] } }, "Pick the loop that matches the question you are asking."],
          ["py", { code: "total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)", presets: [["Sum 1 to 5", "total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)"], ["Times table", "for i in range(1, 6):\n    print(\"7 x\", i, \"=\", 7 * i)"], ["Evens", "for i in range(0, 11, 2):\n    print(i)"]] }]] }
    ],
    quiz: [["How many times does for i in range(4): run?", ["3", "4", "5", "Forever"], 1, "i is 0, 1, 2, 3."], ["What is the last value in range(2, 8)?", ["8", "7", "6", "2"], 1, "stop is not included."], ["Which range counts down from 5 to 1?", ["range(5, 0)", "range(5, 0, -1)", "range(1, 5)", "range(5, 1, 1)"], 1, "A negative step counts down."], ["When is a for loop the best choice?", ["When you know how many times to repeat", "Never", "Only with strings", "Only with numbers above 10"], 0, "A known count suits for."]],
    end: ["range(start, stop, step): stop is never included.", "Most off-by-one errors come from forgetting that."]
  };

  D["11.3"] = {
    id: "11.3", title: "Break and Continue", lessonFile: fileOf(3, "break-and-continue"), codehs: "CodeHS 5.3", tags: ["Python", "break / continue"],
    deck: "How break ends a loop early and continue skips to the next pass, and the key difference between the two.",
    sections: [
      { h: "Leave Early or Skip One", f: "Section 1", story: "Sometimes a loop should not run all the way to the end. break exits the loop immediately. continue skips the rest of this pass and jumps back to the top for the next one.",
        b: [["gfx", "compare", { left: { title: "break", items: ["Stops the loop completely", "Code after the loop runs next", "Like leaving the room"] }, right: { title: "continue", items: ["Skips only this pass", "The loop keeps going", "Like skipping one song"] } }, "Same loop, two very different effects."],
          ["cards", [["break", "Immediately exits the loop."], ["continue", "Skips to the next pass of the loop."]]]] },
      { h: "Watch Each Pass", f: "Try it", story: "Numbers 1 to 10 go through the loop. Pick break or continue and a number, and see which passes print.",
        b: [["widget", { html: '<div class="chips2" id="bc"></div><div class="wrow"><label>when i equals <b id="tv"></b></label><input type="range" id="ts" min="1" max="10" value="5" style="max-width:240px"></div><div class="fig" style="margin-top:10px"><svg id="bk" viewBox="0 0 560 90" role="img" aria-label="ten passes of a loop"></svg></div><div class="wout" id="bo"></div>', js: function (w) {
            var mode = "break", box = w.querySelector("#bc"), ts = w.querySelector("#ts");
            ["break", "continue"].forEach(function (m, i) { var b = document.createElement("button"); b.className = "chip" + (i === 0 ? " on" : ""); b.type = "button"; b.textContent = m; b.onclick = function () { mode = m; [].forEach.call(box.children, function (c) { c.classList.toggle("on", c.textContent === m); }); up(); }; box.appendChild(b); });
            function up() { var n = +ts.value, s = "", printed = [], i; w.querySelector("#tv").textContent = n;
              for (i = 1; i <= 10; i++) { var x = 12 + (i - 1) * 54, st = "run", fill = "rgba(95,216,223,.18)", stroke = "#5FD8DF";
                if (mode === "break") { if (i === n) { st = "BREAK"; fill = "rgba(239,68,68,.2)"; stroke = "#EF4444"; } else if (i > n) { st = "never"; fill = "#10141C"; stroke = "#2A3342"; } }
                else if (i === n) { st = "skip"; fill = "rgba(251,191,36,.2)"; stroke = "#FBBF24"; }
                if (st === "run") printed.push(i);
                s += '<rect x="' + x + '" y="12" width="46" height="44" rx="6" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"/><text x="' + (x + 23) + '" y="40" font-size="16" fill="#EAEFF6" text-anchor="middle">' + i + '</text><text x="' + (x + 23) + '" y="76" font-size="10" fill="#8B9AAE" text-anchor="middle">' + st + "</text>"; }
              w.querySelector("#bk").innerHTML = s; w.querySelector("#bo").innerHTML = "for i in range(1, 11):<br>&nbsp;&nbsp;if i == " + n + ": " + mode + "<br>&nbsp;&nbsp;print(i)<br>Prints: <b>" + (printed.length ? printed.join(" ") : "nothing") + "</b>"; }
            ts.oninput = up; up(); } }],
          ["py", { code: "for i in range(1, 11):\n    if i == 5:\n        break\n    print(i)", presets: [["break at 5", "for i in range(1, 11):\n    if i == 5:\n        break\n    print(i)"], ["continue at 5", "for i in range(1, 11):\n    if i == 5:\n        continue\n    print(i)"], ["Skip evens", "for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    print(i)"], ["Stop at a hit", "numbers = [4, 8, 15, 16, 23]\nfor n in numbers:\n    if n > 15:\n        print(\"found\", n)\n        break"]] }]] },
      { h: "Which Do I Need?", f: "Check yourself", story: "Ask: do I want to stop the whole loop, or just skip this one pass?",
        b: [["predict", { code: "for i in range(5):\n    if i == 2:\n        continue\n    print(i)", q: "What prints?", opts: ["0 1", "0 1 3 4", "0 1 2 3 4", "2"], ans: 1, why: "continue skips only i == 2, and the loop carries on." }],
          ["predict", { code: "for i in range(5):\n    if i == 2:\n        break\n    print(i)", q: "What prints?", opts: ["0 1", "0 1 3 4", "0 1 2", "2"], ans: 0, why: "break ends the loop at i == 2, so only 0 and 1 are printed." }]] }
    ],
    quiz: [["What does break do?", ["Skips one pass", "Exits the loop", "Restarts the program", "Prints"], 1, "It ends the loop completely."], ["What does continue do?", ["Exits the loop", "Skips to the next pass", "Ends the program", "Does nothing"], 1, "It jumps to the next iteration."], ["In range(5), continue when i == 2 prints...", ["0 1", "0 1 3 4", "0 1 2 3 4", "2"], 1, "Only i == 2 is skipped."], ["Where do break and continue live?", ["Only in loops", "Only in functions", "Anywhere", "Only in if statements"], 0, "They belong inside loops."]],
    end: ["break leaves. continue skips.", "Use them sparingly, and prefer a clear loop condition when you can."]
  };

  D["11.4"] = {
    id: "11.4", title: "Nested Control Structures", lessonFile: fileOf(4, "nested-control-structures"), codehs: "CodeHS 5.4", tags: ["Python", "Nested loops"],
    deck: "Putting loops inside loops and if statements inside loops, and how to trace what a nested loop does one pass at a time.",
    sections: [
      { h: "A Loop Inside a Loop", f: "Section 1", story: "You can place any control structure inside another. A for loop inside a for loop runs the inner loop completely for every single pass of the outer loop. Think of rows and columns: each row has all of its columns.",
        b: [["widget", { html: '<div class="wrow"><label>outer i <b id="iv"></b></label><input type="range" id="is" min="0" max="2" value="1" style="max-width:120px"><label>inner j <b id="jv"></b></label><input type="range" id="js" min="0" max="3" value="2" style="max-width:150px"></div><div class="fig" style="margin-top:10px"><svg id="ng" viewBox="0 0 400 190" role="img" aria-label="3 rows by 4 columns grid"></svg></div><div class="wout" id="no"></div>', js: function (w) {
            var is = w.querySelector("#is"), js = w.querySelector("#js"), ng = w.querySelector("#ng");
            function up() { var ci = +is.value, cj = +js.value, s = "", r, c; w.querySelector("#iv").textContent = ci; w.querySelector("#jv").textContent = cj;
              for (r = 0; r < 3; r++) for (c = 0; c < 4; c++) { var done = r < ci || (r === ci && c < cj), cur = r === ci && c === cj; s += '<rect x="' + (20 + c * 90) + '" y="' + (12 + r * 58) + '" width="80" height="48" rx="6" fill="' + (cur ? "rgba(251,191,36,.3)" : done ? "rgba(95,216,223,.18)" : "#10141C") + '" stroke="' + (cur ? "#FBBF24" : done ? "#5FD8DF" : "#2A3342") + '" stroke-width="2"/><text x="' + (60 + c * 90) + '" y="' + (42 + r * 58) + '" font-size="16" fill="#EAEFF6" text-anchor="middle">(' + r + "," + c + ")</text>"; }
              ng.innerHTML = s; w.querySelector("#no").innerHTML = "for i in range(3):<br>&nbsp;&nbsp;for j in range(4):<br>&nbsp;&nbsp;&nbsp;&nbsp;print(i, j)<br>The highlighted pass is <b>i = " + ci + ", j = " + cj + "</b>. The inner loop finishes all 4 values of j before i moves on."; }
            is.oninput = js.oninput = up; up(); } }],
          ["cards", [["Nested control structures", "Loops or if statements placed inside other loops or if statements."]]]] },
      { h: "Patterns with Nested Loops", f: "Try it", story: "Nested loops are great for tables and shapes. Run each preset, then change the numbers.",
        b: [["py", { code: "for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j, end=\" \")\n    print()", presets: [["Multiplication table", "for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j, end=\" \")\n    print()"], ["Triangle", "for i in range(1, 6):\n    print(\"*\" * i)"], ["Triangle (nested)", "for i in range(1, 6):\n    for j in range(i):\n        print(\"*\", end=\"\")\n    print()"], ["Pairs", "for color in [\"red\", \"blue\"]:\n    for size in [\"S\", \"L\"]:\n        print(color, size)"]] }],
          ["predict", { code: "count = 0\nfor i in range(3):\n    for j in range(4):\n        count = count + 1\nprint(count)", q: "What prints?", opts: ["7", "12", "3", "4"], ans: 1, why: "The inner loop runs 4 times for each of the 3 outer passes: 3 times 4 is 12." }]] },
      { h: "If Inside a Loop", f: "Section 2", story: "An if inside a loop lets you treat each pass differently. This is how programs filter and count.",
        b: [["py", { code: "evens = 0\nfor n in range(1, 11):\n    if n % 2 == 0:\n        evens = evens + 1\nprint(evens)", presets: [["Count evens", "evens = 0\nfor n in range(1, 11):\n    if n % 2 == 0:\n        evens = evens + 1\nprint(evens)"], ["FizzBuzz", "for n in range(1, 16):\n    if n % 15 == 0:\n        print(\"FizzBuzz\")\n    elif n % 3 == 0:\n        print(\"Fizz\")\n    elif n % 5 == 0:\n        print(\"Buzz\")\n    else:\n        print(n)"]] }]] }
    ],
    quiz: [["How many times does the inner loop body run in for i in range(2): for j in range(5):?", ["5", "7", "10", "2"], 2, "2 times 5."], ["The inner loop runs...", ["Once total", "Completely for each pass of the outer loop", "Only the first time", "Never"], 1, "It restarts every outer pass."], ["What does print(\"*\" * 3) show?", ["***", "* * *", "3", "Error"], 0, "A string times 3."], ["Which structure lets each pass of a loop do something different?", ["An if inside the loop", "Another print", "A comment", "A variable"], 0, "A condition decides per pass."]],
    end: ["Rows and columns. Passes and decisions.", "Nested structures let a few lines do a surprising amount of work."]
  };

  D["11.5"] = {
    id: "11.5", title: "Looping Quiz", lessonFile: fileOf(5, "looping-quiz"), codehs: "CodeHS 5.5", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: while and for loops, range(), break and continue, and nested control structures.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Flip each card and say the answer before you check.",
        b: [["svg", loopFlow("keep going?", "run the body"), "Every loop is a check, a body, and a way back."],
          ["cards", [["while", "Repeat while a condition is True. Make sure something changes it."], ["for / range()", "range(start, stop, step): stop is not included."], ["Infinite loop", "A loop whose condition never becomes False."], ["break", "Exit the loop now."], ["continue", "Skip to the next pass."], ["Nested loops", "The inner loop finishes for every outer pass."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict each result before you run it.",
        b: [["predict", { code: "total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)", q: "What prints?", opts: ["10", "15", "4", "5"], ans: 0, why: "1 + 2 + 3 + 4 is 10. range(1, 5) stops before 5." }],
          ["predict", { code: "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1", q: "What prints?", opts: ["3 2 1", "3 2 1 0", "0 1 2", "Nothing"], ans: 0, why: "It stops as soon as n is no longer greater than 0." }],
          ["match", [["break", "Leave the loop"], ["continue", "Skip one pass"], ["range(3)", "0, 1, 2"], ["while True", "Needs a break to end"], ["Nested loop", "Inner runs fully each outer pass"]]],
          ["py", { code: "for i in range(1, 4):\n    for j in range(i):\n        print(i, j)", note: "Run it, then predict what changes if you change the outer range." }]] }
    ],
    quiz: [["Which loop is best when you know the number of repeats?", ["for", "while", "if", "else"], 0, "for with range()."], ["range(3, 7) gives...", ["3 4 5 6 7", "3 4 5 6", "4 5 6 7", "3 7"], 1, "stop is excluded."], ["What does continue do?", ["Ends the loop", "Skips to the next pass", "Restarts the program", "Prints"], 1, "Skips the rest of this pass."], ["What makes a while loop infinite?", ["Nothing changes its condition", "Using print", "Using range", "A comment"], 0, "The condition never becomes False."], ["How many prints: for i in range(3): for j in range(2): print(i, j)?", ["3", "5", "6", "2"], 2, "3 times 2."]],
    end: ["That is the whole module.", "Next up: functions, which let you name a chunk of code and reuse it."]
  };
})();
