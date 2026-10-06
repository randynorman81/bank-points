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
