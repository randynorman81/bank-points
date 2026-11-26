"""Engine for the Unit 4 Parsons problems and code-tracing problems (programs with if / elif / else, for, while, break, functions, random).
Everything is RUN here. Parsons pieces keep their indentation (it is part of the piece), and the valid orderings are found by running every ordering."""
import sys, io, re, copy, random, itertools, contextlib, types

LIMIT = 6000          # a program that runs more line events than this is treated as an endless loop
class Endless(Exception): pass

def run(code, ins=(), seed=None):
    """Run a program, return its printed lines. An endless loop raises Endless. Random programs are seeded."""
    feed = iter(ins); buf = io.StringIO(); n = [0]
    def tr(frame, ev, arg):
        n[0] += 1
        if n[0] > LIMIT: raise Endless()
        return tr
    g = {'input': lambda p='': next(feed)}
    if seed is not None: random.seed(seed)
    co = compile(code, '<prog>', 'exec')
    guard = 'while' in code
    if guard: sys.settrace(tr)
    try:
        with contextlib.redirect_stdout(buf): exec(co, g)
    finally:
        if guard: sys.settrace(None)
    out = buf.getvalue()
    return out.rstrip('\n').split('\n') if out else []

SEEDS = (1, 2, 3, 4, 5, 6, 7, 8)
def outputs(code, ins, rnd):
    """the program's output (one run, or one per seed for a random program); an error or endless loop is returned as a marker"""
    res = []
    for sd in (SEEDS if rnd else (None,)):
        try: res.append(tuple(run(code, ins, sd)))
        except Endless: res.append(('<endless>',))
        except Exception as e: res.append(('<error %s>' % type(e).__name__,))
    return tuple(res)

# ------------------------------------------------------------------ plain-English descriptions of one line
CMP = re.compile(r'(==|!=|<=|>=|<|>|\band\b|\bor\b|\bnot\b)')
def rng_words(args):
    a = [x.strip() for x in args.split(',')]
    if len(a) == 1: return 'each whole number from 0 up to %s minus 1' % a[0] if not a[0].isdigit() else 'each whole number from 0 up to %d (it stops before %s)' % (int(a[0]) - 1, a[0])
    if len(a) == 2: return 'each whole number from %s up to %s (it stops before %s)' % (a[0], _minus1(a[1]), a[1])
    return 'the whole numbers from %s, counting by %s, until it reaches %s (%s is not included)' % (a[0], a[2], a[1], a[1])
def _minus1(x):
    try: return str(int(x) - 1)
    except ValueError: return '%s minus 1' % x
def describe(line):
    s = line.strip()
    m = re.fullmatch(r'if (.+):', s)
    if m: return 'Start an `if` that checks `%s`. The indented lines under it run only when it is True.' % m.group(1)
    m = re.fullmatch(r'elif (.+):', s)
    if m: return 'Add an `elif` that checks `%s`. It is only checked when the `if` above it (and any earlier `elif`) was False.' % m.group(1)
    if s == 'else:': return 'Add an `else`. Its indented lines run when none of the checks above was True.'
    m = re.fullmatch(r'while (.+):', s)
    if m: return 'Start a `while` loop that keeps repeating as long as `%s` is True.' % m.group(1)
    m = re.fullmatch(r'for (\w+) in range\((.+)\):', s)
    if m: return 'Start a `for` loop that gives `%s` %s.' % (m.group(1), rng_words(m.group(2)))
    m = re.fullmatch(r'for (\w+) in (.+):', s)
    if m: return 'Start a `for` loop that gives `%s` each item (or letter) of `%s`, one at a time.' % (m.group(1), m.group(2))
    if s == 'break': return 'Write `break`, which stops the loop right away.'
    m = re.fullmatch(r'def (\w+)\((\w*)\):', s)
    if m: return 'Define a function named `%s`%s. The indented lines under it run only when the function is called.' % (m.group(1), ' with one parameter, `%s`' % m.group(2) if m.group(2) else '')
    m = re.fullmatch(r'global (\w+)', s)
    if m: return 'Tell the function that `%s` is the global variable, so changes to it last after the function ends.' % m.group(1)
    if s == 'import random': return 'Bring in the random library.'
    m = re.fullmatch(r'(\w+) = random\.randint\((.+), (.+)\)', s)
    if m: return 'Store a random whole number from %s to %s (both ends count) in `%s`.' % (m.group(2), m.group(3), m.group(1))
    m = re.fullmatch(r'(\w+) = random\.choice\((\w+)\)', s)
    if m: return 'Pick one item at random from `%s` and store it in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = (\[.*\])', s)
    if m: return 'Create `%s` and store the list %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (True|False)', s)
    if m: return 'Create `%s` and store the yes/no value %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = "(.*)"', s)
    if m: return 'Create `%s` and store the text "%s" in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (-?\d+)', s)
    if m: return 'Create `%s` and store the whole number %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (-?\d+\.\d+)', s)
    if m: return 'Create `%s` and store the decimal number %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = int\(input\("(.*)"\)\)', s)
    if m: return 'Ask the user "%s" and store the answer in `%s` as a whole number (use int).' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = input\("(.*)"\)', s)
    if m: return 'Ask the user "%s" and store the typed text in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = len\((\w+)\)', s)
    if m: return 'Store the number of characters or items in `%s` (its length) in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = \1 ([+\-*/]) (.+)', s)
    if m:
        v, op, rest = m.groups()
        w = {'+': 'Add %s to `%s`', '-': 'Subtract %s from `%s`', '*': 'Multiply `%s` by %s', '/': 'Divide `%s` by %s'}[op]
        return (w % ((rest, v) if op in '+-' else (v, rest))) + ' and store the new value back in `%s`.' % v
    m = re.fullmatch(r'(\w+) = (.+)', s)
    if m and CMP.search(m.group(2)): return 'Store the True or False answer of `%s` in `%s`.' % (m.group(2), m.group(1))
    if m: return 'Store the result of `%s` in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'print\("(.*)"\)', s)
    if m: return 'Print the text "%s".' % m.group(1)
    m = re.fullmatch(r'print\("(.*)", (\w+)\)', s)
    if m: return 'Print the text "%s" followed by the value stored in `%s`.' % (m.group(1), m.group(2))
    m = re.fullmatch(r'print\("(.*)", (.+)\)', s)
    if m: return 'Print the text "%s" followed by the value of `%s`.' % (m.group(1), m.group(2))
    m = re.fullmatch(r'print\((\w+)\)', s)
    if m: return 'Print the value stored in `%s`.' % m.group(1)
    m = re.fullmatch(r'print\((.*)\)', s)
    if m: return 'Print `%s`.' % m.group(1)
    m = re.fullmatch(r'(\w+)\((.*)\)', s)
    if m: return 'Call the function: `%s`.' % s
    return s

# ------------------------------------------------------------------ Parsons
def valid_orders(sol, ins, rnd, exp):
    ids = {}; seq = [ids.setdefault(t, len(ids)) for t in sol]; text = {i: t for t, i in ids.items()}; out = set(); cache = {}
    for perm in set(itertools.permutations(seq)):
        code = '\n'.join(text[k] for k in perm)
        try: compile(code, '<p>', 'exec')
        except SyntaxError: continue
        if outputs(code, ins, rnd) == exp: out.add(''.join(map(str, perm)))
    assert ''.join(map(str, seq)) in out, 'the written solution is not a valid order'
    return sorted(out)

def check_problem(tag, sol, dis, ins, rnd, errors):
    """dis = [(index of the solution line it is a wrong version of, text)]. Putting it in that line's place must break the program or change its output."""
    code = '\n'.join(sol)
    exp = outputs(code, ins, rnd)
    if any(r and r[0].startswith('<') for r in exp): errors.append((tag, 'solution fails: %r' % (exp,))); return None, None
    if all(r == () for r in exp): errors.append((tag, 'prints nothing'))
    for idx, d in dis:
        if d in sol: errors.append((tag, 'distractor is a solution line: ' + d))
        alt = list(sol); alt[idx] = d
        if outputs('\n'.join(alt), ins, rnd) == exp: errors.append((tag, 'distractor %r is a working replacement for line %d' % (d, idx + 1)))
    return exp, run(code, ins, 1 if rnd else None)

# ------------------------------------------------------------------ tracing
SIMPLE = (int, float, str, bool, list, tuple)
def view(frame_g, frame_l, in_func):
    d = {}
    for k, v in frame_g.items():
        if k.startswith('__') or k in ('input', 'print'): continue
        if isinstance(v, SIMPLE): d[k] = v
    if in_func:
        for k, v in frame_l.items():
            if isinstance(v, SIMPLE): d[k] = v
    return d
def rep(v): return repr(v)
def trace(code_lines, ins, seed=None):
    """Run the program once, recording every executed line. Returns (steps, output) with steps = [changed, printed, desc, lineIndex, removed]"""
    src = '\n'.join(code_lines); feed = iter(ins); printed = []
    g = {'input': lambda p='': next(feed)}
    def myprint(*a): printed.append(' '.join(str(x) for x in a))
    g['print'] = myprint
    ev = []   # (line index, view before, prints so far)
    def tr(frame, event, arg):
        if frame.f_code.co_filename != '<prog>': return tr
        if event == 'line':
            infn = frame.f_code.co_name != '<module>'
            ev.append((frame.f_lineno - 1, copy.deepcopy(view(frame.f_globals, frame.f_locals, infn)), len(printed)))
        elif event == 'return' and frame.f_code.co_name == '<module>':
            ev.append((None, copy.deepcopy(view(frame.f_globals, {}, False)), len(printed)))
        return tr
    if seed is not None: random.seed(seed)
    co = compile(src, '<prog>', 'exec'); sys.settrace(tr)
    try: exec(co, g)
    finally: sys.settrace(None)
    steps = []
    for i in range(len(ev) - 1):
        li, before, p0 = ev[i]; nli, after, p1 = ev[i + 1]
        changed = {k: rep(v) for k, v in after.items() if k not in before or before[k] != v}
        removed = [k for k in before if k not in after]
        line = code_lines[li]
        steps.append([changed, printed[p0:p1], event_desc(code_lines, li, nli, i, ev), li, removed])
    return steps, list(printed)

def indent_of(s): return len(s) - len(s.lstrip(' '))
def event_desc(code, li, nli, i, ev):
    line = code[li]; s = line.strip(); inside = nli is not None and nli > li and indent_of(code[nli]) > indent_of(line) and nli == li + 1
    m = re.fullmatch(r'if (.+):', s) or re.fullmatch(r'elif (.+):', s)
    if m:
        return 'Check `%s`. It is True, so the indented lines under it run.' % m.group(1) if inside else 'Check `%s`. It is False, so Python skips the indented lines under it.' % m.group(1)
    m = re.fullmatch(r'while (.+):', s)
    if m:
        return 'Check `%s`. It is True, so the loop body runs again.' % m.group(1) if inside else 'Check `%s`. It is False, so the loop ends and Python moves on.' % m.group(1)
    m = re.fullmatch(r'for (\w+) in (.+):', s)
    if m:
        first = not any(e[0] == li for e in ev[:i])
        if inside: return ('The loop starts and gives `%s` its first value.' if first else 'The loop gives `%s` its next value.') % m.group(1)
        return 'The loop has no more values, so it ends and Python moves on.' if not first else 'The loop has nothing to go through, so it ends.'
    m = re.fullmatch(r'def (\w+)\((\w*)\):', s)
    if m: return 'Define the function `%s`. Nothing inside it runs yet.' % m.group(1)
    if s == 'break': return '`break` stops the loop right away.'
    m = re.fullmatch(r'(\w+)\((.*)\)', s)
    if m and re.search(r'^def %s\(' % m.group(1), '\n'.join(code), re.M):
        return 'Call the function `%s(%s)`. Python jumps up into the function.' % (m.group(1), m.group(2))
    return describe(line)
