import { getStore } from "@netlify/blobs";

const JSON_HEADERS = { "Content-Type": "application/json" };

function store() {
  return getStore("bank-points");
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

async function getRoster() {
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
      return { id: s.id, name: s.name, period: s.period, earned: t.earned, used: t.used, available: t.earned - t.used };
    })
  };
}

async function getRequests() {
  const requests = await readJSON("requests", []);
  return { requests: requests.slice(-50).reverse() };
}

async function addStudent(body) {
  const name = (body.name || "").trim();
  const period = (body.period || "").trim();
  if (!name || !period) return { error: "Name and period are required" };
  const students = await readJSON("students", []);
  const id = newId();
  students.push({ id, name, period });
  await writeJSON("students", students);
  return { ok: true, id };
}

async function bulkAddStudents(body) {
  const rows = Array.isArray(body.students) ? body.students : [];
  const cleaned = rows
    .map((r) => ({ name: (r.name || "").trim(), period: (r.period || "").trim() }))
    .filter((r) => r.name && r.period);
  if (cleaned.length === 0) return { error: "No valid rows to import" };

  const students = await readJSON("students", []);
  cleaned.forEach((r) => students.push({ id: newId(), name: r.name, period: r.period }));
  await writeJSON("students", students);
  return { ok: true, added: cleaned.length };
}

async function editStudent(body) {
  const students = await readJSON("students", []);
  const student = students.find((s) => s.id === body.id);
  if (!student) return { error: "Student not found" };
  student.name = (body.name || "").trim();
  student.period = (body.period || "").trim();
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

export default async (req) => {
  function ok(obj) {
    return new Response(JSON.stringify(obj), { status: 200, headers: JSON_HEADERS });
  }

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const action = url.searchParams.get("action") || "list";
      if (action === "list") return ok(await getRoster());
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

      const adminPin = process.env.ADMIN_PIN || "1234";
      if (body.pin !== adminPin) {
        return ok({ error: "Invalid PIN" });
      }

      switch (action) {
        case "verifyPin":
          return ok({ ok: true });
        case "addStudent":
          return ok(await addStudent(body));
        case "bulkAddStudents":
          return ok(await bulkAddStudents(body));
        case "editStudent":
          return ok(await editStudent(body));
        case "deleteStudent":
          return ok(await deleteStudent(body));
        case "addTransaction":
          return ok(await addTransaction(body));
        default:
          return ok({ error: "Unknown action" });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: JSON_HEADERS });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error", message: err.message }), { status: 500, headers: JSON_HEADERS });
  }
};
