from ist_lib import *
from units.ist_q import QS

# =============================================================================== 3.1
S1_PAGE = '''<!DOCTYPE html>
<html>
<head>
<title>Slice House</title>
</head>
<body>
<h1>Slice House</h1>
<p>Pizza made fresh.</p>
</body>
</html>'''
C31 = L("3.1", "Build a web page from the HTML skeleton and put a heading and paragraphs on it.",
  [("HTML", "HyperText Markup Language: the tags that give a page its structure"), ("tag", "a word in angle brackets, like `<p>`"), ("element", "an opening tag, its content and its closing tag together"), ("doctype", "the first line of every page: `<!DOCTYPE html>`"), ("head", "the part of the page that holds information, like the title"), ("body", "the part of the page that holds everything a visitor sees"), ("heading 1", "the biggest, most important heading: `<h1>`")],
  [("What HTML is", """**HTML** (HyperText Markup Language) gives a web page its **structure**: which part is a heading and which part is a paragraph. Think of it as the frame of a house. The paint (colors, sizes, fonts) comes in the next lessons.

A **tag** is a word in angle brackets. Most tags come in a **pair**: an **opening tag** like `<p>` and a **closing tag** with a forward slash like `</p>`. The opening tag, the words between, and the closing tag together are one **element**.

!key: Every opening tag needs its closing tag. If you forget one, the browser does not know where the element ends."""),
   ("The skeleton every page starts with", """Every page is built from the same **skeleton**: container tags nested inside each other like boxes inside a bigger box.

1. `<!DOCTYPE html>` is the very first line. It tells the browser to use modern HTML. It is not a box, so it has **no closing tag**.
2. `<html>` is the big outer box. Everything else goes between `<html>` and `</html>`.
3. `<head>` holds information about the page that visitors do not see on the page itself, like the **title**.
4. `<body>` holds everything a visitor **can** see: headings, paragraphs, and later pictures and links.

The head comes first, then the body, and both sit inside the html tags."""),
   ("Headings and paragraphs", """A **heading 1** (`<h1>`) is the biggest, most important heading. Use it **once**, like the title of a book. A **heading 2** (`<h2>`) is smaller and starts a section. A **paragraph** (`<p>`) holds a block of normal text.

A **section** is a heading with its paragraphs under it. Most pages are a heading 1 followed by several sections.

!tip: The browser ignores blank lines and extra spaces in your code. Only the tags decide how the page looks, so you can add blank lines to keep your code easy to read."""),
   ("The tab is not the page", """The `<title>` is typed inside the **head**, so it does not appear on the page. It shows on the **browser tab**. The heading 1 is typed inside the **body**, so it shows **on the page**. A page can have a title and a heading 1 with different words."""),
  ],
  [HX("The skeleton of a page", S1_PAGE, [(0, "<!DOCTYPE html>", "Line 1 of every page. No closing tag."), (1, "<html>", "The big outer box. It closes on the last line."), (2, "<head>", "Information about the page. Visitors do not see it on the page."), (3, "<title>Slice House</title>", "The name on the browser tab."), (5, "<body>", "Everything a visitor can see goes in the body."), (6, "<h1>Slice House</h1>", "The biggest heading: use one per page."), (7, "<p>Pizza made fresh.</p>", "A paragraph of normal text.")], cap="The head holds the title for the tab. The body holds the heading and paragraph that show on the page."),
   HX("Sections: a heading with its paragraph", '<h1>Blue Moon Bakery</h1>\n<h2>Our Story</h2>\n<p>We opened in 2019.</p>\n<h2>Our Menu</h2>\n<p>Bread, cakes and cookies.</p>', [(0, "<h1>Blue Moon Bakery</h1>", "One heading 1 names the whole page."), (1, "<h2>Our Story</h2>", "A heading 2 starts the first section."), (2, "<p>We opened in 2019.</p>", "The paragraph goes right under its heading 2."), (3, "<h2>Our Menu</h2>", "A new heading 2 starts the second section."), (4, "<p>Bread, cakes and cookies.</p>", "Its paragraph follows.")], cap="Two sections, each a heading 2 with a paragraph under it. This is the shape of most pages.")],
  [TX("Tracing a whole page", S1_PAGE, cap="The title row builds nothing on the page: the title goes on the tab. The page only gets text when the body's heading and paragraph run."),
   TX("Sections build the page top to bottom", '<h1>Blue Moon Bakery</h1>\n<h2>Our Story</h2>\n<p>We opened in 2019.</p>\n<h2>Our Menu</h2>\n<p>Bread, cakes and cookies.</p>', cap="Each line adds one block of text under the one before it, in the order written."),
   TX("Title and heading can differ", '<!DOCTYPE html>\n<html>\n<head>\n<title>Open Daily</title>\n</head>\n<body>\n<h1>Turbo Gym</h1>\n<p>Train hard.</p>\n</body>\n</html>', cap="The tab says Open Daily, but the page shows Turbo Gym and Train hard.")],
  [("`<title>` placed inside the body", "The title belongs in the head, so it will not do its job as the tab name.", "Put `<title>` between the `<head>` tags."), ("Forgetting a closing tag, like `<p>Hi`", "The browser cannot tell where the paragraph ends and the page can break.", "Close every tag: `<p>Hi</p>`."), ("Closing with the wrong name: `<h1>Hi</h2>`", "The tags do not match, so the heading is not closed correctly.", "Use the same name: `<h1>Hi</h1>`."),
   ("Missing doctype line", "The browser may guess how to show the page, and it can look different.", "Type `<!DOCTYPE html>` as the very first line."), ("Two or more heading 1 tags", "A page has one main title. More than one is confusing.", "Use one `<h1>` and make the others `<h2>`."), ("Putting text straight in the body with no `<p>`", "The words have no paragraph tag, so the structure is unclear.", "Wrap each block of text in `<p>` and `</p>`.")],
  [], QS(1), title='Intro to HTML and the HTML Skeleton', kick='Every page starts with the same skeleton. Learn the tags that hold a title, a heading and paragraphs.', site="<b>Notes:</b> html-intro-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Slice House &nbsp;·&nbsp; <b>Assignment:</b> Netflix Help Center &nbsp;·&nbsp; <b>Quiz game:</b> 3.1")

# =============================================================================== 3.2
C32 = L("3.2", "Change colors with the style attribute: text color, background color, and the 140 color names HTML knows.",
  [("attribute", "extra information written inside an opening tag, like `style`"), ("style attribute", "holds design instructions for one tag: `style=\"color: red\"`"), ("property", "what you want to change, like `color`"), ("value", "what you want it changed to, like `red`"), ("color name", "one of the 140 colors HTML knows by name, like `tomato`, `navy` or `lightyellow`"), ("color list", "the page of all 140 color names, with a swatch for each")],
  [("The style attribute", """HTML gives a page its structure. **CSS** changes how it looks. In this class you write CSS inside a tag's **style attribute**.

The style attribute goes **inside the opening tag**: the word `style`, an equals sign, and the styles inside **double quotes**. Each style is a **property**, a colon, and a **value**:

`<h1 style="color: tomato">Hello</h1>`

Here the property is `color` (the color of the text) and the value is `tomato`."""),
   ("Text color and background color", """Two properties change colors:

| Property | What it colors |
| `color` | the text itself |
| `background-color` | the box behind the text |

To use **more than one** style, put them all inside the **same** quotes and separate them with a **semicolon**:

`style="color: white; background-color: black"`

!warn: Never write two style attributes on one tag. Use one style attribute and separate the styles with semicolons."""),
   ("The 140 color names", """A color is a **name** like `red`, `navy` or `tomato`. HTML knows **140 color names**, far more than the basic red, blue and green. You will find colors you have never thought to name, like `lightseagreen`, `darkorange`, `slategray` and `mediumpurple`.

Four rules for every color name:

| Rule | Right | Wrong |
| One word, no spaces | `darkblue` | `dark blue` |
| Spelled exactly right | `lightyellow` | `lightyelow` |
| No quotes and no `#` | `color: tomato` | `color: "tomato"` |
| A real name from the list | `seagreen` | `oceangreen` |

Many names come in families. Add **dark** or **light** to get a darker or lighter version: `blue`, `darkblue`, `lightblue`. You do not have to memorize the 140. Keep the color list open (schscomputerscience.com/ist/unit-6/html-colors.html) and pick from it.

!tip: A color name works after both `color:` and `background-color:`. If a name does not work, the browser ignores the style and the text stays black. Check the spelling against the color list."""),
   ("Styling the whole page", """A style on the **body** reaches the whole page. Any tag that does not have its own style uses the body's text color. A tag with its **own** style keeps its own: the tag's style wins.

!tip: Make sure the text color and the background are different. Light text on a dark background (or dark on light) is easy to read. The same color for both hides the text."""),
  ],
  [HX("Colors on three tags", '<h1 style="color: tomato">Arcade</h1>\n<h2 style="color: white;\n background-color: black">Games</h2>\n<p style="color: darkblue">New games.</p>', [(0, 'style="color: tomato"', "One style: the text color is tomato."), (1, "color: white;", "Two styles in one attribute, separated by a semicolon."), (2, "background-color: black", "The second style: a black box behind the text."), (3, "darkblue", "A color name for a dark blue. It is one word with no space.")], cap="Each tag carries its own style attribute inside its opening tag."),
   HX("The body style reaches the whole page", '<body style="color: white;\n background-color: navy">\n<h1 style="color: tomato">Arcade</h1>\n<p>New games arrive.</p>\n</body>', [(0, "color: white", "White text for every tag with no color of its own."), (1, "background-color: navy", "A navy page behind everything."), (2, 'style="color: tomato"', "This heading has its own color, so it keeps tomato."), (3, "<p>New games arrive.</p>", "No style here, so it uses the body: white on navy.")], cap="The tomato heading keeps its own color. The paragraph uses the body colors.")],
  [TX("A style on one tag only", '<h1 style="color: tomato">Pixel Arcade</h1>\n<h2>Top Games</h2>\n<p>New games.</p>', cap="Only the h1 has a style, so only the h1 text is tomato. The other lines use the default black."),
   TX("Two styles on one tag", '<h2 style="color: white; background-color: black">Top Games</h2>\n<p>New games.</p>', cap="White text sits on a black box. The paragraph below is plain."),
   TX("The body color reaches the paragraph", '<body style="color: green">\n<h1 style="color: gold">Menu</h1>\n<p>Soup of the day</p>\n</body>', cap="The h1 has its own gold. The paragraph has no color of its own, so it uses the body: green.")],
  [("`color = red`", "A style needs a colon, not an equals sign, so the browser ignores it.", "Write `color: red`."), ("`color: red background-color: blue`", "There is no semicolon between the two styles, so the browser ignores both.", "Add a semicolon: `color: red; background-color: blue`."), ("`colour: red` or `text-color: red`", "These property names do not exist, so nothing changes.", "Use `color`."), ("`color: dark blue`", "A color name is one word. The space makes the browser ignore the style.", "Write `color: darkblue`."), ("`style=\"color: red\" style=\"background-color: blue\"`", "A tag can have only one style attribute.", "Put both styles in one attribute, separated by a semicolon."), ("Same color for text and background", "The text becomes impossible to read.", "Pick a light color on a dark one, or the reverse.")],
  [], QS(2), title='The Style Attribute and Colors', kick='Add color to a page: text color, background color and the 140 color names.', site="<b>Notes:</b> style-attribute-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Pixel Arcade &nbsp;·&nbsp; <b>Assignment:</b> Spotify Road Trip Mix &nbsp;·&nbsp; <b>Quiz game:</b> 3.2")

# =============================================================================== 3.3
C33 = L("3.3", "Change the size, alignment and letter case of text with font-size, text-align and text-transform.",
  [("font-size", "the property that sets how big the letters are, written in px"), ("px", "pixels: the unit for sizes, like `40px`"), ("text-align", "moves text to the `left`, `center` or `right`"), ("text-transform", "changes the letter case on the page without changing your code"), ("heading 3", "the `<h3>` tag: smaller than a heading 2")],
  [("Font size", """The style `font-size` sets how big the letters are. The size is a number with **px** (pixels) written right after it, with **no space**: `font-size: 40px`. Every heading has its own default size, and `font-size` overrides it.

Browser defaults: heading 1 = 32px, heading 2 = 24px, heading 3 = 18.72px (about 19px) and a paragraph = 16px.

!warn: `font-size: 40` (no unit) and `font-size: 40 px` (a space) do not work."""),
   ("The heading 3 tag", """Headings go from `<h1>` (biggest) to `<h2>` to `<h3>` (smaller). Heading 3 is used for a smaller title inside a section."""),
   ("Text alignment", """`text-align` moves text inside its row: `left`, `center` or `right`. Text starts on the **left** until you change it.

`<h1 style="text-align: center">Welcome</h1>`"""),
   ("Letter case", """`text-transform` changes the letter case **on the page** without changing the words you typed:

| Value | What the page shows |
| `uppercase` | EVERY LETTER A CAPITAL |
| `lowercase` | every letter small |
| `capitalize` | The First Letter Of Each Word A Capital |

Your code still has the original letters. Only the page changes."""),
   ("Several styles on one tag", """A tag can have all three at once. Keep them in **one** style attribute, separated by semicolons:

`<h1 style="font-size: 48px; text-align: center; text-transform: uppercase">`"""),
  ],
  [HX("Size, alignment and letter case", '<h1 style="font-size: 40px">Sky</h1>\n<h2 style="text-align: center">Now</h2>\n<h3 style="text-transform: uppercase">tonight only</h3>', [(0, "font-size: 40px", "The letters are 40 pixels tall."), (1, "text-align: center", "The heading sits in the middle of the row."), (2, "text-transform: uppercase", "Shows TONIGHT ONLY even though the code is small letters.")], cap="Each property changes one thing about the text."),
   HX("Several styles on one heading", '<h1 style="font-size: 36px;\n text-align: center">grand opening</h1>\n<p style="text-align: right">Doors 6</p>', [(0, "font-size: 36px", "Size first."), (1, "text-align: center", "Then alignment, after a semicolon."), (2, "text-align: right", "The paragraph moves to the right edge.")], cap="One style attribute can hold several styles. Separate them with semicolons.")],
  [TX("Letter case on the page", '<h1 style="text-transform: uppercase">big sale</h1>\n<h2 style="text-transform: capitalize">open late friday</h2>\n<p style="text-transform: lowercase">ALL WEEK LONG</p>', cap="The page shows BIG SALE, Open Late Friday and all week long. The code keeps its original letters."),
   TX("Which line is biggest?", '<p style="font-size: 18px">Small print</p>\n<p style="font-size: 52px">Hours</p>\n<p style="font-size: 22px">Reviews</p>', cap="Every line prints in order. The biggest number of px, 52px, is the biggest text: Hours."),
   TX("Alignment", '<h1 style="text-align: center">Welcome</h1>\n<p>I start on the left.</p>\n<p style="text-align: right">I move right.</p>', cap="Text with no text-align sits on the left. The first and last lines have their own alignment.")],
  [("`font-size: 40`", "A size needs the unit px, so the browser ignores it.", "Write `font-size: 40px`."), ("`font-size: 40 px`", "No space is allowed between the number and px.", "Write `40px`."), ("`align: center`", "That property does not exist. The property is `text-align`.", "Write `text-align: center`."), ("`text-transform: title`", "`title` is not a value. The value is `capitalize`.", "Write `text-transform: capitalize`."), ("Expecting `text-transform` to rewrite the code", "It only changes how the page looks. Your code stays the same.", "Type the words the way you want them in the code, and use text-transform only for the look."), ("Two style attributes for a size and an alignment", "A tag can have only one style attribute.", "Use one attribute: `style=\"font-size: 40px; text-align: center\"`.")],
  [], QS(3), title='Text Size, Alignment and Case', kick='Make text bigger or smaller, move it left, center or right, and change its letter case.', site="<b>Notes:</b> text-size-align-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Skyline Cinema &nbsp;·&nbsp; <b>Assignment:</b> Nintendo Direct &nbsp;·&nbsp; <b>Quiz game:</b> 3.3")
CHAPTERS_A = [C31, C32, C33]
