/* Step checks for lessons 6.1, 6.2, and 6.3 (see step-checks.js for how these are used). One list of checks per step bullet, in order. */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H;
  var K = h.K, P = h.P, PX = h.PX, EACH = h.EACH, CNT = h.CNT, IN = h.IN, UNDER = h.UNDER, T = h.T, HW = h.HW, LAST = h.LAST, AFTER = h.AFTER, ALL = h.ALL, FOLLOW = h.FOLLOW, exists = h.exists;
  var SK = h.SKELETON, TITLE = h.TITLE, has = h.has, kids = h.kids, txt = h.txt, words = h.words, within = h.within, BOLD = h.BOLD, ITAL = h.ITAL;

  /* ---------------- 6.1  the plain, text-heavy page ---------------- */
  function sections(c) { /* [{h2, ps}] : the paragraphs under each heading 2, up to the next heading 1 or 2 */
    var out = [], cur = null;
    (c.all("body")[0] ? kids(c.all("body")[0]) : []).forEach(function (n) {
      if (n.tag === "h2") { cur = { h2: n, ps: [] }; out.push(cur); } else if (n.tag === "h1") cur = null; else if (n.tag === "p" && cur) cur.ps.push(n);
    });
    return out;
  }
  function allText(c) { var b = c.all("body")[0]; return b ? txt(c, b) : ""; }
  /* one box per pair of tags: the opening tag, the closing tag, and (for head and body) that they sit inside the html tags */
  function tagSet(tag, insideHtml) {
    var list = [
      K("There is an opening <" + tag + "> tag", function (c) { return new RegExp("<" + tag + "\\b[^>]*>", "i").test(c.rawSrc || c.src); }),
      K("There is a closing </" + tag + "> tag", function (c) { return new RegExp("</" + tag + "\\s*>", "i").test(c.rawSrc || c.src); })
    ];
    if (insideHtml) list.push(K("The " + tag + " tags are inside the html tags", function (c) { var e = c.all(tag)[0]; return !!e && h.inTag(c, e, ["html"]); }));
    else list.push(K("The closing </html> comes after the opening <html>", function (c) { var s = c.rawSrc || c.src, a = s.search(/<html\b/i), b = s.search(/<\/html\s*>/i); return a >= 0 && b > a; }));
    return list;
  }
  SC.LESSONS["6.1"] = { inlineOnly: false, steps: {
    "Step 1": [
      [SK[0]],
      tagSet("html", false),
      tagSet("head", true),
      tagSet("body", true).concat([K("The body comes after (under) the head", function (c) { var s = c.rawSrc || c.src, he = s.search(/<\/head\s*>/i), bs = s.search(/<body\b/i); return he >= 0 && bs > he; })]),
      TITLE
    ],
    "Step 2": [[
      K("There is one heading 1", function (c) { return c.count("h1") === 1; }),
      K("The heading 1 is inside the body", function (c) { var e = c.all("h1")[0]; return !!e && h.inTag(c, e, ["body"]); }),
      K("The heading 1 has words in it", function (c) { var e = c.all("h1")[0]; return !!e && words(c, e) >= 1; })
    ]],
    "Step 3": [
      [CNT("There are at least 3 heading 2s", "h2", 3), UNDER("The heading 2s come after the heading 1", T("h1"), T("h2"))],
      [K("Every heading 3 sits under a heading 2", function (c) { var h3 = c.all("h3"), h2 = c.all("h2")[0]; return !!h2 && h3.every(function (x) { return h.before(c, h2, x); }); })]
    ],
    "Step 4": [
      [K("Every heading 2 has 2 paragraphs under it", function (c) { var s = sections(c); return s.length >= 3 && s.every(function (x) { return x.ps.length >= 2; }); }),
       K("No paragraph is inside a heading", function (c) { return c.all("p").every(function (p) { return !h.inTag(c, p, ["h1", "h2", "h3", "h4", "h5", "h6"]); }) && c.count("p") > 0; })],
      [CNT("At least 10 paragraphs", "p", 10), K("At least 8 paragraphs are 25 words or longer", function (c) { return c.all("p").filter(function (p) { return words(c, p) >= 25; }).length >= 8; })],
      [K("The page has at least 300 words", function (c) { return (allText(c).match(/\S+/g) || []).length >= 300; })]
    ],
    "Step 6": [[h.NOERRORS], [h.ALLGREEN], []],
    "Step 5": [[
      K("The last paragraph lists at least 2 sources", function (c) {
        var p = c.all("p"), t = p.length ? txt(c, p[p.length - 1]) : "";
        var hits = (t.match(/\.(com|org|gov|edu|net)\b|www\.|https?:|encyclopedia|britannica|wikipedia|\bbook\b|\bby [A-Z]|\(\d{4}\)|\b(19|20)\d\d\b/gi) || []).length;
        var lab = /sources?|references?|bibliography|works cited/i.exec(t);
        if (!lab) return hits >= 2;
        var items = t.slice(lab.index + lab[0].length).split(/[;,]|\band\b|\d\)/i).map(function (x) { return x.replace(/[^A-Za-z0-9.]/g, ""); }).filter(function (x) { return x.length >= 3; });
        return (hits >= 2 || items.length >= 2) && words(c, p[p.length - 1]) >= 6;
      })
    ]]
  } };

  /* ---------------- 6.2  the epic poster (style attribute) ---------------- */
  var H1 = T("h1"), H2a = T("h2", 0), H2b = T("h2", 1);
  var whenH = HW("h3", /when/i), whereH = HW("h3", /where/i);
  function pUnder(pick) { return AFTER(pick, "p"); }
  var bodyBg = P("The body has a background-color (a named color)", T("body"), "background-color", h.isNamed);
  SC.LESSONS["6.2"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [bodyBg]],
    "Step 2": [
      [exists("There is a heading 1", H1), P("It has a color (a named color)", H1, "color", h.isNamed), P("Its font-size is in pixels", H1, "font-size", h.isPx), P("It is text-align center", H1, "text-align", h.eq("center")), P("It is text-transform uppercase", H1, "text-transform", h.eq("uppercase"))],
      [exists("There is a heading 2 for the tagline", H2a), UNDER("It comes after the heading 1", H1, H2a), P("It has a color (a named color)", H2a, "color", h.isNamed),
       K("Its color is different from the heading 1's color", function (c) { var a = h.vals(c, H1(c), "color")[0], b = h.vals(c, H2a(c), "color")[0]; return !!a && !!b && a !== b; }),
       P("It is text-transform uppercase", H2a, "text-transform", h.eq("uppercase")), P("It is text-align center", H2a, "text-align", h.eq("center")), P("Its font-size is 24px", H2a, "font-size", h.px(24))]
    ],
    "Step 3": [
      [exists("There is a heading 3 that says When", whenH), P("The When heading has a color", whenH, "color", h.isNamed), exists("A paragraph is under it", pUnder(whenH)),
       P("The paragraph has a color", pUnder(whenH), "color", h.isNamed), P("Its font-size is 20px", pUnder(whenH), "font-size", h.px(20)), P("It has a background-color", pUnder(whenH), "background-color", h.isNamed)],
      [exists("There is a heading 3 that says Where", whereH), P("The Where heading has a color", whereH, "color", h.isNamed), exists("A paragraph is under it", pUnder(whereH)),
       P("The paragraph has a color", pUnder(whereH), "color", h.isNamed), P("Its font-size is 20px", pUnder(whereH), "font-size", h.px(20))]
    ],
    "Step 4": [
      [exists("There is a second heading 2 that says Tickets", HW("h2", /ticket/i)), P("It has a color", HW("h2", /ticket/i), "color", h.isNamed), P("It is text-transform uppercase", HW("h2", /ticket/i), "text-transform", h.eq("uppercase")), P("It is text-align center", HW("h2", /ticket/i), "text-align", h.eq("center"))],
      [exists("A paragraph is under the Tickets heading", pUnder(HW("h2", /ticket/i))), P("It has a color", pUnder(HW("h2", /ticket/i)), "color", h.isNamed), P("Its font-size is 20px", pUnder(HW("h2", /ticket/i)), "font-size", h.px(20)),
       P("It is text-align center", pUnder(HW("h2", /ticket/i)), "text-align", h.eq("center")), P("It has a border (thickness, style, color)", pUnder(HW("h2", /ticket/i)), "border", h.BORDER)],
      [K("There is one more paragraph at the end", function (c) { var p = c.all("p"); return p.length >= 4 && p[p.length - 1] !== pUnder(HW("h2", /ticket/i))(c); }), P("It has a color", LAST("p"), "color", h.isNamed), P("Its font-size is 16px", LAST("p"), "font-size", h.px(16)),
       K("Its border style is different from the tickets paragraph", function (c) { var a = h.vals(c, pUnder(HW("h2", /ticket/i))(c), "border")[0], b = h.vals(c, LAST("p")(c), "border")[0]; return !!a && !!b && h.borderStyle(a) !== "" && h.borderStyle(b) !== "" && h.borderStyle(a) !== h.borderStyle(b); })]
    ]
  } };

  /* ---------------- 6.3  the menu (editing tags) ---------------- */
  var sectionH = function (i) { return T("h2", i); };   /* the 1st, 2nd, and 3rd heading 2 (the section names change with the theme) */
  function dishes(re) { return FOLLOW(sectionH(re), "p", 2); }
  function dishChecks(re, nameLabel) {
    return [
      K("2 dish paragraphs are under " + nameLabel, function (c) { return dishes(re)(c).length >= 2; }),
      K("Each dish name is bold", function (c) { var d = dishes(re)(c); return d.length >= 2 && d.every(function (p) { return within(p, BOLD).length >= 1; }); }),
      K("Each price is inside a span with a color style", function (c) { var d = dishes(re)(c); return d.length >= 2 && d.every(function (p) { return within(p, ["span"]).some(function (s) { return has(c, s, "color"); }); }); }),
      K("Each dish has a line break", function (c) { var d = dishes(re)(c); return d.length >= 2 && d.every(function (p) { return within(p, ["br"]).length >= 1; }); }),
      K("Each description is in italics", function (c) { var d = dishes(re)(c); return d.length >= 2 && d.every(function (p) { return within(p, ITAL).length >= 1; }); })
    ];
  }
  var starters = 0, mains = 1, desserts = 2;
  var headStyle = function (re, nm) { return [exists("There is a heading 2 for " + nm, sectionH(re)), P("It is text-transform uppercase", sectionH(re), "text-transform", h.eq("uppercase")), P("It has a color", sectionH(re), "color", h.isNamed)]; };
  var hrBefore = function (re, nm) { return K("A horizontal line comes before the " + nm + " heading", function (c) { var e = sectionH(re)(c), p = e ? e.parent : null; if (!p) return false; var k = kids(p), i = k.indexOf(e); for (var j = i - 1; j >= 0 && k[j].tag !== "h2"; j--) if (k[j].tag === "hr") return true; return false; }); };
  var chef = HW("h3", /chef/i), good = HW("h3", /good to know/i);
  SC.LESSONS["6.3"] = { inlineOnly: true, steps: {
    "Step 1": [SK, TITLE, [P("The body has a background-color (a named color)", T("body"), "background-color", h.isNamed), P("The body has a color (a named color)", T("body"), "color", h.isNamed)]],
    "Step 2": [
      [exists("There is a heading 1", T("h1")), P("It has a serif font-family", T("h1"), "font-family", h.serif), P("It has a color", T("h1"), "color", h.isNamed), P("Its font-size is 44px", T("h1"), "font-size", h.px(44)),
       P("It is text-align center", T("h1"), "text-align", h.eq("center")), P("It has a background-color", T("h1"), "background-color", h.isNamed)],
      [exists("A paragraph is under the heading 1", AFTER(T("h1"), "p")), IN("It has a line break inside it", AFTER(T("h1"), "p"), ["br"]), P("It has a sans-serif font-family", AFTER(T("h1"), "p"), "font-family", h.sans),
       P("It is text-align center", AFTER(T("h1"), "p"), "text-align", h.eq("center")), P("Its font-size is 16px", AFTER(T("h1"), "p"), "font-size", h.px(16))],
      [K("A horizontal line is under that paragraph, outside it", function (c) { var p = AFTER(T("h1"), "p")(c), n = h.nextEl(p); return !!n && n.tag === "hr"; })]
    ],
    "Step 3": [
      headStyle(starters, "Starters").concat(dishChecks(starters, "Starters")),
      [hrBefore(mains, "Main Dishes")].concat(headStyle(mains, "Main Dishes")).concat(dishChecks(mains, "Main Dishes")).concat([K("The first main dish has a border", function (c) { var d = dishes(mains)(c); return d.length >= 1 && h.has(c, d[0], "border", h.BORDER); })]),
      [hrBefore(desserts, "Desserts")].concat(headStyle(desserts, "Desserts")).concat(dishChecks(desserts, "Desserts"))
    ],
    "Step 4": [
      [exists("There is a heading 3 that says Chef's Special", chef), P("It is text-align center", chef, "text-align", h.eq("center")), P("It has a color", chef, "color", h.isNamed), exists("A paragraph is under it", AFTER(chef, "p")),
       P("The paragraph has a dashed border", AFTER(chef, "p"), "border", h.bs("dashed")), P("The paragraph has a serif font-family", AFTER(chef, "p"), "font-family", h.serif)],
      [exists("There is a heading 3 that says Good to Know", good), P("It has a color", good, "color", h.isNamed), exists("A paragraph is under it", AFTER(good, "p")), IN("The paragraph has a line break inside it", AFTER(good, "p"), ["br"]),
       P("It has a monospace font-family", AFTER(good, "p"), "font-family", h.mono), P("Its font-size is 14px", AFTER(good, "p"), "font-size", h.px(14)), P("It has a background-color", AFTER(good, "p"), "background-color", h.isNamed)]
    ]
  } };
  /* the last step of each lesson ("Test and submit"): the Checks list has to be all green. These steps have no step comment. */
  SC.LESSONS["6.1"].steps["Step 6"].comment = false;
  SC.LESSONS["6.2"].steps["Step 5"] = [[h.ALLGREEN], []]; SC.LESSONS["6.2"].steps["Step 5"].comment = false;
  SC.LESSONS["6.3"].steps["Step 5"] = [[h.ALLGREEN], []]; SC.LESSONS["6.3"].steps["Step 5"].comment = false;
})(typeof window !== "undefined" ? window : globalThis);
