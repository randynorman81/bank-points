import { getStore } from "@netlify/blobs";

// TEMPORARY: used once to copy every record to Cloudflare. Delete this file after the move.
// POST { pin, store, action: "list" }            -> { keys: [...] }
// POST { pin, store, action: "get", keys: [...] } -> { items: [{ key, value }] }
const STORES = ["bank-points", "unit7-code", "announcements", "latework"];
const H = { "Content-Type": "application/json" };

export default async (req) => {
  const out = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: H });
  if (req.method !== "POST") return out({ error: "POST only" }, 405);
  let b; try { b = await req.json(); } catch (e) { return out({ error: "Malformed" }, 400); }
  if (b.pin !== (process.env.ADMIN_PIN || "1234")) return out({ error: "Invalid PIN" }, 403);
  if (STORES.indexOf(b.store) < 0) return out({ error: "Unknown store" }, 400);
  const store = getStore({ name: b.store, consistency: "strong" });
  if (b.action === "list") {
    const res = await store.list();
    return out({ keys: (res.blobs || []).map((x) => x.key) });
  }
  if (b.action === "get") {
    const items = [];
    for (const key of (b.keys || []).slice(0, 50)) {
      const value = await store.get(key, { type: "json" });
      if (value !== null) items.push({ key, value });
    }
    return out({ items });
  }
  return out({ error: "Unknown action" }, 400);
};
