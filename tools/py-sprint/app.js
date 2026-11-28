    /* =========================================================================
       2. SOUND ENGINE (TONE.JS PROCEDURAL SYNTH)
       ========================================================================= */
    const SFX = {
      muted: false, ready: false, synth: null,
      init() {
        if (this.ready || typeof Tone === 'undefined') return;
        try {
          if (Tone.context && Tone.context.state !== 'running') Tone.start().catch(() => {});
          this.synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' }, envelope: { attack: 0.005, decay: 0.14, sustain: 0.05, release: 0.18 } }).toDestination();
          this.synth.volume.value = -10; this.ready = true;
        } catch (e) {}
      },
      play(notes, dur = '8n') { if (this.muted) return; this.init(); try { if (this.synth) this.synth.triggerAttackRelease(notes, dur); } catch (e) {} },
      startRound() { this.play(['C5', 'E5', 'G5'], '8n'); },
      pass() { this.play(['C5', 'E5', 'G5', 'C6'], '4n'); },
      fail() { this.play(['C3', 'B2'], '8n'); },
      podium() { this.play(['C5', 'E5', 'G5', 'B5', 'C6'], '2n'); }
    };

    /* =========================================================================
       3. SERVER LINK (/api/pysprint): the server owns the clock and the points.
       Everyone polls about once a second for the room and all players.
       ========================================================================= */
    const API = '/api/pysprint';
    const CLIENT_ID = '735895076358-adequmqdfpmis3vnvvfksepf19oj5nut.apps.googleusercontent.com';
    const $ = (id) => document.getElementById(id);
    const NET = {
      async call(action, extra) {
        try {
          const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ action }, extra || {})) });
          return await r.json();
        } catch (e) { return { error: 'No connection to the race server.', offline: true }; }
      }
    };

    const state = {
      role: null,              // 'host' | 'student' | 'solo'
      roomCode: null, pin: '',
      cred: '', user: null,    // signed-in student (Google)
      room: null, players: {},
      clockOffset: 0,          // server time minus this browser's time
      lastRoundRendered: -1, localSolvedRound: -1, submitting: false, endingRound: false,
      pollTimer: null, pollBusy: false, clockInterval: null, botInterval: null, typingTimer: null,
      allChallenges: [...DEFAULT_CHALLENGES],
      selectedIds: new Set(DEFAULT_CHALLENGES.slice(0, 8).map(q => q.id)),
      activityLog: [], seenSolves: {}, soloEndAt: 0
    };
    let localUid = 'solo_' + Math.random().toString(36).slice(2, 10);
    const nowSrv = () => Date.now() + state.clockOffset;

    async function pollOnce() {
      if (!state.roomCode || state.role === 'solo' || state.pollBusy) return;
      state.pollBusy = true;
      const t0 = Date.now();
      const r = await NET.call('poll', { code: state.roomCode });
      const t1 = Date.now();
      state.pollBusy = false;
      if (!state.roomCode) return;
      if (r.offline) { const d = $('hdr-sync-dot'); if (d) d.className = 'w-2 h-2 rounded-full bg-amber-400 animate-pulse'; return; }
      const d = $('hdr-sync-dot'); if (d) d.className = 'w-2 h-2 rounded-full bg-emerald-400';
      if (r.exists === false) { showToast('Room closed by the teacher.'); leaveArenaToLanding(); return; }
      if (!r.room) return;
      state.clockOffset = r.serverNow - (t0 + t1) / 2;
      const prevPlayers = state.players;
      state.room = r.room; state.players = r.players || {};
      if (state.role === 'host') noteNewSolves(prevPlayers);
      renderArenaFromState();
    }
    function startPolling() {
      stopPolling();
      state.pollTimer = setInterval(pollOnce, 1000);
      state.clockInterval = setInterval(onClockTick, 100);
      pollOnce();
    }
    function stopPolling() { clearInterval(state.pollTimer); clearInterval(state.clockInterval); clearInterval(state.botInterval); state.pollTimer = state.clockInterval = state.botInterval = null; }

    /* =========================================================================
       4. HELPERS & PYTHON EXECUTION ENGINE (SKULPT + F-STRING PREPROCESSOR)
       ========================================================================= */
    let toastTimer = null;
    function showToast(msg) {
      const el = $('toast'); el.textContent = msg; el.style.opacity = '1';
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 2800);
    }
    function escapeHtml(str) {
      return String(str == null ? '' : str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }
    function copyText(text, msg) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); showToast(msg || 'Copied!'); } catch (e) { showToast('Please copy manually.'); }
      document.body.removeChild(ta);
    }
    function generateRoomCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let out = 'PY';
      for (let i = 0; i < 3; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    }

    // Converts simple Python 3 f-strings into concatenation so Skulpt 1.2.0 runs them cleanly
    function preprocessFStrings(code) {
      return code.replace(/(^|[^A-Za-z0-9_])f(["'])((?:\\.|(?!\2).)*?)\2/g, (match, pre, quote, body) => {
        if (!body.includes('{')) return pre + quote + body + quote;
        const parts = []; let lastIdx = 0; const re = /\{([^}]+)\}/g; let m;
        while ((m = re.exec(body)) !== null) {
          if (m.index > lastIdx) parts.push(quote + body.slice(lastIdx, m.index) + quote);
          parts.push('str(' + m[1].trim() + ')'); lastIdx = m.index + m[0].length;
        }
        if (lastIdx < body.length) parts.push(quote + body.slice(lastIdx) + quote);
        return pre + '(' + (parts.length ? parts.join(' + ') : quote + quote) + ')';
      });
    }
    function checkPythonReady() {
      const dot = $('hdr-py-dot'), lbl = $('hdr-py-label');
      if (typeof Sk !== 'undefined') { dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400'; lbl.textContent = 'Python 3 Engine Ready'; }
      else { dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400'; lbl.textContent = 'Loading Python...'; setTimeout(checkPythonReady, 800); }
    }

    async function runPythonChallenge(studentCode, challenge) {
      if (typeof Sk === 'undefined') {
        return { ok: false, stdout: '', error: 'Python engine is still loading. Please wait 1 second and click Run & Submit again.', checks: [] };
      }
      const cleanedStudent = preprocessFStrings(studentCode);
      const marker = '__PY_SPRINT_TEST_MARKER__';
      const fullProgram = `${cleanedStudent}\nprint("${marker}")\n${challenge.pyTest || ''}\n`;
      let rawOutput = '';
      Sk.configure({
        output: (txt) => { rawOutput += txt; },
        read: (filename) => {
          if (!Sk.builtinFiles || !Sk.builtinFiles.files[filename]) throw new Error(`Module not found: ${filename}`);
          return Sk.builtinFiles.files[filename];
        },
        inputfun: () => 'sample', execLimit: 2500, __future__: Sk.python3
      });
      try {
        await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, fullProgram, true));
      } catch (err) {
        const msg = err && err.toString ? err.toString() : String(err);
        return { ok: false, stdout: rawOutput.split(marker)[0].trim(), error: msg, checks: [{ pass: false, label: 'Python Execution Error', hint: msg }] };
      }
      const splitIdx = rawOutput.indexOf(marker);
      const studentStdout = splitIdx >= 0 ? rawOutput.slice(0, splitIdx) : rawOutput;
      const testSection = splitIdx >= 0 ? rawOutput.slice(splitIdx + marker.length) : '';
      const checks = [], captures = {}; let activeCapKey = null;
      testSection.split(/\r?\n/).forEach(line => {
        if (line.startsWith('__CAP__|')) {
          const parts = line.split('|');
          if (parts[2] === 'START') { activeCapKey = parts[1]; captures[activeCapKey] = ''; } else if (parts[2] === 'END') { activeCapKey = null; }
          return;
        }
        if (activeCapKey !== null) { captures[activeCapKey] += (captures[activeCapKey] ? '\n' : '') + line; return; }
        if (line.startsWith('__PASS__|')) { checks.push({ pass: true, label: line.split('|')[1] || 'Passed', hint: '' }); }
        else if (line.startsWith('__FAIL__|')) { const p = line.split('|'); checks.push({ pass: false, label: p[1] || 'Failed', hint: p[2] || 'Check your syntax and requirements.' }); }
      });
      if (typeof challenge.checkStdout === 'function') {
        checks.push(...challenge.checkStdout(studentStdout, captures));
      } else if (challenge.expectedStdout !== undefined && challenge.expectedStdout !== null) {
        const expected = String(challenge.expectedStdout).trim(), actual = studentStdout.trim();
        checks.push({ pass: actual === expected, label: `Output equals "${expected}"`, hint: `Your code printed "${actual || '(nothing)'}"` });
      }
      return { ok: checks.length > 0 && checks.every(c => c.pass), stdout: studentStdout.trim(), error: null, checks };
    }

    function serializeChallenges(list) {
      return list.map(q => ({
        id: q.id, category: q.category, title: q.title, difficulty: q.difficulty || 'Custom', prompt: q.prompt,
        checklist: q.checklist || [], starter: q.starter || '', solution: q.solution || '', pyTest: q.pyTest || '',
        expectedStdout: q.expectedStdout !== undefined ? q.expectedStdout : null
      }));
    }
    function hydrateChallenge(raw) {
      const builtin = DEFAULT_CHALLENGES.find(d => d.id === raw.id);
      return builtin ? builtin : raw;
    }

    /* =========================================================================
       5. SCORING (the server uses the same formula for real races; solo demo uses it locally)
       ========================================================================= */
    function computeRoundPoints(elapsedSec, durationSec, finishOrderIndex, streakAfter) {
      const remain = Math.max(0, durationSec - elapsedSec);
      const base = 500, speedBonus = Math.round(500 * (remain / Math.max(1, durationSec)));
      const podiumBonus = finishOrderIndex === 0 ? 200 : (finishOrderIndex === 1 ? 120 : (finishOrderIndex === 2 ? 60 : 0));
      const streakBonus = Math.min(250, Math.max(0, streakAfter - 1) * 50);
      return { total: base + speedBonus + podiumBonus + streakBonus, base, speedBonus, podiumBonus, streakBonus };
    }
    function blankPlayer(uid, name, period, isBot) {
      return { uid, name, period, isBot: !!isBot, score: 0, streak: 0, roundsWon: 0, totalSolveTime: 0, roundSolved: -1, roundTime: null, roundPts: 0, roundRank: null, progressPct: 0, statusText: 'Ready in lobby', passedChecks: 0, totalChecks: 0 };
    }
    function awardLocal(p, elapsed) {   // solo demo only
      const r = state.room, rank = Object.values(state.players).filter(x => x.roundSolved === r.currentRound).length;
      const streak = (p.streak || 0) + 1, pts = computeRoundPoints(elapsed, r.durationSec, rank, streak);
      p.roundSolved = r.currentRound; p.roundTime = Number(elapsed.toFixed(1)); p.roundPts = pts.total; p.roundRank = rank + 1;
      p.score = (p.score || 0) + pts.total; p.streak = streak; p.roundsWon = (p.roundsWon || 0) + (rank === 0 ? 1 : 0);
      p.totalSolveTime = Number(((p.totalSolveTime || 0) + p.roundTime).toFixed(1)); p.progressPct = 100;
      p.statusText = `Finished #${p.roundRank} in ${p.roundTime.toFixed(1)}s (+${pts.total})`;
      return { pts, rank: p.roundRank };
    }

    /* =========================================================================
       6. AI PACE RACERS (host browser or solo demo)
       ========================================================================= */
    const BOT_PROFILES = [
      { id: 'bot_maya', name: 'Maya (APCSP)', period: 'Per 2', skill: 0.92, baseSec: 17 },
      { id: 'bot_devon', name: 'Devon (APCSP)', period: 'Per 2', skill: 0.85, baseSec: 23 },
      { id: 'bot_priya', name: 'Priya (APCSP)', period: 'Per 3', skill: 0.95, baseSec: 14 },
      { id: 'bot_lucas', name: 'Lucas (APCSP)', period: 'Per 3', skill: 0.78, baseSec: 31 },
      { id: 'bot_chloe', name: 'Chloe (APCSP)', period: 'Per 4', skill: 0.88, baseSec: 20 }
    ];
    let botPlans = {}, botCount = 4;

    function startBots(roundIdx, durationSec) {
      botPlans = {};
      BOT_PROFILES.slice(0, botCount).forEach(b => {
        const willSolve = Math.random() < b.skill;
        const targetSec = Math.min(durationSec - 3, Math.max(7, b.baseSec * (0.72 + Math.random() * 0.65)));
        botPlans[b.id] = { willSolve, targetSec, solved: false, pct: 5, status: 'Reading prompt...' };
        if (state.role === 'solo') {
          const p = state.players[b.id] || (state.players[b.id] = blankPlayer(b.id, b.name, b.period, true));
          p.progressPct = 5; p.statusText = 'Reading prompt...'; p.roundSolved = -1; p.roundTime = null; p.roundPts = 0; p.roundRank = null;
        }
      });
      clearInterval(state.botInterval);
      state.botInterval = setInterval(() => {
        const r = state.room; if (!r || r.status !== 'racing') return;
        const elapsed = (nowSrv() - r.roundStartMs) / 1000, updates = [];
        BOT_PROFILES.slice(0, botCount).forEach(b => {
          const plan = botPlans[b.id]; if (!plan || plan.solved) return;
          if (plan.willSolve && elapsed >= plan.targetSec) { plan.solved = true; updates.push({ uid: b.id.replace(/^bot_/, ''), name: b.name, period: b.period, solve: true }); }
          else {
            const pct = Math.min(88, Math.round((elapsed / Math.max(8, plan.targetSec)) * 86));
            if (Math.abs(pct - plan.pct) >= 8) {
              plan.pct = pct; plan.status = pct < 35 ? 'Typing Python...' : (pct < 70 ? 'Testing code...' : 'Refining syntax...');
              updates.push({ uid: b.id.replace(/^bot_/, ''), name: b.name, period: b.period, pct, status: plan.status });
            }
          }
        });
        if (!updates.length) return;
        if (state.role === 'solo') {
          updates.forEach(u => {
            const p = state.players['bot_' + u.uid];
            if (u.solve) { const a = awardLocal(p, elapsed); pushActivity(`🏁 ${p.name} solved Round ${r.currentRound + 1} in ${p.roundTime.toFixed(1)}s (+${a.pts.total} pts)`); }
            else { p.progressPct = u.pct; p.statusText = u.status; }
          });
          renderArenaFromState();
        } else {
          NET.call('botTick', { pin: state.pin, code: state.roomCode, bots: updates }).then(pollOnce);
        }
      }, 950);
    }

    function pushActivity(text) {
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      state.activityLog.unshift({ ts, text }); state.activityLog = state.activityLog.slice(0, 25); renderProjectorFeed();
    }
    function noteNewSolves(prev) {       // host: announce students who just finished
      const r = state.room; if (!r) return;
      Object.values(state.players).forEach(p => {
        if (p.roundSolved === r.currentRound && p.roundSolved >= 0) {
          const key = p.uid + ':' + r.currentRound;
          if (!state.seenSolves[key]) { state.seenSolves[key] = 1; pushActivity(`🏁 ${p.name} solved Round ${r.currentRound + 1} in ${Number(p.roundTime).toFixed(1)}s (+${p.roundPts} pts)`); }
        }
      });
    }

    /* =========================================================================
       7. STUDENT SIGN-IN (Google, school account)
       ========================================================================= */
    function jwtExp(c) { try { return JSON.parse(atob(c.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000; } catch (e) { return 0; } }
    function credOk() { return !!state.cred && jwtExp(state.cred) > Date.now() + 2 * 60 * 1000; }
    async function onCredential(resp) {
      state.cred = resp.credential;
      const me = await NET.call('whoami', { credential: state.cred });
      if (me.error) { state.cred = ''; const el = $('auth-err'); el.textContent = me.error; el.classList.remove('hidden'); return; }
      try { sessionStorage.setItem('psp_cred', state.cred); } catch (e) {}
      state.user = { name: me.name, email: me.email, period: me.period, fromRoster: me.fromRoster };
      localUid = me.email;
      refreshAuthUi();
    }
    function signOut() {
      state.cred = ''; state.user = null; localUid = 'solo_' + Math.random().toString(36).slice(2, 10);
      try { sessionStorage.removeItem('psp_cred'); } catch (e) {}
      try { if (window.google && google.accounts) google.accounts.id.disableAutoSelect(); } catch (e) {}
      refreshAuthUi();
    }
    function refreshAuthUi() {
      const inn = !!state.user && credOk();
      $('auth-out').classList.toggle('hidden', inn); $('auth-in').classList.toggle('hidden', !inn);
      if (inn) {
        $('auth-name').textContent = state.user.name;
        const sel = $('inp-student-period'); sel.value = state.user.period || sel.value; sel.disabled = !!state.user.fromRoster;
      }
      $('btn-join-room').disabled = !(inn && $('inp-student-period').value);
    }
    function initAuth() {
      let saved = ''; try { saved = sessionStorage.getItem('psp_cred') || ''; } catch (e) {}
      if (saved && jwtExp(saved) > Date.now() + 2 * 60 * 1000) onCredential({ credential: saved });
      let tries = 0;
      const wait = setInterval(() => {
        if (window.google && google.accounts && google.accounts.id) {
          clearInterval(wait);
          google.accounts.id.initialize({ client_id: CLIENT_ID, callback: onCredential, hd: 'socialcircleschools.org', auto_select: true });
          google.accounts.id.renderButton($('g-btn'), { theme: 'filled_blue', size: 'large', text: 'signin_with', shape: 'pill' });
          // Google sign-in tokens last about an hour: renew quietly before one expires in the middle of a race
          setInterval(() => { if (state.cred && jwtExp(state.cred) - Date.now() < 8 * 60 * 1000) { try { google.accounts.id.prompt(); } catch (e) {} } }, 60000);
        } else if (++tries > 100) {
          clearInterval(wait); const el = $('auth-err'); el.textContent = 'Google sign-in did not load. Check your connection and refresh.'; el.classList.remove('hidden');
        }
      }, 100);
    }

    /* =========================================================================
       8. VIEW SWITCHING & TEACHER CONTENT SETUP UI
       ========================================================================= */
    function showView(viewId) {
      ['view-landing', 'view-teacher-setup', 'view-arena'].forEach(id => $(id).classList.toggle('hidden', id !== viewId));
      const inArena = viewId === 'view-arena';
      $('hdr-room-pill').classList.toggle('hidden', !inArena); $('hdr-room-pill').classList.toggle('flex', inArena);
      $('hdr-race-status').classList.toggle('hidden', !inArena); $('hdr-race-status').classList.toggle('flex', inArena);
    }

    function renderTeacherSetupUI() {
      const catWrap = $('setup-category-list'); catWrap.innerHTML = '';
      APCSP_CATEGORIES.forEach(cat => {
        const qsInCat = state.allChallenges.filter(q => q.category === cat.id);
        const selInCat = qsInCat.filter(q => state.selectedIds.has(q.id)).length;
        const allChecked = qsInCat.length > 0 && selInCat === qsInCat.length;
        const row = document.createElement('label');
        row.className = `flex items-center justify-between gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs font-mono transition ${selInCat > 0 ? 'bg-sky-500/15 border-sky-400/45 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`;
        row.innerHTML = `<span class="flex items-center gap-2 min-w-0"><input type="checkbox" ${allChecked ? 'checked' : ''} class="accent-sky-400 shrink-0" /><span class="truncate font-bold">${escapeHtml(cat.name)}</span></span><span class="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-sky-300">${selInCat}/${qsInCat.length}</span>`;
        row.querySelector('input').addEventListener('change', (e) => {
          qsInCat.forEach(q => { if (e.target.checked) state.selectedIds.add(q.id); else state.selectedIds.delete(q.id); });
          renderTeacherSetupUI();
        });
        catWrap.appendChild(row);
      });
      const search = ($('setup-search-q').value || '').toLowerCase().trim();
      const qList = $('setup-questions-list'); qList.innerHTML = '';
      state.allChallenges.filter(q => !search || (q.title + ' ' + q.prompt + ' ' + q.category).toLowerCase().includes(search)).forEach(q => {
        const checked = state.selectedIds.has(q.id), catObj = APCSP_CATEGORIES.find(c => c.id === q.category);
        const item = document.createElement('label');
        item.className = `block p-3 rounded-xl border cursor-pointer transition ${checked ? 'bg-emerald-950/30 border-emerald-500/45' : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'}`;
        item.innerHTML = `<div class="flex items-start gap-3"><input type="checkbox" ${checked ? 'checked' : ''} class="mt-1 w-4 h-4 accent-emerald-400 shrink-0" /><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center justify-between gap-1.5 mb-1"><span class="font-bold text-sm text-white">${escapeHtml(q.title)}</span><span class="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-300">${escapeHtml(catObj ? catObj.name : q.category)}</span></div><p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(q.prompt)}</p></div></div>`;
        item.querySelector('input').addEventListener('change', (e) => { if (e.target.checked) state.selectedIds.add(q.id); else state.selectedIds.delete(q.id); renderTeacherSetupUI(); });
        qList.appendChild(item);
      });
      $('setup-selected-count').textContent = `${state.selectedIds.size} selected`;
    }

    function addCustomChallengeFromForm() {
      const title = $('custom-title').value.trim(), prompt = $('custom-prompt').value.trim();
      const starter = $('custom-starter').value || '# Write your Python solution below\n';
      const checkType = $('custom-check-type').value, checkVal = $('custom-check-val').value.trim();
      if (!title || !prompt || !checkVal) { showToast('Please enter a title, prompt, and test check value.'); return; }
      let pyTest = `print("__PASS__|Code executed cleanly")`, expectedStdout = null, checklist = [];
      if (checkType === 'stdout') { expectedStdout = checkVal; checklist = [`Prints "${checkVal}"`]; }
      else if (checkType === 'vars') {
        const vars = checkVal.split(',').map(v => v.trim()).filter(Boolean);
        checklist = vars.map(v => `Variable ${v} defined`);
        pyTest = `def _chk(c,l,h): print(("__PASS__|"+l) if c else ("__FAIL__|"+l+"|"+h))\n` + vars.map(v => `_chk('${v}' in globals(), "Variable '${v}' exists", "Assign a value to ${v}")`).join('\n');
      } else if (checkType === 'func') {
        const parts = checkVal.split('=='), callExpr = (parts[0] || '').trim(), expExpr = (parts[1] || '').trim();
        checklist = [`${callExpr} == ${expExpr}`];
        pyTest = `def _chk(c,l,h): print(("__PASS__|"+l) if c else ("__FAIL__|"+l+"|"+h))\n` +
          `try:\n    _res = (${callExpr})\n    _chk(_res == (${expExpr}), "${callExpr} == ${expExpr}", "Got " + str(_res))\nexcept Exception as _e:\n    _chk(False, "Calling ${callExpr}", str(_e))`;
      }
      const customQ = { id: 'custom_' + Date.now(), category: 'functions', title: '[Custom] ' + title, difficulty: 'Custom', prompt, checklist, starter: starter.endsWith('\n') ? starter : starter + '\n', solution: '# Custom instructor challenge', pyTest, expectedStdout };
      state.allChallenges.unshift(customQ); state.selectedIds.add(customQ.id);
      ['custom-title', 'custom-prompt', 'custom-starter', 'custom-check-val'].forEach(id => { $(id).value = ''; });
      renderTeacherSetupUI(); showToast(`Added custom challenge "${title}"!`);
    }

    /* =========================================================================
       9. ROOM LAUNCH, JOIN & ROUND LIFECYCLE
       ========================================================================= */
    function resetLocalRoundState() {
      state.players = {}; state.activityLog = []; state.seenSolves = {}; state.lastRoundRendered = -1; state.localSolvedRound = -1;
      state.submitting = false; state.endingRound = false; state.soloEndAt = 0; state.clockOffset = 0;
    }

    async function launchHostRoom() {
      const picked = state.allChallenges.filter(q => state.selectedIds.has(q.id));
      if (!picked.length) { showToast('Select at least 1 Python challenge before launching!'); return; }
      const pin = $('cfg-pin').value;
      if (!pin) { showToast('Enter the teacher PIN first.'); return; }
      const playlist = [...picked];
      if ($('cfg-order').value === 'shuffle') { for (let i = playlist.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [playlist[i], playlist[j]] = [playlist[j], playlist[i]]; } }
      const title = $('cfg-title').value.trim() || 'APCSP Python Sprint';
      const durationSec = parseInt($('cfg-duration').value, 10) || 60, useBots = $('cfg-bots').checked;
      let code = '', res = null;
      for (let i = 0; i < 6; i++) {
        code = generateRoomCode();
        res = await NET.call('roomCreate', { pin, room: { roomCode: code, title, durationSec, useBots, playlist: serializeChallenges(playlist) } });
        if (res.ok || res.error === 'Invalid PIN' || res.offline) break;
      }
      if (!res.ok) { showToast(res.error || 'Could not create the room.'); return; }
      state.role = 'host'; state.pin = pin; state.roomCode = code; state.room = null; resetLocalRoundState();
      showView('view-arena'); startPolling();
      if (useBots) { botCount = 4; await NET.call('botTick', { pin, code, bots: BOT_PROFILES.slice(0, 4).map(b => ({ uid: b.id.replace(/^bot_/, ''), name: b.name, period: b.period, pct: 0, status: 'Ready in lobby' })) }); }
      await pollOnce();
      showToast(`Live Room ${code} opened! Share this code with students.`);
    }

    function launchSoloPractice() {
      const name = state.user ? state.user.name : 'You (Racer)', code = 'DEMO';
      state.role = 'solo'; state.roomCode = code; resetLocalRoundState(); botCount = 5;
      const ids = ['var_five_profile', 'list_append_pop', 'fn_add_return', 'fn_mult_print', 'cond_grade', 'alg_find_max'];
      const playlist = ids.map(id => DEFAULT_CHALLENGES.find(q => q.id === id)).filter(Boolean);
      state.room = { roomCode: code, title: 'APCSP Python Speedrun Demo', status: 'racing', currentRound: 0, durationSec: 60, roundStartMs: Date.now(), showSolution: false, useBots: true, playlist: serializeChallenges(playlist) };
      state.players[localUid] = blankPlayer(localUid, name, 'Demo', false); state.players[localUid].statusText = 'Typing Python...';
      BOT_PROFILES.slice(0, 5).forEach(b => { state.players[b.id] = blankPlayer(b.id, b.name, b.period, true); });
      showView('view-arena'); state.clockInterval = setInterval(onClockTick, 100);
      startBots(0, 60); renderArenaFromState(); SFX.startRound();
      showToast('Demo Race Started! Beat the 5 AI classmates!');
    }

    async function joinExistingRoom() {
      const code = $('inp-room-code').value.trim().toUpperCase();
      if (!(state.user && credOk())) { showToast('Sign in with your school Google account first.'); return; }
      const period = $('inp-student-period').value;
      if (!period) { showToast('Pick your class first.'); return; }
      if (code.length < 3) { showToast('Please enter the Room Code from your teacher.'); return; }
      const res = await NET.call('join', { credential: state.cred, code, period });
      if (res.needLogin) { signOut(); showToast('Please sign in again.'); return; }
      if (res.error) { showToast(res.gone ? `Room "${code}" not found. Double-check the code on your teacher's screen.` : res.error); return; }
      state.role = 'student'; state.roomCode = code; state.room = null; resetLocalRoundState(); localUid = res.uid;
      showView('view-arena'); startPolling();
      showToast(`Joined Room ${code} as ${res.name}!`);
    }

    async function hostStartOrAdvanceRound(nextIndex) {
      const r = state.room; if (!r) return;
      if (state.role === 'solo') {
        if (nextIndex >= r.playlist.length) { r.status = 'finished'; clearInterval(state.botInterval); renderArenaFromState(); SFX.podium(); return; }
        Object.values(state.players).forEach(p => { if (nextIndex > 0 && p.roundSolved !== nextIndex - 1) p.streak = 0; p.roundSolved = -1; p.roundTime = null; p.roundPts = 0; p.roundRank = null; p.progressPct = 0; p.statusText = 'Reading prompt...'; });
        r.currentRound = nextIndex; r.status = 'racing'; r.roundStartMs = Date.now(); r.showSolution = false; state.soloEndAt = 0; state.endingRound = false;
        startBots(nextIndex, r.durationSec); renderArenaFromState(); SFX.startRound(); return;
      }
      if (nextIndex >= r.playlist.length) {
        clearInterval(state.botInterval);
        await NET.call('roomFinish', { pin: state.pin, code: state.roomCode });
        SFX.podium(); await pollOnce(); return;
      }
      state.endingRound = false;
      const res = await NET.call('roundStart', { pin: state.pin, code: state.roomCode, round: nextIndex });
      if (res.error) { showToast(res.error); return; }
      SFX.startRound(); await pollOnce();
    }

    async function hostEndCurrentRound() {
      const r = state.room; if (!r || r.status !== 'racing') return;
      clearInterval(state.botInterval);
      if (state.role === 'solo') { r.status = 'between'; r.showSolution = true; renderArenaFromState(); return; }
      const res = await NET.call('roundEnd', { pin: state.pin, code: state.roomCode });
      if (res.error) showToast(res.error);
      await pollOnce();
    }

    function leaveArenaToLanding() {
      stopPolling();
      state.role = null; state.roomCode = null; state.room = null; state.pin = ''; resetLocalRoundState();
      showView('view-landing'); refreshAuthUi();
    }

    /* =========================================================================
       10. RENDERING
       ========================================================================= */
    function timeInfo() {
      const r = state.room; if (!r) return { remain: 0, elapsed: 0 };
      const elapsed = r.status === 'racing' ? (nowSrv() - r.roundStartMs) / 1000 : 0;
      return { elapsed, remain: Math.max(0, r.durationSec - elapsed) };
    }

    function onClockTick() {
      const r = state.room; if (!r) return;
      const clock = $('hdr-clock');
      if (r.status === 'racing') {
        const { remain } = timeInfo();
        clock.textContent = remain.toFixed(1) + 's';
        clock.className = 'font-mono text-sm sm:text-base font-black ' + (remain <= 10 ? 'text-rose-400' : 'text-emerald-400');
        const mine = state.players[localUid];
        const mySolved = mine && mine.roundSolved === r.currentRound;
        if (state.role === 'student' && remain <= 0 && !mySolved) { const b = $('btn-submit-code'); b.disabled = true; b.classList.add('opacity-50', 'cursor-not-allowed'); }
        if (state.role === 'host' && remain <= 0 && !state.endingRound) { state.endingRound = true; hostEndCurrentRound(); }
        if (state.role === 'solo') {
          const all = Object.values(state.players), everyone = all.every(p => p.roundSolved === r.currentRound);
          if (!state.soloEndAt && mySolved) state.soloEndAt = Date.now() + 6000;
          if (remain <= 0 || everyone || (state.soloEndAt && Date.now() >= state.soloEndAt)) { if (!state.endingRound) { state.endingRound = true; hostEndCurrentRound(); } }
        }
      } else {
        clock.textContent = r.status === 'lobby' ? r.durationSec + 's' : '0.0s';
        clock.className = 'font-mono text-sm sm:text-base font-black text-slate-400';
      }
    }

    function renderLobby(r) {
      const humans = Object.values(state.players);
      $('lobby-playlist-info').textContent = `${r.playlist.length} Question${r.playlist.length === 1 ? '' : 's'} • ${r.durationSec}s / round`;
      $('lobby-racer-count').textContent = `${humans.filter(p => !p.isBot).length} Online${humans.some(p => p.isBot) ? ' + AI' : ''}`;
      $('lobby-title').textContent = state.role === 'host' ? 'Waiting for Racers to Join...' : "You're in! Waiting for the host to start...";
      $('lobby-racers-grid').innerHTML = humans.map(p => `<div class="bg-slate-950 border ${p.uid === localUid ? 'border-sky-400/60' : 'border-slate-800'} rounded-xl px-3 py-2"><div class="font-bold text-sm text-white truncate">${escapeHtml(p.name)}${p.uid === localUid ? ' <span class="text-sky-400 text-[10px]">(YOU)</span>' : ''}</div><div class="font-mono text-[10px] text-slate-400">${escapeHtml(p.period || 'APCSP')}${p.isBot ? ' • AI' : ''}</div></div>`).join('') || '<div class="col-span-full font-mono text-xs text-slate-500 text-center py-4">Nobody has joined yet.</div>';
    }

    function renderArenaFromState() {
      const r = state.room; if (!r) return;
      const total = r.playlist.length;
      const isLobby = r.status === 'lobby', isActive = r.status === 'racing' || r.status === 'between', isFinished = r.status === 'finished';
      const isHost = state.role === 'host', isSolo = state.role === 'solo';

      $('hdr-room-code').textContent = r.roomCode; $('teacher-code-inline').textContent = r.roomCode; $('lobby-room-code').textContent = r.roomCode;
      $('hdr-round-text').textContent = isLobby ? `0 / ${total}` : `${Math.min(r.currentRound + 1, total)} / ${total}`;
      $('teacher-race-title').textContent = r.title;

      const bar = $('teacher-bar'); bar.classList.toggle('hidden', !(isHost || isSolo));
      $('host-mode-tag').textContent = isSolo ? 'DEMO' : 'HOST MODE';
      $('teacher-join-hint').classList.toggle('hidden', isSolo);
      $('btn-host-start').classList.toggle('hidden', !(isHost && isLobby));
      $('btn-host-end-round').classList.toggle('hidden', !(isHost && r.status === 'racing'));
      $('btn-host-next').classList.toggle('hidden', !((isHost || isSolo) && r.status === 'between'));
      $('btn-host-next').innerHTML = r.currentRound + 1 >= total ? 'Show Final Podium &rarr;' : 'Next Question &rarr;';
      $('btn-host-solution').classList.toggle('hidden', !(isHost && isActive));
      $('btn-host-csv').classList.toggle('hidden', isSolo);
      $('btn-host-leave').textContent = isSolo ? 'Leave Demo' : 'End Room';

      $('arena-lobby').classList.toggle('hidden', !isLobby);
      $('arena-active').classList.toggle('hidden', !isActive);
      $('arena-podium').classList.toggle('hidden', !isFinished);

      if (isLobby) { renderLobby(r); return; }

      if (isActive) {
        const challenge = hydrateChallenge(r.playlist[r.currentRound] || r.playlist[0]);
        const catObj = APCSP_CATEGORIES.find(c => c.id === challenge.category);
        $('q-category-badge').textContent = catObj ? catObj.name : (challenge.category || 'APCSP');
        $('q-diff-badge').textContent = challenge.difficulty || 'APCSP';
        $('q-title').textContent = challenge.title;
        $('q-prompt').textContent = challenge.prompt;
        $('q-checklist').innerHTML = (challenge.checklist || []).map(item => `<span class="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-sky-200">✓ ${escapeHtml(item)}</span>`).join('');
        $('q-solution-box').classList.toggle('hidden', !r.showSolution);
        $('q-solution-code').textContent = challenge.solution || '# No model solution provided';

        const showStudentIde = !isHost;
        $('student-ide-card').classList.toggle('hidden', !showStudentIde);
        $('teacher-projector-card').classList.toggle('hidden', showStudentIde);

        if (state.lastRoundRendered !== r.currentRound) {
          state.lastRoundRendered = r.currentRound; state.localSolvedRound = -1; state.submitting = false;
          const ta = $('code-input'); ta.value = challenge.starter || '# Write your Python solution here\n'; updateLineNumbers();
          $('student-solved-banner').classList.add('hidden');
          const term = $('term-output'); term.textContent = 'Click "Run & Submit" (or Ctrl+Enter) to execute your Python code.';
          term.className = 'font-mono text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-h-[76px] max-h-32 overflow-y-auto custom-scroll whitespace-pre-wrap';
          $('test-results').innerHTML = '<div class="bg-slate-900/70 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px]">Tests will verify your variables, lists, functions, and output here.</div>';
          if (isHost && r.useBots && r.status === 'racing') startBots(r.currentRound, r.durationSec);
          state.activityLog = [];
        }
        // a reload or reconnect: remember a solve the server already counted
        const mine = state.players[localUid];
        if (mine && mine.roundSolved === r.currentRound) { state.localSolvedRound = r.currentRound; showSolvedBanner(mine); }

        const submitBtn = $('btn-submit-code');
        const canSubmit = r.status === 'racing' && state.localSolvedRound !== r.currentRound && timeInfo().remain > 0;
        submitBtn.disabled = !canSubmit; submitBtn.classList.toggle('opacity-50', !canSubmit); submitBtn.classList.toggle('cursor-not-allowed', !canSubmit);
        $('track-round-label').textContent = `Round ${r.currentRound + 1} of ${total}`;
        renderRaceTrackAndLeaderboard(); renderProjectorFeed();
        return;
      }
      if (isFinished) renderPodium();
    }

    function showSolvedBanner(p) {
      $('student-solved-banner').classList.remove('hidden');
      $('solved-headline').textContent = `🏁 FINISHED #${p.roundRank || 1} in ${Number(p.roundTime || 0).toFixed(1)}s!  +${p.roundPts || 0} pts`;
      $('solved-breakdown').textContent = state.lastBreakdown || '';
    }

    function renderRaceTrackAndLeaderboard() {
      if (!state.room) return;
      const rIdx = state.room.currentRound, players = Object.values(state.players);
      const finishedCount = players.filter(p => p.roundSolved === rIdx).length;
      $('proj-finish-ratio').textContent = `${finishedCount} / ${players.length}`;
      $('lb-player-count').textContent = `${players.length} Racer${players.length === 1 ? '' : 's'}`;
      const trackSorted = [...players].sort((a, b) => {
        const aS = a.roundSolved === rIdx, bS = b.roundSolved === rIdx;
        if (aS && bS) return (a.roundTime || 999) - (b.roundTime || 999);
        if (aS) return -1; if (bS) return 1;
        return (b.progressPct || 0) - (a.progressPct || 0);
      });
      const trackEl = $('live-race-track');
      trackEl.innerHTML = !trackSorted.length ? '<div class="text-xs font-mono text-slate-500 text-center py-6">No racers in room yet.</div>' : trackSorted.map(p => {
        const solved = p.roundSolved === rIdx, pct = solved ? 100 : Math.max(4, Math.min(95, p.progressPct || 0)), isMe = p.uid === localUid;
        const barClass = solved ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : (isMe ? 'bg-gradient-to-r from-sky-500 to-cyan-400 race-bar-active' : 'bg-gradient-to-r from-indigo-500 to-sky-500 race-bar-active');
        const rightBadge = solved ? `<span class="text-emerald-300 font-black">🏁 #${p.roundRank || 1} • ${Number(p.roundTime || 0).toFixed(1)}s</span>` : `<span class="text-slate-400">${pct}%</span>`;
        return `<div class="bg-slate-950/90 border ${isMe ? 'border-sky-400/60' : 'border-slate-800'} rounded-xl p-2.5"><div class="flex items-center justify-between gap-2 text-xs font-mono mb-1"><span class="font-bold text-white truncate">${escapeHtml(p.name)}${isMe ? ' <span class="text-sky-400">(YOU)</span>' : ''}</span><span class="shrink-0 text-[11px]">${rightBadge}</span></div><div class="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-1"><div class="h-full rounded-full transition-all duration-300 ${barClass}" style="width:${pct}%"></div></div><div class="font-mono text-[10px] ${solved ? 'text-emerald-300/90' : 'text-slate-400'} truncate">${escapeHtml(p.statusText || 'Coding...')}</div></div>`;
      }).join('');
      const lbSorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0) || (b.roundsWon || 0) - (a.roundsWon || 0) || (a.totalSolveTime || 9999) - (b.totalSolveTime || 9999));
      $('live-leaderboard').innerHTML = !lbSorted.length ? '<div class="text-xs font-mono text-slate-500 text-center py-6">Scores appear as racers solve challenges.</div>' : lbSorted.map((p, idx) => {
        const isMe = p.uid === localUid, medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
        const streakBadge = (p.streak || 0) >= 2 ? `<span class="ml-1.5 text-[10px] text-amber-300">🔥x${p.streak}</span>` : '';
        return `<div class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl border font-mono text-xs ${isMe ? 'bg-sky-500/15 border-sky-400/55' : 'bg-slate-950/90 border-slate-800'}"><div class="flex items-center gap-2.5 min-w-0"><span class="font-black text-sm w-6 text-center shrink-0">${medal}</span><div class="min-w-0"><div class="font-bold text-white truncate">${escapeHtml(p.name)}${streakBadge}</div><div class="text-[10px] text-slate-400 truncate">${escapeHtml(p.period || 'APCSP')} • ${p.roundsWon || 0} first-place finish${(p.roundsWon || 0) === 1 ? '' : 'es'}</div></div></div><div class="font-black text-amber-300 shrink-0">${(p.score || 0).toLocaleString()}</div></div>`;
      }).join('');
    }

    function renderProjectorFeed() {
      const feed = $('proj-activity-feed'); if (!feed) return;
      feed.innerHTML = !state.activityLog.length ? '<div class="text-slate-500 text-center py-8">Waiting for student submissions...</div>' : state.activityLog.map(ev => `<div class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-start justify-between gap-2"><span class="text-slate-200">${escapeHtml(ev.text)}</span><span class="text-[10px] text-slate-500 shrink-0">${escapeHtml(ev.ts)}</span></div>`).join('');
    }

    function standings() {
      return Object.values(state.players).sort((a, b) => (b.score || 0) - (a.score || 0) || (a.totalSolveTime || 9999) - (b.totalSolveTime || 9999));
    }
    function renderPodium() {
      const sorted = standings(), rounds = (state.room && state.room.playlist && state.room.playlist.length) || 0;
      $('podium-subtitle').textContent = `${state.room.title} • ${rounds} APCSP Python Rounds Completed`;
      const top3 = [sorted[1], sorted[0], sorted[2]].filter(Boolean), top3El = $('podium-top3');
      top3El.innerHTML = !top3.length ? '<div class="col-span-full font-mono text-xs text-slate-400">No scores recorded in this session.</div>' : top3.map(p => {
        const rank = sorted.indexOf(p) + 1;
        const style = rank === 1 ? 'bg-gradient-to-b from-amber-500/25 to-slate-950 border-amber-400/70 sm:py-7' : (rank === 2 ? 'bg-gradient-to-b from-slate-400/20 to-slate-950 border-slate-400/50 sm:py-5' : 'bg-gradient-to-b from-orange-500/20 to-slate-950 border-orange-400/50 sm:py-4');
        return `<div class="rounded-2xl border p-4 ${style} shadow-xl"><div class="text-3xl mb-1">${rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}</div><div class="font-black text-base text-white truncate">${escapeHtml(p.name)}</div><div class="font-mono text-[11px] text-slate-400 mb-2">${escapeHtml(p.period || 'APCSP')}</div><div class="font-mono text-2xl font-black text-amber-300">${(p.score || 0).toLocaleString()}</div><div class="font-mono text-[10px] text-emerald-300 mt-1">${p.roundsWon || 0} Round Wins • ${Number(p.totalSolveTime || 0).toFixed(1)}s Total</div></div>`;
      }).join('');
      $('podium-full-list').innerHTML = sorted.map((p, idx) => `<div class="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs"><span class="truncate"><strong class="text-sky-300 mr-2">#${idx + 1}</strong>${escapeHtml(p.name)} <span class="text-slate-500">(${escapeHtml(p.period || 'APCSP')})</span></span><span class="font-bold text-amber-300 shrink-0">${(p.score || 0).toLocaleString()} pts</span></div>`).join('');
    }

    function exportResultsCsv() {
      const rows = [['Rank', 'Student', 'Class', 'Type', 'Score', 'FirstPlaceFinishes', 'TotalSolveTimeSec']];
      standings().forEach((p, idx) => rows.push([idx + 1, `"${String(p.name || '').replace(/"/g, '""')}"`, `"${String(p.period || '').replace(/"/g, '""')}"`, p.isBot ? 'AI Racer' : 'Student', p.score || 0, p.roundsWon || 0, Number(p.totalSolveTime || 0).toFixed(1)]));
      const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = `py-sprint-${(state.roomCode || 'results').toLowerCase()}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      showToast('Exported class results CSV!');
    }

    /* =========================================================================
       11. STUDENT PYTHON EDITOR
       ========================================================================= */
    function updateLineNumbers() {
      const n = Math.max(1, $('code-input').value.split('\n').length);
      let s = ''; for (let i = 1; i <= n; i++) s += i + (i < n ? '\n' : '');
      $('code-gutter').textContent = s;
    }

    function sendTypingProgress() {
      const r = state.room; if (!r || r.status !== 'racing' || state.localSolvedRound === r.currentRound) return;
      const challenge = hydrateChallenge(r.playlist[r.currentRound]);
      const typed = Math.max(0, $('code-input').value.length - (challenge.starter || '').length), target = Math.max(30, (challenge.solution || '').length || 80);
      const pct = Math.max(3, Math.min(70, Math.round(typed / target * 70)));
      pushMyProgress(pct, pct < 35 ? 'Typing Python...' : 'Refining syntax...', 0, 0);
    }
    function pushMyProgress(pct, status, passed, total) {
      if (state.role === 'solo') { const p = state.players[localUid]; if (p && p.roundSolved !== state.room.currentRound) { p.progressPct = pct; p.statusText = status; renderRaceTrackAndLeaderboard(); } return; }
      if (state.role === 'student' && credOk()) NET.call('progress', { credential: state.cred, code: state.roomCode, pct, status, passed, total });
    }

    async function submitStudentCode() {
      const r = state.room;
      if (!r || r.status !== 'racing' || state.submitting || state.localSolvedRound === r.currentRound || state.role === 'host') return;
      if (timeInfo().remain <= 0) { showToast('Time is up for this round.'); return; }
      state.submitting = true;
      const term = $('term-output'), tests = $('test-results'), btn = $('btn-submit-code');
      btn.disabled = true; btn.classList.add('opacity-50'); term.textContent = 'Running your Python...';
      const challenge = hydrateChallenge(r.playlist[r.currentRound]);
      const result = await runPythonChallenge($('code-input').value, challenge);
      term.textContent = result.error ? result.error : (result.stdout || '(your code ran with no printed output)');
      term.className = 'font-mono text-xs bg-slate-900/90 border rounded-xl p-2.5 min-h-[76px] max-h-32 overflow-y-auto custom-scroll whitespace-pre-wrap ' + (result.error ? 'text-rose-300 border-rose-500/40' : 'text-slate-200 border-slate-800');
      tests.innerHTML = result.checks.map(c => `<div class="rounded-lg border px-2.5 py-1.5 text-[11px] ${c.pass ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'}">${c.pass ? '✓' : '✗'} ${escapeHtml(c.label)}${!c.pass && c.hint ? `<div class="text-[10px] text-slate-300 mt-0.5">${escapeHtml(c.hint)}</div>` : ''}</div>`).join('') || '<div class="text-[11px] text-slate-400">No tests ran.</div>';
      const passed = result.checks.filter(c => c.pass).length, total = Math.max(1, result.checks.length);

      if (!result.ok) {
        SFX.fail();
        pushMyProgress(Math.min(85, 20 + Math.round(passed / total * 60)), `${passed}/${total} tests passing`, passed, total);
        state.submitting = false; renderArenaFromState(); return;
      }
      // all tests passed: ask for the points
      let award = null;
      if (state.role === 'solo') {
        const p = state.players[localUid], a = awardLocal(p, (Date.now() - r.roundStartMs) / 1000); award = { pts: a.pts, rank: a.rank };
        pushActivity(`🏁 You solved Round ${r.currentRound + 1} in ${p.roundTime.toFixed(1)}s (+${a.pts.total} pts)`);
      } else {
        const res = await NET.call('solve', { credential: state.cred, code: state.roomCode, round: r.currentRound, passed, total });
        if (res.needLogin) { signOut(); showToast('Your sign-in expired. Sign in again.'); state.submitting = false; return; }
        if (res.error) { showToast(res.error); state.submitting = false; term.textContent += `\n\n${res.error}`; renderArenaFromState(); return; }
        award = res;
      }
      SFX.pass();
      state.localSolvedRound = r.currentRound;
      const pts = award.pts;
      state.lastBreakdown = `Base +${pts.base} • Speed +${pts.speedBonus} • Podium +${pts.podiumBonus} • Streak +${pts.streakBonus}`;
      const me = state.players[localUid] || {};
      me.roundSolved = r.currentRound; me.roundRank = award.rank; me.roundPts = pts.total; me.roundTime = me.roundTime || Number(((nowSrv() - r.roundStartMs) / 1000).toFixed(1));
      showSolvedBanner(me);
      state.submitting = false; renderArenaFromState(); pollOnce();
    }

    /* =========================================================================
       12. EVENT BINDINGS & APPLICATION BOOTSTRAP
       ========================================================================= */
    function bindEvents() {
      $('btn-home-logo').addEventListener('click', () => { if (state.room) leaveArenaToLanding(); else showView('view-landing'); });
      $('btn-copy-room').addEventListener('click', () => { if (state.roomCode) copyText(`${window.location.href.split('?')[0]}?room=${encodeURIComponent(state.roomCode)}`, `Copied Room ${state.roomCode} join link!`); });
      $('btn-open-ref').addEventListener('click', () => $('modal-ref').classList.remove('hidden'));
      $('btn-close-ref').addEventListener('click', () => $('modal-ref').classList.add('hidden'));
      $('btn-toggle-audio').addEventListener('click', () => { SFX.muted = !SFX.muted; $('btn-toggle-audio').innerHTML = SFX.muted ? '&#128263;' : '&#128266;'; showToast(SFX.muted ? 'Audio Muted' : 'Audio Enabled'); });

      $('btn-join-room').addEventListener('click', joinExistingRoom);
      $('btn-solo-practice').addEventListener('click', launchSoloPractice);
      $('btn-signout').addEventListener('click', signOut);
      $('inp-student-period').addEventListener('change', async (e) => {
        refreshAuthUi();
        if (state.user && !state.user.fromRoster && e.target.value) state.user.period = e.target.value;
      });
      $('btn-host-setup').addEventListener('click', () => { renderTeacherSetupUI(); showView('view-teacher-setup'); });
      $('inp-room-code').addEventListener('keydown', (e) => { if (e.key === 'Enter') joinExistingRoom(); });

      $('btn-setup-back').addEventListener('click', () => showView('view-landing'));
      $('btn-create-room').addEventListener('click', launchHostRoom);
      $('btn-select-all-q').addEventListener('click', () => { state.allChallenges.forEach(q => state.selectedIds.add(q.id)); renderTeacherSetupUI(); });
      $('btn-clear-all-q').addEventListener('click', () => { state.selectedIds.clear(); renderTeacherSetupUI(); });
      $('setup-search-q').addEventListener('input', renderTeacherSetupUI);
      $('btn-add-custom-q').addEventListener('click', addCustomChallengeFromForm);

      $('btn-host-start').addEventListener('click', () => hostStartOrAdvanceRound(0));
      $('btn-host-end-round').addEventListener('click', hostEndCurrentRound);
      $('btn-host-next').addEventListener('click', () => { if (state.room) hostStartOrAdvanceRound(state.room.currentRound + 1); });
      $('btn-host-solution').addEventListener('click', async () => {
        if (!state.room) return;
        await NET.call('setSolution', { pin: state.pin, code: state.roomCode, show: !state.room.showSolution }); await pollOnce();
      });
      $('btn-host-csv').addEventListener('click', exportResultsCsv);
      $('btn-host-leave').addEventListener('click', async () => {
        if (state.role === 'host' && state.roomCode) await NET.call('roomDelete', { pin: state.pin, code: state.roomCode });
        leaveArenaToLanding();
      });
      $('btn-podium-csv').addEventListener('click', exportResultsCsv);
      $('btn-podium-again').addEventListener('click', async () => {
        if (state.role === 'host' && state.roomCode) await NET.call('roomDelete', { pin: state.pin, code: state.roomCode });
        leaveArenaToLanding();
      });

      $('btn-submit-code').addEventListener('click', submitStudentCode);
      $('btn-reset-code').addEventListener('click', () => {
        if (!state.room) return;
        $('code-input').value = hydrateChallenge(state.room.playlist[state.room.currentRound]).starter || '# Write your Python solution here\n'; updateLineNumbers();
      });
      const ta = $('code-input'), gutter = $('code-gutter');
      ta.addEventListener('scroll', () => { gutter.scrollTop = ta.scrollTop; });
      ta.addEventListener('input', () => { updateLineNumbers(); clearTimeout(state.typingTimer); state.typingTimer = setTimeout(sendTypingProgress, 600); });
      ta.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submitStudentCode(); return; }
        if (e.key === 'Tab') {
          e.preventDefault(); const s = ta.selectionStart, en = ta.selectionEnd;
          ta.value = ta.value.substring(0, s) + '    ' + ta.value.substring(en); ta.selectionStart = ta.selectionEnd = s + 4; updateLineNumbers(); return;
        }
        if (e.key === 'Enter') {
          const s = ta.selectionStart, before = ta.value.slice(0, s), line = before.slice(before.lastIndexOf('\n') + 1);
          const base = (line.match(/^(\s*)/) || ['', ''])[1], extra = line.trim().endsWith(':') ? '    ' : '';
          if (base || extra) { e.preventDefault(); const ins = '\n' + base + extra, en = ta.selectionEnd; ta.value = ta.value.substring(0, s) + ins + ta.value.substring(en); ta.selectionStart = ta.selectionEnd = s + ins.length; updateLineNumbers(); }
        }
      });
    }

    function bootApp() {
      checkPythonReady();
      const roomParam = new URLSearchParams(window.location.search).get('room');
      if (roomParam) $('inp-room-code').value = roomParam.trim().toUpperCase();
      bindEvents(); renderTeacherSetupUI(); updateLineNumbers(); showView('view-landing'); refreshAuthUi(); initAuth();
    }
    if (document.readyState === 'complete') bootApp(); else window.onload = bootApp;

    window.__PSP = { runPythonChallenge, DEFAULT_CHALLENGES, hydrateChallenge, state, nowSrv };
