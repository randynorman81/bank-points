(function () {
  "use strict";
  var E = RubricEngine, $ = function (id) { return document.getElementById(id); };
  var KEY = "rubricGrader:v1", DEFAULT_BANK = ["Great work!", "Needs more detail.", "Check your spelling and grammar.", "Good start. Explain your thinking more.", "Missing this part.", "Excellent, keep it up."];
  var S = { scale: 0, title: "", rubric: null, students: [], bank: DEFAULT_BANK.slice(), roster: [], grades: [], comment: "", editId: null };
  var SRC = null; /* the uploaded rubric: { canvas, parsed (rubric+geo), marks } */
  try { var sv = JSON.parse(localStorage.getItem(KEY) || "null"); if (sv && sv.rubric) { S.title = sv.title || ""; S.rubric = sv.rubric; S.students = sv.students || []; S.bank = sv.bank && sv.bank.length ? sv.bank : S.bank; S.roster = sv.roster || []; S.scale = +sv.scale || 0; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ title: S.title, rubric: S.rubric, students: S.students, bank: S.bank, roster: S.roster, scale: S.scale })); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function status(el, text, kind) { el.hidden = !text; el.textContent = text || ""; el.className = "msg" + (kind ? " " + kind : ""); }
  function progress(bar, fill, p) { bar.hidden = p === null; if (p !== null) fill.style.width = Math.round(p * 100) + "%"; }

  /* ================================================================= reading files */
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  function loadImage(file) { return new Promise(function (res, rej) { var u = URL.createObjectURL(file), im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { rej(new Error("I couldn't open that image. Try a JPG or PNG (iPhone HEIC photos may need to be saved as JPG first).")); }; im.src = u; }); }
  var ocrWorker = null, ocrProg = null;
  /* clean a copy for reading: colored pen fades away (we keep the biggest color channel), and long table lines are erased so they don't confuse the reader */
  function prepForOcr(src, noLines) {
    var c = document.createElement("canvas"); c.width = src.width; c.height = src.height; var x = c.getContext("2d"); x.drawImage(src, 0, 0);
    var im = x.getImageData(0, 0, c.width, c.height), d = im.data, w = c.width, h = c.height, g = new Uint8Array(w * h), i, y, xx;
    for (i = 0; i < w * h; i++) g[i] = Math.max(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
    var dark = function (v) { return v < 150; }, kill = new Uint8Array(w * h), minRun = 70, run, start;
    if (noLines) {
      /* even out the lighting: stretch so the paper becomes white and the darkest ink black (gray, shadowed photos read badly otherwise) */
      var hist = new Uint32Array(256), cnt = 0; for (i = 0; i < w * h; i++) if (g[i] !== 255) { hist[g[i]]++; cnt++; }
      var lo = 0, hi = 255, acc = 0, v0;
      if (cnt > 200) { for (v0 = 0; v0 < 256; v0++) { acc += hist[v0]; if (acc >= cnt * 0.01) { lo = v0; break; } } acc = 0; for (v0 = 0; v0 < 256; v0++) { acc += hist[v0]; if (acc >= cnt * 0.55) { hi = v0; break; } } }
      var span = Math.max(1, hi - lo);
      for (i = 0; i < w * h; i++) { var vv = g[i] === 255 ? 255 : Math.max(0, Math.min(255, Math.round((g[i] - lo) / span * 235))); if (vv > 235) vv = 255; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = vv; d[i * 4 + 3] = 255; }
      x.putImageData(im, 0, 0); return c;
    }
    for (y = 0; y < h; y++) { run = 0; for (xx = 0; xx <= w; xx++) { if (xx < w && dark(g[y * w + xx])) run++; else { if (run >= minRun) for (var k = xx - run; k < xx; k++) for (var dy = -2; dy <= 2; dy++) { var yy = y + dy; if (yy >= 0 && yy < h) kill[yy * w + k] = 1; } run = 0; } } }
    for (xx = 0; xx < w; xx++) { run = 0; for (y = 0; y <= h; y++) { if (y < h && dark(g[y * w + xx])) run++; else { if (run >= minRun) for (var k2 = y - run; k2 < y; k2++) for (var dx = -2; dx <= 2; dx++) { var xq = xx + dx; if (xq >= 0 && xq < w) kill[k2 * w + xq] = 1; } run = 0; } } }
    for (i = 0; i < w * h; i++) { var v = kill[i] ? 255 : g[i]; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = v; d[i * 4 + 3] = 255; }
    x.putImageData(im, 0, 0); return c;
  }
  var ocrWorkers = {};
  function getWorker(psm) {
    psm = psm || "11"; if (ocrWorkers[psm]) return ocrWorkers[psm];
    ocrWorkers[psm] = Tesseract.createWorker("eng", 1, { logger: function (m) { if (m.status === "recognizing text" && ocrProg) ocrProg(m.progress); } }).then(function (wk) { return wk.setParameters({ tessedit_pageseg_mode: psm }).then(function () { return wk; }); });
    return ocrWorkers[psm];
  }
  /* read a table photo one box at a time, using the table's own lines (works on tilted photos) */
  function inset(q, px) { var cx = (q[0].x + q[1].x + q[2].x + q[3].x) / 4, cy = (q[0].y + q[1].y + q[2].y + q[3].y) / 4; return q.map(function (p) { var dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1; return { x: p.x - dx / d * px, y: p.y - dy / d * px }; }); }
  function ocrCells(c, gl, onp) {
    var rows = gl.cells.length, cols = gl.cells[0].length, total = rows * cols, done = 0, items = [], grid = [], hs = [];
    return getWorker("6").then(function (wk) {
      var chain = Promise.resolve();
      gl.cells.forEach(function (row, i) { grid.push([]); row.forEach(function (q, j) { chain = chain.then(function () {
        var iq = inset(q, 6), xs = iq.map(function (p) { return p.x; }), ys = iq.map(function (p) { return p.y; }), x0 = Math.max(0, Math.floor(Math.min.apply(null, xs))), y0 = Math.max(0, Math.floor(Math.min.apply(null, ys))), x1 = Math.min(c.width, Math.ceil(Math.max.apply(null, xs))), y1 = Math.min(c.height, Math.ceil(Math.max.apply(null, ys))), w = x1 - x0, h = y1 - y0;
        if (w < 20 || h < 12) { grid[i][j] = ""; done++; return; }
        var tc = document.createElement("canvas"); tc.width = w; tc.height = h; var t = tc.getContext("2d"); t.fillStyle = "#fff"; t.fillRect(0, 0, w, h);
        t.save(); t.beginPath(); iq.forEach(function (p, n) { n ? t.lineTo(p.x - x0, p.y - y0) : t.moveTo(p.x - x0, p.y - y0); }); t.closePath(); t.clip(); t.drawImage(c, -x0, -y0); t.restore();
        return wk.recognize(prepForOcr(tc, true)).then(function (r) {
          done++; if (onp) onp(done / total);
          var words = (r.data.words || []).filter(function (w2) { return w2.text && /[A-Za-z0-9&]/.test(w2.text) && w2.confidence > 20; });
          grid[i][j] = E.clean(words.map(function (w2) { return w2.text; }).join(" "));
          words.forEach(function (w2) { var it = { s: w2.text, x: x0 + w2.bbox.x0, y: y0 + w2.bbox.y0, w: w2.bbox.x1 - w2.bbox.x0, h: w2.bbox.y1 - w2.bbox.y0 }; items.push(it); hs.push(it.h); });
        });
      }); }); });
      return chain;
    }).then(function () {
      hs.sort(function (a, b) { return a - b; }); return { kind: "cells", canvas: c, grid: grid, geo: { cells: gl.cells, H: hs.length ? hs[hs.length >> 1] : 20 }, layout: { items: items } };
    });
  }
  function ocr(canvas, onp) {
    if (!window.Tesseract) return Promise.reject(new Error("The photo reader didn't load. Check your connection, or upload a PDF instead."));
    var clean = prepForOcr(canvas); ocrProg = onp;
    return getWorker().then(function (wk) { return wk.recognize(clean); }).then(function (r) {
      var words = r.data.words || []; if (!words.length && r.data.blocks) r.data.blocks.forEach(function (b) { (b.paragraphs || []).forEach(function (p) { (p.lines || []).forEach(function (l) { words = words.concat(l.words || []); }); }); });
      return words.filter(function (w) { return w.text && w.text.trim().length && w.confidence > 20 && /[A-Za-z0-9]/.test(w.text); }).map(function (w) { return { s: w.text, x: w.bbox.x0, y: w.bbox.y0, w: w.bbox.x1 - w.bbox.x0, h: w.bbox.y1 - w.bbox.y0 }; });
    });
  }
  function smartOcr(c, onp) {
    var gl = null; try { gl = window.GridLines && GridLines.detect(c); } catch (e) { gl = null; }
    if (gl && gl.cells.length >= 2 && gl.cells[0].length >= 3 && gl.cells.length * gl.cells[0].length <= 120) return ocrCells(c, gl, onp);
    return ocr(c, onp).then(function (items) { return { kind: "layout", canvas: c, layout: { items: items } }; });
  }
  function imageSource(file, onp) {
    return loadImage(file).then(function (im) {
      var sc = Math.min(1, 2200 / im.naturalWidth), c = document.createElement("canvas"); c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      return smartOcr(c, onp);
    });
  }
  function pdfSource(file, onp) {
    if (!window.pdfjsLib) return Promise.reject(new Error("The PDF reader didn't load. Check your connection, or upload a photo instead."));
    return file.arrayBuffer().then(function (buf) { return pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; }).then(function (doc) {
      var n = Math.min(doc.numPages, 3), pages = [], i, chain = Promise.resolve();
      for (i = 1; i <= n; i++) (function (pn) { chain = chain.then(function () { return doc.getPage(pn); }).then(function (pg) {
        var vp = pg.getViewport({ scale: 1.6 }), c = document.createElement("canvas"); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
        return pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () { return pg.getTextContent(); }).then(function (tc) {
          var items = []; tc.items.forEach(function (it) { if (!it.str || !it.str.trim()) return; var t = pdfjsLib.Util.transform(vp.transform, it.transform), h = Math.hypot(t[2], t[3]) || 10; items.push({ s: it.str, x: t[4], y: t[5] - h * 0.85, w: it.width * vp.scale, h: h }); });
          pages.push({ canvas: c, items: items });
        });
      }); })(i);
      return chain.then(function () {
        var W = Math.max.apply(null, pages.map(function (p) { return p.canvas.width; })), Ht = pages.reduce(function (a, p) { return a + p.canvas.height; }, 0), big = document.createElement("canvas"); big.width = W; big.height = Ht;
        var ctx = big.getContext("2d"), y = 0, items = []; ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, Ht);
        pages.forEach(function (p) { ctx.drawImage(p.canvas, 0, y); p.items.forEach(function (it) { items.push({ s: it.s, x: it.x, y: it.y + y, w: it.w, h: it.h }); }); y += p.canvas.height; });
        if (items.length >= 20) return { kind: "layout", canvas: big, layout: { items: items } };
        /* a scanned PDF has no text layer: read it like a photo */
        return smartOcr(big, onp);
      });
    });
  }
  function cssBgMap(doc) { var map = {}; doc.querySelectorAll("style").forEach(function (st) { (st.textContent.match(/\.[\w-]+\s*\{[^}]*\}/g) || []).forEach(function (rule) { var m = /\.([\w-]+)\s*\{([^}]*)\}/.exec(rule), bg = /background-color\s*:\s*([^;}\s]+)/.exec(m[2]); if (bg) map[m[1]] = bg[1]; }); }); return map; }
  function tableSource(html) {
    var doc = new DOMParser().parseFromString(html, "text/html"), css = cssBgMap(doc), best = null;
    doc.querySelectorAll("table").forEach(function (t) {
      var rows = [].map.call(t.rows, function (tr) { return [].map.call(tr.cells, function (td) {
        var bg = ((/background-color\s*:\s*([^;]+)/.exec(td.getAttribute("style") || "") || [])[1] || ""); td.classList.forEach(function (c) { if (css[c]) bg = css[c]; });
        bg = bg.trim(); if (/^(#fff(fff)?|white|transparent|none)$/i.test(bg)) bg = ""; return { text: td.innerText || td.textContent, bg: bg }; }); });
      var n = rows.reduce(function (a, r) { return a + r.length; }, 0); if (!best || n > best.n) best = { rows: rows, n: n };
    });
    if (!best || best.rows.length < 2) return Promise.reject(new Error("I didn't find a table in that document. A rubric needs to be a table (criteria down the side, levels across the top)."));
    return Promise.resolve({ kind: "table", table: E.gridFromTable(best.rows) });
  }
  function csvSource(text) {
    var rows = [], cur = [], f = "", q = false, i, ch;
    for (i = 0; i < text.length; i++) { ch = text[i]; if (q) { if (ch === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (ch === '"') q = false; else f += ch; } else if (ch === '"') q = true; else if (ch === ",") { cur.push(f); f = ""; } else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; cur.push(f); rows.push(cur); cur = []; f = ""; } else f += ch; }
    if (f || cur.length) { cur.push(f); rows.push(cur); }
    return Promise.resolve({ kind: "table", table: E.gridFromTable(rows.filter(function (r) { return r.some(function (c) { return c.trim(); }); }).map(function (r) { return r.map(function (t) { return { text: t, bg: "" }; }); })) });
  }
  function xlsxSource(file) {
    if (!window.XLSX) return Promise.reject(new Error("The Excel reader didn't load. Save the sheet as a CSV and upload that."));
    return file.arrayBuffer().then(function (buf) {
      var wb = XLSX.read(buf, { type: "array" }), ws = wb.Sheets[wb.SheetNames[0]], rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", blankrows: false });
      return { kind: "table", table: E.gridFromTable(rows.map(function (r) { return r.map(function (t) { return { text: String(t), bg: "" }; }); })) };
    });
  }
  function readFile(file, onp) {
    var n = file.name.toLowerCase();
    if (/\.pdf$/.test(n) || file.type === "application/pdf") return pdfSource(file, onp);
    if (/\.docx$/.test(n)) { if (!window.mammoth) return Promise.reject(new Error("The Word reader didn't load.")); return file.arrayBuffer().then(function (b) { return mammoth.convertToHtml({ arrayBuffer: b }); }).then(function (r) { return tableSource(r.value); }); }
    if (/\.xlsx?$/.test(n)) return xlsxSource(file);
    if (/\.csv$/.test(n)) return file.text().then(csvSource);
    if (/^image\//.test(file.type) || /\.(png|jpe?g|webp|gif|bmp)$/.test(n)) return imageSource(file, onp);
    return Promise.reject(new Error("I can read PDF, photo, Word (.docx) and CSV files."));
  }

  /* ================================================================= turn a source into a rubric + marks */
  function analyze(src) {
    var parsed, grid, bgs = null;
    if (src.kind === "table") { grid = src.table.grid; bgs = src.table.bgs; parsed = E.rubricFromGrid(grid, null); }
    else if (src.kind === "cells") { grid = src.grid; parsed = E.rubricFromGrid(grid, src.geo); }
    else { var g = E.gridFromLayout(src.layout); if (g.error) return { error: g.error }; grid = g.grid; parsed = E.rubricFromGrid(grid, g.geo); if (parsed.geo) parsed.geo.H = g.H; }
    if (parsed.error) return { error: parsed.error };
    var res = { rubric: parsed.rubric, geo: parsed.geo, grid: grid, src: src }, typed = E.typedMarks(parsed.rubric, grid, bgs), picks = typed.map(function (t) { return { pick: t.pick, conf: t.pick >= 0 ? 1 : 0, why: t.why, score: t.score }; });
    if ((src.kind === "layout" || src.kind === "cells") && src.canvas && parsed.geo) {
      var px = pixelMarks(src, parsed);
      picks.forEach(function (p, i) { if (p.pick < 0 && px.picks[i].pick >= 0) { p.pick = px.picks[i].pick; p.conf = px.picks[i].conf; p.why = "a pen or highlighter mark"; } else if (p.pick < 0 && px.picks[i].maybe >= 0 && px.picks[i].maybe !== undefined) p.maybe = px.picks[i].maybe; });
    }
    res.picks = picks; return res;
  }
  function cellQuad(geo, rub, i, k) { var q = geo.cells[rub.criteria[i].srcRow + 1][rub.levels[k].col]; return q; }
  function cellBox(geo, rub, i, k) {
    if (geo.cells) { var q = cellQuad(geo, rub, i, k), xs = q.map(function (p) { return p.x; }), ys = q.map(function (p) { return p.y; }); return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys), quad: q }; }
    var col = rub.levels[k].col, row = rub.criteria[i].srcRow, H = geo.H || 10;
    var x0 = col === 0 ? geo.x0 : geo.colBounds[col - 1], x1 = col >= geo.colBounds.length ? geo.x1 : geo.colBounds[col];
    var y0 = geo.rowStarts[row] - 0.6 * H, y1 = row + 1 < geo.rowStarts.length ? geo.rowStarts[row + 1] - 0.6 * H : geo.lastY;
    return { x0: x0, y0: y0, x1: x1, y1: y1 };
  }
  function pixelMarks(src, parsed) {
    var c = src.canvas, ctx = c.getContext("2d"), rub = parsed.rubric, geo = parsed.geo, items = src.layout.items, H = geo.H || 10, measures = [];
    rub.criteria.forEach(function (cr, i) {
      measures.push(rub.levels.map(function (lv, k) {
        var b = cellBox(geo, rub, i, k), x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.max(0, Math.floor(b.y0)), x1 = Math.min(c.width, Math.ceil(b.x1)), y1 = Math.min(c.height, Math.ceil(b.y1)), w = x1 - x0, h = y1 - y0;
        if (w < 12 || h < 12) return 0;
        var d = ctx.getImageData(x0, y0, w, h).data, mask = new Uint8Array(w * h);
        items.forEach(function (it) { if (it.x + it.w < x0 || it.x > x1 || it.y + it.h < y0 || it.y > y1) return; var a = Math.max(0, Math.floor(it.x - x0 - 2)), bb = Math.min(w, Math.ceil(it.x + it.w - x0 + 2)), cc = Math.max(0, Math.floor(it.y - y0 - 2)), dd = Math.min(h, Math.ceil(it.y + it.h - y0 + 2)); for (var yy = cc; yy < dd; yy++) for (var xx = a; xx < bb; xx++) mask[yy * w + xx] = 1; });
        var edge = Math.max(4, Math.round(H * 0.45)), area = 0, col = 0, dark = 0, q = b.quad, qs = 1;
        if (q) { var cxq = (q[0].x + q[1].x + q[2].x + q[3].x) / 4, cyq = (q[0].y + q[1].y + q[2].y + q[3].y) / 4, e0 = (q[1].x - q[0].x) * (cyq - q[0].y) - (q[1].y - q[0].y) * (cxq - q[0].x); qs = e0 < 0 ? -1 : 1; }
        var inside = function (px, py) { if (!q) return true; for (var n = 0; n < 4; n++) { var A = q[n], B = q[(n + 1) % 4], len = Math.hypot(B.x - A.x, B.y - A.y) || 1; if (qs * ((B.x - A.x) * (py - A.y) - (B.y - A.y) * (px - A.x)) / len < edge) return false; } return true; };
        for (var y = q ? 0 : edge; y < (q ? h : h - edge); y++) for (var x = q ? 0 : edge; x < (q ? w : w - edge); x++) {
          if (q && !inside(x0 + x, y0 + y)) continue;
          var p = (y * w + x) * 4, r = d[p], g = d[p + 1], bl = d[p + 2], mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), sat = mx ? (mx - mn) / mx : 0; area++;
          if (sat > 0.32 && mx > 70) col++; else if (!mask[y * w + x] && mx < 105) dark++;
        }
        return area ? (col * 2.5 + dark) / area : 0;
      }));
    });
    return { picks: E.pickOutliers(measures), measures: measures };
  }

  /* ================================================================= showing the source with boxes */
  function drawSource(box, res, picks) {
    box.innerHTML = ""; if (!res || !res.src || !res.src.canvas) { box.parentNode.hidden = true; return; }
    box.parentNode.hidden = false; var c = res.src.canvas, show = document.createElement("canvas"), s = Math.min(1, 900 / c.width); show.width = Math.round(c.width * s); show.height = Math.round(c.height * s); show.getContext("2d").drawImage(c, 0, 0, show.width, show.height); box.appendChild(show);
    if (!res.geo) return;
    if (res.geo.cells) {
      var NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", "0 0 " + c.width + " " + c.height); svg.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none"; box.appendChild(svg);
      res.rubric.criteria.forEach(function (cr, i) { res.rubric.levels.forEach(function (lv, k) {
        var q = cellQuad(res.geo, res.rubric, i, k), p = picks && picks[i], st = p && p.pick === k ? (p.conf >= 0.6 ? "g" : "a") : p && p.maybe === k ? "a" : "n", pg = document.createElementNS(NS, "polygon");
        pg.setAttribute("points", q.map(function (pt) { return Math.round(pt.x) + "," + Math.round(pt.y); }).join(" ")); pg.setAttribute("fill", st === "g" ? "rgba(31,157,107,.28)" : st === "a" ? "rgba(229,154,0,.25)" : "none"); pg.setAttribute("stroke", st === "g" ? "#1f9d6b" : st === "a" ? "#e59a00" : "rgba(47,91,216,.35)"); pg.setAttribute("stroke-width", st === "n" ? "2" : "6"); svg.appendChild(pg);
      }); }); return;
    }
    res.rubric.criteria.forEach(function (cr, i) { res.rubric.levels.forEach(function (lv, k) {
      var b = cellBox(res.geo, res.rubric, i, k), p = picks && picks[i], st = p && p.pick === k ? (p.conf >= 0.6 ? "g" : "a") : p && p.maybe === k ? "a" : "n", el = document.createElement("div");
      if (st === "n" && !(picks === null)) { /* faint outlines only */ }
      el.className = "bx " + st; el.style.left = (b.x0 / c.width * 100) + "%"; el.style.top = (b.y0 / c.height * 100) + "%"; el.style.width = ((b.x1 - b.x0) / c.width * 100) + "%"; el.style.height = ((b.y1 - b.y0) / c.height * 100) + "%"; box.appendChild(el);
    }); });
  }


  /* ================================================================= helpers */
  function nameFromFile(n) { return n.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim(); }
  function download(blob, name) { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function safeName(s, fallback) { return (String(s || "").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-")) || fallback; }
  function topPts(R) { return Math.max.apply(null, R.levels.map(function (l) { return +l.points || 0; })); }
  /* a Google Doc (table) or a Google Sheet (first tab, or the tab named in the link) */
  function loadLink(link) {
    var sh = link.match(/\/spreadsheets\/d\/([A-Za-z0-9_-]{20,})/);
    if (sh) {
      var gid = (link.match(/[#&?]gid=(\d+)/) || [])[1];
      return fetch("/api/gdoc?kind=sheet&id=" + encodeURIComponent(sh[1]) + (gid ? "&gid=" + gid : "")).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error || "Couldn't read that sheet."); return csvSource(j.csv); });
    }
    var m = link.match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/) || link.match(/^([A-Za-z0-9_-]{25,})$/);
    if (!m) return Promise.reject(new Error("Paste the full link to a Google Doc or Google Sheet (it looks like docs.google.com/document/d/... or docs.google.com/spreadsheets/d/...)."));
    return fetch("/api/gdoc?format=html&id=" + encodeURIComponent(m[1])).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error || "Couldn't read that document."); return tableSource(j.html); });
  }
  /* things worth a second look after a rubric is read */
  function flags(res) {
    var R = res.rubric, out = [], cells = 0, empty = 0;
    R.criteria.forEach(function (c) { c.cells.forEach(function (t) { cells++; if (!String(t || "").trim()) empty++; }); });
    if (R.guessedPoints) out.push("no point values found (I numbered the levels downward)");
    if (R.criteria.length < 2) out.push("only " + R.criteria.length + " row found");
    if (R.levels.length < 3) out.push("only " + R.levels.length + " levels found");
    if (cells && empty / cells > 0.3) out.push("many empty boxes");
    if (R.criteria.some(function (c) { return /^Criterion \d+$/.test(c.name); })) out.push("a row has no name");
    return out;
  }

  /* ================================================================= upload */
  var T = { rubric: null, title: "" };
  var OKFILE = /\.(pdf|png|jpe?g|webp|docx|csv|xlsx?)$/i;
  function pickSupported(files) {
    var ok = files.filter(function (f) { return (OKFILE.test(f.name) || /^image\//.test(f.type)) && !/^(\.|~\$)/.test(f.name); });
    ok.sort(function (x, y) { return x.name.localeCompare(y.name, undefined, { numeric: true, sensitivity: "base" }); });
    return { ok: ok, skipped: files.length - ok.length };
  }
  function walkEntries(entries) {
    var out = [];
    function one(en) {
      return new Promise(function (res) {
        if (en.isFile) en.file(function (f) { out.push(f); res(); }, function () { res(); });
        else if (en.isDirectory) { var rd = en.createReader(), all = []; (function read() { rd.readEntries(function (list) { if (!list.length) Promise.all(all.map(one)).then(function () { res(); }); else { all = all.concat([].slice.call(list)); read(); } }, function () { res(); }); })(); }
        else res();
      });
    }
    return Promise.all(entries.map(one)).then(function () { return out; });
  }
  function wireDrop(dz, input, onFiles) {
    dz.onclick = function () { input.click(); }; dz.onkeydown = function (e) { if (e.key === "Enter") input.click(); };
    input.onchange = function () { if (input.files.length) onFiles([].slice.call(input.files)); input.value = ""; };
    ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("over"); }); });
    dz.addEventListener("drop", function (e) {
      var dt = e.dataTransfer, items = dt.items;
      if (items && items.length && items[0].webkitGetAsEntry) { var entries = [].map.call(items, function (it) { return it.webkitGetAsEntry(); }).filter(Boolean); if (entries.length) { walkEntries(entries).then(function (files) { if (files.length) onFiles(files); }); return; } }
      if (dt.files.length) onFiles([].slice.call(dt.files));
    });
  }
  function handleFiles(files) {
    var pk = pickSupported(files); files = pk.ok;
    if (!files.length) { status($("status"), "I didn't find any photos, PDFs, Word files, Excel files or CSVs there.", "err"); return; }
    $("preview").hidden = true; $("results").hidden = true; $("tplnote").textContent = "";
    if (files.length > 1) return many(files, pk.skipped);
    var f = files[0]; status($("status"), "Reading " + f.name + "..."); progress($("bar"), $("barfill"), 0.05);
    readFile(f, function (p) { progress($("bar"), $("barfill"), 0.1 + p * 0.85); }).then(function (src) {
      var res = analyze(src); progress($("bar"), $("barfill"), null);
      if (res.error) { status($("status"), res.error, "err"); return; }
      showPreview(res, nameFromFile(f.name));
    }).catch(function (e) { progress($("bar"), $("barfill"), null); status($("status"), e.message || String(e), "err"); });
  }
  wireDrop($("drop"), $("file"), handleFiles);
  $("folderBtn").onclick = function () { $("folder").click(); };
  $("folder").onchange = function () { var l = [].slice.call(this.files); this.value = ""; if (l.length) handleFiles(l); };
  $("gdgo").onclick = function () {
    $("preview").hidden = true; $("results").hidden = true; status($("status"), "Loading your link...");
    loadLink($("gdlink").value.trim()).then(function (src) { var res = analyze(src); if (res.error) throw new Error(res.error); showPreview(res, /spreadsheets/.test($("gdlink").value) ? "Google Sheet rubric" : "Google Doc rubric"); }).catch(function (e) { status($("status"), e.message, "err"); });
  };

  /* ================================================================= one rubric: preview + download */
  function showPreview(res, title) {
    T.rubric = JSON.parse(JSON.stringify(res.rubric)); T.title = title || "Rubric"; var fl = flags(res);
    $("ptitle").value = T.title; $("pvwrap").open = fl.length > 0; $("preview").hidden = false;
    status($("status"), "Read it: " + T.rubric.criteria.length + " rows and " + T.rubric.levels.length + " levels." + (fl.length ? " Please check: " + fl.join("; ") + "." : " Download your template below."), fl.length ? "err" : "good");
    $("pvsum").textContent = T.rubric.criteria.length + " rows (" + T.rubric.criteria.map(function (c) { return c.name; }).join(", ").slice(0, 160) + ") and " + T.rubric.levels.length + " levels (" + T.rubric.levels.map(function (l) { return l.name + " " + l.points; }).join(", ") + ").";
    drawPreview(); $("preview").scrollIntoView({ behavior: "smooth" });
  }
  function drawPreview() {
    var R = T.rubric, h = "<tr><th style='width:150px'>Criteria</th>";
    R.levels.forEach(function (l, k) { h += "<th><input class='nm' data-lv='" + k + "' value='" + esc(l.name) + "' placeholder='Level name'> <input class='pt' type='number' step='0.5' data-lp='" + k + "' value='" + esc(l.points) + "' title='points'> <button class='danger sm' data-dl='" + k + "' title='Remove this level'>x</button></th>"; });
    h += "<th></th></tr>";
    R.criteria.forEach(function (c, i) {
      h += "<tr><td><textarea data-cn='" + i + "' style='font-weight:700'>" + esc(c.name) + "</textarea></td>";
      R.levels.forEach(function (l, k) { h += "<td><textarea data-cc='" + i + "," + k + "'>" + esc(c.cells[k] || "") + "</textarea></td>"; });
      h += "<td><button class='danger sm' data-dc='" + i + "' title='Remove this row'>x</button></td></tr>";
    });
    $("pvtable").innerHTML = h;
  }
  $("pvtable").addEventListener("input", function (e) {
    var t = e.target, R = T.rubric, a;
    if ((a = t.getAttribute("data-lv")) !== null) R.levels[+a].name = t.value;
    else if ((a = t.getAttribute("data-lp")) !== null) R.levels[+a].points = parseFloat(t.value) || 0;
    else if ((a = t.getAttribute("data-cn")) !== null) R.criteria[+a].name = t.value;
    else if ((a = t.getAttribute("data-cc")) !== null) { var p = a.split(","); R.criteria[+p[0]].cells[+p[1]] = t.value; }
  });
  $("pvtable").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var R = T.rubric, a;
    if ((a = b.getAttribute("data-dl")) !== null) { if (R.levels.length <= 2) return; R.levels.splice(+a, 1); R.criteria.forEach(function (c) { c.cells.splice(+a, 1); }); }
    else if ((a = b.getAttribute("data-dc")) !== null) { if (R.criteria.length <= 1) return; R.criteria.splice(+a, 1); }
    else return; drawPreview();
  });
  $("addrow").onclick = function () { var R = T.rubric; R.criteria.push({ name: "Criterion " + (R.criteria.length + 1), cells: R.levels.map(function () { return ""; }), max: topPts(R) }); drawPreview(); };
  $("addlvl").onclick = function () { var R = T.rubric, low = Math.min.apply(null, R.levels.map(function (l) { return +l.points || 0; })); R.levels.push({ name: "New level", points: Math.max(0, low - 1) }); R.criteria.forEach(function (c) { c.cells.push(""); }); drawPreview(); };
  $("ptitle").oninput = function () { T.title = this.value; };
  $("tpl").onclick = function () { if (!T.rubric) return; T.rubric.criteria.forEach(function (c) { c.max = topPts(T.rubric); }); makePdf(T.rubric, T.title || "Rubric", "tplnote"); };
  $("tplblank").onclick = function () { makePdf(templateRubric(), "Rubric template", "tplnote0"); };

  /* ================================================================= many rubrics: one ZIP of PDFs */
  function many(files, skipped) {
    if (!window.JSZip) { status($("status"), "The ZIP maker didn't load. Check your connection and try again.", "err"); return; }
    var zip = new JSZip(), used = {}, i = 0, okN = 0, items = [];
    (function next() {
      if (i >= files.length) {
        progress($("bar"), $("barfill"), null); drawResults(items);
        if (!okN) { status($("status"), "I couldn't read any of those files. See the list below.", "err"); return; }
        zip.generateAsync({ type: "blob" }).then(function (blob) {
          download(blob, "rubric-templates.zip");
          status($("status"), "Converted " + okN + " of " + files.length + " rubrics. Your ZIP of template PDFs downloaded." + (skipped ? " (Skipped " + skipped + " other file" + (skipped > 1 ? "s" : "") + ".)" : ""), items.some(function (x) { return !x.ok || x.flags.length; }) ? "err" : "good");
        });
        return;
      }
      var f = files[i++]; status($("status"), "Converting " + f.name + " (" + i + " of " + files.length + ")..."); progress($("bar"), $("barfill"), (i - 1) / files.length);
      readFile(f, function (p) { progress($("bar"), $("barfill"), (i - 1 + p) / files.length); }).then(function (src) {
        var res = analyze(src); if (res.error) { items.push({ name: f.name, ok: false, why: res.error, flags: [] }); return next(); }
        var base = safeName(nameFromFile(f.name), "rubric"), nm = base, n = 2; while (used[nm]) nm = base + "-" + n++; used[nm] = 1;
        var blob = makePdf(res.rubric, nameFromFile(f.name), null, true); if (!blob) { items.push({ name: f.name, ok: false, why: "the PDF maker didn't load", flags: [] }); return next(); }
        zip.file(nm + "-template.pdf", blob); okN++; items.push({ name: f.name, ok: true, rows: res.rubric.criteria.length, levels: res.rubric.levels.length, flags: flags(res) }); next();
      }).catch(function (e) { items.push({ name: f.name, ok: false, why: e.message || String(e), flags: [] }); next(); });
    })();
  }
  function drawResults(items) {
    $("results").hidden = !items.length; var bad = items.filter(function (x) { return !x.ok || x.flags.length; }).length; $("resinfo").textContent = "(" + items.length + " files" + (bad ? ", " + bad + " to check" : "") + ")";
    $("reslist").innerHTML = items.map(function (x) {
      return "<li>" + (x.ok ? "<span class='pill " + (x.flags.length ? "a" : "g") + "'>" + (x.flags.length ? "check" : "ok") + "</span> " : "<span class='pill a'>not read</span> ") + "<b>" + esc(x.name) + "</b> " + (x.ok ? "<span class='small'>" + x.rows + " rows, " + x.levels + " levels" + (x.flags.length ? " &middot; " + esc(x.flags.join("; ")) : "") + "</span>" : "<span class='small'>" + esc(x.why) + "</span>") + "</li>";
    }).join("");
    if (items.length) $("results").scrollIntoView({ behavior: "smooth" });
  }

  /* ================================================================= the template (PDF) */
  function templateRubric() {
    return { levels: [{ name: "Excellent", points: 4 }, { name: "Good", points: 3 }, { name: "Fair", points: 2 }, { name: "Needs work", points: 1 }], criteria: [1, 2, 3, 4].map(function (n) { return { name: "Criterion " + n, max: 4, cells: ["Describe what excellent work looks like.", "Describe what good work looks like.", "Describe what fair work looks like.", "Describe what work that needs improvement looks like."] }; }) };
  }
  function tplHead(R) { return ["Criteria"].concat(R.levels.map(function (l) { return l.name + " (" + l.points + ")"; }), ["Score"]); }
  function tplRows(R) {
    var rows = R.criteria.map(function (c) { return [c.name].concat(R.levels.map(function (l, k) { return c.cells[k] || ""; }), [""]); });
    var max = R.criteria.reduce(function (a, c) { return a + (+c.max || 0); }, 0);
    rows.push(["Total"].concat(R.levels.map(function () { return ""; }), ["/ " + max])); return rows;
  }
  var TPL_HELP = "How to mark this rubric: circle or highlight the box that fits each row (colored pen shows up best), or put an X in it, and write the points in the Score column. Then upload it to the Rubric Grader.";
  function note(msg, where) { var el = $(where || "tplnote"); if (el && msg !== undefined) el.textContent = msg; }
  /* the template as a PDF: criteria down the side, each level (with points) across the top, a Score column and a Total row */
  function makePdf(R, title, noteId, noSave) {
    var J = window.jspdf && window.jspdf.jsPDF; if (!J) { note("The PDF maker didn't load. Check your connection and try again.", noteId); return; }
    var doc = new J({ orientation: "landscape", unit: "pt", format: "letter" }); if (typeof doc.autoTable !== "function") { note("The PDF table maker didn't load. Check your connection and try again.", noteId); return; }
    var W = doc.internal.pageSize.getWidth(), head = tplHead(R), body = tplRows(R), last = head.length - 1;
    doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(title || "Rubric", 40, 48);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text("Student: ______________________________     Date: ______________", 40, 70);
    doc.setFontSize(8.5); doc.setTextColor(90); doc.text(doc.splitTextToSize(TPL_HELP, W - 80), 40, 86); doc.setTextColor(0);
    var cs = { 0: { fontStyle: "bold", cellWidth: 105 } }; cs[last] = { cellWidth: 52, halign: "center" };
    doc.autoTable({ head: [head], body: body, startY: 108, theme: "grid", margin: { left: 40, right: 40, bottom: 40 }, styles: { font: "helvetica", fontSize: 9, cellPadding: 6, lineColor: [0, 0, 0], lineWidth: 0.7, textColor: [0, 0, 0], valign: "top", overflow: "linebreak" }, headStyles: { fillColor: [232, 232, 232], textColor: [0, 0, 0], fontStyle: "bold" }, columnStyles: cs,
      didParseCell: function (d) { if (d.section === "body" && d.row.index === body.length - 1) d.cell.styles.fontStyle = "bold"; else if (d.section === "body") d.cell.styles.minCellHeight = 62; } });
    if (noSave) return doc.output("blob");
    doc.save((title || "Rubric-template").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ".pdf");
    note("Downloaded. Print it to mark by hand, then upload it above.", noteId); return doc;
  }

  window.__rubricApp = { S: S, analyze: analyze, readFile: readFile, makePdf: makePdf, templateRubric: templateRubric, tplHead: tplHead, tplRows: tplRows, loadLink: loadLink, flags: flags, handleFiles: handleFiles, T: T };
})();
