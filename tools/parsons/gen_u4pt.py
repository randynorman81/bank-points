"""Builds python/parsons-u4.js (10 Parsons problems per lesson) and python/trace-u4.js (10 code-tracing problems per lesson) for Unit 4.
Every program is RUN here. Nothing is written unless every check passes.   usage: python3 tools/parsons/gen_u4pt.py [lesson ids]"""
import sys, os, json, random, re, io, contextlib
from multiprocessing import Pool
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
from u4_core import *
from u4_core import trace_difficulty
from u4_traces import TR as CUSTOM_TRACES
SH = {}
for mod in ('u4_shapes1', 'u4_shapes2'):
    try: SH.update(__import__(mod).SH)
    except ImportError: pass
LESSONS = [  # id, number as students see it, title, brand name, color, head
 ('u4l1', '4.1', 'Booleans', 'Instagram', '#C13584', '#ffffff'), ('u4l2', '4.2', 'Logical Operators', 'Disney+', '#113CCF', '#0B1D5E'),
 ('u4l3', '4.3', 'Comparison Operators', 'The New York Times', '#121212', '#ffffff'), ('u4l4', '4.4', 'If Statements', 'Peloton', '#DF1C2F', '#181A1D'),
 ('u4l5', '4.5', 'If, Elif, and Else', 'Starbucks', '#00704A', '#00704A'), ('u4l6', '4.6', 'Key Events', 'Fortnite', '#0A6CFF', '#0B1020'),
 ('u4l7', '4.7', 'For Loops in Python', 'SpaceX', '#005288', '#0B0B0B'), ('u4l8', '4.8', 'General For Loops', 'Amazon', '#FF9900', '#232F3E'),
 ('u4l9', '4.9', 'For Loop Practice', 'Twitch', '#9146FF', '#18181B'), ('u4l10', '4.10', 'While Loops', 'PlayStation', '#0070D1', '#003791'),
 ('u4l11', '4.10b', 'Loop and a Half', 'Venmo', '#3D95CE', '#3D95CE'), ('u4l12', '4.11', 'Random Numbers', 'Nintendo', '#E60012', '#E60012')]
# brand colors: take them from python/workplace.js so the pages match the assignments
try:
    import subprocess
    wk = json.loads(subprocess.run(['node', '-e', 'global.window={};require("%s/python/workplace.js");console.log(JSON.stringify(Object.fromEntries(Object.entries(window.PY_WORK).filter(([k])=>/^a1(39|4\\d|50)$/.test(k)).map(([k,v])=>[k,v.brand]))))' % ROOT], capture_output=True, text=True).stdout)
    ASSIGN = {'u4l%d' % (i + 1): 'a%d' % n for i, n in enumerate(range(139, 151))}
    LESSONS = [(i, n, t, wk[ASSIGN[i]]['name'].title() if wk[ASSIGN[i]]['name'].isupper() or wk[ASSIGN[i]]['name'].islower() else wk[ASSIGN[i]]['name'], wk[ASSIGN[i]]['color'], wk[ASSIGN[i]]['head']) for (i, n, t, b, c, h) in LESSONS]
except Exception as e: print('brand fallback:', e)
errors = []
def fill(sh, row, tr=False):
    d = dict(zip(sh['keys'], row)); base = sh['tr'] if (tr and sh['tr']) else sh
    f = lambda t: t.format(**d)
    return f(sh['title']), f(base['story']), f(base['sol']).split('\n'), [(i, f(t)) for i, t in sh['dis']], [f(x) for x in base['ins']]
rnd = random.Random(11)
def pieces_for(sol, dis):
    ps = [dict(t=t) for t in sol] + [dict(t=t, d=1) for _, t in dis]
    for _ in range(80):
        rnd.shuffle(ps)
        if [p['t'] for p in ps if not p.get('d')] != sol: break
    return ps
def job(a):
    tag, sol, ins, rn, exp = a
    return tag, valid_orders(sol, ins, rn, exp)
def difficulty(lines):
    code = '\n'.join(lines); ops = len(re.findall(r'[+\-*/%]|//|\[|\.find|int\(|float\(|input\(|len\(|and |or |not |==|>=|<=', code))
    nest = max((indent_of(l) for l in lines), default=0) // 4
    return 10 * len(lines) + 3 * ops + 6 * nest
def main(only):
    P, T, jobs, probs_by = {}, {}, [], {}
    for lid, num, title, brand, color, head in LESSONS:
        if lid not in SH or (only and lid not in only): continue
        shapes = SH[lid]; probs = []
        if len(shapes) != 5: errors.append((lid, 'need 5 shapes, have %d' % len(shapes)))
        for si, sh in enumerate(shapes):
            if len(sh['pool']) != 4: errors.append((lid, 'shape %d needs 4 rows' % (si + 1)))
            for row in (0, 1):
                ttl, story, sol, dis, ins = fill(sh, sh['pool'][row]); tag = '%s P%d.%d' % (lid, si + 1, row)
                exp, sample = check_problem(tag, sol, dis, ins, sh['rnd'], errors)
                if exp is None: continue
                if len(sol) > 8: errors.append((tag, 'more than 8 lines'))
                pr = dict(title=ttl, story=story, expect=list(sample), ins=ins, pieces=pieces_for(sol, dis), sol=sol, steps=[describe(l) for l in sol])
                if sh['rnd']: pr['rnd'] = 1
                probs.append((tag, pr, (tag, sol, ins, sh['rnd'], exp)))
        seen = {}
        for tag, pr, j in probs:
            n = seen.get(pr['title'], 0); seen[pr['title']] = n + 1
            if n: pr['title'] += ' (again)'
        probs_by[lid] = probs; jobs += [j for _, _, j in probs]
        trs = []
        for ti, (code, ins) in enumerate(CUSTOM_TRACES[lid]):
            sol = code.split('\n'); tag = '%s T%d' % (lid, ti + 1)
            check_problem(tag, sol, [], ins, False, errors)
            steps, printed = trace(sol, ins)
            if run('\n'.join(sol), ins) != printed: errors.append((tag, 'trace output disagrees with a plain run'))
            if len(steps) > 40: errors.append((tag, 'trace has %d steps (too long)' % len(steps)))
            asked = sum(1 for st in steps if (not st[5] and (st[0] or st[1])) or st[6])
            if asked < 2: errors.append((tag, 'only %d steps ask the student for anything' % asked))
            for k, st in enumerate(steps):
                for v in st[0].values():
                    if re.search(r'\d\.\d{6,}|e[+-]\d', v) or (v.startswith("'") and (v[1:-1] != v[1:-1].strip() or v == "''") and not st[5]) or (v.startswith("'") and ("\\" in v or '"' in v)): errors.append((tag, 'hard-to-type value ' + v))
                    if v.startswith('[') and len(v) > 40 and not st[5]: errors.append((tag, 'list too long to type: ' + v))
                isctl = re.match(r'\s*(if|elif|while|for|def|break|import)\b', sol[st[3]]) or re.fullmatch(r'\s*(\w+)\(.*\)', sol[st[3]]) and re.search(r'^def %s\(' % re.match(r'\s*(\w+)', sol[st[3]]).group(1), '\n'.join(sol), re.M)
                calls_def = any(re.search(r'\b%s\(' % n, sol[st[3]]) for n in re.findall(r'(?m)^def (\w+)\(', '\n'.join(sol)))
                if not st[0] and not st[1] and not isctl and not st[4] and not calls_def: errors.append((tag, 'line %d changes nothing' % (st[3] + 1)))
            intro = 'Trace this program one line at a time. Work out what each line stores or prints.' + (' When it asks for input, the user types %s.' % ', '.join(ins) if ins else '')
            trs.append(dict(title='', intro=intro, code=sol, ins=ins, steps=steps))
        trs.sort(key=(lambda t: trace_difficulty(t['code'], t['steps'])) if lid in CUSTOM_TRACES else (lambda t: difficulty(t['code'])))      # easy to hard (stable)
        for n_, t_ in enumerate(trs): t_['title'] = 'Trace %d' % (n_ + 1)
        if len({'\n'.join(t['code']) + '|' + ','.join(t['ins']) for t in trs}) != len(trs): errors.append((lid, 'duplicate trace'))
        if len(trs) != 10: errors.append((lid, 'expected 10 traces, got %d' % len(trs)))
        T[lid] = dict(num=num, title=title, traces=trs)
        P[lid] = dict(num=num, title=title, brand=dict(name=brand, color=color, head=head), problems=None)
    with Pool(8) as pool: vo = dict(pool.map(job, jobs))
    for lid in P:
        ps = []
        for tag, pr, j in probs_by[lid]:
            pr['valid'] = vo[tag]; ps.append(pr)
        ps.sort(key=lambda p: difficulty(p['sol']))
        if len(ps) != 10: errors.append((lid, 'expected 10 Parsons, got %d' % len(ps)))
        P[lid]['problems'] = ps
    if errors:
        for e in errors: print('PROBLEM', e)
        sys.exit(1)
    return P, T
if __name__ == '__main__':
    only = sys.argv[1:]
    P, T = main(only)
    if only: print('checked', ', '.join(only), '| Parsons', sum(len(v['problems']) for v in P.values()), '| traces', sum(len(v['traces']) for v in T.values()), '| valid orders per problem:', [len(p['valid']) for v in P.values() for p in v['problems']])
    else:
        dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':'))
        open(os.path.join(ROOT, 'python', 'parsons-u4.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/parsons/gen_u4pt.py. Do not edit by hand. */\nwindow.PARSONS4 = ' + dump(dict(lessons=P)) + ';\n')
        open(os.path.join(ROOT, 'python', 'trace-u4.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/parsons/gen_u4pt.py. Do not edit by hand. */\nwindow.TRACES4 = ' + dump(T) + ';\n')
        print('OK: %d lessons, %d Parsons, %d traces' % (len(P), sum(len(v['problems']) for v in P.values()), sum(len(v['traces']) for v in T.values())))
