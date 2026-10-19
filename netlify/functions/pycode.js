import { getStore } from "@netlify/blobs";

// Python editor backend (python/editor.html).
//   - Students sign in with their school Google account (same setup as the HTML editor).
//   - Drafts and submissions are stored as blobs. Code is only stored, never run on the server.
//   - Teacher actions need the ADMIN_PIN (same one the bank and the HTML editor use).
// Work is kept per "slot": "free" for practice, or "a1".."a30" for numbered assignments.

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const SLOTS = ["free"].concat(Array.from({ length: 30 }, (_, i) => "a" + (i + 1)));
const MAX_CODE = 60000;
const MAX_WORLD = 20000;

function store() { return getStore({ name: "python-code", consistency: "strong" }); }
async function readJSON(key, fallback) {
  const v = await store().get(key, { type: "json" });
  return v == null ? fallback : v;
}

async function verifyGoogleToken(credential) {
  if (!credential) return null;
  const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential));
  if (!res.ok) return null;
  const p = await res.json();
  if (p.aud !== GOOGLE_CLIENT_ID) return null;
  if (p.email_verified !== "true" && p.email_verified !== true) return null;
  if ((p.hd || "").toLowerCase() !== SCHOOL_EMAIL_DOMAIN) return null;
  return { email: (p.email || "").toLowerCase(), name: String(p.name || "").slice(0, 80) };
}

function isAdmin(body) { return body && body.pin === (process.env.ADMIN_PIN || "1234"); }
const enc = (s) => encodeURIComponent(s);
const goodSlot = (l) => SLOTS.indexOf(l) > -1;
const now = () => new Date().toISOString();
const cleanPeriod = (p) => String(p || "").slice(0, 12).replace(/[^A-Za-z0-9 ]/g, "");
const cleanMode = (m) => (m === "karel" ? "karel" : "python");
// Which instruction checkboxes the student ticked (ids like "i0", "i1"...). Clamped so it can't be abused.
const cleanTicks = (t) => {
  if (!t || typeof t !== "object") return null;
  const ids = (Array.isArray(t.ids) ? t.ids : []).filter((x) => /^i\d{1,3}$/.test(String(x))).slice(0, 300);
  return { ids, total: Math.max(0, Math.min(300, Number(t.total) || 0)) };
};
/* the instruction checkbox(es) a check belongs to: a box number or a short list of them */
const cleanBox = (b) => { const l = (Array.isArray(b) ? b : [b]).map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < 400).slice(0, 14); return l.length ? (l.length === 1 ? l[0] : l) : undefined; };
const cleanChecks = (c) => (Array.isArray(c) ? c : []).slice(0, 300).map((x) => ({
  label: String((x && x.label) || "").slice(0, 140), re: String((x && x.re) || "").slice(0, 1200), flags: /^[gimsu]{0,4}$/.test(String((x && x.flags) || "")) ? String(x.flags || "") : "",
  min: Math.max(1, Math.min(200, Number(x && x.min) || 1)), pts: Math.max(1, Math.min(50, Number(x && x.pts) || 1)), where: ["code", "comments", "raw", "notes"].indexOf(x && x.where) > -1 ? x.where : "code",
  box: cleanBox(x && x.box)
})).filter((x) => x.label && x.re);
const cleanTips = (t) => {
  const out = {}; if (!t || typeof t !== "object") return out;
  const str = (v, n) => String(v == null ? "" : v).slice(0, n);
  Object.keys(t).slice(0, 100).forEach((id) => {
    if (!/^[a-z0-9_-]{1,40}$/.test(id) || !t[id]) return;
    out[id] = { title: str(t[id].title, 140), sections: (Array.isArray(t[id].sections) ? t[id].sections : []).slice(0, 14).map((x) => {
      const o = {}; if (x.h) o.h = str(x.h, 140); if (x.p) o.p = str(x.p, 1800); if (x.good) o.good = str(x.good, 900); if (x.warn) o.warn = str(x.warn, 900);
      ["steps", "list"].forEach((f) => { if (Array.isArray(x[f])) o[f] = x[f].slice(0, 14).map((v) => str(v, 500)); });
      if (Array.isArray(x.ex)) o.ex = x.ex.slice(0, 16).map((v) => str(v, 220));
      if (Array.isArray(x.rows)) o.rows = x.rows.slice(0, 14).map((r) => [str(r[0], 160), str(r[1], 160), str(r[2], 400)]);
      if (Array.isArray(x.quiz)) o.quiz = x.quiz.slice(0, 10).map((r) => [str(r[0], 240), str(r[1], 500)]);
      return o;
    }) };
  });
  return out;
};
const cleanWorld = (w) => { const s = typeof w === "string" ? w : ""; return s.length > MAX_WORLD ? "" : s; };

/* ---------------- student actions ---------------- */
async function mine(body, user) {
  const out = { ok: true, name: user.name, email: user.email };
  if (goodSlot(body.slot)) {
    out.submission = await readJSON("sub:" + body.slot + ":" + enc(user.email), null);
    out.draft = await readJSON("draft:" + body.slot + ":" + enc(user.email), null);
  }
  return out;
}

async function mySlots(user) {
  const e = enc(user.email);
  const has = await Promise.all(SLOTS.map(async (l) => {
    const [s, d] = await Promise.all([store().getMetadata("sub:" + l + ":" + e), store().getMetadata("draft:" + l + ":" + e)]);
    return { slot: l, submitted: !!s, saved: !!d };
  }));
  return { ok: true, slots: has.filter((x) => x.submitted || x.saved) };
}

const hashOf = (t) => { let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return h; };
async function logActivity(slot, email, code, period, submitted) {
  try {
    const key = "act:" + slot + ":" + enc(email), log = await readJSON(key, []), h = hashOf(code), last = log[log.length - 1];
    if (!submitted && last && last.h === h) return;
    let pct = null; const rec = variantFor(await readJSON("assign:" + slot, null), period);
    if (rec && Array.isArray(rec.checks) && rec.checks.length && code.length <= 15000) pct = scoreCode(rec.checks, code).pct;
    log.push({ t: now(), lines: code.split("\n").length, pct, h, sub: submitted ? 1 : 0 });
    await store().setJSON(key, log.slice(-300));
  } catch (e) { console.error("activity log failed", e); }
}
async function adminActivity(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  return { ok: true, log: await readJSON("act:" + body.slot + ":" + enc(String(body.email || "").toLowerCase()), []) };
}
/* who has been working lately, across every published assignment */
async function adminRecent(body) {
  const hours = Math.max(1, Math.min(72, Number(body.hours) || 12)), since = Date.now() - hours * 3600 * 1000, out = [];
  const all = (await publicAssignments(true)).assignments;
  for (const slot of Object.keys(all)) {
    if (all[slot].live === false && !body.drafts) continue;
    const subs = await Promise.all((await listPrefix("sub:" + slot + ":")).map((k) => store().get(k, { type: "json" })));
    const drafts = await Promise.all((await listPrefix("draft:" + slot + ":")).map((k) => store().get(k, { type: "json" })));
    const by = {};
    subs.forEach((x) => { if (x) by[x.email] = { sub: x }; });
    drafts.forEach((x) => { if (x) (by[x.email] = by[x.email] || {}).draft = x; });
    for (const e of Object.keys(by)) {
      const d = by[e].draft, sb = by[e].sub, tD = d ? Date.parse(d.savedAt) : 0, tS = sb ? Date.parse(sb.submittedAt) : 0, at = Math.max(tD || 0, tS || 0);
      if (!at || at < since) continue;
      const code = tD >= tS ? d.code : sb.code, rec = variantFor(all[slot], (d || sb).period); let pct = null;
      if (rec && Array.isArray(rec.checks) && rec.checks.length && String(code || "").length <= 15000) pct = scoreCode(rec.checks, String(code || "")).pct;
      out.push({ email: e, name: (d || sb).name, period: (d || sb).period, slot, num: all[slot].num || Number(slot.slice(1)), at: new Date(at).toISOString(), submitted: !!sb, submittedAt: sb ? sb.submittedAt : null, lines: String(code || "").split("\n").length, pct });
    }
  }
  out.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  return { ok: true, hours, rows: out };
}
async function saveDraft(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const code = String(body.code == null ? "" : body.code);
  if (code.length > MAX_CODE) return { error: "That file is too big to save." };
  await store().setJSON("draft:" + body.slot + ":" + enc(user.email), {
    email: user.email, name: user.name, period: cleanPeriod(body.period), slot: body.slot, mode: cleanMode(body.mode), code, world: cleanWorld(body.world), ticks: cleanTicks(body.ticks), savedAt: now()
  });
  await logActivity(body.slot, user.email, code, cleanPeriod(body.period), false);
  return { ok: true };
}

/* automatic grade: the percent the assignment's checks give. Returns the new teacher record, or null to keep what is there (a grade the teacher saved by hand is never replaced). */
const PASS = 80;   // a student needs this score to submit, and to open the next assignment
/* an assignment can carry a different version for one class period (variants: { "1A": { blocks, checks, tips } }) */
function variantFor(rec, period) {
  if (rec && rec.variants && period && rec.variants[period]) { const v = rec.variants[period]; return Object.assign({}, rec, { blocks: v.blocks, checks: v.checks, tips: v.tips }); }
  return rec;
}
/* did this student pass the assignment: the teacher's saved or automatic grade, or (if none) what the checks give now */
async function subPassed(slot, email) {
  const sub = await readJSON("sub:" + slot + ":" + enc(email), null); if (!sub) return false;
  const t = sub.teacher; if (t && t.score !== null && t.score !== undefined && t.score !== "" && !isNaN(Number(t.score))) return Number(t.score) >= PASS;
  const rec = variantFor(await readJSON("assign:" + slot, null), sub.period);
  if (!rec || !Array.isArray(rec.checks) || !rec.checks.length) return true;
  const r = scoreCode(rec.checks, sub.code || ""); return r.pct === null || r.pct >= PASS;
}
async function autoGradeFor(slot, code, current, period) {
  if (current && current.score !== null && current.score !== undefined && !current.auto) return null;
  const as = variantFor(await readJSON("assign:" + slot, null), period);
  if (!as || !Array.isArray(as.checks) || !as.checks.length) return null;
  const r = scoreCode(as.checks, code);
  if (r.pct === null) return null;
  return { score: r.pct, comment: current && current.comment ? current.comment : "", gradedAt: now(), auto: true, detail: { done: r.doneBoxes, total: r.totalBoxes, notDone: r.notDone.slice(0, 80) } };
}
async function submit(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const code = String(body.code == null ? "" : body.code);
  if (!code.trim()) return { error: "Your code is empty. Write something first!" };
  if (code.length > MAX_CODE) return { error: "That file is too big to submit." };
  const period = cleanPeriod(body.period);
  const asg = await readJSON("assign:" + body.slot, null);
  if (asg && asg.live !== false && body.slot !== "free") {
    const open = await gatedAssignments(user, period);
    if (!open.assignments[body.slot]) { const L = open.locked.find((x) => x.id === body.slot); return { error: L ? "Assignment " + L.num + " is locked. Finish Assignment " + L.needNum + " with a score of at least " + PASS + " first." : "That assignment is not open yet." }; }
    const v = variantFor(asg, period);
    if (Array.isArray(v.checks) && v.checks.length) { const r = scoreCode(v.checks, code); if (r.pct !== null && r.pct < PASS) return { error: "Your score is " + r.pct + " out of 100. You need at least " + PASS + " to submit. Open the \"still missing\" list, fix those parts so they match the steps exactly, and submit again.", pct: r.pct, need: PASS }; }
  }
  const key = "sub:" + body.slot + ":" + enc(user.email);
  const prev = await readJSON(key, null);
  const rec = {
    email: user.email, name: user.name, period, slot: body.slot, mode: cleanMode(body.mode), code, world: cleanWorld(body.world), ticks: cleanTicks(body.ticks),
    output: String(body.output || "").slice(0, 4000),
    submittedAt: now(), count: (prev && prev.count ? prev.count : 0) + 1,
    teacher: prev && prev.teacher ? prev.teacher : null
  };
  try { const g = await autoGradeFor(body.slot, code, rec.teacher, period); if (g) rec.teacher = g; } catch (e) { console.error("autograde failed", e); }
  await store().setJSON(key, rec);
  await logActivity(body.slot, user.email, code, period, true);
  return { ok: true, submittedAt: rec.submittedAt, count: rec.count };
}

/* ---------------- teacher actions ---------------- */
async function listPrefix(prefix) {
  const out = [];
  const res = await store().list({ prefix });
  for (const b of res.blobs || []) out.push(b.key);
  return out;
}

async function adminList(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const subs = await Promise.all((await listPrefix("sub:" + body.slot + ":")).map((k) => store().get(k, { type: "json" })));
  const drafts = await Promise.all((await listPrefix("draft:" + body.slot + ":")).map((k) => store().get(k, { type: "json" })));
  const byEmail = {};
  subs.forEach((s) => { if (s) byEmail[s.email] = { email: s.email, name: s.name, period: s.period, submission: s, draft: null }; });
  drafts.forEach((d) => {
    if (!d) return;
    if (!byEmail[d.email]) byEmail[d.email] = { email: d.email, name: d.name, period: d.period, submission: null, draft: d };
    else byEmail[d.email].draft = d;
  });
  // The Bank roster is the source of truth for periods.
  let roster = [];
  try { roster = (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || []; } catch (e) { roster = []; }
  roster.forEach((s) => {
    const email = String(s.email || "").toLowerCase();
    if (email && byEmail[email]) { byEmail[email].period = s.period || byEmail[email].period; byEmail[email].rosterName = s.name; }
  });
  return { ok: true, slot: body.slot, students: Object.values(byEmail) };
}

async function adminCounts() {
  const counts = {};
  for (const l of SLOTS) counts[l] = (await listPrefix("sub:" + l + ":")).length;
  return { ok: true, counts };
}

async function adminSetLive(body) {
  if (!goodSlot(body.slot) || body.slot === "free") return { error: "Unknown assignment" };
  const rec = await readJSON("assign:" + body.slot, null);
  if (!rec) return { error: "That assignment has not been uploaded yet" };
  rec.live = body.live === true || body.live === "true";
  await store().setJSON("assign:" + body.slot, rec);
  return { ok: true, slot: body.slot, live: rec.live };
}
async function adminAutograde(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const as = await readJSON("assign:" + body.slot, null);
  if (!as || !Array.isArray(as.checks) || !as.checks.length) return { error: "This assignment has no checks to grade with" };
  let graded = 0, keptByHand = 0;
  for (const k of await listPrefix("sub:" + body.slot + ":")) {
    const sub = await store().get(k, { type: "json" }); if (!sub) continue;
    const g = await autoGradeFor(body.slot, sub.code || "", sub.teacher, sub.period);
    if (!g) { if (sub.teacher && sub.teacher.score !== null && sub.teacher.score !== undefined && !sub.teacher.auto) keptByHand++; continue; }
    sub.teacher = g; await store().setJSON(k, sub); graded++;
  }
  return { ok: true, graded, keptByHand };
}
async function adminGrade(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const key = "sub:" + body.slot + ":" + enc(String(body.email || "").toLowerCase());
  const rec = await readJSON(key, null);
  if (!rec) return { error: "No submission found" };
  const score = body.score === "" || body.score == null ? null : Number(body.score);
  if (score !== null && (isNaN(score) || score < 0 || score > 1000)) return { error: "Score must be a number" };
  rec.teacher = { score, comment: String(body.comment || "").slice(0, 2000), gradedAt: now() };
  await store().setJSON(key, rec);
  return { ok: true, teacher: rec.teacher };
}

// Teacher-published assignment instructions (drafts live outside the repo; the publish script uploads them).
async function adminSetAssignment(body) {
  if (!goodSlot(body.slot) || body.slot === "free") return { error: "Unknown assignment" };
  const title = String(body.title || "").slice(0, 120), unit = String(body.unit || "").slice(0, 80), num = Math.max(0, Math.min(99, Number(body.num) || 0));
  if (!title || !Array.isArray(body.blocks) || !body.blocks.length) return { error: "Needs a title and blocks" };
  const variants = {};
  if (body.variants && typeof body.variants === "object") Object.keys(body.variants).forEach((p) => { const v = body.variants[p]; if (cleanPeriod(p) && v && Array.isArray(v.blocks)) variants[cleanPeriod(p)] = { blocks: v.blocks, checks: cleanChecks(v.checks), tips: cleanTips(v.tips) }; });
  const text = JSON.stringify({ title, unit, num, blocks: body.blocks, checks: cleanChecks(body.checks), tips: cleanTips(body.tips), variants, live: body.live !== false, publishedAt: now() });
  if (text.length > 400000) return { error: "That assignment is too big" };
  await store().setJSON("assign:" + body.slot, JSON.parse(text));
  return { ok: true, slot: body.slot, title };
}
async function adminDeleteAssignment(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  await store().delete("assign:" + body.slot);
  return { ok: true };
}
/* each student sees an assignment only after submitting the one before it (the first one is open to everyone); the teacher still controls which are published */
async function gatedAssignments(user, period) {
  const all = (await publicAssignments(true)).assignments, order = Object.keys(all).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  const out = {}, locked = []; let prev = null;
  for (const id of order) {
    const live = all[id].live !== false;
    let open = prev === null || (user && (await subPassed(prev, user.email)));
    if (live) { if (open) { const v = Object.assign({}, variantFor(all[id], period)); delete v.checks; delete v.variants; out[id] = v; } else locked.push({ id, need: prev, num: all[id].num || Number(id.slice(1)), needNum: all[prev].num || Number(prev.slice(1)) }); }
    if (live) prev = id;
  }
  return { ok: true, assignments: out, locked };
}
async function publicAssignments(all) {
  const out = {};
  for (const k of await listPrefix("assign:")) { const v = await store().get(k, { type: "json" }); if (v && (all || v.live !== false)) { if (!all) delete v.checks; out[k.slice(7)] = v; } }
  return { ok: true, assignments: out };
}

async function adminDelete(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const email = enc(String(body.email || "").toLowerCase());
  if (!email) return { error: "Missing email" };
  const subKey = "sub:" + body.slot + ":" + email, draftKey = "draft:" + body.slot + ":" + email;
  const hadSub = !!(await readJSON(subKey, null)), hadDraft = !!(await readJSON(draftKey, null));
  if (hadSub) await store().delete(subKey);
  if (body.draft && hadDraft) await store().delete(draftKey);
  if (!hadSub && !(body.draft && hadDraft)) return { error: "Nothing to delete" };
  return { ok: true };
}


/* ---------- automatic score (same rules the grading page uses; the rules never leave the server) ---------- */
function splitCode(code) {
  const comments = [], codeOnly = [], notes = [];
  const PROSE = /(?:^|\s)(?:the|is|are|was|a|an|to|of|it|that|this|so|because|when|means|makes|stores|asks|checks|says|gives|shows|changed|different)(?=[\s,.:;!?]|$)/i;
  const codeLike = (t) => !PROSE.test(t) && /^\s*([A-Za-z_]\w*(\[[^\]]*\])?\s*([-+*\/%]?=[^=]|\()|[A-Za-z_]\w*\.\w+\(|(if|elif|for|while|def|return|import|from|else|try|except|print|input)\b)/.test(t);
  String(code || "").split("\n").forEach((line) => {
    let q = "", cut = -1;
    for (let i = 0; i < line.length; i++) { const ch = line.charAt(i); if (q) { if (ch === "\\") i++; else if (ch === q) q = ""; } else if (ch === '"' || ch === "'") q = ch; else if (ch === "#") { cut = i; break; } }
    if (cut < 0) codeOnly.push(line);
    else {
      codeOnly.push(line.slice(0, cut)); const ctext = line.slice(cut + 1); comments.push(ctext);
      ctext.split("#").forEach((p, pi) => { if (p.trim() && !(pi === 0 && codeLike(p))) notes.push(p); });
    }
  });
  return { comments, notes, code: codeOnly.join("\n") };
}

/* where in the student's code a missing check belongs (sent with the "still missing" list so the editor can highlight it).
   Placement checks (note above / below / at the end of a line) are found from the shape of their pattern; the rest point to
   the spot just after the last line of the nearest earlier check that is already met. */
const ABOVE_SEP = "[ \\t]*\\S[^\\n]*\\n(?:[ \\t]*\\n)*[ \\t#]*", BELOW_SEP = "[^\\n]*\\n(?:[ \\t]*\\n)*[ \\t]*#(?:(?!", EOL_SUF = "[^\\n#]*#[ \\t]*\\S", EOL2_SUF = "[ \\t]*#[ \\t]*\\S";
function lineAt(text, idx) { let n = 1; for (let i = 0; i < idx && i < text.length; i++) if (text.charCodeAt(i) === 10) n++; return n; }
function matchLines(re, flags, text) {
  const out = []; let m; const rx = new RegExp(re, "g" + flags.replace(/g/g, ""));
  while ((m = rx.exec(text)) && out.length < 200) { out.push({ start: lineAt(text, m.index), end: lineAt(text, m.index + Math.max(0, m[0].length - 1)) }); if (m[0].length === 0) rx.lastIndex++; }
  return out;
}
function placementOf(c) {
  const re = String(c.re || ""); let kind = "", code = "";
  if (re.indexOf("^[ \\t]*#(?:(?!") === 0 && re.lastIndexOf(ABOVE_SEP) > 0) { kind = "above"; code = re.slice(re.lastIndexOf(ABOVE_SEP) + ABOVE_SEP.length); }
  else if (re.indexOf(BELOW_SEP) > 0 && /\\S\[\^\\n\]\*$/.test(re)) { kind = "below"; code = re.slice(0, re.indexOf(BELOW_SEP)); }
  else if (re.slice(-EOL_SUF.length) === EOL_SUF) { kind = "eol"; code = re.slice(0, -EOL_SUF.length); }
  else if (re.slice(-EOL2_SUF.length) === EOL2_SUF) { kind = "eol"; code = re.slice(0, -EOL2_SUF.length); }
  return kind && code ? { kind, code } : null;
}
const stepOf = (c) => { const m = /^(?:Step|Trace) (\d+)/.exec((c && c.label) || ""); return m ? +m[1] : 0; };
const isTitleCheck = (c) => /title" comment$/.test((c && c.label) || "");
/* ctx = { st: the step of this check, steps: { n: { first, last } } = where each step's code sits, lastMet } */
function hintFor(c, code, flags, ctx, n) {
  const pl = placementOf(c), st = ctx.st;
  try {
    if (pl && c.where !== "comments" && c.where !== "notes") {
      const anchors = matchLines(pl.code, flags, code).map((x) => (pl.kind === "below" ? x.start : x.end));
      if (!anchors.length) return { k: "need" };
      const done = {}; matchLines(c.re, flags, code).forEach((x) => { done[pl.kind === "above" ? x.end : x.start] = 1; });
      const lines = anchors.filter((a, i) => !done[a] && anchors.indexOf(a) === i).slice(0, 8);
      if (lines.length) return { k: pl.kind, lines };
    }
    if (st && isTitleCheck(c)) {
      // the step comment exists but is missing its title (or is not written the way the box asks): point at that line
      const half = matchLines("^[ \\t]*#[ \\t]*(?:step|trace)[ \\t]*" + st + "\\b[^\\n]*", "mi", code);
      if (half.length) return { k: "fix", lines: half.map((x) => x.start).slice(0, 3) };
      const r = ctx.steps[st];
      if (r) return { k: "add", after: Math.max(0, r.first - 1) };           // just above the first line of this step's code
      let prev = 0; Object.keys(ctx.steps).forEach((k2) => { if (+k2 < st) prev = Math.max(prev, ctx.steps[k2].last); });
      return { k: "add", after: prev };
    }
    if (n > 0 && c.where !== "comments" && c.where !== "notes") { const own = matchLines(c.re, flags, code); if (own.length) return { k: "add", after: own[own.length - 1].end }; }
    if (st) {
      const r = ctx.steps[st];
      if (r) return { k: "add", after: r.last };                              // after the last line of this step's code so far
      let prev = 0; Object.keys(ctx.steps).forEach((k2) => { if (+k2 < st) prev = Math.max(prev, ctx.steps[k2].last); });
      return { k: "add", after: prev };                                       // else after the previous step's code
    }
  } catch (e) {}
  return { k: "add", after: ctx.lastMet };
}
const NOTE_RE = "(?:(?![ \\t]*(?:print\\(|[A-Za-z_]\\w*(?:\\[[^\\]]*\\])?[ \\t]*[-+*/%]?=[^=]|[A-Za-z_][\\w.]*\\([^)\\n]*\\)[ \\t]*$|if |for |while ))|(?=[^\\n]*[ \\t](?:the|is|are|was|a|an|to|of|it|that|this|so|because|when|means|makes|stores|asks|checks|says|gives|shows|changed|different)(?=[ \\t,.:;!?]|$)))";
/* A comment counts when it is on the line it belongs to, or within two lines above or below it (students put the same comment in different places). */
function placementCount(c, flags, text) {
  const pl = placementOf(c); if (!pl || c.where === "comments" || c.where === "notes") return 0;
  const alt = [
    "^[ \\t]*#" + NOTE_RE + "[ \\t]*\\S[^\\n]*\\n(?:[^\\n]*\\n){0,2}[ \\t#]*" + pl.code,
    pl.code + "[^\\n]*\\n(?:[^\\n]*\\n){0,2}[ \\t]*#" + NOTE_RE + "[ \\t]*\\S[^\\n]*",
    pl.code + "[^\\n#]*#[ \\t]*\\S"
  ];
  let best = 0;
  alt.forEach((re) => { try { const m = text.match(new RegExp(re, "g" + flags.replace(/[mM]/g, "") + "m")); best = Math.max(best, m ? m.length : 0); } catch (e) {} });
  return best;
}
/* Grade = how many of the steps (instruction checkboxes) were completed. Every checkbox that has checks counts the same; a checkbox's credit is the average of its checks' credit. */
function tidySpaces(code) { return String(code || "").replace(/\r/g, "").replace(/\([ \t]+/g, "(").replace(/[ \t]+\)/g, ")"); }
function scoreCode(checks, code) {
  code = tidySpaces(code);
  const sp = splitCode(code); let passed = 0, credit = 0, possible = 0; const missing = []; let lastMet = 0; const text = String(code || ""); const boxes = {};
  // pass 1: how many times each check is found, and (for met checks) the lines it matched
  const pre = checks.map((c) => {
    let n = 0, ml = []; const flags = String(c.flags || "").replace(/g/g, "");
    try {
      if (c.where === "comments" || c.where === "notes") { const re = new RegExp(c.re, flags); (c.where === "notes" ? sp.notes : sp.comments).forEach((l) => { if (re.test(l)) n++; }); }
      else { const m = (c.where === "code" ? sp.code : text).match(new RegExp(c.re, "g" + flags)); n = m ? m.length : 0; }
      if (n >= c.min && c.where !== "comments" && c.where !== "notes") ml = matchLines(c.re, flags, text);
    } catch (e) { n = 0; }
    return { c, n, ml, flags };
  });
  // where each step's code sits: the first and last line matched by any met check of that step (not counting the step comment itself)
  const steps = {};
  pre.forEach((p) => { const st = stepOf(p.c); if (!st || !p.ml.length || isTitleCheck(p.c)) return; const r = steps[st] || (steps[st] = { first: 1e9, last: 0 }); p.ml.forEach((x) => { r.first = Math.min(r.first, x.start); r.last = Math.max(r.last, x.end); }); });
  pre.forEach((p) => { if (p.ml.length) lastMet = Math.max(lastMet, p.ml[p.ml.length - 1].end); });
  // pass 2: per-checkbox credit (each check counts the same inside its checkbox), and the missing list with hints
  pre.forEach((p) => {
    const c = p.c, n = p.n, w = c.pts || 1, frac = Math.min(1, n / c.min), housekeeping = /^Earlier work kept/i.test(c.label || "");
    if (!housekeeping) { possible += w; credit += w * frac; }
    if (!housekeeping && c.box !== undefined && c.box !== null) (Array.isArray(c.box) ? c.box : [c.box]).forEach((bx) => { const o = boxes[bx] || (boxes[bx] = { t: 0, m: 0, e: 0, p: 0, f: 0 }); o.t++; o.p += w; o.e += w * frac; o.f += frac; if (n >= c.min) o.m++; });
    if (n >= c.min) passed++;
    else if (!housekeeping) missing.push({ label: c.label, box: c.box, have: Math.min(n, c.min - 1), need: c.min, pts: w, hint: hintFor(c, text, p.flags, { st: stepOf(c), steps, lastMet }, n) });
  });
  const ids = Object.keys(boxes).map(Number).sort((x, y) => x - y);
  let sum = 0, done = 0; const notDone = [];
  ids.forEach((id) => { const v = boxes[id].f / boxes[id].t; sum += v; if (v >= 0.999) done++; else notDone.push(id); });
  let pct = ids.length ? Math.round(sum * 100 / ids.length) : (possible ? Math.round(credit * 100 / possible) : null);
  if (pct !== null && pct >= 100 && missing.length) pct = 99;   // 100 means every check is met, never just rounded up
  return { passed, total: checks.length, missing, boxes, pct, doneBoxes: done, totalBoxes: ids.length, notDone };
}
async function liveScore(body) {
  if (!goodSlot(body.slot) || body.slot === "free") return { ok: true, pct: null };
  const code = String(body.code == null ? "" : body.code);
  if (code.length > 15000) return { ok: true, pct: null, tooLong: true };
  const rec = variantFor(await readJSON("assign:" + body.slot, null), cleanPeriod(body.period));
  if (!rec || !Array.isArray(rec.checks) || !rec.checks.length) return { ok: true, pct: null };
  if (rec.live === false && !isAdmin(body)) return { ok: true, pct: null };
  const r = scoreCode(rec.checks, code);
  return { ok: true, need: PASS, pct: r.pct, passed: r.passed, total: r.total, missing: r.missing, boxes: r.boxes };
}

/* ---------------- request handler ---------------- */
export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "pycode" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body;
    try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;

    if (["adminList", "adminCounts", "adminGrade", "adminDelete", "adminSetAssignment", "adminDeleteAssignment", "adminAssignments", "adminAutograde", "adminSetLive", "adminActivity", "adminRecent"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (action === "adminList") return ok(await adminList(body));
      if (action === "adminCounts") return ok(await adminCounts());
      if (action === "adminDelete") return ok(await adminDelete(body));
      if (action === "adminAssignments") return ok(await publicAssignments(true));
      if (action === "adminSetAssignment") return ok(await adminSetAssignment(body));
      if (action === "adminDeleteAssignment") return ok(await adminDeleteAssignment(body));
      if (action === "adminAutograde") return ok(await adminAutograde(body));
      if (action === "adminSetLive") return ok(await adminSetLive(body));
      if (action === "adminActivity") return ok(await adminActivity(body));
      if (action === "adminRecent") return ok(await adminRecent(body));
      return ok(await adminGrade(body));
    }

    if (action === "assignments") return ok(await gatedAssignments(body.credential ? await verifyGoogleToken(body.credential) : null, cleanPeriod(body.period)));
    if (action === "score") return ok(await liveScore(body));
    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (action === "mine") return ok(await mine(body, user));
    if (action === "mySlots") return ok(await mySlots(user));
    if (action === "saveDraft") return ok(await saveDraft(body, user));
    if (action === "submit") return ok(await submit(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
