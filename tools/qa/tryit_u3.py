"""Try-it claims of the Unit 3 walkthroughs (a1-a13). The model answer is run in one go and its output is cut into steps by a marker line printed at each '# Step N' heading.
A claim of the form 'prints X / should print X / output is X' is confirmed when X is in that step's real output. A claim that names typed values ('Type 16', 'with 18 and 24') is run
on the step's own code with those values. Everything that cannot be confirmed automatically is printed with the step's code and output so a person can read it.
usage: QA_CACHE=/private/tmp/claude-501/assign_u34.json python3 tools/qa/tryit_u3.py [a1 ...]"""
import sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
slots = sys.argv[1:] or ['a%d' % i for i in range(1, 14)]
def split_steps(src):
    parts = {}; cur = 0; buf = []
    for l in src.split('\n'):
        m = re.match(r'^#\s*Step (\d+)', l)
        if m: parts[cur] = '\n'.join(buf); cur = int(m.group(1)); buf = []
        buf.append(l)
    parts[cur] = '\n'.join(buf); return parts
def typed_vals(t):
    m = re.search(r'(?:[Tt]ype|[Ee]nter|with|typing|using)\s+\**`?(-?[\w.@]+(?:\s*,\s*(?:and\s+|then\s+)?\**`?-?[\w.@]+|\s+(?:and|then)\s+\**`?-?[\w.@]+)*)`?\**', t)
    if not m: return []
    return [x.strip('`*') for x in re.split(r'\s*,\s*(?:and\s+|then\s+)?|\s+(?:and|then)\s+', m.group(1)) if x.strip('`*')]
ok = 0; manual = []
for s in slots:
    rec = q.record(s); src, ins = q.model(s)
    marked = re.sub(r'^(#\s*Step (\d+).*)$', lambda m: 'print("@@STEP%s")\n%s' % (m.group(2), m.group(1)), src, flags=re.M)
    out = q.run_local(marked, ins); outs = {}
    for k, piece in zip(re.findall(r'@@STEP(\d+)', out), re.split(r'@@STEP\d+\n?', out)[1:]): outs[int(k)] = piece
    steps = split_steps(src); n = None
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+)', b['h']); n = int(m.group(1)) if m else None; continue
        t = b.get('p', '')
        if not t.startswith('▶'): continue
        plain = re.sub(r'\*\*|`', '', t)
        claims = re.findall(r'(?:prints?|should (?:print|show|see|say|be)|shows?|displays?|output (?:is|should be)|answer (?:is|should be)|result (?:is|should be)|ends with|gives)\s+([^.]+?)(?:\.|$)', plain)
        stepout = outs.get(n, ''); res = None
        if claims and n is not None:
            vals = []
            for c in claims:
                vals += [x.strip(' "\'') for x in re.split(r',\s*(?:then|and)?\s*|\s+then\s+|\s+and\s+', c) if x.strip(' "\'')]
            hit = [v for v in vals if v and v in stepout]
            if vals and len(hit) == len(vals): res = 'ok'
        if res == 'ok': ok += 1
        else: manual.append((s, n, plain, typed_vals(plain), steps.get(n, ''), stepout))
print('confirmed by the step\'s real output:', ok, '| to read by a person:', len(manual))
for s, n, plain, tv, code, out in manual:
    print('\n== %s step %s: %s' % (s, n, plain[:200])); 
    if tv and code:
        feed = list(tv)
        try:
            r = q.run_local(re.sub(r'^#.*$', '', code, flags=re.M).strip(), feed)
            print('   run alone with typed %s ->' % tv, repr(r[-160:]))
        except Exception as e: print('   (could not run alone)', e)
    print('   step output in the full model run:', repr(out[-160:]))
