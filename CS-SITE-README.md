# SCHS Computer Science site

A static site (no build step) that houses three course sites: Intro to Software
Technology (`ist/`), AP Computer Science Principles (`apcsp/`), and Embedded
Computing (`ec/`). It's the homepage of this Netlify site — the Bank Points
app now lives at `/bank/`.

## Layout

```
index.html              hub homepage (links to all 3 courses)
assets/
  style.css                all shared styling
  nav.js                    header + top dropdown menu + course-home unit grid
  course-nav.js             lesson sidebar + prev/next (used on lesson pages)
  logo.png                  redskin head logo
ist/                     Intro to Software Technology
  index.html                course home
  class-docs.html           syllabus / policies index
  hero.png                  home page banner graphic
  unit-1/, unit-2/, ...      one folder per unit
    index.html                unit overview (lists that unit's lessons)
    <lesson-slug>.html         one file per lesson
apcsp/                   AP CSP  (same shape as ist/)
ec/                      Embedded Computing  (same shape as ist/)
bank/                    the Bank Points app (unrelated site, see root README.md)
```

Every internal link is a relative path (no leading `/`), computed from each
page's own location, so pages work the same whether opened directly as a file
(double-click `index.html`), through a local static server
(`scripts/serve.ps1`), or once deployed to Netlify.

## How to add a new lesson to an existing unit

1. Copy any existing lesson file in that unit's folder, e.g.
   `ist/unit-1/1-4-copyright-and-ethics.html`, and rename it to a new slug.
2. Edit the `<h1>` and the content sections inside `<article class="lesson-content">`.
3. Add one entry to the `UNIT_LESSONS` array near the bottom of the file —
   **and to every other lesson file in that same unit** (they all share the
   same list so the sidebar and prev/next links stay in sync). Set
   `CURRENT_FILE` to match the new file's name.
4. Add the same lesson card to that unit's `index.html` (copy an existing
   `.unit-card` link block).

## How to add a whole new unit to a course

1. Make a new folder, e.g. `ist/unit-12/`.
2. Copy an existing unit's `index.html` into it and update the title/lessons.
3. Add lesson pages the same way as above — lesson pages within a unit only
   ever link to files in their own folder, so `UNIT_BASE` in each page's
   script block just stays `""`.
4. Open `assets/nav.js`, find that course in the `COURSES` array, and either:
   - flip an existing unit entry's `migrated` to `true` and set its `path`
     (once you've actually built that unit), or
   - add a brand new unit object to the `units` array.
   This one file drives both the top-nav dropdown **and** the course home
   page's unit grid — you only edit it in one place. Paths in `COURSES` are
   written relative to the site root, e.g. `"ist/unit-3/index.html"`.

## How to add a whole new course

1. Make a new top-level folder, e.g. `robotics/`, shaped like `ist/`.
2. Add a new course object to the `COURSES` array in `assets/nav.js`
   (`id`, `shortName`, `name`, `home`, `classDocs`, `googleSite`, `units`).
   It'll automatically show up in the header dropdown and on the hub homepage
   grid — just add a matching `<a class="course-card">` block to `index.html`.

## What's still linking out to Google Sites

Units not yet migrated (everything past Unit 2 in IST and AP CSP, and any
future EC units) link straight to the original Google Sites pages — that's
intentional, not a bug. The dropdown menu and each course's home page mark
those with a "Google Sites" badge. As you migrate more units, flip them over
in `assets/nav.js` per the steps above.

Each course's `class-docs.html` also currently links out to the Google Sites
policy pages, because those pages were still empty stubs on the source site
at migration time. Once you fill in real content there (or tell Claude what
the policies should say), that page can be rebuilt the same way the lesson
pages were.

## Clark After Dark Trivia (`tools/trivia/`)

A standalone pub-trivia tool listed under **Class Tools** (`TOOLS` in `assets/nav.js`). Static, no build
step for the site itself; open `tools/trivia/index.html`.

```
tools/trivia/
  index.html  style.css  app.js     UI: Games, Question Bank, My Sets, Host Guide, host "Present" screen
  core.js                           data model, search, random set builder, CSV/TSV for Google Sheets
  pdf.js                            jsPDF builders: team answer sheet (rules header + host bonus boxes),
                                    host answer key, question sheet, tally sheet, bank list
  data/bank.js                      5,000 questions  [id, genre, topic, difficulty, q, answer, [3 wrong]]
  data/games.js                     1,000 games      [no, [35 question ids], tiebreaker id, [2 puzzles], [5 songs]]
  data/extras.js                    93 emoji picture puzzles + 196 music-round songs
scripts/trivia/
  build.py                          regenerates data/*.js  (python3 scripts/trivia/build.py)
  drop.txt                          substrings of questions to remove from the bank
  src/*.py                          question tables + hand-written lines, one file per genre
```

* **Regenerate:** edit `scripts/trivia/src/<genre>.py` (or add to `drop.txt`), then run
  `python3 scripts/trivia/build.py`. The build removes duplicates, answer-in-question give-aways and bad
  distractors, trims to exactly 5,000 with a per-genre cap, then rebuilds all 1,000 games
  (2-3 questions per genre, no repeated subject inside a game, every question used 6-11 times).
* **Per-user data** (My Sets, My Questions) lives in the browser's `localStorage`; the My Sets tab exports/imports JSON.
* **PDF** uses jsPDF 2.5.1 from cdnjs (needs internet); CSV and "Copy for Google Sheets" work offline.
  Google Sheets can open the CSV (File, Import, Upload) or accept the pasted TSV; no Google sign-in is used.
* Bank answers are visible to anyone who can open the page (it is a static site).
