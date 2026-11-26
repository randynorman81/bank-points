"""QA for the Unit 3 walkthroughs (a1-a13): builds a model answer from what the walkthrough tells the student to type, scores it on the LIVE server,
and lists every check that is still missing. A check that cannot be met by following the instructions is a defect.
usage: python3 tools/qa/wt_qa.py a1 [a2 ...]   (add --show to print the program)"""
import json, subprocess, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
API = os.environ.get('API', 'https://schscomputerscience.com/api/pycode')
def call(d):
    import time
    for attempt in range(6):      # the server sometimes answers with nothing when it is busy: wait and ask again
        out = subprocess.run(['curl', '-s', '-X', 'POST', API, '-H', 'Content-Type: application/json', '-d', json.dumps(d)], capture_output=True, text=True).stdout
        try: return json.loads(out)
        except ValueError: time.sleep(2 + 2 * attempt)
    raise RuntimeError('the server did not answer')
def score(slot, code, output=''): return call({'action': 'score', 'slot': slot, 'code': code, 'output': output})
_CACHE = {}
def record(slot):
    if 'A' not in _CACHE:      # fetched once per run (set QA_CACHE=/path.json to reuse a saved copy)
        cp = os.environ.get('QA_CACHE')
        if cp and os.path.exists(cp): A = json.load(open(cp))
        else: A = call({'action': 'assignments'})
        _CACHE['A'] = A.get('assignments', A)
    return _CACHE['A'][slot]
def boxes_of(rec):
    out = []; cur = None
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+)', b['h']); cur = int(m.group(1)) if m else None
        for k in ('make', 'build', 'where'):
            if k in b:
                for t in b[k]: out.append((cur, t))
    return out
def naive(rec):
    """heading comment + every code block of each step, in order"""
    lines = []; cur = None
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+): (.*)', b['h'])
            if m and 'Stretch' not in b['h']: lines.append('# Step %s: %s' % (m.group(1), m.group(2)))
        if 'code' in b and 'Step' in ''.join(lines[-1:] or ['']) or ('code' in b and lines): lines.append(b['code'])
    return '\n'.join(lines)
if __name__ == '__main__':
    slots = [a for a in sys.argv[1:] if not a.startswith('--')] or ['a%d' % i for i in range(1, 14)]
    for s in slots:
        rec = record(s); code = naive(rec); r = score(s, code)
        print('%s %s: naive model answer passes %d of %d checks (%d%%); still missing %d' % (s, rec['title'][:34], r['passed'], r['total'], r['pct'], len(r['missing'])))
        if '--show' in sys.argv: print(code)

# ---------- model answers (tools/qa/model/aN.py): written from the walkthrough's own instructions ----------
import io, contextlib
def run_local(code, inputs):
    feed = iter(inputs); buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf): exec(compile(code, 'model', 'exec'), {'input': lambda p='': (print(p, end=''), next(feed))[1]})
    except Exception as e: buf.write('\n%s: %s' % (type(e).__name__, e))
    return buf.getvalue()
def model(slot):
    p = os.path.join(ROOT, 'tools', 'qa', 'model', slot + '.py')
    if not os.path.exists(p): return None, []
    src = open(p, encoding='utf-8').read(); ins = []
    m = re.match(r'#!inputs:(.*)\n', src)
    if m: ins = m.group(1).strip().split('|'); src = src[m.end():]
    return src, ins
def check_model(slot, show=True):
    src, ins = model(slot)
    if src is None: print(slot, 'no model answer yet'); return None
    out = run_local(src, ins); r = score(slot, src, out)
    print('%s: model answer passes %d of %d checks (%d%%)%s' % (slot, r['passed'], r['total'], r['pct'], '' if r['passed'] == r['total'] else '  <-- %d MISSING' % len(r['missing'])))
    if show:
        rec = record(slot); bx = boxes_of(rec)
        for m_ in r['missing']:
            b = m_['box'][0] if isinstance(m_['box'], list) else m_['box']
            print('   MISSING box %s: %s   [%s]' % (b, m_['label'], re.sub(r'\[\[.*?\]\]', '', re.sub(r'\s+', ' ', bx[b][1]))[:90] if b is not None and b < len(bx) else ''))
    return r
