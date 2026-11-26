/* Steps text for the Unit 3 WALKTHROUGHS ("6.1w" ...) and ASSIGNMENTS ("6.1a" ...) (see lab-lessons.js). The bullets line up one-to-one with the check lists in step-checks-w.js.
   Walkthrough = training voice: it teaches the idea, shows the exact code to type, and says what the browser will show.
   Assignment = a real company asks for a page: plain words, no code shown, no hints. Loaded after answers-u3.js. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
  function build(list) {
    var out = [], n = 0;
    list.forEach(function (it) {
      if (it.step) { n++; out.push({ h: "Step " + n + ": " + it.step }); (it.pre || []).forEach(function (x) { out.push(x); }); out.push({ build: it.build }); (it.post || []).forEach(function (x) { out.push(x); }); }
      else out.push(it);
    });
    return out;
  }
  function S(title, bullets, pre, post) { return { step: title, build: bullets, pre: pre, post: post }; }
  var CODE = function (t) { return { code: t }; }, P = function (t) { return { p: t }; };
  var TYPEIT = "**Type it yourself, exactly as shown.** Pasting is turned off on purpose: typing the tags is how you learn them.";
  var TYPEIT2 = "**Type it yourself, exactly as shown.** Typing the tags is how you learn them, even where pasting is allowed.";

  /* ===================== 3.1 Walkthrough ===================== */
  A["6.1w"] = build([
    { h: "What you are building" },
    P("You are the new web developer at **Slice House**, a pizza shop that has no website yet. In this walkthrough you build its first page, one small step at a time. A web page is just **text with tags** that tell the browser what each piece is. " + TYPEIT),
    { map: ["The skeleton every page starts with", "Heading 1: the name of the shop", "Section 1: a heading 2 and a paragraph", "Section 2: another heading 2 and paragraph", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/html-intro-notes.html"),
    S("The skeleton", [
      "Type the **doctype** as the very first line of the page: `<!DOCTYPE html>`. It has an exclamation point and no closing tag. It tells the browser \"this is a modern web page.\"",
      "Under it, type the opening **html** tag, `<html>`. The editor adds the closing `</html>` tag for you. Everything else on the page goes **between** those two tags.",
      "Inside the html tags, type the **head** tag, `<head>`. The head holds information about the page that visitors do not see on the page itself. The editor adds `</head>` and puts your cursor under it.",
      "Click on the empty line **between** the head tags and type a **title**: `<title>Slice House</title>`. The title is the name on the browser tab. It is typed in the head, so it never shows on the page.",
      "Click on the line **under** the closing `</head>` tag (still inside the html tags) and type the **body** tag, `<body>`. Everything you can see on a page goes in the body."
    ], [P("Every web page starts with the same **skeleton**, the way every house starts with a frame. A **tag** is a word in angle brackets. Most tags come in a **pair**: an opening tag like `<body>` and a closing tag with a slash like `</body>`."),
        CODE("<!DOCTYPE html>\n<html>\n<head>\n<title>Slice House</title>\n</head>\n<body>\n</body>\n</html>")], [P("**Try it:** the preview is blank because the body is still empty. Look at the browser tab: that is where the title lives.")]),
    S("Heading 1", [
      "Click **between** the body tags and type a **heading 1** with the shop's name: `<h1>Slice House</h1>`. Make it the first thing inside the body."
    ], [P("A **heading 1** (`h1`) is the biggest, most important heading. A page has **one**, like the title of a book.")], [P("**Try it:** the preview now shows \"Slice House\" in big bold letters.")]),
    S("Section 1", [
      "Under the heading 1, type a **heading 2**: `<h2>Our Story</h2>`. A heading 2 (`h2`) is a smaller heading for one section of the page.",
      "Right under that heading 2, type a **paragraph**: `<p>Slice House opened in 2019 with one oven and a big idea.</p>`. Every block of normal text goes in its own `p` tag."
    ], [P("A section is a heading with its text under it. Type the words **exactly** as written, including the period at the end.")]),
    S("Section 2", [
      "Under your paragraph, type another heading 2: `<h2>Our Menu</h2>`.",
      "Right under it, type a paragraph: `<p>We bake cheese, pepperoni, and veggie pizza every day.</p>`.",
      "Count your tags. The page has **1** heading 1, **2** heading 2s and **2** paragraphs."
    ], [], [P("**Try it:** press Enter a few extra times between two of your lines, so there are blank lines. Look at the preview. Nothing moves! The browser ignores blank lines and extra spaces, and only the tags decide how the page looks. Then delete the extra blank lines.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty. If it is not, click a problem to jump to that line and fix it (usually a tag that is not closed or is misspelled).",
      "Choose your class period at the top, then click **Submit**. You can submit again to replace it."
    ])
  ]);

  /* ===================== 3.1 Assignment ===================== */
  A["6.1a"] = build([
    { h: "What you are building" },
    P("**Netflix** wants a simple Help Center page. Build it from scratch with the skeleton, one main heading and two short help sections. Type every tag yourself. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "Heading 1", "Two sections: a heading 2 and a paragraph each", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags (everything else goes inside them)",
      "Inside the html tags, add the head tags. Inside the head, add a **title** that says exactly **Netflix Help Center**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("Main heading", [
      "Inside the body, add **one heading 1** that says exactly **Help Center**"
    ]),
    S("Two help sections", [
      "Under the heading 1, add a **heading 2** that says exactly **Billing**. Right under it, add a paragraph of at least 5 words that tells members how to find their bill",
      "Under that paragraph, add a **heading 2** that says exactly **Devices**. Right under it, add a paragraph of at least 5 words that tells members which devices they can watch on",
      "Use only heading 1 and heading 2 (no heading 3 or smaller). The page has exactly **1** heading 1, **2** heading 2s and **2** paragraphs"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.2 Walkthrough ===================== */
  A["6.2w"] = build([
    { h: "What you are building" },
    P("**Pixel Arcade** wants a page with some color. You will start with a plain page and then give it colors one piece at a time using the **style attribute**. " + TYPEIT),
    { map: ["Set up the page", "Color text with color", "Two styles in one attribute", "Hex color codes", "Style the whole page with the body", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/style-attribute-notes.html"),
    S("Set up the page", [
      "From memory, type the whole skeleton: the doctype line, the **html** tags, the **head** tags with a title that says **Pixel Arcade**, and the **body** tags",
      "Inside the body, type a heading 1 that says **Pixel Arcade**, a heading 2 that says **Top Games**, and a paragraph that says **New games arrive every Friday.**"
    ], [P("You already know this part from lesson 3.1, so type it from memory. Peek at the example only if you get stuck."), CODE("<h1>Pixel Arcade</h1>\n<h2>Top Games</h2>\n<p>New games arrive every Friday.</p>")]),
    S("Color text with color", [
      "Change the opening heading 1 tag so it looks like this: `<h1 style=\"color: tomato\">`. Keep the words and the closing tag the same"
    ], [P("The **style attribute** goes **inside the opening tag**. It is the word `style`, an equals sign, and then the styles inside **double quotes**. Each style is a **property**, a colon, and a **value**. Here the property is `color` (the color of the text) and the value is `tomato`."), CODE("<h1 style=\"color: tomato\">Pixel Arcade</h1>")],
      [P("**Try it:** the heading turns tomato red. Only the h1 changed, because only the h1 has the style.")]),
    S("Two styles in one attribute", [
      "Give the heading 2 a **white** text color and a **black** background: `<h2 style=\"color: white; background-color: black\">`. The two styles are separated by a **semicolon**"
    ], [P("The property `background-color` colors the box behind the text. To use more than one style, put them **all inside the same quotes** and separate them with a **semicolon** (`;`). Never write two style attributes on one tag."), CODE("<h2 style=\"color: white; background-color: black\">Top Games</h2>")],
      [P("**Try it:** swap white and black and watch the heading change. Then put it back.")]),
    S("Hex color codes", [
      "Give the paragraph a dark blue text color and a light yellow background, this time with **hex codes**: `<p style=\"color: #003366; background-color: #FFEEAA\">`"
    ], [P("Besides names like `tomato`, a color can be a **hex code**: a `#` followed by 6 letters and numbers. A hex code can make millions of exact colors. `#003366` is a dark blue and `#FFEEAA` is a light yellow. Type the `#` too."), CODE("<p style=\"color: #003366; background-color: #FFEEAA\">New games arrive every Friday.</p>")]),
    S("Style the whole page with the body", [
      "Give the **body** a navy background and white text: `<body style=\"background-color: navy; color: white\">`"
    ], [P("Styles on the **body** reach the whole page. Anything that does not have its own style uses the body's colors. Pieces with their own style (like your tomato heading, the black heading and the yellow paragraph) keep their own colors.")],
      [P("**Try it:** the page turns navy. The heading 1 stays tomato because it has its own color.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty. If it is not, click a problem to jump to that line and fix it (usually a missing quote or a missing semicolon)",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.2 Assignment ===================== */
  A["6.2a"] = build([
    { h: "What you are building" },
    P("**Spotify** wants a colorful playlist page for a road trip. Build it from scratch. Pick colors that are easy to read: dark text on a light background, or light text on a dark background. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Colors", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Road Trip Mix**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Road Trip Mix**, then **two heading 2s** (like the names of two songs)",
      "Add **two paragraphs**, one under each heading 2, with at least 5 words each"
    ]),
    S("Colors", [
      "Give the **body** a background color and a text color (named colors). The two colors must be different",
      "Give the **heading 1** a text color and a **different** background color",
      "Give **every heading 2** a text color and a different background color",
      "Give **two of your paragraphs** both a text color and a background color, using **hex codes** (a # and letters and numbers) for both. Use two different colors in each"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.3 Walkthrough ===================== */
  A["6.20w"] = build([
    { h: "What you are building" },
    P("**Skyline Cinema** needs a poster page for its Friday movie night. You will change the **size**, **alignment** and **letter case** of the text. " + TYPEIT),
    { map: ["Set up the page", "Font size", "Text alignment", "Letter case", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/text-size-align-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Skyline Cinema**, and the body tags",
      "Inside the body type four things: a heading 1 that says **Skyline Cinema**, a heading 2 that says **Now Showing**, a **heading 3** that says **friday night double feature** (all small letters, on purpose) and a paragraph that says **DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS.** (all capitals, on purpose)"
    ], [P("This page uses a new tag, the **heading 3** (`h3`). It is a heading that is smaller than a heading 2. The headings go h1, h2, h3 from biggest to smallest. Type the words **exactly** as shown, including the small letters and the capitals."), CODE("<h1>Skyline Cinema</h1>\n<h2>Now Showing</h2>\n<h3>friday night double feature</h3>\n<p>DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS.</p>")]),
    S("Font size", [
      "Add a style to the **heading 1**: `font-size: 48px`",
      "Add a style to the **heading 3**: `font-size: 24px`",
      "Add a style to the **paragraph**: `font-size: 18px`"
    ], [P("The style `font-size` sets how big the letters are. The size is a number with **px** (pixels) right after it, with **no space**: `48px`. A heading already has its own default size, and `font-size` overrides it."), CODE("<h1 style=\"font-size: 48px\">Skyline Cinema</h1>")],
      [P("**Try it:** all three get bigger than the browser's default sizes. Change 48px to 80px and watch the heading grow, then put it back.")]),
    S("Text alignment", [
      "Add `text-align: center` to the **heading 1**. Keep the font-size and put a **semicolon** between the two styles",
      "Add `text-align: center` to the **heading 2**",
      "Add `text-align: right` to the **paragraph**, after its font-size"
    ], [P("The style `text-align` moves text left, center or right inside its row. Text starts on the **left** until you change it. All the styles for one tag stay inside **one** style attribute, separated by semicolons."), CODE("<h1 style=\"font-size: 48px; text-align: center\">Skyline Cinema</h1>")],
      [P("**Try it:** change the paragraph to `left` and then back to `right`.")]),
    S("Letter case", [
      "Add `text-transform: uppercase` to the **heading 1** (after its other two styles)",
      "Add `text-transform: capitalize` to the **heading 3** (after its font-size)",
      "Add `text-transform: lowercase` to the **paragraph** (after its other two styles)"
    ], [P("The style `text-transform` changes the letter case **on the page** without changing the words you typed. `uppercase` makes every letter a capital, `lowercase` makes every letter small, and `capitalize` makes the **first letter of every word** a capital."), CODE("<h1 style=\"font-size: 48px; text-align: center; text-transform: uppercase\">Skyline Cinema</h1>")],
      [P("**Try it:** the heading 3 now reads Friday Night Double Feature and the paragraph reads in small letters, even though you typed them the other way around.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.3 Assignment ===================== */
  A["6.20a"] = build([
    { h: "What you are building" },
    P("**Nintendo** wants a poster page for a game announcement. Build it from scratch. The page title and the main heading are given. The rest is yours: pick a game and write the words. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Size, alignment and letter case", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Nintendo Direct**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Nintendo Direct**, then a **heading 2** and a **heading 3** (like the game name and the release day)",
      "Add a **paragraph** of at least 5 words about the game"
    ]),
    S("Size, alignment and letter case", [
      "**Heading 1:** a font-size of **at least 40px**, centered, in capital letters",
      "**Heading 2:** centered, with a font-size in px",
      "**Heading 3:** every word starts with a capital letter (the text-transform for that), with a font-size in px",
      "**Paragraph:** a font-size from **14px to 24px**, aligned to the right",
      "Use what you know from 3.2: give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.4 Walkthrough ===================== */
  A["6.3w"] = build([
    { h: "What you are building" },
    P("**Beanstalk Coffee** wants a small page for its shop door. You will add **bold**, **italics**, a **line break**, **lines** across the page, and a **colored word**. " + TYPEIT),
    { map: ["Set up the page", "Bold and italics: strong and em", "A line break: br", "A line across the page: hr", "One colored word: span", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/editing-tags-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Beanstalk Coffee**, and the body tags",
      "Inside the body type a heading 1 that says **Beanstalk Coffee**, then **three paragraphs** with plain text: **We roast fresh beans every morning and serve them hot.** and **Open daily 7 AM to 5 PM** and **Try the Green Giant latte.**"
    ], [CODE("<h1>Beanstalk Coffee</h1>\n<p>We roast fresh beans every morning and serve them hot.</p>\n<p>Open daily 7 AM to 5 PM</p>\n<p>Try the Green Giant latte.</p>")]),
    S("Bold and italics: strong and em", [
      "In paragraph 1, put the word **fresh** inside a **strong** tag and the word **hot** inside an **em** tag. Do not use the b or i tags"
    ], [P("Tags can go **inside** other tags. The **strong** tag makes the words inside it **bold**, and the **em** tag makes them italic. Wrap exactly the word you want, and keep the spaces around it."), CODE("<p>We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.</p>")],
      [P("**Try it:** \"fresh\" turns bold and \"hot\" turns italic. In this class, bold is always **strong** and italics is always **em**. Never `b` or `i`.")]),
    S("A line break: br", [
      "In paragraph 2, replace the space between **daily** and **7** with a **br** tag so the hours start on a new line: `Open daily<br>7 AM to 5 PM`"
    ], [P("A browser ignores pressing Enter, so it keeps the words on one line. The **br** tag forces a **new line** inside a paragraph. It stands **alone**: it has **no closing tag**."), CODE("<p>Open daily<br>7 AM to 5 PM</p>")]),
    S("A line across the page: hr", [
      "Add an **hr** tag right under the heading 1, and another **hr** between paragraph 2 and paragraph 3"
    ], [P("The **hr** tag draws a **horizontal rule**: a line across the page that separates sections. Like br, it stands alone and has no closing tag."), CODE("<h1>Beanstalk Coffee</h1>\n<hr>\n<p>...</p>\n<p>...</p>\n<hr>\n<p>Try the Green Giant latte.</p>")],
      [P("**Try it:** the page now has a line under the heading and a line above the last paragraph.")]),
    S("One colored word: span", [
      "In paragraph 3, put the words **Green Giant** inside a **span** tag with a style: `<span style=\"color: green\">Green Giant</span>`"
    ], [P("A **span** is a tag that does nothing by itself. It only marks a few words inside a line so you can style just those words. Without a style it looks the same as the rest of the line."), CODE("<p>Try the <span style=\"color: green\">Green Giant</span> latte.</p>")],
      [P("**Try it:** only the two words turn green, and the rest of the paragraph stays black.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.4 Assignment ===================== */
  A["6.3a"] = build([
    { h: "What you are building" },
    P("**Chipotle** wants a menu page for its kiosk screen. Build it from scratch and write your own menu items. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Menu touches", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Chipotle Menu**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Chipotle Menu** and **at least 3 paragraphs** (menu items, prices, an address)"
    ]),
    S("Menu touches", [
      "Add a **horizontal rule** right under the heading 1, and at least one more rule somewhere lower on the page",
      "Make at least one word **bold** and at least one word in italics (never the b or i tags)",
      "Put an address or a menu item on **two lines** inside one paragraph, with a line break between them",
      "Give **one or more words** their own text color with a span tag",
      "Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.5 Walkthrough ===================== */
  var FONTLINKS = "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n";
  A["6.35w"] = build([
    { h: "What you are building" },
    P("**Sweet Dreams Bakery** wants a page with real fonts. Your computer only has a few fonts built in, so you will load fonts from **Google Fonts** and use them with **font-family**. You may copy and paste the font links from Google Fonts. " + TYPEIT2),
    { map: ["Set up the page", "Load the first font", "Use the first font", "Load and use a second font", "A different font on one word", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/google-fonts-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Sweet Dreams Bakery**, and the body tags",
      "Inside the body type a heading 1 that says **Sweet Dreams Bakery**, a paragraph that says **Fresh bread and cakes every morning from our family oven.** and a second paragraph that says **Try our famous cinnamon rolls.**"
    ], [CODE("<h1>Sweet Dreams Bakery</h1>\n<p>Fresh bread and cakes every morning from our family oven.</p>\n<p>Try our famous cinnamon rolls.</p>")]),
    S("Load the first font", [
      "Add the link for the **Pacifico** font inside the **head** tags, under the title: `<link href=\"https://fonts.googleapis.com/css2?family=Pacifico&display=swap\" rel=\"stylesheet\">`"
    ], [P("Fonts come from **fonts.google.com**. You pick a font, click **Get embed code**, and copy the `<link>` lines. The link goes in the **head** (never the body) and tells the browser to download the font. When you copy Google's code you get **three lines**: two `preconnect` lines that make loading faster, and the line with the font. The line that matters is the last one:"), CODE(FONTLINKS + "<link href=\"https://fonts.googleapis.com/css2?family=Pacifico&display=swap\" rel=\"stylesheet\">")],
      [P("**Try it:** nothing changes on the page yet. **Loading a font is not using it.**")]),
    S("Use the first font", [
      "Give the heading 1 a style that uses it: `<h1 style=\"font-family: 'Pacifico'\">`. Put the font's name in **single quotes**"
    ], [P("The style `font-family` picks the font. Write the font's name exactly as Google spells it, in **single quotes**, because the style attribute already uses double quotes."), CODE("<h1 style=\"font-family: 'Pacifico'\">Sweet Dreams Bakery</h1>")],
      [P("**Try it:** the heading turns into a curly script font.")]),
    S("Load and use a second font", [
      "Add a second link in the head for the **Open Sans** font: `<link href=\"https://fonts.googleapis.com/css2?family=Open+Sans&display=swap\" rel=\"stylesheet\">`",
      "Give **both paragraphs** the style `font-family: 'Open Sans'`"
    ], [P("A second font needs its own link. A name with a space, like Open Sans, needs the quotes. In the link, the space is written as a **+**."), CODE("<link href=\"https://fonts.googleapis.com/css2?family=Open+Sans&display=swap\" rel=\"stylesheet\">\n<p style=\"font-family: 'Open Sans'\">...</p>\n<p style=\"font-family: 'Open Sans'\">...</p>")]),
    S("A different font on one word", [
      "In paragraph 2, put the word **famous** inside a **span** with the style `font-family: 'Pacifico'`"
    ], [P("A span inside a paragraph can use its own font. It overrides the paragraph's font for just those words, the same way a span can change a color."), CODE("<p style=\"font-family: 'Open Sans'\">Try our <span style=\"font-family: 'Pacifico'\">famous</span> cinnamon rolls.</p>")],
      [P("**Try it:** only the word \"famous\" is in the script font. Good designers use **2 to 4 fonts**, and each one has a job.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.5 Assignment ===================== */
  A["6.35a"] = build([
    { h: "What you are building" },
    P("**Airbnb** wants a page about cozy cabins that uses two fonts with different jobs: one for headings, one for reading. Pick fonts that fit a cabin trip. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Load two fonts", "Use the fonts", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Airbnb Cabins**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Airbnb Cabins** and **two paragraphs** about cabins, with at least 5 words each"
    ]),
    S("Load two fonts", [
      "From fonts.google.com, get the link code for **two different fonts** and put them in the **head**"
    ]),
    S("Use the fonts", [
      "Give the **heading 1** one of your fonts with font-family (name in single quotes)",
      "Give **both paragraphs** your **other** font, so the heading and the paragraphs use different fonts",
      "Put a **span** around at least one word in a paragraph, and give it the **heading's font** so it stands out",
      "Use what you know: **center** the heading 1, and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.6 Walkthrough ===================== */
  A["6.4w"] = build([
    { h: "What you are building" },
    P("A school club wants a flyer for **Game Night**. You will put **borders** around the pieces of the page. A border has three parts that always come in this order: a **thickness**, a **style** and a **color**. " + TYPEIT2),
    { map: ["Set up the page", "A border on all four sides", "More border styles", "A border on one side", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/borders-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Game Night**, and the body tags",
      "Inside the body type a heading 1 that says **Game Night**, a heading 2 that says **Friday at Six**, and five paragraphs: **Snacks are free all night.** / **Bring a friend.** / **Everyone gets a prize.** / **Games start at seven.** / **See you Friday.**"
    ], [CODE("<h1>Game Night</h1>\n<h2>Friday at Six</h2>\n<p>Snacks are free all night.</p>\n<p>Bring a friend.</p>\n<p>Everyone gets a prize.</p>\n<p>Games start at seven.</p>\n<p>See you Friday.</p>")]),
    S("A border on all four sides", [
      "Give the **heading 1** the style `border: 4px solid navy`",
      "Give **paragraph 1** the style `border: 3px dotted green`"
    ], [P("The style `border` draws a line around all four sides of a tag. It takes **three parts, in this order, with spaces between them**: the **thickness** (a number with px), the **style** (what kind of line) and the **color**."), CODE("<h1 style=\"border: 4px solid navy\">Game Night</h1>")],
      [P("**Try it:** the heading gets a navy box around it and the first paragraph a dotted green one. Change 4px to 10px and watch the line get thicker, then put it back.")]),
    S("More border styles", [
      "Give **paragraph 2** the style `border: 6px double purple`",
      "Give **paragraph 3** the style `border: 5px groove orange`",
      "Give **paragraph 4** the style `border: 5px ridge teal`"
    ], [P("There are **six** border styles: `solid` (one plain line), `dashed` (dashes), `dotted` (dots), `double` (two lines), `groove` (looks pressed in) and `ridge` (looks sticking out). A `double` border needs a thickness of at least 3px to show both lines.")],
      [P("**Try it:** compare the groove and ridge borders. They use the same color but look different.")]),
    S("A border on one side", [
      "Give the **heading 2** the style `border-bottom: 3px dashed red` (a line under it only)",
      "Give **paragraph 5** the style `border-left: 8px solid black` (a thick line on its left side only)"
    ], [P("To draw a border on just one side, add the side to the property: `border-top`, `border-bottom`, `border-left` or `border-right`. It uses the same three parts: thickness, style, color."), CODE("<h2 style=\"border-bottom: 3px dashed red\">Friday at Six</h2>")],
      [P("**Try it:** change `border-bottom` to `border-top` and see the line jump above the heading. Then put it back.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.6 Assignment ===================== */
  A["6.4a"] = build([
    { h: "What you are building" },
    P("**Pokemon** wants a trading card page for Pikachu, where borders make every part of the card stand out. Write your own card facts. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Borders", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Pokemon Card**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Pikachu** and a **heading 2** (like the card type)",
      "Add **four paragraphs** of facts about the card, with at least 3 words each"
    ]),
    S("Borders", [
      "Give the **heading 1** a border on all four sides, **at least 4px thick**, with a named color",
      "Give the **heading 2** a border on the **bottom only**",
      "Give **four paragraphs** a full border (thickness, style, named color). Use **at least four different border styles** across the page",
      "Give one paragraph a border on **only its left side** or **only its right side**",
      "Use what you know: **center** the heading 1, give it a font-size of **at least 40px**, and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.7 Walkthrough ===================== */
  var LABU = "https://schscomputerscience.com/ist/unit-6/lab/";
  A["6.7w"] = build([
    { h: "What you are building" },
    P("**Space Camp** wants a page with pictures and its own tiny icon on the browser tab. You will add the icon (the **favicon**), two **pictures** with the **img** tag, and set their **sizes**. The pictures are already online, so you only need their web addresses. " + TYPEIT2),
    { map: ["Set up the page", "The favicon on the tab", "The first picture", "Picture sizes", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/images-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Space Camp**, and the body tags",
      "Inside the body type a heading 1 that says **Space Camp** and a paragraph that says **Blast off this summer.**"
    ], [CODE("<h1>Space Camp</h1>\n<p>Blast off this summer.</p>")]),
    S("The favicon on the tab", [
      "Inside the **head**, under the title, add a favicon link: `<link rel=\"icon\" href=\"" + LABU + "rocket.svg\">`"
    ], [P("A **favicon** is the tiny picture on a browser tab. It is added with a **link** tag inside the **head**, with `rel=\"icon\"` and an `href` that is the web address of a picture. Like `br` and `hr`, the link tag stands alone: **no closing tag**."), CODE("<link rel=\"icon\" href=\"" + LABU + "rocket.svg\">")],
      [P("**Try it:** look at the browser tab of your preview or open the page in a new tab. The tab now shows a small rocket. (A tab icon can take a moment to appear.)")]),
    S("The first picture", [
      "Right under the heading 1, add the **img** tag: `<img src=\"" + LABU + "rocket.svg\" alt=\"A red and white rocket flying through space\">`"
    ], [P("The **img** tag shows a picture. It has two attributes. **src** is the web address of the picture file and **alt** is words that describe the picture (screen readers read them aloud, and they show if the picture cannot load). The img tag stands alone: **no closing tag**, never `</img>`."), CODE("<img src=\"" + LABU + "rocket.svg\" alt=\"A red and white rocket flying through space\">")],
      [P("**Try it:** a big rocket picture appears under the heading. It is much too big, so the next step fixes that.")]),
    S("Picture sizes", [
      "Add a style to the rocket picture that sets its width: `style=\"width: 200px\"`. Only set the **width**, never the height",
      "Under the paragraph add a second picture: `<img src=\"" + LABU + "planet.svg\" alt=\"A purple planet with a yellow ring\" style=\"width: 50%\">`"
    ], [P("Set a picture's size with the style `width`. A number with **px** is an exact size. A number with **%** is a share of the page's width, so the picture grows and shrinks with the window. Set only the width and the browser works out the height, so the picture is never squished."), CODE("<img src=\"" + LABU + "rocket.svg\" alt=\"A red and white rocket flying through space\" style=\"width: 200px\">")],
      [P("**Try it:** drag the preview narrower. The rocket stays 200px but the planet shrinks with the page. Never use both width and height.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.7 Assignment ===================== */
  A["6.7a"] = build([
    { h: "What you are building" },
    P("**Apple** wants a store page with pictures. Build it from scratch. You may use any pictures with an **https://** address, or ones you uploaded in **Checks > My images**. These three are ready to use: " + LABU + "rocket.svg, " + LABU + "planet.svg and " + LABU + "moon.svg. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "The favicon", "Pictures", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Apple Store**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Apple Store** and **two paragraphs** about products, with at least 5 words each"
    ]),
    S("The favicon", [
      "Add a **favicon** to the head, using one of the picture addresses"
    ]),
    S("Pictures", [
      "Add **at least 3 pictures** with the img tag, each with a web address",
      "Give **every picture** an alt description of at least 2 words that says what is in it",
      "Set one picture's **width in px** and another picture's **width in %** (never a height)",
      "Give **one picture** a border",
      "Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.8 Walkthrough ===================== */
  A["6.75w"] = build([
    { h: "What you are building" },
    P("**Pizza Night** wants a flyer with some personality. You will add an **emoji**, a **symbol**, a row of **stars** and a **footer**. An emoji or a symbol is not a picture: it is a **text character**, like a letter. You copy it and paste it between the tags, with the other text. Copy each character from this page, or open your computer's emoji picker (Windows key + period, or Mac Control + Command + Space). " + TYPEIT2),
    { map: ["Set up the page", "An emoji in a heading", "A symbol in a paragraph", "Stars with a span", "A footer", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/emojis-symbols-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Pizza Night**, and the body tags",
      "Inside the body type a heading 1 that says **Pizza Night** and three paragraphs: **Friday at 6 bring friends!** and **Rating:** and **2027 Pizza Night Made with love**"
    ], [CODE("<h1>Pizza Night</h1>\n<p>Friday at 6 bring friends!</p>\n<p>Rating:</p>\n<p>2027 Pizza Night Made with love</p>")]),
    S("An emoji in a heading", [
      "At the end of the heading 1 text, after a space, paste the pizza emoji: **🍕**. It goes **between the tags**, as text"
    ], [P("Emojis and symbols are **characters**, not pictures. So they never need `src`, `alt` or an upload. They go between the opening and closing tags, with the other words, and **never inside** the angle brackets of a tag."), CODE("<h1>Pizza Night 🍕</h1>")],
      [P("**Try it:** the pizza shows up at the end of the heading. Make the heading `font-size: 60px` in the style attribute and watch the emoji grow with the letters, then remove that style.")]),
    S("A symbol in a paragraph", [
      "In paragraph 1, put the arrow symbol **→** between **6** and **bring** (with a space on each side): **Friday at 6 → bring friends!**"
    ], [P("A symbol is any character that is not a letter or number, like **→ ★ © ™ ♥ °**. You find them the same way as emojis: copy and paste. They work in any text.")]),
    S("Stars with a span", [
      "Change paragraph 2 to **Rating: ★★★★★**. Put the first **four stars** in a span with the style `color: gold; font-size: 30px` and the **last star** in a second span with the style `color: gray; font-size: 30px`"
    ], [P("Because symbols are text, you can style them like text. A span around the stars lets you color and size just them."), CODE("<p>Rating: <span style=\"color: gold; font-size: 30px\">★★★★</span><span style=\"color: gray; font-size: 30px\">★</span></p>")],
      [P("**Try it:** four gold stars and one gray star: a 4 out of 5 rating.")]),
    S("A footer", [
      "Change paragraph 3 to **© 2027 Pizza Night™ ♥ Made with love** and give it the style `text-align: center; font-size: 14px`"
    ], [P("Almost every real website ends with a footer line that has a **©** (copyright) symbol, the year, and often a **™** (trademark) symbol. It is small and centered."), CODE("<p style=\"text-align: center; font-size: 14px\">© 2027 Pizza Night™ ♥ Made with love</p>")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.8 Assignment ===================== */
  A["6.75a"] = build([
    { h: "What you are building" },
    P("**Taco Bell** wants a menu page with emojis and symbols. Build it from scratch with your own menu items. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Symbols", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Taco Bell Menu**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** with the words **Taco Bell** and an **emoji**",
      "Add **three menu paragraphs**. Each one **starts with its own emoji** and then names the food and a price"
    ]),
    S("Symbols", [
      "Add a **rating paragraph** with **at least 3 stars (★)** inside a span. Give the span a named color and a font-size in px",
      "Add a **footer paragraph** with the **©** and **™** symbols. Center it and make its font-size **16px or smaller**",
      "Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  var NASA = "https://www.nasa.gov";
  /* ===================== 3.9 Walkthrough ===================== */
  A["6.6w"] = build([
    { h: "What you are building" },
    P("The **Space Fan Club** needs a page that connects to other sites. You will make links with the **a** tag: from plain words, from **bold** words, from a **heading**, and from a **picture**. " + TYPEIT2),
    { map: ["Set up the page", "A link in a sentence", "A bold link", "A heading that is a link", "A picture that is a link", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/links-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Space Fan Club**, and the body tags",
      "Inside the body type, in this order: a heading 1 that says **Space Fan Club**, a paragraph that says **Visit NASA to see real launches.**, a paragraph that says **Join the mission**, and a heading 2 that says **Moon Facts**"
    ], [CODE("<h1>Space Fan Club</h1>\n<p>Visit NASA to see real launches.</p>\n<p>Join the mission</p>\n<h2>Moon Facts</h2>")]),
    S("A link in a sentence", [
      "In paragraph 1, put the word **NASA** inside an **a** tag: `<a href=\"" + NASA + "\" target=\"_blank\">NASA</a>`"
    ], [P("A link is the **anchor tag**, `a`. The attribute **href** holds the web address, and it must start with `https://`. The words **between** the opening and closing tags are what people click. The attribute `target=\"_blank\"` makes the link open in a **new tab**, which is what you want for any link that leaves your own website. Separate the two attributes with a space, and always close the tag with `</a>`."), CODE("<p>Visit <a href=\"" + NASA + "\" target=\"_blank\">NASA</a> to see real launches.</p>")],
      [P("**Try it:** click your link. It opens NASA in a new tab. (If you forget the closing `</a>`, the whole rest of the page becomes a link.)")]),
    S("A bold link", [
      "In paragraph 2, make the words **Join the mission** a link to `" + NASA + "/missions/` that opens in a new tab, with the words in a **strong** tag **inside** the a tag"
    ], [P("Anything between `<a>` and `</a>` becomes the link, including bold words. Tags nest like boxes: the last tag you open is the first one you close."), CODE("<p><a href=\"" + NASA + "/missions/\" target=\"_blank\"><strong>Join the mission</strong></a></p>")]),
    S("A heading that is a link", [
      "Make the words **Moon Facts** in the heading 2 a link to `https://en.wikipedia.org/wiki/Moon` that opens in a new tab. Put the a tag **inside** the h2 tags"
    ], [CODE("<h2><a href=\"https://en.wikipedia.org/wiki/Moon\" target=\"_blank\">Moon Facts</a></h2>")]),
    S("A picture that is a link", [
      "Right under the heading 1, add a link to `" + NASA + "` that opens in a new tab and has a **picture** inside it: `<img src=\"" + LABU + "rocket.svg\" alt=\"A red and white rocket flying through space\" style=\"width: 150px\">`"
    ], [P("An image can be a link too. Put the whole **img** tag between the opening and closing a tags. The link goes on the **outside** and the picture on the **inside**. The img tag still has no closing tag."), CODE("<a href=\"" + NASA + "\" target=\"_blank\"><img src=\"" + LABU + "rocket.svg\" alt=\"A red and white rocket flying through space\" style=\"width: 150px\"></a>")],
      [P("**Try it:** hover over the rocket. The pointer turns into a hand, and clicking it opens NASA in a new tab.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.9 Assignment ===================== */
  A["6.6a"] = build([
    { h: "What you are building" },
    P("**YouTube** wants a page that links to a creator's favorite channels and videos. Pick real websites that fit. The links must be real, so test each one. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Links", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **YouTube Favorites**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **YouTube Favorites**, then **three heading 2s** and **two paragraphs** (at least 5 words each)"
    ]),
    S("Links", [
      "Add **at least 3 text links** with real **https://** addresses. Every link opens in a **new tab**, and its words say where it goes (never click here)",
      "Make one link out of **bold words** (the bold is inside the link)",
      "Make one **whole heading 2** a link",
      "Add a **picture that is a link**, with a real alt description, a width in px and a link that opens in a new tab. Any picture address works, or use " + LABU + "rocket.svg",
      "Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.10 Walkthrough ===================== */
  A["6.5w"] = build([
    { h: "What you are building" },
    P("A scout troop wants a **Camping Trip** page with three lists: a packing list with **bullets**, a numbered list of **steps**, and a **menu** that sits in a row. " + TYPEIT2),
    { map: ["Set up the page", "A list with bullets: ul", "Change the bullet style", "A numbered list: ol", "A menu in a row", "Check and submit"] },
    P("Stuck? Read the notes: schscomputerscience.com/ist/unit-6/lists-notes.html"),
    S("Set up the page", [
      "From memory, type the skeleton with a title that says **Camping Trip**, and the body tags",
      "Inside the body type a heading 1 that says **Camping Trip**, then three heading 2s, in this order: **Pack These**, **Cooking Steps** and **Menu**. Leave room under each one"
    ], [CODE("<h1>Camping Trip</h1>\n<h2>Pack These</h2>\n<h2>Cooking Steps</h2>\n<h2>Menu</h2>")]),
    S("A list with bullets: ul", [
      "Right under **Pack These**, type an **unordered list**: the `ul` tags, with **three li items** inside: **Tent**, **Sleeping bag** and **Flashlight**"
    ], [P("An **unordered list** (`ul`) has bullets, and is used when the **order does not matter**. Every item is its own **li** tag. Only `li` tags go directly inside a `ul`."), CODE("<ul>\n<li>Tent</li>\n<li>Sleeping bag</li>\n<li>Flashlight</li>\n</ul>")]),
    S("Change the bullet style", [
      "Add the style `list-style-type: square` to the **ul** tag (not to the li tags)"
    ], [P("The **marker** is the bullet or number in front of each item. Change it with `list-style-type` on the **list tag**. The values for a `ul` are `disc` (the default), `circle`, `square` and `none`."), CODE("<ul style=\"list-style-type: square\">")],
      [P("**Try it:** change square to circle and back.")]),
    S("A numbered list: ol", [
      "Right under **Cooking Steps**, type an **ordered list** (`ol`) with three li items: **Build a small fire** (with the word **Build** in a strong tag and the words **a small fire** in an em tag), **Roast the marshmallows** and **Eat**",
      "Give the **ol** the style `list-style-type: upper-roman`"
    ], [P("An **ordered list** (`ol`) is numbered and is used when the **order matters**, like steps. Its markers are `decimal` (1, 2, 3, the default), `upper-roman`, `lower-roman`, `upper-alpha` and `lower-alpha`. Bold and italic tags go **inside** the li."), CODE("<ol style=\"list-style-type: upper-roman\">\n<li><strong>Build</strong> <em>a small fire</em></li>\n<li>Roast the marshmallows</li>\n<li>Eat</li>\n</ol>")]),
    S("A menu in a row", [
      "Right under **Menu**, type a second `ul` with three li items: **Home**, **About** and **Contact**",
      "Give the **ul** the style `list-style-type: none` so the bullets disappear",
      "Give **every li** the style `display: inline`"
    ], [P("Some tags are **block** (they start on a new line and fill the width) and some are **inline** (they stay in the line, like words). A `li` is block, so a list stacks. The style `display: inline` turns a block into an inline tag. Every menu bar on the internet is a list turned sideways: no bullets, and every li inline."), CODE("<ul style=\"list-style-type: none\">\n<li style=\"display: inline\">Home</li>\n<li style=\"display: inline\">About</li>\n<li style=\"display: inline\">Contact</li>\n</ul>")],
      [P("**Try it:** remove `display: inline` from one li. It drops to its own line, and the other two stay in the row.")]),
    S("Check and submit", [
      "Open the **Problems** list. It should be empty",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);

  /* ===================== 3.10 Assignment ===================== */
  A["6.5a"] = build([
    { h: "What you are building" },
    P("**Pizza Hut** wants a specials page with a list of deals, the steps to order, and a menu bar. Write your own items. Click **Checks** any time to see your score."),
    { map: ["The skeleton and a title", "The words on the page", "Three lists", "Check and submit"] },
    S("Skeleton and title", [
      "Type the doctype as the very first line, then the html tags",
      "Inside the html tags, add the head tags with a **title** that says exactly **Pizza Hut Specials**",
      "Under the head, still inside the html tags, add the body tags"
    ]),
    S("The words on the page", [
      "Inside the body, add a **heading 1** that says exactly **Pizza Hut Specials** and **three heading 2s** (one above each list)"
    ]),
    S("Three lists", [
      "**Deals:** a list **without numbers** with at least 4 items. Every item has a **bold name** and an italic description. Change its marker to a **circle** or a **square**",
      "**How to order:** a list **with numbers** or letters, with at least 3 steps, using **upper-roman, lower-roman, upper-alpha or lower-alpha** markers",
      "**Menu bar:** a list with **no markers** and at least 3 items that sit **in a row**",
      "Give one of your lists a **border**. Use what you know: **center** the heading 1 and give the **body** a background color and a different text color"
    ]),
    S("Check and submit", [
      "Fix anything in the **Problems** list",
      "Choose your class period at the top, then click **Submit**"
    ])
  ]);
})(typeof window !== "undefined" ? window : globalThis);
