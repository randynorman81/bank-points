# SAT English Trap Trainer

A single-page, offline practice tool for the SAT Reading & Writing section, built around
the punctuation traps that separate a ~630 from a ~730: **semicolons, colons, dangling
modifiers, subject–verb agreement, and how phrases and dependent clauses get punctuated.**

- **400 questions**, tagged by category and difficulty (1–3).
- Done in **batches of 20**. Take it as many times as you want.
- **Adaptive:** difficulty rises after 2 correct in a row, falls after 2 misses. Weak
  categories get more questions in the next batch.
- **Every answer** is followed by *the specific trap the test is using* plus the one-line
  rule to remember.
- **Progress is saved** in the browser (localStorage) — stats, coverage, and batch history
  persist between sessions on the same device/browser.
- Built-in **cheat sheet**: the 11 ideas that cover almost every punctuation question.

## Use it

Open **`index.html`** in any modern browser. That's it — no install, no internet needed.
It's one self-contained file, so you can also email it or drop it on a USB stick.

Keyboard while drilling: `1`–`4` pick an answer, `Enter` submits, `Enter` again goes to the
next question.

## Files

| File | What it is |
|---|---|
| `index.html` | **The app.** Self-contained (questions are inlined). This is the thing you open/deploy. |
| `_template.html` | The engine + styles, with `questions.js` referenced externally. Edit engine/UI here. |
| `questions.js` | The 400-question bank. Edit questions here. |
| `build.ps1` | Regenerates `index.html` from `_template.html` + `questions.js`. |

### Editing questions

1. Edit `questions.js` (each item: `id, cat, diff, text, choices[4], answer, trap, wrong, rule`;
   `____` marks the slot in `text`; for two-slot punctuation items the choice is like `", ... ,"`).
2. Run the build:
   ```
   powershell -ExecutionPolicy Bypass -File build.ps1
   ```
3. Reload `index.html`.

Categories (`cat` values): `semicolons`, `colons`, `modifiers`, `sva`, `phrases`, `clauses`, `punct`.

## Reset progress

On the home screen: **Manage → Reset all progress** (clears this browser's saved stats only).
