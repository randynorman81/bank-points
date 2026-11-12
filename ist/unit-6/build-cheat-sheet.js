/* Builds cheat-sheet.html: every tag used in the HTML lessons, each with a code example and what the browser shows.
   Run: node build-cheat-sheet.js   (in ist/unit-6). Edit the GROUPS list below to add or change a tag. */
const fs = require("fs");
const PIC = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#8ecae6"/><circle cx="150" cy="95" r="55" fill="#2b2d42"/><circle cx="130" cy="85" r="8" fill="#fff"/><circle cx="170" cy="85" r="8" fill="#fff"/><ellipse cx="150" cy="112" rx="14" ry="9" fill="#e5989b"/></svg>');
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// [tag label, what it does, lesson, code, closing-tag note]
const GROUPS = [
  ["The skeleton", [
    ["<!DOCTYPE html>", "The very first line. It tells the browser this is a modern HTML page. No closing tag.", "3.1",
     "<!DOCTYPE html>", null],
    ["<html>", "Wraps the whole page. Everything else goes inside it.", "3.1",
     "<html>\n  ...head and body go here...\n</html>", null],
    ["<head>", "Information about the page that does not show on the page itself.", "3.1",
     "<head>\n  <title>My Page</title>\n</head>", null],
    ["<title>", "The words in the browser tab. Goes inside the head.", "3.1",
     "<title>My First Website</title>", "The title shows in the browser tab, not on the page."],
    ["<body>", "Everything the visitor sees on the page goes inside the body.", "3.1",
     "<body>\n  <h1>Welcome!</h1>\n  <p>This shows on the page.</p>\n</body>", "<h1 style='margin:0 0 6px'>Welcome!</h1><p style='margin:0'>This shows on the page.</p>"],
  ]],
  ["Text", [
    ["<h1> to <h6>", "Headings from largest (h1) to smallest (h6). Use one h1 for the page title.", "3.1 and 3.3",
     "<h1>Honey Bee</h1>\n<h2>Life in the Colony</h2>\n<h3>The Queen</h3>", "<h1>Honey Bee</h1><h2>Life in the Colony</h2><h3>The Queen</h3>"],
    ["<p>", "A paragraph. The browser puts space above and below it.", "3.1",
     "<p>Bees turn nectar into honey.</p>\n<p>A hive can hold 50,000 bees.</p>", "<p>Bees turn nectar into honey.</p><p>A hive can hold 50,000 bees.</p>"],
    ["<strong> and <b>", "Bold text.", "3.4",
     "<p>This is <strong>very important</strong>.</p>", "<p>This is <strong>very important</strong>.</p>"],
    ["<em> and <i>", "Italic text.", "3.4",
     "<p>I read <em>Hatchet</em> last week.</p>", "<p>I read <em>Hatchet</em> last week.</p>"],
    ["<br>", "A line break. Starts a new line inside a paragraph. No closing tag.", "3.4",
     "<p>Roses are red,<br>Violets are blue.</p>", "<p>Roses are red,<br>Violets are blue.</p>"],
    ["<hr>", "A horizontal line across the page. No closing tag.", "3.4",
     "<p>Above the line</p>\n<hr>\n<p>Below the line</p>", "<p>Above the line</p><hr><p>Below the line</p>"],
    ["<span>", "An inline container. It changes just a few words and does nothing until you style it.", "3.4",
     "<p>My favorite color is <span style=\"color: tomato;\">tomato</span>.</p>", "<p>My favorite color is <span style=\"color: tomato;\">tomato</span>.</p>"],
    ["<div>", "A block container. It groups tags together so you can style them as one box.", "4.4",
     "<div style=\"background-color: lightyellow; border: 2px solid gold;\">\n  <h3>Heads up</h3>\n  <p>Everything in this box is grouped.</p>\n</div>",
     "<div style=\"background-color: lightyellow; border: 2px solid gold;padding:6px 12px\"><h3>Heads up</h3><p>Everything in this box is grouped.</p></div>"],
  ]],
  ["Links and images", [
    ["<link>", "In the head. It loads something from outside, like a Google font or your style.css file. No closing tag.", "3.5 and 5.1",
     "<head>\n  <link href=\"https://fonts.googleapis.com/css2?family=Lobster&display=swap\" rel=\"stylesheet\">\n</head>", "The font is loaded, but nothing changes until you use it in a style."],
    ["<img>", "Shows an image. src is where the picture lives and alt describes it. No closing tag.", "3.7",
     "<img src=\"dog.jpg\" alt=\"A black puppy\" width=\"150\">", "<img src=\"https://picsum.photos/id/237/300/200\" alt=\"A black puppy\" width=\"150\">"],
    ["<a>", "A link. href is where it goes. Add target=\"_blank\" to open a new tab. It can wrap words, a heading, or an image.", "3.9",
     "<a href=\"https://www.wikipedia.org\" target=\"_blank\">Visit Wikipedia</a>\n\n<a href=\"https://www.wikipedia.org\"><img src=\"dog.jpg\" alt=\"A black puppy\" width=\"120\"></a>",
     "<a href=\"#\" onclick=\"return false\">Visit Wikipedia</a><br><br><a href=\"#\" onclick=\"return false\"><img src=\"https://picsum.photos/id/237/300/200\" alt=\"A black puppy\" width=\"120\"></a>"],
  ]],
  ["Lists", [
    ["<ul> and <li>", "An unordered (bulleted) list. Each item is an li.", "3.10",
     "<ul>\n  <li>Spawn point</li>\n  <li>Iron ore</li>\n  <li>Diamonds</li>\n</ul>", "<ul><li>Spawn point</li><li>Iron ore</li><li>Diamonds</li></ul>"],
    ["<ol> and <li>", "An ordered (numbered) list. Each item is an li.", "3.10",
     "<ol>\n  <li>Crack the egg</li>\n  <li>Stir</li>\n  <li>Cook</li>\n</ol>", "<ol><li>Crack the egg</li><li>Stir</li><li>Cook</li></ol>"],
  ]],
  ["Tables", [
    ["<table>, <tr>, <th>, <td>", "A table. tr is a row, th is a header cell (bold), td is a regular cell.", "4.5",
     "<table border=\"1\">\n  <tr>\n    <th>Name</th>\n    <th>Score</th>\n  </tr>\n  <tr>\n    <td>Ana</td>\n    <td>95</td>\n  </tr>\n</table>",
     "<table border=\"1\" style=\"border-collapse:collapse\"><tr><th>Name</th><th>Score</th></tr><tr><td>Ana</td><td>95</td></tr></table>"],
  ]],
  ["Forms", [
    ["<form>", "Holds the boxes and buttons a visitor fills out.", "9.6",
     "<form>\n  <label>Your name</label>\n  <input type=\"text\">\n  <button>Send</button>\n</form>",
     "<form><label>Your name</label><br><input type=\"text\"><br><button type=\"button\">Send</button></form>"],
  ]],
];

const STYLE_TIPS = [
  ["style", "Holds the CSS for one tag. Goes inside the opening tag.", "<p style=\"color: teal; font-size: 24px;\">Teal text</p>"],
  ["class", "A name you give a tag so one CSS rule can style many tags.", "<p class=\"note\">Styled by .note { }</p>"],
  ["id", "A name that belongs to just one tag.", "<h1 id=\"title\">Styled by #title { }</h1>"],
];

let body = "";
let chips = "";
GROUPS.forEach((g, gi) => {
  const id = "g" + gi;
  chips += `<a class="chip" href="#${id}">${esc(g[0])}</a>`;
  body += `<section class="part" id="${id}"><div class="wrap"><div class="part-head"><h2>${esc(g[0])}</h2></div><div class="lbody">`;
  g[1].forEach((t) => {
    const [name, what, lesson, code, shown] = t;
    const out = shown && shown.charAt(0) === "<" ? shown.split("https://picsum.photos/id/237/300/200").join(PIC) : null, note = shown && !out ? shown : "";
    body += `<div class="ex"><div class="exl">${esc(name)}</div><p class="lede">${esc(what)} <span class="lsn">Lesson ${lesson}</span></p>`;
    if (out) body += `<div class="demo"><div class="box"><h4>Code</h4><div class="codeblk">${esc(code)}</div></div><div class="box"><h4>What the browser shows</h4><div class="out">${out}</div></div></div>`;
    else body += `<div class="codeblk">${esc(code)}</div>` + (note ? `<p class="lede">${esc(note)}</p>` : "");
    body += `</div>`;
  });
  body += `</div></div></section>\n`;
});
chips += `<a class="chip" href="#attrs">Attributes</a>`;
body += `<section class="part" id="attrs"><div class="wrap"><div class="part-head"><h2>Attributes you add to tags</h2></div><div class="lbody"><p class="lede">An attribute goes inside the opening tag and gives it extra instructions: <code>name="value"</code>. These two are covered above: <code>href</code>, <code>src</code>, <code>alt</code>, <code>target</code>, <code>width</code>. These three are used to style:</p>`;
STYLE_TIPS.forEach((s) => {
  body += `<div class="ex"><div class="exl">${esc(s[0])}</div><p class="lede">${esc(s[1])}</p><div class="codeblk">${esc(s[2])}</div></div>`;
});
body += `</div></div></section>\n`;

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cheat Sheet | Web Design - HTML</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" href="../../assets/logo.png"><link rel="stylesheet" href="../unit-4/notes.css">
<style>:root{--acc:#FB923C;--acc-tint:rgba(251,146,60,.13);--acc-ink:#FED7AA}
.codeblk{background:#05070B;border:1px solid var(--rule);border-radius:8px;padding:14px 18px;margin:8px 0 14px;font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.65;color:#E8ECF3;overflow-x:auto;white-space:pre}
.demo{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin:10px 0 22px}
.demo .box{background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:14px 16px;min-width:0}
.demo .box h4{font-family:"JetBrains Mono",monospace;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--acc-ink);margin-bottom:8px}
.demo .box .codeblk{margin:0}
.demo .out{background:#fff;color:#111;border-radius:6px;padding:18px;font-family:Georgia,serif;font-size:15px;line-height:1.5}
.out h1{font-size:28px;margin:.3em 0;color:inherit;font-family:inherit;font-weight:700}
.out h2{font-size:22px;margin:.3em 0;color:inherit;font-family:inherit;font-weight:700}
.out h3{font-size:18px;margin:.3em 0;color:inherit;font-family:inherit;font-weight:700}
.out p,.out li,.out span,.out td,.out th,.out div,.out strong,.out em,.out label{color:inherit;font-size:inherit}
.out p{margin:.7em 0}.out ul,.out ol{margin:.7em 0;padding-left:26px}
.out a{color:#1a0dab}.out hr{margin:14px 0}
.out table{border-collapse:collapse;background:none;margin:0}.out th,.out td{padding:6px 10px;background:none;border:1px solid #444}
.out>*:first-child{margin-top:0}.out>*:last-child{margin-bottom:0}
.out input{margin:4px 0}
.part{padding:50px 0 10px}.part-head{margin-bottom:22px}
.ex{border:1px solid var(--rule);background:rgba(255,255,255,.025);border-radius:12px;padding:22px 24px 8px;margin:26px 0}
.exl{font-family:"JetBrains Mono",monospace;font-size:13px;font-weight:700;letter-spacing:.04em;color:#0B0E14;background:var(--acc);display:inline-block;padding:4px 12px;border-radius:100px;margin-bottom:14px}
.lede{margin:0 0 14px;line-height:1.7}
.lsn{font-family:"JetBrains Mono",monospace;font-size:11.5px;color:var(--acc-ink);white-space:nowrap;margin-left:6px}
.chips{position:sticky;top:0;z-index:50;background:#0B0E14ee;backdrop-filter:blur(8px);border-bottom:1px solid var(--rule);padding:10px 0}
.chips .wrap{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-family:"JetBrains Mono",monospace;font-size:12px;font-weight:700;color:var(--ink-soft);background:var(--card);border:1px solid var(--rule);border-radius:100px;padding:6px 12px;text-decoration:none}
.chip:hover{color:#fff;border-color:var(--acc)}
code{color:#FED7AA}
</style>
</head>
<body>
<nav class="pillnav"><a href="index.html">&larr; Unit 3</a><a href="cheat-sheet.html" class="current">Cheat Sheet</a><a href="study-guide.html">Full study guide</a></nav>

<header class="hero"><div class="wrap">
  <div class="brief-no">Unit 3 &nbsp;/&nbsp; Web Design - HTML</div>
  <h1>HTML Cheat Sheet</h1>
  <p class="deck">Every tag we use, with a code example and what it looks like in the browser. Keep this open while you build.</p>
  <span class="stdchip">Tags and attributes</span>
</div></header>

<div class="chips"><div class="wrap">${chips}</div></div>

${body}
<footer class="final"><div class="wrap"><h2>Open tag. Content. Close tag.</h2><p>Most tags come in pairs. The tags with no closing tag are DOCTYPE, br, hr, link, img, and input.</p><a class="back" href="index.html">&larr; Unit 3</a></div></footer>

<script src="../unit-4/notes.js"></script></body></html>
`;
fs.writeFileSync(__dirname + "/cheat-sheet.html", html);
console.log("wrote cheat-sheet.html", html.length);
