"""Equivalent-code tests for the ASSIGNMENTS a126-a150. The finished program is rewritten in ways that mean exactly the same thing to Python:
   aug     x = x + 1  ->  x += 1                    unaug   x += 1  ->  x = x + 1
   swapmul a * b -> b * a  (two simple terms)       swapadd a + b -> b + a  (two simple terms)
   swapeq  a == b -> b == a, a != b -> b != a       flipcmp a > b -> b < a, a >= b -> b <= a
   swapand p and q -> q and p  (two simple comparisons)
Output is unchanged, so every variant must still score 100. A score below 100 lists the check that is too narrow. usage: [API=http://localhost:8124/api/pycode] python3 tools/qa/asg_equiv.py [a126 ...]"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
D = {e['slot']: e for e in json.load(open(os.path.join(q.ROOT, 'tools/missions/testkit/verify.json')))}
slots = sys.argv[1:] or ['a%d' % i for i in range(126, 151)]
T = r'(?:-?\d+(?:\.\d+)?|[A-Za-z_]\w*(?:\[[^\]\[]*\])?|len\([A-Za-z_]\w*\))'
def apply(code, fn):
    out = []; changed = 0
    for l in code.split('\n'):
        body, sep, cm = l.partition('  #') if '"' not in l.split('#')[0][-1:] else (l, '', '')
        if l.lstrip().startswith('#') or '#' in l and l.index('#') < (l.find('"') if '"' in l else 10**9) and False: out.append(l); continue
        # protect strings: split on quoted pieces
        parts = re.split(r'("[^"]*"|\'[^\']*\')', body); new = []
        for i, p in enumerate(parts):
            if i % 2: new.append(p); continue
            np = fn(p)
            if np != p: changed += 1
            new.append(np)
        out.append(''.join(new) + sep + cm)
    return '\n'.join(out), changed
def aug(p):
    return re.sub(r'^(\s*)([A-Za-z_]\w*) = \2 ([+\-*]) (%s)\s*$' % T, r'\1\2 \3= \4', p)
def unaug(p):
    return re.sub(r'^(\s*)([A-Za-z_]\w*) ([+\-*])= (%s)\s*$' % T, r'\1\2 = \2 \3 \4', p)
def swap(op):
    def f(p):
        return re.sub(r'(?<![\w.\])])(%s) %s (%s)(?![\w.(\[]|\s*[*/+\-%%]\s*\w)' % (T, re.escape(op), T), r'\2 %s \1' % op, p) if not re.search(r'[*/+\-]\s*%s %s |%s %s .*[*/+\-%%] ' % (T, re.escape(op), T, re.escape(op)), p) else p
    return f
def flip(p):
    p = re.sub(r'(%s) >= (%s)' % (T, T), r'\2 <= \1', p); return re.sub(r'(%s) > (%s)' % (T, T), r'\2 < \1', p)
def swapeq(p): return re.sub(r'(%s) (==|!=) (%s)' % (T, T), r'\3 \2 \1', p)
def swapand(p): return re.sub(r'(?<=if )(%s \S{1,2} %s) and (%s \S{1,2} %s)(?=:)' % (T, T, T, T), r'\2 and \1', p)
VARS = [('aug', aug), ('unaug', unaug), ('swapmul', swap('*')), ('swapadd', swap('+')), ('swapeq', swapeq), ('flipcmp', flip), ('swapand', swapand)]
bad = tot = 0
for s in slots:
    e = D[s]; code = e['code']; base = q.score(s, code, e['output'])
    if base['pct'] != 100: print(s, 'BASE', base['pct']); bad += 1; continue
    row = []
    for name, fn in VARS:
        v, n = apply(code, fn)
        if not n: continue
        try: compile(v, 'v', 'exec')
        except SyntaxError as ex: row.append('%s BROKEN %s' % (name, ex)); bad += 1; continue
        loc0 = q.run_local(code, []); locv = q.run_local(v, [])
        ok_local = (loc0 == locv)
        r = q.score(s, v, e['output']); tot += 1
        row.append('%s(%d) %d%s%s' % (name, n, r['pct'], '' if ok_local else ' [local output differs!]', '' if r['pct'] == 100 else ' MISSING: ' + '; '.join(m['label'][:55] for m in r['missing'][:3])))
        if r['pct'] < 100 or not ok_local: bad += 1
    print(s, ' | '.join(row) or '(nothing to rewrite)'); sys.stdout.flush()
print('\nvariants run: %d   problems: %d' % (tot, bad))
