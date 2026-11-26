from ist_lib import *
from units.ist_q import QS

# =============================================================================== 3.8
C38 = L("3.8", "Put emojis and symbols on a page: they are text characters you copy and paste.",
  [("emoji", "a small picture-like character, like 🍕, that is really text"), ("symbol", "a character that is not a letter or number, like © ™ ♥ → ★"), ("character", "one letter, number, emoji or symbol of text"), ("footer", "a small line at the bottom of a page, often with © and the year")],
  [("It is a character, not a picture", """Every emoji you have ever sent was not a photo. Your phone sent a tiny **code**, and the other phone looked it up and drew the picture. An emoji is closer to the letter **A** than to a photograph. A symbol like **©** is a character too.

Because they are **text**, they follow the text rules you already know. You can put them in an `h1`, a `p`, an `li` or a `span`. You can size them with `font-size` and center them with `text-align`. They never need `src`, `alt` or an upload.

!key: Emoji and symbol = text. Image = file. Use the text one whenever you can: it loads instantly and never breaks."""),
   ("Copy and paste", """There is only one trick: find the character, **copy** it, click in your code and **paste** it **between the tags**, with the other text. On Windows the emoji picker is the Windows key + period. On a Mac it is Control + Command + Space.

!warn: Paste the character between the opening and closing tags. Never inside the angle brackets of a tag."""),
   ("Styling characters", """Because symbols are text, you can style them like text. Put the stars in a `span` to give just them a color and a size:

`Rating: <span style="color: gold; font-size: 30px">★★★★</span>`"""),
   ("Footers", """Almost every real website ends with a **footer** line that has the **©** (copyright) symbol, the year, and often a **™** (trademark) symbol. It is small and centered: `<p style="text-align: center; font-size: 14px">© 2027 Pizza Night™</p>`."""),
  ],
  [HX("Emojis and symbols are text", '<h1>Pizza Night 🍕</h1>\n<p>Friday at 6 → bring friends!</p>\n<p>Rating: <span style="color: gold;\n font-size: 30px">★★★★</span>★</p>\n<p style="text-align: center">\n © 2027 Pizza Night™ ♥</p>', [(0, "🍕", "An emoji between the tags: it is just text."), (1, "→", "A symbol: an arrow, pasted like a letter."), (2, "<span", "A span gives the stars their own color and size."), (3, "★★★★", "Four gold stars; the fifth star is outside the span."), (5, "©", "The copyright symbol.")], cap="Nothing here is a picture file: every character is text, so none needs src or alt."),
   HX("An emoji grows with font-size", '<h1 style="font-size: 60px">Party ⚽</h1>', [(0, "font-size: 60px", "The size changes the letters and the emoji together."), (0, "⚽", "Text, so it scales like a letter.")], cap="The emoji is exactly as big as the text beside it.")],
  [TX("Emojis and symbols show as text", '<h1>Taco Tower 🌮</h1>\n<p>🌮 Crunchy Taco $1.99</p>\n<p>Rated 5 ★</p>', cap="Each emoji or symbol appears in the page text exactly where it was pasted."),
   TX("Counting stars", '<p>Rating:\n<span style="color: gold">★★★</span>\n<span style="color: gray">★★</span></p>', cap="Five stars show in all: three gold and two gray. The span only changes the color."),
   TX("A footer", '<p style="text-align: center;\n font-size: 14px">\n© 2027 Panda Books™ ♥\n</p>', cap="The footer shows the © and ™ symbols as characters. The style centers it and makes it small.")],
  [("Putting an emoji inside the tag's angle brackets", "It must go between the tags, as text.", "Write `<h1>Party 🍕</h1>`."), ("Using `img` with `src` and `alt` for an emoji", "An emoji is text and never needs a picture file.", "Just paste the character."), ("Typing `(c)` instead of ©", "It shows the letters (c), not the symbol.", "Copy and paste the real © symbol."), ("Expecting an emoji to stay small when the heading is big", "It is text, so it follows font-size.", "Set the size with `font-size` if you want it bigger or smaller."), ("A footer with big text", "A footer is a small, quiet line.", "Use `font-size: 14px` and center it."), ("Missing the year in a copyright line", "A copyright line normally shows the year.", "Write `© 2027 Name`.")],
  [], QS(8), title='Emojis and Symbols', kick='Emojis and symbols are text characters: paste them, style them and build a footer.', site="<b>Notes:</b> emojis-symbols-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Pizza Night &nbsp;·&nbsp; <b>Assignment:</b> Taco Bell Menu &nbsp;·&nbsp; <b>Quiz game:</b> 3.8")

# =============================================================================== 3.9
C39 = L("3.9", "Make links with the a tag, choose where they open, and turn words, headings and pictures into links.",
  [("anchor tag", "the `a` tag that makes a link"), ("href", "the attribute that holds the address a link goes to"), ("target", "the attribute that chooses where the link opens"), ("link text", "the words between the opening and closing a tag: the part people click"), ("nesting", "putting one tag inside another and closing the inside one first")],
  [("The anchor tag", """The web is just pages connected by links. A link is a door from one page to another. In HTML the door is the **anchor tag**, `a`, and the address it opens is stored in the attribute `href`:

`<a href="https://www.wikipedia.org">Wikipedia</a>`

The words between the opening and closing tags are the **link text**: the part people click. Web addresses start with `https://`. Leave it off and the browser looks for a file on your own site instead of the internet. Always close the tag with `</a>`."""),
   ("Current tab or new tab?", """A link can take over the tab you are in, or open in a **new tab**. You choose with the `target` attribute:

| You want | Write |
| the **current** tab (the default) | `<a href="https://...">` with nothing extra (or `target="_self"`) |
| a **new** tab | `<a href="https://..." target="_blank">` |

Rule of thumb: if a link **leaves your website**, open it in a new tab. Two attributes sit in the same opening tag, separated by a space. The closing tag is always plain: `</a>`."""),
   ("Make anything a link", """The anchor tag does not care what is inside it. Whatever sits between `<a>` and `</a>` becomes the link: a few words, **bold** words, a whole **heading**, or a **picture**. Nest the tags like boxes and close the inside one first:

`<a href="https://www.nasa.gov"><strong>NASA</strong></a>`

A picture link puts the whole `img` tag inside the a tags: the link goes on the **outside**, the picture on the **inside**."""),
   ("Good link text", """Say what is behind the link: "NASA Mars photos", not "click here"."""),
  ],
  [HX("Links of different kinds", '<p>Visit <a href="https://www.nasa.gov"\n target="_blank">NASA</a> today.</p>\n<p><a href="https://www.nasa.gov">\n<strong>Join us</strong></a></p>\n<h2><a href="https://www.loc.gov">\nLibrary</a></h2>', [(0, 'href="https://www.nasa.gov"', "The address the link goes to. It starts with https://."), (1, 'target="_blank"', "Opens the link in a new tab."), (1, "NASA</a>", "Only the word NASA is clickable; the a tag closes here."), (3, "<strong>Join us</strong>", "Bold words inside the link. Close strong before a."), (5, "Library</a>", "A whole heading can be a link.")], cap="No target on the last two links, so they open in the same tab.", shot=False),
   HX("A picture that is a link", '<a href="https://www.nasa.gov"\n target="_blank">\n<img src="https://x.org/rocket.svg"\n alt="A red rocket"\n style="width: 150px"></a>', [(0, '<a href="https://www.nasa.gov"', "The link goes on the outside."), (1, 'target="_blank"', "A new tab."), (2, "<img", "The picture sits inside the a tags."), (4, "</a>", "The a tag closes after the img. The img itself has no closing tag.")], cap="Clicking the rocket opens NASA.",
      render='<a href="https://www.nasa.gov" target="_blank">\n<img src="' + LAB + 'rocket.svg" alt="A red rocket" style="width: 150px"></a>')],
  [TX("Only the link text is clickable", '<p>Visit\n<a href="https://www.nasa.gov">NASA</a>\ntoday.</p>', cap="The page shows all the words. Only NASA is the link; the other words are plain."),
   TX("A heading that is a link", '<h2>\n<a href="https://www.loc.gov"\n target="_blank">Library</a>\n</h2>\n<p>Open late.</p>', cap="The whole word Library is the heading and the link. The paragraph below is plain."),
   TX("Bold words inside a link", '<p>Read\n<a href="https://www.nasa.gov">\n<strong>Mars photos</strong></a>\nnow.</p>', cap="Mars photos is bold and clickable. strong sits inside a, so it closes first.")],
  [("`href=\"www.nasa.gov\"` with no https://", "The browser looks for a file on your own site.", "Write `href=\"https://www.nasa.gov\"`."), ("Forgetting `</a>`", "The rest of the page becomes part of the link.", "Close it: `</a>`."), ("`<a src=\"...\">`", "The attribute for a link is href. src is for pictures.", "Write `<a href=\"...\">`."), ("`<a href=\"...\"><strong>NASA</a></strong>`", "The tags cross. The inside tag must close first.", "Write `<strong>NASA</strong></a>`."), ("Link text like \"click here\"", "It does not say where the link goes.", "Write words that say what is behind it."), ("Putting `target` or `href` in the closing tag", "Attributes go in the opening tag only.", "Keep the closing tag plain: `</a>`.")],
  [], QS(9), title='Links', kick='Connect pages with the a tag, choose where links open, and make words, headings and pictures clickable.', site="<b>Notes:</b> links-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Space Fan Club &nbsp;·&nbsp; <b>Assignment:</b> YouTube Favorites &nbsp;·&nbsp; <b>Quiz game:</b> 3.9")

# =============================================================================== 3.10
C310 = L("3.10", "Build ordered and unordered lists, change their markers, and make a menu that sits in a row.",
  [("ul", "an unordered (bulleted) list: order does not matter"), ("ol", "an ordered (numbered) list: order matters"), ("li", "one list item; the only tag allowed directly inside a ul or ol"), ("marker", "the bullet or number in front of each item"), ("block", "a tag that starts on a new line and fills the width"), ("inline", "a tag that stays inside the line, like a word")],
  [("Two kinds of list", """A recipe says "1, 2, 3" because the order matters. A grocery list uses bullets because you can buy the eggs before the milk. HTML makes you choose:

| Tag | Meaning | Use it for |
| `<ol>` | **ordered** list (numbers) | steps, rankings, countdowns |
| `<ul>` | **unordered** list (bullets) | ingredients, features, favorites |
| `<li>` | one **list item** | every item in either list |

The list tag is the wrapper and the `li` tags are the items. Only `li` tags go directly inside a ul or ol, and every li has its own closing tag."""),
   ("Changing the marker", """The bullet or number in front of each item is the **marker**. Change it with `list-style-type`, written on the **list tag** (`ul` or `ol`), not on each li:

| List | Values you can use |
| `ul` | `disc` (the default dot), `circle`, `square`, `none` |
| `ol` | `decimal` (1, 2, 3), `upper-roman` (I, II, III), `lower-roman`, `upper-alpha` (A, B, C), `lower-alpha` |"""),
   ("Block and inline", """Every tag behaves in one of two ways. **Block** tags (`h1` to `h6`, `p`, `ul`, `ol`, `li`, `hr`) start on a **new line** and take the whole width. **Inline** tags (`span`, `strong`, `em`, `a`, `img`) stay **inside the line** and only take the room they need, like words.

The style `display` switches a tag: `display: inline` makes a block act like a word."""),
   ("A menu in a row", """Every menu bar on the internet is a list turned sideways. Put `list-style-type: none` on the `ul` to remove the bullets, and `display: inline` on **every** `li` so they sit in a row."""),
  ],
  [HX("Three kinds of list", '<ul style="list-style-type: square">\n<li>Tent</li>\n<li>Flashlight</li>\n</ul>\n<ol style="list-style-type: upper-roman">\n<li>Build a fire</li>\n<li>Roast snacks</li>\n</ol>\n<ul style="list-style-type: none">\n<li style="display: inline">Home</li>\n<li style="display: inline">About</li>\n</ul>', [(0, "list-style-type: square", "The marker goes on the list tag. Square bullets."), (1, "<li>Tent</li>", "Every item is its own li."), (4, "upper-roman", "A numbered list with Roman numerals: I, II."), (8, "list-style-type: none", "No markers: a menu has no bullets."), (9, "display: inline", "Every li sits in the line like a word.")], cap="The last list is a menu: no bullets, and the items sit side by side."),
   HX("Why one li drops down", '<ul style="list-style-type: none">\n<li style="display: inline">Home</li>\n<li>About</li>\n<li style="display: inline">Contact</li>\n</ul>', [(1, "display: inline", "This li sits in the line."), (2, "<li>About</li>", "No display: inline, so it is a block and takes its own line."), (3, "display: inline", "Contact follows on the line after About.")], cap="Remove display: inline from one item and it drops to its own line.")],
  [TX("An unordered list", '<ul>\n<li>Tent</li>\n<li>Map</li>\n<li>Snacks</li>\n</ul>', cap="Each li adds one line to the list. The opening and closing ul rows build nothing on their own."),
   TX("An ordered list with letters", '<ol style="list-style-type: upper-alpha">\n<li>Mix</li>\n<li>Bake</li>\n<li>Frost</li>\n</ol>', cap="The three items show the markers A, B and C. The words on the page are the same as in any list."),
   TX("A menu in one row", '<ul style="list-style-type: none">\n<li style="display: inline">Home</li>\n<li style="display: inline">About</li>\n<li style="display: inline">Shop</li>\n</ul>', cap="Because every li is inline, the three words end up on one line: Home About Shop.")],
  [("Text typed straight inside `<ul>`", "Only li tags may go directly inside a list.", "Put the words inside an `<li>`."), ("A missing `</li>`", "Every item needs its closing tag.", "Close each item: `<li>Tent</li>`."), ("`list-style-type` on the li", "It changes only that one item.", "Write it on the `<ul>` or `<ol>`."), ("`upper-roman` on a `ul`", "Roman numerals belong to ordered lists.", "Use `ol`, or pick `square` or `circle` for a ul."), ("A menu where one item is on its own line", "That li is missing `display: inline`.", "Put `display: inline` on every li."), ("An `li` outside any list", "It needs a ul or ol around it.", "Wrap the items in a list.")],
  [], QS(10), title='Lists and Menus', kick='Bulleted lists, numbered lists, marker styles, and a menu that sits in a row.', site="<b>Notes:</b> lists-notes &nbsp;·&nbsp; <b>Walkthrough:</b> Camping Trip &nbsp;·&nbsp; <b>Assignment:</b> Pizza Hut Specials &nbsp;·&nbsp; <b>Quiz game:</b> 3.10")
CHAPTERS_C = [C38, C39, C310]
