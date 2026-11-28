// prints the multiple-choice items whose right answer is clearly the longest, with their options, so they can be rewritten
import fs from "fs"; import path from "path"; import { pathToFileURL } from "url";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..");
const KEY = (await import(pathToFileURL(path.join(ROOT, "netlify/functions/istlab-key.js")).href)).default;
const win = {}; new Function("window", fs.readFileSync(path.join(ROOT, "ist/lab/data.js"), "utf8"))(win);
const only = process.argv.slice(2);
for (const [id, L] of Object.entries(KEY.lessons)) { if (only.length && only.indexOf(id) < 0) continue;
  for (const kind of ["w", "a"]) { if (!L[kind]) continue; const items = win.ISTLAB.lessons[id][kind].steps.flatMap((s) => s.items);
    L[kind].items.forEach((k, i) => { if (k.type !== "mc") return; const p = items[i], lens = p.opts.map((o) => o.length), mx = Math.max(...lens.filter((_, j) => j !== k.a));
      if (lens[k.a] > 1.25 * mx) console.log(id + kind, k.id, "|", p.opts.map((o, j) => (j === k.a ? "*" : "") + o).join("  ||  ")); }); } }
