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
    { id: "6.1", tags: [I("doctype", "<!DOCTYPE html>", "once"), I("html", "<html>", "once"), I("head", "<head>", "once"), I("title", "<title>", "once"), I("body", "<body>", "once"), I("h1", "<h1>", "once"), I("h2", "<h2>"), I("p", "<p>")] },
    { id: "6.2",
      attrs: [I("attr-style", "style", "until:7.6")],
      props: [I("p-color", "color"), I("p-bg", "background-color")],
      vals: [I("v-named", "colors: named (like tomato) or hex (like #FF6347)")] },
    { id: "6.20",
      tags: [I("h3", "<h3>")],
      props: [I("p-fs", "font-size"), I("p-ta", "text-align"), I("p-tt", "text-transform")],
      vals: [I("v-px", "font-size in px"), I("v-center", "text-align: center"), I("v-upper", "text-transform: uppercase")] },
    { id: "6.3",
      tags: [I("strong", "<strong> or <b>"), I("em", "<em> or <i>"), I("br", "<br>"), I("hr", "<hr>"), I("span", "<span>")] },
    { id: "6.35",
      tags: [I("link", "<link> in the head", "once")],
      attrs: [I("attr-gfont", "a Google Fonts link (href)", "once")],
      props: [I("p-ff", "font-family")],
      vals: [I("v-fallback", "a fallback family (serif, sans-serif, monospace, cursive)")] },
    { id: "6.4",
      props: [I("p-border", "border"), I("p-bside", "border-top, -bottom, -left, or -right")],
      vals: [I("v-solid", "border style: solid"), I("v-dashed", "border style: dashed"), I("v-dotted", "border style: dotted")] },
    { id: "6.7",
      tags: [I("img", "<img>")],
      attrs: [I("attr-src", "src"), I("attr-alt", "alt"), I("attr-imgsize", "width on an image"), I("attr-favicon", "a favicon link (rel=icon) in the head", "once")],
      props: [I("p-w", "width")],
      vals: [I("v-pct", "width in %")] },
    { id: "6.75",
      chars: [I("ch-emoji", "an emoji pasted into your text", "until:6.75"), I("ch-symbol", "a symbol pasted into your text (© ♥ ★ →)", "until:6.75")] },
    { id: "6.6",
      tags: [I("a", "<a>")],
      attrs: [I("attr-href", "href"), I("attr-newtab", "target=\"_blank\" (new tab)"), I("attr-sametab", "links in the same tab"), I("a-wrap", "a link around a heading, a paragraph, or words"), I("attr-imglink", "image inside a link (a clickable image)")] },
    { id: "6.5",
      tags: [I("ul", "<ul>"), I("ol", "<ol>"), I("li", "<li>")],
      props: [I("p-lst", "list-style-type"), I("p-disp", "display")],
      vals: [I("v-inline", "display: inline"), I("v-lstnone", "list-style-type: none")] },
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
  var FULL = ["6.1", "6.2", "6.20", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6", "6.5", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "9.1", "9.2", "9.3", "9.4", "9.5", "9.6", "9.7"];
  function num(id) { var i = FULL.indexOf(String(id)); return i < 0 ? 1000 : i; }
  function before(a, b) { return num(a) < num(b); }
  var GROUPS = [["tags", "HTML tags"], ["attrs", "Attributes"], ["props", "CSS properties"], ["vals", "CSS values"], ["sels", "Selectors and classes"], ["chars", "Emojis and symbols"]];

  /* THE REVIEW POLICY (a spiral, so assignments do not keep getting longer):
       - FRESH:  items from the previous 2 lessons must appear at least 2 times
       - KEEP:   every older item must appear at least 1 time (so each new assignment circles back to every earlier tag and attribute)
       - STAPLES: the basics every real page uses (headings, paragraphs, lists, links, pictures, colors, fonts, borders, spacing,
                  width) stay required at least once in every later lesson
       - anything older than that drops off the list (students will still use it, it just is not checked)
       - UNIT TESTS (7.6, 8.7, 9.7): every item from that unit plus the staples, at least once each */
  var FRESH = 2, KEEP = 30;   /* KEEP 30 = through the Unit 3 lessons (3.2 to 3.8), every earlier item stays required at least once; later lessons keep the older rule of 3 lessons back */
  var STAPLES = { "h2": 1, "p": 1, "ul": 1, "ol": 1, "a": 1, "attr-href": 1, "img": 1, "attr-alt": 1, "p-color": 1, "p-bg": 1, "p-fs": 1, "p-ta": 1, "p-border": 1, "p-pad": 1, "p-mar": 1, "p-w": 1 };
  var TESTS_UNIT = { "7.6": /^[67]\./, "8.7": /^8\./, "9.7": /^9\./ };
  /* the two extra 3.3 practice assignments review exactly what 3.3 reviews (they are not separate steps in the spiral) */
  var ALIAS = { "6.21": "6.20", "6.22": "6.20", "6.23": "6.20" };
  function idxOf(id) { for (var i = 0; i < C.length; i++) if (C[i].id === id) return i; return -1; }
  function tierFor(lesson, fromId, key) {
    var test = TESTS_UNIT[lesson];
    if (test) return test.test(fromId) ? { tier: "test", min: 1 } : (STAPLES[key] ? { tier: "keep", min: 1 } : null);
    var li = idxOf(lesson), fi = idxOf(fromId); if (li < 0 || fi < 0 || fi >= li) return null;
    var age = li - fi; if (lesson !== "6.75" && fi < idxOf("6.75") && li > idxOf("6.75")) age--;   /* 3.8 does not count as a lesson back for the lessons after it, so their review rules stay as they were */
    if (age <= FRESH) return { tier: "fresh", min: 2 };
    if (age <= FRESH + (li <= idxOf("6.5") ? KEEP : 3)) return { tier: "keep", min: 1 };
    return STAPLES[key] ? { tier: "keep", min: 1 } : null;
  }
  root.U7_CONCEPTS = {
    list: C, groups: GROUPS, FRESH: FRESH, KEEP: KEEP,
    /* the items a lesson adds (the "new" section), grouped */
    newFor: function (lesson) { lesson = ALIAS[lesson] || lesson; var o = null; C.forEach(function (x) { if (x.id === lesson) o = x; }); return o; },
    /* every earlier item still required for this lesson, grouped; each item has .min (1 or 2) and .tier (fresh, keep, test) */
    reviewFor: function (lesson) {
      lesson = ALIAS[lesson] || lesson;
      var out = {}; GROUPS.forEach(function (g) { out[g[0]] = []; });
      C.forEach(function (x) {
        GROUPS.forEach(function (g) {
          (x[g[0]] || []).forEach(function (it) {
            var t = tierFor(lesson, x.id, it.key); if (!t) return;
            if (it.until && num(lesson) > num(it.until)) return;
            out[g[0]].push({ key: it.key, label: it.label, once: it.once, from: x.id, min: t.min, tier: t.tier });
          });
        });
      });
      return out;
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
