// Real-browser check of tools/ist/html_model.py. usage: node chrome_check.mjs docs.json out.json
// docs.json: [{id, html, frag, tags:[...], props:[{prop:value}...], lines:[...]}] (written by the Python side). Also {declCheck:[[prop,value,expectedBool]...]}.
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const b = await launch(9650, 1000, 800);
await b.send("Page.navigate", { url: "about:blank" }); await b.sleep(300);
await b.ev(`window.__helpers = (function(){
  function resolve(p, v){ var d=document.createElement('div'); document.body.appendChild(d); d.style.setProperty(p, v); var r = d.style.getPropertyValue(p) === '' ? null : getComputedStyle(d)[p]; d.remove(); return r; }
  async function check(d){
    var issues = [], f = document.createElement('iframe'); f.style.cssText='width:900px;height:700px;position:absolute;left:0;top:0'; document.body.appendChild(f);
    await new Promise(function(r){ f.onload = r; f.srcdoc = d.html; });
    var doc = f.contentDocument, win = f.contentWindow;
    var els = Array.prototype.slice.call(doc.querySelectorAll('*')); if (d.frag === true) { els = Array.prototype.slice.call(doc.body.querySelectorAll('*')); } else if (d.frag === 'body') { els = els.filter(function(e){ return ['HTML','HEAD','TITLE'].indexOf(e.tagName) < 0; }); }
    var tags = els.map(function(e){ return e.tagName.toLowerCase(); });
    if (JSON.stringify(tags) !== JSON.stringify(d.tags)) issues.push('tags differ: browser ' + tags.join(',') + ' vs model ' + d.tags.join(','));
    else els.forEach(function(e, i){
      var cs = win.getComputedStyle(e), exp = d.props[i];
      Object.keys(exp).forEach(function(p){
        var v = exp[p];
        if (p === 'color' || p === 'background-color') { var want = resolve(p, v); if (cs[p] !== want) issues.push(tags[i] + '#' + i + ' ' + p + ': browser ' + cs[p] + ' vs ' + v + ' (' + want + ')'); }
        else if (p === 'font-size') { var w = resolve(p, v); if (cs.fontSize !== w) issues.push(tags[i] + '#' + i + ' font-size: browser ' + cs.fontSize + ' vs ' + v + ' (' + w + ')'); }
        else if (p === 'text-align') { if (cs.textAlign !== v && !(v === 'left' && cs.textAlign === 'start')) issues.push(tags[i] + '#' + i + ' text-align: ' + cs.textAlign + ' vs ' + v); }
        else if (p === 'text-transform') { if (cs.textTransform !== v) issues.push(tags[i] + '#' + i + ' text-transform: ' + cs.textTransform + ' vs ' + v); }
        else if (p === 'font-family') { var first = v.split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase(); if (cs.fontFamily.toLowerCase().indexOf(first) < 0) issues.push(tags[i] + '#' + i + ' font-family: ' + cs.fontFamily + ' vs ' + v); }
        else if (p === 'width') { if (e.tagName !== 'IMG' && e.tagName !== 'DIV') { /* width on other elements: only check it was accepted */ } var ww = resolve('width', v); if (ww === null) issues.push(tags[i] + ' width not accepted: ' + v); }
        else if (p === 'display') { var dv = v; if (cs.display !== dv && !(dv === 'inline' && cs.display === 'inline')) issues.push(tags[i] + '#' + i + ' display: ' + cs.display + ' vs ' + v); }
        else if (p === 'list-style-type') { if (cs.listStyleType !== v) issues.push(tags[i] + '#' + i + ' list-style-type: ' + cs.listStyleType + ' vs ' + v); }
        else if (/^border-/.test(p)) { var side = p.slice(7), parts = v.split(/\\s+/), st = parts.filter(function(x){ return /^(solid|dashed|dotted|double|groove|ridge|none)$/.test(x); })[0] || 'none', wd = parts.filter(function(x){ return /^[0-9.]+px$/.test(x); })[0];
          var bs = cs['border' + side[0].toUpperCase() + side.slice(1) + 'Style'], bw = cs['border' + side[0].toUpperCase() + side.slice(1) + 'Width'];
          if (bs !== st) issues.push(tags[i] + '#' + i + ' ' + p + ' style: ' + bs + ' vs ' + st); if (wd && st !== 'none' && bw !== wd) issues.push(tags[i] + '#' + i + ' ' + p + ' width: ' + bw + ' vs ' + wd); }
      });
    });
    var got = (doc.body.innerText || '').split('\\n').map(function(s){ return s.replace(/\\s+/g, ' ').trim(); }).filter(Boolean);
    var imgLess = got; if (JSON.stringify(imgLess) !== JSON.stringify(d.lines)) issues.push('text differs: browser ' + JSON.stringify(imgLess) + ' vs model ' + JSON.stringify(d.lines));
    f.remove(); return issues;
  }
  return { check: check, resolve: resolve };
})()`);
const out = { docs: [], decls: [] };
for (const d of input.docs || []) { const r = await b.ev(`window.__helpers.check(${JSON.stringify(d)})`); out.docs.push({ id: d.id, issues: Array.isArray(r) ? r : [JSON.stringify(r)] }); }
await b.ev(`window.__std = (async function(){ var f=document.createElement('iframe'); document.body.appendChild(f); await new Promise(function(r){ f.onload=r; f.srcdoc='<!DOCTYPE html><html><body></body></html>'; }); return f.contentDocument; })()`); await b.sleep(300);
for (const [p, v, want] of input.declCheck || []) { const r = await b.ev(`(async function(){ var doc = await window.__std; var e=doc.createElement('div'); doc.body.appendChild(e); e.style.setProperty(${JSON.stringify(p)}, ${JSON.stringify(v)}); return e.style.getPropertyValue(${JSON.stringify(p)}) !== ''; })()`); out.decls.push({ p, v, want, browser: r, ok: r === want }); }
fs.writeFileSync(process.argv[3], JSON.stringify(out)); b.close();
console.log("docs:", out.docs.length, "with issues:", out.docs.filter((x) => x.issues.length).length, "| declarations:", out.decls.length, "disagree:", out.decls.filter((x) => !x.ok).length);
