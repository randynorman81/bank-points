from ist_lib import *
from units.ist_q5 import QS
import ist_lib

def page_css(css, body): return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Page</title>\n<style>\nbody { font-family: Arial, sans-serif; margin: 10px; }\n%s\n</style>\n</head>\n<body>\n%s\n</body>\n</html>' % (css.strip("\n"), body.strip("\n"))
def picture_page(title, page, caption=None, width=560):
    sid = shot_id(page); SHOTS[sid] = page
    path = os.path.join(WORK, sid + ".png")
    src = "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode() if os.path.exists(path) else ""
    t = '<div style="font:700 9.4pt Manrope;color:#1F2937;margin:0 0 5pt 2pt">%s</div>' % esc(title)
    frame = ('<div style="border:1.2pt solid #CBD5E1;border-radius:7pt;overflow:hidden;background:#fff;max-width:%dpx">'
             '<div style="background:#F1F5F9;border-bottom:1pt solid #CBD5E1;padding:4pt 8pt;font:700 7.4pt Manrope;letter-spacing:.1em;color:#64748B">WHAT THE BROWSER SHOWS</div>'
             '<img src="%s" style="display:block;width:100%%"></div>' % (width, src))
    cap = ('<figcaption>%s%s</figcaption>' % (gl.FIGMARK, caption)) if caption else ""
    return '<figure class="fig">%s%s%s</figure>' % (t, frame, cap)
def HXC(title, css, body, notes, cap=None, shot_cap=None, head=None, hnotes=None):
    """style.css with arrows from each note to the exact piece of code, the HTML it styles (the body, or an annotated head), and the page they make together (photographed in a real browser)"""
    gl.CSSMODE = True
    try: out = annot_code("style.css: " + title, css.strip("\n"), notes, caption=cap, lang="CSS")
    finally: gl.CSSMODE = False
    if head: out += annot_code("index.html: the head", head.strip("\n"), hnotes or [], lang="HTML")
    out += '<div style="font:700 8.4pt Manrope;color:#475569;margin:6pt 0 3pt 2pt">index.html (the body it styles)</div>' + gl.code_block(body.strip("\n"))
    page = page_css(css, body)
    out += picture_page("The page this code makes (both files together)", page, shot_cap)
    return ist_lib._wrap_fit("x", title + "\n" + css + body, out, page=page)
BRAND = dict(kicker="INTRO TO SOFTWARE TECHNOLOGY  ·  STUDY GUIDE", doctitle="IST", series="Intro to Software Technology Study Guide Series", site="schscomputerscience.com/ist",
             legal="Spotify, Nintendo, Netflix, Nike, Chipotle, Pinterest and NASA are trademarks of their owners, who were not involved in this guide and do not endorse it. They are used only to give realistic examples. All other names are the property of their owners.",
             trace_legend="", glance_legend="where the matching notes, walkthrough, assignment, and quiz game are on the site")

# =============================================================================== 5.1
C51 = L("5.1", "Move your styles into one file called style.css, plug it into the page with a link tag, and use classes to style some elements but not others.",
  [("external CSS", "styles kept in their own file (like `style.css`) and shared by the whole site"), ("link tag", "a head tag that plugs the CSS file into the page"), ("rule", "a selector plus the properties inside curly braces"), ("selector", "the part of a rule that says which elements it is for"), ("class", "a name you make up; every element wearing it gets the matching rule")],
  [("One remote for every room", """Until now every style lived inside a tag, in a style attribute. That works for one paragraph, but imagine a school where every classroom has its own light switch and the principal wants the lights dimmer. Someone has to walk into every room.

**External CSS** is one master panel in the office. Your styles live in **one separate file**, and every page plugs into it. A 40-page website with inline styles needs 160 edits to change one color. With an external file it needs **one**.

!key: Style rules move out of the page into a file called `style.css`. One rule in that file can style every page that links it."""),
   ("The link tag is the plug", """The CSS file does nothing on its own. The page has to be told where to find it, like plugging in a lamp. That plug is the **link tag**:

`<link rel="stylesheet" href="style.css">`

| Part | Rule |
| where | inside the **head**, never in the body: the browser needs it before it draws the page |
| closing | **no closing tag**: it stands alone, like `img` and `br` |
| rel | `rel="stylesheet"` tells the browser the file is a stylesheet |
| href | the **exact** file name. If the page says `style.css` and the file is `styles.css`, nothing is styled and no error shows |"""),
   ("Inside a CSS file: only rules", """A CSS file holds only **rules**. It is not a web page, so **no style tags** and **no quotes** around values belong in it. A rule has three parts:

| Part | Example |
| selector | `p` (says which elements the rule is for) |
| curly braces | `{ }` around the declarations |
| declaration | `color: navy;` (a property, a colon, a value, a semicolon) |

A rule for **every p tag** looks like this: `p { color: navy; }`. A tag rule is a school-wide announcement: every element of that tag hears it."""),
   ("Classes: style some, not all", """A tag rule styles **everything** of that tag. A **class** is a name tag: only the elements wearing it get the style, and you can give the same name tag to as many elements as you like.

A class needs **two matching halves**:

| Where | How it is written |
| in the HTML | `<p class="deal">`: the name goes in the class attribute with **no dot** |
| in the CSS | `.deal { ... }`: the rule starts with a **dot** before the name |

!tip: Same name in both places. The dot belongs only to the CSS side. If you write `class=".deal"` in the HTML, nothing matches."""),
   ("Tag rule or class rule?", """Use a **tag rule** for the basics that every element of a kind shares, like the color of all paragraphs. Use a **class rule** for a look only some elements should have, like one special deal paragraph. They work together: a paragraph wearing a class still gets the tag rule too, so the `deal` paragraph below is navy from the `p` rule **and** gold from the `.deal` rule."""),
  ],
  [HXC("A tag rule and a class rule", "p {\n  color: navy;\n}\n.deal {\n  background-color: gold;\n  font-size: 22px;\n}", '<p>Fresh popcorn.</p>\n<p class="deal">Two for one today.</p>\n<p>Open until nine.</p>',
       [(0, "p", "A tag rule: it reaches every p tag on the page."), (1, "color: navy", "Every paragraph gets navy text."), (3, ".deal", "A class rule: a dot, then the class name. Only elements wearing deal get it."), (4, "gold", "Only the deal paragraph gets a gold background."), (5, "22px", "And a bigger font-size, in pixels.")],
       cap="Two rules, one file: the tag rule is for everyone and the class rule is for the paragraph wearing the name tag.", shot_cap="All three paragraphs are navy. Only the middle one wears the class deal, so only it is gold and 22px."),
   HXC("Linking the file", "h1 {\n  text-align: center;\n}", '<h1>Snack Shack</h1>\n<p>Open until nine.</p>',
       [(0, "h1", "A tag rule for the heading 1."), (1, "text-align: center", "Centers the heading.")],
       head='<head>\n<title>Snack Shack</title>\n<link rel="stylesheet" href="style.css">\n</head>', hnotes=[(2, "rel=\"stylesheet\"", "Says this file is a stylesheet."), (2, "href=\"style.css\"", "The exact file name. A different name styles nothing.")],
       shot_cap="The heading is centered, because the link plugged style.css into the page.")],
  [], [("`<link>` in the body", "The page is not styled correctly or flickers.", "Put the link tag in the head, under the title."), ("`href=\"styles.css\"` when the file is `style.css`", "Nothing is styled and no error shows.", "Spell the file name exactly the same in the link and in the file."), ("`<style>` tags or quotes inside style.css", "Those are HTML habits; a CSS file holds only rules.", "Write only selector { property: value; } rules."), ("`class=\".deal\"` in the HTML", "No element matches the rule.", "Write `class=\"deal\"` in the HTML. The dot belongs only in the CSS rule."), ("`deal { ... }` in the CSS", "The browser looks for a tag called deal, so nothing changes.", "Start a class rule with a dot: `.deal { ... }`.")],
  [], QS(16), title="External CSS and Classes", kick="One file in charge of the whole site, and name tags for the elements that need their own look.", site="<b>Notes:</b> external-css-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Snack Shack &nbsp;·&nbsp; <b>Assignment:</b> Spotify Playlists &nbsp;·&nbsp; <b>Quiz game:</b> 5.1")

# =============================================================================== 5.2
C52 = L("5.2", "Point a rule at exactly one element with an id, and decide when to use a class and when to use an id.",
  [("id", "a name for one single element; written with a hash in CSS"), ("id attribute", "the part of the tag that holds the name, like `id=\"banner\"`"), ("unique", "used only once on a page"), ("hash", "the `#` symbol that starts an id rule")],
  [("Your student ID is one of a kind", """Lots of students share a grade, a homeroom or a team. Those are like **classes**. But your student ID number belongs to **exactly one person**. If the office gave the same number to two students, lunch accounts and grades would get mixed up.

An **id** in CSS works the same way: it points at **one element** and nobody else.

!key: A class can go on many elements. An id goes on one."""),
   ("Two halves, one symbol different", """Like a class, an id needs a matching pair: the name on the element in the HTML, and a rule in the CSS that uses the same name. Only the symbol changes.

| Where | Class | Id |
| in the HTML | `class="menu"` | `id="banner"` |
| in the CSS | `.menu { }` (a **dot**) | `#banner { }` (a **hash**) |

In the HTML the name goes in quotes with **no symbol in front**. In the CSS the rule starts with the **hash**."""),
   ("Class or id? Decide in five seconds", """| | Class | Id |
| how many elements | as many as you like | exactly one |
| symbol in CSS | dot | hash |
| real life | the team jersey | the student ID number |
| use it for | a look you will reuse | one special element, like the page title |

An element can wear **both** at the same time: `<p class="row" id="record">` gets the class rule **and** the id rule."""),
   ("The rule you must not break", """Every id name may be used **once per page**. Two paragraphs with `id="note"` make the page technically broken: browsers may style only the first one. If you need the same look on several elements, make it a class. If you need different looks, give each element its own id."""),
  ],
  [HXC("An id rule and a class rule", "#title {\n  color: teal;\n  text-align: center;\n}\n.row {\n  border: 2px solid gray;\n}", '<h1 id="title">Pixel Arcade</h1>\n<p class="row">Play all day.</p>\n<p class="row" id="record">Score: 9999</p>',
       [(0, "#title", "An id rule: a hash, then the id name. It reaches one element."), (1, "teal", "Teal text for the one heading."), (4, ".row", "A class rule: a dot. It reaches every element wearing row."), (5, "2px solid gray", "A thin gray border on every row.")],
       cap="The hash points at one element; the dot points at a group.", shot_cap="The heading is teal and centered. Both paragraphs wear the class row, so both have the border."),
   HXC("One element wears both", "#record {\n  background-color: gold;\n  padding: 12px;\n}\n.row {\n  border: 2px solid gray;\n}", '<p class="row">Play all day.</p>\n<p class="row" id="record">Score: 9999</p>',
       [(0, "#record", "Only the paragraph with the id record."), (1, "gold", "It gets a gold background."), (4, ".row", "Both paragraphs wear this class.")],
       shot_cap="The record paragraph has the border from its class AND the gold background from its id. The other paragraph has only the border.")],
  [], [("`#banner` rule but `class=\"banner\"` in the HTML", "The hash looks for an id, so nothing matches.", "Make the symbol match the kind of name: hash for id, dot for class."), ("`.banner { }` for `id=\"banner\"`", "A dot looks for a class, so nothing changes.", "Use `#banner { }`."), ("`id=\"#banner\"` in the HTML", "The hash is part of the name now, so the rule does not match.", "Write `id=\"banner\"`. The hash belongs only in the CSS."), ("The same id on two elements", "The page is technically broken and only one may be styled.", "Use different ids, or make it a class."), ("An id for a look you reuse", "You end up writing one rule per element.", "Use a class for anything shared.")],
  [], QS(17), title="CSS by ID", kick="Point at exactly one element: the student ID number of the web.", site="<b>Notes:</b> css-id-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Pixel Arcade &nbsp;·&nbsp; <b>Assignment:</b> Nintendo Game Cards &nbsp;·&nbsp; <b>Quiz game:</b> 5.2")

# =============================================================================== 5.3
C53 = L("5.3", "Predict which rule wins when two rules fight, put more than one class on an element, and aim a selector at exactly the elements you mean.",
  [("specificity", "the ranking that decides which rule wins when rules disagree"), ("combined selector", "two selectors joined to aim more precisely, like `p.warning`"), ("descendant selector", "two selectors with a space between: the second is inside the first"), ("multiple classes", "several class names in one class attribute, separated by spaces")],
  [("When two rules disagree", """A teacher says "everyone wear a uniform." Your coach says "wear the team jersey today." You obey the **more specific** instruction. CSS settles arguments the same way: when two rules style the same thing, the more specific rule wins, **no matter which one is written first**.

| Strength | Kind of rule | Speaks to |
| weakest | tag rule `p` | every paragraph |
| stronger | class rule `.name` | a group |
| stronger still | id rule `#name` | one element |
| strongest | **inline style** written on the tag | that one tag |

!key: The winner is decided by who is more specific, not who is written last."""),
   ("Two classes on one element", """Think of a locker with two stickers: one for your team and one for your grade. An element can wear more than one class too. List them in the **same class attribute**, separated by a **space**, and every class rule that matches applies.

| Written | Result |
| `class="big red"` | **right**: both rules apply |
| `class="big" class="red"` | wrong: the second attribute is ignored |
| `class="big, red"` | wrong: no commas |"""),
   ("Combining selectors", """Sometimes one selector is too broad. "Every student" is too many people, but "every student on the soccer team" is exactly who the coach means. Selectors can be combined:

| Written as | Means |
| `p.warning` | only paragraphs that also wear the class warning (**no space**) |
| `ul li` | any li **inside** a ul (a **space** means inside) |
| `.warning` | anything at all that wears the class warning |"""),
   ("Why inline styles are avoided", """An inline style is a trump card: it beats class rules and id rules in your stylesheet. That sounds powerful, but it is a trap. If one element has an inline color, your CSS file can never change it again without hunting it down in the HTML. Real teams keep style rules in the stylesheet so **one file stays in charge**.

!tip: Rule of thumb: tag rules for the basics, classes for looks you reuse, ids for the one-of-a-kind element, and skip inline styles."""),
  ],
  [HXC("A class beats a tag, an id beats a class", ".warn {\n  color: green;\n}\np {\n  color: blue;\n}\n#star {\n  color: red;\n}", '<p>Fresh bread.</p>\n<p class="warn">Nuts inside.</p>\n<p class="warn" id="star">Star baker</p>',
       [(0, ".warn", "A class rule, written FIRST."), (3, "p", "A tag rule, written LAST. It still loses to the class."), (6, "#star", "An id rule: the strongest of the three.")],
       cap="Order does not decide the winner. Specificity does.", shot_cap="The first paragraph is blue (only the tag rule reaches it). The second is green (class beats tag). The third is red (id beats class)."),
   HXC("Aiming a selector", "ul li {\n  color: navy;\n}\np.warn {\n  border: 2px solid green;\n}", '<ul>\n<li>Rye</li>\n<li>Wheat</li>\n</ul>\n<ol>\n<li>Mix</li>\n</ol>\n<p class="warn">Careful</p>\n<p>Plain</p>',
       [(0, "ul li", "A space: li tags inside a ul."), (3, "p.warn", "No space: a p that also wears warn.")],
       shot_cap="Only the bulleted items are navy; the numbered item is black. Only the paragraph with the class warn has the border.")],
  [], [("`p { color: blue; }` written last, expecting it to win", "A class or id rule on the same element still wins.", "Remember the order: tag, class, id, inline. Position in the file only breaks a tie between equal rules."), ("`class=\"big\" class=\"red\"`", "The second class attribute is ignored.", "Use one attribute: `class=\"big red\"`."), ("`class=\"big, red\"`", "Commas become part of the names.", "Separate the names with a space."), ("`ul li` written as `ulli`", "There is no tag called ulli, so nothing matches.", "Put a space between the two selectors."), ("`p .warn` when you mean a paragraph wearing the class", "The space means a warn element INSIDE a paragraph.", "Write `p.warn` with no space.")],
  [], QS(18), title="Selectors and Specificity", kick="When two rules fight, the more specific one wins, and you choose how precisely to aim.", site="<b>Notes:</b> specificity-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Bakery Board &nbsp;·&nbsp; <b>Assignment:</b> Netflix Show Guide &nbsp;·&nbsp; <b>Quiz game:</b> 5.3")

# =============================================================================== 5.4
C54 = L("5.4", "Make elements react to the mouse and the keyboard with pseudo-classes, and make changes glide with a transition.",
  [("pseudo-class", "a style that applies only during a temporary state, written with a colon"), (":hover", "while the mouse is on the element"), (":focus", "while the element is selected by a click or the Tab key"), (":active", "while the element is being pressed down"), ("transition", "makes a change glide over time instead of snapping")],
  [("Styles for a moment in time", """A traffic light is not red forever: it is red while the cars need to stop. A **pseudo-class** works like that. It is a style that only applies while something is happening to an element. Nothing changes in your HTML: the browser simply watches what the user is doing.

| Pseudo-class | Applies while | Example |
| `:hover` | the mouse is on the element | a link changes color |
| `:focus` | the element is selected (clicked into or reached with the Tab key) | a link gets a yellow background |
| `:active` | the element is being pressed down | a link flashes tomato |

!key: A pseudo-class sticks to its selector with no spaces: `a:hover`, never `a :hover` or `a: hover`."""),
   ("Pseudo-classes cannot go inline", """You cannot write `:hover` inside a style attribute. A pseudo-class needs a **rule**, so it must live in a stylesheet: one more reason to keep your CSS in its own file."""),
   ("Snap or glide? The transition", """Without a transition a hover change happens like flipping a light switch: **instant**. With a transition it is more like a dimmer dial, **gliding** from one look to the other.

`transition: color 0.3s;`

| Part | Meaning |
| property | which property glides, like `color` or `background-color`. The word `all` works too |
| duration | how long the glide takes, written in **seconds** like `0.3s` |"""),
   ("Where does the transition go?", """This is the part everyone gets wrong. Put the transition on the **normal rule**, not the hover rule.

| Where | What happens |
| on the **normal** rule | glides in **and** glides back out |
| only on the **hover** rule | glides in, but **snaps back** the moment the mouse leaves |"""),
  ],
  [HXC("Hover and a smooth glide", "a {\n  color: navy;\n  transition: color 0.3s;\n}\na:hover {\n  color: red;\n}", '<p><a href="https://www.nasa.gov">NASA</a></p>',
       [(0, "a", "The normal rule for every link."), (2, "transition: color 0.3s", "On the NORMAL rule, so the color glides in and out over 0.3 seconds."), (4, "a:hover", "Tag, colon, state: no spaces."), (5, "red", "The link turns red while the mouse is on it.")],
       cap="The transition belongs on the normal rule.", shot_cap="The link is navy. While the mouse rests on it, it glides to red; when the mouse leaves, it glides back."),
   HXC("A hover card", ".card {\n  background-color: lightblue;\n  padding: 12px;\n  transition: background-color 0.5s;\n}\n.card:hover {\n  background-color: gold;\n}", '<p class="card">Hover over this card.</p>',
       [(3, "background-color 0.5s", "Property, then duration in seconds."), (5, ".card:hover", "A pseudo-class works on any element, not just links."), (6, "gold", "The card fades to gold while hovered.")],
       shot_cap="The card is light blue (the picture shows the normal state). With the mouse on it, it fades to gold.")],
  [], [("`a :hover { }` with a space", "The browser looks for something hovered INSIDE a link, so nothing happens.", "Write `a:hover` with no spaces."), ("`transition: color 0.3` without the s", "The duration is not valid, so there is no glide.", "Write the time in seconds: `0.3s`."), ("A transition only inside `a:hover`", "The link glides in, then snaps back.", "Move the transition to the normal `a` rule."), ("`:hover` in a style attribute", "Pseudo-classes cannot go inline.", "Write a rule in style.css instead."), ("`a:hovr`", "A misspelled pseudo-class does nothing.", "Check the spelling: hover, focus, active.")],
  [], QS(19), title="Pseudo-classes and Hover Effects", kick="Make the page react: a style for a moment in time, and a glide instead of a snap.", site="<b>Notes:</b> hover-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Link Lab &nbsp;·&nbsp; <b>Assignment:</b> Nike Training Club &nbsp;·&nbsp; <b>Quiz game:</b> 5.4")

# =============================================================================== 5.5
C55 = L("5.5", "Turn a container into a flex container, and use justify-content, align-items, flex-direction and gap to arrange its items.",
  [("flexbox", "a layout system for arranging items in a row or a column"), ("flex container", "the parent element that has `display: flex`"), ("flex item", "a direct child of a flex container"), ("justify-content", "spacing along the main direction (left to right in a row)"), ("align-items", "alignment across the main direction (top to bottom in a row)"), ("gap", "even space between the items")],
  [("A shelf that arranges itself", """Picture a bookshelf with a helpful robot. You tell the robot "line them up with equal gaps" or "push everything to the middle," and it does the measuring. **Flexbox** is that robot. You put it on a **container**, and it arranges the container's **direct children**, the **items**, in a row or a column.

| Name | What it is |
| container | the parent: the div that holds the items. It gets `display: flex`. This is where you write the layout rules |
| items | the direct children. They never get the flex rules themselves |
| default | the moment a container turns flex, its items jump into **one row** |

!key: The parent decides the layout. Flex rules go on the container, never on the items."""),
   ("Two properties do most of the work", """In a **row**, `justify-content` spreads the items **left to right** and `align-items` moves them **top to bottom**.

| justify-content | Where the items go |
| `flex-start` | bunched at the start |
| `center` | bunched in the middle |
| `flex-end` | bunched at the end |
| `space-between` | first at the start, last at the end, equal space between |
| `space-around` | equal space on both sides of every item |

`align-items` takes `flex-start`, `center`, `flex-end` or `stretch`. A container needs a `height` before `align-items` has room to move things."""),
   ("Direction and gap", """`flex-direction: column` stacks the items top to bottom instead of side by side. When you switch to a column, `justify-content` and `align-items` **swap jobs**: justify-content now works up and down. `gap: 20px` puts the same space between every pair of neighbors."""),
   ("The classic trick: perfect centering", """Centering something both ways used to be famously annoying. With flexbox it takes **two properties**. Set both to `center` on a container that has a height, and whatever is inside lands in the middle, every time:

`display: flex; justify-content: center; align-items: center; height: 200px;`"""),
  ],
  [HXC("A menu bar", ".nav {\n  display: flex;\n  justify-content: space-around;\n  background-color: navy;\n}\n.nav a {\n  color: white;\n}", '<div class="nav">\n<a href="https://www.nasa.gov">Home</a>\n<a href="https://www.nasa.gov">Games</a>\n<a href="https://www.nasa.gov">Help</a>\n</div>',
       [(1, "display: flex", "On the CONTAINER: its three links become items in one row."), (2, "space-around", "Equal space on both sides of every link."), (5, ".nav a", "A space: every link inside .nav.")],
       cap="The links never got a flex rule. The container arranged them.", shot_cap="The three links sit in one row across the navy bar, spread out with space around each."),
   HXC("Perfect centering", "#stage {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 120px;\n  background-color: lightblue;\n}", '<div id="stage">\n<p>Centered!</p>\n</div>',
       [(2, "justify-content: center", "Centers along the row."), (3, "align-items: center", "Centers across it, top to bottom."), (4, "height: 120px", "Without a height there is no room to center in.")],
       shot_cap="The words sit exactly in the middle of the light blue box, both ways.")],
  [], [("`display: flex` on the items", "Nothing is arranged, because the container never got the rule.", "Put `display: flex` on the parent that holds the items."), ("Items nested one level deeper", "Only direct children are flex items.", "Put the items directly inside the container."), ("`align-items: center` with no height", "There is no free room to move the items.", "Give the container a height in pixels."), ("`justify-content: centre`", "A misspelled value is ignored.", "Spell it `center`."), ("`justify-content` on the items", "Items do not arrange anything.", "Write it on the container.")],
  [], QS(20), title="Flexbox Basics", kick="Let the browser do the spacing math: a row of items, in the order and spacing you choose.", site="<b>Notes:</b> flexbox-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Flex Menu &nbsp;·&nbsp; <b>Assignment:</b> Chipotle Order Board &nbsp;·&nbsp; <b>Quiz game:</b> 5.5")

# =============================================================================== 5.6
C56 = L("5.6", "Arrange items into rows and columns at the same time with a grid, size the columns with fr, and know when to use flexbox and when to use grid.",
  [("grid container", "the parent element with `display: grid`"), ("grid item", "a direct child of the grid container"), ("fr unit", "a fraction of the remaining space"), ("grid-template-columns", "sets how many columns there are and how wide each is"), ("gap", "even space between rows and columns")],
  [("A spreadsheet for your layout", """Flexbox lines things up in one direction, like books on a shelf. A **grid** is more like a muffin tin: **rows and columns at once**. You decide how many columns the tin has, and the browser drops each item into the next open cup. Perfect for photo galleries and card layouts.

| Name | What it is |
| container | the tin: the div with `display: grid`. All the layout rules go here |
| items | the muffins: the children. You never set their width, the columns decide it |
| gap | the tin walls: even space between every row and column at once |"""),
   ("What does fr mean?", """The **fr** unit means a **fraction of the leftover space**. Think of splitting a pizza after you set aside a fixed slice for yourself: every fr gets a share of what remains.

| Written | Result |
| `1fr 1fr 1fr` | three **equal** columns |
| `1fr 2fr` | two columns, the second **twice as wide** |
| `1fr 100px` | a fixed 100px column and one that takes the rest |

!key: `display: grid` turns the grid on. `grid-template-columns` makes it a grid you can see. With no columns you get one wide column and everything stacks like normal."""),
   ("Columns on the container, never widths on the items", """If you write `width: 33%` on every item you are fighting the grid. Let the columns decide: write them **once, on the container**. The items are placed in order, row by row: six items in three columns make two rows. The gaps use space first, then the fr columns share what is left: in a 600px grid with three equal columns and a `gap` of 30px, each column is (600 - 2 x 30) / 3 = **180px** wide."""),
   ("Flexbox or grid?", """| | Flexbox | Grid |
| direction | one direction at a time | rows and columns together |
| best for | menus, a row of buttons, centering | galleries, card layouts, page sections |
| you size things with | `justify-content` spacing | `grid-template-columns` on the container |"""),
  ],
  [HXC("Three equal columns", ".gallery {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 12px;\n}\n.photo {\n  background-color: lightblue;\n  padding: 12px;\n  text-align: center;\n}", '<div class="gallery">\n<div class="photo">1</div>\n<div class="photo">2</div>\n<div class="photo">3</div>\n<div class="photo">4</div>\n<div class="photo">5</div>\n<div class="photo">6</div>\n</div>',
       [(1, "display: grid", "Turns the container into a grid."), (2, "1fr 1fr 1fr", "Three equal columns."), (3, "gap: 12px", "12 pixels between every row and column."), (5, ".photo", "The look of each item. No width: the columns decide it.")],
       cap="Columns are written once, on the container.", shot_cap="Six photos make two rows of three, with an even gap between them."),
   HXC("A fixed column and a flexible one", ".layout {\n  display: grid;\n  grid-template-columns: 100px 1fr;\n  gap: 10px;\n}\n.side {\n  background-color: gold;\n}\n.main {\n  background-color: lightyellow;\n}", '<div class="layout">\n<div class="side">Menu</div>\n<div class="main">The main part of the page.</div>\n</div>',
       [(2, "100px 1fr", "The first column is always exactly 100px. The second takes the rest.")],
       shot_cap="The gold sidebar is exactly 100 pixels wide. The light yellow main part takes all the space that is left.")],
  [], [("`display: grid` with no columns", "One wide column: everything stacks like normal.", "Add `grid-template-columns`."), ("`grid-template-columns: 1fr, 1fr, 1fr`", "Commas make the value invalid.", "Separate the sizes with spaces: `1fr 1fr 1fr`."), ("`width: 33%` on every item", "You fight the grid.", "Put the column sizes on the container."), ("`grid-template-column` (no s)", "A misspelled property is ignored.", "Spell it `grid-template-columns`."), ("`display: grid` on the items", "Items do not arrange anything.", "Put it on the container.")],
  [], QS(21), title="CSS Grid Basics", kick="Rows and columns at the same time: a muffin tin for your layout.", site="<b>Notes:</b> grid-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Photo Gallery &nbsp;·&nbsp; <b>Assignment:</b> Pinterest Boards &nbsp;·&nbsp; <b>Quiz game:</b> 5.6")

UNIT = Unit(5, "Intro to CSS", "Move your styles into one file, style with classes and ids, predict which rule wins, react to the mouse, and lay out a page with flexbox and grid.",
    "Intro to CSS and Layout", "#7C3AED", "#6D28D9", "#C4B5FD", "#EDE9FE", "html",
    ["Link an external style.css file and write tag rules", "Style some elements with a class and one element with an id", "Predict which rule wins: tag, class, id, then inline", "Write pseudo-class rules and glide with a transition", "Arrange items with flexbox", "Build rows and columns with a grid"],
    [C51, C52, C53, C54, C55, C56], glossary=[], brand=BRAND, seed=15)
from units.ist_extra import enrich as _enrich; _enrich(UNIT)
