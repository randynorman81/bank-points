import { getStore } from "@netlify/blobs";

// PY SPRINT backend (tools/py-sprint/). A live, synchronized APCSP Python coding race.
//   - The teacher (ADMIN_PIN) hosts a room: picks challenges, starts each round, ends it, shows solutions.
//   - Students sign in with their school Google account and join with the room code. Their name comes from Google.
//   - The SERVER owns the clock and the points: round start time, elapsed time, rank, speed bonus and streak are all computed here,
//     so a student cannot edit their own score or finish time. (The Python tests themselves run in the student's browser.)
//   - Everyone polls /api/pysprint {action:"poll"} about once a second for the room and all players.
// Keys in the "py-sprint" store:
//   r:CODE   { room: {...}, players: { UID: {...} }, updated }

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const PERIODS = ["1A", "2B"];
const CODE_RE = /^[A-Z0-9]{3,8}$/;
const MAX_PLAYERS = 80;

const store = () => getStore({ name: "py-sprint", consistency: "strong" });
const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");
const cleanPeriod = (p) => { const s = String(p || "").toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 4); return PERIODS.indexOf(s) > -1 ? s : ""; };
const cleanCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number(v) || 0));

async function verifyGoogleToken(credential) {
  if (!credential) return null;
  const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential));
  if (!res.ok) return null;
  const p = await res.json();
  if (p.aud !== GOOGLE_CLIENT_ID) return null;
  if (p.email_verified !== "true" && p.email_verified !== true) return null;
  if ((p.hd || "").toLowerCase() !== SCHOOL_EMAIL_DOMAIN) return null;
  return { email: (p.email || "").toLowerCase(), name: String(p.name || "").slice(0, 60) };
}
async function rosterEntry(email) {
  try {
    const list = (await getStore({ name: "bank-points", consistency: "strong" }).get("students", { type: "json" })) || [];
    return list.find((s) => String(s.email || "").toLowerCase() === email) || null;
  } catch (e) { return null; }
}

/* points: same formula the page shows. rank is 0 for the first finisher. */
export function computeRoundPoints(elapsedSec, durationSec, rank, streakAfter) {
  const remain = Math.max(0, durationSec - elapsedSec);
  const base = 500, speedBonus = Math.round(500 * (remain / Math.max(1, durationSec)));
  const podiumBonus = rank === 0 ? 200 : rank === 1 ? 120 : rank === 2 ? 60 : 0;
  const streakBonus = Math.min(250, Math.max(0, streakAfter - 1) * 50);
  return { total: base + speedBonus + podiumBonus + streakBonus, base, speedBonus, podiumBonus, streakBonus };
}

async function mutate(code, fn) {
  const key = "r:" + code;
  for (let i = 0; i < 6; i++) {
    const r = await store().getWithMetadata(key, { type: "json" });
    if (!r) return { error: "Room not found", gone: true };
    const doc = r.data;
    const out = fn(doc);
    if (out && out.error) return out;
    doc.updated = Date.now();
    const res = await store().setJSON(key, doc, { onlyIfMatch: r.etag });
    if (res && res.modified) return { ok: true, doc, out };
  }
  return { error: "Busy, please try again" };
}

/* students never receive model solutions until the host reveals them */
function publicDoc(doc) {
  const room = JSON.parse(JSON.stringify(doc.room));
  const reveal = room.showSolution || room.status === "between" || room.status === "finished";
  room.playlist = (room.playlist || []).map((q, i) => {
    const copy = Object.assign({}, q);
    if (!(reveal && (room.status === "finished" || i === room.currentRound))) copy.solution = "";
    return copy;
  });
  return { room, players: doc.players };
}

function blankPlayer(uid, name, period, isBot) {
  return { uid, name, period, isBot: !!isBot, score: 0, streak: 0, roundsWon: 0, totalSolveTime: 0, roundSolved: -1, roundTime: null, roundPts: 0, roundRank: null, progressPct: 0, statusText: "Ready in lobby", passedChecks: 0, totalChecks: 0 };
}

/* the one place points are awarded */
function awardSolve(doc, p) {
  const room = doc.room;
  if (room.status !== "racing") return { error: "This round is not running." };
  if (p.roundSolved === room.currentRound) return { error: "Already solved this round." };
  const elapsed = (Date.now() - room.roundStartMs) / 1000;
  if (elapsed > room.durationSec + 2) return { error: "Time is up for this round." };
  if (elapsed < 1.5) return { error: "Too fast to be real." };
  const rank = Object.values(doc.players).filter((x) => x.roundSolved === room.currentRound).length;
  const streak = (p.streak || 0) + 1;
  const pts = computeRoundPoints(elapsed, room.durationSec, rank, streak);
  p.roundSolved = room.currentRound; p.roundTime = Number(elapsed.toFixed(1)); p.roundPts = pts.total; p.roundRank = rank + 1;
  p.score = (p.score || 0) + pts.total; p.streak = streak; p.roundsWon = (p.roundsWon || 0) + (rank === 0 ? 1 : 0);
  p.totalSolveTime = Number(((p.totalSolveTime || 0) + p.roundTime).toFixed(1)); p.progressPct = 100;
  p.statusText = "Finished #" + p.roundRank + " in " + p.roundTime.toFixed(1) + "s (+" + pts.total + ")";
  return { ok: true, pts, rank: p.roundRank };
}

/* ---------------- teacher actions ---------------- */
async function roomCreate(body) {
  const room = body.room || {}; const code = cleanCode(room.roomCode);
  if (!CODE_RE.test(code)) return { error: "Bad room code" };
  if (!Array.isArray(room.playlist) || !room.playlist.length || room.playlist.length > 60) return { error: "Pick between 1 and 60 challenges." };
  const clean = {
    roomCode: code, title: String(room.title || "APCSP Python Sprint").slice(0, 80), hostUid: "host",
    status: "lobby", currentRound: 0, durationSec: clamp(room.durationSec, 20, 300) || 60, roundStartMs: 0, showSolution: false,
    useBots: !!room.useBots, playlist: room.playlist.map((q) => ({
      id: String(q.id || "").slice(0, 60), category: String(q.category || "functions").slice(0, 30), title: String(q.title || "").slice(0, 120),
      difficulty: String(q.difficulty || "Custom").slice(0, 20), prompt: String(q.prompt || "").slice(0, 1500), checklist: (q.checklist || []).slice(0, 12).map((x) => String(x).slice(0, 120)),
      starter: String(q.starter || "").slice(0, 3000), solution: String(q.solution || "").slice(0, 3000), pyTest: String(q.pyTest || "").slice(0, 6000),
      expectedStdout: q.expectedStdout == null ? null : String(q.expectedStdout).slice(0, 500)
    })), createdAt: Date.now()
  };
  const key = "r:" + code;
  const existing = await store().get(key, { type: "json" });
  if (existing && Date.now() - (existing.updated || 0) < 6 * 3600 * 1000) return { error: "That room code is already in use. Launch again for a new code." };
  await store().setJSON(key, { room: clean, players: {}, updated: Date.now() });
  return { ok: true, code };
}
async function roundStart(body) {
  const code = cleanCode(body.code), idx = Math.round(Number(body.round));
  return mutate(code, (doc) => {
    const room = doc.room;
    if (!(idx >= 0 && idx < room.playlist.length)) return { error: "No such round" };
    Object.values(doc.players).forEach((p) => {
      if (idx > 0 && p.roundSolved !== idx - 1) p.streak = 0;
      p.roundSolved = -1; p.roundTime = null; p.roundPts = 0; p.roundRank = null; p.progressPct = 0; p.statusText = "Reading prompt..."; p.passedChecks = 0; p.totalChecks = 0;
    });
    room.currentRound = idx; room.status = "racing"; room.roundStartMs = Date.now(); room.showSolution = false;
  });
}
async function roundEnd(body) {
  return mutate(cleanCode(body.code), (doc) => { if (doc.room.status === "racing") { doc.room.status = "between"; doc.room.showSolution = true; } });
}
async function setSolution(body) {
  return mutate(cleanCode(body.code), (doc) => { doc.room.showSolution = !!body.show; });
}
async function roomFinish(body) {
  return mutate(cleanCode(body.code), (doc) => { doc.room.status = "finished"; doc.room.showSolution = false; });
}
async function roomDelete(body) {
  await store().delete("r:" + cleanCode(body.code)); return { ok: true };
}
/* AI racers are simulated by the host's browser; the server still awards their points with the same formula */
async function botTick(body) {
  const bots = Array.isArray(body.bots) ? body.bots.slice(0, 8) : [];
  return mutate(cleanCode(body.code), (doc) => {
    bots.forEach((b) => {
      const uid = "bot_" + String(b.uid || "").replace(/[^a-z0-9_]/gi, "").slice(0, 20); if (uid === "bot_") return;
      const p = doc.players[uid] || (doc.players[uid] = blankPlayer(uid, String(b.name || "AI").slice(0, 40), String(b.period || "").slice(0, 12), true));
      if (b.solve) awardSolve(doc, p);
      else if (p.roundSolved !== doc.room.currentRound) { p.progressPct = clamp(b.pct, 0, 90); p.statusText = String(b.status || "").slice(0, 60); }
    });
  });
}

/* ---------------- student actions ---------------- */
async function join(body, user) {
  const code = cleanCode(body.code);
  const r = await rosterEntry(user.email); const rp = r ? cleanPeriod(r.period) : "";
  const period = rp || cleanPeriod(body.period) || "APCSP";
  const res = await mutate(code, (doc) => {
    if (doc.room.status === "finished") return { error: "That race has already finished." };
    const uid = user.email;
    if (!doc.players[uid] && Object.keys(doc.players).length >= MAX_PLAYERS) return { error: "Room is full." };
    const p = doc.players[uid] || (doc.players[uid] = blankPlayer(uid, user.name, period, false));
    p.name = user.name; p.period = period;
  });
  if (res.error) return res;
  return { ok: true, uid: user.email, name: user.name, period };
}
async function progress(body, user) {
  return mutate(cleanCode(body.code), (doc) => {
    const p = doc.players[user.email]; if (!p) return { error: "Join the room first." };
    if (p.roundSolved === doc.room.currentRound) return;
    p.progressPct = clamp(body.pct, 0, 90); p.statusText = String(body.status || "").slice(0, 60);
    p.passedChecks = clamp(body.passed, 0, 50); p.totalChecks = clamp(body.total, 0, 50);
  });
}
async function solve(body, user) {
  let out = null;
  const res = await mutate(cleanCode(body.code), (doc) => {
    const p = doc.players[user.email]; if (!p) return { error: "Join the room first." };
    if (Number(body.round) !== doc.room.currentRound) return { error: "That round is over." };
    const a = awardSolve(doc, p); if (a.error) return a; out = a;
  });
  if (res.error) return res;
  return { ok: true, pts: out.pts, rank: out.rank };
}
async function poll(body) {
  const t0 = Date.now();
  const doc = await store().get("r:" + cleanCode(body.code), { type: "json" });
  if (!doc) return { exists: false, serverNow: Date.now() };
  const pub = publicDoc(doc);
  return { exists: true, room: pub.room, players: pub.players, serverNow: Date.now() };
}

export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") return ok({ ok: true, service: "pysprint" });
    if (req.method !== "POST") return ok({ error: "Unsupported method" });
    let body; try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const a = body.action;
    if (a === "poll") return ok(await poll(body));
    if (a === "exists") { const d = await store().get("r:" + cleanCode(body.code), { type: "json" }); return ok({ exists: !!d && d.room.status !== "finished" }); }
    if (["roomCreate", "roundStart", "roundEnd", "setSolution", "roomFinish", "roomDelete", "botTick", "checkPin"].indexOf(a) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (a === "checkPin") return ok({ ok: true });
      const fn = { roomCreate, roundStart, roundEnd, setSolution, roomFinish, roomDelete, botTick }[a];
      const r = await fn(body); return ok(r && r.doc ? { ok: true } : r);
    }
    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (a === "whoami") { const r = await rosterEntry(user.email); const rp = r ? cleanPeriod(r.period) : ""; return ok({ ok: true, name: user.name, email: user.email, period: rp, fromRoster: !!rp, periods: PERIODS }); }
    if (a === "join") return ok(await join(body, user));
    if (a === "progress") { const r = await progress(body, user); return ok(r.error ? r : { ok: true }); }
    if (a === "solve") return ok(await solve(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
