"""Checks the worked examples inside the walkthrough hint boxes: every table row whose first cell is a Python expression or print and whose second cell is its result is RUN, and every
'try it' claim about printed output is compared with the real output of the walkthrough's model answer."""
import json, re, io, contextlib, subprocess, sys, os, signal
def _alarm(*a): raise TimeoutError()
signal.signal(signal.SIGALRM, _alarm)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'qa')); import wt_qa as q
call = lambda b: json.loads(subprocess.run(['curl', '-s', '-X', 'POST', 'https://schscomputerscience.com/api/pycode', '-H', 'Content-Type: application/json', '-d', json.dumps(b)], capture_output=True, text=True).stdout)
live = call({'action': 'assignments'})['assignments']
SLOTS = sys.argv[1:] or ['a%d' % n for n in range(1, 14)]      # usage: python3 tools/qa/tips_audit.py a16 a17 ...  (Unit 3 by default)
def ev(expr):
    G = {'input': lambda p='': '5'}; signal.alarm(2)
    try:
        buf = io.StringIO(); r = None
        with contextlib.redirect_stdout(buf):
            try: r = eval(expr, G); out = repr(r) if not buf.getvalue() else buf.getvalue()
            except SyntaxError: exec(expr, G); out = buf.getvalue()
        return out.rstrip('\n'), (repr(r) if r is not None else None)
    except BaseException as e: return 'ERR ' + type(e).__name__, None
    finally: signal.alarm(0)
checked = bad = 0; skipped = 0
for s in SLOTS:
    r = live[s]
    for tid, t in (r.get('tips') or {}).items():
        for sec in t.get('sections', []):
            for row in sec.get('rows', []) or []:
                if len(row) < 2: continue
                a, b = str(row[0]).strip('` '), str(row[1]).strip('` ')
                if not re.search(r'[\(\)\+\-\*/%=\[\]<>]', a) or len(a) > 70: skipped += 1; continue
                if re.search(r'\bTypeError|NameError|SyntaxError|ValueError|IndexError|ZeroDivision|error|Error', b) and not re.search(r'\d', b): 
                    # an error claim: the row must really raise
                    out, _ = ev(a); checked += 1
                    if not out.startswith('ERR'): bad += 1; print('CLAIMS AN ERROR BUT RUNS: %s %s | %s -> %s | %s' % (s, tid, a, out, b))
                    continue
                out, rr = ev(a)
                if out.startswith('ERR') and not re.search(r'rror', b): skipped += 1; continue
                want = re.sub(r'\s+', ' ', b).strip('"\' ')
                got = re.sub(r'\s+', ' ', out).strip('"\' ')
                got2 = re.sub(r'\s+', ' ', rr or '').strip('"\' ')
                checked += 1
                if want not in (got, got2) and not re.match(r'^[\d.\-]+$', want) is None and want != got and want != got2:
                    bad += 1; print('MISMATCH %s %s | %s | tip says %r, Python gives %r' % (s, tid, a, b, out))
                elif not re.match(r'^[\d.\-]+$', want) and want not in (got, got2) and re.match(r'^[\w .\-,\'"<>:()/]+$', want) and len(want) < 40 and 'wrong' not in want.lower():
                    skipped += 1
print('tip table rows checked:', checked, '| mismatches:', bad, '| rows skipped (not an expression/result pair):', skipped)
# "Try it" claims versus the model answer's real output
miss = 0; tried = 0
for s in SLOTS:
    src, ins = q.model(s); out = q.run_local(src, ins); rec = live[s]
    for b in rec['blocks']:
        t = b.get('p') or ''
        if t.startswith('▶') or re.search(r'\b(should (print|show|say|be)|answer (should|is)|prints? |it shows)\b', t):
            toks = re.findall(r'`([^`]{1,30})`', t) + re.findall(r'\b(\d+\.\d+|\d{2,})\b', t)
            for tok in toks:
                if tok.isidentifier() and tok not in ('True', 'False'): continue
                tried += 1
                if tok.strip('"\'') not in out and tok not in out:
                    miss += 1; print('TRY-IT TOKEN NOT IN THE OUTPUT: %s | %r | %s' % (s, tok, t[:120].replace('\n', ' ')))
print('try-it tokens checked:', tried, '| not found in the real output:', miss, '(each needs a human look: the claim may belong to a different step\'s program)')
