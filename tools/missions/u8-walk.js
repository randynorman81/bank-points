/* UNIT 8 WALKTHROUGHS (a45 to a54): builds the long walkthrough records from the plain-text lesson file u8-walk.txt.
   Each lesson is 7 or 8 steps in the same pattern as the Unit 3 to 7 walkthroughs (a33 is the model):
     heading-comment box, "comment out above steps" box, a short explanation with a help popup, a code sample,
     "Type the code + end-of-line comment" box, a Try-it line, "Below it, type exactly ..." box, a Try-it line,
   and a last "Put it together" step that builds a small program from several boxes.
   The checks (what turns each box green) are made from the code lines, so the text and the grading can never drift apart.
   Output: { slot: { blocks, tips, checks, steps } }  (steps = the reference program pieces the tests use). Run u8-build.mjs to verify and write teacher-settings/python-unit8.js. */
"use strict";
const fs = require("fs");
const path = require("path");

const HEAD_EDGE = "First, type a comment with the step number and its title at the very left edge of the line (do not press Tab or indent it): ";
const COMMENT_OUT = "comment out above steps before moving on (ctrl + /)";

/* ---------- the lesson file parser ---------- */
function parse(text) {
  const lessons = []; let L = null, S = null;
  const lines = text.replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/^\s*(\/\/|##)/.test(ln) && !S) continue;
    let m;
    if ((m = /^=== (a\d+) \| (.+?) \| (\S+)\s*$/.exec(ln))) { L = { slot: m[1], title: m[2], notes: m[3], steps: [] }; S = null; lessons.push(L); continue; }
    if (!L) continue;
    if ((m = /^--- (.+)$/.exec(ln))) { S = { title: m[1].trim(), build: false, f: {} }; if (/^BUILD /.test(S.title)) { S.build = true; S.title = S.title.slice(6); } L.steps.push(S); continue; }
    const tgt = S ? S.f : L;
    if ((m = /^([a-z]+):\s*$/.exec(ln))) {            /* a block field: lines until a line that is just "." */
      const body = []; i++;
      while (i < lines.length && lines[i] !== ".") { body.push(lines[i]); i++; }
      tgt[m[1]] = body; continue;
    }
    if ((m = /^([a-z]+):\s*(.*)$/.exec(ln))) { tgt[m[1]] = m[2]; continue; }
  }
  return lessons;
}

/* ---------- regex helpers ---------- */
const escCh = (c) => c.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
function linePat(line) {
  const t = line.trim(); let out = "";
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (/\s/.test(c)) { let j = i; while (j < t.length && /\s/.test(t[j])) j++; out += (/\w/.test(t[i - 1] || "") && /\w/.test(t[j] || "")) ? "\\s+" : "\\s*"; i = j - 1; continue; }
    if (c === '"' || c === "'") { out += "[\"']"; continue; }
    out += escCh(c);
  }
  return out;
}
const bt = (s) => "`" + s.trim() + "`";
function listOf(items) { return items.length === 1 ? items[0] : items.length === 2 ? items[0] + " and " + items[1] : items.slice(0, -1).join(", ") + ", and " + items[items.length - 1]; }
function tryText(out, lead) {
  if (!out || !out.length) return lead + " Nothing prints.";
  const q = out.map((l) => "`" + l + "`");
  return lead + " " + (q.length === 1 ? q[0] : q.length === 2 ? q[0] + " and then " + q[1] : q.slice(0, -1).join(", ") + ", and then " + q[q.length - 1]) + ".";
}
const headChk = (n, box) => ({ label: "Step " + n + ": a \"# Step " + n + ": title\" comment", re: "^\\s*Step\\s*" + n + "\\s*:\\s*\\S", flags: "im", min: 1, pts: 1, where: "comments", box: box });

/* ---------- build one lesson ---------- */
function buildLesson(L) {
  const blocks = [], tips = {}, checks = [], steps = [];
  let box = 0; const seen = {};
  const codeChecks = (n, lines, b) => lines.filter((l) => l.trim()).forEach((l) => {
    const key = l.trim().replace(/\s+/g, " "); seen[key] = (seen[key] || 0) + 1;
    const label = "Step " + n + ": " + l.trim() + (seen[key] > 1 ? " (typed " + seen[key] + " times)" : "");
    /* a line that has a # inside its quotes can not be told apart from a comment by the scorer, so it is matched on the raw text and may start with the # that Ctrl + / adds */
    if (l.indexOf("#") >= 0) checks.push({ label: label, re: "^\\s*(?:#\\s*)?" + linePat(l) + "\\s*(?:#[^\\n]*)?$", flags: "m", min: seen[key], pts: 1, box: b });
    else checks.push({ label: label, re: "^\\s*" + linePat(l) + "\\s*$", flags: "m", min: seen[key], pts: 1, where: "code", box: b, unc: true });
  });
  const eolCheck = (n, e, b) => checks.push({ label: "Step " + n + ": " + e.what, re: "^\\s*(?:#\\s*)?" + linePat(e.on) + "\\s*#(?=[^\\n]*\\S+\\s+\\S+)[^\\n]*" + (e.ans ? "(?:" + e.ans + ")" : ""), flags: "im", min: 1, pts: 1, box: b });
  const parseEol = (s, predict) => { const p = s.split(" | "); return { on: p[0].trim(), ask: p[1].trim(), ans: (p[2] || "").trim(), ex: (p[3] || "").trim(), predict: !!predict, what: predict ? "your prediction as a comment at the end of the " + p[0].trim() + " line" : p[1].trim().replace(/^saying /, "").replace(/^what /, "what ") + ", as a comment at the end of the " + p[0].trim() + " line" }; };
  const typed = (lines) => { const q = lines.filter((l) => l.trim()).map(bt); let s = "type exactly " + listOf(q); if (lines.some((l) => /^\s/.test(l))) s += " (a line that sits under a `for`, `while`, or `def` is indented 4 spaces)"; return s; };
  const withEol = (lines, e) => lines.map((l) => (e && l.trim() === e.on ? l + "   # " + e.ex : l));

  /* intro */
  blocks.push({ h: "What you will learn" });
  blocks.push({ p: L.unit
    ? "**This walkthrough is your proof that you understand the notes.** It is not graded for points. Finish **every box** and answer **every question at the bottom correctly (100%)**. You write what you learned as comments and test it with small programs."
    : "**This walkthrough is a door, not a grade.** It walks you through the notes for this lesson. Finish **every box** and answer **every question at the bottom correctly (100%)**, and the **assignment** under it opens." });
  blocks.push({ p: "Keep the notes open in another tab: **" + L.title + "** (use the course menu on the left, or the link on the notes page). Each step names the part of the notes it comes from." });
  if (L.learn) blocks.push({ p: "**You will learn:** " + L.learn + "." });
  if (L.ap) blocks.push({ p: "**On the AP exam:** " + L.ap });
  blocks.push({ tips: ["houserules", "commentout", "notekinds", "runit", "readerror"] });

  L.steps.forEach((S, idx) => {
    const n = idx + 1, id = "s" + n, f = S.f;
    const keep = f.keep === "yes" && n > 1;
    const st = { n: n, title: S.title, uses: (f.uses || "").split(",").map((x) => x.trim()).filter(Boolean).map(Number), code: [], own: [], items: [] };
    blocks.push({ h: "Step " + n + ": " + S.title });
    blocks.push({ make: [HEAD_EDGE + "`# Step " + n + ": " + S.title + "`. This breaks your code into steps that are easy to read."] });
    checks.push(headChk(n, box)); box++;
    if (n > 1 && !keep) { blocks.push({ make: [COMMENT_OUT] }); box++; }
    if (keep) blocks.push({ p: "**Keep your earlier work.** This step uses " + (f.keepwhat || "the procedure you wrote earlier") + ", so do **not** comment out " + (st.uses.length > 1 ? "Steps " + st.uses.join(" and ") : "Step " + st.uses[0]) + "." });
    /* explanation + one help popup */
    const sayParts = [];
    if (f.notes) sayParts.push("From the notes, **" + f.notes + "**: ");
    sayParts.push(f.say || "");
    if (f.tip) sayParts.push(" [[" + f.tip + "|" + id + "x]]");
    blocks.push({ p: sayParts.join("") });
    if (f.tip) {
      const secs = [];
      (f.tipbody || []).forEach((l) => {
        const m = /^(p|ex|good|warn|steps|rows) ?(.*)$/.exec(l); if (!m) return;
        if (m[1] === "ex") { const last = secs[secs.length - 1]; if (last && last.ex) last.ex.push(m[2]); else secs.push({ ex: [m[2]] }); }
        else if (m[1] === "steps") secs.push({ steps: m[2].split(" ;; ") });
        else if (m[1] === "rows") { const last = secs[secs.length - 1], r = m[2].split(" | "); if (last && last.rows) last.rows.push(r); else secs.push({ rows: [r] }); }
        else { const o = {}; o[m[1]] = m[2]; secs.push(o); }
      });
      tips[id + "x"] = { title: f.tip, sections: secs };
    }
    const tipIds = [];
    if (f.tip) tipIds.push(id + "x");

    if (!S.build) {
      st.code = f.code || []; st.out = f.out || []; st.own = f.ownlines || []; st.ownOut = f.ownout || [];
      const e = parseEol(f.eol, f.predict === "yes"); st.eol = e;
      blocks.push({ code: st.code.join("\n") });
      tips[id + "e"] = { title: "What do I write?", sections: [{ ex: [st.code.map((l) => l).filter((l) => l.trim() === e.on).map((l) => l + "   # " + e.ex)[0] || (e.on + "   # " + e.ex)] }, { good: "Put the comment at the end of that line, after the code, with a few spaces before the `#`." }] };
      tipIds.push(id + "e");
      if (st.own.length) { tips[id + "o"] = { title: "Show me", sections: [{ ex: st.own.slice() }, { p: st.ownTip || "Run it and compare what it prints with the Try it line." }] }; tipIds.push(id + "o"); }
      blocks.push({ tips: tipIds });
      blocks.push({ make: ["Type the code. " + (e.predict ? "Write your prediction as an **end-of-line comment** at the end of the " + bt(e.on) + " line, **before** you run it" : "Add an **end-of-line comment** at the end of the " + bt(e.on) + " line saying " + e.ask) + ". [[What do I write?|" + id + "e]]"] });
      codeChecks(n, st.code, box); eolCheck(n, e, box); box++;
      blocks.push({ p: "▶ **Try it:** " + (f.try || tryText(st.out, "It prints").replace(/^It prints Nothing prints\.$/, "Nothing prints.")) });
      if (st.own.length) {
        blocks.push({ make: ["Below it, " + (f.ownsay || "add more") + ": " + typed(st.own) + ". [[Show me|" + id + "o]]"] });
        codeChecks(n, st.own, box); box++;
        blocks.push({ p: "▶ **Try it:** " + (f.owntry || tryText(st.ownOut, "It should print")) });
      }
    } else {
      /* the last step: a small program built from several boxes */
      const items = []; (f.item || []).forEach((l) => { if (/^@item /.test(l)) items.push({ say: l.slice(6), lines: [], eol: null }); else if (/^@eol /.test(l)) items[items.length - 1].eol = parseEol(l.slice(5), false); else if (/^@ask /.test(l)) items[items.length - 1].eol = parseEol(l.slice(5), true); else if (l.trim() !== "" || items.length) items[items.length - 1].lines.push(l); });
      st.items = items; st.out = f.out || [];
      tipIds.push(id + "p");
      tips[id + "p"] = { title: "What should the whole program look like?", sections: [{ p: "When every box is done, your program should look like this, with your own end-of-line comments:" }, { ex: (f.plan || []).slice() }] };
      blocks.push({ tips: tipIds });
      const texts = []; const itemBoxes = [];
      items.forEach((it) => { texts.push(it.say + " " + (it.lines.length ? "Type exactly " + listOf(it.lines.filter((l) => l.trim()).map(bt)) + (it.lines.some((l) => /^\s/.test(l)) ? " (indent the line that sits under the first one by 4 spaces)" : "") + "." : "") + (it.eol ? " " + (it.eol.predict ? "Write your prediction as an **end-of-line comment** at the end of the " + bt(it.eol.on) + " line." : "Add an **end-of-line comment** at the end of the " + bt(it.eol.on) + " line saying " + it.eol.ask + ".") : "")); });
      blocks.push({ make: texts });
      items.forEach((it) => { codeChecks(n, it.lines, box); if (it.eol) eolCheck(n, it.eol, box); itemBoxes.push(box); box++; });
      blocks.push({ p: "▶ **Try it:** " + (f.try || tryText(st.out, "Run it. It prints")) });
      st.code = items.reduce((a, it) => a.concat(withEol(it.lines, it.eol)), []);
    }
    steps.push(st);
  });

  blocks.push({ h: "Before you submit" });
  blocks.push({ tips: ["kn1", "kn2", "kn3"] });
  blocks.push({ p: "You can submit again later to replace your work. Your teacher sees your code and your last output." });
  /* optional multiple-choice questions (lesson-level "mc:" block): Q: question, K: a code line (optional), C: a wrong choice, C*: the right choice */
  const mc = [], mcKey = []; let cur = null;
  (L.mc || []).forEach((l) => {
    let m;
    if ((m = /^Q: ?(.*)$/.exec(l))) { cur = { q: m[1], code: "", choices: [] }; mc.push(cur); mcKey.push(-1); }
    else if (cur && (m = /^K: ?(.*)$/.exec(l))) cur.code += (cur.code ? "\n" : "") + m[1];
    else if (cur && (m = /^C(\*?): ?(.*)$/.exec(l))) { cur.choices.push(m[2]); if (m[1] === "*") mcKey[mcKey.length - 1] = cur.choices.length - 1; }
  });
  return { slot: L.slot, title: L.title, unit: L.unit, num: L.num ? Number(L.num) : undefined, blocks: blocks, tips: tips, checks: checks, steps: steps, mc: mc, mcKey: mcKey };
}

/* the reference program a student would end with (heading comments, code, own lines, end-of-line comments) */
function referenceProgram(rec, upTo) {
  const out = [];
  rec.steps.forEach((s) => {
    if (upTo && s.n > upTo) return;
    out.push("# Step " + s.n + ": " + s.title);
    if (s.items && s.items.length) s.items.forEach((it) => it.lines.forEach((l) => out.push(it.eol && l.trim() === it.eol.on ? l + "   # " + it.eol.ex : l)));
    else { s.code.forEach((l) => out.push(s.eol && l.trim() === s.eol.on ? l + "   # " + s.eol.ex : l)); s.own.forEach((l) => out.push(l)); }
  });
  return out.join("\n") + "\n";
}

function buildAll(file) {
  const lessons = parse(fs.readFileSync(file || path.join(__dirname, "u8-walk.txt"), "utf8"));
  const res = {}; lessons.forEach((L) => { res[L.slot] = buildLesson(L); });
  return res;
}
module.exports = { buildAll, buildLesson, parse, referenceProgram, linePat };
