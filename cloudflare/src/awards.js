// Runs the bank-point award rules in teacher-settings/awards.js. Called by the cron trigger (every 10 minutes).
// A rule runs once, at the first check after its runAt time. Each student gets each award at most once.
import { getStore } from "@netlify/blobs";
import { AWARDS } from "../../teacher-settings/awards.js";

const EDITOR_STORE = { html: "unit7-code", python: "python-code", arduino: "arduino-code" };
const bank = () => getStore({ name: "bank-points", consistency: "strong" });

function scoreOf(sub) {
  if (!sub) return null;
  if (sub.teacher && typeof sub.teacher.score === "number") return sub.teacher.score;
  if (sub.auto && typeof sub.auto.pct === "number") return sub.auto.pct;
  if (typeof sub.score === "number") return sub.score;
  return null;
}
function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

/* read-modify-write that retries if someone else saved at the same moment */
async function update(key, fallback, fn) {
  for (let i = 0; i < 8; i++) {
    const cur = await bank().getWithMetadata(key, { type: "json" });
    const next = fn(cur ? cur.data : fallback);
    const r = await bank().setJSON(key, next, cur ? { onlyIfMatch: cur.etag } : { onlyIfNew: true });
    if (r.modified) return next;
  }
  throw new Error("busy: " + key);
}

export async function runAwards(nowMs) {
  const now = nowMs || Date.now(), log = [];
  const done = (await bank().get("awardsDone", { type: "json" })) || {};
  for (const rule of AWARDS) {
    if (!rule || !rule.id || done[rule.id]) continue;
    if (now < Date.parse(rule.runAt || rule.by)) continue;
    const storeName = EDITOR_STORE[rule.editor || "html"]; if (!storeName) continue;
    const code = getStore({ name: storeName, consistency: "strong" });
    const roster = (await bank().get("students", { type: "json" })) || [];
    const inPeriod = roster.filter((s) => String(s.period || "").toUpperCase() === String(rule.period || "").toUpperCase() && s.email);
    const by = Date.parse(rule.by), min = Number(rule.minScore || 0), winners = [];
    const keys = ((await code.list({ prefix: "sub:" + rule.lesson + ":" })).blobs || []).map((b) => b.key);
    const subs = {};
    for (const k of keys) { const v = await code.get(k, { type: "json" }); if (v && v.email) subs[String(v.email).toLowerCase()] = v; }
    for (const s of inPeriod) {
      const sub = subs[String(s.email).toLowerCase()], sc = scoreOf(sub);
      const when = Date.parse(rule.firstTurnIn ? (sub && (sub.firstSubmittedAt || sub.submittedAt)) : (sub && sub.submittedAt));
      if (sub && (min <= 0 || (sc !== null && sc >= min)) && when <= by) winners.push(s);
    }
    const stamp = new Date(now).toISOString();
    await update("transactions", [], (tx) => {
      const already = new Set(tx.filter((t) => t.award === rule.id).map((t) => t.studentId));
      winners.forEach((s) => { if (!already.has(s.id)) tx.push({ id: newId(), studentId: s.id, type: "EARNED", amount: Number(rule.amount), description: rule.comment || "", timestamp: stamp, award: rule.id }); });
      return tx;
    });
    await update("awardsDone", {}, (d) => { d[rule.id] = { at: stamp, students: winners.map((s) => s.name) }; return d; });
    log.push({ rule: rule.id, given: winners.map((s) => s.name) });
  }
  return log;
}
