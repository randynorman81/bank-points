import { getStore } from "@netlify/blobs";

// PACKET QUEST backend (apcsp/packet-quest/). An AP CSP review game played on Fridays.
//   - Students sign in with their school Google account (same setup as the Python editor).
//   - The teacher opens missions (m1..m12) per class period. A closed mission can't be played by students.
//   - Every answer a student gives is recorded: attempts, first-try right or wrong, the wrong picks, and when it was finished.
//     Coding levels (c1-01 ...) record one attempt per Run, and keep the student's passing code (c).
//     The teacher dashboard (apcsp/packet-quest/teacher.html, ADMIN_PIN) turns that into completion grades and mastery by topic.
// Keys in the "packet-quest" store:
//   cfg          { open: { m1: ["1A","2B"], ... }, opened: {...ever opened...} }   written only by the teacher
//   p:EMAIL      one student's progress (see blankPlayer)              written only by that student's own requests

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const TEACHER_EMAILS = ["randy.norman@socialcircleschools.org"];
const PERIODS = ["1A", "2B"];   /* the AP CSP class periods (same as the Python editor) */
const MISSIONS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m10", "m11", "m12"];   /* c = coding worlds, m = AP review missions */
const NODE_RE = /^(m(1[0-2]|[1-9])|c[1-9])-\d{2}$/;

const store = () => getStore({ name: "packet-quest", consistency: "strong" });
const enc = (s) => encodeURIComponent(s);
const now = () => new Date().toISOString();
const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");
const isTeacher = (user) => !!user && TEACHER_EMAILS.indexOf(user.email) > -1;
const cleanPeriod = (p) => { const s = String(p || "").toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 4); return PERIODS.indexOf(s) > -1 ? s : ""; };

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

async function getCfg() { return (await store().get("cfg", { type: "json" })) || { open: {} }; }
async function roster() {
  try { return (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || []; } catch (e) { return []; }
}
async function rosterEntry(email) { return (await roster()).find((s) => String(s.email || "").toLowerCase() === email) || null; }

function blankPlayer(user) { return { email: user.email, name: user.name, period: "", n: {}, boss: { tries: 0, wins: 0, bestHits: 0 }, created: now(), updated: now() }; }
async function readPlayer(user) {
  const r = await store().getWithMetadata("p:" + enc(user.email), { type: "json" });
  return r ? { doc: r.data, etag: r.etag } : { doc: blankPlayer(user), etag: null };
}
/* read-modify-write that never loses an update when two requests from the same student overlap */
async function updatePlayer(user, fn) {
  for (let i = 0; i < 5; i++) {
    const { doc, etag } = await readPlayer(user);
    const out = fn(doc);
    doc.name = user.name || doc.name; doc.updated = now();
    const res = etag ? await store().setJSON("p:" + enc(user.email), doc, { onlyIfMatch: etag }) : await store().setJSON("p:" + enc(user.email), doc, { onlyIfNew: true });
    if (res && res.modified) return { doc, out };
  }
  throw new Error("Busy, please try again");
}

async function periodFor(user, doc) {
  const r = await rosterEntry(user.email);
  const rp = r ? cleanPeriod(r.period) : "";
  return { period: rp || cleanPeriod(doc.period), fromRoster: !!rp };
}
function openFor(cfg, period, teacher) {
  if (teacher) return MISSIONS.slice();
  return MISSIONS.filter((m) => Array.isArray(cfg.open[m]) && cfg.open[m].indexOf(period) > -1);
}

/* ---------------- student actions ---------------- */
async function me(user) {
  const [{ doc }, cfg] = await Promise.all([readPlayer(user), getCfg()]);
  const { period, fromRoster } = await periodFor(user, doc);
  return { ok: true, name: user.name, email: user.email, teacher: isTeacher(user), period, fromRoster, periods: PERIODS, open: openFor(cfg, period, isTeacher(user)), progress: { n: doc.n || {}, boss: doc.boss || {} } };
}
async function setPeriod(body, user) {
  const p = cleanPeriod(body.period);
  if (!p) return { error: "Pick your class period." };
  const r = await rosterEntry(user.email);
  if (r && cleanPeriod(r.period)) return { ok: true, period: cleanPeriod(r.period) };   /* the roster wins */
  await updatePlayer(user, (d) => { d.period = p; });
  return { ok: true, period: p };
}
async function answer(body, user) {
  const node = String(body.node || "");
  if (!NODE_RE.test(node)) return { error: "Unknown question" };
  const mission = node.split("-")[0];
  const cfg = await getCfg();
  const { doc } = await readPlayer(user);
  const { period } = await periodFor(user, doc);
  if (!isTeacher(user) && openFor(cfg, period, false).indexOf(mission) < 0) return { error: "That mission isn't open for your class right now.", closed: true };
  const right = body.ok === true, pick = String(body.pick == null ? "" : body.pick).slice(0, 80);
  const code = /^c/.test(node) && typeof body.code === "string" ? body.code.slice(0, 6000) : "";
  const { out } = await updatePlayer(user, (d) => {
    if (period && !d.period) d.period = period;
    const rec = d.n[node] || { a: 0 };
    if (rec.d) { rec.r = (rec.r || 0) + 1; if (right && code) rec.c = code; d.n[node] = rec; return rec; }   /* already finished: a replay, first-try data is kept */
    rec.a = (rec.a || 0) + 1;
    if (rec.a === 1) { rec.f = right; rec.t0 = now(); }
    if (!right && pick) { rec.w = (rec.w || []).concat(pick).slice(-6); }
    if (right) rec.d = now();
    if (right && code) rec.c = code;   /* coding levels: the student's passing code, for the teacher */
    d.n[node] = rec;
    return rec;
  });
  return { ok: true, rec: out };
}
async function boss(body, user) {
  const cfg = await getCfg();
  const { doc } = await readPlayer(user);
  const { period } = await periodFor(user, doc);
  if (!isTeacher(user) && openFor(cfg, period, false).indexOf("m12") < 0) return { error: "The Server Core isn't open for your class yet.", closed: true };
  const hits = Math.max(0, Math.min(99, Number(body.hits) || 0)), won = body.won === true;
  const { out } = await updatePlayer(user, (d) => {
    const b = d.boss || { tries: 0, wins: 0, bestHits: 0 };
    b.tries = (b.tries || 0) + 1; if (won) { b.wins = (b.wins || 0) + 1; if (!b.wonAt) b.wonAt = now(); }
    b.bestHits = Math.max(b.bestHits || 0, hits); b.lastAt = now();
    d.boss = b; return b;
  });
  return { ok: true, boss: out };
}

/* ---------------- teacher actions ---------------- */
async function adminAll() {
  const res = await store().list({ prefix: "p:" });
  const players = (await Promise.all((res.blobs || []).map((b) => store().get(b.key, { type: "json" })))).filter(Boolean);
  const r = (await roster()).filter((s) => PERIODS.indexOf(cleanPeriod(s.period)) > -1).map((s) => ({ name: s.name, email: String(s.email || "").toLowerCase(), period: cleanPeriod(s.period) }));
  /* the roster period wins over the one a student picked */
  const byEmail = {}; r.forEach((s) => { if (s.email) byEmail[s.email] = s; });
  players.forEach((p) => { const s = byEmail[p.email]; if (s) { p.period = s.period; p.rosterName = s.name; } });
  return { ok: true, cfg: await getCfg(), players, roster: r, periods: PERIODS, missions: MISSIONS };
}
async function adminSetOpen(body) {
  const m = String(body.mission || ""), p = cleanPeriod(body.period);
  if (MISSIONS.indexOf(m) < 0 || !p) return { error: "Unknown mission or period" };
  for (let i = 0; i < 5; i++) {
    const r = await store().getWithMetadata("cfg", { type: "json" });
    const cfg = r ? r.data : { open: {} };
    const list = (cfg.open[m] || []).filter((x) => x !== p);
    if (body.open === true) list.push(p);
    if (list.length) cfg.open[m] = list.sort(); else delete cfg.open[m];
    if (body.open === true) { cfg.opened = cfg.opened || {}; cfg.opened[m] = Array.from(new Set((cfg.opened[m] || []).concat(p))).sort(); }   /* every period it was ever opened for (for grades) */
    const res = r ? await store().setJSON("cfg", cfg, { onlyIfMatch: r.etag }) : await store().setJSON("cfg", cfg, { onlyIfNew: true });
    if (res && res.modified) return { ok: true, cfg };
  }
  return { error: "Busy, try again" };
}
async function adminReset(body) {
  const email = String(body.email || "").toLowerCase();
  if (!email) return { error: "No student" };
  await store().delete("p:" + enc(email));
  return { ok: true };
}

/* ---------------- request handler ---------------- */
export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "packetquest" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body;
    try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;
    if (["adminAll", "adminSetOpen", "adminReset"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (action === "adminAll") return ok(await adminAll());
      if (action === "adminSetOpen") return ok(await adminSetOpen(body));
      return ok(await adminReset(body));
    }
    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (action === "me") return ok(await me(user));
    if (action === "setPeriod") return ok(await setPeriod(body, user));
    if (action === "answer") return ok(await answer(body, user));
    if (action === "boss") return ok(await boss(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
