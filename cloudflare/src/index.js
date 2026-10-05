// Cloudflare Worker: serves the site's files (via the ASSETS binding) and the /api/* backend.
// The API handlers are the same files Netlify runs (netlify/functions/*.js).
import { env } from "cloudflare:workers";
import data from "../../netlify/functions/data.js";
import code from "../../netlify/functions/code.js";
import announcements from "../../netlify/functions/announcements.js";
import latework from "../../netlify/functions/latework.js";

export default {
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/api/announcements") return announcements(req);
    if (path === "/api/code") return code(req);
    if (path === "/api/latework") return latework(req);
    if (path.startsWith("/api/")) return data(req);
    if (path === "/sat") return env.ASSETS.fetch(new Request(new URL("/sat-english/", req.url), req));
    return env.ASSETS.fetch(req);
  }
};
