"""Concept-order audit for IST Unit 3 (lessons 3.1-3.10) and Unit 4 (4.1-4.5).
Nothing may use, show or talk about a tag, property or idea before the lesson that teaches it.
Ranks are the order the lessons are TAUGHT: 3.1 = 1 ... 3.10 = 10, then colors 4.2 = 11, tables 4.5 = 12, box model 4.1 = 13, display 4.3 = 14, div 4.4 = 15 (see ist/pacing-guide.html).
Scans: Parsons (story, solution, wrong pieces), quiz-game questions, practice tests, walkthrough and assignment texts + model pages, study guide (code + prose), notes pages (code samples).
usage: python3 tools/ist/audit_order.py [--quiet]      exit code 1 when something is used before it is taught"""
import re, os, sys, json, glob, html as _html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
RANK = {'3.1': 1, '3.2': 2, '3.3': 3, '3.4': 4, '3.5': 5, '3.6': 6, '3.7': 7, '3.8': 8, '3.9': 9, '3.10': 10, '4.2': 11, '4.5': 12, '4.1': 13, '4.3': 14, '4.4': 15}
NAME = {v: k for k, v in RANK.items()}
# (regex, concept, rank it is first taught).  Matched against code AND prose.  Every property / tag the course ever teaches is listed; anything else is 99 (never taught).
TERMS = [
    (r'#[0-9A-Fa-f]{3,8}\b(?![^<]*>)|\bhex(?:adecimal)?\b|\bhex codes?\b', 'hex colors', 11),
    (r'\brgb\(|\brgba\(|\bhsl\(', 'rgb()/hsl() colors', 99),
    (r'\bpadding(?:-(?:top|bottom|left|right))?\b', 'padding', 13), (r'\bmargin(?:-(?:top|bottom|left|right))?\b', 'margin', 13), (r'\bbox model\b', 'the box model', 13),
    (r'\bdisplay\s*:', 'display', 10), (r'\binline-block\b', 'inline-block', 14), (r'\bvertical-align\b', 'vertical-align', 15), (r'\bheight\s*:', 'height', 7),
    (r'<\s*/?div\b|\bdiv tag\b|\bdivs?\b', 'the div tag', 14),
    (r'<\s*/?(?:table|tr|td|th)\b|\bHTML tables?\b', 'tables', 12),
    (r'<\s*/?(?:ul|ol|li)\b|\blist-style', 'lists', 10),
    (r'<\s*/?a\b|\banchor tag\b', 'links', 9), (r'\btarget\s*=', 'target', 9),
    (r'<\s*img\b|\bsrc\s*=', 'images', 7), (r'\bfavicon\b', 'favicon', 7),
    (r'\bwidth\s*:', 'width', 7),
    (r'\bborder(?:-(?:top|bottom|left|right))?\b\s*:', 'borders', 6),
    (r'<\s*link\b|\bfont-family\b|\bGoogle Fonts?\b', 'fonts', 5),
    (r'<\s*/?(?:strong|em|b|i|br|hr|span)\b', 'strong/em/br/hr/span', 4),
    (r'\bfont-size\b|\btext-align\b|\btext-transform\b|<\s*/?h3\b', 'size/align/case/h3', 3),
    (r'\bstyle\s*=|\bbackground-color\b|(?<![-\w])color\s*:', 'style attribute and colors', 2),
    (r'(?:border-radius|box-shadow|text-shadow|text-decoration|font-weight|font-style|line-height|letter-spacing|opacity|(?<![-\w])position|float|overflow|max-width|min-width|box-sizing|cursor|z-index|transition|animation|background-image|background-size|object-fit|list-style-position)\s*:|display\s*:\s*(?:flex|grid)', 'a property this course never teaches', 99),
    (r'<\s*/?(?:nav|header|footer|section|article|aside|main|form|input|button|label|select|textarea|iframe|video|audio|canvas|svg|script|style|meta)\b', 'a tag this course never teaches', 99),
    (r'\b(?:class|id)\s*=\s*["\']', 'class/id attributes', 99),
]
TERMS = [(re.compile(t[0], re.I), t[1], t[2]) for t in TERMS]
EMOJI = re.compile(r'[\U0001F300-\U0001FAFF☀-➿⭐❤]')
def terms_in(text):
    """concept -> rank for everything in the text"""
    out = {}
    t = _html.unescape(text)
    for rx, name, rank in TERMS:
        m = rx.search(t)
        if m: out.setdefault(name, (rank, t[max(0, m.start() - 70):m.end() + 60].replace('\n', ' ')))
    return out
ISSUES = []
ALLOW = {('Notes 3.1', 'size/align/case/h3'), ('Walkthrough/assignment 6.3a (3.4)', 'fonts')}   # 3.1 notes list all six heading sizes; the 6.3a slice also catches the font-link helper that belongs to 3.5
def check(where, lesson_rank, text, allow=()):
    for name, (rank, sample) in terms_in(text).items():
        if rank > lesson_rank and name not in allow and (where, name) not in ALLOW: ISSUES.append((where, name, 'taught at %s' % (NAME.get(rank, 'never')), sample))
def tags_strip(s): return re.sub(r'<[^>]+>', ' ', s)
def load_js_json(path, start='{'):
    s = open(path, encoding='utf-8').read(); i = s.index(start); return json.loads(s[i:s.rindex('}' if start == '{' else ']') + 1])

# ---------------------------------------------------------------- Parsons
def parsons():
    for f, key in (('practice-data.js', 'IST3'), ('practice-data-2.js', 'IST7')):
        d = load_js_json(os.path.join(ROOT, 'ist', 'unit-6', f))['lessons']
        for lid, L in d.items():
            r = RANK[L['num']]
            for n, p in enumerate(L['problems']):
                txt = ' '.join([p['title'], p['story']] + p['sol'] + [pc if isinstance(pc, str) else pc.get('t', pc.get('text', '')) for pc in p['pieces']])
                check('Parsons %s #%d' % (L['num'], n + 1), r, txt)
# ---------------------------------------------------------------- quiz game
def games():
    for l in range(1, 16):
        p = os.path.join(ROOT, 'ist', 'unit-6', 'game-data', 'l%d.js' % l)
        if not os.path.exists(p): continue
        s = open(p, encoding='utf-8').read(); i = s.index('= [') + 2; qs = json.loads(s[i:s.rindex(']') + 1])
        num = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '4.1', '4.2', '4.3', '4.4', '4.5'][l - 1]
        r = RANK[num]; seen = set()
        for q in qs:
            txt = ' '.join([tags_strip(q.get('s', '')), q.get('c', '') or '', tags_strip(q.get('e', ''))] + [tags_strip(o) for o in q.get('o', [])])
            for name, (rank, sample) in terms_in(txt).items():
                if rank > r and (name, sample) not in seen: seen.add((name, sample)); ISSUES.append(('Game %s' % num, name, 'taught at %s' % NAME.get(rank, 'never'), sample))
# ---------------------------------------------------------------- practice tests
def tests():
    for f, top, label in (('unit-3-practice-test.html', 10, 'Unit 3 test'), ('../unit-7/unit-4-practice-test.html', 15, 'Unit 4 test')):
        s = open(os.path.join(ROOT, 'ist', 'unit-6', f), encoding='utf-8').read()
        m = re.search(r'var Q = (\[.*?\]);\s*\n', s, re.S)
        if not m: ISSUES.append((label, 'could not read questions', '', '')); continue
        qs = json.loads(m.group(1)); seen = set()
        for q in qs:
            txt = json.dumps(q, ensure_ascii=False)
            for name, (rank, sample) in terms_in(txt).items():
                if rank > top and (name, sample) not in seen: seen.add((name, sample)); ISSUES.append((label, name, 'taught at %s' % NAME.get(rank, 'never'), sample))
# ---------------------------------------------------------------- walkthrough / assignment texts and models
def labs():
    for f, ids in (('answers-w.js', ['6.1', '6.2', '6.20', '6.3', '6.35', '6.4', '6.7', '6.75', '6.6', '6.5']), ('answers-w2.js', ['7.1', '7.2', '7.3', '7.4', '7.5'])):
        s = open(os.path.join(ROOT, 'ist', 'unit-6', f), encoding='utf-8').read()
        names = {'6.1': '3.1', '6.2': '3.2', '6.20': '3.3', '6.3': '3.4', '6.35': '3.5', '6.4': '3.6', '6.7': '3.7', '6.75': '3.8', '6.6': '3.9', '6.5': '3.10', '7.1': '4.1', '7.2': '4.2', '7.3': '4.3', '7.4': '4.4', '7.5': '4.5'}
        for lid in ids:
            for suf in ('w', 'a'):
                m = re.search(r'A\["%s%s"\] = build\(' % (re.escape(lid), suf), s)
                if not m: continue
                n = re.search(r'\n\s*A\[', s[m.end():]); blk = s[m.end(): m.end() + n.start()] if n else s[m.end():]
                check('Walkthrough/assignment %s%s (%s)' % (lid, suf, names[lid]), RANK[names[lid]], blk)
    # model pages (what a perfect answer looks like): they may only use what the lesson teaches
    s = open(os.path.join(HERE, 'lab_models.mjs'), encoding='utf-8').read()
    parts = re.split(r'\bM\("([0-9.]+)([wa])"', s)
    names = {'6.1': '3.1', '6.2': '3.2', '6.20': '3.3', '6.3': '3.4', '6.35': '3.5', '6.4': '3.6', '6.7': '3.7', '6.75': '3.8', '6.6': '3.9', '6.5': '3.10', '7.1': '4.1', '7.2': '4.2', '7.3': '4.3', '7.4': '4.4', '7.5': '4.5'}
    for i in range(1, len(parts), 3):
        lid, suf, body = parts[i], parts[i + 1], parts[i + 2]
        if lid in names: check('Model answer %s%s (%s)' % (lid, suf, names[lid]), RANK[names[lid]], body.split('`);')[0])
# ---------------------------------------------------------------- study guides
def guides():
    sys.path.insert(0, os.path.join(ROOT, 'tools', 'guides'))
    import gl, ist_lib
    gl.LANG = 'html'
    import units.ist03 as a, units.ist03p2 as b
    for u in (a.UNIT, b.UNIT):
        for ch in u.chapters:
            html, titles, extras = gl.build_html(u, only=ch['id'])
            body = html[html.index('<section class="chapter">'):]
            body = re.sub(r'<style.*?</style>|<svg.*?</svg>|ZZ\w+ZZ', ' ', body, flags=re.S)       # drawings carry their text elsewhere
            # re-add the text drawn inside annotated svgs (the captions are teaching text)
            full = html[html.index('<section class="chapter">'):]
            caps = ' '.join(re.findall(r'<text[^>]*>([^<]*)</text>', full))
            gl_text = tags_strip(body) + ' ' + caps
            # the browser pictures show pages: the code behind them is checked through the Parsons/games; here we check the guide's own words and code
            check('Guide %s' % ch['id'], RANK[ch['id']], gl_text)
# ---------------------------------------------------------------- notes pages (code samples and prose, not page chrome)
NOTES = {'ist/unit-6/html-intro-notes.html': '3.1', 'ist/unit-6/style-attribute-notes.html': '3.2', 'ist/unit-6/text-size-align-notes.html': '3.3', 'ist/unit-6/editing-tags-notes.html': '3.4', 'ist/unit-6/google-fonts-notes.html': '3.5', 'ist/unit-6/borders-notes.html': '3.6',
         'ist/unit-6/images-notes.html': '3.7', 'ist/unit-6/emojis-symbols-notes.html': '3.8', 'ist/unit-6/links-notes.html': '3.9', 'ist/unit-6/lists-notes.html': '3.10',
         'ist/unit-7/box-model-notes.html': '4.1', 'ist/unit-7/colors-notes.html': '4.2', 'ist/unit-7/display-notes.html': '4.3', 'ist/unit-7/div-tag-notes.html': '4.4', 'ist/unit-7/tables-notes.html': '4.5'}
def notes():
    for f, num in NOTES.items():
        p = os.path.join(ROOT, f)
        if not os.path.exists(p): ISSUES.append((f, 'missing notes page', '', '')); continue
        s = open(p, encoding='utf-8').read()
        s = re.sub(r'<style.*?</style>|<script.*?</script>', ' ', s, flags=re.S)
        s = re.sub(r'\s(?:style)="[^"]*"', ' ', s)                 # the page's own decoration is not teaching
        check('Notes %s' % num, RANK[num], tags_strip(s))

# ---------------------------------------------------------------- the check lists students see ("The paragraph has color: darkblue" ...)
def checks():
    names = {'6.1': '3.1', '6.2': '3.2', '6.20': '3.3', '6.3': '3.4', '6.35': '3.5', '6.4': '3.6', '6.7': '3.7', '6.75': '3.8', '6.6': '3.9', '6.5': '3.10', '7.1': '4.1', '7.2': '4.2', '7.3': '4.3', '7.4': '4.4', '7.5': '4.5'}
    for f in ('step-checks-w.js', 'step-checks-w2.js'):
        s = open(os.path.join(ROOT, 'ist', 'unit-6', f), encoding='utf-8').read()
        parts = re.split(r'LAB\("([0-9.]+[wa])"', s)
        for i in range(1, len(parts), 2):
            lid, body = parts[i], parts[i + 1]
            end = body.find('\n  });'); body = body[:end] if end > 0 else body
            base = re.match(r'[0-9.]+', lid).group(0).rstrip('.')
            base = lid[:-1]
            if base in names:
                labels = ' '.join(re.findall(r'"([^"\n]{6,200})"', body))
                check('Check list %s (%s)' % (lid, names[base]), RANK[names[base]], labels)
# ---------------------------------------------------------------- the older assignments (editor ids 6.2-6.5, 7.1-7.5 without w/a): what students see = assignment steps, check labels, concept lists, rubric rules
LEGACY_EXTRA = [   # prose patterns the tag/property regexes above do not catch, so "every image is a link" or "a bullet list" cannot slip in early
    (r'\bspans?\b', 'span (words)', 4), (r'\bbold\b|\bitalics?\b|\bstrong\b', 'bold/italic (words)', 4),
    (r'\bborders?\b', 'borders (words)', 6), (r'\bpictures?\b|\bimages?\b|\balt\b', 'images (words)', 7),
    (r'\bemojis?\b|\bsymbols?\b', 'emojis (words)', 8),
    (r'\bclickable\b|inside (?:an? )?(?:link|a tag)|\ban a tag\b|\bhyperlinks?\b|\blink hub\b|\bimage is a link\b', 'links (words)', 9),
    (r'\bbullet(?:ed)? lists?\b|\bnumbered lists?\b|\blist items?\b|\bul or ol\b|\bunordered list|\bordered list', 'lists (words)', 10),
    (r'\bborder-radius\b|\bbox-shadow\b|\btext-shadow\b|\btext-decoration\b|\bfont-weight\b|\bline-height\b|\bletter-spacing\b|\bopacity\b|\bfloat\b|\boverflow\b|\bmax-width\b|\bmin-width\b|\bbox-sizing\b|\bbackground-image\b|\bbackground-size\b', 'a property this course never teaches (words)', 99),
    (r'\bdisplay\W{0,6}block\b|\bblock element', 'display: block (words)', 14),
    (r'\bsans-serif\b|\bserif\b|\bmonospace\b|\bcursive\b', 'generic font families (words)', 5),
    (r'\btables?\b|\bheader row\b|\bdata cells?\b|\btable cells?\b', 'tables (words)', 12),
]
LEGACY_EXTRA = [(re.compile(a, re.I), b, c) for a, b, c in LEGACY_EXTRA]
def legacy():
    import subprocess
    names = {'6.2': '3.2', '6.20': '3.3', '6.3': '3.4', '6.35': '3.5', '6.4': '3.6', '6.7': '3.7', '6.75': '3.8', '6.6': '3.9', '6.5': '3.10', '7.1': '4.1', '7.2': '4.2', '7.3': '4.3', '7.4': '4.4', '7.5': '4.5'}
    o = subprocess.run(['node', os.path.join(HERE, 'dump_legacy.mjs')], capture_output=True, text=True, cwd=ROOT)
    d = json.loads(o.stdout)
    for lid, v in d.items():
        r = RANK[names[lid]]
        ans = ' '.join(re.findall(r'"(?:p|build|h|t|q|label|text|opts)":\s*(\[[^\]]*\]|"(?:[^"\\]|\\.)*")', v['answers'])) if False else v['answers']
        for part, txt in (('assignment steps', ans), ('check list', ' '.join(v['checks'])), ('concepts', v['concepts']), ('rubric rules', ' '.join(v['rules']))):
            where = 'Older assignment %s (%s) %s' % (lid, names[lid], part)
            check(where, r, txt)
            t = _html.unescape(re.sub(r'\\"|\\n', ' ', txt))
            for rx, name, rank in LEGACY_EXTRA:
                m = rx.search(t)
                if m and rank > r and (where, name) not in ALLOW: ISSUES.append((where, name, 'taught at %s' % NAME.get(rank, 'never'), t[max(0, m.start() - 70):m.end() + 60]))
# ---------------------------------------------------------------- Unit 5: Intro to CSS (5.1-5.6 = ranks 16-21); the gates live in tools/css5/gen_css5_gates.py
def unit5():
    import subprocess
    sys.path.insert(0, os.path.join(ROOT, 'tools', 'css5'))
    import gen_css5_gates as G
    RK = {'5.1': 16, '5.2': 17, '5.3': 18, '5.4': 19, '5.5': 20, '5.6': 21}
    def chk(where, rank, text):
        t = _html.unescape(text)
        for rx, name, r in G.GATES:
            m = re.search(rx, t, re.M)
            if m and r > rank and (where, name) not in ALLOW5 and not (where.startswith('Practice test Q') and name == 'something never taught' and '<style>' in t and 'only rules' in t): ISSUES.append((where, name, 'taught at %s' % r, t[max(0, m.start() - 70):m.end() + 60].replace('\n', ' ')))
    d = load_js_json(os.path.join(ROOT, 'ist', 'unit-6', 'practice-data-3.js'))['lessons']
    for lid, L in d.items():
        for n, p in enumerate(L['problems']):
            chk('Parsons %s #%d' % (L['num'], n + 1), RK[L['num']], ' '.join([p['title'], p['story'], p.get('given') or ''] + p['sol'] + p['steps'] + [x['t'] for x in p['pieces'] if not x.get('d')]))
    for l in range(16, 22):
        s_ = open(os.path.join(ROOT, 'ist', 'unit-6', 'game-data', 'l%d.js' % l), encoding='utf-8').read()
        qs = json.loads(s_[s_.index('= [') + 2: s_.rindex(']') + 1]); seen = set()
        for q in qs:
            txt = json.dumps({k: q[k] for k in ('s', 'c', 'o', 'e') if k in q}, ensure_ascii=False)
            for rx, name, r in G.GATES:
                m = re.search(rx, _html.unescape(txt), re.M)
                if m and r > l and (name, 'g%d' % l) not in seen and ('Quiz game %d' % l, name) not in ALLOW5: seen.add((name, 'g%d' % l)); ISSUES.append(('Quiz game %d' % l, name, 'taught at %s' % r, _html.unescape(txt)[max(0, m.start() - 60):m.end() + 60]))
    t5 = open(os.path.join(ROOT, 'ist', 'unit-8', 'unit-5-practice-test.html'), encoding='utf-8').read()
    qs = json.loads(re.search(r'var Q = (\[.*?\n\]);', t5, re.S).group(1))
    for i, q in enumerate(qs):
        lesson = [k for k, v in {'External CSS and classes': 16, 'CSS by id': 17, 'Selectors and specificity': 18, 'Pseudo-classes and transitions': 19, 'Flexbox': 20, 'Grid': 21}.items() if k == q['t']][0]
        chk('Practice test Q%d' % (i + 1), {'External CSS and classes': 16, 'CSS by id': 17, 'Selectors and specificity': 18, 'Pseudo-classes and transitions': 19, 'Flexbox': 20, 'Grid': 21}[q['t']], json.dumps(q, ensure_ascii=False))
    o = subprocess.run(['node', '-e', """globalThis.window = undefined; const D = '%s/ist/unit-6/'; const req = require;
['html-check.js','lab-lessons.js','step-checks.js','step-checks-a.js','step-checks-b.js','step-checks-w.js','step-checks-w2.js','css-labs.js','css-labs-1.js','css-labs-2.js','css-labs-3.js'].forEach(f => req(D + f));
const SC = globalThis.U7_STEPCHECKS, out = {}; for (const o of SC.W.CSS.LABS) { const r = SC.run(o.id, o.model.html, o.model.css); const labels = []; Object.values(r).forEach(s => s.bullets.forEach(b => b.forEach(x => labels.push(x.label)))); out[o.id] = { text: JSON.stringify(globalThis.U7_ANSWERS[o.id]), labels: labels, model: o.model.html + '\\n' + o.model.css }; } console.log(JSON.stringify(out));""" % ROOT], capture_output=True, text=True)
    for lid, v in json.loads(o.stdout).items():
        base = '5.' + lid[2]; r = RK[base]
        chk('Walkthrough/assignment %s (%s) text' % (lid, base), r, v['text']); chk('Walkthrough/assignment %s check list' % lid, r, ' '.join(v['labels'])); chk('Model answer %s' % lid, r, v['model'])
    # the Unit 5 study guide (code and prose of every chapter)
    sys.path.insert(0, os.path.join(ROOT, 'tools', 'guides'))
    import gl, ist_lib
    gl.LANG = 'html'
    import units.ist05 as u5
    for ch in u5.UNIT.chapters:
        html, titles, extras = gl.build_html(u5.UNIT, only=ch['id'])
        body = html[html.index('<section class="chapter">'):]
        body = re.sub(r'<style.*?</style>|ZZ\w+ZZ', ' ', body, flags=re.S)
        caps = ' '.join(re.findall(r'<text[^>]*>([^<]*)</text>', body)); body = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S)
        chk('Guide %s' % ch['id'], RK[ch['id']], tags_strip(body) + ' ' + caps)
    NOTES5 = {'external-css-notes.html': '5.1', 'css-id-notes.html': '5.2', 'specificity-notes.html': '5.3', 'hover-notes.html': '5.4', 'flexbox-notes.html': '5.5', 'grid-notes.html': '5.6'}
    for f, num in NOTES5.items():
        s_ = open(os.path.join(ROOT, 'ist', 'unit-8', f), encoding='utf-8').read()
        s_ = re.sub(r'<style.*?</style>|<script.*?</script>', ' ', s_, flags=re.S); s_ = re.sub(r'\s(?:style)="[^"]*"', ' ', s_)
        chk('Notes %s' % num, RK[num], tags_strip(s_))
    o = subprocess.run(['node', os.path.join(ROOT, 'tools', 'css5', 'dump_legacy8.mjs')], capture_output=True, text=True, cwd=ROOT)
    for lid, v in json.loads(o.stdout).items():
        r = RK['5.' + lid[2]]
        for part, txt in (('assignment steps', v['answers']), ('check list', ' '.join(v['checks'])), ('concepts', v['concepts']), ('rubric rules', ' '.join(v['rules']))):
            chk('Older assignment %s (5.%s) %s' % (lid, lid[2], part), r, txt)
ALLOW5 = {('Guide 5.1', 'something never taught'), ('Quiz game 16', 'something never taught'), ('Notes 5.1', 'something never taught'), ('Older assignment 8.1 (5.1) assignment steps', 'id selector'), ('Older assignment 8.1 (5.1) rubric rules', 'combined or descendant selector')}   # <style> appears only as the WRONG habit 5.1 teaches against; '#E8F0FF' is a hex color (4.2); 'style.css' has a dot in it
# ---------------------------------------------------------------- Unit 6: Bootstrap (6.1-6.6 = ranks 22-27); the gates live in tools/bs6/bsgates.py
def unit6():
    import subprocess
    sys.path.insert(0, os.path.join(ROOT, 'tools', 'bs6'))
    import bsgates as G
    RK = {'6.1': 22, '6.2': 23, '6.3': 24, '6.4': 25, '6.5': 26, '6.6': 27}
    def chk(where, rank, text):
        t = _html.unescape(text)
        for e in G.audit(t, rank):
            if (where, e.split(' (')[0]) not in ALLOW6: ISSUES.append((where, e, '', ''))
    d = load_js_json(os.path.join(ROOT, 'ist', 'unit-6', 'practice-data-4.js'))['lessons']
    for lid, L in d.items():
        for n, p in enumerate(L['problems']):
            chk('Parsons %s #%d' % (L['num'], n + 1), RK[L['num']], ' '.join([p['title'], p['story'], p.get('given') or ''] + p['sol'] + p['steps']))
    for l in range(22, 28):
        s_ = open(os.path.join(ROOT, 'ist', 'unit-6', 'game-data', 'l%d.js' % l), encoding='utf-8').read()
        qs = json.loads(s_[s_.index('= [') + 2: s_.rindex(']') + 1]); seen = set()
        for q in qs:
            txt = _html.unescape(' '.join([q['s'], q.get('c') or '', q['e']] + q['o']))
            for e in G.audit(txt, l):
                if (e, l) not in seen: seen.add((e, l)); ISSUES.append(('Quiz game %d' % l, e, '', ''))
    t6 = open(os.path.join(ROOT, 'ist', 'unit-9', 'unit-6-practice-test.html'), encoding='utf-8').read()
    qs = json.loads(re.search(r'var Q = (\[.*?\n\]);', t6, re.S).group(1))
    TOP = {'Setting up Bootstrap': 22, 'The grid': 23, 'Typography, colors and buttons': 24, 'Navbar': 25, 'Cards': 26, 'Forms': 27}
    for i, q in enumerate(qs): chk('Practice test Q%d' % (i + 1), TOP[q['t']], json.dumps(q, ensure_ascii=False))
    o = subprocess.run(['node', '-e', """globalThis.window = undefined; const D = '%s/ist/unit-6/'; const req = require;
['html-check.js','lab-lessons.js','step-checks.js','step-checks-a.js','step-checks-b.js','step-checks-w.js','step-checks-w2.js','css-labs.js','css-labs-1.js','css-labs-2.js','css-labs-3.js','bs-labs.js','bs-labs-1.js','bs-labs-2.js'].forEach(f => req(D + f));
const SC = globalThis.U7_STEPCHECKS, out = {}; for (const o of SC.W.BS.LABS) { const r = SC.run(o.id, o.model.html, o.model.css); const labels = []; Object.values(r).forEach(s => s.bullets.forEach(b => b.forEach(x => labels.push(x.label)))); out[o.id] = { text: JSON.stringify(globalThis.U7_ANSWERS[o.id]), labels: labels, model: o.model.html + '\\n' + o.model.css }; } console.log(JSON.stringify(out));""" % ROOT], capture_output=True, text=True)
    for lid, v in json.loads(o.stdout).items():
        r = RK['6.' + lid[2]]
        chk('Walkthrough/assignment %s text' % lid, r, v['text']); chk('Walkthrough/assignment %s check list' % lid, r, ' '.join(v['labels'])); chk('Model answer %s' % lid, r, v['model'])
    NOTES6 = {'9-1-setting-up-bootstrap.html': '6.1', '9-2-the-grid-system.html': '6.2', '9-3-typography-colors-and-buttons.html': '6.3', '9-4-navbar.html': '6.4', '9-5-cards.html': '6.5', '9-6-forms.html': '6.6'}
    for f, num in NOTES6.items():
        s_ = open(os.path.join(ROOT, 'ist', 'unit-9', f), encoding='utf-8').read()
        a = s_.find('<h2>Notes'); b = s_.find('Assignments', a); seg = s_[a:b] if a > 0 else s_
        chk('Notes %s' % num, RK[num], tags_strip(re.sub(r'<style.*?</style>|<script.*?</script>', ' ', seg, flags=re.S)))
    sys.path.insert(0, os.path.join(ROOT, 'tools', 'guides'))
    import gl
    gl.LANG = 'html'
    import units.ist06 as u6
    for ch in u6.UNIT.chapters:
        html, titles, extras = gl.build_html(u6.UNIT, only=ch['id'])
        body = html[html.index('<section class="chapter">'):]
        body = re.sub(r'<style.*?</style>|ZZ\w+ZZ', ' ', body, flags=re.S)
        caps = ' '.join(re.findall(r'<text[^>]*>([^<]*)</text>', body)); body = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S)
        chk('Guide %s' % ch['id'], RK[ch['id']], tags_strip(body) + ' ' + caps)
    o = subprocess.run(['node', os.path.join(ROOT, 'tools', 'bs6', 'dump_legacy9.mjs')], capture_output=True, text=True, cwd=ROOT)
    for lid, v in json.loads(o.stdout).items():
        r = RK['6.' + lid[2]]
        for part, txt in (('assignment steps', v['answers']), ('check list', ' '.join(v['checks'])), ('concepts', v['concepts']), ('rubric rules', ' '.join(v['rules']))):
            chk('Older assignment %s (6.%s) %s' % (lid, lid[2], part), r, txt)
ALLOW6 = set()
if __name__ == '__main__':
    for fn in (parsons, games, tests, labs, checks, guides, notes, legacy, unit5, unit6): fn()
    # report, grouped
    from collections import OrderedDict
    g = OrderedDict()
    for w, c, t, smp in ISSUES: g.setdefault((w, c, t), smp)
    if '--quiet' not in sys.argv:
        for (w, c, t), smp in g.items(): print('%-45s uses %-34s (%s)  e.g. %r' % (w, c, t, smp))
    print('TOTAL concept-order problems:', len(g)); sys.exit(1 if g else 0)
