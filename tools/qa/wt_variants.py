"""POSITIVE variant tests for the walkthrough scorers (live server). The model answer scores 100. The same program typed another valid way must still score 100:
   quotes   - every simple "string" typed with single quotes instead
   tight    - no spaces around operators or after commas (x=5, print(a+b))
   blank    - a blank line between every pair of lines
   tabs     - indents made with the Tab key instead of four spaces
   indent2  - indents of two spaces
   all      - quotes + tight + tabs together
The program is run again locally for each variant (same typed inputs) and its real output is sent to the scorer, like the editor does.
A variant that runs to the SAME output but scores below 100 means a check is too strict about formatting (listed).
usage: python3 tools/qa/wt_variants.py [a1 a2 ...]    (QA_CACHE optional)"""
import sys, os, re, io, tokenize, keyword, json, concurrent.futures as cf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import wt_qa as q
REAL = sys.stdout
KW = set(keyword.kwlist)
def toks(src):
    return list(tokenize.generate_tokens(io.StringIO(src).readline))
def has_multiline(src):
    try:
        return any(t.type in (tokenize.STRING, tokenize.OP) and t.start[0] != t.end[0] for t in toks(src)) or any(l.rstrip().endswith('\\') for l in src.split('\n'))
    except Exception: return True
def quotes(src):
    out = list(src.split('\n')); T = toks(src); edits = []
    for t in T:
        if t.type != tokenize.STRING: continue
        s = t.string; m = re.match(r'^([fFrRbB]*)"([^"\'\\]*)"$', s)
        if m and not (('f' in m.group(1).lower()) and ("'" in m.group(2))):
            edits.append((t.start[0] - 1, t.start[1], t.end[1], m.group(1) + "'" + m.group(2) + "'"))
    for ln, a, b, new in sorted(edits, key=lambda e: (e[0], -e[1])): out[ln] = out[ln][:a] + new + out[ln][b:]
    return '\n'.join(out)
def tight(src):
    lines = src.split('\n'); T = [t for t in toks(src)]; byline = {}
    for t in T:
        if t.type in (tokenize.NEWLINE, tokenize.NL, tokenize.INDENT, tokenize.DEDENT, tokenize.ENDMARKER): continue
        byline.setdefault(t.start[0], []).append(t)
    out = []
    for i, l in enumerate(lines, 1):
        ts = byline.get(i)
        if not ts: out.append(l); continue
        indent = re.match(r'^\s*', l).group(); s = ''; prev = None
        for t in ts:
            txt = t.string
            if prev is None: s = txt
            elif t.type == tokenize.COMMENT: s += '  ' + txt
            else:
                need = False
                pw = prev.type in (tokenize.NAME, tokenize.NUMBER, tokenize.STRING) ; cw = t.type in (tokenize.NAME, tokenize.NUMBER, tokenize.STRING)
                if pw and cw: need = True
                if (prev.type == tokenize.NAME and prev.string in KW and prev.string not in ('True', 'False', 'None')) or (t.type == tokenize.NAME and t.string in KW and t.string not in ('True', 'False', 'None')): need = True
                if prev.string == ',' : need = False
                s += (' ' if need else '') + txt
            prev = t
        out.append(indent + s)
    return '\n'.join(out)
def blank(src): return '\n\n'.join(src.split('\n'))
def reindent(src, unit):
    out = []
    for l in src.split('\n'):
        m = re.match(r'^( *)', l); n = len(m.group(1)) // 4
        out.append(unit * n + l[len(m.group(1)):])
    return '\n'.join(out)
VARIANTS = [('quotes', quotes), ('tight', tight), ('blank', blank), ('tabs', lambda s: reindent(s, '\t')), ('indent2', lambda s: reindent(s, '  ')), ('all', lambda s: reindent(tight(quotes(s)), '\t'))]
def variants(src):
    if has_multiline(src): return []
    res = []
    for name, f in VARIANTS:
        try:
            v = f(src); compile(v, 'v', 'exec'); res.append((name, v))
        except SyntaxError as e: res.append((name + ' (BROKEN VARIANT: %s)' % e, None))
    return res
if __name__ == '__main__':
    slots = sys.argv[1:] or ['a%d' % i for i in range(1, 14)] + ['a%d' % i for i in (16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28)]
    bad = 0; total = 0
    for s in slots:
        src, ins = q.model(s)
        if src is None: print(s, 'no model'); continue
        base_out = q.run_local(src, ins); base = q.score(s, src, base_out)
        row = ['base %d' % base['pct']]
        if base['pct'] != 100: print(s, 'BASE NOT 100', base['pct']); bad += 1; continue
        vs = variants(src)
        if not vs: row.append('(program has multi-line pieces: skipped)')
        def one(nv):
            name, v = nv
            if v is None: return name, None, None, None
            o = q.run_local(v, ins); r = q.score(s, v, o)
            return name, r['pct'], o == base_out, [m['label'] for m in r['missing']][:3]
        with cf.ThreadPoolExecutor(4) as ex: res = list(ex.map(one, vs))
        sys.stdout = REAL
        for name, pct, same, miss in res:
            total += 1
            if pct is None: row.append(name); continue
            row.append('%s %d%s' % (name, pct, '' if same else ' (output differs!)'))
            if pct < 100 or not same: bad += 1; row[-1] += '  MISSING: ' + '; '.join(miss)
        print(s, ' | '.join(row)); sys.stdout.flush()
    print('\nvariants run: %d   problems: %d' % (total, bad))
