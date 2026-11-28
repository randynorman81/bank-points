/* Real-browser check of the Unit 6 walkthrough "Try it" claims with the REAL Bootstrap 5.3.9 stylesheet (tools/bs6/bootstrap-5.3.9.min.css), at the window width each claim names (phone or laptop). node tools/bs6/lab6_chrome.mjs */
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js", "bs-labs.js", "bs-labs-1.js", "bs-labs-2.js"].forEach((f) => require(D + f));
const LABS = globalThis.U7_STEPCHECKS.W.BS.LABS;
const BS = fs.readFileSync("/Users/randynorman/bank-points/tools/bs6/bootstrap-5.3.9.min.css", "utf8");
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9684, 1200, 800);
await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/index.html" }); await b.sleep(900);
await b.ev(`window.__run = async function(html, expr, w){ var old = document.getElementById('f'); if (old) old.remove(); var f = document.createElement('iframe'); f.id = 'f'; f.style.cssText = 'width:' + (w || 1000) + 'px;height:700px;border:0'; document.body.appendChild(f);
  await new Promise(function(r){ f.onload = r; f.srcdoc = html; }); var imgs = Array.prototype.slice.call(f.contentDocument.images); await Promise.all(imgs.map(function(i){ return i.complete ? 1 : new Promise(function(r){ i.onload = i.onerror = r; }); })); await new Promise(function(r){ setTimeout(r, 120); });
  var d = f.contentDocument, W = f.contentWindow, cs = function(e){ return W.getComputedStyle(e); }, q = function(s){ return d.querySelector(s); }, qa = function(s){ return Array.prototype.slice.call(d.querySelectorAll(s)); };
  return eval(expr); }`);
const page = (s) => { let html = s.html; const hasBS = /<link href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.9\/dist\/css\/bootstrap\.min\.css" rel="stylesheet">/.test(html);
  html = html.replace(/<link href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.9\/dist\/css\/bootstrap\.min\.css" rel="stylesheet">/, () => "<style>" + BS + "</style>");
  html = html.replace(/<link rel="stylesheet" href="style\.css">/, () => "<style>" + (s.css || "") + "</style>");
  return html.split("https://schscomputerscience.com/ist/unit-6/lab/").join("http://localhost:8124/ist/unit-6/lab/"); };
let n = 0, bad = 0;
const match = (a, e) => Array.isArray(e) ? Array.isArray(a) && a.length === e.length && e.every((x, i) => match(a[i], x)) : e === null ? true : a === e;
for (const o of LABS) {
  if (!o.claims) continue; const stages = o.kind === "w" ? o.stages() : [];
  for (const c of o.claims) {
    n++; let s = c.stage === "model" ? o.model : stages[c.stage - 1]; if (c.edit) s = c.edit(s);
    const got = await b.ev(`window.__run(${JSON.stringify(page(s))}, ${JSON.stringify(c.expr)}, ${c.w || 1000})`);
    if (!match(got, c.expect)) { bad++; console.log("FAIL", c.label, "\n   expected", JSON.stringify(c.expect), "\n   got     ", JSON.stringify(got)); }
  }
}
console.log("claims checked:", n, "| failures:", bad); b.close(); process.exit(bad ? 1 : 0);
