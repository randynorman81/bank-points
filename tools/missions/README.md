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
