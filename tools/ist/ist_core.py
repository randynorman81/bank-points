"""Builds Parsons and browser-trace problems for IST Unit 3 (HTML). Every page is parsed by html_model (checked against a real browser)."""
import re, itertools, json
from html_model import *

# ------------------------------------------------------------------ plain-English descriptions of one HTML line
TAGWORDS = {'html': 'the page itself', 'head': 'the hidden information area', 'body': 'everything the visitor sees', 'h1': 'a level 1 heading (the biggest title)', 'h2': 'a level 2 heading', 'h3': 'a level 3 heading',
            'h4': 'a level 4 heading', 'h5': 'a level 5 heading', 'h6': 'a level 6 heading', 'p': 'a paragraph', 'strong': 'bold text', 'b': 'bold text', 'em': 'italic text', 'i': 'italic text', 'span': 'a span (part of a line)',
            'a': 'a link', 'ul': 'a bulleted list', 'ol': 'a numbered list', 'li': 'a list item', 'img': 'a picture', 'br': 'a line break', 'hr': 'a horizontal line', 'title': 'the page title (shown on the browser tab)', 'link': 'a link tag'}
PROPWORDS = {'color': 'the text color', 'background-color': 'the background color', 'font-size': 'the text size', 'text-align': 'the text alignment', 'text-transform': 'the letter case', 'font-family': 'the font',
             'width': 'the width', 'display': 'how it is displayed', 'list-style-type': 'the list marker', 'border': 'a border on all four sides', 'border-top': 'a border on the top', 'border-bottom': 'a border on the bottom',
             'border-left': 'a border on the left', 'border-right': 'a border on the right', 'font-weight': 'the boldness', 'font-style': 'the font style', 'text-decoration': 'the text decoration'}
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
    if top.tag in ('html', 'head', 'body', 'ul', 'ol') and not re.search(r'</%s>\s*$' % top.tag, s):
        d = 'Open %s: %s' % ('<%s>' % top.tag, {'html': 'the outer box that holds the whole page.', 'head': 'it holds information about the page that is not shown on the page.', 'body': 'everything the visitor can see goes inside it.', 'ul': 'a bulleted list; only <li> items go inside it.', 'ol': 'a numbered list; only <li> items go inside it.'}[top.tag])
        sty = authored(top)
        for p, v in sty.items(): d += ' Its %s is %s.' % (PROPWORDS.get(p, p).replace('the ', '', 1) if p.startswith('border') is False else PROPWORDS[p], v)
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
        elif txt: d += ('; ' if top.attrs.get('target') == '_blank' else ' ') + 'the clickable words are "%s"' % txt
        return d + '.'
    d = 'Write %s' % word
    if txt and top.tag not in ('br', 'hr'): d += ' that says "%s"' % txt
    sty = authored(top)
    if sty:
        d += ', styled with ' + ' and '.join(('the display style inline (it sits in the line like a word)' if (p == 'display' and v == 'inline') else '%s %s' % (PROPWORDS.get(p, p), v)) for p, v in sty.items())
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
ASK_ORDER = ('color', 'background-color', 'font-size', 'text-align', 'text-transform', 'font-family', 'width', 'display', 'list-style-type', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right')
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
        blk = nd.tag in BLOCK and own(nd, 'display') not in ('inline', 'inline-block')
        if blk: flush()
        for c in nd.children: rec(c)
        if blk: flush()
    for c in root.children: rec(c)
    flush(); return res
def norm_val(p, v):
    if p == 'font-family': return v.split(',')[0].strip().strip('"\'').lower()
    return ' '.join(v.lower().split())
def trace(code):
    root = parse(code); lines = code.split('\n'); els = elements(root); em = emit_by_line(root); steps = []; seenv = {}
    for i, ln in enumerate(lines):
        changed = {}; printed = em.get(i, []); cond = ''
        opened = [e for e in els if e.line == i]
        tagcount = {}
        for e in opened:
            if e.tag in ('html', 'head', 'title', 'link', 'meta'): continue
            tagcount[e.tag] = tagcount.get(e.tag, 0) + 1
            nm = e.tag + ('' if sum(1 for x in opened if x.tag == e.tag) == 1 else '#%d' % tagcount[e.tag])
            got = 0; a = authored(e)
            if e.tag == 'a':
                if 'href' in e.attrs: changed['L%d %s href' % (i + 1, nm)] = e.attrs['href']; got += 1
                changed['L%d %s opens-in' % (i + 1, nm)] = 'new tab' if e.attrs.get('target') == '_blank' else 'same tab'; got += 1
            elif e.tag == 'img':
                if 'alt' in e.attrs: changed['L%d %s alt' % (i + 1, nm)] = e.attrs['alt']; got += 1
            elif e.tag == 'li' and e.parent is not None and e.parent.tag == 'ol' and effective(e.parent, 'list-style-type') is None and 'list-style-type' not in a:
                sibs = [c for c in e.parent.children if c.tag == 'li']; changed['L%d %s number' % (i + 1, nm)] = str(sibs.index(e) + 1); got += 1
            for p in ASK_ORDER:
                if p in a and got < 2: changed['L%d %s %s' % (i + 1, nm, p)] = norm_val(p, a[p]); got += 1
            has_text = any(t.text.strip() and (t.line == i) and _under(t, e) for t in walk(e) if t.tag == '#text')
            nested = any(o is not e and _under(e, o) for o in opened)
            if has_text and got < 2 and not nested:
                for p in INH_ASK:
                    if p in a: continue
                    v = effective(e.parent, p) if e.parent is not None else None
                    if v is not None and got < 2: changed['L%d %s %s' % (i + 1, nm, p)] = norm_val(p, v); got += 1
        if re.match(r'\s*<title>', ln) or re.match(r'\s*<!--', ln): cond = 'False'
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
        elif t == 'div': add('<div>', 99)
        for k in n.attrs:
            if k == 'style': add('the style attribute', 2)
            elif k in ('href', 'target') and t == 'a': add(k, 9)
            elif k in ('src', 'alt') and t == 'img': add(k, 7)
            elif k in ('rel', 'href', 'crossorigin') and t == 'link': pass
            elif k not in ('style',): add('attribute ' + k, 99)
        for p, v in parse_style(n.attrs.get('style', ''))[0]:
            lv = {'color': 2, 'background-color': 2, 'font-size': 3, 'text-align': 3, 'text-transform': 3, 'font-family': 5, 'width': 7, 'display': 10, 'list-style-type': 10}.get(p, 6 if p.startswith('border') else 99)
            add(p, lv)
            if p == 'width' and v.endswith('%'): add('width in %', 7)
    return out
def concept_errors(tag, src, lesson, errors):
    try: f = features(src)
    except HtmlError: return
    for k, lv in f.items():
        if lv > lesson: errors.append((tag, 'uses %s, which is not taught until lesson %s' % (k, lv)))
