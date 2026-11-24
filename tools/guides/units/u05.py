from lesson import *

UNIT = Unit(5, "Functions and Parameters", "Name a block of code, hand it information, get answers back, and use libraries other people wrote.",
    "Big Idea 3: Algorithms and Programming", "#0D9488", "#0F766E", "#2DD4BF", "#CCFBF1", "code",
    ["Define a function and call it", "Use parameters and arguments, one or several", "Return a value and use what comes back", "Combine return with if statements and loops", "Use libraries, APIs, and documentation", "Explain how procedures make programs shorter and easier to change"],
    [
    L("5.1", "Define a function with `def`, give it a parameter, and call it with an argument.",
      [("function (procedure)", "a named block of code you can run whenever you want"), ("define", "write the function with `def`; this does NOT run it"), ("call", "run the function by writing its name with brackets"), ("parameter", "a variable in the `def` line that receives a value"), ("argument", "the actual value you pass in when you call")],
      [("Define it, then call it", """A **function** is a block of code with a name. You **define** it once with `def`, and then you **call** it whenever you need it. The exam calls a function a **procedure**.

```
def say_hello():
    print("Hello!")

say_hello()
say_hello()
```
Defining does **nothing** by itself. The code inside only runs when you call the function. This one prints Hello! twice because it is called twice."""),
       ("Give it a parameter", """A **parameter** lets a function work with different information each time. It is a variable name inside the brackets of the `def` line. When you call the function you pass an **argument**: the real value that goes into the parameter.

```
def greet(name):
    print("Hello,", name)

greet("Ana")
```
Here `name` is the **parameter** and `"Ana"` is the **argument**. While the function runs, `name` holds `"Ana"`."""),
       ("Parameter or argument?", """They are two ends of the same pipe. The **parameter** is the name in the `def` line. The **argument** is the value in the call. People mix the words up, but the exam expects you to know the difference."""),
       ("Where does the program jump?", """When Python reaches a call, it **jumps** into the function, runs its lines from top to bottom, and then **jumps back** to the line right after the call. The parameter only exists while the function runs."""),
       ("Arguments can be anything", """An argument can be a number, a string, or a variable: `greet("Ana")`, `double(5)`, `greet(player)`. The exam writes `PROCEDURE greet(name) { ... }` and calls it with `greet("Ana")`."""),
      ],
      [A("Define, then call", 'def greet(name):\n    print("Hello,", name)\n\ngreet("Ana")\ngreet("Ben")',
         [(0, "greet", "DEFINE: names the function. Nothing runs yet."), (0, "name", "The PARAMETER."), (3, '"Ana"', "The ARGUMENT: goes into name."), (4, '"Ben"', "A different argument, a different greeting.")], out="Hello, Ana\nHello, Ben", cap="Define once, call as many times as you like."),
       A("A parameter in math", 'def double(n):\n    print(n * 2)\n\ndouble(4)\ndouble(10)',
         [(0, "n", "Receives each argument."), (1, "n * 2", "Uses the parameter like any variable.")], out="8\n20", cap="Each call runs the same code with a new value."),
       A("A variable as the argument", 'def show(item):\n    print("Item:", item)\n\nthing = "lamp"\nshow(thing)',
         [(4, "show(thing)", "The value of thing, \"lamp\", is passed in.")], out="Item: lamp", cap="You can pass a variable. Python passes its value.")],
      [T("Two calls", 'def greet(name):\n    print("Hello,", name)\n\ngreet("Ana")\ngreet("Ben")', ['1|', '4|', '2| name="Ana"', '5| name=-', '2| name="Ben"'], out="Hello, Ana\nHello, Ben", cap="Line 1 only defines greet. Line 4 jumps into the function with name = \"Ana\". After it finishes, line 5 jumps in again with a new name."),
       T("A parameter in math", 'def double(n):\n    print(n * 2)\n\ndouble(4)\ndouble(10)', ['1|', '4|', '2| n=4', '5| n=-', '2| n=10'], out="8\n20", cap="n is 4 on the first call and 10 on the second. n does not exist between the calls."),
       T("A variable as the argument", 'def show(item):\n    print("Item:", item)\n\nthing = "lamp"\nshow(thing)', ['1|', '4| thing="lamp"', '5|', '2| item="lamp"'], out="Item: lamp", cap="show(thing) passes the value of thing, so item holds \"lamp\"."),
       T("Nothing prints without a call", 'def say():\n    print("Hi")\n\nprint("Start")', ['1|', '4|'], out="Start", cap="The def only defines say. It is never called, so Hi never prints.")],
      [("Defining but never calling", "Nothing happens.", "Add the call: `greet(\"Ana\")`"), ("`def greet(name)` with no colon", "SyntaxError.", "`def greet(name):`"), ("An unindented body", "IndentationError.", "Indent the function's lines"), ("Calling before defining", "NameError: Python has not seen the name yet.", "Define the function above the call"),
       ("`greet()` when it needs an argument", "TypeError: missing 1 required positional argument.", "`greet(\"Ana\")`"), ("`greet(\"Ana\", \"Ben\")` for one parameter", "TypeError: too many arguments.", "Match the count"), ("Using `name` outside the function", "NameError: the parameter only exists inside.", "Use it only in the function"), ("`print(\"name\")` inside the function", "Prints the word name, not the value.", "`print(name)`")],
      ["The exam calls a function a **procedure**, written `PROCEDURE name(parameter) { }`.", "A procedure is called by its name, `name(argument)`.", "Procedures make a program easier to read and to change because the code is written once and used many times."],
      [Q("What does defining a function do?", ["Runs it", "Names a block of code without running it", "Deletes it", "Prints it"], 1, "The code only runs when the function is called."),
       Q("In `def greet(name):`, what is `name`?", ["An argument", "A parameter", "A string", "A call"], 1, "It is the parameter: the variable in the def line."),
       Q("What does this print?", ["6", "3", "9", "an error"], 0, "The call passes 3 into `n`, so `n * 2` is 6.", 'def double(n):\n    print(n * 2)\n\ndouble(3)'),
       Q("What happens with `greet()` when `greet` needs one argument?", ["It prints nothing", "TypeError", "It uses 0", "It works"], 1, "A required argument is missing.")]),

    L("5.2", "Write functions with more than one parameter and call them with arguments in the right order.",
      [("two or more parameters", "separate them with commas in the `def` line"), ("argument order", "arguments go into the parameters in the order you write them"), ("positional argument", "an argument matched by its position")],
      [("Two parameters", """A function can take more than one parameter. Separate them with commas. When you call it, give the same **number** of arguments, in the same **order**.

```
def add(a, b):
    print(a + b)

add(2, 3)
```
`a` gets 2 and `b` gets 3, because the first argument goes into the first parameter."""),
       ("The order matters", """Swap the arguments and you may get a different answer. `subtract(10, 3)` is 7, but `subtract(3, 10)` is -7. A function that puts text together, like `contact(name, phone)`, gives a silly result if you pass the phone number first."""),
       ("Three parameters and the wrong count", """You can have as many parameters as you need. The exam always gives the exact number it needs. If you pass **too few or too many** arguments, Python stops with a **TypeError** that says how many it expected."""),
       ("Variables as arguments", """Each argument can be a number, a string, or a variable. `label(x, y)` passes the values of `x` and `y`. If you swap the variables in the call (`label(y, x)`), you swap the values the parameters receive."""),
      ],
      [A("Order matters", 'def subtract(a, b):\n    print(a - b)\n\nsubtract(10, 3)\nsubtract(3, 10)',
         [(0, "a, b", "Two parameters, in order."), (3, "10, 3", "a = 10, b = 3."), (4, "3, 10", "a = 3, b = 10.")], out="7\n-7", cap="Same function, swapped arguments, different answers."),
       A("Three parameters", 'def average(a, b, c):\n    print((a + b + c) / 3)\n\naverage(80, 90, 100)',
         [(0, "a, b, c", "Three parameters need three arguments."), (1, "(a + b + c) / 3", "Brackets first, then divide.")], out="90.0", cap="The count of arguments must match."),
       A("Mixed types", 'def contact(name, phone):\n    print(name + ": " + phone)\n\ncontact("Mom", "555-0100")',
         [(3, '"Mom"', "Goes into name."), (3, '"555-0100"', "Goes into phone.")], out="Mom: 555-0100", cap="Both arguments here are strings, so they can be joined.")],
      [T("Order of arguments", 'def subtract(a, b):\n    print(a - b)\n\nsubtract(10, 3)\nsubtract(3, 10)', ['1|', '4|', '2| a=10; b=3', '5| a=-; b=-', '2| a=3; b=10'], out="7\n-7", cap="The first argument always goes into the first parameter."),
       T("Triangle area", 'def triangle_area(base, height):\n    print(base * height / 2)\n\ntriangle_area(6, 4)\ntriangle_area(10, 3)', ['1|', '4|', '2| base=6; height=4', '5| base=-; height=-', '2| base=10; height=3'], out="12.0\n15.0", cap="6 * 4 / 2 is 12.0. 10 * 3 / 2 is 15.0."),
       T("A swapped call", 'def label(first, second):\n    print(first, "then", second)\n\nx = "A"\ny = "B"\nlabel(x, y)\nlabel(y, x)', ['1|', '4| x="A"', '5| y="B"', '6|', '2| first="A"; second="B"', '7| first=-; second=-', '2| first="B"; second="A"'], out="A then B\nB then A", cap="label(y, x) passes the values the other way around, so the output flips.")],
      [("`add(2)` for a two-parameter function", "TypeError: missing 1 required positional argument.", "`add(2, 3)`"), ("`add(2, 3, 4)`", "TypeError: too many arguments.", "Pass exactly the right number"), ("`contact(\"555-0100\", \"Mom\")`", "The values land in the wrong parameters.", "Match the argument order to the parameters"), ("`def add(a b):`", "A comma is needed between parameters.", "`def add(a, b):`"),
       ("`def add(a, a):`", "Two parameters cannot have the same name.", "Use different names"), ("Adding a string and a number: `contact(\"Mom\", 5550100)`", "TypeError on `+`.", "Pass a string or use `str()`"), ("Using `b` outside the function", "NameError.", "Parameters only exist inside"), ("Passing `a + b` when you meant two arguments", "That is one value.", "Separate with a comma")],
      ["The exam's procedures can have several parameters: `PROCEDURE name(a, b)`.", "The order of the arguments matters. Trace by matching each argument to a parameter.", "Calling with the wrong number of arguments is an error."],
      [Q("What is printed?", ["2", "-2", "8", "5"], 1, "a is 3 and b is 5, so `3 - 5` is -2.", 'def sub(a, b):\n    print(a - b)\n\nsub(3, 5)'),
       Q("Which call is correct for `def area(w, h):`?", ["`area(5)`", "`area(5, 3)`", "`area(5, 3, 2)`", "`area`"], 1, "Two parameters need two arguments."),
       Q("What does `average(60, 70, 80)` print?", ["70.0", "70", "210", "60.0"], 0, "(60 + 70 + 80) / 3 is 70.0.", 'def average(a, b, c):\n    print((a + b + c) / 3)'),
       Q("In `def f(x, y):`, which goes into `y` in `f(1, 2)`?", ["1", "2", "both", "neither"], 1, "Arguments match parameters by position.")]),

    L("5.3", "Return a value from a function and use what comes back.",
      [("`return`", "hands a value back to the line that called the function"), ("return value", "the value a function gives back"), ("`None`", "what a function gives back when it has no return"), ("Boolean function", "a function that returns True or False")],
      [("Printing is not returning", """Your functions so far **printed** their answers. `print` only shows something on the screen. A function can instead **return** a value: it hands the answer **back to the line that called it**, so the rest of the program can store it, calculate with it, or print it.

```
def double(number):
    return number * 2

result = double(4)
print(result)
```
`double(4)` is **replaced by the value it returns**, 8, and that 8 goes into `result`. Nothing is shown until you print it."""),
       ("Use a returned value in math", """Wherever a call appears, picture it replaced by the value it returns. So `double(3) + double(10)` becomes `6 + 20`. You can use a call in math, inside `print`, or anywhere a value fits."""),
       ("print versus return", """`show_double` **prints** and gives nothing back. `get_double` **returns** the value. A function with no `return` gives back **`None`**. If you store the result of a printing function, you store `None`."""),
       ("A call inside a call", """A returned value can be the argument of another call: `double(double(3))` works inside out. The inner call runs first and returns 6. Then `double(6)` returns 12."""),
       ("Return ends the function", """As soon as Python runs a `return`, the function **ends**. It goes straight back to the caller, and **any lines after the return are skipped**. The exam states this rule directly: `RETURN(expression)` ends the procedure."""),
       ("Return any type", """A function can return text, numbers, or booleans. `make_username("Ana", "Lopez")` can return `first[0] + last`, which is `"ALopez"`... or whatever you build."""),
      ],
      [A("Return and store", 'def double(number):\n    return number * 2\n\nresult = double(4)\nprint(result)',
         [(1, "return", "Hands the value back."), (3, "double(4)", "Replaced by the returned value, 8."), (3, "result", "The 8 is stored here.")], out="8", cap="return sends a value to the caller. print shows it."),
       A("print versus return", 'def show_double(n):\n    print(n * 2)\n\ndef get_double(n):\n    return n * 2\n\na = show_double(4)\nb = get_double(4)\nprint(a, b)',
         [(6, "show_double(4)", "Prints 8, returns nothing: a is None."), (7, "get_double(4)", "Returns 8: b is 8.")], out="8\nNone 8", cap="The first call prints immediately. The second gives back a value."),
       A("Return ends the function", 'def test():\n    return 1\n    print("never runs")\n\nprint(test())',
         [(1, "return 1", "The function ends here."), (2, "print", "Skipped.")], out="1", cap="Lines after a return never run.")],
      [T("Return and store", 'def double(number):\n    return number * 2\n\nresult = double(4)\nprint(result)', ['1|', '4|', '2| number=4', '4| result=8'], out="8", cap="The call jumps in with number = 4, returns 8, and the 8 is stored in result."),
       T("A call inside math", 'def double(n):\n    return n * 2\n\ntotal = double(3) + double(10)', ['1|', '4|', '2| n=3', '2| n=10', '4| total=26'], cap="double(3) returns 6 and double(10) returns 20. Then 6 + 20 is stored in total."),
       T("print versus return", 'def show_double(n):\n    print(n * 2)\n\ndef get_double(n):\n    return n * 2\n\na = show_double(4)\nb = get_double(4)', ['1|', '4|', '7|', '2| n=4', '7| a=None', '8|', '5| n=4', '8| b=8'], out="8", cap="show_double prints 8 but returns nothing, so a is None. get_double returns 8, so b is 8."),
       T("Call inside a call", 'def double(n):\n    return n * 2\n\nx = double(double(3))', ['1|', '4|', '2| n=3', '2| n=6', '4| x=12'], cap="The inner double(3) returns 6. That 6 becomes the argument of the outer call, which returns 12.")],
      [("Using `print` when you need the value later", "A printing function gives back `None`.", "Use `return`"), ("Calling but not storing: `double(4)` alone", "The returned value is thrown away.", "`result = double(4)` or `print(double(4))`"), ("Code after `return`", "It never runs.", "Put the return last"), ("Writing `return` outside a function", "SyntaxError.", "Only use it inside `def`"),
       ("Expecting the screen to show a returned value", "Nothing is displayed unless you print it.", "`print(double(4))`"), ("`return n * 2` and using `n` after the call", "n does not exist outside.", "Store the result in a variable"), ("A return inside a loop that ends it on pass 1", "The loop never gets to the other passes.", "Return after the loop"), ("Printing the call of a printing function", "`print(show_double(4))` prints 8 and then None.", "Pick print or return, not both")],
      ["The exam writes `RETURN(expression)`. It returns the value to where the procedure was called, and ends the procedure.", "You store a result with `result ← name(argument)`. Calls can appear inside other calls.", "Know the difference between what a procedure displays and what it returns."],
      [Q("What does `return` do?", ["Prints a value", "Gives a value back to the caller and ends the function", "Starts a loop", "Imports a library"], 1, "A return hands back a value and ends the function."),
       Q("What does this print?", ["12", "6", "3", "None"], 0, "double(3) returns 6, then double(6) returns 12.", 'def double(n):\n    return n * 2\n\nprint(double(double(3)))'),
       Q("What does a function with no `return` give back?", ["0", "An empty string", "None", "An error"], 2, "It gives back None."),
       Q("What does this print?", ["1 and never runs", "1", "never runs", "None"], 1, "Lines after the return are skipped.", 'def test():\n    return 1\n    print("never runs")\n\nprint(test())')]),

    L("5.4", "Combine `return` with `if` statements and loops: Boolean functions, early returns, and loops that return a total.",
      [("Boolean function", "a function that answers a yes-or-no question with True or False"), ("early return", "a `return` inside an `if` that ends the function before the end"), ("return after a loop", "a `return` that is NOT indented under the loop")],
      [("Return True or False", """A comparison like `n % 2 == 0` is **already True or False**, so a function can return it directly:

```
def is_even(n):
    return n % 2 == 0
```
A function that answers a yes-or-no question is called a **Boolean function**."""),
       ("Use it in an if", """A call that returns True or False can go **right inside an `if`**, because that is exactly the kind of question an `if` asks: `if is_even(number):`."""),
       ("Return one of two values, and return early", """An `if` can decide **which value to return**. Only **one** `return` runs, and the function ends right there. Because `return` ends the function, you often do not need an `else`: if the `if` returns, the lines after it are skipped. If it does not, Python keeps going to the next line."""),
       ("Loop, then return", """A loop can build up an answer, and the function **returns it after the loop**. The `return` must **not** be indented under the loop, or it would end the function on the first pass."""),
       ("A loop with a decision inside", """Put an `if` **inside** the loop to count only some items. The function sets up a counter, the loop and `if` update it, and the function returns the total at the end."""),
      ],
      [A("A Boolean function", 'def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(8))\nprint(is_even(7))',
         [(1, "n % 2 == 0", "Already True or False."), (3, "is_even(8)", "Returns True.")], out="True\nFalse", cap="A comparison can be returned directly."),
       A("Early return", 'def label(score):\n    if score >= 60:\n        return "pass"\n    return "fail"\n\nprint(label(75))\nprint(label(40))',
         [(2, 'return "pass"', "Ends the function when the if is True."), (3, 'return "fail"', "Only reached when the if was False.")], out="pass\nfail", cap="No else needed: the first return ends the function."),
       A("Loop, then return", 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n\nprint(sum_to(4))',
         [(2, "range(1, n + 1)", "n + 1 so that n is included."), (4, "return total", "NOT indented under the loop.")], out="10", cap="The return waits until the loop is done.")],
      [T("Return early", 'def label(score):\n    if score >= 60:\n        return "pass"\n    return "fail"\n\nresult = label(40)', ['1|', '6|', '2| score=40', '4|', '6| result="fail"'], cap="40 >= 60 is False, so line 3 is skipped. Line 4 returns fail."),
       T("Loop then return", 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n\nanswer = sum_to(3)', ['1|', '7|', '2| n=3; total=0', '3| i=1', '4| total=1', '3| i=2', '4| total=3', '3| i=3', '4| total=6', '5|', '7| answer=6'], cap="The loop builds total: 1, 3, 6. After the loop ends, return sends 6 back."),
       T("Count with a decision", 'def count_even(n):\n    count = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            count = count + 1\n    return count\n\nresult = count_even(5)', ['1|', '8|', '2| n=5; count=0', '3| i=1', '3| i=2', '5| count=1', '3| i=3', '3| i=4', '5| count=2', '3| i=5', '6|', '8| result=2'], cap="Only i = 2 and i = 4 are even. The function returns 2."),
       T("A Boolean in an if", 'def is_even(n):\n    return n % 2 == 0\n\nnumber = 9\nif is_even(number):\n    word = "even"\nelse:\n    word = "odd"', ['1|', '4| number=9', '5|', '2| n=9', '8| word="odd"'], cap="is_even(9) returns False, so the else runs and word is odd.")],
      [("A `return` indented under the loop", "The function ends on the first pass.", "Un-indent the return so it runs after the loop"), ("`return` instead of `print` when you want it shown", "A returned value is not displayed unless you print it.", "`print(label(75))`"), ("`return n % 2 == 0` and expecting text", "It returns True or False, not a word.", "Use an if to pick text"), ("`if is_even(n) == True:`", "It works but is extra.", "`if is_even(n):`"),
       ("A path with no return", "Some inputs give back `None`.", "Make sure every path returns something"), ("Setting the counter inside the loop", "It resets on every pass.", "Set it before the loop"), ("`range(1, n)` when you want n included", "It stops one short.", "`range(1, n + 1)`"), ("Returning inside the else of a loop", "It ends the loop early.", "Only return from the loop when that is the plan")],
      ["Procedures with IF/ELSE or REPEAT and a RETURN are very common. A question gives a call and asks what the procedure returns.", "RETURN ends the procedure the moment it runs.", "A procedure that returns a Boolean answers a yes-or-no question."],
      [Q("What does `is_even(7)` return?", ["True", "False", "7", "None"], 1, "7 % 2 is 1, so the comparison is False.", 'def is_even(n):\n    return n % 2 == 0'),
       Q("What does this print?", ["pass", "fail", "40", "None"], 1, "40 >= 60 is false, so the second return runs.", 'def label(score):\n    if score >= 60:\n        return "pass"\n    return "fail"\n\nprint(label(40))'),
       Q("Where should `return total` go to give the total of a loop?", ["Indented under the loop", "After the loop, not indented under it", "Before the loop", "Inside the if"], 1, "Un-indent it so it runs after the loop is done."),
       Q("What does `sum_to(3)` return?", ["3", "6", "9", "1"], 1, "1 + 2 + 3 is 6.", 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total')]),

    L("5.5", "Use libraries and read documentation: `import`, `math`, `random`, and built-in functions.",
      [("library", "a collection of ready-made procedures, like `math` and `random`"), ("API", "application program interface: the description of how a library's procedures behave"), ("documentation", "the written description of a procedure: its name, its parameters, and what it returns"), ("`import`", "loads a library into your program")],
      [("Use what others wrote", """You have been **writing** functions. You can also **use functions other people wrote**. A **library** is a collection of ready-made procedures, like `math` and `random`. An **API** (application program interface) is the **description** of how the procedures in a library behave and how to call them. You learn how to use a procedure by reading its **documentation**."""),
       ("Import a library", """`import math` loads the math library. After that you call its procedures with the library name, a dot, and the procedure name: `math.sqrt(16)`. Someone else wrote `sqrt`. You just **call** it and use the value it **returns**."""),
       ("Built-in procedures", """Some procedures come with Python and need no import. You already use `print`, `input`, and `len`. Others you will meet are `abs`, `round`, `min`, and `max`. Each is part of the Python API."""),
       ("Read the documentation", """Documentation tells you the name, the **order of the arguments**, and what it returns. For example: `round(number, digits)` returns `number` rounded to `digits` places after the decimal point. And `pow(base, exponent)` returns the base raised to the power of the exponent. Swapping arguments gives a different answer, just like your own functions."""),
       ("The random library", """`random.randint(a, b)` returns a random whole number from a to b, and **both ends are included**. It is the Python version of the exam's `RANDOM(a, b)`."""),
       ("Your own procedures can call library procedures", """A procedure can use a library procedure inside it. The hypotenuse of a right triangle is `math.sqrt(a * a + b * b)`. You write a few lines, because the library already knows how to take square roots. On the exam: **libraries make programs easier to build**, an API specifies how procedures behave, and documentation is necessary to use them."""),
      ],
      [A("Import and call", 'import math\nprint(math.sqrt(16))\nprint(abs(-7))\nprint(round(3.14159, 2))',
         [(0, "import math", "Loads the library."), (1, "math.sqrt", "library name, dot, procedure."), (2, "abs", "Built in: no import needed."), (3, "3.14159, 2", "Number, then digits: the documented order.")], out="4.0\n7\n3.14", cap="Read the documentation to know the order of the arguments."),
       A("Order matters: pow", 'print(pow(2, 3))\nprint(pow(3, 2))',
         [(0, "2, 3", "base 2, exponent 3: 2 * 2 * 2."), (1, "3, 2", "base 3, exponent 2: 3 * 3.")], out="8\n9", cap="Swapped arguments give a different answer."),
       A("My procedure calls a library", 'import math\n\ndef hypotenuse(a, b):\n    return math.sqrt(a * a + b * b)\n\nprint(hypotenuse(3, 4))',
         [(3, "math.sqrt", "The library does the hard part."), (5, "hypotenuse(3, 4)", "Returns 5.0.")], out="5.0", cap="Libraries make programs shorter and easier.")],
      [T("Library call", 'import math\nroot = math.sqrt(16)\nrounded = round(3.14159, 2)', ['2| root=4.0', '3| rounded=3.14'], cap="sqrt returns 4.0 (a float). round keeps 2 digits."),
       T("pow: order matters", 'a = pow(2, 3)\nb = pow(3, 2)', ['1| a=8', '2| b=9'], cap="pow(base, exponent). 2 to the power 3 is 8. 3 to the power 2 is 9."),
       T("Hypotenuse", 'import math\n\ndef hypotenuse(a, b):\n    return math.sqrt(a * a + b * b)\n\nlong_side = hypotenuse(3, 4)', ['1|', '3|', '6|', '4| a=3; b=4', '6| long_side=5.0'], cap="3 * 3 + 4 * 4 is 25. The square root of 25 is 5.0."),
       T("Distance finder", 'import math\n\ndef distance(x1, y1, x2, y2):\n    dx = x2 - x1\n    dy = y2 - y1\n    return round(math.sqrt(dx * dx + dy * dy), 1)\n\nd = distance(0, 0, 3, 4)', ['1|', '3|', '8|', '4| x1=0; y1=0; x2=3; y2=4; dx=3', '5| dy=4', '6|', '8| d=5.0'], cap="dx is 3 and dy is 4, so the distance is sqrt(25) = 5.0, rounded to 1 place.")],
      [("Forgetting `import math`", "NameError: math is not defined.", "Put `import math` at the top"), ("`sqrt(16)` without `math.`", "NameError.", "`math.sqrt(16)`"), ("`round(3.14159)` when you want 2 places", "With no digits it rounds to a whole number.", "`round(3.14159, 2)`"), ("`pow(3, 2)` when you meant 2 to the power 3", "The order is base then exponent.", "Read the documentation"),
       ("`math.sqrt(-1)`", "ValueError: you cannot take the square root of a negative.", "Make sure the value is not negative"), ("`random.randint(6)`", "randint takes two numbers.", "`random.randint(1, 6)`"), ("Putting `import` in the middle", "It works, but readers expect it at the top.", "Import at the top"), ("Guessing what a procedure does", "You may call it wrongly.", "Read its documentation")],
      ["Libraries make programs easier to build. An **API** specifies how the procedures in a library behave. **Documentation** is necessary to use them.", "A question may show documentation for a procedure and ask what a call returns.", "Be able to use a procedure from its description alone."],
      [Q("What is an API?", ["A kind of loop", "A description of how a library's procedures behave", "A variable", "A comment"], 1, "It tells you how to use the procedures."),
       Q("What does `math.sqrt(25)` return?", ["5", "5.0", "625", "50"], 1, "sqrt returns a float, 5.0."),
       Q("Why do programmers use libraries?", ["To make programs harder", "To reuse tested code and save time", "To avoid functions", "To slow the program"], 1, "Libraries make programs easier to build."),
       Q("What does `round(7.891, 1)` return?", ["7", "7.9", "8", "7.89"], 1, "One digit after the decimal point: 7.9.")]),

    L("5.6", "Explain how a procedure with a parameter, a loop, and a decision makes code shorter and easier to change.",
      [("abstraction", "hiding details behind a name so you can think at a higher level"), ("procedure abstraction", "using a named procedure for code you would otherwise repeat"), ("sequencing / selection / iteration", "running in order / choosing with if / repeating with a loop")],
      [("Code you keep repeating", """If you copy the same lines again and again, a change means fixing every copy. A **procedure** lets you write the code **once**, give it a name, and **call** it as often as you need."""),
       ("A parameter that changes what happens", """A parameter makes one procedure do many jobs. `stars(5)` can print five stars and `stars(2)` can print two. The parameter is the part that changes."""),
       ("Iteration controlled by a parameter", """The parameter can control a loop: `for i in range(n):` repeats `n` times, so the number of repeats comes from the call."""),
       ("All three building blocks together", """The Create Task needs **sequencing** (lines in order), **selection** (an `if`), and **iteration** (a loop) inside a procedure that has a **parameter** which changes the result. A procedure can also **call another procedure**."""),
       ("Change it once", """Because the code lives in one place, changing it **once** changes **every call**. That is the point of procedural abstraction: the program is shorter, easier to read, and easier to fix. On the exam you may be asked to explain how a procedure manages complexity."""),
      ],
      [A("A parameter and a loop", 'def stars(n):\n    for i in range(n):\n        print("*", end="")\n    print()\n\nstars(3)\nstars(5)',
         [(0, "n", "The parameter: how many stars."), (1, "range(n)", "The loop repeats n times.")], out="***\n*****", cap="One procedure, many results."),
       A("A procedure that decides", 'def rating(score):\n    if score >= 90:\n        return "great"\n    return "ok"\n\nprint(rating(95))',
         [(1, "score >= 90", "Selection."), (2, "return", "The result depends on the parameter.")], out="great", cap="The parameter changes what comes back."),
       A("A procedure calling a procedure", 'def line():\n    print("-----")\n\ndef title(text):\n    line()\n    print(text)\n    line()\n\ntitle("Menu")',
         [(4, "line()", "title calls line."), (8, 'title("Menu")', "One call does it all.")], out="-----\nMenu\n-----", cap="Small procedures build bigger ones.")],
      [T("A loop controlled by a parameter", 'def repeat(msg, n):\n    count = 0\n    for i in range(n):\n        count = count + 1\n    return msg * count\n\nanswer = repeat("ab", 3)', ['1|', '7|', '2| msg="ab"; n=3; count=0', '3| i=0', '4| count=1', '3| i=1', '4| count=2', '3| i=2', '4| count=3', '5|', '7| answer="ababab"'], cap="The parameter n set how many times the loop ran, and the answer repeats msg that many times."),
       T("Selection and a return", 'def rating(score):\n    if score >= 90:\n        return "great"\n    return "ok"\n\nr1 = rating(95)\nr2 = rating(70)', ['1|', '6|', '2| score=95', '3|', '6| r1="great"', '7|', '2| score=70', '4|', '7| r2="ok"'], cap="The same procedure returns different results because the parameter is different."),
       T("A procedure calls a procedure", 'def twice(n):\n    return n * 2\n\ndef four_times(n):\n    return twice(twice(n))\n\nx = four_times(3)', ['1|', '4|', '7|', '5| n=3', '2| n=3', '2| n=6', '7| x=12'], cap="four_times uses twice two times. Changing twice once would change four_times too."),
       T("Change it once", 'def tax(price):\n    return price * 1.1\n\na = tax(100)\nb = tax(50)', ['1|', '4|', '2| price=100', '4| a=110.00000000000001', '5|', '2| price=50', '5| b=55.00000000000001'], cap="If the tax changes, you fix one line and both calls update. (The long decimal is just how computers store decimals.)")],
      [("Copying code instead of writing a procedure", "Every change must be made in many places.", "Write a procedure and call it"), ("A parameter that is never used", "The procedure does the same thing for every call.", "Use the parameter in the body"), ("A procedure with no loop or if in the Create Task", "It does not meet the requirement.", "Include selection and iteration"), ("Defining a procedure but never calling it", "Nothing happens.", "Call it"),
       ("Calling a procedure that is defined below", "NameError.", "Define first, call later"), ("Putting everything in one giant procedure", "It is hard to read and reuse.", "Break it into smaller procedures"), ("Naming a procedure `a`", "Nobody knows what it does.", "Use a descriptive name"), ("Forgetting the colon or indent", "SyntaxError or IndentationError.", "Check the def line and the body")],
      ["A **procedure** is a named group of programming instructions. Calling it runs those instructions.", "Procedural **abstraction** manages complexity: you use a procedure by knowing what it does, not how.", "The Create Task needs a student-developed procedure with a parameter, plus sequencing, selection, and iteration."],
      [Q("Why use a procedure for code you use many times?", ["It makes the code run backward", "Changing it once changes every call", "It adds comments", "It uses less memory always"], 1, "That is the benefit of procedural abstraction."),
       Q("What does this print?", ["great", "ok", "95", "None"], 0, "95 >= 90 is true.", 'def rating(score):\n    if score >= 90:\n        return "great"\n    return "ok"\n\nprint(rating(95))'),
       Q("What does a parameter let a procedure do?", ["Run faster", "Work with different values on each call", "Skip lines", "Import a library"], 1, "The parameter changes what the procedure does."),
       Q("Which building blocks must the Create Task procedure use?", ["Only sequencing", "Sequencing, selection, and iteration", "Only a list", "Only input"], 1, "All three, along with a parameter that affects the result.")]),
    ],
    glossary=[], seed=5)
