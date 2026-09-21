/* Setting up your page (the first tab in the Web Editor): the full step-by-step assignment for a lesson.
   Each lesson entry is an ordered list of blocks. Block types:
     { h: "Heading" }                         a heading ("Step ..." headings get big spacing above them)
     { p: "Paragraph text" }                  plain text
     { make: "text" }                         "You are creating" callout (blue)
     { where: "text" }                        "Where it goes" callout (amber)
     { build: ["bullet", ...] }               "Now build it in index.html" bullets
     { code: "code shown as a pattern" }      a code pattern (avoid: students copy it; describe in words instead)
     { map: ["line", ...] }                   a picture of the page from top to bottom
     { id, q, t: "text" | "area" | "yn" | "sel", opts: [...] }   one question the student types or picks
     { grp: "Group title", fields: [ ...questions ] }             a card that groups related questions
   Text supports `code` and **bold**. Question ids: letters, numbers, underscore (30 max).
   Writing rule: describe WHAT to add and WHERE it goes (say when something goes INSIDE another tag) in plain words.
   Do not give exact tags, attributes, or code to copy.
   Optional: W["7.x"] = [ { h, items: [ { id, t } ] } ] turns on a separate check-off Walkthrough tab for a lesson.
*/
(function (root) {
  var FAMS = ["serif", "sans-serif", "monospace"];
  function site(n, label) {
    return { grp: label, fields: [
      { id: "s" + n + "n", q: "Website name", t: "text" },
      { id: "s" + n + "a", q: "Full address (starts with https://)", t: "text" },
      { id: "s" + n + "w", q: "Link words people will click (never \"click here\")", t: "text" },
      { id: "s" + n + "d", q: "Short note about the site (this goes in italics)", t: "text" }
    ] };
  }
  function state(id, name, when) {
    return { grp: name + " (" + when + ")", fields: [
      { id: id + "c", q: "Text color", t: "text" },
      { id: id + "o", q: "Anything else? (background color, underline, etc.)", t: "text" }
    ] };
  }
  var A = {}, W = {};

  A["7.6"] = [
    { h: "What you are creating" },
    { make: "A **link hub**: a one-page website that points people to the best sites about something you love, like a \"Start Here\" page. Real websites have pages like this. When you finish, visitors will see a title banner, a tagline, two lists of links, and a footer, and every link will change color when they point at it or click it." },
    { p: "Here is your page from top to bottom. You will build it in this order:" },
    { map: [
      "HEAD: the page title and your style block (Steps 1 and 7)",
      "Heading 1: your hub's name (Step 1)",
      "Paragraph: a tagline with italic words and a colored word (Step 2)",
      "Horizontal line (Step 2)",
      "Heading 2 + Heading 3 + bullet list: 3 links that open in a NEW tab (Step 3)",
      "Horizontal line (Step 4)",
      "Heading 2 + Heading 3 + numbered list: 3 links that open in the SAME tab (Step 4)",
      "Paragraph: a small footer with your name and period (Step 5)"
    ] },
    { p: "**How to use the tabs:**" },
    { build: [
      "**Setting up your page** (this tab): read each step, type your plan in the boxes, then build that part of your page. Do the steps in order from top to bottom.",
      "**index.html**: where you type your page's code. The preview on the right updates as you go."
    ] },
    { p: "**Your finished page must have:** a heading 1, heading 2, and heading 3, paragraphs, bold and italic text, line breaks, horizontal lines, a bullet list and a numbered list (3 items each), a span with its own style, at least 2 font families, a border, and a style block in the head. The **Checks** button shows your score out of 50. Aim for 50/50." },
    { p: "**Stuck?** Open the 7.6 notes: schscomputerscience.com/ist/unit-7/links-notes.html. Every step below can be done using what you learned in the notes." },

    { h: "Step 1: Name your hub" },
    { make: "The **name** of your hub, used in two places." },
    { where: "In the **title** of the page (it shows on the browser tab), and in a **heading 1** at the very top of the body." },
    { id: "topic", q: "What is your topic? (Freshman Survival Kit, The Gamer's Hub, Future Me, Creator Toolkit, Rainy Day Hub, or your own idea)", t: "text" },
    { id: "hub", q: "What is the name of your hub?", t: "text" },
    { build: [
      "Change the page **title** to your hub's name",
      "Add a **heading 1** as the first thing inside the body, and type your hub's name in it"
    ] },

    { h: "Step 2: Write your tagline" },
    { make: "A short, catchy sentence that says what your hub is for." },
    { where: "In a paragraph right under your heading 1. Then a horizontal line goes under the paragraph." },
    { id: "tag", q: "Your tagline (one or two short lines)", t: "text" },
    { id: "tagem", q: "Which words will be in italics?", t: "text" },
    { id: "tagsp", q: "Which one word will be a different color?", t: "text" },
    { id: "tagcol", q: "What color will that word be?", t: "text" },
    { build: [
      "Add a **paragraph** under your heading 1 and write your tagline in it",
      "Put your chosen words in **italics**. The italic tag goes INSIDE your paragraph, wrapped around just those words",
      "Give your one special word its own color using a **span** with a style attribute. The span goes INSIDE your paragraph, wrapped around just that one word",
      "Add a **line break** INSIDE your paragraph, in the middle of the tagline, so it splits onto two lines",
      "Under the paragraph (OUTSIDE it, on its own), add a **horizontal line**"
    ] },

    { h: "Step 3: List 3 websites that open in a NEW tab" },
    { make: "Three links to real websites. These links leave your page, so they open in a **new tab** and your hub stays open." },
    { where: "Below your first horizontal line. Start with a heading 2 and a heading 3, then a bullet list with 3 items. Each item is one website." },
    site(1, "New-tab website 1"), site(2, "New-tab website 2"), site(3, "New-tab website 3"),
    { build: [
      "Under the first horizontal line, add a **heading 2** with a title for this section (like \"Open These in a New Tab\")",
      "Under the heading 2, add a **heading 3** with a short label",
      "Under the heading 3, add a **bullet list** (unordered list)",
      "Inside the list, add **3 list items**. Only list items go directly inside a list",
      "Inside each list item, make the website's name into a **link** using the address you wrote above. The link goes INSIDE the list item",
      "Set each of these links to open in a **new tab**",
      "Make the website's name **bold**. The bold tag goes INSIDE the link, around the name",
      "After the link, still inside the list item, type a dash and your short note in **italics**"
    ] },

    { h: "Step 4: List 3 websites that open in the SAME tab" },
    { make: "Three more links. These replace your page in the current tab, which is what links do by default." },
    { where: "Below the new-tab list. Start with a second horizontal line, then a new heading 2 and heading 3, then a numbered list with 3 items." },
    site(4, "Same-tab website 1"), site(5, "Same-tab website 2"), site(6, "Same-tab website 3"),
    { build: [
      "Under your bullet list (OUTSIDE it), add a second **horizontal line**",
      "Add a **heading 2** for this section (like \"Open These Right Here\") and a **heading 3** label under it",
      "Under the heading 3, add a **numbered list** (ordered list) with **3 list items**",
      "Inside each list item, make the website's name a **link** to its address. This time do NOT make it open in a new tab",
      "After each link, still inside the list item, type a dash and your short note in **italics**"
    ] },

    { h: "Step 5: Write your footer" },
    { make: "A small footer with your name and class period, on two lines." },
    { where: "At the very bottom of the body, below the numbered list, in its own paragraph. This paragraph gets its own style so it looks different from the rest." },
    { id: "fn", q: "Your name (line 1 of the footer)", t: "text" },
    { id: "fp", q: "Your class period and class (line 2 of the footer)", t: "text" },
    { build: [
      "Under the numbered list (OUTSIDE it), add a new **paragraph**",
      "Type your name, then add a **line break** INSIDE the paragraph, then type your period on the second line",
      "Give this paragraph its own **style attribute** that centers the text, uses the **monospace** font family, and makes the text small (14 pixels)"
    ] },

    { h: "Step 6: Pick your colors and fonts" },
    { make: "A plan for how your page will look, so it feels designed instead of random." },
    { where: "You will use these choices in your style block in Steps 7 and 8. Use your two main colors over and over so the page feels matched." },
    { id: "col1", q: "First main color", t: "text" },
    { id: "col2", q: "Second main color", t: "text" },
    { id: "coln", q: "Neutral color (white, black, gray, tan...)", t: "text" },
    { id: "fh", q: "Font family for headings", t: "sel", opts: FAMS },
    { id: "fb", q: "Font family for body text", t: "sel", opts: FAMS },
    { p: "You must use at least 2 different font families. Your footer already uses monospace." },

    { h: "Step 7: Design your link states and start your style block" },
    { make: "The look of your links in four moments: before anyone clicks, after a visit, when the mouse is on it, and while it is pressed." },
    { where: "In a **style block** in the **head** of your page, right under the title. It goes in the HEAD, not the body. Write the four link states in this exact order: **link, visited, hover, active** (LoVe HAte)." },
    state("lk", "Link", "nobody has clicked it yet"),
    state("vs", "Visited", "already clicked"),
    state("hv", "Hover", "mouse is on top. Change 2 things!"),
    state("ac", "Active", "being pressed"),
    { build: [
      "Add a **style block** INSIDE the head, under the title",
      "Inside the style block, write a rule for each of your four link states, in order: link, visited, hover, active",
      "Use your colors from the boxes above",
      "Make the **hover** rule change TWO things: the text color AND the background color",
      "Remember: inside a style block you do NOT use quotes and you do NOT write the word style. Each rule is the name of what you are styling, curly braces, and property: value; inside"
    ] },

    { h: "Step 8: Style the rest of your page from the head" },
    { make: "Rules that style your headings, lists, and page background all at once, so you do not repeat styles on every tag." },
    { where: "Inside the same style block, under your four link states." },
    { build: [
      "Write a rule for **heading 1** that makes it look like a banner: a text color, a background color, a font family, a big font size, centered text, and a border",
      "Write a rule for **heading 2**: a text color, a font size, and uppercase letters",
      "Write a rule for the **bullet list** and a rule for the **numbered list**. Give each a different marker style (list-style-type)",
      "Write a rule for the **body**: a page background color and a font family for the body text",
      "Click **Checks** and fix anything red"
    ] },

    { h: "Step 9: Test your links like a real visitor" },
    { where: "In the preview on the right, and then here." },
    { id: "t1", q: "I hovered over each link and it changed.", t: "yn" },
    { id: "t2", q: "A new-tab link opened a new tab.", t: "yn" },
    { id: "t3", q: "A same-tab link replaced my page.", t: "yn" },
    { id: "t4", q: "Every link says something clear, not \"click here.\"", t: "yn" },

    { h: "Step 10: Reflect, then submit" },
    { id: "r1", q: "Why should a link to another website open in a new tab?", t: "area" },
    { id: "r2", q: "What happens if you put the hover rule before the visited rule?", t: "area" },
    { id: "r3", q: "Why is it better to style all your h2 headings with one rule in the head than to add a style attribute to every h2? When is the style attribute still a good choice?", t: "area" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Make sure the progress bar at the top of this tab is full",
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
  root.U7_WALK = W;
  root.U7_ANSWERS = A;
  root.U7_ANSWER_LEAVES = leaves;
})(typeof window !== "undefined" ? window : globalThis);
