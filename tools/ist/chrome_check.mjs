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
    els = els.filter(function(e){ return e.tagName !== 'TBODY'; });   /* a browser adds the tbody itself */
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
        else if (p === 'vertical-align') { if (cs.verticalAlign !== v) issues.push(tags[i] + '#' + i + ' vertical-align: ' + cs.verticalAlign + ' vs ' + v); }
        else if (/^(padding|margin)-(top|right|bottom|left)$/.test(p)) { var kk = p.split('-'), camel = kk[0] + kk[1][0].toUpperCase() + kk[1].slice(1), wantv = (v === '0') ? '0px' : v; if (/^-?[\\d.]+px$/.test(wantv) || wantv === '0px') { if (cs[camel] !== wantv) issues.push(tags[i] + '#' + i + ' ' + p + ': ' + cs[camel] + ' vs ' + v); } else if (v !== 'auto') { var rr = resolve(p, v); if (rr === null) issues.push(tags[i] + '#' + i + ' ' + p + ' not accepted: ' + v); } }
        else if (p === 'height') { var hh = resolve('height', v); if (hh === null) issues.push(tags[i] + '#' + i + ' height not accepted: ' + v); }
        else if (p === 'display') { var dv = v; if (cs.display !== dv && !(dv === 'inline' && cs.display === 'inline')) issues.push(tags[i] + '#' + i + ' display: ' + cs.display + ' vs ' + v); }
        else if (p === 'list-style-type') { if (cs.listStyleType !== v) issues.push(tags[i] + '#' + i + ' list-style-type: ' + cs.listStyleType + ' vs ' + v); }
        else if (/^border-/.test(p)) { var side = p.slice(7), parts = v.split(/\\s+/), st = parts.filter(function(x){ return /^(solid|dashed|dotted|double|groove|ridge|none)$/.test(x); })[0] || 'none', wd = parts.filter(function(x){ return /^[0-9.]+px$/.test(x); })[0];
          var bs = cs['border' + side[0].toUpperCase() + side.slice(1) + 'Style'], bw = cs['border' + side[0].toUpperCase() + side.slice(1) + 'Width'];
          if (bs !== st) issues.push(tags[i] + '#' + i + ' ' + p + ' style: ' + bs + ' vs ' + st); if (wd && st !== 'none' && bw !== wd) issues.push(tags[i] + '#' + i + ' ' + p + ' width: ' + bw + ' vs ' + wd); }
      });
    });
    /* the lines of text as a person SEES them: every piece of text is placed by where the browser draws it, and pieces drawn on the same horizontal band make one line */
    var pieces = []; var walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) { var tn = walker.currentNode, tx = tn.nodeValue.replace(/\\s+/g, ' '); if (!tx.trim()) continue; var par = tn.parentElement; if (win.getComputedStyle(par).display === 'none') continue;
      var tt = win.getComputedStyle(par).textTransform; if (tt === 'uppercase') tx = tx.toUpperCase(); else if (tt === 'lowercase') tx = tx.toLowerCase(); else if (tt === 'capitalize') tx = tx.replace(/(^|\\s)(\\S)/g, function(m, a, b){ return a + b.toUpperCase(); });
      var rg = doc.createRange(); rg.selectNodeContents(tn); var rc = rg.getClientRects(); if (!rc.length) continue; pieces.push({ t: tx, top: rc[0].top, left: rc[0].left, right: rc[rc.length - 1].right, bot: rc[0].bottom }); }
    var bands = []; pieces.forEach(function(p){ var mid = (p.top + p.bot) / 2, b = bands.filter(function(x){ return mid > x.top - 1 && mid < x.bot + 1; })[0]; if (b) { b.items.push(p); b.top = Math.min(b.top, p.top); b.bot = Math.max(b.bot, p.bot); } else bands.push({ top: p.top, bot: p.bot, items: [p] }); });
    bands.sort(function(a, b){ return a.top - b.top; });
    var got = bands.map(function(b){ var it = b.items.sort(function(x, y){ return x.left - y.left; }), s = ''; it.forEach(function(p, k){ if (k && p.left - it[k - 1].right > 1.5 && !/\\s$/.test(s) && !/^\\s/.test(p.t)) s += ' '; s += p.t; }); return s.replace(/\\s+/g, ' ').trim(); }).filter(Boolean);
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
