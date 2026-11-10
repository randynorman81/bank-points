/* Rubric engine: turns the text and positions found in a PDF, a photo (OCR) or an HTML table into a rubric,
   spots marks a teacher already made, and does the grading math and spreadsheet export.
   Pure functions with no page code, so it can be tested on its own. */
(function (root) {
  "use strict";
  var KEYWORDS = /excellent|exemplary|proficient|advanced|accomplished|outstanding|distinguished|good|satisfactory|competent|developing|approaching|meets|exceeds|below|fair|poor|needs|beginning|novice|incomplete|unsatisfactory|mastery|expert|emerging|limited|adequate|strong|weak|acceptable|level\s*\d|great|average|basic|minimal|exceptional/i;
  var CRIT_LABEL = /^(criteria|criterion|category|categories|trait|traits|standard|standards|element|elements|skill|skills|dimension|dimensions|requirement|requirements|area|areas|rubric)\b/i;
  var SCORE_LABEL = /^(score|scores|points?|points?\s*earned|earned|grade|mark|marks|total|pts)\.?$/i;
  var COMMENT_LABEL = /^(comments?|feedback|notes?)$/i;
  var TOTAL_ROW = /^(total|overall|final|grand total|sum)\b/i;

  function clean(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function median(a) { if (!a.length) return 0; var b = a.slice().sort(function (x, y) { return x - y; }), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; }
  function num(s) { var m = /^-?\d+(?:\.\d+)?$/.exec(clean(s)); return m ? parseFloat(m[0]) : null; }

  /* ---------------------------------------------------------------- level headers */
  function parseLevelHeader(text) {
    var t = clean(text), lo = null, hi = null, name = t, m;
    if ((m = /(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)/.exec(t))) { lo = Math.min(+m[1], +m[2]); hi = Math.max(+m[1], +m[2]); name = t.replace(m[0], ""); }
    else if ((m = /\(\s*(\d+(?:\.\d+)?)\s*(?:pts?\.?|points?|%)?\s*\)/i.exec(t)) || (m = /(\d+(?:\.\d+)?)\s*(?:pts?\.?|points?)\b/i.exec(t)) || (m = /^(\d+(?:\.\d+)?)\b/.exec(t)) || (m = /\b(\d+(?:\.\d+)?)$/.exec(t))) { lo = hi = +m[1]; name = t.replace(m[0], ""); }
    name = clean(name.replace(/[()\[\]:]/g, " ").replace(/\b(pts?\.?|points?)\b/gi, "")).replace(/^[-–—:,]+|[-–—:,]+$/g, "").trim();
    return { name: name, lo: lo, hi: hi };
  }
  function looksLikeLevel(text) { var t = clean(text); if (!t || SCORE_LABEL.test(t) || COMMENT_LABEL.test(t) || CRIT_LABEL.test(t)) return false; if (t.length > 60) return false; var p = parseLevelHeader(t); return p.hi !== null || KEYWORDS.test(t); }

  /* ---------------------------------------------------------------- layout (words with positions) -> grid of text */
  function gridFromLayout(layout) {
    var items = (layout.items || []).filter(function (it) { return clean(it.s); }).map(function (it) { return { s: clean(it.s), x: it.x, y: it.y, w: it.w, h: it.h || 10, xc: it.x + it.w / 2, yc: it.y + (it.h || 10) / 2 }; });
    if (items.length < 6) return { error: "I couldn't find much text in that file. If it is a photo, make sure it is sharp and well lit, or upload a PDF." };
    var H = median(items.map(function (i) { return i.h; })) || 10;
    /* lines */
    items.sort(function (a, b) { return a.yc - b.yc || a.x - b.x; });
    var lines = [], cur = null;
    items.forEach(function (it) { if (!cur || it.yc - cur.yc > 0.6 * H) { cur = { yc: it.yc, items: [] }; lines.push(cur); } cur.items.push(it); cur.yc = (cur.yc * (cur.items.length - 1) + it.yc) / cur.items.length; });
    lines.forEach(function (l) { l.items.sort(function (a, b) { return a.x - b.x; }); l.segs = segments(l.items, 1.0 * H); l.y0 = Math.min.apply(null, l.items.map(function (i) { return i.y; })); l.y1 = Math.max.apply(null, l.items.map(function (i) { return i.y + i.h; })); });
    /* header line: first line with 2+ level-looking segments (3+ segments), else the busiest early line */
    var hi = -1, i;
    for (i = 0; i < lines.length && hi < 0; i++) { var ls = lines[i].segs.filter(function (s) { return looksLikeLevel(s.text); }); if (lines[i].segs.length >= 3 && ls.length >= 2) hi = i; }
    if (hi < 0) { var best = 0; for (i = 0; i < Math.min(lines.length, 18); i++) if (lines[i].segs.length > best) { best = lines[i].segs.length; hi = i; } if (best < 3) return { error: "I couldn't find the table header (the row with the performance levels, like Excellent / Good / Fair). You can build the rubric yourself in the next step." }; }
    var hdr = lines[hi], hsegs = hdr.segs.slice(), next = lines[hi + 1];
    /* a second header line holding only the points (Excellent / 4 pts) */
    if (next && next.yc - hdr.yc < 2.4 * H && next.segs.length && next.segs.length <= hsegs.length && next.segs.every(function (s) { return /^\(?\d+(?:\.\d+)?\s*(?:[-–]\s*\d+(?:\.\d+)?)?\s*(?:pts?\.?|points?|%)?\)?$/i.test(s.text); })) {
      next.segs.forEach(function (s) { var near = null, bd = 1e9; hsegs.forEach(function (h) { var d = Math.abs((h.x0 + h.x1) / 2 - (s.x0 + s.x1) / 2); if (d < bd) { bd = d; near = h; } }); if (near && bd < 3 * H + (near.x1 - near.x0)) near.text += " " + s.text; }); hi++;
    }
    var below = lines.slice(hi + 1); if (below.length < 2) return { error: "I found the header but no rows under it." };
    var allBelow = []; below.forEach(function (l) { allBelow = allBelow.concat(l.items); });
    /* is there a criteria column to the left of the first header cell? */
    var firstSeg = hsegs[0], leftItems = allBelow.filter(function (it) { return it.x + it.w < firstSeg.x0 - 0.2 * H; });
    var hasCritCol = leftItems.length >= 2;
    var cols = hsegs.map(function (s) { return { text: s.text, x0: s.x0, x1: s.x1 }; });
    if (hasCritCol) cols.unshift({ text: "", x0: Math.min.apply(null, leftItems.map(function (i) { return i.x; })), x1: Math.max.apply(null, leftItems.map(function (i) { return i.x + i.w; })), implied: true });
    /* column boundaries: empty vertical bands between columns, else halfway between the header texts */
    var gutters = findGutters(allBelow, 0.25 * H), bounds = [];
    for (i = 0; i < cols.length - 1; i++) {
      var a = cols[i], b = cols[i + 1], lo = (a.x0 + a.x1) / 2, hi2 = (b.x0 + b.x1) / 2, mid = (a.x1 + b.x0) / 2, pick = null, pd = 1e9;
      gutters.forEach(function (g) { var gc = (g[0] + g[1]) / 2; if (gc > lo && gc < hi2) { var d = Math.abs(gc - mid); if (d < pd) { pd = d; pick = gc; } } });
      bounds.push(pick !== null ? pick : mid);
    }
    var colOf = function (it) { var c = 0; while (c < bounds.length && it.xc > bounds[c]) c++; return c; };
    allBelow.forEach(function (it) { it.col = colOf(it); });
    /* rows: where blocks of text start in several columns at the same height */
    var starts = [];
    for (var c = 0; c < cols.length; c++) {
      var ci = allBelow.filter(function (it) { return it.col === c; }).sort(function (a, b) { return a.yc - b.yc; }), prevY = null, lineH = H * 1.45;
      var cl = []; ci.forEach(function (it) { if (!cl.length || it.yc - cl[cl.length - 1].yc > 0.6 * H) cl.push({ yc: it.yc, y: it.y }); });
      cl.forEach(function (l, k) { if (k === 0 || l.yc - cl[k - 1].yc > lineH * 1.12) starts.push({ y: l.y, yc: l.yc, col: c }); });
    }
    starts.sort(function (a, b) { return a.y - b.y; });
    var groups = []; starts.forEach(function (s) { var g = groups[groups.length - 1]; if (g && s.y - g.y <= 0.9 * H) { g.cols[s.col] = 1; g.n++; g.ys.push(s.y); g.y = Math.min.apply(null, g.ys); } else groups.push({ y: s.y, ys: [s.y], cols: (function () { var o = {}; o[s.col] = 1; return o; })(), n: 1 }); });
    var need = Math.min(2, cols.length), rowStarts = groups.filter(function (g) { return Object.keys(g.cols).length >= need; }).map(function (g) { return g.y; });
    if (!rowStarts.length) return { error: "I found the header but couldn't tell where the rows begin." };
    var rows = rowStarts.map(function () { return []; }); for (i = 0; i < rows.length; i++) rows[i] = cols.map(function () { return []; });
    allBelow.forEach(function (it) { var r = -1; for (var k = 0; k < rowStarts.length; k++) if (it.yc >= rowStarts[k] - 0.6 * H) r = k; if (r >= 0) rows[r][it.col].push(it); });
    var grid = [cols.map(function (c) { return clean(c.text); })], geo = { colBounds: bounds, rowStarts: rowStarts, header: { y0: hdr.y0, y1: hdr.y1 }, x0: Math.min.apply(null, items.map(function (i) { return i.x; })) - H, x1: Math.max.apply(null, items.map(function (i) { return i.x + i.w; })) + H, rowItems: [] };
    rows.forEach(function (r) { grid.push(r.map(function (list) { return clean(readingOrder(list, H).map(function (i) { return i.s; }).join(" ")); })); geo.rowItems.push(r); });
    geo.lastY = Math.max.apply(null, items.map(function (i) { return i.y + i.h; })) + H;
    return { grid: grid, geo: geo, H: H };
  }
  /* words in reading order: group into lines first (so small height differences don't scramble a line), then left to right */
  function readingOrder(list, H) {
    var sorted = list.slice().sort(function (a, b) { return a.yc - b.yc; }), lines = [], cur = null;
    sorted.forEach(function (it) { if (!cur || it.yc - cur.yc > 0.6 * H) { cur = { yc: it.yc, items: [] }; lines.push(cur); } cur.items.push(it); });
    var out = []; lines.forEach(function (l) { l.items.sort(function (a, b) { return a.x - b.x; }); out = out.concat(l.items); }); return out;
  }
  function segments(items, gap) { var segs = [], cur = null; items.forEach(function (it) { if (cur && it.x - cur.x1 <= gap) { cur.text += " " + it.s; cur.x1 = Math.max(cur.x1, it.x + it.w); } else { cur = { text: it.s, x0: it.x, x1: it.x + it.w }; segs.push(cur); } }); return segs; }
  function findGutters(items, pad) {
    var iv = items.map(function (i) { return [i.x - pad, i.x + i.w + pad]; }).sort(function (a, b) { return a[0] - b[0]; }), out = [], end = null;
    iv.forEach(function (v) { if (end === null) end = v[1]; else if (v[0] > end) { out.push([end, v[0]]); end = v[1]; } else end = Math.max(end, v[1]); });
    return out;
  }

  /* ---------------------------------------------------------------- grid -> rubric */
  function rubricFromGrid(grid, geo) {
    if (!grid || grid.length < 2) return { error: "That doesn't look like a rubric table." };
    var head = grid[0], ncol = head.length, levels = [], critCol = -1, scoreCol = -1, commentCol = -1, c;
    for (c = 0; c < ncol; c++) {
      var h = clean(head[c]);
      if (SCORE_LABEL.test(h)) { if (scoreCol < 0) scoreCol = c; continue; }
      if (COMMENT_LABEL.test(h)) { if (commentCol < 0) commentCol = c; continue; }
      if (looksLikeLevel(h) && c > 0) { var p = parseLevelHeader(h); levels.push({ col: c, name: p.name || "Level " + (levels.length + 1), lo: p.lo, hi: p.hi }); }
      else if (critCol < 0 && c === 0) critCol = 0;
      else if (c === 0) critCol = 0;
    }
    if (c && !levels.length) { /* header had no usable levels: treat every column after the first as a level */ for (c = 1; c < ncol; c++) if (c !== scoreCol && c !== commentCol) { var p2 = parseLevelHeader(head[c]); levels.push({ col: c, name: p2.name || "Level " + c, lo: p2.lo, hi: p2.hi }); } }
    if (!levels.length) return { error: "I couldn't find the performance levels in the header." };
    /* levels with no points: count down from the number of levels */
    var guessed = false; levels.forEach(function (l, i) { if (l.hi === null) { l.hi = l.lo = levels.length - i; guessed = true; } });
    var crits = [];
    for (var r = 1; r < grid.length; r++) {
      var row = grid[r], name = clean(row[0]);
      if (TOTAL_ROW.test(name)) continue;
      var cells = levels.map(function (l) { return clean(row[l.col]); });
      if (!name && !cells.some(Boolean)) continue;
      var max = Math.max.apply(null, levels.map(function (l) { return l.hi; }));
      crits.push({ name: name || "Criterion " + (crits.length + 1), cells: cells, max: max, srcRow: r - 1 });
    }
    if (!crits.length) return { error: "I found the levels but no criteria rows." };
    return { rubric: { title: "", levels: levels.map(function (l) { return { name: l.name, points: l.hi, lo: l.lo, col: l.col }; }), criteria: crits, guessedPoints: guessed, scoreCol: scoreCol }, geo: geo };
  }

  /* ---------------------------------------------------------------- HTML tables (Google Docs, Word) */
  function gridFromTable(rowsOfCells) { /* rowsOfCells: [[{text, bg}]] */
    var n = Math.max.apply(null, rowsOfCells.map(function (r) { return r.length; })), grid = [], bgs = [];
    rowsOfCells.forEach(function (r) { var g = [], b = []; for (var i = 0; i < n; i++) { g.push(clean(r[i] ? r[i].text : "")); b.push(r[i] ? r[i].bg || "" : ""); } grid.push(g); bgs.push(b); });
    /* the header is the first row with level-looking cells */
    var hi = 0; for (var i = 0; i < Math.min(grid.length, 4); i++) if (grid[i].filter(looksLikeLevel).length >= 2) { hi = i; break; }
    return { grid: grid.slice(hi), bgs: bgs.slice(hi) };
  }

  /* ---------------------------------------------------------------- marks that are already on a rubric */
  var MARK_RE = /(^|\s)(✓|✔|☑|✗|✘|☒|☓|×|x|X|●|◉|⬤|⊗)(\s|$)|\[\s*[xX✓]\s*\]|\(\s*[xX✓]\s*\)/;
  function typedMarks(rubric, grid, bgs) {
    var res = rubric.criteria.map(function () { return { pick: -1, why: "", score: null }; }), lv = rubric.levels;
    rubric.criteria.forEach(function (cr, i) {
      var row = grid[cr.srcRow + 1] || [], hits = [];
      lv.forEach(function (l, k) { if (MARK_RE.test(row[l.col] || "") && clean(row[l.col]).length < 400) hits.push(k); });
      if (hits.length === 1) { res[i].pick = hits[0]; res[i].why = "a check or X in that box"; }
      /* shaded or highlighted cell */
      if (res[i].pick < 0 && bgs) { var br = bgs[cr.srcRow + 1] || [], vals = lv.map(function (l) { return br[l.col] || ""; }), cnt = {}; vals.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; }); var odd = []; vals.forEach(function (v, k) { if (cnt[v] === 1 && vals.length > 2) odd.push(k); }); if (odd.length === 1) { res[i].pick = odd[0]; res[i].why = "a shaded box"; } }
      /* a number written in the score column */
      if (rubric.scoreCol >= 0) { var sc = /^(\d+(?:\.\d+)?)(?:\s*\/\s*\d+(?:\.\d+)?)?$/.exec(clean(row[rubric.scoreCol])); if (sc) res[i].score = parseFloat(sc[1]); }
    });
    return res;
  }

  /* ---------------------------------------------------------------- pick the marked box from ink measurements */
  /* measures: per criterion, an array (one number per level) of how much pen ink is in that box.
     The marked box stands out from the rest of its row; shared things like table lines or shading cancel out. */
  function pickOutliers(measures) {
    return measures.map(function (row) {
      if (!row || row.length < 2) return { pick: -1, conf: 0 };
      var med = median(row), top = -1, v = -1, second = -1;
      row.forEach(function (m, k) { if (m > v) { second = v; v = m; top = k; } else if (m > second) second = m; });
      var base = Math.max(med, 0), lift = v - base, floor = 0.012;
      if (v < floor || lift < floor * 0.8) return { pick: -1, conf: 0 };
      var ratio = second > 0 ? v / second : 9, conf = Math.min(1, Math.max(0, (ratio - 1) / 1.5));
      if (ratio < 1.35) return { pick: -1, conf: 0, maybe: top };
      return { pick: top, conf: conf };
    });
  }

  /* ---------------------------------------------------------------- grading math */
  function criterionMax(cr) { return +cr.max || 0; }
  function totals(rubric, grades) {
    var got = 0, max = 0;
    rubric.criteria.forEach(function (cr, i) { max += criterionMax(cr); var g = grades && grades[i]; if (g && g.points !== null && g.points !== undefined && g.points !== "" && !isNaN(+g.points)) got += +g.points; });
    var pct = max ? Math.round(got / max * 1000) / 10 : 0;
    return { got: Math.round(got * 100) / 100, max: Math.round(max * 100) / 100, pct: pct, letter: letter(pct) };
  }
  function letter(p) { return p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F"; }
  function levelPoints(rubric, ci, li) { var cr = rubric.criteria[ci], top = Math.max.apply(null, rubric.levels.map(function (l) { return l.points; })); return cr.max && top ? Math.round(rubric.levels[li].points / top * cr.max * 100) / 100 : rubric.levels[li].points; }

  /* ---------------------------------------------------------------- spreadsheet rows */
  function sheetRows(rubric, students, title) {
    var head = ["Student", "Date"].concat(rubric.criteria.map(function (c) { return c.name + " (/" + criterionMax(c) + ")"; }), ["Total", "Out of", "Percent", "Letter", "Comments"]);
    var rows = [head];
    students.forEach(function (s) {
      var t = totals(rubric, s.grades);
      rows.push([s.name, s.date || ""].concat(rubric.criteria.map(function (c, i) { var g = s.grades[i]; return g && g.points !== null && g.points !== undefined && g.points !== "" ? +g.points : ""; }), [t.got, t.max, t.pct, t.letter, commentText(rubric, s)]));
    });
    return rows;
  }
  function commentText(rubric, s) { var parts = []; rubric.criteria.forEach(function (c, i) { var g = s.grades[i]; if (g && clean(g.comment)) parts.push(c.name + ": " + clean(g.comment)); }); if (clean(s.comment)) parts.unshift(clean(s.comment)); return parts.join(" | "); }
  function csvCell(v) { var s = String(v == null ? "" : v); return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
  function toCSV(rows) { return rows.map(function (r) { return r.map(csvCell).join(","); }).join("\r\n"); }
  function toTSV(rows) { return rows.map(function (r) { return r.map(function (v) { return String(v == null ? "" : v).replace(/[\t\r\n]+/g, " "); }).join("\t"); }).join("\n"); }

  root.RubricEngine = { gridFromLayout: gridFromLayout, rubricFromGrid: rubricFromGrid, gridFromTable: gridFromTable, typedMarks: typedMarks, pickOutliers: pickOutliers, totals: totals, letter: letter, levelPoints: levelPoints, sheetRows: sheetRows, toCSV: toCSV, toTSV: toTSV, parseLevelHeader: parseLevelHeader, clean: clean, commentText: commentText };
  if (typeof module !== "undefined" && module.exports) module.exports = root.RubricEngine;
})(typeof window !== "undefined" ? window : this);
