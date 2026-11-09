const $ = id => document.getElementById(id);
const NAMES = DOK.NAMES;
const COL = {1: "var(--d1)", 2: "var(--d2)", 3: "var(--d3)", 4: "var(--d4)"};
let picked = null, questions = [], filter = 0, fileName = "", srcUrl = "";

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
    picked = { name: "Google Doc", text: j.text, url: v }; $("paste").value = "";
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
  fileName = picked ? picked.name.replace(/\.[^.]+$/, "") : "Pasted test"; srcUrl = picked && picked.url ? picked.url : "";
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
  saveSession();
  $("gupd").hidden = !gdocId();
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
    t.oninput = () => { const q = questions.find(x => x.n === +t.dataset.n); q.question = t.value; q.hand = true; saveSession(); t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; };
    t.style.height = "auto"; t.style.height = t.scrollHeight + "px";
  });
}

// "Write it with AI": a ready-made prompt the teacher pastes into Gemini (or Claude / ChatGPT) with their own account.
const AI_VERBS = {
  1: "define, identify, list, name, label, recall, state, match",
  2: "explain, describe, compare, classify, summarize, interpret, predict, estimate, organize, solve a multi-step problem",
  3: "justify, argue, evaluate, critique, support with evidence, draw conclusions, hypothesize, analyze a new situation",
  4: "design, create, synthesize across sources, investigate over time, connect ideas across texts or fields, prove, develop a plan or model"
};
function qFormat(q) {
  const t = q.base;
  if (q.mc || /^\s*\(?[A-Ha-h][.)]\s/m.test(t)) return { id: "mc", text: "multiple choice with four options (A, B, C, D) and exactly one correct answer" };
  if (/\btrue\s*(or|\/)\s*false\b/i.test(t)) return { id: "tf", text: "true/false" };
  if (/_{3,}|\bfill in\b/i.test(t)) return { id: "fill", text: "fill in the blank" };
  if ((t.match(/\d+/g) || []).length >= 2) return { id: "math", text: "a problem with numbers that has one correct numerical answer" };
  return { id: "open", text: "an open-response question (a written answer)" };
}
function aiPrompt(q, L) {
  const f = qFormat(q), mc = f.id === "mc";
  const extra = mc
    ? "Write four answer choices (A-D). Make the wrong choices believable: each should come from a real misconception or a plausible mistake, not an obviously silly answer. Put the correct answer in a different position than in the original."
    : f.id === "open" ? "The answer line should be a short model answer (one or two sentences)."
    : f.id === "math" ? "The answer line should be just the correct number (with units if needed)." : "The answer line should be the correct answer only.";
  const outFmt = mc ? "The new question, then the four answer choices on separate lines (A. B. C. D.), then one final line: Answer: <the correct letter>"
    : `The new question, then one final line: Answer: <the correct answer>`;
  return `You are an expert test writer who knows Webb's Depth of Knowledge (DOK).

TASK: Rewrite the test question below as a NEW question at DOK Level ${L} (${NAMES[L]}).
- DOK ${L} means: ${DOK.MEANS[L]}
- Typical DOK ${L} thinking: ${AI_VERBS[L]}.
- Keep the SAME TOPIC, subject and grade level as the original, and keep the SAME FORMAT: ${f.text}.
- Change the thinking the question demands. Do not just add words like "explain" or "justify" to the old question, and do not make it harder only by making it longer or using bigger words.
- ${extra}

OUTPUT (give ONLY this, in plain text with no bold or markdown):
${outFmt}
Do not include any explanation, rationale, analysis, headings, labels like "Question:", or extra commentary. Nothing before the question and nothing after the Answer line.

ORIGINAL QUESTION (currently rated DOK ${q.dok0}, ${NAMES[q.dok0]}):
${q.base}

(If the original refers to a passage, graph, or picture that is not shown here, tell me what you need, or write the question so it does not depend on it.)`;
}
function aiBlock(q) {
  const btns = [1, 2, 3, 4].map(l => `<button type="button" class="ghost sm${q.aiLevel === l ? " on" : ""}" data-ai="${l}" data-n="${q.n}" style="border-color:${COL[l]}" title="Copy the prompt for DOK ${l}">DOK ${l}</button>`).join("");
  return `<div class="ai">
    <div class="rwbar"><b>Write a ${qFormat(q).id === "mc" ? "multiple-choice " : ""}version with AI:</b><span class="fine">click a level to copy the prompt, then paste it into <a href="https://gemini.google.com" target="_blank" rel="noopener">Gemini</a></span></div>
    <div class="rwbar">${btns}<span class="aimsg" role="status"></span></div>
    <textarea class="aitext" readonly rows="5" hidden aria-label="The prompt that was copied"></textarea>
    <div class="aipaste"${q.aiLevel ? "" : " hidden"}>
      <label class="fine" for="aiin${q.n}">Paste the question Gemini gave you (it will be saved as DOK ${q.aiLevel || "?"} in your test):</label>
      <textarea class="aiin" id="aiin${q.n}" rows="5" placeholder="Paste Gemini's new question here"></textarea>
      <div class="rwbar"><button type="button" class="sm" data-use="${q.n}">Use this question in my test</button></div>
    </div>
  </div>`;
}
// Gemini's reply: take the "Answer: B" line out of the question text and keep it as the answer; drop markdown marks
function splitAnswer(v) {
  const keep = []; let ans = "";
  v.replace(/\r/g, "").split("\n").forEach(raw => {
    const l = raw.replace(/\*\*/g, "").replace(/^#+\s*/, "").replace(/^\s*(?:question\s*\d*\s*[:.\-]\s*)/i, "").replace(/[ \t]+$/, "");
    const m = l.match(/^\s*(?:the\s+)?(?:correct\s+)?answer(?:\s+key)?\s*[:\-–]\s*(.+)$/i);
    if (m && !ans) ans = m[1].trim(); else keep.push(l);
  });
  return { question: keep.join("\n").replace(/\n{3,}/g, "\n\n").trim(), answer: ans };
}
function legacyCopy(ta) { try { ta.hidden = false; ta.focus(); ta.select(); return document.execCommand("copy"); } catch (e) { return false; } }
function copyText(text, ta) {
  ta.value = text; ta.hidden = false;
  const p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).then(() => true, () => false) : Promise.resolve(false);
  return p.then(ok => ok || legacyCopy(ta));
}
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("button[data-ai]");
  if (b) {
    const q = questions.find(x => x.n === +b.dataset.n), box = b.closest(".ai"), msg = box.querySelector(".aimsg"), ta = box.querySelector(".aitext"), L = +b.dataset.ai;
    q.aiLevel = L;
    box.querySelectorAll("button[data-ai]").forEach(x => x.classList.toggle("on", +x.dataset.ai === L));
    const pa = box.querySelector(".aipaste"); pa.hidden = false;
    pa.querySelector("label").textContent = `Paste the question Gemini gave you (it will be saved as DOK ${L} in your test):`;
    copyText(aiPrompt(q, L), ta).then(ok => { msg.textContent = ok ? "Copied. Now paste it into Gemini." : "Press Ctrl+C to copy the text below."; });
    return;
  }
  const u = e.target.closest && e.target.closest("button[data-use]");
  if (u) {
    const q = questions.find(x => x.n === +u.dataset.use), v = u.closest(".ai").querySelector(".aiin").value.trim();
    if (!v) { u.textContent = "Paste Gemini's question first"; setTimeout(() => { u.textContent = "Use this question in my test"; }, 1800); return; }
    const sp = splitAnswer(v);
    q.question = sp.question; q.answer = sp.answer; q.dok = q.aiLevel; q.edited = true; q.alts = null; q.note = "This question came from AI. Check the answer and wording before you use it.";
    q.tip = DOK.TIPS[q.dok]; q.why = `Written with AI for DOK ${q.dok} (${NAMES[q.dok]}). ${DOK.MEANS[q.dok]}`; q.fromAI = true;
    render();
  }
});

// Changing a question's DOK level rewrites the question itself (free, rule-based; see rewrite.js)
// Every level a teacher works on keeps its own saved version of the question, so switching levels and coming back never loses it
function snap(q) {
  if (!q.edited) return;
  (q.vers = q.vers || {})[q.dok] = { question: q.question, answer: q.answer || "", alts: q.alts || null, altIdx: q.altIdx || 0, verified: q.verified || [], note: q.note || "", tip: q.tip || "", why: q.why || "", fromAI: !!q.fromAI, hand: !!q.hand };
}
function restore(q) {   // back to the question as uploaded (the other levels' saved versions are kept)
  snap(q);
  q.question = q.base; q.dok = q.dok0; q.why = q.why0; q.edited = false; q.alts = null; q.hand = false; q.note = ""; q.fromAI = false; q.aiLevel = 0; q.answer = "";
}
function useAlt(q) {
  q.question = q.alts[q.altIdx]; q.hand = false;
  const ok = q.verified[q.altIdx];
  q.why = `Rewritten for DOK ${q.dok} (${NAMES[q.dok]}). ${DOK.MEANS[q.dok]} ` + (ok ? `Check: the new wording rates DOK ${q.dok} on the same scale the analyzer uses.` : "This is a best effort. Read it over and adjust the wording.");
}
function setLevel(q, L) {
  snap(q);
  const v = q.vers && q.vers[L];
  if (v) {   // this level was worked on before: bring that version back
    Object.assign(q, { dok: L, edited: true, question: v.question, answer: v.answer, alts: v.alts, altIdx: v.altIdx, verified: v.verified, note: v.note, tip: v.tip, why: v.why, fromAI: v.fromAI, hand: v.hand });
    return;
  }
  if (L === q.dok0) return restore(q);
  const r = DOK.rewrite(q.base, L);
  q.answer = ""; q.fromAI = false;
  q.dok = L; q.edited = true; q.alts = r.alts; q.verified = r.verified; q.altIdx = 0; q.tip = r.tip;
  q.note = r.dropsChoices ? "The answer choices were removed because this is now an open-response question." : "";
  useAlt(q);
}

function card(q) {
  const sel = [1, 2, 3, 4].map(l => `<button type="button" class="lv${l === q.dok ? " on" : ""}" data-n="${q.n}" data-dok="${l}" style="--c:${COL[l]}" aria-pressed="${l === q.dok}" title="${NAMES[l]}${q.vers && q.vers[l] ? " (saved version)" : ""}">DOK ${l}${q.vers && q.vers[l] ? " ✓" : ""}</button>`).join("");
  const rewritten = q.edited;
  const body = rewritten
    ? `<textarea class="rw" data-n="${q.n}" rows="3" aria-label="Rewritten question ${esc(q.label)}">${esc(q.question)}</textarea><div class="printq">${esc(q.question)}</div>
    <div class="rwbar">${q.alts && q.alts.length > 1 ? `<button type="button" class="ghost sm" data-act="another" data-n="${q.n}">Try another version (${q.altIdx + 1} of ${q.alts.length})</button>` : ""}<button type="button" class="ghost sm" data-act="copy" data-n="${q.n}">Copy</button><button type="button" class="ghost sm" data-act="reset" data-n="${q.n}" title="Show the question as you uploaded it. Your saved versions at other levels are kept.">Back to original</button></div>
    ${q.answer ? `<p class="ans"><b>Answer:</b> ${esc(q.answer)}</p>` : ""}
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
    ${aiBlock(q)}
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

// The finished test: each question (as rewritten or pasted from AI) with an optional answer key and DOK tags
function plain(s) { return String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x09\x0A\x20-\x7E -ÿ]/g, "?"); }
function finalLines() {
  const labels = $("withDok").checked, key = $("withKey").checked;
  const qs = questions.map(q => ({ head: q.label + ".", text: q.question + (labels ? "  [DOK " + q.dok + "]" : "") }));
  const keys = key ? questions.filter(q => q.answer).map(q => q.label + ". " + q.answer) : [];
  return { qs, keys };
}
$("doc").onclick = () => {
  const { qs, keys } = finalLines();
  const isCh = l => /^\s*\(?[A-Ha-h][.)]\s/.test(l);
  const body = qs.map(x => {
    const ls = (x.head + " " + x.text).split("\n").filter(l => l.trim());
    // a choice and any lines that run on from it stay in one paragraph; each choice gets space around it
    const blocks = []; ls.forEach(l => { if (isCh(l) || !blocks.length) blocks.push({ ch: isCh(l), lines: [l] }); else blocks[blocks.length - 1].lines.push(l); });
    return blocks.map((b, k) => { const txt = b.lines.map((l, j) => (k === 0 && j === 0 ? "<b>" + esc(x.head) + "</b> " + esc(l.slice(x.head.length + 1)) : esc(l))).join("<br>"); return b.ch ? "<p style=\"margin:12pt 0 12pt 18pt\">" + txt + "</p>" : "<p style=\"margin:0 0 " + (blocks[k + 1] && blocks[k + 1].ch ? "12pt" : "6pt") + "\">" + txt + "</p>"; }).join("");
  }).join('\n<hr style="border:0;border-top:1.5pt solid #777;margin:14pt 0">\n')
    + (keys.length ? `<br style="page-break-before:always"><h3 style="page-break-before:always">Answer Key</h3>` + keys.map(k => `<p>${esc(k)}</p>`).join("\n") : "");
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${esc(fileName)}</title></head><body style="font-family:Calibri,Arial,sans-serif"><h2>${esc(fileName)}</h2>\n${body}</body></html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿", html], { type: "application/msword" }));
  a.download = fileName + "-updated.doc"; a.click();
};
$("pdf").onclick = () => {
  if (!window.jspdf) return showErr("The PDF maker didn't load. Check your connection, or use Download (Word) or Print.");
  const { qs, keys } = finalLines();
  const doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 54, LH = 14;
  let y = M;
  const line = (t, bold, size) => {
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(size || 11);
    doc.splitTextToSize(plain(t), W - 2 * M).forEach(s => { if (y > H - M) { doc.addPage(); y = M; } doc.text(s, M, y); y += (size && size > 12 ? size + 4 : LH); });
  };
  line(fileName, true, 16); y += 6;
  // each answer choice on its own line with a blank line between, and a horizontal rule between questions
  const isChoice = l => /^\s*\(?[A-Ha-h][.)]\s/.test(l);
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  qs.forEach((x, i) => {
    const lines = (x.head + " " + x.text).split("\n").filter(l => l.trim());
    let need = 0;
    lines.forEach((l, k) => { need += doc.splitTextToSize(plain(l), W - 2 * M).length * LH + ((lines[k + 1] && isChoice(lines[k + 1])) ? LH : 0); });
    if (y + need > H - M && need < H - 2 * M) { doc.addPage(); y = M; }   // keep a short question together on one page
    // one blank line before each new answer choice, but none inside a choice that runs onto a second line
    lines.forEach((l, k) => { line(l, false); if (lines[k + 1] && isChoice(lines[k + 1])) y += LH; });
    y += 4;
    if (i < qs.length - 1) {
      if (y > H - M) { doc.addPage(); y = M; }
      doc.setDrawColor(120); doc.setLineWidth(0.8); doc.line(M, y, W - M, y); y += 20;
    }
  });
  if (keys.length) { doc.addPage(); y = M; line("Answer Key", true, 14); y += 6; keys.forEach(k => line(k, false)); }
  doc.save(fileName + "-updated.pdf");
};
$("gcopy").onclick = () => {
  const { qs, keys } = finalLines();
  const text = fileName + "\n\n" + qs.map(x => x.head + " " + x.text).join("\n\n") + (keys.length ? "\n\nAnswer Key\n" + keys.join("\n") : "");
  const ta = $("copybox"); ta.value = text; ta.hidden = false;
  const p = navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).then(() => true, () => false) : Promise.resolve(false);
  p.then(ok => ok || legacyCopy(ta)).then(ok => { $("gmsg").textContent = ok ? "Copied. Open your Google Doc, select the old questions, and paste (Ctrl+V)." : "Select the text in the box and copy it (Ctrl+C)."; });
  const link = $("gorig"); link.hidden = !srcUrl; if (srcUrl) link.href = srcUrl;
};


// Update the teacher's own Google Doc (needs the school's Google sign-in set up once: see google-config.js)
function gdocId() { const m = String(srcUrl).match(/\/document\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]{20,})/); return m ? m[1] : ""; }
function gToken() {
  return new Promise((resolve, reject) => {
    if (!window.DOK_GOOGLE_CLIENT_ID) return reject(new Error("NOCLIENT"));
    if (!(window.google && google.accounts && google.accounts.oauth2)) return reject(new Error("Google sign-in didn't load. Check your connection and try again."));
    const tc = google.accounts.oauth2.initTokenClient({
      client_id: window.DOK_GOOGLE_CLIENT_ID, scope: "https://www.googleapis.com/auth/documents",
      callback: r => r.error ? reject(new Error(r.error === "access_denied" ? "You didn't allow access to your Google Doc." : (r.error_description || r.error))) : resolve(r.access_token),
      error_callback: e => reject(new Error(e && e.type === "popup_closed" ? "The Google sign-in window was closed." : "Google sign-in was blocked. Allow pop-ups for this page and try again."))
    });
    tc.requestAccessToken({ prompt: "" });
  });
}
$("gupd").onclick = async () => {
  const msg = $("gmsg"), id = gdocId(); msg.textContent = "";
  if (!id) return (msg.textContent = "This test didn't come from a Google Doc link, so use Download or Copy for Google Docs.");
  const changed = questions.filter(q => q.edited && q.question !== q.base).length;
  if (!changed) return (msg.textContent = "Nothing has been rewritten yet, so there is nothing to update.");
  try {
    const token = await gToken();
    const get = await fetch("https://docs.googleapis.com/v1/documents/" + id, { headers: { Authorization: "Bearer " + token } });
    if (!get.ok) throw new Error(get.status === 403 || get.status === 404 ? "Couldn't open that Google Doc with the account you signed in with. Sign in with the account that owns or can edit it." : "Google couldn't read the document (" + get.status + ").");
    const doc = await get.json();
    const keys = $("withKey").checked ? questions.filter(q => q.answer).map(q => q.label + ". " + q.answer) : [];
    const plan = DOK_GDOC.buildRequests(doc, questions, keys.length ? "Answer Key\n" + keys.join("\n") : "");
    if (!plan.found.length) throw new Error("Couldn't find the original questions in that document. It may have been edited since it was loaded. Use Copy for Google Docs instead.");
    const ok = confirm(`Update the Google Doc "${doc.title}"?\n\n${plan.found.length} question${plan.found.length === 1 ? "" : "s"} will be replaced` + (keys.length ? " and an Answer Key added at the end" : "") + (plan.missing.length ? `.\nCouldn't find: ${plan.missing.join(", ")} (those stay as they are)` : "") + `.\n\nYou can undo this in Google Docs under File > Version history.`);
    if (!ok) return (msg.textContent = "Cancelled. Your Google Doc was not changed.");
    msg.textContent = "Updating...";
    const post = await fetch("https://docs.googleapis.com/v1/documents/" + id + ":batchUpdate", { method: "POST", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, body: JSON.stringify({ requests: plan.requests }) });
    if (!post.ok) throw new Error(post.status === 403 ? "You can view that document but not edit it. Ask the owner for edit access." : "Google couldn't update the document (" + post.status + "). Nothing was changed.");
    msg.textContent = `Done. Updated ${plan.found.length} question${plan.found.length === 1 ? "" : "s"} in your Google Doc` + (plan.missing.length ? `; couldn't find ${plan.missing.join(", ")}.` : ".");
    const l = $("gorig"); l.hidden = false; l.href = srcUrl; l.textContent = "Open your Google Doc";
  } catch (e) {
    msg.textContent = e.message === "NOCLIENT" ? "Updating a Google Doc directly isn't turned on for this site yet. Use Copy for Google Docs for now." : e.message;
  }
};

// Keep the current version in this browser so a refresh or closed tab doesn't lose the work
const SAVE_KEY = "dokAnalyzer:last";
function saveSession() { questions.forEach(snap); try { localStorage.setItem(SAVE_KEY, JSON.stringify({ fileName, srcUrl, questions, savedAt: Date.now() })); } catch (e) {} }
function loadSession() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); return s && s.questions && s.questions.length ? s : null; } catch (e) { return null; } }
(function offerResume() {
  const s = loadSession(); if (!s) return;
  const box = $("resume"); box.hidden = false;
  box.querySelector("span").textContent = `You have a saved version of "${s.fileName}" (${s.questions.length} questions, saved ${new Date(s.savedAt).toLocaleString()}).`;
  $("resumeGo").onclick = () => { fileName = s.fileName; srcUrl = s.srcUrl || ""; questions = s.questions; filter = 0; $("setup").hidden = true; $("results").hidden = false; $("title").textContent = fileName; $("rawtext").textContent = "(Original text isn't kept when you continue a saved test.)"; render(); };
  $("resumeClear").onclick = () => { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} box.hidden = true; };
})();
$("again").onclick = () => { $("results").hidden = true; $("setup").hidden = false; picked = null; $("picked").hidden = true; $("paste").value = ""; showErr(""); refresh(); };
