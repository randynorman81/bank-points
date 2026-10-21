/* Step checks for lesson 6.1 (3.1); the later Unit 3 lessons are in step-checks-b.js (see step-checks.js for how these are used). One list of checks per step bullet, in order. */
(function (root) {
  "use strict";
  var SC = root.U7_STEPCHECKS, h = SC.H;
  var K = h.K, P = h.P, PX = h.PX, EACH = h.EACH, CNT = h.CNT, IN = h.IN, UNDER = h.UNDER, T = h.T, HW = h.HW, LAST = h.LAST, AFTER = h.AFTER, ALL = h.ALL, FOLLOW = h.FOLLOW, exists = h.exists;
  var SK = h.SKELETON, TITLE = h.TITLE, has = h.has, kids = h.kids, txt = h.txt, words = h.words, within = h.within, BOLD = h.BOLD, ITAL = h.ITAL;

  /* ---------------- 6.1  the plain, text-heavy page ---------------- */
  function sections(c) { /* [{h2, ps}] : the paragraphs under each heading 2, up to the next heading 1 or 2 */
    var out = [], cur = null;
    (c.all("body")[0] ? kids(c.all("body")[0]) : []).forEach(function (n) {
      if (n.tag === "h2") { cur = { h2: n, ps: [] }; out.push(cur); } else if (n.tag === "h1") cur = null; else if (n.tag === "p" && cur) cur.ps.push(n);
    });
    return out;
  }
  function allText(c) { var b = c.all("body")[0]; return b ? txt(c, b) : ""; }
  /* one box per pair of tags: the opening tag, the closing tag, and (for head and body) that they sit inside the html tags */
  function tagSet(tag, insideHtml) {
    var list = [
      K("There is an opening <" + tag + "> tag", function (c) { return new RegExp("<" + tag + "\\b[^>]*>", "i").test(c.rawSrc || c.src); }),
      K("There is a closing </" + tag + "> tag", function (c) { return new RegExp("</" + tag + "\\s*>", "i").test(c.rawSrc || c.src); })
    ];
    if (insideHtml) list.push(K("The " + tag + " tags are inside the html tags", function (c) { var e = c.all(tag)[0]; return !!e && h.inTag(c, e, ["html"]); }));
    else list.push(K("The closing </html> comes after the opening <html>", function (c) { var s = c.rawSrc || c.src, a = s.search(/<html\b/i), b = s.search(/<\/html\s*>/i); return a >= 0 && b > a; }));
    return list;
  }
  SC.LESSONS["6.1"] = { inlineOnly: false, steps: {
    "Step 1": [
      [SK[0]],
      tagSet("html", false),
      tagSet("head", true),
      tagSet("body", true).concat([K("The body comes after (under) the head", function (c) { var s = c.rawSrc || c.src, he = s.search(/<\/head\s*>/i), bs = s.search(/<body\b/i); return he >= 0 && bs > he; })]),
      TITLE
    ],
    "Step 2": [[
      K("There is one heading 1", function (c) { return c.count("h1") === 1; }),
      K("The heading 1 is inside the body", function (c) { var e = c.all("h1")[0]; return !!e && h.inTag(c, e, ["body"]); }),
      K("The heading 1 has words in it", function (c) { var e = c.all("h1")[0]; return !!e && words(c, e) >= 1; })
    ]],
    "Step 3": [
      [CNT("There are at least 3 heading 2s", "h2", 3), UNDER("The heading 2s come after the heading 1", T("h1"), T("h2"))],
      [K("Only heading 1 and heading 2 are used (no heading 3 or smaller)", function (c) { return c.count("h1") >= 1 && c.count("h2") >= 1 && ["h3", "h4", "h5", "h6"].every(function (t) { return c.count(t) === 0; }); })]
    ],
    "Step 4": [
      [K("Every heading 2 has 2 paragraphs under it", function (c) { var s = sections(c); return s.length >= 3 && s.every(function (x) { return x.ps.length >= 2; }); }),
       K("No paragraph is inside a heading", function (c) { return c.all("p").every(function (p) { return !h.inTag(c, p, ["h1", "h2", "h3", "h4", "h5", "h6"]); }) && c.count("p") > 0; })],
      [CNT("At least 6 paragraphs", "p", 6), K("At least 5 paragraphs are 25 words or longer", function (c) { return c.all("p").filter(function (p) { return words(c, p) >= 25; }).length >= 5; })],
      [K("The page has at least 250 words", function (c) { return (allText(c).match(/\S+/g) || []).length >= 250; })]
    ],
    "Step 6": [[h.NOERRORS], [h.ALLGREEN], []],
    "Step 5": [[
      K("The last paragraph lists at least 2 sources", function (c) {
        var p = c.all("p"), t = p.length ? txt(c, p[p.length - 1]) : "";
        var hits = (t.match(/\.(com|org|gov|edu|net)\b|www\.|https?:|encyclopedia|britannica|wikipedia|\bbook\b|\bby [A-Z]|\(\d{4}\)|\b(19|20)\d\d\b/gi) || []).length;
        var lab = /sources?|references?|bibliography|works cited/i.exec(t);
        if (!lab) return hits >= 2;
        var items = t.slice(lab.index + lab[0].length).split(/[;,]|\band\b|\d\)/i).map(function (x) { return x.replace(/[^A-Za-z0-9.]/g, ""); }).filter(function (x) { return x.length >= 3; });
        return (hits >= 2 || items.length >= 2) && words(c, p[p.length - 1]) >= 6;
      })
    ]]
  } };

  /* the last step of each lesson ("Test and submit"): the Checks list has to be all green. These steps have no step comment. */
  SC.LESSONS["6.1"].steps["Step 6"].comment = false;
})(typeof window !== "undefined" ? window : globalThis);
