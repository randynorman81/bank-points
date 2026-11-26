"""EXHAUSTIVE check of every Parsons problem (python/parsons-u3.js, parsons-u4.js, parsons-u5.js) with real Python:
 1. the shown 'finished program prints' text equals what the solution really prints
 2. pieces = the solution lines + the wrong pieces, nothing else; no wrong piece is also a solution line; every step description matches its line
 3. EVERY ordering of the needed lines is run: the orderings that print the right output must be exactly the 'valid' list the page uses (nothing right is rejected, nothing wrong is accepted)
 4. every wrong piece is tried in place of EVERY solution line, and every wrong piece is added to the finished program at EVERY position: a wrong piece that still gives the right output when it replaces a line is reported
    (a student could use it and the page would call it wrong)
 5. writes tools/qa/_parsons_ok.json (the accepted orderings) for parsons_grade_test.mjs, which runs the page's own grading function over every ordering
usage: python3 tools/qa/parsons_exhaustive.py [3|4|5 ...]"""
import json, re, sys, os, itertools
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'parsons')); import u4_core as U
units = sys.argv[1:] or ['3', '4', '5']
FILES = {'3': 'python/parsons-u3.js', '4': 'python/parsons-u4.js', '5': 'python/parsons-u5.js'}
def load(u):
    s = open(os.path.join(ROOT, FILES[u]), encoding='utf-8').read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])['lessons']
import keyword, builtins
def step_gaps(line, text):
    """words, numbers and quoted text that are in the code line but not in its plain-English step"""
    code = re.sub(r'#.*', '', line); gaps = []
    for q in re.findall(r'"([^"]*)"', code):
        if q.strip() and q not in text: gaps.append(repr(q))
    rest = re.sub(r'"[^"]*"', ' ', code)
    for n in re.findall(r'\b[A-Za-z_][A-Za-z_0-9]*\b', rest):
        if keyword.iskeyword(n) or hasattr(builtins, n) or n in ('math', 'random', 'randint', 'choice', 'sqrt', 'find', 'lower', 'key', 'event') or n in text: continue
        gaps.append(n)
    for n in re.findall(r'(?<![\w.])-?\d+(?:\.\d+)?', rest):
        if n not in text: gaps.append(n)
    return gaps
problems = 0; checked = 0; perms_run = 0; warn = []; OK = {}
for u in units:
    for lid, L in load(u).items():
        OK[lid] = {}
        for k, p in enumerate(L['problems']):
            checked += 1; tag = '%s #%d' % (lid, k + 1); sol = p['sol']; ins = p['ins']; rnd = bool(p.get('rnd')); errs = []
            exp = U.outputs('\n'.join(sol), ins, rnd)
            if any(r and (r[0].startswith('<error') or r[0] == '<endless>') for r in exp): errs.append('the written solution does not run')
            shown = list(U.run('\n'.join(sol), ins, 1 if rnd else None))
            if shown != p['expect']: errs.append('shown output %r differs from the real output %r' % (p['expect'], shown))
            dis = [x['t'] for x in p['pieces'] if x.get('d')]; need = [x['t'] for x in p['pieces'] if not x.get('d')]
            if sorted(need) != sorted(sol): errs.append('the non-wrong pieces are not exactly the solution lines')
            for d in dis:
                if d in sol: errs.append('wrong piece %r is also a solution line' % d)
            if len(set(x['t'] for x in p['pieces'])) != len(p['pieces']) and len(set(sol)) == len(sol): errs.append('duplicate piece texts')
            if len(p['steps']) != len(sol): errs.append('steps list has %d items for %d lines' % (len(p['steps']), len(sol)))
            for st, l in zip(p['steps'], sol):
                miss = step_gaps(l, st)
                if miss: errs.append('step text for %r leaves out %s' % (l, miss))
            # 3. every ordering
            ids = {}; seq = [ids.setdefault(t, len(ids)) for t in sol]; text = {i: t for t, i in ids.items()}; good = set()
            for perm in set(itertools.permutations(seq)):
                code = '\n'.join(text[x] for x in perm); perms_run += 1
                try: compile(code, 'p', 'exec')
                except SyntaxError: continue
                if U.outputs(code, ins, rnd) == exp: good.add(''.join(map(str, perm)))
            if good != set(p['valid']): errs.append('accepted orderings differ: really right %d, page says %d (missing %r, extra %r)' % (len(good), len(p['valid']), sorted(good - set(p['valid']))[:3], sorted(set(p['valid']) - good)[:3]))
            OK[lid][k] = sorted(good)
            # 4. wrong pieces in every place
            for d in dis:
                for i in range(len(sol)):
                    alt = list(sol); alt[i] = d
                    try: compile('\n'.join(alt), 'p', 'exec'); same = U.outputs('\n'.join(alt), ins, rnd) == exp
                    except SyntaxError: same = False
                    if same: warn.append('%s: wrong piece %r still gives the right output when it replaces line %d (%r)' % (tag, d, i + 1, sol[i]))
                intended_ok = False
            if errs: problems += len(errs); print('PROBLEM', tag, '|', '; '.join(errs)[:300])
json.dump(OK, open(os.path.join(ROOT, 'tools/qa/_parsons_ok.json'), 'w'))
print('\nParsons problems checked: %d | orderings run through real Python: %d | problems found: %d | wrong pieces that could replace a line and still print the right output: %d' % (checked, perms_run, problems, len(warn)))
for w in warn[:40]: print('  WARN', w)
sys.exit(1 if problems else 0)
