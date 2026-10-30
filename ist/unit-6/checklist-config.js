/* The checklist-style assignments, 3.3 (Parts 1, 2, 3) through 3.10.
   Every lesson has the same shape: pick one of 10 themes, build the skeleton, the basics, the NEW things for this lesson (each used at least 3 times),
   a few things from EARLIER lessons (use at least N of the pool), the design limits, an optional bonus, then submit.

   This file is only DATA. step-checks-b.js turns it into the checks (the auto score) and answers-u3.js turns it into the Assignment tab text,
   so the two always agree. A "spec" says how to test one thing on the page:
     ["count", key, min]        the concept test `key` (html-check.js TESTS) finds at least `min`
     ["sum", [keys], min]       the tests added together find at least `min`
     ["distinct", [keys], min]  at least `min` of the keys are used at all
     ["any", [specs]]           one of the specs is met
     ["all", [specs]]           every spec is met
     ["custom", name]           a named test written in step-checks-b.js
   To change a count, a theme, or an item, change it here; nothing else needs to change. */
(function (root) {
  var CL = root.U7_CL = {};

  CL.lessons = ["6.20", "6.21", "6.22", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6", "6.5"];
  CL.name = { "6.20": "3.3 Part 1", "6.21": "3.3 Part 2", "6.22": "3.3 Part 3", "6.3": "3.4", "6.35": "3.5", "6.4": "3.6", "6.7": "3.7", "6.75": "3.8", "6.6": "3.9", "6.5": "3.10" };

  CL.themes = {
    "6.20": ["A pizza shop", "A gym", "A bakery", "A school club", "A band", "A video game", "A sports team", "An animal shelter", "A movie", "A food truck"],
    "6.21": ["A movie review", "A video game review", "A restaurant review", "A book review", "A song or album review", "A TV show review", "A sports team review", "A snack review", "A product review", "A school cafeteria review"],
    "6.22": ["A band", "A solo artist", "An athlete", "A sports team", "A famous scientist", "A video game character", "A YouTuber", "An actor", "A coach or teacher", "A person from history"],
    "6.3": ["A weird restaurant menu", "Song lyrics", "A tier list", "A movie review", "A recipe", "A sports recap", "A study guide", "A top 10 list", "A product review", "A funny story"],
    "6.35": ["A fancy restaurant", "A haunted house", "A kids' birthday party", "A rock band", "A wedding invitation", "A science fair", "A comic book", "A surf shop", "A news site", "A video game"],
    "6.4": ["A trading card", "A museum exhibit", "A menu board", "A concert ticket", "A recipe card", "A scoreboard", "A school newsletter", "A movie poster", "A product label", "A postcard"],
    "6.7": ["A travel blog", "A pet adoption page", "A car dealership", "A photo album", "A fan page", "A restaurant gallery", "A museum tour", "A sports highlights page", "A fashion lookbook", "A nature guide"],
    "6.75": ["A weather report", "A mood tracker", "A party invitation", "A rated product review", "A travel checklist", "A food menu", "A game scoreboard", "A fan club", "A holiday card", "A fitness tracker"],
    "6.6": ["A personal link page", "A class resource page", "A sports hub", "A game guide", "A music playlist page", "A recipe collection", "A travel guide", "A club website", "A movie directory", "A hobby page"],
    "6.5": ["A top 10 list", "A store flyer", "A to-do planner", "A recipe", "A packing list", "A class schedule", "A tier list", "A restaurant menu", "A bucket list", "A playlist"]
  };

  /* Basics every page needs (3.1 and 3.2): the same for every lesson. */
  CL.basics = {
    h1: 1, h2: 2, p: 4, colorTags: 2, bgTags: 1
  };

  /* NEW in this lesson: each one is a checkbox. `text` is what the student reads, `label` is what "What's wrong?" shows. */
  var THREE33 = [
    { label: "Heading 3 (h3) at least 3 times", text: "**Heading 3** (the h3 tag): at least **3** (small labels, like Hours, Menu, or Contact)", spec: ["count", "h3", 3] },
    { label: "font-size in pixels at least 3 times, with 3 different sizes", text: "**font-size** in pixels: at least **3** uses, with at least **3 different sizes** (like 40px, 28px, 18px)", spec: ["custom", "pxSizes3"] },
    { label: "text-align (center or right) at least 3 times", text: "**text-align**, **center** or **right**: at least **3**", spec: ["count", "p-ta", 3] },
    { label: "text-transform at least 3 times, with 2 different values", text: "**text-transform** (uppercase, lowercase, or capitalize): at least **3** uses, with at least **2 different** values", spec: ["custom", "tt3x2"] }
  ];
  CL.news = {
    "6.20": THREE33, "6.21": THREE33, "6.22": THREE33,
    "6.3": [
      { label: "Bold at least 3 times (strong or b)", text: "**Bold** text: at least **3** (the strong tag or the b tag)", spec: ["count", "strong", 3] },
      { label: "Italic at least 3 times (em or i)", text: "**Italic** text: at least **3** (the em tag or the i tag)", spec: ["count", "em", 3] },
      { label: "Line breaks (br) at least 3 times", text: "**Line breaks**: at least **3** (the br tag, inside a paragraph)", spec: ["count", "br", 3] },
      { label: "Horizontal lines (hr) at least 3 times", text: "**Horizontal lines**: at least **3** (the hr tag, between your sections)", spec: ["count", "hr", 3] },
      { label: "Spans with their own style at least 3 times", text: "**Spans with their own style**: at least **3** (a span around a few words, with a color or another style)", spec: ["custom", "spans3"] }
    ],
    "6.35": [
      { label: "A Google Fonts link in the head", text: "**A Google Fonts link** in the head (at least **1**). Pick fonts that fit your theme", spec: ["count", "attr-gfont", 1] },
      { label: "font-family at least 3 times", text: "**font-family**: at least **3** uses", spec: ["count", "p-ff", 3] },
      { label: "A fallback family at least 3 times", text: "A **fallback family** at the end of your font-family (serif, sans-serif, monospace, or cursive): at least **3**", spec: ["count", "v-fallback", 3] },
      { label: "At least 2 different fonts", text: "At least **2 different fonts** on the page", spec: ["custom", "fonts2"] }
    ],
    "6.4": [
      { label: "border at least 3 times", text: "**border**: at least **3** uses (like 4px solid navy)", spec: ["count", "p-border", 3] },
      { label: "At least 2 different border styles", text: "At least **2 different border styles**: solid, dashed, or dotted", spec: ["distinct", ["v-solid", "v-dashed", "v-dotted"], 2] },
      { label: "A border on just one side", text: "A border on **just one side** (like border-bottom): at least **1**", spec: ["count", "p-bside", 1] }
    ],
    "6.7": [
      { label: "At least 3 images, each with src and alt", text: "**Images**: at least **3**, each with a **src** and a real **alt** description (use **Checks**, then **My images**, then **Insert**)", spec: ["all", [["count", "attr-src", 3], ["count", "attr-alt", 3]]] },
      { label: "Every image is inside a link", text: "**Every image is a link**: each img sits **inside** an a tag with an https:// address", spec: ["custom", "imgLinked"] },
      { label: "Image width in % at least 3 times", text: "**Image width in %**: at least **3** (like width: 50%)", spec: ["count", "v-pct", 3] },
      { label: "A favicon link in the head", text: "**A favicon** in the head (a link tag with rel set to icon): at least **1**", spec: ["count", "attr-favicon", 1] }
    ],
    "6.75": [
      { label: "Emojis at least 3 times", text: "**Emojis**: at least **3** (copy and paste them as text, no image files)", spec: ["count", "ch-emoji", 3] },
      { label: "Symbols at least 3 times", text: "**Symbols** like © ♥ ★ →: at least **3** (copy and paste them as text)", spec: ["count", "ch-symbol", 3] }
    ],
    "6.6": [
      { label: "Links with an href at least 3 times", text: "**Links**: at least **3** (the a tag with a real href, and real link text, never \"click here\")", spec: ["count", "attr-href", 3] },
      { label: "A link that opens in a new tab", text: "A link that **opens in a new tab** (target set to _blank): at least **1**", spec: ["count", "attr-newtab", 1] },
      { label: "A link that stays in the same tab", text: "A link that **stays in the same tab**: at least **1**", spec: ["count", "attr-sametab", 1] },
      { label: "A link around a heading, a paragraph, or words", text: "A link around **a heading, a paragraph, or a few words**: at least **1**", spec: ["count", "a-wrap", 1] },
      { label: "A clickable image", text: "A **clickable image** (an img inside an a tag): at least **1**", spec: ["count", "attr-imglink", 1] }
    ],
    "6.5": [
      { label: "Lists (ul or ol) at least 3 times", text: "**Lists**: at least **3** (the ul bulleted list or the ol numbered list)", spec: ["sum", ["ul", "ol"], 3] },
      { label: "List items (li) at least 9 times", text: "**List items** (the li tag): at least **9** in all", spec: ["count", "li", 9] },
      { label: "list-style-type at least 2 times", text: "**list-style-type**: at least **2** uses (like square, circle, or none)", spec: ["count", "p-lst", 2] },
      { label: "display inline at least once", text: "**display: inline** on your list items to make a row (like a menu): at least **1**", spec: ["count", "v-inline", 1] }
    ]
  };

  /* Families from EARLIER lessons, keyed by the lesson that introduced them. A lesson's pool is every family from the lessons before it. */
  CL.fam = {
    "6.20": [
      { label: "heading 3", spec: ["count", "h3", 1] },
      { label: "font-size in pixels", spec: ["count", "v-px", 1] },
      { label: "text-align", spec: ["count", "p-ta", 1] },
      { label: "text-transform", spec: ["count", "p-tt", 1] }
    ],
    "6.3": [
      { label: "bold", spec: ["count", "strong", 1] },
      { label: "italic", spec: ["count", "em", 1] },
      { label: "line break", spec: ["count", "br", 1] },
      { label: "horizontal line", spec: ["count", "hr", 1] },
      { label: "span with a style", spec: ["custom", "spans1"] }
    ],
    "6.35": [
      { label: "Google Fonts link", spec: ["count", "attr-gfont", 1] },
      { label: "font-family", spec: ["count", "p-ff", 1] }
    ],
    "6.4": [
      { label: "border", spec: ["count", "p-border", 1] },
      { label: "border on one side", spec: ["count", "p-bside", 1] },
      { label: "dashed or dotted border", spec: ["distinct", ["v-dashed", "v-dotted"], 1] }
    ],
    "6.7": [
      { label: "image with alt text", spec: ["count", "attr-alt", 1] },
      { label: "favicon", spec: ["count", "attr-favicon", 1] },
      { label: "image width in %", spec: ["count", "v-pct", 1] }
    ],
    "6.75": [
      { label: "emoji", spec: ["count", "ch-emoji", 1] },
      { label: "symbol", spec: ["count", "ch-symbol", 1] }
    ],
    "6.6": [
      { label: "link", spec: ["count", "attr-href", 1] },
      { label: "link that opens in a new tab", spec: ["count", "attr-newtab", 1] },
      { label: "clickable image", spec: ["count", "attr-imglink", 1] },
      { label: "link around words", spec: ["count", "a-wrap", 1] }
    ]
  };
  CL.famOrder = ["6.20", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6"];
  /* the three 3.3 assignments share one family list (3.3 itself), and each later lesson pools every family before it */
  CL.poolFor = function (lesson) {
    var before = { "6.3": ["6.20"], "6.35": ["6.20", "6.3"], "6.4": ["6.20", "6.3", "6.35"], "6.7": ["6.20", "6.3", "6.35", "6.4"], "6.75": ["6.20", "6.3", "6.35", "6.4", "6.7"], "6.6": ["6.20", "6.3", "6.35", "6.4", "6.7", "6.75"], "6.5": ["6.20", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6"] }[lesson] || [];
    var out = []; before.forEach(function (k) { out = out.concat(CL.fam[k]); }); return out;
  };
  /* how many of the pool they must use (the pool grows, this grows slowly) */
  CL.need = { "6.3": 3, "6.35": 4, "6.4": 5, "6.7": 6, "6.75": 6, "6.6": 7, "6.5": 8 };
  /* the fonts limit applies once fonts are taught (3.5 on) */
  CL.fontLimit = { "6.35": 1, "6.4": 1, "6.7": 1, "6.75": 1, "6.6": 1, "6.5": 1 };
})(typeof window !== "undefined" ? window : globalThis);
