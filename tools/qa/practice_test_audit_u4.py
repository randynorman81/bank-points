"""Independent check of the Unit 4 practice test: re-derives the answer to every question from scratch (runs the code shown, evaluates the expressions, samples random calls)
and compares it with the answer marked in the page the students get.  Questions that only ask for an idea are listed for a human read.
usage: python3 tools/qa/practice_test_audit_u4.py"""
import json, re, io, contextlib, html, os, random, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UNIT = sys.argv[1] if len(sys.argv) > 1 else '4'      # usage: python3 tools/qa/practice_test_audit_u4.py [4|5]
s = open(os.path.join(ROOT, 'apcsp/unit-%s/unit-%s-practice-test.html' % (UNIT, UNIT)), encoding='utf-8').read(); a = s.index('var Q = ['); Q = json.loads(s[a + 8:s.index('];', a) + 1])
K = json.load(open(os.path.join(ROOT, 'tools/practice/u%s_test_key.json' % UNIT), encoding='utf-8'))
strip = lambda x: html.unescape(re.sub('<[^>]+>', ' ', x)).strip()
txt = lambda x: re.sub(r'\s+', ' ', strip(x))
ok = bad = read = 0
def plain(code, ins, seed=1):
    feed = iter(ins); buf = io.StringIO(); g = {'input': lambda p='': next(feed)}; random.seed(seed)
    sys.setrecursionlimit(2000)
    with contextlib.redirect_stdout(buf): exec(compile(code, 'q', 'exec'), g)
    return buf.getvalue().strip('\n').split('\n') if buf.getvalue() else [], g
def marked_text(q): return [txt(q['o'][j]) for j in q['a']]
def report(i, msg): global bad; bad += 1; print('MISMATCH Q%d: %s' % (i, msg))
assert len(Q) == len(K), 'page and key have a different number of questions'
for i, (q, k) in enumerate(zip(Q, K), 1):
    assert q['s'] == k['s'] and q['o'] == k['o'] and q['a'] == k['a'], 'Q%d page differs from the key' % i
    v = k.get('v', {}); kind = v.get('kind'); good = None
    try:
        if kind in ('out', 'err', 'val', 'count'):
            ins = v.get('ins', [])
            if kind == 'out':
                outs = [plain(q['c'], ins, sd)[0] for sd in ((1, 2, 3, 4, 5, 6) if v.get('rand') else (1,))]
                assert all(o == outs[0] for o in outs), 'output changes between runs'
                want = txt('<br>'.join('<code>%s</code>' % html.escape(x, quote=False) for x in outs[0])) if outs[0] else 'Nothing is displayed'
                good = [want]
            elif kind == 'err':
                try: plain(q['c'], ins); good = ['<no error>']
                except Exception: good = ['An error occurs']
            elif kind == 'val':
                _, g = plain(q['c'], ins); good = [str(repr(g[v['var']]) if isinstance(g[v['var']], str) else g[v['var']])]
            elif kind == 'count':
                o, _ = plain(q['c'], ins); good = [str(sum(1 for x in o if x == v['text']))]
            got = marked_text(q)
            if good == got: ok += 1
            else: report(i, 'derived %r, the page marks %r' % (good, got))
        elif kind == 'eval':
            g = {}; exec(v['setup'], g); tr = [n for n, e in enumerate(v['exprs']) if eval(e, g) is True]
            if tr == sorted(q['a']): ok += 1
            else: report(i, 'True expressions are %r, the page marks %r' % (tr, q['a']))
        elif kind == 'prop':
            fits = [n for n, e in enumerate(v['exprs']) if all(bool(eval(e, {'n': c})) == w for c, w in v['cases'])]
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'fitting options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'execs':
            fits = []
            for n, e in enumerate(v['opts']):
                try:
                    with contextlib.redirect_stdout(io.StringIO()): exec(v['setup'] + '\n' + e, {})
                    fits.append(n)
                except Exception: pass
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'options that run %r, the page marks %r' % (fits, q['a']))
        elif kind == 'range':
            fits = [n for n, e in enumerate(v['opts']) if list(eval(e)) == v['want']]
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'fitting options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'bool':
            fits = []
            for n, e in enumerate(v['opts']):
                try: fits += [n] if type(eval(e)) is bool else []
                except Exception: pass
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'Boolean options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'store':
            fits = []
            for n, e in enumerate(v['opts']):
                g = {'x': 0}
                try: exec(e, g)
                except Exception: continue
                if g['x'] == 5: fits.append(n)
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'storing options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'compile':
            fits = []
            for n, e in enumerate(v['opts']):
                try: compile(e + '\n    pass', 'q', 'exec'); fits.append(n)
                except SyntaxError: pass
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'valid options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'endless':
            fits = []
            for n, e in enumerate(v['opts']):
                src = v['code'] + '\n    ' + e; steps = [0]
                def tr(f, ev, arg):
                    steps[0] += 1
                    if steps[0] > 4000: raise TimeoutError()
                    return tr
                sys.settrace(tr)
                try:
                    with contextlib.redirect_stdout(io.StringIO()): exec(compile(src, 'q', 'exec'), {})
                    fits.append(n)
                except TimeoutError: pass
                except Exception: pass
                finally: sys.settrace(None)
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'terminating options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'random':
            import random as R
            have = []
            for n, e in enumerate(v['opts']):
                vals = {eval(e, {'random': R}) for _ in range(4000)}
                have.append(3 in vals if 'can produce the value 3' in q['s'] else None)
            fits = [n for n, h in enumerate(have) if h]
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'options that can give 3: %r, the page marks %r' % (fits, q['a']))
        elif kind == 'bounds':
            import random as R
            fits = []
            for n, e in enumerate(v['opts']):
                vals = {eval(e, {'random': R}) for _ in range(5000)}
                if min(vals) == v['lo'] and max(vals) == v['hi']: fits.append(n)
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'matching options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'randset':
            import random as R
            have = sorted({R.randint(0, 1) for _ in range(2000)}); fits = [n for n, sset in enumerate(v['sets']) if sset == have]
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'set options %r, the page marks %r' % (fits, q['a']))
        elif kind == 'randcount':
            import random as R
            n_ = len({R.randint(5, 8) for _ in range(3000)})
            if [txt(q['o'][j]) for j in q['a']] == [str(n_)]: ok += 1
            else: report(i, 'derived %d, the page marks %r' % (n_, marked_text(q)))
        elif kind == 'never':
            seen = set()
            for sd in range(1, 300): seen.update(plain(v['code'], [], sd)[0])
            fits = [n for n, it in enumerate(v['items']) if it not in seen]
            if fits == sorted(q['a']): ok += 1
            else: report(i, 'impossible options %r, the page marks %r' % (fits, q['a']))
        else:
            read += 1; print('READ Q%d [%s]: %s | marked: %s' % (i, q['t'], txt(q['s'])[:90], marked_text(q)))
    except Exception as e:
        report(i, 'could not re-derive (%s: %s)' % (type(e).__name__, e))
print('re-derived by running code or evaluating: %d match | mismatches: %d | idea questions for a human read: %d | total %d' % (ok, bad, read, len(Q)))
sys.exit(1 if bad else 0)
