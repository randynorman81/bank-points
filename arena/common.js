/* shared by the student page and the host page */
(function (root) {
  var API = "/api/arena", offset = 0;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function api(body) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); }).then(function (j) { if (j && j.serverNow) offset = j.serverNow - Date.now(); return j; });
  }
  function serverNow() { return Date.now() + offset; }
  /* tiny Python highlighter: strings and comments first so their insides are never recolored */
  var KW = /\b(if|elif|else|for|while|in|range|and|or|not|True|False|None|def|return|import|from|print|input|int|str|float|len|type|bool)\b/;
  function hl(code) {
    var out = "", re = /("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(#[^\n]*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|([\s\S])/g, m;
    while ((m = re.exec(code))) {
      if (m[1]) out += '<span class="s">' + esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="c">' + esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="n">' + m[3] + "</span>";
      else if (m[4]) out += /^(if|elif|else|for|while|in|and|or|not|True|False|None|def|return|import|from)$/.test(m[4]) ? '<span class="k">' + m[4] + "</span>" : /^(print|input|int|str|float|len|type|bool|range)$/.test(m[4]) ? '<span class="f">' + m[4] + "</span>" : esc(m[4]);
      else out += esc(m[5]);
    }
    return out;
  }
  function codeBox(code, numbered) {
    if (!code) return "";
    if (!numbered) return '<div class="codebox">' + hl(code) + "</div>";
    return '<div class="codebox">' + code.split("\n").map(function (l, i) { return '<span class="ln">' + (i + 1) + "</span>" + hl(l); }).join("\n") + "</div>";
  }
  var MODE = { out: "Output", tf: "Blitz", trace: "Trace", bug: "Bug hunt", build: "Rebuild" };
  root.AR = { api: api, esc: esc, hl: hl, codeBox: codeBox, serverNow: serverNow, MODE: MODE };
})(window);
