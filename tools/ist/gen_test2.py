"""Builds ist/unit-7/unit-4-practice-test.html (75 questions, 7 per lesson plus 5 'select two' questions) from the AP CSP Unit 3 test page as a template.
Every answer is confirmed in a real browser: node tools/ist/qcheck.mjs tools/ist/_test_qs.json tools/ist/_test_report.json
usage: python3 tools/ist/gen_test.py"""
import os, sys, json, random, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import qgen
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
tpl = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'unit-3-practice-test.html'), encoding='utf-8').read()
NUM = {11: '4.1', 12: '4.2', 13: '4.3', 14: '4.4', 15: '4.5'}
LAB = {qgen.TOPIC_NAMES[l]: '%s %s' % (NUM[l], qgen.TOPIC_NAMES[l]) for l in range(11, 16)}
rng = random.Random(88); out = []; seen = set()
def add(q):
    q = dict(q); out.append(q); seen.add(q['key'])
for l in range(11, 16):
    facts = list(qgen.LESSON_FACTS[l]); rng.shuffle(facts); got = 0
    for f in facts:
        q = qgen.fact_q(rng, l, f)
        if q['key'] in seen: continue
        add(q); got += 1
        if got == 2: break
    ts = list(qgen.LESSON_T[l]); n = 0; guard = 0
    while n < 6 and guard < 400:
        guard += 1; f = ts[n % len(ts)] if guard < 60 else rng.choice(ts)
        try: q = f(rng)
        except qgen.Skip: continue
        if q['key'] in seen: continue
        add(q); n += 1
# ---- "select two answers" questions (AP style); a is a list of option indexes; chk checks every option page
def multi(l, stem, code, rights, wrongs, why, chk):
    o = [(r, True) for r in rights] + [(w, False) for w in wrongs]; rng.shuffle(o)
    return dict(l=l, t=qgen.TOPIC_NAMES[l], s=stem + ' <span class="sel2">Select two answers.</span>', c=code, o=[x for x, _ in o], a=[i for i, (_, ok) in enumerate(o) if ok], e=why, chk=chk, key='multi%d%s' % (l, stem))
C = qgen.C; pg = qgen.pg; st = qgen.st; RGB = qgen.RGB
ms = []
# 4.1 box model
bsty = [('padding: 20px', True), ('margin: 20px', False), ('padding-left: 20px', True), ('margin-left: 20px', False)]
ms.append(multi(11, 'Which two styles put space INSIDE the border, so the background color fills it?', None, [C('style="%s; background-color: yellow"' % s) for s, ok in bsty if ok], [C('style="%s; background-color: yellow"' % s) for s, ok in bsty if not ok],
    'Padding is inside the border and takes the background color. Margin is outside the border and is always see-through.',
    [qgen.ck(pg('<p style="%s; background-color: yellow; border: 2px solid black">Hi</p>\n' % s), "var s=getComputedStyle(d.querySelector('p'));parseFloat(s.paddingLeft)+parseFloat(s.paddingTop)>0", ok) for s, ok in bsty]))
# 4.2 colors
hx = [('#FF0000', True), ('FF0000', False), ('#00FF00', True), ('#00FG00', False)]
ms.append(multi(12, 'Which two of these will show a color on the page when used as <code>color: ...</code>?', None, [C(h_) for h_, ok in hx if ok], [C(h_) for h_, ok in hx if not ok],
    'A hex color needs a # and exactly 6 characters from 0-9 and A-F. Without the #, or with a letter past F, the browser ignores it.',
    [qgen.ck(pg('<p style="color: %s">Hi</p>\n' % h_), "getComputedStyle(d.querySelector('p')).color!='rgb(0, 0, 0)'", ok) for h_, ok in hx]))
# 4.3 display
dsp = [('display: inline-block', True), ('display: block', False), ('display: inline', True), ('display: row', False)]
ms.append(multi(13, 'Which two display values make the three divs sit in one row?', None, [C(d_) for d_, ok in dsp if ok], [C(d_) for d_, ok in dsp if not ok],
    'inline-block and inline both sit in the line like words. block stacks, and row is not a display value.',
    [qgen.ck(pg(''.join('<div style="%s">%d</div>\n' % (d_, i) for i in range(3))), "var l=Array.prototype.slice.call(d.querySelectorAll('div'));l.every(function(x){return x.getBoundingClientRect().top==l[0].getBoundingClientRect().top})", ok) for d_, ok in dsp]))
# 4.4 div
dv = pg('<div style="color: white; background-color: navy"><p>Inside</p></div>\n')
ms.append(multi(14, 'Which two statements about a div are true?', None, ['A div is a block tag, so it starts on a new line', 'A text color on a div is inherited by the tags inside it'], ['A div always draws a border around its content', 'A div must have a width or it disappears'],
    'A div is born block, and the styles you put on it (like color) are inherited by what is inside. It draws no border on its own, and its width stretches to the whole line.',
    [qgen.ck(dv, "[getComputedStyle(d.querySelector('div')).display, getComputedStyle(d.querySelector('p')).color]", ['block', 'rgb(255, 255, 255)'])]))
# 4.5 tables
ms.append(multi(15, 'Which two statements about a table are true?', None, ['Every row needs the same number of cells', 'A td can hold a link'], ['Only a th can hold a link', 'You build a table one column at a time'],
    'Every row must have the same number of cells, and a cell can hold any other tag. You build a table one row at a time.', []))
for q in ms: out.append(q)
out.sort(key=lambda q: q['l'])
singles = [q for q in out if isinstance(q['a'], int)]
targets = [i % 4 for i in range(len(singles))]; rng.shuffle(targets)   # the right answer is A, B, C and D about equally often
for q, t in zip(singles, targets):
    o = q['o']; a = q['a']; o[a], o[t] = o[t], o[a]; q['a'] = t
tests = []
for i, q in enumerate(out):
    a = q['a'] if isinstance(q['a'], list) else [q['a']]
    if isinstance(q['a'], int):   # single answer: mkq stores the index
        pass
    d = dict(t=qgen.TOPIC_NAMES[q['l']], s=q['s'], o=q['o'], a=a, e=q['e'])
    if q.get('c'): d['c'] = q['c']
    tests.append(d); q['id'] = 'T%d' % i
json.dump(out, open(os.path.join(HERE, '_test_qs2.json'), 'w'), ensure_ascii=False)
Qjs = json.dumps(tests, ensure_ascii=False, indent=0)
labjs = json.dumps(LAB, ensure_ascii=False); topics = json.dumps([qgen.TOPIC_NAMES[l] for l in range(11, 16)], ensure_ascii=False)
html = tpl
html = html.replace('<title>Unit 3 Practice Test | AP CSP</title>', '<title>Unit 4 Practice Test | Intro to Software Technology</title>')
html = html.replace('<link rel="icon" href="../../assets/logo.png">', '<link rel="icon" href="../../assets/logo.png">')
nav_old = html[html.index('<nav class="pillnav">'): html.index('</nav>') + 6]
html = html.replace(nav_old, '<nav class="pillnav">\n  <a href="index.html">&larr; Unit 4: Advanced HTML</a>\n  <a href="../unit-6/practice-2.html?hub=w">Walkthroughs and assignments</a>\n  <a href="../unit-6/game.html">Quiz games</a>\n  <a href="#test" class="current">Practice Test</a>\n</nav>')
hero_old = html[html.index('<header class="hero">'): html.index('</header>') + 9]
hero = '''<header class="hero">
  <div class="wrap">
    <div class="brief-no">INTRO TO SOFTWARE TECHNOLOGY &nbsp;/&nbsp; UNIT 3 &nbsp;/&nbsp; ADVANCED HTML</div>
    <h1>Unit 4 Practice Test</h1>
    <p class="deck">Questions for every lesson from 4.1 Box Model to 4.5 Tables. Read the code like a browser: go one line at a time and decide what the page will show. Use the topic buttons to practice one lesson at a time.</p>
    <div class="meta">
      <span class="chip">Covers <b>4.1&ndash;4.5</b></span>
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
html = re.sub(r"var KEY='apcsp-u3-pt-v2'", "var KEY='ist-u3p2-pt-v1'", html)
html = re.sub(r"var topics=\['All'\]\.concat\(\[[^\]]*\]\);", "var topics=['All'].concat(%s);" % topics, html)
html = html.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 3 test.')
open(os.path.join(ROOT, 'ist', 'unit-7', 'unit-4-practice-test.html'), 'w', encoding='utf-8').write(html)
from collections import Counter
print(len(tests), 'questions;', Counter(len(t['a']) for t in tests), 'answer letters:', Counter('ABCD'[t['a'][0]] for t in tests))
