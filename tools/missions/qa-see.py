"""Adds the output of every reference stage program to testkit/u345-dump.json (for qa-show.py) and writes testkit/u5-see.json (what the 'What you should see' boxes of the Unit 5 clear-layout
assignments show): per stage the NEW output lines, and 'fin' = the output of the last non-stretch stage.   usage: node qa-dump.mjs && python3 qa-see.py [u5]"""
import json, sys, os
sys.path.insert(0, '/Users/randynorman/bank-points/tools/parsons')
import u4_core
D = json.load(open('testkit/u345-dump.json')); prefix = sys.argv[1] if len(sys.argv) > 1 else 'u5'
see = {}
for k, a in D.items():
    prev = []; stages = []; last_core = None
    for s in a['stages']:
        try: out = u4_core.run(s['code'], a['answers'], 1)
        except Exception as e: out = ['<ERROR %s: %s>' % (type(e).__name__, e)]
        new = out[len(prev):] if out[:len(prev)] == prev else out
        s['out'] = out; s['new'] = new; stages.append(new); prev = out
        if not s['title'].startswith('Stretch'): last_core = out
    a['fin'] = last_core
    if k.startswith(prefix): see[k] = dict(stages=stages, fin=last_core)
json.dump(D, open('testkit/u345-dump.json', 'w'))
json.dump(see, open('testkit/u%s-see.json' % prefix[1:], 'w'), ensure_ascii=False)
err = [(k, i) for k, a in D.items() for i, s in enumerate(a['stages']) if any(l.startswith('<ERROR') for l in s['out'])]
print('wrote', len(see), 'lessons; stages that fail to run:', err)
