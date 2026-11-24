"""Authored pages for Units 1 and 2 (Karel and collaboration). Same page format as the notes modules so gl.load_page can read them."""
from gl import fig, esc

def karel_world(title, cols, rows, karel, balls=(), walls=(), path=(), caption=None, labels=None):
    """karel=(col,row,dir) with row 1 at the bottom. balls=[(c,r,n)], walls=[(c,r,'E'|'N')], path=[(c,r),...] drawn as a pink arrow line."""
    cell = 58; W = 680; gw = cols * cell; gh = rows * cell; x0 = (W - gw) / 2 + 18; y0 = 44; H = y0 + gh + 44
    X = lambda c: x0 + (c - 1) * cell; Y = lambda r: y0 + (rows - r) * cell
    s = '<defs><marker id="kp" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#DB2777"/></marker></defs>'
    s += '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for c in range(1, cols + 1):
        for r in range(1, rows + 1):
            s += '<rect x="%.0f" y="%.0f" width="%d" height="%d" fill="#F8FAFC" stroke="#CBD5E1"/>' % (X(c), Y(r), cell, cell)
    for c in range(1, cols + 1): s += '<text x="%.0f" y="%.0f" font-size="10" fill="#6B7280" text-anchor="middle" font-weight="700">%d</text>' % (X(c) + cell / 2, y0 + gh + 15, c)
    for r in range(1, rows + 1): s += '<text x="%.0f" y="%.0f" font-size="10" fill="#6B7280" text-anchor="end" font-weight="700">%d</text>' % (x0 - 8, Y(r) + cell / 2 + 4, r)
    s += '<text x="%.0f" y="%.0f" font-size="10" fill="#6B7280" text-anchor="middle" font-weight="700">avenues (columns)</text>' % (x0 + gw / 2, y0 + gh + 32)
    for (c, r, n) in balls:
        s += '<circle cx="%.0f" cy="%.0f" r="14" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/><text x="%.0f" y="%.0f" font-size="13" font-weight="800" fill="#451A03" text-anchor="middle">%d</text>' % (X(c) + cell / 2, Y(r) + cell / 2, X(c) + cell / 2, Y(r) + cell / 2 + 4.5, n)
    for (c, r, side) in walls:
        if side == "E": s += '<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke="#111827" stroke-width="5" stroke-linecap="round"/>' % (X(c) + cell, Y(r), X(c) + cell, Y(r) + cell)
        else: s += '<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke="#111827" stroke-width="5" stroke-linecap="round"/>' % (X(c), Y(r), X(c) + cell, Y(r))
    if path:
        pts = " ".join("%.0f,%.0f" % (X(c) + cell / 2, Y(r) + cell / 2) for c, r in path)
        s += '<polyline points="%s" fill="none" stroke="#DB2777" stroke-width="2.6" stroke-dasharray="6 4" marker-end="url(#kp)"/>' % pts
    kc, kr, d = karel; cx = X(kc) + cell / 2; cy = Y(kr) + cell / 2; rot = {"N": 0, "E": 90, "S": 180, "W": 270}[d]
    s += '<g transform="translate(%.0f %.0f) rotate(%d)"><path d="M0 -20 L16 16 L0 8 L-16 16 Z" fill="#2563EB" stroke="#1E3A8A" stroke-width="2" stroke-linejoin="round"/></g>' % (cx, cy, rot)
    s += '<text x="%.0f" y="%.0f" font-size="10" font-weight="800" fill="#1E3A8A" text-anchor="middle">KAREL</text>' % (cx, cy + 32)
    for (tx, ty, t) in (labels or []): s += '<text x="%.0f" y="%.0f" font-size="10.5" font-weight="700" fill="#374151">%s</text>' % (tx, ty, esc(t))
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H, s), caption)

def part(tag, title, body): return '<section class="part"><div class="part-head"><span class="part-tag">%s</span><h2>%s</h2></div><div class="wrap">%s</div></section>' % (tag, title, body)
def page(title, deck, parts): return '<html><body><h1>%s</h1><p class="deck">%s</p>%s</body></html>' % (title, deck, "".join(parts))
def ul(*items): return "<ul>%s</ul>" % "".join("<li>%s</li>" % i for i in items)
def table(head, rows): return '<div class="tblwrap"><table class="cmp"><tr>%s</tr>%s</table></div>' % ("".join("<th>%s</th>" % h for h in head), "".join("<tr>%s</tr>" % "".join("<td>%s</td>" % c for c in r) for r in rows))
def code(t): return '<div class="code">%s</div>' % esc(t)
def ex(t): return '<div class="example">%s</div>' % t
def warn(t): return '<div class="warn">%s</div>' % t
def tip(t): return '<div class="hint-panel">%s</div>' % t
def exam(*items): return part("AP", "On the AP Exam", ul(*items))

def basics():
    return page("Meet Karel", "Karel is a robot in a grid world. You write the instructions, and Karel follows them exactly, one at a time.", [
        part("01", "What Is Programming?", "<p>A <b>program</b> is a list of instructions written in a language a computer can run. An <b>algorithm</b> is the plan behind it: the steps that solve a problem. Computers do exactly what the instructions say, so the instructions have to be exact.</p>" + table(["Word", "Meaning"], [["Algorithm", "the steps that solve a problem"], ["Program", "an algorithm written in a programming language"], ["Command", "one instruction, like <code>move()</code>"], ["Syntax", "the spelling and punctuation rules of the language"], ["Bug", "a mistake that makes the program do the wrong thing"]])),
        part("02", "Karel's World", "<p>Karel lives on a grid. Columns are <b>avenues</b> and rows are <b>streets</b>. Karel faces one of four directions, can carry balls (tennis balls), and cannot walk through a wall.</p>" + table(["Command", "What Karel does"], [["<code>move()</code>", "steps forward one square. A wall in front causes an error."], ["<code>turn_left()</code>", "turns 90 degrees to the left without moving"], ["<code>put_ball()</code>", "drops one ball on the current square"], ["<code>take_ball()</code>", "picks up one ball. No ball causes an error."]]) + ex("Karel has <b>no</b> <code>turn_right()</code> in basic Karel. Three left turns make one right turn.")),
        part("03", "Sequencing", "<p>Commands run <b>in order, top to bottom</b>, one at a time. This is <b>sequencing</b>. Changing the order changes the result.</p>" + code("move()\nmove()\nturn_left()\nmove()\nput_ball()") + warn("Karel cannot read your mind. If a command is missing, Karel does not do it.")),
        exam("A program is built from <b>sequencing</b>, <b>selection</b>, and <b>iteration</b>.", "Instructions run in order, so the order matters.", "An <b>algorithm</b> is the idea. A <b>program</b> is the algorithm in code.")])

def functions():
    return page("Functions and Design", "Teach Karel a new command once, then use it as many times as you like. Break big problems into small ones.", [
        part("01", "Defining and Calling", "<p>A <b>function</b> is a named group of commands. You <b>define</b> it once with <code>def</code>. Defining does not run it. You <b>call</b> it by writing its name, and that runs it.</p>" + ex("Karel cannot turn right, so teach it: <code>def turn_right():</code> then three <code>turn_left()</code> lines indented underneath.") + warn("Defining a function does nothing until you call it. Forgetting the call is the most common mistake.")),
        part("02", "Top-Down Design", "<p>Start with the big goal, then split it into smaller steps, then split those, until every step is one command you already have. This is <b>decomposition</b>.</p>" + ul("Write the big task as a few function calls.", "Write each function by splitting it into smaller functions.", "Test each small piece before the whole program.") + tip("Functions with good names read like a plan: <code>build_tower()</code> is clearer than twelve move and turn lines.")),
        part("03", "Comments and Abstraction", "<p>A <b>comment</b> starts with <code>#</code> and is ignored by the computer. It is for people. <b>Abstraction</b> means hiding the details behind a name: you use <code>turn_around()</code> without thinking about the two turns inside it.</p>" + table(["Idea", "Why it helps"], [["Comments", "explain WHY the code does something"], ["Functions", "remove repeated code and give steps a name"], ["Abstraction", "lets you think about the big picture"], ["Decomposition", "makes a hard problem a set of easy ones"]])),
        part("04", "Super Karel", "<p><b>Super Karel</b> already knows <code>turn_right()</code> and <code>turn_around()</code>, so you do not have to define them yourself. It is the same Karel with a bigger vocabulary.</p>"),
        exam("A <b>procedure</b> (function) gives a name to a sequence of commands. Calling it runs those commands.", "<b>Abstraction</b> manages complexity by hiding details.", "Functions reduce repeated code, which makes programs shorter and easier to fix.", "<b>Comments</b> are ignored when the program runs.")])

def loops():
    return page("Loops", "Repetition is the power of a computer. Tell Karel to repeat instead of typing the same line again and again.", [
        part("01", "For Loops", "<p>A <b>for loop</b> repeats a block a <b>fixed number of times</b>. Use it when you know the count before you start.</p>" + code("for i in range(4):\n    move()\n    put_ball()") + ex("<code>range(4)</code> means four repeats. The indented lines are the loop body.")),
        part("02", "While Loops", "<p>A <b>while loop</b> repeats <b>as long as a condition is true</b>. Use it when you do not know how many steps it will take.</p>" + code("while front_is_clear():\n    move()") + warn("If the condition never becomes false, the loop never ends. That is an <b>infinite loop</b>. Make sure something inside the loop can change the condition.")),
        part("03", "For or While?", table(["Question", "Use"], [["Do I know exactly how many times?", "for loop"], ["Do I repeat until something is true or false?", "while loop"], ["Walk to the wall, however far it is", "while front_is_clear()"], ["Put down exactly five balls", "for loop, range(5)"]])),
        exam("<b>Iteration</b> repeats code. It can be a fixed count or depend on a condition.", "A loop that never stops is an <b>infinite loop</b>.", "Trace loops one pass at a time, writing down Karel's position.")])

def decisions():
    return page("Decisions", "Karel can look at the world and choose what to do. This is selection.", [
        part("01", "Conditions", "<p>A <b>condition</b> is a question with a true or false answer. Karel can ask about what it sees.</p>" + table(["Condition", "True when"], [["<code>front_is_clear()</code>", "there is no wall in front"], ["<code>left_is_clear()</code> / <code>right_is_clear()</code>", "no wall on that side"], ["<code>ball_present()</code>", "there is a ball on this square"]]) + tip("Karel does not have to move to ask a question. Asking costs nothing.")),
        part("02", "If and If/Else", "<p>An <b>if</b> runs its block only when the condition is true. Add <b>else</b> to do something different when it is false.</p>" + code("if ball_present():\n    take_ball()\nelse:\n    put_ball()") + ex("Exactly one of the two branches runs each time. With if alone, nothing happens when the condition is false.")),
        part("03", "Putting It Together", "<p>The three building blocks combine. A common pattern is a <b>while</b> loop that walks to a wall with an <b>if</b> inside that checks every square.</p>" + code("while front_is_clear():\n    if ball_present():\n        take_ball()\n    move()")),
        exam("<b>Selection</b> chooses which code runs based on a condition.", "A condition evaluates to <b>true or false</b>.", "Combine sequencing, selection, and iteration to build any algorithm.")])

def debugging():
    return page("Debugging and Algorithms", "Every programmer writes bugs. What matters is finding them quickly.", [
        part("01", "Kinds of Errors", table(["Kind", "What happens", "Karel example"], [["Syntax error", "the program will not run", "missing colon or parenthesis"], ["Runtime error", "crashes while running", "move() into a wall"], ["Logic error", "runs, wrong result", "the loop stops one square short"]])),
        part("02", "Debugging Strategies", ul("Read the error message and the line number.", "Trace the program by hand, one command at a time.", "Test small pieces separately.", "Add or remove one change at a time.", "Explain the code out loud, line by line.") + warn("Do not change code at random. Each change should test one idea.")),
        part("03", "Algorithms", "<p>An <b>algorithm</b> is a clear, step-by-step method. Good algorithms are <b>correct</b>, <b>precise</b>, and <b>finish</b>. Two different algorithms can solve the same problem: one may be shorter or faster.</p>"),
        exam("Know the three error kinds: <b>syntax</b>, <b>runtime</b>, <b>logic</b>.", "Tracing code by hand is the best debugging tool, on the exam and off it.", "Different algorithms can solve the same problem.")])

def collaboration():
    return page("Paired Programming and Collaboration", "Programmers rarely work alone. Pair programming is a skill with two roles that switch.", [
        part("01", "Two Roles", table(["Role", "Job"], [["Driver", "types the code and talks through what they are doing"], ["Navigator", "reads, thinks ahead, spots mistakes, asks questions"]]) + tip("Switch roles often. Both people should understand every line.")),
        part("02", "Creation and Reflection", ul("<b>Create</b> something together and give each other credit.", "<b>Reflect</b>: what worked, what did not, what would you change?", "Write down what each person contributed.")),
        part("03", "The AP Audit Checklist", "<p>Before you submit, check that the work is your own, that every part is documented, and that sources are credited.</p>" + ul("Does the program run and do what it claims?", "Are the comments clear?", "Did you credit any code or help you used?", "Can you explain every line?")),
        exam("Collaboration brings different <b>perspectives</b> and catches mistakes sooner.", "Credit others' work. Documentation helps everyone understand a program.")])

PAGES = {"basics": basics, "functions": functions, "loops": loops, "decisions": decisions, "debugging": debugging, "collaboration": collaboration}
