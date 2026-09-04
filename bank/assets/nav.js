// Edit these two lines to update the school name/logo.
const SCHOOL_NAME = "Social Circle High School";
const LOGO_SRC = "assets/logo.png";

const PLACEHOLDER_LOGO_SVG = `
<svg viewBox="0 0 48 48" width="72" height="72" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 3 L44 11 V22 C44 33 36 41 24 45 C12 41 4 33 4 22 V11 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5"/>
  <text x="24" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#0a0a0a">SC</text>
</svg>`;

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

function renderHeader() {
  const root = document.getElementById("site-header-root");
  if (!root) return;

  root.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="../index.html" class="brand">
          ${logoMarkup()}
          <span class="brand-text">
            <p class="brand-eyebrow">SCHS Computer Science</p>
            <h1 class="brand-title">The Bank</h1>
          </span>
        </a>
        <div class="header-actions">
          <a class="btn btn-primary" href="index.html">My Points</a>
          <a class="btn btn-ghost" href="request.html">Request to Use Points</a>
          <a class="btn btn-ghost" href="admin.html">Admin</a>
        </div>
      </div>
    </header>
  `;
}
