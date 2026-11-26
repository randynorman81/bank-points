// Plays every quiz game like a student in real Chrome (needs the dev server on 8124): all right = 100, three wrong = game over, no errors, the browser preview appears for code questions.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9655, 1100, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0, rounds = 0, previews = 0;
for (let l = 1; l <= 15; l++) {
  await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/game.html?l=" + l }); await b.sleep(900);
  for (let r = 0; r < 10; r++) {
    const st = await b.ev(`(function(){ var o=document.querySelectorAll('.opt'); if(!o.length) return null; o[cur.a].click(); return [document.querySelectorAll('.opt.ok').length, document.querySelectorAll('.opt.no').length, document.getElementById('shows').className.indexOf('show')>-1, !!cur.c]; })()`);
    if (!st) { console.log("FAIL lesson", l, "round", r, "no options"); bad++; break; }
    rounds++; if (st[0] !== 1 || st[1] !== 0) { console.log("FAIL lesson", l, "round", r, JSON.stringify(st)); bad++; }
    if (st[3]) { if (!st[2]) { console.log("FAIL no preview", l, r); bad++; } else previews++; }
    await b.ev(`document.getElementById('nx').click()`); await b.sleep(40);
  }
  const end = await b.ev(`document.body.innerText.match(/(\\d+) \\/ 100/)`); if (!end || end[1] !== "100") { console.log("FAIL lesson", l, "score", end && end[0]); bad++; }
  await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/game.html?l=" + l }); await b.sleep(700);
  let n = 0; while (n < 6) { const done = await b.ev(`(function(){ var o=document.querySelectorAll('.opt'); if(!o.length) return true; o[(cur.a+1)%4].click(); document.getElementById('nx').click(); return false; })()`); if (done) break; n++; }
  const over = await b.ev(`document.body.innerText.indexOf('game over')>-1`); if (!over || n !== 3) { console.log("FAIL lesson", l, "three wrong should end the game", n, over); bad++; }
  const errs = await b.ev(`window.__errs`); if (errs.length) { console.log("FAIL errors", l, errs); bad++; }
}
console.log("rounds played:", rounds, "previews:", previews, "failures:", bad); b.close(); process.exit(bad ? 1 : 0);
