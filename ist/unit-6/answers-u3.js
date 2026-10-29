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
  A["6.2"] = build([].concat(head("**The Ugliest Website Ever.** Make the most **god-awful, eye-burning** website you can using **text colors and background colors**. The uglier the better (but every word must still be there).", "a **terrible movie fan page**, a **terrible holiday page**, or a **terrible school-cafeteria review page**", notes("unit-6/style-attribute-notes.html")), [{ tip: "colorlist", label: "See all the named colors" }, RULE2,
    { p: "**The big idea:** almost every tag on your page gets BOTH a **color** (the text) and a **background-color** (behind the text). Then you build a **pattern**: reuse the same two or three color combinations over and over, so your page is ugly **on purpose**." },
    S("Skeleton and title", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your terrible page's name"
    ]),
    S("Build the page", [
      "Inside the body, add **one heading 1** with the page's name. Under it, add your **first heading 2** (the title of a section), and **right under that heading 2** add **2 paragraphs** (a couple of real sentences each, about your topic). Then add a **second heading 2** with **2 paragraphs** under it, and a **third heading 2** with **2 paragraphs** under it. That is **1 heading 1, 3 heading 2s, and 6 paragraphs** in all"
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
      "**BONUS (+5 points):** use the span tag to color words on your page. Either wrap **at least 3 whole words**, each in its own span with a **color**, OR make **one rainbow word** by giving **each letter** of a word its own span and its own **color**. Your auto score goes above 100 when you finish all the required steps AND earn this bonus"
    ]),
    S("Test and submit", [
      "Click **Checks**. Fix every red line. The **Use what you already know** list has to turn green too: for each red item, add the missing use where it fits the page",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* ======================================================================= 6.20  (3.3) ===== */
  A["6.20"] = build([].concat(head("An **epic poster** for a **made-up holiday**: invent a holiday (like National Pizza Rolls Day or Opposite Day) and design the poster that announces it.", "", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and background", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with your holiday's name",
      "On the **body** tag, add a style: **background-color** (a named color, like black or navy)"
    ]),
    S("The name and tagline", [
      "Inside the body, add **one heading 1** with the holiday's name. Style it: **color** (a bright named color), **font-size** in pixels (like 58px), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** with a short tagline. Style it: **color** (any named color, even the same one as your heading 1 if you want them to match), **text-transform** uppercase, **text-align** center, and **font-size** 24px"
    ]),
    S("When and where", [
      "Add a **heading 3** that says When, with a **color** style. Under it, add a **paragraph** with the date (and time, if it has one). Style the paragraph: **color** (light on a dark background), **font-size** 20px, and a **background-color** (a named color)",
      "Add a **heading 3** that says Where, with a **color** style. Under it, add a **paragraph** with where people celebrate it. Style it: **color** and **font-size** 20px"
    ]),
    S("Traditions, a finishing touch, and contact info", [
      "Add a third **heading 3** that says Traditions (after your When and Where headings). Style it: **color**, **text-transform** uppercase, **text-align** center. You can reuse the same colors as your other headings so everything looks uniform",
      "Under it, add a **paragraph** about how people celebrate (the food, the games, the things you do). Style it: **color**, **font-size** 20px, **text-align** center, and a **background-color**",
      "Add one **paragraph** with a fun fact or a funny warning about the holiday. Style it: **color**, **font-size** 16px, and **text-align** center",
      "At the very bottom, add a second **heading 2** that says Contact Information. Style it: **color** and **text-align** center",
      "Under it, add a **paragraph** that lists your contact info (an email, a phone number, or a social media name; it can be made up). Style it: **color** and **text-align** center",
      "**EXTRA CREDIT (+5 points): the span tag.** A **span** wraps just a few words inside a paragraph or heading so those words can have their own style attribute, different from the rest of the line (we cover it fully in 3.4). Use the span tag **at least twice** anywhere on your poster, each with its own style, like a different **color**, **font-size**, or **text-transform** on a few words. Click the help button to see how it works",
      "**EXTRA CREDIT (+5 more points):** put a span **inside your heading 1** so part of the title has its own **color** and its own **font-size** in pixels (like one big word in a different color). Your auto score can go above 100 when everything required is done"
    ]),
    done()]));

  /* ======================================================================= 6.21  (3.3 Part 2: extra practice, movie or game review) ===== */
  A["6.21"] = build([].concat(head("**A review page** for a movie or video game you know well. This is **extra 3.3 practice** (Part 2): the same font-size, text-align, and letter-case skills as the poster, on a brand-new page.", "a movie or a video game", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and colors", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with the name of what you are reviewing",
      "On the **body** tag, add a style with a **background-color** and a **color** (two **different** named colors, so the text can be read)"
    ]),
    S("The name and the tagline", [
      "Inside the body, add **one heading 1** with the title of the movie or game. Style it: **color**, **font-size** in pixels (**36px or bigger**), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** for a short verdict (like Fast, funny, and worth watching). Style it: **color**, **font-size** in pixels, **text-align** center, and **text-transform** capitalize (so every word starts with a capital letter)"
    ]),
    S("The review sections", [
      "After the tagline, add your **first review heading 2** (like Story), then a **second heading 2** (like Characters or Gameplay), then a **third heading 2** (like Final Verdict), one after another. For now they sit in a row: you will put paragraphs between them in Step 4. Style **every one** of them with a **color**, a **font-size** in pixels, **text-transform** uppercase, and **text-align** center"
    ]),
    S("The review text", [
      "Put **2 paragraphs** between your first review heading 2 and your second one, **2 paragraphs** between the second and the third, and **2 paragraphs** under the third. That is **6 paragraphs** in all, 2 under every heading 2. Write two or three sentences in each, about the story, the characters or gameplay, and what you liked or did not like. Style **every paragraph** with a **color** and a **font-size** in pixels (like 18px)",
      "Make **at least 3 of your 6 paragraphs** **text-align** center (for example the first paragraph under each heading 2)",
      "Give **at least 2 of your 6 paragraphs** **both a color and a background-color** (two **different** named colors) so your favorite parts stand out"
    ]),
    S("Rating and release info", [
      "At the bottom, add **at least 2 heading 3s**: one that says Rating and one that says Release Info. Style **every** heading 3 with a **color** and **text-align** center, and make **at least one** of them **text-transform** lowercase",
      "Put a **paragraph right after each heading 3** (your rating out of 10 with a reason, and the year it came out and who made it). Style each one with a **color** and a **font-size** in pixels"
    ]),
    done()]));

  /* ======================================================================= 6.22  (3.3 Part 3: extra practice, band or artist profile) ===== */
  A["6.22"] = build([].concat(head("**A profile page** for a band or music artist, built so the **sizes shrink** from the biggest heading to the smallest. This is **extra 3.3 practice** (Part 3): the same font-size, text-align, and letter-case skills, on another brand-new page.", "a real band or artist you like, or a made-up one", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and colors", [
      "Type the **doctype** line, then **html** with a **head** and a **body** inside it (head first)",
      "Inside the head, add a **title** with the band or artist's name",
      "On the **body** tag, add a style with a **background-color** and a **color** (two **different** named colors)"
    ]),
    S("The size staircase", [
      "Add **one heading 1** with the band or artist's name. Style it: **color**, **font-size** in pixels (**40px or bigger**), **text-align** center, and **text-transform** uppercase",
      "Under the heading 1, add your **first heading 2** (like Albums), then a **second heading 2** (like Famous Songs), then a **third heading 2** (like Tour Dates), one after another. For now they sit in a row: the next bullets and step fill in the space between them. Style **every** heading 2 with a **color**, a **font-size** in pixels, and **text-transform** capitalize",
      "Add a **heading 3** (like Genre) **right under your first heading 2**, and a second **heading 3** (like Formed In) **right under your second heading 2**. Style **every** heading 3 with a **color** and a **font-size** in pixels",
      "**The staircase:** your heading 1's font-size must be **bigger than every heading 2's**, and every heading 2's must be **bigger than every heading 3's** (for example 48px, then 32px, then 22px)"
    ]),
    S("The card text", [
      "Add **8 paragraphs** of real profile text (the band's story, the albums, the songs, the tour): **3 paragraphs** under your first heading 3, **3 paragraphs** under your second heading 3, and **2 paragraphs** under your third heading 2. Style **every paragraph** with a **font-size** in pixels and a **color**",
      "Make **at least 4 of your 8 paragraphs** **text-align** center",
      "Use **all three letter-case values** somewhere on the page: **text-transform** uppercase on **at least 3** elements, **lowercase** on **at least 1**, and **capitalize** on **at least 1** more (the headings above may count)"
    ]),
    S("Make it pop", [
      "Give **at least 3 elements** both a **color** and a **background-color** (two **different** named colors), like a banner heading or a stat box",
      "Make sure **at least 3 different font-sizes** show up on your page (the staircase already gives you three)"
    ]),
    done()]));

  /* ======================================================================= 6.3  (3.4) ===== */
  A["6.3"] = build([].concat(head("A **text-heavy page** where bold, italics, line breaks, horizontal lines, and **spans** do the work. You choose the topic from **20 ideas**, from a weird restaurant menu to a song lyrics page to a tier list.", "", notes("unit-6/editing-tags-notes.html")), [{ tip: "themes34", label: "See all 20 theme choices" }, RULE,
    { p: "**Every idea uses the same steps.** There is no set layout: you decide what goes where. The steps give the **minimum** you need of each tag and style, and you can ALWAYS add more." },
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color) and **color** (a dark named color for the text)"]),
    S("Build your content", [
      "Add your headings from top to bottom: **one heading 1** (the page's title), then a **heading 2**, then a **heading 3**, then a second **heading 3** (use more if your theme needs them). For now they sit in a row: the next bullet puts paragraphs between them",
      "Put **2 paragraphs** under the heading 1, **2 paragraphs** under the heading 2, **2 paragraphs** under the first heading 3, and **2 paragraphs** under the second heading 3. That is **8 paragraphs** in all about your theme (real words, in your own voice)"
    ]),
    S("Editing tags", [
      "Make **at least 3** words or phrases **bold**",
      "Make **at least 1** word or phrase in **italics**",
      "Use **at least 3 line breaks** (a new line inside a paragraph, like lyrics or an address)",
      "Use **at least 2 horizontal lines**, each one **outside** any paragraph, to separate sections of your page"
    ]),
    S("Style it", [
      "Use **at least 3 different colors** on the page (text colors and background colors count together)",
      "Use **at least 2 different font sizes** in pixels (like 44px for a title and 16px for small print)",
      "Make **at least 1** tag **text-align** center (or right, if it fits)",
      "Make **at least 1** thing **text-transform** uppercase: a whole section, a paragraph, a single word, or even just one letter"
    ]),
    S("Spans and double styles", [
      "Use **at least 4 span tags** for effect, each with its own style attribute: color one word in a paragraph, make the first letter of a word bigger, highlight a phrase with a **background-color**, and so on. Click the help button to see how a span works",
      "Make sure **at least 6** of your tags each have **two or more style properties** in their style attribute (with a semicolon between them). You can use more"
    ]),
    done()]));

  /* ======================================================================= 6.35  (3.5) ===== */
  A["6.35"] = build([].concat(head("A **font showcase page** where the fonts are the joke. Pick one of **6 themes** (or your own, with your teacher's OK). Use fonts that match the **mood**, so the page looks designed, not thrown together.", "", notes("unit-6/google-fonts-notes.html")), [{ tip: "themes35", label: "See the theme choices" }, RULE2,
    { p: "**Every theme uses the same steps.** There is no set layout: you decide what goes where. The steps give the **minimum** you need, and you can ALWAYS add more. **Design rule:** give your headings one display font, your paragraphs one easy-to-read font, and use other fonts as accents with spans." },
    skeleton(["On the **body** tag, add a style: **background-color** (a named color)"]),
    S("Choose and link your fonts", [
      "Pick your theme (click the button above to see the choices)",
      "Go to **fonts.google.com** and click **Filters**. Type your page's title as **sample text** and browse by **feeling** to pick **at least 3 fonts** that fit your theme, then get the **link** code. Paste the **link** tag (or tags) **inside the head**, under your title. Click the help button for the steps",
      "Check that your link(s) bring in **at least 3 different fonts** (one link can hold several fonts)"
    ]),
    S("Build your content", [
      "Add your headings from top to bottom: **one heading 1**, then a **heading 2**, then a **heading 3**, then a second **heading 3**. For now they sit in a row: the next bullet puts paragraphs between them",
      "Put **2 paragraphs** under the heading 1, **2 paragraphs** under the heading 2, and **1 paragraph** under each heading 3. That is **6 paragraphs** in all for your theme (real words, in your own voice)"
    ]),
    S("Use your fonts", [
      "Use **at least 3 different Google fonts** on your page. Set each one with **font-family** in a style attribute: the font's name in quotes",
      "End **every** font-family with a **fallback family** (**serif**, **sans-serif**, **monospace**, **cursive**, or **fantasy**), after a comma, so your page still works if a font fails to load",
      "Put a **font-family** on **at least 6 tags** (headings and paragraphs)",
      "Make it look **designed**: **at least 4 paragraphs** share the **same font**, and **at least 2 headings** share the **same font**. Use the other fonts as accents",
      "Use **at least 3 spans**, each with its own style attribute, to change a few words for effect (a different **font**, **color**, **font-size**, or **background-color**). Click the help button to see how a span works",
      "**BONUS (+5 points):** use fallback families from **4 different families** (serif, sans-serif, monospace, and cursive) and still make the page look good, not thrown together"
    ]),
    S("Use what you already know", [
      "Use **at least 3 different colors** on the page and **at least 2 different background-colors** (the body counts)",
      "Make **at least 2** words or phrases **bold** and **at least 2** in **italics**",
      "Use **at least 3 line breaks** and **at least 2 horizontal lines** (outside any paragraph)",
      "Use **at least 2 different font sizes** in pixels, make **at least 2** tags **text-align** center (or right), and make **at least 2** things **text-transform** uppercase"
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
    S("Use what you already know", [
      "Go to **fonts.google.com**, pick **2 fonts** that fit your poster, and paste the **link** tag **inside the head**, under your title (one link can hold both fonts)",
      "Use **font-family** on **at least 2 tags** (like your heading 1 and a paragraph), a **different** Google font on each. End **each** font-family with a **fallback family** (**serif**, **sans-serif**, **monospace**, **cursive**, or **fantasy**), after a comma: one fallback for each of the 2 fonts"
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
  A["6.7"] = build([].concat(head("A **photo page** where the pictures are the stars, with a **favicon** on the browser tab. Pick one of **10 themes**, or make up your own with your teacher's OK. There is no set layout: you decide where everything goes.", "", notes("unit-6/images-notes.html")), [{ tip: "themes37", label: "See all the theme choices" }, RULE2,
    { p: "**Every theme uses the same steps.** Each step gives the **minimum** you need, and you can ALWAYS add more. Use your own pictures (**Checks**, then **My images**, then **Insert**) or real web addresses." },
    skeleton(["On the **body** tag, add a style: **background-color** (a named color)"]),
    S("Pick your theme", [
      "Choose a theme (click the button above to see all 10 choices, or make up your own with your teacher's OK) and plan where your pictures will go"
    ]),
    S("The head: favicon and font", [
      "Add a **favicon** inside the head: a **link** tag with **rel** set to icon and an **href** with the address of a small picture (or the emoji trick in the help). Look at the tab above your preview to see it",
      "Add a **Google Fonts link** inside the head and pick at least one font that fits your theme (use Filters and sample text, like in 3.5)"
    ]),
    S("Build your page", [
      "At the top of the body, add **one heading 1** with your page's name",
      "Right under the heading, add a **paragraph** that introduces your theme. **Inside** that paragraph, add a **line break** (br) so the text continues on a second line",
      "Under the paragraph (**outside** it), add a **horizontal line** (hr). Your pictures go under this line in the next step"
    ]),
    S("The pictures", [
      "Under the horizontal line, add **5 pictures**, one after another. Each one needs a **src** that is a web address (upload one with Insert, or use a real address)",
      "Give **every** picture a real **alt** attribute that describes it (never leave the placeholder)",
      "Give **every** picture a **border** in its style attribute (thickness, style, and color, like 4px solid navy). Try different styles and colors",
      "Give **every** picture a **width** in its style attribute (like 300px) so none is giant. Put it in the same style attribute as the border, with a semicolon between"
    ]),
    S("Style the words", [
      "Use your **Google font** on at least one tag with **font-family**, ending with a **fallback family**",
      "Make at least one word or phrase **bold** or in **italics**",
      "Use at least one **span** with its own style to change a few words (a color, size, or font)"
    ]),
    S("Bring back what you know", [
      "Use **at least one heading 2** and **at least one heading 3** (headings above your pictures work well)",
      "Make **at least one** thing **text-transform** uppercase",
      "Use **solid**, **dashed**, and **dotted** borders **at least 2 times each**. Your picture borders count, and you can add borders to headings or paragraphs too",
      "Use a **one-sided border** (like border-bottom) **at least 2 times**, for example under your headings"
    ]),
    done()]));


  /* ======================================================================= 6.75  (3.8) ===== */
  A["6.75"] = build([].concat(head("An **emoji and symbol page** where pasted characters do the talking. Every emoji and symbol is **text** you copy and paste: no image tags, no uploads. Pick one of **6 themes**. There is no set layout: you decide where everything goes.", "", notes("unit-6/emojis-symbols-notes.html")), [{ tip: "themes38", label: "See all 6 theme choices" }, RULE2,
    { p: "**Every theme uses the same steps.** Each step gives the **minimum** you need, and you can ALWAYS add more. Open the **notes** and use the **character pad** to copy emojis and symbols, then paste them **between your tags**, never inside a tag's angle brackets." },
    skeleton(["On the **body** tag, add a style: **background-color** (a named color)"]),
    S("Pick your theme", [
      "Choose a theme (click the button above to see all 6 choices) and plan where your pasted characters will go"
    ]),
    S("The head: favicon and font", [
      "Add a **favicon** inside the head: a **link** tag with **rel** set to icon and an **href**. Make it from an **emoji** with the emoji trick in the help. Look at the tab above your preview to see it",
      "Add a **Google Fonts link** inside the head and pick at least one font that fits your theme (use Filters and sample text, like in 3.5)"
    ]),
    S("Headings and words", [
      "Add **one heading 1** with your page's name, and **paste an emoji** into it. Style it: **color**, **background-color**, **font-size** in pixels (like 46px), **text-align** center, **text-transform** uppercase, a **solid border** (thickness, style, color in that order), and your **Google font** in a **font-family** that ends with a **fallback family**",
      "Under it, add a **paragraph** that introduces your theme. Style it: **text-align** center and **font-size** 20px. **Inside** it, put one phrase in **italics**, and add **2 spans**, each wrapped around a single pasted **symbol** (like a star or a heart) with its own **font-size** in pixels and its own **color**",
      "Under the paragraph, add your **first heading 2** (a section of your page), then a **second heading 2**, then a **third heading 2**, one after another. **Paste an emoji or a symbol** into each one. Style each with a **color** and a border on **one side only** (like border-bottom: 4px dashed). The next bullets fill in the space between them",
      "Add a **heading 3** **right under your first heading 2** and a second **heading 3** **right under your second heading 2**, each with a **symbol** pasted in. Style at least one with **text-transform** uppercase",
      "Write **6 paragraphs** about your theme, each with **4 or more real words**: **2 paragraphs** under your first heading 3, **2 paragraphs** under your second heading 3, and **2 paragraphs** under your third heading 2. The emojis add to your words, they never replace them"
    ]),
    S("Paste your characters", [
      "Paste **at least 10 emojis** in all, with **at least 6 different** ones. Spread them through your headings, paragraphs, and lists",
      "Paste **at least 4 different symbols** (like ★ ♥ → ° © ®) from the Symbols groups of the pad",
      "Make a **list** (a ul or an ol) with **at least 4 items**, and **start every item** with a pasted emoji or symbol. Add **list-style-type: none** to the list if you do not want the bullets as well",
      "Make **one emoji or symbol big**: give the tag that holds it a **font-size** of **40px or more** (a row of three big emojis works well)",
      "At the very bottom, add a **footer paragraph** with the **copyright symbol** (©) in it. Style it: **text-align** center, **font-size** 14px, and a **border**"
    ]),
    S("Bring back what you know", [
      "Add **at least 2 pictures**. Each needs a **src** web address (the Insert button in **My images** adds one for you), a real **alt** description, and a **width** in **percent** (like 50%)",
      "Use **solid**, **dashed**, and **dotted** borders **at least 2 times each**. Your picture borders count, and you can add borders to headings or paragraphs too",
      "Use a border on **one side only** (like border-bottom) **at least 2 times**. Your heading 2s count",
      "Use **bold** on at least one phrase, at least **1 line break** inside a paragraph, and at least **1 horizontal line** outside any paragraph"
    ]),
    done()]));

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
