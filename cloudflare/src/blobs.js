// Drop-in stand-in for the part of @netlify/blobs that the site's functions use,
// backed by Cloudflare D1 (small records, with etags for safe read-modify-write)
// and KV (the big image blobs, keys "img:..."). wrangler.toml aliases
// "@netlify/blobs" to this file, so netlify/functions/*.js run unchanged.
import { env } from "cloudflare:workers";

const isImg = (key) => key.startsWith("img:");
const newEtag = () => crypto.randomUUID();

export function getStore(opts) {
  const name = typeof opts === "string" ? opts : opts.name;
  const db = () => env.DB;

  async function rawGet(key) {
    if (isImg(key)) {
      const v = await env.IMAGES.get(name + "|" + key);
      return v == null ? null : { value: v, etag: "kv" };
    }
    const row = await db().prepare("SELECT value, etag FROM blobs WHERE store = ? AND key = ?").bind(name, key).first();
    return row ? { value: row.value, etag: row.etag } : null;
  }
  const parse = (v, type) => (type === "json" ? JSON.parse(v) : v);

  return {
    async get(key, o) {
      const r = await rawGet(key);
      return r ? parse(r.value, o && o.type) : null;
    },
    async getWithMetadata(key, o) {
      const r = await rawGet(key);
      return r ? { data: parse(r.value, o && o.type), etag: r.etag, metadata: {} } : null;
    },
    async getMetadata(key) {
      if (isImg(key)) { const v = await env.IMAGES.get(name + "|" + key); return v == null ? null : { etag: "kv", metadata: {} }; }
      const row = await db().prepare("SELECT etag FROM blobs WHERE store = ? AND key = ?").bind(name, key).first();
      return row ? { etag: row.etag, metadata: {} } : null;
    },
    async setJSON(key, val, o) {
      const text = JSON.stringify(val);
      if (isImg(key)) { await env.IMAGES.put(name + "|" + key, text); return { modified: true, etag: "kv" }; }
      const etag = newEtag();
      if (o && o.onlyIfNew) {
        const r = await db().prepare("INSERT OR IGNORE INTO blobs (store, key, value, etag) VALUES (?, ?, ?, ?)").bind(name, key, text, etag).run();
        return { modified: r.meta.changes > 0, etag };
      }
      if (o && o.onlyIfMatch) {
        const r = await db().prepare("UPDATE blobs SET value = ?, etag = ? WHERE store = ? AND key = ? AND etag = ?").bind(text, etag, name, key, o.onlyIfMatch).run();
        return { modified: r.meta.changes > 0, etag };
      }
      await db().prepare("INSERT INTO blobs (store, key, value, etag) VALUES (?, ?, ?, ?) ON CONFLICT(store, key) DO UPDATE SET value = excluded.value, etag = excluded.etag").bind(name, key, text, etag).run();
      return { modified: true, etag };
    },
    async delete(key) {
      if (isImg(key)) { await env.IMAGES.delete(name + "|" + key); return; }
      await db().prepare("DELETE FROM blobs WHERE store = ? AND key = ?").bind(name, key).run();
    },
    async list(o) {
      const prefix = (o && o.prefix) || "";
      const res = await db().prepare("SELECT key, etag FROM blobs WHERE store = ? AND substr(key, 1, ?) = ? ORDER BY key").bind(name, prefix.length, prefix).all();
      return { blobs: res.results.map((r) => ({ key: r.key, etag: r.etag })), directories: [] };
    }
  };
}
