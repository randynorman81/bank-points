"""Info test: prediction comments typed in other words. Each model-answer comment that holds a prediction after "I think " is rewritten:
   "# h" | "# prints h" | "# my guess: h" | "# prediction: h" | "# it will print h" | "# the answer is h"
then scored live. A drop below 100 means the check wants one fixed phrase (listed for review)."""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
FORMS = ['# {v}', '# prints {v}', '# my guess: {v}', '# prediction: {v}', '# it will print {v}', '# the answer is {v}', '# I predict {v}', '# {v}  (I think)']
slots = sys.argv[1:] or ['a%d' % i for i in range(1, 14)] + ['a%d' % i for i in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)]
for s in slots:
    src, ins = q.model(s)
    if not re.search(r'#.*\bI think ', src): continue
    res = []
    for f in FORMS:
        def sub(m): return f.format(v=m.group(2).strip())
        v = '\n'.join(re.sub(r'#\s*(.*?)\bI think (.+)$', sub, l) if re.search(r'\S\s+#.*\bI think ', l) else l for l in src.split('\n'))
        r = q.score(s, v, q.run_local(v, ins)); res.append((f, r['pct'], [m['label'][:50] for m in r['missing'][:2]]))
    print(s, ' | '.join('%s=%d' % (f.replace('{v}', 'V')[:22], p) for f, p, _ in res))
    for f, p, m in res:
        if p < 100: print('     %-26s missing: %s' % (f, m))
