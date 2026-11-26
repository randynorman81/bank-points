// Dumps many generated Unit 4 game questions (from the real game bank) for tools/qa/game_audit_u4.py to re-check by running the code.
import fs from "fs";
import { PY_VAULTS, makeQuestion } from "../../netlify/functions/gamebank.js";
const PRE = process.argv[2] || "u4";      // usage: node tools/qa/game_dump_u4.mjs [u4|u5]
const out = []; let total = 0, nopy = 0;
for (const L of PY_VAULTS.filter((v) => new RegExp("^" + PRE + "l").test(v.id))) {
  const seen = new Set();
  for (let s = 1; s <= 120; s++) { const seed = (s * 2654435761) >>> 0;
    for (let i = 0; i < 10; i++) { let x; try { x = makeQuestion(L.id, seed, i); } catch (e) { out.push({ id: L.id, error: String(e) }); continue; }
      total++; const q = x.q, k = q.prompt + "|" + (q.code || "") + "|" + JSON.stringify(q.choices) + "|" + (x.a && x.a.idx);
      if (seen.has(k)) continue; seen.add(k);
      out.push({ id: L.id, seed, i, type: q.type, prompt: q.prompt, code: q.code || "", choices: q.choices || null, a: x.a, why: x.why, py: x.py || null }); if (!x.py) nopy++; } } }
fs.writeFileSync("/private/tmp/claude-501/game_" + PRE + ".json", JSON.stringify(out));
console.log("questions generated:", total, "| distinct kept:", out.length, "| without a py block:", nopy);
