// Real-browser check of the WRONG PIECES: a page built with a wrong piece must not be the same page as the right one. usage: node chrome_alts.mjs _alts.json out.json
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const b = await launch(9651, 1000, 800);
await b.send("Page.navigate", { url: "about:blank" }); await b.sleep(300);
await b.ev(`window.__sig = async function(html){
  var f = document.createElement('iframe'); f.style.cssText='width:800px;height:600px;position:absolute'; document.body.appendChild(f);
  await new Promise(function(r){ f.onload = r; f.srcdoc = html; });
  var doc = f.contentDocument;
  function sg(n){ if (n.nodeType === 3) { var t = n.nodeValue.replace(/\\s+/g, ' '); return t.trim() ? '"' + t + '"' : null; } if (n.nodeType !== 1) return null;
    var st = []; for (var i = 0; i < n.style.length; i++) st.push(n.style[i] + ':' + n.style.getPropertyValue(n.style[i])); st.sort();
    var at = ['href','src','alt','target','rel','width'].map(function(k){ return n.hasAttribute(k) ? k + '=' + n.getAttribute(k) : ''; }).join('|');
    return n.tagName + '[' + at + '][' + st.join(';') + ']{' + Array.prototype.map.call(n.childNodes, sg).filter(Boolean).join(',') + '}'; }
  var out = sg(doc.documentElement) + '||' + (doc.body.innerText || '').replace(/\\s+/g, ' ').trim() + '||' + doc.title;
  f.remove(); return out; };`);
let same = [], n = 0;
for (const p of input) {
  const base = await b.ev(`window.__sig(${JSON.stringify(p.base)})`);
  for (const a of p.alts) { n++; const s = await b.ev(`window.__sig(${JSON.stringify(a.html)})`); if (s === base) same.push({ id: p.id, i: a.i, d: a.d }); }
}
fs.writeFileSync(process.argv[3], JSON.stringify({ checked: n, same })); b.close();
console.log("wrong-piece pages checked:", n, "| identical to the right page in the browser:", same.length);
for (const x of same.slice(0, 30)) console.log("  ", x.id, "line", x.i + 1, x.d);
