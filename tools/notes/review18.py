"""Unit 18: AP Exam Review. Exam strategies, then one review page for each of the five Big Ideas with practice questions in the exam's style
(single-select, select-two, and pseudocode tracing). Every answer here was worked out by hand."""
from lib import *

U = Unit("unit-18", "Unit 18: AP Exam Review", 18, [
    ("exam-strategies.html", "18.1 Strategies"),
    ("review-big-idea-1.html", "18.2 Big Idea 1"),
    ("review-big-idea-2.html", "18.3 Big Idea 2"),
    ("review-big-idea-3.html", "18.4 Big Idea 3"),
    ("review-big-idea-4.html", "18.5 Big Idea 4"),
    ("review-big-idea-5.html", "18.6 Big Idea 5"),
], {
    "exam-strategies.html": "Exam Format and Strategies (18.1)",
    "review-big-idea-1.html": "Review: Big Idea 1, Creative Development (18.2)",
    "review-big-idea-2.html": "Review: Big Idea 2, Data (18.3)",
    "review-big-idea-3.html": "Review: Big Idea 3, Algorithms and Programming (18.4)",
    "review-big-idea-4.html": "Review: Big Idea 4, Computer Systems and Networks (18.5)",
    "review-big-idea-5.html": "Review: Big Idea 5, Impact of Computing (18.6)",
})


def qc(t):
    return '<div class="qc">%s</div>' % esc(t)


def terms(rows):
    return tbl(["Term", "Meaning"], rows)


# ==========================================================================================  18.1 STRATEGIES
def exam_strategies():
    pace = widget("wgpace", "Try it: am I on pace?",
                  "Section I has <b>70 questions in 120 minutes</b>. That is about 1.7 minutes per question, and it is smart to keep about 10 minutes at the end to go back.",
                  '<div class="row"><label>Questions done <input type="number" class="d" value="20" min="0" max="70" style="width:7ch"></label> <label>Minutes used <input type="number" class="m" value="30" min="0" max="120" style="width:7ch"></label></div><div class="out"></div>',
                  r"""
var d=root.querySelector(".d"),m=root.querySelector(".m"),out=root.querySelector(".out");
function upd(){var done=Number(d.value)||0,min=Number(m.value)||0,target=110/70,should=min/target,diff=done-should;
 out.innerHTML='Target pace: about <b>'+target.toFixed(1)+' minutes</b> per question (leaving 10 minutes at the end).<br>By minute '+min+' you should have done about <b>'+Math.round(should)+'</b> questions. You have done <b>'+done+'</b>.<div class="note" style="color:'+(diff>=-2?"#A3E635":"#FBBF24")+'">'+(diff>=-2?"On pace. Keep going.":"A little behind. Skip any question that is taking more than 2 minutes, mark it, and come back.")+'</div>'}
root.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "The Exam at a Glance",
             "The AP Computer Science Principles score combines <b>two parts</b>. Check the current College Board course description for exact numbers, since they can change.",
             tbl(["Part", "What it is", "About how much"], [
                 ["<b>Section I: multiple choice</b>", "70 questions in 120 minutes. Most are single-answer. Some ask you to <b>select two</b> answers. Some are about a short reading on a computing innovation.", "70% of the score"],
                 ["<b>Create Performance Task</b>", "the program, video, and reference sheet you make in class, plus the written responses", "30% of the score"],
             ]),
             tbl(["Big Idea", "Name", "Share of the multiple choice (about)"], [
                 ["1", "Creative Development", "10 to 13%"],
                 ["2", "Data", "17 to 22%"],
                 ["3", "Algorithms and Programming", "30 to 35%"],
                 ["4", "Computer Systems and Networks", "11 to 15%"],
                 ["5", "Impact of Computing", "21 to 26%"],
             ]),
             hint("Big Idea 3 is the biggest slice. Big Idea 5 is bigger than most students expect. <b>Do not skip the non-code units.</b>")),
        part(1, "The Pseudocode Reference Sheet",
             "You do not write code on the exam, and you do not need to remember Python syntax. Programs on the exam use <b>pseudocode</b>, and a reference sheet is provided. Learn how it works now.",
             tbl(["Idea", "Pseudocode", "Watch out for"], [
                 ["assign", "<code>a &larr; expression</code>", "the arrow means <b>store</b>, not \"equals\""],
                 ["display", "<code>DISPLAY(expression)</code>", "(no extra text)"],
                 ["remainder", "<code>a MOD b</code>", "<code>17 MOD 5</code> is 2"],
                 ["compare", "<code>a = b</code>, <code>a &ne; b</code>, <code>a &ge; b</code>", "a single <code>=</code> <b>compares</b> here"],
                 ["repeat", "<code>REPEAT n TIMES</code>, <code>REPEAT UNTIL (cond)</code>", "UNTIL keeps going while the condition is <b>false</b>"],
                 ["list", "<code>list[1]</code>, <code>LENGTH(list)</code>, <code>APPEND</code>, <code>INSERT</code>, <code>REMOVE</code>", "indexes start at <b>1</b>"],
                 ["random", "<code>RANDOM(a, b)</code>", "includes <b>both</b> a and b"],
                 ["procedure", "<code>PROCEDURE name(p) { ... RETURN(x) }</code>", "RETURN ends the procedure right away"],
             ]),
             warn("<b>The two most common traps:</b> list indexes start at <b>1</b> (not 0), and <code>REPEAT UNTIL</code> stops when the condition becomes <b>true</b>.")),
        part(2, "How to Work Through Questions",
             "Use the same moves every time.",
             cards([("1", "Read the question first", "Know what is being asked before you read the code. \"Which is TRUE\" and \"which is NOT\" need opposite thinking."),
                    ("2", "Trace on paper", "For any code question, write each variable in a small table and update it line by line."),
                    ("3", "Eliminate", "Cross out answers that are clearly wrong. Words like <b>always</b> and <b>never</b> are often wrong."),
                    ("4", "Select-two questions", "Decide each of the four answers true or false on its own. Exactly two will be true."),
                    ("5", "Do not stay stuck", "Mark it, move on, and come back. Every question is worth the same."),
                    ("6", "Use the units", "Bits and bytes, Mbps and MB: check the units before you calculate.")]),
             pace),
        part(3, "Practice: Tracing Pseudocode",
             "Work each one on paper first. Then check.",
             quiz("qz18a", [
                 ("What is displayed?" + qc("x ← 5\ny ← 3\nx ← x + y\ny ← x - y\nDISPLAY(x * y)"), ["15", "24", "40", "64"], 2, "x becomes 8. Then y becomes 8 - 3 = 5. x * y = 8 * 5 = <b>40</b>."),
                 ("What is displayed?" + qc("count ← 0\nREPEAT 4 TIMES\n{\n  count ← count + 3\n}\nDISPLAY(count MOD 5)"), ["0", "2", "3", "12"], 1, "count ends at 12. 12 MOD 5 is the remainder of 12 &divide; 5, which is <b>2</b>."),
                 ("What is displayed?" + qc("nums ← [10, 20, 30, 40]\nDISPLAY(nums[2] + nums[4])"), ["30", "50", "60", "70"], 2, "Indexes start at 1, so nums[2] is 20 and nums[4] is 40. 20 + 40 = <b>60</b>."),
                 ("What is displayed?" + qc("n ← 1\nREPEAT UNTIL (n > 20)\n{\n  n ← n * 3\n}\nDISPLAY(n)"), ["9", "20", "27", "81"], 2, "n goes 1, 3, 9, 27. After 27 the condition n &gt; 20 is true, so it stops: <b>27</b>."),
                 ("A list is <code>[3, 8, 6, 2, 9]</code>. Which <b>two</b> code segments set <code>count</code> to 3, the number of items greater than 5? (<code>count</code> starts at 0.)" + qc("A:  FOR EACH item IN list { IF (item > 5) { count ← count + 1 } }\nB:  FOR EACH item IN list { IF (item < 5) { count ← count + 1 } }\nC:  FOR EACH item IN list { IF (item > 5) { count ← count + item } }\nD:  FOR EACH item IN list { IF (item ≥ 6) { count ← count + 1 } }"), ["A", "B", "C", "D"], [0, 3], "A counts 8, 6, 9 = 3. D also counts 8, 6, 9 = 3. B counts 3 and 2 = 2. C adds up the values (23)."),
             ])),
        exam([
            "Know the <b>structure</b>: 70 multiple-choice questions plus the Create Task.",
            "Learn the <b>pseudocode</b>: indexes start at 1, <code>MOD</code>, <code>RANDOM(a, b)</code> includes both ends, <code>REPEAT UNTIL</code> stops when true.",
            "<b>Trace</b> every code question. Eliminate. Move on when stuck.",
            "For <b>select-two</b> questions, judge each choice on its own.",
        ]),
    ]
    return U.mk("exam-strategies.html", "exam-strategies", "Exam Format and Strategies", "HOW THE EXAM WORKS, AND HOW TO WORK IT",
                "Know what is on the exam, how it is scored, and how to attack each kind of question. Then practice reading and tracing the pseudocode the exam uses.",
                parts, "Trace it, eliminate, move on.", "Next: a review of each Big Idea with practice questions.")


# ==========================================================================================  18.2 BIG IDEA 1
def review1():
    parts = [
        part(0, "The Summary",
             "<b>Big Idea 1: Creative Development</b> is about how programs get made. See the notes in Unit 19 (and the Create Task units) for the full story.",
             terms([
                 ["<b>Collaboration</b>", "working with others; diverse perspectives find more problems and make better programs"],
                 ["<b>Pair programming</b>", "a <b>driver</b> types, a <b>navigator</b> reviews; they swap roles"],
                 ["<b>Purpose</b> vs <b>function</b>", "purpose = the problem it solves; function = what it does with input to make output"],
                 ["<b>Event-driven</b>", "code runs when something happens (a click, a key press)"],
                 ["<b>Incremental</b>", "build and test in small pieces"],
                 ["<b>Iterative</b>", "repeat the design, build, test, improve cycle with feedback"],
                 ["<b>Syntax error</b>", "breaks language rules; the program will not run"],
                 ["<b>Logic error</b>", "runs but gives the wrong result; no error message"],
                 ["<b>Run-time error</b>", "crashes while running (divide by zero, index out of range)"],
                 ["<b>Overflow error</b>", "a number is too big for its bits"],
                 ["<b>Documentation</b>", "comments that say what the program or procedure is for"],
             ])),
        part(1, "Practice Set (10 questions)",
             "Answer each one, then read why.",
             quiz("qz18b", [
                 ("Which <b>two</b> are benefits of collaboration on a software project?", ["People with different backgrounds may notice different problems", "It guarantees the program has no bugs", "Team members can review each other's code and catch mistakes", "It removes the need to test the program"], [0, 2], "Collaboration brings diverse viewpoints and code review. It never guarantees there are no bugs, and testing is still needed."),
                 ("A recipe app lets users save recipes and search by ingredient. Which describes the app's <b>purpose</b>?", ["It stores each recipe as text in a list", "It helps people organize recipes and find what to cook with the ingredients they have", "It uses a loop to search the list", "It runs on both phones and computers"], 1, "Purpose is the <b>problem it solves</b> for users. The other choices describe how it is built."),
                 ("A team builds a game in stages: first the player can move, then they test it, then they add enemies and test again. This is", ["incremental development", "lossy compression", "a heuristic", "event-driven programming only"], 0, "Building and testing in small pieces is <b>incremental</b>."),
                 ("After a first release, developers read reviews, redesign the menu, and release again. This repeating cycle is", ["iterative development", "debugging a syntax error", "parallel computing", "random testing"], 0, "Repeated cycles of feedback and improvement are <b>iterative</b>."),
                 ("A student's code is meant to find an average:" + qc("total ← 0\nFOR EACH n IN scores\n{\n  total ← total + n\n}\naverage ← total / (LENGTH(scores) + 1)"), ["It has a syntax error", "It has a logic error because it divides by the wrong number", "It has an overflow error", "It will not run"], 1, "The program runs and gives a wrong answer: a <b>logic error</b>. The divisor should be LENGTH(scores)."),
                 ("A program works until a user taps a button that tries to read the 10th item of a 5-item list, and then it stops with an error message. This is a", ["syntax error", "logic error", "run-time error", "documentation error"], 2, "The error happens <b>while the program is running</b>."),
                 ("A game keeps the score in a variable that can hold 0 to 255. When the score passes 255 it shows 0. This is a(n)", ["overflow error", "syntax error", "logic error caused by a typo", "heuristic"], 0, "255 is the biggest number 8 bits can hold, so adding 1 wraps around: <b>overflow</b>."),
                 ("A procedure returns the <b>largest</b> number in a list. Which test is <b>most likely</b> to reveal a mistake that other tests would miss?", ["A list with the numbers 1, 2, 3", "A list in which every number is negative", "A list with 10 positive numbers", "A list in which the largest number is first"], 1, "A procedure that starts its \"largest so far\" at 0 fails only when every number is negative. This is an <b>edge case</b>."),
                 ("Which is the <b>best</b> comment to put above a procedure?", ["# this is a procedure", "# loops through the list prices and returns how many are at or under the budget", "# i is a counter", "# Written on Tuesday"], 1, "Good documentation says <b>what the procedure does</b> with its input."),
                 ("A mobile app does nothing until the user shakes the phone, then it shuffles a playlist. This is best described as", ["a program with no input", "an event-driven program", "a sequential program that ignores the user", "lossless compression"], 1, "Code that runs <b>in response to an event</b> is event-driven."),
             ])),
        exam(["Be able to <b>name</b> each error type from a short description.", "Know <b>incremental</b> vs <b>iterative</b>.", "Explain <b>purpose</b> vs <b>function</b>.", "Describe how <b>collaboration</b> improves a program."], "If you missed any question here, reread the Unit 19 notes."),
    ]
    return U.mk("review-big-idea-1.html", "review-big-idea-1", "Review: Big Idea 1, Creative Development", "10 TO 13% OF THE MULTIPLE CHOICE",
                "How programs get made: collaboration, purpose, incremental and iterative development, and the four kinds of errors. Review the terms, then test yourself.",
                parts, "Name the process. Name the error.", "Next: Big Idea 2, Data.")


# ==========================================================================================  18.3 BIG IDEA 2
def review2():
    parts = [
        part(0, "The Summary",
             "<b>Big Idea 2: Data</b> covers how data is stored as bits, how it is compressed, and how information is extracted from it.",
             terms([
                 ["<b>Bit / byte</b>", "a bit is 0 or 1; a byte is 8 bits"],
                 ["<b>n bits</b>", "make <b>2<sup>n</sup></b> patterns, counting from 0 to 2<sup>n</sup> - 1"],
                 ["<b>Overflow</b> / <b>round-off</b>", "too big for the bits / cannot be stored exactly"],
                 ["<b>Analog</b> vs <b>digital</b>", "smooth values vs separate numbers; analog is <b>sampled</b> to become digital"],
                 ["<b>Lossless</b> / <b>lossy</b>", "exactly recoverable / some detail gone for good, but smaller"],
                 ["<b>Image size</b>", "width &times; height &times; bits per pixel, then &divide; 8 for bytes"],
                 ["<b>RGB</b>", "three bytes per pixel, 2<sup>24</sup> = 16,777,216 colors"],
                 ["<b>Metadata</b>", "data about data"],
                 ["<b>Correlation</b> vs <b>causation</b>", "moving together vs one causing the other"],
                 ["<b>Cleaning data</b>", "fixing missing, duplicate, inconsistent, or impossible values"],
                 ["<b>Big data</b>", "too large for one computer; processed in parallel"],
             ])),
        part(1, "Practice Set (10 questions)",
             "Work out numbers on paper.",
             quiz("qz18c", [
                 ("A game needs to give each of 40 different characters its own unique binary code. What is the <b>minimum</b> number of bits needed for each code?", ["4", "5", "6", "40"], 2, "5 bits make only 32 patterns, which is too few. 6 bits make 64, so <b>6</b> bits."),
                 ("What is the decimal value of the binary number <code>10110</code>?", ["18", "20", "22", "26"], 2, "16 + 4 + 2 = <b>22</b>."),
                 ("What is the binary representation of the decimal number 37?", ["100011", "100101", "101001", "110001"], 1, "37 = 32 + 4 + 1, so the bits for 32, 4, and 1 are on: <b>100101</b>."),
                 ("In many programs <code>0.1 + 0.2</code> displays <code>0.30000000000000004</code>. This is an example of", ["an overflow error", "a round-off error", "a syntax error", "lossy compression"], 1, "Some decimal numbers cannot be stored exactly in a fixed number of bits."),
                 ("Which <b>two</b> statements about lossy compression are true?", ["The original data cannot be recovered exactly", "It usually produces a smaller file than lossless compression", "It always produces a larger file", "It can only be used on text"], [0, 1], "Lossy throws away detail for good, and that is what lets the file shrink more."),
                 ("A medical office stores scans that must be reproduced exactly. Which is the best choice?", ["A lossy format, because it is smaller", "A lossless format, because no detail may be lost", "No compression, because compression is never possible", "Converting to text"], 1, "When every detail matters, use <b>lossless</b>."),
                 ("A sound is recorded by measuring its volume 44,000 times per second. What happens if the number of measurements per second is <b>increased</b>?", ["The recording gets closer to the original sound and the file gets larger", "The recording gets farther from the original sound", "The file gets smaller and more accurate", "Nothing changes"], 0, "A higher sampling rate gives a closer copy, but needs more data."),
                 ("A pixel stores 3 bytes (one each for red, green, and blue). How many different colors can one pixel show?", ["3 &times; 256", "256 &times; 3", "2<sup>24</sup>", "2<sup>8</sup>"], 2, "3 bytes = 24 bits, so 2<sup>24</sup> = 16,777,216 colors."),
                 ("An image is 100 pixels wide and 100 pixels tall with 24 bits per pixel. About how many bytes is it before compression?", ["2,400", "10,000", "30,000", "240,000"], 2, "100 &times; 100 &times; 24 = 240,000 bits. Divide by 8: <b>30,000</b> bytes."),
                 ("A study finds that cities with more ice cream shops have more sunburn cases. Which conclusion is best supported?", ["Ice cream causes sunburn", "The two are correlated, and another factor such as hot weather may explain both", "Sunburn causes ice cream sales", "The data must be wrong"], 1, "A correlation does not show causation. Look for a <b>confounding variable</b>."),
             ])),
        exam(["Be quick with <b>binary and decimal conversions</b> and <b>bits needed</b> (2<sup>n</sup>).", "Choose <b>lossy or lossless</b> for a situation and justify it.", "Know the difference between <b>correlation and causation</b>.", "Know what <b>cleaning</b> and <b>metadata</b> are."], "If you missed any question here, reread the Unit 8 and Unit 12 notes."),
    ]
    return U.mk("review-big-idea-2.html", "review-big-idea-2", "Review: Big Idea 2, Data", "17 TO 22% OF THE MULTIPLE CHOICE",
                "Bits, binary, compression, and getting information out of data. Review the terms, then test yourself with the practice set.",
                parts, "Bits, patterns, and honest conclusions.", "Next: Big Idea 3, Algorithms and Programming.")


# ==========================================================================================  18.4 BIG IDEA 3
def review3():
    parts = [
        part(0, "The Summary",
             "<b>Big Idea 3: Algorithms and Programming</b> is the biggest slice of the multiple choice. It is mostly <b>reading and tracing code</b>.",
             terms([
                 ["<b>Sequencing, selection, iteration</b>", "the three building blocks of every algorithm"],
                 ["<b>Variable</b>, <b>list</b>", "named storage; an ordered collection (pseudocode indexes start at 1)"],
                 ["<b>Boolean</b>", "true or false; combined with AND, OR, NOT"],
                 ["<b>Procedure</b>", "a named block of code; <b>parameters</b> receive values and <b>RETURN</b> sends one back"],
                 ["<b>Library / API</b>", "ready-made procedures, and the documentation that tells you how to call them"],
                 ["<b>Linear</b> vs <b>binary</b> search", "check each item / halve a <b>sorted</b> list each step"],
                 ["<b>Equivalent algorithms</b>", "same result for every input, perhaps different steps or speed"],
                 ["<b>Reasonable time</b>", "polynomial growth (n, n&sup2;, n&sup3;); <b>unreasonable</b> is exponential or factorial"],
                 ["<b>Heuristic</b>", "a good-enough answer in reasonable time when the best takes too long"],
                 ["<b>Undecidable</b>", "no algorithm can answer for every input (the halting problem)"],
                 ["<b>Simulation</b>", "a program that models something real, often using random numbers"],
             ])),
        part(1, "Practice Set (12 questions)",
             "Trace the code on paper.",
             quiz("qz18d", [
                 ("What is displayed?" + qc("a ← true\nb ← false\nDISPLAY((a AND b) OR (NOT b))"), ["true", "false", "a", "an error"], 0, "(true AND false) is false. NOT false is true. false OR true is <b>true</b>."),
                 ("What is displayed?" + qc("x ← 12\nIF (x MOD 2 = 0)\n{\n  IF (x > 10)\n  {\n    DISPLAY(\"A\")\n  }\n  ELSE\n  {\n    DISPLAY(\"B\")\n  }\n}\nELSE\n{\n  DISPLAY(\"C\")\n}"), ["A", "B", "C", "Nothing"], 0, "12 is even, and 12 &gt; 10, so it displays <b>A</b>."),
                 ("How many times is a star displayed?" + qc("REPEAT 3 TIMES\n{\n  REPEAT 2 TIMES\n  {\n    DISPLAY(\"*\")\n  }\n}"), ["2", "3", "5", "6"], 3, "The inner loop runs 2 times for each of the 3 outer passes: 3 &times; 2 = <b>6</b>."),
                 ("What is displayed? (<code>REMOVE(list, i)</code> removes the item at index i.)" + qc("list ← [1, 2, 3]\nAPPEND(list, 4)\nREMOVE(list, 1)\nDISPLAY(list[1])"), ["1", "2", "3", "4"], 1, "After APPEND the list is [1, 2, 3, 4]. Removing index 1 leaves [2, 3, 4]. The first item is <b>2</b>."),
                 ("What is displayed?" + qc("PROCEDURE f(x)\n{\n  RETURN(x * 2 + 1)\n}\nDISPLAY(f(f(2)))"), ["5", "9", "11", "13"], 2, "f(2) = 5. Then f(5) = 5 &times; 2 + 1 = <b>11</b>."),
                 ("A sorted list has 100 items. What is the <b>maximum</b> number of items a binary search must check?", ["7", "10", "50", "100"], 0, "Each check halves the list. 2<sup>7</sup> = 128 is at least 100, so at most <b>7</b>."),
                 ("Which <b>two</b> algorithms run in a reasonable amount of time for large inputs?", ["Looking at each item of a list once", "Trying every possible subset of the items", "Two nested loops over the list", "Trying every possible ordering of the items"], [0, 2], "One pass is linear and nested loops are n&sup2;. Both are polynomial. Subsets (2<sup>n</sup>) and orderings (n!) are unreasonable."),
                 ("A delivery company cannot afford to check every possible route for 40 stops, so it uses a rule that always drives to the nearest unvisited stop. This approach is called a", ["decision problem", "heuristic", "syntax check", "lossless algorithm"], 1, "A heuristic finds a good, not guaranteed best, answer quickly."),
                 ("Which statement about an <b>undecidable</b> problem is true?", ["It always takes billions of years to solve", "No algorithm can correctly solve every instance of it", "It can be solved with enough memory", "It is solved by heuristics"], 1, "Undecidable means no algorithm exists that always gives the correct answer."),
                 ("A simulation of a bus system uses random numbers for passenger arrivals. Which is an <b>advantage</b> of using a simulation?", ["The results are always exactly what will happen", "It can test many possibilities quickly without the cost or risk of real-world tests", "It removes the need for any data", "It is always more accurate than measuring"], 1, "Simulations let you try things safely and cheaply. They are models, so they simplify reality."),
                 ("What is the smallest value that <code>10 + RANDOM(1, 3)</code> can have?", ["10", "11", "12", "13"], 1, "RANDOM(1, 3) can be 1, 2, or 3. The smallest total is 10 + 1 = <b>11</b>."),
                 ("Two algorithms both find the largest number in a list. One loops and remembers the biggest. The other sorts the list and takes the last item. They are", ["equivalent, because they give the same result for every list", "not equivalent, because the steps differ", "undecidable", "heuristics"], 0, "Equivalent algorithms give the same results for every input, even with different steps."),
             ])),
        exam(["<b>Trace</b> loops, conditionals, procedures, and list operations by hand.", "Know <b>reasonable vs unreasonable</b> time and give an example of each.", "Know <b>heuristic</b> and <b>undecidable</b>.", "Remember: <b>lists start at 1</b>, <code>RANDOM(a, b)</code> includes both ends, <code>REPEAT UNTIL</code> stops when true."], "If you missed any, reread Units 3 to 7 and the Unit 7 additions."),
    ]
    return U.mk("review-big-idea-3.html", "review-big-idea-3", "Review: Big Idea 3, Algorithms and Programming", "30 TO 35% OF THE MULTIPLE CHOICE",
                "The biggest part of the exam: reading code, tracing it by hand, and reasoning about algorithms and their efficiency. Review the terms, then trace the practice set.",
                parts, "Trace, don't guess.", "Next: Big Idea 4, Computer Systems and Networks.")


# ==========================================================================================  18.5 BIG IDEA 4
def review4():
    parts = [
        part(0, "The Summary",
             "<b>Big Idea 4: Computer Systems and Networks</b> is about how the Internet works and how computers share work.",
             terms([
                 ["<b>Internet</b>", "a network of networks using open protocols (not the same as the Web)"],
                 ["<b>Bandwidth</b>", "most data per second, in bits per second; download time = bits &divide; bandwidth"],
                 ["<b>IP address</b>", "unique number for a device; IPv4 = 32 bits, IPv6 = 128 bits"],
                 ["<b>DNS</b>", "turns domain names into IP addresses"],
                 ["<b>Router</b>, <b>hop</b>, <b>path</b>", "forwards packets; one handoff; the chain of devices"],
                 ["<b>Packet</b>", "a small piece of data with a header (addresses, sequence number) and a payload"],
                 ["<b>TCP</b> / <b>UDP</b>", "reliable, resends lost packets / fast, no resending"],
                 ["<b>Redundancy</b> / <b>fault tolerance</b>", "extra paths, so the network keeps working if a part fails"],
                 ["<b>Sequential / parallel / distributed</b>", "one at a time / at the same time / on many computers"],
                 ["<b>Speedup</b>", "sequential time &divide; parallel time"],
                 ["<b>Scalability</b>", "keeps working as the size grows"],
             ])),
        part(1, "Practice Set (10 questions)",
             "Calculate carefully, and check the units.",
             quiz("qz18e", [
                 ("A 450 MB file is downloaded at 90 megabits per second. About how many seconds does it take?", ["5", "40", "400", "4,050"], 1, "450 MB &times; 8 = 3,600 megabits. 3,600 &divide; 90 = <b>40</b> seconds."),
                 ("Devices are connected by these links: A-B, A-C, B-C, B-D, C-D. How many different paths (that do not visit a device twice) go from A to D?", ["2", "3", "4", "5"], 2, "A-B-D, A-C-D, A-B-C-D, and A-C-B-D. That is <b>4</b> paths."),
                 ("Why was the Internet designed with many possible paths between devices?", ["To make the cables cheaper", "So data can be rerouted if a device or link fails", "To make every message the same size", "So no one needs an IP address"], 1, "Redundancy makes the Internet <b>fault tolerant</b>."),
                 ("Packets from one message arrive at the destination out of order. How does the receiver put the message back together?", ["By using the sequence numbers in the packet headers", "By asking the sender to start over", "By guessing from the size of each packet", "By using the DNS server"], 0, "Each header carries a sequence number."),
                 ("A user types <code>www.example.org</code> into a browser. Which system translates that name into an IP address?", ["DHCP", "DNS", "TCP", "NAT"], 1, "<b>DNS</b> is the phone book of the Internet."),
                 ("Which is the <b>main reason</b> IPv6 was created?", ["IPv4 was too slow", "IPv4 ran out of addresses", "IPv4 was not encrypted", "IPv4 could not be used on phones"], 1, "32 bits give about 4.3 billion addresses. IPv6 uses 128 bits."),
                 ("Which protocol is the better choice for a live video call where a lost packet is not worth waiting for?", ["TCP, because it resends everything", "UDP, because it is faster and does not wait for resends", "DNS", "HTTPS"], 1, "For live data, speed matters more than perfection."),
                 ("A job takes 90 seconds sequentially and 45 seconds when run in parallel. What is the speedup?", ["0.5", "1.5", "2", "45"], 2, "Speedup = 90 &divide; 45 = <b>2</b>."),
                 ("Three independent tasks take 20, 20, and 30 seconds. What is the <b>shortest possible time</b> to finish all of them with two processors?", ["30 seconds", "40 seconds", "50 seconds", "70 seconds"], 1, "Put the 30-second task on one processor and the two 20-second tasks (40 seconds) on the other. The job finishes in <b>40</b> seconds."),
                 ("Which <b>two</b> statements about the Internet and the World Wide Web are true?", ["The Web is a service that runs on the Internet", "The Internet and the Web are the same thing", "The Internet uses open protocols so different devices can communicate", "Web pages are sent without any protocols"], [0, 2], "The Web runs on top of the Internet, and the Internet's open protocols let any device join."),
             ])),
        exam(["Calculate <b>transfer times</b> (bytes to bits) and <b>speedup</b>.", "Count <b>paths</b> and explain <b>redundancy</b>.", "Explain <b>packets, headers, TCP vs UDP, DNS, IP</b>.", "Distinguish <b>sequential, parallel, and distributed</b> computing."], "If you missed any, reread the Unit 10 notes."),
    ]
    return U.mk("review-big-idea-4.html", "review-big-idea-4", "Review: Big Idea 4, Computer Systems and Networks", "11 TO 15% OF THE MULTIPLE CHOICE",
                "How the Internet works and how computers share work: addresses, DNS, packets, protocols, redundancy, and parallel computing. Review the terms, then test yourself.",
                parts, "Paths, packets, and speedup.", "Next: Big Idea 5, the Impact of Computing.")


# ==========================================================================================  18.6 BIG IDEA 5
def review5():
    parts = [
        part(0, "The Summary",
             "<b>Big Idea 5: Impact of Computing</b> is about how computing affects people and society. These are mostly reasoning questions, and many use a short reading.",
             terms([
                 ["<b>Beneficial / harmful effects</b>", "most innovations have both; effects can be intended or unintended"],
                 ["<b>Digital divide</b>", "unequal access to devices and the Internet by income, place, or group"],
                 ["<b>Crowdsourcing</b>", "getting input from many people online; <b>citizen science</b> is one kind"],
                 ["<b>Bias</b>", "systematically unfair results, often from biased data or design"],
                 ["<b>Copyright</b> / <b>Creative Commons</b>", "automatic ownership / a license that allows certain uses in advance"],
                 ["<b>Open source</b>", "source code is public and can be used under a license"],
                 ["<b>PII</b>", "information that can identify, contact, or locate a person"],
                 ["<b>MFA</b>", "multifactor authentication: two or more kinds of proof"],
                 ["<b>Phishing</b>, <b>malware</b>, <b>keylogger</b>", "a tricking message; harmful software; software that records keystrokes"],
                 ["<b>Public key encryption</b>", "a public key encrypts, a private key decrypts"],
                 ["<b>Rogue access point</b>, <b>DDoS</b>", "fake Wi-Fi; many devices flooding a site"],
             ])),
        part(1, "Practice Set (10 questions)",
             "Think about who is affected and why.",
             quiz("qz18f", [
                 ("A smartphone app was designed to help people find parking. Its location data is also sold to advertisers, who use it to track where people go. This is an example of", ["only a beneficial effect", "an unintended harmful effect of a computing innovation", "a syntax error", "lossy compression"], 1, "The app also has an effect its users may not expect and may not want."),
                 ("Which <b>two</b> would most directly help reduce the digital divide?", ["Providing free Internet access at public libraries", "Making websites that load very slowly and use large videos", "Offering low-cost home Internet plans for low-income families", "Moving all government services to paid apps"], [0, 2], "Both increase <b>access</b>. The other two make access harder."),
                 ("A news site asks readers to submit photos of storm damage, which scientists then use to map the storm's path. This is an example of", ["crowdsourcing", "lossy compression", "a DDoS attack", "pair programming"], 0, "A large group contributes data online: <b>crowdsourcing</b> (citizen science)."),
                 ("A face-recognition program works well on most faces but poorly on a small group. Which action would <b>best</b> reduce the problem?", ["Make the program run faster", "Retrain it with more diverse photos and test it on each group", "Remove the testing step", "Reduce the number of photos"], 1, "Improve the <b>data</b> and test every group, not just the overall score."),
                 ("A photographer shares a photo with a <b>CC BY-NC</b> license. Which use is allowed?", ["Selling prints of the photo", "Posting the photo on a free school website with credit to the photographer", "Using it in a paid advertisement", "Claiming it as your own work"], 1, "BY requires credit. NC means <b>no commercial use</b>."),
                 ("Which is an example of <b>PII</b>?", ["The number of visitors to a website", "A person's full name together with their street address", "The name of a country", "A popular song title"], 1, "A name with an address identifies and locates a specific person."),
                 ("A text says, \"Your account will be locked! Reply with your password now.\" The sender's address looks slightly wrong. This is most likely", ["multifactor authentication", "phishing", "a rogue access point", "a cache"], 1, "A message that tricks you into giving up private information is <b>phishing</b>."),
                 ("A site requires a password and a code sent to the user's phone. Why does this make an account <b>more secure</b>?", ["The password becomes longer", "A thief who steals only the password still cannot log in", "The code is never sent", "It removes the need for passwords"], 1, "Two <b>different kinds</b> of proof: something you know and something you have."),
                 ("Which <b>two</b> statements about <b>public key encryption</b> are true?", ["A public key can be shared with anyone and is used to encrypt a message to its owner", "The private key must be shared with everyone", "Only the owner's private key can decrypt a message encrypted with the public key", "It requires both people to share one secret key in advance"], [0, 2], "Anyone can encrypt with the public key. Only the private key decrypts. That is why no secret needs to be shared first."),
                 ("A hacker sets up a Wi-Fi network named \"Free Airport WiFi\" so that people who join send their traffic through the hacker's computer. This is called a", ["rogue access point", "heuristic", "lossless network", "citizen science network"], 0, "A fake access point that captures traffic is a <b>rogue access point</b>."),
             ])),
        exam(["Describe <b>beneficial and harmful</b>, <b>intended and unintended</b> effects, and who they affect.", "Explain the <b>digital divide</b>, <b>bias</b>, and <b>crowdsourcing</b> with an example.", "Know <b>copyright, Creative Commons, open source</b>, and <b>plagiarism</b>.", "Know <b>PII, MFA, phishing, malware, keyloggers, rogue access points, and DDoS</b>, and what protects you."], "If you missed any, reread the Unit 11 and Unit 16 notes."),
    ]
    return U.mk("review-big-idea-5.html", "review-big-idea-5", "Review: Big Idea 5, Impact of Computing", "21 TO 26% OF THE MULTIPLE CHOICE",
                "How computing changes the world: its good and bad effects, the digital divide, bias, ownership, privacy, and security. Review the terms, then test yourself.",
                parts, "Who is affected, and why?", "That is the whole course. Good luck on the exam.")


PAGES = {"exam-strategies": exam_strategies, "review-big-idea-1": review1, "review-big-idea-2": review2, "review-big-idea-3": review3, "review-big-idea-4": review4, "review-big-idea-5": review5}
INDEXES = {"unit-18": lambda: U.index('<p>Time to put it all together. Start with the <b>exam strategies</b>, then review each of the five Big Ideas with a summary of the terms and a practice set in the exam\'s style. Review the notes for any question you miss.</p>',
                                       "&#128214; Notes and practice questions")}
