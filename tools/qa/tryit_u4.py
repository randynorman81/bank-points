"""Checks every 'Try it' claim in the Unit 4 walkthroughs by RUNNING the step's own code block with the inputs the sentence says to type.
For each '▶ Try it' paragraph: take the nearest code block above it in the same step, feed it the typed values, and look for the numbers/words the sentence says appear.
Claims that cannot be checked this way (no code above, graphics, random numbers, several programs) are counted and left for a human read.
usage: python3 tools/qa/tryit_u4.py [slots]   (QA_CACHE=/path.json reuses a saved copy of the list)"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
slots = sys.argv[1:] or ['a%d' % n for n in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)]
PRE = "class Event:\n    def __init__(self, key):\n        self.key = key\n"
def inputs_of(t):
    m = re.search(r'\b[Tt]ype(?:ing)? ((?:`?-?[\w.]+`?)(?:(?:,| and|,? then|,? and then)\s+`?-?[\w.]+`?)*)', t)
    if not m: return None
    return [x.strip('` ') for x in re.split(r',? (?:and )?(?:then )?|,\s*', m.group(1)) if x.strip('` ')]
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'parsons'))
import u4_core
def run(code, ins):
    # u4_core.run stops an endless loop (Step 5 of the while-loop walkthrough shows one on purpose) and returns the printed lines
    try: return '\n'.join(u4_core.run(code, ins))
    except u4_core.Endless: return '<endless loop>'
    except StopIteration: return '<asked for more input than the sentence says to type>'
    except Exception as e: return 'ERR %s' % type(e).__name__
ok = bad = skip = 0
for s in slots:
    rec = q.record(s); last = None; step = None
    for b in rec['blocks']:
        if 'h' in b: step = b['h']; last = None
        elif 'code' in b and not re.search(r'PROCEDURE|←', b['code']): last = b['code']
        elif 'p' in b and b['p'].startswith('▶'):
            t = b['p']; m = re.search(r'(?:prints?|should (?:print|show|see|say|be)|shows?|displays?|answer (?:is|should be)|ends with)\s*(.*)', t)
            if not last or not m or re.search(r'random|[Rr]un it a few times|graphics', t): skip += 1; continue
            claim = m.group(1); toks = re.findall(r'`([^`]{1,40})`', claim) + re.findall(r'(?<![\w.])(-?\d+\.\d+|-?\d+)(?![\w.])', re.sub(r'`[^`]*`', '', claim))
            toks = [x.strip('"\'') for x in toks if x.strip('"\'') not in ('', 'True', 'False') or x in ('True', 'False')]
            if not toks: skip += 1; continue
            runs = re.split(r'(?:Run it|Run both) (?:three|two|again|twice|3|2) times|(?:again|then) ', t)
            ins = inputs_of(t) or []
            out = run(PRE + last if 'Event(' in last and 'class Event' not in last else last, ins)
            out2 = run(PRE + last if 'Event(' in last and 'class Event' not in last else last, ins) if False else ''
            missing = [x for x in toks if x not in out]
            if missing and not re.search(r'three times|then with|Run it again|again and type|run it again', t):
                bad += 1; print('CLAIM NOT SEEN %s | %s | tokens %s | output %r | inputs %s' % (s, step[:30], missing, out[-90:], ins))
            elif missing: skip += 1
            else: ok += 1
print('Try-it claims confirmed by running the step\'s code: %d | not confirmed: %d | left for a human read: %d' % (ok, bad, skip))
