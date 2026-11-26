"""NEGATIVE tests for the Unit 3 walkthrough scorers (live server): wrong code must not earn full credit.
 1. empty / nonsense programs score about 0
 2. the model answer with every line of CODE removed (comments kept) cannot pass
 3. another lesson's model answer cannot pass
 4. delete each line of the model answer one at a time: if the score stays 100 the line is not checked at all (listed for review)
 5. corrupt each code line (change a number or a name) one at a time: if the score stays 100 the check is too loose (listed for review)
usage: python3 tools/qa/wt_negative.py [a1 a2 ...]"""
import sys, re, os, json, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
slots = sys.argv[1:] or ['a%d' % i for i in range(1, 14)]
def sc(slot, code, ins):
    return q.score(slot, code, q.run_local(code, ins))
def pct(slot, code, ins):
    try: return sc(slot, code, ins)['pct']
    except Exception: return None
loose = []; unused = []; fails = 0
for s in slots:
    src, ins = q.model(s); lines = src.split('\n')
    base = sc(s, src, ins); assert base['pct'] == 100, (s, base['pct'])
    res = {}
    res['empty'] = pct(s, '', ins); res['print hello'] = pct(s, 'print("hello world")', ins)
    codeless = '\n'.join(l for l in lines if l.strip().startswith('#') and not re.match(r'^\s*#\s*[a-z_0-9]+\s*(=|\()', l.strip()))
    res['comments only'] = pct(s, codeless, ins)
    other = 'a%d' % (int(s[1:]) % 13 + 1); osrc, oins = q.model(other); res['another lesson'] = pct(s, osrc, oins)
    bad = [k for k, v in res.items() if v is None or v >= 100 or (k in ('empty', 'print hello') and v > 5)]
    # limit for "comments only" / "another lesson": must stay clearly below passing (90) -- step comments alone are worth a share on purpose
    bad += [k for k in ('comments only', 'another lesson') if res[k] is not None and res[k] >= 70]
    if bad: fails += 1
    # one line at a time (in parallel)
    codeIdx = [i for i, l in enumerate(lines) if l.strip() and not l.strip().startswith('#') or (l.strip().startswith('#') and re.match(r'^\s*#\s*[A-Za-z_0-9]+\s*(=|\()', l.strip()))]
    def del_one(i): return i, pct(s, '\n'.join(lines[:i] + lines[i + 1:]), ins)
    def mut_one(i):
        l = lines[i]; m = re.search(r'\d+(\.\d+)?', l.split('#')[0]) 
        if m: new = l[:m.start()] + str(float(m.group()) + 1 if '.' in m.group() else int(m.group()) + 1) + l[m.end():]
        else:
            m = re.search(r'\b([a-z][a-z_]+)\b', l.split('#')[0].replace('print', '').replace('input', '').replace('int', '').replace('float', '').replace('str', '').replace('len', ''))
            if not m: return i, None
            new = l.replace(m.group(1), m.group(1) + 'x', 1)
        return i, pct(s, '\n'.join(lines[:i] + [new] + lines[i + 1:]), ins)
    with cf.ThreadPoolExecutor(8) as ex:
        dels = list(ex.map(del_one, [i for i in codeIdx if not lines[i].strip().startswith('# Step')]))
        muts = list(ex.map(mut_one, [i for i in codeIdx if not lines[i].strip().startswith('#')]))
    unused_here = [lines[i].strip()[:60] for i, p in dels if p == 100]
    loose_here = [lines[i].strip()[:60] for i, p in muts if p == 100]
    print('%s | empty %s%%, print-hello %s%%, comments-only %s%%, another-lesson %s%% %s | lines never checked: %d | corrupt-a-line still 100%%: %d' % (s, res['empty'], res['print hello'], res['comments only'], res['another lesson'], ('<-- PROBLEM ' + ','.join(bad)) if bad else 'ok', len(unused_here), len(loose_here)))
    for u in unused_here: unused.append((s, u))
    for u in loose_here: loose.append((s, u))
print('\nLINES THAT ARE NOT CHECKED AT ALL (deleting them keeps 100%):')
for u in unused: print('  ', u)
print('\nCODE LINES WHOSE CORRUPTED VERSION STILL SCORES 100%:')
for u in loose: print('  ', u)
print('\nbasic negative problems:', fails, '| unchecked lines:', len(unused), '| loose checks:', len(loose))
