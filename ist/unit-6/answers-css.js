/* "Assignment" tab steps for the CSS unit (8.x) and the Bootstrap unit (9.x).
   Same rules as answers.js: SHORT, no typed planning boxes, and describe WHAT to add and WHERE in plain
   words. Never give exact tags, attributes, or code to copy.
   These lessons keep building ONE website: an empty lesson shows a "Start from my X.Y website" button. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  function start(prev) {
    return { build: [
      "Click **Start from my " + prev + " website** above the code (it only shows when this lesson is empty). Your whole site copies in, and you keep building from there",
      "No older website? Build a short page first: the skeleton, a title, one heading 1, and at least 3 paragraphs"
    ] };
  }
  function finish(extra) {
    return { build: (extra || []).concat([
      "Click **Checks** and fix anything that is not green",
      "Choose your class period at the top, then click **Submit**"
    ]) };
  }

  /* ---------------- CSS unit ---------------- */
  A["8.1"] = [
    { h: "What you are doing" },
    { p: "Move your website's styling into its own file, **style.css**, and style something with a **class**. Click **Checks** any time to see your score." },
    { h: "Step 1: Bring in your website" }, start("7.6"),
    { h: "Step 2: Link the CSS file" },
    { build: [
      "Inside the **head** of index.html, add a **link** to your CSS file, which is named **style.css**",
      "Click the **style.css** tab at the top of the editor. All of today's CSS goes there, not in the page"
    ] },
    { h: "Step 3: Write at least 3 rules (exactly which tags)" },
    { build: [
      "Rule 1: the **body** tag, with a **background color** and a **font family**",
      "Rule 2: the **heading 1** tag, with a **text color** and a **font size**",
      "Rule 3: the **paragraph** tag, with a **text color** and a **line height** or a **font size**",
      "Inside a CSS file there are **no style tags** and **no quotes** around values",
      "These are the **minimums**. You can ALWAYS add more rules for more tags"
    ] },
    { h: "Step 4: Add a class (exactly where it goes)" },
    { build: [
      "In index.html, give the **first paragraph** a **class** with a name you make up (like highlight)",
      "In style.css, write a rule for that class with a **background color** and a **text color**. A class rule starts with a **dot** before the name",
      "Check the preview: only the first paragraph should change. You can ALWAYS give the class to more elements"
    ] },
    { h: "Step 5: Test and submit" }, finish()
  ];

  A["8.2"] = [
    { h: "What you are doing" },
    { p: "Style **one specific element** by giving it an **id**." },
    { h: "Step 1: Bring in your website" }, start("8.1"),
    { h: "Step 2: Add an id" },
    { build: [
      "In index.html, give the **heading 1** an **id** with a name you make up (like pageTitle)",
      "An id is one-of-a-kind: use each id name only **once** on the page. You can ALWAYS give more elements their own id, each with a different name"
    ] },
    { h: "Step 3: Style it" },
    { build: [
      "In **style.css**, write a rule for that id. An id rule starts with a **#** before the name",
      "Give that rule at least **2 properties**: a **background color** and **padding**",
      "Check the preview: only the heading 1 should change"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.3"] = [
    { h: "What you are doing" },
    { p: "Show **specificity**: a class rule beats a tag rule, and one element can wear **two classes at once**." },
    { h: "Step 1: Bring in your website" }, start("8.2"),
    { h: "Step 2: Class beats tag" },
    { build: [
      "In **style.css**, make sure you have a rule for the **paragraph** tag that sets a **text color**",
      "In index.html, give the **second paragraph** a **class**, and in style.css write a class rule that sets a **different text color**",
      "Check the preview: only that second paragraph uses the class color, because a class is more specific than a tag"
    ] },
    { h: "Step 3: Two classes on one element" },
    { build: [
      "In index.html, give the **third paragraph** **two class names** in the same class attribute, separated by a space",
      "In style.css, write a rule for **each** of the two classes: one that sets a **background color** and one that sets a **border**",
      "These are the **minimums**. You can ALWAYS add classes to more elements"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.4"] = [
    { h: "What you are doing" },
    { p: "Add a **hover effect** that changes smoothly with a **transition**." },
    { h: "Step 1: Bring in your website" }, start("8.3"),
    { h: "Step 2: Pick what reacts" },
    { build: [
      "The element that reacts is the **links** (every link on your page). If your page has no links yet, add one **link** to a real website (starting with https://) inside a paragraph",
      "In **style.css**, add a **transition** to the normal rule for the **link** tag, so changes animate. Put it on the normal rule, not the hover rule"
    ] },
    { h: "Step 3: Add the hover rule" },
    { build: [
      "In **style.css**, write a **hover** rule for the **link** tag (the tag name, then a colon and the word hover)",
      "In that hover rule, change at least **2 things**: the **background color** and the **text color**",
      "These are the **minimums**. You can ALWAYS add hover effects to more tags, like buttons and cards"
    ] },
    { h: "Step 4: Test and submit" }, finish(["Move your mouse over it in the preview. The change should be smooth, not instant"])
  ];

  A["8.5"] = [
    { h: "What you are doing" },
    { p: "Turn one section into a **flex container** and arrange the items inside it." },
    { h: "Step 1: Bring in your website" }, start("8.4"),
    { h: "Step 2: Make a flex section" },
    { build: [
      "In index.html, make **one div** and give that div a **class** (like menuRow). This div is the flex container",
      "Inside that div, put **3 or more items**: for example 3 **paragraphs** or 3 **links**",
      "In **style.css**, write a rule for that **class** (not the body) and set **display** to **flex**"
    ] },
    { h: "Step 3: Arrange the items" },
    { build: [
      "In the **same class rule**, add **justify-content** (try space-between or center) to spread the items across the row",
      "In the **same class rule**, add **align-items** (try center) to line them up top to bottom",
      "Watch the preview as you try different values. You can ALWAYS add more flex sections"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.6"] = [
    { h: "What you are doing" },
    { p: "Turn one section, like a gallery or a set of cards, into a **grid**." },
    { h: "Step 1: Bring in your website" }, start("8.5"),
    { h: "Step 2: Make a grid section" },
    { build: [
      "In index.html, make **one div** and give that div a **class** (like gallery). This div is the grid container",
      "Inside that div, put **4 or more items**: for example 4 **images** (each wrapped in a link) or 4 **paragraphs**",
      "In **style.css**, write a rule for that **class** and set **display** to **grid**"
    ] },
    { h: "Step 3: Columns and gap" },
    { build: [
      "In the **same class rule**, add **grid-template-columns** to make 2 or 3 columns",
      "In the **same class rule**, add a **gap** so the items have space between them",
      "These are the **minimums**. You can ALWAYS add more grids"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.7"] = [
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your site must show everything from this unit." },
    { h: "Step 1: Start" }, start("8.6"),
    { h: "Step 2: Show every skill" },
    { build: [
      "**Tag rules** in style.css for the **body**, the **heading 1**, and the **paragraph**",
      "A **class** on the first paragraph, an **id** on the heading 1, and a **third paragraph with two classes**",
      "A class rule that overrides the paragraph rule on the **second paragraph**",
      "A **hover** rule with a **transition** on the **link** tag",
      "A **flexbox** div (class rule with display flex, justify-content, and align-items) and a **grid** div (class rule with display grid, grid-template-columns, and a gap)",
      "These are the **minimums**. You can ALWAYS add more"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];

  /* ---------------- Bootstrap unit ---------------- */
  A["9.1"] = [
    { h: "What you are doing" },
    { p: "Add **Bootstrap**, a giant ready-made stylesheet, to your website." },
    { h: "Step 1: Bring in your website" }, start("8.7"),
    { h: "Step 2: Add the Bootstrap link" },
    { build: [
      "Go to **getbootstrap.com**, open **Getting Started**, and find the official **CSS link** (it is a full https:// address)",
      "Add that link **inside the head** of index.html, **above** the link to your own style.css so your styles still win"
    ] },
    { h: "Step 3: See the change" },
    { build: [
      "Look at the preview: your text and spacing change even before you add any Bootstrap classes",
      "Nothing changed? Check the head first. The Bootstrap link must be inside it"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["9.2"] = [
    { h: "What you are doing" },
    { p: "Use Bootstrap's **grid**: a container, a row, and columns." },
    { h: "Step 1: Bring in your website" }, start("9.1"),
    { h: "Step 2: Build the grid" },
    { build: [
      "In index.html, add a **div** with Bootstrap's **container** class. Put it in the **body**, under your navbar or heading 1",
      "**Inside the container div**, add a **div** with the **row** class",
      "**Inside the row div**, add at least **2 divs**, each with a **col** class. Put a **heading 2** and a **paragraph** inside each column",
      "These are the **minimums**. You can ALWAYS add more columns or more rows"
    ] },
    { h: "Step 3: Test and submit" }, finish(["Make the preview narrower and wider to watch the columns"])
  ];

  A["9.3"] = [
    { h: "What you are doing" },
    { p: "Style text and color with Bootstrap **utility classes**, and add a Bootstrap **button**." },
    { h: "Step 1: Bring in your website" }, start("9.2"),
    { h: "Step 2: Utility classes" },
    { build: [
      "Put a Bootstrap **text color** class on the **heading 1** (like a primary text color)",
      "Put a Bootstrap **background color** class on the **first column's paragraph** (like a light background)",
      "Put a Bootstrap **bold** text class on the **second column's heading 2**",
      "These are the **minimums**. You can ALWAYS add more utility classes to more tags"
    ] },
    { h: "Step 3: A button" },
    { build: [
      "Under the paragraph in the **second column**, add a **link** to a real website (starting with https://)",
      "Give that link Bootstrap's **btn** class **plus** a style class (like the primary button style)"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["9.4"] = [
    { h: "What you are doing" },
    { p: "Add a Bootstrap **navbar** across the top of your site." },
    { h: "Step 1: Bring in your website" }, start("9.3"),
    { h: "Step 2: Build the navbar" },
    { build: [
      "At the very **top of the body** (above the container), add a **nav** tag with Bootstrap's **navbar** class, plus a color class like a dark or light background",
      "**Inside the nav**, add a **link** with the **navbar-brand** class that shows your site's name",
      "**Inside the nav** too, add at least **3 links**, each with the **nav-link** class. Give each one a real page name (like Home, About, Contact) and a full https:// address",
      "These are the **minimums**. You can ALWAYS add more links"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];

  A["9.5"] = [
    { h: "What you are doing" },
    { p: "Build a **row of at least 3 cards**, each with an image, a title, text, and a button." },
    { h: "Step 1: Bring in your website" }, start("9.4"),
    { h: "Step 2: Build one card" },
    { build: [
      "Under your grid, add a **div** with the **row** class",
      "**Inside the row**, add a **div** with a **col** class, and **inside the column** add a **div** with the **card** class",
      "**Inside the card div**, add in this order: an **image** with the **card-img-top** class (wrapped in a link, like 6.7), then a **div** with the **card-body** class",
      "**Inside the card-body div**, add a **heading** with the **card-title** class, a **paragraph** with the **card-text** class, and a **link** with the **btn** class plus a button style"
    ] },
    { h: "Step 3: Make 3 cards" },
    { build: [
      "Copy the same layout **twice more inside the same row**, so the row holds at least **3 columns**, each with its own card about something different",
      "Every image is wrapped in a link (same rule as 6.7)",
      "These are the **minimums**. You can ALWAYS add more cards"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["9.6"] = [
    { h: "What you are doing" },
    { p: "Build a Bootstrap **form** with at least 2 labeled fields and a submit button." },
    { h: "Step 1: Bring in your website" }, start("9.5"),
    { h: "Step 2: Build the form" },
    { build: [
      "Under your cards, add a **form** tag",
      "**Inside the form**, add at least **2 fields**. For each field: a **label** with the **form-label** class, then an **input** with the **form-control** class (for example a Name field and an Email field)",
      "At the **bottom of the form** (inside it), add a **button** with type submit and Bootstrap's **btn** class plus a button style",
      "These are the **minimums**. You can ALWAYS add more fields"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];

  A["9.7"] = [
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your page must show everything from this unit." },
    { h: "Step 1: Start" }, start("9.6"),
    { h: "Step 2: Show every skill" },
    { build: [
      "The **Bootstrap link** inside the **head**, above your style.css link",
      "A **navbar** at the top of the **body** with a brand and at least 3 nav links **inside** it",
      "A **grid**: a container div, with a row div **inside** it, with at least 2 column divs **inside** the row",
      "At least one **card** (image, title, text, and button **inside** it) inside a column",
      "A **form** with at least 2 labeled fields and a submit button, all **inside** the form",
      "These are the **minimums**. You can ALWAYS add more"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];
})(typeof window !== "undefined" ? window : globalThis);
