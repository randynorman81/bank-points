"""Another correct way to print a label and a value gives the SAME output. Each finished program a126-a150 (verify.json) is rewritten so that every
print("Label:", value)  becomes  (1) print("Label: " + str(value))   (2) print(f"Label: {value}")
and scored live with the real output. Output lines are unchanged, so a score below 100 means a check insists on the comma form (listed: a person decides if the step text says 'with a comma').
usage: python3 tools/qa/asg_print_variants.py [a126 ...]"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
D = {e['slot']: e for e in json.load(open(os.path.join(q.ROOT, 'tools/missions/testkit/verify.json')))}
slots = sys.argv[1:] or ['a%d' % i for i in range(126, 151)]
P = re.compile(r'^(\s*)print\(\s*"([^"]*?)"\s*,\s*(.+?)\s*\)\s*(#.*)?$')
for s in slots:
    e = D[s]; code = e['code']; lines = code.split('\n'); n = sum(1 for l in lines if P.match(l))
    if not n: print(s, 'no label+value prints'); continue
    def conv(fmt):
        out = []
        for l in lines:
            m = P.match(l)
            if not m: out.append(l); continue
            ind, lab, val, cm = m.group(1), m.group(2), m.group(3), m.group(4) or ''
            sp = '' if lab.endswith(' ') else ' '
            if fmt == 'plus': out.append('%sprint("%s%s" + str(%s))%s' % (ind, lab, sp, val, ('  ' + cm) if cm else ''))
            else: out.append('%sprint(f"%s%s{%s}")%s' % (ind, lab, sp, val, ('  ' + cm) if cm else ''))
        return '\n'.join(out)
    res = []
    for fmt in ('plus', 'fstring'):
        v = conv(fmt); r = q.score(s, v, e['output']); res.append('%s %d%s' % (fmt, r['pct'], '' if r['pct'] == 100 else ' MISSING: ' + '; '.join(m['label'][:50] for m in r['missing'][:4])))
    print(s, '(%d prints)' % n, ' | '.join(res)); sys.stdout.flush()
