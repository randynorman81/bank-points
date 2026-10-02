/* Notes content for Unit 14: Strings (CodeHS Unit 8). Rendered by ../notes-engine.js and ../minipy.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  function fileOf(k, name) { return "14-" + k + "-" + name + ".html"; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function pyRepr(expr) { var r = window.MiniPy.run("s = " + JSON.stringify(expr.s) + "\nprint(" + expr.code + ")"); return r.err ? r.err : r.out.replace(/\n$/, ""); }

  D["14.1"] = {
    id: "14.1", title: "Indexing", lessonFile: fileOf(1, "indexing"), codehs: "CodeHS 8.1", tags: ["Python", "Strings"],
    deck: "How every character in a string has a numbered position, why counting starts at 0, and how negative indexes count from the end.",
    sections: [
      { h: "Every Character Has a Position", f: "Section 1", story: "A string is a row of characters, and each one has an index, which is its position. Python starts counting at 0, so the first character is at index 0. Negative indexes count from the end: -1 is the last character.",
        b: [["widget", { html: '<input class="inl" id="ts" value="PYTHON" maxlength="12" aria-label="string"><div class="wrow" style="margin-top:10px"><label>index <b id="iv"></b></label><input type="range" id="is" min="0" max="5" value="0" style="max-width:260px"></div><div class="fig" id="fg" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var ts = w.querySelector("#ts"), is = w.querySelector("#is");
          function up() { var s = ts.value || " ", n = s.length; is.max = n - 1; if (+is.value > n - 1) is.value = n - 1; var i = +is.value; w.querySelector("#iv").textContent = i; w.querySelector("#fg").innerHTML = window.__notesGfx.cells({ items: s.split(""), hi: [i], neg: true, title: "positive index above, negative index below" }); w.querySelector("#io").innerHTML = "s[" + i + "] = <b>'" + esc(s[i]) + "'</b><br>s[" + (i - n) + "] = <b>'" + esc(s[i]) + "'</b> (the same character, counted from the end)"; }
          ts.oninput = is.oninput = up; up(); } }],
          ["cards", [["Indexing", "Using a position number in square brackets to get one character: word[0]."], ["Index", "A character's position in a string, starting at 0."], ["Negative index", "Counts backward from the end: -1 is the last character."]]]] },
      { h: "Try It in Python", f: "Section 2", story: "Square brackets after a string pick out one character. Ask for an index that does not exist and Python raises an IndexError.",
        b: [["py", { code: "word = \"Python\"\nprint(word[0])\nprint(word[3])\nprint(word[-1])\nprint(len(word))", presets: [["Positions", "word = \"Python\"\nprint(word[0])\nprint(word[3])\nprint(word[-1])\nprint(len(word))"], ["Last character", "word = \"banana\"\nprint(word[len(word) - 1])\nprint(word[-1])"], ["Out of range", "word = \"Python\"\nprint(word[6])"]], note: "The last index is len(word) - 1, because counting starts at 0." }],
          ["predict", { code: "name = \"Grace\"\nprint(name[1])", q: "What prints?", opts: ["G", "r", "a", "c"], ans: 1, why: "Index 0 is G, so index 1 is r." }],
          ["predict", { code: "word = \"school\"\nprint(word[-2])", q: "What prints?", opts: ["l", "o", "s", "c"], ans: 1, why: "-1 is the last letter (l), and -2 is the one before it: o." }]] }
    ],
    quiz: [["What is the index of the first character?", ["1", "0", "-1", "It depends"], 1, "Counting starts at 0."], ["What does \"hello\"[-1] give?", ["h", "o", "l", "Error"], 1, "-1 is the last character."], ["For a string of length 5, the last positive index is...", ["5", "4", "6", "0"], 1, "len - 1."], ["What error does \"hi\"[5] raise?", ["TypeError", "IndexError", "ValueError", "NameError"], 1, "The index is out of range."]],
    end: ["Positions start at 0.", "Almost everything you do with strings begins with an index."]
  };

  D["14.2"] = {
    id: "14.2", title: "Slicing", lessonFile: fileOf(2, "slicing"), codehs: "CodeHS 8.2", tags: ["Python", "Strings"],
    deck: "How slicing selects several characters at once with [start:stop:step], why stop is not included, and the reverse trick.",
    sections: [
      { h: "A Piece of a String", f: "Section 1", story: "Indexing gets one character. Slicing gets a section. word[start:stop] returns the characters from start up to, but not including, stop. Leave out start or stop and Python fills in the beginning or the end.",
        b: [["widget", { html: '<input class="inl" id="ts" value="PYTHON3" maxlength="12" aria-label="string"><div class="wrow" style="margin-top:10px"><label>start <b id="av"></b></label><input type="range" id="as" min="0" max="7" value="1" style="max-width:150px"><label>stop <b id="bv"></b></label><input type="range" id="bs" min="0" max="7" value="4" style="max-width:150px"></div><div class="fig" id="fg" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var ts = w.querySelector("#ts"), as = w.querySelector("#as"), bs = w.querySelector("#bs");
          function up() { var s = ts.value || " ", n = s.length; as.max = bs.max = n; if (+as.value > n) as.value = n; if (+bs.value > n) bs.value = n; var a = +as.value, b = +bs.value, hi = []; for (var i = a; i < b; i++) hi.push(i); w.querySelector("#av").textContent = a; w.querySelector("#bv").textContent = b;
            w.querySelector("#fg").innerHTML = window.__notesGfx.cells({ items: s.split(""), hi: hi, title: "highlighted = included. stop itself is not included" }); w.querySelector("#io").innerHTML = "s[" + a + ":" + b + "] = <b>'" + esc(pyRepr({ s: s, code: "s[" + a + ":" + b + "]" })).replace(/^'|'$/g, "") + "'</b>"; }
          ts.oninput = as.oninput = bs.oninput = up; up(); } }],
          ["cards", [["Slicing", "Taking a part of a string with [start:stop:step]."], ["Stop (exclusive)", "The slice goes up to but does NOT include the stop index."]]]] },
      { h: "Shortcuts and Steps", f: "Section 2", story: "Leaving a number out means all the way to that end. A third number is the step: 2 takes every second character, and -1 walks backward, which reverses the string.",
        b: [["py", { code: "s = \"Hello, world\"\nprint(s[0:5])\nprint(s[:5])\nprint(s[7:])\nprint(s[::2])\nprint(s[::-1])", presets: [["Slices", "s = \"Hello, world\"\nprint(s[0:5])\nprint(s[:5])\nprint(s[7:])\nprint(s[::2])\nprint(s[::-1])"], ["Last three", "word = \"computer\"\nprint(word[-3:])\nprint(word[:-3])"], ["Reverse check", "word = \"level\"\nprint(word == word[::-1])"]] }],
          ["table", ["Slice", "Meaning"], [["s[2:5]", "indexes 2, 3, 4"], ["s[:3]", "the first 3 characters"], ["s[3:]", "from index 3 to the end"], ["s[-3:]", "the last 3 characters"], ["s[::2]", "every second character"], ["s[::-1]", "the whole string reversed"]]],
          ["predict", { code: "word = \"computer\"\nprint(word[2:5])", q: "What prints?", opts: ["mpu", "mput", "omp", "mpute"], ans: 0, why: "Indexes 2, 3, 4 are m, p, u. Index 5 (the stop) is not included." }]] }
    ],
    quiz: [["Which characters does s[1:3] include?", ["Indexes 1, 2, 3", "Indexes 1 and 2", "Indexes 0 to 3", "Only index 3"], 1, "stop is not included."], ["What does s[::-1] do?", ["Deletes s", "Reverses s", "Copies the first character", "Gives an error"], 1, "A step of -1 walks backward."], ["What does \"python\"[:3] give?", ["pyt", "pyth", "yth", "thon"], 0, "The first three characters."], ["What does \"python\"[-2:] give?", ["py", "on", "yt", "no"], 1, "The last two characters."]],
    end: ["start:stop:step, and stop never counts.", "Slices let you cut a string without writing a loop."]
  };

  D["14.3"] = {
    id: "14.3", title: "Immutability", lessonFile: fileOf(3, "immutability"), codehs: "CodeHS 8.3", tags: ["Python", "Strings"],
    deck: "Why a string can't be changed in place, how to build a new string instead, and the difference between changing a variable and changing a string.",
    sections: [
      { h: "Strings Can't Be Edited", f: "Section 1", story: "In Python, a string is immutable, which means its characters can't be changed after it is made. You can point a variable at a brand new string, but you can't swap one letter inside the old one.",
        b: [["gfx", "compare", { left: { title: "Not allowed", items: ["word[0] = \"J\"", "Changes a letter in place", "TypeError"] }, right: { title: "Allowed", items: ["word = \"J\" + word[1:]", "Builds a new string", "word now points to it"] } }, "You never edit the old string. You make a new one and reuse the name."],
          ["py", { code: "word = \"Cat\"\nword[0] = \"B\"", presets: [["The error", "word = \"Cat\"\nword[0] = \"B\""], ["Build a new string", "word = \"Cat\"\nword = \"B\" + word[1:]\nprint(word)"], ["Reassign is fine", "word = \"Cat\"\nword = \"Dog\"\nprint(word)"]] }],
          ["cards", [["Immutability", "A value that cannot be changed after it is created. Strings are immutable."], ["Reassignment", "Pointing a variable at a different value. It does not edit the old one."]]]] },
      { h: "Building a New String", f: "Section 2", story: "To \"change\" a string, slice out the parts you want to keep and join them with + to the new pieces. The original is untouched, and you can store the result under any name.",
        b: [["py", { code: "name = \"Jonathan\"\nshort = name[:3]\nnew_name = \"Mr. \" + short\nprint(name)\nprint(new_name)", presets: [["Original stays", "name = \"Jonathan\"\nshort = name[:3]\nnew_name = \"Mr. \" + short\nprint(name)\nprint(new_name)"], ["Swap a letter", "word = \"bat\"\nnew_word = word[:1] + \"i\" + word[2:]\nprint(new_word)"], ["Add to the end", "s = \"Hello\"\ns = s + \"!\"\nprint(s)"]] }],
          ["predict", { code: "s = \"hello\"\ns.upper()\nprint(s)", q: "What prints?", opts: ["HELLO", "hello", "Hello", "Error"], ans: 1, why: "upper() returns a new string. It does not change s, and the result was thrown away." }],
          ["match", [["Immutable", "Can't be changed after it's made"], ["word[0] = \"X\"", "TypeError on a string"], ["word = \"X\" + word[1:]", "Builds a new string"], ["word[1:]", "Everything except the first character"]]]] }
    ],
    quiz: [["What does immutable mean?", ["Can't be changed after creation", "Changes quickly", "Very large", "Always a number"], 0, "Strings can't be edited in place."], ["What happens with word[0] = \"X\"?", ["It works", "A TypeError", "It deletes the word", "A NameError"], 1, "Strings don't support item assignment."], ["How do you effectively change the first letter?", ["word[0] = \"X\"", "word = \"X\" + word[1:]", "word.first = \"X\"", "You can't"], 1, "Build a new string."], ["After s = \"a\"; s = s + \"b\", is the original \"a\" edited?", ["Yes", "No, s now points to a new string", "Only sometimes", "It becomes a list"], 1, "Concatenation makes a new string."]],
    end: ["Strings are values you replace, not edit.", "That is why string methods give you back a new string."]
  };

  D["14.4"] = {
    id: "14.4", title: "Strings and For Loops", lessonFile: fileOf(4, "strings-and-for-loops"), codehs: "CodeHS 8.4", tags: ["Python", "for loops"],
    deck: "How to walk through a string one character at a time, with for ch in word or with indexes, and how to count or build things along the way.",
    sections: [
      { h: "One Character at a Time", f: "Section 1", story: "A for loop can step through a string directly. for ch in word gives you each character in turn, no index needed. When you also need the position, loop over range(len(word)).",
        b: [["gfx", "flow", { steps: ["word|\"cat\"", "pass 1|ch is \"c\"", "pass 2|ch is \"a\"", "pass 3|ch is \"t\""], perRow: 4, colors: ["#8B9AAE", "#5FD8DF", "#5FD8DF", "#5FD8DF"] }, "One pass of the loop for every character in the string."], ["trace", { code: ["word = \"cat\"", "for ch in word:", "    print(ch)"], steps: [[0, { word: "\"cat\"" }, "", "word holds three characters."], [1, { word: "\"cat\"", ch: "\"c\"" }, "", "First pass: ch is the first character."], [2, { word: "\"cat\"", ch: "\"c\"" }, "c", "Print it."], [1, { word: "\"cat\"", ch: "\"a\"" }, "", "Second pass: ch is a."], [2, { word: "\"cat\"", ch: "\"a\"" }, "a", "Print it."], [1, { word: "\"cat\"", ch: "\"t\"" }, "", "Third pass: ch is t."], [2, { word: "\"cat\"", ch: "\"t\"" }, "t", "Print it. The string is finished, so the loop ends."]] }],
          ["py", { code: "word = \"Python\"\nfor ch in word:\n    print(ch)\nfor i in range(len(word)):\n    print(i, word[i])", presets: [["Both styles", "word = \"Python\"\nfor ch in word:\n    print(ch)\nfor i in range(len(word)):\n    print(i, word[i])"], ["Spell it out", "word = \"hello\"\nfor ch in word:\n    print(ch, end=\"-\")\nprint()"]] }]] },
      { h: "Counting and Building", f: "Section 2", story: "Loops over strings are how programs count letters, search, and build new text. Make a counter before the loop, update it inside, and use it after.",
        b: [["py", { code: "word = \"banana\"\ncount = 0\nfor ch in word:\n    if ch == \"a\":\n        count += 1\nprint(count)", presets: [["Count a letter", "word = \"banana\"\ncount = 0\nfor ch in word:\n    if ch == \"a\":\n        count += 1\nprint(count)"], ["Count vowels", "word = \"education\"\nvowels = 0\nfor ch in word:\n    if ch in \"aeiou\":\n        vowels += 1\nprint(vowels)"], ["Reverse by loop", "word = \"stressed\"\nresult = \"\"\nfor ch in word:\n    result = ch + result\nprint(result)"], ["Double each letter", "word = \"abc\"\nresult = \"\"\nfor ch in word:\n    result += ch * 2\nprint(result)"]] }],
          ["predict", { code: "total = 0\nfor ch in \"1234\":\n    total += int(ch)\nprint(total)", q: "What prints?", opts: ["10", "1234", "4", "Error"], ans: 0, why: "Each character is converted to a number and added: 1 + 2 + 3 + 4." }]] }
    ],
    quiz: [["What does ch hold in for ch in word?", ["The whole word", "One character each pass", "The length", "An index"], 1, "One character at a time."], ["How many passes does for ch in \"hello\" make?", ["4", "5", "6", "1"], 1, "One per character."], ["When would you loop over range(len(word))?", ["When you need the index", "Never", "To change letters", "To print"], 0, "To get positions."], ["What starts the counter before the loop?", ["count = 0", "count == 0", "count in 0", "count 0"], 0, "Initialize it first."]],
    end: ["A string is a sequence you can walk through.", "Counting, searching, and building all start with that loop."]
  };

  D["14.5"] = {
    id: "14.5", title: "The in Keyword", lessonFile: fileOf(5, "the-in-keyword"), codehs: "CodeHS 8.5", tags: ["Python", "in"],
    deck: "How in asks whether a character or a piece of text appears inside a string, and how to combine it with if.",
    sections: [
      { h: "Is It Inside?", f: "Section 1", story: "The in keyword is a question: is this text found anywhere inside that string? The answer is a boolean, so it fits perfectly in an if. Try it with your own word and search text.",
        b: [["widget", { html: '<div class="wrow"><label>word</label><input class="inl" id="tw" value="education" maxlength="20" style="max-width:220px"><label>search for</label><input class="inl" id="tq" value="cat" maxlength="10" style="max-width:140px"></div><div class="fig" id="fg" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var tw = w.querySelector("#tw"), tq = w.querySelector("#tq");
          function up() { var s = tw.value || " ", q = tq.value, hi = [], at = q ? s.indexOf(q) : -1; if (at >= 0) for (var i = at; i < at + q.length; i++) hi.push(i); w.querySelector("#fg").innerHTML = window.__notesGfx.cells({ items: s.split(""), hi: hi, idx: false, title: "the match, if any, is highlighted" }); w.querySelector("#io").innerHTML = "\"" + esc(q) + "\" in \"" + esc(s) + "\"  &rarr;  <b>" + (q && at >= 0 ? "True" : "False") + "</b>"; }
          tw.oninput = tq.oninput = up; up(); } }],
          ["cards", [["in keyword", "Checks if a character or piece of text is found in a string. Gives True or False."], ["not in", "True when the text is NOT found."]]]] },
      { h: "in With if", f: "Section 2", story: "Combine in with if to make decisions about text. Note that in is case sensitive, so lowercase the string first if you want to ignore capitals.",
        b: [["py", { code: "email = \"ada@school.org\"\nif \"@\" in email:\n    print(\"Looks like an email\")\nelse:\n    print(\"Missing the @\")", presets: [["Check for @", "email = \"ada@school.org\"\nif \"@\" in email:\n    print(\"Looks like an email\")\nelse:\n    print(\"Missing the @\")"], ["Vowel check", "letter = \"e\"\nif letter in \"aeiou\":\n    print(\"vowel\")\nelse:\n    print(\"consonant\")"], ["Case matters", "print(\"cat\" in \"Concatenate\")\nprint(\"Cat\" in \"Concatenate\")\nprint(\"cat\" in \"Concatenate\".lower())"], ["not in", "word = \"python\"\nprint(\"z\" not in word)"]] }],
          ["predict", { code: "print(\"th\" in \"python\")", q: "What prints?", opts: ["True", "False", "2", "Error"], ans: 0, why: "The pieces \"th\" appear together in python, so the answer is True." }],
          ["predict", { code: "print(\"ty\" in \"python\")", q: "What prints?", opts: ["True", "False", "None", "Error"], ans: 1, why: "t and y are both in python, but not together as ty, so in says False." }]] }
    ],
    quiz: [["What does \"a\" in \"cat\" give?", ["True", "False", "1", "Error"], 0, "a is in cat."], ["Is in case sensitive?", ["Yes", "No", "Only for numbers", "Only in loops"], 0, "\"A\" and \"a\" differ."], ["What does \"z\" not in \"cat\" give?", ["True", "False", "None", "Error"], 0, "z is not found."], ["in returns what type?", ["int", "str", "bool", "list"], 2, "True or False."]],
    end: ["in answers one question: is it there?", "Pair it with if and you can make a program react to text."]
  };

  D["14.6"] = {
    id: "14.6", title: "String Methods", lessonFile: fileOf(6, "string-methods"), codehs: "CodeHS 8.6", tags: ["Python", "Methods"],
    deck: "What a method is, the most useful string methods, and why they return a new string instead of changing the original.",
    sections: [
      { h: "Functions Attached to Strings", f: "Section 1", story: "A method is a function that belongs to a value and is called with a dot: text.upper(). String methods clean up, search, and reshape text. Because strings are immutable, every method returns a new string.",
        b: [["gfx", "flow", { steps: ["s = \"hello\"|the original (unchanged)", "s.upper()|method call", "\"HELLO\"|a NEW string comes back"], perRow: 3, colors: ["#8B9AAE", "#5FD8DF", "#FDD877"] }, "The original string is never edited."], ["widget", { html: '<input class="inl" id="ts" value="  Hello, World  " maxlength="30" aria-label="string"><div class="chips2" id="mc" style="margin-top:10px"></div><div class="wout" id="io"></div>', js: function (w) {
          var ts = w.querySelector("#ts"), box = w.querySelector("#mc"), cur = 0, ms = [["upper()", "s.upper()"], ["lower()", "s.lower()"], ["strip()", "s.strip()"], ["title()", "s.title()"], ["replace(\"l\", \"L\")", "s.replace(\"l\", \"L\")"], ["split(\",\")", "s.split(\",\")"], ["count(\"l\")", "s.count(\"l\")"], ["find(\"W\")", "s.find(\"W\")"], ["startswith(\"He\")", "s.startswith(\"He\")"]];
          function up() { var r = window.MiniPy.run("s = " + JSON.stringify(ts.value) + "\nprint(repr(" + ms[cur][1] + "))"); w.querySelector("#io").innerHTML = "<span class=\"small\">original: " + esc(JSON.stringify(ts.value)) + "</span><br>s." + esc(ms[cur][0]) + "  &rarr;  <b>" + esc(r.err || r.out.replace(/\n$/, "")) + "</b>"; [].forEach.call(box.children, function (c, k) { c.classList.toggle("on", k === cur); }); }
          ms.forEach(function (m, i) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = m[0]; b.onclick = function () { cur = i; up(); }; box.appendChild(b); }); ts.oninput = up; up(); } }],
          ["table", ["Method", "What it does", "Example result"], [["upper() / lower()", "Change the case", "\"hi\".upper() is \"HI\""], ["strip()", "Remove spaces at both ends", "\"  hi \".strip() is \"hi\""], ["replace(old, new)", "Swap text for other text", "\"cat\".replace(\"c\", \"b\") is \"bat\""], ["split()", "Break into a list of pieces", "\"a b\".split() is [\"a\", \"b\"]"], ["find(text)", "Index of the first match, or -1", "\"hello\".find(\"l\") is 2"], ["count(text)", "How many times it appears", "\"banana\".count(\"a\") is 3"]]],
          ["cards", [["Method", "A function attached to a value, called with a dot."], ["String methods", "Built-in tools for changing, searching, and splitting strings. They return new strings."]]]] },
      { h: "Using Methods", f: "Section 2", story: "Remember to catch the result. s.upper() on its own does nothing useful, because strings can't change in place. Store it, or print it, or chain more methods.",
        b: [["py", { code: "name = \"  ada lovelace  \"\nclean = name.strip().title()\nprint(clean)\nprint(name)", presets: [["Chaining", "name = \"  ada lovelace  \"\nclean = name.strip().title()\nprint(clean)\nprint(name)"], ["Forgot to store", "s = \"hello\"\ns.upper()\nprint(s)"], ["split and join", "sentence = \"the quick brown fox\"\nwords = sentence.split()\nprint(words)\nprint(len(words))\nprint(\"-\".join(words))"], ["find", "s = \"Python\"\nprint(s.find(\"t\"))\nprint(s.find(\"z\"))"]] }],
          ["predict", { code: "print(\"Hello\".replace(\"l\", \"L\"))", q: "What prints?", opts: ["HeLLo", "Hello", "HELLO", "Helo"], ans: 0, why: "replace swaps every l for L." }],
          ["match", [["strip()", "Remove spaces from both ends"], ["split()", "Break text into a list"], ["upper()", "Make every letter capital"], ["find(\"x\")", "Index of a match, or -1"], ["count(\"x\")", "How many times it appears"]]]] }
    ],
    quiz: [["What is a method?", ["A function attached to a value", "A kind of loop", "A comment", "A number"], 0, "Called with a dot."], ["Does s.upper() change s?", ["Yes", "No, it returns a new string", "Only sometimes", "It deletes s"], 1, "Strings are immutable."], ["What does \"a,b\".split(\",\") give?", ["\"ab\"", "[\"a\", \"b\"]", "a b", "Error"], 1, "A list of pieces."], ["What does \"hello\".find(\"z\") give?", ["0", "-1", "None", "Error"], 1, "-1 means not found."]],
    end: ["Methods return new strings.", "Catch the result and chain them to clean up text in one line."]
  };

  D["14.7"] = {
    id: "14.7", title: "Strings Quiz", lessonFile: fileOf(7, "strings-quiz"), codehs: "CodeHS 8.7", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: indexing, slicing, immutability, looping over strings, in, and string methods.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Say each answer out loud before you flip the card. Then try the string below to see all the ideas at work.",
        b: [["gfx", "cells", { items: ["P", "Y", "T", "H", "O", "N"], hi: [1, 2, 3], neg: true, title: "word = \"PYTHON\": word[1:4] is YTH, word[-1] is N, word[::-1] is NOHTYP" }, "Positive indexes above, negative below. The highlighted slice is word[1:4]."], ["cards", [["Indexing", "word[0] is the first character, word[-1] is the last."], ["Slicing", "word[start:stop:step]. stop is not included."], ["Immutability", "Strings can't be edited. Build a new one."], ["Loops", "for ch in word walks through the characters."], ["in", "\"x\" in word is True or False."], ["Methods", "upper, lower, strip, replace, split, find, count. They return new strings."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict each result before you run it.",
        b: [["predict", { code: "s = \"programming\"\nprint(s[3:7])", q: "What prints?", opts: ["gram", "ogra", "gramm", "rogr"], ans: 0, why: "Indexes 3, 4, 5, 6: g, r, a, m." }],
          ["predict", { code: "word = \"level\"\nprint(word == word[::-1])", q: "What prints?", opts: ["True", "False", "level", "Error"], ans: 0, why: "Reversed it is still level, so it reads the same both ways." }],
          ["match", [["s[0]", "First character"], ["s[-1]", "Last character"], ["s[::-1]", "Reversed string"], ["s.strip()", "Spaces removed from the ends"], ["\"a\" in s", "True or False"]]],
          ["py", { code: "phrase = \"A man a plan\"\nclean = phrase.lower().replace(\" \", \"\")\nprint(clean)\nprint(clean == clean[::-1])\nprint(clean.count(\"a\"))", note: "Change the phrase and run it again." }]] }
    ],
    quiz: [["What does \"hello\"[1:3] give?", ["hel", "el", "ell", "he"], 1, "Indexes 1 and 2."], ["Which is correct for the last character?", ["s[len(s)]", "s[-1]", "s[last]", "s[end]"], 1, "-1."], ["Why does s[0] = \"x\" fail?", ["Strings are immutable", "0 is invalid", "x is a bad name", "It doesn't"], 0, "Strings can't be edited in place."], ["What does \"Hi\".lower() give?", ["HI", "hi", "Hi", "h"], 1, "All lowercase."], ["What does \"cat\" in \"concatenate\" give?", ["True", "False", "2", "Error"], 0, "It appears inside."]],
    end: ["That is the whole module.", "Data structures come next: lists and tuples hold many values, not just characters."]
  };
})();
