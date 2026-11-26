"""Concept-order audit: a Parsons or trace program must only use what its lesson (and earlier ones) has taught.
Lesson index: 3.1..3.13 = 1..13, 4.1..4.12 = 14..25.  usage: python3 tools/qa/concept_order.py [--unit5]"""
import ast, json, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def idx(lid):
    m = re.match(r'u(\d)l(\d+)', lid); u, n = int(m.group(1)), int(m.group(2)); return n if u == 3 else (13 + n if u == 4 else 25 + n)
import subprocess
def load(f, v):
    return json.loads(subprocess.run(['node', '-e', 'const fs=require("fs");const w={};new Function("window",fs.readFileSync("%s/%s","utf8"))(w);console.log(JSON.stringify(w.%s))' % (ROOT, f, v)], capture_output=True, text=True).stdout)
def uses(code, ins_input=True):
    t = ast.parse(code); out = {}
    strs = set()
    for n in ast.walk(t):
        if isinstance(n, ast.Assign) and len(n.targets) == 1 and isinstance(n.targets[0], ast.Name):
            v = n.value
            if (isinstance(v, ast.Constant) and isinstance(v.value, str)) or (isinstance(v, ast.Call) and isinstance(v.func, ast.Name) and v.func.id in ('str', 'input')): strs.add(n.targets[0].id)
    def isstr(e): return (isinstance(e, ast.Constant) and isinstance(e.value, str)) or (isinstance(e, ast.Call) and isinstance(e.func, ast.Name) and e.func.id == 'str') or (isinstance(e, ast.Name) and e.id in strs) or (isinstance(e, ast.Call) and isinstance(e.func, ast.Name) and e.func.id == 'input') or (isinstance(e, ast.Subscript) and isstr(e.value)) or (isinstance(e, ast.BinOp) and (isstr(e.left) or isstr(e.right)) and isinstance(e.op, ast.Add)) or (isinstance(e, ast.Call) and isinstance(e.func, ast.Attribute) and e.func.attr in ('upper', 'lower'))
    def add(k, lvl): out.setdefault(k, lvl)
    for n in ast.walk(t):
        if isinstance(n, ast.Call):
            f = n.func
            if isinstance(f, ast.Name):
                if f.id == 'print' and len(n.args) > 1: add('print with commas', 4)
                elif f.id == 'type': add('type()', 2)
                elif f.id in ('int', 'float'):
                    a = n.args[0] if n.args else None
                    add('int()/float() on input', 3) if (isinstance(a, ast.Call) and isinstance(a.func, ast.Name) and a.func.id == 'input') or (isinstance(a, ast.Name) and a.id in strs) else add('int()/float() conversion', 8)
                elif f.id == 'str': add('str()', 4)
                elif f.id == 'len': add('len()', 5)
                elif f.id == 'round': add('round()', 12)
                elif f.id == 'input': add('input()', 3)
                elif f.id in ('abs', 'min', 'max', 'sum', 'pow'): add(f.id + '()', 26)
            elif isinstance(f, ast.Attribute):
                if f.attr == 'find': add('.find()', 7)
                elif f.attr in ('upper', 'lower'): add('.upper()/.lower()', 7)
                elif f.attr in ('randint', 'choice'): add('random', 25)
                elif f.attr == 'sqrt': add('math', 26)
        elif isinstance(n, ast.BinOp):
            op = type(n.op)
            if op is ast.Div: add('/ division', 9)
            elif op is ast.FloorDiv: add('// floor division', 10)
            elif op is ast.Mod: add('% remainder', 11)
            elif op is ast.Pow: add('** power', 12)
            elif op is ast.Add and (isstr(n.left) or isstr(n.right)): add('joining strings with +', 3)
            elif op is ast.Mult and (isstr(n.left) or isstr(n.right)): add('repeating a string with *', 4)
        elif isinstance(n, ast.Subscript):
            add('slice [a:b]', 6) if isinstance(n.slice, ast.Slice) else add('indexing [i]', 5)
        elif isinstance(n, ast.Compare): add('comparison', 2)
        elif isinstance(n, ast.BoolOp): add('and / or', 15)
        elif isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.Not): add('not', 14)
        elif isinstance(n, ast.If): add('if', 17)
        elif isinstance(n, ast.FunctionDef): add('def', 19)
        elif isinstance(n, ast.Global): add('global', 19)
        elif isinstance(n, ast.For): add('for', 20)
        elif isinstance(n, ast.While): add('while', 23)
        elif isinstance(n, ast.Break): add('break', 24)
        elif isinstance(n, ast.List): add('list', 21)
        elif isinstance(n, ast.Import): add('import', 25)
        elif isinstance(n, ast.AugAssign): add('+= shortcut', 99)
        elif isinstance(n, ast.JoinedStr): add('f-string', 99)
        elif isinstance(n, (ast.Tuple, ast.Dict)): add('tuple/dict', 99)
    for n in ast.walk(t):
        if isinstance(n, ast.If) and n.orelse: out['if'] = 17; out['elif/else'] = 18
    return out
bad = []; tot = 0
srcs = [(3, 'python/parsons-u3.js', 'PARSONS', 'python/trace-u3.js', 'TRACES'), (4, 'python/parsons-u4.js', 'PARSONS4', 'python/trace-u4.js', 'TRACES4')]
if '--unit5' in sys.argv: srcs.append((5, 'python/parsons-u5.js', 'PARSONS5', 'python/trace-u5.js', 'TRACES5'))
for u, pf, pv, tf, tv in srcs:
    P = load(pf, pv); P = P.get('lessons', P); T = load(tf, tv)
    for lid, L in P.items():
        for k, p in enumerate(L['problems']):
            tot += 1
            for c, lvl in uses('\n'.join(p['sol'])).items():
                if lvl > idx(lid) and lvl < 90 + 10: bad.append(('Parsons', lid, k + 1, c, lvl, '\n'.join(p['sol'])))
    for lid, L in T.items():
        for k, t in enumerate(L['traces']):
            tot += 1
            for c, lvl in uses('\n'.join(t['code'])).items():
                if lvl > idx(lid): bad.append(('Trace', lid, k + 1, c, lvl, '\n'.join(t['code'])))
byl = {}
for b in bad: byl.setdefault((b[1], b[0]), []).append(b)
for (lid, kind), v in sorted(byl.items(), key=lambda x: (idx(x[0][0]), x[0][1])):
    print('%s %s: %d programs use things not taught yet:' % (lid, kind, len({x[2] for x in v})), '; '.join(sorted({'#%d %s (lesson %s)' % (x[2], x[3], x[4]) for x in v}))[:300])
print('programs audited:', tot, '| programs using later material:', len({(b[0], b[1], b[2]) for b in bad}))
