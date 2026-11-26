"""Writes python/training-u4.js: the company 'training' voice for the Unit 4 walkthroughs (a16-a23, a26-a28).
Each walkthrough is shown in the SAME company skin as its assignment (a139-a150, no walkthrough for 4.9): an email from the same boss, a short note
from them at each step, and a hand-off at the end that opens the assignment. The walkthrough's own steps, checkboxes and checks are NOT changed
(so scoring is untouched). One note per step: the count must equal the walkthrough's step count (checked below).
usage: python3 tools/training/gen_u4.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = {}
def tr(slot, assign, match, subject, paras, sign, notes, outro):
    T[slot] = dict(assign=assign, match=match, email=dict(subject=subject, paras=paras, sign=sign), notes=notes, outro=outro)
GEN = "Work through the steps below in order. Each task has a checkbox, and the small line under it turns green when your code has what the task needs. When every step is green, click **Submit** at the top."

tr('a16', 'a139', 'Booleans', 'Welcome to Accounts Platform: training first, then your first ticket',
 ["Hi, and welcome to Accounts Platform! I'm Maya. Before I hand you any real work, everyone on the team does a short training, and I'll be here for each step.",
  "Features on an account switch on or off based on yes or no facts: is it verified, is it public, does it have enough followers. Those yes or no values are **Booleans**, and this training is all about them.",
  GEN + " Once your training is submitted, I'll send you your first ticket: the **account flags** script."], "Thanks, Maya",
 ["Every switch in our system is one of two values. Learn how Python spells them.",
  "A switch can be turned off later, so a Boolean has to be able to change.",
  "Most of our switches are not typed in by hand. They come from comparing numbers.",
  "We store the answer of a comparison under a name so the rest of the code can use it.",
  "One equals sign stores a value. Two equals signs ask a question. Mixing them up is the most common bug on the team.",
  "`not` flips a switch. We use it constantly for things like `is_private`.",
  "The exam writes Booleans in its own style. Practice reading them before you write them.",
  "Now put it together on your own. This is the practice run before the real ticket."],
 "Nice work finishing your training. Your first ticket is ready: the **Instagram account flags** script. It stores one account's facts and shows which switches are on, using the Booleans you just practiced.")

tr('a17', 'a140', 'Logical Operators', 'Welcome to Streaming Access: your training',
 ["Hi, I'm Grace, and I lead Streaming Access. Before you work on the profile screen, you will finish a short training on **logical operators**: `and`, `or` and `not`.",
  "Whether someone can stream depends on several facts at once: is the plan active, is the profile a kid profile, is the show rated for them. Logical operators join those facts into one decision.",
  GEN + " Then I'll send you the access rules ticket."], "Thanks, Grace",
 ["`and` is strict: every part has to be True. A single False part makes the whole thing False.",
  "`or` is forgiving: one True part is enough.",
  "`not` flips a result, and brackets decide what gets flipped.",
  "Real rules join comparisons: an age, a rating and a plan together.",
  "A range check uses `and`: at least one number and at most another.",
  "Python has an order for these. Learn it so brackets are never a surprise.",
  "The exam loves logic questions. Read them slowly and trace each part.",
  "Your practice run before the real ticket: a gate with several rules."],
 "Training done. Your ticket is the **Disney+ access rules**: the logic that decides who can stream what. It uses every operator you just practiced.")

tr('a18', 'a141', 'Comparison Operators', 'Welcome to Games Engineering: your training',
 ["Hi, I'm Theo, and I lead Games Engineering. Before you work on the guess checker, you will finish a short training on the six **comparison operators**.",
  "Every game we make asks questions about numbers and text: is the guess right, are there tries left, did the streak reach a badge. Each question is a comparison, and one wrong symbol means a wrong answer for millions of players.",
  GEN + " Then I'll send you the guess checker ticket."], "Thanks, Theo",
 ["There are six comparisons. Learn them all, because the checker uses most of them.",
  "The boundary is where the bugs live: `>` and `>=` give different answers at exactly the limit.",
  "Designers write rules in English. Your job is turning them into Python.",
  "A comparison can do math first. Check that it does what you expect.",
  "Even, odd and divisible checks all come from the remainder.",
  "Text can be compared too, and capital letters count.",
  "The exam writes comparisons its own way. Practice reading them.",
  "A practice run you can do on your own before the ticket."],
 "Training done. Your ticket is the **guess checker**: tries, streaks and a check that a capital letter does not match. Everything you practiced will be used.")

tr('a19', 'a142', 'If Statements', 'Welcome to Bike Software: your training',
 ["Hi, I'm Dani, and I work on Bike Software. Before the heart rate ticket, you will finish a short training on the `if` statement.",
  "Until now every program ran every line. The bike screen has to **decide**: show an alert only when the heart rate is too high, and show nothing the rest of the time. That decision is an `if`.",
  GEN + " Then I'll send you the heart rate alerts ticket."], "Thanks, Dani",
 ["An `if` is a question with a block of code that runs only when the answer is True.",
  "The **indent** is how Python knows what belongs to the `if`. Get it wrong and the alert fires at the wrong time.",
  "The question can be a Boolean variable or a joined condition. The bike uses both.",
  "An `if` can change a variable. Later lines see the new value, so order matters.",
  "Several separate ifs are all asked, in order. Any number of them can run.",
  "An `if` inside an `if` only runs when both are True. We use that for the peak interval alert.",
  "Build a small price program in pieces. This is the practice run before the real ticket."],
 "Training done. Your ticket is the **heart rate alerts** for the bike screen. It uses the same pieces you just practiced.")

tr('a20', 'a143', 'If, Elif, and Else', 'Welcome to Rewards: your training',
 ["Hi, I'm Jamal, and I'm a Rewards Engineer. Before you work on the tiers, you will finish a short training on `else` and `elif`.",
  "A member lands in exactly **one** tier, and that is a job for an `if`, `elif` and `else` chain. Some of our promos can happen together though, and those need separate ifs. Knowing the difference is the point of this training.",
  GEN + " Then I'll send you the rewards tiers ticket."], "Thanks, Jamal",
 ["`else` is the fallback: it runs when the `if` did not.",
  "Even or odd is the smallest two-way choice there is.",
  "`elif` adds more choices between the `if` and the `else`. Only one branch runs.",
  "Python checks from the top and stops at the first True, so the order of the checks matters.",
  "A chain picks one result. Separate ifs can all run. Make sure you can tell them apart.",
  "Real chains read an answer from the user. Ask first, then decide.",
  "The exam writes if and else its own way. Practice reading it.",
  "Build a picker on your own. This is the practice run before the real ticket."],
 "Training done. Your ticket is the **rewards tiers and promos**: one chain for the tier, separate ifs for the promos.")

tr('a21', 'a144', 'Key Events', 'Welcome to the Input Team: your training',
 ["Hi, I'm Kai, and I'm an Input Systems Engineer. Before the controller ticket, you will finish a short training on **key events** and handlers.",
  "When a player presses a button, the game does not know what it means. A small piece of code called a **handler** receives the event and decides what happens. Moving, healing and building all start this way.",
  GEN + " Then I'll send you the controller events ticket."], "Thanks, Kai",
 ["An event is the input: it says which key was pressed.",
  "A handler is a procedure with one parameter. The event goes in through that parameter.",
  "The handler decides by looking at the key.",
  "Many keys means a chain. One branch per key, and an `else` for unknown keys.",
  "Key names must match exactly. A capital letter is a different key.",
  "A handler can change the game's variables, but it needs `global` to do it.",
  "The exam writes handlers in its own style. Practice reading them.",
  "Build a small controller on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Fortnite controller events**: a handler for movement, health and build mode.")

tr('a22', 'a145', 'For Loops in Python', 'Welcome to Flight Software: your training',
 ["Hi, I'm Rohan, and I'm a Flight Software Engineer. Before the countdown ticket, you will finish a short training on **for loops**.",
  "A launch checklist repeats the same kind of step many times: check a valve, check an engine, count down. Writing every step by hand would take hundreds of lines. A for loop does it in two.",
  GEN + " Then I'll send you the launch countdown ticket."], "Thanks, Rohan",
 ["A for loop repeats a block. Start with the smallest one.",
  "Sometimes you only need the repeat and not the counter. That is fine.",
  "You choose where the counting starts. The stop number is not included.",
  "A step counts by twos, and a negative step counts down. The countdown needs the second one.",
  "A total starts at zero and grows each trip around the loop.",
  "An if inside a loop checks every trip separately. That is how we count even numbers.",
  "The exam writes loops in its own style. Practice reading them.",
  "Build a times table on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **launch countdown**: engines, valves, totals and the countdown itself.")

tr('a23', 'a146', 'General For Loops', 'Welcome to Checkout: your training',
 ["Hi, I'm Nina, and I work on Checkout. Before the cart ticket, you will finish a short training on looping over **lists** and **text**.",
  "A cart is a list. To total it, check each item or print a receipt, the program has to visit every item once. A for loop can walk through a list or the letters of a text, and that is what this training covers.",
  GEN + " Then I'll send you the cart checker ticket."], "Thanks, Nina",
 ["A for loop can visit every item in a list.",
  "It can also visit every letter in a text.",
  "The loop variable holds the actual value, not a position number. This surprises everyone once.",
  "Total and average are the two most common loops in checkout code.",
  "An if inside the loop filters which items count.",
  "Counting how many times a letter appears is a filter plus a counter.",
  "The exam writes FOR EACH loops its own way. Practice reading them.",
  "Build a grade report on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Amazon cart checker**: totals, averages and filters over a list.")

tr('a26', 'a148', 'While Loops', 'Welcome to PlayStation Direct: your training',
 ["Hi, I'm Sam, and I'm a Direct Commerce Engineer. Before the restock ticket, you will finish a short training on **while loops**.",
  "On restock day nobody knows how many tries it takes someone to get through the queue. A for loop needs a number in advance. A while loop keeps going **as long as** its condition is True.",
  GEN + " Then I'll send you the restock ticket."], "Thanks, Sam",
 ["A while loop repeats while its condition is True. Start by counting.",
  "Counting down works too, and a loop whose condition starts False never runs at all.",
  "Add up numbers the same way you did with for loops, only now you control the counter yourself.",
  "Loop until a goal is reached. You do not know how many trips it will take.",
  "A loop that never ends is the most famous bug in programming. Learn to spot one.",
  "Keep asking until the answer is right. This is how the queue code works.",
  "The exam writes REPEAT UNTIL its own way. Practice reading it.",
  "Build an inventory countdown on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **PS5 restock**: a queue code check, shipments, stock and saving up.")

tr('a27', 'a149', 'Loop and a Half', 'Welcome to Payments Safety: your training',
 ["Hi, I'm Tasha, and I'm a Payments Safety Engineer. Before the loops ticket, you will finish a short training on the **loop and a half**.",
  "Payment screens ask for a PIN, an amount, a refund. The question has to be asked at least once, and again until the answer is good. The trick is `while True` with a `break`, so the question is written only once.",
  GEN + " Then I'll send you the payment loops ticket."], "Thanks, Tasha",
 ["`while True` runs forever, until something inside it says stop.",
  "`break` is the stop. It ends the loop right away.",
  "A stopping number like 0 is called a sentinel. We use one to total up a split bill.",
  "A password prompt is the classic loop and a half.",
  "Asking until the answer is valid keeps bad amounts out.",
  "There are two ways to write the same loop. Learn both.",
  "The exam writes this pattern its own way. Practice reading it.",
  "Build a score tracker on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Venmo payment loops**: a PIN prompt, valid amounts, split bills and refunds.")

tr('a28', 'a150', 'Random Numbers', 'Welcome to Kart Gameplay: your training',
 ["Hi, I'm Hana, and I'm a Gameplay Programmer on Kart Gameplay. Before the item box ticket, you will finish a short training on **random numbers**.",
  "When a racer drives through an item box, nobody knows what they will get. That surprise comes from the `random` library: dice, coin flips and picks from a list.",
  GEN + " Then I'll send you the item box ticket."], "Thanks, Hana",
 ["A die is a random whole number from 1 to 6.",
  "A coin flip is a random number that is 0 or 1.",
  "Both ends count in `randint`. Remember this one.",
  "A loop can roll many dice and add them up.",
  "`choice` picks something at random from a list. Item boxes use it.",
  "Rolling until you win is a while loop with a random number inside it.",
  "The exam writes RANDOM(a, b) its own way. Practice reading it.",
  "Build a snake eyes game on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Mario Kart item box prototype**: dice, coin flips and random picks.")

# the number of notes must equal the walkthrough's number of steps
STEPS = {'a16': 8, 'a17': 8, 'a18': 8, 'a19': 7, 'a20': 8, 'a21': 8, 'a22': 8, 'a23': 8, 'a26': 8, 'a27': 8, 'a28': 8}
for k, v in T.items():
    assert len(v['notes']) == STEPS[k], (k, len(v['notes']), STEPS[k])
    for t in v['notes'] + v['email']['paras'] + [v['outro']]:
        assert '—' not in t and '–' not in t, t   # no dash characters in student text
out = '/* GENERATED by tools/training/gen_u4.py. The company "training" voice for the Unit 4 walkthroughs. Do not edit by hand. */\nwindow.PY_TRAIN_U4 = ' + json.dumps(T, ensure_ascii=False, indent=1) + ';\nwindow.PY_TRAIN = Object.assign(window.PY_TRAIN || Object.create(null), window.PY_TRAIN_U4);\n'
open(os.path.join(ROOT, 'python', 'training-u4.js'), 'w', encoding='utf-8').write(out)
print('slots', len(T), 'notes', sum(len(v['notes']) for v in T.values()))
