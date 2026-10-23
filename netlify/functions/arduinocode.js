import { getStore } from "@netlify/blobs";

// Arduino circuit editor backend (arduino/editor.html).
//   - Students sign in with their school Google account (same setup as the Python and HTML editors).
//   - Drafts and submissions (the circuit as JSON plus the code) are stored as blobs. Nothing is ever run on the server.
//   - Teacher actions need the ADMIN_PIN (same one the bank and the other editors use).
// Work is kept per "slot": "free" for practice, or "a1".."a30" for numbered assignments.

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const SLOTS = ["free", "u2-2", "u2-2a", "u2-3", "u2-3b", "u2-4", "u2-5", "u2-6", "u2-7", "u2-7b"].concat(Array.from({ length: 30 }, (_, i) => "a" + (i + 1)));
const MAX_CODE = 60000;
const MAX_PROJECT = 200000;

function store() { return getStore({ name: "arduino-code", consistency: "strong" }); }
async function readJSON(key, fallback) { const v = await store().get(key, { type: "json" }); return v == null ? fallback : v; }

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
const cleanAuto = (a) => (a && typeof a === "object" ? { pct: Math.max(0, Math.min(100, Number(a.pct) || 0)), passed: Math.max(0, Math.min(500, Number(a.passed) || 0)), total: Math.max(0, Math.min(500, Number(a.total) || 0)) } : null);
/* the circuit: a list of parts and a list of wires. Only known part types and plain numbers/strings are kept, so nothing odd can be stored. */
const PART_TYPES = ["uno", "breadboard", "led", "resistor", "button", "buzzer"];
function cleanProject(p) {
  if (!p || typeof p !== "object" || !Array.isArray(p.parts) || !Array.isArray(p.wires)) return null;
  if (p.parts.length > 120 || p.wires.length > 400) return null;
  const num = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v) * 100) / 100 : 0);
  const id = (v) => String(v || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24);
  const parts = p.parts.filter((x) => x && PART_TYPES.indexOf(x.type) > -1).map((x) => ({
    id: id(x.id), type: x.type, x: num(x.x), y: num(x.y), rot: ((Math.trunc(Number(x.rot)) || 0) % 4 + 4) % 4,
    props: { size: x.props && x.props.size === "mini" ? "mini" : "half", color: String((x.props && x.props.color) || "").replace(/[^a-z]/g, "").slice(0, 12), ohms: Math.max(1, Math.min(1e7, Number(x.props && x.props.ohms) || 220)), span: Math.max(3, Math.min(12, Math.round(Number(x.props && x.props.span)) || 4)) }
  }));
  const term = (t) => String((t && t.term) || "").replace(/[^A-Za-z0-9_:-]/g, "").slice(0, 40);
  const wires = p.wires.map((w) => ({ id: id(w && w.id), a: { term: term(w && w.a) }, b: { term: term(w && w.b) }, color: String((w && w.color) || "green").replace(/[^a-z#0-9]/gi, "").slice(0, 12) })).filter((w) => w.a.term && w.b.term);
  return { parts, wires };
}

/* written / matching / fill-in answers: { itemKey: "text" or ["A","B",...] } */
function cleanAnswers(a) {
  const out = {}; if (!a || typeof a !== "object") return out;
  Object.keys(a).slice(0, 200).forEach((k) => { const key = String(k).replace(/[^A-Za-z0-9_.:-]/g, "").slice(0, 40); const v = a[k]; if (!key) return;
    if (typeof v === "string") out[key] = v.slice(0, 4000); else if (Array.isArray(v)) out[key] = v.slice(0, 30).map((x) => String(x == null ? "" : x).slice(0, 80)); });
  return out;
}

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
function readWork(body) {
  const code = String(body.code == null ? "" : body.code);
  if (code.length > MAX_CODE) return { error: "That code is too big to save." };
  const project = cleanProject(body.project);
  if (!project) return { error: "The circuit could not be saved (it looks too big or damaged)." };
  if (JSON.stringify(project).length > MAX_PROJECT) return { error: "The circuit is too big to save." };
  return { code, project };
}
async function saveDraft(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const w = readWork(body); if (w.error) return w;
  await store().setJSON("draft:" + body.slot + ":" + enc(user.email), { email: user.email, name: user.name, period: cleanPeriod(body.period), slot: body.slot, code: w.code, project: w.project, answers: cleanAnswers(body.answers), auto: cleanAuto(body.auto), savedAt: now() });
  return { ok: true };
}
async function submit(body, user) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const w = readWork(body); if (w.error) return w;
  if (!w.project.parts.some((p) => p.type !== "uno" && p.type !== "breadboard") && !w.code.trim()) return { error: "There is nothing to submit yet. Build a circuit and write some code first!" };
  const key = "sub:" + body.slot + ":" + enc(user.email), prev = await readJSON(key, null);
  const rec = {
    email: user.email, name: user.name, period: cleanPeriod(body.period), slot: body.slot, code: w.code, project: w.project, answers: cleanAnswers(body.answers), auto: cleanAuto(body.auto),
    output: String(body.output || "").slice(0, 3000), submittedAt: now(), count: (prev && prev.count ? prev.count : 0) + 1, teacher: prev && prev.teacher ? prev.teacher : null
  };
  await store().setJSON(key, rec);
  return { ok: true, submittedAt: rec.submittedAt, count: rec.count };
}

async function listPrefix(prefix) { const out = []; const res = await store().list({ prefix }); for (const b of res.blobs || []) out.push(b.key); return out; }
async function adminList(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const subs = await Promise.all((await listPrefix("sub:" + body.slot + ":")).map((k) => store().get(k, { type: "json" })));
  const drafts = await Promise.all((await listPrefix("draft:" + body.slot + ":")).map((k) => store().get(k, { type: "json" })));
  const byEmail = {};
  subs.forEach((s) => { if (s) byEmail[s.email] = { email: s.email, name: s.name, period: s.period, submission: s, draft: null }; });
  drafts.forEach((d) => { if (!d) return; if (!byEmail[d.email]) byEmail[d.email] = { email: d.email, name: d.name, period: d.period, submission: null, draft: d }; else byEmail[d.email].draft = d; });
  let roster = [];
  try { roster = (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || []; } catch (e) { roster = []; }
  roster.forEach((s) => { const email = String(s.email || "").toLowerCase(); if (email && byEmail[email]) { byEmail[email].period = s.period || byEmail[email].period; byEmail[email].rosterName = s.name; } });
  return { ok: true, slot: body.slot, students: Object.values(byEmail) };
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
async function adminDelete(body) {
  if (!goodSlot(body.slot)) return { error: "Unknown assignment" };
  const e = enc(String(body.email || "").toLowerCase());
  await store().delete("sub:" + body.slot + ":" + e); await store().delete("draft:" + body.slot + ":" + e);
  return { ok: true };
}
async function adminCounts() {
  const counts = {};
  for (const l of SLOTS) counts[l] = (await listPrefix("sub:" + l + ":")).length;
  return { ok: true, counts };
}

export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "arduinocode" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body; try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;
    if (["adminList", "adminGrade", "adminDelete", "adminCounts"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (action === "adminList") return ok(await adminList(body));
      if (action === "adminCounts") return ok(await adminCounts());
      if (action === "adminDelete") return ok(await adminDelete(body));
      return ok(await adminGrade(body));
    }
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
