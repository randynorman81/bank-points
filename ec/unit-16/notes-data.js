/* Notes content for Unit 16: Extending Data Structures (CodeHS Unit 10). Rendered by ../notes-engine.js and ../minipy.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  function fileOf(k, name) { return "16-" + k + "-" + name + ".html"; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  D["16.1"] = {
    id: "16.1", title: "2D Lists", lessonFile: fileOf(1, "2d-lists"), codehs: "CodeHS 10.1", tags: ["Python", "Lists of lists"],
    deck: "How a list can hold other lists to make rows and columns, how to reach one cell with two indexes, and how to loop over a whole grid.",
    sections: [
      { h: "A List of Lists", f: "Section 1", story: "A list can hold anything, including other lists. A list of lists is a table: each inner list is a row, and the position inside it is the column. This is how programs store game boards, spreadsheets, and images.",
        b: [["widget", { html: '<div class="wrow"><label>row <b id="rv"></b></label><input type="range" id="rs" min="0" max="2" value="1" style="max-width:150px"><label>column <b id="cv"></b></label><input type="range" id="cs" min="0" max="3" value="2" style="max-width:150px"></div><div class="fig" id="fg" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var grid = [["1", "2", "3", "4"], ["5", "6", "7", "8"], ["9", "10", "11", "12"]], rs = w.querySelector("#rs"), cs = w.querySelector("#cs");
          function up() { var r = +rs.value, c = +cs.value; w.querySelector("#rv").textContent = r; w.querySelector("#cv").textContent = c; w.querySelector("#fg").innerHTML = window.__notesGfx.grid({ rows: grid, hi: [[r, c]], label: "3 by 4 grid" }); w.querySelector("#io").innerHTML = "grid[" + r + "][" + c + "] = <b>" + grid[r][c] + "</b><br>grid[" + r + "] is the whole row: " + esc(JSON.stringify(grid[r].map(Number))).replace(/,/g, ", "); }
          rs.oninput = cs.oninput = up; up(); } }],
          ["cards", [["2D list", "A list whose items are lists, forming rows and columns."], ["grid[row][col]", "Two indexes: first picks the row, then the column inside it."]]]] },
      { h: "Using a Grid in Code", f: "Section 2", story: "grid[1] is a whole row (a list). grid[1][2] is one cell. To visit every cell, nest two loops: the outer loop walks the rows, the inner loop walks the columns.",
        b: [["py", { code: "grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(grid[1])\nprint(grid[1][2])\nfor row in grid:\n    print(row)", presets: [["Index a cell", "grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(grid[1])\nprint(grid[1][2])\nfor row in grid:\n    print(row)"], ["Every cell", "grid = [[1, 2, 3], [4, 5, 6]]\nfor r in range(len(grid)):\n    for c in range(len(grid[r])):\n        print(r, c, grid[r][c])"], ["Row totals", "grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nfor row in grid:\n    print(sum(row))"], ["Change a cell", "board = [[\"-\", \"-\"], [\"-\", \"-\"]]\nboard[0][1] = \"X\"\nprint(board)"]] }],
          ["predict", { code: "grid = [[1, 2], [3, 4], [5, 6]]\nprint(grid[2][0])", q: "What prints?", opts: ["5", "6", "3", "2"], ans: 0, why: "grid[2] is the third row, [5, 6]. Index 0 of it is 5." }]] }
    ],
    quiz: [["What is a 2D list?", ["A list of lists", "A list of 2 items", "A long string", "A tuple"], 0, "Rows of lists."], ["In grid[r][c], what does r pick?", ["The column", "The row", "The value", "The length"], 1, "The first index is the row."], ["What does grid[0] return?", ["The first cell", "The first row (a list)", "The first column", "An error"], 1, "A whole inner list."], ["How do you visit every cell?", ["One loop", "Two nested loops", "No loop", "A while only"], 1, "Rows then columns."]],
    end: ["Rows, then columns.", "Two indexes, or two loops, reach every cell."]
  };

  D["16.2"] = {
    id: "16.2", title: "List Comprehensions", lessonFile: fileOf(2, "list-comprehensions"), codehs: "CodeHS 10.2", tags: ["Python", "Comprehensions"],
    deck: "A compact way to build a new list from an old one in a single line, with an optional condition to filter items.",
    sections: [
      { h: "A Loop in One Line", f: "Section 1", story: "A list comprehension builds a new list by describing what to do with each item. [x * 2 for x in nums] means \"for each x in nums, put x times 2 in the new list.\" It is shorthand for a loop that appends.",
        b: [["gfx", "compare", { left: { title: "Loop and append", items: ["doubled = []", "for x in nums:", "    doubled.append(x * 2)"] }, right: { title: "Comprehension", items: ["doubled = [x * 2 for x in nums]", "One line", "Same result"] } }, "Both build the same list. The comprehension is just shorter."],
          ["py", { code: "nums = [1, 2, 3, 4]\ndoubled = [x * 2 for x in nums]\nprint(doubled)", presets: [["Double each", "nums = [1, 2, 3, 4]\ndoubled = [x * 2 for x in nums]\nprint(doubled)"], ["Squares", "print([n * n for n in range(1, 6)])"], ["Same with a loop", "nums = [1, 2, 3, 4]\ndoubled = []\nfor x in nums:\n    doubled.append(x * 2)\nprint(doubled)"], ["Words", "words = [\"cat\", \"dog\", \"bird\"]\nprint([w.upper() for w in words])\nprint([len(w) for w in words])"]] }],
          ["cards", [["List comprehension", "A one-line way to build a new list from an existing sequence."]]]] },
      { h: "Adding a Filter", f: "Section 2", story: "Add if at the end to keep only some items. The comprehension below keeps only the even numbers before it squares them. Pick an expression and a filter and see the result.",
        b: [["widget", { html: '<div class="chips2" id="ec"></div><div class="chips2" id="fc"></div><div class="wout" id="io"></div>', js: function (w) {
          var ex = [["x", "x"], ["x * x", "x * x"], ["x + 10", "x + 10"], ["-x", "-x"]], fl = [["no filter", ""], ["only even", " if x % 2 == 0"], ["bigger than 3", " if x > 3"]], ci = 1, cf = 0, eb = w.querySelector("#ec"), fb = w.querySelector("#fc");
          function up() { var code = "[" + ex[ci][1] + " for x in range(1, 9)" + fl[cf][1] + "]", r = window.MiniPy.run("print(" + code + ")"); w.querySelector("#io").innerHTML = "nums = range(1, 9)  # 1 to 8<br>" + esc(code) + "<br>&rarr; <b>" + esc(r.err || r.out) + "</b>"; [].forEach.call(eb.children, function (c, k) { c.classList.toggle("on", k === ci); }); [].forEach.call(fb.children, function (c, k) { c.classList.toggle("on", k === cf); }); }
          ex.forEach(function (e, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = "expression: " + e[0]; b.onclick = function () { ci = i; up(); }; eb.appendChild(b); });
          fl.forEach(function (f, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = f[0]; b.onclick = function () { cf = i; up(); }; fb.appendChild(b); }); up(); } }],
          ["py", { code: "nums = [5, 12, 7, 20, 3]\nbig = [n for n in nums if n > 6]\nprint(big)", presets: [["Filter", "nums = [5, 12, 7, 20, 3]\nbig = [n for n in nums if n > 6]\nprint(big)"], ["Transform and filter", "nums = range(1, 11)\nprint([n * n for n in nums if n % 2 == 0])"]] }],
          ["predict", { code: "print([x + 1 for x in [1, 2, 3]])", q: "What prints?", opts: ["[2, 3, 4]", "[1, 2, 3, 1]", "[1, 2, 3]", "6"], ans: 0, why: "Each item has 1 added to it." }]] }
    ],
    quiz: [["What does [x * 2 for x in [1, 2, 3]] give?", ["[2, 4, 6]", "[1, 2, 3]", "[3, 6]", "6"], 0, "Each doubled."], ["What does the if at the end of a comprehension do?", ["Repeats it", "Keeps only items that pass the test", "Sorts the list", "Prints the list"], 1, "It filters."], ["A comprehension always produces a...", ["Tuple", "String", "List", "Number"], 2, "A new list."], ["What does [n for n in range(6) if n % 2 == 0] give?", ["[0, 2, 4]", "[1, 3, 5]", "[0, 1, 2, 3, 4, 5]", "[2, 4]"], 0, "Even numbers below 6."]],
    end: ["For each item, make something.", "Add an if to keep only what you want."]
  };

  D["16.3"] = {
    id: "16.3", title: "Packing and Unpacking", lessonFile: fileOf(3, "packing-and-unpacking"), codehs: "CodeHS 10.3", tags: ["Python", "Tuples"],
    deck: "How to gather several values into one variable (packing) and spread them back out into separate variables (unpacking), including the one-line swap.",
    sections: [
      { h: "Pack It, Unpack It", f: "Section 1", story: "Packing puts several values into one tuple: point = 3, 4. Unpacking does the reverse, giving each item its own name: x, y = point. The number of names must match the number of items.",
        b: [["gfx", "flow", { steps: ["point = 3, 4|packing: one tuple", "(3, 4)|stored together", "x, y = point|unpacking", "x is 3, y is 4|separate names"], perRow: 4, colors: ["#5FD8DF", "#8B9AAE", "#FDD877", "#34D399"] }, "Pack to carry values together. Unpack to use them separately."],
          ["py", { code: "point = 3, 4\nprint(point)\nx, y = point\nprint(x)\nprint(y)", presets: [["Pack and unpack", "point = 3, 4\nprint(point)\nx, y = point\nprint(x)\nprint(y)"], ["From a list", "name, age, grade = [\"Ada\", 15, 10]\nprint(name)\nprint(grade)"], ["Wrong count", "a, b = 1, 2, 3"], ["In a loop", "pairs = [(1, \"one\"), (2, \"two\")]\nfor number, word in pairs:\n    print(number, word)"]] }],
          ["cards", [["Packing", "Putting several values into one variable, usually a tuple."], ["Unpacking", "Assigning the items of a sequence to separate variables in one line."]]]] },
      { h: "The One-Line Swap", f: "Section 2", story: "Unpacking makes a famous trick possible: swapping two variables without a helper variable. Python builds the tuple on the right first, then unpacks it into the names on the left.",
        b: [["py", { code: "a = 1\nb = 2\na, b = b, a\nprint(a, b)", presets: [["Swap", "a = 1\nb = 2\na, b = b, a\nprint(a, b)"], ["The long way", "a = 1\nb = 2\ntemp = a\na = b\nb = temp\nprint(a, b)"], ["Return two values", "def min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = min_max([4, 9, 2, 7])\nprint(low, high)"]] }],
          ["predict", { code: "first, second, third = [10, 20, 30]\nprint(second)", q: "What prints?", opts: ["10", "20", "30", "Error"], ans: 1, why: "The items are matched to the names in order, so second is 20." }],
          ["match", [["x, y = 3, 4", "x is 3 and y is 4"], ["a, b = b, a", "Swap two variables"], ["point = 5, 6", "Packing into a tuple"], ["a, b = 1, 2, 3", "ValueError: too many values to unpack"]]]] }
    ],
    quiz: [["What is packing?", ["Gathering values into one variable", "Deleting a list", "Sorting", "Printing"], 0, "Often into a tuple."], ["What does x, y = (7, 8) do?", ["Makes x 7 and y 8", "Makes x (7, 8)", "Raises an error", "Swaps x and y"], 0, "Unpacking."], ["What does a, b = b, a do?", ["Swaps them", "Errors", "Deletes them", "Does nothing"], 0, "Python swaps in one line."], ["What happens with a, b = 1, 2, 3?", ["Works", "ValueError: too many values", "a becomes 1", "Nothing"], 1, "The counts don't match."]],
    end: ["Many values in, many names out.", "Matching counts is the only rule."]
  };

  D["16.4"] = {
    id: "16.4", title: "Dictionaries", lessonFile: fileOf(4, "dictionaries"), codehs: "CodeHS 10.4", tags: ["Python", "Dictionaries"],
    deck: "A data structure that stores values under names called keys, so you look things up by meaning instead of by position.",
    sections: [
      { h: "Look Things Up by Name", f: "Section 1", story: "A list finds things by position. A dictionary finds them by a key you choose. Think of a phone book: you look up a name and get a number. Dictionaries are written with curly braces and key: value pairs.",
        b: [["widget", { html: '<div class="wrow"><label>look up the key</label><div class="chips2" id="kc" style="margin:0"></div></div><div class="fig" id="fg" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var d = [["name", "\"Ada\""], ["age", "15"], ["grade", "10"], ["club", "\"Robotics\""]], sel = 1, box = w.querySelector("#kc");
          function up() { var s = '<rect x="10" y="10" width="560" height="' + (d.length * 40 + 10) + '" rx="8" fill="#151A24" stroke="#3A4658"/>'; d.forEach(function (r, i) { var y = 24 + i * 40, on = i === sel; s += '<rect x="24" y="' + y + '" width="180" height="30" rx="5" fill="' + (on ? "rgba(251,191,36,.2)" : "#10141C") + '" stroke="' + (on ? "#FDD877" : "#5FD8DF") + '" stroke-width="2"/><text x="114" y="' + (y + 20) + '" font-size="14" fill="#EAEFF6" text-anchor="middle">"' + r[0] + '"</text><text x="226" y="' + (y + 20) + '" font-size="16" fill="#8B9AAE" text-anchor="middle">:</text><rect x="248" y="' + y + '" width="180" height="30" rx="5" fill="' + (on ? "rgba(251,191,36,.2)" : "#10141C") + '" stroke="' + (on ? "#FDD877" : "#3A4658") + '" stroke-width="2"/><text x="338" y="' + (y + 20) + '" font-size="14" fill="#EAEFF6" text-anchor="middle">' + esc(r[1]) + "</text>"; }); s += '<text x="450" y="38" font-size="11" fill="#5FD8DF">key</text><text x="450" y="54" font-size="11" fill="#8B9AAE">value</text>';
            w.querySelector("#fg").innerHTML = '<svg viewBox="0 0 580 ' + (d.length * 40 + 30) + '" role="img" aria-label="dictionary of keys and values">' + s + "</svg>"; w.querySelector("#io").innerHTML = "student[\"" + d[sel][0] + "\"] &rarr; <b>" + esc(d[sel][1]) + "</b>"; [].forEach.call(box.children, function (c, k) { c.classList.toggle("on", k === sel); }); }
          d.forEach(function (r, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = r[0]; b.onclick = function () { sel = i; up(); }; box.appendChild(b); }); up(); } }],
          ["cards", [["Dictionary", "A collection of key: value pairs, written with curly braces."], ["Key", "The name you use to look something up. Keys are unique."], ["Value", "The data stored under a key."]]]] },
      { h: "Working With a Dictionary", f: "Section 2", story: "Use square brackets with a key to read or change a value. Assigning to a new key adds it. A missing key causes a KeyError, so .get() is a safe way to ask.",
        b: [["py", { code: "student = {\"name\": \"Ada\", \"age\": 15}\nprint(student[\"name\"])\nstudent[\"age\"] = 16\nstudent[\"grade\"] = 10\nprint(student)\nprint(len(student))", presets: [["Read and change", "student = {\"name\": \"Ada\", \"age\": 15}\nprint(student[\"name\"])\nstudent[\"age\"] = 16\nstudent[\"grade\"] = 10\nprint(student)\nprint(len(student))"], ["Missing key", "student = {\"name\": \"Ada\"}\nprint(student[\"age\"])"], ["Safe get()", "student = {\"name\": \"Ada\"}\nprint(student.get(\"age\"))\nprint(student.get(\"age\", \"unknown\"))"], ["Loop over pairs", "prices = {\"apple\": 1.5, \"bread\": 3, \"milk\": 2.25}\nfor item, price in prices.items():\n    print(item, price)"], ["Check a key", "menu = {\"pizza\": 8, \"salad\": 6}\nprint(\"pizza\" in menu)\nprint(\"soup\" in menu)\nprint(list(menu.keys()))"], ["Count letters", "counts = {}\nfor ch in \"banana\":\n    if ch in counts:\n        counts[ch] += 1\n    else:\n        counts[ch] = 1\nprint(counts)"]] }],
          ["predict", { code: "d = {\"a\": 1, \"b\": 2}\nd[\"c\"] = 3\nprint(len(d))", q: "What prints?", opts: ["2", "3", "6", "Error"], ans: 1, why: "Assigning to a new key adds a pair, so there are three keys." }],
          ["match", [["{ }", "Creates a dictionary"], ["d[key]", "Look up a value"], ["d[key] = x", "Add or change a pair"], ["d.get(key)", "Safe lookup that gives None if missing"], ["key in d", "Is the key there?"]]]] }
    ],
    quiz: [["How does a dictionary find values?", ["By position", "By key", "By size", "By color"], 1, "Keys."], ["What does d[\"x\"] = 5 do if x isn't a key yet?", ["Error", "Adds the pair", "Deletes d", "Nothing"], 1, "It creates the key."], ["What happens with d[\"missing\"]?", ["None", "KeyError", "0", "An empty string"], 1, "Use get() to avoid it."], ["Which brackets make a dictionary?", ["[ ]", "( )", "{ }", "< >"], 2, "Curly braces."], ["What does d.get(\"z\", 0) return if z is missing?", ["Error", "0", "z", "None"], 1, "The default."]],
    end: ["Keys to values.", "When data has names, use a dictionary instead of remembering positions."]
  };

  D["16.5"] = {
    id: "16.5", title: "Equivalence vs. Identity", lessonFile: fileOf(5, "equivalence-vs-identity"), codehs: "CodeHS 10.5", tags: ["Python", "== vs is"],
    deck: "The difference between two values that are equal (==) and two names that refer to the very same object (is), and why changing one list can change another.",
    sections: [
      { h: "Same Contents, or the Same Thing?", f: "Section 1", story: "Two lists can have exactly the same contents and still be two separate lists. == asks whether the contents are equal (equivalence). is asks whether both names point at the very same object in memory (identity).",
        b: [["gfx", "compare", { left: { title: "a = [1, 2]   b = [1, 2]", items: ["a == b  is True", "a is b  is False", "Two separate lists with equal contents"] }, right: { title: "a = [1, 2]   c = a", items: ["a == c  is True", "a is c  is True", "One list with two names"] } }, "Equal is about contents. Identical is about being the same object."],
          ["py", { code: "a = [1, 2]\nb = [1, 2]\nc = a\nprint(a == b)\nprint(a is b)\nprint(a is c)", presets: [["== vs is", "a = [1, 2]\nb = [1, 2]\nc = a\nprint(a == b)\nprint(a is b)\nprint(a is c)"], ["A copy", "a = [1, 2]\nb = a.copy()\nprint(a == b)\nprint(a is b)"], ["Numbers", "x = 5\ny = 5\nprint(x == y)\nprint(x is y)"]] }],
          ["cards", [["Equivalence (==)", "Two values are equal. They look the same."], ["Identity (is)", "Two names refer to the exact same object."]]]] },
      { h: "Why It Matters", f: "Section 2", story: "If two names point at the same list, changing it through one name changes what the other sees. That surprises many beginners. If you want an independent list, make a copy.",
        b: [["py", { code: "a = [1, 2, 3]\nb = a\nb.append(99)\nprint(a)\nprint(b)", presets: [["Shared list", "a = [1, 2, 3]\nb = a\nb.append(99)\nprint(a)\nprint(b)"], ["Independent copy", "a = [1, 2, 3]\nb = a.copy()\nb.append(99)\nprint(a)\nprint(b)"], ["Strings differ", "s = \"hi\"\nt = s\nt = t + \"!\"\nprint(s)\nprint(t)"]] }],
          ["predict", { code: "x = [1, 2]\ny = x\ny[0] = 50\nprint(x)", q: "What prints?", opts: ["[1, 2]", "[50, 2]", "[50]", "Error"], ans: 1, why: "y and x are the same list, so changing it through y changes what x sees." }],
          ["match", [["a == b", "Do they have equal contents?"], ["a is b", "Are they the same object?"], ["b = a", "A second name for the same list"], ["b = a.copy()", "A separate list with equal contents"]]]] }
    ],
    quiz: [["What does == check?", ["Identity", "Equal contents", "Type", "Length"], 1, "Equivalence."], ["What does is check?", ["Equal contents", "Same object", "Same length", "Same type"], 1, "Identity."], ["After b = a for a list, a is b is...", ["True", "False", "None", "Error"], 0, "Same object."], ["How do you get an independent copy of a list?", ["b = a", "b = a.copy()", "b is a", "b == a"], 1, "copy() makes a new list."]],
    end: ["Equal is not always identical.", "Know which one you are asking before you change a shared list."]
  };

  D["16.6"] = {
    id: "16.6", title: "Extending Data Structures Quiz", lessonFile: fileOf(6, "extending-data-structures-quiz"), codehs: "CodeHS 10.6", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: 2D lists, list comprehensions, packing and unpacking, dictionaries, and equivalence versus identity.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Say each answer out loud before you flip the card.",
        b: [["gfx", "grid", { rows: [["\"a\"", "\"b\""], ["\"c\"", "\"d\""]], hi: [[1, 0]], label: "grid[1][0] is c" }, "grid[1][0] is \"c\": row 1, column 0."],
          ["cards", [["2D list", "grid[row][col]. Nested loops visit every cell."], ["Comprehension", "[expr for x in seq if cond]"], ["Packing / unpacking", "t = 1, 2 and a, b = t. Swap with a, b = b, a."], ["Dictionary", "{key: value}. Look up with d[key], use get() to be safe."], ["== vs is", "Equal contents versus the same object."], ["copy()", "Makes an independent list."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict each result before you run it.",
        b: [["predict", { code: "print([n * 3 for n in range(4)])", q: "What prints?", opts: ["[0, 3, 6, 9]", "[3, 6, 9, 12]", "[0, 1, 2, 3]", "[3, 3, 3, 3]"], ans: 0, why: "range(4) is 0, 1, 2, 3, each times 3." }],
          ["predict", { code: "d = {\"x\": 1}\nd[\"y\"] = 2\nprint(d[\"y\"] + d[\"x\"])", q: "What prints?", opts: ["2", "3", "12", "Error"], ans: 1, why: "2 plus 1 is 3." }],
          ["match", [["{ }", "Dictionary"], ["[ [ ] ]", "2D list"], ["a, b = b, a", "Swap"], ["is", "Same object?"], ["[x for x in nums if x > 0]", "Filter with a comprehension"]]],
          ["py", { code: "scores = {\"Ada\": [90, 85], \"Alan\": [70, 88]}\nfor name, marks in scores.items():\n    print(name, sum(marks) / len(marks))", note: "Add a student and run it." }]] }
    ],
    quiz: [["How do you read the cell in row 2, column 1 of a grid?", ["grid[2, 1]", "grid[2][1]", "grid(2)(1)", "grid.2.1"], 1, "Two indexes."], ["What does [x * 2 for x in [1, 2]] give?", ["[1, 2]", "[2, 4]", "[3]", "4"], 1, "Doubled."], ["What does a, b = 1, 2 do?", ["Makes a 1 and b 2", "Makes a a tuple", "Errors", "Swaps"], 0, "Unpacking."], ["Which finds a value by name?", ["List", "Tuple", "Dictionary", "String"], 2, "Dictionary."], ["Two names for one list means a is b is...", ["True", "False", "None", "Error"], 0, "Same object."]],
    end: ["That is the whole module.", "You now have lists, tuples, dictionaries, and strings. The next step is putting them to work in a project."]
  };
})();
