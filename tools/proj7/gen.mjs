// Builds a complete, correct Unit 7 student site, with one switch per requirement that removes exactly that requirement.
const BS = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css" rel="stylesheet">';
export function site(o = {}) {
  const pagesAll = ["index.html", "about.html", "gallery.html", "contact.html"];
  const pages = o.pages || pagesAll;
  const nav = (cur) => {
    let links = pages.slice();
    if (o.navMissing && o.navMissing.page === cur) links = links.filter((l) => l !== o.navMissing.link);
    if (o.navBad && o.navBad === cur) links = links.concat("missing.html");
    return `<nav class="navbar navbar-expand bg-dark navbar-dark px-3"><ul class="navbar-nav">${links.map((l) => `<li class="nav-item"><a class="nav-link" href="${l}">${l.replace(".html", "")}</a></li>`).join("")}</ul></nav>`;
  };
  const head = (name, title) => `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><title>${o.titleBad === name ? "Document" : title}</title>\n${o.noBs === name ? "" : BS}\n<link rel="stylesheet" href="style.css">${o.extraCss === name ? '\n<link rel="stylesheet" href="extra.css">' : ""}${o.styleTag === name ? "<style>p{color:red}</style>" : ""}</head>`;
  const h1 = (name, t) => (o.noH1 === name ? `<h2>${t}</h2>` : `<h1>${t}</h1>`);
  const body = {
    "index.html": () => `<div class="container"><div class="row"><div class="col-md-8"><h2>Welcome</h2><p>This site is about <b>retro games</b>${o.noItalic ? "" : " and <i>why they last</i>"}.</p>${o.noList ? "" : "<ul><li>Platformers</li><li>Puzzlers</li></ul>"}</div>${o.noGrid ? "" : ""}<div class="col-md-4" id="side"><p class="note">Updated weekly.</p></div></div></div>`,
    "about.html": () => `<div class="container"><div class="row"><div class="col"><h2>About</h2><p>I have played since I was six.</p>${o.noItalic ? "" : "<p><em>Still learning.</em></p>"}${o.noTable ? "" : "<table><tr><th>Game</th><th>Year</th></tr><tr><td>Tetris</td><td>1984</td></tr></table>"}</div></div></div>`,
    "gallery.html": () => `<div class="container"><div class="row d-flex gallery">${o.oneImg ? "" : '<img src="a.png" alt="A pixel hero" width="200">'}<img src="b.png" alt="${o.imgNoAlt ? "" : "A pixel map"}"${o.imgNoWidth ? "" : ' width="200"'}></div>${o.oneCard ? '<div class="card"><div class="card-body">One</div></div>' : '<div class="row"><div class="col"><div class="card"><div class="card-body">One</div></div></div><div class="col"><div class="card"><div class="card-body">Two</div></div></div></div>'}</div>`,
    "contact.html": () => `<div class="container"><div class="row"><div class="col"><h2>Contact</h2><form><label for="n">Name</label><input id="n" type="text">${o.formNoLabel ? '<input id="e" type="email">' : '<label for="e">Email</label><input id="e" type="email">'}${o.formNoSubmit ? "" : '<button type="submit">Send</button>'}</form></div></div></div>`
  };
  const titles = { "index.html": "Retro Home", "about.html": "About Me", "gallery.html": "Gallery", "contact.html": "Contact" };
  const files = pages.map((n) => {
    let b = body[n]();
    if (o.noNavbar === n) return { name: n, text: `${head(n, titles[n])}<body>${h1(n, titles[n])}${b}</body></html>` };
    return { name: n, text: `${head(n, titles[n])}<body>${nav(n)}${h1(n, titles[n])}${b}</body></html>` };
  });
  if (o.homeNoLinks) { /* home loses links to about via nav only if nav also lacks it */ }
  let css = `body { margin: 0; }\n.note { padding: 8px; border: 1px solid #888; margin: 10px; }\n#side { background: #eee; }\n.gallery { display: flex; gap: 8px; }\na.nav-link { transition: color .3s; }\na.nav-link:hover { color: gold; }\n`;
  if (o.noPadding) css = css.replace("padding: 8px; ", "");
  if (o.noClass) css = css.replace(".note {", "section {").replace(".gallery {", "div:has(> img) {").split("a.nav-link").join("a");
  if (o.noId) css = css.replace("#side", "aside");
  if (o.noFlex) css = css.replace("display: flex; ", "");
  if (o.hoverNoTransition) css = css.replace("transition: color .3s;", "");
  if (o.imgWidthCss) css += "img { width: 200px; }\n";
  const out = o.noCssFile ? files : files.concat({ name: "style.css", text: css });
  if (o.extraCss) out.push({ name: "extra.css", text: "p{margin:0}" });
  return out;
}
