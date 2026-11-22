/* Starts the local dev server with the adventure games published (live), for trying them in a browser.
   usage: node tools/missions/advserve.mjs [port]   then open  http://localhost:PORT/python/games/play.html?slot=a122&teacher   (PIN 1234) */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { start } = await import("./devserver.mjs");
const core = require("./index.js");
const PORT = Number(process.argv[2]) || 8140; await start(PORT);
for (const r of core.RECORDS.filter((x) => x.rec.game)) {
  const rec = r.rec;
  const res = await fetch("http://localhost:" + PORT + "/api/pycode", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ pin: "1234", action: "adminSetAssignment", slot: r.slot, title: rec.title, unit: rec.unit, num: rec.num, points: rec.points, blocks: rec.blocks, checks: rec.checks, tips: rec.tips, autoRun: [], game: rec.game, live: true }) });
  await res.json();
}
console.log("adventures ready on http://localhost:" + PORT + "/python/games/play.html?slot=a122&teacher");
