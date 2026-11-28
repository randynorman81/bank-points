/* Unit 5: Intro to CSS WALKTHROUGHS ("8.1w" ... "8.6w") and ASSIGNMENTS ("8.1a" ... "8.6a"): 5.1 External CSS and Classes, 5.2 CSS by ID, 5.3 Selectors and Specificity,
   5.4 Pseudo-classes and Hover Effects, 5.5 Flexbox, 5.6 Grid.
   ONE source of truth: every lesson below is a spec with its step text, its checks, its model page (index.html + style.css) and the page after each step. This file registers
   the checks (U7_STEPCHECKS.LESSONS) and the step text (U7_ANSWERS); tools/css5/lab5_verify.mjs reads the same specs to verify everything in a real browser.
   The checks read style.css with a small cascade (tag < class < id < inline, later rule wins a tie) so "the paragraph ends up red" is judged the way a browser judges it.
   Loaded after step-checks-w2.js (editor, grade page, server). */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS; if (!SC || !SC.W) return;
  var W = SC.W, h = SC.H, K = W.K, T = W.T, has = W.has, kids = W.kids, txt = W.txt, words = W.words, norm = W.norm, SAYS = W.SAYS, eq = W.eq, named = W.named, NOERR = W.NOERR, ONLY = W.ONLY, SKELETON1 = W.SKELETON1, SKELETON3 = W.SKELETON3, PN = W.PN;
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  /* ---------- style.css, read like a browser ---------- */
  function parseCss(css) {
    var rules = [], s = String(css || "").replace(/\/\*[\s\S]*?\*\//g, " "), re = /([^{}]+)\{([^{}]*)\}/g, m, n = 0;
    while ((m = re.exec(s))) {
      var decls = []; m[2].split(";").forEach(function (part) { var i = part.indexOf(":"); if (i < 1) return; var p = part.slice(0, i).trim().toLowerCase(), v = part.slice(i + 1).trim().toLowerCase().replace(/\s+/g, " "); if (p && v && /^[a-z-]+$/.test(p)) decls.push({ prop: p, val: v }); });
      rules.push({ sels: m[1].split(",").map(function (x) { return x.trim().toLowerCase().replace(/\s+/g, " "); }).filter(Boolean), decls: decls, order: n++ });
    }
    return rules;
  }
  /* the page the checks see has the link replaced by the css (html-check context), so the link itself is read from the page text */
  function linkTags(c) { var m = /<head\b[^>]*>([\s\S]*?)<\/head\s*>/i.exec(c.rawSrc || ""); return m ? (m[1].match(/<link\b[^>]*>/gi) || []) : []; }
  function linked(c) { return linkTags(c).some(function (t) { return /\brel="stylesheet"/i.test(t) && /\bhref="style\.css"/.test(t); }); }
  function rulesOf(c) { if (!c.__css) c.__css = linked(c) ? parseCss(c.cssFile) : []; return c.__css; }
  function compound(s) { var m = /^([a-z][a-z0-9]*)?((?:[.#:][a-z0-9_-]+)*)$/.exec(s); if (!m) return null; var o = { tag: m[1] || "", cls: [], id: "", ps: [] }; (m[2].match(/[.#:][a-z0-9_-]+/g) || []).forEach(function (x) { if (x[0] === ".") o.cls.push(x.slice(1)); else if (x[0] === "#") o.id = x.slice(1); else o.ps.push(x.slice(1)); }); return o; }
  function matchC(el, o, state) {
    if (o.tag && el.tag !== o.tag) return false; var cl = String(el.attrs["class"] || "").toLowerCase().split(/\s+/);
    if (o.cls.some(function (k) { return cl.indexOf(k) < 0; })) return false; if (o.id && String(el.attrs.id || "").toLowerCase() !== o.id) return false;
    return o.ps.every(function (p) { return /^(hover|focus|active)$/.test(p) && state === p; });
  }
  function matchSel(el, sel, state) {
    var parts = sel.split(" "), cs = parts.map(compound); if (cs.some(function (x) { return !x; })) return null;
    if (!matchC(el, cs[cs.length - 1], state)) return null;
    var e = el.parent, i = cs.length - 2; while (i >= 0) { while (e && !(e.tag !== "#root" && matchC(e, cs[i], null))) e = e.parent; if (!e) return null; e = e.parent; i--; }
    var ids = 0, cls = 0, tags = 0; cs.forEach(function (o) { if (o.id) ids++; cls += o.cls.length + o.ps.length; if (o.tag) tags++; }); return [ids, cls, tags];
  }
  function allEls(c) { var out = []; (function w(n) { kids(n).forEach(function (k) { out.push(k); w(k); }); })(c.tree); return out; }
  var cmp = function (a, b) { return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]; };
  /* the value that wins for a property on an element (null when no rule sets it); state is null, "hover", "focus" or "active" */
  function win(c, el, prop, state) {
    if (!el) return null; var best = null, bs = null, bo = -1;
    rulesOf(c).forEach(function (r) { var d = null; r.decls.forEach(function (x) { if (x.prop === prop) d = x; }); if (!d) return;
      r.sels.forEach(function (s) { var sp = matchSel(el, s, state || null); if (!sp) return; var k = cmp(sp, bs || [-1, 0, 0]); if (!bs || k > 0 || (k === 0 && r.order > bo)) { best = d.val; bs = sp; bo = r.order; } }); });
    var inl = c.inline.filter(function (d) { return d.el === el && d.prop === prop; }).pop(); if (inl) best = String(inl.value).replace(/;\s*$/, "").trim().toLowerCase();
    return best;
  }
  function ok(test, v) { return v !== null && (typeof test === "function" ? test(v) : v === String(test).toLowerCase()); }
  var pxv = function (n) { return function (v) { return v === n + "px"; }; };
  var pxBetween = function (a, b) { return function (v) { return /^\d+(\.\d+)?px$/.test(v) && parseFloat(v) >= a && parseFloat(v) <= b; }; };
  var pxGE = function (n) { return function (v) { return /^\d+(\.\d+)?px$/.test(v) && parseFloat(v) >= n; }; };
  var sameSet = function (list) { return function (v) { return norm(v).split(" ").sort().join(" ") === list.split(" ").sort().join(" "); }; };
  var BORDERV = function (v) { return /^\d+(\.\d+)?px (solid|dashed|dotted) \S+$/.test(norm(v)) && named(norm(v).split(" ")[2]); };
  var secs = function (v) { return /^\d*\.?\d+s$/.test(v) && parseFloat(v) > 0; };

  /* ---------- checks ---------- */
  var LINK = [K("There is a link tag inside the head with rel=\"stylesheet\" and href=\"style.css\"", linked), K("The link tag stands alone (it has no closing tag)", function (c) { return linked(c) && !/<\/link\s*>/i.test(c.rawSrc || "") && !/<link\b[^>]*\/\s*>/i.test(c.rawSrc || ""); })];
  var NOSTYLETAG = K("The page has no style tag: all the styling lives in style.css", function (c) { return /<body\b/i.test(c.rawSrc || "") && !/<style\b/i.test(c.rawSrc || ""); });
  var NOINLINE = K("The page has no style attributes: all the styling lives in style.css", function (c) { return /<body\b/i.test(c.rawSrc || "") && c.inline.length === 0; });
  function RULE(label, sel, prop, test) { sel = sel.toLowerCase(); return K(label, function (c) { return rulesOf(c).some(function (r) { return r.sels.indexOf(sel) > -1 && r.decls.some(function (d) { return d.prop === prop && ok(test, d.val); }); }); }); }
  function HASRULE(label, sel) { sel = sel.toLowerCase(); return K(label, function (c) { return rulesOf(c).some(function (r) { return r.sels.indexOf(sel) > -1 && r.decls.length > 0; }); }); }
  function PICKALL(tag, cls) { return function (c) { return c.all(tag).filter(function (e) { return !cls || String(e.attrs["class"] || "").split(/\s+/).indexOf(cls) > -1; }); }; }
  function WINS(label, pick, prop, test, state) { return K(label, function (c) { var e = pick(c); return !!e && ok(test, win(c, e, prop, state)); }); }
  function WINSALL(label, pickAll, min, prop, test, state) { return K(label, function (c) { var a = pickAll(c); return a.length >= min && a.every(function (e) { return ok(test, win(c, e, prop, state)); }); }); }
  var withClass = function (tag, cls, i) { return function (c) { return PICKALL(tag, cls)(c)[i || 0] || null; }; };
  var withId = function (id) { return function (c) { return allEls(c).filter(function (e) { return e.attrs && e.attrs.id === id; })[0] || null; }; };
  function COUNTCLASS(label, tag, cls, n) { return K(label, function (c) { return PICKALL(tag, cls)(c).length === n; }); }
  /* any rule (selectors passing selTest) that declares every [prop, test] pair */
  function ANYRULE(label, selTest, props) { return K(label, function (c) { return rulesOf(c).some(function (r) { return r.sels.some(selTest) && props.every(function (p) { return r.decls.some(function (d) { return d.prop === p[0] && ok(p[1], d.val); }); }); }); }); }
  var pxAny = function (v) { return /^\d+(\.\d+)?px$/.test(v); };
  function ids(c) { return allEls(c).filter(function (e) { return e.attrs && e.attrs.id; }); }
  var UNIQUEIDS = K("No id is used twice on the page", function (c) { var seen = {}; return ids(c).length > 0 && ids(c).every(function (e) { var k = e.attrs.id.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); });
  function ANYID(label, tag, props) { return K(label, function (c) { return ids(c).some(function (e) { return (!tag || e.tag === tag) && rulesOf(c).some(function (r) { return r.sels.indexOf("#" + e.attrs.id.toLowerCase()) > -1 && props.every(function (p) { return r.decls.some(function (d) { return d.prop === p[0] && ok(p[1], d.val); }); }); }); }); }); }
  /* a class name the page uses on at least n elements (any name the student picked) that has a rule in style.css with the given props */
  function classUsed(c, n) { var cnt = {}; allEls(c).forEach(function (e) { if (e.tag === "#text" || !e.attrs) return; String(e.attrs["class"] || "").split(/\s+/).filter(Boolean).forEach(function (k) { cnt[k.toLowerCase()] = (cnt[k.toLowerCase()] || 0) + 1; }); }); return Object.keys(cnt).filter(function (k) { return cnt[k] >= n; }); }
  function ANYCLASS(label, n, props) { return K(label, function (c) { return classUsed(c, n).some(function (k) { return rulesOf(c).some(function (r) { return r.sels.indexOf("." + k) > -1 && props.every(function (p) { return r.decls.some(function (d) { return d.prop === p[0] && ok(p[1], d.val); }); }); }); }); }); }
  var BODYCOLORS = [WINS("The body ends up with a background-color", T("body"), "background-color", named), WINS("The body ends up with a text color that is different from its background", T("body"), "color", function (v) { return named(v); })];
  root.U7_CSSLABS = { rulesOf: rulesOf, win: win, parseCss: parseCss, linked: linked };
  /* ---------- the specs ---------- */
  var LABS = []; root.U7_CSSLABS.LABS = LABS;
  var CODE = function (t) { return { code: t }; }, P = function (t) { return { p: t }; };
  var TYPEIT = "**Type it yourself, exactly as shown.** Typing the rules is how they stick, even where pasting is allowed.";
  function html(title, body, link) { return "<!DOCTYPE html>\n<html>\n<head>\n<title>" + title + "</title>\n" + (link === false ? "" : "<link rel=\"stylesheet\" href=\"style.css\">\n") + "</head>\n<body>\n" + body + "</body>\n</html>\n"; }
  /* a walkthrough from: title, body, the css pieces (one per styling step), and steps = [{title, bullets: [{text, checks:[...] }...], pre, post}] after the two fixed first steps */
  function lab(o) { LABS.push(o); register(o); return o; }
  function register(o) {
    var steps = {}, text = [{ h: "What you are building" }, P(o.intro), { map: o.steps.map(function (s) { return s.title; }) }, P("Stuck? Read the notes: schscomputerscience.com/ist/unit-8/" + o.notes)];
    o.steps.forEach(function (s, i) { var key = "Step " + (i + 1); steps[key] = s.bullets.map(function (b) { return b.checks; }); text.push({ h: key + ": " + s.title }); (s.pre || []).forEach(function (x) { text.push(x); }); text.push({ build: s.bullets.map(function (b) { return b.text; }) }); (s.post || []).forEach(function (x) { text.push(x); }); });
    var keys = Object.keys(steps), last = steps[keys[keys.length - 1]]; last.comment = false;
    SC.LESSONS[o.id] = { inlineOnly: false, steps: steps }; A[o.id] = text;
  }
  /* style.css is written correctly: balanced braces, only selectors and property names from the course, values with the right shape, and every class and id selector aims at something on the page */
  var TAGS = "html head title body h1 h2 h3 h4 h5 h6 p a ul ol li div span strong em img table tr th td".split(" ");
  var PROPS = "color background-color font-size font-family text-align text-transform border border-top border-bottom border-left border-right width height padding padding-top padding-right padding-bottom padding-left margin margin-top margin-right margin-bottom margin-left display vertical-align list-style-type transition justify-content align-items flex-direction gap grid-template-columns".split(" ");
  var LEN = /^(\d+(\.\d+)?(px|%)|0|auto)$/;
  function cssIssues(c) {
    var raw = String(c.cssFile || "").replace(/\/\*[\s\S]*?\*\//g, " "), out = [];
    if (!raw.trim()) return ["style.css is empty"];
    if (/<\/?[a-z]/i.test(raw)) out.push("style.css has an HTML tag in it (a CSS file holds only rules)");
    if ((raw.match(/\{/g) || []).length !== (raw.match(/\}/g) || []).length) out.push("the { and } do not match");
    var re = /([^{}]+)\{([^{}]*)\}/g, m, left = raw.replace(re, "").trim(); if (left) out.push("stray text outside the rules: " + left.slice(0, 30));
    var els = allEls(c);
    while ((m = re.exec(raw))) {
      m[1].split(",").forEach(function (sel) { sel = sel.trim().toLowerCase().replace(/\s+/g, " "); var parts = sel.split(" ");
        parts.forEach(function (pt) { var o = compound(pt); if (!o) { out.push("the selector " + sel + " is not written correctly"); return; } if (o.tag && TAGS.indexOf(o.tag) < 0) out.push("the selector " + sel + " names a tag that does not exist"); o.ps.forEach(function (x) { if (!/^(hover|focus|active)$/.test(x)) out.push("the selector " + sel + " has a pseudo-class that is not written correctly"); });
          o.cls.forEach(function (k) { if (!els.some(function (e) { return (" " + String(e.attrs["class"] || "").toLowerCase().split(/\s+/).join(" ") + " ").indexOf(" " + k + " ") > -1; })) out.push("no element on the page wears the class " + k); });
          if (o.id && !els.some(function (e) { return String(e.attrs.id || "").toLowerCase() === o.id; })) out.push("no element on the page has the id " + o.id); }); });
      m[2].split(";").forEach(function (part) { if (!part.trim()) return; var i = part.indexOf(":"); if (i < 1) { out.push("a line without a colon: " + part.trim().slice(0, 30)); return; }
        var p = part.slice(0, i).trim().toLowerCase(), v = part.slice(i + 1).trim().toLowerCase().replace(/\s+/g, " ");
        if (PROPS.indexOf(p) < 0) { out.push(p + " is not a property from this course"); return; }
        if (!v) out.push(p + " has no value"); else if (/["']/.test(v)) out.push(p + " has quotes around its value"); else if (/:/.test(v)) out.push("a semicolon is missing before " + v.slice(0, 20));
        else if (/color$/.test(p)) { if (!named(v)) out.push(p + ": " + v + " is not a color"); }
        else if (/^(padding|margin)(-|$)/.test(p) || p === "gap") { if (!v.split(" ").every(function (x) { return LEN.test(x); })) out.push(p + ": " + v + " is not a size"); }
        else if (p === "font-size" || p === "height") { if (!/^\d+(\.\d+)?px$/.test(v)) out.push(p + ": " + v + " is not a size in pixels"); }
        else if (p === "width") { if (!LEN.test(v)) out.push("width: " + v + " is not a size"); }
        else if (/^border/.test(p)) { if (!/^\d+(\.\d+)?px (solid|dashed|dotted) \S+$/.test(v) || !named(v.split(" ")[2])) out.push(p + ": " + v + " is not thickness, style and color"); }
        else if (p === "display") { if (!/^(block|inline|inline-block|flex|grid|none)$/.test(v)) out.push("display: " + v + " is not a display value"); }
        else if (p === "text-align") { if (!/^(left|center|right)$/.test(v)) out.push("text-align: " + v + " is not left, center or right"); }
        else if (p === "justify-content") { if (!/^(flex-start|center|flex-end|space-between|space-around)$/.test(v)) out.push("justify-content: " + v + " is not a value from the lesson"); }
        else if (p === "align-items") { if (!/^(flex-start|center|flex-end|stretch)$/.test(v)) out.push("align-items: " + v + " is not a value from the lesson"); }
        else if (p === "flex-direction") { if (!/^(row|column)$/.test(v)) out.push("flex-direction: " + v + " is not row or column"); }
        else if (p === "grid-template-columns") { if (!v.split(" ").every(function (x) { return /^(\d+fr|\d+px)$/.test(x); })) out.push("grid-template-columns: " + v + " is not written with fr and px sizes separated by spaces"); }
        else if (p === "transition") { if (!/^[a-z-]+ \d*\.?\d+s$/.test(v)) out.push("transition: " + v + " is not a property and a time in seconds"); }
        else if (p === "text-transform") { if (!/^(uppercase|lowercase|capitalize|none)$/.test(v)) out.push("text-transform: " + v + " is not a value from the course"); }
        else if (p === "vertical-align") { if (!/^(top|middle|bottom|baseline)$/.test(v)) out.push("vertical-align: " + v + " is not a value from the course"); } });
    }
    return out;
  }
  var CSSOK = K("style.css is written correctly: balanced braces, a colon and a semicolon on every line, real property names, colors and sizes, and every class and id in it matches something on the page", function (c) { return linked(c) && cssIssues(c).length === 0; });
  var ATTRSOK = K("Every class and id on the page is written correctly: no dot, no hash, no commas, and no attribute is misspelled", function (c) { var src = String(c.rawSrc || "").replace(/<!--[\s\S]*?-->/g, ""), tags = src.match(/<[a-zA-Z][^<>]*>/g) || [], okAttr = { "class": 1, id: 1, href: 1, rel: 1, target: 1, src: 1, alt: 1, lang: 1, charset: 1 };
    return /<body\b/i.test(src) && tags.every(function (t) { var rest = t.replace(/^<[a-zA-Z][a-zA-Z0-9]*/, "").replace(/\/?>$/, ""), ok = true; rest.replace(/\s([a-zA-Z-]+)\s*=\s*"([^"]*)"/g, function (m, n, v) { n = n.toLowerCase(); if (!okAttr[n]) ok = false; if (n === "class" && !/^[a-zA-Z][\w-]*( [a-zA-Z][\w-]*)*$/.test(v)) ok = false; if (n === "id" && !/^[a-zA-Z][\w-]*$/.test(v)) ok = false; return m; }); return ok; }); });
  var DONE = { title: "Check and submit", bullets: [{ text: "Fix every **red line number** in your code (a red number means a problem on that line), in index.html and in style.css. Check that every class and id is written **without a dot or a hash** in the HTML, and that **all your styling lives in style.css** (no style tag and no style attributes)", checks: [NOERR, CSSOK, ATTRSOK, NOSTYLETAG, NOINLINE] }, { text: "Choose your class period at the top, then click **Submit**", checks: [] }] };
  W.CSS = { linked: linked, cssIssues: cssIssues, CSSOK: CSSOK, K: K, T: T, LABS: LABS, lab: lab, register: register, html: html, CODE: CODE, P: P, TYPEIT: TYPEIT, DONE: DONE, LINK: LINK, RULE: RULE, HASRULE: HASRULE, WINS: WINS, WINSALL: WINSALL, PICKALL: PICKALL, withClass: withClass, withId: withId, COUNTCLASS: COUNTCLASS, ANYCLASS: ANYCLASS, ANYID: ANYID, ANYRULE: ANYRULE, rulesOf: rulesOf, uniqueIds: function (c) { var seen = {}; return ids(c).every(function (e) { var k = e.attrs.id.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); }, pxAny: pxAny, allEls: allEls, linkTags: linkTags, UNIQUEIDS: UNIQUEIDS, ids: ids, classUsed: classUsed,
    NOSTYLETAG: NOSTYLETAG, NOINLINE: NOINLINE, BODYCOLORS: BODYCOLORS, pxv: pxv, pxBetween: pxBetween, pxGE: pxGE, sameSet: sameSet, BORDERV: BORDERV, secs: secs, win: win, ok: ok, SAYS: SAYS, ONLY: ONLY, SKELETON1: SKELETON1, SKELETON3: SKELETON3, PN: PN, NOERR: NOERR, eq: eq, named: named, words: words, txt: txt, kids: kids, norm: norm };
})(typeof window !== "undefined" ? window : globalThis);
