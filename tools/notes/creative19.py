"""Unit 19: Creative Development (AP Big Idea 1): collaboration, program purpose and function, the development process, and finding and fixing errors."""
from lib import *

U = Unit("unit-19", "Unit 19: Creative Development", 19, [
    ("collaboration-purpose.html", "19.1 Collaboration and Purpose"),
    ("development-process.html", "19.2 Development Process"),
    ("errors-debugging.html", "19.3 Errors and Debugging"),
], {
    "collaboration-purpose.html": "Collaboration, Purpose, and Function (19.1)",
    "development-process.html": "The Development Process (19.2)",
    "errors-debugging.html": "Errors and Debugging (19.3)",
}, {"collaboration-purpose.html": "a211", "development-process.html": "a212", "errors-debugging.html": "a213"})


# ==========================================================================================  19.1 COLLABORATION AND PURPOSE
def collaboration_purpose():
    spec = widget("wgspec", "Try it: write the spec for a program",
                  "Pick a program idea. See its purpose, what goes in, what comes out, and what makes it run.",
                  '<div class="row"><select></select></div><div class="out"></div>',
                  r"""
var D={"Tip calculator":["Help diners work out a fair tip quickly","the bill amount, the tip percent (typed by the user)","the tip amount and the total","the user presses the Calculate button (an event)"],
"Quiz app":["Help students practice for a test","the student's answer to each question (typed or tapped)","right or wrong, and a final score","each tap on an answer (an event), then the next question"],
"Step tracker":["Help someone meet a daily activity goal","a step count from the phone's sensor, and a goal the user sets","a progress bar and a message when the goal is reached","the sensor reports new steps (an event); a timer resets each day"],
"Bus arrival board":["Help riders decide when to leave home","live GPS positions from the buses and the rider's chosen stop","minutes until the next bus","a new GPS message arrives (an event)"]};
var sel=root.querySelector("select"),out=root.querySelector(".out");sel.innerHTML=Object.keys(D).map(function(k){return"<option>"+k+"</option>"}).join("");
function upd(){var d=D[sel.value];out.innerHTML='<table style="text-align:left"><tr><th>Purpose</th><td style="text-align:left">'+d[0]+'</td></tr><tr><th>Input</th><td style="text-align:left">'+d[1]+'</td></tr><tr><th>Output</th><td style="text-align:left">'+d[2]+'</td></tr><tr><th>What starts it</th><td style="text-align:left">'+d[3]+'</td></tr></table><div class="note"><b>Purpose</b> is <i>why</i> the program exists. <b>Function</b> is <i>what</i> it does with its input to make its output.</div>'}
sel.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Why Collaborate?",
             "<b>Collaboration</b> means working with other people toward a shared goal. Most real software is built by teams, and even a single student's project improves when others test it and give feedback.",
             cards([("1", "Different viewpoints", "People with different backgrounds notice different problems and think of different solutions."),
                    ("2", "Fewer blind spots", "A team that represents many kinds of users is less likely to build something that works for only one kind."),
                    ("3", "Better quality", "Someone else reading your code catches mistakes you can no longer see."),
                    ("4", "Shared workload", "Big projects can be split into parts that people build at the same time.")]),
             hint("This connects to <b>bias</b>: a diverse team is more likely to notice when a program fails for a group of users.")),
        part(1, "Ways to Collaborate",
             "Collaboration works best with a clear structure.",
             tbl(["Practice", "How it works", "Why it helps"], [
                 ["<b>Pair programming</b>", "Two people share one computer. The <b>driver</b> types and the <b>navigator</b> reads, thinks ahead, and spots mistakes. They <b>swap roles</b> often.", "two sets of eyes, fewer errors, both people learn"],
                 ["<b>Code review</b>", "a teammate reads your code before it is added to the project", "catches bugs and keeps the style consistent"],
                 ["<b>User testing</b>", "real users try the program and say what confuses them", "finds problems the developers cannot see"],
                 ["<b>Shared documents</b>", "a requirements list, comments, and a project plan everyone can read", "everyone agrees on what is being built"],
             ]),
             warn("<b>On the Create Task</b> you may build the <b>program code</b> with a partner, but the <b>video, reference sheet, and written responses</b> must be your own work.")),
        part(2, "Purpose and Function",
             "Every program has a <b>purpose</b> and a <b>function</b>. They sound alike, but the exam treats them as different ideas.",
             tbl(["", "Purpose", "Function"], [
                 ["<b>It answers</b>", "<b>Why</b> does this program exist?", "<b>What</b> does this program do?"],
                 ["<b>It describes</b>", "the problem it solves or the interest it serves", "how the program behaves: the input it takes and the output it gives"],
                 ["<b>Example</b>", "help students prepare for a test", "shows a question, checks the answer, and reports a score"],
             ]),
             spec,
             "<p>A program can have <b>many inputs and outputs</b>. Input can be text, a click, a key press, a sound, a sensor reading, or a file. Output can be text, a picture, a sound, or a movement.</p>"),
        part(3, "Events",
             "Some programs run in a fixed order from start to finish. Many apps are <b>event-driven</b>: parts of the program run <b>when something happens</b>, like a tap, a key press, or a message arriving.",
             tbl(["", "Sequential program", "Event-driven program"], [
                 ["<b>What runs next?</b>", "the next line, in order", "whichever code handles the event that just happened"],
                 ["<b>Example</b>", "a program that asks three questions and prints a result", "a phone game that reacts to every tap"],
                 ["<b>Order of events</b>", "decided by the program", "decided by the <b>user</b> (or the world)"],
             ]),
             "<p>The Karel and key-event lessons earlier in the course were event-driven: code ran <b>when a key was pressed</b>.</p>"),
        part(4, "Documenting Your Program",
             "<b>Documentation</b> is writing down what a program is for and how it works. In code it is mostly <b>comments</b>.",
             chk(["<b>Purpose</b>: a comment at the top saying why the program exists.", "<b>Procedures</b>: what each one takes in (<b>parameters</b>) and gives back (<b>return</b>).", "<b>Tricky parts</b>: why you wrote a line a certain way.", "<b>Credits</b>: say where borrowed code came from."]),
             "<p>Good comments help <b>other people</b> and <b>future you</b> understand the program, and they make collaboration possible.</p>",
             quiz("qz19a", [
                 ("Which best describes the <b>purpose</b> of a program?", ["The exact lines of code it uses", "The problem it solves or the need it meets", "How fast it runs", "The programming language it is written in"], 1, "Purpose is <b>why</b> the program exists. What it does with input and output is its function."),
                 ("A team of developers with very different backgrounds builds an app. Which is the most likely benefit?", ["The app will have no errors", "They are more likely to notice problems that affect different kinds of users", "The app will be written faster in every case", "They will not need to test it"], 1, "Diverse perspectives reveal blind spots."),
                 ("In pair programming, what does the <b>navigator</b> do?", ["Types all of the code", "Reviews the code as it is written and thinks ahead while the driver types", "Writes the video", "Runs the program only at the end"], 1, "The navigator reads, thinks ahead, and spots mistakes. The two partners swap roles."),
                 ("A game does nothing until the player presses a key, and then it moves the character. This is an example of", ["a sequential program with no input", "event-driven programming", "lossy compression", "a heuristic"], 1, "The code runs <b>in response to an event</b>."),
                 ("Which is an <b>input</b> to a weather app?", ["The temperature shown on the screen", "The location the user types in", "The app's purpose", "The comment at the top of the code"], 1, "Input is data that goes <b>into</b> the program. The temperature shown is an output."),
             ])),
        exam([
            "<b>Collaboration</b> brings diverse perspectives and finds mistakes, producing better programs. Know <b>pair programming</b> (driver and navigator).",
            "<b>Purpose</b> is the problem a program solves. <b>Function</b> is what it does with input to make output.",
            "Programs can have <b>many inputs and outputs</b>, and many are <b>event-driven</b>.",
            "<b>Documentation</b> (comments) explains purpose and function so others can use and improve the code.",
        ]),
    ]
    return U.mk("collaboration-purpose.html", "collaboration-purpose", "Collaboration, Purpose, and Function", "WORKING TOGETHER, KNOWING WHY",
                "Programs start as someone's idea, and most are built by teams. Learn how <b>collaboration</b> makes programs better, the difference between a program's <b>purpose</b> and its <b>function</b>, and why <b>documentation</b> matters.",
                parts, "Know why you are building it, and build it with others.", "Next: how a program actually gets built, step by step.")


# ==========================================================================================  19.2 DEVELOPMENT PROCESS
def development_process():
    def frame(title, lines, color="teal"):
        body = "".join(stext(360, 62 + 24 * i, l, "white", 15) for i, l in enumerate(lines))
        return svg(720, 170, sbox(20, 10, 680, 150, "", "", color) + stext(360, 38, title, color, 16, weight=700) + body, "development step")

    inc = stepper("stpinc", "Click through: building a program one small piece at a time",
                  [(frame("Increment 1: add up the scores", ["def total(scores):", "    ...adds the numbers...", "Test: total([2, 4, 6]) gives 12   PASS"], "teal"), "Build <b>one small piece</b> and <b>test it</b> right away. If it fails, you know exactly where the problem is."),
                   (frame("Increment 2: divide by how many", ["def average(scores):", "    return total(scores) / len(scores)", "Test: average([2, 4, 6]) gives 4.0   PASS"], "blue"), "Add the <b>next small piece</b> on top of what already works. Test again."),
                   (frame("Increment 3: test an empty list", ["Test: average([])", "ERROR: division by zero   FAIL", "Fix: return 0 when the list is empty"], "red"), "Testing found a <b>gap</b>. Fix it now, while the program is still small."),
                   (frame("Iteration: ask users, then improve", ["A tester says: \"I want one decimal place.\"", "Revise: round(total / len, 1)", "Test everything again   PASS"], "yellow"), "<b>Iterating</b> means going back around: get feedback, change the program, and test again.")])

    parts = [
        part(0, "A Development Process",
             "Writing a program well is not one big burst of typing. Programmers move through a <b>process</b>, and they go around it more than once.",
             cards([("1", "Investigate and reflect", "Who will use it? What problem does it solve? What already exists? What are the requirements?"),
                    ("2", "Design", "Plan before you type: a sketch, a <b>flowchart</b>, a <b>storyboard</b>, or <b>pseudocode</b>."),
                    ("3", "Prototype", "Build a small, working version quickly, even if it is not pretty."),
                    ("4", "Test", "Try it with normal, edge, and unexpected inputs. Ask real users.")]),
             hint("These steps are not a straight line. Testing shows what to <b>investigate</b> or <b>design</b> again.")),
        part(1, "Incremental and Iterative",
             "Two words that the exam uses a lot.",
             tbl(["", "Incremental development", "Iterative development"], [
                 ["<b>Idea</b>", "build the program in <b>small pieces</b>, testing each piece before adding the next", "<b>repeat</b> the cycle of design, build, test, and improve, using what you learned each time"],
                 ["<b>Why</b>", "a bug is easy to find because it must be in the newest piece", "the program keeps getting closer to what users need"],
                 ["<b>Example</b>", "get the loop working, then add the if, then add the output", "release a first version, read user feedback, change the buttons, release again"],
             ]),
             inc),
        part(2, "Requirements and Design Tools",
             "Before building, decide <b>what the program must do</b> (its <b>requirements</b>) and sketch how it will be organized.",
             tbl(["Tool", "What it shows", "Good for"], [
                 ["<b>Requirements list</b>", "the things the program must do, in plain words", "knowing when you are finished"],
                 ["<b>Flowchart</b>", "the steps and decisions as boxes and arrows", "seeing the logic of selection and loops"],
                 ["<b>Storyboard</b>", "pictures of each screen in order", "apps and games"],
                 ["<b>Pseudocode</b>", "the algorithm in plain words that look a little like code", "planning before choosing a language"],
             ]),
             ex("<b>Example requirements for a tip calculator:</b> (1) the user can type a bill amount. (2) the user can choose a tip percent. (3) the program shows the tip and the total. (4) it must not accept a negative bill.")),
        part(3, "Testing the Right Things",
             "A program that works once may fail on the next input.",
             tbl(["Kind of test", "Example for a function that averages a list"], [
                 ["<b>Normal</b>", "<code>[2, 4, 6]</code>"],
                 ["<b>Boundary / edge</b>", "<code>[5]</code> (one item), <code>[]</code> (empty), <code>[0, 0]</code>"],
                 ["<b>Unexpected</b>", "negative numbers, a very large list, numbers with decimals"],
                 ["<b>User test</b>", "a real person tries it and says what they expected"],
             ]),
             "<p>Write the <b>expected answer first</b>, then run the test, so you are not tempted to just accept whatever the program gives.</p>",
             quiz("qz19b", [
                 ("A student builds a program by writing the input part, testing it, then adding the calculation, testing again, and so on. This is best described as", ["Iterative development", "Incremental development", "Parallel computing", "Lossless compression"], 1, "Building and testing small pieces one at a time is <b>incremental</b> development."),
                 ("After releasing an app, developers read user reviews, change the design, and release a new version. This repeated cycle is called", ["Incremental development", "Iterative development", "Debugging a syntax error", "Encryption"], 1, "Going around the cycle of feedback, change, and test again is <b>iterative</b>."),
                 ("Which is part of the <b>design</b> stage?", ["Releasing the program to the public", "Sketching a flowchart of the program's decisions", "Fixing a typo", "Running the finished program"], 1, "A flowchart, storyboard, or pseudocode is a design tool."),
                 ("A function that finds the average of a list works for <code>[2, 4, 6]</code>. Which test is the most useful to add next?", ["[2, 4, 6] again", "An empty list", "A list with the same numbers in a different order", "A list of three small numbers"], 1, "An empty list is an <b>edge case</b> that may cause an error. It tests something new."),
                 ("Why is it helpful to test after adding each small piece of a program?", ["It makes the program run faster", "If something breaks, the problem is probably in the newest piece", "It removes the need for design", "It makes comments unnecessary"], 1, "Small steps make bugs <b>easy to locate</b>."),
             ])),
        exam([
            "The process includes <b>investigating and reflecting, designing, prototyping, and testing</b>. It is repeated.",
            "<b>Incremental</b> = build and test in small pieces. <b>Iterative</b> = repeat the cycle using feedback.",
            "<b>Requirements</b> say what a program must do. <b>Flowcharts, storyboards, and pseudocode</b> are design tools.",
            "Test with <b>normal, edge, and unexpected</b> inputs, and get <b>user feedback</b>.",
        ]),
    ]
    return U.mk("development-process.html", "development-process", "The Development Process", "PLAN, BUILD, TEST, REPEAT",
                "Good programs are rarely written in one go. Learn the <b>stages</b> of development, the difference between <b>incremental</b> and <b>iterative</b>, and how to test the right things.",
                parts, "Small pieces, tested often, improved with feedback.", "Next: when a test fails, what kind of error is it?")


# ==========================================================================================  19.3 ERRORS AND DEBUGGING
def errors_debugging():
    kinds = widget("wgerr", "Try it: what kind of error is this?",
                   "Each program has one problem. Pick the kind of error.",
                   '<div class="prog"></div><div class="row opts"></div><div class="out"></div><div class="row"><button class="nxt" style="display:none">Next program</button></div>',
                   r"""
var Q=[
["print(\"Total:\" total)","syntax","Python cannot even start: a comma or + is missing, so the line breaks the rules of the language."],
["def average(a, b):\n    return a + b / 2\nprint(average(4, 8))   # expected 6.0, got 8.0","logic","It runs without crashing but gives the wrong answer. Division happens before addition, so it needs parentheses."],
["items = [1, 2, 3]\nprint(items[5])","run-time","The code is written correctly, but when it runs it asks for an item that does not exist, and the program stops."],
["byte = 255\nbyte = byte + 1   # stored in 8 bits","overflow","255 is the biggest number 8 bits can hold, so adding 1 does not fit."],
["total = 0\nfor n in [1, 2, 3]:\n    total = total + n\nprint(total / 0)","run-time","It follows the rules of the language, but dividing by zero is impossible, so it crashes while running."],
["if age >= 18\n    print(\"adult\")","syntax","The first line is missing a colon. The language rules are broken."],
["# average of a list\ntotal = 0\nfor n in nums:\n    total = total + n\nprint(total / len(nums) + 1)","logic","Nothing crashes, but the + 1 makes every answer wrong. Only testing with known answers finds this kind of error."]];
var i=0,score=0,prog=root.querySelector(".prog"),opts=root.querySelector(".opts"),out=root.querySelector(".out"),nxt=root.querySelector(".nxt"),names=["syntax","logic","run-time","overflow"];
function show(){if(i>=Q.length){prog.innerHTML="";opts.innerHTML="";nxt.style.display="none";out.innerHTML="<b>Finished.</b> You got <b>"+score+" of "+Q.length+"</b>. Reload the page to try again.";return}
 prog.innerHTML='<pre class="mono" style="background:#05070B;border:1px solid #232B38;border-radius:6px;padding:10px 14px;margin:0 0 8px;white-space:pre-wrap;font-size:14px">'+Q[i][0].replace(/&/g,"&amp;").replace(/</g,"&lt;")+'</pre>';
 opts.innerHTML=names.map(function(n){return'<button data-n="'+n+'">'+n+' error</button>'}).join("");out.innerHTML="";nxt.style.display="none"}
opts.addEventListener("click",function(e){var n=e.target.dataset&&e.target.dataset.n;if(!n||opts.dataset.lock==i)return;opts.dataset.lock=i;var ok=n===Q[i][1];if(ok)score++;
 opts.querySelectorAll("button").forEach(function(b){if(b.dataset.n===Q[i][1])b.style.cssText="border-color:#34D399;background:rgba(52,211,153,.16)";else if(b===e.target)b.style.cssText="border-color:#F87171;background:rgba(248,113,113,.13)"});
 out.innerHTML=(ok?'<b style="color:#34D399">Right.</b> ':'<b style="color:#F87171">Not quite.</b> It is a <b>'+Q[i][1]+'</b> error. ')+Q[i][2]+'<div class="note">Score: '+score+' of '+(i+1)+'</div>';nxt.style.display="inline-block"});
nxt.onclick=function(){i++;show()};show();
""")
    trace = widget("wgtrace", "Try it: trace a loop by hand, one line at a time",
                   "Tracing means writing down every variable after every line. Click <b>Next line</b> and fill the table in your head before the answer appears.",
                   '<pre class="mono code-t" style="background:#05070B;border:1px solid #232B38;border-radius:6px;padding:10px 14px;margin:0 0 8px;font-size:14px;line-height:1.7"></pre><div class="row"><button class="n">Next line</button> <button class="r">Start over</button></div><div class="out"></div>',
                   r"""
var code=["total = 0","for i in range(1, 4):","    total = total + i","print(total)"];
var frames=[{l:0,v:"total = 0"},{l:1,v:"total = 0, i = 1"},{l:2,v:"total = 1, i = 1"},{l:1,v:"total = 1, i = 2"},{l:2,v:"total = 3, i = 2"},{l:1,v:"total = 3, i = 3"},{l:2,v:"total = 6, i = 3"},{l:3,v:"total = 6   (prints 6)"}];
var pre=root.querySelector(".code-t"),out=root.querySelector(".out"),k=-1;
function draw(){pre.innerHTML=code.map(function(c,i){return'<span style="'+(k>=0&&frames[k].l===i?"background:rgba(163,230,53,.22);display:block":"display:block")+'">'+c.replace(/ /g,"&nbsp;")+'</span>'}).join("");
 out.innerHTML=k<0?"Press <b>Next line</b> to begin.":'<table><tr><th>Step</th><th>Variables after this line</th></tr>'+frames.slice(0,k+1).map(function(f,i){return'<tr><td>'+(i+1)+'</td><td style="text-align:left">'+f.v+'</td></tr>'}).join("")+'</table>'+(k===frames.length-1?'<div class="note">The loop ran 3 times, adding 1, 2, then 3, so the total is 6.</div>':'')}
root.querySelector(".n").onclick=function(){if(k<frames.length-1)k++;draw()};root.querySelector(".r").onclick=function(){k=-1;draw()};draw();
""")
    parts = [
        part(0, "Four Kinds of Errors",
             "Every program has mistakes sometimes. The exam names <b>four kinds</b>. Learn what each one looks like.",
             tbl(["Error", "What went wrong", "What you see", "Example"], [
                 ["<b>Syntax error</b>", "the code breaks the <b>rules of the language</b>", "the program <b>will not run</b>; an error message points to the line", "a missing colon or bracket, <code>print(\"hi\"</code>"],
                 ["<b>Logic error</b>", "the code runs, but the <b>algorithm is wrong</b>", "the program runs <b>without crashing but gives a wrong answer</b>", "using <code>+</code> where you meant <code>*</code>; an off-by-one"],
                 ["<b>Run-time error</b>", "something goes wrong <b>while the program runs</b>", "the program <b>stops</b> partway with an error", "dividing by zero, asking for <code>items[10]</code> of a 3-item list"],
                 ["<b>Overflow error</b>", "a number is <b>too big for the bits</b> set aside", "the value wraps around or breaks", "adding 1 to 255 in 8 bits"],
             ]),
             kinds,
             warn("<b>Logic errors are the sneakiest.</b> The computer gives no error message. The program looks like it works. You only find the mistake by checking the answer against what it <i>should</i> be.")),
        part(1, "Finding the Bug",
             "Finding a bug is detective work. These are the tools the exam names.",
             tbl(["Technique", "How it works", "Finds"], [
                 ["<b>Test cases</b>", "run the program with inputs whose right answers you already know", "logic errors, edge-case failures"],
                 ["<b>Hand tracing</b>", "step through the code on paper, writing every variable after every line", "logic errors"],
                 ["<b>Extra output</b>", "add <code>print</code> lines to show variable values as the program runs", "where the values first go wrong"],
                 ["<b>Visualizations / debugger</b>", "tools that pause the program and show its state", "run-time and logic errors"],
                 ["<b>A second person</b>", "explain your code out loud to a partner (or a rubber duck)", "mistakes you keep reading past"],
                 ["<b>Read the error message</b>", "it names the kind of error and the line", "syntax and run-time errors"],
             ]),
             trace),
        part(2, "A Debugging Routine",
             "Do not change code at random. Follow a routine.",
             "<ol class=\"chk\"><li><b>Reproduce</b> the problem. Find an input that fails every time.</li><li><b>Read</b> the error message, if there is one.</li><li><b>Locate</b> it: print values, or trace by hand, until you find the first place the value is wrong.</li><li><b>Fix one thing</b>, then <b>test again</b> with the failing input <i>and</i> the inputs that used to work.</li><li><b>Keep a test</b> that would have caught it, so it cannot come back.</li></ol>",
             quiz("qz19c", [
                 ("A program runs to the end without any error message, but every answer is 1 too large. This is most likely a", ["syntax error", "logic error", "run-time error", "overflow error"], 1, "No crash, wrong result: a <b>logic error</b>."),
                 ("A program will not start, and the message points to a line missing a closing parenthesis. This is a", ["syntax error", "logic error", "run-time error", "overflow error"], 0, "The code breaks the rules of the language, so it never runs."),
                 ("A program works for most inputs, but when the user types 0 it stops because it divides by that number. This is a", ["syntax error", "logic error", "run-time error", "overflow error"], 2, "The error happens <b>while the program is running</b>, for one particular input."),
                 ("A student stores a score in 8 bits and adds 10 to 250. The stored result is 4. This is a(n)", ["syntax error", "logic error", "overflow error", "compile-time error"], 2, "The number was too large for the bits, so it wrapped around."),
                 ("Which is the <b>best</b> way to find a logic error?", ["Reading the error message", "Running the program with test inputs whose answers you know, and tracing", "Deleting lines until the program stops", "Rewriting the program in a new language"], 1, "A logic error produces no message, so compare results with known answers and trace."),
                 ("A programmer adds <code>print</code> statements to show the value of a variable after each loop pass. This technique is used to", ["make the program run faster", "see where in the program a value first becomes wrong", "avoid syntax errors", "reduce overflow"], 1, "Extra output <b>reveals</b> what the program is really doing."),
             ])),
        exam([
            "Know the four errors: <b>syntax</b> (breaks language rules, will not run), <b>logic</b> (runs, wrong result), <b>run-time</b> (crashes while running), <b>overflow</b> (number too big for its bits).",
            "Debug with <b>test cases, hand tracing, extra output, debuggers, and other people</b>.",
            "<b>Test the edges</b>: empty input, one item, zero, negative, and the biggest and smallest allowed values.",
            "A logic error gives <b>no message</b>, so you must compare with the answer you expected.",
        ]),
    ]
    return U.mk("errors-debugging.html", "errors-debugging", "Errors and Debugging", "WHEN THE PROGRAM IS WRONG",
                "Programs fail in different ways, and each way points to a different fix. Learn the <b>four kinds of errors</b> the exam names and the techniques that find them.",
                parts, "Name the error, then find it.", "That is the end of Creative Development. Use the walkthroughs to practice each idea in Python.")


PAGES = {"collaboration-purpose": collaboration_purpose, "development-process": development_process, "errors-debugging": errors_debugging}
INDEXES = {"unit-19": lambda: U.index('<p>Big Idea 1 of the AP exam is about <b>how programs get made</b>: working with others, knowing a program\'s purpose, building and testing step by step, and finding errors. These pages cover it, with walkthroughs that practice each idea in Python.</p>'
                                       '<p style="font-size:14px;opacity:.8">Read the notes, try the activities, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>.</p>')}
