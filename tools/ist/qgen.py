"""Question generator for IST Unit 3 (HTML Part 1): the game question bank, the practice test and the study-guide check questions all come from here.
Every question carries `chk`: a list of {html, js, expect}. qcheck.mjs loads each page in a REAL browser, evaluates `js` (the document is `d`, the window is `W`) and compares it with `expect`,
so the marked answer is confirmed by Chrome, not by this file. For "which code ..." questions every option page is checked (only the right one may give the expected result).
usage: imported by gen_bank.py, gen_test.py"""
import html, random, re, json
from html_model import parse, HtmlError, page_lines, effective, authored, walk

E = lambda s: html.escape(s, quote=False)
def C(s): return '<code>%s</code>' % E(s)
def page(title, body, head='', battr=''):
    return '<!DOCTYPE html>\n<html>\n<head>\n<title>%s</title>\n%s</head>\n<body%s>\n%s</body>\n</html>' % (title, head, battr, body)
def pg(body, head='', battr=''): return page('Page', body, head, battr)

SHOPS = ['Pizza Planet', 'Blue Moon Bakery', 'Turbo Gym', 'Pixel Arcade', 'Cozy Cat Cafe', 'Rocket Repair', 'Green Leaf Market', 'Sky Cinema', 'Taco Tower', 'Panda Books', 'Wave Surf Shop', 'Maple Music', 'Star Bowling', 'Dino Toys', 'Frosty Treats', 'Comet Skate Park', 'Happy Paws Vet', 'Lucky Noodle Bar', 'Bright Bikes', 'Sunny Smoothies']
SECTIONS = ['About Us', 'Our Menu', 'Contact', 'Hours', 'News', 'Gallery', 'Specials', 'Our Team', 'Events', 'Reviews']
LINES = ['Open every day.', 'Come visit us today.', 'Fresh and friendly service.', 'Now with free delivery.', 'Great prices all week.', 'Bring a friend.', 'Kids eat free on Monday.', 'We love our neighbors.', 'Try something new.', 'Made with care.', 'Ask about our deals.', 'Fun for the whole family.']
COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'navy', 'gold', 'tomato', 'hotpink', 'maroon', 'crimson', 'indigo', 'coral', 'brown', 'gray', 'olive', 'lime', 'orchid', 'salmon']
RGB = {'red': 'rgb(255, 0, 0)', 'blue': 'rgb(0, 0, 255)', 'green': 'rgb(0, 128, 0)', 'purple': 'rgb(128, 0, 128)', 'orange': 'rgb(255, 165, 0)', 'teal': 'rgb(0, 128, 128)', 'navy': 'rgb(0, 0, 128)', 'gold': 'rgb(255, 215, 0)', 'tomato': 'rgb(255, 99, 71)',
       'hotpink': 'rgb(255, 105, 180)', 'maroon': 'rgb(128, 0, 0)', 'crimson': 'rgb(220, 20, 60)', 'indigo': 'rgb(75, 0, 130)', 'coral': 'rgb(255, 127, 80)', 'brown': 'rgb(165, 42, 42)', 'gray': 'rgb(128, 128, 128)', 'olive': 'rgb(128, 128, 0)',
       'lime': 'rgb(0, 255, 0)', 'orchid': 'rgb(218, 112, 214)', 'salmon': 'rgb(250, 128, 114)', 'black': 'rgb(0, 0, 0)', 'white': 'rgb(255, 255, 255)', 'yellow': 'rgb(255, 255, 0)'}
HEXES = ['#1E90FF', '#FF6347', '#2E8B57', '#8A2BE2', '#FFD700', '#20B2AA', '#DC143C', '#4B0082', '#FF8C00', '#008080']

class Skip(Exception): pass

class Q:
    def __init__(self, lesson, topic, stem, code, right, wrong, why, chk=None, key=None):
        self.d = dict(l=lesson, t=topic, s=stem, c=code, right=right, wrong=list(wrong), e=why, chk=chk or [], key=key or (stem + '|' + (code or '') + '|' + right))
def mkq(rng, lesson, topic, stem, code, right, wrong, why, chk=None, key=None, multi=None):
    """right: option HTML; wrong: list of option HTML (3). The options are shuffled; `a` is the index of the right one."""
    wrong = [w for i, w in enumerate(wrong) if w != right and w not in wrong[:i]]
    if len(wrong) < 3: raise Skip('need 3 different wrong options')
    wrong = wrong[:3] if len(wrong) == 3 else rng.sample(wrong, 3)
    o = [right] + wrong; idx = list(range(4)); rng.shuffle(idx)
    return dict(l=lesson, t=topic, s=stem, c=code, o=[o[i] for i in idx], a=idx.index(0), e=why, chk=chk or [], key=key or (stem + '|' + (code or '') + '|' + right))
def A_(w): return ('an ' if w[0] in 'aeiou' else 'a ') + w
def lines_html(lines): return '<br>'.join(E(x) for x in lines)
def ck(h, js, expect): return dict(html=h, js=js, expect=expect)
def must_parse(src):
    try: return parse(src)
    except HtmlError as e: raise Skip('model rejects %s' % e)

# ------------------------------------------------------------------ small content helpers
def two(rng, pool): return rng.sample(pool, 2)
def sentence(rng): return rng.choice(LINES)

# ====================================================================== LESSON 1: the skeleton
def l1_shows(rng):
    shop = rng.choice(SHOPS); h2 = rng.choice(SECTIONS); p = sentence(rng); title = rng.choice([s for s in SHOPS if s != shop])
    code = page(title, '<h1>%s</h1>\n<h2>%s</h2>\n<p>%s</p>\n' % (shop, h2, p))
    must_parse(code)
    return mkq(rng, 1, 'What shows', 'What does a visitor see on the page itself (not on the browser tab)?', code, lines_html([shop, h2, p]),
               [lines_html([title, shop, h2, p]), lines_html([shop, p]), lines_html([p, h2, shop])], 'Only the <b>body</b> shows on the page. The title in the head goes on the browser tab, and the page shows the heading 1, heading 2 and paragraph in the order they are written.',
               [ck(code, "d.body.innerText.split('\\n').map(function(s){return s.trim()}).filter(Boolean)", [shop, h2, p])])
def l1_tab(rng):
    shop, title = rng.sample(SHOPS, 2); h2 = rng.choice(SECTIONS)
    code = page(title, '<h1>%s</h1>\n<h2>%s</h2>\n' % (shop, h2)); must_parse(code)
    return mkq(rng, 1, 'The title', 'What text appears on the browser tab?', code, E(title), [E(shop), E(h2), 'Nothing (a page cannot have a tab name)'],
               'The <b>title</b> tag, inside the head, is the name on the browser tab. The heading 1 is shown on the page, not on the tab.', [ck(code, "d.title", title)])
def l1_count(rng):
    shop = rng.choice(SHOPS); n2 = rng.randint(1, 3); np_ = rng.randint(1, 4)
    parts = ['<h1>%s</h1>' % shop]; secs = rng.sample(SECTIONS, n2)
    ps = [sentence(rng) for _ in range(np_)]
    body = parts + ['<h2>%s</h2>' % s for s in secs] + ['<p>%s</p>' % x for x in ps]
    rng.shuffle(body); body = ['<h1>%s</h1>' % shop] + [b for b in body if not b.startswith('<h1>')]
    code = page(shop, '\n'.join(body) + '\n'); must_parse(code)
    kind = rng.choice(['h2', 'p', 'heads'])
    if kind == 'h2': n, what, sel = n2, 'heading 2 tags', 'h2'
    elif kind == 'p': n, what, sel = np_, 'paragraphs', 'p'
    else: n, what, sel = n2 + 1, 'headings in all (heading 1 and heading 2 together)', 'h1,h2'
    opts = [str(x) for x in (n, n + 1, n + 2, max(0, n - 1)) if x >= 0]
    return mkq(rng, 1, 'Reading the code', 'How many %s does this page have?' % what, code, str(n), [o for o in opts if o != str(n)] + [str(n + 3)],
               'Count the opening tags: %d.' % n, [ck(code, "d.querySelectorAll('%s').length" % sel, n)])
def l1_defect(rng):
    shop = rng.choice(SHOPS); p = sentence(rng)
    full = '<!DOCTYPE html>\n<html>\n<head>\n<title>%s</title>\n</head>\n<body>\n<h1>%s</h1>\n<p>%s</p>\n</body>\n</html>' % (shop, shop, p)
    D = {'doctype': ('The doctype line is missing', full.replace('<!DOCTYPE html>\n', ''), "d.compatMode", 'BackCompat'),
         'tabbody': ('The title is in the body instead of the head', full.replace('<title>%s</title>\n' % shop, '').replace('<body>\n', '<body>\n<title>%s</title>\n' % shop), "!d.head.querySelector('title') && !!d.body.querySelector('title')", True),
         'noclose': ('The closing body tag is missing', full.replace('</body>\n', ''), None, None),
         'wrongclose': ('The heading 1 is closed with the wrong tag', full.replace('</h1>', '</h2>'), None, None),
         'backwards': ('The body is written before the head', full.replace('<head>\n<title>%s</title>\n</head>\n<body>\n<h1>%s</h1>\n<p>%s</p>\n</body>' % (shop, shop, p), '<body>\n<h1>%s</h1>\n<p>%s</p>\n</body>\n<head>\n<title>%s</title>\n</head>' % (shop, p, shop)), None, None)}
    key = rng.choice(list(D)); desc, code, js, ex = D[key]
    if key in ('noclose', 'wrongclose'):
        try: parse(code); raise Skip('should not parse')
        except HtmlError: pass
    else: must_parse(code)
    wrong = [D[k][0] for k in D if k != key]
    chk = [ck(code, js, ex)] if js else []
    return mkq(rng, 1, 'Finding the error', 'This page has one mistake. What is it?', code, desc, wrong, 'Every page needs the doctype line first, a head holding the title, a body holding what visitors see, and every opening tag closed with the SAME name.', chk)

L1_FACTS = [
 ('Which line must be the very first line of a web page?', '<code>&lt;!DOCTYPE html&gt;</code>', ['<code>&lt;html&gt;</code>', '<code>&lt;head&gt;</code>', '<code>&lt;title&gt;</title&gt;</code>'.replace('</title&gt;', '&lt;/title&gt;')], 'The doctype line tells the browser this is a modern web page, so it comes first.'),
 ('Which tag holds everything a visitor can see on the page?', '<code>&lt;body&gt;</code>', ['<code>&lt;head&gt;</code>', '<code>&lt;title&gt;</code>', '<code>&lt;doctype&gt;</code>'], 'The body holds the visible page. The head holds information about the page.'),
 ('What does the <code>&lt;title&gt;</code> tag control?', 'The name on the browser tab', ['The biggest heading on the page', 'The first paragraph', 'The page background'], 'The title is typed in the head and shows on the tab.'),
 ('Where does the <code>&lt;title&gt;</code> tag go?', 'Inside the head', ['Inside the body', 'Above the doctype', 'Inside the h1'], 'The title belongs inside the head tags.'),
 ('Which tag is the biggest, most important heading?', '<code>&lt;h1&gt;</code>', ['<code>&lt;h2&gt;</code>', '<code>&lt;p&gt;</code>', '<code>&lt;head&gt;</code>'], 'A heading 1 is the biggest heading. A page should have only one.'),
 ('How many heading 1 tags should a page have?', 'One', ['Two', 'As many as you like', 'None'], 'A heading 1 is like the title of a book, so a page has one.'),
 ('Which tag is used for a normal block of text?', '<code>&lt;p&gt;</code>', ['<code>&lt;h1&gt;</code>', '<code>&lt;body&gt;</code>', '<code>&lt;html&gt;</code>'], 'A paragraph goes in a p tag.'),
 ('What makes a closing tag different from an opening tag?', 'It has a forward slash', ['It has an exclamation point', 'It is written in capital letters', 'It has no angle brackets'], 'A closing tag looks like the opening tag with a slash: <code>&lt;/p&gt;</code>.'),
 ('Which tag is the outer box that holds the whole page?', '<code>&lt;html&gt;</code>', ['<code>&lt;body&gt;</code>', '<code>&lt;head&gt;</code>', '<code>&lt;h1&gt;</code>'], 'Everything after the doctype goes between the html tags.'),
 ('What goes inside the head tags?', 'Information about the page, like the title', ['Paragraphs and headings', 'Pictures and links the visitor sees', 'Nothing at all'], 'The head holds information that is not shown on the page itself.'),
 ('Does the doctype line have a closing tag?', 'No', ['Yes, <code>&lt;/!DOCTYPE&gt;</code>', 'Yes, <code>&lt;/html&gt;</code>', 'Yes, but only in the head'], 'The doctype is not a box, so it has no closing tag.'),
 ('What happens if you press Enter a few extra times between two tags?', 'Nothing: the browser ignores extra blank lines', ['The page gets extra space', 'The page breaks', 'A new paragraph is added'], 'Only tags decide how the page looks.'),
 ('Which pair of tags goes directly inside the html tags?', 'The head and the body', ['The title and the h1', 'Two bodies', 'The doctype and the head'], 'The html box holds the head and the body.'),
 ('What is an element?', 'An opening tag, the content, and the closing tag together', ['Only the opening tag', 'Only the words between the tags', 'A picture'], 'Opening tag + content + closing tag = an element.'),
]
L1_T = [l1_shows, l1_tab, l1_count, l1_defect]

# ====================================================================== LESSON 2: style attribute and colors
def st(s): return ' style="%s"' % s
def l2_textcolor(rng):
    shop = rng.choice(SHOPS); body_c, h1_c, h2_c = rng.sample(COLORS, 3); p = sentence(rng); h2 = rng.choice(SECTIONS)
    use_body = rng.random() < 0.7
    code = page(shop, '<h1%s>%s</h1>\n<h2%s>%s</h2>\n<p>%s</p>\n' % (st('color: ' + h1_c), shop, st('color: ' + h2_c) if rng.random() < .5 else '', h2, p), battr=st('color: ' + body_c) if use_body else '')
    root = must_parse(code); els = {n.tag: n for n in walk(root) if n.tag in ('h1', 'h2', 'p')}
    target = rng.choice(['h1', 'h2', 'p']); nd = els[target]; col = effective(nd, 'color') or 'black'
    names = {'h1': 'heading 1', 'h2': 'heading 2', 'p': 'paragraph'}
    pool = [c for c in COLORS if c != col] ; wrong = rng.sample(pool, 3)
    if col != 'black' and rng.random() < .5: wrong[0] = 'black'
    exp = RGB[col]
    return mkq(rng, 2, 'Reading colors', 'What color is the text of the %s?' % names[target], code, col, wrong,
               'A style on a tag wins for that tag. A tag with no style of its own uses the <b>body</b> color, and with no body color the browser default is black.' if target != 'h1' or True else '',
               [ck(code, "getComputedStyle(d.querySelector('%s')).color" % target, exp)])
def l2_which_style(rng):
    fg, bg = rng.sample(COLORS, 2); tag = rng.choice(['h1', 'h2', 'p']); txt = rng.choice(SHOPS) if tag != 'p' else sentence(rng)
    opts = {'good': 'color: %s; background-color: %s' % (fg, bg), 'swap': 'color: %s; background-color: %s' % (bg, fg), 'comma': 'color: %s, background-color: %s' % (fg, bg),
            'equals': 'color = %s; background-color = %s' % (fg, bg), 'badprop': 'text-color: %s; background-color: %s' % (fg, bg)}
    pages = {k: pg('<%s%s>%s</%s>\n' % (tag, st(v), txt, tag)) for k, v in opts.items()}
    js = "var s=getComputedStyle(d.querySelector('%s'));[s.color,s.backgroundColor]" % tag
    ex = [RGB[fg], RGB[bg]]
    chk = [ck(pages['good'], js, ex)] + [ck(pages[k], js, {'not': ex}) for k in ('swap', 'comma', 'equals', 'badprop')]
    wrong = [C(opts[k]) for k in ('swap', 'comma', 'equals', 'badprop')]
    wrong = rng.sample(wrong, 3)
    return mkq(rng, 2, 'Writing styles', 'Which style gives %s with %s text on %s background?' % ('a heading' if tag != 'p' else 'a paragraph', fg, A_(bg)), None, C(opts['good']), wrong,
               'The property <code>color</code> is the text, <code>background-color</code> is behind the text, and two styles are separated by a <b>semicolon</b>. Swapped colors give the opposite look; a comma, an equals sign or a made-up property name makes the browser skip the style.', chk,
               key='whichstyle|%s|%s|%s' % (tag, fg, bg))
def l2_errorline(rng):
    cols = rng.sample(COLORS, 5); shop = rng.choice(SHOPS)
    kinds = {'equals': lambda c, p: 'color = %s' % c, 'nosemi': lambda c, p: 'color: %s background-color: %s' % (c, rng.choice(COLORS)), 'badname': lambda c, p: 'color: %s' % (c + 'x'),
             'badprop': lambda c, p: 'colour: %s' % c, 'nohash': lambda c, p: 'color: %s' % ('FF6347')}
    kind = rng.choice(list(kinds))
    tags = ['h1', 'h2', 'p', 'p']; names = ['the heading 1', 'the heading 2', 'the first paragraph', 'the second paragraph']
    bad = rng.randrange(4); lines = []
    for i, t in enumerate(tags):
        c = cols[i]; sty = kinds[kind](c, t) if i == bad else 'color: %s' % c
        lines.append('<%s%s>%s</%s>' % (t, st(sty), rng.choice(['Sale', 'Menu', 'Hours', 'News']) + ' %d' % (i + 1), t))
    code = page(shop, '\n'.join(lines) + '\n'); must_parse(code)
    exp = [RGB[cols[i]] if i != bad else RGB['black'] for i in range(4)]
    js = "Array.prototype.map.call(d.body.children,function(e){return getComputedStyle(e).color})"
    right = names[bad]; wrong = [n for i, n in enumerate(names) if i != bad]
    return mkq(rng, 2, 'Finding the error', 'One of these tags will NOT show its color. Which one?', code, right, wrong,
               'A style must be written <code>property: value</code>, with a colon, a real property name, a real color (a name, or a hex code that starts with #), and a semicolon between two styles. The broken style is ignored and the text stays black.', [ck(code, js, exp)])
def l2_hex(rng):
    h = rng.choice(HEXES); wrong = [h[1:], h[:4] + 'G' + h[5:], h + '0', '#' + h[1:6]]
    wrong = [w if w[0] == '#' or w == h[1:] else w for w in wrong]
    pagesx = {w: pg('<h1%s>Test</h1>\n' % st('color: ' + w)) for w in [h] + wrong}
    js = "getComputedStyle(d.querySelector('h1')).color"
    chk = [dict(html=pagesx[h], js=js, expect={'not': RGB['black']})] + [dict(html=pagesx[w], js=js, expect=RGB['black']) for w in wrong]
    return mkq(rng, 2, 'Hex codes', 'Which of these is a valid hex color code?', None, C(h), [C(w) for w in wrong],
               'A hex code is a <b>#</b> followed by 6 letters and numbers (0-9 and A-F). No #, a letter past F, or the wrong number of digits makes the browser ignore it.', chk, key='hex|' + h)
def l2_nesting(rng):
    shop = rng.choice(SHOPS); a, b, c = rng.sample(COLORS, 3)
    code = page(shop, '<h1>%s</h1>\n<p%s>%s</p>\n' % (shop, st('background-color: ' + a), sentence(rng)), battr=st('background-color: %s; color: %s' % (b, c))); must_parse(code)
    js = "var s=getComputedStyle(d.querySelector('p'));[s.backgroundColor,s.color]"
    # the paragraph's own background shows; its text color comes from the body
    return mkq(rng, 2, 'Reading colors', 'What does the paragraph look like?', code, '%s text on %s background' % (c, A_(a)),
               ['%s text on %s background' % (a, A_(c)), '%s text on %s background' % (b, A_(c)), '%s text on %s background' % (c, A_(b))],
               'The paragraph has its own <code>background-color</code>, so that shows behind it. It has no text color of its own, so the text color comes from the body.', [ck(code, js, [RGB[a], RGB[c]])])

L2_FACTS = [
 ('Where does the <code>style</code> attribute go?', 'Inside the opening tag', ['Inside the closing tag', 'Between the head tags', 'After the doctype'], 'The style attribute is written inside the opening tag.'),
 ('Which punctuation separates two styles in one style attribute?', 'A semicolon', ['A comma', 'A period', 'A colon'], 'Each style ends with a semicolon, so a second one can follow.'),
 ('Which punctuation goes between a property and its value?', 'A colon', ['A semicolon', 'An equals sign', 'A comma'], 'The format is property, colon, value.'),
 ('What quotes surround the styles in a style attribute?', 'Double quotes', ['No quotes', 'Angle brackets', 'Parentheses'], 'The styles go inside a pair of double quotes: <code>style="color: red"</code>.'),
 ('Which property changes the color of the text?', '<code>color</code>', ['<code>text-color</code>', '<code>font-paint</code>', '<code>background-color</code>'], '<code>color</code> is the text color.'),
 ('Which property changes the color behind the text?', '<code>background-color</code>', ['<code>color</code>', '<code>back</code>', '<code>text-background</code>'], '<code>background-color</code> colors the box behind the text.'),
 ('What does a hex color code start with?', 'A # symbol', ['A $ symbol', 'A quote', 'A zero'], 'Hex codes look like <code>#1E90FF</code>.'),
 ('Which style on the body changes the whole page background?', '<code>&lt;body style="background-color: navy"&gt;</code>', ['<code>&lt;head style="background-color: navy"&gt;</code>', '<code>&lt;html color="navy"&gt;</code>', '<code>&lt;title style="background-color: navy"&gt;</code>'], 'Styles on the body reach the whole page.'),
 ('A page has a navy background. What text color is easiest to read?', 'White', ['Navy', 'Dark blue', 'Black'], 'Light text on a dark background is easy to read. Matching colors hide the text.'),
 ('Can one tag have two style attributes?', 'No: put all the styles inside one style attribute', ['Yes, as many as you like', 'Yes, but only on the body', 'Only if they use hex codes'], 'Use one style attribute and separate the styles with semicolons.'),
 ('Which is a named color?', '<code>tomato</code>', ['<code>#tomato</code>', '<code>color1</code>', '<code>sunset-red</code>'], 'There are 148 named colors, and <code>tomato</code> is one.'),
 ('A paragraph has no color style, and the body has <code>color: green</code>. What color is the paragraph text?', 'Green', ['Black', 'Blue', 'There is no text color'], 'Tags without their own color use the body color.'),
]
L2_T = [l2_textcolor, l2_which_style, l2_errorline, l2_hex, l2_nesting]

# ====================================================================== LESSON 3: size, alignment, letter case
def l3_transform(rng):
    kind = rng.choice(['uppercase', 'lowercase', 'capitalize']); tag = rng.choice(['h1', 'h2', 'h3', 'p'])
    words = rng.choice(['big sale today', 'Grand Opening Friday', 'new MENU ready', 'free popcorn night', 'Live Music Saturday', 'welcome to our SHOP', 'open late tonight'])
    out = {'uppercase': words.upper(), 'lowercase': words.lower(), 'capitalize': ' '.join(w[0].upper() + w[1:] for w in words.split())}
    code = pg('<%s%s>%s</%s>\n' % (tag, st('text-transform: ' + kind), words, tag)); must_parse(code)
    wrong = [out[k] for k in out if k != kind] + [words]
    return mkq(rng, 3, 'Letter case', 'What does the page show?', code, E(out[kind]), [E(w) for w in wrong if w != out[kind]],
               '<code>uppercase</code> makes every letter a capital, <code>lowercase</code> makes every letter small, and <code>capitalize</code> makes the first letter of every word a capital. The code you typed does not change.',
               [ck(code, "d.querySelector('%s').innerText" % tag, out[kind])], key='tt|%s|%s|%s' % (kind, words, tag))
def l3_size_style(rng):
    n = rng.choice([20, 28, 36, 40, 48, 60]); tag = rng.choice(['h1', 'h2', 'p'])   # never a tag's own default size (32, 24, 16)
    opts = {'good': 'font-size: %dpx' % n, 'nounit': 'font-size: %d' % n, 'space': 'font-size: %d px' % n, 'badprop': 'size: %dpx' % n, 'eq': 'font-size = %dpx' % n}
    pages = {k: pg('<%s%s>Hello</%s>\n' % (tag, st(v), tag)) for k, v in opts.items()}
    js = "getComputedStyle(d.querySelector('%s')).fontSize" % tag
    chk = [ck(pages['good'], js, '%dpx' % n)] + [dict(html=pages[k], js=js, expect={'not': '%dpx' % n}) for k in ('nounit', 'space', 'badprop', 'eq')]
    return mkq(rng, 3, 'Size', 'Which style makes the text %d pixels tall?' % n, None, C(opts['good']), [C(opts[k]) for k in ('nounit', 'space', 'badprop', 'eq')][:4] and rng.sample([C(opts[k]) for k in ('nounit', 'space', 'badprop', 'eq')], 3),
               'The property is <code>font-size</code>, and the size is a number with <b>px</b> right after it, with no space.', chk, key='fs|%d|%s' % (n, tag))
def l3_align_style(rng):
    al = rng.choice(['center', 'right', 'left']); tag = rng.choice(['h1', 'h2', 'p'])
    opts = {'good': 'text-align: %s' % al, 'a': 'align: %s' % al, 'b': 'text-center: %s' % al if al == 'center' else 'text-position: %s' % al, 'c': 'text-align = %s' % al, 'd': 'font-align: %s' % al}
    pages = {k: pg('<%s%s>Hello there</%s>\n' % (tag, st(v), tag)) for k, v in opts.items()}
    js = "getComputedStyle(d.querySelector('%s')).textAlign" % tag
    chk = [ck(pages['good'], js, al)] + [dict(html=pages[k], js=js, expect={'not': al}) for k in ('a', 'b', 'c', 'd')]
    if al == 'left': raise Skip('left is the default')
    return mkq(rng, 3, 'Alignment', 'Which style puts the %s at the %s of the page?' % ('heading' if tag != 'p' else 'paragraph', al), None, C(opts['good']), [C(opts[k]) for k in ('a', 'b', 'c')],
               'The property is <code>text-align</code>. The values are <code>left</code>, <code>center</code> and <code>right</code>. Text starts on the left until you change it.', chk, key='ta|%s|%s' % (al, tag))
def l3_which_big(rng):
    sizes = rng.sample([14, 18, 22, 28, 34, 40, 52], 3); names = rng.sample(SECTIONS, 3)
    body = ''.join('<p%s>%s</p>\n' % (st('font-size: %dpx' % s), n) for s, n in zip(sizes, names)); code = pg(body); must_parse(code)
    big = names[sizes.index(max(sizes))]
    return mkq(rng, 3, 'Size', 'Which line of text is the biggest?', code, E(big), [E(n) for n in names if n != big] + ['They are all the same size'],
               'The biggest number of <code>px</code> is the biggest text: %d px.' % max(sizes), [ck(code, "Array.prototype.map.call(d.querySelectorAll('p'),function(e){return parseFloat(getComputedStyle(e).fontSize)})", sizes)])
def l3_who_centered(rng):
    tags = ['h1', 'h2', 'h3', 'p']; k = rng.randrange(4); texts = rng.sample(SECTIONS, 4)
    body = ''.join('<%s%s>%s</%s>\n' % (t, st('text-align: center') if i == k else '', texts[i], t) for i, t in enumerate(tags)); code = pg(body); must_parse(code)
    names = {'h1': 'heading 1', 'h2': 'heading 2', 'h3': 'heading 3', 'p': 'paragraph'}
    return mkq(rng, 3, 'Alignment', 'Which tag is centered?', code, 'the ' + names[tags[k]], ['the ' + names[t] for i, t in enumerate(tags) if i != k],
               'Only the %s has <code>text-align: center</code>.' % names[tags[k]], [ck(code, "Array.prototype.map.call(d.body.children,function(e){return getComputedStyle(e).textAlign})", ['center' if i == k else 'start' for i in range(4)])])
def l3_h3_size(rng):
    code = pg('<h1>One</h1>\n<h2>Two</h2>\n<h3>Three</h3>\n<p>Four</p>\n')
    order = [('heading 1', 'h1'), ('heading 2', 'h2'), ('heading 3', 'h3'), ('paragraph', 'p')]
    kind = rng.choice(['smallest', 'biggest'])
    right = 'paragraph' if kind == 'smallest' else 'heading 1'
    return mkq(rng, 3, 'Headings', 'On this page, with no styles added, which one is the %s text?' % kind, code, right, [n for n, _ in order if n != right],
               'Heading 1 is the biggest, then 2, then 3, and a paragraph is the smallest of these.', [ck(code, "Array.prototype.map.call(d.body.children,function(e){return parseFloat(getComputedStyle(e).fontSize)})", [32, 24, 18.72, 16])], key='h3size|' + kind)

L3_FACTS = [
 ('Which new tag is smaller than a heading 2?', '<code>&lt;h3&gt;</code>', ['<code>&lt;h0&gt;</code>', '<code>&lt;head&gt;</code>', '<code>&lt;h&gt;</code>'], 'The headings go h1, h2, h3 from biggest to smallest.'),
 ('Which unit does the <code>font-size</code> style use in this class?', 'px (pixels)', ['mm', 'lines', 'letters'], 'Sizes are a number followed by px, like <code>30px</code>.'),
 ('Which property sets how text lines up left, center or right?', '<code>text-align</code>', ['<code>align-text</code>', '<code>font-align</code>', '<code>text-position</code>'], '<code>text-align</code> is the property.'),
 ('Which value of <code>text-transform</code> makes the first letter of every word a capital?', '<code>capitalize</code>', ['<code>uppercase</code>', '<code>lowercase</code>', '<code>title</code>'], '<code>capitalize</code> capitalizes each word.'),
 ('Does <code>text-transform: uppercase</code> change the words you typed in the code?', 'No: it only changes how they look on the page', ['Yes: the code is rewritten in capitals', 'Yes, but only in the head', 'It deletes the text'], 'The page shows capitals but your code is unchanged.'),
 ('Where does text sit on the page if you add no <code>text-align</code> style?', 'On the left', ['In the center', 'On the right', 'It depends on the font'], 'Text starts on the left.'),
 ('How do you write two styles on one heading, a size and an alignment?', '<code>style="font-size: 40px; text-align: center"</code>', ['<code>style="font-size: 40px" style="text-align: center"</code>', '<code>style="font-size: 40px, text-align: center"</code>', '<code>style="font-size 40px text-align center"</code>'], 'One style attribute, with a semicolon between the styles.'),
 ('Which value of <code>text-transform</code> makes every letter small?', '<code>lowercase</code>', ['<code>smallcase</code>', '<code>capitalize</code>', '<code>minimum</code>'], '<code>lowercase</code> makes every letter small.'),
]
L3_T = [l3_transform, l3_size_style, l3_align_style, l3_which_big, l3_who_centered, l3_h3_size]

# ====================================================================== LESSON 4: strong, em, br, hr, span
W3 = ['fresh', 'hot', 'cold', 'big', 'new', 'sweet', 'crispy', 'free', 'loud', 'tiny', 'best', 'happy']
def l4_bold_words(rng):
    a, b, c = rng.sample(W3, 3); shop = rng.choice(SHOPS)
    kind = rng.choice(['strong', 'em', 'both'])
    if kind == 'both': inner = '<strong>%s</strong> and <em>%s</em>' % (a, b); bold, ital = [a], [b]
    elif kind == 'strong': inner = '<strong>%s</strong> and <strong>%s</strong>' % (a, b); bold, ital = [a, b], []
    else: inner = '<em>%s</em> and <em>%s</em>' % (a, b); bold, ital = [], [a, b]
    code = pg('<p>We serve %s food %s today.</p>\n' % (c, inner)); must_parse(code)
    ask = rng.choice(['bold', 'italic']); ans = bold if ask == 'bold' else ital
    def label(ws): return ' and '.join(ws) if ws else 'none of the words'
    opts_pool = [label([a]), label([b]), label([a, b]), label([c]), 'none of the words', label([a, c])]
    right = label(ans); wrong = [o for o in opts_pool if o != right]
    return mkq(rng, 4, 'Bold and italic', 'Which words does the page show in %s?' % ask, code, right, wrong,
               'In this class bold is the <code>strong</code> tag and italics is the <code>em</code> tag. Only the words between the tags change.',
               [ck(code, "Array.prototype.filter.call(d.querySelectorAll('p *'),function(e){return %s}).map(function(e){return e.innerText})" % ("parseInt(getComputedStyle(e).fontWeight)>=700" if ask == 'bold' else "getComputedStyle(e).fontStyle=='italic'"), ans)],
               key='bi|%s|%s|%s|%s|%s' % (kind, a, b, c, ask))
def l4_lines(rng):
    n = rng.randint(1, 4); parts = rng.sample(['Open daily', '7 AM to 5 PM', '100 Main Street', 'Social Circle', 'Call us today', 'Free parking', 'Closed Sunday'], n + 1)
    code = pg('<p>%s</p>\n' % '<br>'.join(parts)); must_parse(code)
    return mkq(rng, 4, 'Line breaks', 'How many lines of text does the paragraph show?', code, str(n + 1), [str(x) for x in (n, n + 2, 1, n + 3) if x != n + 1],
               'Each <code>br</code> starts a new line, so %d br tags give %d lines.' % (n, n + 1), [ck(code, "d.querySelector('p').innerText.split('\\n').length", n + 1)], key='br|%d|%s' % (n, parts[0]))
def l4_rules(rng):
    n = rng.randint(1, 4); body = ['<h1>%s</h1>' % rng.choice(SHOPS)]
    for i in range(n): body += ['<hr>', '<p>%s</p>' % sentence(rng)]
    code = pg('\n'.join(body) + '\n'); must_parse(code)
    return mkq(rng, 4, 'Horizontal rules', 'How many lines does the browser draw across the page?', code, str(n), [str(x) for x in (n + 1, max(0, n - 1), n + 2, 0) if x != n],
               'Each <code>hr</code> tag draws one line across the page.', [ck(code, "d.querySelectorAll('hr').length", n)], key='hr|%s' % code)
def l4_span(rng):
    c = rng.choice(['red', 'blue', 'green', 'purple', 'orange']); w1, w2, w3 = rng.sample(W3, 3)
    code = pg('<p>The %s menu has <span%s>%s</span> prices.</p>\n' % (w1, st('color: ' + c), w2)); must_parse(code)
    return mkq(rng, 4, 'Span', 'Which words does the page show in %s?' % c, code, w2, [w1, 'menu', 'The %s menu has %s prices.' % (w1, w2)],
               'A <code>span</code> styles only the few words inside it. The rest of the paragraph keeps its normal color.',
               [ck(code, "Array.prototype.filter.call(d.querySelectorAll('p, p *'),function(e){return getComputedStyle(e).color=='%s'&&e.tagName=='SPAN'}).map(function(e){return e.innerText})" % RGB[c], [w2])], key='span|%s|%s|%s' % (c, w1, w2))
def l4_nested(rng):
    a, b, c = rng.sample(W3, 3)
    code = pg('<p><strong>%s <em>%s</em></strong> %s</p>\n' % (a, b, c)); must_parse(code)
    right = '%s: bold only; %s: bold and italic; %s: plain' % (a, b, c)
    wrong = ['%s: bold and italic; %s: italic only; %s: plain' % (a, b, c), '%s: bold only; %s: italic only; %s: plain' % (a, b, c), '%s: bold only; %s: bold and italic; %s: bold' % (a, b, c)]
    return mkq(rng, 4, 'Nesting', 'How does the page show each word?', code, right, wrong,
               'The em tag sits INSIDE the strong tag, so %s gets both. %s is only inside strong, and %s is outside both.' % (b, a, c),
               [ck(code, "var q=function(e){var s=getComputedStyle(e);return [parseInt(s.fontWeight)>=700,s.fontStyle=='italic']};[q(d.querySelector('strong')),q(d.querySelector('em'))]", [[True, False], [True, True]])], key='nest|%s|%s|%s' % (a, b, c))
def l4_hr_before(rng):
    shop = rng.choice(SHOPS); n = rng.randint(2, 3)
    ps = rng.sample(LINES, n); pos = rng.randrange(1, n)
    body = ['<h1>%s</h1>' % shop] + ['<p>%s</p>' % x for x in ps]; body.insert(1 + pos, '<hr>')
    code = pg('\n'.join(body) + '\n'); must_parse(code)
    texts = [shop] + ps; right = 'between "%s" and "%s"' % (texts[pos], texts[pos + 1])
    wrong = ['between "%s" and "%s"' % (texts[i], texts[i + 1]) for i in range(len(texts) - 1) if i != pos]
    if len(wrong) < 3: wrong += ['above "%s"' % texts[0], 'below "%s"' % texts[-1]]
    return mkq(rng, 4, 'Horizontal rules', 'Where does the browser draw the line across the page?', code, right, wrong, 'The line appears where the <code>hr</code> tag is written: %s.' % right,
               [ck(code, "var k=Array.prototype.map.call(d.body.children,function(e){return e.tagName});k.indexOf('HR')", pos + 1)], key='hrpos|' + code)

L4_FACTS = [
 ('Which tag makes text bold in this class?', '<code>&lt;strong&gt;</code>', ['<code>&lt;b&gt;</code>', '<code>&lt;bold&gt;</code>', '<code>&lt;em&gt;</code>'], 'Bold is always strong. Italics is always em.'),
 ('Which tag makes text italic in this class?', '<code>&lt;em&gt;</code>', ['<code>&lt;i&gt;</code>', '<code>&lt;italic&gt;</code>', '<code>&lt;strong&gt;</code>'], 'Italics is always em.'),
 ('Which tag starts a new line inside a paragraph?', '<code>&lt;br&gt;</code>', ['<code>&lt;lb&gt;</code>', '<code>&lt;newline&gt;</code>', '<code>&lt;hr&gt;</code>'], 'br is the line break.'),
 ('Which tag draws a line across the page?', '<code>&lt;hr&gt;</code>', ['<code>&lt;br&gt;</code>', '<code>&lt;line&gt;</code>', '<code>&lt;rule&gt;</code>'], 'hr is the horizontal rule.'),
 ('Does the <code>&lt;br&gt;</code> tag need a closing tag?', 'No: it stands alone', ['Yes: <code>&lt;/br&gt;</code>', 'Yes: <code>&lt;br&gt;&lt;/br&gt;</code>', 'Only inside a body'], 'br and hr stand alone.'),
 ('What is a span tag used for?', 'To style just a few words inside a line', ['To make a new paragraph', 'To draw a line', 'To start a new page'], 'A span marks a few words so you can style only them.'),
 ('A span has no style. What does it look like?', 'The same as the text around it', ['Bold', 'Red', 'Hidden'], 'A span does nothing by itself.'),
 ('Why does pressing Enter inside a paragraph not start a new line on the page?', 'The browser ignores the Enter key in code; you need a br tag', ['The page is broken', 'Paragraphs cannot have two lines', 'Enter only works in the head'], 'Only tags decide how the page looks.'),
 ('Which is the correct way to put bold words inside a paragraph?', '<code>&lt;p&gt;&lt;strong&gt;Hi&lt;/strong&gt;&lt;/p&gt;</code>', ['<code>&lt;p&gt;&lt;strong&gt;Hi&lt;/p&gt;&lt;/strong&gt;</code>', '<code>&lt;strong&gt;&lt;p&gt;Hi&lt;/strong&gt;&lt;/p&gt;</code>', '<code>&lt;p&gt;&lt;strong&gt;Hi&lt;/p&gt;</code>'], 'Close the inside tag first: the last tag opened is the first one closed.'),
]
L4_T = [l4_bold_words, l4_lines, l4_rules, l4_span, l4_nested, l4_hr_before]

# ====================================================================== LESSON 5: Google Fonts
FONTS = ['Pacifico', 'Lobster', 'Roboto', 'Open Sans', 'Lora', 'Playfair Display', 'Roboto Mono', 'Dancing Script', 'Bebas Neue', 'Space Mono']
def furl(n): return '<link href="https://fonts.googleapis.com/css2?family=%s&display=swap" rel="stylesheet">\n' % n.replace(' ', '+')
def l5_font_of(rng):
    a, b = rng.sample(FONTS, 2); tag = rng.choice(['h1', 'h2', 'p'])
    use_body = rng.random() < .5
    head = furl(a) + (furl(b) if use_body else '')
    inner = '<h1%s>%s</h1>\n<p>%s</p>\n' % (st("font-family: '%s'" % a), rng.choice(SHOPS), sentence(rng))
    code = page('Fonts', inner, head, st("font-family: '%s'" % b) if use_body else ''); must_parse(code)
    target = rng.choice(['h1', 'p']); nd = [n for n in walk(parse(code)) if n.tag == target][0]
    f = effective(nd, 'font-family'); name = f.strip("'") if f else 'the browser default font'
    names = {'h1': 'heading 1', 'p': 'paragraph'}
    wrong = [x for x in FONTS if x != name][:0] + rng.sample([x for x in FONTS if x != name], 2) + ['the browser default font']
    wrong = [w for w in wrong if w != name]
    why = 'The heading has its own <code>font-family</code>.' if target == 'h1' else ('The paragraph has none of its own, so it uses the body font.' if use_body else 'The paragraph has no font-family and the body has none either, so the browser default font is used. Loading a font in the head does not use it.')
    return mkq(rng, 5, 'Which font', 'Which font does the %s use?' % names[target], code, name, wrong, why,
               [ck(code, "getComputedStyle(d.querySelector('%s')).fontFamily.replace(/\"/g,'')" % target, name if f else 'Times New Roman' if False else None)] if f else [ck(code, "getComputedStyle(d.querySelector('%s')).fontFamily.indexOf('%s')<0 && getComputedStyle(d.querySelector('%s')).fontFamily.indexOf('%s')<0" % (target, a, target, b), True)], key='fontof|%s|%s|%s|%s' % (a, b, target, use_body))
def l5_quotes(rng):
    n = rng.choice([f for f in FONTS if ' ' in f])
    opts = {'good': "font-family: '%s'" % n, 'dq': 'font-family: "%s"' % n, 'colon': "font-family '%s'" % n, 'prop': "font-name: '%s'" % n, 'shorthand': "font: '%s'" % n}
    html_ = lambda v: '<h1 style="%s">Hi</h1>\n' % v
    pages = {k: pg(html_(v)) for k, v in opts.items()}
    js = "getComputedStyle(d.querySelector('h1')).fontFamily.replace(/\"/g,'')"
    chk = [ck(pages['good'], js, n)] + [dict(html=pages[k], js=js, expect={'not': n}) for k in ('dq', 'colon', 'prop', 'shorthand')]
    return mkq(rng, 5, 'Writing font-family', 'Which h1 tag uses the %s font correctly?' % n, None, C('<h1 style="%s">' % opts['good']), [C('<h1 style="%s">' % opts[k]) for k in ('dq', 'colon', 'prop')],
               'The font name goes in <b>single</b> quotes, because the style attribute already uses double quotes. The property is <code>font-family</code>, followed by a colon.', chk, key='quotes|' + n)
def l5_where(rng):
    n = rng.choice(FONTS); code = page('Fonts', '<h1>Hello</h1>\n', furl(n)); must_parse(code)
    return mkq(rng, 5, 'Loading fonts', 'This page loads the %s font in the head. What does the heading look like?' % n, code, 'It still uses the default font: the font is loaded but never used',
               ['It uses the %s font' % n, 'The page shows an error', 'It is empty'], 'Loading a font only downloads it. To use it you must write <code>font-family</code> in a style.',
               [ck(code, "getComputedStyle(d.querySelector('h1')).fontFamily.indexOf('%s')<0" % n, True)], key='loadonly|' + n)
def l5_count_fonts(rng):
    k = rng.randint(1, 3); names = rng.sample(FONTS, k); code = page('Fonts', '<h1>Hi</h1>\n', ''.join(furl(n) for n in names)); must_parse(code)
    return mkq(rng, 5, 'Loading fonts', 'How many Google fonts does the head load?', code, str(k), [str(x) for x in (k + 1, k + 2, max(0, k - 1), 0) if x != k], 'Each link line loads one font: %s.' % ', '.join(names),
               [ck(code, "d.querySelectorAll('link[href*=\"fonts.googleapis.com/css2\"]').length", k)], key='cf|%s' % names)
def l5_family(rng):
    cls = {'serif': ['Lora', 'Playfair Display'], 'sans-serif': ['Roboto', 'Open Sans'], 'monospace': ['Roboto Mono', 'Space Mono'], 'cursive': ['Pacifico', 'Dancing Script']}
    k = rng.choice(list(cls)); right = rng.choice(cls[k]); wrong = [rng.choice(cls[o]) for o in cls if o != k]
    why = {'serif': 'Serif fonts have little feet on the letters, like a book or newspaper.', 'sans-serif': 'Sans-serif fonts have no feet (sans means without) and look clean and modern.', 'monospace': 'Monospace fonts give every letter the same width, like typed code.', 'cursive': 'Cursive fonts are flowing and handwritten.'}[k]
    return mkq(rng, 5, 'Font families', 'Which of these is a %s font?' % k, None, right, wrong, why, [], key='fam|%s|%s' % (k, right))

L5_FACTS = [
 ('Where does the Google Fonts link go?', 'Inside the head', ['Inside the body', 'Inside the h1', 'Above the doctype'], 'The link goes in the head and downloads the font.'),
 ('Which tag loads a Google font?', '<code>&lt;link&gt;</code>', ['<code>&lt;font&gt;</code>', '<code>&lt;load&gt;</code>', '<code>&lt;style&gt;</code>'], 'Google gives you a link tag to paste in the head.'),
 ('Is loading a font the same as using it?', 'No: you must also write font-family in a style', ['Yes: the font is used automatically', 'Yes, but only for headings', 'Only if the link is in the body'], 'Loading downloads the font. font-family uses it.'),
 ('Why does a font name like Open Sans need quotes in <code>font-family</code>?', 'It has a space in the name', ['It is a long word', 'It has capital letters', 'It is a serif font'], 'Names with spaces need quotes. Use single quotes inside the double-quoted style.'),
 ('In a Google Fonts link, how is the space in Open Sans written?', 'As a plus sign: <code>Open+Sans</code>', ['As a dash', 'As an underscore', 'It cannot have a space'], 'The link writes the space as +.'),
 ('How many fonts do designers usually use on one page?', 'About 2 to 4', ['One for every word', 'More than ten', 'None'], 'Too many fonts make a page messy. Give each font a job.'),
 ('Which font job is a good match for a long paragraph?', 'An easy-to-read font', ['A fancy script font', 'A different font for every sentence', 'The biggest display font'], 'Long text needs simple letters. Script fonts are tiring to read.'),
 ('How can ONE word in a paragraph use a different font?', 'Put the word in a span with its own font-family', ['Use two paragraphs', 'Use a second head', 'Use a br tag'], 'A span can override the paragraph font for a few words.'),
 ('Where do you copy the font link from?', 'fonts.google.com, using Get embed code', ['A font file on your computer', 'The title tag', 'The body'], 'Google Fonts gives you the embed code.'),
]
L5_T = [l5_font_of, l5_quotes, l5_where, l5_count_fonts, l5_family]

# ====================================================================== LESSON 6: borders
BST = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge']
def l6_describe(rng):
    w = rng.choice([2, 3, 4, 5, 6, 8]); s = rng.choice(BST); c = rng.choice(COLORS); tag = rng.choice(['h1', 'h2', 'p'])
    if s == 'double' and w < 3: w = 4
    code = pg('<%s%s>%s</%s>\n' % (tag, st('border: %dpx %s %s' % (w, s, c)), rng.choice(SECTIONS), tag)); must_parse(code)
    ask = rng.choice(['style', 'thickness', 'color'])
    if ask == 'style': right = s; wrong = [x for x in BST if x != s]; q = 'What style of border does it have?'
    elif ask == 'thickness': right = '%d pixels' % w; wrong = ['%d pixels' % x for x in (w + 2, w + 4, max(1, w - 1), w * 2) if x != w]; q = 'How thick is the border?'
    else: right = c; wrong = [x for x in COLORS if x != c]; q = 'What color is the border?'
    wrong = rng.sample(wrong, 3)
    js = {'style': "getComputedStyle(d.querySelector('%s')).borderTopStyle" % tag, 'thickness': "getComputedStyle(d.querySelector('%s')).borderTopWidth" % tag, 'color': "getComputedStyle(d.querySelector('%s')).borderTopColor" % tag}[ask]
    ex = {'style': s, 'thickness': '%dpx' % w, 'color': RGB[c]}[ask]
    return mkq(rng, 6, 'Reading borders', q, code, right, wrong, 'The border style is written in 3 parts, in this order: <b>thickness</b>, <b>style</b>, <b>color</b>: %dpx %s %s.' % (w, s, c), [ck(code, js, ex)], key='bd|%s|%d|%s|%s|%s' % (ask, w, s, c, tag))
def l6_sides(rng):
    sides = rng.choice([['bottom'], ['top'], ['left'], ['right'], ['top', 'bottom'], ['left', 'right']]); tag = rng.choice(['h1', 'h2', 'p'])
    css = '; '.join('border-%s: 3px solid %s' % (s, rng.choice(COLORS)) for s in sides)
    code = pg('<%s%s>%s</%s>\n' % (tag, st(css), rng.choice(SECTIONS), tag)); must_parse(code)
    def lab(ss): return ' and '.join(ss) + ' only' if len(ss) > 1 else ss[0] + ' only'
    allopts = [['bottom'], ['top'], ['left'], ['right'], ['top', 'bottom'], ['left', 'right']]
    right = 'a line on the ' + lab(sides); wrong = ['a line on the ' + lab(o) for o in allopts if o != sides]; wrong = rng.sample(wrong, 2) + ['a line on all four sides']
    return mkq(rng, 6, 'Sides', 'Where does the browser draw a border line?', code, right, wrong, 'Writing <code>border-top</code>, <code>border-bottom</code>, <code>border-left</code> or <code>border-right</code> draws a line on just that side.',
               [ck(code, "var s=getComputedStyle(d.querySelector('%s'));['Top','Bottom','Left','Right'].filter(function(k){return s['border'+k+'Style']!='none'}).map(function(k){return k.toLowerCase()})" % tag, [x for x in ['top', 'bottom', 'left', 'right'] if x in sides])], key='sides|%s|%s' % (css, tag))
def l6_which_para(rng):
    sts = rng.sample(BST, 3); names = rng.sample(SECTIONS, 3); k = rng.randrange(3)
    body = ''.join('<p%s>%s</p>\n' % (st('border: %dpx %s black' % (4 if s != 'double' else 6, s)), n) for s, n in zip(sts, names)); code = pg(body); must_parse(code)
    return mkq(rng, 6, 'Reading borders', 'Which paragraph has a %s border?' % sts[k], code, E(names[k]), [E(n) for i, n in enumerate(names) if i != k] + ['None of them'], 'The paragraph "%s" is the one written with the %s style.' % (names[k], sts[k]),
               [ck(code, "Array.prototype.map.call(d.querySelectorAll('p'),function(e){return getComputedStyle(e).borderTopStyle})", sts)], key='wp|%s|%s' % (sts, names))
def l6_write(rng):
    w = rng.choice([2, 3, 4, 5]); s = rng.choice(['solid', 'dashed', 'dotted']); c = rng.choice(COLORS)
    good = '%dpx %s %s' % (w, s, c); bad = {'nounit': '%d %s %s' % (w, s, c), 'typo': '%dpx %s %s' % (w, s + 'x', c), 'semi': '%dpx; %s; %s' % (w, s, c), 'dash': '%dpx-%s-%s' % (w, s, c)}
    pages = {k: pg('<p style="border: %s">Hi</p>\n' % v) for k, v in dict(bad, good=good).items()}
    js = "getComputedStyle(d.querySelector('p')).borderTopStyle"
    chk = [ck(pages['good'], js, s)] + [dict(html=pages[k], js=js, expect='none') for k in bad]
    return mkq(rng, 6, 'Writing borders', 'Which style draws a %s, %d pixel, %s border?' % (s, w, c), None, C('border: ' + good), [C('border: ' + bad[k]) for k in ('nounit', 'typo', 'semi')],
               'The border style needs the unit px, a real border style name, and the parts separated by spaces (no semicolons or dashes between them).', chk, key='bw|%s' % good)
def l6_double(rng):
    code = pg('<p style="border: 6px double navy">Two lines</p>\n<p style="border: 6px solid navy">One line</p>\n')
    return mkq(rng, 6, 'Border styles', 'Which paragraph shows a border made of two lines?', code, 'The first paragraph (<code>double</code>)', ['The second paragraph (<code>solid</code>)', 'Both paragraphs', 'Neither paragraph'],
               'The <code>double</code> style draws two lines. It needs a thickness of at least 3px so both lines show.', [ck(code, "Array.prototype.map.call(d.querySelectorAll('p'),function(e){return getComputedStyle(e).borderTopStyle})", ['double', 'solid'])], key='dbl')

L6_FACTS = [
 ('In what order are the three parts of a border written?', 'Thickness, style, color', ['Color, style, thickness', 'Style, color, thickness', 'Color, thickness, style'], 'For example <code>3px solid red</code>.'),
 ('Which unit does the thickness of a border use?', 'px', ['mm', 'words', 'lines'], 'The thickness is a number followed by px.'),
 ('Which property draws a border on all four sides?', '<code>border</code>', ['<code>border-all</code>', '<code>box</code>', '<code>outline-4</code>'], 'border draws all four sides.'),
 ('Which property draws a line under a heading only?', '<code>border-bottom</code>', ['<code>border-under</code>', '<code>border-down</code>', '<code>underline</code>'], 'border-bottom draws only the bottom line.'),
 ('How many border styles are taught in this lesson?', 'Six', ['Two', 'Three', 'Twelve'], 'solid, dashed, dotted, double, groove and ridge.'),
 ('Which border style looks pressed in?', '<code>groove</code>', ['<code>ridge</code>', '<code>dotted</code>', '<code>solid</code>'], 'A groove looks pressed in. A ridge looks like it sticks out.'),
 ('Which border style looks like it sticks out?', '<code>ridge</code>', ['<code>groove</code>', '<code>dashed</code>', '<code>double</code>'], 'A ridge looks raised.'),
 ('Which border style is made of dots?', '<code>dotted</code>', ['<code>dashed</code>', '<code>double</code>', '<code>solid</code>'], 'dotted is dots; dashed is dashes.'),
 ('Can one heading have a border on the left side only?', 'Yes, with <code>border-left</code>', ['No, borders are always on all sides', 'Yes, but only on a paragraph', 'Only with a hex code'], 'Use the side property you want.'),
]
L6_T = [l6_describe, l6_sides, l6_which_para, l6_write, l6_double]

# ====================================================================== LESSON 7: images and the favicon
PICS = [('cat.png', 'A gray cat sleeping on a sofa'), ('rocket.png', 'A rocket launching at sunrise'), ('pizza.jpg', 'A pepperoni pizza on a plate'), ('team.jpg', 'The soccer team holding a trophy'), ('beach.png', 'Waves rolling onto a sandy beach'), ('robot.png', 'A friendly robot waving hello'), ('guitar.jpg', 'A red guitar leaning on a wall')]
SVG = 'data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23888%22/%3E%3C/svg%3E'
def realimg(h): return re.sub(r'src="https://example\.org/[^"]*"', 'src="%s"' % SVG, h)   # the browser check uses a real 300x200 picture so it does not depend on the network
def img(src, alt, style=''): return '<img src="https://example.org/%s" alt="%s"%s>' % (src, alt, st(style) if style else '')
def l7_count(rng):
    k = rng.randint(1, 4); pics = rng.sample(PICS, k); body = '<h1>%s</h1>\n' % rng.choice(SHOPS) + ''.join(img(s, a, 'width: 100px') + '\n<p>%s</p>\n' % sentence(rng) for s, a in pics); code = pg(body); must_parse(code)
    return mkq(rng, 7, 'Reading the code', 'How many pictures does this page have?', code, str(k), [str(x) for x in (k + 1, k + 2, max(0, k - 1), k + 3) if x != k], 'Each <code>img</code> tag is one picture: %d.' % k,
               [ck(code, "d.querySelectorAll('img').length", k)], key='ic|' + code)
def l7_width(rng):
    w = rng.choice([100, 150, 200, 250, 300, 400]); s, a = rng.choice(PICS); code = pg(img(s, a, 'width: %dpx' % w) + '\n'); must_parse(code)
    return mkq(rng, 7, 'Picture size', 'How wide is the picture on the page?', code, '%d pixels' % w, ['%d pixels' % x for x in (w + 50, w * 2, max(20, w - 50), w + 100) if x != w][:3], 'The style <code>width: %dpx</code> sets the width. The browser works out the height so the picture is not squished.' % w,
               [ck(realimg(code), "d.querySelector('img').getBoundingClientRect().width", w)], key='iw|%d|%s' % (w, s))
def l7_squish(rng):
    s, a = rng.choice(PICS); w, h_ = rng.choice([(300, 40), (200, 400), (100, 300), (400, 60)])
    bad = pg(img(s, a, 'width: %dpx; height: %dpx' % (w, h_)) + '\n'); good = pg(img(s, a, 'width: %dpx' % w) + '\n')
    return mkq(rng, 7, 'Picture size', 'Why will this picture look squished or stretched?', bad, 'Both a width AND a height are set, so the browser cannot keep the picture\'s natural shape', ['The alt text is too long', 'The src is missing', 'A width is never allowed on a picture'],
               'Set only ONE size (the width) and the browser works out the other so the picture keeps its shape.', [ck(realimg(bad), "var i=d.querySelector('img'),r=i.getBoundingClientRect();[r.width,r.height]", [w, h_]), ck(realimg(good), "var i=d.querySelector('img'),r=i.getBoundingClientRect();[r.width,r.height]", [w, round(w * 2 / 3)])], key='sq|%d|%d|%s' % (w, h_, s))
def l7_tag(rng):
    s, a = rng.choice(PICS)
    opts = {'good': '<img src="%s" alt="%s">' % (s, a), 'close': '<img src="%s" alt="%s"></img>' % (s, a), 'noattr': '<img "%s" "%s">' % (s, a), 'tag': '<image src="%s" alt="%s">' % (s, a), 'pic': '<picture src="%s" alt="%s">' % (s, a)}
    chk = [ck(pg(opts['good'] + '\n'), "d.querySelectorAll('img').length", 1)] + [dict(html=pg(opts[k] + '\n'), js="d.querySelectorAll('img[src]').length", expect=0 if k in ('noattr', 'pic') else 1) for k in ('noattr', 'pic')]
    chk = [chk[0]] + [chk[1]]
    return mkq(rng, 7, 'Writing images', 'Which line adds a picture correctly in this class?', None, C(opts['good']), [C(opts[k]) for k in ('close', 'noattr', 'tag')],
               'The tag is <code>img</code>, with <code>src</code> and <code>alt</code> attributes. It stands alone, with <b>no closing tag</b>.', chk, key='it|' + s)
def l7_src(rng):
    right = 'https://images.example.org/cat.png'
    return mkq(rng, 7, 'Web addresses', rng.choice(['Which src will work for everyone who visits the page?', 'Which picture address can a visitor on another computer load?']), None, C('src="%s"' % right), [C('src="C:\\Users\\me\\Pictures\\cat.png"'), C('src="cat.png"'), C('src="My Pictures"')],
               'A picture needs a real web address starting with <code>https://</code>. A file on your own computer has no web address. A bare file name only works if that file sits next to the page.', [], key='src')
def l7_alt(rng):
    s, a = rng.choice(PICS)
    good = a; bad = rng.choice(['image1', 'picture', 'photo', 'img', 'pic'])
    return mkq(rng, 7, 'Alt text', 'Which alt text is the best?', img(s, '...'), E(good), [E(bad), E(bad + '.png'), 'click here'], 'Good alt text says what is in the picture. Screen readers read it aloud and it shows if the picture cannot load.', [], key='alt|' + s + bad)
def l7_favicon(rng):
    n = rng.choice(['icon.png', 'logo.png', 'star.png']); code = page('My Site', '<h1>Hi</h1>\n', '<link rel="icon" href="https://example.org/%s">\n' % n); must_parse(code)
    return mkq(rng, 7, 'Favicon', 'What does the <code>link rel="icon"</code> tag in the head add?', code, 'A tiny picture on the browser tab', ['A big picture at the top of the page', 'A clickable link in the body', 'A new heading'],
               'That tag adds the favicon: the tiny picture beside the title on the browser tab.', [ck(code, "d.querySelector('head link[rel=icon]')!==null && d.querySelectorAll('body link').length==0", True)], key='fav|' + n)

L7_FACTS = [
 ('Which attribute holds the web address of a picture?', '<code>src</code>', ['<code>href</code>', '<code>alt</code>', '<code>url</code>'], 'src is the source address.'),
 ('Which attribute holds words that describe the picture?', '<code>alt</code>', ['<code>src</code>', '<code>width</code>', '<code>title</code>'], 'alt is the alternative text.'),
 ('Does the <code>img</code> tag need a closing tag?', 'No: it stands alone', ['Yes: <code>&lt;/img&gt;</code>', 'Yes: <code>&lt;img/img&gt;</code>', 'Only for large pictures'], 'img stands alone, like br and hr.'),
 ('Which style sets how wide a picture is?', '<code>width</code>', ['<code>wide</code>', '<code>size-x</code>', '<code>pixels</code>'], 'Use <code>width: 200px</code>.'),
 ('A picture has <code>width: 50%</code>. What does that mean?', 'It is half as wide as the space it sits in', ['It is 50 pixels wide', 'It is half the height', 'It is 50% see-through'], 'A percent is a share of the available width, so the picture grows and shrinks with the page.'),
 ('Where does the favicon link go?', 'Inside the head', ['Inside the body', 'Inside the h1', 'After the closing html tag'], 'Like the title and the font link, the favicon link lives in the head.'),
 ('What is the favicon?', 'The tiny picture on a browser tab', ['The page background', 'The biggest heading', 'A picture link in the footer'], 'It sits beside the title on the tab.'),
 ('Which sizes should you set on one picture to keep its natural shape?', 'Only the width (or only the height)', ['Both the width and the height', 'Neither: pictures cannot be sized', 'The font-size'], 'Setting both can squish or stretch the picture.'),
 ('Which file types can you upload as pictures in the Web Editor?', 'JPG, PNG, GIF and WEBP', ['Only Word documents', 'Only MP3 sounds', 'Only text files'], 'These are picture formats.'),
]
L7_T = [l7_count, l7_width, l7_squish, l7_tag, l7_src, l7_alt, l7_favicon]

# ====================================================================== LESSON 8: emojis and symbols
EMO = ['🍕', '🍔', '🍟', '🌮', '🍦', '⚽', '🎮', '🚀', '🎸', '🐶', '🌞', '🏆']
SYM = ['★', '→', '©', '™', '♥', '°']
def l8_shows(rng):
    shop = rng.choice(SHOPS); e = rng.choice(EMO); s = rng.choice(['★', '→', '♥'])
    text = '%s %s' % (shop, e); p = 'Friday at 6 %s bring friends' % s if s == '→' else 'We %s our fans' % s if s == '♥' else 'Rated 5 %s' % s
    code = pg('<h1>%s</h1>\n<p>%s</p>\n' % (text, p)); must_parse(code)
    return mkq(rng, 8, 'What shows', 'What does the page show?', code, lines_html([text, p]), [lines_html([shop, p]), lines_html([text]), lines_html([p, text])],
               'Emojis and symbols are <b>text characters</b>. They show on the page just like the letters beside them.', [ck(code, "d.body.innerText.split('\\n').map(function(s){return s.trim()}).filter(Boolean)", [text, p])], key='es|%s|%s' % (text, p))
def l8_count(rng):
    k = rng.randint(2, 7); s = rng.choice(['★', '♥']); code = pg('<p>Rating: %s</p>\n' % (s * k)); must_parse(code)
    return mkq(rng, 8, 'Counting', 'How many %s symbols does the page show?' % s, code, str(k), [str(x) for x in (k + 1, k - 1, k + 2, 1) if x != k and x > 0], 'Count the symbols between the tags: %d.' % k, [ck(code, "(d.querySelector('p').innerText.match(/%s/g)||[]).length" % s, k)], key='cnt|%s|%d' % (s, k))
def l8_size(rng):
    n = rng.choice([30, 40, 60, 80]); e = rng.choice(EMO); code = pg('<h1%s>Party %s</h1>\n' % (st('font-size: %dpx' % n), e)); must_parse(code)
    return mkq(rng, 8, 'Styling', 'The heading has <code>font-size: %dpx</code>. How big is the emoji?' % n, code, 'The same size as the letters: %d px' % n, ['Always the same small size', 'It cannot be changed', 'Twice the size of the letters'],
               'An emoji is text, so <code>font-size</code> changes it just like a letter.', [ck(code, "getComputedStyle(d.querySelector('h1')).fontSize", '%dpx' % n)], key='esz|%d|%s' % (n, e))
def l8_where(rng):
    e = rng.choice(EMO)
    return mkq(rng, 8, 'Where it goes', 'Where do you put an emoji in your code?', None, 'Between the opening and closing tags, with the other text', ['Inside the angle brackets of the tag', 'In the src attribute', 'In the head'],
               'An emoji is a text character, so it goes between the tags like a letter. Never inside a tag\'s angle brackets.', [], key='ew')
def l8_symbol(rng):
    d = [('the copyright sign', '©'), ('the trademark sign', '™'), ('a heart', '♥'), ('a degree sign', '°'), ('a right arrow', '→'), ('a solid star', '★')]
    nm, ch = rng.choice(d); wrong = [c for _, c in d if c != ch]
    return mkq(rng, 8, 'Symbols', 'Which character is %s?' % nm, None, ch, rng.sample(wrong, 3), 'Symbols are characters you copy and paste, like %s.' % ch, [], key='sym|' + nm)
def l8_text_or_pic(rng):
    e = rng.choice(EMO)
    return mkq(rng, 8, 'Text or picture', 'You paste %s into a heading. Do you need <code>src</code> or <code>alt</code>?' % e, None, 'No: it is a text character, not a picture', ['Yes: both src and alt are required', 'Yes: but only alt', 'Yes: but only src'],
               'An emoji is text. Only the <code>img</code> tag needs src and alt.', [], key='eto|' + e)
def l8_footer(rng):
    shop = rng.choice(SHOPS); code = pg('<p%s>© 2027 %s™</p>\n' % (st('text-align: center; font-size: 14px'), shop)); must_parse(code)
    return mkq(rng, 8, 'Footers', 'What does this footer line show?', code, lines_html(['© 2027 %s™' % shop]), [lines_html(['2027 %s' % shop]), lines_html(['(c) 2027 %s(tm)' % shop]), lines_html(['© 2027'])],
               'The symbols © and ™ are characters that show on the page. The style centers the line and makes it small.', [ck(code, "d.querySelector('p').innerText", '© 2027 %s™' % shop)], key='ft|' + shop)

L8_FACTS = [
 ('Is an emoji a picture file or a text character?', 'A text character', ['A picture file', 'A sound', 'A style'], 'An emoji is closer to the letter A than to a photograph.'),
 ('Which tag do you need to show an emoji?', 'None: just paste it between the tags', ['<code>&lt;img&gt;</code>', '<code>&lt;emoji&gt;</code>', '<code>&lt;link&gt;</code>'], 'It is text.'),
 ('How do you get an emoji into your code?', 'Copy it and paste it', ['Upload a picture', 'Draw it with a border', 'Type its src'], 'Copy and paste is the only skill you need.'),
 ('Which style makes an emoji bigger?', '<code>font-size</code>', ['<code>emoji-size</code>', '<code>width</code>', '<code>zoom</code>'], 'It is text, so font-size works.'),
 ('Where does a footer symbol like the copyright sign usually go?', 'In a small centered paragraph at the bottom', ['In the title tag', 'In the src', 'In a hr tag'], 'A footer line is small and centered.'),
 ('What is a symbol?', 'A character that is not a letter or number, like © or →', ['A kind of picture', 'A style property', 'A heading'], 'You find them the same way as emojis: copy and paste.'),
 ('Why is a pasted emoji better than a picture file when you can use either?', 'It loads instantly and never breaks', ['It is bigger', 'It always has a border', 'It needs no tag'], 'Text never fails to load.'),
 ('Can you put an emoji in a list item or a span?', 'Yes: it is text, so it works in any text', ['No: only in the title', 'No: only in headings', 'Only inside the head'], 'Emojis follow the text rules.'),
]
L8_T = [l8_shows, l8_count, l8_size, l8_where, l8_symbol, l8_text_or_pic, l8_footer]

# ====================================================================== LESSON 9: links
SITES = [('NASA', 'https://www.nasa.gov'), ('Wikipedia', 'https://www.wikipedia.org'), ('YouTube', 'https://www.youtube.com'), ('the weather page', 'https://www.weather.gov'), ('the library', 'https://www.loc.gov'), ('Mars photos', 'https://mars.nasa.gov')]
def l9_clickable(rng):
    nm, url = rng.choice(SITES); lead = rng.choice(['Visit', 'Read about', 'Look at', 'Learn from']); tail = rng.choice(['today.', 'for fun.', 'this week.', 'before class.'])
    code = pg('<p>%s <a href="%s" target="_blank">%s</a> %s</p>\n' % (lead, url, nm, tail)); must_parse(code)
    full = '%s %s %s' % (lead, nm, tail)
    return mkq(rng, 9, 'Reading links', 'Which words can a visitor click?', code, E(nm), [E(full), E(lead), E(tail)], 'Only the words between <code>&lt;a&gt;</code> and <code>&lt;/a&gt;</code> are the link.', [ck(code, "d.querySelector('a').innerText", nm)], key='cl|' + code)
def l9_dest(rng):
    (n1, u1), (n2, u2) = rng.sample(SITES, 2)
    code = pg('<p><a href="%s" target="_blank">%s</a> or <a href="%s" target="_blank">%s</a></p>\n' % (u1, n1, u2, n2)); must_parse(code)
    pick = rng.randrange(2); n, u = [(n1, u1), (n2, u2)][pick]; other = [u1, u2][1 - pick]
    wrong = [other] + [x for _, x in SITES if x not in (u1, u2)][:2]
    return mkq(rng, 9, 'Reading links', 'Where does the link "%s" go?' % n, code, C(u), [C(w) for w in wrong], 'The address is in the <code>href</code> attribute of that link.', [ck(code, "Array.prototype.map.call(d.querySelectorAll('a'),function(a){return a.getAttribute('href')})", [u1, u2])], key='dst|' + code)
def l9_newtab(rng):
    nm, url = rng.choice(SITES); kind = rng.choice(['_blank', 'none', '_self'])
    attr = {'_blank': ' target="_blank"', 'none': '', '_self': ' target="_self"'}[kind]
    code = pg('<p><a href="%s"%s>%s</a></p>\n' % (url, attr, nm)); must_parse(code)
    right = 'In a new tab' if kind == '_blank' else 'In the same tab'
    wrong = ['In the same tab' if kind == '_blank' else 'In a new tab', 'It does not open', 'In a pop-up window that cannot be closed']
    return mkq(rng, 9, 'Opening links', 'When a visitor clicks the link, where does it open?', code, right, wrong,
               '<code>target="_blank"</code> opens a new tab. With no target, or <code>target="_self"</code>, the link opens in the tab you are already in.', [ck(code, "d.querySelector('a').target||'none'", {'_blank': '_blank', 'none': 'none', '_self': '_self'}[kind])], key='nt|' + code)
def l9_image_link(rng):
    nm, url = rng.choice(SITES); s, a = rng.choice(PICS); inside = rng.random() < .7
    if inside: code = pg('<a href="%s" target="_blank">%s</a>\n' % (url, img(s, a, 'width: 150px')))
    else: code = pg('<a href="%s" target="_blank">%s</a>\n%s\n' % (url, nm, img(s, a, 'width: 150px')))
    must_parse(code)
    right = 'The picture' if inside else 'Only the words %s' % nm
    wrong = ['Only the words %s' % nm if inside else 'The picture', 'Nothing', 'The whole page']
    if inside: wrong = ['Nothing: pictures cannot be links', 'Only the alt text', 'The whole page']
    return mkq(rng, 9, 'Image links', 'What can a visitor click?', code, right, wrong, 'Whatever sits between the opening and closing a tags is the link. A picture inside the a tags is a clickable picture.',
               [ck(code, "Array.prototype.map.call(d.querySelectorAll('img'),function(i){return !!i.closest('a')})", [inside])], key='il|' + code)
def l9_defect(rng):
    nm, url = rng.choice(SITES); lead = 'Visit '
    D = {'src': ('The attribute is src instead of href', '<p>Visit <a src="%s" target="_blank">%s</a> today.</p>' % (url, nm), "d.querySelector('a').hasAttribute('href')", False),
         'noclose': ('The closing a tag is missing', '<p>Visit <a href="%s" target="_blank">%s today.</p>\n<p>Thanks for stopping by.</p>' % (url, nm), None, None),
         'nohttps': ('The address does not start with https://', '<p>Visit <a href="%s" target="_blank">%s</a> today.</p>' % (url.replace('https://', ''), nm), "new URL(d.querySelector('a').getAttribute('href'),'https://mysite.example/').host=='mysite.example'", True),
         'cross': ('The strong and a tags cross', '<p>Visit <a href="%s" target="_blank"><strong>%s</a></strong> today.</p>' % (url, nm), None, None)}
    key = rng.choice(list(D)); desc, body, js, ex = D[key]; code = pg(body + '\n')
    if key in ('noclose', 'cross'):
        try: parse(code); raise Skip('should not parse')
        except HtmlError: pass
    else: must_parse(code)
    wrong = [D[k][0] for k in D if k != key]
    chk = [ck(code, js, ex)] if js else ([ck(code, "d.querySelectorAll('a').length>0 && Array.prototype.some.call(d.querySelectorAll('a'),function(a){return a.innerText.indexOf('Thanks')>=0})", True)] if key == 'noclose' else [])
    return mkq(rng, 9, 'Finding the error', 'What is wrong with this link?', code, desc, wrong, 'A link needs <code>href</code> with a full <code>https://</code> address, a closing <code>&lt;/a&gt;</code>, and tags closed in the reverse order they were opened.', chk, key='ld|' + key + nm)
def l9_nest(rng):
    nm, url = rng.choice(SITES)
    good = '<a href="%s"><strong>%s</strong></a>' % (url, nm); bads = ['<a href="%s"><strong>%s</a></strong>' % (url, nm), '<strong><a href="%s">%s</strong></a>' % (url, nm), '<a href="%s"><strong>%s</strong>' % (url, nm)]
    return mkq(rng, 9, 'Nesting', 'Which is the correct way to make bold words a link?', None, C(good), [C(b) for b in bads], 'Close the inside tag first: the last tag opened is the first one closed.', [], key='ln|' + nm)

L9_FACTS = [
 ('Which tag makes a link?', '<code>&lt;a&gt;</code>', ['<code>&lt;link&gt;</code>', '<code>&lt;href&gt;</code>', '<code>&lt;go&gt;</code>'], 'The anchor tag a makes a link.'),
 ('Which attribute holds the address a link goes to?', '<code>href</code>', ['<code>src</code>', '<code>alt</code>', '<code>go</code>'], 'href stands for hypertext reference.'),
 ('What should a web address in href start with?', '<code>https://</code>', ['<code>www</code> only', '<code>C:\\</code>', 'a dot'], 'Leave off https:// and the browser looks for a file on your own site.'),
 ('Which attribute opens a link in a new tab?', '<code>target="_blank"</code>', ['<code>href="_blank"</code>', '<code>new="tab"</code>', '<code>open="new"</code>'], 'The underscore matters: <code>_blank</code>.'),
 ('When should a link open in a new tab?', 'When it leaves your website', ['Always, even inside your own site', 'Never', 'Only for pictures'], 'Links to other sites open in a new tab so visitors do not lose your page.'),
 ('Which link text is best?', 'NASA Mars photos', ['click here', 'this', 'link'], 'Say what is behind the link.'),
 ('What happens if you forget the closing <code>&lt;/a&gt;</code>?', 'The rest of the page becomes part of the link', ['Nothing', 'The link turns red', 'The page is deleted'], 'The browser does not know where the link ends.'),
 ('Can a whole heading be a link?', 'Yes: put the a tag around the heading text', ['No: only paragraphs', 'No: only pictures', 'Only the title'], 'Anything between the a tags becomes the link.'),
 ('Where are the attributes of a link written?', 'In the opening a tag only', ['In the closing tag only', 'In both tags', 'In the head'], 'The closing tag is always plain: <code>&lt;/a&gt;</code>.'),
 ('Is a link a block tag or an inline tag?', 'Inline: it stays inside the line', ['Block: it starts a new line', 'Neither', 'It depends on the browser'], 'Links sit inside sentences like words.'),
]
L9_T = [l9_clickable, l9_dest, l9_newtab, l9_image_link, l9_defect, l9_nest]

# ====================================================================== LESSON 10: lists
ITEMS = [['Tent', 'Sleeping bag', 'Flashlight', 'Water bottle', 'Snacks', 'Map'], ['Cheese', 'Pepperoni', 'Veggie', 'Sausage', 'Hawaiian', 'Plain'], ['Mix', 'Bake', 'Cool', 'Frost', 'Serve', 'Eat'], ['Home', 'About', 'Menu', 'Contact', 'Blog', 'Shop']]
def l10_count(rng):
    tag = rng.choice(['ul', 'ol']); items = rng.choice(ITEMS)[:rng.randint(2, 6)]
    code = pg('<%s>\n%s</%s>\n' % (tag, ''.join('<li>%s</li>\n' % i for i in items), tag)); must_parse(code)
    n = len(items)
    return mkq(rng, 10, 'Reading lists', 'How many items does the list have?', code, str(n), [str(x) for x in (n + 1, n - 1, n + 2, 1) if x != n and x > 0], 'Each <code>li</code> tag is one item: %d.' % n, [ck(code, "d.querySelectorAll('li').length", n)], key='lc|' + code)
def l10_which(rng):
    S = [('the steps to bake a cake', 'ol'), ('things to pack for a trip', 'ul'), ('a top 5 list of best songs', 'ol'), ('your favorite foods, in no order', 'ul'), ('a recipe with steps 1, 2, 3', 'ol'), ('the ingredients for a sandwich', 'ul'),
         ('a countdown from 10 to 1', 'ol'), ('a list of features of a phone', 'ul'), ('a race finish order', 'ol'), ('a grocery list', 'ul')]
    sc, ans = rng.choice(S)
    return mkq(rng, 10, 'Which list', 'Which tag should you use for %s?' % sc, None, '<code>&lt;%s&gt;</code>' % ans, ['<code>&lt;%s&gt;</code>' % ('ol' if ans == 'ul' else 'ul'), '<code>&lt;li&gt;</code> by itself', '<code>&lt;list&gt;</code>'],
               ('Order matters, so use an <b>ordered</b> list (numbers).' if ans == 'ol' else 'Order does not matter, so use an <b>unordered</b> list (bullets).'), [], key='lw|' + sc)
def l10_marker(rng):
    typ = rng.choice(['decimal', 'upper-roman', 'lower-roman', 'upper-alpha', 'lower-alpha']); n = rng.choice([2, 3, 4, 5]); items = rng.choice(ITEMS)[:5]
    code = pg('<ol%s>\n%s</ol>\n' % (st('list-style-type: ' + typ), ''.join('<li>%s</li>\n' % i for i in items))); must_parse(code)
    rom = ['I', 'II', 'III', 'IV', 'V']; mark = {'decimal': str(n), 'upper-roman': rom[n - 1], 'lower-roman': rom[n - 1].lower(), 'upper-alpha': 'ABCDE'[n - 1], 'lower-alpha': 'abcde'[n - 1]}
    right = mark[typ]; allv = [v for k, v in mark.items() if v != right]; wrong = list(dict.fromkeys(allv))[:3]
    words = {2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth'}[n]
    return mkq(rng, 10, 'Markers', 'What marker does the %s item show?' % words, code, right, wrong, 'The list uses <code>%s</code>, so item %d shows %s.' % (typ, n, right), [ck(code, "getComputedStyle(d.querySelector('ol')).listStyleType", typ)], key='mk|%s|%d|%s' % (typ, n, items[0]))
def l10_ul_style(rng):
    typ = rng.choice(['square', 'circle', 'none']); items = rng.choice(ITEMS)[:3]
    opts = {'good': 'style="list-style-type: %s"' % typ, 'bad1': 'style="list-style: %ss"' % typ, 'bad2': 'style="bullet-style: %s"' % typ, 'bad3': 'style="list-type = %s"' % typ}
    mk = lambda o, onli=False: pg('<ul%s>\n%s</ul>\n' % ('' if onli else ' ' + o, ''.join('<li%s>%s</li>\n' % (' ' + o if onli and i == 0 else '', t) for i, t in enumerate(items))))
    js = "Array.prototype.map.call(d.querySelectorAll('li'),function(e){return getComputedStyle(e).listStyleType})"
    chk = [ck(mk(opts['good']), js, [typ] * 3), dict(html=mk(opts['good'], True), js=js, expect={'not': [typ] * 3})] + [dict(html=mk(opts[k]), js=js, expect={'not': [typ] * 3}) for k in ('bad1', 'bad2')]
    what = {'square': 'square bullets', 'circle': 'round empty circles', 'none': 'no bullets at all'}[typ]
    return mkq(rng, 10, 'Markers', 'Which <code>ul</code> tag gives the whole list %s?' % what, None, C('<ul %s>' % opts['good']), [C('<ul %s>' % opts[k]) for k in ('bad1', 'bad2', 'bad3')],
               'The property is <code>list-style-type</code>, written on the <code>ul</code> or <code>ol</code> tag (not on each li).', chk, key='us|' + typ + items[0])
def l10_menu(rng):
    items = ['Home', 'About', 'Contact'][:rng.randint(3, 3)]
    full = pg('<ul%s>\n%s</ul>\n' % (st('list-style-type: none'), ''.join('<li%s>%s</li>\n' % (st('display: inline'), i) for i in items)))
    noinline = pg('<ul%s>\n%s</ul>\n' % (st('list-style-type: none'), ''.join('<li>%s</li>\n' % i for i in items)))
    nonone = pg('<ul>\n%s</ul>\n' % ''.join('<li%s>%s</li>\n' % (st('display: inline'), i) for i in items))
    js = "var l=Array.prototype.slice.call(d.querySelectorAll('li'));[l.every(function(x){return x.offsetTop==l[0].offsetTop}), getComputedStyle(d.querySelector('ul')).listStyleType]"
    chk = [ck(full, js, [True, 'none']), ck(noinline, js, [False, 'none']), ck(nonone, js, [True, 'disc'])]
    code = full
    return mkq(rng, 10, 'Menus', 'This page shows a menu in one row with no bullets. What makes that happen?', code, '<code>list-style-type: none</code> on the ul, and <code>display: inline</code> on every li',
               ['<code>list-style-type: none</code> on the ul only', '<code>display: inline</code> on every li only', '<code>display: block</code> on every li'], 'The ul style removes the bullets. Each li is a block (own line) until <code>display: inline</code> puts it in the line like a word.', chk, key='mn|' + str(items))
def l10_inline(rng):
    pairs = [('span', 'inline'), ('strong', 'inline'), ('em', 'inline'), ('a', 'inline'), ('p', 'block'), ('h1', 'block'), ('li', 'list-item'), ('div', 'block')]
    t, d = rng.choice(pairs[:6]); blocks = ['p', 'h1', 'li']
    kind = rng.choice(['inline', 'block'])
    if kind == 'inline': right = rng.choice(['span', 'strong', 'em', 'a']); wrong = rng.sample(blocks, 3)
    else: right = rng.choice(['p', 'h1', 'li']); wrong = rng.sample(['span', 'strong', 'em', 'a'], 3)
    code = pg('<p>text</p>\n<h1>head</h1>\n<ul><li>item</li></ul>\n<p><span>s</span><strong>b</strong><em>e</em><a href="https://www.nasa.gov">a</a></p>\n')
    js = "var m={};['p','h1','li','span','strong','em','a'].forEach(function(t){m[t]=getComputedStyle(d.querySelector(t)).display});m"
    exp = {'p': 'block', 'h1': 'block', 'li': 'list-item', 'span': 'inline', 'strong': 'inline', 'em': 'inline', 'a': 'inline'}
    return mkq(rng, 10, 'Block or inline', 'Which of these tags is %s?' % ('inline (it stays inside the line)' if kind == 'inline' else 'a block (it starts on a new line)'), None, '<code>&lt;%s&gt;</code>' % right, ['<code>&lt;%s&gt;</code>' % w for w in wrong],
               'Block tags (h1, p, ul, ol, li, hr) start on a new line and fill the width. Inline tags (span, strong, em, a, img) stay in the line like words.', [ck(code, js, exp)], key='bi|' + kind + right)
def l10_defect(rng):
    items = rng.choice(ITEMS)[:3]; tag = rng.choice(['ul', 'ol'])
    D = {'text': ('Words are typed straight inside the list, outside any li', '<%s>\nMore soon\n%s</%s>' % (tag, ''.join('<li>%s</li>\n' % i for i in items), tag)),
         'noclose': ('A closing li tag is missing', '<%s>\n<li>%s\n%s</%s>' % (tag, items[0], ''.join('<li>%s</li>\n' % i for i in items[1:]), tag)),
         'liout': ('An li is outside any list', '<%s>\n%s</%s>\n<li>%s</li>' % (tag, ''.join('<li>%s</li>\n' % i for i in items[:2]), tag, items[2])),
         'style': ('The list-style-type style is on one li instead of the list tag', '<%s>\n%s</%s>' % (tag, ''.join('<li%s>%s</li>\n' % (st('list-style-type: square') if j == 0 else '', i) for j, i in enumerate(items)), tag))}
    key = rng.choice(list(D)); desc, body = D[key]; code = pg(body + '\n')
    if key == 'noclose':
        try: parse(code); raise Skip('should parse-fail')
        except HtmlError: pass
    else: must_parse(code)
    chk = []
    if key == 'style': chk = [ck(code, "Array.prototype.map.call(d.querySelectorAll('li'),function(e){return getComputedStyle(e).listStyleType})", ['square', 'disc' if tag == 'ul' else 'decimal', 'disc' if tag == 'ul' else 'decimal'])]
    if key == 'liout': chk = [ck(code, "d.querySelectorAll('body > li').length", 1)]
    wrong = [D[k][0] for k in D if k != key]
    return mkq(rng, 10, 'Finding the error', 'What is wrong with this list?', code, desc, wrong, 'Only <code>li</code> tags go directly inside a ul or ol, every li needs its closing tag, every li must sit inside a list, and the marker style goes on the list tag.', chk, key='ldf|' + key + tag + items[0])

L10_FACTS = [
 ('Which tag is one item in a list?', '<code>&lt;li&gt;</code>', ['<code>&lt;item&gt;</code>', '<code>&lt;ul&gt;</code>', '<code>&lt;list&gt;</code>'], 'li is the list item.'),
 ('What do the letters in <code>ol</code> stand for?', 'Ordered list', ['Outer list', 'Open list', 'Only list'], 'ol is an ordered (numbered) list.'),
 ('What do the letters in <code>ul</code> stand for?', 'Unordered list', ['Upper list', 'Under list', 'Ultra list'], 'ul is an unordered (bulleted) list.'),
 ('Which tags may go directly inside a <code>ul</code>?', 'Only li tags', ['Only p tags', 'Any tag', 'Only h2 tags'], 'Only li tags go directly inside a ul or ol.'),
 ('What is the bullet or number in front of a list item called?', 'The marker', ['The border', 'The span', 'The head'], 'The marker is changed with list-style-type.'),
 ('Which marker values can an <code>ol</code> use?', 'decimal, upper-roman, lower-roman, upper-alpha, lower-alpha', ['disc, circle, square, none', 'bold, italic, plain', 'red, green, blue'], 'Numbers, roman numerals and letters belong to ol.'),
 ('Which marker values can a <code>ul</code> use?', 'disc, circle, square and none', ['decimal and upper-roman', 'A, B, C', 'red, green, blue'], 'Bullet shapes belong to ul.'),
 ('Where do you write <code>list-style-type</code> to change the markers of the whole list?', 'On the ul or ol tag', ['On every li tag', 'On the body tag only', 'In the title'], 'Write it once on the list tag.'),
 ('Which style makes the items of a menu sit side by side?', '<code>display: inline</code> on every li', ['<code>display: list</code>', '<code>float: sideways</code>', '<code>margin: 0</code>'], 'Inline tags flow like words.'),
 ('Is an li a block or an inline tag?', 'A block: each item starts on its own line', ['Inline: items flow like words', 'Neither', 'It depends on the marker'], 'That is why a list stacks.'),
]
L10_T = [l10_count, l10_which, l10_marker, l10_ul_style, l10_menu, l10_inline, l10_defect]

LESSON_T = {1: L1_T, 2: L2_T, 3: L3_T, 4: L4_T, 5: L5_T, 6: L6_T, 7: L7_T, 8: L8_T, 9: L9_T, 10: L10_T}
LESSON_FACTS = {1: L1_FACTS, 2: L2_FACTS, 3: L3_FACTS, 4: L4_FACTS, 5: L5_FACTS, 6: L6_FACTS, 7: L7_FACTS, 8: L8_FACTS, 9: L9_FACTS, 10: L10_FACTS}
TOPIC_NAMES = {1: 'The skeleton', 2: 'Style and color', 3: 'Size, align, case', 4: 'strong, em, br, hr, span', 5: 'Google Fonts', 6: 'Borders', 7: 'Images and favicon', 8: 'Emojis and symbols', 9: 'Links', 10: 'Lists and menus'}

def fact_q(rng, l, f):
    stem, right, wrong, why = f
    return mkq(rng, l, 'Concepts', stem, None, right, wrong, why, [], key='fact|%d|%s' % (l, stem))

def make(l, rng, tries=60):
    """one random question of lesson l: a template (70%) or a concept fact (30%)"""
    for _ in range(tries):
        try:
            if rng.random() < 0.3 or not LESSON_T[l]: return fact_q(rng, l, rng.choice(LESSON_FACTS[l]))
            return rng.choice(LESSON_T[l])(rng)
        except Skip: continue
    raise RuntimeError('could not make a question for lesson %d' % l)
