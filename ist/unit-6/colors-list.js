/* Every HTML/CSS named color (148 names, counting the gray/grey spellings), shown as small squares grouped by main color.
   Used by the Style Attribute notes page and by the "See all the named colors" help button in the Web Editor.
   U7_COLORGRID(options) returns an HTML string: { filter: "text" } keeps only names that contain the text.
   The squares are plain labels (students cannot click-copy a name). The browser works out each color itself, so there is no list of codes to get wrong. */
(function (root) {
  var NAMES = ["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"];
  var GROUPS = ["Red", "Orange", "Yellow", "Green", "Blue and cyan", "Purple", "Pink", "Brown", "White, gray, and black"];
  var cvs = null;
  function rgbOf(name) {
    try { cvs = cvs || document.createElement("canvas").getContext("2d"); cvs.fillStyle = "#000"; cvs.fillStyle = name; var c = cvs.fillStyle; if (c.charAt(0) === "#") return [parseInt(c.substr(1, 2), 16), parseInt(c.substr(3, 2), 16), parseInt(c.substr(5, 2), 16)]; var m = /(\d+)[, ]+(\d+)[, ]+(\d+)/.exec(c); return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0]; } catch (e) { return [0, 0, 0]; }
  }
  function hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, h = 0, s = 0;
    if (d) { s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s, l];
  }
  function groupOf(name) {
    var rgb = rgbOf(name), x = hsl(rgb[0], rgb[1], rgb[2]), h = x[0], s = x[1], l = x[2];
    if (s < .13 || l < .07 || l > .96) return 8;
    if (h >= 150 && h < 260 && s < .27 && l < .6) return 8;      /* the slate grays */
    if (l > .93 && !(h >= 45 && h < 70)) return 8;                /* the near-whites (linen, oldlace, ...) */
    if (h >= 10 && h < 40 && l < .5 && s > .2) return 7;       /* brown */
    if ((h >= 330 || h < 12) && l > .72) return 6;                /* light reds are pinks */
    if (h >= 290 && h < 345) return h >= 290 && h < 330 && s > .3 && l < .6 ? 5 : 6;
    if (h >= 345 || h < 15) return 0;
    if (h < 45) return 1;
    if (h < 70) return 2;
    if (h < 165) return 3;
    if (h < 255) return 4;
    return 5;
  }
  var BUILT = null;
  function build() {
    if (BUILT) return BUILT;
    var groups = GROUPS.map(function () { return []; });
    NAMES.forEach(function (n) { var rgb = rgbOf(n), x = hsl(rgb[0], rgb[1], rgb[2]); groups[groupOf(n)].push({ n: n, l: x[2], h: x[0] }); });
    groups.forEach(function (g, i) { g.sort(function (a, b) { return i === 8 ? a.l - b.l : (a.l - b.l) || (a.h - b.h); }); });
    BUILT = groups; return groups;
  }
  function grid(opt) {
    opt = opt || {}; var f = String(opt.filter || "").toLowerCase().replace(/\s+/g, ""), shown = 0;
    var html = '<div class="u7cg" style="font-family:\'JetBrains Mono\',monospace">';
    build().forEach(function (g, i) {
      var items = g.filter(function (c) { return !f || c.n.indexOf(f) > -1; });
      if (!items.length) return; shown += items.length;
      html += '<div style="margin:14px 0 6px;font:700 12px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.85">' + GROUPS[i] + ' <span style="opacity:.6">(' + items.length + ')</span></div><div style="display:flex;flex-wrap:wrap;gap:6px">';
      items.forEach(function (c) {
        html += '<span class="u7sw" style="display:inline-flex;align-items:center;gap:8px;background:rgba(127,127,127,.10);border:1px solid rgba(127,127,127,.35);color:inherit;border-radius:7px;padding:3px 10px 3px 4px;user-select:none;-webkit-user-select:none;font:12px/1.2 \'JetBrains Mono\',monospace"><span style="width:29px;height:29px;border-radius:5px;border:1px solid rgba(127,127,127,.55);background:' + c.n + ';flex:0 0 29px"></span>' + c.n + '</span>';
      });
      html += "</div>";
    });
    if (!shown) html += '<p style="opacity:.7">No color has that in its name.</p>';
    return html + "</div>";
  }
  root.U7_COLORS = NAMES; root.U7_COLORGRID = grid;
})(typeof window !== "undefined" ? window : globalThis);
