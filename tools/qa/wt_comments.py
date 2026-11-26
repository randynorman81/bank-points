"""Info test: every END-OF-LINE comment replaced with a generic one ("# my note"). Heading comments (# Step N: ...) and comment-only lines stay.
Lists which checks then fail, so a human can confirm each one really asks for comment CONTENT (a prediction, a labelled value) and not just 'a comment'."""
import sys, os, re, io, tokenize
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
slots = sys.argv[1:] or ['a%d' % i for i in range(1, 14)] + ['a%d' % i for i in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)]
for s in slots:
    src, ins = q.model(s); out = q.run_local(src, ins)
    lines = src.split('\n'); new = []
    for l in lines:
        m = re.match(r'^(.*?\S)\s+#\s.*$', l)
        if m and not l.strip().startswith('#') and '"' not in l.split('#')[-1] and not re.search(r'["\'][^"\']*#', m.group(1)): new.append(m.group(1) + '  # my note')
        else: new.append(l)
    v = '\n'.join(new); r = q.score(s, v, q.run_local(v, ins))
    print(s, r['pct'], '|', '; '.join(m_['label'][:70] for m_ in r['missing'][:12]))
