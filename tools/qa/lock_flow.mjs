/* LOCK AND UNLOCK TEST with the REAL teacher settings (teacher-settings/python-editor.js) and the real server code, fake Google sign-in.
   Phase 1 (the settings as committed): Unit 3 is closed - a student sees no Unit 3 item open, cannot submit, cannot play a game (not even as a guest); Units 4 and up stay open.
   Phase 2 (the settings changed in memory to "unlocked, chain on", exactly the edit you would make): walkthrough 1 opens first, then each assignment opens only after its walkthrough is passed, in order.
   usage: node tools/qa/lock_flow.mjs */
import fs from "fs"; import path from "path"; import { fileURLToPath, pathToFileURL } from "url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
let src = fs.readFileSync(path.join(ROOT, "netlify/functions/pycode.js"), "utf8");
src = src.replace(/^import \{ getStore \} from "@netlify\/blobs";\n/m, "const getStore = () => globalThis.__STORE;\n")
  .replace('from "./gamebank.js"', 'from "' + pathToFileURL(path.join(ROOT, "netlify/functions/gamebank.js")).href + '"')
  .replace(/async function verifyGoogleToken\(credential\) \{/, 'async function verifyGoogleToken(credential) { if (typeof credential === "string" && credential.startsWith("test:")) { const email = credential.slice(5).toLowerCase(); return { email, name: email.split("@")[0] }; }\n  return verifyGoogleTokenReal(credential); }\nasync function verifyGoogleTokenReal(credential) {')
  .replace('const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");', 'const isAdmin = (body) => body && body.pin === "1234";');
const mem = new Map();
globalThis.__STORE = { async get(k) { return mem.has(k) ? JSON.parse(mem.get(k)) : null; }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); return { modified: true }; }, async getMetadata(k) { return mem.has(k) ? {} : null; }, async delete(k) { mem.delete(k); }, async list(o) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(o.prefix || "")).map((key) => ({ key })) }; } };
const tmp = path.join(ROOT, "netlify/functions/.pycode-lock.mjs"); fs.writeFileSync(tmp, src);
const handler = (await import(pathToFileURL(tmp).href)).default;
const settings = await import(pathToFileURL(path.join(ROOT, "teacher-settings/python-editor.js")).href);
const call = async (b) => JSON.parse(await (await handler(new Request("http://localhost/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(b) }))).text());
const V = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(ROOT, "tools/missions/testkit/verify.json"), "utf8")).map((v) => [v.slot, v]));
let fails = 0; const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };
// stand-in Unit 3 walkthroughs a1-a13 (the real ones' checks are private); the assignments and games come from the repo
const blocks = [{ h: "Step 1: x" }, { make: ["type it"] }], chk = [{ label: "x = 1", re: "^\\s*x\\s*=\\s*1", flags: "m", min: 1, pts: 1, box: 0 }];
for (let n = 1; n <= 13; n++) await call({ pin: "1234", action: "adminSetAssignment", slot: "a" + n, title: "Stand-in walkthrough " + n, unit: "Unit 3: Programming with Python", num: n, points: 50, blocks, checks: chk, tips: {}, autoRun: [], live: true });
const U3 = []; for (let n = 1; n <= 13; n++) U3.push("a" + n, "a" + (125 + n), "a" + (159 + n));
const ada = "test:ada@socialcircleschools.org";
const PASS_CODE = "x = 1\n# Step 1: a\n# Step 3: a\n# Step 4: a\n# Step 5: a\n# Step 6: a\n# Step 7: a";   /* satisfies the stand-in check and the six step-comment checks the real 3.1 has */
const listOf = async (who) => call({ action: "assignments", credential: who, period: "1A" });
// ---------- Phase 1: closed ----------
let l = await listOf(ada); let open3 = U3.filter((s) => l.assignments[s]);
ok(open3.length === 0, "CLOSED: a student can open none of the 39 Unit 3 items (open: " + open3.join(",") + ")");
const lockedIds = (l.locked || []).map((x) => x.id); ok(U3.every((s) => lockedIds.includes(s)), "CLOSED: all 39 Unit 3 items are listed as locked (so the picker shows them with a lock): " + U3.filter((s) => !lockedIds.includes(s)).join(","));
ok(!!l.assignments["a101"] && !!l.assignments["a173"], "other units are untouched and still open (a101 Unit 10, a173 Unit 4 game)");
const sub = await call({ action: "submit", credential: ada, slot: "a1", code: "x = 1", output: "", mode: "python", period: "1A" });
ok(!sub.ok, "CLOSED: submitting walkthrough 1 is refused (" + JSON.stringify(sub).slice(0, 80) + ")");
const sub2 = await call({ action: "submit", credential: ada, slot: "a126", code: V.a126.code, output: V.a126.output, mode: "python", period: "1A" });
ok(!sub2.ok, "CLOSED: submitting assignment 3.1 is refused (" + JSON.stringify(sub2).slice(0, 80) + ")");
const g1 = await call({ action: "gameStart", credential: ada, slot: "a160", period: "1A" }); ok(!g1.ok && !g1.q, "CLOSED: a signed-in student cannot start the 3.1 game (" + JSON.stringify(g1).slice(0, 80) + ")");
const g2 = await call({ action: "gameStart", guest: true, slot: "a160" }); ok(!g2.ok && !g2.q, "CLOSED: a guest cannot play the 3.1 game either (" + JSON.stringify(g2).slice(0, 80) + ")");
const g3 = await call({ action: "gameStart", guest: true, slot: "a173" }); console.log("     (for comparison, a Unit 4 game as a guest: " + (g3.ok || g3.q ? "plays, as before" : JSON.stringify(g3).slice(0, 60)) + ")");
const sc = await call({ action: "score", slot: "a126", code: V.a126.code, output: V.a126.output }); console.log("     (live scoring of a locked slot as an anonymous visitor: pct=" + sc.pct + ")");
// ---------- Phase 2: unlocked with the chain ----------
for (const s of U3) settings.PY_SETTINGS[s] = Object.assign({}, settings.PY_SETTINGS[s], { hold: false });   // the one edit that unlocks the unit
l = await listOf(ada); const vis = () => U3.filter((s) => l.assignments[s]);
ok(vis().join(",") === "a1", "UNLOCKED: a new student sees ONLY walkthrough 1 (open: " + vis().join(",") + ")");
for (let n = 1; n <= 13; n++) {
  const w = "a" + n, p = "a" + (125 + n), g = "a" + (159 + n), nxt = "a" + (n + 1);
  const r = await call({ action: "submit", credential: ada, slot: w, code: "y = 9", output: "", mode: "python", period: "1A" }); l = await listOf(ada);
  ok(!l.assignments[p], "UNLOCKED: a failing walkthrough " + n + " does NOT open assignment " + p);
  const r2 = await call({ action: "submit", credential: ada, slot: w, code: PASS_CODE, output: "", mode: "python", period: "1A" }); l = await listOf(ada);
  ok(r2.ok && !!l.assignments[p], "UNLOCKED: passing walkthrough " + n + " opens assignment " + p + (l.assignments[g] ? " (and its game " + g + ")" : ""));
  const r3 = await call({ action: "submit", credential: ada, slot: p, code: V[p].code, output: V[p].output, gradeOutput: V[p].output, mode: "python", period: "1A" }); l = await listOf(ada);
  ok(r3.ok && (n === 13 || !!l.assignments[nxt]), "UNLOCKED: assignment " + p + " submitted" + (n === 13 ? "" : ", walkthrough " + (n + 1) + " opens"));
}
console.log("FAILURES:", fails); fs.unlinkSync(tmp); process.exit(fails ? 1 : 0);
