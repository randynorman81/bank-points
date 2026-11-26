"""Spelling, punctuation and grammar-rule check of every student-facing string of Units 3 and 4 (and 5 with --u5). Run with the guides venv:
   tools/guides/.venv/bin/python tools/qa/text_check.py [--u5]        (first: node tools/qa/corpus_u34.mjs)
It lists each distinct problem ONCE with a few places it appears, so a person can review the list. Nothing is changed by this script."""
import json, re, sys, os, html, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from spellchecker import SpellChecker
sp = SpellChecker()
ALLOW = set(open(os.path.join(ROOT, 'tools/qa/text_allow.txt')).read().split()) if os.path.exists(os.path.join(ROOT, 'tools/qa/text_allow.txt')) else set()
corpus = json.load(open(os.path.join(ROOT, 'tools/qa/_corpus_u34.json'), encoding='utf-8'))
def extra(path, fn):
    try: return fn(open(os.path.join(ROOT, path), encoding='utf-8').read())
    except Exception as e: print('(could not read %s: %s)' % (path, e)); return []
def js(s): return json.loads(s[s.index('{'):s.rindex('}') + 1])
def walk(o, src, out):
    if isinstance(o, str): out.append({'src': src, 't': o})
    elif isinstance(o, list): [walk(i, src, out) for i in o]
    elif isinstance(o, dict): [walk(v, src, out) for k, v in o.items() if k not in ('re', 'flags', 'label', 'id', 'game', 'sol', 'ex', 'expect', 'pieces', 'valid', 'checks', 'mcKey', 'slot', 'ins', 'code', 'tips')]
# training text, workplace emails / reviews / file text, Parsons stories and steps, trace intros and step texts
for f in ('python/training.js', 'python/training-u4.js'):
    o = js(open(os.path.join(ROOT, f), encoding='utf-8').read()) if f.endswith('training.js') else js(open(os.path.join(ROOT, f), encoding='utf-8').read().split('window.PY_TRAIN_U4 = ')[1].split(';\nwindow.PY_TRAIN = ')[0].join(['{"x":', '}']))
    tmp = []; walk(o, f, tmp); corpus += [x for x in tmp if re.search(r'[A-Za-z]{3}', x['t'])]
W = open(os.path.join(ROOT, 'python/workplace.js'), encoding='utf-8').read()
for n in list(range(126, 139)) + list(range(139, 151)):
    m = re.search(r'W\.a%d = (\{.*?\});\n' % n, W, re.S)
    if m:
        d = json.loads(m.group(1)); tmp = []; walk([d['email'], d['review'], [f['text'] for f in d['files']]], 'workplace a%d' % n, tmp); corpus += tmp
for f, key in (('python/parsons-u3.js', 'p3'), ('python/parsons-u4.js', 'p4')):
    for lid, L in js(open(os.path.join(ROOT, f), encoding='utf-8').read())['lessons'].items():
        for k, p in enumerate(L['problems']): corpus += [{'src': 'parsons %s #%d' % (lid, k + 1), 't': p['title']}, {'src': 'parsons %s #%d' % (lid, k + 1), 't': p['story']}] + [{'src': 'parsons %s #%d step' % (lid, k + 1), 't': x} for x in p['steps']]
for f in ('python/trace-u3.js', 'python/trace-u4.js'):
    for lid, L in js(open(os.path.join(ROOT, f), encoding='utf-8').read()).items():
        for k, t in enumerate(L['traces']): corpus += [{'src': 'trace %s #%d' % (lid, k + 1), 't': t['intro']}] + [{'src': 'trace %s #%d step' % (lid, k + 1), 't': s[2]} for s in t['steps']]
for f in ('apcsp/unit-3/unit-3-practice-test.html', 'apcsp/unit-4/unit-4-practice-test.html'):
    h = open(os.path.join(ROOT, f), encoding='utf-8').read(); a = h.index('var Q = ['); Q = json.loads(h[a + 8:h.index('];', a) + 1])
    for k, q in enumerate(Q, 1): corpus += [{'src': '%s Q%d' % (os.path.basename(f), k), 't': x} for x in [q['s'], q['e']] + q['o']]
gp = os.path.join(ROOT, 'tools/qa/_game_text.json')
if os.path.exists(gp): corpus += json.load(open(gp))
def prose(t):
    t = re.sub(r'\[\[([^\]|]*)\|[^\]]*\]\]', r'\1', t); t = re.sub(r'```.*?```', ' ', t, flags=re.S); t = re.sub(r'`[^`]*`', 'CODE', t)
    t = re.sub(r'</?(b|i|em|strong|code|u|span|br)[^>]*>', '', t)
    t = re.sub(r'<[^>]+>', ' ', t); t = html.unescape(t); t = re.sub(r'\*\*|__', '', t); t = re.sub(r'https?://\S+', ' ', t); return t
seen = {}; found = collections.defaultdict(list)
def flag(kind, detail, src): found[(kind, detail)].append(src)
for item in corpus:
    raw = item['t']; src = item['src']
    if '[code]' in src or not isinstance(raw, str) or not re.search(r'[A-Za-z]{3}', raw): continue
    key = raw
    if key in seen: continue
    seen[key] = src; t = prose(raw)
    if raw.count('**') % 2 and '**' not in re.findall(r'`[^`]*`', raw).__str__() : flag('unbalanced **', raw[:70], src)
    if raw.count('`') % 2: flag('unbalanced backtick', raw[:70], src)
    if re.sub(r'`[^`]*`', '', raw).count('(') != re.sub(r'`[^`]*`', '', raw).count(')'): flag('unbalanced ( )', raw[:70], src)
    if re.sub(r'`[^`]*`', '', t).count('"') % 2: flag('odd number of double quotes', raw[:70], src)
    if re.search(r'\[\[(?![^\]]*\|[^\]]*\]\])', raw): flag('broken [[help link]]', raw[:70], src)
    if re.search('[—–]', raw): flag('dash character', raw[:70], src)
    if re.search(r'\S  \S', t) and '<' not in raw: flag('double space', raw[:70], src)
    for m in re.finditer(r'\b([A-Za-z]+) \1\b', t, re.I):
        if m.group(1).lower() not in ('that', 'had', 'code', 'true', 'false', 'x', 'so', 'is', 'very'): flag('doubled word', m.group(0), src)
    for m in re.finditer(r'\b(a|an) ([A-Za-z]+)', t):
        art, nxt = m.group(1).lower(), m.group(2).lower()
        if nxt == 'code' or nxt in ('hour', 'honest', 'honor', 'heir', 'int', 'f', 'html', 'mph', 'x', 'sql', 'fl', 'mc', 'url', 'uber', 'usual', 'one', 'once', 'user', 'unit', 'useful', 'use', 'used', 'unique', 'uniform', 'union', 'universal', 'utf', 'unicode', 'uppercase', 'if', 'and', 'or', 'not'): continue
        if (art == 'a' and nxt[0] in 'aeiou') or (art == 'an' and nxt[0] not in 'aeiou'): flag('a/an', m.group(0), src)
    if re.search(r'[a-z][.!?][A-Z][a-z]', t): flag('no space after a period', raw[:80], src)
    if re.search(r'[a-z],[A-Za-z]', t): flag('no space after a comma', raw[:80], src)
    if re.search(r'\s[,;:!?](\s|$)', t): flag('space before punctuation', raw[:80], src)
    if re.search(r'[,;:]{2,}|(?<!\.)\.\.(?!\.)|\?\?|!!', t): flag('doubled punctuation', raw[:80], src)
    if re.search(r'\.\s+[a-z]', re.sub(r'\b(e\.g|i\.e|vs|etc)\.', '', t)): flag('sentence starts with a lowercase letter', raw[:80], src)
    if re.search(r"\b(its|it's)\s+(a|an|the|not|been|going|time)\b", t, re.I) and re.search(r"\bits (a|an|the|not|been|going|time)\b", t, re.I): flag("its/it's", raw[:80], src)
    if re.search(r"\bit's (own|self|name|value|type|length|index|result|turn|place)\b", t, re.I): flag("it's/its", raw[:80], src)
    if re.search(r'\byour (a|an|the|not|going|welcome)\b', t, re.I): flag("your/you're", raw[:80], src)
    if re.search(r'\b(more|less|better|bigger|smaller|larger|greater|fewer|rather|other) then\b', t, re.I): flag('then/than', raw[:80], src)
    if re.search(r'\b(alot|teh|recieve|seperate|occured|definately|wich|thier|wierd|untill|acheive|begining|existance|goverment|enviroment)\b', t, re.I): flag('common misspelling', raw[:80], src)
    for w in re.findall(r"[A-Za-z][A-Za-z']*", t):
        lw = w.lower().strip("'")
        if len(lw) <= 2 or lw in ALLOW or lw == 'code': continue
        base = re.sub(r"'(s|t|re|ve|ll|d)$", '', lw)
        if base in ALLOW or base in sp or lw in sp or (base.endswith("n") and base[:-1] in ALLOW): continue
        if "'" in lw and base in sp: continue
        flag('unknown word', lw, src)
print('distinct strings checked:', len(seen))
order = ['unbalanced **', 'unbalanced backtick', 'unbalanced ( )', 'odd number of double quotes', 'broken [[help link]]', 'dash character', 'double space', 'doubled word', 'a/an', 'no space after a period', 'no space after a comma', 'space before punctuation', 'doubled punctuation', 'sentence starts with a lowercase letter', "its/it's", "it's/its", "your/you're", 'then/than', 'common misspelling', 'unknown word']
tot = 0
for kind in order:
    items = [(d, v) for (k, d), v in found.items() if k == kind]
    if not items: continue
    tot += len(items); print('\n== %s (%d distinct)' % (kind, len(items)))
    for d, v in sorted(items, key=lambda x: -len(x[1]))[:int(os.environ.get('SHOW', '60'))]: print('   %-60s x%-3d %s' % (d[:60], len(v), v[0]))
print('\nTOTAL distinct findings:', tot)
