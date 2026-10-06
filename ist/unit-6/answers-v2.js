/* "Assignment" tab steps for lessons 6.2 through 9.7 (the first lesson, 6.1, lives in answers-early.js).
   EVERY assignment is a brand-new website: nothing is copied from an earlier lesson. Each one also uses at least 2 examples of
   every tag, style, attribute, and value taught before it. concepts.js lists those items and html-check.js checks them.
   Writing rule: describe WHAT to add and WHERE in plain words. Never give exact tags, attributes, or code to copy. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
  var CON = root.U7_CONCEPTS;

  function skeleton(what) {
    return { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with " + what,
      "Add exactly **one heading 1** at the top of the body"
    ] };
  }
  function finish(extra) {
    return { build: (extra || []).concat([
      "Click **Checks** and fix anything that is not green. The **Use everything you already know** list has to turn green too",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ]) };
  }
  /* "Step N: Use everything you already know": built from concepts.js so it always matches the Concepts tab and the checks */
  function review(lesson, n) {
    var rv = CON.reviewFor(lesson), lines = [];
    CON.groups.forEach(function (g) {
      var items = (rv[g[0]] || []).filter(function (it) { return !it.once; });
      if (items.length) lines.push("**" + g[1] + ":** " + items.map(function (it) { return "`" + it.label + "`"; }).join(", "));
    });
    return [
      { h: "Step " + n + ": Use everything you already know" },
      { p: "A real website uses all of its tools more than once. Use **every item below at least 2 times**, in 2 different places, where it fits your page. The **Concepts** tab (next to Assignment) shows this list any time, and the **Checks** list tracks it for you." },
      { build: lines }
    ];
  }
  function notes(url) { return { p: "Stuck? Read the notes: schscomputerscience.com/ist/" + url }; }
  function done(n, extra) { return [{ h: "Step " + n + ": Test and submit" }, finish(extra)]; }
  function make(list) { return [].concat.apply([], list); }

  /* ======================================================================= 6.x: HTML with the style attribute ===== */
  A["6.2"] = make([
    [{ h: "What you are building" },
      { p: "An **epic poster** for the biggest event of the year: pick **one** of a band's world tour, a movie premiere, an esports tournament, or a made-up holiday. You type the skeleton yourself, every time. Click **Checks** any time to see your score." },
      { map: [
        "The skeleton: doctype, html, head, and body (typed by you)",
        "Heading 1: the event name (huge, colored, centered, uppercase)",
        "Heading 2: the tagline (uppercase, colored, centered)",
        "Heading 3: When, then a paragraph with the date and time",
        "Heading 3: Where, then a paragraph with the place",
        "Heading 2: Tickets, then a paragraph with a thick border",
        "One last paragraph with a second border (a fun fact or a warning)"
      ] },
      notes("unit-6/style-attribute-notes.html"),
      { p: "Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with the property and value **inside** the quotes and a semicolon after each." }],
    [{ h: "Step 1: Skeleton, title and heading" }, skeleton("your poster's name")],
    [{ h: "Step 2: The words" },
      { build: [
        "Under the heading 1, add a **heading 2** with a tagline, then two **heading 3** labels (When and Where), each with a **paragraph** under it",
        "Add a second **heading 2** for Tickets, with a paragraph under it, and one more paragraph at the end",
        "Write real sentences that fit your event. Keep it school-appropriate"
      ] }],
    [{ h: "Step 3: Make it epic (exactly where each style goes)" },
      { build: [
        "**Text color** (the color of the letters): put it on the **heading 1**, the **heading 2s**, and the **heading 3s**. Use **named colors** (like gold, tomato, navy) for every color, at least 2 different ones",
        "**Background color** (behind the letters): put it on the **body** tag so the whole poster is colored, and on **one paragraph** too",
        "**Font size in pixels**: put it on the **heading 1** and make it HUGE, and on **one paragraph**",
        "**Center** the text: put it on the **heading 1** and the **Tickets heading 2**",
        "**Uppercase** letters: put it on the **heading 1** and the **tagline heading 2**",
        "**Border** (thickness, style, and color, in that order): put it on the **Tickets paragraph** and the **last paragraph**",
        "Dark backgrounds need light text. Light backgrounds need dark text"
      ] }],
    review("6.2", 4), done(5)
  ]);

  A["6.3"] = make([
    [{ h: "What you are building" },
      { p: "The **menu** for your dream restaurant: pick **one** of a taco truck, a bakery, or a cafe in space. You type the skeleton yourself, every time. Click **Checks** any time to see your score." },
      { map: [
        "The skeleton: doctype, html, head, and body (typed by you)",
        "Heading 1: the restaurant's name (serif font, colored, big, centered, with a background color)",
        "Paragraph: the address and hours on two lines (sans-serif, centered)",
        "Horizontal line",
        "Heading 2 (uppercase): Starters, with 2 dishes",
        "Horizontal line, then heading 2: Main Dishes, with 2 dishes (one dish has a border: today's special)",
        "Horizontal line, then heading 2: Desserts, with 2 dishes",
        "Heading 3 (centered): Chef's Special, with a bordered paragraph",
        "Heading 3: Good to Know, with a small monospace paragraph on two lines"
      ] },
      notes("unit-6/editing-tags-notes.html")],
    [{ h: "Step 1: Skeleton, title and name" }, skeleton("your restaurant's name")],
    [{ h: "Step 2: Address and hours" },
      { build: [
        "Under the heading 1, add a **paragraph** with your address, a **line break inside** it, and your hours on the second line",
        "Under the paragraph (**outside** it), add a **horizontal line**"
      ] }],
    [{ h: "Step 3: The menu" },
      { build: [
        "Add a **heading 2** for each of 3 sections, and a **horizontal line** between the sections (**outside** the paragraphs)",
        "Under each heading 2, add a **paragraph for each dish**, 6 dishes in all",
        "In each dish paragraph, make the dish name **bold**. The bold goes **inside** the paragraph, around just the name",
        "In the same paragraph, put a short description in **italics**, and color the price using a **span** with a style (**inside** the paragraph, around just the price)",
        "Add a **line break inside** each dish paragraph, between the price line and the description"
      ] }],
    [{ h: "Step 4: Chef's special and notes" },
      { build: [
        "Add two **heading 3** labels, Chef's Special and Good to Know, each with a paragraph under it"
      ] }],
    [{ h: "Step 5: Fonts, colors, and borders (exactly where each style goes)" },
      { build: [
        "**Font family** serif: put it on the **heading 1** and on the **Chef's Special paragraph**",
        "**Font family** sans-serif: put it on the **address paragraph**. **Font family** monospace: put it on the **Good to Know paragraph**",
        "**Text color** and a big **font size in pixels**: put both on the **heading 1**, and give the **Good to Know paragraph** a small size in pixels",
        "**Background color**: put it on the **body** tag and on the **heading 1**",
        "**Center** the text: put it on the **address paragraph** and the **Chef's Special heading 3**",
        "**Uppercase** letters: put it on **each section heading** (the heading 2s)",
        "**Border** (thickness, style, and color, in that order): put it on your favorite **dish paragraph** and on the **Chef's Special paragraph**",
        "Use **named colors** for the colors, at least 2 different ones. Dark backgrounds need light text"
      ] }],
    review("6.3", 6), done(7)
  ]);

  A["6.4"] = make([
    [{ h: "What you are building" },
      { p: "The **ultimate Wanted poster** for an outlaw on the loose: pick **one** of a villain, your pet who stole the snacks, or a made-up criminal. This is a build day: it is the first assignment where **borders** are the star. You type the skeleton yourself, every time. **Checks** counts everything for you." },
      { map: [
        "The skeleton: doctype, html, head, and body (typed by you)",
        "Heading 1: WANTED (solid border, centered, uppercase, serif font, colored, with a background color)",
        "Paragraph: the crimes (sans-serif font, 2 colored words in spans, 1 bold word)",
        "Horizontal line",
        "Heading 2: Description (border on the bottom only), then 2 paragraphs (one monospace, one with a dashed border) with bold words, italic words, and line breaks",
        "Heading 3 (centered): Distinguishing Marks, then a paragraph with a dotted border",
        "Horizontal line",
        "Heading 2 (uppercase, border on the left only): Last Seen, then heading 3: Known Hideouts, then a paragraph with a dashed border",
        "Heading 2: Reward, then a centered paragraph with a solid border and a background color",
        "Last paragraph: a small monospace warning (italics, line break) with a dotted border"
      ] },
      notes("unit-6/borders-notes.html")],
    [{ h: "Step 1: Skeleton, title and heading" }, skeleton("your poster's name")],
    [{ h: "Step 2: Build the page from top to bottom" },
      { build: [
        "Follow the map above. Under the heading 1, add the crime **paragraph**; color **2 different words** using 2 **spans** with a style (each goes **inside** a paragraph, around just those words), and make **1 word bold**",
        "Add a **horizontal line** (**outside** the paragraph), then a **heading 2** and **2 description paragraphs**. Make **2 words bold** and **2 words italic**, and add **2 line breaks inside** the paragraphs",
        "Add a **heading 3**, a paragraph, another **horizontal line**, then two more headings with the last-seen and reward paragraphs, and the warning paragraph at the end"
      ] }],
    [{ h: "Step 3: Borders (new today)" },
      { build: [
        "Use the border shortcut (**thickness, style, and color**, in that order) on **at least 4 different elements**",
        "Use **solid**, **dashed**, and **dotted** borders, **each at least 2 times**",
        "Use a border on **just one side** (like only the bottom or only the left) **at least 2 times**: the same three parts, but written as a one-sided property",
        "Make the borders match the poster: frames for the big things, dashed and dotted for the extras"
      ] }],
    [{ h: "Step 4: Fonts and colors (exactly where each style goes)" },
      { build: [
        "**Font family**: serif on the **heading 1** and the **reward paragraph**, sans-serif on the **crime paragraph** and one **description paragraph**, monospace on the **first description paragraph** and the **last paragraph**",
        "**Center** the text on at least 2 elements and make at least 2 elements **uppercase**",
        "Use a **named color** (like saddlebrown) for text and borders, and a **background color** on the body and the heading 1",
        "Dark backgrounds need light text. Light backgrounds need dark text"
      ] }],
    review("6.4", 5), done(6)
  ]);

  A["6.5"] = make([
    [{ h: "What you are building" },
      { p: "The **ultimate guide page**: a two-section guide about something you know better than anyone. Pick **one** of a game guide, a team guide, or a road trip guide. It has a banner, a menu bar, ranked lists, bullet lists, and a footer. You type the skeleton yourself, every time. **Checks** counts everything for you." },
      { map: [
        "The skeleton: doctype, html, head, and body (typed by you)",
        "Heading 1: your guide's name (a banner: background color, light text, centered, serif, big, a bottom border)",
        "Menu bar: a bullet list of 3 items in a row, with the bullets removed",
        "Tagline paragraph (centered, sans-serif): italics, 2 colored words in spans, and a line break",
        "Horizontal line",
        "Section 1: heading 2 (serif, colored, uppercase, bottom border), a paragraph, a heading 3 with a numbered list, a heading 3 with a bullet list",
        "Horizontal line",
        "Section 2: the same, with a monospace paragraph that has a dashed border, and different list markers",
        "Horizontal line, then a footer paragraph with 2 lines (centered, monospace, small, dotted border)"
      ] },
      notes("unit-6/lists-notes.html")],
    [{ h: "Step 1: Skeleton, title and banner" }, skeleton("your guide's name"),
      { build: ["Style the **heading 1** like a banner: a **background color**, a light **text color**, **centered** text, a big **font size in pixels**, a **serif** font, and a **bottom border**"] }],
    [{ h: "Step 2: Menu bar" },
      { build: [
        "Under the heading 1, add a **bullet list** with **3 list items** (like Countdown, Game Plan, About)",
        "List items stack by default (they are **block**). Turn them into a row by making **each of the 3 list items inline** (put it on every list item)",
        "Remove the bullets: put the list-style setting of **none** on the **bullet list** itself (not on the items)"
      ] }],
    [{ h: "Step 3: Tagline" },
      { build: [
        "Add a **paragraph** with a short tagline and **center** it (put the centering on that paragraph)",
        "**Inside** that paragraph, put a phrase in **italics** and color **2 words**, each with its own **span**",
        "Add a **line break inside** that paragraph, then under it (**outside** it) a **horizontal line**"
      ] }],
    [{ h: "Step 4: Two sections with lists (new today)" },
      { build: [
        "In each section, add a **heading 2** and a **paragraph**, a **heading 3** and a **numbered list** with **3 list items**, and another **heading 3** and a **bullet list** with **3 list items**. Only list items go directly inside a list",
        "Inside each numbered list item, make the name **bold** and the description **italic**",
        "**Marker style:** put a **list-style-type** on every list, and use a **different marker** in each section (like decimal and upper-roman for the numbered lists, square and circle for the bullet lists)",
        "**Background color** and a **border** on at least 2 of the lists",
        "Put a **horizontal line** between the sections (**outside** the lists), then a footer paragraph with a **line break inside** it, centered, monospace, small, and with a dotted border"
      ] }],
    [{ h: "Step 5: Make it look professional" },
      { build: [
        "Use **one palette**: two main colors plus a neutral, as **named colors**, reused across the page",
        "Heading 1 is biggest, heading 2 medium, heading 3 small. Use **serif** on the headings, **sans-serif** on the tagline and first paragraph, and **monospace** on the second paragraph and the footer",
        "Make both heading 2s **uppercase** and give them a **bottom border** (one side only)"
      ] }],
    review("6.5", 6), done(7)
  ]);

  A["6.6"] = make([
    [{ h: "What you are building" },
      { p: "A **link hub**: a one-page website that points people to the best sites about something you love. Pick **one** of games, careers, or music (school-appropriate). It uses your first **style block** to style links and headings. You type the skeleton yourself, every time. **Checks** counts everything for you." },
      { map: [
        "The skeleton, with a style block in the head (link states, heading 1, heading 2, and body rules)",
        "Heading 1: your hub's name (styled by the style block)",
        "Menu bar: a bullet list of 3 same-tab links in a row, bullets removed, with a bottom border",
        "Tagline paragraph: italics, a colored word in a span, and a line break. Then a horizontal line",
        "Heading 2 + a paragraph + heading 3 + a bullet list of 3 links that open in a NEW tab (bold name, a dash, an italic note), with a dashed border",
        "Horizontal line, then heading 2 + heading 3 + a numbered list of 3 links that open in the SAME tab, with a dotted border",
        "Heading 3 (uppercase): My Top 3 Picks, with a numbered list with a dashed border",
        "A small monospace paragraph with a dotted border: a span and a line break",
        "Footer: a list with the bullets removed and the items in a row (your name and class period), monospace, small, with a top border"
      ] },
      notes("unit-6/links-notes.html")],
    [{ h: "Step 1: Skeleton, title and heading" }, skeleton("your hub's name")],
    [{ h: "Step 2: Build the page from top to bottom" },
      { build: [
        "Follow the map above. Under the heading 1 add the menu bar, the tagline paragraph, and a horizontal line",
        "Add the three link sections. In each list item, turn a real website's name into a **link** (use the full address, starting with https://). The link goes **inside** the list item",
        "Make the site's name **bold** (**inside** the link), and after the link, still inside the list item, add a dash and a short note in **italics**"
      ] }],
    [{ h: "Step 3: Links (new today)" },
      { build: [
        "Use **at least 6 links**, with **at least 3 that open in a new tab** and **at least 3 that open in the same tab**",
        "Link text says where the link goes (never \"click here\"). Every link sits inside a **list item** or a **paragraph**"
      ] }],
    [{ h: "Step 4: Link states (your first style block)" },
      { build: [
        "Add a **style block** inside the **head**, under the title (not in the body)",
        "Inside it, write a rule for each link state, in this order: **link, visited, hover, active**",
        "Make **hover** change **two** things: the text color and the background color",
        "Inside a style block there are **no quotes** and you do **not** write the word style"
      ] }],
    [{ h: "Step 5: Style the rest from the head" },
      { build: [
        "In the same style block, add a rule for the **heading 1** tag (a banner look: a text color, a background color, a serif font, a big size in pixels, centered text, and a border)",
        "Add a rule for the **heading 2** tag (a color, a size in pixels, uppercase letters, a serif font) and a rule for the **body** tag (a background color and a sans-serif font)",
        "Use inline styles for the exceptions (the lists, the small paragraph, and the footer) so every earlier style still shows up at least twice"
      ] }],
    review("6.6", 6), done(7, ["Hover over every link. Click a new-tab link and a same-tab link"])
  ]);

  A["6.7"] = make([
    [{ h: "What you are building" },
      { p: "A **photo brochure** with real pictures. Pick **one** of a travel brochure, a pet adoption flyer, or a club recruitment page. You upload your own pictures, change their sizes, and make **every picture a clickable link**. Click **Checks** any time to see your score." },
      { map: [
        "The skeleton, with a style block in the head (link states, heading 1, heading 2, and body rules)",
        "Heading 1 (styled by the style block), then a menu bar: a bullet list of 3 same-tab links in a row, bullets removed",
        "Tagline paragraph: italics, a colored word in a span, and a line break",
        "The main picture: big, with a border and rounded corners, on its own line, opens in a NEW tab",
        "Horizontal line, then heading 2 + a paragraph + heading 3 + 2 more pictures: a small one with rounded corners and a wide one that is a percent wide on its own line",
        "A bullet list of 3 highlights, then a horizontal line",
        "Heading 2 + heading 3 (uppercase) + a numbered list of 3 steps (bold name, italic note) + heading 3 + a numbered list of 3 tips with a dashed border",
        "A small monospace paragraph with a dotted border (a span and a line break), and a footer list in a row"
      ] },
      notes("unit-6/images-notes.html")],
    [{ h: "Step 1: Pick your topic and get 3 pictures" },
      { build: [
        "Pick your topic. Keep it school-appropriate",
        "Take or draw **at least 3 pictures** for it and save them as JPG or PNG files"
      ] }],
    [{ h: "Step 2: Upload your pictures" },
      { build: [
        "Click **Checks** and find **My images**",
        "Upload each picture and wait for it to show up in the list. You need **at least 2** uploaded this way"
      ] }],
    [{ h: "Step 3: Skeleton and the top" }, skeleton("your brochure's name"),
      { build: ["Under the heading 1, add the menu bar and the tagline paragraph from the map"] }],
    [{ h: "Step 4: Pictures (new today)" },
      { build: [
        "Click inside a paragraph (or a list item), then click **Insert** on a picture. The editor writes a picture wrapped in a link for you",
        "Change the placeholder link to a **real website** that starts with https://. **Every** picture is a link. At least one opens in a **new tab** and at least one opens in the **same tab**",
        "Change every **alt** to a real description of the picture",
        "Set a **width in pixels** on the big picture and a **border** (thickness, style, color) and **rounded corners**. Set a **width as a percent** on another picture, and **display: block** so it sits on its own line",
        "Set width **or** height, never both. Use **at least 2 different sizes** on your pictures"
      ] }],
    [{ h: "Step 5: The rest of the page and a style block" },
      { build: [
        "Add the lists, paragraphs, and footer from the map",
        "Add a **style block** inside the **head**, under the title, with at least **2 rules**: a rule for the **heading 1** and a rule for the **body**. Style the link states too, just like you did for the link hub"
      ] }],
    review("6.7", 6), done(7, ["Try a few different widths on the big picture and watch the preview, then set it back"])
  ]);

  /* ----- 7.x shared page plan: every 6.x tool at least twice, then the lesson's own section goes in the middle ----- */
  var BASE_TOP = [
    "The skeleton with a style block in the head (link states, heading 1, heading 2, body)",
    "Heading 1: your site's name, then a menu bar (a bullet list of 3 links in a row, bullets removed)",
    "Tagline paragraph: italics, a colored word in a span, and a line break",
    "Main picture: a big linked picture with a border and rounded corners, on its own line, opens in a new tab",
    "Horizontal line, heading 2 + a paragraph + heading 3, then 2 more linked pictures: a small round one and one that is a percent wide on its own line",
    "A bullet list of 3 (square markers, a border, a margin), then a horizontal line"
  ];
  var BASE_END = [
    "Heading 2 + heading 3 (uppercase) + a numbered list of 3 (bold name, italic note, hex background color)",
    "Heading 3 + a numbered list of 3 with upper-roman markers and a dashed border",
    "A small monospace paragraph with a dotted border and a margin (a span and a line break), then a footer list in a row"
  ];
  function plan7(middle) { return BASE_TOP.concat(middle, BASE_END); }
  var STEP_BASE = [{ h: "Step 3: Build the rest of the page" },
    { build: [
      "Add the menu bar, tagline, pictures, lists, and footer from the map. Use **Insert** (Checks, then My images) for the pictures, and make **every picture a link**",
      "Every list has **3 items**, and only list items go directly inside a list. Every link starts with **https://**",
      "Set the style block rules for the **link states**, the **heading 1** (a banner), the **heading 2**, and the **body**"
    ] }];

  A["7.1"] = make([
    [{ h: "What you are building" },
      { p: "A page of **postcards** from a trip: pick **one** of around the world, national parks, or a beach vacation. Each postcard is a box, and you use the **box model** (padding, border, margin) to frame it. Your page also uses every tool you already know at least twice. Click **Checks** any time to see your score." },
      { map: plan7(["Heading 2: My Postcards, then **three postcard paragraphs**, each framed with padding, a border (solid, dashed, dotted), and a margin"]) },
      notes("unit-7/box-model-notes.html")],
    [{ h: "Step 1: Skeleton" }, skeleton("your trip's name")],
    [{ h: "Step 2: Three postcards (new today)" },
      { build: [
        "Add **three paragraphs**, each one a postcard from a different place. Say what you saw, ate, or did. Make the place name **bold**, put a sentence in **italics**, color a word with a **span**, and add a **line break**",
        "In the **style attribute of each postcard**, add **padding**, a **border**, and a **margin**. Every postcard must have all three",
        "Give the borders real styles: **solid** on the first, **dashed** on the second, **dotted** on the third",
        "Try changing just **one side** (like only the top padding or only the left margin)"
      ] }],
    STEP_BASE, review("7.1", 4), done(5)
  ]);

  A["7.2"] = make([
    [{ h: "What you are building" },
      { p: "A **mood board**: a page that uses a palette of colors to create a vibe. Pick **one** of a spooky night, a beach day, a neon city, or a cozy cabin. Hex reminder: a **#** and then 6 characters in three pairs: red, green, blue. Each pair goes from 00 (none) to FF (the most)." },
      { map: plan7(["Heading 2: Color Palette, then **5 swatch paragraphs**: the first uses a **named color**, **at least 3 use hex codes**, and the first 2 are framed with padding, a border, and a margin"]) },
      notes("unit-7/colors-notes.html")],
    [{ h: "Step 1: Skeleton" }, skeleton("your mood's name")],
    [{ h: "Step 2: Color swatches (new today)" },
      { build: [
        "Add **5 paragraphs**. Each one is a swatch: the color's name or code and a word for the feeling",
        "In the **style attribute of each swatch**, put a **background color** and a **text color** that is easy to read on it",
        "Use a **named color** (like tomato, navy, or teal) for the first swatch and **hex codes** for at least 3 others",
        "Make the color's name **bold** and the feeling word **italic**, with a **line break** between them"
      ] },
      { build: ["Every hex code starts with **#** and has **3 or 6** characters, using only 0 to 9 and A to F. Search for a color picker online if you need help finding codes"] }],
    STEP_BASE, review("7.2", 4), done(5)
  ]);

  A["7.3"] = make([
    [{ h: "What you are building" },
      { p: "The home screen of your own **streaming app**: pick **one** of movies, music, or games. A menu bar of buttons in a row and one giant PLAY button, all with the **display** property." },
      { map: plan7(["Heading 2: Home, then a **menu bar of 4 links** side by side (each link is `display: inline-block` with a width, a background color, and centered text)", "Heading 3: Featured Tonight, a paragraph (bold title, italic tagline, a NEW badge in a span, a line break), and a **giant PLAY link** with `display: block`"]) },
      notes("unit-7/display-notes.html")],
    [{ h: "Step 1: Skeleton" }, skeleton("your app's name")],
    [{ h: "Step 2: The menu bar and the PLAY button (new today)" },
      { build: [
        "Add **4 links** (like Home, Movies, Library, Friends) inside one paragraph. In the **style attribute of each link**, set **display** to **inline-block** so they sit side by side, and add a **width**, a **background color**, and **centered text**",
        "Use a **named color** for one link's background and a **hex code** for another's, and give one link a **border**",
        "Add a giant **PLAY link** to a real website. In its own style attribute, set **display** to **block** so it fills the row, and add a **background color**"
      ] }],
    STEP_BASE, review("7.3", 4), done(5)
  ]);

  A["7.4"] = make([
    [{ h: "What you are building" },
      { p: "A **profile page**: pick **one** of a character, a pet, or a made-up celebrity. A sidebar on the left and a feed of posts on the right, built from **divs**." },
      { map: plan7(["Heading 2: Profile, then **two divs side by side**: a sidebar (30% wide: a heading 3, facts, a quote, a bullet list) and a feed (65% wide: posts and a numbered list with a link)"]) },
      notes("unit-7/div-tag-notes.html")],
    [{ h: "Step 1: Skeleton" }, skeleton("your profile's name")],
    [{ h: "Step 2: Two columns (new today)" },
      { build: [
        "Add a **sidebar div** and then, right after it, a **feed div**. Put real content **inside** each: the sidebar gets a **heading 3**, a few **paragraphs** of facts, and a **bullet list** of interests. The feed gets three short **paragraphs** (posts) and a **numbered list** of your top 3 with one **link**",
        "In the **style attribute of the sidebar div**: set **display** to **inline-block**, **vertical-align** to **top**, and a **percent width** of about 30%",
        "In the **feed div**: the same **display** and **vertical-align**, and a **percent width** of about 65%. The two widths together must be **98% or less**",
        "In each div, add **padding** and a **background color**: use a **named color** for the sidebar and a **hex code** for the feed. Give the sidebar a **border** too"
      ] }],
    STEP_BASE, review("7.4", 4), done(5)
  ]);

  A["7.5"] = make([
    [{ h: "What you are building" },
      { p: "A **leaderboard**: pick **one** of your favorite game, a sport, or a competition you invent, built as a **table**." },
      { map: plan7(["Heading 2: the leaderboard's name, then a **table** with a header row and 5 data rows", "Heading 3: Rules and Prizes, then **two divs side by side** (45% wide each, inline-block, vertical-align top, with padding and borders)"]) },
      notes("unit-7/tables-notes.html")],
    [{ h: "Step 1: Skeleton" }, skeleton("your leaderboard's name")],
    [{ h: "Step 2: Build the table one row at a time (new today)" },
      { build: [
        "Add a **table** under the heading 2",
        "Row 1 is the header row: one **header cell** for each column (like Rank, Player, Score). Use at least 4 columns",
        "Then add **at least 2 data rows** (aim for 5), each with one **data cell** per column",
        "Only rows go directly inside the table, and only cells go directly inside a row. **Every row** must have the same number of cells"
      ] }],
    [{ h: "Step 3: Two boxes side by side" },
      { build: [
        "Add two **divs** side by side (**inline-block**, **vertical-align top**, percent widths that add to 98% or less) with a heading 3 and a paragraph in each: one for the rules and one for the prizes"
      ] }],
    STEP_BASE.map(function (b) { return b.h ? { h: "Step 4: Build the rest of the page" } : b; }), review("7.5", 5), done(6)
  ]);

  A["7.6"] = make([
    [{ h: "Unit test website" },
      { p: "Your teacher gives the exact requirements on test day. Your site must show everything from 3.1 through 3.12, at least **2 times each**. The **Concepts** tab lists them all. Your teacher will tell you where to take the multiple choice test." }],
    [{ h: "Step 1: Skeleton" }, skeleton("your website's name")],
    [{ h: "Step 2: Show every skill" },
      { build: [
        "Build a real website of your own choice: headings, paragraphs, lists, links, pictures, boxes, columns, and a table",
        "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
      ] }],
    done(3)
  ]);

  /* ======================================================================= 8.x: external CSS ===== */
  var SITE_MAP = [
    "index.html: the skeleton with the style.css link in the head, then heading 1 (id banner), a menu bar (a bullet list of 3 links), and a tagline paragraph (italics, a span, a line break)",
    "A big linked picture, a horizontal line, heading 2 + a paragraph + heading 3, then 2 more linked pictures and a bullet list of 3",
    "A horizontal line, heading 2 + heading 3 + a numbered list of 3 (bold name, italic note), heading 3 + a numbered list of 3, and a small monospace paragraph (a span and a line break)",
    "Two boxes side by side (divs) with a heading 3 and a paragraph in each, then two small tables (a header row and 3 data rows)",
    "A footer: a list in a row with your name and class period",
    "style.css: every look comes from rules in this file, with no style attributes in the HTML"
  ];
  function cssSteps(first, title) {
    return [{ h: "Step 1: Start a brand-new site" },
      { build: [
        "This is a **new website**, not your last one. Click the **index.html** tab and type the **skeleton**: doctype, html, head, body, a **title** with " + title + ", and one **heading 1**",
        "Click the **style.css** tab. All of today's styling goes there, not in the page. In the **head** of index.html, add a **link** to your CSS file, which is named **style.css**"
      ] },
      { h: "Step 2: Build the page (index.html)" },
      { build: [
        "Follow the map above. Write **real content** about your topic. Use **no style attributes** (at most 2): the styling comes from style.css",
        "Every list has **3 items**, every picture is a **link** with a real **alt**, and every link starts with **https://**. Use **Insert** (Checks, then My images) to add pictures"
      ] }];
  }
  var CSS_STYLE_STEP = function (n) { return [{ h: "Step " + n + ": Style it in style.css" },
    { build: [
      "Write **tag rules** for body, the headings, p, hr, a, table, th, and td. Remember: **no style tags** and **no quotes** around values in a CSS file",
      "Every property you already know (colors, sizes, fonts, borders, list markers, padding, margin, widths, display, and vertical-align) goes into **style.css**, each at least **twice**",
      "Use **named colors** and **hex codes**, and every font family (serif, sans-serif, monospace) at least twice"
    ] }]; };

  A["8.1"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with its own **style.css** file. Pick **one** of a robotics club, a pizza shop, or a gaming channel. You will style it with **tag rules** and **classes**." },
      { map: SITE_MAP }, notes("unit-8/external-css-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Classes (new today)" },
      { build: [
        "Give **at least 2 elements** a **class** with a name you make up (like highlight or mono). Different elements can share a class",
        "In **style.css**, write a rule for **each** class. A class rule starts with a **dot** before the name. Check the preview: only the elements with the class change"
      ] }],
    review("8.1", 5), done(6)
  ]);

  A["8.2"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that styles single elements by **id**. Pick **one** of an animal shelter, a fitness gym, or a bookstore." },
      { map: SITE_MAP.concat(["Two elements have an id: the heading 1 and one of the tables"]) }, notes("unit-8/css-id-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Ids and classes" },
      { build: [
        "Give **at least 2 elements** an **id**, each with a different name you make up (like banner and signup). Use each id name only **once** on the page",
        "In **style.css**, write a rule for **each** id. An id rule starts with a **#** before the name. Give each id rule a few properties",
        "Keep using **classes** on at least 2 more elements, with a dot rule for each one"
      ] }],
    review("8.2", 5), done(6)
  ]);

  A["8.3"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that shows **specificity**: a class rule beats a tag rule, and one element can wear **two classes at once**. Pick **one** of a bike shop, a band, or a science center." },
      { map: SITE_MAP.concat(["Two paragraphs each wear two classes, and two combined selectors in style.css"]) }, notes("unit-8/specificity-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Specificity (new today)" },
      { build: [
        "Make sure style.css has a rule for the **paragraph** tag that sets a **text color**. Give one paragraph a **class** and write a class rule that sets a **different text color**. The class wins because it is more specific than a tag",
        "Give **2 different paragraphs** **two class names each** in the same class attribute, separated by a space. Write a rule for **each** of those classes",
        "Write **2 combined selectors**: a tag stuck to a class (like p.tip) and one tag inside another (like ul li). Keep using **ids** on at least 2 elements"
      ] }],
    review("8.3", 5), done(6)
  ]);

  A["8.4"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with smooth **hover effects**. Pick **one** of a robotics club, a fitness gym, or a band." },
      { map: SITE_MAP.concat(["Links and table cells react to the mouse with a smooth transition"]) }, notes("unit-8/hover-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Hover effects (new today)" },
      { build: [
        "Write **2 hover rules** (a tag name, a colon, and the word hover): one for the **links** and one for something else, like **table cells** or a button. Each one changes at least **2 things**, like the background color and the text color",
        "Add a **transition** to the **normal rule** (not the hover rule) of **both** elements, so changes animate smoothly in and out. Move your mouse over each one in the preview",
        "Keep your **classes**, **ids**, and **combined selectors** from earlier lessons in the file"
      ] }],
    review("8.4", 5), done(6, ["Move your mouse over it in the preview. The change should be smooth, not instant"])
  ]);

  A["8.5"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that uses **flexbox**. Pick **one** of a pizza shop, a bookstore, or a science center." },
      { map: SITE_MAP.concat(["Two sections are flex containers: the menu bar and a row of 3 stat boxes"]) }, notes("unit-8/flexbox-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Flexbox (new today)" },
      { build: [
        "Make **2 different sections** into **flex containers**: your menu bar, and a new div that holds 3 short paragraphs (like facts or stats). Give the div a **class**",
        "In **each** flex rule (a class or id, not the body), set **display** to **flex**, then add **justify-content** (try space-between or center) and **align-items** (try center)",
        "Watch the preview as you try different values. Keep your **hover effects** from earlier lessons too"
      ] }],
    review("8.5", 5), done(6)
  ]);

  A["8.6"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that uses a **grid**. Pick **one** of a gaming channel, an animal shelter, or a bike shop." },
      { map: SITE_MAP.concat(["Two sections are grids: a photo gallery of 3 pictures and a facts section of 4 boxes"]) }, notes("unit-8/grid-notes.html")],
    cssSteps(0, "your site's name"),
    CSS_STYLE_STEP(3),
    [{ h: "Step 4: Grids (new today)" },
      { build: [
        "Make **2 different sections** into **grids**: a gallery div that holds 3 linked pictures, and a facts div that holds 4 short paragraphs. Give each div a **class**",
        "In **each** grid rule, set **display** to **grid**, add **grid-template-columns** to make 2 or 3 columns, and add a **gap**",
        "Keep your **flexbox** menu and stats row, and your hover effects, from earlier lessons"
      ] }],
    review("8.6", 5), done(6)
  ]);

  A["8.7"] = make([
    [{ h: "Unit test website" },
      { p: "Your teacher gives the exact requirements on test day. Your site must show everything from this unit, and every earlier tool, at least **2 times each**. The **Concepts** tab lists them all." }],
    [{ h: "Step 1: Start a brand-new site" },
      { build: ["Type the **skeleton** in index.html and link **style.css** in the head. All styling goes in style.css"] }],
    [{ h: "Step 2: Show every skill" },
      { build: [
        "Build a real website of your own choice. Show **tag rules**, **classes** (including two on one element), **ids**, **combined selectors**, **hover effects with transitions**, **two flexbox sections**, and **two grids**",
        "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
      ] }],
    done(3)
  ]);

  /* ======================================================================= 9.x: Bootstrap ===== */
  var BOOT_NOTE = { p: "Bootstrap adds a ready-made stylesheet. Your own **style.css** still comes after it, and every style from earlier lessons still shows up at least twice in your own file." };
  function bootSteps(what) {
    return [{ h: "Step 1: Start a brand-new site" },
      { build: [
        "This is a **new website**, not your last one. In index.html type the **skeleton** with a **title** (" + what + ") and one **heading 1**, and link **style.css** in the head",
        "Go to **getbootstrap.com**, open **Getting Started**, and find the official **CSS link** (a full https:// address). Add it **inside the head**, **above** the link to your own style.css so your styles still win"
      ] },
      { h: "Step 2: Build the page and style.css" },
      { build: [
        "Follow the map above. Build the page the way you did in unit 4: tag rules, classes, ids, hover effects, **two flexbox sections**, and **two grids**, all in **style.css**",
        "Use **no style attributes** (at most 2). Every picture is a **link** with a real **alt**, and every link starts with **https://**"
      ] }];
  }
  var BOOT_MAP = SITE_MAP.concat(["Bootstrap section(s) at the bottom, inside a container"]);

  A["9.1"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that loads **Bootstrap**, a giant ready-made stylesheet. Pick **one** of an animal shelter, a band, or a robotics club." },
      { map: BOOT_MAP }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: See the change (new today)" },
      { build: ["Look at the preview: your text and spacing change even before you add any Bootstrap classes", "Nothing changed? Check the head first. The Bootstrap link must be inside it"] }],
    review("9.1", 4), done(5)
  ]);

  A["9.2"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website that uses Bootstrap's **grid**. Pick **one** of a fitness gym, a science center, or a pizza shop." },
      { map: BOOT_MAP.concat(["A container with 2 rows, and each row has 2 columns with a heading 2 and a paragraph"]) }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: The grid (new today)" },
      { build: [
        "In index.html, add a **div** with Bootstrap's **container** class near the bottom of the body",
        "**Inside the container**, add **2 divs** with the **row** class. **Inside each row div**, add **2 divs** with a **col** class. Put a **heading 2** and a **paragraph** inside each column",
        "Make the preview narrower and wider to watch the columns"
      ] }],
    review("9.2", 4), done(5)
  ]);

  A["9.3"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with Bootstrap **utility classes** and **buttons**. Pick **one** of a bookstore, a bike shop, or a gaming channel." },
      { map: BOOT_MAP.concat(["The container's columns use text color, background, and bold classes, and 2 buttons"]) }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: Utility classes and buttons (new today)" },
      { build: [
        "In your container grid (2 rows of 2 columns), put a Bootstrap **text color** class on **2 headings** (like a primary text color), a **background color** class on one column's paragraph (like a light background), and a **bold** class on a heading",
        "In **2 different columns**, add a **link** to a real website (starting with https://) and give each link Bootstrap's **btn** class **plus** a style class (like the primary button style)"
      ] }],
    review("9.3", 4), done(5)
  ]);

  A["9.4"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with a Bootstrap **navbar** across the top. Pick **one** of a robotics club, a bookstore, or a band." },
      { map: BOOT_MAP.concat(["A navbar at the very top of the body with the site's name and 3 links"]) }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: The navbar (new today)" },
      { build: [
        "At the very **top of the body**, add a **nav** tag with Bootstrap's **navbar** class, plus a color class like a dark or light background",
        "**Inside the nav**, add a **link** with the **navbar-brand** class that shows your site's name, and at least **3 links** with the **nav-link** class. Give each one a real page name (like Home, About, Contact) and a full https:// address",
        "Keep the container, the utility classes, and the buttons from 9.3 on the page too"
      ] }],
    review("9.4", 4), done(5)
  ]);

  A["9.5"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with a row of Bootstrap **cards**. Pick **one** of a pizza shop, an animal shelter, or a science center." },
      { map: BOOT_MAP.concat(["A row of 3 cards, each with a linked image, a title, text, and a button"]) }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: Cards (new today)" },
      { build: [
        "Add a **div** with the **row** class. **Inside the row**, add 3 **divs** with a **col** class, and **inside each column** add a **div** with the **card** class",
        "**Inside each card**, add in this order: an **image** with the **card-img-top** class (wrapped in a link), then a **div** with the **card-body** class",
        "**Inside the card-body**, add a **heading** with the **card-title** class, a **paragraph** with the **card-text** class, and a **link** with the **btn** class plus a button style",
        "Keep the navbar, the container grid, and the buttons from earlier on the page too"
      ] }],
    review("9.5", 4), done(5)
  ]);

  A["9.6"] = make([
    [{ h: "What you are building" },
      { p: "A brand-new website with a Bootstrap **form**. Pick **one** of a gaming channel, a fitness gym, or a bike shop." },
      { map: BOOT_MAP.concat(["A sign-up form with 2 labeled fields and a submit button"]) }, BOOT_NOTE],
    bootSteps("your site's name"),
    [{ h: "Step 3: The form (new today)" },
      { build: [
        "Under your cards, add a **form** tag",
        "**Inside the form**, add at least **2 fields**. For each field: a **label** with the **form-label** class, then an **input** with the **form-control** class (for example a Name field and an Email field)",
        "At the **bottom of the form** (inside it), add a **button** with type submit and Bootstrap's **btn** class plus a button style",
        "Keep the navbar, the cards, the grid, and the buttons from earlier on the page too"
      ] }],
    review("9.6", 4), done(5)
  ]);

  A["9.7"] = make([
    [{ h: "Unit test website" },
      { p: "Your teacher gives the exact requirements on test day. Your page must show everything from this unit, and every earlier tool, at least **2 times each**. The **Concepts** tab lists them all." }],
    [{ h: "Step 1: Start a brand-new site" },
      { build: ["Type the **skeleton** in index.html, add the **Bootstrap link** above your own style.css link inside the head"] }],
    [{ h: "Step 2: Show every skill" },
      { build: [
        "A **navbar** at the top with a brand and at least 3 nav links, a **grid** (container, rows, and columns), **cards** with images, titles, text, and buttons, and a **form** with 2 labeled fields and a submit button",
        "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
      ] }],
    done(3)
  ]);
})(typeof window !== "undefined" ? window : globalThis);
