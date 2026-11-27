/* Real-Chrome oracle for the Unit 5 (CSS) Parsons problems.
   usage: node oracle.mjs problems.json out.json
   problem: {id, mode: "css"|"html", ctx: body HTML (css mode) , css: style.css text (html mode), lines: [...], dis: [[index, text], ...]}
   For every problem it: renders the solution, tries every ordering of the lines (unique orderings) and keeps the ones that give exactly the same page
   (same elements, same computed styles in the normal, :hover, :focus and :active states, same boxes), and tries every wrong piece in every line (it must change the page). */
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const b = await launch(9671, 900, 700);
await b.send("Page.navigate", { url: "about:blank" }); await b.sleep(300);
await b.ev(`window.__O = (function(){
  var PROPS = ['color','background-color','border-top-width','border-top-style','border-top-color','border-right-width','border-right-style','border-right-color','border-bottom-width','border-bottom-style','border-bottom-color','border-left-width','border-left-style','border-left-color','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','font-family','font-size','font-weight','font-style','text-align','text-transform','text-decoration-line','display','width','height','list-style-type','vertical-align','flex-direction','justify-content','align-items','row-gap','column-gap','grid-template-columns','cursor','opacity'];
  var f = document.createElement('iframe'); f.style.cssText = 'width:800px;height:600px;position:absolute;left:0;top:0;border:0'; document.body.appendChild(f);
  function pseudo(css){ return css.replace(/:hover/g, '.__hov').replace(/:focus/g, '.__foc').replace(/:active/g, '.__act'); }
  function build(p, css){
    var c = pseudo(css);
    if (p.mode === 'html') {
      var lines = css.__lines; 
    }
  }
  function docFor(p, lines){
    var src, css = p.mode === 'css' ? lines.join('\\n') : p.css;
    if (p.mode === 'css') src = '<!DOCTYPE html><html><head><title>t</title><style>' + pseudo(css) + '</style></head><body>' + p.ctx + '</body></html>';
    else src = lines.join('\\n').replace(/<link\\b[^>]*>/gi, function(m){ return (/\\brel="stylesheet"/i.test(m) && /\\bhref="style\\.css"/i.test(m)) ? '<style>' + pseudo(p.css) + '</style>' : ''; });
    return src;
  }
  function read(doc, win){
    var out = [], els = [doc.body].concat(Array.prototype.slice.call(doc.body.querySelectorAll('*')));
    var noTr = doc.createElement('style'); 
    function props(e){ var cs = win.getComputedStyle(e), a = []; PROPS.forEach(function(k){ a.push(cs.getPropertyValue(k)); }); return a.join('|'); }
    function tr(e){ var cs = win.getComputedStyle(e); return cs.transitionProperty + '/' + cs.transitionDuration + '/' + cs.transitionTimingFunction; }
    var states = ['', '__hov', '__foc', '__act'];
    var trs = els.map(function(e){ return states.map(function(s){ if (s) e.classList.add(s); var v = tr(e); if (s) e.classList.remove(s); return v; }).join(';'); });
    noTr.textContent = '*,*::before,*::after{transition:none !important;animation:none !important}'; doc.head.appendChild(noTr);
    els.forEach(function(e, i){
      var r = e.getBoundingClientRect(), s = e.tagName + '#' + i + '[' + Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width) + ',' + Math.round(r.height) + ']' + props(e) + '{' + trs[i] + '}' + (e.childNodes.length && e.firstChild.nodeType === 3 ? e.firstChild.textContent.trim() : '');
      states.slice(1).forEach(function(st){ e.classList.add(st); s += '~' + props(e); e.classList.remove(st); });
      out.push(s);
    });
    return doc.title + '\\n' + out.join('\\n');
  }
  function sigOf(p, lines){
    var doc = f.contentDocument; doc.open(); doc.write(docFor(p, lines)); doc.close();
    return read(doc, f.contentWindow);
  }
  function perms(ids, cap){
    var cnt = {}; ids.forEach(function(x){ cnt[x] = (cnt[x] || 0) + 1; }); var keys = Object.keys(cnt), n = ids.length, cur = [], out = [];
    (function rec(){ if (out.length >= cap) return; if (cur.length === n) { out.push(cur.join('')); return; } keys.forEach(function(k){ if (cnt[k] > 0) { cnt[k]--; cur.push(k); rec(); cur.pop(); cnt[k]++; } }); })();
    return out;
  }
  function run(p){
    var lines = p.lines, distinct = [], ids = lines.map(function(t){ var k = distinct.indexOf(t); if (k < 0) { distinct.push(t); k = distinct.length - 1; } return k.toString(36); });
    var base = sigOf(p, lines), res = { id: p.id, valid: [], badDis: [], nBase: base.length };
    if (/(^|\\n)(BODY#0\\[0,0,0,0\\])/.test(base)) res.empty = true;
    var all = perms(ids, 60000); res.tried = all.length;
    all.forEach(function(k){ var ls = k.split('').map(function(c){ return distinct[parseInt(c, 36)]; }); if (sigOf(p, ls) === base) res.valid.push(k); });
    p.dis.forEach(function(d){ var ls = lines.slice(); ls[d[0]] = d[1]; if (sigOf(p, ls) === base) res.badDis.push([d[1], d[0]]); });
    return res;
  }
  return { run: run, sigOf: sigOf };
})(); 1`);
const out = [];
for (const p of input) { const t = Date.now(); const r = await b.ev(`window.__O.run(${JSON.stringify(p)})`); if (r && r.__err) { console.log("ERR", p.id, r.__err); out.push({ id: p.id, error: r.__err }); continue; } out.push(r); console.log(p.id, "valid", r.valid.length, "of", r.tried, "badDis", r.badDis.length, (Date.now() - t) + "ms"); }
fs.writeFileSync(process.argv[3], JSON.stringify(out)); b.close();
