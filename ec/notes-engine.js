/* Data-driven notes pages for the CodeHS units (7-19). Each page sets window.NOTES, then loads this file.
   Block types: p, hint, warn, code, table, cards, svg, gfx, trace, predict, slider, widget, turtle, order, match. */
(function () {
  "use strict";
  var N = window.NOTES || (window.NOTES_DATA && window.NOTES_DATA[window.NOTES_ID]) || {};
  var C = { bg: "#151A24", line: "#3A4658", ink: "#EAEFF6", soft: "#8B9AAE", acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", blue: "#BFDBFE", ok: "#34D399", dark: "#05070B", pink: "#F472B6" };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function fn(src) { return new Function("return (" + src + ");")(); }

  /* ---------- syntax highlighting ---------- */
  var KW = { py: "def return if elif else for while in not and or import from as class True False None break continue try except raise pass lambda with is global finally", cpp: "int void byte boolean long float char const if else for while return true false HIGH LOW OUTPUT INPUT INPUT_PULLUP unsigned bool" };
  var BI = { py: "print range len input int str float round abs list tuple dict set type isinstance super open max min sum sorted enumerate zip", cpp: "pinMode digitalWrite digitalRead analogWrite analogRead delay millis map Serial begin print println attach write pulseIn" };
  function hl(src, lang) {
    lang = lang || "py";
    var kw = new RegExp("^(" + KW[lang].split(" ").join("|") + ")$"), bi = new RegExp("^(" + BI[lang].split(" ").join("|") + ")$");
    var re = lang === "cpp" ? /(\/\/[^\n]*|#include[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)/g : /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|([A-Za-z_]\w*)/g;
    var out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index)); last = re.lastIndex;
      var t = esc(m[0]);
      if (m[1]) out += '<span class="cm">' + t + "</span>";
      else if (m[2] || m[3]) out += '<span class="n">' + t + "</span>";
      else if (kw.test(m[4])) out += '<span class="kw">' + t + "</span>";
      else if (bi.test(m[4])) out += '<span class="fn">' + t + "</span>";
      else out += t;
    }
    return out + esc(src.slice(last));
  }

  /* ---------- svg helpers ---------- */
  function txt(x, y, s, size, fill, anchor, weight) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + esc(s) + "</text>"; }
  function rect(x, y, w, hh, fill, stroke, sw, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="' + (rx == null ? 6 : rx) + '" fill="' + (fill || C.bg) + '" stroke="' + (stroke || C.line) + '" stroke-width="' + (sw || 1.5) + '"/>'; }
  function arrow(x1, y1, x2, y2, col) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (col || C.soft) + '" stroke-width="2" marker-end="url(#ah)"/>'; }
  function svgWrap(w, hh, inner, label) {
    return '<svg viewBox="0 0 ' + w + " " + hh + '" role="img" aria-label="' + esc(label || "diagram") + '"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#8B9AAE" stroke-width="1.8"/></marker></defs>' + inner + "</svg>";
  }
  function fig(svg, cap) { var d = h("div", "fig", svg); if (cap) d.appendChild(h("p", "cap", cap)); return d; }

  /* ---------- parametric graphics ---------- */
  var G = {};
  G.flow = function (s) {
    var n = s.steps.length, per = s.perRow || Math.min(4, n), bw = 160, gap = 40, bh = 64, rows = Math.ceil(n / per);
    var W = per * bw + (per - 1) * gap + 20, H = rows * bh + (rows - 1) * 46 + 20, o = "";
    s.steps.forEach(function (st, i) {
      var r = Math.floor(i / per), c = i % per, x = 10 + c * (bw + gap), y = 10 + r * (bh + 46), p = String(st).split("|"), col = (s.colors && s.colors[i]) || C.acc;
      o += rect(x, y, bw, bh, C.bg, col, 2, 8) + txt(x + bw / 2, y + (p[1] ? 27 : 38), p[0], 14, C.ink, "middle", 700);
      if (p[1]) o += txt(x + bw / 2, y + 47, p[1], 11, C.soft, "middle");
      if (i < n - 1) {
        if (c < per - 1) o += arrow(x + bw + 4, y + bh / 2, x + bw + gap - 4, y + bh / 2);
        else o += '<path d="M' + (x + bw / 2) + " " + (y + bh + 2) + " V" + (y + bh + 22) + " H" + (10 + bw / 2) + " V" + (y + bh + 44) + '" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#ah)"/>';
      }
    });
    return svgWrap(W, H, o, s.label || "flow diagram");
  };
  G.vars = function (s) {
    var it = s.items, per = s.perRow || Math.min(5, it.length), bw = 130, gap = 18, bh = 96, rows = Math.ceil(it.length / per), W = per * bw + (per - 1) * gap + 20, H = rows * (bh + 30) + 10, o = "";
    it.forEach(function (v, i) {
      var r = Math.floor(i / per), c = i % per, x = 10 + c * (bw + gap), y = 10 + r * (bh + 30), col = v.c || C.acc;
      o += txt(x + bw / 2, y + 12, v.n, 14, C.acc, "middle", 700) + rect(x, y + 20, bw, bh - 20, "#10141C", col, 2, 6) + txt(x + bw / 2, y + 58, v.v, String(v.v).length > 9 ? 14 : 20, C.amb, "middle", 700);
      if (v.t) o += txt(x + bw / 2, y + bh + 14, v.t, 11, C.soft, "middle");
    });
    return svgWrap(W, H, o, s.label || "variables in memory");
  };
  G.cells = function (s) {
    var it = s.items, cw = s.w || 54, W = it.length * cw + 40, hi = s.hi || [], lo = s.lo || [], o = "", rowsH = s.neg ? 120 : 98;
    if (s.title) o += txt(10, 16, s.title, 12, C.soft);
    it.forEach(function (v, i) {
      var x = 20 + i * cw, on = hi.indexOf(i) >= 0, dim = lo.indexOf(i) >= 0;
      o += rect(x, 30, cw - 4, 46, on ? "rgba(251,191,36,.18)" : C.bg, on ? C.amb : (dim ? "#2A3342" : C.line), on ? 2.5 : 1.5, 4) + txt(x + (cw - 4) / 2, 59, v === " " ? "␣" : v, 17, dim ? C.soft : C.ink, "middle", 700);
      if (s.idx !== false) o += txt(x + (cw - 4) / 2, 94, i, 12, C.acc, "middle", 700);
      if (s.neg) o += txt(x + (cw - 4) / 2, 112, i - it.length, 11, C.soft, "middle");
    });
    if (s.idx !== false) o += txt(2, 94, "", 10);
    return svgWrap(W, rowsH, o, s.label || "indexed cells");
  };
  G.grid = function (s) {
    var rows = s.rows, cw = 62, W = rows[0].length * cw + 60, H = rows.length * 50 + 50, o = "", hi = s.hi || [];
    rows[0].forEach(function (_, c) { o += txt(50 + c * cw + cw / 2 - 2, 18, "[" + c + "]", 12, C.acc, "middle", 700); });
    rows.forEach(function (row, r) {
      o += txt(20, 56 + r * 50, "[" + r + "]", 12, C.acc, "middle", 700);
      row.forEach(function (v, c) {
        var on = hi.some(function (p) { return p[0] === r && p[1] === c; });
        o += rect(50 + c * cw, 28 + r * 50, cw - 4, 40, on ? "rgba(251,191,36,.18)" : C.bg, on ? C.amb : C.line, on ? 2.5 : 1.5, 4) + txt(50 + c * cw + (cw - 4) / 2, 54 + r * 50, v, 15, C.ink, "middle", 700);
      });
    });
    return svgWrap(W, H, o, s.label || "2D list");
  };
  G.compare = function (s) {
    var cols = [s.left, s.right], o = "", H = 60 + Math.max(s.left.items.length, s.right.items.length) * 26 + 16;
    cols.forEach(function (cl, i) {
      var x = 10 + i * 385, col = i ? C.amb : C.acc;
      o += rect(x, 10, 365, H - 20, C.bg, col, 2, 8) + txt(x + 182, 38, cl.title, 16, col, "middle", 700);
      cl.items.forEach(function (t, k) { o += txt(x + 18, 70 + k * 26, t, 13, C.ink); });
    });
    return svgWrap(780, H, o, s.label || "comparison");
  };
  G.tree = function (s) {
    var kids = s.children, n = kids.length, bw = 150, gap = 24, W = Math.max(n * bw + (n - 1) * gap + 20, 360), o = "", px = W / 2;
    o += rect(px - 90, 10, 180, 50, C.bg, C.acc, 2, 8) + txt(px, 33, s.parent[0], 15, C.ink, "middle", 700) + txt(px, 50, s.parent[1] || "", 11, C.soft, "middle");
    var startX = (W - (n * bw + (n - 1) * gap)) / 2;
    kids.forEach(function (k, i) {
      var x = startX + i * (bw + gap);
      o += '<path d="M' + px + " 60 V84 H" + (x + bw / 2) + ' V110" fill="none" stroke="#8B9AAE" stroke-width="2" marker-end="url(#ah)"/>' + rect(x, 112, bw, 62, C.bg, C.amb, 2, 8) + txt(x + bw / 2, 136, k[0], 14, C.ink, "middle", 700) + txt(x + bw / 2, 156, k[1] || "", 11, C.soft, "middle");
    });
    return svgWrap(W, 190, o, s.label || "hierarchy");
  };
  G.links = function (s) {
    var L = s.left, R = s.right, rows = Math.max(L.length, R.length), H = rows * 44 + 20, o = "";
    L.forEach(function (t, i) { o += rect(10, 10 + i * 44, 210, 34, C.bg, C.acc, 1.5, 5) + txt(115, 32 + i * 44, t, 13, C.ink, "middle", 600); });
    R.forEach(function (t, i) { o += rect(440, 10 + i * 44, 210, 34, C.bg, C.amb, 1.5, 5) + txt(545, 32 + i * 44, t, 13, C.ink, "middle", 600); });
    (s.links || []).forEach(function (l) { o += '<line x1="220" y1="' + (27 + l[0] * 44) + '" x2="440" y2="' + (27 + l[1] * 44) + '" stroke="' + (l[2] || C.acc) + '" stroke-width="2.5"/>'; });
    return svgWrap(660, H, o, s.label || "connections");
  };
  G.nest = function (s) {
    var o = "", n = s.inner.length, bw = 200, gap = 16, W = Math.max(n * bw + (n - 1) * gap + 40, 340), H = 60 + Math.max.apply(null, s.inner.map(function (b) { return b.items.length; })) * 22 + 50;
    o += rect(6, 6, W - 12, H - 12, "#10141C", C.acc, 2, 10) + txt(22, 30, s.outer.title, 14, C.acc, "start", 700);
    if (s.outer.sub) o += txt(W - 22, 30, s.outer.sub, 12, C.soft, "end");
    s.inner.forEach(function (b, i) {
      var x = 22 + i * (bw + gap), bh = H - 70;
      o += rect(x, 46, bw, bh, C.bg, C.amb, 2, 8) + txt(x + 12, 70, b.title, 13, C.amb, "start", 700);
      b.items.forEach(function (t, k) { o += txt(x + 12, 96 + k * 22, t, 12.5, C.ink); });
    });
    return svgWrap(W, H, o, s.label || "scope");
  };

  /* ---------- block renderers ---------- */
  var R = {};
  R.p = function (a) { return h("p", "lede", a[1]); };
  R.hint = function (a) { return h("div", "hint-panel", a[1]); };
  R.warn = function (a) { return h("div", "warn", a[1]); };
  R.code = function (a) { var d = h("div", "code"); d.innerHTML = hl(a[2], a[1]); return d; };
  R.table = function (a) {
    var w = h("div", "tblwrap"), t = "<table><tr>" + a[1].map(function (x) { return "<th>" + x + "</th>"; }).join("") + "</tr>";
    a[2].forEach(function (r) { t += "<tr>" + r.map(function (x) { return "<td>" + x + "</td>"; }).join("") + "</tr>"; });
    w.innerHTML = t + "</table>"; return w;
  };
  R.cards = function (a) {
    var g = h("div", "flips");
    a[1].forEach(function (c) {
      var b = h("button", "flip", '<div class="t">' + c[0] + '</div><div class="h">click to flip</div><div class="d">' + c[1] + "</div>"); b.type = "button";
      b.onclick = function () { b.classList.toggle("open"); }; g.appendChild(b);
    });
    return g;
  };
  R.svg = function (a) { return fig(a[1], a[2]); };
  R.gfx = function (a) { return fig(G[a[1]](a[2]), a[3]); };

  R.trace = function (a) {
    var s = a[1], i = -1, wrap = h("div"), box = h("div", "trace"), lines = h("div", "lines"), side = h("div", "side");
    s.code.forEach(function (l, k) { var d = h("div", "ln"); d.innerHTML = '<span class="no">' + (k + 1) + "</span>" + hl(l, s.lang) ; lines.appendChild(d); });
    side.innerHTML = '<h4>Variables</h4><div class="vars"><div class="small">press Next to run the first line</div></div><h4 style="margin-top:12px">Output</h4><div class="console"></div>';
    box.appendChild(lines); box.appendChild(side); wrap.appendChild(box);
    var note = h("div", "stepnote"), btns = h("div", "btns"); btns.style.justifyContent = "flex-start";
    [["Back", -1], ["Next", 1], ["Reset", 0]].forEach(function (b) {
      var x = h("button", "btn", b[0]); x.type = "button";
      x.onclick = function () { i = b[1] === 0 ? -1 : Math.max(-1, Math.min(s.steps.length - 1, i + b[1])); draw(); }; btns.appendChild(x);
    });
    wrap.appendChild(btns); wrap.appendChild(note);
    function draw() {
      [].forEach.call(lines.children, function (d, k) { d.classList.toggle("run", i >= 0 && s.steps[i][0] === k); });
      var vars = i >= 0 ? s.steps[i][1] : {}, vh = "";
      Object.keys(vars).forEach(function (k) { vh += '<div class="varrow"><b>' + esc(k) + "</b><span>" + esc(vars[k]) + "</span></div>"; });
      side.querySelector(".vars").innerHTML = vh || '<div class="small">no variables yet</div>';
      var out = []; for (var k = 0; k <= i; k++) if (s.steps[k][2] != null && s.steps[k][2] !== "") out.push(s.steps[k][2]);
      side.querySelector(".console").textContent = out.join("\n");
      note.innerHTML = i >= 0 && s.steps[i][3] ? s.steps[i][3] : (i < 0 ? "Step through the program one line at a time and watch what changes." : "");
    }
    draw(); return wrap;
  };

  R.predict = function (a) {
    var s = a[1], w = h("div"), done = false;
    if (s.code) { var c = h("div", "code"); c.innerHTML = hl(s.code, s.lang); w.appendChild(c); }
    w.appendChild(h("p", "lede", "<b>" + s.q + "</b>"));
    var o = h("div", "opts2"), fb = h("div", "pfb");
    s.opts.forEach(function (t, k) {
      var b = h("button", "btn"); b.type = "button"; b.innerHTML = t;
      b.onclick = function () {
        if (done) return;
        if (k === s.ans) { done = true; b.classList.add("good"); fb.innerHTML = "<b style='color:#34D399'>Right.</b> " + s.why; }
        else { b.classList.add("bad"); fb.innerHTML = "<b style='color:#FCA5A5'>Not quite.</b> Look at the code again and try another."; }
      };
      o.appendChild(b);
    });
    w.appendChild(o); w.appendChild(fb); return w;
  };

  R.slider = function (a) {
    var s = a[1], f = typeof s.f === "function" ? s.f : fn(s.f), w = h("div", "panel"), id = "sl" + Math.random().toString(36).slice(2, 7);
    w.innerHTML = '<div class="wrow"><label for="' + id + '">' + s.label + '</label><span class="big" id="' + id + 'v"></span></div><input id="' + id + '" type="range" min="' + s.min + '" max="' + s.max + '" step="' + (s.step || 1) + '" value="' + s.val + '"><div class="wout" id="' + id + 'o"></div>';
    var inp = w.querySelector("input");
    function up() { w.querySelector("#" + id + "v").textContent = inp.value + (s.unit || ""); w.querySelector("#" + id + "o").innerHTML = f(+inp.value); }
    inp.oninput = up; up(); return w;
  };

  R.widget = function (a) { var s = a[1], w = h("div", "panel", s.html); if (typeof s.js === "function") s.js(w); else fn("function(root){" + s.js + "}")(w); return w; };

  R.order = function (a) {
    var s = a[1], w = h("div", "panel"), pool = h("div", "pool"), built = h("div", "built"), fb = h("div", "pfb");
    w.appendChild(h("p", "lede", "<b>" + s.q + "</b>"));
    var two = h("div", "two"), l = h("div"), r = h("div");
    l.appendChild(h("div", "small", "Pieces (click to add)")); l.appendChild(pool); r.appendChild(h("div", "small", "Your program (click a line to remove it)")); r.appendChild(built);
    two.appendChild(l); two.appendChild(r); w.appendChild(two);
    var idx = s.lines.map(function (_, i) { return i; }), shuffled = idx.slice().sort(function (x, y) { return ((x * 7 + 3) % 11) - ((y * 7 + 3) % 11); });
    if (shuffled.join() === idx.join()) shuffled.reverse();
    var mine = [];
    function draw() {
      pool.innerHTML = ""; built.innerHTML = "";
      shuffled.forEach(function (k) { if (mine.indexOf(k) < 0) { var b = h("button", "ol"); b.type = "button"; b.textContent = s.lines[k]; b.onclick = function () { mine.push(k); fb.textContent = ""; draw(); }; pool.appendChild(b); } });
      mine.forEach(function (k, p) { var b = h("button", "ol"); b.type = "button"; b.textContent = s.lines[k]; b.onclick = function () { mine.splice(p, 1); fb.textContent = ""; draw(); }; built.appendChild(b); });
    }
    var bt = h("div", "btns"); bt.style.justifyContent = "flex-start";
    var chk = h("button", "btn", "Check order"); chk.type = "button";
    chk.onclick = function () {
      if (mine.length < s.lines.length) { fb.innerHTML = "Add every piece first."; return; }
      var ok = mine.every(function (k, p) { return k === p; });
      fb.innerHTML = ok ? "<b style='color:#34D399'>That runs.</b> " + (s.why || "") : "<b style='color:#FCA5A5'>Not quite.</b> " + (s.hint || "Read it top to bottom as the computer would.");
    };
    var rs = h("button", "btn", "Reset"); rs.type = "button"; rs.onclick = function () { mine = []; fb.textContent = ""; draw(); };
    bt.appendChild(chk); bt.appendChild(rs); w.appendChild(bt); w.appendChild(fb); draw(); return w;
  };

  R.match = function (a) {
    var pairs = a[1], w = h("div"), g = h("div", "mgrid"), L = h("div"), Rr = h("div"), sel = null, left = pairs.length;
    L.style.display = Rr.style.display = "grid"; L.style.gap = Rr.style.gap = "10px";
    var defs = pairs.map(function (p, i) { return i; }).sort(function (x, y) { return ((x * 5 + 2) % 7) - ((y * 5 + 2) % 7); });
    if (defs.join() === pairs.map(function (_, i) { return i; }).join()) defs.reverse();
    var fb = h("div", "pfb");
    pairs.forEach(function (p, i) { var b = h("button", "mi"); b.type = "button"; b.innerHTML = p[0]; b.dataset.k = i; b.onclick = function () { if (b.classList.contains("done")) return; [].forEach.call(L.children, function (x) { x.classList.remove("sel"); }); b.classList.add("sel"); sel = i; }; L.appendChild(b); });
    defs.forEach(function (i) {
      var b = h("button", "mi"); b.type = "button"; b.innerHTML = pairs[i][1]; b.dataset.k = i;
      b.onclick = function () {
        if (sel == null || b.classList.contains("done")) return;
        if (sel === i) { b.classList.add("done"); L.children[i].classList.remove("sel"); L.children[i].classList.add("done"); sel = null; left--; fb.innerHTML = left ? "" : "<b style='color:#34D399'>All matched.</b>"; }
        else { b.classList.add("shake"); setTimeout(function () { b.classList.remove("shake"); }, 450); }
      };
      Rr.appendChild(b);
    });
    g.appendChild(L); g.appendChild(Rr); w.appendChild(h("div", "small", "Click a term on the left, then its meaning on the right.")); w.appendChild(g); w.appendChild(fb); return w;
  };

  /* ---------- Tracy-style turtle playground ---------- */
  function ev(expr, env) {
    if (/\/\//.test(expr) || !/^[\w\s+\-*/%().,]*$/.test(expr)) throw new Error("I can't read this expression: " + expr);
    var ok = { abs: Math.abs, min: Math.min, max: Math.max, round: Math.round }, names = Object.keys(env).concat(Object.keys(ok));
    (expr.match(/[A-Za-z_]\w*/g) || []).forEach(function (t) { if (names.indexOf(t) < 0) throw new Error("Unknown name: " + t); });
    var vals = Object.keys(env).map(function (k) { return env[k]; }).concat(Object.keys(ok).map(function (k) { return ok[k]; }));
    return Function.apply(null, names.concat(["return (" + expr + ");"])).apply(null, vals);
  }
  function runTurtle(src) {
    var L = [];
    src.replace(/\t/g, "    ").split("\n").forEach(function (l, i) { var raw = l.replace(/#.*$/, ""); if (raw.trim()) L.push({ ind: raw.match(/^ */)[0].length, t: raw.trim(), n: i + 1 }); });
    var pos = 0;
    function block(ind) {
      var out = [];
      while (pos < L.length && L[pos].ind >= ind) {
        var ln = L[pos]; if (ln.ind > ind) throw new Error("Line " + ln.n + ": unexpected indent"); pos++;
        var m = ln.t.match(/^for\s+(\w+)\s+in\s+range\((.*)\)\s*:$/);
        if (m) { if (pos < L.length && L[pos].ind > ind) out.push({ k: "for", v: m[1], a: m[2], body: block(L[pos].ind), n: ln.n }); else throw new Error("Line " + ln.n + ": the for loop needs an indented block"); }
        var d = ln.t.match(/^def\s+(\w+)\((.*)\)\s*:$/);
        if (m) {} else if (d) { if (pos < L.length && L[pos].ind > ind) out.push({ k: "def", name: d[1], ps: d[2].split(",").map(function (x) { return x.trim(); }).filter(Boolean), body: block(L[pos].ind), n: ln.n }); else throw new Error("Line " + ln.n + ": the function needs an indented block"); }
        else out.push({ k: "s", t: ln.t, n: ln.n });
      }
      return out;
    }
    var prog = block(L.length ? L[0].ind : 0);
    var st = { x: 0, y: 0, a: 0, pen: true, col: "#5FD8DF", w: 3, fill: null, fills: [], segs: [], circ: [], count: 0 }, env = {}, funcs = {};
    function go(d) { var nx = st.x + d * Math.cos(st.a * Math.PI / 180), ny = st.y + d * Math.sin(st.a * Math.PI / 180); if (st.pen) st.segs.push({ x1: st.x, y1: st.y, x2: nx, y2: ny, c: st.col, w: st.w }); if (st.fill) st.fill.push([nx, ny]); st.x = nx; st.y = ny; }
    function stmt(s, n) {
      if (++st.count > 4000) throw new Error("Too many steps. Is there a loop that is too big?");
      var m;
      if ((m = s.match(/^([A-Za-z_]\w*)\s*(\+|-|\*)?=\s*(.+)$/))) { var v = ev(m[3], env); env[m[1]] = m[2] ? ev(m[1] + m[2] + "(" + v + ")", env) : v; return; }
      if (!(m = s.match(/^([A-Za-z_]\w*)\((.*)\)$/))) throw new Error("Line " + n + ": I don't understand '" + s + "'");
      var name = m[1], raw = m[2].trim(), args = [];
      if (name === "color") { var cm = raw.match(/^["']([\w#]+)["']$/); if (!cm) throw new Error('Line ' + n + ': use color("red")'); st.col = cm[1]; return; }
      if (raw) args = raw.split(",").map(function (x) { return ev(x, env); });
      if (funcs[name]) { var f = funcs[name]; if (args.length !== f.ps.length) throw new Error("Line " + n + ": " + name + "() needs " + f.ps.length + " value(s)"); var saved = env; env = Object.assign({}, env); f.ps.forEach(function (p, i) { env[p] = args[i]; }); exec(f.body); env = saved; return; }
      switch (name) {
        case "forward": case "fd": go(args[0] || 0); break;
        case "backward": case "back": case "bk": go(-(args[0] || 0)); break;
        case "left": case "lt": st.a += args[0] || 0; break;
        case "right": case "rt": st.a -= args[0] || 0; break;
        case "penup": case "up": st.pen = false; break;
        case "pendown": case "down": st.pen = true; break;
        case "goto": case "setposition": case "setpos": if (st.pen) st.segs.push({ x1: st.x, y1: st.y, x2: args[0], y2: args[1], c: st.col, w: st.w }); st.x = args[0]; st.y = args[1]; if (st.fill) st.fill.push([st.x, st.y]); break;
        case "pensize": case "width": st.w = Math.max(1, args[0] || 1); break;
        case "circle": { var r = args[0] || 0; if (args[1] != null && Math.abs(args[1]) < 360) { var ex = args[1], nn = Math.max(1, Math.ceil(Math.abs(ex) / 6)), da = ex / nn, sg = r >= 0 ? 1 : -1, chord = 2 * Math.abs(r) * Math.sin(Math.abs(da) * Math.PI / 360); for (var q2 = 0; q2 < nn; q2++) { st.a += sg * da / 2; go(chord); st.a += sg * da / 2; } break; } var cx = st.x + r * Math.cos((st.a + 90) * Math.PI / 180), cy = st.y + r * Math.sin((st.a + 90) * Math.PI / 180); st.circ.push({ cx: cx, cy: cy, r: Math.abs(r), c: st.col, w: st.w, fill: !!st.fill, pen: st.pen }); break; }
        case "begin_fill": st.fill = [[st.x, st.y]]; break;
        case "end_fill": if (st.fill) { st.fills.push({ pts: st.fill, c: st.col }); st.fill = null; } break;
        case "speed": case "hideturtle": case "showturtle": break;
        default: throw new Error("Line " + n + ": Tracy doesn't know " + name + "()");
      }
    }
    function exec(list) {
      list.forEach(function (it) {
        if (it.k === "def") { funcs[it.name] = it; return; }
        if (it.k === "s") return stmt(it.t, it.n);
        var a = it.a.split(",").map(function (x) { return ev(x, env); }), s0 = 0, e0, step = 1;
        if (a.length === 1) e0 = a[0]; else { s0 = a[0]; e0 = a[1]; if (a.length > 2) step = a[2] || 1; }
        var guard = 0; for (var i = s0; step > 0 ? i < e0 : i > e0; i += step) { if (++guard > 500) throw new Error("Line " + it.n + ": range is too big"); env[it.v] = i; exec(it.body); }
      });
    }
    exec(prog); return st;
  }
  function drawTurtle(st, S) {
    var o = "", lim = S / 2;
    for (var g = -Math.floor(lim / 50) * 50; g <= lim; g += 50) o += '<line x1="' + g + '" y1="' + -lim + '" x2="' + g + '" y2="' + lim + '" stroke="' + (g === 0 ? "#3A4658" : "#1B2330") + '" stroke-width="1"/><line x1="' + -lim + '" y1="' + -g + '" x2="' + lim + '" y2="' + -g + '" stroke="' + (g === 0 ? "#3A4658" : "#1B2330") + '" stroke-width="1"/>';
    st.fills.forEach(function (f) { o += '<polygon points="' + f.pts.map(function (p) { return p[0] + "," + -p[1]; }).join(" ") + '" fill="' + f.c + '" fill-opacity=".45"/>'; });
    st.circ.forEach(function (c) { o += '<circle cx="' + c.cx + '" cy="' + -c.cy + '" r="' + c.r + '" fill="' + (c.fill ? c.c : "none") + '" fill-opacity=".45" stroke="' + (c.pen ? c.c : "none") + '" stroke-width="' + c.w + '"/>'; });
    st.segs.forEach(function (s) { o += '<line x1="' + s.x1 + '" y1="' + -s.y1 + '" x2="' + s.x2 + '" y2="' + -s.y2 + '" stroke="' + s.c + '" stroke-width="' + s.w + '" stroke-linecap="round"/>'; });
    o += '<g transform="translate(' + st.x + " " + -st.y + ") rotate(" + -st.a + ')"><polygon points="12,0 -8,8 -8,-8" fill="#FBBF24" stroke="#05070B" stroke-width="1.5"/></g>';
    return '<svg viewBox="' + -lim + " " + -lim + " " + S + " " + S + '" role="img" aria-label="Tracy the turtle canvas">' + o + "</svg>";
  }
  R.turtle = function (a) {
    var s = a[1], w = h("div"), S = s.size || 320, two = h("div", "two"), left = h("div"), right = h("div", "tcanvas");
    var ta = h("textarea", "tcode"); ta.value = s.code; ta.spellcheck = false;
    var err = h("div", "terr"), btns = h("div", "btns"); btns.style.justifyContent = "flex-start";
    function run() { try { right.innerHTML = drawTurtle(runTurtle(ta.value), S); err.textContent = ""; } catch (e) { err.textContent = e.message; } }
    var rb = h("button", "btn on", "Run"); rb.type = "button"; rb.onclick = run; btns.appendChild(rb);
    (s.presets || []).forEach(function (p) { var b = h("button", "btn", p[0]); b.type = "button"; b.onclick = function () { ta.value = p[1]; run(); }; btns.appendChild(b); });
    left.appendChild(ta); left.appendChild(btns); left.appendChild(err);
    left.appendChild(h("div", "small", "Tracy starts in the middle facing right. Edit the code and press Run. Supported: forward, backward, left, right, penup, pendown, goto, circle, color, pensize, begin_fill, end_fill, and for-range loops."));
    two.appendChild(left); two.appendChild(right); w.appendChild(two); run(); return w;
  };

  /* ---------- Python playground (uses minipy.js) ---------- */
  R.py = function (a) {
    var s = a[1], w = h("div"), ta = h("textarea", "tcode"), con = h("div", "console"), err = h("div", "terr"), btns = h("div", "btns"), inp = null;
    ta.value = s.code; ta.spellcheck = false; ta.style.minHeight = "0"; ta.rows = s.rows || Math.min(16, Math.max(4, s.code.split("\n").length + 1));
    if (s.inputs != null) { inp = h("textarea", "tcode"); inp.value = s.inputs; inp.rows = 2; inp.style.minHeight = "0"; inp.spellcheck = false; }
    function run() { var res = window.MiniPy.run(ta.value, { inputs: inp ? inp.value.split("\n") : [] }); con.textContent = res.out; err.textContent = res.err; }
    btns.style.justifyContent = "flex-start";
    var rb = h("button", "btn on", "Run"); rb.type = "button"; rb.onclick = run; btns.appendChild(rb);
    (s.presets || []).forEach(function (p) { var b = h("button", "btn", p[0]); b.type = "button"; b.onclick = function () { ta.value = p[1]; if (inp && p[2] != null) inp.value = p[2]; run(); }; btns.appendChild(b); });
    w.appendChild(ta); if (inp) { w.appendChild(h("div", "small", "What the person types for input() (one answer per line):")); w.appendChild(inp); }
    w.appendChild(btns); w.appendChild(con); w.appendChild(err);
    if (s.note) w.appendChild(h("div", "small", s.note));
    if (s.autorun !== false) run(); return w;
  };

  /* ---------- page assembly ---------- */
  function build() {
    var app = document.getElementById("app"), id = N.id, parts = id.split("."), u = parts[0], k = parts[1];
    var lessonFile = N.lessonFile, nav = h("nav", "pillnav", '<a href="../index.html">&larr; Embedded Computing</a><a href="' + lessonFile + '">' + id + " Lesson Page</a>" + '<a href="' + u + "-" + k + '-notes.html" class="current">Notes</a>');
    app.appendChild(nav);
    var secs = N.sections, hero = h("header", "hero"), map = secs.map(function (s, i) { return '<a href="#s' + (i + 1) + '">' + (i < 9 ? "0" : "") + (i + 1) + " <span>" + s.h + "</span></a>"; }).join("");
    map += '<a href="#quiz">' + ((secs.length + 1) < 10 ? "0" : "") + (secs.length + 1) + " <span>Test yourself</span></a>";
    hero.innerHTML = '<div class="wrap"><div class="brief-no">Embedded Computing Notes &nbsp;/&nbsp; Lesson ' + id + '</div><h1>' + N.title + '</h1><p class="deck">' + N.deck + '</p><div class="lessonmeta"><span>' + N.codehs + '</span>' + (N.tags || []).map(function (t) { return "<span>" + t + "</span>"; }).join("") + '</div><div class="map">' + map + "</div></div>";
    app.appendChild(hero);
    secs.forEach(function (s, i) {
      var sec = h("section", "part"), wrap = h("div", "wrap"); sec.id = "s" + (i + 1);
      wrap.innerHTML = '<div class="part-head"><div class="part-tag">' + (i < 9 ? "0" : "") + (i + 1) + "</div><h2>" + s.h + "</h2>" + (s.f ? '<span class="for">' + s.f + "</span>" : "") + "</div>" + (s.story ? '<p class="story">' + s.story + "</p>" : "");
      (s.b || []).forEach(function (b) { var node = R[b[0]](b); node.style.marginBottom = node.style.marginBottom || "14px"; wrap.appendChild(node); });
      sec.appendChild(wrap); app.appendChild(sec);
    });
    var q = h("section", "part"), qw = h("div", "wrap"); q.id = "quiz";
    qw.innerHTML = '<div class="part-head"><div class="part-tag">' + ((secs.length + 1) < 10 ? "0" : "") + (secs.length + 1) + "</div><h2>Test Yourself</h2></div>";
    var quiz = h("div", "quiz");
    (N.quiz || []).forEach(function (qq) {
      var d = h("div", "q", "<div>" + qq[0] + '</div><div class="opts"></div><div class="fb"></div>');
      qq[1].forEach(function (t, i) {
        var b = h("button", "btn"); b.type = "button"; b.innerHTML = t;
        b.onclick = function () { var fb = d.querySelector(".fb"); if (i === qq[2]) { fb.innerHTML = '<b style="color:#34D399">Right.</b> ' + qq[3]; b.classList.add("on"); } else fb.innerHTML = '<b style="color:#FCA5A5">Not quite.</b> Try another one.'; };
        d.querySelector(".opts").appendChild(b);
      }); quiz.appendChild(d);
    });
    qw.appendChild(quiz); q.appendChild(qw); app.appendChild(q);
    var fin = h("footer", "final", '<div class="wrap"><h2>' + N.end[0] + "</h2><p>" + N.end[1] + '</p><a class="back" href="' + lessonFile + '">&larr; Back to ' + id + '</a><a class="back" href="index.html">&larr; Unit ' + u + '</a><a class="back" href="../index.html">&larr; Embedded Computing</a></div>');
    app.appendChild(fin);
    document.title = id + " " + N.title.replace(/<[^>]+>/g, "") + " | Embedded Computing Notes";
  }
  window.__notesGfx = G;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
