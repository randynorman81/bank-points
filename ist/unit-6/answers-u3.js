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
  var RULE = { p: "**Every theme uses these same steps.** Use **named colors** (like navy or tomato) unless a step says hex. If you already know **hex codes** (like #1E90FF), you may use those instead anywhere a color is asked for. Dark backgrounds need light text. Each step says the least you must add: you can ALWAYS add more." };
  var RULE2 = { p: "You may use **hex codes** (like #1E90FF) instead of named colors if you already know them. Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with each property and value **inside** the quotes. When you put **two or more** properties in one style attribute, put a **semicolon between them** (a single property does not need one). Each step says the least you must add: you can ALWAYS add more." };
  function skeleton(extra) {
    return S("Skeleton and title", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your page's name",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags"
    ].concat(extra || []));
  }
  function done(extra) {
    return S("Test and submit", (extra || []).concat([
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ]));
  }

  /* ======================================================================= 6.2  (3.2) ===== */
  A["6.2"] = build([].concat(head("**The Ugliest Website Ever.** Make the most **god-awful, eye-burning** website you can using **text colors and background colors**. The uglier the better (but every word must still be there).", "a **terrible movie fan page**, a **terrible holiday page**, or a **terrible school-cafeteria review page**", notes("unit-6/style-attribute-notes.html")), [{ tip: "colorlist", label: "See all the named colors" }, RULE2,
    { p: "**The big idea:** almost every tag on your page gets BOTH a **color** (the text) and a **background-color** (behind the text). Then you build a **pattern**: reuse the same two or three color combinations over and over, so your page is ugly **on purpose**." },
    S("Skeleton and title", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your terrible page's name",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags"
    ]),
    { p: "**From here on you build and style each tag at the same time:** when you add a tag, put its style on it right away, before you move on to the next tag." },
    S("Color the whole page", [
      "On the **body** tag, add a style with **both** a **background-color** (a loud named color) **and** a **color** (a different named color for the text). Put both properties in **one** style attribute, with a semicolon between them",
      "**Remember:** the style on the body gives the **whole page** its basic colors, and every tag inside inherits them. But you can **override** those colors on any single tag by giving that tag its own style attribute with new colors. That is how you will make each heading and paragraph different in the next steps"
    ]),
    S("The heading 1", [
      "Inside the body, add **one heading 1** with the page's name. **Right away**, style it with **color** and **background-color** together (two different named colors)"
    ]),
    S("Section 1", [
      "Under the heading 1, add your **first heading 2** (the title of a section). **Right away**, style it with **color** and **background-color** together (two different named colors). Remember the two colors: your next heading 2 has to use the same ones",
      "**Right under that heading 2**, add **2 paragraphs** (a couple of real sentences each, about your topic). Style **each paragraph** as soon as you add it, with **color** and **background-color** together (two different named colors). **Every paragraph on the page must look different from all the others**: no two can share a text color, and no two can share a background color"
    ]),
    S("Section 2", [
      "Add your **second heading 2**. **Right away**, style it with **exactly the same** **color** and **background-color** as your first heading 2, so your headings look like a matching set (a **pattern**)",
      "**Right under it**, add **2 paragraphs** about your topic, each styled as soon as you add it with **color** and **background-color** (two different named colors, and different from every other paragraph so far)"
    ]),
    S("Section 3", [
      "Add your **third heading 2**. **Right away**, style it with **color** and **background-color** together (two different named colors; the same ones as the other headings is fine)",
      "**Right under it**, add **2 paragraphs** about your topic, each styled as soon as you add it with **color** and **background-color**. That makes **6 paragraphs** in all, and **no two of them** share a text color or a background color"
    ]),
    S("Finishing touches", [
      "Check that nothing is hidden: wherever you use both **color** and **background-color**, they must be **different** colors. Ugly is fine. Invisible is not",
      "**A sneak peek (we cover it fully in 3.4):** the **span** tag wraps just a few words inside a paragraph or heading, and the span can have its own style attribute. So you can give a word, or even a single letter, its own **color** (or **background-color**) that overrides the paragraph's. Put the span **inside** the tag, and close it before the tag closes. Click the help button to see it work",
      "**BONUS (+5 points):** use the span tag to color words on your page. Either wrap **at least 3 whole words**, each in its own span with a **color**, OR make **one rainbow word** by giving **each letter** of a word its own span and its own **color**. Your auto score goes above 100 when you finish all the required steps AND earn this bonus"
    ]),
    S("Test and submit", [
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* ======================================================================= 6.20  (3.3) ===== */
  A["6.20"] = build([].concat(head("An **epic poster** for a **made-up holiday**: invent a holiday (like National Pizza Rolls Day or Opposite Day) and design the poster that announces it.", "", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and background", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your holiday's name",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style: **background-color** (a named color, like black or navy)"
    ]),
    S("The name and tagline", [
      "Inside the body, add **one heading 1** with the holiday's name. Style it: **color** (a bright named color), **font-size** in pixels (like 58px), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** with a short tagline. Style it: **color** (any named color, even the same one as your heading 1 if you want them to match), **text-transform** uppercase, **text-align** center, and **font-size** 24px"
    ]),
    S("When and where", [
      "Add a **heading 3** that says **\"When\"** (the word When has to be in it), with a **color** style. Under it, add a **paragraph** with the date (and time, if it has one). Style the paragraph: **color** (light on a dark background), **font-size** 20px, and a **background-color** (a named color)",
      "Add a **heading 3** that says **\"Where\"** (the word Where has to be in it), with a **color** style. Under it, add a **paragraph** with where people celebrate it. Style it: **color** and **font-size** 20px"
    ]),
    S("Traditions, a finishing touch, and contact info", [
      "Add a third **heading 3** that says **\"Traditions\"** (the word Traditions has to be in it), after your When and Where headings. Style it: **color**, **text-transform** uppercase, **text-align** center. You can reuse the same colors as your other headings so everything looks uniform",
      "Under it, add a **paragraph** about how people celebrate (the food, the games, the things you do). Style it: **color**, **font-size** 20px, **text-align** center, and a **background-color**",
      "Add one **paragraph** with a fun fact or a funny warning about the holiday. Style it: **color**, **font-size** 16px, and **text-align** center",
      "At the very bottom, add a second **heading 2** that says **\"Contact Information\"** (those two words have to be in it). Style it: **color** and **text-align** center",
      "Under it, add a **paragraph** that lists your contact info with **at least 4 words** (an email, a phone number, or a social media name; it can be made up, like \"Email sleepy@example.org or call 555-0199\"). Style it: **color** and **text-align** center",
      "**EXTRA CREDIT (+5 points): the span tag.** A **span** wraps just a few words inside a paragraph or heading so those words can have their own style attribute, different from the rest of the line (we cover it fully in 3.4). Use the span tag **at least twice** anywhere on your poster, each with its own style, like a different **color**, **font-size**, or **text-transform** on a few words. Click the help button to see how it works",
      "**EXTRA CREDIT (+5 more points):** put a span **inside your heading 1** so part of the title has its own **color** and its own **font-size** in pixels (like one big word in a different color). Your auto score can go above 100 when everything required is done"
    ]),
    done()]));

  /* ======================================================================= 6.21  (3.3 Part 2: extra practice, movie or game review) ===== */
  A["6.21"] = build([].concat(head("**A review page** for a movie or video game you know well. This is **extra 3.3 practice** (Part 2): the same font-size, text-align, and letter-case skills as the poster, on a brand-new page.", "a movie or a video game", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and colors", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with the name of what you are reviewing",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style with a **background-color** and a **color** (two **different** named colors, so the text can be read)"
    ]),
    { p: "**From here on you build and style each tag at the same time:** when you add a tag, put its style on it right away, before you move on to the next tag." },
    S("The name and the tagline", [
      "Inside the body, add **one heading 1** with the title of the movie or game. **Right away**, style it: **color**, **font-size** in pixels (**36px or bigger**), **text-align** center, and **text-transform** uppercase",
      "Under it, add a **heading 2** for a short verdict (like Fast, funny, and worth watching). **Right away**, style it: **color**, **font-size** in pixels, **text-align** center, and **text-transform** capitalize (so every word starts with a capital letter)"
    ]),
    S("Review section 1", [
      "Under the verdict, add your **first review heading 2** (like Story). **Right away**, style it: **color**, **font-size** in pixels, **text-transform** uppercase, and **text-align** center",
      "**Right under that heading 2**, add **2 paragraphs** (two or three sentences each, about the story, the characters or gameplay, and what you liked or did not like). Style **each paragraph** as soon as you add it with a **color** and a **font-size** in pixels (like 18px). Make the **first** paragraph **text-align** center, and give the **second** paragraph **both a color and a background-color** (two **different** named colors) so it stands out"
    ]),
    S("Review section 2", [
      "Add your **second review heading 2** (like Characters or Gameplay). **Right away**, style it the same way: **color**, **font-size** in pixels, **text-transform** uppercase, and **text-align** center",
      "**Right under it**, add **2 paragraphs**, each styled as soon as you add it with a **color** and a **font-size** in pixels. Make the **first** one **text-align** center, and give the **second** one **both a color and a background-color** (two **different** named colors)"
    ]),
    S("Review section 3", [
      "Add your **third review heading 2** (like Final Verdict). **Right away**, style it the same way: **color**, **font-size** in pixels, **text-transform** uppercase, and **text-align** center",
      "**Right under it**, add **2 paragraphs**, each styled as soon as you add it with a **color** and a **font-size** in pixels. Make the **first** one **text-align** center. That makes **6 paragraphs** in all, 2 under every heading 2"
    ]),
    S("Rating and release info", [
      "At the bottom, add a **heading 3** that says **\"Rating\"** (the word Rating has to be in it). **Right away**, style it: **color**, **text-align** center, and **text-transform** lowercase",
      "**Right under it**, add a **paragraph** with your rating out of 10 and a reason. Style it as soon as you add it with a **color** and a **font-size** in pixels",
      "Add a second **heading 3** that says **\"Release Info\"** (those words have to be in it). **Right away**, style it: **color** and **text-align** center",
      "**Right under it**, add a **paragraph** with the year it came out and who made it. Style it as soon as you add it with a **color** and a **font-size** in pixels"
    ]),
    done()]));

  /* ======================================================================= 6.22  (3.3 Part 3: extra practice, band or artist profile) ===== */
  A["6.22"] = build([].concat(head("**A profile page** for a band or music artist, built so the **sizes shrink** from the biggest heading to the smallest. This is **extra 3.3 practice** (Part 3): the same font-size, text-align, and letter-case skills, on another brand-new page.", "a real band or artist you like, or a made-up one", notes("unit-6/text-size-align-notes.html")), [RULE,
    RULE2,
    S("Skeleton, title, and colors", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with the band or artist's name",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style with a **background-color** and a **color** (two **different** named colors)"
    ]),
    { p: "**From here on you build and style each tag at the same time:** when you add a tag, put its style on it right away, before you move on to the next tag." },
    S("The band name", [
      "Add **one heading 1** with the band or artist's name. **Right away**, style it: **color**, **font-size** in pixels (**40px or bigger**), **text-align** center, and **text-transform** uppercase"
    ]),
    S("Section 1", [
      "Under the heading 1, add your **first heading 2** (like Albums). **Right away**, style it: **color**, **background-color** (a different named color), **font-size** in pixels, and **text-transform** capitalize",
      "**Right under that heading 2**, add a **heading 3** (like Genre). **Right away**, style it: **color**, **font-size** in pixels, and **text-transform** uppercase",
      "**Right under the heading 3**, add **3 paragraphs** of real profile text. Style **each paragraph** as soon as you add it with a **font-size** in pixels and a **color**, and make the **first 2** paragraphs **text-align** center"
    ]),
    S("Section 2", [
      "Add your **second heading 2** (like Famous Songs). **Right away**, style it: **color**, **background-color** (a different named color), **font-size** in pixels, and **text-transform** capitalize",
      "**Right under it**, add a **heading 3** (like Formed In). **Right away**, style it: **color**, **font-size** in pixels, and **text-transform** lowercase",
      "**Right under the heading 3**, add **3 paragraphs** of real profile text. Style **each paragraph** as soon as you add it with a **font-size** in pixels and a **color**, and make the **first 2** paragraphs **text-align** center"
    ]),
    S("Section 3", [
      "Add your **third heading 2** (like Tour Dates). **Right away**, style it: **color**, **background-color** (a different named color), **font-size** in pixels, and **text-transform** capitalize",
      "**Right under it**, add **2 paragraphs** of real profile text. Style **each paragraph** as soon as you add it with a **font-size** in pixels and a **color**, and make the **last** paragraph **text-transform** uppercase"
    ]),
    S("The size staircase", [
      "**Check the staircase:** your heading 1's font-size must be **bigger than every heading 2's**, and every heading 2's must be **bigger than every heading 3's** (for example 48px, then 32px, then 22px). Change a size if one is out of order"
    ]),
    done()]));

  /* ======================================================================= 6.23  (3.3 CHECKLIST DRAFT, teacher only: skeleton walkthrough, pick a theme, then a checklist of counts and design limits that can go anywhere) ===== */
  A["6.23"] = build([].concat([
    { h: "What you are building" },
    { p: "A page about a theme you pick. Build the skeleton first, then the checklist tells you what your page needs **somewhere**. Styles go inside a **style attribute**, with a **semicolon** between properties. Use named colors (or hex codes if you know them)." },
    { id: "theme", t: "pick", q: "Pick your theme (check ONE box)", opts: ["A pizza shop", "A gym", "A bakery", "A school club", "A band", "A video game", "A sports team", "An animal shelter", "A movie", "A food truck"] }
  ], [
    S("Skeleton", [
      "**DOCTYPE** added at the very top of the page",
      "**html** tags added (the head tags and body tags go inside the html tags)",
      "**head** tags added (with a **title** tag inside)",
      "**body** tags added"
    ]),
    S("The checklist: tags (anywhere on your page)", [
      "Use **exactly 1 heading 1** (the name of your page)",
      "Use **at least 3 heading 2s** (the titles of your sections)",
      "Use **at least 3 heading 3s** (small labels, like Hours, Menu, or Contact)",
      "Use **at least 5 paragraphs** (a few real sentences each)"
    ]),
    S("The checklist: styles (anywhere on your page)", [
      "Use **text color at least 3 times** (on 3 different tags, not counting the body)",
      "Use **background-color at least 2 times** (on 2 different tags, not counting the body)",
      "Use **font-size in pixels at least 4 times**, with **at least 3 different sizes** (like 40px, 28px, 18px)",
      "Use **text-align at least 3 times**: either **center** or **right**",
      "Use **text-transform at least 3 times**, with **at least 2 different values** (uppercase, lowercase, or capitalize)"
    ]),
    S("Design limits (this is what makes it look real)", [
      "Use **no more than 5 different colors** on the whole page (text colors and background colors together; span words for the bonus do not count). Pick a small palette and reuse it",
      "Wherever a tag has **both** a color and a background-color, they must be **different**, and the text must be easy to read",
      "Use **no more than 5 different font sizes** on the whole page. Same kind of tag, same size: for example, all your heading 2s match"
    ]),
    S("Bonus (optional, for when you finish early)", [
      "**BONUS (+5 points):** use the **span** tag to color words on your page. A span wraps just a few words inside a paragraph or heading, and it can have its own style attribute. Either wrap **at least 3 whole words**, each in its own span with a **color**, OR make **one rainbow word** by giving **each letter** of a word its own span and its own **color**. Put the span **inside** the tag and close it before the tag closes. Your auto score goes above 100 when you finish the whole checklist AND earn this bonus"
    ]),
    done()]));

  /* ======================================================================= 6.24  (3.4 CHECKLIST DRAFT, teacher only: new items 3 times each, a few older ones to choose, design limits) ===== */
  A["6.24"] = build([].concat([
    { h: "What you are building" },
    { p: "A text page about a theme you pick. Build the skeleton, then the checklist tells you what your page needs **somewhere**. Styles go inside a **style attribute**, with a **semicolon** between properties. Use named colors (or hex codes if you know them)." },
    { id: "theme", t: "pick", q: "Pick your theme (check ONE box)", opts: ["A weird restaurant menu", "Song lyrics", "A tier list", "A movie review", "A recipe", "A sports recap", "A study guide", "A top 10 list", "A product review", "A funny story"] }
  ], [
    S("Skeleton", [
      "**DOCTYPE** added at the very top of the page",
      "**html** tags added (the head tags and body tags go inside the html tags)",
      "**head** tags added (with a **title** tag inside)",
      "**body** tags added"
    ]),
    S("The basics (anywhere on your page)", [
      "Use **exactly 1 heading 1** (the name of your page)",
      "Use **at least 2 heading 2s** (the titles of your sections)",
      "Use **at least 4 paragraphs** (a few real sentences each)",
      "Use a **text color** on at least 2 tags and a **background-color** on at least 1 tag (not counting the body)"
    ]),
    S("New this lesson: use each one at least 3 times", [
      "**Bold** text: at least **3** (use the strong tag or the b tag)",
      "**Italic** text: at least **3** (use the em tag or the i tag)",
      "**Line breaks**: at least **3** (the br tag, inside a paragraph)",
      "**Horizontal lines**: at least **3** (the hr tag, between your sections)",
      "**Spans with their own style**: at least **3** (a span around a few words, with a color or other style)"
    ]),
    S("From earlier lessons: use at least 3 of these 4", [
      "Use **at least 3** of these 4 anywhere on your page (pick the ones that fit your theme):\n\u2022 **heading 3**\n\u2022 **font-size** in pixels\n\u2022 **text-align**\n\u2022 **text-transform**"
    ]),
    S("Design limits (this is what makes it look real)", [
      "Use **no more than 5 different colors** on the whole page (text colors and background colors together; span words do not count). Pick a small palette and reuse it",
      "Wherever a tag has **both** a color and a background-color, they must be **different**, and the text must be easy to read",
      "Use **no more than 5 different font sizes** on the whole page. Same kind of tag, same size"
    ]),
    S("Bonus (optional, for when you finish early)", [
      "**BONUS (+5 points):** use **all 4** of the earlier-lesson items and still keep the page looking clean:\n\u2022 **heading 3**\n\u2022 **font-size** in pixels\n\u2022 **text-align**\n\u2022 **text-transform**\nYour teacher may also add extra credit for good design"
    ]),
    done()]));

  /* ======================================================================= 6.3  (3.4) ===== */
  A["6.3"] = build([].concat(head("A **text-heavy page** where bold, italics, line breaks, horizontal lines, and **spans** do the work. You choose the topic from **20 ideas**, from a weird restaurant menu to a song lyrics page to a tier list.", "", notes("unit-6/editing-tags-notes.html")), [{ tip: "themes34", label: "See all 20 theme choices" }, RULE,
    { p: "**Every idea uses the same steps, and you build the page from the top to the bottom, in order.** Each bullet adds one piece and styles it right away, so you never go back to an earlier step. Your theme decides the words, colors, and fonts. Each step says the least you must add: you can ALWAYS add more." },
    skeleton(["On the **body** tag, add a style with **both** a **background-color** (a light named color) **and** a **color** (a dark named color for the text)"]),
    S("The title and the intro", [
      "Inside the body, add **one heading 1** with your page's title. **Right away**, style it: **color**, **font-size** in pixels (like 44px), **text-align** center, and **text-transform** uppercase",
      "Right under the heading 1, add a **paragraph** that introduces your theme. Inside it, make a phrase **bold** and add a **line break** (a new line inside the paragraph). **Right away**, style the paragraph: **color** and **font-size** in pixels (like 18px)",
      "Under that paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Section 1", [
      "Add your first **heading 2** (a section of your page). **Right away**, style it: **color** and **text-transform** uppercase",
      "Right under it, add a **paragraph** about your theme. Inside it, put a phrase in **italics** and one word in a **span** with its own style (like a **color**). **Right away**, style the paragraph: **color** and **background-color** (two different named colors)",
      "Under it, add your first **heading 3**. **Right away**, style it: **color** and **font-size** in pixels (like 22px)",
      "Right under the heading 3, add **2 paragraphs**. In the **first**, put a **bold** phrase, a **line break**, and a **span** with its own style. In the **second**, put a **span** with its own style (like a **background-color** on a phrase). Style each paragraph right away with a **color**",
      "Under the last paragraph (**outside** it), add a second **horizontal line**"
    ]),
    S("Section 2", [
      "Add your second **heading 3**. **Right away**, style it: **color** and **text-align** center",
      "Right under it, add **2 paragraphs**. In the **first**, put a **bold** phrase, a **line break**, and a **span** with its own style. Style **each** paragraph right away with a **color** and a **font-size** in pixels"
    ]),
    S("Closing and minimums", [
      "At the bottom, add **2 closing paragraphs** (that makes **8 paragraphs** in all). Style each right away with a **color** and a **font-size** in pixels",
      "Check your editing tags: you should have at least **3 bold** phrases, **3 line breaks**, and **4 spans** with their own styles in all. Your steps above already add them, so count them in your page",
      "Check your styles: at least **3 different colors**, **2 different font sizes** in pixels, and **6 tags** that each have **two or more style properties**"
    ]),
    done()]));

  /* ======================================================================= 6.35  (3.5) ===== */
  A["6.35"] = build([].concat(head("A **font showcase page** where the fonts are the joke. Pick one of **6 themes** (or your own, with your teacher's OK). Use fonts that match the **mood**, so the page looks designed, not thrown together.", "", notes("unit-6/google-fonts-notes.html")), [{ tip: "themes35", label: "See the theme choices" }, RULE2,
    { p: "**Every theme uses the same steps, and you build the page from the top to the bottom, in order.** Each bullet adds one piece and styles it right away, so you never go back to an earlier step. Your theme decides the words, colors, and fonts. Each step says the least you must add: you can ALWAYS add more." },
    S("The head and the body", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your page's title",
      "Pick your theme (click the button above to see the choices). Go to **fonts.google.com** and click **Filters**. Type your page's title as **sample text** and browse by **feeling** to pick **at least 3 fonts** that fit your theme, then get the **link** code. Click on the line **under** the title (still inside the head) and paste the **link** tag (or tags). Click the help button for the steps",
      "Check that your link(s) bring in **at least 3 different fonts** (one link can hold several fonts)",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style: **background-color** (a named color)"
    ]),
    S("The heading 1", [
      "Inside the body, add **one heading 1** with your page's title. **Right away**, style it: **font-family** (your headline font in quotes, then a comma and a **fallback family** like **cursive**), **color**, **font-size** in pixels (like 44px), **text-align** center, and **text-transform** uppercase. Use this same headline font on your other headings"
    ]),
    S("The intro", [
      "Right under the heading 1, add a **paragraph** that introduces your theme. Inside it, put a phrase in **bold** and add a **line break**. **Right away**, style it: **font-family** (an easy-to-read font in quotes, then a fallback family), **color**, and **font-size** in pixels. Use this same easy-to-read font on **every paragraph**",
      "Under that paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Section 1", [
      "Add a **heading 2**. **Right away**, style it: your headline **font-family** (with a fallback), **color**, and **text-transform** uppercase",
      "Right under it, add a **paragraph**. Inside it, put a phrase in **italics** and a **span** with its own style that uses your **third font** as an accent (a different **font-family** and a **color**). **Right away**, style the paragraph: your paragraph **font-family**, **color**, and **background-color**",
      "Add your first **heading 3**. **Right away**, style it: your headline **font-family** (with a fallback), **color**, and **text-align** center",
      "Right under it, add **2 paragraphs** about your theme. In the **first**, put an **italic** phrase. In the **second**, put a **bold** phrase and a **line break**. Style each right away with your paragraph **font-family** and a **color**",
      "Under the last paragraph (**outside** it), add a second **horizontal line**"
    ]),
    S("Section 2", [
      "Add your second **heading 3**. **Right away**, style it: your headline **font-family** (with a fallback), **color**, and **background-color**",
      "Right under it, add **2 paragraphs**. In the **first**, also add a **line break**. Style each right away with your paragraph **font-family** and a **color**, and put a **span** with its own style (a different **font**, **color**, **font-size**, or **background-color** on a few words) in each"
    ]),
    S("Check your minimums", [
      "Check your fonts: at least **6 paragraphs** in all, **3 different Google fonts** used in font-family styles, **every** font-family ending with a **fallback family**, and at least **6 tags** with a font-family",
      "Make sure it looks **designed**: at least **4 paragraphs** share the **same font**, and at least **2 headings** share the **same font**",
      "Check your extras: at least **2 bold**, **2 italic**, **3 line breaks**, and **3 spans** with their own styles in all",
      "Check your styles: at least **3 different colors**, **2 different background-colors** (the body counts), and **2 different font sizes** in pixels",
      "**BONUS (+5 points):** use fallback families from **4 different families** (serif, sans-serif, monospace, and cursive) and still make the page look good, not thrown together"
    ]),
    done()]));

  /* ======================================================================= 6.4  (3.5) ===== */
  A["6.4"] = build([].concat(head("The **ultimate Wanted poster** for an outlaw on the loose.", "a villain, your pet who stole the snacks, or a made-up criminal", notes("unit-6/borders-notes.html")), [RULE,
    skeleton(["On the **body** tag, add a style: **background-color** (a light named color)"]),
    S("The banner", [
      "Add **one heading 1** that says **\"WANTED\"** (the word WANTED has to be in it; you can add more words, like WANTED: Captain Crumbs). Style it: **color**, **background-color**, **font-size** 56px, **text-align** center, **text-transform** uppercase, and a **solid border** (thickness, style, color in that order, like 6px solid)",
      "Under it, add a **paragraph** listing the crimes. Style it: **font-size** 20px. **Inside** it, color two phrases with **spans** (a **color** style each) and make one phrase **bold**",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Description", [
      "Add a **heading 2** that says **\"Description\"** (that word has to be in it). Style it: **color**, **font-size** 30px, and a border on the **bottom only** (like border-bottom: 4px solid)",
      "Under it, add a **paragraph** with a **bold** word, an **italic** word, and **2 line breaks**",
      "Add a second **paragraph** about the outlaw's habits, with an **italic** word, a **bold** word, and a **line break**. Style it with a **dashed border**"
    ]),
    S("Marks and last seen", [
      "Add a **heading 3** that says **\"Distinguishing Marks\"** (those two words have to be in it). Style it: **text-align** center and **color**. Under it, add a **paragraph** with a **dotted border**",
      "Add a **horizontal line**, then a **heading 2** that says **\"Last Seen\"** (those two words have to be in it). Style it: **text-transform** uppercase, **color**, and a border on the **left only**",
      "Add a **heading 3** that says **\"Known Hideouts\"** (the word Hideouts has to be in it). Style it: **color** and **font-size** 22px. Under it, add a **paragraph** with a **dashed border** in a **different color** than your other dashed border"
    ]),
    S("Reward and warning", [
      "Add a **heading 2** that says **\"Reward\"** (that word has to be in it), with a **color**. Under it, add a **paragraph** with the amount in **bold**. Style it: **background-color**, a **solid border**, **text-align** center, and **font-size** 24px",
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
      "Add a **heading 3** that says **\"Featured\"** (that word has to be in it) and wrap the **whole heading** inside a **link** (an a tag around the h3) with a real https:// address that opens in a **new tab**",
      "Add a **paragraph** where a **bold phrase** is inside a link (the strong tag goes **inside** the a tag)",
      "Finish with a **bullet list** of 3 items. In each item, one link wraps a **bold word** and an **italic word** together. Style the list: **list-style-type** none and **text-align** center"
    ]),
    S("Test and submit", [
      "Click each of your links in the preview and make sure it goes where you expect (and new-tab links open a new tab)",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ])]));

  /* ======================================================================= 6.7  (3.8) ===== */
  A["6.7"] = build([].concat(head("A **photo page** where the pictures are the stars, with a **favicon** on the browser tab. Pick one of **10 themes**, or make up your own with your teacher's OK.", "", notes("unit-6/images-notes.html")), [{ tip: "themes37", label: "See all the theme choices" }, RULE2,
    { p: "**Every theme uses the same steps, and you build the page from the top to the bottom, in order.** Each bullet adds one piece and styles it right away, so you never go back to an earlier step. Your theme decides the words, colors, and fonts. Each step says the least you must add: you can ALWAYS add more." },
    S("The head and the body", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your page's name",
      "Click on the line **under** the title (still inside the head) and add a **favicon**: a **link** tag with **rel** set to icon and an **href** with the address of a small picture (or the emoji trick in the help). Look at the tab above your preview to see it",
      "On the next line (still inside the head), add a **Google Fonts link** and pick at least one font that fits your theme (use Filters and sample text, like in 3.5)",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style: **background-color** (a named color)"
    ]),
    S("The top of the page", [
      "Pick your theme first (click the button above to see all 10 choices) and plan where your pictures will go. Then, inside the body, add **one heading 1** with your page's name. **Right away**, style it: **font-family** (your Google font in quotes, then a comma and a **fallback family**), **font-size** in pixels (like 44px), **text-align** center, **text-transform** uppercase, and a border on **one side only** (like border-bottom: 4px solid)",
      "Right under it, add a **paragraph** that introduces your theme. Inside it, make a phrase **bold** and add a **line break**. **Right away**, style the paragraph with a **font-family** that is a **fallback family** (like sans-serif)",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Pictures 1 and 2", [
      "Add a **heading 2** for your first group of pictures. **Right away**, give it a border on **one side only** (like border-bottom: 4px dashed)",
      "Under it, add your **first picture** (Checks, then My images, then Insert, or a real web address). It needs a **src**, a real **alt** description, and, in its style attribute, a **width** (like 300px) and a **solid border** (like 4px solid navy)",
      "Add your **second picture** the same way: a **src**, a real **alt**, and, in its style attribute, a **width** and a **dashed border** (like 4px dashed)"
    ]),
    S("Pictures 3 to 5", [
      "Add a **heading 3** (a caption for the next pictures)",
      "Under it, add a **paragraph** with a phrase in **italics** and a **span** with its own style (a color, size, or font) that describes the pictures",
      "Add your **third picture**: a **src**, a real **alt**, and, in its style attribute, a **width** and a **dotted border** (like 4px dotted)",
      "Add your **fourth picture** the same way, with a **dotted border**",
      "Add your **fifth picture** the same way, with any border you like (solid, dashed, or dotted)"
    ]),
    S("Check your borders", [
      "Check that **solid**, **dashed**, and **dotted** borders are each used **at least 2 times** (your picture borders and heading borders count), that you have **at least 2** borders on **one side only**, and that **at least 1** thing is **text-transform** uppercase. Your steps above already add them, so count them in your page"
    ]),
    done()]));

  /* ======================================================================= 6.75  (3.8) ===== */
  A["6.75"] = build([].concat(head("An **emoji and symbol page** where pasted characters do the talking. Every emoji and symbol is **text** you copy and paste: no image tags, no uploads. Pick one of **6 themes**.", "", notes("unit-6/emojis-symbols-notes.html")), [{ tip: "themes38", label: "See all 6 theme choices" }, RULE2,
    { p: "**Every theme uses the same steps, and you build the page from the top to the bottom, in order.** Each bullet adds one piece and styles it right away, so you never go back to an earlier step. Your theme decides the words, colors, and fonts. Each step says the least you must add: you can ALWAYS add more." },
    S("The head and the body", [
      "Type the **doctype** line as the very first line, exactly **\"<!DOCTYPE html>\"** (with the exclamation point). Then type the opening **html** tag, and inside it the **head** tags. The editor puts your cursor under the closing head tag, so click on the empty line **between** the head tags and add a **title** with your page's name",
      "Click on the line **under** the title (still inside the head) and add a **favicon**: a **link** tag with **rel** set to icon and an **href**. Make it from an **emoji** with the emoji trick in the help. Look at the tab above your preview to see it",
      "On the next line (still inside the head), add a **Google Fonts link** and pick at least one font that fits your theme (use Filters and sample text, like in 3.5)",
      "Click on the line **under** the closing head tag (still inside the html tags) and type the **body** tags",
      "On the **body** tag, add a style: **background-color** (a named color)"
    ]),
    S("The heading 1", [
      "Choose a theme (click the button above to see all 6 choices). Inside the body, add **one heading 1** with your page's name, and **paste an emoji** into it. **Right away**, style it: **color**, **background-color**, **font-size** in pixels (like 46px), **text-align** center, **text-transform** uppercase, a **solid border** (thickness, style, color in that order), and your **Google font** in a **font-family** that ends with a **fallback family**"
    ]),
    S("The intro", [
      "Right under it, add a **paragraph** that introduces your theme. Inside it, put one phrase in **italics**, make a phrase **bold**, add a **line break**, and add **2 spans**, each wrapped around a single pasted **symbol** (like a star or a heart) with its own **font-size** in pixels and its own **color**. **Right away**, style the paragraph: **text-align** center and **font-size** 20px",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ]),
    S("Section 1", [
      "Add your first **heading 2** and **paste an emoji or a symbol** into it. **Right away**, style it: **color** and a border on **one side only**, a dashed one (like border-bottom: 4px dashed)",
      "Right under it, add a **heading 3** with a **symbol** pasted in. **Right away**, style it: **text-transform** uppercase",
      "Right under the heading 3, add **2 paragraphs** about your theme, each with **4 or more real words**. The emojis add to your words, they never replace them",
      "Add your **first picture** (the Insert button in **My images** adds one for you): a **src** web address, a real **alt** description, and, in its style attribute, a **width** in **percent** (like 50%) and a **solid border**"
    ]),
    S("Section 2", [
      "Add your second **heading 2** and **paste an emoji or a symbol** into it. **Right away**, style it: **color** and a **dashed** border on **one side only**",
      "Right under it, add a **heading 3** with a **symbol** pasted in",
      "Right under the heading 3, add **2 paragraphs** about your theme, each with **4 or more real words**",
      "Add your **second picture** the same way, with a **width** in **percent** and a **dotted border**"
    ]),
    S("Section 3", [
      "Add your third **heading 2** and **paste an emoji or a symbol** into it. **Right away**, style it: **color** and a **dashed** border on **one side only**",
      "Right under it, add **2 paragraphs** about your theme, each with **4 or more real words**",
      "Make a **list** (a ul or an ol) with **at least 4 items**, and **start every item** with a pasted emoji or symbol. Add **list-style-type: none** to the list if you do not want the bullets as well",
      "Make **one emoji or symbol big**: give the tag that holds it a **font-size** of **40px or more** (a row of three big emojis works well)"
    ]),
    S("The footer", [
      "At the very bottom, add a **footer paragraph** with the **copyright symbol** (©) in it. **Right away**, style it: **text-align** center, **font-size** 14px, and a **dotted border**"
    ]),
    S("Check your characters and borders", [
      "Check that you pasted **at least 10 emojis** in all, with **at least 6 different** ones, spread through your headings, paragraphs, and lists",
      "Check that you pasted **at least 4 different symbols** (like ★ ♥ → ° © ®) from the Symbols groups of the pad",
      "Check that **solid**, **dashed**, and **dotted** borders are each used **at least 2 times** (your picture and heading borders count)",
      "Check that you have **at least 2** borders on **one side only** (your heading 2s count)"
    ]),
    done()]));

  /* ======================================================================= THE CHECKLIST LESSONS (3.3 Parts 1 to 3, 3.4 to 3.10), built from checklist-config.js ===== */
  (function () {
    var CL = root.U7_CL; if (!CL) return;
    var BUL = "\n\u2022 ";
    CL.lessons.forEach(function (l) {
      var B = CL.basics, pool = CL.poolFor(l), need = CL.need[l];
      var list = [
        { h: "What you are building" },
        { p: "A page about a theme you pick. Build the skeleton, then the checklist tells you what your page needs **somewhere**. Styles go inside a **style attribute**, with a **semicolon** between properties. Use named colors (or hex codes if you know them)." },
        { id: "theme", t: "pick", q: "Pick your theme (check ONE box)", opts: CL.themes[l] },
        S("Skeleton", [
          "**DOCTYPE** added at the very top of the page",
          "**html** tags added (the head tags and body tags go inside the html tags)",
          "**head** tags added (with a **title** tag inside)",
          "**body** tags added"
        ]),
        S("The basics (anywhere on your page)", [
          "Use **exactly " + B.h1 + " heading 1** (the name of your page)",
          "Use **at least " + B.h2 + " heading 2s** (the titles of your sections)",
          "Use **at least " + B.p + " paragraphs** (a few real sentences each)",
          "Use a **text color** on at least " + B.colorTags + " tags and a **background-color** on at least " + B.bgTags + " tag (not counting the body)"
        ]),
        S("New this lesson: use each one at least 3 times", CL.news[l].map(function (it) { return it.text; }))
      ];
      if (pool.length) list.push(S("From earlier lessons: use at least " + need + " of these " + pool.length, [
        "Use **at least " + need + "** of these " + pool.length + " anywhere on your page (pick the ones that fit your theme):" + pool.map(function (f) { return BUL + "**" + f.label + "**"; }).join("")
      ]));
      var lim = [
        "Use **no more than 5 different colors** on the whole page (text colors and background colors together; span words do not count). Pick a small palette and reuse it",
        "Wherever a tag has **both** a color and a background-color, they must be **different**, and the text must be easy to read",
        "Use **no more than 5 different font sizes** on the whole page. Same kind of tag, same size"
      ];
      if (CL.fontLimit[l]) lim.push("Use **no more than 3 different fonts** on the whole page");
      list.push(S("Design limits (this is what makes it look real)", lim));
      if (pool.length) {
        var bn = Math.min(pool.length, need + 3);
        list.push(S("Bonus (optional, for when you finish early)", ["**BONUS (+5 points):** use **" + bn + " or more** of the " + pool.length + " earlier items and still keep the page looking clean. Your teacher may also add extra credit for good design"]));
      } else {
        list.push(S("Bonus (optional, for when you finish early)", ["**BONUS (+5 points):** use the **span** tag to color words on your page. Wrap **at least 3 whole words**, each in its own span with a **color**, OR make **one rainbow word** by giving **each letter** of a word its own span and its own **color**. Your teacher may also add extra credit for good design"]));
      }
      list.push(done());
      A[l] = build(list);
    });
  })();

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
