/* Shared helpers and the "Minimums" reminder (the steps for 6.2 and later live in answers-v2.js).
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

  /* Every lesson (6.1 to 9.7) opens with the same reminder that the steps are minimums and name the exact tag. */
  var NOTE = { p: "**Minimums, not limits.** Every step below says the least you must add and exactly which tag it goes on. You can **ALWAYS add more**, but you need at least what is listed, in the place it says." };
  Object.keys(A).forEach(function (k) {
    var list = A[k], i = -1;
    for (var n = 0; n < list.length; n++) { if (list[n].p) { i = n; break; } }
    if (i > -1) list.splice(i + 1, 0, NOTE);
  });
})(typeof window !== "undefined" ? window : globalThis);
