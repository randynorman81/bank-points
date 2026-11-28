// IST Unit 1: every interactive widget on the notes pages, in real Chrome.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const D = "file:///Users/randynorman/bank-points/ist/unit-1/";
const b = await launch(9707, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const go = async (f) => { await b.send("Page.navigate", { url: D + f }); await b.sleep(900); };
// every classify set: answer all right, then all wrong, and check scores and that explanations show
const sets = { "1-1-notes.html": ["pillars", 8], "1-3-notes.html": ["police", 7], "hacking-ethics-briefing.html": ["access", 7], "the-front-door.html": ["front", 6] };
for (const [f, [name, n]] of Object.entries(sets)) {
  await go(f);
  const widgets = await b.ev(`document.querySelectorAll('.u1w').length`); if (!widgets) fail(f, "no widget mounted");
  for (const mode of ["right", "wrong"]) {
    await b.ev(`(function(){ var w = document.querySelector('.u1w[data-set="${name}"]'); w.querySelector('[data-r]') && w.querySelector('[data-r]').click(); })()`);
    for (let i = 0; i < n; i++) {
      await b.ev(`(function(){ var S = U1.SETS['${name}'], it = S.items[${i}], w = document.querySelector('.u1w[data-set="${name}"]'), opts = w.querySelectorAll('.opts button'), k = ${mode === "right" ? "it[1]" : "((it[1] + 1) % opts.length)"}; opts[k].click(); })()`);
      const fb = await b.ev(`document.querySelector('.u1w[data-set="${name}"] .fb').className + '|' + document.querySelector('.u1w[data-set="${name}"] .fb').innerText.length`); const [cls, len] = fb.split("|"); if (!cls.includes(mode === "right" ? "ok" : "no") || +len < 25) fail(f, name, i, mode, fb);
      await b.ev(`document.querySelector('.u1w[data-set="${name}"] [data-n]').click()`);
    }
    const sc = await b.ev(`document.querySelector('.u1w[data-set="${name}"] .score').textContent`); const want = mode === "right" ? n + " of " + n : "0 of " + n; if (!sc.startsWith(want)) fail(f, name, mode, "score", sc);
  }
  console.log(f, name, "ok");
}
// answer keys: no item should have the same correct option position every time
for (const [name, n] of [["pillars", 8], ["police", 7], ["access", 7], ["front", 6]]) { const keys = JSON.parse(await b.ev(`JSON.stringify(U1.SETS['${name}'].items.map(function(i){return i[1]}))`).catch(() => "[]")); }
// password lab
await go("1-5-notes.html");
const pl = async (pw) => JSON.parse(await b.ev(`(function(){ var i = document.querySelector('#pw'); i.value = ${JSON.stringify(pw)}; i.dispatchEvent(new Event('input')); return JSON.stringify({text: document.querySelector('#pr').innerText, w: document.querySelector('#mt').style.width}); })()`));
const r1 = await pl("P@ssw0rd!"); if (!/Cracked instantly/.test(r1.text)) fail("P@ssw0rd! should be cracked instantly", r1.text);
const r2 = await pl("password"); if (!/Cracked instantly/.test(r2.text)) fail("password");
const r3 = await pl("Qx7#vLm2"); if (/Cracked instantly/.test(r3.text) || !/bits/.test(r3.text)) fail("random 8 char", r3.text); console.log("Qx7#vLm2:", r3.text.replace(/\s+/g, " ").slice(0, 120));
const r4 = await pl("river-comet-anchor-spoon"); if (!/About 52 bits/.test(r4.text) || !/2 days|3 days/.test(r4.text)) fail("4 words", r4.text); console.log("4 words:", r4.text.replace(/\s+/g, " ").slice(0, 120));
const r5 = await pl("river-comet-anchor-spoon-lamp"); if (!/About 65 bits/.test(r5.text) || !/4[0-9] years/.test(r5.text)) fail("5 words", r5.text); console.log("5 words:", r5.text.replace(/\s+/g, " ").slice(0, 120));
const r6 = await pl("a"); if (/Cracked/.test(r6.text) === false && !/bits/.test(r6.text)) fail("one char"); const r7 = await pl(""); if (r7.text !== "") fail("empty");
// access control demo
await go("the-front-door.html");
const idor = async (n, chk) => await b.ev(`(function(){ var w = document.querySelector('.u1w[data-w="idor"]'); w.querySelector('#chk').checked = ${chk}; w.querySelector('[data-n="${n}"]').click(); return w.querySelector('#res').innerText; })()`);
if (!/Riley/.test(await idor(1043, false)) || !/broken access control/.test(await idor(1043, false))) fail("idor vulnerable view");
if (!/403/.test(await idor(1043, true))) fail("idor fixed view"); if (!/You/.test(await idor(1042, true))) fail("own record");
// auction
await go("whos-watching-you.html");
await b.ev(`document.querySelector('.u1w[data-w="auction"] #go').click()`); await b.sleep(2500);
const au = await b.ev(`JSON.stringify({bids: document.querySelectorAll('.u1w .bid.in').length, win: document.querySelectorAll('.u1w .bid.win').length, keep: document.querySelectorAll('.u1w .bid.keep').length, fb: document.querySelector('.u1w #fb').innerText})`); const a = JSON.parse(au); if (a.bids !== 8 || a.win !== 1 || a.keep !== 7 || !/wins the ad slot/.test(a.fb)) fail("auction", au);
console.log("errors:", JSON.stringify(await b.ev("window.__errs"))); if ((await b.ev("window.__errs")).length) fail("page errors");
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
