// Free, rule-based question rewriter for the DOK analyzer. No AI and nothing leaves the browser.
// DOK.rewrite(questionText, level) returns candidate rewrites at that DOK level. Every candidate is run back through the
// same rater the page uses, so the ones listed first are verified to land on the requested level.
// Raising a level keeps the teacher's own wording and adds the thinking that level asks for (justify, research...).
// Lowering a level pulls out the topic and asks for recall or a plain explanation of it.
(function (root) {
  const D = typeof module !== "undefined" && module.exports ? require("./dok.js") : root.DOK;

  const CHOICE = /^\s*\(?[A-Ha-h][.)]\s+\S/;
  function stemOf(body) {
    const lines = String(body).split("\n");
    const choices = lines.filter(l => CHOICE.test(l)).length;
    let s = (choices >= 3 ? lines.filter(l => !CHOICE.test(l)) : lines).join(" ").replace(/\s+/g, " ").trim();
    if (/(?:^|\s)\(?A[.)]\s.*\s\(?B[.)]\s.*\s\(?C[.)]\s/.test(s)) s = s.replace(/\s\(?A[.)]\s.*$/, "").trim();
    return s;
  }

  // words that end a noun phrase (finite verbs, prepositions, connectors)
  const BREAK = new Set(("is are was were be been being do does did has have had can could will would should may might must shall move moves moved work works " +
    "affect affects cause causes caused change changes happen happens occur occurs become becomes help helps show shows use uses make makes form forms produce " +
    "produces differ differs relate relates compare compares between among during after before when while because if that which who whose where why how " +
    "than using from by with to for on at into through over under about against within without across per as so then also not no yes " +
    "fall falls fell rise rises rose grow grows grew begin begins began start starts started end ends ended lead leads led result results increase increases " +
    "decrease decreases depend depends react reacts reacted mean means exist exists stay stays remain remains take takes took give gives gave bring brings " +
    "create creates build builds built survive survives die dies died win wins won lose loses lost travel travels flow flows spread spreads develop develops " +
    "vary varies run runs ran look looks keep keeps get gets got put puts set sets seem seems need needs want wants think thinks know knows go goes went " +
    "come comes came see sees saw find finds found tell tells told turn turns call calls called allow allows protect protects support supports describe describes " +
    "explain explains represent represents contain contains include includes require requires").split(" "));
  const DET = new Set(["the", "a", "an", "your", "this", "that", "these", "those", "its", "their", "our", "my", "each", "every", "some", "any"]);
  const BAD_TOPIC = /^(?:(?:the|a|an|your|this|that|these|those|its|their|our|my)\s+)?(?:following|statement|statements|passage|text|author|story|answer|answers|question|choice|choices|best|correct|true|false|sentence|reading|selection|excerpt|information|it|they|them|one|ones|thing|things|experiment|example|examples|problem|equation|data|results?|task|project|function|code|program)$/i;
  const LEAD = /^(?:the\s+)?(?:term|word|phrase|concept|idea|process of|meaning of|definition of|role of|importance of)\s+(?:of\s+)?/i;

  // first noun phrase in a string: leading determiners, then words up to the first break word; "of / and / or" may join words
  function nounPhrase(s) {
    const toks = String(s).replace(/[“”"]/g, "").replace(LEAD, "").split(/\s+/).filter(Boolean);
    const out = []; let i = 0;
    while (i < toks.length && (DET.has(toks[i].toLowerCase()) || /^(how|why|what|whether|if)$/i.test(toks[i]))) { if (!/^(how|why|what|whether|if)$/i.test(toks[i])) out.push(toks[i]); i++; }
    for (; i < toks.length && out.length < 9; i++) {
      const raw = toks[i], w = raw.toLowerCase().replace(/[^a-z'\-0-9]/g, "");
      if (!w) break;
      if (/^(of|and|or)$/.test(w) && out.length && i + 1 < toks.length && !BREAK.has(toks[i + 1].toLowerCase().replace(/[^a-z]/g, ""))) { out.push(raw.replace(/[,;:?.!]+$/, "")); continue; }
      if (BREAK.has(w)) break;
      if (out.length >= 2 && w.length > 4 && /ed$/.test(w) && !/^(united|advanced|limited|united)$/.test(w)) break;
      out.push(raw);
      if (/[,;:?.!]$/.test(raw)) break;
    }
    while (out.length && /^(of|and|or|the|a|an)$/i.test(out[out.length - 1].replace(/[,;:?.!]+$/, ""))) out.pop();
    let t = out.join(" ").replace(/[,;:?.!]+$/, "").trim();
    if (t.length < 3 || BAD_TOPIC.test(t)) return null;
    if (/^(The|A|An)\s/.test(t)) t = t.charAt(0).toLowerCase() + t.slice(1);
    return t;
  }

  const DIRECTIVE = /^(?:please\s+|now\s+|next\s+|first\s*,?\s*)?(?:define|identify|list|name|state|label|describe|explain|summari[sz]e|compare and contrast|compare|contrast|classify|categori[sz]e|interpret|predict|justify|analy[sz]e|evaluate|assess|discuss|support|defend|argue|design|create|write about|write|develop|propose|investigate|determine|give|tell|illustrate|outline|trace|examine|explore|show)\b[:,]?\s*(?:me\s+)?(?:an?\s+|the\s+)?(?:(?:one|two|three|four|five|\d+)\s+)?(?:examples? of|ways? (?:to|that)|reasons? (?:for|why)|facts? about|differences? between|similarities? between)?\s*(.+)/i;

  function topicOf(stem) {
    let s = stem.replace(/^\s*(?:true\s*(?:or|\/)\s*false\s*[:.\-]?\s*)/i, "").replace(/^[\s"“]+/, "");
    s = s.replace(/\s+\(?\d+\s*(?:points?|pts?)\)?\s*$/i, "");
    let m;
    const wh = x => {
      let r = null;
      if ((m = x.match(/^which of the following\s+(?:is|are|was|were|best describes|best explains|best summarizes|describes|explains|shows|represents|would)\s+(.+)/i))) r = nounPhrase(m[1]);
      else if ((m = x.match(/^(?:what|who)\s+(?:is|are|was|were)\s+(.+)/i))) r = nounPhrase(m[1]);
      else if ((m = x.match(/^(?:how|why|what)\s+(?:does|do|did|can|could|would|should|is|are|was|were)\s+(.+)/i))) r = nounPhrase(m[1]);
      else if ((m = x.match(/^(?:what happens (?:when|if|to))\s+(.+)/i))) r = nounPhrase(m[1]);
      else if ((m = x.match(/^(?:is|are|was|were|does|do|did|can|should|would)\s+(.+)/i))) r = nounPhrase(m[1]);
      return r;
    };
    let t = wh(s);
    if (!t && (m = s.match(DIRECTIVE))) t = nounPhrase(m[1]);
    if (!t && /[:]/.test(s)) t = wh(s.slice(s.indexOf(":") + 1).trim().replace(/^[\s"“]+/, ""));
    if (!t && (m = s.match(/\b(the\s+[a-z][a-z\- ]{2,40})/i))) t = nounPhrase(m[1]);
    return t;
  }

  // for "design an experiment to test how light affects plant growth": the thing being tested
  function clauseOf(stem) {
    const m = stem.match(/\b(?:to (?:test|investigate|determine|find out|show|explore|answer|study|examine|measure)|that (?:tests|shows|investigates|determines)|about|on|for)\s+(.{8,120}?)[.?!]?$/i);
    if (!m) return null;
    const c = m[1].replace(/^(?:whether|if)\s+/i, "").trim();
    return c.split(/\s+/).length >= 3 ? c : null;
  }

  const sentence = s => { s = String(s).trim().replace(/\s+/g, " "); return /[.?!]$/.test(s) ? s : s + "."; };
  const isMath = s => (s.match(/\d+/g) || []).length >= 2 && /\b(solve|find|how (?:many|much|long|far)|total|each|left|remaining|calculate|compute|equation|simplify|evaluate)\b|[+\-*/×÷=]/i.test(s);
  function mathExpr(stem) {
    const m = stem.match(/[\d(][\d\s.,+\-*/×÷^()=%x]*[\d)]/g);
    if (!m) return null;
    const best = m.filter(x => /[+\-*/×÷^x]/.test(x) && /\d/.test(x)).sort((a, b) => b.length - a.length)[0];
    return best ? best.trim() : null;
  }

  // keep the teacher's question, made open-ended when it was multiple choice or true/false
  function openStem(stem) {
    let s = stem.trim();
    const tf = s.match(/^\s*true\s*(?:or|\/)\s*false\s*[:.\-]?\s*(.+)/i);
    if (tf) return { s: `Decide whether this statement is correct: "${sentence(tf[1].replace(/^[\s"“]+|[\s"”]+$/g, ""))}"`, tf: true };
    s = s.replace(/\bwhich of the following\b/i, "Which").replace(/\bwhich of these\b/i, "Which").replace(/\bwhich one of the following\b/i, "Which one").replace(/\bof the following\b/i, "");
    return { s: sentence(s), tf: false };
  }

  function candidates(stem, T, T2, level, orig) {
    const { s: S } = openStem(stem), out = [];
    const add = x => out.push(x);
    const topic = T;
    const innerQ = (() => { const m = stem.match(/^[^:]{6,90}:\s*(.{8,})$/); return m && /\b(justify|support|use|using|explain|answer|read|cite|based|evidence|text)\b/i.test(stem.split(":")[0]) ? sentence(m[1].charAt(0).toUpperCase() + m[1].slice(1)) : null; })();
    const raising = level > orig;
    const pair = T && /\band\b/i.test(T) && !/,/.test(T);

    const wrap = () => {
      if (level === 2) {
        add(`${S} Explain your answer in your own words.`);
        add(`${S} Explain your thinking and show the steps you used.`);
        add(`${S} Describe how you know, and give one example.`);
      } else if (level === 3) {
        add(`${S} Justify your answer with evidence, and explain your reasoning.`);
        add(`${S} Explain why a different answer would be less accurate, and support your answer with evidence.`);
        add(`${S} Evaluate how confident you are in your answer, and support your view with evidence.`);
      } else if (level === 4) {
        add(`Design and conduct a short research project to answer this question: "${S}" Gather evidence from at least two different sources, analyze it, and write a report that supports your conclusion.`);
        add(`Research this question using multiple sources, then synthesize what you learn and present a conclusion backed by evidence: "${S}"`);
        add(`Design a project that builds on this question: "${S}" Conduct research or an experiment, analyze the data, and report your conclusions.`);
      }
    };
    const byTopic = () => {
      if (!topic) return;
      if (level === 1) {
        add(`Define ${topic}.`); add(`Identify the key terms related to ${topic}.`); add(`List three facts about ${topic}.`);
        add(`What is ${topic}?`); add(`Name the main parts or steps of ${topic}.`);
      } else if (level === 2) {
        if (pair) add(`Compare and contrast ${topic}. Describe two similarities and two differences.`);
        add(`Explain ${topic} in your own words and give one example.`);
        add(`Describe ${topic}, including how its main parts are related.`);
        add(`Summarize the main idea of ${topic} and give an example that shows it.`);
        add(`Compare ${topic} with a similar idea. Describe one similarity and one difference.`);
      } else if (level === 3) {
        add(`Evaluate the importance of ${topic}. Support your answer with at least two pieces of evidence and explain your reasoning.`);
        add(`What would happen if ${topic} changed or were removed? Justify your prediction with evidence and reasoning.`);
        add(`Take a position on the most important thing to understand about ${topic}. Defend it with evidence and address one opposing view.`);
        add(`Critique a common explanation of ${topic}: which part is weakest, and why? Cite evidence.`);
      } else {
        add(`Design and conduct a short investigation about ${topic}. Gather information from at least two different sources, analyze what you find, and write a report that supports a conclusion.`);
        add(`Research ${topic} using multiple sources, synthesize what you learn, and propose a plan or solution. Present your work with evidence for your choices.`);
      }
    };
    const byClause = () => {   // lowering a design/investigation task
      if (!T2) return;
      if (level === 1) add(`Identify the key terms or variables in this question: ${T2}.`);
      else if (level === 2) { add(`Describe how you would test ${T2}.`); add(`Explain ${T2} in your own words and give one example.`); }
      else if (level === 3) add(`Predict the results of an investigation of ${T2}. Justify your prediction with evidence and explain your reasoning.`);
    };
    const math = () => {
      const ex = isMath(stem) ? mathExpr(stem) : null;
      if (level === 1 && ex) add(`Calculate ${ex}.`);
    };

    if (raising) { wrap(); byTopic(); math(); }
    else {
      if (orig === 4) byClause();
      if (innerQ && level === 2) add(`${innerQ} Explain your answer in your own words.`);
      byTopic(); math(); wrap();
    }
    if (level === 1) add("Identify the key term, fact, or number that this question asks for, and state it.");
    if (level === 2) add("Explain, in your own words, what this question is asking and how you would solve it.");
    return out;
  }

  const MEANS = {
    1: "Students only have to recall or recognize a fact, term, or simple procedure.",
    2: "Students have to use a skill or concept: explain, describe, compare, or show steps in their own words.",
    3: "Students have to reason and defend an answer with evidence; there is more than one way to respond well.",
    4: "Students carry out an extended task over time, using several sources or steps, and pull the results together."
  };
  const TIPS = {
    1: "Score as right or wrong.",
    2: "Score the accuracy of the explanation and the example.",
    3: "Score the quality of the reasoning and the evidence, not just one right answer.",
    4: "Use a rubric: research quality, analysis, conclusion, and how well sources are combined."
  };

  function rewrite(body, level) {
    const stem = stemOf(body), orig = D.rateText(body).dok;
    const T = topicOf(stem), T2 = clauseOf(stem);
    const rated = candidates(stem, T, T2, level, orig).map(t => ({ t, dok: D.rateText(t).dok }));
    const seen = new Set(), uniq = rated.filter(r => !seen.has(r.t) && seen.add(r.t));
    const good = uniq.filter(r => r.dok === level).map(r => r.t);
    const rest = uniq.filter(r => r.dok !== level).map(r => r.t);
    const alts = good.concat(rest);
    const hadChoices = /^\s*\(?[A-Ha-h][.)]\s/m.test(body) || /(?:^|\s)\(?A[.)]\s.*\s\(?B[.)]\s/.test(body);
    return { alts, verified: alts.map((_, i) => i < good.length), topic: T, means: MEANS[level], tip: TIPS[level], dropsChoices: hadChoices && level > 1 };
  }

  D.rewrite = rewrite; D.topicOf = topicOf; D.stemOf = stemOf; D.MEANS = MEANS;
})(typeof window !== "undefined" ? window : globalThis);
