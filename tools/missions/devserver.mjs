/* LOCAL DEV SERVER: serves the site AND runs the real netlify/functions/pycode.js with an in-memory database and pretend Google sign-in.
   A credential like "test:ada@socialcircleschools.org" signs in as that student; "test:randy.norman@socialcircleschools.org" is the teacher.
   Used by the game tests. usage: node tools/missions/devserver.mjs [port]   (default 8130) */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const mem = new Map();
let src = fs.readFileSync(path.join(ROOT, "netlify/functions/pycode.js"), "utf8");
src = src.replace(/^import \{ getStore \} from "@netlify\/blobs";\n/m, "const getStore = () => globalThis.__STORE;\n")
  .replace(/^import \{ withPySettings \} from "[^"]+";\n/m, "const withPySettings = (slot, rec) => rec;   /* the dev server ignores teacher-settings so tests control what is open */\n")
  .replace('from "./gamebank.js"', 'from "' + pathToFileURL(path.join(ROOT, "netlify/functions/gamebank.js")).href + '"')
  .replace(/async function verifyGoogleToken\(credential\) \{/, 'async function verifyGoogleToken(credential) { if (typeof credential === "string" && credential.startsWith("test:")) { const email = credential.slice(5).toLowerCase(); return { email, name: email.split("@")[0] }; }\n  return verifyGoogleTokenReal(credential); }\nasync function verifyGoogleTokenReal(credential) {')
  .replace('const isAdmin = (body) => body && body.pin === (process.env.ADMIN_PIN || "1234");', 'const isAdmin = (body) => body && body.pin === "1234";');
globalThis.__STORE = {
  async get(k) { return mem.has(k) ? JSON.parse(mem.get(k)) : null; },
  async setJSON(k, v) { mem.set(k, JSON.stringify(v)); return { modified: true }; },
  async getMetadata(k) { return mem.has(k) ? {} : null; },
  async delete(k) { mem.delete(k); },
  async list(o) { return { blobs: [...mem.keys()].filter((k) => k.startsWith(o.prefix || "")).map((key) => ({ key })) }; }
};
const tmp = path.join(ROOT, "netlify/functions/.pycode-dev.mjs"); fs.writeFileSync(tmp, src);
const handler = (await import(pathToFileURL(tmp).href)).default;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".py": "text/plain", ".json": "application/json", ".svg": "image/svg+xml" };
export function start(port) {
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url.startsWith("/api/pycode")) {
        const chunks = []; for await (const c of req) chunks.push(c);
        const r = await handler(new Request("http://localhost" + req.url, { method: req.method, headers: { "content-type": "application/json" }, body: req.method === "POST" ? Buffer.concat(chunks) : undefined }));
        res.writeHead(r.status, { "Content-Type": "application/json" }); res.end(await r.text()); return;
      }
      let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
      const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); res.end(fs.readFileSync(f));
    } catch (e) { res.writeHead(500); res.end(String(e.stack || e)); }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}
export { mem };
if (process.argv[1] === fileURLToPath(import.meta.url)) { const port = Number(process.argv[2]) || 8130; await start(port); console.log("dev server on http://localhost:" + port); }
