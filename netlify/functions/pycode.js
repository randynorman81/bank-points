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
const cleanChecks = (c) => (Array.isArray(c) ? c : []).slice(0, 80).map((x) => ({
  label: String((x && x.label) || "").slice(0, 140), re: String((x && x.re) || "").slice(0, 1200), flags: /^[gimsu]{0,4}$/.test(String((x && x.flags) || "")) ? String(x.flags || "") : "",
  min: Math.max(1, Math.min(200, Number(x && x.min) || 1)), pts: Math.max(1, Math.min(50, Number(x && x.pts) || 1)), where: ["code", "comments", "raw", "notes"].indexOf(x && x.where) > -1 ? x.where : "code"
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

async function saveDraft(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const code = String(body.code == null ? "" : body.code);
  if (code.length > MAX_CODE) return { error: "That file is too big to save." };
  await store().setJSON("draft:" + body.slot + ":" + enc(user.email), {
    email: user.email, name: user.name, period: cleanPeriod(body.period), slot: body.slot, mode: cleanMode(body.mode), code, world: cleanWorld(body.world), ticks: cleanTicks(body.ticks), savedAt: now()
  });
  return { ok: true };
}

async function submit(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const code = String(body.code == null ? "" : body.code);
  if (!code.trim()) return { error: "Your code is empty. Write something first!" };
  if (code.length > MAX_CODE) return { error: "That file is too big to submit." };
  const key = "sub:" + body.slot + ":" + enc(user.email);
  const prev = await readJSON(key, null);
  const rec = {
    email: user.email, name: user.name, period: cleanPeriod(body.period), slot: body.slot, mode: cleanMode(body.mode), code, world: cleanWorld(body.world), ticks: cleanTicks(body.ticks),
    output: String(body.output || "").slice(0, 4000),
    submittedAt: now(), count: (prev && prev.count ? prev.count : 0) + 1,
    teacher: prev && prev.teacher ? prev.teacher : null
  };
  await store().setJSON(key, rec);
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
  const text = JSON.stringify({ title, unit, num, blocks: body.blocks, checks: cleanChecks(body.checks), tips: cleanTips(body.tips), live: body.live !== false, publishedAt: now() });
  if (text.length > 120000) return { error: "That assignment is too big" };
  await store().setJSON("assign:" + body.slot, JSON.parse(text));
  return { ok: true, slot: body.slot, title };
}
async function adminDeleteAssignment(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  await store().delete("assign:" + body.slot);
  return { ok: true };
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
function scoreCode(checks, code) {
  const sp = splitCode(code); let passed = 0, credit = 0, possible = 0; const missing = [];
  checks.forEach((c) => {
    let n = 0; const flags = String(c.flags || "").replace(/g/g, "");
    try {
      if (c.where === "comments" || c.where === "notes") { const re = new RegExp(c.re, flags); (c.where === "notes" ? sp.notes : sp.comments).forEach((l) => { if (re.test(l)) n++; }); }
      else { const m = (c.where === "code" ? sp.code : String(code || "")).match(new RegExp(c.re, "g" + flags)); n = m ? m.length : 0; }
    } catch (e) { n = 0; }
    const w = c.pts || 1; possible += w; credit += w * Math.min(1, n / c.min);
    if (n >= c.min) passed++; else missing.push({ label: c.label, have: Math.min(n, c.min - 1), need: c.min, pts: w });
  });
  return { passed, total: checks.length, missing, pct: possible ? Math.round(credit * 100 / possible) : null };
}
async function liveScore(body) {
  if (!goodSlot(body.slot) || body.slot === "free") return { ok: true, pct: null };
  const code = String(body.code == null ? "" : body.code);
  if (code.length > 15000) return { ok: true, pct: null, tooLong: true };
  const rec = await readJSON("assign:" + body.slot, null);
  if (!rec || !Array.isArray(rec.checks) || !rec.checks.length) return { ok: true, pct: null };
  if (rec.live === false && !isAdmin(body)) return { ok: true, pct: null };
  const r = scoreCode(rec.checks, code);
  return { ok: true, pct: r.pct, passed: r.passed, total: r.total, missing: r.missing };
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

    if (["adminList", "adminCounts", "adminGrade", "adminDelete", "adminSetAssignment", "adminDeleteAssignment", "adminAssignments"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (action === "adminList") return ok(await adminList(body));
      if (action === "adminCounts") return ok(await adminCounts());
      if (action === "adminDelete") return ok(await adminDelete(body));
      if (action === "adminAssignments") return ok(await publicAssignments(true));
      if (action === "adminSetAssignment") return ok(await adminSetAssignment(body));
      if (action === "adminDeleteAssignment") return ok(await adminDeleteAssignment(body));
      return ok(await adminGrade(body));
    }

    if (action === "assignments") return ok(await publicAssignments());
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
