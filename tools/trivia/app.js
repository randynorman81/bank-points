/* Clark After Dark Trivia: user interface */
(function () {
  'use strict';
  const C = window.CAD, P = window.CADPDF;
  const $ = (s, r) => (r || document).querySelector(s);
  const app = $('#app');
  const GC = C.GCODES;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const gcls = g => 'gc' + (GC.indexOf(g) % 7);
  const gtag = g => `<span class="tag ${gcls(g)}">${esc(C.GENRES[g] || g)}</span>`;
  const dots = d => `<span class="dots" title="${C.DIFF[d]}">${'●'.repeat(d)}<i>${'●'.repeat(3 - d)}</i></span>`;
  const TOTAL_GAMES = C.GAMES.length, TOTAL_MONTHS = Math.ceil(TOTAL_GAMES / 4);

  const S = {
    tab: 'games', month: 1, set: null, gsearch: '', gsearchRes: null,
    bank: { text: '', genres: new Set(), topic: '', diffs: new Set([1, 2, 3]), mc: false, scope: 'all', page: 0, showAns: false, target: '' },
    mode: C.store.get('mode', 'free'),
    build: { title: '', count: 35, mix: 'balanced', genres: new Set(), extras: true }
  };
  let sets = C.store.get('sets', []);
  const saveSets = () => { if (!C.store.set('sets', sets)) toast('Could not save in this browser (private window?). Use Export in My Sets to keep your work.'); };

  /* ---------- tiny helpers ---------- */
  let tt;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200); }
  function setSummary(set) {
    const n = set.ids.length, rd = C.roundsOf(set).length;
    return `${n} questions · ${rd} round${rd === 1 ? '' : 's'}` + (set.rebus && set.rebus.length ? ` · ${set.rebus.length} picture puzzles` : '') + (set.songs && set.songs.length ? ` · ${set.songs.length} music songs` : '') + (set.tb ? ' · tiebreaker' : '');
  }
  function spotlight(set) {
    const c = {}; set.ids.forEach(id => { const q = C.Qs.get(id); if (q) c[q.g] = (c[q.g] || 0) + 1; });
    const top = Object.keys(c).filter(g => c[g] >= 3);
    return top.length ? top : Object.keys(c).sort((a, b) => c[b] - c[a]).slice(0, 3);
  }
  function guard(fn) { try { fn(); } catch (e) { console.error(e); toast(e.message || 'Something went wrong.'); } }
  function copyText(txt, okMsg) {
    const fallback = () => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(okMsg); } catch (e) { toast('Copy was blocked by the browser. Use Download CSV instead.'); } ta.remove(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => toast(okMsg), fallback); else fallback();
  }

  /* ---------- router ---------- */
  function go(tab) { S.tab = tab; S.set = null; if (location.hash) history.replaceState(null, '', location.pathname + location.search); render(); app.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  function openSet(set) { S.set = set; render(); window.scrollTo(0, 0); }
  function openGame(n) {
    n = Math.max(1, Math.min(TOTAL_GAMES, parseInt(n, 10) || 1));
    const set = C.gameSet(n, S.mode); S.month = set.month; S.set = set; S.tab = 'games';
    history.replaceState(null, '', '#game=' + n); render(); window.scrollTo(0, 0);
  }

  /* ---------- GAMES ---------- */
  function renderGames() {
    const m = S.month, first = (m - 1) * 4 + 1;
    const cards = [0, 1, 2, 3].map(i => first + i).filter(n => n <= TOTAL_GAMES).map(n => {
      const g = C.gameSet(n, S.mode);
      return `<article class="card"><div class="wk">Month ${g.month} · Week ${g.week}</div><h3>Game #${C.pad(n)}</h3>
        <div class="tags">${spotlight(g).map(gtag).join('')}</div>
        <div class="small muted">${setSummary(g)}</div>
        <div class="btns"><button class="btn primary sm" data-act="open-game" data-n="${n}">Open game</button>
        <button class="btn sm" data-act="pdf-game" data-n="${n}" data-k="all">PDF packet</button>
        <button class="btn sm" data-act="csv-game" data-n="${n}">Sheets CSV</button></div></article>`;
    }).join('');
    const res = S.gsearchRes;
    let resHtml = '';
    if (res) {
      resHtml = res.list.length ? `<p class="small muted">${res.total} question${res.total === 1 ? '' : 's'} match; they appear in these games (first ${res.list.length}):</p><div class="btns">${res.list.map(r => `<button class="btn sm" data-act="open-game" data-n="${r.n}">#${C.pad(r.n)}${r.c > 1 ? ' ×' + r.c : ''}</button>`).join('')}</div>` : '<p class="muted">No games found for that search.</p>';
    }
    return `<section class="hero"><h1>Run a trivia night in minutes.</h1>
      <p>${TOTAL_GAMES.toLocaleString()} ready-made games, each with 35 questions in 5 rounds, 2 picture puzzles, a 5-song music round and a tiebreaker, all pulled from a ${C.Qs.size.toLocaleString()}-question bank. Print the team sheets, grab the host key, or put it on the TV.</p>
      <div class="chips"><span class="chip"><b>${TOTAL_GAMES.toLocaleString()}</b> games</span><span class="chip"><b>${(C.Qs.size - C.custom.length).toLocaleString()}</b> questions</span><span class="chip"><b>${GC.length}</b> genres</span><span class="chip"><b>${C.META.topics.length}</b> topics</span><span class="chip"><b>${C.REBUS.length}</b> picture puzzles</span><span class="chip"><b>${C.SONGS.length}</b> music-round songs</span></div></section>
    <section class="panel"><div class="row sp">
      <div class="row"><button class="btn" data-act="month-prev" ${m <= 1 ? 'disabled' : ''}>&larr; Prev</button>
        <label class="f">Month<input type="number" min="1" max="${TOTAL_MONTHS}" value="${m}" data-bind="month" aria-label="Month number"></label>
        <button class="btn" data-act="month-next" ${m >= TOTAL_MONTHS ? 'disabled' : ''}>Next &rarr;</button>
        <span class="muted small">of ${TOTAL_MONTHS}</span></div>
      <div class="row"><label class="f">Jump to game #<input type="number" min="1" max="${TOTAL_GAMES}" placeholder="1-${TOTAL_GAMES}" data-bind="jump" aria-label="Game number"></label>
        <button class="btn" data-act="jump">Go</button><button class="btn" data-act="random-game">Random game</button></div></div></section>
    <section class="cards" aria-label="Games in month ${m}">${cards}</section>
    <section class="panel" style="margin-top:16px"><div class="row sp"><div><h2>Month ${m} packet</h2><p class="muted small" style="margin:0">Host answer keys, question sheets and team answer sheets for all four weeks in one PDF.</p></div>
      <div class="btns"><button class="btn primary" data-act="pdf-month" data-m="${m}">Download month PDF</button><button class="btn" data-act="csv-month" data-m="${m}">Month CSV for Google Sheets</button></div></div></section>
    <section class="panel"><h2>Find games by topic</h2><p class="muted small">Type a name, place or subject (for example <em>Beatles</em>, <em>Georgia</em>, <em>volcano</em>) to see which games feature it.</p>
      <div class="row"><input type="search" class="grow" placeholder="Search the bank, then see the games that use it" value="${esc(S.gsearch)}" data-bind="gsearch" aria-label="Search games by topic"><button class="btn" data-act="gsearch">Search</button></div>
      <div style="margin-top:10px">${resHtml}</div></section>`;
  }

  /* ---------- SET VIEW (game or custom set) ---------- */
  function renderSet() {
    const set = S.set, isCustom = set.kind === 'custom';
    const rounds = C.roundsOf(set);
    let qn = 0;
    const roundHtml = rounds.map((r, ri) => `<div class="round"><h3><span>Round ${ri + 1}</span><span class="small muted">${r.length} questions</span></h3>${r.map(id => {
      const q = C.Qs.get(id); if (!q) return ''; qn++;
      const idx = set.ids.indexOf(id);
      let body = `<div class="qt">${esc(q.q)}</div>`;
      if (S.mode === 'mc' && C.hasMC(q)) { const m = C.mcOptions(q); body += `<div class="opts">${m.opts.map((o, i) => `<div class="opt ${S.showAns && o === q.a ? 'right' : ''}"><b>${'ABCD'[i]}</b>${esc(o)}</div>`).join('')}</div>`; }
      if (S.showAns) body += `<div class="ans">Answer: ${esc(q.a)}</div>`;
      body += `<div class="meta">${gtag(q.g)}<span>${esc(q.t)}</span>${dots(q.d)}<span>#${q.id}</span>${q.mine ? '<span class="mine">mine</span>' : ''}</div>`;
      const acts = isCustom ? `<div class="acts"><button class="btn sm" data-act="up" data-i="${idx}" aria-label="Move up">↑</button><button class="btn sm" data-act="down" data-i="${idx}" aria-label="Move down">↓</button><button class="btn sm danger" data-act="rm" data-i="${idx}" aria-label="Remove question">✕</button></div>` : '<div></div>';
      return `<div class="q"><div class="n">${qn}.</div><div>${body}</div>${acts}</div>`;
    }).join('')}</div>`).join('');
    const rebusHtml = (set.rebus && set.rebus.length) ? `<div class="round"><h3><span>Picture puzzles</span><span class="small muted">decode the emoji</span></h3><div class="extra">${set.rebus.map((i, k) => { const p = C.REBUS[i]; return `<div class="pill"><div class="small muted">P${k + 1} · ${esc(p[2])}</div><div class="rebus">${esc(p[0])}</div>${S.showAns ? `<div class="ans">Answer: ${esc(p[1])}</div>` : ''}</div>`; }).join('')}</div></div>` : '';
    const songHtml = (set.songs && set.songs.length) ? `<div class="round"><h3><span>Music round</span><span class="small muted">play each clip; teams name the artist</span></h3><div class="extra">${set.songs.map((i, k) => { const s = C.SONGS[i]; return `<div class="pill"><div class="small muted">M${k + 1} · ${esc(s[2])}</div><div><b>"${esc(s[0])}"</b></div>${S.showAns ? `<div class="ans">Artist: ${esc(s[1])}</div>` : ''}<div class="small" style="margin-top:6px"><a href="${esc(C.ytLink(s))}" target="_blank" rel="noopener">Find the song on YouTube</a></div></div>`; }).join('')}</div></div>` : '';
    const tb = set.tb && C.Qs.get(set.tb);
    const tbHtml = tb ? `<div class="round"><h3><span>Tiebreaker</span><span class="small muted">closest guess wins</span></h3><div class="pill"><div class="qt">${esc(tb.q)}</div>${S.showAns ? `<div class="ans">Answer: ${esc(tb.a)}</div>` : ''}</div></div>` : '';
    const nav = set.kind === 'game' ? `<div class="btns"><button class="btn sm" data-act="open-game" data-n="${Math.max(1, set.no - 1)}" ${set.no <= 1 ? 'disabled' : ''}>&larr; Game ${set.no - 1}</button><button class="btn sm" data-act="open-game" data-n="${Math.min(TOTAL_GAMES, set.no + 1)}" ${set.no >= TOTAL_GAMES ? 'disabled' : ''}>Game ${set.no + 1} &rarr;</button></div>` : '';
    return `<section class="panel setbar">
      <div class="row sp"><button class="btn sm" data-act="back">&larr; ${isCustom ? 'My Sets' : 'All games'}</button>${nav}</div>
      <div><h1 style="margin-bottom:4px">${isCustom ? `<input type="text" value="${esc(set.title)}" data-bind="settitle" aria-label="Set title" style="font-size:1.4rem;font-weight:800;width:min(100%,520px)">` : esc(set.title)}</h1>
        <div class="muted">${set.kind === 'game' ? `Month ${set.month} · Week ${set.week} · ` : ''}${setSummary(set)}</div></div>
      <div class="row"><div class="seg" role="group" aria-label="Question format"><button class="${S.mode === 'free' ? 'on' : ''}" data-act="mode" data-v="free">Free response</button><button class="${S.mode === 'mc' ? 'on' : ''}" data-act="mode" data-v="mc">Multiple choice</button></div>
        <label class="small"><input type="checkbox" data-bind="showans" ${S.showAns ? 'checked' : ''}> Show answers</label>
        <label class="f">Event date (prints on sheets)<input type="date" value="${esc(set.date || '')}" data-bind="setdate"></label>
        <label class="f">Venue (prints on sheets)<input type="text" value="${esc(set.venue || '')}" data-bind="setvenue" placeholder="Restaurant name"></label></div>
      <div class="btns">
        <button class="btn primary" data-act="pdf" data-k="sheet">Team answer sheet (PDF)</button>
        <button class="btn primary" data-act="pdf" data-k="host">Host answer key (PDF)</button>
        <button class="btn" data-act="pdf" data-k="questions">Question sheet (PDF)</button>
        <button class="btn" data-act="pdf" data-k="tally">Host tally sheet (PDF)</button>
        <button class="btn" data-act="pdf" data-k="all">Full game packet (PDF)</button></div>
      <div class="btns">
        <button class="btn teal" data-act="csv">Download CSV (opens in Google Sheets)</button>
        <button class="btn teal" data-act="tsv">Copy for Google Sheets</button>
        <a class="btn teal" href="https://sheets.new" target="_blank" rel="noopener" style="text-decoration:none">New Google Sheet</a>
        <button class="btn" data-act="present">Present on screen</button>
        ${set.kind === 'game' ? '<button class="btn" data-act="customize">Customize a copy</button>' : '<button class="btn" data-act="reroll">New picture puzzles + songs</button>'}</div>
    </section>${roundHtml}${rebusHtml}${songHtml}${tbHtml}`;
  }

  /* ---------- BANK ---------- */
  const PAGE = 40;
  function renderBank() {
    const b = S.bank;
    const topics = C.META.topics.filter(t => !b.genres.size || C.searchBank({ genres: b.genres, topic: t }).length);
    const list = C.searchBank({ text: b.text, genres: b.genres, topic: b.topic, diffs: b.diffs, mc: b.mc, scope: b.scope });
    const pages = Math.max(1, Math.ceil(list.length / PAGE)); b.page = Math.min(b.page, pages - 1);
    const slice = list.slice(b.page * PAGE, b.page * PAGE + PAGE);
    S._list = list;
    const items = slice.map(q => `<div class="q"><div class="n">#${q.id}</div><div><div class="qt">${esc(q.q)}</div>
      ${b.showAns ? `<div class="ans">Answer: ${esc(q.a)}</div><div class="opts">${q.w.map(w => `<div class="opt">${esc(w)}</div>`).join('')}</div>` : ''}
      <div class="meta">${gtag(q.g)}<span>${esc(q.t)}</span>${dots(q.d)}${q.mine ? '<span class="mine">mine</span>' : ''}</div></div>
      <div class="acts"><button class="btn sm" data-act="add-q" data-id="${q.id}">+ Add to set</button></div></div>`).join('');
    const targets = `<option value="">New set</option>` + sets.map(s => `<option value="${s.id}" ${b.target === s.id ? 'selected' : ''}>${esc(s.title)}</option>`).join('');
    return `<section class="panel filters"><div class="row"><input type="search" class="grow" placeholder="Search questions, answers or topics (e.g. beatles, volcano, capital)" value="${esc(b.text)}" data-bind="btext" aria-label="Search the bank">
      <select data-bind="btopic" aria-label="Topic"><option value="">All topics</option>${topics.map(t => `<option ${b.topic === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>
      <select data-bind="bscope" aria-label="Scope"><option value="all" ${b.scope === 'all' ? 'selected' : ''}>Whole bank</option><option value="mine" ${b.scope === 'mine' ? 'selected' : ''}>Only my questions</option></select></div>
      <div class="genres" role="group" aria-label="Genres">${GC.map(g => `<button class="${b.genres.has(g) ? 'on' : ''}" data-act="bgenre" data-g="${g}">${esc(C.GENRES[g])}</button>`).join('')}<button data-act="bclear">Clear</button></div>
      <div class="row"><span class="small muted">Difficulty</span>${[1, 2, 3].map(d => `<label class="small"><input type="checkbox" data-bind="bdiff" data-d="${d}" ${b.diffs.has(d) ? 'checked' : ''}> ${C.DIFF[d]}</label>`).join('')}
        <label class="small"><input type="checkbox" data-bind="bmc" ${b.mc ? 'checked' : ''}> Multiple-choice ready</label>
        <label class="small"><input type="checkbox" data-bind="bshow" ${b.showAns ? 'checked' : ''}> Show answers</label></div></section>
    <section class="panel"><div class="row sp"><div><b>${list.length.toLocaleString()}</b> question${list.length === 1 ? '' : 's'} match</div>
      <div class="btns"><select data-bind="btarget" aria-label="Add questions to"><option disabled>Add to…</option>${targets}</select>
        <button class="btn sm" data-act="add-page">Add this page (${slice.length})</button>
        <button class="btn sm" data-act="add-all" ${list.length > 400 ? 'disabled title="Narrow the search to 400 or fewer first"' : ''}>Add all (${list.length})</button>
        <button class="btn sm teal" data-act="bank-csv">CSV</button><button class="btn sm teal" data-act="bank-tsv">Copy for Sheets</button><button class="btn sm" data-act="bank-pdf" ${list.length > 800 ? 'disabled title="PDF is limited to 800 questions; narrow the search"' : ''}>PDF</button></div></div>
      ${items || '<div class="empty">No questions match these filters.</div>'}
      <div class="pager"><button class="btn sm" data-act="bpage" data-d="-1" ${b.page <= 0 ? 'disabled' : ''}>&larr; Prev</button><span class="small muted">Page ${b.page + 1} of ${pages}</span><button class="btn sm" data-act="bpage" data-d="1" ${b.page >= pages - 1 ? 'disabled' : ''}>Next &rarr;</button></div></section>`;
  }

  /* ---------- MY SETS ---------- */
  function renderSets() {
    const bd = S.build;
    const list = sets.map(s => `<article class="card"><h3>${esc(s.title)}</h3><div class="small muted">${setSummary(s)}</div>
      <div class="btns"><button class="btn primary sm" data-act="open-set" data-id="${s.id}">Open</button><button class="btn sm" data-act="dup-set" data-id="${s.id}">Duplicate</button><button class="btn sm danger" data-act="del-set" data-id="${s.id}">Delete</button></div></article>`).join('');
    const mine = C.custom.map(q => `<div class="q"><div class="n">${esc(q.id)}</div><div><div class="qt">${esc(q.q)}</div><div class="ans">Answer: ${esc(q.a)}</div>${q.w.length ? `<div class="opts">${q.w.map(w => `<div class="opt">${esc(w)}</div>`).join('')}</div>` : ''}<div class="meta">${gtag(q.g)}<span>${esc(q.t)}</span>${dots(q.d)}</div></div><div class="acts"><button class="btn sm danger" data-act="del-custom" data-id="${q.id}">Delete</button></div></div>`).join('');
    return `<section class="panel"><h2>Build a set from the bank</h2><p class="muted small">Pick a size, a difficulty feel and (optionally) genres. We pull a balanced, random set from the bank, easy to hard, and you can swap anything afterward.</p>
      <div class="row"><label class="f">Title<input type="text" value="${esc(bd.title)}" placeholder="Tuesday at the brewery" data-bind="btitle"></label>
        <label class="f">Questions<input type="number" min="5" max="100" value="${bd.count}" data-bind="bcount"></label>
        <label class="f">Feel<select data-bind="bmix"><option value="easy" ${bd.mix === 'easy' ? 'selected' : ''}>Friendly</option><option value="balanced" ${bd.mix === 'balanced' ? 'selected' : ''}>Balanced</option><option value="hard" ${bd.mix === 'hard' ? 'selected' : ''}>Brain burner</option><option value="any" ${bd.mix === 'any' ? 'selected' : ''}>Anything goes</option></select></label>
        <label class="small"><input type="checkbox" data-bind="bextras" ${bd.extras ? 'checked' : ''}> Add 2 picture puzzles, 5-song music round and a tiebreaker</label></div>
      <div class="genres" style="margin-top:10px" role="group" aria-label="Genres for new set">${GC.map(g => `<button class="${bd.genres.has(g) ? 'on' : ''}" data-act="sgenre" data-g="${g}">${esc(C.GENRES[g])}</button>`).join('')}</div>
      <div class="btns" style="margin-top:12px"><button class="btn primary" data-act="build-set">Build random set</button><button class="btn" data-act="empty-set">Start empty set</button></div></section>
    <section class="panel"><h2>My sets</h2>${list ? `<div class="cards">${list}</div>` : '<p class="muted">No saved sets yet. Build one above, customize a game, or add questions from the Question Bank.</p>'}</section>
    <section class="panel"><h2>Write your own questions</h2><p class="muted small">They go into your personal bank (searchable under "Only my questions") and can be dropped into any set. Wrong answers are optional; add three to make it work in multiple-choice mode.</p>
      <div class="row"><label class="f grow">Question<textarea id="cq-q" placeholder="Which Georgia city hosts the Masters?"></textarea></label></div>
      <div class="row" style="margin-top:8px"><label class="f">Correct answer<input type="text" id="cq-a"></label><label class="f">Wrong 1<input type="text" id="cq-w1"></label><label class="f">Wrong 2<input type="text" id="cq-w2"></label><label class="f">Wrong 3<input type="text" id="cq-w3"></label></div>
      <div class="row" style="margin-top:8px"><label class="f">Genre<select id="cq-g">${GC.map(g => `<option value="${g}">${esc(C.GENRES[g])}</option>`).join('')}</select></label><label class="f">Topic<input type="text" id="cq-t" placeholder="Local Flavor"></label><label class="f">Difficulty<select id="cq-d"><option value="1">Easy</option><option value="2" selected>Medium</option><option value="3">Hard</option></select></label><button class="btn primary" data-act="add-custom" style="align-self:end">Save question</button></div>
      <div style="margin-top:14px">${mine || '<p class="muted small">You have not written any questions yet.</p>'}</div></section>
    <section class="panel"><h2>Back up</h2><p class="muted small">Sets and questions live in this browser. Export them to move to another computer or keep a copy.</p>
      <div class="btns"><button class="btn" data-act="export-data">Export JSON</button><label class="btn" style="cursor:pointer">Import JSON<input type="file" accept=".json,application/json" data-bind="import" hidden></label></div></section>`;
  }

  /* ---------- HOST GUIDE ---------- */
  function renderGuide() {
    return `<section class="hero"><h1>Host guide</h1><p>Everything you need to run a smooth night: how the sheets work, how scoring and bonus points go, and a simple way to pitch a venue.</p></section>
    <div class="guide two"><section class="panel"><h2>How a night runs</h2><ul>
      <li><b>Before:</b> open a game, print one <em>Team answer sheet</em> per team (plus a few extras) and keep the <em>Host answer key</em> with you.</li>
      <li><b>Rounds:</b> 5 rounds of 7 questions, easy to hard, then 2 picture puzzles, a 5-song music round and a tiebreaker. Read each question twice.</li>
      <li><b>Multiple choice:</b> flip the toggle to show A-D choices. The answer sheet switches to circle-the-letter rows.</li>
      <li><b>Grading:</b> swap sheets between tables, read the answers, and have teams hand sheets to you. Use the <em>Host tally sheet</em> to keep scores.</li>
      <li><b>On the TV:</b> press <em>Present on screen</em>. Space or the right arrow moves forward, <b>A</b> reveals the answer, <b>T</b> starts a 30-second timer, Esc exits.</li></ul></section>
    <section class="panel"><h2>Bonus points</h2><ul>
      <li>Every answer sheet has a <b>Host Bonus Points</b> box at the top, a bonus slot in every round header, and a <b>+ Host Bonus</b> box in the totals row.</li>
      <li>Ideas: double-points final round, 2 points for the toughest question, +1 for the best team name, +2 for dressing up on theme night, +1 for a table that tips the server.</li>
      <li>Announce a bonus before you read the question so every team can play for it.</li></ul>
      <h2>Rules printed on every sheet</h2><ul><li>No phones or looking things up.</li><li>No shouting answers.</li><li>One sheet per team, host's ruling is final.</li><li>Ties go to the closest tiebreaker guess.</li></ul></section>
    <section class="panel"><h2>Getting your first venue</h2><ul>
      <li>Pitch a slow night (Sunday to Wednesday) when the kitchen has room.</li>
      <li>Explain the value: teams that arrive at 6:30 eat, drink and stay for 2 hours.</li>
      <li>Start with a free trial month, then agree a fee per game. Many hosts charge more as attendance grows.</li>
      <li>Bring flyers, a mic if needed, pens, and extra sheets.</li></ul></section>
    <section class="panel"><h2>Where to take the data</h2><ul>
      <li><b>PDF:</b> every game and set has Team Sheet, Host Key, Question Sheet, Tally and Full Packet downloads.</li>
      <li><b>Google Sheets:</b> download the CSV and open it from Google Sheets (<em>File &rarr; Import &rarr; Upload</em>), or press <em>Copy for Google Sheets</em> and paste into cell A1.</li>
      <li><b>Bank:</b> filter the Question Bank, then download that selection as CSV, PDF or copy it to Sheets.</li></ul></section></div>`;
  }

  /* ---------- render ---------- */
  function render() {
    $('#tabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
    if (S.set) app.innerHTML = renderSet();
    else app.innerHTML = { games: renderGames, bank: renderBank, sets: renderSets, guide: renderGuide }[S.tab]();
  }

  /* ---------- exports ---------- */
  function pdfFor(set, kind) {
    set.mode = S.mode;
    const kinds = kind === 'all' ? ['host', 'questions', 'sheet', 'tally'] : [kind];
    const name = 'clark-after-dark-' + P.slug(set.title) + (kind === 'all' ? '-packet' : '-' + kind);
    P.savePdf([set], kinds, name); toast('PDF ready: ' + name + '.pdf');
  }
  function csvFor(set) {
    const rows = C.setRows(set);
    C.download('clark-after-dark-' + P.slug(set.title) + '.csv', C.toCSV(rows), 'text/csv;charset=utf-8'); toast('CSV downloaded. In Google Sheets choose File, Import, Upload.');
  }
  function monthSets(m) { const out = []; for (let i = 0; i < 4; i++) { const n = (m - 1) * 4 + 1 + i; if (n <= TOTAL_GAMES) { const g = C.gameSet(n, S.mode); out.push(g); } } return out; }

  /* ---------- sets ---------- */
  function newSet(title, ids, extras) {
    const ex = extras ? C.pickExtras(title + Date.now()) : { rebus: [], songs: [] };
    const tbId = extras ? (function () { const pool = C.searchBank({ diffs: new Set([2, 3]) }).filter(q => /^\d+$/.test(q.a.replace(/,/g, '')) && /^how (many|long|much|tall|old)/i.test(q.q)); return pool.length ? pool[Math.floor(Math.random() * pool.length)].id : null; })() : null;
    const s = { id: 's' + Date.now() + Math.floor(Math.random() * 99), kind: 'custom', title, ids, tb: tbId, rebus: ex.rebus, songs: ex.songs, mode: S.mode, date: '', venue: '' };
    sets.push(s); saveSets(); return s;
  }
  const curSet = () => S.set && S.set.kind === 'custom' ? S.set : null;
  const persistCur = () => { if (curSet()) { const i = sets.findIndex(s => s.id === S.set.id); if (i >= 0) sets[i] = S.set; saveSets(); } };
  function targetSet() {
    const b = S.bank;
    let s = sets.find(x => x.id === b.target);
    if (!s) { s = newSet('My Set ' + (sets.length + 1), [], true); b.target = s.id; }
    return s;
  }

  /* ---------- present (host screen) ---------- */
  let pres = null, ptimer = null;
  function slidesFor(set) {
    const out = [{ t: 'title' }]; let n = 0; const tot = set.ids.length;
    C.roundsOf(set).forEach((r, ri) => { out.push({ t: 'round', ri }); r.forEach(id => { n++; out.push({ t: 'q', id, n, tot, ri }); }); });
    (set.rebus || []).length && out.push({ t: 'text', head: 'Picture puzzles', sub: 'Decode each set of pictures', big: '🧩' });
    (set.rebus || []).forEach((i, k) => out.push({ t: 'rebus', i, k }));
    if ((set.songs || []).length) { out.push({ t: 'text', head: 'Music round', sub: 'Name the artist for each song', big: '🎵' }); set.songs.forEach((i, k) => out.push({ t: 'song', i, k })); }
    if (set.tb) out.push({ t: 'tb', id: set.tb });
    out.push({ t: 'text', head: 'Thanks for playing!', sub: 'Tip your server and come back next week', big: '🌙' });
    return out;
  }
  function startPresent(set) { pres = { set, slides: slidesFor(set), i: 0, reveal: false }; $('#present').hidden = false; document.body.style.overflow = 'hidden'; drawPresent(); }
  function stopTimer() { clearInterval(ptimer); ptimer = null; }
  function endPresent() { stopTimer(); pres = null; $('#present').hidden = true; document.body.style.overflow = ''; }
  function drawPresent() {
    if (!pres) return;
    const sl = pres.slides[pres.i], set = pres.set, el = $('#present');
    let top = '', body = '';
    const long = t => t.length > 90 ? ' long' : '';
    if (sl.t === 'title') { top = 'Clark After Dark Trivia'; body = `<div class="p-emoji">🌙</div><div class="p-q">${esc(set.title)}</div><div class="muted">${esc(set.venue || '')} ${esc(set.date || '')}</div><div class="muted">${esc(setSummary(set))}</div>`; }
    else if (sl.t === 'round') { top = 'Get ready'; body = `<div class="p-emoji">🎯</div><div class="p-q">Round ${sl.ri + 1}</div>`; }
    else if (sl.t === 'q') {
      const q = C.Qs.get(sl.id); top = `Round ${sl.ri + 1} · Question ${sl.n} of ${sl.tot} · ${esc(C.GENRES[q.g])}`;
      body = `<div class="p-q${long(q.q)}">${esc(q.q)}</div>`;
      if (S.mode === 'mc' && C.hasMC(q)) { const m = C.mcOptions(q); body += `<div class="p-opts">${m.opts.map((o, i) => `<div class="p-opt ${pres.reveal && o === q.a ? 'right' : ''}"><b>${'ABCD'[i]}</b> ${esc(o)}</div>`).join('')}</div>`; }
      body += `<div class="p-ans">${pres.reveal ? esc(q.a) : ''}</div>`;
    } else if (sl.t === 'rebus') { const p = C.REBUS[sl.i]; top = `Picture puzzle ${sl.k + 1} · ${esc(p[2])}`; body = `<div class="p-emoji">${esc(p[0])}</div><div class="p-ans">${pres.reveal ? esc(p[1]) : ''}</div>`; }
    else if (sl.t === 'song') { const s = C.SONGS[sl.i]; top = `Music round · Song ${sl.k + 1} of ${set.songs.length} · ${esc(s[2])}`; body = `<div class="p-emoji">🎵</div><div class="p-q">"${esc(s[0])}"</div><div class="muted">Play the clip, then teams name the artist</div><div class="p-ans">${pres.reveal ? esc(s[1]) : ''}</div><div><a class="btn" href="${esc(C.ytLink(s))}" target="_blank" rel="noopener">Find the song on YouTube</a></div>`; }
    else if (sl.t === 'tb') { const q = C.Qs.get(sl.id); top = 'Tiebreaker · closest guess wins'; body = `<div class="p-q${long(q.q)}">${esc(q.q)}</div><div class="p-ans">${pres.reveal ? esc(q.a) : ''}</div>`; }
    else { top = ''; body = `<div class="p-emoji">${sl.big}</div><div class="p-q">${esc(sl.head)}</div><div class="muted">${esc(sl.sub)}</div>`; }
    el.innerHTML = `<div class="p-top"><span>${top}</span><button class="btn sm" data-p="exit">Exit (Esc)</button></div><div class="p-body">${body}</div>
      <div class="p-bot"><div class="btns"><button class="btn" data-p="prev">&larr; Back</button><button class="btn" data-p="reveal">${pres.reveal ? 'Hide answer' : 'Reveal answer (A)'}</button><button class="btn primary" data-p="next">Next &rarr;</button></div>
      <div class="btns"><button class="btn" data-p="timer">Timer 30s (T)</button><span class="timer" id="ptime"></span></div><span class="muted small">${pres.i + 1} / ${pres.slides.length}</span></div>`;
  }
  function presNav(d) { if (!pres) return; stopTimer(); pres.i = Math.max(0, Math.min(pres.slides.length - 1, pres.i + d)); pres.reveal = false; drawPresent(); }
  function presTimer() {
    stopTimer(); let n = 30; const upd = () => { const t = $('#ptime'); if (t) { t.textContent = n; t.classList.toggle('low', n <= 5); } };
    upd(); ptimer = setInterval(() => { n--; upd(); if (n <= 0) { stopTimer(); const t = $('#ptime'); if (t) t.textContent = 'Time!'; } }, 1000);
  }
  $('#present').addEventListener('click', e => {
    const a = e.target.closest('[data-p]'); if (!a) return;
    const k = a.dataset.p;
    if (k === 'exit') endPresent(); else if (k === 'next') presNav(1); else if (k === 'prev') presNav(-1);
    else if (k === 'reveal') { pres.reveal = !pres.reveal; drawPresent(); } else if (k === 'timer') presTimer();
  });
  document.addEventListener('keydown', e => {
    if (!pres) return;
    if (e.key === 'Escape') endPresent();
    else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); presNav(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') presNav(-1);
    else if (e.key === 'a' || e.key === 'A') { pres.reveal = !pres.reveal; drawPresent(); }
    else if (e.key === 't' || e.key === 'T') presTimer();
  });

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]'); if (tab) { go(tab.dataset.tab); return; }
    const el = e.target.closest('[data-act]'); if (!el) return;
    const d = el.dataset, act = d.act, set = S.set;
    guard(() => {
      switch (act) {
        case 'open-game': openGame(d.n); break;
        case 'back': go(set && set.kind === 'custom' ? 'sets' : 'games'); break;
        case 'month-prev': S.month = Math.max(1, S.month - 1); render(); break;
        case 'month-next': S.month = Math.min(TOTAL_MONTHS, S.month + 1); render(); break;
        case 'jump': { const v = $('[data-bind=jump]').value; if (v) openGame(v); break; }
        case 'random-game': openGame(1 + Math.floor(Math.random() * TOTAL_GAMES)); break;
        case 'pdf-game': pdfFor(C.gameSet(+d.n, S.mode), d.k); break;
        case 'csv-game': csvFor(C.gameSet(+d.n, S.mode)); break;
        case 'pdf-month': { const ms = monthSets(+d.m); ms.forEach(s => s.mode = S.mode); P.savePdf(ms, ['host', 'questions', 'sheet'], 'clark-after-dark-month-' + d.m + '-packet'); toast('Month ' + d.m + ' packet ready'); break; }
        case 'csv-month': { const ms = monthSets(+d.m); let rows = null; ms.forEach(s => { const r = C.setRows(s); rows = rows ? rows.concat(r.slice(1)) : r; }); C.download('clark-after-dark-month-' + d.m + '.csv', C.toCSV(rows), 'text/csv;charset=utf-8'); toast('Month CSV downloaded'); break; }
        case 'gsearch': runGSearch(); break;
        case 'mode': S.mode = d.v; C.store.set('mode', S.mode); if (set) set.mode = S.mode; render(); break;
        case 'pdf': pdfFor(set, d.k); break;
        case 'csv': csvFor(set); break;
        case 'tsv': copyText(C.toTSV(C.setRows(set)), 'Copied. Open a blank Google Sheet, click cell A1 and paste.'); break;
        case 'present': set.mode = S.mode; startPresent(set); break;
        case 'customize': { const s = newSet('Custom: ' + set.title, set.ids.slice(), false); s.tb = set.tb; s.rebus = set.rebus.slice(); s.songs = set.songs.slice(); saveSets(); S.set = s; render(); toast('Saved a copy in My Sets. Edit away.'); break; }
        case 'reroll': { const ex = C.pickExtras('r' + Date.now()); set.rebus = ex.rebus; set.songs = ex.songs; persistCur(); render(); break; }
        case 'up': case 'down': { const i = +d.i, j = act === 'up' ? i - 1 : i + 1; if (j >= 0 && j < set.ids.length) { [set.ids[i], set.ids[j]] = [set.ids[j], set.ids[i]]; persistCur(); render(); } break; }
        case 'rm': set.ids.splice(+d.i, 1); persistCur(); render(); break;
        case 'bgenre': S.bank.genres.has(d.g) ? S.bank.genres.delete(d.g) : S.bank.genres.add(d.g); S.bank.page = 0; S.bank.topic = ''; render(); break;
        case 'bclear': S.bank.genres.clear(); S.bank.topic = ''; S.bank.text = ''; S.bank.page = 0; render(); break;
        case 'bpage': S.bank.page = Math.max(0, S.bank.page + (+d.d)); render(); window.scrollTo(0, 0); break;
        case 'add-q': { const s = targetSet(); if (s.ids.indexOf(+d.id) >= 0 || s.ids.indexOf(d.id) >= 0) { toast('Already in "' + s.title + '"'); break; } s.ids.push(isNaN(+d.id) ? d.id : +d.id); saveSets(); toast('Added to "' + s.title + '" (' + s.ids.length + ' questions)'); render(); break; }
        case 'add-page': case 'add-all': { const s = targetSet(); const src = act === 'add-all' ? S._list : S._list.slice(S.bank.page * PAGE, S.bank.page * PAGE + PAGE); let n = 0; src.forEach(q => { if (s.ids.indexOf(q.id) < 0) { s.ids.push(q.id); n++; } }); saveSets(); toast('Added ' + n + ' to "' + s.title + '"'); render(); break; }
        case 'bank-csv': C.download('clark-after-dark-bank-selection.csv', C.toCSV(C.bankRows(S._list)), 'text/csv;charset=utf-8'); toast('CSV downloaded (' + S._list.length + ' questions)'); break;
        case 'bank-tsv': copyText(C.toTSV(C.bankRows(S._list)), 'Copied ' + S._list.length + ' questions. Paste into Google Sheets.'); break;
        case 'bank-pdf': P.bankPdf(S._list, 'Selection').save('clark-after-dark-bank-selection.pdf'); toast('PDF ready'); break;
        case 'sgenre': S.build.genres.has(d.g) ? S.build.genres.delete(d.g) : S.build.genres.add(d.g); render(); break;
        case 'build-set': {
          const b = S.build; const ids = C.buildRandom({ count: Math.max(5, Math.min(100, +b.count || 35)), mix: b.mix, filter: { genres: b.genres, diffs: new Set([1, 2, 3]), scope: 'all' }, seed: String(Date.now()) });
          const s = newSet(b.title.trim() || 'My Set ' + (sets.length + 1), ids, b.extras); S.set = s; render(); toast('Built a ' + ids.length + '-question set'); break; }
        case 'empty-set': { const s = newSet(S.build.title.trim() || 'My Set ' + (sets.length + 1), [], true); S.set = s; render(); break; }
        case 'open-set': S.set = sets.find(s => s.id === d.id); if (S.set) { S.set.mode = S.mode; render(); window.scrollTo(0, 0); } break;
        case 'dup-set': { const s = sets.find(x => x.id === d.id); if (s) { const c = JSON.parse(JSON.stringify(s)); c.id = 's' + Date.now(); c.title = s.title + ' (copy)'; sets.push(c); saveSets(); render(); } break; }
        case 'del-set': if (confirm('Delete this set? This cannot be undone.')) { sets = sets.filter(s => s.id !== d.id); saveSets(); render(); } break;
        case 'add-custom': addCustomFromForm(); break;
        case 'del-custom': if (confirm('Delete this question? It is also removed from your sets.')) { C.removeCustom(d.id); sets.forEach(s => { s.ids = s.ids.filter(x => x !== d.id); }); saveSets(); render(); } break;
        case 'export-data': C.download('clark-after-dark-my-data.json', JSON.stringify({ app: 'clark-after-dark', v: 1, sets, custom: C.custom }, null, 1), 'application/json'); toast('Exported'); break;
      }
    });
  });
  function addCustomFromForm() {
    const v = id => $('#' + id).value, q = v('cq-q').trim(), a = v('cq-a').trim();
    if (!q || !a) { toast('Enter a question and its correct answer.'); return; }
    const w = [v('cq-w1'), v('cq-w2'), v('cq-w3')].map(x => x.trim()).filter(Boolean);
    if (w.some(x => x.toLowerCase() === a.toLowerCase())) { toast('A wrong answer matches the correct answer.'); return; }
    C.addCustom({ q, a, w, g: v('cq-g'), t: v('cq-t').trim(), d: +v('cq-d') }); toast('Saved to your personal bank'); render();
  }
  function runGSearch() {
    const t = S.gsearch.trim(); if (!t) { S.gsearchRes = null; render(); return; }
    const hits = C.searchBank({ text: t, scope: 'all' }).filter(q => !q.mine);
    const cnt = new Map(); hits.forEach(q => (C.gameIndex.get(q.id) || []).forEach(n => cnt.set(n, (cnt.get(n) || 0) + 1)));
    const list = Array.from(cnt, ([n, c]) => ({ n, c })).sort((a, b) => b.c - a.c || a.n - b.n).slice(0, 60);
    S.gsearchRes = { total: hits.length, list }; render();
  }

  document.addEventListener('input', e => {
    const b = e.target.dataset && e.target.dataset.bind; if (!b) return;
    const v = e.target.value;
    if (b === 'gsearch') S.gsearch = v;
    else if (b === 'btext') { S.bank.text = v; S.bank.page = 0; clearTimeout(S._bt); S._bt = setTimeout(() => { const pos = e.target.selectionStart; render(); const n = $('[data-bind=btext]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }, 220); }
    else if (b === 'settitle' && S.set) { S.set.title = v; persistCur(); }
    else if (b === 'setdate' && S.set) { S.set.date = v ? new Date(v + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''; persistCur(); }
    else if (b === 'setvenue' && S.set) { S.set.venue = v; persistCur(); }
    else if (b === 'btitle') S.build.title = v;
    else if (b === 'bcount') S.build.count = v;
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return; const b = e.target.dataset && e.target.dataset.bind;
    if (b === 'gsearch') runGSearch(); else if (b === 'jump' && e.target.value) openGame(e.target.value);
  });
  document.addEventListener('change', e => {
    const b = e.target.dataset && e.target.dataset.bind; if (!b) return;
    const v = e.target.value;
    guard(() => {
      if (b === 'month') { S.month = Math.max(1, Math.min(TOTAL_MONTHS, parseInt(v, 10) || 1)); render(); }
      else if (b === 'showans') { S.showAns = e.target.checked; render(); }
      else if (b === 'btopic') { S.bank.topic = v; S.bank.page = 0; render(); }
      else if (b === 'bscope') { S.bank.scope = v; S.bank.page = 0; render(); }
      else if (b === 'bdiff') { const d = +e.target.dataset.d; e.target.checked ? S.bank.diffs.add(d) : S.bank.diffs.delete(d); if (!S.bank.diffs.size) S.bank.diffs.add(d); S.bank.page = 0; render(); }
      else if (b === 'bmc') { S.bank.mc = e.target.checked; S.bank.page = 0; render(); }
      else if (b === 'bshow') { S.bank.showAns = e.target.checked; render(); }
      else if (b === 'btarget') S.bank.target = v;
      else if (b === 'bmix') S.build.mix = v;
      else if (b === 'bextras') S.build.extras = e.target.checked;
      else if (b === 'import') importData(e.target.files[0]);
    });
  });
  function importData(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => guard(() => {
      const d = JSON.parse(r.result);
      if (d.app !== 'clark-after-dark') throw new Error('That file is not a Clark After Dark export.');
      let nq = 0, ns = 0; const map = {};
      (d.custom || []).forEach(q => { const rec = C.addCustom(q); map[q.id] = rec.id; nq++; });
      (d.sets || []).forEach(s => { s.id = 's' + Date.now() + Math.floor(Math.random() * 999); s.ids = s.ids.map(i => map[i] || i); sets.push(s); ns++; });
      saveSets(); render(); toast('Imported ' + ns + ' sets and ' + nq + ' questions');
    });
    r.readAsText(file);
  }

  /* ---------- boot ---------- */
  const m = /#game=(\d+)/.exec(location.hash);
  if (m) openGame(m[1]); else render();
  window.addEventListener('hashchange', () => { const x = /#game=(\d+)/.exec(location.hash); if (x) openGame(x[1]); });
  if (!window.jspdf) setTimeout(() => { if (!window.jspdf) toast('PDF downloads need an internet connection to load their library. CSV works offline.'); }, 4000);
})();
