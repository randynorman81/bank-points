/* IST Web Lab: a STRICT HTML + inline-CSS model for the Unit 3 walkthroughs and assignments.
   Pure JavaScript: runs in the lab page, in the grading function and in Node. It is the JavaScript twin of tools/ist/html_model.py and both are checked against a real browser
   (tools/ist/chrome_check.mjs). Strict on purpose: every tag closed and matching, attribute values in quotes, a well-formed style attribute. */
(function (root) {
  "use strict";
  var VOID = { br: 1, hr: 1, img: 1, link: 1, meta: 1, input: 1 };
  var BLOCK = { html: 1, body: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, div: 1, ul: 1, ol: 1, li: 1, hr: 1, table: 1, tr: 1 };
  var KNOWN = { html: 1, head: 1, title: 1, body: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, strong: 1, b: 1, em: 1, i: 1, br: 1, hr: 1, span: 1, link: 1, img: 1, a: 1, ul: 1, ol: 1, li: 1, meta: 1, div: 1 };
  var INHERITED = { "color": 1, "font-size": 1, "font-family": 1, "text-align": 1, "text-transform": 1, "list-style-type": 1, "font-weight": 1, "font-style": 1 };
  var HEADINGS = { h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 };
  var BSTYLES = ["solid", "dashed", "dotted", "double", "groove", "ridge", "none"];
  var NAMED = {}; ("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat whitesmoke yellow yellowgreen").split(" ").forEach(function (n) { NAMED[n] = 1; });
  function HtmlError(msg) { this.message = msg; } HtmlError.prototype = Object.create(Error.prototype);

  /* ---------------- parser ---------------- */
  var TAG = /<(\/?)([A-Za-z][A-Za-z0-9]*)((?:\s+[A-Za-z_:][-A-Za-z0-9_:.]*(?:\s*=\s*(?:"[^"<]*"|'[^'<]*'))?)*)\s*(\/?)>/y;
  var ATTR = /\s+([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*(?:"([^"<]*)"|'([^'<]*)'))?/g;
  function Node(tag, attrs, line, parent) { this.tag = tag; this.attrs = attrs || {}; this.children = []; this.line = line || 0; this.parent = parent || null; this.endline = line || 0; this.text = ""; }
  function parse(src, partial) {
    src = String(src); var rootN = new Node("#root"), stack = [rootN], i = 0, n = src.length, doctype = false;
    function ln(upto) { var c = 0, k = -1; while ((k = src.indexOf("\n", k + 1)) >= 0 && k < upto) c++; return c; }
    while (i < n) {
      if (src.charAt(i) === "<") {
        if (src.substr(i, 4) === "<!--") { var e = src.indexOf("-->", i); if (e < 0) throw new HtmlError("A comment is never closed."); var c = new Node("#comment", null, ln(i), stack[stack.length - 1]); c.text = src.slice(i + 4, e); stack[stack.length - 1].children.push(c); i = e + 3; continue; }
        if (src.substr(i, 9).toUpperCase() === "<!DOCTYPE") {
          var dm = /^<!DOCTYPE\s+html\s*>/i.exec(src.slice(i)); if (!dm) throw new HtmlError("The DOCTYPE line is not exactly <!DOCTYPE html>.");
          if (stack.length !== 1 || rootN.children.length) throw new HtmlError("The DOCTYPE has to be the very first line."); doctype = true; i += dm[0].length; continue;
        }
        TAG.lastIndex = i; var m = TAG.exec(src);
        if (!m) throw new HtmlError("There is a broken tag near: " + src.slice(i, i + 24).split("\n")[0]);
        var closing = m[1], name = m[2].toLowerCase(), attrs = m[3], selfc = m[4];
        if (!KNOWN[name]) throw new HtmlError("<" + name + "> is not a tag you have learned (check the spelling).");
        var L = ln(i); i += m[0].length;
        if (closing) {
          if (attrs.trim()) throw new HtmlError("A closing tag cannot have anything inside it (no style in </" + name + ">).");
          if (VOID[name]) throw new HtmlError("<" + name + "> stands alone, so it has no closing tag.");
          if (stack.length < 2 || stack[stack.length - 1].tag !== name) throw new HtmlError("</" + name + "> does not match the tag that is open" + (stack.length > 1 ? " (<" + stack[stack.length - 1].tag + ">)." : "."));
          stack[stack.length - 1].endline = L; stack.pop(); continue;
        }
        var d = {}, am; ATTR.lastIndex = 0;
        while ((am = ATTR.exec(attrs))) { var k2 = am[1].toLowerCase(); if (k2 in d) throw new HtmlError("The attribute " + k2 + " is written twice."); d[k2] = am[2] !== undefined ? am[2] : (am[3] !== undefined ? am[3] : ""); }
        var nd = new Node(name, d, L, stack[stack.length - 1]); stack[stack.length - 1].children.push(nd);
        if (VOID[name]) continue;
        if (selfc) throw new HtmlError("Self-closing tags are not used in this course.");
        stack.push(nd);
      } else {
        var j = src.indexOf("<", i); if (j < 0) j = n; var t = src.slice(i, j);
        if (t) { var x = new Node("#text", null, ln(i + t.length - t.replace(/^\s+/, "").length), stack[stack.length - 1]); x.text = t; stack[stack.length - 1].children.push(x); }
        i = j;
      }
    }
    if (stack.length !== 1 && !partial) throw new HtmlError("<" + stack[stack.length - 1].tag + "> is never closed.");
    rootN.doctype = doctype; return rootN;
  }
  function walk(nd, out) { out = out || []; out.push(nd); nd.children.forEach(function (c) { walk(c, out); }); return out; }
  function elements(rootN) { return walk(rootN).filter(function (n) { return n.tag.charAt(0) !== "#"; }); }

  /* ---------------- inline CSS ---------------- */
  function okColor(v) { v = v.toLowerCase(); return !!NAMED[v] || /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v); }
  function okLen(v) { return /^(?:\d+(?:\.\d+)?(?:px|%|em|rem)|0)$/.test(v); }
  function okDecl(p, v) {
    v = v.trim();
    if (p === "color" || p === "background-color") return okColor(v);
    if (p === "font-size") return /^\d+(?:\.\d+)?(?:px|em|rem|%|pt)$/.test(v) || ["small", "medium", "large", "x-large", "xx-large", "smaller", "larger"].indexOf(v) >= 0;
    if (p === "text-align") return ["left", "center", "right", "justify"].indexOf(v) >= 0;
    if (p === "text-transform") return ["none", "uppercase", "lowercase", "capitalize"].indexOf(v) >= 0;
    if (p === "font-family") { if (!v || /,\s*$/.test(v)) return false; var one = "(?:\"[^\"]+\"|'[^']+'|[A-Za-z][A-Za-z0-9 \\-]*)"; return new RegExp("^" + one + "(?:\\s*,\\s*" + one + ")*$").test(v); }
    if (p === "font-weight") return ["normal", "bold", "bolder", "lighter"].indexOf(v) >= 0 || /^[1-9]00$/.test(v);
    if (p === "font-style") return ["normal", "italic", "oblique"].indexOf(v) >= 0;
    if (p === "text-decoration") return ["none", "underline", "line-through", "overline"].indexOf(v) >= 0;
    if (p === "width" || p === "height") return okLen(v) || v === "auto";
    if (p === "display") return ["block", "inline", "inline-block", "none"].indexOf(v) >= 0;
    if (p === "list-style-type") return ["disc", "circle", "square", "decimal", "none", "lower-alpha", "upper-alpha", "lower-roman", "upper-roman"].indexOf(v) >= 0;
    if (p === "border" || /^border-(top|bottom|left|right)$/.test(p)) {
      var parts = v.split(/\s+/); if (parts.length < 1 || parts.length > 3) return false;
      var w = parts.filter(function (x) { return /^\d+(?:\.\d+)?px$/.test(x); }), s = parts.filter(function (x) { return BSTYLES.indexOf(x) >= 0; }), c = parts.filter(function (x) { return okColor(x) && BSTYLES.indexOf(x) < 0; });
      return w.length + s.length + c.length === parts.length && w.length <= 1 && s.length <= 1 && c.length <= 1;
    }
    if (p === "border-style") return BSTYLES.indexOf(v) >= 0;
    if (p === "border-width") return okLen(v);
    if (p === "border-color") return okColor(v);
    if (p === "border-radius") return okLen(v);
    if (p === "padding" || p === "margin" || /^(padding|margin)-(top|bottom|left|right)$/.test(p)) { var xs = v.split(/\s+/); return xs.length >= 1 && xs.length <= 4 && xs.every(function (x) { return okLen(x) || x === "auto"; }); }
    return false;
  }
  function parseStyle(s) {
    var good = [], bad = 0; String(s || "").split(";").filter(function (x) { return x.trim(); }).forEach(function (d) {
      if (d.indexOf(":") < 0) { bad++; return; }
      var k = d.indexOf(":"), p = d.slice(0, k).trim().toLowerCase(), v = d.slice(k + 1).split(/\s+/).filter(Boolean).join(" ");
      if (okDecl(p, v)) good.push([p, p === "font-family" ? v : v.toLowerCase()]); else bad++;
    });
    return { good: good, bad: bad };
  }
  function authored(nd) { var d = {}; if (nd.tag.charAt(0) === "#") return d; parseStyle(nd.attrs.style).good.forEach(function (g) { d[g[0]] = g[1]; }); return d; }
  function own(nd, p) { var a = authored(nd); return a.hasOwnProperty(p) ? a[p] : null; }
  function effective(nd, p) {
    var x = nd;
    while (x && x.tag !== "#root") {
      var a = authored(x); if (a.hasOwnProperty(p)) return a[p];
      if (!INHERITED[p]) return null;
      if (p === "font-size" && HEADINGS[x.tag]) return null;
      if (p === "color" && (x.tag === "hr" || (x.tag === "a" && "href" in x.attrs))) return null;
      x = x.parent;
    }
    return null;
  }
  function transform(t, mode) { if (mode === "uppercase") return t.toUpperCase(); if (mode === "lowercase") return t.toLowerCase(); if (mode === "capitalize") return t.replace(/(^|\s)(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }); return t; }
  function shownText(nt) { return transform(nt.text.replace(/\s+/g, " "), effective(nt.parent, "text-transform")); }
  function pageLines(rootN) {
    var out = [], cur = [];
    function flush() { var s = cur.join("").split(/\s+/).filter(Boolean).join(" "); if (s) out.push(s); cur = []; }
    function rec(nd) {
      if (nd.tag === "#text") { cur.push(shownText(nd)); return; }
      if (nd.tag === "#comment" || nd.tag === "head" || nd.tag === "link" || nd.tag === "img") return;
      if (nd.tag === "br" || nd.tag === "hr") { flush(); return; }
      var blk = BLOCK[nd.tag] && ["inline", "inline-block"].indexOf(own(nd, "display")) < 0;
      if (blk) flush(); nd.children.forEach(rec); if (blk) flush();
    }
    rootN.children.forEach(rec); flush(); return out;
  }

  /* ---------------- "the same page": a signature of tags, attributes, accepted declarations and text ---------------- */
  var KEEP_ATTR = ["href", "src", "alt", "target", "rel", "width", "type", "class", "id", "name", "content", "charset"];
  function keepWs(nd, i) {
    var sibs = nd.parent ? nd.parent.children : [];
    if (nd.tag !== "#text" || nd.text.trim()) return true;
    var prev = i > 0 ? sibs[i - 1] : null, nxt = i + 1 < sibs.length ? sibs[i + 1] : null;
    for (var q = 0; q < 2; q++) { var x = q ? nxt : prev; if (!x) return false; if (BLOCK[x.tag] || ["head", "body", "html", "title", "link", "li", "br", "hr", "#comment"].indexOf(x.tag) >= 0) return false; }
    return true;
  }
  function sigOf(nd, opts) {
    opts = opts || {};
    if (nd.tag === "#text") { var t = nd.text.trim() ? nd.text.split(/\s+/).filter(Boolean).join(" ") : " "; return JSON.stringify(["t", opts.ci ? t.toLowerCase() : t]); }
    var a = authored(nd), ds = Object.keys(a).sort().map(function (k) { return [k, a[k]]; }), ka = KEEP_ATTR.filter(function (k) { return k in nd.attrs; }).sort().map(function (k) { return [k, nd.attrs[k]]; });
    var kids = nd.children.filter(function (c, i) { return c.tag !== "#comment" && keepWs(c, i); }).map(function (c) { return sigOf(c, opts); });
    if (opts.anyText) kids = kids.filter(function (k) { return k.indexOf('["t"') !== 0; });
    return JSON.stringify([nd.tag, ds, ka, kids]);
  }
  function parseFragment(html) { return parse(html); }

  root.IST_LAB_CORE = { parse: parse, walk: walk, elements: elements, authored: authored, own: own, effective: effective, pageLines: pageLines, parseStyle: parseStyle, okDecl: okDecl, sigOf: sigOf, HtmlError: HtmlError, NAMED: NAMED, shownText: shownText, BLOCK: BLOCK, parseFragment: parseFragment };
  if (typeof module !== "undefined" && module.exports) module.exports = root.IST_LAB_CORE;
})(typeof window !== "undefined" ? window : globalThis);
