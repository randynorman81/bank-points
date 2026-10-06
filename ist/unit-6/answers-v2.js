/* "Assignment" tab steps for lessons 6.2 through 9.7 (the first lesson, 6.1, lives in answers-early.js).
   EVERY assignment is a brand-new website: nothing is copied from an earlier lesson. Each one also uses at least 2 examples of
   every tag, style, attribute, and value taught before it (concepts.js lists them, html-check.js checks them).
   The steps go top to bottom, in the order the page is built. Each says WHAT to add, WHERE it goes, and HOW to style it.
   Every theme option for a lesson uses the SAME steps. No exact code is given: only tag names, properties, and what they do. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  /* S(title, bullets) is one numbered step. build() numbers the steps in order. */
  function S(title, bullets) { return { step: title, build: bullets }; }
  function build(list) {
    var out = [], n = 0;
    list.forEach(function (it) {
      if (it.step) { n++; out.push({ h: "Step " + n + ": " + it.step }); out.push({ build: it.build }); }
      else out.push(it);
    });
    return out;
  }
  function notes(url) { return { p: "Stuck? Read the notes: schscomputerscience.com/ist/" + url }; }
  function head(what, themes, note) { return [{ h: "What you are building" }, { p: what + " Pick **one**: " + themes + ". Click **Checks** any time to see your score. The **Concepts** tab lists every tag and style this page needs." }, note].filter(Boolean); }
  var RULE = { p: "**Every theme uses these same steps.** Use **named colors** (like navy or tomato) unless a step says hex. Dark backgrounds need light text. Each step says the least you must add: you can ALWAYS add more." };
  function skeleton(extra) {
    return S("Skeleton and title", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your page's name"
    ].concat(extra || []));
  }
  function done(extra) {
    return S("Test and submit", (extra || []).concat([
      "Click **Checks**. Fix every red line. The **Use everything you already know** list has to turn green too: for each red item, add one more use of it where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ]));
  }

  /* ======================================================================= 6.2 ===== */
  A["6.2"] = build([].concat(head("An **epic poster** for the biggest event of the year.", "a band's world tour, a movie premiere, an esports tournament, or a made-up holiday", notes("unit-6/style-attribute-notes.html")), [RULE,
    { p: "Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with the property and value **inside** the quotes and a semicolon after each." },
    S("Skeleton and title", ["Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)", "Inside the head, add a **title** with your poster's name", "On the **body** tag, add a style: **background-color** (a named color, like black or navy)"]),
    S("The name and tagline", [
      "Inside the body, add **one heading 1** with the event's name. Style it: **color** (a bright named color), **font-size** in pixels (like 58px), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** with a short tagline. Style it: **color** (a second named color), **text-transform** uppercase, **text-align** center, and **font-size** 24px"
    ]),
    S("When and where", [
      "Add a **heading 3** that says When, with a **color** style. Under it, add a **paragraph** with the date and time. Style the paragraph: **color** (light on a dark background), **font-size** 20px, and a **background-color** (a named color)",
      "Add a **heading 3** that says Where, with a **color** style. Under it, add a **paragraph** with the place. Style it: **color** and **font-size** 20px"
    ]),
    S("Tickets and a finishing touch", [
      "Add a second **heading 2** that says Tickets. Style it: **color**, **text-transform** uppercase, and **text-align** center",
      "Under it, add a **paragraph** about how to get tickets. Style it: **color**, **font-size** 20px, **text-align** center, and a **border** (thickness, style, and color in that order, like 5px solid gold)",
      "Add one last **paragraph** with a fun fact or a warning. Style it: **color**, **font-size** 16px, and a **border** with a different style (like 3px dashed)"
    ]),
    done()]));

  /* ======================================================================= 6.3 ===== */
  A["6.3"] = build([].concat(head("The **menu** for your dream restaurant.", "a taco truck, a bakery, or a cafe in space", notes("unit-6/editing-tags-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color) and **color** (a dark named color for the text)"]),
    S("The name, address, and a line", [
      "Add **one heading 1** with the restaurant's name. Style it: **font-family** with a serif font (like Georgia, serif), **color** (a named color), **font-size** 44px, **text-align** center, and a **background-color** (a named color)",
      "Under it, add a **paragraph** with your address, a **line break** inside it, and your hours on the second line. Style it: **font-family** with a sans-serif font (like Verdana, sans-serif), **text-align** center, and **font-size** 16px",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Three menu sections", [
      "Add a **heading 2** that says Starters. Style it: **text-transform** uppercase and **color** (a named color)",
      "Under it, add **2 dish paragraphs**. In each one: make the dish name **bold**, then a dash, then the price inside a **span** with a **color** style, then a **line break**, then the description in **italics**. Everything goes **inside** the paragraph",
      "Add a **horizontal line**, then a **heading 2** that says Main Dishes (same style) and **2 more dish paragraphs**. Give the **first** of these a **border** (thickness, style, color) so it stands out as today's special",
      "Add a **horizontal line**, then a **heading 2** that says Desserts (same style) and **2 more dish paragraphs**"
    ]),
    S("Chef's special and notes", [
      "Add a **heading 3** that says Chef's Special. Style it: **text-align** center and **color**. Under it, add a **paragraph** about the special. Style it: a **border** with a dashed style (like 3px dashed navy) and **font-family** serif",
      "Add a **heading 3** that says Good to Know, with a **color** style. Under it, add a **paragraph** on two lines (use a **line break** inside). Style it: **font-family** with a monospace font (like 'Courier New', monospace), **font-size** 14px, and a **background-color**"
    ]),
    done()]));

  /* ======================================================================= 6.4 ===== */
  A["6.4"] = build([].concat(head("The **ultimate Wanted poster** for an outlaw on the loose.", "a villain, your pet who stole the snacks, or a made-up criminal", notes("unit-6/borders-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color, like wheat)"]),
    S("The banner and the crimes", [
      "Add **one heading 1** that says WANTED. Style it: **font-family** serif, **color** (a named color), **background-color** (a named color), **font-size** 56px, **text-align** center, **text-transform** uppercase, and a **solid border** (like 6px solid saddlebrown)",
      "Under it, add a **paragraph** listing the crimes. Style it: **font-family** sans-serif and **font-size** 20px. **Inside** it, color **2 phrases** with 2 **spans** (each with a **color** style) and make **1 phrase bold**",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("The description", [
      "Add a **heading 2** that says Description. Style it: **color**, **font-size** 30px, and a border on the **bottom only** (like 4px solid saddlebrown)",
      "Under it, add a **paragraph** of 3 short lines. Style it: **font-family** monospace. **Inside** it, make **1 word bold**, **1 word italic**, and add **2 line breaks** between the lines",
      "Add a second **paragraph** of 2 lines. Style it: **font-family** sans-serif and a **dashed border** (like 3px dashed). **Inside** it, make **1 word italic**, **1 word bold**, and add **1 line break**"
    ]),
    S("Distinguishing marks and last seen", [
      "Add a **heading 3** that says Distinguishing Marks. Style it: **text-align** center and **color** (a named color). Under it, add a **paragraph**. Style it: **font-family** monospace and a **dotted border** (like 3px dotted)",
      "Add a **horizontal line**. Then add a **heading 2** that says Last Seen. Style it: **text-transform** uppercase, **color**, and a border on the **left only** (like 8px solid firebrick)",
      "Under it, add a **heading 3** that says Known Hideouts with a **color** and **font-size** 22px. Under that, add a **paragraph** with a **dashed border** in a different color"
    ]),
    S("The reward and a warning", [
      "Add a **heading 2** that says Reward, with a **color** style. Under it, add a **paragraph** with the reward amount **in bold**. Style it: **background-color**, a **solid border** (like 4px solid), **text-align** center, **font-family** serif, and **font-size** 24px",
      "Add one last small **paragraph**: a warning in **italics**, a **line break**, and a phone number. Style it: **font-family** monospace, **font-size** 13px, **text-align** center, and a **dotted border**"
    ]),
    done()]));

  /* ======================================================================= 6.5 ===== */
  A["6.5"] = build([].concat(head("The **ultimate guide page**: a two-section guide about something you know better than anyone.", "a game guide, a team guide, or a road trip guide", notes("unit-6/lists-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
    S("The banner and menu bar", [
      "Add **one heading 1** with your guide's name. Style it like a banner: **background-color** (a dark named color), **color** white, **text-align** center, **font-family** serif, **font-size** 36px, and a border on the **bottom only** (like 5px solid)",
      "Under it, add a **bullet list** with **3 list items** (like Countdown, Game Plan, About). Style the **bullet list**: **list-style-type** none (this removes the bullets), **background-color** (a dark named color), and **text-align** center",
      "List items stack by default, so turn them into a row: on **each of the 3 list items**, set **display** to inline and **color** to white"
    ]),
    S("The tagline", [
      "Add a **paragraph** with a short tagline. Style it: **text-align** center and **font-family** sans-serif. **Inside** it, put a phrase in **italics**, color **2 words** with 2 **spans** (each with a **color** style), and add a **line break** with a second line after it",
      "Under it (**outside** it), add a **horizontal line**"
    ]),
    S("Section 1: a ranking", [
      "Add a **heading 2** with a title. Style it: **font-family** serif, **color**, **text-transform** uppercase, **font-size** 26px, and a border on the **bottom only** (like 3px solid)",
      "Under it, add a **paragraph** (**font-family** sans-serif), then a **heading 3** and a **numbered list** with **3 list items**. In each item, make the name **bold**, add a dash, and write the description in **italics**. Style the numbered list: **list-style-type** decimal, a **background-color**, and a **solid border** (like 2px solid)",
      "Add another **heading 3** (with a **color** style) and a **bullet list** with **3 list items**. Style it: **list-style-type** square, a **background-color**, and a **dashed border**",
      "Add a **horizontal line**"
    ]),
    S("Section 2: more tips", [
      "Add a second **heading 2** (same style as the first), then a **paragraph**. Style this paragraph: **font-family** monospace and a **dashed border**",
      "Add a **heading 3** and a **numbered list** of 3 (bold name, dash, italic description). Style it: **list-style-type** upper-roman, a **background-color**, and a **dotted border**",
      "Add a **heading 3** (with a **color**) and a **bullet list** of 3. Style it: **list-style-type** circle, a **background-color**, and a **solid border**"
    ]),
    S("The footer", [
      "Add a **horizontal line**, then a **paragraph** on two lines (use a **line break** inside): your name and your class period. Style it: **text-align** center, **font-family** monospace, **font-size** 13px, and a **dotted border**"
    ]),
    done()]));

  /* ======================================================================= 6.6 ===== */
  A["6.6"] = build([].concat(head("A **link hub**: a one-page website that points people to the best sites about something you love.", "games, careers, or music (school-appropriate)", notes("unit-6/links-notes.html")), [RULE,
    S("Skeleton, title, and your first style block", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first). Inside the head, add a **title** with your hub's name",
      "Under the title, still inside the head, add a **style block**. Inside it there are **no quotes** and you do **not** write the word style. Write these rules, in this order: **a:link** (a text **color**), **a:visited** (a text color), **a:hover** (change **two** things: text **color** and **background-color**), then **a:active** (a text color)",
      "In the same style block, add a rule for **h1**: **color** white, **background-color**, **font-family** serif, **font-size** 38px, **text-align** center, and a **solid border** (like 4px solid)",
      "Add a rule for **h2**: **color**, **font-size** 26px, **text-transform** uppercase, and **font-family** serif. Add a rule for **body**: **background-color** (a light named color) and **font-family** sans-serif"
    ]),
    S("Banner, menu bar, and tagline", [
      "Inside the body, add **one heading 1** with your hub's name. The style block already styles it",
      "Under it, add a **bullet list** with **3 list items**. In each item, add a **link** (a full address starting with https://) that opens in the **same tab**. Style the **bullet list**: **list-style-type** none, **text-align** center, and a border on the **bottom only** (like 3px solid). Style **each list item**: **display** inline",
      "Add a **paragraph** (**text-align** center): a phrase in **italics**, **one word** colored with a **span**, and a **line break** with a second line. Then add a **horizontal line**"
    ]),
    S("Links that open in a new tab", [
      "Add a **heading 2** (like Play) and a **paragraph** (**font-family** sans-serif) about the sites below. Then add a **heading 3** and a **bullet list** with **3 list items**. Style the list: **list-style-type** square and a **dashed border**",
      "In each item, add a **link** to a real site that opens in a **new tab**. Make the site's name **bold** (**inside** the link), then add a dash and a short note in **italics**. Link text says where it goes (never \"click here\")",
      "Add a **horizontal line**"
    ]),
    S("Links that open in the same tab", [
      "Add another **heading 2** (like Learn) and a **heading 3**, then a **numbered list** with **3 list items**. Style it: **list-style-type** upper-roman and a **dotted border**",
      "In each item, add a **link** to a real site that opens in the **same tab**, with the name in **bold** and a dash and an **italic** note"
    ]),
    S("Top picks, a note, and the footer", [
      "Add a **heading 3** that says My Top 3 Picks. Style it: **color** and **text-transform** uppercase. Under it, add a **numbered list** of 3 (bold name, dash, italic note). Style it: **list-style-type** decimal, a **background-color**, and a **dashed border**",
      "Add a **paragraph** with a tip: a **span** (**color** style) for the first words, a **line break**, and the rest. Style it: **font-family** monospace, **font-size** 14px, and a **dotted border**",
      "Finish with a **bullet list** of 3 items (your name, a bar, your class period). Style it: **list-style-type** none, **text-align** center, **font-family** monospace, **font-size** 14px, and a border on the **top only**. Style **each list item**: **display** inline"
    ]),
    done(["Hover over every link. Click a new-tab link and a same-tab link"])]));

  /* ----- the pictures steps shared by 6.7 and the 7.x lessons ----- */
  /* every picture in every lesson is inserted the same way */
  function pictureSteps(adv, styleBlock) {
    return [
      S("The main picture", [
        "Add a **paragraph**. Click inside it, then click **Insert** on your first picture (Checks, then My images). The editor writes the picture wrapped in a link for you. Change that link to a **real website** (a full address starting with https://) and change the **alt** to a real description of the picture. Do the same for **every** picture you add. Make this first link open in a **new tab**",
        "Style the **picture**: **width** 320px, a **solid border** (like 5px solid), **border-radius** 12px, and **display** block"
      ]),
      S("An intro section with two more pictures", [
        "Add a **horizontal line** (under the main picture), then a **heading 2**" + (styleBlock ? " (the style block already styles it)" : ". Style it: **color**, **font-size** 26px, **text-transform** uppercase, **font-family** serif, and a border on the **bottom only**") + ". Under it, add a **paragraph** (**font-family** sans-serif) about your topic, then a **heading 3** that says Photos",
        "Add a **paragraph** and **Insert** your second picture inside it (real https:// link, real alt). This link opens in the **same tab**. Style the picture: **width** 25%, **border-radius** 50%, and a **dashed border** (like 3px dashed)",
        "Add another **paragraph** and **Insert** your third picture inside it (real link, real alt). This link opens in a **new tab**. Style the picture: **width** 45%, **display** block, and a **dotted border** (like 3px dotted)",
        "Add a **bullet list** with **3 list items**. Style it: **list-style-type** square, a **solid border**" + (adv ? " in a **hex** gray (like 2px solid #666666), and a **margin** (like 14px 30px)" : " (like 2px solid)"),
        "Under the list, add a **horizontal line**"
      ])
    ];
  }

  /* ======================================================================= 6.7 ===== */
  A["6.7"] = build([].concat(head("A **photo brochure** with real pictures. You upload your own pictures, change their sizes, and make **every picture a clickable link**.", "a travel brochure, a pet adoption flyer, or a club recruitment page", notes("unit-6/images-notes.html")), [RULE,
    S("Get and upload 3 pictures", [
      "Take or draw **at least 3 pictures** for your topic (school-appropriate) and save them as JPG or PNG files",
      "Click **Checks**, find **My images**, and upload each picture. Wait for it to show up in the list. You need **at least 2** uploaded this way"
    ]),
    S("Skeleton, title, and your style block", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first). Inside the head, add a **title** with your brochure's name",
      "Under the title, add a **style block** with these rules: **a:link** (**color**), **a:visited** (**color**), **a:hover** (**color** and **background-color**), **a:active** (**color**), **h1** (**color** white, **background-color**, **font-family** serif, **font-size** 38px, **text-align** center, a **solid border**), **h2** (**color**, **font-size** 26px, **text-transform** uppercase, **font-family** serif), and **body** (**background-color** and **font-family** sans-serif)"
    ]),
    S("Banner, menu bar, and tagline", [
      "Inside the body, add **one heading 1** with your brochure's name",
      "Add a **bullet list** with **3 list items**, each with a **link** (https://) that opens in the **same tab**. Style the list: **list-style-type** none, **text-align** center, and a border on the **bottom only**. Style **each list item**: **display** inline",
      "Add a **paragraph** (**text-align** center): a phrase in **italics**, **one word** colored with a **span**, and a **line break** with a second line"
    ])], pictureSteps(false, true), [
    S("Steps and tips lists", [
      "Add a **heading 2** and a **heading 3** (**text-transform** uppercase). Under them, add a **numbered list** of 3 (bold name, dash, italic note). Style it: **list-style-type** decimal and a **background-color**",
      "Add a **heading 3** (with a **color**) and a **numbered list** of 3 tips. Style it: **list-style-type** upper-roman and a **dashed border**"
    ]),
    S("A note and the footer", [
      "Add a **paragraph** with a tip: a **span** (**color** style) for the first words, a **line break**, and the rest. Style it: **font-family** monospace, **font-size** 14px, and a **dotted border**",
      "Finish with a **bullet list** of 3 items (your name, a bar, your class period). Style it: **list-style-type** none, **text-align** center, **font-family** monospace, **font-size** 14px, and a border on the **top only**. Style **each list item**: **display** inline"
    ]),
    done(["Try a few different widths on the big picture and watch the preview, then set it back"])]));

  /* ----- the shared 7.x page: a banner, a menu bar, pictures, and lists, with each lesson's own section in the middle ----- */
  function base7(adv, middle, midTitle) {
    return [
      skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
      S("The banner and menu bar", [
        "Add **one heading 1** with your site's name. Style it: **color** white, **background-color** (a named color), **font-family** serif, **font-size** 38px, **text-align** center, and a **solid border** (like 4px solid)",
        "Under it, add a **bullet list** with **3 list items**, each with a **link** (https://) that opens in the **same tab**. Style the **bullet list**: **list-style-type** none, **text-align** center, and a border on the **bottom only** (like 3px solid). Style **each list item**: **display** inline"
      ]),
      S("The tagline", [
        "Add a **paragraph**. Style it: **text-align** center and **font-family** sans-serif. **Inside** it, put a phrase in **italics**, color **one word** with a **span** (**color** style), and add a **line break** with a second line"
      ])
    ].concat(pictureSteps(adv, false), middle, [
      S("Second section: ranked lists", [
        "Add a **heading 2** with a title (same style as your first heading 2). Under it, add a **heading 3** and give it **text-transform** uppercase",
        "Add a **numbered list** with **3 list items** (bold name, a dash, an italic description). Style it: **list-style-type** decimal and a **background-color**" + (adv ? " that is a **hex** code (like #FFF3E0)" : ""),
        "Add a **heading 3** (with a **color** style) and a second **numbered list** of 3 items. Style it: **list-style-type** upper-roman, a **dashed border**" + (adv ? ", and **padding** (like 6px)" : "")
      ]),
      S("A note and the footer", [
        "Add a **paragraph** with a tip: a **span** (**color** style) for the first words, a **line break**, and the rest. Style it: **font-family** monospace, **font-size** 14px, a **dotted border**" + (adv ? ", **padding** (like 8px), and a **margin** (like 16px 0)" : ""),
        "Finish with a **bullet list** of 3 items (your name, a bar, your class period). Style it: **list-style-type** none, **text-align** center, **font-family** monospace, **font-size** 14px, and a border on the **top only**. Style **each list item**: **display** inline"
      ]),
      done()
    ]);
  }

  /* ======================================================================= 7.1 ===== */
  A["7.1"] = build([].concat(head("A page of **postcards** from a trip. Each postcard is a box, and you use the **box model** (padding, border, margin) to frame it.", "around the world, national parks, or a beach vacation", notes("unit-7/box-model-notes.html")), [RULE],
    base7(false, [
      S("Three postcards (new today)", [
        "Add a **heading 2** that says My Postcards. Under it, add **three paragraphs**, each one a postcard from a different place. In each: the place name in **bold**, a **line break**, a sentence in **italics**, and one word colored with a **span**",
        "In the **style attribute of each postcard**, add **padding** (like 16px), a **border**, a **margin** (like 20px 40px), and a **background-color**. **Every** postcard needs all of them",
        "Give the borders different styles: **solid** on the first, **dashed** on the second, **dotted** on the third (like 5px solid, then 5px dashed, then 5px dotted)"
      ])])));

  /* ======================================================================= 7.2 ===== */
  A["7.2"] = build([].concat(head("A **mood board**: a page that uses a palette of colors to create a vibe. Hex reminder: a **#** and then 6 characters in three pairs (red, green, blue), each from 00 (none) to FF (the most).", "a spooky night, a beach day, a neon city, or a cozy cabin", notes("unit-7/colors-notes.html")), [RULE],
    base7(false, [
      S("The color palette (new today)", [
        "Add a **heading 2** that says Color Palette. Under it, add **5 paragraphs**. Each one is a swatch: the color's name in **bold**, a **line break**, and a word for the feeling in **italics**",
        "In the **style attribute of each swatch**, put a **background-color** and a **color** (the text) that is easy to read on it. Use a **named color** for the first swatch and **hex codes** (like #5B2A86) for the other 4",
        "Give the **first 2 swatches** their own **padding** (like 14px), a **border** (like 3px solid), and a **margin** (like 12px 30px)",
        "Every hex code starts with **#** and has **3 or 6** characters (0 to 9 and A to F). Search for a color picker online if you need help"
      ])])));

  /* ======================================================================= 7.3 ===== */
  A["7.3"] = build([].concat(head("The home screen of your own **streaming app**: a menu bar of buttons in a row and one giant PLAY button, built with the **display** property.", "movies, music, or games", notes("unit-7/display-notes.html")), [RULE],
    base7(true, [
      S("The menu bar and the PLAY button (new today)", [
        "Add a **heading 2** that says Home. Under it, add a **paragraph** (**text-align** center) with **4 links** inside it (like Home, Movies, Library, Friends), each a real address starting with https://",
        "In the **style attribute of each link**: **display** inline-block (so they sit side by side), a **width** (like 110px), **text-align** center, **color** white, **padding** (like 10px), and a **background-color**. Use a **named color** (like tomato) for one, a **hex code** for another, and the same color as your banner for the others. Give one link a **border** too",
        "Add a **heading 3** that says Featured Tonight (**text-transform** uppercase). Under it, add a **paragraph**: the show's title in **bold**, a dash, a tagline in **italics**, the word NEW in a **span** (white text on a colored background), a **line break**, and a short review",
        "Add a **paragraph** with one giant **PLAY link** (a real website). In the link's style: **display** block (so it fills the row), a **background-color**, **color** white, **text-align** center, **font-size** 30px, **padding** (like 24px), and a **margin** (like 10px 40px)"
      ])])));

  /* ======================================================================= 7.4 ===== */
  A["7.4"] = build([].concat(head("A **profile page**: a sidebar on the left and a feed of posts on the right, built from **divs**.", "a character, a pet, or a made-up celebrity", notes("unit-7/div-tag-notes.html")), [RULE],
    base7(true, [
      S("Two columns (new today)", [
        "Add a **heading 2** that says Profile. Under it, add a **div** for the sidebar, and **right after it**, a second **div** for the feed",
        "Inside the **sidebar div**: a **heading 3** (the name), a **paragraph** (a fact in **bold**, a **line break**, a second fact), a **paragraph** (a quote in **italics**, then a **span** with a **color** style), and a **bullet list** of 3 interests",
        "Inside the **feed div**: a **heading 3** that says Latest Posts, **3 short paragraphs** (the posts), and a **numbered list** of your top 3 posts where the first item is a **link**",
        "Style the **sidebar div**: **display** inline-block, **vertical-align** top, **width** 30%, **padding** (like 12px), a **background-color** (a named color), and a **border** (like 3px solid)",
        "Style the **feed div**: **display** inline-block, **vertical-align** top, **width** 65%, **padding** (like 12px), and a **background-color** that is a **hex** code. The two widths together must be **98% or less**"
      ])])));

  /* ======================================================================= 7.5 ===== */
  A["7.5"] = build([].concat(head("A **leaderboard** built as a **table**, plus a rules and prizes section.", "your favorite game, a sport, or a competition you invent", notes("unit-7/tables-notes.html")), [RULE],
    base7(true, [
      S("The leaderboard table (new today)", [
        "Add a **heading 2** with the leaderboard's name. Under it, add a **table**. Style the table: **border** (like 3px solid), **text-align** center, and **width** 90%",
        "Row 1 is the **header row**: one **header cell** for each of **4 columns** (like Rank, Player, Wins, Points). Style each header cell: a **background-color** and **color** white",
        "Then add **5 data rows**, each with one **data cell** per column. Only rows go directly inside the table, and only cells go directly inside a row. **Every row** must have the same number of cells"
      ]),
      S("Rules and prizes, side by side", [
        "Add a **heading 3** that says Rules and Prizes. Under it, add **two divs** with a **heading 3** and a **paragraph** inside each: one for the rules and one for the prizes",
        "Style **each div**: **display** inline-block, **vertical-align** top, **width** 45%, **padding** (like 10px), and a **border**. Give the first a **solid** border and a **background-color** (a named color), and the second a **dashed** border and a **hex** background-color"
      ])])));

  A["7.6"] = build([
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your site must show everything from 3.1 through 3.12, at least **2 times each**. The **Concepts** tab lists them all. Your teacher will tell you where to take the multiple choice test." },
    S("Build a real website of your own", [
      "Type the **skeleton**, then build a real website on a topic of your choice: headings, paragraphs, lists, links, pictures, boxes, columns, and a table",
      "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
    ]),
    done()]);

  /* ======================================================================= 8.x ===== */
  /* the site every 8.x/9.x lesson builds (a brand-new one each time). lvl: 1..6 = 8.1..8.6, 7..12 = 9.1..9.6 */
  function htmlSteps(lvl) {
    var boot = lvl >= 7, st = [];
    st.push(S("Start a brand-new site", [
      "This is a **new website**. Open the **index.html** tab and type the **doctype**, **html**, **head**, and **body**. In the head, add a **title** with your site's name",
      boot ? "Go to **getbootstrap.com**, open **Getting Started**, and copy the official **CSS link** (a full https:// address). Add it **inside the head**, **above** your own link" : "Click the **style.css** tab (all your styling goes there, not in the page)",
      "In the head, add a **link** to your CSS file, which is named **style.css**" + (boot ? ", **under** the Bootstrap link so your styles win" : "")
    ]));
    if (lvl >= 10) st.push(S("The Bootstrap navbar (new today)", [
      "At the **very top of the body**, add a **nav** tag with Bootstrap's **navbar** class, plus **navbar-expand**, a dark background class (**bg-dark**), and **navbar-dark**",
      "**Inside the nav**, add a **link** with the **navbar-brand** class showing your site's name, then a **div** with the **navbar-nav** class that holds **3 links** with the **nav-link** class (like Home, About, Contact), each with a full https:// address"
    ]));
    st.push(S("Banner, menu bar, and tagline", [
      "Add **one heading 1** with your site's name" + (lvl >= 2 ? " and give it an **id** named banner" : ""),
      "Under it, add a **bullet list** with **3 list items**, each with a **link** (https://) that opens in the same tab. Give the list the **class** " + (lvl >= 5 ? "menu" : "nav"),
      "Add a **paragraph** with the **class** tagline: a phrase in **italics**, **one word** in a **span**, and a **line break** with a second line"
    ]));
    st.push(S("Pictures and the first section", [
      "Add a **paragraph** and **Insert** your first picture inside it (Checks, then My images). Give the **picture** the **class** hero. Make its link open in a **new tab**, use a real https:// address, and write a real **alt**",
      "Add a **horizontal line**, then a **heading 2** and a **paragraph** with the **class** highlight, then a **heading 3** (like Photos)",
      lvl >= 6 ? "Add a **div** with the **class** gallery. Inside it, add **3 linked pictures** (each with a real **alt**), and give each **picture** the **class** thumb. Make one link open in a **new tab**" : "Add **2 more linked pictures**, each in its own paragraph: give the first the **class** small (same-tab link) and the second the **class** wide (new-tab link)",
      "Add a **bullet list** of **3 items** with the **class** bullets, then a **horizontal line**"
    ]));
    st.push(S("The second section: ranked lists", [
      "Add a **heading 2**, then a **heading 3** with the **class** upper, then a **numbered list** of **3 items** (bold name, a dash, an italic description) with the **class** ranked",
      "Add a **heading 3** (like Good to Know) and a second **numbered list** of **3 items** with the **class** roman",
      lvl >= 3 ? "Add **2 paragraphs**. Give the first **two classes** at once (note and framed, separated by a space) and put a **bold** word in it. Give the second **two classes** too (note and tip), with a **span** and a **line break** inside it" : "Add a **paragraph** with the **class** mono: a **span** for the first words, a **line break**, and the rest"
    ]));
    var boxes = ["Add **two divs** side by side. Give the first the **class** left and the second the **class** right. Put a **heading 3** and a **paragraph** inside each"];
    if (lvl >= 5) boxes.push("Add a **div** with the **class** stats that holds **3 short paragraphs** (like facts)");
    if (lvl >= 6) boxes.push("Add a **div** with the **class** facts that holds **4 short paragraphs**");
    boxes.push("Add **two tables**, each with a **header row** (3 columns in the first, 2 in the second) and **3 data rows**. Give both the **class** data" + (lvl >= 2 ? ", and give the **second table** an **id** named signup" : ""));
    st.push(S("Boxes, facts, and two tables", boxes));
    if (lvl >= 8) {
      var b = ["Add a **div** with Bootstrap's **container** class. **Inside it**, add **2 divs** with the **row** class, and **inside each row** add **2 divs** with the **col** class. Put a **heading 2** and a **paragraph** in each column"];
      if (lvl >= 9) b.push("Add Bootstrap classes: a **text color** class (like **text-primary**) on **2 headings**, a **background** class (like **bg-light**) on one paragraph, and a **bold** class (like **fw-bold**) on one heading. In **2 different columns**, add a **link** (https://) with Bootstrap's **btn** class plus a style class (like **btn-primary**)");
      if (lvl >= 11) b.push("Inside the container, add a **third row** with **3 columns**. In each column, add a **div** with the **card** class. Inside each card: a linked **image** with the **card-img-top** class, then a **div** with the **card-body** class that holds a **heading** (**card-title**), a **paragraph** (**card-text**), and a **link** (**btn** plus **btn-primary**)");
      if (lvl >= 12) b.push("At the bottom of the container, add a **form** with a heading, then **2 labels** (**form-label**) each followed by an **input** (**form-control**), then a **button** with type submit and the classes **btn btn-success**");
      st.push(S("Bootstrap sections", b));
    }
    st.push(S("The footer", ["Add a **bullet list** with the **class** footer and **2 items**: your name and your class period"]));
    return st;
  }
  function cssSteps(lvl) {
    var st = [];
    st.push(S("Style the tags and classes in style.css", [
      "Click the **style.css** tab. In a CSS file there are **no style tags**, **no quotes** around values, and every rule is a selector, curly braces, and **property: value;** lines",
      "**body**: **background-color** (a light named color), **font-family** sans-serif, and **margin** (like 0 20px)",
      "**h1**: **color** white, **background-color**, **font-family** serif, **font-size** 38px, **text-align** center, and a **solid border**. **h2**: **color**, **font-size** 26px, **text-transform** uppercase, **font-family** serif, and a border on the **bottom only**. **h3**: **color**, **font-size** 20px, a border on the **left only**, and **padding**",
      "**p**: **font-size** 16px, **margin**, and **color**. **hr**: a **dotted border**. **a**: **color**. **table**: a **solid border**, **text-align** center, **width** 90%, and a **margin**. **th**: **background-color**, **color** white, and **padding**. **td**: **padding**, a border on the **bottom only** (dotted), and **font-family** monospace",
      "A class rule starts with a **dot** before the name. **.nav**: **list-style-type** none, **text-align** center, a border on the **bottom only**, and a **hex** **background-color** (like #E8F0FF). **.nav li**: **display** inline" + (lvl >= 5 ? " (add **.menu li** to the same rule)" : "") + ". **.tagline**: **text-align** center and **font-family** sans-serif. **.tagline span**: **color**",
      "**.hero**: **width** 320px, a **solid border**, **border-radius** 12px, **display** block, and a **margin**. " + (lvl >= 6 ? "**.thumb**: **width** 100%, a **solid border**, and **border-radius** 10px. " : "**.small**: **width** 25%, **border-radius** 50%, and a **dashed border**. **.wide**: **width** 45%, **display** block, and a **dotted border**. ") + "**.highlight**: **background-color**, **color**, **padding**, and **font-family** sans-serif",
      "**.bullets**: **list-style-type** square, a **solid border** with a **hex** color (like #666666), and a **margin**. **.upper**: **text-transform** uppercase and **text-align** center. **.ranked**: **list-style-type** decimal and a **hex** **background-color**. **.roman**: **list-style-type** upper-roman and a **dashed border**",
      (lvl >= 3 ? "" : "**.mono**: **font-family** monospace, **font-size** 14px, a **dotted border**, and **text-align** center. **.mono span**: **color**. ") + "**.left**: **display** inline-block, **vertical-align** top, **width** 30%, a **background-color**, a **solid border**, and **padding**. **.right**: **display** inline-block, **vertical-align** top, **width** 60%, a **hex** **background-color**, a **dashed border**, and **padding**",
      "**.footer**: **list-style-type** none, **text-align** center, **font-family** monospace, **font-size** 14px, and a border on the **top only**. **.footer li**: **display** inline and a **margin**"
    ]));
    if (lvl >= 2) {
      var nt = function (n) { return lvl === n ? "(new today) " : ""; }, more = [];
      more.push(nt(2) + "**ids:** an id rule starts with a **#** before the name. **#banner**: a **margin** and **padding**. **#signup**: a **hex** **background-color** and a **solid border**");
      if (lvl >= 3) {
        more.push(nt(3) + "**specificity:** make sure your **p** rule sets a **color**. Then write **.note** with a **different color**, **font-weight** bold, and **text-align** center. A class is more specific than a tag, so the class color wins");
        more.push(nt(3) + "**combined selectors:** write **.framed** (a **solid border** and **padding**), **p.tip** (a tag stuck to a class: a **background-color** and **font-family** monospace), and **ul li** (one tag inside another: a **margin**)");
      }
      if (lvl >= 4) {
        more.push(nt(4) + "**hover:** in the **a** rule, add a **transition** (like all 0.3s), then write **a:hover** (a tag, a colon, the word hover) to change **color** and **background-color**");
        more.push(nt(4) + "**hover:** do the same for **td**: a **transition** in the normal **td** rule (never in the hover rule, so it animates both ways), and **td:hover** to change the **background-color**");
      }
      if (lvl >= 5) {
        more.push(nt(5) + "**flexbox:** **.menu**: **display** flex, **justify-content** (try space-around), **align-items** center, **list-style-type** none, a border on the **bottom only**, and a **hex** **background-color**");
        more.push(nt(5) + "**flexbox:** **.stats**: **display** flex, **justify-content** (try space-between), **align-items** center, a **hex** **background-color**, a **solid border**, and **padding**");
      }
      if (lvl >= 6) {
        more.push(nt(6) + "**grid:** **.gallery**: **display** grid, **grid-template-columns** with 3 equal columns (like 1fr 1fr 1fr), and a **gap**. **.facts**: **display** grid, **grid-template-columns** with 2 equal columns, and a **gap**");
        more.push(nt(6) + "**grid:** **.facts p**: a **background-color**, a **dashed border**, **padding**, and **text-align** center");
      }
      st.push(S("More rules in style.css", more));
    }
    return st;
  }
  function site(lvl, what, themes, noteUrl, newText) {
    return build([].concat(head(what, themes, noteUrl ? notes(noteUrl) : null), [RULE], htmlSteps(lvl), cssSteps(lvl), [done()]));
  }

  A["8.1"] = site(1, "A brand-new website with its own **style.css** file, styled with **tag rules** and **classes**.", "a robotics club, a pizza shop, or a gaming channel", "unit-8/external-css-notes.html");
  A["8.2"] = site(2, "A brand-new website that also styles single elements by **id**.", "an animal shelter, a fitness gym, or a bookstore", "unit-8/css-id-notes.html");
  A["8.3"] = site(3, "A brand-new website that shows **specificity**: a class rule beats a tag rule, one element can wear **two classes at once**, and **combined selectors** aim more precisely.", "a bike shop, a band, or a science center", "unit-8/specificity-notes.html");
  A["8.4"] = site(4, "A brand-new website with smooth **hover effects** that use **transitions**.", "a robotics club, a fitness gym, or a band", "unit-8/hover-notes.html");
  A["8.5"] = site(5, "A brand-new website that uses **flexbox** for two sections.", "a pizza shop, a bookstore, or a science center", "unit-8/flexbox-notes.html");
  A["8.6"] = site(6, "A brand-new website that uses **grid** for two sections.", "a gaming channel, an animal shelter, or a bike shop", "unit-8/grid-notes.html");
  A["8.7"] = build([
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your site must show everything from this unit, and every earlier tool, at least **2 times each**. The **Concepts** tab lists them all." },
    S("Build a brand-new site", [
      "Type the **skeleton** in index.html and link **style.css** in the head. All styling goes in style.css",
      "Show **tag rules**, **classes** (including two on one element), **ids**, **combined selectors**, **hover effects with transitions**, **two flexbox sections**, and **two grids**",
      "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
    ]),
    done()]);

  /* ======================================================================= 9.x ===== */
  A["9.1"] = site(7, "A brand-new website that loads **Bootstrap**, a giant ready-made stylesheet, and still uses every tool from the HTML and CSS units.", "an animal shelter, a band, or a robotics club");
  A["9.2"] = site(8, "A brand-new website that uses Bootstrap's **grid**: a container, rows, and columns.", "a fitness gym, a science center, or a pizza shop");
  A["9.3"] = site(9, "A brand-new website with Bootstrap **utility classes** and **buttons**.", "a bookstore, a bike shop, or a gaming channel");
  A["9.4"] = site(10, "A brand-new website with a Bootstrap **navbar** across the top.", "a robotics club, a bookstore, or a band");
  A["9.5"] = site(11, "A brand-new website with a row of Bootstrap **cards**.", "a pizza shop, an animal shelter, or a science center");
  A["9.6"] = site(12, "A brand-new website with a Bootstrap **form**.", "a gaming channel, a fitness gym, or a bike shop");
  A["9.7"] = build([
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your page must show everything from this unit, and every earlier tool, at least **2 times each**. The **Concepts** tab lists them all." },
    S("Build a brand-new site", [
      "Type the **skeleton** in index.html, add the **Bootstrap link** above your own style.css link inside the head",
      "Show a **navbar** at the top with a brand and at least 3 nav links, a **grid** (container, rows, and columns), **cards** with images, titles, text, and buttons, and a **form** with 2 labeled fields and a submit button",
      "Use every item in the **Concepts** tab at least **2 times**. The **Checks** list tracks them for you"
    ]),
    done()]);
})(typeof window !== "undefined" ? window : globalThis);
