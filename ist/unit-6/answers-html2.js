/* "Assignment" tab steps for 6.7 (Images) and HTML Part 2 (7.1-7.6).
   Same rules as answers.js: SHORT, no typed planning boxes, and describe WHAT to add and WHERE in plain
   words. Never give exact tags, attributes, or code to copy.
   Each of these is a brand new page: students type their own skeleton. The 7.x checks read the
   **style attribute**, so the steps say to style elements there. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  function skeleton(what) {
    return { build: [
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with " + what,
      "Add exactly **one heading 1** at the top of the body"
    ] };
  }
  function finish(extra) {
    return { build: (extra || []).concat([
      "Click **Checks** and fix anything that is not green",
      "Choose your class period at the top, then click **Submit** (you can submit again to replace it)"
    ] ) };
  }

  A["6.7"] = [
    { h: "What you are building" },
    { p: "A **Wanted poster** with real pictures. You upload your own pictures, change their sizes, and make **every picture a clickable link**. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton, with a style block in the head",
      "Heading 1 (WANTED or the outlaw's name) and a centered paragraph with the crime",
      "The main picture: big, with a border, opens in a NEW tab",
      "Heading 2 Evidence: a small picture with rounded corners",
      "Heading 2 Last Seen: a picture that is a percent wide, on its own line",
      "Heading 2 Reward: a paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/images-notes.html" },

    { h: "Step 1: Pick your outlaw and get 3 pictures" },
    { build: [
      "Pick who is wanted (your pet, a made-up outlaw, a villain you draw, or a friend in a silly disguise, with permission). Keep it school-appropriate",
      "Take or draw **at least 3 pictures** and save them as JPG or PNG files"
    ] },

    { h: "Step 2: Upload your pictures" },
    { build: [
      "Click **Checks** and find **My images**",
      "Upload each picture and wait for it to show up in the list. You need **at least 2** uploaded this way"
    ] },

    { h: "Step 3: Skeleton and the top" },
    skeleton("your poster's name"),
    { build: [
      "Under the heading 1, add a **paragraph** with the crime, and **center** it with a style"
    ] },

    { h: "Step 4: The main picture" },
    { build: [
      "Add a centered **paragraph**, click inside it, then click **Insert** on picture 1. The editor writes a picture wrapped in a link for you",
      "Change the placeholder link to a **real website** that starts with https://. This one opens in a **new tab**",
      "Change the **alt** to a real description of the picture",
      "On **picture 1**, put a **width** in pixels (like 300) and a **border** (thickness, style, color), both in the picture's own style",
      "Set width **or** height, never both. You can ALWAYS add more pictures"
    ] },

    { h: "Step 5: Evidence and Last Seen" },
    { build: [
      "Add a **heading 2** that says Evidence, then a paragraph with picture 2 inside it. On **picture 2**, put a small **width** in pixels (like 100) and **rounded corners**",
      "This link opens in the **same tab**, so take out the part that opens a new tab. Fix its link and alt",
      "Add a **heading 2** that says Last Seen, then insert picture 3. On **picture 3**, put a **width** as a **percent** (like 50) and set **display** to **block** so it sits on its own line. Fix its link and alt"
    ] },

    { h: "Step 6: Reward and a style block" },
    { build: [
      "Add a **heading 2** that says Reward and a **paragraph** with the reward and who to call",
      "Add a **style block** inside the **head**, under the title, with at least **2 rules**: one rule for the **body** tag (a background color and a font family) and one rule for the **heading 1** tag (a text color and a font size)"
    ] },

    { h: "Step 7: Test and submit" },
    finish(["Try a few different widths on picture 1 and watch the preview, then set it back"])
  ];

  A["7.1"] = [
    { h: "What you are building" },
    { p: "Three **postcards** from a trip around the world. Each postcard is a box, and you use the **box model** (padding, border, margin) to frame it. Click **Checks** any time to see your score." },
    { map: [
      "Content: the text (the photo in a frame)",
      "Padding: space inside the border (it takes the background color)",
      "Border: the outline around the padding",
      "Margin: space outside the border (always see-through)"
    ] },
    { p: "Stuck? Read the 7.1 lesson page or the study guide: schscomputerscience.com/ist/unit-7/study-guide.html" },

    { h: "Step 1: Skeleton" }, skeleton("your trip's name"),

    { h: "Step 2: Three postcards" },
    { build: [
      "Add **three paragraphs**, each one a postcard from a different place. Say what you saw, ate, or did"
    ] },

    { h: "Step 3: Frame them" },
    { build: [
      "In the **style attribute of each postcard paragraph**, add **padding**, a **border**, and a **margin**. The **first postcard** must have all three",
      "Give each postcard's border a real style: **solid** on the first, **dashed** on the second, **dotted** on the third (double, groove, and ridge also work)",
      "Try changing just **one side** (like only the top padding or only the left margin)"
    ] },

    { h: "Step 4: Test and submit" }, finish()
  ];

  A["7.2"] = [
    { h: "What you are building" },
    { p: "A **mood board**: a page that uses a palette of colors to create a vibe (a spooky night, a beach day, a neon city, a cozy cabin, or your own idea)." },
    { p: "Hex reminder: a **#** and then 6 characters in three pairs: red, green, blue. Each pair goes from 00 (none) to FF (the most)." },

    { h: "Step 1: Skeleton" }, skeleton("your mood's name"),

    { h: "Step 2: Color swatches" },
    { build: [
      "Add **4 to 6 paragraphs**. Each one is a swatch: the color's name or code and a word for the feeling",
      "In the **style attribute of each swatch paragraph**, put a **background color** and a **text color** that is easy to read on it",
      "Use a **named color** (like tomato, navy, or teal) for the background of the **first swatch**, and a **hex code** for the background of the **second swatch**",
      "These are the **minimums**. You can ALWAYS add more swatches and more colors"
    ] },

    { h: "Step 3: Check your hex codes" },
    { build: [
      "Every hex code starts with **#** and has **3 or 6** characters, using only 0 to 9 and A to F",
      "Search for a color picker online if you need help finding codes"
    ] },

    { h: "Step 4: Test and submit" }, finish()
  ];

  A["7.3"] = [
    { h: "What you are building" },
    { p: "The home screen of your own **streaming app**: a menu bar with buttons in a row and one giant PLAY button, all with the **display** property." },
    { map: [
      "block: takes the whole row and starts a new line (paragraphs, divs, headings)",
      "inline: only as wide as its content, sits in a line (spans, links, bold, images)",
      "inline-block: sits in a row, but you can set its width and height"
    ] },

    { h: "Step 1: Skeleton" }, skeleton("your app's name"),

    { h: "Step 2: The menu bar" },
    { build: [
      "Add **at least 4 menu items** (like Home, Movies, Music, Games). Make each one its own **div**",
      "In the **style attribute of each menu div**, set **display** to **inline-block** so they sit side by side",
      "In the same style attribute of each menu div, add a **width**, a **background color**, and **centered text** so it looks like an app button"
    ] },

    { h: "Step 3: The giant button" },
    { build: [
      "Add a **link** to a real website (starting with https://) that says PLAY",
      "In the **link's own style attribute**, set **display** to **block** so it fills the row, and add a **background color**. You can ALWAYS add more menu items or more buttons"
    ] },

    { h: "Step 4: Test and submit" }, finish()
  ];

  A["7.4"] = [
    { h: "What you are building" },
    { p: "A **profile page** for a character, a pet, or a made-up celebrity: a sidebar on the left and a feed of posts on the right, built from **divs**." },

    { h: "Step 1: Skeleton" }, skeleton("your profile's name"),

    { h: "Step 2: Two columns" },
    { build: [
      "Under the heading 1, add a **sidebar div** and then, right after it, a **feed div**",
      "Put real content **inside** each div: the **sidebar div** gets a **heading 2** and a few **paragraphs** of facts, the **feed div** gets three short **paragraphs** (posts)",
      "In the **style attribute of the sidebar div**: set **display** to **inline-block**, **vertical-align** to **top**, and a **percent width** of about 30%",
      "In the **style attribute of the feed div**: the same **display** and **vertical-align**, and a **percent width** of about 65%. The two widths together must be **98% or less**",
      "In the **style attribute of each div**, add a **background color** and some **padding** so you can see the columns. You can ALWAYS add more divs"
    ] },

    { h: "Step 3: Test and submit" }, finish()
  ];

  A["7.5"] = [
    { h: "What you are building" },
    { p: "A **leaderboard** for your favorite game, sport, or a competition you invent, built as a **table**." },
    { map: [
      "table: the outside of the grid",
      "table row: one line across",
      "table header: a bold title cell at the top of a column",
      "table data: a normal cell"
    ] },

    { h: "Step 1: Skeleton" }, skeleton("your leaderboard's name"),

    { h: "Step 2: Build the table one row at a time" },
    { build: [
      "Add a **table** under the heading 1",
      "Row 1 is the header row: one **header cell** for each column (like Rank, Player, Score). Use at least 4 columns",
      "Then add **at least 2 data rows** (aim for 5), each with one **data cell** per column",
      "Only rows go directly inside the table, and only cells go directly inside a row",
      "Count the cells: **every row** must have the same number"
    ] },

    { h: "Step 3: Test and submit" }, finish()
  ];

  A["7.6"] = [
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your site must show everything from 6.1 through 7.5. Your teacher will tell you where to take the multiple choice test." },

    { h: "Step 1: Skeleton" }, skeleton("your website's name"),

    { h: "Step 2: Show every skill" },
    { build: [
      "**Headings and paragraphs:** one heading 1, at least 2 heading 2s, and at least 3 paragraphs. **Inside a paragraph**: bold, italics, a line break, and a **span** with its own style",
      "**Colors:** a **named color** on one heading and a **hex code** on a paragraph background, both in the style attribute",
      "**Lists and links:** a bullet list and a numbered list, each with 3 items; links inside list items, one that opens in a **new tab** and one in the **same tab**",
      "**Pictures:** at least 2 images, each **inside a link**, each with a width (or height, not both)",
      "**Box model:** **padding**, a **border**, and a **margin** in the style attribute of one paragraph",
      "**Layout:** two **divs** side by side (**inline-block**, **vertical-align top**, percent widths that add to 98% or less), and a **table** with a header row and 2 or more data rows",
      "These are the **minimums**. You can ALWAYS add more"
    ] },

    { h: "Step 3: Test and submit" }, finish()
  ];

  /* Every lesson (6.1 to 9.7) opens with the same reminder that the steps are minimums and name the exact tag. */
  var NOTE = { p: "**Minimums, not limits.** Every step below says the least you must add and exactly which tag it goes on. You can **ALWAYS add more**, but you need at least what is listed, in the place it says." };
  Object.keys(A).forEach(function (k) {
    var list = A[k], i = -1;
    for (var n = 0; n < list.length; n++) { if (list[n].p) { i = n; break; } }
    if (i > -1) list.splice(i + 1, 0, NOTE);
  });
})(typeof window !== "undefined" ? window : globalThis);
