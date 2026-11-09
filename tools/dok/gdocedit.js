// Updates the teacher's own Google Doc with the finished test, using the Google Docs API from the teacher's browser.
// The teacher signs in with Google and approves access; nothing is stored on the site.
// DOK_GDOC.buildRequests(doc, questions, answerKeyText) finds each changed question in the document and returns the batchUpdate requests.
(function (root) {
  const NUM = /^\s*(?:Q(?:uestion)?\s*#?\s*)?\d{1,3}\s*[.):\-]\s*/i;
  const CHO = /^\(?[A-Ha-h][.)]\s+/;
  const norm = s => String(s).replace(/[\u000b ]/g, " ").replace(/\s+/g, " ").trim().replace(NUM, "").replace(CHO, "").toLowerCase();

  // every paragraph in the document (including those inside tables), in order
  function paragraphs(content, out) {
    out = out || [];
    (content || []).forEach(el => {
      if (el.paragraph) {
        const raw = (el.paragraph.elements || []).map(e => (e.textRun ? e.textRun.content : "")).join("");
        out.push({ start: el.startIndex, end: el.endIndex, raw: raw.replace(/\n$/, "") });
      } else if (el.table) {
        (el.table.tableRows || []).forEach(r => (r.tableCells || []).forEach(c => paragraphs(c.content, out)));
      }
    });
    return out;
  }

  function buildRequests(doc, questions, keyText) {
    const P = paragraphs(doc.body && doc.body.content).filter(p => p.raw.trim());
    const found = [], missing = [];
    let from = 0;
    questions.filter(q => q.edited && q.question !== q.base).forEach(q => {
      const lines = String(q.base).split("\n").map(norm).filter(Boolean);
      if (!lines.length) { missing.push(q.label); return; }
      let hit = -1;
      for (let i = from; i < P.length && hit < 0; i++) {
        if (norm(P[i].raw) !== lines[0]) continue;
        let ok = true;
        for (let k = 1; k < lines.length; k++) if (!P[i + k] || norm(P[i + k].raw) !== lines[k]) { ok = false; break; }
        if (ok) hit = i;
      }
      if (hit < 0) { missing.push(q.label); return; }
      const first = P[hit], last = P[hit + lines.length - 1];
      const prefix = (first.raw.match(NUM) || [""])[0].length;   // a number typed into the text is kept
      found.push({ label: q.label, start: first.start + prefix, end: last.end - 1, text: q.question });
      from = hit + lines.length;
    });
    found.sort((a, b) => b.start - a.start);   // later questions first so earlier positions stay valid
    const requests = [];
    found.forEach(f => {
      if (f.end > f.start) requests.push({ deleteContentRange: { range: { startIndex: f.start, endIndex: f.end } } });
      requests.push({ insertText: { location: { index: f.start }, text: f.text } });
    });
    if (found.length && keyText) requests.push({ insertText: { endOfSegmentLocation: { segmentId: "" }, text: "\n\n" + keyText + "\n" } });
    return { requests, found: found.map(f => f.label).reverse(), missing };
  }

  const api = { buildRequests, paragraphs, norm };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.DOK_GDOC = api;
})(typeof window !== "undefined" ? window : globalThis);
