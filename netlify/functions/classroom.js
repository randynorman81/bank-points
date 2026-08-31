import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };

// This function's own URL -- doubles as the OAuth redirect_uri (must
// exactly match what's registered in Google Cloud Console) and the base
// for building the Google consent URL. See CLASSROOM-SETUP.md.
const REDIRECT_URI = "https://computer-sciencenorman.netlify.app/api/classroom";
const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students"
].join(" ");

function store() {
  // Strong consistency: the teacher needs to see a fresh connection or a
  // saved course link reflected on the very next read.
  return getStore({ name: "classroom", consistency: "strong" });
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

// ---- Google OAuth ----

function authUrl() {
  const clientId = process.env.CLASSROOM_CLIENT_ID;
  if (!clientId) return null;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    // Forces Google to hand back a refresh_token every time, not just on
    // the very first-ever consent -- needed since we intentionally
    // reconnect periodically (see CLASSROOM-SETUP.md).
    prompt: "consent"
  });
  return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}

async function exchangeCodeForTokens(code) {
  const clientId = process.env.CLASSROOM_CLIENT_ID;
  const clientSecret = process.env.CLASSROOM_CLIENT_SECRET;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });
  return res.json();
}

// Exchanges the stored refresh token for a fresh short-lived access token.
// Returns { accessToken, error }.
async function getAccessToken() {
  const clientId = process.env.CLASSROOM_CLIENT_ID;
  const clientSecret = process.env.CLASSROOM_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return { accessToken: null, error: "CLASSROOM_CLIENT_ID or CLASSROOM_CLIENT_SECRET is not set on this site" };
  }
  const oauth = await readJSON("oauth", null);
  if (!oauth || !oauth.refreshToken) {
    return { accessToken: null, error: "Not connected to Google Classroom yet" };
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: oauth.refreshToken,
      grant_type: "refresh_token"
    })
  });
  const data = await res.json();
  if (data.error) {
    // Most likely cause: the refresh token expired (Google expires these
    // after 7 days while the OAuth app is in "Testing" status) or was
    // revoked -- either way, the fix is to reconnect.
    return { accessToken: null, error: "Google Classroom connection expired or was revoked. Reconnect it below." };
  }
  return { accessToken: data.access_token, error: null };
}

async function classroomFetch(path, options) {
  const { accessToken, error } = await getAccessToken();
  if (error) return { error };
  const res = await fetch("https://classroom.googleapis.com/v1" + path, {
    ...options,
    headers: {
      ...(options && options.headers),
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  if (data.error) return { error: data.error.message || "Google Classroom API error" };
  return { data };
}

// ---- admin actions ----

async function oauthStatus() {
  const oauth = await readJSON("oauth", null);
  return { connected: !!(oauth && oauth.refreshToken), connectedAt: oauth ? oauth.connectedAt : null };
}

async function listCourses() {
  const { data, error } = await classroomFetch("/courses?courseStates=ACTIVE&pageSize=100", { method: "GET" });
  if (error) return { error };
  const courses = (data.courses || []).map((c) => ({ id: c.id, name: c.name }));
  return { ok: true, courses };
}

async function getCourseMapping() {
  return { mapping: await readJSON("courseMap", {}) };
}

async function saveCourseMapping(body) {
  const mapping = body.mapping && typeof body.mapping === "object" ? body.mapping : null;
  if (!mapping) return { error: "Missing mapping" };
  await updateJSON("courseMap", {}, () => mapping);
  return { ok: true };
}

async function createAssignment(body) {
  const course = (body.course || "").trim();
  const title = (body.title || "").trim();
  const description = (body.description || "").trim();
  const dueDate = (body.dueDate || "").trim();
  const link = (body.link || "").trim();
  const points = body.points === "" || body.points == null ? null : Number(body.points);
  if (!course || !title) return { error: "Class and title are required" };

  const mapping = await readJSON("courseMap", {});
  const classroomCourseId = mapping[course];
  if (!classroomCourseId) return { error: "No Google Classroom course is linked to this class yet -- set it up under Course Links below." };

  const courseWork = {
    title,
    description: description || undefined,
    workType: "ASSIGNMENT",
    state: "PUBLISHED"
  };
  if (points != null && !Number.isNaN(points)) courseWork.maxPoints = points;
  if (dueDate) {
    const [year, month, day] = dueDate.split("-").map(Number);
    if (year && month && day) courseWork.dueDate = { year, month, day };
  }
  if (link) {
    courseWork.materials = [{ link: { url: link } }];
  }

  const { data, error } = await classroomFetch(`/courses/${classroomCourseId}/courseWork`, {
    method: "POST",
    body: JSON.stringify(courseWork)
  });
  if (error) return { error };
  return { ok: true, alternateLink: data.alternateLink };
}

export default async (req) => {
  function ok(obj) {
    return new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const code = url.searchParams.get("code");
      const oauthError = url.searchParams.get("error");

      // Google redirects back here after the consent screen -- this is the
      // OAuth callback leg, not a normal API action, so it can't carry a
      // PIN. The worst a stranger can do by hitting this URL directly is
      // trigger a token exchange with no real authorization code, which
      // Google itself rejects.
      if (oauthError) {
        return Response.redirect(`https://computer-sciencenorman.netlify.app/classroom-admin.html?connect=error&reason=${encodeURIComponent(oauthError)}`, 302);
      }
      if (code) {
        const tokens = await exchangeCodeForTokens(code);
        if (tokens.error || !tokens.refresh_token) {
          return Response.redirect(`https://computer-sciencenorman.netlify.app/classroom-admin.html?connect=error&reason=${encodeURIComponent(tokens.error_description || tokens.error || "no_refresh_token")}`, 302);
        }
        await updateJSON("oauth", null, () => ({ refreshToken: tokens.refresh_token, connectedAt: new Date().toISOString() }));
        return Response.redirect("https://computer-sciencenorman.netlify.app/classroom-admin.html?connect=success", 302);
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
        case "getAuthUrl": {
          const url = authUrl();
          if (!url) return ok({ error: "CLASSROOM_CLIENT_ID is not set on this site" });
          return ok({ ok: true, url });
        }
        case "oauthStatus":
          return ok(await oauthStatus());
        case "listCourses":
          return ok(await listCourses());
        case "getCourseMapping":
          return ok(await getCourseMapping());
        case "saveCourseMapping":
          return ok(await saveCourseMapping(body));
        case "createAssignment":
          return ok(await createAssignment(body));
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
