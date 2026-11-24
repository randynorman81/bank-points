# Audit: assignments, walkthroughs, notes pages (2026-11-23)

Section 1 (the walkthrough flags) was FIXED on 2026-11-24 at Randy's request; the fixes are in `teacher-settings/python-fixes.js` (see "Fixed" below). Nothing else in a walkthrough or a notes page was changed. The rest of this file is for Randy to decide.

## 1. Walkthrough flags (units 3 to 7)

| Walkthrough | What I found |
|---|---|
| a5 (3.5 Indexing), Step 8 | Uses `//` for the middle letter ("what you know about //"), but floor division is not taught until 3.10 (a10). The 3.5 assignment uses the same middle-letter trick because the walkthrough teaches it. |
| a7 (3.7 .find) | Only 1 step and 3 boxes (the other walkthroughs have 6 to 8 steps). It prints four `.find()` results and stops: no slicing around a found position, no email-splitting example. |
| a13 (3.13 Tracing) | No code steps and no boxes, only the 10 multiple-choice questions. |
| a1 to a11 vs a12 and later | The first-step instruction for the heading comment is different: a1 to a11 say "do not press Tab or indent it", a12 onward say "press the Tab key once, then type a comment ... one tab over". |
| a33 (5.5 Libraries) | Three code samples have lost their line breaks on the live site: Step 1 `import math print(math.sqrt(16))`, Step 4 `import random roll = random.randint(1, 6)`, Step 6 `import math def hypotenuse(a, b): ... print(hypotenuse(3, 4))`. |
| a36 (6.3 Practice PT 1) | The walkthrough is the same Color Counter program as the 6.3 assignment (Crayola). The assignment is the same task with different colors, so a student can copy the walkthrough. |

### Fixed (2026-11-24)

| Walkthrough | Fix |
|---|---|
| a5 | Step 8 now introduces `//` in one short paragraph ("floor division, you will practice it in 3.10") and the "How does the middle work?" help says the same. |
| a7 | Two new steps: Step 2 slices around a found position (`email.find("@")`, `email[:at]`, `email[at + 1:]`), Step 3 splits an email the user types with two `.find()` calls. New boxes 3 to 10 and 17 new checks, added after the saved ones. |
| a13 | Three new trace-by-hand code steps (variables that change, text, `//` and `%`) with a trace table written as comments and a prediction on the last line of each. They come before the 10 questions, which are now "Step 4". 29 new checks. |
| a1 to a44 | The first-step instruction now says "at the very left edge (do not press Tab or indent it)" everywhere. Before, a12 to a34 and a39 to a44 said "press the Tab key once". The heading check accepted both, so grading is unchanged. |
| a33 | The three code samples have their line breaks back. |
| 6.3 assignment | Was the same Color Counter as the a36 walkthrough. It is now "Strava Weekly Distance": a list of runs and a procedure that adds up only the runs at least as long as the minimum the user types. Same Create Task parts, different logic. |

## 2. Notes pages versus walkthroughs

I compared the code and headings in each notes page with its walkthrough.

- Unit 3 has no per-lesson notes pages. The notes are `unit-3-study-guide.html`, `user-input.html`, `concatenation.html` and `basic-math.html`. The study guide teaches things the walkthroughs a1 to a13 never practice: constants, the string methods `upper`, `lower`, `strip`, `split`, `isupper`, `islower`, `swapcase`, the shortcut operators `+=`, `-=`, `*=`, and the whole CodeHS graphics section (canvas, shapes).
- 4.6 notes (key events) cover mouse events and `min`/`max`; the walkthrough only does keyboard events.
- 4.8 notes mention `enumerate` and `split`; the walkthrough does not.
- 4.1, 4.2, 4.4, 4.5 notes use `def`, `global`, `return` only inside their Spotify examples (they are examples, not lesson topics).
- Every other notes page (4.1 to 7.6, 9.1) has its code concepts in the matching walkthrough.

## 3. Unit 8 and Unit 10 walkthroughs

| Group | Steps | Boxes | Text per walkthrough |
|---|---|---|---|
| Units 3 to 7 (typical) | 6 to 8 (Unit 6: 12 to 15) | 18 to 46 (Unit 6: 49 to 69) | about 1,000 to 10,000 characters |
| Unit 8 (a45 to a54) | **2** | **4** | about 850 to 900 characters |
| Unit 10 (a101, a103, a105, a107, a124, a125) | 8 to 10 | 17 to 20 | about 4,300 to 5,500 characters (plus about 5,000 to 6,000 characters of code) |

- **Unit 8 is not the same length or scope.** Each walkthrough is two short steps (one example each) with four boxes, so none of them walks through the notes. The lessons with notes content that no walkthrough step touches: ASCII vs Unicode (8.3), metadata (8.4), hex and binary relationship (8.5), repeated patterns in compression (8.8), ways to lose data (8.9), symmetric vs public key encryption and trust on the web (8.10).
- **Unit 10 is close in length and scope** (8 to 10 steps) but has fewer boxes (17 to 20 versus 31 to 46), and there are **no notes pages** for Unit 10 at all.

### Fixed (2026-11-24): the Unit 8 walkthroughs

a45 to a54 were 2 steps and 4 boxes each. They are now 7 to 9 steps and 29 to 33 boxes each, the same pattern as Units 3 to 7: heading-comment box, "comment out above steps" box, a short explanation that names the part of the notes, a help popup, a code sample, a "type it + end-of-line comment" box, a Try-it line, a "below it, type exactly" box, and a last "Put it together" step built from several boxes. Every notes topic now has a step (analog vs digital and sampling, overflow and round-off, bytes and KB/MB, ASCII vs Unicode, metadata, hex and binary, repeated patterns, lossy trade-offs, symmetric vs public key, trust on the web). The 6 questions at the bottom of each walkthrough, the 100% gate and the assignment under it are unchanged.
- Source: `tools/missions/u8-walk.txt` (the lessons) and `u8-walk.js` (the builder). `node tools/missions/u8-build.mjs` runs every step's code in real Python (the page's Try-it lines must match exactly), runs every check through the real scorer, and writes `teacher-settings/python-unit8.js`, which `python-editor.js` lays over the saved short versions.
- Still open: Unit 10 has no notes pages, and the AP Big Idea 5 / parallel computing / data-extraction topics (section 4) have no notes or walkthrough.

### Fixed (2026-11-24): Unit 10 notes and Big Idea 5

- **Unit 10 notes** (7 pages, `apcsp/unit-10/`): highway and bandwidth (10.1), addresses (10.3), router, NAT and DHCP (10.4), DNS (10.5), routing and fault tolerance (10.6), packets and protocols (10.7), and parallel and distributed computing (10.8, new). They use the same words and pictures as the existing Unit 10 walkthroughs (highway, neighborhood, phone book).
- **Big Idea 5** (7 pages): Unit 11 "Effects of the Internet" = beneficial and harmful effects, the digital divide, crowdsourcing and citizen science; Unit 16 "Impact of Computing" = computing bias, copyright / Creative Commons / open source, privacy and PII, safe computing (authentication, MFA, phishing, malware, keyloggers, rogue access points, DDoS). Every page has interactive parts, an "On the AP exam" list, and check-yourself questions.
- **Walkthroughs a194 to a201** for the new pages (10.8, 11.1 to 11.3, 16.1 to 16.4): 7 steps each, a small Python model of the idea plus an end-of-line comment that explains it, a "put it together" step, and 5 exam-style questions.
- Sources: `tools/notes/` (generator, `unit10.py`, `bigidea5.py`; run `python3 tools/notes/build.py`) and `tools/missions/concepts-walk.txt` (run `node tools/missions/u8-build.mjs`).
- Still open: Unit 12 (Data: extracting information, correlation, trends, data privacy) has no notes, and the Big Idea 3 gaps in section 4 (undecidable problems, heuristics, reasonable time).

### Fixed (2026-11-24): Unit 12 Data and the Big Idea 3 gaps

- **Unit 12 Data** (6 notes pages, `apcsp/unit-12/`): extracting information (patterns, trends, correlation vs causation, outliers), big data / metadata / scale, cleaning data, filtering / transforming / combining, visualizing (chart choice and misleading charts), bias and sampling. Walkthroughs a202 to a207.
- **Big Idea 3 gaps** (3 new Unit 7 lessons): 7.7 developing algorithms and equivalent algorithms (with the AP pseudocode table), 7.8 efficiency, reasonable and unreasonable time, decision vs optimization problems, and heuristics, 7.9 undecidable problems and the halting problem. Walkthroughs a208 to a210. The six older Unit 7 pages and the Unit 7 overview now link to them.
- Sources: `tools/notes/data12.py`, `tools/notes/algos7.py` (run `python3 tools/notes/build.py`; it also patches the older Unit 7 pages' nav, safe to repeat) and `tools/missions/concepts-walk.txt`.
- Still thin from the original audit: Big Idea 1 error types by name (syntax, logic, runtime, overflow) are only mentioned in a line or two. Units 13, 14, 15 (Data project, Strings, Personal Data Tracker) and 17 to 21 are still taught in CodeHS only and have no notes here.

## 4. AP CSP exam coverage (Big Ideas 1 to 5)

Keyword scan of all notes pages and all walkthroughs, by topic:

| Big Idea | Covered | Not covered, or only a mention |
|---|---|---|
| 1 Creative Development | purpose, design, documentation, debugging (units 1 and 2 notes, walkthrough comments); collaboration (unit 2 pages) | error types by name (syntax, logic, runtime, overflow) only 1 to 2 mentions |
| 2 Data | binary, bits, lossy vs lossless (unit 8 notes) | extracting information, correlation and trends, data privacy: **none**; overflow, round-off and analog vs digital: notes only |
| 3 Algorithms and Programming | variables, lists, expressions, strings, Booleans, conditionals, iteration, procedures, libraries, random, simulations, linear and binary search | undecidable problems (2 mentions), equivalent algorithms (1), heuristics (2 to 4), reasonable vs unreasonable time (9 to 10) are thin |
| 4 Computer Systems and Networks | IP address, DNS, packets, TCP, routing, fault tolerance, bandwidth (unit 10 walkthroughs) | parallel and distributed computing, speedup: **1 mention**. No notes pages for any of Big Idea 4. |
| 5 Impact of Computing | encryption (8.10 notes) | beneficial and harmful effects, digital divide, computing bias (3 mentions), crowdsourcing and citizen science, copyright, Creative Commons, open source, PII, phishing, multifactor authentication, malware, keylogging, DDoS: **no notes and no walkthrough**. This Big Idea is about a fifth of the exam. |

## 5. The 34 company assignments

- Rebuilt so each one is a single real program in a sensible order: purpose comment, inputs or data, functions at the top (units 5 and 6), then the work, then the output.
- Only code that the matching walkthrough (or an earlier one) shows. A check of every assignment's code against the code samples in the walkthroughs found nothing untaught except `.lower()` in 4.6 (taught in the a21 text, not in a code sample) and `float()` in 3.8 (the lesson's own topic).
- In 3.1 to 3.3 a label and its value print on separate lines, the way those walkthroughs do, because `print("label", value)` is first taught in 3.4.
- Length: 3 or 4 regular steps against 7 or 8 in the walkthrough (6 to 8 boxes against 30 to 46), plus two optional stretch tasks worth +10 in all.
