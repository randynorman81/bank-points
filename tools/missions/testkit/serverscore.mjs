/* loads the REAL scoreCode / splitCode from netlify/functions/pycode.js, so the tests grade exactly like the live server */
import fs from "fs";
let src = fs.readFileSync(new URL("../../../netlify/functions/pycode.js", import.meta.url), "utf8");
src = src.replace(/^import \{ getStore \} from "@netlify\/blobs";\n/m, "const getStore = () => ({});\n").replace(/^import \{ withPySettings, repoSlots, OPEN_EVERYTHING \} from "[^"]+";\n/m, "const withPySettings = (s, r) => r;\nconst repoSlots = () => [];\nconst OPEN_EVERYTHING = false;\n").replace('from "./gamebank.js"', 'from "' + new URL("../../../netlify/functions/gamebank.js", import.meta.url).href + '"');
src += "\nexport { scoreCode, splitCode, passMinOf, slotPart, orderKey };\n";
fs.writeFileSync(new URL("./_pycode_copy.mjs", import.meta.url), src);
const m = await import("./_pycode_copy.mjs");
export const { scoreCode, splitCode, passMinOf, slotPart, orderKey } = m;
