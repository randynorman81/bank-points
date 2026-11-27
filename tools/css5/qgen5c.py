"""Unit 5 question templates, lessons 5.5 (20) and 5.6 (21). See qgen5.py. The layout answers are measured in real Chrome (box positions and sizes)."""
from qgen5 import *
def boxes(n, cls='box', tagn='div'): return '\n'.join('<%s class="%s">%d</%s>' % (tagn, cls, i + 1, tagn) for i in range(n))
def flexpage(cont_css, box_css, n, extra_body=''):
    return cont_css, '<div class="row">\n%s\n</div>' % boxes(n), box_css
RECT = "(function(){var r=d.querySelector('.row').getBoundingClientRect(),b=d.querySelectorAll('.box');return b.length?[Math.round(b[0].getBoundingClientRect().left-r.left),Math.round(b[0].getBoundingClientRect().top-r.top)]:null})()"
FLEX_BOX = ['background-color: gold', 'width: %dpx', 'height: %dpx']
# ==================================================================================================== 5.5 flexbox (20)
def e1_one_row(rng):
    n = rng.randint(3, 5); flex = rng.random() < .6; col = rng.choice(DARK)
    cont = rule('.row', *(['display: flex'] if flex else ['border: 2px solid %s' % col]))
    css = cont + '\n' + rule('.box', 'border: 2px solid %s' % col, 'padding: 6px'); body = '<div class="row">\n%s\n</div>' % boxes(n)
    right = 'Yes, all in one row' if flex else 'No, they stack in a column'
    js = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.box'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
    return Q5(rng, 20, 'Display flex', 'The page has a container with %d boxes. Do the boxes sit in one row?' % n, css, body, right, [x for x in ('Yes, all in one row', 'No, they stack in a column', 'Only the first two sit in a row', 'It depends on the browser') if x != right][:3],
        'The moment a container gets <b>display: flex</b>, its direct children jump into one row. Without it, div boxes are blocks and stack.' if flex else 'Without display: flex on the container the boxes are normal blocks, so they stack top to bottom.', [ck(check_page(css, body), js, 1 if flex else n)])
def e2_justify(rng):
    n = rng.choice([3, 4]); w = rng.choice([40, 50, 60, 80]); W = rng.choice([400, 500, 600]); jc = rng.choice(['flex-start', 'center', 'flex-end', 'space-between', 'space-around'])
    free = W - n * w; val = {'flex-start': 0, 'center': free / 2, 'flex-end': free, 'space-between': 0, 'space-around': free / (2 * n)}[jc]
    if val != int(val): raise Skip('fraction')
    val = int(val)
    css = rule('.row', 'display: flex', 'width: %dpx' % W, 'justify-content: %s' % jc) + '\n' + rule('.box', 'width: %dpx' % w, 'background-color: gold'); body = '<div class="row">\n%s\n</div>' % boxes(n)
    opts = sorted({val, 0, free // 2, free, free // (2 * n)}); wrong = [x for x in opts if x != val]
    if len(wrong) < 3: raise Skip('opts')
    return Q5(rng, 20, 'justify-content', 'The container is %dpx wide and holds %d boxes that are each %dpx wide. How many pixels is the first box from the left edge of the container?' % (W, n, w), css, body, '%d pixels' % val, ['%d pixels' % x for x in rng.sample(wrong, 3)],
        'The free space is %d - %d x %d = %d pixels. With <b>%s</b> %s' % (W, n, w, free, jc, {'flex-start': 'the boxes bunch at the start, so the first box touches the left edge.', 'center': 'half of the free space goes on each side: %d pixels.' % val, 'flex-end': 'the boxes bunch at the end, so all %d pixels of free space sit on the left.' % free, 'space-between': 'the free space goes between the boxes, so the first box touches the left edge.', 'space-around': 'each box gets equal space on both sides: %d pixels at the left edge.' % val}[jc]),
        [ck(check_page(css, body), RECT + '[0]', val)])
def e3_align(rng):
    H = rng.choice([120, 150, 200]); h = rng.choice([30, 40, 50]); n = rng.randint(2, 4); ai = rng.choice(['flex-start', 'center', 'flex-end'])
    val = {'flex-start': 0, 'center': (H - h) // 2, 'flex-end': H - h}[ai]
    if (H - h) % 2 and ai == 'center': raise Skip('odd')
    css = rule('.row', 'display: flex', 'height: %dpx' % H, 'align-items: %s' % ai) + '\n' + rule('.box', 'height: %dpx' % h, 'width: 60px', 'background-color: gold'); body = '<div class="row">\n%s\n</div>' % boxes(n)
    wrong = sorted({0, (H - h) // 2, H - h, h} - {val})
    return Q5(rng, 20, 'align-items', 'The container is %dpx tall and each box is %dpx tall. How many pixels is the top of the first box below the top of the container?' % (H, h), css, body, '%d pixels' % val, ['%d pixels' % x for x in (wrong + [H // 3])[:3]],
        '<b>align-items</b> works across the main direction: in a row it moves the boxes up and down. With %s the box sits %s.' % (ai, {'flex-start': 'at the top (0 pixels)', 'center': 'in the middle: (%d - %d) / 2 = %d pixels from the top' % (H, h, val), 'flex-end': 'at the bottom: %d - %d = %d pixels from the top' % (H, h, val)}[ai]),
        [ck(check_page(css, body), RECT + '[1]', val)])
def e4_direction(rng):
    n = rng.randint(3, 5); dr = rng.choice(['row', 'column']); css = rule('.row', 'display: flex', 'flex-direction: %s' % dr) + '\n' + rule('.box', 'background-color: gold', 'padding: 6px', 'margin: 4px')
    body = '<div class="row">\n%s\n</div>' % boxes(n)
    js = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.box'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
    val = 1 if dr == 'row' else n
    return Q5(rng, 20, 'flex-direction', 'The container has %d boxes and `flex-direction: %s`. How many separate lines do the boxes form from top to bottom?' % (n, dr), css, body, str(val), [x for x in count_opts(val) if x != str(val)][:3] if len([x for x in count_opts(val) if x != str(val)]) >= 3 else [str(x) for x in (1, 2, n + 1, n) if str(x) != str(val)][:3],
        'With <b>row</b> the boxes sit side by side in one line. With <b>column</b> they stack, one box per line.', [ck(check_page(css, body), js, val)])
def e5_gap(rng):
    G = rng.choice([10, 15, 20, 24, 30]); w = rng.choice([50, 60, 80]); n = rng.randint(2, 4)
    css = rule('.row', 'display: flex', 'gap: %dpx' % G) + '\n' + rule('.box', 'width: %dpx' % w, 'background-color: gold')
    body = '<div class="row">\n%s\n</div>' % boxes(n); js = "(function(){var b=d.querySelectorAll('.box');return Math.round(b[1].getBoundingClientRect().left-b[0].getBoundingClientRect().right)})()"
    return Q5(rng, 20, 'gap', 'How many pixels of empty space are between the first box and the second box?', css, body, '%d pixels' % G, ['%d pixels' % x for x in rng.sample([x for x in (0, 5, 10, 15, 20, 25, 30, 40, 2 * G, G + w) if x != G], 3)],
        '<b>gap</b> puts the same space between every pair of neighbors: %d pixels here.' % G, [ck(check_page(css, body), js, G)])
def e6_which_prop(rng):
    jc = rng.choice(['space-between', 'center', 'flex-end', 'space-around'])
    stems = {'space-between': 'You want the first box at the left edge, the last box at the right edge and equal space between them.', 'center': 'You want the group of boxes in the middle of the row.', 'flex-end': 'You want the boxes pushed to the right end of the row.', 'space-around': 'You want equal space on both sides of every box.'}
    W, w, n = 480, 60, 3; css = lambda v: rule('.row', 'display: flex', 'width: %dpx' % W, 'justify-content: %s' % v) + '\n' + rule('.box', 'width: %dpx' % w, 'background-color: gold')
    body = '<div class="row">\n%s\n</div>' % boxes(n)
    pos = lambda v: None
    wrong = [x for x in ('space-between', 'center', 'flex-end', 'space-around', 'flex-start') if x != jc]
    js = "(function(){var b=d.querySelectorAll('.box'),r=d.querySelector('.row').getBoundingClientRect();return [Math.round(b[0].getBoundingClientRect().left-r.left),Math.round(r.right-b[2].getBoundingClientRect().right)].join(',')})()"
    exp = {'space-between': '0,0', 'center': '150,150', 'flex-end': '300,0', 'space-around': '50,50', 'flex-start': '0,300'}
    # the answer is confirmed by measuring each option
    chk = [ck(check_page(css(jc), body), js, exp[jc])] + [ck(check_page(css(x), body), js, {'not': exp[jc]}) for x in rng.sample(wrong, 3)] if False else [ck(check_page(css(jc), body), js, exp[jc])]
    ws3 = rng.sample(wrong, 3)
    chk += [ck(check_page(css(x), body), js, exp[x]) for x in ws3]
    return Q5(rng, 20, 'Choose the value', stems[jc] + ' Which value of justify-content does it?', None, None, '<code>justify-content: %s</code>' % jc, ['<code>justify-content: %s</code>' % x for x in ws3], 'Measured in the browser: <b>%s</b> is the value that gives this layout.' % jc, chk)
def e7_which_element(rng):
    cont, item = rng.choice([('the div that holds the three links', 'the links'), ('the nav bar', 'each link inside it'), ('the div around the cards', 'each card')])
    return mkq(rng, 20, 'The container', 'You want %s sitting in a row with flexbox. Which element gets `display: flex`?' % item, None, cont[0].upper() + cont[1:], [item[0].upper() + item[1:] + ', one by one', 'The body only', 'The link tag in the head'], 'Flex goes on the parent (the container). The container arranges its direct children, the items.', [])
L20_T = [e1_one_row, e2_justify, e3_align, e4_direction, e5_gap, e6_which_prop, e7_which_element]
L20_FACTS = [
 ('What is a flex container?', 'The parent element that has display: flex', ['A child that sits inside a row', 'A kind of image', 'A pseudo-class'], 'The container is the parent. It arranges its direct children, the items.'),
 ('What is a flex item?', 'A direct child of a flex container', ['Any element on the page', 'The body tag', 'The first paragraph on the page'], 'Only the direct children are flex items.'),
 ('Where do the flex rules go?', 'On the container', ['On every item', 'On the link tag', 'Inside the title'], 'The parent decides the layout. The items never get the flex rules themselves.'),
 ('What happens to the items the moment a container becomes display: flex?', 'They jump into one row', ['They stack in a column', 'They disappear', 'They each get a border'], 'The default direction of a flex container is a row.'),
 ('In a row, which property spreads the items left to right?', 'justify-content', ['align-items', 'gap', 'flex-direction'], 'Justify-content controls the main direction. In a row that is left to right.'),
 ('In a row, which property moves the items up and down?', 'align-items', ['justify-content', 'gap', 'display'], 'Align-items works across the main direction.'),
 ('What does flex-direction: column do?', 'Stacks the items top to bottom', ['Makes the items sit in a row', 'Hides the items', 'Turns the items into links'], 'With a column the items stack, and justify-content and align-items swap jobs.'),
 ('Which two properties center something both ways?', 'justify-content: center and align-items: center', ['gap and display', 'width and height', 'flex-direction and gap'], 'Set both to center on a container and the item lands in the middle.'),
 ('What does gap do?', 'Puts even space between the items', ['Adds space around the container', 'Changes the color', 'Changes the row to a column'], 'Gap is the same space between every pair of neighbors.'),
 ('What does justify-content: space-between do?', 'First item at the start, last item at the end, equal space between', ['Equal space only on the left', 'Centers every item', 'Stacks the items'], 'The free space goes between the items.'),
 ('Why does `display: flex` on an item (not the container) arrange nothing?', 'The container never got the rule', ['Items cannot have any CSS', 'Flex only works on images', 'The browser ignores the word flex'], 'The class on the div that holds the items gets the flex rules.'),
]
# ==================================================================================================== 5.6 grid (21)
def cells(n): return '\n'.join('<div class="item">%d</div>' % (i + 1) for i in range(n))
def gpage(cols, n, W=600, G=0, extra=None, display=True):
    decl = (['display: grid'] if display else []) + ([] if cols is None else ['grid-template-columns: %s' % cols]) + ['width: %dpx' % W] + (['gap: %dpx' % G] if G else [])
    css = rule('.gallery', *decl) + '\n' + rule('.item', 'background-color: lightblue', 'padding: 0px')
    return css, '<div class="gallery">\n%s\n</div>' % cells(n)
WIDTHS = "Array.prototype.map.call(d.querySelectorAll('.item'),function(e){return Math.round(e.getBoundingClientRect().width)})"
LEFTS = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.item'),function(e){t[Math.round(e.getBoundingClientRect().left)]=1});return Object.keys(t).length})()"
TOPS = "(function(){var t={};Array.prototype.forEach.call(d.querySelectorAll('.item'),function(e){t[Math.round(e.getBoundingClientRect().top)]=1});return Object.keys(t).length})()"
def f1_columns(rng):
    k = rng.randint(2, 4); n = rng.randint(5, 8); cols = ' '.join(['1fr'] * k); css, body = gpage(cols, n)
    return Q5(rng, 21, 'Count the columns', 'How many columns does `grid-template-columns: %s` make?' % cols, css, body, str(k), [x for x in ('1', '2', '3', '4', '5', '6') if x != str(k)][:3],
        'Each value is one column, so %d values make %d columns.' % (k, k), [ck(check_page(css, body), LEFTS, k)])
def f2_equal(rng):
    k = rng.choice([2, 3, 4]); G = rng.choice({2: [0, 10, 20, 40], 3: [0, 6, 12, 18, 30], 4: [0, 8, 12, 16, 20]}[k]); W = rng.choice([600, 800]); val = (W - (k - 1) * G) // k
    if (W - (k - 1) * G) % k: raise Skip('frac')
    cols = ' '.join(['1fr'] * k); css, body = gpage(cols, k * 2, W, G)
    wrong = sorted({W // k, W // k - G, (W - G) // k, W // (k + 1), val + 10} - {val})
    return Q5(rng, 21, 'Column width', 'The grid is %dpx wide with %d equal columns (%s) and a gap of %dpx. How wide is each column?' % (W, k, cols, G), css, body, '%d pixels' % val, ['%d pixels' % x for x in wrong[:3]],
        'The gaps use space first: %d gaps x %dpx = %dpx. The rest, %d pixels, is shared by the %d columns, so each is %d pixels.' % (k - 1, G, (k - 1) * G, W - (k - 1) * G, k, val), [ck(check_page(css, body), WIDTHS + '[0]', val)])
def f3_ratio(rng):
    cols, parts = rng.choice([('1fr 2fr', [1, 2]), ('1fr 3fr', [1, 3]), ('1fr 1fr 2fr', [1, 1, 2]), ('2fr 1fr', [2, 1]), ('1fr 4fr', [1, 4])]); W = rng.choice([600, 500, 400]); tot = sum(parts)
    if (W * parts[-1]) % tot: raise Skip('frac')
    val = W * parts[-1] // tot; css, body = gpage(cols, 2 * len(parts), W)
    wrong = sorted({W // len(parts), W // 2, val + 50, val - 50, W // tot} - {val, 0})
    return Q5(rng, 21, 'Fractions', 'The grid is %dpx wide with `grid-template-columns: %s` and no gap. How wide is the LAST column?' % (W, cols), css, body, '%d pixels' % val, ['%d pixels' % x for x in wrong[:3]],
        'The fr values add up to %d, so one fr is %d / %d pixels. The last column has %d fr = %d pixels.' % (tot, W, tot, parts[-1], val), [ck(check_page(css, body), WIDTHS + '[%d]' % (len(parts) - 1), val)])
def f4_fixed(rng):
    fixed = rng.choice([100, 150, 200]); W = rng.choice([600, 500, 800]); G = rng.choice([0, 10, 20]); val = W - fixed - G
    css, body = gpage('%dpx 1fr' % fixed, 4, W, G)
    return Q5(rng, 21, 'A fixed column', 'The grid is %dpx wide with `grid-template-columns: %dpx 1fr` and a gap of %dpx. How wide is the second column?' % (W, fixed, G), css, body, '%d pixels' % val, ['%d pixels' % x for x in sorted({W - fixed, W // 2, fixed, val + 20} - {val})[:3]],
        'The first column takes its fixed %d pixels and the gap takes %d. The 1fr column gets everything left: %d - %d - %d = %d pixels.' % (fixed, G, W, fixed, G, val), [ck(check_page(css, body), WIDTHS + '[1]', val)])
def f5_rows(rng):
    k = rng.randint(2, 4); n = rng.randint(5, 10); rows_ = -(-n // k); cols = ' '.join(['1fr'] * k); css, body = gpage(cols, n)
    return Q5(rng, 21, 'Rows', 'The grid has %d items and `grid-template-columns: %s`. How many rows does it make?' % (n, cols), css, body, str(rows_), [x for x in (str(rows_ + 1), str(rows_ - 1 if rows_ > 1 else rows_ + 2), str(k), str(n)) if x != str(rows_)][:3],
        'The browser drops each item into the next open cup: %d items in %d columns fill %d rows (the last row may be short).' % (n, k, rows_), [ck(check_page(css, body), TOPS, rows_)])
def f6_gap(rng):
    G = rng.choice([8, 10, 12, 16, 20, 24]); k = rng.randint(2, 3); cols = ' '.join(['1fr'] * k); css, body = gpage(cols, 2 * k, 600, G)
    js = "(function(){var b=d.querySelectorAll('.item');return Math.round(b[1].getBoundingClientRect().left-b[0].getBoundingClientRect().right)})()"
    return Q5(rng, 21, 'gap', 'How many pixels of space are between the first and second item in the first row?', css, body, '%d pixels' % G, ['%d pixels' % x for x in rng.sample([x for x in (0, 4, 6, 10, 15, 20, 30, 2 * G) if x != G], 3)],
        '<b>gap</b> is the same space between every row and column at once: %d pixels.' % G, [ck(check_page(css, body), js, G)])
def f7_no_columns(rng):
    n = rng.randint(3, 6); css, body = gpage(None, n)
    return Q5(rng, 21, 'Missing columns', 'The container has `display: grid` but no `grid-template-columns`. How many columns do the %d items form?' % n, css, body, '1', ['2', '3', str(n)],
        'Without grid-template-columns you get one wide column, so everything stacks like normal. display: grid only turns the grid on.', [ck(check_page(css, body), LEFTS, 1)])
def f8_which_rule(rng):
    k = rng.randint(2, 4); n = 6; target = ' '.join(['1fr'] * k)
    right = rule('.gallery', 'display: grid', 'grid-template-columns: %s' % target)
    wrongs = [rule('.gallery', 'display: grid', 'grid-template-column: %s' % target), rule('.gallery', 'grid-template-columns: %s' % target), rule('.gallery', 'display: grid', 'grid-template-columns: %s' % ', '.join(['1fr'] * k))]
    body = '<div class="gallery">\n%s\n</div>' % cells(n)
    chk = [ck(check_page(right, body), LEFTS, k)] + [ck(check_page(c, body), LEFTS, {'not': k}) for c in wrongs]
    return Q5(rng, 21, 'Which rule works', 'Which rule makes %d equal columns?' % k, None, None, '<pre>%s</pre>' % E(right), ['<pre>%s</pre>' % E(c) for c in wrongs],
        'A grid needs <b>display: grid</b> AND <b>grid-template-columns</b> (spelled with the s) with the sizes separated by spaces, no commas.', chk)
L21_T = [f1_columns, f2_equal, f3_ratio, f4_fixed, f5_rows, f6_gap, f7_no_columns, f8_which_rule]
L21_FACTS = [
 ('What does `display: grid` do by itself?', 'Turns the grid on, but you still need columns', ['Makes three equal columns', 'Makes a row of flex items', 'Hides the container'], 'Without grid-template-columns you get one wide column.'),
 ('Which property sets how many columns a grid has and how wide each is?', 'grid-template-columns', ['grid-columns', 'columns-width', 'display-columns'], 'The container sets the column sizes with grid-template-columns.'),
 ('What does the fr unit mean?', 'A fraction of the leftover space', ['A fixed number of pixels', 'A percent of the screen', 'A font size'], 'Every fr gets a share of what remains after fixed sizes and gaps.'),
 ('How do you write three equal columns?', 'grid-template-columns: 1fr 1fr 1fr;', ['grid-template-columns: 3;', 'grid-template-columns: 1fr, 1fr, 1fr;', 'columns: 3fr;'], 'Three fr values, separated by spaces.'),
 ('Where do the layout rules for a grid go?', 'On the container, never widths on the items', ['On every item', 'On the body only', 'On the link tag'], 'Columns on the container decide the widths. You never set widths on the items.'),
 ('What is the best use of flexbox?', 'Menus, a row of buttons, and centering', ['Photo galleries only', 'Replacing every paragraph', 'Loading fonts'], 'Flexbox lines things up in one direction.'),
 ('What is the best use of grid?', 'Galleries, card layouts and page sections', ['A single row of links', 'Centering one word', 'Changing colors'], 'Grid arranges rows and columns together.'),
 ('What does `grid-template-columns: 1fr 100px` make?', 'A fixed 100px column and a column that takes the rest', ['Two equal columns', 'A 100px gap', 'Two rows'], 'The pixel column never grows; the fr column takes the rest.'),
 ('What does gap do in a grid?', 'Puts even space between every row and column', ['Changes the number of columns', 'Adds a border', 'Hides the last row'], 'Gap is the tin walls between the muffin cups.'),
 ('How do you make the second of two columns twice as wide as the first?', 'grid-template-columns: 1fr 2fr;', ['grid-template-columns: 2fr 1fr;', 'grid-template-columns: 1fr 1fr;', 'grid-template-columns: 2 1;'], 'The second value has twice as many fr.'),
]
