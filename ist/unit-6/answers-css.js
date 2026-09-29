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
    { h: "Step 3: Write at least 3 rules" },
    { build: [
      "In style.css, write a rule for the **body** (a background color and a font family)",
      "Write a rule for your **headings** and one for your **paragraphs**",
      "Inside a CSS file there are **no style tags** and **no quotes** around values"
    ] },
    { h: "Step 4: Add a class" },
    { build: [
      "Give one or more elements in index.html a **class** with a name you make up (like highlight)",
      "In style.css, write a rule for that class. A class rule starts with a **dot** before the name",
      "Check the preview: only the elements with that class should change"
    ] },
    { h: "Step 5: Test and submit" }, finish()
  ];

  A["8.2"] = [
    { h: "What you are doing" },
    { p: "Style **one specific element** by giving it an **id**." },
    { h: "Step 1: Bring in your website" }, start("8.1"),
    { h: "Step 2: Add an id" },
    { build: [
      "Pick **one** element that should look unique (like your banner or footer) and give it an **id** with a name you make up",
      "An id is one-of-a-kind: use each id name only **once** on the page"
    ] },
    { h: "Step 3: Style it" },
    { build: [
      "In **style.css**, write a rule for that id. An id rule starts with a **#** before the name",
      "Give it at least 2 properties (for example a background color and padding)"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.3"] = [
    { h: "What you are doing" },
    { p: "Show **specificity**: a class rule beats a tag rule, and one element can wear **two classes at once**." },
    { h: "Step 1: Bring in your website" }, start("8.2"),
    { h: "Step 2: Class beats tag" },
    { build: [
      "In **style.css**, make sure you have a rule for a tag, like all **paragraphs**, that sets a color",
      "Give one paragraph a **class**, and write a class rule that sets a **different** color",
      "Check the preview: that one paragraph uses the class color, because a class is more specific than a tag"
    ] },
    { h: "Step 3: Two classes on one element" },
    { build: [
      "Pick another element and give it **two class names** in the same class attribute, separated by a space",
      "Write a rule in style.css for **each** of the two classes (for example one for a color, one for a border)"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.4"] = [
    { h: "What you are doing" },
    { p: "Add a **hover effect** that changes smoothly with a **transition**." },
    { h: "Step 1: Bring in your website" }, start("8.3"),
    { h: "Step 2: Pick what reacts" },
    { build: [
      "Choose a **button**, a **link**, or a **card** on your page (add one if you need to)",
      "In **style.css**, add a **transition** to its normal rule so changes animate"
    ] },
    { h: "Step 3: Add the hover rule" },
    { build: [
      "Write a **hover** rule for the same element (the selector, then a colon and the word hover)",
      "Change at least one thing on hover, like the background color, the text color, or its size"
    ] },
    { h: "Step 4: Test and submit" }, finish(["Move your mouse over it in the preview. The change should be smooth, not instant"])
  ];

  A["8.5"] = [
    { h: "What you are doing" },
    { p: "Turn one section into a **flex container** and arrange the items inside it." },
    { h: "Step 1: Bring in your website" }, start("8.4"),
    { h: "Step 2: Make a flex section" },
    { build: [
      "Wrap 3 or more items (boxes, cards, or links) inside one **div** and give that div a **class**",
      "In **style.css**, give that class **display flex**"
    ] },
    { h: "Step 3: Arrange the items" },
    { build: [
      "In the **same rule**, use **justify-content** to spread the items out across the row",
      "Try **align-items** to line them up top to bottom",
      "Watch the preview as you try different values"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.6"] = [
    { h: "What you are doing" },
    { p: "Turn one section, like a gallery or a set of cards, into a **grid**." },
    { h: "Step 1: Bring in your website" }, start("8.5"),
    { h: "Step 2: Make a grid section" },
    { build: [
      "Put 4 or more items inside one **div** and give that div a **class**",
      "In **style.css**, give that class **display grid**"
    ] },
    { h: "Step 3: Columns and gap" },
    { build: [
      "In the **same rule**, use **grid-template-columns** to make 2 or 3 columns",
      "Add a **gap** so the items have space between them"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["8.7"] = [
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your site must show everything from this unit." },
    { h: "Step 1: Start" }, start("8.6"),
    { h: "Step 2: Show every skill" },
    { build: [
      "Linked **style.css** with styles by **tag**, **class**, and **id**",
      "A class that beats a tag rule, and an element with **two classes**",
      "At least one **hover** effect with a **transition**",
      "At least one **flexbox** section and one **grid** section"
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
      "Add a **div** with Bootstrap's **container** class",
      "Inside it, add a **div** with the **row** class",
      "Inside the row, add at least **2 divs** with a **col** class, and put some content in each"
    ] },
    { h: "Step 3: Test and submit" }, finish(["Make the preview narrower and wider to watch the columns"])
  ];

  A["9.3"] = [
    { h: "What you are doing" },
    { p: "Style text and color with Bootstrap **utility classes**, and add a Bootstrap **button**." },
    { h: "Step 1: Bring in your website" }, start("9.2"),
    { h: "Step 2: Utility classes" },
    { build: [
      "Add at least one Bootstrap **text** or **background color** class to an element (like a primary text color or a light background)",
      "Try a text class too, like bold or centered"
    ] },
    { h: "Step 3: A button" },
    { build: [
      "Add a **button** or a **link** with Bootstrap's **btn** class **plus** a style class (like the primary button style)"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["9.4"] = [
    { h: "What you are doing" },
    { p: "Add a Bootstrap **navbar** across the top of your site." },
    { h: "Step 1: Bring in your website" }, start("9.3"),
    { h: "Step 2: Build the navbar" },
    { build: [
      "At the top of the body, add a **nav** with Bootstrap's **navbar** class (add a color class too)",
      "Inside it, add your site's name using the **navbar-brand** class",
      "Add at least **3 links**, each with the **nav-link** class"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];

  A["9.5"] = [
    { h: "What you are doing" },
    { p: "Build a **row of at least 3 cards**, each with an image, a title, text, and a button." },
    { h: "Step 1: Bring in your website" }, start("9.4"),
    { h: "Step 2: Build one card" },
    { build: [
      "Inside a **row**, make a column, and inside it a **div** with the **card** class",
      "In the card: an **image** (card-img-top), then a card body with a **title** (card-title), **text** (card-text), and a **button** (btn)"
    ] },
    { h: "Step 3: Make 3 cards" },
    { build: [
      "Repeat for at least **3 cards** in the same row, each about something different",
      "Remember: every image is wrapped in a link (same rule as 6.7)"
    ] },
    { h: "Step 4: Test and submit" }, finish()
  ];

  A["9.6"] = [
    { h: "What you are doing" },
    { p: "Build a Bootstrap **form** with at least 2 labeled fields and a submit button." },
    { h: "Step 1: Bring in your website" }, start("9.5"),
    { h: "Step 2: Build the form" },
    { build: [
      "Add a **form** to your page",
      "Add at least **2 fields**: each gets a **label** with the **form-label** class and an input with the **form-control** class",
      "At the bottom of the form, add a **submit button** with Bootstrap's **btn** classes"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];

  A["9.7"] = [
    { h: "Unit test website" },
    { p: "Your teacher gives the exact requirements on test day. Your page must show everything from this unit." },
    { h: "Step 1: Start" }, start("9.6"),
    { h: "Step 2: Show every skill" },
    { build: [
      "The **Bootstrap link** in the head",
      "A **grid** with a container, a row, and columns",
      "A **navbar**, at least one **card**, and a **form**"
    ] },
    { h: "Step 3: Test and submit" }, finish()
  ];
})(typeof window !== "undefined" ? window : globalThis);
