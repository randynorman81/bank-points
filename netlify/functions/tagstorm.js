import { getStore } from "@netlify/blobs";

// TAG STORM backend (tools/tag-storm/). An HTML & CSS arcade game for the IST classes.
//   - Students sign in with their school Google account (same setup as Packet Quest and the Python editor).
//   - Every finished run (win or lose) is recorded under the student: score, level reached, time, accuracy, difficulty.
//   - The teacher dashboard (tools/tag-storm/teacher.html, ADMIN_PIN) shows them by class (3A, 3B, 4A).
// Keys in the "tag-storm" store:
//   p:EMAIL   { email, name, period, runs: [ ...last 60 runs... ], live: the run in progress (level, score, per-level server timestamps), created, updated }

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const PERIODS = ["3A", "3B", "4A"];   /* the IST classes (same as IST_PERIODS in code.js) */
const DIFFS = ["freshman", "deans", "insane"];

const store = () => getStore({ name: "tag-storm", consistency: "strong" });
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

async function roster() {
  try { return (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || []; } catch (e) { return []; }
}
async function rosterEntry(email) { return (await roster()).find((s) => String(s.email || "").toLowerCase() === email) || null; }

function blankPlayer(user) { return { email: user.email, name: user.name, period: "", runs: [], created: now(), updated: now() }; }
async function readPlayer(user) {
  const r = await store().getWithMetadata("p:" + enc(user.email), { type: "json" });
  return r ? { doc: r.data, etag: r.etag } : { doc: blankPlayer(user), etag: null };
}
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

/* ---------------- student actions ---------------- */
async function me(user) {
  const { doc } = await readPlayer(user);
  const { period, fromRoster } = await periodFor(user, doc);
  return { ok: true, name: user.name, email: user.email, period, fromRoster, periods: PERIODS, runs: (doc.runs || []).length };
}
async function setPeriod(body, user) {
  const p = cleanPeriod(body.period);
  if (!p) return { error: "Pick your class." };
  const r = await rosterEntry(user.email);
  if (r && cleanPeriod(r.period)) return { ok: true, period: cleanPeriod(r.period) };   /* the roster wins */
  await updatePlayer(user, (d) => { d.period = p; });
  return { ok: true, period: p };
}
/* A run is timed by the SERVER: "start" opens it, "level" logs each cleared level, "run" finishes it.
   A win only counts (verified, EC points) if all of levels 1-9 were logged in order with realistic gaps,
   the server clock shows enough real time passed, and the claimed time is not faster than the server saw. */
const MIN_LEVEL_GAP = 4, MIN_WIN_SECS = 45;
async function start(body, user) {
  const diff = DIFFS.indexOf(body.diff) > -1 ? body.diff : "deans";
  const id = Math.random().toString(36).slice(2, 12);
  const { doc } = await readPlayer(user);
  const { period } = await periodFor(user, doc);
  await updatePlayer(user, (d) => { if (period && !d.period) d.period = period; d.live = { id, diff, t0: now(), levels: [], level: 1, score: 0, at: now() }; });
  return { ok: true, id };
}
async function level(body, user) {
  const l = Math.round(Number(body.level) || 0), score = Math.max(0, Math.min(10000000, Math.round(Number(body.score) || 0)));
  const { out } = await updatePlayer(user, (d) => {
    const lv = d.live;
    if (!lv || lv.id !== String(body.id || "")) return false;
    if (l !== lv.levels.length + 1 || l > 9) return false;   /* in order only */
    lv.levels.push({ l, at: now(), score });
    lv.level = l + 1; lv.score = score; lv.at = now();
    return true;
  });
  return { ok: !!out };
}
function verifyWin(live, secs) {
  if (!live || live.levels.length < 9) return false;
  let prev = new Date(live.t0).getTime();
  for (let i = 0; i < 9; i++) {
    const t = new Date(live.levels[i].at).getTime();
    if (live.levels[i].l !== i + 1 || t - prev < MIN_LEVEL_GAP * 1000) return false;
    prev = t;
  }
  const elapsed = (Date.now() - new Date(live.t0).getTime()) / 1000;
  return elapsed >= MIN_WIN_SECS && secs <= elapsed + 3;
}
async function run(body, user) {
  const { doc } = await readPlayer(user);
  const { period } = await periodFor(user, doc);
  const num = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
  const won = body.won === true;
  const live = doc.live && doc.live.id === String(body.id || "") ? doc.live : null;
  const secs = num(body.secs, 0, 36000);
  const verified = !!live && (won ? verifyWin(live, secs) : true);
  const rec = {
    at: now(),
    diff: DIFFS.indexOf(body.diff) > -1 ? body.diff : "deans",
    score: num(body.score, 0, 10000000),
    level: num(body.level, 1, 10),
    won: won && verified,
    claimedWin: won,
    verified,
    secs,
    acc: num(body.acc, 0, 100),
    ec: won && verified ? num(body.ec, 0, 100) : 0
  };
  if (!won && live) rec.level = Math.min(rec.level, live.levels.length + 1);   /* can't claim a level the server never saw */
  await updatePlayer(user, (d) => { if (period && !d.period) d.period = period; d.runs = (d.runs || []).concat(rec).slice(-60); if (d.live && live && d.live.id === live.id) d.live = null; });
  return { ok: true, run: rec };
}

/* ---------------- teacher actions ---------------- */
async function adminAll() {
  const res = await store().list({ prefix: "p:" });
  const players = (await Promise.all((res.blobs || []).map((b) => store().get(b.key, { type: "json" })))).filter(Boolean);
  const r = (await roster()).filter((s) => PERIODS.indexOf(cleanPeriod(s.period)) > -1).map((s) => ({ name: s.name, email: String(s.email || "").toLowerCase(), period: cleanPeriod(s.period) }));
  const byEmail = {}; r.forEach((s) => { if (s.email) byEmail[s.email] = s; });
  players.forEach((p) => { const s = byEmail[p.email]; if (s) { p.period = s.period; p.rosterName = s.name; } });
  return { ok: true, players, roster: r, periods: PERIODS };
}
async function adminReset(body) {
  const email = String(body.email || "").toLowerCase();
  if (!email) return { error: "No student" };
  await store().delete("p:" + enc(email));
  return { ok: true };
}

export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "tagstorm" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body;
    try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;
    if (["adminAll", "adminReset"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      return ok(action === "adminAll" ? await adminAll() : await adminReset(body));
    }
    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (action === "me") return ok(await me(user));
    if (action === "setPeriod") return ok(await setPeriod(body, user));
    if (action === "start") return ok(await start(body, user));
    if (action === "level") return ok(await level(body, user));
    if (action === "run") return ok(await run(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
