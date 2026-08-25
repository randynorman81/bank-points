const API_URL = "/api/newsletter";

async function apiGet(action) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

async function apiPost(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Network error");
  return res.json();
}
