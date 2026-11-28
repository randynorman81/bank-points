"""runs oracle.mjs over every Unit 6 Parsons problem. usage: python3 run_oracle.py [6.1 6.2 ...]"""
import sys, json, subprocess, os
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import p6a, p6b
LES = {'6.1': p6a.P61, '6.2': p6a.P62, '6.3': p6a.P63, '6.4': p6b.P64, '6.5': p6b.P65, '6.6': p6b.P66}
def build(only=None):
    out = []
    for num, L in LES.items():
        if only and num not in only: continue
        for i, p in enumerate(L): out.append(dict(id='%s P%d' % (num, i + 1), mode=p['mode'], css=p['css'] or '', pre=p['pre'], post=p['post'], lines=p['lines'], dis=p['dis']))
    return out
def run(probs):
    open('/private/tmp/claude-501/c6in.json', 'w').write(json.dumps(probs))
    r = subprocess.run(['node', os.path.join(HERE, 'oracle.mjs'), '/private/tmp/claude-501/c6in.json', '/private/tmp/claude-501/c6out.json'], capture_output=True, text=True)
    return {o['id']: o for o in json.load(open('/private/tmp/claude-501/c6out.json'))}
if __name__ == '__main__':
    probs = build(sys.argv[1:]); out = run(probs); bad = 0
    for p in probs:
        o = out[p['id']]
        if 'error' in o: print('ERROR', p['id'], o['error']); bad += 1; continue
        m = []
        if o['badDis']: m.append('wrong pieces that still work: %s' % [(d[0][:60], d[1]) for d in o['badDis']])
        if len(o['valid']) > 3000: m.append('too many valid orders %d' % len(o['valid']))
        if not o['valid']: m.append('no valid order')
        if len(p['lines']) > 8: m.append('more than 8 lines')
        if m: bad += 1; print(p['id'], '|', '; '.join(m), '| valid', len(o['valid']))
    print('problems', len(probs), 'with trouble', bad)
