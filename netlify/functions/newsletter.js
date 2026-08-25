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

async function listPosts() {
  const posts = await readJSON("posts", []);
  return {
    posts: posts.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
  };
}

async function createPost(body) {
  const title = (body.title || "").trim();
  const body_ = (body.body || "").trim();
  const date = (body.date || "").trim() || new Date().toISOString().slice(0, 10);
  if (!title || !body_) return { error: "Title and body are required" };

  const post = { id: newId(), title, body: body_, date, createdAt: new Date().toISOString() };
  await updateJSON("posts", [], (posts) => {
    posts.push(post);
    return posts;
  });
  return { ok: true, id: post.id };
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
      if (action === "list") return ok(await listPosts());
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
