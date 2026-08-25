import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };

function store() {
  // Strong consistency: a parent should see a post the moment it's published,
  // not after Blobs' default eventual-consistency window.
  return getStore({ name: "newsletter", consistency: "strong" });
}

async function readJSON(key, fallback) {
  const val = await store().get(key, { type: "json" });
  return val || fallback;
}

// Safely applies a read-modify-write to a blob under concurrent calls --
// without this, two overlapping writes race and the one that finishes last
// silently wipes out the other's change.
async function updateJSON(key, fallback, updater) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const existing = await store().getWithMetadata(key, { type: "json" });
    const current = existing ? existing.data : fallback;
    const updated = updater(current == null ? fallback : current);
    const writeOpts = existing ? { onlyIfMatch: existing.etag } : { onlyIfNew: true };
    const result = await store().setJSON(key, updated, writeOpts);
    if (result.modified) return updated;
  }
  throw new Error(`Too much contention writing "${key}" -- try again`);
}

function newId() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

// Where parents land when they follow a "new newsletter post" email.
const NEWSLETTER_PUBLIC_URL = "https://computer-sciencenorman.netlify.app/newsletter.html";

async function listPosts() {
  const posts = await readJSON("posts", []);
  return {
    posts: posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
  };
}

// Best-effort call to a Google Apps Script web app (deployed from the
// teacher's own school Google account) that mail-merges every parent
// contact's email with the new post. Never throws -- publishing a post must
// always succeed even if the notifier isn't configured or is unreachable;
// the outcome is just recorded on the post so the teacher can retry from the
// Admin page ("Resend Notification").
async function notifyParents(post) {
  const webhookUrl = process.env.PARENT_NOTIFY_WEBHOOK_URL;
  const secret = process.env.PARENT_NOTIFY_SECRET;
  if (!webhookUrl || !secret) {
    return { notified: false, error: "PARENT_NOTIFY_WEBHOOK_URL or PARENT_NOTIFY_SECRET is not set on this site" };
  }

  const parents = await readJSON("parents", []);
  const emails = [...new Set(parents.map((p) => (p.email || "").trim().toLowerCase()).filter(Boolean))];
  if (emails.length === 0) {
    return { notified: false, error: "No parent contacts on file" };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, title: post.title, url: NEWSLETTER_PUBLIC_URL, emails })
    });
    const data = await res.json();
    if (!data.ok) return { notified: false, error: data.error || "The notifier reported an error" };
    return { notified: true, error: null };
  } catch (err) {
    return { notified: false, error: "Could not reach the notifier" };
  }
}

async function createPost(body) {
  const title = (body.title || "").trim();
  const body_ = (body.body || "").trim();
  const date = (body.date || "").trim() || new Date().toISOString().slice(0, 10);
  if (!title || !body_) return { error: "Title and body are required" };

  const post = { id: newId(), title, body: body_, date, createdAt: new Date().toISOString(), notifiedParents: false, notifyError: null };
  await updateJSON("posts", [], (posts) => {
    posts.push(post);
    return posts;
  });

  const notifyResult = await notifyParents(post);
  await updateJSON("posts", [], (posts) => {
    const p = posts.find((x) => x.id === post.id);
    if (p) { p.notifiedParents = notifyResult.notified; p.notifyError = notifyResult.error; }
    return posts;
  });

  return { ok: true, id: post.id, notifiedParents: notifyResult.notified, notifyError: notifyResult.error };
}

// Re-sends the parent notification for an already-published post -- for
// when the notifier wasn't configured yet or was briefly unreachable.
async function notifyPost(body) {
  const posts = await readJSON("posts", []);
  const post = posts.find((p) => p.id === body.id);
  if (!post) return { error: "Post not found" };

  const result = await notifyParents(post);
  await updateJSON("posts", [], (list) => {
    const p = list.find((x) => x.id === body.id);
    if (p) { p.notifiedParents = result.notified; p.notifyError = result.error; }
    return list;
  });
  return { ok: true, notifiedParents: result.notified, notifyError: result.error };
}

// ---- parent contacts ----

async function adminListParents() {
  return { parents: await readJSON("parents", []) };
}

async function addParentContact(body) {
  const studentName = (body.studentName || "").trim();
  const period = (body.period || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  if (!studentName || !period || !email) return { error: "Student name, period, and parent email are required" };

  const id = newId();
  await updateJSON("parents", [], (list) => {
    list.push({ id, studentName, period, email });
    return list;
  });
  return { ok: true, id };
}

async function bulkAddParentContacts(body) {
  const rows = Array.isArray(body.contacts) ? body.contacts : [];
  const cleaned = rows
    .map((r) => ({ studentName: (r.studentName || "").trim(), period: (r.period || "").trim(), email: (r.email || "").trim().toLowerCase() }))
    .filter((r) => r.studentName && r.period && r.email);
  if (cleaned.length === 0) return { error: "No valid rows to import (need student name, period, and parent email)" };

  await updateJSON("parents", [], (list) => {
    cleaned.forEach((r) => list.push({ id: newId(), ...r }));
    return list;
  });
  return { ok: true, added: cleaned.length };
}

async function deleteParentContact(body) {
  let found = false;
  await updateJSON("parents", [], (list) => {
    const remaining = list.filter((p) => p.id !== body.id);
    if (remaining.length !== list.length) found = true;
    return remaining;
  });
  if (!found) return { error: "Contact not found" };
  return { ok: true };
}

async function editPost(body) {
  const title = (body.title || "").trim();
  const body_ = (body.body || "").trim();
  const date = (body.date || "").trim();
  if (!title || !body_ || !date) return { error: "Title, body, and date are required" };

  let found = false;
  await updateJSON("posts", [], (posts) => {
    const post = posts.find((p) => p.id === body.id);
    if (!post) return posts;
    found = true;
    post.title = title;
    post.body = body_;
    post.date = date;
    return posts;
  });
  if (!found) return { error: "Post not found" };
  return { ok: true };
}

async function deletePost(body) {
  let found = false;
  await updateJSON("posts", [], (posts) => {
    const remaining = posts.filter((p) => p.id !== body.id);
    if (remaining.length !== posts.length) found = true;
    return remaining;
  });
  if (!found) return { error: "Post not found" };
  return { ok: true };
}

export default async (req) => {
  function ok(obj) {
    return new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const action = url.searchParams.get("action") || "list";
      if (action === "list") {
        const { posts } = await listPosts();
        const publicPosts = posts.map(({ id, title, body, date, createdAt }) => ({ id, title, body, date, createdAt }));
        return ok({ posts: publicPosts });
      }
      return ok({ error: "Unknown action" });
    }

    if (req.method === "POST") {
      let body;
      try {
        body = await req.json();
      } catch (err) {
        return ok({ error: "Malformed request" });
      }

      const action = body.action;

      const adminPin = process.env.ADMIN_PIN || "1234";
      if (body.pin !== adminPin) {
        return ok({ error: "Invalid PIN" });
      }

      switch (action) {
        case "verifyPin":
          return ok({ ok: true });
        case "list":
          return ok(await listPosts());
        case "createPost":
          return ok(await createPost(body));
        case "editPost":
          return ok(await editPost(body));
        case "deletePost":
          return ok(await deletePost(body));
        case "notifyPost":
          return ok(await notifyPost(body));
        case "adminListParents":
          return ok(await adminListParents());
        case "addParentContact":
          return ok(await addParentContact(body));
        case "bulkAddParentContacts":
          return ok(await bulkAddParentContacts(body));
        case "deleteParentContact":
          return ok(await deleteParentContact(body));
        default:
          return ok({ error: "Unknown action" });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: JSON_HEADERS });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: JSON_HEADERS });
  }
};
