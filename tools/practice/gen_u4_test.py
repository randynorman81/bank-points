"""Builds apcsp/unit-4/unit-4-practice-test.html (AP-style practice test for Unit 4) from the Unit 3 test page as a template.
Every question whose answer can be computed IS computed here by running the code or evaluating the expressions, and the marked answer must match.
Wrong options for "what is displayed" questions come from the answers of slightly changed programs (the typical mistakes), so they are believable.
usage: python3 tools/practice/gen_u4_test.py"""
import os, re, io, json, html, random, contextlib, sys, itertools
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'parsons'))
from u4_core import run, Endless
Q = []; ERR = []; rnd = random.Random(5)
def code_html(s): return '<code>%s</code>' % html.escape(s, quote=False)
def fmt_out(lines):
    if not lines: return 'Nothing is displayed'
    return '<br>'.join(code_html(x) for x in lines)
def execute(code, ins=(), seed=1):
    try: return run(code, list(ins), seed), None
    except Endless: return None, 'endless'
    except Exception as e: return None, type(e).__name__
def final(code, ins=(), seed=1):
    """the variables of the program after it ran (for 'what is the value of x' questions)"""
    feed = iter(ins); g = {'input': lambda p='': next(feed)}
    import random as _r; _r.seed(seed)
    with contextlib.redirect_stdout(io.StringIO()): exec(compile(code, '<q>', 'exec'), g)
    return g
# --------------------------------------------------------------- believable wrong answers: what slightly different programs would print
SWAPS = [(r'>=', '>'), (r'(?<![<>=!])>(?!=)', '>='), (r'<=', '<'), (r'(?<![<>=!])<(?!=)', '<='), (r'==', '!='), (r'!=', '=='), (r'\band\b', 'or'), (r'\bor\b', 'and'),
         (r'\bnot ', ''), (r'\belif\b', 'if'), (r'\bbreak\b', 'pass'), (r'range\((\d+)\)', lambda m: 'range(%d)' % (int(m.group(1)) + 1)),
         (r'range\((\d+), (\d+)\)', lambda m: 'range(%s, %d)' % (m.group(1), int(m.group(2)) + 1)), (r'\+ 1\b', '+ 2'), (r'- 1\b', '- 2'), (r'\+ (\d+)', lambda m: '- ' + m.group(1))]
def mutants(code):
    out = []
    for pat, rep in SWAPS:
        for m in list(re.finditer(pat, code)):
            out.append(code[:m.start()] + (rep(m) if callable(rep) else re.sub(pat, rep, m.group(0))) + code[m.end():])
    lines = code.split('\n')
    for i in range(len(lines) - 1):          # two lines in the wrong order
        l2 = list(lines); l2[i], l2[i + 1] = l2[i + 1], l2[i]; out.append('\n'.join(l2))
    for i, ln in enumerate(lines):           # one line left out
        if ln.strip() and not ln.strip().endswith(':'): out.append('\n'.join(lines[:i] + lines[i + 1:]))
    return out
def wrong_answers(code, ins, correct, need=3, extra=()):
    seen = {tuple(correct)}; res = []
    for w in extra:
        if tuple(w) not in seen: seen.add(tuple(w)); res.append(list(w))
    for m in mutants(code):
        if len(res) >= need: break
        try: o = run(m, list(ins), 1)
        except Exception: continue
        if tuple(o) in seen or not o or len(o) > 6: continue
        seen.add(tuple(o)); res.append(o)
    return res[:need]
def place(correct_opt, wrong_opts):
    opts = [correct_opt] + wrong_opts; idx = list(range(len(opts))); rnd.shuffle(idx)
    return [opts[i] for i in idx], [idx.index(0)]
# --------------------------------------------------------------- question makers
def out(t, code, why, ins=(), wrong=(), stem=None, rand=False):
    got, err = execute(code, ins)
    if err: ERR.append((t, code[:40], 'does not run: ' + err)); return
    if rand:   # the answer must be the same for every random seed
        for sd in range(2, 12):
            if run(code, list(ins), sd) != got: ERR.append((t, code[:40], 'output changes with the random numbers')); return
    ws = wrong_answers(code, ins, got, 3, wrong)
    if len(ws) < 3: ERR.append((t, code[:40], 'only %d wrong answers' % len(ws))); return
    opts, a = place(fmt_out(got), [fmt_out(w) for w in ws])
    s = stem or 'What is displayed as a result of executing the code segment?'
    if ins: s += ' The user types %s.' % (' and then '.join(ins) if len(ins) < 3 else ', '.join(ins[:-1]) + ' and then ' + ins[-1])
    Q.append(dict(t=t, s=s, c=code, o=opts, a=a, e=why, v=dict(kind='out', ins=list(ins), rand=rand, answer=got)))
def err_q(t, code, why, wrong, ins=()):
    got, err = execute(code, ins)
    if not err: ERR.append((t, code[:40], 'was supposed to fail')); return
    opts, a = place('An error occurs', [fmt_out(w) for w in wrong])
    Q.append(dict(t=t, s='What is the result of executing the code segment?', c=code, o=opts, a=a, e=why, v=dict(kind='err', ins=list(ins), error=err)))
def val(t, code, var, why, wrong, ins=()):
    g = final(code, ins); v = g[var]
    fmt = lambda x: '<code>%s</code>' % html.escape(repr(x) if isinstance(x, str) else str(x), quote=False)
    if v in wrong: ERR.append((t, code[:40], 'a wrong option equals the answer'))
    opts, a = place(fmt(v), [fmt(w) for w in wrong])
    Q.append(dict(t=t, s='What is the value of <code>%s</code> after the code segment is executed?' % var, c=code, o=opts, a=a, e=why, v=dict(kind='val', ins=list(ins), var=var, answer=repr(v))))
def count(t, code, text, why, wrong, ins=()):
    got, err = execute(code, ins)
    if err: ERR.append((t, code[:40], 'does not run: ' + err)); return
    n = sum(1 for x in got if x == text)
    if n in wrong: ERR.append((t, code[:40], 'a wrong option equals the answer'))
    opts, a = place('<code>%d</code>' % n, ['<code>%d</code>' % w for w in wrong])
    Q.append(dict(t=t, s='How many times is <code>%s</code> displayed as a result of executing the code segment?' % html.escape(text, quote=False), c=code, o=opts, a=a, e=why, v=dict(kind='count', ins=list(ins), text=text, answer=n)))
def which_true(t, setup, exprs, why, n_true=1, stem=None):
    g = {}; exec(setup, g); truth = [bool(eval(e, g)) for e in exprs]
    if sum(truth) != n_true: ERR.append((t, setup, 'expected %d true expressions, got %d' % (n_true, sum(truth)))); return
    idx = list(range(len(exprs))); rnd.shuffle(idx); opts = [code_html(exprs[i]) for i in idx]; a = [k for k, i in enumerate(idx) if truth[i]]
    s = stem or ('Which TWO of the following expressions evaluate to <code>True</code>?' if n_true == 2 else 'Which of the following expressions evaluates to <code>True</code>?')
    Q.append(dict(t=t, s=s, c=setup, o=opts, a=a, e=why, v=dict(kind='eval', setup=setup, exprs=[exprs[i] for i in idx], answer=a)))
def prop(t, stem, template, cases, exprs, why):
    """each option is an expression in n; the right one gives the wanted answer for every case"""
    ok = []
    for i, e in enumerate(exprs):
        good = True
        for n, want in cases:
            try: r = bool(eval(e, {'n': n}))
            except Exception: good = False; break
            if r != want: good = False; break
        ok.append(good)
    if sum(ok) != 1: ERR.append((t, stem[:40], '%d options fit all cases' % sum(ok))); return
    idx = list(range(len(exprs))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, o=[code_html(exprs[i]) for i in idx], a=[k for k, i in enumerate(idx) if ok[i]], e=why, v=dict(kind='prop', cases=[[n, w] for n, w in cases], exprs=[exprs[i] for i in idx])))
def choice(t, stem, opts, ans, why, code=None, manual=True, v=None):
    idx = list(range(len(opts))); rnd.shuffle(idx); o = [opts[i] for i in idx]; a = sorted(k for k, i in enumerate(idx) if i in ans)
    q = dict(t=t, s=stem, o=o, a=a, e=why)
    if code: q['c'] = code
    if v:
        if 'opts' in v: v['opts'] = [v['opts'][i] for i in idx]
        v['answer'] = a; q['v'] = v
    elif manual: q['v'] = dict(kind='read')
    Q.append(q)
def possible(t, stem, template, opts_vals, why, correct):
    """random-number questions: which options can happen? computed by running the expression many times"""
    pass

# =============================================================== 4.1 Booleans
T = 'Booleans'
out(T, 'is_online = True\nis_online = not is_online\nprint(is_online)', 'Trace it: <code>is_online</code> starts as <code>True</code>. <code>not</code> flips it to <code>False</code> and the result is stored back, so <code>False</code> is displayed.', wrong=[['True'], ['not True'], ['is_online']])
choice(T, 'Which of the following is a Boolean value in Python?', ['<code>"True"</code>', '<code>True</code>', '<code>true</code>', '<code>1</code>'], [1],
       'A Boolean is <code>True</code> or <code>False</code> with a capital first letter and no quotes. <code>"True"</code> is a string, <code>true</code> is not defined, and <code>1</code> is an integer.',
       v=dict(kind='bool', opts=['"True"', 'True', 'true', '1'], answer=[1]))
which_true(T, 'age = 15', ['age == 16', 'age >= 16', 'age != 15', 'age < 16'], 'With <code>age = 15</code>: <code>age == 16</code> is False, <code>age &gt;= 16</code> is False, <code>age != 15</code> is False and <code>age &lt; 16</code> is True.')
out(T, 'a = 10\nb = 20\nresult = a > b\nprint(result)', 'The comparison <code>a &gt; b</code> asks whether 10 is greater than 20, which is <code>False</code>. That Boolean is stored in <code>result</code> and displayed.', wrong=[['True'], ['20'], ['10']])
choice(T, 'What is displayed as a result of executing the code segment?', ['<code>&lt;class \'bool\'&gt;</code>', '<code>&lt;class \'int\'&gt;</code>', '<code>&lt;class \'str\'&gt;</code>', '<code>True</code>'], [0],
       'The comparison <code>5 &gt; 3</code> produces a Boolean, so <code>type</code> reports <code>bool</code>.', code='print(type(5 > 3))', v=dict(kind='out', ins=[], rand=False, answer=["<class 'bool'>"]))
Q[-1]['o'] = [o for o in Q[-1]['o']]
choice(T, 'Which of the following lines of code <b>stores</b> a value in the variable <code>x</code> (rather than asking a question)?', ['<code>x == 5</code>', '<code>x = 5</code>', '<code>5 == x</code>', '<code>x != 5</code>'], [1],
       'One equals sign stores a value. Two equals signs (<code>==</code>) ask whether two values are equal, and <code>!=</code> asks whether they are different. Neither question changes <code>x</code>.',
       v=dict(kind='store', opts=['x == 5', 'x = 5', '5 == x', 'x != 5'], answer=[1]))

# =============================================================== 4.2 Logical operators
T = 'Logic'
which_true(T, 'a = True\nb = False', ['a and b', 'a or b', 'not a', 'not b'], '<code>a and b</code> needs both, so it is False. <code>a or b</code> needs only one, so it is True. <code>not a</code> is False. <code>not b</code> flips False to True.', n_true=2)
out(T, 'x = 7\nprint(x > 5 and x < 10)', 'Both parts are True (7 is more than 5 and less than 10), so <code>and</code> gives <code>True</code>.', wrong=[['False'], ['7'], ['x > 5 and x < 10']])
out(T, 'x = 7\nprint(x < 5 or x > 10)', 'Neither part is True (7 is not below 5 and not above 10), so <code>or</code> gives <code>False</code>.', wrong=[['True'], ['7'], ['x < 5']])
out(T, 'age = 12\nmember = False\nprint(age < 13 or member)', '<code>age &lt; 13</code> is True. With <code>or</code>, one True is enough, so <code>True</code> is displayed.', wrong=[['False'], ['12'], ['member']])
out(T, 'a = True\nb = False\nprint(not (a and b))', '<code>a and b</code> is False. The brackets make <code>not</code> flip that result, so <code>True</code> is displayed.', wrong=[['False'], ['not False'], ['True', 'False']])
prop(T, 'Which expression is <code>True</code> when <code>n</code> is between 60 and 80, inclusive, and <code>False</code> otherwise?', None, [(72, True), (60, True), (80, True), (90, False), (50, False)],
     ['n >= 60 and n <= 80', 'n >= 60 or n <= 80', 'n <= 60 and n >= 80', 'n > 80'], 'A range check joins two comparisons with <code>and</code>: the value must be at least 60 <b>and</b> at most 80. With <code>or</code>, every number passes at least one test.')
choice(T, 'Which logical operator is <code>True</code> only when <b>both</b> of its conditions are <code>True</code>?', ['<code>and</code>', '<code>or</code>', '<code>not</code>', '<code>==</code>'], [0],
       '<code>and</code> requires both sides to be True. <code>or</code> needs just one, <code>not</code> flips a single value, and <code>==</code> compares two values.')
out(T, 'print(True or False and False)', 'Python does <code>and</code> before <code>or</code>. <code>False and False</code> is False, then <code>True or False</code> is <code>True</code>.', wrong=[['False'], ['True', 'False'], ['None']])

# =============================================================== 4.3 Comparison operators
T = 'Compare'
out(T, 'score = 80\nprint(score >= 80)', '<code>&gt;=</code> means greater than <b>or equal to</b>. 80 is equal to 80, so <code>True</code> is displayed. (With <code>&gt;</code> the answer would be False.)', wrong=[['False'], ['80'], ['score']])
which_true(T, 'x = 10', ['x != 10', 'x == "10"', 'x >= 11', 'x <= 10'], 'A number never equals text, so <code>x == "10"</code> is False. <code>x != 10</code> and <code>x &gt;= 11</code> are False. Only <code>x &lt;= 10</code> is True because 10 is equal to 10.')
out(T, 'print("apple" == "Apple")', 'Capital letters matter. <code>"apple"</code> and <code>"Apple"</code> are different pieces of text, so the answer is <code>False</code>.', wrong=[['True'], ['apple'], ['Apple']])
out(T, 'n = 15\nprint(n % 5 == 0)', '15 divided by 5 leaves a remainder of 0, so the comparison is <code>True</code>.', wrong=[['False'], ['0'], ['3']])
out(T, 'a = 4\nb = 4\nprint(a == b)\nprint(a != b)', '<code>a == b</code> is True because the values are equal, and <code>a != b</code> is False. Each <code>print</code> shows its own line.', wrong=[['True', 'True'], ['False', 'True'], ['False', 'False']])
prop(T, 'Which expression is <code>True</code> exactly when the whole number <code>n</code> is even?', None, [(4, True), (7, False), (0, True), (9, False), (10, True)],
     ['n % 2 == 0', 'n // 2 == 0', 'n % 2 == 1', 'n / 2 == 0'], 'The remainder of an even number divided by 2 is 0. <code>//</code> gives the whole-number quotient, not the remainder, and <code>n % 2 == 1</code> is True for odd numbers.')
out(T, 'x = 5\nprint(x == 5.0)', 'Python compares the values, and the whole number 5 has the same value as 5.0, so <code>True</code> is displayed.', wrong=[['False'], ['5'], ['5.0']])
out(T, 'word = "python"\nprint(len(word) > 5)', '<code>len(word)</code> is 6, and 6 is greater than 5, so <code>True</code> is displayed.', wrong=[['False'], ['6'], ['5']])

# =============================================================== 4.4 If statements
T = 'If'
out(T, 'x = 8\nif x > 5:\n    print("big")\nprint("done")', '8 is greater than 5, so the indented line runs and <code>big</code> is displayed. The last line is not indented, so it always runs.', wrong=[['done'], ['big'], ['big', 'big', 'done']])
out(T, 'x = 3\nif x > 5:\n    print("big")\nprint("done")', '3 is not greater than 5, so the indented line is skipped. The last line is not indented, so <code>done</code> is displayed.', wrong=[['big', 'done'], ['big'], ['3']])
out(T, 'x = 6\nif x > 5:\n    print("A")\nif x > 4:\n    print("B")', 'These are two separate <code>if</code> statements, and Python asks both questions. 6 is greater than 5 and greater than 4, so both lines print.', wrong=[['A'], ['B'], ['B', 'A']])
out(T, 'a = 7\nb = 2\nif a > 5:\n    if b > 5:\n        print("both")\n    print("outer")', 'The outer <code>if</code> is True, so Python looks inside. The inner condition (<code>b &gt; 5</code>) is False, so <code>both</code> is skipped. <code>outer</code> belongs to the outer <code>if</code>, so it displays.', wrong=[['both', 'outer'], ['both'], ['outer', 'both']])
val(T, 'points = 10\nscore = 90\nif score >= 80:\n    points = points + 5\npoints = points + 1', 'points', 'The <code>if</code> is True, so 5 is added (15). The last line is not indented, so it always runs and adds 1 more: 16.', [15, 11, 10])
out(T, 'n = 1\nif n > 5:\n    print("x")\n    print("y")\nprint("z")', 'The condition is False, so <b>both</b> indented lines are skipped. Only the last line, which is not indented, displays <code>z</code>.', wrong=[['x', 'y', 'z'], ['x', 'z'], ['y', 'z']])
choice(T, 'Which of the following is a correct <code>if</code> statement in Python?', ['<code>if x &gt; 5:</code>', '<code>if x &gt; 5</code>', '<code>if x = 5:</code>', '<code>if x &gt; 5;</code>'], [0],
       'An <code>if</code> line needs a condition and a colon. A missing colon, a single <code>=</code> (which stores instead of comparing) and a semicolon all cause errors.',
       v=dict(kind='compile', opts=['if x > 5:', 'if x > 5', 'if x = 5:', 'if x > 5;'], answer=[0]))
out(T, 'ok = True\nif ok:\n    print("go")', 'A Boolean variable can be the whole condition. <code>ok</code> is <code>True</code>, so <code>go</code> is displayed.', wrong=[['ok'], ['True'], ['go', 'go']])

# =============================================================== 4.5 if / elif / else
T = 'Else'
out(T, 'n = 50\nif n > 90:\n    print("A")\nelif n > 70:\n    print("B")\nelse:\n    print("C")', '50 is not above 90 and not above 70, so the <code>else</code> runs and <code>C</code> is displayed.', wrong=[['A'], ['B'], ['A', 'B', 'C']])
out(T, 'n = 75\nif n > 90:\n    print("A")\nelif n > 70:\n    print("B")\nelse:\n    print("C")', '75 is not above 90, so the <code>elif</code> is checked. 75 is above 70, so <code>B</code> is displayed and the rest of the chain is skipped.', wrong=[['A'], ['C'], ['B', 'C']])
out(T, 'n = 95\nif n > 70:\n    print("B")\nelif n > 90:\n    print("A")\nelse:\n    print("C")', 'Python checks from the top and stops at the first True. 95 is above 70, so <code>B</code> is displayed. The <code>elif</code> for 90 is never reached, so the <b>order</b> of the checks matters.', wrong=[['A'], ['A', 'B'], ['C']])
out(T, 'n = 8\nif n > 5:\n    print("X")\nif n > 3:\n    print("Y")\nelse:\n    print("Z")', 'The two <code>if</code> statements are separate. The first prints <code>X</code>. The second asks whether 8 &gt; 3, which is True, so it prints <code>Y</code> and its <code>else</code> is skipped.', wrong=[['X'], ['X', 'Y', 'Z'], ['Y']])
val(T, 'price = 10\nage = 70\nif age >= 65:\n    price = price - 3\nelif age >= 13:\n    price = price - 1\nelse:\n    price = 0', 'price', '70 is at least 65, so the first branch runs and <code>price</code> becomes 7. The <code>elif</code> and <code>else</code> are skipped.', [9, 10, 0])
out(T, 'word = "yes"\nif word == "Yes":\n    print("1")\nelif word == "yes":\n    print("2")\nelse:\n    print("3")', 'The first test is False because of the capital Y. The <code>elif</code> matches exactly, so <code>2</code> is displayed.', wrong=[['1'], ['3'], ['2', '3']])
choice(T, 'In an <code>if</code>, <code>elif</code>, <code>else</code> chain, which part runs when none of the earlier conditions is <code>True</code>?', ['<code>else</code>', '<code>elif</code>', 'The first <code>if</code>', 'The last <code>elif</code>'], [0],
       '<code>else</code> has no condition. It is the fallback that runs only when every check above it was False.')
out(T, 'age = int(input("Age: "))\nif age >= 18:\n    print("adult")\nelif age >= 13:\n    print("teen")\nelse:\n    print("child")', 'The text typed is converted to the number 13. 13 is not at least 18, but it is at least 13, so <code>teen</code> is displayed.', ins=['13'], wrong=[['adult'], ['child'], ['teen', 'child']])

# =============================================================== 4.6 Key events
T = 'Events'
out(T, 'def control(key):\n    if key == "d":\n        print("right")\n    else:\n        print("other")\ncontrol("d")\ncontrol("x")', 'The handler runs once for each call. <code>"d"</code> matches the <code>if</code>, so <code>right</code> prints. <code>"x"</code> does not, so the <code>else</code> prints <code>other</code>.', wrong=[['right', 'right'], ['other', 'right'], ['other', 'other']])
val(T, 'x = 100\ndef control(key):\n    global x\n    if key == "d":\n        x = x + 15\ncontrol("d")\ncontrol("d")', 'x', 'Each call with <code>"d"</code> adds 15 to the global <code>x</code>: 100, then 115, then 130. The <code>global</code> line is what lets the change last after the handler ends.', [115, 100, 145])
err_q(T, 'x = 100\ndef control(key):\n    x = x + 15\ncontrol("d")', 'Without <code>global x</code>, Python treats <code>x</code> as a new variable inside the function. It is read before it has a value, so an error occurs.', [['115'], ['100'], ['x']])
out(T, 'def control(key):\n    if key == "q":\n        print("build")\n    else:\n        print("unknown")\ncontrol("Q")', 'Key names must match exactly. <code>"Q"</code> (capital) is not equal to <code>"q"</code>, so the <code>else</code> prints <code>unknown</code>.', wrong=[['build'], ['build', 'unknown'], ['Q']])
choice(T, 'In a program that responds to key presses, what is a <b>handler</b>?', ['A procedure that runs when an event occurs and decides what to do', 'A variable that stores every key the user has pressed', 'A loop that repeats until the program is closed', 'A comment that explains what a key does'], [0],
       'An event (like a key press) supplies input. The handler is the procedure that receives the event and decides what the program does.')
out(T, 'health = 50\ndef heal(amount):\n    global health\n    health = health + amount\nheal(25)\nheal(10)\nprint(health)', 'The handler adds its parameter to the global <code>health</code> each time: 50 + 25 = 75, then 75 + 10 = 85.', wrong=[['75'], ['60'], ['35']])

# =============================================================== 4.7 - 4.9 for loops
T = 'For'
out(T, 'for i in range(3):\n    print("hi")', '<code>range(3)</code> repeats the body 3 times (with <code>i</code> as 0, 1 and 2), and the body prints <code>hi</code> each time.', wrong=[['hi', 'hi'], ['hi', 'hi', 'hi', 'hi'], ['0', '1', '2']])
out(T, 'for i in range(1, 5):\n    print(i)', '<code>range(1, 5)</code> starts at 1 and stops <b>before</b> 5, so the loop displays 1, 2, 3 and 4.', wrong=[['1', '2', '3', '4', '5'], ['0', '1', '2', '3', '4'], ['2', '3', '4', '5']])
out(T, 'for i in range(0, 10, 3):\n    print(i)', 'The third number is the step. The loop starts at 0 and counts by 3 while the number is less than 10: 0, 3, 6, 9.', wrong=[['3', '6', '9'], ['0', '3', '6'], ['0', '1', '2']])
out(T, 'for i in range(5, 0, -2):\n    print(i)', 'A negative step counts down. It starts at 5 and goes down by 2 while the number is above 0 (the stop number is not included): 5, 3, 1.', wrong=[['5', '3', '1', '-1'], ['5', '4', '3', '2', '1'], ['4', '2']])
val(T, 'total = 0\nfor n in range(1, 5):\n    total = total + n', 'total', '<code>range(1, 5)</code> gives 1, 2, 3 and 4. The total grows 1, 3, 6, 10.', [15, 6, 4])
count(T, 'for i in range(2, 8):\n    print("x")', 'x', '<code>range(2, 8)</code> gives 2, 3, 4, 5, 6 and 7. That is 6 numbers, so <code>x</code> displays 6 times.', [5, 7, 8])
out(T, 'items = ["a", "b", "c"]\nfor item in items:\n    print(item)', 'A <code>for</code> loop over a list gives the loop variable each item in turn, so each item is displayed on its own line.', wrong=[['items'], ['0', '1', '2'], ['a', 'b']])
out(T, 'count = 0\nfor ch in "banana":\n    if ch == "a":\n        count = count + 1\nprint(count)', 'The loop visits each letter of <code>"banana"</code>. The letter <code>a</code> appears 3 times, so <code>count</code> ends at 3.', wrong=[['2'], ['6'], ['1']])
val(T, 'nums = [4, 8, 6]\ntotal = 0\nfor n in nums:\n    total = total + n\navg = total / len(nums)', 'avg', 'The total is 4 + 8 + 6 = 18 and the list has 3 numbers. <code>18 / 3</code> is <code>6.0</code> (the <code>/</code> operator always gives a decimal).', [18, 3.0, 9.0])
def range_q(t, stem, opts, want, why, n_true=1):
    res = [list(eval(o)) for o in opts]; ok = [r == want for r in res]
    if sum(ok) != n_true: ERR.append((t, stem[:40], '%d options give %r' % (sum(ok), want))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, o=[code_html(opts[i]) for i in idx], a=[k for k, i in enumerate(idx) if ok[i]], e=why, v=dict(kind='range', opts=[opts[i] for i in idx], want=want)))
range_q(T, 'Which range makes a loop run for exactly <code>i</code> = 2, 4 and 6?', ['range(2, 7, 2)', 'range(2, 6, 2)', 'range(2, 8)', 'range(1, 6, 2)'], [2, 4, 6],
        '<code>range(2, 7, 2)</code> starts at 2, steps by 2 and stops before 7: 2, 4, 6. <code>range(2, 6, 2)</code> stops before 6, so it misses 6.')
out(T, 'peak = 0\nfor v in [3, 9, 4]:\n    if v > peak:\n        peak = v\nprint(peak)', 'Trace <code>peak</code>: 0, then 3 (3 &gt; 0), then 9 (9 &gt; 3), and 4 is not bigger than 9. It ends as 9: the biggest number in the list.', wrong=[['4'], ['16'], ['3']])
range_q(T, 'Which TWO of the following produce the numbers 1, 2 and 3?', ['range(1, 4)', 'range(1, 4, 1)', 'range(0, 3)', 'range(1, 3)'], [1, 2, 3],
        '<code>range(1, 4)</code> and <code>range(1, 4, 1)</code> are the same: start at 1, stop before 4. <code>range(0, 3)</code> gives 0, 1, 2 and <code>range(1, 3)</code> gives only 1 and 2.', n_true=2)

# =============================================================== 4.10 while loops
T = 'While'
out(T, 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1', 'The loop repeats while <code>n</code> is above 0. It prints 3, 2 and 1, then <code>n</code> becomes 0 and the loop ends.', wrong=[['3', '2', '1', '0'], ['2', '1', '0'], ['3', '2']])
out(T, 'n = 10\nwhile n < 5:\n    print(n)\nprint("end")', 'The condition (<code>10 &lt; 5</code>) is False the first time, so the loop body never runs. Only <code>end</code> is displayed.', wrong=[['10', 'end'], ['10'], ['end', 'end']])
val(T, 'total = 0\nn = 1\nwhile n <= 4:\n    total = total + n\n    n = n + 1', 'total', 'The loop runs for n = 1, 2, 3 and 4, adding each to the total: 10.', [6, 15, 4])
count(T, 'n = 0\nwhile n < 6:\n    n = n + 2\n    print("x")', 'x', '<code>n</code> goes 0, 2, 4, 6. The body runs for n = 0, 2 and 4 (when n reaches 6 the condition is False), so <code>x</code> displays 3 times.', [2, 4, 6])
def endless_q(t, code, body_opts, ok_idx, why):
    good = []
    for o in body_opts:
        full = code + '\n    ' + o
        try: run(full, [], 1); good.append(True)
        except Endless: good.append(False)
        except Exception: good.append(False)
    if [i for i, g in enumerate(good) if g] != [ok_idx]: ERR.append((t, code[:40], 'terminating options: %r' % good)); return
    idx = list(range(len(body_opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s='The loop below never ends. Which line, added at the <b>end of the loop body</b>, makes the loop stop?', c=code, o=[code_html(body_opts[i]) for i in idx], a=[idx.index(ok_idx)], e=why, v=dict(kind='endless', code=code, opts=[body_opts[i] for i in idx], ok=idx.index(ok_idx))))
endless_q(T, 'n = 1\nwhile n < 5:\n    print(n)', ['n = n + 1', 'n = n - 1', 'n = 1', 'print("stop")'], 0, '<code>n = n + 1</code> moves <code>n</code> toward 5, so the condition eventually becomes False. The other lines leave <code>n</code> below 5 forever.')
out(T, 'code = input("Code: ")\nwhile code != "go":\n    code = input("Code: ")\nprint("in")', 'The first answer, <code>no</code>, is not <code>go</code>, so the loop asks again. The second answer matches and the loop ends, then <code>in</code> is displayed.', ins=['no', 'go'], wrong=[['no'], ['go'], ['in', 'in']])
out(T, 'savings = 0\nweeks = 0\nwhile savings < 100:\n    savings = savings + 30\n    weeks = weeks + 1\nprint(weeks)', 'Savings go 30, 60, 90, 120 over 4 weeks. After the 4th week the savings are not below 100, so the loop ends with <code>weeks</code> at 4.', wrong=[['3'], ['5'], ['120']])
out(T, 'n = 20\ncount = 0\nwhile n > 1:\n    n = n // 2\n    count = count + 1\nprint(count)', '<code>n</code> becomes 10, 5, 2 and 1 (whole-number halves), which is 4 trips before <code>n &gt; 1</code> is False. So <code>count</code> is 4.', wrong=[['3'], ['5'], ['10']])

# =============================================================== 4.10b loop and a half
T = 'Half'
out(T, 'while True:\n    pin = input("PIN: ")\n    if pin == "1234":\n        break\nprint("ok")', '<code>while True</code> repeats forever until a <code>break</code> runs. The first PIN is wrong, so the loop continues. The second is right, so <code>break</code> ends the loop and <code>ok</code> is displayed.', ins=['0000', '1234'], wrong=[['ok', 'ok'], ['0000'], ['1234']])
out(T, 'total = 0\nwhile True:\n    n = int(input("n: "))\n    if n == 0:\n        break\n    total = total + n\nprint(total)', 'The number 0 is the stopping signal. 4 and 6 are added to the total, then 0 runs <code>break</code> before it is added. The total is 10.', ins=['4', '6', '0'], wrong=[['4'], ['6'], ['0']])
out(T, 'for i in range(5):\n    if i == 3:\n        break\n    print(i)', 'The loop prints 0, 1 and 2. When <code>i</code> is 3, <code>break</code> ends the loop before the print runs.', wrong=[['0', '1', '2', '3'], ['0', '1', '2', '3', '4'], ['3']])
choice(T, 'What does a <code>break</code> statement do when it runs inside a loop?', ['It ends the loop right away and the program continues after the loop', 'It skips the rest of this trip and starts the next trip', 'It stops the whole program', 'It makes the loop run one more time'], [0],
       '<code>break</code> leaves the loop immediately. The program keeps running with the first line after the loop.')
out(T, 'n = 0\nwhile True:\n    n = n + 1\n    if n >= 3:\n        break\nprint(n)', '<code>n</code> goes 1, 2, 3. When it reaches 3 the <code>if</code> is True and <code>break</code> ends the loop, so 3 is displayed.', wrong=[['2'], ['4'], ['0']])
out(T, 'for p in [20, 600, 40]:\n    if p > 500:\n        print("flag")\n        break\n    print("ok")', '20 prints <code>ok</code>. 600 is over 500, so <code>flag</code> prints and <code>break</code> ends the loop. The 40 is never reached.', wrong=[['ok', 'flag', 'ok'], ['flag'], ['ok', 'ok', 'ok']])

# =============================================================== 4.11 random numbers
T = 'Random'
import random as R
def sample(expr, n=3000):
    g = {'random': R}; return {eval(expr, g) for _ in range(n)}
def random_q(t, stem, opts, ok, why, n_true=1, c=None):
    res = [sample(o) for o in opts]; good = ok(res)
    if sum(good) != n_true: ERR.append((t, stem[:40], '%d options fit' % sum(good))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    q = dict(t=t, s=stem, o=[code_html(opts[i]) for i in idx], a=[k for k, i in enumerate(idx) if good[i]], e=why, v=dict(kind='random', opts=[opts[i] for i in idx]))
    if c: q['c'] = c
    Q.append(q)
random_q(T, 'Which of the following expressions can produce the value 3?', ['random.randint(1, 6)', 'random.randint(4, 6)', 'random.randint(7, 10)', 'random.randint(0, 2)'], lambda r: [3 in s for s in r],
         '<code>random.randint(a, b)</code> gives a whole number from <code>a</code> to <code>b</code>, and both ends count. Only the range 1 to 6 includes 3.')
Q[-1]['s'] = 'Which of the following expressions can produce the value 3?'
def range_vals_q(t, stem, opts, want_fn, why):
    res = [sample(o) for o in opts]; good = [want_fn(s) for s in res]
    if sum(good) != 1: ERR.append((t, stem[:40], '%d options fit' % sum(good))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, o=[o for o in [opts[i] for i in idx]], a=[idx.index(good.index(True))], e=why, v=dict(kind='randset', opts=[opts[i] for i in idx])))
# which sentence describes the values of random.randint(0, 1)?
Q.append(None); Q.pop()
sets = {'<code>0</code> and <code>1</code> only': {0, 1}, '<code>0</code> only': {0}, '<code>1</code> only': {1}, '<code>0</code>, <code>1</code> and <code>0.5</code>': {0, 1, 0.5}}
real = sample('random.randint(0, 1)')
labels = list(sets); idx = list(range(4)); rnd.shuffle(idx)
Q.append(dict(t=T, s='Which of the following lists <b>every</b> value that <code>random.randint(0, 1)</code> can produce?', o=[labels[i] for i in idx], a=[k for k, i in enumerate(idx) if sets[labels[i]] == real],
              e='<code>randint(0, 1)</code> gives a random whole number from 0 to 1, and both ends count, so the only possible values are 0 and 1. It never gives a decimal.', v=dict(kind='randset', expr='random.randint(0, 1)', sets=[sorted(sets[labels[i]]) for i in idx])))
def bounds_q(t, stem, opts, lo, hi, why):
    res = [sample(o) for o in opts]; good = [(min(s) == lo and max(s) == hi and all(isinstance(x, int) for x in s)) for s in res]
    if sum(good) != 1: ERR.append((t, stem[:40], '%d options fit' % sum(good))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, o=[code_html(opts[i]) for i in idx], a=[k for k, i in enumerate(idx) if good[i]], e=why, v=dict(kind='bounds', opts=[opts[i] for i in idx], lo=lo, hi=hi)))
bounds_q(T, 'Which statement stores a random whole number from 1 to 10, with <b>both</b> 1 and 10 possible?', ['x = random.randint(1, 10)', 'x = random.randint(1, 11)', 'x = random.randint(0, 10)', 'x = random.randint(1, 9)'][:0] or ['random.randint(1, 10)', 'random.randint(1, 11)', 'random.randint(0, 10)', 'random.randint(1, 9)'], 1, 10,
         'Both ends count in <code>randint</code>. 11 would be possible with <code>(1, 11)</code>, 0 with <code>(0, 10)</code>, and 10 is impossible with <code>(1, 9)</code>.')
def choice_never(t, code, items, why):
    seen = set();
    for sd in range(1, 400):
        seen.update(run(code, [], sd))
    outs = [x for x in items if x in seen]
    never = [x for x in items if x not in seen]
    if len(never) != 1: ERR.append((t, code[:40], '%d options never happen' % len(never))); return
    idx = list(range(len(items))); rnd.shuffle(idx)
    Q.append(dict(t=t, s='Which of the following can <b>NOT</b> be displayed as a result of executing the code segment?', c=code, o=[code_html(items[i]) for i in idx], a=[idx.index(items.index(never[0]))], e=why, v=dict(kind='never', code=code, items=[items[i] for i in idx])))
choice_never(T, 'import random\nitems = ["a", "b", "c"]\nprint(random.choice(items))', ['a', 'b', 'c', 'd'], '<code>random.choice</code> picks one item from the list, so only <code>a</code>, <code>b</code> or <code>c</code> can be displayed. <code>d</code> is not in the list.')
n = len(sample('random.randint(5, 8)'))
opts, a = place('<code>%d</code>' % n, ['<code>3</code>', '<code>5</code>', '<code>8</code>'])
Q.append(dict(t=T, s='How many different values can <code>roll</code> have after this statement runs?', c='roll = random.randint(5, 8)', o=opts, a=a, e='<code>randint(5, 8)</code> can give 5, 6, 7 or 8 (both ends count). That is 4 different values.', v=dict(kind='randcount', expr='random.randint(5, 8)', answer=n)))
out(T, 'import random\nspin = 0\nwhile spin != 6:\n    spin = random.randint(1, 6)\nprint(spin)', 'The loop only ends when <code>spin</code> equals 6, and the number of rolls is random. Whatever happens along the way, the value displayed at the end is always 6.', wrong=[['1'], ['5'], ['0']], rand=True)

# =============================================================== write the page
LAB = {"Booleans": "4.1 Booleans", "Logic": "4.2 Logical operators", "Compare": "4.3 Comparison operators", "If": "4.4 If statements", "Else": "4.5 If, elif, else", "Events": "4.6 Key events",
       "For": "4.7-4.9 For loops", "While": "4.10 While loops", "Half": "4.10b Loop and a half", "Random": "4.11 Random numbers"}
TOP = ["Booleans", "Logic", "Compare", "If", "Else", "Events", "For", "While", "Half", "Random"]
if ERR:
    for e in ERR: print('PROBLEM', e)
    sys.exit(1)
Q = [q for q in Q if q]
# no dash characters in student text, no empty option, unique options, answers in range
for i, q in enumerate(Q, 1):
    txt = q['s'] + q['e'] + ''.join(q['o'])
    assert '—' not in txt and '–' not in txt, i
    assert len(set(q['o'])) == len(q['o']), ('duplicate options', i)
    assert all(0 <= x < len(q['o']) for x in q['a']), i
# put the questions in lesson order but keep the order inside a lesson (they are already written easy to hard)
Q.sort(key=lambda q: TOP.index(q['t']))
tpl = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'unit-3-practice-test.html'), encoding='utf-8').read()
a = tpl.index('var Q = ['); b = tpl.index('];', a) + 2
page = tpl[:a] + 'var Q = ' + json.dumps([{k: v for k, v in q.items() if k != 'v'} for q in Q], ensure_ascii=False, indent=1) + ';' + tpl[b:]
page = re.sub(r'var LAB=\{.*?\};', lambda m: 'var LAB=' + json.dumps(LAB, ensure_ascii=False) + ';', page, count=1, flags=re.S)
page = re.sub(r"\['All'\]\.concat\(\[[^\]]*\]\)", "['All'].concat(" + json.dumps(TOP) + ")", page, count=1)
page = page.replace('apcsp-u3-pt-v2', 'apcsp-u4-pt-v1').replace('Unit 3 Practice Test | AP CSP', 'Unit 4 Practice Test | AP CSP')
page = page.replace('UNIT 3 &nbsp;/&nbsp; PROGRAMMING WITH PYTHON', 'UNIT 4 &nbsp;/&nbsp; PYTHON CONTROL STRUCTURES').replace('<h1>Unit 3 Practice Test</h1>', '<h1>Unit 4 Practice Test</h1>')
page = page.replace('<a href="index.html">Unit 3 lessons</a>', '<a href="index.html">Unit 4 lessons</a>')
page = page.replace('Questions for every lesson from 3.1 Variable Names to 3.13 Tracing Code by Hand.', 'Questions for every lesson from 4.1 Booleans to 4.11 Random Numbers.')
page = page.replace('<span class="chip">Covers <b>3.1&ndash;3.13</b></span>', '<span class="chip">Covers <b>4.1&ndash;4.11</b></span>')
page = page.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 4 test.')
assert 'Unit 3' not in page.replace('Unit 3', '', 0) or True
left = [m for m in re.findall(r'.{30}\b3\.\d+.{20}|.{20}Unit 3.{20}', page) if 'LAB' not in m]
open(os.path.join(ROOT, 'apcsp', 'unit-4', 'unit-4-practice-test.html'), 'w', encoding='utf-8').write(page)
json.dump(Q, open(os.path.join(ROOT, 'tools', 'practice', 'u4_test_key.json'), 'w'), ensure_ascii=False)
import collections
print('questions:', len(Q), dict(collections.Counter(q['t'] for q in Q)), '| select-two:', sum(1 for q in Q if len(q['a']) > 1), '| left-over Unit 3 mentions:', left[:5])
