/* Unit 7 HTML checker + lesson requirements.
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

  // CSS properties used in Unit 7 (anything else gets a friendly warning, not a failure).
  var KNOWN_PROPS = ["color", "font-size", "font-family", "font-weight", "text-align", "text-transform", "text-decoration",
    "background-color", "background", "border", "border-radius", "border-top", "border-bottom", "border-left", "border-right",
    "border-style", "border-width", "border-color", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "width", "height", "max-width", "min-width",
    "max-height", "min-height", "display", "vertical-align", "list-style-type", "line-height", "letter-spacing",
    "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius", "float", "cursor"];

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
      if (last && !endsOk) issues.push({ line: line, msg: where + ': end the last property with a semicolon: "' + prop + ": " + val.slice(0, 20) + ';".', soft: true });
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
     LESSON REQUIREMENTS  (edit these to match what you assign)
     Each lesson lists ONLY its new rules. Earlier lessons carry over automatically
     (they count a little less, so students keep the earlier parts of their site).
     ===================================================================== */
  var LESSONS = {
    "7.1": { name: "Intro to HTML and the HTML Skeleton", rules: [
      r("First line is <!DOCTYPE html>", function (c) { return /^\s*<!doctype html>/i.test(c.src); }, "Every real web page starts with this line.", false, true),
      r("Has the skeleton: <html> containing <head> and then <body>", function (c) {
        var h = c.all("html")[0]; if (!h) return false;
        var kids = h.children.filter(function (n) { return n.tag !== "#text"; }).map(function (n) { return n.tag; });
        return kids.indexOf("head") > -1 && kids.indexOf("body") > -1 && kids.indexOf("head") < kids.indexOf("body");
      }, "head and body both go inside html, with head first.", false, true),
      r("Exactly one <title> inside <head> with text in it", function (c) {
        var t = c.all("title"); return t.length === 1 && !!c.ancestor(t[0], ["head"]) && c.text(t[0]).length > 0;
      }, "The title is the text that shows in the browser tab.", false, true),
      r("Exactly one <h1> in the <body>", function (c) { var a = c.all("h1"); return a.length === 1 && !!c.ancestor(a[0], ["body"]) && c.text(a[0]).length > 0; }, "An h1 is the main title, so use it once.", false, true),
      r("At least 3 section headings (<h2> or <h3>)", function (c) { return c.count("h2") + c.count("h3") >= 3; }, "Wikipedia pages are split into sections, and each section starts with a heading.", true),
      r("Headings follow the outline order (no <h3> before an <h2>, and no skipped levels)", function (c) {
        var hs = []; (function w(n) { n.children.forEach(function (x) { if (x.tag === "#text") return; if (/^h[1-6]$/.test(x.tag)) hs.push(+x.tag.charAt(1)); w(x); }); })(c.tree);
        if (!hs.length || hs[0] !== 1) return false;
        for (var i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) return false; return true;
      }, "Like an outline: h1 first, then h2 sections, and h3 only inside an h2.", true),
      r("At least 10 <p> paragraphs, all inside the <body>", function (c) { var a = c.all("p"); return a.length >= 10 && a.every(function (n) { return !!c.ancestor(n, ["body"]); }); }, "", true),
      r("At least 8 of your paragraphs have 25 words or more", function (c) { return c.all("p").filter(function (n) { return c.words(n) >= 25; }).length >= 8; }, "Write full paragraphs of 3 to 5 sentences.", true),
      r("At least 300 words of text on the page", function (c) { var b = c.all("body")[0]; return !!b && c.words(b) >= 300; }, "A long page, like a real encyclopedia article.", true),
      r("Your writing is real: no keyboard mashing, nonsense words, or filler text", function (c) { var q = quality(c); return !q.flags.some(function (f) { return f.sev === "high" && /^(gibberish|filler|salad)$/.test(f.id); }); }, "Write real sentences in your own words.", true),
      r("Your writing is not the same content over and over (no repeated paragraphs, sentences, or phrases)", function (c) { var q = quality(c); return !q.flags.some(function (f) { return f.sev === "high" && /^(dup-paras|dup-sents|phrase|word-run|variety)$/.test(f.id); }); }, "Every paragraph should say something new.", true),
      r("Your paragraphs are about your topic (the words in your title show up in them)", function (c) { var q = quality(c); return q.topicMentions === null || q.n < 60 || q.topicMentions >= 3; }, "Use your topic's name and related words in your paragraphs.", true),
      r("Every tag is closed and nested correctly", function (c) { return c.errors.length === 0 && c.has("html"); }, "See the Problems list for exactly which line to fix.", false, true)
    ] },
    "7.2": { name: "The Style Attribute", rules: [
      r("Uses at least 2 different heading levels (h1, h2, h3...)", function (c) { var n = 0; ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (h) { if (c.has(h)) n++; }); return n >= 2; }),
      r("Has at least 3 <p> paragraphs", function (c) { return c.count("p") >= 3; }),
      r("Uses the style attribute with color", function (c) { return c.inline.some(function (d) { return d.prop === "color"; }); }),
      r("Uses font-size in pixels (like 24px)", function (c) { return anyValue(c, "font-size", function (v) { return /^\d+(\.\d+)?px$/i.test(v); }); }),
      r("Uses text-align or text-transform", function (c) { return c.prop("text-align") + c.prop("text-transform") > 0; }),
      r("Uses background-color (the color behind the text)", function (c) { return c.prop("background-color") > 0; }),
      r("Uses the border shortcut: thickness, style, color (like 2px solid black)", function (c) { return anyValue(c, "border", function (v) { return /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(v); }); }),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\""),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.3": { name: "Editing Tags + Span + Font Families", rules: [
      r("Uses <strong> and <em>", function (c) { return c.has("strong") && c.has("em"); }),
      r("Uses <br> at least once (and never closes it)", function (c) { return c.has("br"); }),
      r("Uses <hr> at least once", function (c) { return c.has("hr"); }),
      r("Editing tags (strong/em) are inside a creation tag like <p> or <h1>", function (c) {
        var e = c.all("strong").concat(c.all("em")); return e.length > 0 && e.every(function (n) { return !!c.ancestor(n, ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"]); });
      }),
      r("Uses a <span> with a style attribute", function (c) { return c.all("span").some(function (s) { return s.attrs.style !== undefined; }); }),
      r("Uses font-family with serif, sans-serif, or monospace", function (c) { return anyValue(c, "font-family", function (v) { return /(^|[\s,'"])(serif|sans-serif|monospace)\s*$/i.test(v.replace(/;$/, "")); }); }),
      r("Uses the border shortcut: thickness, style, color (like 2px solid black)", function (c) { return anyValue(c, "border", function (v) { return /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(v); }); }),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.4": { name: "Borders + Everything So Far", rules: [
      r("Has at least 3 headings, using at least 2 different levels (only one h1)", function (c) { var lv = 0, n = 0; ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (h) { if (c.has(h)) lv++; n += c.count(h); }); return n >= 3 && lv >= 2; }, "One h1 for WANTED, then h2 and h3 for the rest."),
      r("Has at least 3 <p> paragraphs", function (c) { return c.count("p") >= 3; }),
      r("Uses <strong> (or <b>) at least 3 times", function (c) { return c.count("strong") + c.count("b") >= 3; }),
      r("Uses <em> (or <i>) at least 3 times", function (c) { return c.count("em") + c.count("i") >= 3; }),
      r("Uses <br> at least 3 times", function (c) { return c.count("br") >= 3; }),
      r("Uses <hr> at least 3 times", function (c) { return c.count("hr") >= 3; }),
      r("Uses <span> with a style attribute at least 3 times", function (c) { return c.all("span").filter(function (s) { return s.attrs.style !== undefined; }).length >= 3; }),
      r("Uses color at least 3 times", function (c) { return c.prop("color") >= 3; }),
      r("Uses background-color at least 3 times", function (c) { return c.prop("background-color") >= 3; }),
      r("Uses font-size in pixels at least 3 times", function (c) { return c.propValues("font-size").filter(function (v) { return /^\d+(\.\d+)?px$/i.test(v); }).length >= 3; }),
      r("Uses text-align or text-transform at least 3 times", function (c) { return c.prop("text-align") + c.prop("text-transform") >= 3; }),
      r("Uses font-family (serif, sans-serif, or monospace) at least 3 times", function (c) { return c.propValues("font-family").filter(function (v) { return /(^|[\s,'"])(serif|sans-serif|monospace)\s*$/i.test(v.replace(/;$/, "")); }).length >= 3; }),
      r("Puts the border shortcut (thickness, style, color) on at least 3 different elements", function (c) {
        var els = []; c.inline.forEach(function (d) { if (/^border(-top|-bottom|-left|-right)?$/.test(d.prop) && /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(d.value) && els.indexOf(d.el) < 0) els.push(d.el); }); return els.length >= 3;
      }),
      r("Uses at least 2 different border styles (like solid and dashed)", function (c) {
        var seen = {}; ["border", "border-top", "border-bottom", "border-left", "border-right"].forEach(function (p) { c.propValues(p).forEach(function (v) { var m = /\b(solid|dashed|dotted|double|groove|ridge)\b/i.exec(v); if (m) seen[m[1].toLowerCase()] = 1; }); }); return Object.keys(seen).length >= 2;
      }, "Try solid, dashed, dotted, double, groove, or ridge."),
      r("Uses a border on just one side (border-top, border-bottom, border-left, or border-right)", function (c) { return c.prop("border-top") + c.prop("border-bottom") + c.prop("border-left") + c.prop("border-right") > 0; }, "Same three parts, one side only: border-bottom: 3px solid navy;"),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.5": { name: "Lists + Everything So Far", rules: [
      r("Has at least 2 <ol> and at least 2 <ul> lists", function (c) { return c.count("ol") >= 2 && c.count("ul") >= 2; }, "Plan one ordered and one bullet list in each section."),
      r("Every list has at least 3 <li> items", function (c) { var l = c.all("ul").concat(c.all("ol")); return l.length > 0 && l.every(function (x) { return x.children.filter(function (n) { return n.tag === "li"; }).length >= 3; }); }),
      r("Only <li> tags sit directly inside a list", function (c) { var l = c.all("ul").concat(c.all("ol")); return l.length > 0 && l.every(function (x) { return x.children.every(function (n) { return n.tag === "li"; }); }); }),
      r("Uses list-style-type on at least 2 lists (on the <ul> or <ol>, not the li)", function (c) { return c.inline.filter(function (d) { return d.prop === "list-style-type" && (d.el.tag === "ul" || d.el.tag === "ol"); }).length >= 2; }),
      r("Has at least 2 <h2> and at least 2 <h3> headings, in outline order (no skipping levels)", function (c) {
        if (c.count("h2") < 2 || c.count("h3") < 2) return false;
        var hs = []; (function w(n) { n.children.forEach(function (x) { if (x.tag === "#text") return; if (/^h[1-6]$/.test(x.tag)) hs.push(+x.tag.charAt(1)); w(x); }); })(c.tree);
        if (!hs.length || hs[0] !== 1) return false;
        for (var i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) return false; return true;
      }, "h1 first, then h2 sections, with h3 labels inside them."),
      r("Has at least 2 <p> paragraphs", function (c) { return c.count("p") >= 2; }),
      r("Uses <strong> (or <b>) at least 2 times", function (c) { return c.count("strong") + c.count("b") >= 2; }),
      r("Uses <em> (or <i>) at least 2 times", function (c) { return c.count("em") + c.count("i") >= 2; }),
      r("Uses <br> at least 2 times", function (c) { return c.count("br") >= 2; }),
      r("Uses <hr> at least 2 times", function (c) { return c.count("hr") >= 2; }),
      r("Uses <span> with a style attribute at least 2 times", function (c) { return c.all("span").filter(function (s) { return s.attrs.style !== undefined; }).length >= 2; }),
      r("Uses color at least 2 times", function (c) { return c.prop("color") >= 2; }),
      r("Uses background-color at least 2 times", function (c) { return c.prop("background-color") >= 2; }),
      r("Uses font-size in pixels at least 2 times", function (c) { return c.propValues("font-size").filter(function (v) { return /^\d+(\.\d+)?px$/i.test(v); }).length >= 2; }),
      r("Uses text-align or text-transform at least 2 times", function (c) { return c.prop("text-align") + c.prop("text-transform") >= 2; }),
      r("Uses font-family (serif, sans-serif, or monospace) at least 2 times", function (c) { return c.propValues("font-family").filter(function (v) { return /(^|[\s,'"])(serif|sans-serif|monospace)\s*$/i.test(v.replace(/;$/, "")); }).length >= 2; }),
      r("Puts the border shortcut (thickness, style, color) on at least 2 different elements", function (c) {
        var els = []; c.inline.forEach(function (d) { if (/^border(-top|-bottom|-left|-right)?$/.test(d.prop) && /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(d.value) && els.indexOf(d.el) < 0) els.push(d.el); }); return els.length >= 2;
      }),
      r("Makes one list horizontal: display: inline on at least 3 <li> (block turned into inline)", function (c) {
        return c.inline.filter(function (d) { return d.prop === "display" && /^inline$/i.test(d.value.replace(/;$/, "").trim()) && d.el.tag === "li"; }).length >= 3;
      }, "Put style=\"display: inline;\" on each li of one list, and add list-style-type: none; to the ul."),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.6": { name: "Links + Everything So Far", rules: [
      r("Has at least 6 <a> links, and every href starts with https://", function (c) { var a = c.all("a"); return a.length >= 6 && a.every(function (x) { return /^https:\/\//i.test(x.attrs.href || ""); }); }, "Copy the whole address from the browser, including https://"),
      r("At least 3 links open in a NEW tab (target=\"_blank\")", function (c) { return c.all("a").filter(function (a) { return a.attrs.target === "_blank"; }).length >= 3; }, "Links that leave your site open in a new tab."),
      r("At least 3 links open in the CURRENT tab (no target, or target=\"_self\")", function (c) { return c.all("a").filter(function (a) { return a.attrs.target === undefined || a.attrs.target === "_self"; }).length >= 3; }, "Leave off target, or write target=\"_self\"."),
      r("Link text says where the link goes (no \"click here\", \"here\", or \"link\")", function (c) { var a = c.all("a"); return a.length > 0 && a.every(function (x) { var s = c.text(x).trim().toLowerCase(); return s.length >= 3 && !/^(click here|here|link|this|click)$/.test(s); }); }),
      r("Every link sits inside a <li> or <p>, not loose in the body", function (c) { var a = c.all("a"); return a.length > 0 && a.every(function (x) { return !!c.ancestor(x, ["li", "p"]); }); }),
      r("Has an internal <style> block inside <head>", function (c) { return c.all("style").some(function (s) { return !!c.ancestor(s, ["head"]); }); }),
      r("Styles all four link states: a:link, a:visited, a:hover, a:active", function (c) { return ["a:link", "a:visited", "a:hover", "a:active"].every(function (s) { return c.selector(s).length > 0; }); }),
      r("Link states are in LVHA order (link, visited, hover, active)", function (c) {
        var order = ["a:link", "a:visited", "a:hover", "a:active"], pos = [];
        c.sheetRules.forEach(function (rl) { var k = order.indexOf(rl.selector.toLowerCase()); if (k > -1) pos.push(k); });
        if (pos.length < 4) return false; for (var i = 1; i < pos.length; i++) if (pos[i] < pos[i - 1]) return false; return true;
      }, "Love, Visit, Hate, Always: :link, :visited, :hover, :active"),
      r("a:hover changes at least 2 things (like color and background-color)", function (c) { return c.selector("a:hover").some(function (rl) { return rl.decls.length >= 2; }); }),
      r("The style block also styles at least 2 non-link tags (like h2 or p) so the page is styled from the head", function (c) {
        var tags = {}; c.sheetRules.forEach(function (rl) { if (/^[a-z][a-z0-9]*$/i.test(rl.selector.trim())) tags[rl.selector.trim().toLowerCase()] = 1; }); return Object.keys(tags).length >= 2;
      }, "Try h1 { ... } and h2 { ... }."),
      r("Has an h1, an h2, and an h3 in outline order", function (c) {
        if (!c.has("h1") || !c.has("h2") || !c.has("h3")) return false;
        var hs = []; (function w(n) { n.children.forEach(function (x) { if (x.tag === "#text") return; if (/^h[1-6]$/.test(x.tag)) hs.push(+x.tag.charAt(1)); w(x); }); })(c.tree);
        if (hs[0] !== 1) return false; for (var i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) return false; return true;
      }),
      r("Uses <p>, <strong>, and <em>", function (c) { return c.has("p") && (c.has("strong") || c.has("b")) && (c.has("em") || c.has("i")); }),
      r("Uses <br> and <hr> (never closed)", function (c) { return c.has("br") && c.has("hr"); }),
      r("Has a <ul> and an <ol>, each with at least 3 <li> items and only li directly inside", function (c) {
        var l = c.all("ul").concat(c.all("ol")); return c.has("ul") && c.has("ol") && l.every(function (x) { return x.children.filter(function (n) { return n.tag === "li"; }).length >= 3 && x.children.every(function (n) { return n.tag === "li"; }); });
      }),
      r("Uses list-style-type on a <ul> or <ol>", function (c) { return c.prop("list-style-type") > 0; }),
      r("Uses a <span> with a style attribute (an inline exception)", function (c) { return c.all("span").some(function (s) { return s.attrs.style !== undefined; }); }),
      r("Uses color, background-color, and font-size in pixels", function (c) { return c.prop("color") > 0 && c.prop("background-color") > 0 && c.propValues("font-size").some(function (v) { return /^\d+(\.\d+)?px$/i.test(v); }); }),
      r("Uses text-align or text-transform", function (c) { return c.prop("text-align") + c.prop("text-transform") > 0; }),
      r("Uses at least 2 different font families (serif, sans-serif, monospace)", function (c) {
        var seen = {}; c.propValues("font-family").forEach(function (v) { var m = /(^|[\s,'"])(serif|sans-serif|monospace)\s*$/i.exec(v.replace(/;$/, "")); if (m) seen[m[2].toLowerCase()] = 1; }); return Object.keys(seen).length >= 2;
      }, "Try serif for headings, sans-serif for the body, and monospace for the footer."),
      r("Uses the style attribute on at least 2 different tags (your inline exceptions)", function (c) { var els = []; c.inline.forEach(function (d) { if (els.indexOf(d.el) < 0) els.push(d.el); }); return els.length >= 2; }, "Example: a colored span, and a footer paragraph."),
      r("Uses the border shortcut: thickness, style, color (like 2px solid black)", function (c) { return ["border", "border-top", "border-bottom", "border-left", "border-right"].some(function (p) { return anyValue(c, p, function (v) { return /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(v); }); }); }),
      r("Your text is real writing: no nonsense words, filler, or the same words over and over", function (c) { return !quality(c).severe; }, "Write real words that fit your page.", true)
    ] },
    "7.7": { name: "Images (Clickable, Resized)", rules: [
      r("Has at least 3 <img> tags, each with a src", function (c) { var im = c.all("img"); return im.length >= 3 && im.every(function (i) { return (i.attrs.src || "").length > 0; }); }),
      r("Every image has a real alt description (not the placeholder text)", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { var a = (i.attrs.alt || "").trim().toLowerCase(); return a.length >= 3 && a !== "describe your image here"; }); }, "Say what is in the picture, like alt=\"Rex the bulldog wearing a cowboy hat\"."),
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
      r("Every image is a clickable link: the <img> sits inside an <a> with an https:// href", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { var a = c.ancestor(i, ["a"]); return !!a && /^https:\/\//i.test(a.attrs.href || "") && !/example\.com/i.test(a.attrs.href); }); }, "Change the example link the editor inserts to a real website."),
      r("At least one image link opens in a new tab (target=\"_blank\") and at least one opens in the current tab", function (c) {
        var a = []; c.all("img").forEach(function (i) { var l = c.ancestor(i, ["a"]); if (l) a.push(l); });
        return a.some(function (l) { return l.attrs.target === "_blank"; }) && a.some(function (l) { return l.attrs.target === undefined || l.attrs.target === "_self"; });
      }),
      r("Uses border-radius on an image", function (c) { return c.all("img").some(function (i) { return c.inline.some(function (d) { return d.el === i && d.prop === "border-radius"; }); }) || c.selector("img").some(function (rl) { return rl.decls.some(function (d) { return d.prop === "border-radius"; }); }); }),
      r("Uses a border on an image", function (c) { return c.all("img").some(function (i) { return c.inline.some(function (d) { return d.el === i && /^border/.test(d.prop); }); }) || c.selector("img").some(function (rl) { return rl.decls.some(function (d) { return /^border/.test(d.prop); }); }); }),
      r("Uses display: block on at least one image (so it sits on its own line)", function (c) { return c.all("img").some(function (i) { return c.inline.some(function (d) { return d.el === i && d.prop === "display" && /^block$/i.test(d.value.replace(/;$/, "").trim()); }); }) || c.selector("img").some(function (rl) { return rl.decls.some(function (d) { return d.prop === "display" && /^block$/i.test(d.value.replace(/;$/, "").trim()); }); }); }, "Images are inline by default. display: block puts one on its own line."),
      r("Has an <h1> and at least 2 more headings, and at least 3 <p> paragraphs", function (c) { var n = 0; ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (h) { n += c.count(h); }); return c.has("h1") && n >= 3 && c.count("p") >= 3; }),
      r("Has an internal <style> block in the head with at least 2 rules", function (c) { return c.all("style").some(function (s) { return !!c.ancestor(s, ["head"]); }) && c.sheetRules.length >= 2; }),
      r("Uses text-align: center on something", function (c) { return c.propValues("text-align").some(function (v) { return /center/i.test(v); }); })
    ] },
    "7.8": { name: "Box Model", rules: [
      r("Uses padding", function (c) { return c.prop("padding") + c.prop("padding-top") + c.prop("padding-left") + c.prop("padding-right") + c.prop("padding-bottom") > 0; }),
      r("Uses margin", function (c) { return c.prop("margin") + c.prop("margin-top") + c.prop("margin-left") + c.prop("margin-right") + c.prop("margin-bottom") > 0; }),
      r("Uses a border with a valid style (solid, dashed, dotted, double, groove, ridge)", function (c) { return anyValue(c, "border", function (v) { return /(solid|dashed|dotted|double|groove|ridge)/i.test(v); }); }),
      r("Padding, border, and margin are all used on the same element", function (c) {
        var by = new Map(); c.inline.forEach(function (d) { var s = by.get(d.el) || {}; if (/^padding/.test(d.prop)) s.p = 1; if (/^margin/.test(d.prop)) s.m = 1; if (/^border/.test(d.prop)) s.b = 1; by.set(d.el, s); });
        var ok = false; by.forEach(function (s) { if (s.p && s.m && s.b) ok = true; }); return ok;
      })
    ] },
    "7.9": { name: "Colors (Named Colors and Hex)", rules: [
      r("Uses at least one named color (like tomato or navy)", function (c) { return colorTokens(c).some(function (t) { return NAMED[t.toLowerCase()]; }); }),
      r("Uses at least one hex color (like #FF6347)", function (c) { return colorTokens(c).some(function (t) { return HEX.test(t); }); }),
      r("All hex codes are written correctly (# plus 3 or 6 characters)", function (c) { var hs = colorTokens(c).filter(function (t) { return /^#/.test(t); }); return hs.length > 0 && hs.every(function (t) { return HEX.test(t); }); }),
      r("Uses color AND background-color", function (c) { return c.prop("color") > 0 && c.prop("background-color") > 0; })
    ] },
    "7.10": { name: "Display (Block vs Inline)", rules: [
      r("Uses the display property", function (c) { return c.prop("display") > 0; }),
      r("Uses display: inline-block on something that is normally a block", function (c) { return c.inline.some(function (d) { return d.prop === "display" && /inline-block/.test(d.value) && ["p", "div", "h1", "h2", "h3", "li"].indexOf(d.el.tag) > -1; }); }),
      r("Uses display: block on something that is normally inline (span, a, or strong)", function (c) { return c.inline.some(function (d) { return d.prop === "display" && /^block/.test(d.value) && ["span", "a", "strong", "em", "img"].indexOf(d.el.tag) > -1; }); })
    ] },
    "7.11": { name: "Div Tag", rules: [
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
    "7.12": { name: "Tables", rules: [
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
  // Unit test = the whole site, everything from 7.1 through 7.12.
  LESSONS["7.13"] = { name: "Unit Test Website (all tags)", rules: [] };
  var ORDER = ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11", "7.12", "7.13"];

  var TOTAL_POINTS = 50;      // points a lesson is worth
  var CARRY_WEIGHT = 0.4;     // rules from earlier lessons count this much as new ones

  function rulesFor(lesson) {
    // Every lesson is its own project. Only the "base" rules (the basics: DOCTYPE, skeleton, title,
    // one h1, tags closed correctly) carry into later lessons. The unit test (7.13) uses everything.
    var idx = ORDER.indexOf(lesson), out = [];
    if (idx < 0) return out;
    ORDER.forEach(function (l, i) {
      if (i > idx) return;
      var isNew = (i === idx) || lesson === "7.13";
      (LESSONS[l].rules || []).forEach(function (rule, j) {
        if (rule.only && l !== lesson) return;
        if (!isNew && !rule.base) return;
        out.push({ id: l + "-" + j, lesson: l, label: rule.label, tip: rule.tip, test: rule.test, isNew: isNew });
      });
    });
    return out;
  }

  function check(lesson, src) {
    var c = analyze(src), rules = rulesFor(lesson), results = [];
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
  var API = { quality: function (src) { return quality(analyze(String(src || ""))); }, analyze: analyze, check: check, openTags: openTags, previewDoc: previewDoc, VOID: VOID, LESSONS: LESSONS, ORDER: ORDER, TOTAL_POINTS: TOTAL_POINTS };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.HTMLCheck = API;
})(typeof window !== "undefined" ? window : globalThis);
