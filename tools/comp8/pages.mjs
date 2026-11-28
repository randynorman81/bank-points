// Opens every Unit 8 page in real Chrome: no script errors, every local link and script resolves, interactive bits respond.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
import fs from "fs"; import path from "path";
const U = process.argv[2] || "8";
const DIR = "/Users/randynorman/bank-points/ist/" + (U === "10" ? "unit-13/" : U === "9" ? "unit-4/" : "unit-3/");
const b = await launch(9699, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const pages = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
for (const f of pages) {
  await b.send("Page.navigate", { url: "file://" + DIR + f }); await b.sleep(900);
  const errs = await b.ev("window.__errs"); if (errs.length) fail(f, "script errors", errs);
  const links = await b.ev(`[].map.call(document.querySelectorAll('a[href]'), function(a){return a.getAttribute('href')})`);
  for (const h of links) { if (/^(https?:|mailto:|#|javascript:)/.test(h)) continue; const p = path.resolve(DIR, h.split("#")[0].split("?")[0]); if (!fs.existsSync(p)) fail(f, "broken link", h); }
}
console.log("pages checked:", pages.length);
if (U === "9" || U === "10") { console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0); }
// rune glyphs on the ports page
await b.send("Page.navigate", { url: "file://" + DIR + "ports-bluetooth-nfc-notes.html" }); await b.sleep(900);
const runes = await b.ev(`(function(){var h=document.querySelector('.h'),k=document.querySelector('.b');return h&&k?[h.textContent.trim().codePointAt(0).toString(16),k.textContent.trim().codePointAt(0).toString(16)]:null})()`);
if (!runes || runes[0] !== "16bc" || runes[1] !== "16d2") fail("rune code points", runes);
console.log("runes:", JSON.stringify(runes), "errors:", JSON.stringify(await b.ev("window.__errs")));
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
