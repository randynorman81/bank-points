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
      r("Uses only the tags from this lesson: html, head, title, body, headings (h1 to h6), and p", function (c) {
        var ok = { html: 1, head: 1, title: 1, body: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1 }; return Object.keys(c.tags).length > 0 && Object.keys(c.tags).every(function (t) { return ok[t]; });
      }, "Save the other tags for later lessons.", true),
      r("Every tag is closed and nested correctly", function (c) { return c.errors.length === 0 && c.has("html"); }, "See the Problems list for exactly which line to fix.", false, true)
    ] },
    "7.2": { name: "Creation Tags + Inline Styling", rules: [
      r("Uses at least 2 different heading levels (h1, h2, h3...)", function (c) { var n = 0; ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(function (h) { if (c.has(h)) n++; }); return n >= 2; }),
      r("Has at least 3 <p> paragraphs", function (c) { return c.count("p") >= 3; }),
      r("Uses the style attribute with color", function (c) { return c.inline.some(function (d) { return d.prop === "color"; }); }),
      r("Uses font-size in pixels (like 24px)", function (c) { return anyValue(c, "font-size", function (v) { return /^\d+(\.\d+)?px$/i.test(v); }); }),
      r("Uses text-align or text-transform", function (c) { return c.prop("text-align") + c.prop("text-transform") > 0; }),
      r("Style attributes are written correctly (colons, semicolons, valid properties)", function (c) { return c.errors.filter(function (e) { return /On <|semicolon|colon|property we know/.test(e.msg); }).length === 0; }, "Format: style=\"property: value;\"")
    ] },
    "7.3": { name: "Editing Tags + Span + Font Families", rules: [
      r("Uses <strong> and <em>", function (c) { return c.has("strong") && c.has("em"); }),
      r("Uses <br> at least once (and never closes it)", function (c) { return c.has("br"); }),
      r("Uses <hr> at least once", function (c) { return c.has("hr"); }),
      r("Editing tags (strong/em) are inside a creation tag like <p> or <h1>", function (c) {
        var e = c.all("strong").concat(c.all("em")); return e.length > 0 && e.every(function (n) { return !!c.ancestor(n, ["p", "h1", "h2", "h3", "h4", "h5", "h6", "li"]); });
      }),
      r("Uses a <span> with a style attribute", function (c) { return c.all("span").some(function (s) { return s.attrs.style !== undefined; }); }),
      r("Uses font-family with serif, sans-serif, or monospace", function (c) { return anyValue(c, "font-family", function (v) { return /(^|[\s,'"])(serif|sans-serif|monospace)\s*$/i.test(v.replace(/;$/, "")); }); })
    ] },
    "7.4": { name: "More Useful Styling Properties", rules: [
      r("Uses background-color", function (c) { return c.prop("background-color") > 0; }),
      r("Uses the border shortcut: thickness, style, color (like 2px solid black)", function (c) { return anyValue(c, "border", function (v) { return /^\d+px\s+(solid|dashed|dotted|double|groove|ridge)\s+\S+/i.test(v); }); }),
      r("Styles an <hr> with a border", function (c) { return c.all("hr").some(function (h) { return c.inline.some(function (d) { return d.el === h && d.prop === "border"; }); }); })
    ] },
    "7.5": { name: "Lists", rules: [
      r("Has a <ul> or <ol> list with at least 3 <li> items", function (c) { return c.all("ul").concat(c.all("ol")).some(function (l) { return l.children.filter(function (n) { return n.tag === "li"; }).length >= 3; }); }),
      r("Only <li> tags sit directly inside the list", function (c) { var l = c.all("ul").concat(c.all("ol")); return l.length > 0 && l.every(function (x) { return x.children.every(function (n) { return n.tag === "li"; }); }); }),
      r("Uses list-style-type on the <ul> or <ol> (not on the li)", function (c) { return c.inline.some(function (d) { return d.prop === "list-style-type" && (d.el.tag === "ul" || d.el.tag === "ol"); }); })
    ] },
    "7.6": { name: "Links", rules: [
      r("Has an <a> link with an href that starts with https://", function (c) { return c.all("a").some(function (a) { return /^https:\/\//i.test(a.attrs.href || ""); }); }),
      r("A link opens in a new tab with target=\"_blank\"", function (c) { return c.all("a").some(function (a) { return a.attrs.target === "_blank"; }); }),
      r("Has an internal <style> block inside <head>", function (c) { return c.all("style").some(function (s) { return !!c.ancestor(s, ["head"]); }); }),
      r("Styles a:hover with a color", function (c) { return c.selector("a:hover").some(function (rl) { return rl.decls.some(function (d) { return d.prop === "color"; }); }); }),
      r("Link states are in LVHA order (link, visited, hover, active)", function (c) {
        var order = ["a:link", "a:visited", "a:hover", "a:active"], pos = [];
        c.sheetRules.forEach(function (rl, i) { var k = order.indexOf(rl.selector.toLowerCase()); if (k > -1) pos.push(k); });
        if (pos.length < 2) return false; for (var i = 1; i < pos.length; i++) if (pos[i] < pos[i - 1]) return false; return true;
      }, "Love, Visit, Hate, Always: :link, :visited, :hover, :active")
    ] },
    "7.7": { name: "Images", rules: [
      r("Has an <img> with a src", function (c) { return c.all("img").some(function (i) { return (i.attrs.src || "").length > 0; }); }),
      r("The image has an alt description", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { return (i.attrs.alt || "").trim().length > 0; }); }),
      r("The image src is a web address (uploaded here or hosted online), not a file on your computer", function (c) { var im = c.all("img"); return im.length > 0 && im.every(function (i) { return /^(https?:)?\/\//i.test(i.attrs.src || "") || /^\/api\/code\?img=/.test(i.attrs.src || ""); }); }),
      r("Sets width OR height, but not both (keeps the aspect ratio)", function (c) {
        var im = c.all("img"); if (!im.length) return false;
        return im.every(function (i) {
          var st = {}; (i.attrs.style || "").split(";").forEach(function (p) { var k = p.split(":"); if (k[1]) st[k[0].trim().toLowerCase()] = k[1].trim(); });
          var w = i.attrs.width !== undefined || st.width !== undefined, h = i.attrs.height !== undefined || (st.height !== undefined && st.height !== "auto");
          return !(w && h);
        });
      }, "Choose one: the browser calculates the other."),
      r("Uses border-radius on something", function (c) { return c.prop("border-radius") > 0; })
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
  var API = { analyze: analyze, check: check, openTags: openTags, previewDoc: previewDoc, VOID: VOID, LESSONS: LESSONS, ORDER: ORDER, TOTAL_POINTS: TOTAL_POINTS };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.HTMLCheck = API;
})(typeof window !== "undefined" ? window : globalThis);
