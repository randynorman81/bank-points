"""Question generator for IST Unit 6 (Bootstrap): lessons 22-27 = 6.1-6.6. Game bank, practice test and study-guide questions all come from here.
Every question carries `chk`: a page that loads the pinned Bootstrap 5.3.9 stylesheet (served from tools/bs6/), a JS expression and the expected value, confirmed in REAL Chrome by tools/ist/qcheck.mjs
(`w` = the window width, so phone and laptop layouts are both measured). The shown code is the body of index.html; `p` is the page with the real CDN link that the preview shows."""
import sys, os, re, html, random
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'ist'))
import qgen
from qgen import mkq, Skip, E
LOCAL = 'http://localhost:8124/tools/bs6/bootstrap-5.3.9.min.css'
CDN = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css'
BSLINK = '<link href="%s" rel="stylesheet">' % CDN
WORDS = ['Pizza', 'Tacos', 'Salad', 'Soup', 'Bread', 'Cake', 'Juice', 'Pasta', 'Fries', 'Rice', 'Wings', 'Pie', 'Music', 'Games', 'Art', 'Sports']
THEME = {'primary': ('blue', 'rgb(13, 110, 253)'), 'secondary': ('gray', 'rgb(108, 117, 125)'), 'success': ('green', 'rgb(25, 135, 84)'), 'danger': ('red', 'rgb(220, 53, 69)'), 'warning': ('yellow', 'rgb(255, 193, 7)'), 'info': ('light blue', 'rgb(13, 202, 240)')}
BGTHEME = dict(THEME); BGTHEME.update({'light': ('very light gray', 'rgb(248, 249, 250)'), 'dark': ('almost black', 'rgb(33, 37, 41)')})
def ck6(h, js, expect, w=None):
    d = dict(html=h, js=js, expect=expect)
    if w: d['w'] = w
    return d
def check_page(body, head='', w=None): return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title><link rel="stylesheet" href="%s">%s</head><body>%s</body></html>' % (LOCAL, head, body)
def pagehtml(body): return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Page</title>%s</head><body>%s</body></html>' % (BSLINK, body)
def Q6(rng, lesson, topic, stem, body, right, wrong, why, chk, key=None):
    q = mkq(rng, lesson, topic, stem, body, right, wrong, why, chk, key=key)
    if body is not None: q['p'] = pagehtml(body)
    return q
def cs(sel, prop): return "W.getComputedStyle(d.querySelector(%s))['%s']" % (repr(sel), prop)
def tag(t, text, cls=None, extra=''): return '<%s%s%s>%s</%s>' % (t, (' class="%s"' % cls) if cls else '', extra, text, t)
COLS = "Array.prototype.map.call(d.querySelectorAll('.row > *'), function(e){return e.getBoundingClientRect()})"
LEFTS = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.row > *'),function(e){t[Math.round(e.getBoundingClientRect().left)]=1});return Object.keys(t).length})()"
TOPS = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.row > *'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
def grid(widths, cls_fn=None, words=None, md=False):
    import random as _r
    ws = words or _r.sample(['Menu', 'News', 'Photos', 'Prices', 'Maps', 'Music', 'Games', 'Links', 'Shop', 'Help', 'Blog', 'Team'], 6)
    cl = ['col-md-%d' % w if md else 'col-%d' % w for w in widths]
    return '<div class="container">\n<div class="row">\n' + '\n'.join('<div class="%s">%s</div>' % (c, ws[i]) for i, c in enumerate(cl)) + '\n</div>\n</div>'
# ==================================================================================================== 6.1 setting up (22)
def a_link(rng):
    right = BSLINK
    wr = [BSLINK.replace('bootstrap.min.css', 'bootstrap.min.cs'), BSLINK.replace('rel="stylesheet"', 'rel="stylsheet"'), BSLINK.replace('https://', 'http://'), BSLINK.replace('jsdelivr', 'jsdeliver'), BSLINK.replace('<link', '<style')]
    wrong = rng.sample(wr, 3); w = rng.choice(WORDS)
    def pg(l):
        ok = bool(re.match(r'<link\b', l) and 'rel="stylesheet"' in l and re.search(r'href="https://cdn\.jsdelivr\.net/npm/bootstrap@5\.\d+\.\d+/dist/css/bootstrap(\.min)?\.css"', l))
        return '<!DOCTYPE html><html><head><title>t</title>%s</head><body><h1>%s</h1></body></html>' % (('<link rel="stylesheet" href="%s">' % LOCAL) if ok else '', w)
    js = cs('h1', 'fontWeight')
    chk = [ck6(pg(right), js, '500')] + [ck6(pg(x), js, '700') for x in wrong]
    return mkq(rng, 22, 'The link tag', 'The page has the heading <h1>%s</h1>. Which link tag loads Bootstrap into it? Pick the one that really changes the heading.' % w, None, '<code>%s</code>' % E(right), ['<code>%s</code>' % E(x) for x in wrong],
               'A working Bootstrap link is a <b>link</b> tag with <b>rel="stylesheet"</b> and the exact https:// address of Bootstrap\'s css file. Bootstrap changes the heading from bold (700) to a lighter weight (500).', chk)
def a_order(rng):
    c1 = rng.choice(['tomato', 'teal', 'crimson', 'darkgreen', 'purple']); w = rng.choice(WORDS)
    own = 'h1 { color: %s; }' % c1
    def pg(order):
        s = {'bs': '<link rel="stylesheet" href="%s">' % LOCAL, 'own': '<style>%s</style>' % own}
        return '<!DOCTYPE html><html><head><title>t</title>%s</head><body><h1>%s</h1></body></html>' % (''.join(s[k] for k in order), w)
    first = rng.random() < .5
    stem = 'Your style.css has `h1 { color: %s; }` for the heading "%s". Which order of the two links makes the heading %s?' % (c1, w, c1)
    right = 'Bootstrap first, then style.css'; wrong = ['style.css first, then Bootstrap', 'The order never matters', 'Only one of the two files can be linked']
    js = cs('h1', 'color'); rgb = {'tomato': 'rgb(255, 99, 71)', 'teal': 'rgb(0, 128, 128)', 'crimson': 'rgb(220, 20, 60)', 'darkgreen': 'rgb(0, 100, 0)', 'purple': 'rgb(128, 0, 128)'}[c1]
    return mkq(rng, 22, 'Link order', stem, None, right, wrong, 'When two rules are equally specific, the one that comes <b>last</b> wins. Bootstrap also colors headings, so your own file must come under it.', [ck6(pg(['bs', 'own']), js, rgb), ck6(pg(['own', 'bs']), js, {'not': rgb})])
def a_changes(rng):
    w = rng.choice(WORDS); body = '<h2>%s</h2>\n<p>Fresh every day.</p>' % w
    on = rng.random() < .5
    pg = '<!DOCTYPE html><html><head><title>t</title>%s</head><body>%s</body></html>' % (('<link rel="stylesheet" href="%s">' % LOCAL) if on else '', body)
    right = 'The heading and paragraph look different from the plain browser style' if on else 'They keep the plain browser style (a serif font)'
    wrong = [x for x in ('The heading and paragraph look different from the plain browser style', 'They keep the plain browser style (a serif font)', 'The page shows an error', 'Only the heading changes') if x != right][:3]
    js = cs('p', 'fontFamily')
    ff = "system-ui" if on else "Times"
    q = mkq(rng, 22, 'Before and after', 'The page has a heading 2 and a paragraph. %s What do they look like?' % ('The head holds the Bootstrap link.' if on else 'The head has no Bootstrap link.'), '<head>\n<title>Page</title>\n%s</head>\n<body>\n%s\n</body>' % ('<link href="..." rel="stylesheet">\n' if on else '', body), right, wrong,
            'The moment the link is added, plain tags like paragraphs and headings change font and spacing, even before you add a single class.', [ck6(pg, "W.getComputedStyle(d.querySelector('p')).fontFamily.indexOf('system-ui') > -1", on)])
    return q
L22_T = [a_link, a_order, a_changes]
L22_FACTS = [
 ('What is Bootstrap?', 'A CSS framework: a giant pre-written stylesheet full of ready-made classes', ['A programming language', 'A web browser', 'A kind of image file'], 'You add the right class name to a tag and Bootstrap\'s styles apply automatically.'),
 ('Where does the Bootstrap link tag go?', 'Inside the head', ['Inside the body', 'At the very bottom of the page', 'Inside a style attribute'], 'It loads a stylesheet, so it goes in the head like your own style.css link.'),
 ('What is a CDN?', 'A network of servers that hosts files (like Bootstrap) so you only link to them', ['A kind of CSS rule', 'A tag that stands alone', 'A browser setting'], 'Content Delivery Network: you do not upload Bootstrap, you link to the address it publishes.'),
 ('Does the Bootstrap link tag need a closing tag?', 'No. It stands alone, like every link tag', ['Yes, a closing link tag', 'Only in the body', 'Yes, if it has an integrity attribute'], 'A link tag never has a closing tag.'),
 ('The classes do nothing on your page. What do you check first?', 'That the Bootstrap link is in the head', ['That the body has a title', 'That every class has a dot in front', 'That the paragraph is closed'], 'If Bootstrap classes seem to do nothing, check the head for the link tag first.'),
 ('You want your own rule to beat one of Bootstrap\'s. Where do you put your style.css link?', 'Under the Bootstrap link', ['Above the Bootstrap link', 'In the body', 'Nowhere: Bootstrap cannot be changed'], 'When two rules are equally specific, the later one wins.'),
 ('Can a Bootstrap class and a class you wrote yourself be on the same tag?', 'Yes, both can live in the same class attribute', ['No, only one class per tag', 'Only on headings', 'Only if the Bootstrap class comes first and has a dot'], 'Classes are just names: Bootstrap\'s and yours work together.'),
 ('Which version of Bootstrap does this course use?', '5.3.9', ['2.0', '3.1', '9.0'], 'The link in the course has bootstrap@5.3.9 in its address.'),
 ('What do the optional integrity and crossorigin attributes on the official link do?', 'They are extra safety attributes; the short link works the same', ['They make the page load faster', 'They are required or nothing is styled', 'They load the JavaScript'], 'The short link without them works exactly the same in this course.'),
 ('What changes the moment the Bootstrap link is added, with no classes yet?', 'Plain tags like headings, paragraphs and links look different', ['Nothing changes at all', 'The page turns into a grid', 'Every tag gets a border'], 'Bootstrap restyles the defaults too.'),
]
# ==================================================================================================== 6.2 the grid (23)
def b_across(rng):
    pat = rng.choice([[6, 6], [4, 4, 4], [3, 3, 3, 3], [4, 8], [3, 6, 3], [2, 8, 2], [6, 3], [8, 6]]); body = grid(pat); n = len(pat); total = sum(pat)
    rows_ = 1 if total <= 12 else 2
    return Q6(rng, 23, 'The grid', 'The row holds columns of %s. How many lines (rows of columns) do they make on a laptop screen?' % ', '.join('col-%d' % p for p in pat), body, str(rows_), [x for x in ('1', '2', '3', str(n)) if x != str(rows_)][:3],
        'A row has 12 columns. These add up to %d%s.' % (total, ', so they fit on one line' if total <= 12 else ', which is more than 12, so the last column drops to a new line'), [ck6(check_page(body), TOPS, rows_, 1000)])
def b_ratio(rng):
    pat = rng.choice([[3, 6, 3], [2, 8, 2], [4, 8], [2, 4, 6], [3, 9], [1, 11]]); body = grid(pat)
    i, j = rng.sample(range(len(pat)), 2)
    if pat[i] < pat[j]: i, j = j, i
    if pat[i] % pat[j]: raise Skip('ratio')
    r = pat[i] // pat[j]
    names = ['first', 'second', 'third']
    return Q6(rng, 23, 'Column widths', 'How many times as wide is the %s column as the %s column?' % (names[i], names[j]), body, str(r), [x for x in ('1', '2', '3', '4', '5', '6', '11') if x != str(r)][:3],
        'The numbers say how many of the 12 columns each one takes: %d and %d, so one is %d times the other.' % (pat[i], pat[j], r),
        [ck6(check_page(body), "(function(){var c=%s;return Math.round(100*c[%d].width/c[%d].width)/100})()" % (COLS, i, j), float(r), 1000)])
def b_responsive(rng):
    pat = rng.choice([[6, 6], [4, 4, 4], [3, 3, 3, 3], [4, 8], [3, 9]]); body = grid(pat, md=True); phone = rng.random() < .5
    n = len(pat); w = 400 if phone else 1000; val = n if phone else 1
    return Q6(rng, 23, 'col-md', 'The columns use %s. How many lines do they make on %s?' % (', '.join('col-md-%d' % p for p in pat), 'a phone (400 pixels wide)' if phone else 'a laptop (1000 pixels wide)'), body, str(val), [x for x in ('1', '2', '3', '4', '5') if x != str(val)][:3],
        'A col-md-N column only takes its share of the 12 columns on medium screens (768 pixels) and wider. On a phone each column is the full width and they stack.' if phone else 'On a medium screen or wider (768 pixels and up) the col-md columns take their share of the 12 columns, so they sit side by side.', [ck6(check_page(body), TOPS, val, w)])
def b_plain(rng):
    k = rng.randint(2, 4); ws = ['A', 'B', 'C', 'D']
    body = '<div class="container">\n<div class="row">\n' + '\n'.join('<div class="col">%s</div>' % ws[i] for i in range(k)) + '\n</div>\n</div>'
    return Q6(rng, 23, 'Plain col', 'A row holds %d divs that all use the plain class col. How do they share the row?' % k, body, 'Equally: each is 1/%d of the width' % k, ['Only the first one is visible', 'Each takes 6 of the 12 columns', 'They stack, one per line'],
        'Plain col (no number) splits the leftover space evenly among however many you use.',
        [ck6(check_page(body), "(function(){var c=%s;return c.every(function(r){return Math.abs(r.width-c[0].width)<1})&&c.length==%d})()" % (COLS, k), True, 1000)])
def b_missing(rng):
    pat = rng.choice([[6, 6], [4, 4, 4], [3, 9]]); good = grid(pat)
    if rng.random() < .5:
        bad_ = good.replace('<div class="row">', '<div>')
        js = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('[class^=col]'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
        return Q6(rng, 23, 'Nesting', 'The page has the container and the columns, but no row div between them. What happens on a laptop screen?', bad_, 'The columns stack instead of sitting side by side', ['Nothing changes', 'The columns are twice as wide', 'The page shows an error'],
                  'Columns only line up inside a row. Skip the row and each col div is just a block that takes its own line.', [ck6(check_page(bad_), js, len(pat), 1000)])
    bad_ = good.replace('<div class="container">', '<div>')
    return Q6(rng, 23, 'Nesting', 'The page has the row and the columns, but no container div around them. Where does the content start?', bad_, 'Right at the left edge of the screen, with no side margin', ['Centered with a wide margin', 'In the middle of the screen', 'Below the page'],
              'The container centers your content and gives it side padding. Without it the row stretches to the edges.', [ck6(check_page(bad_), "Math.round(d.querySelector('.row').getBoundingClientRect().left) <= 8", True, 1000)])
L23_T = [b_across, b_ratio, b_responsive, b_plain, b_missing]
L23_FACTS = [
 ('How many columns does every Bootstrap row have?', '12', ['10', '6', '100'], 'Every row is divided into 12 columns, and each col-N takes N of them.'),
 ('What are the three nested pieces of the Bootstrap grid, in order?', 'container, row, col', ['col, row, container', 'row, container, col', 'container, col, row'], 'The container wraps rows, and rows hold columns.'),
 ('What does the container class do?', 'Centers the content and adds side padding, with a maximum width', ['Starts a new row', 'Makes a column', 'Colors the page'], 'It is the wrapper for everything in the grid.'),
 ('Two columns, col-6 and col-6, sit in a row. What do they do?', 'Sit side by side, each taking half the row', ['Stack on top of each other', 'Overlap', 'Take a third of the row each'], '6 + 6 = 12, a full row.'),
 ('What does the plain class col (no number) do?', 'Splits the leftover space evenly among the columns you use', ['Makes a column 12 wide', 'Hides the column', 'Starts a new row'], 'Plain col shares the row equally.'),
 ('What does col-md-6 mean?', '6 columns wide on medium screens and up, full width (stacked) on phones', ['Always 6 columns wide', '6 columns on phones only', 'Medium-sized text'], 'The md part is the breakpoint: 768 pixels.'),
 ('Three columns of col-4 fill the row. Why?', '4 + 4 + 4 = 12', ['Each col-4 is 4 pixels wide', 'The row has 4 columns', 'Bootstrap guesses'], 'The numbers add up to the 12 columns of a row.'),
 ('What happens when the columns in a row add up to more than 12?', 'The extra column wraps to a new line', ['An error appears', 'The columns shrink to fit', 'The row is deleted'], 'A row only has 12 columns.'),
 ('Where does a column (a div with a col class) go?', 'Inside a row', ['Directly inside the body', 'Inside the head', 'Outside the container'], 'The grid always nests container, row, col.'),
 ('Why do layouts built with col-md classes work on phones without extra work?', 'The columns stack to full width below the breakpoint', ['Phones ignore classes', 'Bootstrap deletes the extra columns', 'The browser turns them into images'], 'That is the point of the responsive classes.'),
]
# ==================================================================================================== 6.3 typography, colors, buttons (24)
def c_text_color(rng):
    k = rng.choice(list(THEME)); w = rng.choice(WORDS); body = tag('p', w, 'text-' + k); name, rgb = THEME[k]
    return Q6(rng, 24, 'Text colors', 'The paragraph has the class `text-%s`. What color is the text?' % k, body, name, [THEME[x][0] for x in THEME if x != k][:3], '<b>text-%s</b> colors text with Bootstrap\'s %s theme color, which is %s.' % (k, k, name), [ck6(check_page(body), cs('p', 'color'), rgb)])
def c_bg(rng):
    k = rng.choice(list(BGTHEME)); w = rng.choice(WORDS); body = tag('p', w, 'bg-%s p-3' % k); name, rgb = BGTHEME[k]
    return Q6(rng, 24, 'Background colors', 'The paragraph has the classes `bg-%s p-3`. What color is the box behind the words?' % k, body, name, [BGTHEME[x][0] for x in BGTHEME if x != k][:3], '<b>bg-%s</b> sets the background to the theme color %s. The p-3 adds padding so you can see the box.' % (k, name), [ck6(check_page(body), cs('p', 'backgroundColor'), rgb)])
def c_button(rng):
    k = rng.choice(list(THEME)); w = rng.choice(['Join', 'Play', 'Buy', 'Send', 'Save', 'Quit']); name, rgb = THEME[k]
    right = '<button class="btn btn-%s">%s</button>' % (k, w); alts = ['<button class="btn-%s">%s</button>' % (k, w), '<button class="btn">%s</button>' % w, '<button class="button-%s">%s</button>' % (k, w), '<button class="btn btn-%s">%s</button>' % (rng.choice([x for x in THEME if x != k]), w)]
    wrong = rng.sample(alts, 3)
    js = cs('button', 'backgroundColor')
    chk = [ck6(check_page(right), js, rgb)] + [ck6(check_page(x), js, {'not': rgb}) for x in wrong]
    return mkq(rng, 24, 'Buttons', 'Which code makes a %s button that says %s?' % (name, w), None, '<code>%s</code>' % E(right), ['<code>%s</code>' % E(x) for x in wrong],
               'A Bootstrap button needs <b>btn</b> plus one theme color class. btn alone has no color, and a color class alone is not enough.', chk)
def c_bold_center(rng):
    which = rng.choice(['fw-bold', 'text-center', 'text-muted']); w = rng.choice(WORDS); body = tag('p', w, which)
    right = {'fw-bold': 'Bold text', 'text-center': 'Centered text', 'text-muted': 'Lighter gray text'}[which]
    exp = {'fw-bold': ("W.getComputedStyle(d.querySelector('p')).fontWeight", '700'), 'text-center': ("W.getComputedStyle(d.querySelector('p')).textAlign", 'center'), 'text-muted': ("W.getComputedStyle(d.querySelector('p')).color", 'rgba(33, 37, 41, 0.75)')}[which]
    return Q6(rng, 24, 'Utilities', 'The paragraph has the class `%s`. What does it do?' % which, body, right, [x for x in ('Bold text', 'Centered text', 'Lighter gray text', 'A red background') if x != right][:3], '<b>%s</b>: %s.' % (which, right.lower()), [ck6(check_page(body), exp[0], exp[1])])
def c_white(rng):
    w = rng.choice(WORDS); k = rng.choice(['dark', 'primary', 'danger']); with_ = rng.random() < .5
    body = tag('p', w, 'bg-%s p-3%s' % (k, ' text-white' if with_ else ''))
    right = 'White' if with_ else 'Dark (almost black)'
    return Q6(rng, 24, 'text-white', 'The paragraph has the classes `bg-%s p-3%s`. What color are the words?' % (k, ' text-white' if with_ else ''), body, right, [x for x in ('White', 'Dark (almost black)', 'The same color as the background', 'Yellow') if x != right][:3],
        'bg-%s only sets the background, never the text color. Add text-white to get white words.' % k, [ck6(check_page(body), cs('p', 'color'), 'rgb(255, 255, 255)' if with_ else 'rgb(33, 37, 41)')])
def c_space(rng):
    a, b = rng.sample([1, 2, 3, 4, 5], 2); body = '<p class="bg-info p-%d">First</p>\n<p class="bg-warning p-%d">Second</p>' % (a, b)
    right = 'The first one' if a > b else 'The second one'
    return Q6(rng, 24, 'Spacing', 'Which paragraph has more space inside its colored box?', body, right, [x for x in ('The first one', 'The second one', 'They are the same', 'Neither has any') if x != right][:3],
        'p-N is padding on all four sides, and a bigger number means more space (p-%d beats p-%d).' % (max(a, b), min(a, b)), [ck6(check_page(body), "(function(){var p=d.querySelectorAll('p');return parseFloat(W.getComputedStyle(p[0]).paddingTop)>parseFloat(W.getComputedStyle(p[1]).paddingTop)})()", a > b)])
L24_T = [c_text_color, c_bg, c_button, c_bold_center, c_white, c_space]
L24_FACTS = [
 ('What is a utility class?', 'A small class that does one styling job and can be combined with others', ['A class that only works on buttons', 'A tag in the head', 'A rule in style.css'], 'You combine utility classes on one tag.'),
 ('Which class makes text bold?', 'fw-bold', ['text-bold', 'bold', 'btn-bold'], 'fw stands for font weight.'),
 ('Which class centers text?', 'text-center', ['center', 'fw-center', 'bg-center'], 'It does what text-align: center does.'),
 ('A button needs which classes?', 'btn plus a theme color class like btn-primary', ['Only btn', 'Only btn-primary', 'button and primary'], 'btn alone has padding but no color, so it looks like plain text.'),
 ('Which tags can wear a btn class?', 'Both button and a (link) tags', ['Only button', 'Only a', 'Only div'], 'A link styled as a button is still a link underneath.'),
 ('Which of these is NOT one of Bootstrap\'s six theme colors used in this lesson?', 'purple', ['primary', 'danger', 'info'], 'The six are primary, secondary, success, danger, warning and info.'),
 ('Which class sets a background color from the theme?', 'bg-primary', ['background-primary', 'text-primary', 'btn-bg'], 'bg- classes color the background; text- classes color the words.'),
 ('A dark box has the class bg-dark. What else does it need so the words can be read?', 'text-white', ['bg-light', 'text-dark', 'Nothing'], 'bg-dark only sets the background.'),
 ('What does p-3 do?', 'Adds padding on all four sides', ['Makes the text 3 pixels', 'Adds a margin on the top', 'Makes the paragraph the third in the row'], 'p means padding; m means margin.'),
 ('What does mb-3 do?', 'Adds margin at the bottom', ['Makes the text bold', 'Adds padding at the bottom', 'Moves the element 3 pixels left'], 'mb means margin-bottom; the number is the size.'),
 ('What does mt-3 do?', 'Adds margin at the top', ['Adds padding at the top', 'Makes the text muted', 'Adds three columns'], 'mt means margin-top.'),
]
