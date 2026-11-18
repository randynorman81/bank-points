/* Puts "Your assignment" panels on a notes page and links them to the matching walkthrough in the Python Editor.
   Use: <div class="assign-root" data-concept="Booleans" data-slot="a16"></div>  then load this script.
   data-slot is the walkthrough's id in the editor. If it's missing, the script looks the concept up by its title,
   so a walkthrough added to the editor later links itself automatically. */
(function () {
  var EDITOR = "../python/editor.html";
  var css = document.createElement("style");
  css.textContent =
    ".asg{background:linear-gradient(120deg,var(--acc-tint,rgba(96,165,250,.14)),var(--card,#151A24) 65%);border:2px solid var(--acc,#60A5FA);border-radius:10px;padding:20px 24px;margin:26px 0 6px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}" +
    ".asg .ic{font-size:40px;line-height:1;flex:none}" +
    ".asg .tx{flex:1;min-width:240px}" +
    ".asg .lb{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc-ink,#BFDBFE)}" +
    ".asg h3{font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;color:#fff;margin:4px 0 6px}" +
    ".asg p{margin:0;font-size:15px;color:#C4CDD8}" +
    ".asg .steps{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}" +
    ".asg .st{font-size:13px;font-weight:700;color:#DDE6F2;background:rgba(0,0,0,.25);border:1px solid var(--rule,#232B38);border-radius:100px;padding:4px 11px}" +
    ".asg .st b{color:var(--acc,#60A5FA);margin-right:4px}" +
    ".asg a.go{flex:none;display:inline-block;background:var(--acc,#60A5FA);color:#0B0E14;font-weight:800;font-size:16px;text-decoration:none;border-radius:8px;padding:13px 20px}" +
    ".asg a.go:hover{filter:brightness(1.1)}" +
    ".asg .held{display:block;margin-top:8px;font-size:13.5px;color:#FCD34D;font-weight:700}" +
    ".asg.none{border-style:dashed;background:var(--card,#151A24)}";
  document.head.appendChild(css);

  var roots = document.querySelectorAll(".assign-root");
  if (!roots.length) return;
  function norm(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\b(and|in|python|the)\b/g, " ").replace(/\s+/g, " ").trim(); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function panel(root, item) {
    var concept = root.getAttribute("data-concept");
    if (!item) {
      root.innerHTML = '<div class="asg none"><div class="ic">📝</div><div class="tx"><div class="lb">Your assignment</div><h3>' + esc(concept) + '</h3><p>The Python Editor walkthrough for this concept isn\'t posted yet. Read these notes now; the assignment link shows up right here once it\'s ready.</p></div></div>';
      return;
    }
    var name = "Walkthrough " + item.num + ": " + (item.title || concept);
    root.innerHTML = '<div class="asg"><div class="ic">💻</div><div class="tx"><div class="lb">Your assignment · ' + esc(item.unitShort) + '</div><h3>' + esc(name) + '</h3><p>Do this walkthrough in the Python Editor. Sign in with your school Google account so it saves and counts.</p>' +
      '<div class="steps"><span class="st"><b>1</b>Read the notes on this page</span><span class="st"><b>2</b>Open the walkthrough</span><span class="st"><b>3</b>Score 90% or higher to unlock the next one</span></div>' +
      (item.held ? '<span class="held">🔒 Mr. Norman hasn\'t opened this one yet. It unlocks in class.</span>' : "") +
      '</div><a class="go" href="' + EDITOR + "?a=" + encodeURIComponent(item.id) + '" target="_blank" rel="noopener">Open in the Python Editor ▶</a></div>';
  }
  /* draw right away from the page's own data-slot, then fill in names from the editor */
  roots.forEach(function (r) { var s = r.getAttribute("data-slot"); panel(r, s ? { id: s, num: r.getAttribute("data-num") || "", title: r.getAttribute("data-concept"), unitShort: "Unit " + (r.getAttribute("data-unit") || "4"), held: false } : null); });
  fetch("/api/pycode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "assignments", period: "" }) })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (!j || !j.ok) return;
      var items = [];
      Object.keys(j.assignments || {}).forEach(function (id) { var a = j.assignments[id]; items.push({ id: id, unit: a.unit || "", title: a.title || "", num: a.num || Number(id.slice(1)), part: a.part || "assignment", held: false }); });
      (j.locked || []).forEach(function (L) { items.push({ id: L.id, unit: L.unit || "", title: L.concept || L.title || "", num: L.num, part: L.part || "assignment", held: !!L.held }); });
      roots.forEach(function (r) {
        var unit = r.getAttribute("data-unit") || "4", slot = r.getAttribute("data-slot"), want = norm(r.getAttribute("data-concept"));
        var mine = items.filter(function (x) { return x.part === "assignment" && new RegExp("^Unit " + unit + "\\b").test(x.unit); });
        var hit = slot ? mine.filter(function (x) { return x.id === slot; })[0] : null;
        if (!hit) hit = mine.filter(function (x) { return norm(x.title) === want; })[0] || mine.filter(function (x) { var t = norm(x.title); return t && (t.indexOf(want) > -1 || want.indexOf(t) > -1); })[0];
        if (hit) { hit.unitShort = "Unit " + unit; panel(r, hit); } else if (!slot) panel(r, null);
      });
    }).catch(function () {});
})();
