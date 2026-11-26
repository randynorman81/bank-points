/* FIXES to the Unit 3 to 7 walkthroughs (a1 to a44), kept in the code so they go live with a deploy and need no PIN.
   The walkthrough text itself is saved on the grading server. python-editor.js (PY_PATCHES) runs each function here on a COPY of the saved record
   every time it is shown or scored, so a fix never touches what the server saved and can be removed by deleting its line.
   What is fixed (all found in the 2026-11-23 audit, tools/missions/AUDIT.md):
     a5   Step 8 used // before floor division is taught (3.10). The step now introduces // in one short paragraph.
     a7   one step and three boxes. Two more steps: slice around a found position, and split an email address.
     a13  no code steps. Three trace-by-hand steps in front of the 10 questions.
     a33  three code samples had lost their line breaks.
     the first-step instruction: a12 to a44 told students to press Tab before the "# Step N" comment, a1 to a11 (and a35, a36, Unit 8) say the left edge. All now say the left edge.
   New steps add checks and boxes AFTER the existing ones, so the saved checks keep their box numbers. */

const HEAD_TAB = "First, press the **Tab** key once, then type a comment with the step number and its title, one tab over: ";
const HEAD_EDGE = "First, type a comment with the step number and its title at the very left edge of the line (do not press Tab or indent it): ";

/* every walkthrough that still says "press Tab once" */
export const TAB_SLOTS = ["a12", "a16", "a17", "a18", "a19", "a20", "a21", "a22", "a23", "a26", "a27", "a28", "a29", "a30", "a31", "a32", "a33", "a34", "a39", "a40", "a41", "a42", "a43", "a44"];
export function headingAtEdge(rec) {
  (rec.blocks || []).forEach(function (b) {
    ["make", "build", "where"].forEach(function (k) {
      if (b[k]) b[k] = b[k].map(function (t) { return typeof t === "string" && t.indexOf(HEAD_TAB) === 0 ? HEAD_EDGE + t.slice(HEAD_TAB.length) : t; });
    });
  });
  return rec;
}

/* ---- small builders for the new steps ---- */
const head = (n, t) => ({ make: [HEAD_EDGE + "`# Step " + n + ": " + t + "`. This breaks your code into steps that are easy to read."] });
const OUT_OLD = { make: ["comment out above steps before moving on (ctrl + /)"] };
/* a check: label, pattern, how many times, where (code, comments or text), box number; unc lets a commented-out line of code still count */
const chk = (label, re, min, where, box, unc) => { if (!where && re.indexOf("^\\s*") === 0) re = "^\\s*(?:#\\s*)?" + re.slice(4); /* an end-of-line comment still counts when the student comments the whole line out (Ctrl + /) */ const c = { label: label, re: re, flags: "m", min: min, pts: 1, box: box }; if (where) c.where = where; if (unc) c.unc = true; return c; };
const headChk = (n, box) => ({ label: "Step " + n + ": a \"# Step " + n + ": title\" comment", re: "^\\s*Step\\s*" + n + "\\s*:\\s*\\S", flags: "im", min: 1, pts: 1, where: "comments", box: box });
const insertBefore = (rec, test, blocks) => {
  const i = (rec.blocks || []).findIndex(test);
  if (i < 0) return false;
  rec.blocks.splice.apply(rec.blocks, [i, 0].concat(blocks)); return true;
};
const addTips = (rec, tips) => { rec.tips = Object.assign({}, rec.tips || {}, tips); };

/* ================================================================ a5: the middle letter and // */
/* ================================================================ every Unit 3 walkthrough: wording that no longer matches the editor */
/* The Run button takes the company's color now (it is not always orange), the lesson is opened from the CURRICULUM button (there is no "Assignment box" any more), and the lessons are called
   "Walkthrough N" (an "Assignment N" is the company project that comes after). Only words change: no box, no check and no help button moves. */
export function fixUiWords(rec) {
  const fix = (t) => typeof t !== "string" ? t : t
    .replace(/the orange \*\*Run\*\* button/g, "the **Run** button")
    .replace(/^Why is 8% tax\s+\* 0\.08\?$/, "Why multiply by 0.08 to get 8% tax?")
    .replace(/Sign in with Google \(top right\), pick \*\*Assignment (\d+)\*\* in the Assignment box, choose your \*\*period\*\*, then click \*\*Submit\*\*\./g, "Sign in with Google (at the top), open **Walkthrough $1** with the **CURRICULUM** button, choose your **period**, then click **Submit**.")
    .replace(/Sign in with Google \(top right\), pick Assignment (\d+) in the\.\.\./g, "Sign in with Google (at the top), open Walkthrough $1 with the CURRICULUM button...")
    .replace(/In Assignment (\d+) you typed/g, "In Walkthrough $1 you typed")
    .replace(/problem from Assignment (\d+)\./g, "problem from Walkthrough $1.")
    .replace(/properly in Assignment (\d+)\./g, "properly in Walkthrough $1.");
  const walk = (o) => { if (Array.isArray(o)) return o.map(walk); if (o && typeof o === "object") { const r = {}; Object.keys(o).forEach((k) => { r[k] = (k === "re" || k === "flags" || k === "label" || k === "id") ? o[k] : walk(o[k]); }); return r; } return fix(o); };
  (rec.blocks || []).forEach((b, i) => { rec.blocks[i] = walk(b); });
  if (rec.tips) Object.keys(rec.tips).forEach((k) => { rec.tips[k] = walk(rec.tips[k]); });
  return rec;
}

/* ================================================================ a1: the "# Step N" comments were never scored */
/* Every other Unit 3 walkthrough gives a point for each "# Step N: title" comment the checkbox asks for. a1 (3.1) had the checkboxes but no checks behind them,
   so typing the six step comments earned nothing. These six checks use the same pattern as every other walkthrough. Box numbers: Step 1 = box 0, Step 3 = 4, Step 4 = 8, Step 5 = 13, Step 6 = 18, Step 7 = 23 (Step 2 has no code). */
export function fixA1(rec) {
  const has = (n) => (rec.checks || []).some((c) => c.where === "comments" && c.re && c.re.indexOf("Step\\s*" + n + "\\s*:") >= 0);
  const add = [[1, 0], [3, 4], [4, 8], [5, 13], [6, 18], [7, 23]].filter((x) => !has(x[0])).map((x) => headChk(x[0], x[1]));
  if (add.length) rec.checks = (rec.checks || []).concat(add);
  /* Step 4 is about CAPITAL LETTERS, but the check for the fixed line print(pizza_slices) ignored them, so the broken print(Pizza_slices) (even commented out) earned the credit and a student who never wrote the fixed line still got 100%. It now respects capitals. */
  (rec.checks || []).forEach((c) => { if (/the fixed line print\(pizza_slices\)/.test(c.label || "")) c.flags = String(c.flags || "").replace(/i/g, ""); });
  return rec;
}

export function fixA5(rec) {
  (rec.blocks || []).forEach(function (b) {
    if (typeof b.p === "string" && b.p.indexOf("Here is a trick that connects to what you know about") === 0)
      b.p = "Here is a trick for finding the **middle letter**. The middle index of a string is the length divided by 2, rounded down. Python has an operator for that: `//` is **floor division**. It divides and drops everything after the decimal point, so `6 // 2` is `3` and `5 // 2` is `2`. (You will practice `//` fully in lesson 3.10. Here you only need to know that it gives a **whole number**, and an index has to be a whole number.) [[How does the middle work?|middle]]";
  });
  const t = rec.tips && rec.tips.middle;
  if (t && t.sections && t.sections[0] && t.sections[0].steps) t.sections[0].steps[1] = "`6 // 2` is **3**. `//` is floor division: it divides and drops the decimal part, so you get a whole number, and an index has to be a whole number.";
  return rec;
}

/* ================================================================ a8 (3.8) step 5: the "explain your rule" comment accepted only math / string / text / number / whole / decimal.
   A student who explains the rule in other correct words ("I never calculate with it", "it is just an address", "no arithmetic") got the point refused. The words below are added to the saved pattern (the old words still work). */
export function fixA8(rec) {
  (rec.checks || []).forEach(function (c) {
    if (/end-of-line comment on house_number/.test(c.label || "")) {
      /* the comment must sit at the end of the house_number line itself (the saved pattern let any "int(" or "float" elsewhere count, so this is written out in full) */
      c.where = "raw"; c.flags = "mi";
      c.re = "^[ \\t]*house_number[ \\t]*=[ \\t]*(?:str\\([ \\t]*)?input\\(.*#.*(?:math|string|text|number|whole|decimal|calculat|arithmetic|address|identifier|digit|quantity|comput|multipl|\\bsum\\b|\\bplus\\b|numeric|integer|\\bint\\b|float|\\bid\\b|\\bphone\\b|\\bzip\\b|\\badd(?:ing)?\\b|subtract|divide)";
    }
  });
  return rec;
}

/* ================================================================ a33: code samples that lost their line breaks */
const A33_CODE = {
  "import math print(math.sqrt(16))": "import math\nprint(math.sqrt(16))",
  "import random roll = random.randint(1, 6)\nprint(roll)": "import random\nroll = random.randint(1, 6)\nprint(roll)",
  "import math def hypotenuse(a, b):\n    return math.sqrt(a * a + b * b) print(hypotenuse(3, 4))": "import math\n\ndef hypotenuse(a, b):\n    return math.sqrt(a * a + b * b)\n\nprint(hypotenuse(3, 4))"
};
export function fixA33(rec) {
  (rec.blocks || []).forEach(function (b) { if (typeof b.code === "string" && A33_CODE[b.code]) b.code = A33_CODE[b.code]; });
  return rec;
}

/* ================================================================ a7: finding text (two more steps; boxes 3 to 10) */
export function fixA7(rec) {
  const T = (title, steps) => ({ title: title, sections: steps });
  const done = insertBefore(rec, (b) => b.h === "Before you submit", [
    { h: "Step 2: Slice around what .find() found" },
    head(2, "Slice around what .find() found"),
    OUT_OLD,
    { p: "`.find()` tells you **where** text starts, and that is exactly what a slice needs. Find the `@` in an email address, then slice the part before it and the part after it. [[How do the slices use `at`?|atslice]]" },
    { code: "email = \"sam@school.org\"\nat = email.find(\"@\")\nprint(at)\nprint(email[:at])\nprint(email[at + 1:])" },
    { tips: ["atslice", "step2what", "ownkim"] },
    { make: ["Type the code. Add an **end-of-line comment** at the end of the `at = email.find(\"@\")` line saying what `at` holds. [[What do I write?|step2what]]"] },
    { p: "\u25b6 **Try it:** It prints 3, then sam, then school.org." },
    { make: ["Below it, try another address: type exactly `email = \"kim@mail.com\"`, `at = email.find(\"@\")`, and `print(email[:at])`. [[Show me|ownkim]]"] },
    { p: "\u25b6 **Try it:** It should print kim." },
    { h: "Step 3: Split an address the user types" },
    head(3, "Split an address the user types"),
    OUT_OLD,
    { p: "Now let the user type the address. Use `.find()` **twice**: once for the `@` and once for the `.`. Then slice three pieces: the name before the `@`, the site between the `@` and the `.`, and the ending after the `.`. This works for an address like `sam@school.org`, where the name has no dot in it. [[How do I get the middle piece?|domslice]]" },
    { code: "email = input(\"Email? \")\nat = email.find(\"@\")\ndot = email.find(\".\")\nprint(email[:at])\nprint(email[at + 1:dot])\nprint(email[dot + 1:])" },
    { tips: ["domslice", "step3what", "ownat"] },
    { make: ["Type the code. Add an **end-of-line comment** at the end of the `print(email[at + 1:dot])` line saying which piece of the address it prints. [[What do I write?|step3what]]"] },
    { p: "\u25b6 **Try it:** Run it and type `sam@school.org`. It prints sam, then school, then org." },
    { make: ["Below it, type exactly `print(email[at:])`. [[Show me|ownat]]"] },
    { p: "\u25b6 **Try it:** It should print @school.org. The slice starts **at** the `@`, so the `@` is included." }
  ]);
  if (!done) return rec;
  addTips(rec, {
    atslice: T("How do the slices use at?", [
      { p: "`email.find(\"@\")` gives the index where the `@` sits. For `sam@school.org` that is 3, because `s` is 0, `a` is 1, `m` is 2 and `@` is 3." },
      { rows: [["email[:at]", "sam", "from the start up to, but not including, index 3"], ["email[at + 1:]", "school.org", "starts one past the `@`, so the `@` itself is left out"]] },
      { good: "`at + 1` is the index right after the `@`. You do not have to count the letters yourself. `.find()` counted for you." }
    ]),
    step2what: T("What should the comment on the find line say?", [
      { ex: ["at = email.find(\"@\")   # at holds the index where the @ starts, which is 3"] },
      { good: "Put the comment at the end of the `at = ...` line, after the code." }
    ]),
    ownkim: T("What do I type for the second address?", [
      { ex: ["email = \"kim@mail.com\"", "at = email.find(\"@\")", "print(email[:at])   # kim"] },
      { p: "The same three lines work for any address, because `.find()` finds the `@` wherever it is." }
    ]),
    domslice: T("How do I get the middle piece?", [
      { p: "The site name sits between the `@` and the `.`. Start one past the `@` and stop at the `.`:" },
      { ex: ["print(email[at + 1:dot])   # school"] },
      { rows: [["email[:at]", "sam", "before the @"], ["email[at + 1:dot]", "school", "between the @ and the ."], ["email[dot + 1:]", "org", "after the ."]] }
    ]),
    step3what: T("What should the comment say?", [
      { ex: ["print(email[at + 1:dot])   # the site name, between the @ and the dot"] },
      { good: "Put the comment at the end of that print line, after the code." }
    ]),
    ownat: T("What does print(email[at:]) show?", [
      { p: "The slice starts **at** the `@` and goes to the end, so the `@` is part of the answer:" },
      { ex: ["print(email[at:])   # @school.org"] },
      { p: "Compare it with `email[at + 1:]`, which starts one index later and leaves the `@` out." }
    ])
  });
  rec.checks = (rec.checks || []).concat([
    headChk(2, 3),
    chk("Step 2: email = \"sam@school.org\"", "^\\s*email\\s*=\\s*[\"']sam@school\\.org[\"']\\s*$", 1, "code", 5, true),
    chk("Step 2: at = email.find(\"@\")", "^\\s*at\\s*=\\s*email\\.find\\(\\s*[\"']@[\"']\\s*\\)", 1, "code", 5, true),
    chk("Step 2: print(at)", "^\\s*print\\(\\s*at\\s*\\)\\s*$", 1, "code", 5, true),
    chk("Step 2: print(email[:at])", "^\\s*print\\(\\s*email\\[\\s*:\\s*at\\s*\\]\\s*\\)", 1, "code", 5, true),
    chk("Step 2: print(email[at + 1:])", "^\\s*print\\(\\s*email\\[\\s*at\\s*\\+\\s*1\\s*:\\s*\\]\\s*\\)", 1, "code", 5, true),
    chk("Step 2: what at holds, as a comment at the end of the find line", "^\\s*at\\s*=\\s*email\\.find\\(\\s*[\"']@[\"']\\s*\\)\\s*#\\s*\\S+(?:\\s+\\S+){2,}", 1, "", 5),
    chk("Step 2: email = \"kim@mail.com\"", "^\\s*email\\s*=\\s*[\"']kim@mail\\.com[\"']\\s*$", 1, "code", 6, true),
    chk("Step 2: at = email.find(\"@\") (typed 2 times)", "^\\s*at\\s*=\\s*email\\.find\\(\\s*[\"']@[\"']\\s*\\)", 2, "code", 6, true),
    chk("Step 2: print(email[:at]) (typed 2 times)", "^\\s*print\\(\\s*email\\[\\s*:\\s*at\\s*\\]\\s*\\)", 2, "code", 6, true),
    headChk(3, 7),
    chk("Step 3: email = input(...)", "^\\s*email\\s*=\\s*input\\(", 1, "code", 9, true),
    chk("Step 3: at = email.find(\"@\") (typed 3 times)", "^\\s*at\\s*=\\s*email\\.find\\(\\s*[\"']@[\"']\\s*\\)", 3, "code", 9, true),
    chk("Step 3: dot = email.find(\".\")", "^\\s*dot\\s*=\\s*email\\.find\\(\\s*[\"']\\.[\"']\\s*\\)", 1, "code", 9, true),
    chk("Step 3: print(email[:at]) (typed 3 times)", "^\\s*print\\(\\s*email\\[\\s*:\\s*at\\s*\\]\\s*\\)", 3, "code", 9, true),
    chk("Step 3: print(email[at + 1:dot])", "^\\s*print\\(\\s*email\\[\\s*at\\s*\\+\\s*1\\s*:\\s*dot\\s*\\]\\s*\\)", 1, "code", 9, true),
    chk("Step 3: print(email[dot + 1:])", "^\\s*print\\(\\s*email\\[\\s*dot\\s*\\+\\s*1\\s*:\\s*\\]\\s*\\)", 1, "code", 9, true),
    chk("Step 3: which piece it prints, as a comment at the end of the middle print line", "^\\s*print\\(\\s*email\\[\\s*at\\s*\\+\\s*1\\s*:\\s*dot\\s*\\]\\s*\\)\\s*#\\s*\\S+(?:\\s+\\S+){2,}", 1, "", 9),
    chk("Step 3: print(email[at:])", "^\\s*print\\(\\s*email\\[\\s*at\\s*:\\s*\\]\\s*\\)", 1, "code", 10, true)
  ]);
  return rec;
}

/* ================================================================ a13: tracing (three code steps; boxes 0 to 10) */
export function fixA13(rec) {
  const T = (title, steps) => ({ title: title, sections: steps });
  const done = insertBefore(rec, (b) => typeof b.p === "string" && b.p.indexOf("Scroll down and answer the") === 0, [
    { h: "Step 1: Trace variables that change" },
    head(1, "Trace variables that change"),
    { p: "Tracing means acting like the computer: go **one line at a time** and write down what changed. Trace this program **before** you run it. [[How do I write the trace?|trace1]]" },
    { code: "x = 4\ny = x + 3\nx = y * 2\nprint(x)\nprint(y)" },
    { tips: ["trace1", "own1"] },
    { make: ["Type the code. **Above** it, write a trace table as three comments that start `# line 1:`, `# line 2:` and `# line 3:`, each with the value that line stores. For example: `# line 1: x = 4`. [[What do I write?|trace1]]"] },
    { p: "\u25b6 **Try it:** Run it and check your trace. It prints 14 and then 7." },
    { make: ["Below it, change `x` again: type exactly `x = x - 5` and `print(x)`. Add an **end-of-line comment** at the end of that `print(x)` line with what you predict, **before** you run it. [[Show me|own1]]"] },
    { p: "\u25b6 **Try it:** It should print 9." },
    { h: "Step 2: Trace text" },
    head(2, "Trace text"),
    OUT_OLD,
    { p: "Now trace a program that works with a string. Remember that an index starts at 0 and a slice leaves out the stop. [[How do I write the trace?|trace2]]" },
    { code: "word = \"robot\"\nfirst = word[0]\nrest = word[1:]\nprint(rest + first)" },
    { tips: ["trace2", "own2"] },
    { make: ["Type the code. **Above** it, write a trace table as three comments that start `# line 1:`, `# line 2:` and `# line 3:`, each with what that line stores. [[What do I write?|trace2]]"] },
    { p: "\u25b6 **Try it:** It prints obotr. The `+` joins `rest` and `first`." },
    { make: ["Below it, type exactly `print(len(word) * 2)`. Add an **end-of-line comment** at the end of that line with what you predict, **before** you run it. [[Show me|own2]]"] },
    { p: "\u25b6 **Try it:** It should print 10." },
    { h: "Step 3: Trace // and %" },
    head(3, "Trace // and %"),
    OUT_OLD,
    { p: "The last trace uses floor division and the remainder. Work out each line by hand, then check. [[How do I write the trace?|trace3]]" },
    { code: "total = 17\ngroups = total // 5\nleft = total % 5\nprint(groups)\nprint(left)" },
    { tips: ["trace3", "own3"] },
    { make: ["Type the code. **Above** it, write a trace table as three comments that start `# line 1:`, `# line 2:` and `# line 3:`, each with the value that line stores. [[What do I write?|trace3]]"] },
    { p: "\u25b6 **Try it:** It prints 3 and then 2." },
    { make: ["Below it, type exactly `total = total + 4` and `print(total // 5)`. Add an **end-of-line comment** at the end of the `print` line with what you predict, **before** you run it. [[Show me|own3]]"] },
    { p: "\u25b6 **Try it:** It should print 4." },
    { h: "Step 4: Trace ten programs" }
  ]);
  if (!done) return rec;
  addTips(rec, {
    trace1: T("How do I write the trace?", [
      { p: "Go one line at a time. After each line, write what changed. Put the table **above** the code and do it **before** you run:" },
      { ex: ["# line 1: x = 4", "# line 2: y = 7        (x + 3, and x is 4)", "# line 3: x = 14       (y * 2, and y is 7)"] },
      { good: "Line 3 gives `x` a **new** value. The old 4 is gone. That is why the program prints 14, not 4." }
    ]),
    own1: T("What do I type, and what should I predict?", [
      { ex: ["x = x - 5", "print(x)   # x was 14, minus 5, so 9"] },
      { p: "Work it out before you run: `x` was 14, so `x - 5` is 9." }
    ]),
    trace2: T("How do I trace the string program?", [
      { ex: ["# line 1: word = \"robot\"", "# line 2: first = \"r\"       (index 0)", "# line 3: rest = \"obot\"      (from index 1 to the end)"] },
      { p: "The last line joins `rest` and `first` with `+`, so it displays `obot` followed by `r`: `obotr`." }
    ]),
    own2: T("What do I type, and what should I predict?", [
      { ex: ["print(len(word) * 2)   # robot has 5 letters, times 2, so 10"] }
    ]),
    trace3: T("How do I trace // and %?", [
      { ex: ["# line 1: total = 17", "# line 2: groups = 3     (17 // 5 drops the .4)", "# line 3: left = 2       (17 % 5 is the remainder)"] },
      { p: "5 fits into 17 three times (15), and 2 is left over." }
    ]),
    own3: T("What do I type, and what should I predict?", [
      { ex: ["total = total + 4", "print(total // 5)   # total is 21, and 21 // 5 is 4"] }
    ])
  });
  rec.checks = (rec.checks || []).concat([
    headChk(1, 0),
    chk("Step 1: the trace comment for line 1 (x is 4)", "^\\s*line\\s*1\\s*:.*\\b4\\b", 1, "comments", 1),
    chk("Step 1: the trace comment for line 2 (y is 7)", "^\\s*line\\s*2\\s*:.*\\b7\\b", 1, "comments", 1),
    chk("Step 1: the trace comment for line 3 (x is 14)", "^\\s*line\\s*3\\s*:.*\\b14\\b", 1, "comments", 1),
    chk("Step 1: x = 4", "^\\s*x\\s*=\\s*4\\s*$", 1, "code", 1, true),
    chk("Step 1: y = x + 3", "^\\s*y\\s*=\\s*x\\s*\\+\\s*3\\s*$", 1, "code", 1, true),
    chk("Step 1: x = y * 2", "^\\s*x\\s*=\\s*y\\s*\\*\\s*2\\s*$", 1, "code", 1, true),
    chk("Step 1: print(x) and print(y)", "^\\s*print\\(\\s*[xy]\\s*\\)", 2, "code", 1, true),
    chk("Step 1: x = x - 5", "^\\s*x\\s*=\\s*x\\s*-\\s*5\\s*$", 1, "code", 2, true),
    chk("Step 1: your prediction (9) as a comment at the end of the print(x) line", "^\\s*print\\(\\s*x\\s*\\)\\s*#.*\\b9\\b", 1, "", 2),
    headChk(2, 3),
    chk("Step 2: the trace comment for line 1 (robot)", "^\\s*line\\s*1\\s*:.*robot", 1, "comments", 5),
    chk("Step 2: the trace comment for line 2 (r)", "^\\s*line\\s*2\\s*:.*\\br\\b", 1, "comments", 5),
    chk("Step 2: the trace comment for line 3 (obot)", "^\\s*line\\s*3\\s*:.*obot", 1, "comments", 5),
    chk("Step 2: word = \"robot\"", "^\\s*word\\s*=\\s*[\"']robot[\"']\\s*$", 1, "code", 5, true),
    chk("Step 2: first = word[0]", "^\\s*first\\s*=\\s*word\\[\\s*0\\s*\\]\\s*$", 1, "code", 5, true),
    chk("Step 2: rest = word[1:]", "^\\s*rest\\s*=\\s*word\\[\\s*1\\s*:\\s*\\]\\s*$", 1, "code", 5, true),
    chk("Step 2: print(rest + first)", "^\\s*print\\(\\s*rest\\s*\\+\\s*first\\s*\\)", 1, "code", 5, true),
    chk("Step 2: print(len(word) * 2)", "^\\s*print\\(\\s*len\\(\\s*word\\s*\\)\\s*\\*\\s*2\\s*\\)", 1, "code", 6, true),
    chk("Step 2: your prediction (10) as a comment at the end of that line", "^\\s*print\\(\\s*len\\(\\s*word\\s*\\)\\s*\\*\\s*2\\s*\\)\\s*#.*\\b10\\b", 1, "", 6),
    headChk(3, 7),
    chk("Step 3: the trace comment for line 1 (17)", "^\\s*line\\s*1\\s*:.*\\b17\\b", 1, "comments", 9),
    chk("Step 3: the trace comment for line 2 (3)", "^\\s*line\\s*2\\s*:.*\\b3\\b", 1, "comments", 9),
    chk("Step 3: the trace comment for line 3 (2)", "^\\s*line\\s*3\\s*:.*\\b2\\b", 1, "comments", 9),
    chk("Step 3: total = 17", "^\\s*total\\s*=\\s*17\\s*$", 1, "code", 9, true),
    chk("Step 3: groups = total // 5", "^\\s*groups\\s*=\\s*total\\s*//\\s*5\\s*$", 1, "code", 9, true),
    chk("Step 3: left = total % 5", "^\\s*left\\s*=\\s*total\\s*%\\s*5\\s*$", 1, "code", 9, true),
    chk("Step 3: print(groups) and print(left)", "^\\s*print\\(\\s*(?:groups|left)\\s*\\)", 2, "code", 9, true),
    chk("Step 3: total = total + 4", "^\\s*total\\s*=\\s*total\\s*\\+\\s*4\\s*$", 1, "code", 10, true),
    chk("Step 3: your prediction (4) as a comment at the end of the print line", "^\\s*print\\(\\s*total\\s*//\\s*5\\s*\\)\\s*#.*\\b4\\b", 1, "", 10)
  ]);
  return rec;
}


/* ================================================================ a21 (Unit 4, 4.6): two help boxes the Step 7 links point to were never written */
/* "How do I trace it?" in Step 7 links to traceA and traceB, which did not exist. They explain the two exam programs shown in that step. */
export function fixA21(rec) {
  addTips(rec, {
    traceA: { title: "How do I trace Program A?", sections: [{ steps: [
      "`describe(\"a\")` is the first call. The key is `\"a\"`, so `IF (key = \"a\")` is true and it displays `left`.",
      "`describe(\"d\")` is the second call. The key is `\"d\"`, so the `IF` is false and the `ELSE` displays `other`.",
      "Program A displays `left` and then `other`."] }] },
    traceB: { title: "How do I trace Program B?", sections: [{ steps: [
      "`score` starts at 0.",
      "`handle(\"space\")`: the key is `\"space\"`, so `score` becomes 0 + 10 = 10.",
      "`handle(\"x\")`: the key is not `\"space\"`, so the `ELSE` runs. Inside it, `IF (key = \"x\")` is true, so `score` becomes 10 - 5 = 5.",
      "`handle(\"space\")` again: `score` becomes 5 + 10 = 15.",
      "`DISPLAY(score)` shows 15."] }] }
  });
  return rec;
}

/* ================================================================ a23 (Unit 4, 4.8): the "Show me" help box in Step 6 (countE) was never written */
export function fixA23(rec) {
  addTips(rec, { countE: { title: "Show me: counting the letter e", sections: [
    { p: "The loop visits each letter of `\"excellent\"` once. Each time the letter is an `\"e\"`, the counter goes up by 1:" },
    { ex: ["count = 0", "for letter in \"excellent\":", "    if letter == \"e\":", "        count = count + 1", "print(count)   # shows 3"] },
    { p: "The letters of `\"excellent\"` are e, x, c, e, l, l, e, n, t. There are 3 `\"e\"`s, so `3` is displayed. The `print` is not indented, so it runs once, after the loop." }
  ] } });
  return rec;
}
