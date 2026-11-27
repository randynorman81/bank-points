"""Unit 5 question templates, lessons 5.2 (17) to 5.4 (19). See qgen5.py."""
from qgen5 import *
# ==================================================================================================== 5.2 CSS by id (17)
def b1_which_symbol(rng):
    i = rng.choice(IDS); col = rng.choice(DARK); w = rng.choice(WORDS)
    body = tag('p', 'Plain.') + '\n' + tag('h2', w, None, i)
    right = rule('#' + i, 'background-color: %s' % col); wrong = [rule('.' + i, 'background-color: %s' % col), rule(i, 'background-color: %s' % col), rule('##' + i, 'background-color: %s' % col)]
    chk = [ck(check_page(right, body), cs('h2', 'backgroundColor'), PX[col])] + [ck(check_page(c, body), cs('h2', 'backgroundColor'), {'not': PX[col]}) for c in wrong]
    return Q5(rng, 17, 'Id rule', 'The heading has the id `%s`. Which rule gives it a %s background?' % (i, col), None, None, '<pre>%s</pre>' % E(right), ['<pre>%s</pre>' % E(c) for c in wrong],
        'A CSS id rule starts with a <b>hash</b> (#) before the id name. A dot looks for a class, and a bare name looks for a tag.', chk)
def b1_html_id(rng):
    i = rng.choice(IDS); col = rng.choice(DARK); w = rng.choice(WORDS)
    css = rule('#' + i, 'color: %s' % col)
    opts = {'right': '<h2 id="%s">%s</h2>' % (i, w), 'hash': '<h2 id="#%s">%s</h2>' % (i, w), 'class': '<h2 class="%s">%s</h2>' % (i, w), 'bare': '<h2 %s>%s</h2>' % (i, w)}
    js = "W.getComputedStyle(d.querySelector('h2')).color"
    chk = [ck(check_page(css, o), js, PX[col] if nm == 'right' else {'not': PX[col]}) for nm, o in opts.items()]
    return Q5(rng, 17, 'Id in the HTML', 'The stylesheet has the rule `#%s { color: %s; }`. Which heading wears the id?' % (i, col), css, '', '<code>%s</code>' % E(opts['right']), ['<code>%s</code>' % E(opts[x]) for x in ('hash', 'class', 'bare')],
        'The HTML uses the <b>id attribute</b> with the name only. No hash goes in the HTML: the hash belongs in the CSS rule.', chk)
def b1_count(rng):
    i = rng.choice(IDS); col = rng.choice(DARK); n = rng.randint(3, 5); ws = rows(rng, n); hv = rng.randrange(n)
    body = '\n'.join(tag('p', w, None, i if k == hv else None) for k, w in enumerate(ws)); css = rule('#' + i, 'background-color: %s' % col, 'color: white')
    return Q5(rng, 17, 'One element', 'How many paragraphs does the `#%s` rule style?' % i, css, body, '1', ['0', '2', str(n)],
        'An id points at exactly one element. Only the paragraph that says <b>%s</b> has the id.' % ws[hv],
        [ck(check_page(css, body), "Array.prototype.filter.call(d.querySelectorAll('p'), function(e){return W.getComputedStyle(e).backgroundColor==='%s'}).length" % PX[col], 1)])
def b1_class_or_id(rng):
    n = rng.randint(3, 5); w = rng.choice(['all the product cards', 'every price tag', 'every warning message', 'every menu item', 'all the photo captions'])
    sin = rng.choice(['the page logo', 'the one page title', 'the single footer', 'the main banner', 'the shopping cart button'])
    if rng.random() < .5: return mkq(rng, 17, 'Class or id', 'You want to style %s the same way. Which should you use?' % w, None, 'A class', ['An id', 'A tag with a hash', 'An id on every one of them'], 'A class can go on as many elements as you like. An id may be used once per page.', [])
    return mkq(rng, 17, 'Class or id', 'You want to style %s, which appears once on the page. Which fits best?' % sin, None, 'An id', ['A class on many tags', 'A hash in the HTML', 'A tag rule'], 'An id points at one special element, like the page title. Use a class for a look you will reuse.', [])
def b1_class_and_id(rng):
    k = rng.choice(CLASSES); i = rng.choice(IDS); c1, c2 = rng.sample(DARK, 2); n = rng.randint(3, 5); ws = rows(rng, n); hv = rng.randrange(n)
    body = '\n'.join(tag('p', w, k, i if j == hv else None) for j, w in enumerate(ws))
    css = rule('.' + k, '''border: 3px solid %s''' % c1) + '\n' + rule('#' + i, 'background-color: %s' % c2, 'color: white')
    ask = rng.randrange(n); expect_bg = (ask == hv)
    right = 'A border and a %s background' % c2 if expect_bg else 'A border only'
    wrong = [o for o in ('A border and a %s background' % c2, 'A border only', 'A background only', 'Nothing') if o != right][:3]
    return Q5(rng, 17, 'Class and id together', 'What does the paragraph that says "%s" get from these two rules?' % ws[ask], css, body, right, wrong,
        'Every paragraph wears the class <b>%s</b>, so every one gets the border. Only the paragraph that says <b>%s</b> has the id <b>%s</b>, so only that one gets the %s background.' % (k, ws[hv], i, c2),
        [ck(check_page(css, body), "(function(){var e=d.querySelectorAll('p')[%d],c=W.getComputedStyle(e);return [c.borderTopStyle==='solid', c.backgroundColor==='%s']})()" % (ask, PX[c2]), [True, expect_bg]),])
def b1_twice(rng):
    i = rng.choice(IDS); return mkq(rng, 17, 'Unique ids', 'A page has two paragraphs that both say `id="%s"`. What is wrong with that?' % i, None, 'An id may be used only once on a page, so one should be a class or get a different id', ['Nothing, ids can be repeated', 'The id must have a hash in the HTML', 'Ids only work on headings'], 'Every id name may be used once per page. For several elements that share a look, use a class.', [])
L17_T = [b1_which_symbol, b1_html_id, b1_count, b1_class_or_id, b1_class_and_id, b1_twice]
L17_FACTS = [
 ('Which symbol starts an id rule in the CSS file?', 'A hash (#)', ['A dot', 'A colon', 'A dollar sign'], 'Classes use a dot and ids use a hash.'),
 ('How many elements should have the same id?', 'One', ['As many as you want', 'Exactly two', 'At least three'], 'An id is like a student ID number: it belongs to exactly one element.'),
 ('Where do you write the id name that goes with `#banner`?', 'In the id attribute of the tag, with no hash', ['In the class attribute', 'In the title tag', 'In the link tag'], '<code>&lt;h2 id="banner"&gt;</code>: the name goes in quotes with no symbol in front.'),
 ('What happens if you write `.banner { }` for an element with `id="banner"`?', 'Nothing changes, because the dot looks for a class', ['The element is styled anyway', 'The page shows an error', 'The browser changes the dot to a hash'], 'A dot looks for a class, so the rule matches nothing.'),
 ('A class is a team jersey. An id is...', 'A student ID number', ['A school bus', 'A lunch menu', 'A hall pass for everyone'], 'Many students wear the same jersey, but every ID number belongs to one person.'),
 ('Which is the best use of an id?', 'The one page title', ['Every product card', 'Every paragraph', 'Every link in a menu'], 'An id points at one special element.'),
 ('What is the difference in symbols between a class rule and an id rule in CSS?', 'A class starts with a dot, an id starts with a hash', ['A class starts with a hash, an id starts with a dot', 'Both start with a dot', 'Neither needs a symbol'], 'Classes use a dot, ids use a hash.'),
 ('Can one element wear both a class and an id?', 'Yes', ['No, only one of them', 'Only on headings', 'Only if the id comes first'], 'An element can have a class attribute and an id attribute at the same time.'),
 ('Which line is a correct id rule?', '#logo { font-size: 36px; }', ['.logo { font-size: 36px; }', 'logo { font-size: 36px; }', '#logo [ font-size: 36px; ]'], 'A hash, the id name, then curly braces with property: value; inside.'),
 ('If you need the same look on 10 elements, what should you use?', 'A class', ['An id on each one', 'Ten different tag rules', 'One id repeated 10 times'], 'A class is for a look you will reuse.'),
]
# ==================================================================================================== 5.3 selectors and specificity (18)
def c1_who_wins(rng):
    c1, c2, c3 = rng.sample(SHOW, 3); k = rng.choice(CLASSES); i = rng.choice(IDS); w = rng.choice(WORDS)
    kinds = rng.sample(['tag', 'class', 'id'], rng.choice([2, 3])); rank = {'tag': 0, 'class': 1, 'id': 2}
    col = {'tag': c1, 'class': c2, 'id': c3}; sels = {'tag': 'p', 'class': '.' + k, 'id': '#' + i}
    rules = [rule(sels[x], 'color: %s' % col[x]) for x in kinds]; rng.shuffle(rules)
    css = '\n'.join(rules); body = tag('p', w, k, i)
    win = max(kinds, key=lambda x: rank[x])
    nm = {'tag': 'the tag rule', 'class': 'the class rule', 'id': 'the id rule'}
    return Q5(rng, 18, 'Who wins', 'The paragraph wears the class `%s` and the id `%s`. What color is its text?' % (k, i), css, body, col[win], [x for x in SHOW if x != col[win]][:3] if False else wrong_colors(rng, col[win], 3, [c for c in SHOW if c not in [col[x] for x in kinds if x != win]] if False else SHOW),
        'The more specific rule wins no matter which one comes first: a tag is the weakest, then a class, then an id. Here %s is the most specific, so the text is %s.' % (nm[win], col[win]),
        [ck(check_page(css, body), cs('p', 'color'), PX[col[win]])])
def c1_inline(rng):
    c1, c2 = rng.sample(SHOW, 2); i = rng.choice(IDS); w = rng.choice(WORDS)
    body = '<p id="%s" style="color: %s">%s</p>' % (i, c2, w); css = rule('#' + i, 'color: %s' % c1)
    return Q5(rng, 18, 'Inline wins', 'The id rule says %s but the tag has an inline style that says %s. What color is the text?' % (c1, c2), css, body, c2, wrong_colors(rng, c2, 3),
        'An inline style is the strongest of all: it beats a class rule and an id rule. That is why teams keep styles in the stylesheet.', [ck(check_page(css, body), cs('p', 'color'), PX[c2])])
def c1_two_classes(rng):
    k1, k2 = rng.sample(CLASSES, 2); c1 = rng.choice(DARK); px = rng.choice([20, 24, 28, 32])
    body = '%s\n%s' % (tag('p', 'Both names', k1 + ' ' + k2), tag('p', 'One name', k1))
    css = rule('.' + k1, 'color: %s' % c1) + '\n' + rule('.' + k2, 'font-size: %dpx' % px); ask = rng.choice([0, 1]); 
    right = 'A %s text color and a %dpx font-size' % (c1, px) if ask == 0 else 'A %s text color only' % c1
    wrong = [o for o in ('A %s text color and a %dpx font-size' % (c1, px), 'A %s text color only' % c1, 'A %dpx font-size only' % px, 'No change from the rules') if o != right][:3]
    return Q5(rng, 18, 'Two classes', 'What does the %s paragraph get from these two rules?' % ('first' if ask == 0 else 'second'), css, body, right, wrong,
        'An element can wear more than one class: list them in one class attribute, separated by a space. Every class rule that matches applies. The first paragraph wears both names; the second wears only <b>%s</b>.' % k1,
        [ck(check_page(css, body), "(function(){var c=W.getComputedStyle(d.querySelectorAll('p')[%d]);return [c.color==='%s', c.fontSize==='%dpx']})()" % (ask, PX[c1], px), [True, ask == 0])])
def c1_combined(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK); ws = rows(rng, 4)
    body = '%s\n%s\n%s\n%s' % (tag('p', ws[0], k), tag('li', ws[1], k), tag('p', ws[2]), tag('li', ws[3]))
    body = '<ul>\n%s\n%s\n</ul>\n%s\n%s' % (tag('li', ws[1], k), tag('li', ws[3]), tag('p', ws[0], k), tag('p', ws[2]))
    css = rule('p.' + k, 'background-color: %s' % col)
    n = 1
    return Q5(rng, 18, 'Tag and class', 'How many elements does the rule `p.%s` style?' % k, css, body, '1', ['0', '2', '4'],
        '<b>p.%s</b> (no space) means a paragraph that also wears the class %s. The list item with the same class is not a paragraph, so only one element matches.' % (k, k),
        [ck(check_page(css, body), "Array.prototype.filter.call(d.querySelectorAll('body *'), function(e){return W.getComputedStyle(e).backgroundColor==='%s'}).length" % PX[col], 1)])
def c1_descendant(rng):
    col = rng.choice(DARK); tagname = rng.choice(['ul', 'ol']); other = 'ol' if tagname == 'ul' else 'ul'
    a, b_ = rng.randint(2, 4), rng.randint(2, 3)
    body = '<%s>\n%s\n</%s>\n<%s>\n%s\n</%s>' % (tagname, '\n'.join(tag('li', w) for w in rows(rng, a)), tagname, other, '\n'.join(tag('li', w) for w in rows(rng, b_)), other)
    css = rule('%s li' % tagname, 'color: %s' % col)
    return Q5(rng, 18, 'Inside a list', 'How many list items turn %s from the rule `%s li`?' % (col, tagname), css, body, str(a), [x for x in count_opts(a) if x != str(a)][:2] + [str(a + b_)] if len({str(a), str(a + b_)}) == 2 else count_opts(a)[1:4],
        'A space between two selectors means <b>inside</b>: this rule reaches only the li tags that sit inside a %s. The %s has %d items and the other list has %d.' % (tagname, tagname, a, b_),
        [ck(check_page(css, body), "Array.prototype.filter.call(d.querySelectorAll('li'), function(e){return W.getComputedStyle(e).color==='%s'}).length" % PX[col], a)])
def c1_space_matters(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK)
    body = '<div class="%s">\n%s\n</div>\n%s' % (k, tag('p', 'Inside the box'), tag('p', 'Outside the box', k))
    right = rule('.%s p' % k, 'color: %s' % col); wrongs = [rule('.%sp' % k, 'color: %s' % col), rule('p.%s' % k, 'color: %s' % col), rule('.%s, p' % k, 'color: %s' % col)]
    js = "W.getComputedStyle(d.querySelectorAll('p')[0]).color"
    chk = [ck(check_page(right, body), js, PX[col])] + [ck(check_page(c, body), js, {'not': PX[col]}) for c in wrongs[:2]]
    wrongs = wrongs[:2] + [rule('.%s' % k, 'color: black')]
    chk.append(ck(check_page(wrongs[2], body), js, {'not': PX[col]}))
    return Q5(rng, 18, 'Which selector', 'Which rule colors only the paragraph that sits inside the `%s` box?' % k, None, None, '<pre>%s</pre>' % E(right), ['<pre>%s</pre>' % E(c) for c in wrongs],
        'A space means "inside": <b>.%s p</b> is every p inside an element with that class.' % k, chk)
def c1_two_attrs(rng):
    k1, k2 = rng.sample(CLASSES, 2); return mkq(rng, 18, 'Two classes', 'A paragraph should wear the classes `%s` and `%s`. Which tag is written correctly?' % (k1, k2), None, '<code>&lt;p class="%s %s"&gt;</code>' % (k1, k2), ['<code>&lt;p class="%s, %s"&gt;</code>' % (k1, k2), '<code>&lt;p class="%s" class="%s"&gt;</code>' % (k1, k2), '<code>&lt;p class="%s.%s"&gt;</code>' % (k1, k2)], 'List the classes in one class attribute, separated by a space. No commas, and no second class attribute.', [])
L18_T = [c1_who_wins, c1_inline, c1_two_classes, c1_combined, c1_descendant, c1_space_matters, c1_two_attrs]
L18_FACTS = [
 ('Which is the weakest: a tag rule, a class rule, an id rule, or an inline style?', 'A tag rule', ['A class rule', 'An id rule', 'An inline style'], 'From weakest to strongest: tag, class, id, inline style.'),
 ('Which is the strongest?', 'An inline style', ['An id rule', 'A class rule', 'A tag rule'], 'An inline style written right on the tag beats everything in the stylesheet.'),
 ('Two rules style the same element. One is a class rule written first, the other is a tag rule written last. Which wins?', 'The class rule, because it is more specific', ['The tag rule, because it is last', 'Neither, they cancel out', 'The first rule in the file always'], 'The winner is decided by how specific the rule is, not by which one is written last.'),
 ('What is the ranking of the four kinds of rule called?', 'Specificity', ['Inheritance', 'Hierarchy of tags', 'The cascade of files'], 'Specificity decides which rule wins when rules disagree.'),
 ('How do you put two classes on one element?', 'Put both names in one class attribute, separated by a space', ['Use two class attributes', 'Separate the names with commas', 'Use a hash between them'], 'Example: class="big red". Both rules apply.'),
 ('What does `p.warning` mean?', 'Only paragraphs that wear the class warning', ['Every p and every warning', 'A p inside a warning', 'A class inside a p'], 'No space between the tag and the dot means the element must match both.'),
 ('What does `ul li` mean?', 'Any li inside a ul', ['Every ul and every li', 'A ul inside an li', 'Only the first li'], 'A space means inside.'),
 ('What does a plain `.warning` rule style?', 'Anything at all that wears the class warning', ['Only paragraphs', 'Only the first element', 'Only list items'], 'A class rule does not care about the tag.'),
 ('Why do teams avoid inline styles?', 'They beat the stylesheet, so one file can no longer control the look', ['They do not work in browsers', 'They only work on headings', 'They slow down the computer'], 'If one element has an inline color, the CSS file can never change it without hunting it down in the HTML.'),
 ('What is a good rule of thumb for choosing?', 'Tag rules for the basics, classes for looks you reuse, ids for the one-of-a-kind element', ['Always use inline styles', 'Always use ids', 'Never use classes'], 'Keep style rules in the stylesheet so one file stays in charge.'),
]
# ==================================================================================================== 5.4 pseudo-classes and transitions (19)
STATE = {'hover': ('hover', '__hov', 'the mouse is on it'), 'focus': ('focus', '__foc', 'it is clicked into or reached with the Tab key'), 'active': ('active', '__act', 'it is being clicked')}
def d1_state(rng):
    st_ = rng.choice(list(STATE)); c1, c2 = rng.sample(DARK, 2); w = rng.choice(WORDS)
    body = '<a href="https://example.com/%s">%s</a>' % (w.lower(), w)
    css = rule('a', 'color: %s' % c1) + '\n' + rule('a:%s' % st_, 'color: %s' % c2)
    ask = rng.choice(['normal', st_])
    js = cs('a', 'color') if ask == 'normal' else st('a', STATE[st_][1], 'color')
    col = c1 if ask == 'normal' else c2
    return Q5(rng, 19, 'Pseudo-classes', 'What color is the link text %s?' % ('right now, with nothing happening to it' if ask == 'normal' else 'while %s' % STATE[st_][2]), css, body, col, wrong_colors(rng, col, 3, [c1, c2] + rng.sample(SHOW, 4)),
        'A pseudo-class like <b>:%s</b> only applies while that state is happening. The rest of the time the normal rule applies.' % st_, [ck(check_page(css, body), js, PX[col])])
def d1_which_state(rng):
    st_ = rng.choice(list(STATE)); 
    stems = {'hover': 'You want a link to change while the mouse rests on it.', 'focus': 'You want a link to change when it is reached with the Tab key.', 'active': 'You want a link to change for the instant it is being pressed down.'}
    return mkq(rng, 19, 'Which pseudo-class', stems[st_] + ' Which pseudo-class do you use?', None, ':' + st_, [':' + x for x in STATE if x != st_] + [':visited'][:1] if False else [':' + x for x in STATE if x != st_] + [':click'], 'Hover is the mouse resting on it, focus is selected by a click or the Tab key, and active is the moment it is pressed.', [])
def d1_syntax(rng):
    c1 = rng.choice(DARK); k = rng.choice(CLASSES)
    body = tag('a', 'Go', k, None, ' href="https://example.com/go"')
    right = rule('.%s:hover' % k, 'color: %s' % c1); wrongs = [rule('.%s :hover' % k, 'color: %s' % c1), rule('.%s: hover' % k, 'color: %s' % c1), rule('.%s::hover' % k, 'color: %s' % c1)]
    js = st('a', '__hov', 'color'); base = "W.getComputedStyle(d.querySelector('a')).color"
    chk = [ck(check_page(right, body), js, PX[c1])] + [ck(check_page(c, body), js, {'not': PX[c1]}) for c in wrongs]
    return Q5(rng, 19, 'Pseudo-class syntax', 'Which rule turns the link with the class `%s` %s while the mouse is on it?' % (k, c1), None, None, '<pre>%s</pre>' % E(right), ['<pre>%s</pre>' % E(c) for c in wrongs],
        'A pseudo-class sticks to its selector: the selector, a colon, the state, with no spaces.', chk)
def d1_where_transition(rng):
    c1, c2 = rng.sample(DARK, 2); sec = rng.choice(['0.3s', '0.5s', '0.2s', '1s', '0.4s']); k = rng.choice(CLASSES)
    body = tag('a', 'Hover me', k, None, ' href="https://example.com/x"')
    good = rule('.%s' % k, 'color: %s' % c1, 'transition: color %s' % sec) + '\n' + rule('.%s:hover' % k, 'color: %s' % c2)
    bad = rule('.%s' % k, 'color: %s' % c1) + '\n' + rule('.%s:hover' % k, 'color: %s' % c2, 'transition: color %s' % sec)
    normal = "W.getComputedStyle(d.querySelector('a')).transitionDuration"
    chk = [ck(check_page(good, body), normal, sec), ck(check_page(bad, body), normal, {'not': sec})]
    ask = rng.choice([0, 1])
    if ask == 0:
        return Q5(rng, 19, 'Where the transition goes', 'Which version glides smoothly BOTH when the mouse arrives and when it leaves?', None, None, '<pre>%s</pre>' % E(good), ['<pre>%s</pre>' % E(bad), '<pre>%s</pre>' % E(rule('.%s' % k, 'color: %s' % c1) + '\n' + rule('.%s:hover' % k, 'color: %s' % c2)), '<pre>%s</pre>' % E(rule('.%s' % k, 'transition: color %s' % sec))],
            'Put the transition on the <b>normal</b> rule. Then the element glides in and glides back out. On the hover rule only, it glides in but snaps back.', chk + [ck(check_page(rule('.%s' % k, 'color: %s' % c1) + '\n' + rule('.%s:hover' % k, 'color: %s' % c2), body), normal, {'not': sec})])
    return Q5(rng, 19, 'Where the transition goes', 'The transition is only written inside the `:hover` rule. What happens when the mouse leaves?', bad, body, 'It snaps back instantly', ['It glides back slowly', 'It stays changed', 'The page shows an error'],
        'A transition glides <b>into</b> the state that has the transition rule. With it only on the hover rule, the glide happens on the way in and the color snaps back on the way out.',
        [ck(check_page(bad, body), normal, {'not': sec})])
def d1_transition_value(rng):
    c1, c2 = rng.sample(DARK, 2); sec = rng.choice(['0.3s', '0.5s', '0.2s', '1s', '0.4s', '2s']); k = rng.choice(CLASSES); prop = rng.choice(['color', 'background-color', 'all'])
    body = tag('p', 'Hover me', k)
    css = rule('.%s' % k, 'background-color: %s' % c1, 'color: white', 'transition: %s %s' % (prop, sec)) + '\n' + rule('.%s:hover' % k, 'background-color: %s' % c2)
    what = rng.choice(['seconds', 'property'])
    if what == 'seconds':
        return Q5(rng, 19, 'Transition time', 'How long does the glide last in `transition: %s %s`?' % (prop, sec), css, body, sec.replace('s', '') + ' second' + ('' if sec == '1s' else 's'), [x for x in ('0.1 seconds', '3 seconds', '10 seconds', '1 second', '0.5 seconds', '2 seconds') if not x.startswith(sec.replace('s', '') + ' ')][:3],
            'The first word is the property that glides, the second is the time in seconds.', [ck(check_page(css, body), cs('p', 'transitionDuration'), sec)])
    exp = {'color': 'color', 'background-color': 'background-color', 'all': 'all'}[prop]
    return Q5(rng, 19, 'Transition property', 'Which property glides in `transition: %s %s`?' % (prop, sec), css, body, 'all of them' if prop == 'all' else prop, [x for x in ('color', 'background-color', 'font-size', 'all of them') if x != ('all of them' if prop == 'all' else prop)][:3],
        'The first word of the transition names the property that glides. The word <b>all</b> makes every changing property glide.', [ck(check_page(css, body), cs('p', 'transitionProperty'), exp)])
def d1_hover_count(rng):
    k = rng.choice(CLASSES); col = rng.choice(DARK); n = rng.randint(3, 5); ws = rows(rng, n); hv = rng.randrange(n)
    body = '<ul>\n' + '\n'.join(tag('li', w) for w in ws) + '\n</ul>'; css = rule('li:hover', 'background-color: %s' % col)
    return Q5(rng, 19, 'Hover on a list', 'The mouse rests on the item that says "%s". How many list items have the %s background right now?' % (ws[hv], col), css, body, '1', ['0', str(n), '2'],
        'A hover rule only applies to the one element the mouse is on. The other items stay normal.',
        [ck(check_page(css, body), "(function(){var l=d.querySelectorAll('li');l[%d].classList.add('__hov');return Array.prototype.filter.call(l,function(e){return W.getComputedStyle(e).backgroundColor==='%s'}).length})()" % (hv, PX[col]), 1)])
L19_T = [d1_state, d1_which_state, d1_syntax, d1_where_transition, d1_transition_value, d1_hover_count]
L19_FACTS = [
 ('What is a pseudo-class?', 'A style that applies only during a temporary state', ['A class with a fake name', 'A second class attribute', 'A tag that stands alone'], 'A pseudo-class is written with a colon and applies only while something is happening to an element.'),
 ('Which pseudo-class applies while the mouse is on an element?', ':hover', [':focus', ':active', ':mouse'], 'Hover is the mouse resting on the element.'),
 ('Which pseudo-class applies while an element is selected by a click or the Tab key?', ':focus', [':hover', ':active', ':tab'], 'Focus means the element is selected.'),
 ('Which pseudo-class applies while an element is being pressed down?', ':active', [':hover', ':focus', ':click'], 'Active lasts for the split second of the press.'),
 ('Can a pseudo-class be written inside a style attribute?', 'No. It must be in a stylesheet', ['Yes, in any style attribute', 'Only on links', 'Only on headings'], 'Pseudo-classes cannot go inline, which is one more reason to keep CSS in its own file.'),
 ('What does the transition property do?', 'Makes a change glide over time instead of snapping', ['Makes a change happen faster', 'Moves an element to a new page', 'Turns a rule off'], 'Without a transition a change is instant, like a light switch. With one it glides, like a dimmer.'),
 ('Where should the transition go so the element glides in AND out?', 'On the normal rule', ['Only on the hover rule', 'Inside the HTML', 'On the body only'], 'On the normal rule the element glides in and glides back out.'),
 ('What is the correct way to write the hover rule for links?', 'a:hover { }', ['a : hover { }', 'a hover { }', 'a::hover { }'], 'The tag, a colon and the state are written together with no spaces.'),
 ('In `transition: color 0.3s`, what is `0.3s`?', 'The time the glide takes, in seconds', ['The delay before the page loads', 'The size of the color change', 'The number of colors'], 'The duration is written in seconds.'),
 ('What does a transition time of 0 do?', 'The change snaps with no glide', ['The change never happens', 'The change takes a very long time', 'The page reloads'], 'At 0 there is no glide: it is like flipping a light switch.'),
]
