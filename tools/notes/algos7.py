"""Unit 7 additions for AP Big Idea 3 (Algorithms and Programming): 7.7 developing and equivalent algorithms (plus the exam pseudocode),
7.8 algorithmic efficiency, reasonable and unreasonable time, and heuristics, 7.9 undecidable problems."""
from lib import *

UNIT_DIR = "unit-7"
UNIT_LABEL = "Unit 7: Basic Data Structures"
PAGES_LIST = [
    ("lists-indexing.html", "Lists and Indexing"),
    ("list-operations.html", "Adding and Removing Items"),
    ("lists-for-loops.html", "For Loops and Lists"),
    ("simulations.html", "Simulations"),
    ("searching-efficiency.html", "Searching and Efficiency"),
    ("data-abstraction.html", "Data Abstraction and the Create Task"),
    ("developing-algorithms.html", "Developing Algorithms"),
    ("algorithm-efficiency.html", "Efficiency and Heuristics"),
    ("undecidable-problems.html", "Undecidable Problems"),
]
NEW = ["developing-algorithms.html", "algorithm-efficiency.html", "undecidable-problems.html"]
TITLES = {
    "developing-algorithms.html": "Developing Algorithms and Equivalent Algorithms (7.7)",
    "algorithm-efficiency.html": "Efficiency, Reasonable Time, and Heuristics (7.8)",
    "undecidable-problems.html": "Undecidable Problems (7.9)",
    "data-abstraction.html": "Data Abstraction and the Create Task (7.6)",
}
SLOT = {"developing-algorithms.html": "a208", "algorithm-efficiency.html": "a209", "undecidable-problems.html": "a210"}


def mk(f, slug, title, subject, deck, parts, fh, fp):
    i = NEW.index(f)
    prev = (NEW[i - 1], TITLES[NEW[i - 1]]) if i > 0 else ("data-abstraction.html", TITLES["data-abstraction.html"])
    nxt = (NEW[i + 1], TITLES[NEW[i + 1]]) if i < len(NEW) - 1 else None
    return page(slug, title, subject, deck, UNIT_DIR, UNIT_LABEL, PAGES_LIST, "".join(parts), fh, fp, prev, nxt, walk=SLOT[f], concept=TITLES[f])


# ==========================================================================================  7.7 DEVELOPING ALGORITHMS
def developing_algorithms():
    same = widget("wgsame", "Try it: do these three programs give the same answer?",
                  "All three claim to find the <b>largest</b> number in a list. Type a list and compare them.",
                  '<div class="row"><input type="text" class="l" value="4, 9, 2, 7" style="width:26ch" spellcheck="false"> <button class="neg">Try negatives</button> <button class="pos">Try positives</button></div><div class="out"></div>',
                  r"""
var inp=root.querySelector(".l"),out=root.querySelector(".out");
function A(l){var m=l[0];for(var i=1;i<l.length;i++)if(l[i]>m)m=l[i];return m}
function B(l){return l.slice().sort(function(a,b){return a-b})[l.length-1]}
function C(l){var m=0;l.forEach(function(x){if(x>m)m=x});return m}
function upd(){var l=inp.value.split(/[ ,]+/).filter(Boolean).map(Number).filter(function(x){return !isNaN(x)});if(!l.length){out.innerHTML="<i>Type some numbers.</i>";return}
 var a=A(l),b=B(l),c=C(l);
 out.innerHTML='<table><tr><th>Program</th><th>How it works</th><th>Answer</th></tr><tr><td>A</td><td>start with the first item, keep any bigger one</td><td><b>'+a+'</b></td></tr><tr><td>B</td><td>sort the list, take the last item</td><td><b>'+b+'</b></td></tr><tr><td>C</td><td>start with 0, keep any bigger one</td><td><b style="color:'+(c===a?"#A3E635":"#F87171")+'">'+c+'</b></td></tr></table>'+
 (a===b&&b===c?'<div class="note">All three agree on this list. A and B are <b>equivalent algorithms</b>: different steps, the same results every time.</div>':'<div class="note"><b>C gives a different answer.</b> It looks almost the same as A, but starting at <b>0</b> is wrong when every number is negative. Algorithms that look alike can give different results, so <b>test unusual inputs</b>.</div>')}
inp.addEventListener("input",upd);root.querySelector(".neg").onclick=function(){inp.value="-5, -2, -9";upd()};root.querySelector(".pos").onclick=function(){inp.value="4, 9, 2, 7";upd()};upd();
""")
    gauss = widget("wgsum", "Try it: two ways to add 1 + 2 + ... + n",
                   "Both give the same total. Count how many steps each one takes.",
                   '<div class="row"><label>n = <input type="range" min="1" max="1000" value="100"> <b class="mono nv">100</b></label></div><div class="out"></div>',
                   r"""
var rg=root.querySelector("input"),nv=root.querySelector(".nv"),out=root.querySelector(".out");
function upd(){var n=Number(rg.value);nv.textContent=n;var t=n*(n+1)/2;
 out.innerHTML='<table><tr><th>Algorithm</th><th>Steps</th><th>Result</th></tr><tr><td>Loop: add 1, then 2, then 3 ... to n</td><td><b>'+n+'</b> additions</td><td>'+t+'</td></tr><tr><td>Formula: n &times; (n + 1) &divide; 2</td><td><b>3</b> operations</td><td>'+t+'</td></tr></table><div class="note">Same answer, very different effort. The loop does <b>more work as n grows</b>. The formula does the same 3 operations whether n is 10 or 10 million.</div>'}
rg.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "What Is an Algorithm?",
             "An <b>algorithm</b> is a finite set of instructions that accomplishes a task. Every algorithm is built from just <b>three building blocks</b>.",
             cards([("1", "Sequencing", "Steps run <b>in order</b>, one after another."), ("2", "Selection", "A <b>condition</b> decides which steps run (<code>if</code>, <code>else</code>)."), ("3", "Iteration", "Steps <b>repeat</b> (<code>for</code>, <code>while</code>).")]),
             ex("<b>Algorithm for finding the largest number:</b> (1) call the first number the largest so far. (2) for each other number, if it is bigger, make it the largest so far. (3) when you run out of numbers, the largest so far is the answer.")),
        part(1, "Developing an Algorithm",
             "Good programmers do not start typing. They follow a process.",
             tbl(["Step", "What you do", "Example: average of a list"], [
                 ["<b>1. Understand</b>", "say what goes in and what must come out", "in: a list of numbers. out: one number"],
                 ["<b>2. Plan</b>", "write the steps in words or pseudocode", "add them all up, divide by how many"],
                 ["<b>3. Write</b>", "turn the plan into code", "a loop with a total, then a division"],
                 ["<b>4. Test</b>", "try normal, edge, and unusual inputs", "a list of one number? an empty list? negatives?"],
             ]),
             "<p>You can also <b>build on algorithms that already exist</b>. You can <b>combine</b> two (find the largest, then use it to scale every value) or <b>modify</b> one (change \"largest\" to \"smallest\" by flipping a comparison). Knowing standard algorithms like searching and finding a maximum saves time.</p>"),
        part(2, "Equivalent Algorithms",
             "<b>Equivalent algorithms</b> solve the same problem and give the <b>same results for every input</b>, even though their steps are different. One may be faster, shorter, or easier to read.",
             same,
             gauss,
             tbl(["", "Same idea, different code", "Different algorithms, same result", "Look-alike, different result"], [
                 ["<b>Example</b>", "a <code>for</code> loop and a <code>while</code> loop that count to 10", "loop for 1 + ... + n and the formula n(n + 1) &divide; 2", "program C above: starts at 0 instead of the first item"],
                 ["<b>Same results?</b>", "yes", "yes (equivalent algorithms)", "<b>no</b>, on some inputs"],
             ])),
        part(3, "Testing With the Right Inputs",
             "Running a program once and seeing the right answer proves very little. Good <b>test cases</b> include:",
             chk(["a <b>normal</b> input", "the <b>smallest</b> input (an empty list, one item, zero)", "the <b>largest</b> input", "<b>ties</b> and <b>duplicates</b>", "<b>negative</b> or unexpected values", "values <b>right at a boundary</b>, like exactly 18 for an age check"]),
             "<p><b>Tracing</b> the code by hand (writing down every variable after every line) finds mistakes the same way and is a skill the exam tests every year.</p>"),
        part(4, "The Exam's Pseudocode",
             "The AP exam does not use Python. It uses its own <b>reference-sheet pseudocode</b>. Every idea you have practiced has a matching form. <b>Warning: pseudocode lists start at index 1, Python lists start at 0.</b>",
             tbl(["Idea", "AP pseudocode", "Python"], [
                 ["assign", "<code>a &larr; 5</code>", "<code>a = 5</code>"],
                 ["display", "<code>DISPLAY(a)</code>", "<code>print(a)</code>"],
                 ["remainder", "<code>a MOD b</code>", "<code>a % b</code>"],
                 ["decision", "<code>IF (a &gt; 3) { ... } ELSE { ... }</code>", "<code>if a &gt; 3: ... else: ...</code>"],
                 ["repeat n times", "<code>REPEAT n TIMES { ... }</code>", "<code>for i in range(n): ...</code>"],
                 ["repeat while", "<code>REPEAT UNTIL (cond) { ... }</code>", "<code>while not cond: ...</code>"],
                 ["each item", "<code>FOR EACH item IN list { ... }</code>", "<code>for item in list: ...</code>"],
                 ["list length", "<code>LENGTH(list)</code>", "<code>len(list)</code>"],
                 ["first item", "<code>list[1]</code>", "<code>list[0]</code>"],
                 ["add to a list", "<code>APPEND(list, value)</code>", "<code>list.append(value)</code>"],
                 ["procedure", "<code>PROCEDURE f(x) { RETURN(x * 2) }</code>", "<code>def f(x): return x * 2</code>"],
                 ["random", "<code>RANDOM(1, 6)</code>", "<code>random.randint(1, 6)</code>"],
             ]),
             quiz("qz7a", [
                 ("Which are the three building blocks of every algorithm?", ["Input, output, and storage", "Sequencing, selection, and iteration", "Variables, lists, and functions", "Compile, run, and debug"], 1, "Steps in order, decisions, and repetition can build any algorithm."),
                 ("Two algorithms are <b>equivalent</b> if they…", ["use exactly the same code", "give the same result for every input, even if the steps differ", "run in the same amount of time", "were written by the same person"], 1, "Equivalent algorithms agree on every input. They can still differ in speed."),
                 ("A program finds the largest number but starts its \"largest so far\" at 0. For which list does it give a wrong answer?", ["4, 9, 2", "10, 20, 30", "-5, -2, -9", "0, 1, 2"], 2, "When all numbers are negative, the start value of 0 is never beaten, so 0 is returned."),
                 ("In AP pseudocode, what is the index of the first item in a list?", ["0", "1", "-1", "It depends on the list"], 1, "AP pseudocode lists start at <b>1</b>. Python lists start at 0."),
                 ("A developer writes a new program by taking an existing sorting algorithm and changing the comparison so it sorts from largest to smallest. This is…", ["Developing an algorithm by modifying an existing one", "Compressing data", "Encrypting data", "Parallel computing"], 0, "Building on and <b>modifying</b> existing algorithms is a normal way to develop new ones."),
             ])),
        exam([
            "Every algorithm is built from <b>sequencing, selection, and iteration</b>.",
            "<b>Equivalent algorithms</b> give the same result for every input but may differ in how many steps they take.",
            "Algorithms that <b>look similar</b> can give <b>different results</b>. Test edge cases.",
            "New algorithms can be made by <b>combining</b> or <b>modifying</b> existing ones.",
            "Know the exam <b>pseudocode</b>: <code>&larr;</code>, <code>DISPLAY</code>, <code>IF</code>, <code>REPEAT</code>, <code>FOR EACH</code>, <code>PROCEDURE</code>, and that lists start at <b>1</b>.",
        ]),
    ]
    return mk("developing-algorithms.html", "developing-algorithms", "Developing Algorithms and Equivalent Algorithms", "PLAN IT, TEST IT, COMPARE IT",
              "There is more than one way to solve most problems. Learn how an algorithm is developed, what makes two algorithms <b>equivalent</b>, why programs that look alike can disagree, and how the exam writes it all in pseudocode.",
              parts, "Same answer, different road.", "Next: when two algorithms give the same answer, how do you decide which is better? Efficiency.")


# ==========================================================================================  7.8 EFFICIENCY
def algorithm_efficiency():
    growth = widget("wggrow", "Try it: how fast does the work grow?",
                    "A computer does about <b>one billion steps per second</b>. Slide n (the size of the input) and see how long each kind of algorithm needs.",
                    '<div class="row"><label>n = <input type="range" min="1" max="60" value="10"> <b class="mono nv">10</b></label></div><div class="out"></div>',
                    r"""
var rg=root.querySelector("input"),nv=root.querySelector(".nv"),out=root.querySelector(".out");
function fact(n){var f=1;for(var i=2;i<=n;i++)f*=i;return f}
function big(x){return x>=1e15?x.toExponential(1).replace("e+"," &times; 10^"):Math.round(x).toLocaleString()}
function tm(s){if(s<1e-3)return"instant";if(s<1)return(s*1000).toFixed(0)+" ms";if(s<60)return s.toFixed(1)+" seconds";if(s<3600)return(s/60).toFixed(0)+" minutes";if(s<86400)return(s/3600).toFixed(0)+" hours";if(s<31536000)return(s/86400).toFixed(0)+" days";var y=s/31536000;if(y>1.38e10)return"<b style='color:#F87171'>longer than the age of the universe</b>";return y>1e6?(y/1e6).toFixed(0)+" million years":y.toFixed(0)+" years"}
function upd(){var n=Number(rg.value);nv.textContent=n;var rows=[["n","a loop over the list","reasonable",n],["n&sup2;","a loop inside a loop","reasonable",n*n],["n&sup3;","three nested loops","reasonable",n*n*n],["2<sup>n</sup>","try every subset","unreasonable",Math.pow(2,n)],["n!","try every ordering","unreasonable",fact(n)]];
 out.innerHTML='<table><tr><th>Steps</th><th>Example</th><th>Number of steps</th><th>Time at 1 billion/s</th><th>Kind</th></tr>'+rows.map(function(r){var bad=r[2]==="unreasonable";return'<tr><td>'+r[0]+'</td><td style="text-align:left">'+r[1]+'</td><td>'+big(r[3])+'</td><td>'+tm(r[3]/1e9)+'</td><td style="color:'+(bad?"#F87171":"#A3E635")+'">'+r[2]+'</td></tr>'}).join("")+'</table><div class="note">Try n = 10, then 30, then 60. The <b>reasonable</b> rows barely move. The <b>unreasonable</b> rows explode.</div>'}
rg.addEventListener("input",upd);upd();
""")
    route = widget("wgtsp", "Try it: a delivery driver with seven stops",
                   "A driver must visit every stop and come back to the start. The <b>best</b> route means checking every order. The <b>heuristic</b> (\"always go to the nearest stop\") is quick, but not always the best.",
                   '<div class="row"><button class="new">New map</button></div><div class="grid2 out"></div>',
                   r"""
var out=root.querySelector(".out");
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1])}
function len(p,order){var t=0;for(var i=0;i<order.length;i++)t+=dist(p[order[i]],p[order[(i+1)%order.length]]);return t}
function nn(p){var left=[];for(var i=1;i<p.length;i++)left.push(i);var o=[0];while(left.length){var c=p[o[o.length-1]],bi=0;for(var k=1;k<left.length;k++)if(dist(c,p[left[k]])<dist(c,p[left[bi]]))bi=k;o.push(left.splice(bi,1)[0])}return o}
function best(p){var rest=[];for(var i=1;i<p.length;i++)rest.push(i);var bo=null,bl=1e18;function perm(a,k){if(k===a.length){var o=[0].concat(a),l=len(p,o);if(l<bl){bl=l;bo=o}return}for(var i=k;i<a.length;i++){var t=a[k];a[k]=a[i];a[i]=t;perm(a,k+1);t=a[k];a[k]=a[i];a[i]=t}}perm(rest,0);return bo}
function draw(p,o,color,title,l){var s='<svg viewBox="0 0 300 200" style="width:100%;background:#0B0F16;border:1px solid #232B38;border-radius:8px">';for(var i=0;i<o.length;i++){var a=p[o[i]],b=p[o[(i+1)%o.length]];s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+color+'" stroke-width="2.5"/>'}
 p.forEach(function(q,i){s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+(i?6:9)+'" fill="'+(i?"#151A24":"#FBBF24")+'" stroke="#EAEFF6" stroke-width="2"/>'});return'<div><div class="mono" style="font-size:13px;color:'+color+'">'+title+'</div>'+s+'</svg><div class="mono" style="font-size:13px">Route length: <b>'+l.toFixed(0)+'</b></div></div>'}
function make(){var p=[];for(var i=0;i<7;i++)p.push([20+Math.random()*260,20+Math.random()*160]);var h=nn(p),b=best(p),lh=len(p,h),lb=len(p,b),extra=(lh/lb-1)*100;
 out.innerHTML=draw(p,h,"#FB923C","Heuristic: nearest stop next",lh)+draw(p,b,"#A3E635","Best route: checked all 720",lb)+'<div style="grid-column:1/-1">'+(extra<0.5?'<b>This time the heuristic found the best route.</b>':'The heuristic route is <b style="color:#FBBF24">'+extra.toFixed(0)+'% longer</b>.')+' With <b>7</b> stops there are only 720 orders to check. With <b>20</b> stops there are about <b>1.2 &times; 10<sup>17</sup></b>, which is unreasonable. The heuristic still takes only a blink.</div>'}
root.querySelector(".new").onclick=make;make();
""")
    parts = [
        part(0, "What Is Efficiency?",
             "An algorithm's <b>efficiency</b> is how much <b>time and resources</b> it needs, usually described by <b>how the number of steps grows as the input gets bigger</b>. It is not about the stopwatch. A faster computer makes every algorithm faster, but it does not change how the steps <b>grow</b>.",
             tbl(["Algorithm", "Steps for a list of n items", "Doubling the list…"], [
                 ["<b>Linear search</b>", "up to n", "doubles the steps"],
                 ["<b>Binary search</b> (sorted list)", "about log<sub>2</sub> n", "adds <b>one</b> step"],
                 ["<b>Two nested loops</b> over the list", "n &times; n", "makes <b>four times</b> the steps"],
             ]),
             "<p>The exam does not ask you to count exact steps. It asks you to <b>compare</b> two algorithms and say which grows faster.</p>"),
        part(1, "Reasonable and Unreasonable Time",
             "Computer scientists split algorithms into two families.",
             growth,
             tbl(["", "Reasonable time", "Unreasonable time"], [
                 ["<b>Number of steps grows like…</b>", "n, n&sup2;, n&sup3; (a <b>polynomial</b>), or slower like log n", "2<sup>n</sup> or n! (<b>exponential</b> or <b>factorial</b>)"],
                 ["<b>As the input grows…</b>", "the time grows slowly enough to finish", "the time explodes and soon takes longer than anyone can wait"],
                 ["<b>Typical example</b>", "searching a list, sorting, nested loops", "trying every combination or every ordering"],
             ]),
             warn("<b>Unreasonable does not mean impossible.</b> It means that for large inputs, the algorithm would take so long it is useless, even on the fastest computers.")),
        part(2, "Decision Problems and Optimization Problems",
             "Problems come in two common shapes.",
             tbl(["", "Decision problem", "Optimization problem"], [
                 ["<b>Asks</b>", "a yes or no question", "find the <b>best</b> answer"],
                 ["<b>Example</b>", "\"Is 17 in this list?\" \"Is there a route under 100 miles?\"", "\"What is the shortest route that visits every stop?\""],
             ]),
             "<p>Many optimization problems (like the shortest route through every stop) have <b>no known reasonable-time algorithm</b> that is guaranteed to find the best answer.</p>"),
        part(3, "Heuristics: Good Enough, Fast Enough",
             "When finding the <b>best</b> answer takes unreasonable time, a <b>heuristic</b> finds a <b>good, but not guaranteed best</b>, answer in reasonable time. It is a rule of thumb.",
             route,
             tbl(["Heuristic", "Used for", "Trade-off"], [
                 ["go to the nearest stop next", "delivery routes", "fast, sometimes noticeably longer than the best"],
                 ["suggest roads that are usually fast", "GPS navigation", "quick answer, not always the very fastest"],
                 ["flag an email with words like \"winner\" and \"urgent\"", "spam filters", "catches most spam, but misses some and flags some real mail"],
             ]),
             quiz("qz7b", [
                 ("An algorithm must try every possible ordering of 25 locations. Which statement is most accurate?", ["It runs in reasonable time because computers are fast", "The number of orderings grows so quickly that it runs in unreasonable time", "It runs in linear time", "It is impossible to write"], 1, "Trying every ordering grows like <b>n!</b>, which is unreasonable time."),
                 ("Algorithm A takes about n steps. Algorithm B takes about n &times; n steps. If the list gets 10 times longer, what happens to B's steps?", ["They get 10 times bigger", "They get 100 times bigger", "They stay the same", "They get 20 times bigger"], 1, "n &times; n grows by 10 &times; 10 = 100. B is still polynomial, so still reasonable."),
                 ("What is a <b>heuristic</b>?", ["An algorithm that always finds the best answer", "An approach that finds a good-enough answer in reasonable time when the best answer takes too long", "A kind of loop", "An error in a program"], 1, "Heuristics trade perfection for speed."),
                 ("Which problem is a <b>decision problem</b>?", ["Find the shortest route through 20 cities", "Is a given number in a list?", "Find the cheapest set of items that fits in a bag", "Find the best seating plan"], 1, "A decision problem has a <b>yes or no</b> answer."),
                 ("Which of these algorithms runs in <b>reasonable</b> time?", ["Checking every item of a list once", "Trying every possible subset of the items", "Trying every possible ordering of the items", "Trying every possible password of any length"], 0, "One pass over a list is linear, a polynomial."),
             ])),
        exam([
            "<b>Efficiency</b> describes how the number of steps <b>grows</b> with the size of the input, not how many seconds one run takes.",
            "<b>Polynomial</b> growth (n, n&sup2;, n&sup3;) is <b>reasonable</b>. <b>Exponential and factorial</b> growth (2<sup>n</sup>, n!) is <b>unreasonable</b>.",
            "A <b>decision problem</b> asks yes/no. An <b>optimization problem</b> asks for the best.",
            "A <b>heuristic</b> finds a good (not guaranteed best) answer in reasonable time when the best answer takes unreasonable time.",
            "Comparing algorithms is about which one <b>grows faster</b>, not exact step counts.",
        ]),
    ]
    return mk("algorithm-efficiency.html", "algorithm-efficiency", "Efficiency, Reasonable Time, and Heuristics", "HOW FAST DOES THE WORK GROW?",
              "Two programs can both be right and still be very different. Learn how to compare <b>how much work grows</b> as the input gets bigger, why some algorithms are called <b>unreasonable</b>, and what a <b>heuristic</b> trades away to get an answer.",
              parts, "Grows slowly: fine. Explodes: use a heuristic.", "Next: there are problems no algorithm can solve at all, no matter how much time you give it.")


# ==========================================================================================  7.9 UNDECIDABLE
def undecidable_problems():
    def frame(lines, color="teal", title=""):
        y = 66
        out = ""
        for l in lines:
            out += stext(360, y, l, "white", 15)
            y += 24
        return svg(720, 150, sbox(20, 10, 680, 130, "", "", color) + out, "halting problem step")

    steps = stepper("stphalt", "Click through: why no program can solve the halting problem",
                    [(frame(["A friend claims to have written <HALTS(program, input)>.", "It always answers: YES the program stops, or NO it runs forever.", "Let's see if that is possible."], "blue"),
                      "Suppose a perfect <b>HALTS</b> checker exists. It looks at any program and any input and always answers correctly."),
                     (frame(["PROGRAM TROUBLE(p):", "if HALTS(p, p) says YES:  loop forever", "otherwise:  stop immediately"], "yellow"),
                      "Now write a sneaky program, <b>TROUBLE</b>. It asks HALTS about a program run on <b>itself</b>, then does the <b>opposite</b>."),
                     (frame(["Run TROUBLE(TROUBLE).", "If HALTS says YES (it stops), then TROUBLE loops forever.", "HALTS was wrong."], "pink"),
                      "Run TROUBLE on itself. Suppose HALTS answers <b>YES, it stops</b>. Then TROUBLE does the opposite and <b>loops forever</b>. HALTS was wrong."),
                     (frame(["Run TROUBLE(TROUBLE).", "If HALTS says NO (it runs forever), then TROUBLE stops.", "HALTS was wrong again."], "pink"),
                      "Suppose HALTS answers <b>NO, it runs forever</b>. Then TROUBLE <b>stops immediately</b>. HALTS was wrong again."),
                     (frame(["Either answer is wrong.", "So a perfect HALTS program cannot exist.", "The halting problem is UNDECIDABLE."], "green"),
                      "No matter what HALTS answers, it is wrong about TROUBLE. So a perfect HALTS <b>cannot exist</b>. This is a proof by contradiction.")])

    collatz = widget("wgcol", "Try it: will this program ever stop?",
                     "Pick a starting number. The rule: if the number is even, halve it. If it is odd, multiply by 3 and add 1. Repeat until you reach 1. The program stops only when it reaches 1.",
                     '<div class="row"><label>Start at <input type="number" value="27" min="1" max="1000000" style="width:12ch"></label></div><div class="out"></div>',
                     r"""
var inp=root.querySelector("input"),out=root.querySelector(".out");
function upd(){var n=Math.floor(Number(inp.value));if(!(n>=1)){out.innerHTML="<i>Pick a whole number of at least 1.</i>";return}
 var seq=[n],steps=0,x=n,cap=100000;while(x!==1&&steps<cap){x=x%2===0?x/2:3*x+1;seq.push(x);steps++}
 out.innerHTML=(x===1?'It <b style="color:#A3E635">stopped</b> after <b>'+steps+'</b> steps.':'Still running after '+cap+' steps...')+'<div class="mono" style="font-size:13px;margin-top:6px;word-break:break-all;color:#C4CDD8">'+seq.slice(0,24).join(" &rarr; ")+(seq.length>24?" ...":"")+'</div><div class="note">Every starting number anyone has ever tried reaches 1. But <b>nobody has proven that it always does</b>. If you only <i>run</i> a program and it has not stopped yet, you cannot tell whether it will stop later or run forever. That is the heart of the halting problem.</div>'}
inp.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "Some Problems Can't Be Solved",
             "Computers are powerful, but there are <b>limits</b>. A problem is <b>decidable</b> if some algorithm can <b>always give a correct yes or no answer</b> for every possible input. A problem is <b>undecidable</b> if <b>no algorithm</b> can possibly do that, not now, not with faster computers, not ever.",
             tbl(["", "Decidable", "Undecidable"], [
                 ["<b>An algorithm exists…</b>", "that always gives the right yes/no", "<b>none</b>, and this has been proven"],
                 ["<b>Example</b>", "\"Is this number even?\" \"Is this value in the list?\"", "the <b>halting problem</b>"],
             ])),
        part(1, "The Halting Problem",
             "The famous undecidable problem: <b>given any program and any input, will the program eventually stop, or run forever?</b>",
             steps,
             ex("<b>Why does this matter?</b> It shows that there is no <b>perfect bug-checker</b> that can analyze every program and always correctly say whether it will freeze. Some questions about programs simply cannot be answered by a program.")),
        part(2, "Hard Is Not the Same as Impossible",
             "These two ideas are easy to confuse.",
             tbl(["", "Unreasonable time", "Undecidable"], [
                 ["<b>Can an algorithm solve it?</b>", "<b>yes</b>, an algorithm exists and is correct", "<b>no</b>, no algorithm can"],
                 ["<b>What is the trouble?</b>", "it takes far too long for large inputs", "it is impossible for every input"],
                 ["<b>Example</b>", "checking every route through 30 cities", "deciding if any program ever halts"],
                 ["<b>What do we do?</b>", "use a <b>heuristic</b> for a good-enough answer", "solve special cases, or give up on solving every case"],
             ]),
             "<p>Notice that undecidable does not mean you can never tell about <i>one</i> program. You can see that <code>print(\"hi\")</code> stops. The problem is that <b>no single algorithm</b> can answer correctly for <b>every</b> program.</p>"),
        part(3, "You Cannot Just Run It and See",
             "A natural idea is: run the program and watch. That works if it stops, but if it is still running, you do not know whether it will stop in a minute or run forever.",
             collatz,
             quiz("qz7c", [
                 ("What does it mean for a problem to be <b>undecidable</b>?", ["It takes a very long time to solve", "No algorithm can solve it correctly for every input", "It has no inputs", "It can only be solved by a person"], 1, "Undecidable means <b>no algorithm exists</b> that always gives the correct yes or no answer."),
                 ("Which statement about the halting problem is true?", ["It is solved by running the program and watching", "No program can correctly tell, for every program and input, whether it will halt", "It can be solved with a faster computer", "It is only a problem for Python"], 1, "The halting problem is the standard <b>undecidable</b> problem."),
                 ("A problem can be solved by an algorithm, but the algorithm would take billions of years for large inputs. This problem is best described as…", ["undecidable", "solvable, but in unreasonable time", "a decision problem with no input", "a heuristic"], 1, "A problem that can be solved but takes too long is <b>unreasonable</b>, not undecidable."),
                 ("Which statement is true?", ["An undecidable problem will be solved when computers get faster", "Undecidable means there is a proof that no algorithm can solve every case", "Heuristics solve undecidable problems perfectly", "Undecidable problems are always decision problems about passwords"], 1, "No amount of speed fixes it. It is <b>proven</b> impossible."),
             ])),
        exam([
            "A problem is <b>decidable</b> if an algorithm can always give a correct yes/no answer. <b>Undecidable</b> means <b>no algorithm can</b>.",
            "The <b>halting problem</b> is the standard undecidable problem: no program can tell for every program whether it will stop.",
            "<b>Unreasonable time</b> (solvable but too slow) is different from <b>undecidable</b> (not solvable at all).",
            "Algorithms can still solve some <b>specific cases</b> of an undecidable problem. They cannot solve <b>all</b> of them.",
        ]),
    ]
    return mk("undecidable-problems.html", "undecidable-problems", "Undecidable Problems", "THE LIMITS OF COMPUTING",
              "Faster computers can fix a slow algorithm. They cannot fix a problem that <b>no algorithm can solve</b>. Learn what <b>undecidable</b> means, why the <b>halting problem</b> is impossible, and how that differs from \"just very slow\".",
              parts, "Some questions have no program.", "That is every idea in Big Idea 3. Use the walkthroughs to put each one into your own words.")


PAGES = {
    "developing-algorithms": developing_algorithms,
    "algorithm-efficiency": algorithm_efficiency,
    "undecidable-problems": undecidable_problems,
}
INDEXES = {}
