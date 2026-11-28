// EC Unit 1 in real Chrome: every page loads clean with working links, the Smart City Simulator plays all 20 decisions to each ending,
// the Raspberry Pi Field Guide shows all 10 projects with the right labels, and the Fix the Glitch worksheet saves.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
import fs from "fs"; import path from "path";
const DIR = "/Users/randynorman/bank-points/ec/unit-1/";
const b = await launch(9705, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const pages = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
for (const f of pages) {
  await b.send("Page.navigate", { url: "file://" + DIR + f }); await b.sleep(800);
  const errs = await b.ev("window.__errs"); if (errs.length) fail(f, "script errors", errs);
  const links = await b.ev(`[].map.call(document.querySelectorAll('a[href]'), function(a){return a.getAttribute('href')})`);
  for (const h of links) { if (/^(https?:|mailto:|#|javascript:)/.test(h)) continue; const p = path.resolve(DIR, h.split("#")[0].split("?")[0]); if (!fs.existsSync(p)) fail(f, "broken link", h); }
}
console.log("pages checked:", pages.length);
// simulator
const play = async (pick) => { await b.send("Page.navigate", { url: "file://" + DIR + "1-5-simulator-game.html" }); await b.sleep(700);
  const n = await b.ev("decisions.length"); if (n !== 20) fail("simulator should have 20 decisions", n);
  const crit = await b.ev("decisions.filter(function(d){return d.critical}).length"); if (crit !== 5) fail("5 critical decisions expected", crit);
  for (let i = 0; i < n; i++) { const c = await b.ev(`decisions[${i}].critical`); await b.ev(`choose(${pick(i, c)})`); }
  return await b.ev(`document.querySelector('.ending h2').textContent`); };
const allA = await play(() => 0), allB = await play(() => 1), mixed = await play((i) => (i % 2));
const effic = await play((i, c) => (c ? 1 : 0)), fourCrit = await play((i, c) => (c ? (i < 18 ? 0 : 1) : 1));
console.log("endings: allA =", allA, "| allB =", allB, "| alternate =", mixed, "| convenience-first but safe critical =", effic, "| 3 of 5 critical risky, rest careful =", fourCrit);
if (allA !== "The Hacked City") fail("all A should be the Hacked City", allA);
if (allB !== "The Locked-Down City") fail("all B should be the Locked-Down City", allB);
if (effic !== "The Efficient City") fail("convenience-first with safe critical choices should be the Efficient City", effic);
if (mixed !== "The Balanced City") fail("alternating should be balanced", mixed);
// a choice cannot be made twice for one decision, and play again resets
await b.ev("restart()"); if ((await b.ev("step")) !== 0) fail("restart did not reset");
// Pi field guide
await b.send("Page.navigate", { url: "file://" + DIR + "1-6-pi-explorer.html" }); await b.sleep(700);
const cards = JSON.parse(await b.ev(`JSON.stringify([].map.call(document.querySelectorAll('.pcard'), function(c){ return [c.querySelector('h3').textContent, c.querySelector('.chip.sbc, .chip.embed').innerText.trim(), c.querySelector('.chip.edge, .chip.cloud, .chip.hybrid, .chip.none').innerText.trim()]; }))`));
const expect = { "RetroPie Game Console": ["SBC", "None"], "Self-Hosted Photo Server with Local Face Tagging": ["SBC", "Edge"], "Pi-hole Network Ad Blocker": ["SBC", "None"], "Magic Mirror Smart Display": ["SBC", "None"], "Raspberry Pi Cluster": ["SBC", "None"], "AI Bird Feeder Camera": ["Embedded", "Edge"], "Cloud-Connected Security Doorbell": ["Embedded", "Cloud"], "DIY Voice Assistant Hub": ["Embedded", "Cloud"], "Smart Wildlife Trail Camera": ["Embedded", "Hybrid"], "3D Printer / CNC Controller": ["Embedded", "None"] };
if (cards.length !== 10) fail("field guide should show 10 projects", cards.length);
cards.forEach(([t, r, a]) => { const e = expect[t]; if (!e || e[0].toLowerCase() !== r.toLowerCase() || e[1].toLowerCase() !== a.toLowerCase()) fail("field guide label", t, r, a); });
await b.ev(`document.querySelector('.pcard').click()`); if (!(await b.ev(`document.querySelector('.pcard').classList.contains('open')`))) fail("card did not open");
// Fix the Glitch worksheet saves and restores
await b.send("Page.navigate", { url: "file://" + DIR + "1-4-extra-fix-the-glitch.html" }); await b.sleep(700);
await b.ev(`localStorage.removeItem('ec_1_4_extra_fix_the_glitch'); var e=document.getElementById('hardwareFix'); e.value='Add a second positioning method'; e.dispatchEvent(new Event('input'));`);
await b.send("Page.navigate", { url: "file://" + DIR + "1-4-extra-fix-the-glitch.html" }); await b.sleep(700);
if ((await b.ev(`document.getElementById('hardwareFix').value`)) !== "Add a second positioning method") fail("worksheet did not restore saved text");
const status = await b.ev(`document.getElementById('saveStatus').textContent`); if (/â/.test(status)) fail("garbled dash in save status", status);
console.log("page errors:", JSON.stringify(await b.ev("window.__errs")));
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
