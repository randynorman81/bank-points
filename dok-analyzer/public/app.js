const $ = id => document.getElementById(id);
const NAMES = {1: "Recall", 2: "Skill/Concept", 3: "Strategic Thinking", 4: "Extended Thinking"};
const COL = {1: "var(--d1)", 2: "var(--d2)", 3: "var(--d3)", 4: "var(--d4)"};
let picked = null;      // {name, file:{mediaType,data}} | {name, text}
let questions = [];
let filter = 0;

fetch("/api/config").then(r => r.json()).then(c => { $("codeRow").hidden = !c.needsCode; }).catch(() => {});

// ---------- file intake ----------
const drop = $("drop"), fileIn = $("file");
drop.onclick = () => fileIn.click();
drop.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileIn.click(); } };
drop.ondragover = e => { e.preventDefault(); drop.classList.add("over"); };
drop.ondragleave = () => drop.classList.remove("over");
drop.ondrop = e => { e.preventDefault(); drop.classList.remove("over"); if (e.dataTransfer.files[0]) take(e.dataTransfer.files[0]); };
fileIn.onchange = () => { if (fileIn.files[0]) take(fileIn.files[0]); };
$("paste").oninput = () => { if ($("paste").value.trim()) { picked = null; $("picked").hidden = true; } refresh(); };

function b64(buf) {
  let s = ""; const a = new Uint8Array(buf), n = 0x8000;
  for (let i = 0; i < a.length; i += n) s += String.fromCharCode.apply(null, a.subarray(i, i + n));
  return btoa(s);
}

async function take(f) {
  showErr("");
  const ext = (f.name.split(".").pop() || "").toLowerCase();
  try {
    if (f.size > 18 * 1024 * 1024) throw new Error("That file is over 18 MB. Try a smaller export.");
    if (ext === "pdf") picked = { name: f.name, file: { mediaType: "application/pdf", data: b64(await f.arrayBuffer()) } };
    else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
      const mt = ext === "jpg" ? "image/jpeg" : "image/" + ext;
      picked = { name: f.name, file: { mediaType: mt, data: b64(await f.arrayBuffer()) } };
    } else if (ext === "docx") {
      if (!window.mammoth) throw new Error("Word reader didn't load. Check your connection or upload a PDF.");
      const r = await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() });
      if (!r.value.trim()) throw new Error("No text found in that Word file.");
      picked = { name: f.name, text: r.value };
    } else if (["txt", "md"].includes(ext)) picked = { name: f.name, text: await f.text() };
    else throw new Error(ext === "doc" ? "Old .doc files aren't supported. Save as .docx or PDF." : "Unsupported file type. Use PDF, .docx, .txt, or an image.");
  } catch (e) { picked = null; showErr(e.message); }
  $("paste").value = "";
  $("picked").hidden = !picked;
  if (picked) $("picked").textContent = "Ready: " + picked.name;
  refresh();
}

function refresh() { $("go").disabled = !(picked || $("paste").value.trim()); }
function showErr(m) { $("err").hidden = !m; $("err").textContent = m; }

// ---------- analyze ----------
$("go").onclick = async () => {
  showErr("");
  const body = { code: $("code").value };
  if (picked && picked.file) body.file = picked.file;
  else body.text = picked ? picked.text : $("paste").value;
  questions = []; filter = 0;
  $("setup").hidden = true; $("results").hidden = false;
  $("title").textContent = "Analyzing…"; $("status").textContent = "Reading the test and rating each question. Questions appear as they finish.";
  render();
  let res;
  try {
    res = await fetch("/api/analyze", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  } catch { return fail("Couldn't reach the server."); }
  if (!res.ok) { let m = "Something went wrong."; try { m = (await res.json()).error || m; } catch {} return fail(m); }

  const rd = res.body.getReader(), dec = new TextDecoder();
  let buf = "";
  const handle = line => {
    line = line.trim().replace(/^```(json)?$/, "");
    if (!line.startsWith("{")) return;
    let o; try { o = JSON.parse(line); } catch { return; }
    if (o.type === "meta") $("title").textContent = o.title || "Test";
    else if (o.type === "question") { questions.push(o); render(); }
    else if (o.type === "error") fail(o.message);
  };
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i; while ((i = buf.indexOf("\n")) >= 0) { handle(buf.slice(0, i)); buf = buf.slice(i + 1); }
  }
  handle(buf);
  $("status").textContent = questions.length ? questions.length + " questions analyzed." : "";
  if (!questions.length) fail("No questions were found in that file. Is it a scan or an image-only file? Try a PDF or paste the text.");
  render(true);
};

function fail(m) { $("results").hidden = !questions.length; $("setup").hidden = !!questions.length; showErr(m); }

// ---------- render ----------
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function render(final) {
  const n = questions.length, cnt = {1: 0, 2: 0, 3: 0, 4: 0};
  questions.forEach(q => cnt[q.dok]++);
  const pct = l => n ? Math.round(cnt[l] / n * 1000) / 10 : 0;
  $("stack").innerHTML = [1, 2, 3, 4].map(l => cnt[l] ? `<div style="width:${cnt[l] / n * 100}%;background:${COL[l]}">${pct(l)}%</div>` : "").join("");
  $("legend").innerHTML = [1, 2, 3, 4].map(l => `<div><span class="dot" style="background:${COL[l]}"></span><b>DOK ${l}</b> ${NAMES[l]}: ${pct(l)}% (${cnt[l]})</div>`).join("");
  const hi = pct(3) + pct(4);
  $("advice").hidden = !final || !n;
  $("advice").textContent = hi >= 40 ? `${Math.round(hi)}% of this test is DOK 3-4, a strong balance of deeper thinking.`
    : hi >= 20 ? `${Math.round(hi)}% of this test is DOK 3-4.`
    : `Only ${Math.round(hi)}% of this test is DOK 3-4; it mostly measures recall and routine skills.`;

  $("filter").innerHTML = [0, 1, 2, 3, 4].map(l => `<button data-f="${l}" class="${filter === l ? "on" : ""}">${l ? "DOK " + l : "All"}</button>`).join("");
  $("filter").querySelectorAll("button").forEach(b => b.onclick = () => { filter = +b.dataset.f; render(final); });

  $("list").innerHTML = questions.filter(q => !filter || q.dok === filter).map(card).join("") +
    (final ? "" : `<p class="pending">Analyzing more questions…</p>`);
}

function card(q) {
  return `<article class="q">
    <div class="qhead"><span class="qn">Question ${esc(q.n)}</span><span class="badge" style="background:${COL[q.dok]}">DOK ${q.dok} &middot; ${NAMES[q.dok]}</span></div>
    <p class="qtext">${esc(q.question)}</p>
    <p class="why"><b>Why DOK ${q.dok}:</b> ${esc(q.why)}</p>
    <div class="verbs">${(q.verbs || []).map(v => `<span>${esc(v)}</span>`).join("")}</div>
  </article>`;
}

$("print").onclick = () => window.print();
$("again").onclick = () => { $("results").hidden = true; $("setup").hidden = false; picked = null; $("picked").hidden = true; $("paste").value = ""; showErr(""); refresh(); };
