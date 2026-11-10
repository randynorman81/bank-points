(function () {
  "use strict";
  var E = RubricEngine, $ = function (id) { return document.getElementById(id); };
  var KEY = "rubricGrader:v1", DEFAULT_BANK = ["Great work!", "Needs more detail.", "Check your spelling and grammar.", "Good start. Explain your thinking more.", "Missing this part.", "Excellent, keep it up."];
  var S = { title: "", rubric: null, students: [], bank: DEFAULT_BANK.slice(), roster: [], grades: [], comment: "", editId: null };
  var SRC = null; /* the uploaded rubric: { canvas, parsed (rubric+geo), marks } */
  try { var sv = JSON.parse(localStorage.getItem(KEY) || "null"); if (sv && sv.rubric) { S.title = sv.title || ""; S.rubric = sv.rubric; S.students = sv.students || []; S.bank = sv.bank && sv.bank.length ? sv.bank : S.bank; S.roster = sv.roster || []; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ title: S.title, rubric: S.rubric, students: S.students, bank: S.bank, roster: S.roster })); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function status(el, text, kind) { el.hidden = !text; el.textContent = text || ""; el.className = "msg" + (kind ? " " + kind : ""); }
  function progress(bar, fill, p) { bar.hidden = p === null; if (p !== null) fill.style.width = Math.round(p * 100) + "%"; }

  /* ================================================================= reading files */
  if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  function loadImage(file) { return new Promise(function (res, rej) { var u = URL.createObjectURL(file), im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { rej(new Error("I couldn't open that image. Try a JPG or PNG (iPhone HEIC photos may need to be saved as JPG first).")); }; im.src = u; }); }
  var ocrWorker = null;
  function ocr(canvas, onp) {
    if (!window.Tesseract) return Promise.reject(new Error("The photo reader didn't load. Check your connection, or upload a PDF instead."));
    return Tesseract.recognize(canvas, "eng", { logger: function (m) { if (m.status === "recognizing text" && onp) onp(m.progress); } }).then(function (r) {
      var words = r.data.words || []; if (!words.length && r.data.blocks) r.data.blocks.forEach(function (b) { (b.paragraphs || []).forEach(function (p) { (p.lines || []).forEach(function (l) { words = words.concat(l.words || []); }); }); });
      return words.filter(function (w) { return w.text && w.text.trim() && w.confidence > 25; }).map(function (w) { return { s: w.text, x: w.bbox.x0, y: w.bbox.y0, w: w.bbox.x1 - w.bbox.x0, h: w.bbox.y1 - w.bbox.y0 }; });
    });
  }
  function imageSource(file, onp) {
    return loadImage(file).then(function (im) {
      var sc = Math.min(1, 2200 / im.naturalWidth), c = document.createElement("canvas"); c.width = Math.round(im.naturalWidth * sc); c.height = Math.round(im.naturalHeight * sc); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      return ocr(c, onp).then(function (items) { return { kind: "layout", canvas: c, layout: { items: items } }; });
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
        return ocr(big, onp).then(function (its) { return { kind: "layout", canvas: big, layout: { items: its } }; });
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
    else { var g = E.gridFromLayout(src.layout); if (g.error) return { error: g.error }; grid = g.grid; parsed = E.rubricFromGrid(grid, g.geo); if (parsed.geo) parsed.geo.H = g.H; }
    if (parsed.error) return { error: parsed.error };
    var res = { rubric: parsed.rubric, geo: parsed.geo, grid: grid, src: src }, typed = E.typedMarks(parsed.rubric, grid, bgs), picks = typed.map(function (t) { return { pick: t.pick, conf: t.pick >= 0 ? 1 : 0, why: t.why, score: t.score }; });
    if (src.kind === "layout" && src.canvas && parsed.geo) {
      var px = pixelMarks(src, parsed);
      picks.forEach(function (p, i) { if (p.pick < 0 && px.picks[i].pick >= 0) { p.pick = px.picks[i].pick; p.conf = px.picks[i].conf; p.why = "a pen or highlighter mark"; } else if (p.pick < 0 && px.picks[i].maybe >= 0 && px.picks[i].maybe !== undefined) p.maybe = px.picks[i].maybe; });
    }
    res.picks = picks; return res;
  }
  function cellBox(geo, rub, i, k) {
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
        var edge = Math.max(4, Math.round(H * 0.45)), area = 0, col = 0, dark = 0;
        for (var y = edge; y < h - edge; y++) for (var x = edge; x < w - edge; x++) {
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
    res.rubric.criteria.forEach(function (cr, i) { res.rubric.levels.forEach(function (lv, k) {
      var b = cellBox(res.geo, res.rubric, i, k), p = picks && picks[i], st = p && p.pick === k ? (p.conf >= 0.6 ? "g" : "a") : p && p.maybe === k ? "a" : "n", el = document.createElement("div");
      if (st === "n" && !(picks === null)) { /* faint outlines only */ }
      el.className = "bx " + st; el.style.left = (b.x0 / c.width * 100) + "%"; el.style.top = (b.y0 / c.height * 100) + "%"; el.style.width = ((b.x1 - b.x0) / c.width * 100) + "%"; el.style.height = ((b.y1 - b.y0) / c.height * 100) + "%"; box.appendChild(el);
    }); });
  }

  /* ================================================================= step 1: loading */
  function setRubric(res, nameGuess) {
    S.rubric = res.rubric; S.title = S.title || nameGuess || ""; SRC = res; S.grades = []; S.comment = ""; save(); showAll(); drawSource($("srcbox"), res, res.picks);
    var found = res.picks.filter(function (p) { return p.pick >= 0 || p.score !== null; }).length, m = $("markmsg");
    if (found >= Math.max(1, Math.ceil(res.picks.length / 2))) {
      m.hidden = false; m.className = "msg good"; m.innerHTML = "<b>This rubric already has marks on it.</b> I found marks on " + found + " of " + res.picks.length + " rows. <button class='sm' id='usemarks'>Use them as a graded copy</button> <span class='small'>(you can fix any row before saving)</span>";
      $("usemarks").onclick = function () { addCopyCard(res, $("title").value ? $("title").value + " (student)" : "Student 1", true); S.tab = 2; setTab(2); $("s3").scrollIntoView({ behavior: "smooth" }); };
    } else { m.hidden = true; }
    if (res.rubric.guessedPoints) { $("ptsnote").textContent = "I couldn't find point values in the header, so I numbered the levels downward. Please check the points."; } else $("ptsnote").textContent = "";
  }
  function handle(file) {
    status($("status"), "Reading " + file.name + "..."); progress($("bar"), $("barfill"), 0.05);
    readFile(file, function (p) { progress($("bar"), $("barfill"), 0.1 + p * 0.85); status($("status"), "Reading the text in your photo... " + Math.round(p * 100) + "%"); }).then(function (src) {
      var res = analyze(src); progress($("bar"), $("barfill"), null);
      if (res.error) { status($("status"), res.error + " You can also build the rubric by hand: click \"Build one from scratch\".", "err"); return; }
      status($("status"), "Found a rubric with " + res.rubric.criteria.length + " criteria and " + res.rubric.levels.length + " levels. Check it below.", "good"); setRubric(res, file.name.replace(/\.[^.]+$/, ""));
      $("s2").scrollIntoView({ behavior: "smooth" });
    }).catch(function (e) { progress($("bar"), $("barfill"), null); status($("status"), e.message || String(e), "err"); });
  }
  var drop = $("drop"), fileIn = $("file");
  drop.onclick = function () { fileIn.click(); }; drop.onkeydown = function (e) { if (e.key === "Enter") fileIn.click(); };
  fileIn.onchange = function () { if (fileIn.files[0]) handle(fileIn.files[0]); fileIn.value = ""; };
  ["dragover", "dragenter"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { var f = e.dataTransfer.files[0]; if (f) handle(f); });
  $("gdgo").onclick = function () {
    var v = $("gdlink").value.trim(), m = v.match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/) || v.match(/^([A-Za-z0-9_-]{25,})$/);
    if (!m) return status($("status"), "Paste the full link to a Google Doc (it looks like docs.google.com/document/d/...).", "err");
    status($("status"), "Loading the Google Doc..."); fetch("/api/gdoc?format=html&id=" + encodeURIComponent(m[1])).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok) throw new Error(j.error || "Couldn't read that document."); return tableSource(j.html);
    }).then(function (src) { var res = analyze(src); if (res.error) throw new Error(res.error); status($("status"), "Found a rubric in your Google Doc. Check it below.", "good"); setRubric(res, "Google Doc rubric"); $("s2").scrollIntoView({ behavior: "smooth" }); }).catch(function (e) { status($("status"), e.message, "err"); });
  };
  function emptyRubric() { return { title: "", levels: [{ name: "Excellent", points: 4 }, { name: "Good", points: 3 }, { name: "Fair", points: 2 }, { name: "Poor", points: 1 }], criteria: [{ name: "Criterion 1", cells: ["", "", "", ""], max: 4 }] }; }
  $("blank").onclick = function () { S.rubric = emptyRubric(); S.grades = []; SRC = null; save(); showAll(); drawSource($("srcbox"), null); $("markmsg").hidden = true; $("s2").scrollIntoView({ behavior: "smooth" }); };
  $("sample").onclick = function () {
    S.rubric = { title: "", levels: [{ name: "Excellent", points: 4 }, { name: "Good", points: 3 }, { name: "Fair", points: 2 }, { name: "Needs work", points: 1 }], criteria: [
      { name: "Thesis", max: 4, cells: ["Clear, arguable thesis at the end of the introduction.", "Clear thesis, not very arguable.", "Thesis is vague.", "No thesis."] },
      { name: "Evidence", max: 4, cells: ["Three or more relevant quotes, explained.", "Two relevant quotes with some explanation.", "One quote with little explanation.", "No evidence."] },
      { name: "Organization", max: 4, cells: ["Logical order with strong transitions.", "Mostly logical, a few weak transitions.", "Order is confusing at times.", "No clear order."] },
      { name: "Conventions", max: 4, cells: ["Almost no errors.", "A few small errors.", "Many errors that slow the reader.", "Errors block meaning."] }] };
    S.title = "Sample essay"; S.grades = []; SRC = null; save(); showAll(); drawSource($("srcbox"), null); $("markmsg").hidden = true; $("s2").scrollIntoView({ behavior: "smooth" });
  };

  /* ================================================================= step 2: edit the rubric */
  function showAll() { $("s2").hidden = !S.rubric; $("s3").hidden = !S.rubric; $("s4").hidden = !S.rubric; if (!S.rubric) return; $("title").value = S.title; drawEditor(); drawGrader(); drawSheet(); $("roster").value = S.roster.join("\n"); drawRoster(); }
  function topPts() { return Math.max.apply(null, S.rubric.levels.map(function (l) { return +l.points || 0; })); }
  function drawEditor() {
    var R = S.rubric, h = "<tr><th style='width:150px'>Criteria</th>";
    R.levels.forEach(function (l, k) { h += "<th><input class='nm' data-lv='" + k + "' value='" + esc(l.name) + "' placeholder='Level name'> <input class='pt' type='number' step='0.5' data-lp='" + k + "' value='" + esc(l.points) + "' title='points'> <button class='danger sm' data-dl='" + k + "' title='Remove this level'>x</button></th>"; });
    h += "<th style='width:70px'>Max pts</th><th></th></tr>";
    R.criteria.forEach(function (c, i) {
      h += "<tr><td><textarea data-cn='" + i + "' style='font-weight:700'>" + esc(c.name) + "</textarea></td>";
      R.levels.forEach(function (l, k) { h += "<td><textarea data-cc='" + i + "," + k + "'>" + esc(c.cells[k] || "") + "</textarea></td>"; });
      h += "<td><input class='pt' type='number' step='0.5' data-cm='" + i + "' value='" + esc(c.max) + "'></td><td><button class='danger sm' data-dc='" + i + "' title='Remove this row'>x</button></td></tr>";
    });
    $("rbtable").innerHTML = h;
  }
  $("rbtable").addEventListener("input", function (e) {
    var t = e.target, R = S.rubric, a;
    if ((a = t.getAttribute("data-lv")) !== null) R.levels[+a].name = t.value;
    else if ((a = t.getAttribute("data-lp")) !== null) { var old = topPts(); R.levels[+a].points = parseFloat(t.value) || 0; var nw = topPts(); R.criteria.forEach(function (c) { if (c.max === old) c.max = nw; }); }
    else if ((a = t.getAttribute("data-cn")) !== null) R.criteria[+a].name = t.value;
    else if ((a = t.getAttribute("data-cc")) !== null) { var p = a.split(","); R.criteria[+p[0]].cells[+p[1]] = t.value; }
    else if ((a = t.getAttribute("data-cm")) !== null) R.criteria[+a].max = parseFloat(t.value) || 0;
    save(); clearTimeout(drawT); drawT = setTimeout(function () { drawGrader(); drawSheet(); }, 350);
  });
  var drawT;
  $("rbtable").addEventListener("change", function (e) { if (e.target.getAttribute("data-lp") !== null) { drawEditor(); } });
  $("rbtable").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var R = S.rubric, a;
    if ((a = b.getAttribute("data-dl")) !== null) { if (R.levels.length <= 2) return; R.levels.splice(+a, 1); R.criteria.forEach(function (c) { c.cells.splice(+a, 1); }); }
    else if ((a = b.getAttribute("data-dc")) !== null) { if (R.criteria.length <= 1) return; R.criteria.splice(+a, 1); S.grades.splice(+a, 1); }
    else return; save(); drawEditor(); drawGrader(); drawSheet();
  });
  $("addcrit").onclick = function () { var R = S.rubric; R.criteria.push({ name: "Criterion " + (R.criteria.length + 1), cells: R.levels.map(function () { return ""; }), max: topPts() }); save(); drawEditor(); drawGrader(); drawSheet(); };
  $("addlvl").onclick = function () { var R = S.rubric, low = Math.min.apply(null, R.levels.map(function (l) { return +l.points || 0; })); R.levels.push({ name: "New level", points: Math.max(0, low - 1) }); R.criteria.forEach(function (c) { c.cells.push(""); }); save(); drawEditor(); drawGrader(); };
  $("title").oninput = function () { S.title = this.value; save(); };

  /* ================================================================= step 3: grade on screen */
  function pts(i, k) { return E.levelPoints(S.rubric, i, k); }
  function drawGrader() {
    var R = S.rubric, h = ""; if (!R) return; while (S.grades.length < R.criteria.length) S.grades.push({ pick: -1, points: "", comment: "" });
    R.criteria.forEach(function (c, i) {
      var g = S.grades[i];
      h += "<div class='crit'><h3><span>" + esc(c.name) + "</span><span class='row'><label class='small'>Points <input type='number' step='0.5' min='0' style='width:70px' data-pt='" + i + "' value='" + esc(g.points) + "'></label><span class='small'>of " + esc(c.max) + "</span></span></h3><div class='lvls'>";
      R.levels.forEach(function (l, k) { h += "<button class='lv" + (g.pick === k ? " on" : "") + (g.sug === k && g.pick !== k ? " sug" : "") + "' data-lv='" + i + "," + k + "'><b>" + esc(l.name) + " (" + esc(pts(i, k)) + ")</b><span>" + esc(c.cells[k] || "") + "</span></button>"; });
      h += "</div><div class='chips'>" + S.bank.map(function (t, j) { return "<button data-chip='" + i + "," + j + "'>" + esc(t) + "</button>"; }).join("") + "</div><textarea class='cm' data-cm='" + i + "' placeholder='Comment for this row (optional)'>" + esc(g.comment) + "</textarea></div>";
    });
    $("crits").innerHTML = h; $("ocomment").value = S.comment; updateTotal();
  }
  function updateTotal() { var t = E.totals(S.rubric, S.grades); $("totpts").textContent = t.got + " / " + t.max; $("totpct").textContent = t.pct + "%  " + t.letter; $("totpct").className = "pill " + (t.pct >= 80 ? "g" : t.pct >= 60 ? "a" : ""); var left = S.grades.filter(function (g) { return g.points === "" || g.points == null; }).length; $("totnote").textContent = left ? left + " row" + (left > 1 ? "s" : "") + " not scored yet" : "All rows scored"; }
  $("crits").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var a = b.getAttribute("data-lv");
    if (a !== null) { var p = a.split(",").map(Number), g = S.grades[p[0]]; if (g.pick === p[1]) { g.pick = -1; g.points = ""; } else { g.pick = p[1]; g.points = pts(p[0], p[1]); } g.sug = undefined; drawGrader(); return; }
    a = b.getAttribute("data-chip"); if (a !== null) { var q = a.split(",").map(Number), gg = S.grades[q[0]]; gg.comment = (gg.comment ? gg.comment + " " : "") + S.bank[q[1]]; drawGrader(); }
  });
  $("crits").addEventListener("input", function (e) {
    var t = e.target, a;
    if ((a = t.getAttribute("data-pt")) !== null) { var g = S.grades[+a]; g.points = t.value === "" ? "" : parseFloat(t.value); g.pick = -1; for (var k = 0; k < S.rubric.levels.length; k++) if (pts(+a, k) === g.points) g.pick = k; updateTotal(); }
    else if ((a = t.getAttribute("data-cm")) !== null) S.grades[+a].comment = t.value;
  });
  $("ocomment").oninput = function () { S.comment = this.value; };
  $("clear").onclick = function () { S.grades = []; S.comment = ""; S.editId = null; $("sname").value = ""; drawGrader(); };
  function nextRosterName() { var done = {}; S.students.forEach(function (s) { done[s.name.toLowerCase()] = 1; }); for (var i = 0; i < S.roster.length; i++) if (!done[S.roster[i].toLowerCase()]) return S.roster[i]; return ""; }
  $("save").onclick = function () {
    var name = $("sname").value.trim(); if (!name) { $("sname").focus(); return status($("status"), "Type the student's name first.", "err"); }
    var rec = { id: S.editId || String(Date.now()) + Math.random().toString(36).slice(2, 6), name: name, date: new Date().toLocaleDateString(), grades: S.grades.map(function (g) { return { pick: g.pick, points: g.points, comment: g.comment }; }), comment: S.comment };
    var ix = S.students.findIndex(function (s) { return s.id === rec.id; }); if (ix >= 0) S.students[ix] = rec; else S.students.push(rec);
    S.grades = []; S.comment = ""; S.editId = null; save(); drawGrader(); drawSheet(); $("sname").value = nextRosterName(); $("sname").focus(); status($("status"), "Saved " + name + " to the spreadsheet.", "good"); window.scrollTo({ top: $("s3").offsetTop - 10, behavior: "smooth" });
  };
  $("roster").oninput = function () { S.roster = this.value.split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean); save(); drawRoster(); };
  function drawRoster() { $("rosterlist").innerHTML = S.roster.map(function (n) { return "<option value='" + esc(n) + "'>"; }).join(""); if (!$("sname").value) $("sname").value = nextRosterName(); }
  $("print").onclick = function () {
    var R = S.rubric, t = E.totals(R, S.grades), w = window.open("", "_blank"); if (!w) return;
    var rows = R.criteria.map(function (c, i) { var g = S.grades[i] || {}; return "<tr><td><b>" + esc(c.name) + "</b></td><td>" + (g.pick >= 0 ? esc(R.levels[g.pick].name) : "") + "</td><td>" + esc(g.points) + " / " + esc(c.max) + "</td><td>" + esc(g.comment) + "</td></tr>"; }).join("");
    w.document.write("<html><head><title>Feedback</title><style>body{font:14px system-ui;margin:30px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #999;padding:6px;text-align:left;vertical-align:top}h2{margin:0}</style></head><body><h2>" + esc(S.title || "Rubric") + "</h2><p><b>" + esc($("sname").value) + "</b></p><table><tr><th>Criteria</th><th>Level</th><th>Points</th><th>Comments</th></tr>" + rows + "</table><p><b>Total: " + t.got + " / " + t.max + " (" + t.pct + "%, " + t.letter + ")</b></p><p>" + esc(S.comment) + "</p></body></html>"); w.document.close(); w.focus(); w.print();
  };
  function setTab(n) { $("pane1").hidden = n !== 1; $("pane2").hidden = n !== 2; $("tab1").className = n === 1 ? "on" : ""; $("tab2").className = n === 2 ? "on" : ""; }
  $("tab1").onclick = function () { setTab(1); }; $("tab2").onclick = function () { setTab(2); };

  /* ================================================================= read marked copies */
  var copies = [];
  var drop2 = $("drop2"), file2 = $("file2");
  drop2.onclick = function () { file2.click(); };
  file2.onchange = function () { runCopies([].slice.call(file2.files)); file2.value = ""; };
  ["dragover", "dragenter"].forEach(function (ev) { drop2.addEventListener(ev, function (e) { e.preventDefault(); drop2.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop2.addEventListener(ev, function (e) { e.preventDefault(); drop2.classList.remove("over"); }); });
  drop2.addEventListener("drop", function (e) { runCopies([].slice.call(e.dataTransfer.files)); });
  function runCopies(files) {
    var i = 0; (function next() {
      if (i >= files.length) { progress($("bar2"), $("barfill2"), null); status($("status2"), "Done. Check each copy, fix anything I missed, then add it to the spreadsheet.", "good"); return; }
      var f = files[i++]; status($("status2"), "Reading " + f.name + " (" + i + " of " + files.length + ")..."); progress($("bar2"), $("barfill2"), (i - 1) / files.length);
      readFile(f, function (p) { progress($("bar2"), $("barfill2"), (i - 1 + p) / files.length); }).then(function (src) {
        var res = analyze(src); if (res.error) { status($("status2"), f.name + ": " + res.error, "err"); return next(); }
        addCopyCard(res, f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "), false); next();
      }).catch(function (e) { status($("status2"), f.name + ": " + (e.message || e), "err"); next(); });
    })();
  }
  function addCopyCard(res, name, scroll) {
    var R = S.rubric, id = "c" + Date.now() + Math.random().toString(36).slice(2, 5), n = Math.min(R.criteria.length, res.rubric.criteria.length), cp = { id: id, name: name, res: res, picks: [], note: "" };
    if (res.rubric.criteria.length !== R.criteria.length) cp.note = "This copy has " + res.rubric.criteria.length + " rows but your rubric has " + R.criteria.length + ". I matched them in order. Please check.";
    else if (res.rubric.levels.length !== R.levels.length) cp.note = "This copy has " + res.rubric.levels.length + " levels but your rubric has " + R.levels.length + ". I matched them in order. Please check.";
    for (var i = 0; i < R.criteria.length; i++) { var p = i < n ? res.picks[i] : { pick: -1, conf: 0, score: null }; var k = p.pick >= 0 && p.pick < R.levels.length ? p.pick : -1; cp.picks.push({ pick: k, conf: p.conf || 0, why: p.why || "", score: p.score, points: p.score !== null && p.score !== undefined ? p.score : (k >= 0 ? pts(i, k) : ""), maybe: p.maybe }); }
    copies.push(cp); drawCopies(); if (scroll) $("copies").scrollIntoView({ behavior: "smooth" });
  }
  function drawCopies() {
    var R = S.rubric; $("copies").innerHTML = copies.map(function (cp) {
      var t = E.totals(R, cp.picks.map(function (p) { return { points: p.points }; })), unsure = cp.picks.filter(function (p) { return p.pick < 0 && (p.points === "" || p.points === null); }).length;
      var h = "<div class='copycard' data-cp='" + cp.id + "'><div class='row'><input data-cpn='" + cp.id + "' value='" + esc(cp.name) + "' placeholder='Student name' style='width:220px;font-weight:700'><span class='pill " + (unsure ? "a" : "g") + "'>" + (unsure ? unsure + " row(s) need you" : "all rows read") + "</span><span class='big' style='font-weight:800'>" + t.got + " / " + t.max + " (" + t.pct + "%)</span><span style='flex:1'></span><button class='ok sm' data-cpadd='" + cp.id + "'>Add to spreadsheet</button><button class='danger sm' data-cpdel='" + cp.id + "'>Remove</button></div>";
      if (cp.note) h += "<div class='msg err'>" + esc(cp.note) + "</div>";
      h += "<div class='two' style='margin-top:8px'><div>" + R.criteria.map(function (c, i) {
        var p = cp.picks[i]; return "<div class='crit' style='margin:6px 0;padding:6px 8px'><div class='row'><b style='min-width:120px'>" + esc(c.name) + "</b>" + R.levels.map(function (l, k) { return "<button class='lv" + (p.pick === k ? " on" : "") + (p.maybe === k && p.pick < 0 ? " sug" : "") + "' style='padding:3px 8px' data-cpl='" + cp.id + "," + i + "," + k + "'><b>" + esc(l.name) + "</b></button>"; }).join("") + "<input type='number' step='0.5' style='width:62px' data-cpp='" + cp.id + "," + i + "' value='" + esc(p.points) + "'><span class='small'>/ " + esc(c.max) + "</span>" + (p.pick >= 0 ? "<span class='pill " + (p.conf >= 0.6 ? "g" : "a") + "'>" + (p.why ? esc(p.why) : "picked") + "</span>" : "") + "</div></div>";
      }).join("") + "</div><div class='srcwrap' data-cpimg='" + cp.id + "'></div></div></div>"; return h;
    }).join("");
    copies.forEach(function (cp) { var box = document.querySelector("[data-cpimg='" + cp.id + "']"); if (box) { if (cp.res.src.canvas) drawSourceCopy(box, cp); else box.parentNode.removeChild(box); } });
  }
  function drawSourceCopy(box, cp) { var picks = cp.picks.map(function (p) { return { pick: p.pick, conf: p.conf, maybe: p.maybe }; }); var holder = document.createElement("div"); box.appendChild(holder); drawSource(holder, { src: cp.res.src, geo: cp.res.geo, rubric: cp.res.rubric }, picks); holder.parentNode.hidden = false; }
  $("copies").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var a = b.getAttribute("data-cpl"), R = S.rubric;
    if (a !== null) { var p = a.split(","), cp = copies.filter(function (c) { return c.id === p[0]; })[0], pk = cp.picks[+p[1]], k = +p[2]; if (pk.pick === k) { pk.pick = -1; pk.points = ""; } else { pk.pick = k; pk.points = pts(+p[1], k); pk.conf = 1; pk.why = "you picked it"; pk.score = null; pk.maybe = undefined; } drawCopies(); return; }
    a = b.getAttribute("data-cpdel"); if (a !== null) { copies = copies.filter(function (c) { return c.id !== a; }); drawCopies(); return; }
    a = b.getAttribute("data-cpadd"); if (a !== null) {
      var c2 = copies.filter(function (c) { return c.id === a; })[0], name = (c2.name || "").trim(); if (!name) return status($("status2"), "Type the student's name first.", "err");
      S.students.push({ id: String(Date.now()) + Math.random().toString(36).slice(2, 5), name: name, date: new Date().toLocaleDateString(), grades: c2.picks.map(function (p) { return { pick: p.pick, points: p.points, comment: "" }; }), comment: "" });
      copies = copies.filter(function (c) { return c.id !== a; }); save(); drawCopies(); drawSheet(); status($("status2"), "Added " + name + " to the spreadsheet.", "good");
    }
  });
  $("copies").addEventListener("input", function (e) {
    var t = e.target, a; if ((a = t.getAttribute("data-cpn")) !== null) { copies.filter(function (c) { return c.id === a; })[0].name = t.value; }
    else if ((a = t.getAttribute("data-cpp")) !== null) { var p = a.split(","), cp = copies.filter(function (c) { return c.id === p[0]; })[0]; cp.picks[+p[1]].points = t.value === "" ? "" : parseFloat(t.value); }
  });

  /* ================================================================= step 4: spreadsheet */
  function drawSheet() {
    var R = S.rubric; if (!R) return; var rows = E.sheetRows(R, S.students, S.title); $("shinfo").textContent = S.students.length ? "(" + S.students.length + " student" + (S.students.length > 1 ? "s" : "") + ", class average " + avg() + "%)" : "(no students yet)";
    var h = "<table><tr>" + rows[0].map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + "<th></th></tr>";
    for (var i = 1; i < rows.length; i++) h += "<tr>" + rows[i].map(function (c, j) { return "<td" + (j === rows[0].length - 1 ? " style='white-space:normal;min-width:200px'" : "") + ">" + esc(c) + "</td>"; }).join("") + "<td><button class='ghost sm' data-ed='" + i + "'>Edit</button> <button class='danger sm' data-rm='" + i + "'>x</button></td></tr>";
    $("sheet").innerHTML = S.students.length ? h + "</table>" : "<p class='small' style='padding:10px'>Graded students appear here.</p>";
  }
  function avg() { var R = S.rubric, a = S.students.map(function (s) { return E.totals(R, s.grades).pct; }); return a.length ? Math.round(a.reduce(function (x, y) { return x + y; }, 0) / a.length * 10) / 10 : 0; }
  $("sheet").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var a = b.getAttribute("data-rm"); if (a !== null) { var s = S.students[+a - 1]; if (confirm("Remove " + s.name + " from the spreadsheet?")) { S.students.splice(+a - 1, 1); save(); drawSheet(); } return; }
    a = b.getAttribute("data-ed"); if (a !== null) { var st = S.students[+a - 1]; S.grades = st.grades.map(function (g) { return { pick: g.pick, points: g.points, comment: g.comment }; }); S.comment = st.comment || ""; S.editId = st.id; $("sname").value = st.name; setTab(1); drawGrader(); $("s3").scrollIntoView({ behavior: "smooth" }); }
  });
  function fname(ext) { return (S.title || "rubric-grades").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ext; }
  function download(blob, name) { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  $("csv").onclick = function () { download(new Blob(["﻿" + E.toCSV(E.sheetRows(S.rubric, S.students, S.title))], { type: "text/csv" }), fname(".csv")); };
  $("xlsx").onclick = function () {
    if (!window.XLSX) return alert("The Excel maker didn't load. Use the CSV button instead.");
    var rows = E.sheetRows(S.rubric, S.students, S.title), ws = XLSX.utils.aoa_to_sheet(rows), wb = XLSX.utils.book_new(); ws["!cols"] = rows[0].map(function (c, i) { return { wch: i === 0 ? 22 : i === rows[0].length - 1 ? 50 : Math.max(8, Math.min(22, String(c).length + 2)) }; });
    XLSX.utils.book_append_sheet(wb, ws, "Grades"); XLSX.writeFile(wb, fname(".xlsx"));
  };
  $("copy").onclick = function () { var tsv = E.toTSV(E.sheetRows(S.rubric, S.students, S.title)); (navigator.clipboard ? navigator.clipboard.writeText(tsv) : Promise.reject()).then(function () { $("copy").textContent = "Copied! Paste into Google Sheets"; setTimeout(function () { $("copy").textContent = "Copy for Google Sheets"; }, 2500); }).catch(function () { prompt("Copy this (Ctrl+C), then paste into Google Sheets:", tsv); }); };
  $("wipe").onclick = function () { if (S.students.length && confirm("Remove all " + S.students.length + " graded students? The rubric stays.")) { S.students = []; save(); drawSheet(); drawRoster(); } };

  showAll();
  window.__rubricApp = { S: S, analyze: analyze, setRubric: setRubric, addCopyCard: addCopyCard, handle: handle, readFile: readFile };
})();
