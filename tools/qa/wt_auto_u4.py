"""Builds a first model answer for a Unit 4 walkthrough from what it tells the student to type (code blocks, 'Type exactly' lines, heading comments), scores it on the
LIVE scorer and prints what is still missing.  The finished, hand-corrected answers live in tools/qa/model/aN.py.
usage: python3 tools/qa/wt_auto_u4.py a16 [--write]"""
import sys, re, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wt_qa as q
CODEY = re.compile(r'^(print\(|[a-z_][a-z_0-9]* *(=|\+=|-=)|if |elif |else:|for |while |def |import |return |break|global )')
def tick_lines(t):
    out = []
    for seg in re.findall(r'`([^`]+)`', t):
        if CODEY.match(seg.strip()) and '\n' not in seg and not seg.strip().endswith('...'): out.append(seg.strip())
    return out
FILL = ' this explains the idea in my own words and it is long enough to count'
def children(t):
    """`for i in range(6):` with `print("Go!")` under it  ->  header plus indented child lines (handles 'and `x` under it', 'then `if p:` with `break` under it')"""
    segs = [(m.group(1).strip(), t[max(0, m.start() - 30):m.start()], t[m.end():m.end() + 40]) for m in re.finditer(r'`([^`]+)`', t)]
    out = []; ind = 0; head_open = False
    for k, (seg, before, after) in enumerate(segs):
        if not CODEY.match(seg) or seg.endswith('...'): continue
        if head_open and re.search(r'with\s*$|and\s*$|,\s*$|^\s*,? ?and', before + ' ') and not re.search(r'then\s*$|finally\s*$', before):
            out.append('    ' * ind + seg)
        elif head_open and re.search(r'under (the )?`?if', before) : out.append('    ' * (ind) + seg)
        else:
            ind = 0; out.append(seg); head_open = False
        if seg.endswith(':'):
            if out and len(out) > 1 and out[-1] != seg and False: pass
            head_open = True; ind = (out[-1].count('    ') if out[-1].startswith('    ') else 0) + 1
            out[-1] = out[-1]
            ind = len(out[-1]) - len(out[-1].lstrip()); ind = ind // 4 + 1
        if re.search(r'\(not indented\)|not indented', after): head_open = False; ind = 0
    return out
def build(rec, over=None):
    lines = []; step = 0; sec = {}; cur = None
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+): (.*)', b['h'])
            if m and 'Stretch' not in b['h']: cur = int(m.group(1)); sec[cur] = ['# Step %s: %s' % (m.group(1), m.group(2))]
            else: cur = None
        elif 'code' in b and cur: sec[cur].append(b['code'])
        for k in ('make', 'build', 'where'):
            for t in b.get(k, []):
                if not cur: continue
                if re.search(r'heading comment', t):
                    for seg in re.findall(r'`(# [^`]+)`', t): sec[cur].append(seg)
                elif re.search(r'pasted? as comment|pasted comment lines|pastes as comment', t):
                    for seg in re.findall(r'`(# [^`]+)`', t): sec[cur].append(seg)
                    sec[cur] += children(t.split('The Python is exactly')[-1]) if 'The Python is exactly' in t else []
                elif re.search(r'Start it with `# ', t):
                    for seg in re.findall(r'[Ss]tart it with `(# [^`]+)`', t): sec[cur].append(seg + FILL)
                elif re.search(r'[Tt]ype exactly|exactly:|Type it\.|under it', t) and not re.search(r'new copy', t):
                    sec[cur] += children(t)
    out = []
    for n in sorted(sec):
        out += sec[n]
        if over and n in over: out.append(over[n](sec[n][1:]) if callable(over[n]) else over[n])
    return '\n'.join(out)
def comment_up(code):
    out = []
    for l in code.split('\n'):
        s = l.strip()
        if s and not s.startswith('#') and '#' not in l and not s.endswith(('(', '[', ',')): l += '  # I think this shows the answer because it follows the rule we practiced'
        out.append(l)
    return '\n'.join(out)
if __name__ == '__main__':
    import wt_u4_overlays as O
    slot = sys.argv[1]; rec = q.record(slot); code = comment_up(build(rec, O.OV.get(slot))); ins = O.INS.get(slot, ['10'] * 6)
    out = q.run_local(code, ins); r = q.score(slot, code, out)
    bx = q.boxes_of(rec)
    print(slot, rec['title'], '| auto model passes %d of %d' % (r['passed'], r['total']))
    for m in r['missing']:
        b = m['box'][0] if isinstance(m['box'], list) else m['box']
        print('   MISSING', b, m['label'], '|', re.sub(r'\[\[.*?\]\]', '', re.sub(r'\s+', ' ', bx[b][1]))[:110] if b is not None and b < len(bx) else '')
    if '--show' in sys.argv: print(code)
    if '--write' in sys.argv:
        open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', slot + '.py'), 'w', encoding='utf-8').write('#!inputs:' + '|'.join(ins) + '\n' + code + '\n'); print('written', slot)
    print('raw missing:', [(m.get('label'), m.get('box')) for m in r['missing']][:3])
