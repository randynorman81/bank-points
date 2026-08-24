# SCHS Computer Science site

A static site (no build step) that houses three course sites: Intro to Software
Technology (`ist/`), AP Computer Science Principles (`apcsp/`), and Embedded
Computing (`ec/`). It deploys as part of the same Netlify site as the rest of
this repo, at `/cs/...`.

## Layout

```
cs/
  index.html            hub homepage (links to all 3 courses)
  assets/
    style.css            all shared styling
    nav.js                header + top dropdown menu + course-home unit grid
    course-nav.js          lesson sidebar + prev/next (used on lesson pages)
    logo.png               redskin head logo
  ist/                    Intro to Software Technology
    index.html              course home
    class-docs.html         syllabus / policies index
    hero.png                home page banner graphic
    unit-1/, unit-2/, ...    one folder per unit
      index.html             unit overview (lists that unit's lessons)
      <lesson-slug>.html      one file per lesson
  apcsp/                  AP CSP  (same shape as ist/)
  ec/                     Embedded Computing  (same shape as ist/)
```

Every internal link uses a root-relative path starting with `/cs/...` (not
`../`), so pages work the same no matter how deeply nested they are. That only
resolves correctly once the site is actually served from a web server (Netlify,
or a local static server) — opening an HTML file directly by double-clicking it
(`file://...`) will not load the CSS/nav correctly.

## How to add a new lesson to an existing unit

1. Copy any existing lesson file in that unit's folder, e.g.
   `cs/ist/unit-1/1-4-copyright-and-ethics.html`, and rename it to a new slug.
2. Edit the `<h1>` and the content sections inside `<article class="lesson-content">`.
3. Add one entry to the `UNIT_LESSONS` array near the bottom of the file —
   **and to every other lesson file in that same unit** (they all share the
   same list so the sidebar and prev/next links stay in sync). Set
   `CURRENT_FILE` to match the new file's name.
4. Add the same lesson card to that unit's `index.html` (copy an existing
   `.unit-card` link block).

## How to add a whole new unit to a course

1. Make a new folder, e.g. `cs/ist/unit-12/`.
2. Copy an existing unit's `index.html` into it and update the title/lessons.
3. Add lesson pages the same way as above, with `UNIT_BASE` set to
   `/cs/ist/unit-12/`.
4. Open `cs/assets/nav.js`, find that course in the `COURSES` array, and either:
   - flip an existing unit entry's `migrated` to `true` and set its `path`
     (once you've actually built that unit), or
   - add a brand new unit object to the `units` array.
   This one file drives both the top-nav dropdown **and** the course home
   page's unit grid — you only edit it in one place.

## How to add a whole new course

1. Make a new top-level folder, e.g. `cs/robotics/`, shaped like `ist/`.
2. Add a new course object to the `COURSES` array in `cs/assets/nav.js`
   (`id`, `shortName`, `name`, `home`, `classDocs`, `googleSite`, `units`).
   It'll automatically show up in the header dropdown and on the hub homepage
   grid — just add a matching `<a class="course-card">` block to `cs/index.html`.

## What's still linking out to Google Sites

Units not yet migrated (everything past Unit 2 in IST and AP CSP, and any
future EC units) link straight to the original Google Sites pages — that's
intentional, not a bug. The dropdown menu and each course's home page mark
those with a "Google Sites" badge. As you migrate more units, flip them over
in `cs/assets/nav.js` per the steps above.

Each course's `class-docs.html` also currently links out to the Google Sites
policy pages, because those pages were still empty stubs on the source site
at migration time. Once you fill in real content there (or tell Claude what
the policies should say), that page can be rebuilt the same way the lesson
pages were.
