/* IST Unit 1 interactive widgets. Mount points: <div class="u1w" data-w="classify|passlab|idor|auction" data-set="..."></div> */
(function () {
"use strict";
var CSS = ".u1w{background:var(--card,#151A24);border:1px solid var(--rule,#232B38);border-radius:14px;padding:22px 24px;margin:18px 0 30px;color:var(--ink,#EAEFF6)}" +
".u1w h3{font-family:Fraunces,Georgia,serif;font-size:22px;margin:0 0 4px;color:#fff}.u1w .sub{color:var(--ink-soft,#8B9AAE);font-size:14.5px;margin:0 0 14px}" +
".u1w .q{font-size:17.5px;line-height:1.5;margin:6px 0 14px;color:#EAEFF6}.u1w .opts{display:flex;flex-wrap:wrap;gap:8px}" +
".u1w button{all:unset;box-sizing:border-box;cursor:pointer;font:700 13.5px 'JetBrains Mono',monospace;background:var(--panel,#10141C);color:var(--ink,#EAEFF6);border:1px solid var(--rule,#232B38);border-radius:8px;padding:9px 15px}" +
".u1w button:hover{border-color:#5B6B82}.u1w button.go{background:#38BDF8;color:#06222F;border-color:#38BDF8}.u1w button.ok{background:rgba(52,211,153,.18);border-color:#34D399}.u1w button.no{background:rgba(248,113,113,.18);border-color:#F87171}.u1w button[disabled]{cursor:default;opacity:.75}" +
".u1w .fb{margin-top:14px;padding:12px 15px;border-radius:8px;background:var(--panel,#10141C);border-left:3px solid #38BDF8;font-size:15px;line-height:1.55}.u1w .fb.ok{border-color:#34D399}.u1w .fb.no{border-color:#F87171}" +
".u1w .bar{height:6px;background:#263042;border-radius:3px;margin-bottom:14px}.u1w .bar i{display:block;height:100%;background:#38BDF8;border-radius:3px;transition:width .25s}" +
".u1w .score{font:700 22px Fraunces,serif;color:#fff;margin:6px 0}.u1w input[type=text]{all:unset;box-sizing:border-box;width:100%;background:#0A0D13;border:1px solid var(--rule,#232B38);border-radius:8px;padding:11px 14px;font:16px 'JetBrains Mono',monospace;color:#fff}" +
".u1w .meter{height:14px;border-radius:7px;background:#263042;margin:12px 0;overflow:hidden}.u1w .meter i{display:block;height:100%;transition:width .2s,background .2s}" +
".u1w table{width:100%;border-collapse:collapse;font-size:14.5px;margin-top:10px}.u1w td,.u1w th{border-bottom:1px solid var(--rule,#232B38);padding:7px 8px;text-align:left}" +
".u1w .url{font:15px 'JetBrains Mono',monospace;background:#0A0D13;border:1px solid var(--rule,#232B38);border-radius:8px;padding:10px 14px;margin:8px 0}.u1w .url b{color:#FFD76A}" +
".u1w .bid{display:flex;justify-content:space-between;gap:10px;padding:7px 10px;border-radius:6px;background:var(--panel,#10141C);margin-bottom:5px;font:13.5px 'JetBrains Mono',monospace;opacity:0;transform:translateY(6px);transition:all .3s}.u1w .bid.in{opacity:1;transform:none}.u1w .bid.win{outline:2px solid #34D399}.u1w .bid.keep{border-left:3px solid #FBBF24}";
var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");}
var SETS = {
 pillars: { title:"Which pillar failed?", sub:"Name the part of the CIA Triad that each scenario breaks.", options:["Confidentiality","Integrity","Availability"], items:[
  ["A hacker reads your private DMs.",0,"Confidentiality: private information was seen by someone who should not see it."],
  ["Someone secretly changes the amount on a payment before it goes through.",1,"Integrity: the data was changed by someone who was not supposed to change it."],
  ["Ransomware locks a school's computers on the day of a big test.",2,"Availability: the files still exist, but nobody can use them when they are needed."],
  ["A leaked database shows customers' home addresses.",0,"Confidentiality: private personal information was exposed."],
  ["An edited screenshot spreads a rumor about what you said.",1,"Integrity: the thing you are looking at is not what was really there."],
  ["A popular game's servers crash on release day.",2,"Availability: the service was not there when people needed it."],
  ["A teacher accidentally emails the whole grade book to the class.",0,"Confidentiality: private grades reached people who should not see them, even by accident."],
  ["Autocorrect changes a word in your message before you hit send.",1,"Integrity: the message was changed without your real permission, even though nobody meant harm."]]},
 police: { title:"Legal tactic or illegal tactic?", sub:"Use the Georgia rule from these notes: lying about facts is generally allowed, but promises, threats, and ignoring a clear request for a lawyer are not.", options:["Legal tactic","Illegal tactic"], items:[
  ["An officer says, \"We found your fingerprints at the scene,\" and it is not true.",0,"Legal. Police may lie about evidence."],
  ["An officer says, \"Confess now and I promise you'll get probation.\"",1,"Illegal. Promising a benefit for a confession is a \"hope of benefit.\""],
  ["An officer says, \"Your friend already told us everything,\" and the friend said nothing.",0,"Legal. Claiming a witness talked is a permitted bluff."],
  ["An officer says you will be hurt if you do not talk.",1,"Illegal. Threatening harm makes a confession involuntary (a \"fear of injury\")."],
  ["You clearly say you want a lawyer, and the officer keeps questioning you.",1,"Illegal. Once you clearly invoke, the questioning must stop."],
  ["Someone you are chatting with online is an undercover officer and does not admit it, even when asked.",0,"Legal. Police do not have to identify themselves as police."],
  ["An officer says you are free to go, then asks, \"just one more question.\" You answer.",0,"Legal. A voluntary conversation is not illegal, which is why you should ask whether you are free to go and then leave."]]},
 access: { title:"Green, amber, or red access?", sub:"Use this lesson's three colors: green = someone said yes first, amber = nobody meant harm but nobody said yes, red = nobody said yes, no matter the reason.", options:["Green: authorized","Amber: grey area","Red: unauthorized"], items:[
  ["A company pays you to try to break into its website for two weeks, then you hand over a full report.",0,"Green. Someone said yes, in advance, in writing."],
  ["You guess a friend's password just to look around their account, and you change nothing.",1,"Amber in this lesson's framing: no harm meant, but no one said yes. It can still be charged as unauthorized access, so do not do it."],
  ["A stranger breaks into a store's database to steal customers' card numbers.",2,"Red. Nobody said yes, and the goal was to steal."],
  ["A company runs a bug bounty program that invites you to look for flaws in its app.",0,"Green. The invitation is the permission, as long as you follow its rules."],
  ["A student tests the school website for flaws without asking, changes nothing, and reports it.",1,"Amber. Good intentions, but nobody said yes first."],
  ["Someone secretly installs spyware on another person's phone.",2,"Red. No permission, and the purpose is to spy."],
  ["A security researcher finds a flaw, then downloads other people's private records \"to prove it.\"",2,"Red. Taking people's private data is not covered by good intentions."]]},
 front: { title:"Which lock stops this?", sub:"Match each problem to the defense from this lesson.", items:[
  ["A stranger on cafe Wi-Fi tries to read the password you type into a site.",0,"HTTPS scrambles the connection so people in the middle cannot read it.",["HTTPS","CAPTCHA","2FA","Secure coding (OWASP)"]],
  ["A bot tries thousands of stolen passwords on a login page.",1,"CAPTCHA slows down bots (along with other limits on login attempts).",["HTTPS","CAPTCHA","2FA","Secure coding (OWASP)"]],
  ["An attacker has your leaked password but not your phone.",2,"2FA: the password alone is not enough, so the stolen password does not work by itself.",["HTTPS","CAPTCHA","2FA","Secure coding (OWASP)"]],
  ["A student changes 1042 to 1043 in a web address and sees another student's grades.",3,"This is broken access control, the most common flaw on the OWASP Top 10. The fix is in the site's code: check who is asking.",["HTTPS","CAPTCHA","2FA","Secure coding (OWASP)"]],
  ["A form accepts a trick command instead of a name and the site obeys it.",3,"This is injection, another OWASP Top 10 flaw. The site must check what was typed before using it.",["HTTPS","CAPTCHA","2FA","Secure coding (OWASP)"]],
  ["A fake bank site shows a valid padlock.",3,"None of the four locks proves a site is honest. The padlock only means the connection is encrypted. Check the address and do not trust a link in a message.",["HTTPS says it is safe","CAPTCHA proves it is real","2FA proves it is real","None: the padlock does not prove honesty"]]]}
};
SETS.front.items[5][1] = 3;
function classify(el, set) {
  var S = SETS[set], i = 0, score = 0, lock = false;
  function draw() {
    if (i >= S.items.length) { el.innerHTML = "<h3>" + S.title + "</h3><div class='score'>" + score + " of " + S.items.length + " right</div><p class='sub'>" + (score === S.items.length ? "Perfect. You can spot all of these." : "Read the explanations again and retry.") + "</p><button class='go' data-r='1'>Play again</button>"; el.querySelector("[data-r]").onclick = function () { i = 0; score = 0; draw(); }; return; }
    var it = S.items[i], opts = it[3] || S.options; lock = false;
    el.innerHTML = "<h3>" + S.title + "</h3><p class='sub'>" + S.sub + "</p><div class='bar'><i style='width:" + (i / S.items.length * 100) + "%'></i></div><div class='q'>" + (i + 1) + ". " + esc(it[0]) + "</div><div class='opts'>" + opts.map(function (o, k) { return "<button data-k='" + k + "'>" + esc(o) + "</button>"; }).join("") + "</div><div id='fb'></div>";
    [].forEach.call(el.querySelectorAll(".opts button"), function (b) { b.onclick = function () {
      if (lock) return; lock = true; var k = +b.getAttribute("data-k"), ok = k === it[1]; if (ok) score++;
      [].forEach.call(el.querySelectorAll(".opts button"), function (x, j) { x.disabled = true; if (j === it[1]) x.classList.add("ok"); else if (j === k) x.classList.add("no"); });
      el.querySelector("#fb").innerHTML = "<div class='fb " + (ok ? "ok" : "no") + "'><b>" + (ok ? "Right. " : "Not quite. ") + "</b>" + esc(it[2]) + "</div><div class='opts' style='margin-top:12px'><button class='go' data-n='1'>" + (i + 1 >= S.items.length ? "See my score" : "Next") + "</button></div>";
      el.querySelector("[data-n]").onclick = function () { i++; draw(); }; }; });
  }
  draw();
}
// password lab
var COMMON = ["password","123456","123456789","qwerty","letmein","welcome","iloveyou","admin","monkey","dragon","football","baseball","sunshine","princess","abc123","111111","master","login","hello","shadow","superman","michael","jordan","batman","trustno1","passw0rd"];
function unleet(s) { return s.toLowerCase().replace(/@/g,"a").replace(/0/g,"o").replace(/1/g,"i").replace(/3/g,"e").replace(/\$/g,"s").replace(/5/g,"s").replace(/7/g,"t"); }
function fmtTime(sec) { if (sec < 1) return "less than a second"; var u = [["year",31557600],["day",86400],["hour",3600],["minute",60],["second",1]]; if (sec > 31557600 * 1e9) return "more than a billion years"; for (var k = 0; k < u.length; k++) { var v = sec / u[k][1]; if (v >= 1) { v = v >= 1e6 ? v.toExponential(1) : Math.round(v).toLocaleString(); return v + " " + u[k][0] + (v === "1" ? "" : "s"); } } return "a second"; }
function analyze(pw) {
  if (!pw) return null;
  var pool = 0; if (/[a-z]/.test(pw)) pool += 26; if (/[A-Z]/.test(pw)) pool += 26; if (/[0-9]/.test(pw)) pool += 10; if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  var bits = pw.length * Math.log(pool) / Math.LN2, words = null, segs = pw.split(/[-\s]+/);
  if (segs.length >= 3 && segs.every(function (x) { return /^[a-z]{3,9}$/.test(x); })) { words = segs.length; bits = words * Math.log(7776) / Math.LN2; }
  var rate = 1e10, sec = Math.pow(2, bits) / 2 / rate;
  var low = pw.toLowerCase(), plain = unleet(pw).replace(/[^a-z0-9]/g, ""), hit = COMMON.indexOf(low) > -1 ? "a very common password" : (COMMON.some(function (c) { return plain === c || plain.replace(/\d+$/, "") === c; }) ? "a common word with simple tricks (capital letters, numbers, look-alike symbols)" : null);
  return { bits: bits, sec: hit ? 0 : sec, hit: hit, pool: pool, words: words };
}
function passlab(el) {
  el.innerHTML = "<h3>Password cracking lab</h3><p class='sub'>Type a made-up password (never a real one). The estimate assumes an attacker who stole the site's password file can try 10 billion guesses per second. Real attackers try common passwords first, which is why the first check is a word list.</p><input type='text' id='pw' placeholder='try: P@ssw0rd!  then  river-comet-anchor-spoon' autocomplete='off' spellcheck='false'><div class='meter'><i id='mt' style='width:0'></i></div><div id='pr'></div><table><tr><th>Try these</th><th></th></tr><tr><td><button data-p='P@ssw0rd!'>P@ssw0rd!</button></td><td>A famous password with tricks.</td></tr><tr><td><button data-p='Qx7#vLm2'>Qx7#vLm2</button></td><td>Short but random: length still limits it.</td></tr><tr><td><button data-p='river-comet-anchor-spoon'>river-comet-anchor-spoon</button></td><td>Four random words (counted as words, see below).</td></tr></table><div class='fb' style='margin-top:14px'><b>The real fix is length from randomness.</b> A passphrase of 4 random words from a 7,776-word list has about 51 bits of strength (roughly 2 days at 10 billion guesses a second); 5 random words has about 65 bits (about 45 years at that speed); 6 random words is about 78 bits. Add a password manager and MFA, and never reuse a password.</div>";
  function upd() { var pw = el.querySelector("#pw").value, a = analyze(pw), pr = el.querySelector("#pr"), mt = el.querySelector("#mt"); if (!a) { pr.innerHTML = ""; mt.style.width = "0"; return; }
    var lvl = a.hit ? 0 : Math.min(100, Math.max(5, a.bits / 80 * 100)); mt.style.width = lvl + "%"; mt.style.background = a.hit || a.bits < 40 ? "#F87171" : (a.bits < 60 ? "#FBBF24" : "#34D399");
    pr.innerHTML = a.hit ? "<div class='fb no'><b>Cracked instantly.</b> This is " + a.hit + ". Cracking tools check lists like this, and the swaps, before they try anything else.</div>" : "<div class='fb " + (a.bits < 40 ? "no" : a.bits < 60 ? "" : "ok") + "'><b>About " + Math.round(a.bits) + " bits.</b> If it is not on a word list, an attacker with 10 billion guesses per second would need about <b>" + fmtTime(a.sec) + "</b> on average, " + (a.words ? "(counted as " + a.words + " random words from a 7,776-word list). That only holds if the words are truly random, not a phrase you chose." : "for " + pw.length + " characters from a pool of about " + a.pool + " symbols. This treats every character as random, so a pattern you would type, like a word plus a number, is weaker than this number.") + "</div>"; }
  el.querySelector("#pw").oninput = upd; [].forEach.call(el.querySelectorAll("[data-p]"), function (b) { b.onclick = function () { el.querySelector("#pw").value = b.getAttribute("data-p"); upd(); }; });
}
// broken access control
function idor(el) {
  var GR = { 1041: ["Sam", "B+"], 1042: ["You", "A-"], 1043: ["Riley", "C"], 1044: ["Jordan", "A"] };
  el.innerHTML = "<h3>Change one number</h3><p class='sub'>This fake school site stores grades at a web address that ends in your student ID. You are student 1042. Change the number, then turn the check on and try again.</p><div class='url'>school.example/grades/<b id='cur'>1042</b></div><div class='opts'>" + [1041, 1042, 1043, 1044].map(function (n) { return "<button data-n='" + n + "'>/" + n + "</button>"; }).join("") + "</div><div style='margin:14px 0'><label style='cursor:pointer'><input type='checkbox' id='chk' style='accent-color:#38BDF8'> The site checks who is asking (fixed)</label></div><div id='res'></div>";
  function show(n) { var chk = el.querySelector("#chk").checked; el.querySelector("#cur").textContent = n; el.querySelector("#res").innerHTML = (n === 1042 || !chk) ? "<div class='fb " + (n === 1042 ? "ok" : "no") + "'><b>Showing grades for " + GR[n][0] + ": " + GR[n][1] + ".</b> " + (n === 1042 ? "That is your own record." : "That is someone else's private record. The site never checked whether you were allowed to see it. This is <b>broken access control</b>, the #1 flaw on the OWASP Top 10. (Do not try this on a real site you do not have permission to test.)") + "</div>" : "<div class='fb ok'><b>403: not allowed.</b> The site checked that your login does not match this record and refused. Same web address, safe code.</div>"; }
  [].forEach.call(el.querySelectorAll("[data-n]"), function (b) { b.onclick = function () { show(+b.getAttribute("data-n")); }; }); el.querySelector("#chk").onchange = function () { show(+el.querySelector("#cur").textContent); }; show(1042);
}
// ad auction (simplified)
function auction(el) {
  var B = ["AdCo North", "Pixel Brokers", "TargetNow", "Daily Data Inc.", "ShopSignal", "MapMetrics", "AudienceHub", "BidBridge"];
  el.innerHTML = "<h3>Watch an ad auction</h3><p class='sub'>A simplified model: real auctions can involve many more companies and take a few hundredths of a second. Press the button to \"open an app.\"</p><button class='go' id='go'>Open the weather app</button><div id='list' style='margin-top:14px'></div><div id='fb'></div>";
  el.querySelector("#go").onclick = function () {
    var list = el.querySelector("#list"); list.innerHTML = B.map(function (b) { return "<div class='bid'><span>" + b + "</span><span>received your location + ad ID</span></div>"; }).join(""); el.querySelector("#fb").innerHTML = "";
    var rows = [].slice.call(list.children), bids = B.map(function (_, i) { return +(0.4 + ((i * 37) % 17) / 10).toFixed(2); }), w = bids.indexOf(Math.max.apply(null, bids));
    rows.forEach(function (r, i) { setTimeout(function () { r.classList.add("in"); r.lastChild.textContent = "bids $" + bids[i].toFixed(2) + " (received your data)"; }, 150 * i); });
    setTimeout(function () { rows[w].classList.add("win"); rows.forEach(function (r, i) { if (i !== w) r.classList.add("keep"); }); el.querySelector("#fb").innerHTML = "<div class='fb'><b>" + B[w] + " wins the ad slot.</b> The other " + (B.length - 1) + " lost the auction, but each already received the data. Depending on their policies, they may keep it. That is why \"I did not click the ad\" does not mean \"nobody learned where I was.\"</div>"; }, 150 * B.length + 400);
  };
}
function mount() { [].forEach.call(document.querySelectorAll(".u1w"), function (el) { var w = el.getAttribute("data-w"); if (w === "classify") classify(el, el.getAttribute("data-set")); else if (w === "passlab") passlab(el); else if (w === "idor") idor(el); else if (w === "auction") auction(el); }); }
window.U1 = { SETS: SETS, analyze: analyze, mount: mount };
if (document.readyState !== "loading") mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
