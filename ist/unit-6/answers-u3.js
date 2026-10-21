/* "Assignment" tab steps for the Unit 3 lessons after 3.1 (lessons 6.2, 6.20, 6.3 to 6.7). Loaded AFTER the other answers files, so these replace the older versions.
   The bullets here line up one-to-one with the check lists in step-checks-b.js (same steps, same bullet order).
   From 3.2 on, every assignment brings back tags and styles from earlier lessons (concepts.js lists them, html-check.js checks them),
   and from 3.7 on (links, images) every assignment also needs 3 links, 3 images, and 1-2 images that are links. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
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
  function head(what, themes, note) { return [{ h: "What you are building" }, { p: what + (themes ? " Pick **one**: " + themes + "." : "") + " Click **Checks** any time to see your score. The **Concepts** tab lists every tag and style this page needs." }, note].filter(Boolean); }
  var RULE = { p: "**Every theme uses these same steps.** Use **named colors** (like navy or tomato) unless a step says hex. Dark backgrounds need light text. Each step says the least you must add: you can ALWAYS add more." };
  var RULE2 = { p: "Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with each property and value **inside** the quotes. When you put **two or more** properties in one style attribute, put a **semicolon between them** (a single property does not need one). Each step says the least you must add: you can ALWAYS add more." };
  function skeleton(extra) {
    return S("Skeleton and title", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your page's name"
    ].concat(extra || []));
  }
  function done(extra) {
    return S("Test and submit", (extra || []).concat([
      "Click **Checks**. Fix every red line. The **Use what you already know** list has to turn green too: for each red item, add the missing use where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ]));
  }

  /* ======================================================================= 6.2  (3.2) ===== */
  A["6.2"] = build([].concat(head("**The Ugliest Website Ever.** Make the most **god-awful, eye-burning** website you can using **text colors and background colors**. The uglier the better (but every word must still be there).", "a **terrible movie fan page**, a **terrible holiday page**, or a **terrible school-cafeteria review page**", notes("unit-6/style-attribute-notes.html")), [RULE2,
    { p: "**The big idea:** almost every tag on your page gets BOTH a **color** (the text) and a **background-color** (behind the text). Then you build a **pattern**: reuse the same two or three color combinations over and over, so your page is ugly **on purpose**." },
    S("Skeleton and title", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your terrible page's name"
    ]),
    S("Build the page", [
      "Inside the body, add **one heading 1** with the page's name, **at least 3 heading 2s** (sections of your page), and **at least 6 paragraphs** under them with a couple of real sentences each, about your topic"
    ]),
    S("Color the whole page", [
      "On the **body** tag, add a style: **background-color** (a loud named color)",
      "In the same style, add **color** (a named color for the text). Put both properties in **one** style attribute, with a semicolon between them, and make the two **different** colors",
      "**Remember:** the style on the body gives the **whole page** its basic colors, and every tag inside inherits them. But you can **override** those colors on any single tag by giving that tag its own style attribute with new colors. That is how you will make each heading and paragraph different in the next steps"
    ]),
    S("Color the headings", [
      "Style the **heading 1** with **color** and **background-color** together (two different named colors)",
      "Style **every heading 2** with **color** and **background-color** together. Make a **pattern**: **at least 2 of your heading 2s** must use exactly the same two colors (like orange on purple every time), so your headings look like a matching set"
    ]),
    S("Color the paragraphs: no two alike", [
      "Style **every paragraph** with **color** and **background-color** together. **Every paragraph must look different from all the others**: no two paragraphs can share the same text color, and no two can share the same background color. On each paragraph, the text color and background must also be different from each other",
      "Check that nothing is hidden: wherever you use both **color** and **background-color**, they must be **different** colors. Ugly is fine. Invisible is not",
      "**A sneak peek (we cover it fully in 3.4):** the **span** tag wraps just a few words inside a paragraph or heading, and the span can have its own style attribute. So you can give a word, or even a single letter, its own **color** (or **background-color**) that overrides the paragraph's. Put the span **inside** the tag, and close it before the tag closes. Click the help button to see it work",
      "**BONUS (+5 points):** use the span tag to make **at least 3 words** on your page a different color. You can wrap a **whole word** in one span, or give **each letter** of a word its own span and its own **color** (a rainbow word). Your auto score goes above 100 when you finish all the required steps AND earn this bonus"
    ]),
    S("Test and submit", [
      "Click **Checks**. Fix every red line. The **Use what you already know** list has to turn green too: for each red item, add the missing use where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* ======================================================================= 6.20  (3.3) ===== */
  A["6.20"] = build([].concat(head("An **epic poster** for the biggest event of the year.", "a band's world tour, a movie premiere, an esports tournament, or a made-up holiday", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and background", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your poster's name",
      "On the **body** tag, add a style: **background-color** (a named color, like black or navy)"
    ]),
    S("The name and tagline", [
      "Inside the body, add **one heading 1** with the event's name. Style it: **color** (a bright named color), **font-size** in pixels (like 58px), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** with a short tagline. Style it: **color** (any named color, even the same one as your heading 1 if you want them to match), **text-transform** uppercase, **text-align** center, and **font-size** 24px"
    ]),
    S("When and where", [
      "Add a **heading 3** that says When, with a **color** style. Under it, add a **paragraph** with the date and time. Style the paragraph: **color** (light on a dark background), **font-size** 20px, and a **background-color** (a named color)",
      "Add a **heading 3** that says Where, with a **color** style. Under it, add a **paragraph** with the place. Style it: **color** and **font-size** 20px"
    ]),
    S("Tickets, a finishing touch, and contact info", [
      "Add a third **heading 3** that says Tickets (after your When and Where headings). Style it: **color**, **text-transform** uppercase, **text-align** center. You can reuse the same colors as your other headings so everything looks uniform",
      "Under it, add a **paragraph** about how to get tickets. Style it: **color**, **font-size** 20px, **text-align** center, and a **background-color**",
      "Add one **paragraph** with a fun fact or a warning. Style it: **color**, **font-size** 16px, and **text-align** center",
      "At the very bottom, add a second **heading 2** that says Contact Information. Style it: **color** and **text-align** center",
      "Under it, add a **paragraph** that lists your contact info (an email, a phone number, or a social media name; it can be made up). Style it: **color** and **text-align** center"
    ]),
    done()]));

  /* ======================================================================= 6.3  (3.4) ===== */
  A["6.3"] = build([].concat(head("The **menu** for your dream restaurant.", "a taco truck, a bakery, or a cafe in space", notes("unit-6/editing-tags-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color) and **color** (a dark named color for the text)"]),
    S("The name, address, and a line", [
      "Add **one heading 1** with the restaurant's name. Style it: **color** (a named color), **font-size** 44px, **text-align** center, and a **background-color** (a named color)",
      "Under it, add a **paragraph** with your address, a **line break** inside it, and your hours on the second line. Style it: **text-align** center and **font-size** 16px",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Three menu sections", [
      "Add a **heading 2** that says Starters. Style it: **text-transform** uppercase and **color** (a named color). Under it, add **2 dish paragraphs**. In each one: make the dish name **bold**, then a dash, then the price inside a **span** with a **color** style, then a **line break**, then the description in **italics**. Everything goes **inside** the paragraph",
      "Add a **horizontal line**, then a **heading 2** that says Main Dishes (same style) and **2 more dish paragraphs**. Give the **first** of these a **background-color** so it stands out as today's special",
      "Add a **horizontal line**, then a **heading 2** that says Desserts (same style) and **2 more dish paragraphs**"
    ]),
    S("Chef's special and notes", [
      "Add a **heading 3** that says Chef's Special. Style it: **text-align** center and **color**. Under it, add a **paragraph** about the special. Style it: a **background-color** and **font-size** 18px",
      "Add a **heading 3** that says Good to Know, with a **color** style. Under it, add a **paragraph** on two lines (use a **line break** inside). Style it: **font-size** 14px and a **background-color**"
    ]),
    done()]));

  /* ======================================================================= 6.4  (3.5) ===== */
  A["6.4"] = build([].concat(head("The **ultimate Wanted poster** for an outlaw on the loose.", "a villain, your pet who stole the snacks, or a made-up criminal", notes("unit-6/borders-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
    S("The banner", [
      "Add **one heading 1** that says WANTED (or your own wanted title). Style it: **color**, **background-color**, **font-size** 56px, **text-align** center, **text-transform** uppercase, and a **solid border** (thickness, style, color in that order, like 6px solid)",
      "Under it, add a **paragraph** listing the crimes. Style it: **font-size** 20px. **Inside** it, color two phrases with **spans** (a **color** style each) and make one phrase **bold**",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Description", [
      "Add a **heading 2** that says Description. Style it: **color**, **font-size** 30px, and a border on the **bottom only** (like border-bottom: 4px solid)",
      "Under it, add a **paragraph** with a **bold** word, an **italic** word, and **2 line breaks**",
      "Add a second **paragraph** about the outlaw's habits, with an **italic** word, a **bold** word, and a **line break**. Style it with a **dashed border**"
    ]),
    S("Marks and last seen", [
      "Add a **heading 3** that says Distinguishing Marks. Style it: **text-align** center and **color**. Under it, add a **paragraph** with a **dotted border**",
      "Add a **horizontal line**, then a **heading 2** that says Last Seen. Style it: **text-transform** uppercase, **color**, and a border on the **left only**",
      "Add a **heading 3** that says Known Hideouts. Style it: **color** and **font-size** 22px. Under it, add a **paragraph** with a **dashed border** in a **different color** than your other dashed border"
    ]),
    S("Reward and warning", [
      "Add a **heading 2** that says Reward, with a **color**. Under it, add a **paragraph** with the amount in **bold**. Style it: **background-color**, a **solid border**, **text-align** center, and **font-size** 24px",
      "Add one last **paragraph** with a warning in **italics** and a **line break**. Style it: **font-size** 13px, **text-align** center, and a **dotted border**"
    ]),
    done()]));

  /* ======================================================================= 6.5  (3.6) ===== */
  A["6.5"] = build([].concat(head("The **ultimate guide page**: a two-section guide about something you know a lot about.", "a video game, a sport, a hobby, or how to survive middle school", notes("unit-6/lists-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
    S("Banner and menu", [
      "Add **one heading 1** with your guide's name. Style it: **background-color** (dark), **color** white, **text-align** center, **font-size** 36px, and a border on the **bottom only**",
      "Under it, add a **bullet list** with **3 list items** (the names of your sections). Style the list: **list-style-type** none, a **background-color**, and **text-align** center",
      "Style **each of the 3 list items**: **display** inline and **color** white, so the menu sits in one row"
    ]),
    S("Tagline", [
      "Add a **paragraph** (**text-align** center). Inside it: a phrase in **italics**, **two words** colored with **spans** (a **color** style each), and a **line break** with a second line",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("First section", [
      "Add a **heading 2**. Style it: **color**, **text-transform** uppercase, **font-size** 26px, and a border on the **bottom only**",
      "Under it, add a **paragraph**, then a **heading 3**, then a **numbered list** of 3 items (a **bold** name, a dash, an **italic** description). Style the list: **list-style-type** decimal, a **background-color**, and a **solid border**",
      "Add a second **heading 3** (with a **color**) and a **bullet list** of 3 items. Style it: **list-style-type** square, a **background-color**, and a **dashed border**",
      "Under the lists, add a **horizontal line**"
    ]),
    S("Second section", [
      "Add a second **heading 2** and a **paragraph** under it. Style the paragraph with a **dashed border**",
      "Add a **heading 3** and a second **numbered list** of 3 items (bold name, dash, italic description). Style it: **list-style-type** upper-roman, a **background-color**, and a **dotted border**",
      "Add a **heading 3** (with a **color**) and a third **bullet list** of 3 items. Style it: **list-style-type** circle, a **background-color**, and a **solid border**"
    ]),
    S("The footer", [
      "Add a **horizontal line**, then one last **paragraph** with a **line break** inside. Style it: **text-align** center, **font-size** 13px, and a **dotted border**"
    ]),
    done()]));

  /* ======================================================================= 6.6  (3.7) ===== */
  A["6.6"] = build([].concat(head("A **link hub**: a one-page website that points people to the best sites on a topic you love.", "gaming, music, sports, art, or a hobby", notes("unit-6/links-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
    S("Banner, menu, and tagline", [
      "Add **one heading 1** with your hub's name. Style it: **color** white, **background-color**, **text-align** center, and **font-size** 38px",
      "Under it, add a **bullet list** with **3 list items**, each with a **link** (a real https:// address) that opens in the **same tab**. Style the list: **list-style-type** none, **text-align** center, and a border on the **bottom only**. Style **each list item**: **display** inline",
      "Add a **paragraph** (**text-align** center): a phrase in **italics**, **one word** colored with a **span**, and a **line break**. Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Best sites list", [
      "Add a **heading 2** (with **color** and **text-transform** uppercase) and a second **bullet list** of 3 items. Style it: **list-style-type** square and a **dashed border**",
      "Each item is a **link** (https://) that opens in a **new tab**. Make the name of the site the link text (never \"click here\") and put it in **bold** inside the link. Add a short note in **italics** after each link",
      "Under the list, add a **horizontal line**"
    ]),
    S("Favorite videos list", [
      "Add a second **heading 2** (with a **color**) and a **numbered list** of 3 items. Style it: **list-style-type** upper-roman and a **dotted border**",
      "Each item is a **link** (https://) that opens in the **same tab**, with the name in **bold** inside the link and an **italic** note after it"
    ]),
    S("Make anything a link", [
      "Add a **heading 3** that says Featured and wrap the **whole heading** inside a **link** (an a tag around the h3) with a real https:// address that opens in a **new tab**",
      "Add a **paragraph** where a **bold phrase** is inside a link (the strong tag goes **inside** the a tag)",
      "Finish with a **bullet list** of 3 items. In each item, one link wraps a **bold word** and an **italic word** together. Style the list: **list-style-type** none and **text-align** center"
    ]),
    S("Test and submit", [
      "Click each of your links in the preview and make sure it goes where you expect (and new-tab links open a new tab)",
      "Click **Checks**. Fix every red line. The **Use what you already know** list has to turn green too: for each red item, add the missing use where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* ======================================================================= 6.7  (3.8) ===== */
  A["6.7"] = build([].concat(head("A **photo brochure** with real pictures. You upload your own pictures, change their sizes, and make **every picture a clickable link**.", "a travel brochure, a pet adoption flyer, or a club recruitment page", notes("unit-6/images-notes.html")), [RULE,
    S("Get and upload 3 pictures", [
      "Take or draw **at least 3 pictures** for your topic (school-appropriate) and save them as JPG or PNG files",
      "Click **Checks**, find **My images**, and upload each picture. Wait for it to show up in the list. You need **at least 2** uploaded this way"
    ]),
    S("Skeleton, title, and background", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first). Inside the head, add a **title** with your brochure's name",
      "On the **body** tag, add a style: **background-color** (a light named color)"
    ]),
    S("Banner, menu bar, and tagline", [
      "Inside the body, add **one heading 1** with your brochure's name. Style it: **color**, and **text-align** center",
      "Add a **bullet list** with **3 list items**, each with a **link** (https://) that opens in the **same tab**. Style the list: **list-style-type** none and **text-align** center. Style **each list item**: **display** inline",
      "Add a **paragraph** (**text-align** center): a phrase in **italics**, **one word** colored with a **span**, and a **line break** with a second line"
    ]),
    S("The big picture", [
      "Add a **paragraph**. Click inside it, then click **Insert** on your first picture (Checks, then My images). The editor writes the picture wrapped in a link for you. Change that link to a **real website** (https://), make it open in a **new tab**, and write a real **alt** description (like \"my dog on the beach\")",
      "Give the picture a **width** of 320px in its style attribute"
    ]),
    S("Two more pictures", [
      "Add a second **paragraph** with your second picture the same way: a link to a real website that opens in the **same tab**, a real alt, and a **width** of 25%",
      "Add a third **paragraph** with your third picture: a link that opens in a **new tab**, a real alt, and a **width** of 45%"
    ]),
    S("Pictures need words: a list of links", [
      "Add a **heading 2** with a **color**. Under it, add a **bullet list** of 3 items. Style it: **list-style-type** square and a **solid border**",
      "Each item is a **text link** (https://) with the name in **bold** inside the link and an **italic** note after it. These are links with words, not pictures"
    ]),
    S("The footer", [
      "Add a last **paragraph** with a **line break** inside. Style it: **text-align** center and **font-size** 14px"
    ]),
    S("Test and submit", [
      "Try a few different widths on the big picture and watch the preview, then set it back",
      "Click **Checks**. Fix every red line. The **Use what you already know** list has to turn green too: for each red item, add the missing use where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* From 3.9 on (lessons 7.1 to 9.7), every assignment also needs 3 links, 3 pictures, and 2 pictures that are links (html-check.js checks it). Add one step before "Test and submit". */
  Object.keys(A).forEach(function (l) {
    if (!/^[789]\./.test(l) || !A[l] || A[l].__links) return;
    var list = A[l], at = -1;
    list.forEach(function (it, i) { if (it.h && /Test and submit/.test(it.h)) at = i; });
    if (at < 0) return;
    var m = /^Step (\d+):/.exec(list[at].h), n = m ? +m[1] : 0;
    var step = [
      { h: "Step " + n + ": Links and pictures on every page" },
      { build: [
        "Check that your site has **at least 3 links** (https://) in all, with real link text (never \"click here\"). Add any that are missing",
        "Check that it has **at least 3 pictures**, each with a real **alt** description. Use your uploaded pictures (Checks, then My images, then Insert) wherever you can",
        "Make **at least 2 of your pictures clickable links**: each picture sits **inside** an a tag with a real https:// address"
      ] }
    ];
    list[at] = { h: "Step " + (n + 1) + ":" + list[at].h.replace(/^Step \d+:/, "") };
    list.splice(at, 0, step[0], step[1]);
    list.__links = true;
  });
})(typeof window !== "undefined" ? window : globalThis);
