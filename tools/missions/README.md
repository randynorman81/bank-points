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
