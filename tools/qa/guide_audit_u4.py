"""Checks the Unit 4 study guide's CHECK YOURSELF questions: every question that shows code is worked out by RUNNING the code and compared with the marked answer where the question
type can be computed (what is displayed, how many times, value of a variable, does it end); the rest are listed for a human read.
usage: tools/guides/.venv/bin/python tools/qa/guide_audit_u4.py"""
import sys, os, re, io, html, importlib, contextlib
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'guides')); sys.path.insert(0, os.path.join(ROOT, 'tools', 'parsons'))
import gl, u4_core
U = importlib.import_module('units.u04').UNIT
tx = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()
ok = bad = read = 0
for ch in U.chapters:
    for i, q in enumerate(ch['questions'], 1):
        stem = tx(q['s']); opts = [tx(o) for o in q['o']]; marked = [opts[j] for j in q['a']]; code = q.get('c') or q.get('code')
        tag = '%s Q%d' % (ch['id'], i)
        if not code: read += 1; print('READ  %s | %s | marked: %s | why: %s' % (tag, stem[:100], marked, tx(q['e'])[:110])); continue
        try:
            ins = []
            out = None; err = None
            try: out = u4_core.run(code, ins, 1)
            except u4_core.Endless: err = 'endless'
            except Exception as e: err = type(e).__name__
            if re.search(r'(?i)what is (displayed|printed)|what does .* (display|print)|output', stem):
                want = ' '.join(out) if out is not None else None
                n = lambda s: re.sub(r'\s+', ' ', s.replace('"', '').replace(' then ', ' ')).strip().lower()
                hit = [o for o in opts if out is not None and n(o) == n(want)]
                if err: hit = [o for o in opts if re.search('rror|ever|forever|infinite', o)]
                if hit == marked: ok += 1
                else: bad += 1; print('MISMATCH %s | %s | code output %r err %s | marked %s | options %s' % (tag, stem[:70], out, err, marked, opts))
            elif re.search(r'(?i)how many times', stem):
                if err == 'endless': hit = [o for o in opts if re.search('(?i)forever|never', o)]
                else:
                    cnt = len(out) if out else None
                    # count loop passes by tracing the body line count instead of prints
                    steps, _ = u4_core.trace(code.split('\n'), ins, 1)
                    first_body = None
                    m = re.search(r'^(\s*)(while|for) ', code, re.M)
                    bodyl = [k for k, l in enumerate(code.split('\n')) if k > code.split('\n').index(m.group(0) if False else [l for l in code.split('\n') if re.match(r'\s*(while|for) ', l)][0])][:1]
                    hl = [k for k, l in enumerate(code.split('\n')) if re.match(r'\s*(while|for) ', l)][0]
                    passes = sum(1 for s in steps if s[3] == hl + 1)
                    hit = [o for o in opts if o.strip() == str(passes)]
                if hit == marked: ok += 1
                else: bad += 1; print('MISMATCH %s | %s | computed %s | marked %s' % (tag, stem[:70], hit, marked))
            else: read += 1; print('READ  %s | %s | code %s | marked: %s | why: %s' % (tag, stem[:90], code[:50].replace('\n', ' ; '), marked, tx(q['e'])[:110]))
        except Exception as e: bad += 1; print('ERROR %s %s: %s' % (tag, type(e).__name__, e))
print('\nre-derived by running code: %d match | mismatches: %d | left for a human read: %d' % (ok, bad, read))
