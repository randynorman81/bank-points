// In-memory stand-in for @netlify/blobs, used only by the local test server (devserver.mjs).
const DB = globalThis.__BLOBS || (globalThis.__BLOBS = {});
export function getStore({ name }) {
  const s = DB[name] || (DB[name] = new Map());
  return {
    async get(k) { const r = s.get(k); return r ? JSON.parse(r.v) : null; },
    async getWithMetadata(k) { const r = s.get(k); return r ? { data: JSON.parse(r.v), etag: String(r.e) } : null; },
    async setJSON(k, v, o = {}) { const r = s.get(k); if (o.onlyIfNew && r) return { modified: false }; if (o.onlyIfMatch && (!r || String(r.e) !== o.onlyIfMatch)) return { modified: false }; s.set(k, { v: JSON.stringify(v), e: (r ? r.e : 0) + 1 }); return { modified: true }; },
    async delete(k) { s.delete(k); },
    async list({ prefix = "" } = {}) { return { blobs: [...s.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) }; }
  };
}
