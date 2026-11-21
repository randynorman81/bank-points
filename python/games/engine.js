/* The game engine for python/games/play.html: sign-in, the server conversation, timer, lives, answer widgets, sound and the results screen.
   Every question and every answer is judged by the server (netlify/functions/pycode.js + gamebank.js). This file never knows the right answers. */
(function () {
  "use strict";
  var GOOGLE_CLIENT_ID = "735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com";
  var qs = new URLSearchParams(location.search), SLOT = (qs.get("slot") || "").replace(/[^a-z0-9]/gi, ""), TEACHER = qs.has("teacher"), API = "/api/pycode";
  function $(id) { return document.getElementById(id); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var G = { tleft: 30, tmax: 30, strikes: 0, correct: 0, n: 0 };
  var S = { cred: "", pin: "", game: "", run: null, q: null, scene: null, busy: false, results: [], rounds: 10, maxStrikes: 3, tick: null, t0: 0, nextTimer: null, canNext: false, onNext: null, info: null, preview: false };

  /* ---------------------------------------------------------------- sound ---- */
  var ac = null;
  function tone(f, d, type, vol, slide) {
    if (lsGet("pg:mute") === "1") return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "square"; o.frequency.value = f; if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), ac.currentTime + d);
      g.gain.value = vol || 0.05; g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
    } catch (e) {}
  }
  window.Snd = {
    good: function () { tone(660, 0.12, "square", 0.05); setTimeout(function () { tone(990, 0.2, "square", 0.05); }, 110); },
    bad: function () { tone(180, 0.35, "sawtooth", 0.07, 70); },
    tick: function () { tone(520, 0.04, "square", 0.025); },
    zap: function () { tone(900, 0.25, "sawtooth", 0.05, 120); },
    boom: function () { tone(110, 0.9, "sawtooth", 0.12, 25); setTimeout(function () { tone(70, 0.8, "square", 0.1, 20); }, 120); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { tone(f, 0.22, "square", 0.05); }, i * 130); }); }
  };
  function setMuteLabel() { $("mute").textContent = "Sound: " + (lsGet("pg:mute") === "1" ? "off" : "on"); }
  $("mute").onclick = function () { lsSet("pg:mute", lsGet("pg:mute") === "1" ? "0" : "1"); setMuteLabel(); };
  setMuteLabel();

  /* ---------------------------------------------------------------- confetti ---- */
  var fxc = $("fx"), fxx = fxc.getContext("2d"), bits = [], fxOn = false;
  function fxSize() { fxc.width = window.innerWidth; fxc.height = window.innerHeight; }
  window.addEventListener("resize", fxSize); fxSize();
  window.FX = {
    confetti: function (n) {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var cols = ["#34d399", "#fbbf24", "#60a5fa", "#f472b6", "#a78bfa", "#fb923c"];
      for (var i = 0; i < n; i++) bits.push({ x: Math.random() * fxc.width, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 120, vy: 120 + Math.random() * 220, r: Math.random() * 6, vr: (Math.random() - 0.5) * 8, c: cols[i % cols.length], w: 7 + Math.random() * 6, h: 11 + Math.random() * 8 });
      if (!fxOn) { fxOn = true; requestAnimationFrame(fxLoop); }
    }
  };
  var fxLast = 0;
  function fxLoop(t) {
    var dt = Math.min(0.05, (t - fxLast) / 1000 || 0.016); fxLast = t; fxx.clearRect(0, 0, fxc.width, fxc.height);
    bits.forEach(function (b) { b.x += b.vx * dt; b.y += b.vy * dt; b.r += b.vr * dt; fxx.save(); fxx.translate(b.x, b.y); fxx.rotate(b.r); fxx.fillStyle = b.c; fxx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); fxx.restore(); });
    bits = bits.filter(function (b) { return b.y < fxc.height + 30; });
    if (bits.length) requestAnimationFrame(fxLoop); else fxOn = false;
  }

  /* ---------------------------------------------------------------- talking to the server ---- */
  function api(body) {
    body.credential = S.cred; if (S.pin) body.pin = S.pin; body.period = lsGet("py:period") || "";
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }
  function decodeJwt(t) { try { var p = t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"); return JSON.parse(decodeURIComponent(escape(atob(p)))); } catch (e) { return {}; } }
  function credLeft(t) { return (decodeJwt(t).exp || 0) - Math.floor(Date.now() / 1000); }

  /* ---------------------------------------------------------------- the games' words ---- */
  var INFO = {
    bomb: { title: "DEFUSE THE HOUSE", story: "A bomb is ticking in the middle of the house, and its panels use Internet addresses. Solve every panel before the timer runs out!",
      how: ["Flip the switches to build numbers in <b>binary</b>. Lit = 1.", "Tap the right answer on the other panels.", "<b>3 mistakes</b> (or the clock hitting zero) and the house explodes."] },
    dns: { title: "DNS CLIFF ROAD", story: "You are a packet racing down a mountain road to find a website. At every gate pick the right lane about how DNS works. Pick wrong and the road ends at the cliff!",
      how: ["Press <b>1, 2 or 3</b> (or click a lane) to steer.", "Read the question. Read the signs. Drive the correct lane.", "<b>3 trips off the cliff</b> and the road closes."] },
    storm: { title: "STORM DASH", story: "A storm is knocking out routers across the network. Find routes for your packets around the damage before time runs out!",
      how: ["<b>Click the routers</b> one after another to draw a path. Click the last router again to undo.", "Never click a router with lightning on it: it is <b>down</b>.", "Then press <b>SEND PACKET</b>. <b>3 lost packets</b> and the network goes dark."] },
    packets: { title: "PACKET POST OFFICE RUSH", story: "Mail is arriving out of order on the conveyor belt, and some packets are getting lost. Sort it, resend what is missing, and keep the post office running!",
      how: ["Click the packets in the order they belong. The <b>sequence number</b> in each header tells you.", "Some rounds ask what is <b>missing</b> or which <b>protocol</b> to use.", "<b>3 mistakes</b> and the mail piles up."] },
    cast: { title: "CARTOON CAST DIRECTOR", story: "You are directing a cartoon, and the cast is stored in a Python <b>list</b>. Answer questions about the list to keep the show going. Every right answer adds a frame to your film!",
      how: ["Remember: the first item has <b>index 0</b>.", "Some rounds you edit the list with <b>operations</b> like append and remove.", "<b>3 mistakes</b> and the show is cancelled."] }
  };

  /* ---------------------------------------------------------------- sign in ---- */
  function showMsg(id, m, bad) { $(id).textContent = m; $(id).style.color = bad ? "#fca5a5" : ""; }
  function boot() {
    $("exit").href = "../editor.html" + (SLOT ? "#" + SLOT : ""); $("backBtn").href = $("exit").href;
    if (!SLOT) { showMsg("signMsg", "This page needs a mission in the address, like play.html?slot=a102. Open it from the editor.", true); return; }
    if (TEACHER) {
      $("pinbox").style.display = "block"; $("gbtn").style.display = "none"; $("siSub").textContent = "Teacher preview of this game.";
      var saved = ""; try { saved = sessionStorage.getItem("pypin") || ""; } catch (e) {}
      $("pinGo").onclick = function () { S.pin = $("pin").value.trim(); if (!S.pin) return; try { sessionStorage.setItem("pypin", S.pin); } catch (e) {} afterAuth(); };
      $("pin").addEventListener("keydown", function (e) { if (e.key === "Enter") $("pinGo").click(); });
      if (saved) { S.pin = saved; afterAuth(); }
      return;
    }
    initGoogle();
  }
  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) { setTimeout(initGoogle, 300); return; }
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onCredential, hd: "socialcircleschools.org", auto_select: true });
    var kept = lsGet("py:cred") || lsGet("pq:cred") || "";
    if (kept && credLeft(kept) > 120) { setTimeout(function () { onCredential({ credential: kept }); }, 0); }
    google.accounts.id.renderButton($("gbtn"), { theme: "filled_blue", size: "large", text: "signin_with", shape: "rectangular" });
    if (!kept || credLeft(kept) <= 120) google.accounts.id.prompt();
    setInterval(function () { if (S.cred && credLeft(S.cred) < 600) { try { google.accounts.id.prompt(); } catch (e) {} } }, 60000);
  }
  function onCredential(resp) {
    var p = decodeJwt(resp.credential);
    if ((p.hd || "").toLowerCase() !== "socialcircleschools.org") { showMsg("signMsg", "Please sign in with your school account (@socialcircleschools.org).", true); return; }
    var first = !S.cred; S.cred = resp.credential; lsSet("py:cred", resp.credential); lsSet("py:gamecred", "1");
    if (first) afterAuth();
  }
  function afterAuth() {
    api({ action: "gameState", slot: SLOT }).then(function (j) {
      if (!j || j.needLogin) { S.cred = ""; showMsg("signMsg", "Please sign in again.", true); return; }
      if (j.error) { showMsg("signMsg", j.error, true); if (TEACHER) { try { sessionStorage.removeItem("pypin"); } catch (e) {} S.pin = ""; } return; }
      S.game = j.game; S.preview = !!j.preview; S.info = INFO[j.game] || { title: j.title || "MISSION", story: "", how: [] };
      $("signin").classList.add("hidden"); $("teachNote").style.display = S.preview ? "block" : "none";
      $("inTitle").textContent = S.info.title; $("inStory").innerHTML = S.info.story;
      $("inHow").innerHTML = S.info.how.map(function (h) { return "<div>&#9654; " + h + "</div>"; }).join("") + "<div>&#9654; <b>10 rounds.</b> 9 right = 90 and opens the next walkthrough. 10 right = 100. You can play again, and the questions change.</div>";
      $("inBest").textContent = S.preview ? "Teacher preview: nothing is saved." : (j.best !== null && j.best !== undefined ? "Your best so far: " + j.best + " out of 100 (" + j.runs + " run" + (j.runs === 1 ? "" : "s") + ")" : "You have not played this yet.");
      $("intro").classList.remove("hidden"); document.title = S.info.title + " | SCHS Computer Science";
    }).catch(function () { showMsg("signMsg", "Could not reach the server. Check your internet and refresh.", true); });
  }
  $("startBtn").onclick = function () { $("intro").classList.add("hidden"); startRun(); };
  $("againBtn").onclick = function () { $("result").classList.add("hidden"); startRun(); };

  /* ---------------------------------------------------------------- a run ---- */
  var canvas = $("stage"), cx2 = canvas.getContext("2d"), raf = 0, last = 0;
  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    if (S.scene) { cx2.setTransform(1, 0, 0, 1, 0, 0); S.scene.frame(t / 1000, dt); }
    raf = requestAnimationFrame(loop);
  }
  function drawHud() {
    var pips = $("pips"); pips.innerHTML = "";
    for (var i = 0; i < S.rounds; i++) pips.appendChild(el("div", "pip" + (S.results[i] === true ? " good" : S.results[i] === false ? " miss" : i === G.n ? " now" : "")));
    var h = ""; for (var s = 0; s < S.maxStrikes; s++) h += s < G.strikes ? "&#128420;" : "&#10084;&#65039;"; $("hearts").innerHTML = h; $("score").textContent = G.correct;
  }
  function startRun() {
    clearTimeout(S.nextTimer); stopTimer(); $("why").className = ""; $("why").innerHTML = ""; $("controls").innerHTML = "";
    api({ action: "gameStart", slot: SLOT }).then(function (j) {
      if (!j || j.error || !j.ok) { $("intro").classList.add("hidden"); $("signin").classList.remove("hidden"); showMsg("signMsg", (j && j.error) || "Could not start the game.", true); return; }
      S.run = j.runId; S.rounds = j.rounds; S.maxStrikes = j.strikes; S.results = []; G.strikes = 0; G.correct = 0; G.n = 0; S.busy = false;
      S.scene = window.Scenes[j.game]; window.Scenes.setup(cx2, G); drawHud();
      if (!raf) raf = requestAnimationFrame(loop);
      showQuestion(j.question);
    });
  }

  /* ---------------------------------------------------------------- the timer ---- */
  function startTimer(sec) {
    stopTimer(); G.tmax = sec; G.tleft = sec; S.t0 = performance.now();
    S.tick = setInterval(function () {
      G.tleft = Math.max(0, G.tmax - (performance.now() - S.t0) / 1000); var f = $("timerFill"); f.style.transform = "scaleX(" + (G.tleft / G.tmax) + ")"; f.className = G.tleft < 6 ? "low" : "";
      if (S.scene && G.tleft < 6 && Math.ceil(G.tleft) !== S.lastTick) { S.lastTick = Math.ceil(G.tleft); window.Snd.tick(); }
      if (G.tleft <= 0) { stopTimer(); submit({ timeout: true }); }
    }, 100);
  }
  function stopTimer() { clearInterval(S.tick); S.tick = null; }

  /* ---------------------------------------------------------------- a question ---- */
  function showQuestion(q) {
    S.q = q; S.busy = false; S.canNext = false; $("why").className = ""; $("why").innerHTML = "";
    $("prompt").textContent = q.prompt;
    var code = $("code"); if (q.code) { code.style.display = "block"; code.textContent = q.code; } else code.style.display = "none";
    var book = $("book"); if (q.book) { book.style.display = "block"; book.innerHTML = "<b>PHONE BOOK</b><br>" + q.book.map(esc).join("<br>"); } else book.style.display = "none";
    var ts = $("teachSol"); if (q.sol) { ts.style.display = "block"; ts.textContent = "Teacher preview. " + solText(q); } else ts.style.display = "none";
    $("controls").innerHTML = ""; $("controls").className = "g-" + S.game; buildControls(q);
    if (S.scene.begin) S.scene.begin(q); drawHud(); startTimer(q.t || 30);
  }
  function solText(q) {
    var a = q.sol.answer; if (a.idx !== undefined && q.choices) return "Answer: " + q.choices[a.idx] + ". " + q.sol.why;
    if (a.idx !== undefined) return "Answer: item " + a.idx + ". " + q.sol.why;
    if (a.value !== undefined) return "Answer: " + a.value + ". " + q.sol.why;
    if (a.values) return "Answer: " + a.values.join(".") + ". " + q.sol.why;
    if (q.type === "route") return (a.none ? "Answer: NO ROUTE. " : "Fewest hops possible: " + a.hops + ". ") + q.sol.why;
    if (q.type === "assemble") return "Answer: 1 to " + a.total + " in order. The message is " + a.msg + ".";
    if (q.type === "missing") return "Missing: " + a.gone.join(", ") + ". " + q.sol.why;
    if (q.type === "ops") return "Target: " + a.target.join(", ") + ". " + q.sol.why;
    return "";
  }

  /* ---------------------------------------------------------------- answering ---- */
  function submit(answer) {
    if (S.busy) return; S.busy = true; stopTimer();
    [].forEach.call($("controls").querySelectorAll("button"), function (b) { b.disabled = true; });
    var attempt = 0;
    function send() {
      api({ action: "gameAnswer", runId: S.run, n: G.n, answer: answer }).then(function (r) {
        if (r && r.error) { $("why").className = "no"; $("why").innerHTML = "<b>" + esc(r.error) + "</b> Reload the page to start a new game."; return; }
        verdict(r, answer);
      }).catch(function () { if (++attempt < 4) setTimeout(send, 1200); else { $("why").className = "no"; $("why").innerHTML = "<b>Could not reach the server.</b> Check your internet and reload."; } });
    }
    send();
  }
  function verdict(r, answer) {
    var ok = !!r.correct; S.results[G.n] = ok; G.n = r.n; G.correct = r.correctCount; G.strikes = r.strikes;
    if (S.scene.verdict) S.scene.verdict(ok, r);
    markChoices(ok, answer);
    $("why").className = ok ? "ok" : "no"; $("why").innerHTML = (ok ? "<b>Correct!</b> " : (answer && answer.timeout ? "<b>Time's up!</b> " : "<b>Not quite.</b> ")) + esc(r.why || "");
    drawHud();
    if (r.done) {
      var wait = ok ? 1700 : 2800;
      S.nextTimer = setTimeout(function () {
        if (r.over) { S.scene.over && S.scene.over(); } else { S.scene.win && S.scene.win(); }
        S.nextTimer = setTimeout(function () { showResult(r.final, r.over); }, r.over ? 3300 : 3000);
      }, wait);
      return;
    }
    var btn = el("button", "btn pri", "Next &#9654;"); btn.style.marginTop = "8px"; btn.style.width = "100%";
    S.canNext = false; setTimeout(function () { S.canNext = true; }, 900);
    var go = function () { if (!S.canNext) return; clearTimeout(S.nextTimer); S.canNext = false; showQuestion(r.next); };
    btn.onclick = go; $("why").appendChild(btn); S.onNext = go;
    S.nextTimer = setTimeout(function () { S.canNext = true; go(); }, ok ? 2200 : 4800);
  }
  function showResult(f, over) {
    stopTimer(); var pct = f ? f.pct : G.correct * 10;
    $("rTitle").textContent = over ? "GAME OVER" : "ALL ROUNDS DONE";
    $("rBig").textContent = pct; $("rBig").className = "big " + (pct >= 90 ? "good" : pct >= 60 ? "mid" : "low");
    $("rMsg").textContent = pct >= 100 ? "PERFECT! Full points. You are a legend." : pct >= 90 ? "MISSION COMPLETE! That score opens the next walkthrough. Play again if you want a perfect 100." : "You need 90 or more to move on. Read the explanations, play again, and the questions will change.";
    $("rBest").textContent = S.preview ? "Teacher preview: nothing was saved." : (f && f.saved ? "Your best score is " + f.best + " out of 100 (" + f.runs + " run" + (f.runs === 1 ? "" : "s") + ")." : "");
    $("result").classList.remove("hidden"); if (pct >= 90 && window.FX) window.FX.confetti(90);
    try { if (window.opener) window.opener.postMessage({ type: "mission-game", slot: SLOT, pct: pct }, location.origin); } catch (e) {}
  }

  /* ---------------------------------------------------------------- widgets ---- */
  function markChoices(ok, answer) {
    var c = $("controls"), btns = c.querySelectorAll(".btn.pick, .cc.pick"); if (!btns.length || !answer || answer.idx === undefined) return;
    if (btns[answer.idx]) btns[answer.idx].classList.add(ok ? "right" : "wrong");
  }
  function buildControls(q) {
    var c = $("controls");
    if (q.type === "choice") return choiceWidget(c, q);
    if (q.type === "bits") return bitsWidget(c, q);
    if (q.type === "bitsip") return bitsIpWidget(c, q);
    if (q.type === "route") return routeWidget(c, q);
    if (q.type === "assemble") return assembleWidget(c, q);
    if (q.type === "missing") return missingWidget(c, q);
    if (q.type === "pickindex") return pickWidget(c, q);
    if (q.type === "ops") return opsWidget(c, q);
  }
  function choiceWidget(c, q) {
    var lanes = S.game === "dns", box = el("div", lanes ? "lanes" : "choices" + (q.choices.some(function (x) { return String(x).length > 34; }) ? " one" : ""));
    q.choices.forEach(function (ch, i) {
      var b = el("button", "btn pick", '<span class="key">' + (i + 1) + "</span><span>" + esc(ch) + "</span>");
      if (q.heroes && window.Chars.CAST[ch]) { b.insertBefore(window.Chars.icon(ch, 56), b.children[1]); b.lastChild.previousSibling.style.cssText = "width:42px;height:42px"; }
      b.onclick = function () { if (S.scene.choose) S.scene.choose(i); submit({ idx: i }); }; box.appendChild(b);
    });
    c.appendChild(box);
    if (lanes) { box.dataset.n = q.choices.length; S.scene.choose && S.scene.choose(1); }
  }
  function mkSwitches(vals, onChange) {
    var row = el("div", "bitrow"), st = vals.map(function () { return 0; }), nodes = [];
    vals.forEach(function (v, i) { var sw = el("div", "sw", '<div class="pv">' + v + '</div><div class="lamp">0</div>'); sw.onclick = function () { st[i] = st[i] ? 0 : 1; sw.classList.toggle("on", !!st[i]); sw.querySelector(".lamp").textContent = st[i]; window.Snd.tick(); onChange(); }; nodes.push(sw); row.appendChild(sw); });
    return { row: row, value: function () { var s = 0; st.forEach(function (b, i) { if (b) s += vals[i]; }); return s; } };
  }
  var PV = [128, 64, 32, 16, 8, 4, 2, 1];
  function bitsWidget(c, q) {
    var sum = el("div", "sum", "0"), tgt = el("div", "target", "= " + q.target);
    var sw = mkSwitches(PV, function () { var v = sw.value(); sum.textContent = v; sum.className = "sum" + (v === q.target ? " hit" : ""); });
    var cut = el("button", "btn red", "CUT THE WIRE"); cut.onclick = function () { submit({ value: sw.value() }); };
    c.appendChild(sw.row); var ctl = el("div", "ctl"); ctl.appendChild(tgt); ctl.appendChild(sum); ctl.appendChild(cut); c.appendChild(ctl);
  }
  function bitsIpWidget(c, q) {
    var rows = el("div", "bitrows"), sws = [], sums = [];
    q.targets.forEach(function (t, k) {
      var o = el("div", "oct"), lab = el("div", "target", t + " ="), s = el("div", "sum", "0"); s.style.fontSize = "18px";
      var sw = mkSwitches(PV, function () { var v = sw.value(); s.textContent = v; s.className = "sum" + (v === t ? " hit" : ""); s.style.fontSize = "18px"; });
      o.appendChild(lab); o.appendChild(sw.row); o.appendChild(s); rows.appendChild(o); sws.push(sw);
    });
    c.appendChild(rows); var cut = el("button", "btn red", "CUT THE WIRE"); cut.style.margin = "10px auto 0"; cut.style.display = "block"; cut.onclick = function () { submit({ values: sws.map(function (s) { return s.value(); }) }); }; c.appendChild(cut);
  }
  function routeWidget(c, q) {
    var info = el("div", "lbl", ""), send = el("button", "btn go", "SEND PACKET"), clear = el("button", "btn", "Clear"), row = el("div", "ctl");
    function upd() { var p = S.scene.getPath(); info.textContent = "Route: " + p.join(" > ") + "   (" + Math.max(0, p.length - 1) + " hops)"; send.disabled = !S.scene.done(); }
    S.onSceneChange = upd; send.onclick = function () { submit({ path: S.scene.getPath() }); }; clear.onclick = function () { S.scene.reset(); upd(); };
    row.appendChild(clear); row.appendChild(send);
    if (q.canFail) { var nr = el("button", "btn red", "NO ROUTE EXISTS"); nr.onclick = function () { submit({ none: true }); }; row.appendChild(nr); }
    c.appendChild(info); c.appendChild(row); upd();
  }
  canvas.addEventListener("click", function (e) {
    if (!S.scene || !S.scene.click || S.busy) return;
    var r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) * canvas.width / r.width, y = (e.clientY - r.top) * canvas.height / r.height;
    if (S.scene.click(x, y) && S.onSceneChange) S.onSceneChange();
  });
  function assembleWidget(c, q) {
    var belt = el("div", "belt"), slots = el("div", "slots"), order = [], cards = {};
    q.packets.forEach(function (p) { var card = el("div", "pkt", '<div class="h">seq ' + p.seq + '</div><div class="d">' + esc(p.data) + "</div>"); card.onclick = function () { if (order.indexOf(p.seq) > -1) return; order.push(p.seq); card.classList.add("used"); window.Snd.tick(); draw(); }; cards[p.seq] = card; belt.appendChild(card); });
    var send = el("button", "btn go", "SEND THE MESSAGE"), undo = el("button", "btn", "Undo"), row = el("div", "ctl");
    function draw() {
      slots.innerHTML = ""; for (var i = 0; i < q.total; i++) { var seq = order[i], s = el("div", seq ? "pkt" : "slot", seq ? '<div class="h">seq ' + seq + '</div><div class="d">' + esc(q.packets.filter(function (p) { return p.seq === seq; })[0].data) + "</div>" : String(i + 1)); (function (sq) { if (sq) s.onclick = function () { order = order.filter(function (v) { return v !== sq; }); cards[sq].classList.remove("used"); draw(); }; })(seq); slots.appendChild(s); }
      send.disabled = order.length !== q.total;
    }
    undo.onclick = function () { var l = order.pop(); if (l) cards[l].classList.remove("used"); draw(); };
    send.onclick = function () { submit({ order: order.slice() }); };
    c.appendChild(el("div", "lbl", "ARRIVED (click to place)")); c.appendChild(belt); c.appendChild(el("div", "lbl", "REBUILD THE MESSAGE (left to right)")); c.appendChild(slots); row.appendChild(undo); row.appendChild(send); c.appendChild(row); draw();
  }
  function missingWidget(c, q) {
    var got = el("div", "belt"), nums = el("div", "nums"), sel = [], btns = [];
    q.shown.forEach(function (n) { got.appendChild(el("div", "pkt", '<div class="h">seq ' + n + '</div><div class="d">ok</div>')); });
    for (var n = 1; n <= q.total; n++) (function (n) {
      var arrived = q.shown.indexOf(n) > -1, b = el("button", "btn numbtn" + (arrived ? " got" : ""), String(n));
      b.onclick = function () { if (arrived) { window.Snd.bad(); return; } var k = sel.indexOf(n); if (k > -1) sel.splice(k, 1); else { if (!q.multi) sel.length = 0; sel.push(n); } btns.forEach(function (x) { x.b.classList.toggle("sel", sel.indexOf(x.n) > -1); }); send.disabled = !sel.length; window.Snd.tick(); };
      btns.push({ n: n, b: b }); nums.appendChild(b);
    })(n);
    var send = el("button", "btn go", q.multi ? "REQUEST RESEND" : "REQUEST RESEND"); send.disabled = true; send.onclick = function () { submit({ missing: sel.slice() }); };
    c.appendChild(el("div", "lbl", "PACKETS THAT ARRIVED")); c.appendChild(got); c.appendChild(el("div", "lbl", q.multi ? "SELECT EVERY MISSING NUMBER (1 to " + q.total + ")" : "WHICH NUMBER (1 to " + q.total + ") IS MISSING?")); c.appendChild(nums);
    var ctl = el("div", "ctl"); ctl.appendChild(send); c.appendChild(ctl);
  }
  function charCard(ch, i, showIdx) {
    var d = el("div", "cc pick"); d.appendChild(window.Chars.icon(ch.name, 96)); d.appendChild(el("div", "nm", esc(ch.name))); if (showIdx) d.appendChild(el("div", "ix", "?")); return d;
  }
  function pickWidget(c, q) {
    var row = el("div", "cast"); q.cast.forEach(function (ch, i) { var d = charCard(ch, i, true); d.onclick = function () { submit({ idx: i }); }; row.appendChild(d); }); c.appendChild(row);
  }
  function opText(op) { var p = op.split(":"); return p[0] === "append" ? 'cast.append("' + p[1] + '")' : p[0] === "insert" ? "cast.insert(" + p[1] + ', "' + p[2] + '")' : p[0] === "remove" ? 'cast.remove("' + p[1] + '")' : "cast.pop()"; }
  function applyOps(start, ops) { var l = start.slice(); for (var i = 0; i < ops.length; i++) { var p = ops[i].split(":"); if (p[0] === "append") l.push(p[1]); else if (p[0] === "insert") l.splice(Number(p[1]), 0, p[2]); else if (p[0] === "remove") { var k = l.indexOf(p[1]); if (k < 0) return null; l.splice(k, 1); } else if (p[0] === "pop") { if (!l.length) return null; l.pop(); } } return l; }
  function miniRow(names, label) { var r = el("div", "listrow"), t = el("div", "lbl", label); r.appendChild(t); names.forEach(function (n) { var m = el("div", "mini"); m.appendChild(window.Chars.icon(n, 64)); m.appendChild(el("span", "", esc(n))); r.appendChild(m); }); if (!names.length) r.appendChild(el("span", "lbl", "(empty list)")); return r; }
  function opsWidget(c, q) {
    var seq = [], cur = el("div", ""), tgt = miniRow(q.target, "TARGET:"), pal = el("div", "palette"), box = el("div", "opseq"), run = el("button", "btn go", "RUN THE EDITS"), undo = el("button", "btn", "Undo last"), row = el("div", "ctl");
    function draw() {
      var now = applyOps(q.start, seq); cur.innerHTML = ""; cur.appendChild(miniRow(now || [], "YOUR LIST:"));
      box.innerHTML = seq.length ? seq.map(function (o, i) { return (i + 1) + ". " + esc(opText(o)); }).join("<br>") : "Tap operations below. They run in order, top to bottom.";
      run.disabled = !seq.length || !now;
    }
    q.palette.forEach(function (op) { var b = el("button", "btn", esc(opText(op))); b.onclick = function () { if (seq.length >= q.max) { window.Snd.bad(); return; } seq.push(op); window.Snd.tick(); draw(); }; pal.appendChild(b); });
    undo.onclick = function () { seq.pop(); draw(); }; run.onclick = function () { submit({ ops: seq.slice() }); };
    c.appendChild(tgt); c.appendChild(cur); c.appendChild(pal); c.appendChild(box); row.appendChild(undo); row.appendChild(run); c.appendChild(row); draw();
  }

  /* ---------------------------------------------------------------- keyboard ---- */
  document.addEventListener("keydown", function (e) {
    if (e.target && e.target.tagName === "INPUT") return;
    if ((e.key === " " || e.key === "Enter") && S.canNext && S.onNext) { e.preventDefault(); S.onNext(); return; }
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4 && S.q && S.q.type === "choice" && !S.busy) { var b = $("controls").querySelectorAll(".btn.pick")[n - 1]; if (b) b.click(); }
    if (S.game === "dns" && !S.busy && S.scene && S.scene.choose && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { var d = e.key === "ArrowLeft" ? -1 : 1; S.scene.choose(Math.max(0, Math.min(2, S.scene.lane + d))); e.preventDefault(); }
  });

  window.__pgSubmit = function (a) { submit(a); };   /* for the automated tests: the server still judges the answer */
  window.__pgState = function () { return { q: S.q, busy: S.busy, n: G.n, strikes: G.strikes, correct: G.correct, game: S.game, canNext: S.canNext }; };   /* read-only, for the automated tests */
  boot();
})();
