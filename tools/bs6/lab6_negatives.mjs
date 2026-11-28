/* Common student mistakes applied to every Unit 6 model solution: each mistaken page must score under 100. A mistake that still scores 100 is listed so it can be judged. node tools/bs6/lab6_negatives.mjs */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js", "bs-labs.js", "bs-labs-1.js", "bs-labs-2.js"].forEach((f) => require(D + f));
const SC = globalThis.U7_STEPCHECKS, LABS = SC.W.BS.LABS;
const nth = (re, f) => (s) => { const out = []; const g = new RegExp(re.source, "g" + (re.flags || "")); let m; while ((m = g.exec(s))) { const mm = m; out.push(s.slice(0, mm.index) + f(mm) + s.slice(mm.index + mm[0].length)); } return out; };
const BSCLS = /class="([^"]*)"/;
const HTMLF = {
  "a class token misspelled (one letter missing)": (s) => { const out = []; const g = /class="([^"]*)"/g; let m; while ((m = g.exec(s))) { m[1].split(" ").forEach((t, k) => { if (/^(col|btn|bg|text|fw|navbar|nav|card|form|mb|mt|p|container|row)/.test(t) && t.length > 3) { const w = m[1].split(" "); w[k] = t.slice(0, -1); out.push(s.slice(0, m.index) + 'class="' + w.join(" ") + '"' + s.slice(m.index + m[0].length)); } }); } return out; },
  "a Bootstrap class removed": (s) => { const out = []; const g = /class="([^"]*)"/g; let m; while ((m = g.exec(s))) { const w = m[1].split(" "); w.forEach((t, k) => { if (/^(col|btn|bg|text|fw|navbar|nav|card|form|mb|mt|p-|container|row)/.test(t)) { const v = w.filter((_, j) => j !== k); out.push(s.slice(0, m.index) + (v.length ? 'class="' + v.join(" ") + '"' : "") + s.slice(m.index + m[0].length)); } }); } return out; },
  "a dot in front of a class name": nth(/class="([^" ]+)"/, (m) => 'class=".' + m[1] + '"'),
  "two classes separated by a comma": nth(/class="([^" ]+) ([^" ]+)([^"]*)"/, (m) => 'class="' + m[1] + ", " + m[2] + m[3] + '"'),
  "the Bootstrap link missing": nth(/<link href="https:\/\/cdn[^>]*>\n/, () => ""),
  "the Bootstrap file name misspelled": nth(/bootstrap\.min\.css/, () => "bootstrap.min.cs"),
  "the Bootstrap link has http instead of https": nth(/href="https:\/\/cdn/, () => 'href="http://cdn'),
  "the Bootstrap link rel misspelled": nth(/(<link href="https:\/\/cdn[^>]*) rel="stylesheet"/, (m) => m[1] + ' rel="stylsheet"'),
  "the Bootstrap link has a closing tag": nth(/(<link href="https:\/\/cdn[^>]*>)/, (m) => m[1] + "</link>"),
  "a div closing tag missing": nth(/<\/div>\n/, () => "\n"),
  "a closing tag misspelled": nth(/<\/(div|p|h1|h2|h5|a|button|label|nav|form)>/, (m) => "</" + m[1] + "x>"),
  "a tag misspelled": nth(/<(div|nav|button|label|form|input|textarea|h5) /, (m) => "<" + m[1] + "x "),
  "a style attribute added": nth(/<(p|h1|div)( |>)/, (m) => "<" + m[1] + ' style="color: red"' + (m[2] === " " ? " " : ">")),
  "the row div replaced by a plain div": nth(/<div class="row">/, () => "<div>"),
  "the container div replaced by a plain div": nth(/<div class="container">/, () => "<div>"),
  "an attribute misspelled": nth(/ (href|src|alt|for|id|type)="/, (m) => " " + m[1] + "x=\""),
  "an attribute without quotes": nth(/ (href|src|for|id|type)="([^"]*)"/, (m) => " " + m[1] + "=" + m[2]),
  "the doctype missing": nth(/<!DOCTYPE html>\n/, () => ""),
  "a heading text typo": nth(/<h1([^>]*)>([^<]*)</, (m) => "<h1" + m[1] + ">" + m[2].replace(/e/, "ee") + "<"),
};
const CSSF = { "a closing brace missing": nth(/\}\n/, () => "\n"), "a colon missing": nth(/^  ([a-z-]+): /m, (m) => "  " + m[1] + " "), "a color misspelled": nth(/(color): ([a-z]+);/, (m) => m[1] + ": " + m[2] + "x;"), "the style.css file name misspelled": null };
let applied = 0; const holes = [];
for (const o of LABS) {
  const base = SC.score(o.id, o.model.html, o.model.css); if (base.pct !== 100) { console.log("MODEL NOT 100", o.id); continue; }
  for (const [fam, f] of Object.entries(HTMLF)) { let list = []; try { list = f(o.model.html); } catch (e) {} list.forEach((m, i) => { if (m === o.model.html) return; applied++; const r = SC.score(o.id, m, o.model.css); if (r.pct === 100) holes.push([o.id, fam + (list.length > 1 ? " #" + (i + 1) : "")]); }); }
  if (o.model.css) for (const [fam, f] of Object.entries(CSSF)) { if (!f) continue; let list = []; try { list = f(o.model.css); } catch (e) {} list.forEach((m, i) => { applied++; const r = SC.score(o.id, o.model.html, m); if (r.pct === 100) holes.push([o.id, "css: " + fam]); }); }
}
console.log("mistaken pages tried:", applied, "| still score 100:", holes.length);
const by = {}; holes.forEach(([id, f]) => (by[f] = by[f] || []).push(id)); Object.entries(by).forEach(([f, ids]) => console.log("  " + f + ": " + ids.join(", ")));
