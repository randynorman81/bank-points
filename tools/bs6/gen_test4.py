"""Builds ist/unit-9/unit-6-practice-test.html (66 questions: 10 per lesson plus 6 'select two') from the AP CSP Unit 3 test page as a template.
Every answer is confirmed in a real browser: node tools/ist/qcheck.mjs tools/bs6/_test_qs.json tools/bs6/_test_report.json
usage: python3 tools/bs6/gen_test4.py"""
import os, sys, json, random, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
import qgen6, qgen6b
from qgen6 import Skip, ck6, check_page, E
T = {22: qgen6.L22_T, 23: qgen6.L23_T, 24: qgen6.L24_T, 25: qgen6b.L25_T, 26: qgen6b.L26_T, 27: qgen6b.L27_T}
F = {22: qgen6.L22_FACTS, 23: qgen6.L23_FACTS, 24: qgen6.L24_FACTS, 25: qgen6b.L25_FACTS, 26: qgen6b.L26_FACTS, 27: qgen6b.L27_FACTS}
TOPIC = {22: 'Setting up Bootstrap', 23: 'The grid', 24: 'Typography, colors and buttons', 25: 'Navbar', 26: 'Cards', 27: 'Forms'}
NUM = {22: '6.1', 23: '6.2', 24: '6.3', 25: '6.4', 26: '6.5', 27: '6.6'}
tpl = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'unit-3-practice-test.html'), encoding='utf-8').read()
LAB = {TOPIC[l]: '%s %s' % (NUM[l], TOPIC[l]) for l in range(22, 28)}
def code(sx): return re.sub(r'`([^`]+)`', lambda m: '<code>%s</code>' % E(m.group(1)), sx)
rng = random.Random(99); out = []; seen = set()
def add(q):
    q = dict(q); q['s'] = code(q['s']); q['e'] = code(q['e']); q['t'] = TOPIC[q['l']]; out.append(q); seen.add(q['key'])
for l in range(22, 28):
    facts = list(F[l]); rng.shuffle(facts); got = 0
    for f in facts:
        q = qgen6.qgen.fact_q(rng, l, f)
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
ms.append(multi(22, 'Which two things are true about adding Bootstrap to a page?', None, ['The link tag goes inside the head', 'The link tag has no closing tag'], ['The link tag goes inside the body', 'The link tag needs a closing link tag'],
    'The Bootstrap link is a link tag like your own style.css link: in the head, standing alone.', []))
rows_ = [('col-6', True), ('col-md-6', True), ('col6', False), ('column-6', False)]
body_ = lambda c: '<div class="container"><div class="row"><div class="%s">A</div><div class="%s">B</div></div></div>' % (c, c)
ms.append(multi(23, 'Two columns share one row. Which two class names make them sit side by side, each taking half, on a laptop screen?', None, [C(r) for r, ok in rows_ if ok], [C(r) for r, ok in rows_ if not ok],
    'col-6 and col-md-6 both take half the row on a laptop. col6 and column-6 are not Bootstrap classes, so the divs just stack.',
    [ck6(check_page(body_(r)), "(function(){var c=d.querySelectorAll('.row > div');return Math.round(c[0].getBoundingClientRect().top)==Math.round(c[1].getBoundingClientRect().top)})()", ok, 1000) for r, ok in rows_]))
rows_ = [('btn btn-primary', True), ('btn btn-danger', True), ('btn', False), ('btn-primary', False)]
ms.append(multi(24, 'Which two class lists make a button with a Bootstrap theme color as its background?', None, [C(r) for r, ok in rows_ if ok], [C(r) for r, ok in rows_ if not ok],
    'A Bootstrap button needs btn plus a color class. btn alone and a color class alone are not enough.',
    [ck6(check_page('<button class="%s">Go</button>' % r), "['rgb(13, 110, 253)', 'rgb(220, 53, 69)'].indexOf(W.getComputedStyle(d.querySelector('button')).backgroundColor) > -1", ok) for r, ok in rows_]))
ms.append(multi(25, 'Which two classes go on a link inside a Bootstrap navbar?', None, [C('navbar-brand'), C('nav-link')], [C('navbar-nav'), C('navbar-dark')],
    'navbar-brand is for the site name link and nav-link is for each menu link. navbar-nav goes on the div around the links, and navbar-dark goes on the nav.', []))
ms.append(multi(26, 'Which two statements about a Bootstrap card are true?', None, ['The outer div has the class card', 'Cards can sit inside grid columns'], ['The card-body goes outside the card', 'A card needs an image to work'],
    'A card is a div with the class card, and it is almost always used inside the grid. The card-body goes inside it, and an image is optional.', []))
ms.append(multi(27, 'Which two classes go on form fields and their labels?', None, [C('form-label'), C('form-control')], [C('form-field'), C('input-text')],
    'form-label goes on the label and form-control goes on the input or textarea. The other two are not Bootstrap classes.', []))
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
labjs = json.dumps(LAB, ensure_ascii=False); topics = json.dumps([TOPIC[l] for l in range(22, 28)], ensure_ascii=False)
html = tpl
html = html.replace('<title>Unit 3 Practice Test | AP CSP</title>', '<title>Unit 6 Practice Test | Intro to Software Technology</title>')
html = html.replace('<link rel="icon" href="../../assets/logo.png">', '<link rel="icon" href="../../assets/logo.png">')
nav_old = html[html.index('<nav class="pillnav">'): html.index('</nav>') + 6]
html = html.replace(nav_old, '<nav class="pillnav">\n  <a href="index.html">&larr; Unit 6: Bootstrap</a>\n  <a href="../unit-6/game.html">Walkthroughs and assignments</a>\n  <a href="../unit-6/game.html">Quiz games</a>\n  <a href="#test" class="current">Practice Test</a>\n</nav>')
hero_old = html[html.index('<header class="hero">'): html.index('</header>') + 9]
hero = '''<header class="hero">
  <div class="wrap">
    <div class="brief-no">INTRO TO SOFTWARE TECHNOLOGY &nbsp;/&nbsp; UNIT 6 &nbsp;/&nbsp; BOOTSTRAP</div>
    <h1>Unit 6 Practice Test</h1>
    <p class="deck">Questions for every lesson from 6.1 Setting Up Bootstrap to 6.6 Forms. Picture the page the classes make before you choose. Use the topic buttons to practice one lesson at a time.</p>
    <div class="meta">
      <span class="chip">Covers <b>6.1&ndash;6.6</b></span>
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
html = re.sub(r"var KEY='apcsp-u3-pt-v2'", "var KEY='ist-u6-pt-v1'", html)
html = re.sub(r"var topics=\['All'\]\.concat\(\[[^\]]*\]\);", "var topics=['All'].concat(%s);" % topics, html)
html = html.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 3 test.')
open(os.path.join(ROOT, 'ist', 'unit-9', 'unit-6-practice-test.html'), 'w', encoding='utf-8').write(html)
from collections import Counter
print(len(tests), 'questions;', Counter(len(t['a']) for t in tests), 'answer letters:', Counter('ABCD'[t['a'][0]] for t in tests))
