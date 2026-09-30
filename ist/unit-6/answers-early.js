/* "Setting up your page" steps for lessons 6.1 to 6.5. Same rules as answers.js: SHORT, no typed planning boxes,
   what to add and where it goes in plain words, never copyable tags or code. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  /* ===================== 6.1 ===================== */
  A["6.1"] = [
    { h: "What you are building" },
    { p: "Your first website: a plain, text-heavy page about a topic you know or want to learn about, like a mini encyclopedia article. It will look plain on purpose. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton (typed by you, from memory)",
      "Heading 1: your topic",
      "3 or more section headings (heading 2), each with paragraphs",
      "A last paragraph that lists at least 2 sources"
    ] },
    { p: "**Rules:** write everything yourself in the editor, in your own words. Copying from Wikipedia, a website, or an AI tool takes 50% off. Stuck? Read the notes: schscomputerscience.com/ist/unit-6/html-intro-notes.html" },

    { h: "Step 1: The skeleton" },
    { build: [
      "Type the **doctype line** on line 1, from memory",
      "Open the **html** container. Everything else goes **inside** it",
      "Inside html, add the **head** first, then the **body**",
      "Inside the head, add a **title** with your topic (pick a topic you can find good information about)"
    ] },

    { h: "Step 2: Main heading" },
    { build: [
      "Inside the body, add **one heading 1** with your topic's name"
    ] },

    { h: "Step 3: Section headings" },
    { build: [
      "Under the heading 1, add at least **3 section headings** (heading 2), like History, How It Works, Why It Matters",
      "Use a heading 3 only **under** a heading 2. Do not skip levels"
    ] },

    { h: "Step 4: Paragraphs" },
    { build: [
      "Under each section heading, add **2 paragraphs**. Each one goes in its **own** paragraph, not inside a heading",
      "Write at least **10 paragraphs** in all, and make at least **8 of them 25 words or longer**",
      "Keep writing until your page has at least **300 words**"
    ] },

    { h: "Step 5: Sources" },
    { build: [
      "Make your **last paragraph** list at least **2 sources** (a book, an encyclopedia, or a trusted website)"
    ] },

    { h: "Step 6: Check and submit" },
    { build: [
      "Fix anything in the **Problems** list (click a problem to jump to that line)",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 6.2 ===================== */
  A["6.2"] = [
    { h: "What you are building" },
    { p: "An **epic poster** for the biggest event of the year (a band's world tour, a movie premiere, an esports tournament, a made-up holiday). Make the name HUGE and give it color. You type the skeleton yourself, every time. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton: doctype, html, head, and body (typed by you)",
      "Heading 1: the event name",
      "Heading 2: a tagline or the date",
      "3 paragraphs: when, where, and how to get tickets"
    ] },
    { p: "Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with the property and value **inside** the quotes and a semicolon after each. Stuck? Read the notes: schscomputerscience.com/ist/unit-6/style-attribute-notes.html" },

    { h: "Step 1: Skeleton, title and heading" },
    { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with your poster's name",
      "Add a **heading 1** at the top of the body with the event name"
    ] },

    { h: "Step 2: Tagline" },
    { build: [
      "Under the heading 1, add a **heading 2** with a tagline or the date"
    ] },

    { h: "Step 3: The details" },
    { build: [
      "Under the heading 2, add **3 paragraphs**: when, where, and how to get tickets"
    ] },

    { h: "Step 4: Make it epic (exactly where each style goes)" },
    { build: [
      "**Text color** (the color of the letters): put it on the **heading 1**",
      "**Background color** (behind the letters): put it on the **body** tag, so the whole poster is colored",
      "**Font size in pixels**: put it on the **heading 1** and make it HUGE",
      "**Center** the text: put it on the **heading 1**",
      "**Uppercase** letters: put it on the **heading 2**",
      "**Border** (thickness, style, and color, in that order): put it on the **last paragraph**",
      "Dark backgrounds need light text. Light backgrounds need dark text",
      "These are the **minimums**. You can ALWAYS add more styles to more tags"
    ] },

    { h: "Step 5: Check and submit" },
    { build: [
      "Make sure every style has a colon, a semicolon, and quotes around it",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 6.3 ===================== */
  A["6.3"] = [
    { h: "What you are building" },
    { p: "The **menu** for your dream restaurant (a taco truck, a bakery, a cafe in space, anything school-appropriate). You type the skeleton yourself, every time. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton: doctype, html, head, and body (typed by you)",
      "Heading 1: the restaurant's name",
      "Paragraph: address or hours on separate lines",
      "Horizontal line",
      "Section (heading 2) with dishes, like Starters",
      "Horizontal line",
      "Section (heading 2) with dishes, like Main Dishes",
      "Horizontal line",
      "Section (heading 2) with dishes, like Desserts"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/editing-tags-notes.html" },

    { h: "Step 1: Skeleton, title and name" },
    { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with your restaurant's name",
      "Add a **heading 1** at the top of the body with the same name"
    ] },

    { h: "Step 2: Address and hours" },
    { build: [
      "Under the heading 1, add a **paragraph** with your address or hours",
      "Use a **line break inside** the paragraph to start each new line",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ] },

    { h: "Step 3: The menu" },
    { build: [
      "Add a **heading 2** for your first section (like Starters)",
      "Under it, add a **paragraph for each dish**. Plan at least 6 dishes in all",
      "In each dish paragraph, make the dish name **bold**. The bold goes **inside** the paragraph, around just the name",
      "In the same paragraph, put a short description in **italics** (**inside** the paragraph)",
      "In the same paragraph, color the price using a **span** with a style (**inside** the paragraph, around just the price)",
      "Add a **horizontal line** between sections (**outside** the paragraphs), then repeat for your other sections"
    ] },

    { h: "Step 4: Colors, size, and a border (exactly where each style goes)" },
    { build: [
      "**Font family** serif: put it on the **heading 1** (your restaurant's name)",
      "**Font family** sans-serif or monospace: put it on the **address paragraph**",
      "**Text color** and a big **font size in pixels**: put both on the **heading 1**",
      "**Background color**: put it on the **body** tag",
      "**Center** the text: put it on the **heading 1**",
      "**Uppercase** letters: put it on **each section heading** (heading 2)",
      "**Border** (thickness, style, and color, in that order): put it on your favorite **dish paragraph**, like the special of the day",
      "Dark backgrounds need light text. Light backgrounds need dark text",
      "These are the **minimums**. You can ALWAYS add more styles to more tags"
    ] },

    { h: "Step 5: Check and submit" },
    { build: [
      "Make sure your bold and italic text are **inside** paragraphs or headings",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 6.4 ===================== */
  A["6.4"] = [
    { h: "What you are building" },
    { p: "The **ultimate Wanted poster** for an outlaw on the loose (a villain, your pet who stole the snacks, a made-up criminal). This is a build day: use every tag and style you know at least **3 times each**, plus borders. You type the skeleton yourself, every time. **Checks** counts everything for you." },
    { map: [
      "The skeleton: doctype, html, head, and body (typed by you)",
      "Heading 1: WANTED",
      "Paragraph: the crime, then a horizontal line",
      "Heading 2: Description, with paragraphs, then a horizontal line",
      "Heading 3: Last seen, with a paragraph, then a horizontal line",
      "Heading 2: Reward, with a paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/borders-notes.html" },

    { h: "Step 1: Skeleton, title and heading" },
    { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with your poster's name",
      "Add a **heading 1** that says WANTED (or the outlaw's name)"
    ] },

    { h: "Step 2: The crime" },
    { build: [
      "Under the heading 1, add a **paragraph** with the crime",
      "Color **3 different words** using 3 **spans** with a style. Each span goes **inside** a paragraph, around just one word",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ] },

    { h: "Step 3: Description and last seen" },
    { build: [
      "Add a **heading 2** and at least **2 paragraphs** describing the outlaw",
      "Make **3 different words bold** and **3 different words italic**. Each one goes **inside** a paragraph",
      "Use at least **3 line breaks inside** your paragraphs",
      "Add a **horizontal line**, then a **heading 3** for Last Seen with a paragraph under it"
    ] },

    { h: "Step 4: The reward" },
    { build: [
      "Add a third **horizontal line**",
      "Add a **heading 2** for the reward and a **paragraph** with the amount and who to call"
    ] },

    { h: "Step 5: Style it (exactly where the 3 of everything go)" },
    { build: [
      "**Text color**: put it on the **heading 1**, the **heading 2**, and the **heading 3** (3 uses)",
      "**Background color**: put it on the **body**, the **heading 1**, and the **reward paragraph** (3 uses)",
      "**Font size in pixels**: put it on the **heading 1**, the **heading 2**, and the **crime paragraph** (3 uses)",
      "**Center** the text: put it on the **heading 1**, the **heading 3**, and the **reward paragraph** (3 uses)",
      "**Font family**: serif on the **heading 1**, monospace on the **first description paragraph**, sans-serif on the **reward paragraph** (3 uses)",
      "**Uppercase** letters: put it on the **heading 1** (WANTED in all caps)",
      "**Border** (thickness, style, color): a **solid** one on the **heading 1**, a **dashed** one on the **reward paragraph**, and a **bottom-only** border on the **heading 2** (3 different tags, 2 border styles, 1 one-sided border)",
      "Dark backgrounds need light text. Light backgrounds need dark text",
      "These are the **minimums**. You can ALWAYS add more styles to more tags"
    ] },

    { h: "Step 6: Check and submit" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 6.5 ===================== */
  A["6.5"] = [
    { h: "What you are building" },
    { p: "The **ultimate guide page**: a two-section guide about something you know better than anyone (a game, your team, a road trip, finals, pizza night). It has a banner, a menu bar, ranked lists, bullet lists, and a footer, and it uses every tag and style you know at least **2 times each**. You type the skeleton yourself, every time. **Checks** counts everything for you." },
    { map: [
      "The skeleton: doctype, html, head, and body (typed by you)",
      "Heading 1: your guide's name (a banner)",
      "Menu bar: 3 items in a row",
      "Tagline paragraph, then a horizontal line",
      "Section 1: heading 2, a paragraph, a numbered list, a bullet list",
      "Horizontal line",
      "Section 2: heading 2, a paragraph, a numbered list, a bullet list",
      "Footer paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/lists-notes.html" },

    { h: "Step 1: Skeleton, title and banner" },
    { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with your guide's name",
      "Add a **heading 1** with the name. Style the **heading 1** like a banner: put a **background color**, a light **text color**, **centered** text, a big **font size in pixels**, and a **bottom border** all on the heading 1"
    ] },

    { h: "Step 2: Menu bar" },
    { build: [
      "Under the heading 1, add a **bullet list** with **3 list items** (like Countdown, Game Plan, About)",
      "List items stack by default (they are **block**). Turn them into a row by making **each of the 3 list items inline** (put it on every list item)",
      "Remove the bullets: put the list-style setting of **none** on the **bullet list** itself (not on the items)"
    ] },

    { h: "Step 3: Tagline" },
    { build: [
      "Add a **paragraph** with a short tagline and **center** it (put the centering on that paragraph)",
      "**Inside** that paragraph, put a phrase in **italics** and color **2 words**, each with its own **span**",
      "Add a **line break inside** that paragraph",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ] },

    { h: "Step 4: Section 1 (a ranking)" },
    { build: [
      "Add a **heading 2** with a title and a short **paragraph** under it",
      "Add a **heading 3** label, then a **numbered list** with **3 list items**. Inside each list item, make the name **bold** and the description **italic**",
      "Add another **heading 3** label, then a **bullet list** with **3 list items**",
      "**Marker style:** put a list-style setting on the **numbered list** and a different one on the **bullet list**",
      "**Background color** and a **border**: put both on the **numbered list** and on the **bullet list**",
      "Only list items go directly inside a list"
    ] },

    { h: "Step 5: Section 2 (a how-to)" },
    { build: [
      "Under the lists (**outside** them), add a second **horizontal line**",
      "Add a second **heading 2**, a short **paragraph**, a **heading 3** with a **numbered list** of 3 steps, and another **heading 3** with a **bullet list** of 3 items",
      "Give these two lists the same 3 styles as Step 4: a marker style, a background color, and a border, on each list"
    ] },

    { h: "Step 6: Footer" },
    { build: [
      "At the bottom of the body, add a **paragraph** with 2 lines and a **line break inside** it",
      "On that **footer paragraph**, put **centered** text, a **font family**, and a small **font size in pixels**"
    ] },

    { h: "Step 7: Make it look professional" },
    { build: [
      "Use **one palette**: two main colors plus a neutral, reused across the page",
      "**Text color**: put it on the **heading 1** and on both **heading 2s**",
      "**Font family**: serif on the **heading 1** and on both **heading 2s**, monospace on the **footer paragraph**",
      "**Font size in pixels**: put it on the **heading 1** and on the **footer paragraph**. Heading 1 is biggest, heading 2 medium, heading 3 small",
      "**Uppercase** letters: put it on both **heading 2s**",
      "Dark backgrounds need light text",
      "These are the **minimums**. You can ALWAYS add more styles to more tags"
    ] },

    { h: "Step 8: Check and submit" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
