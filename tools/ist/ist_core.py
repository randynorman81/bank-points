"""Builds Parsons and browser-trace problems for IST Unit 3 (HTML). Every page is parsed by html_model (checked against a real browser)."""
import re, itertools, json
from html_model import *
from html_model import _is_block

# ------------------------------------------------------------------ plain-English descriptions of one HTML line
TAGWORDS = {'html': 'the page itself', 'head': 'the hidden information area', 'body': 'everything the visitor sees', 'h1': 'a level 1 heading (the biggest title)', 'h2': 'a level 2 heading', 'h3': 'a level 3 heading',
            'h4': 'a level 4 heading', 'h5': 'a level 5 heading', 'h6': 'a level 6 heading', 'p': 'a paragraph', 'strong': 'bold text', 'b': 'bold text', 'em': 'italic text', 'i': 'italic text', 'span': 'a span (part of a line)',
            'a': 'a link', 'ul': 'a bulleted list', 'ol': 'a numbered list', 'li': 'a list item', 'img': 'a picture', 'br': 'a line break', 'hr': 'a horizontal line', 'title': 'the page title (shown on the browser tab)', 'link': 'a link tag',
            'div': 'a div (an invisible box that groups other tags)', 'table': 'a table (a grid of rows and cells)', 'tr': 'a table row (one line of the grid)', 'th': 'a header cell (a bold title cell)', 'td': 'a data cell (a normal cell)'}
PROPWORDS = {'color': 'the text color', 'background-color': 'the background color', 'font-size': 'the text size', 'text-align': 'the text alignment', 'text-transform': 'the letter case', 'font-family': 'the font',
             'width': 'the width', 'display': 'how it is displayed', 'list-style-type': 'the list marker', 'border': 'a border on all four sides', 'border-top': 'a border on the top', 'border-bottom': 'a border on the bottom',
             'border-left': 'a border on the left', 'border-right': 'a border on the right', 'font-weight': 'the boldness', 'font-style': 'the font style', 'text-decoration': 'the text decoration', 'height': 'the height', 'vertical-align': 'the vertical alignment', 'padding': 'the padding', 'margin': 'the margin',
             'padding-top': 'the top padding', 'padding-bottom': 'the bottom padding', 'padding-left': 'the left padding', 'padding-right': 'the right padding', 'margin-top': 'the top margin', 'margin-bottom': 'the bottom margin', 'margin-left': 'the left margin', 'margin-right': 'the right margin'}
DISPLAYWORDS = {'inline': 'the display style inline (it sits in the line like a word)', 'inline-block': 'the display style inline-block (it sits in the line like a word but keeps its width)', 'block': 'the display style block (it takes its own line)'}
def style_phrase(p, v):
    """a short phrase for one style: 'the text color navy', 'a padding of 12px (space inside the border)' ..."""
    if p == 'display' and v in DISPLAYWORDS: return DISPLAYWORDS[v]
    if p in ('padding', 'margin'): return 'a %s of %s (space %s the border)' % (p, v, 'inside' if p == 'padding' else 'outside')
    m = re.match(r'^(padding|margin)-(top|bottom|left|right)$', p)
    if m: return 'a %s %s of %s' % (m.group(2), m.group(1), v)
    return '%s %s' % (PROPWORDS.get(p, p), v)
def container_phrase(p, v):
    """the same, as a sentence about a box that has just been opened"""
    if p == 'display' and v in DISPLAYWORDS: return ' Its ' + DISPLAYWORDS[v].replace('the display style', 'display style') + '.'
    if p.startswith('border') or p in ('padding', 'margin') or re.match(r'^(padding|margin)-', p): return ' It has ' + re.sub(r'(a border on (?:all four sides|the \w+)) ', r'\1: ', style_phrase(p, v)) + '.'
    return ' Its %s is %s.' % (PROPWORDS.get(p, p).replace('the ', '', 1), v)
def describe_line(line):
    out = _describe_line(line)
    return re.sub(r'([.!?])"\.$', r'\1"', out)   # a quoted sentence that already ends in . ! or ? needs no second period
def _describe_line(line):
    s = line.strip()
    if s.upper().startswith('<!DOCTYPE'): return 'Tell the browser this page uses modern HTML (the DOCTYPE).'
    if s.startswith('<!--'): return 'A comment: a note for people that the browser ignores.'
    try: root = parse(s, partial=True)
    except HtmlError:
        m = re.fullmatch(r'</(\w+)>', s)
        if m: return 'Close the %s.' % ('%s tag' % m.group(1)) if m.group(1) in ('html', 'head', 'body') else 'Close the <%s> tag (the stop sign for that element).' % m.group(1)
        return s
    els = [n for n in walk(root) if n.tag not in ('#root', '#text', '#comment')]
    texts = [n for n in walk(root) if n.tag == '#text']
    if not els:
        m = re.fullmatch(r'</(\w+)>', s)
        if m: return 'Close the <%s> tag (the stop sign for that element).' % m.group(1)
        return s
    top = els[0]; parts = []
    word = TAGWORDS.get(top.tag, top.tag)
    # a whole element on one line
    full = len(els) >= 1 and re.search(r'</%s>\s*$' % top.tag, s) or top.tag in VOID
    if top.tag in ('html', 'head', 'body', 'ul', 'ol', 'div', 'table', 'tr') and not re.search(r'</%s>\s*$' % top.tag, s):
        d = 'Open %s: %s' % ('<%s>' % top.tag, {'html': 'the outer box that holds the whole page.', 'head': 'it holds information about the page that is not shown on the page.', 'body': 'everything the visitor can see goes inside it.', 'ul': 'a bulleted list; only <li> items go inside it.', 'ol': 'a numbered list; only <li> items go inside it.', 'div': 'an invisible box that groups the tags inside it.', 'table': 'a grid of rows and cells; only <tr> rows go inside it.', 'tr': 'one row of the grid; only cells (<th> or <td>) go inside it.'}[top.tag])
        sty = authored(top)
        for p, v in sty.items(): d += container_phrase(p, v)
        return d
    if top.tag == 'link':
        a = top.attrs
        if a.get('rel', '') == 'icon': return 'Link the page favicon (the tiny picture on the browser tab).'
        if 'fonts.googleapis' in a.get('href', '') or a.get('rel') == 'stylesheet': return 'Load a Google font so the page can use it.'
        return 'Add a link tag in the head.'
    if top.tag == 'img':
        d = 'Show a picture (%s)' % ('alt text "%s"' % top.attrs['alt'] if 'alt' in top.attrs else 'no alt text')
        sty = authored(top)
        if 'width' in sty: d += ' that is %s wide' % sty['width']
        return d + '.'
    txt = ' '.join(' '.join(t.text.split()) for t in texts if t.text.strip())
    if top.tag == 'a':
        d = 'Make a link to %s' % top.attrs.get('href', '?')
        if top.attrs.get('target') == '_blank': d += ' that opens in a new tab'
        inner = [n for n in els[1:] if n.tag == 'img']
        if inner: d += ', with a picture inside it as the clickable part'
        elif txt: d += ('; ' if top.attrs.get('target') == '_blank' else ', ') + 'the clickable words are "%s"' % txt
        if authored(top): d += ' (the link is styled with ' + ' and '.join(style_phrase(p, v) for p, v in authored(top).items()) + ')'
        return d + '.'
    d = 'Write %s' % word
    if txt and top.tag not in ('br', 'hr'): d += ' that says "%s"' % txt
    sty = authored(top)
    if sty:
        d += ', styled with ' + ' and '.join(style_phrase(p, v) for p, v in sty.items())
    inner = [n for n in els[1:] if n.tag in ('strong', 'b', 'em', 'i', 'span', 'a', 'br')]
    if inner: d += ' (with %s inside it)' % ' and '.join(sorted({TAGWORDS.get(n.tag, n.tag) for n in inner}))
    if top.tag in ('br', 'hr'): d = 'Add %s (it stands alone, so it has no closing tag)' % word
    return d + '.'

# ------------------------------------------------------------------ Parsons
def events(src):
    """the page as a stream of normalized events: ('open', tag, attrs, declarations), ('text', words), ('close', tag). Adjacent text merges."""
    ev = []; i = 0; n = len(src)
    while i < n:
        if src[i] == '<':
            if src.startswith('<!--', i):
                e = src.find('-->', i); i = e + 3 if e >= 0 else n; ev.append(('comment',)); continue
            if src[i:i + 9].upper() == '<!DOCTYPE':
                m = re.match(r'<!DOCTYPE\s+html\s*>', src[i:], re.I)
                if not m: return None
                ev.append(('doctype',)); i += m.end(); continue
            m = TAG.match(src, i)
            if not m: return None
            closing, name, attrs, selfc = m.group(1), m.group(2).lower(), m.group(3), m.group(4); i = m.end()
            if closing:
                if attrs.strip(): return None
                ev.append(('close', name)); continue
            d = {}
            for am in ATTR.finditer(attrs): d[am.group(1).lower()] = am.group(2) if am.group(2) is not None else (am.group(3) or '')
            st = tuple(sorted(parse_style(d.get('style', ''))[0])) if 'style' in d else ()
            ev.append(('open', name, tuple(sorted((k, v) for k, v in d.items() if k != 'style')), st))
        else:
            j = src.find('<', i); j = n if j < 0 else j
            t = ' '.join(src[i:j].split())
            if t:
                if ev and ev[-1][0] == 'text': ev[-1] = ('text', ev[-1][1] + ' ' + t)
                else: ev.append(('text', t))
            i = j
    return ev
B36 = '0123456789abcdefghijklmnopqrstuvwxyz'
def valid_orders(sol):
    """every order of the lines that gives the SAME page. Searched against the solution's event stream, then each hit is re-checked by parsing."""
    sigs = try_sig('\n'.join(sol)); target = events('\n'.join(sol)); ids = {}
    seq = [ids.setdefault(t, len(ids)) for t in sol]; text = {k: t for t, k in ids.items()}; need = [seq.count(k) for k in range(len(ids))]
    evl = {k: events(text[k]) for k in text}; out = []
    def merge(a, b):
        if a and b and a[-1][0] == 'text' and b[0][0] == 'text': return a[:-1] + [('text', a[-1][1] + ' ' + b[0][1])] + b[1:]
        return a + b
    def okprefix(ev):
        if len(ev) > len(target): return False
        for k, x in enumerate(ev):
            y = target[k]
            if x != y and not (k == len(ev) - 1 and x[0] == 'text' and y[0] == 'text' and y[1].startswith(x[1])): return False
        return True
    def rec(prefix, ev, left):
        if not any(left):
            if ev == target and try_sig('\n'.join(text[k] for k in prefix)) == sigs: out.append(''.join(B36[k] for k in prefix))
            return
        for k in range(len(left)):
            if left[k] and evl[k] is not None:
                e2 = merge(ev, evl[k])
                if okprefix(e2):
                    left[k] -= 1; rec(prefix + [k], e2, left); left[k] += 1
    rec([], [], need[:])
    assert ''.join(B36[k] for k in seq) in out, 'the written solution is not a valid order'
    return out
def check_problem(tag, sol, dis, errors):
    src = '\n'.join(sol); sg = try_sig(src)
    if sg is None:
        try: parse(src)
        except HtmlError as e: errors.append((tag, 'solution is broken: %s' % e))
        return None
    if not _lines(src) and '<img' not in src and '<hr' not in src: errors.append((tag, 'shows nothing'))
    for idx, d in dis:
        if d in sol: errors.append((tag, 'distractor is a solution line: ' + d))
        alt = list(sol); alt[idx] = d
        if try_sig('\n'.join(alt)) == sg: errors.append((tag, 'distractor %r is a working replacement for line %d' % (d, idx + 1)))
    for d in {x for _, x in dis}:
        for i in range(len(sol)):
            alt = list(sol); alt[i] = d
            if try_sig('\n'.join(alt)) == sg: errors.append((tag, 'distractor %r is a working replacement for line %d' % (d, i + 1)))
    return _lines(src)
def _lines(src):
    try: return page_lines_noimg(parse(src))
    except HtmlError: return None
def depth_ok(lines): return True

# ------------------------------------------------------------------ browser trace
ASK_ORDER = ('color', 'background-color', 'font-size', 'text-align', 'text-transform', 'font-family', 'width', 'height', 'padding', 'margin', 'vertical-align', 'display', 'list-style-type', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right')
INH_ASK = ('color', 'font-size', 'text-align', 'text-transform', 'font-family')
def emit_by_line(root):
    """{source line index: [text this line puts on the page, one string per page line]}. Inline pieces that sit on different source lines (a menu of inline list items) stay with their own line."""
    res = {}; cur = []
    def flush():
        nonlocal cur
        if cur:
            groups = []
            for l, t in cur:
                if groups and groups[-1][0] == l: groups[-1][1].append(t)
                else: groups.append([l, [t]])
            for l, ts in groups:
                s = ' '.join(''.join(ts).split())
                if s: res.setdefault(l, []).append(s)
        cur = []
    def rec(nd):
        nonlocal cur
        if nd.tag == '#text': cur.append((nd.line, shown_text(nd))); return
        if nd.tag in ('#comment', 'head', 'link'): return
        if nd.tag in ('br', 'hr'): flush(); return
        if nd.tag == 'img': return
        blk = _is_block(nd)
        if blk: flush()
        for c in nd.children: rec(c)
        if nd.tag in ('td', 'th'): cur.append((nd.line, ' '))
        if blk: flush()
    for c in root.children: rec(c)
    flush(); return res
def norm_val(p, v):
    if p == 'font-family': return v.split(',')[0].strip().strip('"\'').lower()
    return ' '.join(v.lower().split())
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
PURE = {'#ff0000': 'red', '#00ff00': 'green', '#0000ff': 'blue', '#ffffff': 'white', '#000000': 'black'}
def _px(v):
    m = re.match(r'^(\d+(?:\.\d+)?)px$', v or ''); return float(m.group(1)) if m else (0.0 if v in (None, '0') else None)
def _num(x): return str(int(x)) if abs(x - round(x)) < 1e-9 else str(x)
def total_width(e):
    """content width + padding + border on both sides, in px, or None when it cannot be worked out (needs a px width and px padding/border)"""
    a = authored(e); w = _px(a.get('width'))
    if w is None or not a.get('width', '').endswith('px'): return None
    pad = box_sides(e, 'padding'); bd = expected_props(e); tot = w
    if not pad and not any(k.startswith('border') for k in bd): return None
    for side in ('left', 'right'):
        p = pad.get(side); 
        if p is not None:
            v = _px(p)
            if v is None: return None
            tot += v
        b = bd.get('border-' + side)
        if b:
            m = re.search(r'(\d+(?:\.\d+)?)px', b); tot += float(m.group(1)) if m and b.split()[-1] != 'none' and 'none' not in b.split() else 0
    return tot
def lines_at(code, i):
    """the lines of text the page shows after source line i (an unfinished page is closed by the browser)"""
    try: return page_lines_noimg(parse('\n'.join(code.split('\n')[:i + 1]), partial=True))
    except HtmlError: return []
LAST_SPEC = []
def trace(code):
    """one step per source line. Every question needs REASONING about the browser (inherited styles, display, box sizes, nesting, table cells, line counts), never just copying what is written on the line."""
    global LAST_SPEC
    root = parse(code); lines = code.split('\n'); els = elements(root); em = emit_by_line(root); steps = []; LAST_SPEC = []
    prev_lines = []; table_cells = 0; counts = []
    for i, ln in enumerate(lines):
        now = lines_at(code, i); counts.append(len(now))
        changed = {}; printed = []; cond = ''
        opened = [e for e in els if e.line == i]; tagcount = {}; cands = []   # (priority, key, answer, spec)
        raw = ' '.join(re.sub(r'<[^>]*>', ' ', ln).split())
        emitted = em.get(i, []); n_text = len(emitted)
        for k_, e in enumerate(opened):
            if e.tag in ('html', 'head', 'title', 'link', 'meta'): continue
            tagcount[e.tag] = tagcount.get(e.tag, 0) + 1
            nm = e.tag + ('' if sum(1 for x in opened if x.tag == e.tag) == 1 else '#%d' % tagcount[e.tag])
            a = authored(e); key = lambda p: 'L%d %s %s' % (i + 1, nm, p); sp = dict(ln=i, k=k_, tag=e.tag)
            has_text = any(t.text.strip() and t.line == i and _under(t, e) for t in walk(e) if t.tag == '#text')
            nested = any(o is not e and _under(e, o) for o in opened)
            tw = total_width(e)
            if tw is not None: cands.append((1, key('total-width'), _num(tw) + 'px', dict(sp, kind='width', expect=tw)))
            for kind in ('padding', 'margin'):
                sides = box_sides(e, kind); decl = [v for p, v in parse_style(e.attrs.get('style', ''))[0] if p == kind]
                if decl and len(decl[-1].split()) in (2, 3, 4):
                    side = ('left', 'top', 'right', 'bottom')[(i + k_) % 4] if len(decl[-1].split()) > 2 else ('left', 'top')[(i + k_) % 2]
                    v = sides.get(side)
                    if v and v.endswith('px'): cands.append((2, key('%s-%s' % (kind, side)), v, dict(sp, kind='side', prop='%s-%s' % (kind, side), expect=v)))
            if e.tag == 'li' and e.parent is not None and e.parent.tag == 'ol':
                sibs = [c for c in e.parent.children if c.tag == 'li']; n = sibs.index(e) + 1; lt = effective(e.parent, 'list-style-type')
                if lt is None and 'list-style-type' not in a: cands.append((3, key('number'), str(n), dict(sp, kind='number', expect=n)))
                elif lt in ('upper-roman', 'lower-roman', 'upper-alpha', 'lower-alpha') and n <= 8:
                    ans = {'upper-roman': ROMAN[n - 1], 'lower-roman': ROMAN[n - 1].lower(), 'upper-alpha': 'ABCDEFGH'[n - 1], 'lower-alpha': 'abcdefgh'[n - 1]}[lt]
                    cands.append((3, key('marker'), ans, dict(sp, kind='marker', expect=lt, n=n)))
            if e.tag in ('strong', 'em', 'b', 'i') and has_text:
                anc = []; x = e
                while x is not None and x.tag != '#root': anc.append(x.tag); x = x.parent
                bold = any(t in ('strong', 'b', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6') for t in anc); ital = any(t in ('em', 'i') for t in anc)
                if len([t for t in anc if t in ('strong', 'b', 'em', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6')]) >= 2:
                    cands.append((3, key('looks'), 'both' if bold and ital else ('bold' if bold else 'italic'), dict(sp, kind='looks', bold=bold, ital=ital)))
            if 'color' in a and a['color'].lower() in PURE and has_text:
                cands.append((3, key('pure-color'), PURE[a['color'].lower()], dict(sp, kind='pure', expect=a['color'])))
            bs = {sd: (own(e, 'border-' + sd) or own(e, 'border')) for sd in ('top', 'bottom', 'left', 'right')}
            order = [p_ for p_, _ in parse_style(e.attrs.get('style', ''))[0] if p_ == 'border' or p_.startswith('border-')]
            if len(order) >= 2:
                sides_on = [sd for sd in ('top', 'right', 'bottom', 'left') if expected_props(e).get('border-' + sd) and 'none' not in expected_props(e)['border-' + sd].split()]
                if len(sides_on) == 4: ans = 'all four sides'
                elif len(sides_on) == 2 and set(sides_on) in ({'top', 'bottom'}, {'left', 'right'}): ans = ' and '.join(sides_on)
                else: ans = ' and '.join(sides_on) if len(sides_on) > 1 else sides_on[0]
                cands.append((3, key('border-sides'), ans, dict(sp, kind='bsides', expect=sorted(sides_on))))
            if e.tag in ('td', 'th') and e.parent is not None and e.parent.tag == 'tr':
                row = [c for c in e.parent.children if c.tag in ('td', 'th')]; col = row.index(e) + 1
                trs = [r for r in walk(root) if r.tag == 'tr']
                if trs and e.parent is not trs[0] and col >= 2: cands.append((4, key('column'), str(col), dict(sp, kind='column', expect=col)))
            if has_text and not nested and e.parent is not None:
                for p in INH_ASK:
                    if p in a: continue
                    v = effective(e.parent, p)
                    if v is not None: cands.append((5, key(p), norm_val(p, v), dict(sp, kind='inherit', prop=p, expect=v)))
        # lines on the page: only the lines where text joins an earlier line or a line break splits it (everything else is just counting blocks)
        inline_ish = any(e.tag in ('span', 'strong', 'em', 'a', 'img') or own(e, 'display') in ('inline', 'inline-block') for e in opened if e.tag not in ('html', 'head', 'title', 'link', 'meta'))
        if n_text or raw:
            grew = len(now) - len(prev_lines)
            if raw and inline_ish: cands.append((5, 'L%d line new-line' % (i + 1), 'yes' if grew > 0 else 'no', dict(ln=i, kind='newline', expect=grew > 0)))
            elif raw and now and prev_lines and (grew == 0 or grew > 1): cands.append((5, 'L%d page lines' % (i + 1), str(len(now)), dict(ln=i, kind='lines', expect=len(now))))
        depth = 0
        for l_ in lines[:i + 1]:
            for m_ in re.finditer(r'<(/?)([A-Za-z][A-Za-z0-9]*)[^<>]*?(/?)>', re.sub(r'<!--.*?-->', '', l_)):
                t_ = m_.group(2).lower()
                if t_ in VOID or m_.group(3): continue
                depth += -1 if m_.group(1) else 1
        if ln.strip() and not ln.strip().lower().startswith('<!doctype') and len(opened) + len(re.findall(r'</', ln)) >= 2 and 0 < depth < 8: cands.append((6, 'L%d page open-tags' % (i + 1), str(depth), dict(ln=i, kind='depth', expect=depth)))
        if re.match(r'\s*</tr>', ln):
            done = sum(len([c for c in r.children if c.tag in ('td', 'th')]) for r in walk(root) if r.tag == 'tr' and r.endline <= i)
            cands.append((2, 'L%d table cells' % (i + 1), str(done), dict(ln=i, kind='cells', expect=done)))
        # transformed text: the page shows different letters than the code
        if emitted and raw and ' '.join(emitted) != raw and ' '.join(emitted).lower() == raw.lower():
            printed = emitted
        cands.sort(key=lambda c: c[0]); picked = 0
        for pr, key_, ans, spec in cands:
            if picked >= (1 if printed else 2): break
            changed[key_] = ans; spec = dict(spec, key=key_, ans=ans); LAST_SPEC.append(spec); picked += 1
        if re.match(r'\s*<title>', ln) or re.match(r'\s*<!--', ln): cond = 'False'
        prev_lines = now
        steps.append([changed, printed, describe_line(ln), i, [], 0, cond])
    return steps
def _under(t, e):
    x = t
    while x is not None:
        if x is e: return True
        x = x.parent
    return False
def difficulty(code, steps):
    n = len([l for l in code.split('\n') if l.strip()])
    asks = sum(len(s[0]) for s in steps); inh = sum(1 for s in steps for k, v in s[0].items() if _is_inherited_ask(code, k)); pr = sum(len(s[1]) for s in steps)
    return 10 * n + 3 * asks + 5 * inh + 2 * pr
def _is_inherited_ask(code, name):
    m = re.match(r'L(\d+) (\S+) (\S+)', name)
    if not m: return False
    ln = code.split('\n')[int(m.group(1)) - 1]
    return ('style' not in ln) or (m.group(3) + ':') not in ln

# ------------------------------------------------------------------ concept order (what has been taught by lesson k; lesson order 1..10 = 3.1..3.10)
def features(src):
    root = parse(src, partial=True); out = {}
    def add(k, l): out.setdefault(k, l)
    if root.doctype or re.search(r'<!DOCTYPE', src, re.I): add('<!DOCTYPE>', 1)
    for n in walk(root):
        t = n.tag
        if t in ('#root', '#text', '#comment'):
            if t == '#text' and re.search(r'[^\x00-\x7f]', n.text): add('an emoji or symbol', 8)
            continue
        if t in ('html', 'head', 'title', 'body', 'h1', 'h2', 'p'): add('<%s>' % t, 1)
        elif t == 'h3': add('<h3>', 3)
        elif t in ('strong', 'b', 'em', 'i', 'br', 'hr', 'span'): add('<%s>' % t, 4)
        elif t == 'link': add('<link rel="%s">' % n.attrs.get('rel', ''), 7 if n.attrs.get('rel') == 'icon' else 5)
        elif t == 'img': add('<img>', 7)
        elif t == 'a': add('<a>', 9)
        elif t in ('ul', 'ol', 'li'): add('<%s>' % t, 10)
        elif t == 'div': add('<div>', 14)
        elif t in ('table', 'tr', 'th', 'td'): add('<%s>' % t, 12)
        for k in n.attrs:
            if k == 'style': add('the style attribute', 2)
            elif k in ('href', 'target') and t == 'a': add(k, 9)
            elif k in ('src', 'alt') and t == 'img': add(k, 7)
            elif k in ('rel', 'href', 'crossorigin') and t == 'link': pass
            elif k not in ('style',): add('attribute ' + k, 99)
        for p, v in parse_style(n.attrs.get('style', ''))[0]:
            lv = {'color': 2, 'background-color': 2, 'font-size': 3, 'text-align': 3, 'text-transform': 3, 'font-family': 5, 'width': 7, 'display': 10, 'list-style-type': 10, 'vertical-align': 15, 'height': 15}.get(p, 6 if p.startswith('border') else (13 if re.match(r'^(padding|margin)', p) else 99))
            add(p, lv)
            if p == 'display' and v == 'inline-block': add('display: inline-block', 14)
            if p == 'width' and v.endswith('%'): add('width in %', 7)
    return out
def concept_errors(tag, src, lesson, errors):
    try: f = features(src)
    except HtmlError: return
    for k, lv in f.items():
        if lv > lesson: errors.append((tag, 'uses %s, which is not taught until lesson %s' % (k, lv)))
