"""Builds the IST Unit 5 game question bank: ist/unit-6/game-data/l16.js ... l21.js and tools/css5/_bank_qs.json (with the browser checks, for tools/ist/qcheck.mjs).
usage: python3 tools/css5/gen_bank5.py [per_lesson]    then: node tools/ist/qcheck.mjs tools/css5/_bank_qs.json tools/css5/_bank_report.json"""
import sys, os, json, random, re, html
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import qgen5, qgen5b, qgen5c
from qgen5 import Skip, mkq
import gen_css5_gates as G
T = {16: qgen5.L16_T, 17: qgen5b.L17_T, 18: qgen5b.L18_T, 19: qgen5b.L19_T, 20: qgen5c.L20_T, 21: qgen5c.L21_T}
F = {16: qgen5.L16_FACTS, 17: qgen5b.L17_FACTS, 18: qgen5b.L18_FACTS, 19: qgen5b.L19_FACTS, 20: qgen5c.L20_FACTS, 21: qgen5c.L21_FACTS}
TOPIC = {16: 'External CSS and classes', 17: 'CSS by id', 18: 'Selectors and specificity', 19: 'Pseudo-classes and transitions', 20: 'Flexbox', 21: 'Grid'}
PER = int(sys.argv[1]) if len(sys.argv) > 1 else 120
OUT = os.path.join(HERE, '..', '..', 'ist', 'unit-6', 'game-data'); os.makedirs(OUT, exist_ok=True)
def code(s): return re.sub(r'`([^`]+)`', lambda m: '<code>%s</code>' % html.escape(m.group(1), quote=False), s)
def fix(q):
    q['s'] = code(q['s']); q['e'] = code(q['e']); return q
allq = []; counts = {}; errors = []
for l in range(16, 22):
    rng = random.Random(2000 + l); seen = set(); qs = []
    for f in F[l]:
        q = fix(qgen5.qgen.fact_q(rng, l, f)); q['t'] = 'Concepts'
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
        txt = ' '.join([q['s'], q.get('c') or '', q['e']] + q['o'])
        for e in G.audit(txt, l): errors.append((q['id'], e))
    allq += qs
    pub = [dict({k: q[k] for k in ('s', 'c', 'o', 'a', 'e', 't')}, **({'p': q['p']} if q.get('p') else {})) for q in qs]
    open(os.path.join(OUT, 'l%d.js' % l), 'w', encoding='utf-8').write('window.IST_GAME = window.IST_GAME || {};\nIST_GAME[%d] = %s;\n' % (l, json.dumps(pub, ensure_ascii=False, separators=(',', ':'))))
json.dump(allq, open(os.path.join(HERE, '_bank_qs.json'), 'w'), ensure_ascii=False)
print('questions per lesson:', counts, 'total', sum(counts.values()), 'browser checks', sum(len(q['chk']) for q in allq))
for e in errors[:30]: print('ORDER PROBLEM', e)
sys.exit(1 if errors else 0)
