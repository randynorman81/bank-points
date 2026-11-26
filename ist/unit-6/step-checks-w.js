/* Step checks for the Unit 3 WALKTHROUGHS ("6.1w" ...) and ASSIGNMENTS ("6.1a" ...) added by lab-lessons.js. Same format as step-checks-b.js:
   one list of checks per step bullet, in the same order as the bullets in answers-w.js. Loaded after step-checks-b.js (editor, grade page, server). */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H; if (!SC) return;
  var K = h.K, P = h.P, T = h.T, CNT = h.CNT, has = h.has, kids = h.kids, txt = h.txt, words = h.words, within = h.within, exists = h.exists;
  function lastStep(l, st, list) { list.comment = false; SC.LESSONS[l].steps[st] = list; }
  /* the page is built correctly: the Problems list is empty AND the shapes the Problems list does not catch are right too (every attribute value in double quotes, no paragraph inside a heading, list items only in lists, only li tags directly inside a list) */
  function structOK(c) {
    var s = String(c.rawSrc || "").replace(/<!--[\s\S]*?-->/g, "");
    var tags = s.match(/<[a-zA-Z][^<>]*>/g) || [];
    if (tags.some(function (t) { return /\s[a-zA-Z-]+\s*=\s*(?!")/.test(t.replace(/"[^"]*"/g, '""').replace(/\s[a-zA-Z-]+(?=[\s>\/])(?!\s*=)/g, "")) || /\s[a-zA-Z-]+\s*=\s*'/.test(t.replace(/"[^"]*"/g, '""')); })) return false;
    if (tags.some(function (t) { var rest = t.replace(/"[^"]*"/g, '""').replace(/^<[a-zA-Z][a-zA-Z0-9]*/, "").replace(/\/?>$/, "").trim(); return rest !== "" && rest.split(/\s+/).some(function (tok) { return !/^[a-zA-Z][a-zA-Z0-9-]*(=""|)$/.test(tok); }); })) return false;   /* a stray word or emoji inside a tag */
    if (c.all("p").some(function (p) { return !!c.ancestor(p, ["h1", "h2", "h3", "h4", "h5", "h6"]); })) return false;
    if (c.all("li").some(function (li) { return !li.parent || (li.parent.tag !== "ul" && li.parent.tag !== "ol"); })) return false;
    if (c.all("ul").concat(c.all("ol")).some(function (l) { return l.children.some(function (k) { return k.tag === "#text" && String(k.text).trim(); }) || kids(l).some(function (k) { return k.tag !== "li"; }); })) return false;
    return true;
  }
  var NOERR = K("The Problems list is empty and the page is built correctly (every tag closed, every attribute value in double quotes, nothing nested wrongly)", function (c) { return String(c.rawSrc || "").trim().length > 0 && root.HTMLCheck.check(c.lesson, c.rawSrc, c.cssFile || "").errors.length === 0 && structOK(c); });

  /* ---------- shared pieces ---------- */
  var norm = function (s) { return String(s).replace(/\s+/g, " ").trim(); };
  /* the text of an element is exactly what the step asks for (spaces and line breaks do not matter, capital letters do) */
  function SAYS(label, pick, want) { return K(label, function (c) { var e = pick(c); return !!e && norm(txt(c, e)) === want; }); }
  function inBody(c, e) { return !!e && h.inTag(c, e, ["body"]); }
  function src(c) { return c.rawSrc || c.src; }
  var DOCTYPE = K("The doctype line <!DOCTYPE html> is the very first line of the page", function (c) { return /^\s*<!doctype\s+html\s*>/i.test(src(c)); });
  var HTMLTAGS = [
    K("There is an opening <html> tag right under the doctype", function (c) { return /^\s*<!doctype\s+html\s*>\s*<html\b[^>]*>/i.test(src(c)); }),
    K("There is a closing </html> tag at the very bottom of the page", function (c) { return /<\/html\s*>\s*$/i.test(src(c)); })
  ];
  var HEADTAGS = [
    K("There is an opening <head> tag and a closing </head> tag", function (c) { return /<head\b[^>]*>/i.test(src(c)) && /<\/head\s*>/i.test(src(c)); }),
    K("The <head> tags are inside the <html> tags", function (c) { var e = c.all("head")[0]; return !!e && h.inTag(c, e, ["html"]); })
  ];
  function TITLEIS(want) {
    return [K("There is a <title> inside the <head>", function (c) { var t = c.all("title")[0]; return !!t && h.inTag(c, t, ["head"]); }),
      want ? SAYS("The title says exactly " + want, T("title"), want) : K("The title has words in it", function (c) { var t = c.all("title")[0]; return !!t && words(c, t) >= 1; })];
  }
  var BODYTAGS = [
    K("There is an opening <body> tag and a closing </body> tag", function (c) { return /<body\b[^>]*>/i.test(src(c)) && /<\/body\s*>/i.test(src(c)); }),
    K("The <body> tags are inside the <html> tags", function (c) { var e = c.all("body")[0]; return !!e && h.inTag(c, e, ["html"]); }),
    K("The <body> comes after (under) the <head>", function (c) { var s = src(c), he = s.search(/<\/head\s*>/i), bs = s.search(/<body\b/i); return he >= 0 && bs > he; })
  ];
  /* the nth heading 2 of the page, the paragraph(s) that follow it */
  var H2 = function (n) { return function (c) { return c.all("h2")[n] || null; }; };
  var PAFTER = function (n) { return function (c) { var e = H2(n)(c), x = h.nextEl(e); return x && x.tag === "p" ? x : null; }; };
  function sectionChecks(n, head, para) {
    return [
      [K("There is a heading 2 inside the body", function (c) { return inBody(c, H2(n)(c)); }), SAYS("The heading 2 says exactly " + head, H2(n), head)],
      [K("A paragraph sits right under that heading 2", function (c) { return !!PAFTER(n)(c); }),
       para ? SAYS("The paragraph says exactly " + para, PAFTER(n), para) : K("The paragraph has at least 5 words", function (c) { var p = PAFTER(n)(c); return !!p && words(c, p) >= 5; })]
    ];
  }

  function flat(two) { return two[0].concat(two[1]); }

  /* =============== 3.1 Walkthrough ("6.1w"): the Slice House page, typed exactly =============== */
  SC.LESSONS["6.1w"] = { inlineOnly: true, steps: {
    "Step 1": [[DOCTYPE], HTMLTAGS, HEADTAGS, TITLEIS("Slice House"), BODYTAGS],
    "Step 2": [[K("There is one heading 1 inside the body", function (c) { return c.count("h1") === 1 && inBody(c, c.all("h1")[0]); }), SAYS("The heading 1 says exactly Slice House", T("h1"), "Slice House"),
                K("The heading 1 is the first thing in the body", function (c) { var b = c.all("body")[0], k = b ? kids(b) : []; return k.length > 0 && k[0].tag === "h1"; })]],
    "Step 3": sectionChecks(0, "Our Story", "Slice House opened in 2019 with one oven and a big idea."),
    "Step 4": sectionChecks(1, "Our Menu", "We bake cheese, pepperoni, and veggie pizza every day.").concat([[K("The page has exactly 1 heading 1, 2 heading 2s and 2 paragraphs", function (c) { return c.count("h1") === 1 && c.count("h2") === 2 && c.count("p") === 2; })]]),
    "Step 5": [[NOERR], []]
  } };
  SC.LESSONS["6.1w"].steps["Step 5"].comment = false;

  /* =============== 3.1 Assignment ("6.1a"): a Help Center page for Netflix =============== */
  SC.LESSONS["6.1a"] = { inlineOnly: true, steps: {
    "Step 1": [[DOCTYPE].concat(HTMLTAGS), HEADTAGS.concat(TITLEIS("Netflix Help Center")), BODYTAGS],
    "Step 2": [[K("There is one heading 1 inside the body", function (c) { return c.count("h1") === 1 && inBody(c, c.all("h1")[0]); }), SAYS("The heading 1 says exactly Help Center", T("h1"), "Help Center")]],
    "Step 3": [flat(sectionChecks(0, "Billing", null)), flat(sectionChecks(1, "Devices", null)), [K("Only heading 1 and heading 2 are used (no heading 3 or smaller)", function (c) { return c.count("h1") >= 1 && c.count("h2") >= 1 && ["h3", "h4", "h5", "h6"].every(function (t) { return c.count(t) === 0; }); }),
      K("The page has exactly 1 heading 1, 2 heading 2s and 2 paragraphs", function (c) { return c.count("h1") === 1 && c.count("h2") === 2 && c.count("p") === 2; })]],
    "Step 4": [[NOERR], []]
  } };
  SC.LESSONS["6.1a"].steps["Step 4"].comment = false;

  /* ---------- shared pieces for the lessons after 3.1 ---------- */
  var named = h.isNamed, eq = h.eq;
  var hex6 = function (v) { return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/.test(v); };   /* a hex code: # and 3 or 6 letters and numbers */
  function HAS(label, pick, prop, test) { return P(label, pick, prop, test); }
  function differ(c, el) { var a = h.vals(c, el, "color")[0], b = h.vals(c, el, "background-color")[0]; return !!a && !!b && a !== b; }
  function BOTH(label, pick) { return K(label, function (c) { var e = pick(c); return !!e && has(c, e, "color", named) && has(c, e, "background-color", named) && differ(c, e); }); }
  var ALLOF = function (tag) { return function (c) { return c.all(tag); }; };
  /* step 1 of a walkthrough: the skeleton in 1 bullet, then the typed content in 1 bullet */
  function SKELETON1(title) { return [DOCTYPE].concat(HTMLTAGS, HEADTAGS, TITLEIS(title), BODYTAGS); }
  /* the same, as the 3 bullets of an assignment (skeleton, head and title, body) */
  function SKELETON3(title) { return [[DOCTYPE].concat(HTMLTAGS), HEADTAGS.concat(TITLEIS(title)), BODYTAGS]; }
  function ONLY(label, counts) { return K(label, function (c) { return Object.keys(counts).every(function (t) { return c.count(t) === counts[t]; }); }); }
  var LAB = function (id, steps) { SC.LESSONS[id] = { inlineOnly: true, steps: steps }; var last = Object.keys(steps).pop(); steps[last].comment = false; };

  /* =============== 3.2 Walkthrough ("6.2w"): Pixel Arcade =============== */
  LAB("6.2w", {
    "Step 1": [SKELETON1("Pixel Arcade"),
      [SAYS("The heading 1 says exactly Pixel Arcade", T("h1"), "Pixel Arcade"), SAYS("The heading 2 says exactly Top Games", T("h2"), "Top Games"), SAYS("The paragraph says exactly New games arrive every Friday.", T("p"), "New games arrive every Friday."),
       ONLY("The page has 1 heading 1, 1 heading 2 and 1 paragraph", { h1: 1, h2: 1, p: 1 })]],
    "Step 2": [[HAS("The heading 1 has a style attribute with color: tomato", T("h1"), "color", eq("tomato"))]],
    "Step 3": [[HAS("The heading 2 has color: white", T("h2"), "color", eq("white")), HAS("The heading 2 has background-color: black", T("h2"), "background-color", eq("black")),
                K("The two styles are separated by a semicolon", function (c) { var e = c.all("h2")[0]; return !!e && /\S\s*;\s*\S/.test(e.attrs.style || ""); })]],
    "Step 4": [[HAS("The paragraph has color: #003366", T("p"), "color", eq("#003366")), HAS("The paragraph has background-color: #FFEEAA", T("p"), "background-color", eq("#ffeeaa"))]],
    "Step 5": [[HAS("The body has background-color: navy", T("body"), "background-color", eq("navy")), HAS("The body has color: white", T("body"), "color", eq("white"))]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.2 Assignment ("6.2a"): a Spotify playlist page =============== */
  LAB("6.2a", {
    "Step 1": SKELETON3("Road Trip Mix"),
    "Step 2": [[SAYS("The heading 1 says exactly Road Trip Mix", T("h1"), "Road Trip Mix"), CNT("There are at least 2 heading 2s", "h2", 2)],
               [K("There are at least 2 paragraphs and every paragraph has at least 5 words", function (c) { var a = c.all("p"); return a.length >= 2 && a.every(function (p) { return words(c, p) >= 5; }); })]],
    "Step 3": [[HAS("The body has a background-color", T("body"), "background-color", named), HAS("The body has a text color", T("body"), "color", named), K("The body's text color and background-color are different", function (c) { var b = c.all("body")[0]; return !!b && differ(c, b); })],
               [BOTH("The heading 1 has a color and a different background-color", T("h1"))],
               [K("Every heading 2 has its own color", function (c) { var a = c.all("h2"); return a.length >= 2 && a.every(function (x) { return has(c, x, "color", named); }); }),
                K("Every heading 2 has a background-color that is different from its color", function (c) { var a = c.all("h2"); return a.length >= 2 && a.every(function (x) { return has(c, x, "background-color", named) && differ(c, x); }); })],
               [K("At least 2 paragraphs use hex codes for BOTH color and background-color (a # and 3 or 6 letters and numbers, like #1DB954)", function (c) { return c.all("p").filter(function (x) { return has(c, x, "color", hex6) && has(c, x, "background-color", hex6) && differ(c, x); }).length >= 2; })]],
    "Step 4": [[NOERR], []]
  });

  var pxGE = function (n) { return function (v) { return h.isPx(v) && parseFloat(v) >= n; }; };
  var pxBetween = function (a, b) { return function (v) { return h.isPx(v) && parseFloat(v) >= a && parseFloat(v) <= b; }; };
  var ALIGN = function (v) { return /^(left|center|right)$/.test(v); };
  var P1 = function (tag) { return T(tag); };
  var BODYCOLORS = [HAS("The body has a background-color", T("body"), "background-color", named), HAS("The body has a text color", T("body"), "color", named),
    K("The body's text color and background-color are different", function (c) { var b = c.all("body")[0]; return !!b && differ(c, b); })];

  /* =============== 3.3 Walkthrough ("6.20w"): Skyline Cinema =============== */
  LAB("6.20w", {
    "Step 1": [SKELETON1("Skyline Cinema"),
      [SAYS("The heading 1 says exactly Skyline Cinema", T("h1"), "Skyline Cinema"), SAYS("The heading 2 says exactly Now Showing", T("h2"), "Now Showing"),
       SAYS("The heading 3 says exactly friday night double feature (all small letters)", T("h3"), "friday night double feature"),
       SAYS("The paragraph says exactly DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS. (all capitals)", T("p"), "DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS."),
       ONLY("The page has 1 heading 1, 1 heading 2, 1 heading 3 and 1 paragraph", { h1: 1, h2: 1, h3: 1, p: 1 })]],
    "Step 2": [[HAS("The heading 1 has font-size: 48px", T("h1"), "font-size", eq("48px"))], [HAS("The heading 3 has font-size: 24px", T("h3"), "font-size", eq("24px"))], [HAS("The paragraph has font-size: 18px", T("p"), "font-size", eq("18px"))]],
    "Step 3": [[HAS("The heading 1 has text-align: center", T("h1"), "text-align", eq("center")), HAS("The heading 1 still has font-size: 48px", T("h1"), "font-size", eq("48px"))],
               [HAS("The heading 2 has text-align: center", T("h2"), "text-align", eq("center"))],
               [HAS("The paragraph has text-align: right", T("p"), "text-align", eq("right")), HAS("The paragraph still has font-size: 18px", T("p"), "font-size", eq("18px"))]],
    "Step 4": [[HAS("The heading 1 has text-transform: uppercase", T("h1"), "text-transform", eq("uppercase")), HAS("The heading 1 keeps its other two styles", T("h1"), "text-align", eq("center"))],
               [HAS("The heading 3 has text-transform: capitalize", T("h3"), "text-transform", eq("capitalize")), HAS("The heading 3 still has font-size: 24px", T("h3"), "font-size", eq("24px"))],
               [HAS("The paragraph has text-transform: lowercase", T("p"), "text-transform", eq("lowercase")), HAS("The paragraph keeps its other two styles", T("p"), "text-align", eq("right"))]],
    "Step 5": [[NOERR], []]
  });

  /* =============== 3.3 Assignment ("6.20a"): a Nintendo announcement page =============== */
  LAB("6.20a", {
    "Step 1": SKELETON3("Nintendo Direct"),
    "Step 2": [[SAYS("The heading 1 says exactly Nintendo Direct", T("h1"), "Nintendo Direct"), CNT("There is a heading 2", "h2", 1), CNT("There is a heading 3", "h3", 1)],
               [K("There is a paragraph with at least 5 words", function (c) { var p = c.all("p")[0]; return !!p && words(c, p) >= 5; })]],
    "Step 3": [[HAS("The heading 1 has a font-size of at least 40px", T("h1"), "font-size", pxGE(40)), HAS("The heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The heading 1 is in capital letters (uppercase)", T("h1"), "text-transform", eq("uppercase"))],
               [HAS("The heading 2 is centered", T("h2"), "text-align", eq("center")), HAS("The heading 2 has a font-size in px", T("h2"), "font-size", h.isPx)],
               [HAS("The heading 3 has every word start with a capital letter (capitalize)", T("h3"), "text-transform", eq("capitalize")), HAS("The heading 3 has a font-size in px", T("h3"), "font-size", h.isPx)],
               [HAS("The paragraph has a font-size between 14px and 24px", T("p"), "font-size", pxBetween(14, 24)), HAS("The paragraph is aligned right", T("p"), "text-align", eq("right"))],
               BODYCOLORS],
    "Step 4": [[NOERR], []]
  });

  /* ---------- 3.4 helpers ---------- */
  var squash = function (s) { return String(s).replace(/\s+/g, ""); };
  function SAYSNS(label, pick, want) { return K(label, function (c) { var e = pick(c); return !!e && squash(txt(c, e)) === squash(want); }); }   /* same words; spaces and line breaks do not matter at all */
  var PN = function (n) { return function (c) { return c.all("p")[n] || null; }; };
  var NOBI = K("Bold and italics use strong and em, and no <b> or <i> tags are used", function (c) { return c.count("strong") + c.count("em") >= 1 && c.count("b") === 0 && c.count("i") === 0; });
  function bodyKids(c) { var b = c.all("body")[0]; return b ? kids(b).map(function (k) { return k.tag; }) : []; }
  function brSplit(c, p, a, b) { if (!p) return false; var k = p.children.filter(function (x) { return !(x.tag === "#text" && !String(x.text).trim()); }); return k.length === 3 && k[0].tag === "#text" && k[1].tag === "br" && k[2].tag === "#text" && norm(k[0].text) === a && norm(k[2].text) === b; }

  /* =============== 3.4 Walkthrough ("6.3w"): Beanstalk Coffee =============== */
  LAB("6.3w", {
    "Step 1": [SKELETON1("Beanstalk Coffee"),
      [SAYS("The heading 1 says exactly Beanstalk Coffee", T("h1"), "Beanstalk Coffee"), SAYS("Paragraph 1 says exactly We roast fresh beans every morning and serve them hot.", PN(0), "We roast fresh beans every morning and serve them hot."),
       SAYSNS("Paragraph 2 says Open daily 7 AM to 5 PM", PN(1), "Open daily 7 AM to 5 PM"), SAYS("Paragraph 3 says exactly Try the Green Giant latte.", PN(2), "Try the Green Giant latte."), ONLY("The page has 1 heading 1 and 3 paragraphs", { h1: 1, p: 3 })]],
    "Step 2": [[K("A strong tag is around the word fresh (and only that word)", function (c) { var p = PN(0)(c); return !!p && within(p, ["strong"]).length === 1 && norm(txt(c, within(p, ["strong"])[0])) === "fresh"; }),
                K("An em tag is around the word hot (and only that word)", function (c) { var p = PN(0)(c); return !!p && within(p, ["em"]).length === 1 && norm(txt(c, within(p, ["em"])[0])) === "hot"; }), NOBI]],
    "Step 3": [[K("Paragraph 2 is split into two lines: Open daily, a br tag, then 7 AM to 5 PM", function (c) { return brSplit(c, PN(1)(c), "Open daily", "7 AM to 5 PM"); }),
                K("The br tag stands alone (it has no closing tag)", function (c) { return !/<\/br\s*>/i.test(src(c)) && c.count("br") === 1; })]],
    "Step 4": [[K("There are exactly 2 horizontal rules (hr tags)", function (c) { return c.count("hr") === 2; }),
                K("The page order is: heading 1, hr, paragraph, paragraph, hr, paragraph", function (c) { return bodyKids(c).join(",") === "h1,hr,p,p,hr,p"; })]],
    "Step 5": [[K("A span tag is around Green Giant (and only those words) in paragraph 3", function (c) { var p = PN(2)(c); return !!p && within(p, ["span"]).length === 1 && norm(txt(c, within(p, ["span"])[0])) === "Green Giant"; }),
                K("The span has color: green", function (c) { var p = PN(2)(c), s = p && within(p, ["span"])[0]; return !!s && has(c, s, "color", h.eq("green")); })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.4 Assignment ("6.3a"): a Chipotle menu page =============== */
  LAB("6.3a", {
    "Step 1": SKELETON3("Chipotle Menu"),
    "Step 2": [[SAYS("The heading 1 says exactly Chipotle Menu", T("h1"), "Chipotle Menu"), CNT("There are at least 3 paragraphs", "p", 3)]],
    "Step 3": [[K("There is a horizontal rule (hr) right under the heading 1", function (c) { var h1 = c.all("h1")[0], n = h.nextEl(h1); return !!n && n.tag === "hr"; }), CNT("There are at least 2 horizontal rules in all", "hr", 2)],
               [K("At least one word is in a strong tag (bold)", function (c) { return c.all("strong").some(function (e) { return words(c, e) >= 1; }); }), K("At least one word is in an em tag (italics)", function (c) { return c.all("em").some(function (e) { return words(c, e) >= 1; }); }), NOBI],
               [K("A paragraph has a line break (br) with words before it and words after it", function (c) { return c.all("p").some(function (p) { var k = p.children.filter(function (x) { return !(x.tag === "#text" && !String(x.text).trim()); }), i = k.map(function (x) { return x.tag; }).indexOf("br"); return i > 0 && i < k.length - 1; }); })],
               [K("A span tag around at least one word has a named text color (color)", function (c) { return c.all("span").some(function (s) { return words(c, s) >= 1 && has(c, s, "color", named); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The body has a background-color", T("body"), "background-color", named), HAS("The body has a text color", T("body"), "color", named),
                K("The body's text color and background-color are different", function (c) { var b = c.all("body")[0]; return !!b && differ(c, b); })]],
    "Step 4": [[NOERR], []]
  });

  /* ---------- 3.5 helpers: Google Fonts ---------- */
  function fontLinks(c) { return c.all("link").filter(function (l) { return /^https:\/\/fonts\.googleapis\.com\/css2?\?/i.test(l.attrs.href || "") && /stylesheet/i.test(l.attrs.rel || ""); }); }
  function linkedNames(c) { var g = []; fontLinks(c).forEach(function (l) { if (!c.ancestor(l, ["head"])) return; var re = /family=([^&:;]+)/g, m, href = l.attrs.href; while ((m = re.exec(href))) { var nm; try { nm = decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { nm = m[1]; } nm = nm.trim().toLowerCase(); if (g.indexOf(nm) < 0) g.push(nm); } }); return g; }
  /* the first font in a font-family value, only when its name is in single quotes: 'Open Sans' -> open sans */
  function quotedFirst(v) { var m = /^'([^']+)'/.exec(String(v).trim()); return m ? m[1].trim().toLowerCase() : ""; }
  function fontOf(c, el) { var v = el ? h.vals(c, el, "font-family") : []; return v.length ? quotedFirst(v[0]) : ""; }
  function usesFont(name) { return function (c, el) { return fontOf(c, el) === name; }; }
  function LINKS(label, name) { return K(label, function (c) { return linkedNames(c).indexOf(name) > -1; }); }
  var LINKHEAD = K("Every Google Fonts link is inside the head tags", function (c) { var l = fontLinks(c); return l.length >= 1 && l.every(function (x) { return !!c.ancestor(x, ["head"]); }); });

  /* =============== 3.5 Walkthrough ("6.35w"): Sweet Dreams Bakery =============== */
  LAB("6.35w", {
    "Step 1": [SKELETON1("Sweet Dreams Bakery"),
      [SAYS("The heading 1 says exactly Sweet Dreams Bakery", T("h1"), "Sweet Dreams Bakery"), SAYS("Paragraph 1 says exactly Fresh bread and cakes every morning from our family oven.", PN(0), "Fresh bread and cakes every morning from our family oven."),
       SAYS("Paragraph 2 says exactly Try our famous cinnamon rolls.", PN(1), "Try our famous cinnamon rolls."), ONLY("The page has 1 heading 1 and 2 paragraphs", { h1: 1, p: 2 })]],
    "Step 2": [[LINKS("There is a link to the Pacifico font (family=Pacifico)", "pacifico"), LINKHEAD, K("The link has rel=\"stylesheet\"", function (c) { return fontLinks(c).length >= 1; })]],
    "Step 3": [[K("The heading 1 has font-family: 'Pacifico' (the name in single quotes)", function (c) { return fontOf(c, c.all("h1")[0]) === "pacifico"; })]],
    "Step 4": [[LINKS("There is a link to the Open Sans font (family=Open+Sans)", "open sans")],
               [K("Both paragraphs have font-family: 'Open Sans' (the name in single quotes)", function (c) { var a = c.all("p"); return a.length === 2 && a.every(function (p) { return fontOf(c, p) === "open sans"; }); })]],
    "Step 5": [[K("A span is around the word famous (and only that word) in paragraph 2", function (c) { var p = PN(1)(c); return !!p && within(p, ["span"]).length === 1 && norm(txt(c, within(p, ["span"])[0])) === "famous"; }),
                K("The span has font-family: 'Pacifico'", function (c) { var p = PN(1)(c), s = p && within(p, ["span"])[0]; return !!s && fontOf(c, s) === "pacifico"; })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.5 Assignment ("6.35a"): an Airbnb cabins page =============== */
  var firstFont = function (c, tag) { return fontOf(c, c.all(tag)[0]); };
  LAB("6.35a", {
    "Step 1": SKELETON3("Airbnb Cabins"),
    "Step 2": [[SAYS("The heading 1 says exactly Airbnb Cabins", T("h1"), "Airbnb Cabins"), K("There are at least 2 paragraphs, each with at least 5 words", function (c) { var a = c.all("p"); return a.length >= 2 && a.every(function (p) { return words(c, p) >= 5; }); })]],
    "Step 3": [[K("There are Google Fonts links for at least 2 different fonts", function (c) { return linkedNames(c).length >= 2; }), LINKHEAD]],
    "Step 4": [[K("The heading 1 uses one of your linked fonts in font-family (the name in single quotes)", function (c) { var f = firstFont(c, "h1"); return !!f && linkedNames(c).indexOf(f) > -1; })],
               [K("Every paragraph uses a linked font in font-family (the name in single quotes)", function (c) { var a = c.all("p"); return a.length >= 2 && a.every(function (p) { return linkedNames(c).indexOf(fontOf(c, p)) > -1; }); }),
                K("The paragraph font is a different font from the heading 1 font", function (c) { var f = firstFont(c, "h1"), p = fontOf(c, c.all("p")[0]); return !!f && !!p && f !== p; })],
               [K("A span around at least one word uses the heading 1's font", function (c) { var f = firstFont(c, "h1"); return !!f && c.all("span").some(function (s) { return words(c, s) >= 1 && fontOf(c, s) === f; }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The body has a background-color", T("body"), "background-color", named), HAS("The body has a text color", T("body"), "color", named),
                K("The body's text color and background-color are different", function (c) { var b = c.all("body")[0]; return !!b && differ(c, b); })]],
    "Step 5": [[NOERR], []]
  });

  /* ---------- 3.6 helpers: borders ---------- */
  function toks(v) { return String(v).trim().split(/\s+/).sort().join(" "); }
  function borderIs(prop, thick, style, color) { var want = toks(thick + " " + style + " " + color); return function (c, el) { return h.vals(c, el, prop).some(function (v) { return toks(v) === want; }); }; }
  function BIS(label, pick, prop, thick, style, color) { return K(label, function (c) { var e = pick(c); return !!e && borderIs(prop, thick, style, color)(c, e); }); }
  var BORDERRE = /^\d+(?:\.\d+)?px\s+(?:solid|dashed|dotted|double|groove|ridge)\s+\S+$/;
  function fullBorder(c, el) { return h.vals(c, el, "border").some(function (v) { return BORDERRE.test(v) && named(h.borderColor(v)); }); }
  function stylesUsed(c) { var u = {}; h.order(c).forEach(function (e) { h.vals(c, e, "border").forEach(function (v) { if (BORDERRE.test(v)) u[h.borderStyle(v)] = 1; }); }); return Object.keys(u); }
  function sideBorders(c, el) { return ["top", "bottom", "left", "right"].filter(function (s) { return h.vals(c, el, "border-" + s).some(function (v) { return BORDERRE.test(v); }); }); }

  /* =============== 3.6 Walkthrough ("6.4w"): Game Night =============== */
  LAB("6.4w", {
    "Step 1": [SKELETON1("Game Night"),
      [SAYS("The heading 1 says exactly Game Night", T("h1"), "Game Night"), SAYS("The heading 2 says exactly Friday at Six", T("h2"), "Friday at Six"),
       SAYS("Paragraph 1 says exactly Snacks are free all night.", PN(0), "Snacks are free all night."), SAYS("Paragraph 2 says exactly Bring a friend.", PN(1), "Bring a friend."), SAYS("Paragraph 3 says exactly Everyone gets a prize.", PN(2), "Everyone gets a prize."),
       SAYS("Paragraph 4 says exactly Games start at seven.", PN(3), "Games start at seven."), SAYS("Paragraph 5 says exactly See you Friday.", PN(4), "See you Friday."), ONLY("The page has 1 heading 1, 1 heading 2 and 5 paragraphs", { h1: 1, h2: 1, p: 5 })]],
    "Step 2": [[BIS("The heading 1 has border: 4px solid navy", T("h1"), "border", "4px", "solid", "navy")], [BIS("Paragraph 1 has border: 3px dotted green", PN(0), "border", "3px", "dotted", "green")]],
    "Step 3": [[BIS("Paragraph 2 has border: 6px double purple", PN(1), "border", "6px", "double", "purple")], [BIS("Paragraph 3 has border: 5px groove orange", PN(2), "border", "5px", "groove", "orange")], [BIS("Paragraph 4 has border: 5px ridge teal", PN(3), "border", "5px", "ridge", "teal")]],
    "Step 4": [[BIS("The heading 2 has border-bottom: 3px dashed red", T("h2"), "border-bottom", "3px", "dashed", "red"), K("The heading 2 has no full border (only the bottom line)", function (c) { var e = c.all("h2")[0]; return !!e && sideBorders(c, e).length > 0 && h.vals(c, e, "border").length === 0; })],
               [BIS("Paragraph 5 has border-left: 8px solid black", PN(4), "border-left", "8px", "solid", "black"), K("Paragraph 5 has no full border (only the left line)", function (c) { var e = PN(4)(c); return !!e && sideBorders(c, e).length > 0 && h.vals(c, e, "border").length === 0; })]],
    "Step 5": [[NOERR], []]
  });

  /* =============== 3.6 Assignment ("6.4a"): a Pokemon trading card =============== */
  LAB("6.4a", {
    "Step 1": SKELETON3("Pokemon Card"),
    "Step 2": [[SAYS("The heading 1 says exactly Pikachu", T("h1"), "Pikachu"), CNT("There is a heading 2", "h2", 1)],
               [K("There are at least 4 paragraphs, each with at least 3 words", function (c) { var a = c.all("p"); return a.length >= 4 && a.every(function (p) { return words(c, p) >= 3; }); })]],
    "Step 3": [[K("The heading 1 has a border on all four sides, at least 4px thick, with a named color", function (c) { var e = c.all("h1")[0]; return !!e && h.vals(c, e, "border").some(function (v) { return BORDERRE.test(v) && parseFloat(v) >= 4 && named(h.borderColor(v)); }); })],
               [K("The heading 2 has a border on the bottom only (border-bottom, and no full border)", function (c) { var e = c.all("h2")[0]; return !!e && sideBorders(c, e).join() === "bottom" && h.vals(c, e, "border").length === 0; })],
               [K("At least 4 paragraphs have a full border with a thickness, a style and a named color", function (c) { return c.all("p").filter(function (p) { return fullBorder(c, p); }).length >= 4; }),
                K("The page uses at least 4 different border styles (from solid, dashed, dotted, double, groove, ridge)", function (c) { return stylesUsed(c).length >= 4; })],
               [K("One paragraph has a border on only its left or only its right side", function (c) { return c.all("p").some(function (p) { var s = sideBorders(c, p); return s.length === 1 && /left|right/.test(s[0]) && h.vals(c, p, "border").length === 0; }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center")), HAS("The heading 1 has a font-size of at least 40px", T("h1"), "font-size", pxGE(40))].concat(BODYCOLORS)],
    "Step 4": [[NOERR], []]
  });

  /* ---------- 3.7 helpers: images and the favicon ---------- */
  var LABURL = "https://schscomputerscience.com/ist/unit-6/lab/";
  var webSrc = function (src) { return /^https:\/\//i.test(src || "") || /^\/api\/code\?img=/.test(src || ""); };
  function faviconEls(c) { return c.all("link").filter(function (l) { return /^(shortcut\s+)?icon$/i.test((l.attrs.rel || "").trim()) && /\S/.test(l.attrs.href || ""); }); }
  var FAVICON = K("There is a favicon: a link tag with rel=\"icon\" and an href", function (c) { return faviconEls(c).length >= 1; });
  var FAVHEAD = K("The favicon link is inside the head tags", function (c) { var f = faviconEls(c); return f.length >= 1 && f.every(function (l) { return !!c.ancestor(l, ["head"]); }); });
  var IMG = function (n) { return function (c) { return c.all("img")[n] || null; }; };
  var realAlt = function (i) { var a = String(i.attrs.alt || "").trim(); return a.split(/\s+/).filter(Boolean).length >= 2 && a.toLowerCase() !== "describe your image here"; };
  var NOHEIGHT = K("Pictures are sized with a width style only (no height, so nothing is squished)", function (c) { return c.all("img").length > 0 && c.all("img").every(function (i) { return h.vals(c, i, "height").length === 0 && !("height" in i.attrs) && !("width" in i.attrs); }); });
  var NOCLOSEIMG = K("The img tags stand alone (there is no </img> closing tag)", function (c) { return c.count("img") >= 1 && !/<\/img\s*>/i.test(src(c)); });
  var pct = function (v) { return /^\d+(?:\.\d+)?%$/.test(v); };

  /* =============== 3.7 Walkthrough ("6.7w"): Space Camp =============== */
  LAB("6.7w", {
    "Step 1": [SKELETON1("Space Camp"),
      [SAYS("The heading 1 says exactly Space Camp", T("h1"), "Space Camp"), SAYS("The paragraph says exactly Blast off this summer.", T("p"), "Blast off this summer."), ONLY("The page has 1 heading 1 and 1 paragraph", { h1: 1, p: 1 })]],
    "Step 2": [[FAVICON, FAVHEAD, K("The favicon points at " + LABURL + "rocket.svg", function (c) { var f = faviconEls(c)[0]; return !!f && f.attrs.href === LABURL + "rocket.svg"; }), K("The favicon link stands alone (no closing tag)", function (c) { return faviconEls(c).length >= 1 && !/<\/link\s*>/i.test(src(c)); })]],
    "Step 3": [[K("There is an img tag right under the heading 1", function (c) { var n = h.nextEl(c.all("h1")[0]); return !!n && n.tag === "img"; }), K("Its src is " + LABURL + "rocket.svg", function (c) { var i = IMG(0)(c); return !!i && i.attrs.src === LABURL + "rocket.svg"; }),
                K("Its alt says exactly A red and white rocket flying through space", function (c) { var i = IMG(0)(c); return !!i && norm(i.attrs.alt || "") === "A red and white rocket flying through space"; }), NOCLOSEIMG]],
    "Step 4": [[HAS("The rocket picture has width: 200px", IMG(0), "width", eq("200px")), NOHEIGHT],
               [K("A second img tag is under the paragraph, with the planet.svg address", function (c) { var i = IMG(1)(c), p = c.all("p")[0], n = h.nextEl(p); return c.count("img") === 2 && !!i && n === i && i.attrs.src === LABURL + "planet.svg"; }),
                K("Its alt says exactly A purple planet with a yellow ring", function (c) { var i = IMG(1)(c); return !!i && norm(i.attrs.alt || "") === "A purple planet with a yellow ring"; }), HAS("The planet picture has width: 50%", IMG(1), "width", eq("50%"))]],
    "Step 5": [[NOERR], []]
  });

  /* =============== 3.7 Assignment ("6.7a"): an Apple Store page =============== */
  LAB("6.7a", {
    "Step 1": SKELETON3("Apple Store"),
    "Step 2": [[SAYS("The heading 1 says exactly Apple Store", T("h1"), "Apple Store"), K("There are at least 2 paragraphs, each with at least 5 words", function (c) { var a = c.all("p"); return a.length >= 2 && a.every(function (p) { return words(c, p) >= 5; }); })]],
    "Step 3": [[FAVICON, FAVHEAD]],
    "Step 4": [[K("There are at least 3 pictures (img tags)", function (c) { return c.count("img") >= 3; }), K("Every picture has a src that is a web address starting with https://, or one you uploaded", function (c) { var a = c.all("img"); return a.length >= 3 && a.every(function (i) { return webSrc(i.attrs.src); }); }), NOCLOSEIMG],
               [K("Every picture has a real alt description (at least 2 words)", function (c) { var a = c.all("img"); return a.length >= 3 && a.every(realAlt); })],
               [K("At least one picture has a width in px", function (c) { return c.all("img").some(function (i) { return has(c, i, "width", h.isPx); }); }), K("At least one picture has a width in %", function (c) { return c.all("img").some(function (i) { return has(c, i, "width", pct); }); }), NOHEIGHT],
               [K("One picture has a border (thickness, style, named color)", function (c) { return c.all("img").some(function (i) { return h.vals(c, i, "border").some(function (v) { return BORDERRE.test(v) && named(h.borderColor(v)); }); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center"))].concat(BODYCOLORS)],
    "Step 5": [[NOERR], []]
  });

  /* ---------- 3.8 helpers: emojis and symbols (the emoji picker adds invisible variation selectors; they never count) ---------- */
  var plainCh = function (s) { return norm(String(s).replace(/[︎️​-‍]/g, "")); };
  function SAYSE(label, pick, want) { return K(label, function (c) { var e = pick(c); return !!e && plainCh(txt(c, e)) === plainCh(want); }); }
  var CH = h.chars;
  var emo = function (s) { return CH.emojis(s).length; }, sym = function (s) { return CH.symbols(s).length; };
  function startsEmoji(c, el) { var t = plainCh(txt(c, el)), m = /^(\S+)/.exec(t); return !!m && emo(m[1]) >= 1; }

  /* =============== 3.8 Walkthrough ("6.75w"): Pizza Night =============== */
  LAB("6.75w", {
    "Step 1": [SKELETON1("Pizza Night"),
      [K("The heading 1 starts with the words Pizza Night", function (c) { var e = c.all("h1")[0]; return !!e && /^pizza night\b/i.test(plainCh(txt(c, e))); }), ONLY("The page has 1 heading 1 and 3 paragraphs", { h1: 1, p: 3 }),
       K("Paragraph 3 ends with the words Made with love", function (c) { var p = PN(2)(c); return !!p && /made with love$/i.test(plainCh(txt(c, p))); })]],
    "Step 2": [[SAYSE("The heading 1 says exactly Pizza Night 🍕 (the pizza emoji after the words)", T("h1"), "Pizza Night 🍕"), K("The pizza emoji is typed between the h1 tags, as text (no img tag)", function (c) { return emo(txt(c, c.all("h1")[0])) === 1 && c.count("img") === 0; })]],
    "Step 3": [[SAYSE("Paragraph 1 says exactly Friday at 6 → bring friends!", PN(0), "Friday at 6 → bring friends!"), K("It contains the arrow symbol →", function (c) { return /→/.test(txt(c, PN(0)(c))); })]],
    "Step 4": [[SAYSE("Paragraph 2 says exactly Rating: ★★★★★", PN(1), "Rating: ★★★★★"),
                K("The first 4 stars are in a span with color: gold and font-size: 30px", function (c) { var p = PN(1)(c), sp = p ? within(p, ["span"]) : []; return sp.length >= 1 && plainCh(txt(c, sp[0])) === "★★★★" && has(c, sp[0], "color", eq("gold")) && has(c, sp[0], "font-size", eq("30px")); }),
                K("The last star is in a second span with color: gray and font-size: 30px", function (c) { var p = PN(1)(c), sp = p ? within(p, ["span"]) : []; return sp.length === 2 && plainCh(txt(c, sp[1])) === "★" && has(c, sp[1], "color", eq("gray")) && has(c, sp[1], "font-size", eq("30px")); })]],
    "Step 5": [[SAYSE("Paragraph 3 says exactly © 2027 Pizza Night™ ♥ Made with love", PN(2), "© 2027 Pizza Night™ ♥ Made with love"),
                HAS("Paragraph 3 has text-align: center", PN(2), "text-align", eq("center")), HAS("Paragraph 3 has font-size: 14px", PN(2), "font-size", eq("14px"))]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.8 Assignment ("6.75a"): a Taco Bell menu page =============== */
  LAB("6.75a", {
    "Step 1": SKELETON3("Taco Bell Menu"),
    "Step 2": [[K("The heading 1 has the words Taco Bell in it and at least one emoji", function (c) { var e = c.all("h1")[0]; return !!e && /taco bell/i.test(txt(c, e)) && emo(txt(c, e)) >= 1; })],
               [K("There are at least 3 menu paragraphs, and each one starts with its own emoji (then at least 2 words)", function (c) { var a = c.all("p").filter(function (p) { return startsEmoji(c, p); }); return a.length >= 3 && a.every(function (p) { return plainCh(txt(c, p)).split(" ").length >= 3; }); })]],
    "Step 3": [[K("There is a rating paragraph with at least 3 star symbols (★) inside a span", function (c) { return c.all("p").some(function (p) { return within(p, ["span"]).some(function (s) { return (txt(c, s).match(/[★☆]/g) || []).length >= 3; }); }); }),
                K("The star span has a named color and a font-size in px", function (c) { return c.all("span").some(function (s) { return /[★☆]/.test(txt(c, s)) && has(c, s, "color", named) && has(c, s, "font-size", h.isPx); }); })],
               [K("There is a footer paragraph with the © and ™ symbols in it", function (c) { return c.all("p").some(function (p) { var t = txt(c, p); return /©/.test(t) && /™/.test(t); }); }),
                K("The footer paragraph is centered and its font-size is 16px or smaller", function (c) { return c.all("p").some(function (p) { return /©/.test(txt(c, p)) && /™/.test(txt(c, p)) && has(c, p, "text-align", eq("center")) && has(c, p, "font-size", pxBetween(8, 16)); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center"))].concat(BODYCOLORS)],
    "Step 4": [[NOERR], []]
  });

  /* ---------- 3.9 helpers: links ---------- */
  function realLink(a) { var hr = a.attrs.href || ""; return /^https:\/\/\S+\.\S+/.test(hr) && !/example\.(com|org|net)|^https:\/\/(www\.)?(url|address|link)/i.test(hr); }
  var newTab = function (a) { return (a.attrs.target || "") === "_blank"; };
  var LINKTEXT_BAD = /^(click here|here|link|this)$/i;
  function aIn(c, el) { return el ? within(el, ["a"]) : []; }
  var NASA = "https://www.nasa.gov";
  /* =============== 3.9 Walkthrough ("6.6w"): Space Fan Club =============== */
  LAB("6.6w", {
    "Step 1": [SKELETON1("Space Fan Club"),
      [SAYS("The heading 1 says exactly Space Fan Club", T("h1"), "Space Fan Club"), SAYS("Paragraph 1 says exactly Visit NASA to see real launches.", PN(0), "Visit NASA to see real launches."), SAYS("Paragraph 2 says exactly Join the mission", PN(1), "Join the mission"),
       SAYS("The heading 2 says exactly Moon Facts", T("h2"), "Moon Facts"), ONLY("The page has 1 heading 1, 1 heading 2 and 2 paragraphs", { h1: 1, h2: 1, p: 2 })]],
    "Step 2": [[K("The word NASA in paragraph 1 is inside an a tag", function (c) { var a = aIn(c, PN(0)(c)); return a.length === 1 && norm(txt(c, a[0])) === "NASA"; }),
                K("The link's href is " + NASA + " (it starts with https://)", function (c) { var a = aIn(c, PN(0)(c))[0]; return !!a && a.attrs.href === NASA; }), K("The link has target=\"_blank\" so it opens in a new tab", function (c) { var a = aIn(c, PN(0)(c))[0]; return !!a && newTab(a); })]],
    "Step 3": [[K("The words Join the mission are inside a strong tag, and the strong tag is inside an a tag", function (c) { var a = aIn(c, PN(1)(c))[0]; return !!a && within(a, ["strong"]).length === 1 && norm(txt(c, within(a, ["strong"])[0])) === "Join the mission"; }),
                K("The link's href is " + NASA + "/missions/ and it has target=\"_blank\"", function (c) { var a = aIn(c, PN(1)(c))[0]; return !!a && a.attrs.href === NASA + "/missions/" && newTab(a); })]],
    "Step 4": [[K("The heading 2 text Moon Facts is inside an a tag", function (c) { var a = aIn(c, c.all("h2")[0]); return a.length === 1 && norm(txt(c, a[0])) === "Moon Facts"; }),
                K("The link's href is https://en.wikipedia.org/wiki/Moon and it has target=\"_blank\"", function (c) { var a = aIn(c, c.all("h2")[0])[0]; return !!a && a.attrs.href === "https://en.wikipedia.org/wiki/Moon" && newTab(a); })]],
    "Step 5": [[K("An a tag is right under the heading 1, with an img tag inside it", function (c) { var n = h.nextEl(c.all("h1")[0]); return !!n && n.tag === "a" && within(n, ["img"]).length === 1; }),
                K("The picture is " + LABURL + "rocket.svg with the alt A red and white rocket flying through space", function (c) { var n = h.nextEl(c.all("h1")[0]), i = n && within(n, ["img"])[0]; return !!i && i.attrs.src === LABURL + "rocket.svg" && norm(i.attrs.alt || "") === "A red and white rocket flying through space"; }),
                K("The picture link goes to " + NASA + " and opens in a new tab", function (c) { var n = h.nextEl(c.all("h1")[0]); return !!n && n.tag === "a" && n.attrs.href === NASA && newTab(n); }),
                K("The picture has width: 150px and no height", function (c) { var n = h.nextEl(c.all("h1")[0]), i = n && within(n, ["img"])[0]; return !!i && has(c, i, "width", eq("150px")) && h.vals(c, i, "height").length === 0; })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.9 Assignment ("6.6a"): a YouTube favorites page =============== */
  LAB("6.6a", {
    "Step 1": SKELETON3("YouTube Favorites"),
    "Step 2": [[SAYS("The heading 1 says exactly YouTube Favorites", T("h1"), "YouTube Favorites"), CNT("There are at least 3 heading 2s", "h2", 3), K("There are at least 2 paragraphs, each with at least 5 words", function (c) { var a = c.all("p"); return a.length >= 2 && a.every(function (p) { return words(c, p) >= 5; }); })]],
    "Step 3": [[K("There are at least 3 text links, each with a real https:// address", function (c) { return c.all("a").filter(function (a) { return realLink(a) && words(c, a) >= 1; }).length >= 3; }), K("Every link on the page has a real https:// address", function (c) { var a = c.all("a"); return a.length >= 3 && a.every(realLink); }),
                K("Every link that goes to another website opens in a new tab (target=\"_blank\")", function (c) { var a = c.all("a"); return a.length >= 3 && a.every(function (x) { return newTab(x); }); }),
                K("No link says click here (the link text says what is behind it)", function (c) { var a = c.all("a"); return a.length >= 1 && a.every(function (x) { return !LINKTEXT_BAD.test(norm(txt(c, x))); }); })],
               [K("A strong tag sits inside a link, around its words", function (c) { return c.all("a").some(function (a) { return within(a, ["strong"]).length >= 1 && words(c, a) >= 1; }); })],
               [K("A whole heading (heading 2) is a link", function (c) { return c.all("h2").some(function (x) { return aIn(c, x).length === 1 && norm(txt(c, aIn(c, x)[0])) === norm(txt(c, x)); }) || c.all("a").some(function (a) { return a.children.some(function (k) { return k.tag === "h2"; }); }); })],
               [K("There is a picture that is a link (the img tag sits inside an a tag with a real https:// address)", function (c) { return c.all("img").some(function (i) { var a = c.ancestor(i, ["a"]); return !!a && realLink(a); }); }),
                K("The picture has a web address (src), a real alt description and a width in px (and no height)", function (c) { return c.all("img").some(function (i) { return c.ancestor(i, ["a"]) && webSrc(i.attrs.src) && realAlt(i) && has(c, i, "width", h.isPx) && h.vals(c, i, "height").length === 0; }); }), K("The picture link opens in a new tab", function (c) { return c.all("img").some(function (i) { var a = c.ancestor(i, ["a"]); return !!a && newTab(a); }); })],
               [HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center"))].concat(BODYCOLORS)],
    "Step 4": [[NOERR], []]
  });

  /* ---------- 3.10 helpers: lists ---------- */
  var liKids = function (l) { return l ? kids(l).filter(function (k) { return k.tag === "li"; }) : []; };
  var onlyLi = function (l) { return !!l && kids(l).length > 0 && kids(l).every(function (k) { return k.tag === "li"; }) && !l.children.some(function (k) { return k.tag === "#text" && String(k.text).trim(); }); };
  var ULn = function (n) { return function (c) { return c.all("ul")[n] || null; }; }, OLn = function (n) { return function (c) { return c.all("ol")[n] || null; }; };
  function LISTSAY(label, pick, texts) { return K(label, function (c) { var l = pick(c), li = liKids(l); return !!l && onlyLi(l) && li.length === texts.length && li.every(function (x, i) { return squash(txt(c, x)) === squash(texts[i]); }); }); }   /* spaces between two tags (like strong then em) are not kept by the page reader, so compare without spaces */
  var NOLISTSTYLE_ON_LI = K("The list-style-type style is on the list tag, not on the li tags", function (c) { return c.all("li").length > 0 && c.all("li").every(function (x) { return h.vals(c, x, "list-style-type").length === 0; }); });

  /* =============== 3.10 Walkthrough ("6.5w"): Camping Trip =============== */
  LAB("6.5w", {
    "Step 1": [SKELETON1("Camping Trip"), [SAYS("The heading 1 says exactly Camping Trip", T("h1"), "Camping Trip"), SAYS("Heading 2 number 1 says exactly Pack These", H2(0), "Pack These"), SAYS("Heading 2 number 2 says exactly Cooking Steps", H2(1), "Cooking Steps"), SAYS("Heading 2 number 3 says exactly Menu", H2(2), "Menu"),
       ONLY("The page has 1 heading 1 and 3 heading 2s", { h1: 1, h2: 3 })]],
    "Step 2": [[K("An unordered list (ul) is right under the heading Pack These", function (c) { var n = h.nextEl(H2(0)(c)); return !!n && n.tag === "ul"; }),
                LISTSAY("The ul has exactly 3 li items: Tent, Sleeping bag, Flashlight (only li tags inside the ul)", ULn(0), ["Tent", "Sleeping bag", "Flashlight"])]],
    "Step 3": [[HAS("The first ul has list-style-type: square", ULn(0), "list-style-type", eq("square")), NOLISTSTYLE_ON_LI]],
    "Step 4": [[K("An ordered list (ol) is right under the heading Cooking Steps", function (c) { var n = h.nextEl(H2(1)(c)); return !!n && n.tag === "ol"; }),
                LISTSAY("The ol has exactly 3 li items: Build a small fire, Roast the marshmallows, Eat", OLn(0), ["Build a small fire", "Roast the marshmallows", "Eat"]),
                K("In item 1, the word Build is in strong and the words a small fire are in em", function (c) { var li = liKids(OLn(0)(c))[0]; return !!li && within(li, ["strong"]).length === 1 && norm(txt(c, within(li, ["strong"])[0])) === "Build" && within(li, ["em"]).length === 1 && norm(txt(c, within(li, ["em"])[0])) === "a small fire"; })],
               [HAS("The ol has list-style-type: upper-roman", OLn(0), "list-style-type", eq("upper-roman"))]],
    "Step 5": [[K("A second ul is right under the heading Menu", function (c) { var n = h.nextEl(H2(2)(c)); return !!n && n.tag === "ul" && n === ULn(1)(c); }), LISTSAY("The menu ul has exactly 3 li items: Home, About, Contact", ULn(1), ["Home", "About", "Contact"])],
               [HAS("The menu ul has list-style-type: none", ULn(1), "list-style-type", eq("none"))],
               [K("Every li in the menu has display: inline", function (c) { var li = liKids(ULn(1)(c)); return li.length === 3 && li.every(function (x) { return has(c, x, "display", eq("inline")); }); })]],
    "Step 6": [[NOERR], []]
  });

  /* =============== 3.10 Assignment ("6.5a"): a Pizza Hut specials page =============== */
  LAB("6.5a", {
    "Step 1": SKELETON3("Pizza Hut Specials"),
    "Step 2": [[SAYS("The heading 1 says exactly Pizza Hut Specials", T("h1"), "Pizza Hut Specials"), CNT("There are at least 3 heading 2s", "h2", 3)]],
    "Step 3": [[K("There is an unordered list (ul) with at least 4 li items (only li tags inside the ul)", function (c) { return c.all("ul").some(function (l) { return onlyLi(l) && liKids(l).length >= 4; }); }),
                K("Every li in that list has a strong name and an em description", function (c) { return c.all("ul").some(function (l) { var li = liKids(l); return onlyLi(l) && li.length >= 4 && li.every(function (x) { return within(x, ["strong"]).length >= 1 && within(x, ["em"]).length >= 1; }); }); }),
                K("That ul has a marker of circle or square (list-style-type on the ul)", function (c) { return c.all("ul").some(function (l) { var li = liKids(l); return onlyLi(l) && li.length >= 4 && has(c, l, "list-style-type", function (v) { return v === "circle" || v === "square"; }); }); })],
               [K("There is an ordered list (ol) with at least 3 li items (the steps to order a pizza)", function (c) { return c.all("ol").some(function (l) { return onlyLi(l) && liKids(l).length >= 3; }); }),
                K("The ol has a marker of upper-roman, lower-roman, upper-alpha or lower-alpha", function (c) { return c.all("ol").some(function (l) { return has(c, l, "list-style-type", function (v) { return /^(upper|lower)-(roman|alpha)$/.test(v); }); }); })],
               [K("There is a menu: a ul with no markers (list-style-type: none) and at least 3 li items", function (c) { return c.all("ul").some(function (l) { return onlyLi(l) && liKids(l).length >= 3 && has(c, l, "list-style-type", eq("none")); }); }),
                K("Every li in the menu has display: inline, so the menu sits in a row", function (c) { return c.all("ul").some(function (l) { var li = liKids(l); return onlyLi(l) && li.length >= 3 && has(c, l, "list-style-type", eq("none")) && li.every(function (x) { return has(c, x, "display", eq("inline")); }); }); })],
               [K("One of your lists has a border on its tag (thickness, style, named color)", function (c) { return c.all("ul").concat(c.all("ol")).some(function (l) { return h.vals(c, l, "border").some(function (v) { return BORDERRE.test(v) && named(h.borderColor(v)); }); }); }),
                HAS("Use what you know: the heading 1 is centered", T("h1"), "text-align", eq("center"))].concat(BODYCOLORS)],
    "Step 4": [[NOERR], []]
  });
})(typeof window !== "undefined" ? window : globalThis);
