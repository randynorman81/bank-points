/* The page as a student has it AFTER finishing each step of a walkthrough (steps 1..n-1; the last step only checks and submits).
   lab_stages_verify.mjs: every box of steps 1..k must be met on stage k, and the NEXT step must not already be fully met. */
const LAB = "https://schscomputerscience.com/ist/unit-6/lab/";
const pg = (title, body, { head = "", bodyAttr = "" } = {}) => `<!DOCTYPE html>\n<html>\n<head>\n<title>${title}</title>\n${head}</head>\n<body${bodyAttr}>\n${body}</body>\n</html>\n`;
export const STAGES = {};

STAGES["6.1w"] = [
  pg("Slice House", ""),
  pg("Slice House", "<h1>Slice House</h1>\n"),
  pg("Slice House", "<h1>Slice House</h1>\n<h2>Our Story</h2>\n<p>Slice House opened in 2019 with one oven and a big idea.</p>\n"),
  pg("Slice House", "<h1>Slice House</h1>\n<h2>Our Story</h2>\n<p>Slice House opened in 2019 with one oven and a big idea.</p>\n<h2>Our Menu</h2>\n<p>We bake cheese, pepperoni, and veggie pizza every day.</p>\n"),
];

const arcadeBody = (h1 = "", h2 = "", p = "") => `<h1${h1}>Pixel Arcade</h1>\n<h2${h2}>Top Games</h2>\n<p${p}>New games arrive every Friday.</p>\n`;
STAGES["6.2w"] = [
  pg("Pixel Arcade", arcadeBody()),
  pg("Pixel Arcade", arcadeBody(' style="color: tomato"')),
  pg("Pixel Arcade", arcadeBody(' style="color: tomato"', ' style="color: white; background-color: black"')),
  pg("Pixel Arcade", arcadeBody(' style="color: tomato"', ' style="color: white; background-color: black"', ' style="color: #003366; background-color: #FFEEAA"')),
  pg("Pixel Arcade", arcadeBody(' style="color: tomato"', ' style="color: white; background-color: black"', ' style="color: #003366; background-color: #FFEEAA"'), { bodyAttr: ' style="background-color: navy; color: white"' }),
];

const sky = (a = "", b = "", c = "", d = "") => `<h1${a}>Skyline Cinema</h1>\n<h2${b}>Now Showing</h2>\n<h3${c}>friday night double feature</h3>\n<p${d}>DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS.</p>\n`;
const st = (s) => ` style="${s}"`;
STAGES["6.20w"] = [
  pg("Skyline Cinema", sky()),
  pg("Skyline Cinema", sky(st("font-size: 48px"), "", st("font-size: 24px"), st("font-size: 18px"))),
  pg("Skyline Cinema", sky(st("font-size: 48px; text-align: center"), st("text-align: center"), st("font-size: 24px"), st("font-size: 18px; text-align: right"))),
  pg("Skyline Cinema", sky(st("font-size: 48px; text-align: center; text-transform: uppercase"), st("text-align: center"), st("font-size: 24px; text-transform: capitalize"), st("font-size: 18px; text-align: right; text-transform: lowercase"))),
];

const bean = (p1, p2, p3, hr1 = "", hr2 = "") => `<h1>Beanstalk Coffee</h1>\n${hr1}<p>${p1}</p>\n<p>${p2}</p>\n${hr2}<p>${p3}</p>\n`;
STAGES["6.3w"] = [
  pg("Beanstalk Coffee", bean("We roast fresh beans every morning and serve them hot.", "Open daily 7 AM to 5 PM", "Try the Green Giant latte.")),
  pg("Beanstalk Coffee", bean("We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.", "Open daily 7 AM to 5 PM", "Try the Green Giant latte.")),
  pg("Beanstalk Coffee", bean("We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.", "Open daily<br>7 AM to 5 PM", "Try the Green Giant latte.")),
  pg("Beanstalk Coffee", bean("We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.", "Open daily<br>7 AM to 5 PM", "Try the Green Giant latte.", "<hr>\n", "<hr>\n")),
  pg("Beanstalk Coffee", bean("We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.", "Open daily<br>7 AM to 5 PM", 'Try the <span style="color: green">Green Giant</span> latte.', "<hr>\n", "<hr>\n")),
];

const PAC = '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">\n', OPEN = '<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">\n';
const bake = (h1 = "", p = "", p2 = "Try our famous cinnamon rolls.") => `<h1${h1}>Sweet Dreams Bakery</h1>\n<p${p}>Fresh bread and cakes every morning from our family oven.</p>\n<p${p}>${p2}</p>\n`;
const FF = (n) => ` style="font-family: '${n}'"`;
STAGES["6.35w"] = [
  pg("Sweet Dreams Bakery", bake()),
  pg("Sweet Dreams Bakery", bake(), { head: PAC }),
  pg("Sweet Dreams Bakery", bake(FF("Pacifico")), { head: PAC }),
  pg("Sweet Dreams Bakery", bake(FF("Pacifico"), FF("Open Sans")), { head: PAC + OPEN }),
  pg("Sweet Dreams Bakery", bake(FF("Pacifico"), FF("Open Sans"), `Try our <span style="font-family: 'Pacifico'">famous</span> cinnamon rolls.`), { head: PAC + OPEN }),
];

const game = (b = {}) => `<h1${b.h1 || ""}>Game Night</h1>\n<h2${b.h2 || ""}>Friday at Six</h2>\n<p${b.p1 || ""}>Snacks are free all night.</p>\n<p${b.p2 || ""}>Bring a friend.</p>\n<p${b.p3 || ""}>Everyone gets a prize.</p>\n<p${b.p4 || ""}>Games start at seven.</p>\n<p${b.p5 || ""}>See you Friday.</p>\n`;
const s1 = { h1: st("border: 4px solid navy"), p1: st("border: 3px dotted green") }, s2 = { ...s1, p2: st("border: 6px double purple"), p3: st("border: 5px groove orange"), p4: st("border: 5px ridge teal") }, s3 = { ...s2, h2: st("border-bottom: 3px dashed red"), p5: st("border-left: 8px solid black") };
STAGES["6.4w"] = [pg("Game Night", game()), pg("Game Night", game(s1)), pg("Game Night", game(s2)), pg("Game Night", game(s3))];

const FAV = `<link rel="icon" href="${LAB}rocket.svg">\n`, ROCK = `<img src="${LAB}rocket.svg" alt="A red and white rocket flying through space"`, PLAN = `<img src="${LAB}planet.svg" alt="A purple planet with a yellow ring"`;
STAGES["6.7w"] = [
  pg("Space Camp", "<h1>Space Camp</h1>\n<p>Blast off this summer.</p>\n"),
  pg("Space Camp", "<h1>Space Camp</h1>\n<p>Blast off this summer.</p>\n", { head: FAV }),
  pg("Space Camp", `<h1>Space Camp</h1>\n${ROCK}>\n<p>Blast off this summer.</p>\n`, { head: FAV }),
  pg("Space Camp", `<h1>Space Camp</h1>\n${ROCK} style="width: 200px">\n<p>Blast off this summer.</p>\n${PLAN} style="width: 50%">\n`, { head: FAV }),
];

const pz = (h, p1, p2, p3) => `<h1>${h}</h1>\n<p>${p1}</p>\n<p>${p2}</p>\n<p${p3[0]}>${p3[1]}</p>\n`;
STAGES["6.75w"] = [
  pg("Pizza Night", pz("Pizza Night", "Friday at 6 bring friends!", "Rating:", ["", "2027 Pizza Night Made with love"])),
  pg("Pizza Night", pz("Pizza Night 🍕", "Friday at 6 bring friends!", "Rating:", ["", "2027 Pizza Night Made with love"])),
  pg("Pizza Night", pz("Pizza Night 🍕", "Friday at 6 → bring friends!", "Rating:", ["", "2027 Pizza Night Made with love"])),
  pg("Pizza Night", pz("Pizza Night 🍕", "Friday at 6 → bring friends!", 'Rating: <span style="color: gold; font-size: 30px">★★★★</span><span style="color: gray; font-size: 30px">★</span>', ["", "2027 Pizza Night Made with love"])),
  pg("Pizza Night", pz("Pizza Night 🍕", "Friday at 6 → bring friends!", 'Rating: <span style="color: gold; font-size: 30px">★★★★</span><span style="color: gray; font-size: 30px">★</span>', [st("text-align: center; font-size: 14px"), "© 2027 Pizza Night™ ♥ Made with love"])),
];

const NA = "https://www.nasa.gov";
const fan = (o = {}) => `<h1>Space Fan Club</h1>\n${o.img || ""}<p>${o.p1 || "Visit NASA to see real launches."}</p>\n<p>${o.p2 || "Join the mission"}</p>\n<h2>${o.h2 || "Moon Facts"}</h2>\n`;
const L1 = `Visit <a href="${NA}" target="_blank">NASA</a> to see real launches.`, L2 = `<a href="${NA}/missions/" target="_blank"><strong>Join the mission</strong></a>`, L3 = '<a href="https://en.wikipedia.org/wiki/Moon" target="_blank">Moon Facts</a>', L4 = `<a href="${NA}" target="_blank">${ROCK} style="width: 150px"></a>\n`;
STAGES["6.6w"] = [pg("Space Fan Club", fan()), pg("Space Fan Club", fan({ p1: L1 })), pg("Space Fan Club", fan({ p1: L1, p2: L2 })), pg("Space Fan Club", fan({ p1: L1, p2: L2, h2: L3 })), pg("Space Fan Club", fan({ p1: L1, p2: L2, h2: L3, img: L4 }))];

const camp = (a = "", b = "", c = "") => `<h1>Camping Trip</h1>\n<h2>Pack These</h2>\n${a}<h2>Cooking Steps</h2>\n${b}<h2>Menu</h2>\n${c}`;
const UL = (attr) => `<ul${attr}>\n<li>Tent</li>\n<li>Sleeping bag</li>\n<li>Flashlight</li>\n</ul>\n`;
const OL = (attr) => `<ol${attr}>\n<li><strong>Build</strong> <em>a small fire</em></li>\n<li>Roast the marshmallows</li>\n<li>Eat</li>\n</ol>\n`;
const MENU = `<ul${st("list-style-type: none")}>\n<li${st("display: inline")}>Home</li>\n<li${st("display: inline")}>About</li>\n<li${st("display: inline")}>Contact</li>\n</ul>\n`;
STAGES["6.5w"] = [
  pg("Camping Trip", "<h1>Camping Trip</h1>\n<h2>Pack These</h2>\n<h2>Cooking Steps</h2>\n<h2>Menu</h2>\n"),
  pg("Camping Trip", camp(UL(""), "", "")),
  pg("Camping Trip", camp(UL(st("list-style-type: square")), "", "")),
  pg("Camping Trip", camp(UL(st("list-style-type: square")), OL(st("list-style-type: upper-roman")), "")),
  pg("Camping Trip", camp(UL(st("list-style-type: square")), OL(st("list-style-type: upper-roman")), MENU)),
];
