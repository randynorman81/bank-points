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
  function readFile(file, onp) {
    var n = file.name.toLowerCase();
    if (/\.pdf$/.test(n) || file.type === "application/pdf") return pdfSource(file, onp);
    if (/\.docx$/.test(n)) { if (!window.mammoth) return Promise.reject(new Error("The Word reader didn't load.")); return file.arrayBuffer().then(function (b) { return mammoth.convertToHtml({ arrayBuffer: b }); }).then(function (r) { return tableSource(r.value); }); }
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
  function pts(i, k) { return E.levelPoints(S.rubric, i, k); }
  function nameFromFile(n) { return n.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim(); }
  function junkName(n) { return !n || /^(img|dsc|image|photo|scan|screenshot|document|doc|untitled|rubric|copy|pxl|whatsapp)\b/i.test(n) || /\d{4,}/.test(n) || /^student \d+$/i.test(n); }
  function fname(ext) { return (S.title || "rubric-grades").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ext; }
  function download(blob, name) { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  function isDocLink(v) { return v.match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/) || v.match(/^([A-Za-z0-9_-]{25,})$/); }
  function loadGoogleDoc(link) {
    var m = isDocLink(link); if (!m) return Promise.reject(new Error("Paste the full link to a Google Doc (it looks like docs.google.com/document/d/...)."));
    return fetch("/api/gdoc?format=html&id=" + encodeURIComponent(m[1])).then(function (r) { return r.json(); }).then(function (j) { if (!j.ok) throw new Error(j.error || "Couldn't read that document."); return tableSource(j.html); });
  }

  /* ================================================================= step 1: upload graded rubrics */
  var copies = [];
  function buildCopy(res, name) {
    var R = S.rubric, n = Math.min(R.criteria.length, res.rubric.criteria.length), cp = { id: "c" + Date.now() + Math.random().toString(36).slice(2, 6), name: name, res: res, picks: [], note: "" };
    if (res.rubric.criteria.length !== R.criteria.length) cp.note = "This copy has " + res.rubric.criteria.length + " rows but the first rubric had " + R.criteria.length + ". I matched them in order. Please check.";
    else if (res.rubric.levels.length !== R.levels.length) cp.note = "This copy has " + res.rubric.levels.length + " levels but the first rubric had " + R.levels.length + ". I matched them in order. Please check.";
    for (var i = 0; i < R.criteria.length; i++) {
      var p = i < n ? res.picks[i] : { pick: -1, conf: 0, score: null }, k = p.pick >= 0 && p.pick < R.levels.length ? p.pick : -1;
      cp.picks.push({ pick: k, conf: p.conf || 0, why: p.why || "", score: p.score, points: p.score !== null && p.score !== undefined ? p.score : (k >= 0 ? pts(i, k) : ""), maybe: p.maybe });
    }
    return cp;
  }
  function unsure(cp) { return cp.picks.filter(function (p) { return p.pick < 0 && (p.points === "" || p.points === null || p.points === undefined); }).length; }
  function toStudent(cp) { return { id: "s" + Date.now() + Math.random().toString(36).slice(2, 6), name: (cp.name || "").trim(), date: new Date().toLocaleDateString(), grades: cp.picks.map(function (p) { return { pick: p.pick, points: p.points, comment: "" }; }), comment: "" }; }
  function ingest(res, name) {
    if (!S.rubric) { S.rubric = res.rubric; }
    var cp = buildCopy(res, name);
    if (!unsure(cp) && !cp.note && !junkName(name)) S.students.push(toStudent(cp)); else copies.push(cp);
  }
  function runFiles(files) {
    var i = 0, bad = [], okN = 0;
    (function next() {
      if (i >= files.length) {
        progress($("bar"), $("barfill"), null); save(); drawAll();
        status($("status"), (okN ? "Read " + okN + " rubric" + (okN > 1 ? "s" : "") + ". " : "") + (bad.length ? "Couldn't read: " + bad.join("; ") : "") + (copies.length ? " Check the ones listed below." : ""), bad.length && !okN ? "err" : "good"); return;
      }
      var f = files[i++]; status($("status"), "Reading " + f.name + " (" + i + " of " + files.length + ")..."); progress($("bar"), $("barfill"), (i - 1) / files.length);
      readFile(f, function (p) { progress($("bar"), $("barfill"), (i - 1 + p) / files.length); }).then(function (src) {
        var res = analyze(src); if (res.error) { bad.push(f.name + " (" + res.error + ")"); return next(); }
        ingest(res, nameFromFile(f.name)); okN++; next();
      }).catch(function (e) { bad.push(f.name + " (" + (e.message || e) + ")"); next(); });
    })();
  }
  var drop = $("drop"), fileIn = $("file");
  function wireDrop(dz, input, onFiles) {
    dz.onclick = function () { input.click(); }; dz.onkeydown = function (e) { if (e.key === "Enter") input.click(); };
    input.onchange = function () { if (input.files.length) onFiles([].slice.call(input.files)); input.value = ""; };
    ["dragover", "dragenter"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove("over"); }); });
    dz.addEventListener("drop", function (e) { if (e.dataTransfer.files.length) onFiles([].slice.call(e.dataTransfer.files)); });
  }
  wireDrop(drop, fileIn, runFiles);
  $("gdgo").onclick = function () {
    var link = $("gdlink").value.trim(), nm = $("gdname").value.trim(); status($("status"), "Loading the Google Doc...");
    loadGoogleDoc(link).then(function (src) { var res = analyze(src); if (res.error) throw new Error(res.error); ingest(res, nm || "Student (Google Doc)"); $("gdlink").value = ""; $("gdname").value = ""; save(); drawAll(); status($("status"), "Read the Google Doc.", "good"); }).catch(function (e) { status($("status"), e.message, "err"); });
  };
  $("title").oninput = function () { S.title = this.value; save(); };
  $("reset").onclick = function () { if ((S.students.length || copies.length || S.rubric) && !confirm("Clear the rubric and all students and start over?")) return; S.rubric = null; S.students = []; copies = []; S.title = ""; $("title").value = ""; save(); status($("status"), ""); drawAll(); };

  /* ---------------- review cards (only for rows or names I'm unsure about) */
  function drawCopies() {
    var R = S.rubric; $("sreview").hidden = !copies.length; $("revinfo").textContent = copies.length ? "(" + copies.length + ")" : ""; if (!copies.length) { $("copies").innerHTML = ""; return; }
    $("copies").innerHTML = copies.map(function (cp) {
      var t = E.totals(R, cp.picks.map(function (p) { return { points: p.points }; })), un = unsure(cp);
      var h = "<div class='copycard'><div class='row'><input data-cpn='" + cp.id + "' value='" + esc(cp.name) + "' placeholder='Student name' style='width:220px;font-weight:700'><span class='pill " + (un ? "a" : "g") + "'>" + (un ? un + " row(s) need you" : (junkName(cp.name) ? "type the student's name" : "all rows read")) + "</span><b>" + t.got + " / " + t.max + " (" + t.pct + "%)</b><span style='flex:1'></span><button class='ok sm' data-cpadd='" + cp.id + "'>Add to class data</button><button class='danger sm' data-cpdel='" + cp.id + "'>Remove</button></div>";
      if (cp.note) h += "<div class='msg err'>" + esc(cp.note) + "</div>";
      h += "<div class='two' style='margin-top:8px'><div>" + R.criteria.map(function (c, i) {
        var p = cp.picks[i]; return "<div class='crit' style='margin:6px 0;padding:6px 8px'><div class='row'><b style='min-width:120px'>" + esc(c.name) + "</b>" + R.levels.map(function (l, k) { return "<button class='lv" + (p.pick === k ? " on" : "") + (p.maybe === k && p.pick < 0 ? " sug" : "") + "' data-cpl='" + cp.id + "," + i + "," + k + "'>" + esc(l.name) + "</button>"; }).join("") + "<input type='number' step='0.5' style='width:62px' data-cpp='" + cp.id + "," + i + "' value='" + esc(p.points) + "'><span class='small'>/ " + esc(c.max) + "</span>" + (p.pick >= 0 && p.why ? "<span class='pill " + (p.conf >= 0.6 ? "g" : "a") + "'>" + esc(p.why) + "</span>" : "") + "</div></div>";
      }).join("") + "</div>" + (cp.res ? "<div class='srcwrap' data-cpimg='" + cp.id + "'></div>" : "") + "</div></div>"; return h;
    }).join("");
    copies.forEach(function (cp) { var box = document.querySelector("[data-cpimg='" + cp.id + "']"); if (!box) return; if (cp.res && cp.res.src && cp.res.src.canvas) { var picks = cp.picks.map(function (p) { return { pick: p.pick, conf: p.conf, maybe: p.maybe }; }), holder = document.createElement("div"); box.appendChild(holder); drawSource(holder, { src: cp.res.src, geo: cp.res.geo, rubric: cp.res.rubric }, picks); holder.parentNode.hidden = false; } else box.parentNode.removeChild(box); });
  }
  function findCopy(id) { return copies.filter(function (c) { return c.id === id; })[0]; }
  $("copies").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var a = b.getAttribute("data-cpl");
    if (a !== null) { var p = a.split(","), cp = findCopy(p[0]), pk = cp.picks[+p[1]], k = +p[2]; if (pk.pick === k) { pk.pick = -1; pk.points = ""; } else { pk.pick = k; pk.points = pts(+p[1], k); pk.conf = 1; pk.why = "you picked it"; pk.score = null; pk.maybe = undefined; } drawCopies(); return; }
    a = b.getAttribute("data-cpdel"); if (a !== null) { copies = copies.filter(function (c) { return c.id !== a; }); drawAll(); return; }
    a = b.getAttribute("data-cpadd"); if (a !== null) { var c2 = findCopy(a); if (!(c2.name || "").trim()) return status($("status"), "Type the student's name first.", "err"); S.students.push(toStudent(c2)); copies = copies.filter(function (c) { return c.id !== a; }); save(); drawAll(); }
  });
  $("copies").addEventListener("input", function (e) {
    var t = e.target, a; if ((a = t.getAttribute("data-cpn")) !== null) findCopy(a).name = t.value;
    else if ((a = t.getAttribute("data-cpp")) !== null) { var p = a.split(","); findCopy(p[0]).picks[+p[1]].points = t.value === "" ? "" : parseFloat(t.value); }
  });
  $("addall").onclick = function () { var left = []; copies.forEach(function (cp) { if ((cp.name || "").trim()) S.students.push(toStudent(cp)); else left.push(cp); }); copies = left; save(); drawAll(); if (left.length) status($("status"), "Type a name for the ones still listed, then add them.", "err"); };

  /* ================================================================= step 2: class data */
  var LCOL = ["#1f9d6b", "#7bc043", "#e6b422", "#e07a1f", "#c0392b", "#8e44ad", "#5d6678"];
  function levelColor(rank, total) { return LCOL[Math.min(LCOL.length - 1, Math.round(rank * (LCOL.length - 2) / Math.max(1, total - 1)))]; }
  function drawAnalytics() {
    var R = S.rubric, A = E.analytics(R, S.students); if (!A) { $("analytics").innerHTML = ""; return; }
    var order = R.levels.map(function (l, k) { return k; }).sort(function (a, b) { return R.levels[b].points - R.levels[a].points; }), rank = {}; order.forEach(function (k, r) { rank[k] = r; });
    var h = "<div class='tiles'><div class='tile'><b>" + A.n + "</b><span>students</span></div><div class='tile'><b>" + A.avg + "%</b><span>class average (" + E.letter(A.avg) + ")</span></div><div class='tile'><b>" + A.median + "%</b><span>median</span></div><div class='tile'><b>" + A.high + "%</b><span>highest</span></div><div class='tile'><b>" + A.low + "%</b><span>lowest</span></div><div class='tile'><b>" + A.below.length + "</b><span>below 70%</span></div></div>";
    h += "<h3 class='sec'>What stands out</h3><ul class='ins'>" + A.insights.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
    h += "<h3 class='sec'>How each row went</h3><div class='legend'>" + order.map(function (k) { return "<span><i style='background:" + levelColor(rank[k], R.levels.length) + "'></i>" + esc(R.levels[k].name) + "</span>"; }).join("") + "</div>";
    A.criteria.forEach(function (c) {
      var tot = c.levels.reduce(function (a, b) { return a + b; }, 0) + c.other;
      h += "<div class='hb'><span class='lab' title='" + esc(c.name) + "'>" + esc(c.name) + "</span><span class='trk'>" + order.map(function (k) { var n = c.levels[k]; return n ? "<i style='width:" + (n / Math.max(1, tot) * 100) + "%;background:" + levelColor(rank[k], R.levels.length) + "' title='" + esc(R.levels[k].name) + ": " + n + "'></i>" : ""; }).join("") + (c.other ? "<i style='width:" + (c.other / Math.max(1, tot) * 100) + "%;background:#999' title='other scores: " + c.other + "'></i>" : "") + "</span><span class='val'>avg " + c.avg + " / " + c.max + " (" + c.pct + "%)</span></div>";
    });
    h += "<h3 class='sec'>Letter grades</h3>";
    ["A", "B", "C", "D", "F"].forEach(function (L) { var n = A.letters[L]; h += "<div class='hb'><span class='lab'>" + L + "</span><span class='trk'><i style='width:" + (n / A.n * 100) + "%;background:var(--acc)'></i></span><span class='val'>" + n + " student" + (n === 1 ? "" : "s") + "</span></div>"; });
    $("analytics").innerHTML = h;
  }
  function drawSheet() {
    var R = S.rubric, rows = E.sheetRows(R, S.students, S.title, S.scale);
    $("shinfo").textContent = S.students.length ? "(" + S.students.length + " student" + (S.students.length > 1 ? "s" : "") + ")" : "";
    var h = "<table><tr>" + rows[0].map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "<th></th></tr>";
    for (var i = 1; i < rows.length; i++) h += "<tr>" + rows[i].map(function (c, j) { return j === 0 ? "<td><input class='nm' data-nm='" + (i - 1) + "' value='" + esc(c) + "'></td>" : "<td" + (j === rows[0].length - 1 ? " style='white-space:normal;min-width:200px'" : "") + ">" + esc(c) + "</td>"; }).join("") + "<td><button class='ghost sm' data-ed='" + (i - 1) + "'>Edit</button> <button class='danger sm' data-rm='" + (i - 1) + "'>x</button></td></tr>";
    $("sheet").innerHTML = h + "</table>";
  }
  function drawAll() {
    $("title").value = S.title || ""; drawCopies(); var has = !!(S.rubric && S.students.length); $("s2").hidden = !has; if (has) { drawAnalytics(); drawSheet(); }
  }
  $("sheet").addEventListener("change", function (e) { var a = e.target.getAttribute("data-nm"); if (a !== null) { S.students[+a].name = e.target.value.trim(); save(); drawAll(); } });
  $("sheet").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var a = b.getAttribute("data-rm");
    if (a !== null) { var s = S.students[+a]; if (confirm("Remove " + s.name + " from the class data?")) { S.students.splice(+a, 1); save(); drawAll(); } return; }
    a = b.getAttribute("data-ed"); if (a !== null) { var st = S.students.splice(+a, 1)[0]; copies.push({ id: "c" + Date.now(), name: st.name, res: null, note: "", picks: st.grades.map(function (g) { return { pick: g.pick, conf: 1, why: "", score: null, points: g.points }; }) }); save(); drawAll(); $("sreview").scrollIntoView({ behavior: "smooth" }); }
  });
  $("csv").onclick = function () { download(new Blob(["﻿" + E.toCSV(E.sheetRows(S.rubric, S.students, S.title, S.scale))], { type: "text/csv" }), fname(".csv")); };
  $("xlsx").onclick = function () {
    if (!window.XLSX) return alert("The Excel maker didn't load. Use the CSV button instead.");
    var rows = E.sheetRows(S.rubric, S.students, S.title, S.scale), ws = XLSX.utils.aoa_to_sheet(rows), wb = XLSX.utils.book_new(); ws["!cols"] = rows[0].map(function (c, i) { return { wch: i === 0 ? 22 : i === rows[0].length - 1 ? 50 : Math.max(8, Math.min(22, String(c).length + 2)) }; });
    XLSX.utils.book_append_sheet(wb, ws, "Grades"); XLSX.writeFile(wb, fname(".xlsx"));
  };
  $("copy").onclick = function () { var tsv = E.toTSV(E.sheetRows(S.rubric, S.students, S.title, S.scale)); (navigator.clipboard ? navigator.clipboard.writeText(tsv) : Promise.reject()).then(function () { $("copy").textContent = "Copied! Paste into Google Sheets"; setTimeout(function () { $("copy").textContent = "Copy for Google Sheets"; }, 2500); }).catch(function () { prompt("Copy this (Ctrl+C), then paste into Google Sheets:", tsv); }); };
  function syncScale() { var sel = $("scale"), v = String(S.scale || 0); if (![].some.call(sel.options, function (o) { return o.value === v; })) { var o = document.createElement("option"); o.value = v; o.textContent = v + " points"; sel.insertBefore(o, sel.lastChild); } sel.value = v; }
  $("scale").onchange = function () { var v = this.value; if (v === "custom") { var n = parseFloat(prompt("Scale each score to be out of how many points?", "100")); if (!(n > 0)) { syncScale(); return; } S.scale = n; } else S.scale = +v; save(); syncScale(); drawAll(); };

  /* ================================================================= step 3: the template */

  function templateRubric() {
    return { levels: [{ name: "Excellent", points: 4 }, { name: "Good", points: 3 }, { name: "Fair", points: 2 }, { name: "Needs work", points: 1 }], criteria: [1, 2, 3, 4].map(function (n) { return { name: "Criterion " + n, max: 4, cells: ["Describe what excellent work looks like.", "Describe what good work looks like.", "Describe what fair work looks like.", "Describe what work that needs improvement looks like."] }; }) };
  }
  function tplHead(R) { return ["Criteria"].concat(R.levels.map(function (l) { return l.name + " (" + l.points + ")"; }), ["Score"]); }
  function tplRows(R) {
    var rows = R.criteria.map(function (c) { return [c.name].concat(R.levels.map(function (l, k) { return c.cells[k] || ""; }), [""]); });
    var max = R.criteria.reduce(function (a, c) { return a + (+c.max || 0); }, 0);
    rows.push(["Total"].concat(R.levels.map(function () { return ""; }), ["/ " + max])); return rows;
  }
  var TPL_HELP = "How to grade with this page: put an X in the box that matches each row (or highlight the box), and type the points in the Score column. Keep the table layout so the Rubric Grader can read it.";
  function tplHTML(R, title) {
    var cell = "border:1px solid #000;padding:6px;vertical-align:top;font-family:Arial,sans-serif;font-size:10pt";
    var h = "<h2 style='font-family:Arial,sans-serif'>" + esc(title || "Rubric") + "</h2><p style='font-family:Arial,sans-serif;font-size:10pt'>Student: ______________________ &nbsp; Date: ____________</p><p style='font-family:Arial,sans-serif;font-size:9pt;color:#555'>" + esc(TPL_HELP) + "</p><table style='border-collapse:collapse;width:100%'><tr>";
    tplHead(R).forEach(function (t) { h += "<th style='" + cell + ";background:#e8e8e8;text-align:left'>" + esc(t) + "</th>"; }); h += "</tr>";
    tplRows(R).forEach(function (r, i, all) { h += "<tr>"; r.forEach(function (t, j) { h += "<td style='" + cell + (j === 0 || i === all.length - 1 ? ";font-weight:bold" : "") + "'>" + esc(t) + "</td>"; }); h += "</tr>"; });
    return h + "</table>";
  }
  function tplBlob(R, title) {
    var d = window.docx; if (!d) return Promise.resolve({ blob: new Blob(["<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><meta charset='utf-8'></head><body>" + tplHTML(R, title) + "</body></html>"], { type: "application/msword" }), ext: ".doc" });
    var head = tplHead(R), rows = tplRows(R), n = head.length, total = 12960, first = 1900, score = 900, mid = Math.floor((total - first - score) / (n - 2)), widths = [first].concat(R.levels.map(function () { return mid; }), [score]);
    var line = { style: d.BorderStyle.SINGLE, size: 4, color: "000000" }, borders = { top: line, bottom: line, left: line, right: line };
    function cell(t, w, bold, shade) { return new d.TableCell({ width: { size: w, type: d.WidthType.DXA }, borders: borders, shading: shade ? { fill: "E8E8E8", type: d.ShadingType.CLEAR, color: "auto" } : undefined, margins: { top: 60, bottom: 60, left: 90, right: 90 }, children: [new d.Paragraph({ children: [new d.TextRun({ text: t, bold: !!bold, size: 20, font: "Arial" })] })] }); }
    var trs = [new d.TableRow({ tableHeader: true, children: head.map(function (t, i) { return cell(t, widths[i], true, true); }) })].concat(rows.map(function (r, ri) { return new d.TableRow({ cantSplit: true, children: r.map(function (t, i) { return cell(t, widths[i], i === 0 || ri === rows.length - 1, false); }) }); }));
    var doc = new d.Document({ sections: [{ properties: { page: { size: { orientation: d.PageOrientation.LANDSCAPE } } }, children: [
      new d.Paragraph({ heading: d.HeadingLevel.HEADING_1, children: [new d.TextRun({ text: title || "Rubric", font: "Arial" })] }),
      new d.Paragraph({ children: [new d.TextRun({ text: "Student: ______________________     Date: ____________", font: "Arial", size: 20 })] }),
      new d.Paragraph({ spacing: { after: 120 }, children: [new d.TextRun({ text: TPL_HELP, font: "Arial", size: 18, color: "555555" })] }),
      new d.Table({ width: { size: total, type: d.WidthType.DXA }, columnWidths: widths, rows: trs })] }] });
    return d.Packer.toBlob(doc).then(function (b) { return { blob: b, ext: ".docx" }; });
  }
  var T = { rubric: null, title: "" };
  function giveTemplate(R, title) {
    tplBlob(R, title).then(function (o) { download(o.blob, (title || "Rubric-template").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + o.ext); $("tplnote").textContent = "Downloaded. In Google Drive: upload it, then right-click it and choose Open with > Google Docs."; });
  }
  function templateFromRes(res, label) {
    T.rubric = res.rubric; T.title = label || "Rubric"; $("tplresult").hidden = false;
    status($("statusT"), "Rebuilt \"" + T.title + "\" in the template: " + res.rubric.criteria.length + " criteria and " + res.rubric.levels.length + " levels." + (res.rubric.guessedPoints ? " (I could not find point values, so I numbered the levels downward.)" : ""), "good");
    $("tplnote").textContent = "";
  }
  function convertFiles(files) {
    var f = files[0]; $("tplresult").hidden = true; status($("statusT"), "Reading " + f.name + "..."); progress($("barT"), $("barfillT"), 0.05);
    readFile(f, function (p) { progress($("barT"), $("barfillT"), 0.1 + p * 0.85); }).then(function (src) {
      var res = analyze(src); progress($("barT"), $("barfillT"), null); if (res.error) { status($("statusT"), res.error, "err"); return; } templateFromRes(res, nameFromFile(f.name));
    }).catch(function (e) { progress($("barT"), $("barfillT"), null); status($("statusT"), e.message || String(e), "err"); });
  }
  wireDrop($("dropT"), $("fileT"), convertFiles);
  $("gdgoT").onclick = function () { status($("statusT"), "Loading the Google Doc..."); $("tplresult").hidden = true; loadGoogleDoc($("gdlinkT").value.trim()).then(function (src) { var res = analyze(src); if (res.error) throw new Error(res.error); templateFromRes(res, "Google Doc rubric"); }).catch(function (e) { status($("statusT"), e.message, "err"); }); };
  $("tpl").onclick = function () { if (T.rubric) giveTemplate(T.rubric, T.title); };
  $("tplblank").onclick = function () { giveTemplate(templateRubric(), "Rubric template"); };
  $("tplcopy").onclick = function () {
    if (!T.rubric) return; var html = tplHTML(T.rubric, T.title), text = E.toTSV([tplHead(T.rubric)].concat(tplRows(T.rubric)));
    var done = function () { $("tplnote").textContent = "Copied. Open a new Google Doc (docs.new) and press Ctrl+V to paste the table."; };
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([text], { type: "text/plain" }) })]).then(done).catch(function () { $("tplnote").textContent = "Your browser blocked copying. Use the Word download instead."; });
    else $("tplnote").textContent = "Your browser can't copy a table. Use the Word download instead.";
  };

  syncScale(); drawAll();
  window.__rubricApp = { S: S, analyze: analyze, readFile: readFile, ingest: ingest, runFiles: runFiles, tplHTML: tplHTML, tplBlob: tplBlob, templateRubric: templateRubric, tableSource: tableSource, copies: function () { return copies; } };
})();
