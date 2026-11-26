"""Builds the IST Unit 3 game question bank: ist/unit-6/game-data/l1.js ... l10.js (questions without the checks) and tools/ist/_bank_qs.json (with the browser checks, for qcheck.mjs).
usage: python3 tools/ist/gen_bank.py [per_lesson]     then: node tools/ist/qcheck.mjs tools/ist/_bank_qs.json tools/ist/_bank_report.json"""
import sys, os, json, random
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import qgen
PART2 = 'part2' in sys.argv
PER = int([a for a in sys.argv[1:] if a.isdigit()][0]) if [a for a in sys.argv[1:] if a.isdigit()] else 220
LESS = range(11, 16) if PART2 else range(1, 11)
OUT = os.path.join(HERE, '..', '..', 'ist', 'unit-6', 'game-data'); os.makedirs(OUT, exist_ok=True)
allq = []; counts = {}
for l in LESS:
    rng = random.Random(1000 + l); seen = set(); qs = []
    facts = list(qgen.LESSON_FACTS[l])
    for f in facts:   # every concept fact once
        q = qgen.fact_q(rng, l, f)
        if q['key'] not in seen: seen.add(q['key']); qs.append(q)
    tries = 0
    while len(qs) < PER and tries < 20000:
        tries += 1
        try: q = rng.choice(qgen.LESSON_T[l])(rng)
        except qgen.Skip: continue
        if q['key'] in seen: continue
        seen.add(q['key']); qs.append(q)
    rng.shuffle(qs); counts[l] = len(qs)
    for i, q in enumerate(qs): q['id'] = '%d:%d' % (l, i)
    allq += qs
    pub = [dict(s=q['s'], c=q['c'], o=q['o'], a=q['a'], e=q['e'], t=q['t']) for q in qs]
    open(os.path.join(OUT, 'l%d.js' % l), 'w', encoding='utf-8').write('window.IST_GAME = window.IST_GAME || {};\nIST_GAME[%d] = %s;\n' % (l, json.dumps(pub, ensure_ascii=False, separators=(',', ':'))))
json.dump(allq, open(os.path.join(HERE, '_bank_qs2.json' if PART2 else '_bank_qs.json'), 'w'), ensure_ascii=False)
print('questions per lesson:', counts, 'total', sum(counts.values()), 'browser checks', sum(len(q['chk']) for q in allq))
