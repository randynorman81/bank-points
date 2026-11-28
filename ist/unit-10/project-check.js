/* Unit 7 capstone: requirements checker. Pure browser code (DOMParser + CSSOM), no server.
   PCHECK.run([{name:"index.html", text:"..."}, {name:"style.css", text:"..."}]) -> [{id, group, label, pass, detail}]
   Every check mirrors one line of the requirements list on the 7.1 lesson page. */
(function () {
  "use strict";
  var BAD_TITLES = ["", "document", "untitled", "title", "my website", "page title"];
  function norm(h) { h = String(h || "").trim(); if (!h || /^(https?:|mailto:|tel:|\/\/|javascript:)/i.test(h) || h.charAt(0) === "#") return ""; return h.split("#")[0].split("?")[0].replace(/^\.\//, "").replace(/^\//, "").toLowerCase(); }
  function rulesOf(cssText) {
    var out = [];
    try {
      var sh = new CSSStyleSheet(); sh.replaceSync(cssText);
      (function walk(list) {
        Array.prototype.forEach.call(list, function (r) {
          if (r.type === 1) out.push(r);
          else if (r.cssRules && r.type !== 7) walk(r.cssRules);
        });
      })(sh.cssRules);
    } catch (e) {}
    return out;
  }
  function parts(sel) { return sel.split(",").map(function (s) { return s.trim(); }).filter(Boolean); }
  function stripPseudo(s) { return s.replace(/::?(hover|focus|active|focus-visible|visited|before|after|first-child|last-child|nth-child\([^)]*\))/g, "").trim() || "*"; }
  function matchesAny(docs, sel) {
    var ok = false;
    parts(sel).forEach(function (p) { docs.forEach(function (d) { try { if (d.querySelector(stripPseudo(p))) ok = true; } catch (e) {} }); });
    return ok;
  }
  function hasProp(rule, re) { for (var i = 0; i < rule.style.length; i++) if (re.test(rule.style[i])) return true; return false; }
  function linksOf(root) { return Array.prototype.map.call(root.querySelectorAll("a[href]"), function (a) { return norm(a.getAttribute("href")); }).filter(Boolean); }

  function run(files) {
    var pages = [], css = {};
    files.forEach(function (f) {
      var n = String(f.name || "").toLowerCase().replace(/^.*[\\/]/, "");
      if (/\.html?$/.test(n)) pages.push({ name: n, doc: new DOMParser().parseFromString(f.text, "text/html") });
      else if (/\.css$/.test(n)) css[n] = f.text;
    });
    var cssAll = Object.keys(css).map(function (k) { return css[k]; }).join("\n");
    var rules = rulesOf(cssAll), docs = pages.map(function (p) { return p.doc; });
    var names = pages.map(function (p) { return p.name; });
    var home = pages.filter(function (p) { return p.name === "index.html"; })[0] || pages[0];
    var R = [];
    function add(id, group, label, pass, detail) { R.push({ id: id, group: group, label: label, pass: !!pass, detail: detail || "" }); }
    function every(fn) { return pages.length > 0 && pages.every(fn); }
    function bad(fn) { return pages.filter(function (p) { return !fn(p); }).map(function (p) { return p.name; }); }
    function listBad(a) { return a.length ? "Not met on: " + a.join(", ") : ""; }

    /* ---- Structure ---- */
    add("pages", "Structure", "At least 3 HTML pages", pages.length >= 3, pages.length + " page" + (pages.length === 1 ? "" : "s") + " found" + (pages.length ? " (" + names.join(", ") + ")" : ""));
    var homeLinks = home ? linksOf(home.doc) : [];
    var others = pages.filter(function (p) { return p !== home; });
    var missingOut = others.filter(function (p) { return homeLinks.indexOf(p.name) < 0; }).map(function (p) { return p.name; });
    add("home-links", "Structure", "Homepage (" + (home ? home.name : "index.html") + ") links to every other page", !!home && others.length > 0 && !missingOut.length, !home ? "No pages found" : others.length ? (missingOut.length ? "Homepage does not link to: " + missingOut.join(", ") : "") : "Only one page");
    var noBack = others.filter(function (p) { return home && linksOf(p.doc).indexOf(home.name) < 0; }).map(function (p) { return p.name; });
    add("back-links", "Structure", "Every other page links back to the homepage", others.length > 0 && !noBack.length, noBack.length ? "No link back to " + home.name + " on: " + noBack.join(", ") : "");
    var badT = bad(function (p) { var t = p.doc.title && p.doc.title.trim(); return t && BAD_TITLES.indexOf(t.toLowerCase()) < 0; });
    add("titles", "Structure", "Every page has a real title tag", every(function (p) { return badT.indexOf(p.name) < 0; }), listBad(badT));
    var badH = bad(function (p) { return p.doc.querySelector("h1") && p.doc.querySelector("h1").textContent.trim(); });
    add("h1", "Structure", "Every page has a heading 1", every(function (p) { return badH.indexOf(p.name) < 0; }), listBad(badH));
    var sheetsOf = function (p) { return Array.prototype.map.call(p.doc.querySelectorAll('link[rel~="stylesheet"][href]'), function (l) { return l.getAttribute("href").trim().toLowerCase(); }).sort().join("|"); };
    var sameLook = pages.length > 0 && pages.every(function (p) { return sheetsOf(p) === sheetsOf(pages[0]); });
    add("look", "Structure", "Every page links the same stylesheets (consistent look)", sameLook, sameLook ? "" : "The pages link different stylesheets");

    /* ---- HTML skills ---- */
    function any(sel) { return docs.some(function (d) { return d.querySelector(sel); }); }
    add("text", "HTML skills", "Headings, paragraphs, bold and italic text", any("h2,h3") && any("p") && any("b,strong") && any("i,em"), "Needs a second-level heading (h2 or h3), a p, a b/strong and an i/em somewhere");
    add("list", "HTML skills", "At least one list (ul or ol with 2+ li)", docs.some(function (d) { return Array.prototype.some.call(d.querySelectorAll("ul,ol"), function (l) { return !l.closest("nav,.navbar") && l.querySelectorAll(":scope > li").length >= 2; }); }), "A list in your navbar does not count: add a bullet or numbered list in the page content");
    function widthSet(img) {
      var w = parseFloat(img.getAttribute("width")); if (w > 0) return true;
      if (/(^|;)\s*(max-)?width\s*:/i.test(img.getAttribute("style") || "")) return true;
      return rules.some(function (r) { return hasProp(r, /^(max-)?width$/) && parts(r.selectorText).some(function (p) { try { return img.matches(stripPseudo(p)); } catch (e) { return false; } }); });
    }
    var goodImgs = 0, imgNote = [];
    docs.forEach(function (d) { Array.prototype.forEach.call(d.querySelectorAll("img"), function (i) { var alt = (i.getAttribute("alt") || "").trim(); if (alt && widthSet(i)) goodImgs++; else imgNote.push((i.getAttribute("src") || "an image") + (alt ? " has no width" : " has no alt text")); }); });
    add("images", "HTML skills", "At least 2 images, each with real alt text and a set width", goodImgs >= 2, goodImgs + " image" + (goodImgs === 1 ? "" : "s") + " meet this" + (imgNote.length ? " (" + imgNote.slice(0, 3).join("; ") + ")" : ""));
    var tableOk = docs.some(function (d) { return Array.prototype.some.call(d.querySelectorAll("table"), function (t) { var rows = t.querySelectorAll("tr"); return t.querySelector("th") && rows.length >= 2 && Array.prototype.some.call(rows, function (r) { return r.querySelectorAll("td").length >= 2; }); }); });
    add("table", "HTML skills", "A table with header cells (th) and at least one data row", tableOk, "");
    function declared(re) { return rules.some(function (r) { return hasProp(r, re); }); }
    var bm = ["padding", "border", "margin"].filter(function (k) { return !declared(new RegExp("^" + k)); });
    add("boxmodel", "HTML skills", "Padding, border and margin all used in your CSS", bm.length === 0, bm.length ? "Missing in your CSS file: " + bm.join(", ") : "");

    /* ---- CSS skills ---- */
    var cssNames = Object.keys(css), linkedLocal = pages.length > 0 && pages.every(function (p) { return Array.prototype.some.call(p.doc.querySelectorAll('link[rel~="stylesheet"][href]'), function (l) { var h = norm(l.getAttribute("href")); return h && cssNames.indexOf(h.replace(/^.*\//, "")) > -1; }); });
    add("ext-css", "CSS skills", "An external CSS file (like style.css) is uploaded and linked from every page", linkedLocal, cssNames.length ? "" : "No .css file was added");
    var inlineBad = bad(function (p) { return !p.doc.querySelector("style") && p.doc.querySelectorAll("[style]").length <= 3; });
    add("no-inline", "CSS skills", "Styling is in the CSS file: no style tags and at most 3 style attributes per page", every(function (p) { return inlineBad.indexOf(p.name) < 0; }), listBad(inlineBad));
    var classRule = rules.some(function (r) { return /\.[A-Za-z_]/.test(r.selectorText) && matchesAny(docs, r.selectorText); });
    add("class", "CSS skills", "A rule that uses a class selector (and a page uses that class)", classRule, "");
    var idRule = rules.some(function (r) { return /#[A-Za-z_]/.test(r.selectorText) && matchesAny(docs, r.selectorText); });
    add("id", "CSS skills", "A rule that uses an id selector (and a page uses that id)", idRule, "");
    var hoverOk = rules.some(function (h) {
      if (!/:hover/.test(h.selectorText)) return false;
      if (hasProp(h, /^transition/)) return true;
      var base = h.selectorText.replace(/:hover/g, "");
      return rules.some(function (b) { return b.selectorText.trim() === base.trim() && hasProp(b, /^transition/); });
    });
    add("hover", "CSS skills", "A hover effect with a transition", hoverOk, "Needs a :hover rule plus a transition on that element (in the normal rule or the hover rule)");
    var flexOk = rules.some(function (r) { var d = r.style.getPropertyValue("display"); return /(^|\s|-)(flex|grid)$/.test(d.trim()) && matchesAny(docs, r.selectorText); });
    add("flexgrid", "CSS skills", "A section laid out with flexbox or grid (display: flex or grid)", flexOk, "");

    /* ---- Bootstrap skills ---- */
    var bsBad = bad(function (p) { return p.doc.querySelector('head link[rel~="stylesheet"][href*="bootstrap" i]'); });
    add("bs-link", "Bootstrap skills", "The Bootstrap link is in the head of every page", every(function (p) { return bsBad.indexOf(p.name) < 0; }), listBad(bsBad));
    var navBad = bad(function (p) { return p.doc.querySelector(".navbar"); });
    var navSets = pages.map(function (p) { var n = p.doc.querySelector(".navbar"); return n ? linksOf(n).filter(function (h, i, a) { return a.indexOf(h) === i; }).sort() : null; });
    var navSame = navSets.length > 0 && navSets.every(function (s) { return s && s.join("|") === navSets[0].join("|"); });
    add("navbar", "Bootstrap skills", "A navbar (class navbar) on every page", every(function (p) { return navBad.indexOf(p.name) < 0; }), listBad(navBad));
    add("nav-same", "Bootstrap skills", "The navbar has the same links on every page", navSame, navSame ? "" : "The navbar links differ between pages (or a page has no navbar)");
    var navLinks = navSets[0] || [];
    var navWork = navSets.length > 0 && navSets.every(function (s) { return s && names.every(function (n) { return s.indexOf(n) > -1; }) && s.every(function (h) { return names.indexOf(h) > -1; }); });
    add("nav-links", "Bootstrap skills", "The navbar links to every page and every link goes to a page you made", navWork, navWork ? "" : "Navbar links: " + (navLinks.join(", ") || "none") + " | Pages: " + names.join(", "));
    var gridOk = docs.some(function (d) { return Array.prototype.some.call(d.querySelectorAll(".container,.container-fluid"), function (c) { return Array.prototype.some.call(c.querySelectorAll(".row"), function (r) { return Array.prototype.some.call(r.children, function (k) { return /(^|\s)col(-|\s|$)/.test(k.className); }); }); }); });
    add("bs-grid", "Bootstrap skills", "The grid: a container, with a row inside it, with col columns inside the row", gridOk, "");
    var cards = docs.reduce(function (a, d) { return a + d.querySelectorAll(".card").length; }, 0);
    add("cards", "Bootstrap skills", "At least 2 cards", cards >= 2, cards + " card" + (cards === 1 ? "" : "s") + " found");
    var formOk = docs.some(function (d) { return Array.prototype.some.call(d.querySelectorAll("form"), function (f) {
      var fields = Array.prototype.filter.call(f.querySelectorAll("input,select,textarea"), function (c) { return !/^(hidden|submit|button|reset|image)$/i.test(c.getAttribute("type") || ""); });
      var labeled = fields.filter(function (c) { var id = c.getAttribute("id"); return (id && f.querySelector('label[for="' + id.replace(/"/g, "") + '"]')) || (c.closest && c.closest("label")); });
      var submit = f.querySelector('input[type="submit"],button[type="submit"],button:not([type])');
      return labeled.length >= 2 && submit;
    }); });
    add("form", "Bootstrap skills", "A form with at least 2 labeled fields and a submit button", formOk, "Each field needs a label (for matching the field's id, or wrapping it)");
    return R;
  }
  window.PCHECK = { run: run };
})();
