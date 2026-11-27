// IST Unit 3 practice page driven like a student: every Parsons problem (written order AND other valid orders), wrong attempts rejected, every trace step answered. usage: node chkist.mjs [lessonId ...]
import { createRequire } from "module";
const require = createRequire("/Users/randynorman/bank-points/tools/missions/test.mjs");
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9672, 1300, 1000);
const base = "http://localhost:8124/ist/unit-6/practice-3.html";
await b.send("Page.navigate", { url: base + "?hub=p" }); await b.sleep(2000);
console.log("hub p:", await b.ev(`document.querySelectorAll(".hubc").length + " lesson cards, badge: " + document.getElementById("badge").textContent`));
await b.send("Page.navigate", { url: base + "?hub=t" }); await b.sleep(1200);
console.log("hub t:", await b.ev(`document.querySelectorAll(".hubc").length + " lesson cards"`));
let bad = 0, n = 0, tb = 0, tn = 0, steps = 0;
const ids = process.argv.length > 2 ? process.argv.slice(2) : await b.ev(`Object.keys(IST8.lessons)`);
for (const id of ids) {
  const cnt = await b.ev(`IST8.lessons["${id}"].problems.length`);
  for (let p = 0; p < cnt; p++) {
    await b.send("Page.navigate", { url: `${base}?l=${id}&p=${p}` }); await b.sleep(600);
    const r = await b.ev(`(function(){
      var P = IST8.lessons["${id}"].problems[${p}], out = [];
      function place(order){ document.getElementById("rst").click(); order.forEach(function(t){ var el = Array.prototype.find.call(document.querySelectorAll("#pool .piece"), function(e){ return e.dataset.t === t && !e.dataset.d; }); if (!el) { out.push("missing piece " + t); return; } el.click(); }); }
      document.getElementById("rst").click(); Array.prototype.slice.call(document.querySelectorAll("#pool .piece")).forEach(function(e){ e.click(); }); document.getElementById("chk").click();
      if (/exactly the page/.test(document.getElementById("msg").textContent)) out.push("a wrong attempt passed");
      var idOf = {}, k = 0, texts = []; P.sol.forEach(function(t){ if (!(t in idOf)) idOf[t] = k++; if (texts.indexOf(t) < 0) texts.push(t); });
      var vs = P.valid.length > 3 ? [P.valid[0], P.valid[P.valid.length - 1]] : P.valid;
      for (var i = 0; i < vs.length && !out.length; i++) {
        var order = vs[i].split("").map(function(c){ return texts[parseInt(c, 36)]; }); place(order); document.getElementById("chk").click();
        if (!/exactly the page/.test(document.getElementById("msg").textContent)) { out.push("valid order " + vs[i] + " rejected: " + document.getElementById("msg").textContent.slice(0, 80)); break; }
        if (i < vs.length - 1) showParsons();
      }
      showParsons(); place(P.sol.slice(1)); document.getElementById("chk").click(); if (/exactly the page/.test(document.getElementById("msg").textContent)) out.push("missing line passed");
      var pv = document.querySelector("iframe.pv"); if (!pv || !pv.getAttribute("srcdoc")) out.push("no preview");
      return out.join(" | ");
    })()`);
    n++; if (r) { bad++; console.log("FAIL parsons", id, p + 1, r); }
  }
}
console.log("Parsons checked:", n, "with a fault:", bad);
for (const id of ids) {
  const cnt = await b.ev(`IST8.lessons["${id}"].traces.length`);
  for (let i = 0; i < cnt; i++) {
    await b.send("Page.navigate", { url: `${base}?tl=${id}&i=${i}` }); await b.sleep(450);
    const r = await b.ev(`(function(){
      var tr = IST8.lessons["${id}"].traces[${i}], out = [], first = document.querySelector("#tvars input");
      if (first) { first.value = "zzz"; document.getElementById("tchk").click(); if (!/Not yet/.test(document.getElementById("tmsg").textContent)) out.push("wrong answer accepted"); }
      for (var s = 0; s < tr.steps.length; s++) {
        var st = tr.steps[s], hl = document.querySelector("#tcode .cur"), ln = hl ? Number(hl.querySelector("b").textContent) - 1 : -1;
        if (ln !== st[3]) { out.push("step " + (s + 1) + " highlights line " + (ln + 1) + " not " + (st[3] + 1)); break; }
        var ins = document.querySelectorAll("#tvars input");
        ins.forEach(function(el){ var nm = el.dataset.n; el.value = nm === "__print" ? st[1].join(" | ") : nm === "__cond" ? st[6] : st[0][nm]; });
        if (ins.length) { document.getElementById("tchk").click(); if (!/Right/.test(document.getElementById("tmsg").textContent)) { out.push("step " + (s + 1) + " correct answer refused: " + document.getElementById("tmsg").textContent.slice(0, 60)); break; } }
        document.getElementById("tnx").click();
      }
      if (!/complete/.test(document.getElementById("main").textContent)) out.push("trace did not finish");
      return out.join(" | ") + " #" + tr.steps.length;
    })()`);
    tn++; steps += Number((r.match(/#(\d+)$/) || [0, 0])[1]); if (!/^ #\d+$/.test(r)) { tb++; console.log("FAIL trace", id, i + 1, r); }
  }
}
console.log("Traces checked:", tn, "(", steps, "steps ) with a fault:", tb);
console.log("console errors:", b.errs.length, b.errs.slice(0, 3)); b.close();
