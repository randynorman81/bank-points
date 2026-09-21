/* Typed answers for each lesson (the "Answers" tab in the Web Editor, and the answers view on the grading page).
   To add answers to another lesson, add an entry below. Item types:
     { h: "Heading text" }                           a heading
     { id, q, t: "text" | "area" | "yn" | "sel", opts: [...] }   one question (id: letters, numbers, underscore; 30 chars max)
     { grp: "Group title", fields: [ ...questions ] }             a card that groups related questions
*/
(function (root) {
  var TABS = ["New tab", "Same tab"], FAMS = ["serif", "sans-serif", "monospace"];
  function site(n, tab) {
    return { grp: "Website " + n, fields: [
      { id: "s" + n + "n", q: "Website name", t: "text" },
      { id: "s" + n + "a", q: "Full address (starts with https://)", t: "text" },
      { id: "s" + n + "w", q: "Link words (never \"click here\")", t: "text" },
      { id: "s" + n + "t", q: "New tab or same tab?", t: "sel", opts: TABS }
    ] };
  }
  function state(id, name, when) {
    return { grp: name + " (" + when + ")", fields: [
      { id: id + "c", q: "Text color", t: "text" },
      { id: id + "o", q: "Anything else? (background color, underline, etc.)", t: "text" }
    ] };
  }
  var A = {};
  A["7.6"] = [
    { h: "Step 1: Pick your topic" },
    { id: "topic", q: "Which topic did you choose?", t: "text" },
    { id: "hub", q: "What is the name of your hub? (This is your page title and big heading.)", t: "text" },
    { h: "Step 2: Find 6 real websites (3 new tab, 3 same tab)" },
    site(1), site(2), site(3), site(4), site(5), site(6),
    { h: "Step 3: Pick your colors and fonts" },
    { id: "col1", q: "First main color", t: "text" },
    { id: "col2", q: "Second main color", t: "text" },
    { id: "coln", q: "Neutral color", t: "text" },
    { id: "fh", q: "Font family for headings", t: "sel", opts: FAMS },
    { id: "fb", q: "Font family for body text", t: "sel", opts: FAMS },
    { id: "ff", q: "Font family for the footer", t: "sel", opts: FAMS },
    { h: "Your four link states (write them in this order: link, visited, hover, active)" },
    state("lk", "a:link", "nobody has clicked it yet"),
    state("vs", "a:visited", "already clicked"),
    state("hv", "a:hover", "mouse is on top"),
    state("ac", "a:active", "being pressed"),
    { h: "Step 6: Test your links like a user" },
    { id: "t1", q: "I hovered over each link and it changed.", t: "yn" },
    { id: "t2", q: "A new-tab link opened a new tab.", t: "yn" },
    { id: "t3", q: "A same-tab link replaced my page.", t: "yn" },
    { id: "t4", q: "Every link says something clear, not \"click here.\"", t: "yn" },
    { h: "Reflect (1-2 sentences each)" },
    { id: "r1", q: "Why should a link to another website open in a new tab?", t: "area" },
    { id: "r2", q: "What happens if you put a:hover before a:visited?", t: "area" },
    { id: "r3", q: "Why is it better to write h2 { color: navy; } in the head than to add style=\"color: navy;\" to every h2? When is the style attribute still a good choice?", t: "area" }
  ];

  function leaves(list) {
    var out = [];
    (list || []).forEach(function (it) {
      if (it.h) return;
      if (it.grp) it.fields.forEach(function (f) { out.push(f); }); else out.push(it);
    });
    return out;
  }
  /* Walkthrough (the checklist tab): short bullets with checkboxes. Backticks make code text. */
  var W = {};
  W["7.6"] = [
    { h: "1. Set up your page (the Setting up your page tab)", items: [
      { id: "a1", t: "Type your topic and your hub name" },
      { id: "a2", t: "Fill in all 6 Website cards: 3 that open in a **new tab**, 3 in the **same tab**" },
      { id: "a3", t: "Pick 2 main colors, 1 neutral color, and your fonts" },
      { id: "a4", t: "Fill in the 4 link-state cards in this order: link, visited, hover, active" }
    ] },
    { h: "2. Start index.html", items: [
      { id: "b1", t: "Change the `<title>` to your hub name" },
      { id: "b2", t: "Add an `<h1>` with your hub name" },
      { id: "b3", t: "Add a `<p>` tagline with an `<em>` phrase" },
      { id: "b4", t: "Put a `<span style=\"color: tomato;\">` around one word in the tagline" },
      { id: "b5", t: "Add a `<br>` inside the tagline" },
      { id: "b6", t: "Add an `<hr>` under it" }
    ] },
    { h: "3. Section 1: links that open in a NEW tab", items: [
      { id: "c1", t: "Add an `<h2>` and an `<h3>`" },
      { id: "c2", t: "Add a `<ul>` with 3 `<li>` items" },
      { id: "c3", t: "Make each item a link: `<a href=\"https://...\" target=\"_blank\">`" },
      { id: "c4", t: "Put the site name in `<strong>` and a short note in `<em>`" }
    ] },
    { h: "4. Section 2: links that open in the SAME tab", items: [
      { id: "d1", t: "Add a second `<hr>`, then an `<h2>` and an `<h3>`" },
      { id: "d2", t: "Add an `<ol>` with 3 `<li>` items" },
      { id: "d3", t: "Make each item a link with an `https://` address and **no** target" }
    ] },
    { h: "5. The footer", items: [
      { id: "e1", t: "Add a `<p>` with 2 lines separated by a `<br>` (your name and period)" },
      { id: "e2", t: "Give it `style=\"text-align: center; font-family: monospace; font-size: 14px;\"`" }
    ] },
    { h: "6. The style block (put it in the `<head>`, under the `<title>`)", items: [
      { id: "f1", t: "Add a `<style>` tag in the head" },
      { id: "f2", t: "Write `a:link`, `a:visited`, `a:hover`, `a:active` in that order" },
      { id: "f3", t: "Make `a:hover` change 2 things (text color **and** background color)" },
      { id: "f4", t: "Add rules for `h1` and `h2` (color, font-size, text-align, font-family, a border)" },
      { id: "f5", t: "Add `ul` and `ol` rules with `list-style-type`" },
      { id: "f6", t: "Add a `body` rule with a `background-color` and a `font-family`" }
    ] },
    { h: "7. Test and turn in", items: [
      { id: "g1", t: "Click **Checks** and fix anything red until it says 50 / 50" },
      { id: "g2", t: "Hover over every link. Click one new-tab link and one same-tab link" },
      { id: "g3", t: "Finish the Reflect questions in Setting up your page" },
      { id: "g4", t: "Choose your period at the top, then click **Submit**" }
    ] }
  ];
  root.U7_WALK = W;
  root.U7_ANSWERS = A;
  root.U7_ANSWER_LEAVES = leaves;
})(typeof window !== "undefined" ? window : globalThis);
