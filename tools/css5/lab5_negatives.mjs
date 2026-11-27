/* Common student mistakes applied to every Unit 5 model solution (index.html + style.css): each mistaken page must score under 100.
   A mistake that still scores 100 is listed so it can be judged. Run: node tools/css5/lab5_negatives.mjs */
import { createRequire } from "module";
const require = createRequire(import.meta.url), D = "/Users/randynorman/bank-points/ist/unit-6/";
globalThis.window = undefined;
["html-check.js", "lab-lessons.js", "step-checks.js", "step-checks-a.js", "step-checks-b.js", "step-checks-w.js", "step-checks-w2.js", "css-labs.js", "css-labs-1.js", "css-labs-2.js", "css-labs-3.js"].forEach((f) => require(D + f));
const SC = globalThis.U7_STEPCHECKS, LABS = SC.W.CSS.LABS;
const nth = (re, f) => (s) => { const out = []; let m; const g = new RegExp(re.source, "g" + (re.flags || "")); const all = []; while ((m = g.exec(s))) all.push(m); all.forEach((mm, i) => out.push(s.slice(0, mm.index) + f(mm) + s.slice(mm.index + mm[0].length))); return out; };
const CSSF = {
  "a closing brace missing": nth(/\}\n/, () => "\n"),
  "a closing brace typed as ]": nth(/\}\n/, () => "]\n"),
  "an opening brace missing": nth(/ \{\n/, () => "\n"),
  "a colon missing": nth(/^  ([a-z-]+): /m, (m) => "  " + m[1] + " "),
  "a semicolon missing": nth(/;\n  /, () => "\n  "),
  "a property misspelled": nth(/^  ([a-z]+)([a-z-]*): /m, (m) => "  " + m[1] + "x" + m[2] + ": "),
  "px missing": nth(/(\d+)px/, (m) => m[1]),
  "a space before px": nth(/(\d+)px/, (m) => m[1] + " px"),
  "a class dot missing": nth(/^\.([a-z]+)/m, (m) => m[1]),
  "a class dot typed as a hash": nth(/^\.([a-z]+)/m, (m) => "#" + m[1]),
  "an id hash typed as a dot": nth(/^#([a-z]+)/m, (m) => "." + m[1]),
  "a space inside a pseudo-class": nth(/:(hover|focus|active)/, (m) => " :" + m[1]),
  "a pseudo-class misspelled": nth(/:(hover|focus|active)/, (m) => ":" + m[1] + "s"),
  "quotes around a color": nth(/: ([a-z]+);/, (m) => ': "' + m[1] + '";'),
  "a color misspelled": nth(/(color): (navy|gold|red|green|blue|white|lightblue|tomato|yellow|teal|gray|orange|black);/, (m) => m[1] + ": " + m[2] + "x;"),
  "a style tag inside the css": (s) => ["<style>\n" + s + "</style>\n"],
  "a rule's selector misspelled": nth(/^([a-z]+)( \{)/m, (m) => m[1] + "x" + m[2]),
  "display value misspelled": nth(/display: (flex|grid)/, (m) => "display: " + m[1] + "s"),
  "justify-content value misspelled": nth(/(justify-content|align-items): ([a-z-]+)/, (m) => m[1] + ": " + m[2] + "x"),
  "fr typed as f": nth(/(\d)fr/, (m) => m[1] + "f"),
  "grid columns separated by commas": nth(/grid-template-columns: ([^;]+);/, (m) => "grid-template-columns: " + m[1].replace(/ /g, ", ") + ";"),
  "transition time without s": nth(/transition: ([a-z-]+) (\d*\.?\d+)s/, (m) => "transition: " + m[1] + " " + m[2]),
  "transition only in the hover rule": (s) => /transition/.test(s) && /:hover/.test(s) ? [s.replace(/  transition: [^;]+;\n/, "").replace(/(:hover \{\n)/, "$1  transition: color 0.3s;\n")] : [],
};
const HTMLF = {
  "the link tag missing": nth(/<link [^>]*>\n/, () => ""),
  "the link file name misspelled": nth(/href="style\.css"/, () => 'href="styles.css"'),
  "the link rel misspelled": nth(/rel="stylesheet"/, () => 'rel="stylsheet"'),
  "the link has a closing tag": nth(/(<link [^>]*>)/, (m) => m[1] + "</link>"),
  "the link ends with a slash": nth(/<link ([^>]*)>/, (m) => "<link " + m[1] + " />"),
  "the link is in the body": (s) => s.includes("<link") ? [s.replace(/<link [^>]*>\n/, "").replace("<body>\n", '<body>\n<link rel="stylesheet" href="style.css">\n')] : [],
  "a style tag instead of the link": (s) => s.includes("<link") ? [s.replace(/<link [^>]*>/, "<style>\n</style>")] : [],
  "a dot inside a class attribute": nth(/class="([^"]+)"/, (m) => 'class=".' + m[1] + '"'),
  "a hash inside an id attribute": nth(/id="([^"]+)"/, (m) => 'id="#' + m[1] + '"'),
  "two classes separated by a comma": nth(/class="(\w+) (\w+)"/, (m) => 'class="' + m[1] + ", " + m[2] + '"'),
  "a class attribute misspelled": nth(/ class="/, () => ' clas="'),
  "a closing tag missing": nth(/<\/(p|h1|div|a|li|ul|ol)>/, () => ""),
  "a tag misspelled": nth(/<(h1|body|title)>/, (m) => "<" + m[1] + "x>"),
  "the doctype missing": nth(/<!DOCTYPE html>\n/, () => ""),
  "a style attribute added": nth(/<p( |>)/, (m) => '<p style="color: red"' + m[1]),
};
let applied = 0; const holes = [];
for (const o of LABS) {
  const base = SC.score(o.id, o.model.html, o.model.css); if (base.pct !== 100) { console.log("MODEL NOT 100", o.id); continue; }
  for (const [fam, f] of Object.entries(CSSF)) { let list = []; try { list = f(o.model.css); } catch (e) {} list.forEach((m, i) => { if (m === o.model.css) return; applied++; const r = SC.score(o.id, o.model.html, m); if (r.pct === 100) holes.push([o.id, "css: " + fam + (list.length > 1 ? " #" + (i + 1) : "")]); }); }
  for (const [fam, f] of Object.entries(HTMLF)) { let list = []; try { list = f(o.model.html); } catch (e) {} list.forEach((m, i) => { if (m === o.model.html) return; applied++; const r = SC.score(o.id, m, o.model.css); if (r.pct === 100) holes.push([o.id, "html: " + fam + (list.length > 1 ? " #" + (i + 1) : "")]); }); }
}
console.log("mistaken pages tried:", applied, "| still score 100:", holes.length);
const by = {}; holes.forEach(([id, f]) => (by[f] = by[f] || []).push(id)); Object.entries(by).forEach(([f, ids]) => console.log("  " + f + ": " + ids.join(", ")));
