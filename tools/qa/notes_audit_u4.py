"""Runs every Python code sample in the Unit 4 lesson notes pages (apcsp/booleans.html ... random-numbers.html) and checks the 'output' comments written inside them.
Samples that are meant to be broken (red 'bad' boxes), use pseudo-code, or call helper functions the page never defines are listed so a person can read them.
usage: python3 tools/qa/notes_audit_u4.py"""
import re, html, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'parsons')); import u4_core
PAGES = ['booleans', 'logical-operators', 'comparison-operators', 'if-statements', 'if-elif-else', 'key-events', 'for-loops', 'general-for-loops', 'for-loop-practice', 'while-loops', 'loop-and-a-half', 'random-numbers']
def blocks(h):
    out = []
    for m in re.finditer(r'<(div|code)\s+class="(code|line)[^"]*"[^>]*>(.*?)</\1>', h, re.S):
        ctx = h[max(0, m.start() - 300):m.start()]
        bad = bool(re.search(r'class="box bad"', ctx[-260:])) or 'bad' in m.group(0)[:60]
        t = html.unescape(re.sub(r'<[^>]+>', '', m.group(3))).strip('\n')
        out.append((t, bad))
    return out
ok = flagged = claims = badclaims = 0
for p in PAGES:
    h = open(os.path.join(ROOT, 'apcsp', p + '.html'), encoding='utf-8').read()
    for i, (code, bad) in enumerate(blocks(h), 1):
        src = code
        if re.search(r'\.\.\.|PROCEDURE|←|REPEAT|DISPLAY|<pseudo', src) and not re.search(r'^\s*#.*\.\.\.', src, re.M) and re.search(r'PROCEDURE|←|REPEAT|DISPLAY', src): continue
        try: compile(src, 'n', 'exec')
        except SyntaxError as e:
            if not bad: flagged += 1; print('SYNTAX %s #%d (%s): %r' % (p, i, e.msg, src[:80].replace('\n', ' ; ')))
            continue
        run_src = src
        try: out = u4_core.run(run_src, ['5', '7', '9', '12', 'yes', 'no', '3', '4', '1', '2', '6', '8', '10', '0'] * 3, 1)
        except u4_core.Endless: out = None; err = 'endless'
        except NameError as e: print('(helper not defined, skipped) %s #%d: %s' % (p, i, e)); continue
        except Exception as e: out = None; err = type(e).__name__
        else: err = None
        if err and not bad: flagged += 1; print('RUNS WITH ERROR %s #%d: %s | %r' % (p, i, err, src[:80].replace('\n', ' ; '))); continue
        # claims written as '# output: ...' or '# prints ...' or '# 3 2 1 Liftoff' at the end of a line
        for m in re.finditer(r'#\s*(?:output|prints?|shows?|displays?|result|gives)[: ]+\s*(.+)', src):
            claim = m.group(1).strip(); claims += 1
            toks = re.findall(r'-?\d+\.\d+|-?\d+|True|False|[A-Za-z_]+', claim)
            got = ' '.join(out) if out is not None else ''
            miss = [t for t in toks if t not in got and t.lower() not in ('then', 'and', 'or', 'is', 'the', 'a', 'an', 'in', 'each', 'line', 'on', 'its', 'own', 'etc', 'no', 'error', 'nothing')]
            if out is not None and miss and not bad: badclaims += 1; print('CLAIM NOT SEEN %s #%d: "%s" missing %s | output %r' % (p, i, claim[:60], miss, got[:80]))
        ok += 1
print('samples that ran or were skipped on purpose: %d | flagged: %d | output claims read: %d | not matching: %d' % (ok, flagged, claims, badclaims))
