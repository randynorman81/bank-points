from lesson import *

UNIT = Unit(4, "Python Control Structures", "Make programs decide and repeat: booleans, comparisons, logic, if statements, loops, and random numbers.",
    "Big Idea 3: Algorithms and Programming", "#7C3AED", "#6D28D9", "#A78BFA", "#EDE9FE", "code",
    ["Use booleans, comparison operators, and logical operators", "Write if, elif, and else statements and read the order they run in", "Respond to key events with a handler", "Repeat code with for loops and while loops, and stop loops with break", "Generate random numbers and use them in programs", "Trace decisions and loops line by line"],
    [
    L("4.1", "Store `True` and `False` in variables, get booleans from comparisons, and flip them with `not`.",
      [("boolean", "a value that is only `True` or `False`"), ("comparison", "a question like `age >= 13` that answers True or False"), ("`==`", "asks \"are these equal?\" (two equals signs)"), ("`not`", "flips True to False and False to True")],
      [("True and False", """A **boolean** is a value that can only be `True` or `False`. Both start with a **capital letter** and have **no quotes**. Booleans are the answers to yes-or-no questions: *Is the door open? Is the score high enough? Is the user an adult?*

A boolean variable can change: `is_open = True`, and later `is_open = False`."""),
       ("Where booleans come from", """Most booleans come from **comparisons**. `age >= 13` asks *is age at least 13?* and the answer is `True` or `False`. You can **store** that answer in a variable: `is_teen = age >= 13`. The variable now holds a boolean."""),
       ("One equals or two?", """The two signs do different jobs and mixing them up is a very common mistake.

!key: `=` **stores** a value. `==` **asks** whether two values are equal.

`score = 10` puts 10 into `score`. `score == 10` asks *is score equal to 10?* and gives `True` or `False`."""),
       ("Flip it with not", """`not` turns a boolean around: `not True` is `False` and `not False` is `True`. It is handy for the opposite of a flag: `closed = not is_open`. On the AP exam the same operator is written `NOT`, and the boolean values are lowercase `true` and `false`."""),
       ("Comparing text", """You can compare text, too. `==` is True only when every letter **and capital** matches: `"market" == "Market"` is False. With `<` and `>`, text is compared **alphabetically**, so `"castle" < "silver"` is True (c comes before s), and `"python" < "banana"` is False. Capital letters come before lowercase ones."""),
       ("Not equal, and the type of a boolean", """`!=` asks *are these different?*: `score != 7` is True when score is anything except 7. You can check that a value really is a boolean with `type(True)`, which shows `<class 'bool'>`."""),
      ],
      [A("Booleans from comparisons", 'age = 15\nis_teen = age >= 13\nis_adult = age >= 18\nprint(is_teen, is_adult)',
         [(1, "age >= 13", "15 is at least 13: True."), (2, "age >= 18", "15 is not at least 18: False.")], out="True False", cap="A comparison asks a question. The variable stores the True or False answer."),
       A("= stores, == asks", 'score = 10\nprint(score == 10)\nprint(score == 7)',
         [(0, "score = 10", "ONE equals sign: store 10."), (1, "score == 10", "TWO: is score equal to 10?"), (2, "score == 7", "10 is not 7: False.")], out="True\nFalse", cap="Never use a single equals sign when you want to ask a question."),
       A("Flip with not", 'is_open = True\nclosed = not is_open\nprint(closed)',
         [(1, "not is_open", "Flips True to False.")], out="False", cap="`not` gives the opposite boolean.")],
      [T("A boolean can change", 'is_open = True\nis_open = False\nis_open = not is_open', ['1| is_open=True', '2| is_open=False', '3| is_open=True'], cap="Line 3 flips False to True with not."),
       T("Store a comparison", 'score = 72\npassing = score >= 70\nperfect = score == 100', ['1| score=72', '2| passing=True', '3| perfect=False'], cap="Each comparison is worked out, and the True or False answer is stored."),
       T("Comparing text", 'a = "castle" < "silver"\nb = "python" < "banana"\nc = "market" == "Market"', ['1| a=True', '2| b=False', '3| c=False'], cap="castle comes before silver alphabetically, so a is True. python comes after banana, so b is False. The capital M makes the third pair different."),
       T("Equal and not equal", 'score = 10\na = score == 10\nb = score == 7\nc = score != 7', ['1| score=10', '2| a=True', '3| b=False', '4| c=True'], cap="score is 10, so == 10 is True, == 7 is False, and != 7 is True."),
       T("Flip two flags", 'door_open = True\nlocked = False\nclosed = not door_open\nsafe = not locked', ['1| door_open=True', '2| locked=False', '3| closed=False', '4| safe=True'], cap="not flips each value. The original variables do not change.")],
      [("`is_open = true`", "Lowercase `true` is not a boolean in Python: NameError.", "`is_open = True`"), ("`is_open = \"True\"`", "Quotes make it a string, which is not a boolean.", "`is_open = True`"), ("`if score = 10:` or `print(score = 10)`", "One equals stores. It does not ask.", "Use `==` to compare: `score == 10`"), ("`passing = score >= 70` and expecting it to update", "It stores the answer at that moment. If score changes later, passing does not.", "Run the comparison again after the change"),
       ("`not` with no value", "`not` needs something to flip.", "`not is_open`"), ("Printing a comparison and expecting text", "`print(5 > 3)` shows `True`, not the words you wrote.", "Use the boolean in an `if` to choose what to print"), ("`x == 5` alone on a line", "It asks the question and then throws the answer away.", "Store it or use it: `ok = x == 5`")],
      ["The exam writes booleans in lowercase (`true`, `false`) and the flip operator as `NOT`.", "A comparison such as `a > b` evaluates to true or false.", "Be able to tell `=` (assign, written `←` on the exam) from `==` (compare, written `=` on the exam)."],
      [Q("Which line stores a boolean?", ["`ok = \"True\"`", "`ok = True`", "`ok = 1.0`", "`ok = true`"], 1, "Only a capital `True` without quotes is a boolean."),
       Q("What does this print?", ["True", "False", "7", "an error"], 1, "`7 > 9` is false.", 'x = 7\nprint(x > 9)'),
       Q("What does `==` do?", ["Stores a value", "Asks if two values are equal", "Adds two values", "Prints a value"], 1, "`==` is a comparison. `=` stores."),
       Q("`done = True` then `done = not done`. What does `done` hold?", ["True", "False", "\"not\"", "an error"], 1, "`not True` is `False`.")]),

    L("4.2", "Combine yes-or-no questions with `and`, `or`, and `not`.",
      [("`and`", "True only when BOTH sides are True"), ("`or`", "True when AT LEAST ONE side is True"), ("`not`", "flips True and False"), ("logical operator", "`and`, `or`, and `not`; they combine booleans")],
      [("and needs both", """`and` is `True` only when **both** sides are `True`. A ride might need you to be at least 12 **and** at least 48 inches tall. If either is missing, the answer is `False`."""),
       ("or needs just one", """`or` is `True` when **at least one** side is `True`. It is only `False` when both sides are false. *Weekend* is `day == "Sat" or day == "Sun"`."""),
       ("The truth table", """| A | B | A and B | A or B |
|---|---|---|---|
| True | True | True | True |
| True | False | False | True |
| False | True | False | True |
| False | False | False | False |"""),
       ("Combine comparisons and check a range", """Each side of `and` and `or` must be a full yes-or-no question. To check that `score` is between 80 and 89, write `score >= 80 and score <= 89`. (Python also lets you write `80 <= score <= 89`.)"""),
       ("Which one goes first?", """When you mix them, Python does `not` first, then `and`, then `or`. So `True or False and False` is `True`: the `and` runs first (`False and False` is False), and then `True or False` is True. **Brackets** change the order, so use them whenever you are not sure: `(True or False) and False` is `False`."""),
      ],
      [A("and needs both", 'age = 15\nheight = 50\ncan_ride = age >= 12 and height >= 48\nprint(can_ride)',
         [(2, "age >= 12", "Left side: True."), (2, "and", "Both sides must be True."), (2, "height >= 48", "Right side: True.")], out="True", cap="Both questions are True, so the whole thing is True."),
       A("or needs one", 'day = "Sat"\nweekend = day == "Sat" or day == "Sun"\nprint(weekend)',
         [(1, 'day == "Sat"', "True."), (1, "or", "One True side is enough.")], out="True", cap="Notice that each side of `or` is a full comparison."),
       A("Brackets change the order", 'a = True or False and False\nb = (True or False) and False\nprint(a, b)',
         [(0, "False and False", "and runs first: False."), (1, "(True or False)", "Brackets run first: True.")], out="True False", cap="Same values, different order, different answer.")],
      [T("and", 'age = 15\nheight = 50\ncan_ride = age >= 12 and height >= 48', ['1| age=15', '2| height=50', '3| can_ride=True'], cap="15 >= 12 is True. 50 >= 48 is True. True and True is True."),
       T("or", 'day = "Tue"\nweekend = day == "Sat" or day == "Sun"', ['1| day="Tue"', '2| weekend=False'], cap="Both comparisons are False, and False or False is False."),
       T("A range", 'score = 85\nin_b = score >= 80 and score <= 89\nin_a = score >= 90 and score <= 100', ['1| score=85', '2| in_b=True', '3| in_a=False'], cap="85 passes both tests for the B range, but fails the first test of the A range."),
       T("Which goes first?", 'a = True or False and False\nb = (True or False) and False\nc = not True or True', ['1| a=True', '2| b=False', '3| c=True'], cap="a: and first, so False, then True or False. b: brackets first. c: not first, so False or True.")],
      [("`x > 5 and < 10`", "Each side needs its own full comparison: SyntaxError.", "`x > 5 and x < 10`"), ("`day == \"Sat\" or \"Sun\"`", "`\"Sun\"` alone counts as True, so the whole thing is always True.", "`day == \"Sat\" or day == \"Sun\"`"), ("`age > 12 or age < 5` for \"between\"", "A between-test needs `and`.", "`age > 5 and age < 12`"), ("`&&`, `||`, `!` from other languages", "Python spells them `and`, `or`, `not`.", "Use the words"),
       ("`And` or `OR`", "Python is case-sensitive: keywords must be lowercase.", "`and`, `or`"), ("`not x == 5` and being unsure", "`not` applies to the whole comparison, so it means `not (x == 5)`.", "Use `x != 5` or add brackets"), ("Mixing `and` and `or` without brackets", "`and` goes first. This is a very common wrong answer.", "Add brackets to show what you mean")],
      ["The exam writes `AND`, `OR`, and `NOT`. Be able to evaluate expressions that mix them.", "`NOT` first, then `AND`, then `OR`. Use the truth table when unsure.", "Boolean expressions appear inside conditions (IF) and loop tests (REPEAT UNTIL)."],
      [Q("What is `True and False`?", ["True", "False", "None", "an error"], 1, "`and` needs both sides to be True."),
       Q("What is `False or True`?", ["True", "False", "None", "an error"], 0, "`or` needs only one True."),
       Q("Which checks that `n` is between 1 and 10 (inclusive)?", ["`n >= 1 or n <= 10`", "`n >= 1 and n <= 10`", "`n >= 1 and <= 10`", "`1 and 10`"], 1, "A between-test needs both sides to be true, so use `and`."),
       Q("What does this print?", ["True", "False", "None", "an error"], 1, "Brackets first: `True or False` is True. Then `True and False` is False.", 'print((True or False) and False)')]),

    L("4.3", "Use the six comparison operators and turn plain English into a condition.",
      [("`==`", "equal to"), ("`!=`", "not equal to"), ("`<  >`", "less than, greater than"), ("`<=  >=`", "less than or equal, greater than or equal"), ("boundary", "the exact value where a comparison changes from True to False")],
      [("The six operators", """| Operator | Means | Example (x = 7) | Result |
|---|---|---|---|
| `==` | equal to | `x == 7` | True |
| `!=` | not equal to | `x != 7` | False |
| `<` | less than | `x < 7` | False |
| `>` | greater than | `x > 5` | True |
| `<=` | less than or equal to | `x <= 7` | True |
| `>=` | greater than or equal to | `x >= 8` | False |

On the exam they are written `=`, `≠`, `<`, `>`, `≤`, `≥`."""),
       ("Or equal to: the boundary", """The edge value is where mistakes happen. If the rule says *at least 16*, a 16-year-old **counts**, so use `>=`. If it says *more than 16*, a 16-year-old does **not**, so use `>`. Test the boundary number every time."""),
       ("From English to Python", """- "at least 13" is `>= 13`
- "more than 13" is `> 13`
- "at most 5" is `<= 5`
- "fewer than 5" is `< 5`
- "not 7" is `!= 7`"""),
       ("Math, even, odd, and text", """The left side of a comparison can be math: `n % 2 == 0` asks *is n even?* and `n % 5 == 0` asks *is n divisible by 5?* You can compare text too: `name == "Ana"`. Text matches only if **every letter and capital** is the same, so `"Cat" == "cat"` is `False`. Comparing text with `<` or `>` goes alphabetically (capitals come before lowercase letters)."""),
      ],
      [A("The boundary", 'age = 16\nprint(age > 16)\nprint(age >= 16)',
         [(1, "age > 16", "16 is NOT more than 16: False."), (2, "age >= 16", "16 is at least 16: True.")], out="False\nTrue", cap="Same number, different operator, different answer."),
       A("Math inside a comparison", 'n = 12\nprint(n % 2 == 0)\nprint(n % 5 == 0)',
         [(1, "n % 2 == 0", "Remainder 0 when divided by 2: even."), (2, "n % 5 == 0", "12 % 5 is 2, not 0.")], out="True\nFalse", cap="Work out the math first, then compare."),
       A("Text must match exactly", 'guess = "Cat"\nprint(guess == "Cat")\nprint(guess == "cat")',
         [(1, '"Cat"', "Same capital C: True."), (2, '"cat"', "Different capital: False.")], out="True\nFalse", cap="Capital letters count.")],
      [T("Six comparisons", 'x = 7\na = x > 5\nb = x != 7\nc = x <= 7', ['1| x=7', '2| a=True', '3| b=False', '4| c=True'], cap="7 > 5 is True. 7 != 7 is False. 7 <= 7 is True."),
       T("At the boundary", 'age = 16\nolder = age > 16\nlegal = age >= 16', ['1| age=16', '2| older=False', '3| legal=True'], cap="16 is not greater than 16, but it is greater than or equal to 16."),
       T("Even and divisible", 'n = 15\neven = n % 2 == 0\nby5 = n % 5 == 0', ['1| n=15', '2| even=False', '3| by5=True'], cap="15 % 2 is 1, so it is not even. 15 % 5 is 0, so it divides evenly."),
       T("Text", 'secret = "Apple"\ng1 = "apple"\nsame = g1 == secret\nlater = "Apple" < "apple"', ['1| secret="Apple"', '2| g1="apple"', '3| same=False', '4| later=True'], cap="A capital A and a lowercase a are different, so same is False. Capitals sort before lowercase, so \"Apple\" < \"apple\" is True.")],
      [("`x = 5` where you mean a comparison", "One equals stores. It does not ask.", "`x == 5`"), ("`=>` or `=<`", "The equals sign goes second: SyntaxError.", "`>=` and `<=`"), ("Using `>` for \"at least\"", "The boundary value is left out.", "Use `>=` for \"at least\" and `<=` for \"at most\""), ("`\"Cat\" == \"cat\"` expecting True", "Capital letters count.", "Make both the same case first"),
       ("`5 < x < 10` and doubting it works", "It does in Python, but beginners often write it wrong in other forms.", "Or write `x > 5 and x < 10`"), ("Comparing text with numbers: `\"5\" == 5`", "A string never equals a number.", "Convert with `int()` first"), ("Forgetting `==` with text from the user", "`answer = \"yes\"` stores. It does not check.", "`answer == \"yes\"`")],
      ["The exam uses `=`, `≠`, `>`, `<`, `≥`, `≤` for comparisons. Remember `=` means \"equal to\" there, not \"store\".", "Watch for boundary values: `>=` includes the number, `>` does not.", "A comparison gives a boolean, so it can be used in IF and REPEAT UNTIL."],
      [Q("Which means \"at least 18\"?", ["`age > 18`", "`age >= 18`", "`age < 18`", "`age == 18`"], 1, "\"At least\" includes 18."),
       Q("What does `print(10 != 10)` show?", ["True", "False", "10", "an error"], 1, "10 is not different from 10, so `!=` is False."),
       Q("What is `\"cat\" == \"Cat\"`?", ["True", "False", "None", "an error"], 1, "Capitals matter."),
       Q("Which is True when `n` is a multiple of 3?", ["`n % 3 == 0`", "`n // 3 == 0`", "`n / 3 == 0`", "`n % 3 == 3`"], 0, "A multiple of 3 leaves remainder 0.")]),

    L("4.4", "Run code only when a condition is True with an `if` statement.",
      [("`if`", "runs the indented lines only when the condition is True"), ("condition", "the yes-or-no question after `if`"), ("indentation", "spaces at the start of a line that show which lines belong to the `if`"), ("block", "the indented lines that belong together")],
      [("Your first if", """An `if` statement makes a **decision**. It has a word `if`, a **condition**, a **colon**, and then indented lines. Those lines run **only if the condition is True**. If it is False, Python skips them and moves on.

```
if age >= 16:
    print("You can drive")
```"""),
       ("Indentation decides what belongs", """The lines **indented** under the `if` (one tab, or 4 spaces) are its **body**. The first line that is **not** indented is outside the `if` and always runs. Python uses the indentation to know what belongs to what."""),
       ("Conditions can be booleans and logic", """The condition can be a comparison, a boolean variable, or a combination with `and`, `or`, and `not`. `if is_member:` asks whether the variable holds `True`. `if age >= 12 and height >= 48:` combines two questions."""),
       ("If can change a variable, and ifs can be stacked", """An `if` body can **change a variable** (`price = price - 2`). Several `if` statements in a row are **all** checked, one after the other, so more than one can run. You can also put an `if` **inside** another `if`: the inner one is only checked when the outer one is True."""),
      ],
      [A("An if and what is outside it", 'age = 14\nif age >= 16:\n    print("You can drive")\nprint("Done")',
         [(1, "age >= 16", "14 is not at least 16: False."), (2, "print(\"You can drive\")", "Indented: skipped."), (3, 'print("Done")', "Not indented: always runs.")], out="Done", cap="Only the indented line belongs to the if."),
       A("An if that changes a variable", 'price = 10\nage = 12\nif age < 13:\n    price = price - 3\nprint(price)',
         [(2, "age < 13", "12 is less than 13: True."), (3, "price - 3", "The body runs: 10 - 3.")], out="7", cap="The if changes the variable only when the condition is True."),
       A("Several ifs in a row", 'score = 95\nif score >= 90:\n    print("A")\nif score >= 80:\n    print("B")',
         [(1, "score >= 90", "True: prints A."), (3, "score >= 80", "Also True: prints B too.")], out="A\nB", cap="Separate ifs are each checked on their own.")],
      [T("False: skip the body", 'age = 14\nif age >= 16:\n    print("drive")\nprint("done")', ['1| age=14'], out="done", cap="Line 2 asks 14 >= 16: False, so Python jumps over line 3 to line 4."),
       T("True: run the body", 'price = 10\nage = 12\nif age < 13:\n    price = price - 3\nprint(price)', ['1| price=10', '2| age=12', '4| price=7'], out="7", cap="12 < 13 is True, so line 4 runs and price becomes 7."),
       T("Two ifs in a row", 'score = 95\nbonus = 0\nif score >= 90:\n    bonus = bonus + 5\nif score >= 80:\n    bonus = bonus + 3', ['1| score=95', '2| bonus=0', '4| bonus=5', '6| bonus=8'], cap="Both conditions are True, so both bodies run and bonus adds up to 8."),
       T("An if inside an if", 'age = 20\nmember = False\nprice = 10\nif age >= 18:\n    if member:\n        price = 5', ['1| age=20', '2| member=False', '3| price=10'], cap="The outer if is True, but the inner if checks member, which is False. The price stays 10.")],
      [("`if age >= 16` with no colon", "Every `if` line ends with a colon: SyntaxError.", "`if age >= 16:`"), ("No indentation under the `if`", "IndentationError: Python expects an indented body.", "Indent the body lines"), ("An unindented line you meant to be inside", "It always runs, because it is outside the if.", "Indent every line that belongs to the if"), ("`if age = 16:`", "One equals sign stores. It is not a condition.", "`if age == 16:`"),
       ("Two ifs when you wanted one choice", "Both can run. A score of 95 prints A and B.", "Use `elif` (Lesson 4.5) for one choice"), ("`if is_member == True:` when `if is_member:` works", "It works but it is extra.", "`if is_member:`"), ("Mixing tabs and spaces", "Python complains about inconsistent indentation.", "Use the same indent for every line")],
      ["The exam writes `IF(condition) { }` with curly braces. In Python the indentation does that job.", "Selection means choosing which code runs. Trace to see which lines run.", "A condition must evaluate to true or false."],
      [Q("What does this print?", ["Nothing", "Hi", "Bye", "Hi then Bye"], 2, "The condition is false, so `Hi` is skipped. `Bye` always runs.", 'x = 3\nif x > 5:\n    print("Hi")\nprint("Bye")'),
       Q("What ends the first line of an `if` statement?", ["A period", "A colon", "A semicolon", "Nothing"], 1, "Every `if` ends with a colon."),
       Q("What does this print?", ["7", "10", "13", "3"], 0, "`3 < 13` is true, so 3 is subtracted.", 'price = 10\nif 3 < 13:\n    price = price - 3\nprint(price)'),
       Q("What decides which lines belong to an if?", ["Capital letters", "Indentation", "Comments", "Blank lines"], 1, "The indent shows the body.")]),

    L("4.5", "Choose between two or more paths with `else` and `elif`.",
      [("`else`", "runs when the `if` condition was False"), ("`elif`", "short for \"else if\": another condition, checked only if the ones above were False"), ("chain", "an `if`, some `elif`s, and an `else` that act as one decision")],
      [("Two ways to go: else", """`else` runs when the `if` condition was **False**. Exactly **one** of the two bodies runs, never both and never neither.

```
if age >= 18:
    print("adult")
else:
    print("minor")
```"""),
       ("Three or more choices: elif", """`elif` means *else if*. It adds another condition that is checked only if everything above it was False. Python checks from the top and runs the **first** body whose condition is True. Then it skips the rest of the chain."""),
       ("Order matters", """Because the first True condition wins, put the **most specific** test first. If you check `score >= 60` before `score >= 90`, a 95 stops at the first test and gets the wrong label."""),
       ("if/elif is not the same as separate ifs", """A chain (`if`, `elif`, `else`) runs **at most one** body. Separate `if` statements are each checked, so **more than one** can run. Use a chain when only one choice should happen, and separate ifs when several things can be true at once (for example two promotions that can both apply)."""),
      ],
      [A("if and else", 'n = 7\nif n % 2 == 0:\n    print("even")\nelse:\n    print("odd")',
         [(1, "n % 2 == 0", "7 % 2 is 1: False."), (3, "else", "Runs when the if was False.")], out="odd", cap="Exactly one of the two bodies runs."),
       A("An elif chain", 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")',
         [(1, "score >= 90", "False: go to the next test."), (3, "score >= 80", "True: print B and skip the rest."), (6, "print(\"C\")", "Never reached.")], out="B", cap="The first True test wins."),
       A("Wrong order", 'score = 95\nif score >= 60:\n    print("pass")\nelif score >= 90:\n    print("A")',
         [(1, "score >= 60", "95 passes this first test."), (3, "score >= 90", "Never checked: the chain already stopped.")], out="pass", cap="Put the most specific test first.")],
      [T("if/else", 'n = 7\nif n % 2 == 0:\n    result = "even"\nelse:\n    result = "odd"', ['1| n=7', '5| result="odd"'], cap="7 % 2 is 1, so line 2 is False. Python jumps to the else and runs line 5."),
       T("An elif chain", 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"', ['1| score=85', '5| grade="B"'], cap="Line 2 is False. Line 4 is True, so grade is B. The rest of the chain is skipped."),
       T("A chain versus separate ifs", 'score = 95\nstars = 0\nif score >= 90:\n    stars = stars + 3\nelif score >= 80:\n    stars = stars + 2\nif score >= 70:\n    stars = stars + 1', ['1| score=95', '2| stars=0', '4| stars=3', '8| stars=4'], cap="The if/elif chain adds 3 and skips the elif. The last if is separate, so it also runs and adds 1."),
       T("Wrong order", 'score = 95\nif score >= 60:\n    label = "pass"\nelif score >= 90:\n    label = "top"', ['1| score=95', '3| label="pass"'], cap="The first test catches 95, so \"top\" can never be reached.")],
      [("`else` with a condition: `else score > 5:`", "`else` has no condition: SyntaxError.", "Use `elif score > 5:`"), ("A missing colon after `else` or `elif`", "SyntaxError.", "End each with a colon"), ("Putting the general test first", "95 gets the \"pass\" label instead of the \"A\" label.", "Order the tests from the most specific to the least"), ("Using separate `if`s for one choice", "More than one body can run.", "Use `elif`"),
       ("`else` before `elif`", "`else` must be last.", "`if`, then `elif`s, then `else`"), ("`elif` with no `if` above it", "SyntaxError.", "Start the chain with `if`"), ("An `else` that is not lined up with its `if`", "Wrong indentation breaks the chain.", "Line `else` up with its `if`")],
      ["The exam writes `IF(condition) { } ELSE { }`. There is no ELIF, so a chain is written as nested IF/ELSE.", "Exactly one branch of an IF/ELSE runs.", "Trace by testing each condition in order."],
      [Q("When does `else` run?", ["Every time", "When the `if` condition is True", "When the `if` condition is False", "Never"], 2, "`else` is the fallback."),
       Q("What does this print?", ["A", "B", "C", "A and B"], 1, "85 fails the first test and passes the second.", 'score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")'),
       Q("How many bodies can run in one if/elif/else chain?", ["Exactly one", "At most one", "All that are true", "Two"], 1, "A chain with an `else` runs exactly one. Without an `else`, it runs at most one."),
       Q("What does this print?", ["pass", "top", "pass and top", "Nothing"], 0, "The first test is True, so the chain stops there.", 'score = 95\nif score >= 60:\n    print("pass")\nelif score >= 90:\n    print("top")')]),

    L("4.6", "Respond to key presses with an event handler: a procedure that takes the key as a parameter.",
      [("event", "something that happens while a program runs, like a key press"), ("handler", "a procedure that runs when an event happens"), ("parameter", "a variable a procedure receives, like `event`"), ("`event.key`", "the name of the key that was pressed, as a string")],
      [("An event supplies input", """In a game or an app the program does not know ahead of time what the user will do. The user presses a key, clicks, or taps, and the program **reacts**. This is **event-driven programming**. An **event** is something that happens while a program runs, and it **supplies input** to the program.

For a key press, the input is one piece of information, `key`: a **string** naming the key. A letter key is the letter itself (`"a"`). Other keys have names such as `"ArrowLeft"` or `"Enter"`.

In this course, a pretend key press is made with `Event("a")`, and you hand it to your code yourself."""),
       ("A handler is a procedure with a parameter", """The code that responds to an event is a **handler**. It is a **procedure with a parameter**: the parameter receives the event, and you read the key with `event.key`.

```
def on_key(event):
    print(event.key)
```"""),
       ("Decide by key", """Inside the handler, use `if`, `elif`, and `else` to do different things for different keys: `if event.key == "ArrowLeft":`. The `==` compares the key name to text, so the name must match **exactly**."""),
       ("Key names must match exactly", """`"a"` and `"A"` are different. `"ArrowLeft"` is not `"arrowleft"` and not `"Left"`. A key name that does not match is simply not recognized, so the handler's code for it never runs."""),
       ("A handler that changes a variable", """A handler can update a variable, such as moving a player: `x = x - 1` for left, `x = x + 1` for right. Each event changes the variable a little."""),
       ("Registering a handler", """The handler does not run until something calls it. On the graphics canvas you **register** it with `add_key_down_handler(on_key)`, which runs your function every time a key goes **down**. `add_key_up_handler(on_key)` runs it when a key is **released**. Hand over the function itself: **no brackets** after its name. The canvas then calls it for you with the event. A **mouse** handler gets the position (`x` and `y`) instead, but a key handler gets **one** parameter, the event."""),
       ("One key at a time", """Only one key goes down each time the handler runs, so an `if / elif / else` chain is a good fit: exactly one branch should run."""),
      ],
      [A("A handler decides by key", 'def on_key(event):\n    if event.key == "a":\n        print("left")\n    elif event.key == "d":\n        print("right")\n    else:\n        print("ignored")',
         [(0, "event", "The parameter receives the event."), (1, "event.key", "The name of the key pressed."), (5, "else", "Any other key.")], cap="One procedure, one parameter, a chain of decisions."),
       A("Keys must match exactly", 'key = "A"\nprint(key == "a")\nprint(key == "A")',
         [(1, '"a"', "Lowercase does not match."), (2, '"A"', "Matches exactly.")], out="False\nTrue", cap="Compare key names with ==, and match capital letters."),
       A("A handler that moves a player", 'x = 5\ndef on_key(event):\n    global x\n    if event.key == "d":\n        x = x + 1',
         [(2, "global x", "Lets the procedure change the outside variable."), (4, "x + 1", "Move one step right.")], cap="Each key press can change what the program remembers.")],
      [T("Pick a message by key", 'class Event:\n    def __init__(self, key):\n        self.key = key\n\ndef on_key(event):\n    if event.key == "a":\n        msg = "left"\n    elif event.key == "d":\n        msg = "right"\n    else:\n        msg = "ignored"\n    return msg\n\nresult = on_key(Event("d"))', ['14| result="right"'], cap="For the key d, the first test (a) is False, the second (d) is True, so msg is \"right\" and that is returned."),
       T("An unknown key", 'class Event:\n    def __init__(self, key):\n        self.key = key\n\ndef on_key(event):\n    if event.key == "a":\n        msg = "left"\n    else:\n        msg = "ignored"\n    return msg\n\nresult = on_key(Event("ArrowLeft"))', ['12| result="ignored"'], cap="\"ArrowLeft\" is not \"a\", so the if fails and the else runs."),
       T("Several key presses", 'x = 5\nkeys = ["d", "d", "a"]\nfor k in keys:\n    if k == "d":\n        x = x + 1\n    elif k == "a":\n        x = x - 1', ['1| x=5', '2| keys=["d", "d", "a"]', '5| x=6', '5| x=7', '7| x=6'], cap="Each event changes x a little: right, right, left. The final x is 6.", check=True)],
      [("`if event.key = \"a\":`", "One equals stores. It does not compare.", "`if event.key == \"a\":`"), ("`event.key == \"A\"` for the lowercase key", "Key names are case-sensitive.", "Match exactly: `\"a\"` or `\"A\"`"), ("`if event.key == a:`", "No quotes: Python looks for a variable named a.", "`\"a\"`"), ("`\"arrowleft\"` or `\"Left\"`", "The real name is `\"ArrowLeft\"`.", "Copy the key name exactly"),
       ("`add_key_down_handler(on_key())`", "The brackets call the function right now instead of registering it.", "`add_key_down_handler(on_key)`"), ("Forgetting the parameter: `def on_key():`", "The handler receives an event and has nowhere to put it: TypeError.", "`def on_key(event):`"), ("Changing a variable without `global`", "Python makes a new local variable instead of changing the outside one.", "Use `global x` inside the handler"), ("Using `event` outside the handler", "`event` only exists inside the procedure.", "Do the work inside the handler")],
      ["The exam has no key-event commands, but it tests the ideas: an **event** supplies **input** to a program.", "The code that responds is a **procedure with a parameter**.", "Be able to say how an event changes what a program does."],
      [Q("What is an event?", ["A loop that never ends", "An action, like a key press, that supplies input to a program", "A kind of variable", "A comment"], 1, "Events are actions that start code running."),
       Q("What does `event.key` hold for a letter key?", ["A number", "The letter as a string", "A boolean", "Nothing"], 1, "It is a string like `\"a\"`."),
       Q("Which is true?", ["`\"a\" == \"A\"`", "`\"a\" != \"A\"`", "They are always equal", "Neither can be compared"], 1, "Capital letters are different characters."),
       Q("Which line registers a key handler on the canvas?", ["`add_key_down_handler(on_key)`", "`add_key_down_handler(on_key())`", "`on_key = add_key_down_handler`", "`key(on_key)`"], 0, "Hand over the function itself, with no brackets."),
       Q("Which function runs your code when a key is RELEASED?", ["`add_key_up_handler()`", "`add_key_down_handler()`", "`on_key()`", "`event.key`"], 0, "Up means released, down means pressed."),
       Q("What is a handler?", ["A variable", "A procedure that responds to an event", "A loop", "A list"], 1, "A handler runs when its event happens.")]),

    L("4.7", "Repeat code a set number of times with `for` and `range()`.",
      [("loop", "code that repeats"), ("`for` loop", "repeats once for each value it is given"), ("loop variable", "the variable (often `i`) that holds the current value on each pass"), ("`range()`", "makes a row of numbers to loop over; it stops BEFORE the stop number"), ("accumulator", "a variable that builds up a total as the loop runs")],
      [("Your first for loop", """So far every line of your programs ran **once**. A **loop** repeats lines for you, so you never type the same thing ten times. A `for` loop with `range(...)` is the one to use when you know **how many times** to repeat.

```
for i in range(5):
    print(i)
print("Done")
```

The `for` line has the word `for`, a **loop variable** (here `i`), the word `in`, `range(5)`, and a **colon**. The indented lines are the **body**. They run **once for each value**. `range(5)` makes five numbers: **0, 1, 2, 3, 4**. It starts at 0 and stops **before** 5. The line that is not indented runs once, after the loop is finished."""),
       ("Choose where to start, and count by steps", """`range(start, stop)` begins at `start` and still stops **one before** `stop`. `range(2, 7)` gives 2, 3, 4, 5, 6. A third number, `range(start, stop, step)`, sets how much to count by. `range(0, 10, 2)` gives 0, 2, 4, 6, 8. A **negative** step counts **down**: `range(5, 0, -1)` gives 5, 4, 3, 2, 1.

!key: The stop number is never included. This is the most common loop mistake."""),
       ("Repeat without using the counter", """If you only need to repeat, you do not have to use `i`. `for i in range(3): print("Hello!")` prints three times. The exam's counted loop is `REPEAT n TIMES`, which has no loop variable at all."""),
       ("Add things up and decide in a loop", """The **accumulator pattern** builds up an answer: make a variable such as `total = 0` **before** the loop, add to it **inside** the loop, and print it **after**. You can also put an `if` inside the loop to act on only some of the values, such as counting the even numbers."""),
      ],
      [A("Where range starts and stops", 'for i in range(5):\n    print(i)\nfor n in range(2, 7, 2):\n    print(n)',
         [(0, "range(5)", "0, 1, 2, 3, 4: five numbers."), (1, "print(i)", "Indented: runs once per value."), (2, "range(2, 7, 2)", "Start 2, stop before 7, step 2: 2, 4, 6.")], out="0\n1\n2\n3\n4\n2\n4\n6", cap="The stop number is never included."),
       A("The accumulator", 'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)',
         [(0, "total = 0", "Start at 0 BEFORE the loop."), (2, "total + i", "Add this pass's number."), (3, "print(total)", "Not indented: runs once, after the loop.")], out="10", cap="1 + 2 + 3 + 4 = 10."),
       A("Count down", 'for n in range(3, 0, -1):\n    print(n)\nprint("Liftoff!")',
         [(0, "-1", "A negative step counts down."), (0, "range(3, 0", "Stops before 0, so 0 never prints.")], out="3\n2\n1\nLiftoff!", cap="A countdown needs a negative step.")],
      [T("range(3)", 'for i in range(3):\n    print(i)\nprint("Done")', ['1| i=0', '2|', '1| i=1', '2|', '1| i=2', '2|'], out="0\n1\n2\nDone", cap="The for line sets i to 0, then 1, then 2. The print runs once per value. After the last value, the loop ends and Done prints."),
       T("An accumulator", 'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)', ['1| total=0', '2| i=1', '3| total=1', '2| i=2', '3| total=3', '2| i=3', '3| total=6', '2| i=4', '3| total=10'], out="10", cap="Each pass adds the current i to total: 0, 1, 3, 6, 10."),
       T("Counting down", 'for n in range(5, 0, -1):\n    print(n)', ['1| n=5', '1| n=4', '1| n=3', '1| n=2', '1| n=1'], out="5\n4\n3\n2\n1", cap="The loop stops before 0, so 0 is never used."),
       T("An if inside a loop", 'count = 0\nfor n in range(1, 7):\n    if n % 2 == 0:\n        count = count + 1', ['1| count=0', '2| n=1', '2| n=2', '4| count=1', '2| n=3', '2| n=4', '4| count=2', '2| n=5', '2| n=6', '4| count=3'], cap="The if is checked for every n. Only n = 2, 4, and 6 are even, so count ends at 3.")],
      [("`range(5)` and expecting 1 to 5", "It gives 0 to 4. The stop is not included.", "`range(1, 6)` for 1 to 5"), ("`range(1, 10)` and expecting 10", "Stops at 9.", "`range(1, 11)`"), ("No colon after `range(5)`", "SyntaxError.", "`for i in range(5):`"), ("A loop body that is not indented", "IndentationError, or the line is outside the loop.", "Indent every line of the body"),
       ("`total = 0` INSIDE the loop", "It resets to 0 on every pass, so you only get the last value.", "Put `total = 0` before the loop"), ("Printing the total inside the loop", "It prints on every pass, not once.", "Un-indent the print so it runs after the loop"), ("`range(5, 0)` to count down", "No negative step, so it gives nothing.", "`range(5, 0, -1)`"), ("`range(2.5)`", "`range` needs whole numbers: TypeError.", "Use ints")],
      ["The exam's counted loop is `REPEAT n TIMES { }`. It does exactly what `for i in range(n)` does.", "Tracing what a loop does to a variable, one pass at a time, is one of the most common exam questions.", "Know how many times a loop runs and what the variable ends up as."],
      [Q("How many times does `for i in range(4):` run its body?", ["3", "4", "5", "0"], 1, "range(4) makes 0, 1, 2, 3: four values."),
       Q("What does `list(range(2, 6))` contain?", ["2, 3, 4, 5, 6", "2, 3, 4, 5", "3, 4, 5, 6", "2, 6"], 1, "It starts at 2 and stops before 6."),
       Q("What does this print?", ["6", "10", "15", "5"], 1, "1 + 2 + 3 + 4.", 'total = 0\nfor i in range(1, 5):\n    total = total + i\nprint(total)'),
       Q("Which counts down from 5 to 1?", ["`range(5, 0)`", "`range(5, 0, -1)`", "`range(5, 1)`", "`range(-5, 0)`"], 1, "A negative step is needed, and 0 is the stop so it is not included.")]),

    L("4.8", "Loop straight over the items of a list or the characters of a string.",
      [("general for loop", "a `for` loop over the items themselves, not over numbers"), ("list", "a row of values in square brackets, like `[90, 85, 70]`"), ("`len()`", "the number of items in a list or characters in a string"), ("filter", "use an `if` inside a loop to act on only some items")],
      [("Loop over a list", """Last lesson you looped over numbers made by `range`. A **general for loop** loops straight over **the things themselves**: every item in a **list**, or every character in a **string**. There is no counting.

A **list** is a row of values in square brackets: `marks = [90, 85, 70]`. In `for mark in marks:` the variable `mark` becomes each real value, one at a time: 90, then 85, then 70."""),
       ("Loop over a string", """A string is a row of characters. `for letter in "cat":` gives `"c"`, then `"a"`, then `"t"`."""),
       ("The variable is the value", """The loop variable holds **the actual item**, not its position. So you can use it directly: `mark + 5`. If you also need the position, loop over `range(len(marks))` and look each item up with `marks[i]`. Lists start at position 0."""),
       ("Total, average, filter, and count", """The accumulator works the same way: make `total` before the loop and add each item inside it. The **average** is the total divided by `len(list)`. Put an `if` in the loop to **filter** (only count items that pass a test), or to count a certain letter in a string. The exam's version of this loop is `FOR EACH item IN list`."""),
      ],
      [A("The variable is the value", 'marks = [90, 85, 70]\nfor mark in marks:\n    print(mark + 5)',
         [(0, "[90, 85, 70]", "A list of three numbers."), (1, "for mark in marks", "mark is 90, then 85, then 70."), (2, "mark + 5", "Math on the real value.")], out="95\n90\n75", cap="No counting: the loop hands you each item."),
       A("Total and average of a list", 'prices = [4, 6, 8, 10]\ntotal = 0\nfor price in prices:\n    total = total + price\nprint(total / len(prices))',
         [(1, "total = 0", "Start before the loop."), (3, "total + price", "Add each item."), (4, "len(prices)", "How many items: 4.")], out="7.0", cap="28 / 4 is 7.0."),
       A("Count letters in a string", 'word = "banana"\ncount = 0\nfor ch in word:\n    if ch == "a":\n        count = count + 1',
         [(2, "for ch in word", "ch is each letter."), (3, 'ch == "a"', "Only the a's pass.")], cap="count ends at 3.")],
      [T("Loop over a list", 'marks = [90, 85, 70]\ntotal = 0\nfor mark in marks:\n    total = total + mark', ['1| marks=[90, 85, 70]', '2| total=0', '3| mark=90', '4| total=90', '3| mark=85', '4| total=175', '3| mark=70', '4| total=245'], cap="mark takes each item in turn. total grows: 0, 90, 175, 245."),
       T("Count letters", 'word = "banana"\ncount = 0\nfor ch in word:\n    if ch == "a":\n        count = count + 1', ['1| word="banana"', '2| count=0', '3| ch="b"', '3| ch="a"', '5| count=1', '3| ch="n"', '3| ch="a"', '5| count=2', '3| ch="n"', '3| ch="a"', '5| count=3'], cap="The if is checked for every letter, and only the a's add to count."),
       T("Filter with an if", 'scores = [88, 62, 94, 70]\ntotal = 0\nfor s in scores:\n    if s >= 70:\n        total = total + s', ['1| scores=[88, 62, 94, 70]', '2| total=0', '3| s=88', '5| total=88', '3| s=62', '3| s=94', '5| total=182', '3| s=70', '5| total=252'], cap="62 fails the test and is skipped. The others are added: 88 + 94 + 70 = 252."),
       T("Position and value", 'names = ["Ana", "Ben"]\nfor i in range(len(names)):\n    print(i, names[i])', ['1| names=["Ana", "Ben"]', '2| i=0', '2| i=1'], out="0 Ana\n1 Ben", cap="i is the position and names[i] is the item. Positions start at 0.")],
      [("`for i in marks:` then `marks[i]`", "i is the item, not a position. `marks[90]` is an error.", "Use the loop variable directly, or loop over `range(len(marks))`"), ("`for x in range(marks)`", "range needs a number, not a list: TypeError.", "`for x in marks:`"), ("`total = 0` inside the loop", "It resets on every pass.", "Put it before the loop"), ("Dividing by the wrong count", "`total / 3` breaks when the list grows.", "`total / len(marks)`"),
       ("`len` without brackets", "`len(marks)` needs round brackets.", "`len(marks)`"), ("Starting the total at 1", "Every answer is off by one.", "Start accumulators at 0"), ("A typo: `for mark in mark:`", "NameError: the list is `marks`.", "Match the list's name"), ("Expecting `for ch in 123`", "You cannot loop over a number: TypeError.", "Loop over a string or list")],
      ["The exam's version is `FOR EACH item IN list { }`. The variable is each item in turn.", "Know how to total, average, and filter a list in a loop.", "Be careful: the variable holds the value, not its index."],
      [Q("In `for n in [4, 7, 9]:`, what is `n` on the second pass?", ["4", "7", "9", "1"], 1, "n is each item in order: 4, then 7."),
       Q("What does this print?", ["2", "3", "4", "6"], 1, "Three of the letters are a.", 'count = 0\nfor ch in "banana":\n    if ch == "a":\n        count = count + 1\nprint(count)'),
       Q("What does `len([5, 8, 1])` give?", ["3", "14", "1", "8"], 0, "It counts the items."),
       Q("How do you find the average of a list `nums`?", ["`sum(nums)`", "total of the items / `len(nums)`", "`len(nums) / total`", "the biggest item"], 1, "Add them up, then divide by how many there are.")]),

    L("4.9", "Practice the five loop patterns until you can spot which one a problem needs.",
      [("pattern", "a common way a loop is used"), ("peak (maximum)", "the largest value in a list"), ("running total", "a total that grows as the loop goes")],
      [("The five patterns", """Almost every loop you write is one of these:

1. **Repeat** something N times: the loop variable is not used.
2. **Count** using the number itself: `for i in range(1, 6): print(i * 10)`.
3. **Accumulate**: add up a running total (`total = total + i`).
4. **Ask each time**: put `input()` inside the loop and use every answer.
5. **Decide each time**: put an `if` inside the loop that checks every value."""),
       ("Find the biggest", """To find the **peak** (the largest value), start with the first item, then check every item: if it is bigger than the best so far, it becomes the new best. The smallest works the same way with `<`."""),
       ("Trace It by Hand", """A trace table shows every variable after each pass through the loop. The AP exam expects you to do this on paper, so practice it. Write one row for each pass."""),
      ],
      [A("Find the peak", 'streams = [40, 95, 60]\nbest = streams[0]\nfor s in streams:\n    if s > best:\n        best = s',
         [(1, "streams[0]", "Start with the first item."), (3, "s > best", "Only a bigger item replaces it.")], cap="best ends as 95."),
       A("Ask each time", 'total = 0\nfor i in range(3):\n    score = int(input("Score: "))\n    total = total + score\nprint(total / 3)',
         [(2, "input(", "Asks on every pass."), (3, "total + score", "Adds each answer.")], out="80.0", cap="With answers 70, 80, and 90 the average is 80.0.")],
      [T("Total of i * 2", 'total = 0\nfor i in range(1, 5):\n    total = total + i * 2', ['1| total=0', '2| i=1', '3| total=2', '2| i=2', '3| total=6', '2| i=3', '3| total=12', '2| i=4', '3| total=20'], cap="i * 2 is 2, 4, 6, 8. The running total is 2, 6, 12, 20."),
       T("Find the peak", 'streams = [40, 95, 60]\nbest = streams[0]\nfor s in streams:\n    if s > best:\n        best = s', ['1| streams=[40, 95, 60]', '2| best=40', '3| s=40', '3| s=95', '5| best=95', '3| s=60'], cap="40 is the starting best. 95 is bigger, so it replaces it. 60 is not bigger."),
       T("Count the big ones", 'listens = [12, 40, 9, 55]\nbig = 0\nfor n in listens:\n    if n >= 20:\n        big = big + 1', ['1| listens=[12, 40, 9, 55]', '2| big=0', '3| n=12', '3| n=40', '5| big=1', '3| n=9', '3| n=55', '5| big=2'], cap="Only 40 and 55 are at least 20, so big ends at 2."),
       T("Above average", 'nums = [2, 4, 9]\navg = sum(nums) / len(nums)\nabove = 0\nfor n in nums:\n    if n > avg:\n        above = above + 1', ['1| nums=[2, 4, 9]', '2| avg=5.0', '3| above=0', '4| n=2', '4| n=4', '4| n=9', '6| above=1'], cap="The average is 5.0. Only 9 is above it.")],
      [("Wrong starting value for the peak", "Starting `best = 0` fails if every value is negative.", "Start with the first item"), ("Using `>=` when counting strictly bigger", "Ties get counted.", "Use `>` when the problem says \"more than\""), ("Resetting `best` inside the loop", "You only ever see the last item.", "Set it once, before the loop"), ("Printing inside the loop", "It prints on every pass.", "Print after the loop"),
       ("Averaging with the wrong count", "`total / 3` is wrong for 4 items.", "`total / len(list)`"), ("Forgetting to convert `input()`", "TypeError when adding text to a number.", "`int(input(...))`"), ("Using the wrong pattern", "A count problem solved with a total gives the wrong answer.", "Ask: what is the loop supposed to build?")],
      ["Tracing a loop that updates a variable on each pass is a very common exam question.", "Algorithms that find the biggest, smallest, total, average, or a count all use a loop with an accumulator.", "Know which pattern solves which problem."],
      [Q("Which pattern finds how many scores are above 90?", ["Repeat N times", "Count with an if inside the loop", "Ask each time", "Nothing"], 1, "You check each score with an `if` and add 1 when it passes."),
       Q("What does `best` hold at the end?", ["40", "60", "95", "100"], 2, "95 is the largest.", 'best = 40\nfor s in [40, 95, 60]:\n    if s > best:\n        best = s'),
       Q("Where does `total = 0` belong?", ["Inside the loop", "Before the loop", "After the loop", "Anywhere"], 1, "If it is inside, it resets on every pass."),
       Q("What is the average of `[2, 4, 9]`?", ["4", "5.0", "15", "3"], 1, "15 / 3 is 5.0.")]),

    L("4.10", "Repeat while a condition stays True, with a `while` loop.",
      [("`while` loop", "repeats as long as its condition is True"), ("infinite loop", "a loop that never ends because its condition never becomes False"), ("counter", "a variable the loop changes so the condition can eventually become False"), ("`REPEAT UNTIL`", "the exam's loop: repeats until a condition becomes True")],
      [("When to use while", """You already know `for` loops, which repeat a set number of times or once per item. A **while loop** repeats **as long as a yes-or-no question stays `True`**. Use it when you do **not** know ahead of time how many times to repeat: counting down, adding up until you reach a goal, or asking again until the answer is right."""),
       ("A while loop has three jobs", """1. **Set up** a variable **before** the loop.
2. **Ask a question** at the top: `while count <= 3:`.
3. **Change** the variable inside the body so the question can eventually become `False`.

Python asks the question **before every pass**. When the answer is `False`, the loop ends and Python moves to the next unindented line. If the question is False the very first time, the body runs **zero** times."""),
       ("Loop until a goal is reached", """Here `while` beats `for`. If you save 30 dollars a week toward a 100 dollar goal, how many weeks will it take? You cannot know without trying, so the loop keeps going **until the goal is reached**, and a second variable counts the passes."""),
       ("Loops that never end", """If nothing inside the loop changes the question, it stays `True` **forever**. That is an **infinite loop**, and it freezes the page. It is the most common while-loop bug. The fix is almost always to make sure the body moves the variable toward the end."""),
       ("Keep asking until it is right, and the exam's version", """A while loop is perfect for asking again until the answer is right: ask once **before** the loop, then ask again **inside** it while the answer is wrong. The exam has no `while`. Its loop is `REPEAT UNTIL(condition)`, which repeats until the condition becomes **true**. That is the **opposite** question. To translate, **flip** the condition: `REPEAT UNTIL(n > 3)` becomes `while n <= 3:`."""),
      ],
      [A("Count with while", 'count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1\nprint("Done")',
         [(0, "count = 1", "Set up BEFORE the loop."), (1, "count <= 3", "The question, asked before every pass."), (3, "count + 1", "Change it, or the loop never ends.")], out="1\n2\n3\nDone", cap="The three jobs: set up, ask, change."),
       A("Loop until a goal", 'savings = 0\nweeks = 0\nwhile savings < 100:\n    savings = savings + 30\n    weeks = weeks + 1\nprint(weeks)',
         [(2, "savings < 100", "Keep going while the goal is not reached."), (4, "weeks + 1", "Count the passes.")], out="4", cap="30, 60, 90, 120: it takes 4 weeks."),
       A("Keep asking", 'answer = input("Type go: ")\nwhile answer != "go":\n    answer = input("Type go: ")\nprint("Thanks!")',
         [(0, "input", "Ask once before the loop."), (2, "input", "Ask again inside, so the answer can change.")], cap="Two asks: one to start, one to keep trying.")],
      [T("Counting up", 'count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1\nprint("Done")', ['1| count=1', '3|', '4| count=2', '3|', '4| count=3', '3|', '4| count=4'], out="1\n2\n3\nDone", cap="After the pass where count is 3, line 4 makes it 4. The question 4 <= 3 is False, so the loop ends."),
       T("Loop until a goal", 'savings = 0\nweeks = 0\nwhile savings < 100:\n    savings = savings + 30\n    weeks = weeks + 1', ['1| savings=0', '2| weeks=0', '4| savings=30', '5| weeks=1', '4| savings=60', '5| weeks=2', '4| savings=90', '5| weeks=3', '4| savings=120', '5| weeks=4'], cap="The test is checked before every pass. After 4 passes savings is 120, so 120 < 100 is False."),
       T("A loop that never runs", 'lives = 0\nwhile lives > 0:\n    lives = lives - 1\nprint(lives)', ['1| lives=0'], out="0", cap="0 > 0 is False the first time, so the body is skipped completely."),
       T("Doubling", 'n = 1\nwhile n < 20:\n    n = n * 2', ['1| n=1', '3| n=2', '3| n=4', '3| n=8', '3| n=16', '3| n=32'], cap="16 < 20 is still True, so one more pass makes 32. Then 32 < 20 is False.")],
      [("Forgetting to change the variable", "The condition never becomes False: infinite loop.", "Update the variable inside the loop"), ("Updating it in the wrong direction", "A countdown that adds 1 never ends.", "Move toward the stop"), ("The variable is not set up first", "NameError.", "Create it before the loop"), ("`while count <= 3` and expecting it to stop at 3", "It runs for 3 too, because it is `<=`.", "Use `<` to stop before 3"),
       ("Off by one", "A `<` vs `<=` mix-up changes the number of passes by one.", "Trace the first and last pass"), ("`while x = 3:`", "One equals stores. It is not a condition.", "`while x == 3:`"), ("Asking once only", "A loop that checks a variable the body never changes.", "Ask again inside the loop"), ("Mixing up `REPEAT UNTIL` and `while`", "They ask opposite questions.", "Flip the condition when you translate")],
      ["The exam's loop is `REPEAT UNTIL(condition)`. It repeats until the condition is true, the opposite of Python's `while`.", "A loop may run zero times if its condition is already satisfied.", "Spot infinite loops: the body must change what the condition checks."],
      [Q("How many times does this loop run?", ["2", "3", "4", "Forever"], 1, "x is 1, 2, 3, then 4 stops it: three passes.", 'x = 1\nwhile x < 4:\n    x = x + 1'),
       Q("What is the problem with this loop?", ["Nothing", "It never ends", "It never starts", "A syntax error"], 1, "Nothing changes `count`, so `count <= 3` is always True.", 'count = 1\nwhile count <= 3:\n    print(count)'),
       Q("`REPEAT UNTIL(n > 3)` is the same as which Python loop?", ["`while n > 3:`", "`while n <= 3:`", "`while n == 3:`", "`for n in 3:`"], 1, "Flip the condition."),
       Q("What does `while` check?", ["After each pass", "Before every pass", "Only once", "Never"], 1, "The question is asked before the body runs each time.")]),

    L("4.10b", "Use `while True` and `break` to ask once and stop when you are ready.",
      [("`while True:`", "starts a loop that would run forever, until a `break`"), ("`break`", "jumps out of the loop right away"), ("sentinel", "a special value that means \"stop\""), ("loop and a half", "a loop that runs its test in the middle, using `break`")],
      [("Ask only once", """In the last lesson every `while` loop had its question at the **top**, and you had to ask for input **twice**: once before the loop and once inside it. The **loop and a half** is cleaner. `while True:` starts a loop that would run forever, and an `if` inside it uses **`break`** to jump out when you are done.

```
while True:
    answer = input("Type go: ")
    if answer == "go":
        break
print("Thanks!")
```
The input line appears only once."""),
       ("What break does", """`break` ends the loop **immediately**. Python skips any lines still left in the body and goes to the first unindented line after the loop. A `break` only makes sense inside an `if`, since otherwise the loop would end on the first pass."""),
       ("A sentinel", """A **sentinel** is a special value that means "I am finished", such as typing `0` or `done`. A sentinel loop keeps reading numbers and adding them up until the user types the sentinel."""),
       ("Passwords and valid input", """The loop and a half is perfect for **keep asking until it is valid**: ask inside `while True`, and `break` only when the answer passes the test. Two ways to write the same loop (ask first, then `while`; or `while True` with `break`) give the same behavior. The exam has no `break` and no `while True`: it asks for the first value before the loop and the next one at the bottom, using `REPEAT UNTIL`."""),
       ("Why it is called a loop and a half", """On the last pass, only **half** of the loop body runs: Python asks for the input, sees the stop word, and `break`s before the rest of the body. So the loop has "one and a half" passes of work: a full body on every normal pass, and just the first half on the pass that ends it."""),
      ],
      [A("Loop and a half", 'while True:\n    answer = input("Type go: ")\n    if answer == "go":\n        break\nprint("Thanks!")',
         [(0, "while True:", "Would run forever on its own."), (2, 'answer == "go"', "The stop test."), (3, "break", "Jumps out of the loop.")], out="Thanks!", cap="One input line, and the loop stops when you are ready."),
       A("A sentinel loop", 'total = 0\nwhile True:\n    n = int(input("Number: "))\n    if n == 0:\n        break\n    total = total + n\nprint(total)',
         [(3, "n == 0", "0 is the sentinel."), (5, "total + n", "Only reached when n was not 0.")], out="12", cap="With 5, 7, and 0, the total is 12.")],
      [T("Break out", 'count = 0\nwhile True:\n    count = count + 1\n    if count == 3:\n        break\nprint(count)', ['1| count=0', '3| count=1', '3| count=2', '3| count=3', '5|'], out="3", cap="On the pass where count is 3, the if is True and break ends the loop at once."),
       T("A sentinel loop", 'total = 0\nwhile True:\n    n = int(input("N: "))\n    if n == 0:\n        break\n    total = total + n\nprint(total)', ['1| total=0', '3| n=5', '6| total=5', '3| n=7', '6| total=12', '3| n=0', '5|'], inp=["5", "7", "0"], out="12", cap="The inputs are 5, 7, then 0. The 0 is not added, because break happens first."),
       T("Valid input", 'while True:\n    age = int(input("Age: "))\n    if age >= 0:\n        break\nprint(age)', ['2| age=-5', '2| age=10', '4|'], inp=["-5", "10"], out="10", cap="-5 fails the test, so the loop asks again. 10 passes, and break leaves the loop."),
       T("break in a for loop", 'for number in range(1, 10):\n    if number == 4:\n        break\n    print(number)\nprint("Out of the loop")', ['1| number=1', '2|', '4|', '1| number=2', '2|', '4|', '1| number=3', '2|', '4|', '1| number=4', '2|', '3|', '5|'], out="1\n2\n3\nOut of the loop", cap="break works in a for loop too. When number reaches 4, break jumps out, so 4 is never printed and the code after the loop runs."),
       T("Check a range before accepting", 'while True:\n    age = int(input("Age (1 to 120)? "))\n    if age >= 1 and age <= 120:\n        break\n    print("That is not a real age.")\nprint("Age saved:", age)', ['2| age=0', '3|', '5|', '2| age=15', '3|', '4|', '6|'], inp=["0", "15"], cap="0 fails the range test, so the message prints and the loop asks again. 15 passes, break leaves the loop, and the age is saved."),
       T("Without a break", 'n = 0\nwhile True:\n    n = n + 1\n    if n > 100:\n        print("big")', ['1| n=0'], check=False, cap="Nothing ever breaks: this loop runs forever. Always make sure a break can happen.")],
      [("`while True:` with no `break`", "Infinite loop.", "Put a `break` inside an `if`"), ("A `break` that is not in an `if`", "The loop ends on the first pass.", "Only break when the test passes"), ("`break` outside a loop", "SyntaxError.", "Use it inside a loop"), ("The sentinel gets added to the total", "The 0 or `done` is treated like a real value.", "Test for the sentinel before using the value"),
       ("Forgetting to convert `input()`", "TypeError on the comparison or the math.", "`int(input(...))`"), ("Unindented break", "It runs every pass.", "Indent it under the `if`"), ("Using the loop and a half on the exam", "The exam has no `break` or `while True`.", "On the exam, expect REPEAT UNTIL")],
      ["The exam has **no** `break` and **no** `while True`. It uses `REPEAT UNTIL(condition)`.", "The exam gets the first value before the loop and the next at the bottom.", "The loop and a half is a Python skill, but know it computes the same thing."],
      [Q("What does `break` do?", ["Ends the program", "Ends the loop immediately", "Skips one pass", "Restarts the loop"], 1, "It leaves the loop right away."),
       Q("What does this print?", ["1", "2", "3", "4"], 2, "The loop stops when n reaches 3.", 'n = 0\nwhile True:\n    n = n + 1\n    if n == 3:\n        break\nprint(n)'),
       Q("What is a sentinel?", ["A variable name", "A special value that means stop", "A type of loop", "An error"], 1, "It tells the loop to end."),
       Q("Why is `while True:` followed by `break` useful?", ["It asks for input only once in the code", "It is faster", "It avoids all errors", "It needs no condition"], 0, "The input line appears once, inside the loop.")]),

    L("4.11", "Use `random.randint()`, `random.choice()`, and `random.random()` to make programs unpredictable.",
      [("`import random`", "loads Python's random tools"), ("`random.randint(a, b)`", "a random whole number from a to b, including both"), ("`random.choice(list)`", "picks one random item from a list"), ("`random.random()`", "a random decimal from 0 up to but not including 1")],
      [("Roll a die", """Games, simulations, and shuffled playlists all need **randomness**. You **import** the `random` tool at the top, and then `random.randint(1, 6)` rolls a six-sided die: a **whole number from 1 to 6, and both 1 and 6 are possible**. The answer can change every time you run the program.

On the exam the version is `RANDOM(a, b)`: a random whole number from a to b, including a and b, with every result equally likely. There is no `import` on the exam."""),
       ("Flip a coin", """A program has no coin, so it uses two numbers: `random.randint(0, 1)` gives 0 or 1, each equally likely. An `if` turns the number into heads or tails."""),
       ("Both ends count", """With `randint(a, b)` **both** ends are possible. `randint(1, 6)` can give 1 and can give 6. It can **never** give 0 or 7. The exam often asks which values **could** be displayed."""),
       ("Lots of dice", """Put a roll inside a `for` loop to roll many times. A total of five dice can be as low as **5** (all ones) and as high as **30** (all sixes)."""),
       ("Pick something at random", """`random.choice(list)` picks **one random item** from a list. `random.random()` gives a random **decimal** from 0 up to, but **not including**, 1. Use `randint` for whole numbers and `choice` for picking from a list."""),
       ("Roll until you win", """Randomness and `while` go together. You do not know how many rolls it will take to get a 6, so a `while` loop is the right tool. `roll` starts at 0 (not a real roll) so the question is True and the loop runs the first time."""),
       ("How many values? range versus randint", """`random.randint(a, b)` can give **b - a + 1** different values, because both ends are included: `randint(1, 6)` gives 6 values. Compare `range(1, 6)`, which **stops before** 6 and gives only 5 numbers (1 to 5). The word **random** in `random.randint` is the name of the library you imported."""),
      ],
      [A("Roll a die", 'import random\nroll = random.randint(1, 6)\nprint(roll)',
         [(0, "import random", "Loads the tools. Put it at the top."), (1, "randint(1, 6)", "Whole number 1 to 6, both included.")], cap="A different number can print every time you run it."),
       A("Roll until a six", 'import random\nrolls = 0\nroll = 0\nwhile roll != 6:\n    roll = random.randint(1, 6)\n    rolls = rolls + 1',
         [(2, "roll = 0", "Not a real roll: makes the question True."), (3, "roll != 6", "Keep going until a six."), (5, "rolls + 1", "Count the rolls.")], cap="You cannot know how many rolls it will take: perfect for while."),
       A("Pick from a list", 'import random\ncolors = ["red", "green", "blue"]\nprint(random.choice(colors))',
         [(2, "random.choice", "One random item from the list.")], cap="Each run may print a different color.")],
      [T("A die roll (pretend values)", 'import random\nroll = random.randint(1, 6)\nbig = roll >= 5', ['2| roll=4', '3| big=False'], check=False, cap="Suppose randint gave 4 on this run. Then big is False. Another run might give 6, and then big would be True."),
       T("Roll until a six (pretend values)", 'import random\nrolls = 0\nroll = 0\nwhile roll != 6:\n    roll = random.randint(1, 6)\n    rolls = rolls + 1', ['3| roll=0', '5| roll=2', '6| rolls=1', '5| roll=5', '6| rolls=2', '5| roll=6', '6| rolls=3'], check=False, cap="Suppose the rolls were 2, 5, 6. After the 6, `6 != 6` is False and the loop ends with rolls = 3."),
       T("Five dice (pretend values)", 'import random\ntotal = 0\nfor turn in range(5):\n    roll = random.randint(1, 6)\n    total = total + roll', ['2| total=0', '4| roll=3', '5| total=3', '4| roll=6', '5| total=9'], check=False, cap="Each pass adds a new roll to the total. The smallest possible total is 5 and the largest is 30.")],
      [("Forgetting `import random`", "NameError: random is not defined.", "Put `import random` at the top"), ("`randint(1, 6)` and expecting 0 or 7", "Only 1 to 6 are possible.", "Both ends are included, nothing outside"), ("`random.randint(6)`", "randint needs two numbers: TypeError.", "`random.randint(1, 6)`"), ("`randint(1, 5)` for a six-sided die", "The 6 can never appear.", "Use the exact top number"),
       ("`random.choice(1, 2, 3)`", "choice takes one list.", "`random.choice([1, 2, 3])`"), ("`roll = random.randint(1, 6)` outside a loop in a repeat program", "You only rolled once.", "Put the roll inside the loop"), ("Expecting the same result each run", "It changes every time.", "That is what random means"), ("Starting `roll = 6` in the roll-until-a-6 loop", "The loop would never run.", "Start with a value that is not 6, like 0")],
      ["The exam's version is `RANDOM(a, b)`: a whole number from a to b, **including** both ends, each equally likely.", "A question may ask which values **could** be displayed, and which could not.", "Random results make programs behave differently each run, so you cannot trace them to one answer."],
      [Q("Which values could `random.randint(1, 6)` give?", ["1 to 6, both ends included", "0 to 6", "1 to 5", "0 to 5"], 0, "Both ends are possible."),
       Q("What can `random.randint(0, 1)` give?", ["0 only", "1 only", "0 or 1", "0.5"], 2, "It gives a whole number from 0 to 1."),
       Q("What does `random.choice([\"a\", \"b\", \"c\"])` give?", ["The list", "One item from the list", "A number", "Nothing"], 1, "It picks one item."),
       Q("How many different values can `random.randint(1, 6)` give?", ["5", "6", "7", "12"], 1, "Both ends are included: 6 - 1 + 1 = 6."),
       Q("Which is true about `range(1, 6)` and `random.randint(1, 6)`?", ["`range` stops before 6, but `randint` can give 6", "Both can give 6", "Neither can give 1", "They are the same"], 0, "range excludes the stop value, randint includes both ends."),
       Q("Which could NOT be displayed by `RANDOM(1, 3) + 1`?", ["2", "3", "4", "5"], 3, "The roll is 1, 2, or 3, so the result is 2, 3, or 4.")]),
    ],
    glossary=[], seed=4)
