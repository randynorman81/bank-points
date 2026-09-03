import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };

// Google OAuth Client ID for the "My Points" student sign-in, and the school
// Google Workspace domain accounts must belong to. Not secrets — safe to edit here.
const GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
const SCHOOL_EMAIL_DOMAIN = "socialcircleschools.org";

function store() {
  // Strong consistency: a roster edit (e.g. fixing a student's email) needs
  // to be visible on the very next read, not after Blobs' default eventual-
  // consistency window -- otherwise "My Points" sign-in can bounce off a
  // stale copy of the roster right after a fix is made.
  return getStore({ name: "bank-points", consistency: "strong" });
}

async function readJSON(key, fallback) {
  const val = await store().get(key, { type: "json" });
  return val || fallback;
}

async function writeJSON(key, val) {
  await store().setJSON(key, val);
}

function newId() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

async function getRoster(includeEmail) {
  const students = await readJSON("students", []);
  const transactions = await readJSON("transactions", []);

  const totals = {};
  transactions.forEach((t) => {
    if (!totals[t.studentId]) totals[t.studentId] = { earned: 0, used: 0 };
    const amount = Number(t.amount) || 0;
    if (t.type === "EARNED") totals[t.studentId].earned += amount;
    else if (t.type === "USED") totals[t.studentId].used += amount;
  });

  return {
    students: students.map((s) => {
      const t = totals[s.id] || { earned: 0, used: 0 };
      const row = { id: s.id, name: s.name, period: s.period, earned: t.earned, used: t.used, available: t.earned - t.used };
      if (includeEmail) row.email = s.email || "";
      return row;
    })
  };
}

// Every earn/use event for one student, most recent first, plus how many
// times each type happened (a count of events, not a sum of points).
function buildHistory(studentId, transactions) {
  const forStudent = transactions
    .filter((t) => t.studentId === studentId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const earnedCount = forStudent.filter((t) => t.type === "EARNED").length;
  const usedCount = forStudent.filter((t) => t.type === "USED").length;
  const history = forStudent.map((t) => ({ type: t.type, amount: t.amount, description: t.description || "", timestamp: t.timestamp }));
  return { earnedCount, usedCount, history };
}

async function getStudentHistory(body) {
  const students = await readJSON("students", []);
  const student = students.find((s) => s.id === body.id);
  if (!student) return { error: "Student not found" };
  const transactions = await readJSON("transactions", []);
  const { earnedCount, usedCount, history } = buildHistory(student.id, transactions);
  return { ok: true, name: student.name, period: student.period, earnedCount, usedCount, history };
}

async function getRequests() {
  const requests = await readJSON("requests", []);
  return { requests: requests.slice(-50).reverse() };
}

async function addStudent(body) {
  const name = (body.name || "").trim();
  const period = (body.period || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  if (!name || !period) return { error: "Name and period are required" };
  const students = await readJSON("students", []);
  const id = newId();
  students.push({ id, name, period, email });
  await writeJSON("students", students);
  return { ok: true, id };
}

async function bulkAddStudents(body) {
  const rows = Array.isArray(body.students) ? body.students : [];
  const cleaned = rows
    .map((r) => ({ name: (r.name || "").trim(), period: (r.period || "").trim(), email: (r.email || "").trim().toLowerCase() }))
    .filter((r) => r.name && r.period);
  if (cleaned.length === 0) return { error: "No valid rows to import" };

  const students = await readJSON("students", []);
  cleaned.forEach((r) => students.push({ id: newId(), name: r.name, period: r.period, email: r.email }));
  await writeJSON("students", students);
  return { ok: true, added: cleaned.length };
}

async function editStudent(body) {
  const students = await readJSON("students", []);
  const student = students.find((s) => s.id === body.id);
  if (!student) return { error: "Student not found" };
  student.name = (body.name || "").trim();
  student.period = (body.period || "").trim();
  student.email = (body.email || "").trim().toLowerCase();
  await writeJSON("students", students);
  return { ok: true };
}

async function deleteStudent(body) {
  const students = await readJSON("students", []);
  const remaining = students.filter((s) => s.id !== body.id);
  if (remaining.length === students.length) return { error: "Student not found" };
  await writeJSON("students", remaining);
  return { ok: true };
}

async function bulkSetEmails(body) {
  const rows = Array.isArray(body.rows) ? body.rows : [];
  const students = await readJSON("students", []);
  let matched = 0;
  rows.forEach((r) => {
    const name = (r.name || "").trim();
    const period = (r.period || "").trim();
    const email = (r.email || "").trim().toLowerCase();
    if (!name || !period || !email) return;
    const student = students.find((s) => s.name.toLowerCase() === name.toLowerCase() && s.period === period);
    if (student) {
      student.email = email;
      matched++;
    }
  });
  await writeJSON("students", students);
  return { ok: true, matched, total: rows.length };
}

async function addTransaction(body) {
  const amount = Number(body.amount);
  const type = body.type;
  if (!amount || amount <= 0) return { error: "Amount must be a positive number" };
  if (type !== "EARNED" && type !== "USED") return { error: "Invalid transaction type" };
  if (!body.studentId) return { error: "Missing student" };

  const transactions = await readJSON("transactions", []);
  transactions.push({
    id: newId(),
    studentId: body.studentId,
    type,
    amount,
    description: body.description || "",
    timestamp: new Date().toISOString()
  });
  await writeJSON("transactions", transactions);
  return { ok: true };
}

// Awards/uses points by school email instead of studentId — used by the Exit
// Tickets site (a separate Netlify site) to award points automatically when a
// student completes an exit ticket, without needing to know internal student
// IDs. Matches every student record with that email (same fan-out myPoints
// uses), so a student listed under more than one period all get it.
async function addTransactionByEmail(body) {
  const email = (body.email || "").trim().toLowerCase();
  const amount = Number(body.amount);
  const type = body.type;
  if (!email) return { error: "Missing email" };
  if (!amount || amount <= 0) return { error: "Amount must be a positive number" };
  if (type !== "EARNED" && type !== "USED") return { error: "Invalid transaction type" };

  const students = await readJSON("students", []);
  const matches = students.filter((s) => (s.email || "").toLowerCase() === email);
  if (matches.length === 0) return { error: `No student found with email ${email}` };

  const transactions = await readJSON("transactions", []);
  const timestamp = new Date().toISOString();
  matches.forEach((s) => {
    transactions.push({
      id: newId(),
      studentId: s.id,
      type,
      amount,
      description: body.description || "",
      timestamp
    });
  });
  await writeJSON("transactions", transactions);
  return { ok: true, matched: matches.length };
}

async function bulkAddTransaction(body) {
  const period = (body.period || "").trim();
  const amount = Number(body.amount);
  const type = body.type;
  if (!period) return { error: "Missing period" };
  if (!amount || amount <= 0) return { error: "Amount must be a positive number" };
  if (type !== "EARNED" && type !== "USED") return { error: "Invalid transaction type" };

  const students = await readJSON("students", []);
  const inPeriod = students.filter((s) => s.period === period);
  if (inPeriod.length === 0) return { error: "No students in that period" };

  const transactions = await readJSON("transactions", []);
  const timestamp = new Date().toISOString();
  inPeriod.forEach((s) => {
    transactions.push({
      id: newId(),
      studentId: s.id,
      type,
      amount,
      description: body.description || "",
      timestamp
    });
  });
  await writeJSON("transactions", transactions);
  return { ok: true, count: inPeriod.length };
}

async function handleRequestPoints(body) {
  const name = (body.name || "").trim();
  const period = (body.period || "").trim();
  const points = body.points;
  const assignment = (body.assignment || "").trim();
  if (!name || !period || !points || !assignment) return { error: "Missing required fields" };

  const requests = await readJSON("requests", []);
  requests.push({ timestamp: new Date().toISOString(), name, period, points, assignment });
  await writeJSON("requests", requests);
  return { ok: true };
}

// Verifies a Google Identity Services ID token server-side (signature, audience,
// expiry all checked by Google) and returns the signed-in email, or null if the
// token is invalid or isn't a verified @SCHOOL_EMAIL_DOMAIN account.
async function verifyGoogleToken(credential) {
  if (!credential) return null;
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!res.ok) return null;
  const payload = await res.json();
  if (payload.aud !== GOOGLE_CLIENT_ID) return null;
  if (payload.email_verified !== "true" && payload.email_verified !== true) return null;
  if ((payload.hd || "").toLowerCase() !== SCHOOL_EMAIL_DOMAIN) return null;
  return (payload.email || "").toLowerCase();
}

async function myPoints(body) {
  const email = await verifyGoogleToken(body.credential);
  if (!email) return { error: "Could not verify your school Google sign-in. Please try again." };

  const students = await readJSON("students", []);
  const matches = students.filter((s) => (s.email || "").toLowerCase() === email);
  if (matches.length === 0) {
    return { error: `No student record found for ${email}. Ask Mr. Norman to add your school email to the roster.` };
  }

  const transactions = await readJSON("transactions", []);
  const results = matches.map((student) => {
    const totals = { earned: 0, used: 0 };
    transactions.forEach((t) => {
      if (t.studentId !== student.id) return;
      const amount = Number(t.amount) || 0;
      if (t.type === "EARNED") totals.earned += amount;
      else if (t.type === "USED") totals.used += amount;
    });
    const { earnedCount, usedCount, history } = buildHistory(student.id, transactions);
    return {
      name: student.name,
      period: student.period,
      earned: totals.earned,
      used: totals.used,
      available: totals.earned - totals.used,
      earnedCount,
      usedCount,
      history
    };
  });

  return { ok: true, students: results };
}

export default async (req) => {
  function ok(obj) {
    return new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const action = url.searchParams.get("action") || "list";
      if (action === "list") return ok(await getRoster(false));
      if (action === "requests") return ok(await getRequests());
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

      if (action === "requestPoints") {
        return ok(await handleRequestPoints(body));
      }

      if (action === "myPoints") {
        return ok(await myPoints(body));
      }

      const adminPin = process.env.ADMIN_PIN || "1234";
      if (body.pin !== adminPin) {
        return ok({ error: "Invalid PIN" });
      }

      switch (action) {
        case "verifyPin":
          return ok({ ok: true });
        case "adminRoster":
          return ok(await getRoster(true));
        case "addStudent":
          return ok(await addStudent(body));
        case "bulkAddStudents":
          return ok(await bulkAddStudents(body));
        case "editStudent":
          return ok(await editStudent(body));
        case "deleteStudent":
          return ok(await deleteStudent(body));
        case "bulkSetEmails":
          return ok(await bulkSetEmails(body));
        case "studentHistory":
          return ok(await getStudentHistory(body));
        case "addTransaction":
          return ok(await addTransaction(body));
        case "addTransactionByEmail":
          return ok(await addTransactionByEmail(body));
        case "bulkAddTransaction":
          return ok(await bulkAddTransaction(body));
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
