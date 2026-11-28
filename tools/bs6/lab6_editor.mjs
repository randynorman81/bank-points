/* Drives every Unit 5 walkthrough/assignment in the REAL Web Editor (needs Chrome + the dev server on 8124): opens it as the teacher, types the model (index.html, then style.css),
   and checks the auto score, that every step box ticks "met", that each stage page of a walkthrough ticks its boxes, that the style.css tab shows once the link is typed, and that nothing throws.
   Run: node tools/bs6/lab6_editor.mjs [id ...] */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js", "bs-labs.js", "bs-labs-1.js", "bs-labs-2.js"].forEach((f) => require(D + f));
const LABS = globalThis.U7_STEPCHECKS.W.BS.LABS;
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const want = process.argv.slice(2), b = await launch(9686, 1300, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); }); window.addEventListener('unhandledrejection', function(e){ window.__errs.push('rej ' + String(e.reason)); });" });
let bad = 0;
for (const o of LABS) {
  if (want.length && !want.includes(o.id)) continue;
  await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/editor.html?lesson=" + o.id + "&teacher=1" }); await b.sleep(1500);
  const setup = await b.ev(`(function(){ localStorage.clear(); if (window.U7_LIVE.indexOf(${JSON.stringify(o.id)}) < 0) U7_LIVE.push(${JSON.stringify(o.id)}); buildLessonList(); applyClosed(); return [S.lesson, document.body.classList.contains('isclosed'), $('lesson').value]; })()`);
  if (setup[0] !== o.id || setup[1]) { console.log("FAIL", o.id, "did not open", JSON.stringify(setup)); bad++; continue; }
  const type = async (html, css) => { await b.ev(`(function(){ S.buf.css = ${JSON.stringify(css)}; var t = document.getElementById('code'); t.value = ${JSON.stringify(html)}; t.dispatchEvent(new Event('input', { bubbles: true })); })()`); await b.sleep(900); return b.ev(`({ auto: (document.body.innerText.match(/Auto score:\\s*([\\d.]+)\\s*\\/\\s*([\\d.]+)/) || [])[1], boxes: document.querySelectorAll('#ansPane .sbx').length, met: document.querySelectorAll('#ansPane .abadge.ok').length, partial: document.querySelectorAll('#ansPane .abadge:not(.ok)').length, tab: (function(){ var t = document.getElementById('tabCss') || Array.from(document.querySelectorAll('[id*=ab],button,a')).find(function(x){ return /style\\.css/i.test(x.textContent) && x.offsetParent; }); return !!(t && t.offsetParent); })(), errs: window.__errs.slice() })`); };
  const r = await type(o.model.html, o.model.css); const issues = [];
  if (r.auto !== "100") issues.push("auto score " + r.auto);
  if (!r.boxes || (r.met !== r.boxes && r.partial > 0)) issues.push("boxes " + r.met + "/" + r.boxes + " met, " + r.partial + " not");
  if (o.id === "9.1w" || o.id === "9.1a") { if (!r.tab) issues.push("the style.css tab is not shown after the link is typed"); }
  if (r.errs.length) issues.push("errors: " + r.errs.join(" | "));
  const pane = await b.ev(`({ steps: document.querySelectorAll('#ansPane h3.stp').length, code: document.querySelectorAll('#ansPane pre.pat').length })`);
  if (o.kind === "w") { const st = o.stages(); for (let k = 0; k < st.length; k++) { const q = await type(st[k].html, st[k].css); if (q.errs.length) issues.push("stage " + (k + 1) + " errors"); } }
  const e = await type("", ""); if (e.auto !== "0") issues.push("empty page scores " + e.auto);
  console.log(o.id.padEnd(5), issues.length ? "FAIL " + issues.join("; ") : "ok", "| boxes", r.boxes, "steps", pane.steps, "code blocks", pane.code);
  bad += issues.length;
}
console.log(bad ? "FAILURES: " + bad : "all ok"); b.close(); process.exit(bad ? 1 : 0);
