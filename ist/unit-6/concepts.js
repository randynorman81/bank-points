/* The concept list for the IST Web Editor (units 3, 4 and 5). ONE source of truth:
   - the "Concepts" popup shows NEW items (top) and REVIEW items (bottom) for the open lesson
   - html-check.js turns every earlier item into an automatic rule: "use it at least twice"
   - the assignment steps (answers-*.js) use it for the "Make it a real website" step

   Each lesson has groups: tags, attrs (attributes), props (CSS properties), vals (CSS values), sels (selectors and classes).
   An item is [key, label, flags]  (key = the test in html-check.js; flags: "once" = appears once per page so it is listed but
   never counted twice; "until:7.6" = no longer reviewed after that lesson, because later lessons move that job elsewhere). */
(function (root) {
  function I(key, label, flags) { return { key: key, label: label, once: /\bonce\b/.test(flags || ""), until: ((flags || "").match(/until:([\d.]+)/) || [])[1] || "" }; }
  var C = [
    { id: "6.1", tags: [I("doctype", "<!DOCTYPE html>", "once"), I("html", "<html>", "once"), I("head", "<head>", "once"), I("title", "<title>", "once"), I("body", "<body>", "once"), I("h1", "<h1>", "once"), I("h2", "<h2>"), I("h3", "<h3>"), I("p", "<p>")] },
    { id: "6.2",
      attrs: [I("attr-style", "style", "until:7.6")],
      props: [I("p-color", "color"), I("p-bg", "background-color"), I("p-fs", "font-size"), I("p-ta", "text-align"), I("p-tt", "text-transform"), I("p-border", "border")],
      vals: [I("v-px", "font-size in px"), I("v-center", "text-align: center"), I("v-upper", "text-transform: uppercase"), I("v-named", "named colors (like tomato)")] },
    { id: "6.3",
      tags: [I("strong", "<strong> or <b>"), I("em", "<em> or <i>"), I("br", "<br>"), I("hr", "<hr>"), I("span", "<span>")],
      props: [I("p-ff", "font-family")],
      vals: [I("v-serif", "font-family: serif"), I("v-sans", "font-family: sans-serif"), I("v-mono", "font-family: monospace")] },
    { id: "6.4",
      props: [I("p-bside", "border-top, -bottom, -left, or -right")],
      vals: [I("v-solid", "border style: solid"), I("v-dashed", "border style: dashed"), I("v-dotted", "border style: dotted")] },
    { id: "6.5",
      tags: [I("ul", "<ul>"), I("ol", "<ol>"), I("li", "<li>")],
      props: [I("p-lst", "list-style-type"), I("p-disp", "display")],
      vals: [I("v-inline", "display: inline"), I("v-lstnone", "list-style-type: none")] },
    { id: "6.6",
      tags: [I("a", "<a>")],
      attrs: [I("attr-href", "href"), I("attr-newtab", "target=\"_blank\" (new tab)"), I("attr-sametab", "links in the same tab")],
      sels: [I("s-linkstates", "a:link, a:visited, a:hover, a:active", "once"), I("s-styleblock", "<style> block in the head", "once until:7.6")] },
    { id: "6.7",
      tags: [I("img", "<img>")],
      attrs: [I("attr-src", "src"), I("attr-alt", "alt"), I("attr-imgsize", "width or height on an image"), I("attr-imglink", "image inside a link")],
      props: [I("p-w", "width"), I("p-radius", "border-radius")],
      vals: [I("v-pct", "width in %"), I("v-block", "display: block")] },
    { id: "7.1",
      props: [I("p-pad", "padding"), I("p-mar", "margin")] },
    { id: "7.2",
      vals: [I("v-hex", "hex colors (like #FF6347)")] },
    { id: "7.3",
      vals: [I("v-ib", "display: inline-block")] },
    { id: "7.4",
      tags: [I("div", "<div>")],
      props: [I("p-va", "vertical-align")],
      vals: [I("v-top", "vertical-align: top")] },
    { id: "7.5",
      tags: [I("table", "<table>"), I("tr", "<tr>"), I("th", "<th>"), I("td", "<td>")] },
    { id: "8.1",
      tags: [I("linktag", "<link> (connects style.css)", "once")],
      attrs: [I("attr-class", "class")],
      sels: [I("s-tag", "tag selectors (p { })"), I("s-class", ".class selectors")] },
    { id: "8.2",
      attrs: [I("attr-id", "id")],
      sels: [I("s-id", "#id selectors")] },
    { id: "8.3",
      attrs: [I("attr-twoclass", "two classes on one element")],
      sels: [I("s-combo", "combined selectors (p.note, ul li)")] },
    { id: "8.4",
      props: [I("p-trans", "transition")],
      sels: [I("s-hover", ":hover rules")] },
    { id: "8.5",
      props: [I("p-flex", "display: flex"), I("p-jc", "justify-content"), I("p-ai", "align-items")] },
    { id: "8.6",
      props: [I("p-grid", "display: grid"), I("p-gtc", "grid-template-columns"), I("p-gap", "gap")] },
    { id: "9.1", sels: [I("b-link", "Bootstrap link in the head", "once")] },
    { id: "9.2", sels: [I("b-grid", "container, row, and col classes")] },
    { id: "9.3", sels: [I("b-util", "Bootstrap text, color, and bold classes"), I("b-btn", "btn button classes")] },
    { id: "9.4", sels: [I("b-nav", "navbar, navbar-brand, and nav-link")] },
    { id: "9.5", sels: [I("b-card", "card, card-body, card-title, and card-text")] },
    { id: "9.6", tags: [I("form", "<form>")], sels: [I("b-form", "form-label and form-control")] }
  ];
  var ORDER = C.map(function (x) { return x.id; });
  function num(id) { var p = String(id).split("."); return (+p[0]) * 100 + (+p[1]); }
  function before(a, b) { return num(a) < num(b); }
  var GROUPS = [["tags", "HTML tags"], ["attrs", "Attributes"], ["props", "CSS properties"], ["vals", "CSS values"], ["sels", "Selectors and classes"]];
  root.U7_CONCEPTS = {
    list: C,
    groups: GROUPS,
    /* the items a lesson adds (the "new" section), grouped */
    newFor: function (lesson) { var o = null; C.forEach(function (x) { if (x.id === lesson) o = x; }); return o; },
    /* every earlier item still in play for this lesson (the "review" section), grouped, in lesson order */
    reviewFor: function (lesson) {
      var out = {}; GROUPS.forEach(function (g) { out[g[0]] = []; });
      C.forEach(function (x) {
        if (!before(x.id, lesson)) return;
        GROUPS.forEach(function (g) { (x[g[0]] || []).forEach(function (it) { if (it.until && !before(lesson, it.until) && lesson !== it.until) return; out[g[0]].push({ key: it.key, label: it.label, once: it.once, from: x.id }); }); });
      });
      return out;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
