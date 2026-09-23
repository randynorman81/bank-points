// "Next Two Weeks" widget, shared by IST, APCSP, and EC.
//
// Two source formats feed the same renderer:
//   - fetchStaticWeeks(url): IST/EC's pacing-guide.html, a static page of
//     .pace-row divs (each with a "Week N" + short date like "Sep 21" in
//     .pace-weeks .hint, and content in the row's second child div).
//   - fetchApiWeeks(courseId): APCSP's live calendar, stored server-side and
//     fetched from /api/announcements?action=calendar&course=X. Each week is
//     { label: "Aug 3", month: "August 2026", tag, lines: [...] } -- label
//     has no year, so the year comes from month.
//
// Both produce the same shape: an array of
//   { date: Date, weekLabel: string, isMilestone: bool, contentHtml: string }
// sorted chronologically, which pickCurrentAndNext() and render() both work
// from without caring which source it came from.
//
// Year inference for the static pages (their dates have no year in the
// markup): Aug-Dec is the first calendar year of the school year, Jan-Jul is
// the second. Update SCHOOL_YEAR below each fall.
const SCHOOL_YEAR = { first: 2026, second: 2027 };
const MONTH_NUM = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function yearForMonth(monthAbbr) {
  const m = MONTH_NUM[monthAbbr];
  return m >= 7 ? SCHOOL_YEAR.first : SCHOOL_YEAR.second;
}

// "Sep 21" -> Date. Returns null if it doesn't look like "Mon D" or "Mon DD".
function parseShortDate(text) {
  const m = /([A-Za-z]{3})\w*\s+(\d{1,2})/.exec((text || "").trim());
  if (!m) return null;
  const abbr = m[1][0].toUpperCase() + m[1].slice(1, 3).toLowerCase();
  if (!(abbr in MONTH_NUM)) return null;
  return new Date(yearForMonth(abbr), MONTH_NUM[abbr], parseInt(m[2], 10));
}

async function fetchStaticWeeks(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load " + url);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rows = Array.from(doc.querySelectorAll(".pace-row"));
  const weeks = [];
  rows.forEach((row) => {
    const weeksCell = row.querySelector(".pace-weeks");
    const hint = weeksCell ? weeksCell.querySelector(".hint") : null;
    if (!hint) return; // rows with no date (e.g. the final "not reached" note) aren't schedulable
    const date = parseShortDate(hint.textContent);
    if (!date) return;
    const weekLabel = (weeksCell.childNodes[0] && weeksCell.childNodes[0].textContent || "").trim();
    const contentCell = row.children[1];
    weeks.push({
      date,
      weekLabel,
      isMilestone: row.classList.contains("is-milestone"),
      contentHtml: contentCell ? contentCell.innerHTML : ""
    });
  });
  weeks.sort((a, b) => a.date - b.date);
  return weeks;
}

function escapeHtmlNTW(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

async function fetchApiWeeks(courseId) {
  const res = await fetch("/api/announcements?action=calendar&course=" + encodeURIComponent(courseId), { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load the calendar");
  const data = await res.json();
  const raw = data.weeks || [];
  const weeks = [];
  raw.forEach((w) => {
    const monthMatch = /(\d{4})/.exec(w.month || "");
    const abbrMatch = /([A-Za-z]{3})/.exec(w.label || "");
    const dayMatch = /(\d{1,2})/.exec(w.label || "");
    if (!monthMatch || !abbrMatch || !dayMatch) return;
    const abbr = abbrMatch[1][0].toUpperCase() + abbrMatch[1].slice(1, 3).toLowerCase();
    if (!(abbr in MONTH_NUM)) return;
    const date = new Date(parseInt(monthMatch[1], 10), MONTH_NUM[abbr], parseInt(dayMatch[1], 10));
    const isBreak = /break/i.test(w.tag || "") || ((w.lines || []).length === 1 && /^--.*--$/.test(w.lines[0]));
    const tag = w.tag ? `<span class="pace-tag${isBreak ? " is-red" : ""}">${escapeHtmlNTW(w.tag)}</span>` : "";
    const list = (w.lines || []).map((l) => `<li>${escapeHtmlNTW(l)}</li>`).join("");
    weeks.push({
      date,
      weekLabel: "Week of " + (w.label || ""),
      isMilestone: isBreak,
      contentHtml: `<div class="pace-unit">${tag}</div><ul>${list}</ul>`
    });
  });
  weeks.sort((a, b) => a.date - b.date);
  return weeks;
}

// Each week "owns" the span from its own date up to (not including) the next
// week's date. Today's week is whichever span contains today; before the
// first date, or after the last, falls back to the nearest edge.
function pickCurrentAndNext(weeks) {
  if (weeks.length === 0) return { current: null, next: null, before: false, after: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today < weeks[0].date) return { current: weeks[0], next: weeks[1] || null, before: true, after: false };
  let idx = 0;
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].date <= today) idx = i;
    else break;
  }
  if (idx === weeks.length - 1 && weeks[idx].date <= today) {
    // could still be "current" if within ~6 days of that last date; otherwise we've run off the end
    const daysSince = (today - weeks[idx].date) / 86400000;
    if (daysSince > 6) return { current: weeks[idx], next: null, before: false, after: true };
  }
  return { current: weeks[idx], next: weeks[idx + 1] || null, before: false, after: false };
}

function fmtDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function weekCardHtml(week, label) {
  if (!week) return "";
  return `
    <div class="ntw-card${week.isMilestone ? " ntw-milestone" : ""}">
      <div class="ntw-card-label">${escapeHtmlNTW(label)}</div>
      <div class="ntw-card-when">${escapeHtmlNTW(week.weekLabel)}${week.weekLabel ? " &middot; " : ""}${fmtDate(week.date)}</div>
      <div class="ntw-card-body">${week.contentHtml}</div>
    </div>`;
}

async function renderNextTwoWeeks(rootId, source) {
  const root = document.getElementById(rootId);
  if (!root) return;
  try {
    const weeks = source.type === "api" ? await fetchApiWeeks(source.courseId) : await fetchStaticWeeks(source.url);
    const { current, next, before, after } = pickCurrentAndNext(weeks);
    if (!current) {
      root.innerHTML = '<div class="hint">No pacing data found yet.</div>';
      return;
    }
    let noteHtml = "";
    if (before) noteHtml = '<p class="hint">The school year hasn\'t started yet &mdash; showing the first two scheduled weeks.</p>';
    if (after) noteHtml = '<p class="hint">This is the last week with a scheduled date on the pacing guide.</p>';
    root.innerHTML = noteHtml + `
      <div class="ntw-grid">
        ${weekCardHtml(current, "This Week")}
        ${next ? weekCardHtml(next, "Next Week") : ""}
      </div>`;
  } catch (err) {
    root.innerHTML = '<div class="alert alert-error">Could not load the pacing guide.</div>';
  }
}

window.renderNextTwoWeeks = renderNextTwoWeeks;
