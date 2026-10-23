/* The Arduino assignments for the editor (arduino/editor.html): the shared tools for writing them.
   The assignments themselves are in assign-u2a.js and assign-u2b.js (EC Unit 2).

   An assignment:  A["id"] = { title, short, intro, from, help:[topic ids], events:[...], steps:[ { h, intro, code, items:[...] } ] }
   An item is one of:
     I(text, check, helpIds)                       auto-checked: check(c) returns true/false or a promise (c = the circuit and code, see ctx.js)
     ASK(text, minWords, helpIds, {test, mono, rows, ph})   a written answer (counts when it has enough words, and passes test(answer) if given)
     MATCH(text, rows, options, helpIds)           vocabulary matching:  rows = [[term, correctLetter]], options = [[letter, text]]
     CLOZE(text, sentences, bank, answers, helpIds) fill in the blanks: "{0}", "{1}" ... in the sentences, answers[n] from the word bank
     NOTE(text, helpIds)                           information only (not scored)
   A check can use  c.count("led")  c.parts("resistor")  c.code(/regex/)  c.plugged(part)  c.netOf(part,"A")  c.pin("D8")  c.rail("plus")
   c.wireBetween(net, nets, color)  c.staticRun({pins})  c.pinOfLed(led)  c.litFromPower()  await c.run({until, samples, events}) ... (ctx.js) */
(function (root) {
  "use strict";
  var A = root.ARD_ASSIGN = {};
  function I(t, check, help) { return { t: t, check: check, help: help || [] }; }
  function ASK(t, min, help, o) { o = o || {}; return { t: t, kind: "ask", min: min, help: help || [], test: o.test, mono: o.mono, rows: o.rows, ph: o.ph }; }
  function MATCH(t, rows, options, help) { return { t: t, kind: "match", rows: rows, options: options, help: help || [] }; }
  function CLOZE(t, sentences, bank, answers, help) { return { t: t, kind: "cloze", sentences: sentences, bank: bank, answers: answers, help: help || [] }; }
  function NOTE(t, help) { return { t: t, kind: "note", help: help || [] }; }

  /* ---------- code helpers (all work on the code with comments removed unless they say otherwise) */
  function squash(s) { return String(s).replace(/\s+/g, ""); }
  function body(noC, fn) {                                  /* the text inside void setup() { ... } or void loop() { ... } */
    var m = new RegExp("void\\s+" + fn + "\\s*\\(\\s*\\)\\s*\\{").exec(noC); if (!m) return null;
    var i = m.index + m[0].length, d = 1, j = i; for (; j < noC.length && d > 0; j++) { if (noC[j] === "{") d++; else if (noC[j] === "}") d--; }
    return noC.slice(i, j - 1);
  }
  function stmts(b) { return b ? b.split(";").map(function (x) { return squash(x); }).filter(Boolean) : []; }
  function loopStmts(c) { return stmts(body(c.noComments, "loop")); }
  function setupStmts(c) { return stmts(body(c.noComments, "setup")); }
  function startsWith(arr, want) { return want.every(function (w, i) { return arr[i] === w; }); }
  function delaysIn(c) { var out = [], re = /delay\s*\(\s*(\d+)\s*\)/g, m; while ((m = re.exec(c.noComments))) out.push(+m[1]); return out; }
  /* every line that does something (ends in ; or opens a { ) has a comment on it */
  function everyLineCommented(raw) {
    var lines = raw.split("\n").filter(function (l) { var t = l.replace(/\/\/.*$/, "").trim(); return /;\s*$/.test(t) || /\{\s*$/.test(t); });
    return lines.length > 0 && lines.every(function (l) { return /\/\/\s*\S/.test(l); });
  }
  /* every line that does something has a comment right above it, or at the end of the line */
  function commentAboveEach(raw) {
    var lines = raw.split("\n"), n = 0;
    for (var i = 0; i < lines.length; i++) {
      var code = lines[i].replace(/\/\/.*$/, "").trim(); if (!code || /^[{}]+$/.test(code) || /^\/\*/.test(code)) continue;
      n++; var above = i > 0 && /^\s*\/\/\s*\S/.test(lines[i - 1]), trailing = /\/\/\s*\S/.test(lines[i]); if (!above && !trailing) return false;
    }
    return n > 0;
  }
  /* "choose 6 lines to comment": at least 6 different lines of real code (never a line that is only a bracket, or the void setup() / void loop() line itself)
     have a comment (at the end of the line, or right above it); cls(codeLine) says whether a line is "old" (an earlier idea) or "new" (this lesson's idea).
     At least 3 commented lines must be old and at least 3 new. */
  function sixComments(raw, cls, minOld, minNew) {
    var lines = raw.split("\n"), old = 0, nw = 0;
    for (var i = 0; i < lines.length; i++) {
      var code = lines[i].replace(/\/\/.*$/, "").trim(); if (!code || /^[{}();\s]+$/.test(code) || /^void\s+\w+\s*\(\s*\)\s*\{?$/.test(code) || /^\/\*/.test(code)) continue;
      var trailing = lines[i].match(/\/\/\s*(.*)$/), above = i > 0 ? lines[i - 1].match(/^\s*\/\/\s*(.*)$/) : null, words = function (m) { return m ? m[1].trim().split(/\s+/).filter(Boolean).length : 0; };
      if (words(trailing) < 2 && words(above) < 2) continue;
      var k = cls(code); if (k === "old") old++; else if (k === "new") nw++;
    }
    return old >= (minOld || 3) && nw >= (minNew || 3) && old + nw >= 6;
  }
  /* is there a comment (at least minWords long) right above the line that matches re? */
  function commentAbove(raw, re, minWords) { var lines = raw.split("\n"); for (var i = 1; i < lines.length; i++) if (re.test(lines[i])) { var p = lines[i - 1].match(/^\s*\/\/\s*(.*)$/); if (p && (p[1].trim().split(/\s+/).length >= (minWords || 3))) return true; } return false; }

  /* ---------- circuit and behavior helpers */
  function sameHalf(c, l) { return c.strip(l, "A").slice(-1); }          /* "u" (rows a to e) or "l" (rows f to j) */
  function every(r, fn) { return !!r && r.samples.length > 0 && r.samples.every(fn); }
  /* which LEDs are on (bright) at each sample */
  function litAt(s, ids) { return ids.filter(function (id) { return (s.leds[id] || 0) > 0.25; }); }
  /* a run of samples every `step` ms to find the order lights come on */
  function sampleTimes(until, step) { var t = [], x = step; while (x < until) { t.push(x); x += step; } return t; }
  function sequenceOf(r, ids) {
    var out = []; r.samples.forEach(function (s) { var key = litAt(s, ids).sort().join("+"); if (out.length === 0 || out[out.length - 1] !== key) out.push(key); });
    return out;
  }

  root.ARD_H = { I: I, ASK: ASK, MATCH: MATCH, CLOZE: CLOZE, NOTE: NOTE, squash: squash, body: body, stmts: stmts, loopStmts: loopStmts, setupStmts: setupStmts, startsWith: startsWith, delaysIn: delaysIn,
    everyLineCommented: everyLineCommented, commentAboveEach: commentAboveEach, commentAbove: commentAbove, sixComments: sixComments, sameHalf: sameHalf, every: every, litAt: litAt, sampleTimes: sampleTimes, sequenceOf: sequenceOf };
  root.ARD_SLOTS = [["free", "Free build (practice)"]];
  root.ARD_SLOT_ADD = function (id, label) { root.ARD_SLOTS.push([id, label]); };
})(typeof window !== "undefined" ? window : globalThis);
