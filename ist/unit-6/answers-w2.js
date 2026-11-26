/* Steps text for the Unit 3 Part 2 WALKTHROUGHS ("7.1w" ...) and ASSIGNMENTS ("7.1a" ...): 3.12 Box Model, 3.13 Colors, 3.14 Display, 3.15 Div, 3.16 Tables (see lab-lessons.js).
   The bullets line up one-to-one with the check lists in step-checks-w2.js. Walkthrough = training voice with the exact code; assignment = a company brief with no code shown. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
  function build(list) { var out = [], n = 0; list.forEach(function (it) { if (it.step) { n++; out.push({ h: "Step " + n + ": " + it.step }); (it.pre || []).forEach(function (x) { out.push(x); }); out.push({ build: it.build }); (it.post || []).forEach(function (x) { out.push(x); }); } else out.push(it); }); return out; }
  function S(title, bullets, pre, post) { return { step: title, build: bullets, pre: pre, post: post }; }
  var CODE = function (t) { return { code: t }; }, P = function (t) { return { p: t }; };
  var TYPEIT2 = "**Type it yourself, exactly as shown.** Typing the tags is how you learn them, even where pasting is allowed.";
  var SKEL3 = function (title) { return S("Skeleton and title", ["Type the doctype as the very first line, then the html tags", "Inside the html tags, add the head tags with a **title** that says exactly **" + title + "**", "Under the head, still inside the html tags, add the body tags"]); };
  var DONE = S("Check and submit", ["Look at the line numbers on the left of your code. **No line number should be red**: a red number means a problem on that line, like a tag that is not closed or is misspelled", "Choose your class period at the top, then click **Submit**"]);
  var DONE2 = S("Check and submit", ["Fix every **red line number** in your code (a red number means a problem on that line)", "Choose your class period at the top, then click **Submit**"]);
  var SKEL1 = function (title, what) { return ["From memory, type the skeleton with a title that says **" + title + "**, and the body tags", what]; };

  /* ===================== 3.12 Walkthrough ===================== */
  A["7.1w"] = build([
    { h: "What you are building" },
    P("**Postcard Studio** wants a page of postcards. Every box on a web page is built from four layers: the **content**, the **padding** inside the border, the **border**, and the **margin** outside it. You will use all four. " + TYPEIT2),
    { map: ["Set up the page", "Padding: space inside the box", "Margin: space outside the box", "One side at a time", "A border adds size", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-7/box-model-notes.html"),
    S("Set up the page", SKEL1("Postcard Studio", "Inside the body type a heading 1 that says **Postcard Studio** and **four paragraphs**: **Greetings from Hawaii!** / **Wish you were here.** / **See you soon!** / **Box total: 230 pixels wide.**"),
      [CODE("<h1>Postcard Studio</h1>\n<p>Greetings from Hawaii!</p>\n<p>Wish you were here.</p>\n<p>See you soon!</p>\n<p>Box total: 230 pixels wide.</p>")]),
    S("Padding: space inside the box", ["Give **paragraph 1** the style `padding: 20px; background-color: lightyellow`"],
      [P("**Padding** is the space **inside** the box, between the content and the border. It takes on the element's own background color. `padding: 20px` puts 20 pixels on **all four sides** (top, right, bottom and left)."), CODE("<p style=\"padding: 20px; background-color: lightyellow\">Greetings from Hawaii!</p>")],
      [P("**Try it:** the yellow fills the space all around the words. Change 20px to 50px and watch the yellow box grow, then put it back.")]),
    S("Margin: space outside the box", ["Give **paragraph 2** the style `margin: 30px; background-color: lightpink`"],
      [P("**Margin** is the space **outside** the box, between this box and the next one. Margin is always **see-through**: it can never take a background color."), CODE("<p style=\"margin: 30px; background-color: lightpink\">Wish you were here.</p>")],
      [P("**Try it:** the pink color covers only the words, not the 30px of empty space around them. Padding takes the color; margin never does.")]),
    S("One side at a time", ["Give **paragraph 3** the style `border: 4px solid navy; padding-left: 40px; padding-top: 10px`"],
      [P("You can set one side at a time with `padding-top`, `padding-right`, `padding-bottom` and `padding-left` (margin works the same way). A shortcut with **two values**, like `padding: 10px 30px`, means top and bottom first, then left and right."), CODE("<p style=\"border: 4px solid navy; padding-left: 40px; padding-top: 10px\">See you soon!</p>")],
      [P("**Try it:** the words sit 40px from the left of the border and 10px from the top, but touch the other sides.")]),
    S("A border adds size", ["Give **paragraph 4** the style `width: 200px; padding: 10px; border: 5px solid black`"],
      [P("A border is not free: it takes up **real space**, just like padding. The `width` is only the **content**. The box is wider than that: 200px content + 10px padding on each side + 5px border on each side = **230px** in all."), CODE("<p style=\"width: 200px; padding: 10px; border: 5px solid black\">Box total: 230 pixels wide.</p>")],
      [P("**Try it:** the black box is 230 pixels wide on the page, even though you wrote `width: 200px`.")]),
    DONE
  ]);
  /* ===================== 3.12 Assignment ===================== */
  A["7.1a"] = build([
    { h: "What you are building" },
    P("**Etsy** wants a page of shop cards. Each card is a box that uses the box model. Write your own shop items. Watch the **Auto score** at the top to see how you are doing."),
    { map: ["The skeleton and a title", "The words on the page", "Box model", "Check and submit"] },
    SKEL3("Etsy Shop Cards"),
    S("The words on the page", ["Inside the body, add a **heading 1** that says exactly **Etsy Shop Cards** and **at least 3 paragraphs** (the cards), each with at least 3 words, like an item and its price"]),
    S("Box model", ["Give **every card** at least **10px of padding**", "Give **every card** a margin of at least **10px**", "Give **every card** a border on all four sides (thickness, style, named color) and its own background-color", "Give **one card** two-value padding (like `padding: 10px 30px`) and **one card** padding on a single side (like `padding-left`)", "Give **one card** a fixed width from **150px to 400px**", "Use what you know: **center** the heading 1 and give the **body** a background color"]),
    DONE2
  ]);

  /* ===================== 3.13 Walkthrough ===================== */
  A["7.2w"] = build([
    { h: "What you are building" },
    P("**Brand Colors** is a page that shows the same idea two ways: a color by **name**, and a color by **hex code**. A hex code is a `#` followed by 6 characters, in three pairs: red, green and blue. " + TYPEIT2),
    { map: ["Set up the page", "A named color", "The same color as a hex code", "Pure red, green and blue", "The page background", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-7/colors-notes.html"),
    S("Set up the page", SKEL1("Brand Colors", "Inside the body type a heading 1 that says **Brand Colors** and **five paragraphs**: **Tomato red** / **Navy blue** / **Pure red** / **Pure green** / **Pure blue**"),
      [CODE("<h1>Brand Colors</h1>\n<p>Tomato red</p>\n<p>Navy blue</p>\n<p>Pure red</p>\n<p>Pure green</p>\n<p>Pure blue</p>")]),
    S("A named color", ["Give **paragraph 1** the style `color: tomato`"], [P("HTML has **more than 140 built-in color names**, like `tomato`, `navy` and `gold`. You type the name directly: no quotes, no `#`."), CODE("<p style=\"color: tomato\">Tomato red</p>")]),
    S("The same color as a hex code", ["Give **paragraph 2** the style `color: #000080`"], [P("A **hex code** names a color with numbers instead of a word. It is a `#` and then **6 characters** (0 to 9 and A to F). `#000080` is exactly the same color as the name `navy`."), CODE("<p style=\"color: #000080\">Navy blue</p>")],
      [P("**Try it:** change `#000080` to `navy` and the color does not change at all. Same color, two ways to write it.")]),
    S("Pure red, green and blue", ["Give **paragraph 3** the style `color: #FF0000; background-color: #000000`", "Give **paragraph 4** the style `color: #00FF00; background-color: #000000`", "Give **paragraph 5** the style `color: #0000FF; background-color: #000000`"],
      [P("Read a hex code as **three pairs**: red, green, blue. Each pair runs from `00` (none of that color) to `FF` (the most). `#FF0000` is all red and no green or blue: **pure red**. `#00FF00` is pure green, `#0000FF` is pure blue, `#FFFFFF` is white (the most of all three) and `#000000` is black (none of any)."), CODE("<p style=\"color: #FF0000; background-color: #000000\">Pure red</p>")]),
    S("The page background", ["Give the **body** the style `background-color: #F0F9FF` (a very light blue)"], [P("Hex codes work anywhere a color works, including the background of the whole page. A hex code with all pairs close to `FF`, like `#F0F9FF`, is a very light color."), CODE("<body style=\"background-color: #F0F9FF\">")]),
    DONE
  ]);
  /* ===================== 3.13 Assignment ===================== */
  A["7.2a"] = build([
    { h: "What you are building" },
    P("**Duolingo** wants a brand page that shows off its colors as hex codes. Pick your own greens, yellows and grays. Watch the **Auto score** at the top to see how you are doing."),
    { map: ["The skeleton and a title", "The words on the page", "Colors", "Check and submit"] },
    SKEL3("Duolingo Colors"),
    S("The words on the page", ["Inside the body, add a **heading 1** that says exactly **Duolingo Colors** and **at least 4 paragraphs** (each with at least 3 words) describing the colors"]),
    S("Colors", ["Give the **body** a **hex** background-color and a **hex** text color. The two must be different", "Give the **heading 1** a **hex** text color and a **different hex** background-color", "Give **at least 4 paragraphs** their own **hex** text color, and use **at least 3 different** hex colors across the paragraphs", "Give **at least 2 paragraphs** a **hex** background-color too (different from their text color)", "Use at least one **named** color (like tomato) somewhere, so you can compare it with the hex codes"]),
    DONE2
  ]);

  /* ===================== 3.14 Walkthrough ===================== */
  A["7.3w"] = build([
    { h: "What you are building" },
    P("A **Snack Bar** needs a menu bar. Every tag is born as **block** (it takes its own line) or **inline** (it stays in the line like a word). The `display` style lets you change that. " + TYPEIT2),
    { map: ["Set up the page", "Three divs stack", "Make the menu sit in a row", "A span stays in the line", "A link as a button", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-7/display-notes.html"),
    S("Set up the page", SKEL1("Snack Bar", "Inside the body type a heading 1 that says **Snack Bar**"), [CODE("<h1>Snack Bar</h1>")]),
    S("Three divs stack", ["Under the heading 1, type **three divs** with the words **Home**, **Menu** and **Contact**, one div each"],
      [P("A **div** is an invisible box. It is a **block** tag: it takes the whole width and starts on a new line, so three divs stack in a column. (The next lesson is all about the div.)"), CODE("<div>Home</div>\n<div>Menu</div>\n<div>Contact</div>")], [P("**Try it:** the three words stack in a tall column. A menu should sit in a row, so the next step fixes it.")]),
    S("Make the menu sit in a row", ["Give **div 1** the style `display: inline-block; padding: 10px; background-color: gold`", "Give **div 2** the same style: `display: inline-block; padding: 10px; background-color: gold`", "Give **div 3** the same style: `display: inline-block; padding: 10px; background-color: gold`"],
      [P("`display: inline-block` makes a box sit in the line like a word, but it can still have padding, a width and a height. This one style is the fix behind almost every horizontal menu on the internet. The three values of `display` you know are `block` (own line), `inline` (in the line, no width) and `inline-block` (in the line, with width)."), CODE("<div style=\"display: inline-block; padding: 10px; background-color: gold\">Home</div>")],
      [P("**Try it:** the three gold boxes now sit side by side. Remove `display: inline-block` from one and it drops to its own line again.")]),
    S("A span stays in the line", ["Add a **paragraph** that says **Our special today is soup.** and put the word **soup** inside a **span** with the style `color: red`"],
      [P("A **span** is naturally **inline**: it stays in the sentence, which is why it can color one word without breaking the line."), CODE("<p>Our special today is <span style=\"color: red\">soup</span>.</p>")]),
    S("A link as a button", ["Add a link to `https://www.nasa.gov` that opens in a new tab and says **Visit NASA**", "Give the link the style `display: block; padding: 10px; background-color: navy; color: white`"],
      [P("A link is naturally **inline** and only as big as its words. `display: block` turns it into a wide button that takes the whole width."), CODE("<a href=\"https://www.nasa.gov\" target=\"_blank\" style=\"display: block; padding: 10px; background-color: navy; color: white\">Visit NASA</a>")]),
    DONE
  ]);
  /* ===================== 3.14 Assignment ===================== */
  A["7.3a"] = build([
    { h: "What you are building" },
    P("**Instagram** wants a menu bar and a call-to-action button for its web page. Write your own menu words. Watch the **Auto score** at the top to see how you are doing."),
    { map: ["The skeleton and a title", "The words on the page", "Display", "Check and submit"] },
    SKEL3("Instagram Menu"),
    S("The words on the page", ["Inside the body, add a **heading 1** that says exactly **Instagram Menu** and **at least 4 divs** (the menu items, like Home, Search, Reels and Profile)", "Add a **paragraph** of at least 5 words with a **span** inside it, and a **link** to a real https:// address that opens in a new tab"]),
    S("Display", ["Make **every div** sit in a row with `display: inline-block`, with at least **8px of padding** and a background-color", "Give the **span** its own text color", "Turn the **link** into a button: `display: block`, at least 8px of padding, a background-color and a text color", "Use `display: inline` on **another** paragraph or span", "Use what you know: **center** the heading 1 and give the **body** a background color"]),
    DONE2
  ]);

  /* ===================== 3.15 Walkthrough ===================== */
  A["7.4w"] = build([
    { h: "What you are building" },
    P("A **Profile Page** is built from **divs**. A div is an invisible box: it does nothing on its own, but it **groups** other tags so you can style or arrange them as one unit. " + TYPEIT2),
    { map: ["Set up the page", "A div groups and styles", "An empty div needs a height", "Two columns", "A second row", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-7/div-tag-notes.html"),
    S("Set up the page", SKEL1("Profile Page", "Inside the body type a heading 1 that says **Profile Page**"), [CODE("<h1>Profile Page</h1>")]),
    S("A div groups and styles", ["Under the heading 1, type a **div** that holds a heading 2 that says **Sam Rivera** and a paragraph that says **Loves music and art.**", "Give the **div** the style `background-color: navy; color: white; padding: 14px`. Do not style the heading or paragraph"],
      [P("Put **one style on the div** and everything inside it inherits the look. You do not style the heading and the paragraph separately: both turn white because the div says `color: white`. The div's own background and padding belong to the whole box."), CODE("<div style=\"background-color: navy; color: white; padding: 14px\">\n<h2>Sam Rivera</h2>\n<p>Loves music and art.</p>\n</div>")]),
    S("An empty div needs a height", ["Right after that div, type an **empty div** (nothing inside it) with the style `height: 20px; background-color: orange`"],
      [P("A div's height is **elastic**: it stretches to fit what is inside. An **empty** div has nothing inside, so it collapses to 0 pixels tall and disappears. Give it an explicit `height` (and a color so you can see it) and it shows up as a bar."), CODE("<div style=\"height: 20px; background-color: orange\"></div>")]),
    S("Two columns", ["Add a **sidebar div** (the third div) with the style `display: inline-block; vertical-align: top; width: 30%`", "Inside it put a heading 3 that says **Interests** and a paragraph that says **Music and art.**", "Add a **feed div** right after it with the style `display: inline-block; vertical-align: top; width: 60%`", "Inside it put a heading 3 that says **Posts** and a paragraph that says **First post!**", "Check: the two widths add up to **98% or less** (30% + 60% = 90%)"],
      [P("Two divs stack by default. `display: inline-block` makes them sit side by side. **Width in percent** makes the columns resize with the screen. `vertical-align: top` locks both columns to the same top edge: without it, a column with more text drags the other one down. Keep the widths of a row at **98% or less**, or the last column drops to a new line."), CODE("<div style=\"display: inline-block; vertical-align: top; width: 30%\">\n<h3>Interests</h3>\n<p>Music and art.</p>\n</div>")]),
    S("A second row", ["Under the columns, add an **hr** tag", "Add a div that says **Photos** with the style `display: inline-block; vertical-align: top; width: 45%`", "Add a div that says **Friends** with the same style: `display: inline-block; vertical-align: top; width: 45%`", "Check: the page has exactly **6 divs** and **1 hr**"],
      [P("To start a **new row** of columns, add a block tag first (an `hr` works). Without one, the next divs can end up on the end of the first row instead of starting fresh. Then repeat the same pattern."), CODE("<hr>\n<div style=\"display: inline-block; vertical-align: top; width: 45%\">Photos</div>")]),
    DONE
  ]);
  /* ===================== 3.15 Assignment ===================== */
  A["7.4a"] = build([
    { h: "What you are building" },
    P("**Amazon** wants a products page laid out with divs: a banner, a color bar, and two rows of columns. Write your own product words. Watch the **Auto score** at the top to see how you are doing."),
    { map: ["The skeleton and a title", "The words on the page", "Layout with divs", "Check and submit"] },
    SKEL3("Amazon Products"),
    S("The words on the page", ["Inside the body, add a **heading 1** that says exactly **Amazon Products**", "Add a **banner div** that holds a **heading 2** and a **paragraph** inside it"]),
    S("Layout with divs", ["Style the banner div with a **background-color**, a **text color** and at least **10px of padding**. Do not style the heading and paragraph inside it", "Add an **empty div** with a **height in px** and a background-color (a color bar)", "Add **at least 4 column divs**: each with `display: inline-block`, `vertical-align: top`, a **width in % of 49% or less**, **padding** and a **border**", "Put an **hr** between the **first two columns** and the **second two columns**. Each row of two columns must add up to **98% or less**", "Use what you know: **center** the heading 1 and give the **body** a background color"]),
    DONE2
  ]);

  /* ===================== 3.16 Walkthrough ===================== */
  A["7.5w"] = build([
    { h: "What you are building" },
    P("A **Leaderboard** is a **table**: data that belongs in rows and columns. You do not build columns. You build one **row** at a time, top to bottom, and drop cells into each row. " + TYPEIT2),
    { map: ["Set up the page", "The table and its header row", "Three data rows", "Style the table", "Style the header cells", "Links in the cells", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-7/tables-notes.html"),
    S("Set up the page", SKEL1("Leaderboard", "Inside the body type a heading 1 that says **Leaderboard**"), [CODE("<h1>Leaderboard</h1>")]),
    S("The table and its header row", ["Under the heading 1, type a **table** with **one row** (`tr`) of **four header cells** (`th`): **Rank**, **Player**, **Points** and **Profile**"],
      [P("Four tags build a table, nested like dolls: `table` is the outer grid, `tr` is one row, `th` is a **header cell** (bold and centered by default) and `td` is a **data cell**. Only `tr` tags go directly inside the table, and only cells go directly inside a row."), CODE("<table>\n<tr>\n<th>Rank</th>\n<th>Player</th>\n<th>Points</th>\n<th>Profile</th>\n</tr>\n</table>")]),
    S("Three data rows", ["Add **3 more rows** of **data cells** (`td`). Every row must have exactly **4 cells**", "Row 2: **1**, **Ana**, **120**, **View**", "Row 3: **2**, **Bo**, **95**, **View**", "Row 4: **3**, **Cy**, **80**, **View**"],
      [P("The golden rule: **every row has the same number of cells**. If one row is missing a cell, the table's borders and columns break. (The **View** cells will become links in a later step.)"), CODE("<tr>\n<td>1</td>\n<td>Ana</td>\n<td>120</td>\n<td>View</td>\n</tr>")]),
    S("Style the table", ["Give the **table** the style `border: 3px solid navy; width: 80%; text-align: center`"], [P("Styles on the table work like any other tag. Width in percent makes it resize with the page, and `text-align: center` centers the text in every cell."), CODE("<table style=\"border: 3px solid navy; width: 80%; text-align: center\">")]),
    S("Style the header cells", ["Give **each of the four header cells** the style `background-color: #1B2A4A; color: white`"], [CODE("<th style=\"background-color: #1B2A4A; color: white\">Rank</th>")], [P("**Try it:** the first row turns into a dark navy title bar with white words.")]),
    S("Links in the cells", ["In **each data row**, make the word **View** in the last cell a link to `https://www.espn.com` that opens in a new tab"], [P("A cell can hold any other tag: links, pictures, even a whole list. Put the tag **inside** the `td`."), CODE("<td><a href=\"https://www.espn.com\" target=\"_blank\">View</a></td>")]),
    S("Check and submit", ["Look at the line numbers on the left of your code. **No line number should be red**: a red number means a problem on that line, like a tag that is not closed or is misspelled", "Choose your class period at the top, then click **Submit**"])
  ]);
  /* ===================== 3.16 Assignment ===================== */
  A["7.5a"] = build([
    { h: "What you are building" },
    P("**ESPN** wants a scoreboard built as a **table**. Pick a sport and write your own teams and scores. Watch the **Auto score** at the top to see how you are doing."),
    { map: ["The skeleton and a title", "The table", "Style the table", "Check and submit"] },
    SKEL3("ESPN Scoreboard"),
    S("The table", ["Inside the body, add a **heading 1** that says exactly **ESPN Scoreboard**, then a **table** whose first row has **at least 3 header cells** (`th`)", "Add **at least 4 data rows** of `td` cells. **Every row must have the same number of cells** as the header row, and every cell needs something in it"]),
    S("Style the table", ["Give **every header cell** a background-color and a **different** text color", "Give the **table** a border (thickness, style, named color), a **width in %**, and centered text", "Put a **link** (a real https:// address that opens in a new tab) in one cell and **bold words** (strong) in another", "Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"]),
    DONE2
  ]);
})(typeof window !== "undefined" ? window : globalThis);
