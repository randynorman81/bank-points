"""Builds ist/unit-6/unit-3-practice-test.html (75 questions, 7 per lesson plus 5 'select two' questions) from the AP CSP Unit 3 test page as a template.
Every answer is confirmed in a real browser: node tools/ist/qcheck.mjs tools/ist/_test_qs.json tools/ist/_test_report.json
usage: python3 tools/ist/gen_test.py"""
import os, sys, json, random, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import qgen
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
tpl = open(os.path.join(ROOT, 'apcsp', 'unit-3', 'unit-3-practice-test.html'), encoding='utf-8').read()
LAB = {qgen.TOPIC_NAMES[l]: '3.%d %s' % (l, qgen.TOPIC_NAMES[l]) for l in range(1, 11)}
rng = random.Random(77); out = []; seen = set()
def add(q):
    q = dict(q); out.append(q); seen.add(q['key'])
for l in range(1, 11):
    facts = list(qgen.LESSON_FACTS[l]); rng.shuffle(facts); got = 0
    for f in facts:
        q = qgen.fact_q(rng, l, f)
        if q['key'] in seen: continue
        add(q); got += 1
        if got == 2: break
    ts = list(qgen.LESSON_T[l]); n = 0; guard = 0
    while n < 5 and guard < 400:
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
# L2
styles = [('color: red', True), ('color = red', False), ('color: red; background-color: yellow', True), ('color: red, background-color: yellow', False)]
ms.append(multi(2, 'Which of these style attributes will make the heading text red?', None, [C('style="%s"' % s) for s, ok in styles if ok], [C('style="%s"' % s) for s, ok in styles if not ok],
    'A style needs a colon between the property and value, and two styles are separated by a <b>semicolon</b>. An equals sign or a comma breaks the style, so the text stays black.',
    [qgen.ck(pg('<h1 style="%s">Hi</h1>\n' % s), "getComputedStyle(d.querySelector('h1')).color", RGB['red'] if ok else RGB['black']) for s, ok in styles]))
# L4
code = pg('<p><strong>fast</strong> and <em>fun</em> and <strong>free</strong></p>\n')
ms.append(multi(4, 'Which two words does the page show in bold?', code, ['fast', 'free'], ['fun', 'and'], 'The <code>strong</code> tag makes bold. <b>fast</b> and <b>free</b> are inside strong tags. <code>fun</code> is inside an <code>em</code> tag, so it is italic.',
    [qgen.ck(code, "Array.prototype.filter.call(d.querySelectorAll('p *'),function(e){return parseInt(getComputedStyle(e).fontWeight)>=700}).map(function(e){return e.innerText})", ['fast', 'free'])]))
# L6
bs = [('border-top: 2px solid red', True), ('border: 2px solid red', False), ('border-left: 2px solid red', True), ('border-all: 2px solid red', False)]
ms.append(multi(6, 'Which two styles draw a line on only ONE side of a paragraph?', None, [C('style="%s"' % s) for s, ok in bs if ok], [C('style="%s"' % s) for s, ok in bs if not ok],
    '<code>border-top</code> and <code>border-left</code> each draw one side. <code>border</code> draws all four sides, and <code>border-all</code> is not a real property, so it draws nothing.',
    [qgen.ck(pg('<p style="%s">Hi</p>\n' % s), "var s=getComputedStyle(d.querySelector('p'));['Top','Bottom','Left','Right'].filter(function(k){return s['border'+k+'Style']!='none'}).length==1", ok) for s, ok in bs]))
# L8
ms.append(multi(8, 'Which two of these are text characters that you can paste between tags, with no img tag?', None, ['The pizza emoji 🍕', 'The copyright symbol ©'], ['A photo saved as <code>pizza.jpg</code>', 'A logo saved as <code>logo.png</code>'],
    'Emojis and symbols are characters, like letters. A picture file such as a .jpg or .png is not text: it needs an <code>img</code> tag with <code>src</code> and <code>alt</code>.', []))
# L10
ms.append(multi(10, 'Which two styles together turn a bulleted list into a menu that sits in one row with no bullets?', None, ['<code>list-style-type: none</code> on the <code>ul</code>', '<code>display: inline</code> on every <code>li</code>'], ['<code>list-style-type: square</code> on the <code>ul</code>', '<code>display: block</code> on every <code>li</code>'],
    'The ul style removes the bullets, and <code>display: inline</code> on every li makes the items flow in a row like words. Without both, you get bullets or a stack.',
    [qgen.ck(pg('<ul%s>\n<li%s>A</li>\n<li%s>B</li>\n<li%s>C</li>\n</ul>\n' % (a, b, b, b)), "var l=Array.prototype.slice.call(d.querySelectorAll('li'));l.every(function(x){return x.offsetTop==l[0].offsetTop})&&getComputedStyle(d.querySelector('ul')).listStyleType=='none'", ok)
     for a, b, ok in [(st('list-style-type: none'), st('display: inline'), True), (st('list-style-type: square'), st('display: inline'), False), (st('list-style-type: none'), st('display: block'), False)]]))
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
json.dump(out, open(os.path.join(HERE, '_test_qs.json'), 'w'), ensure_ascii=False)
Qjs = json.dumps(tests, ensure_ascii=False, indent=0)
labjs = json.dumps(LAB, ensure_ascii=False); topics = json.dumps([qgen.TOPIC_NAMES[l] for l in range(1, 11)], ensure_ascii=False)
html = tpl
html = html.replace('<title>Unit 3 Practice Test | AP CSP</title>', '<title>Unit 3 Practice Test | Intro to Software Technology</title>')
html = html.replace('<link rel="icon" href="../../assets/logo.png">', '<link rel="icon" href="../../assets/logo.png">')
nav_old = html[html.index('<nav class="pillnav">'): html.index('</nav>') + 6]
html = html.replace(nav_old, '<nav class="pillnav">\n  <a href="index.html">&larr; Unit 3</a>\n  <a href="practice.html?hub=w">Walkthroughs and assignments</a>\n  <a href="game.html">Quiz games</a>\n  <a href="#test" class="current">Practice Test</a>\n</nav>')
hero_old = html[html.index('<header class="hero">'): html.index('</header>') + 9]
hero = '''<header class="hero">
  <div class="wrap">
    <div class="brief-no">INTRO TO SOFTWARE TECHNOLOGY &nbsp;/&nbsp; UNIT 3 &nbsp;/&nbsp; WEB DESIGN (HTML)</div>
    <h1>Unit 3 Practice Test</h1>
    <p class="deck">Questions for every lesson from 3.1 The Skeleton to 3.10 Lists. Read the code like a browser: go one line at a time and decide what the page will show. Use the topic buttons to practice one lesson at a time.</p>
    <div class="meta">
      <span class="chip">Covers <b>3.1&ndash;3.10</b></span>
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
html = re.sub(r"var KEY='apcsp-u3-pt-v2'", "var KEY='ist-u3-pt-v1'", html)
html = re.sub(r"var topics=\['All'\]\.concat\(\[[^\]]*\]\);", "var topics=['All'].concat(%s);" % topics, html)
html = html.replace('You’re ready for the Unit 3 test.', 'You’re ready for the Unit 3 test.')
open(os.path.join(ROOT, 'ist', 'unit-6', 'unit-3-practice-test.html'), 'w', encoding='utf-8').write(html)
from collections import Counter
print(len(tests), 'questions;', Counter(len(t['a']) for t in tests), 'answer letters:', Counter('ABCD'[t['a'][0]] for t in tests))
