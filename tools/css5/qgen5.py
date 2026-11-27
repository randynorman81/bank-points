"""Question generator for IST Unit 5 (CSS): lessons 16-21 = 5.1-5.6. Game bank, practice test and study-guide check questions all come from here.
Every question carries `chk`: pages (CSS already inlined) plus a JS expression, confirmed in REAL Chrome by tools/ist/qcheck.mjs. The shown code is the two files (style.css and the body of index.html);
`p` is the page the browser preview shows. For "which rule works" questions EVERY option page is checked (only the right option may give the expected result).
Pseudo-classes: the check pages swap :hover/:focus/:active for the classes __hov/__foc/__act (same specificity), and the JS adds the class, so the real browser decides.
usage: imported by gen_bank5.py"""
import sys, os, re, html, random
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'ist'))
import qgen
from qgen import mkq, Skip, ck, RGB, COLORS, E
CLASSES = ['warn', 'note', 'big', 'card', 'sale', 'hot', 'intro', 'tip', 'alert', 'menu', 'special', 'quote']
IDS = ['logo', 'banner', 'hero', 'top', 'footer', 'winner', 'vip', 'title', 'main', 'signup']
WORDS = ['Pizza', 'Tacos', 'Salad', 'Soup', 'Bread', 'Cake', 'Juice', 'Pasta', 'Fries', 'Rice', 'Wings', 'Pie']
SENT = ['Fresh every day.', 'Open until nine.', 'Try the new one.', 'Ask at the counter.', 'Made by hand.', 'Free for kids.', 'Come back soon.', 'Best seller.', 'Limited time.', 'New this week.']
DARK = ['navy', 'teal', 'maroon', 'indigo', 'purple', 'green', 'brown', 'crimson', 'tomato', 'orange', 'gold', 'coral']
SHOW = ['red', 'blue', 'green', 'purple', 'orange', 'teal', 'navy', 'gold', 'tomato', 'hotpink', 'maroon', 'crimson', 'indigo', 'coral', 'brown', 'gray']
PX = {c: RGB[c] for c in RGB}
def pseudo(css): return css.replace(':hover', '.__hov').replace(':focus', '.__foc').replace(':active', '.__act')
def check_page(css, body, link=None):
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title><style>body{margin:8px;font-family:Arial,sans-serif}%s</style></head><body>%s</body></html>' % (pseudo(css), body)
def shown(css, body, css_name='style.css'):
    return '/* %s */\n%s\n\n<!-- index.html: the body -->\n%s' % (css_name, css, body)
def pagehtml(css, body):
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:8px;font-family:Arial,sans-serif}%s</style></head><body>%s</body></html>' % (css, body)
def Q5(rng, lesson, topic, stem, css, body, right, wrong, why, chk, key=None):
    q = mkq(rng, lesson, topic, stem, shown(css, body) if css is not None else None, right, wrong, why, chk, key=key)
    if css is not None: q['p'] = pagehtml(css, body)
    return q
def sel1(s): return "d.querySelector(%s)" % repr(s)
def cs(sel, prop): return "W.getComputedStyle(%s)['%s']" % (sel1(sel), prop)
def csall(sel, prop): return "Array.prototype.map.call(d.querySelectorAll(%s), function(e){return W.getComputedStyle(e)['%s']})" % (repr(sel), prop)
def st(sel, state, prop):
    return "(function(){var e=%s;e.classList.add('%s');var v=W.getComputedStyle(e)['%s'];e.classList.remove('%s');return v})()" % (sel1(sel), state, prop, state)
def rule(sel, *decls): return sel + ' {\n' + ''.join('  %s;\n' % x for x in decls) + '}'
def tag(t, text, cls=None, idn=None, extra=''):
    a = (' class="%s"' % cls if cls else '') + (' id="%s"' % idn if idn else '') + extra
    return '<%s%s>%s</%s>' % (t, a, text, t)
def pick_colors(rng, n): return rng.sample(SHOW, n)
def wrong_colors(rng, right, n=3, pool=SHOW):
    return rng.sample([c for c in pool if c != right], n)
def count_opts(n): 
    o = [n, n + 1, n - 1 if n > 1 else n + 2, n + 2]
    return [str(x) for x in dict.fromkeys(o) if x >= 0]
def rows(rng, n=4):
    ws = rng.sample(WORDS, n); return ws
# ==================================================================================================== 5.1 external CSS and classes (16)
def a1_count_class(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK); n = rng.randint(4, 6); ws = rows(rng, n); has = rng.sample(range(n), rng.randint(1, n - 2))
    body = '\n'.join(tag('p', w, k if i in has else None) for i, w in enumerate(ws))
    css = rule('.' + k, 'background-color: %s' % col, 'color: white')
    return Q5(rng, 16, 'Classes', 'How many paragraphs get the style from the `.%s` rule?' % k, css, body, str(len(has)), [x for x in count_opts(len(has)) if x != str(len(has))] + [str(n)],
        'The rule starts with a dot, so it styles every element that wears the class <b>%s</b>. %d of the %d paragraphs wear it.' % (k, len(has), n),
        [ck(check_page(css, body), "Array.prototype.filter.call(d.querySelectorAll('p'), function(e){return W.getComputedStyle(e).backgroundColor==='%s'}).length" % PX[col], len(has))])
def a1_which_class(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK); w = rng.choice(WORDS)
    body = '%s\n%s' % (tag('p', 'Plain text.'), tag('p', w, k))
    right_css = rule('.' + k, 'color: %s' % col); wrong_css = [rule(k, 'color: %s' % col), rule('class ' + k, 'color: %s' % col), rule('..' + k, 'color: %s' % col)]
    chk = [ck(check_page(c, body), cs('p.%s' % k, 'color'), PX[col]) for c in [right_css]] + [ck(check_page(c, body), cs('p.%s' % k, 'color'), {'not': PX[col]}) for c in wrong_css]
    return Q5(rng, 16, 'Class rule', 'Which rule colors the paragraph that wears the class `%s` %s?' % (k, col), None, None, '<pre>%s</pre>' % E(right_css), ['<pre>%s</pre>' % E(c) for c in wrong_css],
        'In a CSS file a class rule starts with a <b>dot</b> before the class name. Without the dot the browser looks for a tag with that name.', chk)
def a1_html_class(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK); w = rng.choice(WORDS)
    css = rule('.' + k, 'background-color: %s' % col, 'color: white')
    opts = {'right': '<p class="%s">%s</p>' % (k, w), 'dot': '<p class=".%s">%s</p>' % (k, w), 'bare': '<p %s>%s</p>' % (k, w), 'tag': '<%s>%s</%s>' % (k, w, k)}
    chk = []
    for nm, o in opts.items():
        pg = check_page(css, o); js = "d.body.firstElementChild ? W.getComputedStyle(d.body.firstElementChild).backgroundColor : 'none'"
        chk.append(ck(pg, js, PX[col]) if nm == 'right' else ck(pg, js, {'not': PX[col]}))
    return Q5(rng, 16, 'Class in the HTML', 'The stylesheet has a `.%s` rule with a %s background. Which tag gets the background?' % (k, col), css, '', '<code>%s</code>' % E(opts['right']), ['<code>%s</code>' % E(opts[x]) for x in ('dot', 'bare', 'tag')],
        'The HTML uses the class name with <b>no dot</b>, inside the class attribute. The dot belongs only in the CSS rule.', chk)
def a1_link(rng):
    file = 'style.css'
    right = '<link rel="stylesheet" href="style.css">'
    wr = ['<link rel="stylesheet" href="styles.css">', '<link rel="stylesheet" ref="style.css">', '<link rel="style" href="style.css">', '<style href="style.css">', '<link href="style.css">']
    wrong = rng.sample(wr, 3); col = rng.choice(DARK); body = '<h1>Hello</h1>'
    css = rule('h1', 'color: %s' % col)
    def mk(l):
        ok = bool(re.search(r'\brel="stylesheet"', l) and 'href="style.css"' in l and l.startswith('<link'))
        return '<!DOCTYPE html><html><head><title>t</title>%s</head><body>%s</body></html>' % (('<style>%s</style>' % css) if ok else '', body)
    chk = [ck(mk(right), cs('h1', 'color'), PX[col])] + [ck(mk(w), cs('h1', 'color'), {'not': PX[col]}) for w in wrong]
    q = mkq(rng, 16, 'The link tag', 'The CSS file is named `style.css`. Which link tag in the head connects it to the page?', '/* style.css */\n%s' % css, '<code>%s</code>' % E(right), ['<code>%s</code>' % E(w) for w in wrong],
        'The link tag needs <b>rel="stylesheet"</b> and an <b>href</b> with the exact file name. It has no closing tag and lives in the head.', chk)
    return q
def a1_which_style(rng):
    k = rng.choice(CLASSES); c1 = rng.choice(DARK); n = rng.randint(3, 5); ws = rows(rng, n); hv = rng.randrange(n); ask = rng.randrange(n)
    body = '\n'.join(tag('p', w, k if i == hv else None) for i, w in enumerate(ws))
    css = rule('p', 'color: %s' % c1) + '\n' + rule('.' + k, 'background-color: gold')
    right = 'A gold background' if ask == hv else 'No background'
    wrong = [o for o in ('A gold background', 'No background', 'A gold border', 'A different font') if o != right][:3]
    return Q5(rng, 16, 'Tag and class rules', 'Does the paragraph that says "%s" get a background from these two rules?' % ws[ask], css, body, right, wrong,
        'The <b>p</b> rule colors every paragraph. The <b>.%s</b> rule only reaches the paragraph that wears the class (the one that says %s), so only that one gets the gold background.' % (k, ws[hv]),
        [ck(check_page(css, body), "W.getComputedStyle(d.querySelectorAll('p')[%d]).backgroundColor === 'rgb(255, 215, 0)'" % ask, ask == hv)])
def a1_changes(rng):
    n = rng.randint(3, 5); ws = rows(rng, n); col = rng.choice(DARK)
    body = '\n'.join(tag('p', w) for w in ws); css = rule('p', 'color: %s' % col)
    return Q5(rng, 16, 'Why external CSS', 'The page has %d paragraphs and the color is set in the CSS file with `p { color: %s; }`. How many places do you edit to change all the text to a new color?' % (n, col), css, body, 'One: the p rule in the CSS file', ['%d: one style attribute per paragraph' % n, 'Two: the link and the file', 'Every page that links the file'],
        'This is the point of external CSS: one rule in one file styles every paragraph, and the link tag lets every page share it.', [ck(check_page(css, body), "W.getComputedStyle(d.querySelectorAll('p')[%d]).color" % (n - 1), PX[col])])
def a1_mistake(rng):
    col = rng.choice(DARK); k = rng.choice(CLASSES)
    ws = rng.sample(WORDS, 2); body = tag('p', ws[0], k) + '\n' + tag('p', ws[1])
    good = rule('.' + k, 'color: %s' % col)
    bad = {'There are quotes around the value': rule('.' + k, 'color: "%s"' % col), 'The colon is missing': rule('.' + k, 'color %s' % col), 'The dot is missing': rule(k, 'color: %s' % col), 'The semicolon is missing before the next property': '.%s {\n  color: %s\n  font-size: 20px;\n}' % (k, col)}
    name = rng.choice(list(bad)); css = bad[name]
    return Q5(rng, 16, 'Fix the rule', 'The `.%s` rule in the CSS file does not color the paragraph %s. What is wrong?' % (k, col), css, body, name,
        [x for x in bad if x != name][:3], 'A rule needs the dot for a class, a colon after the property, a semicolon after each value, and no quotes around a color. This is a CSS file, so no HTML tags belong in it either.',
        [ck(check_page(css, body), cs('p.%s' % k, 'color'), {'not': PX[col]})])
L16_T = [a1_count_class, a1_which_class, a1_html_class, a1_link, a1_which_style, a1_changes, a1_mistake]
L16_FACTS = [
 ('Where does the link tag that connects a CSS file go?', 'Inside the head', ['Inside the body', 'At the very bottom of the page', 'Inside a style attribute'], 'The browser needs the link before it draws the page, so it lives in the head.'),
 ('Does the link tag need a closing tag?', 'No. It stands alone, like img and br', ['Yes, a closing link tag', 'Only inside the body', 'Yes, if it has an href'], 'The link tag is a one-tag tag with no closing tag.'),
 ('The page links `style.css` but the file is really named `styles.css`. What happens?', 'Nothing is styled and no error shows', ['The page shows an error', 'The browser guesses the right file', 'Only the headings are styled'], 'The file name must match exactly. If it does not, the page just looks plain.'),
 ('Which of these belongs in a CSS file?', 'A rule like p { color: blue; }', ['A style tag', 'A title tag', 'A link tag'], 'A CSS file holds only rules: a selector, curly braces, and property: value pairs. It is not a web page, so HTML tags do not belong in it.'),
 ('Which symbol starts a class rule in the CSS file?', 'A dot', ['A hash', 'A colon', 'An at sign'], 'A class rule starts with a dot before the name, like .spotlight.'),
 ('A paragraph should wear the class `spotlight`. What does the HTML say?', '<p class="spotlight">', ['<p class=".spotlight">', '<p .spotlight>', '<p spotlight>'], 'In the HTML the class name has no dot. The dot only belongs in the CSS rule.'),
 ('How many elements can wear the same class?', 'As many as you want', ['Only one', 'Only two', 'Only elements of the same tag'], 'A class is a name tag you can hand to many elements.'),
 ('What is the main advantage of external CSS over style attributes?', 'One rule in one file styles many elements and many pages', ['It makes the page load faster in every case', 'It lets you skip the head', 'It lets you use more colors'], 'Change one rule in the file and every page that links it changes.'),
 ('In `p { color: blue; }`, what is the `p` called?', 'The selector', ['The property', 'The value', 'The class'], 'The selector says which elements the rule is for. The property is color and the value is blue.'),
 ('What goes between the curly braces of a rule?', 'Property: value; pairs', ['HTML tags', 'Only a selector', 'A link tag'], 'Inside the braces go the declarations, each one written as property: value;'),
 ('What does a tag rule like `p { color: navy; }` style?', 'Every p tag on the page', ['Only the first p', 'Only p tags with a class', 'Only p tags with an id'], 'A tag rule is a school-wide announcement: every element of that tag hears it.'),
 ('Where is the class name written in the HTML?', 'In the class attribute of the tag', ['In the title', 'In the link tag', 'In the style attribute'], 'The element wears the name in its class attribute.'),
]
