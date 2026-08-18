// Edit these two lines to update the school name/logo — everything else (the class
// menu) is generated automatically from whatever periods exist in the roster data,
// so changing classes year to year just means updating students in the Admin page.
const SCHOOL_NAME = "Social Circle High School";
const LOGO_SRC = "assets/logo.png";

const PLACEHOLDER_LOGO_SVG = `
<svg viewBox="0 0 48 48" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 3 L44 11 V22 C44 33 36 41 24 45 C12 41 4 33 4 22 V11 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5"/>
  <text x="24" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#0a0a0a">SC</text>
</svg>`;

function sortPeriods(periods) {
  return periods.slice().sort((a, b) => {
    const pa = a.match(/^(\d+)\s*([A-Za-z]*)$/);
    const pb = b.match(/^(\d+)\s*([A-Za-z]*)$/);
    if (pa && pb) {
      const letterCompare = pa[2].localeCompare(pb[2]);
      if (letterCompare !== 0) return letterCompare;
      return Number(pa[1]) - Number(pb[1]);
    }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  });
}

function escapeHtmlNav(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function logoMarkup() {
  return `<img src="${LOGO_SRC}" alt="${escapeHtmlNav(SCHOOL_NAME)} logo" class="school-logo" onerror="this.outerHTML=window.__placeholderLogo();">`;
}

window.__placeholderLogo = function () {
  return `<span class="school-logo">${PLACEHOLDER_LOGO_SVG}</span>`;
};

async function renderHeader(activePeriod) {
  const root = document.getElementById("site-header-root");
  if (!root) return;

  root.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="brand">
          ${logoMarkup()}
          <span class="brand-text">
            <p class="brand-eyebrow">SCHS Computer Science</p>
            <h1 class="brand-title">The Bank</h1>
          </span>
        </a>
        <div class="header-actions">
          <a class="btn btn-primary btn-sm" href="my-points.html">My Points</a>
          <a class="btn btn-ghost btn-sm" href="request.html">Request to Use Points</a>
        </div>
      </div>
    </header>
    <nav class="class-nav">
      <div class="nav-inner" id="class-nav-links">
        <a href="index.html" class="${!activePeriod ? "active" : ""}">Home</a>
        <span class="hint" style="align-self:center; margin:0;">Loading classes&hellip;</span>
      </div>
    </nav>
  `;

  try {
    const data = await apiGet("list");
    const students = data.students || [];
    const periods = sortPeriods([...new Set(students.map((s) => s.period))]);

    const linksEl = document.getElementById("class-nav-links");
    const homeLink = `<a href="index.html" class="${!activePeriod ? "active" : ""}">Home</a>`;
    const classLinks = periods
      .map(
        (p) =>
          `<a href="class.html?period=${encodeURIComponent(p)}" class="${activePeriod === p ? "active" : ""}">${escapeHtmlNav(p)}</a>`
      )
      .join("");
    linksEl.innerHTML = homeLink + classLinks;
  } catch (err) {
    const linksEl = document.getElementById("class-nav-links");
    if (linksEl) linksEl.innerHTML = `<a href="index.html" class="${!activePeriod ? "active" : ""}">Home</a>`;
  }
}
