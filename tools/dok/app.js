const $ = id => document.getElementById(id);
const NAMES = DOK.NAMES;
const COL = {1: "var(--d1)", 2: "var(--d2)", 3: "var(--d3)", 4: "var(--d4)"};
let picked = null, questions = [], filter = 0, fileName = "";

if (window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// ---------- file intake ----------
const drop = $("drop"), fileIn = $("file");
drop.onclick = () => fileIn.click();
drop.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileIn.click(); } };
drop.ondragover = e => { e.preventDefault(); drop.classList.add("over"); };
drop.ondragleave = () => drop.classList.remove("over");
drop.ondrop = e => { e.preventDefault(); drop.classList.remove("over"); if (e.dataTransfer.files[0]) take(e.dataTransfer.files[0]); };
fileIn.onchange = () => { if (fileIn.files[0]) take(fileIn.files[0]); };
$("paste").oninput = () => { if ($("paste").value.trim()) { picked = null; $("picked").hidden = true; } refresh(); };

async function pdfText(buf) {
  if (!window.pdfjsLib) throw new Error("PDF reader didn't load. Check your connection or paste the text instead.");
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const t = await (await doc.getPage(i)).getTextContent();
    let line = [], y = null;
    for (const it of t.items) {
      const yy = Math.round(it.transform[5]);
      if (y !== null && Math.abs(yy - y) > 3 && line.length) { out.push(line.join(" ")); line = []; }
      y = yy; line.push(it.str);
      if (it.hasEOL) { out.push(line.join(" ")); line = []; }
    }
    out.push(line.join(" "));
  }
  return out.join("\n");
}

async function take(f) {
  showErr(""); picked = null; $("paste").value = "";
  const ext = (f.name.split(".").pop() || "").toLowerCase();
  try {
    let text;
    if (ext === "pdf") {
      text = await pdfText(await f.arrayBuffer());
      if (text.replace(/\s/g, "").length < 40) throw new Error("No readable text in that PDF. It may be a scan or image. Paste the text instead.");
    } else if (ext === "docx") {
      if (!window.mammoth) throw new Error("Word reader didn't load. Check your connection or upload a PDF.");
      text = (await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() })).value;
    } else if (ext === "csv") text = csvToText(await f.text());
    else if (["txt", "md"].includes(ext)) text = await f.text();
    else throw new Error(ext === "doc" ? "Old .doc files aren't supported. Save as .docx or PDF." : "Use a PDF, .docx, .csv or .txt file.");
    picked = { name: f.name, text };
  } catch (e) { showErr(e.message); }
  $("picked").hidden = !picked;
  if (picked) $("picked").textContent = "Ready: " + picked.name;
  refresh();
}
// CSV: one question per row. If there is a header with a question/prompt column, that column is the question and the other columns
// (answer choices, etc.) are added after it; otherwise each non-empty row is one question.
function parseCsv(s) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(cell); cell = ""; if (row.some(x => x.trim())) rows.push(row); row = []; }
    else cell += c;
  }
  row.push(cell); if (row.some(x => x.trim())) rows.push(row);
  return rows;
}
function csvToText(s) {
  const rows = parseCsv(s.replace(/^﻿/, ""));
  if (!rows.length) return "";
  const head = rows[0].map(x => x.trim().toLowerCase());
  const qi = head.findIndex(x => /^(question|questions|prompt|item|q|text|question text)$/.test(x));
  const body = qi > -1 ? rows.slice(1) : rows;
  return body.map((r, i) => {
    const main = qi > -1 ? r[qi] : r.filter(x => x.trim()).join(" ");
    const rest = qi > -1 ? r.filter((x, j) => j !== qi && x.trim() && !/^\d+$/.test(x.trim())).join("  ") : "";
    return (i + 1) + ". " + String(main || "").replace(/\s+/g, " ").trim() + (rest ? "  " + rest : "");
  }).filter(l => /\d+\.\s*\S/.test(l)).join("\n");
}

// Google Doc link: the site fetches the text of a doc that is shared "Anyone with the link can view"
$("gdgo").onclick = async () => {
  showErr("");
  const v = $("gdlink").value.trim();
  const m = v.match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/) || v.match(/^([A-Za-z0-9_-]{25,})$/);
  if (!m) return showErr("Paste the full link to a Google Doc (it looks like docs.google.com/document/d/...).");
  $("gdgo").disabled = true; $("gdgo").textContent = "Loading...";
  try {
    const r = await fetch("/api/gdoc?id=" + encodeURIComponent(m[1]));
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "Couldn't read that document.");
    picked = { name: "Google Doc", text: j.text }; $("paste").value = "";
    $("picked").hidden = false; $("picked").textContent = "Ready: Google Doc";
    refresh();
  } catch (e) { showErr(e.message); }
  $("gdgo").disabled = false; $("gdgo").textContent = "Load Google Doc";
};
$("gdlink").onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); $("gdgo").click(); } };

function refresh() { $("go").disabled = !(picked || $("paste").value.trim()); }
function showErr(m) { $("err").hidden = !m; $("err").textContent = m; }

// ---------- analyze ----------
$("go").onclick = () => {
  showErr("");
  const text = picked ? picked.text : $("paste").value;
  fileName = picked ? picked.name.replace(/\.[^.]+$/, "") : "Pasted test";
  questions = DOK.analyze(text); filter = 0;
  questions.forEach(q => { q.base = q.question; q.dok0 = q.dok; q.why0 = q.why; });
  $("rawtext").textContent = text;
  if (!questions.length) return showErr("Couldn't find any questions. Number them like 1. 2. 3. and try again.");
  $("setup").hidden = true; $("results").hidden = false;
  $("title").textContent = fileName;
  render();
};

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function render() {
  const { counts, pct, n } = DOK.tally(questions);
  $("status").textContent = n + " questions found";
  $("stack").innerHTML = [1, 2, 3, 4].map(l => counts[l] ? `<div style="width:${counts[l] / n * 100}%;background:${COL[l]}">${pct[l]}%</div>` : "").join("");
  $("legend").innerHTML = [1, 2, 3, 4].map(l => `<div><span class="dot" style="background:${COL[l]}"></span><b>DOK ${l}</b> ${NAMES[l]}: ${pct[l]}% (${counts[l]})</div>`).join("");
  const hi = pct[3] + pct[4];
  $("advice").textContent = hi >= 40 ? `${Math.round(hi)}% of this test is DOK 3-4, a strong balance of deeper thinking.`
    : hi >= 20 ? `${Math.round(hi)}% of this test is DOK 3-4.`
    : `Only ${Math.round(hi)}% of this test is DOK 3-4; it mostly measures recall and routine skills.`;

  $("filter").innerHTML = [0, 1, 2, 3, 4].map(l => `<button data-f="${l}" class="${filter === l ? "on" : ""}">${l ? "DOK " + l : "All"}</button>`).join("");
  $("filter").querySelectorAll("button").forEach(b => b.onclick = () => { filter = +b.dataset.f; render(); });

  $("list").innerHTML = questions.filter(q => !filter || q.dok === filter).map(card).join("");
  $("list").querySelectorAll("button[data-dok]").forEach(b => b.onclick = () => {
    const q = questions.find(x => x.n === +b.dataset.n);
    if (q.dok === +b.dataset.dok) return;
    setLevel(q, +b.dataset.dok); render();
  });
  $("list").querySelectorAll("button[data-act]").forEach(b => b.onclick = () => {
    const q = questions.find(x => x.n === +b.dataset.n), act = b.dataset.act;
    if (act === "another" && q.alts && q.alts.length > 1) { q.altIdx = (q.altIdx + 1) % q.alts.length; useAlt(q); }
    else if (act === "reset") { restore(q); }
    else if (act === "copy") { navigator.clipboard && navigator.clipboard.writeText(q.question); b.textContent = "Copied"; setTimeout(() => { b.textContent = "Copy"; }, 1200); return; }
    render();
  });
  $("list").querySelectorAll("textarea.rw").forEach(t => {
    t.oninput = () => { const q = questions.find(x => x.n === +t.dataset.n); q.question = t.value; q.hand = true; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; };
    t.style.height = "auto"; t.style.height = t.scrollHeight + "px";
  });
}

// Changing a question's DOK level rewrites the question itself (free, rule-based; see rewrite.js)
function restore(q) { q.question = q.base; q.dok = q.dok0; q.why = q.why0; q.edited = false; q.alts = null; q.hand = false; q.note = ""; }
function useAlt(q) {
  q.question = q.alts[q.altIdx]; q.hand = false;
  const ok = q.verified[q.altIdx];
  q.why = `Rewritten for DOK ${q.dok} (${NAMES[q.dok]}). ${DOK.MEANS[q.dok]} ` + (ok ? `Check: the new wording rates DOK ${q.dok} on the same scale the analyzer uses.` : "This is a best effort. Read it over and adjust the wording.");
}
function setLevel(q, L) {
  if (L === q.dok0) return restore(q);
  const r = DOK.rewrite(q.base, L);
  q.dok = L; q.edited = true; q.alts = r.alts; q.verified = r.verified; q.altIdx = 0; q.tip = r.tip;
  q.note = r.dropsChoices ? "The answer choices were removed because this is now an open-response question." : "";
  useAlt(q);
}

function card(q) {
  const sel = [1, 2, 3, 4].map(l => `<button type="button" class="lv${l === q.dok ? " on" : ""}" data-n="${q.n}" data-dok="${l}" style="--c:${COL[l]}" aria-pressed="${l === q.dok}" title="${NAMES[l]}">DOK ${l}</button>`).join("");
  const rewritten = q.edited && q.alts;
  const body = rewritten
    ? `<textarea class="rw" data-n="${q.n}" rows="3" aria-label="Rewritten question ${esc(q.label)}">${esc(q.question)}</textarea><div class="printq">${esc(q.question)}</div>
    <div class="rwbar">${q.alts.length > 1 ? `<button type="button" class="ghost sm" data-act="another" data-n="${q.n}">Try another version (${q.altIdx + 1} of ${q.alts.length})</button>` : ""}<button type="button" class="ghost sm" data-act="copy" data-n="${q.n}">Copy</button><button type="button" class="ghost sm" data-act="reset" data-n="${q.n}">Reset to original</button></div>
    ${q.note ? `<p class="fine">${esc(q.note)}</p>` : ""}
    <details class="orig"><summary>Show the original question</summary><p class="qtext">${esc(q.base)}</p></details>`
    : `<p class="qtext">${esc(q.question)}</p>`;
  return `<article class="q">
    <div class="qhead"><span class="qn">Question ${esc(q.label)}</span><span class="badge" style="background:${COL[q.dok]}">DOK ${q.dok} &middot; ${NAMES[q.dok]}</span>
      ${q.edited ? '<span class="fine">rewritten</span>' : q.conf === "low" ? '<span class="fine">low confidence: double-check</span>' : ""}
      </div>
    <div class="chg" role="group" aria-label="Rewrite question ${esc(q.label)} at a different DOK level"><span>Rewrite at level:</span>${sel}</div>
    ${body}
    <p class="why"><b>Why:</b> ${esc(q.why.replace(/^(Rated|Rewritten for) DOK \d \([^)]*\)\.?:? ?/, "") || q.why)}</p>
    ${rewritten ? `<p class="why"><b>How to score it:</b> ${esc(q.tip)}</p><p class="fine">If this question uses a passage, graph, or picture, keep it with the rewritten question.</p>` : `<div class="verbs">${q.verbs.map(v => `<span>${esc(v)}</span>`).join("")}</div>`}
  </article>`;
}

$("csv").onclick = () => {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const rows = [["Question", "DOK", "Level name", "Why", "Question text (as rewritten)", "Original question"].map(q).join(",")]
    .concat(questions.map(x => [x.label, x.dok, NAMES[x.dok], x.why, x.question.replace(/\s+/g, " "), String(x.base || x.question).replace(/\s+/g, " ")].map(q).join(",")));
  const t = DOK.tally(questions);
  rows.push("", [1, 2, 3, 4].map(l => q(`DOK ${l}: ${t.pct[l]}% (${t.counts[l]})`)).join(","));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
  a.download = fileName + "-dok.csv"; a.click();
};
$("print").onclick = () => window.print();
$("again").onclick = () => { $("results").hidden = true; $("setup").hidden = false; picked = null; $("picked").hidden = true; $("paste").value = ""; showErr(""); refresh(); };
