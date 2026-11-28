import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9701, 1300, 900);
await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-4/os-sandbox.html" }); await b.sleep(1200);
await b.ev("localStorage.clear()"); await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-4/os-sandbox.html" }); await b.sleep(1200);
for (const k of ["win","mac","lin"]) {
  console.log(k, await b.ev(`(async function(){ App.show('${k}'); var d=App.cur, sl=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
    d.wall.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:300,clientY:300})); await sl(80);
    var it=[].slice.call(d.root.querySelectorAll('*')).filter(function(e){return e.children.length===0&&/^New [Ff]older/.test(e.textContent.trim())})[0];
    if(it) it.click(); await sl(80); var ok=[].slice.call(d.root.querySelectorAll('.modal .btn')).filter(function(x){return x.textContent==='OK'})[0]; if(ok) ok.click(); await sl(80); return JSON.stringify({menuItem: !!it, mkdirDone: d.done.has('mkdir')}); })()`));
}
console.log(JSON.stringify(b.errs)); b.close(); process.exit(0);
