"""A small, STRICT model of the HTML a student writes in IST Unit 3, used to build and verify Parsons and tracing problems.
It is checked against a real browser (chrome_check.mjs): tag tree, accepted inline declarations, visible text, computed styles.
Strict on purpose: every tag is closed, every attribute value is in quotes, the style attribute is well formed. Anything else is a "broken page".
"""
import re, json, os
HERE = os.path.dirname(os.path.abspath(__file__))
VOID = {'br', 'hr', 'img', 'link', 'meta', 'input'}
BLOCK = {'html', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'ul', 'ol', 'li', 'hr', 'table', 'tr'}
KNOWN = {'html', 'head', 'title', 'body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'b', 'em', 'i', 'br', 'hr', 'span', 'link', 'img', 'a', 'ul', 'ol', 'li', 'meta', 'div'}
BSTYLES = ('solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'none')
INHERITED = {'color', 'font-size', 'font-family', 'text-align', 'text-transform', 'list-style-type', 'font-weight', 'font-style'}
NAMED = set(re.findall(r'"([a-z]+)"', re.search(r'var NAMES = \[(.*?)\]', open(os.path.join(HERE, '..', '..', 'ist', 'unit-6', 'colors-list.js'), encoding='utf-8').read(), re.S).group(1)))
class HtmlError(Exception): pass

# ------------------------------------------------------------------ tokenizer / parser (strict)
TAG = re.compile(r'<(/?)([A-Za-z][A-Za-z0-9]*)((?:\s+[A-Za-z_:][-A-Za-z0-9_:.]*(?:\s*=\s*(?:"[^"<]*"|\'[^\'<]*\'))?)*)\s*(/?)>')
ATTR = re.compile(r'\s+([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*(?:"([^"<]*)"|\'([^\'<]*)\'))?')
class Node:
    def __init__(self, tag, attrs=None, line=0, parent=None):
        self.tag = tag; self.attrs = attrs or {}; self.children = []; self.line = line; self.parent = parent; self.endline = line
    def __repr__(self): return '<%s>' % self.tag
def parse(src, partial=False):
    """src may span several lines. Returns the root (tag '#root'); raises HtmlError for anything a careful student would call broken."""
    root = Node('#root'); stack = [root]; i = 0; n = len(src); line = 0; doctype = False
    def ln(upto): return src.count('\n', 0, upto)
    while i < n:
        if src[i] == '<':
            if src.startswith('<!--', i):
                e = src.find('-->', i)
                if e < 0: raise HtmlError('comment not closed')
                c = Node('#comment', line=ln(i), parent=stack[-1]); c.text = src[i + 4:e]; stack[-1].children.append(c); i = e + 3; continue
            if src[i:i + 9].upper() == '<!DOCTYPE':
                m = re.match(r'<!DOCTYPE\s+html\s*>', src[i:], re.I)
                if not m: raise HtmlError('bad doctype')
                if len(stack) != 1 or root.children: raise HtmlError('doctype must be first')
                doctype = True; i += m.end(); continue
            m = TAG.match(src, i)
            if not m: raise HtmlError('bad tag near %r' % src[i:i + 20])
            closing, name, attrs, selfc = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
            if name not in KNOWN: raise HtmlError('unknown tag ' + name)
            L = ln(i); i = m.end()
            if closing:
                if attrs.strip(): raise HtmlError('a closing tag cannot have attributes')
                if name in VOID: raise HtmlError('void tag has no closing tag: ' + name)
                if len(stack) < 2 or stack[-1].tag != name: raise HtmlError('mismatched </%s>' % name)
                stack[-1].endline = L; stack.pop(); continue
            d = {}
            for am in ATTR.finditer(attrs):
                k = am.group(1).lower()
                if k in d: raise HtmlError('attribute twice: ' + k)
                d[k] = am.group(2) if am.group(2) is not None else (am.group(3) if am.group(3) is not None else '')
            nd = Node(name, d, L, stack[-1]); stack[-1].children.append(nd)
            if name in VOID: continue
            if selfc: raise HtmlError('self-closing syntax is not used in this course')
            stack.append(nd)
        else:
            j = src.find('<', i); j = n if j < 0 else j
            t = src[i:j]
            if t:
                x = Node('#text', line=ln(i + len(t) - len(t.lstrip())), parent=stack[-1]); x.text = t; stack[-1].children.append(x)
            i = j
    if len(stack) != 1 and not partial: raise HtmlError('<%s> never closed' % stack[-1].tag)
    root.doctype = doctype
    return root
def walk(nd):
    yield nd
    for c in nd.children: yield from walk(c)

# ------------------------------------------------------------------ CSS (inline style attribute)
HEX = re.compile(r'^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$')
def ok_color(v): return v.lower() in NAMED or bool(HEX.match(v))
SIDES = ('', '-top', '-bottom', '-left', '-right')
def ok_len(v): return bool(re.match(r'^(?:\d+(?:\.\d+)?(?:px|%|em|rem)|0)$', v))
def ok_decl(p, v):
    """True when a browser would accept this declaration (checked against the real browser in chrome_check.mjs)."""
    v = v.strip()
    if p in ('color', 'background-color'): return ok_color(v)
    if p == 'font-size': return bool(re.match(r'^\d+(?:\.\d+)?(?:px|em|rem|%|pt)$', v)) or v in ('small', 'medium', 'large', 'x-large', 'xx-large', 'smaller', 'larger')
    if p == 'text-align': return v in ('left', 'center', 'right', 'justify')
    if p == 'text-transform': return v in ('none', 'uppercase', 'lowercase', 'capitalize')
    if p == 'font-family': return bool(v) and not v.endswith(',') and bool(re.match(r'^(?:"[^"]+"|\'[^\']+\'|[A-Za-z][A-Za-z0-9 \-]*)(?:\s*,\s*(?:"[^"]+"|\'[^\']+\'|[A-Za-z][A-Za-z0-9 \-]*))*$', v))
    if p == 'font-weight': return v in ('normal', 'bold', 'bolder', 'lighter') or bool(re.match(r'^[1-9]00$', v))
    if p == 'font-style': return v in ('normal', 'italic', 'oblique')
    if p == 'text-decoration': return v in ('none', 'underline', 'line-through', 'overline')
    if p == 'width' or p == 'height': return ok_len(v) or v == 'auto'
    if p == 'display': return v in ('block', 'inline', 'inline-block', 'none')
    if p == 'list-style-type': return v in ('disc', 'circle', 'square', 'decimal', 'none', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman')
    if p == 'border' or re.match(r'^border-(top|bottom|left|right)$', p):
        parts = v.split()
        if not 1 <= len(parts) <= 3: return False
        w = [x for x in parts if re.match(r'^\d+(?:\.\d+)?px$', x)]; s = [x for x in parts if x in BSTYLES]
        c = [x for x in parts if ok_color(x) and x not in s]
        return len(w) + len(s) + len(c) == len(parts) and len(w) <= 1 and len(s) <= 1 and len(c) <= 1
    if p == 'border-style': return v in BSTYLES
    if p == 'border-width': return ok_len(v)
    if p == 'border-color': return ok_color(v)
    if p == 'border-radius': return ok_len(v)
    if p in ('padding', 'margin') or re.match(r'^(padding|margin)-(top|bottom|left|right)$', p): return all(ok_len(x) or x == 'auto' for x in v.split()) and 1 <= len(v.split()) <= 4
    return False
def parse_style(s):
    """-> (valid declarations as a list of (prop, value) in order, number of declarations the browser would drop). Strict: a declaration needs 'prop: value'."""
    good = []; bad = 0
    for d in [x for x in s.split(';') if x.strip()]:
        if ':' not in d: bad += 1; continue
        p, v = d.split(':', 1); p = p.strip().lower(); v = ' '.join(v.split())
        if ok_decl(p, v): good.append((p, v.lower() if p not in ('font-family',) else v))
        else: bad += 1
    return good, bad
def authored(nd):
    good, bad = parse_style(nd.attrs.get('style', '')) if nd.tag != '#text' else ([], 0)
    d = {}
    for p, v in good: d[p] = v
    return d

# ------------------------------------------------------------------ what the page shows
UA_BOLD = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b'}
HEADINGS = {'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
def effective(nd, prop):
    """The authored value that applies to this element for an INHERITED property (own value, else the nearest ancestor's), or None when the browser's own default applies.
    A browser does not simply pass every value down: headings have their own default size (so an inherited px size is not their size), <hr> has its own gray, and a link keeps its own blue."""
    x = nd; first = True
    while x is not None and x.tag != '#root':
        a = authored(x)
        if prop in a: return a[prop]
        if prop not in INHERITED: return None
        if prop == 'font-size' and x.tag in HEADINGS: return None
        if prop == 'color' and (x.tag == 'hr' or (x.tag == 'a' and 'href' in x.attrs)): return None
        x = x.parent
    return None
def own(nd, prop): return authored(nd).get(prop)
def transform(t, mode):
    if mode == 'uppercase': return t.upper()
    if mode == 'lowercase': return t.lower()
    if mode == 'capitalize': return re.sub(r'(^|\s)(\S)', lambda m: m.group(1) + m.group(2).upper(), t)
    return t
def shown_text(nd_text):
    """the text node as the browser shows it: runs of spaces become one space (a space at either end is kept), text-transform applied"""
    t = re.sub(r'\s+', ' ', nd_text.text)
    return transform(t, effective(nd_text.parent, 'text-transform'))
def in_head(nd):
    x = nd
    while x is not None:
        if x.tag == 'head': return True
        x = x.parent
    return False
def page_lines(root):
    """The visible page as a list of lines (blocks and <br> start a new line). Emojis and symbols stay as typed."""
    out = []; cur = ['']
    def flush():
        s = ' '.join(''.join(cur).split())
        if s: out.append(s)
        cur[0:] = ['']
    def rec(nd):
        if nd.tag == '#text': cur.append(shown_text(nd)); return
        if nd.tag == '#comment' or nd.tag in ('head', 'link'): return
        if nd.tag == 'br': flush(); return
        if nd.tag == 'hr': flush(); return
        if nd.tag == 'img': cur.append(' [image: %s]' % nd.attrs.get('alt', '')); return
        blk = nd.tag in BLOCK and own(nd, 'display') not in ('inline', 'inline-block')
        if blk: flush()
        for c in nd.children: rec(c)
        if blk: flush()
    for c in root.children: rec(c)
    flush(); return out
def signature(root):
    """what makes two pages 'the same page' for a Parsons problem: tag tree, accepted inline declarations, the attributes that matter, and the text.
    A space between two inline things (bold word, space, italic word) counts; whitespace next to a block or at the edge of a box does not."""
    def keep(nd, i):
        sibs = nd.parent.children if nd.parent is not None else []
        if nd.tag != '#text' or nd.text.strip(): return True
        prev = sibs[i - 1] if i > 0 else None; nxt = sibs[i + 1] if i + 1 < len(sibs) else None
        for x in (prev, nxt):
            if x is None: return False
            if x.tag in BLOCK or x.tag in ('head', 'body', 'html', 'title', 'link', 'li', 'br', 'hr', '#comment'): return False
        return True
    def kids(nd): return [c for i, c in enumerate(nd.children) if c.tag != '#comment' and keep(c, i)]
    def sg(nd):
        if nd.tag == '#text': return ('t', ' '.join(nd.text.split()) if nd.text.strip() else ' ')
        a = tuple(sorted(authored(nd).items()))
        k = tuple(sorted((k_, v) for k_, v in nd.attrs.items() if k_ in ('href', 'src', 'alt', 'target', 'rel', 'width', 'type', 'class', 'id', 'name', 'content', 'charset')))
        return (nd.tag, a, k, tuple(sg(c) for c in kids(nd)))
    return (bool(getattr(root, 'doctype', False)), tuple(sg(c) for c in kids(root)))
def try_sig(src):
    try: return signature(parse(src))
    except HtmlError: return None

# ------------------------------------------------------------------ what a browser should compute (for the real-browser check)
def elements(root):
    return [n for n in walk(root) if n.tag not in ('#root', '#text', '#comment')]
CHECK_PROPS = ('color', 'background-color', 'font-size', 'text-align', 'text-transform', 'font-family', 'width', 'display', 'list-style-type')
def expected_props(nd):
    d = {}
    for p in CHECK_PROPS:
        v = effective(nd, p) if p in INHERITED else own(nd, p)
        if v is not None: d[p] = v
    for side in ('top', 'bottom', 'left', 'right'):
        v = own(nd, 'border-' + side) or own(nd, 'border')
        # a later declaration wins, so use the last of border / border-<side> in the order written
        order = [p for p, _ in parse_style(nd.attrs.get('style', ''))[0] if p in ('border', 'border-' + side)]
        if order: v = authored(nd)[order[-1]]
        if v: d['border-' + side] = v
    return d
def full_page(src):
    """a fragment is wrapped in the standard skeleton so a browser can show it; a whole page is left as it is"""
    if re.search(r'<html[\s>]', src, re.I): return src
    if re.match(r'\s*<body[\s>]', src, re.I): return '<!DOCTYPE html>\n<html>\n<head>\n<title>t</title>\n</head>\n' + src + '\n</html>'
    return '<!DOCTYPE html>\n<html>\n<head>\n<title>t</title>\n</head>\n<body>\n' + src + '\n</body>\n</html>'
def doc_info(src, did):
    root = parse(src); frag = False if re.search(r'<html[\s>]', src, re.I) else ('body' if re.match(r'\s*<body[\s>]', src, re.I) else True)
    els = elements(root)
    return dict(id=did, html=full_page(src), frag=frag, tags=[e.tag for e in els], props=[expected_props(e) for e in els], lines=page_lines_noimg(root))
def page_lines_noimg(root):
    import copy
    return [l for l in page_lines(root) if not l.startswith('[image:')] if False else _lines_without_images(root)
def _lines_without_images(root):
    out = []; cur = ['']
    def flush():
        s = ' '.join(''.join(cur).split())
        if s: out.append(s)
        cur[0:] = ['']
    def rec(nd):
        if nd.tag == '#text': cur.append(shown_text(nd)); return
        if nd.tag in ('#comment', 'head', 'link', 'img'): return
        if nd.tag in ('br', 'hr'): flush(); return
        blk = nd.tag in BLOCK and own(nd, 'display') not in ('inline', 'inline-block')
        if blk: flush()
        for c in nd.children: rec(c)
        if blk: flush()
    for c in root.children: rec(c)
    flush(); return out
