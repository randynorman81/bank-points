/* Real-Chrome oracle for the Unit 6 (Bootstrap) Parsons problems, with the REAL Bootstrap 5.3.9 stylesheet (tools/bs6/bootstrap-5.3.9.min.css).
   usage: node oracle.mjs problems.json out.json
   problem: {id, mode: "head"|"body", css: optional style.css text, head: lines before the lines (body mode), lines, dis: [[index, text], ...]}
   Every unique ordering of the lines is rendered at a phone width and a laptop width; the ones that give exactly the solution's page are the valid orders.
   Every wrong piece must change the page (or the way it behaves). Bootstrap link rule: a link tag counts only when it has rel="stylesheet" and an exact https jsDelivr Bootstrap 5 css address. */
import fs from "fs"; import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const input = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const BS = fs.readFileSync("/Users/randynorman/bank-points/tools/bs6/bootstrap-5.3.9.min.css", "utf8");
const b = await launch(9681, 1200, 800);
await b.send("Page.navigate", { url: "about:blank" }); await b.sleep(300);
await b.ev(`window.__BS = ${JSON.stringify(BS)};`);
const __init = await b.ev(`window.__O = (function(){
  var PROPS = ['display','width','height','flex-basis','flex-grow','flex-direction','justify-content','align-items','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','color','background-color','border-top-width','border-top-style','border-top-color','border-top-left-radius','font-size','font-weight','text-align','position','cursor','text-decoration-line','box-shadow','list-style-type','vertical-align','line-height'];
  var f = document.createElement('iframe'); f.style.cssText = 'height:700px;position:absolute;left:0;top:0;border:0'; document.body.appendChild(f);
  var BSRE = /^https:\\/\\/cdn\\.jsdelivr\\.net\\/npm\\/bootstrap@5\\.\\d+\\.\\d+\\/dist\\/css\\/bootstrap(\\.min)?\\.css$/;
  function bootstrapLink(t){ return /\\brel="stylesheet"/i.test(t) && BSRE.test((/\\bhref="([^"]*)"/i.exec(t) || [,''])[1]); }
  function headDoc(p, lines){ var src = lines.join('\\n').replace(/<link\\b[^>]*>/gi, function(m){ if (bootstrapLink(m)) return '<style>' + window.__BS + '</style>'; if (/\\brel="stylesheet"/i.test(m) && /\\bhref="style\\.css"/i.test(m)) return '<style>' + (p.css || '') + '</style>'; return ''; }); return /<html/i.test(src) ? src : '<!DOCTYPE html><html>' + src + '</html>'; }
  function read(doc, win){
    var els = [doc.body].concat(Array.prototype.slice.call(doc.body.querySelectorAll('*'))), out = [];
    els.forEach(function(e, i){ var cs = win.getComputedStyle(e), r = e.getBoundingClientRect(), a = []; PROPS.forEach(function(k){ a.push(cs.getPropertyValue(k)); });
      out.push(e.tagName + '#' + i + '[' + Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width) + ',' + Math.round(r.height) + ']' + a.join('|') + (e.childNodes.length && e.firstChild.nodeType === 3 ? e.firstChild.textContent.trim() : '')); });
    return doc.title + '\\n' + out.join('\\n');
  }
  function imgNorm(l){ return l.replace(/<img\\b[^>]*>/gi, function(m){ var c = (/class="([^"]*)"/.exec(m) || [,''])[1], a = (/alt="([^"]*)"/.exec(m) || [,''])[1]; return '<img class="' + c + '" alt="' + a + '" width="300" height="200" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">'; }); }
  var FR = {};   /* body mode: one loaded document per width, so the 230 KB of Bootstrap is parsed once, not once per ordering */
  function frame(w, p){ var k = w + '|' + (p.css || '') + '|' + (p.pre || '') + (p.post || ''); if (FR[k]) return FR[k]; var g = document.createElement('iframe'); g.style.cssText = 'height:700px;position:absolute;left:0;top:0;border:0;width:' + w + 'px'; document.body.appendChild(g);
    var d = g.contentDocument; d.open(); d.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>t</title><style>' + window.__BS + '</style><style>' + (p.css || '') + '</style></head><body></body></html>'); d.close(); FR[k] = g; return g; }
  function sig(p, lines){
    lines = lines.map(imgNorm); var s = '';
    [1100, 480].forEach(function(w){
      if (p.mode === 'head') { f.style.width = w + 'px'; var doc = f.contentDocument; doc.open(); doc.write(headDoc(p, lines)); doc.close(); s += '@' + w + '\\n' + read(f.contentDocument, f.contentWindow) + '\\n'; }
      else { var g = frame(w, p); g.contentDocument.body.innerHTML = (p.pre || '') + lines.join('\\n') + (p.post || ''); s += '@' + w + '\\n' + read(g.contentDocument, g.contentWindow) + '\\n'; } });
    return s;
  }
  function perms(ids, cap){ var cnt = {}; ids.forEach(function(x){ cnt[x] = (cnt[x] || 0) + 1; }); var keys = Object.keys(cnt), n = ids.length, cur = [], out = [];
    (function rec(){ if (out.length >= cap) return; if (cur.length === n) { out.push(cur.join('')); return; } keys.forEach(function(k){ if (cnt[k] > 0) { cnt[k]--; cur.push(k); rec(); cur.pop(); cnt[k]++; } }); })(); return out; }
  function run(p){
    var lines = p.lines, distinct = [], ids = lines.map(function(t){ var k = distinct.indexOf(t); if (k < 0) { distinct.push(t); k = distinct.length - 1; } return k.toString(36); });
    var base = sig(p, lines), res = { id: p.id, valid: [], badDis: [] };
    var all = perms(ids, 60000);
    if (p.mode !== 'head') { var byId = {}; ids.forEach(function(id, i){ byId[id] = lines[i]; }); var OPENRE = /<(?!\\/|!|br\\b|hr\\b|img\\b|input\\b|link\\b|meta\\b)[a-zA-Z]/g, CLOSERE = /<\\/[a-zA-Z]/g; all = all.filter(function(k){ var d = 0; for (var i = 0; i < k.length; i++) { var l = byId[k[i]], o = (l.match(OPENRE) || []).length, c = (l.match(CLOSERE) || []).length; if (/^\\s*<\\//.test(l)) { d -= 1; if (d < 0) return false; d += o - (c - 1); } else { d += o - c; } if (d < 0) return false; } return d === 0; }); }
    res.tried = all.length;
    all.forEach(function(k){ var ls = k.split('').map(function(c){ return distinct[parseInt(c, 36)]; }); if (sig(p, ls) === base) res.valid.push(k); });
    p.dis.forEach(function(d){ var ls = lines.slice(); ls[d[0]] = d[1]; if (sig(p, ls) === base) res.badDis.push([d[1], d[0]]); });
    return res; }
  return { run: run };
})(); 1`);
if (__init && __init.__err) { console.log('INIT ERROR', __init.__err); process.exit(1); }
const out = [];
for (const p of input) { const t = Date.now(); const r = await b.ev(`window.__O.run(${JSON.stringify(p)})`); if (r && r.__err) { console.log("ERR", p.id, r.__err); out.push({ id: p.id, error: r.__err }); continue; } out.push(r); console.log(p.id, "valid", r.valid.length, "of", r.tried, "badDis", r.badDis.length, (Date.now() - t) + "ms"); }
fs.writeFileSync(process.argv[3], JSON.stringify(out)); b.close();
