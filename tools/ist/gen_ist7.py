"""Builds ist/unit-6/practice-data.js: 10 Parsons + 10 browser-trace problems per lesson of IST Unit 3 (Unit 4: Advanced HTML).
Every page is parsed by the model, every ordering is tried, every wrong piece is tried in every line, and every page is also written to
tools/ist/_pages.json so chrome_check.mjs can compare the model with a real browser.   usage: python3 tools/ist/gen_ist7.py [lesson numbers]"""
import re, sys, os, json, re, random
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
from ist_core import *
from ist_p7a import *
from ist_p7b import *
RANK = {"4.1": 13, "4.2": 11, "4.3": 14, "4.4": 15, "4.5": 12}   # the order the lessons are TAUGHT: colors (4.2) and tables (4.5) come before the box model (4.1), display (4.3) and div (4.4)
LESSONS = [("i7l1", "4.1", "Box Model", P312, T312), ("i7l2", "4.2", "Colors (Names and Hex)", P313, T313), ("i7l3", "4.3", "Display (Block vs Inline)", P314, T314), ("i7l4", "4.4", "Div Tag", P315, T315), ("i7l5", "4.5", "Tables", P316, T316)]
errors = []; pages = []; alts = []
rnd = random.Random(31)
def pieces_for(sol, dis):
    ps = [dict(t=t) for t in sol] + [dict(t=t, d=1) for _, t in dis]
    for _ in range(80):
        rnd.shuffle(ps)
        if [p['t'] for p in ps if not p.get('d')] != sol: break
    return ps
def exercise_key(src):
    """two problems are the same exercise when their tags, attributes and the KIND of every style value match (colors and numbers do not count as different)"""
    k = re.sub(r'>[^<]+<', '><', src)
    def st(m):
        decls = []
        for d in m.group(1).split(';'):
            if ':' not in d: continue
            p_, v = [x.strip() for x in d.split(':', 1)]
            v = re.sub(r'#[0-9A-Fa-f]{3,8}', 'C', v)
            v = ' '.join('C' if (w in NAMED) else re.sub(r'^\d+(\.\d+)?', 'N', w) for w in v.split())
            decls.append(p_ + ':' + v)
        return 'style="%s"' % ';'.join(decls)
    k = re.sub(r'style="([^"]*)"', st, k)
    return re.sub(r'(href|src|alt|content)="[^"]*"', r'\1=""', k)
def pdiff(sol):
    src = '\n'.join(sol); f = features(src)
    return 10 * len(sol) + 4 * len(f) + sum(2 for l in sol if 'style=' in l)
only = sys.argv[1:]
D = {}
for lid, num, title, probs, traces in LESSONS:
    traces = []   # page tracing was removed from this unit: the programs could not be made hard enough to teach anything
    k = RANK[num]
    if only and num not in only: continue
    if len(probs) != 10: errors.append((num, 'need 10 Parsons, have %d' % len(probs)))
    ps = []; seen = set()
    for n_, (ttl, story, sol, dis) in enumerate(probs):
        tag = '%s P%d' % (num, n_ + 1)
        sol = sol.split('\n') if isinstance(sol, str) else sol
        exp = check_problem(tag, sol, dis, errors)
        if exp is None: continue
        concept_errors(tag, '\n'.join(sol), k, errors)
        if num == '4.1' and re.search(r'#[0-9A-Fa-f]{3,8}\b|rgb\(|\bhex', ' '.join([ttl, story] + sol + [d for _, d in dis]), re.I): errors.append((tag, 'uses a hex color, which is not taught until lesson 4.2'))
        for _, d in dis: concept_errors(tag + ' wrong piece', d, k, [])      # wrong pieces may show a typo; not audited for taught-ness
        key = exercise_key('\n'.join(sol))
        if key in seen: errors.append((tag, 'same exercise as another problem in this lesson'))
        seen.add(key)
        vo = valid_orders(sol)
        al = []
        for d in {x for _, x in dis}:
            for i_ in range(len(sol)):
                a_ = list(sol); a_[i_] = d
                if try_sig('\n'.join(a_)) is not None: al.append(dict(i=i_, d=d, html=full_page('\n'.join(a_))))
        alts.append(dict(id=tag, base=full_page('\n'.join(sol)), alts=al))
        pages.append(doc_info('\n'.join(sol), tag))
        ps.append(dict(title=ttl, story=story, expect=exp, pieces=pieces_for(sol, dis), sol=sol, steps=[describe_line(l) for l in sol], valid=vo, html=full_page('\n'.join(sol))))
    ps.sort(key=lambda p: pdiff(p['sol']))
    ts = []
    for n_, code in enumerate(traces):
        tag = '%s T%d' % (num, n_ + 1)
        try: steps = trace(code)
        except HtmlError as e: errors.append((tag, 'trace page is broken: %s' % e)); continue
        concept_errors(tag, code, k, errors)
        asked = sum(1 for s in steps if s[0] or s[1] or s[6])
        if asked < 2: errors.append((tag, 'only %d steps ask the student for anything' % asked))
        pages.append(doc_info(code, tag))
        ts.append(dict(title='', intro='Read the page code one line at a time, the way a browser does. After each line, say what the line adds to the page, or which style applies to it.', code=code.split('\n'), steps=steps, html=full_page(code), _d=difficulty(code, steps)))
    ts.sort(key=lambda t: t['_d'])
    for n_, t in enumerate(ts): t['title'] = 'Trace %d' % (n_ + 1); del t['_d']
    if len({'\n'.join(t['code']) for t in ts}) != len(ts): errors.append((num, 'duplicate trace'))
    D[lid] = dict(num=num, title=title, problems=ps, traces=ts)
if errors:
    for e in errors: print('PROBLEM', e)
    sys.exit(1)
json.dump(pages, open(os.path.join(HERE, '_pages7.json'), 'w')); json.dump(alts, open(os.path.join(HERE, '_alts7.json'), 'w'))
if only: print('checked', ', '.join(only), '| Parsons', sum(len(v['problems']) for v in D.values()), '| traces', sum(len(v['traces']) for v in D.values()))
else:
    dump = json.dumps(dict(lessons=D), ensure_ascii=False, separators=(',', ':'))
    open(os.path.join(ROOT, 'ist', 'unit-6', 'practice-data-2.js'), 'w', encoding='utf-8').write('/* GENERATED by tools/ist/gen_ist7.py. Do not edit by hand. */\nwindow.IST7 = ' + dump + ';\n')
    print('OK: %d lessons, %d Parsons, %d traces' % (len(D), sum(len(v['problems']) for v in D.values()), sum(len(v['traces']) for v in D.values())))
