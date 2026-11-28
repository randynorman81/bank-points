// Confirms every question answer in a REAL browser. usage: node qcheck.mjs questions.json report.json   (needs Chrome and the dev server on 8124 for the same-origin page)
// questions.json: [{id, chk:[{html, js, expect}]}]. For each check the page is loaded in an iframe and `js` is evaluated with d = the iframe document and W = its window.
// expect: a value (deep equal) or {not: value} (must differ).
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const b = await launch(9654, 1000, 800);
await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/index.html" }); await b.sleep(1000);
await b.ev(`window.__fn = function(js){ try { return new Function('d', 'W', 'return (' + js + ')'); } catch (e) { var depth = 0, q = '', last = -1; for (var i = 0; i < js.length; i++) { var ch = js[i]; if (q) { if (ch === q && js[i - 1] !== '\\\\') q = ''; continue; } if (ch === '"' || ch === "'") { q = ch; continue; } if ('({['.indexOf(ch) >= 0) depth++; else if (')}]'.indexOf(ch) >= 0) depth--; else if (ch === ';' && depth === 0) last = i; } return new Function('d', 'W', js.slice(0, last + 1) + ' return (' + js.slice(last + 1) + ')'); } };
window.__run = async function(list){ var f = document.getElementById('qf'); if (!f) { f = document.createElement('iframe'); f.id = 'qf'; f.style.cssText = 'width:800px;height:600px;border:0'; document.body.appendChild(f); }
  var out = [];
  for (var i = 0; i < list.length; i++) { var c = list[i];
    try { f.style.width = (c.w || 800) + 'px'; var url = URL.createObjectURL(new Blob([c.html], { type: 'text/html' })); await new Promise(function(r){ f.onload = r; f.src = url; }); var d = f.contentDocument, W = f.contentWindow; URL.revokeObjectURL(url);
      var v = window.__fn(c.js)(d, W); out.push(JSON.parse(JSON.stringify(v === undefined ? null : v))); }
    catch (e) { out.push({ __err: String(e) }); } }
  return out; }`);
const eq = (a, b) => { if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 0.6; return JSON.stringify(a) === JSON.stringify(b); };
const deq = (a, b) => { if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => deq(x, b[i])); return eq(a, b); };
const bad = []; let n = 0; const flat = [];
for (const q of input) for (const c of q.chk || []) flat.push({ id: q.id, ...c });
for (let i = 0; i < flat.length; i += 40) {
  const batch = flat.slice(i, i + 40), res = await b.ev(`window.__run(${JSON.stringify(batch.map((c) => ({ html: c.html, js: c.js, w: c.w })))})`);
  batch.forEach((c, k) => { n++; const got = res[k]; const ok = c.expect && typeof c.expect === "object" && !Array.isArray(c.expect) && "not" in c.expect ? !deq(got, c.expect.not) : deq(got, c.expect); if (!ok) bad.push({ id: c.id, js: c.js, expect: c.expect, got, html: c.html.slice(0, 400) }); });
}
fs.writeFileSync(process.argv[3], JSON.stringify(bad, null, 1)); b.close();
console.log("checks:", n, "from", input.length, "questions | failures:", bad.length);
process.exit(0);
