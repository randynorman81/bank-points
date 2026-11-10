// /api/gdoc?id=<Google Doc id>: fetches the plain text of a Google Doc that is shared "Anyone with the link can view",
// so the DOK analyzer and rubric pages can read it (add &format=html to get the tables) (a browser can't fetch Google Docs directly). Only docs.google.com document exports are fetched.
const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const out = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });

export default async function gdoc(req) {
  const q = new URL(req.url).searchParams, id = q.get("id") || "", html = q.get("format") === "html";
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(id)) return out({ error: "That doesn't look like a Google Doc link." }, 400);
  let r;
  try { r = await fetch("https://docs.google.com/document/d/" + id + "/export?format=" + (html ? "html" : "txt"), { redirect: "follow" }); }
  catch (e) { return out({ error: "Couldn't reach Google Docs. Try again, or download the doc as a PDF and upload it." }, 502); }
  const type = r.headers.get("content-type") || "";
  if (!r.ok || !(html ? /text\/html/i : /text\/plain/i).test(type)) return out({ error: "Couldn't read that document. In Google Docs click Share, set it to \"Anyone with the link\" (Viewer), then try again. Or download it as a PDF and upload it." }, 403);
  const text = (await r.text()).replace(/^\uFEFF/, "");
  if (text.length > 400000) return out({ error: "That document is too long to analyze." }, 413);
  return out(html ? { ok: true, html: text } : { ok: true, text });
}
