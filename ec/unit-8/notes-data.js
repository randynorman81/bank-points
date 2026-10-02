/* Notes content for Unit 8: Basic Python and Console Interaction (CodeHS Unit 2). Rendered by ../notes-engine.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  function fileOf(k, name) { return "8-" + k + "-" + name + ".html"; }

  D["8.1"] = {
    id: "8.1", title: "Printing in Python", lessonFile: fileOf(1, "printing-in-python"), codehs: "CodeHS 2.1", tags: ["Python", "print()"],
    deck: "How print() puts text on the screen, why text needs quotation marks, and what to do when your text contains an apostrophe.",
    sections: [
      { h: "print() Talks to the Screen", f: "Section 1", story: "A program that can't show you anything is hard to trust. print() is how a Python program talks to the person running it. Whatever you put inside the parentheses shows up on the screen.",
        b: [["gfx", "flow", { steps: ["print(\"Hi\")|you write this", "Python|reads the line", "Hi|appears on screen"], perRow: 3 }, "One line in, one line of output out."],
          ["py", { code: "print(\"Hello, world!\")\nprint(\"My name is Tracy\")", presets: [["Two lines", "print(\"Hello, world!\")\nprint(\"My name is Tracy\")"], ["Math vs text", "print(5 + 3)\nprint(\"5 + 3\")"], ["Blank line", "print(\"first\")\nprint()\nprint(\"second\")"]], note: "Edit the code and press Run. Everything here runs in your browser." }],
          ["cards", [["print()", "Shows whatever is inside the parentheses on the screen, then moves to the next line."], ["String", "Text. A string is any characters wrapped in quotation marks."], ["Quotation marks (' or \")", "They tell Python \"this is text, not a command.\" Single and double both work if you match them."]]]] },
      { h: "Quotes and Apostrophes", f: "Section 2", story: "Python needs to know where your text starts and stops, so every string has an opening and a closing quote. The quotes must match, and an apostrophe inside the text can confuse things unless you wrap the text in the other kind of quote.",
        b: [["py", { code: "print('Single quotes work')\nprint(\"Double quotes work too\")\nprint(\"It's fine with double quotes\")", presets: [["Works", "print('Single quotes work')\nprint(\"Double quotes work too\")\nprint(\"It's fine with double quotes\")"], ["Missing quote", "print(\"Hello)"], ["Apostrophe trouble", "print('It's Monday')"], ["Fixed", "print(\"It's Monday\")"]] }],
          ["predict", { q: "Which line prints It's Monday correctly?", opts: ["print('It's Monday')", "print(\"It's Monday\")", "print(It's Monday)", "print('It\"s Monday')"], ans: 1, why: "Double quotes around the text let the apostrophe inside be just a character." }],
          ["hint", "Error messages are clues, not insults. \"unterminated string\" means a string was opened and never closed."]] },
      { h: "A Few print() Extras", f: "Bonus", story: "print() has two tricks worth knowing now: it can print several things at once, and you can change what goes between them or at the end.",
        b: [["py", { code: "print(\"a\", \"b\", \"c\")\nprint(\"a\", \"b\", sep=\"-\")\nprint(\"one\", end=\" \")\nprint(\"two\")" }]] }
    ],
    quiz: [["What does print(\"Hi\") do?", ["Saves Hi", "Shows Hi on the screen", "Deletes Hi", "Draws a picture"], 1, "print() displays whatever is inside."], ["What is a string?", ["A number", "Text wrapped in quotation marks", "A command", "A color"], 1, "Strings are text."], ["Which prints correctly?", ["print(Hello)", "print(\"Hello)", "print(\"Hello\")", "print(\"Hello')"], 2, "Opening and closing quotes must match."], ["What does print(5 + 3) show?", ["5 + 3", "8", "53", "An error"], 1, "No quotes means Python does the math."]],
    end: ["print() is how Python talks.", "Every program you write from here on will use it, if only to check what is going on."]
  };

  D["8.2"] = {
    id: "8.2", title: "Variables and Types", lessonFile: fileOf(2, "variables-and-types"), codehs: "CodeHS 2.2", tags: ["Python", "Variables"],
    deck: "Variables as labeled boxes, the three types you will use all the time (string, integer, float), and why Python can work out the type for you.",
    sections: [
      { h: "A Variable Is a Labeled Box", f: "Section 1", story: "You met variables in C++. A variable is a name attached to a value so the program can remember it. Python works the same way, with one big difference: you never have to declare the type.",
        b: [["gfx", "vars", { items: [{ n: "name", t: "str", v: "\"Ada\"" }, { n: "age", t: "int", v: "15" }, { n: "gpa", t: "float", v: "3.8" }] }, "The name goes on the box. Python figures out the type from the value."],
          ["cards", [["Variable (review)", "A name that stores a value so you can use it later."], ["String / integer / floating point number", "str is text, int is a whole number, float is a number with a decimal point."], ["Dynamic typing", "Python decides the type from the value you assign. In C++ you had to write int or float yourself."]]]] },
      { h: "Python Picks the Type", f: "Try it", story: "type() tells you what Python thinks a value is. Notice that a variable can hold one type now and a different type later.",
        b: [["py", { code: "x = 5\nprint(type(x))\nx = \"five\"\nprint(type(x))", presets: [["Reassign type", "x = 5\nprint(type(x))\nx = \"five\"\nprint(type(x))"], ["Same digit, 3 types", "print(type(7), type(7.0), type(\"7\"))"], ["Quotes matter", "a = 3\nb = \"3\"\nprint(a == b)\nprint(a == int(b))"]] }],
          ["predict", { code: "price = 4.0\nprint(type(price))", q: "What type is price?", opts: ["int", "float", "str", "bool"], ans: 1, why: "It has a decimal point, so Python treats it as a float, even though the value is a whole number." }]] },
      { h: "Reassigning a Variable", f: "Section 2", story: "A variable is not locked to its first value. The right side of an assignment is worked out first, then stored under the name on the left.",
        b: [["trace", { code: ["score = 10", "score = score + 5", "print(score)"], steps: [[0, { score: "10" }, "", "Python creates score and stores 10."], [1, { score: "15" }, "", "The right side is worked out first (10 + 5), then stored back in score."], [2, { score: "15" }, "15", "print() shows the current value."]] }],
          ["match", [["int", "A whole number like 12"], ["float", "A number with a decimal like 12.5"], ["str", "Text in quotes like \"12\""], ["Dynamic typing", "Python works out the type for you"]]]] }
    ],
    quiz: [["Which is a float?", ["7", "\"7\"", "7.0", "seven"], 2, "A decimal point makes it a float."], ["What type is \"15\"?", ["int", "float", "str", "bool"], 2, "Anything in quotes is a string."], ["What does dynamic typing mean?", ["You must declare every type", "Python decides the type from the value", "Types never change", "Only numbers are allowed"], 1, "No type declarations needed."], ["After x = 3 and then x = x + 2, what is x?", ["3", "2", "5", "32"], 2, "The right side is evaluated first: 3 + 2."]],
    end: ["Names for values. Python handles the types.", "You will still need to know what type you have, because strings and numbers behave very differently."]
  };

  D["8.3"] = {
    id: "8.3", title: "User Input", lessonFile: fileOf(3, "user-input"), codehs: "CodeHS 2.3", tags: ["Python", "input()"],
    deck: "How input() asks the person using your program a question, why the answer always arrives as a string, and how to convert it when you need a number.",
    sections: [
      { h: "Asking a Question", f: "Section 1", story: "Until now your programs ran the same way every time. input() pauses the program, shows a prompt, waits for someone to type, and hands you what they typed.",
        b: [["gfx", "flow", { steps: ["input(\"Name? \")|program asks", "Person types|on the keyboard", "Stored|in a variable"], perRow: 3 }, "The answer goes into a variable so you can use it."],
          ["py", { code: "name = input(\"What is your name? \")\nprint(\"Hello, \" + name)", inputs: "Ada", note: "The box under the code stands in for the keyboard. Change it and run again." }],
          ["cards", [["input()", "Pauses the program, shows a prompt, and returns whatever the person types."], ["Type conversion (int(), float(), str())", "Changes a value from one type to another, like turning the text \"15\" into the number 15."]]]] },
      { h: "Everything Typed Is a String", f: "Section 2", story: "Here is the catch. Even if someone types 15, input() gives you the text \"15\", not the number 15. You can't do math with text, so you have to convert it first.",
        b: [["py", { code: "age = input(\"Age? \")\nprint(age + 1)", inputs: "15", presets: [["The error", "age = input(\"Age? \")\nprint(age + 1)", "15"], ["Fixed with int()", "age = int(input(\"Age? \"))\nprint(age + 1)", "15"], ["Decimals need float()", "price = float(input(\"Price? \"))\nprint(price * 2)", "2.50"], ["Not a number", "age = int(input(\"Age? \"))\nprint(age)", "fifteen"]] }],
          ["table", ["Function", "Turns text into", "Example"], [["int()", "a whole number", "int(\"15\") gives 15"], ["float()", "a decimal number", "float(\"2.5\") gives 2.5"], ["str()", "text", "str(15) gives \"15\""]]],
          ["predict", { code: "x = input(\"Number? \")   # the person types 12\nprint(x * 2)", q: "What does this print?", opts: ["24", "1212", "12 12", "An error"], ans: 1, why: "x is the string \"12\", and a string times 2 repeats it: 1212." }]] },
      { h: "A Tiny Calculator", f: "Try it", story: "Put it together: ask for two numbers, convert both, then use them.",
        b: [["py", { code: "a = int(input(\"First number: \"))\nb = int(input(\"Second number: \"))\nprint(\"Sum:\", a + b)\nprint(\"Product:\", a * b)", inputs: "6\n7", presets: [["Whole numbers", "a = int(input(\"First number: \"))\nb = int(input(\"Second number: \"))\nprint(\"Sum:\", a + b)\nprint(\"Product:\", a * b)", "6\n7"], ["Decimals", "a = float(input(\"First number: \"))\nb = float(input(\"Second number: \"))\nprint(\"Average:\", (a + b) / 2)", "2.5\n4"]] }],
          ["order", { q: "Put these lines in an order that works.", lines: ["age = int(input(\"Age? \"))", "next_year = age + 1", "print(\"Next year you will be\", next_year)"], why: "A variable must get a value before you use it.", hint: "You can't add 1 to age before age exists." }]] }
    ],
    quiz: [["What type does input() always return?", ["int", "float", "str", "It depends"], 2, "Always a string, even if the person types digits."], ["How do you turn \"15\" into the number 15?", ["str(\"15\")", "int(\"15\")", "print(\"15\")", "\"15\" + 0"], 1, "int() converts text to a whole number."], ["What happens with int(input()) if someone types hello?", ["It prints hello", "It returns 0", "A ValueError", "Nothing"], 2, "\"hello\" can't be converted to an integer."], ["What is \"7\" * 3?", ["21", "\"777\"", "10", "An error"], 1, "A string times 3 repeats it."]],
    end: ["input() gives you text. Convert it when you need a number.", "Most beginner bugs with input come from forgetting that."]
  };

  D["8.4"] = {
    id: "8.4", title: "Mathematical Operators", lessonFile: fileOf(4, "mathematical-operators"), codehs: "CodeHS 2.4", tags: ["Python", "Math"],
    deck: "The arithmetic operators, the two special ones (** for exponents and % for remainders), and the order Python does math in.",
    sections: [
      { h: "The Operators", f: "Section 1", story: "Python does math the way a calculator does, with a few extras. Try each operator on the numbers 17 and 5.",
        b: [["table", ["Operator", "Meaning", "17 and 5"], [["+", "add", "22"], ["-", "subtract", "12"], ["*", "multiply", "85"], ["/", "divide (always a decimal)", "3.4"], ["//", "divide and drop the remainder", "3"], ["%", "remainder (modulo)", "2"], ["**", "exponent (power)", "1419857"]]],
          ["py", { code: "a = 17\nb = 5\nprint(a + b, a - b, a * b)\nprint(a / b, a // b, a % b)\nprint(2 ** 3)", rows: 6 }],
          ["cards", [["Arithmetic operators (+, -, *, /)", "Add, subtract, multiply, divide."], ["Exponent operator (**)", "2 ** 3 means 2 to the power of 3, which is 8."], ["Modulo operator (%)", "The remainder after division. 17 % 5 is 2."], ["Order of operations", "Python follows PEMDAS: parentheses, exponents, then multiply and divide, then add and subtract."]]]] },
      { h: "Modulo: The Remainder", f: "Section 2", story: "% looks odd but is one of the most useful operators. It tells you what is left over, which makes it perfect for questions like is this number even.",
        b: [["gfx", "cells", { items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"], hi: [15, 16], lo: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], idx: false, w: 44, title: "17 items in groups of 5: 3 full groups (17 // 5 = 3), 2 left over (17 % 5 = 2)" }, "The highlighted cells are the remainder."],
          ["slider", { label: "n", min: 1, max: 30, step: 1, val: 17, f: function (n) { return "<b>" + n + " // 5 = " + Math.floor(n / 5) + "</b> groups of 5<br><b>" + n + " % 5 = " + (n % 5) + "</b> left over<br>" + n + " % 2 = " + (n % 2) + (n % 2 === 0 ? " &rarr; even" : " &rarr; odd"); } }],
          ["predict", { code: "print(20 % 6)", q: "What does this print?", opts: ["3", "2", "3.33", "14"], ans: 1, why: "6 goes into 20 three times (18), leaving 2." }]] },
      { h: "Order of Operations", f: "Section 3", story: "Python multiplies before it adds, just like math class. Use parentheses when you want a different order.",
        b: [["py", { code: "print(2 + 3 * 4)\nprint((2 + 3) * 4)", presets: [["Parentheses", "print(2 + 3 * 4)\nprint((2 + 3) * 4)"], ["Average, wrong", "a = 80\nb = 90\nc = 100\nprint(a + b + c / 3)"], ["Average, right", "a = 80\nb = 90\nc = 100\nprint((a + b + c) / 3)"]] }],
          ["predict", { q: "What does print(10 - 4 / 2) show?", opts: ["3.0", "8.0", "3", "5.0"], ans: 1, why: "Division first: 4 / 2 is 2.0. Then 10 - 2.0 is 8.0." }]] }
    ],
    quiz: [["What is 7 // 2?", ["3.5", "3", "4", "1"], 1, "// drops the remainder."], ["What is 7 % 2?", ["3", "3.5", "1", "0"], 2, "Seven divided by two leaves 1."], ["What is 2 ** 4?", ["8", "6", "16", "24"], 2, "2 to the power of 4."], ["Which expression tests if n is even?", ["n / 2 == 0", "n % 2 == 0", "n ** 2 == 0", "n // 2 == 0"], 1, "An even number leaves no remainder when divided by 2."]],
    end: ["Math in Python is the math you know, plus % and **.", "% in particular will come back in loops, games, and clocks."]
  };

  D["8.5"] = {
    id: "8.5", title: "String Operators", lessonFile: fileOf(5, "string-operators"), codehs: "CodeHS 2.5", tags: ["Python", "Strings"],
    deck: "How + joins strings together, why mixing a string with a number causes a type mismatch, and how * repeats text.",
    sections: [
      { h: "+ Joins Strings", f: "Section 1", story: "The + operator does two different jobs depending on what is on either side. Between numbers it adds. Between strings it joins them end to end, which is called concatenation.",
        b: [["gfx", "compare", { left: { title: "Numbers", items: ["3 + 4", "=  7", "+ adds the values"] }, right: { title: "Strings", items: ["\"3\" + \"4\"", "=  \"34\"", "+ joins the text"] } }, "Same operator, different job."],
          ["py", { code: "first = \"Ada\"\nlast = \"Lovelace\"\nprint(first + last)\nprint(first + \" \" + last)", presets: [["No space", "first = \"Ada\"\nlast = \"Lovelace\"\nprint(first + last)"], ["With a space", "first = \"Ada\"\nlast = \"Lovelace\"\nprint(first + \" \" + last)"], ["Digits as text", "print(\"3\" + \"4\")\nprint(3 + 4)"]] }],
          ["cards", [["String concatenation", "Joining two strings end to end with +. Python adds nothing between them, so add your own spaces."]]]] },
      { h: "Type Mismatch", f: "Section 2", story: "Python won't guess whether you meant to add or join. Put a string and a number on either side of + and you get an error. Convert the number with str(), or give print() separate items.",
        b: [["py", { code: "age = 15\nprint(\"Age: \" + age)", presets: [["The error", "age = 15\nprint(\"Age: \" + age)"], ["Fix 1: str()", "age = 15\nprint(\"Age: \" + str(age))"], ["Fix 2: commas", "age = 15\nprint(\"Age:\", age)"]] }],
          ["table", ["Fix", "Code", "Notes"], [["Convert", "\"Age: \" + str(age)", "You control the spacing"], ["Separate items", "print(\"Age:\", age)", "print adds a space for you"], ["f-string", "f\"Age: {age}\"", "Often the cleanest"]]],
          ["cards", [["Type mismatch", "Using values of the wrong types together, like adding a string and an int. Python raises a TypeError."]]]] },
      { h: "Repeat with *", f: "Section 3", story: "A string times a whole number repeats the string. It is a quick way to draw lines and borders.",
        b: [["py", { code: "print(\"ha\" * 3)\nprint(\"-\" * 20)", presets: [["Laugh", "print(\"ha\" * 3)"], ["Border", "print(\"=\" * 20)\nprint(\"  MENU\")\nprint(\"=\" * 20)"], ["Digits", "print(\"5\" * 3)\nprint(5 * 3)"]] }],
          ["order", { q: "Put these lines in a working order.", lines: ["name = input(\"Name? \")", "greeting = \"Hello, \" + name", "print(greeting)"], why: "name has to exist before it is joined into greeting.", hint: "Create a value before you use it." }]] }
    ],
    quiz: [["What is \"Ada\" + \"Lovelace\"?", ["Ada Lovelace", "AdaLovelace", "Error", "Ada+Lovelace"], 1, "No space is added automatically."], ["What causes a TypeError here: \"Score: \" + 10 ?", ["Missing quotes", "Adding a string and an int", "Too many spaces", "Nothing, it works"], 1, "Strings and ints can't be joined with +."], ["How do you fix it?", ["\"Score: \" + str(10)", "\"Score: \" + 10.0", "\"Score: \" - 10", "Remove the quotes"], 0, "str() converts the number to text."], ["What is \"-\" * 5?", ["-5", "-----", "5", "Error"], 1, "Repeat the string five times."]],
    end: ["+ joins text. * repeats it.", "And mixing text with numbers is the most common beginner error in Python."]
  };

  D["8.6"] = {
    id: "8.6", title: "Comments", lessonFile: fileOf(6, "comments"), codehs: "CodeHS 2.6", tags: ["Python", "Readability"],
    deck: "Comments again, now in programs that print, calculate, and ask questions. Why the reason behind a line matters more than a restatement of it.",
    sections: [
      { h: "Same # Everywhere", f: "Section 1", story: "You first saw comments in Tracy's world. The idea hasn't changed: a # starts a note the computer ignores. They matter most on lines where the reason isn't obvious.",
        b: [["code", "py", "# convert minutes to hours\nhours = minutes / 60\n\nprice = 9.99   # includes tax\nprint(price)\n\n# print(\"debugging line\")   <- switched off"],
          ["gfx", "compare", { left: { title: "Worth writing", items: ["# divide by 60: minutes to hours", "# tax is already included", "# skip blank names so we don't crash"] }, right: { title: "Not worth writing", items: ["# set x to 5", "# print the result", "# this is a variable"] } }, "A good comment answers why. The code already says what."],
          ["cards", [["Comment (review)", "Text in your code the computer ignores. In Python it starts with #."]]]] },
      { h: "Comments Don't Run", f: "Try it", story: "Anything after a # on the same line is ignored. Put a # in front of a whole line to switch it off without deleting it.",
        b: [["py", { code: "print(\"one\")\n# print(\"two\")\nprint(\"three\")   # this part is ignored", presets: [["Switched off", "print(\"one\")\n# print(\"two\")\nprint(\"three\")   # this part is ignored"], ["All on", "print(\"one\")\nprint(\"two\")\nprint(\"three\")"], ["Calculation", "# average of three scores\na = 80\nb = 90\nc = 100\nprint((a + b + c) / 3)"]] }],
          ["predict", { code: "print(\"a\")\n# print(\"b\")\nprint(\"c\")", q: "What does this print?", opts: ["a b c", "a c", "b", "a"], ans: 1, why: "The middle line is a comment, so it never runs." }]] },
      { h: "Which Comment Helps?", f: "Check yourself", story: "Read a line, then pick the comment a teammate would actually want to see above it.",
        b: [["predict", { code: "area = 3.14159 * r ** 2", q: "Best comment for this line?", opts: ["# area", "# this is math", "# area of a circle: pi times radius squared", "# line 7"], ans: 2, why: "It tells the reader the formula behind the code." }],
          ["predict", { code: "if age % 4 == 0:", q: "Best comment for this line?", opts: ["# check age", "# every 4th birthday: show a bonus", "# if statement", "# 0"], ans: 1, why: "It explains the purpose, not just the syntax." }]] }
    ],
    quiz: [["Which symbol starts a comment?", ["#", "//", "/*", "--"], 0, "Python comments start with #."], ["What does Python do with a comment?", ["Runs it", "Ignores it", "Prints it", "Warns you"], 1, "Comments are for humans."], ["What makes a comment useful?", ["It repeats the code", "It explains why", "It is very long", "It is uppercase"], 1, "The code shows what, the comment shows why."], ["How do you turn off a line without deleting it?", ["Add # in front", "Add quotes", "Add a space", "Add a semicolon"], 0, "That is called commenting it out."]],
    end: ["Comment the why.", "Future you will thank present you."]
  };

  D["8.7"] = {
    id: "8.7", title: "Basic Python and Console Interaction Quiz", lessonFile: fileOf(7, "basic-python-and-console-interaction-quiz"), codehs: "CodeHS 2.7", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: print(), variables and types, input(), math operators, and string operators, plus practice at spotting the bug.",
    sections: [
      { h: "The Whole Module on One Page", f: "Review", story: "Six lessons, one idea at a time. Click each card to check what you remember before you take the quiz.",
        b: [["gfx", "flow", { steps: ["print()|show output", "variables|store values", "input()|get text", "convert|int / float / str", "operators|math and strings"], perRow: 5 }, "Most programs in this module follow that path from left to right."],
          ["cards", [["print()", "Shows text or values. Text needs quotes."], ["Variables and types", "str, int, float. Python picks the type."], ["input()", "Always returns a string."], ["int() / float() / str()", "Convert between types."], ["Math operators", "+ - * / // % ** with PEMDAS order."], ["String operators", "+ joins, * repeats. Mixing str and int is a TypeError."], ["Comments", "# starts a note the computer ignores."]]]] },
      { h: "Spot the Bug", f: "Practice", story: "Each program below has one bug. Predict what happens before you run it.",
        b: [["predict", { code: "age = input(\"Age? \")   # person types 15\nprint(age + 1)", q: "What is the bug?", opts: ["print needs quotes", "input() returns a string, so age + 1 mixes str and int", "Age should be capitalized", "There is no bug"], ans: 1, why: "Convert first: age = int(input(\"Age? \"))." }],
          ["predict", { code: "print(\"Total: \" + 5 + 3)", q: "What happens?", opts: ["Total: 8", "Total: 53", "A TypeError", "Total: 5 3"], ans: 2, why: "A string and an int can't be joined with +. You would need str(5)." }],
          ["predict", { code: "print(7 / 2)", q: "What does this print?", opts: ["3", "3.5", "4", "3.0"], ans: 1, why: "/ always gives a decimal. // would give 3." }],
          ["py", { code: "name = input(\"Name? \")\nage = int(input(\"Age? \"))\nprint(\"Hi \" + name + \", next year you will be \" + str(age + 1))", inputs: "Ada\n15", note: "Run it, then try breaking it on purpose: remove the str() or the int()." }]] },
      { h: "Match the Result", f: "Practice", story: "Pair each expression with what Python gives back.",
        b: [["match", [["7 // 2", "3"], ["7 % 2", "1"], ["7 / 2", "3.5"], ["2 ** 3", "8"], ["\"ab\" * 2", "\"abab\""], ["\"a\" + \"b\"", "\"ab\""]]]] }
    ],
    quiz: [["input() returns...", ["An int", "A float", "A string", "A boolean"], 2, "Always a string."], ["Which line causes a TypeError?", ["print(\"a\" + \"b\")", "print(\"a\" * 3)", "print(\"a\" + 3)", "print(3 + 3)"], 2, "A string and an int can't be added."], ["What is 9 % 4?", ["2", "1", "2.25", "0"], 1, "9 leaves 1 when divided by 4."], ["Which is the correct way to get a whole number from the user?", ["input(int)", "int(input())", "input() + 0", "number(input())"], 1, "Wrap input() in int()."], ["Which comment is most useful?", ["# x", "# increase score because the player found a coin", "# add 1", "# code"], 1, "It says why."]],
    end: ["That is the whole module.", "Take the quiz, then keep these tools handy. Conditionals come next."]
  };
})();
