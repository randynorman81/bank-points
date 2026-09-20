import { getStore } from "@netlify/blobs";

// Student code editor backend (Unit 7 web design).
//   - Students sign in with their school Google account (same setup as "My Points").
//   - Drafts and submissions are stored in Netlify Blobs. Only code text is stored, never run on the server.
//   - Teacher actions need the ADMIN_PIN environment variable (same one the bank uses).

const JSON_HEADERS = { "Content-Type": "application/json" };
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";
const LESSONS = ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11", "7.12", "7.13"];
const MAX_CODE = 120000;            // characters of HTML per submission
const MAX_IMG_BYTES = 1500000;      // decoded image size
const MAX_IMGS = 15;                // images per student
const IMG_TYPES = { "image/png": 1, "image/jpeg": 1, "image/gif": 1, "image/webp": 1 };

function store() {
  return getStore({ name: "unit7-code", consistency: "strong" });
}
async function readJSON(key, fallback) {
  const v = await store().get(key, { type: "json" });
  return v == null ? fallback : v;
}
async function updateJSON(key, fallback, updater) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const existing = await store().getWithMetadata(key, { type: "json" });
    const current = existing ? existing.data : fallback;
    const updated = updater(current == null ? fallback : current);
    const opts = existing ? { onlyIfMatch: existing.etag } : { onlyIfNew: true };
    const result = await store().setJSON(key, updated, opts);
    if (result.modified) return updated;
  }
  throw new Error("Too much contention writing " + key);
}

async function verifyGoogleToken(credential) {
  if (!credential) return null;
  const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(credential));
  if (!res.ok) return null;
  const p = await res.json();
  if (p.aud !== GOOGLE_CLIENT_ID) return null;
  if (p.email_verified !== "true" && p.email_verified !== true) return null;
  if ((p.hd || "").toLowerCase() !== SCHOOL_EMAIL_DOMAIN) return null;
  return { email: (p.email || "").toLowerCase(), name: String(p.name || "").slice(0, 80) };
}

function isAdmin(body) {
  return body && body.pin === (process.env.ADMIN_PIN || "1234");
}
const enc = (s) => encodeURIComponent(s);
const dec = (s) => decodeURIComponent(s);
const goodLesson = (l) => LESSONS.indexOf(l) > -1;
const now = () => new Date().toISOString();
function newId() {
  const b = new Uint8Array(12); crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
function cleanPeriod(p) { return String(p || "").slice(0, 12).replace(/[^A-Za-z0-9 ]/g, ""); }

/* ---------------- student actions ---------------- */
async function mine(body, user) {
  const lesson = body.lesson;
  const out = { ok: true, name: user.name, email: user.email };
  if (goodLesson(lesson)) {
    out.submission = await readJSON("sub:" + lesson + ":" + enc(user.email), null);
    out.draft = await readJSON("draft:" + lesson + ":" + enc(user.email), null);
  }
  out.images = await readJSON("imgs:" + enc(user.email), []);
  return out;
}

async function saveDraft(body, user) {
  if (!goodLesson(body.lesson)) return { error: "Unknown lesson" };
  const code = String(body.code == null ? "" : body.code);
  if (code.length > MAX_CODE) return { error: "That file is too big to save." };
  await store().setJSON("draft:" + body.lesson + ":" + enc(user.email), {
    email: user.email, name: user.name, period: cleanPeriod(body.period), lesson: body.lesson, code, savedAt: now()
  });
  return { ok: true };
}

async function submit(body, user) {
  if (!goodLesson(body.lesson)) return { error: "Unknown lesson" };
  const code = String(body.code == null ? "" : body.code);
  if (!code.trim()) return { error: "Your code is empty. Write something first!" };
  if (code.length > MAX_CODE) return { error: "That file is too big to submit." };
  const key = "sub:" + body.lesson + ":" + enc(user.email);
  const prev = await readJSON(key, null);
  const rec = {
    email: user.email, name: user.name, period: cleanPeriod(body.period), lesson: body.lesson, code,
    submittedAt: now(), count: (prev && prev.count ? prev.count : 0) + 1,
    teacher: prev && prev.teacher ? prev.teacher : null
  };
  await store().setJSON(key, rec);
  return { ok: true, submittedAt: rec.submittedAt, count: rec.count };
}

async function uploadImage(body, user) {
  const type = String(body.type || "");
  if (!IMG_TYPES[type]) return { error: "Please upload a PNG, JPG, GIF, or WEBP image." };
  const data = String(body.data || "");
  const bytes = Math.floor(data.length * 3 / 4);
  if (!data || bytes > MAX_IMG_BYTES) return { error: "That image is too big. Try a smaller one (under 1.5 MB)." };
  const list = await readJSON("imgs:" + enc(user.email), []);
  if (list.length >= MAX_IMGS) return { error: "You already have " + MAX_IMGS + " images. Delete one first." };
  const id = newId();
  await store().setJSON("img:" + id, { owner: user.email, type, data });
  const entry = { id, name: String(body.name || "image").slice(0, 60), type, bytes, at: now() };
  await updateJSON("imgs:" + enc(user.email), [], (l) => l.concat([entry]));
  return { ok: true, image: entry };
}

async function deleteImage(body, user) {
  const id = String(body.id || "");
  const list = await readJSON("imgs:" + enc(user.email), []);
  if (!list.some((i) => i.id === id)) return { error: "Image not found" };
  await store().delete("img:" + id);
  await updateJSON("imgs:" + enc(user.email), [], (l) => l.filter((i) => i.id !== id));
  return { ok: true };
}

/* ---------------- teacher actions ---------------- */
async function listPrefix(prefix) {
  const out = [];
  let cursor;
  const res = await store().list({ prefix });
  for (const b of res.blobs || []) out.push(b.key);
  return out;
}

async function adminList(body) {
  if (!goodLesson(body.lesson)) return { error: "Unknown lesson" };
  const subKeys = await listPrefix("sub:" + body.lesson + ":");
  const draftKeys = await listPrefix("draft:" + body.lesson + ":");
  const subs = await Promise.all(subKeys.map((k) => store().get(k, { type: "json" })));
  const drafts = await Promise.all(draftKeys.map((k) => store().get(k, { type: "json" })));
  const byEmail = {};
  subs.forEach((s) => { if (s) byEmail[s.email] = { email: s.email, name: s.name, period: s.period, submission: s, draft: null }; });
  drafts.forEach((d) => {
    if (!d) return;
    if (!byEmail[d.email]) byEmail[d.email] = { email: d.email, name: d.name, period: d.period, submission: null, draft: d };
    else byEmail[d.email].draft = d;
  });
  return { ok: true, lesson: body.lesson, students: Object.values(byEmail) };
}

async function adminCounts() {
  const counts = {};
  for (const l of LESSONS) counts[l] = (await listPrefix("sub:" + l + ":")).length;
  return { ok: true, counts };
}

async function adminGrade(body) {
  if (!goodLesson(body.lesson)) return { error: "Unknown lesson" };
  const key = "sub:" + body.lesson + ":" + enc(String(body.email || "").toLowerCase());
  const rec = await readJSON(key, null);
  if (!rec) return { error: "No submission found" };
  const score = body.score === "" || body.score == null ? null : Number(body.score);
  if (score !== null && (isNaN(score) || score < 0 || score > 1000)) return { error: "Score must be a number" };
  rec.teacher = { score, comment: String(body.comment || "").slice(0, 2000), gradedAt: now() };
  await store().setJSON(key, rec);
  return { ok: true, teacher: rec.teacher };
}

/* ---------------- request handler ---------------- */
export default async (req) => {
  const ok = (obj) => new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const id = url.searchParams.get("img");
      if (id && /^[a-f0-9]{24}$/.test(id)) {
        const rec = await store().get("img:" + id, { type: "json" });
        if (!rec) return new Response("Not found", { status: 404 });
        const bin = Uint8Array.from(atob(rec.data), (c) => c.charCodeAt(0));
        return new Response(bin, { status: 200, headers: { "Content-Type": rec.type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
      }
      return ok({ ok: true, service: "unit7-code" });
    }
    if (req.method !== "POST") return ok({ error: "Unsupported method" });

    let body;
    try { body = await req.json(); } catch (e) { return ok({ error: "Malformed request" }); }
    const action = body.action;

    if (["adminList", "adminCounts", "adminGrade"].indexOf(action) > -1) {
      if (!isAdmin(body)) return ok({ error: "Invalid PIN" });
      if (action === "adminList") return ok(await adminList(body));
      if (action === "adminCounts") return ok(await adminCounts());
      return ok(await adminGrade(body));
    }

    const user = await verifyGoogleToken(body.credential);
    if (!user) return ok({ error: "Please sign in with your school Google account.", needLogin: true });
    if (action === "mine") return ok(await mine(body, user));
    if (action === "saveDraft") return ok(await saveDraft(body, user));
    if (action === "submit") return ok(await submit(body, user));
    if (action === "uploadImage") return ok(await uploadImage(body, user));
    if (action === "deleteImage") return ok(await deleteImage(body, user));
    return ok({ error: "Unknown action" });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error: " + err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
