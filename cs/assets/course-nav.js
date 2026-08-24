// Renders the lesson sidebar + prev/next links inside a unit.
// Each lesson page defines two globals before including this script:
//   UNIT_LESSONS = [{ title: "1.1 Some Lesson", file: "1-1-some-lesson.html" }, ...]
//   CURRENT_FILE = "1-1-some-lesson.html"   (or "" / omitted on the unit index page)
//   UNIT_TITLE   = "Unit 1: Digital Footprint"
//   UNIT_BASE    = ""   (lesson files always link within their own folder, so this is just "")

function renderCourseSidebar() {
  const root = document.getElementById("lesson-sidebar-root");
  if (!root || typeof UNIT_LESSONS === "undefined") return;

  const items = UNIT_LESSONS.map(l => {
    const isCurrent = l.file === (typeof CURRENT_FILE !== "undefined" ? CURRENT_FILE : "");
    return `<li><a class="${isCurrent ? "current" : ""}" href="${UNIT_BASE}${l.file}">${l.title}</a></li>`;
  }).join("");

  root.innerHTML = `
    <h4>${typeof UNIT_TITLE !== "undefined" ? UNIT_TITLE : "This Unit"}</h4>
    <ol>
      <li><a class="${!CURRENT_FILE ? "current" : ""}" href="${UNIT_BASE}index.html" style="counter-increment:none;">&#8962; Unit overview</a></li>
      ${items}
    </ol>
  `;
}

function renderPrevNext() {
  const root = document.getElementById("prev-next-root");
  if (!root || typeof UNIT_LESSONS === "undefined" || typeof CURRENT_FILE === "undefined" || !CURRENT_FILE) return;

  const idx = UNIT_LESSONS.findIndex(l => l.file === CURRENT_FILE);
  if (idx === -1) return;

  const prev = idx > 0 ? UNIT_LESSONS[idx - 1] : null;
  const next = idx < UNIT_LESSONS.length - 1 ? UNIT_LESSONS[idx + 1] : null;

  root.innerHTML = `
    ${prev ? `<a class="prev" href="${UNIT_BASE}${prev.file}">&larr; ${prev.title}</a>` : `<span class="spacer"></span>`}
    ${next ? `<a class="next" href="${UNIT_BASE}${next.file}">${next.title} &rarr;</a>` : ""}
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCourseSidebar();
  renderPrevNext();
});
