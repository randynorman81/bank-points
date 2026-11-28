"""Builds the IST Unit 6 game bank: ist/unit-6/game-data/l22.js ... l27.js and tools/bs6/_bank_qs.json (with the browser checks, for tools/ist/qcheck.mjs).
usage: python3 tools/bs6/gen_bank6.py [per_lesson]    then: node tools/ist/qcheck.mjs tools/bs6/_bank_qs.json tools/bs6/_bank_report.json"""
import sys, os, json, random, re, html
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import qgen6, qgen6b, bsgates
from qgen6 import Skip
T = {22: qgen6.L22_T, 23: qgen6.L23_T, 24: qgen6.L24_T, 25: qgen6b.L25_T, 26: qgen6b.L26_T, 27: qgen6b.L27_T}
F = {22: qgen6.L22_FACTS, 23: qgen6.L23_FACTS, 24: qgen6.L24_FACTS, 25: qgen6b.L25_FACTS, 26: qgen6b.L26_FACTS, 27: qgen6b.L27_FACTS}
TOPIC = {22: 'Setting up Bootstrap', 23: 'The grid', 24: 'Typography, colors and buttons', 25: 'Navbar', 26: 'Cards', 27: 'Forms'}
PER = int(sys.argv[1]) if len(sys.argv) > 1 else 100
OUT = os.path.join(HERE, '..', '..', 'ist', 'unit-6', 'game-data'); os.makedirs(OUT, exist_ok=True)
def code(s): return re.sub(r'`([^`]+)`', lambda m: '<code>%s</code>' % html.escape(m.group(1), quote=False), s)
def fix(q): q['s'] = code(q['s']); q['e'] = code(q['e']); return q
allq = []; counts = {}; errors = []
for l in range(22, 28):
    random.seed(l); rng = random.Random(3000 + l); seen = set(); qs = []
    for f in F[l]:
        q = fix(qgen6.qgen.fact_q(rng, l, f)); q['t'] = 'Concepts'
        if q['key'] not in seen: seen.add(q['key']); qs.append(q)
    tries = 0
    while len(qs) < PER and tries < 40000:
        tries += 1
        try: q = fix(rng.choice(T[l])(rng))
        except Skip: continue
        if q is None or q['key'] in seen: continue
        q['t'] = q.get('t') or TOPIC[l]; seen.add(q['key']); qs.append(q)
    rng.shuffle(qs); counts[l] = len(qs)
    for i, q in enumerate(qs):
        q['id'] = '%d:%d' % (l, i)
        raw = ' '.join([q['s'], html.unescape(q.get('c') or ''), q['e']] + [html.unescape(o) for o in q['o']])
        for e in bsgates.audit(raw, l): errors.append((q['id'], e))
    allq += qs
    pub = [dict({k: q[k] for k in ('s', 'c', 'o', 'a', 'e', 't')}, **({'p': q['p']} if q.get('p') else {})) for q in qs]
    open(os.path.join(OUT, 'l%d.js' % l), 'w', encoding='utf-8').write('window.IST_GAME = window.IST_GAME || {};\nIST_GAME[%d] = %s;\n' % (l, json.dumps(pub, ensure_ascii=False, separators=(',', ':'))))
json.dump(allq, open(os.path.join(HERE, '_bank_qs.json'), 'w'), ensure_ascii=False)
print('questions per lesson:', counts, 'total', sum(counts.values()), 'browser checks', sum(len(q['chk']) for q in allq))
for e in errors[:30]: print('ORDER PROBLEM', e)
sys.exit(1 if errors else 0)
