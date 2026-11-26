"""Builds a first model answer for a Unit 4 walkthrough from what it tells the student to type (code blocks, 'Type exactly' lines, heading comments), scores it on the
LIVE scorer and prints what is still missing.  The finished, hand-corrected answers live in tools/qa/model/aN.py.
usage: python3 tools/qa/wt_auto_u4.py a16 [--write]"""
import sys, re, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wt_qa as q
CODEY = re.compile(r'^([A-Za-z_][A-Za-z_0-9]*\(.*\)$|# *[A-Za-z_(]+\(.*\)$|print\(|[a-z_][a-z_0-9]* *(=|\+=|-=)|if |elif |else:|for |while |def |import |return |break|global )')
def tick_lines(t):
    out = []
    for seg in re.findall(r'`([^`]+)`', t):
        if CODEY.match(seg.strip()) and '\n' not in seg and not seg.strip().endswith('...'): out.append(seg.strip())
    return out
FILL = ' this explains the idea in my own words and it is long enough to count'
def children(t):
    """Reads 'type exactly: `A:` with `B` under it, then `C:` ... and finally `D` (not indented)' into indented lines.
    A header's first child is marked by 'with' / 'under it' / 'indented'; 'elif' and 'else' line up with their `if`; 'under the `while`' goes one level inside that header;
    'finally' or '(not indented)' goes back to the left edge; anything else stays at the level of the line before it."""
    base = 1 if re.search(r'(?i)indented under the `?(while|for|def|if)`?|inside the loop|still inside the loop|inside the function|inside the procedure', t) else 0
    m_te = re.search(r'(?i)type exactly', t)
    if m_te and not re.search(r'(?i)inside the loop|indented under the', t[:m_te.start()]): t = t[m_te.start():]   # only what follows 'Type exactly' is typed
    raw = [(m.group(1).strip(), t[max(0, m.start() - 40):m.start()], t[m.end():].split('`', 1)[0], t[m.end():]) for m in re.finditer(r'`([^`]+)`', t)]
    out = []; depth = base; headers = []; prev_hdr = False; prev_depth = base; ended = False; defined = set(); def_depth = None; last_under = False; group_open = False
    for k, (seg, before, after, rest) in enumerate(raw):
        if not CODEY.match(seg) or '...' in seg or re.match(r'\s*(line|lines|statement)\b', after): continue
        kw = re.match(r'[a-z]+', seg).group(0) if re.match(r'[a-z]+', seg) else ''
        m_under = re.match(r'\s*(?:\(indented[^)]*\)\s*)?(?:,? ?and )?under the\s*`?(\w+)`?', after + ' ')
        nxt = raw[k + 1][0] if k + 1 < len(raw) else ''
        under_the = re.match(r'\s*\(?(?:indented\)?\s*)?under the\s*$', after)
        group_cont = group_open; group_open = False
        is_call = re.match(r'[A-Za-z_]\w*\(', seg) and re.match(r'[A-Za-z_]\w*', seg).group(0) in defined
        if group_cont and not re.match(r'\s*\(not indented', after): d = depth
        elif is_call and not seg.startswith('print'): d = def_depth if def_depth is not None else 0
        elif kw == 'return' and def_depth is not None and not prev_hdr and not re.match(r'\s*\(?under', after): d = def_depth + 1
        elif prev_hdr and headers and headers[-1][0] == 'def': d = prev_depth + 1
        elif kw in ('elif', 'else'):
            d = [h for h in headers if h[0] == 'if'][-1][1] if any(h[0] == 'if' for h in headers) else depth
        elif under_the and nxt:
            tgt = re.sub(r'\W', '', nxt); cand = [h for h in headers if h[0] == tgt]
            d = (cand[-1][1] + 1) if cand else depth
        elif prev_hdr and (re.search(r'with\s*$|indented under it,?\s*$|and,? ?$', before) or re.match(r'\s*(?:\(indented[^)]*\)\s*)?under it', after)):
            d = prev_depth + 1
        elif re.search(r'(?i)finally,?\s*$', before) or re.match(r'\s*\(not indented\)', after):
            d = 0
        elif ended and re.search(r'(?i)(and|then)\s*$', before): d = base
        elif def_depth is not None: d = def_depth if (re.search(r'(?i)then\s*$', before) and kw not in ('if', 'for', 'while')) else def_depth + 1
        else: d = depth
        ended = bool(under_the); last_under = bool(re.match(r'\s*\(?(?:indented\)?\s*)?under', after))
        if (prev_hdr or group_cont) and not seg.endswith(':') and re.match(r'\s*,?\s*and\s*$', after) and nxt and not re.match(r'\s*(under|\(not)', rest): group_open = True
        if kw == 'return' and d == 0: d = 1      # a return is always inside a function, even when its box is separate from the def
        if def_depth is not None and d <= def_depth and kw != 'def': def_depth = None
        out.append('    ' * d + seg)
        depth = d
        if kw == 'def': defined.add(re.match(r'def\s+(\w+)', seg).group(1)); def_depth = d
        if seg.endswith(':'): headers.append((kw, d)); prev_hdr = True; prev_depth = d
        else: prev_hdr = False
    return out
def sections(rec, over=None):
    sec = {}; cur = None
    # a step whose box says 'type these lines with a # at the start of each line' (a broken loop that must not run) is typed commented out
    hashed = set(); c = None
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+)', b['h']); c = int(m.group(1)) if m else None
        for t in b.get('make', []):
            if c and re.search(r'with a `#` at the start of \*\*each\*\* line', t): hashed.add(c)
    for b in rec['blocks']:
        if 'h' in b:
            m = re.match(r'Step (\d+): (.*)', b['h'])
            if m and 'Stretch' not in b['h']: cur = int(m.group(1)); sec[cur] = ['# Step %s: %s' % (m.group(1), m.group(2))]
            else: cur = None
        elif 'code' in b and cur and not re.search(r'←|PROCEDURE|REPEAT|DISPLAY\(|IF \(', b['code']): sec[cur].append('\n'.join('# ' + l for l in b['code'].split('\n')) if (cur in hashed and not any(x.startswith('# ') and 'count' in x for x in sec[cur][1:])) else b['code'])   # exam pseudocode is only read, never typed
        for k in ('make', 'build', 'where'):
            for t in b.get(k, []):
                if not cur: continue
                if re.search(r'heading comment', t):
                    for seg in re.findall(r'`(# [^`]+)`', t): sec[cur].append(seg)
                elif re.search(r'pasted? as comment|pasted comment lines|pastes as comment', t):
                    for seg in re.findall(r'`(# [^`]+)`', t): sec[cur].append(seg)
                    sec[cur] += children(t.split('The Python is exactly')[-1]) if 'The Python is exactly' in t else (children(t) if re.search(r'(?i)type exactly', t) else [])
                elif re.search(r'Start it with `# ', t):
                    for seg in re.findall(r'[Ss]tart it with `(# [^`]+)`', t): sec[cur].append(seg + FILL)
                elif re.search(r'[Tt]ype exactly|exactly:|Type it\.|under it', t) and not re.search(r'new copy', t):
                    sec[cur] += children(t)
    for n in list(sec):
        if over and n in over: sec[n].append(over[n](sec[n][1:]) if callable(over[n]) else over[n])
    return sec
def drop_empty_headers(lines):
    out = []
    for i, l in enumerate(lines):
        c = l.split('  #')[0].rstrip()
        if c.endswith(':') and not c.lstrip().startswith('#'):
            j = i + 1
            while j < len(lines) and (not lines[j].strip() or lines[j].lstrip().startswith('#')): j += 1
            if j >= len(lines) or len(lines[j]) - len(lines[j].lstrip(' ')) <= len(l) - len(l.lstrip(' ')): continue
        out.append(l)
    return out
def build(rec, over=None):
    sec = sections(rec, over); out = []
    for n in sorted(sec): out += sec[n]
    return '\n'.join(drop_empty_headers('\n'.join(out).split('\n')))
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
