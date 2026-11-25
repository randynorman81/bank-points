"""Builds python/parsons-u3.js (10 Parsons problems per lesson) and python/trace-u3.js (10 code-tracing problems per lesson) for Unit 3.
Every program is RUN here. Nothing is written unless every check passes.   usage: python3 tools/parsons/gen_u3.py"""
import sys, os, io, json, random, itertools, contextlib, copy, runpy
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import shapes_b
from shapes_a import SH
ROOT = os.path.dirname(os.path.dirname(HERE))
hand = runpy.run_path(os.path.join(HERE, 'u3.py'))['L']   # the two hand-written Parsons problems per lesson
LESSONS = {l['id']: l for l in hand}
def run(code, ins):
    feed = iter(ins); buf = io.StringIO()
    with contextlib.redirect_stdout(buf): exec(code, {'input': lambda p='': next(feed)})
    return buf.getvalue().rstrip('\n').split('\n')
def fill(sh, row):
    d = dict(zip(sh['keys'], row)); return {k: v.format(**d) if isinstance(v, str) else v for k, v in dict(story=sh['story']).items()}['story'], [l.format(**d) for l in sh['sol'].split('\n')], [x.format(**d) for x in sh['dis']], [i.format(**d) for i in sh['ins']]
errors = []
def check_problem(tag, sol, dis, groups, ins):
    code = '\n'.join(sol)
    try: exp = run(code, ins)
    except Exception as e: errors.append((tag, 'solution fails: %r' % e)); return None
    if exp == ['']: errors.append((tag, 'prints nothing'))
    for d in dis:
        if d in sol: errors.append((tag, 'distractor is a solution line: ' + d))
        for i in range(len(sol)):     # a distractor swapped into the solution must NOT give the same output
            alt = list(sol); alt[i] = d
            try:
                if run('\n'.join(alt), ins) == exp: errors.append((tag, 'distractor %r is equivalent at line %d' % (d, i + 1))); break
            except Exception: pass
    for g in groups:
        idx = sorted(g)
        for perm in itertools.permutations(g):
            s = list(sol)
            for dst, src in zip(idx, perm): s[dst] = sol[src]
            try:
                if run('\n'.join(s), ins) != exp: errors.append((tag, 'group %r is not interchangeable' % g)); break
            except Exception: errors.append((tag, 'group %r raises' % g)); break
    return exp
import re
def describe(line):
    m = re.fullmatch(r'(\w+) = "(.*)"', line)
    if m: return 'Create `%s` and store the text "%s" in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (-?\d+)', line)
    if m: return 'Create `%s` and store the whole number %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (-?\d+\.\d+)', line)
    if m: return 'Create `%s` and store the decimal number %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = (True|False)', line)
    if m: return 'Create `%s` and store the yes/no value %s in it.' % m.groups()
    m = re.fullmatch(r'(\w+) = int\(input\("(.*)"\)\)', line)
    if m: return 'Ask the user "%s" and store the answer in `%s` as a whole number (use int).' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = float\(input\("(.*)"\)\)', line)
    if m: return 'Ask the user "%s" and store the answer in `%s` as a decimal number (use float).' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = input\("(.*)"\)', line)
    if m: return 'Ask the user "%s" and store the typed text in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = (\w+)\.find\("(.*)"\)', line)
    if m: return 'Use .find to get the position of "%s" in `%s` and store it in `%s`.' % (m.group(3), m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = len\((\w+)\)', line)
    if m: return 'Store the number of characters in `%s` (its length) in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = (\w+)\[(.*)\]', line)
    if m: return 'Store `%s[%s]` (%s) in `%s`.' % (m.group(2), m.group(3), 'a slice of the text' if ':' in m.group(3) else 'one character of the text', m.group(1))
    m = re.fullmatch(r'(\w+) = (\w+)', line)
    if m: return 'Copy the value of `%s` into `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'(\w+) = \1 ([+\-*/]) (.+)', line)
    if m:
        v, op, rest = m.groups(); w = {'+': 'Add %s to `%s`', '-': 'Subtract %s from `%s`', '*': 'Multiply `%s` by %s', '/': 'Divide `%s` by %s'}[op]
        return (w % ((rest, v) if op in '+-' else (v, rest))) + ' and store the new value back in `%s`.' % v
    m = re.fullmatch(r'(\w+) = (.+)', line)
    if m: return 'Store the result of `%s` in `%s`.' % (m.group(2), m.group(1))
    m = re.fullmatch(r'print\("(.*)"\)', line)
    if m: return 'Print the text "%s".' % m.group(1)
    m = re.fullmatch(r'print\((\w+)\)', line)
    if m: return 'Print the value stored in `%s`.' % m.group(1)
    m = re.fullmatch(r'print\((.*)\)', line)
    if m: return 'Print `%s`.' % m.group(1)
    return line
def valid_orders(sol, ins, exp):
    # every order of the solution lines that runs without an error and prints exactly the expected output
    ids = {}; seq = [ids.setdefault(t, len(ids)) for t in sol]; out = set()
    for perm in set(itertools.permutations(seq)):
        code = '\n'.join(next(t for t, i in ids.items() if i == k) for k in perm)
        try:
            if run(code, ins) == exp: out.add(''.join(map(str, perm)))
        except Exception: pass
    assert ''.join(map(str, seq)) in out, 'the written solution is not valid'
    return sorted(out)
rnd = random.Random(7)
def pieces_for(sol, dis):
    ps = [dict(t=t) for t in sol] + [dict(t=t, d=1) for t in dis]
    for _ in range(50):
        rnd.shuffle(ps)
        if [p['t'] for p in ps if not p.get('d')] != sol: break
    return ps
def short(story):
    s = story.split('.')[0].split(' (')[0]; w = s.split(); return ' '.join(w[:7]) + ('...' if len(w) > 7 else '')
import re as _re
def difficulty(lines, ins=()):
    code = '\n'.join(lines); ops = len(_re.findall(r'[+\-*/%]|//|\[|\.find|int\(|float\(|input\(|str\(|len\(', code))
    names = len({m for l in lines for m in _re.findall(r'\b[a-z_][a-z_0-9]*\b', l.split('#')[0]) if m not in ('print','input','int','float','str','len','find','temp')})
    return 10 * len(lines) + 3 * ops + 2 * names
P, T = {}, {}
for lid, shapes in SH.items():
    base = LESSONS[lid]; probs = []
    for k, hp in enumerate(base['probs']):
        exp = check_problem('%s hand%d' % (lid, k), hp['sol'], hp['distract'], hp['groups'], hp['ins'])
        probs.append(dict(title=hp['title'], story=hp['story'], expect=exp, ins=hp['ins'], pieces=pieces_for(hp['sol'], hp['distract']), sol=hp['sol'], steps=[describe(l) for l in hp['sol']], valid=valid_orders(hp['sol'], hp['ins'], exp)))
    seen = {'\n'.join(p['sol']) for p in probs}
    for si, sh in enumerate(shapes[:4]):
        got = 0
        for row in (0, 1, 2, 3):          # two per shape; skip a row that repeats a hand-written problem
            if got == 2: break
            story, sol, dis, ins = fill(sh, sh['pool'][row])
            if '\n'.join(sol) in seen: continue
            seen.add('\n'.join(sol)); got += 1
            exp = check_problem('%s P%d.%d' % (lid, si + 1, row), sol, dis, sh['groups'], ins)
            probs.append(dict(title=short(story), story=story, expect=exp, ins=ins, pieces=pieces_for(sol, dis), sol=sol, steps=[describe(l) for l in sol], valid=valid_orders(sol, ins, exp)))
    if len({'\n'.join(p['sol']) for p in probs}) != len(probs): errors.append((lid, 'duplicate Parsons problem'))
    if len(probs) != 10: errors.append((lid, 'expected 10 Parsons, got %d' % len(probs)))
    probs.sort(key=lambda p: difficulty(p['sol']))   # easiest first, hardest last (stable: same-size problems keep their order)
    P[lid] = dict(num=base['num'], title=base['title'], brand=dict(name=base['brand'][0], color=base['brand'][1], head=base['brand'][2]), problems=probs)
    trs = []
    for si, sh in enumerate(shapes):
        for row in (2, 3):
            story, sol, dis, ins = fill(sh, sh['pool'][row]); tag = '%s T%d.%d' % (lid, si + 1, row)
            check_problem(tag, sol, [], sh['groups'], ins)
            feed = iter(ins); g = {'input': lambda p='': next(feed)}; steps = []; prev = {}
            for ln in sol:
                buf = io.StringIO()
                with contextlib.redirect_stdout(buf): exec(ln, g)
                printed = buf.getvalue().rstrip('\n').split('\n') if buf.getvalue() else []
                cur = {n: v for n, v in g.items() if n != 'input' and not n.startswith('__')}
                steps.append([{n: repr(v) for n, v in cur.items() if n not in prev or prev[n] != v}, printed, describe(ln)]); prev = copy.deepcopy(cur)
            # a SECOND, independent check: re-run the first k lines from scratch and compare with what the steps say
            seen = {}; shown = []
            for k in range(1, len(sol) + 1):
                f2 = iter(ins); g2 = {'input': lambda p='': next(f2)}; b2 = io.StringIO()
                with contextlib.redirect_stdout(b2): exec('\n'.join(sol[:k]), g2)
                for n, v in steps[k - 1][0].items(): seen[n] = v
                now = {n: repr(v) for n, v in g2.items() if n != 'input' and not n.startswith('__')}
                if now != seen: errors.append((tag, 'step %d variables disagree: %r vs %r' % (k, now, seen)))
                shown += steps[k - 1][1]
                if (b2.getvalue().rstrip('\n').split('\n') if b2.getvalue() else []) != shown: errors.append((tag, 'step %d output disagrees' % k))
                for n, v in steps[k - 1][0].items():
                    if v.startswith('"') or _re.search(r'\d\.\d{6,}|e[+-]\d', v): errors.append((tag, 'hard-to-type value %s = %s' % (n, v)))
                if not steps[k - 1][0] and not steps[k - 1][1]: errors.append((tag, 'line %d changes nothing' % k))
            trs.append(dict(title='', intro=story, code=sol, ins=ins, steps=steps))
    trs.sort(key=lambda t: difficulty(t['code']))
    for n_, t_ in enumerate(trs): t_['title'] = 'Trace %d' % (n_ + 1)
    if len({'\n'.join(t['code']) for t in trs}) != len(trs): errors.append((lid, 'duplicate trace'))
    if len(trs) != 10: errors.append((lid, 'expected 10 traces, got %d' % len(trs)))
    T[lid] = dict(num=base['num'], title=base['title'], traces=trs)
if errors:
    for e in errors: print('PROBLEM', e)
    sys.exit(1)
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
open(os.path.join(ROOT, 'python', 'parsons-u3.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/parsons/gen_u3.py. Do not edit by hand. */\nwindow.PARSONS = ' + dump(dict(lessons=P)) + ';\n')
open(os.path.join(ROOT, 'python', 'trace-u3.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/parsons/gen_u3.py. Do not edit by hand. */\nwindow.TRACES = ' + dump(T) + ';\n')
print('OK: %d lessons, %d Parsons, %d traces' % (len(P), sum(len(v['problems']) for v in P.values()), sum(len(v['traces']) for v in T.values())))
