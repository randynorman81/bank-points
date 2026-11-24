from lesson import *

UNIT = Unit(3, "Programming with Python", "Your first Python programs: variables, types, input, strings, and math, one lesson at a time.",
    "Big Idea 3: Algorithms and Programming", "#2563EB", "#1D4ED8", "#60A5FA", "#DBEAFE", "code",
    ["Create variables, pick legal names, and change their values", "Tell strings, integers, floats, and booleans apart", "Read input from the user and convert it to numbers", "Join text, pull out one character with an index, take a piece with a slice, and search with .find()", "Use /, //, %, and the order of operations", "Trace code by hand, line by line"],
    [
    L("3.1", "Make a variable, choose a name Python accepts, and change its value.",
      [("variable", "a name that holds a value so you can use it later"), ("assignment", "storing a value in a name with a single `=`"), ("keyword", "a word Python already uses, like `class` or `for`"), ("NameError", "Python's way of saying it does not know that name")],
      [("What is a variable?", """A **variable** is a name that holds a value. Think of a labeled box: the label is the name and what is inside is the value. You make one with a single equals sign. The name goes on the **left** and the value goes on the **right**. Python reads it as: *take the value on the right and store it in the name on the left.*

This is called **assignment**. The equals sign here does not mean "is equal to". It means "store".

!key: `player_name = "Sam"` stores the text Sam inside the name `player_name`.

On the AP exam the same idea is written with an arrow: `score ← 10`. The arrow means the same thing as `=` in Python."""),
       ("Quotes or no quotes?", """Quotes tell Python "this is text, print the words I typed". No quotes tell Python "this is a name, look inside the box".

- `print("player_name")` prints the words **player_name**
- `print(player_name)` prints what is **stored** in the variable, which is **Sam**"""),
       ("The naming rules", """Python is strict about names. A variable name:

- uses only **letters, digits, and underscores** (`_`)
- cannot **start** with a digit
- cannot have **spaces** or symbols like `-` or `$`
- cannot be a **keyword** (a word Python already uses, such as `class`, `if`, `for`, `while`, `def`)
- is **case-sensitive**: `score`, `Score`, and `SCORE` are three different names"""),
       ("Good names make good code", """A legal name is not always a good name. Pick a name that says what the value **is**: `high_score` tells the reader more than `h` or `x1`. The usual style in Python is all lowercase with underscores between words (`player_name`, `total_points`).

A variable can also **change**. When you store a new value in a name, the old value is gone for good."""),
      ],
      [A("Make a variable and use it", 'player_name = "Sam"\nprint(player_name)\nprint("player_name")',
         [(0, "player_name", "The NAME goes on the left."), (0, '"Sam"', "The VALUE goes on the right, in quotes because it is text."), (1, "print(player_name)", "No quotes: prints what is stored, Sam."), (2, '"player_name"', "Quotes: prints the words themselves.")], out="Sam\nplayer_name", cap="One line makes the variable. The quotes decide whether Python prints the name or what is inside it."),
       A("Legal and illegal names", 'score = 1\n2nd_place = 3\nmy_name = 4\nclass = 5',
         [(0, "score", "Legal: letters only."), (1, "2nd_place", "ILLEGAL: starts with a digit."), (2, "my_name", "Legal: an underscore is allowed."), (3, "class", "ILLEGAL: class is a keyword.")], cap="Python rejects a bad name with a red SyntaxError. The fix is a new name.")],
      [T("A variable can change", 'team = "Hawks"\nwins = 3\nteam = "Eagles"\nprint(team)\nprint(wins)', ['1| team="Hawks"', '2| wins=3', '3| team="Eagles"'], out="Eagles\n3", cap="Line 3 puts a new value in team. \"Hawks\" is gone. wins never changed."),
       T("Copying a value", 'a = 5\nb = a\na = 9\nprint(a)\nprint(b)', ['1| a=5', '2| b=5', '3| a=9'], out="9\n5", cap="b = a copies the VALUE 5 at that moment. Changing a later does not change b."),
       T("Capital letters matter", 'pizza_slices = 8\nprint(Pizza_slices)', ['1| pizza_slices=8'], out="NameError: name 'Pizza_slices' is not defined", cap="Line 2 never finishes. Python has no name written with a capital P, so it stops with a NameError.")],
      [("`2nd_place = 3`", "A name cannot start with a digit.", "`second_place = 3`"), ("`my-name = 4`", "Python reads the dash as a minus sign.", "`my_name = 4`"), ("`total pts = 7`", "A space splits it into two names.", "`total_pts = 7`"), ("`class = 5`", "`class` is a keyword Python already uses.", "`class_name = 5`"),
       ("`print(Pizza_slices)` after `pizza_slices = 8`", "Capital letters matter, so this is a different name: NameError.", "Copy the name exactly: `pizza_slices`"), ("`player_name = Sam`", "No quotes, so Python looks for a variable called Sam: NameError.", "`player_name = \"Sam\"`"), ("`print(\"player_name\")`", "Quotes print the words, not the value.", "`print(player_name)`")],
      ["Variable names cannot have spaces. Use an underscore or write them together.", "On the exam, `score ← 10` stores 10 in score, the same as `score = 10` in Python.", "A new assignment replaces the old value. Trace the lines in order to see what is stored at each point."],
      [Q("Which is a legal Python variable name?", ["`2nd_place`", "`my-name`", "`high_score`", "`total pts`"], 2, "Only `high_score` uses letters and an underscore. The others start with a digit, use a dash, or have a space."),
       Q("What does this program print?", ["x", "7", "`x = 7`", "an error"], 1, "`print(x)` has no quotes, so it prints what x holds: 7.", 'x = 7\nprint(x)'),
       Q("A program stores `score = 5` and then `score = 8`. What does `score` hold afterward?", ["5", "8", "13", "both 5 and 8"], 1, "A new assignment replaces the old value."),
       Q("`pizza = 4` then `print(Pizza)`. What happens?", ["Prints 4", "Prints Pizza", "A NameError", "Nothing"], 2, "Python is case-sensitive: `Pizza` was never created.")]),

    L("3.2", "Store strings, integers, floats, and booleans, and tell the four types apart.",
      [("data type", "the kind of value something is: text, whole number, decimal, or yes/no"), ("string (str)", "text, written inside quotes"), ("integer (int)", "a whole number with no decimal point"), ("float", "a number with a decimal point"), ("boolean (bool)", "only `True` or `False`"), ("`type()`", "a function that tells you the type of a value")],
      [("Every value has a type", """Every value in Python has a **data type**. The type tells Python what the value is and what you are allowed to do with it. You will use four types all the time.

| Type | Python calls it | What it holds | Examples |
|---|---|---|---|
| String | `str` | text | `"Ana"`, `"7"`, `"hello world"` |
| Integer | `int` | a whole number | `15`, `0`, `-3` |
| Float | `float` | a number with a decimal point | `5.4`, `7.0`, `0.5` |
| Boolean | `bool` | only True or False | `True`, `False` |"""),
       ("How to spot each type", """You can tell the type by how the value is **written**.

- It has **quotes** around it: it is a **string**, even if the inside looks like a number.
- It is a number with **no decimal point**: an **int**.
- It is a number **with a decimal point**: a **float**. `7.0` is a float, not an int.
- It is exactly `True` or `False` (capital first letter, no quotes): a **boolean**.

!warn: Quotes change the type! `7` is an int. `"7"` is a string. They are different values and they behave differently."""),
       ("Ask Python with type()", """The function `type()` tells you what kind of value you have. Put a value or a variable inside the brackets and print it. Python answers with a line like `<class 'str'>`. The word after `class` is the type: `str`, `int`, `float`, or `bool`."""),
       ("Variables can change type, and comparisons make booleans", """A variable does not have a fixed type. It takes the type of whatever you store in it last. You can also get a boolean by asking a yes-or-no question with a **comparison** such as `age >= 13`. The answer is always `True` or `False`.

On the AP exam the boolean values are written in lowercase (`true` and `false`). In Python they **must** be `True` and `False` with a capital first letter."""),
       ("Operations make values with types too", """The result of an operation has a type, too. `7 % 3` is an **int**. `5 == 5` is a **bool**. `7 / 2` is a **float**. And `"ab" * 3` is a **string**, `"ababab"`, because repeating text gives text. Check any of them with `type()`: `print(type(7 % 3))` shows `<class 'int'>`."""),
      ],
      [A("Store one of each type", 'name = "Ana"\nage = 15\nheight = 5.4\nis_student = True',
         [(0, '"Ana"', "Quotes make it a string."), (1, "15", "No decimal point: an int."), (2, "5.4", "Decimal point: a float."), (3, "True", "Capital T, no quotes: a boolean.")], cap="Four variables, four types. The way each value is written decides its type."),
       A("Ask Python for the type", 'print(type("7"))\nprint(type(7))\nprint(type(7.0))\nprint(type(True))',
         [(0, '"7"', "In quotes, so this is text."), (1, "7", "Whole number: int."), (2, "7.0", "Has a decimal point: float."), (3, "True", "A boolean.")], out="<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>", cap="Same digit, three different types, because of how it is written."),
       A("Booleans from comparisons", 'age = 15\nis_teenager = age >= 13\ncan_drive = age >= 16',
         [(1, "age >= 13", "Is 15 at least 13? Yes, so True."), (2, "age >= 16", "Is 15 at least 16? No, so False.")], cap="A comparison asks a question and stores the True or False answer.")],
      [T("A variable can change type", 'thing = 10\nthing = "ten"\nthing = 10.5\nthing = False', ['1| thing=10; type=int', '2| thing="ten"; type=str', '3| thing=10.5; type=float', '4| thing=False; type=bool'], cap="The variable keeps no memory of its old type. Each new value brings its own type with it."),
       T("Booleans from comparisons", 'age = 15\nis_teenager = age >= 13\ncan_drive = age >= 16\nprint(can_drive)', ['1| age=15', '2| is_teenager=True', '3| can_drive=False'], out="False", cap="Line 2 asks 15 >= 13 and stores True. Line 3 asks 15 >= 16 and stores False."),
       T("The type of a result", 'a = 7 % 3\nb = "ab" * 3\nc = 5 == 5\nd = 7 / 2', ['1| a=1; type=int', '2| b="ababab"; type=str', '3| c=True; type=bool', '4| d=3.5; type=float'], cap="Each line stores the result of an operation. The type depends on the operation: remainder gives an int, repeating text gives text, a comparison gives a boolean, and division gives a float."),
       T("Quotes change the type", 'score = 7\npassed = score >= 5\nscore = "7"\nprint(type(score))', ['1| score=7; type=int', '2| passed=True', '3| score="7"; type=str'], out="<class 'str'>", cap="Putting quotes around the 7 turns it into text. It looks the same on the screen but it is a different type.")],
      [("`finished = \"False\"`", "The quotes make it a string, not a boolean.", "`finished = False`"), ("`is_student = true`", "Lowercase `true` is not a boolean in Python. Python looks for a variable named true: NameError.", "`is_student = True`"), ("`price = \"4.99\"`", "Quotes make a price into text, so you cannot do math with it.", "`price = 4.99`"),
       ("`quantity = 3.0`", "A whole count does not need a decimal point. It becomes a float.", "`quantity = 3`"), ("`zip_code = 30132.0`", "The `.0` is not part of a zip code and makes it a float.", "`zip_code = 30132`"), ("`type(5 == 5)` and you expect int", "A comparison gives a boolean.", "Comparisons are `bool`"), ("`type(7.0)` and you expect int", "A decimal point makes it a float, even when it ends in .0.", "Read the way it is written, not what it looks like."), ("`name = Ana`", "No quotes, so Python looks for a variable named Ana: NameError.", "`name = \"Ana\"`")],
      ["The exam has numbers, strings, and booleans, and writes booleans as lowercase `true` and `false`. In Python they must be `True` and `False`.", "Know what type a value is before you decide what you can do with it.", "A comparison always evaluates to true or false."],
      [Q("What type is `\"15\"`?", ["int", "float", "str", "bool"], 2, "It is inside quotes, so it is a string even though it looks like a number."),
       Q("What type is `7.0`?", ["int", "float", "str", "bool"], 1, "A decimal point makes it a float."),
       Q("What does this program print?", ["True", "False", "15", "an error"], 1, "`15 >= 16` is false, so `ok` stores False.", 'age = 15\nok = age >= 16\nprint(ok)'),
       Q("Which line stores a boolean?", ["`done = \"True\"`", "`done = True`", "`done = 1.0`", "`done = true`"], 1, "Only a capital `True` with no quotes is a boolean."),
       Q("A variable holds `5` and then you store `\"five\"` in it. What type does it hold now?", ["int", "float", "str", "both"], 2, "The newest value wins, and `\"five\"` is a string.")]),

    L("3.3", "Ask the user a question with `input()` and understand that the answer is always a string.",
      [("input()", "a function that asks the user a question and gives back what they type"), ("prompt", "the question text inside the parentheses of `input()`"), ("user", "the person running your program"), ("TypeError", "an error that happens when you mix types in a way Python cannot do")],
      [("Programs that ask", """So far your programs always do the same thing. With `input()` your program can **ask** the person using it a question and use the answer. The text inside the parentheses is called the **prompt**. It shows up in a box (or on the screen) and the program waits until the user types something and presses OK. Whatever they typed is handed back to your program, so you store it in a variable.

!key: `name = input("What is your name? ")` asks the question and stores the answer in `name`.

On the AP exam the same idea is written `answer ← INPUT()`."""),
       ("The space in the prompt", """Look at the **space** at the end of the question, just before the closing quote: `"What is your name? "`. It keeps the answer from touching the question. Without it the user's typing would appear right against the question mark."""),
       ("Everything typed is a string", """Here is the surprise that trips up almost everyone: **whatever the user types is stored as a string, even when they type digits.** If the user types 16, Python stores the **text** `"16"`, not the number 16. You can check with `type()`: it says `<class 'str'>`.

You will learn how to turn that text into a real number in Lesson 3.8. For now, just remember what you are holding."""),
       ("Why it matters", """Text and numbers behave differently.

- Adding 1 to text crashes: `"5" + 1` is a **TypeError**, because Python cannot add a number to text.
- Using `+` on two pieces of text does not add. It **sticks them together**. So `"3" + "4"` becomes `"34"`, not 7. Python only adds when both sides are real numbers."""),
      ],
      [A("Ask a question", 'name = input("What is your name? ")\nprint("Nice to meet you,")\nprint(name)',
         [(0, "input(", "Shows the prompt and waits for the user."), (0, "name =", "The typed answer is stored in the variable name."), (2, "print(name)", "No quotes: prints what the user typed.")], out="Nice to meet you,\nMaya", cap="If the user types Maya, then name holds the string Maya."),
       A("Digits are still a string", 'age = input("How old are you? ")\nprint(age)\nprint(type(age))',
         [(0, "input(", "The user types 16."), (1, "print(age)", "Shows 16, which looks like a number."), (2, "type(age)", "But the type says str: it is text.")], out="16\n<class 'str'>", cap="Looks like a number, acts like text."),
       A("Strings stick together", 'first = input("First number: ")\nsecond = input("Second number: ")\nprint(first + second)',
         [(2, "first + second", "Both are text, so + sticks them side by side.")], out="34", cap="The user types 3 and 4. The program prints 34, not 7.")],
      [T("Ask and store", 'name = input("What is your name? ")\nprint("Nice to meet you,")\nprint(name)', ['1| name="Maya"'], inp=["Maya"], out="Nice to meet you,\nMaya", cap="Line 1 pauses for the user. When Maya types her name, it is stored in name. Lines 2 and 3 just print."),
       T("Two answers", 'first = input("First number: ")\nsecond = input("Second number: ")\nprint(first + second)', ['1| first="3"', '2| second="4"'], inp=["3", "4"], out="34", cap="Both values are strings, so + joins them: \"3\" + \"4\" is \"34\"."),
       T("The type of an answer", 'age = input("How old are you? ")\nprint(age)\nprint(type(age))', ['1| age="16"; type=str'], inp=["16"], out="16\n<class 'str'>", cap="The user typed digits, but input() always gives back a string.")],
      [("`input(\"How old are you?\")` with no space", "The answer touches the question mark.", "End the prompt with a space: `\"How old are you? \"`"), ("`print(number + 1)` after `number = input(...)`", "TypeError: you cannot add a number to text.", "Convert the text to a number first (Lesson 3.8)"), ("Expecting `\"3\" + \"4\"` to be 7", "`+` joins text, so you get `\"34\"`.", "Remember: input gives strings"),
       ("`name = input(What is your name? )`", "The prompt has no quotes: SyntaxError.", "`name = input(\"What is your name? \")`"), ("`input(\"Name? \")` with no variable", "The answer is typed in and then thrown away.", "`name = input(\"Name? \")`"), ("`print(\"Nice to meet you, name\")`", "Quotes print the word name, not the user's answer.", "`print(\"Nice to meet you,\")` then `print(name)`"), ("`age = input()` with no prompt", "The user sees nothing and does not know what to type.", "Always write a clear prompt")],
      ["The exam gets a value from the user with `INPUT()`, like `answer ← INPUT()`. The Python version is `answer = input()`.", "Input from the user can change what a program does each time it runs.", "Be careful with types: a value the user types is text until you convert it."],
      [Q("What type is the value stored by `age = input(\"Age? \")` when the user types 16?", ["int", "float", "str", "bool"], 2, "`input()` always gives a string."),
       Q("The user types 3 and then 4. What does this print?", ["7", "34", "3 4", "an error"], 1, "Both are strings, so `+` joins them into `34`.", 'a = input("A: ")\nb = input("B: ")\nprint(a + b)'),
       Q("Why do prompts usually end with a space?", ["Python requires it", "So the answer does not touch the question", "It makes input faster", "It converts the answer to a number"], 1, "The space is only for looks. It keeps the question and the answer apart."),
       Q("Which line asks the user for a name and stores it?", ["`input(\"Name? \")`", "`name = input(\"Name? \")`", "`name = \"input\"`", "`print(input)`"], 1, "You need `name =` to store the answer.")]),

    L("3.4", "Join strings with `+`, mix in numbers and booleans with `str()`, and use a comma in `print()`.",
      [("concatenation", "joining pieces of text into one longer string"), ("`str()`", "turns any value into a string"), ("TypeError", "the error you get when you join text and a number with `+`")],
      [("Joining strings", """**Concatenation** means joining pieces of text into one longer string. The `+` sign does it, but **only when both sides are strings**.

`"Ada" + "Lovelace"` gives `"AdaLovelace"`. The names touch because `+` joins **exactly** what is there. To get a space you must add a string that holds a space: `"Ada" + " " + "Lovelace"`."""),
       ("Text plus a number crashes", """`"Your score is " + 95` is a **TypeError**: Python cannot join text and a number. Fix it with **`str()`**, which turns any value into a string:

`"Your score is " + str(95)` works.

The same rule is true for floats and booleans. A float or a boolean must be changed to a string with `str()` before it can be joined to text. On the AP exam you will see the same idea: numbers must become text before they can be joined."""),
       ("Two ways to print mixed values", """A **comma** inside `print()` is a second way to mix types. It prints each value, puts a space between them, and works with **any** type, so you do not need `str()`. Use it when you just want to **display** values.

- `print("Level:", level)` shows `Level: 7`
- `print("Level: " + str(level))` shows `Level: 7`
- `print("Level:" + str(level))` shows `Level:7`

**Pitfalls of the comma:** it always adds exactly one space, so you cannot get `Level:7` or `$5` with it (`print("$", 5)` shows `$ 5`). It only works inside `print()`, so it does not build one string you can save in a variable. Use `+` when the spacing has to be exact."""),
       ("Adding is not the same as joining", """The same `+` does two different jobs. On two **numbers** it adds. On two **strings** it joins. `5 + 5` is `10`, but `"5" + "5"` is `"55"`. A string times a whole number repeats it: `"5" * 3` is `"555"`."""),
      ],
      [A("Join with a space", 'first_name = "Ada"\nlast_name = "Lovelace"\nprint(first_name + " " + last_name)',
         [(2, '" "', "A string with one space inside. + joins exactly what is there."), (2, "+", "Joins strings side by side.")], out="Ada Lovelace", cap="Without the \" \" the names would touch: AdaLovelace."),
       A("str() fixes mixed types", 'price = 4.99\nin_stock = True\nprint("Price: $" + str(price))\nprint("In stock: " + str(in_stock))',
         [(2, "str(price)", "Turns the float 4.99 into the text \"4.99\"."), (3, "str(in_stock)", "Turns True into the text \"True\".")], out="Price: $4.99\nIn stock: True", cap="Floats and booleans need str() too."),
       A("Add, join, or repeat", 'print(5 + 5)\nprint("5" + "5")\nprint("5" * 3)',
         [(0, "5 + 5", "Two numbers: adds."), (1, '"5" + "5"', "Two strings: joins."), (2, '"5" * 3', "Repeats the text three times.")], out="10\n55\n555", cap="The type of the values decides what the operator does.")],
      [T("Build a full name", 'first_name = "Ada"\nlast_name = "Lovelace"\nfull = first_name + " " + last_name\nprint(full)', ['1| first_name="Ada"', '2| last_name="Lovelace"', '3| full="Ada Lovelace"'], out="Ada Lovelace", cap="Line 3 builds a new string from three pieces: Ada, one space, and Lovelace."),
       T("Number to text", 'score = 95\nmessage = "Score: " + str(score)\nprint(message)', ['1| score=95', '2| message="Score: 95"'], out="Score: 95", cap="str(score) gives \"95\", and + joins it onto \"Score: \". score is still the number 95."),
       T("Comma or plus?", 'level = 7\nprint("Level:", level)\nprint("Level: " + str(level))\nprint("Level:" + str(level))', ['1| level=7'], out="Level: 7\nLevel: 7\nLevel:7", cap="The comma adds a space. With + you control every space yourself, so the last line has none.")],
      [("`\"Your score is \" + score`", "TypeError: text plus a number.", "`\"Your score is \" + str(score)`"), ("`\"Average: \" + average` with a float", "The same TypeError. Floats need `str()` too.", "`\"Average: \" + str(average)`"), ("`\"Passed: \" + passed` with a boolean", "The same TypeError for booleans.", "`\"Passed: \" + str(passed)`"), ("`\"Hello\" + name`", "No space, so it prints HelloJordan.", "`\"Hello \" + name`"),
       ("`print(\"$\", 5)`", "The comma puts a space in, so you get `$ 5`.", "`print(\"$\" + str(5))`"), ("`5 + \"5\"`", "TypeError: a number and a string.", "`str(5) + \"5\"` or `5 + int(\"5\")`"), ("Expecting `\"5\" + \"5\"` to be 10", "Strings join, so it is `\"55\"`.", "Use real numbers to add")],
      ["The exam has a `concat` operation for strings, and it expects you to know that numbers must become text before they can be joined.", "`+` on two strings joins them. `+` on two numbers adds them.", "The order of the pieces decides the order in the result, and spaces count as characters."],
      [Q("What does `print(\"5\" + \"5\")` display?", ["10", "55", "5 5", "an error"], 1, "Two strings join: `55`."),
       Q("Which line runs without an error?", ["`print(\"Age: \" + 15)`", "`print(\"Age: \" + str(15))`", "`print(15 + \"Age: \")`", "`print(\"Age: \" - 15)`"], 1, "`str(15)` makes the number into text first."),
       Q("What does this print?", ["Hi, Sam", "Hi,Sam", "Hi Sam", "Hi,  Sam"], 1, "The comma is inside the quotes and there is no space after it, so there is no space.", 'name = "Sam"\nprint("Hi," + name)'),
       Q("`print(\"Total:\", 4)` displays...", ["Total:4", "Total: 4", "Total: + 4", "an error"], 1, "The comma puts one space between the pieces.")]),

    L("3.5", "Count the characters in a string with `len()` and pull out one character with an index.",
      [("string", "a row of characters, such as the letters in a word"), ("index", "the number position of a character in a string; the first character is at index 0"), ("`len()`", "tells you how many characters are in a string"), ("negative index", "counts from the end: -1 is the last character"), ("IndexError", "the error for an index that is past the end of the string")],
      [("A string is a row of characters", """A string is a row of **characters**: letters, digits, spaces, and symbols. Every character has a numbered position, called its **index**. To pull out one character, you write the string (or its variable), then the index in **square brackets**: `word[3]`.

The function **`len()`** counts the characters. `len("Python")` is 6. `len("Hello there")` is 11, because the space counts as a character too."""),
       ("Every character has an index", """Python starts counting at **0**, not 1. For `"Python"`:

| P | y | t | h | o | n |
|---|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 4 | 5 |

So `word[0]` is `"P"` and `word[3]` is `"h"`. The last character of a string of length 6 is at index **5**, which is `len(word) - 1`.

!warn: On the AP exam, lists start at index **1**. In Python, strings and lists start at index **0**. Keep the two straight!"""),
       ("Counting from the end", """A **negative index** counts backward from the end. `word[-1]` is the last character, `word[-2]` is the second to last, and so on. For `"Python"`, `word[-1]` is `"n"` and `word[-6]` is `"P"`."""),
       ("The off-by-one trap and unchangeable strings", """If you ask for an index that does not exist, Python stops with an **IndexError**. For `"Python"` (length 6) the indexes are 0 to 5, so `word[6]` is an error. The last index is always `len(word) - 1`.

Strings also **cannot be changed in place**. `word[0] = "J"` is a TypeError. To get a different string, you build a new one."""),
       ("The middle letter", """To find the middle letter, use the length divided by 2 with `//`. The `//` operator is **floor division**: it divides and throws away any decimal part (you will practice it fully in Lesson 3.10). For `"hello"`, `len(word) // 2` is `5 // 2`, which is 2, and `word[2]` is `"l"`."""),
      ],
      [anatomy("Every character has an index", [("P", "0", "First character: index 0."), ("y", "1", ""), ("t", "2", ""), ("h", "3", ""), ("o", "4", ""), ("n", "5", "Last: len(word) - 1.")], size=34, caption="`word = \"Python\"` has 6 characters at indexes 0 to 5. `word[-1]` is also the last one."),
       A("Index, len, and the end", 'word = "Python"\nprint(len(word))\nprint(word[0])\nprint(word[3])\nprint(word[-1])',
         [(1, "len(word)", "Counts the characters: 6."), (2, "[0]", "Index 0: the first character."), (3, "[3]", "Index 3: the fourth character."), (4, "[-1]", "Negative: counts from the end.")], out="6\nP\nh\nn", cap="Brackets hold the index. len() counts how many characters there are."),
       A("The middle letter", 'word = "hello"\nmid = len(word) // 2\nprint(word[mid])',
         [(1, "len(word) // 2", "5 // 2 is 2: whole-number division."), (2, "word[mid]", "Index 2 is the letter l.")], out="l", cap="Divide the length by 2 (rounding down) to land in the middle.")],
      [T("First, last, and length", 'word = "Python"\nfirst = word[0]\nlast = word[-1]\nsize = len(word)', ['1| word="Python"', '2| first="P"', '3| last="n"', '4| size=6'], cap="word never changes. Each new variable just holds a copy of one piece or one fact about it."),
       T("The off-by-one trap", 'word = "Hello"\nlast = word[len(word) - 1]\nprint(word[5])', ['1| word="Hello"', '2| last="o"'], out="IndexError: string index out of range", cap="Hello has 5 characters at indexes 0 to 4. Line 3 asks for index 5, which does not exist, so Python stops."),
       T("Find the middle", 'word = "hello"\nsize = len(word)\nmid = size // 2\nletter = word[mid]', ['1| word="hello"', '2| size=5', '3| mid=2', '4| letter="l"'], cap="5 // 2 is 2, and index 2 of hello is l (h=0, e=1, l=2).")],
      [("`word[1]` when you want the first letter", "Counting starts at 0, so index 1 is the second letter.", "`word[0]`"), ("`word[len(word)]`", "The last index is `len(word) - 1`, so this is an IndexError.", "`word[len(word) - 1]` or `word[-1]`"), ("`word[6]` on `\"Python\"`", "Only indexes 0 to 5 exist: IndexError.", "Count again. The last index is one less than the length."), ("`word[0] = \"J\"`", "Strings cannot be changed in place: TypeError.", "Build a new string: `\"J\" + word[1:]` (see Lesson 3.6)"),
       ("`word(0)`", "Round brackets mean a function call: TypeError.", "Use square brackets: `word[0]`"), ("`len word`", "`len` needs its round brackets: SyntaxError.", "`len(word)`"), ("Forgetting spaces count", "`len(\"Hello there\")` is 11, not 10.", "Count every character, including spaces")],
      ["Lists on the exam start at index 1. Strings and lists in Python start at index 0.", "An index past the end of a list or string is an error on both the exam and in Python.", "Know how to work out which character an index selects, including `len() - 1` for the last."],
      [Q("What does `\"Python\"[2]` give?", ["`\"y\"`", "`\"t\"`", "`\"h\"`", "an error"], 1, "Indexes: P=0, y=1, t=2."),
       Q("`len(\"Hi there\")` is...", ["6", "7", "8", "2"], 2, "H, i, space, t, h, e, r, e = 8 characters."),
       Q("What does `word[-1]` give for `word = \"Karel\"`?", ["`\"K\"`", "`\"l\"`", "`\"e\"`", "an error"], 1, "A negative index counts from the end, so -1 is the last letter."),
       Q("What happens with this code?", ["Prints `o`", "Prints `l`", "IndexError", "Prints 5"], 2, "Hello has indexes 0 to 4. Index 5 does not exist.", 'word = "Hello"\nprint(word[5])'),
       Q("Which expression always gives the last character of a non-empty string `s`?", ["`s[len(s)]`", "`s[len(s) - 1]`", "`s[0]`", "`s[1]`"], 1, "The last index is one less than the length. `s[-1]` also works.")]),

    L("3.6", "Take a piece of a string with a slice, written `text[start:stop]`.",
      [("slice", "a piece of a string, written `text[start:stop]`"), ("start", "the index where the slice begins (included)"), ("stop", "the index where the slice ends (NOT included)")],
      [("What a slice is", """An index gets **one** character. A **slice** gets a whole piece of the string. You write it with a colon between two numbers inside square brackets: `text[start:stop]`. The slice begins at index `start` and goes up to, but **not including**, index `stop`.

!key: `stop` is not included. The length of a slice is `stop - start`."""),
       ("The slice rule in action", """For `word = "Python"`:

| P | y | t | h | o | n |
|---|---|---|---|---|---|
| 0 | 1 | 2 | 3 | 4 | 5 |

- `word[0:2]` is `"Py"` (indexes 0 and 1)
- `word[2:4]` is `"th"` (indexes 2 and 3)
- `word[1:5]` is `"ytho"` (indexes 1, 2, 3, 4). Its length is 5 - 1 = 4."""),
       ("Leave out a number", """If you leave out `start`, Python starts at the beginning. If you leave out `stop`, it goes all the way to the end.

- `word[:3]` is `"Pyt"` (the first 3 characters)
- `word[2:]` is `"thon"` (from index 2 to the end)
- `word[:]` is the whole string"""),
       ("Negative numbers in slices", """Negative numbers count from the end, the same as in indexing. `word[-3:]` is the **last 3 characters**: `"hon"`. `word[:-1]` is everything **except** the last character: `"Pytho"`."""),
       ("Take apart a phone number", """Slices are perfect for pieces with a fixed shape. For `phone = "770-555-1234"`, the area code is `phone[:3]`, the middle part is `phone[4:7]`, and the last four digits are `phone[-4:]`. Counting positions carefully is the whole skill."""),
       ("A third number: the step", """A slice can have a third number, the **step**: `text[start:stop:step]`. The step says how far to jump each time. `word[::2]` takes every **second** letter, starting at index 0. A **negative** step walks **backward**, so `word[::-1]` reads the whole string from the end to the start: the string **reversed**. The original string is not changed. Leaving out start and stop (`::`) means the whole string."""),
      ],
      [anatomy("The slice word[1:5]", [("P", "0", "Not included: before start."), ("y", "1", "start = 1: included."), ("t", "2", "included"), ("h", "3", "included"), ("o", "4", "included"), ("n", "5", "stop = 5: NOT included.")], size=34, caption="`word[1:5]` keeps indexes 1, 2, 3, and 4, so the answer is ytho."),
       A("Pieces of a phone number", 'phone = "770-555-1234"\narea = phone[:3]\nmiddle = phone[4:7]\nlast4 = phone[-4:]\nprint(area, middle, last4)',
         [(1, "[:3]", "No start: from the beginning, up to index 3."), (2, "[4:7]", "Index 4, 5, 6: skips the dash at index 3."), (3, "[-4:]", "The last four characters.")], out="770 555 1234", cap="Slices pull out exactly the pieces you count out."),
       A("Leave a side out", 'word = "Python"\nprint(word[:3])\nprint(word[2:])\nprint(word[:])',
         [(1, "[:3]", "Start omitted: begins at 0."), (2, "[2:]", "Stop omitted: goes to the end."), (3, "[:]", "Both omitted: a copy of the whole string.")], out="Pyt\nthon\nPython", cap="Leaving out a number means \"as far as it goes\".")],
      [T("Slices of Python", 'word = "Python"\na = word[0:2]\nb = word[2:4]\nc = word[1:5]', ['1| word="Python"', '2| a="Py"', '3| b="th"', '4| c="ytho"'], cap="a uses indexes 0 and 1. b uses 2 and 3. c uses 1, 2, 3, 4. The stop index is never included."),
       T("Phone number", 'phone = "770-555-1234"\narea = phone[:3]\nmid = phone[4:7]\nlast4 = phone[-4:]', ['1| phone="770-555-1234"', '2| area="770"', '3| mid="555"', '4| last4="1234"'], cap="The dashes sit at indexes 3 and 7, so the slices skip them."),
       T("A step in a slice", 'word = "planet"\nevery_other = word[::2]\nbackward = word[::-1]\nlast_two_back = word[:-2]', ['1| word="planet"', '2| every_other="pae"', '3| backward="tenalp"', '4| last_two_back="plan"'], cap="[::2] takes p, a, e (indexes 0, 2, 4). [::-1] reverses the string. [:-2] drops the last two letters. word itself never changes."),
       T("A product code", 'code = "AB-9921"\nletters = code[:2]\nnumber = code[3:]\ntail = code[-2:]', ['1| code="AB-9921"', '2| letters="AB"', '3| number="9921"', '4| tail="21"'], cap="A-B are indexes 0 and 1, the dash is index 2, and 9921 starts at index 3.")],
      [("`word[1:4]` expecting 4 letters", "The stop is not included, so you get 3 letters (indexes 1, 2, 3).", "Length is `stop - start`: use `word[1:5]` for 4"), ("`word[0:2]` and thinking it includes index 2", "It stops before index 2.", "Count from start up to, but not including, stop"), ("`word[3:1]`", "Start is after stop, so you get an empty string `\"\"`, not an error.", "Put the smaller number first"), ("`word[1,3]`", "A comma instead of a colon: TypeError.", "`word[1:3]`"),
       ("Mixing up `[:3]` and `[3:]`", "`[:3]` is the first 3 characters. `[3:]` is everything from index 3 on.", "Say it aloud: \"up to 3\" or \"from 3\""), ("Expecting an error for `word[0:100]`", "A slice that runs past the end just stops at the end. (A single index would crash.)", "Know the string length"), ("Thinking `word[::-1]` changes `word`", "It builds a NEW reversed string. The original stays the same.", "Store it: `back = word[::-1]`"), ("Forgetting the dash in a phone number", "`phone[3:6]` starts at the dash and gives `-55`.", "Write out the indexes, then slice")],
      ["The exam describes a substring operation inside the question and tests whether you can work out which characters it returns.", "Counting positions carefully is the skill. Write the index numbers under the string.", "Know whether the end position is included. Read the question's description of the operation."],
      [Q("What is `\"Python\"[1:4]`?", ["`\"yth\"`", "`\"ytho\"`", "`\"Pyth\"`", "`\"yt\"`"], 0, "Indexes 1, 2, 3: y, t, h."),
       Q("What is `\"Python\"[:2]`?", ["`\"Py\"`", "`\"Pyt\"`", "`\"yt\"`", "`\"on\"`"], 0, "No start means 0. The stop (2) is not included, so indexes 0 and 1."),
       Q("What is `\"Python\"[-2:]`?", ["`\"Py\"`", "`\"on\"`", "`\"hon\"`", "`\"n\"`"], 1, "The last two characters."),
       Q("How many characters are in `text[3:9]`?", ["5", "6", "7", "9"], 1, "Length is stop minus start: 9 - 3 = 6."),
       Q("What is `\"coding\"[::-1]`?", ["`\"gnidoc\"`", "`\"coding\"`", "`\"cdn\"`", "an error"], 0, "A step of -1 walks backward and reverses the string."),
       Q("For `phone = \"770-555-1234\"`, which slice gives `\"555\"`?", ["`phone[3:6]`", "`phone[4:7]`", "`phone[4:6]`", "`phone[5:8]`"], 1, "The 555 sits at indexes 4, 5, 6. The stop is 7.")]),

    L("3.7", "Search a string with `.find()` and use the position it gives back.",
      [("method", "a function that belongs to a value, written with a dot after it, like `text.find(...)`"), ("`.find()`", "tells you the index where some text starts"), ("`-1`", "what `.find()` gives when the text is not found"), ("case-sensitive", "capital and lowercase letters count as different")],
      [("Search for text", """Slices need you to know the positions. But what if you do not? The **`.find()`** method searches a string and tells you the **index where something starts**. A **method** is a function that belongs to a value: you write the value, a dot, the method name, and in the brackets the **text to look for**.

`"Python".find("th")` is `2`, because `th` starts at index 2."""),
       ("When it is not there", """If the text is not found, `.find()` gives back **`-1`**. This does **not** mean index -1. It is the signal for "not found". `.find()` is also **case-sensitive**: `"Python".find("TH")` is `-1` because the capital letters do not match.

When the text appears more than once, `.find()` tells you where the **first** one starts."""),
       ("Slice around what you found", """`.find()` tells you where text starts, and that is exactly what a slice needs. Find the `@` in an email address, then slice the part before it and the part after it:

- `at = email.find("@")` gives the index of the @
- `email[:at]` is everything **before** it (the username)
- `email[at + 1:]` is everything **after** it (the website). The `+ 1` skips the @ itself."""),
       ("Search after a position", """`.find()` can take a second number: where to **start looking**. `word.find("a", 2)` skips the first two characters. This is how you find the **second** match: look again starting just after the first one (`first + 1`)."""),
       ("Is it there? The != -1 test", """Because a missing match gives `-1`, the test `word.find("e") != -1` is **True** when the text is found and **False** when it is not. You will often see it inside an `if`, which you will learn in Unit 4: `if word.find("e") != -1:` means *if e is in the word*."""),
      ],
      [A("What .find() gives back", 'print("Python".find("th"))\nprint("Python".find("P"))\nprint("Python".find("z"))\nprint("Python".find("TH"))',
         [(0, '"th"', "Found: starts at index 2."), (1, '"P"', "Found at index 0."), (2, '"z"', "Not in the word: -1."), (3, '"TH"', "Capitals do not match: -1.")], out="2\n0\n-1\n-1", cap="Read it left to right: the string, a dot, the method, and the text to look for."),
       A("Split an email address", 'email = "ana@mail.com"\nat = email.find("@")\nuser = email[:at]\nsite = email[at + 1:]',
         [(1, 'find("@")', "Finds the @ at index 3."), (2, "[:at]", "Everything before the @."), (3, "at + 1", "One past the @, so the @ is skipped.")], cap="find gives the position, and the slices use it.")],
      [T("Find a word part", 'word = "Python"\npos = word.find("th")\nmiss = word.find("z")\ncaps = word.find("TH")', ['1| word="Python"', '2| pos=2', '3| miss=-1', '4| caps=-1'], cap="th starts at index 2. z is not there. TH has capitals, so it does not match."),
       T("Split an email", 'email = "ana@mail.com"\nat = email.find("@")\nuser = email[:at]\nsite = email[at + 1:]', ['1| email="ana@mail.com"', '2| at=3', '3| user="ana"', '4| site="mail.com"'], cap="The @ is at index 3. [:3] is ana. [4:] starts one past the @ and gives mail.com."),
       T("Find the second match", 'word = "banana"\nfirst = word.find("a")\nsecond = word.find("a", first + 1)\nfound = word.find("z") != -1', ['1| word="banana"', '2| first=1', '3| second=3', '4| found=False'], cap="The first a is at index 1. Searching again starting at index 2 finds the next a at index 3. z is not in the word, so find gives -1 and the test != -1 is False."),
       T("The -1 trap", 'email = "no-at-sign"\nat = email.find("@")\nuser = email[:at]', ['1| email="no-at-sign"', '2| at=-1', '3| user="no-at-sig"'], cap="The @ is missing, so at is -1. The slice [:-1] means \"everything except the last character\", so you get a wrong answer with no error.")],
      [("`\"Python\".find(\"TH\")` and expecting 2", "`.find()` is case-sensitive, so you get -1.", "Match the capitals exactly"), ("Using -1 as a real position", "-1 means not found, but `email[:-1]` quietly drops the last character.", "Check for -1 before you slice (you will learn `if` in Unit 4)"), ("`email[at:]`", "That slice starts at the @, so the @ is included.", "`email[at + 1:]`"), ("`\"Python\".find(z)`", "No quotes, so Python looks for a variable named z: NameError.", "`\"Python\".find(\"z\")`"),
       ("`find` with no brackets", "`word.find` without `(...)` does nothing useful.", "`word.find(\"th\")`"), ("Expecting every position", "`.find()` only tells you where the first match starts.", "Use the first position, then search again after it"), ("`word.find(\"a\", 1)` expecting the first a", "The second number is where to START looking, so it skips index 0.", "Leave it out to search from the beginning"), ("Forgetting to store the result", "`email.find(\"@\")` on its own line is thrown away.", "`at = email.find(\"@\")`")],
      ["The exam does not use Python method names, but it asks you to reason about searching a string and where a piece of text starts.", "A search can return a special value when nothing is found. Know what happens next.", "Combine finding a position with slicing: use one result to cut the text."],
      [Q("What does `\"banana\".find(\"na\")` give?", ["1", "2", "3", "-1"], 1, "The first `na` starts at index 2 (b=0, a=1, n=2)."),
       Q("What does `\"Python\".find(\"x\")` give?", ["0", "-1", "None", "an error"], 1, "Not found gives -1."),
       Q("For `email = \"ana@mail.com\"` and `at = email.find(\"@\")`, what is `email[:at]`?", ["`\"ana\"`", "`\"ana@\"`", "`\"mail.com\"`", "`\"@mail.com\"`"], 0, "The slice stops before the @."),
       Q("`\"Python\".find(\"p\")` gives...", ["0", "-1", "1", "an error"], 1, "Lowercase p is not in Python, which has a capital P.")]),

    L("3.8", "Turn what the user types into a number with `int()` and `float()`, then do math with it.",
      [("`int()`", "turns text (or a float) into a whole number"), ("`float()`", "turns text into a number with a decimal point"), ("convert", "change a value from one type to another"), ("ValueError", "the error when the text cannot be turned into that kind of number")],
      [("Convert text to a whole number", """In Lesson 3.3 you learned that `input()` always gives back a **string**. To do math you must turn the text into a number first. **`int()`** converts text to an **integer** (a whole number). `int("5")` is `5`.

You can do it in two steps, or in one with a shortcut:

- two steps: `age = input("Age? ")` then `age = int(age)`
- the shortcut: `age = int(input("Age? "))`. The `input()` runs first, and `int()` wraps around the answer."""),
       ("Add two numbers the right way", """Without conversion, `"3" + "4"` is `"34"`. With conversion, `int("3") + int("4")` is `7`. Convert **each** answer, and the `+` adds real numbers."""),
       ("Decimals need float()", """`int()` only handles whole numbers. If the user might type a decimal such as `3.5`, use **`float()`**. Using `int("3.5")` is a **ValueError**, because `3.5` is not a whole number. Use `float` for money, measurements, and anything with a decimal point."""),
       ("When NOT to convert", """Only convert a value if you plan to do math with it. A phone number, a zip code, or an ID is not something you add up. Keep these as **strings**. (A phone number such as `0123456789` would also lose its leading zero as an int.) Ask: *will I add, subtract, or multiply this?* If not, leave it as text."""),
       ("Tip calculator and snack bar", """Put it together. A tip calculator reads a bill with `float()` and multiplies it by a percent. A snack bar reads a price and a quantity and multiplies them. The `*` sign multiplies and `-` subtracts, just like on a calculator."""),
      ],
      [A("Convert, then use", 'age = int(input("Age? "))\nnext_year = age + 1\nprint("Next year:", next_year)',
         [(0, "int(", "Turns the typed text into a whole number."), (0, "input(", "Runs first and returns text."), (1, "age + 1", "Real math now: 16 + 1.")], out="Next year: 17", cap="Without int(), line 2 would be a TypeError."),
       A("Add two numbers from the user", 'first = int(input("First: "))\nsecond = int(input("Second: "))\nprint(first + second)',
         [(0, "int(input(", "Convert each answer on its own."), (2, "first + second", "Both are ints, so + adds.")], out="7", cap="The user types 3 and 4 and the program prints 7, not 34."),
       A("Float for decimals", 'bill = float(input("Bill: "))\ntip = bill * 0.15\nprint("Tip:", tip)',
         [(0, "float(", "Allows decimals like 40.50."), (1, "bill * 0.15", "15 percent of the bill.")], out="Tip: 6.0", cap="The user types 40. float makes it 40.0, and the tip is 6.0.")],
      [T("Convert an answer", 'age = input("Age? ")\nage = int(age)\nnext_year = age + 1', ['1| age="16"', '2| age=16', '3| next_year=17'], inp=["16"], cap="Line 1 stores the string \"16\". Line 2 stores the int 16 in the same name, which replaces the string."),
       T("Two numbers", 'first = int(input("First: "))\nsecond = int(input("Second: "))\ntotal = first + second', ['1| first=3', '2| second=4', '3| total=7'], inp=["3", "4"], cap="int() runs on each answer as it arrives. total is the real sum, 7."),
       T("Tip calculator", 'bill = float(input("Bill: "))\ntip = bill * 0.15\ntotal = bill + tip\nprint(total)', ['1| bill=40.0', '2| tip=6.0', '3| total=46.0'], inp=["40"], out="46.0", cap="float(\"40\") is 40.0. 40.0 * 0.15 is 6.0, and the total is 46.0.")],
      [("`print(number + 1)` after `number = input(...)`", "TypeError: text plus a number.", "`number = int(input(...))`"), ("`int(\"3.5\")`", "ValueError: `3.5` is not a whole number.", "`float(\"3.5\")`"), ("`int(input(\"Age? \"))` and the user types `sixteen`", "ValueError: words are not numbers.", "Type digits only (you will learn to guard against this later)"), ("`age = int(input)`", "No brackets after `input`: TypeError.", "`age = int(input(\"Age? \"))`"),
       ("Converting a phone number to an int", "You lose any leading zero and cannot read it back as text.", "Leave phone numbers, zip codes, and IDs as strings"), ("`bill = input(\"Bill: \")` then `bill * 0.15`", "TypeError: you cannot multiply text by a decimal.", "`bill = float(input(\"Bill: \"))`"), ("Converting after you print", "The math already ran with text, so it already failed.", "Convert on the line that reads the input")],
      ["The exam does arithmetic on numbers and expects you to know a value must be a number first.", "A program that reads input and calculates a result is a common exam pattern.", "Pick the right type for the job: whole numbers, decimals, or text."],
      [Q("What does `int(\"12\") + 1` give?", ["`\"121\"`", "13", "12", "an error"], 1, "`int(\"12\")` is the number 12, so adding 1 gives 13."),
       Q("Which converts \"3.5\" without an error?", ["`int(\"3.5\")`", "`float(\"3.5\")`", "`str(\"3.5\")`", "`bool(\"3.5\")`"], 1, "`float` accepts decimals. `int` raises a ValueError."),
       Q("A user types 6 and 7. What does this print?", ["13", "67", "6 7", "an error"], 0, "Both are converted with `int()`, so `+` adds them.", 'a = int(input("A: "))\nb = int(input("B: "))\nprint(a + b)'),
       Q("Which value should stay a string?", ["A quantity the user will multiply", "A price the user will add", "A phone number", "A test score you average"], 2, "You never do math on a phone number, and an int would drop a leading zero.")]),

    L("3.9", "Divide with `/`, which always gives a float, and use it for averages and percents.",
      [("`/`", "division: gives an exact answer with a decimal point"), ("float result", "`/` always gives a float, even when the answer is a whole number"), ("`round()`", "rounds a number to a set number of decimal places"), ("ZeroDivisionError", "the error for dividing by zero")],
      [("Division gives a float", """The `/` operator divides. The answer is **always a float**, even when it divides evenly. `7 / 2` is `3.5`, and `10 / 2` is `5.0` (not `5`). You can prove it with `type(10 / 2)`, which says `float`."""),
       ("Averages", """An average is the total divided by the count. To average three scores, add them up inside **parentheses**, then divide: `(a + b + c) / 3`. Without the parentheses Python would divide only `c` by 3 (see Lesson 3.12)."""),
       ("Percents and rounding", """A percent is the part divided by the whole, times 100: `likes / views * 100`. Long decimals like `91.66666666666667` look messy, so use **`round(number, places)`** to tidy up. `round(91.66666666666667, 2)` is `91.67`."""),
       ("Splitting a cost", """Dividing a bill among friends is `total / people`. The answer can be a decimal, which is what you want for money."""),
       ("The one thing you cannot do", """You cannot divide by zero. `50 / 0` stops the program with a **ZeroDivisionError**. This matters when the divisor comes from the user or from a count that might be zero."""),
       ("Turning a float into an int", """`int()` also works on a float: it **chops off** the decimal part. `int(3.9)` is `3` and `int(7 / 2)` is `3`. It does **not** round: `int(3.9)` is 3, not 4. (Do not confuse this with `int("3.5")`, which is a ValueError because the **text** has a decimal point.)"""),
      ],
      [A("Division is a float", 'a = 7 / 2\nb = 10 / 2\nprint(a)\nprint(b)\nprint(type(b))',
         [(0, "7 / 2", "Not a whole number, so 3.5."), (1, "10 / 2", "Divides evenly, but the answer is still a float: 5.0."), (4, "type(b)", "Proves it.")], out="3.5\n5.0\n<class 'float'>", cap="`/` never gives an int."),
       A("Average with parentheses and round", 'a = 90\nb = 85\nc = 100\navg = (a + b + c) / 3\nprint(round(avg, 2))',
         [(3, "(a + b + c)", "Parentheses make the add happen first."), (3, "/ 3", "Then divide by how many scores."), (4, "round(avg, 2)", "Keeps two decimal places.")], out="91.67", cap="The raw answer is 91.66666666666667. round tidies it."),
       A("Percent", 'likes = 45\nviews = 600\npct = likes / views * 100\nprint(pct)',
         [(2, "likes / views", "Part divided by whole: 0.075."), (2, "* 100", "Times 100 turns it into a percent.")], out="7.5", cap="45 out of 600 is 7.5 percent.")],
      [T("Division makes floats", 'a = 7 / 2\nb = 10 / 2\nc = 1 / 4', ['1| a=3.5', '2| b=5.0', '3| c=0.25'], cap="Every one of these is a float. Even 10 / 2 is 5.0, not 5."),
       T("Average of three scores", 'a = 90\nb = 85\nc = 100\navg = (a + b + c) / 3\navg = round(avg, 2)', ['1| a=90', '2| b=85', '3| c=100', '4| avg=91.66666666666667', '5| avg=91.67'], cap="Line 4 does 275 / 3. Line 5 stores the rounded value back in avg."),
       T("Percent of views", 'likes = 45\nviews = 600\npct = likes / views * 100', ['1| likes=45', '2| views=600', '3| pct=7.5'], cap="45 / 600 is 0.075, and 0.075 * 100 is 7.5."),
       T("int() chops the decimal", 'a = 7 / 2\nb = int(a)\nc = int(3.9)\nd = round(3.9)', ['1| a=3.5', '2| b=3', '3| c=3', '4| d=4'], cap="int chops the decimal part off, so 3.5 and 3.9 both become 3. round goes to the nearest whole number, so 3.9 becomes 4."),
       T("The zero trap", 'total = 50\ncount = 0\naverage = total / count', ['1| total=50', '2| count=0'], out="ZeroDivisionError: division by zero", cap="Line 3 tries to divide by 0. Python stops with an error and average is never created.")],
      [("Expecting `10 / 2` to be `5`", "`/` always gives a float, so it is `5.0`.", "Use `//` if you need a whole number (Lesson 3.10)"), ("`a + b + c / 3` for an average", "Only `c` is divided by 3, because division happens before addition.", "`(a + b + c) / 3`"), ("`50 / 0`", "ZeroDivisionError.", "Make sure the divisor is not zero"), ("`likes / views` and calling it a percent", "That is a fraction like 0.075.", "Multiply by 100"),
       ("Thinking `int(3.9)` rounds to 4", "int chops off the decimal part: it gives 3.", "Use `round(3.9)` to round"), ("Dividing text from the user", "`input(...) / 2` is a TypeError, because the answer is a string.", "`int(input(...)) / 2` or `float(...)`"), ("`round(avg)` when you want two decimals", "With no second number it rounds to a whole number.", "`round(avg, 2)`"), ("Rounding too early", "Rounding each step adds up to a small error.", "Round once, at the end")],
      ["Division on the exam gives an exact result with a decimal when needed. Check whether an answer should be a whole number or not.", "Dividing by zero is an error on the exam and in Python.", "An average is the sum divided by the count. Watch the parentheses."],
      [Q("What does `print(9 / 3)` display?", ["3", "3.0", "3.3", "an error"], 1, "`/` always gives a float."),
       Q("What is `(80 + 90) / 2`?", ["85", "85.0", "125", "170"], 1, "170 / 2 is 85, and it is shown as a float: 85.0."),
       Q("Which line causes a ZeroDivisionError?", ["`print(0 / 5)`", "`print(5 / 0)`", "`print(5 / 5)`", "`print(5 / 1)`"], 1, "Dividing BY zero is the problem. 0 / 5 is fine and is 0.0."),
       Q("What does `round(3.14159, 2)` give?", ["3", "3.1", "3.14", "3.15"], 2, "Two decimal places gives 3.14.")]),

    L("3.10", "Divide with `//` to get a whole-number answer that rounds down.",
      [("`//`", "floor division: divides, then drops the decimal part"), ("floor", "the whole number at or below a value (it rounds down)"), ("quotient", "the answer to a division")],
      [("Divide and round down", """The `//` operator is **floor division**. It divides, and then **rounds the answer down** to a whole number. `17 // 5` is `3`, because 5 goes into 17 three whole times (with some left over). The leftover is thrown away.

Compare the two: `17 / 5` is `3.4` (a float), but `17 // 5` is `3` (an int)."""),
       ("Why use it?", """Use `//` when you only want **whole** things:

- seconds to minutes: `200 // 60` is 3 whole minutes
- boxes: `50 // 12` is 4 full boxes of 12
- chopping off digits: `4821 // 10` is `482` (drops the last digit), and `4821 // 100` is `48`"""),
       ("Negative numbers are a trap", """Rounding **down** means toward the smaller number, and for negatives that is farther from zero. So `-7 // 2` is `-4`, not `-3`. Think of the number line: -3.5 rounds down to -4."""),
       ("The type of the answer", """Two ints with `//` give an **int**. If either number is a float, you still get floor division, but the answer is a float: `7.0 // 2` is `3.0`."""),
      ],
      [A("// versus /", 'print(17 / 5)\nprint(17 // 5)\nprint(20 // 5)',
         [(0, "17 / 5", "Regular division: 3.4."), (1, "17 // 5", "Floor division: 3 whole times."), (2, "20 // 5", "Divides evenly: 4.")], out="3.4\n3\n4", cap="`//` throws the leftover away."),
       A("Seconds to minutes", 'total = 200\nminutes = total // 60\nprint(minutes)',
         [(1, "total // 60", "How many whole minutes fit in 200 seconds? 3.")], out="3", cap="3 minutes and 20 seconds left over (the leftover is the job of % in Lesson 3.11)."),
       A("Chopping off digits", 'n = 4821\nn = n // 10\nprint(n)\nn = n // 10\nprint(n)',
         [(1, "n // 10", "Drops the last digit: 482."), (3, "n // 10", "Drops it again: 48.")], out="482\n48", cap="Dividing by 10 with // removes one digit.")],
      [T("// versus /", 'a = 17 // 5\nb = 17 / 5\nc = 20 // 5', ['1| a=3', '2| b=3.4', '3| c=4'], cap="a and c are ints. b is a float. 17 // 5 rounds 3.4 down to 3."),
       T("Seconds to minutes", 'total = 200\nminutes = total // 60', ['1| total=200', '2| minutes=3'], cap="60 goes into 200 three whole times (180). The other 20 are ignored by //."),
       T("Chop the digits", 'n = 4821\nn = n // 10\nn = n // 10', ['1| n=4821', '2| n=482', '3| n=48'], cap="Each // 10 removes the last digit and keeps the rest."),
       T("Round down, even for negatives", 'x = 7 // 2\ny = -7 // 2', ['1| x=3', '2| y=-4'], cap="7 / 2 is 3.5, which rounds down to 3. -7 / 2 is -3.5, which rounds down to -4.")],
      [("Thinking `//` rounds to the nearest", "It always rounds **down**: `9 // 2` is 4, not 5.", "Remember: floor means down"), ("`-7 // 2` expecting -3", "Rounding down goes to -4.", "Picture the number line"), ("`7 \\ 2` (backslash)", "A backslash is not an operator: SyntaxError.", "Use the forward slash `//`"), ("`10 // 0`", "ZeroDivisionError, just like `/`.", "Never divide by zero"),
       ("Using `//` to get the remainder", "`//` gives the whole-number part. It does not give the leftover.", "Use `%` for the leftover (Lesson 3.11)"), ("Expecting an int from `7.0 // 2`", "A float in the math makes the answer a float: `3.0`.", "Use ints when you want an int"), ("`n // 10` to remove the FIRST digit", "It removes the last digit.", "Use slicing or other tools for the first digit")],
      ["The exam does integer division in problems about counting full groups. Watch for the leftover.", "Know whether a result is a whole number or has a decimal part.", "Trace small examples by hand. If the answer must be a whole number of items, floor the division."],
      [Q("What is `19 // 4`?", ["4", "4.75", "5", "3"], 0, "4 goes into 19 four whole times (16)."),
       Q("What is `-5 // 2`?", ["-2", "-3", "-2.5", "2"], 1, "-2.5 rounds down to -3."),
       Q("What does this print?", ["54", "5", "5.4", "4"], 1, "5 hundreds is `547 // 100`: the last two digits are chopped off.", 'n = 547\nprint(n // 100)'),
       Q("How many whole minutes are in 130 seconds?", ["1", "2", "2.17", "3"], 1, "`130 // 60` is 2 (120 seconds).")]),

    L("3.11", "Find the remainder with `%` and use it with `//` for time, even or odd, digits, and wrapping around.",
      [("`%`", "modulus: the remainder after dividing"), ("remainder", "what is left over after dividing into whole groups"), ("divisible", "divides evenly, with a remainder of 0"), ("wrap around", "going back to the start after reaching the end, like a clock")],
      [("What is left over", """The `%` operator is called **modulus**. It gives the **remainder** after dividing. `17 % 5` is `2`, because 5 goes into 17 three times (15) and 2 is left over.

!key: In Python, `%` does not mean percent. It means \"the remainder\"."""),
       ("`//` and `%` are partners", """Floor division tells you **how many whole times** a number fits. Modulus tells you **what is left**. For 200 seconds: `200 // 60` is 3 minutes and `200 % 60` is 20 seconds. Together they say 3 minutes and 20 seconds."""),
       ("Even, odd, and divisible", """- A number is **even** if `n % 2` is `0`, and **odd** if it is `1`.
- A number **divides evenly** by another when the remainder is `0`: `12 % 4` is `0`, but `12 % 5` is `2`.
- The **last digit** of a whole number is `n % 10`: `4821 % 10` is `1`."""),
       ("Wrapping around", """When a count has to go back to the start, such as hours on a clock, use `%`. Five hours after 10 o'clock is `(10 + 5) % 12`, which is `3`. Every result stays in the range 0 up to one less than the number after `%`.

A small number divided into a bigger one leaves a remainder equal to itself: `3 % 10` is `3`."""),
       ("Make change", """To make change, use both partners: `cents // 25` is the number of quarters, and `cents % 25` is what is left to make with dimes, nickels, and pennies."""),
       ("The biggest remainder", """A remainder is always **smaller than the number you divide by**. For `n % 5` the only possible answers are 0, 1, 2, 3, and 4, so the biggest possible value is **4**. That is why `% 12` always lands on 0 to 11 and wraps a clock."""),
       ("A divisible test", """`n % 3 == 0` asks *is n divisible by 3?* It is True when there is no remainder. You will use it inside an `if` in Unit 4: `if n % 3 == 0: print("divisible")`."""),
      ],
      [A("Remainder", 'print(17 // 5)\nprint(17 % 5)\nprint(12 % 4)',
         [(0, "17 // 5", "5 fits in 17 three times."), (1, "17 % 5", "Left over: 17 - 15 = 2."), (2, "12 % 4", "Divides evenly: remainder 0.")], out="3\n2\n0", cap="The two operators answer two different questions about the same division."),
       A("Minutes and seconds", 'total = 200\nminutes = total // 60\nleft = total % 60\nprint(minutes, left)',
         [(1, "// 60", "Whole minutes."), (2, "% 60", "Seconds left over.")], out="3 20", cap="200 seconds is 3 minutes and 20 seconds."),
       A("Wrap around a clock", 'hour = 10\nlater = (hour + 5) % 12\nprint(later)',
         [(1, "(hour + 5)", "15 on a plain counter."), (1, "% 12", "Wraps back into 0 to 11.")], out="3", cap="Five hours after 10 o'clock is 3 o'clock.")],
      [T("// and % together", 'a = 17 // 5\nb = 17 % 5', ['1| a=3', '2| b=2'], cap="3 whole fives, with 2 left over. Always check: 3 * 5 + 2 is 17."),
       T("Minutes and seconds", 'seconds = 200\nminutes = seconds // 60\nleft = seconds % 60', ['1| seconds=200', '2| minutes=3', '3| left=20'], cap="200 seconds = 3 minutes and 20 seconds."),
       T("Clock wrap-around", 'hour = 10\nlater = (hour + 5) % 12', ['1| hour=10', '2| later=3'], cap="10 + 5 is 15. 15 % 12 is 3, because 12 fits once with 3 left."),
       T("Make change", 'cents = 87\nquarters = cents // 25\nleft = cents % 25', ['1| cents=87', '2| quarters=3', '3| left=12'], cap="3 quarters is 75 cents, and 87 - 75 leaves 12."),
       T("Last digit", 'n = 4821\nlast = n % 10\nrest = n // 10', ['1| n=4821', '2| last=1', '3| rest=482'], cap="% 10 gives the last digit and // 10 gives everything before it.")],
      [("Mixing up `//` and `%`", "`//` is how many times. `%` is what is left.", "Ask: do I want the count or the leftover?"), ("Thinking `3 % 10` is 0", "A smaller number into a bigger one leaves itself: it is `3`.", "Count how many whole times it fits (zero) and what is left (3)"), ("Reading `%` as percent", "In Python, `%` is the remainder.", "Percent is `part / whole * 100`"), ("`n % 2 == 1` for even", "A remainder of 1 means odd.", "Even is `n % 2 == 0`"),
       ("`x % 0`", "ZeroDivisionError.", "Never use 0 after `%`"), ("A 12-hour clock showing 0", "`(12 + 0) % 12` is 0, not 12.", "Know that wrapped values start at 0"), ("Using `/` to get a remainder", "`/` gives a decimal, not a remainder.", "Use `%`")],
      ["Know the MOD operator. The exam writes `a MOD b` for the remainder of a divided by b.", "MOD is used to test even or odd, to test divisibility, and to wrap around.", "Remainders are always smaller than the number you divided by."],
      [Q("What is `23 % 5`?", ["4", "3", "5", "0"], 1, "5 goes into 23 four times (20), with 3 left."),
       Q("Which expression is true when `n` is even?", ["`n % 2 == 1`", "`n % 2 == 0`", "`n // 2 == 0`", "`n % 10 == 0`"], 1, "An even number has a remainder of 0 when divided by 2."),
       Q("What is `4 % 9`?", ["0", "4", "9", "2"], 1, "9 fits zero times in 4, and 4 is left."),
       Q("What does this print?", ["3", "2", "0", "1"], 0, "13 + 2 is 15. 15 % 12 is 3.", 'h = 13\nprint((h + 2) % 12)'),
       Q("What is the last digit of `n = 5934`?", ["`n // 10`", "`n % 10`", "`n % 100`", "`n // 100`"], 1, "`5934 % 10` is 4.")]),

    L("3.12", "Know the order Python does math in, and use parentheses to control it.",
      [("operator", "a symbol that does something to values, like `+` or `*`"), ("parentheses", "round brackets that make Python do that part first"), ("`**`", "the exponent (power) operator: `2 ** 3` is 8"), ("order of operations", "the rules for which math happens first")],
      [("The order", """When a line has more than one operator, Python does them in this order:

1. **Parentheses** `( )`, from the inside out
2. **Powers** `**`
3. **Multiply, divide, floor divide, and modulus** `*  /  //  %`, from **left to right**
4. **Add and subtract** `+  -`, from **left to right**

!key: When two operators are at the same level, work from **left to right**."""),
       ("The classic mistake", """`a + b + c / 3` is not an average. Division comes **before** addition, so Python divides only `c` by 3 and then adds `a` and `b`. Parentheses fix it: `(a + b + c) / 3`."""),
       ("Left to right matters", """At the same level, order matters. `10 / 2 * 5` is `25.0` (divide first, then multiply), but `10 / (2 * 5)` is `1.0`. And `20 // 3 * 3` is `18`, while `20 // (3 * 3)` is `2`."""),
       ("Powers come first", """`2 + 3 ** 2` is `11`, because the power happens before the add. Use parentheses to change it: `(2 + 3) ** 2` is `25`. One more trap: `-2 ** 2` is `-4`, because the power runs first and then the minus sign is applied. `(-2) ** 2` is `4`."""),
       ("MOD with other operators", """`%` is at the same level as `*` and `/`. `10 + 7 % 3` is `11` (7 % 3 is 1, then add), but `(10 + 7) % 3` is `2`."""),
       ("Temperature converter", """Converting Fahrenheit to Celsius is `(f - 32) * 5 / 9`. The parentheses make the subtraction happen first. Without them Python would compute `f - 32 * 5 / 9`, a very different answer."""),
      ],
      [A("The classic average bug", 'a = 90\nb = 85\nc = 100\nwrong = a + b + c / 3\nright = (a + b + c) / 3',
         [(3, "c / 3", "Division runs first: only c is divided."), (4, "(a + b + c)", "Parentheses force the add first.")], cap="wrong is 208.33. right is 91.67."),
       A("Powers and parentheses", 'print(2 + 3 ** 2)\nprint((2 + 3) ** 2)\nprint(-2 ** 2)\nprint((-2) ** 2)',
         [(0, "3 ** 2", "The power first: 9, then 2 + 9."), (1, "(2 + 3)", "Add first: 5, then 5 ** 2."), (2, "-2 ** 2", "Power first: 2 ** 2 = 4, then the minus."), (3, "(-2)", "The minus is inside the parentheses: 4.")], out="11\n25\n-4\n4", cap="Powers outrank everything except parentheses."),
       A("Fahrenheit to Celsius", 'f = 212\nc = (f - 32) * 5 / 9\nprint(c)',
         [(1, "(f - 32)", "Subtract first: 180."), (1, "* 5 / 9", "Left to right: 900, then 100.0.")], out="100.0", cap="Boiling point: 212 F is 100 C.")],
      [T("The average mistake", 'a = 90\nb = 85\nc = 100\nwrong = a + b + c / 3\nright = (a + b + c) / 3', ['1| a=90', '2| b=85', '3| c=100', '4| wrong=208.33333333333334', '5| right=91.66666666666667'], cap="Line 4 does 100 / 3 first (33.33), then 90 + 85 + 33.33. Line 5 adds first (275), then divides."),
       T("Left to right", 'x = 10 / 2 * 5\ny = 10 / (2 * 5)\nz = 20 // 3 * 3', ['1| x=25.0', '2| y=1.0', '3| z=18'], cap="x: 10 / 2 is 5.0, then 5.0 * 5 is 25.0. y: the parentheses make it 10 / 10. z: 20 // 3 is 6, then 6 * 3 is 18."),
       T("Powers first", 'a = 2 + 3 ** 2\nb = (2 + 3) ** 2\nc = -2 ** 2', ['1| a=11', '2| b=25', '3| c=-4'], cap="a: 3 ** 2 is 9, then 2 + 9. b: 5 ** 2. c: 2 ** 2 is 4, then the minus makes -4."),
       T("Temperature", 'f = 212\nc = (f - 32) * 5 / 9', ['1| f=212', '2| c=100.0'], cap="(212 - 32) is 180. 180 * 5 is 900. 900 / 9 is 100.0.")],
      [("`a + b + c / 3` for an average", "Division goes first, so only c is divided.", "`(a + b + c) / 3`"), ("`5 + 3 * 2` expecting 16", "Multiplication first: 5 + 6 = 11.", "`(5 + 3) * 2` if you want 16"), ("`-2 ** 2` expecting 4", "The power runs before the minus: -4.", "`(-2) ** 2`"), ("`10 / 2 * 5` expecting 1", "Left to right: 5.0 * 5 = 25.0.", "`10 / (2 * 5)`"),
       ("`f - 32 * 5 / 9`", "Multiplication happens before the subtraction.", "`(f - 32) * 5 / 9`"), ("`2(3 + 4)`", "Python does not guess a multiplication: TypeError.", "`2 * (3 + 4)`"), ("`x ^ 2` for a square", "`^` is a different operation, not a power.", "`x ** 2`"), ("Missing a closing parenthesis", "SyntaxError: the brackets must match.", "Count the opens and closes")],
      ["The exam follows the same order: parentheses, then multiply/divide/MOD, then add/subtract. Powers are not on the exam's reference sheet, so you may not see `**`.", "MOD has the same priority as `*` and `/` on the exam.", "When unsure, add parentheses to make the order clear."],
      [Q("What is `2 + 3 * 4`?", ["20", "14", "24", "9"], 1, "Multiplication first: 3 * 4 = 12, then 2 + 12."),
       Q("What is `(2 + 3) * 4`?", ["14", "20", "24", "9"], 1, "Parentheses first: 5 * 4."),
       Q("What does `print(10 - 4 - 3)` display?", ["9", "3", "-3", "0"], 1, "Left to right: 10 - 4 = 6, then 6 - 3 = 3."),
       Q("What is `2 ** 3 + 1`?", ["16", "9", "8", "7"], 1, "The power first: 8, then add 1."),
       Q("What is `10 + 7 % 3`?", ["2", "11", "17", "10"], 1, "`7 % 3` is 1 first, then 10 + 1.")]),

    L("3.13", "Trace code by hand, line by line, and predict exactly what it prints.",
      [("trace", "to follow code one line at a time and write down what each variable holds"), ("trace table", "a table with one column for each variable and one row for each line run"), ("output", "what the program prints")],
      [("Why trace?", """Tracing is the skill of **playing computer**. You read the code one line at a time, exactly as Python would, and write down what every variable holds. It is the best way to find bugs, and it is the main skill on the AP exam. Many exam questions show a short program and ask: *What is displayed?*"""),
       ("The method", """1. Make a table with one column for each **variable**.
2. Start at the **first line** and go down in order.
3. For each line, work out its value **before** you write it down. Do the math in the right order (Lesson 3.12).
4. When a line **assigns** a variable, change that column. Leave the others alone.
5. When a line **prints**, add to the output. Printing does not change any variable.
6. A variable only changes when a line assigns to it."""),
       ("Variables that change", """When a line gives a variable a new value, the old value is gone. A line like `x = x + 1` first works out the right side using the **old** x, and then stores the result in x."""),
       ("Text and math", """Trace strings carefully: write the quotes, and watch for indexes and slices that start at 0. For `//` and `%`, work out the whole-number part first, then the remainder."""),
       ("A variable does not follow another", """`b = a` copies the **value** of `a` at that moment. If `a` changes later, `b` stays the same. Many wrong answers on the exam come from assuming `b` changes too."""),
      ],
      [A("A trade between two players", 'a = 10\nb = 20\ntemp = a\na = b\nb = temp',
         [(2, "temp = a", "Save a's value first, or it will be lost."), (3, "a = b", "a gets b's value."), (4, "b = temp", "b gets the saved old a.")], cap="Swapping needs a third variable. Without temp, both would end up the same."),
       A("Update from the old value", 'balance = 100\nbalance = balance + 50\nbalance = balance - 30\nprint(balance)',
         [(1, "balance + 50", "The right side uses the OLD balance: 100 + 50."), (2, "balance - 30", "Then 150 - 30.")], out="120", cap="Each line starts from whatever the last line left behind.")],
      [T("Variables that change", 'x = 5\ny = 2\nx = x + y\ny = x * 2\nprint(x, y)', ['1| x=5', '2| y=2', '3| x=7', '4| y=14'], out="7 14", cap="Line 3 uses x = 5 and y = 2 to make x = 7. Line 4 uses the NEW x to make y = 14."),
       T("A trade", 'a = 10\nb = 20\ntemp = a\na = b\nb = temp\nprint(a, b)', ['1| a=10', '2| b=20', '3| temp=10', '4| a=20', '5| b=10'], out="20 10", cap="The two values change places. temp kept the old a safe."),
       T("Text", 'word = "Python"\nfirst = word[0]\nrest = word[1:]\nnew = rest + first + "ay"\nprint(new)', ['1| word="Python"', '2| first="P"', '3| rest="ython"', '4| new="ythonPay"'], out="ythonPay", cap="Slices and joins on text: ython + P + ay."),
       T("// and %", 'total = 135\nminutes = total // 60\nseconds = total % 60\nprint(minutes, seconds)', ['1| total=135', '2| minutes=2', '3| seconds=15'], out="2 15", cap="60 fits twice in 135 (120), with 15 left."),
       T("A variable does not follow another", 'a = 4\nb = a\na = 9\nprint(a, b)', ['1| a=4', '2| b=4', '3| a=9'], out="9 4", cap="b copied 4. When a becomes 9, b is still 4."),
       T("Order of operations", 'n = 3\nresult = 2 + n * 4 // 5 % 3\nprint(result)', ['1| n=3', '2| result=4'], out="4", cap="Left to right at the same level: 3 * 4 = 12, 12 // 5 = 2, 2 % 3 = 2, then 2 + 2 = 4.")],
      [("Writing a variable's new value on the wrong row", "You use the value from before the line ran.", "Work out the right side first, then update the column"), ("Changing a variable that is only printed", "Printing does not change anything.", "Only assignment lines change a column"), ("Assuming `b` follows `a`", "`b = a` copies once. It is not a link.", "Check whether `b` is assigned again"), ("Skipping the order of operations", "A line like `2 + n * 4` is not `(2 + n) * 4`.", "Do the multiply first"),
       ("Forgetting that the old value is gone", "After `x = x + 1`, the old x does not exist.", "Cross out the old value in your table"), ("Off-by-one on an index", "`word[1]` is the second letter, not the first.", "Write the index numbers under the string"), ("Doing the whole program in your head", "Mistakes pile up.", "Write every row, even for short programs")],
      ["Tracing questions ask: *What is displayed?* Write a table or write values next to each line.", "The exam writes assignment with an arrow: `x ← 5`. `DISPLAY(x)` shows a value. MOD is the remainder.", "Be careful with the order of operations and with variables that change."],
      [Q("What does this program display?", ["12 8", "8 12", "20 8", "12 12"], 0, "x is 12 after line 3. y was 8 and never changes.", 'x = 4\ny = 8\nx = x + y\nprint(x, y)'),
       Q("What does this print?", ["5 3", "3 5", "3 3", "5 5"], 1, "The values swap using `temp`.", 'a = 3\nb = 5\ntemp = a\na = b\nb = temp\nprint(b, a)'),
       Q("What is displayed?", ["abc", "bca", "cab", "abca"], 1, "word[1:] is bc, then + word[0] is a.", 'word = "abc"\nprint(word[1:] + word[0])'),
       Q("What does this print?", ["10", "6", "4", "0"], 2, "`20 // 3` is 6, then `6 % 5` is 1, and 3 + 1 is 4.", 'print(3 + 20 // 3 % 5)'),
       Q("After `a = 2`, `b = a * 3`, `a = 10`, what is `b`?", ["2", "6", "10", "30"], 1, "b copied the value 6 when line 2 ran.")]),
    ],
    glossary=[], seed=3)
