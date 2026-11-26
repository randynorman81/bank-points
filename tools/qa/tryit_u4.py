"""Checks the 'Try it' claims of the Unit 4 walkthroughs by RUNNING each step's own program (what the step tells the student to type) with the values the sentence says to type.
A claim such as 'type 5, then 10, then 20, then 0: it prints 35' is confirmed when 35 shows up in the real output. Claims that talk about several runs ('run it three times, typing 8, then 7,
then 150') are run once per value. Anything that cannot be confirmed is printed so a person can read it.
usage: python3 tools/qa/tryit_u4.py [slots]   (QA_CACHE=/path.json reuses a saved copy of the list)"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'parsons'))
import wt_qa as q, wt_auto_u4 as A, wt_u4_overlays as O, u4_core
slots = sys.argv[1:] or ['a%d' % n for n in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)]
def run(code, ins):
    try: return '\n'.join(u4_core.run(code, ins, 1))
    except u4_core.Endless: return '<endless loop>'
    except StopIteration: return '<asked for more input>'
    except Exception as e: return 'ERR ' + type(e).__name__
def typed(t):
    m = re.search(r'\b(?:[Tt]ype|typing|enter)\s+((?:`?-?[\w.]+`?)(?:(?:,\s*(?:and\s+)?(?:then\s+)?|\s+and\s+(?:then\s+)?|\s+then\s+)`?-?[\w.]+`?)*)', t)
    if not m: return []
    return [x for x in re.split(r',\s*(?:and\s+)?(?:then\s+)?|\s+and\s+(?:then\s+)?|\s+then\s+', m.group(1)) if x]
ok = bad = skip = 0; report = []
for s in slots:
    rec = q.record(s); sec = A.sections(rec, O.OV.get(s)); step = None; n = 0; prog = {}
    for k, v in sec.items(): prog[k] = '\n'.join(x for x in v if not x.startswith('# Step'))
    EV = "class Event:\n    def __init__(self, key):\n        self.key = key\n"
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+)', b['h']); n = int(m.group(1)) if m and 'Stretch' not in b['h'] else None
            continue
        t = b.get('p', '')
        if not (n and t.startswith('▶')): continue
        m = re.search(r'(?:prints?|should (?:print|show|see|say|be|end)|shows?|displays?|answer (?:is|should be)|ends with)\s+(.*)', t)
        if not m or re.search(r'random|a few times|graphics', t) or n not in prog: skip += 1; continue
        claim = m.group(1)
        toks = re.findall(r'`([^`]{1,40})`', claim) + re.findall(r'(?<![\w.])(-?\d+\.\d+|-?\d+)(?![\w.])', re.sub(r'`[^`]*`', '', claim))
        toks = [x.strip('"\'') for x in toks]
        if not toks: skip += 1; continue
        code = prog[n]
        if 'Event(' in code and 'class Event' not in code: code = EV + code
        vals = typed(t)
        if re.search(r'(three|two|\d) times|again|separately|each time|both', t) and len(vals) > 1 and re.search(r'times|again|separately', t) and not re.search(r'then (type|enter)', t):
            outs = [run(code, [v]) for v in vals]
        else: outs = [run(code, vals)]
        out = '\n'.join(outs)
        miss = [x for x in toks if x not in out]
        if not miss: ok += 1
        else: bad += 1; report.append('%s step %d | %s | inputs %s | missing %s | output tail %r' % (s, n, t[:150].replace('\n', ' '), vals, miss, out[-110:]))
print('\n'.join(report))
print('\nTry-it claims confirmed by running the step: %d | not confirmed: %d | no checkable claim: %d' % (ok, bad, skip))
