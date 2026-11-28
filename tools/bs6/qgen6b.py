"""Unit 6 question templates, lessons 6.4 (25), 6.5 (26), 6.6 (27). See qgen6.py."""
from qgen6 import *
def nav(links, expand=True, dark=True, bg='bg-dark', brand='Brand', container=True):
    cls = 'navbar%s%s %s' % (' navbar-expand-lg' if expand else '', ' navbar-dark' if dark else '', bg)
    inner = '<a class="navbar-brand" href="https://www.nasa.gov">%s</a>\n<div class="navbar-nav">\n%s\n</div>' % (brand, '\n'.join('<a class="nav-link" href="https://www.nasa.gov">%s</a>' % l for l in links))
    if container: inner = '<div class="container">\n' + inner + '\n</div>'
    return '<nav class="%s">\n%s\n</nav>' % (cls, inner)
LINKTOPS = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.nav-link'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
# ==================================================================================================== 6.4 navbar (25)
def d_rows(rng):
    links = rng.sample(['Home', 'Games', 'Help', 'About', 'Shop', 'News'], rng.randint(2, 3)); wide = rng.random() < .5; body = nav(links)
    w = 1200 if wide else 500; val = 1 if wide else len(links)
    return Q6(rng, 25, 'navbar-expand-lg', 'The navbar uses `navbar-expand-lg` and has %d nav-links. How many lines of links do you see on %s?' % (len(links), 'a wide laptop screen (1200 pixels)' if wide else 'a phone (500 pixels wide)'), body, str(val), [x for x in ('1', '2', '3', '4') if x != str(val)][:3],
        'navbar-expand-lg puts the links in a row on large screens (992 pixels and wider). On narrower screens the links stack, one per line.', [ck6(check_page(body), LINKTOPS, val, w)])
def d_noexpand(rng):
    links = rng.sample(['Home', 'Games', 'Help', 'About'], 2); body = nav(links, expand=False)
    return Q6(rng, 25, 'No expand class', 'The navbar has no `navbar-expand-lg` class and %d nav-links. How are the links laid out on a wide laptop screen?' % len(links), body, 'Stacked, one per line', ['In a row', 'Hidden', 'Spread out evenly'],
        'The expand class is what turns the links into a row on large screens. Without it they stack at every width.', [ck6(check_page(body), LINKTOPS, len(links), 1200)])
def d_color(rng):
    bg = rng.choice(['bg-dark', 'bg-primary', 'bg-success', 'bg-danger', 'bg-secondary', 'bg-warning']); name = {'bg-dark': 'almost black', 'bg-primary': 'blue', 'bg-success': 'green', 'bg-danger': 'red', 'bg-secondary': 'gray', 'bg-warning': 'yellow'}[bg]
    rgb = {'bg-dark': 'rgb(33, 37, 41)', 'bg-primary': 'rgb(13, 110, 253)', 'bg-success': 'rgb(25, 135, 84)', 'bg-danger': 'rgb(220, 53, 69)', 'bg-secondary': 'rgb(108, 117, 125)', 'bg-warning': 'rgb(255, 193, 7)'}[bg]
    body = nav(['Home', 'Help'], bg=bg, brand=rng.choice(WORDS))
    return Q6(rng, 25, 'Navbar color', 'The nav tag has the classes `navbar navbar-expand-lg navbar-dark %s`. What color is the bar?' % bg, body, name, [x for x in ('almost black', 'blue', 'green', 'red', 'gray', 'yellow') if x != name][:3], '<b>%s</b> sets the bar\'s background, so it is %s.' % (bg, name), [ck6(check_page(body), cs('nav', 'backgroundColor'), rgb)])
def d_which_class(rng):
    items = [('the site name or logo link at the left', 'navbar-brand', ['nav-link', 'navbar-nav', 'navbar']), ('each link in the menu', 'nav-link', ['navbar-brand', 'navbar-dark', 'container']), ('the div that wraps the links', 'navbar-nav', ['navbar-brand', 'nav-link', 'bg-dark']), ('the nav tag itself, to make it a navbar', 'navbar', ['navbar-nav', 'nav-link', 'navbar-brand']), ('light-colored text on a dark bar', 'navbar-dark', ['navbar-bright', 'bg-info', 'text-center'])]
    stem, right, wrong = rng.choice(items)
    return mkq(rng, 25, 'Navbar classes', 'Which class goes on %s?' % stem, None, '<code>%s</code>' % right, ['<code>%s</code>' % x for x in wrong], 'navbar goes on the nav, navbar-brand on the site name, navbar-nav on the div around the links, and nav-link on each link.', [])
def d_brand(rng):
    body = nav(['Home', 'Help']); right = 'Bigger and bolder than the other links'
    return Q6(rng, 25, 'navbar-brand', 'The first link in the navbar has the class `navbar-brand`. How does it look next to the nav-links?', body, right, ['Smaller than the other links', 'Exactly the same as the other links', 'Hidden on a laptop'],
        'navbar-brand gives the site name bigger, bolder styling.', [ck6(check_page(body), "parseFloat(W.getComputedStyle(d.querySelector('.navbar-brand')).fontSize) > parseFloat(W.getComputedStyle(d.querySelector('.nav-link')).fontSize)", True, 1200)])
L25_T = [d_rows, d_noexpand, d_color, d_which_class, d_brand]
L25_FACTS = [
 ('What is a navbar?', 'The navigation bar at the top of a page', ['A bar chart', 'A list of colors', 'A kind of form'], 'Bootstrap builds one from a nav tag with specific classes.'),
 ('Which tag does a Bootstrap navbar start with?', 'nav', ['navbar', 'div only', 'header'], 'The nav tag carries the navbar classes.'),
 ('What does navbar-dark do?', 'Makes the text light so it can be read on a dark background', ['Makes the page dark', 'Hides the navbar', 'Adds a dark border'], 'Use it with a dark background like bg-dark. Leave it off for a light navbar.'),
 ('What does navbar-expand-lg do?', 'Puts the links in a row on wide screens (992 pixels and up) and stacks them on narrower screens', ['Makes the links bigger', 'Adds a menu icon', 'Hides the links on laptops'], 'It decides when the navbar is laid out in a row.'),
 ('Which class goes on each link in the navbar menu?', 'nav-link', ['navbar-brand', 'btn', 'navbar-nav'], 'nav-link gives standard spacing and hover color.'),
 ('Why does a navbar have a container inside it?', 'It centers the content, using the same grid piece you learned in 6.2', ['It adds a border', 'It makes the bar dark', 'It is required for links'], 'Bootstrap components are built from the same handful of classes.'),
 ('Which class goes on the div that wraps the nav-links?', 'navbar-nav', ['navbar-brand', 'nav-links', 'navbar-dark'], 'It lays the links out together.'),
 ('Which class makes the navbar background blue?', 'bg-primary', ['navbar-blue', 'text-primary', 'btn-primary'], 'The same bg- classes from 6.3 color a navbar.'),
]
# ==================================================================================================== 6.5 cards (26)
def card(title='Pizza', text='Hot and fresh.', btn=None, img=False, extra=''):
    inner = ('<img src="https://schscomputerscience.com/ist/unit-6/lab/rocket.svg" class="card-img-top" alt="A red rocket">\n' if img else '') + '<div class="card-body">\n<h5 class="card-title">%s</h5>\n<p class="card-text">%s</p>\n%s</div>' % (title, text, ('<a href="https://www.nasa.gov" class="btn btn-primary">%s</a>\n' % btn) if btn else '')
    return '<div class="card%s">\n%s\n</div>' % (extra, inner)
def cards_row(n, cl):
    import random as _r
    rng_w = _r.sample(['Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta', 'Pie', 'Rice', 'Cake', 'Fries'], 6)
    return '<div class="container">\n<div class="row">\n' + '\n'.join('<div class="%s">\n%s\n</div>' % (cl, card(rng_w[i % len(rng_w)], 'Short text.')) for i in range(n)) + '\n</div>\n</div>'
rng_w = ['Pizza', 'Tacos', 'Soup', 'Salad', 'Pasta', 'Pie']
def e_border(rng):
    body = card(rng.choice(rng_w), rng.choice(['Fresh.', 'Hot today.', 'New menu.', 'Made daily.', 'Best seller.']))
    return Q6(rng, 26, 'The card box', 'In the card code, which class draws the outer border around the whole card?', body, 'card', ['card-body', 'card-title', 'card-text'], 'The outer div with <b>card</b> is the bordered box. card-body only adds padding inside it.',
        [ck6(check_page(body), "[W.getComputedStyle(d.querySelector('.card')).borderTopWidth, W.getComputedStyle(d.querySelector('.card-body')).borderTopWidth]", ['1px', '0px'], 1000)])
def e_across(rng):
    n = rng.choice([2, 3, 4]); cl = {2: 'col-6', 3: 'col-4', 4: 'col-3'}[n]
    if rng.random() < .5: cl = 'col-md-' + cl.split('-')[1]; phone = rng.random() < .5
    else: phone = False
    body = cards_row(n, cl); w = 400 if phone else 1000; val = n if phone else 1
    return Q6(rng, 26, 'Cards in columns', 'A row holds %d cards, each inside a div with the class `%s`. How many lines of cards do you see on %s?' % (n, cl, 'a phone (400 pixels wide)' if phone else 'a laptop (1000 pixels wide)'), body, str(val), [x for x in ('1', '2', '3', '4') if x != str(val)][:3],
        'The cards sit inside columns, so they follow the grid: %s' % ('with the md classes they stack on a phone, one per line.' if phone else 'they fit side by side on one line.'), [ck6(check_page(body), TOPS, val, w)])
def e_img(rng):
    body = card('Launch', 'Soon.', img=True)
    return Q6(rng, 26, 'card-img-top', 'The first thing inside the card is an image with the class `card-img-top`. Where does it appear?', body, 'At the top of the card, as wide as the card', ['Under the title', 'Inside the card-body padding', 'Outside and above the card'],
        'card-img-top makes an image fill the card\'s width at the top.', [ck6(check_page(body), "(function(){var i=d.querySelector('.card-img-top').getBoundingClientRect(), c=d.querySelector('.card').getBoundingClientRect(); return Math.abs(i.width-(c.width-2))<2 && Math.round(i.top-c.top)<=1})()", True, 1000)])
def e_which(rng):
    items = [('the padding around the title, text and button', 'card-body', ['card', 'card-img-top', 'card-text']), ('the heading inside a card', 'card-title', ['card-body', 'card-text', 'card']), ('the paragraph inside a card', 'card-text', ['card-title', 'card-body', 'card']), ('an image at the top of a card', 'card-img-top', ['card-body', 'card-title', 'card']), ('the outer box of the whole card', 'card', ['card-body', 'card-title', 'card-text'])]
    stem, right, wrong = rng.choice(items)
    return mkq(rng, 26, 'Card classes', 'Which class goes on %s?' % stem, None, '<code>%s</code>' % right, ['<code>%s</code>' % x for x in wrong], 'card is the outer box; card-img-top, card-body, card-title and card-text go on the pieces inside it.', [])
def e_dark(rng):
    body = card('Night', 'Dark.', extra=' bg-dark text-white')
    return Q6(rng, 26, 'Colored cards', 'The card has the extra classes `bg-dark text-white`. What color are the card and its words?', body, 'A dark card with white words', ['A white card with dark words', 'A dark card with dark words', 'A blue card'], 'The bg- and text- classes from 6.3 work on a card too.',
        [ck6(check_page(body), "[W.getComputedStyle(d.querySelector('.card')).backgroundColor, W.getComputedStyle(d.querySelector('.card-title')).color]", ['rgb(33, 37, 41)', 'rgb(255, 255, 255)'], 1000)])
L26_T = [e_border, e_across, e_img, e_which, e_dark]
L26_FACTS = [
 ('What is a Bootstrap card?', 'A flexible content box built from classes on nested divs', ['A kind of image tag', 'A link tag', 'A form field'], 'Image on top, a title, some text, maybe a button.'),
 ('Which class goes on the outer div of a card?', 'card', ['card-body', 'card-box', 'box'], 'The outer div with card is the bordered box.'),
 ('What does card-body do?', 'Adds padding around everything below the image', ['Draws the border', 'Makes the title bold', 'Adds the image'], 'It holds the title, text and button.'),
 ('Where does a card-img-top image go?', 'First inside the card, above the card-body', ['Inside the card-title', 'After the button', 'Outside the card'], 'It fills the card\'s width at the top.'),
 ('How do you lay out a row of cards?', 'Put each card inside a col div inside a row', ['Put cards directly in the body', 'Use the card-row class', 'Put them in a navbar'], 'A card and the grid are almost always used together.'),
 ('Which classes go on the heading and paragraph inside a card?', 'card-title and card-text', ['card-body and card', 'title and text', 'card-head and card-p'], 'They give spacing and sizing.'),
 ('Three cards sit in col-md-4 columns. What happens on a phone?', 'They stack, one card per line', ['They shrink to a third of the screen', 'They disappear', 'They overlap'], 'The md columns are full width below 768 pixels.'),
 ('A button inside a card uses which classes?', 'btn and a color class like btn-primary', ['card-btn', 'card-button', 'button only'], 'It is just a regular Bootstrap button from 6.3.'),
]
# ==================================================================================================== 6.6 forms (27)
def form(fields, button=True, ids=False):
    out = ['<form>']
    for k, (kind, label) in enumerate(fields):
        fid = 'f%d' % k
        lab = '<label%s class="form-label">%s</label>' % ((' for="%s"' % fid) if ids else '', label)
        inp = '<textarea%s class="form-control"></textarea>' % ((' id="%s"' % fid) if ids else '') if kind == 'textarea' else '<input type="%s"%s class="form-control">' % (kind, (' id="%s"' % fid) if ids else '')
        out.append('<div class="mb-3">\n%s\n%s\n</div>' % (lab, inp))
    if button: out.append('<button type="submit" class="btn btn-primary">Send</button>')
    out.append('</form>')
    return '\n'.join(out)
F6 = [('email', 'Email'), ('text', 'Name'), ('password', 'Password'), ('textarea', 'Message'), ('number', 'Age'), ('text', 'City')]
def f_width(rng):
    fields = rng.sample(F6, 2); with_ = rng.random() < .5; body = form(fields)
    if not with_: body = body.replace(' class="form-control"', '')
    right = 'Full width of the container' if with_ else 'A small default width'
    return Q6(rng, 27, 'form-control', 'The form fields %s the class `form-control`. How wide is the first field?' % ('have' if with_ else 'do not have'), body, right, [x for x in ('Full width of the container', 'A small default width', 'Exactly half the screen', 'It is hidden') if x != right][:3],
        'form-control makes a field full width, padded and clean-bordered. Without it the browser draws a small plain box.', [ck6(check_page('<div class="container">' + body + '</div>'), "(function(){var i=d.querySelector('input,textarea').getBoundingClientRect(), c=d.querySelector('form').getBoundingClientRect(); return Math.abs(i.width-c.width)<2})()", with_, 1000)])
def f_which(rng):
    items = [('the label above a field', 'form-label', ['form-control', 'mb-3', 'btn']), ('an input or a textarea', 'form-control', ['form-label', 'mb-3', 'form-input']), ('the div that wraps each field, to space the fields apart', 'mb-3', ['form-label', 'form-control', 'p-3'])]
    stem, right, wrong = rng.choice(items)
    return mkq(rng, 27, 'Form classes', 'Which class goes on %s?' % stem, None, '<code>%s</code>' % right, ['<code>%s</code>' % x for x in wrong], 'form-label goes on labels, form-control on inputs and textareas, and mb-3 on the div around each field.', [])
def f_space(rng):
    with_ = rng.random() < .5; fields = rng.sample(F6, 2); body = form(fields, button=False)
    if not with_: body = body.replace('<div class="mb-3">', '<div>')
    right = 'There is space under each field' if with_ else 'The fields are crowded together'
    return Q6(rng, 27, 'mb-3', 'The div around each field %s the class `mb-3`. What do you see?' % ('has' if with_ else 'does not have'), body, right, [x for x in ('There is space under each field', 'The fields are crowded together', 'The fields are hidden', 'The labels are bold') if x != right][:3],
        'mb-3 adds margin at the bottom of the wrapping div, so fields do not crowd each other.', [ck6(check_page('<div class="container">' + body + '</div>'), "(function(){var w=d.querySelector('form > div'); return parseFloat(W.getComputedStyle(w).marginBottom) >= 16})()", with_, 1000)])
def f_click(rng):
    good = rng.random() < .5; fields = [rng.choice(F6)]; body = form(fields, button=False, ids=True)
    if not good: body = body.replace(' id="f0"', ' id="other"')
    right = 'The field is selected (ready for typing)' if good else 'Nothing happens: the label is not linked to the field'
    js = "(function(){var l=d.querySelector('label'); l.click(); return d.activeElement === d.querySelector('input,textarea')})()"
    return Q6(rng, 27, 'label for and id', 'The label has `for="f0"`. The field has %s. What happens when you click the label?' % ('`id="f0"`' if good else '`id="other"`'), body, right, [x for x in ('The field is selected (ready for typing)', 'Nothing happens: the label is not linked to the field', 'The form is sent', 'The page reloads') if x != right][:3],
        'A label is linked to a field when the label\'s for matches the field\'s id. Clicking a linked label selects the field.', [ck6(check_page(body), js, good, 1000)])
def f_type(rng):
    k, label = rng.choice([('textarea', 'Message'), ('email', 'Email'), ('text', 'Name'), ('password', 'Password'), ('number', 'Age')])
    body = form([(k, label)], button=False)
    right = {'textarea': 'A textarea tag with form-control', 'email': 'An input with type="email" and form-control', 'text': 'An input with type="text" and form-control', 'password': 'An input with type="password" and form-control', 'number': 'An input with type="number" and form-control'}[k]
    wrong = [x for x in ('A textarea tag with form-control', 'An input with type="email" and form-control', 'An input with type="text" and form-control', 'An input with type="password" and form-control', 'An input with type="number" and form-control', 'A button with form-control') if x != right]
    return mkq(rng, 27, 'Field types', 'The form needs a field for the label "%s". Which field does the code use?' % label, body, right, rng.sample(wrong, 3), 'Short one-line answers use an input with a type; long messages use a textarea. Both get form-control.', [])
def f_pwd(rng):
    body = form([('password', 'Password')], button=False)
    return Q6(rng, 27, 'type=password', 'The field is an input with `type="password"`. What happens to what you type?', body, 'It shows as dots', ['It shows as plain letters', 'It is deleted', 'It turns into a number'], 'A password field hides the characters while you type.', [ck6(check_page(body), "d.querySelector('input').type", 'password', 1000)])
L27_T = [f_width, f_which, f_space, f_click, f_type, f_pwd]
L27_FACTS = [
 ('What does form-control do?', 'Makes an input or textarea full width, padded and clean-bordered', ['Colors the label', 'Adds a submit button', 'Spaces the fields apart'], 'It turns the plain browser default into a clean, sized field.'),
 ('Which class goes on a label?', 'form-label', ['form-control', 'label', 'mb-3'], 'It gives standard spacing above a field.'),
 ('Which tags get form-control?', 'input and textarea', ['label and form', 'button and a', 'div and p'], 'Fields get form-control.'),
 ('Why put each field in a div with mb-3?', 'So the fields do not crowd each other', ['To make the field required', 'To make the label bold', 'To submit the form'], 'mb-3 adds margin at the bottom.'),
 ('What makes a submit button?', 'A button with type="submit" and the classes btn and a color class', ['An input with form-control', 'A label with for', 'A div with mb-3'], 'It is a regular Bootstrap button from 6.3.'),
 ('How do you link a label to its field?', 'Give the field an id and give the label a for with the same name', ['Put the label inside the head', 'Give both the same class', 'Use form-link'], 'Then clicking the label selects the field.'),
 ('Why does a form field usually have a visible label?', 'So everyone, including screen reader users, knows what to type', ['Because Bootstrap requires it', 'To make the field wider', 'To change the color'], 'Placeholder text alone is not enough.'),
 ('Which tag holds a long message that can have many lines?', 'textarea', ['input type="message"', 'label', 'div'], 'A textarea is for longer text.'),
]
