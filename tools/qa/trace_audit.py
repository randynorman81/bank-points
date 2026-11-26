"""Audit of the code-tracing data (python/trace-u3.js, trace-u4.js, trace-u5.js).
 1. every trace is replayed: its steps must rebuild the program's real final variables and real printed output (checked against a plain run of the code)
 2. in every lesson the 10 programs have 10 different structures (AST shapes with names and values removed) and no two share the same 'what the student is asked' profile more than twice
 3. difficulty rises from trace 1 to trace 10 (asked steps + control lines + variables, checked as a rank correlation and first-three vs last-three)
 4. no step description gives away the answer the student is asked for
usage: python3 tools/qa/trace_audit.py [3|4|5 ...]"""
import json, re, ast, sys, os, io, contextlib, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'parsons')); import u4_core
units = sys.argv[1:] or ['3', '4', '5']
FILES = {'3': 'python/trace-u3.js', '4': 'python/trace-u4.js', '5': 'python/trace-u5.js'}
def load(u):
    s = open(os.path.join(ROOT, FILES[u]), encoding='utf-8').read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])
def shape(code):
    t = ast.parse('\n'.join(code))
    class N(ast.NodeTransformer):
        def visit_Name(self, n): return ast.Name(id='v', ctx=n.ctx)
        def visit_Constant(self, n): return ast.Constant(value=type(n.value).__name__)
        def visit_arg(self, n): return ast.arg(arg='a')
        def visit_FunctionDef(self, n): n.name = 'f'; self.generic_visit(n); return n
        def visit_Attribute(self, n): self.generic_visit(n); n.attr = n.attr; return n
    return ast.dump(N().visit(t))
def kind(v):
    if v in ('True', 'False'): return 'bool'
    if re.fullmatch(r'-?\d+', v): return 'int'
    if re.fullmatch(r'-?\d+\.\d+', v): return 'float'
    if v == 'None': return 'none'
    if v.startswith('['): return 'list'
    return 'text'
def profile(t):
    out = []
    for st in t['steps']:
        free = len(st) > 5 and st[5]
        if len(st) > 6 and st[6]: out.append('cond')
        for pl in st[1]: out.append('print:' + '+'.join(kind(tk) for tk in pl.split()[:3]))
        if not free: out += ['v:' + kind(v) for v in st[0].values()]
    return tuple(out)
def difficulty(t): return u4_core.trace_difficulty(t['code'], t['steps'])
def spearman(xs):
    n = len(xs); rank = sorted(range(n), key=lambda i: xs[i]); r = [0] * n
    for k, i in enumerate(rank): r[i] = k
    d2 = sum((r[i] - i) ** 2 for i in range(n)); return 1 - 6 * d2 / (n * (n * n - 1))
bad = 0; total = 0
for u in units:
    T = load(u)
    for lid, L in T.items():
        shapes = {}; profs = collections.Counter(); who = collections.defaultdict(list); diffs = []; probs = []
        for k, t in enumerate(L['traces'], 1):
            total += 1; code = t['code']; ins = t['ins']
            # 1. replay
            real = u4_core.run('\n'.join(code), ins, 1)
            shown = [p for st in t['steps'] for p in st[1]]
            if shown != real: probs.append('trace %d: printed lines differ from a real run' % k)
            state = {}
            for st in t['steps']:
                state.update(st[0])
                for r in (st[4] or []): state.pop(r, None)
            feed = iter(ins); g = {'input': lambda p='': next(feed)}
            with contextlib.redirect_stdout(io.StringIO()): exec(compile('\n'.join(code), 'c', 'exec'), g)
            final = {n: repr(v) for n, v in g.items() if not n.startswith('__') and n != 'input' and isinstance(v, u4_core.SIMPLE)}
            if state != final: probs.append('trace %d: final variables from the steps %r differ from a real run %r' % (k, state, final))
            for st in t['steps']:
                if st[3] < 0 or st[3] >= len(code): probs.append('trace %d: a step points at a line that does not exist' % k)
            # 2. shape and profile
            sh = shape(code); shapes.setdefault(sh, []).append(k); profs[profile(t)] += 1; who[profile(t)].append(k)
            diffs.append(difficulty(t))
            # 4. leaks
            for st in t['steps']:
                desc = st[2] or ''; line = code[st[3]]
                for n, v in st[0].items():
                    if len(st) > 5 and st[5]: continue
                    val = v.strip("'")
                    if val in ('True', 'False', 'None') or len(val) < 2: continue
                    if re.search(r'(?<![\w.])%s(?![\w.])' % re.escape(val), desc) and not re.search(r'(?<![\w.])%s(?![\w.])' % re.escape(val), line):
                        probs.append('trace %d: the description gives away %s = %s: %s' % (k, n, v, desc[:80]))
        if len(shapes) < 10: probs.append('only %d different structures: repeated traces %s' % (len(shapes), [v for v in shapes.values() if len(v) > 1]))
        dup = [p for p, c in profs.items() if c > 2]
        if dup: probs.append('"ask profiles" shared by more than two traces: %s' % [who[p] for p in dup])
        rho = spearman(diffs)
        if rho < 0.75 or sum(diffs[:3]) >= sum(diffs[-3:]): probs.append('difficulty does not rise (rank correlation %.2f, first three %s, last three %s)' % (rho, diffs[:3], diffs[-3:]))
        print('%s %-34s structures %d/10 | distinct ask profiles %d | difficulty %s | rho %.2f %s' % (lid, L['title'][:34], len(shapes), len(profs), diffs, rho, '' if not probs else '  <-- ' + str(len(probs)) + ' PROBLEM(S)'))
        for p in probs: bad += 1; print('      -', p[:230])
print('\ntraces audited: %d | problems: %d' % (total, bad)); sys.exit(1 if bad else 0)
