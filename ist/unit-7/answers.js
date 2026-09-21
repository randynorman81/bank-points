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
  root.U7_ANSWERS = A;
  root.U7_ANSWER_LEAVES = leaves;
})(typeof window !== "undefined" ? window : globalThis);
