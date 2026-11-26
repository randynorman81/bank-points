/* Real-browser check of the walkthrough "Try it" claims and the model pages (needs Chrome and the dev server: node tools/missions/devserver.mjs 8124).
   Each claim loads a stage page (lab_stages.mjs) or a model (lab_models.mjs) in a real browser and compares a computed fact. Run: node tools/ist/lab_chrome.mjs */
import { createRequire } from "module";
import { STAGES } from "./lab_stages.mjs";
import { MODELS } from "./lab_models.mjs";
const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9651, 1000, 800);
await b.send("Page.navigate", { url: "http://localhost:8124/ist/unit-6/index.html" }); await b.sleep(1000);   /* same origin as the pictures, so the iframes can load them */
const LOCAL = "http://localhost:8124/ist/unit-6/lab/";
await b.ev(`window.__load = async function(html, w){ var old = document.getElementById('f'); if (old) old.remove(); var f = document.createElement('iframe'); f.id = 'f'; f.style.cssText='width:'+(w||800)+'px;height:600px;border:0'; document.body.appendChild(f);
  await new Promise(function(r){ f.onload = r; f.srcdoc = html; }); await new Promise(function(r){ setTimeout(r, 400); });
  var imgs = Array.prototype.slice.call(f.contentDocument.images); await Promise.all(imgs.map(function(i){ return i.complete ? 1 : new Promise(function(r){ i.onload = i.onerror = r; }); }));
  try { await f.contentDocument.fonts.ready; } catch(e){} return f; }`);
let bad = 0, n = 0;
const rgb = (r, g, bl) => `rgb(${r}, ${g}, ${bl})`;
const st = (id, k) => STAGES[id][k - 1];
async function claim(label, html, expr, expect, w) {
  n++;
  const got = await b.ev(`(async function(){ var f = await window.__load(${JSON.stringify(html.split("https://schscomputerscience.com/ist/unit-6/lab/").join(LOCAL))}, ${w || 800}); var d = f.contentDocument, W = f.contentWindow, q = function(s){ return d.querySelector(s); }, qa = function(s){ return Array.prototype.slice.call(d.querySelectorAll(s)); }, cs = function(e){ return W.getComputedStyle(e); }; return (${expr}); })()`);
  const ok = JSON.stringify(got) === JSON.stringify(expect);
  if (!ok) { bad++; console.log("FAIL", label, "\n   expected", JSON.stringify(expect), "\n   got     ", JSON.stringify(got)); }
}
/* 3.1 */
await claim("6.1w s1: empty body shows nothing, the title is in the tab", st("6.1w", 1), "[d.body.innerText.trim(), d.title]", ["", "Slice House"]);
await claim("6.1w s2: h1 shows the shop name, big and bold", st("6.1w", 2), "[q('h1').innerText, cs(q('h1')).fontWeight, parseFloat(cs(q('h1')).fontSize) > 24]", ["Slice House", "700", true]);
await claim("6.1w s4: extra blank lines change nothing", st("6.1w", 4).replace(/\n/g, "\n\n\n"), "qa('body > *').map(function(e){ return e.tagName + ':' + e.innerText; })", ["H1:Slice House", "H2:Our Story", "P:Slice House opened in 2019 with one oven and a big idea.", "H2:Our Menu", "P:We bake cheese, pepperoni, and veggie pizza every day."]);
/* 3.2 */
await claim("6.2w s2: h1 tomato only", st("6.2w", 2), "[cs(q('h1')).color, cs(q('h2')).color]", [rgb(255, 99, 71), rgb(0, 0, 0)]);
await claim("6.2w s3: h2 white on black", st("6.2w", 3), "[cs(q('h2')).color, cs(q('h2')).backgroundColor]", [rgb(255, 255, 255), rgb(0, 0, 0)]);
await claim("6.2w s4: hex p colors", st("6.2w", 4), "[cs(q('p')).color, cs(q('p')).backgroundColor]", [rgb(0, 51, 102), rgb(255, 238, 170)]);
await claim("6.2w s5: navy page, h1 stays tomato, p keeps its own colors", st("6.2w", 5), "[cs(d.body).backgroundColor, cs(d.body).color, cs(q('h1')).color, cs(q('p')).backgroundColor]", [rgb(0, 0, 128), rgb(255, 255, 255), rgb(255, 99, 71), rgb(255, 238, 170)]);
/* 3.3 */
await claim("6.20w s2: font sizes", st("6.20w", 2), "[cs(q('h1')).fontSize, cs(q('h3')).fontSize, cs(q('p')).fontSize]", ["48px", "24px", "18px"]);
await claim("6.20w s3: alignment", st("6.20w", 3), "[cs(q('h1')).textAlign, cs(q('h2')).textAlign, cs(q('p')).textAlign, cs(q('h3')).textAlign]", ["center", "center", "right", "start"]);
await claim("6.20w s4: letter case on the page", st("6.20w", 4), "[q('h1').innerText, q('h3').innerText, q('p').innerText]", ["SKYLINE CINEMA", "Friday Night Double Feature", "doors open at six. tickets are five dollars."]);
await claim("6.20w s1: an h3 is smaller than an h2", st("6.20w", 1), "[parseFloat(cs(q('h2')).fontSize) > parseFloat(cs(q('h3')).fontSize), parseFloat(cs(q('h3')).fontSize) > parseFloat(cs(q('p')).fontSize)]", [true, true]);
/* 3.4 */
await claim("6.3w s2: strong bold and em italic", st("6.3w", 2), "[cs(q('strong')).fontWeight, cs(q('em')).fontStyle, cs(qa('p')[0]).fontWeight]", ["700", "italic", "400"]);
await claim("6.3w s3: br splits the line", st("6.3w", 3), "[qa('p')[1].innerText]", ["Open daily\n7 AM to 5 PM"]);
await claim("6.3w s3: without br it stays on one line", st("6.3w", 2), "[qa('p')[1].innerText]", ["Open daily 7 AM to 5 PM"]);
await claim("6.3w s4: two hr lines, one under h1 and one before the last p", st("6.3w", 4), "qa('body > *').map(function(e){ return e.tagName; }).join(',')", "H1,HR,P,P,HR,P");
await claim("6.3w s5: only Green Giant is green", st("6.3w", 5), "[cs(q('span')).color, q('span').innerText, cs(qa('p')[2]).color]", [rgb(0, 128, 0), "Green Giant", rgb(0, 0, 0)]);
/* 3.5 */
await claim("6.35w s3: heading uses Pacifico, p stays default", st("6.35w", 3), "[cs(q('h1')).fontFamily, d.fonts.check('30px Pacifico'), cs(qa('p')[0]).fontFamily.indexOf('Open Sans') < 0]", ['Pacifico', true, true]);
await claim("6.35w s2: loading a font alone changes nothing", st("6.35w", 2), "[cs(q('h1')).fontFamily.indexOf('Pacifico') < 0, d.fonts.check('30px Pacifico')]", [true, false]);
await claim("6.35w s5: only the span is Pacifico in p2", st("6.35w", 5), "[cs(q('span')).fontFamily, cs(qa('p')[1]).fontFamily, d.fonts.check('16px \"Open Sans\"')]", ["Pacifico", '"Open Sans"', true]);
/* 3.6 */
await claim("6.4w s2: h1 box and dotted p", st("6.4w", 2), "[cs(q('h1')).borderTopStyle + ' ' + cs(q('h1')).borderTopWidth + ' ' + cs(q('h1')).borderTopColor, cs(qa('p')[0]).borderLeftStyle + ' ' + cs(qa('p')[0]).borderLeftWidth]", ["solid 4px " + rgb(0, 0, 128), "dotted 3px"]);
await claim("6.4w s3: double, groove, ridge", st("6.4w", 3), "[1,2,3].map(function(i){ return cs(qa('p')[i]).borderTopStyle + ' ' + cs(qa('p')[i]).borderTopWidth; })", ["double 6px", "groove 5px", "ridge 5px"]);
await claim("6.4w s4: one-sided borders", st("6.4w", 4), "[cs(q('h2')).borderBottomStyle, cs(q('h2')).borderTopStyle, cs(qa('p')[4]).borderLeftStyle + ' ' + cs(qa('p')[4]).borderLeftWidth, cs(qa('p')[4]).borderRightStyle]", ["dashed", "none", "solid 8px", "none"]);
await claim("6.4w: border-top moves the line above", st("6.4w", 4).replace("border-bottom: 3px dashed red", "border-top: 3px dashed red"), "[cs(q('h2')).borderTopStyle, cs(q('h2')).borderBottomStyle]", ["dashed", "none"]);
/* 3.7 */
await claim("6.7w s3: the rocket loads and is large (more than 200px wide at natural size)", st("6.7w", 3), "[q('img').naturalWidth, q('img').complete, q('img').offsetWidth > 200]", [300, true, true]);
await claim("6.7w s4: widths: 200px and 50% of the page", st("6.7w", 4), "[qa('img')[0].offsetWidth, Math.round(qa('img')[1].offsetWidth / d.body.clientWidth * 100)]", [200, 50]);
await claim("6.7w s4: the planet shrinks with the page, the rocket does not", st("6.7w", 4), "[qa('img')[0].offsetWidth, qa('img')[1].offsetWidth < 250]", [200, true], 400);
await claim("6.7w s2: the favicon link is in the head and points at the rocket", st("6.7w", 2), "[d.querySelector('head > link[rel=icon]') !== null, d.querySelector('link[rel=icon]').href.indexOf('rocket.svg') > 0]", [true, true]);
/* 3.8 */
await claim("6.75w s2: pizza emoji is text in the heading", st("6.75w", 2), "[q('h1').innerText, q('h1 img') === null]", ["Pizza Night 🍕", true]);
await claim("6.75w s4: stars colors and size", st("6.75w", 4), "[qa('span').map(function(s){ return s.innerText + ' ' + cs(s).color + ' ' + cs(s).fontSize; })]", [["★★★★ " + rgb(255, 215, 0) + " 30px", "★ " + rgb(128, 128, 128) + " 30px"]]);
await claim("6.75w s5: footer centered and small, symbols present", st("6.75w", 5), "[qa('p')[2].innerText, cs(qa('p')[2]).textAlign, cs(qa('p')[2]).fontSize]", ["© 2027 Pizza Night™ ♥ Made with love", "center", "14px"]);
await claim("6.75w: an emoji grows with font-size like a letter", st("6.75w", 2).replace("<h1>", '<h1 style="font-size: 60px">'), "[cs(q('h1')).fontSize]", ["60px"]);
/* 3.9 */
await claim("6.6w s2: the link", st("6.6w", 2), "[q('a').href, q('a').target, q('a').innerText]", ["https://www.nasa.gov/", "_blank", "NASA"]);
await claim("6.6w s2: forgetting </a> makes the rest of the page a link", st("6.6w", 2).replace("NASA</a> to see", "NASA to see"), "[qa('a').length > 1 || qa('p')[1].querySelector('a') !== null]", [true]);
await claim("6.6w s3: bold link", st("6.6w", 3), "[q('p a strong') !== null, cs(q('p a strong')).fontWeight]", [true, "700"]);
await claim("6.6w s4: heading link", st("6.6w", 4), "[q('h2 a').href, q('h2 a').target]", ["https://en.wikipedia.org/wiki/Moon", "_blank"]);
await claim("6.6w s5: picture link: img inside a under the h1, 150px wide", st("6.6w", 5), "[q('h1 + a > img') !== null, q('h1 + a').target, q('img').offsetWidth]", [true, "_blank", 150]);
/* 3.10 */
await claim("6.5w s2: a ul has bullets, li stack", st("6.5w", 2), "[cs(qa('ul')[0]).listStyleType, qa('ul li').map(function(l){ return l.offsetTop; }).every(function(t, i, a){ return i === 0 || t > a[i - 1]; })]", ["disc", true]);
await claim("6.5w s3: square", st("6.5w", 3), "[cs(qa('ul')[0]).listStyleType, cs(qa('ul li')[0]).listStyleType]", ["square", "square"]);
await claim("6.5w s4: ol upper-roman, strong/em in item 1", st("6.5w", 4), "[cs(q('ol')).listStyleType, q('ol li strong').innerText, q('ol li em').innerText, cs(q('ol li strong')).fontWeight, cs(q('ol li em')).fontStyle]", ["upper-roman", "Build", "a small fire", "700", "italic"]);
await claim("6.5w s5: menu in a row, no bullets", st("6.5w", 5), "(function(){ var m = qa('ul')[1], li = Array.prototype.slice.call(m.querySelectorAll('li')); return [cs(m).listStyleType, li.length, li.every(function(l){ return l.offsetTop === li[0].offsetTop; }), li.map(function(l){ return cs(l).display; }).join()]; })()", ["none", 3, true, "inline,inline,inline"]);
await claim("6.5w s5: removing display inline from one li drops it to its own line", st("6.5w", 5).replace('<li style="display: inline">About</li>', "<li>About</li>"), "(function(){ var m = qa('ul')[1], li = Array.prototype.slice.call(m.querySelectorAll('li')); return [li[1].offsetTop > li[0].offsetTop, li[2].offsetTop > li[0].offsetTop]; })()", [true, true]);
/* all the models render with no broken piece: every image loaded, no empty page */
for (const [id, html] of Object.entries(MODELS)) {
  n++;
  const got = await b.ev(`(async function(){ var f = await window.__load(${JSON.stringify(html.split("https://schscomputerscience.com/ist/unit-6/lab/").join(LOCAL))}); var d = f.contentDocument; return [d.body.innerText.trim().length > 20 || d.images.length > 0, Array.prototype.every.call(d.images, function(i){ return i.naturalWidth > 0; }), d.title.length > 3]; })()`);
  if (JSON.stringify(got) !== "[true,true,true]") { bad++; console.log("FAIL model", id, JSON.stringify(got)); }
}
console.log("claims checked:", n, "failures:", bad);
b.close(); process.exit(bad ? 1 : 0);
