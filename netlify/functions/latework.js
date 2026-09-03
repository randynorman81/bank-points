import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };
const VALID_COURSES = ["ist", "apcsp", "ec"];

function store() {
  // Strong consistency: a student should see their own entry the moment
  // they add it, not after Blobs' default eventual-consistency window.
  return getStore({ name: "latework", consistency: "strong" });
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

// ---- public (student) actions ----

async function listEntries(course) {
  const all = await readJSON("entries", []);
  const forCourse = course ? all.filter((e) => e.course === course) : all;
  return { entries: forCourse };
}

async function addEntry(body) {
  const course = (body.course || "").trim();
  const studentName = (body.studentName || "").trim();
  const period = (body.period || "").trim();
  const studentEmail = (body.studentEmail || "").trim().toLowerCase();
  const assignmentTitle = (body.assignmentTitle || "").trim();

  if (!VALID_COURSES.includes(course)) return { error: "Invalid class" };
  if (!studentName) return { error: "Name is required" };
  if (!period) return { error: "Period is required" };
  if (!studentEmail) return { error: "Email is required" };
  if (!assignmentTitle) return { error: "Assignment name is required" };

  const entry = {
    id: newId(), course, studentName, period, studentEmail, assignmentTitle,
    submittedAt: new Date().toISOString(), graded: false, gradedAt: null
  };
  await updateJSON("entries", [], (list) => {
    list.push(entry);
    return list;
  });
  return { ok: true, id: entry.id };
}

// A student can only remove their own not-yet-graded entry -- the email
// they currently have typed has to match what's stored on the entry. This
// isn't real authentication, just enough to stop an easy typo/accident from
// wiping out a classmate's row; nothing here is sensitive or grade-bearing
// on its own, the teacher still checks Classroom before grading anything.
async function deleteOwnEntry(body) {
  const studentEmail = (body.studentEmail || "").trim().toLowerCase();
  let result = "not_found";
  await updateJSON("entries", [], (list) => {
    const entry = list.find((e) => e.id === body.id);
    if (!entry) { result = "not_found"; return list; }
    if (entry.graded) { result = "already_graded"; return list; }
    if (entry.studentEmail !== studentEmail) { result = "email_mismatch"; return list; }
    result = "ok";
    return list.filter((e) => e.id !== body.id);
  });
  if (result === "not_found") return { error: "Entry not found" };
  if (result === "already_graded") return { error: "This has already been graded and can't be removed" };
  if (result === "email_mismatch") return { error: "That email doesn't match this entry" };
  return { ok: true };
}

// ---- admin (PIN-gated) actions ----

async function markGraded(body) {
  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (ids.length === 0) return { error: "No entries selected" };
  const idSet = new Set(ids);
  const now = new Date().toISOString();
  await updateJSON("entries", [], (list) => {
    list.forEach((e) => {
      if (idSet.has(e.id)) { e.graded = true; e.gradedAt = now; }
    });
    return list;
  });
  return { ok: true };
}

async function unmarkGraded(body) {
  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (ids.length === 0) return { error: "No entries selected" };
  const idSet = new Set(ids);
  await updateJSON("entries", [], (list) => {
    list.forEach((e) => {
      if (idSet.has(e.id)) { e.graded = false; e.gradedAt = null; }
    });
    return list;
  });
  return { ok: true };
}

async function deleteEntryAdmin(body) {
  let found = false;
  await updateJSON("entries", [], (list) => {
    const remaining = list.filter((e) => e.id !== body.id);
    if (remaining.length !== list.length) found = true;
    return remaining;
  });
  if (!found) return { error: "Entry not found" };
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
      if (action === "list") return ok(await listEntries(url.searchParams.get("course") || ""));
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

      // Public, student-facing actions -- no PIN needed.
      if (action === "list") return ok(await listEntries(body.course || ""));
      if (action === "addEntry") return ok(await addEntry(body));
      if (action === "deleteOwnEntry") return ok(await deleteOwnEntry(body));

      // Everything past here is teacher-only.
      const adminPin = process.env.ADMIN_PIN || "1234";
      if (body.pin !== adminPin) {
        return ok({ error: "Invalid PIN" });
      }

      switch (action) {
        case "verifyPin":
          return ok({ ok: true });
        case "markGraded":
          return ok(await markGraded(body));
        case "unmarkGraded":
          return ok(await unmarkGraded(body));
        case "deleteEntryAdmin":
          return ok(await deleteEntryAdmin(body));
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
