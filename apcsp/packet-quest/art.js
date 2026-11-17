/* Packet Quest picture set: one illustration per map stop, plus how-to-play art.
   Every picture is a 64x64 SVG drawn in code, so nothing extra has to download. */
(function () {
  function S(body) { return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + body + "</svg>"; }
  var K = {};

  /* Karel the robot dog with a tennis ball */
  K.karel = S('<rect x="6" y="44" width="52" height="12" rx="3" fill="#475569"/><path d="M6 50h52" stroke="#64748B"/>' +
    '<path d="M14 36l-6-8 10 2z" fill="#B45309"/><rect x="14" y="22" width="28" height="22" rx="9" fill="#F59E0B" stroke="#7C2D12" stroke-width="2"/>' +
    '<circle cx="26" cy="31" r="4" fill="#fff"/><circle cx="34" cy="31" r="4" fill="#fff"/><circle cx="27" cy="31" r="2" fill="#111"/><circle cx="35" cy="31" r="2" fill="#111"/>' +
    '<path d="M42 30l7 3-7 3z" fill="#FDE68A"/><circle cx="52" cy="40" r="5" fill="#D9F99D" stroke="#65A30D" stroke-width="1.5"/><path d="M48 38q4 3 8 0" fill="none" stroke="#fff" stroke-width="1.2"/>');
  /* Bug under a magnifying glass */
  K.debug = S('<circle cx="27" cy="27" r="17" fill="#1E293B" stroke="#CBD5E1" stroke-width="4"/><path d="M39 39l14 14" stroke="#CBD5E1" stroke-width="7" stroke-linecap="round"/>' +
    '<ellipse cx="27" cy="29" rx="7" ry="9" fill="#EF4444"/><circle cx="27" cy="19" r="4" fill="#7F1D1D"/><path d="M27 21v17" stroke="#7F1D1D" stroke-width="1.5"/>' +
    '<path d="M20 25l-5-3M20 31h-6M21 36l-5 3M34 25l5-3M34 31h6M33 36l5 3" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round"/>');
  /* Python basics: a labelled variable box being filled */
  K.pybasic = S('<path d="M10 28l22-10 22 10-22 10z" fill="#22C55E"/><path d="M10 28v20l22 10V38z" fill="#15803D"/><path d="M54 28v20L32 58V38z" fill="#16A34A"/>' +
    '<rect x="17" y="6" width="30" height="12" rx="3" fill="#0F172A" stroke="#4ADE80" stroke-width="1.5"/><text x="32" y="15.5" text-anchor="middle" font-family="monospace" font-size="9" font-weight="700" fill="#BBF7D0">x = 5</text>' +
    '<text x="22" y="49" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#DCFCE7">5</text>');
  /* Strings: letter beads on a thread */
  K.strings = S('<path d="M4 34q28-14 56 0" fill="none" stroke="#FCD34D" stroke-width="2"/>' +
    [["a", 12, 29, "#F472B6"], ["b", 25, 25, "#60A5FA"], ["c", 39, 25, "#34D399"], ["!", 52, 29, "#FBBF24"]].map(function (b) { return '<circle cx="' + b[1] + '" cy="' + b[2] + '" r="7.5" fill="' + b[3] + '"/><text x="' + b[1] + '" y="' + (b[2] + 4) + '" text-anchor="middle" font-family="monospace" font-size="11" font-weight="800" fill="#0F172A">' + b[0] + "</text>"; }).join("") +
    '<text x="32" y="54" text-anchor="middle" font-family="monospace" font-size="10" fill="#FDE68A">"abc!"</text>');
  /* Strings II: a crystal with text */
  K.strings2 = S('<path d="M32 4l16 18-16 38-16-38z" fill="#F0ABFC" stroke="#A21CAF" stroke-width="2"/><path d="M16 22h32M32 4v56M24 22l8 38 8-38" fill="none" stroke="#FAE8FF" stroke-width="1.2" opacity=".8"/>' +
    '<rect x="6" y="44" width="52" height="14" rx="4" fill="#0F172A" stroke="#E879F9"/><text x="32" y="54.5" text-anchor="middle" font-family="monospace" font-size="9" font-weight="700" fill="#F5D0FE">"a" in s</text>');
  /* Decisions: a signpost at a fork */
  K.decisions = S('<path d="M32 60V26" stroke="#A78BFA" stroke-width="3"/><path d="M32 60L10 40M32 60l22-20" stroke="#4C1D95" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M32 12h20l6 6-6 6H32z" fill="#4ADE80"/><text x="43" y="21" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#052E16">True</text>' +
    '<path d="M32 26H12l-6 6 6 6h20z" fill="#F87171"/><text x="20" y="35" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#450A0A">False</text>' +
    '<text x="32" y="9" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#DDD6FE">if</text>');
  /* Loops: circular arrows with a counter */
  K.loops = S('<path d="M50 32a18 18 0 1 1-6-13.4" fill="none" stroke="#FB923C" stroke-width="6" stroke-linecap="round"/><path d="M38 12l9 6-2 10" fill="none" stroke="#FB923C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<text x="32" y="37" text-anchor="middle" font-family="monospace" font-size="13" font-weight="800" fill="#FFEDD5">×5</text>');
  /* Functions: a machine with input and output */
  K.functions = S('<rect x="16" y="16" width="32" height="30" rx="5" fill="#10B981" stroke="#064E3B" stroke-width="2"/><text x="32" y="36" text-anchor="middle" font-family="monospace" font-size="12" font-weight="800" fill="#022C22">def</text>' +
    '<circle cx="24" cy="20" r="0" /><path d="M2 31h12M50 31h12" stroke="#6EE7B7" stroke-width="3"/><path d="M10 27l4 4-4 4M58 27l4 4-4 4" fill="none" stroke="#6EE7B7" stroke-width="3"/>' +
    '<circle cx="24" cy="52" r="5" fill="#334155"/><circle cx="40" cy="52" r="5" fill="#334155"/><path d="M26 10l3 6M38 10l-3 6" stroke="#A7F3D0" stroke-width="2"/>');
  /* Lists: a row of numbered boxes */
  K.lists = S('<text x="5" y="38" font-family="monospace" font-size="20" font-weight="800" fill="#EAB308">[</text><text x="52" y="38" font-family="monospace" font-size="20" font-weight="800" fill="#EAB308">]</text>' +
    [0, 1, 2].map(function (i) { var x = 15 + i * 12; return '<rect x="' + x + '" y="20" width="10" height="16" rx="2" fill="' + ["#F472B6", "#60A5FA", "#34D399"][i] + '"/><text x="' + (x + 5) + '" y="47" text-anchor="middle" font-family="monospace" font-size="8" fill="#FDE68A">' + i + "</text>"; }).join("") +
    '<rect x="8" y="52" width="48" height="6" rx="2" fill="#854D0E"/>');
  /* Binary */
  K.binary = S('<rect x="6" y="10" width="52" height="44" rx="6" fill="#0C4A6E" stroke="#38BDF8" stroke-width="2"/>' +
    '<text x="32" y="30" text-anchor="middle" font-family="monospace" font-size="13" font-weight="800" fill="#7DD3FC">1011</text><text x="32" y="47" text-anchor="middle" font-family="monospace" font-size="13" font-weight="800" fill="#BAE6FD">= 11</text>');
  /* Digital information: cipher wheel */
  K.cipher = S('<circle cx="32" cy="32" r="26" fill="#134E4A" stroke="#2DD4BF" stroke-width="3"/><circle cx="32" cy="32" r="15" fill="#0F766E" stroke="#99F6E4" stroke-width="2"/>' +
    ["A", "B", "C", "D", "E", "F", "G", "H"].map(function (c, i) { var a = i / 8 * 2 * Math.PI - Math.PI / 2; return '<text x="' + (32 + 20.5 * Math.cos(a)).toFixed(1) + '" y="' + (35 + 20.5 * Math.sin(a)).toFixed(1) + '" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#CCFBF1">' + c + "</text>"; }).join("") +
    '<text x="32" y="36" text-anchor="middle" font-family="monospace" font-size="10" font-weight="800" fill="#F0FDFA">+3</text>');
  /* Compression: a squeezed file */
  K.compress = S('<path d="M18 8h20l10 10v38H18z" fill="#E2E8F0"/><path d="M38 8v10h10" fill="#94A3B8"/><path d="M23 26h20M23 32h20M23 38h14" stroke="#64748B" stroke-width="2"/>' +
    '<path d="M4 32h10M50 32h10" stroke="#F472B6" stroke-width="3"/><path d="M10 27l5 5-5 5M54 27l-5 5 5 5" fill="none" stroke="#F472B6" stroke-width="3"/>' +
    '<text x="33" y="52" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#BE185D">4A3B</text>');
  /* Internet: connected routers */
  K.internet = S('<path d="M12 16L32 32 52 14M32 32L16 50M32 32l20 18M12 16l4 34M52 14v36" stroke="#22D3EE" stroke-width="2.5" opacity=".7"/>' +
    [[12, 16], [52, 14], [32, 32], [16, 50], [52, 50]].map(function (p, i) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === 2 ? 8 : 6) + '" fill="#083344" stroke="#67E8F9" stroke-width="2.5"/>'; }).join("") +
    '<rect x="26" y="24" width="7" height="5" rx="1" fill="#FDE047" transform="rotate(38 32 32)"/>');
  /* Parallel computing: three processors working at once */
  K.parallel = S([0, 1, 2].map(function (i) { var y = 10 + i * 16; return '<rect x="6" y="' + y + '" width="14" height="12" rx="2" fill="#7C3AED"/><path d="M8 ' + (y + 6) + 'h10" stroke="#DDD6FE"/><rect x="24" y="' + (y + 3) + '" width="' + [32, 22, 28][i] + '" height="6" rx="3" fill="#A78BFA"/>'; }).join("") +
    '<path d="M60 6v52" stroke="#FBBF24" stroke-width="2" stroke-dasharray="3 3"/>');
  /* Cybersecurity: shield and lock */
  K.cyber = S('<path d="M32 4l22 8v16c0 14-10 26-22 32C20 54 10 42 10 28V12z" fill="#BE123C" stroke="#FDA4AF" stroke-width="2"/>' +
    '<rect x="22" y="28" width="20" height="16" rx="3" fill="#FFF1F2"/><path d="M26 28v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#FFF1F2" stroke-width="3"/><circle cx="32" cy="35" r="2.5" fill="#BE123C"/><path d="M32 37v3" stroke="#BE123C" stroke-width="2"/>');
  /* Impact of computing: the world with a lightbulb */
  K.impact = S('<circle cx="28" cy="36" r="22" fill="#1D4ED8"/><path d="M14 26q8-4 10 4t10 8 4 12M22 52q-2-8 6-10M40 18q-4 6 4 10t8 6" fill="none" stroke="#4ADE80" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="50" cy="14" r="9" fill="#FDE047"/><rect x="46" y="22" width="8" height="5" rx="1" fill="#CA8A04"/><path d="M50 2v-2M60 14h3M42 6l-2-2M58 6l2-2" stroke="#FDE047" stroke-width="2"/>');
  /* Reading passages: an open file folder */
  K.passages = S('<path d="M6 16h18l4 5h30v35H6z" fill="#B45309"/><rect x="12" y="10" width="40" height="40" rx="2" fill="#F8FAFC" transform="rotate(-4 32 30)"/>' +
    '<path d="M18 20h26M18 26h26M18 32h20M18 38h24" stroke="#94A3B8" stroke-width="2" transform="rotate(-4 32 30)"/><path d="M4 28h56l-4 28H8z" fill="#D97706"/>' +
    '<circle cx="46" cy="42" r="7" fill="none" stroke="#1E293B" stroke-width="3"/><path d="M51 47l6 6" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>');
  /* Create task: a toolbox with code */
  K.create = S('<rect x="6" y="24" width="52" height="32" rx="4" fill="#0284C7" stroke="#075985" stroke-width="2"/><path d="M22 24v-8h20v8" fill="none" stroke="#7DD3FC" stroke-width="4"/>' +
    '<rect x="6" y="34" width="52" height="4" fill="#075985"/><text x="32" y="51" text-anchor="middle" font-family="monospace" font-size="11" font-weight="800" fill="#E0F2FE">&lt;/&gt;</text>');
  /* AP review gate: scroll with a check */
  K.review = S('<rect x="12" y="8" width="40" height="48" rx="4" fill="#F1F5F9"/><rect x="8" y="6" width="48" height="7" rx="3.5" fill="#CBD5E1"/><rect x="8" y="51" width="48" height="7" rx="3.5" fill="#CBD5E1"/>' +
    '<path d="M18 22h10M18 32h10M18 42h10" stroke="#94A3B8" stroke-width="2"/><path d="M33 22l3 3 6-7M33 32l3 3 6-7" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<text x="38" y="46" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="900" fill="#7C3AED">?</text>');
  /* Practice exam: test sheet, pencil and clock */
  K.exam = S('<rect x="8" y="6" width="36" height="50" rx="3" fill="#F8FAFC"/><text x="26" y="18" text-anchor="middle" font-family="monospace" font-size="8" font-weight="800" fill="#1E3A8A">AP CSP</text>' +
    '<path d="M14 26h4M14 34h4M14 42h4" stroke="#1E40AF" stroke-width="3"/><path d="M22 26h16M22 34h16M22 42h12" stroke="#94A3B8" stroke-width="2"/>' +
    '<circle cx="48" cy="46" r="12" fill="#0EA5E9" stroke="#E0F2FE" stroke-width="2"/><path d="M48 38v8l5 3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>');
  /* Final boss: the Corruptor */
  K.boss = S('<path d="M10 20l8 6M54 20l-8 6" stroke="#FB7185" stroke-width="3"/><path d="M14 30c0-14 8-22 18-22s18 8 18 22v10l-6 6-6-4-6 6-6-6-6 4-6-6z" fill="#4C0519" stroke="#FB7185" stroke-width="2.5"/>' +
    '<path d="M20 26l8 4-8 3zM44 26l-8 4 8 3z" fill="#FDE047"/><path d="M24 40l4-4 4 4 4-4 4 4" fill="none" stroke="#FDA4AF" stroke-width="2"/>');

  /* which picture goes with which map stop */
  var BY = { c1: "karel", m3: "debug", c2: "pybasic", c3: "strings", m1: "review", c4: "decisions", c5: "loops", m4: "review", c6: "functions", m13: "review", c7: "lists",
    m8: "review", m2: "binary", c9: "cipher", m7: "compress", m5: "internet", m9: "parallel", m6: "cyber", m10: "impact", c8: "strings2", m14: "passages", c10: "create", m11: "review", x1: "exam", m12: "boss" };

  /* the map is split into chapters, in course order */
  var CHAPTERS = [
    { n: 1, title: "Robot Basics", learn: "Give Karel step-by-step commands, then hunt down bugs.", ids: ["c1", "m3"] },
    { n: 2, title: "Python Basics", learn: "Variables, input, math, and strings in real Python.", ids: ["c2", "c3", "m1"] },
    { n: 3, title: "Decisions & Loops", learn: "Make your code choose with if, and repeat with for and while.", ids: ["c4", "c5", "m4"] },
    { n: 4, title: "Functions & Lists", learn: "Build your own commands and store many values in one list.", ids: ["c6", "m13", "c7", "m8"] },
    { n: 5, title: "Data", learn: "Binary, encryption, and how computers store and squeeze data.", ids: ["m2", "c9", "m7"] },
    { n: 6, title: "Networks & Security", learn: "How the Internet moves data, and how to keep it safe.", ids: ["m5", "m9", "m6"] },
    { n: 7, title: "Computing & Society", learn: "The good and bad effects of computing, plus AP reading passages.", ids: ["m10", "c8", "m14"] },
    { n: 8, title: "The Create Task", learn: "Build your own program and practice the written responses.", ids: ["c10", "m11"] },
    { n: 9, title: "AP Exam Prep", learn: "A full practice exam, then the final boss.", ids: ["x1", "m12"] }
  ];

  /* how-to-play pictures (wider, 160x100) */
  function W(body) { return '<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + body + "</svg>"; }
  var HOW = {
    pick: W('<rect x="4" y="30" width="44" height="44" rx="10" fill="#141C33" stroke="#334155" stroke-width="2"/><text x="26" y="58" text-anchor="middle" font-size="18">✓</text>' +
      '<path d="M50 52h12" stroke="#475569" stroke-width="3"/><rect x="62" y="24" width="56" height="56" rx="12" fill="#1E293B" stroke="#FB923C" stroke-width="3"/><g transform="translate(74 36) scale(.5)">' + K.karel.replace(/<\/?svg[^>]*>/g, "") + "</g>" +
      '<path d="M120 52h12" stroke="#475569" stroke-width="3"/><rect x="132" y="34" width="26" height="36" rx="8" fill="#141C33" stroke="#334155" stroke-width="2" opacity=".6"/><text x="145" y="57" text-anchor="middle" font-size="12">🔒</text>' +
      '<path d="M98 92l-6-14 14 4-5 2 5 6-3 3-5-6z" fill="#fff" stroke="#0F172A" stroke-width="1.5"/>'),
    code: W('<rect x="4" y="8" width="74" height="84" rx="8" fill="#050812" stroke="#334155" stroke-width="2"/><text x="12" y="30" font-family="monospace" font-size="10" fill="#93C5FD">move()</text><text x="12" y="46" font-family="monospace" font-size="10" fill="#93C5FD">move()</text><text x="12" y="62" font-family="monospace" font-size="10" fill="#F9A8D4">put_ball()</text>' +
      '<rect x="12" y="72" width="40" height="14" rx="4" fill="#22C55E"/><text x="32" y="82.5" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="800" fill="#052E16">▶ Run</text>' +
      '<path d="M82 50h14" stroke="#FB923C" stroke-width="3"/><path d="M92 45l6 5-6 5" fill="none" stroke="#FB923C" stroke-width="3"/>' +
      '<rect x="100" y="30" width="56" height="40" rx="4" fill="#475569"/><path d="M118.7 30v40M137.3 30v40M100 50h56" stroke="#334155"/><g transform="translate(101 31) scale(.28)">' + K.karel.replace(/<\/?svg[^>]*>/g, "") + '</g><rect x="140" y="34" width="13" height="13" fill="none" stroke="#FACC15" stroke-width="2" stroke-dasharray="3 2"/>'),
    quiz: W('<rect x="6" y="8" width="148" height="22" rx="6" fill="#141C33" stroke="#334155"/><text x="14" y="23" font-family="sans-serif" font-size="9" fill="#E2E8F0">What does this code display?</text>' +
      ['A', 'B', 'C'].map(function (l, i) { var y = 36 + i * 20, ok = i === 1; return '<rect x="6" y="' + y + '" width="148" height="16" rx="5" fill="' + (ok ? "#064E3B" : "#141C33") + '" stroke="' + (ok ? "#34D399" : "#334155") + '"/><text x="14" y="' + (y + 11.5) + '" font-family="sans-serif" font-size="9" font-weight="700" fill="' + (ok ? "#6EE7B7" : "#94A3B8") + '">' + l + (ok ? "   ✓ Correct! +100 XP" : "") + "</text>"; }).join("")),
    teacher: W('<rect x="40" y="10" width="80" height="80" rx="10" fill="#141C33" stroke="#334155" stroke-width="2"/><text x="80" y="38" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="800" fill="#FCD34D">FRIDAY</text>' +
      '<rect x="52" y="48" width="56" height="30" rx="6" fill="#064E3B" stroke="#34D399"/><text x="80" y="67" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="800" fill="#6EE7B7">Mission open</text>')
  };

  window.PQART = { icon: function (id) { return K[BY[id]] || K.review; }, K: K, BY: BY, CHAPTERS: CHAPTERS, HOW: HOW };
})();
