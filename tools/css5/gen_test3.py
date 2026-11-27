"""Builds ist/unit-8/unit-5-practice-test.html (66 questions: 10 per lesson plus 6 'select two') from the AP CSP Unit 3 test page as a template.
Every answer is confirmed in a real browser: node tools/ist/qcheck.mjs tools/css5/_test_qs.json tools/css5/_test_report.json
usage: python3 tools/css5/gen_test3.py"""
import os, sys, json, random, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
import qgen5, qgen5b, qgen5c
from qgen5 import Skip, ck, check_page, E
T = {16: qgen5.L16_T, 17: qgen5b.L17_T, 18: qgen5b.L18_T, 19: qgen5b.L19_T, 20: qgen5c.L20_T, 21: qgen5c.L21_T}
F = {16: qgen5.L16_FACTS, 17: qgen5b.L17_FACTS, 18: qgen5b.L18_FACTS, 19: qgen5b.L19_FACTS, 20: qgen5c.L20_FACTS, 21: qgen5c.L21_FACTS}
TOPIC = {16: 'External CSS and classes', 17: 'CSS by id', 18: 'Selectors and specificity', 19: 'Pseudo-classes and transitions', 20: 'Flexbox', 21: 'Grid'}
NUM = {16: '5.1', 17: '5.2', 18: '5.3', 19: '5.4', 20: '5.5', 21: '5.6'}
tpl = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'unit-3-practice-test.html'), encoding='utf-8').read()
LAB = {TOPIC[l]: '%s %s' % (NUM[l], TOPIC[l]) for l in range(16, 22)}
def code(sx): return re.sub(r'`([^`]+)`', lambda m: '<code>%s</code>' % E(m.group(1)), sx)
rng = random.Random(99); out = []; seen = set()
def add(q):
    q = dict(q); q['s'] = code(q['s']); q['e'] = code(q['e']); q['t'] = TOPIC[q['l']]; out.append(q); seen.add(q['key'])
for l in range(16, 22):
    facts = list(F[l]); rng.shuffle(facts); got = 0
    for f in facts:
        q = qgen5.qgen.fact_q(rng, l, f)
        if q['key'] in seen: continue
        add(q); got += 1
        if got == 2: break
    ts = list(T[l]); n = 0; guard = 0
    while n < 8 and guard < 600:
        guard += 1; f = ts[n % len(ts)] if guard < 60 else rng.choice(ts)
        try: q = f(rng)
        except Skip: continue
        if q['key'] in seen: continue
        add(q); n += 1
def multi(l, stem, code_, rights, wrongs, why, chk):
    o = [(r, True) for r in rights] + [(w, False) for w in wrongs]; rng.shuffle(o)
    return dict(l=l, t=TOPIC[l], s=stem + ' <span class="sel2">Select two answers.</span>', c=code_, o=[x for x, _ in o], a=[i for i, (_, ok) in enumerate(o) if ok], e=why, chk=chk, key='multi%d%s' % (l, stem))
C = lambda x: '<code>%s</code>' % E(x)
ms = []
ms.append(multi(16, 'Which two of these belong in a CSS file?', None, [C('p { color: blue; }'), C('.big { font-size: 20px; }')], [C('<style>'), C('<link rel="stylesheet" href="style.css">')],
    'A CSS file holds only rules: a selector, curly braces, and property: value pairs. A style tag and a link tag are HTML.', []))
rows_ = [('h2 { color: red; }', True), ('#top { color: red; }', True), ('.top { color: red; }', False), ('top { color: red; }', False)]
ms.append(multi(17, 'The page has `<h2 id="top">Hello</h2>`. Which two rules turn the heading red?'.replace('`<h2 id="top">Hello</h2>`', '<code>&lt;h2 id="top"&gt;Hello&lt;/h2&gt;</code>'), None, [C(r) for r, ok in rows_ if ok], [C(r) for r, ok in rows_ if not ok],
    'A tag rule (h2) and an id rule (#top) both reach this heading. A dot looks for a class, and a bare name looks for a tag with that name.',
    [ck(check_page(r, '<h2 id="top">Hello</h2>'), "W.getComputedStyle(d.querySelector('h2')).color", 'rgb(255, 0, 0)' if ok else {'not': 'rgb(255, 0, 0)'}) for r, ok in rows_]))
rows_ = [('.warning { color: red; }', True), ('p.warning { color: red; }', True), ('p .warning { color: red; }', False), ('warning { color: red; }', False)]
ms.append(multi(18, 'The page has <code>&lt;p class="warning"&gt;Careful&lt;/p&gt;</code>. Which two rules turn it red?', None, [C(r) for r, ok in rows_ if ok], [C(r) for r, ok in rows_ if not ok],
    '.warning matches anything with that class, and p.warning matches a paragraph that wears it (no space). A space would mean a warning INSIDE a p, and a bare name is a tag.',
    [ck(check_page(r, '<p class="warning">Careful</p>'), "W.getComputedStyle(d.querySelector('p')).color", 'rgb(255, 0, 0)' if ok else {'not': 'rgb(255, 0, 0)'}) for r, ok in rows_]))
rows_ = [('a:hover { color: red; }', True), ('.nav:hover { color: red; }', True), ('a :hover { color: red; }', False), ('a::hover { color: red; }', False)]
ms.append(multi(19, 'The page has <code>&lt;a class="nav" href="https://example.com"&gt;Home&lt;/a&gt;</code>. Which two rules turn the link red while the mouse is on it?', None, [C(r) for r, ok in rows_ if ok], [C(r) for r, ok in rows_ if not ok],
    'A pseudo-class sticks to its selector with no spaces and one colon. a:hover and .nav:hover both reach this link.',
    [ck(check_page(r, '<a class="nav" href="https://example.com">Home</a>'), qgen5b.st('a', '__hov', 'color'), 'rgb(255, 0, 0)' if ok else {'not': 'rgb(255, 0, 0)'}) for r, ok in rows_]))
ms.append(multi(20, 'Which two declarations on a flex container center its items both ways?', None, [C('justify-content: center;'), C('align-items: center;')], [C('gap: center;'), C('flex-direction: center;')],
    'Justify-content works along the row and align-items works across it. Set both to center. Gap and flex-direction do not take the value center.', []))
ms.append(multi(21, 'Which two statements about a grid are true?', None, ['The columns are set on the container with grid-template-columns', 'An fr is a fraction of the leftover space'], ['Every item needs its own width', 'display: grid makes three columns by itself'],
    'The container decides the columns, and fr shares out what space is left. Items never need widths, and without grid-template-columns you get one column.', []))
for q in ms: out.append(q)
out.sort(key=lambda q: q['l'])
singles = [q for q in out if isinstance(q['a'], int)]
targets = [i % 4 for i in range(len(singles))]; rng.shuffle(targets)
for q, t in zip(singles, targets):
    o = q['o']; a = q['a']; o[a], o[t] = o[t], o[a]; q['a'] = t
tests = []
for i, q in enumerate(out):
    a = q['a'] if isinstance(q['a'], list) else [q['a']]
    d = dict(t=TOPIC[q['l']], s=q['s'], o=q['o'], a=a, e=q['e'])
    if q.get('c'): d['c'] = q['c']
    tests.append(d); q['id'] = 'T%d' % i
json.dump(out, open(os.path.join(HERE, '_test_qs.json'), 'w'), ensure_ascii=False)
Qjs = json.dumps(tests, ensure_ascii=False, indent=0)
labjs = json.dumps(LAB, ensure_ascii=False); topics = json.dumps([TOPIC[l] for l in range(16, 22)], ensure_ascii=False)
html = tpl
html = html.replace('<title>Unit 3 Practice Test | AP CSP</title>', '<title>Unit 5 Practice Test | Intro to Software Technology</title>')
html = html.replace('<link rel="icon" href="../../assets/logo.png">', '<link rel="icon" href="../../assets/logo.png">')
nav_old = html[html.index('<nav class="pillnav">'): html.index('</nav>') + 6]
html = html.replace(nav_old, '<nav class="pillnav">\n  <a href="index.html">&larr; Unit 5: Intro to CSS</a>\n  <a href="../unit-6/practice-3.html?hub=w">Walkthroughs and assignments</a>\n  <a href="../unit-6/game.html">Quiz games</a>\n  <a href="#test" class="current">Practice Test</a>\n</nav>')
hero_old = html[html.index('<header class="hero">'): html.index('</header>') + 9]
hero = '''<header class="hero">
  <div class="wrap">
    <div class="brief-no">INTRO TO SOFTWARE TECHNOLOGY &nbsp;/&nbsp; UNIT 5 &nbsp;/&nbsp; INTRO TO CSS</div>
    <h1>Unit 5 Practice Test</h1>
    <p class="deck">Questions for every lesson from 5.1 External CSS to 5.6 CSS Grid. Read the CSS like a browser: decide which rule wins and what the page will show. Use the topic buttons to practice one lesson at a time.</p>
    <div class="meta">
      <span class="chip">Covers <b>5.1&ndash;5.6</b></span>
      <span class="chip"><b id="heroCount">0</b> questions</span>
      <span class="chip">Every answer <b>explained</b></span>
    </div>
    <a class="cta" href="#test">Start the practice test &darr;</a>
  </div>
</header>'''
html = html.replace(hero_old, hero)
html = html.replace('<div class="part-head"><div class="part-tag">Q</div><h2>Practice Test (AP Style)</h2></div>', '<div class="part-head"><div class="part-tag">Q</div><h2>Practice Test</h2></div>')
html = html.replace('These are worded the way the AP exam words its questions. Trace the code on paper before you choose.', 'Picture the page the code makes before you choose.')
s0 = html.index('<script>'); s1 = html.index('];', s0)
html = html[:s0] + '<script>\nvar LAB=' + labjs + ';\nvar Q = ' + Qjs + html[s1 + 1:]
html = re.sub(r"var KEY='apcsp-u3-pt-v2'", "var KEY='ist-u5-pt-v1'", html)
html = re.sub(r"var topics=\['All'\]\.concat\(\[[^\]]*\]\);", "var topics=['All'].concat(%s);" % topics, html)
html = html.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 3 test.')
open(os.path.join(ROOT, 'ist', 'unit-8', 'unit-5-practice-test.html'), 'w', encoding='utf-8').write(html)
from collections import Counter
print(len(tests), 'questions;', Counter(len(t['a']) for t in tests), 'answer letters:', Counter('ABCD'[t['a'][0]] for t in tests))
