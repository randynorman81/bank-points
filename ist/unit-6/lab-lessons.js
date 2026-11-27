/* IST Unit 3 (Web Design 1): the WALKTHROUGH and ASSIGNMENT for each lesson, added next to the original lessons without changing them.
   Ids: "6.1w" = walkthrough for lesson 6.1 (3.1), "6.1a" = assignment for 3.1, and so on (the original "6.1" assignment is untouched).
   They sit in ORDER right after their lesson, have no rubric of their own ("own": true: only Problems + the step checks count), and stay closed to students until listed in live.js.
   Loaded after html-check.js (editor, grade page and server). */
(function (root) {
  var H = root.HTMLCheck; if (!H) return;
  var NAMES = {
    "6.1": "Intro to HTML and the Skeleton", "6.2": "The Style Attribute and Colors", "6.20": "Text Size, Alignment, Case", "6.3": "Editing Tags (strong, em, br, hr, span)", "6.35": "Google Fonts",
    "6.4": "Borders", "6.7": "Images and the Favicon", "6.75": "Emojis and Symbols", "6.6": "Links", "6.5": "Lists and Menus",
    "7.1": "Box Model", "7.2": "Colors (Names and Hex)", "7.3": "Display (Block vs Inline)", "7.4": "Div Tag", "7.5": "Tables"
  };
  var DISP = { "6.1": "3.1", "6.2": "3.2", "6.20": "3.3", "6.3": "3.4", "6.35": "3.5", "6.4": "3.6", "6.7": "3.7", "6.75": "3.8", "6.6": "3.9", "6.5": "3.10", "7.1": "4.1 Adv. HTML", "7.2": "4.2 Adv. HTML", "7.3": "4.3 Adv. HTML", "7.4": "4.4 Adv. HTML", "7.5": "4.5 Adv. HTML" };
  root.U7_LAB_DISPLAY = {};
  Object.keys(NAMES).forEach(function (base) {
    ["w", "a"].forEach(function (s) { var i = H.ORDER.indexOf(base + s); if (i >= 0) H.ORDER.splice(i, 1); });
    var at = H.ORDER.indexOf(base); if (at < 0) return;
    H.ORDER.splice(at + 1, 0, base + "w", base + "a");   /* order: the lesson, its walkthrough, its assignment */
    [["w", "Walkthrough"], ["a", "Assignment"]].forEach(function (k) {
      H.LESSONS[base + k[0]] = { name: NAMES[base] + " (" + k[1] + ")", rules: [], own: true, lab: base };
      root.U7_LAB_DISPLAY[base + k[0]] = DISP[base] + " " + k[1];
    });
  });
  root.U7_LAB_IDS = []; Object.keys(NAMES).forEach(function (b) { root.U7_LAB_IDS.push(b + "w", b + "a"); });
})(typeof window !== "undefined" ? window : globalThis);
