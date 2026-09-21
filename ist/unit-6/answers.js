/* "Setting up your page": the short, step-by-step instructions tab in the Web Editor (first tab).
   Keep it SHORT. A class period is 90 minutes and the teacher also needs time to teach, so students should spend
   their time building, not typing plans. No planning boxes, no long text.
   Each lesson entry is an ordered list of blocks:
     { h: "Heading" }                 a heading ("Step ..." headings get big spacing above them)
     { p: "Text" }                    plain text
     { build: ["bullet", ...] }       bullets for the step
     { map: ["line", ...] }           a numbered top-to-bottom list of the page
     { id, q, t }, { grp, fields }    optional typed questions (avoid; they cost class time)
   Text supports `code` and **bold**.
   Writing rule: describe WHAT to add and WHERE it goes in plain words ("goes inside the paragraph"). Never give exact
   tags, attributes, or code to copy.
*/
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  A["6.6"] = [
    { h: "What you are building" },
    { p: "A **link hub**: a one-page website that points people to the best sites about something you love (games, careers, music, anything school-appropriate). Follow the steps from top to bottom. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton: doctype, html, head, and body (typed by you)",
      "Heading 1 (your hub's name)",
      "Tagline paragraph, then a horizontal line",
      "Heading 2 + heading 3 + bullet list: 3 links that open in a NEW tab",
      "Horizontal line",
      "Heading 2 + heading 3 + numbered list: 3 links that open in the SAME tab",
      "Footer paragraph"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/links-notes.html" },

    { h: "Step 1: Skeleton, title and heading" },
    { build: [
      "Pick a topic and a name for your hub",
      "Type the **skeleton** first: the doctype line, then **html** with a **head** and a **body** inside it (the head comes first)",
      "Inside the head, add a **title** with that name",
      "Add a **heading 1** at the top of the body with the same name"
    ] },

    { h: "Step 2: Tagline" },
    { build: [
      "Add a **paragraph** under your heading 1 with a short tagline",
      "Put a few words in **italics**. The italic tag goes **inside** the paragraph",
      "Color one word using a **span** with a style. The span goes **inside** the paragraph, around just that word",
      "Add a **line break inside** the paragraph to split the tagline onto two lines",
      "Under the paragraph (**outside** it), add a **horizontal line**"
    ] },

    { h: "Step 3: 3 links that open in a NEW tab" },
    { build: [
      "Under the line, add a **heading 2** and a **heading 3**, then a **bullet list** with **3 list items**",
      "In each list item, turn a real website's name into a **link** (use the full address, starting with https://). The link goes **inside** the list item",
      "Make each link open in a **new tab**",
      "Make the site's name **bold**. The bold goes **inside** the link",
      "After the link, still inside the list item, add a dash and a short note in **italics**"
    ] },

    { h: "Step 4: 3 links that open in the SAME tab" },
    { build: [
      "Under the bullet list (**outside** it), add a second **horizontal line**",
      "Add a **heading 2** and a **heading 3**, then a **numbered list** with **3 list items**",
      "Make each item a **link**, but do **not** open it in a new tab",
      "After each link, add a dash and a short note in **italics**"
    ] },

    { h: "Step 5: Footer" },
    { build: [
      "At the very bottom of the body, add a **paragraph** with your name, a **line break inside** it, and your class period on the second line",
      "Give this paragraph its own **style**: centered text, the **monospace** font family, and small text (14 pixels)"
    ] },

    { h: "Step 6: Link states (your first style block)" },
    { build: [
      "Add a **style block** inside the **head**, under the title (not in the body)",
      "Inside it, write a rule for each link state, in this order: **link, visited, hover, active**",
      "Make **hover** change **two** things: the text color and the background color",
      "Inside a style block there are **no quotes** and you do **not** write the word style"
    ] },

    { h: "Step 7: Style the rest from the head" },
    { build: [
      "In the same style block, add a rule for **heading 1** (a banner look: colors, a font family, a big size, centered, and a border)",
      "Add a rule for **heading 2** (a color, a size, uppercase letters)",
      "Add a rule for each **list** with a different marker style",
      "Add a rule for the **body** with a background color and a font family"
    ] },

    { h: "Step 8: Test and submit" },
    { build: [
      "Hover over every link. Click a new-tab link and a same-tab link",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  function leaves(list) {
    var out = [];
    (list || []).forEach(function (it) {
      if (it.grp) it.fields.forEach(function (f) { out.push(f); });
      else if (it.id) out.push(it);
    });
    return out;
  }
  root.U7_WALK = root.U7_WALK || {};
  root.U7_ANSWER_LEAVES = leaves;
})(typeof window !== "undefined" ? window : globalThis);
