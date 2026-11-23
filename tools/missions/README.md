# Walkthrough + Mission pairs

Each concept is two items in the Python editor:

| Item | Points | What it is | Opens when |
|---|---|---|---|
| Walkthrough | 50 | notes typed as comments + labs, 20 to 30 minutes | the previous Mission is at 90+ (or it starts a chain with `fresh`) |
| Mission | 100 | a game the student programs, graded by built-in tests (PASS/FAIL) | the Walkthrough reaches **100** on the auto-checker and is submitted |

90 on a Mission turns it in for 90 points and opens the next Walkthrough. 100 is full points.

## Files
- `core.js` builds server records from step-by-step definitions (reuses `python/appendix-a-core.js`).
- `u10-*.js`, `u07-*.js` one file per pair (the content). `index.js` loads them all.
- `python/lib/netlab.py`, `python/lib/toonlab.py` the libraries the Missions import (picture helpers, mission banners, built-in tests). Students never see these as assignments; the editor loads them on `import netlab`.
- `test.mjs` runs EVERY step of EVERY record through the real editor and the REAL server scoring function, and checks: each step completes its checkboxes, nothing earned is lost later, the finished program is exactly 100%, a second run scores the same, and faking the output scores near 0.
- `publish.mjs` uploads the records (hidden) to the live grading server.

## Commands (serve the repo first: `python3 -m http.server 8124` in the repo root)
```
node tools/missions/test.mjs                 # all records
node tools/missions/test.mjs a101,a102       # some
ADMIN_PIN=xxxx node tools/missions/publish.mjs --verify=tools/missions/testkit/verify.json
```

## Opening a pair for students
Records are published with `live: false`. In `teacher-settings/python-editor.js` change the slot's line to `live: true` and push + deploy. No PIN needed.

## The two survival-horror adventures (a122 Castle Byte, a123 Dead Signal)
Whole-unit point-and-click horror games (Unit 8 and Unit 10). Each room is one lesson with two locks; a boss room mixes everything. The player picks **Learn mode** (glowing objects teach the lesson, a journal keeps the pages, more lives) or **Challenge mode** (no notes, hints removed from the questions, explanations only in the end review).
- Questions and answers live on the server only: `netlify/functions/advbank.js` (built on the helpers in `gamebank.js`; `challengeQ` strips hints).
- Art and engine: `python/games/adv-art.js` (every sprite, room and prop is drawn in code), `adv-engine.js`, content in `adv-castle.js` and `adv-signal.js`; the shared sign-in and question widgets are in `engine.js` and `play.html`.
- Tests: `node tools/missions/gametest.mjs` (questions), `node tools/missions/advplay.mjs [shots] [slots] [modes] [scenarios]` (plays both games in a real browser), `node tools/missions/advserve.mjs` (dev server to play by hand at `play.html?slot=a122&teacher`, PIN 1234).
- Unit 10 explanations from the teacher's own analogies (highway and lanes, vehicles, modem versus router, neighborhood and NAT) are in `u10-highway.js` (a124, a125) and in the Learn-mode pages of Dead Signal.

## Every lesson in Units 3 to 6 = notes + walkthrough + ASSIGNMENT + GAME (a126 to a193)
- `py-table.js` is the table: one row per lesson (34 lessons) with the slot ids. Assignments are a126 to a159 (100 points, Unit 6.1 and 6.2 are 50), games are a160 to a193 (OPTIONAL BONUS, 10 points each). The existing walkthroughs (a1 to a36) are untouched.
- The 34 graded assignments are real-company jobs (Spotify, Apple, TikTok, Nintendo, Netflix, Tesla, Delta, ...): 4 or 5 steps each, about half the typed code of the matching walkthrough, covering its main ideas, with NO code or hints on the page (names and output labels are the spec; the student writes the program). The content is in `asg-u3.js`, `asg-u4.js`, `asg-u5.js` (helpers in `asg-kit.js`); `u03-python-assign.js` builds the records. Rules for writing one: a real company and a real kind of problem in the intro; every stage names the variables/functions to use and the exact output labels, never shows code; at least one stage per major walkthrough concept; "# LABEL:" comment stages (with a word minimum) cover ideas that have no output; hidden reference solutions (`ref` adds lines, `refCode` is the whole program). `node tools/missions/test.mjs a126,...` runs every step through the real editor and the real server scorer.
- `u03-python-games.js` makes the 34 game records. The questions are in `netlify/functions/pybank.js`, `pybank3.js` (Unit 3) and `pybank4.js` (Units 4 to 6): generated from a seed, answers server-side only.
- `node tools/missions/pycheck.mjs all 60` runs every generated code question in REAL Python and proves the answer key matches what the program prints (about 15,000 programs).
- All are published hidden (`live: false`). The assignment gates (submit it at any score to open the next walkthrough). The game does NOT gate: its record has `optional: true` (set in `u03-python-games.js`, passed by `bundle.mjs` and `adminSetLive`), `inChain()` in `pycode.js` skips optional records, the lesson picker labels it "Bonus game" and leaves it out of the "done" count, and the gradebook shows "bonus pts".
- The editor's Lessons picker (`python/lessons.js`) shows each lesson as one box with its four parts.

## The arcade games (all 34 lesson games)
- Every lesson game is a real little arcade game: the four answers are IN the game and the student answers by playing. The server still judges (`PGE.submit`), the questions are unchanged. Names, stories and controls live in `python/games/arcade-info.js` (also used by `u03-python-games.js`).
- Code: `python/games/arcade.js` (the `ArcadeKit` toolkit + games 3.1 to 3.7), `arcade2.js` (3.8 to 3.13), `arcade3.js` (4.1 to 4.6), `arcade4.js` (4.7 to 4.11), `arcade5.js` (5.1 to 6.3). Each game is `K.make(id, { build, step, draw, key/down/move/up })` and calls `K.commit(this, answerIndex)`.
- Long answers do not fit on the little things in a game, so `engine.js` lists the full answers under the game (`#arcAns`) when any answer is over 22 characters.
- `node tools/missions/arcplay.mjs <shots-folder> a160,a161,...` plays every game in headless Chrome with a bot (`window.__arc.auto(i)` makes a game play itself toward answer i using its own controls and physics) and checks that every round can be won and a perfect run scores 100. Each game's bot lives in its `step()` under `this.bot !== null`.

## Workplace skin and stretch (extra credit) steps (ALL 34 assignments, a126 to a159)
- `python/workplace.js` gives an assignment a company look: brand-colored header (name in its colors, no official logos), an email from the boss, a files panel (clickable text files), a "Send to <boss>" button, and a review reply written from the student's real auto-check results (Approved / Changes requested, one line per step). It only applies when the saved record's title contains the entry's `match`, so old records are never mismatched with the new email. Rendering code: `workFor / workHtml / workReview / workSend` in `python/editor.html`. Everything in it is made up and carries a "classroom simulation" note.
- Stretch steps: `X(...)` in `asg-kit.js` (used in asg-u3.js / asg-u4.js after `ASG.<id>.stages.push`). Each check is worth +1 and is marked `bonus: true` in the record (label prefix "Bonus (+N): " in core.js). `scoreCode` in `netlify/functions/pycode.js` never lets bonus checks change the percent; it returns `bonus: {earned, max, missing}`, and the auto grade is `pct + earned` only once pct is 100 (so a score can reach 110). `test.mjs` checks the reference earns every stretch point.
- All 34 are skinned (2026-11-23). The first three (a126, a127, a150) are written out in `python/workplace.js`; the other 31 use the compact builder `PYW_MK` in `workplace2.js` (Unit 3), `workplace3.js` (Unit 4) and `workplace4.js` (Units 5 and 6). Their stretch steps are in `asg-x3.js`, `asg-x4.js`, `asg-x5.js` (required by `u03-python-assign.js`). Every assignment has exactly two stretch steps worth +10 in all (the test prints the total); the ticket line says "worth N points" from the entry's `points` (50 for 6.1 and 6.2).
- To skin another assignment: add an entry in workplace.js (stages lines in step order, regular steps first, then stretch steps) and push the stretch steps with X(). Boxes map to steps as 2 per step (type box, run box), so every step needs both.

## Everything open, and no PIN needed (2026-11-23)
- `OPEN_EVERYTHING = true` in `teacher-settings/python-editor.js` makes every slot live, ungated and unheld for everyone (including Quiz 8), and lets games be played as a guest (no sign-in, nothing saved, no answers shown). When the curriculum is finished set it to `false` and the per-slot lines in that file take over again.
- The records for a101 to a193 are bundled in `teacher-settings/python-records.js` (the repo copy wins over the saved one), so content goes live with `git push` + `wrangler deploy`; `publish.mjs` and the admin PIN are no longer needed for them. After changing any content in tools/missions: start `node tools/missions/devserver.mjs 8124`, run `node tools/missions/bundle.mjs`, commit, deploy. (New slots outside a101 to a193 still need a line added to `bundle.mjs`'s range.)
