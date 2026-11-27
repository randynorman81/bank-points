from ist_lib import *
from units.ist_q import QS

# =============================================================================== 4.1
C312 = L("4.1", "Describe every box with four layers (content, padding, border, margin) and work out how much room a box really takes.",
  [("box model", "the idea that every element is a box built from four layers"), ("content", "the text or picture itself, sized with `width`"), ("padding", "space inside the border; it takes the background color"), ("border", "the line around the padding"), ("margin", "space outside the border; always see-through")],
  [("Four layers, like a framed photo", """Every element on a page, however round it looks, is secretly a **rectangular box**. Think of a photo on a wall. The **photo** is the **content**. The cardboard matte around it is the **padding**: space **inside** the frame. The wooden frame is the **border**. The empty wall space around the frame is the **margin**: space **outside** it.

| Layer | What it is | Takes the background color? |
| content | the text or picture, sized with `width` | yes |
| padding | space inside the border | **yes** |
| border | the outline: thickness, style, color | has its own color |
| margin | space outside the border | **never** (always see-through) |"""),
   ("Padding and margin on four sides", """Padding and margin work on all **four sides**: top, right, bottom, left. There are two ways to write them:

- **One side at a time:** `padding-top: 10px`, `padding-right: 20px`, `padding-bottom: 15px`, `padding-left: 25px` (and the same with `margin-`).
- **The shortcut:** `padding: 16px` puts 16px on **all four sides**. With **two values**, like `padding: 10px 30px`, the first is the **top and bottom** and the second is the **left and right**.

Always write the unit: `20px`, never just `20`."""),
   ("The surprise: a border adds size", """A border is not free. It takes real space, just like padding. The `width` you write is only the **content**. The box on the page is wider:

**total width = content + padding (both sides) + border (both sides)**

For example, `width: 200px; padding: 10px; border: 5px solid black` is 200 + 10 + 10 + 5 + 5 = **230px** wide on the page. The same goes for the height.

!tip: To make a box exactly 200px wide in all, plan for it: `width: 180px; border: 10px solid navy`."""),
   ("Padding takes the color, margin never does", """Put `padding: 20px; background-color: yellow` on a paragraph and the yellow fills the space around the words, **inside** the frame. Put `margin: 20px` on it and the 20px of space around it stays empty and see-through, even if you give the paragraph a background color. That one fact is how you can tell padding from margin in a picture, with no code in front of you."""),
  ],
  [HX("Padding, margin and two values", '<p style="padding: 20px;\n background-color: lightyellow">Hello</p>\n<p style="margin: 30px;\n background-color: lightpink">Hello</p>\n<p style="padding: 10px 30px;\n border: 3px solid navy">Wide</p>', [(0, "padding: 20px", "20px of space inside the box on all four sides."), (1, "lightyellow", "The padding takes the background color."), (2, "margin: 30px", "30px of space OUTSIDE the box."), (3, "lightpink", "The color covers the box only, never the margin."), (4, "padding: 10px 30px", "Two values: 10px top and bottom, 30px left and right.")], cap="The yellow box fills with color all around the words. The pink box has an empty see-through margin."),
   HX("A border adds size", '<p style="width: 200px;\n padding: 10px;\n border: 5px solid black">Box</p>', [(0, "width: 200px", "Only the content is 200px wide."), (1, "padding: 10px", "10px on the left and 10px on the right: +20px."), (2, "border: 5px solid black", "5px on each side: +10px.")], cap="Total width on the page: 200 + 20 + 10 = 230 pixels.")],
  [TX("Padding and margin", '<p style="padding: 20px;">Hello</p>\n<p style="margin: 30px;">Gap</p>\n<p>Plain</p>', cap="Each line adds one paragraph. Padding and margin change the space around the words, not the words themselves."),
   TX("One side at a time", '<h2 style="padding-left: 40px;">Menu</h2>\n<p style="margin-top: 10px; padding-bottom: 6px;">Soup</p>', cap="padding-left moves the heading text 40px in from its box edge. The words on the page do not change."),
   TX("Colors and the box model", '<p style="padding: 16px; background-color: yellow;">Sale</p>\n<p style="margin: 30px; background-color: pink;">Gap</p>\n<p style="border: 3px solid navy; padding: 10px 30px;">Boxed</p>', cap="The yellow fills the padding. The pink does not fill the margin. The third box has a border with two-value padding.")],
  [("`padding: 20` with no unit", "A size needs a unit, so the browser ignores it.", "Write `padding: 20px`."), ("`margin: 20px; background-color: yellow` and expecting yellow space", "Margin is outside the border and is always see-through.", "Use padding if you want the color to fill the space."), ("`width: 200px` and expecting a 200px box with a border and padding", "The border and padding add to the width: the box is wider.", "Add them up, or write a smaller width."), ("`padding: 10px 30px` read as left then top", "Two values are top and bottom first, then left and right.", "Remember: vertical first, then horizontal."), ("`padding-lef: 40px`", "A misspelled property is ignored.", "Spell it `padding-left`."), ("`margin-top: 10` and `margin: 10px; 20px`", "No unit, or a stray semicolon, breaks the style.", "Write `margin-top: 10px` and `margin: 10px 20px`.")],
  [], QS(11), title="Box Model", kick="Every element is a box with four layers. Learn padding, margin, and why a border makes a box bigger.", site="<b>Notes:</b> box-model-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Postcard Studio &nbsp;·&nbsp; <b>Assignment:</b> Etsy Shop Cards &nbsp;·&nbsp; <b>Quiz game:</b> 4.1")

# =============================================================================== 4.2
C313 = L("4.2", "Name colors with words or hex codes, and read a hex code as three pairs: red, green and blue.",
  [("named color", "a color with a name, like `tomato` or `navy`"), ("hex code", "`#` plus 6 characters that give an exact shade"), ("RGB pair", "two characters of a hex code that control red, green or blue (00 to FF)"), ("color picker", "a tool that gives you the hex code for any shade you pick")],
  [("Two ways to name a color", """You can describe a color with a **word** almost everyone understands, like `red`, or with **exact numbers** a computer can copy perfectly. HTML lets you use both and the style does not change. Only what you type after the colon changes:

`color: tomato;` and `color: #FF6347;` give the **identical** color.

Names are easy to read. Hex codes are exact and unlimited: they give 16.7 million shades."""),
   ("Named colors", """HTML has more than 140 built-in color names, like `tomato`, `navy`, `gold`, `teal`, `crimson` and `slateblue`. Type the name directly: **no `#` and no quotes**. You do not have to memorize them, only spell correctly the ones you use. The full list is on the HTML Color Names page."""),
   ("How a hex code works", """A hex code is `#` followed by **6 characters** (0 to 9 and A to F), split into **three pairs**: **R**ed, **G**reen, **B**lue. Each pair runs from `00` (none of that color) to `FF` (the most).

| Hex code | Meaning |
| `#FF0000` | all red, no green, no blue: **pure red** |
| `#00FF00` | pure green |
| `#0000FF` | pure blue |
| `#FFFFFF` | the most of all three: **white** |
| `#000000` | none of any: **black** |

Reading trick: the closer a pair is to `FF`, the more of that color is mixed in."""),
   ("Finding a hex code", """Search "color picker" on Google, click a shade, then copy the **HEX** field (like `#3B82F6`) and paste it after `color:` or `background-color:`. Real brands have official hex codes too.

!warn: A hex code **must** start with `#` and have exactly 6 characters. `FF6347` (no #), `#FF634` (5 characters) and `#FF63G7` (a G) are all ignored by the browser."""),
  ],
  [HX("Names, hex codes and pure colors", '<p style="color: tomato">Name</p>\n<p style="color: #FF6347">Hex: same color</p>\n<p style="color: #FF0000">Pure red</p>\n<p style="color: #00FF00">Pure green</p>\n<p style="color: #0000FF">Pure blue</p>', [(0, "tomato", "A named color."), (1, "#FF6347", "The same color written as a hex code."), (2, "#FF0000", "FF red, 00 green, 00 blue: pure red."), (3, "#00FF00", "Only the green pair is FF."), (4, "#0000FF", "Only the blue pair is FF.")], cap="The first two lines are exactly the same color."),
   HX("Hex codes for text and background", '<body style="background-color: #F0F9FF">\n<h1 style="color: #0C4A6E">Calm</h1>\n<p style="color: #FFFFFF;\n background-color: #1B2A4A">Night card</p>\n</body>', [(0, "#F0F9FF", "A very light blue: every pair is close to FF."), (1, "#0C4A6E", "A dark blue: every pair is small."), (2, "#FFFFFF", "White text."), (3, "#1B2A4A", "A dark navy background behind it.")], cap="Light pairs make a light color; small pairs make a dark one.")],
  [TX("Hex text colors", '<h1 style="color: #FF6347;">Sale</h1>\n<p style="color: tomato;">Same color</p>\n<p>Default black</p>', cap="The first two paragraphs show the same color, written two ways. The third has no color style."),
   TX("Pure colors", '<p style="color: #FF0000;">Red</p>\n<p style="color: #00FF00;">Green</p>\n<p style="color: #0000FF;">Blue</p>', cap="Only one pair is FF in each code, so each paragraph is a pure color."),
   TX("The body color reaches the page", '<body style="color: #1B2A4A;">\n<h2>Navy ink</h2>\n<p style="color: #FF6347;">Warm accent</p>\n</body>', cap="The heading has no color of its own, so it uses the body color #1B2A4A. The paragraph keeps its own tomato hex code.")],
  [("`color: FF6347` (no #)", "A hex code needs a # at the front.", "Write `color: #FF6347`."), ("`color: #FF634` (5 characters)", "A hex code has exactly 6 characters.", "Write all 6: `#FF6347`."), ("`color: #FF63G7`", "G is not a hex digit (0 to 9 and A to F).", "Use only 0 to 9 and A to F."), ("`color: \"tomato\"` with quotes", "Named colors never use quotes (and quotes here would end the style attribute).", "Write `color: tomato`."), ("`color: tomatoe`", "A misspelled name is ignored.", "Spell it exactly: `tomato`."), ("Same color for text and background", "The text becomes impossible to read.", "Pick colors with very different pairs.")],
  [], QS(12), title="Colors (Names and Hex)", kick="Two ways to name any color, and how to read a hex code as red, green and blue.", site="<b>Notes:</b> colors-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Brand Colors &nbsp;·&nbsp; <b>Assignment:</b> Duolingo Colors &nbsp;·&nbsp; <b>Quiz game:</b> 4.2")

# =============================================================================== 4.3
C314 = L("4.3", "Tell block, inline and inline-block apart, and use the display style to build menus and buttons.",
  [("block", "a tag that starts a new line and takes the whole width"), ("inline", "a tag that stays inside the line and is only as wide as its content"), ("inline-block", "sits in the line like inline but keeps its width, height and padding"), ("display", "the style that changes how a tag behaves")],
  [("Seat savers and friendly neighbors", """Every tag is born with a **display type**. A **block** tag is like a person who lays coats across a whole row of seats: it **starts on a new line and takes the whole width**. An **inline** tag is like a moviegoer who slides in shoulder to shoulder: it **stays in the line** and only takes the room it needs.

| Type | Tags |
| **block** | html, body, h1-h6, p, div, ul, ol, li, hr |
| **inline** | span, strong, em, a, img |

This one idea (does a tag start a new line?) is the concept the rest of the unit depends on."""),
   ("Span: the inline label", """A `span` is the inline version of a paragraph: it groups or styles a few words **without** breaking the line. That is why you can color a single word inside a sentence with `<span style="color: red">`."""),
   ("Changing the costume: display", """The `display` style lets a tag act like another type:

| Value | Effect |
| `block` | takes 100% width and starts a new line |
| `inline` | sits in the line, only as wide as its content; ignores width and height |
| `inline-block` | sits in the line like inline, but you can still set its **width, height and padding** |"""),
   ("The navigation bar trick", """A menu made of divs stacks in a tall column, because divs are block. Give **every** div `display: inline-block` and they sit in a row. That one style is the fix behind almost every horizontal menu on the internet.

A plain link is inline and tiny. Give it `display: block` (plus padding and a background color) and it becomes a full-width **button**."""),
  ],
  [HX("A menu bar and a button", '<div style="display: inline-block;\n padding: 10px;\n background-color: gold">Home</div>\n<div style="display: inline-block;\n padding: 10px;\n background-color: gold">Menu</div>\n<a href="https://www.nasa.gov"\n style="display: block;\n padding: 10px;\n background-color: navy;\n color: white">Visit NASA</a>', [(0, "display: inline-block", "Sits in the line like a word."), (1, "padding: 10px", "An inline-block can still have padding."), (7, "display: block", "The link takes the whole width and its own line."), (10, "Visit NASA", "A wide button made from a plain link.")], cap="The two gold divs sit side by side. The link below is a full-width button."),
   HX("Block and inline text", '<p>A <span style="color: red">sale</span> day.</p>\n<p style="display: inline">One</p>\n<p style="display: inline">Two</p>\n<p>Next line</p>', [(0, "<span", "A span stays in the sentence."), (1, "display: inline", "A paragraph acting like a word."), (2, "display: inline", "It sits on the same line as One."), (3, "<p>Next line</p>", "A normal block starts a new line.")], cap="One and Two share a line because both are inline. Next line is a block, so it starts below.")],
  [TX("Blocks stack, inline-blocks sit in a row", '<div style="background-color: gold;">One</div>\n<div style="background-color: pink;">Two</div>\n<div style="display: inline-block; width: 100px; background-color: gold;">A</div>\n<div style="display: inline-block; width: 100px; background-color: pink;">B</div>', cap="One and Two are blocks, so each has its own line. A and B are inline-blocks, so they share one line."),
   TX("Block turned inline", '<p style="display: inline;">Left</p>\n<p style="display: inline;">Right</p>\n<p>New line</p>', cap="Left and Right share a line because both are inline. New line is a normal block."),
   TX("A link as a button", '<a href="index.html" style="display: block; padding: 10px; background-color: navy; color: white;">Home</a>\n<a href="index.html">Plain link</a>', cap="The first link is a block, so it takes its own line. The plain link is inline and sits on the line after it.")],
  [("Expecting a div to sit beside another div by default", "A div is a block tag, so it starts a new line.", "Give both `display: inline-block`."), ("`width` on an inline tag", "An inline tag ignores width and height.", "Use `inline-block`, which keeps them."), ("`display: inline-block` on only one menu item", "The other items still stack.", "Put it on **every** item."), ("`display: inlineblock`", "The value has a dash.", "Write `inline-block`."), ("`display: block` on a link and no padding", "The button has no room around its words.", "Add padding and a background color."), ("Putting `display: block` on a span to keep it in the line", "Block does the opposite: it starts a new line.", "Leave the span inline.")],
  [], QS(13), title="Display (Block vs Inline)", kick="Does a tag start a new line? The idea that builds menus, buttons and columns.", site="<b>Notes:</b> display-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Snack Bar &nbsp;·&nbsp; <b>Assignment:</b> Instagram Menu &nbsp;·&nbsp; <b>Quiz game:</b> 4.3")
CHAPTERS_A = [C312, C313, C314]
