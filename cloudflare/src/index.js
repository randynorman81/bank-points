// Cloudflare Worker: serves the site's files (via the ASSETS binding) and the /api/* backend.
// The API handlers are the same files Netlify runs (netlify/functions/*.js).
import { env } from "cloudflare:workers";
import data from "../../netlify/functions/data.js";
import code from "../../netlify/functions/code.js";
import announcements from "../../netlify/functions/announcements.js";
import latework from "../../netlify/functions/latework.js";
import { getStore } from "./blobs.js";

const json = (obj, status) => new Response(JSON.stringify(obj), { status: status || 200, headers: { "Content-Type": "application/json" } });

// One-time data migration from Netlify Blobs (admin PIN required). Delete after the move.
async function importData(req) {
  let body;
  try { body = await req.json(); } catch (e) { return json({ error: "Malformed request" }, 400); }
  if (!env.ADMIN_PIN || body.pin !== env.ADMIN_PIN) return json({ error: "Invalid PIN" }, 403);
  const store = getStore({ name: String(body.store || "") });
  let n = 0;
  for (const it of body.items || []) { await store.setJSON(String(it.key), it.value); n++; }
  return json({ ok: true, imported: n });
}

export default {
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/api/_import" && req.method === "POST") return importData(req);
    if (path === "/api/announcements") return announcements(req);
    if (path === "/api/code") return code(req);
    if (path === "/api/latework") return latework(req);
    if (path.startsWith("/api/")) return data(req);
    if (path === "/sat") return env.ASSETS.fetch(new Request(new URL("/sat-english/", req.url), req));
    return env.ASSETS.fetch(req);
  }
};
