/* Citation Generator: MLA 9 and APA 7 for books, websites, articles and videos. Runs entirely in the browser.
   DOK_CITE.cite(style, source) -> { html, text, intext, warnings }.
   source = { type: "book"|"website"|"article"|"video", authors:[{first,middle,last}|{org}], title, site, publisher, container, volume, issue, pages,
              edition, year, month, day, url, accessed:{year,month,day}, kind:"journal"|"magazine"|"newspaper", uploader, fixCase }  */
(function (root) {
  "use strict";
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MLA_MON = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const t = s => String(s == null ? "" : s).trim();
  const SMALL = new Set("a an the and but for nor or so yet at by in of off on per to up via as".split(" "));

  function monthNum(m) { if (!m && m !== 0) return 0; const n = parseInt(m, 10); if (n >= 1 && n <= 12) return n; const i = MONTHS.findIndex(x => x.toLowerCase().startsWith(String(m).toLowerCase().slice(0, 3))); return i >= 0 ? i + 1 : 0; }

  // ----- capitalization helpers -----
  function titleCase(s) { // MLA headline style
    s = t(s); if (!s) return s;
    const allCaps = s === s.toUpperCase() && /[A-Z]/.test(s);
    const words = s.split(/(\s+)/); const idx = words.map((w, i) => (/\S/.test(w) ? i : -1)).filter(i => i >= 0);
    const first = idx[0], last = idx[idx.length - 1]; let afterColon = false;
    return words.map((w, i) => {
      if (!/\S/.test(w)) return w;
      let base = allCaps ? w.toLowerCase() : w;
      if (!allCaps && /[A-Z]/.test(w.slice(1))) { afterColon = /[:?!]$/.test(w); return w; } // iPhone, NASA, McDonald
      const bare = base.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "").toLowerCase();
      const small = SMALL.has(bare) && i !== first && i !== last && !afterColon;
      const out = small ? base.toLowerCase() : base.replace(/[a-zA-Z]/, c => c.toUpperCase()).replace(/-([a-z])/g, (m, c) => "-" + c.toUpperCase());
      afterColon = /[:?!]$/.test(w);
      return out;
    }).join("");
  }
  function sentenceCase(s) { // APA 7 style
    s = t(s); if (!s) return s;
    const allCaps = s === s.toUpperCase() && /[A-Z]/.test(s); let startNew = true;
    return s.split(/(\s+)/).map(w => {
      if (!/\S/.test(w)) return w;
      let out;
      if (/^[A-Z]{2,}[^a-z]*$/.test(w) && !allCaps) out = w; // acronyms
      else if (!allCaps && /[A-Z]/.test(w.slice(1))) out = w; // iPhone, McDonald
      else if (/^i('|$)/.test(w.toLowerCase().replace(/[^a-z']/g, "")) && w.toLowerCase().replace(/[^a-z']/g, "") === "i") out = w.replace(/i/i, "I");
      else out = w.toLowerCase();
      if (startNew) out = out.replace(/[a-zA-Z]/, c => c.toUpperCase());
      startNew = /[:?!]$/.test(w);
      return out;
    }).join("");
  }

  // ----- authors -----
  const cleanAuthors = a => (a || []).filter(x => x && (t(x.org) || t(x.last) || t(x.first)));
  function initials(first, middle) {
    return [first, middle].map(t).filter(Boolean).join(" ").split(/\s+/).map(w => w.split("-").map(p => p ? p[0].toUpperCase() + "." : "").join("-")).join(" ");
  }
  function mlaName(a, flip) { const mid = /^[A-Za-z]$/.test(t(a.middle)) ? t(a.middle) + "." : t(a.middle); const f = [t(a.first), mid].filter(Boolean).join(" "); return flip ? (t(a.last) + (f ? ", " + f : "")) : (f ? f + " " : "") + t(a.last); }
  function mlaAuthors(list) {
    list = cleanAuthors(list); if (!list.length) return "";
    if (list.length === 1) return list[0].org ? t(list[0].org) : mlaName(list[0], true);
    if (list.length === 2) return mlaName(list[0], true) + ", and " + mlaName(list[1], false);
    return mlaName(list[0], true) + ", et al.";
  }
  const apaName = a => (a.org ? t(a.org) : t(a.last) + (t(a.first) || t(a.middle) ? ", " + initials(a.first, a.middle) : ""));
  function apaAuthors(list) {
    list = cleanAuthors(list); if (!list.length) return "";
    const n = list.map(apaName);
    if (n.length === 1) return n[0];
    if (n.length === 2) return n[0] + ", & " + n[1];
    if (n.length <= 20) return n.slice(0, -1).join(", ") + ", & " + n[n.length - 1];
    return n.slice(0, 19).join(", ") + ", . . . " + n[n.length - 1];
  }
  const surname = a => t(a.org) || t(a.last);

  // ----- dates -----
  function mlaDate(y, m, d) { y = t(y); if (!y) return ""; const mn = monthNum(m); return [t(d) && mn ? parseInt(d, 10) : "", mn ? MLA_MON[mn - 1] : "", y].filter(x => x !== "").join(" "); }
  function apaDate(y, m, d, withMonth) { y = t(y); if (!y) return "n.d."; const mn = monthNum(m); if (!withMonth || !mn) return y; return y + ", " + MONTHS[mn - 1] + (t(d) ? " " + parseInt(d, 10) : ""); }
  const endWith = (s, ch) => (!s ? s : /[.?!]["”']?$/.test(s) ? s : s + (ch || "."));
  const join = (parts, sep) => parts.map(t).filter(Boolean).join(sep || ", ");
  const pagesFmt = (p, mla) => { p = t(p); if (!p) return ""; const range = /[-–,]/.test(p); return mla ? (range ? "pp. " : "p. ") + p.replace(/-/g, "–") : p.replace(/-/g, "–"); };
  const urlFor = (u, mla) => { u = t(u); if (!u) return ""; return mla ? u.replace(/^https?:\/\//i, "") : u; };

  // ----- the two styles -----
  function mla(s, w) {
    const A = mlaAuthors(s.authors), fix = s.fixCase !== false, T = fix ? titleCase(s.title) : t(s.title);
    const site = fix ? titleCase(s.site) : t(s.site), cont = fix ? titleCase(s.container) : t(s.container);
    const date = mlaDate(s.year, s.month, s.day), acc = s.accessed && t(s.accessed.year) ? mlaDate(s.accessed.year, s.accessed.month, s.accessed.day) : "";
    const url = urlFor(s.url, true); let H = "", X = "";
    const head = (title, italic) => { const a = A ? endWith(esc(A)) + " " : ""; const ti = title ? (italic ? "<i>" + esc(title) + "</i>." : "“" + esc(endWith(title)) + "”") : ""; return a + (ti ? ti + " " : ""); };
    if (s.type === "book") {
      H = head(T, true) + endWith(esc(join([s.edition ? t(s.edition) + " ed." : "", s.publisher, s.year])));
      if (!A && !T) w.push("Add the title of the book.");
    } else if (s.type === "website") {
      const sameSite = site && t(s.publisher) && site.toLowerCase() === t(s.publisher).toLowerCase();
      H = head(T, false) + endWith(esc(join([site ? "\u0001" + site + "\u0002" : "", sameSite ? "" : s.publisher, date, url])).replace(/\u0001/g, "<i>").replace(/\u0002/g, "</i>"));
      if (acc) H += " Accessed " + esc(acc) + ".";
      if (!site) w.push("Add the website name (for example, the name at the top of the page).");
    } else if (s.type === "article") {
      const kind = s.kind || "journal";
      const c = cont ? "\u0001" + cont + "\u0002" : "";
      const parts = kind === "journal" ? [c, s.volume ? "vol. " + t(s.volume) : "", s.issue ? "no. " + t(s.issue) : "", s.year, pagesFmt(s.pages, true), url] : [c, date, pagesFmt(s.pages, true), url];
      H = head(T, false) + endWith(esc(join(parts)).replace(/\u0001/g, "<i>").replace(/\u0002/g, "</i>"));
      if (!cont) w.push("Add the name of the " + kind + " the article is in.");
    } else if (s.type === "video") {
      const site2 = site || "YouTube";
      H = head(T, false) + endWith(esc(join(["\u0001" + site2 + "\u0002", s.uploader && t(s.uploader) !== A ? "uploaded by " + t(s.uploader) : "", date, url])).replace(/\u0001/g, "<i>").replace(/\u0002/g, "</i>"));
    }
    if (!A && s.type !== "book") w.push("No author: the citation starts with the title. That is correct when no person or group is named.");
    if (!date && !t(s.year) && s.type !== "book") w.push("No publication date found: that is allowed in MLA, just leave it out.");
    return H.trim();
  }
  function apa(s, w) {
    const A = apaAuthors(s.authors), fix = s.fixCase !== false;
    const T = fix ? sentenceCase(s.title) : t(s.title), site = t(s.site), cont = t(s.container);
    const dateFull = apaDate(s.year, s.month, s.day, true), yearOnly = apaDate(s.year, s.month, s.day, false);
    const url = urlFor(s.url, false); let H = "";
    const lead = (title, d) => (A ? endWith(esc(A)) + " (" + esc(d) + "). " : (title ? "" : "")); // author and date
    const noAuthor = (titleHtml, d) => titleHtml + " (" + esc(d) + ")."; // APA: title moves to the author spot
    if (s.type === "book") {
      const ed = s.edition ? " (" + t(s.edition) + " ed.)" : "";
      const ti = "<i>" + esc(T) + "</i>" + esc(ed) + ".";
      H = A ? lead(T, yearOnly) + ti + (t(s.publisher) ? " " + esc(endWith(t(s.publisher))) : "") : noAuthor("<i>" + esc(T) + "</i>" + esc(ed), yearOnly) + (t(s.publisher) ? " " + esc(endWith(t(s.publisher))) : "");
    } else if (s.type === "website") {
      const sameSite = A && site && t(A).toLowerCase() === site.toLowerCase();
      const ti = "<i>" + esc(T) + "</i>.";
      const tail = (!sameSite && site ? " " + esc(endWith(site)) : "") + (url ? " " + esc(url) : "");
      H = A ? lead(T, dateFull) + ti + tail : noAuthor("<i>" + esc(T) + "</i>", dateFull) + tail;
      if (!site && A) w.push("Add the website name if it is different from the author.");
    } else if (s.type === "article") {
      const kind = s.kind || "journal";
      const d = kind === "journal" ? yearOnly : dateFull;
      const vol = s.volume ? "<i>" + esc(cont ? cont + ", " : "") + esc(t(s.volume)) + "</i>" : "<i>" + esc(cont) + "</i>";
      const volPart = (kind === "journal" || s.volume) ? vol + (s.issue ? "(" + esc(t(s.issue)) + ")" : "") : "<i>" + esc(cont) + "</i>";
      const where = endWith(volPart + (s.pages ? ", " + esc(pagesFmt(s.pages, false)) : ""));
      const body = esc(endWith(T)) + " " + where + (url ? " " + esc(url) : "");
      H = A ? lead(T, d) + body : esc(endWith(T)) + " (" + esc(d) + "). " + where + (url ? " " + esc(url) : "");
      if (!cont) w.push("Add the name of the " + kind + " the article is in.");
    } else if (s.type === "video") {
      const site2 = site || "YouTube", who = A || (s.uploader ? esc(endWith(t(s.uploader))) : "");
      const ti = "<i>" + esc(T) + "</i> [Video].";
      H = (who ? (A ? endWith(esc(A)) : who) + " (" + esc(dateFull) + "). " : "") + ti + " " + esc(endWith(site2)) + (url ? " " + esc(url) : "");
    }
    if (yearOnly === "n.d." && s.type !== "book") w.push("No date found, so “(n.d.)” is used. Check the page footer or the “published” or “updated” line.");
    if (!A) w.push("No author: the title moves to the front. If an organization wrote it, enter it as the author.");
    if (fix) w.push("Titles are changed to APA sentence case (only the first word, names and acronyms are capitalized). Check proper nouns.");
    return H.trim();
  }
  function intext(style, s) {
    const list = cleanAuthors(s.authors); const yr = t(s.year) || "n.d."; const pg = t(s.pages).split(/[-–,]/)[0].trim();
    let who;
    if (!list.length) { const ti = t(s.title) || "Title"; const short = ti.split(/\s+/).slice(0, 4).join(" "); who = style === "mla" ? "“" + titleCase(short) + "”" : "“" + titleCase(short) + ",”"; }
    else if (list.length === 1) who = surname(list[0]);
    else if (list.length === 2) who = surname(list[0]) + (style === "mla" ? " and " : " & ") + surname(list[1]);
    else who = surname(list[0]) + " et al.";
    if (style === "mla") return "(" + who + (pg && s.type !== "website" ? " " + pg : "") + ")";
    return "(" + (list.length ? who + ", " : who + " ") + yr + ")";
  }
  function stripTags(h) { return h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
  function cite(style, source) {
    const w = []; const html = style === "apa" ? apa(source, w) : mla(source, w);
    return { html, text: stripTags(html), intext: intext(style, source), warnings: [...new Set(w)] };
  }
  function sortKey(style, source) {
    const a = cleanAuthors(source.authors)[0]; const k = a ? surname(a) : t(source.title);
    return k.replace(/^(a|an|the)\s+/i, "").toLowerCase();
  }
  root.DOK_CITE = { cite, sortKey, titleCase, sentenceCase, MONTHS, intext };
  if (typeof module !== "undefined" && module.exports) module.exports = root.DOK_CITE;
})(typeof window !== "undefined" ? window : globalThis);
