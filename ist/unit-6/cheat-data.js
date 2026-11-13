/* Cheat sheet content. ONE entry per tag / attribute / property / value.
   T(name, kind, aliases, keywords, plain-words, breakdown[[piece, meaning]], watch-out, examples)
   E(caption, code, arrows[[text in the code, caption]], show-browser-result?)
   Arrows point at the FIRST place the text appears in the code, so keep each arrowed piece unique on its line. */
(function (root) {
  function E(cap, code, a, r) { return { cap: cap, c: code.replace(/^\n/, "").replace(/\n$/, ""), a: a || [], r: r !== false }; }
  function T(n, kind, al, k, say, parts, tip, ex) { return { n: n, kind: kind, al: al || [], k: k || "", say: say, parts: parts || [], tip: tip || "", ex: ex }; }
  var D = [

/* ---------- TAGS ---------- */
T("<!DOCTYPE html>", "tag", ["doctype"], "first line declaration skeleton",
  "This is the very first line of every web page. It tells the browser, \"This page is written in modern HTML.\" Visitors never see it, but the browser needs it.",
  [["<!DOCTYPE html>", "Says what kind of file this is"]],
  "It goes on line 1, before <html>. It has no closing tag.",
  [E("The doctype is the first thing on the page", `<!DOCTYPE html>`, [["<!DOCTYPE html>", "always the very first line"]], false),
   E("Then the rest of the page follows it", `<!DOCTYPE html><html><body><p>Hello!</p></body></html>`, [["<!DOCTYPE html>", "comes first"], ["<html>", "the page starts after it"]])]),

T("<html>", "tag", ["html"], "skeleton wrapper container page",
  "The <html> tag is the big box that holds your whole page. Everything except the doctype goes inside it, like a lunchbox that holds everything you packed.",
  [["<html>", "Opening tag: the page starts"], ["</html>", "Closing tag (has a slash): the page ends"]],
  "Two things go inside: one <head> and one <body>. Nothing goes after </html>.",
  [E("html wraps everything", `<!DOCTYPE html>
<html>
  <body>
    <p>Everything is inside html.</p>
  </body>
</html>`, [["<html>", "opening tag"], ["</html>", "closing tag"]]),
   E("html with a head and a body inside", `<html>
  <head>
    <title>Cats</title>
  </head>
  <body>
    <h1>I like cats</h1>
  </body>
</html>`, [["<head>", "part 1: info about the page"], ["<body>", "part 2: what people see"]])]),

T("<head>", "tag", ["head"], "skeleton info hidden",
  "The head holds information ABOUT your page. The words in the browser tab, the link to your fonts, and your CSS file all live here. Nothing inside the head shows up on the page itself.",
  [["<head>", "Opening tag"], ["<title>", "Goes inside the head"], ["</head>", "Closing tag"]],
  "Do not put paragraphs or headings in the head. Those belong in the body.",
  [E("A head with a title", `<head>
  <title>My Favorite Games</title>
</head>
<body>
  <h1>My Favorite Games</h1>
</body>`, [["<head>", "hidden info starts"], ["<title>", "the tab name"], ["<body>", "the visible page starts here"]]),
   E("A head with a title and a font link", `<head>
  <title>Pizza Place</title>
  <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
  <h1 style="font-family: 'Lobster';">Pizza Place</h1>
</body>`, [["<link", "loads a Google font"], ["<h1", "the body uses that font"]])]),

T("<title>", "tag", ["title"], "browser tab name",
  "The title is the name that shows in the browser TAB at the top of the window. It does not show on the page. It also becomes the name when someone bookmarks your page.",
  [["<title>", "Opening tag"], ["My First Website", "The words that show in the tab"], ["</title>", "Closing tag"]],
  "The title goes inside the <head>, not the <body>.",
  [E("A title for a page", `<title>My First Website</title>`, [["<title>", "opening tag"], ["My First Website", "shows in the browser tab"], ["</title>", "closing tag"]], false),
   E("Another title", `<title>Band Profile: The Comets</title>`, [["Band Profile: The Comets", "the tab says this, but the page does not"]], false)]),

T("<body>", "tag", ["body"], "skeleton visible page content",
  "Everything people can SEE on your page goes inside the body: headings, paragraphs, images, links, and lists.",
  [["<body>", "Opening tag: the visible part starts"], ["</body>", "Closing tag: the visible part ends"]],
  "Only one body per page. You can style the whole page by putting a style on the body tag.",
  [E("A body with a heading and a paragraph", `<body>
  <h1>My Dog</h1>
  <p>His name is Max.</p>
</body>`, [["<body>", "visible stuff starts"], ["<h1>", "a heading"], ["<p>", "a paragraph"], ["</body>", "visible stuff ends"]]),
   E("Style on the body changes the whole page", `<body style="background-color: lightyellow;">
  <h1>Sunny page</h1>
  <p>The whole page is light yellow.</p>
</body>`, [["style=", "style goes inside the opening tag"], ["background-color", "the color behind everything"]])]),

T("<h1> to <h6> (headings)", "tag", ["h1", "h2", "h3", "h4", "h5", "h6", "heading", "headings"], "title big text heading size",
  "Headings are titles. <h1> is the biggest and most important. <h2> is a little smaller, <h3> smaller still, all the way down to <h6>. Use h1 for the page title, then h2 and h3 for sections.",
  [["<h1>", "Biggest heading (page title)"], ["<h2>", "Section heading"], ["<h3>", "Smaller heading under a section"]],
  "Do not pick a heading just because it looks big. Pick it for how important it is. You can change the size later with font-size.",
  [E("Three levels of headings", `<h1>Honey Bee</h1><h2>Life in the Colony</h2><h3>The Queen</h3>`, [["<h1>", "page title: biggest"], ["<h2>", "a section"], ["<h3>", "a smaller part"]]),
   E("Headings with paragraphs under them", `<h1>Volcanoes</h1><p>A volcano is an opening in the Earth.</p><h2>Types</h2><p>There are three main types.</p>`, [["<h1>", "the main title"], ["<h2>", "starts a new section"]])]),

T("<p>", "tag", ["p", "paragraph"], "text paragraph words sentence",
  "The paragraph tag holds a chunk of regular text. The browser adds a little space above and below each paragraph so they do not touch.",
  [["<p>", "Opening tag"], ["Your words", "What the visitor reads"], ["</p>", "Closing tag"]],
  "Pressing Enter in your code does NOT start a new paragraph. You need a new <p> tag for that.",
  [E("Two paragraphs", `<p>Bees turn nectar into honey.</p><p>One hive can hold 50,000 bees.</p>`, [["<p>Bees", "first paragraph opens"], ["</p><p>", "closes one, opens the next"]]),
   E("A paragraph with a style", `<p style="color: teal; font-size: 20px;">This text is teal and bigger.</p>`, [["style=", "style goes in the opening tag"], ["color: teal;", "text color"], ["font-size: 20px;", "text size"]])]),

T("<strong> and <b> (bold)", "tag", ["strong", "b", "bold"], "bold heavy thick important text",
  "These tags make text bold. <strong> means \"this is important.\" <b> just makes it look bold. Either one works in this class.",
  [["<strong>", "Start bold"], ["very important", "Bold words"], ["</strong>", "Stop bold"]],
  "Put the tags only around the words you want bold, not the whole paragraph.",
  [E("Bold a few words", `<p>Study for the <strong>test</strong> on Friday.</p>`, [["<strong>", "bold starts"], ["</strong>", "bold ends"]]),
   E("Using b instead", `<p>Today's special is <b>pepperoni pizza</b>.</p>`, [["<b>", "bold starts"], ["</b>", "bold ends"]])]),

T("<em> and <i> (italic)", "tag", ["em", "i", "italic", "italics"], "slanted emphasis text",
  "These tags make text slanted (italic). Use <em> when you want to stress a word, and <i> for titles of books or movies.",
  [["<em>", "Start italic"], ["</em>", "Stop italic"]],
  "Close it! If you forget </em>, the whole rest of the page turns italic.",
  [E("Stress one word", `<p>I said I was <em>not</em> hungry.</p>`, [["<em>", "italic starts"], ["</em>", "italic ends"]]),
   E("A book title", `<p>My favorite book is <i>Hatchet</i>.</p>`, [["<i>", "italic starts"], ["</i>", "italic ends"]])]),

T("<br> (line break)", "tag", ["br", "break", "newline", "new line"], "line break enter new line poem",
  "<br> drops the text to the next line without starting a new paragraph. It is great for poems and addresses.",
  [["<br>", "Break: go to the next line"]],
  "It has NO closing tag. Never write </br>.",
  [E("A short poem", `<p>Roses are red,<br>Violets are blue.</p>`, [["<br>", "next line starts here"]]),
   E("An address", `<p>Sam Houston High<br>100 Main Street<br>Dallas, TX</p>`, [["<br>100", "first line break"], ["<br>Dallas", "second line break"]])]),

T("<hr> (horizontal line)", "tag", ["hr", "line", "divider", "horizontal rule"], "line divider separate",
  "<hr> draws a line across the page. It is a divider that separates one part of your page from the next.",
  [["<hr>", "Draws the line"]],
  "It has no closing tag, and it goes between tags, not inside a paragraph.",
  [E("Divide two paragraphs", `<p>Above the line</p><hr><p>Below the line</p>`, [["<hr>", "the divider line"]]),
   E("A colored divider", `<p>Above</p><hr style="border-top: 3px solid red;"><p>Below</p>`, [["style=", "style works on hr too"], ["border-top", "the line is really a top border"]])]),

T("<span>", "tag", ["span"], "inline container few words style part",
  "<span> is an invisible wrapper for just a few words inside a line. By itself it does nothing. Add a style to it, and only those words change.",
  [["<span", "Opening tag"], ["style=", "The style for just these words"], ["</span>", "Closing tag"]],
  "Use span for a few words. Use div for a bigger box.",
  [E("Color just one word", `<p>My favorite color is <span style="color: tomato;">tomato</span>.</p>`, [["<span", "only this part changes"], ["color: tomato;", "the change"], ["</span>", "back to normal"]]),
   E("A different font on two words", `<p>Come to the <span style="font-family: 'Lobster';">night market</span> tonight.</p>`, [["<span", "starts the special words"], ["'Lobster'", "a Google font"]])]),

T("<div>", "tag", ["div", "division", "box", "container"], "box container group block section",
  "<div> is a box that groups other tags together. Anything inside it can be styled as one block, like a border around a whole card.",
  [["<div", "Opening tag"], ["</div>", "Closing tag: end of the box"]],
  "A div always starts on its own line and takes the full width, unlike span.",
  [E("A box around a heading and paragraph", `<div style="background-color: lightyellow; border: 2px solid gold;"><h3>Heads up</h3><p>Everything in this box is grouped.</p></div>`, [["<div", "the box starts"], ["border: 2px solid gold;", "border around the whole group"], ["</div>", "the box ends"]]),
   E("Two boxes side by side with display", `<div style="display: inline-block; border: 2px solid navy;">Box one</div><div style="display: inline-block; border: 2px solid tomato;">Box two</div>`, [["inline-block", "lets boxes sit side by side"]])]),

T("<link>", "tag", ["link", "stylesheet", "favicon", "google fonts"], "google font css file icon head",
  "<link> connects your page to something outside it. You use it to load a Google Font, to attach your style.css file, or to add the little icon in the browser tab (the favicon).",
  [["href", "Where the thing lives"], ["rel", "What kind of thing it is"]],
  "Goes in the <head>. It has NO closing tag.",
  [E("Load a Google font, then use it", `<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet"><h1 style="font-family: 'Pacifico';">Beach Day</h1>`, [["href=", "the Google Fonts address"], ["rel=\"stylesheet\"", "this link is for styles"], ["'Pacifico'", "now you can use the font"]]),
   E("Connect your own CSS file", `<link rel="stylesheet" href="style.css">`, [["rel=\"stylesheet\"", "it is a CSS file"], ["href=\"style.css\"", "the file name"]], false),
   E("Add a favicon (tab icon)", `<link rel="icon" href="logo.png">`, [["rel=\"icon\"", "this link is a tab icon"], ["logo.png", "the picture to use"]], false)]),

T("<img> (image)", "tag", ["img", "image", "picture", "photo"], "picture photo show src alt",
  "<img> shows a picture on your page. You tell it where the picture file is (src) and describe it in words (alt) for people who cannot see it.",
  [["src", "Where the picture file is"], ["alt", "Words that describe the picture"], ["width", "How wide to show it"]],
  "No closing tag. Spell the file name exactly the same, including capital letters and the .jpg or .png at the end.",
  [E("A basic image", `<img src="dog.jpg" alt="A black puppy">`, [["src=\"dog.jpg\"", "the picture file"], ["alt=\"A black puppy\"", "describes the picture"]]),
   E("Make the image smaller", `<img src="dog.jpg" alt="A black puppy" width="150">`, [["width=\"150\"", "150 pixels wide (height adjusts)"]])]),

T("<a> (link)", "tag", ["a", "link", "anchor", "hyperlink", "clickable"], "link click go page website anchor href",
  "<a> makes something clickable. The words (or picture) between the tags become a link, and href says where it goes when someone clicks.",
  [["<a", "Opening tag"], ["href", "The address to go to"], ["Visit Wikipedia", "The clickable words"], ["</a>", "Closing tag"]],
  "Without href it is not a link. You can put a whole image, heading, or paragraph inside the a tag.",
  [E("A text link in a new tab", `<a href="https://www.wikipedia.org" target="_blank">Visit Wikipedia</a>`, [["href=", "where it goes"], ["target=\"_blank\"", "opens in a new tab"], ["Visit Wikipedia", "what people click"]]),
   E("A clickable image", `<a href="https://www.wikipedia.org"><img src="dog.jpg" alt="A black puppy" width="120"></a>`, [["<a href", "the link wraps the image"], ["<img", "click the picture to go"], ["</a>", "link ends"]])]),

T("<ul> (bulleted list)", "tag", ["ul", "unordered list", "bullets", "list", "bullet list"], "list dots bullet items",
  "<ul> makes a bulleted list, where the order does not matter. Each item inside it is an <li>.",
  [["<ul>", "Starts the bullet list"], ["<li>", "One item"], ["</ul>", "Ends the list"]],
  "Only <li> tags go directly inside a <ul>. Do not put plain text there.",
  [E("A shopping list", `<ul><li>Milk</li><li>Eggs</li><li>Bread</li></ul>`, [["<ul>", "the list starts"], ["<li>Milk", "each item is an li"], ["</ul>", "the list ends"]]),
   E("A list with the bullets removed", `<ul style="list-style-type: none;"><li>Home</li><li>About</li></ul>`, [["list-style-type: none;", "no bullet dots"]])]),

T("<ol> (numbered list)", "tag", ["ol", "ordered list", "numbered list", "numbers"], "list numbers steps order",
  "<ol> makes a numbered list. Use it when the order matters, like steps in a recipe. The browser counts for you.",
  [["<ol>", "Starts the numbered list"], ["<li>", "One step"], ["</ol>", "Ends the list"]],
  "You never type the numbers. If you add a new <li> in the middle, the numbers fix themselves.",
  [E("Recipe steps", `<ol><li>Crack the egg</li><li>Stir it</li><li>Cook it</li></ol>`, [["<ol>", "numbers start"], ["<li>Crack", "becomes number 1"], ["<li>Cook", "becomes number 3"]]),
   E("Numbers as letters", `<ol style="list-style-type: upper-alpha;"><li>Red</li><li>Blue</li></ol>`, [["upper-alpha", "A, B, C instead of 1, 2, 3"]])]),

T("<li> (list item)", "tag", ["li", "list item", "item"], "list item bullet number",
  "<li> is one item in a list. It always goes inside a <ul> (bullets) or an <ol> (numbers).",
  [["<li>", "Opening tag"], ["</li>", "Closing tag"]],
  "An li by itself, outside a list, looks wrong.",
  [E("Items inside a ul", `<ul><li>Pencil</li><li>Notebook</li></ul>`, [["<li>Pencil", "item one"], ["<li>Notebook", "item two"]]),
   E("An inline li makes a menu row", `<ul style="list-style-type: none;"><li style="display: inline;">Home</li><li style="display: inline;">About</li><li style="display: inline;">Contact</li></ul>`, [["display: inline;", "sits on the same line"]])]),

T("<table> (tr, th, td)", "tag", ["table", "tr", "th", "td", "row", "cell", "column"], "table grid data row cell header",
  "A table shows information in rows and columns. <table> is the whole grid, <tr> is one row, <th> is a bold header cell, and <td> is a regular cell.",
  [["<table>", "The whole grid"], ["<tr>", "One row"], ["<th>", "Header cell (bold)"], ["<td>", "Regular cell"]],
  "Cells (<th> and <td>) go inside a row (<tr>), and rows go inside the <table>.",
  [E("A 2 by 2 table", `<table border="1"><tr><th>Name</th><th>Score</th></tr><tr><td>Ana</td><td>95</td></tr></table>`, [["<table", "the grid starts"], ["<tr>", "a row starts"], ["<th>Name", "a header cell"], ["<td>Ana", "a regular cell"]]),
   E("A table with a colored header", `<table border="1"><tr><th style="background-color: navy; color: white;">Team</th><th style="background-color: navy; color: white;">Wins</th></tr><tr><td>Tigers</td><td>8</td></tr></table>`, [["background-color: navy;", "styles one header cell"]])]),

T("<form>", "tag", ["form", "input", "button", "label", "text box"], "form box button sign up contact fill out",
  "A form lets a visitor type things in and press a button. <form> is the box that holds the pieces. Inside it you put a label (words), an input (a place to type), and a button.",
  [["<form>", "Starts the form"], ["<label>", "The words that name a box"], ["<input", "A box to type in"], ["<button>", "A button to press"]],
  "<input> has no closing tag. The form is for looks in this class, it does not send anything.",
  [E("A small sign-up form", `<form><label>Your name</label> <input type="text"> <button>Send</button></form>`, [["<form>", "the form starts"], ["<label>", "tells what to type"], ["<input", "the typing box"], ["<button>", "the button"]]),
   E("Two boxes and a button", `<form><label>Email</label> <input type="text"> <label>Message</label> <input type="text"> <button>Submit</button></form>`, [["<label>Email", "label for box one"], ["<label>Message", "label for box two"]])]),

T("<style> (internal CSS)", "tag", ["style tag", "internal css", "css"], "css rules head selector internal",
  "A <style> tag lets you write CSS rules in the head, so one rule can style EVERY tag of a kind instead of styling each tag by hand.",
  [["<style>", "CSS rules start"], ["p {", "Which tag to style"], ["color: teal;", "What to change"], ["</style>", "CSS rules end"]],
  "Goes in the <head>. The rules inside use { } and end each line with a semicolon.",
  [E("Style every paragraph at once", `<style>p { color: teal; }</style><p>One rule styles me.</p><p>And me too.</p>`, [["<style>", "rules start"], ["p {", "every p"], ["color: teal;", "turn the text teal"]]),
   E("Two rules", `<style>h1 { color: navy; } p { font-size: 20px; }</style><h1>Big Title</h1><p>Bigger paragraph text.</p>`, [["h1 {", "rule for headings"], ["p {", "rule for paragraphs"]])]),

/* ---------- ATTRIBUTES ---------- */
T("style", "attribute", ["style attribute", "inline style", "inline styling"], "css look change color size inline",
  "The style attribute changes how ONE tag looks. You write it inside the opening tag, then list what to change.",
  [["style=", "The attribute name"], ["\"", "Quotes wrap everything"], ["color: red;", "property: value; (ends with a semicolon)"]],
  "Only one set of quotes around all the changes. Put a semicolon after each one.",
  [E("One change", `<p style="color: red;">Red text</p>`, [["style=", "attribute"], ["color", "property: what to change"], ["red", "value: the setting"]]),
   E("Chain two changes", `<h1 style="color: white; background-color: navy;">Welcome</h1>`, [["color: white;", "change 1"], ["background-color: navy;", "change 2, same quotes"]])]),

T("href", "attribute", ["href", "link address", "url"], "link address url where go a",
  "href tells a link where to go. It is the address of the page.",
  [["href=", "The attribute name"], ["\"https://...\"", "The address in quotes"]],
  "No href means no link. Do not forget the https:// part for outside websites.",
  [E("Link to another website", `<a href="https://www.google.com">Search</a>`, [["href=", "where the link goes"]]),
   E("Link to another page of your site", `<a href="about.html">About me</a>`, [["about.html", "a file in your own site"]])]),

T("src", "attribute", ["src", "source", "image file"], "image picture file where img",
  "src (short for source) tells an image tag where the picture file is.",
  [["src=", "The attribute name"], ["\"dog.jpg\"", "The picture file name"]],
  "The file name must match exactly, with the right capitals and ending (.jpg, .png).",
  [E("A picture in the same folder", `<img src="dog.jpg" alt="A puppy">`, [["src=\"dog.jpg\"", "find this file"]]),
   E("A picture from the internet", `<img src="https://example.com/cat.png" alt="A cat">`, [["https://example.com/cat.png", "a full web address"]], false)]),

T("alt", "attribute", ["alt", "alt text", "alternative text"], "image description words screen reader",
  "alt is a short description of a picture in words. People who use a screen reader hear it, and it shows if the picture fails to load.",
  [["alt=", "The attribute name"], ["\"A black puppy\"", "A description in quotes"]],
  "Describe what is in the picture. Do not write \"image of\".",
  [E("Describe the picture", `<img src="dog.jpg" alt="A black puppy">`, [["alt=\"A black puppy\"", "what a screen reader says"]]),
   E("alt on a clickable image", `<a href="https://www.wikipedia.org"><img src="dog.jpg" alt="Go to Wikipedia" width="100"></a>`, [["alt=\"Go to Wikipedia\"", "tells where the click goes"]])]),

T("target=\"_blank\"", "attribute", ["target", "_blank", "new tab", "open in new tab"], "new tab link open window",
  "target tells a link where to open. The value _blank means \"open in a NEW tab,\" so the visitor does not leave your page.",
  [["target=", "The attribute name"], ["\"_blank\"", "Open a new tab"]],
  "The underscore matters: _blank. Leave target off and the link opens in the same tab.",
  [E("Open in a new tab", `<a href="https://www.wikipedia.org" target="_blank">Wikipedia</a>`, [["target=\"_blank\"", "new tab"]]),
   E("Same tab vs new tab", `<a href="https://www.google.com">Same tab</a>
<a href="https://www.google.com" target="_blank">New tab</a>`, [["Same tab", "no target: leaves your page"], ["target=\"_blank\"", "stays on your page"]])]),

T("width and height", "attribute / property", ["width", "height", "size"], "size image pixels wide tall",
  "width and height set how big something is. For an image, set ONLY the width and the height follows so the picture does not get squished.",
  [["width=\"150\"", "As an attribute: 150 pixels"], ["width: 50%;", "As a style: 50% of the space"]],
  "Pick width OR height for an image, not both.",
  [E("Width as an attribute", `<img src="dog.jpg" alt="A puppy" width="150">`, [["width=\"150\"", "150 pixels wide"]]),
   E("Width as a style, in percent", `<img src="dog.jpg" alt="A puppy" style="width: 50%;">`, [["width: 50%;", "half of the space"]])]),

T("class", "attribute", ["class"], "name group css selector style many",
  "class gives a tag a nickname. Then one CSS rule can style every tag that has that nickname.",
  [["class=\"note\"", "The nickname is note"], [".note", "In CSS, a dot means class"]],
  "In CSS you write a dot before the name (.note). In HTML you do not.",
  [E("Style everything with the class", `<style>
  .note { background-color: lightyellow; }
</style>
<p class="note">Remember your charger.</p>
<p>No class here.</p>
<p class="note">Bring a pencil.</p>`, [[".note", "rule for the class"], ["class=\"note\">Remember", "gets the style"], ["<p>No class", "no class: unchanged"]]),
   E("Two classes on one tag", `<style>
  .big { font-size: 28px; }
  .red { color: red; }
</style>
<p class="big red">Big and red</p>`, [["class=\"big red\"", "two names, separated by a space"]])]),

T("id", "attribute", ["id"], "name one unique selector",
  "id is a name that belongs to ONE tag on the page. Use it when you want to style exactly one thing.",
  [["id=\"title\"", "The one-of-a-kind name"], ["#title", "In CSS, # means id"]],
  "Never use the same id twice on a page. Use class for groups.",
  [E("Style one heading", `<style>
  #title { color: tomato; }
</style>
<h1 id="title">My Page</h1>
<h2>Not me</h2>`, [["#title", "# means id"], ["id=\"title\"", "matches the rule"]]),
   E("An id on a paragraph", `<style>
  #intro { font-size: 22px; }
</style>
<p id="intro">Welcome to my page.</p>
<p>Everything else is normal size.</p>`, [["id=\"intro\"", "only this paragraph"]])]),

T("rel", "attribute", ["rel", "relationship"], "link stylesheet icon head",
  "rel (short for relationship) tells a <link> what the file is for.",
  [["rel=\"stylesheet\"", "It is a CSS file or font"], ["rel=\"icon\"", "It is the tab icon"]],
  "Only used on <link>, in the head.",
  [E("A stylesheet link", `<link rel="stylesheet" href="style.css">`, [["rel=\"stylesheet\"", "this is styles"]], false),
   E("A tab icon", `<link rel="icon" href="logo.png">`, [["rel=\"icon\"", "this is the tab icon"]], false)]),

/* ---------- CSS PROPERTIES ---------- */
T("color", "property", ["text color", "font color"], "text color words red blue",
  "color changes the color of the TEXT. Use a color name like tomato or a hex code like #FF6347.",
  [["color:", "The property"], ["teal", "The value (a color name or hex)"], [";", "Ends the line"]],
  "color is the text. For the space behind the text use background-color.",
  [E("Named color", `<p style="color: teal;">Teal text</p>`, [["color: teal;", "text turns teal"]]),
   E("Hex color", `<h2 style="color: #FF6347;">Tomato red heading</h2>`, [["#FF6347", "a hex color code"]])]),

T("background-color", "property", ["background", "background color"], "color behind fill",
  "background-color paints the space BEHIND an element. Put it on the body and the whole page changes.",
  [["background-color:", "The property"], ["lightyellow", "The color behind"]],
  "Do not use the same color for color and background-color. The text will vanish.",
  [E("A colored paragraph", `<p style="background-color: gold;">Gold behind the text.</p>`, [["background-color: gold;", "color behind"]]),
   E("Whole page color", `<body style="background-color: lightyellow;">
  <p>The page is light yellow.</p>
</body>`, [["background-color: lightyellow;", "on the body = whole page"]])]),

T("font-size", "property", ["font size", "text size"], "size big small text px",
  "font-size changes how big the letters are. Write a number followed by px (pixels).",
  [["font-size:", "The property"], ["32px", "The size: number then px"]],
  "No space between the number and px: 32px, not 32 px.",
  [E("Bigger text", `<p style="font-size: 32px;">Big text</p>`, [["font-size: 32px;", "32 pixels tall"]]),
   E("Tiny text", `<p style="font-size: 12px;">Small print</p>`, [["12px", "smaller number = smaller text"]])]),

T("text-align", "property", ["text align", "align", "center text"], "center left right alignment",
  "text-align moves text left, center, or right inside its box.",
  [["text-align:", "The property"], ["center", "left, center, or right"]],
  "Left is the default, so you only need it for center or right.",
  [E("Centered title", `<h1 style="text-align: center;">My Page</h1>`, [["text-align: center;", "in the middle"]]),
   E("Right-aligned signature", `<p style="text-align: right;">Signed, Sam</p>`, [["text-align: right;", "pushed to the right"]])]),

T("text-transform", "property", ["text transform", "letter case", "uppercase", "lowercase", "capitalize"], "capital letters case change",
  "text-transform changes the letter case for you, so you do not have to retype. It can make ALL CAPS, all lowercase, or Capitalize Each Word.",
  [["text-transform:", "The property"], ["uppercase", "ALL CAPS"], ["lowercase", "all small"], ["capitalize", "First Letter Of Each Word"]],
  "It only changes how the words LOOK. The words in your code stay the same.",
  [E("All caps", `<h3 style="text-transform: uppercase;">breaking news</h3>`, [["uppercase", "shows as BREAKING NEWS"]]),
   E("Capitalize each word", `<p style="text-transform: capitalize;">the lord of the rings</p>`, [["capitalize", "shows as The Lord Of The Rings"]])]),

T("font-family", "property", ["font family", "font", "fonts", "google font"], "font typeface style google",
  "font-family chooses the font (the style of the letters). Write the font's name in quotes after it.",
  [["font-family:", "The property"], ["'Pacifico'", "The font's name, in quotes"]],
  "The font name uses single quotes because the style already uses double quotes. Load Google fonts with a link tag first.",
  [E("A Google font", `<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
<h1 style="font-family: 'Pacifico';">Beach Day</h1>`, [["family=Pacifico", "loads the font"], ["'Pacifico'", "uses the font"]]),
   E("A built-in font", `<p style="font-family: Verdana;">Easy to read.</p>`, [["Verdana", "the font's name"]])]),

T("border", "property", ["borders", "border-top", "border-bottom", "border-left", "border-right", "outline"], "border box line around frame",
  "border draws a line around an element. You give it three things in order: how thick, what style, and what color.",
  [["border:", "The property"], ["3px", "Thickness"], ["solid", "Style: solid, dashed, or dotted"], ["red", "Color"]],
  "Use border-top, border-bottom, border-left, or border-right for just one side.",
  [E("A full border", `<p style="border: 3px solid red;">A red box</p>`, [["3px", "thickness"], ["solid", "style"], ["red", "color"]]),
   E("A border on one side", `<h2 style="border-bottom: 4px dashed navy;">Underlined heading</h2>`, [["border-bottom", "only the bottom"], ["dashed", "dashes, not a solid line"]])]),

T("padding", "property", [], "space inside box border text",
  "padding is empty space INSIDE a box, between the text and the border. More padding means the text has more room.",
  [["padding:", "The property"], ["20px", "How much space inside"]],
  "Padding is inside the border. Margin is outside the border.",
  [E("Breathing room inside a border", `<p style="border: 2px solid navy; padding: 20px;">Roomy box</p>`, [["padding: 20px;", "space between text and border"]]),
   E("No padding vs padding", `<p style="border: 2px solid red;">No padding</p>
<p style="border: 2px solid green; padding: 15px;">With padding</p>`, [["No padding", "text touches the border"], ["padding: 15px;", "text has room"]])]),

T("margin", "property", [], "space outside box around gap",
  "margin is empty space OUTSIDE a box, pushing other things away from it.",
  [["margin:", "The property"], ["30px", "How much space outside"]],
  "Margin is outside the border. Padding is inside.",
  [E("Push a box away", `<p style="border: 2px solid navy; margin: 30px;">Space outside me</p>`, [["margin: 30px;", "space outside the border"]]),
   E("Margin between two boxes", `<p style="border: 2px solid red; margin: 0;">Box 1</p>
<p style="border: 2px solid blue; margin: 25px 0;">Box 2</p>`, [["margin: 0;", "no space"], ["margin: 25px 0;", "25px above and below"]])]),

T("list-style-type", "property", ["list style", "list style type", "bullets", "marker"], "bullet number marker list change",
  "list-style-type changes the little marker in front of each list item: dots, squares, numbers, letters, or nothing.",
  [["list-style-type:", "The property"], ["square", "The marker style"]],
  "Put it on the <ul> or <ol>, not on every <li>.",
  [E("Square bullets", `<ul style="list-style-type: square;">
  <li>Red</li>
  <li>Blue</li>
</ul>`, [["square", "square bullets"]]),
   E("No bullets", `<ul style="list-style-type: none;">
  <li>Home</li>
  <li>About</li>
</ul>`, [["none", "no markers at all"]])]),

T("display", "property", ["display"], "inline block inline-block layout row",
  "display decides how a tag sits on the page. block starts on its own line. inline stays in the line. inline-block sits in a row but can have a size.",
  [["display:", "The property"], ["inline", "Sits on the same line"], ["block", "Gets its own line"], ["inline-block", "Same line, but you can set a width"]],
  "li tags are block by default. Switch them to inline to make a menu.",
  [E("Menu row from list items", `<ul style="list-style-type: none;">
  <li style="display: inline;">Home</li>
  <li style="display: inline;">About</li>
</ul>`, [["display: inline;", "no new line for each item"]]),
   E("Boxes in a row", `<div style="display: inline-block; border: 2px solid navy; padding: 8px;">One</div>
<div style="display: inline-block; border: 2px solid navy; padding: 8px;">Two</div>`, [["inline-block", "side by side, with padding allowed"]])]),

T("vertical-align", "property", ["vertical align"], "top middle bottom line up",
  "vertical-align lines things up from top to bottom when they sit side by side.",
  [["vertical-align:", "The property"], ["top", "Line them up at the top"]],
  "Use it on inline-block boxes that have different heights.",
  [E("Line up at the top", `<div style="display: inline-block; vertical-align: top; border: 2px solid navy; height: 80px; width: 80px;">Tall</div>
<div style="display: inline-block; vertical-align: top; border: 2px solid red; height: 40px; width: 80px;">Short</div>`, [["vertical-align: top;", "tops line up"]]),
   E("Default lines up at the bottom", `<div style="display: inline-block; border: 2px solid navy; height: 80px; width: 80px;">Tall</div>
<div style="display: inline-block; border: 2px solid red; height: 40px; width: 80px;">Short</div>`, [["inline-block", "no vertical-align: bottoms line up"]])]),

T("transition", "property", ["transitions", "animation"], "smooth change hover slow fade",
  "transition makes a change happen smoothly instead of instantly. It is often used with :hover so a color fades when the mouse touches it.",
  [["transition:", "The property"], ["0.5s", "How long the change takes (half a second)"]],
  "Put transition on the normal rule, and the change on the :hover rule.",
  [E("A button that fades", `<style>
  .btn { background-color: navy; color: white; padding: 10px; transition: 0.5s; }
  .btn:hover { background-color: tomato; }
</style>
<span class="btn">Hover me</span>`, [["transition: 0.5s;", "change takes half a second"], [".btn:hover", "the new color on hover"]]),
   E("Slow vs fast", `<style>
  .slow { background-color: gold; padding: 8px; transition: 2s; }
  .slow:hover { background-color: purple; color: white; }
</style>
<span class="slow">Slow fade</span>`, [["transition: 2s;", "very slow change"]])]),

/* ---------- SELECTORS ---------- */
T(":hover", "selector", ["hover", "mouse over"], "mouse touch point rollover css",
  ":hover is a CSS rule that only works while the mouse is touching something.",
  [[".link", "Which tag"], [":hover", "Only when the mouse is on it"], ["{ }", "What changes then"]],
  "No space before :hover.",
  [E("Change color on hover", `<style>
  p:hover { color: tomato; }
</style>
<p>Move your mouse over me.</p>`, [["p:hover", "when the mouse is on a paragraph"], ["color: tomato;", "turn tomato"]]),
   E("Hover on a class", `<style>
  .card { border: 2px solid gray; padding: 10px; }
  .card:hover { border-color: tomato; }
</style>
<div class="card">Hover over this card.</div>`, [[".card:hover", "hover on the card class"]])]),

T("Selectors: tag, .class, #id", "selector", ["selector", "selectors", "css rule", ".class", "#id", "tag selector", "combined selector"], "css rule style many tag class id combine",
  "A selector is the part of a CSS rule that says WHICH tags to style. Write the tag name to style every tag of that kind, a dot for a class, and a pound sign for an id.",
  [["p {", "Tag selector: every p"], [".note {", "Class selector: everything with class=\"note\""], ["#title {", "ID selector: the one tag with id=\"title\""]],
  "Combine them like p.note (only paragraphs with the note class) or ul li (only li inside a ul).",
  [E("All three kinds", `<style>
  p { font-size: 18px; }
  .note { color: tomato; }
  #title { text-align: center; }
</style>
<h1 id="title">Title</h1>
<p>Normal.</p>
<p class="note">A note.</p>`, [["p {", "every paragraph"], [".note {", "just class note"], ["#title {", "just id title"]]),
   E("Combined selectors", `<style>
  p.note { background-color: lightyellow; }
  ul li { color: teal; }
</style>
<p class="note">Yellow note.</p>
<ul><li>Teal item</li></ul>`, [["p.note", "p AND class note"], ["ul li", "li inside a ul"]])]),

/* ---------- VALUES ---------- */
T("Color values (names and hex)", "value", ["color names", "hex", "hex color", "hex code", "#ff6347", "tomato", "red", "blue", "rgb"], "color name code",
  "A color value can be a name (red, tomato, teal) or a hex code that starts with # and has six letters or numbers, like #FF6347.",
  [["tomato", "A color name"], ["#FF6347", "A hex code (# plus 6 characters)"]],
  "Hex codes need the # at the start. Pick colors with a color picker to get the code.",
  [E("A name and a hex code", `<p style="color: tomato;">Tomato by name</p>
<p style="color: #FF6347;">Tomato by hex code</p>`, [["tomato", "name"], ["#FF6347", "hex: the same color"]]),
   E("Two colors on one tag", `<h2 style="color: #FFFFFF; background-color: #1E3A8A;">White on navy</h2>`, [["#FFFFFF", "white"], ["#1E3A8A", "dark blue"]])]),

T("px and % (sizes)", "value", ["px", "pixels", "percent", "%", "pixel"], "size number unit pixels percent",
  "px means pixels, tiny dots on the screen. A bigger number is bigger. % means a part of the space available: 50% is half.",
  [["200px", "Exactly 200 pixels"], ["50%", "Half of the space"]],
  "Never put a space between the number and the unit.",
  [E("Exact size in pixels", `<img src="dog.jpg" alt="A puppy" style="width: 200px;">`, [["200px", "always 200 pixels wide"]]),
   E("Size as a percent", `<img src="dog.jpg" alt="A puppy" style="width: 40%;">`, [["40%", "40 percent of the page width"]])]),

T("center, left, right", "value", ["center", "left", "right", "middle"], "align position text",
  "These are the values for text-align. center puts text in the middle, right pushes it to the right, and left is the normal place.",
  [["center", "Middle"], ["right", "Right side"], ["left", "Left side (default)"]],
  "Spell it center, the American way.",
  [E("All three", `<p style="text-align: left;">Left</p>
<p style="text-align: center;">Center</p>
<p style="text-align: right;">Right</p>`, [["left", "left side"], ["center", "middle"], ["right", "right side"]]),
   E("Center a heading", `<h1 style="text-align: center;">Centered!</h1>`, [["text-align: center;", "heading in the middle"]])]),

T("uppercase, lowercase, capitalize", "value", ["uppercase", "lowercase", "capitalize"], "letter case text-transform caps",
  "These are the values for text-transform. uppercase makes ALL CAPS, lowercase makes all small letters, and capitalize makes The First Letter Big.",
  [["uppercase", "ALL CAPS"], ["lowercase", "all small"], ["capitalize", "First Letters Big"]],
  "Use them with text-transform.",
  [E("All three", `<p style="text-transform: uppercase;">Hello there</p>
<p style="text-transform: lowercase;">Hello There</p>
<p style="text-transform: capitalize;">hello there</p>`, [["uppercase", "HELLO THERE"], ["lowercase", "hello there"], ["capitalize", "Hello There"]]),
   E("A shouting heading", `<h2 style="text-transform: uppercase;">sale today</h2>`, [["uppercase", "shows as SALE TODAY"]])]),

T("solid, dashed, dotted", "value", ["solid", "dashed", "dotted", "border style"], "border line style",
  "These are the border styles. solid is a normal line, dashed is a row of dashes, and dotted is a row of dots.",
  [["solid", "A normal line"], ["dashed", "Dashes"], ["dotted", "Dots"]],
  "Put the style after the thickness: 3px solid red.",
  [E("All three", `<p style="border: 3px solid black;">solid</p>
<p style="border: 3px dashed black;">dashed</p>
<p style="border: 3px dotted black;">dotted</p>`, [["solid", "a line"], ["dashed", "dashes"], ["dotted", "dots"]]),
   E("A dotted underline on a heading", `<h2 style="border-bottom: 4px dotted tomato;">Dotted</h2>`, [["dotted", "dots"]])]),

T("inline, block, inline-block", "value", ["inline", "block", "inline-block", "inlineblock"], "display layout",
  "These are values for display. block starts a new line and fills the width. inline stays inside the line. inline-block sits in the line but lets you set a width and padding.",
  [["block", "Own line"], ["inline", "Stays in the line"], ["inline-block", "In the line, with a size"]],
  "Use them with the display property.",
  [E("Inline vs block", `<p style="display: inline;">One</p>
<p style="display: inline;">Two</p>
<p style="display: block;">Three</p>
<p style="display: block;">Four</p>`, [["display: inline;", "same line"], ["display: block;", "own line"]]),
   E("inline-block with padding", `<span style="display: inline-block; padding: 10px; background-color: gold;">One</span>
<span style="display: inline-block; padding: 10px; background-color: tomato;">Two</span>`, [["inline-block", "side by side, with padding"]])]),

T("none", "value", ["none", "no bullets"], "remove nothing list-style-type",
  "none means \"turn this off.\" With list-style-type, none takes away the bullet dots or numbers.",
  [["none", "Nothing"]],
  "Use it when you want a clean menu with no dots.",
  [E("Remove bullets", `<ul style="list-style-type: none;">
  <li>One</li>
  <li>Two</li>
</ul>`, [["none", "no dots"]]),
   E("Menu with no bullets, in a row", `<ul style="list-style-type: none;">
  <li style="display: inline;">Home</li>
  <li style="display: inline;">Shop</li>
</ul>`, [["none", "no dots"], ["display: inline;", "side by side"]])]),

T("Font families: serif, sans-serif, monospace, cursive", "value", ["serif", "sans-serif", "sansserif", "monospace", "cursive", "family"], "font family generic style",
  "These are the four main font families. Each has its own feel, and you can use one by itself as the font-family value.",
  [["serif", "Letters with little feet (like a book)"], ["sans-serif", "Clean, no feet"], ["monospace", "Every letter the same width (like code)"], ["cursive", "Handwriting style"]],
  "Google fonts belong to these families too. Pick the family that matches the feel of your page.",
  [E("All four", `<p style="font-family: serif;">serif</p>
<p style="font-family: sans-serif;">sans-serif</p>
<p style="font-family: monospace;">monospace</p>
<p style="font-family: cursive;">cursive</p>`, [["serif", "a book look"], ["monospace", "like code"], ["cursive", "handwriting"]]),
   E("Handwriting for a title", `<h1 style="font-family: cursive;">Beach Day</h1>`, [["cursive", "a handwriting look"]])]),

T("top", "value", ["top", "vertical align top"], "vertical-align line up top",
  "top is a value for vertical-align. It lines up things side by side so their tops match.",
  [["vertical-align:", "The property"], ["top", "Line up at the top"]],
  "Use it on inline-block boxes with different heights.",
  [E("Tops line up", `<div style="display: inline-block; vertical-align: top; border: 2px solid navy; width: 80px; height: 70px;">A</div>
<div style="display: inline-block; vertical-align: top; border: 2px solid red; width: 80px; height: 40px;">B</div>`, [["vertical-align: top;", "both start at the top"]]),
   E("Text next to an image", `<img src="dog.jpg" alt="A puppy" width="100" style="vertical-align: top;"> <span>Caption starts at the top.</span>`, [["vertical-align: top;", "image tops lines up with text"]])]),

/* ---------- CHARACTERS ---------- */
T("Emojis and symbols", "character", ["emoji", "emojis", "symbol", "symbols", "special characters", "copyright"], "emoji symbol heart star arrow copy paste utf-8 meta charset",
  "Emojis and symbols are just characters, like letters. You do not need any special code: copy one, then paste it right into your text. The page needs <meta charset=\"utf-8\"> in the head so every browser shows them correctly.",
  [["<meta charset=\"utf-8\">", "In the head: lets the page show emojis and symbols"], ["★ ♥ © →", "Symbols you can paste: star, heart, copyright, arrow"]],
  "Paste the character itself. Do not type a description of it.",
  [E("Emojis in a heading and a paragraph", `<head>
  <meta charset="utf-8">
</head>
<body>
  <h1>Pizza Night 🍕</h1>
  <p>Rate it: ★★★★☆</p>
</body>`, [["<meta charset=\"utf-8\">", "needed so emojis show up"], ["<body>", "paste emojis in the body text"]]),
   E("Symbols in a footer", `<p>© 2026 Sam Houston High ♥ → Go Hawks!</p>`, [["<p>", "symbols are pasted as normal text"]])])
  ];
  root.CHEAT = D;
})(window);
