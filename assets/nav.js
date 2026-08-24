// Shared site header + top nav for the SCHS Computer Science site.
// To add a course: add one object to COURSES below (menu updates everywhere automatically).
// To add a unit to a course's dropdown: add one object to that course's `units` array.
//   - migrated: true  -> links to a page we've rebuilt on this site
//   - migrated: false -> links out to the original Google Site (until that unit is migrated)

const SCHOOL_NAME = "Social Circle High School";

// Every path below is written relative to the CS site's root folder itself
// (no leading slash). NAV_ROOT (computed below from nav.js's own <script src>) gets
// prepended at render time, so the same data works no matter how deep the
// current page is nested — and works when a page is opened directly as a
// file, not just through a web server.
const NAV_ROOT = (function () {
  const script = document.currentScript;
  const src = script ? script.getAttribute("src") || "" : "";
  return src.replace(/assets\/nav\.js(\?.*)?$/, "");
})();

const LOGO_SRC = NAV_ROOT + "assets/logo.png";

const COURSES = [
  {
    id: "ist",
    shortName: "IST",
    name: "Intro to Software Technology",
    home: "ist/index.html",
    classDocs: "ist/class-docs.html",
    googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/home",
    units: [
      { n: 1, title: "Digital Footprint", migrated: true, path: "ist/unit-1/index.html" },
      { n: 2, title: "Intro to Programming (Karel)", migrated: true, path: "ist/unit-2/index.html" },
      { n: 4, title: "Computing Basics", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-4-computing-basics" },
      { n: 5, title: "Operating Systems and Software", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-5-operating-systems-and-software" },
      { n: 6, title: "Project: IT Professional", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-6-project-it-professional" },
      { n: 7, title: "Web Design - HTML", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-7-web-design-html" },
      { n: 8, title: "Intro to CSS", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-8-intro-to-css" },
      { n: 9, title: "Complete Website Project", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-9-complete-website-project" },
      { n: 10, title: "Intro to JavaScript", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-10-intro-to-javascript" },
      { n: 11, title: "Intro to Web Dev (jQuery / CMS)", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/introtosoftwaretech/unit-11-intro-to-web-development-jquery-cms" }
    ]
  },
  {
    id: "apcsp",
    shortName: "AP CSP",
    name: "AP Computer Science Principles",
    home: "apcsp/index.html",
    classDocs: "apcsp/class-docs.html",
    googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/home",
    units: [
      { n: 1, title: "Introduction to Programming", migrated: true, path: "apcsp/unit-1/index.html" },
      { n: 2, title: "Paired Programming Project", migrated: true, path: "apcsp/unit-2/index.html" },
      { n: 3, title: "Programming with Python", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-3-programming-with-python" },
      { n: 4, title: "Python Control Structures", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-4-python-control-structures" },
      { n: 5, title: "Functions and Parameters", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-5-functions-and-parameters" },
      { n: 6, title: "Practice Performance Task", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-6-practice-performance-task" },
      { n: 7, title: "Data Structures", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-7-data-structures" },
      { n: 8, title: "Digital Information", migrated: false, googleSite: "https://sites.google.com/socialcircleschools.org/apcsp/unit-8-digital-information" }
    ]
  },
  {
    id: "ec",
    shortName: "Embedded Computing",
    name: "Embedded Computing",
    home: "ec/index.html",
    classDocs: "ec/class-docs.html",
    googleSite: "https://sites.google.com/socialcircleschools.org/webdev/home",
    units: [
      { n: 1, title: "What Is an Embedded System?", migrated: true, path: "ec/unit-1/index.html" }
    ]
  }
];

// Standalone class tools that live on their own separate sites (not part of
// this repo/deploy). Shows up in a "Class Tools" dropdown on every page, plus
// a card on the homepage. To add one: add one object here. Leave `url` as
// null for a tool that's still being built -- it'll show as "coming soon"
// instead of a link.
const TOOLS = [
  { id: "quizzes", name: "Quizzes", url: "https://quizzescomputerscience.netlify.app/", description: "Sign in with your school Google account to take an open quiz." },
  { id: "bank", name: "Bank Points", url: "https://computer-science-bank.netlify.app/", description: "Check your extra credit points, or request to use some on an assignment." },
  { id: "calendar", name: "Calendar", url: null, description: "Per-class calendars, synced across sections that meet on the same day." }
];

function escapeHtmlNav(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

const PLACEHOLDER_LOGO_SVG = `
<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 3 L44 11 V22 C44 33 36 41 24 45 C12 41 4 33 4 22 V11 Z" fill="#ffffff" stroke="#0a0a0a" stroke-width="2.5"/>
  <text x="24" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#0a0a0a">SC</text>
</svg>`;

window.__placeholderLogo = function () {
  return `<span class="school-logo">${PLACEHOLDER_LOGO_SVG}</span>`;
};

function courseDropdownMarkup(course) {
  const unitLinks = course.units.map(u => {
    if (u.migrated) {
      return `<a href="${NAV_ROOT}${u.path}">Unit ${u.n}: ${escapeHtmlNav(u.title)}</a>`;
    }
    return `<a class="external" href="${u.googleSite}" target="_blank" rel="noopener">Unit ${u.n}: ${escapeHtmlNav(u.title)}</a>`;
  }).join("");

  return `
    <div class="nav-item" data-course="${course.id}">
      <button type="button" class="nav-link" aria-haspopup="true" aria-expanded="false">${escapeHtmlNav(course.shortName)} &#9662;</button>
      <div class="dropdown-panel">
        <a href="${NAV_ROOT}${course.home}"><strong>${escapeHtmlNav(course.name)}</strong> &mdash; course home</a>
        <a href="${NAV_ROOT}${course.classDocs}">Class docs / syllabus</a>
        <hr>
        <div class="dropdown-heading">Units</div>
        ${unitLinks}
        <hr>
        <a class="external" href="${course.googleSite}" target="_blank" rel="noopener">Full course site (Google Sites)</a>
      </div>
    </div>
  `;
}

function toolsDropdownMarkup() {
  const toolLinks = TOOLS.map(t => {
    if (t.url) {
      return `<a class="external" href="${t.url}" target="_blank" rel="noopener">${escapeHtmlNav(t.name)}</a>`;
    }
    return `<span class="dropdown-disabled">${escapeHtmlNav(t.name)} <span class="badge">coming soon</span></span>`;
  }).join("");

  return `
    <div class="nav-item" data-course="tools">
      <button type="button" class="nav-link" aria-haspopup="true" aria-expanded="false">Class Tools &#9662;</button>
      <div class="dropdown-panel">
        ${toolLinks}
      </div>
    </div>
  `;
}

function renderHeader(opts) {
  opts = opts || {};
  const root = document.getElementById("site-header-root");
  if (!root) return;

  const logoMarkup = `<img src="${LOGO_SRC}" alt="${escapeHtmlNav(SCHOOL_NAME)} logo" class="school-logo" onerror="this.outerHTML=window.__placeholderLogo();">`;

  const courseItems = COURSES.map(courseDropdownMarkup).join("");
  const toolsDropdown = toolsDropdownMarkup();

  root.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a href="${NAV_ROOT}index.html" class="brand">
          ${logoMarkup}
          <span class="brand-text">
            <p class="brand-eyebrow">${escapeHtmlNav(SCHOOL_NAME)}</p>
            <h1 class="brand-title">Computer Science</h1>
          </span>
        </a>
        <nav class="main-nav">
          <div class="nav-item${opts.current === "home" ? " current" : ""}">
            <a class="nav-link" href="${NAV_ROOT}index.html">Home</a>
          </div>
          ${courseItems}
          ${toolsDropdown}
        </nav>
      </div>
    </header>
  `;

  root.querySelectorAll(".nav-item[data-course]").forEach(item => {
    const btn = item.querySelector("button.nav-link");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains("open");
      root.querySelectorAll(".nav-item.open").forEach(o => { o.classList.remove("open"); o.querySelector("button.nav-link")?.setAttribute("aria-expanded", "false"); });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", () => {
    root.querySelectorAll(".nav-item.open").forEach(o => { o.classList.remove("open"); o.querySelector("button.nav-link")?.setAttribute("aria-expanded", "false"); });
  });
}

// Renders a grid of unit cards for one course (used on each course's home page).
// Pulls straight from COURSES above, so a course's home page and its nav dropdown
// always agree — flip `migrated` to true and add `path` once a unit is built.
function renderUnitGrid(courseId, containerId) {
  const container = document.getElementById(containerId || "unit-grid-root");
  const course = COURSES.find(c => c.id === courseId);
  if (!container || !course) return;

  container.innerHTML = course.units.map(u => {
    if (u.migrated) {
      return `
        <a class="unit-card" href="${NAV_ROOT}${u.path}">
          <div class="unit-label"><span>Unit ${u.n}</span></div>
          <h3>${escapeHtmlNav(u.title)}</h3>
        </a>`;
    }
    return `
      <a class="unit-card" href="${u.googleSite}" target="_blank" rel="noopener">
        <div class="unit-label"><span>Unit ${u.n}</span><span class="badge on-site">Google Sites</span></div>
        <h3>${escapeHtmlNav(u.title)}</h3>
      </a>`;
  }).join("");
}

// Renders cards for the standalone TOOLS list (used on the homepage).
function renderToolsGrid(containerId) {
  const container = document.getElementById(containerId || "tools-grid-root");
  if (!container) return;

  container.innerHTML = TOOLS.map(t => {
    if (t.url) {
      return `
        <a class="tool-card" href="${t.url}" target="_blank" rel="noopener">
          <h3>${escapeHtmlNav(t.name)} &#8599;</h3>
          <p>${escapeHtmlNav(t.description)}</p>
        </a>`;
    }
    return `
      <div class="tool-card locked">
        <h3>${escapeHtmlNav(t.name)} <span class="badge">coming soon</span></h3>
        <p>${escapeHtmlNav(t.description)}</p>
      </div>`;
  }).join("");
}

window.renderHeader = renderHeader;
window.renderUnitGrid = renderUnitGrid;
window.renderToolsGrid = renderToolsGrid;
window.COURSES = COURSES;
window.TOOLS = TOOLS;
