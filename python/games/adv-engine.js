/* ADVENTURE ENGINE: the point-and-click survival-horror layer for Castle Byte and Dead Signal (loaded by play.html after engine.js).
   It draws the rooms, walks the hero, shows lesson pages (LEARN mode), runs the monsters and the boss fight, and hands every lock to the normal game engine,
   which asks the SERVER the question and checks the answer. This file never knows an answer. */
(function () {
  "use strict";
  var A = window.AdvArt, W = A.W, H = A.H, FL = A.FL, SC = 4;
  var Adv = window.Adv = {};
  var P, st = null, raf = 0, lastT = 0;
  var stage = document.getElementById("stage"), V, lc, l, bg, b, lt, L;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rooms() { return st.C.rooms; }
  function roomDef(i) { return i < rooms().length ? rooms()[i] : st.C.boss; }
  function isBoss() { return st.ri >= rooms().length; }

  /* ---------------------------------------------------------------- sound: a low drone and footsteps (off when Sound is off) ---- */
  var ac = null, drone = null, stepT = 0;
  function muted() { try { return localStorage.getItem("pg:mute") === "1"; } catch (e) { return false; } }
  function audio() { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; } catch (e) { return null; } }
  function droneOn() {
    if (drone || muted()) return; var a = audio(); if (!a) return;
    var o1 = a.createOscillator(), o2 = a.createOscillator(), lfo = a.createOscillator(), g = a.createGain(), lg = a.createGain();
    o1.type = "sawtooth"; o1.frequency.value = 49; o2.type = "sine"; o2.frequency.value = 73.4; lfo.frequency.value = 0.13; g.gain.value = 0.014; lg.gain.value = 0.008;
    lfo.connect(lg); lg.connect(g.gain); o1.connect(g); o2.connect(g); g.connect(a.destination); o1.start(); o2.start(); lfo.start(); drone = { o1: o1, o2: o2, lfo: lfo, g: g };
  }
  function droneOff() { if (!drone) return; try { drone.o1.stop(); drone.o2.stop(); drone.lfo.stop(); drone.g.disconnect(); } catch (e) {} drone = null; }
  function footstep() { if (muted()) return; var a = audio(); if (!a) return; try { var o = a.createOscillator(), g = a.createGain(); o.type = "triangle"; o.frequency.value = 80 + Math.random() * 25; g.gain.value = 0.05; g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.09); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + 0.1); } catch (e) {} }

  /* ---------------------------------------------------------------- start ---- */
  Adv.has = function (game) { return !!(window.AdvContent && window.AdvContent[game]); };
  Adv.start = function (pge, j) {
    P = pge; var C = window.AdvContent[j.game];
    stage.width = W * SC; stage.height = H * SC; V = stage.getContext("2d"); V.imageSmoothingEnabled = false;
    lc = document.createElement("canvas"); lc.width = W; lc.height = H; l = lc.getContext("2d");
    bg = document.createElement("canvas"); bg.width = W; bg.height = H; b = bg.getContext("2d");
    lt = document.createElement("canvas"); lt.width = W; lt.height = H; L = lt.getContext("2d");
    st = { C: C, game: j.game, mode: j.mode, learn: j.mode === "learn", ri: 0, rs: [], q: j.question, hero: { x: 16, tx: 16, dir: 1, f: 0, ft: 0, hurt: 0, down: 0 }, state: "cut", t: 0, shake: 0, flash: 0, flashCol: "255,255,255", mon: [], amb: null, nextAmb: 20, bats: [], parts: [], loot: [], read: {}, pending: null, hover: null, cap: null, bossHp: 4, bossHurt: 0, bossHits: 0, fade: 1, fadeTo: 0, title: null, slides: null, slide: 0, slideCb: null, typed: 0, winT: 0, girl: { x: 36, run: false }, over: false, final: null, thunder: 0, noise: 0 };
    C.rooms.concat([C.boss]).forEach(function () { st.rs.push({ a: false, b: false, door: false, step: 0 }); });
    var lg = document.querySelector(".logo"); if (lg) lg.innerHTML = esc(C.title); $("pips").className = "pips small";
    var ui = $("advUI"); ui.classList.remove("hidden"); $("advInv").innerHTML = ""; $("advBoss").style.display = "none";
    $("advJournal").style.display = st.learn ? "" : "none"; $("advNotes").style.display = st.learn ? "" : "none";
    $("stageWrap").classList.add("adv");
    /* the question card lives in the puzzle window while playing */
    var body = $("puzzleBody"); ["topic", "prompt", "code", "book", "controls", "why", "teachSol"].forEach(function (id) { body.appendChild($(id)); });
    $("timerBar").style.display = "none";
    loadRoom(0, true);
    runSlides(C.intro.map(function (s) { return { scene: s.scene, text: s.learn ? (st.learn ? s.learn : s.challenge) : s.text }; }), function () { st.state = "play"; showRoomTitle(); });
    if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); }
  };
  Adv.stop = function () { cancelAnimationFrame(raf); raf = 0; droneOff(); if (st) st.state = "stopped"; };
  Adv.active = function () { return !!st && st.state !== "stopped"; };

  /* ---------------------------------------------------------------- rooms ---- */
  function loadRoom(i, instant) {
    st.ri = i; var rm = roomDef(i); b.clearRect(0, 0, W, H); A.paintRoom(b, rm);
    st.spots = []; (rm.props || []).forEach(function (p) { if (p.hot) { var bx = A.propBox(p); if (bx) st.spots.push({ p: p, box: bx, hot: p.hot }); } });
    if (isBoss() && !st.spots.some(function (s) { return s.hot === "boss"; })) st.spots.push({ p: { x: 120, label: st.C.bossName }, box: { x: 96, y: 40, w: 48, h: 76 }, hot: "boss" });
    st.hero.x = 16; st.hero.tx = 16; st.hero.dir = 1; st.mon = []; st.pending = null; st.hover = null; st.parts = [];
    if (!instant) { st.fade = 1; st.fadeTo = 0; }
    $("advBoss").style.display = isBoss() ? "block" : "none"; if (isBoss()) drawBossBar();
    var rs = st.rs[i]; if (isBoss()) rs.step = 0;
  }
  function showRoomTitle() {
    var rm = roomDef(st.ri), t = $("advTitle"); var n = isBoss() ? "FINAL" : "ROOM " + (st.ri + 1);
    t.innerHTML = "<b>" + n + "</b><span>" + esc(rm.name) + "</span>" + (st.learn && rm.lesson !== "Final" ? "<i>Lesson " + esc(rm.lesson) + ": " + esc(rm.short) + "</i>" : "");
    t.classList.remove("show"); void t.offsetWidth; t.classList.add("show"); setTimeout(function () { say(rm.arrive, 5200); }, 900);
    if (st.ri === 0 && !st.tipShown) { st.tipShown = true; setTimeout(function () { if (st && st.state === "play") say(st.learn ? "TIP: click the floor to walk. Click objects to examine them. Sparkles mean there is a lesson to read." : "TIP: click the floor to walk. Click objects to examine them.", 6500); }, 6400); }
  }
  function drawBossBar() { var h = ""; for (var i = 0; i < 4; i++) h += '<span class="seg' + (i < st.bossHp ? " on" : "") + '"></span>'; $("advBoss").innerHTML = "<b>" + esc(st.C.bossName) + "</b>" + h; }

  /* ---------------------------------------------------------------- captions and cutscenes ---- */
  var capTimer = 0;
  function say(text, ms) { var c = $("advCap"); c.textContent = text; c.classList.add("show"); clearTimeout(capTimer); if (ms !== 0) capTimer = setTimeout(function () { c.classList.remove("show"); }, ms || 3800); }
  function runSlides(slides, cb) {
    st.state = "cut"; st.slides = slides; st.slide = 0; st.slideCb = cb; st.typed = 0; $("advSkip").style.display = ""; $("advTitle").classList.remove("show"); showSlide();
  }
  function showSlide() { var s = st.slides[st.slide], c = $("advCap"); c.classList.add("show", "cut"); c.textContent = ""; st.typed = 0; st.full = s.text; clearTimeout(capTimer); }
  function nextSlide() {
    if (st.state !== "cut" || !st.slides) return; var c = $("advCap");
    if (st.typed < st.full.length) { st.typed = st.full.length; c.textContent = st.full; return; }
    st.slide++; if (st.slide >= st.slides.length) { endSlides(); return; } showSlide();
  }
  function endSlides() { var cb = st.slideCb; st.slides = null; st.state = "idle"; $("advSkip").style.display = "none"; var c = $("advCap"); c.classList.remove("show", "cut"); if (cb) cb(); }
  $("advSkip").onclick = function () { if (st.state === "cut") endSlides(); };

  /* ---------------------------------------------------------------- input ---- */
  function logical(e) { var r = stage.getBoundingClientRect(), t = e.touches && e.touches[0] ? e.touches[0] : e; return { x: (t.clientX - r.left) * W / r.width, y: (t.clientY - r.top) * H / r.height }; }
  function spotAt(pt) { var best = null; (st.spots || []).forEach(function (s) { var bx = s.box; if (pt.x >= bx.x - 3 && pt.x <= bx.x + bx.w + 3 && pt.y >= bx.y - 3 && pt.y <= bx.y + bx.h + 3) { if (!best || bx.w * bx.h < best.box.w * best.box.h) best = s; } }); return best; }
  var actor = null;   /* the Baron counts as a clickable thing in the throne room */
  stage.addEventListener("mousemove", function (e) { if (!st || st.state !== "play") { if (st) st.hover = null; return; } var pt = logical(e); st.hover = spotAt(pt); stage.style.cursor = st.hover ? "pointer" : "default"; });
  stage.addEventListener("mouseleave", function () { if (st) st.hover = null; });
  stage.addEventListener("click", function (e) {
    if (!st) return; if (st.state === "cut") { nextSlide(); return; } if (st.state !== "play") return;
    var pt = logical(e), s = spotAt(pt);
    if (s) { var stand = s.p.x < 120 ? s.p.x + 16 : s.p.x - 16; if (s.hot === "lockB") stand = s.p.x - 18; if (s.hot === "boss") stand = 84; st.hero.tx = clamp(stand, 10, 228); st.pending = s; }
    else if (pt.y > FL - 10) { st.hero.tx = clamp(pt.x, 10, 228); st.pending = null; }
  });
  function clamp(v, a, c) { return Math.max(a, Math.min(c, v)); }
  document.addEventListener("keydown", function (e) {
    if (!st || st.state === "stopped") return;
    if (e.key === "Escape") { closeModal(); }
    if (st.state === "cut" && (e.key === " " || e.key === "Enter")) { e.preventDefault(); nextSlide(); }
  });

  /* ---------------------------------------------------------------- interacting ---- */
  function interact(s) {
    var rm = roomDef(st.ri), rs = st.rs[st.ri], h = s.hot, m;
    if ((m = /^clue(\d)$/.exec(h))) { var ci = +m[1], c = rm.clues[ci]; if (st.learn) { st.read[st.ri + ":" + ci] = true; openPage(st.ri, ci); P.Snd.tick(); } else say(c.flavor, 4200); return; }
    if (h === "cage") { say("MINA: \"Please hurry! He keeps asking me questions I cannot answer!\"", 4200); return; }
    if (h === "say") { say(s.p.say, 3500); return; }
    if (h === "boss") { if (st.q) openPuzzle(); return; }
    if (h === "lockA") { if (rs.a) { say("Already open.", 2000); return; } if (st.q && st.q.room === st.ri && st.q.step === 0) { if (st.learn && !readAny(st.ri)) say("The lock looks complicated. Maybe the notes in this room explain how it works.", 3600); openPuzzle(); } return; }
    if (h === "lockB") {
      if (rs.door) { goNext(); return; }
      if (!rs.a) { say(st.learn ? "This door has a lock that needs something from this room. Open the other lock first." : "It is locked. Something else in this room must come first.", 3800); return; }
      if (st.q && st.q.room === st.ri && st.q.step === 1) openPuzzle();
    }
  }
  function readAny(ri) { for (var i = 0; i < 3; i++) if (st.read[ri + ":" + i]) return true; return false; }
  function goNext() {
    st.state = "move"; st.fade = 0; st.fadeTo = 1; setTimeout(function () { loadRoom(st.ri + 1); st.state = "play"; showRoomTitle(); }, 700);
  }

  /* ---------------------------------------------------------------- the lesson pages (learn mode) ---- */
  function modal(html, cls) { var m = $("advModal"); m.querySelector(".card").className = "card " + (cls || ""); m.querySelector(".mbody").innerHTML = html; m.classList.remove("hidden"); st.prevState = st.state === "modal" ? st.prevState : st.state; st.state = "modal"; }
  function closeModal() { var m = $("advModal"); if (m.classList.contains("hidden")) return; m.classList.add("hidden"); if (st && st.state === "modal") st.state = st.prevState || "play"; if (st && st.state === "puzzle") { /* back to the puzzle */ } }
  $("advModalX").onclick = closeModal; $("advModal").addEventListener("click", function (e) { if (e.target === $("advModal")) closeModal(); });
  function pageHtml(ri, ci) { var rm = roomDef(ri), c = rm.clues[ci]; return '<div class="pg"><div class="kick">LESSON ' + esc(rm.lesson) + ": " + esc(rm.short) + '</div><h2>' + esc(c.title) + "</h2><p>" + esc(c.text) + "</p>" + (c.ex ? '<pre class="ex">' + esc(c.ex) + "</pre>" : "") + "</div>"; }
  function openPage(ri, ci) { var rm = roomDef(ri), n = rm.clues.length, h = pageHtml(ri, ci); h += '<div class="pgnav">' + (ci > 0 ? '<button class="btn" data-pg="' + (ci - 1) + '">&#9664; Previous page</button>' : "") + (ci < n - 1 ? '<button class="btn pri" data-pg="' + (ci + 1) + '">Next page &#9654;</button>' : '<button class="btn pri" id="pgDone">Got it</button>') + '</div><div class="pgfoot">Page ' + (ci + 1) + " of " + n + " in this room. Everything you read is saved in your journal.</div>"; modal(h, "wide"); wirePages(ri); }
  function wirePages(ri) { [].forEach.call($("advModal").querySelectorAll("[data-pg]"), function (btn) { btn.onclick = function () { var k = +btn.getAttribute("data-pg"); st.read[ri + ":" + k] = true; openPage(ri, k); }; }); var d = $("pgDone"); if (d) d.onclick = closeModal; }
  function journal() {
    var h = '<h2>Journal</h2><div class="sub">Every page you have found. Click one to read it again.</div>';
    for (var i = 0; i <= Math.min(st.ri, st.C.rooms.length - 1); i++) { var rm = rooms()[i]; h += '<div class="jroom"><b>Room ' + (i + 1) + ": " + esc(rm.name) + " (" + esc(rm.lesson) + ")</b>"; rm.clues.forEach(function (c, k) { h += st.read[i + ":" + k] ? '<button class="jpg" data-j="' + i + ":" + k + '">' + esc(c.title) + "</button>" : '<span class="jpg none">? not found yet</span>'; }); h += "</div>"; }
    modal(h, "wide"); [].forEach.call($("advModal").querySelectorAll("[data-j]"), function (btn) { btn.onclick = function () { var p = btn.getAttribute("data-j").split(":"); openPage(+p[0], +p[1]); }; });
  }
  function mapModal() {
    var h = '<h2>Map</h2><div class="sub">' + esc(st.C.title) + ": " + esc(st.C.sub) + "</div>"; var all = rooms().concat([st.C.boss]);
    all.forEach(function (rm, i) { var done = i < st.ri, here = i === st.ri; h += '<div class="mrow' + (here ? " here" : done ? " done" : "") + '"><span>' + (done ? "&#10003;" : here ? "&#9654;" : "&#128274;") + "</span><b>" + esc(rm.name) + "</b><i>" + (st.learn && done || here ? esc(rm.lesson === "Final" ? "Boss" : "Lesson " + rm.lesson) : "") + "</i></div>"; });
    modal(h, ""); }
  $("advJournal").onclick = function () { if (st && (st.state === "play")) journal(); };
  $("advMap").onclick = function () { if (st && (st.state === "play")) mapModal(); };
  $("advNotes").onclick = function () { if (st && st.state === "puzzle") { st.state = "modal"; st.prevState = "puzzle"; $("puzzleOv").classList.add("under"); var ri = Math.min(st.q ? st.q.room : st.ri, st.C.rooms.length - 1), rm = roomDef(ri), h = '<h2>My notes for this room</h2>'; rm.clues.forEach(function (c, k) { h += pageHtml(ri, k); }); h += '<div class="pgnav"><button class="btn pri" id="pgDone">Back to the lock</button></div>'; modal(h, "wide"); var d = $("pgDone"); d.onclick = function () { closeModal(); st.state = "puzzle"; $("puzzleOv").classList.remove("under"); }; } };

  /* ---------------------------------------------------------------- the lock puzzle ---- */
  function openPuzzle() {
    st.state = "puzzle"; $("puzzleOv").classList.remove("hidden"); P.S.puzzleOpen = true; $("advNotes").style.display = st.learn ? "" : "none";
    $("puzzleHead").textContent = isBoss() ? st.C.bossName + ": lock " + (st.rs[st.ri].step + 1) + " of 4" : "Lock " + (st.q.step + 1) + " of 2";
    P.showQuestion(st.q);
  }
  /* the game engine calls this when the server has judged the answer */
  Adv.verdict = function (ok, r) { st.last = { ok: ok, r: r }; };
  Adv.afterContinue = function () {
    var res = st.last; if (!res) return; var ok = res.ok, r = res.r; st.last = null;
    $("puzzleOv").classList.add("hidden"); P.S.puzzleOpen = false; st.state = "play"; var rs = st.rs[st.ri];
    st.q = r.next || null;
    if (isBoss()) { rs.step++; if (ok) { st.bossHp = Math.max(0, st.bossHp - 1); st.bossHurt = 1; st.flash = 0.5; st.flashCol = "255,255,255"; P.Snd.good(); say(st.C.bossLines[Math.min(3, st.bossHits + 1)] || "", 3200); st.bossHits++; drawBossBar(); } else { attack(); say(st.C.bossLines[0], 2800); } }
    else { var step = rs.a ? 1 : 0; if (ok) { P.Snd.good(); sparkle(); if (step === 0) { rs.a = true; giveLoot(); say(lockMsg(roomDef(st.ri), true), 3600); } else { rs.b = true; rs.door = true; P.Snd.zap(); say("CLICK. The door swings open. Go through!", 3600); } }
      else { attack(); if (step === 0) { rs.a = true; giveLoot(); say("The lock jams, and something lunges at you! You wrench it open in the struggle, but it hurts.", 4200); } else { rs.b = true; rs.door = true; say("Something grabs you as you force the door. You are through, but you are hurt.", 4200); } } }
    if (r.done) { if (r.over) { setTimeout(function () { death(r.final); }, 900); } else { setTimeout(function () { victory(r.final); }, 900); } }
    else if (r.over) { setTimeout(function () { death(r.final); }, 900); }
  };
  function lockMsg(rm, good) { return good ? "CLICK. You found the " + rm.loot + "! Something else has been unlocked. Try the door." : ""; }
  function giveLoot() { var rm = roomDef(st.ri); st.loot.push(rm.loot); var c = el("span", "inv", "&#128273;"); c.title = rm.loot; $("advInv").appendChild(c); }
  function sparkle() { for (var i = 0; i < 18; i++) st.parts.push({ x: st.hero.x + (Math.random() * 30 - 5), y: FL - 20 + Math.random() * 20, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 30, life: 0.8 + Math.random() * 0.6, col: i % 2 ? "#fde047" : "#86efac" }); }

  /* ---------------------------------------------------------------- monsters and fear ---- */
  function attack() {
    var kinds = st.C.monsters, k = kinds[Math.floor(Math.random() * kinds.length)]; st.mon.push({ k: k, x: Math.min(W + 20, st.hero.x + 150), y: k === "bat" ? 50 : FL + 16, t: 0, hit: false, dir: -1 });
    P.Snd.zap();
  }
  function hurtHero() { st.hero.hurt = 0.6; st.shake = 0.5; st.flash = 0.55; st.flashCol = "255,30,30"; P.Snd.bad(); }

  /* ---------------------------------------------------------------- the end ---- */
  function death(fin) {
    if (st.state === "dead") return; st.state = "dead"; st.over = true; st.hero.down = 1; st.deadT = 0; st.fadeTo = 1; st.fade = 0; P.Snd.boom();
    setTimeout(function () { runSlides(st.C.lose, function () { P.finishRun(fin, true); }); }, 2200);
  }
  function victory(fin) {
    st.state = "win"; st.winT = 0; st.bossHp = 0; drawBossBar(); P.Snd.win(); if (window.FX) window.FX.confetti(90);
    setTimeout(function () { st.fadeTo = 1; st.fade = 0; setTimeout(function () { runSlides(st.C.win, function () { P.finishRun(fin, false); }); }, 800); }, 4200);
  }

  /* ---------------------------------------------------------------- the frame ---- */
  function frame(now) {
    raf = requestAnimationFrame(frame); if (!st || st.state === "stopped") return;
    var dt = Math.min(0.05, (now - lastT) / 1000 || 0.016); lastT = now; st.t += dt; var t = st.t; if (muted()) droneOff(); else droneOn();
    update(dt, t); draw(t);
  }
  function update(dt, t) {
    var h = st.hero;
    if (st.state === "play" || st.state === "puzzle" || st.state === "modal") {
      var dx = h.tx - h.x;
      if (Math.abs(dx) > 1 && st.state === "play") { var sp = 68 * dt; h.x += Math.sign(dx) * Math.min(Math.abs(dx), sp); h.dir = dx > 0 ? 1 : -1; h.ft += dt; h.f = 1 + (Math.floor(h.ft * 7) % 2); stepT += dt; if (stepT > 0.3) { stepT = 0; footstep(); } }
      else { h.f = 0; if (st.state === "play" && st.pending && Math.abs(dx) <= 1) { var s = st.pending; st.pending = null; h.dir = s.p.x >= h.x ? 1 : -1; interact(s); } }
    }
    h.hurt = Math.max(0, h.hurt - dt); st.shake = Math.max(0, st.shake - dt); st.flash = Math.max(0, st.flash - dt * 1.6); st.bossHurt = Math.max(0, st.bossHurt - dt * 1.4);
    if (st.fade !== st.fadeTo) { var d = st.fadeTo - st.fade; st.fade += Math.sign(d) * Math.min(Math.abs(d), dt * 1.4); }
    /* monsters rush the hero */
    st.mon.forEach(function (m) { m.t += dt; var tx = st.hero.x + 8; if (!m.hit) { m.x += (tx - m.x) * Math.min(1, dt * 5.5); if (Math.abs(m.x - tx) < 6 && m.t > 0.35) { m.hit = true; m.t = 0; hurtHero(); } } else { m.x += 60 * dt; } });
    st.mon = st.mon.filter(function (m) { return !(m.hit && m.t > 0.7); });
    /* ambient scares */
    st.nextAmb -= dt; if (st.nextAmb <= 0 && (st.state === "play")) { st.nextAmb = 22 + Math.random() * 25; st.amb = { x: -20, y: FL - 6 - Math.random() * 40, t: 0, k: Math.random() < 0.5 ? "g" : "b" }; if (st.C.world === "net") st.noise = 0.5; else if (Math.random() < 0.5) { st.thunder = 0.6; P.Snd.boom(); } }
    if (st.amb) { st.amb.t += dt; st.amb.x += 38 * dt; if (st.amb.x > W + 30) st.amb = null; }
    st.thunder = Math.max(0, st.thunder - dt); st.noise = Math.max(0, st.noise - dt);
    st.parts.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 40 * dt; p.life -= dt; }); st.parts = st.parts.filter(function (p) { return p.life > 0; });
    if (st.state === "dead") { st.deadT += dt; }
    if (st.state === "win") { st.winT += dt; var g = st.girl; if (st.winT > 1.6) { g.run = true; g.x = Math.min(st.hero.x - 12, g.x + 70 * dt); } }
    if (st.slides && st.typed < st.full.length) { st.typed = Math.min(st.full.length, st.typed + dt * 52); $("advCap").textContent = st.full.slice(0, Math.floor(st.typed)); }
  }
  function drawCutBg(t) {
    var s = st.slides && st.slides[st.slide]; l.clearRect(0, 0, W, H); var kind = s ? s.scene : "dark"; A.exterior(l, t, kind); if (kind !== "dark") { A.vignette(l); }
  }
  function draw(t) {
    var rm = roomDef(st.ri), rs = st.rs[st.ri], h = st.hero;
    if (st.state === "cut" && st.slides) { drawCutBg(t); }
    else {
      l.clearRect(0, 0, W, H); l.drawImage(bg, 0, 0);
      drawProps(rm, rs, t);
      /* the boss and the captive */
      if (isBoss()) drawBoss(t, rs);
      /* the hero */
      if (st.state === "dead") { l.save(); l.translate(h.x, FL + 16); l.rotate(Math.min(1, st.deadT * 1.2) * 1.5); A.hero(l, 0, 0, 0, h.dir, { pal: st.C.hero === "tech" ? A.SKIN.tech : null }); l.restore(); }
      else A.hero(l, h.x, FL + 16, h.f, h.dir, { pal: st.C.hero === "tech" ? A.SKIN.tech : null, hurt: h.hurt > 0 && Math.floor(t * 20) % 2 === 0, beam: !st.slides });
      if (st.state === "win") { A.girl(l, st.girl.x, FL + 16, 0, 1, { t: t }); }
      if (st.amb) { if (st.amb.k === "g") A.ghost(l, st.amb.x, st.amb.y + 20, t, 1, { alpha: 0.28 }); else A.bat(l, st.amb.x, st.amb.y, t); }
      st.mon.forEach(function (m) { var a = m.hit ? Math.max(0, 1 - m.t / 0.7) : 1; l.save(); l.globalAlpha = a; var f = 1 + (Math.floor(t * 8) % 2), dir = -1; if (m.k === "ghost") A.ghost(l, m.x, m.y + 4, t * 2, dir, { alpha: 0.95 }); else if (m.k === "bat") A.bat(l, m.x, m.y + Math.sin(m.t * 9) * 8 + 30, t); else if (m.k === "skeleton") A.skel(l, m.x, m.y, f, dir); else if (m.k === "static") A.staticMon(l, m.x, m.y, t, dir); else A.crawler(l, m.x, m.y + 6, t, dir); l.restore(); });
      /* light, dust, fog */
      var lights = (rm.lights || []).map(function (q, i) { return { x: q.x, y: q.y, r: q.r * (1 + 0.05 * Math.sin(t * 11 + i * 3) + 0.02 * Math.sin(t * 31 + i)), a: 0.95 }; });
      lights.push({ x: h.x, y: FL - 6, r: 52 + Math.sin(t * 17) * 1.5, a: 1 });
      if (st.state === "win") lights.push({ x: 120, y: 60, r: 140, a: 1 });
      var dark = st.state === "win" ? Math.max(0.05, (rm.dark || 0.55) - st.winT * 0.2) : (rm.dark || 0.55);
      A.lighting(L, lights, dark); l.drawImage(lt, 0, 0);
      A.dust(l, t, 26); if (st.C.world === "net") A.fog(l, t, 1);
      A.vignette(l);
      if (st.thunder > 0) { l.fillStyle = "rgba(220,230,255," + (st.thunder * 0.6) + ")"; l.fillRect(0, 0, W, H); }
      if (st.noise > 0) { for (var i = 0; i < 40; i++) { l.fillStyle = "rgba(200,255,255," + (Math.random() * 0.5) + ")"; l.fillRect(Math.random() * W, Math.random() * H, 20 + Math.random() * 40, 1); } }
      st.parts.forEach(function (p) { l.fillStyle = p.col; l.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); });
    }
    /* up to the big screen */
    var sx = 0, sy = 0; if (st.shake > 0) { sx = (Math.random() - 0.5) * st.shake * 16; sy = (Math.random() - 0.5) * st.shake * 12; }
    V.setTransform(1, 0, 0, 1, 0, 0); V.fillStyle = "#000"; V.fillRect(0, 0, stage.width, stage.height); V.imageSmoothingEnabled = false; V.drawImage(lc, sx, sy, stage.width, stage.height);
    if (st.flash > 0) { V.fillStyle = "rgba(" + st.flashCol + "," + Math.min(0.7, st.flash) + ")"; V.fillRect(0, 0, stage.width, stage.height); }
    if (st.state === "cut" && st.slides) { V.fillStyle = "#000"; V.fillRect(0, 0, stage.width, 46); V.fillRect(0, stage.height - 46, stage.width, 46); }
    else drawHover(t, rm, rs);
    if (st.fade > 0.01) { V.fillStyle = "rgba(0,0,0," + st.fade + ")"; V.fillRect(0, 0, stage.width, stage.height); }
    if (st.state === "dead" && st.deadT > 0.4) { V.fillStyle = "rgba(120,0,0," + Math.min(0.55, st.deadT * 0.3) + ")"; V.fillRect(0, 0, stage.width, stage.height); V.font = "bold 64px Silkscreen, monospace"; V.textAlign = "center"; V.fillStyle = "rgba(255,70,70," + Math.min(1, (st.deadT - 0.4)) + ")"; V.fillText(st.C.world === "net" ? "CONNECTION LOST" : "YOU DIED", stage.width / 2, stage.height / 2); }
  }
  function drawProps(rm, rs, t) {
    var ps = rm.props || [], order = ps.slice().sort(function (a, c) { var da = A.PROPS[a.t], dc = A.PROPS[c.t]; var ya = a.y !== undefined ? a.y : (da && da.anchor === "b" ? FL + 4 : 0), yc = c.y !== undefined ? c.y : (dc && dc.anchor === "b" ? FL + 4 : 0); return (da && da.anchor === "c" ? 0 : 1) - (dc && dc.anchor === "c" ? 0 : 1) || ya - yc; });
    order.forEach(function (p) {
      var o = Object.assign({}, p.o || {});
      if (p.hot === "lockA") { o.open = rs.a; }
      if (p.hot === "lockB") { o.open = rs.door; o.unlocked = rs.a || rs.b; }
      if (p.hot === "boss") { o.open = false; }
      A.drawProp(l, p, t, o);
      if (p.hot === "lockA" && rs.a && p.t !== "chest") A.glowSpot(l, p.x, p.y !== undefined ? p.y : FL - 14, 22, "rgba(120,255,170,A)", 0.5);
      if (st.learn && /^clue/.test(p.hot || "")) { var k = +p.hot.slice(4); if (!st.read[st.ri + ":" + k]) { var bx = A.propBox(p); var a = 0.5 + 0.5 * Math.sin(t * 4 + k); var cx = bx.x + bx.w / 2, cy = bx.y - 3 - Math.round(Math.sin(t * 3 + k) * 1.5); l.fillStyle = "rgba(255,240,150," + (0.45 + a * 0.5) + ")"; l.fillRect(Math.round(cx) - 1, cy - 3, 3, 3); l.fillRect(Math.round(cx), cy - 5, 1, 7); l.fillRect(Math.round(cx) - 3, cy - 2, 7, 1); A.glowSpot(l, cx, bx.y + bx.h / 2, Math.max(bx.w, bx.h) * 0.7, "rgba(255,240,150,A)", 0.12 + a * 0.12); } }
    });
  }
  function drawBoss(t, rs) {
    var wobble = st.bossHurt > 0 && Math.floor(t * 25) % 2 === 0;
    if (st.C.world === "net") {
      if (st.state === "win") { if (st.winT < 1.8) { var rd = A.rnd(Math.floor(t * 20)); for (var i = 0; i < 90; i++) { l.fillStyle = i % 2 ? "#6ee7ff" : "#ff3b8a"; l.fillRect(150 + (rd() - 0.5) * 70, FL - 60 + (rd() - 0.5) * 80, 2, 2); } } return; }
      l.save(); l.translate(158, FL + 14); l.scale(2, 2); A.staticMon(l, 0, 0, t, -1); if (wobble) { l.globalCompositeOperation = "source-atop"; l.fillStyle = "rgba(255,255,255,.7)"; l.fillRect(-14, -34, 28, 36); } l.restore();
    } else {
      if (st.state === "win") { if (st.winT < 2.2) { for (var j = 0; j < 14; j++) A.bat(l, 120 + Math.sin(st.winT * 3 + j) * (10 + j * 6), 70 - st.winT * 28 + j * 2, t + j); } return; }
      A.baron(l, 120, FL + 8, t, { hurt: wobble });
    }
  }
  function drawHover(t, rm, rs) {
    var s = st.hover; if (!s || st.state !== "play") return; var bx = s.box, x = bx.x * SC, y = bx.y * SC, w = bx.w * SC, hh = bx.h * SC; V.strokeStyle = "rgba(253,224,71,.9)"; V.lineWidth = 2; var c = 10;
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + hh, 1, -1], [x + w, y + hh, -1, -1]].forEach(function (p) { V.beginPath(); V.moveTo(p[0], p[1] + p[3] * c); V.lineTo(p[0], p[1]); V.lineTo(p[0] + p[2] * c, p[1]); V.stroke(); });
    var label = s.p.label || "Look"; if (s.hot === "lockA" && rs.a) label += " (open)"; V.font = "bold 15px 'JetBrains Mono', monospace"; var tw = V.measureText(label).width + 16, tx = Math.max(4, Math.min(stage.width - tw - 4, x + w / 2 - tw / 2)), ty = Math.max(6, y - 30);
    V.fillStyle = "rgba(10,8,20,.88)"; V.fillRect(tx, ty, tw, 24); V.strokeStyle = "#fde047"; V.lineWidth = 1; V.strokeRect(tx + .5, ty + .5, tw - 1, 23); V.fillStyle = "#fde047"; V.textAlign = "left"; V.fillText(label, tx + 8, ty + 17);
  }

  /* read only, for the automated tests */
  window.__advState = function () { if (!st) return null; return { state: st.state, ri: st.ri, boss: isBoss(), q: st.q ? { room: st.q.room, step: st.q.step } : null, spots: (st.spots || []).map(function (s) { return { hot: s.hot, cx: s.box.x + s.box.w / 2, cy: s.box.y + s.box.h / 2 }; }), open: !!(P && P.S.puzzleOpen), loot: st.loot.length, modal: !$("advModal").classList.contains("hidden"), learn: st.learn, slides: !!st.slides, hx: st.hero.x }; };
  Adv.hooks = { };
  Adv.sceneAdapter = { frame: function () {}, verdict: function () {}, choose: null, begin: null };
})();
