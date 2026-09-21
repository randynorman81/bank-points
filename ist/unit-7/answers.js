/* Setting up your page (the first tab in the Web Editor) and the Walkthrough checklist (the second tab).
   Each lesson entry is an ordered list of blocks. Block types:
     { h: "Heading" }                         a step heading
     { p: "Paragraph text" }                  plain text
     { make: "text" }                         "You are creating" callout (blue)
     { where: "text" }                        "Where it goes" callout (amber)
     { build: ["bullet", ...] }               "Now build it in index.html" bullets
     { code: "code shown as a pattern" }      a code pattern (students type it, not paste it)
     { map: ["line", ...] }                   a picture of the page from top to bottom
     { id, q, t: "text" | "area" | "yn" | "sel", opts: [...] }   one question the student types or picks
     { grp: "Group title", fields: [ ...questions ] }             a card that groups related questions
   Text supports `code` and **bold**. Question ids: letters, numbers, underscore (30 max).
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
      "<head>  the page title and your style block (Steps 1 and 7)",
      "<h1>  your hub's name (Step 1)",
      "<p>  a tagline with italic words and a colored word (Step 2)",
      "<hr>  a divider line (Step 2)",
      "<h2> + <h3> + <ul>  3 links that open in a NEW tab (Step 3)",
      "<hr>  a divider line (Step 4)",
      "<h2> + <h3> + <ol>  3 links that open in the SAME tab (Step 4)",
      "<p>  a small footer with your name and period (Step 5)"
    ] },
    { p: "**How to use the tabs, left to right:**" },
    { build: [
      "**Setting up your page** (this tab): read each step, type your plan in the boxes, then follow the \"Now build it\" bullets.",
      "**Walkthrough**: a checklist. Check off each item as you finish it.",
      "**index.html**: where you type your page's code. The preview on the right updates as you go."
    ] },
    { p: "**Your page must have:** an `h1`, `h2`, `h3`, `p`, `strong`, `em`, `br`, `hr`, a `ul` and an `ol` (3 `li` each), a `span` with a style attribute, 2 or more font families, a border, and a style block in the head. The **Checks** button shows your score out of 50. Aim for 50/50." },

    { h: "Step 1: Name your hub" },
    { make: "The **name** of your hub, used in two places." },
    { where: "In the `<title>` in the head (it shows on the browser tab), and in an `<h1>` at the very top of the body." },
    { id: "topic", q: "What is your topic? (Freshman Survival Kit, The Gamer's Hub, Future Me, Creator Toolkit, Rainy Day Hub, or your own idea)", t: "text" },
    { id: "hub", q: "What is the name of your hub?", t: "text" },
    { build: [
      "Change the `<title>` to your hub's name",
      "Inside `<body>`, type `<h1>` with your hub's name, then `</h1>`"
    ] },

    { h: "Step 2: Write your tagline" },
    { make: "A short, catchy sentence that says what your hub is for." },
    { where: "In a `<p>` right under your `<h1>`. Then put an `<hr>` (a divider line) under the paragraph." },
    { id: "tag", q: "Your tagline (one or two short lines)", t: "text" },
    { id: "tagem", q: "Which words will be in italics? (they go inside `<em>`)", t: "text" },
    { id: "tagsp", q: "Which one word will be a different color? (it goes inside a `<span>`)", t: "text" },
    { id: "tagcol", q: "What color will that word be?", t: "text" },
    { build: [
      "Type a `<p>` under the `<h1>` and write your tagline in it",
      "Wrap your italic words: `<em>words</em>`",
      "Wrap your colored word: `<span style=\"color: tomato;\">word</span>` (change tomato to your color)",
      "Add a `<br>` inside the paragraph to start a new line",
      "Under the paragraph, add `<hr>`"
    ] },

    { h: "Step 3: List 3 websites that open in a NEW tab" },
    { make: "Three links to real websites. These links leave your page, so they open in a **new tab** and your hub stays open." },
    { where: "Below your first divider line. Start with an `<h2>` (like \"Open These in a New Tab\") and an `<h3>` (a short label). Then add a `<ul>` (bullet list) with 3 `<li>` items. Each `<li>` is one link." },
    site(1, "New-tab website 1"), site(2, "New-tab website 2"), site(3, "New-tab website 3"),
    { code: "<li><a href=\"https://www.example.com\" target=\"_blank\"><strong>Site Name</strong></a> - <em>short note</em></li>" },
    { build: [
      "Add your `<h2>` and `<h3>` under the first `<hr>`",
      "Add `<ul>` and 3 `<li>` items, then `</ul>`",
      "In each `<li>`, follow the pattern above with YOUR website's address, name, and note",
      "The `target=\"_blank\"` part is what opens it in a new tab"
    ] },

    { h: "Step 4: List 3 websites that open in the SAME tab" },
    { make: "Three more links. These replace your page in the current tab, which is what links do by default." },
    { where: "Below the new-tab list. Add a second `<hr>`, then a new `<h2>` (like \"Open These Right Here\"), an `<h3>`, and an `<ol>` (numbered list) with 3 `<li>` items." },
    site(4, "Same-tab website 1"), site(5, "Same-tab website 2"), site(6, "Same-tab website 3"),
    { code: "<li><a href=\"https://www.example.com\">Site Name</a> - <em>short note</em></li>" },
    { build: [
      "Add another `<hr>`, then your second `<h2>` and `<h3>`",
      "Add `<ol>` and 3 `<li>` items, then `</ol>`",
      "Follow the pattern above. This time do **not** add `target`"
    ] },

    { h: "Step 5: Write your footer" },
    { make: "A small footer with your name and class period, on two lines." },
    { where: "In a `<p>` at the very bottom of the body, below the numbered list. Give it its own style attribute so it looks different from the rest." },
    { id: "fn", q: "Your name (line 1 of the footer)", t: "text" },
    { id: "fp", q: "Your class period and class (line 2 of the footer)", t: "text" },
    { code: "<p style=\"text-align: center; font-family: monospace; font-size: 14px;\">Line 1<br>Line 2</p>" },
    { build: [
      "Type the `<p>` with `style=\"...\"` in the opening tag",
      "Put your two lines inside with a `<br>` between them"
    ] },

    { h: "Step 6: Pick your colors and fonts" },
    { make: "A plan for how your page will look, so it feels designed instead of random." },
    { where: "You will use these choices in the style block in Steps 7 and 8. Use your two main colors over and over so the page feels matched." },
    { id: "col1", q: "First main color", t: "text" },
    { id: "col2", q: "Second main color", t: "text" },
    { id: "coln", q: "Neutral color (white, black, gray, tan...)", t: "text" },
    { id: "fh", q: "Font family for headings", t: "sel", opts: FAMS },
    { id: "fb", q: "Font family for body text", t: "sel", opts: FAMS },
    { p: "You must use at least 2 different font families. Your footer already uses `monospace`." },

    { h: "Step 7: Design your link states and start the style block" },
    { make: "The look of your links in four moments: before anyone clicks, after a visit, when the mouse is on it, and while it is pressed." },
    { where: "In a `<style>` block in the **head**, right under your `<title>`. Write the four states in this exact order: **link, visited, hover, active** (LoVe HAte)." },
    state("lk", "a:link", "nobody has clicked it yet"),
    state("vs", "a:visited", "already clicked"),
    state("hv", "a:hover", "mouse is on top. Change 2 things!"),
    state("ac", "a:active", "being pressed"),
    { code: "<style>\n  a:link { color: navy; }\n  a:visited { color: purple; }\n  a:hover { color: white; background-color: hotpink; }\n  a:active { color: red; }\n</style>" },
    { build: [
      "Add `<style>` and `</style>` in the head, under the `<title>`",
      "Type your four link-state rules in order, using your colors from above",
      "Remember: inside a style block there are **no quotes and no `style=`**, just `property: value;`"
    ] },

    { h: "Step 8: Style the rest of your page from the head" },
    { make: "Rules that style your headings, lists, and page background all at once." },
    { where: "Inside the same `<style>` block, under your four link states." },
    { code: "h1 { color: white; background-color: navy; font-family: serif; font-size: 40px; text-align: center; border-bottom: 4px double gold; }\nh2 { color: navy; font-size: 28px; text-transform: uppercase; }\nul { list-style-type: square; }\nol { list-style-type: upper-roman; }\nbody { background-color: lightyellow; font-family: sans-serif; }" },
    { build: [
      "Type an `h1` rule and an `h2` rule with your colors and fonts",
      "Add `ul` and `ol` rules with a `list-style-type`",
      "Add a `body` rule with a `background-color` and a `font-family`",
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
    { id: "r2", q: "What happens if you put a:hover before a:visited?", t: "area" },
    { id: "r3", q: "Why is it better to write h2 { color: navy; } in the head than to add style=\"color: navy;\" to every h2? When is the style attribute still a good choice?", t: "area" },
    { build: [
      "Make sure **Checks** shows 50 / 50",
      "Make sure the progress bar at the top of this tab is full",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

  /* Walkthrough: only a checklist. The instructions live in Setting up your page. */
  W["7.6"] = [
    { h: "Step 1: Name your hub", items: [
      { id: "a1", t: "Type your topic and hub name (Setting up your page)" },
      { id: "a2", t: "Change the `<title>`" },
      { id: "a3", t: "Add the `<h1>`" }
    ] },
    { h: "Step 2: Tagline", items: [
      { id: "b1", t: "Fill in your tagline plan" },
      { id: "b2", t: "Add the `<p>` under the `<h1>`" },
      { id: "b3", t: "Add an `<em>` phrase" },
      { id: "b4", t: "Add a `<span style=\"color: ...;\">` word" },
      { id: "b5", t: "Add a `<br>` in the paragraph" },
      { id: "b6", t: "Add the first `<hr>`" }
    ] },
    { h: "Step 3: 3 new-tab links", items: [
      { id: "c1", t: "Fill in the 3 website cards" },
      { id: "c2", t: "Add the `<h2>` and `<h3>`" },
      { id: "c3", t: "Add the `<ul>` with 3 `<li>` links using `target=\"_blank\"`" },
      { id: "c4", t: "Use `<strong>` and `<em>` in each item" }
    ] },
    { h: "Step 4: 3 same-tab links", items: [
      { id: "d1", t: "Fill in the 3 website cards" },
      { id: "d2", t: "Add the second `<hr>`, `<h2>`, and `<h3>`" },
      { id: "d3", t: "Add the `<ol>` with 3 `<li>` links (no `target`)" }
    ] },
    { h: "Step 5: Footer", items: [
      { id: "e1", t: "Fill in your footer lines" },
      { id: "e2", t: "Add the footer `<p>` with a `<br>` and a `style` attribute" }
    ] },
    { h: "Step 6: Colors and fonts", items: [
      { id: "f1", t: "Pick your colors and font families" }
    ] },
    { h: "Step 7: Link states and style block", items: [
      { id: "g1", t: "Fill in the 4 link-state cards" },
      { id: "g2", t: "Add `<style>` in the `<head>`" },
      { id: "g3", t: "Write `a:link`, `a:visited`, `a:hover`, `a:active` in that order" },
      { id: "g4", t: "Make `a:hover` change 2 things" }
    ] },
    { h: "Step 8: Style the rest", items: [
      { id: "h1", t: "Add `h1` and `h2` rules" },
      { id: "h2", t: "Add `ul` and `ol` rules with `list-style-type`" },
      { id: "h3", t: "Add a `body` rule" },
      { id: "h4", t: "Click **Checks** and fix anything red" }
    ] },
    { h: "Step 9: Test", items: [
      { id: "i1", t: "Hover over every link" },
      { id: "i2", t: "Click one new-tab link and one same-tab link" },
      { id: "i3", t: "Answer the four test questions" }
    ] },
    { h: "Step 10: Reflect and submit", items: [
      { id: "j1", t: "Answer the 3 reflection questions" },
      { id: "j2", t: "Checks shows 50 / 50" },
      { id: "j3", t: "Choose your period and click **Submit**" }
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
