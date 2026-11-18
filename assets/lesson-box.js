/* Puts a "Your assignment" box at the top of a notes page, the same way the Python notes pages work (IST Unit 3 and beyond, and the EC Arduino units).
   The notes page only needs:   <div class="wrap"><div class="assign-root"></div></div>   and   <script src="../../assets/lesson-box.js"></script>
   The box finds its lesson page from the "Back to 3.5" / "3.5 Lesson Page" link in the page's top nav, then copies from that lesson page: the title,
   the due line, the assignment description, the Bell Ringer, and any extra links (slides, handouts). The editor button always opens in a NEW TAB,
   so the notes and the assignment can be open side by side. A lesson with no assignment (no editor link) gets no box. Edit the lesson page and this box follows. */
(function () {
  var root = document.querySelector(".assign-root");
  if (!root) return;
  var css = document.createElement("style");
  css.textContent =
    ".asg{background:linear-gradient(120deg,var(--acc-tint,rgba(96,165,250,.14)),var(--card,#151A24) 65%);border:2px solid var(--acc,#60A5FA);border-radius:10px;padding:20px 24px;margin:26px 0 6px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}" +
    ".asg .ic{font-size:40px;line-height:1;flex:none}" +
    ".asg .tx{flex:1;min-width:240px}" +
    ".asg .lb{font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--acc-ink,#BFDBFE)}" +
    ".asg h3{font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:600;color:#fff;margin:4px 0 6px}" +
    ".asg p{margin:0 0 6px;font-size:15px;color:#C4CDD8}" +
    ".asg .due{font-weight:700;color:#FCD34D}" +
    ".asg .steps{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}" +
    ".asg .st{font-size:13px;font-weight:700;color:#DDE6F2;background:rgba(0,0,0,.25);border:1px solid var(--rule,#232B38);border-radius:100px;padding:4px 11px}" +
    ".asg .st b{color:var(--acc,#60A5FA);margin-right:4px}" +
    ".asg a.go{flex:none;display:inline-block;background:var(--acc,#60A5FA);color:#0B0E14;font-weight:800;font-size:16px;text-decoration:none;border-radius:8px;padding:13px 20px}" +
    ".asg a.go:hover{filter:brightness(1.1)}" +
    ".asg .more{flex-basis:100%;margin-top:2px}" +
    ".asg details{background:rgba(0,0,0,.22);border:1px solid var(--rule,#232B38);border-radius:8px;padding:10px 14px;margin-top:8px}" +
    ".asg summary{cursor:pointer;font-weight:700;color:#fff}" +
    ".asg details ol{margin:10px 0 2px 20px;padding:0;color:#C4CDD8;font-size:15px}.asg details li{margin:0 0 8px}" +
    ".asg .res{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}" +
    ".asg .res a{font-size:14px;font-weight:700;color:var(--acc-ink,#BFDBFE);border:1px solid var(--rule,#232B38);border-radius:100px;padding:6px 13px;text-decoration:none;background:rgba(0,0,0,.2)}";
  document.head.appendChild(css);

  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function clean(t) { return String(t || "").replace(/\s+/g, " ").trim(); }
  function short(t, n) { t = clean(t); if (t.length <= n) return t; var c = t.slice(0, n), i = c.lastIndexOf(" "); return c.slice(0, i > 60 ? i : n) + "…"; }

  /* the lesson page = the "Back to 3.x" or "3.x Lesson Page" link in the pill nav at the top (for example 6-35-google-fonts.html), never the notes page itself */
  var lessonHref = "";
  [].forEach.call(document.querySelectorAll(".pillnav a"), function (a) { var h = a.getAttribute("href") || ""; if (!lessonHref && /^\d+-\d+[^\/]*\.html/.test(h) && !/-notes\.html/.test(h)) lessonHref = h; });
  if (!lessonHref) { root.style.display = "none"; return; }
  var lessonUrl = new URL(lessonHref, location.href).href;

  function draw(d) {
    var h = '<div class="asg"><div class="ic">💻</div><div class="tx"><div class="lb">Your assignment</div><h3>' + esc(d.title) + "</h3>";
    h += "<p>" + (d.desc ? esc(short(d.desc, 170)) : "Do this assignment in the editor. Sign in with your school Google account first.") + "</p>";
    if (d.due) h += '<p class="due">' + esc(d.due) + "</p>";
    h += '<div class="steps"><span class="st"><b>1</b>Read these notes</span><span class="st"><b>2</b>Open the assignment (it opens in a new tab)</span><span class="st"><b>3</b>Keep both open side by side</span></div></div>';
    h += '<a class="go" href="' + esc(d.editor) + '" target="_blank" rel="noopener">Open the assignment ▶</a>';
    if (d.bell && d.bell.length) h += '<div class="more"><details><summary>' + esc(d.bellLabel || "Bell Ringer") + "</summary><ol>" + d.bell.map(function (q) { return "<li>" + esc(q) + "</li>"; }).join("") + "</ol></details></div>";
    if (d.res && d.res.length) h += '<div class="more res">' + d.res.map(function (r) { return '<a href="' + esc(r.href) + '" target="_blank" rel="noopener">' + esc(r.text) + "</a>"; }).join("") + "</div>";
    root.innerHTML = h + "</div>";
  }

  fetch(lessonUrl).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (html) {
    var doc = new DOMParser().parseFromString(html, "text/html"), d = {};
    var ed = doc.querySelector('a[href*="editor.html?"]');
    if (!ed) { root.style.display = "none"; return; }                       /* no assignment in this lesson: no box */
    d.editor = new URL(ed.getAttribute("href"), lessonUrl).href;
    var h1 = doc.querySelector("h1"); d.title = h1 ? clean(h1.textContent) : clean(document.title.split("|")[0]);
    var nx = ed.nextElementSibling; if (nx && /hint/.test(nx.className || "")) d.desc = clean(nx.textContent);
    [].some.call(doc.querySelectorAll("p.hint"), function (p) { var t = clean(p.textContent); if (/\bdue\b/i.test(t) && t.length < 120) { d.due = t; return true; } return false; });
    var bell = doc.querySelector(".bell-ringer");
    if (bell) { var lab = bell.querySelector(".bell-ringer-label"); d.bellLabel = lab ? clean(lab.textContent).replace(/^[^A-Za-z]+/, "") : "Bell Ringer"; d.bell = [].map.call(bell.querySelectorAll("li"), function (li) { return clean(li.textContent); }); }
    d.res = [];
    [].forEach.call(doc.querySelectorAll("a.resource-link"), function (a) {
      var href = a.getAttribute("href") || "";
      if (/editor\.html/.test(href) || /notes\.html/.test(href) || /study-guide/.test(href)) return;
      d.res.push({ href: new URL(href, lessonUrl).href, text: clean(a.textContent).replace(/^[^A-Za-z0-9]+/, "") });
    });
    draw(d);
  }).catch(function () { root.style.display = "none"; });
})();
