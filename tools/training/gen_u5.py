"""Writes python/training-u5.js: the company 'training' voice for the Unit 5 walkthroughs (a29-a34).
Each walkthrough is shown in the SAME company skin as its assignment (a151-a156): an email from the same boss, a short note
from them at each step, and a hand-off at the end that opens the assignment. The walkthrough's own steps, checkboxes and checks are NOT changed
(so scoring is untouched). One note per step: the count must equal the walkthrough's step count (checked below).
usage: python3 tools/training/gen_u5.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = {}
def tr(slot, assign, match, subject, paras, sign, notes, outro):
    T[slot] = dict(assign=assign, match=match, email=dict(subject=subject, paras=paras, sign=sign), notes=notes, outro=outro)
GEN = "Work through the steps below in order. Each task has a checkbox, and the small line under it turns green when your code has what the task needs. When every step is green, click **Submit** at the top."

tr('a29', 'a151', 'Functions and Parameters', 'Welcome to the Consumer App team: training first, then your first ticket',
 ["Hi, and welcome to the Uber Eats Consumer App team! I'm Priyanka. Before I hand you real work, everyone on the team does a short training, and I'll be here for each step.",
  "The app sends the same kinds of messages over and over: a welcome, a greeting, a tip line. We never copy those lines everywhere. We write each one once as a **function**, and call it whenever we need it. This training is about writing and calling functions, and giving them **parameters**.",
  GEN + " Once your training is submitted, I'll send you your first ticket: the **order messages**."], "Thanks, Priyanka",
 ["A function is a named block of code. Writing it does nothing yet. Calling it makes it run.",
  "A parameter is a name in the parentheses. It holds whatever value the caller sends in.",
  "The parameter works like any variable inside the function, so you can do math with it. Our tip line does this.",
  "People mix up parameter and argument all the time. Get them straight now, because the exam asks.",
  "When you call a function the program jumps into it, runs it, and jumps back. Trace the jumps.",
  "An argument can be text, a number, or a whole variable. The function does not care which.",
  "The exam writes functions as PROCEDURE. Practice reading it before you write it.",
  "Now put it together on your own. This is the practice run before the real ticket."],
 "Nice work finishing your training. Your first ticket is ready: the **Uber Eats order messages**. You will write the welcome, greeting, tip, banner and delivery functions, then run an order through them.")

tr('a30', 'a152', 'Multiple Parameters', 'Welcome to Listings Tools: your training',
 ["Hi, I'm Carmen, and I lead Listings Tools at Zillow. Before you touch a real listing, you will finish a short training on functions with **more than one parameter**.",
  "A listing page needs numbers worked out from several facts at once: the lot's length and width, the price and the square feet. One parameter is not enough, so our functions take two or three. The order of the arguments matters a lot.",
  GEN + " Then I'll send you the listing tools ticket."], "Thanks, Carmen",
 ["Two parameters means two arguments, separated by a comma. The first argument goes in the first parameter.",
  "Swap the arguments and the function still runs, but it gives a different answer. We have shipped that bug before.",
  "A triangle's area needs two facts. Build it with two parameters.",
  "Parameters can hold different kinds of values at once, and a swapped call can break the types.",
  "A function with three parameters needs exactly three arguments. Too few or too many is an error.",
  "Variables work as arguments too. The function gets the value the variable holds.",
  "The exam shows procedures with two parameters. Read them carefully, one argument at a time.",
  "Build a report on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Zillow listing tools**: lot area, price per square foot, monthly cost and a listing sentence. Watch the argument order.")

tr('a31', 'a153', 'Return Values', 'Welcome to Checkout Systems: your training',
 ["Hi, I'm Denise, and I run Checkout Systems at Walmart. Before the register ticket, you will finish a short training on **return values**.",
  "A register needs a function to **hand back** an answer, not print it, because the next line might add shipping, tax or a coupon to that answer. `return` is how a function gives its answer back.",
  GEN + " Then I'll send you the checkout totals ticket."], "Thanks, Denise",
 ["`return` hands a value back to the line that called the function. Store it, and you can use it later.",
  "A returned value works like any other value. You can do math with it.",
  "Print and return look similar on screen, but they are not the same. One shows a value, the other hands it back.",
  "You can call a function inside another call. The inner call runs first and hands its answer to the outer one.",
  "A return ends the function right away. Code after it in the same function never runs.",
  "Functions can return text as well as numbers.",
  "The exam writes RETURN in its own style. Practice reading it.",
  "Build a shop total on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Walmart checkout totals**: functions that return item totals, shipping and a name tag.")

tr('a32', 'a154', 'Return Values with Decisions and Loops', 'Welcome to the Learning Engine team: your training',
 ["Hi, I'm Hye-jin, and I work on the Learning Engine at Duolingo. Before the streak ticket, you will finish a short training on functions that **return decisions** and use **loops**.",
  "Streaks, leagues and XP bonuses are all decided by functions. Some return True or False, some pick between values, and some add things up in a loop before they return.",
  GEN + " Then I'll send you the streak rules ticket."], "Thanks, Hye-jin",
 ["A function can return a Boolean. That is how we ask yes or no questions about a learner.",
  "A returned True or False can be the condition of an if. Read it like a question.",
  "A function can return one of two values by using an if and an else, with a return in each.",
  "An early return ends the function as soon as a rule matches, so you do not need an else.",
  "When a function has a loop, the return goes after the loop. Put it inside and it returns after the first trip.",
  "A loop with an if inside lets a function count or add only the items that matter.",
  "The exam writes IF and RETURN together. Practice reading them.",
  "Build a grade checker on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Duolingo streak rules**: weekly streaks, leagues, XP totals and bonus lessons.")

tr('a33', 'a155', 'Libraries and APIs', 'Welcome to Routing: your training',
 ["Hi, I'm Ibrahim, and I work on Routing at Google Maps. Before the distance ticket, you will finish a short training on **libraries** and **APIs**.",
  "We do not write every tool from scratch. A library is code other people already wrote, and the documentation tells us how to call it. If you read the documentation wrong, the answer is wrong.",
  GEN + " Then I'll send you the distance tools ticket."], "Thanks, Ibrahim",
 ["`import` brings a library into your program, and then you reach its tools with a dot.",
  "Python also comes with procedures that need no import, like `abs`, `round` and `len`.",
  "The documentation tells you what a procedure needs and what it gives back. Read it first.",
  "The random library gives your program a surprise. Both ends of `randint` count.",
  "Arguments must match the order in the documentation. Mix them up and the answer changes.",
  "You can write your own procedure that calls a library procedure.",
  "The exam gives you documentation to read. Practice reading it the way it does.",
  "Build a distance finder on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Google Maps distance tools**: your own hypotenuse tool plus library tools and a random detour.")

tr('a34', 'a156', 'Procedures and the Create Task', 'Welcome to the Interface team: your training',
 ["Hi, I'm Olivia, and I lead the Interface team at Netflix. Before the rating rows ticket, you will finish a short training on **procedures** and why we write them.",
  "Every row of titles shows a divider, a welcome message and a star rating. If we copied those lines into every screen, changing a star would mean fixing every screen. A procedure lets us write the code once and change it once.",
  GEN + " Then I'll send you the rating rows ticket."], "Thanks, Olivia",
 ["Repeated code is a warning sign. If you keep copying lines, write a procedure.",
  "A parameter makes one procedure do different jobs.",
  "A loop controlled by a parameter repeats a different number of times each call.",
  "Sequencing, selection and iteration can all live inside one procedure. The Create Task looks for this.",
  "A procedure can call another procedure. Follow the jumps.",
  "Change the procedure once and every call changes. That is the whole point.",
  "The exam writes procedures its own way. Practice reading them.",
  "Build a fortune teller on your own, the practice run before the ticket."],
 "Training done. Your ticket is the **Netflix rating rows**: a divider, welcome, stars and rating procedures used across the page.")

# the number of notes must equal the walkthrough's number of steps
STEPS = {'a29': 8, 'a30': 8, 'a31': 8, 'a32': 8, 'a33': 8, 'a34': 8}
for k, v in T.items():
    assert len(v['notes']) == STEPS[k], (k, len(v['notes']), STEPS[k])
    for t in v['notes'] + v['email']['paras'] + [v['outro']]:
        assert '—' not in t and '–' not in t, t   # no dash characters in student text
out = '/* GENERATED by tools/training/gen_u4.py. The company "training" voice for the Unit 5 walkthroughs. Do not edit by hand. */\nwindow.PY_TRAIN_U5 = ' + json.dumps(T, ensure_ascii=False, indent=1) + ';\nwindow.PY_TRAIN = Object.assign(window.PY_TRAIN || Object.create(null), window.PY_TRAIN_U5);\n'
open(os.path.join(ROOT, 'python', 'training-u5.js'), 'w', encoding='utf-8').write(out)
print('slots', len(T), 'notes', sum(len(v['notes']) for v in T.values()))
