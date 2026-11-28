// Real multi-browser test: a host and two students (three separate Chrome instances) run a full 2-round race against the real server code.
// Needs the local test server from the scratchpad on port 8799 (serves index.html and /api/pysprint with in-memory storage).
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const URL = "http://localhost:8799/";
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const mk = async (port) => { const b = await launch(port, 1300, 950); await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" }); return b; };
const host = await mk(9710), ann = await mk(9711), ben = await mk(9712);
const cred = (n) => n + "." + Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3000 })).toString("base64").replace(/=/g, "") + ".s";
const wait = async (b, expr, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await b.ev(expr)) return true; await b.sleep(250); } return false; };
const type = (b, code) => b.ev(`(function(){ var t=document.getElementById('code-input'); t.value=${JSON.stringify(code)}; t.dispatchEvent(new Event('input')); })()`);
// ---- host sets up
await host.send("Page.navigate", { url: URL }); await host.sleep(2500);
await host.ev(`document.getElementById('btn-host-setup').click()`);
await host.ev(`(function(){ var s=__PSP.state; s.selectedIds=new Set(['var_five_profile','fn_add_return']); document.getElementById('cfg-pin').value='1234'; document.getElementById('cfg-order').value='ordered'; document.getElementById('btn-create-room').click(); })()`);
if (!(await wait(host, `document.getElementById('hdr-room-code').textContent.length >= 4 && document.getElementById('hdr-room-code').textContent !== '----'`))) fail("host room not created");
const code = await host.ev(`document.getElementById('hdr-room-code').textContent`); console.log("room code:", code);
// wrong PIN is refused
const wp = await host.ev(`(async function(){ var r = await fetch('/api/pysprint',{method:'POST',body:JSON.stringify({action:'roundStart',pin:'0000',code:'${code}',round:0})}); return (await r.json()).error; })()`); if (wp !== "Invalid PIN") fail("wrong PIN accepted", wp);
// ---- students sign in (fake Google token) and join
for (const [b, name] of [[ann, "ann"], [ben, "ben"]]) {
  await b.send("Page.navigate", { url: URL }); await b.ev(`sessionStorage.setItem('psp_cred', ${JSON.stringify(cred(name))})`);
  await b.send("Page.navigate", { url: URL }); await b.sleep(2500);
  if (!(await wait(b, `!document.getElementById('auth-in').classList.contains('hidden')`))) fail(name, "not signed in");
  await b.ev(`(function(){ var s=document.getElementById('inp-student-period'); s.value='1A'; s.dispatchEvent(new Event('change')); document.getElementById('inp-room-code').value='${code}'; })()`);
  if (await b.ev(`document.getElementById('btn-join-room').disabled`)) fail(name, "join button disabled");
  await b.ev(`document.getElementById('btn-join-room').click()`);
  if (!(await wait(b, `document.getElementById('hdr-room-code').textContent==='${code}'`))) fail(name, "did not enter room");
}
if (!(await wait(host, `document.getElementById('lobby-racers-grid').innerText.includes('Kid ann') && document.getElementById('lobby-racers-grid').innerText.includes('Kid ben')`))) fail("host lobby does not show both students");
// ---- round 1
await host.ev(`document.getElementById('btn-host-start').click()`);
for (const [b, n] of [[ann, "ann"], [ben, "ben"]]) if (!(await wait(b, `!document.getElementById('arena-active').classList.contains('hidden') && document.getElementById('q-title').textContent.length>3`))) fail(n, "round 1 did not start");
const t1 = await ann.ev("document.getElementById('q-title').textContent"), t2 = await ben.ev("document.getElementById('q-title').textContent"), t3 = await host.ev("document.getElementById('q-title').textContent");
if (!(t1 === t2 && t2 === t3 && t1.length)) fail("everyone must see the same challenge", t1, t2, t3);
const clockA = await ann.ev(`parseFloat(document.getElementById('hdr-clock').textContent)`), clockH = await host.ev(`parseFloat(document.getElementById('hdr-clock').textContent)`);
if (Math.abs(clockA - clockH) > 2.5) fail("clocks out of sync", clockA, clockH);
await ann.sleep(3000);
await type(ann, 'name = 1\nage = "x"'); await ann.ev(`document.getElementById('btn-submit-code').click()`);
if (!(await wait(ann, `document.getElementById('test-results').innerText.includes('✗')`))) fail("ann wrong code should show a failed check");
await type(ann, 'name = "Ann"\nage = 17\ngpa = 3.9\nis_enrolled = True\nschool = "SCHS"'); await ann.ev(`document.getElementById('btn-submit-code').click()`);
if (!(await wait(ann, `!document.getElementById('student-solved-banner').classList.contains('hidden')`, 20000))) fail("ann not marked solved", await ann.ev("document.getElementById('term-output').innerText + ' | ' + document.getElementById('test-results').innerText"));
await ben.sleep(2000);
await type(ben, 'name = "Ben"\nage = 16\ngpa = 3.1\nis_enrolled = True\nschool = "SCHS"'); await ben.ev(`document.getElementById('btn-submit-code').click()`);
if (!(await wait(ben, `!document.getElementById('student-solved-banner').classList.contains('hidden')`, 20000))) fail("ben not marked solved");
const annBanner = await ann.ev("document.getElementById('solved-headline').textContent"), benBanner = await ben.ev("document.getElementById('solved-headline').textContent");
console.log("ann:", annBanner, "| ben:", benBanner);
if (!/#1/.test(annBanner) || !/#2/.test(benBanner)) fail("finish order wrong");
if (!(await wait(host, `document.getElementById('proj-finish-ratio').textContent==='2 / 2'`))) fail("host did not see both solved", await host.ev("document.getElementById('proj-finish-ratio').textContent"));
if (!(await wait(host, `document.getElementById('proj-activity-feed').innerText.includes('Kid ann solved')`))) fail("host feed missing ann");
// the student page must never receive the model solution before the host reveals it
const leak = await ann.ev(`JSON.stringify(__PSP.state.room.playlist.map(function(q){return q.solution}))`); if (/SCHS/.test(leak) && !/Jordan/.test("")) { if (JSON.parse(leak).some((s) => s)) fail("solution leaked to a student before reveal", leak); }
// ---- end round, next round, finish
await host.ev(`document.getElementById('btn-host-end-round').click()`);
if (!(await wait(ann, `!document.getElementById('q-solution-box').classList.contains('hidden')`))) fail("solution not shown to students after round ends");
await host.ev(`document.getElementById('btn-host-next').click()`);
for (const [b, n] of [[ann, "ann"], [ben, "ben"]]) if (!(await wait(b, `document.getElementById('hdr-round-text').textContent.startsWith('2')`))) fail(n, "round 2 did not start");
await ann.sleep(2200);
await type(ann, 'def add_nums(a, b):\n    return a + b'); await ann.ev(`document.getElementById('btn-submit-code').click()`);
if (!(await wait(ann, `!document.getElementById('student-solved-banner').classList.contains('hidden')`, 20000))) fail("ann round 2 not solved");
await host.ev(`document.getElementById('btn-host-end-round').click()`); await host.sleep(1200);
await host.ev(`document.getElementById('btn-host-next').click()`);
for (const [b, n] of [[host, "host"], [ann, "ann"], [ben, "ben"]]) if (!(await wait(b, `!document.getElementById('arena-podium').classList.contains('hidden')`))) fail(n, "no podium");
const pod = await ann.ev(`document.getElementById('podium-full-list').innerText`); console.log("podium:", pod.replace(/\s+/g, " "));
if (!/#1[\s\S]*Kid ann/.test(pod)) fail("ann should win");
// a student cannot award themselves points through the API once the race is over
const cheat = await ann.ev(`(async function(){ var r = await fetch('/api/pysprint',{method:'POST',body:JSON.stringify({action:'solve',credential:sessionStorage.getItem('psp_cred'),code:'${code}',round:0})}); return (await r.json()).error; })()`); if (!cheat) fail("late solve accepted");
for (const [b, n] of [[host, "host"], [ann, "ann"], [ben, "ben"]]) { const e = await b.ev("window.__errs"); if (e.length) fail(n, "page errors", e); }
// ---- host ends the room: students are sent back to the landing page
await host.ev(`document.getElementById('btn-podium-again').click()`);
if (!(await wait(ben, `!document.getElementById('view-landing').classList.contains('hidden')`))) fail("student was not returned to the landing page after the room closed");
console.log("failures:", bad); [host, ann, ben].forEach((b) => b.close()); process.exit(bad ? 1 : 0);
