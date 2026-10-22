/* Unit 6 HTML checker + lesson requirements.
   Pure JavaScript (no DOM needed) so the exact same code runs in the student editor,
   the teacher grading page, and in Node for testing.

   TO CHANGE WHAT A LESSON REQUIRES: edit the LESSONS object near the bottom of this file.
   Each rule is:  r("Text the student sees", (c) => true/false)   (c = the checker context)
   Handy helpers on c:  c.count("h1")  c.has("p")  c.prop("color")  c.propValues("border")
                        c.selector("a:hover")  c.tagsIn("li","ul")  c.errors  c.tree
*/
(function (root) {
  "use strict";

  var VOID = { br: 1, hr: 1, img: 1, meta: 1, link: 1, input: 1, area: 1, base: 1, col: 1, embed: 1, source: 1, track: 1, wbr: 1 };

  // CSS properties used in Unit 6 (anything else gets a friendly warning, not a failure).
  var KNOWN_PROPS = ["color", "font-size", "font-family", "font-weight", "text-align", "text-transform", "text-decoration",
    "background-color", "background", "border", "border-radius", "border-top", "border-bottom", "border-left", "border-right",
    "border-style", "border-width", "border-color", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "width", "height", "max-width", "min-width",
    "max-height", "min-height", "display", "vertical-align", "list-style-type", "line-height", "letter-spacing",
    "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius", "float", "cursor",
    /* CSS unit (8.x): flexbox, grid, hover/transition, and common extras */
    "justify-content", "align-items", "align-content", "align-self", "justify-items", "place-items", "flex", "flex-direction",
    "flex-wrap", "flex-grow", "flex-shrink", "flex-basis", "gap", "row-gap", "column-gap", "grid-gap", "grid-template-columns",
    "grid-template-rows", "grid-template-areas", "grid-column", "grid-row", "grid-area", "transition", "transition-property",
    "transition-duration", "transition-timing-function", "transition-delay", "transform", "opacity", "box-shadow", "text-shadow",
    "font-style", "position", "top", "right", "bottom", "left", "z-index", "overflow", "object-fit", "box-sizing", "list-style",
    "background-image", "background-size", "background-position", "background-repeat", "outline"];

  var NAMED_COLORS = ("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen").split(" ");
  var NAMED = {}; NAMED_COLORS.forEach(function (n) { NAMED[n] = 1; });

  function lineOf(src, idx) { var n = 1; for (var i = 0; i < idx && i < src.length; i++) if (src.charCodeAt(i) === 10) n++; return n; }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  function suggest(word, list) {
    var best = null, bd = 99;
    list.forEach(function (w) { var d = lev(word, w); if (d < bd) { bd = d; best = w; } });
    return bd <= 2 ? best : null;
  }

  /* ---------- parse attributes ---------- */
  function parseAttrs(str, line, warnings) {
    var attrs = {}, re = /([^\s=\/"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g, m;
    while ((m = re.exec(str))) {
      var name = m[1].toLowerCase();
      var val = m[2] !== undefined ? m[2] : (m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : ""));
      if (m[4] !== undefined) warnings.push({ line: line, msg: 'The value of "' + name + '" needs double quotes: ' + name + '="' + m[4] + '"' });
      else if (m[3] !== undefined) warnings.push({ line: line, msg: 'Use double quotes (") instead of single quotes (\') around the value of "' + name + '".' });
      attrs[name] = val;
    }
    return attrs;
  }

  /* ---------- tokenize + build tree ---------- */
  function parse(src) {
    var root = { tag: "#root", attrs: {}, children: [], parent: null, line: 1 };
    var errors = [], warnings = [], stack = [root], text = [], forced = {}, openRaw = null;
    var re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/\s*([a-zA-Z][a-zA-Z0-9-]*)\s*>|<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/gi;
    var last = 0, m, hasDoctype = false;

    function cur() { return stack[stack.length - 1]; }
    function addText(s, at) { if (s.trim()) cur().children.push({ tag: "#text", text: s, line: lineOf(src, at), parent: cur() }); }

    while ((m = re.exec(src))) {
      addText(src.slice(last, m.index), last);
      last = m.index + m[0].length;
      var line = lineOf(src, m.index);
      if (/^<!--/.test(m[0])) continue;
      if (/^<!doctype/i.test(m[0])) { hasDoctype = true; continue; }
      if (m[1]) { // closing tag
        var name = m[1].toLowerCase();
        if (VOID[name]) { errors.push({ line: line, msg: "<" + name + "> is an empty tag. It never gets a closing tag. Delete </" + name + ">." }); continue; }
        var top = cur();
        if (top.tag === name) { stack.pop(); top.closeLine = line; continue; }
        var idx = -1;
        for (var i = stack.length - 1; i > 0; i--) if (stack[i].tag === name) { idx = i; break; }
        if (idx === -1 && forced[name]) { forced[name]--; continue; }
        if (idx === -1) { errors.push({ line: line, msg: "Found </" + name + "> but there is no matching <" + name + "> open. Check for an extra or misspelled closing tag." }); continue; }
        // closing something lower in the stack: everything above it was never closed (or is mis-nested)
        var above = stack.slice(idx + 1).map(function (n) { return n.tag; });
        errors.push({ line: line, msg: "Tags are not mirrored. </" + name + "> arrived while <" + above.join("> and <") + "> was still open. Close the last tag you opened first (line " + stack[stack.length - 1].line + ")." });
        for (var f = idx + 1; f < stack.length; f++) forced[stack[f].tag] = (forced[stack[f].tag] || 0) + 1;
        while (stack.length - 1 >= idx) { var n = stack.pop(); n.closeLine = line; }
        continue;
      }
      // opening tag
      var tag = m[2].toLowerCase(), rawAttrs = m[3] || "";
      var selfClosed = /\/\s*$/.test(rawAttrs);
      if (selfClosed) rawAttrs = rawAttrs.replace(/\/\s*$/, "");
      var node = { tag: tag, attrs: parseAttrs(rawAttrs, line, warnings), children: [], parent: cur(), line: line, raw: m[0] };
      cur().children.push(node);
      if (VOID[tag]) continue;
      if (selfClosed) { warnings.push({ line: line, msg: "<" + tag + "> does not need a slash. Use <" + tag + "></" + tag + "> with content between." }); continue; }
      if (tag === "style" || tag === "script" || tag === "title" || tag === "textarea") {
        // raw text element: grab text until its closing tag
        var endRe = new RegExp("</\\s*" + tag + "\\s*>", "ig"); endRe.lastIndex = last;
        var em = endRe.exec(src);
        if (em) { node.rawText = src.slice(last, em.index); node.closeLine = lineOf(src, em.index); last = em.index + em[0].length; re.lastIndex = last; }
        else { errors.push({ line: line, msg: "<" + tag + "> is never closed. Add </" + tag + ">." }); node.rawText = src.slice(last); openRaw = tag; last = src.length; re.lastIndex = last; }
        continue;
      }
      stack.push(node);
    }
    addText(src.slice(last), last);
    var openNames = stack.slice(1).map(function (n) { return n.tag; });
    for (var k = stack.length - 1; k > 0; k--) errors.push({ line: stack[k].line, msg: "<" + stack[k].tag + "> on line " + stack[k].line + " is never closed. Add </" + stack[k].tag + ">." });
    return { root: root, errors: errors, warnings: warnings, hasDoctype: hasDoctype, open: openNames, openRaw: openRaw };
  }

  /* ---------- walk helpers ---------- */
  function walk(node, fn) { node.children.forEach(function (c) { if (c.tag !== "#text") { fn(c); walk(c, fn); } }); }
  function findAll(node, tag) { var out = []; walk(node, function (n) { if (n.tag === tag) out.push(n); }); return out; }
  function textOf(node) { var s = ""; (function w(n) { if (n.rawText !== undefined) { s += n.rawText; } n.children.forEach(function (c) { if (c.tag === "#text") s += c.text; else w(c); }); })(node); return s.trim(); }
  function ancestor(node, tags) { var p = node.parent; while (p && p.tag !== "#root") { if (tags.indexOf(p.tag) > -1) return p; p = p.parent; } return null; }

  /* ---------- CSS parsing ---------- */
  function parseDecls(str, line, where, issues) {
    var out = [];
    var trimmed = str.trim();
    if (!trimmed) return out;
    var parts = str.split(";");
    var endsOk = /;\s*$/.test(str);
    parts.forEach(function (p, i) {
      if (!p.trim()) return;
      var ci = p.indexOf(":");
      if (ci === -1) { issues.push({ line: line, msg: where + ': "' + p.trim() + '" is missing a colon (property: value).' }); return; }
      var prop = p.slice(0, ci).trim().toLowerCase(), val = p.slice(ci + 1).trim();
      if (/[a-z-]+\s*:/i.test(val) && !/^(url|rgb|hsl)/i.test(val) && !/^["']/.test(val)) {
        issues.push({ line: line, msg: where + ": looks like a semicolon is missing before another property, in \"" + p.trim() + "\"." });
      }
      var last = (i === parts.length - 1);
      /* the last property in a style attribute does not need a closing semicolon; semicolons are only needed BETWEEN properties (style attributes only: other places keep the reminder) */
      if (last && !endsOk && !/^On </.test(where)) issues.push({ line: line, msg: where + ': end the last property with a semicolon: "' + prop + ": " + val.slice(0, 20) + ';".', soft: true });
      if (KNOWN_PROPS.indexOf(prop) === -1) {
        var s = suggest(prop, KNOWN_PROPS);
        issues.push({ line: line, msg: where + ': "' + prop + '" is not a property we know' + (s ? " (did you mean " + s + "?)" : "") + "." });
      }
      out.push({ prop: prop, value: val, line: line });
    });
    return out;
  }
  function parseSheet(css, baseLine, issues) {
    var rules = [], re = /([^{}]+)\{([^{}]*)\}/g, m;
    while ((m = re.exec(css.replace(/\/\*[\s\S]*?\*\//g, function (c) { return c.replace(/[^\n]/g, " "); })))) {
      var sel = m[1].trim(), line = baseLine + lineOf(css, m.index) - 1;
      var decls = parseDecls(m[2], line, "In your <style> rule for " + sel, issues);
      rules.push({ selector: sel.replace(/\s+/g, " "), decls: decls, line: line });
    }
    var opens = (css.match(/\{/g) || []).length, closes = (css.match(/\}/g) || []).length;
    if (opens !== closes) issues.push({ line: baseLine, msg: "Your <style> block has " + opens + " { and " + closes + " }. Every { needs a matching }." });
    return rules;
  }

  /* ---------- analyze ---------- */
  function analyze(src) {
    src = String(src || "");
    var p = parse(src);
    var tags = {}, tree = p.root;
    walk(tree, function (n) { tags[n.tag] = (tags[n.tag] || 0) + 1; });

    var styleIssues = [], inline = [], sheetRules = [];
    walk(tree, function (n) {
      if (n.attrs.style !== undefined) {
        var d = parseDecls(n.attrs.style, n.line, "On <" + n.tag + "> (line " + n.line + ")", styleIssues);
        d.forEach(function (x) { x.el = n; }); inline = inline.concat(d);
      }
      if (n.tag === "style" && n.rawText !== undefined) {
        var inHead = !!ancestor(n, ["head"]);
        if (!inHead) styleIssues.push({ line: n.line, msg: "The <style> block belongs inside <head>." });
        sheetRules = sheetRules.concat(parseSheet(n.rawText, n.line, styleIssues));
      }
    });
    var allDecls = inline.slice();
    sheetRules.forEach(function (r) { r.decls.forEach(function (d) { allDecls.push(d); }); });

    var hard = styleIssues.filter(function (i) { return !i.soft; });
    var soft = styleIssues.filter(function (i) { return i.soft; });

    var warnings = p.warnings.slice();
    soft.forEach(function (i) { warnings.push(i); });
    walk(tree, function (n) {
      if (n.tag === "img" && n.attrs.alt === undefined) warnings.push({ line: n.line, msg: "<img> on line " + n.line + " has no alt attribute." });
      if (n.tag === "a" && n.attrs.href === undefined) warnings.push({ line: n.line, msg: "<a> on line " + n.line + " has no href, so it is not a link." });
      if (n.tag === "a" && n.attrs.href && !/^(https?:|#|mailto:|\/)/i.test(n.attrs.href)) warnings.push({ line: n.line, msg: 'The href on line ' + n.line + " should start with https://" });
      if ((n.tag === "ul" || n.tag === "ol")) n.children.forEach(function (c) { if (c.tag === "#text") warnings.push({ line: c.line, msg: "Plain text sits directly inside <" + n.tag + ">. Only <li> tags are allowed there." }); else if (c.tag !== "li") warnings.push({ line: c.line, msg: "<" + c.tag + "> sits directly inside <" + n.tag + ">. Only <li> is allowed there." }); });
      if (n.tag === "li" && !ancestor(n, ["ul", "ol"])) warnings.push({ line: n.line, msg: "<li> on line " + n.line + " is not inside a <ul> or <ol>." });
      if (/^h[1-6]$/.test(n.tag) === false && n.attrs && n.attrs["font-family"] !== undefined) warnings.push({ line: n.line, msg: "font-family belongs inside the style attribute." });
    });

    var ctx = {
      src: src, tree: tree, tags: tags, errors: p.errors.concat(hard), warnings: warnings, hasDoctype: p.hasDoctype,
      inline: inline, sheetRules: sheetRules, allDecls: allDecls,
      count: function (t) { return tags[t] || 0; },
      has: function (t) { return !!tags[t]; },
      all: function (t) { return findAll(tree, t); },
      prop: function (name) { return allDecls.filter(function (d) { return d.prop === name; }).length; },
      propValues: function (name) { return allDecls.filter(function (d) { return d.prop === name; }).map(function (d) { return d.value; }); },
      selector: function (sel) { return sheetRules.filter(function (r) { return r.selector.toLowerCase() === sel.toLowerCase(); }); },
      text: textOf,
      ancestor: ancestor,
      words: function (node) { var t = textOf(node).replace(/\s+/g, " ").trim(); return t ? t.split(" ").length : 0; }
    };
    return ctx;
  }

  /* ---------- rule helper ---------- */
  function r(label, test, tip, only, base) { return { label: label, test: test, tip: tip || "", only: !!only, base: !!base }; }
  /* style values on one element (style attribute only), lower-cased, without the trailing semicolon */
  function declOf(c, el, prop) { return c.inline.filter(function (d) { return d.el === el && d.prop === prop; }).map(function (d) { return String(d.value).replace(/;$/, "").trim().toLowerCase(); }); }
  function hasDecl(c, el, prop, re) { return declOf(c, el, prop).some(function (v) { return !re || (typeof re === "function" ? re(v) : re.test(v)); }); }
  function isNamedColor(v) { return !!NAMED[v]; }
  function colorsDiffer(c, el) { var a = declOf(c, el, "color")[0], b = declOf(c, el, "background-color")[0]; return !!a && !!b && a !== b; }
  function bothColors(c, el) { return hasDecl(c, el, "color", isNamedColor) && hasDecl(c, el, "background-color", isNamedColor); }
  function realLinks(c) { return c.all("a").filter(function (a) { return /^https:\/\//i.test(a.attrs.href || "") && !/example\.com/i.test(a.attrs.href || ""); }); }
  function anyValue(c, prop, fn) { return c.propValues(prop).some(fn); }
  var HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  function colorTokens(c) {
    var vals = [].concat(c.propValues("color"), c.propValues("background-color"), c.propValues("border"), c.propValues("background"), c.propValues("border-color"));
    var toks = []; vals.forEach(function (v) { v.split(/\s+/).forEach(function (t) { toks.push(t.replace(/;$/, "")); }); });
    return toks;
  }

  /* =====================================================================
     WRITING QUALITY  (catches nonsense words, keyboard mashing, and the same content over and over)
     quality(ctx) reads the paragraphs, headings and list items and returns numbers plus flags.
     Flags marked severe are the ones that should cost points; the rest are warnings for the teacher.
     ===================================================================== */
  var STOP = {}; ("a about after all also am an and any are as at be because been before being but by can could did do does down each few for from had has have he her here him his how i if in into is it its just like me more most my no not now of on one only or other our out over own said she so some such than that the their them then there these they this those through to too up us very was we were what when where which while who why will with would you your").split(" ").forEach(function (w) { STOP[w] = 1; });
  var KEYROWS = ["qwer", "wert", "erty", "rtyu", "tyui", "yuio", "uiop", "asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl", "zxcv", "xcvb", "cvbn", "vbnm"];
  function isGibberish(w) {
    if (w.length < 3) return false;
    if (!/[aeiouy]/.test(w)) return true;                 // no vowels at all
    if (/(.)\1{3,}/.test(w)) return true;                  // aaaa
    if (/[^aeiouy]{6,}/.test(w)) return true;              // bcdfgh
    for (var i = 0; i < KEYROWS.length; i++) if (w.indexOf(KEYROWS[i]) > -1) return true;
    return false;
  }
  function stemOf(w) { return w.replace(/(ing|ed|es|s)$/, ""); }
  function quality(c) {
    var texts = [];
    ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th"].forEach(function (t) { c.all(t).forEach(function (n) { var s = textOf(n).replace(/\s+/g, " ").trim(); if (s) texts.push({ tag: t, s: s }); }); });
    var whole = texts.map(function (x) { return x.s; }).join(" ").toLowerCase();
    var words = (whole.match(/[a-z']+/g) || []).map(function (w) { return w.replace(/^'+|'+$/g, ""); }).filter(function (w) { return w.length > 0; });
    var n = words.length, q = { n: n, flags: [], severe: false, uniqueRatio: 1, stopRatio: 1, gibberish: 0, dupParas: 0, topicMentions: null, topicWords: [] };
    function flag(id, sev, msg) { q.flags.push({ id: id, sev: sev, msg: msg }); if (sev === "high") q.severe = true; }
    if (n < 15) return q;

    var uniq = {}; words.forEach(function (w) { uniq[w] = 1; });
    q.uniqueRatio = Object.keys(uniq).length / n;
    var stops = 0; words.forEach(function (w) { if (STOP[w]) stops++; }); q.stopRatio = stops / n;
    var gib = words.filter(isGibberish); q.gibberish = gib.length;

    // 1. nonsense words / keyboard mashing
    if (gib.length >= 3 && gib.length / n >= 0.06) flag("gibberish", "high", gib.length + " words look like keyboard mashing or nonsense (like \"" + gib.slice(0, 3).join("\", \"") + "\").");
    else if (gib.length >= 2) flag("gibberish-few", "warn", gib.length + " words look like nonsense (like \"" + gib.slice(0, 2).join("\", \"") + "\").");
    // 2. filler text
    if (/lorem ipsum|dolor sit amet|blah blah|test test|asdf|qwerty|your text here|sample text goes here|type here/i.test(whole)) flag("filler", "high", "The page contains placeholder or filler text (like lorem ipsum, asdf, or blah blah).");
    // 3. word salad: lots of words but almost no sentence glue words
    var pOnly = (texts.filter(function (x) { return x.tag === "p"; }).map(function (x) { return x.s; }).join(" ").toLowerCase().match(/[a-z']+/g) || []), pStops = 0; pOnly.forEach(function (w) { if (STOP[w]) pStops++; });
    var pStopRatio = pOnly.length ? pStops / pOnly.length : 1;
    if (pOnly.length >= 40 && pStopRatio < 0.12) flag("salad", "high", "Only " + Math.round(pStopRatio * 100) + "% of the words in the paragraphs are normal sentence words (the, and, of, is...). It reads like a list of random words, not sentences.");
    // 4. same word again and again
    var runs = 0, longest = 0, run = 1;
    for (var i = 1; i < n; i++) { if (words[i] === words[i - 1] && words[i].length > 1) { run++; if (run === 3) runs++; if (run > longest) longest = run; } else run = 1; }
    if (runs >= 2 || longest >= 5) flag("word-run", "high", "The same word is repeated in a row many times (up to " + Math.max(longest, 3) + " times in a row).");
    else if (runs === 1) flag("word-run-1", "warn", "The same word is repeated 3 times in a row once.");
    // 5. low variety
    var minRatio = n >= 150 ? 0.26 : 0.34;
    if (n >= 60 && q.uniqueRatio < minRatio * 0.75) flag("variety", "high", "Only " + Math.round(q.uniqueRatio * 100) + "% of the words are different. The writing uses the same words over and over.");
    else if (n >= 60 && q.uniqueRatio < minRatio) flag("variety-low", "warn", "Only " + Math.round(q.uniqueRatio * 100) + "% of the words are different. The writing may be repetitive.");
    // 6. repeated paragraphs (exact or nearly the same)
    var paras = texts.filter(function (x) { return x.tag === "p"; }).map(function (x) { return x.s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim(); }).filter(function (s) { return s.split(" ").length >= 8; });
    function shingles(s) { var w = s.split(" "), o = {}; for (var k = 0; k + 4 <= w.length; k++) o[w.slice(k, k + 4).join(" ")] = 1; return o; }
    var sh = paras.map(shingles), dup = {};
    for (var a = 0; a < paras.length; a++) for (var b = a + 1; b < paras.length; b++) {
      if (dup[b]) continue;
      if (paras[a] === paras[b]) { dup[b] = 1; continue; }
      var ka = Object.keys(sh[a]), inter = 0; ka.forEach(function (k) { if (sh[b][k]) inter++; });
      var uni = ka.length + Object.keys(sh[b]).length - inter;
      if (uni > 0 && inter / uni >= 0.6) dup[b] = 1;
    }
    q.dupParas = Object.keys(dup).length;
    if (q.dupParas >= 2) flag("dup-paras", "high", q.dupParas + " paragraphs are copies (or near copies) of another paragraph.");
    else if (q.dupParas === 1) flag("dup-para-1", "warn", "One paragraph is a copy of another paragraph.");
    // 7. repeated sentences
    var sents = whole.split(/[.!?]+/).map(function (s) { return s.replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim(); }).filter(function (s) { return s.split(" ").length >= 4; }), sc = {}, repS = 0;
    sents.forEach(function (s) { sc[s] = (sc[s] || 0) + 1; }); Object.keys(sc).forEach(function (s) { if (sc[s] >= 3) repS += 2; else if (sc[s] === 2) repS += 1; });
    if (repS >= 3) flag("dup-sents", "high", "The same sentences appear more than once (some 3 or more times).");
    else if (repS >= 1) flag("dup-sent-1", "warn", "A sentence is repeated.");
    // 8. the same long phrase over and over
    var gram = {}, worst = 0, worstP = ""; for (var g = 0; g + 6 <= n; g++) { var ph = words.slice(g, g + 6).join(" "); gram[ph] = (gram[ph] || 0) + 1; if (gram[ph] > worst) { worst = gram[ph]; worstP = ph; } }
    if (worst >= 4) flag("phrase", "high", "The same phrase (\"" + worstP + "\") shows up " + worst + " times.");
    else if (worst === 3) flag("phrase-3", "warn", "The phrase \"" + worstP + "\" shows up 3 times.");

    // 9. does the writing match the topic in the title / heading 1?
    var tw = [];
    var tt = c.all("title")[0], h1 = c.all("h1")[0];
    [tt ? textOf(tt) : "", h1 ? textOf(h1) : ""].join(" ").toLowerCase().split(/[^a-z']+/).forEach(function (w) { if (w.length >= 4 && !STOP[w] && tw.indexOf(w) < 0) tw.push(w); });
    q.topicWords = tw;
    if (tw.length) {
      var stems = tw.map(stemOf).filter(function (s) { return s.length >= 3; }), hits = 0;
      var pw = (texts.filter(function (x) { return x.tag === "p" || x.tag === "li"; }).map(function (x) { return x.s; }).join(" ").toLowerCase().match(/[a-z']+/g) || []);
      pw.forEach(function (w) { for (var z = 0; z < stems.length; z++) if (w.indexOf(stems[z]) === 0) { hits++; break; } });
      // the title and heading 1 themselves are in "whole" once each, so remove them
      q.topicMentions = hits;
    }
    q.level = q.severe ? "red" : (q.flags.length ? "yellow" : "green");
    return q;
  }
  function qualityOk(c) { var q = quality(c); return !q.severe; }

  /* =====================================================================
     CONCEPT TESTS  (concepts.js lists what each lesson teaches; every item has a key here that counts how many
     times the page uses it). From the lesson after an item is taught, the item is automatically required at
     least REVIEW_MIN times ("every new assignment uses at least 2 examples of everything learned before").
     ===================================================================== */
  var REVIEW_MIN = 2;
  var BORDER_SHORT = /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i;
  var SIDE_PROPS = ["border-top", "border-bottom", "border-left", "border-right"];
  function sum(c, names) { var n = 0; names.forEach(function (p) { n += c.prop(p); }); return n; }
  function valCount(c, props, re) { var n = 0; props.forEach(function (p) { c.propValues(p).forEach(function (v) { if (re.test(v.replace(/;$/, "").trim())) n++; }); }); return n; }
  function elsWithAttr(c, a) { return els(c).filter(function (n) { return n.attrs[a] !== undefined; }); }
  function borderEls(c) {
    var seen = [], used = ["border"].concat(SIDE_PROPS);
    c.allDecls.forEach(function (d) { if (used.indexOf(d.prop) > -1 && BORDER_SHORT.test(d.value.replace(/;$/, "")) && d.el && seen.indexOf(d.el) < 0) seen.push(d.el); });
    return seen.length;
  }
  function imgSize(i) { var st = {}; (i.attrs.style || "").split(";").forEach(function (p) { var k = p.split(":"); if (k[1]) st[k[0].trim().toLowerCase()] = k[1].trim(); }); return i.attrs.width !== undefined || i.attrs.height !== undefined || st.width !== undefined || st.height !== undefined; }
  function imgSizedByCss(c, i) {
    var ks = classesOf(i);
    return c.sheetRules.some(function (rl) {
      return selParts(rl).some(function (s) { var m = /^img$|^\.([\w-]+)$|^img\.([\w-]+)$/i.exec(s); if (!m) return false; var k = m[1] || m[2]; if (k && ks.indexOf(k) < 0) return false; return declares(rl, "width") || declares(rl, "height"); });
    });
  }
  function distinct(arr) { var o = {}; arr.forEach(function (x) { o[x] = 1; }); return Object.keys(o).length; }
  /* Google Fonts (3.5): the <link> tags that load fonts, and the font names they bring in */
  function gfontLinks(c) { return c.all("link").filter(function (l) { return /^https:\/\/fonts\.googleapis\.com\/css2?\?/i.test(l.attrs.href || "") && /stylesheet/i.test(l.attrs.rel || "stylesheet"); }); }
  function gfontNames(c) { var n = {}; gfontLinks(c).forEach(function (l) { var m, re = /family=([^&:;]+)/g; while ((m = re.exec(l.attrs.href || ""))) { var nm; try { nm = decodeURIComponent(m[1].replace(/\+/g, " ")); } catch (e) { nm = m[1]; } n[nm.trim().toLowerCase()] = 1; } }); return Object.keys(n); }
  function fontFamilyList(c) { var out = []; c.inline.forEach(function (d) { if (d.prop === "font-family") out.push(String(d.value).replace(/;$/, "").trim().toLowerCase()); }); return out; }
  function firstFont(v) { return String(v).split(",")[0].replace(/['"]/g, "").trim(); }
  function lastFont(v) { var p = String(v).split(","); return p[p.length - 1].replace(/['"]/g, "").trim(); }
  var GENERIC = /^(serif|sans-serif|monospace|cursive|fantasy)$/;
  var TESTS = {
    "h2": function (c) { return c.count("h2"); }, "h3": function (c) { return c.count("h3"); }, "p": function (c) { return c.count("p"); },
    "attr-style": function (c) { return elsWithAttr(c, "style").length; },
    "p-color": function (c) { return c.prop("color"); }, "p-bg": function (c) { return c.prop("background-color"); },
    "p-fs": function (c) { return c.prop("font-size"); }, "p-ta": function (c) { return c.prop("text-align"); }, "p-tt": function (c) { return c.prop("text-transform"); },
    "p-border": function (c) { return valCount(c, ["border"].concat(SIDE_PROPS), BORDER_SHORT); },
    "v-px": function (c) { return valCount(c, ["font-size"], /^\d+(\.\d+)?px$/i); },
    "v-center": function (c) { return valCount(c, ["text-align"], /^center$/i); },
    "v-upper": function (c) { return valCount(c, ["text-transform"], /^uppercase$/i); },
    "v-named": function (c) { return colorTokens(c).filter(function (t) { return NAMED[t.toLowerCase()]; }).length; },
    "strong": function (c) { return c.count("strong") + c.count("b"); }, "em": function (c) { return c.count("em") + c.count("i"); },
    "br": function (c) { return c.count("br"); }, "hr": function (c) { return c.count("hr"); }, "span": function (c) { return c.count("span"); },
    "p-ff": function (c) { return c.prop("font-family"); },
    "link": function (c) { return c.count("link"); },
    "attr-gfont": function (c) { return gfontLinks(c).length; },
    "v-fallback": function (c) { return valCount(c, ["font-family"], /(^|[\s,'"])(serif|sans-serif|monospace|cursive|fantasy)$/i); },
    "v-serif": function (c) { return valCount(c, ["font-family"], /(^|[\s,'"])serif$/i); },
    "v-sans": function (c) { return valCount(c, ["font-family"], /(^|[\s,'"])sans-serif$/i); },
    "v-mono": function (c) { return valCount(c, ["font-family"], /(^|[\s,'"])monospace$/i); },
    "p-bside": function (c) { return sum(c, SIDE_PROPS); },
    "v-solid": function (c) { return valCount(c, ["border"].concat(SIDE_PROPS, ["border-style"]), /\bsolid\b/i); },
    "v-dashed": function (c) { return valCount(c, ["border"].concat(SIDE_PROPS, ["border-style"]), /\bdashed\b/i); },
    "v-dotted": function (c) { return valCount(c, ["border"].concat(SIDE_PROPS, ["border-style"]), /\bdotted\b/i); },
    "ul": function (c) { return c.count("ul"); }, "ol": function (c) { return c.count("ol"); }, "li": function (c) { return c.count("li"); },
    "p-lst": function (c) { return c.prop("list-style-type") + c.prop("list-style"); }, "p-disp": function (c) { return c.prop("display"); },
    "v-inline": function (c) { return valCount(c, ["display"], /^inline$/i); },
    "v-lstnone": function (c) { return valCount(c, ["list-style-type", "list-style"], /^none$/i); },
    "a": function (c) { return c.count("a"); },
    "a-wrap": function (c) { return c.all("a").filter(function (a) { return a.children.some(function (n) { return n.tag !== "#text" && /^(h[1-6]|p|strong|b|em|i|span|li|div)$/.test(n.tag); }); }).length; },
    "attr-href": function (c) { return c.all("a").filter(function (a) { return /\S/.test(a.attrs.href || ""); }).length; },
    "attr-newtab": function (c) { return c.all("a").filter(function (a) { return a.attrs.target === "_blank"; }).length; },
    "attr-sametab": function (c) { return c.all("a").filter(function (a) { return a.attrs.target === undefined || a.attrs.target === "_self"; }).length; },
    "img": function (c) { return c.count("img"); },
    "attr-src": function (c) { return c.all("img").filter(function (i) { return /\S/.test(i.attrs.src || ""); }).length; },
    "attr-alt": function (c) { return c.all("img").filter(function (i) { return /\S/.test(i.attrs.alt || ""); }).length; },
    "attr-imgsize": function (c) { return c.all("img").filter(function (i) { return imgSize(i) || imgSizedByCss(c, i); }).length; },
    "attr-imglink": function (c) { return c.all("img").filter(function (i) { return !!c.ancestor(i, ["a"]); }).length; },
    "p-w": function (c) { return c.prop("width"); }, "p-radius": function (c) { return c.prop("border-radius"); },
    "v-pct": function (c) { return valCount(c, ["width"], /^[\d.]+%$/); },
    "v-block": function (c) { return valCount(c, ["display"], /^block$/i); },
    "p-pad": function (c) { return sum(c, ["padding", "padding-top", "padding-right", "padding-bottom", "padding-left"]); },
    "p-mar": function (c) { return sum(c, ["margin", "margin-top", "margin-right", "margin-bottom", "margin-left"]); },
    "v-hex": function (c) { return colorTokens(c).filter(function (t) { return HEX.test(t); }).length; },
    "v-ib": function (c) { return valCount(c, ["display"], /^inline-block$/i); },
    "div": function (c) { return c.count("div"); }, "p-va": function (c) { return c.prop("vertical-align"); },
    "v-top": function (c) { return valCount(c, ["vertical-align"], /^top$/i); },
    "table": function (c) { return c.count("table"); }, "tr": function (c) { return c.count("tr"); }, "th": function (c) { return c.count("th"); }, "td": function (c) { return c.count("td"); },
    "attr-class": function (c) { return els(c).filter(function (n) { return classesOf(n).length > 0; }).length; },
    "s-tag": function (c) { var t = []; c.sheetRules.forEach(function (rl) { selParts(rl).forEach(function (s) { if (/^[a-z][a-z0-9]*$/i.test(s) && s.toLowerCase() !== "html") t.push(s.toLowerCase()); }); }); return distinct(t); },
    "s-class": function (c) { var used = {}; els(c).forEach(function (n) { classesOf(n).forEach(function (k) { used[k] = 1; }); }); var k = []; c.sheetRules.forEach(function (rl) { selParts(rl).forEach(function (s) { var m = /^\.([\w-]+)$/.exec(s); if (m && used[m[1]]) k.push(m[1]); }); }); return distinct(k); },
    "attr-id": function (c) { return els(c).filter(function (n) { return !!String(n.attrs.id || "").trim(); }).length; },
    "s-id": function (c) { var ids = {}; els(c).forEach(function (n) { if (n.attrs.id) ids[String(n.attrs.id).trim()] = 1; }); var k = []; c.sheetRules.forEach(function (rl) { selParts(rl).forEach(function (s) { var m = /^#([\w-]+)$/.exec(s); if (m && ids[m[1]]) k.push(m[1]); }); }); return distinct(k); },
    "attr-twoclass": function (c) { return els(c).filter(function (n) { return classesOf(n).length >= 2; }).length; },
    "s-combo": function (c) { var n = 0; c.sheetRules.forEach(function (rl) { selParts(rl).forEach(function (s) { var noPseudo = s.replace(/:[\w-]+/g, ""); if (/^[a-z][a-z0-9]*[.#][\w-]+$/i.test(noPseudo) || /^[.#]?[\w-]+(\s*>\s*|\s+)[.#]?[\w-]+/.test(noPseudo)) n++; }); }); return n; },
    "p-trans": function (c) { return c.prop("transition") + c.prop("transition-duration"); },
    "s-hover": function (c) { return ruleFor(c, function (s) { return /:hover\b/.test(s); }).length; },
    "p-flex": function (c) { return c.sheetRules.filter(function (rl) { return /^(inline-)?flex$/i.test(valueOf(rl, "display")); }).length; },
    "p-jc": function (c) { return c.prop("justify-content"); }, "p-ai": function (c) { return c.prop("align-items"); },
    "p-grid": function (c) { return c.sheetRules.filter(function (rl) { return /^(inline-)?grid$/i.test(valueOf(rl, "display")); }).length; },
    "p-gtc": function (c) { return c.prop("grid-template-columns"); }, "p-gap": function (c) { return c.prop("gap") + c.prop("grid-gap") + c.prop("column-gap") + c.prop("row-gap"); },
    "b-grid": function (c) { return withClass(c, /^row$/).filter(function (n) { return n.children.filter(function (k) { return k.tag !== "#text" && classesOf(k).some(function (x) { return /^col(-|$)/.test(x); }); }).length >= 2 && inside(c, n, /^container/); }).length; },
    "b-util": function (c) { return withClass(c, UTIL).length; },
    "b-btn": function (c) { return els(c).filter(function (n) { var k = classesOf(n); return k.indexOf("btn") > -1 && k.some(function (x) { return BTN.test(x); }); }).length; },
    "b-nav": function (c) { return withClass(c, /^nav-link$/).filter(function (n) { return n.tag === "a" && inside(c, n, /^navbar$/); }).length; },
    "b-card": function (c) { return withClass(c, /^card$/).length; },
    "form": function (c) { return c.count("form"); },
    "b-form": function (c) { return els(c).filter(function (n) { return /^(input|textarea|select)$/.test(n.tag) && classesOf(n).some(function (k) { return k === "form-control" || k === "form-select"; }); }).length; }
  };
  function reviewRules(lesson) {
    var out = [], CON = root.U7_CONCEPTS; if (!CON) return out;
    var rv = CON.reviewFor(lesson);
    CON.groups.forEach(function (g) {
      (rv[g[0]] || []).forEach(function (it) {
        if (it.once || !TESTS[it.key]) return;
        var mn = it.min || REVIEW_MIN;
        out.push({ id: "R-" + it.key, lesson: it.from, label: "Uses " + it.label + (mn > 1 ? " at least " + mn + " times" : ""), tip: mn > 1 ? "You learned this recently. Use it in " + mn + " different places, where it fits your page." : "Keep using what you learned. Use it at least once.", test: function (c) { return TESTS[it.key](c) >= mn; }, isNew: true });
      });
    });
    return out;
  }


  /* =====================================================================
     LESSON REQUIREMENTS  (edit these to match what you assign)
     Each lesson lists ONLY its new rules. Earlier lessons carry over automatically
     (they count a little less, so students keep the earlier parts of their site).
     ===================================================================== */
  var LESSONS = {
    "6.1": { name: "Intro to HTML and the HTML Skeleton", rules: [
      r("First line is <!DOCTYPE html>", function (c) { return /^\s*(?:<!--[\s\S]*?-->\s*)*<!doctype html>/i.test(c.src); }, "Every real web page starts with this line.", false, true),
      r("Has the skeleton: <html> containing <head> and then <body>", function (c) {
        var h = c.all("html")[0]; if (!h) return false;
        var kids = h.children.filter(function (n) { return n.tag !== "#text"; }).map(function (n) { return n.tag; });
        return kids.indexOf("head") > -1 && kids.indexOf("body") > -1 && kids.indexOf("head") < kids.indexOf("body");
      }, "head and body both go inside html, with head first.", false, true),
      r("Exactly one <title> inside <head> with text in it", function (c) {
        var t = c.all("title"); return t.length === 1 && !!c.ancestor(t[0], ["head"]) && c.text(t[0]).length > 0;
      }, "The title is the text that shows in the browser tab.", false, true),
      r("Exactly one <h1> in the <body>", function (c) { var a = c.all("h1"); return a.length === 1 && !!c.ancestor(a[0], ["body"]) && c.text(a[0]).length > 0; }, "An h1 is the main title, so use it once.", false, true),
      r("At least 3 section headings (<h2>)", function (c) { return c.count("h2") >= 3; }, "Wikipedia pages are split into sections, and each section starts with a heading.", true),
      r("Only <h1> and <h2> are used: one h1 first, then the h2 sections", function (c) {
        var hs = []; (function w(n) { n.children.forEach(function (x) { if (x.tag === "#text") return; if (/^h[1-6]$/.test(x.tag)) hs.push(+x.tag.charAt(1)); w(x); }); })(c.tree);
        if (!hs.length || hs[0] !== 1) return false;
        if (hs.some(function (x) { return x > 2; })) return false;
        for (var i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) return false; return true;
      }, "Use only heading 1 and heading 2 on this page: the h1 first, then the h2 sections.", true),
      r("At least 6 <p> paragraphs, all inside the <body>", function (c) { var a = c.all("p"); return a.length >= 6 && a.every(function (n) { return !!c.ancestor(n, ["body"]); }); }, "", true),
      r("At least 5 of your paragraphs have 25 words or more", function (c) { return c.all("p").filter(function (n) { return c.words(n) >= 25; }).length >= 5; }, "Write full paragraphs of 3 to 5 sentences.", true),
      r("At least 250 words of text on the page", function (c) { var b = c.all("body")[0]; return !!b && c.words(b) >= 250; }, "A long page, like a real encyclopedia article.", true),
      r("Your writing is real: no keyboard mashing, nonsense words, or filler text", function (c) { var q = quality(c); return !q.flags.some(function (f) { return f.sev === "high" && /^(gibberish|filler|salad)$/.test(f.id); }); }, "Write real sentences in your own words.", true),
      r("Your writing is not the same content over and over (no repeated paragraphs, sentences, or phrases)", function (c) { var q = quality(c); return !q.flags.some(function (f) { return f.sev === "high" && /^(dup-paras|dup-sents|phrase|word-run|variety)$/.test(f.id); }); }, "Every paragraph should say something new.", true),
      r("Every tag is closed and nested correctly", function (c) { return c.errors.length === 0 && c.has("html"); }, "See the Problems list for exactly which line to fix.", false, true)
    ] },
    "6.2": { name: "The \"Style\" Attribute + Color", rules: [
      r("Has one heading 1, at least 3 heading 2s, and at least 6 paragraphs", function (c) { return c.count("h1") === 1 && c.count("h2") >= 3 && c.count("p") >= 6; }, "Pick your topic, then build the page: 1 h1, 3 or more h2, 6 or more p."),
      r("The body has a background-color (a named color)", function (c) { var b = c.all("body")[0]; return !!b && hasDecl(c, b, "background-color", isNamedColor); }, "Put style=\"background-color: lime;\" on the body tag."),
      r("The body also has a text color that is different from its background-color", function (c) { var b = c.all("body")[0]; return !!b && hasDecl(c, b, "color", isNamedColor) && colorsDiffer(c, b); }, "Chain it after the background-color: style=\"background-color: lime; color: purple;\""),
      r("The heading 1 uses color and background-color together", function (c) { var h = c.all("h1")[0]; return !!h && bothColors(c, h) && colorsDiffer(c, h); }, "Two properties in one style attribute, with a semicolon between them."),
      r("EVERY heading 2 and EVERY paragraph uses color and background-color together (two different colors)", function (c) { var e = c.all("h2").concat(c.all("p")); return e.length >= 9 && e.every(function (x) { return bothColors(c, x) && colorsDiffer(c, x); }); }, "Almost every tag on an ugly page has both colors."),
      r("At least 2 heading 2s use exactly the same text color and background-color (a pattern)", function (c) { var n = {}; c.all("h2").forEach(function (x) { var k = declOf(c, x, "color")[0] + "|" + declOf(c, x, "background-color")[0]; n[k] = (n[k] || 0) + 1; }); return Object.keys(n).some(function (k) { return n[k] >= 2; }); }, "Give a couple of your h2s the same two colors so they look like a matching set."),
      r("EVERY paragraph is different: no two paragraphs share a text color, and no two share a background-color", function (c) { var a = c.all("p"), t = {}, g = {}; return a.length >= 6 && a.every(function (x) { var tc = declOf(c, x, "color")[0], bc = declOf(c, x, "background-color")[0]; if (!tc || !bc || t[tc] || g[bc]) return false; t[tc] = 1; g[bc] = 1; return true; }); }, "Six paragraphs need six different text colors and six different background colors."),
      r("The text is still there: wherever color and background-color are both used, they are different colors", function (c) { var any = false, ok = true; (function w(x) { x.children.forEach(function (e) { if (e.tag === "#text") return; if (hasDecl(c, e, "color") && hasDecl(c, e, "background-color")) { any = true; if (!colorsDiffer(c, e)) ok = false; } w(e); }); })(c.tree); return any && ok; }, "Ugly is fine. Invisible is not."),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.20": { name: "Font-Size, Text-Alignment, Letter-Case", rules: [
      r("Uses at least 3 different heading levels (h1, h2, h3)", function (c) { return c.has("h1") && c.has("h2") && c.has("h3"); }),
      r("Has at least 4 <p> paragraphs", function (c) { return c.count("p") >= 4; }),
      r("Uses font-size in pixels (like 24px) on at least 4 elements", function (c) { return c.all("body")[0] ? c.inline.filter(function (d) { return d.prop === "font-size" && /^\d+(\.\d+)?px$/i.test(String(d.value).replace(/;$/, "").trim()); }).length >= 4 : false; }, "Write the number and px together, like font-size: 24px;"),
      r("Uses text-align: center on at least 3 elements", function (c) { return c.inline.filter(function (d) { return d.prop === "text-align" && /^center$/i.test(String(d.value).replace(/;$/, "").trim()); }).length >= 3; }),
      r("Uses text-transform: uppercase on at least 2 elements", function (c) { return c.inline.filter(function (d) { return d.prop === "text-transform" && /^uppercase$/i.test(String(d.value).replace(/;$/, "").trim()); }).length >= 2; }),
      r("Uses color and background-color together (from 3.2) on at least 2 elements", function (c) { var n = 0; (function w(x) { x.children.forEach(function (e) { if (e.tag === "#text") return; if (bothColors(c, e)) n++; w(e); }); })(c.tree); return n >= 2; }),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.3": { name: "Editing Tags, Span Tag", rules: [
      r("At least 8 paragraphs, and at least one heading 1, one heading 2, and two heading 3s", function (c) { return c.count("p") >= 8 && c.has("h1") && c.has("h2") && c.count("h3") >= 2; }, "Write at least 8 paragraphs about your theme and use three heading levels."),
      r("At least 3 bold words or phrases (<strong> or <b>) and at least 1 italic (<em> or <i>)", function (c) { return c.all("strong").concat(c.all("b")).length >= 3 && c.all("em").concat(c.all("i")).length >= 1; }),
      r("At least 3 line breaks (<br>, never closed) and at least 2 horizontal lines (<hr>) outside paragraphs", function (c) { return c.all("br").length >= 3 && c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 2; }),
      r("Editing tags (strong/em) are inside a creation tag like <p> or <h1>", function (c) {
        var e = c.all("strong").concat(c.all("em"), c.all("b"), c.all("i")); return e.length > 0 && e.every(function (n) { return !!c.ancestor(n, ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"]); });
      }),
      r("At least 3 different colors are used (text colors and background colors together)", function (c) { var n = {}; (function w(x) { x.children.forEach(function (e) { if (e.tag === "#text") return; ["color", "background-color"].forEach(function (p) { var v = declOf(c, e, p)[0]; if (v && isNamedColor(v)) n[v] = 1; }); w(e); }); })(c.tree); return Object.keys(n).length >= 3; }),
      r("At least 2 different font sizes in px, at least 1 centered (or right-aligned) tag, and at least 1 text-transform: uppercase", function (c) { var sz = {}, al = false, up = false; c.inline.forEach(function (d) { var v = String(d.value).replace(/;$/, "").trim().toLowerCase(); if (d.prop === "font-size" && /^\d+(\.\d+)?px$/.test(v)) sz[v] = 1; if (d.prop === "text-align" && (v === "center" || v === "right")) al = true; if (d.prop === "text-transform" && v === "uppercase") up = true; }); return Object.keys(sz).length >= 2 && al && up; }),
      r("At least 4 <span> tags, each with its own style attribute", function (c) { return c.all("span").filter(function (s) { return s.attrs.style !== undefined && /:/.test(s.attrs.style); }).length >= 4; }, "Use spans for effect: color a word, make a first letter bigger, and so on."),
      r("At least 6 tags have two or more style properties each", function (c) { var per = []; c.inline.forEach(function (d) { var k = per.indexOf(d.el); if (k < 0) { per.push(d.el); per.push({}); k = per.length - 2; } per[k + 1][d.prop] = 1; }); var n = 0; for (var i = 1; i < per.length; i += 2) if (Object.keys(per[i]).length >= 2) n++; return n >= 6; }, "Put two or more properties in one style attribute, with a semicolon between them."),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.35": { name: "Google Fonts", rules: [
      r("At least 6 paragraphs, and at least one heading 1, one heading 2, and two heading 3s", function (c) { return c.count("p") >= 6 && c.has("h1") && c.has("h2") && c.count("h3") >= 2; }),
      r("Every font link is a <link> tag in the <head> (rel=\"stylesheet\" and a https://fonts.googleapis.com address)", function (c) { var hd = c.all("head")[0], g = gfontLinks(c); return !!hd && g.length >= 1 && g.every(function (l) { return !!c.ancestor(l, ["head"]); }); }, "Copy the whole link tag from fonts.google.com and paste it inside your head."),
      r("The links bring in at least 3 different Google fonts", function (c) { return gfontNames(c).length >= 3; }, "Pick 3 or more fonts. One link can hold several: family=Pacifico&family=Lobster"),
      r("At least 3 different Google fonts are used in font-family styles", function (c) { var g = gfontNames(c), used = {}; fontFamilyList(c).forEach(function (v) { var f = firstFont(v); if (g.indexOf(f) > -1) used[f] = 1; }); return Object.keys(used).length >= 3; }, "Use each font by name: font-family: 'Pacifico', cursive;"),
      r("Every font-family ends with a fallback family (serif, sans-serif, monospace, cursive, or fantasy)", function (c) { var l = fontFamilyList(c); return l.length >= 1 && l.every(function (v) { return v.indexOf(",") > -1 && GENERIC.test(lastFont(v)); }); }, "End the list with a back-up group: font-family: 'Lobster', cursive;"),
      r("Your fonts come from at least 2 different families (the fallback at the end of each font-family)", function (c) { var n = {}; fontFamilyList(c).forEach(function (v) { var l = lastFont(v); if (GENERIC.test(l)) n[l] = 1; }); return Object.keys(n).length >= 2; }, "Mix a cursive or serif title font with an easy-to-read sans-serif paragraph font."),
      r("It looks designed: at least 4 paragraphs share one font, and at least 2 headings share one font", function (c) { function shared(tags, need) { var cnt = {}; tags.forEach(function (t) { c.all(t).forEach(function (x) { var f = declOf(c, x, "font-family")[0]; if (f) cnt[f] = (cnt[f] || 0) + 1; }); }); return Object.keys(cnt).some(function (k) { return cnt[k] >= need; }); } return shared(["p"], 4) && shared(["h1", "h2", "h3"], 2); }, "Give headings one display font and paragraphs one easy-to-read font. Use other fonts as accents."),
      r("At least 6 tags use a font-family", function (c) { var n = 0; (function w(x) { x.children.forEach(function (e) { if (e.tag === "#text") return; if (declOf(c, e, "font-family").length) n++; w(e); }); })(c.tree); return n >= 6; }),
      r("At least 3 <span> tags, each with its own style attribute", function (c) { return c.all("span").filter(function (s) { return s.attrs.style !== undefined && /:/.test(s.attrs.style); }).length >= 3; }, "Change the font, color, size, or background of a few words."),
      r("At least 3 different colors, at least 2 different background-colors, and at least 3 line breaks and 2 horizontal lines", function (c) { var col = {}, bg = {}; (function w(x) { x.children.forEach(function (e) { if (e.tag === "#text") return; var a = declOf(c, e, "color")[0], b = declOf(c, e, "background-color")[0]; if (a && isNamedColor(a)) col[a] = 1; if (b && isNamedColor(b)) { bg[b] = 1; col[b] = 1; } w(e); }); })(c.tree); return Object.keys(col).length >= 3 && Object.keys(bg).length >= 2 && c.all("br").length >= 3 && c.all("hr").filter(function (x) { return !c.ancestor(x, ["p"]); }).length >= 2; }),
      r("At least 2 different font sizes in px, 2 centered (or right-aligned) tags, and 2 text-transform: uppercase", function (c) { var sz = {}, al = 0, up = 0; c.inline.forEach(function (d) { var v = String(d.value).replace(/;$/, "").trim().toLowerCase(); if (d.prop === "font-size" && /^\d+(\.\d+)?px$/.test(v)) sz[v] = 1; if (d.prop === "text-align" && (v === "center" || v === "right")) al++; if (d.prop === "text-transform" && v === "uppercase") up++; }); return Object.keys(sz).length >= 2 && al >= 2 && up >= 2; }),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.4": { name: "Border", rules: [
      r("Puts a border (thickness, style, color) on at least 4 different elements", function (c) { return borderEls(c) >= 4; }, "Borders belong on boxes: a banner, a photo frame, a quote, a price box."),
      r("Uses solid, dashed, and dotted borders (each at least 2 times)", function (c) { return TESTS["v-solid"](c) >= 2 && TESTS["v-dashed"](c) >= 2 && TESTS["v-dotted"](c) >= 2; }, "Mix the styles: solid for main frames, dashed for extras, dotted for small notes."),
      r("Uses a border on just one side (top, bottom, left, or right) at least 2 times", function (c) { return TESTS["p-bside"](c) >= 2; }, "Same three parts, one side only, like border-bottom: 3px solid navy;"),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.5": { name: "Lists", rules: [
      r("Has at least 2 <ol> and at least 2 <ul> lists", function (c) { return c.count("ol") >= 2 && c.count("ul") >= 2; }, "Plan one ordered and one bullet list in each section."),
      r("Every list has at least 3 <li> items", function (c) { var l = c.all("ul").concat(c.all("ol")); return l.length > 0 && l.every(function (x) { return x.children.filter(function (n) { return n.tag === "li"; }).length >= 3; }); }),
      r("Only <li> tags sit directly inside a list", function (c) { var l = c.all("ul").concat(c.all("ol")); return l.length > 0 && l.every(function (x) { return x.children.every(function (n) { return n.tag === "li"; }); }); }),
      r("Uses list-style-type on at least 2 lists (on the <ul> or <ol>, not the li)", function (c) { return c.inline.filter(function (d) { return d.prop === "list-style-type" && (d.el.tag === "ul" || d.el.tag === "ol"); }).length >= 2; }),
      r("Makes one list horizontal: display: inline on at least 3 <li> (block turned into inline)", function (c) {
        return c.inline.filter(function (d) { return d.prop === "display" && /^inline$/i.test(d.value.replace(/;$/, "").trim()) && d.el.tag === "li"; }).length >= 3;
      }, "Put style=\"display: inline;\" on each li of one list, and add list-style-type: none; to the ul."),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.6": { name: "Links", rules: [
      r("Has at least 6 <a> links, and every href starts with https://", function (c) { var a = c.all("a"); return a.length >= 6 && a.every(function (x) { return /^https:\/\//i.test(x.attrs.href || ""); }); }, "Copy the whole address from the browser, including https://"),
      r("At least 3 links open in a NEW tab (target=\"_blank\")", function (c) { return c.all("a").filter(function (a) { return a.attrs.target === "_blank"; }).length >= 3; }, "Links that leave your site open in a new tab."),
      r("At least 3 links open in the CURRENT tab (no target, or target=\"_self\")", function (c) { return c.all("a").filter(function (a) { return a.attrs.target === undefined || a.attrs.target === "_self"; }).length >= 3; }, "Leave off target, or write target=\"_self\"."),
      r("Link text says where the link goes (no \"click here\", \"here\", or \"link\")", function (c) { var a = c.all("a"); return a.length > 0 && a.every(function (x) { var s = c.text(x).trim().toLowerCase(); return s.length >= 3 && !/^(click here|here|link|this|this link)$/.test(s); }); }),
      r("At least 2 links wrap more than plain words: a heading, a paragraph, bold or italic words, or a whole list item", function (c) { return TESTS["a-wrap"](c) >= 2; }, "Put the whole heading or list item inside the a tag, so anything can be a link."),
      r("Every link sits inside a <li>, <p>, or heading, not loose in the body", function (c) { var a = c.all("a"); return a.length > 0 && a.every(function (x) { return !!c.ancestor(x, ["li", "p", "h1", "h2", "h3", "h4", "h5", "h6"]) || x.children.some(function (k) { return /^(li|p|h[1-6])$/.test(k.tag); }); }); }),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "6.7": { name: "Images", rules: [
      r("Has at least 3 <img> tags, each with a src", function (c) { var im = c.all("img"); return im.length >= 3 && im.every(function (i) { return (i.attrs.src || "").length > 0; }); }),
      r("Every image has a real alt description (not the placeholder text)", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { var a = (i.attrs.alt || "").trim().toLowerCase(); return a.length >= 3 && a !== "describe your image"; }); }, "Write what the picture shows, like alt=\"A red octopus on a reef\"."),
      r("At least 2 images were uploaded with the editor (Checks > My images > Insert)", function (c) { return c.all("img").filter(function (i) { return /\/api\/code\?img=/.test(i.attrs.src || ""); }).length >= 2; }, "Upload your own pictures. Open Checks, find My images, upload, then click Insert."),
      r("Every image src is a web address, not a file on your computer", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { return /^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || ""); }); }),
      r("Every image sets width OR height, but not both (keeps the shape)", function (c) {
        var im = c.all("img"); if (!im.length) return false;
        return im.every(function (i) {
          var st = {}; (i.attrs.style || "").split(";").forEach(function (p) { var k = p.split(":"); if (k[1]) st[k[0].trim().toLowerCase()] = k[1].trim(); });
          var w = i.attrs.width !== undefined || st.width !== undefined, h = i.attrs.height !== undefined || (st.height !== undefined && st.height !== "auto");
          return (w || h) && !(w && h);
        });
      }, "Choose one: the browser figures out the other. Example: style=\"width: 300px;\""),
      r("Uses at least 2 different image sizes, and at least one size is a percentage (like width: 50%)", function (c) {
        var sizes = {}, pct = false; c.all("img").forEach(function (i) {
          var st = {}; (i.attrs.style || "").split(";").forEach(function (p) { var k = p.split(":"); if (k[1]) st[k[0].trim().toLowerCase()] = k[1].trim(); });
          var v = st.width || st.height || i.attrs.width || i.attrs.height; if (v) { sizes[String(v).replace(/\s/g, "")] = 1; if (/%$/.test(String(v).trim())) pct = true; }
        }); return Object.keys(sizes).length >= 2 && pct;
      }, "Try one big image (width: 300px), one small one (width: 100px), and one that is width: 50%."),
      r("Every image is a clickable link: the <img> sits inside an <a> with a real https:// href", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { var a = c.ancestor(i, ["a"]); return !!a && /^https:\/\//i.test(a.attrs.href || "") && !/example\.com/i.test(a.attrs.href || ""); }); }, "The editor writes example.com for you. Change it to a real website."),
      r("At least one image link opens in a new tab (target=\"_blank\") and at least one opens in the current tab", function (c) {
        var a = []; c.all("img").forEach(function (i) { var l = c.ancestor(i, ["a"]); if (l) a.push(l); });
        return a.some(function (l) { return l.attrs.target === "_blank"; }) && a.some(function (l) { return l.attrs.target === undefined || l.attrs.target === "_self"; });
      }),
      r("Also has at least 3 text links (words that link to real sites)", function (c) { return realLinks(c).filter(function (a) { return !a.children.some(function (n) { return n.tag === "img"; }); }).length >= 3; }, "Links you learned in 3.7 still belong on every page."),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.1": { name: "Box Model", rules: [
      r("Padding, border, and margin are all used on the same element", function (c) {
        var by = new Map(); c.inline.forEach(function (d) { var s = by.get(d.el) || {}; if (/^padding/.test(d.prop)) s.p = 1; if (/^margin/.test(d.prop)) s.m = 1; if (/^border/.test(d.prop)) s.b = 1; by.set(d.el, s); });
        var ok = false; by.forEach(function (s) { if (s.p && s.m && s.b) ok = true; }); return ok;
      }),
r("Uses padding at least 2 times", function (c) { return TESTS["p-pad"](c) >= 2; }, "Padding is space inside the border."),
r("Uses margin at least 2 times", function (c) { return TESTS["p-mar"](c) >= 2; }, "Margin is space outside the border.")
    ] },
    "7.2": { name: "Colors (Named Colors and Hex)", rules: [
      r("All hex codes are written correctly (# plus 3 or 6 characters)", function (c) { var hs = colorTokens(c).filter(function (t) { return /^#/.test(t); }); return hs.length > 0 && hs.every(function (t) { return HEX.test(t); }); }),
r("Uses at least 2 hex colors (like #FF6347)", function (c) { return TESTS["v-hex"](c) >= 2; }, "A hex code is # and then 3 or 6 characters.")
    ] },
    "7.3": { name: "Display (Block vs Inline)", rules: [
r("Uses display: inline-block at least 2 times", function (c) { return TESTS["v-ib"](c) >= 2; }, "Inline-block sits in a row but keeps a width and height.")
    ] },
    "7.4": { name: "Div Tag", rules: [
      r("Has a <div> that contains other tags", function (c) { return c.all("div").some(function (d) { return d.children.some(function (n) { return n.tag !== "#text"; }); }); }),
      r("A <div> has a style attribute", function (c) { return c.all("div").some(function (d) { return d.attrs.style !== undefined; }); }),
      r("Has two or more side-by-side divs using display: inline-block", function (c) { return c.inline.filter(function (d) { return d.el.tag === "div" && d.prop === "display" && /inline-block/.test(d.value); }).length >= 2; }),
      r("Side-by-side divs also use vertical-align: top", function (c) { return c.inline.some(function (d) { return d.el.tag === "div" && d.prop === "vertical-align" && /top/.test(d.value); }); }),
      r("Column widths on one line add up to 98% or less", function (c) {
        var any = false, ok = true;
        function isCol(n) { return n.tag === "div" && /display\s*:\s*inline-block/i.test(n.attrs.style || ""); }
        function widthOf(n) { var m = /(?:^|;)\s*width\s*:\s*([\d.]+)%/i.exec(n.attrs.style || ""); return m ? parseFloat(m[1]) : null; }
        function visit(parent) {
          var sum = 0;
          parent.children.forEach(function (n) {
            if (n.tag === "#text") return;
            if (isCol(n) && widthOf(n) !== null) { any = true; sum += widthOf(n); if (sum > 98.0001) ok = false; }
            else sum = 0; // an hr or other block ends the row
            visit(n);
          });
        }
        visit(c.tree);
        return any && ok;
      }, "Give the browser room: 48% + 48% is fine, 50% + 50% is too tight.")
    ] },
    "7.5": { name: "Tables", rules: [
      r("Has a <table>", function (c) { return c.has("table"); }),
      r("Has a header row with <th> cells", function (c) { return c.has("th"); }),
      r("Has at least 2 data rows with <td> cells", function (c) { return c.all("tr").filter(function (t) { return t.children.some(function (n) { return n.tag === "td"; }); }).length >= 2; }),
      r("Every row has the same number of cells", function (c) {
        return c.all("table").length > 0 && c.all("table").every(function (t) {
          var rows = c.all("tr").filter(function (tr) { return c.ancestor(tr, ["table"]) === t; });
          if (!rows.length) return false;
          var counts = rows.map(function (tr) { return tr.children.filter(function (n) { return n.tag === "td" || n.tag === "th"; }).length; });
          return counts.every(function (n) { return n === counts[0]; });
        });
      }, "If row 1 has 3 headers, every row needs exactly 3 cells."),
      r("Only <tr> tags sit directly inside <table>, and only <td>/<th> inside <tr>", function (c) {
        var t = c.all("table"); if (!t.length) return false;
        return t.every(function (x) { return x.children.every(function (n) { return n.tag === "tr" || /^t(head|body|foot)$/.test(n.tag); }); }) &&
          c.all("tr").every(function (x) { return x.children.every(function (n) { return n.tag === "td" || n.tag === "th"; }); });
      })
    ] }
  };
  // Unit test = the whole site, everything from 6.1 through 7.5.
  LESSONS["7.6"] = { name: "Unit Test Website (all tags)", rules: [] };

  /* ---------- CSS (8.x) and Bootstrap (9.x) helpers ----------
     check() merges style.css into the page before analyzing, so c.sheetRules includes the CSS file.
     c.cssLinked = index.html links style.css; c.fileRules = rules written in style.css itself. */
  function els(c) { var out = []; (function w(n) { n.children.forEach(function (x) { if (x.tag === "#text") return; out.push(x); w(x); }); })(c.tree); return out; }
  function classesOf(n) { return String(n.attrs["class"] || "").trim().split(/\s+/).filter(Boolean); }
  function withClass(c, re) { return els(c).filter(function (n) { return classesOf(n).some(function (k) { return re.test(k); }); }); }
  function selParts(rule) { return rule.selector.split(",").map(function (s) { return s.trim(); }); }
  function ruleFor(c, test) { return c.sheetRules.filter(function (rl) { return selParts(rl).some(test); }); }
  function declares(rl, prop) { return rl.decls.some(function (d) { return d.prop === prop; }); }
  function valueOf(rl, prop) { var d = rl.decls.filter(function (x) { return x.prop === prop; })[0]; return d ? String(d.value).replace(/;$/, "").trim() : ""; }
  function inside(c, n, re) { var p = n.parent; while (p) { if (classesOf(p).some(function (k) { return re.test(k); })) return true; p = p.parent; } return false; }
  function descendants(n) { var out = []; (function w(x) { x.children.forEach(function (y) { if (y.tag === "#text") return; out.push(y); w(y); }); })(n); return out; }
  function hasBootstrap(c) { return c.all("link").some(function (l) { return /bootstrap/i.test(l.attrs.href || "") && /\.css/i.test(l.attrs.href || ""); }); }
  var BTN = /^btn-(outline-)?(primary|secondary|success|danger|warning|info|light|dark|link)$/;
  var UTIL = /^(text-(primary|secondary|success|danger|warning|info|light|dark|white|muted|center|start|end|uppercase|lowercase)|bg-(primary|secondary|success|danger|warning|info|light|dark|white)|fs-[1-6]|fw-(bold|bolder|normal|light|lighter)|fst-italic|display-[1-6]|lead)$/;

  LESSONS["8.1"] = { name: "Intro to External CSS + Classes", rules: [
    r("index.html links your style.css file inside the <head>", function (c) { return !!c.cssLinkInHead; }, "Use the style.css tab for your CSS, then link it from the head."),
    r("Styling lives in style.css: no more than 2 style attributes in index.html", function (c) { return TESTS["attr-style"](c) <= 2; }, "Move your styles out of the tags and into rules in style.css.", false, true),
    r("style.css has rules for at least 4 different tags", function (c) { return TESTS["s-tag"](c) >= 4; }, "Rules like body, h1, h2, p, ul, a, and table."),
    r("At least 2 elements have a class", function (c) { return TESTS["attr-class"](c) >= 2; }),
    r("style.css has .class rules for at least 2 different classes used in your page", function (c) { return TESTS["s-class"](c) >= 2; }, "A class rule starts with a dot, like .highlight, and the element needs class=\"highlight\".")
  ] };
  LESSONS["8.2"] = { name: "CSS by ID", rules: [
    r("At least 2 elements have an id", function (c) { return TESTS["attr-id"](c) >= 2; }),
    r("style.css has #id rules for at least 2 different ids used in your page", function (c) { return TESTS["s-id"](c) >= 2; }, "An id rule starts with #, like #banner, and the element needs id=\"banner\"."),
    r("Every id is used only once", function (c) { var seen = {}, ok = true, any = false; els(c).forEach(function (n) { var v = String(n.attrs.id || "").trim(); if (!v) return; any = true; if (seen[v]) ok = false; seen[v] = 1; }); return any && ok; }, "An id belongs to exactly one element.")
  ] };
  LESSONS["8.3"] = { name: "Combining Selectors + Specificity", rules: [
    r("A class rule overrides a tag rule on the same element (both set the same property)", function (c) {
      return els(c).some(function (n) {
        var tagRules = ruleFor(c, function (s) { return s.toLowerCase() === n.tag; });
        var clsRules = ruleFor(c, function (s) { var m = /^\.([\w-]+)$/.exec(s); return m && classesOf(n).indexOf(m[1]) > -1; });
        return tagRules.some(function (t) { return t.decls.some(function (d) { return clsRules.some(function (k) { return declares(k, d.prop); }); }); });
      });
    }, "Example idea: a rule for all paragraphs sets a color, and a class rule gives one special paragraph a different color."),
    r("At least 2 elements each use two classes at once", function (c) { return TESTS["attr-twoclass"](c) >= 2; }, "Separate the two class names with a space inside one class attribute."),
    r("style.css has at least 2 combined selectors (like p.note or ul li)", function (c) { return TESTS["s-combo"](c) >= 2; }, "A tag and a class stuck together (p.note), or one tag inside another (ul li)."),
    r("Both classes on a two-class element have rules in style.css", function (c) {
      return els(c).some(function (n) {
        var ks = classesOf(n); if (ks.length < 2) return false;
        return ks.filter(function (k) { return ruleFor(c, function (s) { return s === "." + k; }).length > 0; }).length >= 2;
      });
    })
  ] };
  LESSONS["8.4"] = { name: "Pseudo-classes + Hover Effects", rules: [
    r("Has at least 2 :hover rules that each change something", function (c) { return ruleFor(c, function (s) { return /:hover\b/.test(s); }).filter(function (rl) { return rl.decls.length > 0; }).length >= 2; }, "Try one on links and one on buttons or cards."),
    r("Uses transition on at least 2 rules so the hover changes are smooth", function (c) { return TESTS["p-trans"](c) >= 2; }, "Put the transition on the normal rule (not the :hover one) so it animates both ways."),
    r("A :hover rule is on a button, link, or card", function (c) { return ruleFor(c, function (s) { return /:hover\b/.test(s) && /(^|[\s>+~])(a|button)\b|\.[\w-]*(btn|button|card|link)[\w-]*/i.test(s); }).length > 0; })
  ] };
  LESSONS["8.5"] = { name: "Flexbox Basics", rules: [
    r("At least 2 different sections are flex containers (display: flex)", function (c) { return TESTS["p-flex"](c) >= 2; }, "Two class rules, each with display: flex."),
    r("Each flex container also sets justify-content or align-items", function (c) { var f = c.sheetRules.filter(function (rl) { return /^(inline-)?flex$/i.test(valueOf(rl, "display")); }); return f.length >= 2 && f.every(function (rl) { return declares(rl, "justify-content") || declares(rl, "align-items"); }); }),
    r("The flex containers are classes or ids (not the whole body)", function (c) { return c.sheetRules.filter(function (rl) { return /^(inline-)?flex$/i.test(valueOf(rl, "display")) && selParts(rl).some(function (s) { return /^[.#]/.test(s); }); }).length >= 2; })
  ] };
  LESSONS["8.6"] = { name: "CSS Grid Basics", rules: [
    r("At least 2 different sections are grids (display: grid)", function (c) { return TESTS["p-grid"](c) >= 2; }, "Two class rules, each with display: grid."),
    r("Each grid sets grid-template-columns", function (c) { var g = c.sheetRules.filter(function (rl) { return /^(inline-)?grid$/i.test(valueOf(rl, "display")); }); return g.length >= 2 && g.every(function (rl) { return declares(rl, "grid-template-columns"); }); }),
    r("Each grid sets a gap", function (c) { var g = c.sheetRules.filter(function (rl) { return /^(inline-)?grid$/i.test(valueOf(rl, "display")); }); return g.length >= 2 && g.every(function (rl) { return declares(rl, "gap") || declares(rl, "grid-gap") || declares(rl, "column-gap") || declares(rl, "row-gap"); }); })
  ] };

  LESSONS["8.7"] = { name: "Unit Test Website (CSS)", rules: [] };

  LESSONS["9.1"] = { name: "Setting Up Bootstrap", rules: [
    r("Links Bootstrap's CSS (the CDN link) inside the <head>", function (c) { return c.all("link").some(function (l) { return /bootstrap/i.test(l.attrs.href || "") && /\.css/i.test(l.attrs.href || "") && !!c.ancestor(l, ["head"]); }); }, "Find the official CSS link on getbootstrap.com under Getting Started."),
    r("The Bootstrap link is a full https:// web address", function (c) { return c.all("link").some(function (l) { return /^https:\/\/.*bootstrap.*\.css/i.test(l.attrs.href || ""); }); }, "A CDN file lives on the internet, so its address starts with https://")
  ] };
  LESSONS["9.2"] = { name: "The Grid System", rules: [
    r("Has a container", function (c) { return withClass(c, /^container(-fluid|-(sm|md|lg|xl|xxl))?$/).length > 0; }),
    r("A row sits inside the container", function (c) { return withClass(c, /^row$/).some(function (n) { return inside(c, n, /^container/); }); }),
    r("A row has at least 2 columns (col classes)", function (c) { return withClass(c, /^row$/).some(function (n) { return n.children.filter(function (k) { return k.tag !== "#text" && classesOf(k).some(function (x) { return /^col(-|$)/.test(x); }); }).length >= 2; }); })
  ] };
  LESSONS["9.3"] = { name: "Typography, Colors + Buttons", rules: [
    r("Uses at least one Bootstrap text or color utility class (like text-primary, bg-light, or fw-bold)", function (c) { return withClass(c, UTIL).length > 0; }),
    r("Has a Bootstrap button (btn plus a style like btn-primary)", function (c) { return els(c).some(function (n) { var k = classesOf(n); return k.indexOf("btn") > -1 && k.some(function (x) { return BTN.test(x); }); }); })
  ] };
  LESSONS["9.4"] = { name: "Navbar", rules: [
    r("Has a <nav> with the navbar class", function (c) { return c.all("nav").some(function (n) { return classesOf(n).indexOf("navbar") > -1; }); }),
    r("The navbar shows your site's name (navbar-brand)", function (c) { return withClass(c, /^navbar-brand$/).some(function (n) { return inside(c, n, /^navbar$/) && c.text(n).length > 0; }); }),
    r("The navbar has at least 3 links (nav-link)", function (c) { return withClass(c, /^nav-link$/).filter(function (n) { return n.tag === "a" && inside(c, n, /^navbar$/); }).length >= 3; })
  ] };
  LESSONS["9.5"] = { name: "Cards", rules: [
    r("Has at least 3 cards", function (c) { return withClass(c, /^card$/).length >= 3; }),
    r("At least 3 cards each have an image, a title, text, and a button", function (c) {
      return withClass(c, /^card$/).filter(function (card) {
        var d = descendants(card), has = function (re) { return d.some(function (n) { return classesOf(n).some(function (k) { return re.test(k); }); }); };
        return d.some(function (n) { return n.tag === "img"; }) && has(/^card-title$/) && has(/^card-text$/) && d.some(function (n) { return classesOf(n).indexOf("btn") > -1; });
      }).length >= 3;
    }, "Each card needs card-img-top, card-title, card-text, and a btn."),
    r("The cards sit in a row so they line up side by side", function (c) { return withClass(c, /^card$/).filter(function (n) { return inside(c, n, /^row$/); }).length >= 3; })
  ] };
  LESSONS["9.6"] = { name: "Forms", rules: [
    r("Has a <form>", function (c) { return c.has("form"); }),
    r("At least 2 labels use form-label", function (c) { return c.all("label").filter(function (n) { return classesOf(n).indexOf("form-label") > -1; }).length >= 2; }),
    r("At least 2 fields use form-control (or form-select)", function (c) { return els(c).filter(function (n) { return /^(input|textarea|select)$/.test(n.tag) && classesOf(n).some(function (k) { return k === "form-control" || k === "form-select"; }); }).length >= 2; }),
    r("Has a submit button styled with btn", function (c) { return els(c).some(function (n) { return ((n.tag === "button" && (n.attrs.type === undefined || /submit/i.test(n.attrs.type))) || (n.tag === "input" && /submit/i.test(n.attrs.type || ""))) && classesOf(n).indexOf("btn") > -1 && !!c.ancestor(n, ["form"]); }); })
  ] };
  LESSONS["9.7"] = { name: "Unit Test Website (Bootstrap)", rules: [] };

  var ORDER = ["6.1", "6.2", "6.20", "6.3", "6.35", "6.4", "6.5", "6.6", "6.7", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6",
               "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7"];

  var TOTAL_POINTS = 50;      // points a lesson is worth
  var CARRY_WEIGHT = 0.4;     // rules from earlier lessons count this much as new ones

  function rulesFor(lesson) {
    // Every lesson is its own project. Only the "base" rules (the basics: DOCTYPE, skeleton, title,
    // one h1, tags closed correctly) carry into later lessons. The unit test (7.6) uses everything.
    var idx = ORDER.indexOf(lesson), out = [];
    if (idx < 0) return out;
    var testOf = LESSONS[lesson].testOf || null;
    ORDER.forEach(function (l, i) {
      if (i > idx) return;
      var isNew = (i === idx) || (!!testOf && testOf.some(function (p) { return l.indexOf(p) === 0; }));
      (LESSONS[l].rules || []).forEach(function (rule, j) {
        if (rule.only && l !== lesson) return;
        if (!isNew && !rule.base) return;
        out.push({ id: l + "-" + j, lesson: l, label: rule.label, tip: rule.tip, test: rule.test, isNew: isNew });
      });
    });
    reviewRules(lesson).forEach(function (rr) { if (!out.some(function (x) { return x.id === rr.id; })) out.push(rr); });
    /* once links and pictures have been taught (3.7 and 3.8), EVERY assignment after them needs a few of each */
    if (idx > ORDER.indexOf("6.7")) {
      out.push({ id: "A-links", lesson: lesson, label: "At least 3 links, each with an https:// address", tip: "Link to real sites that fit your page. Use <a href=\"https://...\">words</a>.", isNew: true, test: function (c) { return realLinks(c).length >= 3; } });
      out.push({ id: "A-images", lesson: lesson, label: "At least 3 pictures, each with a real alt description", tip: "Upload pictures in Checks, then My images, then Insert.", isNew: true, test: function (c) { var im = c.all("img"); return im.length >= 3 && im.every(function (i) { return /\S{3,}/.test(i.attrs.alt || ""); }); } });
      out.push({ id: "A-imglinks", lesson: lesson, label: "At least 2 of your pictures are clickable links (the picture sits inside an <a>)", tip: "Wrap the img in an a tag with a real https:// address.", isNew: true, test: function (c) { return c.all("img").filter(function (i) { var a = c.ancestor(i, ["a"]); return !!a && /^https:\/\//i.test(a.attrs.href || "") && !/example\.com/i.test(a.attrs.href || ""); }).length >= 2; } });
    }
    return out;
  }

  // css (optional) = the student's style.css. When index.html links it, it is merged in so rules see it.
  var CSS_LINK = /<link\b[^>]*\bhref\s*=\s*["']?style\.css["']?[^>]*>/i;
  function check(lesson, src, css) {
    src = String(src || ""); css = String(css || "");
    var linked = CSS_LINK.test(src);
    var merged = (linked && css.trim()) ? src.replace(CSS_LINK, function () { return "<style>" + css.replace(/<\/style/gi, "<\\/style") + "</style>"; }) : src;
    var c = analyze(merged), rules = rulesFor(lesson), results = [];
    c.cssLinked = linked; c.cssFile = css; c.fileRules = linked ? parseSheet(css, 1, []) : [];
    // Was the style.css link inside <head>? (checked on the original page, since the merge replaces it)
    c.cssLinkInHead = linked && analyze(src).all("link").some(function (l) { return /style\.css/i.test(l.attrs.href || "") && !!ancestor(l, ["head"]); });
    rules.forEach(function (rule) {
      var ok = false; try { ok = !!rule.test(c); } catch (e) { ok = false; }
      results.push({ id: rule.id, lesson: rule.lesson, label: rule.label, tip: rule.tip, isNew: rule.isNew, ok: ok });
    });
    var num = 0, den = 0;
    results.forEach(function (x) { var w = x.isNew ? 1 : CARRY_WEIGHT; den += w; if (x.ok) num += w; });
    var score = den ? Math.round(TOTAL_POINTS * num / den * 10) / 10 : 0;
    var empty = !String(src || "").trim();
    return { lesson: lesson, results: results, errors: c.errors, warnings: c.warnings, tags: c.tags, score: empty ? 0 : score, total: TOTAL_POINTS, passed: results.filter(function (x) { return x.ok; }).length, count: results.length, empty: empty };
  }

  // Which tags are still open at the end of this text? (used by the editor to auto-close tags)
  function openTags(src) { var p = parse(String(src || "")); return { open: p.open, raw: p.openRaw }; }
  // Builds what the preview shows: swaps <link href="style.css"> for the student's CSS file, and adds a tiny
  // starter style (page margins + text that always wraps) BEFORE their own styles so theirs still win.
  var BASE_STYLE = "<style id=\"__base\">html{overflow-wrap:anywhere;word-wrap:break-word}body{margin:0;padding:16px 20px}</style>";
  function previewDoc(html, css) {
    html = String(html || ""); css = String(css || "");
    if (css.trim()) html = html.replace(/<link\b[^>]*\bhref\s*=\s*["']?style\.css["']?[^>]*>/i, function () { return "<style>" + css.replace(/<\/style/gi, "<\\/style") + "</style>"; });
    if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, function (m) { return m + BASE_STYLE; });
    return BASE_STYLE + html;
  }
  // The same merged page the checker sees (style.css folded in when index.html links it). Used by the step-by-step auto-check (step-checks.js).
  function context(src, css) {
    src = String(src || ""); css = String(css || "");
    var linked = CSS_LINK.test(src);
    var merged = (linked && css.trim()) ? src.replace(CSS_LINK, function () { return "<style>" + css.replace(/<\/style/gi, "<\\/style") + "</style>"; }) : src;
    var c = analyze(merged); c.cssLinked = linked; c.cssFile = css; c.rawSrc = src;
    return c;
  }
  var API = { context: context, TESTS: TESTS, REVIEW_MIN: REVIEW_MIN, quality: function (src) { return quality(analyze(String(src || ""))); }, analyze: analyze, check: check, openTags: openTags, previewDoc: previewDoc, VOID: VOID, NAMED: NAMED, LESSONS: LESSONS, ORDER: ORDER, TOTAL_POINTS: TOTAL_POINTS };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.HTMLCheck = API;
})(typeof window !== "undefined" ? window : globalThis);
