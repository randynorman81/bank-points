// Rule-based DOK rater. No AI: it splits a test into questions and matches each one against the verbs and
// tasks on Webb's DOK wheel (Level 1 Recall, 2 Skill/Concept, 3 Strategic Thinking, 4 Extended Thinking).
(function (root) {
  const NAMES = { 1: "Recall", 2: "Skill/Concept", 3: "Strategic Thinking", 4: "Extended Thinking" };

  // phrase -> level. Longer phrases are matched first and masked so "identify patterns" isn't also "identify".
  const CUES = {
    1: ["define", "identify", "list", "name", "label", "match", "recall", "recite", "state", "tell", "quote", "recognize", "repeat", "memorize",
      "measure", "calculate", "draw", "illustrate", "arrange", "tabulate", "who", "what is", "what are", "what was", "what were", "when", "where",
      "which of the following", "true or false", "true/false", "fill in", "is called", "is known as", "how many", "how much", "spell", "round", "add", "subtract", "multiply", "divide", "evaluate the expression", "simplify"],
    2: ["describe", "explain", "interpret", "categorize", "classify", "compare", "contrast", "construct", "distinguish", "estimate", "graph",
      "identify patterns", "infer", "make observations", "modify", "organize", "predict", "relate", "separate", "show", "summarize", "use context",
      "context clues", "cause", "effect", "main idea", "how does", "how do", "solve", "sequence", "paraphrase", "convert", "represent", "why does", "why do",
      "result of", "what happens", "differences", "similarities", "plot", "sort", "meaning of", "which best describes", "best summarizes", "theme"],
    3: ["justify", "support your", "evidence", "cite", "argue", "argument", "defend", "evaluate", "assess", "critique", "appraise", "hypothesize",
      "draw conclusions", "conclusion", "differentiate", "formulate", "investigate", "revise", "which is the best", "most likely", "author's purpose",
      "point of view", "bias", "what would happen if", "apply", "non-routine", "new situation", "recommend", "decide", "judge", "convince", "persuade",
      "opinion", "analyze", "how would you", "what evidence", "reasoning", "strengths and weaknesses", "to what extent", "agree or disagree", "explain why",
      "support with details", "support with examples", "design an investigation", "which is better", "weigh", "prioritize", "determine the best"],
    4: ["design", "create", "synthesize", "prove", "connect", "multiple sources", "across texts", "across sources", "across cultures", "conduct",
      "experiment", "project", "research", "propose", "develop a plan", "build a model", "develop a model", "write a proposal", "compose", "invent",
      "apply a mathematical model", "design a model", "report your results", "analyze data from", "over several", "extended"]
  };
  const STEMS = "(?:s|es|ed|d|ing)?";
  const ALL = [];
  for (const l of [1, 2, 3, 4]) for (const p of CUES[l]) ALL.push({ l, p, re: new RegExp("\\b" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+") + STEMS + "\\b", "gi") });
  ALL.sort((a, b) => b.p.length - a.p.length);

  function splitQuestions(text) {
    const lines = text.replace(/\r/g, "").split("\n");
    const startRe = /^\s*(?:Q(?:uestion)?\s*#?\s*)?(\d{1,3})\s*[.):\-]\s*\S/i;
    const qs = []; let cur = null, last = 0;
    for (const raw of lines) {
      const m = raw.match(startRe);
      if (m) {
        const n = +m[1];
        if (n === last + 1 || n === 1 || (last === 0 && n <= 2)) {
          cur = { n: qs.length + 1, label: String(n), lines: [raw.replace(startRe, s => s.replace(/^\s*(?:Q(?:uestion)?\s*#?\s*)?\d{1,3}\s*[.):\-]\s*/i, ""))] };
          qs.push(cur); last = n; continue;
        }
      }
      if (cur) cur.lines.push(raw);
    }
    if (qs.length < 2) { // fallback: blank-line blocks that look like questions
      const blocks = text.replace(/\r/g, "").split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 15 && (/\?|\b(explain|describe|list|define|identify|solve|compare|write|create|design|calculate)\b/i.test(b)));
      return blocks.map((b, i) => ({ n: i + 1, label: String(i + 1), lines: b.split("\n") }));
    }
    return qs;
  }

  function rate(q) {
    const body = q.lines.join("\n").trim();
    const choiceRe = /^\s*\(?[A-Ha-h][.)]\s+\S/;
    const choices = q.lines.filter(l => choiceRe.test(l)).length;
    const mc = choices >= 3;
    const stem = (mc ? q.lines.filter(l => !choiceRe.test(l)) : q.lines).join(" ").replace(/\s+/g, " ").trim();
    const words = stem.split(/\s+/).filter(Boolean).length;
    const parts = (body.match(/^\s*\(?[a-c][.)]\s/gim) || []).length;
    const tf = /\btrue\s*(or|\/)\s*false\b/i.test(stem);
    const fill = /_{3,}/.test(stem) || /\bfill in\b/i.test(stem);

    let masked = " " + stem.toLowerCase() + " ";
    const found = { 1: [], 2: [], 3: [], 4: [] };
    for (const c of ALL) {
      masked = masked.replace(c.re, m => { found[c.l].push(m.trim()); return " ".repeat(m.length); });
    }
    const has = l => found[l].length > 0;
    const notes = [];
    let dok;

    if (has(4)) {
      const strong = found[4].length >= 2 || words >= 45 || found[4].some(w => /(project|experiment|multiple sources|across|synthes|conduct|research)/.test(w));
      if (strong && !mc && !tf && !fill) { dok = 4; notes.push(`extended-thinking cue${found[4].length > 1 ? "s" : ""} (${q4(found[4])}) in an open task`); }
      else { dok = 3; notes.push(`level 4 cue (${q4(found[4])}) but a single item this size rarely demands extended thinking, so it is rated 3`); }
    } else if (has(3)) {
      dok = 3; notes.push(`strategic-thinking cue${found[3].length > 1 ? "s" : ""} (${q4(found[3])}): reasoning, justifying or evaluating`);
    } else if (has(2)) {
      dok = 2; notes.push(`skill/concept cue${found[2].length > 1 ? "s" : ""} (${q4(found[2])})`);
    } else if (has(1)) {
      dok = 1; notes.push(`recall cue${found[1].length > 1 ? "s" : ""} (${q4(found[1])})`);
    } else {
      dok = 1; notes.push("no wheel verbs found; a short direct question defaults to recall");
    }

    // adjustments from question shape
    if (dok <= 1 && !tf && !fill && (stem.match(/\d+/g) || []).length >= 2 && words >= 12 && /\b(solve|find|how (many|much|long|far)|total|remaining|left|each)\b/i.test(stem)) {
      dok = 2; notes.push("a multi-sentence word problem with numbers is a routine multi-step problem");
    }
    if (parts >= 2 && dok < 3 && has(2)) notes.push(`${parts} lettered parts add work but not necessarily depth`);
    if (mc) notes.push(dok >= 3 ? `multiple choice (${choices} options), which is why it is not rated higher` : `multiple choice (${choices} options)`);
    else if (tf) notes.push("true/false is recall unless the student must justify");
    else if (fill) notes.push("fill-in-the-blank is recall");
    if ((tf || fill) && dok > 1 && !has(3)) { dok = 1; }

    const levelsSeen = [1, 2, 3, 4].filter(l => has(l));
    const conf = !levelsSeen.length ? "low" : levelsSeen.length === 1 ? "high" : (levelsSeen[levelsSeen.length - 1] - levelsSeen[0] >= 2 ? "low" : "medium");
    const verbs = [...new Set(found[dok].length ? found[dok] : [].concat(found[1], found[2], found[3], found[4]))].slice(0, 6);
    const why = `Rated DOK ${dok} (${NAMES[dok]}): ${notes.join("; ")}.`;
    return { n: q.n, label: q.label, question: body, dok, why, verbs, conf, mc };
  }
  function q4(a) { return [...new Set(a)].slice(0, 4).map(w => `"${w}"`).join(", "); }

  function analyze(text) { return splitQuestions(text).map(rate); }
  function tally(qs) {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0 };
    qs.forEach(q => c[q.dok]++);
    const n = qs.length;
    const pct = {}; for (const l of [1, 2, 3, 4]) pct[l] = n ? Math.round(c[l] / n * 1000) / 10 : 0;
    return { counts: c, pct, n };
  }

  const api = { analyze, tally, splitQuestions, NAMES };
  if (typeof module !== "undefined") module.exports = api; else root.DOK = api;
})(typeof window !== "undefined" ? window : globalThis);
