// End-to-end test of the reading labs in real Chrome against the real server code (in-memory storage).
//   ISTLAB_TIME_SCALE=0.01 node --import ./tools/istlab/register.mjs tools/istlab/devserver.mjs 8799 &
//   node tools/istlab/e2e.mjs [lessonId ...]
import { createRequire } from "module"; const require = createRequire(import.meta.url);
import fs from "fs"; import path from "path"; import { fileURLToPath, pathToFileURL } from "url";
const { launch } = require("../missions/testkit/cdp.js");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const KEY = (await import(pathToFileURL(path.join(ROOT, "netlify/functions/istlab-key.js")).href)).default;
const win = {}; new Function("window", fs.readFileSync(path.join(ROOT, "ist/lab/data.js"), "utf8"))(win); const PUB = win.ISTLAB;
const BASE = "http://localhost:8799", only = process.argv.slice(2);
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const cred = (n) => n + "." + Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3000 })).toString("base64").replace(/=/g, "") + ".s";
const api = (body) => fetch(BASE + "/api/istlab", { method: "POST", body: JSON.stringify(body) }).then((r) => r.json());
const b = await launch(9720, 1200, 900); await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.addEventListener('error',function(e){(window.__errs=window.__errs||[]).push(e.message)})" });
const wait = async (expr, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await b.ev(expr)) return true; await b.sleep(150); } return false; };
const open = async (lab, who) => { await b.send("Page.navigate", { url: BASE + "/ist/lab/teacher.html" }); await b.sleep(700); await b.ev(`sessionStorage.clear(); sessionStorage.setItem('istlab_cred', ${JSON.stringify(cred(who))})`); await b.send("Page.navigate", { url: BASE + "/ist/lab/lab.html?lab=" + lab }); await b.sleep(1500); };
// fills one item through the real controls
const fill = (it, k) => b.ev(`(function(){
  var it=${JSON.stringify(it)}, k=${JSON.stringify(k)}, root=document.getElementById('it-'+it.id); if(!root) return 'missing';
  function ev(el,t){el.dispatchEvent(new Event(t,{bubbles:true}))}
  if(it.type==='mc'||it.type==='multi'){ var want=it.type==='mc'?[k.a]:k.a; root.querySelectorAll('input').forEach(function(i){var on=want.indexOf(+i.getAttribute('data-i'))>-1; if(i.checked!==on){i.checked=on;ev(i,'change')}}); }
  else if(it.type==='text'){ var i=root.querySelector('input.txt'); i.value=k.a[0]; ev(i,'input'); }
  else if(it.type==='num'){ var i=root.querySelector('input.txt'); i.value=String(k.a); ev(i,'input'); }
  else if(it.type==='write'){ var t=root.querySelector('textarea'); t.value=k.kw.map(function(g){return g[0]}).join(' ')+' '+new Array(k.min+1).join('word '); ev(t,'input'); }
  else if(it.type==='karel'){ var t=root.querySelector('textarea.kta'); t.value=k.solution; ev(t,'input'); }
  else if(it.type==='match'){ root.querySelectorAll('select').forEach(function(s,i){s.value=String(k.a[i]); ev(s,'change')}); }
  else if(it.type==='order'){ for(var pos=0;pos<k.a.length;pos++){ var cur=window.__ISTLAB_TEST.answers()[it.id]; var at=cur.indexOf(k.a[pos]); while(at>pos){ root.querySelector('button[data-d="-1"][data-p="'+at+'"]').click(); at--; } } }
  return 'ok'; })()`);
async function fillAll(L, kind, onlyFirst) {
  const items = PUB.lessons[L][kind].steps.flatMap((s) => s.items), keys = KEY.lessons[L][kind].items;
  for (let i = 0; i < items.length; i++) { const r = await fill(items[i], keys[i]); if (r !== "ok") fail(L + kind, items[i].id, "could not fill", r); }
}
{ // a submit right after opening is refused as too fast (server clock)
  const t = cred("fastkid"), L0 = Object.keys(KEY.lessons)[0];
  await api({ action: "adminOpen", pin: "1234", open: [L0 + "w"] }); await api({ action: "setPeriod", credential: t, period: "3A" });
  const st = await api({ action: "start", credential: t, lab: L0 + "w" }); if (!st.ok) fail("fast start", JSON.stringify(st));
  const sub = await api({ action: "submit", credential: t, lab: L0 + "w", answers: {} }); if (!sub.tooFast) fail("an instant submit must be refused as too fast", JSON.stringify(sub));
  const bad3 = await api({ action: "submit", credential: "nope.x.s", lab: L0 + "w", answers: {} }); if (!bad3.needLogin) fail("bad token accepted");
  await api({ action: "adminOpen", pin: "1234", open: [] });
}
const ids = Object.keys(KEY.lessons).filter((x) => !only.length || only.indexOf(x) > -1);
for (const L of ids) {
  const stu = "s" + L.replace(".", "_"), w = L + "w", a = L + "a";
  // closed until the teacher opens it
  await open(w, stu);
  if (!(await wait(`!document.getElementById('perbox').classList.contains('hide')`)) ) fail(w, "no class picker", await b.ev(`JSON.stringify({auth:document.getElementById('authbox').className,err:document.getElementById('autherr').textContent,msg:document.getElementById('msg').textContent,who:document.getElementById('who').textContent,url:location.href,cred:sessionStorage.getItem('istlab_cred')&&sessionStorage.getItem('istlab_cred').slice(0,12)})`));
  await b.ev(`(function(){var s=document.getElementById('period');s.value='3A';s.dispatchEvent(new Event('change'))})()`); await b.sleep(900);
  const closed = await b.ev(`document.getElementById('msg').textContent`); if (!/not open yet/.test(closed)) fail(w, "should be closed", closed);
  const op = await api({ action: "adminOpen", pin: "1234", open: [w, a] }); if (!op.ok) fail("adminOpen", JSON.stringify(op));
  const bad2 = await api({ action: "adminOpen", pin: "0000", open: [w] }); if (!bad2.error) fail("wrong PIN accepted");
  // assignment stays locked until the walkthrough is 100
  await open(a, stu); await b.sleep(600); const lk = await b.ev(`document.getElementById('msg').textContent`); if (!/walkthrough/i.test(lk)) fail(a, "assignment should wait for walkthrough", lk);
  // walkthrough: answer only half, check, then the rest
  await open(w, stu); if (!(await wait(`!document.getElementById('lab').classList.contains('hide')`))) { fail(w, "lab did not open", await b.ev(`document.getElementById('msg').textContent`)); continue; }
  const n = PUB.lessons[L].w.steps.reduce((s, x) => s + x.items.length, 0);
  const cnt = await b.ev(`document.querySelectorAll('.item').length`); if (cnt !== n) fail(w, "item count on page", cnt, n);
  await b.sleep(Math.max(1500, n * 9 * 10 + 300));   // server clock (scaled)
  await b.ev(`document.getElementById('submit').click()`); await b.sleep(600);
  const zero = await b.ev(`document.querySelector('.result h2') && document.querySelector('.result h2').textContent`); if (!/^0%/.test(zero || "")) fail(w, "empty answers should score 0%", zero);
  await fillAll(L, "w");
  const prog = await b.ev(`document.getElementById('progt').textContent`); if (prog !== n + " of " + n + " answered") fail(w, "progress", prog);
  await b.ev(`document.getElementById('submit').click()`); await b.sleep(800);
  const h = await b.ev(`document.querySelector('.result h2').textContent`); if (!/^100%/.test(h)) fail(w, "right answers did not give 100%", h, await b.ev(`[].map.call(document.querySelectorAll('.item.no'),function(x){return x.id}).join()`));
  // a wrong answer shows a hint
  const first = PUB.lessons[L].w.steps[0].items[0], k0 = KEY.lessons[L].w.items[0];
  if (k0.type === "mc") { await b.ev(`(function(){var i=document.querySelectorAll('#it-${first.id} input');var w=[].filter.call(i,function(x){return +x.getAttribute('data-i')!==${k0.a}})[0];w.checked=true;w.dispatchEvent(new Event('change',{bubbles:true}))})()`); await b.ev(`document.getElementById('submit').click()`); await b.sleep(700);
    const t = await b.ev(`document.getElementById('r-${first.id}').textContent`); if (!/^Not yet\./.test(t) || t.length < 20) fail(w, "wrong answer should show a hint", t);
    const hd = await b.ev(`document.querySelector('.result h2').textContent`); if (/^100%/.test(hd)) fail(w, "a wrong answer still scored 100%");
    await fill(first, k0); await b.sleep(300); await b.ev(`document.getElementById('submit').click()`); await b.sleep(800); }
  // the saved best score and the unlocked assignment
  const me = await api({ action: "me", credential: cred(stu) }); if (!me.labs || me.labs[w].best !== 100) fail(w, "best not saved", JSON.stringify(me.labs && me.labs[w]));
  if (me.labs[a].locked) fail(a, "should be unlocked after walkthrough 100");
  // assignment
  await open(a, stu); if (!(await wait(`!document.getElementById('lab').classList.contains('hide')`))) { fail(a, "assignment did not open", await b.ev(`document.getElementById('msg').textContent`)); continue; }
  const na = PUB.lessons[L].a.steps.reduce((s, x) => s + x.items.length, 0);
  await b.sleep(Math.max(1500, na * 14 * 10 + 300)); await fillAll(L, "a");
  await b.ev(`document.getElementById('submit').click()`); await b.sleep(800);
  const ha = await b.ev(`document.querySelector('.result h2').textContent`); if (!/^100%/.test(ha)) fail(a, "assignment right answers did not give 100%", ha, await b.ev(`[].map.call(document.querySelectorAll('.item.no'),function(x){return x.id}).join()`));
  const whyShown = await b.ev(`[].every.call(document.querySelectorAll('.res.ok'),function(x){return x.textContent.length>14})`); if (!whyShown) fail(a, "explanations not shown");
  const errs = await b.ev(`(window.__errs||[]).join('|')`); if (errs) fail(L, "page errors", errs);
  console.log("lab", L, "ok");
}
// teacher dashboard data
const all = await api({ action: "adminAll", pin: "1234" }); if (!all.ok || !all.players.length) fail("adminAll", JSON.stringify(all).slice(0, 120)); else console.log("teacher sees", all.players.length, "students,", all.labs.length, "labs");
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
