// Clicks every interactive demo on the Unit 10 notes pages in real Chrome and checks what they say.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const D = "file:///Users/randynorman/bank-points/ist/unit-13/";
const b = await launch(9704, 1200, 900);
await b.send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__errs=[]; window.addEventListener('error', function(e){ window.__errs.push(String(e.message)); });" });
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
const go = async (f) => { await b.send("Page.navigate", { url: D + f }); await b.sleep(900); };
// path: 5 stops in the right order
await go("internet-path-notes.html");
const stops = await b.ev(`[].map.call(document.querySelectorAll('.pathstep h4'), function(h){return h.textContent}).join(' > ')`);
if (stops !== "Your House > Last Mile > ISP Regional Network > Internet Backbone > Destination Server") fail("path order", stops);
for (let i = 0; i < 5; i++) { await b.ev(`document.querySelectorAll('.pathstep')[${i}].click()`); const t = await b.ev(`document.getElementById('detail').innerText`); if (t.length < 40) fail("path detail empty", i); }
// modem / router toggles
await go("modem-router-notes.html");
const mr = {};
for (const k of ["both", "modem-only", "router-only"]) { await b.ev(`document.querySelector('#ctrl [data-k="${k}"]').click()`); mr[k] = await b.ev(`JSON.stringify({text: document.getElementById('explain').innerText, modem: document.getElementById('modem').className, router: document.getElementById('router').className, devsOn: document.querySelectorAll('#devs .dev.on').length})`); }
const m = Object.fromEntries(Object.entries(mr).map(([k, v]) => [k, JSON.parse(v)]));
if (!(m.both.devsOn === 4 && /off/.test(m["modem-only"].router) && /off/.test(m["router-only"].modem))) fail("modem/router states", JSON.stringify(m));
if (!/Everything works/.test(m.both.text) || !/nothing can use it/.test(m["modem-only"].text) || !/not to the internet/.test(m["router-only"].text)) fail("modem/router wording");
// public/private IP
await go("ip-nat-notes.html");
const names = await b.ev(`[].map.call(document.querySelectorAll('#devs .devbtn'), function(d){return d.innerText.replace(/\\n/g,' ')})`);
for (let i = 0; i < 3; i++) { await b.ev(`document.querySelectorAll('#devs .devbtn')[${i}].click()`); const f = await b.ev(`document.getElementById('flow').innerText`); if (!f.includes("203.0.113.9") || !f.includes(names[i].split(" ")[1])) fail("ip widget", i, f); }
if (await b.ev(`document.body.innerText.includes('73.14.201.9')`)) fail("old public IP still on the page");
// DNS: each site shows its own answer
await go("dns-notes.html");
const ips = { "schscomputerscience.com": "104.21.12.6", "google.com": "142.250.80.46", "wikipedia.org": "208.80.154.224" };
for (const [i, [name, ip]] of Object.entries(ips).entries()) { await b.ev(`document.querySelectorAll('#site button')[${i}].click()`); await b.sleep(6200); const t = await b.ev(`document.getElementById('steps').innerText`); if (!t.includes(name) || !t.includes(ip)) fail("dns", name, t.slice(0, 120)); if ((await b.ev(`document.querySelectorAll('#steps .lstep.on').length`)) !== 5) fail("dns steps did not all light up", name); }
// DHCP: joins devices, leases count down and expire
await go("dhcp-notes.html");
if ((await b.ev(`document.querySelectorAll('#leases .lease').length`)) !== 2) fail("dhcp starts with 2 leases");
for (let i = 0; i < 6; i++) await b.ev(`document.getElementById('joinBtn').click()`);
const n = await b.ev(`document.querySelectorAll('#leases .lease').length`); if (n !== 6) fail("dhcp stops at 6 devices", n);
const ipsL = await b.ev(`JSON.stringify([].map.call(document.querySelectorAll('#leases .ip'), function(x){return x.textContent}))`); if (new Set(JSON.parse(ipsL)).size !== 6) fail("dhcp gave duplicate addresses", ipsL);
await b.sleep(9000); if ((await b.ev(`document.querySelectorAll('#leases .lease.expired').length`)) < 2) fail("dhcp leases did not expire");
// bandwidth: 500 / n
await go("bandwidth-notes.html");
for (const [n, mbps] of [[1, 500], [2, 250], [4, 125], [8, 63]]) { await b.ev(`document.querySelector('#ctrl [data-n="${n}"]').click()`); const t = await b.ev(`document.getElementById('readout').innerText`); if (!t.includes(mbps + " Mbps") || !t.includes(n + " device")) fail("bandwidth", n, t); }
console.log("errors:", JSON.stringify(await b.ev("window.__errs"))); if ((await b.ev("window.__errs")).length) fail("page errors");
console.log("failures:", bad); b.close(); process.exit(bad ? 1 : 0);
