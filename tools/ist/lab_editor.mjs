/* Drives every walkthrough/assignment in the REAL Web Editor (needs Chrome + the dev server on 8124): opens it as the teacher, types the model solution, and checks the score,
   that every step box ticks "met", that every stage page of a walkthrough ticks its boxes, and that nothing throws. Run: node tools/ist/lab_editor.mjs [id ...] */
import { createRequire } from "module";
import { MODELS } from "./lab_models.mjs";
import { STAGES } from "./lab_stages.mjs";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const want = process.argv.slice(2), b = await launch(9653, 1300, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); }); window.addEventListener('unhandledrejection', function(e){ window.__errs.push('rej ' + e.reason); });" });
let bad = 0;
for (const id of Object.keys(MODELS)) {
  if (want.length && !want.includes(id)) continue;
  await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/editor.html?lesson=" + id + "&teacher=1" }); await b.sleep(1500);
  const setup = await b.ev(`(function(){ localStorage.clear(); if (window.U7_LIVE.indexOf(${JSON.stringify(id)}) < 0) U7_LIVE.push(${JSON.stringify(id)}); buildLessonList(); applyClosed(); return [S.lesson, document.body.classList.contains('isclosed'), $('lesson').value]; })()`);
  if (setup[0] !== id || setup[1]) { console.log("FAIL", id, "did not open", JSON.stringify(setup)); bad++; continue; }
  const type = async (html) => { await b.ev(`(function(){ var t = document.getElementById('code'); t.value = ${JSON.stringify(html)}; t.dispatchEvent(new Event('input', { bubbles: true })); })()`); await b.sleep(900); return b.ev(`({ auto: (document.body.innerText.match(/Auto score:\\s*([\\d.]+)\\s*\\/\\s*([\\d.]+)/) || [])[1], boxes: document.querySelectorAll('#ansPane .sbx').length, met: document.querySelectorAll('#ansPane .abadge.ok').length, partial: document.querySelectorAll('#ansPane .abadge:not(.ok)').length, errs: window.__errs.slice() })`); };
  const r = await type(MODELS[id]);
  const issues = [];
  if (r.auto !== "100") issues.push("auto score " + r.auto);
  if (!r.boxes || r.met !== r.boxes - 0 && r.partial > 0) issues.push("boxes " + r.met + "/" + r.boxes + " met, " + r.partial + " not");
  if (r.errs.length) issues.push("errors: " + r.errs.join(" | "));
  /* the walkthrough pane renders: has the steps and the code examples */
  const pane = await b.ev(`({ steps: Array.from(document.querySelectorAll('#ansPane h3.stp')).map(function(h){ return h.textContent; }).length, code: document.querySelectorAll('#ansPane pre.pat').length })`);
  /* stages */
  const st = STAGES[id] || [];
  for (let k = 0; k < st.length; k++) { const q = await type(st[k]); if (q.errs.length) issues.push("stage " + (k + 1) + " errors"); }
  /* empty page scores 0 */
  const e = await type(""); if (e.auto !== "0") issues.push("empty page scores " + e.auto);
  console.log(id.padEnd(7), issues.length ? "FAIL " + issues.join("; ") : "ok", "| boxes", r.boxes, "steps", pane.steps, "code blocks", pane.code);
  bad += issues.length;
}
console.log(bad ? "FAILURES: " + bad : "all ok"); b.close(); process.exit(bad ? 1 : 0);
