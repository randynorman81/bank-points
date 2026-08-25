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
  { id: "exit-tickets", name: "Exit Tickets", url: "https://starlit-salmiakki-e2394f.netlify.app/", description: "Sign in with your school Google account to answer an open exit ticket." },
  { id: "bank", name: "Bank Points", url: "https://computer-science-bank.netlify.app/", description: "Check your extra credit points, or request to use some on an assignment." },
  { id: "calendar", name: "Calendar", url: "https://norman-calendar.netlify.app/", description: "Per-class calendars, synced across sections that meet on the same day." }
];

// Site search: a client-side index of everything a search box on this site
// can find. Static entries (courses, units, docs, tools) are built once from
// COURSES/TOOLS above; newsletter posts are fetched once and merged in when
// available, so the box still works instantly even before that fetch lands.
function buildStaticSearchIndex() {
  const entries = [
    { title: "Home", url: NAV_ROOT + "index.html", category: "Site" },
    { title: "Newsletter", url: NAV_ROOT + "newsletter.html", category: "Site" }
  ];
  COURSES.forEach((course) => {
    entries.push({ title: course.name + " — course home", url: NAV_ROOT + course.home, category: course.shortName });
    entries.push({ title: course.name + " — class docs / syllabus", url: NAV_ROOT + course.classDocs, category: course.shortName });
    course.units.forEach((u) => {
      const url = u.migrated ? NAV_ROOT + u.path : u.googleSite;
      entries.push({ title: "Unit " + u.n + ": " + u.title, url, category: course.shortName });
    });
  });
  TOOLS.forEach((t) => {
    if (t.url) entries.push({ title: t.name, url: t.url, category: "Tool" });
  });
  return entries;
}

let SEARCH_INDEX = buildStaticSearchIndex();

(function loadNewsletterIntoSearchIndex() {
  fetch(NAV_ROOT + "api/newsletter?action=list")
    .then((r) => r.json())
    .then((data) => {
      (data.posts || []).forEach((p) => {
        SEARCH_INDEX.push({ title: p.title, url: NAV_ROOT + "newsletter.html", category: "Newsletter" });
      });
    })
    .catch(() => {});
})();

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
          <div class="nav-item${opts.current === "newsletter" ? " current" : ""}">
            <a class="nav-link" href="${NAV_ROOT}newsletter.html">Newsletter</a>
          </div>
        </nav>
        <div class="search-box">
          <input type="search" id="site-search-input" placeholder="Search the site&hellip;" autocomplete="off">
          <div class="search-results" id="site-search-results"></div>
        </div>
      </div>
    </header>
  `;

  setupSiteSearch(root);

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

// Wires the header's search box to SEARCH_INDEX: filters as you type (by
// title, case-insensitive substring match), shows up to 8 results grouped
// with their category, and jumps to the top result on Enter.
function setupSiteSearch(root) {
  const input = root.querySelector("#site-search-input");
  const results = root.querySelector("#site-search-results");
  if (!input || !results) return;

  function render(matches) {
    if (matches.length === 0) {
      results.innerHTML = '<div class="r-empty">No matches.</div>';
      return;
    }
    results.innerHTML = matches.slice(0, 8).map(m => `
      <a href="${m.url}"${/^https?:\/\//.test(m.url) && m.url.indexOf(location.origin) !== 0 ? ' target="_blank" rel="noopener"' : ""}>
        <span class="r-title">${escapeHtmlNav(m.title)}</span><span class="r-cat">${escapeHtmlNav(m.category)}</span>
      </a>
    `).join("");
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove("open"); return; }
    const matches = SEARCH_INDEX.filter(e => e.title.toLowerCase().includes(q));
    render(matches);
    results.classList.add("open");
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) results.classList.add("open");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = results.querySelector("a");
      if (first) { location.href = first.getAttribute("href"); }
    } else if (e.key === "Escape") {
      results.classList.remove("open");
      input.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-box")) results.classList.remove("open");
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
