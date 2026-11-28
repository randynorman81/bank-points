/* Unit 6: Bootstrap WALKTHROUGHS ("9.1w" ... "9.6w") and ASSIGNMENTS ("9.1a" ... "9.6a"): 6.1 Setting Up Bootstrap, 6.2 The Grid, 6.3 Typography, Colors and Buttons, 6.4 Navbar, 6.5 Cards, 6.6 Forms.
   ONE source of truth: every lesson is a spec with its step text, checks, model page (index.html, plus style.css in 6.1), the page after each step and the browser claims (tools/bs6/lab6_*.mjs verify them in
   real Chrome with the real Bootstrap 5.3.9 stylesheet). The checks read the HTML like a browser: nesting (container > row > col), real Bootstrap class names, labels linked to fields.
   Loaded after css-labs.js (editor, grade page, server). */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS; if (!SC || !SC.W || !SC.W.CSS) return;
  var W = SC.W, C = W.CSS, K = W.K, T = W.T, norm = W.norm, txt = W.txt, words = W.words, kids = W.kids, SAYS = W.SAYS, ONLY = W.ONLY, NOERR = W.NOERR;
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};
  var BSL = {}; W.BS = BSL; var LABS = BSL.LABS = [];
  /* ---------- the Bootstrap classes this course teaches, by lesson (mirrors tools/bs6/bsgates.py) ---------- */
  var TAUGHT = [[1, /^(?:container|row|col|col-(?:[1-9]|1[0-2])|col-md-(?:[1-9]|1[0-2]))$/], [2, /^(?:text-(?:center|muted|white|primary|secondary|success|danger|warning|info)|bg-(?:primary|secondary|success|danger|warning|info|light|dark)|fw-bold|btn|btn-(?:primary|secondary|success|danger|warning|info)|mb-3|mt-3|p-[0-5])$/], [3, /^(?:navbar|navbar-expand-lg|navbar-dark|navbar-brand|navbar-nav|nav-link)$/], [4, /^(?:card|card-img-top|card-body|card-title|card-text)$/], [5, /^(?:form-label|form-control)$/]];
  var BSPREFIX = /^(?:container|row|col|btn|card|navbar|nav|form|text|bg|fw|fs|m[tbsexy]?|p[tbsexy]?|d|g|gap|justify|align|w|h|shadow|rounded|border|badge|alert|list|table|modal|carousel|collapse|dropdown|offset|order|position|float|visible|invisible|lead|display|small|mark|blockquote|img|figure|ratio|sticky|fixed|vstack|hstack|spinner|toast|progress|accordion|pagination|breadcrumb|input|row-cols)(?:-|$)/;
  /* lesson n (grid = 1 ... forms = 5; 0 = setup): a class is fine when it is a real one taught by lesson n, or one the student invented (no Bootstrap prefix) */
  function classOk(tok, n) { for (var i = 0; i < TAUGHT.length; i++) if (TAUGHT[i][1].test(tok)) return TAUGHT[i][0] <= n; return !BSPREFIX.test(tok); }
  function tokens(e) { return String((e.attrs && e.attrs["class"]) || "").split(/\s+/).filter(Boolean); }
  function allEls(c) { var out = []; (function w(n) { kids(n).forEach(function (k) { out.push(k); w(k); }); })(c.tree); return out; }
  function hasC(e, k) { return tokens(e).indexOf(k) > -1; }
  function withC(c, k, tag) { return allEls(c).filter(function (e) { return hasC(e, k) && (!tag || e.tag === tag); }); }
  function cls(e) { return tokens(e).join(" "); }
  /* ---------- checks ---------- */
  var BSHREF = /^https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5(?:\.\d+){0,2}\/dist\/css\/bootstrap(?:\.min)?\.css$/;
  function bsLinks(c) { return c.all("link").filter(function (l) { return /^stylesheet$/i.test((l.attrs.rel || "").trim()) && BSHREF.test(l.attrs.href || "") && !!c.ancestor(l, ["head"]); }); }
  var BSLINK = [K("There is a link tag inside the head with rel=\"stylesheet\" and the Bootstrap 5 address (https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css)", function (c) { return bsLinks(c).length === 1; }),
    K("The Bootstrap link tag stands alone (it has no closing tag)", function (c) { return bsLinks(c).length === 1 && !/<\/link\s*>/i.test(c.rawSrc || ""); })];
  var ATTROK = { "class": 1, id: 1, href: 1, rel: 1, target: 1, src: 1, alt: 1, lang: 1, charset: 1, type: 1, "for": 1, placeholder: 1, integrity: 1, crossorigin: 1, name: 1, content: 1 };
  function attrsOk(c) { var src = String(c.rawSrc || "").replace(/<!--[\s\S]*?-->/g, ""), tags = src.match(/<[a-zA-Z][^<>]*>/g) || [];
    return /<body\b/i.test(src) && tags.every(function (t) { var rest = t.replace(/^<[a-zA-Z][a-zA-Z0-9]*/, "").replace(/\/?>$/, ""), ok = true;
      rest.replace(/\s([a-zA-Z-]+)(?:\s*=\s*"([^"]*)")?/g, function (m, n, v) { n = n.toLowerCase(); if (!ATTROK[n]) ok = false; if (n === "id" && !/^[a-zA-Z][\w-]*$/.test(v || "")) ok = false; return m; }); return ok; }); }
  function CLASSES(n, label) { return K(label || "Every class on the page is spelled right: each Bootstrap class is a real one from this course, with no dots and no commas (a class you invented yourself is fine)", function (c) { var els = allEls(c); return els.length > 0 && els.every(function (e) { return tokens(e).every(function (t) { return classOk(t, n); }); }) && !/class="[^"]*[.,][^"]*"/.test(c.rawSrc || ""); }); }
  var ATTRS = K("Every attribute on the page is a real one written with double quotes (no misspelled attributes)", attrsOk);
  function STRUCT(label, fn) { return K(label, fn); }
  var NOSTYLE = K("The page has no style attributes and no style tags: the look comes from Bootstrap classes (and style.css where a step asks for it)", function (c) { return /<body\b/i.test(c.rawSrc || "") && c.inline.length === 0 && !/<style\b/i.test(c.rawSrc || ""); });
  /* grid helpers */
  var colTok = function (t) { return /^col(?:-md)?(?:-\d+)?$/.test(t); };
  function colsOf(row) { return kids(row).filter(function (e) { return tokens(e).some(colTok); }); }
  function span(e) { var t = tokens(e).filter(colTok)[0] || "", m = /(\d+)$/.exec(t); return m ? +m[1] : 0; }
  function rowsOf(c) { return allEls(c).filter(function (e) { return e.tag === "div" && hasC(e, "row"); }); }
  function inContainer(c, row) { var p = row.parent; return !!p && p.tag === "div" && hasC(p, "container"); }
  var GRIDOK = K("Every row is a direct child of a container div, and every column is a direct child of a row", function (c) { var r = rowsOf(c); return r.length >= 1 && r.every(function (x) { return inContainer(c, x) && colsOf(x).length === kids(x).length; }); });
  /* the registry */
  function lab(o) { LABS.push(o); register(o); return o; }
  function register(o) {
    var steps = {}, text = [{ h: "What you are building" }, { p: o.intro }, { map: o.steps.map(function (s) { return s.title; }) }, { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-9/" + o.notes }];
    o.steps.forEach(function (s, i) { var key = "Step " + (i + 1); steps[key] = s.bullets.map(function (b) { return b.checks; }); text.push({ h: key + ": " + s.title }); (s.pre || []).forEach(function (x) { text.push(x); }); text.push({ build: s.bullets.map(function (b) { return b.text; }) }); (s.post || []).forEach(function (x) { text.push(x); }); });
    var keys = Object.keys(steps); steps[keys[keys.length - 1]].comment = false;
    SC.LESSONS[o.id] = { inlineOnly: true, steps: steps }; A[o.id] = text;
  }
  function page(title, body, o) { o = o || {}; return "<!DOCTYPE html>\n<html>\n<head>\n<title>" + title + "</title>\n" + (o.bs === false ? "" : "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n") + (o.own ? "<link rel=\"stylesheet\" href=\"style.css\">\n" : "") + "</head>\n<body>\n" + body + "</body>\n</html>\n"; }
  var CODE = function (t) { return { code: t }; }, P = function (t) { return { p: t }; };
  var TYPEIT = "**Type it yourself, exactly as shown.** Typing the classes is how they stick, even where pasting is allowed.";
  var DONE = { title: "Check and submit", bullets: [{ text: "Fix every **red line number** in your code (a red number means a problem on that line). Check that every Bootstrap class is **spelled exactly right** (a misspelled class does nothing and shows no error), and that the Bootstrap look comes from classes, not style attributes", checks: [NOERR, ATTRS, NOSTYLE] }, { text: "Choose your class period at the top, then click **Submit**", checks: [] }] };
  function done(n) { return { title: "Check and submit", bullets: [{ text: DONE.bullets[0].text, checks: [NOERR, CLASSES(n), ATTRS, NOSTYLE] }, DONE.bullets[1]] }; }
  var linkStep = { title: "Link Bootstrap", bullets: [{ text: "In the head, under the title, add the Bootstrap link: `<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css\" rel=\"stylesheet\">`", checks: BSLINK }],
    pre: [P("Plug Bootstrap in the same way you plugged in style.css: a **link tag** in the **head**, standing alone. It points at Bootstrap's file on a CDN, so there is nothing to upload. This course uses version **5.3.9**. The official copy on getbootstrap.com has two extra attributes (integrity and crossorigin) that are optional."), CODE("<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css\" rel=\"stylesheet\">")] };
  BSL.done = done; BSL.lab = lab; BSL.page = page; BSL.CODE = CODE; BSL.P = P; BSL.TYPEIT = TYPEIT; BSL.DONE = DONE; BSL.linkStep = linkStep; BSL.BSLINK = BSLINK; BSL.CLASSES = CLASSES; BSL.ATTRS = ATTRS; BSL.NOSTYLE = NOSTYLE; BSL.GRIDOK = GRIDOK; BSL.STRUCT = STRUCT; BSL.allEls = allEls; BSL.withC = withC; BSL.hasC = hasC; BSL.tokens = tokens; BSL.cls = cls;
  BSL.colsOf = colsOf; BSL.span = span; BSL.rowsOf = rowsOf; BSL.bsLinks = bsLinks; BSL.classOk = classOk; BSL.BSHREF = BSHREF; BSL.K = K; BSL.T = T; BSL.SAYS = SAYS; BSL.ONLY = ONLY; BSL.words = words; BSL.txt = txt; BSL.norm = norm; BSL.kids = kids; BSL.SKELETON1 = W.SKELETON1; BSL.SKELETON3 = W.SKELETON3; BSL.PN = W.PN; BSL.realLink = W.realLink;
})(typeof window !== "undefined" ? window : globalThis);
