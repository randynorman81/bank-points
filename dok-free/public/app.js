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
      if (y !== null && Math.abs(yy - y) > 3) { out.push(line.join(" ")); line = []; }
      y = yy; line.push(it.str);
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
    } else if (["txt", "md"].includes(ext)) text = await f.text();
    else throw new Error(ext === "doc" ? "Old .doc files aren't supported. Save as .docx or PDF." : "Use a PDF, .docx or .txt file.");
    picked = { name: f.name, text };
  } catch (e) { showErr(e.message); }
  $("picked").hidden = !picked;
  if (picked) $("picked").textContent = "Ready: " + picked.name;
  refresh();
}
function refresh() { $("go").disabled = !(picked || $("paste").value.trim()); }
function showErr(m) { $("err").hidden = !m; $("err").textContent = m; }

// ---------- analyze ----------
$("go").onclick = () => {
  showErr("");
  const text = picked ? picked.text : $("paste").value;
  fileName = picked ? picked.name.replace(/\.[^.]+$/, "") : "Pasted test";
  questions = DOK.analyze(text); filter = 0;
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
  $("list").querySelectorAll("select").forEach(s => s.onchange = () => {
    const q = questions.find(x => x.n === +s.dataset.n);
    q.dok = +s.value; q.edited = true; q.why = `Changed to DOK ${q.dok} (${NAMES[q.dok]}) by you.`; render();
  });
}

function card(q) {
  const sel = [1, 2, 3, 4].map(l => `<option value="${l}" ${l === q.dok ? "selected" : ""}>DOK ${l} · ${NAMES[l]}</option>`).join("");
  return `<article class="q">
    <div class="qhead"><span class="qn">Question ${esc(q.label)}</span><span class="badge" style="background:${COL[q.dok]}">DOK ${q.dok} &middot; ${NAMES[q.dok]}</span>
      ${q.edited ? '<span class="fine">edited</span>' : q.conf === "low" ? '<span class="fine">low confidence: double-check</span>' : ""}
      <label class="chg-l">Change level <select data-n="${q.n}">${sel}</select></label></div>
    <p class="qtext">${esc(q.question)}</p>
    <p class="why"><b>Why:</b> ${esc(q.why.replace(/^(Rated|Changed to) DOK \d \([^)]*\)( by you)?:? ?/, "") || q.why)}</p>
    <div class="verbs">${q.verbs.map(v => `<span>${esc(v)}</span>`).join("")}</div>
  </article>`;
}

$("csv").onclick = () => {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const rows = [["Question", "DOK", "Level name", "Why", "Text"].map(q).join(",")]
    .concat(questions.map(x => [x.label, x.dok, NAMES[x.dok], x.why, x.question.replace(/\s+/g, " ")].map(q).join(",")));
  const t = DOK.tally(questions);
  rows.push("", [1, 2, 3, 4].map(l => q(`DOK ${l}: ${t.pct[l]}% (${t.counts[l]})`)).join(","));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
  a.download = fileName + "-dok.csv"; a.click();
};
$("print").onclick = () => window.print();
$("again").onclick = () => { $("results").hidden = true; $("setup").hidden = false; picked = null; $("picked").hidden = true; $("paste").value = ""; showErr(""); refresh(); };
