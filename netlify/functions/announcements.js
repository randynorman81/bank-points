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

// filter "active" (default) returns everything NOT archived -- what the
// public announcements page and the admin's main "Posted" list show.
// filter "archived" returns only archived ones -- what the admin's
// "View Archived" panel shows, fetched separately so it never loads (or
// slows down) the normal view.
async function listAnnouncements(course, filter) {
  const all = await readJSON("announcements", []);
  let forCourse = course ? all.filter((a) => a.course === course) : all;
  forCourse = filter === "archived" ? forCourse.filter((a) => a.archived === true) : forCourse.filter((a) => a.archived !== true);
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

// Pacing calendars, one array of weeks per course -- e.g. the AP CSP page's
// "Calendar" unit. Stored as { [courseId]: [week, ...] } under its own key,
// same shape/pattern as currentLessons. A "week" is
// { id, label, month, tag, lines } -- label/month are free text (e.g.
// "Aug 3" / "August 2026"), tag is a short free-text badge (e.g. "QUIZ",
// "FLEX / BUFFER", "BREAK", "PROJECT DUE", or "" for none), lines is an
// array of plain-text bullet strings (assignment/lesson names for that
// week). Display order is array order -- there's no separate sort key, so
// the whole array is replaced in one write (see saveCalendar) rather than
// supporting piecemeal inserts, which keeps reordering/inserting a week
// simple instead of needing a fractional-index scheme.
async function getCalendar(course) {
  const all = await readJSON("calendars", {});
  return { weeks: (course && all[course]) || [] };
}

async function saveCalendar(body) {
  const course = (body.course || "").trim();
  if (!course) return { error: "Missing course" };
  const weeks = Array.isArray(body.weeks) ? body.weeks : null;
  if (!weeks) return { error: "Missing weeks" };

  const cleaned = weeks.map((w) => ({
    id: (w.id || newId()),
    label: (w.label || "").trim(),
    month: (w.month || "").trim(),
    tag: (w.tag || "").trim(),
    lines: (Array.isArray(w.lines) ? w.lines : []).map((l) => String(l || "").trim()).filter(Boolean)
  }));

  await updateJSON("calendars", {}, (all) => {
    all[course] = cleaned;
    return all;
  });
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

// Archiving (not deleting) is what the admin UI's "Archive" button actually
// calls -- keeps a full year's history around under "View Archived" instead
// of losing it, while the main "Posted" list only shows what's still active
// so it doesn't grow forever. deleteAnnouncement above is left intact for
// true removals, it's just not wired to any button right now.
async function archiveAnnouncement(body) {
  let found = false;
  await updateJSON("announcements", [], (list) => {
    const a = list.find((x) => x.id === body.id);
    if (!a) return list;
    found = true;
    a.archived = true;
    a.archivedAt = new Date().toISOString();
    return list;
  });
  if (!found) return { error: "Announcement not found" };
  return { ok: true };
}

async function unarchiveAnnouncement(body) {
  let found = false;
  await updateJSON("announcements", [], (list) => {
    const a = list.find((x) => x.id === body.id);
    if (!a) return list;
    found = true;
    a.archived = false;
    a.archivedAt = null;
    return list;
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
      if (action === "list") return ok(await listAnnouncements(url.searchParams.get("course") || "", url.searchParams.get("filter") || "active"));
      if (action === "currentLessons") return ok(await getCurrentLessons());
      if (action === "calendar") return ok(await getCalendar(url.searchParams.get("course") || ""));
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
          return ok(await listAnnouncements(body.course || "", body.filter || "active"));
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
        case "archiveAnnouncement":
          return ok(await archiveAnnouncement(body));
        case "unarchiveAnnouncement":
          return ok(await unarchiveAnnouncement(body));
        case "calendar":
          return ok(await getCalendar(body.course || ""));
        case "saveCalendar":
          return ok(await saveCalendar(body));
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
