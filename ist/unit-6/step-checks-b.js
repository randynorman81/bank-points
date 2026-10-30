/* Step checks for the Unit 3 lessons after 3.1:  6.2 (3.2), 6.20 (3.3), 6.3 (3.4), 6.4 (3.5), 6.5 (3.6), 6.6 (3.7), 6.7 (3.8).
   (see step-checks.js for how these are used). One list of checks per step bullet, in the same order as the bullets in answers-u3.js. */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H;
  var K = h.K, P = h.P, PX = h.PX, IN = h.IN, UNDER = h.UNDER, T = h.T, HW = h.HW, LAST = h.LAST, AFTER = h.AFTER, FOLLOW = h.FOLLOW, exists = h.exists, CNT = h.CNT;
  var SK = h.SKELETON, TITLE = h.TITLE, has = h.has, kids = h.kids, txt = h.txt, words = h.words, within = h.within, BOLD = h.BOLD, ITAL = h.ITAL;
  var named = h.isNamed, center = h.eq("center"), upper = h.eq("uppercase");

  /* ---------- shapes used over and over ---------- */
  function bodyBg(label) { return P(label || "The body has a background-color (a named color or hex code)", T("body"), "background-color", named); }
  function afterEl(pick, tag) { return AFTER(pick, tag); }
  function hrAfter(label, pick) { return K(label, function (c) { var e = pick(c), n = h.nextEl(e); return !!n && n.tag === "hr"; }); }
  function onlySide(side) { return function (c, el) { return has(c, el, "border-" + side) && !has(c, el, "border"); }; }
  function listItems(pick, n) { return K("The list has " + n + " list items", function (c) { var l = pick(c); return !!l && kids(l).filter(function (k) { return k.tag === "li"; }).length >= n; }); }
  function eachLi(label, pick, n, test) { return K(label, function (c) { var l = pick(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= n && li.slice(0, n).every(function (x) { return test(c, x); }); }); }
  var boldItalicItems = function (pick, n) { return eachLi("Each item has a bold name and an italic description", pick, n, function (c, li) { return within(li, BOLD).length >= 1 && within(li, ITAL).length >= 1; }); };
  var lastP = LAST("p");
  function bothDiffer(c, el) { var a = h.vals(c, el, "color")[0], b = h.vals(c, el, "background-color")[0]; return !!a && !!b && a !== b; }
  function lastStep(l, st, list) { list.comment = false; SC.LESSONS[l].steps[st] = list; }

  /* BONUS (3.2): 3 words on the page colored with span tags: a whole word in one span, or a word built from single-letter spans.
     (the editor drops spaces between tags, so single letters are counted 3 to a word.) +5 points */
  function spanWords(c) {
    var whole = 0, letters = 0;
    h.order(c).forEach(function (k) {
      if (k.tag !== "span" || !has(c, k, "color", named) && !has(c, k, "background-color", named)) return;
      var t = txt(c, k);
      if (/^[A-Za-z]$/.test(t)) letters++; else if (/^[A-Za-z']{3,}$/.test(t)) whole++;
    });
    return whole + (letters >= 3 ? 3 : 0);   /* one rainbow word (3+ single-letter spans) earns the whole bonus */
  }
  var RAINBOW = [["BONUS: 3 words colored with span tags (a whole word in one span each), or one rainbow word (each letter in its own span)", function (c) { return spanWords(c) >= 3; }]];
  RAINBOW.bonus = 5;

  /* =============== 6.2  (3.2) The "Style" Attribute + Color: the ugliest website you can make =============== */
  var h2all = function (c) { return c.all("h2"); };
  var both = function (c, x) { return has(c, x, "color", named) && has(c, x, "background-color", named) && bothDiffer(c, x); };
  SC.LESSONS["6.2"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE],
    "Step 2": [[K("There is one heading 1", function (c) { return c.count("h1") === 1; }), CNT("There are at least 3 heading 2s", "h2", 3), CNT("There are at least 6 paragraphs", "p", 6)]],
    "Step 3": [
      [bodyBg("The body has a background-color (a named color or hex code)"), P("The body has a text color (a named color or hex code)", T("body"), "color", named), K("The text color is different from the background-color", function (c) { var b = T("body")(c); return !!b && bothDiffer(c, b); })],
      []
    ],
    "Step 4": [
      [exists("There is a heading 1", T("h1")), K("The heading 1 has a color and a background-color", function (c) { var e = T("h1")(c); return !!e && has(c, e, "color", named) && has(c, e, "background-color", named); }), K("Its two colors are different", function (c) { var e = T("h1")(c); return !!e && bothDiffer(c, e); })],
      [CNT("There are at least 3 heading 2s", "h2", 3), K("Every heading 2 has a color and a background-color", function (c) { var a = h2all(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "color", named) && has(c, x, "background-color", named); }); }),
       K("On every heading 2 the two colors are different", function (c) { var a = h2all(c); return a.length >= 3 && a.every(function (x) { return bothDiffer(c, x); }); }),
       K("Pattern: at least 2 heading 2s use exactly the same text color and background-color", function (c) { var n = {}; h2all(c).forEach(function (x) { var k = h.vals(c, x, "color")[0] + "|" + h.vals(c, x, "background-color")[0]; n[k] = (n[k] || 0) + 1; }); return Object.keys(n).some(function (k) { return n[k] >= 2; }); })]
    ],
    "Step 5": [
      [CNT("There are at least 6 paragraphs", "p", 6), K("Every paragraph has a color and a background-color", function (c) { var a = c.all("p"); return a.length >= 6 && a.every(function (x) { return has(c, x, "color", named) && has(c, x, "background-color", named); }); }),
       K("On every paragraph the text color is different from its own background-color", function (c) { var a = c.all("p"); return a.length >= 6 && a.every(function (x) { return bothDiffer(c, x); }); }),
       K("No two paragraphs share a background-color (every paragraph has its own)", function (c) { var a = c.all("p").filter(function (x) { return h.vals(c, x, "color")[0] || h.vals(c, x, "background-color")[0]; }), seen = {}; return a.length >= 6 && a.every(function (x) { var v = h.vals(c, x, "background-color")[0]; if (!v || seen[v]) return false; seen[v] = 1; return true; }); }),
       K("No two paragraphs share a text color (every paragraph has its own)", function (c) { var a = c.all("p").filter(function (x) { return h.vals(c, x, "color")[0] || h.vals(c, x, "background-color")[0]; }), seen = {}; return a.length >= 6 && a.every(function (x) { var v = h.vals(c, x, "color")[0]; if (!v || seen[v]) return false; seen[v] = 1; return true; }); })],
      [K("Nothing is hidden: wherever color and background-color are both used, they are different colors", function (c) { var seen = false, ok = true; h.order(c).forEach(function (x) { if (has(c, x, "color") && has(c, x, "background-color")) { seen = true; if (!bothDiffer(c, x)) ok = false; } }); return seen && ok; })],
      [],
      RAINBOW
    ]
  } };
  lastStep("6.2", "Step 6", [[h.ALLGREEN], []]);


  /* BONUS (3.3): extra credit with the span tag (+5 each, automatic) */
  var SPAN2 = [["BONUS: at least 2 span tags, each with its own style (like a different color, size, or letter case on a few words)", function (c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style) && txt(c, k).length > 0; }).length >= 2; }]]; SPAN2.bonus = 5;
  var SPANH1 = [["BONUS: a span inside the heading 1 gives part of the title its own color AND its own font-size in px", function (c) { var hh = T("h1")(c); return !!hh && within(hh, ["span"]).some(function (k) { return has(c, k, "color", named) && has(c, k, "font-size", h.isPx); }); }]]; SPANH1.bonus = 5;

  /* =============== 6.20  (3.3) Font-Size, Text-Alignment, Letter-Case: the epic poster =============== */
  var H1 = T("h1"), H2a = T("h2", 0);
  var whenH = HW("h3", /when/i), whereH = HW("h3", /where/i), ticketsH = HW("h3", /tradition/i); var contactH = HW("h2", /contact/i), funP = function (c) { var t = pUnder(ticketsH)(c), n = h.nextEl(t); return n && n.tag === "p" ? n : null; };
  function pUnder(pick) { return AFTER(pick, "p"); }
  SC.LESSONS["6.20"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg()]],
    "Step 2": [
      [exists("There is a heading 1", H1), P("It has a color (a named color or hex code)", H1, "color", named), P("Its font-size is in pixels", H1, "font-size", h.isPx), P("It is text-align center", H1, "text-align", center), P("It is text-transform uppercase", H1, "text-transform", upper)],
      [exists("There is a heading 2 for the tagline", H2a), UNDER("It comes after the heading 1", H1, H2a), P("It has a color (a named color or hex code)", H2a, "color", named),
       P("It is text-transform uppercase", H2a, "text-transform", upper), P("It is text-align center", H2a, "text-align", center), P("Its font-size is 24px", H2a, "font-size", h.px(24))]
    ],
    "Step 3": [
      [exists("There is a heading 3 that says When", whenH), P("The When heading has a color", whenH, "color", named), exists("A paragraph is under it", pUnder(whenH)),
       P("The paragraph has a color", pUnder(whenH), "color", named), P("Its font-size is 20px", pUnder(whenH), "font-size", h.px(20)), P("It has a background-color", pUnder(whenH), "background-color", named)],
      [exists("There is a heading 3 that says Where", whereH), P("The Where heading has a color", whereH, "color", named), exists("A paragraph is under it", pUnder(whereH)),
       P("The paragraph has a color", pUnder(whereH), "color", named), P("Its font-size is 20px", pUnder(whereH), "font-size", h.px(20))]
    ],
    "Step 4": [
      [exists("There is a third heading 3 that says Traditions", ticketsH), K("It is the third heading 3 on the page (after When and Where)", function (c) { return c.all("h3").indexOf(ticketsH(c)) === 2; }), P("It has a color", ticketsH, "color", named), P("It is text-transform uppercase", ticketsH, "text-transform", upper), P("It is text-align center", ticketsH, "text-align", center)],
      [exists("A paragraph is under the Traditions heading", pUnder(ticketsH)), P("It has a color", pUnder(ticketsH), "color", named), P("Its font-size is 20px", pUnder(ticketsH), "font-size", h.px(20)),
       P("It is text-align center", pUnder(ticketsH), "text-align", center), P("It has a background-color", pUnder(ticketsH), "background-color", named)],
      [exists("There is a paragraph after the traditions paragraph (the fun fact or warning)", funP), P("It has a color", funP, "color", named), P("Its font-size is 16px", funP, "font-size", h.px(16)), P("It is text-align center", funP, "text-align", center)],
      [exists("There is a second heading 2 that says Contact Information", contactH), K("It is the last heading on the page", function (c) { var hs = c.all("h1").concat(c.all("h2"), c.all("h3")); return hs.length > 0 && hs.every(function (x) { return x === contactH(c) || h.before(c, x, contactH(c)); }); }), P("It has a color", contactH, "color", named), P("It is text-align center", contactH, "text-align", center)],
      [exists("A paragraph is under the Contact Information heading", pUnder(contactH)), K("It has at least 4 words of contact info", function (c) { var p = pUnder(contactH)(c); return !!p && h.words(c, p) >= 4; }), P("It has a color", pUnder(contactH), "color", named), P("It is text-align center", pUnder(contactH), "text-align", center)],
      SPAN2,
      SPANH1
    ]
  } };
  lastStep("6.20", "Step 5", [[h.ALLGREEN], []]);

  /* =============== 6.21 and 6.22 (3.3 Part 2 and Part 3): extra practice with font-size, text-align, and letter-case on brand-new pages =============== */
  var lower = h.eq("lowercase"), capital = h.eq("capitalize");
  function pxNum(c, el) { var v = h.vals(c, el, "font-size")[0]; var m = /^(\d+(?:\.\d+)?)px$/i.exec(String(v || "").replace(/;$/, "").trim()); return m ? +m[1] : null; }
  function everyHas(label, tag, prop, test, min) { return K(label, function (c) { var a = c.all(tag); return a.length >= (min || 1) && a.every(function (x) { return has(c, x, prop, test); }); }); }
  function countWith(c, prop, test) { return h.order(c).filter(function (x) { return x.tag !== "#text" && has(c, x, prop, test); }).length; }
  function bothColorsAndDiffer(c, x) { return has(c, x, "color", named) && has(c, x, "background-color", named) && bothDiffer(c, x); }
  var bodyTwoColors = [bodyBg(), P("The body has a color (a named color or hex code)", T("body"), "color", named), K("The text color is different from the background-color", function (c) { var b = T("body")(c); return !!b && bothDiffer(c, b); })];

  /* ---- 6.21: a movie or game review ---- */
  var tag6 = function (c) { return c.all("h2")[0] || null; }, sections6 = function (c) { return c.all("h2").slice(1); };
  SC.LESSONS["6.21"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, bodyTwoColors],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a color (a named color or hex code)", T("h1"), "color", named), K("Its font-size is in pixels and is 36px or bigger", function (c) { var e = T("h1")(c); var n = e ? pxNum(c, e) : null; return n !== null && n >= 36; }), P("It is text-align center", T("h1"), "text-align", center), P("It is text-transform uppercase", T("h1"), "text-transform", upper)],
      [exists("There is a heading 2 for the tagline", tag6), UNDER("It comes after the heading 1", T("h1"), tag6), P("It has a color (a named color or hex code)", tag6, "color", named), P("Its font-size is in pixels", tag6, "font-size", h.isPx), P("It is text-align center", tag6, "text-align", center), P("It is text-transform capitalize", tag6, "text-transform", capital)]
    ],
    "Step 3": [
      [K("There are at least 3 more heading 2s after the tagline (the review sections)", function (c) { return sections6(c).length >= 3; }),
       K("Every section heading has a color (a named color or hex code)", function (c) { var a = sections6(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "color", named); }); }),
       K("Every section heading has a font-size in pixels", function (c) { var a = sections6(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "font-size", h.isPx); }); }),
       K("Every section heading is text-transform uppercase", function (c) { var a = sections6(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "text-transform", upper); }); }),
       K("Every section heading is text-align center", function (c) { var a = sections6(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "text-align", center); }); })]
    ],
    "Step 4": [
      [CNT("There are at least 6 paragraphs", "p", 6), everyHas("Every paragraph has a color (a named color or hex code)", "p", "color", named, 6), everyHas("Every paragraph has a font-size in pixels", "p", "font-size", h.isPx, 6)],
      [K("At least 3 paragraphs are text-align center", function (c) { return c.all("p").filter(function (x) { return has(c, x, "text-align", center); }).length >= 3; })],
      [K("At least 2 paragraphs have both a color and a background-color, and the two colors are different", function (c) { return c.all("p").filter(function (x) { return bothColorsAndDiffer(c, x); }).length >= 2; })]
    ],
    "Step 5": [
      [K("There are at least 2 heading 3s", function (c) { return c.count("h3") >= 2; }), everyHas("Every heading 3 has a color (a named color or hex code)", "h3", "color", named, 2), everyHas("Every heading 3 is text-align center", "h3", "text-align", center, 2),
       K("At least one heading 3 is text-transform lowercase", function (c) { return c.all("h3").some(function (x) { return has(c, x, "text-transform", lower); }); })],
      [K("A paragraph comes right after at least 2 of the heading 3s", function (c) { return c.all("h3").filter(function (x) { var n = h.nextEl(x); return !!n && n.tag === "p"; }).length >= 2; }),
       K("Every paragraph right after a heading 3 has a color and a font-size in pixels", function (c) { var a = c.all("h3").map(function (x) { return h.nextEl(x); }).filter(function (n) { return !!n && n.tag === "p"; }); return a.length >= 2 && a.every(function (p) { return has(c, p, "color", named) && has(c, p, "font-size", h.isPx); }); })]
    ]
  } };
  lastStep("6.21", "Step 6", [[h.ALLGREEN], []]);

  /* ---- 6.22: a band or artist profile with a size staircase ---- */
  var h1px = function (c) { var e = T("h1")(c); return e ? pxNum(c, e) : null; };
  SC.LESSONS["6.22"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, bodyTwoColors],
    "Step 2": [
      [K("There is one heading 1", function (c) { return c.count("h1") === 1; }), P("It has a color (a named color or hex code)", T("h1"), "color", named), K("Its font-size is in pixels and is 40px or bigger", function (c) { var n = h1px(c); return n !== null && n >= 40; }), P("It is text-align center", T("h1"), "text-align", center), P("It is text-transform uppercase", T("h1"), "text-transform", upper)],
      [CNT("There are at least 3 heading 2s", "h2", 3), everyHas("Every heading 2 has a color (a named color or hex code)", "h2", "color", named, 3), everyHas("Every heading 2 has a font-size in pixels", "h2", "font-size", h.isPx, 3), everyHas("Every heading 2 is text-transform capitalize", "h2", "text-transform", capital, 3)],
      [CNT("There are at least 2 heading 3s", "h3", 2), everyHas("Every heading 3 has a color (a named color or hex code)", "h3", "color", named, 2), everyHas("Every heading 3 has a font-size in pixels", "h3", "font-size", h.isPx, 2)],
      [K("The heading 1's font-size is bigger than every heading 2's", function (c) { var n = h1px(c), a = c.all("h2").map(function (x) { return pxNum(c, x); }); return n !== null && a.length >= 3 && a.every(function (v) { return v !== null && n > v; }); }),
       K("Every heading 2's font-size is bigger than every heading 3's", function (c) { var a = c.all("h2").map(function (x) { return pxNum(c, x); }), b = c.all("h3").map(function (x) { return pxNum(c, x); }); return a.length >= 3 && b.length >= 2 && a.concat(b).every(function (v) { return v !== null; }) && Math.min.apply(null, a) > Math.max.apply(null, b); })]
    ],
    "Step 3": [
      [CNT("There are at least 8 paragraphs", "p", 8), everyHas("Every paragraph has a font-size in pixels", "p", "font-size", h.isPx, 8), everyHas("Every paragraph has a color (a named color or hex code)", "p", "color", named, 8)],
      [K("At least 4 paragraphs are text-align center", function (c) { return c.all("p").filter(function (x) { return has(c, x, "text-align", center); }).length >= 4; })],
      [K("text-transform uppercase is used on at least 3 elements", function (c) { return countWith(c, "text-transform", upper) >= 3; }), K("text-transform lowercase is used on at least 1 element", function (c) { return countWith(c, "text-transform", lower) >= 1; }), K("text-transform capitalize is used on at least 1 element", function (c) { return countWith(c, "text-transform", capital) >= 1; })]
    ],
    "Step 4": [
      [K("At least 3 elements have both a color and a background-color, and the two colors are different", function (c) { return h.order(c).filter(function (x) { return x.tag !== "#text" && bothColorsAndDiffer(c, x); }).length >= 3; })],
      [K("At least 3 different font-sizes (in pixels) show up on the page", function (c) { var s = {}; h.order(c).forEach(function (x) { if (x.tag === "#text") return; var n = pxNum(c, x); if (n !== null) s[n] = 1; }); return Object.keys(s).length >= 3; })]
    ]
  } };
  lastStep("6.22", "Step 5", [[h.ALLGREEN], []]);

  /* =============== 6.3  (3.4) Editing Tags, Span Tag: a text-heavy page of the student's own theme (20 ideas), built from minimum counts =============== */
  function allEls(c) { return h.order(c).filter(function (x) { return x.tag !== "#text"; }); }
  function distinctColors(c) { var n = {}; allEls(c).forEach(function (x) { ["color", "background-color"].forEach(function (p) { var v = h.vals(c, x, p)[0]; if (v && named(v)) n[v] = 1; }); }); return Object.keys(n); }
  function propCount(c, el) { var n = {}; c.inline.forEach(function (d) { if (d.el === el) n[d.prop] = 1; }); return Object.keys(n).length; }
  function anyVal(c, prop, test) { return allEls(c).some(function (x) { return h.vals(c, x, prop).some(test); }); }
  SC.LESSONS["6.3"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)"), P("The body has a color (a named color or hex code)", T("body"), "color", named)]],
    "Step 2": [
      [K("There is a heading 1", function (c) { return c.count("h1") >= 1; }), K("There is a heading 2", function (c) { return c.count("h2") >= 1; }), K("There are at least 2 heading 3s", function (c) { return c.count("h3") >= 2; })],
      [CNT("There are at least 8 paragraphs", "p", 8)]
    ],
    "Step 3": [
      [K("At least 3 bold words or phrases (strong or b)", function (c) { return c.all("strong").concat(c.all("b")).length >= 3; })],
      [K("At least 1 italic word or phrase (em or i)", function (c) { return c.all("em").concat(c.all("i")).length >= 1; })],
      [K("At least 3 line breaks (br)", function (c) { return c.all("br").length >= 3; })],
      [K("At least 2 horizontal lines (hr), outside any paragraph", function (c) { return c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 2; })]
    ],
    "Step 4": [
      [K("At least 3 different colors are used on the page", function (c) { return distinctColors(c).length >= 3; })],
      [K("At least 2 different font-sizes in px", function (c) { var n = {}; allEls(c).forEach(function (x) { h.vals(c, x, "font-size").forEach(function (v) { if (h.isPx(v)) n[v] = 1; }); }); return Object.keys(n).length >= 2; })],
      [K("At least 1 tag is text-align center (or right)", function (c) { return anyVal(c, "text-align", function (v) { return v === "center" || v === "right"; }); })],
      [K("At least 1 thing is text-transform uppercase (a section, paragraph, word, or letter)", function (c) { return anyVal(c, "text-transform", function (v) { return v === "uppercase"; }); })]
    ],
    "Step 5": [
      [K("At least 4 span tags, each with its own style", function (c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style) && txt(c, k).length > 0; }).length >= 4; })],
      [K("At least 6 tags each have 2 or more style properties", function (c) { return allEls(c).filter(function (x) { return propCount(c, x) >= 2; }).length >= 6; })]
    ]
  } };
  lastStep("6.3", "Step 6", [[h.ALLGREEN], []]);

  /* =============== 6.35  (3.5) Google Fonts: pick one of 6 themes (or your own), 3+ Google fonts from 2+ families, and make it look designed =============== */
  function gfLinks(c) { return c.all("link").filter(function (l) { return /^https:\/\/fonts\.googleapis\.com\/css2?\?/i.test(l.attrs.href || "") && /stylesheet/i.test(l.attrs.rel || "stylesheet"); }); }
  function gNames(c) { var n = {}; gfLinks(c).forEach(function (l) { var m, re = /family=([^&:;]+)/g; while ((m = re.exec(l.attrs.href || ""))) { var nm; try { nm = decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { nm = m[1]; } n[nm.trim().toLowerCase()] = 1; } }); return Object.keys(n); }
  function ffOf(c, x) { var v = h.vals(c, x, "font-family")[0]; return v ? String(v).toLowerCase() : ""; }
  function ffList(c) { var out = []; allEls(c).forEach(function (x) { h.vals(c, x, "font-family").forEach(function (v) { out.push(String(v).toLowerCase()); }); }); return out; }
  function ffFirst(v) { return String(v).split(",")[0].replace(/['"]/g, "").trim(); }
  function ffLast(v) { var p = String(v).split(","); return p[p.length - 1].replace(/['"]/g, "").trim(); }
  function families(c) { var n = {}; ffList(c).forEach(function (v) { var l = ffLast(v); if (/^(serif|sans-serif|monospace|cursive|fantasy)$/.test(l)) n[l] = 1; }); return Object.keys(n); }
  function sharedFont(c, tags, need) { var cnt = {}; tags.forEach(function (t) { c.all(t).forEach(function (x) { var f = ffOf(c, x); if (f) cnt[f] = (cnt[f] || 0) + 1; }); }); return Object.keys(cnt).some(function (k) { return cnt[k] >= need; }); }
  function bgs(c) { var n = {}; allEls(c).forEach(function (x) { var v = h.vals(c, x, "background-color")[0]; if (v && named(v)) n[v] = 1; }); return Object.keys(n); }
  var FAM4 = [["BONUS: your fonts come from 4 different families (serif, sans-serif, monospace, and cursive) and still look designed", function (c) { return families(c).length >= 4; }]]; FAM4.bonus = 5;
  SC.LESSONS["6.35"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [
      [],
      [K("There is at least 1 link tag in the head that loads a Google font (https://fonts.googleapis.com)", function (c) { var g = gfLinks(c); return g.length >= 1 && g.every(function (l) { return !!c.ancestor(l, ["head"]); }); })],
      [K("Your links bring in at least 3 different fonts", function (c) { return gNames(c).length >= 3; })]
    ],
    "Step 3": [
      [K("There is a heading 1", function (c) { return c.count("h1") >= 1; }), K("There is a heading 2", function (c) { return c.count("h2") >= 1; }), K("There are at least 2 heading 3s", function (c) { return c.count("h3") >= 2; })],
      [CNT("There are at least 6 paragraphs", "p", 6)]
    ],
    "Step 4": [
      [K("At least 3 different Google fonts are used in font-family styles", function (c) { var g = gNames(c), used = {}; ffList(c).forEach(function (v) { var f = ffFirst(v); if (g.indexOf(f) > -1) used[f] = 1; }); return Object.keys(used).length >= 3; })],
      [K("Every font-family ends with a fallback family (serif, sans-serif, monospace, cursive, or fantasy)", function (c) { var l = ffList(c); return l.length >= 1 && l.every(function (v) { return v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); })],
      [K("At least 6 tags use a font-family", function (c) { return allEls(c).filter(function (x) { return h.vals(c, x, "font-family").length > 0; }).length >= 6; })],
      [K("It looks designed, not thrown together: at least 4 paragraphs share the same font, and at least 2 headings share the same font", function (c) { return sharedFont(c, ["p"], 4) && sharedFont(c, ["h1", "h2", "h3"], 2); })],
      [K("At least 3 span tags, each with its own style (a different font, color, size, or background-color on a few words)", function (c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style) && txt(c, k).length > 0; }).length >= 3; })],
      FAM4
    ],
    "Step 5": [
      [K("At least 3 different text and background colors are used on the page", function (c) { return distinctColors(c).length >= 3; }), K("At least 2 different background-colors are used (the body counts)", function (c) { return bgs(c).length >= 2; })],
      [K("At least 2 bold words or phrases", function (c) { return c.all("strong").concat(c.all("b")).length >= 2; }), K("At least 2 italic words or phrases", function (c) { return c.all("em").concat(c.all("i")).length >= 2; })],
      [K("At least 3 line breaks", function (c) { return c.all("br").length >= 3; }), K("At least 2 horizontal lines, outside any paragraph", function (c) { return c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 2; })],
      [K("At least 2 different font sizes in px", function (c) { var n = {}; allEls(c).forEach(function (x) { h.vals(c, x, "font-size").forEach(function (v) { if (h.isPx(v)) n[v] = 1; }); }); return Object.keys(n).length >= 2; }), K("At least 2 tags are text-align center (or right)", function (c) { return allEls(c).filter(function (x) { return h.vals(c, x, "text-align").some(function (v) { return v === "center" || v === "right"; }); }).length >= 2; }), K("At least 2 things are text-transform uppercase", function (c) { return allEls(c).filter(function (x) { return h.vals(c, x, "text-transform").some(function (v) { return v === "uppercase"; }); }).length >= 2; })]
    ]
  } };
  lastStep("6.35", "Step 6", [[h.ALLGREEN], []]);

  /* =============== 6.4  (3.5) Border: the wanted poster =============== */
  var wanted = T("h1"), crimes = afterEl(T("h1"), "p"), desc = HW("h2", /description/i), descP1 = afterEl(desc, "p"), descP2 = function (c) { return h.nextEl(descP1(c)); };
  var marks = HW("h3", /distinguishing/i), lastSeen = HW("h2", /last seen/i), hide = HW("h3", /hideout/i), reward = HW("h2", /reward/i);
  SC.LESSONS["6.4"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [
      [exists("There is a heading 1", wanted), K("It says WANTED", function (c) { var e = wanted(c); return !!e && /wanted/i.test(txt(c, e)); }), P("It has a color", wanted, "color", named), P("It has a background-color", wanted, "background-color", named),
       P("Its font-size is 56px", wanted, "font-size", h.px(56)), P("It is text-align center", wanted, "text-align", center), P("It is text-transform uppercase", wanted, "text-transform", upper), P("It has a solid border", wanted, "border", h.bs("solid"))],
      [exists("A paragraph is under the heading 1", crimes), P("Its font-size is 20px", crimes, "font-size", h.px(20)),
       K("Two phrases are colored with spans", function (c) { var p = crimes(c); return !!p && within(p, ["span"]).filter(function (s) { return has(c, s, "color"); }).length >= 2; }), IN("One phrase is bold", crimes, BOLD)],
      [hrAfter("A horizontal line is under the paragraph, outside it", crimes)]
    ],
    "Step 3": [
      [exists("There is a heading 2 that says Description", desc), P("It has a color", desc, "color", named), P("Its font-size is 30px", desc, "font-size", h.px(30)), PX("It has a border on the bottom only", desc, onlySide("bottom"))],
      [exists("A paragraph is under the Description heading", descP1), IN("It has a bold word", descP1, BOLD), IN("It has an italic word", descP1, ITAL), IN("It has 2 line breaks", descP1, ["br"], 2)],
      [K("A second paragraph follows it", function (c) { var p = descP2(c); return !!p && p.tag === "p"; }), P("It has a dashed border", descP2, "border", h.bs("dashed")),
       IN("It has an italic word", descP2, ITAL), IN("It has a bold word", descP2, BOLD), IN("It has a line break", descP2, ["br"])]
    ],
    "Step 4": [
      [exists("There is a heading 3 that says Distinguishing Marks", marks), P("It is text-align center", marks, "text-align", center), P("It has a color", marks, "color", named), exists("A paragraph is under it", afterEl(marks, "p")),
       P("The paragraph has a dotted border", afterEl(marks, "p"), "border", h.bs("dotted"))],
      [K("A horizontal line comes before Last Seen", function (c) { var e = lastSeen(c); if (!e) return false; var k = kids(e.parent), i = k.indexOf(e); for (var j = i - 1; j >= 0 && k[j].tag !== "h2"; j--) if (k[j].tag === "hr") return true; return false; }),
       exists("There is a heading 2 that says Last Seen", lastSeen), P("It is text-transform uppercase", lastSeen, "text-transform", upper), P("It has a color", lastSeen, "color", named), PX("It has a border on the left only", lastSeen, onlySide("left"))],
      [exists("There is a heading 3 that says Known Hideouts", hide), P("It has a color", hide, "color", named), P("Its font-size is 22px", hide, "font-size", h.px(22)), exists("A paragraph is under it", afterEl(hide, "p")),
       P("The paragraph has a dashed border", afterEl(hide, "p"), "border", h.bs("dashed")),
       K("Its border color is different from the other dashed border", function (c) { var a = h.vals(c, descP2(c), "border")[0], b = h.vals(c, afterEl(hide, "p")(c), "border")[0]; return !!a && !!b && h.borderColor(a) !== "" && h.borderColor(a) !== h.borderColor(b); })]
    ],
    "Step 5": [
      [exists("There is a heading 2 that says Reward", reward), P("It has a color", reward, "color", named), exists("A paragraph is under it", afterEl(reward, "p")), IN("The reward amount is bold", afterEl(reward, "p"), BOLD),
       P("The paragraph has a background-color", afterEl(reward, "p"), "background-color", named), P("It has a solid border", afterEl(reward, "p"), "border", h.bs("solid")), P("It is text-align center", afterEl(reward, "p"), "text-align", center),
       P("Its font-size is 24px", afterEl(reward, "p"), "font-size", h.px(24))],
      [K("A last paragraph comes after the reward", function (c) { var r = afterEl(reward, "p")(c), l = lastP(c); return !!r && !!l && l !== r; }), IN("The warning is in italics", lastP, ITAL), IN("It has a line break", lastP, ["br"]),
       P("Its font-size is 13px", lastP, "font-size", h.px(13)), P("It is text-align center", lastP, "text-align", center), P("It has a dotted border", lastP, "border", h.bs("dotted"))]
    ]
  } };
  SC.LESSONS["6.4"].steps["Step 6"] = [
    [K("There is a link tag in the head that loads a Google font (https://fonts.googleapis.com)", function (c) { var g = gfLinks(c); return g.length >= 1 && g.every(function (l) { return !!c.ancestor(l, ["head"]); }); }), K("Your link brings in at least 2 different fonts", function (c) { return gNames(c).length >= 2; })],
    [K("At least 2 different Google fonts are used in font-family styles", function (c) { var g = gNames(c), used = {}; ffList(c).forEach(function (v) { var f = ffFirst(v); if (g.indexOf(f) > -1) used[f] = 1; }); return Object.keys(used).length >= 2; }),
     K("At least 2 font-family styles, and every one ends with a fallback family (serif, sans-serif, monospace, cursive, or fantasy)", function (c) { var l = ffList(c); return l.length >= 2 && l.every(function (v) { return v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); })]
  ];
  lastStep("6.4", "Step 7", [[h.ALLGREEN], []]);

  /* =============== 6.5  (3.6) Lists: the guide page =============== */
  var menu = afterEl(T("h1"), "ul");
  var tag5 = afterEl(menu, "p");
  var h2a = T("h2", 0), h2b = T("h2", 1), ol0 = T("ol", 0), ol1 = T("ol", 1), ul1 = T("ul", 1), ul2 = T("ul", 2);
  var h3AfterP = function (pickP) { return function (c) { var p = pickP(c), n = h.nextEl(p); return n && n.tag === "h3" ? n : null; }; };
  SC.LESSONS["6.5"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a background-color (dark)", T("h1"), "background-color", named), P("It has a white color", T("h1"), "color", h.isWhite), P("It is text-align center", T("h1"), "text-align", center),
       P("Its font-size is 36px", T("h1"), "font-size", h.px(36)), PX("It has a border on the bottom only", T("h1"), onlySide("bottom"))],
      [exists("A bullet list is under the heading 1", menu), listItems(menu, 3), P("The list has list-style-type none", menu, "list-style-type", h.eq("none")), P("The list has a background-color", menu, "background-color", named), P("The list is text-align center", menu, "text-align", center)],
      [eachLi("Each of the 3 list items is display inline", menu, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); }), eachLi("Each of the 3 list items has a white color", menu, 3, function (c, li) { return has(c, li, "color", h.isWhite); })]
    ],
    "Step 3": [
      [exists("A paragraph (the tagline) comes after the menu", tag5), P("It is text-align center", tag5, "text-align", center), IN("A phrase is in italics", tag5, ITAL),
       K("2 words are colored with 2 spans", function (c) { var p = tag5(c); return !!p && within(p, ["span"]).filter(function (s) { return has(c, s, "color"); }).length >= 2; }), IN("It has a line break", tag5, ["br"])],
      [hrAfter("A horizontal line is under the paragraph, outside it", tag5)]
    ],
    "Step 4": [
      [exists("There is a heading 2", h2a), P("It has a color", h2a, "color", named), P("It is text-transform uppercase", h2a, "text-transform", upper), P("Its font-size is 26px", h2a, "font-size", h.px(26)), PX("It has a border on the bottom only", h2a, onlySide("bottom"))],
      [exists("A paragraph is under the heading 2", afterEl(h2a, "p")), exists("A heading 3 comes after it", h3AfterP(afterEl(h2a, "p"))), exists("There is a numbered list", ol0), listItems(ol0, 3), boldItalicItems(ol0, 3),
       P("The numbered list has list-style-type decimal", ol0, "list-style-type", h.eq("decimal")), P("It has a background-color", ol0, "background-color", named), P("It has a solid border", ol0, "border", h.bs("solid"))],
      [exists("There is another heading 3 (with a color)", HW("h3", /./, 1)), P("The second heading 3 has a color", HW("h3", /./, 1), "color", named), exists("There is a second bullet list", ul1), listItems(ul1, 3),
       P("It has list-style-type square", ul1, "list-style-type", h.eq("square")), P("It has a background-color", ul1, "background-color", named), P("It has a dashed border", ul1, "border", h.bs("dashed"))],
      [K("A horizontal line comes after the lists", function (c) { var l = ul1(c), n = h.nextEl(l); return !!n && n.tag === "hr"; })]
    ],
    "Step 5": [
      [exists("There is a second heading 2", h2b), exists("A paragraph is under it", afterEl(h2b, "p")), P("The paragraph has a dashed border", afterEl(h2b, "p"), "border", h.bs("dashed"))],
      [exists("There is a heading 3 and a second numbered list", ol1), listItems(ol1, 3), boldItalicItems(ol1, 3), P("It has list-style-type upper-roman", ol1, "list-style-type", h.eq("upper-roman")), P("It has a background-color", ol1, "background-color", named), P("It has a dotted border", ol1, "border", h.bs("dotted"))],
      [exists("There is a heading 3 (with a color) and a third bullet list", ul2), P("The heading 3 above the list has a color", HW("h3", /./, 3), "color", named), listItems(ul2, 3), P("It has list-style-type circle", ul2, "list-style-type", h.eq("circle")), P("It has a background-color", ul2, "background-color", named), P("It has a solid border", ul2, "border", h.bs("solid"))]
    ],
    "Step 6": [[
      K("A horizontal line comes before the last paragraph", function (c) { var p = lastP(c), k = p ? kids(p.parent) : [], i = k.indexOf(p); return !!p && i > 0 && k[i - 1].tag === "hr"; }), IN("The last paragraph has a line break", lastP, ["br"]), P("It is text-align center", lastP, "text-align", center),
      P("Its font-size is 13px", lastP, "font-size", h.px(13)), P("It has a dotted border", lastP, "border", h.bs("dotted"))
    ]]
  } };
  lastStep("6.5", "Step 7", [[h.ALLGREEN], []]);

  /* =============== 6.6  (3.7) Links: the link hub =============== */
  function linkIn(c, li) { return within(li, ["a"])[0] || null; }
  function linksOk(count, newTab) {
    return function (c, l) { var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= count && li.slice(0, count).every(function (x) { var a = linkIn(c, x); if (!a || !/^https?:\/\//i.test(a.attrs.href || "")) return false; var t = a.attrs.target; return newTab ? t === "_blank" : (t === undefined || t === "_self"); }); };
  }
  var hubUl0 = afterEl(T("h1"), "ul"), hubUl1 = T("ul", 1), hubUl2 = T("ul", 2), hubOl0 = T("ol", 0);
  var hubP0 = function (c) { var l = hubUl0(c), n = h.nextEl(l); return n && n.tag === "p" ? n : null; };
  var niceLinks = function (pick) { return K("Each link says where it goes (not \"click here\"), with the name in bold inside the link", function (c) { var l = pick(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= 3 && li.slice(0, 3).every(function (x) { var a = linkIn(c, x); return !!a && !/click here|^here$/i.test(txt(c, a)) && within(a, BOLD).length >= 1; }); }); };
  var italicNote = function (pick) { return eachLi("Each item has an italic note", pick, 3, function (c, li) { return within(li, ITAL).length >= 1; }); };
  var featured = HW("h3", /featured/i);
  SC.LESSONS["6.6"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a white color", T("h1"), "color", h.isWhite), P("It has a background-color", T("h1"), "background-color", named), P("It is text-align center", T("h1"), "text-align", center), P("Its font-size is 38px", T("h1"), "font-size", h.px(38))],
      [exists("A bullet list is under the heading 1", hubUl0), listItems(hubUl0, 3), PX("Each item has a link starting with https:// that opens in the same tab", hubUl0, linksOk(3, false)), P("The list has list-style-type none", hubUl0, "list-style-type", h.eq("none")),
       P("It is text-align center", hubUl0, "text-align", center), PX("It has a border on the bottom only", hubUl0, onlySide("bottom")), eachLi("Each list item is display inline", hubUl0, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })],
      [exists("A paragraph comes after the menu", hubP0), P("It is text-align center", hubP0, "text-align", center), IN("A phrase is in italics", hubP0, ITAL), K("One word is colored with a span", function (c) { var p = hubP0(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }),
       IN("It has a line break", hubP0, ["br"]), hrAfter("A horizontal line is under it, outside it", hubP0)]
    ],
    "Step 3": [
      [exists("There is a heading 2", T("h2", 0)), P("It has a color", T("h2", 0), "color", named), P("It is text-transform uppercase", T("h2", 0), "text-transform", upper), exists("There is a second bullet list", hubUl1), listItems(hubUl1, 3),
       P("It has list-style-type square", hubUl1, "list-style-type", h.eq("square")), P("It has a dashed border", hubUl1, "border", h.bs("dashed"))],
      [PX("Each item has a link that opens in a new tab", hubUl1, linksOk(3, true)), niceLinks(hubUl1), italicNote(hubUl1)],
      [K("A horizontal line comes after the list", function (c) { var n = h.nextEl(hubUl1(c)); return !!n && n.tag === "hr"; })]
    ],
    "Step 4": [
      [exists("There is a second heading 2", T("h2", 1)), P("It has a color", T("h2", 1), "color", named), exists("There is a numbered list", hubOl0), listItems(hubOl0, 3), P("It has list-style-type upper-roman", hubOl0, "list-style-type", h.eq("upper-roman")), P("It has a dotted border", hubOl0, "border", h.bs("dotted"))],
      [PX("Each item has a link that opens in the same tab", hubOl0, linksOk(3, false)), niceLinks(hubOl0), italicNote(hubOl0)]
    ],
    "Step 5": [
      [exists("There is a heading 3 that says Featured", featured), K("The whole heading is inside a link (an a tag around the h3)", function (c) { var e = featured(c); return !!e && !!c.ancestor(e, ["a"]); }),
       K("The link has a real https:// address and opens in a new tab", function (c) { var e = featured(c), a = e ? c.ancestor(e, ["a"]) : null; return !!a && /^https:\/\//i.test(a.attrs.href || "") && a.attrs.target === "_blank"; })],
      [K("A paragraph has a bold phrase inside a link (the strong tag sits inside the a tag)", function (c) { return c.all("p").some(function (p) { return within(p, ["a"]).some(function (a) { return within(a, BOLD).length >= 1 && /^https:\/\//i.test(a.attrs.href || ""); }); }); })],
      [exists("There is a last bullet list", hubUl2), listItems(hubUl2, 3), eachLi("Each item is one link that wraps a bold word and an italic word", hubUl2, 3, function (c, li) { var a = linkIn(c, li); return !!a && /^https:\/\//i.test(a.attrs.href || "") && within(a, BOLD).length >= 1 && within(a, ITAL).length >= 1; }),
       P("The list has list-style-type none", hubUl2, "list-style-type", h.eq("none")), P("It is text-align center", hubUl2, "text-align", center)]
    ]
  } };
  lastStep("6.6", "Step 6", [[], [h.ALLGREEN], []]);

  /* =============== 6.7  (3.7) Images and Favicons: pick one of 10 themes (or your own) and make a page full of framed pictures =============== */
  function faviconEls(c) { return c.all("link").filter(function (l) { return /^(shortcut\s+)?icon$/i.test((l.attrs.rel || "").trim()) && /\S/.test(l.attrs.href || ""); }); }
  function allImgs(c) { return c.all("img"); }
  function fontUsedOk(c) { var g = gNames(c), ok = false; ffList(c).forEach(function (v) { if (g.indexOf(ffFirst(v)) > -1 && v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v))) ok = true; }); return g.length >= 1 && ok; }
  SC.LESSONS["6.7"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [[]],
    "Step 3": [
      [K("There is a favicon: a link tag with rel icon and an href, inside the head", function (c) { var f = faviconEls(c); return f.length >= 1 && f.every(function (l) { return !!c.ancestor(l, ["head"]); }); })],
      [K("There is a link tag in the head that loads a Google font (https://fonts.googleapis.com)", function (c) { var g = gfLinks(c); return g.length >= 1 && g.every(function (l) { return !!c.ancestor(l, ["head"]); }); })]
    ],
    "Step 4": [
      [K("There is at least 1 heading", function (c) { return c.count("h1") + c.count("h2") + c.count("h3") + c.count("h4") >= 1; })],
      [K("There is at least 1 paragraph", function (c) { return c.count("p") >= 1; })],
      [K("There is at least 1 line break (br)", function (c) { return c.all("br").length >= 1; }), K("There is at least 1 horizontal line (hr), outside any paragraph", function (c) { return c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 1; })]
    ],
    "Step 5": [
      [K("There are at least 5 pictures (img tags)", function (c) { return allImgs(c).length >= 5; }), K("Every picture has a src that is a web address (upload one or use a real address)", function (c) { var im = allImgs(c); return im.length >= 1 && im.every(function (i) { return /^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || ""); }); })],
      [K("Every picture has a real alt description", function (c) { var im = allImgs(c); return im.length >= 1 && im.every(function (i) { var a = (i.attrs.alt || "").trim().toLowerCase(); return a.length >= 3 && a !== "describe your image here"; }); })],
      [K("Every picture has a border (thickness, style, color)", function (c) { var im = allImgs(c); return im.length >= 1 && im.every(function (i) { return has(c, i, "border", h.BORDER); }); })],
      [K("Every picture has a width", function (c) { var im = allImgs(c); return im.length >= 1 && im.every(function (i) { return has(c, i, "width") || i.attrs.width !== undefined; }); })]
    ],
    "Step 6": [
      [K("Your Google font is used in a font-family, and ends with a fallback family", function (c) { return fontUsedOk(c); })],
      [K("There is at least 1 bold or italic word or phrase", function (c) { return c.all("strong").concat(c.all("b"), c.all("em"), c.all("i")).length >= 1; })],
      [K("There is at least 1 span with its own style", function (c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style) && txt(c, k).length > 0; }).length >= 1; })],
    ],
    "Step 7": [
      [K("There is at least 1 heading 2 and at least 1 heading 3", function (c) { return c.count("h2") >= 1 && c.count("h3") >= 1; })],
      [K("At least 1 thing is text-transform uppercase", function (c) { return anyVal(c, "text-transform", function (v) { return v === "uppercase"; }); })],
      [K("Solid, dashed, and dotted borders are each used at least 2 times (your picture borders count)", function (c) { var n = { solid: 0, dashed: 0, dotted: 0 }; allEls(c).forEach(function (x) { ["border", "border-top", "border-bottom", "border-left", "border-right", "border-style"].forEach(function (p) { h.vals(c, x, p).forEach(function (v) { ["solid", "dashed", "dotted"].forEach(function (st) { if (new RegExp("\\b" + st + "\\b").test(v)) n[st]++; }); }); }); }); return n.solid >= 2 && n.dashed >= 2 && n.dotted >= 2; })],
      [K("At least 2 one-sided borders (like border-bottom)", function (c) { var n = 0; allEls(c).forEach(function (x) { ["border-top", "border-bottom", "border-left", "border-right"].forEach(function (p) { if (h.vals(c, x, p).length) n++; }); }); return n >= 2; })]
    ]
  } };
  lastStep("6.7", "Step 8", [[h.ALLGREEN], []]);
  /* =============== 6.75  (3.8) Emojis and Symbols: pasted characters are text. One of 6 themes (or the student's own) =============== */
  var CH = h.chars;
  function chOf(c, el) { return txt(c, el); }
  function hasEmoji(c, el) { return !!el && CH.emojis(chOf(c, el)).length > 0; }
  function hasAnyCh(c, el) { return !!el && CH.has(chOf(c, el)); }
  function sideBorderOf(c, el) { return ["border-top", "border-bottom", "border-left", "border-right"].some(function (p) { return h.vals(c, el, p).length > 0; }); }
  function bodyChars(c) { var b = c.all("body")[0]; return b ? txt(c, b) : ""; }
  function borderCount(c, style) { var n = 0; allEls(c).forEach(function (x) { ["border", "border-top", "border-bottom", "border-left", "border-right"].forEach(function (p) { h.vals(c, x, p).forEach(function (v) { if (new RegExp("\\b" + style + "\\b").test(v) && h.BORDER.test(v)) n++; }); }); }); return n; }
  function hasSolid(c, el, style) { return has(c, el, "border", h.bs(style)); }
  var imgs675 = function (c) { return c.all("img"); };
  SC.LESSONS["6.75"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color or hex code)")]],
    "Step 2": [[]],
    "Step 3": [
      [K("There is a favicon: a link tag with rel icon and an href, inside the head", function (c) { var f = faviconEls(c); return f.length >= 1 && f.every(function (l) { return !!c.ancestor(l, ["head"]); }); })],
      [K("There is a link tag in the head that loads a Google font (https://fonts.googleapis.com)", function (c) { var g = gfLinks(c); return g.length >= 1 && g.every(function (l) { return !!c.ancestor(l, ["head"]); }); })]
    ],
    "Step 4": [
      [exists("There is a heading 1", H1), K("It has an emoji pasted in", function (c) { return hasEmoji(c, H1(c)); }), P("It has a color", H1, "color", named), P("It has a background-color", H1, "background-color", named), P("Its font-size is in pixels", H1, "font-size", h.isPx),
       P("It is text-align center", H1, "text-align", center), P("It is text-transform uppercase", H1, "text-transform", upper), P("It has a solid border", H1, "border", h.bs("solid")),
       K("Your Google font is in its font-family, ending with a fallback family", function (c) { var e = H1(c); if (!e) return false; var g = gNames(c); return h.vals(c, e, "font-family").some(function (v) { return g.indexOf(ffFirst(v)) > -1 && v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); })],
      [exists("A paragraph is under the heading 1", AFTER(H1, "p")), P("It is text-align center", AFTER(H1, "p"), "text-align", center), P("Its font-size is 20px", AFTER(H1, "p"), "font-size", h.px(20)), IN("One phrase is in italics", AFTER(H1, "p"), ITAL),
       K("At least 2 spans each wrap a symbol, with their own font-size in px and color", function (c) { var p = AFTER(H1, "p")(c); return !!p && within(p, ["span"]).filter(function (s) { return CH.symbols(chOf(c, s)).length > 0 && has(c, s, "font-size", h.isPx) && has(c, s, "color", named); }).length >= 2; })],
      [K("There are at least 3 heading 2s", function (c) { return c.count("h2") >= 3; }), K("Every heading 2 has an emoji or a symbol pasted in", function (c) { var a = c.all("h2"); return a.length >= 3 && a.every(function (x) { return hasAnyCh(c, x); }); }), K("Every heading 2 has a color", function (c) { var a = c.all("h2"); return a.length >= 3 && a.every(function (x) { return has(c, x, "color", named); }); }),
       K("Every heading 2 has a border on one side only", function (c) { var a = c.all("h2"); return a.length >= 3 && a.every(function (x) { return sideBorderOf(c, x); }); })],
      [K("There are at least 2 heading 3s", function (c) { return c.count("h3") >= 2; }), K("Every heading 3 has a symbol or an emoji pasted in", function (c) { var a = c.all("h3"); return a.length >= 2 && a.every(function (x) { return hasAnyCh(c, x); }); }), K("At least one heading 3 is text-transform uppercase", function (c) { return c.all("h3").some(function (x) { return has(c, x, "text-transform", upper); }); })],
      [K("At least 6 paragraphs or list items have 4 or more real words each", function (c) { return c.all("p").concat(c.all("li")).filter(function (x) { return CH.words(chOf(c, x)) >= 4; }).length >= 6; })]
    ],
    "Step 5": [
      [K("At least 10 emojis are pasted into your text", function (c) { return CH.emojis(bodyChars(c)).length >= 10; }), K("At least 6 of the emojis are different", function (c) { return CH.distinct(CH.emojis(bodyChars(c))) >= 6; })],
      [K("At least 4 different symbols are pasted into your text (like a star, a heart, an arrow, or a degree sign)", function (c) { return CH.distinct(CH.symbols(bodyChars(c))) >= 4; })],
      [K("There is a list (ul or ol) with at least 4 items", function (c) { return c.all("ul").concat(c.all("ol")).some(function (l) { return l.children.filter(function (n) { return n.tag === "li"; }).length >= 4; }); }),
       K("Every item in it starts with an emoji or a symbol", function (c) { return c.all("ul").concat(c.all("ol")).some(function (l) { var li = l.children.filter(function (n) { return n.tag === "li"; }); return li.length >= 4 && li.every(function (x) { return CH.startsWith(chOf(c, x)); }); }); })],
      [K("At least one tag that holds an emoji or a symbol has a font-size of 40px or more", function (c) { return allEls(c).some(function (x) { return hasAnyCh(c, x) && h.vals(c, x, "font-size").some(function (v) { var m = /^(\d+(?:\.\d+)?)px$/.exec(v); return !!m && +m[1] >= 40; }); }); })],
      [K("The last paragraph has the copyright symbol", function (c) { var p = lastP(c); return !!p && chOf(c, p).indexOf("©") > -1; }), P("It is text-align center", lastP, "text-align", center), P("Its font-size is 14px", lastP, "font-size", h.px(14)), P("It has a border", lastP, "border", function (v) { return h.BORDER.test(v); })]
    ],
    "Step 6": [
      [K("There are at least 2 pictures (img tags)", function (c) { return imgs675(c).length >= 2; }), K("Every picture has a src that is a web address", function (c) { var im = imgs675(c); return im.length >= 1 && im.every(function (i) { return /^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || ""); }); }),
       K("Every picture has a real alt description", function (c) { var im = imgs675(c); return im.length >= 1 && im.every(function (i) { var a = (i.attrs.alt || "").trim().toLowerCase(); return a.length >= 3 && a !== "describe your image here"; }); }),
       K("Every picture has a width in percent", function (c) { var im = imgs675(c); return im.length >= 1 && im.every(function (i) { return h.vals(c, i, "width").some(function (v) { return /^\d+(\.\d+)?%$/.test(v); }); }); })],
      [K("Solid borders are used at least 2 times", function (c) { return borderCount(c, "solid") >= 2; }), K("Dashed borders are used at least 2 times", function (c) { return borderCount(c, "dashed") >= 2; }), K("Dotted borders are used at least 2 times", function (c) { return borderCount(c, "dotted") >= 2; })],
      [K("At least 2 one-sided borders (like border-bottom)", function (c) { var n = 0; allEls(c).forEach(function (x) { ["border-top", "border-bottom", "border-left", "border-right"].forEach(function (p) { if (h.vals(c, x, p).length) n++; }); }); return n >= 2; })],
      [K("There is at least 1 bold word or phrase", function (c) { return c.all("strong").concat(c.all("b")).length >= 1; }), K("There is at least 1 line break (br)", function (c) { return c.all("br").length >= 1; }), K("There is at least 1 horizontal line (hr), outside any paragraph", function (c) { return c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 1; })]
    ]
  } };
  lastStep("6.75", "Step 7", [[h.ALLGREEN], []]);


  /* =============== BUILD AND STYLE TOGETHER: 3.2, 3.3 Part 2, 3.3 Part 3 ===============
     Each tag is built AND styled in the same bullet (a heading with its style, then the paragraphs right under it with their styles), one section at a time.
     These replace the older versions above (which built every tag first and styled them in a later step). */
  function nth(tag, i) { return function (c) { return c.all(tag)[i] || null; }; }
  function psAfter(c, el) { var out = [], n = el ? h.nextEl(el) : null; while (n && n.tag === "p") { out.push(n); n = h.nextEl(n); } return out; }
  function bothStyled(c, x) { return has(c, x, "color", named) && has(c, x, "background-color", named) && bothDiffer(c, x); }
  function twoPs(label, pickHead, test) { return K(label, function (c) { var p = psAfter(c, pickHead(c)); return p.length >= 2 && p.slice(0, 2).every(function (x) { return test(c, x); }); }); }
  function nPs(n, where, pickHead) { return K("There are " + n + " paragraphs right under " + where, function (c) { return psAfter(c, pickHead(c)).length >= n; }); }

  /* ---- 3.2 (6.2) ---- */
  (function () {
    function headChecks(i, extra) {
      var H = nth("h2", i);
      return [exists("There is heading 2 number " + (i + 1) + " (under your heading 1)", H), K("It has a color and a background-color, two different named colors", function (c) { var e = H(c); return !!e && bothStyled(c, e); })].concat(extra || []);
    }
    function parChecks(i, extra) {
      var H = nth("h2", i);
      return [nPs(2, "heading 2 number " + (i + 1), H), twoPs("Each of those 2 paragraphs has a color and a background-color, two different named colors", H, bothStyled)].concat(extra || []);
    }
    var pattern = K("Pattern: this heading 2 uses exactly the same text color and background-color as your first heading 2", function (c) { var a = c.all("h2"); if (a.length < 2) return false; return h.vals(c, a[0], "color")[0] + "|" + h.vals(c, a[0], "background-color")[0] === h.vals(c, a[1], "color")[0] + "|" + h.vals(c, a[1], "background-color")[0] && !!h.vals(c, a[0], "color")[0]; });
    var uniq = [
      CNT("There are at least 6 paragraphs", "p", 6),
      K("No two paragraphs share a background-color (every paragraph has its own)", function (c) { var a = c.all("p").filter(function (x) { return h.vals(c, x, "color")[0] || h.vals(c, x, "background-color")[0]; }), seen = {}; return a.length >= 6 && a.every(function (x) { var v = h.vals(c, x, "background-color")[0]; if (!v || seen[v]) return false; seen[v] = 1; return true; }); }),
      K("No two paragraphs share a text color (every paragraph has its own)", function (c) { var a = c.all("p").filter(function (x) { return h.vals(c, x, "color")[0] || h.vals(c, x, "background-color")[0]; }), seen = {}; return a.length >= 6 && a.every(function (x) { var v = h.vals(c, x, "color")[0]; if (!v || seen[v]) return false; seen[v] = 1; return true; }); })
    ];
    var old = SC.LESSONS["6.2"].steps;
    SC.LESSONS["6.2"] = { inlineOnly: true, steps: {
      "Step 1": old["Step 1"],
      "Step 2": [old["Step 3"][0].concat(old["Step 3"][1]), []],
      "Step 3": [[K("There is one heading 1", function (c) { return c.count("h1") === 1; }), K("The heading 1 has a color and a background-color, two different named colors", function (c) { var e = T("h1")(c); return !!e && bothStyled(c, e); })]],
      "Step 4": [headChecks(0), parChecks(0)],
      "Step 5": [headChecks(1, [pattern]), parChecks(1)],
      "Step 6": [headChecks(2), parChecks(2, uniq)],
      "Step 7": [old["Step 5"][1], [], RAINBOW]
    } };
    lastStep("6.2", "Step 8", [[h.ALLGREEN], []]);
  })();

  /* ---- 3.3 Part 2 (6.21): the review ---- */
  (function () {
    var old = SC.LESSONS["6.21"].steps;
    function sec(i, hasBg) {
      var H = nth("h2", i + 1);
      return [
        [exists("There is a review heading 2 (number " + (i + 1) + " after the tagline)", H), P("It has a color (a named color or hex code)", H, "color", named), P("Its font-size is in pixels", H, "font-size", h.isPx), P("It is text-transform uppercase", H, "text-transform", upper), P("It is text-align center", H, "text-align", center)],
        [nPs(2, "that heading 2", H),
         K("Both paragraphs have a color (a named color or hex code) and a font-size in pixels", function (c) { var p = psAfter(c, H(c)); return p.length >= 2 && p.slice(0, 2).every(function (x) { return has(c, x, "color", named) && has(c, x, "font-size", h.isPx); }); }),
         K("The first paragraph is text-align center", function (c) { var p = psAfter(c, H(c)); return p.length >= 1 && has(c, p[0], "text-align", center); })
        ].concat(hasBg ? [K("The second paragraph has both a color and a background-color (two different named colors)", function (c) { var p = psAfter(c, H(c)); return p.length >= 2 && bothColorsAndDiffer(c, p[1]); })] : [])
      ];
    }
    var ratingH = HW("h3", /rating/i), relH = HW("h3", /release/i);
    SC.LESSONS["6.21"] = { inlineOnly: true, steps: {
      "Step 1": old["Step 1"],
      "Step 2": old["Step 2"],
      "Step 3": sec(0, true),
      "Step 4": sec(1, true),
      "Step 5": sec(2, false),
      "Step 6": [
        [exists("There is a heading 3 that says Rating", ratingH), P("It has a color (a named color or hex code)", ratingH, "color", named), P("It is text-align center", ratingH, "text-align", center), P("It is text-transform lowercase", ratingH, "text-transform", lower)],
        [exists("A paragraph is right under the Rating heading", AFTER(ratingH, "p")), P("It has a color (a named color or hex code)", AFTER(ratingH, "p"), "color", named), P("Its font-size is in pixels", AFTER(ratingH, "p"), "font-size", h.isPx)],
        [exists("There is a heading 3 that says Release Info", relH), P("It has a color (a named color or hex code)", relH, "color", named), P("It is text-align center", relH, "text-align", center)],
        [exists("A paragraph is right under the Release Info heading", AFTER(relH, "p")), P("It has a color (a named color or hex code)", AFTER(relH, "p"), "color", named), P("Its font-size is in pixels", AFTER(relH, "p"), "font-size", h.isPx)]
      ]
    } };
    lastStep("6.21", "Step 7", [[h.ALLGREEN], []]);
  })();

  /* ---- 3.3 Part 3 (6.22): the band profile ---- */
  (function () {
    var old = SC.LESSONS["6.22"].steps;
    function h2Checks(i) {
      var H = nth("h2", i);
      return [exists("There is heading 2 number " + (i + 1), H), P("It has a color (a named color or hex code)", H, "color", named), P("Its font-size is in pixels", H, "font-size", h.isPx), P("It is text-transform capitalize", H, "text-transform", capital),
        K("It has both a color and a background-color (two different named colors)", function (c) { var e = H(c); return !!e && bothColorsAndDiffer(c, e); })];
    }
    function h3Checks(i, tt) {
      var H3 = nth("h3", i), H2 = nth("h2", i);
      var out = [exists("There is a heading 3 right under heading 2 number " + (i + 1), function (c) { var e = h.nextEl(H2(c)); return e && e.tag === "h3" ? e : null; }), P("It has a color (a named color or hex code)", H3, "color", named), P("Its font-size is in pixels", H3, "font-size", h.isPx)];
      if (tt) out.push(P("It is text-transform " + tt, H3, "text-transform", tt === "uppercase" ? upper : lower));
      return out;
    }
    function pChecks(pickHead, n, where, centered, lastUpper) {
      var out = [nPs(n, where, pickHead), K("Every one of them has a color (a named color or hex code) and a font-size in pixels", function (c) { var p = psAfter(c, pickHead(c)); return p.length >= n && p.slice(0, n).every(function (x) { return has(c, x, "color", named) && has(c, x, "font-size", h.isPx); }); })];
      if (centered) out.push(K("The first " + centered + " are text-align center", function (c) { var p = psAfter(c, pickHead(c)); return p.length >= centered && p.slice(0, centered).every(function (x) { return has(c, x, "text-align", center); }); }));
      if (lastUpper) out.push(K("The last one is text-transform uppercase", function (c) { var p = psAfter(c, pickHead(c)); return p.length >= n && has(c, p[n - 1], "text-transform", upper); }));
      return out;
    }
    SC.LESSONS["6.22"] = { inlineOnly: true, steps: {
      "Step 1": old["Step 1"],
      "Step 2": [old["Step 2"][0]],
      "Step 3": [h2Checks(0), h3Checks(0, "uppercase"), pChecks(nth("h3", 0), 3, "your first heading 3", 2)],
      "Step 4": [h2Checks(1), h3Checks(1, "lowercase"), pChecks(nth("h3", 1), 3, "your second heading 3", 2)],
      "Step 5": [h2Checks(2), pChecks(nth("h2", 2), 2, "your third heading 2", 0, true)],
      "Step 6": [old["Step 2"][3]]
    } };
    lastStep("6.22", "Step 7", [[h.ALLGREEN], []]);
  })();


  /* =============== STRICT TOP-TO-BOTTOM ORDER: 3.4 (6.3), 3.5 (6.35), 3.7 (6.7), 3.8 (6.75) ===============
     Every bullet builds ONE piece of the page and styles it right away, from the top of the page to the bottom, so a student never goes back to
     an earlier step. Head items (the favicon and the font links) come before the body. The requirements are the same ones the older versions
     checked, regrouped onto the bullet where each one gets met. These replace the older versions above. */
  var hrOut = function (c) { return c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length; };
  var boldN = function (c) { return c.all("strong").concat(c.all("b")).length; }, italN = function (c) { return c.all("em").concat(c.all("i")).length; };
  var spansN = function (c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style) && txt(c, k).length > 0; }).length; };
  var inP = function (pick, tag) { return function (c) { var p = pick(c); return !!p && within(p, tag === "strong" ? ["strong", "b"] : [tag]).length >= 1; }; };
  var pxSizes = function (c) { var n = {}; allEls(c).forEach(function (x) { h.vals(c, x, "font-size").forEach(function (v) { if (h.isPx(v)) n[v] = 1; }); }); return Object.keys(n).length; };
  function twoPsUnder(label, pick) { return K(label, function (c) { var e = pick(c); return !!e && psAfter(c, e).length >= 2; }); }
  var nthTag = function (tag, i) { return function (c) { return c.all(tag)[i] || null; }; };
  var firstPAfter = function (pick) { return function (c) { var e = pick(c); return e ? psAfter(c, e)[0] || null : null; }; };
  var secondPAfter = function (pick) { return function (c) { var e = pick(c); return e ? psAfter(c, e)[1] || null : null; }; };

  /* ---- 3.4 (6.3): editing tags and spans ---- */
  (function () {
    var H1x = T("h1"), H2x = nthTag("h2", 0), H3a = nthTag("h3", 0), H3b = nthTag("h3", 1);
    var introP = AFTER(H1x, "p"), s1p = AFTER(H2x, "p");
    var old = SC.LESSONS["6.3"].steps;
    SC.LESSONS["6.3"] = { inlineOnly: true, steps: {
      "Step 1": old["Step 1"],
      "Step 2": [
        [exists("There is a heading 1", H1x), P("It has a color (a named color or hex code)", H1x, "color", named), P("Its font-size is in pixels", H1x, "font-size", h.isPx), P("It is text-align center", H1x, "text-align", center), P("It is text-transform uppercase", H1x, "text-transform", upper)],
        [exists("A paragraph is right under the heading 1", introP), K("A phrase in it is bold", inP(introP, "strong")), K("It has a line break (br) inside", inP(introP, "br")), P("It has a color (a named color or hex code)", introP, "color", named), P("Its font-size is in pixels", introP, "font-size", h.isPx)],
        [hrAfter("There is a horizontal line right under that paragraph (outside it)", introP)]
      ],
      "Step 3": [
        [exists("There is a heading 2", H2x), P("It has a color (a named color or hex code)", H2x, "color", named), P("It is text-transform uppercase", H2x, "text-transform", upper)],
        [exists("A paragraph is right under the heading 2", s1p), IN("A phrase in it is in italics", s1p, ITAL), K("It has a span with its own style", function (c) { var p = s1p(c); return !!p && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }), P("It has a color (a named color or hex code)", s1p, "color", named), P("It has a background-color (a named color or hex code)", s1p, "background-color", named)],
        [exists("There is a heading 3 (the first one)", H3a), P("It has a color (a named color or hex code)", H3a, "color", named), P("Its font-size is in pixels", H3a, "font-size", h.isPx)],
        [twoPsUnder("There are 2 paragraphs right under the heading 3", H3a), K("The first one has a bold phrase, a line break, and a span with its own style", function (c) { var p = firstPAfter(H3a)(c); return !!p && within(p, ["strong", "b"]).length >= 1 && within(p, ["br"]).length >= 1 && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }), K("The second one has a span with its own style", function (c) { var p = secondPAfter(H3a)(c); return !!p && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); })],
        [K("There is a second horizontal line (outside any paragraph)", function (c) { return hrOut(c) >= 2; })]
      ],
      "Step 4": [
        [exists("There is a second heading 3", H3b), P("It has a color (a named color or hex code)", H3b, "color", named), P("It is text-align center", H3b, "text-align", center)],
        [twoPsUnder("There are 2 paragraphs right under the second heading 3", H3b), K("The first one has a bold phrase, a line break, and a span with its own style", function (c) { var p = firstPAfter(H3b)(c); return !!p && within(p, ["strong", "b"]).length >= 1 && within(p, ["br"]).length >= 1 && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }), K("Both have a color and a font-size in pixels", function (c) { var a = psAfter(c, H3b(c)).slice(0, 2); return a.length >= 2 && a.every(function (x) { return has(c, x, "color", named) && has(c, x, "font-size", h.isPx); }); })]
      ],
      "Step 5": [
        [CNT("There are at least 8 paragraphs in all", "p", 8), K("The last paragraph has a color and a font-size in pixels", function (c) { var p = lastP(c); return !!p && has(c, p, "color", named) && has(c, p, "font-size", h.isPx); })],
        [K("At least 3 bold words or phrases (strong or b)", function (c) { return boldN(c) >= 3; }), K("At least 3 line breaks (br)", function (c) { return c.all("br").length >= 3; }), K("At least 4 span tags, each with its own style", function (c) { return spansN(c) >= 4; })],
        [K("At least 3 different colors are used on the page", function (c) { return distinctColors(c).length >= 3; }), K("At least 2 different font-sizes in px", function (c) { return pxSizes(c) >= 2; }), K("At least 6 tags each have 2 or more style properties", function (c) { return allEls(c).filter(function (x) { return propCount(c, x) >= 2; }).length >= 6; })]
      ]
    } };
    lastStep("6.3", "Step 6", [[h.ALLGREEN], []]);
  })();

  /* ---- 3.5 (6.35): Google fonts ---- */
  (function () {
    var old = SC.LESSONS["6.35"].steps, H1x = T("h1"), introP = AFTER(H1x, "p"), H2x = nthTag("h2", 0), H3a = nthTag("h3", 0), H3b = nthTag("h3", 1);
    var spanOk = function (c) { return spansN(c); };
    SC.LESSONS["6.35"] = { inlineOnly: true, steps: {
      "Step 1": [old["Step 1"][0],
        old["Step 2"][1], old["Step 2"][2],
        h.TITLE, old["Step 1"][2]],
      "Step 2": [[exists("There is a heading 1", H1x), P("It has a color (a named color or hex code)", H1x, "color", named), P("Its font-size is in pixels", H1x, "font-size", h.isPx), P("It is text-align center", H1x, "text-align", center), P("It is text-transform uppercase", H1x, "text-transform", upper),
        K("It has a font-family that ends with a fallback family", function (c) { var e = H1x(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); })]],
      "Step 3": [
        [exists("A paragraph is right under the heading 1", introP), K("It uses a font-family that ends with a fallback family", function (c) { var e = introP(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); }), P("It has a color (a named color or hex code)", introP, "color", named), P("Its font-size is in pixels", introP, "font-size", h.isPx), K("It has a bold phrase and a line break inside", function (c) { var e = introP(c); return !!e && within(e, ["strong", "b"]).length >= 1 && within(e, ["br"]).length >= 1; })],
        [hrAfter("There is a horizontal line right under that paragraph (outside it)", introP)]
      ],
      "Step 4": [
        [exists("There is a heading 2", H2x), K("It has a font-family that ends with a fallback family", function (c) { var e = H2x(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return v.indexOf(",") > -1; }); }), P("It has a color (a named color or hex code)", H2x, "color", named), P("It is text-transform uppercase", H2x, "text-transform", upper)],
        [exists("A paragraph is right under the heading 2", AFTER(H2x, "p")), IN("A phrase in it is in italics", AFTER(H2x, "p"), ITAL), K("It has a span with its own style", function (c) { var p = AFTER(H2x, "p")(c); return !!p && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }), K("It has a font-family, a color and a background-color", function (c) { var p = AFTER(H2x, "p")(c); return !!p && h.vals(c, p, "font-family").length > 0 && has(c, p, "color", named) && has(c, p, "background-color", named); })],
        [exists("There is a heading 3 (the first one)", H3a), K("It has a font-family that ends with a fallback family", function (c) { var e = H3a(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return v.indexOf(",") > -1; }); }), P("It has a color (a named color or hex code)", H3a, "color", named), P("It is text-align center", H3a, "text-align", center)],
        [twoPsUnder("There are 2 paragraphs right under the heading 3", H3a), K("Both have a font-family and a color", function (c) { var a = psAfter(c, H3a(c)).slice(0, 2); return a.length >= 2 && a.every(function (x) { return h.vals(c, x, "font-family").length > 0 && has(c, x, "color", named); }); }), K("The first has an italic phrase, and the second has a bold phrase with a line break", function (c) { var a = psAfter(c, H3a(c)); return a.length >= 2 && within(a[0], ["em", "i"]).length >= 1 && within(a[1], ["strong", "b"]).length >= 1 && within(a[1], ["br"]).length >= 1; })],
        [hrAfter("There is a second horizontal line (outside any paragraph)", function (c) { var e = H3a(c); var a = e ? psAfter(c, e) : []; return a.length ? a[a.length - 1] : null; })]
      ],
      "Step 5": [
        [exists("There is a second heading 3", H3b), K("It has a font-family that ends with a fallback family", function (c) { var e = H3b(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return v.indexOf(",") > -1; }); }), P("It has a color (a named color or hex code)", H3b, "color", named), P("It has a background-color (a named color or hex code)", H3b, "background-color", named)],
        [twoPsUnder("There are 2 paragraphs right under the second heading 3", H3b), K("Both have a font-family and a color", function (c) { var a = psAfter(c, H3b(c)).slice(0, 2); return a.length >= 2 && a.every(function (x) { return h.vals(c, x, "font-family").length > 0 && has(c, x, "color", named); }); }), K("Each has a span with its own style (a different font, color, size, or background-color on a few words)", function (c) { var a = psAfter(c, H3b(c)).slice(0, 2); return a.length >= 2 && a.every(function (x) { return within(x, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }); })]
      ],
      "Step 6": [
        [CNT("There are at least 6 paragraphs in all", "p", 6), K("At least 3 different Google fonts are used in font-family styles", function (c) { var g = gNames(c), used = {}; ffList(c).forEach(function (v) { var f = ffFirst(v); if (g.indexOf(f) > -1) used[f] = 1; }); return Object.keys(used).length >= 3; }), K("Every font-family ends with a fallback family (serif, sans-serif, monospace, cursive, or fantasy)", function (c) { var l = ffList(c); return l.length >= 1 && l.every(function (v) { return v.indexOf(",") > -1 && /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); }), K("At least 6 tags use a font-family", function (c) { return allEls(c).filter(function (x) { return h.vals(c, x, "font-family").length > 0; }).length >= 6; })],
        old["Step 4"][3],
        [K("At least 2 italic words or phrases and at least 2 bold words or phrases", function (c) { return italN(c) >= 2 && boldN(c) >= 2; }), K("At least 3 line breaks", function (c) { return c.all("br").length >= 3; }), K("At least 3 span tags, each with its own style", function (c) { return spansN(c) >= 3; })],
        [K("At least 3 different text and background colors are used on the page", function (c) { return distinctColors(c).length >= 3; }), K("At least 2 different background-colors are used (the body counts)", function (c) { return bgs(c).length >= 2; }), K("At least 2 different font sizes in px", function (c) { return pxSizes(c) >= 2; })],
        FAM4
      ]
    } };
    lastStep("6.35", "Step 7", [[h.ALLGREEN], []]);
  })();

  /* ---- 3.7 (6.7): images and favicons ---- */
  (function () {
    var old = SC.LESSONS["6.7"].steps, H1x = T("h1"), introP = AFTER(H1x, "p");
    var imgN = function (i) { return function (c) { return c.all("img")[i] || null; }; };
    var okSrc = function (i) { return /^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || ""); };
    function picChecks(n, borderStyle) {
      var I = imgN(n);
      return [exists("There is picture number " + (n + 1), I), K("It has a src that is a web address (upload one or use a real address)", function (c) { var i = I(c); return !!i && okSrc(i); }), K("It has a real alt description", function (c) { var i = I(c); var a = i ? (i.attrs.alt || "").trim().toLowerCase() : ""; return a.length >= 3 && a !== "describe your image here"; }),
        K("It has a border (thickness, style, color)" + (borderStyle ? ", a " + borderStyle + " one" : ""), function (c) { var i = I(c); return !!i && has(c, i, "border", borderStyle ? h.bs(borderStyle) : h.BORDER); }), K("It has a width", function (c) { var i = I(c); return !!i && (has(c, i, "width") || i.attrs.width !== undefined); })];
    }
    SC.LESSONS["6.7"] = { inlineOnly: true, steps: {
      "Step 1": [old["Step 1"][0], old["Step 3"][0], old["Step 3"][1], h.TITLE, old["Step 1"][2]],
      "Step 2": [
        [exists("There is a heading 1", H1x), K("It uses your Google font in a font-family that ends with a fallback family", function (c) { return fontUsedOk(c); }), P("Its font-size is in pixels", H1x, "font-size", h.isPx), P("It is text-align center", H1x, "text-align", center), P("It is text-transform uppercase", H1x, "text-transform", upper), K("It has a border on one side only (like border-bottom)", function (c) { var e = H1x(c); return !!e && ["border-top", "border-bottom", "border-left", "border-right"].some(function (p) { return h.vals(c, e, p).length > 0; }); })],
        [exists("A paragraph is right under the heading 1", introP), K("It has a bold phrase and a line break inside", function (c) { var p = introP(c); return !!p && within(p, ["strong", "b"]).length >= 1 && within(p, ["br"]).length >= 1; }), K("It has a font-family that is a fallback family (like sans-serif)", function (c) { var e = introP(c); return !!e && h.vals(c, e, "font-family").some(function (v) { return /^(serif|sans-serif|monospace|cursive|fantasy)$/.test(ffLast(v)); }); })],
        [hrAfter("There is a horizontal line right under that paragraph (outside it)", introP)]
      ],
      "Step 3": [
        [K("There is a heading 2", function (c) { return c.count("h2") >= 1; }), K("It has a border on one side only (like border-bottom)", function (c) { var e = c.all("h2")[0]; return !!e && ["border-top", "border-bottom", "border-left", "border-right"].some(function (p) { return h.vals(c, e, p).length > 0; }); })],
        picChecks(0, "solid"), picChecks(1, "dashed")
      ],
      "Step 4": [
        [K("There is a heading 3", function (c) { return c.count("h3") >= 1; })],
        [K("A paragraph has an italic phrase and a span with its own style", function (c) { return c.all("p").some(function (p) { return within(p, ["em", "i"]).length >= 1 && within(p, ["span"]).some(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }); }); })],
        picChecks(2, "dotted"), picChecks(3, "dotted"), picChecks(4)
      ],
      "Step 5": [[K("Solid, dashed, and dotted borders are each used at least 2 times (your picture borders count)", old["Step 7"][2][0] ? function (c) { return old["Step 7"][2][0][1](c); } : function () { return true; }), K("At least 2 one-sided borders (like border-bottom)", function (c) { return old["Step 7"][3][0][1](c); }), K("At least 1 thing is text-transform uppercase", function (c) { return anyVal(c, "text-transform", function (v) { return v === "uppercase"; }); })]]
    } };
    lastStep("6.7", "Step 6", [[h.ALLGREEN], []]);
  })();


  /* ---- 3.8 (6.75): emojis and symbols ---- */
  (function () {
    var old = SC.LESSONS["6.75"].steps, H1x = T("h1"), introP = AFTER(H1x, "p");
    var nthH2 = nthTag("h2", 0), nthH2b = nthTag("h2", 1), nthH2c = nthTag("h2", 2), nthH3a = nthTag("h3", 0), nthH3b = nthTag("h3", 1);
    function h2Checks(pick, n) { return [exists("There is heading 2 number " + n, pick), K("It has an emoji or a symbol pasted in", function (c) { return hasAnyCh(c, pick(c)); }), P("It has a color", pick, "color", named), K("It has a border on one side only, a dashed one (like border-bottom: 4px dashed)", function (c) { var e = pick(c); return !!e && sideBorderOf(c, e) && ["border-top", "border-bottom", "border-left", "border-right"].some(function (p) { return h.vals(c, e, p).some(function (v) { return /dashed/.test(v); }); }); })]; }
    function h3Checks(pick, n, up) { var out = [exists("There is heading 3 number " + n, pick), K("It has a symbol or an emoji pasted in", function (c) { return hasAnyCh(c, pick(c)); })]; if (up) out.push(P("It is text-transform uppercase", pick, "text-transform", upper)); return out; }
    function realWords(label, pick, k) { return K(label, function (c) { var a = psAfter(c, pick(c)).slice(0, k); return a.length >= k && a.every(function (x) { return CH.words(chOf(c, x)) >= 4; }); }); }
    var imgN = function (i) { return function (c) { return imgs675(c)[i] || null; }; };
    function pic(n, st) { var I = imgN(n); return [exists("There is picture number " + n, function (c) { return imgN(n - 1)(c); }), K("It has a src that is a web address", function (c) { var i = imgN(n - 1)(c); return !!i && (/^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || "")); }), K("It has a real alt description", function (c) { var i = imgN(n - 1)(c); var a = i ? (i.attrs.alt || "").trim().toLowerCase() : ""; return a.length >= 3 && a !== "describe your image here"; }), K("It has a width in percent", function (c) { var i = imgN(n - 1)(c); return !!i && h.vals(c, i, "width").some(function (v) { return /^\d+(\.\d+)?%$/.test(v); }); }), K("It has a " + st + " border", function (c) { var i = imgN(n - 1)(c); return !!i && has(c, i, "border", h.bs(st)); })]; }
    SC.LESSONS["6.75"] = { inlineOnly: true, steps: {
      "Step 1": [old["Step 1"][0], old["Step 3"][0], old["Step 3"][1], h.TITLE, old["Step 1"][2]],
      "Step 2": [old["Step 4"][0]],
      "Step 3": [old["Step 4"][1].concat([K("It has a bold phrase and a line break inside", function (c) { var p = introP(c); return !!p && within(p, ["strong", "b"]).length >= 1 && within(p, ["br"]).length >= 1; })]),
        [hrAfter("There is a horizontal line right under that paragraph (outside it)", introP)]],
      "Step 4": [h2Checks(nthH2, 1), h3Checks(nthH3a, 1, true), [twoPsUnder("There are 2 paragraphs right under that heading 3", nthH3a), realWords("Each has 4 or more real words", nthH3a, 2)], pic(1, "solid")],
      "Step 5": [h2Checks(nthH2b, 2), h3Checks(nthH3b, 2, false), [twoPsUnder("There are 2 paragraphs right under that heading 3", nthH3b), realWords("Each has 4 or more real words", nthH3b, 2)], pic(2, "dotted")],
      "Step 6": [h2Checks(nthH2c, 3), [twoPsUnder("There are 2 paragraphs right under that heading 2", nthH2c), realWords("Each has 4 or more real words", nthH2c, 2)], old["Step 5"][2], old["Step 5"][3]],
      "Step 7": [old["Step 5"][4]],
      "Step 8": [old["Step 5"][0], old["Step 5"][1], old["Step 6"][1], old["Step 6"][2]]
    } };
    lastStep("6.75", "Step 9", [[h.ALLGREEN], []]);
  })();


  /* ---- 3.3 CHECKLIST DRAFT (6.23, teacher only): a skeleton walkthrough, then a checklist of counts and design limits that can sit anywhere on the page ---- */
  (function () {
    var old = SC.LESSONS["6.21"].steps;
    function px(c, e) { return pxNum(c, e); }
    function notBody(c) { return h.order(c).filter(function (x) { return x.tag !== "#text" && x.tag !== "body" && x.tag !== "html"; }); }
    function withProp(c, prop, test) { return notBody(c).filter(function (x) { return has(c, x, prop, test); }); }
    function distinctVals(c, prop, test) { var n = {}; withProp(c, prop, test).forEach(function (x) { h.vals(c, x, prop).forEach(function (v) { if (!test || test(v)) n[v] = 1; }); }); return Object.keys(n); }
    var align = function (v) { return v === "center" || v === "right"; };
    var transform = function (v) { return v === "uppercase" || v === "lowercase" || v === "capitalize"; };
    SC.LESSONS["6.23"] = { inlineOnly: true, steps: {
      "Step 1": [[SK[0]], [SK[1], SK[2]], [SK[3], SK[4]], [TITLE[0], TITLE[1]]],
      "Step 2": [
        [K("Exactly 1 heading 1", function (c) { return c.count("h1") === 1; })],
        [CNT("At least 3 heading 2s", "h2", 3)],
        [CNT("At least 3 heading 3s", "h3", 3)],
        [CNT("At least 5 paragraphs", "p", 5)]
      ],
      "Step 3": [
        [K("Text color used on at least 3 tags (not counting the body)", function (c) { return withProp(c, "color", named).length >= 3; })],
        [K("Background-color used on at least 2 tags (not counting the body)", function (c) { return withProp(c, "background-color", named).length >= 2; })],
        [K("Font-size in pixels used at least 4 times", function (c) { return withProp(c, "font-size", h.isPx).length >= 4; }),
         K("At least 3 different font sizes", function (c) { return distinctVals(c, "font-size", h.isPx).length >= 3; })],
        [K("Text-align (center or right) used at least 3 times", function (c) { return withProp(c, "text-align", align).length >= 3; })],
        [K("Text-transform used at least 3 times", function (c) { return withProp(c, "text-transform", transform).length >= 3; }),
         K("At least 2 different text-transform values", function (c) { return distinctVals(c, "text-transform", transform).length >= 2; })]
      ],
      "Step 4": [
        [K("The whole page uses 5 different colors or fewer, not counting span words (and at least 2)", function (c) { var seen = {}; notBody(c).concat(c.all("body")).forEach(function (x) { if (x.tag === "span") return; ["color", "background-color"].forEach(function (p) { h.vals(c, x, p).forEach(function (v) { if (named(v)) seen[v] = 1; }); }); }); var n = Object.keys(seen).length; return n >= 2 && n <= 5; })],
        [K("Wherever a tag has both a color and a background-color, they are different", function (c) { var ok = true; h.order(c).forEach(function (x) { if (x.tag !== "#text" && has(c, x, "color") && has(c, x, "background-color") && !bothDiffer(c, x)) ok = false; }); return ok; })],
        [K("The whole page uses 5 different font sizes or fewer", function (c) { var n = distinctVals(c, "font-size", h.isPx).length; return n >= 1 && n <= 5; })]
      ]
    } };
    SC.LESSONS["6.23"].steps["Step 5"] = [RAINBOW];
    lastStep("6.23", "Step 6", [[]]);
  })();

  /* ---- 3.4 CHECKLIST DRAFT (6.24, teacher only) ---- */
  (function () {
    function notBody(c) { return h.order(c).filter(function (x) { return x.tag !== "#text" && x.tag !== "body" && x.tag !== "html"; }); }
    function withProp(c, prop, test) { return notBody(c).filter(function (x) { return has(c, x, prop, test); }); }
    function distinctVals(c, prop, test) { var n = {}; withProp(c, prop, test).forEach(function (x) { h.vals(c, x, prop).forEach(function (v) { if (!test || test(v)) n[v] = 1; }); }); return Object.keys(n); }
    function styledSpans(c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }).length; }
    var anyAlign = function (v) { return !!v; };
    function families(c) { return [c.all("h3").length >= 1, withProp(c, "font-size", h.isPx).length >= 1, withProp(c, "text-align", anyAlign).length >= 1, withProp(c, "text-transform", anyAlign).length >= 1].filter(Boolean).length; }
    SC.LESSONS["6.24"] = { inlineOnly: true, steps: {
      "Step 1": [[SK[0]], [SK[1], SK[2]], [SK[3], SK[4]], [TITLE[0], TITLE[1]]],
      "Step 2": [
        [K("Exactly 1 heading 1", function (c) { return c.count("h1") === 1; })],
        [CNT("At least 2 heading 2s", "h2", 2)],
        [CNT("At least 4 paragraphs", "p", 4)],
        [K("Text color used on at least 2 tags (not counting the body)", function (c) { return withProp(c, "color", named).length >= 2; }),
         K("Background-color used on at least 1 tag (not counting the body)", function (c) { return withProp(c, "background-color", named).length >= 1; })]
      ],
      "Step 3": [
        [K("At least 3 bold words or phrases (strong or b)", function (c) { return boldN(c) >= 3; })],
        [K("At least 3 italic words or phrases (em or i)", function (c) { return italN(c) >= 3; })],
        [K("At least 3 line breaks (br)", function (c) { return c.all("br").length >= 3; })],
        [K("At least 3 horizontal lines (hr)", function (c) { return c.all("hr").length >= 3; })],
        [K("At least 3 span tags, each with its own style", function (c) { return styledSpans(c) >= 3; })]
      ],
      "Step 4": [
        [K("At least 3 of these 4 are on your page: heading 3, font-size in pixels, text-align, text-transform", function (c) { return families(c) >= 3; })]
      ],
      "Step 5": [
        [K("The whole page uses 5 different colors or fewer, not counting span words (and at least 2)", function (c) { var seen = {}; notBody(c).concat(c.all("body")).forEach(function (x) { if (x.tag === "span") return; ["color", "background-color"].forEach(function (p) { h.vals(c, x, p).forEach(function (v) { if (named(v)) seen[v] = 1; }); }); }); var n = Object.keys(seen).length; return n >= 2 && n <= 5; })],
        [K("Wherever a tag has both a color and a background-color, they are different", function (c) { var ok = true; h.order(c).forEach(function (x) { if (x.tag !== "#text" && has(c, x, "color") && has(c, x, "background-color") && !bothDiffer(c, x)) ok = false; }); return ok; })],
        [K("The whole page uses 5 different font sizes or fewer", function (c) { return distinctVals(c, "font-size", h.isPx).length <= 5; })]
      ]
    } };
    var ALL4 = [["BONUS: all 4 earlier-lesson items are on the page (heading 3, font-size in pixels, text-align, text-transform)", function (c) { return families(c) >= 4; }]];
    ALL4.bonus = 5;
    SC.LESSONS["6.24"].steps["Step 6"] = [ALL4];
    lastStep("6.24", "Step 7", [[]]);
  })();

  /* ---- THE CHECKLIST LESSONS: 3.3 Parts 1 to 3 and 3.4 to 3.10 are built from checklist-config.js (themes, new items, earlier items, design limits) ---- */
  (function () {
    var CL = root.U7_CL, HC = root.HTMLCheck; if (!CL || !HC || !HC.TESTS) return;
    var TE = HC.TESTS;
    function notBody(c) { return h.order(c).filter(function (x) { return x.tag !== "#text" && x.tag !== "body" && x.tag !== "html"; }); }
    function withProp(c, prop, test) { return notBody(c).filter(function (x) { return has(c, x, prop, test); }); }
    function distinctVals(c, prop, test) { var n = {}; withProp(c, prop, test).forEach(function (x) { h.vals(c, x, prop).forEach(function (v) { if (!test || test(v)) n[v] = 1; }); }); return Object.keys(n); }
    function styledSpans(c) { return c.all("span").filter(function (k) { return k.attrs.style !== undefined && /:/.test(k.attrs.style); }).length; }
    function distinctFonts(c) { var n = {}; c.inline.forEach(function (d) { if (d.prop === "font-family") { var f = String(d.value).replace(/;$/, "").split(",")[0].replace(/['"]/g, "").trim().toLowerCase(); if (f) n[f] = 1; } }); return Object.keys(n).length; }
    var transform = function (v) { return v === "uppercase" || v === "lowercase" || v === "capitalize"; };
    var CUSTOM = {
      pxSizes3: function (c) { return (TE["v-px"](c) || 0) >= 3 && distinctVals(c, "font-size", h.isPx).length >= 3; },
      tt3x2: function (c) { return withProp(c, "text-transform", transform).length >= 3 && distinctVals(c, "text-transform", transform).length >= 2; },
      spans3: function (c) { return styledSpans(c) >= 3; },
      spans1: function (c) { return styledSpans(c) >= 1; },
      fonts2: function (c) { return distinctFonts(c) >= 2; },
      imgLinked: function (c) { var im = c.all("img"); return im.length >= 1 && im.every(function (i) { return !!c.ancestor(i, ["a"]); }); }
    };
    function spec(c, s) {
      switch (s[0]) {
        case "count": return ((TE[s[1]] ? TE[s[1]](c) : 0) || 0) >= s[2];
        case "sum": return s[1].reduce(function (a, k) { return a + ((TE[k] ? TE[k](c) : 0) || 0); }, 0) >= s[2];
        case "distinct": return s[1].filter(function (k) { return (TE[k] ? TE[k](c) : 0) > 0; }).length >= s[2];
        case "any": return s[1].some(function (x) { return spec(c, x); });
        case "all": return s[1].every(function (x) { return spec(c, x); });
        case "custom": return !!CUSTOM[s[1]](c);
      }
      return false;
    }
    CL.test = spec;
    CL.lessons.forEach(function (l) {
      var B = CL.basics, pool = CL.poolFor(l), need = CL.need[l], st = {}, n = 1;
      st["Step " + n++] = [[SK[0]], [SK[1], SK[2]], [SK[3], SK[4]], [TITLE[0], TITLE[1]]];
      st["Step " + n++] = [
        [K("Exactly " + B.h1 + " heading 1", function (c) { return c.count("h1") === B.h1; })],
        [CNT("At least " + B.h2 + " heading 2s", "h2", B.h2)],
        [CNT("At least " + B.p + " paragraphs", "p", B.p)],
        [K("Text color used on at least " + B.colorTags + " tags (not counting the body)", function (c) { return withProp(c, "color", named).length >= B.colorTags; }),
         K("Background-color used on at least " + B.bgTags + " tag (not counting the body)", function (c) { return withProp(c, "background-color", named).length >= B.bgTags; })]
      ];
      st["Step " + n++] = CL.news[l].map(function (it) { return [K(it.label, function (c) { return spec(c, it.spec); })]; });
      if (pool.length) {
        st["Step " + n++] = [[K("At least " + need + " of these " + pool.length + " earlier items are on your page", function (c) { return pool.filter(function (f) { return spec(c, f.spec); }).length >= need; })]];
      }
      var fontLimit = !!CL.fontLimit[l];
      var limits = [
        [K("The whole page uses 5 different colors or fewer, not counting span words (and at least 2)", function (c) { var seen = {}; notBody(c).concat(c.all("body")).forEach(function (x) { if (x.tag === "span") return; ["color", "background-color"].forEach(function (p) { h.vals(c, x, p).forEach(function (v) { if (named(v)) seen[v] = 1; }); }); }); var k = Object.keys(seen).length; return k >= 2 && k <= 5; })],
        [K("Wherever a tag has both a color and a background-color, they are different", function (c) { var ok = true; h.order(c).forEach(function (x) { if (x.tag !== "#text" && has(c, x, "color") && has(c, x, "background-color") && !bothDiffer(c, x)) ok = false; }); return ok; })],
        [K("The whole page uses 5 different font sizes or fewer", function (c) { return distinctVals(c, "font-size", h.isPx).length <= 5; })]
      ];
      if (fontLimit) limits.push([K("The whole page uses 3 different fonts or fewer", function (c) { return distinctFonts(c) <= 3; })]);
      st["Step " + n++] = limits;
      var bonus;
      if (pool.length) {
        var bn = Math.min(pool.length, need + 3);
        bonus = [["BONUS: " + bn + " or more of the " + pool.length + " earlier items are on the page", function (c) { return pool.filter(function (f) { return spec(c, f.spec); }).length >= bn; }]];
        bonus.bonus = 5;
        st["Step " + n++] = [bonus];
      } else {
        st["Step " + n++] = [RAINBOW];
      }
      SC.LESSONS[l] = { inlineOnly: true, steps: st };
      lastStep(l, "Step " + n, [[]]);
    });
  })();

  /* The "Click Checks" box (every item in the Checks list is green) is gone from every lesson. Every box counts the same in the score,
     so taking it out spreads its share across the other boxes. The matching "Click Checks" bullet is gone from the Assignment tab too. */
  Object.keys(SC.LESSONS).forEach(function (l) {
    var st = SC.LESSONS[l].steps, ks = Object.keys(st), last = st[ks[ks.length - 1]];
    for (var i = last.length - 1; i >= 0; i--) if (last[i].length === 1 && last[i][0][0] === h.ALLGREEN[0]) last.splice(i, 1);
  });
})(typeof window !== "undefined" ? window : globalThis);
