"""Builds ist/unit-6/practice-data-3.js (window.IST8): 10 Parsons problems per lesson of IST Unit 5 (Intro to CSS + Layout), checked in real Chrome by oracle.mjs.
usage: python3 gen_css5.py"""
import sys, os, re, json, random, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
import p5a, p5b
from run_oracle import LES, build
RANK = {'5.1': 16, '5.2': 17, '5.3': 18, '5.4': 19, '5.5': 20, '5.6': 21}
TITLES = {'5.1': 'External CSS and Classes', '5.2': 'CSS by ID', '5.3': 'Selectors and Specificity', '5.4': 'Pseudo-classes and Hover Effects', '5.5': 'Flexbox Basics', '5.6': 'CSS Grid Basics'}
IDS = {'5.1': 'i8l1', '5.2': 'i8l2', '5.3': 'i8l3', '5.4': 'i8l4', '5.5': 'i8l5', '5.6': 'i8l6'}
TAUGHT_PROPS = set('color background-color font-size font-family text-align text-transform border border-top border-bottom border-left border-right width height padding margin display vertical-align list-style-type'.split())
GATES = [  # (regex over the css/html lines, concept, rank)
    (r'(^|[\s,])#[A-Za-z]', 'id selector', 17), (r'\bid="', 'id attribute', 17),
    (r'class="[^"]*\s[^"]*"', 'two classes on one tag', 18), (r'^\s*[A-Za-z0-9.#]+[.#][A-Za-z]|^\s*[.#A-Za-z0-9]+\s+[.#A-Za-z]+\s*\{', 'combined or descendant selector', 18), (r'style="', 'inline style', 2),
    (r':hover|:focus|:active', 'pseudo-class', 19), (r'\btransition\b', 'transition', 19),
    (r'display:\s*flex|justify-content|align-items|flex-direction|\bgap\b', 'flexbox', 20),
    (r'display:\s*grid|grid-template-columns|\bfr\b', 'grid', 21),
    (r'#[0-9A-Fa-f]{3,8}\b(?![^<]*>)', 'hex colors', 11),
    (r'border-radius|box-shadow|text-decoration|font-weight|line-height|opacity|position|float|overflow|@media|repeat\(|nth-child|grid-template-rows|flex-wrap|flex:\s|calc\(|rem\b|\bem\b|vh\b|vw\b|justify-items|place-|grid-area|!important|border-color|<style', 'something never taught', 99),
]
def concept_errors(tag, text, rank, errs):
    for rx, name, r in GATES:
        if r > rank and re.search(rx, text, re.M): errs.append((tag, 'uses %s, taught at rank %d (this lesson is %d)' % (name, r, rank)))
def describe(line, mode):
    t = line.strip()
    if mode == 'css':
        if t == '}': return 'Close the rule with `}`.'
        m = re.match(r'^(.+?)\s*\{$', t)
        if m:
            sel = m.group(1)
            if re.match(r'^[a-z0-9]+$', sel): what = 'every `%s` tag' % sel
            elif re.match(r'^\.[\w-]+$', sel): what = 'the class `%s` (a dot, then the name)' % sel[1:]
            elif re.match(r'^#[\w-]+$', sel): what = 'the id `%s` (a hash, then the name)' % sel[1:]
            elif ':' in sel: what = '`%s` (the tag or class, a colon, then the state, with no spaces)' % sel
            else: what = '`%s`' % sel
            return 'Start the rule for %s and open the curly brace.' % what
        m = re.match(r'^([a-z-]+):\s*(.+);$', t)
        if m: return 'Set `%s` to `%s`.' % (m.group(1), m.group(2))
        return 'Write `%s`.' % t
    if t.startswith('<link'): return 'Connect the stylesheet: a link tag with rel `stylesheet` and href `style.css`.'
    m = re.match(r'^<(/?)([a-z0-9]+)', t)
    if m:
        name = m.group(2)
        if m.group(1): return 'Close the `%s`.' % name
        txt = re.sub(r'<[^>]+>', '', t).strip()
        attr = re.search(r'\b(id|class)="([^"]+)"', t)
        if t.count('<') >= 2:
            return 'Write a `%s`%s%s.' % (name, (' with the %s `%s`' % attr.groups()) if attr else '', (' that says %s' % txt) if txt else '')
        return 'Open the `%s`.' % name
    return 'Write `%s`.' % t
COLORS = 'red blue navy gold teal green tomato purple yellow gray black white lightyellow lightblue orange'.split()
def exercise_key(p):
    k = re.sub(r'\d+', 'N', '\n'.join(p['lines']))
    k = re.sub(r'\b(%s)\b' % '|'.join(COLORS), 'C', k)
    return re.sub(r'[.#][A-Za-z][\w-]*', 'X', k)
def main():
    errors = []; probs = build()
    open('/private/tmp/claude-501/c5in.json', 'w').write(json.dumps(probs))
    r = subprocess.run(['node', os.path.join(HERE, 'oracle.mjs'), '/private/tmp/claude-501/c5in.json', '/private/tmp/claude-501/c5out.json'], capture_output=True, text=True)
    out = {o['id']: o for o in json.load(open('/private/tmp/claude-501/c5out.json'))}
    rnd = random.Random(55); D = {}
    for num, L in LES.items():
        k = RANK[num]; ps = []; seen = set()
        for i, p in enumerate(L):
            tag = '%s P%d' % (num, i + 1); o = out[tag]
            if 'error' in o or o['badDis'] or not o['valid'] or len(o['valid']) > 3000 or len(p['lines']) > 8: errors.append((tag, 'oracle trouble %s' % {kk: o.get(kk) for kk in ('badDis', 'error')})); continue
            concept_errors(tag, '\n'.join(p['lines']) + '\n' + (p['ctx'] or '') + '\n' + (p['css'] or ''), k, errors)
            if re.search(r'#[0-9A-Fa-f]{3,8}\b|\bhex', ' '.join([p['title'], p['story']] + p['lines'])): errors.append((tag, 'hex'))
            ek = exercise_key(p)
            if ek in seen: errors.append((tag, 'same exercise as another problem in this lesson'))
            seen.add(ek)
            sol = p['lines']; dis = p['dis']
            pieces = [dict(t=t) for t in sol] + [dict(t=t, d=1) for _, t in dis]
            valid = set(o['valid'])
            distinct = []
            for t in sol:
                if t not in distinct: distinct.append(t)
            def key_of(ps_):
                return ''.join(format(distinct.index(x['t']), 'x') for x in ps_ if not x.get('d'))
            for _ in range(200):
                rnd.shuffle(pieces)
                if not any(x.get('d') for x in pieces[:0]) and key_of(pieces) not in valid: break
            else: errors.append((tag, 'could not shuffle')); continue
            if p['mode'] == 'css':
                html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:10px}%s</style></head><body>%s</body></html>' % ('\n'.join(sol), p['ctx'])
                given, gname, mine = p['ctx'], 'index.html (already written)', 'Your style.css'
            else:
                body = '\n'.join(sol)
                body = re.sub(r'<link\b[^>]*>', lambda m: '<style>%s</style>' % p['css'], body)
                html = '<!DOCTYPE html>\n' + body if '<html' in body else '<!DOCTYPE html><html>' + body + '</html>'
                given, gname, mine = p['css'], 'style.css (already written)', 'Your index.html'
            ps.append(dict(title=p['title'], story=p['story'], mode=p['mode'], given=given, givenName=gname, mine=mine, pieces=pieces, sol=sol, steps=[describe(l, p['mode']) for l in sol], valid=sorted(valid), html=html))
        ps.sort(key=lambda q: (len(q['sol']), q['mode'] == 'html'))
        if len(ps) != 10: errors.append((num, 'need 10 problems, have %d' % len(ps)))
        D[IDS[num]] = dict(num=num, title=TITLES[num], problems=ps, traces=[])
    if errors:
        for e in errors: print('PROBLEM', e)
        sys.exit(1)
    dump = json.dumps(dict(lessons=D), ensure_ascii=False, separators=(',', ':'))
    open(os.path.join(ROOT, 'ist', 'unit-6', 'practice-data-3.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/css5/gen_css5.py. Do not edit by hand. */\nwindow.IST8 = ' + dump + ';\n')
    print('OK: %d lessons, %d Parsons' % (len(D), sum(len(v['problems']) for v in D.values())))
main()
