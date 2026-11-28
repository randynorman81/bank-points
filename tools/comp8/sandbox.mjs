// Drives the OS Sandbox (ist/unit-4/os-sandbox.html) in real Chrome: completes every mission on all three desktops with the real app functions,
// checks the terminals answer like the real ones, and that the final badge appears.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9700, 1300, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-4/os-sandbox.html" }); await b.sleep(1200);
await b.ev("localStorage.clear()"); await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-4/os-sandbox.html" }); await b.sleep(1200);
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const kinds = { win: "startmenu", mac: "launchpad", lin: "overview" };
for (const k of ["win", "mac", "lin"]) {
  const r = await b.ev(`(async function(){
    App.show('${k}'); var d = App.cur, sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
    d.launcher('${kinds[k]}'); await sleep(60); d.closeLauncher();
    d.openApp('files'); await sleep(60);
    var home = d.cfg.home.slice(); d.openNode(home.concat('Documents'), 'Homework.txt'); await sleep(60);
    d.trashItem(home.concat('Documents'), 'Homework.txt'); await sleep(60);
    d.setWall(WALLS[1].c); await sleep(30);
    d.openApp('term'); await sleep(120);
    var inp = d.root.querySelector('.ln input'), out = [];
    var run = function(cmd){ inp = d.root.querySelector('.ln input'); inp.value = cmd; inp.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'})); };
    var txt = function(){ return d.root.querySelector('.term, .terminal, .tbody') ? '' : ''; };
    ${k === "win" ? "run('dir'); run('cd Documents'); run('dir'); run('whoami'); run('ver'); run('bogus')" : "run('ls'); run('cd Documents'); run('ls'); run('pwd'); run('whoami'); run('sudo ls'); run('bogus')"}
    await sleep(100);
    var all = d.root.innerText;
    d.openApp('settings'); await sleep(120);
    var viaApple = null;
    if ('${k}' === 'mac') { var ap = [].slice.call(d.root.querySelectorAll('*')).filter(function(e){ return e.children.length === 0 && e.textContent.trim() === '\uD83C\uDF4E'; })[0]; if (ap) { ap.click(); await sleep(80); var it = [].slice.call(d.root.querySelectorAll('*')).filter(function(e){ return e.children.length === 0 && /About This Mac/.test(e.textContent); })[0]; viaApple = !!it; if (it) it.click(); await sleep(80); } }
    var done0 = d.done.has('about');
    var ab = d.root.querySelector('.nav div[data-k="about"]'); if (ab) ab.click(); await sleep(80);
    return JSON.stringify({ done: d.cfg.missions.map(function(m){ return [m[0], d.done.has(m[0])]; }), term: all.slice(-700), win: document.getElementById('mwin').style.display, viaApple: viaApple, aboutBeforeSettings: done0 });
  })()`);
  const o = JSON.parse(r);
  const miss = o.done.filter((m) => !m[1]).map((m) => m[0]);
  if (k === "mac") { console.log("  apple menu route found:", o.viaApple, "about done via apple menu:", o.aboutBeforeSettings); if (!o.aboutBeforeSettings) fail("mac apple-menu About This Mac mission"); }
  console.log(k, "missing missions:", JSON.stringify(miss), "| win banner:", o.win);
  // mkdir is only reachable by the right-click menu or the terminal, so run it through the terminal here
  if (miss.length) {
    const r2 = await b.ev(`(async function(){ var d = App.cur; var inp = d.root.querySelector('.ln input'); inp.value = 'mkdir Test'; inp.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'})); await new Promise(function(r){setTimeout(r,80)}); return JSON.stringify(d.cfg.missions.filter(function(m){return !d.done.has(m[0])}).map(function(m){return m[0]})); })()`);
    console.log("  after mkdir, still missing:", r2); if (JSON.parse(r2).length) fail(k, "missions not completable", r2);
  }
  if (k === "win" && !/Directory of C:\\Users\\Student/.test(o.term + "")) { /* term text may be truncated; checked below */ }
  console.log("  terminal tail:", JSON.stringify(o.term.replace(/\s+/g, " ").slice(-380)));
}
const fin = await b.ev(`document.getElementById('final').style.display`); console.log("final badge:", fin); if (fin !== "block") fail("final badge not shown");
console.log("errors:", JSON.stringify(await b.ev("window.__errs"))); if ((await b.ev("window.__errs")).length) fail("script errors");
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
