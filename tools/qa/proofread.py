"""Proofreads every student-facing word of Unit 3: walkthroughs a1-a13 (steps, hints, questions), assignments a126-a138, training notes, Parsons and tracing text,
and the practice test. Lists words that are not in a dictionary, doubled words, double spaces, stray dashes, and 'a/an' slips, so a person can review them."""
import json, re, os, sys, subprocess, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
words = set(w.strip().lower() for w in open('/usr/share/dict/words', encoding='utf-8', errors='ignore')) | set(w.strip().lower() for w in open('/usr/share/dict/propernames'))
ALLOW = set('''typeerror valueerror nameerror syntaxerror indexerror zerodivisionerror keyerror attributeerror eoferror dasher info demo hrs msg pts onboarding marketplace shortcut weeknd dua lipa lovelace newell atl hmx rivera robux kwh ints
python print input int str float bool len find index slice slicing slices string strings variable variables boolean booleans decimal decimals username usernames
url urls api apps app ui ids id kwh gb gpa zip qa ok iphone ipad macos ios youtube tiktok airbnb doordash gmail spotify apple tesla roblox steam valve delta ups chick fil
dasher dashers dasher's esc ctrl alt cmd tab run runs eval repl py ide csp ap aws html css js json csv svg pdf pdfs wi fi wifi emoji vs eg ie etc nums num
immutable immutability concatenation concatenate concatenated concatenates typo typos cmd ml mdash endash timestamp whitespace namespace indices subtotal subtotals
unpassed uncomment uncommented uncommenting dev devs backend frontend login logins signup signups sign online offline setup runtime inbox emails email's wasn isn doesn don didn hasn haven aren weren won shouldn couldn wouldn i'm you'll we'll it's that's there's what's let's here's i'd you'd they're you're we're they'll
lessons lesson's walkthrough walkthroughs mc cheat checklist checkbox checkboxes tooltip tooltips ones ones' enter's hex binary decimal readme ascii unicode utf
gui os pc pcs gps ssd ram cpu gpu pixels pixel rgb tcp udp ip dns http https www com org net edu io
karel nasa fbi usa us ceo cto dj mvp ux ui qa ui's ok's
fahrenheit celsius kilowatt kilowatts watt watts mph kph kilometer kilometers
trace traced tracing tracer retrace regex'''.split())
def text_words(t):
    t = re.sub(r'`[^`]*`', ' ', t); t = re.sub(r'\[\[[^\]|]*\|[^\]]*\]\]', lambda m: m.group(0).split('|')[0][2:], t); t = re.sub(r'\*\*|__', '', t)
    t = re.sub(r'https?://\S+', ' ', t)
    return re.findall(r"[A-Za-z][A-Za-z']*", t)
found = collections.defaultdict(list); issues = []
def check(src, t):
    if not isinstance(t, str) or not t.strip(): return
    raw = t
    if re.search(r'\S  \S', re.sub(r'`[^`]*`', 'X', raw).replace('\n', ' ')): issues.append((src, 'double space', raw[:70]))
    if re.search(r'\b(\w+) \1\b', re.sub(r'`[^`]*`', '', raw), re.I):
        m = re.search(r'\b(\w+) \1\b', re.sub(r'`[^`]*`', '', raw), re.I)
        if m.group(1).lower() not in ('that', 'had'): issues.append((src, 'doubled word: ' + m.group(0), raw[:90]))
    if re.search('[—–]', raw): issues.append((src, 'dash character', raw[:70]))
    for m in re.finditer(r"\b(a|an) ([A-Za-z]+)", re.sub(r'`[^`]*`', '', raw)):
        art, nxt = m.group(1).lower(), m.group(2).lower()
        if nxt in ('hour', 'honest', 'honor', 'heir', 'int', 'f', 'html', 'mph', 'x', 'sql', 'fl', 'mc'): continue
        if nxt in ('one', 'once', 'user', 'unit', 'useful', 'usual', 'use', 'used', 'unique', 'uniform', 'union', 'universal', 'url', 'utf', 'unicode'): bad = art == 'an'
        else: bad = (art == 'a' and nxt[0] in 'aeiou') or (art == 'an' and nxt[0] not in 'aeiou')
        if bad: issues.append((src, 'a/an: ' + m.group(0), raw[:90]))
    for w in text_words(raw):
        lw = w.lower().strip("'")
        if "'" in lw and re.sub(r"'.*$", '', lw) in (words | {'isn','doesn','aren','didn','couldn','don','can','won','wasn','weren','wouldn','shouldn','hasn','haven','hadn','i','you','we','they','it','that','there','what','let','here','he','she','who','how','o'}): continue
        if lw in words or lw in ALLOW or len(lw) <= 2: continue
        base = re.sub(r"'s$", '', lw)
        if base in words or base in ALLOW: continue
        if lw.endswith('ing') and (lw[:-3] in words or lw[:-3] + 'e' in words or (len(lw) > 5 and lw[:-4] in words)): continue
        if lw.endswith('ed') and (lw[:-2] in words or lw[:-1] in words or (len(lw) > 4 and lw[:-3] in words)): continue
        if lw.endswith('s') and lw[:-1] in words: continue
        if lw.endswith('es') and lw[:-2] in words: continue
        if lw.endswith('ly') and lw[:-2] in words: continue
        if lw.endswith('er') and (lw[:-2] in words or lw[:-1] in words): continue
        found[lw].append((src, raw[:80]))
def walk(o, src):
    if isinstance(o, str): check(src, o)
    elif isinstance(o, list):
        for i in o: walk(i, src)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k in ('re', 'flags', 'label', 'id', 'game', 'sol', 'code', 'ex', 'expect', 'pieces', 'valid', 'checks', 'mcKey', 'slot', 'ins', 'tips'): continue
            walk(v, src)
def load_js(f, var):
    s = open(os.path.join(ROOT, f), encoding='utf-8').read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])
call = lambda b: json.loads(subprocess.run(['curl', '-s', '-X', 'POST', 'https://schscomputerscience.com/api/pycode', '-H', 'Content-Type: application/json', '-d', json.dumps(b)], capture_output=True, text=True).stdout)
live = call({'action': 'assignments'})['assignments']
for n in list(range(1, 14)) + list(range(126, 139)) + [16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28] + list(range(139, 151)):
    s = 'a%d' % n; r = live.get(s)
    if not r: print('(skipped %s: not served right now, locked)' % s); continue
    for b in r['blocks']:
        if 'code' in b: continue
        walk(b, s)
    for tid, t in (r.get('tips') or {}).items(): walk(t.get('sections', []), s + ' tip:' + tid); check(s + ' tip:' + tid, t.get('title'))
    for q in r.get('mc') or []: walk({'q': q['q'], 'c': q['choices']}, s + ' mc')
    check(s, r.get('title'))
walk(load_js('python/training.js', 'x'), 'training')
walk(load_js('python/training-u4.js', 'x'), 'training-u4')
P = load_js('python/parsons-u3.js', 'x')['lessons']
for lid, L in P.items():
    for k, p in enumerate(L['problems']): walk({'t': p['title'], 's': p['story'], 'steps': p['steps']}, 'parsons %s #%d' % (lid, k + 1))
T = load_js('python/trace-u3.js', 'x')
for lid, L in T.items():
    for k, t in enumerate(L['traces']): walk({'i': t['intro'], 'd': [s[2] for s in t['steps']]}, 'trace %s #%d' % (lid, k + 1))
html = open(os.path.join(ROOT, 'apcsp/unit-3/unit-3-practice-test.html'), encoding='utf-8').read()
qa = html.index('var Q = ['); Q = json.loads(html[qa + 8:html.index('];', qa) + 1])
for k, q in enumerate(Q): walk({'s': re.sub('<[^>]+>', ' ', q['s']), 'o': [re.sub('<[^>]+>', ' ', o) for o in q['o']], 'e': re.sub('<[^>]+>', ' ', q['e'])}, 'practice test Q%d' % (k + 1))
W = open(os.path.join(ROOT, 'python/workplace.js'), encoding='utf-8').read()
for n in range(126, 139):
    m = re.search(r'W\.a%d = (\{.*?\});\n' % n, W, re.S); d = json.loads(m.group(1)); walk([d['email'], d['review'], [f['text'] for f in d['files']]], 'workplace a%d' % n)
P4 = load_js('python/parsons-u4.js', 'x')['lessons']
for lid, L in P4.items():
    for k, p in enumerate(L['problems']): walk({'t': p['title'], 's': p['story'], 'steps': p['steps']}, 'parsons4 %s #%d' % (lid, k + 1))
T4 = load_js('python/trace-u4.js', 'x')
for lid, L in T4.items():
    for k, t in enumerate(L['traces']): walk({'i': t['intro'], 'd': [s[2] for s in t['steps']]}, 'trace4 %s #%d' % (lid, k + 1))
html = open(os.path.join(ROOT, 'apcsp/unit-4/unit-4-practice-test.html'), encoding='utf-8').read()
qa = html.index('var Q = ['); Q4 = json.loads(html[qa + 8:html.index('];', qa) + 1])
for k, q in enumerate(Q4): walk({'s': re.sub('<[^>]+>', ' ', q['s']), 'o': [re.sub('<[^>]+>', ' ', o) for o in q['o']], 'e': re.sub('<[^>]+>', ' ', q['e'])}, 'practice test 4 Q%d' % (k + 1))
for n in range(139, 151):
    m = re.search(r'W\.a%d = (\{.*?\});\n' % n, W, re.S); d = json.loads(m.group(1)); walk([d['email'], d['review'], [f['text'] for f in d['files']]], 'workplace a%d' % n)
print('ISSUES (not words):', len(issues))
for i in issues[:80]: print('  ', i)
print('UNKNOWN WORDS:', len(found))
for w, v in sorted(found.items(), key=lambda x: -len(x[1])): print('  %-22s x%-3d %s | %s' % (w, len(v), v[0][0], v[0][1].replace('\n', ' ')))
