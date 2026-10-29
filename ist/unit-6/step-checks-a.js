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
  /* ---- the steps, in the order the student types them: skeleton, heading 1, then three sections (a heading 2 and its 2 paragraphs, one section at a time) ---- */
  function section(i) {
    var H2 = function (c) { var x = sections(c)[i]; return x ? x.h2 : null; }, PS = function (c) { var x = sections(c)[i]; return x ? x.ps : []; };
    return [
      [K("There is heading 2 number " + (i + 1) + " (under the heading 1)", function (c) { var e = H2(c), h1 = c.all("h1")[0]; return !!e && !!h1 && h.before(c, h1, e); }), K("The heading 2 has words in it", function (c) { var e = H2(c); return !!e && words(c, e) >= 1; })],
      [K("There are 2 paragraphs right under that heading 2", function (c) { return PS(c).length >= 2; })]
    ];
  }
  var sec1 = section(0), sec2 = section(1), sec3 = section(2);
  sec3[0].push(K("Only heading 1 and heading 2 are used (no heading 3 or smaller)", function (c) { return c.count("h1") >= 1 && c.count("h2") >= 1 && ["h3", "h4", "h5", "h6"].every(function (t) { return c.count(t) === 0; }); }));
  sec3[1].push(CNT("At least 6 paragraphs in all", "p", 6), K("No paragraph is inside a heading", function (c) { return c.all("p").every(function (p) { return !h.inTag(c, p, ["h1", "h2", "h3", "h4", "h5", "h6"]); }) && c.count("p") > 0; }));
  SC.LESSONS["6.1"] = { inlineOnly: false, steps: {
    "Step 1": [
      [h.DOCTYPECK],
      tagSet("html", false),
      tagSet("head", true),
      h.TITLECK,
      tagSet("body", true).concat([K("The body comes after (under) the head", function (c) { var s = c.rawSrc || c.src, he = s.search(/<\/head\s*>/i), bs = s.search(/<body\b/i); return he >= 0 && bs > he; })])
    ],
    "Step 2": [[
      K("There is one heading 1", function (c) { return c.count("h1") === 1; }),
      K("The heading 1 is inside the body", function (c) { var e = c.all("h1")[0]; return !!e && h.inTag(c, e, ["body"]); }),
      K("The heading 1 has words in it", function (c) { var e = c.all("h1")[0]; return !!e && words(c, e) >= 1; })
    ]],
    "Step 3": sec1,
    "Step 4": sec2,
    "Step 5": sec3,
    "Step 6": [[h.NOERRORS], [h.ALLGREEN], []]
  } };

  /* the last step of each lesson ("Check and submit"): the Checks list has to be all green. These steps have no step comment. */
  SC.LESSONS["6.1"].steps["Step 6"].comment = false;
})(typeof window !== "undefined" ? window : globalThis);
