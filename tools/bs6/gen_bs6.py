"""Builds ist/unit-6/practice-data-4.js (window.IST9): 10 Parsons problems per lesson of IST Unit 6 (Bootstrap), checked in real Chrome with the real Bootstrap stylesheet by oracle.mjs.
usage: python3 gen_bs6.py"""
import sys, os, re, json, random, subprocess, html as _html
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
import p6a, p6b, bsgates
from run_oracle import LES, build, run
RANK = {'6.1': 22, '6.2': 23, '6.3': 24, '6.4': 25, '6.5': 26, '6.6': 27}
TITLES = {'6.1': 'Setting Up Bootstrap', '6.2': 'The Grid System', '6.3': 'Typography, Colors and Buttons', '6.4': 'Navbar', '6.5': 'Cards', '6.6': 'Forms'}
IDS = {'6.%d' % n: 'i9l%d' % n for n in range(1, 7)}
CDN = p6a.BS
MEAN = {'container': 'the wrapper that centers the content', 'row': 'one line of columns', 'col': 'a column that shares the row equally', 'navbar': 'a navigation bar', 'navbar-expand-lg': 'links in a row on wide screens', 'navbar-dark': 'light text for a dark bar', 'navbar-brand': 'the site name', 'navbar-nav': 'the div around the links', 'nav-link': 'a menu link',
        'card': 'the bordered box', 'card-body': 'padding around the content', 'card-title': 'the card title', 'card-text': 'the card text', 'card-img-top': 'a picture at the top of the card', 'form-label': 'the label style', 'form-control': 'a full-width field', 'mb-3': 'space below', 'mt-3': 'space above', 'p-3': 'padding inside', 'btn': 'a button', 'fw-bold': 'bold text', 'text-center': 'centered text', 'text-muted': 'gray text', 'text-white': 'white text'}
def cls_phrase(c):
    m = re.fullmatch(r'col-(\d+)', c)
    if m: return 'a column %s of 12 wide' % m.group(1)
    m = re.fullmatch(r'col-md-(\d+)', c)
    if m: return 'a column %s of 12 wide on medium screens and up (full width on phones)' % m.group(1)
    m = re.fullmatch(r'(text|bg|btn)-(\w+)', c)
    if m and c not in MEAN: return {'text': 'the %s text color', 'bg': 'a %s background', 'btn': 'the %s button color'}[m.group(1)] % m.group(2)
    return MEAN.get(c)
def describe(line):
    t = line.strip()
    if t.startswith('<link'): 
        return 'Connect Bootstrap: a link tag with rel `stylesheet` and the https address of bootstrap.min.css.' if 'bootstrap' in t else 'Connect your own file: a link tag with rel `stylesheet` and href `style.css`.'
    m = re.match(r'^<(/?)([a-z0-9]+)', t)
    if not m: return 'Write `%s`.' % t
    closing, name = m.group(1), m.group(2)
    if closing: return 'Close the `%s`.' % name
    cm = re.search(r'class="([^"]+)"', t); classes = cm.group(1).split() if cm else []
    txt = re.sub(r'<[^>]+>', '', t).strip(); both = t.count('<') >= 2 and not t.endswith('>') is False
    parts = []
    for c in classes:
        ph = cls_phrase(c)
        if ph: parts.append('`%s` (%s)' % (c, ph))
        else: parts.append('`%s`' % c)
    extra = ''
    if name == 'a' and 'href' in t: extra = ' that links to %s' % re.search(r'href="([^"]*)"', t).group(1)
    if name == 'label' and 'for=' in t: extra = ' linked to the field `%s`' % re.search(r'for="([^"]*)"', t).group(1)
    if name == 'input': return 'Write an `input` of type `%s`%s.' % ((re.search(r'type="([^"]*)"', t) or [0, 'text'])[1] if re.search(r'type="', t) else 'text', (' with the id `%s`' % re.search(r'id="([^"]*)"', t).group(1)) if 'id="' in t else '') + ((' and the class ' + ', '.join(parts)) if parts else '')
    closed = ('</%s>' % name) in t
    what = 'Write a `%s`' % name if closed else 'Open the `%s`' % name
    if parts: what += ' with the class%s %s' % ('es' if len(parts) > 1 else '', ', '.join(parts))
    if txt and closed: what += extra + ' that says %s' % txt
    elif extra: what += extra
    return what + '.'
def exercise_key(p):
    k = re.sub(r'>[^<]+<', '><', '\n'.join(p['lines'])) + '|' + (p['css'] or '') + '|' + p['title']
    return re.sub(r'(href|src|alt|for|id)="[^"]*"', r'\1=""', k)
def preview(p):
    if p['mode'] == 'head':
        body = '\n'.join(p['lines']); body = re.sub(r'<link rel="stylesheet" href="style.css">', lambda m: '<style>%s</style>' % (p['css'] or ''), body)
        return '<!DOCTYPE html>\n<html>\n' + body + '\n</body>\n</html>'
    return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Page</title>\n%s\n</head>\n<body>\n%s\n</body>\n</html>' % (CDN, '\n'.join(p['lines']))
def main():
    errors = []; probs = build(); out = run(probs)
    rnd = random.Random(66); D = {}
    for num, L in LES.items():
        k = RANK[num]; ps = []; seen = set()
        for i, p in enumerate(L):
            tag = '%s P%d' % (num, i + 1); o = out[tag]
            if 'error' in o or o['badDis'] or not o['valid'] or len(o['valid']) > 3000 or len(p['lines']) > 8: errors.append((tag, 'oracle trouble %s' % {kk: o.get(kk) for kk in ('badDis', 'error')} if ('error' in o or o['badDis']) else (tag, 'valid=%d lines=%d' % (len(o['valid']), len(p['lines']))))); continue
            for e in bsgates.audit('\n'.join(p['lines']), k): errors.append((tag, e))
            ek = exercise_key(p)
            if ek in seen: errors.append((tag, 'same exercise as another problem in this lesson'))
            seen.add(ek)
            sol = p['lines']; dis = p['dis']
            pieces = [dict(t=t) for t in sol] + [dict(t=t, d=1) for _, t in dis]
            valid = set(o['valid']); distinct = []
            for t in sol:
                if t not in distinct: distinct.append(t)
            def key_of(ps_): return ''.join(format(distinct.index(x['t']), 'x') for x in ps_ if not x.get('d'))
            for _ in range(300):
                rnd.shuffle(pieces)
                if key_of(pieces) not in valid: break
            else: errors.append((tag, 'could not shuffle')); continue
            q = dict(title=p['title'], story=p['story'], pieces=pieces, sol=sol, steps=[describe(l) for l in sol], valid=sorted(valid), html=preview(p))
            if p['mode'] == 'head' and p['css']: q.update(given=p['css'], givenName='style.css (already written)')
            ps.append(q)
        ps.sort(key=lambda q: (len(q['sol']), q['title']))
        if len(ps) != 10: errors.append((num, 'need 10 problems, have %d' % len(ps)))
        D[IDS[num]] = dict(num=num, title=TITLES[num], problems=ps, traces=[])
    if errors:
        for e in errors: print('PROBLEM', e)
        sys.exit(1)
    dump = json.dumps(dict(lessons=D), ensure_ascii=False, separators=(',', ':'))
    open(os.path.join(ROOT, 'ist', 'unit-6', 'practice-data-4.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/bs6/gen_bs6.py. Do not edit by hand. */\nwindow.IST9 = ' + dump + ';\n')
    print('OK: %d lessons, %d Parsons' % (len(D), sum(len(v['problems']) for v in D.values())))
main()
