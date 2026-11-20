/* Unit 8 notes pages: the "Walkthrough, then Assignment" panel.
   <div class="assign-root8" data-slot="a45" data-slot2="a55" data-concept="..."></div> */
(function () {
  var EDITOR = "../python/editor.html";
  var css = document.createElement("style");
  css.textContent =
    ".asg8{background:linear-gradient(120deg,var(--acc-tint,rgba(96,165,250,.14)),var(--card,#151A24) 65%);border:2px solid var(--acc,#60A5FA);border-radius:10px;padding:20px 24px;margin:26px 0 6px}" +
    ".asg8 .lb{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc-ink,#BFDBFE)}" +
    ".asg8 h3{font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;color:#fff;margin:4px 0 12px}" +
    ".asg8 .two{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}" +
    ".asg8 .card{background:rgba(0,0,0,.25);border:1px solid var(--rule,#232B38);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}" +
    ".asg8 .card b{color:#fff;font-size:16px}.asg8 .card p{margin:0;font-size:14.5px;color:#C4CDD8}" +
    ".asg8 .card .n{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:var(--acc,#60A5FA)}" +
    ".asg8 a.go{display:inline-block;align-self:flex-start;background:var(--acc,#60A5FA);color:#0B0E14;font-weight:800;font-size:15px;text-decoration:none;border-radius:8px;padding:10px 16px}" +
    ".asg8 a.go:hover{filter:brightness(1.1)}";
  document.head.appendChild(css);
  var roots = document.querySelectorAll(".assign-root8");
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  Array.prototype.forEach.call(roots, function (r) {
    var a = r.getAttribute("data-slot"), b = r.getAttribute("data-slot2"), c = r.getAttribute("data-concept");
    r.innerHTML = '<div class="asg8"><div class="lb">Your work · Unit 8</div><h3>' + esc(c) + '</h3><div class="two">' +
      '<div class="card"><span class="n">STEP 1 · THE DOOR</span><b>Walkthrough</b><p>Walk through these notes in the Python Editor. Get <b>every step and every question right (100%)</b>. This is not graded. It unlocks the assignment.</p><a class="go" href="' + EDITOR + "?a=" + encodeURIComponent(a) + '" target="_blank" rel="noopener">Open the walkthrough ▶</a></div>' +
      '<div class="card"><span class="n">STEP 2 · GRADED</span><b>Assignment</b><p>Use what you learned to build it yourself, with far less help. The editor checks your work as you go. <b>This is the one your teacher grades.</b></p><a class="go" href="' + EDITOR + "?a=" + encodeURIComponent(b) + '" target="_blank" rel="noopener">Open the assignment ▶</a></div>' +
      "</div></div>";
  });
})();
