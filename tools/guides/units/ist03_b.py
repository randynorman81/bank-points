from ist_lib import *
from units.ist_q import QS

# =============================================================================== 3.4
C34 = L("3.4", "Use strong and em for bold and italics, br and hr for lines, and span to style a few words.",
  [("strong", "makes text bold (in this class bold is always `strong`)"), ("em", "makes text italic (italics is always `em`)"), ("br", "a line break: starts a new line inside a paragraph"), ("hr", "a horizontal rule: a line across the page"), ("span", "marks a few words so you can style only them"), ("nesting", "putting one tag inside another and closing the inside one first")],
  [("Bold and italics", """Wrap the words you want to change in a tag. `<strong>` makes them **bold** and `<em>` makes them *italic*:

`We roast <strong>fresh</strong> beans.`

In this class bold is **always** `strong` and italics is **always** `em`. Do not use `b` or `i`. Keep the spaces **outside** the tags, around the word."""),
   ("Tags that stand alone: br and hr", """Most tags come in pairs, but two tags **stand alone** and have **no closing tag**:

- `<br>` starts a **new line** inside a paragraph. A browser ignores pressing Enter in your code, so you need `br` when you want the words on a new line.
- `<hr>` draws a **horizontal rule**: a line across the page that separates sections.

!key: br and hr never have a closing tag. Write `<br>`, not `</br>` or `<br></br>`."""),
   ("Span: style just a few words", """A **span** marks a few words inside a line so you can style only them. By itself a span does **nothing**: it looks the same as the text around it. Add a style and only those words change:

`Try the <span style="color: green">mint</span> tea.`"""),
   ("Nesting tags", """Tags can go **inside** other tags. The last tag you open is the first one you close, like boxes inside boxes:

`<p><strong>big <em>tiny</em></strong> new</p>`

Here `tiny` is inside both strong and em, so it is bold **and** italic. `big` is only inside strong, and `new` is plain. Crossing tags, like `<strong><em>x</strong></em>`, is a mistake."""),
  ],
  [HX("Bold, italic, a line break and a rule", '<p>We roast <strong>fresh</strong> beans.</p>\n<p>Open daily<br>7 AM to 5 PM</p>\n<hr>\n<p>A <span style="color: green">mint</span> tea</p>\n<p>Open <em>late</em> today</p>', [(0, "<strong>fresh</strong>", "Only the word fresh is bold."), (1, "<br>", "A new line starts here. br has no closing tag."), (2, "<hr>", "A line across the page. hr has no closing tag."), (3, 'style="color: green"', "The span styles only the word mint."), (4, "<em>late</em>", "Italic words with em.")], cap="Spaces stay outside the tags, around the word you wrap."),
   HX("Nesting: close the inside tag first", '<p><strong>big <em>tiny</em></strong> new</p>', [(0, "<strong>big", "strong opens first, so it closes last."), (0, "<em>tiny</em>", "em sits inside strong: tiny is bold and italic."), (0, "</strong>", "strong closes after em."), (0, "new", "Outside both tags, so plain.")], cap="big is bold, tiny is bold and italic, new is plain.")],
  [TX("br and hr build the page", '<h1>Beanstalk</h1>\n<hr>\n<p>Open daily<br>7 AM to 5 PM</p>\n<hr>\n<p>Try the tea.</p>', cap="Each br or hr starts a new line, so the paragraph shows two lines. Lines across the page are not text, so they add nothing to the words."),
   TX("Bold and italic words", '<p>We serve <strong>hot</strong> and <em>cold</em> tea.</p>', cap="The words show the same. Only the look of hot (bold) and cold (italic) changes."),
   TX("A span with a style", '<p>The <span style="color: red">spicy</span> menu.</p>\n<p>The spicy menu.</p>', cap="The first paragraph has red spicy. The second has none, because it has no span.")],
  [("`<b>` and `<i>`", "This class uses strong and em for bold and italics.", "Write `<strong>` and `<em>`."), ("`</br>` or `<br></br>`", "br stands alone, so it has no closing tag.", "Write `<br>`."), ("Pressing Enter inside a paragraph", "The browser ignores it, so the words stay on one line.", "Add a `<br>` where you want the new line."), ("`<strong><em>word</strong></em>`", "The tags cross. The inside tag must close first.", "Write `<strong><em>word</em></strong>`."), ("A span with no style", "A span does nothing by itself.", "Add a style: `<span style=\"color: red\">`."), ("Wrapping the spaces inside the tag", "The extra space can run words together or look odd.", "Keep spaces outside: `a <strong>word</strong> here`.")],
  [], QS(4), title='Editing Tags: strong, em, br, hr and span', kick='Bold, italics, line breaks, lines across the page, and styling just a few words.', site="<b>Notes:</b> editing-tags-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Beanstalk Coffee &nbsp;·&nbsp; <b>Assignment:</b> Chipotle Menu &nbsp;·&nbsp; <b>Quiz game:</b> 3.4")

# =============================================================================== 3.5
FONT_LINK = '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">'
C35 = L("3.5", "Load a Google font with a link in the head and use it with font-family.",
  [("font family", "a group of fonts with the same feel: serif, sans-serif, monospace or cursive"), ("Google Fonts", "a free library of fonts at fonts.google.com"), ("link tag", "a tag in the head that loads something for the page, like a font"), ("font-family", "the property that picks which font the text uses")],
  [("Every font belongs to a family", """There are thousands of fonts, but they fall into a few **families** with their own feel:

| Family | The feel |
| Serif | little feet on the letters; classic, like a book |
| Sans-serif | no feet (*sans* means without); clean and modern |
| Monospace | every letter the same width, like typed code |
| Cursive | flowing, handwritten letters |

Pick the feel first, then pick a font that matches your page."""),
   ("Loading a Google font", """Your computer only has a few fonts. **Google Fonts** is a free library of hundreds more. To use one:

1. Go to fonts.google.com and pick a font.
2. Click **Get embed code** and copy the `<link>` lines.
3. Paste them inside the **head**, never the body.

The link only **downloads** the font. The last line is the one that names the font: the part after `family=` is the font's name. When the name has a space, the link writes it as a plus sign: `family=Open+Sans`."""),
   ("Using the font: font-family", """Loading a font is **not** using it. To make text use the font, write `font-family` in a style. Write the font's name **exactly as Google spells it, in single quotes** (the style attribute already uses double quotes):

`<h1 style="font-family: 'Pacifico'">`"""),
   ("Mix fonts like a designer", """More fonts does not mean better design. Use **2 to 4** fonts per page and give each a job:

- a bold **display** font for headings
- an easy-to-read font for paragraphs (script fonts are tiring to read in long text)
- a `span` for a quick accent: a span can have its own `font-family` that overrides the paragraph's font for just those words."""),
  ],
  [HX("Load a font, then use it", '<head>\n<title>Bakery</title>\n<link href="https://fonts.googleapis.com/\n css2?family=Pacifico&display=swap"\n rel="stylesheet">\n</head>\n<body>\n<h1 style="font-family: \'Pacifico\'">Sweet</h1>\n<p>Fresh bread.</p>\n</body>', [(2, "<link", "A link tag in the head loads the font. No closing tag."), (3, "family=Pacifico", "The name of the font being loaded."), (4, 'rel="stylesheet"', "Tells the browser what the link is."), (7, "font-family: 'Pacifico'", "Now the heading USES the font. Single quotes around the name."), (8, "<p>Fresh bread.</p>", "No font-family here, so the default font is used.")], cap="Only the heading uses Pacifico. The paragraph keeps the browser default.",
      render='<!DOCTYPE html>\n<html>\n<head>\n<title>Bakery</title>\n' + FONT_LINK + '\n</head>\n<body>\n<h1 style="font-family: \'Pacifico\'">Sweet</h1>\n<p>Fresh bread.</p>\n</body>\n</html>'),
   HX("A span with its own font", '<p style="font-family: \'Open Sans\'">\nTry our <span style="font-family:\n \'Pacifico\'">famous</span> rolls.\n</p>', [(0, "font-family: 'Open Sans'", "The whole paragraph uses Open Sans."), (2, "\'Pacifico\'", "Just the word famous uses Pacifico instead."), (2, "</span>", "The span ends; the rest is Open Sans again.")], cap="The span overrides the paragraph's font for one word.", shot=False)],
  [TX("Loading is not using", '<head>\n<title>Fonts</title>\n<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">\n</head>\n<body>\n<h1>Hello</h1>\n<h2 style="font-family: \'Lobster\'">Hello</h2>\n</body>', cap="The link loads Lobster but does not use it. Only the h2 has font-family, so only the h2 looks different."),
   TX("Two fonts, two jobs", '<h1 style="font-family: \'Lobster\'">Surf Shop</h1>\n<p style="font-family: \'Roboto\'">Boards and gear.</p>\n<p>Open daily.</p>', cap="The heading and the first paragraph each use a font. The last paragraph uses the default."),
   TX("Font and color together", '<h1 style="color: navy;\n font-family: \'Lora\'">Books</h1>', cap="Styles can be written over more than one line inside the quotes. The heading is navy in the Lora font.")],
  [("The link in the body", "The link must go in the head to download the font.", "Move it between the `<head>` tags."), ("Loading a font but never using it", "The text keeps the default font.", "Add `font-family` in a style."), ("`font-family: \"Open Sans\"` inside a double-quoted style", "The double quotes end the style early.", "Use single quotes: `font-family: 'Open Sans'`."), ("A misspelled font name", "The browser cannot find the font, so the text uses the default.", "Copy the name exactly as Google spells it."), ("Too many fonts", "The page looks messy.", "Use 2 to 4 fonts and give each a job."), ("`font-family 'Pacifico'` with no colon", "A style needs a colon between the property and value.", "Write `font-family: 'Pacifico'`.")],
  [], QS(5), title='Google Fonts', kick="Give your page a real designer's fonts, and learn the difference between loading a font and using it.", site="<b>Notes:</b> google-fonts-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Sweet Dreams Bakery &nbsp;·&nbsp; <b>Assignment:</b> Airbnb Cabins &nbsp;·&nbsp; <b>Quiz game:</b> 3.5")

# =============================================================================== 3.6
C36 = L("3.6", "Draw borders on all four sides or just one side, in six styles.",
  [("border", "a line drawn around the edge of a tag"), ("thickness", "how thick the line is, in px"), ("border style", "what the line looks like: solid, dashed, dotted, double, groove or ridge"), ("border-top / bottom / left / right", "a border on just one side")],
  [("The border style", """`border` draws a line around all four sides of a tag. It takes **three parts, in this order, with spaces between them**:

| Part | Example |
| thickness | `4px` |
| style | `solid` |
| color | `navy` |

`<h1 style="border: 4px solid navy">`"""),
   ("Six border styles", """| Style | What it looks like |
| `solid` | one plain line |
| `dashed` | dashes |
| `dotted` | dots |
| `double` | two lines (needs a thickness of at least 3px) |
| `groove` | looks pressed in |
| `ridge` | looks like it sticks out |"""),
   ("A border on one side", """To draw a border on just one side, add the side to the property: `border-top`, `border-bottom`, `border-left` or `border-right`. They use the same three parts.

`<h2 style="border-bottom: 3px dashed red">` draws a dashed red line **under** the heading only."""),
   ("Borders with other styles", """Borders work together with every style you know. Keep all of a tag's styles inside **one** style attribute, separated by semicolons: `style="font-size: 40px; border: 4px solid navy"`."""),
  ],
  [HX("Borders on all four sides and on one side", '<h1 style="border: 4px solid navy">Game</h1>\n<p style="border: 3px dotted green">Snack</p>\n<p style="border: 6px double purple">Prize</p>\n<h2 style="border-bottom: 3px dashed red">Six</h2>\n<p style="border-left: 8px solid black">Fri</p>', [(0, "4px solid navy", "Thickness, style, color: a navy box."), (1, "3px dotted green", "A dotted line all around."), (2, "6px double purple", "Two lines (thick enough to show both)."), (3, "border-bottom", "Only the bottom side gets a line."), (4, "border-left", "Only the left side gets a line.")], cap="The first three tags have borders on all four sides. The last two have one side each."),
   HX("Groove and ridge", '<p style="border: 6px groove orange">Pressed in</p>\n<p style="border: 6px ridge orange">Sticks out</p>', [(0, "groove", "Looks pressed into the page."), (1, "ridge", "Looks raised, like it sticks out.")], cap="Same color and thickness, different style.")],
  [TX("Different border styles", '<p style="border: 4px solid navy">One</p>\n<p style="border: 4px dashed navy">Two</p>\n<p style="border: 6px double navy">Three</p>', cap="Every row adds one paragraph with its own kind of border. The words stay the same."),
   TX("One side only", '<h2 style="border-bottom: 3px solid red">Menu</h2>\n<p style="border-left: 8px solid blue">Soup</p>', cap="Only one side of each tag has a line: under the heading and left of the paragraph."),
   TX("Border with other styles", '<h1 style="font-size: 40px;\n text-align: center;\n border: 5px ridge teal">News</h1>', cap="The heading is big, centered and boxed with a teal ridge, all from one style attribute.")],
  [("`border: 4 solid navy`", "The thickness needs px.", "Write `4px solid navy`."), ("`border: 4px; solid; navy`", "Semicolons split it into broken styles.", "Use spaces: `4px solid navy`."), ("`border: 4px soild navy`", "A misspelled style name is ignored.", "Spell the style: `solid`."), ("`border-all: 3px solid red`", "That property does not exist.", "Use `border` for all sides."), ("A `double` border only 1px or 2px thick", "There is no room for two lines, so it looks solid.", "Make it at least 3px thick."), ("Two borders on one tag written as two style attributes", "A tag can have only one style attribute.", "Put them in one, separated by semicolons.")],
  [], QS(6), title='Borders', kick='Draw lines around any tag, on all four sides or just one, in six styles.', site="<b>Notes:</b> borders-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Game Night &nbsp;·&nbsp; <b>Assignment:</b> Pokémon Trading Card &nbsp;·&nbsp; <b>Quiz game:</b> 3.6")

# =============================================================================== 3.7
IMG_RENDER = '<img src="' + LAB + 'rocket.svg" alt="A red rocket" style="width: 200px">\n<img src="' + LAB + 'planet.svg" alt="A purple planet" style="width: 50%">'
C37 = L("3.7", "Add pictures with the img tag, size them with width, and add a favicon to the tab.",
  [("img", "the tag that puts a picture on the page; it stands alone"), ("src", "the attribute that holds the web address of the picture"), ("alt", "the attribute that describes the picture in words"), ("width", "the style that sets how wide a picture is"), ("favicon", "the tiny picture on a browser tab, added with a link tag in the head")],
  [("The img tag", """A web page is just text. When you see a picture, the page is really pointing at a picture file stored somewhere else. The `img` tag is the pointer. It has two attributes:

- **src** is the web address of the picture file. No src, no picture.
- **alt** is words that describe the picture. Screen readers read them aloud and they show if the picture cannot load.

`<img src="https://example.org/cat.png" alt="A gray cat on a sofa">`

`img` **stands alone**: no closing tag. Good alt text says what is in the picture: "A gray cat on a sofa" is good, "image1" is not."""),
   ("Web addresses", """A picture needs a **web address** that works for everyone, starting with `https://`. A file on your own computer (`C:\\Users\\me\\cat.png`) has no web address. A bare file name like `cat.png` only works if that file sits right next to the page. In the Web Editor you can upload your own pictures to get a web address."""),
   ("Picture size", """Set the size with the style `width`. A number with **px** is an exact size: `width: 200px`. A number with **%** is a share of the space the picture sits in, so it grows and shrinks with the page: `width: 50%`.

Set **only the width**. The browser works out the height so the picture keeps its natural shape. If you set both a width and a height, the picture can look squished or stretched."""),
   ("The favicon", """The **favicon** is the tiny picture beside the title on a browser tab. Add it with a `link` tag inside the **head**, with `rel="icon"` and an `href` that is the web address of a small, simple picture:

`<link rel="icon" href="https://example.org/icon.png">`

Like the title and the font link, it lives in the head and has no closing tag."""),
  ],
  [HX("A favicon and two pictures", '<head>\n<title>Space Camp</title>\n<link rel="icon" href="https://x.org/rocket.svg">\n</head>\n<body>\n<img src="https://x.org/rocket.svg"\n alt="A red rocket" style="width: 200px">\n<img src="https://x.org/planet.svg"\n alt="A purple planet" style="width: 50%">\n</body>', [(2, 'rel="icon"', "Adds the tiny picture to the tab. It goes in the head."), (5, 'src="https://x.org/rocket.svg"', "The web address of the picture."), (6, 'alt="A red rocket"', "Words that describe it."), (6, "width: 200px", "Exactly 200 pixels wide. No height is set."), (8, "width: 50%", "Half the width of the page, so it shrinks with the window.")], cap="img and the favicon link both stand alone.",
      render='<!DOCTYPE html>\n<html>\n<head>\n<title>Space Camp</title>\n<link rel="icon" href="' + LAB + 'rocket.svg">\n</head>\n<body>\n' + IMG_RENDER + '\n</body>\n</html>')],
  [TX("Pictures add no text to the page", '<h1>Space Camp</h1>\n<img src="' + LAB + 'rocket.svg" alt="A red rocket" style="width: 200px">\n<p>Blast off.</p>', cap="The picture shows on the page, but it is not text, so the text lines are only the heading and paragraph."),
   TX("Width in px and in percent", '<img src="' + LAB + 'rocket.svg" alt="A red rocket" style="width: 100px">\n<img src="' + LAB + 'planet.svg" alt="A purple planet" style="width: 50%">', cap="The first picture is always 100 pixels wide. The second is half the page width and changes with the window."),
   TX("The favicon is not on the page", '<head>\n<title>Rocket Shop</title>\n<link rel="icon" href="' + LAB + 'rocket.svg">\n</head>\n<body>\n<h1>Rocket Shop</h1>\n</body>', cap="The favicon goes on the tab, not on the page, so only the heading shows in the page.")],
  [("`<img src=\"cat.png\" alt=\"A cat\"></img>`", "img stands alone: no closing tag.", "Remove the `</img>`."), ("No alt text, or `alt=\"image1\"`", "Screen readers have nothing useful to read.", "Describe the picture: `alt=\"A gray cat on a sofa\"`."), ("`src=\"C:\\Users\\me\\cat.png\"`", "A file on your computer has no web address for visitors.", "Upload the picture and use its web address."), ("Both `width` and `height`", "The picture can look squished or stretched.", "Set only the width."), ("`width: 200` (no unit)", "A size needs px or %.", "Write `width: 200px`."), ("The favicon link in the body", "It must go in the head.", "Move it between the `<head>` tags.")],
  [], QS(7), title='Images and the Favicon', kick='Put pictures on a page, size them without squishing, and add the tiny icon on the tab.', site="<b>Notes:</b> images-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Space Camp &nbsp;·&nbsp; <b>Assignment:</b> Apple Store &nbsp;·&nbsp; <b>Quiz game:</b> 3.7")
CHAPTERS_B = [C34, C35, C36, C37]
