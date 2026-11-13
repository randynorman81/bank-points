/* Python editor: the full explanations behind the Code words, Logic, Operators and Classes and events buttons.
   Same shape as the MATH and STRINGS entries in editor.html: {id, cls, name, sample, title, intro, sections:[{h, p, rows[[code, gives, why]], list[], ex[], quiz[[q, a]]}]}.
   L() turns a block of text into the list of lines the popup wants. */
function L(s) { return s.replace(/^\n/, "").replace(/\n$/, "").split("\n"); }
var CODEWORDS = [

/* ============================== CODE WORDS ============================== */
{ id: "k-if", cls: "c-kw", name: "if, elif, else", sample: "if elif else", title: "Making decisions: if, elif, else",
  intro: "A program does not have to run every line. An if statement lets it CHOOSE. It asks a True or False question, and the indented lines under it run only when the answer is True. elif (short for \"else if\") asks a second question when the first one was False, and else is the catch-all for when nothing above was True.",
  sections: [
    { h: "The shape", ex: L(`
if question_1:
    # runs only when question_1 is True
elif question_2:
    # runs only when question_1 was False AND question_2 is True
else:
    # runs when none of the questions above were True
`) },
    { h: "How Python reads it", list: ["It checks the questions from the top down, one at a time.", "The FIRST question that is True wins. Its lines run, and Python skips the rest of the chain.", "If none are True, the else lines run. If there is no else, nothing runs at all.", "Only ONE branch of a chain ever runs.", "elif and else are optional. You can have an if by itself, or an if with as many elifs as you need. else always goes last and never has a question."] },
    { h: "Example: letter grades", p: "This prints B. Once the B branch runs, Python never even looks at the C test.", ex: L(`
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")      # this one runs: 85 is not >= 90, but it is >= 80
elif score >= 70:
    print("C")
else:
    print("Keep working")
`) },
    { h: "Why elif is not the same as a second if", p: "Separate if statements are separate questions, and EVERY one of them gets asked. An if / elif chain is ONE question with several possible answers.", ex: L(`
points = 95

if points >= 90:
    print("A")
if points >= 80:
    print("B")      # ALSO runs: it is a brand new question

# prints A and then B

if points >= 90:
    print("A")
elif points >= 80:
    print("B")      # skipped: the first branch already ran

# prints only A
`) },
    { h: "What counts as a question", rows: [["score >= 90", "True or False", "a comparison: ==  !=  <  >  <=  >="], ["age >= 13 and has_account", "True or False", "combine questions with and, or, not"], ["\"a\" in word", "True or False", "is it inside a string or a list?"], ["name == \"Sam\"", "True or False", "two equal signs ask. One equal sign stores."]] },
    { h: "Use it when", list: ["the program must do different things depending on the data: a password check, a score, a menu choice", "you need exactly ONE result out of several, like a letter grade (use if / elif / else)", "several things could be true at once and you want ALL of them handled (use separate ifs)", "you want a fallback for \"anything else\" (else)"] },
    { h: "Watch out", list: ["The colon : at the end of the if, elif, and else lines is required. No colon is a SyntaxError.", "The lines inside must be indented (4 spaces). The indent is how Python knows which lines belong to the if.", "= stores a value and == asks a question. if x = 5: is an error. Write if x == 5:.", "It is elif. Not else if, and not elseif.", "else never has a question after it. else x > 5: is an error.", "Order matters in a chain. Put the most specific test first. With score >= 70 listed before score >= 90, a 95 would get a C."] },
    { h: "Practice (click to see the answer)", quiz: [["With score = 85, which letter does the grade example print?", "B"], ["Two separate ifs: if n > 5 and if n > 2, with n = 9. How many print?", "Both. Each if is its own question."], ["The same two tests as if / elif with n = 9. How many print?", "Only the first one. The chain stops at the first True."], ["Can an else have a question, like else x > 5:?", "No. else has no question. It runs when everything above was False."], ["What is wrong with: if x = 5:", "= stores a value. To ask a question you need ==."]] }
  ] },

{ id: "k-for", cls: "c-kw", name: "for loop", sample: "for i in", title: "Repeating with a for loop",
  intro: "A for loop repeats the indented lines a set number of times, or once for each item in something. Use it when you know HOW MANY times to repeat, or when you want to do something with EVERY item in a list or string.",
  sections: [
    { h: "The shape", ex: L(`
for variable in something_to_go_through:
    # these lines repeat, once for each item
`), list: ["for starts the loop. The line ends with a colon.", "variable is a name you choose (i, count, letter, name). Each time around, Python puts the next item in it.", "in something... is what to go through: range(...), a list, or a string.", "The indented lines are the loop body. They run once per item. Unindented lines after the loop run just once, when it finishes."] },
    { h: "range(): counting", p: "range() makes the numbers to go through. It NEVER includes the stop number.", rows: [["range(5)", "0, 1, 2, 3, 4", "one number: starts at 0 and stops BEFORE 5 (that is 5 times)"], ["range(1, 6)", "1, 2, 3, 4, 5", "two numbers: start, then stop (stop not included)"], ["range(0, 10, 2)", "0, 2, 4, 6, 8", "three numbers: start, stop, step"], ["range(10, 0, -1)", "10, 9, 8 ... 1", "a negative step counts down"], ["range(3, 3)", "(nothing)", "start equals stop, so the body never runs"]] },
    { h: "Example: count to 5", ex: L(`
for i in range(1, 6):
    print(i)

# 1
# 2
# 3
# 4
# 5
`) },
    { h: "Example: go through a list or a string", ex: L(`
colors = ["red", "green", "blue"]
for color in colors:
    print("I like", color)

for letter in "Hi!":
    print(letter)          # H, then i, then !
`) },
    { h: "Example: build up a total", p: "A loop often keeps a running answer. Make the variable BEFORE the loop and update it INSIDE the loop.", ex: L(`
total = 0
for n in range(1, 5):
    total += n            # total grows: 1, 3, 6, 10
print(total)             # 10   (not indented, so it runs once, after the loop)
`) },
    { h: "A loop inside a loop", p: "A loop inside a loop is called a nested loop. The inner loop runs completely every time the outer loop goes around once.", ex: L(`
for row in range(3):
    for col in range(2):
        print(row, col)

# 0 0
# 0 1
# 1 0
# 1 1
# 2 0
# 2 1      6 lines: 3 rows x 2 columns
`) },
    { h: "break and continue", rows: [["break", "stops the loop completely", "jump out and keep going after the loop"], ["continue", "skips to the next item", "skip the rest of this trip only"]], ex: L(`
for n in range(1, 10):
    if n == 5:
        break          # stop the whole loop at 5
    print(n)           # prints 1, 2, 3, 4
`) },
    { h: "Use it when", list: ["you know how many times to repeat (do this 10 times)", "you want to do something with every item in a list or every letter in a string", "you are counting, adding up, or building something one step at a time", "you want to draw or place many shapes: for i in range(5): ..."] },
    { h: "Watch out", list: ["range(5) is 0 to 4, NOT 1 to 5. For 1 to 5 write range(1, 6).", "The stop number is never included. This causes most off-by-one mistakes.", "Do not forget the colon and the indent.", "A variable made inside the loop is rebuilt every trip. Make totals and counters BEFORE the loop (total = 0), not inside it.", "Do not add or remove items from the list you are looping through while you loop.", "The loop variable keeps its last value after the loop ends."] },
    { h: "Practice (click to see the answer)", quiz: [["How many times does for i in range(4): run?", "4 times (i is 0, 1, 2, 3)"], ["What numbers does range(2, 7) give?", "2, 3, 4, 5, 6   (7 is not included)"], ["What does range(10, 0, -2) give?", "10, 8, 6, 4, 2"], ["for letter in \"cat\": print(letter)  prints how many lines?", "3   (c, a, t)"], ["total starts at 0, then: for n in range(1, 4): total += n. What is total?", "6   (1 + 2 + 3)"], ["Which loop is better when you do NOT know how many times to repeat?", "A while loop"]] }
  ] },

{ id: "k-while", cls: "c-kw", name: "while loop", sample: "while", title: "Repeating with a while loop",
  intro: "A while loop repeats the indented lines AS LONG AS a True or False question stays True. Before each trip around, Python asks the question again. The moment the answer is False, the loop stops. Use it when you do NOT know ahead of time how many times to repeat.",
  sections: [
    { h: "The shape", ex: L(`
while question:
    # these lines repeat while question is True
    # something in here must eventually make question False
`), list: ["Python asks the question BEFORE every trip, including the first one.", "True: run the body, then ask again. False: skip the body and move on.", "If the question is False the very first time, the body never runs at all.", "Something inside the loop has to change so the question CAN become False. If nothing changes, the loop never ends."] },
    { h: "Example: a countdown", ex: L(`
lives = 3
while lives > 0:
    print("Lives left:", lives)
    lives -= 1          # this line is what makes the loop end
print("Game over")

# Lives left: 3
# Lives left: 2
# Lives left: 1
# Game over
`) },
    { h: "Example: keep asking until it is right", p: "You cannot know how many tries the user will need. That is exactly when while is the right tool.", ex: L(`
password = input("Password? ")
while password != "python":
    print("Wrong, try again.")
    password = input("Password? ")    # ask again INSIDE the loop
print("Welcome!")
`) },
    { h: "Example: counting with while", ex: L(`
count = 1
while count <= 5:
    print(count)
    count += 1          # without this line the loop runs forever
`) },
    { h: "Infinite loops, and while True", p: "A loop that never stops is an infinite loop. It happens when nothing inside changes the question. Sometimes you do it on purpose with while True: and use break to get out.", ex: L(`
while True:
    answer = input("Type quit to stop: ")
    if answer == "quit":
        break            # jumps out of the loop
    print("You typed", answer)
`) },
    { h: "for or while?", rows: [["Repeat 10 times", "for", "you know how many"], ["Go through every item in a list", "for", "one trip per item"], ["Repeat until the user types the right answer", "while", "you do not know how many tries"], ["Repeat until a game is over", "while", "it depends on what happens"], ["Count up or down by 1", "either", "for is shorter"]] },
    { h: "Use it when", list: ["you repeat until something happens, not a set number of times", "you check what the user typed and ask again if it is not valid", "you run a game or a menu until the player quits", "you keep going until a total reaches a goal"] },
    { h: "Watch out", list: ["Forgetting to update the variable (count += 1) makes an infinite loop. Use the Stop button to end it.", "The starting value must make the question True the first time, or the loop never runs. Set it up BEFORE the loop.", "Off-by-one: while count < 5 with count starting at 1 runs 4 times. while count <= 5 runs 5 times.", "A question that uses == (like while count == 10:) usually never runs, because it starts False.", "The question follows the same rules as if: ==  !=  <  >  and  or  not.", "Do not forget the colon and the indent."] },
    { h: "Practice (click to see the answer)", quiz: [["How many times does this run:  i = 0, then  while i < 3: i += 1 ?", "3 times"], ["What happens if count += 1 is missing from the counting loop?", "It never ends (an infinite loop), because count stays 1 forever."], ["lives starts at 0 and the loop says while lives > 0. How many times does the body run?", "0 times. The question is False the very first time."], ["What does break do inside a loop?", "Stops the loop right away and continues with the code after it."], ["Which loop would you use to keep asking for a password until it is right?", "while"]] }
  ] },

/* ============================== LOGIC ============================== */
{ id: "l-not", cls: "c-logic", name: "not", sample: "not", title: "not: flip True and False",
  intro: "not takes one True or False answer and FLIPS it. True becomes False and False becomes True. It reads like English: not game_over means the game is NOT over.",
  sections: [
    { h: "The whole truth table", rows: [["not True", "False", "flips True to False"], ["not False", "True", "flips False to True"]] },
    { h: "What it gives you", rows: [["not (5 > 3)", "False", "5 > 3 is True, and not flips it"], ["not (2 > 9)", "True", "2 > 9 is False, flipped to True"], ["not game_over", "True when game_over is False", "great for flag variables"], ["not x == 5", "the same as x != 5", "both mean: x is NOT 5"]] },
    { h: "Examples", ex: L(`
game_over = False
if not game_over:
    print("Keep playing")      # runs, because game_over is False

word = "python"
if "z" not in word:             # the short way to write  not "z" in word
    print("No z here")

raining = True
print(not raining)             # False
`) },
    { h: "Use it when", list: ["a variable holds True or False and you want to act on the opposite (if not game_over:)", "you want to check that something is MISSING: if name not in guests:", "it is easier to ask the question one way and flip it than to write the opposite"] },
    { h: "Watch out", list: ["not only flips the thing right after it. Use parentheses to flip a whole question: not (a and b) is different from (not a) and b.", "if not x == 5 works, but x != 5 says the same thing more clearly.", "not is a WORD in Python. Other languages use ! but Python does not.", "not needs a True or False answer after it. not 5 is legal but confusing, so ask a real question."] },
    { h: "Practice (click to see the answer)", quiz: [["not True", "False"], ["not (4 > 1)", "False   (4 > 1 is True)"], ["done = False. What is not done?", "True"], ["Another way to write not x == 7", "x != 7"], ["What does not not True give?", "True   (flipped twice)"]] }
  ] },

{ id: "l-and", cls: "c-logic", name: "and", sample: "and", title: "and: BOTH must be True",
  intro: "and joins two questions into one. The whole thing is True ONLY when BOTH sides are True. If even one side is False, the answer is False.",
  sections: [
    { h: "The whole truth table", rows: [["True and True", "True", "both are True"], ["True and False", "False", "one is False"], ["False and True", "False", "one is False"], ["False and False", "False", "both are False"]] },
    { h: "Real questions", rows: [["age >= 13 and has_account", "True or False", "needs BOTH: old enough AND has an account"], ["5 > 3 and 2 > 1", "True", "both sides are True"], ["5 > 3 and 2 > 9", "False", "the right side is False"], ["x >= 1 and x <= 10", "True for 1 through 10", "a range check: between 1 and 10"]] },
    { h: "Examples", ex: L(`
age = 15
has_ticket = True

if age >= 13 and has_ticket:
    print("Come on in")

# checking that a number is in a range
n = 7
if n >= 1 and n <= 10:
    print("n is from 1 to 10")

# Python also lets you write the range check the short way
if 1 <= n <= 10:
    print("same thing")
`) },
    { h: "Use it when", list: ["two or more things must ALL be true (right age AND right password)", "you check that a number is inside a range (at least 1 AND at most 10)", "a game needs several conditions at once (alive AND has the key)"] },
    { h: "Watch out", list: ["Each side of and must be a COMPLETE question. x > 1 and x < 10 works. x > 1 and < 10 is an error.", "Do not write x == 1 and 2. Write x == 1 and y == 2.", "and is picky: ONE False makes the whole thing False.", "When you mix them, Python works out not first, then and, then or. Use parentheses to be safe: (a or b) and c.", "Python stops early: if the left side is False, it never even looks at the right side."] },
    { h: "Practice (click to see the answer)", quiz: [["True and False", "False"], ["5 > 2 and 8 > 3", "True"], ["10 > 2 and 3 > 7", "False"], ["When is  a and b  True?", "Only when BOTH a and b are True."], ["Fix this:  if x > 1 and < 10:", "if x > 1 and x < 10:"]] }
  ] },

{ id: "l-or", cls: "c-logic", name: "or", sample: "or", title: "or: AT LEAST ONE must be True",
  intro: "or joins two questions into one. The whole thing is True when AT LEAST ONE side is True. It is False only when BOTH sides are False.",
  sections: [
    { h: "The whole truth table", rows: [["True or True", "True", "both True: still True"], ["True or False", "True", "one is True"], ["False or True", "True", "one is True"], ["False or False", "False", "the only way to get False"]] },
    { h: "Real questions", rows: [["day == \"Saturday\" or day == \"Sunday\"", "True on weekends", "either day is enough"], ["3 > 5 or 2 < 4", "True", "the right side is True"], ["age < 5 or age > 65", "True for under 5 and over 65", "either end counts"], ["answer == \"y\" or answer == \"Y\"", "True for either letter", "accept lowercase or capital"]] },
    { h: "Examples", ex: L(`
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("Weekend!")

answer = input("Continue? ")
if answer == "y" or answer == "yes":
    print("Okay, continuing")
`) },
    { h: "Use it when", list: ["any one of several choices is good enough (y OR yes)", "you want to catch more than one bad case (too low OR too high)", "a game has more than one way to end (out of lives OR time is up)"] },
    { h: "Watch out", list: ["if day == \"Sat\" or \"Sun\": is the classic bug. The second part is just a word, and a word always counts as True, so the whole thing is ALWAYS True. Write day == \"Sat\" or day == \"Sun\".", "or is True when one side is True, and also when both are. It does not mean \"one or the other but not both\".", "and and or are different: and needs both, or needs one.", "When you mix them, use parentheses so it reads the way you mean it."] },
    { h: "Practice (click to see the answer)", quiz: [["True or False", "True"], ["False or False", "False"], ["3 > 5 or 2 < 4", "True"], ["For which ages is  age < 5 or age > 65  True?", "Under 5, and over 65"], ["What is wrong with  if color == \"red\" or \"blue\":", "The word \"blue\" is always True. It needs color == \"blue\" after the or."]] }
  ] },

{ id: "l-in", cls: "c-logic", name: "in", sample: "in", title: "in: is it inside?",
  intro: "in asks whether something is INSIDE a string or a list. The answer is True or False. Putting not in front asks whether it is missing.",
  sections: [
    { h: "What it gives you", rows: [["\"th\" in \"Python\"", "True", "th appears inside Python"], ["\"z\" in \"Python\"", "False", "no z in Python"], ["\"Th\" in \"Python\"", "False", "capital letters matter"], ["3 in [1, 2, 3]", "True", "3 is an item in the list"], ["\"z\" not in \"Python\"", "True", "not in asks if it is missing"]] },
    { h: "Examples", ex: L(`
word = "banana"
if "an" in word:
    print("found it")

fruits = ["apple", "pear"]
if "kiwi" not in fruits:
    print("no kiwi today")

for letter in "cat":       # careful: this in belongs to a for loop, not a question
    print(letter)
`) },
    { h: "Watch out", list: ["in checks for text or an item anywhere inside. .find() tells you WHERE it is.", "For a list, in looks for a whole item, not part of one: \"app\" in [\"apple\"] is False.", "The word in is used two ways: in a for loop (for x in list:) it means go through each one. In a question it means is it inside."] },
    { h: "Practice (click to see the answer)", quiz: [["\"cat\" in \"concatenate\"", "True"], ["\"dog\" in [\"dog\", \"cat\"]", "True"], ["\"do\" in [\"dog\", \"cat\"]", "False   (it has to be a whole item)"], ["\"x\" not in \"hello\"", "True"]] }
  ] },

/* ============================== OPERATORS ============================== */
{ id: "o-assign", cls: "c-op", name: "=  Assign", sample: "=", title: "=  : store a value",
  intro: "A single equal sign is NOT a question. It is an instruction: work out what is on the right, and store it in the variable name on the left. Read it as \"gets\", not \"equals\".",
  sections: [
    { h: "What it does", rows: [["score = 10", "score holds 10", "creates the variable"], ["score = score + 1", "score is now 11", "work out the RIGHT side first, then store it"], ["a = b", "a gets a copy of b's value", "the value is copied"], ["name = input(\"Name? \")", "stores what the user typed", "the right side can be any expression"]] },
    { h: "Examples", ex: L(`
lives = 3
lives = lives - 1        # lives is now 2
greeting = "Hi " + "Sam"  # greeting holds Hi Sam

x = y = 0                # both names get 0
a, b = 1, 2              # a gets 1 and b gets 2
`) },
    { h: "Use it when", list: ["you want to remember a value so you can use it later", "you want to change a value (score = score + 5)", "you want to save the answer a function gives you"] },
    { h: "Watch out", list: ["= stores and == asks. if x = 5: is an error. Use if x == 5:.", "The name goes on the LEFT. 5 = x is an error.", "score = score + 1 is not a math puzzle. It means: take the old score, add 1, and store the new answer back.", "A variable must exist before you use it on the right: total = total + 1 fails if total was never set."] },
    { h: "Practice (click to see the answer)", quiz: [["x = 4 then x = x + 3. What is x?", "7"], ["Which one stores: = or ==?", "=   (== asks a question)"], ["a = 5, b = a, a = 9. What is b?", "5   (b kept its own copy)"], ["Why does 5 = x fail?", "The variable name has to be on the left."]] }
  ] },

{ id: "o-eq", cls: "c-op", name: "==  Equal to", sample: "==", title: "==  : is it equal?",
  intro: "Two equal signs ASK a question: are these two things the same? The answer is True or False. It does not store anything and does not change anything.",
  sections: [
    { h: "What it gives you", rows: [["5 == 5", "True", "the same number"], ["5 == 6", "False", "different numbers"], ["\"cat\" == \"cat\"", "True", "text works too"], ["\"cat\" == \"Cat\"", "False", "capital letters matter"], ["5 == \"5\"", "False", "a number and text are different things"], ["x % 2 == 0", "True for even numbers", "work out the % first, then ask if it is 0"]] },
    { h: "Examples", ex: L(`
password = input("Password? ")
if password == "python":
    print("Welcome")
else:
    print("Wrong")

n = 12
print(n == 12)          # True
print(n == 13)          # False
`) },
    { h: "Use it when", list: ["you check what the user typed", "you check if a counter has reached an exact number", "you check if a number is even or odd with %", "you compare two values inside an if or a while"] },
    { h: "Watch out", list: ["ONE equal sign stores a value. TWO ask a question. This is the most common beginner mistake.", "No space between the two signs: = = is an error.", "== compares exact values. \"5\" (text) and 5 (a number) are NOT equal, so convert with int() first.", "Decimals can be off by a tiny bit: 0.1 + 0.2 == 0.3 is False. Round first or compare with > and <."] },
    { h: "Practice (click to see the answer)", quiz: [["7 == 7", "True"], ["\"a\" == \"A\"", "False"], ["3 == \"3\"", "False   (a number is not text)"], ["What is wrong with  if x = 10:", "It must be == to ask a question."], ["What does 10 % 2 == 0 tell you?", "True: 10 is even."]] }
  ] },

{ id: "o-ne", cls: "c-op", name: "!=  Not equal to", sample: "!=", title: "!=  : is it different?",
  intro: "!= asks the OPPOSITE of ==. It is True when the two things are NOT the same, and False when they are the same. Read it as \"not equal to\".",
  sections: [
    { h: "What it gives you", rows: [["5 != 6", "True", "different numbers"], ["5 != 5", "False", "the same number"], ["\"a\" != \"b\"", "True", "different text"], ["\"cat\" != \"Cat\"", "True", "capital letters make them different"], ["x != 0", "True when x is anything but 0", "a common safety check"]] },
    { h: "Examples", ex: L(`
answer = input("Type quit to stop: ")
while answer != "quit":          # keep going while it is NOT quit
    print("You said", answer)
    answer = input("Type quit to stop: ")

divisor = 4
if divisor != 0:                 # protects against dividing by zero
    print(100 / divisor)
`) },
    { h: "Use it when", list: ["you keep a loop going until the user types a special word", "you check that something is NOT a certain value", "you protect a calculation, like making sure you do not divide by zero"] },
    { h: "Watch out", list: ["The symbols are ! then =, with no space between them. There is no <> in Python and no =! either.", "x != 5 and not x == 5 mean the same thing. != is easier to read.", "Strings and numbers are different: 5 != \"5\" is True."] },
    { h: "Practice (click to see the answer)", quiz: [["8 != 8", "False"], ["8 != 9", "True"], ["\"hi\" != \"hi\"", "False"], ["Another way to write not x == 3", "x != 3"], ["Write the question: is age NOT 18?", "age != 18"]] }
  ] },

{ id: "o-cmp", cls: "c-op", name: "<  >  <=  >=", sample: "< > <= >=", title: "Greater than, less than, and or-equal-to",
  intro: "These four ask which number is bigger. The answer is always True or False. The = on the end means \"or equal to\", so the boundary number counts.",
  sections: [
    { h: "The four", rows: [["5 > 3", "True", "greater than"], ["5 < 3", "False", "less than"], ["5 >= 5", "True", "greater than OR EQUAL to: equal counts"], ["5 > 5", "False", "greater than: equal does NOT count"], ["3 <= 2", "False", "less than or equal to"], ["\"apple\" < \"banana\"", "True", "text compares in alphabet order"]] },
    { h: "Examples", ex: L(`
age = 13
if age >= 13:               # 13 counts
    print("Teen")

score = 60
if score > 59 and score <= 69:
    print("D")

if len(name) < 3:           # shorter than 3 characters
    print("Too short")
`) },
    { h: "Use it when", list: ["you check a score, an age, or a price against a limit", "you build grade ranges or price tiers with if / elif", "you keep a loop going while a counter is under a limit: while count < 10:"] },
    { h: "Watch out", list: ["The = goes AFTER: >= and <=. Writing => or =< is an error.", "The boundary matters. age > 13 leaves out 13, age >= 13 includes it.", "A number and text cannot be compared. 5 < \"7\" is a TypeError. Convert with int() first.", "input() always gives text, so convert it before comparing: int(input(...))."] },
    { h: "Practice (click to see the answer)", quiz: [["10 >= 10", "True"], ["10 > 10", "False"], ["2 < 1", "False"], ["Does age > 13 include a 13 year old?", "No. Use age >= 13."], ["Fix:  if score => 90:", "if score >= 90:"]] }
  ] },

{ id: "o-pow", cls: "c-op", name: "**  To the power of", sample: "**", title: "**  : to the power of (exponent)",
  intro: "** raises a number to a power. The number on the left is multiplied by ITSELF as many times as the number on the right says. 2 ** 3 means 2 x 2 x 2.",
  sections: [
    { h: "What it gives you", rows: [["2 ** 3", "8", "2 x 2 x 2"], ["5 ** 2", "25", "5 squared"], ["10 ** 3", "1000", "10 x 10 x 10"], ["9 ** 0.5", "3.0", "a power of 0.5 is the square root"], ["2 ** 0", "1", "anything to the power of 0 is 1"], ["2 ** -1", "0.5", "a negative power divides: 1 / 2"]] },
    { h: "Examples", ex: L(`
side = 6
area = side ** 2          # 36   area of a square
cube = side ** 3          # 216  volume of a cube

radius = 5
circle_area = 3.14 * radius ** 2     # ** happens BEFORE the multiply: 78.5

print(2 ** 10)            # 1024
`) },
    { h: "Order of operations", p: "** goes before * / // % + -, and powers stack from right to left.", rows: [["2 * 3 ** 2", "18", "the power first: 3 ** 2 = 9, then x 2"], ["(2 * 3) ** 2", "36", "brackets first"], ["2 ** 3 ** 2", "512", "right to left: 3 ** 2 = 9, then 2 ** 9"], ["-2 ** 2", "-4", "power first, then the minus sign"]] },
    { h: "Use it when", list: ["you square a number (side ** 2) or cube it (side ** 3)", "you find a square root with ** 0.5", "you grow something over and over: money, populations, 2 ** number_of_bits"] },
    { h: "Watch out", list: ["The caret ^ is NOT power in Python. It does something else. Use **.", "2 * 3 is 6 but 2 ** 3 is 8. Do not mix up the stars.", "No space between the two stars: * * is an error.", "A power of 0.5 or a negative power gives a decimal (a float)."] },
    { h: "Practice (click to see the answer)", quiz: [["3 ** 2", "9"], ["2 ** 5", "32"], ["10 ** 2", "100"], ["4 ** 0.5", "2.0   (the square root)"], ["How do you square a variable named n?", "n ** 2"]] }
  ] },

{ id: "o-short", cls: "c-op", name: "+=  -=  *=  /=", sample: "+=", title: "+=  : the short forms",
  intro: "A short form changes a variable using its OWN old value. score += 5 means \"take the score and add 5 to it\". It is a shorter way to write score = score + 5.",
  sections: [
    { h: "All of them", rows: [["score += 5", "score = score + 5", "add to it"], ["score -= 2", "score = score - 2", "subtract from it"], ["score *= 3", "score = score * 3", "multiply it"], ["score /= 2", "score = score / 2", "divide it (gives a float)"], ["score //= 2", "score = score // 2", "whole-number divide"], ["n %= 10", "n = n % 10", "keep the remainder"], ["text += \"!\"", "text = text + \"!\"", "works on text too"]] },
    { h: "Examples", ex: L(`
score = 0
score += 10        # 10
score += 5         # 15
score -= 3         # 12

count = 0
for i in range(5):
    count += 1     # the classic counter: count goes 1, 2, 3, 4, 5

message = "Hi"
message += " there"    # Hi there
`) },
    { h: "Use it when", list: ["you count something: count += 1", "you add up a total inside a loop: total += price", "you take away lives or points: lives -= 1", "you build up a longer string one piece at a time"] },
    { h: "Watch out", list: ["The operator goes FIRST and the = LAST: +=, not =+. x =+ 5 stores positive 5.", "No space between them: + = is an error.", "The variable must already exist. Start with total = 0 before total += 5.", "/= always makes a decimal, even when it divides evenly: 8 /= 2 gives 4.0."] },
    { h: "Practice (click to see the answer)", quiz: [["x = 10, then x += 4. What is x?", "14"], ["x = 10, then x -= 4. What is x?", "6"], ["x = 3, then x *= 4. What is x?", "12"], ["Write count = count + 1 the short way.", "count += 1"], ["What is wrong with  total += 5  as the very first line, before total exists?", "total has no value yet. Start with total = 0."]] }
  ] },

/* ============================== CLASSES AND EVENTS ============================== */
{ id: "c-class", cls: "c-def", name: "class", sample: "class Dog:", title: "class: a blueprint for making objects",
  intro: "A class is a BLUEPRINT. It describes what a kind of thing is like (what information it holds) and what it can do (its actions), but it is not one of the things itself. Think of a cookie cutter, a house plan, or a recipe: one design you can use again and again to make many real ones.",
  sections: [
    { h: "The idea, in plain words", list: ["A class describes a TYPE of thing: Dog, Player, Enemy, Circle, BankAccount.", "It lists the information every one of them carries. These are called attributes. A dog has a name and an age.", "It lists the actions every one of them can do. These are called methods, which are just functions that belong to the class. A dog can bark().", "The class itself holds no real data. You use it to make OBJECTS (see the object button), and each object holds its own real data."] },
    { h: "A class, line by line", ex: L(`
class Dog:                          # 1. class, then a name that starts with a capital
    def __init__(self, name, age):  # 2. the setup method: runs automatically when a Dog is made
        self.name = name            # 3. attributes: this dog's own information
        self.age = age

    def bark(self):                 # 4. a method: something a Dog can do
        print(self.name, "says woof!")
`), rows: [["class Dog:", "starts the blueprint", "the name is usually CapitalizedWords, and the line ends with a colon"], ["def __init__(self, ...)", "the setup method", "runs once, automatically, every time a new object is made. Two underscores before and after init"], ["self", "this particular object", "the first parameter of every method. It means \"the one I am working on right now\". You do not type it when you call the method"], ["self.name = name", "an attribute", "stores information ON the object. self.name belongs to this dog. name is just the value that was passed in"], ["def bark(self):", "a method", "a function inside the class, called with a dot: rex.bark()"]] },
    { h: "Using the class to make objects", p: "One class, two different dogs. Each object has its own name and age.", ex: L(`
rex = Dog("Rex", 3)       # make an object. __init__ runs, and self is rex
mia = Dog("Mia", 5)       # a second, separate object

print(rex.name)          # Rex
print(mia.age)           # 5
rex.bark()               # Rex says woof!
mia.bark()               # Mia says woof!
`) },
    { h: "A class that changes", ex: L(`
class Counter:
    def __init__(self):
        self.count = 0           # every new Counter starts at 0

    def add_one(self):
        self.count += 1          # change THIS object's own attribute

c = Counter()
c.add_one()
c.add_one()
print(c.count)                  # 2
`) },
    { h: "Classes you have already used", p: "You have used classes without writing them. In the graphics library, Circle, Rectangle and Text are classes. Circle(50) makes a circle OBJECT, and set_color() and set_position() are methods. Strings and lists are classes too, which is why \"hi\".upper() and colors.append(...) work.", ex: L(`
ball = Circle(50)            # make an object from the Circle class
ball.set_position(100, 200)  # a method that belongs to that object
ball.set_color(Color.red)
add(ball)
`) },
    { h: "Why classes are useful", list: ["They keep information and actions together in one place.", "You can make many copies without copy-pasting code: 100 enemies is 100 objects from one Enemy class.", "Every copy keeps its OWN data.", "Bigger programs stay organized."] },
    { h: "Watch out", list: ["Writing a class does nothing by itself. You must create an object from it: rex = Dog(...).", "Every method needs self as its FIRST parameter, or you get a TypeError.", "Inside the class, use self.name to reach an attribute. Writing just name reaches an ordinary variable that disappears when the method ends.", "__init__ has TWO underscores on each side.", "Do not type self when you CALL a method: rex.bark(), not rex.bark(rex).", "Class names are Capitalized (Dog). Object variables are lowercase (rex)."] },
    { h: "Practice (click to see the answer)", quiz: [["What is a class?", "A blueprint that describes what a kind of object holds and what it can do."], ["What does __init__ do?", "It runs automatically when an object is made, and sets up its attributes."], ["What does self mean inside a method?", "The specific object the method is working on right now."], ["Does writing  class Dog:  create a dog?", "No. It only describes dogs. rex = Dog(...) creates one."], ["What is the difference between an attribute and a method?", "An attribute is information the object holds (self.name). A method is an action it can do (bark())."], ["In  ball = Circle(50) , which is the class and which is the object?", "Circle is the class. ball is the object it made."]] }
  ] },

{ id: "c-object", cls: "c-def", name: "object", sample: "rex = Dog()", title: "object: one real thing made from a class",
  intro: "An object is ONE real, working thing made from a class. If the class is the blueprint, the object is the actual house built from it. It holds its own information (attributes) and knows how to do its own actions (methods). A program can make as many objects from one class as it likes, and each one is separate.",
  sections: [
    { h: "Class vs object", rows: [["Dog", "the class (the blueprint)", "describes what every dog is like"], ["rex = Dog(\"Rex\", 3)", "an object", "a real dog named Rex, age 3"], ["mia = Dog(\"Mia\", 5)", "a different object", "same class, its own data"]] },
    { h: "Making an object", p: "Calling the class name like a function builds a new object. Python also calls this creating an INSTANCE of the class, so \"object\" and \"instance\" mean the same thing.", ex: L(`
rex = Dog("Rex", 3)     # rex is an object, an instance of Dog
`) },
    { h: "Using an object: the dot", p: "The dot reaches INSIDE an object. The thing before the dot is the object, and the thing after the dot is one of its attributes or methods.", rows: [["rex.name", "Rex", "read an attribute (no parentheses)"], ["rex.age = 4", "changes it", "change an attribute"], ["rex.bark()", "Rex says woof!", "call a method (with parentheses)"], ["rex.age + 1", "5", "an attribute works like any variable"]] },
    { h: "Objects are independent", ex: L(`
a = Counter()
b = Counter()
a.add_one()
a.add_one()
b.add_one()
print(a.count)   # 2
print(b.count)   # 1    a change to a never touches b
`) },
    { h: "Objects you use every day", p: "Almost everything in Python is an object. A string is an object with methods, a list is an object, and every graphics shape is an object.", rows: [["\"hello\".upper()", "HELLO", "a string object calling a method"], ["colors.append(\"red\")", "adds to the list", "a list object calling a method"], ["ball = Circle(30)", "a Circle object", "a shape you can move and color"], ["ball.set_color(Color.blue)", "changes THAT object only", "each shape keeps its own color"]] },
    { h: "Two names, one object", p: "Setting b = a does NOT copy the object. Both names point at the same one, so changing it through one name changes it for both.", ex: L(`
a = Dog("Rex", 3)
b = a              # not a copy: b is a second name for the SAME object
b.age = 10
print(a.age)       # 10
`) },
    { h: "Watch out", list: ["Attributes have no parentheses (rex.name). Methods DO (rex.bark()).", "A typo in an attribute name gives an AttributeError: rex.nmae says the Dog object has no attribute nmae.", "Call methods on the object (rex.bark()), not on the class name.", "Each object needs its own variable name: rex, mia."] },
    { h: "Practice (click to see the answer)", quiz: [["What is the difference between a class and an object?", "The class is the blueprint. The object is one real thing built from it."], ["How do you make a Dog object named buddy?", "buddy = Dog(\"Buddy\", 2)   (pass what __init__ asks for)"], ["a.count is 2 and b = Counter() is brand new. What is b.count?", "0. Each object has its own data."], ["What error does rex.nmae give?", "AttributeError: there is no attribute with that name."], ["After a = Dog(...) and b = a, changing b.age also changes a.age. Why?", "b is another name for the same object, not a copy."]] }
  ] },

{ id: "c-keyev", cls: "c-builtin", name: "key event", sample: "add_key_down_handler", title: "key event: reacting to the keyboard",
  intro: "A key event happens whenever the user presses (or lets go of) a key on the keyboard. Your program does not sit and wait for it. Instead you write a function called a HANDLER, register it once, and the canvas calls it for you automatically every time a key is pressed. This is how games react to the arrow keys.",
  sections: [
    { h: "The big idea: events", list: ["An event is something that happens that your program did not start itself: a key press, a mouse click.", "A handler is a function you write that says what to do when the event happens.", "You register the handler once. After that it is called by itself, every single time.", "Your normal code runs first and finishes. The handler runs later, whenever the user does something."] },
    { h: "The pattern", ex: L(`
def on_key(event):              # 1. the handler. It MUST take one parameter
    print(event.key)           # 2. event.key says which key was pressed

add_key_down_handler(on_key)   # 3. register it (NO parentheses after on_key)
`), rows: [["def on_key(event):", "the handler", "any name you like, but it needs ONE parameter. The canvas hands it an event object"], ["event.key", "which key", "a string like \"a\", \"ArrowLeft\", \"ArrowUp\", or \" \" (the space bar)"], ["add_key_down_handler(on_key)", "registers it", "runs on_key every time a key goes DOWN"], ["add_key_up_handler(on_key)", "registers a release handler", "runs when a key is let go (key UP)"]] },
    { h: "Example: move a square with the arrow keys", ex: L(`
square = Rectangle(40, 40)
square.set_position(180, 180)
add(square)

def move_square(event):
    if event.key == "ArrowLeft":
        square.move(-15, 0)
    elif event.key == "ArrowRight":
        square.move(15, 0)
    elif event.key == "ArrowUp":
        square.move(0, -15)
    elif event.key == "ArrowDown":
        square.move(0, 15)

add_key_down_handler(move_square)
`) },
    { h: "Key names", rows: [["\"a\"  \"b\"  \"c\" ...", "letter keys", "lowercase unless Shift is held"], ["\"ArrowLeft\"  \"ArrowRight\"", "the left and right arrows", "exact spelling and capital letters"], ["\"ArrowUp\"  \"ArrowDown\"", "the up and down arrows", "exact spelling and capital letters"], ["\" \"", "the space bar", "a string with one space in it"]] },
    { h: "Press and release: moving while a key is held", ex: L(`
is_moving = False

def start_moving(event):
    global is_moving
    is_moving = True

def stop_moving(event):
    global is_moving
    is_moving = False

add_key_down_handler(start_moving)
add_key_up_handler(stop_moving)
`), p: "is_moving stays True for as long as the key is held down. This is the standard way to make a game character move smoothly while a key is held." },
    { h: "Use it when", list: ["you make a game that reacts to the keyboard", "you move a shape with the arrow keys", "you want a key to start or stop something (space to jump, Enter to start)"] },
    { h: "Watch out", list: ["The handler MUST have the event parameter, even if you never use it. def on_key(): causes a TypeError the instant a key is pressed.", "Register with the NAME only: add_key_down_handler(on_key). With parentheses, add_key_down_handler(on_key()), you run it right away instead of registering it.", "Key names are exact and case-sensitive: \"ArrowLeft\", not \"left\".", "To change a variable that was made outside the handler, put  global variable_name  on the first line inside the handler. Otherwise Python raises an UnboundLocalError.", "A handler only runs for keys pressed AFTER it is registered.", "This is a graphics-library skill. The AP exam pseudocode has no keyboard events."] },
    { h: "Practice (click to see the answer)", quiz: [["What is an event handler?", "A function that runs automatically when an event, like a key press, happens."], ["What does event.key hold?", "A string naming the key that was pressed, like \"ArrowLeft\" or \"a\"."], ["add_key_down_handler(on_key) or add_key_down_handler(on_key())?", "on_key with no parentheses. You hand over the function, you do not run it."], ["What error do you get if the handler has no parameter?", "TypeError: it takes 0 positional arguments but 1 was given."], ["What is the difference between key down and key up?", "Key down runs when a key is pressed. Key up runs when it is released."], ["Why is \"left\" wrong for the left arrow key?", "The key name is exactly \"ArrowLeft\"."]] }
  ] }
];
