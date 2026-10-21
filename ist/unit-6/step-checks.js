/* Step-by-step auto-check for the Unit 3 (HTML) assignments in the Web Editor.
   Pure JavaScript: runs in the editor, on the grading page, and in Node for testing.

   Each assignment step bullet gets a list of small checks. The editor shows "auto-check: 3 of 5 met" next to the
   bullet's checkbox and ticks it when every check is met. The first box of every step is the HTML comment
   (<!-- Step 2: ... -->). Checks only count real things the page can show: tags, where they sit, and the style values.

   LESSONS[lesson].steps["Step 2"] = [ [ [label, test(c)], ... ], ... ]   (one list of checks per bullet, in order)
*/
(function (root) {
  "use strict";
  var H = root.HTMLCheck || (typeof require !== "undefined" ? require("./html-check.js") : null);
  var NAMED = H ? H.NAMED : {};
  var inlineOnly = false;

  /* ---------- reading the page ---------- */
  function kids(n) { return n.children.filter(function (x) { return x.tag !== "#text"; }); }
  function nextEl(n) { if (!n || !n.parent) return null; var k = kids(n.parent), i = k.indexOf(n); return i >= 0 ? k[i + 1] || null : null; }
  function words(c, n) { var t = c.text(n).replace(/\s+/g, " ").trim(); return t ? t.split(" ").length : 0; }
  function txt(c, n) { return c.text(n).replace(/\s+/g, " ").trim(); }
  function inTag(c, n, tags) { return !!(n && c.ancestor(n, tags)); }
  function descendants(n) { var out = []; (function w(x) { kids(x).forEach(function (y) { out.push(y); w(y); }); })(n); return out; }
  function within(n, tags) { return descendants(n).filter(function (d) { return tags.indexOf(d.tag) > -1; }); }
  function order(c) { var out = []; (function w(x) { kids(x).forEach(function (y) { out.push(y); w(y); }); })(c.tree); return out; }
  function before(c, a, b) { var o = order(c); return o.indexOf(a) > -1 && o.indexOf(b) > -1 && o.indexOf(a) < o.indexOf(b); }

  /* every style value on one element: its style attribute, plus (unless the lesson is style-attribute only) the <style> block rules for its tag, class, or id */
  function decls(c, el) {
    var m = {};
    function add(d) { var v = String(d.value).replace(/;\s*$/, "").trim().toLowerCase(); (m[d.prop] = m[d.prop] || []).push(v); }
    c.inline.forEach(function (d) { if (d.el === el) add(d); });
    if (!inlineOnly) c.sheetRules.forEach(function (rl) {
      rl.selector.split(",").forEach(function (s) {
        s = s.trim().toLowerCase(); var cls = String(el.attrs["class"] || "").trim().toLowerCase().split(/\s+/);
        if (s === el.tag || (s.charAt(0) === "." && cls.indexOf(s.slice(1)) > -1) || (s.charAt(0) === "#" && String(el.attrs.id || "").toLowerCase() === s.slice(1)) ||
            (s.indexOf(".") > 0 && s.split(".")[0] === el.tag && cls.indexOf(s.split(".")[1]) > -1)) rl.decls.forEach(add);
      });
    });
    return m;
  }
  function vals(c, el, prop) { if (!el) return []; var d = decls(c, el); return d[prop] || []; }
  function has(c, el, prop, test) {
    return vals(c, el, prop).some(function (v) { return !test ? v !== "" : (typeof test === "function" ? test(v) : test.test(v)); });
  }
  function sheetRule(c, sel) { var out = []; c.sheetRules.forEach(function (rl) { if (rl.selector.split(",").some(function (s) { return s.trim().toLowerCase() === sel; })) out.push(rl); }); return out; }
  function ruleHas(c, sel, prop, test) { return sheetRule(c, sel).some(function (rl) { return rl.decls.some(function (d) { var v = String(d.value).replace(/;\s*$/, "").trim().toLowerCase(); return d.prop === prop && (!test || (typeof test === "function" ? test(v) : test.test(v))); }); }); }

  /* value tests */
  var isNamed = function (v) { return !!NAMED[v]; };
  var isWhite = function (v) { return v === "white" || v === "#fff" || v === "#ffffff"; };
  var isPx = function (v) { return /^\d+(\.\d+)?px$/.test(v); };
  var px = function (n) { return function (v) { return v === n + "px"; }; };
  var BORDER = /^\d+(\.\d+)?px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/;
  var bs = function (style) { return function (v) { return BORDER.test(v) && new RegExp("\\b" + style + "\\b").test(v); }; };
  var serif = function (v) { return /(^|[\s,'"])serif$/.test(v) && !/sans-serif$/.test(v); };
  var sans = function (v) { return /sans-serif$/.test(v); };
  var mono = function (v) { return /monospace$/.test(v); };
  var eq = function (s) { return function (v) { return v === s; }; };
  function borderStyle(v) { var m = /\b(solid|dashed|dotted|double|groove|ridge)\b/.exec(v || ""); return m ? m[1] : ""; }
  function borderColor(v) { var m = /^\d+(?:\.\d+)?px\s+\w+\s+(\S+)/.exec(v || ""); return m ? m[1] : ""; }

  /* ---------- pickers: each returns an element (or null) from the page ---------- */
  function T(tag, i) { return function (c) { return c.all(tag)[i || 0] || null; }; }
  function LAST(tag) { return function (c) { var a = c.all(tag); return a[a.length - 1] || null; }; }
  function HW(tag, re, i) { return function (c) { return c.all(tag).filter(function (h) { return re.test(txt(c, h)); })[i || 0] || null; }; }
  function AFTER(pick, tag) { return function (c) { var e = pick(c), n = nextEl(e); return n && (!tag || n.tag === tag) ? n : null; }; }
  function ALL(tag) { return function (c) { return c.all(tag); }; }
  /* up to n elements of a tag that follow an element as siblings (stops at the next heading, rule, or list) */
  function FOLLOW(pick, tag, count) { return function (c) { var e = pick(c), out = []; if (!e) return out; var n = nextEl(e); while (n && out.length < count) { if (n.tag === tag) out.push(n); else if (/^h[1-6]$|^hr$|^ul$|^ol$/.test(n.tag)) break; n = nextEl(n); } return out; }; }

  /* ---------- check makers ---------- */
  function K(label, fn) { return [label, function (c) { try { return !!fn(c); } catch (e) { return false; } }]; }
  function exists(label, pick) { return K(label, function (c) { return !!pick(c); }); }
  function P(label, pick, prop, test) { return K(label, function (c) { var e = pick(c); return !!e && has(c, e, prop, test); }); }
  function PX(label, pick, test) { return K(label, function (c) { var e = pick(c); return !!e && test(c, e); }); }
  function EACH(label, pickAll, count, test) { return K(label, function (c) { var a = pickAll(c); return a.length >= count && a.slice(0, count).every(function (e) { return test(c, e); }); }); }
  function CNT(label, tag, n) { return K(label, function (c) { return c.count(tag) >= n; }); }
  function IN(label, pick, tags, k) { return K(label, function (c) { var e = pick(c); return !!e && within(e, tags).length >= (k || 1); }); }
  function UNDER(label, pickA, pickB) { return K(label, function (c) { var a = pickA(c), b = pickB(c); return !!a && !!b && before(c, a, b); }); }
  var BOLD = ["strong", "b"], ITAL = ["em", "i"];

  /* ---------- the first box of every step: an HTML comment with the step number ---------- */
  function stepComment(c, n) { return new RegExp("<!--\\s*step\\s*" + n + "\\b[^>]*-->", "i").test(c.rawSrc || c.src); }

  /* ---------- pieces shared by all the lessons ---------- */
  var SKELETON = [
    K("The doctype comes first (a step comment can sit above it)", function (c) { return /^\s*(?:<!--[\s\S]*?-->\s*)*<!doctype\s+html\s*>/i.test(c.rawSrc || c.src); }),
    K("There is an <html> tag", function (c) { return c.count("html") >= 1; }),
    K("The <head> and <body> are inside <html>", function (c) { var h = c.all("html")[0]; return !!h && kids(h).some(function (k) { return k.tag === "head"; }) && kids(h).some(function (k) { return k.tag === "body"; }); }),
    K("The <head> comes before the <body>", function (c) { var s = c.rawSrc || c.src, i = s.search(/<head\b/i), j = s.search(/<body\b/i); return i >= 0 && j > i; })
  ];
  var TITLE = [
    K("There is a <title> inside the <head>", function (c) { var t = c.all("title")[0]; return !!t && inTag(c, t, ["head"]); }),
    K("The title has words in it", function (c) { var t = c.all("title")[0]; return !!t && words(c, t) >= 1; })
  ];

  var LESSONS = {};
  var HELP = { K: K, P: P, PX: PX, EACH: EACH, CNT: CNT, IN: IN, UNDER: UNDER, exists: exists, T: T, LAST: LAST, HW: HW, AFTER: AFTER, ALL: ALL, FOLLOW: FOLLOW, has: has, vals: vals, decls: decls, kids: kids, nextEl: nextEl,
    txt: txt, words: words, within: within, before: before, order: order, descendants: descendants, inTag: inTag, ruleHas: ruleHas, sheetRule: sheetRule,
    isNamed: isNamed, isWhite: isWhite, isPx: isPx, px: px, bs: bs, serif: serif, sans: sans, mono: mono, eq: eq, borderStyle: borderStyle, borderColor: borderColor,
    BOLD: BOLD, ITAL: ITAL, BORDER: BORDER, SKELETON: SKELETON, TITLE: TITLE };

  /* ---------- running ---------- */
  /* run(lesson, html, css) -> { "Step 2": { comment: true/false, bullets: [ [ {label, ok}, ... ], ... ] }, ... }, or null for a lesson with no step checks */
  function run(lesson, html, css) {
    var L = LESSONS[lesson]; if (!L) return null;
    inlineOnly = !!L.inlineOnly;
    var c = H.context(html, css), out = {}; c.lesson = lesson;
    Object.keys(L.steps).forEach(function (st) {
      var n = +(/Step (\d+)/.exec(st) || [0, 0])[1], L2 = L.steps[st];
      out[st] = { comment: L2.comment === false ? null : stepComment(c, n), bullets: L2.map(function (list) {
        return list.map(function (ck) { var ok = false; try { ok = !!ck[1](c); } catch (e) { ok = false; } return { label: ck[0], ok: ok }; });
      }) };
    });
    return out;
  }
  /* score(lesson, html, css) -> { pct, boxes, all }.  Every box (a step bullet with checks, plus the step comment where the lesson has one) counts the same,
     and a box is worth the share of its checks that are met. The score is 100 only when every check is met (it is never rounded up). */
  function score(lesson, html, css) {
    var r = run(lesson, html, css); if (!r) return null;
    var boxes = 0, credit = 0, all = true;
    Object.keys(r).forEach(function (st) {
      if (r[st].comment !== null) { boxes++; if (r[st].comment) credit++; else all = false; }
      r[st].bullets.forEach(function (b) { if (!b.length) return; boxes++; var m = b.filter(function (x) { return x.ok; }).length; credit += m / b.length; if (m < b.length) all = false; });
    });
    var pct = boxes ? Math.floor(100 * credit / boxes + 1e-9) : 0; if (!all) pct = Math.min(pct, 99);
    return { pct: pct, boxes: boxes, credit: credit, all: all };
  }
  /* the Checks list (the 50-point rubric: quality, "use what you already know", and Problems) all green */
  var ALLGREEN = K("Every item in your Checks list is green", function (c) { var rep = H.check(c.lesson, c.rawSrc, c.cssFile || ""); return rep.results.every(function (x) { return x.ok; }) && rep.errors.length === 0; });
  var NOERRORS = K("The Problems list is empty", function (c) { return String(c.rawSrc || "").trim().length > 0 && H.check(c.lesson, c.rawSrc, c.cssFile || "").errors.length === 0; });
  HELP.ALLGREEN = ALLGREEN; HELP.NOERRORS = NOERRORS;
  root.U7_STEPCHECKS = { LESSONS: LESSONS, run: run, score: score, stepComment: stepComment, H: HELP, PASS: 95 };
})(typeof window !== "undefined" ? window : globalThis);
