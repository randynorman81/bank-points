/* GAME FLOW TEST (server): the real pycode.js with pretend sign-in. Checks the rules around the games:
   locked until the walkthrough is passed, only the player can answer their own run, answers in order, the best score is kept,
   a hand-typed teacher score is never overwritten, 90 opens the next walkthrough, and the teacher preview saves nothing. */
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { start, mem } = await import("./devserver.mjs");
const { makeQuestion } = await import("../../netlify/functions/gamebank.js");
const core = require("./index.js");
const PORT = 8132, BASE = "http://localhost:" + PORT; await start(PORT);
let bad = 0; const say = (m) => { bad++; console.log("  PROBLEM: " + m); }; const ok = (c, m) => { if (!c) say(m); else console.log("  ok: " + m); };
async function call(body, who) { const r = await fetch(BASE + "/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.assign(who === "admin" ? { pin: "1234" } : who ? { credential: "test:" + who + "@socialcircleschools.org" } : {}, body)) }); return r.json(); }
const ADA = "ada", BOB = "bob", TEACH = "randy.norman";
/* publish: walkthrough a101 (must reach 100), game mission a102 (90 opens the next), next walkthrough a103 */
const wt = core.RECORDS.find((r) => r.slot === "a101"), game = core.RECORDS.find((r) => r.slot === "a102"), nxt = core.RECORDS.find((r) => r.slot === "a103");
for (const r of [wt, game, nxt]) { const rec = r.rec; const up = await call({ action: "adminSetAssignment", slot: r.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: rec.checks, tips: rec.tips, game: rec.game, autoRun: rec.autoRun || [], live: true }, "admin"); if (!up.ok) throw new Error(JSON.stringify(up)); await call({ action: "adminSetLive", slot: r.slot, live: true, part: rec.part, passMin: rec.passMin, seq: rec.seq, points: rec.points, fresh: r.slot === "a101" }, "admin"); }
const verify = JSON.parse(fs.readFileSync(new URL("./testkit/verify.json", import.meta.url)));
const finished = verify.find((v) => v.slot === "a101");

console.log("\n1. the mission is locked until the walkthrough is passed");
let st = await call({ action: "gameStart", slot: "a102" }, ADA); ok(st.error && /locked/i.test(st.error), "a student cannot start the game yet: " + st.error);
st = await call({ action: "gameStart", slot: "a102" }); ok(st.needLogin, "no sign-in means no game");
st = await call({ action: "gameStart", slot: "a101" }, ADA); ok(st.error && /not a game/i.test(st.error), "a walkthrough is not a game");
st = await call({ action: "gameStart", slot: "a999" }, ADA); ok(!!st.error, "an unknown slot is refused");
const seen = await call({ action: "assignments" }, ADA); ok(!!seen.assignments.a101 && !seen.assignments.a102, "the student sees the walkthrough but the mission is not open");

console.log("\n2. passing the walkthrough at 100 opens the game");
const sub = await call({ action: "submit", slot: "a101", code: finished.code, gradeOutput: finished.output, output: finished.output, period: "1A" }, ADA); ok(sub.ok && sub.unlock && sub.unlock.passed === true, "walkthrough submitted and counted as passed (100)");
const open = await call({ action: "assignments", period: "1A" }, ADA); ok(!!open.assignments.a102, "the mission is open now");

/* play a run: answers decided by a function (round index, question) -> answer */
async function play(who, answerFn, label) {
  const s = await call({ action: "gameStart", slot: "a102" }, who); if (!s.ok) { say(label + ": could not start " + JSON.stringify(s)); return null; }
  const run = JSON.parse(mem.get("grun:" + s.runId)); let last = null, q = s.question;
  ok(!("sol" in s.question), label + ": the student's question has no solution in it");
  for (let i = 0; i < 10; i++) {
    const x = makeQuestion(run.game, run.seed, i), ans = answerFn(i, x);
    last = await call({ action: "gameAnswer", runId: s.runId, n: i, answer: ans }, who);
    if (last.error) { say(label + ": " + last.error); return null; }
    if (last.done) break;
  }
  return { id: s.runId, last, start: s };
}
const right = (i, x) => { const a = x.a; return "idx" in a ? { idx: a.idx } : "value" in a ? { value: a.value } : { values: a.values }; };
const wrongAns = (i, x) => ({ timeout: true });

console.log("\n3. a perfect run");
let r1 = await play(ADA, right, "perfect"); ok(r1 && r1.last.final && r1.last.final.pct === 100 && r1.last.final.best === 100, "perfect run scores 100, best 100");
const afterPerfect = await call({ action: "assignments", period: "1A" }, ADA); ok(!!afterPerfect.assignments.a103, "100 opens the NEXT walkthrough (a103)");
const stt = await call({ action: "gameState", slot: "a102" }, ADA); ok(stt.best === 100 && stt.runs === 1 && stt.game === "bomb", "gameState shows best 100 after 1 run");

console.log("\n4. a worse replay never lowers the best score");
let r2 = await play(ADA, (i, x) => (i === 3 || i === 5 ? wrongAns(i, x) : right(i, x)), "two mistakes"); ok(r2 && r2.last.final.pct === 80 && r2.last.final.best === 100 && r2.last.final.runs === 2, "80 this time, best stays 100, 2 runs");

console.log("\n5. three mistakes end the game early");
let r3 = await play(ADA, (i, x) => (i < 3 ? wrongAns(i, x) : right(i, x)), "three strikes"); ok(r3 && r3.last.over && r3.last.done && r3.last.final.pct === 0 && r3.last.n === 3, "three wrong answers in a row end the game at round 3 with 0");

console.log("\n6. nobody can borrow another player's run, skip ahead, or keep answering");
const s2 = await call({ action: "gameStart", slot: "a102" }, ADA);
let bad1 = await call({ action: "gameAnswer", runId: s2.runId, n: 0, answer: { idx: 0 } }, BOB); ok(bad1.error && /not your game/i.test(bad1.error), "another student cannot answer your run");
bad1 = await call({ action: "gameAnswer", runId: s2.runId, n: 2, answer: { idx: 0 } }, ADA); ok(bad1.error && /order/i.test(bad1.error), "answers must be in order");
bad1 = await call({ action: "gameAnswer", runId: "nonsense", n: 0, answer: {} }, ADA); ok(!!bad1.error, "a made-up run id is refused");
const done = await play(ADA, right, "finish"); bad1 = await call({ action: "gameAnswer", runId: done.id, n: 10, answer: { idx: 0 } }, ADA); ok(bad1.error, "a finished game cannot be answered again");
const bobStart = await call({ action: "gameStart", slot: "a102" }, BOB); ok(bobStart.error && /locked/i.test(bobStart.error), "bob has not passed the walkthrough so the game is still locked for him");

console.log("\n7. a score the teacher typed in by hand is never replaced");
const g = await call({ action: "adminGrade", slot: "a102", email: "ada@socialcircleschools.org", score: 70, comment: "regraded by hand" }, "admin"); ok(g.ok, "teacher saved 70 by hand");
await play(ADA, right, "after hand grade"); const subRec = JSON.parse(mem.get("sub:a102:" + encodeURIComponent("ada@socialcircleschools.org"))); ok(subRec.teacher.score === 70 && subRec.teacher.comment === "regraded by hand" && subRec.game.best === 100, "the hand-typed 70 is kept while the game still records its own best (100)");

console.log("\n8. the teacher preview saves nothing and shows the solution");
const pv = await call({ action: "gameStart", slot: "a102" }, "admin"); ok(pv.ok && pv.preview && pv.question.sol, "PIN preview works and includes the solution");
const pv2 = await call({ action: "gameStart", slot: "a102" }, TEACH); ok(pv2.ok && pv2.preview, "the signed-in teacher can play any game");
for (let i = 0; i < 10; i++) { const run = JSON.parse(mem.get("grun:" + pv.runId)); const x = makeQuestion(run.game, run.seed, i); const r = await call({ action: "gameAnswer", runId: pv.runId, n: i, answer: right(i, x) }, "admin"); if (r.done) ok(r.final && r.final.saved === false && r.final.pct === 100, "a perfect preview run reports 100 but saved: false"); }
ok(!mem.has("sub:a102:" + encodeURIComponent("preview")), "no submission record was made for the preview");

console.log("\n9. the hidden mission stays hidden from students until opened");
await call({ action: "adminSetLive", slot: "a102", live: false }, "admin"); const hid = await call({ action: "gameStart", slot: "a102" }, ADA); ok(hid.error && /not open/i.test(hid.error), "live: false closes the game for students");

console.log(bad ? `\n${bad} PROBLEMS` : "\nall game rules hold");
process.exit(bad ? 1 : 0);
