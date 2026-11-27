"""runs oracle.mjs over every Unit 5 Parsons problem and prints the trouble. usage: python3 run_oracle.py [5.1 5.2 ...]"""
import sys, json, subprocess, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import p5a, p5b
LES = {'5.1': p5a.P51, '5.2': p5a.P52, '5.3': p5a.P53, '5.4': p5b.P54, '5.5': p5b.P55, '5.6': p5b.P56}
def page_ctx(p): return p['ctx'] or ''
def build(only=None):
    probs = []
    for num, L in LES.items():
        if only and num not in only: continue
        for i, p in enumerate(L):
            probs.append(dict(id='%s P%d' % (num, i + 1), mode=p['mode'], ctx=p['ctx'] or '', css=p['css'] or '', lines=p['lines'], dis=p['dis']))
    return probs
if __name__ == '__main__':
    only = sys.argv[1:]
    probs = build(only)
    open('/private/tmp/claude-501/c5in.json', 'w').write(json.dumps(probs))
    r = subprocess.run(['node', os.path.join(HERE, 'oracle.mjs'), '/private/tmp/claude-501/c5in.json', '/private/tmp/claude-501/c5out.json'], capture_output=True, text=True)
    out = json.load(open('/private/tmp/claude-501/c5out.json'))
    bad = 0
    for p, o in zip(probs, out):
        if 'error' in o: print('ERROR', p['id'], o['error']); bad += 1; continue
        msgs = []
        if o['badDis']: msgs.append('wrong pieces that still work: %s' % o['badDis'])
        if len(o['valid']) > 3000: msgs.append('too many valid orders %d' % len(o['valid']))
        if not o['valid']: msgs.append('no valid order (the solution itself?)')
        if len(p['lines']) > 8: msgs.append('more than 8 lines')
        if msgs: bad += 1; print(p['id'], '|', '; '.join(msgs), '| valid', len(o['valid']), 'lines', len(p['lines']))
    print('problems', len(probs), 'with trouble', bad)
