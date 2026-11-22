/* THE GRADED ASSIGNMENTS for Units 3 to 6 (the "assignment" part of every lesson: notes, walkthrough, ASSIGNMENT, game).
   Each one is a small program the student writes from a description (no code is shown), in 2 or 3 steps, graded by the same auto-checker as the walkthroughs.
   The reference program is hidden; node tools/missions/test.mjs proves each one scores 100 through the real editor and the real server scorer.
   Slots and points come from py-table.js. All are published hidden and do not gate anything (passMin 0). */
"use strict";
const M = require("./core.js");
const T = require("./py-table.js");
const V = (n, v) => new RegExp("^\\s*" + n + "\\s*=\\s*" + (v || "\\S"), "m");
const FN = (n, p) => new RegExp("^\\s*def\\s+" + n + "\\s*\\(\\s*" + (p === undefined ? "" : p) + "\\s*\\)\\s*:", "m");
const note = (label) => new RegExp("^\\s*" + label + ":\\s*\\S+(?:\\s+\\S+){2,}", "i");   /* a labeled comment with at least 3 words */
const LINES = (n) => new RegExp("^.*\\S.*$", "m");
const S = (title, say, type, ref, chk, run, rc) => ({ title, say: Array.isArray(say) ? say : [say], type, ref, chk, run, runChk: rc });
const ASG = {};
const def = (id, name, intro, learn, stages, auto) => { ASG[id] = { name, intro, learn, stages, auto }; };

/* ============================================================ UNIT 3 ============ */
def("u3l1", "Name Tag", ["**You run the badge desk at a school club fair.** Make a name tag program that stores facts about a student in variables and prints them as a tag."], ["making variables", "legal names", "printing a variable", "changing a variable"], [
  S("Make three variables", ["Make a variable named **`name`** that holds your name (text, so use quotes), a variable named **`grade`** that holds your grade level (a number, no quotes), and a variable named **`club`** that holds a club name (text)."], "Type the three variables.", `name = "Ava"\ngrade = 10\nclub = "Robotics"`,
    [["a variable named name that holds text", V("name", "[\"']")], ["a variable named grade that holds a number", V("grade", "\\d")], ["a variable named club that holds text", V("club", "[\"']")]], "Nothing prints yet, and that is fine. Make sure there is no red error."),
  S("Print the tag", ["Print three lines: `Name:` then the name, `Grade:` then the grade, and `Club:` then the club. Print the **variables** (no quotes around the variable names) so the tag changes when the variables change."], "Add the three print lines.", `print("Name:", name)\nprint("Grade:", grade)\nprint("Club:", club)`,
    [["printing the name variable", /print\(.*\bname\s*\)/], ["printing the grade variable", /print\(.*\bgrade\s*\)/], ["printing the club variable", /print\(.*\bclub\s*\)/]], "Press Run and check your tag.", [["three tag lines printed", /^(Name|Grade|Club):/, 3]]),
  S("Change a variable", ["A new school year starts. Change `grade` so it becomes **one more than it was** (use `grade = grade + 1`), then print the line `Next year:` followed by the grade."], "Add the change and the print.", `grade = grade + 1\nprint("Next year:", grade)`,
    [["grade changed with grade = grade + 1", /^\s*grade\s*=\s*grade\s*\+\s*1/m], ["printing Next year", /print\(\s*["']Next year:["']/]], "Press Run. Next year should be one bigger than the grade above it.", [["the Next year line", /Next year: \d+/]])]);

def("u3l2", "Pet Profile", ["**You are building a profile page for a pet shop.** Store one fact of each data type, then ask Python what type each one is."], ["strings, ints, floats and booleans", "the type() function"], [
  S("Store the facts", ["Make four variables: **`pet_name`** (a string, like `\"Biscuit\"`), **`pet_age`** (an int, like `3`), **`pet_weight`** (a float, like `12.5`), and **`is_friendly`** (a boolean: `True` or `False`)."], "Type the four variables.", `pet_name = "Biscuit"\npet_age = 3\npet_weight = 12.5\nis_friendly = True`,
    [["pet_name holds a string", V("pet_name", "[\"']")], ["pet_age holds an int", V("pet_age", "\\d+\\s*$")], ["pet_weight holds a float", V("pet_weight", "\\d+\\.\\d+")], ["is_friendly holds True or False", V("is_friendly", "(True|False)\\s*$")]], "Run it. Nothing prints yet."),
  S("Ask for the types", ["Print the **type** of each variable with `print(type(pet_name))` and the same for the other three."], "Add four print lines that use type().", `print(type(pet_name))\nprint(type(pet_age))\nprint(type(pet_weight))\nprint(type(is_friendly))`,
    [["type of pet_name", /type\(\s*pet_name\s*\)/], ["type of pet_age", /type\(\s*pet_age\s*\)/], ["type of pet_weight", /type\(\s*pet_weight\s*\)/], ["type of is_friendly", /type\(\s*is_friendly\s*\)/]], "Run it. You should see str, int, float and bool.", [["a str", /<class 'str'>/], ["an int", /<class 'int'>/], ["a float", /<class 'float'>/], ["a bool", /<class 'bool'>/]])]);

def("u3l3", "Birthday Card", ["**You are making a birthday card machine.** It asks for a name and an age, then prints a message that uses both."], ["input()", "int()", "using what the user typed"], [
  S("Ask the questions", ["Ask for the person's name with `input(\"What is your name? \")` and store it in **`name`**. Then ask `How old are you? ` and store the answer as a **whole number** in **`age`** (wrap the input in `int()`)."], "Type the two input lines.", `name = input("What is your name? ")\nage = int(input("How old are you? "))`,
    [["name from input", /^\s*name\s*=\s*input\(/m], ["age as an int from input", /^\s*age\s*=\s*int\(\s*input\(/m]], "Press Run and type a name and an age when it asks."),
  S("Print the card", ["Print `Happy birthday,` followed by the name. Then print `Next year you will be` followed by the age **plus one**."], "Add the two print lines.", `print("Happy birthday,", name)\nprint("Next year you will be", age + 1)`,
    [["printing the name", /print\(\s*["']Happy birthday,["']\s*,\s*name\s*\)/], ["printing age plus one", /print\(.*\bage\s*\+\s*1\s*\)/]], "Run it with the name Ava and the age 15.", [["the birthday line", /Happy birthday, Ava/], ["the next year line", /Next year you will be 16/]])],
  [{ answers: [["name", "Ava"], ["old", "15"]] }]);

def("u3l4", "Receipt Printer", ["**You are printing a receipt for the school store.** Put text and numbers together in one line, which is trickier than it looks."], ["+ with strings", "str()", "commas in print"], [
  S("Set up the sale", ["Make **`item`** equal to the text `\"Notebook\"`, **`price`** equal to the float `3.5`, and **`qty`** equal to the int `4`."], "Type the three variables.", `item = "Notebook"\nprice = 3.5\nqty = 4`,
    [["item holds Notebook", V("item", "[\"']Notebook")], ["price is 3.5", V("price", "3\\.5")], ["qty is 4", V("qty", "4")]], "Nothing prints yet."),
  S("Print the receipt", ["Print `Item: Notebook` by **joining** the text `\"Item: \"` with the variable using **+**. Then print `Total: $14.0` by joining `\"Total: $\"` with `str(price * qty)`. Remember that + only joins strings, so the number needs `str()`."], "Add the two print lines.", `print("Item: " + item)\nprint("Total: $" + str(price * qty))`,
    [["joining with +", /print\(\s*["']Item: ["']\s*\+\s*item\s*\)/], ["using str() on the total", /\+\s*str\(\s*price\s*\*\s*qty\s*\)/]], "Run it.", [["the item line", /Item: Notebook/], ["the total line", /Total: \$14\.0/]])]);

def("u3l5", "Secret Initials", ["**You are a spy who identifies agents by the first and last letters of a code word.** Pull single characters out of a word with indexing."], ["indexing with [0]", "negative indexes", "len()"], [
  S("Ask for a code word", ["Ask the user with `input(\"Type a word: \")` and store it in **`word`**."], "Type the input line.", `word = input("Type a word: ")`, [["word from input", /^\s*word\s*=\s*input\(/m]], "Run it and type any word."),
  S("Pick out letters", ["Print `First:` and the first letter (index `0`). Print `Last:` and the last letter (index `-1`)."], "Add the two print lines.", `print("First:", word[0])\nprint("Last:", word[-1])`,
    [["the first letter with [0]", /word\s*\[\s*0\s*\]/], ["the last letter with [-1]", /word\s*\[\s*-1\s*\]/]], "Run it with the word python.", [["First: p", /First: p/], ["Last: n", /Last: n/]]),
  S("Measure the word", ["Print `Length:` and the length of the word using `len(word)`. Then print `Last index:` and the index of the last letter, which is **`len(word) - 1`**."], "Add the two print lines.", `print("Length:", len(word))\nprint("Last index:", len(word) - 1)`,
    [["using len(word)", /print\(.*len\(\s*word\s*\)\s*\)/], ["len(word) - 1", /len\(\s*word\s*\)\s*-\s*1/]], "Run it with python again.", [["Length: 6", /Length: 6/], ["Last index: 5", /Last index: 5/]])],
  [{ answers: [["word", "python"]] }]);

def("u3l6", "Word Chopper", ["**You are a word chopper in a puzzle factory.** Take one long word and slice it into pieces."], ["slicing with [start:stop]", "leaving out a start or stop", "negative slices", "reversing with [::-1]"], [
  S("Store the word", ["Make **`word`** equal to the text `\"programming\"`."], "Type the variable.", `word = "programming"`, [["word is programming", V("word", "[\"']programming[\"']")]], "Nothing prints yet."),
  S("Chop it", ["Print `First 3:` with `word[:3]`, `Last 3:` with `word[-3:]`, and `Middle:` with `word[3:7]`."], "Add the three print lines.", `print("First 3:", word[:3])\nprint("Last 3:", word[-3:])\nprint("Middle:", word[3:7])`,
    [["word[:3]", /word\s*\[\s*:\s*3\s*\]/], ["word[-3:]", /word\s*\[\s*-3\s*:\s*\]/], ["word[3:7]", /word\s*\[\s*3\s*:\s*7\s*\]/]], "Run it.", [["First 3: pro", /First 3: pro/], ["Last 3: ing", /Last 3: ing/], ["Middle: gram", /Middle: gram/]]),
  S("Flip it", ["Print `Backwards:` with the whole word reversed using a step of -1: `word[::-1]`."], "Add the last print line.", `print("Backwards:", word[::-1])`,
    [["reversing with [::-1]", /word\s*\[\s*:\s*:\s*-1\s*\]/]], "Run it.", [["the word backwards", /Backwards: gnimmargorp/]])]);

def("u3l7", "Email Splitter", ["**You are cleaning up a mailing list.** Split an email address into the username and the website part, using .find() to locate the @ sign."], [".find()", "slicing around a found position"], [
  S("Find the @", ["Ask for an email with `input(\"Email: \")` and store it in **`email`**. Then store the position of the @ sign in **`at`** with `email.find(\"@\")`."], "Type the input and the find.", `email = input("Email: ")\nat = email.find("@")`,
    [["email from input", /^\s*email\s*=\s*input\(/m], ["finding the @", /^\s*at\s*=\s*email\.find\(\s*["']@["']\s*\)/m]], "Run it and type an email like maria@school.org."),
  S("Split it", ["Store everything **before** the @ in **`user`** (`email[:at]`) and everything **after** it in **`domain`** (`email[at + 1:]`). Print `User:` with the user and `Domain:` with the domain."], "Add the slices and the prints.", `user = email[:at]\ndomain = email[at + 1:]\nprint("User:", user)\nprint("Domain:", domain)`,
    [["slicing the user", /^\s*user\s*=\s*email\s*\[\s*:\s*at\s*\]/m], ["slicing the domain", /^\s*domain\s*=\s*email\s*\[\s*at\s*\+\s*1\s*:\s*\]/m]], "Run it with maria@school.org.", [["User: maria", /User: maria/], ["Domain: school.org", /Domain: school\.org/]])],
  [{ answers: [["email", "maria@school.org"]] }]);

def("u3l8", "Tip Calculator", ["**You are building a restaurant tip calculator.** It asks for the bill and a tip percent, then does the math on what the user typed."], ["int() and float()", "math with typed numbers"], [
  S("Ask for the numbers", ["Ask `Bill amount: ` and store it as a **float** in **`bill`**. Ask `Tip percent: ` and store it as an **int** in **`percent`**."], "Type the two input lines.", `bill = float(input("Bill amount: "))\npercent = int(input("Tip percent: "))`,
    [["bill as a float", /^\s*bill\s*=\s*float\(\s*input\(/m], ["percent as an int", /^\s*percent\s*=\s*int\(\s*input\(/m]], "Run it and type a bill and a percent."),
  S("Do the math", ["Store the tip in **`tip`** (`bill * percent / 100`) and the total in **`total`** (`bill + tip`). Print `Tip:` and the tip, then `Total:` and the total."], "Add the math and the prints.", `tip = bill * percent / 100\ntotal = bill + tip\nprint("Tip:", tip)\nprint("Total:", total)`,
    [["tip = bill * percent / 100", /^\s*tip\s*=\s*bill\s*\*\s*percent\s*\/\s*100/m], ["total = bill + tip", /^\s*total\s*=\s*bill\s*\+\s*tip/m]], "Run it with a bill of 20 and a tip of 15.", [["Tip: 3.0", /Tip: 3\.0/], ["Total: 23.0", /Total: 23\.0/]])],
  [{ answers: [["bill", "20"], ["percent", "15"]] }]);

def("u3l9", "Average Calculator", ["**You are a teacher's helper who averages test scores.** The tricky part is that division gives a float."], ["/ always gives a float", "parentheses in a formula"], [
  S("Get three scores", ["Ask `Score 1: `, `Score 2: ` and `Score 3: ` and store each as an **int** in **`s1`**, **`s2`** and **`s3`**."], "Type the three input lines.", `s1 = int(input("Score 1: "))\ns2 = int(input("Score 2: "))\ns3 = int(input("Score 3: "))`,
    [["three int inputs", /=\s*int\(\s*input\(/, 3]], "Run it and type three scores."),
  S("Find the average", ["Store the average in **`average`**: add the three scores **inside parentheses**, then divide by 3. Print `Average:` and the average."], "Add the formula and the print.", `average = (s1 + s2 + s3) / 3\nprint("Average:", average)`,
    [["adding in parentheses then dividing by 3", /^\s*average\s*=\s*\(\s*s1\s*\+\s*s2\s*\+\s*s3\s*\)\s*\/\s*3/m]], "Run it with 80, 90 and 100.", [["Average: 90.0", /Average: 90\.0/]])],
  [{ answers: [["score 1", "80"], ["score 2", "90"], ["score 3", "100"]] }]);

def("u3l10", "Egg Cartons", ["**You work at a farm stand.** Eggs go into cartons of 12, and you only sell FULL cartons."], ["floor division //", "// versus /"], [
  S("Ask how many eggs", ["Ask `How many eggs? ` and store the answer as an **int** in **`eggs`**."], "Type the input line.", `eggs = int(input("How many eggs? "))`, [["eggs as an int", /^\s*eggs\s*=\s*int\(\s*input\(/m]], "Run it and type a number."),
  S("Count the full cartons", ["Store the number of full cartons in **`cartons`** using floor division by 12 (`eggs // 12`). Print `Full cartons:` and the number."], "Add the math and the print.", `cartons = eggs // 12\nprint("Full cartons:", cartons)`,
    [["floor division by 12", /^\s*cartons\s*=\s*eggs\s*\/\/\s*12/m]], "Run it with 60 eggs.", [["Full cartons: 5", /Full cartons: 5/]]),
  S("Compare with exact division", ["Print `Exact dozens:` and `eggs / 12` (one slash) so you can see the difference between the two kinds of division."], "Add the last print.", `print("Exact dozens:", eggs / 12)`,
    [["true division by 12", /print\(.*eggs\s*\/\s*12\s*\)/]], "Run it with 60 again.", [["Exact dozens: 5.0", /Exact dozens: 5\.0/]])],
  [{ answers: [["eggs", "60"]] }]);

def("u3l11", "Leftover Cookies", ["**You are packing cookies into boxes of 6.** The % operator tells you how many are left over."], ["the remainder %", "// and % together", "even or odd"], [
  S("Ask for the cookies", ["Ask `How many cookies? ` and store it as an **int** in **`cookies`**."], "Type the input line.", `cookies = int(input("How many cookies? "))`, [["cookies as an int", /^\s*cookies\s*=\s*int\(\s*input\(/m]], "Run it and type a number."),
  S("Boxes and leftovers", ["Store the full boxes in **`boxes`** (`cookies // 6`) and the leftovers in **`left`** (`cookies % 6`). Print `Boxes:` and the boxes, then `Left over:` and the leftovers."], "Add the math and the prints.", `boxes = cookies // 6\nleft = cookies % 6\nprint("Boxes:", boxes)\nprint("Left over:", left)`,
    [["boxes with //", /^\s*boxes\s*=\s*cookies\s*\/\/\s*6/m], ["leftovers with %", /^\s*left\s*=\s*cookies\s*%\s*6/m]], "Run it with 45 cookies.", [["Boxes: 7", /Boxes: 7/], ["Left over: 3", /Left over: 3/]]),
  S("Even or odd", ["Print `Even check:` and `cookies % 2`. It is 0 for an even number and 1 for an odd number."], "Add the last print.", `print("Even check:", cookies % 2)`,
    [["cookies % 2", /print\(.*cookies\s*%\s*2\s*\)/]], "Run it with 45 again.", [["Even check: 1", /Even check: 1/]])],
  [{ answers: [["cookies", "45"]] }]);

def("u3l12", "Formula Lab", ["**You are a science lab assistant** who turns formulas into Python. The order of operations decides whether the answer is right."], ["order of operations", "parentheses", "** and *"], [
  S("Temperature", ["Make **`celsius`** equal to `25`. Store the Fahrenheit temperature in **`fahrenheit`** using the formula `celsius * 9 / 5 + 32`. Print `Fahrenheit:` and the answer."], "Type the variable, the formula and the print.", `celsius = 25\nfahrenheit = celsius * 9 / 5 + 32\nprint("Fahrenheit:", fahrenheit)`,
    [["the Fahrenheit formula", /^\s*fahrenheit\s*=\s*celsius\s*\*\s*9\s*\/\s*5\s*\+\s*32/m]], "Run it.", [["Fahrenheit: 77.0", /Fahrenheit: 77\.0/]]),
  S("Rectangle", ["Make **`width`** equal to `7` and **`height`** equal to `4`. Print `Area:` with `width * height`, and print `Perimeter:` with `2 * (width + height)`. The parentheses are needed so the addition happens first."], "Add the variables and the two prints.", `width = 7\nheight = 4\nprint("Area:", width * height)\nprint("Perimeter:", 2 * (width + height))`,
    [["area", /print\(.*width\s*\*\s*height\s*\)/], ["perimeter with parentheses", /2\s*\*\s*\(\s*width\s*\+\s*height\s*\)/]], "Run it.", [["Area: 28", /Area: 28/], ["Perimeter: 22", /Perimeter: 22/]]),
  S("Average", ["Print `Average:` with the average of 80, 90 and 100, written as `(80 + 90 + 100) / 3`."], "Add the last print.", `print("Average:", (80 + 90 + 100) / 3)`,
    [["an average with parentheses", /\(\s*80\s*\+\s*90\s*\+\s*100\s*\)\s*\/\s*3/]], "Run it.", [["Average: 90.0", /Average: 90\.0/]])]);

def("u3l13", "Trace Detective", ["**You are a code detective.** Programs change their variables one line at a time. Build two small programs and predict what they print BEFORE you run them."], ["tracing variables", "swapping with a temp variable", "a running total"], [
  S("Swap two variables", ["Make **`a`** equal to `3` and **`b`** equal to `8`. Swap their values using a third variable named **`temp`**: save `a` in temp, put `b` into a, then put temp into b. Print `a:` with a and `b:` with b on ONE line, like `print(\"a:\", a, \"b:\", b)`."], "Type the swap and the print.", `a = 3\nb = 8\ntemp = a\na = b\nb = temp\nprint("a:", a, "b:", b)`,
    [["saving a in temp", /^\s*temp\s*=\s*a\s*$/m], ["a takes b", /^\s*a\s*=\s*b\s*$/m], ["b takes temp", /^\s*b\s*=\s*temp\s*$/m]], "Predict the output first, then run it.", [["a: 8 b: 3", /a: 8 b: 3/]]),
  S("A running total", ["Make **`total`** equal to `0`. Then add `5` to it (`total = total + 5`), add `7` to it, and finally **double** it (`total = total * 2`). Print `Total:` and the total."], "Add the total program.", `total = 0\ntotal = total + 5\ntotal = total + 7\ntotal = total * 2\nprint("Total:", total)`,
    [["starting at 0", /^\s*total\s*=\s*0\s*$/m], ["adding to total", /^\s*total\s*=\s*total\s*\+\s*\d/m, 2], ["doubling total", /^\s*total\s*=\s*total\s*\*\s*2/m]], "Predict first (0, 5, 12, 24), then run it.", [["Total: 24", /Total: 24/]])]);

/* ============================================================ UNIT 4 ============ */
def("u4l1", "Ride Checker", ["**You run the gate at a theme park ride.** Store True or False answers about riders with comparisons."], ["booleans", "comparisons that make True or False", "not"], [
  S("Store the facts", ["Make **`height`** equal to `52` and **`age`** equal to `9`. Then make **`tall_enough`** equal to `height >= 48` and **`old_enough`** equal to `age >= 8`. Each of those is a **boolean**."], "Type the four variables.", `height = 52\nage = 9\ntall_enough = height >= 48\nold_enough = age >= 8`,
    [["tall_enough from a comparison", /^\s*tall_enough\s*=\s*height\s*>=\s*48/m], ["old_enough from a comparison", /^\s*old_enough\s*=\s*age\s*>=\s*8/m]], "Nothing prints yet."),
  S("Print the results", ["Print `Tall enough:` with `tall_enough`, `Old enough:` with `old_enough`, and `Too short:` with `not tall_enough`."], "Add the three prints.", `print("Tall enough:", tall_enough)\nprint("Old enough:", old_enough)\nprint("Too short:", not tall_enough)`,
    [["printing a boolean", /print\(.*tall_enough\s*\)/], ["using not", /not\s+tall_enough/]], "Run it.", [["Tall enough: True", /Tall enough: True/], ["Old enough: True", /Old enough: True/], ["Too short: False", /Too short: False/]])]);

def("u4l2", "Teen Discount", ["**You run a movie theater.** Teens (13 to 19) get a discount, and so do students. Combine conditions with and, or and not."], ["and", "or", "not"], [
  S("The customer", ["Make **`age`** equal to `16` and **`is_student`** equal to `True`."], "Type the two variables.", `age = 16\nis_student = True`, [["age is 16", V("age", "16")], ["is_student is True", V("is_student", "True")]], "Nothing prints yet."),
  S("Combine the tests", ["Make **`teen`** equal to `age >= 13 and age <= 19`. Make **`discount`** equal to `teen or is_student`. Print `Teen:` with teen and `Discount:` with discount."], "Add the two tests and the prints.", `teen = age >= 13 and age <= 19\ndiscount = teen or is_student\nprint("Teen:", teen)\nprint("Discount:", discount)`,
    [["teen uses and", /^\s*teen\s*=\s*age\s*>=\s*13\s+and\s+age\s*<=\s*19/m], ["discount uses or", /^\s*discount\s*=\s*teen\s+or\s+is_student/m]], "Run it.", [["Teen: True", /Teen: True/], ["Discount: True", /Discount: True/]]),
  S("Use not", ["Print `Full price:` with `not discount`."], "Add the last print.", `print("Full price:", not discount)`, [["using not discount", /print\(.*not\s+discount\s*\)/]], "Run it.", [["Full price: False", /Full price: False/]])]);

def("u4l3", "Lock Tester", ["**You test a combination lock.** Compare a guess with the real code using every comparison operator."], ["== and !=", "< > <= >=", "= versus =="], [
  S("The code and a guess", ["Make **`code`** equal to `4821` and **`guess`** equal to `4821`."], "Type the two variables.", `code = 4821\nguess = 4821`, [["code is 4821", V("code", "4821")], ["guess is 4821", V("guess", "4821")]], "Nothing prints yet."),
  S("Check equal and not equal", ["Print `Match:` with `guess == code`. Print `Different:` with `guess != code`."], "Add the two prints.", `print("Match:", guess == code)\nprint("Different:", guess != code)`,
    [["using ==", /print\(.*guess\s*==\s*code\s*\)/], ["using !=", /print\(.*guess\s*!=\s*code\s*\)/]], "Run it.", [["Match: True", /Match: True/], ["Different: False", /Different: False/]]),
  S("A wrong guess", ["Change `guess` to `4000` (a new line `guess = 4000`). Print `Too low:` with `guess < code`. Print `At least:` with `guess >= code`."], "Add the new guess and the two prints.", `guess = 4000\nprint("Too low:", guess < code)\nprint("At least:", guess >= code)`,
    [["guess changed to 4000", /^\s*guess\s*=\s*4000/m], ["using <", /print\(.*guess\s*<\s*code\s*\)/], ["using >=", /print\(.*guess\s*>=\s*code\s*\)/]], "Run it.", [["Too low: True", /Too low: True/], ["At least: False", /At least: False/]])]);

def("u4l4", "Weather Advisor", ["**You are a weather app.** It asks for the temperature and gives advice with if statements."], ["if statements", "indentation", "conditions"], [
  S("Ask the temperature", ["Ask `Temperature? ` and store the answer as an **int** in **`temp`**."], "Type the input line.", `temp = int(input("Temperature? "))`, [["temp as an int", /^\s*temp\s*=\s*int\(\s*input\(/m]], "Run it and type a number."),
  S("Give advice", ["If `temp` is **below 50**, print `Wear a jacket`. If `temp` is **above 90**, print `Drink water`. Remember the colon and the indented lines."], "Add the two if statements.", `if temp < 50:\n    print("Wear a jacket")\nif temp > 90:\n    print("Drink water")`,
    [["an if for cold", /^\s*if\s+temp\s*<\s*50\s*:/m], ["an if for hot", /^\s*if\s+temp\s*>\s*90\s*:/m]], "Run it with 40.", [["Wear a jacket", /Wear a jacket/]]),
  S("Always say goodbye", ["After both ifs, with **no indent**, print `Have a nice day`. It should print no matter the temperature."], "Add the last print (not indented).", `print("Have a nice day")`,
    [["a print that is not indented", /^print\(\s*["']Have a nice day["']\s*\)/m]], "Run it with 40.", [["Have a nice day", /Have a nice day/]])],
  [{ answers: [["temperature", "40"]] }]);

def("u4l5", "Grade Calculator", ["**You are a grade book.** Turn a score into a letter with if, elif and else."], ["if / elif / else", "only one branch runs"], [
  S("Ask for the score", ["Ask `Score? ` and store it as an **int** in **`score`**."], "Type the input line.", `score = int(input("Score? "))`, [["score as an int", /^\s*score\s*=\s*int\(\s*input\(/m]], "Run it and type a score."),
  S("Choose the letter", ["Print `Grade: A` if the score is **90 or more**, `Grade: B` if it is **80 or more**, `Grade: C` if it is **70 or more**, and `Grade: F` otherwise. Use **if, elif, elif, else**."], "Add the whole chain.", `if score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: C")\nelse:\n    print("Grade: F")`,
    [["an if for A", /^\s*if\s+score\s*>=\s*90\s*:/m], ["two elifs", /^\s*elif\s+score\s*>=\s*\d+\s*:/m, 2], ["an else", /^\s*else\s*:/m]], "Run it with 85.", [["Grade: B", /Grade: B/]])],
  [{ answers: [["score", "85"]] }]);

def("u4l6", "Arrow Key Mapper", ["**You are writing the controls for a game.** In a real game a key handler gets event.key. Here you will practice the same if / elif chain with the key typed by the user."], ["if / elif chains for keys", "event.key names like ArrowLeft"], [
  S("Start position and key", ["Make **`x`** equal to `100` and **`y`** equal to `100`. Ask `Key? ` and store the answer in **`key`**."], "Type the variables and the input.", `x = 100\ny = 100\nkey = input("Key? ")`, [["x is 100", V("x", "100")], ["y is 100", V("y", "100")], ["key from input", /^\s*key\s*=\s*input\(/m]], "Run it and type ArrowLeft."),
  S("Move the player", ["If `key` is `\"ArrowLeft\"` subtract 10 from `x`. If it is `\"ArrowRight\"` add 10 to `x`. If it is `\"ArrowUp\"` subtract 10 from `y`. If it is `\"ArrowDown\"` add 10 to `y`. Use **if** then **elif** for the rest. **Else** print `Unknown key`."], "Add the chain.", `if key == "ArrowLeft":\n    x = x - 10\nelif key == "ArrowRight":\n    x = x + 10\nelif key == "ArrowUp":\n    y = y - 10\nelif key == "ArrowDown":\n    y = y + 10\nelse:\n    print("Unknown key")`,
    [["an if for ArrowLeft", /^\s*if\s+key\s*==\s*["']ArrowLeft["']\s*:/m], ["three elifs", /^\s*elif\s+key\s*==\s*["']Arrow\w+["']\s*:/m, 3], ["an else", /^\s*else\s*:/m]], "Run it with ArrowLeft."),
  S("Show the position", ["Print `x:` then x then `y:` then y on one line: `print(\"x:\", x, \"y:\", y)`."], "Add the last print.", `print("x:", x, "y:", y)`, [["printing x and y", /print\(\s*["']x:["']\s*,\s*x\s*,\s*["']y:["']\s*,\s*y\s*\)/]], "Run it with ArrowLeft.", [["x: 90 y: 100", /x: 90 y: 100/]])],
  [{ answers: [["key", "ArrowLeft"]] }]);

def("u4l7", "Countdown Launch", ["**You are mission control.** Use for loops to repeat actions and to count."], ["for loops", "range()", "the loop variable"], [
  S("Cheer three times", ["Use a for loop with `range(3)` to print `Hip hip hooray!` three times."], "Type the loop.", `for i in range(3):\n    print("Hip hip hooray!")`,
    [["a for loop with range(3)", /^\s*for\s+\w+\s+in\s+range\(\s*3\s*\)\s*:/m]], "Run it.", [["three cheers", /Hip hip hooray!/, 3]]),
  S("A times table", ["Use a for loop with `range(1, 6)` and the variable `i` to print the 7 times table in the form `1 x 7 = 7`: `print(i, \"x 7 =\", i * 7)`."], "Add the second loop.", `for i in range(1, 6):\n    print(i, "x 7 =", i * 7)`,
    [["a for loop with range(1, 6)", /^\s*for\s+i\s+in\s+range\(\s*1\s*,\s*6\s*\)\s*:/m], ["using i * 7", /i\s*\*\s*7/]], "Run it.", [["1 x 7 = 7", /1 x 7 = 7/], ["5 x 7 = 35", /5 x 7 = 35/]])]);

def("u4l8", "Number Patterns", ["**You are a pattern maker.** Count by twos, count backward and walk through a word, all with for loops."], ["range(start, stop, step)", "counting down", "looping through a string"], [
  S("Even numbers", ["Print `Even:` and each even number from 2 to 20 with `range(2, 21, 2)`."], "Type the loop.", `for i in range(2, 21, 2):\n    print("Even:", i)`,
    [["range with a step of 2", /range\(\s*2\s*,\s*21\s*,\s*2\s*\)/]], "Run it.", [["Even: 2", /Even: 2$/], ["Even: 20", /Even: 20$/]]),
  S("Count down", ["Count down from 10 to 2 by twos with `range(10, 0, -2)`. Print `Count:` and the number."], "Add the second loop.", `for i in range(10, 0, -2):\n    print("Count:", i)`,
    [["a negative step", /range\(\s*10\s*,\s*0\s*,\s*-2\s*\)/]], "Run it.", [["Count: 10", /Count: 10/], ["Count: 2", /Count: 2$/]]),
  S("Walk through a word", ["Loop through each letter of `\"python\"` with `for ch in \"python\":` and print `Letter:` and the letter."], "Add the third loop.", `for ch in "python":\n    print("Letter:", ch)`,
    [["looping over a string", /^\s*for\s+ch\s+in\s+["']python["']\s*:/m]], "Run it.", [["Letter: p", /Letter: p/], ["Letter: n", /Letter: n/]])]);

def("u4l9", "Totals Machine", ["**You are a cash register.** Use the accumulator pattern: start a total at 0, add to it inside a loop, and print after the loop."], ["the accumulator pattern", "input inside a loop"], [
  S("Start the total", ["Make **`total`** equal to `0` **before** the loop."], "Type the variable.", `total = 0`, [["total starts at 0", /^\s*total\s*=\s*0\s*$/m]], "Nothing prints yet."),
  S("Ask three times", ["Use `for i in range(3):`. Inside, ask `Score: ` and store it as an **int** in **`score`**, then add it to the total (`total = total + score`)."], "Add the loop.", `for i in range(3):\n    score = int(input("Score: "))\n    total = total + score`,
    [["a loop that runs 3 times", /^\s*for\s+\w+\s+in\s+range\(\s*3\s*\)\s*:/m], ["input inside the loop", /^\s+score\s*=\s*int\(\s*input\(/m], ["adding to the total", /^\s+total\s*=\s*total\s*\+\s*score/m]], "Run it and type three scores."),
  S("Print after the loop", ["After the loop (not indented) print `Total:` and the total, then `Average:` and `total / 3`."], "Add the two prints.", `print("Total:", total)\nprint("Average:", total / 3)`,
    [["a print that is not indented", /^print\(\s*["']Total:["']/m], ["average with total / 3", /print\(.*total\s*\/\s*3\s*\)/]], "Run it with 80, 90 and 100.", [["Total: 270", /Total: 270/], ["Average: 90.0", /Average: 90\.0/]])],
  [{ answers: [["score", "80"], ["score", "90"], ["score", "100"]] }]);

def("u4l10", "Savings Goal", ["**You are saving for a new game controller.** You do not know how many weeks it will take, so use a while loop."], ["while loops", "a condition that changes", "counting trips"], [
  S("Set up", ["Make **`balance`** equal to `0`, **`goal`** equal to `50` and **`weeks`** equal to `0`."], "Type the three variables.", `balance = 0\ngoal = 50\nweeks = 0`, [["balance starts at 0", V("balance", "0")], ["goal is 50", V("goal", "50")], ["weeks starts at 0", V("weeks", "0")]], "Nothing prints yet."),
  S("Save every week", ["Use `while balance < goal:`. Each trip add `12` to the balance and add `1` to weeks."], "Add the loop.", `while balance < goal:\n    balance = balance + 12\n    weeks = weeks + 1`,
    [["a while loop on balance < goal", /^\s*while\s+balance\s*<\s*goal\s*:/m], ["adding 12 each trip", /^\s+balance\s*=\s*balance\s*\+\s*12/m], ["counting the weeks", /^\s+weeks\s*=\s*weeks\s*\+\s*1/m]], "Run it."),
  S("Report", ["After the loop print `Weeks:` and the weeks, then `Balance:` and the balance."], "Add the two prints.", `print("Weeks:", weeks)\nprint("Balance:", balance)`, [["a print after the loop", /^print\(\s*["']Weeks:["']/m]], "Run it.", [["Weeks: 5", /Weeks: 5/], ["Balance: 60", /Balance: 60/]])]);

def("u4l11", "Guess the Number", ["**You are making a guessing game.** You cannot know how many guesses it will take, and you must ask BEFORE you can check. That is the loop and a half."], ["while True", "break", "a sentinel stop"], [
  S("The secret", ["Make **`secret`** equal to `7` and **`tries`** equal to `0`."], "Type the two variables.", `secret = 7\ntries = 0`, [["secret is 7", V("secret", "7")], ["tries starts at 0", V("tries", "0")]], "Nothing prints yet."),
  S("The guessing loop", ["Use `while True:`. Inside: ask `Guess: ` and store it as an **int** in **`guess`**, add 1 to tries, and if `guess == secret` print `Correct!` and **break**. Otherwise print `Try again`."], "Add the loop.", `while True:\n    guess = int(input("Guess: "))\n    tries = tries + 1\n    if guess == secret:\n        print("Correct!")\n        break\n    print("Try again")`,
    [["a while True loop", /^\s*while\s+True\s*:/m], ["input inside the loop", /^\s+guess\s*=\s*int\(\s*input\(/m], ["a break", /^\s+break\s*$/m]], "Run it and guess 3 then 7."),
  S("Report the tries", ["After the loop print `Tries:` and the number of tries."], "Add the last print.", `print("Tries:", tries)`, [["a print after the loop", /^print\(\s*["']Tries:["']/m]], "Run it and guess 3 then 7.", [["Try again", /Try again/], ["Correct!", /Correct!/], ["Tries: 2", /Tries: 2/]])],
  [{ answers: [["guess", "3"], ["guess", "7"]] }]);

def("u4l12", "Dice Roller", ["**You are a board game designer.** Use the random module to roll a die, flip a coin and roll until you get a 6."], ["import random", "random.randint()", "random with if and while"], [
  S("Roll a die", ["Type `import random` at the top. Then store a random whole number from 1 to 6 in **`roll`** with `random.randint(1, 6)`, and print `You rolled` and the roll."], "Type the import, the roll and the print.", `import random\nroll = random.randint(1, 6)\nprint("You rolled", roll)`,
    [["import random", /^\s*import\s+random\s*$/m], ["randint(1, 6)", /random\.randint\(\s*1\s*,\s*6\s*\)/]], "Run it a few times. The number changes.", [["a roll from 1 to 6", /You rolled [1-6]\b/]]),
  S("Flip a coin", ["Store `random.randint(0, 1)` in **`flip`**. If it is `0` print `Heads`, otherwise print `Tails`."], "Add the coin flip.", `flip = random.randint(0, 1)\nif flip == 0:\n    print("Heads")\nelse:\n    print("Tails")`,
    [["randint(0, 1)", /random\.randint\(\s*0\s*,\s*1\s*\)/], ["an if on the flip", /^\s*if\s+flip\s*==\s*0\s*:/m]], "Run it.", [["Heads or Tails", /^(Heads|Tails)$/]]),
  S("Roll until a 6", ["Make **`rolls`** equal to `0` and **`r`** equal to `0`. Use `while r != 6:` and each trip set `r` to a new random roll and add 1 to rolls. Print `Rolls to get a 6:` and the count."], "Add the loop and the print.", `rolls = 0\nr = 0\nwhile r != 6:\n    r = random.randint(1, 6)\n    rolls = rolls + 1\nprint("Rolls to get a 6:", rolls)`,
    [["a while loop until 6", /^\s*while\s+r\s*!=\s*6\s*:/m], ["counting the rolls", /^\s+rolls\s*=\s*rolls\s*\+\s*1/m]], "Run it.", [["the count", /Rolls to get a 6: \d+/]])]);

/* ============================================================ UNIT 5 ============ */
def("u5l1", "Greeter Machine", ["**You are building a greeting machine.** Write functions once and call them as many times as you like."], ["def", "parameters", "calling a function"], [
  S("Write greet", ["Write a function named **`greet`** with one parameter, **`name`**. It prints `Hello` and the name."], "Type the function.", `def greet(name):\n    print("Hello", name)`, [["def greet(name):", FN("greet", "name")], ["printing inside greet", /^\s+print\(\s*["']Hello["']\s*,\s*name\s*\)/m]], "Run it. Nothing prints yet because the function is not called."),
  S("Call it twice", ["Call `greet(\"Ava\")` and `greet(\"Ben\")` below the function (no indent)."], "Add the two calls.", `greet("Ava")\ngreet("Ben")`, [["two calls to greet", /^greet\(/m, 2]], "Run it.", [["Hello Ava", /Hello Ava/], ["Hello Ben", /Hello Ben/]]),
  S("Write shout", ["Write **`shout(word)`** that prints the word joined with `\"!\"`. Call it with `\"hooray\"`."], "Add the function and the call.", `def shout(word):\n    print(word + "!")\n\nshout("hooray")`, [["def shout(word):", FN("shout", "word")], ["a call to shout", /^shout\(\s*["']hooray["']\s*\)/m]], "Run it.", [["hooray!", /hooray!/]])]);

def("u5l2", "Rectangle Maker", ["**You are a carpenter's helper.** One function with TWO parameters finds both the area and the perimeter of any rectangle."], ["multiple parameters", "arguments matched by position"], [
  S("Write the function", ["Write **`show_rectangle(width, height)`**. It prints `Area:` and `width * height`, then `Perimeter:` and `2 * (width + height)`."], "Type the function.", `def show_rectangle(width, height):\n    print("Area:", width * height)\n    print("Perimeter:", 2 * (width + height))`,
    [["two parameters", FN("show_rectangle", "width\\s*,\\s*height")], ["the perimeter formula", /2\s*\*\s*\(\s*width\s*\+\s*height\s*\)/]], "Run it. Nothing prints yet."),
  S("Call it twice", ["Call `show_rectangle(5, 3)` and then `show_rectangle(10, 2)`."], "Add the two calls.", `show_rectangle(5, 3)\nshow_rectangle(10, 2)`, [["two calls", /^show_rectangle\(\s*\d+\s*,\s*\d+\s*\)/m, 2]], "Run it.", [["Area: 15", /Area: 15/], ["Perimeter: 16", /Perimeter: 16/], ["Area: 20", /Area: 20/], ["Perimeter: 24", /Perimeter: 24/]])]);

def("u5l3", "Temperature Converter", ["**You are a weather station.** Write functions that RETURN answers so other code can use them."], ["return", "using a returned value", "print versus return"], [
  S("Celsius to Fahrenheit", ["Write **`c_to_f(c)`** that **returns** `c * 9 / 5 + 32`. Print `c_to_f(100)`."], "Type the function and the print.", `def c_to_f(c):\n    return c * 9 / 5 + 32\n\nprint(c_to_f(100))`, [["def c_to_f(c)", FN("c_to_f", "c")], ["a return", /^\s+return\s+c\s*\*\s*9\s*\/\s*5\s*\+\s*32/m]], "Run it.", [["212.0", /^212\.0$/m]]),
  S("Fahrenheit to Celsius", ["Write **`f_to_c(f)`** that returns `(f - 32) * 5 / 9`. Print `f_to_c(212)`."], "Add the second function and print.", `def f_to_c(f):\n    return (f - 32) * 5 / 9\n\nprint(f_to_c(212))`, [["def f_to_c(f)", FN("f_to_c", "f")], ["a return", /^\s+return\s+\(\s*f\s*-\s*32\s*\)\s*\*\s*5\s*\/\s*9/m]], "Run it.", [["100.0", /^100\.0$/m]]),
  S("Use the result", ["Print `c_to_f(0)` too. Because the function RETURNS a value, you can print it, store it, or use it in math."], "Add one more print.", `print(c_to_f(0))`, [["calling c_to_f with 0", /c_to_f\(\s*0\s*\)/]], "Run it.", [["32.0", /^32\.0$/m]])]);

def("u5l4", "Grade Helper", ["**You are a grade helper.** Write functions that make decisions and use loops, and RETURN their answers."], ["return inside if / elif / else", "return after a loop"], [
  S("A letter function", ["Write **`letter(score)`**. It **returns** `\"A\"` for 90 or more, `\"B\"` for 80 or more, and `\"C or lower\"` otherwise. Print `letter(95)`, `letter(85)` and `letter(50)`."], "Type the function and three prints.", `def letter(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    else:\n        return "C or lower"\n\nprint(letter(95))\nprint(letter(85))\nprint(letter(50))`,
    [["def letter(score)", FN("letter", "score")], ["an if and an elif that return", /^\s+return\s+["']B["']/m], ["an else that returns", /^\s+return\s+["']C or lower["']/m]], "Run it.", [["A", /^A$/m], ["B", /^B$/m], ["C or lower", /^C or lower$/m]]),
  S("A loop function", ["Write **`total_to(n)`**. It adds 1 + 2 + ... + n using a loop and **returns** the total **after** the loop. Print `total_to(10)`."], "Add the function and the print.", `def total_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n\nprint(total_to(10))`,
    [["def total_to(n)", FN("total_to", "n")], ["a loop over range(1, n + 1)", /for\s+i\s+in\s+range\(\s*1\s*,\s*n\s*\+\s*1\s*\)/], ["returning after the loop", /^    return\s+total\s*$/m]], "Run it.", [["55", /^55$/m]])]);

def("u5l5", "Circle Calculator", ["**You are using other people's code.** Libraries give you ready-made procedures. Read how to call them, then use them."], ["import math", "math.pi and math.sqrt", "max and round", "import random"], [
  S("The math library", ["Type `import math`. Make **`radius`** equal to `5`. Store `math.pi * radius ** 2` in **`area`**. Print `Area:` and `round(area, 2)`."], "Type the import, the math and the print.", `import math\nradius = 5\narea = math.pi * radius ** 2\nprint("Area:", round(area, 2))`,
    [["import math", /^\s*import\s+math\s*$/m], ["using math.pi", /math\.pi/], ["round(area, 2)", /round\(\s*area\s*,\s*2\s*\)/]], "Run it.", [["Area: 78.54", /Area: 78\.54/]]),
  S("More tools", ["Print `Root of 144:` and `math.sqrt(144)`. Print `Biggest:` and `max(3, 9, 5)`."], "Add the two prints.", `print("Root of 144:", math.sqrt(144))\nprint("Biggest:", max(3, 9, 5))`, [["math.sqrt", /math\.sqrt\(\s*144\s*\)/], ["max", /max\(\s*3\s*,\s*9\s*,\s*5\s*\)/]], "Run it.", [["Root of 144: 12.0", /Root of 144: 12\.0/], ["Biggest: 9", /Biggest: 9/]]),
  S("The random library", ["Type `import random`. Store a random roll from 1 to 6 in **`dice`** and print `Dice:` and the roll."], "Add the import and the roll.", `import random\ndice = random.randint(1, 6)\nprint("Dice:", dice)`, [["import random", /^\s*import\s+random\s*$/m], ["random.randint(1, 6)", /random\.randint\(\s*1\s*,\s*6\s*\)/]], "Run it.", [["a roll from 1 to 6", /Dice: [1-6]\b/]])]);

def("u5l6", "Star Line Builder", ["**You are writing a procedure like the one the Create Task needs:** it has a parameter that changes what it does, and its steps use sequencing, selection and iteration."], ["a procedure with a parameter", "sequencing, selection, iteration inside", "calling it with different arguments"], [
  S("The procedure", ["Write **`star_line(count)`**. Start with an empty string `line`. Use a **for loop** to add one `\"*\"` to `line` for each count. If `count` is **greater than 5**, also add `\" wow!\"`. **Return** the line."], "Type the procedure.", `def star_line(count):\n    line = ""\n    for i in range(count):\n        line = line + "*"\n    if count > 5:\n        line = line + " wow!"\n    return line`,
    [["a procedure with a parameter", FN("star_line", "count")], ["iteration (a for loop)", /^\s+for\s+\w+\s+in\s+range\(\s*count\s*\)\s*:/m], ["selection (an if)", /^\s+if\s+count\s*>\s*5\s*:/m], ["a return", /^\s+return\s+line\s*$/m]], "Run it. Nothing prints yet."),
  S("Call it twice", ["Print `star_line(3)` and `star_line(7)`. The argument changes the result: that is why the parameter earns credit."], "Add the two prints.", `print(star_line(3))\nprint(star_line(7))`, [["two calls with different arguments", /star_line\(\s*\d+\s*\)/, 2]], "Run it.", [["***", /^\*\*\*$/m], ["******* wow!", /^\*{7} wow!$/m]])]);

/* ============================================================ UNIT 6 ============ */
def("u6l1", "Requirements Checklist", ["**You are building the smallest program that meets every Create Task requirement.** A fruit counter asks for a fruit and counts how many times it appears in a list."], ["input", "a list", "a procedure with a parameter", "sequencing, selection, iteration", "calling the procedure", "output"], [
  S("Input and list", ["Ask `Pick a fruit: ` and store it in **`choice`**. Make a list **`fruits`** that holds at least four items, with `\"apple\"` in it twice: `[\"apple\", \"pear\", \"apple\", \"plum\"]`."], "Type the input and the list.", `choice = input("Pick a fruit: ")\nfruits = ["apple", "pear", "apple", "plum"]`,
    [["input from the user", /^\s*choice\s*=\s*input\(/m], ["a list with items", /^\s*fruits\s*=\s*\[\s*["'][^\]]*,[^\]]*,[^\]]*,[^\]]*\]/m]], "Run it and type apple."),
  S("The procedure", ["Write **`count_matches(items, target)`** with TWO parameters. Inside: set `count = 0` (sequencing), loop over `items` (iteration), and `if item == target:` add 1 to count (selection). **Return** the count."], "Add the procedure above the input line or below the list.", `def count_matches(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count`,
    [["a procedure with two parameters", FN("count_matches", "items\\s*,\\s*target")], ["iteration over the list", /^\s+for\s+item\s+in\s+items\s*:/m], ["selection", /^\s+if\s+item\s*==\s*target\s*:/m], ["a return", /^\s+return\s+count\s*$/m]], "Run it. Nothing new prints yet."),
  S("Call it and show the result", ["Call the procedure with the list and the choice, store the answer in **`result`**, and print `Matches:` and the result."], "Add the call and the print.", `result = count_matches(fruits, choice)\nprint("Matches:", result)`,
    [["a call with two arguments", /^\s*result\s*=\s*count_matches\(\s*fruits\s*,\s*choice\s*\)/m]], "Run it with apple.", [["Matches: 2", /Matches: 2/]])],
  [{ answers: [["fruit", "apple"]] }]);

def("u6l2", "Video and PPR Plan", ["**You are planning your Create Task submission.** Write the plan as comments, build a small program, then label the parts of it you would show in the video and the Personalized Project Reference (PPR)."], ["the plan", "video captions (no narration)", "PPR segments"], [
  S("The plan", ["Write four comment lines at the top. Each one is a label, a colon, then at least three words: `# PURPOSE:`, `# INPUT:`, `# OUTPUT:` and `# FUNCTIONALITY:`."], "Type the four plan comments.", `# PURPOSE: count how many times a pet appears in a list\n# INPUT: the user types a pet name\n# OUTPUT: the number of matches is printed\n# FUNCTIONALITY: loops through the list and counts the matching pets`,
    [["a PURPOSE note", note("PURPOSE"), 1, "comments"], ["an INPUT note", note("INPUT"), 1, "comments"], ["an OUTPUT note", note("OUTPUT"), 1, "comments"], ["a FUNCTIONALITY note", note("FUNCTIONALITY"), 1, "comments"]], "Run it. Nothing happens because it is only comments."),
  S("The program", ["Make a list **`pets`** with at least four pets (`\"cat\"` three times). Write **`count_pet(items, target)`** that loops and counts matches with an if, and returns the count. Ask `Which pet? ` for **`choice`** and print `Matches:` with `count_pet(pets, choice)`."], "Add the program.", `pets = ["cat", "dog", "cat", "fish", "cat"]\n\ndef count_pet(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count\n\nchoice = input("Which pet? ")\nprint("Matches:", count_pet(pets, choice))`,
    [["a list of pets", /^\s*pets\s*=\s*\[/m], ["a procedure with two parameters", FN("count_pet", "items\\s*,\\s*target")], ["a loop and an if inside", /^\s+if\s+item\s*==\s*target\s*:/m], ["calling count_pet in the print", /print\(.*count_pet\(\s*pets\s*,\s*choice\s*\)/]], "Run it with cat.", [["Matches: 3", /Matches: 3/]]),
  S("Video captions and PPR notes", ["Add three **video caption** comments (text captions, because no voice narration is allowed): `# VIDEO CAPTION 1:` input, `# VIDEO CAPTION 2:` functionality, `# VIDEO CAPTION 3:` output. Then add two PPR notes: `# PPR PROCEDURE:` and `# PPR LIST:` naming the segments you would copy. Each needs at least three words."], "Add the five comment lines at the bottom.", `# VIDEO CAPTION 1: typing the pet name cat as the input\n# VIDEO CAPTION 2: the program counts the matching pets\n# VIDEO CAPTION 3: the output shows three matches\n# PPR PROCEDURE: the count_pet procedure with its two parameters\n# PPR LIST: the pets list and the loop that reads it`,
    [["three video captions", note("VIDEO CAPTION \\d"), 3, "comments"], ["a PPR PROCEDURE note", note("PPR PROCEDURE"), 1, "comments"], ["a PPR LIST note", note("PPR LIST"), 1, "comments"]], "Run it with cat again.", [["Matches: 3", /Matches: 3/]])],
  [{ answers: [["pet", "cat"]] }]);

def("u6l3", "Your Color Counter", ["**This is the Practice Create Task program.** Build the Color Counter yourself: it asks for a color, counts how many times that color is in your list, and shows a second count to prove the parameter changes the answer."], ["a complete Create Task program", "the target parameter changes the result", "reading your own program"], [
  S("Input and list", ["Make a list **`colors`** with exactly these six items: `\"red\"`, `\"blue\"`, `\"red\"`, `\"green\"`, `\"red\"`, `\"blue\"`. Ask `Pick a color: ` and store it in **`choice`**."], "Type the list and the input.", `colors = ["red", "blue", "red", "green", "red", "blue"]\nchoice = input("Pick a color: ")`,
    [["the colors list", /^\s*colors\s*=\s*\[(?:\s*["']\w+["']\s*,?){6}\s*\]/m], ["input from the user", /^\s*choice\s*=\s*input\(/m]], "Run it and type red."),
  S("The procedure", ["Write **`count_matches(items, target)`**: `count = 0`, a for loop over items, an if that compares each item with the target and adds 1, and a return of the count."], "Add the procedure.", `def count_matches(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count`,
    [["a procedure with two parameters", FN("count_matches", "items\\s*,\\s*target")], ["a for loop over items", /^\s+for\s+item\s+in\s+items\s*:/m], ["an if that compares with the target", /^\s+if\s+item\s*==\s*target\s*:/m], ["a return of the count", /^\s+return\s+count\s*$/m]], "Run it."),
  S("Two calls", ["Print `Matches:` and `count_matches(colors, choice)`. Then print `Blue matches:` and `count_matches(colors, \"blue\")`. Two different arguments give two different answers."], "Add the two prints.", `print("Matches:", count_matches(colors, choice))\nprint("Blue matches:", count_matches(colors, "blue"))`,
    [["a call with choice", /count_matches\(\s*colors\s*,\s*choice\s*\)/], ["a call with blue", /count_matches\(\s*colors\s*,\s*["']blue["']\s*\)/]], "Run it with red.", [["Matches: 3", /Matches: 3/], ["Blue matches: 2", /Blue matches: 2/]])],
  [{ answers: [["color", "red"]] }]);

/* ---- build every record (hidden, not gating) ---- */
T.rows.forEach((row) => {
  const a = ASG[row.id]; if (!a) throw new Error("no assignment written for " + row.id);
  const w = { title: "Assignment " + row.n + ": " + a.name, intro: a.intro.concat(["**Scoring:** worth **" + row.pts[0] + " points**. Write the code yourself from the description. The auto-checker under each box turns green when your code (and its output) has what the step asks for. **100%** is full points."]), learn: a.learn,
    stages: a.stages.map((s) => ({ title: s.title, say: s.say, type: s.type, ref: s.ref, chk: s.chk, run: s.run, runChk: s.runChk, inp: s.inp })), autoRun: a.auto };
  M.addMission(row.asg, w, { unit: row.UNIT, num: Math.floor(row.wt), points: row.pts[0], seq: row.wt + (row.wt % 1 ? 0.05 : 0.5), passMin: 0, part: "project" });
});
module.exports = { ASG };
