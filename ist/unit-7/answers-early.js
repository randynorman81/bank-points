/* "Setting up your page" steps for lessons 7.1 to 7.5. Same rules as answers.js: SHORT, no typed planning boxes,
   what to add and where it goes in plain words, never copyable tags or code. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  /* ===================== 7.1 ===================== */
  A["7.1"] = [
    { h: "What you are building" },
    { p: "Your first website: a plain, text-heavy page about a topic you know or want to learn about, like a mini encyclopedia article. It will look plain on purpose. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton (typed by you, from memory)",
      "Heading 1: your topic",
      "3 or more section headings (heading 2), each with paragraphs",
      "A last paragraph that lists at least 2 sources"
    ] },
    { p: "**Rules:** write everything yourself in the editor, in your own words. Copying from Wikipedia, a website, or an AI tool takes 50% off. Stuck? Read the notes: schscomputerscience.com/ist/unit-7/html-intro-notes.html" },

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

  /* ===================== 7.2 ===================== */
  A["7.2"] = [
    { h: "What you are building" },
    { p: "An **epic poster** for the biggest event of the year (a band's world tour, a movie premiere, an esports tournament, a made-up holiday). Make the name HUGE and give it color. Your starter page already has the skeleton. Click **Checks** any time to see your score." },
    { map: [
      "Heading 1: the event name",
      "Heading 2: a tagline or the date",
      "3 paragraphs: when, where, and how to get tickets"
    ] },
    { p: "Every style goes in a **style attribute**: the word style, an equals sign, and quotes, with the property and value **inside** the quotes and a semicolon after each. Stuck? Read the notes: schscomputerscience.com/ist/unit-7/style-attribute-notes.html" },

    { h: "Step 1: Title and heading" },
    { build: [
      "Change the page **title** (in the head) to your poster's name",
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

    { h: "Step 4: Make it epic" },
    { build: [
      "Give a tag a **text color** (the color of the letters)",
      "Give a tag a **background color** (behind the letters). Try it on the body to color the whole poster",
      "Make the heading 1 **HUGE** with a font size in pixels",
      "**Center** something, or make something **uppercase**",
      "Put a **border** around one tag (thickness, style, and color, in that order)",
      "Dark backgrounds need light text. Light backgrounds need dark text"
    ] },

    { h: "Step 5: Check and submit" },
    { build: [
      "Make sure every style has a colon, a semicolon, and quotes around it",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.3 ===================== */
  A["7.3"] = [
    { h: "What you are building" },
    { p: "The **menu** for your dream restaurant (a taco truck, a bakery, a cafe in space, anything school-appropriate). Your starter page already has the skeleton. Click **Checks** any time to see your score." },
    { map: [
      "Heading 1: the restaurant's name",
      "Paragraph: address or hours on separate lines",
      "Horizontal line",
      "Section (heading 2) with dishes, like Starters",
      "Horizontal line",
      "Section (heading 2) with dishes, like Main Dishes",
      "Horizontal line",
      "Section (heading 2) with dishes, like Desserts"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-7/editing-tags-notes.html" },

    { h: "Step 1: Title and name" },
    { build: [
      "Change the page **title** (in the head) to your restaurant's name",
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

    { h: "Step 4: Fonts and a border" },
    { build: [
      "Give a tag a **font family** (serif, sans-serif, or monospace) that fits your restaurant",
      "Put a **border** around one item, like your special of the day (thickness, style, and color, in that order)"
    ] },

    { h: "Step 5: Check and submit" },
    { build: [
      "Make sure your bold and italic text are **inside** paragraphs or headings",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.4 ===================== */
  A["7.4"] = [
    { h: "What you are building" },
    { p: "The **ultimate Wanted poster** for an outlaw on the loose (a villain, your pet who stole the snacks, a made-up criminal). This is a build day: use every tag and style you know at least **3 times each**, plus borders. Your starter page already has the skeleton. **Checks** counts everything for you." },
    { map: [
      "Heading 1: WANTED",
      "Paragraph: the crime, then a horizontal line",
      "Heading 2: Description, with paragraphs, then a horizontal line",
      "Heading 3: Last seen, with a paragraph, then a horizontal line",
      "Heading 2: Reward, with a paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-7/borders-notes.html" },

    { h: "Step 1: Title and heading" },
    { build: [
      "Change the page **title** (in the head) to your poster's name",
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

    { h: "Step 5: Style it (3 of everything)" },
    { build: [
      "Use each of these at least **3 times**: text color, background color, font size in pixels, text-align or text-transform, and a font family",
      "Put a **border** (thickness, style, color) on at least **3 different tags**",
      "Use at least **2 different border styles**, and give one tag a **one-sided border** (top, bottom, left, or right)",
      "Dark backgrounds need light text. Light backgrounds need dark text"
    ] },

    { h: "Step 6: Check and submit" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* ===================== 7.5 ===================== */
  A["7.5"] = [
    { h: "What you are building" },
    { p: "The **ultimate guide page**: a two-section guide about something you know better than anyone (a game, your team, a road trip, finals, pizza night). It has a banner, a menu bar, ranked lists, bullet lists, and a footer, and it uses every tag and style you know at least **2 times each**. Your starter page already has the skeleton. **Checks** counts everything for you." },
    { map: [
      "Heading 1: your guide's name (a banner)",
      "Menu bar: 3 items in a row",
      "Tagline paragraph, then a horizontal line",
      "Section 1: heading 2, a paragraph, a numbered list, a bullet list",
      "Horizontal line",
      "Section 2: heading 2, a paragraph, a numbered list, a bullet list",
      "Footer paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-7/lists-notes.html" },

    { h: "Step 1: Title and banner" },
    { build: [
      "Change the page **title** (in the head) to your guide's name",
      "Add a **heading 1** with the name. Style it like a banner: a background color, light text, centered, a big font size, and a border under it"
    ] },

    { h: "Step 2: Menu bar" },
    { build: [
      "Under the heading 1, add a **bullet list** with **3 items** (like Countdown, Game Plan, About)",
      "Lists stack their items by default (list items are **block**). Turn the items into a row by making each list item **inline**",
      "Remove the bullets from this list"
    ] },

    { h: "Step 3: Tagline" },
    { build: [
      "Add a **paragraph** with a short tagline and center it",
      "Put a phrase in **italics** and color 2 words with **spans**. All of these go **inside** the paragraph",
      "Add a **line break inside** the paragraph",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ] },

    { h: "Step 4: Section 1 (a ranking)" },
    { build: [
      "Add a **heading 2** with a title and a short **paragraph**",
      "Add a **heading 3** label, then a **numbered list** with **3 items**. Make each name **bold** and each description **italic**, both **inside** the list item",
      "Add another **heading 3** label, then a **bullet list** with **3 items**",
      "Give each list its own marker style, a background color, and a border",
      "Only list items go directly inside a list"
    ] },

    { h: "Step 5: Section 2 (a how-to)" },
    { build: [
      "Under the lists (**outside** them), add a second **horizontal line**",
      "Add a **heading 2**, a short **paragraph**, a **heading 3** with a **numbered list** of 3 steps, and another **heading 3** with a **bullet list** of 3 items",
      "Style these lists the same way"
    ] },

    { h: "Step 6: Footer" },
    { build: [
      "At the bottom, add a **paragraph** with 2 lines and a **line break inside** it",
      "Center it and make the text small"
    ] },

    { h: "Step 7: Make it look professional" },
    { build: [
      "Use **one palette**: two main colors plus a neutral, reused across the page",
      "Use **two font families**: one for headings and one for body text",
      "Heading 1 is biggest, heading 2 medium, heading 3 small",
      "Dark backgrounds need light text"
    ] },

    { h: "Step 8: Check and submit" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];
})(typeof window !== "undefined" ? window : globalThis);
