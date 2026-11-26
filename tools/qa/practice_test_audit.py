"""Re-derives the answer to every practice-test question that shows code (runs it) and compares it with the marked answer; lists the rest for a human read."""
import json, re, io, contextlib, html, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
s = open(os.path.join(ROOT, 'apcsp/unit-3/unit-3-practice-test.html'), encoding='utf-8').read(); a = s.index('var Q = ['); Q = json.loads(s[a + 8:s.index('];', a) + 1])
strip = lambda x: html.unescape(re.sub('<[^>]+>', '', x)).strip()
ok = bad = manual = 0
for i, q in enumerate(Q, 1):
    stem = strip(q['s']); opts = [strip(o) for o in q['o']]; marked = [opts[j] for j in q['a']]
    if q.get('c'):
        typed = re.findall(r'types? ([^.?]*?)(?: and then ([^.?]*?))?[.?]', stem)
        ins = [x for t in typed[:1] for x in t if x]
        ins = [re.sub(r'^(the number |a |an )', '', x).strip() for x in ins]
        feed = iter(ins); buf = io.StringIO(); err = None
        try:
            with contextlib.redirect_stdout(buf): exec(q['c'], {'input': lambda p='': next(feed)})
        except BaseException as e: err = type(e).__name__
        out = buf.getvalue().strip().replace('\n', ' then ')
        if err: truth = [o for o in opts if err in o.replace(' ', '') or err.replace('Error', ' Error') in o or err in o]
        else:
            norm = lambda x: re.sub(r'\s+', ' ', x.replace('"', '').strip())
            truth = [o for o in opts if norm(o) == norm(out)]
        if len(truth) == 1 and truth == marked: ok += 1
        elif len(truth) == 1: bad += 1; print('MISMATCH Q%d: code gives %r -> option %r but the test marks %r' % (i, err or out, truth, marked))
        else: manual += 1; print('MANUAL Q%d (code output %r): options %s marked %s' % (i, err or out, opts, marked))
    else:
        manual += 1; print('READ Q%d: %s | marked: %s | why: %s' % (i, stem[:150], marked, strip(q['e'])[:140]))
print('auto-verified by running code: %d | mismatches: %d | need a human read: %d' % (ok, bad, manual))
