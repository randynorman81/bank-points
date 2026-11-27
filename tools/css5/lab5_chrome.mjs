/* Real-browser check of the Unit 5 walkthrough "Try it" claims and of every model page (needs Chrome): node tools/css5/lab5_chrome.mjs
   Each claim loads the page after a step (or the model, possibly edited to show a mistake) in a real browser and compares a computed fact.
   :hover / :focus / :active are checked by swapping the pseudo-class for a class of the same weight (the CSS is rewritten the same way for every claim). */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js"].forEach((f) => require(D + f));
const LABS = globalThis.U7_STEPCHECKS.W.CSS.LABS;
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9675, 1000, 800);
await b.send("Page.navigate", { url: "about:blank" }); await b.sleep(300);
await b.ev(`window.__run = async function(html, expr){ var old = document.getElementById('f'); if (old) old.remove(); var f = document.createElement('iframe'); f.id = 'f'; f.style.cssText = 'width:800px;height:700px;border:0'; document.body.appendChild(f);
  await new Promise(function(r){ f.onload = r; f.srcdoc = html; }); await new Promise(function(r){ setTimeout(r, 150); });
  var d = f.contentDocument, W = f.contentWindow, cs = function(e){ return W.getComputedStyle(e); }, q = function(s){ return d.querySelector(s); }, qa = function(s){ return Array.prototype.slice.call(d.querySelectorAll(s)); };
  function st(cls){ return function(e, p){ var nt = d.createElement('style'); if (p.indexOf('transition') !== 0) { nt.textContent = '*{transition:none !important}'; d.head.appendChild(nt); } e.classList.add(cls); var v = cs(e)[p]; e.classList.remove(cls); nt.remove(); return v; }; }
  var hov = st('__hov'), foc = st('__foc'), act = st('__act');
  return eval(expr); }`);
const page = (o, s) => { const pseudo = (c) => c.replace(/:hover/g, ".__hov").replace(/:focus/g, ".__foc").replace(/:active/g, ".__act");
  let html = s.html; const ok = /<link rel="stylesheet" href="style\.css">/.test(html);
  html = html.replace(/<link[^>]*>/, () => (ok ? "<style>body{margin:8px;font-family:Arial,sans-serif}" + pseudo(s.css) + "</style>" : "<style>body{margin:8px;font-family:Arial,sans-serif}</style>"));
  if (!/<style>/.test(html)) html = html.replace("</head>", "<style>body{margin:8px;font-family:Arial,sans-serif}</style></head>"); return html; };
let n = 0, bad = 0;
for (const o of LABS) {
  if (!o.claims) continue;
  const stages = o.kind === "w" ? o.stages() : [];
  for (const c of o.claims) {
    n++; let s = c.stage === "model" ? o.model : stages[c.stage - 1]; if (c.edit) s = c.edit(s);
    const got = await b.ev(`window.__run(${JSON.stringify(page(o, s))}, ${JSON.stringify(c.expr)})`);
    const exp = JSON.stringify(c.expect, (k, v) => v), g = JSON.stringify(got);
    const match = (a, e) => Array.isArray(e) ? Array.isArray(a) && a.length === e.length && e.every((x, i) => match(a[i], x)) : e === null ? true : a === e;
    if (!match(got, c.expect)) { bad++; console.log("FAIL", c.label, "\n   expected", exp, "\n   got     ", g); }
  }
}
/* every model must render with no layout surprise: the page has a body and every claim above passed */
console.log("claims checked:", n, "| failures:", bad); b.close(); process.exit(bad ? 1 : 0);
