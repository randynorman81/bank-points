/* "Setting up your page" steps for lessons 7.1 to 7.5 (see answers.js for the block types and the writing rule:
   describe what to add and where it goes in plain words, say INSIDE / OUTSIDE, and never give copyable tags or code). */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
  var FAMS = ["serif", "sans-serif", "monospace"];
  function grpN(prefix, n, label, fields) {
    return { grp: label + " " + n, fields: fields.map(function (f) { return { id: prefix + n + f[0], q: f[1], t: f[2] || "text" }; }) };
  }

  /* ===================== 7.1 ===================== */
  A["7.1"] = [
    { h: "What you are creating" },
    { make: "Your very first website: a plain, text-heavy page about a topic you know or want to learn about, like a mini encyclopedia article. You will write the page's skeleton yourself, organize the page with headings, and fill it with paragraphs. It will look plain, and that is on purpose. In the next lessons you will learn to make pages that look amazing." },
    { p: "Here is your page from top to bottom:" },
    { map: [
      "The doctype line, on the very first line",
      "The html container (everything else goes INSIDE it)",
      "HEAD: holds the page title (Step 1)",
      "BODY: everything people see (Steps 4 and 5)",
      "Heading 1: the name of your topic",
      "Section heading (heading 2), then its paragraphs",
      "Section heading (heading 2), then its paragraphs ...at least 3 sections",
      "Last paragraph: your sources"
    ] },
    { p: "**Your finished page must have:** the skeleton typed by you, exactly one title in the head, exactly one heading 1, at least 3 section headings in outline order, at least 10 paragraphs (at least 8 of them 25 words or longer), at least 300 words total, and ONLY these tags: html, head, title, body, headings, and paragraphs. The **Checks** button shows your score out of 50." },
    { p: "**Your own words:** write everything yourself in the editor. Do not copy and paste from Wikipedia, another website, a document, or an AI tool. Copying from outside the page takes 50% off. Stuck? Open the 7.1 notes: schscomputerscience.com/ist/unit-7/html-intro-notes.html" },

    { h: "Step 1: The skeleton from memory" },
    { make: "The skeleton every web page starts with, typed from what you remember." },
    { where: "You will type it at the very top of your index.html tab. First, answer these from memory. Then check the notes and fix anything you got wrong." },
    { id: "sk1", q: "What does the doctype line on line 1 tell the browser?", t: "area" },
    { id: "sk2", q: "What goes inside the head, and can you see it on the page?", t: "area" },
    { id: "sk3", q: "What goes inside the body?", t: "area" },
    { id: "sk4", q: "What does a closing tag do, and what happens if you forget one?", t: "area" },
    { build: [
      "In index.html, type the **doctype line** on line 1",
      "On the next line, open the **html** container. Everything else goes INSIDE it",
      "INSIDE html, add the **head** first, then the **body** second. The head comes before the body",
      "INSIDE the head, add your page **title** (you will pick it in Step 2)",
      "Do not add any other tags yet"
    ] },

    { h: "Step 2: Pick your topic" },
    { make: "The subject of your page. Choose something school-appropriate that you can find good information about: an animal, a sport, a game, a place, a person, a food, a band, or a hobby." },
    { where: "Your topic becomes the **title** INSIDE the head (it shows on the browser tab) and the **heading 1** at the top of the body." },
    { id: "topic", q: "My topic is", t: "text" },
    { id: "why", q: "Why I picked it", t: "text" },
    { id: "know", q: "Three things I already know about it", t: "area" },
    { id: "look", q: "Three things I need to look up", t: "area" },
    { build: [
      "Type your topic as the text INSIDE the title tag in the head",
      "INSIDE the body, add a **heading 1** and type your topic's name in it. There must be exactly one heading 1"
    ] },

    { h: "Step 3: Plan your sources" },
    { make: "At least 2 sources that you will learn from and list on your page. Use an encyclopedia, a library book, or a trusted website. Wikipedia is fine for getting started, but it does not count as one of your 2 sources." },
    { where: "You will list them in your **last paragraph** at the bottom of the page." },
    grpN("src", 1, "Source", [["n", "Source name"], ["w", "Where I found it (website address or book)"], ["l", "One thing I learned from it"]]),
    grpN("src", 2, "Source", [["n", "Source name"], ["w", "Where I found it (website address or book)"], ["l", "One thing I learned from it"]]),
    grpN("src", 3, "Source (optional)", [["n", "Source name"], ["w", "Where I found it (website address or book)"], ["l", "One thing I learned from it"]]),

    { h: "Step 4: Plan your outline" },
    { make: "An outline of your page, like the outline for an essay. Your heading 1 is the topic. Under it come at least 3 section headings, and each section will have paragraphs." },
    { where: "Every section heading goes INSIDE the body, after the heading 1. Use heading 2 for sections. A heading 3 is only allowed INSIDE (under) a heading 2, and you may not skip levels." },
    { p: "Ideas for sections: Introduction, Background or History, What It Looks Like, How It Works, More Details, Why It Matters, Challenges or Problems, Fun Facts." },
    grpN("sec", 1, "Section", [["h", "Section heading"], ["p", "What the paragraphs under it will say (short notes)"]]),
    grpN("sec", 2, "Section", [["h", "Section heading"], ["p", "What the paragraphs under it will say (short notes)"]]),
    grpN("sec", 3, "Section", [["h", "Section heading"], ["p", "What the paragraphs under it will say (short notes)"]]),
    grpN("sec", 4, "Section", [["h", "Section heading"], ["p", "What the paragraphs under it will say (short notes)"]]),
    grpN("sec", 5, "Section", [["h", "Section heading"], ["p", "What the paragraphs under it will say (short notes)"]]),

    { h: "Step 5: Build your page, section by section" },
    { make: "The full article, written in your own words." },
    { where: "Everything goes INSIDE the body, in this order: heading 1, then the first section heading, then its paragraphs, then the next section heading, and so on." },
    { build: [
      "Add your first **section heading** (heading 2) under the heading 1",
      "Under that heading, add **2 paragraphs**. Each paragraph goes INSIDE its own paragraph tag, not inside the heading",
      "Repeat for each of your sections: a heading, then 2 paragraphs",
      "Make sure at least 8 of your paragraphs are **25 words or longer** (3 to 5 sentences each)",
      "Keep going until the whole page has at least **300 words**",
      "Make your **last paragraph** the one that lists at least 2 sources",
      "Click **Checks**. Each requirement turns green when it is met. Fix anything in the Problems list (click a problem to jump to that line)"
    ] },

    { h: "Step 6: Check your work" },
    { id: "c1", q: "I typed the skeleton myself, and the doctype is on line 1.", t: "yn" },
    { id: "c2", q: "My title is my topic and I have exactly one heading 1.", t: "yn" },
    { id: "c3", q: "My headings follow the outline order (no skipped levels).", t: "yn" },
    { id: "c4", q: "I used only the allowed tags (html, head, title, body, headings, paragraphs).", t: "yn" },
    { id: "c5", q: "I typed everything myself in my own words.", t: "yn" },
    { id: "c6", q: "My last paragraph lists at least 2 sources.", t: "yn" },
    { build: [
      "Make sure the **Problems to fix** list is empty",
      "Make sure **Checks** shows 50 / 50"
    ] },

    { h: "Step 7: Reflect, then submit" },
    { id: "r1", q: "What was the hardest part of writing your skeleton and your outline?", t: "area" },
    { id: "r2", q: "Why does a heading 3 need a heading 2 above it? Explain using the idea of an outline.", t: "area" },
    { id: "r3", q: "Your page looks plain. What would you want to change to make it look better?", t: "area" },
    { build: [
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.2 ===================== */
  A["7.2"] = [
    { h: "What you are creating" },
    { make: "An **epic poster** for the biggest event of the year, made with headings, paragraphs, and your first styles. You will make the event name HUGE, add color, put a background color behind things, and frame something with a border." },
    { p: "Here is your page from top to bottom:" },
    { map: [
      "HEAD: the page title (your poster's name)",
      "Heading 1: the name of your event (Step 2)",
      "Heading 2: the tagline or date (Step 2)",
      "Paragraph: when the event is (Step 3)",
      "Paragraph: where the event is (Step 3)",
      "Paragraph: how to get tickets (Step 3)"
    ] },
    { p: "**Your finished page must have:** exactly one heading 1, at least 2 heading levels, at least 3 paragraphs, text color, a background color, a font size in pixels, centered or uppercase text, a border, and every style written correctly. Everything is styled with the style attribute. Your starter page already has the skeleton. The **Checks** button shows your score out of 50." },
    { p: "**Remember the shell:** every style attribute has the same format: the word style, an equals sign, and quotes around everything. The property and value go INSIDE the quotes, and each one ends with a semicolon. Stuck? Open the 7.2 notes: schscomputerscience.com/ist/unit-7/style-attribute-notes.html" },

    { h: "Step 1: Pick your poster" },
    { make: "The kind of event you are advertising." },
    { where: "Your choice changes what you write in the heading and the three paragraphs." },
    { p: "Ideas: a world tour for your favorite band, a movie premiere for a film you wish existed, an esports tournament, a festival for a made-up holiday like National Pizza Rolls Day. Keep it school-appropriate." },
    { id: "kind", q: "What kind of event is it, and what is it called?", t: "text" },
    { build: [
      "Change the page **title** (in the head) to your poster's name"
    ] },

    { h: "Step 2: The name and the tagline" },
    { make: "A giant event name and a short tagline or date underneath." },
    { where: "INSIDE the body: the event name in a **heading 1** at the top, then the tagline or date in a **heading 2** right under it." },
    { id: "name", q: "The name of your event (goes in the heading 1)", t: "text" },
    { id: "tagline", q: "Your catchy tagline or the date (goes in the heading 2)", t: "text" },
    { build: [
      "Add your **heading 1** as the first thing in the body and type the event name",
      "Under it, add your **heading 2** with the tagline or date",
      "Make the event name **HUGE**: give the heading 1 a style that sets a big font size in pixels",
      "**Center** the heading 1 and the heading 2 using a style"
    ] },

    { h: "Step 3: The details" },
    { make: "Three paragraphs with everything people need to know." },
    { where: "Under the heading 2, each one INSIDE its own paragraph tag, in this order: when, where, tickets." },
    { id: "when", q: "When is the event? (what the first paragraph will say)", t: "text" },
    { id: "where", q: "Where is the event? (what the second paragraph will say)", t: "text" },
    { id: "tix", q: "How do people get tickets or join? (what the third paragraph will say)", t: "text" },
    { build: [
      "Under the heading 2, add **3 paragraphs**: one for when, one for where, and one for tickets",
      "Write real sentences that a person could follow"
    ] },

    { h: "Step 4: Plan your colors" },
    { make: "A color plan so your poster looks designed, not random." },
    { where: "You will use these in styles in Step 5. Dark backgrounds need light text. Light backgrounds need dark text. If people cannot read it, it is a bad poster." },
    { id: "tcol", q: "Text color", t: "text" },
    { id: "bcol", q: "Background color (what is behind the text)", t: "text" },
    { id: "brd", q: "Border color", t: "text" },

    { h: "Step 5: Style your poster" },
    { make: "The look of the poster. Each style you add goes in the style attribute of the tag you want to change." },
    { where: "Each style attribute goes INSIDE the opening tag of the thing it styles, after the tag's name. Chain more than one property in the same attribute, separated by semicolons." },
    { build: [
      "Give at least one tag a **text color** (the color of the letters)",
      "Give at least one tag a **background color** (behind the letters). Try it on the body to color the whole poster",
      "Give your heading 1 a **font size in pixels**",
      "Use **text-align** to center something, or **text-transform** to make something uppercase",
      "Put a **border** around one tag. A border has three parts in order: thickness, style, and color",
      "Check that every style has a colon after the property, a semicolon after the value, and quotes around all of it",
      "Click **Checks** and fix anything red"
    ] },

    { h: "Step 6: Check your work" },
    { id: "c1", q: "I changed the title, and I have exactly one heading 1.", t: "yn" },
    { id: "c2", q: "I have at least 2 heading levels and at least 3 paragraphs.", t: "yn" },
    { id: "c3", q: "I used a text color AND a background color.", t: "yn" },
    { id: "c4", q: "I used a border with thickness, style, and color in that order.", t: "yn" },
    { id: "c5", q: "My text is easy to read against its background.", t: "yn" },
    { build: [ "Make sure **Checks** shows 50 / 50" ] },

    { h: "Step 7: Reflect, then submit" },
    { id: "r1", q: "In your own words, what is the difference between color and background-color?", t: "area" },
    { id: "r2", q: "What happens if you write a border with no style word (like solid)? Try it and describe it.", t: "area" },
    { id: "r3", q: "What style mistake did you make, and how did you fix it?", t: "area" },
    { build: [
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.3 ===================== */
  A["7.3"] = [
    { h: "What you are creating" },
    { make: "The **menu** for your dream restaurant. The doors open tomorrow and you still need a menu! You will use bold and italic text, line breaks, horizontal lines, spans, a border, and a font family to make the best menu in town." },
    { p: "Here is your page from top to bottom:" },
    { map: [
      "HEAD: the page title (your restaurant's name)",
      "Heading 1: the restaurant's name (Step 2)",
      "Paragraph: your address or hours on separate lines (Step 5)",
      "Horizontal line",
      "Section: Starters (heading 2, then dish paragraphs)",
      "Horizontal line",
      "Section: Main Dishes (heading 2, then dish paragraphs)",
      "Horizontal line",
      "Section: Desserts (heading 2, then dish paragraphs)"
    ] },
    { p: "**Your finished page must have:** exactly one heading 1, bold and italic text INSIDE paragraphs or headings, at least one line break, horizontal lines between menu sections, a span with a style attribute, a font family, and a border. Your starter page already has the skeleton. The **Checks** button shows your score out of 50." },
    { p: "**Stuck?** Open the 7.3 notes: schscomputerscience.com/ist/unit-7/editing-tags-notes.html" },

    { h: "Step 1: Pick your restaurant" },
    { make: "The kind of restaurant you own and its theme." },
    { where: "Your choice becomes the name and the feel of the whole page." },
    { p: "Ideas: a taco truck, pizza place, bakery, or sushi bar; a restaurant in space, under the sea, or in a haunted castle; a breakfast-for-dinner diner; a cafe run by animals. Keep it school-appropriate." },
    { id: "theme", q: "What is your restaurant and what is the theme?", t: "text" },
    { build: [ "Change the page **title** (in the head) to your restaurant's name" ] },

    { h: "Step 2: The name" },
    { make: "A heading with your restaurant's name." },
    { where: "INSIDE the body, at the very top, in a **heading 1**." },
    { id: "rname", q: "The name of your restaurant", t: "text" },
    { build: [ "Add a **heading 1** as the first thing in the body and type the restaurant's name" ] },

    { h: "Step 3: Plan your menu" },
    { make: "The dishes on your menu, with a short description and a price for each. Plan at least 6 dishes, split into sections such as Starters, Main Dishes, and Desserts." },
    { where: "Each section gets a **heading 2** with its name. Each dish goes in its **own paragraph** under its section." },
    grpN("dish", 1, "Dish", [["s", "Section (Starters, Main Dishes, Desserts...)"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),
    grpN("dish", 2, "Dish", [["s", "Section"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),
    grpN("dish", 3, "Dish", [["s", "Section"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),
    grpN("dish", 4, "Dish", [["s", "Section"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),
    grpN("dish", 5, "Dish", [["s", "Section"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),
    grpN("dish", 6, "Dish", [["s", "Section"], ["n", "Dish name"], ["d", "Short description"], ["p", "Price"]]),

    { h: "Step 4: Build the menu sections" },
    { make: "The menu itself: sections separated by lines, with each dish in its own paragraph." },
    { where: "INSIDE the body, under your heading 1. For each section: a heading 2, then its dish paragraphs. Put a horizontal line BETWEEN sections. Every dish paragraph holds three things INSIDE it." },
    { build: [
      "Under the heading 1, add your first **heading 2** (like Starters)",
      "Add one **paragraph** for each dish in that section",
      "INSIDE each dish paragraph, make the dish name **bold**. The bold tag goes INSIDE the paragraph, around just the name",
      "INSIDE the same paragraph, put the description in **italics**. The italic tag goes INSIDE the paragraph, around just the description",
      "INSIDE the same paragraph, put the price in a **span** with a style attribute that colors it. The span goes INSIDE the paragraph, around just the price",
      "Add a **horizontal line** between sections. It goes OUTSIDE the paragraphs, on its own",
      "Repeat for your other sections"
    ] },

    { h: "Step 5: Address and hours" },
    { make: "Your restaurant's address or hours, on separate lines." },
    { where: "In a paragraph under your heading 1 (or at the bottom of the page, your choice)." },
    { id: "addr", q: "Your address or hours (two or three lines)", t: "area" },
    { build: [
      "Add a **paragraph** with your address or hours",
      "Use a **line break** INSIDE the paragraph to start each new line. A line break stands alone, so it has no closing tag"
    ] },

    { h: "Step 6: Fonts and a border" },
    { make: "A font family that fits your restaurant, and a border that makes one item stand out, like your special of the day." },
    { where: "The font family goes in a style attribute. The border goes in the style attribute of the tag you want to frame." },
    { id: "fam", q: "Which font family fits your restaurant?", t: "sel", opts: FAMS },
    { id: "famwhy", q: "Why does that font family fit?", t: "text" },
    { id: "special", q: "What will you put a border around, and what border style will you use?", t: "text" },
    { build: [
      "Give at least one tag a **font family** (serif, sans-serif, or monospace)",
      "Put a **border** around one item, such as your special of the day. A border has three parts in order: thickness, style, and color",
      "Click **Checks** and fix anything red"
    ] },

    { h: "Step 7: Check your work" },
    { id: "c1", q: "I changed the title and I have exactly one heading 1.", t: "yn" },
    { id: "c2", q: "My bold and italic text are INSIDE paragraphs or headings.", t: "yn" },
    { id: "c3", q: "I used a line break and horizontal lines, and did not close either one.", t: "yn" },
    { id: "c4", q: "I have a span with a style attribute.", t: "yn" },
    { id: "c5", q: "I used a border and a font family.", t: "yn" },
    { build: [ "Make sure **Checks** shows 50 / 50" ] },

    { h: "Step 8: Reflect, then submit" },
    { id: "r1", q: "What is the difference between a span and a paragraph, in your own words?", t: "area" },
    { id: "r2", q: "Why does a border need a style word like solid or dashed?", t: "area" },
    { id: "r3", q: "What would you order from your own menu, and why?", t: "area" },
    { build: [
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.4 ===================== */
  A["7.4"] = [
    { h: "What you are creating" },
    { make: "The **ultimate Wanted poster**. There is an outlaw on the loose and the sheriff needs the best poster ever made. This is a build day: you will use every tag and style you have learned so far, at least **3 times each**, plus borders in every way you know." },
    { p: "Here is your page from top to bottom:" },
    { map: [
      "HEAD: the page title",
      "Heading 1: WANTED (Step 2)",
      "Paragraph: the crime, with a span (Step 2)",
      "Horizontal line",
      "Heading 2: Description, then paragraphs (Step 3)",
      "Horizontal line",
      "Heading 3: Last seen, then a paragraph (Step 3)",
      "Horizontal line",
      "Heading 2: Reward, then a paragraph (Step 4)"
    ] },
    { p: "**The rule: 3 of everything.** Your page needs at least 3 of each: headings (at least 2 levels, but only one heading 1), paragraphs, bold, italic, line breaks, horizontal lines, spans with a style, and at least 3 of each of these styles: text color, background color, font size in pixels, text-align or text-transform, font family, and a border on 3 different elements. Also at least 2 different border styles and one one-sided border. Your starter page already has the skeleton. The **Checks** button counts everything for you." },
    { p: "**Stuck?** Open the 7.4 notes: schscomputerscience.com/ist/unit-7/borders-notes.html" },

    { h: "Step 1: Pick your outlaw" },
    { make: "Who is wanted." },
    { where: "The outlaw's name goes in the page title and appears all over the poster." },
    { p: "Ideas: a movie, book, or game villain; your pet, wanted for stealing snacks; a made-up outlaw with a funny crime like The Notorious Homework Thief. Keep it school-appropriate." },
    { id: "outlaw", q: "Who is wanted, and for what crime?", t: "text" },
    { id: "reward", q: "How much is the reward, and who do you call?", t: "text" },
    { build: [ "Change the page **title** (in the head) to your poster's name" ] },

    { h: "Step 2: The top of the poster" },
    { make: "The WANTED banner and the crime." },
    { where: "INSIDE the body: a **heading 1** first, then a **paragraph** with the crime, then a **horizontal line**." },
    { id: "crime", q: "The crime, in one or two sentences", t: "text" },
    { id: "spanw", q: "Which 3 words in your text will be a different color (each in its own span)?", t: "text" },
    { build: [
      "Add a **heading 1** that says WANTED (or the outlaw's name)",
      "Add a **paragraph** under it with the crime",
      "Color three different words using **three spans**, each with its own style attribute. Each span goes INSIDE a paragraph, around just one word",
      "Under the paragraph, add a **horizontal line**"
    ] },

    { h: "Step 3: Describe the outlaw" },
    { make: "A description with details that make the outlaw easy to spot." },
    { where: "Under the first horizontal line: a heading 2 called Description with paragraphs, then a horizontal line, then a heading 3 called Last Seen with a paragraph." },
    { id: "desc", q: "Describe the outlaw: height, hair, one unusual detail", t: "area" },
    { id: "seen", q: "Where was the outlaw last seen?", t: "text" },
    { id: "boldw", q: "Which 3 words or phrases will be bold?", t: "text" },
    { id: "itw", q: "Which 3 words or phrases will be in italics?", t: "text" },
    { build: [
      "Under the horizontal line, add a **heading 2** and at least **2 paragraphs** of description",
      "Make three different words **bold**. Each bold tag goes INSIDE a paragraph, around the words",
      "Make three different words **italic**. Each italic tag goes INSIDE a paragraph, around the words",
      "Use at least **3 line breaks** INSIDE your paragraphs (line breaks stand alone, so they have no closing tag)",
      "Add a **horizontal line**, then a **heading 3** for Last Seen and a paragraph under it"
    ] },

    { h: "Step 4: The reward" },
    { make: "The reward and who to contact." },
    { where: "At the bottom: a horizontal line, then a heading 2 called Reward and a paragraph." },
    { build: [
      "Add a third **horizontal line**",
      "Add a **heading 2** for the reward and a **paragraph** with the amount and who to call"
    ] },

    { h: "Step 5: Plan your styles" },
    { make: "Your design plan, so the poster looks like it belongs on an old-time sheriff's wall." },
    { where: "You will use these choices in style attributes in Step 6." },
    { id: "colors", q: "Your text colors and background colors (list at least 3 of each)", t: "area" },
    { id: "fonts", q: "Which font family for the title, the description, and the reward? (use at least 3 places)", t: "text" },
    { id: "borders", q: "Which 3 things will get a border, and which border style for each? Where does your one-sided border go?", t: "area" },

    { h: "Step 6: Style it: 3 of everything" },
    { make: "The styles, each used at least 3 times." },
    { where: "Every style goes in the style attribute of the tag it changes, INSIDE the opening tag. You can chain many properties in one attribute, separated by semicolons." },
    { build: [
      "Use **text color** on at least 3 tags",
      "Use **background color** on at least 3 tags",
      "Use **font size in pixels** on at least 3 tags",
      "Use **text-align or text-transform** at least 3 times",
      "Use a **font family** (serif, sans-serif, or monospace) at least 3 times",
      "Put a **border** (thickness, style, color) on at least **3 different tags**",
      "Use at least **2 different border styles**, and give one tag a **one-sided border** (top, bottom, left, or right)",
      "Dark backgrounds need light text and light backgrounds need dark text. If a sheriff cannot read it, it is a bad poster",
      "Click **Checks** and fix anything red until every line is green"
    ] },

    { h: "Step 7: Tally your evidence" },
    { p: "Count what is on your page. Checks will confirm it." },
    { id: "n1", q: "How many headings (and which levels)?", t: "text" },
    { id: "n2", q: "How many bold, italic, line breaks, horizontal lines, and spans?", t: "text" },
    { id: "n3", q: "How many times did you use color, background color, font size, text-align or text-transform, and font family?", t: "text" },
    { id: "n4", q: "How many elements have a border, and which border styles did you use?", t: "text" },

    { h: "Step 8: Check, reflect, and submit" },
    { id: "c1", q: "I changed the title and I have exactly one heading 1.", t: "yn" },
    { id: "c2", q: "I have at least 3 of every tag and every style.", t: "yn" },
    { id: "c3", q: "I used at least 2 border styles and a one-sided border.", t: "yn" },
    { id: "c4", q: "My text is easy to read against its background.", t: "yn" },
    { id: "r1", q: "Which tag or style was hardest to use 3 times, and why?", t: "area" },
    { id: "r2", q: "What happens if you leave the style word out of a border?", t: "area" },
    { id: "r3", q: "What is the difference between border and a one-sided border?", t: "area" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.5 ===================== */
  A["7.5"] = [
    { h: "What you are creating" },
    { make: "The **ultimate guide page**: a two-section guide website about something you know better than anyone. It has a banner, a menu bar, ranked lists, bullet lists, and a footer, and it uses every tag and style you have learned so far at least 2 times. The goal is a page that looks professional, not a junk drawer of tags." },
    { p: "Here is your page from top to bottom:" },
    { map: [
      "HEAD: the page title",
      "Heading 1: your guide's name, styled as a banner (Step 2)",
      "Menu bar: a bullet list with 3 items in a ROW (Step 3)",
      "Paragraph: the tagline (Step 4)",
      "Horizontal line",
      "Heading 2: Section 1, a paragraph, a heading 3 + numbered list, a heading 3 + bullet list (Step 5)",
      "Horizontal line",
      "Heading 2: Section 2, a paragraph, a heading 3 + numbered list, a heading 3 + bullet list (Step 6)",
      "Paragraph: a small footer (Step 7)"
    ] },
    { p: "**The rule: 2 of everything.** At least 2 numbered lists and 2 bullet lists (each with at least 3 items), 2 heading 2s and 2 heading 3s (still only one heading 1), 2 paragraphs, 2 bold, 2 italic, 2 line breaks, 2 horizontal lines, 2 spans with a style, and at least 2 uses of each of these styles: list-style-type, text color, background color, font size in pixels, text-align or text-transform, font family, and a border on 2 different tags. Your starter page already has the skeleton. The **Checks** button counts everything." },
    { p: "**Stuck?** Open the 7.5 notes: schscomputerscience.com/ist/unit-7/lists-notes.html" },

    { h: "Step 1: Pick your guide topic" },
    { make: "The subject of your guide." },
    { where: "Your topic becomes the page title and the name in the banner." },
    { p: "Ideas: the ultimate guide to your favorite game, a game day guide for your team, a road trip survival guide, a study guide to beat finals, a snack or pizza night guide, or a guide to your favorite band, show, or hobby." },
    { id: "topic", q: "What topic did you choose, and what is your guide called?", t: "text" },
    { build: [ "Change the page **title** (in the head) to your guide's name" ] },

    { h: "Step 2: The banner" },
    { make: "A title banner that looks like the top of a real website." },
    { where: "A **heading 1** as the first thing INSIDE the body. All of its design goes in its style attribute." },
    { id: "pal", q: "Your palette: which 2 main colors and 1 neutral?", t: "text" },
    { id: "fonts", q: "Your two fonts: which family for headings and which for body?", t: "text" },
    { build: [
      "Add your **heading 1** with the guide's name",
      "Give it a style with: a background color, a light text color, centered text, a big font size in pixels, a font family, and a border under it",
      "Remember: dark backgrounds need light text"
    ] },

    { h: "Step 3: The menu bar" },
    { make: "A menu bar with 3 items in a row, like the menu at the top of a real website. This is where you use what you learned about **block vs. inline**." },
    { where: "Directly under the heading 1. It is a bullet list with 3 items. Lists stack their items by default (list items are block), so you must turn them into a row." },
    { id: "m1", q: "Menu item 1 (like Countdown)", t: "text" },
    { id: "m2", q: "Menu item 2 (like Game Plan)", t: "text" },
    { id: "m3", q: "Menu item 3 (like About)", t: "text" },
    { id: "blk", q: "In your own words, what is the difference between a block tag and an inline tag?", t: "text" },
    { build: [
      "Under the heading 1, add a **bullet list** with **3 list items** (your menu items)",
      "Give the **bullet list** a style that removes the bullets (list-style-type set to none)",
      "Give **each list item** a style that makes it **inline** (the display property), so the items sit side by side in a row"
    ] },

    { h: "Step 4: The tagline and first divider" },
    { make: "A short tagline and a divider line." },
    { where: "Under the menu, in a **paragraph**, then a **horizontal line** under it (OUTSIDE the paragraph)." },
    { id: "tag", q: "Your tagline", t: "text" },
    { id: "hi", q: "Which 2 words get a different color (each in a span)? Which phrase is italic?", t: "text" },
    { build: [
      "Add a **paragraph** with your tagline and center it",
      "Put an **italic** phrase INSIDE the paragraph",
      "Color two words with **two spans** INSIDE the paragraph, each with a style attribute",
      "Add a **line break** INSIDE the paragraph so it splits into two lines",
      "Under the paragraph, add a **horizontal line** with a border style"
    ] },

    { h: "Step 5: Section 1 (a ranking)" },
    { make: "A ranked list and a list of extras." },
    { where: "Under the first horizontal line: a heading 2, a short paragraph, then two labeled lists." },
    { id: "s1t", q: "Section 1 title (like The Countdown)", t: "text" },
    { id: "s1i", q: "Rank 3 items with a bold name and a short italic description (write them here)", t: "area" },
    { id: "s1b", q: "List 3 honorable mentions (bullets)", t: "area" },
    { build: [
      "Add a **heading 2** with the section title and a short **paragraph** under it",
      "Add a **heading 3** as a label, then a **numbered list** with **3 items**. In each item, make the name **bold** and the description **italic**, both INSIDE the list item",
      "Add another **heading 3** label, then a **bullet list** with **3 items**",
      "Give each list a **list-style-type** (a different marker for each), a background color, and a border",
      "Remember: only list items go directly inside a list"
    ] },

    { h: "Step 6: Section 2 (a how-to)" },
    { make: "A steps list and a list of what people need." },
    { where: "Under a second horizontal line: a heading 2, a short paragraph, then two labeled lists." },
    { id: "s2t", q: "Section 2 title (like The Game Plan)", t: "text" },
    { id: "s2s", q: "List 3 steps (numbered)", t: "area" },
    { id: "s2n", q: "List 3 things people need (bullets)", t: "area" },
    { build: [
      "Under the numbered list and bullet list from Section 1 (OUTSIDE them), add a second **horizontal line**",
      "Add a **heading 2**, a short **paragraph**, then a **heading 3** and a **numbered list** with 3 steps",
      "Add another **heading 3** and a **bullet list** with 3 items",
      "Give these lists a list-style-type, a background color, and a border too"
    ] },

    { h: "Step 7: The footer" },
    { make: "A small footer with two lines." },
    { where: "At the very bottom, in its own paragraph, OUTSIDE the lists." },
    { id: "f1", q: "Footer line 1", t: "text" },
    { id: "f2", q: "Footer line 2", t: "text" },
    { build: [
      "Add a **paragraph** with your two lines, separated by a **line break** INSIDE the paragraph",
      "Center it and make the text small using a style attribute"
    ] },

    { h: "Step 8: Make it look professional, then check" },
    { make: "A page that looks planned instead of thrown together." },
    { where: "Use these design rules across the whole page." },
    { build: [
      "Use **one color palette**: two main colors plus a neutral, reused on the banner, headings, and list borders",
      "Use **two fonts**: one for headings and one for body text. Set the font family with a style at least twice",
      "Size shows importance: heading 1 biggest, heading 2 medium, heading 3 small, body 16 to 20 pixels",
      "Center the top of the page, and keep lists and paragraphs left-aligned",
      "Click **Checks** and fix anything red until it shows 50 / 50"
    ] },

    { h: "Step 9: Check, reflect, and submit" },
    { id: "c1", q: "I have at least 2 numbered lists and 2 bullet lists, each with at least 3 items.", t: "yn" },
    { id: "c2", q: "My menu is a row, not a stack.", t: "yn" },
    { id: "c3", q: "I have at least 2 of every tag and every style.", t: "yn" },
    { id: "c4", q: "My headings go in order: heading 1, then 2, then 3.", t: "yn" },
    { id: "c5", q: "My text is easy to read against its background.", t: "yn" },
    { id: "r1", q: "Why is your ranking an ordered list and your extras an unordered list?", t: "area" },
    { id: "r2", q: "Why did your menu items stack until you made them inline?", t: "area" },
    { id: "r3", q: "Which design rule made the biggest difference in how your page looks?", t: "area" },
    { build: [
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
