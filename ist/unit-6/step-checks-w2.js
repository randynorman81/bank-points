/* Step checks for the Unit 3 Part 2 WALKTHROUGHS ("7.1w" ...) and ASSIGNMENTS ("7.1a" ...): box model (3.12), colors (3.13), display (3.14), div (3.15), tables (3.16).
   Same format as step-checks-w.js (which defines the helpers in SC.W). Loaded after it (editor, grade page, server). */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS; if (!SC || !SC.W) return;
  var W = SC.W, h = SC.H, K = W.K, T = W.T, CNT = W.CNT, has = W.has, kids = W.kids, txt = W.txt, words = W.words, within = W.within, norm = W.norm, squash = W.squash, SAYS = W.SAYS, HAS = W.HAS, eq = W.eq, named = W.named, hex6 = W.hex6;
  var differ = W.differ, BODYCOLORS = W.BODYCOLORS, ONLY = W.ONLY, SKELETON1 = W.SKELETON1, SKELETON3 = W.SKELETON3, NOERR = W.NOERR, LAB = W.LAB, PN = W.PN, pxGE = W.pxGE, BORDERRE = W.BORDERRE, realLink = W.realLink, newTab = W.newTab, inBody = W.inBody;
  var isPx = h.isPx;

  /* ---------- box-model helpers: padding and margin, as one value, two values, or one side at a time ---------- */
  function nums(c, el, kind) { var out = []; h.vals(c, el, kind).forEach(function (v) { v.split(/\s+/).forEach(function (x) { if (/^\d+(\.\d+)?px$/.test(x)) out.push(parseFloat(x)); }); });
    ["top", "right", "bottom", "left"].forEach(function (s) { h.vals(c, el, kind + "-" + s).forEach(function (v) { if (/^\d+(\.\d+)?px$/.test(v)) out.push(parseFloat(v)); }); }); return out; }
  function atLeast(kind, n) { return function (c, el) { var a = nums(c, el, kind); return a.length > 0 && Math.min.apply(null, a) >= n; }; }
  var onlyPx = function (v) { return /^\d+(\.\d+)?px$/.test(v); };
  function twoValues(c, el, kind) { return h.vals(c, el, kind).some(function (v) { var x = v.split(/\s+/); return x.length === 2 && x.every(onlyPx); }); }
  var pickAll = function (tag) { return function (c) { return c.all(tag); }; };
  function EVERY(label, tag, min, test) { return K(label, function (c) { var a = c.all(tag); return a.length >= min && a.every(function (e) { return test(c, e); }); }); }
  var hasHex = function (prop) { return function (c, e) { return has(c, e, prop, hex6); }; };
  var BORDERFULL = function (c, e) { return h.vals(c, e, "border").some(function (v) { return BORDERRE.test(v) && named(h.borderColor(v)); }); };
  var kidTags = function (e) { return kids(e).map(function (k) { return k.tag; }); };

  /* =============== 3.12 Walkthrough ("7.1w"): Postcard Studio =============== */
  var CARDS = ["Greetings from Hawaii!", "Wish you were here.", "See you soon!", "Box total: 230 pixels wide."];
  LAB("7.1w", {
    "Step 1": [SKELETON1("Postcard Studio"), [SAYS("The heading 1 says exactly Postcard Studio", T("h1"), "Postcard Studio"), SAYS("Paragraph 1 says exactly " + CARDS[0], PN(0), CARDS[0]), SAYS("Paragraph 2 says exactly " + CARDS[1], PN(1), CARDS[1]), SAYS("Paragraph 3 says exactly " + CARDS[2], PN(2), CARDS[2]), SAYS("Paragraph 4 says exactly " + CARDS[3], PN(3), CARDS[3]), ONLY("The page has 1 heading 1 and 4 paragraphs", { h1: 1, p: 4 })]],
    "Step 2": [[HAS("Paragraph 1 has padding: 20px", PN(0), "padding", eq("20px")), HAS("Paragraph 1 has background-color: lightyellow", PN(0), "background-color", eq("lightyellow"))]],
    "Step 3": [[HAS("Paragraph 2 has margin: 30px", PN(1), "margin", eq("30px")), HAS("Paragraph 2 has background-color: lightpink", PN(1), "background-color", eq("lightpink"))]],
    "Step 4": [[HAS("Paragraph 3 has border: 4px solid navy", PN(2), "border", function (v) { return W.norm(v).split(" ").sort().join(" ") === "4px navy solid"; }), HAS("Paragraph 3 has padding-left: 40px", PN(2), "padding-left", eq("40px")), HAS("Paragraph 3 has padding-top: 10px", PN(2), "padding-top", eq("10px"))]],
    "Step 5": [[HAS("Paragraph 4 has width: 200px", PN(3), "width", eq("200px")), HAS("Paragraph 4 has padding: 10px", PN(3), "padding", eq("10px")), HAS("Paragraph 4 has border: 5px solid black", PN(3), "border", function (v) { return W.norm(v).split(" ").sort().join(" ") === "5px black solid"; })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.12 Assignment ("7.1a"): Etsy shop cards =============== */
  LAB("7.1a", {
    "Step 1": SKELETON3("Etsy Shop Cards"),
    "Step 2": [[SAYS("The heading 1 says exactly Etsy Shop Cards", T("h1"), "Etsy Shop Cards"), K("There are at least 3 shop cards (paragraphs), each with at least 3 words", function (c) { var a = c.all("p"); return a.length >= 3 && a.every(function (p) { return words(c, p) >= 3; }); })]],
    "Step 3": [[EVERY("Every card has padding of at least 10px", "p", 3, atLeast("padding", 10))],
               [EVERY("Every card has a margin of at least 10px", "p", 3, atLeast("margin", 10))],
               [EVERY("Every card has a border on all four sides (thickness, style, named color)", "p", 3, BORDERFULL), EVERY("Every card has its own background-color", "p", 3, function (c, e) { return has(c, e, "background-color", named); })],
               [K("One card has two-value padding (like padding: 10px 30px)", function (c) { return c.all("p").some(function (p) { return twoValues(c, p, "padding"); }); }), K("One card has padding on a single side (like padding-left)", function (c) { return c.all("p").some(function (p) { return ["top", "right", "bottom", "left"].some(function (s) { return h.vals(c, p, "padding-" + s).length > 0; }); }); })],
               [K("One card has a fixed width of 150px to 400px", function (c) { return c.all("p").some(function (p) { return has(c, p, "width", W.pxBetween(150, 400)); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The body has a background-color", T("body"), "background-color", named)]],
    "Step 4": [[NOERR], []]
  });

  /* =============== 3.13 Walkthrough ("7.2w"): Brand Colors =============== */
  var COL = ["Tomato red", "Navy blue", "Pure red", "Pure green", "Pure blue"];
  var BLACK = hex6;
  LAB("7.2w", {
    "Step 1": [SKELETON1("Brand Colors"), [SAYS("The heading 1 says exactly Brand Colors", T("h1"), "Brand Colors")].concat(COL.map(function (t, i) { return SAYS("Paragraph " + (i + 1) + " says exactly " + t, PN(i), t); }), [ONLY("The page has 1 heading 1 and 5 paragraphs", { h1: 1, p: 5 })])],
    "Step 2": [[HAS("Paragraph 1 has the named color: color: tomato", PN(0), "color", eq("tomato"))]],
    "Step 3": [[HAS("Paragraph 2 has the hex color: color: #000080", PN(1), "color", eq("#000080"))]],
    "Step 4": [[HAS("Paragraph 3 has color: #FF0000", PN(2), "color", eq("#ff0000")), HAS("Paragraph 3 has background-color: #000000", PN(2), "background-color", eq("#000000"))],
               [HAS("Paragraph 4 has color: #00FF00", PN(3), "color", eq("#00ff00")), HAS("Paragraph 4 has background-color: #000000", PN(3), "background-color", eq("#000000"))],
               [HAS("Paragraph 5 has color: #0000FF", PN(4), "color", eq("#0000ff")), HAS("Paragraph 5 has background-color: #000000", PN(4), "background-color", eq("#000000"))]],
    "Step 5": [[HAS("The body has background-color: #F0F9FF", T("body"), "background-color", eq("#f0f9ff"))]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.13 Assignment ("7.2a"): Duolingo brand page =============== */
  function hexSet(c, tag) { var s = {}; c.all(tag).forEach(function (e) { h.vals(c, e, "color").forEach(function (v) { if (hex6(v)) s[v] = 1; }); }); return Object.keys(s); }
  LAB("7.2a", {
    "Step 1": SKELETON3("Duolingo Colors"),
    "Step 2": [[SAYS("The heading 1 says exactly Duolingo Colors", T("h1"), "Duolingo Colors"), K("There are at least 4 paragraphs, each with at least 3 words", function (c) { var a = c.all("p"); return a.length >= 4 && a.every(function (p) { return words(c, p) >= 3; }); })]],
    "Step 3": [[HAS("The body has a hex background-color", T("body"), "background-color", hex6), HAS("The body has a hex text color", T("body"), "color", hex6), K("The body's text color and background-color are different", function (c) { var b = c.all("body")[0]; return !!b && differ(c, b); })],
               [HAS("The heading 1 has a hex text color", T("h1"), "color", hex6), HAS("The heading 1 has a hex background-color", T("h1"), "background-color", hex6), K("Its two colors are different", function (c) { var e = c.all("h1")[0]; return !!e && differ(c, e); })],
               [K("At least 4 paragraphs have their own hex text color", function (c) { return c.all("p").filter(function (p) { return has(c, p, "color", hex6); }).length >= 4; }), K("The paragraphs use at least 3 different hex text colors", function (c) { return hexSet(c, "p").length >= 3; })],
               [K("At least 2 paragraphs also have a hex background-color that is different from their text color", function (c) { return c.all("p").filter(function (p) { return has(c, p, "background-color", hex6) && has(c, p, "color", hex6) && differ(c, p); }).length >= 2; })],
               [K("At least one tag uses a NAMED color (like tomato) so you can compare it with the hex codes", function (c) { return h.order(c).some(function (e) { return ["color", "background-color"].some(function (p) { return h.vals(c, e, p).some(function (v) { return /^[a-z]+$/.test(v) && named(v); }); }); }); })]],
    "Step 4": [[NOERR], []]
  });

  /* =============== 3.14 Walkthrough ("7.3w"): Snack Bar =============== */
  var NAV = ["Home", "Menu", "Contact"];
  var divN = function (n) { return function (c) { return c.all("div")[n] || null; }; };
  var NAVSTYLE = function (n) { return [HAS("Div " + (n + 1) + " has display: inline-block", divN(n), "display", eq("inline-block")), HAS("Div " + (n + 1) + " has padding: 10px", divN(n), "padding", eq("10px")), HAS("Div " + (n + 1) + " has background-color: gold", divN(n), "background-color", eq("gold"))]; };
  LAB("7.3w", {
    "Step 1": [SKELETON1("Snack Bar"), [SAYS("The heading 1 says exactly Snack Bar", T("h1"), "Snack Bar")]],
    "Step 2": [NAV.map(function (t, i) { return SAYS("Div " + (i + 1) + " says exactly " + t, divN(i), t); }).concat([ONLY("The page has exactly 3 divs", { div: 3 }), K("The three divs are inside the body, right after the heading 1", function (c) { var b = c.all("body")[0]; return !!b && kidTags(b).slice(0, 4).join() === "h1,div,div,div"; })])],
    "Step 3": [NAVSTYLE(0), NAVSTYLE(1), NAVSTYLE(2)],
    "Step 4": [[SAYS("The paragraph says exactly Our special today is soup.", PN(0), "Our special today is soup."), K("The word soup is inside a span with color: red", function (c) { var p = PN(0)(c), s = p && within(p, ["span"]); return !!s && s.length === 1 && norm(txt(c, s[0])) === "soup" && has(c, s[0], "color", eq("red")); })]],
    "Step 5": [[K("There is a link to https://www.nasa.gov that opens in a new tab and says Visit NASA", function (c) { var a = c.all("a")[0]; return !!a && a.attrs.href === "https://www.nasa.gov" && newTab(a) && norm(txt(c, a)) === "Visit NASA"; })],
               [HAS("The link has display: block", T("a"), "display", eq("block")), HAS("The link has padding: 10px", T("a"), "padding", eq("10px")), HAS("The link has background-color: navy", T("a"), "background-color", eq("navy")), HAS("The link has color: white", T("a"), "color", eq("white"))]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.14 Assignment ("7.3a"): an Instagram menu =============== */
  LAB("7.3a", {
    "Step 1": SKELETON3("Instagram Menu"),
    "Step 2": [[SAYS("The heading 1 says exactly Instagram Menu", T("h1"), "Instagram Menu"), K("There are at least 4 divs (the menu items), each with at least one word", function (c) { var a = c.all("div"); return a.length >= 4 && a.every(function (d) { return words(c, d) >= 1; }); })],
               [K("There is a paragraph of at least 5 words with a span inside it", function (c) { return c.all("p").some(function (p) { return words(c, p) >= 5 && within(p, ["span"]).length >= 1; }); }), K("There is a link to a real https:// address that opens in a new tab", function (c) { return c.all("a").some(function (a) { return realLink(a) && newTab(a) && words(c, a) >= 1; }); })]],
    "Step 3": [[EVERY("Every menu div has display: inline-block, so the menu sits in a row", "div", 4, function (c, e) { return has(c, e, "display", eq("inline-block")); }), EVERY("Every menu div has padding of at least 8px and a background-color", "div", 4, function (c, e) { return atLeast("padding", 8)(c, e) && has(c, e, "background-color", named); })],
               [K("The span has its own text color (color) so only its words change", function (c) { return c.all("span").some(function (s) { return words(c, s) >= 1 && has(c, s, "color", named); }); })],
               [K("The link is a button: display block, padding of at least 8px, a background-color and a text color", function (c) { return c.all("a").some(function (a) { return realLink(a) && has(c, a, "display", eq("block")) && atLeast("padding", 8)(c, a) && has(c, a, "background-color", named) && has(c, a, "color", named); }); })],
               [K("Another paragraph or span uses display: inline", function (c) { return h.order(c).some(function (e) { return e.tag !== "div" && e.tag !== "a" && has(c, e, "display", eq("inline")); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The body has a background-color", T("body"), "background-color", named)]],
    "Step 4": [[NOERR], []]
  });

  /* =============== 3.15 Walkthrough ("7.4w"): Profile Page =============== */
  var colStyle = function (n, w) { return [K("Div " + n + " has display: inline-block and vertical-align: top", function (c) { return 0; })]; };
  var DV = function (n) { return function (c) { return c.all("div")[n] || null; }; };
  function COLUMN(i, w, head, para) { return [HAS("Div " + (i + 1) + " has display: inline-block", DV(i), "display", eq("inline-block")), HAS("Div " + (i + 1) + " has vertical-align: top", DV(i), "vertical-align", eq("top")), HAS("Div " + (i + 1) + " has width: " + w, DV(i), "width", eq(w))]; }
  LAB("7.4w", {
    "Step 1": [SKELETON1("Profile Page"), [SAYS("The heading 1 says exactly Profile Page", T("h1"), "Profile Page")]],
    "Step 2": [[K("The first div holds a heading 2 and a paragraph (they are inside the div)", function (c) { var d = DV(0)(c); return !!d && kidTags(d).join() === "h2,p"; }), SAYS("The heading 2 says exactly Sam Rivera", T("h2"), "Sam Rivera"), SAYS("The paragraph says exactly Loves music and art.", PN(0), "Loves music and art.")],
               [HAS("The div has background-color: navy", DV(0), "background-color", eq("navy")), HAS("The div has color: white", DV(0), "color", eq("white")), HAS("The div has padding: 14px", DV(0), "padding", eq("14px")), K("The heading and paragraph have no color of their own: they take white from the div", function (c) { var d = DV(0)(c); return !!d && kids(d).every(function (k) { return h.vals(c, k, "color").length === 0; }); })]],
    "Step 3": [[K("The second div is empty (nothing inside it)", function (c) { var d = DV(1)(c); return !!d && d.children.every(function (k) { return k.tag === "#text" && !String(k.text).trim(); }) && h.nextEl(DV(0)(c)) === d; }), HAS("The empty div has height: 20px", DV(1), "height", eq("20px")), HAS("The empty div has background-color: orange", DV(1), "background-color", eq("orange"))]],
    "Step 4": [COLUMN(2, "30%"), [K("Div 3 holds a heading 3 that says Interests and a paragraph that says Music and art.", function (c) { var d = DV(2)(c), k = d ? kids(d) : []; return k.length === 2 && k[0].tag === "h3" && norm(txt(c, k[0])) === "Interests" && k[1].tag === "p" && norm(txt(c, k[1])) === "Music and art."; })],
               COLUMN(3, "60%"), [K("Div 4 holds a heading 3 that says Posts and a paragraph that says First post!", function (c) { var d = DV(3)(c), k = d ? kids(d) : []; return k.length === 2 && k[0].tag === "h3" && norm(txt(c, k[0])) === "Posts" && k[1].tag === "p" && norm(txt(c, k[1])) === "First post!"; })],
               [K("The two column widths add up to 98% or less", function (c) { var a = parseFloat(h.vals(c, DV(2)(c), "width")[0]), b = parseFloat(h.vals(c, DV(3)(c), "width")[0]); return a + b <= 98; })]],
    "Step 5": [[K("An hr tag comes right after the second column", function (c) { var n = h.nextEl(DV(3)(c)); return !!n && n.tag === "hr"; })],
               COLUMN(4, "45%").concat([SAYS("Div 5 says exactly Photos", DV(4), "Photos")]), COLUMN(5, "45%").concat([SAYS("Div 6 says exactly Friends", DV(5), "Friends")]),
               [K("The page has exactly 6 divs and 1 hr", function (c) { return c.count("div") === 6 && c.count("hr") === 1; })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.15 Assignment ("7.4a"): an Amazon products page =============== */
  var col = function (c, e) { return has(c, e, "display", eq("inline-block")) && has(c, e, "vertical-align", eq("top")) && has(c, e, "width", function (v) { return /^\d+(\.\d+)?%$/.test(v) && parseFloat(v) <= 49; }); };
  var colDivs = function (c) { return c.all("div").filter(function (d) { return col(c, d); }); };
  LAB("7.4a", {
    "Step 1": SKELETON3("Amazon Products"),
    "Step 2": [[SAYS("The heading 1 says exactly Amazon Products", T("h1"), "Amazon Products")],
               [K("There is a banner div that holds a heading 2 and a paragraph (inside the div)", function (c) { return c.all("div").some(function (d) { var k = kidTags(d); return k.indexOf("h2") > -1 && k.indexOf("p") > -1; }); })]],
    "Step 3": [[K("The banner div has a background-color, a text color and padding of at least 10px", function (c) { return c.all("div").some(function (d) { var k = kidTags(d); return k.indexOf("h2") > -1 && k.indexOf("p") > -1 && has(c, d, "background-color", named) && has(c, d, "color", named) && atLeast("padding", 10)(c, d); }); })],
               [K("There is an empty div with a height in px and a background-color (a color bar)", function (c) { return c.all("div").some(function (d) { return d.children.every(function (k) { return k.tag === "#text" && !String(k.text).trim(); }) && has(c, d, "height", isPx) && has(c, d, "background-color", named); }); })],
               [K("There are at least 4 column divs: inline-block, vertical-align top, and a width in % of 49% or less", function (c) { return colDivs(c).length >= 4; }), K("Every column div has padding and a border", function (c) { var a = colDivs(c); return a.length >= 4 && a.every(function (d) { return atLeast("padding", 1)(c, d) && BORDERFULL(c, d); }); })],
               [K("An hr tag separates the first row of columns from the second", function (c) { return c.all("hr").some(function (r) { var p = r.parent, k = kids(p), i = k.indexOf(r); return i > 1 && col(c, k[i - 1]) && i + 1 < k.length && col(c, k[i + 1]); }); }), K("Each row of two columns adds up to 98% or less", function (c) { var a = colDivs(c); return a.length >= 4 && parseFloat(h.vals(c, a[0], "width")[0]) + parseFloat(h.vals(c, a[1], "width")[0]) <= 98 && parseFloat(h.vals(c, a[2], "width")[0]) + parseFloat(h.vals(c, a[3], "width")[0]) <= 98; })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The body has a background-color", T("body"), "background-color", named)]],
    "Step 4": [[NOERR], []]
  });

  /* =============== 3.16 Walkthrough ("7.5w"): Leaderboard =============== */
  var ROWS = [["Rank", "Player", "Points", "Profile"], ["1", "Ana", "120", "View"], ["2", "Bo", "95", "View"], ["3", "Cy", "80", "View"]];
  var TR = function (n) { return function (c) { return c.all("tr")[n] || null; }; };
  var cellsOf = function (r) { return r ? kids(r) : []; };
  function ROWSAY(n) { return K("Row " + (n + 1) + " says exactly " + ROWS[n].join(", "), function (c) { var r = TR(n)(c), cl = cellsOf(r); return !!r && cl.length === 4 && cl.every(function (x, i) { return norm(txt(c, x)) === ROWS[n][i]; }); }); }
  var tableDirect = K("Only tr tags are directly inside the table, and only th or td cells directly inside each row", function (c) { var t = c.all("table")[0]; return !!t && kids(t).length > 0 && kids(t).every(function (r) { return r.tag === "tr" && kids(r).length > 0 && kids(r).every(function (x) { return x.tag === "th" || x.tag === "td"; }); }); });
  var headerCell = function (c) { var r = TR(0)(c); return cellsOf(r); };
  LAB("7.5w", {
    "Step 1": [SKELETON1("Leaderboard"), [SAYS("The heading 1 says exactly Leaderboard", T("h1"), "Leaderboard")]],
    "Step 2": [[K("A table is right under the heading 1, and its first row has 4 header cells (th)", function (c) { var t = c.all("table")[0], n = h.nextEl(c.all("h1")[0]); return !!t && n === t && cellsOf(TR(0)(c)).length === 4 && cellsOf(TR(0)(c)).every(function (x) { return x.tag === "th"; }); }), ROWSAY(0), tableDirect]],
    "Step 3": [[K("There are 3 more rows (4 rows in all) and every row has exactly 4 cells", function (c) { var r = c.all("tr"); return r.length === 4 && r.every(function (x) { return cellsOf(x).length === 4; }); }), K("The cells in the data rows are td tags", function (c) { return c.all("tr").length > 1 && c.all("tr").slice(1).every(function (r) { return cellsOf(r).every(function (x) { return x.tag === "td"; }); }); })],
               [ROWSAY(1)], [ROWSAY(2)], [ROWSAY(3)]],
    "Step 4": [[HAS("The table has border: 3px solid navy", T("table"), "border", function (v) { return W.norm(v).split(" ").sort().join(" ") === "3px navy solid"; }), HAS("The table has width: 80%", T("table"), "width", eq("80%")), HAS("The table has text-align: center", T("table"), "text-align", eq("center"))]],
    "Step 5": [[K("All 4 header cells have background-color: #1B2A4A and color: white", function (c) { var a = headerCell(c); return a.length === 4 && a.every(function (x) { return has(c, x, "background-color", eq("#1b2a4a")) && has(c, x, "color", eq("white")); }); })]],
    "Step 6": [[K("The last cell of each data row has a link to https://www.espn.com that opens in a new tab", function (c) { var r = c.all("tr").slice(1); return r.length === 3 && r.every(function (x) { var cl = cellsOf(x), a = cl[3] && within(cl[3], ["a"])[0]; return !!a && a.attrs.href === "https://www.espn.com" && newTab(a) && norm(txt(c, a)) === "View"; }); })]],
    "Step 7": [[NOERR], []]
  });

  /* =============== 3.16 Assignment ("7.5a"): an ESPN scoreboard =============== */
  LAB("7.5a", {
    "Step 1": SKELETON3("ESPN Scoreboard"),
    "Step 2": [[SAYS("The heading 1 says exactly ESPN Scoreboard", T("h1"), "ESPN Scoreboard"), K("There is a table with a header row of at least 3 header cells (th)", function (c) { var r = TR(0)(c), cl = cellsOf(r); return cl.length >= 3 && cl.every(function (x) { return x.tag === "th"; }); })],
               [K("There are at least 4 data rows (td cells), and every row has the same number of cells as the header row", function (c) { var r = c.all("tr"), n = cellsOf(r[0]).length; return r.length >= 5 && r.every(function (x) { return cellsOf(x).length === n; }) && r.slice(1).every(function (x) { return cellsOf(x).every(function (y) { return y.tag === "td"; }); }); }), tableDirect,
                K("Every cell has something in it (at least one word or number)", function (c) { return c.all("tr").length > 0 && c.all("tr").every(function (r) { return cellsOf(r).every(function (x) { return words(c, x) >= 1; }); }); })]],
    "Step 3": [[K("Every header cell has a background-color and a different text color", function (c) { var a = headerCell(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "background-color", named) && has(c, x, "color", named) && differ(c, x); }); })],
               [K("The table has a border (thickness, style, named color), a width in %, and centered text", function (c) { var t = c.all("table")[0]; return !!t && BORDERFULL(c, t) && has(c, t, "width", function (v) { return /^\d+(\.\d+)?%$/.test(v); }) && has(c, t, "text-align", eq("center")); })],
               [K("One cell has a link to a real https:// address that opens in a new tab", function (c) { return c.all("td").some(function (x) { return within(x, ["a"]).some(function (a) { return realLink(a) && newTab(a) && words(c, a) >= 1; }); }); }), K("One cell has bold words (a strong tag)", function (c) { return c.all("td").some(function (x) { return within(x, ["strong"]).length >= 1; }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center"))].concat(BODYCOLORS)],
    "Step 4": [[NOERR], []]
  });
})(typeof window !== "undefined" ? window : globalThis);
