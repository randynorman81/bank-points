// Local test server: serves the site's static files and /api/istlab with in-memory storage. Fake Google tokens look like  NAME.<base64 {exp,email?}>.s
//   node --import ./tools/istlab/register.mjs tools/istlab/devserver.mjs 8799
import http from "http"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const realFetch = globalThis.fetch;
globalThis.fetch = async (u, o) => {
  if (String(u).startsWith("https://oauth2.googleapis.com/tokeninfo")) {
    const tok = decodeURIComponent(String(u).split("id_token=")[1] || ""), parts = tok.split(".");
    let p = {}; try { p = JSON.parse(Buffer.from(parts[1], "base64").toString()); } catch (e) { return { ok: false }; }
    const name = parts[0];
    return { ok: true, json: async () => ({ aud: "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com", email_verified: "true", hd: "socialcircleschools.org", email: p.email || (name + "@socialcircleschools.org"), name: "Kid " + name }) };
  }
  return realFetch(u, o);
};
const handler = (await import("../../netlify/functions/istlab.js")).default;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".pdf": "application/pdf" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/istlab") {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await handler(new Request("http://x/api/istlab", { method: req.method, body: req.method === "POST" ? Buffer.concat(chunks) : undefined }));
    res.writeHead(r.status, { "Content-Type": "application/json" }); res.end(await r.text()); return;
  }
  let f = path.join(ROOT, decodeURIComponent(url.pathname)); if (f.endsWith("/")) f += "index.html";
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
}).listen(+process.argv[2] || 8799, () => console.log("istlab dev server on", process.argv[2] || 8799));
