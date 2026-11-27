/* Opens every OLDER Unit 3/4 assignment (6.2-6.5, 7.1-7.5) in the real Web Editor as the teacher and checks that the assignment text, check list and concepts render with no errors,
   and that the wording that used to jump ahead of the lessons is gone. Needs Chrome + the dev server on 8124.  Run: node tools/ist/lab_legacy.mjs */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9654, 1300, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); }); window.addEventListener('unhandledrejection', function(e){ window.__errs.push('rej ' + String(e.reason)); });" });
const IDS = ["6.2", "6.20", "6.3", "6.35", "6.4", "6.7", "6.75", "6.6", "6.5", "7.1", "7.2", "7.3", "7.4", "7.5"];
const BAN = { "6.2": /span tag|hex|\bb tag/i, "6.20": /span|hex|\bb tag/i, "6.7": /inside an a tag|every image is a link/i, "7.1": /border-radius|display\*?\*? block/i, "7.2": /padding|margin|border-radius/i, "7.5": /inline-block|vertical-align|padding|margin|border-radius/i };
let bad = 0;
for (const id of IDS) {
  await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/editor.html?lesson=" + id + "&teacher=1" }); await b.sleep(1600);
  const r = await b.ev(`(function(){ localStorage.clear(); try { if (window.U7_LIVE.indexOf(${JSON.stringify(id)}) < 0) U7_LIVE.push(${JSON.stringify(id)}); buildLessonList(); applyClosed(); } catch (e) {}
    var pane = document.getElementById('ansPane'); return { lesson: S.lesson, closed: document.body.classList.contains('isclosed'), text: pane ? pane.innerText : '', errs: window.__errs.slice() }; })()`);
  const issues = [];
  if (r.lesson !== id) issues.push("opened " + r.lesson);
  if (r.errs.length) issues.push("errors: " + r.errs.join(" | "));
  if (!/Skeleton/i.test(r.text) && !/doctype/i.test(r.text)) issues.push("assignment text did not render");
  if (BAN[id] && BAN[id].test(r.text)) issues.push("still says: " + (r.text.match(BAN[id]) || [])[0]);
  console.log(id.padEnd(6), issues.length ? "FAIL " + issues.join("; ") : "ok", "| text", r.text.length);
  bad += issues.length;
}
console.log(bad ? "FAILURES: " + bad : "all ok"); b.close(); process.exit(bad ? 1 : 0);
