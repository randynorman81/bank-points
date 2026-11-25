"""Independent audit of python/parsons-u3.js and python/trace-u3.js (reads the SHIPPED files, not the generator).
Parsons: for every problem, every ordering of its lines is run; the page accepts an ordering exactly when it runs and prints the expected output.
Also: pieces are the solution lines plus decoys, decoys never run into the same output as a correct program, steps list matches.
Tracing: every step is re-derived by running the program line by line and compared with the shipped values."""
import json, io, contextlib, itertools, re, os, copy
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def load(f):
    s = open(os.path.join(ROOT, 'python', f), encoding='utf-8').read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])
def run(code, ins):
    feed = iter(ins); buf = io.StringIO()
    with contextlib.redirect_stdout(buf): exec(code, {'input': lambda p='': next(feed)})
    return buf.getvalue().rstrip('\n').split('\n')
P = load('parsons-u3.js')['lessons']; T = load('trace-u3.js'); problems = errs = perms_checked = 0
def err(*a):
    global errs; errs += 1; print('ERROR', *a)
for lid, L in P.items():
    if len(L['problems']) != 10: err(lid, 'not 10 problems')
    for k, p in enumerate(L['problems']):
        problems += 1; tag = '%s #%d' % (lid, k + 1); sol = p['sol']
        exp = run('\n'.join(sol), p['ins'])
        if exp != p['expect']: err(tag, 'expected output is wrong', exp, p['expect'])
        pieces = sorted(x['t'] for x in p['pieces']); want = sorted(sol + [x['t'] for x in p['pieces'] if x.get('d')])
        if pieces != want: err(tag, 'pieces are not solution + decoys')
        if any(x.get('d') and x['t'] in sol for x in p['pieces']): err(tag, 'a decoy equals a solution line')
        if len(p['steps']) != len(sol): err(tag, 'steps list length')
        ids = {}; seq = [ids.setdefault(t, len(ids)) for t in sol]; texts = list(ids)
        valid = set(p['valid'])
        for perm in set(itertools.permutations(seq)):
            perms_checked += 1; key = ''.join(map(str, perm))
            try: ok = run('\n'.join(texts[i] for i in perm), p['ins']) == exp
            except Exception: ok = False
            if ok != (key in valid): err(tag, 'ordering', key, 'accepted' if key in valid else 'rejected', 'but it', 'works' if ok else 'does not work')
        if any(not x for x in p['steps']): err(tag, 'empty step')
        if not p['story'].strip() or '{' in p['story'] or '}' in p['story']: err(tag, 'story text')
    sizes = [len(p['sol']) for p in L['problems']]
    if sizes != sorted(sizes): err(lid, 'difficulty (line count) is not non-decreasing', sizes)
tr_n = steps_n = 0
for lid, L in T.items():
    if len(L['traces']) != 10: err(lid, 'not 10 traces')
    for k, t in enumerate(L['traces']):
        tr_n += 1; tag = '%s trace %d' % (lid, k + 1)
        feed = iter(t['ins']); g = {'input': lambda p='': next(feed)}; prev = {}; out_all = []
        if len(t['steps']) != len(t['code']): err(tag, 'step count')
        for i, ln in enumerate(t['code']):
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf): exec(ln, g)
            pr = buf.getvalue().rstrip('\n').split('\n') if buf.getvalue() else []
            cur = {n: v for n, v in g.items() if n != 'input' and not n.startswith('__')}
            ch = {n: repr(v) for n, v in cur.items() if n not in prev or prev[n] != v}
            steps_n += 1
            if t['steps'][i][0] != ch or t['steps'][i][1] != pr: err(tag, 'line', i + 1, 'shipped', t['steps'][i][:2], 'recomputed', [ch, pr])
            if not ch and not pr: err(tag, 'line', i + 1, 'changes nothing')
            prev = copy.deepcopy(cur)
        if not t['steps'][-1][1] and not any(s[1] for s in t['steps']): err(tag, 'prints nothing')
print('AUDIT: %d Parsons problems (%d orderings checked), %d traces (%d steps), %d error(s)' % (problems, perms_checked, tr_n, steps_n, errs))
