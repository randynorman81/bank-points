import { getStore } from "@netlify/blobs";
import { scorePart } from "./istlab-score.js";
import KEY from "./istlab-key.js";

// IST READING LABS backend (ist/lab/). Walkthroughs ("1.1w", 50 pts) and assignments ("1.1a", 100 pts) for units with no code to check.
//   - Students sign in with their school Google account; the SERVER scores every answer (the answers never reach the browser).
//   - A walkthrough is opened, then submitted (many tries; the best score counts). The assignment opens when the walkthrough has reached 100.
//   - A lab is closed to students until the teacher opens it (teacher dashboard, ADMIN_PIN). The teacher account can always open any lab.
//   - Submitting faster than a person could read the page is refused (the clock is the server's, started by "start").
// Keys in the "ist-lab" store:  p:EMAIL { email, name, period, labs: { "1.1w": { best, attempts, t0, secs, answers, log:[{at,pct}], first, last } } }   cfg { open: ["1.1w", ...] }

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const TEACHER_EMAILS = ["randy.norman@socialcircleschools.org"];
const PERIODS = ["3A", "3B", "4A"];
const store = () => getStore({ name: "ist-lab", consistency: "strong" });
const enc = (s) => encodeURIComponent(s);
const now = () => new Date().toISOString();
const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");
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
async function roster() { try { return (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || []; } catch (e) { return []; } }
async function rosterEntry(email) { return (await roster()).find((s) => String(s.email || "").toLowerCase() === email) || null; }
const isTeacher = (user) => TEACHER_EMAILS.indexOf(user.email) > -1;

function parseLab(lab) {
  const m = /^(\d+\.\d+)([wa])$/.exec(String(lab || "")); if (!m) return null;
  const L = KEY.lessons[m[1]]; if (!L || !L[m[2]]) return null;
  return { lesson: m[1], kind: m[2], spec: L[m[2]], lab: m[1] + m[2] };
}
async function openList() { try { const c = await store().get("cfg", { type: "json" }); return (c && c.open) || []; } catch (e) { return []; } }

function blank(user) { return { email: user.email, name: user.name, period: "", labs: {}, created: now(), updated: now() }; }
async function readP(user) {
  const r = await store().getWithMetadata("p:" + enc(user.email), { type: "json" });
  return r ? { doc: r.data, etag: r.etag } : { doc: blank(user), etag: null };
}
async function updateP(user, fn) {
  for (let i = 0; i < 5; i++) {
    const { doc, etag } = await readP(user);
    const out = fn(doc); doc.name = user.name || doc.name; doc.updated = now();
    const res = etag ? await store().setJSON("p:" + enc(user.email), doc, { onlyIfMatch: etag }) : await store().setJSON("p:" + enc(user.email), doc, { onlyIfNew: true });
    if (res && res.modified) return { doc, out };
  }
  throw new Error("Busy, please try again");
}
async function periodFor(user, doc) { const r = await rosterEntry(user.email); const rp = r ? cleanPeriod(r.period) : ""; return { period: rp || cleanPeriod(doc.period), fromRoster: !!rp }; }

function summary(doc, open, teacher) {
  const out = {};
  for (const [id, L] of Object.entries(KEY.lessons)) {
    for (const k of ["w", "a"]) {
      if (!L[k]) continue; const lab = id + k, rec = (doc.labs || {})[lab] || null;
      const wBest = ((doc.labs || {})[id + "w"] || {}).best || 0;
      out[lab] = { best: rec ? rec.best : null, attempts: rec ? rec.attempts : 0, pts: L[k].pts, earned: rec ? Math.round((L[k].pts * rec.best) / 100) : 0,
                   open: teacher || open.indexOf(lab) > -1, locked: k === "a" && wBest < 100 && !teacher };
    }
  }
  return out;
}

async function me(user) {
  const { doc } = await readP(user); const { period, fromRoster } = await periodFor(user, doc); const open = await openList();
  return { ok: true, name: user.name, email: user.email, period, fromRoster, periods: PERIODS, teacher: isTeacher(user), labs: summary(doc, open, isTeacher(user)) };
}
async function setPeriod(body, user) {
  const p = cleanPeriod(body.period); if (!p) return { error: "Pick your class." };
  const r = await rosterEntry(user.email); if (r && cleanPeriod(r.period)) return { ok: true, period: cleanPeriod(r.period) };
  await updateP(user, (d) => { d.period = p; }); return { ok: true, period: p };
}
async function gate(L, user) {
  const open = await openList(); const teacher = isTeacher(user);
  if (!teacher && open.indexOf(L.lab) < 0) return "This lab is not open yet. Your teacher opens it when the class is ready.";
  if (L.kind === "a" && !teacher) { const { doc } = await readP(user); if ((((doc.labs || {})[L.lesson + "w"] || {}).best || 0) < 100) return "Finish the walkthrough with 100% first."; }
  return null;
}
async function start(body, user) {
  const L = parseLab(body.lab); if (!L) return { error: "Unknown lab" };
  const g = await gate(L, user); if (g) return { error: g };
  const { doc } = await updateP(user, (d) => { const r = d.labs[L.lab] || (d.labs[L.lab] = { best: 0, attempts: 0, log: [] }); if (!r.t0 || r.done) { r.t0 = now(); r.done = false; } });
  const r = doc.labs[L.lab];
  return { ok: true, best: r.best || 0, answers: r.answers || {}, t0: r.t0 };
}
async function submit(body, user) {
  const L = parseLab(body.lab); if (!L) return { error: "Unknown lab" };
  const g = await gate(L, user); if (g) return { error: g };
  const ans = body.answers && typeof body.answers === "object" ? body.answers : {};
  const sc = scorePart(L.spec, ans);
  const { doc, out } = await updateP(user, (d) => {
    const r = d.labs[L.lab] || (d.labs[L.lab] = { best: 0, attempts: 0, log: [] });
    const secs = r.t0 ? (Date.now() - new Date(r.t0).getTime()) / 1000 : 0;
    const minSecs = (L.spec.items.length) * (L.kind === "w" ? 9 : 14) * (process.env.ISTLAB_TIME_SCALE ? Number(process.env.ISTLAB_TIME_SCALE) : 1);
    if (!r.t0 || secs < Math.min(minSecs, 400 * (process.env.ISTLAB_TIME_SCALE ? Number(process.env.ISTLAB_TIME_SCALE) : 1))) return { tooFast: true, need: Math.ceil(minSecs - secs) };
    r.attempts = (r.attempts || 0) + 1; r.last = now(); r.answers = ans; r.secs = Math.round(secs);
    r.log = (r.log || []).concat({ at: now(), pct: sc.pct }).slice(-20);
    if (sc.pct > (r.best || 0)) { r.best = sc.pct; r.bestAt = now(); r.bestAnswers = ans; }
    if (!r.first) r.first = now();
    if (sc.pct === 100) r.done = true;   /* the next visit starts a new clock */
    return { best: r.best };
  });
  if (out.tooFast) return { error: "That was faster than the notes can be read. Go back through them and try again in about " + Math.max(10, out.need) + " seconds.", tooFast: true };
  const hints = {}; for (const it of L.spec.items) if (!sc.results[it.id] && it.hint) hints[it.id] = it.hint;
  const why = {}; if (L.kind === "a" || sc.pct === 100) for (const it of L.spec.items) if (it.why) why[it.id] = it.why;
  return { ok: true, pct: sc.pct, right: sc.right, total: sc.total, results: sc.results, hints, why, best: out.best, earned: Math.round((L.spec.pts * out.best) / 100), pts: L.spec.pts };
}

async function adminAll() {
  const res = await store().list({ prefix: "p:" });
  const players = (await Promise.all((res.blobs || []).map((b) => store().get(b.key, { type: "json" })))).filter(Boolean);
  const r = (await roster()).filter((s) => PERIODS.indexOf(cleanPeriod(s.period)) > -1).map((s) => ({ name: s.name, email: String(s.email || "").toLowerCase(), period: cleanPeriod(s.period) }));
  const by = {}; r.forEach((s) => { if (s.email) by[s.email] = s; });
  players.forEach((p) => { const s = by[p.email]; if (s) { p.period = s.period; p.rosterName = s.name; } });
  const labs = []; for (const [id, L] of Object.entries(KEY.lessons)) for (const k of ["w", "a"]) if (L[k]) labs.push({ lab: id + k, title: L.title, kind: k, pts: L[k].pts });
  return { ok: true, players: players.map((p) => ({ email: p.email, name: p.rosterName || p.name, period: p.period, labs: Object.fromEntries(Object.entries(p.labs || {}).map(([k, v]) => [k, { best: v.best, attempts: v.attempts, secs: v.secs, last: v.last }])) })), roster: r, periods: PERIODS, labs, open: await openList() };
}
async function adminOpen(body) {
  const ids = (Array.isArray(body.open) ? body.open : []).map(String).filter((x) => parseLab(x));
  await store().setJSON("cfg", { open: ids, updated: now() }); return { ok: true, open: ids };
}
async function adminReset(body) {
  const email = String(body.email || "").toLowerCase(); if (!email) return { error: "No student" };
  if (!body.lab) { await store().delete("p:" + enc(email)); return { ok: true }; }
  const res = await store().getWithMetadata("p:" + enc(email), { type: "json" }); if (!res) return { ok: true };
  delete res.data.labs[String(body.lab)]; await store().setJSON("p:" + enc(email), res.data); return { ok: true };
}

export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "istlab" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body; try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;
    if (action === "open") return ok({ ok: true, open: await openList() });
    if (["adminAll", "adminOpen", "adminReset"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      return ok(action === "adminAll" ? await adminAll() : action === "adminOpen" ? await adminOpen(body) : await adminReset(body));
    }
    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (action === "me") return ok(await me(user));
    if (action === "setPeriod") return ok(await setPeriod(body, user));
    if (action === "start") return ok(await start(body, user));
    if (action === "submit") return ok(await submit(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) { return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS }); }
};
