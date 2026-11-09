/* Weekly Student Report: reads the HTML, Python and Arduino editors' saved work and the bank, and builds a one-page report per student.
   Everything runs in the teacher's browser with the teacher PIN; nothing new is stored on the server. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const IST_PERIODS = ["3A", "3B", "4A"];                      // classes that do the HTML assignments (same list as the server)
  const TEACHER_SIGN = "Randy Norman\nSCHS Computer Science";
  const DAY = 86400000;
  const DISP = { "6.1": "3.1", "6.2": "3.2", "6.20": "3.3", "6.21": "3.3 Part 2", "6.22": "3.3 Part 3", "6.3": "3.4", "6.35": "3.5", "6.4": "3.6", "6.7": "3.7", "6.75": "3.8", "6.6": "3.9", "6.5": "3.10", "7.1": "3.11", "7.2": "3.12", "7.3": "3.13", "7.4": "3.14", "7.5": "3.15", "7.6": "3.16" };
  const dispLesson = l => DISP[l] || (/^8\./.test(l) ? "4." + l.slice(2) : /^9\./.test(l) ? "5." + l.slice(2) : l);

  let PIN = "", ROSTER = [], DATA = null, PYASG = {}, HIST = {}, ACTLOG = {}, STUDENTS = [], WEEK = null;

  // ---------- helpers ----------
  async function api(path, body) {
    const r = await fetch("/api/" + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ pin: PIN }, body)) });
    const j = await r.json(); if (j && j.error) throw new Error(j.error); return j;
  }
  async function pool(tasks, n) {   // run async functions n at a time
    const out = new Array(tasks.length); let i = 0;
    await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const k = i++; try { out[k] = await tasks[k](); } catch (e) { out[k] = null; } } }));
    return out;
  }
  const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const fromIso = s => { const p = s.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const mondayOf = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
  const inWeek = t => t >= WEEK.start && t < WEEK.end;
  const fmtDay = t => new Date(t).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const fmtDate = d => d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  const dayKey = t => iso(new Date(t));
  const plural = (n, a, b) => n + " " + (n === 1 ? a : b || a + "s");
  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // ---------- unlock ----------
  async function unlock(pin) {
    $("pinMsg").textContent = "";
    PIN = pin;
    try { await api("data", { action: "verifyPin" }); } catch (e) { PIN = ""; $("pinMsg").textContent = "That PIN didn't work."; return false; }
    try { sessionStorage.setItem("wr:pin", pin); } catch (e) {}
    $("gate").hidden = true; $("controls").hidden = false;
    $("status").textContent = "Loading the class list...";
    ROSTER = (await api("data", { action: "adminRoster" })).students || [];
    const periods = [...new Set(ROSTER.map(s => s.period))].sort();
    $("period").innerHTML = periods.map(p => `<option>${esc(p)}</option>`).join("");
    const last = ls.get("wr:period"); if (last && periods.includes(last)) $("period").value = last;
    $("weekStart").value = iso(mondayOf(new Date()));
    $("status").textContent = "Pick a class and a week, then Build report.";
    return true;
  }
  $("pinGo").onclick = () => unlock($("pin").value.trim());
  $("pin").onkeydown = e => { if (e.key === "Enter") $("pinGo").click(); };
  (function auto() { let p = null; try { p = sessionStorage.getItem("wr:pin"); } catch (e) {} if (p) unlock(p); })();
  $("thisWeek").onclick = () => { $("weekStart").value = iso(mondayOf(new Date())); };
  $("lastWeek").onclick = () => { const m = mondayOf(new Date()); m.setDate(m.getDate() - 7); $("weekStart").value = iso(m); };

  // ---------- load all the saved work (once) ----------
  async function loadAll() {
    if (DATA) return;
    const D = { html: {}, py: {}, ard: {} };
    $("status").textContent = "Reading the HTML, Python and Arduino work...";
    const [hc, pc, ac, pa] = await Promise.all([
      api("code", { action: "adminCounts" }), api("pycode", { action: "adminCounts" }),
      api("arduinocode", { action: "adminCounts" }).catch(() => ({ counts: {} })), api("pycode", { action: "adminAssignments" }).catch(() => ({}))
    ]);
    PYASG = pa.assignments || pa || {};
    const jobs = [];
    Object.keys(hc.counts || {}).filter(k => hc.counts[k] > 0).forEach(l => jobs.push(async () => { D.html[l] = byEmail((await api("code", { action: "adminList", lesson: l })).students); }));
    Object.keys(pc.counts || {}).filter(k => pc.counts[k] > 0).forEach(s => jobs.push(async () => { D.py[s] = byEmail((await api("pycode", { action: "adminList", slot: s })).students); }));
    Object.keys(ac.counts || {}).filter(k => ac.counts[k] > 0).forEach(s => jobs.push(async () => { D.ard[s] = byEmail((await api("arduinocode", { action: "adminList", slot: s })).students); }));
    let done = 0; const tick = () => { $("status").textContent = `Reading saved work... ${++done} of ${jobs.length}`; };
    await pool(jobs.map(j => async () => { const r = await j(); tick(); return r; }), 6);
    DATA = D;
  }
  function byEmail(list) { const m = {}; (list || []).forEach(r => { m[String(r.email || "").toLowerCase()] = r; }); return m; }

  // ---------- numbers for one student ----------
  const slotNum = slot => parseInt(String(slot).replace(/\D/g, ""), 10) || 0;
  function pyTitle(slot) { const a = PYASG[slot]; return "Python " + slotNum(slot) + (a && a.title ? ": " + a.title : ""); }
  function htmlItems(stu) {
    const em = stu.email.toLowerCase(), out = [], H = window.HTMLCheck;
    Object.keys(DATA.html).forEach(l => {
      const rec = DATA.html[l][em]; if (!rec || (!rec.draft && !rec.submission)) return;
      const d = rec.draft, s = rec.submission, dT = d ? Date.parse(d.savedAt) : 0, sT = s ? Date.parse(s.submittedAt) : 0;
      const cur = d && dT >= sT ? d : s;
      let pct = null; try { const sc = window.U7_STEPCHECKS && U7_STEPCHECKS.score(l, cur.code || "", cur.css || ""); if (sc) pct = sc.pct; } catch (e) {}
      if (pct == null && s && s.auto) pct = s.auto.pct;
      const act = cur.activity || {}, typed = act.typed || 0, pasted = act.pasted || 0;
      const name = dispLesson(l) + (H && H.LESSONS && H.LESSONS[l] ? " " + H.LESSONS[l].name : "");
      out.push({ kind: "HTML", id: l, name: "HTML " + name, status: s ? "Submitted" : "In progress", pct, score: s ? (s.teacher && s.teacher.score != null ? s.teacher.score : (s.auto ? s.auto.pct : null)) : null,
        last: Math.max(dT, sT), firstSub: s ? Date.parse(s.firstSubmittedAt || s.submittedAt) : 0, subAt: sT, subs: s ? (s.count || 1) : 0, minutes: (act.activeMs || 0) / 60000,
        pasteP: typed + pasted >= 300 ? Math.round(100 * pasted / (typed + pasted)) : null });
    });
    return out;
  }
  function pyItems(stu) {
    const em = stu.email.toLowerCase(), out = [];
    Object.keys(DATA.py).forEach(slot => {
      const rec = DATA.py[slot][em]; if (!rec || (!rec.draft && !rec.submission)) return;
      const d = rec.draft, s = rec.submission, dT = d ? Date.parse(d.savedAt) : 0, sT = s ? Date.parse(s.submittedAt) : 0;
      const tk = (d && d.ticks) || (s && s.ticks) || { ids: [], total: 0 };
      out.push({ kind: "Python", id: slot, name: pyTitle(slot), status: s ? "Submitted" : "In progress", pct: tk.total ? Math.round(100 * (tk.ids || []).length / tk.total) : null,
        score: s && s.teacher && s.teacher.score != null ? s.teacher.score : null, last: Math.max(dT, sT), firstSub: s ? Date.parse(s.firstSubmittedAt || s.submittedAt) : 0, subAt: sT, subs: s ? (s.count || 1) : 0, minutes: 0, pasteP: null, py: true });
    });
    return out;
  }
  function ardItems(stu) {
    const em = stu.email.toLowerCase(), out = [];
    Object.keys(DATA.ard).forEach(slot => {
      const rec = DATA.ard[slot][em]; if (!rec || (!rec.draft && !rec.submission)) return;
      const d = rec.draft, s = rec.submission, dT = d ? Date.parse(d.savedAt) : 0, sT = s ? Date.parse(s.submittedAt) : 0;
      out.push({ kind: "Arduino", id: slot, name: "Arduino " + slot, status: s ? "Submitted" : "In progress", pct: null, score: s && s.teacher && s.teacher.score != null ? s.teacher.score : null,
        last: Math.max(dT, sT), firstSub: s ? Date.parse(s.firstSubmittedAt || s.submittedAt) : 0, subAt: sT, subs: s ? (s.count || 1) : 0, minutes: 0, pasteP: null });
    });
    return out;
  }
  // assignments that are open to the student but that they have never opened
  function notStarted(stu, items) {
    const out = [], have = new Set(items.map(i => i.kind + ":" + i.id));
    if (IST_PERIODS.includes(stu.period)) {
      (window.U7_LIVE || []).forEach(l => { if (!have.has("HTML:" + l)) out.push({ kind: "HTML", id: l, name: "HTML " + dispLesson(l) + (window.HTMLCheck && HTMLCheck.LESSONS[l] ? " " + HTMLCheck.LESSONS[l].name : ""), status: "Not started", pct: 0, score: null, last: 0, minutes: 0, subs: 0 }); });
    } else {
      const live = Object.keys(PYASG).filter(s => PYASG[s] && PYASG[s].live).sort((a, b) => slotNum(a) - slotNum(b));
      let prevSubmitted = true;
      live.forEach(s => {
        const it = items.find(i => i.kind === "Python" && i.id === s), open = PYASG[s].ungated === true || prevSubmitted;
        if (!it && open) out.push({ kind: "Python", id: s, name: pyTitle(s), status: "Not started", pct: 0, score: null, last: 0, minutes: 0, subs: 0 });
        prevSubmitted = !!(it && it.status === "Submitted");
      });
    }
    return out;
  }
  function pyMinutes(log, wk) {   // active minutes from the 30-second saves: gaps up to 5 minutes count as working
    const t = (log || []).map(x => Date.parse(x.t)).filter(x => wk(x)).sort((a, b) => a - b);
    let ms = 0; t.forEach((x, i) => { const gap = i ? x - t[i - 1] : Infinity; ms += gap <= 300000 ? gap : 30000; });
    return { minutes: ms / 60000, times: t };
  }
  function rating(days, minutes, subs, worked) {
    if (!worked && !days) return "Not working";
    if (days >= 4 && (subs >= 1 || minutes >= 60)) return "Excellent";
    if (days >= 3 || (subs >= 1 && minutes >= 20)) return "Good";
    if (days >= 2 || minutes >= 20) return "Inconsistent";
    return "Needs improvement";
  }
  const rClass = r => "r-" + r.split(" ")[0];

  async function buildStudent(stu, fetchLogs) {
    let items = htmlItems(stu).concat(pyItems(stu), ardItems(stu));
    const em = stu.email.toLowerCase();
    // Python minute-by-minute log for the Python work saved this week
    const times = []; let pyMin = 0;
    for (const it of items.filter(i => i.py)) {
      if (it.last < WEEK.start) continue;   // nothing saved since the week began
      const key = it.id + "|" + em;
      if (!(key in ACTLOG)) ACTLOG[key] = fetchLogs ? (await api("pycode", { action: "adminActivity", slot: it.id, email: stu.email }).catch(() => ({ log: [] }))).log || [] : [];
      const pm = pyMinutes(ACTLOG[key], inWeek); it.minutes = pm.minutes; it.logTimes = pm.times; pyMin += pm.minutes; pm.times.forEach(t => times.push(t));
    }
    items.forEach(i => { i.touched = (i.last && inWeek(i.last)) || (i.logTimes && i.logTimes.length > 0); i.subWeek = i.subAt && inWeek(i.subAt) || (i.firstSub && inWeek(i.firstSub)); });
    const worked = items.filter(i => i.touched);
    const days = new Set(); worked.forEach(i => { if (i.last && inWeek(i.last)) days.add(dayKey(i.last)); if (i.subAt && inWeek(i.subAt)) days.add(dayKey(i.subAt)); });
    times.forEach(t => days.add(dayKey(t)));
    const htmlMin = worked.filter(i => i.kind === "HTML").reduce((a, i) => a + i.minutes, 0);
    const minutes = Math.round(pyMin + htmlMin);
    const subs = items.filter(i => i.subWeek);
    const scored = subs.filter(i => i.score != null);
    const avg = scored.length ? Math.round(scored.reduce((a, i) => a + i.score, 0) / scored.length) : null;
    const missing = notStarted(stu, items);
    // bank
    if (!(stu.id in HIST)) HIST[stu.id] = (await api("data", { action: "studentHistory", id: stu.id }).catch(() => ({ history: [] }))).history || [];
    const week = HIST[stu.id].filter(h => inWeek(Date.parse(h.timestamp)));
    const earned = week.filter(h => h.type === "EARNED").reduce((a, h) => a + (h.amount || 0), 0);
    const flags = items.filter(i => i.pasteP != null && i.pasteP >= 60 && i.touched).map(i => i.name.replace(/^HTML /, "") + ": " + i.pasteP + "% pasted");
    const dayList = [...days].sort();
    const s = { stu, items, worked, missing, days: dayList.length, dayList, minutes, subs, avg, earned, notes: week.filter(h => h.type === "EARNED" && h.description).map(h => h.description), balance: stu.available, flags };
    s.suggest = rating(s.days, s.minutes, subs.length, worked.length);
    return s;
  }

  // ---------- text for a student ----------
  const key = (s, k) => "wr:" + iso(new Date(WEEK.start)) + ":" + s.stu.email.toLowerCase() + ":" + k;
  function autoSummary(s) {
    const L = [], first = s.stu.name.split(" ")[0];
    if (!s.worked.length) L.push("No work was saved in the computer science editors this week.");
    else {
      L.push(`Worked on ${plural(s.worked.length, "assignment")} on ${plural(s.days, "day")} this week${s.minutes ? " (about " + s.minutes + " minutes of active work)" : ""}.`);
      const done = s.subs.map(i => i.name + (i.score != null ? " (" + i.score + "%)" : ""));
      if (done.length) L.push("Submitted: " + done.join("; ") + ".");
      const prog = s.worked.filter(i => i.status !== "Submitted").map(i => i.name + (i.pct != null ? " (" + i.pct + "% complete)" : ""));
      if (prog.length) L.push("Still in progress: " + prog.join("; ") + ".");
    }
    if (s.missing.length) L.push("Open but not started: " + s.missing.map(i => i.name).join("; ") + ".");
    if (s.earned) L.push(`Earned ${s.earned} bank points this week` + (s.notes.length ? " (" + [...new Set(s.notes)].join("; ") + ")" : "") + `. Current balance: ${s.balance}.`);
    else L.push(`Bank balance: ${s.balance} points.`);
    return L.join("\n");
  }
  function emailText(s) {
    const r = ls.get(key(s, "rate")) || s.suggest, sum = ls.get(key(s, "sum")) != null ? ls.get(key(s, "sum")) : autoSummary(s), note = ls.get(key(s, "note")) || "";
    const wk = fmtDate(new Date(WEEK.start)) + " to " + fmtDate(new Date(WEEK.end - DAY));
    const rows = s.worked.concat(s.missing).map(i => "- " + i.name + ": " + i.status + (i.pct != null && i.status !== "Not started" ? ", " + i.pct + "% complete" : "") + (i.score != null ? ", score " + i.score + "%" : "")).join("\n");
    return `Weekly update for ${s.stu.name} (${s.stu.period}), ${wk}\n\nWork ethic this week: ${r}\n\n${sum}\n\n${rows ? "Assignments:\n" + rows + "\n\n" : ""}${note ? note + "\n\n" : ""}${TEACHER_SIGN}`;
  }

  // ---------- screen ----------
  function renderOverview() {
    const head = ["", "Student", "Work ethic", "Days", "Min", "Worked", "Submitted", "Avg score", "Not started", "Bank +", "Flags"];
    const rows = STUDENTS.map((s, i) => {
      const r = ls.get(key(s, "rate")) || s.suggest;
      return `<tr><td><input type="checkbox" data-sel="${i}" ${ls.get(key(s, "sel")) === "0" ? "" : "checked"}></td><td><a href="#rep${i}">${esc(s.stu.name)}</a></td><td><span class="pill ${rClass(r)}">${esc(r)}</span></td>
        <td class="n">${s.days}</td><td class="n">${s.minutes}</td><td class="n">${s.worked.length}</td><td class="n">${s.subs.length}</td><td class="n">${s.avg == null ? "" : s.avg + "%"}</td><td class="n">${s.missing.length || ""}</td><td class="n">${s.earned || ""}</td><td class="flag">${s.flags.map(esc).join("<br>")}</td></tr>`;
    }).join("");
    $("overview").innerHTML = "<thead><tr>" + head.map((h, i) => `<th class="${i > 2 && i < 10 ? "n" : ""}">${h}</th>`).join("") + "</tr></thead><tbody>" + rows + "</tbody>";
    $("overview").querySelectorAll("input[data-sel]").forEach(cb => cb.onchange = () => { const s = STUDENTS[+cb.dataset.sel]; ls.set(key(s, "sel"), cb.checked ? "1" : "0"); applySel(); });
    applySel();
  }
  function applySel() { document.querySelectorAll(".report").forEach((el, i) => el.classList.toggle("skip", STUDENTS[i] && ls.get(key(STUDENTS[i], "sel")) === "0")); }
  function renderCards() {
    const wk = fmtDate(new Date(WEEK.start)) + " to " + fmtDate(new Date(WEEK.end - DAY));
    $("cards").innerHTML = STUDENTS.map((s, i) => {
      const r = ls.get(key(s, "rate")) || s.suggest, sum = ls.get(key(s, "sum")) != null ? ls.get(key(s, "sum")) : autoSummary(s), note = ls.get(key(s, "note")) || "";
      const rows = s.worked.concat(s.missing).sort((a, b) => b.last - a.last).map(it => `<tr><td>${esc(it.name)}</td><td>${esc(it.status)}</td>
        <td>${it.pct == null ? "" : `<div class="bar"><i style="width:${it.pct}%"></i></div>${it.pct}%`}</td><td class="n">${it.score == null ? "" : it.score + "%"}</td><td>${it.last ? esc(fmtDay(it.last)) : ""}</td><td class="n">${it.minutes ? Math.round(it.minutes) : ""}</td></tr>`).join("");
      return `<article class="report" id="rep${i}">
        <h2>${esc(s.stu.name)}</h2><div class="sub">Period ${esc(s.stu.period)} &middot; Week of ${esc(wk)} &middot; SCHS Computer Science</div>
        <div class="rate"><b>Work ethic this week:</b> <span class="pill ${rClass(r)}" id="pill${i}">${esc(r)}</span>
          <select class="noprint" data-rate="${i}">${["Excellent", "Good", "Inconsistent", "Needs improvement", "Not working"].map(x => `<option ${x === r ? "selected" : ""}>${x}</option>`).join("")}</select></div>
        <div class="stats" style="margin-top:10px"><div class="stat"><b>${s.days}</b><span>days with work saved</span></div><div class="stat"><b>${s.minutes}</b><span>minutes of active work</span></div>
          <div class="stat"><b>${s.worked.length}</b><span>assignments worked on</span></div><div class="stat"><b>${s.subs.length}</b><span>submitted this week</span></div>
          <div class="stat"><b>${s.avg == null ? "-" : s.avg + "%"}</b><span>average score on submitted work</span></div><div class="stat"><b>${s.earned}</b><span>bank points earned (balance ${s.balance})</span></div></div>
        <h3>This week</h3><textarea data-sum="${i}" rows="${Math.max(4, sum.split("\n").length + 1)}">${esc(sum)}</textarea>
        <h3>Assignments</h3>${rows ? `<table><thead><tr><th>Assignment</th><th>Status</th><th>Complete</th><th class="n">Score</th><th>Last worked</th><th class="n">Min</th></tr></thead><tbody>${rows}</tbody></table>` : `<p class="fine">No assignments to show.</p>`}
        <h3>Comment</h3><textarea data-note="${i}" rows="3" placeholder="Add a personal comment for the parent or coach (optional)">${esc(note)}</textarea>
        <div class="rbtn"><button class="ghost" data-copy="${i}">Copy as email text</button><button class="ghost" data-print="${i}">Print only this student</button><span class="fine" id="msg${i}"></span></div>
        <p class="fine noprint">${s.flags.length ? "Teacher note (not shown on the printed report): " + esc(s.flags.join("; ")) + ". " : ""}Minutes are measured from the editors, so work done on paper or away from the computer is not counted. For HTML assignments the minutes are the total on that assignment, so they can include earlier weeks.</p>
      </article>`;
    }).join("");
    document.querySelectorAll("select[data-rate]").forEach(el => el.onchange = () => { const s = STUDENTS[+el.dataset.rate]; ls.set(key(s, "rate"), el.value); $("pill" + el.dataset.rate).className = "pill " + rClass(el.value); $("pill" + el.dataset.rate).textContent = el.value; renderOverview(); });
    document.querySelectorAll("textarea[data-sum]").forEach(el => el.oninput = () => ls.set(key(STUDENTS[+el.dataset.sum], "sum"), el.value));
    document.querySelectorAll("textarea[data-note]").forEach(el => el.oninput = () => ls.set(key(STUDENTS[+el.dataset.note], "note"), el.value));
    document.querySelectorAll("button[data-copy]").forEach(b => b.onclick = () => { const i = +b.dataset.copy; copy(emailText(STUDENTS[i]), $("msg" + i)); });
    document.querySelectorAll("button[data-print]").forEach(b => b.onclick = () => { const i = +b.dataset.print; document.querySelectorAll(".report").forEach((el, k) => el.classList.toggle("skip", k !== i)); window.print(); setTimeout(applySel, 500); });
    applySel();
  }
  function copy(text, msg) {
    const done = ok => { msg.textContent = ok ? "Copied. Paste it into an email." : "Couldn't copy automatically; select the text and copy it."; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); else done(false);
  }

  // ---------- build ----------
  $("load").onclick = async () => {
    const period = $("period").value, ws = $("weekStart").value; if (!period || !ws) return;
    ls.set("wr:period", period);
    const start = mondayOf(fromIso(ws)); WEEK = { start: start.getTime(), end: start.getTime() + 7 * DAY };
    $("load").disabled = true;
    try {
      await loadAll();
      const klass = ROSTER.filter(s => s.period === period).sort((a, b) => a.name.localeCompare(b.name));
      STUDENTS = [];
      for (let i = 0; i < klass.length; i++) { $("status").textContent = `Building reports... ${i + 1} of ${klass.length}`; STUDENTS.push(await buildStudent(klass[i], true)); }
      $("status").textContent = `${klass.length} students, week of ${fmtDate(start)}.`;
      $("ovTitle").textContent = `Period ${period}: week of ${fmtDate(start)}`;
      $("overviewBox").hidden = false; renderOverview(); renderCards();
    } catch (e) { $("status").innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    $("load").disabled = false;
  };
  $("selAll").onclick = () => { STUDENTS.forEach(s => ls.set(key(s, "sel"), "1")); renderOverview(); };
  $("selNone").onclick = () => { STUDENTS.forEach(s => ls.set(key(s, "sel"), "0")); renderOverview(); };
  $("printSel").onclick = () => { applySel(); window.print(); };
  $("csv").onclick = () => {
    const q = s => '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"';
    const head = ["Student", "Period", "Week start", "Work ethic", "Days with work", "Active minutes", "Assignments worked", "Submitted this week", "Average score", "Open not started", "Bank points earned", "Bank balance", "Flags"];
    const rows = STUDENTS.map(s => [s.stu.name, s.stu.period, iso(new Date(WEEK.start)), ls.get(key(s, "rate")) || s.suggest, s.days, s.minutes, s.worked.length, s.subs.length, s.avg == null ? "" : s.avg, s.missing.map(i => i.name).join("; "), s.earned, s.balance, s.flags.join("; ")].map(q).join(","));
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + [head.map(q).join(",")].concat(rows).join("\n")], { type: "text/csv" }));
    a.download = "weekly-report-" + $("period").value + "-" + iso(new Date(WEEK.start)) + ".csv"; a.click();
  };
})();
