"""Structure and formatting audit of every student-visible Unit 3 text: help links point at real help boxes, help-box lists name real boxes, every ** and ` is balanced,
no empty paragraphs/steps, every checkbox text ends cleanly, and common grammar slips (its/it's, then/than, your/you're, there/their, a/an, double punctuation, missing space after a period)."""
import json, re, subprocess, os, sys
call = lambda b: json.loads(subprocess.run(['curl', '-s', '-X', 'POST', 'https://schscomputerscience.com/api/pycode', '-H', 'Content-Type: application/json', '-d', json.dumps(b)], capture_output=True, text=True).stdout)
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# the Unit 3 items are locked now, so the public list is empty: read the saved copies (walkthroughs a1-a13 from the last full export with the wording fix applied, assignments from the repo)
if '--u4' in sys.argv:      # Unit 4 is open, so the public list has it: read it (QA_CACHE=/path.json reuses a saved copy of the list)
    cp = os.environ.get('QA_CACHE'); allr = json.load(open(cp)) if cp and os.path.exists(cp) else call({'action': 'assignments'}); allr = allr.get('assignments', allr)
    want = ['a%d' % n for n in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)] + ['a%d' % n for n in range(139, 151)]
    rec = {k: allr[k] for k in want if k in allr}; src = 'live, Unit 4' if len(rec) == len(want) else 'MISSING %d' % (len(want) - len(rec))
else:
    rec = json.load(open(os.path.join(ROOT, 'tools/missions/testkit/u3-records.json')))
    src = 'saved copies' if len(rec) == 26 else 'MISSING %d' % (26 - len(rec))
problems = []
def P(slot, kind, txt): problems.append((slot, kind, txt[:150].replace('\n', ' ')))
def plain(t): return re.sub(r'`[^`]*`', 'X', t)
def check_text(slot, where, t):
    if not isinstance(t, str): return
    if t.count('**') % 2: P(slot, 'unbalanced ** in ' + where, t)
    if t.count('`') % 2: P(slot, 'unbalanced backtick in ' + where, t)
    if re.search(r'\[\[(?![^\]]*\|[^\]]*\]\])', t): P(slot, 'broken [[help link]] in ' + where, t)
    pt = plain(t)
    for m in re.finditer(r'\b(its|it\'s)\b', pt): pass
    if re.search(r"\bit's (own|self|name|value|type|length|index|result|turn|place)\b", pt, re.I): P(slot, "it's/its slip", t)
    if re.search(r"\bits (a|an|the|not|been|going|time)\b", pt, re.I): P(slot, "its/it's slip", t)
    if re.search(r'\byour (a|an|the|not|going|welcome)\b', pt, re.I) and not re.search(r'your (a|an|the)\b.*(box|key|code)', pt): P(slot, 'your/you\'re slip', t)
    if re.search(r'\b(more|less|better|bigger|smaller|larger|greater|fewer|rather|other) then\b', pt, re.I): P(slot, 'then/than slip', t)
    if re.search(r'\b(there|their) (is|are) (own|code)\b', pt): P(slot, 'there/their slip', t)
    if re.search(r'[a-z][.!?][A-Z][a-z]', pt) and not re.search(r'\.[a-z]{2,4}\b|\w\.\w', pt.split(' ')[0]): P(slot, 'missing space after a period', t)
    if re.search(r'\s[,.;:!?](\s|$)', pt) : P(slot, 'space before punctuation', t)
    if re.search(r'[,;:]{2,}|\.\.(?!\.)', pt) : P(slot, 'doubled punctuation', t)
    if re.search(r'\bteh\b|\brecieve\b|\bseperate\b|\boccured\b|\bdefinately\b|\bwich\b|\bthier\b|\bwierd\b', pt, re.I): P(slot, 'common typo', t)
    if re.search(r'\bi\b(?! =)(?!\s*[-=+*/<>(\[])', pt) and re.search(r"\bI\b", pt) is None and re.search(r'\bi (am|was|think|will|have|can|do|did|got|see)\b', pt): P(slot, 'lowercase i', t)
def walk(slot, where, o):
    if isinstance(o, str): check_text(slot, where, o)
    elif isinstance(o, list): [walk(slot, where, i) for i in o]
    elif isinstance(o, dict): [walk(slot, where, v) for k, v in o.items() if k not in ('re', 'flags', 'label', 'id', 'code', 'ex', 'tips')]
for s, r in rec.items():
    tips = r.get('tips') or {}
    ids_used = set(); sec_empty = 0
    for i, b in enumerate(r['blocks']):
        k = list(b.keys())[0]
        if k == 'tips':
            for t in b['tips']:
                ids_used.add(t)
                if t not in tips: P(s, 'a help list names a help box that does not exist: ' + t, json.dumps(b))
            continue
        v = b[k]
        if k in ('p', 'h') and not (v or '').strip(): P(s, 'empty ' + k, '')
        if k in ('make', 'build', 'where'):
            for t in v:
                if not t.strip(): P(s, 'empty checkbox', '')
                for m in re.finditer(r'\[\[[^\]|]*\|([^\]]*)\]\]', t):
                    ids_used.add(m.group(1))
                    if m.group(1) not in tips: P(s, 'a [[help link]] names a help box that does not exist: ' + m.group(1), t)
        walk(s, 'block %d' % i, b)
    for m in re.finditer(r'\[\[[^\]|]*\|([^\]]*)\]\]', json.dumps(r['blocks'])):
        if m.group(1) not in tips: P(s, 'help link to a missing box: ' + m.group(1), '')
    for tid, t in tips.items():
        if not (t.get('title') or '').strip(): P(s, 'help box without a title: ' + tid, '')
        if not t.get('sections'): P(s, 'help box without content: ' + tid, '')
        walk(s, 'tip ' + tid, t.get('sections', [])); check_text(s, 'tip title ' + tid, t.get('title'))
    for q in r.get('mc') or []:
        if len(set(q['choices'])) != len(q['choices']): P(s, 'duplicate answer choices', q['q'])
        for tidm in re.finditer(r'\[\[[^\]|]*\|([^\]]*)\]\]', q['q']):
            if tidm.group(1) not in tips: P(s, 'quiz help link to a missing box', tidm.group(1))
        walk(s, 'quiz', q.get('q'))
print('records read (%s): %d' % (src, len(rec)))
byk = {}
for p in problems: byk.setdefault(p[1].split(':')[0], []).append(p)
print('PROBLEMS:', len(problems))
for k, v in sorted(byk.items(), key=lambda x: -len(x[1])):
    print('  %-52s x%d  e.g. %s | %s' % (k, len(v), v[0][0], v[0][2]))
