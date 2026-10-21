/* Step checks for the Unit 3 lessons after 3.1:  6.2 (3.2), 6.20 (3.3), 6.3 (3.4), 6.4 (3.5), 6.5 (3.6), 6.6 (3.7), 6.7 (3.8).
   (see step-checks.js for how these are used). One list of checks per step bullet, in the same order as the bullets in answers-u3.js. */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H;
  var K = h.K, P = h.P, PX = h.PX, IN = h.IN, UNDER = h.UNDER, T = h.T, HW = h.HW, LAST = h.LAST, AFTER = h.AFTER, FOLLOW = h.FOLLOW, exists = h.exists, CNT = h.CNT;
  var SK = h.SKELETON, TITLE = h.TITLE, has = h.has, kids = h.kids, txt = h.txt, words = h.words, within = h.within, BOLD = h.BOLD, ITAL = h.ITAL;
  var named = h.isNamed, center = h.eq("center"), upper = h.eq("uppercase");

  /* ---------- shapes used over and over ---------- */
  function bodyBg(label) { return P(label || "The body has a background-color (a named color)", T("body"), "background-color", named); }
  function afterEl(pick, tag) { return AFTER(pick, tag); }
  function hrAfter(label, pick) { return K(label, function (c) { var e = pick(c), n = h.nextEl(e); return !!n && n.tag === "hr"; }); }
  function onlySide(side) { return function (c, el) { return has(c, el, "border-" + side) && !has(c, el, "border"); }; }
  function listItems(pick, n) { return K("The list has " + n + " list items", function (c) { var l = pick(c); return !!l && kids(l).filter(function (k) { return k.tag === "li"; }).length >= n; }); }
  function eachLi(label, pick, n, test) { return K(label, function (c) { var l = pick(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= n && li.slice(0, n).every(function (x) { return test(c, x); }); }); }
  var boldItalicItems = function (pick, n) { return eachLi("Each item has a bold name and an italic description", pick, n, function (c, li) { return within(li, BOLD).length >= 1 && within(li, ITAL).length >= 1; }); };
  var lastP = LAST("p");
  function bothDiffer(c, el) { var a = h.vals(c, el, "color")[0], b = h.vals(c, el, "background-color")[0]; return !!a && !!b && a !== b; }
  function lastStep(l, st, list) { list.comment = false; SC.LESSONS[l].steps[st] = list; }

  /* =============== 6.2  (3.2) The "Style" Attribute + Color: the ugliest website you can make =============== */
  var h2all = function (c) { return c.all("h2"); };
  var both = function (c, x) { return has(c, x, "color", named) && has(c, x, "background-color", named) && bothDiffer(c, x); };
  SC.LESSONS["6.2"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE],
    "Step 2": [[K("There is one heading 1", function (c) { return c.count("h1") === 1; }), CNT("There are at least 3 heading 2s", "h2", 3), CNT("There are at least 6 paragraphs", "p", 6)]],
    "Step 3": [
      [bodyBg("The body has a background-color (a named color)")],
      [P("The body has a text color (a named color)", T("body"), "color", named), K("The text color is different from the background-color", function (c) { var b = T("body")(c); return !!b && bothDiffer(c, b); })]
    ],
    "Step 4": [
      [exists("There is a heading 1", T("h1")), K("The heading 1 has a color and a background-color", function (c) { var e = T("h1")(c); return !!e && has(c, e, "color", named) && has(c, e, "background-color", named); }), K("Its two colors are different", function (c) { var e = T("h1")(c); return !!e && bothDiffer(c, e); })],
      [CNT("There are at least 3 heading 2s", "h2", 3), K("Every heading 2 has a color and a background-color", function (c) { var a = h2all(c); return a.length >= 3 && a.every(function (x) { return has(c, x, "color", named) && has(c, x, "background-color", named); }); }),
       K("On every heading 2 the two colors are different", function (c) { var a = h2all(c); return a.length >= 3 && a.every(function (x) { return bothDiffer(c, x); }); })]
    ],
    "Step 5": [
      [CNT("There are at least 6 paragraphs", "p", 6), K("Every paragraph has a color and a background-color", function (c) { var a = c.all("p"); return a.length >= 6 && a.every(function (x) { return has(c, x, "color", named) && has(c, x, "background-color", named); }); }),
       K("On every paragraph the two colors are different", function (c) { var a = c.all("p"); return a.length >= 6 && a.every(function (x) { return bothDiffer(c, x); }); })],
      [K("At least 2 background-colors each show up on 2 or more headings or paragraphs (a pattern)", function (c) { var n = {}; h2all(c).concat(c.all("p")).forEach(function (x) { var v = h.vals(c, x, "background-color")[0]; if (v) n[v] = (n[v] || 0) + 1; }); return Object.keys(n).filter(function (k) { return n[k] >= 2; }).length >= 2; })],
      [K("At least 4 different background colors are used on the page", function (c) { var n = {}; h.order(c).forEach(function (x) { var v = h.vals(c, x, "background-color")[0]; if (v && named(v)) n[v] = 1; }); return Object.keys(n).length >= 4; })],
      [K("Nothing is hidden: wherever color and background-color are both used, they are different colors", function (c) { var seen = false, ok = true; h.order(c).forEach(function (x) { if (has(c, x, "color") && has(c, x, "background-color")) { seen = true; if (!bothDiffer(c, x)) ok = false; } }); return seen && ok; })]
    ]
  } };
  lastStep("6.2", "Step 6", [[h.ALLGREEN], []]);


  /* =============== 6.20  (3.3) Font-Size, Text-Alignment, Letter-Case: the epic poster =============== */
  var H1 = T("h1"), H2a = T("h2", 0);
  var whenH = HW("h3", /when/i), whereH = HW("h3", /where/i), ticketsH = HW("h2", /ticket/i);
  function pUnder(pick) { return AFTER(pick, "p"); }
  SC.LESSONS["6.20"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg()]],
    "Step 2": [
      [exists("There is a heading 1", H1), P("It has a color (a named color)", H1, "color", named), P("Its font-size is in pixels", H1, "font-size", h.isPx), P("It is text-align center", H1, "text-align", center), P("It is text-transform uppercase", H1, "text-transform", upper)],
      [exists("There is a heading 2 for the tagline", H2a), UNDER("It comes after the heading 1", H1, H2a), P("It has a color (a named color)", H2a, "color", named),
       K("Its color is different from the heading 1's color", function (c) { var a = h.vals(c, H1(c), "color")[0], b = h.vals(c, H2a(c), "color")[0]; return !!a && !!b && a !== b; }),
       P("It is text-transform uppercase", H2a, "text-transform", upper), P("It is text-align center", H2a, "text-align", center), P("Its font-size is 24px", H2a, "font-size", h.px(24))]
    ],
    "Step 3": [
      [exists("There is a heading 3 that says When", whenH), P("The When heading has a color", whenH, "color", named), exists("A paragraph is under it", pUnder(whenH)),
       P("The paragraph has a color", pUnder(whenH), "color", named), P("Its font-size is 20px", pUnder(whenH), "font-size", h.px(20)), P("It has a background-color", pUnder(whenH), "background-color", named)],
      [exists("There is a heading 3 that says Where", whereH), P("The Where heading has a color", whereH, "color", named), exists("A paragraph is under it", pUnder(whereH)),
       P("The paragraph has a color", pUnder(whereH), "color", named), P("Its font-size is 20px", pUnder(whereH), "font-size", h.px(20))]
    ],
    "Step 4": [
      [exists("There is a second heading 2 that says Tickets", ticketsH), P("It has a color", ticketsH, "color", named), P("It is text-transform uppercase", ticketsH, "text-transform", upper), P("It is text-align center", ticketsH, "text-align", center)],
      [exists("A paragraph is under the Tickets heading", pUnder(ticketsH)), P("It has a color", pUnder(ticketsH), "color", named), P("Its font-size is 20px", pUnder(ticketsH), "font-size", h.px(20)),
       P("It is text-align center", pUnder(ticketsH), "text-align", center), P("It has a background-color", pUnder(ticketsH), "background-color", named)],
      [K("There is one more paragraph at the end", function (c) { var p = c.all("p"); return p.length >= 4 && p[p.length - 1] !== pUnder(ticketsH)(c); }), P("It has a color", lastP, "color", named), P("Its font-size is 16px", lastP, "font-size", h.px(16)), P("It is text-align center", lastP, "text-align", center)]
    ]
  } };
  lastStep("6.20", "Step 5", [[h.ALLGREEN], []]);

  /* =============== 6.3  (3.4) Editing Tags, Span Tag: the menu =============== */
  function sectionH(i) { return T("h2", i); }
  function dishes(i) { return FOLLOW(sectionH(i), "p", 2); }
  function dishChecks(i, nameLabel) {
    return [
      K("2 dish paragraphs are under " + nameLabel, function (c) { return dishes(i)(c).length >= 2; }),
      K("Each dish name is bold", function (c) { var d = dishes(i)(c); return d.length >= 2 && d.every(function (p) { return within(p, BOLD).length >= 1; }); }),
      K("Each price is inside a span with a color style", function (c) { var d = dishes(i)(c); return d.length >= 2 && d.every(function (p) { return within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }); }),
      K("Each dish has a line break", function (c) { var d = dishes(i)(c); return d.length >= 2 && d.every(function (p) { return within(p, ["br"]).length >= 1; }); }),
      K("Each description is in italics", function (c) { var d = dishes(i)(c); return d.length >= 2 && d.every(function (p) { return within(p, ITAL).length >= 1; }); })
    ];
  }
  function headStyle(i, nm) { return [exists("There is a heading 2 for " + nm, sectionH(i)), P("It is text-transform uppercase", sectionH(i), "text-transform", upper), P("It has a color", sectionH(i), "color", named)]; }
  function hrBefore(i, nm) { return K("A horizontal line comes before the " + nm + " heading", function (c) { var e = sectionH(i)(c), p = e ? e.parent : null; if (!p) return false; var k = kids(p), j = k.indexOf(e); for (var q = j - 1; q >= 0 && k[q].tag !== "h2"; q--) if (k[q].tag === "hr") return true; return false; }); }
  var chef = HW("h3", /chef/i), good = HW("h3", /good to know/i);
  SC.LESSONS["6.3"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)"), P("The body has a color (a named color)", T("body"), "color", named)]],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a color", T("h1"), "color", named), P("Its font-size is 44px", T("h1"), "font-size", h.px(44)), P("It is text-align center", T("h1"), "text-align", center), P("It has a background-color", T("h1"), "background-color", named)],
      [exists("A paragraph is under the heading 1", AFTER(T("h1"), "p")), IN("It has a line break inside it", AFTER(T("h1"), "p"), ["br"]), P("It is text-align center", AFTER(T("h1"), "p"), "text-align", center), P("Its font-size is 16px", AFTER(T("h1"), "p"), "font-size", h.px(16))],
      [K("A horizontal line is under that paragraph, outside it", function (c) { var p = AFTER(T("h1"), "p")(c), n = h.nextEl(p); return !!n && n.tag === "hr"; })]
    ],
    "Step 3": [
      headStyle(0, "Starters").concat(dishChecks(0, "Starters")),
      [hrBefore(1, "Main Dishes")].concat(headStyle(1, "Main Dishes")).concat(dishChecks(1, "Main Dishes")).concat([K("The first main dish has a background-color so it stands out", function (c) { var d = dishes(1)(c); return d.length >= 1 && has(c, d[0], "background-color", named); })]),
      [hrBefore(2, "Desserts")].concat(headStyle(2, "Desserts")).concat(dishChecks(2, "Desserts"))
    ],
    "Step 4": [
      [exists("There is a heading 3 that says Chef's Special", chef), P("It is text-align center", chef, "text-align", center), P("It has a color", chef, "color", named), exists("A paragraph is under it", AFTER(chef, "p")),
       P("The paragraph has a background-color", AFTER(chef, "p"), "background-color", named), P("Its font-size is 18px", AFTER(chef, "p"), "font-size", h.px(18))],
      [exists("There is a heading 3 that says Good to Know", good), P("It has a color", good, "color", named), exists("A paragraph is under it", AFTER(good, "p")), IN("The paragraph has a line break inside it", AFTER(good, "p"), ["br"]),
       P("Its font-size is 14px", AFTER(good, "p"), "font-size", h.px(14)), P("It has a background-color", AFTER(good, "p"), "background-color", named)]
    ]
  } };
  lastStep("6.3", "Step 5", [[h.ALLGREEN], []]);

  /* =============== 6.4  (3.5) Border: the wanted poster =============== */
  var wanted = T("h1"), crimes = afterEl(T("h1"), "p"), desc = HW("h2", /description/i), descP1 = afterEl(desc, "p"), descP2 = function (c) { return h.nextEl(descP1(c)); };
  var marks = HW("h3", /distinguishing/i), lastSeen = HW("h2", /last seen/i), hide = HW("h3", /hideout/i), reward = HW("h2", /reward/i);
  SC.LESSONS["6.4"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)")]],
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
  lastStep("6.4", "Step 6", [[h.ALLGREEN], []]);

  /* =============== 6.5  (3.6) Lists: the guide page =============== */
  var menu = afterEl(T("h1"), "ul");
  var tag5 = afterEl(menu, "p");
  var h2a = T("h2", 0), h2b = T("h2", 1), ol0 = T("ol", 0), ol1 = T("ol", 1), ul1 = T("ul", 1), ul2 = T("ul", 2);
  var h3AfterP = function (pickP) { return function (c) { var p = pickP(c), n = h.nextEl(p); return n && n.tag === "h3" ? n : null; }; };
  SC.LESSONS["6.5"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)")]],
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
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)")]],
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

  /* =============== 6.7  (3.8) Images: the photo brochure =============== */
  var imgs = function (c) { return c.all("img"); };
  var imgLinked = function (i) { return function (c) { var im = imgs(c)[i], a = im ? c.ancestor(im, ["a"]) : null; return !!a && /^https:\/\//i.test(a.attrs.href || "") && !/example\.com/i.test(a.attrs.href || ""); }; };
  var imgAlt = function (i) { return function (c) { var im = imgs(c)[i]; return !!im && /\S{3,}/.test(im.attrs.alt || ""); }; };
  var imgTab = function (i, newTab) { return function (c) { var im = imgs(c)[i], a = im ? c.ancestor(im, ["a"]) : null; if (!a) return false; return newTab ? a.attrs.target === "_blank" : (a.attrs.target === undefined || a.attrs.target === "_self"); }; };
  var IMG = function (i) { return function (c) { return imgs(c)[i] || null; }; };
  var imgInP = function (i) { return function (c) { var im = imgs(c)[i]; return !!im && h.inTag(c, im, ["p"]); }; };
  SC.LESSONS["6.7"] = { inlineOnly: true, steps: {
    "Step 1": [[], [K("At least 2 uploaded pictures are on your page", function (c) { return imgs(c).filter(function (im) { return /\/api\/code\?img=/.test(im.attrs.src || ""); }).length >= 2; })]],
    "Step 2": [SK.concat(TITLE), [bodyBg("The body has a background-color (a named color)")]],
    "Step 3": [
      [exists("There is a heading 1", T("h1")), P("It has a color", T("h1"), "color", named), P("It is text-align center", T("h1"), "text-align", center)],
      [exists("A bullet list is under the heading 1", hubUl0), listItems(hubUl0, 3), PX("Each item has a link starting with https:// that opens in the same tab", hubUl0, linksOk(3, false)), P("The list has list-style-type none", hubUl0, "list-style-type", h.eq("none")), P("It is text-align center", hubUl0, "text-align", center),
       eachLi("Each list item is display inline", hubUl0, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })],
      [exists("A paragraph comes after the menu", hubP0), P("It is text-align center", hubP0, "text-align", center), IN("A phrase is in italics", hubP0, ITAL), K("One word is colored with a span", function (c) { var p = hubP0(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }), IN("It has a line break", hubP0, ["br"])]
    ],
    "Step 4": [
      [exists("The first picture is on the page", IMG(0)), K("It is inside a paragraph", imgInP(0)), K("Its link goes to a real website (https://)", imgLinked(0)), K("Its alt is a real description", imgAlt(0)), K("The first link opens in a new tab", imgTab(0, true))],
      [P("The picture has width 320px", IMG(0), "width", h.px(320))]
    ],
    "Step 5": [
      [exists("The second picture is on the page", IMG(1)), K("It is inside a paragraph", imgInP(1)), K("Its link goes to a real website (https://)", imgLinked(1)), K("Its alt is a real description", imgAlt(1)), K("The link opens in the same tab", imgTab(1, false)), P("The picture has width 25%", IMG(1), "width", h.eq("25%"))],
      [exists("The third picture is on the page", IMG(2)), K("It is inside a paragraph", imgInP(2)), K("Its link goes to a real website (https://)", imgLinked(2)), K("Its alt is a real description", imgAlt(2)), K("The link opens in a new tab", imgTab(2, true)), P("The picture has width 45%", IMG(2), "width", h.eq("45%"))]
    ],
    "Step 6": [
      [exists("There is a heading 2", T("h2", 0)), P("It has a color", T("h2", 0), "color", named), exists("There is a bullet list (not the menu)", hubUl1), listItems(hubUl1, 3), P("It has list-style-type square", hubUl1, "list-style-type", h.eq("square")), P("It has a solid border", hubUl1, "border", h.bs("solid"))],
      [K("Each item has a text link starting with https://", function (c) { var l = hubUl1(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= 3 && li.slice(0, 3).every(function (x) { var a = linkIn(c, x); return !!a && /^https:\/\//i.test(a.attrs.href || "") && within(a, ["img"]).length === 0; }); }),
       niceLinks(hubUl1), italicNote(hubUl1)]
    ],
    "Step 7": [
      [K("The last paragraph has a line break", function (c) { var p = lastP(c); return !!p && within(p, ["br"]).length >= 1; }), P("It is text-align center", lastP, "text-align", center), P("Its font-size is 14px", lastP, "font-size", h.px(14))]
    ]
  } };
  lastStep("6.7", "Step 8", [[], [h.ALLGREEN], []]);
  SC.LESSONS["6.7"].steps["Step 1"].comment = false;
})(typeof window !== "undefined" ? window : globalThis);
