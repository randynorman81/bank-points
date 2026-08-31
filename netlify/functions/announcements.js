import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };

function store() {
  // Strong consistency: a class should see a new announcement the moment
  // it's posted, not after Blobs' default eventual-consistency window.
  return getStore({ name: "announcements", consistency: "strong" });
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

async function listAnnouncements(course) {
  const all = await readJSON("announcements", []);
  const forCourse = course ? all.filter((a) => a.course === course) : all;
  return { announcements: forCourse.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)) };
}

// "What lesson are we on" per class -- a single current value per course
// (not a growing list like announcements), shown as a banner on the
// homepage. Stored under its own key so it's independent of the
// announcements array.
async function getCurrentLessons() {
  return { lessons: await readJSON("currentLessons", {}) };
}

async function saveCurrentLessons(body) {
  const lessons = body.lessons && typeof body.lessons === "object" ? body.lessons : null;
  if (!lessons) return { error: "Missing lessons" };
  const cleaned = {};
  Object.keys(lessons).forEach((k) => {
    const v = (lessons[k] || "").trim();
    if (v) cleaned[k] = v;
  });
  await updateJSON("currentLessons", {}, () => cleaned);
  return { ok: true };
}

async function addAnnouncement(body) {
  const course = (body.course || "").trim();
  const date = (body.date || "").trim();
  const text = (body.text || "").trim();
  if (!course) return { error: "Class is required" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Invalid date" };
  if (!text) return { error: "Announcement text is required" };

  const announcement = { id: newId(), course, date, text, createdAt: new Date().toISOString() };
  await updateJSON("announcements", [], (list) => {
    list.push(announcement);
    return list;
  });
  return { ok: true, id: announcement.id };
}

async function editAnnouncement(body) {
  const date = (body.date || "").trim();
  const text = (body.text || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Invalid date" };
  if (!text) return { error: "Announcement text is required" };

  let found = false;
  await updateJSON("announcements", [], (list) => {
    const a = list.find((x) => x.id === body.id);
    if (!a) return list;
    found = true;
    a.date = date;
    a.text = text;
    return list;
  });
  if (!found) return { error: "Announcement not found" };
  return { ok: true };
}

async function deleteAnnouncement(body) {
  let found = false;
  await updateJSON("announcements", [], (list) => {
    const remaining = list.filter((a) => a.id !== body.id);
    if (remaining.length !== list.length) found = true;
    return remaining;
  });
  if (!found) return { error: "Announcement not found" };
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
      if (action === "list") return ok(await listAnnouncements(url.searchParams.get("course") || ""));
      if (action === "currentLessons") return ok(await getCurrentLessons());
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
          return ok(await listAnnouncements(body.course || ""));
        case "currentLessons":
          return ok(await getCurrentLessons());
        case "saveCurrentLessons":
          return ok(await saveCurrentLessons(body));
        case "addAnnouncement":
          return ok(await addAnnouncement(body));
        case "editAnnouncement":
          return ok(await editAnnouncement(body));
        case "deleteAnnouncement":
          return ok(await deleteAnnouncement(body));
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
