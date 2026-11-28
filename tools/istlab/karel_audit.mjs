// Runs every Karel code example on the Unit 2 notes pages through the engine, to catch syntax errors and crashes.
//   node tools/istlab/karel_audit.mjs
import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
new Function(fs.readFileSync(path.join(ROOT, "ist/karel/engine.js"), "utf8")).call(globalThis); const K = globalThis.KarelEngine;
const unesc = (s) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const W = (o = {}) => Object.assign({ cols: 10, rows: 10, x: 1, y: 4, dir: "E", balls: [[2, 4, 1], [4, 4, 1]], walls: [] }, o);
const files = [...fs.readdirSync(path.join(ROOT, "ist/karel")).filter((f) => f.endsWith(".html")).map((f) => "ist/karel/" + f), ...fs.readdirSync(path.join(ROOT, "ist/unit-2")).filter((f) => f.endsWith(".html")).map((f) => "ist/unit-2/" + f)];
let n = 0, bad = 0;
for (const f of files) {
  const s = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of s.matchAll(/<div class="code[^"]*">([\s\S]*?)<\/div>|<pre[^>]*>([\s\S]*?)<\/pre>/g)) {
    const code = unesc(m[1] || m[2] || "").trim(); if (!code) continue; n++;
    const looksKarel = /\b(move|turnLeft|putBall|takeBall|putBeeper|pickBeeper|main)\s*\(/.test(code); if (!looksKarel) continue;
    const hasMain = /function\s+main/.test(code), isPartial = /\.\.\.|\/\/ ?\(/.test(code);
    const res = K.run(code, W(), { superKarel: true, allowLoose: !hasMain, maxSteps: 20000 });
    if (res.error && !/ran into a wall|no ball here|too long|too many/.test(res.error.message) || /putBeeper|pickBeeper|range\(|\bdef\b|\bprint\b/.test(code)) { bad++; console.log("CHECK", f, "|", (res.error ? res.error.message : "uses a non-Karel name"), "|", code.split("\n").slice(0, 4).join(" / ").slice(0, 120)); }
  }
}
console.log("code blocks:", n, "flagged:", bad);
