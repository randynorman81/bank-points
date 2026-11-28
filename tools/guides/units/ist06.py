from ist_lib import *
from units.ist_q6 import QS
import ist_lib

BSCSS = open(os.path.join(ROOT, "tools", "bs6", "bootstrap-5.3.9.min.css"), encoding="utf-8").read()
CDNLINK = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet">'
GRIDCSS = "<style>.row > * { outline: 1.5px dashed #6366F1; background-color: #EEF2FF; }</style>"
def page_live(body, grid=False): return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Page</title>\n%s\n%s</head>\n<body>\n%s\n</body>\n</html>' % (CDNLINK, (GRIDCSS + "\n") if grid else "", body.strip("\n"))
def page_shot(body, grid=False): return page_live(body, grid).replace(CDNLINK, "<style>%s</style>" % BSCSS)
def picture_bs(title, body, caption=None, w=560, grid=False):
    shot = page_shot(body, grid); sid = shot_id(shot + str(w)); SHOTS[sid] = dict(html=shot, w=w)
    path = os.path.join(WORK, sid + ".png")
    src = "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode() if os.path.exists(path) else ""
    t = '<div style="font:700 9.4pt Manrope;color:#1F2937;margin:0 0 5pt 2pt">%s</div>' % esc(title + (" (dashed outlines are added only in this picture, so you can see the columns)" if grid else ""))
    frame = ('<div style="border:1.2pt solid #CBD5E1;border-radius:7pt;overflow:hidden;background:#fff;max-width:560px">'
             '<div style="background:#F1F5F9;border-bottom:1pt solid #CBD5E1;padding:4pt 8pt;font:700 7.4pt Manrope;letter-spacing:.1em;color:#64748B">WHAT THE BROWSER SHOWS (%s)</div>'
             '<img src="%s" style="display:block;width:100%%"></div>' % ("on a phone, 480 pixels wide" if w < 600 else "on a laptop, 1000 pixels wide", src))
    cap = ('<figcaption>%s%s</figcaption>' % (gl.FIGMARK, caption)) if caption else ""
    return '<figure class="fig">%s%s%s</figure>' % (t, frame, cap)
def HXB(title, body, notes, cap=None, shot_cap=None, phone_cap=None, head=None, hnotes=None, w=1000, grid=False):
    """the HTML (annotated with arrows) and the page it makes with the real Bootstrap stylesheet, photographed in a real browser at a laptop width (and, when phone_cap is given, at a phone width too)"""
    out = annot_code(title, body.strip("\n"), notes, caption=cap, lang="HTML") if notes else gl.code_block(body.strip("\n"))
    if head: out += annot_code("index.html: the head", head.strip("\n"), hnotes or [], lang="HTML")
    out += picture_bs("The page this code makes", body, shot_cap, w=w, grid=grid)
    if phone_cap: out += picture_bs("The same page on a phone", body, phone_cap, w=480, grid=grid)
    return ist_lib._wrap_fit("x", title + "\n" + body, out, page=page_live(body, grid))
BRAND = dict(kicker="INTRO TO SOFTWARE TECHNOLOGY  ·  STUDY GUIDE", doctitle="IST", series="Intro to Software Technology Study Guide Series", site="schscomputerscience.com/ist",
             legal="Duolingo, Airbnb, YouTube, Apple, Etsy, Pizza Hut and NASA are trademarks of their owners, who were not involved in this guide and do not endorse it. They are used only to give realistic examples. Bootstrap is a trademark of its authors and is released under the MIT license. All other names are the property of their owners.",
             trace_legend="", glance_legend="where the matching notes, walkthrough, assignment, and quiz game are on the site")
L1 = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet">'

# =============================================================================== 6.1
C61 = L("6.1", "Add Bootstrap to a page with one link tag, see what changes before you add a single class, and let your own style.css win by linking it second.",
  [("framework", "a big collection of ready-made code; Bootstrap is a CSS framework"), ("Bootstrap", "a giant pre-written stylesheet full of ready-made classes"), ("CDN", "a network of servers that hosts files so you only link to their address"), ("link tag", "the head tag that plugs a stylesheet into the page")],
  [("Two units of your own CSS, and now a shortcut", """You have spent two units writing every style yourself. A **framework** is a big collection of ready-made code you can reuse. **Bootstrap** is a **CSS framework**: a giant, pre-written stylesheet full of ready-made classes for layouts, buttons, navigation bars and forms. Instead of writing rules, you add the right **class name** to a tag and Bootstrap's styles apply.

Millions of real websites use Bootstrap, which is why a page built with it looks professional by default. The tradeoff: pages built from the same framework can start to look alike."""),
   ("Linking Bootstrap", """Bootstrap is loaded the same way you load any external CSS file: a **link tag** in the **head**. Because Bootstrap is hosted on a **CDN** (Content Delivery Network), you do not upload any files: you link to the address Bootstrap publishes. This course uses version **5.3.9**.

`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet">`

| Part | Rule |
| where | inside the **head**, under the title |
| closing | **no closing tag**: it stands alone |
| address | the exact https:// address of Bootstrap's css file |
| official copy | the one on getbootstrap.com has two extra attributes, `integrity` and `crossorigin`. They are optional: the short link works the same |"""),
   ("What changes before you add a class", """The moment the link is added, plain tags look different: a modern sans-serif font replaces the serif default, headings get lighter, lists and paragraphs get comfortable spacing. You have written **no classes** yet. Everything else in this unit is about adding classes to get more."""),
   ("Your own CSS and Bootstrap together", """Bootstrap and your own rules can live on the same page, even on the same tag. When two rules are **equally specific**, the one that comes **last** wins. So link **your own style.css under the Bootstrap link**:

`<link href="...bootstrap.min.css" rel="stylesheet">` then `<link rel="stylesheet" href="style.css">`

!key: Bootstrap first, your own file second. If you swap them, Bootstrap's rule comes last and wins."""),
  ],
  [HXB("Plain page", '<h1>Robotics Club</h1>\n<p>We build robots and meet on Fridays.</p>\n<ul>\n<li>Wiring</li>\n<li>Coding</li>\n</ul>', [(0, "<h1>", "Plain tags, no classes, no Bootstrap link: the browser's own style.")], shot_cap="Without the link: a serif font, a very bold heading and a tight list."),
   HXB("The same page with the Bootstrap link", '<h1>Robotics Club</h1>\n<p>We build robots and meet on Fridays.</p>\n<ul>\n<li>Wiring</li>\n<li>Coding</li>\n</ul>', [(0, "<h1>", "The very same tags. Only the link in the head changed.")], shot_cap="With the link: a clean sans-serif font and a lighter heading. Not one class was added.")],
  [], [("The Bootstrap `<link>` in the body", "The page is not styled correctly.", "Put the link in the head, under the title."), ("`bootstrap.min.cs` or `http://` in the address", "The file does not load, so every class does nothing and no error shows.", "Copy the address exactly, starting with https://."), ("Adding classes but forgetting the link", "The classes seem to do nothing.", "If a Bootstrap class does nothing, check the head for the link first."), ("Your style.css link ABOVE the Bootstrap link", "Bootstrap's rules come last and win over yours.", "Link your own file under Bootstrap's."), ("A closing `</link>` tag", "A link tag stands alone.", "Delete the closing tag.")],
  [], QS(22), title="Setting Up Bootstrap", kick="One link tag turns on a whole stylesheet: no classes needed to see the difference.", site="<b>Notes:</b> 9-1-setting-up-bootstrap &nbsp;·&nbsp; <b>Walkthrough:</b> Robotics Club &nbsp;·&nbsp; <b>Assignment:</b> Duolingo Study Tips &nbsp;·&nbsp; <b>Quiz game:</b> 6.1")

# =============================================================================== 6.2
C62 = L("6.2", "Build layouts with Bootstrap's 12-column grid: a container, rows inside it, and columns inside each row, including columns that stack on phones.",
  [("grid", "Bootstrap's system for laying out content in rows and columns"), ("container", "the wrapper that centers your content and adds side padding"), ("row", "one horizontal line of columns"), ("column", "a div with a col class; every row has 12 columns to share"), ("breakpoint", "the screen width where a layout changes (768 pixels for md)")],
  [("Three nested pieces, always in this order", """Bootstrap's grid is built from three pieces that nest **in this order**:

| Class | Goes on | What it does |
| `container` | a wrapping div | centers your content and adds side padding, with a maximum width |
| `row` | a div inside the container | starts one horizontal line of columns |
| `col-6` | a div inside the row | one column; every row has 12 to share |

!key: container, then row, then columns. Skip a piece and the grid stops working properly."""),
   ("Counting to 12", """The number in `col-6` says how many of the row's **12 columns** that column takes.

| Written | Result |
| `col-6` + `col-6` | 6 + 6 = 12: two halves |
| `col-4` ×3 | 4 + 4 + 4 = 12: three equal columns |
| `col-4` + `col-8` | a narrow and a wide column |
| plain `col` (no number) | shares the leftover space evenly among however many you use |
| more than 12 in total | the extra column **wraps** to a new line |"""),
   ("Columns that stack on phones", """A column like `col-6` keeps its share on every screen, even a phone. A **responsive** column, like **col-md-6**, takes its share only on **medium screens and wider** (768 pixels and up). Below that breakpoint it becomes **full width**, so the columns **stack**. This is why Bootstrap layouts adapt to phones with no extra work from you."""),
   ("Rows are separate lines", """Each row is its own line. Two rows never affect each other: put a row of `col-4` columns under a row of `col-6` columns and both rows fill their own 12."""),
  ],
  [HXB("Two halves and three thirds", '<div class="container">\n<div class="row">\n<div class="col-6">Scores</div>\n<div class="col-6">Players</div>\n</div>\n<div class="row">\n<div class="col-4">Wins</div>\n<div class="col-4">Losses</div>\n<div class="col-4">Ties</div>\n</div>\n</div>',
       [(0, "container", "The outer wrapper."), (1, "row", "One line of columns."), (2, "col-6", "6 of 12: half the row."), (6, "col-4", "4 of 12: a third.")], cap="Container, then row, then columns.", shot_cap="Row one is two halves. Row two is three equal thirds.", phone_cap="col-6 and col-4 do not change on a phone: the same columns, just narrower.", grid=True),
   HXB("Stack on phones", '<div class="container">\n<div class="row">\n<div class="col-md-8">Schedule</div>\n<div class="col-md-4">Notes</div>\n</div>\n</div>',
       [(2, "col-md-8", "8 of 12 on medium screens and wider."), (3, "col-md-4", "4 of 12. On a phone both are full width.")], shot_cap="On a laptop: a wide column and a narrow column side by side.", phone_cap="Below 768 pixels the columns stack, each full width.", grid=True)],
  [], [("A `col` div with no `row` around it", "The columns stack instead of lining up.", "Put the columns inside a row."), ("A row with no `container`", "The content reaches the screen edges with no side padding.", "Wrap the rows in a container."), ("`col6` or `column-6`", "Not Bootstrap classes, so the div just takes its own line.", "Spell it `col-6`, with the hyphen."), ("Columns that add up to more than 12", "The extra column wraps to a new line.", "Make the numbers in one row add up to 12 or less."), ("`col-md-6` and expecting it to split on a phone", "Below 768 pixels the columns stack.", "Use col-6 if the columns should stay side by side on phones.")],
  [], QS(23), title="The Grid System", kick="Twelve columns, three nested pieces, and layouts that adapt to phones by themselves.", site="<b>Notes:</b> 9-2-the-grid-system &nbsp;·&nbsp; <b>Walkthrough:</b> Team Dashboard &nbsp;·&nbsp; <b>Assignment:</b> Airbnb Trip Planner &nbsp;·&nbsp; <b>Quiz game:</b> 6.2")

# =============================================================================== 6.3
C63 = L("6.3", "Style text, backgrounds, spacing and buttons with Bootstrap utility classes: tiny classes that each do one job and combine on a tag.",
  [("utility class", "a small, single-purpose class meant to be combined with others"), ("theme color", "one of Bootstrap's named colors: primary, secondary, success, danger, warning, info"), ("btn", "the class that makes a tag a Bootstrap button; it needs a color class too"), ("padding and margin utilities", "p-3 (padding) and mt-3, mb-3 (margin on the top or bottom)")],
  [("One class, one job", """A **utility class** does one styling job. You combine several on one tag, instead of writing a CSS rule for each.

| Class | What it does |
| `text-center` | centers text |
| `text-muted` | lighter gray text for secondary information |
| `fw-bold` | bold text |
| `text-primary`, `text-danger`, ... | colors the text with a theme color |
| `bg-primary`, `bg-dark`, `bg-light`, ... | sets the background to a theme color |
| `text-white` | white text |"""),
   ("The six theme colors", """Bootstrap limits you to a handful of named colors on purpose, so pages look consistent: **primary** (blue), **secondary** (gray), **success** (green), **danger** (red), **warning** (yellow) and **info** (light blue). They work after `text-`, `bg-` and `btn-`, like `btn-warning`.

!tip: `bg-dark` only sets the **background**. It does not change the words, so on a dark box you must add `text-white`, or the words stay dark and cannot be read."""),
   ("Spacing: p, mt and mb", """The number 0 to 5 is the size: bigger is more space.

| Class | What it does |
| `p-3` | padding on all four sides, inside the box |
| `mt-3` | margin on the top, outside the box |
| `mb-3` | margin on the bottom, outside the box |"""),
   ("Buttons", """A Bootstrap button is the class **btn** plus **one theme color class**: `btn btn-primary`. It works on a `button` tag **and** on a link, and a link styled as a button is still a link underneath.

!key: `btn` alone has padding but no color, so it looks like plain text. A color class alone, like `btn-primary`, is not a Bootstrap button either."""),
  ],
  [HXB("Text, a dark box and spacing", '<h1 class="text-center text-primary">Pixel Arcade</h1>\n<p class="text-center text-muted">Play all day</p>\n<div class="bg-dark text-white p-3">\n<h2>Sale</h2>\n<p>Today only.</p>\n</div>\n<p class="mt-3 mb-3 fw-bold">Spaced out</p>',
       [(0, "text-center text-primary", "Centered, in Bootstrap blue."), (1, "text-muted", "A softer gray."), (2, "bg-dark text-white p-3", "Dark background, white words, padding inside."), (6, "mt-3 mb-3 fw-bold", "Space above and below, and bold.")], cap="Small classes, combined on the tags.", shot_cap="A centered blue title, a gray subtitle, a dark box with white words, and bold spaced-out text."),
   HXB("Three buttons", '<button class="btn btn-primary">Join</button>\n<a href="#" class="btn btn-success">Play</a>\n<button class="btn btn-danger">Quit</button>',
       [(0, "btn btn-primary", "btn plus a theme color."), (1, "btn btn-success", "The same classes work on a link."), (2, "btn btn-danger", "A red button.")], shot_cap="A blue, a green and a red button. The middle one is a link.")],
  [], [("`bg-dark` without `text-white`", "Dark words on a dark box: nothing can be read.", "Add `text-white`."), ("`btn` alone", "Padding but no color: it looks like plain text.", "Add a color class like `btn-primary`."), ("`btn-primary` alone", "It is not a Bootstrap button.", "Write `btn btn-primary`."), ("`text-centre`, `fw-bolt`, `btn-primry`", "Misspelled classes do nothing and show no error.", "Check every class letter by letter."), ("`p-3` when you want space OUTSIDE", "p is padding, inside the box.", "Use `mt-3` or `mb-3` for margin outside.")],
  [], QS(24), title="Typography, Colors and Buttons", kick="Tiny classes that each do one job: combine them instead of writing CSS.", site="<b>Notes:</b> 9-3-typography-colors-and-buttons &nbsp;·&nbsp; <b>Walkthrough:</b> Pixel Arcade &nbsp;·&nbsp; <b>Assignment:</b> YouTube Channel Hub &nbsp;·&nbsp; <b>Quiz game:</b> 6.3")

# =============================================================================== 6.4
C64 = L("6.4", "Build a navigation bar from a nav tag and a handful of classes, and see how it lays out links on wide and narrow screens.",
  [("navbar", "the navigation bar at the top of a page"), ("navbar-brand", "the class for the site name or logo link"), ("nav-link", "the class for each link in the menu"), ("navbar-expand-lg", "puts the links in a row on screens 992 pixels wide and up")],
  [("A navbar is a nav tag with classes", """The **nav** tag becomes a Bootstrap navigation bar when it wears the class **navbar**. It reuses the **container** you know from the grid.

| Class | Goes on | What it does |
| `navbar` | the `nav` | turns the tag into a navbar |
| `navbar-dark bg-dark` | the `nav` | a dark background with light text (leave off for a light navbar) |
| `navbar-expand-lg` | the `nav` | links in a row on wide screens |
| `navbar-brand` | the site name link | bigger, bolder styling |
| `navbar-nav` | a div around the links | lays the links out together |
| `nav-link` | each link | standard spacing and hover color |"""),
   ("What navbar-expand-lg does", """On a **wide screen** (992 pixels and up) the links sit **in a row** next to the brand. On a **narrower** screen they **stack**, one under the other. Without `navbar-expand-lg` they stack at every width. This is built in, so you write no media rules."""),
   ("Colors and content", """Change the bar's color with a `bg-` class from 6.3: `bg-primary` is blue, `bg-success` green, `bg-dark` almost black. Keep `navbar-dark` for dark colors so the words stay readable. The page content goes **under** the navbar, in its own container, so it lines up with the bar."""),
  ],
  [HXB("A dark navbar", '<nav class="navbar navbar-expand-lg navbar-dark bg-dark">\n<div class="container">\n<a class="navbar-brand" href="#">NASA Hub</a>\n<div class="navbar-nav">\n<a class="nav-link" href="#">Home</a>\n<a class="nav-link" href="#">News</a>\n</div>\n</div>\n</nav>',
       [(0, "navbar-expand-lg", "Links in a row on wide screens."), (0, "navbar-dark bg-dark", "A dark bar with light text."), (1, "container", "Centers the content, like the grid."), (2, "navbar-brand", "The site name."), (3, "navbar-nav", "Wraps the links."), (4, "nav-link", "Each menu link.")], cap="A nav tag, a container, a brand and a div of links.", shot_cap="On a laptop the links sit in a row next to the brand.", phone_cap="On a phone the same links stack under the brand."),
   HXB("A colored bar over page content", '<nav class="navbar navbar-dark bg-primary">\n<div class="container">\n<a class="navbar-brand" href="#">Zoo</a>\n</div>\n</nav>\n<div class="container">\n<h1>Today</h1>\n<p>Gates open at nine.</p>\n</div>',
       [(0, "bg-primary", "A bg- class sets the bar color."), (5, "container", "The page content has its own container.")], shot_cap="A blue bar with the brand, then the page content lined up under it.")],
  [], [("A link with `nav-link` but no `navbar-nav` div", "The links lose their layout.", "Wrap the nav-links in a div with navbar-nav."), ("Leaving out `navbar-expand-lg`", "The links stack on every screen, even a wide laptop.", "Add it to the nav tag."), ("`navbar-dark` on a light background", "Light text on a light bar cannot be read.", "Use navbar-dark with dark colors like bg-dark or bg-primary."), ("`nav-lnk`, `navbar-brnd`", "Misspelled classes do nothing and show no error.", "Check every class letter by letter."), ("Page content directly under the nav with no container", "It does not line up with the bar.", "Wrap it in a container.")],
  [], QS(25), title="Navbar", kick="Almost every site has one: build it from a nav tag and five classes.", site="<b>Notes:</b> 9-4-navbar &nbsp;·&nbsp; <b>Walkthrough:</b> Space Hub &nbsp;·&nbsp; <b>Assignment:</b> Apple Store &nbsp;·&nbsp; <b>Quiz game:</b> 6.4")

# =============================================================================== 6.5
C65 = L("6.5", "Build cards, flexible boxes with an optional picture, a title, text and a button, and lay out a row of them with the grid.",
  [("card", "a flexible content box built from classes on nested divs"), ("card-body", "the padding around the title, text and button inside a card"), ("card-title and card-text", "the classes for the heading and the paragraph in a card"), ("card-img-top", "a picture that fills the width of the card at the top")],
  [("A box with parts", """Almost every shopping site, blog and social feed shows content in little rectangular boxes with a picture, a title and some text. A Bootstrap **card** builds that from nested divs:

| Class | Goes on | What it does |
| `card` | the outer div | the bordered box |
| `card-img-top` | an `img`, first inside the card | a picture that fills the card's width at the top |
| `card-body` | a div inside the card | padding around everything below the picture |
| `card-title` | a heading 5 | spacing and sizing for the title |
| `card-text` | a paragraph | spacing and sizing for the text |"""),
   ("Buttons and colors inside cards", """A button inside a card-body is the same Bootstrap button from 6.3: `btn btn-primary`. A card can also wear the color classes you know, like `bg-dark text-white`, next to `card`."""),
   ("Cards and the grid", """A card and the grid are almost always used together. Put each card **inside a column** inside a row, and the cards follow the grid: with `col-md-4` three cards sit side by side on a laptop and **stack** on a phone, each full width.

!tip: The picture goes **before** the card-body, directly inside the card."""),
  ],
  [HXB("A card with a button", '<div class="card">\n<div class="card-body">\n<h5 class="card-title">Pizza</h5>\n<p class="card-text">Hot and fresh.</p>\n<a href="#" class="btn btn-primary">Order</a>\n</div>\n</div>',
       [(0, "card", "The outer, bordered box."), (1, "card-body", "Padding around everything inside."), (2, "card-title", "The title."), (3, "card-text", "The text."), (4, "btn btn-primary", "A regular Bootstrap button.")], cap="A card is just nested divs with classes.", shot_cap="A bordered box with the title, text and a blue button spaced neatly inside."),
   HXB("A row of cards", '<div class="container">\n<div class="row">\n<div class="col-md-4">\n<div class="card">\n<div class="card-body">\n<h5 class="card-title">Soup</h5>\n</div>\n</div>\n</div>\n<div class="col-md-4">\n<div class="card">\n<div class="card-body">\n<h5 class="card-title">Salad</h5>\n</div>\n</div>\n</div>\n</div>\n</div>',
       [(2, "col-md-4", "Each card sits inside a column."), (3, "card", "The card follows the grid.")], shot_cap="Two cards side by side on a laptop.", phone_cap="On a phone the cards stack, each full width.")],
  [], [("The `card-body` missing", "The text touches the card's border.", "Put the title, text and button inside a card-body."), ("The picture AFTER the card-body", "It no longer sits at the top.", "Put the card-img-top image first, directly inside the card."), ("Cards directly in the body, with no columns", "They stack at every width and cannot sit side by side.", "Put each card in a col inside a row."), ("`card-titl`, `crad`", "Misspelled classes do nothing and show no error.", "Check every class letter by letter."), ("`bg-dark` on the card without `text-white`", "Dark words on a dark card.", "Add `text-white` next to `card`.")],
  [], QS(26), title="Cards", kick="Pictures, titles, text and buttons in tidy boxes, laid out by the grid.", site="<b>Notes:</b> 9-5-cards &nbsp;·&nbsp; <b>Walkthrough:</b> Menu Cards &nbsp;·&nbsp; <b>Assignment:</b> Etsy Gift Shop &nbsp;·&nbsp; <b>Quiz game:</b> 6.5")

# =============================================================================== 6.6
C66 = L("6.6", "Build a clean form with Bootstrap: labels linked to full-width fields, spaced apart, with a submit button.",
  [("form", "the tag that wraps a group of fields and a submit button"), ("form-label", "the class for the label above a field"), ("form-control", "the class that makes an input or textarea full width, padded and clean"), ("label for and id", "the pair that links a label to its field")],
  [("A plain field looks tiny", """A plain browser field is small and cramped. Bootstrap fixes it with two classes: **form-control** on the field and **form-label** on its label.

| Class | Goes on | What it does |
| `form-label` | a `label` | standard spacing above the field |
| `form-control` | an `input` or a `textarea` | full width, padded, clean border |
| `mb-3` | a div around each field | margin at the bottom so fields do not crowd each other |"""),
   ("The shape of one field", """Each field is a **div with mb-3** that holds a **label** and the field. An `input` has a **type** (`text`, `email`, `password`, `number`). A long message uses a **textarea**, which has an opening and a closing tag. A **submit button** is a regular Bootstrap button with `type="submit"`:

`<button type="submit" class="btn btn-primary">Send</button>`"""),
   ("Linking a label to its field", """Give the field an **id** and give the label a **for** with the **same name**. Then clicking the label selects the field, and people who use screen readers hear what each field is for. If the names do not match, the link does nothing.

!tip: A visible label is better than placeholder text alone, which disappears as soon as you type."""),
  ],
  [HXB("An email field and a send button", '<form>\n<div class="mb-3">\n<label for="email" class="form-label">Email</label>\n<input type="email" id="email" class="form-control">\n</div>\n<button type="submit" class="btn btn-primary">Send</button>\n</form>',
       [(1, "mb-3", "Space under the field."), (2, "for=\"email\"", "Links the label to the field with this id."), (2, "form-label", "Standard label spacing."), (3, "id=\"email\"", "The matching id."), (3, "form-control", "Full width and clean."), (5, "btn btn-primary", "A regular Bootstrap button.")], cap="Label, field and button, each with one class.", shot_cap="A label over a full-width field, and a blue Send button."),
   HXB("A message box", '<form>\n<div class="mb-3">\n<label for="msg" class="form-label">Message</label>\n<textarea id="msg" class="form-control"></textarea>\n</div>\n</form>',
       [(3, "textarea", "A tag for long text, with an opening and a closing tag."), (3, "form-control", "The same class styles it.")], shot_cap="A taller box for a longer message, full width.")],
  [], [("No `form-control` on the field", "The field is a small plain box.", "Add form-control to every input and textarea."), ("The label's `for` does not match the field's `id`", "Clicking the label does nothing.", "Use the same name in both."), ("No `mb-3` around each field", "The fields crowd each other.", "Wrap each field in a div with mb-3."), ("`form-control` on the label", "The classes are swapped.", "form-label goes on the label, form-control on the field."), ("An `<input>` for a long message", "An input is one line.", "Use a textarea for long text.")],
  [], QS(27), title="Forms", kick="Clean, full-width fields with linked labels, built from two classes.", site="<b>Notes:</b> 9-6-forms &nbsp;·&nbsp; <b>Walkthrough:</b> Contact Us &nbsp;·&nbsp; <b>Assignment:</b> Pizza Hut Order Form &nbsp;·&nbsp; <b>Quiz game:</b> 6.6")

for _c in [C61, C62, C63, C64, C65, C66]: _c['noonline'] = True
UNIT = Unit(6, "Bootstrap", "Build professional, responsive pages from ready-made classes: the grid, utilities and buttons, the navbar, cards and forms.",
    "Bootstrap", "#7952B3", "#6A3F9E", "#C4B5FD", "#EDE9FE", "html",
    ["Add Bootstrap to a page and let your own style.css win", "Lay out content with the 12-column grid", "Style text, colors, spacing and buttons with utility classes", "Build a navbar", "Build cards and lay them out in the grid", "Build a clean form with linked labels"],
    [C61, C62, C63, C64, C65, C66], glossary=[], brand=BRAND, seed=17)
from units.ist_extra import enrich as _enrich; _enrich(UNIT)
