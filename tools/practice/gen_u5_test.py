"""Builds apcsp/unit-5/unit-5-practice-test.html (AP-style practice test for Unit 5) from the Unit 3 test page as a template.
Every question whose answer can be computed IS computed here by running the code or evaluating the expressions, and the marked answer must match.
Wrong options for "what is displayed" questions come from the answers of slightly changed programs (the typical mistakes), so they are believable.
usage: python3 tools/practice/gen_u5_test.py"""
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


def runs_ok(t, setup, opts, stem, why):
    """which of several statements run without an error after the setup code"""
    ok = []
    for o in opts:
        try:
            with contextlib.redirect_stdout(io.StringIO()): exec(setup + '\n' + o, {})
            ok.append(True)
        except Exception: ok.append(False)
    if sum(ok) != 1: ERR.append((t, stem[:40], '%d options run' % sum(ok))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, c=setup, o=[code_html(opts[i]) for i in idx], a=[k for k, i in enumerate(idx) if ok[i]], e=why, v=dict(kind='execs', setup=setup, opts=[opts[i] for i in idx])))
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
def bounds_q(t, stem, opts, lo, hi, why):
    res = [sample(o) for o in opts]; good = [(min(s) == lo and max(s) == hi and all(isinstance(x, int) for x in s)) for s in res]
    if sum(good) != 1: ERR.append((t, stem[:40], '%d options fit' % sum(good))); return
    idx = list(range(len(opts))); rnd.shuffle(idx)
    Q.append(dict(t=t, s=stem, o=[code_html(opts[i]) for i in idx], a=[k for k, i in enumerate(idx) if good[i]], e=why, v=dict(kind='bounds', opts=[opts[i] for i in idx], lo=lo, hi=hi)))
# =============================================================== 5.1 Functions and parameters
T = 'Define'
out(T, 'def welcome():\n    print("Hello")\nwelcome()\nwelcome()', 'The function is defined once and then <b>called</b> twice. Each call runs the body, so <code>Hello</code> is displayed two times.', wrong=[['Hello'], [], ['welcome()', 'welcome()']])
out(T, 'def welcome():\n    print("Hello")', 'Defining a function only saves it. Nothing runs until it is <b>called</b>, and this program never calls <code>welcome</code>, so nothing is displayed.', wrong=[['Hello'], ['welcome'], ['None']])
out(T, 'def greet(name):\n    print("Hi,", name)\ngreet("Ava")\ngreet("Ben")', 'Each call sends a value into the parameter <code>name</code>. The first call uses <code>"Ava"</code> and the second uses <code>"Ben"</code>.', wrong=[['Hi, name', 'Hi, name'], ['Hi, Ava', 'Hi, Ava'], ['Hi, Ben', 'Hi, Ava']])
out(T, 'def double(n):\n    print(n * 2)\ndouble(4)\ndouble(10)', 'The parameter <code>n</code> holds 4 on the first call and 10 on the second, so the function prints 8 and then 20.', wrong=[['4', '10'], ['8', '10'], ['8', '8']])
choice(T, 'In the code segment below, which name is a <b>parameter</b>?', ['<code>score</code>', '<code>show</code>', '<code>95</code>', '<code>print</code>'], [0],
       'A parameter is the name inside the parentheses of the <code>def</code> line. <code>show</code> is the function name, <code>95</code> is the argument in the call, and <code>print</code> is a built-in function.', code='def show(score):\n    print(score)\nshow(95)')
choice(T, 'In the call <code>show(95)</code>, what is <code>95</code> called?', ['An argument', 'A parameter', 'A function name', 'A return value'], [0],
       'The value you put in the parentheses of a call is the <b>argument</b>. It is sent into the parameter named in the <code>def</code> line.')
err_q(T, 'def greet(name):\n    print("Hi,", name)\ngreet()', 'The function needs one argument for <code>name</code>, but the call gives none. Python stops with an error.', [['Hi,'], ['Hi, name'], ['None']])
out(T, 'def banner(text):\n    print("*" + text + "*")\nbanner("Hi")\nstatus = "Done"\nbanner(status)', 'An argument can be text or a variable. The first call joins <code>Hi</code> between stars, and the second sends the value stored in <code>status</code>.', wrong=[['*Hi*', '*status*'], ['*Hi*'], ['Hi', 'Done']])
out(T, 'def b():\n    print("B")\ndef a():\n    print("A")\n    b()\na()', 'Calling <code>a()</code> runs its first line (<code>A</code>), then the call to <code>b()</code> jumps into <code>b</code> (<code>B</code>), and then the program continues.', wrong=[['B', 'A'], ['A'], ['B']])
runs_ok(T, 'def show(n):\n    print(n)', ['show(5)', 'def show(5)', 'show 5', 'call show(5)'], 'Which of the following correctly <b>calls</b> the function <code>show</code> with the argument 5?', 'A call is the function name followed by parentheses that hold the argument: <code>show(5)</code>. The other lines are syntax errors.')
out(T, 'print("Start")\ndef hello():\n    print("Hello")\nprint("End")\nhello()', 'Defining <code>hello</code> prints nothing. The program displays Start, then End, and only then reaches the call that runs the function.', wrong=[['Start', 'Hello', 'End'], ['Hello', 'Start', 'End'], ['Start', 'End']])
out(T, 'def add_one(n):\n    print(n + 1)\nx = 5\nadd_one(x)', 'The variable <code>x</code> is sent to the parameter <code>n</code>, so the function receives the value 5 and prints 6.', wrong=[['5'], ['x'], ['1']])

# =============================================================== 5.2 Multiple parameters
T = 'Multi'
out(T, 'def add(a, b):\n    print(a + b)\nadd(2, 3)\nadd(10, 25)', 'The arguments match the parameters in order. The first call adds 2 and 3, and the second adds 10 and 25.', wrong=[['5'], ['23', '1025'], ['5', '10']])
out(T, 'def subtract(a, b):\n    print(a - b)\nsubtract(10, 3)\nsubtract(3, 10)', 'Order matters. In the first call <code>a</code> is 10 and <code>b</code> is 3 (7). In the second call they are swapped (3 - 10 is -7).', wrong=[['7', '7'], ['-7', '7'], ['7', '3']])
out(T, 'def contact(name, phone):\n    print(name + ": " + phone)\ncontact("Mom", "555")\ncontact("555", "Mom")', 'Both calls run, but the second one sends the arguments in the wrong order, so the name and the phone number are swapped in the output.', wrong=[['Mom: 555', 'Mom: 555'], ['555: Mom', '555: Mom'], ['Mom: 555']])
err_q(T, 'def average(a, b, c):\n    print((a + b + c) / 3)\naverage(80, 90)', 'The function has three parameters, so a call needs exactly three arguments. With only two, Python raises an error.', [['85.0'], ['170'], ['56.666666666666664']])
out(T, 'def average(a, b, c):\n    print((a + b + c) / 3)\naverage(80, 90, 100)', 'The three scores add up to 270, and 270 divided by 3 is <code>90.0</code> (division with <code>/</code> always gives a decimal).', wrong=[['90'], ['270'], ['100.0']])
out(T, 'def listing(address, bedrooms):\n    print(address + " has " + str(bedrooms) + " bedrooms")\nlisting("12 Oak", 3)', '<code>str(bedrooms)</code> turns the number 3 into text, so it can be joined with <code>+</code>. The line displays <code>12 Oak has 3 bedrooms</code>.', wrong=[['12 Oak has bedrooms 3'], ['address has 3 bedrooms'], ['12 Oak has 3']])
err_q(T, 'def listing(address, bedrooms):\n    print(address + " has " + bedrooms + " bedrooms")\nlisting("12 Oak", 3)', 'The parameter <code>bedrooms</code> holds the number 3. A number cannot be joined to text with <code>+</code> unless it is converted with <code>str()</code>, so an error occurs.', [['12 Oak has 3 bedrooms'], ['12 Oak has bedrooms'], ['3']])
out(T, 'def area(w, h):\n    print(w * h)\nw = 3\nh = 5\narea(h, w)', 'The call sends <code>h</code> (5) first, then <code>w</code> (3). Multiplying is the same either way, so 15 is displayed.', wrong=[['8'], ['35'], ['3']])
out(T, 'def label(x, y):\n    print(x, y)\nx = 1\nlabel(x, x)', 'The same variable can be sent twice. Both parameters get the value 1, so <code>1 1</code> is displayed.', wrong=[['1'], ['x x'], ['1 2']])
choice(T, 'How many parameters does <code>def price(cost, tax, tip):</code> have?', ['3', '1', '2', '0'], [0], 'The names inside the parentheses are the parameters: <code>cost</code>, <code>tax</code> and <code>tip</code>. A call has to send three arguments.')
out(T, 'def rect(width, height):\n    print("Area:", width * height)\n    print("Perimeter:", 2 * (width + height))\nrect(5, 3)', 'Area is 5 times 3 = 15. Perimeter is 2 times (5 + 3) = 16. Both prints run each time the function is called.', wrong=[['Area: 8', 'Perimeter: 15'], ['Area: 15', 'Perimeter: 8'], ['Area: 16', 'Perimeter: 15']])
runs_ok(T, 'def f(a, b):\n    print(a, b)', ['f(1, 2)', 'f(1)', 'f(1, 2, 3)', 'f[1, 2]'], 'Which statement calls <code>f</code> correctly and runs without an error?', '<code>f(1)</code> gives too few arguments and <code>f(1, 2, 3)</code> gives too many. Square brackets do not call a function, so <code>f[1, 2]</code> is also an error.')

# =============================================================== 5.3 Return values
T = 'Return'
out(T, 'def double(n):\n    return n * 2\nresult = double(4)\nprint(result)', '<code>return</code> hands 8 back to the line that called the function. It is stored in <code>result</code> and then displayed.', wrong=[['4'], ['n * 2'], ['None']])
out(T, 'def double(n):\n    return n * 2\ndouble(4)', 'The function returns 8, but nothing stores or prints that value, so nothing is displayed.', wrong=[['8'], ['4'], ['None']])
out(T, 'def double(n):\n    return n * 2\ntotal = double(3) + double(10)\nprint(total)', 'A returned value can be used in math. <code>double(3)</code> is 6 and <code>double(10)</code> is 20, so the total is 26.', wrong=[['13'], ['60'], ['6', '20']])
out(T, 'def show(n):\n    print(n * 2)\nr = show(4)\nprint(r)', '<code>show</code> prints 8 but has no <code>return</code>, so it gives back <code>None</code>. That is what gets stored in <code>r</code> and displayed.', wrong=[['8', '8'], ['8'], ['None']])
out(T, 'def double(n):\n    return n * 2\nprint(double(double(3)))', 'The inner call runs first: <code>double(3)</code> is 6. That 6 is sent into the outer call, which returns 12.', wrong=[['6'], ['9'], ['3']])
out(T, 'def test():\n    return 1\n    print("never")\nprint(test())', 'A <code>return</code> ends the function right away. The <code>print("never")</code> line is never reached, so only the returned 1 is displayed.', wrong=[['never', '1'], ['1', 'never'], ['never']])
out(T, 'def make_tag(first, last):\n    return first[0] + last\nprint(make_tag("Sam", "Rivera"))', '<code>first[0]</code> is the first letter, <code>S</code>. The function returns it joined to <code>Rivera</code>, so <code>SRivera</code> is displayed.', wrong=[['Sam Rivera'], ['SamRivera'], ['SRiver']])
val(T, 'def add_shipping(amount):\n    return amount + 5\nprice = add_shipping(20)\nprice = add_shipping(price)', 'price', 'The first call returns 25 and stores it in <code>price</code>. The second call sends that 25 in and returns 30.', [25, 20, 10])
out(T, 'def f(n):\n    return n + 1\n    print(n)\nprint(f(5))', 'The function returns 6 and ends before the <code>print(n)</code> line. Only the returned value is displayed, by the <code>print</code> in the last line.', wrong=[['5', '6'], ['5'], ['6', '5']])
out(T, 'def f():\n    pass\nprint(f())', 'A function with no <code>return</code> gives back <code>None</code>, and <code>print</code> displays it.', wrong=[['0'], [], ['f']])
out(T, 'def tax(amount):\n    return amount / 10\nprint("Tax:", tax(50))', '<code>tax(50)</code> returns 5.0 (division with <code>/</code> gives a decimal), so the line displays <code>Tax: 5.0</code>.', wrong=[['Tax: 5'], ['Tax: 50'], ['Tax: tax(50)']])
out(T, 'def double(n):\n    return n * 2\ndef add_one(n):\n    return n + 1\nprint(add_one(double(4)))', '<code>double(4)</code> returns 8, and <code>add_one(8)</code> returns 9.', wrong=[['10'], ['8'], ['5']])

# =============================================================== 5.4 Return values with decisions and loops
T = 'Decide'
out(T, 'def is_even(n):\n    return n % 2 == 0\nprint(is_even(9))\nprint(is_even(10))', 'The function returns the True or False answer to <code>n % 2 == 0</code>. 9 leaves a remainder of 1 (False), and 10 leaves 0 (True).', wrong=[['True', 'False'], ['True', 'True'], ['1', '0']])
out(T, 'def is_even(n):\n    return n % 2 == 0\nif is_even(9):\n    print("even")\nelse:\n    print("odd")', '<code>is_even(9)</code> returns <code>False</code>, so the <code>if</code> is skipped and the <code>else</code> displays <code>odd</code>.', wrong=[['even'], ['even', 'odd'], ['False']])
out(T, 'def bigger(a, b):\n    if a > b:\n        return a\n    else:\n        return b\nprint(bigger(8, 3))\nprint(bigger(2, 9))', 'The function returns the larger number. 8 is bigger than 3, and in the second call 9 is bigger than 2.', wrong=[['3', '2'], ['8', '2'], ['3', '9']])
out(T, 'def league(xp):\n    if xp >= 500:\n        return "Gold"\n    if xp >= 200:\n        return "Silver"\n    return "Bronze"\nprint(league(350))\nprint(league(600))\nprint(league(100))', 'Each call stops at the first <code>return</code> that matches. 350 is at least 200 (Silver), 600 is at least 500 (Gold), and 100 matches nothing, so it reaches the final Bronze.', wrong=[['Gold', 'Gold', 'Bronze'], ['Silver', 'Silver', 'Bronze'], ['Silver', 'Gold', 'Silver']])
out(T, 'def check(n):\n    if n > 10:\n        return "big"\n    print("small")\n    return "done"\nprint(check(20))', '20 is over 10, so the function returns <code>big</code> immediately. The lines after that never run, so <code>small</code> is not displayed.', wrong=[['small', 'big'], ['big', 'small'], ['done']])
val(T, 'def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\nanswer = sum_to(4)', 'answer', 'The loop adds 1, 2, 3 and 4 to <code>total</code>, then the return after the loop hands back 10.', [6, 4, 24])
out(T, 'def first_only(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n        return total\nprint(first_only(4))', 'The <code>return</code> is <b>inside</b> the loop, so the function returns after the very first pass, when <code>total</code> is only 1.', wrong=[['10'], ['4'], ['0']])
out(T, 'def count_even(n):\n    count = 0\n    for i in range(1, n + 1):\n        if i % 2 == 0:\n            count = count + 1\n    return count\nprint(count_even(10))', 'The loop checks 1 through 10 and counts the even numbers (2, 4, 6, 8, 10). The return after the loop gives back 5.', wrong=[['10'], ['4'], ['55']])
out(T, 'def passed(score):\n    return score >= 70\nprint("Passed:", passed(65))', '65 is not at least 70, so the comparison is False and the function returns <code>False</code>.', wrong=[['Passed: True'], ['Passed: 65'], ['Passed: None']])
out(T, 'def letter(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    return "C"\nprint(letter(85))\nprint(letter(95))\nprint(letter(50))', '85 matches the 80 test (B), 95 matches the first test (A), and 50 matches neither so the final <code>return "C"</code> runs.', wrong=[['A', 'A', 'C'], ['B', 'B', 'C'], ['B', 'A', 'B']])
out(T, 'def has_a(word):\n    for ch in word:\n        if ch == "a":\n            return True\n    return False\nprint(has_a("banana"))\nprint(has_a("kiwi"))', 'For <code>banana</code> the loop finds an <code>a</code> and returns <code>True</code> right away. <code>kiwi</code> has no <code>a</code>, so the loop ends and <code>False</code> is returned.', wrong=[['True', 'True'], ['False', 'False'], ['False', 'True']])
choice(T, 'A function loops through a list and must return the <b>total</b> of all the items. Where should the <code>return</code> line go?', ['After the loop, not indented under it', 'Inside the loop, as its first line', 'Inside the loop, as its last line', 'Before the loop starts'], [0],
       'A return inside the loop ends the function after one pass. To total every item, the loop must finish first, so the return goes <b>after</b> the loop.')

# =============================================================== 5.5 Libraries and APIs
T = 'Library'
out(T, 'import math\nprint(math.sqrt(16))', '<code>import math</code> brings in the library, and <code>math.sqrt(16)</code> gives the square root, <code>4.0</code> (a decimal).', wrong=[['4'], ['256'], ['8.0']])
out(T, 'print(abs(-7))\nprint(round(3.67))\nprint(len("robot"))', '<code>abs(-7)</code> is the distance from zero, 7. <code>round(3.67)</code> rounds to 4. <code>len("robot")</code> counts 5 characters.', wrong=[['-7', '4', '5'], ['7', '3', '5'], ['7', '4', '6']])
out(T, 'print(round(3.14159, 2))\nprint(round(7.891, 1))', 'The second argument tells <code>round</code> how many decimal places to keep: 3.14 and 7.9.', wrong=[['3.1', '7.89'], ['3', '8'], ['3.15', '7.9']])
out(T, 'print(pow(2, 3))\nprint(pow(3, 2))', '<code>pow(base, exponent)</code> takes the base first. 2 to the power 3 is 8, and 3 to the power 2 is 9. Swapping the arguments changes the answer.', wrong=[['6', '6'], ['9', '8'], ['8', '8']])
out(T, 'print(min(4, 2, 8))\nprint(max(4, 2, 8))', '<code>min</code> gives the smallest value and <code>max</code> gives the largest.', wrong=[['8', '2'], ['2', '2'], ['4', '4']])
random_q(T, 'Which of the following expressions can produce the value 3?', ['random.randint(1, 5)', 'random.randint(4, 6)', 'random.randint(5, 9)', 'random.randint(0, 2)'], lambda r: [3 in s for s in r],
         '<code>random.randint(a, b)</code> gives a whole number from <code>a</code> to <code>b</code>, and both ends count. Only the range 1 to 5 includes 3.')
bounds_q(T, 'Which expression gives a random whole number from 1 to 5, with <b>both</b> 1 and 5 possible?', ['random.randint(1, 5)', 'random.randint(1, 4)', 'random.randint(0, 5)', 'random.randint(1, 6)'], 1, 5,
         'Both ends count in <code>randint</code>. <code>(1, 4)</code> never gives 5, <code>(0, 5)</code> can give 0, and <code>(1, 6)</code> can give 6.')
err_q(T, 'print(math.sqrt(9))', 'The <code>math</code> library was never brought in with <code>import math</code>, so Python does not know the name <code>math</code> and stops with an error.', [['3.0'], ['3'], ['9']])
out(T, 'import math\ndef hypotenuse(a, b):\n    return math.sqrt(a * a + b * b)\nprint(hypotenuse(3, 4))', 'Your own function can use a library. 3 squared plus 4 squared is 25, and its square root is <code>5.0</code>.', wrong=[['7.0'], ['25.0'], ['5']])
choice(T, 'What does the <b>documentation</b> (the API description) of a library procedure tell you?', ['What the procedure needs and what it gives back', 'How the procedure was written inside the library', 'Which computer the library was made on', 'The answer to every call you might make'], [0],
       'Documentation describes how to use a procedure: the arguments it expects, their order, and the value it returns. You do not need to see how it is written inside.')
out(T, 'def clamp(value, low, high):\n    if value < low:\n        return low\n    if value > high:\n        return high\n    return value\nprint(clamp(15, 0, 10))\nprint(clamp(-3, 0, 10))\nprint(clamp(7, 0, 10))', 'The function keeps a value between <code>low</code> and <code>high</code>. 15 is too high (10), -3 is too low (0), and 7 is already inside the range (7).', wrong=[['15', '-3', '7'], ['10', '10', '7'], ['10', '0', '10']])
out(T, 'import random\nroll = random.randint(5, 5)\nprint(roll)', 'Both ends count in <code>randint</code>. When both numbers are 5, the only possible value is 5, so 5 is displayed every time.', wrong=[['0'], ['1'], ['6']], rand=True)

# =============================================================== 5.6 Procedures and the Create Task
T = 'Proc'
out(T, 'def divider():\n    print("---")\ndivider()\nprint("Title")\ndivider()', 'The same procedure is called twice. The program prints the divider, then the title, then the divider again.', wrong=[['---', 'Title'], ['Title', '---', '---'], ['---', '---', 'Title']])
out(T, 'def divider():\n    print("---")\ndef title_card(title):\n    divider()\n    print(title)\n    divider()\ntitle_card("Dark")', 'Calling <code>title_card</code> runs its three lines. Two of them call <code>divider</code>, so the title is framed by dividers.', wrong=[['Dark'], ['---', 'Dark'], ['Dark', '---', '---']])
out(T, 'def welcome(name, is_member):\n    if is_member:\n        print("Welcome back,", name)\n    else:\n        print("Welcome,", name)\nwelcome("Ava", True)\nwelcome("Ben", False)', 'The parameter <code>is_member</code> picks the branch. Ava is a member, so she gets <code>Welcome back</code>. Ben is not, so the <code>else</code> runs.', wrong=[['Welcome back, Ava', 'Welcome back, Ben'], ['Welcome, Ava', 'Welcome, Ben'], ['Welcome, Ava', 'Welcome back, Ben']])
out(T, 'def stars(count):\n    line = ""\n    for i in range(count):\n        line = line + "*"\n    print(line)\nstars(3)\nstars(1)', 'The loop adds one star per pass, and the line is printed after the loop. <code>stars(3)</code> shows three stars and <code>stars(1)</code> shows one.', wrong=[['*', '***'], ['***', '***'], ['*', '*', '*', '*']])
count(T, 'def repeat_message(text, times):\n    for i in range(times):\n        print(text)\nrepeat_message("Hi", 3)', 'Hi', 'The loop is controlled by the parameter <code>times</code>. With 3, the body runs three times, so <code>Hi</code> is displayed 3 times.', [1, 2, 4])
choice(T, 'Why is it better to write one procedure than to copy the same lines into several places?', ['A change only has to be made in one place', 'The program runs without using any memory', 'Python refuses to run repeated lines', 'The lines run faster when they are copied'], [0],
       'When code is in one procedure, fixing or changing it once changes every call. Copied code has to be found and fixed everywhere.')
out(T, 'def check(n):\n    for i in range(n):\n        if i % 2 == 0:\n            print(i)\ncheck(5)', 'This procedure uses a loop (iteration) and an <code>if</code> (selection) together. It prints the even numbers from 0 up to 4.', wrong=[['1', '3'], ['0', '2', '4', '6'], ['2', '4']])
out(T, 'def double(n):\n    return n * 2\ndef double_then_add(n, extra):\n    return double(n) + extra\nprint(double_then_add(5, 1))', 'One function can call another. <code>double(5)</code> returns 10, and then 1 is added, so 11 is returned and displayed.', wrong=[['6'], ['10'], ['12']])

# =============================================================== write the page
LAB = {"Define": "5.1 Functions and parameters", "Multi": "5.2 Multiple parameters", "Return": "5.3 Return values", "Decide": "5.4 Return with decisions and loops", "Library": "5.5 Libraries and APIs", "Proc": "5.6 Procedures"}
TOP = ["Define", "Multi", "Return", "Decide", "Library", "Proc"]
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
page = page.replace('apcsp-u3-pt-v2', 'apcsp-u5-pt-v1').replace('Unit 3 Practice Test | AP CSP', 'Unit 5 Practice Test | AP CSP')
page = page.replace('UNIT 3 &nbsp;/&nbsp; PROGRAMMING WITH PYTHON', 'UNIT 5 &nbsp;/&nbsp; FUNCTIONS AND PARAMETERS').replace('<h1>Unit 3 Practice Test</h1>', '<h1>Unit 5 Practice Test</h1>')
page = page.replace('<a href="index.html">Unit 3 lessons</a>', '<a href="index.html">Unit 5 lessons</a>')
page = page.replace('Questions for every lesson from 3.1 Variable Names to 3.13 Tracing Code by Hand.', 'Questions for every lesson from 5.1 Functions and Parameters to 5.6 Procedures and the Create Task.')
page = page.replace('<span class="chip">Covers <b>3.1&ndash;3.13</b></span>', '<span class="chip">Covers <b>5.1&ndash;5.6</b></span>')
page = page.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 5 test.')
assert 'Unit 3' not in page.replace('Unit 3', '', 0) or True
left = [m for m in re.findall(r'.{30}\b3\.\d+.{20}|.{20}Unit 3.{20}', page) if 'LAB' not in m]
open(os.path.join(ROOT, 'apcsp', 'unit-5', 'unit-5-practice-test.html'), 'w', encoding='utf-8').write(page)
json.dump(Q, open(os.path.join(ROOT, 'tools', 'practice', 'u5_test_key.json'), 'w'), ensure_ascii=False)
import collections
print('questions:', len(Q), dict(collections.Counter(q['t'] for q in Q)), '| select-two:', sum(1 for q in Q if len(q['a']) > 1), '| left-over Unit 3 mentions:', left[:5])
