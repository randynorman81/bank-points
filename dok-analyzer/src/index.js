// Worker: serves the static site (public/) and POST /api/analyze, which asks Claude to rate every
// test question's DOK level (Webb, per the DOK wheel) and rewrite it at the other levels.
// The reply streams back as NDJSON (one JSON object per line) so the page can fill in live.

const MODEL = "claude-sonnet-5-5";
const MAX_BYTES = 24 * 1024 * 1024; // base64 file payload cap

const SYSTEM = `You are an expert instructional coach who classifies test questions by Webb's Depth of Knowledge (DOK), using this DOK wheel:

LEVEL 1 - Recall. Verbs: arrange, calculate, define, draw, identify, illustrate, label, list, match, measure, memorize, name, quote, recall, recite, recognize, repeat, report, state, tabulate, tell, use; who/what/when/where/why. Tasks: recall elements and details of story structure; conduct basic calculations; label locations on a map; represent in words or diagrams a scientific concept; perform routine procedures like measuring or punctuation; describe features of a place or people.
LEVEL 2 - Skill/Concept. Verbs: describe, explain, interpret, categorize, cause/effect, collect and display, classify, compare, construct, distinguish, estimate, graph, identify patterns, infer, make observations, modify, organize, predict, relate, separate, show, summarize, use context cues. Tasks: identify and summarize major events; use context cues for unfamiliar words; solve routine multi-step problems; describe cause/effect; identify patterns; formulate a routine problem given data; organize, represent and interpret data.
LEVEL 3 - Strategic Thinking. Verbs: appraise, assess, cite evidence, compare, construct, critique, develop a logical argument, differentiate, draw conclusions, explain phenomena in terms of concepts, formulate, hypothesize, investigate, revise, use concepts to solve non-routine problems. Tasks: support ideas with details and examples; identify research questions and design investigations; develop a scientific model for a complex situation; determine author's purpose and how it affects interpretation; apply a concept in other contexts.
LEVEL 4 - Extended Thinking. Verbs: apply concepts, design, connect, prove, synthesize, critique, analyze, create. Tasks: conduct a project (specify a problem, design and run an experiment, analyze data, report results); apply a mathematical model to illuminate a problem; analyze and synthesize information from multiple sources; show how themes recur across texts/cultures; design a model to solve a practical or abstract situation. Requires extended time and complex reasoning.

Rules for rating: DOK is about the thinking the question demands, NOT the verb alone and NOT difficulty. Ask "what must the student do mentally?". A multiple-choice item is rarely above DOK 3; a single-sitting test item is almost never DOK 4 unless it truly demands multi-source synthesis or an extended design/investigation. Hard but routine calculation is still DOK 1-2. Be honest and calibrated; do not inflate.

TASK: Find every question/item on the uploaded test (number them in order; treat each lettered sub-part as part of its parent question unless it is clearly independent). Ignore directions, headers and answer keys except to understand context. If a passage/stimulus belongs to several questions, include enough of it in your rewrites to stand alone.

OUTPUT FORMAT - respond with NDJSON ONLY: one compact JSON object per line, no markdown, no code fences, no commentary.
First line: {"type":"meta","title":"<test title or best guess>","subject":"<subject>","grade":"<grade/level if evident or empty>"}
Then one line per question:
{"type":"question","n":<number>,"question":"<the question text, including answer choices if any>","dok":<1-4>,"why":"<2-3 sentences: what the student must do, which wheel verbs/tasks it matches, and why it is not one level lower or higher>","verbs":["<key verb(s) from the wheel>"],"rewrites":{"<level>":{"question":"<same topic/standard rewritten so it truly sits at that DOK level>","change":"<one sentence: what changed to move it to that level>"}}}
"rewrites" must contain an entry for EACH of the three levels (1,2,3,4) other than the question's own level, keyed by the digit. Rewrites must keep the same content/skill target, be ready to paste into a test, and genuinely demand that level (for DOK 3-4, use open-response or performance-task wording with a brief scoring hint inside "change" if useful). Escape quotes and newlines properly so each line is valid JSON. Do not output anything after the last question.`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

async function analyze(req, env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Server is missing ANTHROPIC_API_KEY." }, 500);
  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad request." }, 400); }
  if (env.ACCESS_CODE && body.code !== env.ACCESS_CODE) return json({ error: "Wrong or missing access code." }, 401);

  const content = [];
  if (body.file) {
    const { mediaType, data } = body.file;
    if (typeof data !== "string" || data.length > MAX_BYTES) return json({ error: "File too large (max ~18 MB)." }, 413);
    if (mediaType === "application/pdf") content.push({ type: "document", source: { type: "base64", media_type: mediaType, data } });
    else if (/^image\/(png|jpeg|gif|webp)$/.test(mediaType)) content.push({ type: "image", source: { type: "base64", media_type: mediaType, data } });
    else return json({ error: "Unsupported file type." }, 415);
  }
  if (body.text) {
    if (body.text.length > 400000) return json({ error: "Text too long." }, 413);
    content.push({ type: "text", text: "TEST CONTENT:\n\n" + body.text });
  }
  if (!content.length) return json({ error: "Nothing to analyze." }, 400);
  content.push({ type: "text", text: "Analyze every question on this test and output the NDJSON now." });

  const up = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 32000, stream: true, system: SYSTEM, messages: [{ role: "user", content }] })
  });
  if (!up.ok) {
    const t = await up.text();
    return json({ error: "Claude API error " + up.status + ": " + t.slice(0, 300) }, 502);
  }

  // Re-emit only the text deltas.
  const enc = new TextEncoder(), dec = new TextDecoder();
  const { readable, writable } = new TransformStream();
  const w = writable.getWriter();
  (async () => {
    let buf = "";
    try {
      for await (const chunk of up.body) {
        buf += dec.decode(chunk, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (!line.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(line.slice(5));
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") await w.write(enc.encode(ev.delta.text));
            else if (ev.type === "error") await w.write(enc.encode('\n{"type":"error","message":' + JSON.stringify(ev.error?.message || "stream error") + "}\n"));
          } catch {}
        }
      }
    } finally { await w.close(); }
  })();
  return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

export default {
  async fetch(req, env) {
    const path = new URL(req.url).pathname;
    if (path === "/api/analyze" && req.method === "POST") return analyze(req, env);
    if (path === "/api/config") return json({ needsCode: !!env.ACCESS_CODE });
    return env.ASSETS.fetch(req);
  }
};
