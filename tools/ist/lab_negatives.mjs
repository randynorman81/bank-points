/* Common student mistakes applied to every model solution: each mistaken page must score under 100 (a mistake that still scores 100 is listed so it can be judged: a real hole, or a choice that is also fine in a browser).
   Run: node tools/ist/lab_negatives.mjs */
import { createRequire } from "module";
import { MODELS } from "./lab_models.mjs";
const require = createRequire(import.meta.url), D = "../../ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js"].forEach((f) => require(D + f));
const SC = globalThis.U7_STEPCHECKS;
const FAM = {
  "tag left open (a closing tag deleted)": (s) => { const m = [...s.matchAll(/<\/(p|h1|h2|h3|li|strong|em|span|a|ul|ol)>/g)]; return m.map((x) => s.slice(0, x.index) + s.slice(x.index + x[0].length)); },
  "tag misspelled": (s) => [s.replace("<body", "<boddy"), s.replace("<title>", "<titel>"), s.replace(/<h2/, "<h22")],
  "tag names cross": (s) => { const m = s.match(/<(strong|em|span|a)\b[^>]*>[^<]*<(strong|em|span|a)\b/); return m ? [s.replace(/<\/(strong|em|span)>(<\/a>)/, "$2</$1>")] : []; },
  "style quote missing": (s) => [s.replace(/style="([^"]*)"/, 'style="$1')],
  "style uses single quotes": (s) => [s.replace(/style="([^"']*)"/, "style='$1'")],
  "style colon missing": (s) => [s.replace(/style="([a-z-]+): /, 'style="$1 ')],
  "semicolon missing between two styles": (s) => { const m = s.match(/style="[^"]*?;\s/); return m ? [s.replace(/(style="[^"]*?);\s/, "$1 ")] : []; },
  "two style attributes": (s) => { const m = s.match(/<(\w+) style="([^"]*;[^"]*)"/); return m ? [s.replace(/<(\w+) style="([^";]*);\s*([^"]*)"/, '<$1 style="$2" style="$3"')] : []; },
  "px missing": (s) => [s.replace(/(font-size|width): (\d+)px/, "$1: $2")],
  "space before px": (s) => [s.replace(/(font-size|width): (\d+)px/, "$1: $2 px")],
  "misspelled property": (s) => [s.replace(/background-color/, "backgroundcolor"), s.replace(/text-align/, "text-allign"), s.replace(/font-size/, "fontsize"), s.replace(/border/, "boarder")],
  "misspelled value": (s) => [s.replace(/uppercase/, "uppercas"), s.replace(/center/, "centre"), s.replace(/solid/, "soild")],
  "unknown color name": (s) => [s.replace(/color: (tomato|navy|white|green|gold|orange|black)/, "color: tomatoo")],
  "hash missing on hex": (s) => [s.replace(/(color: )#([0-9a-fA-F]{6})/, "$1$2")],
  "b and i instead of strong and em": (s) => [s.replace(/<strong>/g, "<b>").replace(/<\/strong>/g, "</b>"), s.replace(/<em>/g, "<i>").replace(/<\/em>/g, "</i>")],
  "br or hr closed": (s) => [s.replace(/<br>/, "<br></br>"), s.replace(/<hr>/, "<hr></hr>"), s.replace(/<br>/, "<br/>"), s.replace(/<hr>/, "<hr/>")],
  "img closed": (s) => [s.replace(/(<img [^>]*>)/, "$1</img>"), s.replace(/(<img [^>]*?)>/, "$1/>")],
  "img without alt": (s) => [s.replace(/ alt="[^"]*"/, "")],
  "img without src": (s) => [s.replace(/ src="[^"]*"/, "")],
  "img with width AND height": (s) => [s.replace(/(<img [^>]*style=")/, "$1height: 100px; ")],
  "link without https": (s) => [s.replace(/href="https:\/\//, 'href="')],
  "link target misspelled": (s) => [s.replace(/target="_blank"/, 'target="blank"'), s.replace(/target="_blank"/, "target=_blank")],
  "link has no closing tag": (s) => [s.replace(/<\/a>/, "")],
  "link attribute without quotes": (s) => [s.replace(/href="([^"]*)"/, "href=$1")],
  "text directly inside a list": (s) => [s.replace(/<li>/, "<li>").replace(/<ul([^>]*)>\n<li/, "<ul$1>\nStuff\n<li")],
  "li outside any list": (s) => [s.replace(/<\/ul>/, "</ul>\n<li>Stray</li>")],
  "list style on the li": (s) => [s.replace(/<ul style="list-style-type: (\w+)">/, '<ul>').replace(/<li>/, '<li style="list-style-type: square">')],
  "doctype missing": (s) => [s.replace(/<!DOCTYPE html>\n/, "")],
  "doctype misspelled": (s) => [s.replace("<!DOCTYPE html>", "<!DOCTYPE htlm>"), s.replace("<!DOCTYPE html>", "<DOCTYPE html>")],
  "title outside head": (s) => [s.replace(/<title>[^<]*<\/title>\n/, "").replace("<body", "<title>x</title>\n<body")],
  "body before head": (s) => [s.replace(/<head>[\s\S]*<\/head>\n/, "")],
  "heading text wrong case": (s) => [s.replace(/<h1([^>]*)>([^<]*)</, (m, a, t) => "<h1" + a + ">" + t.toLowerCase() + "<")],
  "heading text has a typo": (s) => [s.replace(/<h1([^>]*)>([^<]*)</, (m, a, t) => "<h1" + a + ">" + t.replace(/e/, "ee") + "<")],
  "padding or margin without px": (s) => [s.replace(/(padding|margin): (\d+)px/, "$1: $2")],
  "padding misspelled": (s) => [s.replace(/padding/, "pading"), s.replace(/margin/, "margn")],
  "hex without #": (s) => [s.replace(/color: #([0-9A-Fa-f]{6})/, "color: $1")],
  "hex too short": (s) => [s.replace(/color: #([0-9A-Fa-f]{6})/, (m, h) => "color: #" + h.slice(0, 5))],
  "display misspelled": (s) => [s.replace(/inline-block/, "inlineblock"), s.replace(/display: block/, "display: blok")],
  "vertical-align misspelled": (s) => [s.replace(/vertical-align: top/, "vertical-aligne: top"), s.replace(/vertical-align: top/, "vertical-align: topp")],
  "div not closed": (s) => [s.replace(/<\/div>/, "")],
  "td outside a row": (s) => [s.replace(/<tr>\n<td>/, "<td>").replace(/<\/td>\n<\/tr>/, "</td>")],
  "tr closed with td": (s) => [s.replace(/<\/tr>/, "</td>")],
  "a cell missing from a row": (s) => [s.replace(/<td>[^<]*<\/td>\n(<\/tr>)/, "$1")],
  "th closed with td": (s) => [s.replace(/<\/th>/, "</td>")],
  "table closed wrong": (s) => [s.replace(/<\/table>/, "</tabel>")],
  "columns wider than 98%": (s) => [s.replace(/width: 45%/g, "width: 55%").replace(/width: 30%/g, "width: 55%").replace(/width: 60%/g, "width: 55%")],
  "height without px": (s) => [s.replace(/height: (\d+)px/, "height: $1")],
  "emoji inside the tag": (s) => [s.replace(/<h1([^>]*)>/, "<h1$1 🍕>")],
  "paragraph inside a heading": (s) => [s.replace(/<h1([^>]*)>([^<]*)<\/h1>/, "<h1$1><p>$2</p></h1>")],
};
let bad = 0, applied = 0, holes = [];
for (const [id, src] of Object.entries(MODELS)) {
  for (const [fam, f] of Object.entries(FAM)) {
    let list = []; try { list = f(src); } catch (e) { list = []; }
    list.forEach((m, i) => { if (m === src) return; applied++; const r = SC.score(id, m, ""); if (r && r.pct === 100) holes.push(id + " | " + fam + (list.length > 1 ? " #" + (i + 1) : "")); });
  }
}
console.log("mistaken pages tried:", applied, "| still score 100:", holes.length);
const byFam = {}; holes.forEach((h) => { const [id, f] = h.split(" | "); (byFam[f] = byFam[f] || []).push(id); });
Object.entries(byFam).forEach(([f, ids]) => console.log("  " + f + ": " + ids.join(", ")));
