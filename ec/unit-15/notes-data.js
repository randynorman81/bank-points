/* Notes content for Unit 15: Creating and Altering Data Structures (CodeHS Unit 9). Rendered by ../notes-engine.js and ../minipy.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  function fileOf(k, name) { return "15-" + k + "-" + name + ".html"; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  D["15.1"] = {
    id: "15.1", title: "Tuples", lessonFile: fileOf(1, "tuples"), codehs: "CodeHS 9.1", tags: ["Python", "Data structures"],
    deck: "Your first data structure: a tuple stores an ordered group of values, each reachable by index, and it can never be changed after it is made.",
    sections: [
      { h: "One Name, Many Values", f: "Section 1", story: "A variable usually holds one value. A data structure holds several under one name. A tuple is an ordered group written in parentheses. Items can be different types, and each one has an index, starting at 0, just like a string.",
        b: [["gfx", "cells", { items: ["\"Ada\"", "15", "3.8", "True"], hi: [1], neg: true, w: 80, title: "student = (\"Ada\", 15, 3.8, True): student[1] is 15" }, "Four items, four indexes. Types can be mixed."],
          ["py", { code: "student = (\"Ada\", 15, 3.8, True)\nprint(student)\nprint(student[0])\nprint(student[-1])\nprint(len(student))", presets: [["A tuple", "student = (\"Ada\", 15, 3.8, True)\nprint(student)\nprint(student[0])\nprint(student[-1])\nprint(len(student))"], ["Slicing", "colors = (\"red\", \"green\", \"blue\", \"gold\")\nprint(colors[1:3])"], ["One item needs a comma", "a = (5)\nb = (5,)\nprint(type(a))\nprint(type(b))"]] }],
          ["cards", [["Tuple", "An ordered group of values written in parentheses. It can't be changed."], ["Data structure", "A way of storing several values together."], ["Heterogeneous", "Holding different types of values in one structure."]]]] },
      { h: "Tuples Can't Change", f: "Section 2", story: "A tuple is immutable, like a string. You can read any item and make slices, but you can't assign to an item, add to it, or remove from it. When you need something fixed, such as the coordinates of a point or the months of the year, that is exactly what you want.",
        b: [["py", { code: "point = (3, 4)\npoint[0] = 10", presets: [["Can't change", "point = (3, 4)\npoint[0] = 10"], ["Make a new one", "point = (3, 4)\npoint = (10, 4)\nprint(point)"], ["Unpack", "x, y = (3, 4)\nprint(x)\nprint(y)"]] }],
          ["predict", { code: "t = (\"a\", \"b\", \"c\")\nprint(t[1])", q: "What prints?", opts: ["a", "b", "c", "Error"], ans: 1, why: "Index 1 is the second item, b." }],
          ["match", [["( )", "Parentheses create a tuple"], ["Immutable", "Can't be changed after it is created"], ["t[0]", "The first item"], ["len(t)", "How many items"]]]] }
    ],
    quiz: [["How do you make a tuple?", ["[1, 2]", "(1, 2)", "{1, 2}", "<1, 2>"], 1, "Parentheses."], ["Can a tuple be changed after it's created?", ["Yes", "No", "Only the first item", "Only with append"], 1, "It is immutable."], ["What is (\"a\", \"b\", \"c\")[-1]?", ["a", "b", "c", "Error"], 2, "-1 is the last item."], ["Can a tuple hold different types?", ["Yes", "No", "Only numbers", "Only text"], 0, "It is heterogeneous."]],
    end: ["Ordered, indexed, fixed.", "Use a tuple when the values belong together and shouldn't change."]
  };

  D["15.2"] = {
    id: "15.2", title: "Lists", lessonFile: fileOf(2, "lists"), codehs: "CodeHS 9.2", tags: ["Python", "Lists"],
    deck: "The list is Python's everyday data structure: an ordered group in square brackets that you can read, change, grow, and shrink.",
    sections: [
      { h: "A Changeable Collection", f: "Section 1", story: "A list looks like a tuple but uses square brackets, and it is mutable. You can replace items, add new ones, and remove them. The same indexing and slicing you learned for strings works here too.",
        b: [["gfx", "cells", { items: ["\"pen\"", "\"book\"", "\"cup\"", "\"key\""], hi: [], neg: true, w: 80, title: "stuff = [\"pen\", \"book\", \"cup\", \"key\"]" }, "A list is a row of numbered boxes you can change."],
          ["py", { code: "stuff = [\"pen\", \"book\", \"cup\"]\nprint(stuff[0])\nstuff[1] = \"laptop\"\nprint(stuff)\nprint(len(stuff))", presets: [["Read and change", "stuff = [\"pen\", \"book\", \"cup\"]\nprint(stuff[0])\nstuff[1] = \"laptop\"\nprint(stuff)\nprint(len(stuff))"], ["Mixed types", "mix = [1, \"two\", 3.0, True]\nprint(mix)"], ["Slicing", "nums = [10, 20, 30, 40, 50]\nprint(nums[1:4])\nprint(nums[-2:])"], ["Out of range", "nums = [1, 2, 3]\nprint(nums[3])"]] }],
          ["cards", [["List", "An ordered, changeable group of values in square brackets."], ["Mutable", "Can be changed after it is created."]]]] },
      { h: "Watch a List Change", f: "Try it", story: "Press the buttons to change this list and see the boxes update. Notice how items shift when you insert or remove.",
        b: [["widget", { html: '<div class="fig" id="fg" style="margin:0 0 10px"></div><div class="chips2" id="bt"></div><div class="wout" id="co"></div>', js: function (w) {
          var L = ["cat", "dog", "bird"], last = "";
          function draw() { w.querySelector("#fg").innerHTML = window.__notesGfx.cells({ items: L.length ? L : [" "], hi: [], neg: true, w: 80, title: "pets = " + JSON.stringify(L).replace(/,/g, ", ") }); w.querySelector("#co").innerHTML = last || "Pick an operation."; }
          var ops = [["append(\"fish\")", function () { L.push("fish"); }], ["insert(1, \"cow\")", function () { L.splice(1, 0, "cow"); }], ["pop()", function () { if (L.length) return L.pop(); }], ["remove(\"dog\")", function () { var i = L.indexOf("dog"); if (i < 0) return "ValueError: not in list"; L.splice(i, 1); }], ["sort()", function () { L.sort(); }], ["reverse()", function () { L.reverse(); }], ["reset", function () { L.length = 0; L.push("cat", "dog", "bird"); }]], box = w.querySelector("#bt");
          ops.forEach(function (o) { var b = document.createElement("button"); b.className = "chip"; b.type = "button"; b.textContent = o[0]; b.onclick = function () { var r = o[1](); last = "pets." + esc(o[0]) + (r ? "  &rarr;  " + esc(r) : ""); draw(); }; box.appendChild(b); }); draw(); } }],
          ["predict", { code: "pets = [\"cat\", \"dog\", \"bird\"]\npets[1] = \"fish\"\nprint(pets)", q: "What prints?", opts: ["['cat', 'fish', 'bird']", "['fish', 'dog', 'bird']", "['cat', 'dog', 'fish']", "Error"], ans: 0, why: "Index 1 is the second item, so dog is replaced by fish." }]] }
    ],
    quiz: [["How do you make a list?", ["(1, 2)", "[1, 2]", "{1, 2}", "<1, 2>"], 1, "Square brackets."], ["Is a list mutable?", ["Yes", "No", "Only strings are", "Only numbers"], 0, "You can change it."], ["What does len([4, 5, 6]) give?", ["2", "3", "6", "15"], 1, "Three items."], ["What does [1, 2, 3][1] give?", ["1", "2", "3", "Error"], 1, "Index 1 is the second item."]],
    end: ["Lists hold things and let you change them.", "Almost every real program stores data in a list."]
  };

  D["15.3"] = {
    id: "15.3", title: "For Loops and Lists", lessonFile: fileOf(3, "for-loops-and-lists"), codehs: "CodeHS 9.3", tags: ["Python", "Lists", "Loops"],
    deck: "How to visit every item in a list with a for loop, how to use an index when you need the position, and how to total, count, and search as you go.",
    sections: [
      { h: "Visit Every Item", f: "Section 1", story: "A list and a for loop are a natural pair. for item in my_list gives you each item in turn, exactly as it did with the characters of a string. Use it to print, total, count, or search.",
        b: [["gfx", "flow", { steps: ["scores|[90, 75, 82]", "item = 90|pass 1", "item = 75|pass 2", "item = 82|pass 3"], perRow: 4, colors: ["#8B9AAE", "#5FD8DF", "#5FD8DF", "#5FD8DF"] }, "The loop runs once for each item in the list."],
          ["trace", { code: ["scores = [90, 75, 82]", "total = 0", "for s in scores:", "    total = total + s", "print(total)"], steps: [[0, { scores: "[90, 75, 82]" }, "", "Make the list."], [1, { scores: "[90, 75, 82]", total: "0" }, "", "Start the total at 0."], [2, { scores: "[90, 75, 82]", total: "0", s: "90" }, "", "First item."], [3, { scores: "[90, 75, 82]", total: "90", s: "90" }, "", "Add it."], [2, { scores: "[90, 75, 82]", total: "90", s: "75" }, "", "Second item."], [3, { scores: "[90, 75, 82]", total: "165", s: "75" }, "", "Add it."], [2, { scores: "[90, 75, 82]", total: "165", s: "82" }, "", "Third item."], [3, { scores: "[90, 75, 82]", total: "247", s: "82" }, "", "Add it."], [4, { scores: "[90, 75, 82]", total: "247", s: "82" }, "247", "The loop is done. Print the total."]] }],
          ["cards", [["for item in list", "Runs the block once for every item in the list."], ["range(len(list))", "Gives you the index of each item instead of the item itself."]]]] },
      { h: "Try Common Patterns", f: "Try it", story: "Most list loops are one of four patterns: print everything, add things up, count the ones that match, or build a new list.",
        b: [["py", { code: "scores = [90, 75, 82, 68, 95]\ntotal = 0\nfor s in scores:\n    total += s\nprint(\"Total:\", total)\nprint(\"Average:\", total / len(scores))", presets: [["Total and average", "scores = [90, 75, 82, 68, 95]\ntotal = 0\nfor s in scores:\n    total += s\nprint(\"Total:\", total)\nprint(\"Average:\", total / len(scores))"], ["Count matches", "scores = [90, 75, 82, 68, 95]\nhigh = 0\nfor s in scores:\n    if s >= 80:\n        high += 1\nprint(high)"], ["Biggest", "scores = [90, 75, 82, 68, 95]\nbest = scores[0]\nfor s in scores:\n    if s > best:\n        best = s\nprint(best)"], ["With index", "names = [\"Ada\", \"Grace\", \"Alan\"]\nfor i in range(len(names)):\n    print(i, names[i])"], ["Build a new list", "nums = [1, 2, 3, 4]\ndoubled = []\nfor n in nums:\n    doubled.append(n * 2)\nprint(doubled)"]] }],
          ["predict", { code: "nums = [2, 4, 6]\ntotal = 0\nfor n in nums:\n    total += n\nprint(total)", q: "What prints?", opts: ["6", "12", "246", "3"], ans: 1, why: "2 + 4 + 6 is 12." }]] }
    ],
    quiz: [["What does for x in [5, 6, 7]: give x?", ["The index each time", "One item each pass", "The whole list", "The length"], 1, "One item per pass."], ["How many passes does a loop over a 4-item list make?", ["3", "4", "5", "1"], 1, "One per item."], ["How do you get indexes when looping?", ["range(len(my_list))", "my_list.index", "len", "for each"], 0, "Loop over the range of positions."], ["Why start total = 0 before the loop?", ["To have a place to add into", "Python requires it", "To print 0", "It is a comment"], 0, "A counter must exist first."]],
    end: ["List plus loop equals most of programming.", "Total it, count it, search it, or transform it."]
  };

  D["15.4"] = {
    id: "15.4", title: "List Methods", lessonFile: fileOf(4, "list-methods"), codehs: "CodeHS 9.4", tags: ["Python", "Methods"],
    deck: "The built-in methods that add, remove, sort, and inspect list items, and how they differ from string methods because lists change in place.",
    sections: [
      { h: "Tools Attached to Lists", f: "Section 1", story: "Like strings, lists have methods called with a dot. The big difference is that lists are mutable, so most list methods change the list itself and return nothing. Pick a method and an item and watch it change.",
        b: [["gfx", "compare", { left: { title: "Changes the list itself", items: ["append(x), insert(i, x)", "remove(x), sort(), reverse()", "Return None"] }, right: { title: "Gives back a value", items: ["pop(): the item it removed", "count(x): a number", "index(x): a number"] } }, "Most list methods change the list in place."], ["table", ["Method", "What it does", "Returns"], [["append(x)", "Add x to the end", "nothing (changes the list)"], ["insert(i, x)", "Put x at position i", "nothing"], ["remove(x)", "Delete the first x", "nothing"], ["pop()", "Remove and return the last item", "the item"], ["sort()", "Put items in order", "nothing"], ["reverse()", "Flip the order", "nothing"], ["count(x)", "How many x are there", "a number"], ["index(x)", "Position of the first x", "a number"]]],
          ["py", { code: "nums = [5, 2, 8, 2]\nnums.append(9)\nnums.sort()\nprint(nums)\nprint(nums.count(2))\nprint(nums.index(8))", presets: [["Several methods", "nums = [5, 2, 8, 2]\nnums.append(9)\nnums.sort()\nprint(nums)\nprint(nums.count(2))\nprint(nums.index(8))"], ["pop returns the item", "stack = [1, 2, 3]\nlast = stack.pop()\nprint(last)\nprint(stack)"], ["remove vs pop", "fruits = [\"apple\", \"pear\", \"fig\"]\nfruits.remove(\"pear\")\nprint(fruits)\nfruits.pop(0)\nprint(fruits)"], ["Not found", "nums = [1, 2, 3]\nnums.remove(9)"]] }],
          ["cards", [["List method", "A function attached to a list that changes or inspects it."], ["append()", "Adds one item to the end."], ["pop()", "Removes and gives back an item (the last one by default)."], ["sort()", "Orders the list in place."]]]] },
      { h: "Method vs. Result", f: "Check yourself", story: "A common trap: sort() and append() change the list but return None. If you assign their result to a variable, you get None, not a list.",
        b: [["py", { code: "nums = [3, 1, 2]\nresult = nums.sort()\nprint(result)\nprint(nums)", presets: [["The trap", "nums = [3, 1, 2]\nresult = nums.sort()\nprint(result)\nprint(nums)"], ["sorted() instead", "nums = [3, 1, 2]\nresult = sorted(nums)\nprint(result)\nprint(nums)"]], note: "sorted() returns a new sorted list and leaves the original alone." }],
          ["predict", { code: "items = [\"a\", \"b\"]\nitems.append(\"c\")\nitems.insert(0, \"z\")\nprint(items)", q: "What prints?", opts: ["['z', 'a', 'b', 'c']", "['a', 'b', 'c', 'z']", "['a', 'z', 'b', 'c']", "['z', 'a', 'b']"], ans: 0, why: "c goes on the end, then z is inserted at the front." }],
          ["match", [["append(x)", "Add to the end"], ["pop()", "Remove and return the last item"], ["sort()", "Order the list in place"], ["insert(0, x)", "Add to the front"], ["count(x)", "How many times x appears"]]]] }
    ],
    quiz: [["Which method adds an item to the end?", ["add", "append", "insert()", "push"], 1, "append."], ["What does pop() return?", ["Nothing", "The removed item", "The new list", "The length"], 1, "The item it removed."], ["What does nums.sort() return?", ["The sorted list", "None, it sorts in place", "True", "A copy"], 1, "It changes the list and returns None."], ["How do you add an item at the front?", ["append(x)", "insert(0, x)", "front(x)", "pop(x)"], 1, "insert at index 0."]],
    end: ["List methods change the list itself.", "Remember that sort() and append() hand back None."]
  };

  D["15.5"] = {
    id: "15.5", title: "Creating and Altering Data Structures Quiz", lessonFile: fileOf(5, "creating-and-altering-data-structures-quiz"), codehs: "CodeHS 9.5", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: tuples, lists, looping over lists, and list methods.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Say each answer out loud before you flip the card.",
        b: [["gfx", "compare", { left: { title: "Tuple ( )", items: ["Ordered", "Indexed from 0", "Immutable", "Fixed groups of values"] }, right: { title: "List [ ]", items: ["Ordered", "Indexed from 0", "Mutable", "Collections that change"] } }, "The two structures look alike. The big difference is whether you can change them."],
          ["cards", [["Tuple", "Ordered, indexed, immutable. Written with ( )."], ["List", "Ordered, indexed, mutable. Written with [ ]."], ["for item in list", "Visit every item."], ["append / insert", "Add items."], ["remove / pop", "Take items out."], ["sort / reverse", "Reorder in place, return None."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict each result before you run it.",
        b: [["predict", { code: "t = (1, 2, 3)\nt[0] = 9", q: "What happens?", opts: ["t becomes (9, 2, 3)", "A TypeError", "Nothing", "t becomes [9, 2, 3]"], ans: 1, why: "Tuples are immutable." }],
          ["predict", { code: "data = [4, 1, 3]\ndata.sort()\nprint(data[0])", q: "What prints?", opts: ["4", "1", "3", "None"], ans: 1, why: "Sorted, the list is [1, 3, 4], so index 0 is 1." }],
          ["match", [["( )", "Tuple"], ["[ ]", "List"], ["append()", "Add to the end"], ["pop()", "Remove and return"], ["for x in my_list", "Visit each item"]]],
          ["py", { code: "scores = [88, 92, 79]\nscores.append(95)\nbest = max(scores)\nprint(scores)\nprint(best)\nprint(sum(scores) / len(scores))", note: "Add your own scores and run it." }]] }
    ],
    quiz: [["Which structure can't be changed after creation?", ["List", "Tuple", "Both", "Neither"], 1, "Tuples are immutable."], ["What does [1, 2, 3].append(4) leave the list as?", ["[1, 2, 3, 4]", "[4, 1, 2, 3]", "[1, 2, 3]", "4"], 0, "Added to the end."], ["What does for x in [1, 2, 3]: do?", ["Runs 3 times", "Runs once", "Runs forever", "Is an error"], 0, "One pass per item."], ["Which method removes and returns the last item?", ["remove", "pop", "delete", "clear"], 1, "pop()."], ["What does len((1, 2, 3, 4)) give?", ["3", "4", "5", "10"], 1, "Four items."]],
    end: ["That is the whole module.", "Next: lists inside lists, dictionaries, and some clever shortcuts."]
  };
})();
