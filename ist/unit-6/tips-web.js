/* Help topics for the Web Editor (Unit 3: HTML). One place for students to learn and get unstuck.
   Each topic: id, category, title, sections. A section is one of:
     { p: "text" }   { ex: ["code line", ...] }   { steps: ["...", ...] }   { list: ["...", ...] }   { good: "tip" }   { warn: "watch out" }   { rows: [["a","b","c"], ...] }
   Text supports `code` and **bold**.
   RULES at the bottom connect assignment step text to topics: the first match words in a bullet decide which help buttons show under it. */
(function (root) {
  "use strict";
  var T = root.U7_TIPS = { topics: {}, order: [], cats: [] };
  function cat(name) { T.cats.push(name); return name; }
  function add(id, c, title, sections) { T.topics[id] = { id: id, cat: c, title: title, sections: sections }; T.order.push(id); }

  var SKEL = cat("The skeleton of a page");
  add("doctype", SKEL, "What is the doctype line?", [
    { p: "The doctype line is the very first thing on a web page. It tells the browser, \"this is a modern web page.\" Without it, browsers guess, and your page can look different." },
    { ex: ["<!DOCTYPE html>"] },
    { list: ["It is written exactly like that: `<!DOCTYPE html>`.", "It does not have a closing tag.", "It is the first line of the page. Nothing goes above it."] },
    { good: "Type it from memory. The more you type it, the faster it gets." }
  ]);
  add("tagpair", SKEL, "What are opening and closing tags?", [
    { p: "Most tags come in a **pair**. The opening tag starts something, and the closing tag ends it. The closing tag looks the same but has a **slash** in front of the name." },
    { ex: ["<p>This is a paragraph.</p>", "<h2>This is a heading.</h2>"] },
    { rows: [["<p>", "opening tag", "starts the paragraph"], ["</p>", "closing tag", "ends the paragraph"], ["text in between", "the content", "what shows on the page"]] },
    { good: "In this editor, when you type the opening tag and its `>`, the editor adds the closing tag for you. Click between the two tags to type the content." },
    { warn: "Every opening tag needs its closing tag, or the page can break. Open **Checks** and look at **Problems** if something looks wrong." }
  ]);
  add("htmltag", SKEL, "What do the html tags do?", [
    { p: "The `html` tags wrap the **whole page**. Everything on the page (the head and the body) goes **inside** them." },
    { ex: ["<html>", "  ... the head and the body go here ...", "</html>"] },
    { list: ["Open it with `<html>` (right after the doctype).", "Close it with `</html>`, the very last line of the page.", "Only the doctype sits outside it."] }
  ]);
  add("headtag", SKEL, "What goes inside the head?", [
    { p: "The `head` holds information **about** the page. Most of it is not shown on the page itself." },
    { ex: ["<head>", "  <title>My Page</title>", "</head>"] },
    { list: ["The `head` goes **inside** the html tags.", "It goes **above** the body.", "The title lives in the head. Later lessons also put a style block here."] },
    { warn: "Headings and paragraphs do **not** go in the head. They belong in the body." }
  ]);
  add("bodytag", SKEL, "What goes inside the body?", [
    { p: "The `body` holds everything people **see** on your page: headings, paragraphs, lists, links, and pictures." },
    { ex: ["<body>", "  <h1>My Heading</h1>", "  <p>My first paragraph.</p>", "</body>"] },
    { list: ["The `body` goes **inside** the html tags.", "It goes **under** (after) the head tags, never above them.", "In some lessons you also style the body, like giving the whole page a background color."] }
  ]);
  add("skeleton", SKEL, "How do I lay out the skeleton?", [
    { p: "Every page uses the same layout. Think of it as a box with a head on top and a body underneath." },
    { ex: ["<!DOCTYPE html>", "<html>", "  <head>", "    <title>Page name</title>", "  </head>", "  <body>", "    ... what people see ...", "  </body>", "</html>"] },
    { good: "Pressing **Tab** indents by 2 spaces. Indent anything that sits inside another tag so you can see how things are nested." }
  ]);
  add("titletag", SKEL, "What does the title tag do?", [
    { p: "The `title` is the name of your page. It shows on the **browser tab**, not on the page itself." },
    { ex: ["<head>", "  <title>Octopus Facts</title>", "</head>"] },
    { list: ["It goes **inside the head**.", "Put real words in it (your topic or page name).", "It is different from the heading 1, which shows on the page."] }
  ]);
  add("comment", SKEL, "How do I write a comment?", [
    { p: "A comment is a note to people reading your code. The browser **ignores** it, so it never shows on the page." },
    { ex: ["<!-- This is where my menu starts -->"] },
    { list: ["It starts with `<!--` and ends with `-->`.", "Type `<!--` and the editor adds the ending for you and puts your cursor in the middle.", "Use comments to label parts of your page, like a menu or a section."] },
    { good: "Comments help you find your place when your page gets long." }
  ]);
  add("autoclose", SKEL, "Why did the editor type a closing tag for me?", [
    { p: "To save you time, the editor finishes your tags. When you type an opening tag and its `>`, the closing tag appears right after it with your cursor in the middle." },
    { ex: ["type:   <p>", "you get: <p></p>   (cursor between them)"] },
    { list: ["Tags with no closing tag (like `<br>` and `<hr>`) are left alone.", "Typing `<!--` also finishes the comment.", "Press **Enter** between the tags to put the content on its own line."] },
    { warn: "Don't type the closing tag again. Check that there is only one." }
  ]);

  var TXT = cat("Headings and text");
  add("headings", TXT, "How do headings work?", [
    { p: "Headings are titles for sections. There are six sizes, from `h1` (biggest, most important) down to `h6`." },
    { rows: [["<h1>", "heading 1", "the page's main title"], ["<h2>", "heading 2", "a section title"], ["<h3>", "heading 3", "a smaller title inside a section"]] },
    { ex: ["<h1>Octopuses</h1>", "<h2>How They Live</h2>"] },
    { good: "Think of an outline: one big title, then sections, then smaller parts of sections." }
  ]);
  add("h1one", TXT, "Why only one heading 1?", [
    { p: "The heading 1 is the main title of the whole page, like the title on the cover of a book. A page has **one**, and it goes inside the body." },
    { list: ["Use it for your topic's name.", "Use heading 2 for the sections under it."] }
  ]);
  add("h3under", TXT, "Can I skip heading levels?", [
    { ex: ["<h1>My Topic</h1>", "<h2>A Section</h2>", "<h3>A smaller part of that section</h3>"] },
    { warn: "Don't pick a heading just because it looks bigger or smaller. Pick it for where it fits. Later you can change how it looks with styles." }
  ]);
  add("paragraphs", TXT, "How do I make paragraphs?", [
    { p: "A paragraph is a block of text. Use the `p` tags, and put each paragraph in its **own** pair of tags." },
    { ex: ["<p>This is my first paragraph.</p>", "<p>This is my second paragraph.</p>"] },
    { list: ["Pressing Enter in your code does **not** start a new paragraph on the page. Only a new `<p>` does.", "Paragraphs go in the body, usually **under** a heading.", "Never put a paragraph inside a heading."] }
  ]);
  add("writing", TXT, "How do I write enough, in my own words?", [
    { p: "Some assignments need a lot of real writing. The checker counts real words, not tags or nonsense." },
    { steps: ["Pick a topic you can find good information about.", "Read about one section, then close the page.", "Write what you remember in your own words, in whole sentences.", "Check your word count at the top of the editor."] },
    { good: "Aim for sentences with about 25 words or more. Explain, give an example, then add one more fact." },
    { warn: "Typing the same words again and again, or random letters, is flagged by the checker. Copying from other places is blocked in this editor." }
  ]);
  add("sources", TXT, "How do I list sources?", [
    { p: "A source is where you learned your facts. Your last paragraph lists at least **2**." },
    { ex: ["<p>Sources: National Geographic (nationalgeographic.com) and the Britannica Kids encyclopedia (kids.britannica.com).</p>"] },
    { list: ["Write the name of the book, encyclopedia, or website.", "A web address (like `site.com`) counts too.", "Two sources, separated by commas or the word and."] }
  ]);

  var STY = cat("Styling with the style attribute");
  add("styleattr", STY, "How do I write a style attribute?", [
    { p: "A style changes how a tag looks. You put it **inside the opening tag**, after the tag name." },
    { ex: ["<p style=\"color: red;\">Red text</p>"] },
    { rows: [["style=", "the word style and an equals sign", "starts the style"], ["\" \"", "quotes around everything", "the styles go inside the quotes"], ["color: red;", "property: value;", "what to change, and how"]] },
    { good: "The editor adds the second quote for you when you type the first." },
    { warn: "Styles go in the **opening** tag only, never in the closing tag." }
  ]);
  add("stylemulti", STY, "How do I write more than one style?", [
    { p: "Put them all inside the same pair of quotes. Each one ends with a semicolon." },
    { ex: ["<h1 style=\"color: gold; font-size: 40px; text-align: center;\">Title</h1>"] },
    { warn: "Don't write a second `style=` on the same tag. One style attribute holds all of them." }
  ]);
  add("semicolon", STY, "Why the semicolon after every style?", [
    { p: "The semicolon tells the browser where one style ends and the next begins. Leave it out and the next style may not work." },
    { ex: ["color: navy;", "font-size: 24px;"] }
  ]);
  add("namedcolor", STY, "What is a named color?", [
    { p: "CSS knows over 100 color names. Use the name as the value." },
    { ex: ["color: tomato;", "background-color: navy;"] },
    { list: ["Examples: red, gold, navy, tomato, teal, orchid, coral, crimson, indigo, wheat, black, white.", "No quotes and no # sign for a named color."] },
    { warn: "Misspelled colors do nothing. Check the spelling if nothing changes." }
  ]);
  add("color", STY, "color and background-color: what's the difference?", [
    { rows: [["color", "the color of the **text**", "color: gold;"], ["background-color", "the color **behind** the text", "background-color: navy;"]] },
    { good: "Dark background? Use light text. Light background? Use dark text. If you can't read it, change one of them." }
  ]);
  add("fontsize", STY, "How do I set font-size?", [
    { p: "`font-size` changes how big the text is. In these lessons you measure it in **pixels**, written with `px` right after the number." },
    { ex: ["font-size: 24px;"] },
    { warn: "No space between the number and `px`: `24px`, not `24 px`. And a number alone does nothing." }
  ]);
  add("textalign", STY, "How do I center text?", [
    { p: "`text-align` puts the text on the left, center, or right of its space." },
    { ex: ["text-align: center;"] },
    { rows: [["left", "default", "text-align: left;"], ["center", "in the middle", "text-align: center;"], ["right", "on the right", "text-align: right;"]] }
  ]);
  add("texttransform", STY, "What does text-transform do?", [
    { p: "`text-transform` changes the letters without you retyping them." },
    { rows: [["uppercase", "ALL CAPITALS", "text-transform: uppercase;"], ["lowercase", "all small letters", "text-transform: lowercase;"], ["capitalize", "First Letter Of Each Word", "text-transform: capitalize;"]] }
  ]);
  add("bodystyle", STY, "How do I style the whole page (the body)?", [
    { p: "Put a style on the opening `body` tag. A background-color there colors the whole page." },
    { ex: ["<body style=\"background-color: black;\">"] },
    { good: "Text color on the body is inherited by everything inside it, unless a tag has its own color." }
  ]);

  var ED = cat("Editing tags");
  add("fontfamily", ED, "How do I change the font?", [
    { p: "`font-family` picks the style of the letters. Give one font name, then a back-up group." },
    { rows: [["serif", "letters with little feet, like a book", "font-family: Georgia, serif;"], ["sans-serif", "clean letters with no feet", "font-family: Verdana, sans-serif;"], ["monospace", "every letter the same width, like code", "font-family: 'Courier New', monospace;"]] },
    { warn: "Font names with spaces (like Courier New) go in single quotes inside the style." }
  ]);
  add("boldital", ED, "How do I make words bold or italic?", [
    { p: "Wrap just the words you want in `strong` (bold) or `em` (italic)." },
    { ex: ["<p>This is <strong>important</strong> and this is <em>slanted</em>.</p>"] },
    { good: "`<b>` and `<i>` also work, but `strong` and `em` are the ones to learn." },
    { warn: "These tags go **inside** the paragraph or list item, around only those words." }
  ]);
  add("brtag", ED, "How do I start a new line (br)?", [
    { p: "`<br>` is a **line break**. It moves the text after it to the next line, **inside the same paragraph**." },
    { ex: ["<p>123 Main Street<br>Open 9 to 5</p>"] },
    { list: ["It has no closing tag.", "Put it **inside** the paragraph, between the two lines."] }
  ]);
  add("hrtag", ED, "How do I draw a horizontal line (hr)?", [
    { p: "`<hr>` draws a line across the page to separate sections." },
    { ex: ["<p>First section</p>", "<hr>", "<h2>Next section</h2>"] },
    { list: ["It has no closing tag.", "Put it **between** things, outside paragraphs."] }
  ]);
  add("spantag", ED, "How do I color just a few words (span)?", [
    { p: "`span` wraps a few words so you can style only those words. It does nothing by itself, so give it a style." },
    { ex: ["<p>Today is <span style=\"color: red;\">hot</span> outside.</p>"] },
    { list: ["Put the span **inside** the paragraph.", "The style goes in the opening span tag.", "Close it right after the words you want colored."] }
  ]);
  add("nesting", ED, "What does \"inside\" mean? (nesting)", [
    { p: "Tags can sit **inside** other tags, like boxes inside boxes. The inner tag must close **before** the outer one does." },
    { ex: ["<p>I like <strong>pizza</strong>.</p>", "  ^ the strong opens and closes inside the p"] },
    { warn: "Don't cross them: `<p><strong>text</p></strong>` is wrong. The strong has to close first." },
    { good: "Indent inner tags so you can see the boxes." }
  ]);

  var BRD = cat("Borders");
  add("border", BRD, "How do I write a border?", [
    { p: "A border is a line around a tag. Write three things, in this order: **thickness, style, color**." },
    { ex: ["border: 4px solid gold;"] },
    { rows: [["4px", "thickness", "in pixels"], ["solid", "style", "solid, dashed, or dotted"], ["gold", "color", "a named color"]] }
  ]);
  add("borderstyle", BRD, "solid, dashed, or dotted?", [
    { rows: [["solid", "one unbroken line", "border: 3px solid navy;"], ["dashed", "short lines", "border: 3px dashed navy;"], ["dotted", "a row of dots", "border: 3px dotted navy;"]] }
  ]);
  add("borderside", BRD, "How do I put a border on just one side?", [
    { p: "Use `border-top`, `border-bottom`, `border-left`, or `border-right`. They are written the same as a full border." },
    { ex: ["border-bottom: 4px solid gold;"] },
    { warn: "If the step says \"bottom only\", don't also add a full `border`, or all four sides get a line." }
  ]);

  var LST = cat("Lists");
  add("ul", LST, "How do I make a bullet list?", [
    { p: "A bullet list uses `ul` (unordered list). Each item is an `li` (list item) inside it." },
    { ex: ["<ul>", "  <li>First item</li>", "  <li>Second item</li>", "  <li>Third item</li>", "</ul>"] },
    { warn: "Only `li` tags go directly inside `ul`. Put your words inside the `li`." }
  ]);
  add("ol", LST, "How do I make a numbered list?", [
    { p: "A numbered list uses `ol` (ordered list). The items are `li` tags, just like a bullet list." },
    { ex: ["<ol>", "  <li>Step one</li>", "  <li>Step two</li>", "</ol>"] }
  ]);
  add("liststyle", LST, "How do I change the bullets or numbers?", [
    { p: "Use `list-style-type` on the `ul` or `ol` tag." },
    { rows: [["none", "no bullets (good for menus)", "list-style-type: none;"], ["square", "square bullets", "list-style-type: square;"], ["circle", "open circles", "list-style-type: circle;"], ["decimal", "1, 2, 3", "list-style-type: decimal;"], ["upper-roman", "I, II, III", "list-style-type: upper-roman;"]] }
  ]);
  add("menubar", LST, "How do I turn a list into a menu row?", [
    { p: "List items stack in a column. To put them in a **row**, set each `li` to `display: inline`." },
    { ex: ["<li style=\"display: inline; color: white;\">Home</li>"] },
    { list: ["The style goes on **each** list item, not on the `ul`.", "Remove the bullets by putting `list-style-type: none;` on the `ul`."] }
  ]);
  add("listitems", LST, "What goes inside a list item?", [
    { p: "Anything you can put in a paragraph: plain words, bold and italic words, spans, even links." },
    { ex: ["<li><strong>Octopus</strong> - <em>a very smart animal</em></li>"] },
    { good: "Keep the bold and italic tags inside the `li`, not around it." }
  ]);

  var LNK = cat("Links");
  add("atag", LNK, "How do I make a link?", [
    { p: "A link uses the `a` tag (anchor). The words between the tags are what people click." },
    { ex: ["<a href=\"https://www.nasa.gov\">NASA</a>"] }
  ]);
  add("href", LNK, "What is the href?", [
    { p: "`href` is the web address the link goes to. It goes inside the opening `a` tag, in quotes." },
    { list: ["Start it with `https://`.", "Use a real site, and copy its address exactly."] },
    { warn: "A link with no href is not a link." }
  ]);
  add("newtab", LNK, "How do I open a link in a new tab?", [
    { p: "Add `target=\"_blank\"` to the opening `a` tag. Leave it off and the link opens in the **same tab**." },
    { ex: ["<a href=\"https://www.nasa.gov\" target=\"_blank\">NASA</a>"] }
  ]);
  add("linktext", LNK, "What should the link text say?", [
    { p: "Say where it goes. Never use \"click here.\"" },
    { rows: [["NASA's website", "good", "tells you where it goes"], ["click here", "not good", "tells you nothing"]] },
    { good: "To make the name bold, put the `strong` tags **inside** the link." }
  ]);
  add("linkanything", LNK, "How do I make anything a link?", [
    { p: "Anything between the opening and closing `a` tags becomes the link: a whole heading, a whole paragraph, or just a few bold or italic words." },
    { ex: ["<a href=\"https://www.nasa.gov\"><h3>Visit NASA</h3></a>", "<p>Read <a href=\"https://www.nasa.gov\"><strong>the mission news</strong></a> today.</p>"] },
    { warn: "Keep the tags nested in order: if the `strong` opens inside the `a`, it must close before the `a` does." }
  ]);
  add("styleblock", LNK, "What is a style block?", [
    { p: "A style block holds styles for many tags in one place. It goes in the **head**, under the title." },
    { ex: ["<style>", "  h1 {", "    color: white;", "    font-size: 38px;", "  }", "</style>"] },
    { list: ["Inside it there are **no quotes** and you do **not** write the word `style=`.", "Each rule is a tag name, then curly braces `{ }`, then styles ending in semicolons."] }
  ]);
  add("linkstates", LNK, "What are a:link, a:visited, a:hover, and a:active?", [
    { p: "A link can look different depending on what is happening. Each one is a rule in your style block." },
    { rows: [["a:link", "an unclicked link", "color: blue;"], ["a:visited", "a link you already clicked", "color: purple;"], ["a:hover", "the mouse is on it", "color: red; background-color: yellow;"], ["a:active", "while it is being clicked", "color: orange;"]] },
    { warn: "Write them in this order: link, visited, hover, active." }
  ]);
  add("selectors", LNK, "How do I write a rule for a tag (like h1 or body)?", [
    { p: "A rule starts with the tag's name. It styles **every** tag of that kind on the page." },
    { ex: ["body {", "  background-color: lightyellow;", "  font-family: Verdana, sans-serif;", "}"] },
    { good: "This is why the h1 and h2 in your page change without a style attribute: the style block already styles them." }
  ]);

  var IMG = cat("Pictures");
  add("images", IMG, "How do I add a picture?", [
    { steps: ["Click **Checks**, then find **My images**.", "Upload your picture file (JPG or PNG) and wait for it to show in the list.", "Click inside the paragraph where it goes.", "Click **Insert** next to your picture."] },
    { good: "The editor writes the picture tag for you, already wrapped in a link. You edit the link's address and the alt text." }
  ]);
  add("imgsize", IMG, "How do I change a picture's size?", [
    { p: "Use `width` in the picture's style. A picture keeps its shape when you only set the width." },
    { rows: [["320px", "an exact size in pixels", "width: 320px;"], ["25%", "a share of the space it sits in", "width: 25%;"]] }
  ]);
  add("imgalt", IMG, "What is alt text?", [
    { p: "`alt` describes the picture in words, for people who can't see it and for when it doesn't load." },
    { ex: ["<img src=\"...\" alt=\"A red octopus resting on a coral reef\">"] },
    { warn: "Write a real description, not just a word like \"picture\"." }
  ]);
  add("imglink", IMG, "How do I make a picture a link?", [
    { p: "Wrap the picture in an `a` tag. Clicking the picture goes to the link." },
    { ex: ["<a href=\"https://example.com\"><img src=\"...\" alt=\"...\"></a>"] },
    { list: ["Change the `href` to a real website.", "Add `target=\"_blank\"` to open it in a new tab."] }
  ]);
  add("radius", IMG, "How do I round a picture's corners?", [
    { p: "`border-radius` rounds the corners. A big percent makes a circle." },
    { rows: [["12px", "slightly rounded", "border-radius: 12px;"], ["50%", "a circle or oval", "border-radius: 50%;"]] }
  ]);
  add("displayblock", IMG, "What does display: block do?", [
    { p: "A picture sits in a line with the text by default. `display: block` puts it on its own line instead." },
    { ex: ["display: block;"] }
  ]);

  var EDT = cat("Using this editor");
  add("autocheck", EDT, "How does the auto-check work?", [
    { p: "Every step has boxes. Next to each box is a badge such as **auto-check: 3 of 5 met**. It looks at your page and counts what is already done." },
    { list: ["**Click the badge** to see what is still missing.", "The **N still missing** button at the top lists everything left, with a **Go to box** button.", "You check off a box yourself. The badge only reports what your page shows."] },
    { good: "Read the missing list, fix one thing, and watch the badge change." }
  ]);
  add("score", EDT, "How does the score and Submit work?", [
    { p: "The **Auto score** at the top is out of 100. Each box counts the same, and each box is worth the share of its checks that are met." },
    { list: ["You need **95** to submit.", "100 means every check is met.", "Choose your class period, then click **Submit**. You can submit again later to replace it."] }
  ]);
  add("pastecopy", EDT, "Why can't I paste some things?", [
    { p: "You can copy and paste **your own code** from this page, like a paragraph you want to repeat. Anything from the notes, another website, or another document is blocked, so you type it yourself." },
    { good: "Typing your own code is how you learn it. Use the help buttons if you forget how a tag works." }
  ]);
  add("undo", EDT, "How do I undo?", [
    { p: "Press **Ctrl + Z** to undo and **Ctrl + Y** (or Ctrl + Shift + Z) to redo. They work after the editor adds tags and indents for you." }
  ]);
  add("checkspanel", EDT, "What is the Checks panel?", [
    { p: "**Checks** shows a list of rules for your lesson: green means done, red means to fix." },
    { list: ["**Problems** lists tags that were not closed or are in the wrong place. Click one to jump to that line.", "**Use what you already know** needs each older skill used again on this page.", "**My images** is where you upload pictures."] }
  ]);
  add("preview", EDT, "Why doesn't my page change?", [
    { list: ["Click **Refresh** above the preview.", "Check the **Problems** list for a tag that was not closed.", "Check spelling inside styles: `color`, not `colour`.", "Make sure every style ends in a semicolon.", "Make sure you typed inside the right tags, such as the body."] }
  ]);
  add("stuck", EDT, "I'm stuck. What do I do?", [
    { steps: ["Click the **auto-check badge** to see exactly what is missing.", "Click the help buttons under that step.", "Open **See an example** to see a finished page (your topic and words will be different).", "Open **Concepts** to see what this lesson teaches.", "Read the notes: link at the top of the assignment.", "Still stuck? Ask your teacher."] }
  ]);

  /* ---------- which help shows under which step text (first words that match decide; most specific first) ---------- */
  var R = [
    [/whole heading|whole paragraph|inside a link|inside the a tag|wraps|around the h3/i, ["linkanything", "atag"]],
    [/doctype/i, ["doctype"]],
    [/body tags/i, ["bodytag", "skeleton"]],
    [/add the head|head tags first/i, ["headtag", "skeleton"]],
    [/open the html|html container/i, ["htmltag", "tagpair"]],
    [/\bhead\b.*(first|tags)|add the head/i, ["headtag", "skeleton"]],
    [/\bbody\b.*(tags|under)|under the head/i, ["bodytag", "skeleton"]],
    [/\btitle\b/i, ["titletag"]],
    [/heading 1/i, ["headings", "h1one"]],
    [/heading 2|heading 3/i, ["headings", "h3under"]],
    [/paragraph/i, ["paragraphs"]],
    [/250 words|300 words|words in all|25 words/i, ["writing"]],
    [/sources/i, ["sources"]],
    [/a:link|a:hover|link rules/i, ["linkstates", "styleblock"]],
    [/style block/i, ["styleblock", "selectors"]],
    [/rule for|the h1 rule|h2 rule|body rule/i, ["selectors"]],
    [/new tab|_blank/i, ["newtab", "atag"]],
    [/same tab/i, ["atag", "href"]],
    [/\blink\b/i, ["atag", "href", "linktext"]],
    [/picture|image|upload|alt/i, ["images", "imgalt"]],
    [/border-radius|radius/i, ["radius"]],
    [/display.*block|block/i, ["displayblock"]],
    [/\bwidth\b/i, ["imgsize"]],
    [/bottom only|top only|left only|right only|only\)/i, ["borderside"]],
    [/border/i, ["border", "borderstyle"]],
    [/list-style-type|bullet list|numbered list/i, ["ul", "ol", "liststyle"]],
    [/list item|inline/i, ["menubar", "listitems"]],
    [/font-family|serif|monospace/i, ["fontfamily"]],
    [/bold|italic/i, ["boldital"]],
    [/line break|\bbr\b/i, ["brtag"]],
    [/horizontal line/i, ["hrtag"]],
    [/\bspan\b/i, ["spantag", "nesting"]],
    [/text-transform|uppercase/i, ["texttransform"]],
    [/text-align|center/i, ["textalign"]],
    [/font-size|px\b|pixels/i, ["fontsize"]],
    [/background-color/i, ["color", "namedcolor"]],
    [/\bcolor\b/i, ["color", "namedcolor"]],
    [/style/i, ["styleattr", "stylemulti"]],
    [/checks|red line|problems/i, ["checkspanel", "preview"]],
    [/submit/i, ["score"]]
  ];
  /* the topics for one piece of step text (at most 3) */
  T.forText = function (text) {
    var t = String(text || "").replace(/[*`]/g, ""), out = [];
    R.forEach(function (r) { if (r[0].test(t)) r[1].forEach(function (id) { if (out.indexOf(id) < 0 && T.topics[id]) out.push(id); }); });
    return out.slice(0, 3);
  };
  /* the rules above only see wording; every bullet that sets a style should also be able to open the style help */
  T.always = ["autocheck", "stuck"];
})(typeof window !== "undefined" ? window : globalThis);
