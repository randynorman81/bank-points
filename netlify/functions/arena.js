import { getStore } from "@netlify/blobs";
import BANK from "./arena-bank.json";

// PYTHON ARENA: a live, join-code classroom game. The teacher hosts a match, students join on their own devices, everyone answers the same
// Python questions at the same time, and the match ends in a final scoreboard. Questions and answers live only here, so they are never
// sent to a student's browser until the round is revealed.
//   room:CODE      the match (phase, round plan, reveal results)         written only by the host's actions
//   p:CODE:ID      one player (score, streak, answers)                    written by that player (answers) and by the host's reveal
// Players only ever write their own record, so 30 students answering at once never fight over one document.

const JSON_HEADERS = { "Content-Type": "application/json" };
const store = () => getStore({ name: "arena", consistency: "strong" });
const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");
const QBY = {}; BANK.forEach((q) => { QBY[q.id] = q; });
const LIMIT = { out: 20, tf: 12, trace: 25, bug: 25, build: 45 };
const BAND_NAMES = { 1: "Names and types", 2: "Joining and converting", 3: "Math operators", 4: "Strings", 5: "Tracing code", 6: "Booleans and logic", 7: "If, elif, else", 8: "For loops" };
const PLANS = {
  10: [1, 2, 3, 4, 5, 6, 6, 7, 8, 8],
  15: [1, 2, 3, 3, 4, 4, 5, 6, 6, 6, 7, 7, 8, 8, 8],
  20: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8]
};
const GRACE_MS = 1500;      // answers that arrive just after the clock (network lag) still count
const STALE_MS = 12 * 3600 * 1000;
const DUEL_STAKE = 200;     // points the duel winner takes from the loser

const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const now = () => Date.now();
const norm = (s) => String(s == null ? "" : s).trim().replace(/^["']|["']$/g, "").trim().toLowerCase();
function cleanName(n) { return String(n || "").replace(/[\u0000-\u001f<>&"'`\\]/g, "").replace(/\s+/g, " ").trim().slice(0, 16); }
function newCode() { const L = "ABCDEFGHJKLMNPQRSTUVWXYZ"; let c = ""; for (let i = 0; i < 4; i++) c += L[Math.floor(Math.random() * L.length)]; return c; }
function newId() { return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6); }

async function getRoom(code) { return store().get("room:" + code, { type: "json" }); }
async function getPlayers(code) {
  const res = await store().list({ prefix: "p:" + code + ":" });
  const all = await Promise.all((res.blobs || []).map((b) => store().get(b.key, { type: "json" })));
  return all.filter(Boolean);
}

/* the question as a student may see it: no answers, choices and lines already in this round's shuffled order */
function publicQ(q, perm) {
  const o = { id: q.id, m: q.m, ask: q.ask };
  if (q.code) o.code = q.code;
  if (q.m === "out") o.ch = perm.map((i) => q.ch[i]);
  if (q.m === "tf") o.expr = q.expr;
  if (q.m === "bug") o.lines = q.lines;
  if (q.m === "build") o.lines = perm.map((i) => q.lines[i]);
  return o;
}
function judge(q, perm, a) {
  if (a == null) return false;
  if (q.m === "out") return perm[Number(a)] === 0;
  if (q.m === "tf") return String(a) === q.ok;
  if (q.m === "trace") return norm(a) === norm(q.ok);
  if (q.m === "bug") return Number(a) === q.ok;
  if (q.m === "build") return Array.isArray(a) && a.length === q.lines.length && a.every((p, k) => perm[Number(p)] === k);
  return false;
}
function correctText(q) {
  if (q.m === "out") return q.ch[0];
  if (q.m === "tf" || q.m === "trace") return String(q.ok);
  if (q.m === "bug") return "Line " + (q.ok + 1) + ":  " + q.lines[q.ok].trim();
  if (q.m === "build") return q.lines.join("\n");
  return "";
}

function planRounds(size) {
  const bands = PLANS[size] || PLANS[15], used = {}, rounds = []; let lastM = "";
  bands.forEach((b, i) => {
    let pool = BANK.filter((q) => q.band === b && !used[q.id]);
    const varied = pool.filter((q) => q.m !== lastM); if (varied.length) pool = varied;
    const q = pool[Math.floor(Math.random() * pool.length)]; used[q.id] = 1; lastM = q.m;
    const n = q.m === "out" ? q.ch.length : q.m === "build" ? q.lines.length : 0;
    const last = i === bands.length - 1;
    rounds.push({ qid: q.id, perm: shuffle(Array.from({ length: n }, (_, k) => k)), limit: LIMIT[q.m], duel: !last && (i + 1) % 5 === 0, mult: last ? 2 : 1, band: b });
  });
  return rounds;
}

function meView(p, round) {
  if (!p) return null;
  return { id: p.id, name: p.name, score: p.score, streak: p.streak, best: p.best || 0, rank: p.rank || 0, delta: p.delta || 0,
    answered: !!(p.answers && p.answers[round] !== undefined), hist: p.hist || {} };
}
function roundInfo(room, i) {
  const r = room.rounds[i], q = QBY[r.qid];
  return { round: i, total: room.rounds.length, band: r.band, bandName: BAND_NAMES[r.band], limit: r.limit, duel: r.duel, mult: r.mult, q: publicQ(q, r.perm) };
}

async function create(body) {
  const size = [10, 15, 20].indexOf(Number(body.size)) > -1 ? Number(body.size) : 15;
  let code = "", tries = 0;
  do { code = newCode(); tries++; const ex = await getRoom(code); if (!ex || now() - ex.created > STALE_MS) break; } while (tries < 30);
  const room = { code, created: now(), phase: "lobby", round: -1, rounds: planRounds(size), startedAt: 0, deadline: 0, results: {}, final: null };
  await store().setJSON("room:" + code, room);
  return { ok: true, code, rounds: room.rounds.length };
}

async function join(body) {
  const code = String(body.code || "").toUpperCase().trim(), name = cleanName(body.name);
  const room = await getRoom(code);
  if (!room || now() - room.created > STALE_MS) return { error: "No match with that code. Check the code on the big screen." };
  if (name.length < 2) return { error: "Pick a callsign with at least 2 characters." };
  if (room.phase === "final") return { error: "That match is over." };
  const players = await getPlayers(code);
  const same = players.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (same) return { ok: true, pid: same.id, name: same.name, back: true };   // same callsign = same player (a reload or a switched device)
  if (players.length >= 60) return { error: "This match is full." };
  const p = { id: newId(), name, score: 0, streak: 0, best: 0, rank: 0, delta: 0, joined: now(), answers: {}, hist: {} };
  await store().setJSON("p:" + code + ":" + p.id, p);
  return { ok: true, pid: p.id, name: p.name };
}

async function state(body) {
  const code = String(body.code || "").toUpperCase().trim(), room = await getRoom(code);
  if (!room) return { error: "No match with that code.", gone: true };
  const out = { ok: true, serverNow: now(), phase: room.phase, code };
  const host = isAdmin(body);
  let me = null, players = null;
  if (host) players = await getPlayers(code);
  else if (body.pid) { me = await store().get("p:" + code + ":" + String(body.pid), { type: "json" }); if (!me) return { error: "You were removed from this match.", gone: true }; }
  if (room.phase === "question" || room.phase === "reveal") {
    const info = roundInfo(room, room.round); out.r = info; out.startedAt = room.startedAt; out.deadline = room.deadline;
    if (room.phase === "reveal") out.reveal = room.results[room.round];
  }
  if (room.phase === "final") out.final = room.final;
  if (room.phase === "reveal") out.board = room.results[room.round].board;
  else if (room.phase === "question" && room.round > 0 && room.results[room.round - 1]) out.board = room.results[room.round - 1].board;
  out.total = room.rounds.length;
  if (host) {
    out.players = players.map((p) => ({ id: p.id, name: p.name, score: p.score, streak: p.streak, rank: p.rank || 0, answered: room.round >= 0 && p.answers && p.answers[room.round] !== undefined }))
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    if (room.phase === "reveal" || room.phase === "final") out.plan = room.rounds.map((r) => QBY[r.qid].m);
  } else if (me) {
    out.me = meView(me, room.round);
    if (room.phase === "final") out.myFinal = (room.final || []).find((f) => f.id === me.id) || null;
    if (room.phase === "reveal" && me.hist) out.myRound = me.hist[room.round] || null;
  }
  return out;
}

async function answer(body) {
  const code = String(body.code || "").toUpperCase().trim(), room = await getRoom(code);
  if (!room || room.phase !== "question") return { error: "The round is not open." };
  const t = now(); if (t > room.deadline + GRACE_MS) return { error: "Too late: time is up." }; if (t < room.startedAt - 400) return { error: "Hold on, the round has not started." };
  const key = "p:" + code + ":" + String(body.pid || ""), p = await store().get(key, { type: "json" });
  if (!p) return { error: "You are not in this match." };
  if (p.answers[room.round] !== undefined) return { ok: true, locked: true };
  let a = body.answer; if (typeof a === "string") a = a.slice(0, 80); if (Array.isArray(a)) a = a.slice(0, 12).map(Number);
  p.answers[room.round] = { a, t };
  await store().setJSON(key, p);
  return { ok: true, locked: true };
}

async function reveal(room) {
  const r = room.rounds[room.round], q = QBY[r.qid], players = await getPlayers(room.code);
  const before = players.slice().sort((a, b) => b.score - a.score || a.joined - b.joined);
  before.forEach((p, i) => { p.prevRank = i + 1; });
  const dist = q.m === "out" ? q.ch.map(() => 0) : [0, 0, 0];   // out: picks per displayed choice. Others: [correct, wrong, no answer]
  let fastest = null, correctN = 0, answeredN = 0;
  players.forEach((p) => {
    p.ps = p.score;   // score before this round (the graphics start from here)
    const a = p.answers[room.round], ans = a ? a.a : null, ok = !!a && judge(q, r.perm, ans);
    const ms = a ? Math.max(0, Math.min(r.limit * 1000, a.t - room.startedAt)) : null;
    let pts = 0;
    if (ok) { const frac = Math.max(0, 1 - ms / (r.limit * 1000)); pts = Math.round((600 + 400 * frac) * (1 + Math.min(p.streak, 5) * 0.1) * r.mult); }
    p.streak = ok ? p.streak + 1 : 0; p.best = Math.max(p.best || 0, p.streak); p.score += pts;
    p.hist[room.round] = { ok, pts, ms, none: !a };
    if (a) answeredN++; if (ok) { correctN++; if (!fastest || ms < fastest.ms) fastest = { name: p.name, ms }; }
    if (q.m === "out") { if (a && !isNaN(Number(ans)) && dist[Number(ans)] !== undefined) dist[Number(ans)]++; } else { dist[ok ? 0 : a ? 1 : 2]++; }
  });
  /* DUEL rounds: the scoreboard is paired off 1v2, 3v4 ... and each pair fights on this question; the winner takes points from the loser */
  const duels = [];
  if (r.duel) {
    for (let i = 0; i + 1 < before.length; i += 2) {
      const A = before[i], Bp = before[i + 1], ha = A.hist[room.round], hb = Bp.hist[room.round];
      let w = null; if (ha.ok && hb.ok) w = ha.ms <= hb.ms ? A : Bp; else if (ha.ok) w = A; else if (hb.ok) w = Bp;
      if (!w) { duels.push({ a: A.name, b: Bp.name, aId: A.id, bId: Bp.id, winner: null, winnerId: null, amt: 0 }); continue; }
      const l = w === A ? Bp : A, amt = Math.min(DUEL_STAKE, l.score); w.score += amt; l.score -= amt;
      w.hist[room.round].duel = amt; l.hist[room.round].duel = -amt;
      duels.push({ a: A.name, b: Bp.name, aId: A.id, bId: Bp.id, winner: w.name, winnerId: w.id, amt });
    }
    if (before.length % 2 === 1) duels.push({ a: before[before.length - 1].name, b: null, aId: before[before.length - 1].id, bId: null, winner: null, winnerId: null, amt: 0 });
  }
  const after = players.slice().sort((a, b) => b.score - a.score || a.joined - b.joined);
  after.forEach((p, i) => { p.rank = i + 1; p.delta = p.prevRank ? p.prevRank - p.rank : 0; });
  await Promise.all(players.map((p) => store().setJSON("p:" + room.code + ":" + p.id, p)));
  room.results[room.round] = {
    correct: correctText(q), m: q.m, dist, fastest, answeredN, correctN, total: players.length, duels,
    board: after.map((p) => ({ id: p.id, name: p.name, score: p.score, ps: p.ps, rank: p.rank, pr: p.prevRank, streak: p.streak, ok: p.hist[room.round].ok, none: p.hist[room.round].none, ms: p.hist[room.round].ms, pts: p.hist[room.round].pts, duel: p.hist[room.round].duel || 0 })),
    top: after.slice(0, 8).map((p) => ({ id: p.id, name: p.name, score: p.score, pts: p.hist[room.round].pts + (p.hist[room.round].duel || 0), rank: p.rank, delta: p.delta, streak: p.streak }))
  };
  room.phase = "reveal";
}

async function finish(room) {
  const players = await getPlayers(room.code), n = room.rounds.length;
  const sorted = players.sort((a, b) => b.score - a.score || a.joined - b.joined);
  room.final = sorted.map((p, i) => {
    const h = Object.values(p.hist || {}), right = h.filter((x) => x.ok).length;
    return { id: p.id, name: p.name, score: p.score, rank: i + 1, right, of: n, best: p.best || 0 };
  });
  room.phase = "final";
}

async function hostOp(body) {
  const code = String(body.code || "").toUpperCase().trim(), room = await getRoom(code);
  if (!room) return { error: "No such match." };
  const op = body.op;
  if (op === "kick") { await store().delete("p:" + code + ":" + String(body.pid || "")); return { ok: true }; }
  if (op === "close") { const ps = await getPlayers(code); await Promise.all(ps.map((p) => store().delete("p:" + code + ":" + p.id))); await store().delete("room:" + code); return { ok: true }; }
  if (op === "start" && room.phase === "lobby") { room.round = 0; room.phase = "question"; room.startedAt = now() + 1500; room.deadline = room.startedAt + room.rounds[0].limit * 1000; }
  else if (op === "reveal" && room.phase === "question") await reveal(room);
  else if (op === "next" && room.phase === "reveal") {
    if (room.round + 1 >= room.rounds.length) await finish(room);
    else { room.round++; room.phase = "question"; room.startedAt = now() + 1500; room.deadline = room.startedAt + room.rounds[room.round].limit * 1000; }   // a short beat so everyone sees the new round at once
  } else return { error: "That button does not work right now (phase: " + room.phase + ")." };
  await store().setJSON("room:" + code, room);
  return { ok: true, phase: room.phase };
}

export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  if (req.method !== "POST") return ok({ ok: true, service: "arena" });
  let body; try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
  try {
    switch (body.action) {
      case "create": return isAdmin(body) ? ok(await create(body)) : ok({ error: "Invalid PIN" });
      case "host": return isAdmin(body) ? ok(await hostOp(body)) : ok({ error: "Invalid PIN" });
      case "join": return ok(await join(body));
      case "state": return ok(await state(body));
      case "answer": return ok(await answer(body));
    }
  } catch (e) { return ok({ error: "Server error: " + (e && e.message) }); }
  return ok({ error: "Unknown action" });
};
