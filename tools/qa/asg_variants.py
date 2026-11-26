"""Positive variant tests for the ASSIGNMENTS a126-a150 (Units 3 and 4), live scorer. The finished program from tools/missions/testkit/verify.json scores 100; the same program
typed with single quotes / no spaces / blank lines / Tab indents / 2-space indents must still score 100. usage: python3 tools/qa/asg_variants.py [a126 ...]"""
import sys, os, json, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q, wt_variants as V
REAL = sys.stdout
ROOT = q.ROOT
D = {e['slot']: e for e in json.load(open(os.path.join(ROOT, 'tools/missions/testkit/verify.json')))}
slots = sys.argv[1:] or ['a%d' % i for i in range(126, 151)]
bad = tot = 0
for s in slots:
    e = D[s]; code = e['code']; out0 = e['output']
    base = q.score(s, code, out0); row = ['base %d' % base['pct']]
    if base['pct'] != 100: print(s, 'BASE', base['pct'], [m['label'][:50] for m in base['missing'][:3]]); bad += 1; continue
    local = q.run_local(code, [])
    same_local = local.strip() == out0.strip()
    vs = V.variants(code)
    def one(nv):
        name, v = nv
        if v is None: return name, None, None
        o = q.run_local(v, []) if same_local else out0
        r = q.score(s, v, o); return name, r['pct'], [m['label'][:60] for m in r['missing'][:2]]
    with cf.ThreadPoolExecutor(4) as ex: res = list(ex.map(one, vs))
    sys.stdout = REAL
    for name, pct, miss in res:
        tot += 1
        if pct is None: row.append(name); continue
        row.append('%s %d' % (name, pct))
        if pct < 100: bad += 1; row[-1] += ' MISSING ' + '; '.join(miss)
    print(s, '' if same_local else '(local run differs: recorded output used)', ' | '.join(row)); sys.stdout.flush()
print('\nvariants run: %d   problems: %d' % (tot, bad))
