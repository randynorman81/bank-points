// Cloudflare Worker: serves the site's files (via the ASSETS binding) and the /api/* backend.
// The API handlers are the same files Netlify runs (netlify/functions/*.js).
import { env } from "cloudflare:workers";
import data from "../../netlify/functions/data.js";
import code from "../../netlify/functions/code.js";
import announcements from "../../netlify/functions/announcements.js";
import pycode from "../../netlify/functions/pycode.js";
import arduinocode from "../../netlify/functions/arduinocode.js";
import arena from "../../netlify/functions/arena.js";
import latework from "../../netlify/functions/latework.js";
import packetquest from "../../netlify/functions/packetquest.js";
import gdoc from "./gdoc.js";
import { runAwards } from "./awards.js";

export default {
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === "/api/announcements") return announcements(req);
    if (path === "/api/code") return code(req);
    if (path === "/api/pycode") return pycode(req);
    if (path === "/api/arduinocode") return arduinocode(req);
    if (path === "/api/arena") return arena(req);
    if (path === "/api/latework") return latework(req);
    if (path === "/api/packetquest") return packetquest(req);
    if (path === "/api/gdoc") return gdoc(req);
    if (path.startsWith("/api/")) return data(req);
    if (path === "/sat") return env.ASSETS.fetch(new Request(new URL("/sat-english/", req.url), req));
    return env.ASSETS.fetch(req);
  },
  /* cron trigger (wrangler.toml): runs the bank-point award rules in teacher-settings/awards.js */
  async scheduled(event, envArg, ctx) {
    ctx.waitUntil(runAwards(event.scheduledTime).catch((e) => console.log("awards failed", e && e.message)));
  }
};
