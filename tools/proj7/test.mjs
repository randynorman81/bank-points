import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
import { site } from "./gen.mjs";
const b = await launch(9695, 1000, 800);
await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/ist/unit-10/project-check.html" }); await b.sleep(1500);
const run = async (files) => await b.ev(`JSON.stringify(PCHECK.run(${JSON.stringify(files)}))`).then((j) => JSON.parse(j));
const failed = (r) => r.filter((x) => !x.pass).map((x) => x.id).sort();
let bad = 0;
const good = await run(site());
console.log("good site fails:", JSON.stringify(failed(good)), "of", good.length);
if (failed(good).length) bad++;
const cases = [
  ["only 2 pages", { pages: ["index.html", "contact.html"] }, null],
  ["page title 'Document'", { titleBad: "about.html" }, ["titles"]],
  ["no h1", { noH1: "gallery.html" }, ["h1"]],
  ["different stylesheet on one page", { extraCss: "contact.html" }, ["look"]],
  ["no italic", { noItalic: 1 }, ["text"]],
  ["no list", { noList: 1 }, ["list"]],
  ["one image only", { oneImg: 1 }, ["images"]],
  ["image without alt", { imgNoAlt: 1 }, ["images"]],
  ["image without width", { imgNoWidth: 1 }, ["images"]],
  ["no table", { noTable: 1 }, ["table"]],
  ["no padding in css", { noPadding: 1 }, ["boxmodel"]],
  ["no css file", { noCssFile: 1 }, ["boxmodel", "class", "ext-css", "flexgrid", "hover", "id"]],
  ["style tag on a page", { styleTag: "about.html" }, ["no-inline"]],
  ["no class rule", { noClass: 1 }, ["class"]],
  ["no id rule", { noId: 1 }, ["id"]],
  ["hover without transition", { hoverNoTransition: 1 }, ["hover"]],
  ["no flex/grid", { noFlex: 1 }, ["flexgrid"]],
  ["no bootstrap link on one page", { noBs: "contact.html" }, ["bs-link", "look"]],
  ["one page has no navbar", { noNavbar: "gallery.html" }, ["back-links", "nav-links", "nav-same", "navbar"]],
  ["nav missing a link on one page", { navMissing: { page: "about.html", link: "gallery.html" } }, ["nav-links", "nav-same"]],
  ["nav link to a page that does not exist", { navBad: "contact.html" }, ["nav-links", "nav-same"]],
  ["only one card", { oneCard: 1 }, ["cards"]],
  ["form field without label", { formNoLabel: 1 }, ["form"]],
  ["form without submit", { formNoSubmit: 1 }, ["form"]],
];
for (const [name, o, want] of cases) {
  const got = failed(await run(site(o)));
  if (want === null) { if (got.indexOf("pages") < 0) { bad++; console.log("FAIL", name, "pages check should fail", got); } continue; }
  const ok = JSON.stringify(got) === JSON.stringify(want.slice().sort());
  if (!ok) { bad++; console.log("FAIL", name, "got", JSON.stringify(got), "want", JSON.stringify(want.slice().sort())); }
}
// exactly 3 pages is enough
const three = failed(await run(site({ pages: ["index.html", "about.html", "gallery.html"] }))); if (three.indexOf("pages") > -1) { bad++; console.log("FAIL 3 pages should pass"); }
// image width through a CSS rule counts
const w = failed(await run(site({ imgNoWidth: 1, imgWidthCss: 1 }))); if (w.length) { bad++; console.log("FAIL css image width", w); }
// pasted names with folders / case
const z = site(); z.forEach((f) => { f.name = "My Site/" + f.name.toUpperCase().replace(".HTML", ".html"); }); const zf = failed(await run(z)); if (zf.length) { bad++; console.log("FAIL path/case handling", zf); }
// empty input
const e = await run([]); if (e.filter((x) => x.pass).length > 0) { console.log("empty input passes:", e.filter((x) => x.pass).map((x) => x.id)); bad++; }
// UI smoke
await b.ev(`document.getElementById('go').click()`);
const ui = await b.ev(`document.getElementById('out').innerText`); if (!/Add your files first/.test(ui)) { bad++; console.log("UI empty message missing"); }
console.log("cases:", cases.length + 3, "failures:", bad, "errors:", JSON.stringify(b.errs));
b.close(); process.exit(bad ? 1 : 0);
