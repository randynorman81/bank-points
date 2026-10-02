/* Notes content for Unit 12: Functions and Exceptions (CodeHS Unit 6). Rendered by ../notes-engine.js */
(function () {
  var D = (window.NOTES_DATA = window.NOTES_DATA || {});
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", soft: "#8B9AAE", ink: "#EAEFF6", bg: "#151A24" };
  function fileOf(k, name) { return "12-" + k + "-" + name + ".html"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 12) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function machine(inp, fn, out) {
    var o = '<defs><marker id="am" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#8B9AAE" stroke-width="1.8"/></marker></defs>';
    o += '<line x1="30" y1="70" x2="180" y2="70" stroke="#8B9AAE" stroke-width="2.5" marker-end="url(#am)"/>' + t(105, 56, inp, 13, C.amb, "middle");
    o += '<rect x="185" y="30" width="190" height="80" rx="12" fill="' + C.bg + '" stroke="' + C.acc + '" stroke-width="3"/>' + t(280, 78, fn, 16, C.ink, "middle");
    o += '<line x1="380" y1="70" x2="530" y2="70" stroke="#8B9AAE" stroke-width="2.5" marker-end="url(#am)"/>' + t(455, 56, out, 13, C.amb, "middle");
    return '<svg viewBox="0 0 560 140" role="img" aria-label="function as a machine">' + o + "</svg>";
  }

  D["12.1"] = {
    id: "12.1", title: "Functions", lessonFile: fileOf(1, "functions"), codehs: "CodeHS 6.1", tags: ["Python", "def"],
    deck: "How to define a function, how to call it, and why breaking a program into named pieces makes it easier to read, fix, and reuse.",
    sections: [
      { h: "A Named Piece of Code", f: "Section 1", story: "A function is a group of lines with a name. You define it once with def, then call it by name whenever you want those lines to run. Define it once, use it as many times as you like.",
        b: [["svg", machine("(call it)", "say_hello()", "prints a greeting"), "You write the function once. Every call runs the same lines."],
          ["py", { code: "def say_hello():\n    print(\"Hello!\")\n    print(\"Welcome to class.\")\n\nsay_hello()\nsay_hello()", presets: [["Define and call", "def say_hello():\n    print(\"Hello!\")\n    print(\"Welcome to class.\")\n\nsay_hello()\nsay_hello()"], ["Defined but never called", "def say_hello():\n    print(\"Hello!\")"], ["Called too early", "say_hello()\n\ndef say_hello():\n    print(\"Hello!\")"]], note: "Defining a function does not run it. Only calling it does." }],
          ["cards", [["Function", "A named block of code that you can run whenever you need it."], ["def", "The keyword that starts a function definition."], ["Call", "Using the function's name with parentheses to run it."]]]] },
      { h: "Follow the Call", f: "Section 2", story: "When Python reaches a call, it jumps into the function, runs it, then jumps back to the line after the call. Step through to see the order.",
        b: [["trace", { code: ["def greet():", "    print(\"Hi\")", "    print(\"There\")", "", "print(\"Start\")", "greet()", "print(\"End\")"], steps: [[0, {}, "", "Python reads the def and remembers greet. It does not run it yet."], [4, {}, "Start", "The program really begins here."], [5, {}, "", "greet() is called, so Python jumps to the definition."], [1, {}, "Hi", "Run the first line of the function."], [2, {}, "There", "Run the second line."], [6, {}, "End", "The function is done, so Python returns to the line after the call."]] }],
          ["order", { q: "Put the program in an order that prints Hello and then Done.", lines: ["def hello():", "    print(\"Hello\")", "hello()", "print(\"Done\")"], why: "Define first, then call, then continue.", hint: "A function has to be defined before you call it." }]] },
      { h: "Why Functions?", f: "Section 3", story: "Functions let you avoid repeating yourself and give a chunk of code a name that explains what it does. If a bug appears, you fix it in one place.",
        b: [["gfx", "compare", { left: { title: "Without functions", items: ["Same lines copied 3 times", "A fix means 3 edits", "Hard to see the big picture"] }, right: { title: "With functions", items: ["Write once, call 3 times", "A fix means 1 edit", "Names describe the steps"] } }, "Functions are about reuse and readability."],
          ["predict", { code: "def beep():\n    print(\"beep\")\n\nbeep()\nbeep()\nbeep()", q: "How many times does beep print?", opts: ["1", "3", "0", "4"], ans: 1, why: "The function runs once for each call, and there are three calls." }]] }
    ],
    quiz: [["What keyword starts a function definition?", ["func", "def", "function", "make"], 1, "def."], ["Does defining a function run it?", ["Yes", "No, you must call it", "Only the first time", "Only in loops"], 1, "Defining just stores it."], ["How do you call a function named go?", ["go", "call go", "go()", "def go"], 2, "Name plus parentheses."], ["A main benefit of functions is...", ["Reuse and readability", "Faster hardware", "More memory", "Prettier output"], 0, "Write once, use often."]],
    end: ["Define once. Call whenever.", "From here on, most of your programs will be built from small functions."]
  };

  D["12.2"] = {
    id: "12.2", title: "Functions and Parameters", lessonFile: fileOf(2, "functions-and-parameters"), codehs: "CodeHS 6.2", tags: ["Python", "Parameters"],
    deck: "How parameters let one function work with different values, the difference between a parameter and an argument, and default values.",
    sections: [
      { h: "Give a Function Inputs", f: "Section 1", story: "A function that always does exactly the same thing is limited. Parameters are variables in the definition that receive values when you call the function. The values you pass in are called arguments.",
        b: [["svg", machine("\"Ada\"  (argument)", "greet(name)", "Hello, Ada"), "The argument goes in, the parameter name receives it."],
          ["py", { code: "def greet(name):\n    print(\"Hello, \" + name)\n\ngreet(\"Ada\")\ngreet(\"Grace\")", presets: [["One parameter", "def greet(name):\n    print(\"Hello, \" + name)\n\ngreet(\"Ada\")\ngreet(\"Grace\")"], ["Two parameters", "def add(a, b):\n    print(a + b)\n\nadd(2, 3)\nadd(10, 25)"], ["Missing argument", "def greet(name):\n    print(\"Hello, \" + name)\n\ngreet()"], ["Order matters", "def subtract(a, b):\n    print(a - b)\n\nsubtract(10, 3)\nsubtract(3, 10)"]] }],
          ["cards", [["Parameter", "A variable in the function definition that receives a value."], ["Argument", "The actual value you pass when you call the function."]]]] },
      { h: "Default Values", f: "Section 2", story: "You can give a parameter a default so the caller can leave it out. A value you pass in replaces the default.",
        b: [["py", { code: "def power(base, exponent=2):\n    print(base ** exponent)\n\npower(5)\npower(5, 3)", presets: [["Default exponent", "def power(base, exponent=2):\n    print(base ** exponent)\n\npower(5)\npower(5, 3)"], ["Greeting", "def greet(name, greeting=\"Hello\"):\n    print(greeting + \", \" + name)\n\ngreet(\"Ada\")\ngreet(\"Ada\", \"Welcome\")"]] }],
          ["predict", { code: "def area(width, height):\n    print(width * height)\n\narea(3, 4)", q: "What prints?", opts: ["7", "12", "34", "Error"], ans: 1, why: "width is 3 and height is 4, in the order they are passed. 3 times 4 is 12." }],
          ["match", [["def greet(name):", "name is a parameter"], ["greet(\"Ada\")", "\"Ada\" is an argument"], ["def f(x, y=10):", "y has a default value"], ["f(1, 2)", "2 replaces the default"]]]] }
    ],
    quiz: [["What is a parameter?", ["A value you pass in", "A variable in the definition that receives a value", "A kind of loop", "A comment"], 1, "It receives the argument."], ["In greet(\"Ada\"), what is \"Ada\"?", ["Parameter", "Argument", "Function", "Return value"], 1, "The value passed in."], ["What happens if you call a function without a required argument?", ["It uses 0", "A TypeError", "It prints nothing", "It guesses"], 1, "Missing arguments are an error."], ["What does a default value do?", ["Replaces every argument", "Is used when no argument is given", "Stops the function", "Prints"], 1, "It fills in for a missing argument."]],
    end: ["Parameters make one function do many jobs.", "Pass the values in, and the same code adapts."]
  };

  D["12.3"] = {
    id: "12.3", title: "Namespaces in Functions", lessonFile: fileOf(3, "namespaces-in-functions"), codehs: "CodeHS 6.3", tags: ["Python", "Scope"],
    deck: "Where a variable exists: local variables live only inside their function, global variables are visible everywhere, and what happens when names collide.",
    sections: [
      { h: "Where Does a Variable Live?", f: "Section 1", story: "A variable made inside a function is local. It is created when the function runs and disappears when the function ends. A variable made outside any function is global. Each function gets its own private workspace, called its namespace.",
        b: [["gfx", "nest", { outer: { title: "Global namespace", sub: "visible everywhere" }, inner: [{ title: "double()", items: ["n = 5", "result = 10"] }, { title: "greet()", items: ["name = \"Ada\""] }] }, "The variables inside double() and greet() are not visible outside them."],
          ["py", { code: "def double():\n    result = 10\n    print(result)\n\ndouble()\nprint(result)", presets: [["Local is hidden", "def double():\n    result = 10\n    print(result)\n\ndouble()\nprint(result)"], ["Global is visible", "limit = 100\n\ndef show():\n    print(limit)\n\nshow()"], ["Same name, different place", "x = 1\n\ndef change():\n    x = 99\n    print(\"inside:\", x)\n\nchange()\nprint(\"outside:\", x)"]] }],
          ["cards", [["Local variable", "Created inside a function and only usable there."], ["Global variable", "Created outside every function and visible everywhere."], ["Namespace", "The space where a set of names exists, such as the global one or one function's own."]]]] },
      { h: "Changing a Global", f: "Section 2", story: "Assigning to a name inside a function creates a new local variable, even if a global has the same name. To change the global one, say global first. Most of the time it is cleaner to pass values in and return them out.",
        b: [["py", { code: "score = 0\n\ndef add_point():\n    global score\n    score = score + 1\n\nadd_point()\nadd_point()\nprint(score)", presets: [["With global", "score = 0\n\ndef add_point():\n    global score\n    score = score + 1\n\nadd_point()\nadd_point()\nprint(score)"], ["Without global (still 0)", "score = 0\n\ndef add_point():\n    score = 1\n\nadd_point()\nprint(score)"]] }],
          ["predict", { code: "x = 5\n\ndef f():\n    x = 10\n\nf()\nprint(x)", q: "What prints?", opts: ["5", "10", "15", "Error"], ans: 0, why: "The x inside f is a separate local variable. The global x is untouched." }]] }
    ],
    quiz: [["A variable created inside a function is...", ["Global", "Local", "Constant", "A parameter"], 1, "Local to that function."], ["Can code outside a function use its local variables?", ["Yes", "No, you get a NameError", "Only with print", "Only in loops"], 1, "They don't exist outside."], ["What does the global keyword do?", ["Makes a variable constant", "Lets a function change a global variable", "Deletes a variable", "Hides a variable"], 1, "It points the name at the global one."], ["x = 1 outside, then x = 2 inside a function with no global. What is the global x after the call?", ["1", "2", "0", "Error"], 0, "The inner x is a separate local."]],
    end: ["Local stays local.", "Fewer globals means fewer surprises."]
  };

  D["12.4"] = {
    id: "12.4", title: "Functions and Return Values", lessonFile: fileOf(4, "functions-and-return-values"), codehs: "CodeHS 6.4", tags: ["Python", "return"],
    deck: "How a function hands a value back with return, the difference between returning and printing, and how to chain functions together.",
    sections: [
      { h: "Hand a Value Back", f: "Section 1", story: "print() shows something on screen, but the program can't use what was shown. return sends a value back to the line that called the function, so you can store it, compare it, or pass it to another function.",
        b: [["svg", machine("(3, 4)", "add(a, b)", "returns 7"), "A function can give a value back to its caller."],
          ["py", { code: "def add(a, b):\n    return a + b\n\nanswer = add(3, 4)\nprint(answer)\nprint(add(10, 5) * 2)", presets: [["return", "def add(a, b):\n    return a + b\n\nanswer = add(3, 4)\nprint(answer)\nprint(add(10, 5) * 2)"], ["print instead of return", "def add(a, b):\n    print(a + b)\n\nanswer = add(3, 4)\nprint(answer)"], ["Return ends the function", "def check(n):\n    return n * 2\n    print(\"never runs\")\n\nprint(check(4))"]], note: "The second preset prints 7 and then None: print does not give a value back." }],
          ["cards", [["return", "Sends a value back to the caller and ends the function."], ["Return value", "The value a function hands back."], ["None", "What a function gives back when it has no return statement."]]]] },
      { h: "Chaining Functions", f: "Section 2", story: "Because a function can return a value, you can use a call anywhere a value goes, including as another call's argument. Small functions combine into bigger ones.",
        b: [["py", { code: "def double(n):\n    return n * 2\n\ndef add_one(n):\n    return n + 1\n\nprint(add_one(double(5)))\nprint(double(add_one(5)))", presets: [["Order of calls", "def double(n):\n    return n * 2\n\ndef add_one(n):\n    return n + 1\n\nprint(add_one(double(5)))\nprint(double(add_one(5)))"], ["Is it even?", "def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(4))\nprint(is_even(7))"], ["Area", "def area(w, h):\n    return w * h\n\nprint(area(3, 4) + area(2, 5))"]] }],
          ["predict", { code: "def square(n):\n    return n * n\n\nprint(square(square(2)))", q: "What prints?", opts: ["4", "8", "16", "Error"], ans: 2, why: "square(2) is 4, and square(4) is 16." }],
          ["order", { q: "Put these lines in an order that prints 12.", lines: ["def triple(n):", "    return n * 3", "result = triple(4)", "print(result)"], why: "Define, call and store the returned value, then print it.", hint: "You need the return value before you can print it." }]] }
    ],
    quiz: [["What does return do?", ["Prints a value", "Sends a value back to the caller", "Repeats the function", "Deletes the function"], 1, "It hands back a value."], ["What does a function with no return give back?", ["0", "An error", "None", "An empty string"], 2, "None."], ["What is add_one(double(3))?", ["6", "7", "8", "9"], 1, "double(3) is 6, then add 1 is 7."], ["Code after a return statement in the same block...", ["Runs normally", "Never runs", "Runs twice", "Causes an error"], 1, "return ends the function."]],
    end: ["print shows. return gives back.", "Returning values is what lets small functions build bigger programs."]
  };

  D["12.5"] = {
    id: "12.5", title: "Exceptions", lessonFile: fileOf(5, "exceptions"), codehs: "CodeHS 6.5", tags: ["Python", "try / except"],
    deck: "What happens when a program hits an error, and how try and except let it handle the problem and keep running.",
    sections: [
      { h: "When Things Go Wrong", f: "Section 1", story: "Some errors only show up while a program runs: dividing by zero, or converting text that is not a number. These are exceptions. Left alone, an exception stops the program. With try and except you can catch it and respond.",
        b: [["gfx", "flow", { steps: ["try:|run risky code", "Error?|an exception is raised", "except:|handle it", "continue|program keeps going"], perRow: 4, colors: ["#5FD8DF", "#FCA5A5", "#FDD877", "#34D399"] }, "If no error happens, the except block is skipped."],
          ["py", { code: "print(10 / 0)", presets: [["Crash", "print(10 / 0)"], ["Caught", "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print(\"Can't divide by zero\")\nprint(\"Still running\")"], ["No error", "try:\n    print(10 / 2)\nexcept ZeroDivisionError:\n    print(\"Can't divide by zero\")"]] }],
          ["cards", [["Exception", "An error that happens while the program runs."], ["try / except", "Run risky code in try. If it raises an exception, run the except block instead of crashing."]]]] },
      { h: "Handling Bad Input", f: "Try it", story: "Programs that ask people for input are especially prone to exceptions. Type a number, or type something else, and see how the program responds.",
        b: [["py", { code: "try:\n    age = int(input(\"Age? \"))\n    print(\"Next year:\", age + 1)\nexcept ValueError:\n    print(\"Please type a number\")", inputs: "15", presets: [["A number", "try:\n    age = int(input(\"Age? \"))\n    print(\"Next year:\", age + 1)\nexcept ValueError:\n    print(\"Please type a number\")", "15"], ["Not a number", "try:\n    age = int(input(\"Age? \"))\n    print(\"Next year:\", age + 1)\nexcept ValueError:\n    print(\"Please type a number\")", "fifteen"], ["Without try", "age = int(input(\"Age? \"))\nprint(age + 1)", "fifteen"], ["See the message", "try:\n    x = int(\"abc\")\nexcept ValueError as e:\n    print(\"Problem:\", e)"]] }],
          ["table", ["Exception", "Typical cause"], [["ZeroDivisionError", "Dividing by zero"], ["ValueError", "A value of the right type but wrong content, like int(\"abc\")"], ["TypeError", "Wrong type, like \"a\" + 1"], ["IndexError", "List index out of range"], ["NameError", "Using a name that doesn't exist"]]],
          ["predict", { code: "try:\n    print(\"A\")\n    print(5 / 0)\n    print(\"B\")\nexcept ZeroDivisionError:\n    print(\"C\")", q: "What prints, in order?", opts: ["A B C", "A C", "A B", "C"], ans: 1, why: "A prints, then the division raises an exception. Python skips B and runs the except block, which prints C." }]] }
    ],
    quiz: [["What does try/except do?", ["Repeats code", "Catches an exception so the program can continue", "Speeds up code", "Defines a function"], 1, "It handles errors."], ["Which exception does int(\"abc\") raise?", ["TypeError", "ZeroDivisionError", "ValueError", "NameError"], 2, "ValueError."], ["What happens to code inside try after the line that raised?", ["It still runs", "It is skipped", "It repeats", "It runs twice"], 1, "Python jumps to except."], ["When does the except block run?", ["Always", "Only if an exception was raised", "Never", "Before try"], 1, "Only on an error."]],
    end: ["Expect things to go wrong.", "try and except let your program respond instead of crashing."]
  };

  D["12.6"] = {
    id: "12.6", title: "Functions Quiz", lessonFile: fileOf(6, "functions-quiz"), codehs: "CodeHS 6.6", tags: ["Python", "Review"],
    deck: "A review of the whole module before the quiz: defining and calling functions, parameters, scope, return values, and exceptions.",
    sections: [
      { h: "The Module on One Page", f: "Review", story: "Flip each card and say the answer first.",
        b: [["svg", machine("arguments", "name(params)", "return value"), "Arguments in, a return value out."],
          ["cards", [["def and call", "Define once, call by name with parentheses."], ["Parameters and arguments", "Parameters receive the values passed as arguments."], ["Local and global", "Locals live inside a function. Globals are visible everywhere."], ["return", "Hands a value back to the caller. print only displays."], ["None", "What a function returns if it has no return."], ["try / except", "Catch an exception and keep the program going."]]]] },
      { h: "Practice", f: "Check yourself", story: "Predict first, then run.",
        b: [["predict", { code: "def f(x):\n    return x + 1\n\nprint(f(f(3)))", q: "What prints?", opts: ["4", "5", "6", "Error"], ans: 1, why: "f(3) is 4, then f(4) is 5." }],
          ["predict", { code: "def show(x):\n    print(x)\n\nresult = show(5)\nprint(result)", q: "What prints?", opts: ["5 then 5", "5 then None", "None then 5", "Error"], ans: 1, why: "show prints 5 but returns nothing, so result is None." }],
          ["match", [["return", "Hand a value back"], ["def", "Start a definition"], ["global", "Change a global from inside a function"], ["except", "Handle an exception"], ["default value", "Used if no argument is passed"]]],
          ["py", { code: "def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return \"can't divide by zero\"\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))", note: "Change the numbers and run it." }]] }
    ],
    quiz: [["Which keyword hands a value back?", ["print", "return", "give", "yield"], 1, "return."], ["Where is a parameter's value set?", ["In the definition", "When the function is called", "In a comment", "Never"], 1, "By the argument."], ["What does a function without return give?", ["0", "None", "An error", "A blank"], 1, "None."], ["Which exception is raised by 5 / 0?", ["ValueError", "TypeError", "ZeroDivisionError", "NameError"], 2, "ZeroDivisionError."], ["A variable defined inside a function is visible...", ["Everywhere", "Only inside that function", "Only in loops", "Nowhere"], 1, "Local scope."]],
    end: ["That is the whole module.", "Next: Program Control with Arduino, where these ideas drive real sensors and motors."]
  };
})();
