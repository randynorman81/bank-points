/* Step checks for lessons 6.4, 6.5, 6.6, and 6.7 (see step-checks.js for how these are used). One list of checks per step bullet, in order. */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H;
  var K = h.K, P = h.P, PX = h.PX, IN = h.IN, UNDER = h.UNDER, T = h.T, HW = h.HW, LAST = h.LAST, AFTER = h.AFTER, FOLLOW = h.FOLLOW, exists = h.exists;
  var SK = h.SKELETON, TITLE = h.TITLE, has = h.has, kids = h.kids, txt = h.txt, within = h.within, BOLD = h.BOLD, ITAL = h.ITAL;
  var named = h.isNamed, center = h.eq("center"), upper = h.eq("uppercase");

  /* a few shapes used over and over */
  function bodyBg(label) { return P(label || "The body has a background-color (a named color)", T("body"), "background-color", named); }
  function afterEl(pick, tag) { return AFTER(pick, tag); }
  function hrAfter(label, pick) { return K(label, function (c) { var e = pick(c), n = h.nextEl(e); return !!n && n.tag === "hr"; }); }
  function onlySide(side) { return function (c, el) { return has(c, el, "border-" + side) && !has(c, el, "border"); }; }
  function listItems(pick, n) { return K("The list has " + n + " list items", function (c) { var l = pick(c); return !!l && kids(l).filter(function (k) { return k.tag === "li"; }).length >= n; }); }
  function eachLi(label, pick, n, test) { return K(label, function (c) { var l = pick(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= n && li.slice(0, n).every(function (x) { return test(c, x); }); }); }
  var boldItalicItems = function (pick, n) { return eachLi("Each item has a bold name and an italic description", pick, n, function (c, li) { return within(li, BOLD).length >= 1 && within(li, ITAL).length >= 1; }); };
  var lastP = LAST("p");

  /* ---------------- 6.4  the wanted poster (borders) ---------------- */
  var wanted = T("h1"), crimes = afterEl(T("h1"), "p"), desc = HW("h2", /description/i), descP1 = afterEl(desc, "p"), descP2 = function (c) { return h.nextEl(descP1(c)); };
  var marks = HW("h3", /distinguishing/i), lastSeen = HW("h2", /last seen/i), hide = HW("h3", /hideout/i), reward = HW("h2", /reward/i);
  SC.LESSONS["6.4"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)")]],
    "Step 2": [
      [exists("There is a heading 1", wanted), K("It says WANTED", function (c) { var e = wanted(c); return !!e && /wanted/i.test(txt(c, e)); }), P("It has a serif font-family", wanted, "font-family", h.serif), P("It has a color", wanted, "color", named), P("It has a background-color", wanted, "background-color", named),
       P("Its font-size is 56px", wanted, "font-size", h.px(56)), P("It is text-align center", wanted, "text-align", center), P("It is text-transform uppercase", wanted, "text-transform", upper), P("It has a solid border", wanted, "border", h.bs("solid"))],
      [exists("A paragraph is under the heading 1", crimes), P("It has a sans-serif font-family", crimes, "font-family", h.sans), P("Its font-size is 20px", crimes, "font-size", h.px(20)),
       K("Two phrases are colored with spans", function (c) { var p = crimes(c); return !!p && within(p, ["span"]).filter(function (s) { return has(c, s, "color"); }).length >= 2; }), IN("One phrase is bold", crimes, BOLD)],
      [hrAfter("A horizontal line is under the paragraph, outside it", crimes)]
    ],
    "Step 3": [
      [exists("There is a heading 2 that says Description", desc), P("It has a color", desc, "color", named), P("Its font-size is 30px", desc, "font-size", h.px(30)), PX("It has a border on the bottom only", desc, onlySide("bottom"))],
      [exists("A paragraph is under the Description heading", descP1), P("It has a monospace font-family", descP1, "font-family", h.mono), IN("It has a bold word", descP1, BOLD), IN("It has an italic word", descP1, ITAL), IN("It has 2 line breaks", descP1, ["br"], 2)],
      [K("A second paragraph follows it", function (c) { var p = descP2(c); return !!p && p.tag === "p"; }), P("It has a sans-serif font-family", descP2, "font-family", h.sans), P("It has a dashed border", descP2, "border", h.bs("dashed")),
       IN("It has an italic word", descP2, ITAL), IN("It has a bold word", descP2, BOLD), IN("It has a line break", descP2, ["br"])]
    ],
    "Step 4": [
      [exists("There is a heading 3 that says Distinguishing Marks", marks), P("It is text-align center", marks, "text-align", center), P("It has a color", marks, "color", named), exists("A paragraph is under it", afterEl(marks, "p")),
       P("The paragraph has a monospace font-family", afterEl(marks, "p"), "font-family", h.mono), P("It has a dotted border", afterEl(marks, "p"), "border", h.bs("dotted"))],
      [K("A horizontal line comes before Last Seen", function (c) { var e = lastSeen(c); if (!e) return false; var k = kids(e.parent), i = k.indexOf(e); for (var j = i - 1; j >= 0 && k[j].tag !== "h2"; j--) if (k[j].tag === "hr") return true; return false; }),
       exists("There is a heading 2 that says Last Seen", lastSeen), P("It is text-transform uppercase", lastSeen, "text-transform", upper), P("It has a color", lastSeen, "color", named), PX("It has a border on the left only", lastSeen, onlySide("left"))],
      [exists("There is a heading 3 that says Known Hideouts", hide), P("It has a color", hide, "color", named), P("Its font-size is 22px", hide, "font-size", h.px(22)), exists("A paragraph is under it", afterEl(hide, "p")),
       P("The paragraph has a dashed border", afterEl(hide, "p"), "border", h.bs("dashed")),
       K("Its border color is different from the other dashed border", function (c) { var a = h.vals(c, descP2(c), "border")[0], b = h.vals(c, afterEl(hide, "p")(c), "border")[0]; return !!a && !!b && h.borderColor(a) !== "" && h.borderColor(a) !== h.borderColor(b); })]
    ],
    "Step 5": [
      [exists("There is a heading 2 that says Reward", reward), P("It has a color", reward, "color", named), exists("A paragraph is under it", afterEl(reward, "p")), IN("The reward amount is bold", afterEl(reward, "p"), BOLD),
       P("The paragraph has a background-color", afterEl(reward, "p"), "background-color", named), P("It has a solid border", afterEl(reward, "p"), "border", h.bs("solid")), P("It is text-align center", afterEl(reward, "p"), "text-align", center),
       P("It has a serif font-family", afterEl(reward, "p"), "font-family", h.serif), P("Its font-size is 24px", afterEl(reward, "p"), "font-size", h.px(24))],
      [K("A last paragraph comes after the reward", function (c) { var r = afterEl(reward, "p")(c), l = lastP(c); return !!r && !!l && l !== r; }), IN("The warning is in italics", lastP, ITAL), IN("It has a line break", lastP, ["br"]),
       P("It has a monospace font-family", lastP, "font-family", h.mono), P("Its font-size is 13px", lastP, "font-size", h.px(13)), P("It is text-align center", lastP, "text-align", center), P("It has a dotted border", lastP, "border", h.bs("dotted"))]
    ]
  } };

  /* ---------------- 6.5  the guide page (lists) ---------------- */
  var menu = afterEl(T("h1"), "ul"), menuLi = function (c) { var l = menu(c); return l ? kids(l).filter(function (k) { return k.tag === "li"; }) : []; };
  var tag5 = afterEl(menu, "p");
  var h2a = T("h2", 0), h2b = T("h2", 1), ol0 = T("ol", 0), ol1 = T("ol", 1), ul1 = T("ul", 1), ul2 = T("ul", 2);
  var h3AfterP = function (pickP) { return function (c) { var p = pickP(c), n = h.nextEl(p); return n && n.tag === "h3" ? n : null; }; };
  SC.LESSONS["6.5"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg("The body has a background-color (a named color)")]],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a background-color (dark)", T("h1"), "background-color", named), P("It has a white color", T("h1"), "color", h.isWhite), P("It is text-align center", T("h1"), "text-align", center),
       P("It has a serif font-family", T("h1"), "font-family", h.serif), P("Its font-size is 36px", T("h1"), "font-size", h.px(36)), PX("It has a border on the bottom only", T("h1"), onlySide("bottom"))],
      [exists("A bullet list is under the heading 1", menu), listItems(menu, 3), P("The list has list-style-type none", menu, "list-style-type", h.eq("none")), P("The list has a background-color", menu, "background-color", named), P("The list is text-align center", menu, "text-align", center)],
      [eachLi("Each of the 3 list items is display inline", menu, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); }), eachLi("Each of the 3 list items has a white color", menu, 3, function (c, li) { return has(c, li, "color", h.isWhite); })]
    ],
    "Step 3": [
      [exists("A paragraph (the tagline) comes after the menu", tag5), P("It is text-align center", tag5, "text-align", center), P("It has a sans-serif font-family", tag5, "font-family", h.sans), IN("A phrase is in italics", tag5, ITAL),
       K("2 words are colored with 2 spans", function (c) { var p = tag5(c); return !!p && within(p, ["span"]).filter(function (s) { return has(c, s, "color"); }).length >= 2; }), IN("It has a line break", tag5, ["br"])],
      [hrAfter("A horizontal line is under the paragraph, outside it", tag5)]
    ],
    "Step 4": [
      [exists("There is a heading 2", h2a), P("It has a serif font-family", h2a, "font-family", h.serif), P("It has a color", h2a, "color", named), P("It is text-transform uppercase", h2a, "text-transform", upper), P("Its font-size is 26px", h2a, "font-size", h.px(26)), PX("It has a border on the bottom only", h2a, onlySide("bottom"))],
      [exists("A paragraph is under the heading 2", afterEl(h2a, "p")), P("It has a sans-serif font-family", afterEl(h2a, "p"), "font-family", h.sans), exists("A heading 3 comes after it", h3AfterP(afterEl(h2a, "p"))), exists("There is a numbered list", ol0), listItems(ol0, 3), boldItalicItems(ol0, 3),
       P("The numbered list has list-style-type decimal", ol0, "list-style-type", h.eq("decimal")), P("It has a background-color", ol0, "background-color", named), P("It has a solid border", ol0, "border", h.bs("solid"))],
      [exists("There is another heading 3 (with a color)", HW("h3", /./, 1)), P("The second heading 3 has a color", HW("h3", /./, 1), "color", named), exists("There is a second bullet list", ul1), listItems(ul1, 3),
       P("It has list-style-type square", ul1, "list-style-type", h.eq("square")), P("It has a background-color", ul1, "background-color", named), P("It has a dashed border", ul1, "border", h.bs("dashed"))],
      [K("A horizontal line comes after the lists", function (c) { var l = ul1(c), n = h.nextEl(l); return !!n && n.tag === "hr"; })]
    ],
    "Step 5": [
      [exists("There is a second heading 2", h2b), exists("A paragraph is under it", afterEl(h2b, "p")), P("The paragraph has a monospace font-family", afterEl(h2b, "p"), "font-family", h.mono), P("It has a dashed border", afterEl(h2b, "p"), "border", h.bs("dashed"))],
      [exists("There is a heading 3 and a second numbered list", ol1), listItems(ol1, 3), boldItalicItems(ol1, 3), P("It has list-style-type upper-roman", ol1, "list-style-type", h.eq("upper-roman")), P("It has a background-color", ol1, "background-color", named), P("It has a dotted border", ol1, "border", h.bs("dotted"))],
      [exists("There is a heading 3 (with a color) and a third bullet list", ul2), P("The heading 3 above the list has a color", HW("h3", /./, 3), "color", named), listItems(ul2, 3), P("It has list-style-type circle", ul2, "list-style-type", h.eq("circle")), P("It has a background-color", ul2, "background-color", named), P("It has a solid border", ul2, "border", h.bs("solid"))]
    ],
    "Step 6": [[
      K("A horizontal line comes before the last paragraph", function (c) { var p = lastP(c), n = p ? h.nextEl(p) : null, k = p ? kids(p.parent) : [], i = k.indexOf(p); return !!p && i > 0 && k[i - 1].tag === "hr"; }), IN("The last paragraph has a line break", lastP, ["br"]), P("It is text-align center", lastP, "text-align", center),
      P("It has a monospace font-family", lastP, "font-family", h.mono), P("Its font-size is 13px", lastP, "font-size", h.px(13)), P("It has a dotted border", lastP, "border", h.bs("dotted"))
    ]]
  } };

  /* ---------------- 6.6  the link hub (style block + links) ---------------- */
  function rule(sel, label, props) { return props.map(function (p) { return K(label + " " + p[0], function (c) { return h.ruleHas(c, sel, p[0], p[1]); }); }); }
  var orderOk = function (sels) { return K("The link rules are in this order: " + sels.join(", "), function (c) { var s = c.src, last = -1; return sels.every(function (x) { var i = s.toLowerCase().indexOf(x + " ", last + 1); if (i < 0) i = s.toLowerCase().indexOf(x + "{", last + 1); if (i < 0 || i <= last) return false; last = i; return true; }); }); };
  var STYLEBLOCK = K("There is a <style> block inside the <head>", function (c) { var s = c.all("style")[0]; return !!s && h.inTag(c, s, ["head"]); });
  var STYLEBLOCK_RULES = [
    [STYLEBLOCK].concat(rule("a:link", "a:link has", [["color", named]])).concat(rule("a:visited", "a:visited has", [["color", named]])).concat(rule("a:hover", "a:hover has", [["color", named], ["background-color", named]])).concat(rule("a:active", "a:active has", [["color", named]])).concat([orderOk(["a:link", "a:visited", "a:hover", "a:active"])]),
    rule("h1", "The h1 rule has", [["color", h.isWhite], ["background-color", named], ["font-family", h.serif], ["font-size", h.px(38)], ["text-align", center], ["border", h.BORDER]]),
    rule("h2", "The h2 rule has", [["color", named], ["font-size", h.px(26)], ["text-transform", upper], ["font-family", h.serif]]).concat(rule("body", "The body rule has", [["background-color", named], ["font-family", h.sans]]))
  ];
  function linkIn(c, li) { return within(li, ["a"])[0] || null; }
  function linksOk(count, newTab) {
    return function (c, l) { var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= count && li.slice(0, count).every(function (x) { var a = linkIn(c, x); if (!a || !/^https?:\/\//i.test(a.attrs.href || "")) return false; var t = a.attrs.target; return newTab ? t === "_blank" : (t === undefined || t === "_self"); }); };
  }
  var hubUl0 = afterEl(T("h1"), "ul"), hubUl1 = T("ul", 1), hubUl2 = T("ul", 2), hubOl0 = T("ol", 0), hubOl1 = T("ol", 1);
  var hubP0 = function (c) { var l = hubUl0(c), n = h.nextEl(l); return n && n.tag === "p" ? n : null; };
  var topPicks = HW("h3", /top\s*3|top picks/i);
  var niceLinks = function (pick) { return K("Each link says where it goes (not \"click here\"), with the name in bold inside the link", function (c) { var l = pick(c); if (!l) return false; var li = kids(l).filter(function (k) { return k.tag === "li"; }); return li.length >= 3 && li.slice(0, 3).every(function (x) { var a = linkIn(c, x); return !!a && !/click here|^here$/i.test(txt(c, a)) && within(a, BOLD).length >= 1; }); }); };
  var italicNote = function (pick) { return eachLi("Each item has an italic note", pick, 3, function (c, li) { return within(li, ITAL).length >= 1; }); };
  SC.LESSONS["6.6"] = { inlineOnly: false, steps: {
    "Step 1": [],
    "Step 2": [
      [exists("There is a heading 1", T("h1"))],
      [exists("A bullet list is under the heading 1", hubUl0), listItems(hubUl0, 3), PX("Each item has a link starting with https:// that opens in the same tab", hubUl0, linksOk(3, false)), P("The list has list-style-type none", hubUl0, "list-style-type", h.eq("none")),
       P("It is text-align center", hubUl0, "text-align", center), PX("It has a border on the bottom only", hubUl0, onlySide("bottom")), eachLi("Each list item is display inline", hubUl0, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })],
      [exists("A paragraph comes after the menu", hubP0), P("It is text-align center", hubP0, "text-align", center), IN("A phrase is in italics", hubP0, ITAL), K("One word is colored with a span", function (c) { var p = hubP0(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }),
       IN("It has a line break", hubP0, ["br"]), hrAfter("A horizontal line is under it, outside it", hubP0)]
    ],
    "Step 3": [
      [exists("There is a heading 2", T("h2", 0)), exists("A paragraph is under it", afterEl(T("h2", 0), "p")), P("The paragraph has a sans-serif font-family", afterEl(T("h2", 0), "p"), "font-family", h.sans), exists("There is a heading 3", T("h3", 0)), exists("There is a second bullet list", hubUl1),
       listItems(hubUl1, 3), P("It has list-style-type square", hubUl1, "list-style-type", h.eq("square")), P("It has a dashed border", hubUl1, "border", h.bs("dashed"))],
      [PX("Each item has a link that opens in a new tab", hubUl1, linksOk(3, true)), niceLinks(hubUl1), italicNote(hubUl1)],
      [K("A horizontal line comes after the list", function (c) { var n = h.nextEl(hubUl1(c)); return !!n && n.tag === "hr"; })]
    ],
    "Step 4": [
      [exists("There is a second heading 2", T("h2", 1)), exists("There is a second heading 3", T("h3", 1)), exists("There is a numbered list", hubOl0), listItems(hubOl0, 3), P("It has list-style-type upper-roman", hubOl0, "list-style-type", h.eq("upper-roman")), P("It has a dotted border", hubOl0, "border", h.bs("dotted"))],
      [PX("Each item has a link that opens in the same tab", hubOl0, linksOk(3, false)), niceLinks(hubOl0), italicNote(hubOl0)]
    ],
    "Step 5": [
      [exists("There is a heading 3 that says My Top 3 Picks", topPicks), P("It has a color", topPicks, "color", named), P("It is text-transform uppercase", topPicks, "text-transform", upper), exists("A numbered list is under it", hubOl1), listItems(hubOl1, 3), boldItalicItems(hubOl1, 3),
       P("The list has list-style-type decimal", hubOl1, "list-style-type", h.eq("decimal")), P("It has a background-color", hubOl1, "background-color", named), P("It has a dashed border", hubOl1, "border", h.bs("dashed"))],
      [exists("A paragraph with a tip", lastP), K("A span with a color style is in the paragraph", function (c) { var p = lastP(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }), IN("It has a line break", lastP, ["br"]),
       P("It has a monospace font-family", lastP, "font-family", h.mono), P("Its font-size is 14px", lastP, "font-size", h.px(14)), P("It has a dotted border", lastP, "border", h.bs("dotted"))],
      [exists("There is a last bullet list", hubUl2), listItems(hubUl2, 3), P("It has list-style-type none", hubUl2, "list-style-type", h.eq("none")), P("It is text-align center", hubUl2, "text-align", center), P("It has a monospace font-family", hubUl2, "font-family", h.mono),
       P("Its font-size is 14px", hubUl2, "font-size", h.px(14)), PX("It has a border on the top only", hubUl2, onlySide("top")), eachLi("Each list item is display inline", hubUl2, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })]
    ]
  } };

  /* ---------------- 6.7  the photo brochure (images) ---------------- */
  var imgs = function (c) { return c.all("img"); };
  var imgLinked = function (i) { return function (c) { var im = imgs(c)[i], a = im ? c.ancestor(im, ["a"]) : null; return !!a && /^https?:\/\//i.test(a.attrs.href || ""); }; };
  var imgAlt = function (i) { return function (c) { var im = imgs(c)[i]; return !!im && /\S{3,}/.test(im.attrs.alt || ""); }; };
  var imgTab = function (i, newTab) { return function (c) { var im = imgs(c)[i], a = im ? c.ancestor(im, ["a"]) : null; if (!a) return false; return newTab ? a.attrs.target === "_blank" : (a.attrs.target === undefined || a.attrs.target === "_self"); }; };
  var IMG = function (i) { return function (c) { return imgs(c)[i] || null; }; };
  var imgInP = function (i) { return function (c) { var im = imgs(c)[i]; return !!im && h.inTag(c, im, ["p"]); }; };
  SC.LESSONS["6.7"] = { inlineOnly: false, steps: {
    "Step 1": [[], [K("At least 2 uploaded pictures are on your page", function (c) { return imgs(c).filter(function (im) { return /\/api\/code\?img=/.test(im.attrs.src || ""); }).length >= 2; })]],
    "Step 2": [],
    "Step 3": [
      [exists("There is a heading 1", T("h1"))],
      [exists("A bullet list is under the heading 1", hubUl0), listItems(hubUl0, 3), PX("Each item has a link starting with https:// that opens in the same tab", hubUl0, linksOk(3, false)), P("The list has list-style-type none", hubUl0, "list-style-type", h.eq("none")), P("It is text-align center", hubUl0, "text-align", center),
       PX("It has a border on the bottom only", hubUl0, onlySide("bottom")), eachLi("Each list item is display inline", hubUl0, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })],
      [exists("A paragraph comes after the menu", hubP0), P("It is text-align center", hubP0, "text-align", center), IN("A phrase is in italics", hubP0, ITAL), K("One word is colored with a span", function (c) { var p = hubP0(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }), IN("It has a line break", hubP0, ["br"])]
    ],
    "Step 4": [
      [exists("The first picture is on the page, inside a paragraph", IMG(0)), K("It is inside a paragraph", imgInP(0)), K("Its link goes to a real website (https://)", imgLinked(0)), K("Its alt is a real description", imgAlt(0)), K("The first link opens in a new tab", imgTab(0, true))],
      [P("The picture has width 320px", IMG(0), "width", h.px(320)), P("It has a solid border", IMG(0), "border", h.bs("solid")), P("It has border-radius 12px", IMG(0), "border-radius", h.px(12)), P("It has display block", IMG(0), "display", h.eq("block"))]
    ],
    "Step 5": [
      [hrAfter("A horizontal line is under the main picture", function (c) { var im = imgs(c)[0]; return im ? c.ancestor(im, ["p"]) : null; }), exists("There is a heading 2", T("h2", 0)), exists("A paragraph is under it", afterEl(T("h2", 0), "p")),
       P("The paragraph has a sans-serif font-family", afterEl(T("h2", 0), "p"), "font-family", h.sans), exists("A heading 3 that says Photos", HW("h3", /photo/i))],
      [exists("The second picture is on the page", IMG(1)), K("It is inside a paragraph", imgInP(1)), K("Its link goes to a real website (https://)", imgLinked(1)), K("Its alt is a real description", imgAlt(1)), K("The link opens in the same tab", imgTab(1, false)),
       P("The picture has width 25%", IMG(1), "width", h.eq("25%")), P("It has border-radius 50%", IMG(1), "border-radius", h.eq("50%")), P("It has a dashed border", IMG(1), "border", h.bs("dashed"))],
      [exists("The third picture is on the page", IMG(2)), K("It is inside a paragraph", imgInP(2)), K("Its link goes to a real website (https://)", imgLinked(2)), K("Its alt is a real description", imgAlt(2)), K("The link opens in a new tab", imgTab(2, true)),
       P("The picture has width 45%", IMG(2), "width", h.eq("45%")), P("It has display block", IMG(2), "display", h.eq("block")), P("It has a dotted border", IMG(2), "border", h.bs("dotted"))],
      [exists("There is a bullet list (not the menu)", hubUl1), listItems(hubUl1, 3), P("It has list-style-type square", hubUl1, "list-style-type", h.eq("square")), P("It has a solid border", hubUl1, "border", h.bs("solid"))],
      [K("A horizontal line is under the list", function (c) { var n = h.nextEl(hubUl1(c)); return !!n && n.tag === "hr"; })]
    ],
    "Step 6": [
      [exists("There is a heading 2", T("h2", 1)), exists("There is a heading 3 under it", HW("h3", /./, 1)), P("The heading 3 is text-transform uppercase", HW("h3", /./, 1), "text-transform", upper), exists("There is a numbered list", hubOl0),
       listItems(hubOl0, 3), boldItalicItems(hubOl0, 3), P("It has list-style-type decimal", hubOl0, "list-style-type", h.eq("decimal")), P("It has a background-color", hubOl0, "background-color", named)],
      [exists("There is a heading 3 (with a color)", HW("h3", /./, 2)), P("The heading 3 has a color", HW("h3", /./, 2), "color", named), exists("There is a second numbered list", hubOl1), listItems(hubOl1, 3), P("It has list-style-type upper-roman", hubOl1, "list-style-type", h.eq("upper-roman")), P("It has a dashed border", hubOl1, "border", h.bs("dashed"))]
    ],
    "Step 7": [
      [exists("A paragraph with a tip", lastP), K("A span with a color style is in the paragraph", function (c) { var p = lastP(c); return !!p && within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }), IN("It has a line break", lastP, ["br"]),
       P("It has a monospace font-family", lastP, "font-family", h.mono), P("Its font-size is 14px", lastP, "font-size", h.px(14)), P("It has a dotted border", lastP, "border", h.bs("dotted"))],
      [exists("There is a last bullet list", hubUl2), listItems(hubUl2, 3), P("It has list-style-type none", hubUl2, "list-style-type", h.eq("none")), P("It is text-align center", hubUl2, "text-align", center), P("It has a monospace font-family", hubUl2, "font-family", h.mono),
       P("Its font-size is 14px", hubUl2, "font-size", h.px(14)), PX("It has a border on the top only", hubUl2, onlySide("top")), eachLi("Each list item is display inline", hubUl2, 3, function (c, li) { return has(c, li, "display", h.eq("inline")); })]
    ]
  } };
  /* 6.7 step 2 is the skeleton, the title, and the same style block as 6.6 */
  SC.LESSONS["6.7"].steps["Step 2"] = [SK.concat(TITLE), STYLEBLOCK_RULES[0].concat(STYLEBLOCK_RULES[1], STYLEBLOCK_RULES[2])];
  SC.LESSONS["6.6"].steps["Step 1"] = [SK.concat(TITLE)].concat(STYLEBLOCK_RULES);
  /* the picture-gathering step has no step comment (nothing is typed in the page) */
  SC.LESSONS["6.7"].steps["Step 1"].comment = false;
  /* step comments are only part of lessons 3.1 to 3.3 (6.1 to 6.3) */
  ["6.4", "6.5", "6.6", "6.7"].forEach(function (l) { Object.keys(SC.LESSONS[l].steps).forEach(function (st) { SC.LESSONS[l].steps[st].comment = false; }); });
  /* the last step of each lesson ("Test and submit"): the Checks list has to be all green */
  var LASTSTEP = { "6.4": ["Step 6", [[h.ALLGREEN], []]], "6.5": ["Step 7", [[h.ALLGREEN], []]], "6.6": ["Step 6", [[], [h.ALLGREEN], []]], "6.7": ["Step 8", [[], [h.ALLGREEN], []]] };
  Object.keys(LASTSTEP).forEach(function (l) { var st = LASTSTEP[l][0], list = LASTSTEP[l][1]; list.comment = false; SC.LESSONS[l].steps[st] = list; });
})(typeof window !== "undefined" ? window : globalThis);
