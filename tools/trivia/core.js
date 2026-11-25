/* Clark After Dark Trivia: shared data model, helpers and exports (no UI here). */
(function () {
  'use strict';
  const META = window.CAD_META, BANK = window.CAD_BANK, GAMES = window.CAD_GAMES;
  const REBUS = window.CAD_REBUS, SONGS = window.CAD_SONGS;
  const GENRES = META.genres;
  const GCODES = Object.keys(GENRES);
  const DIFF = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

  /* ---------- questions ---------- */
  const Qs = new Map();
  BANK.forEach(r => Qs.set(r[0], { id: r[0], g: r[1], t: META.topics[r[2]], d: r[3], q: r[4], a: r[5], w: r[6] }));

  /* ---------- storage (every access is guarded: private windows can throw) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cad.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cad.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };
  let custom = store.get('custom', []);
  custom.forEach(c => Qs.set(c.id, c));

  function saveCustom() { return store.set('custom', custom); }
  function addCustom(q) {
    const n = custom.reduce((m, c) => Math.max(m, parseInt(String(c.id).slice(1), 10) || 0), 0) + 1;
    const rec = { id: 'c' + n, g: q.g, t: q.t || 'My Questions', d: q.d, q: q.q.trim(), a: q.a.trim(), w: (q.w || []).map(x => x.trim()).filter(Boolean), mine: true };
    custom.push(rec); Qs.set(rec.id, rec); saveCustom(); return rec;
  }
  function removeCustom(id) {
    custom = custom.filter(c => c.id !== id); Qs.delete(id); saveCustom();
  }

  /* ---------- games ---------- */
  const pad = n => String(n).padStart(4, '0');
  function gameSet(n, mode) {
    const g = GAMES[n - 1];
    return { kind: 'game', no: n, title: 'Game #' + pad(n), month: Math.ceil(n / 4), week: ((n - 1) % 4) + 1,
      ids: g[1].slice(), tb: g[2], rebus: g[3].slice(), songs: g[4].slice(), mode: mode || 'free', date: '' };
  }
  const gameIndex = (function () {          // question id -> games containing it
    const m = new Map();
    GAMES.forEach(g => g[1].concat([g[2]]).forEach(id => { if (!m.has(id)) m.set(id, []); m.get(id).push(g[0]); }));
    return m;
  })();

  /* ---------- shared set helpers ---------- */
  function roundsOf(set) {
    const n = set.ids.length;
    if (!n) return [];
    const per = Math.max(1, Math.ceil(n / 5));
    const out = [];
    for (let i = 0; i < n; i += per) out.push(set.ids.slice(i, i + per));
    return out;
  }
  function h32(s) { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
  function rng(seed) { let a = h32(seed); return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffled(arr, seed) { const r = rng(seed), a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function mcOptions(q) {
    const opts = shuffled([q.a].concat(q.w), 'mc' + q.id);
    return { opts, letter: 'ABCD'[opts.indexOf(q.a)] || '?' };
  }
  function hasMC(q) { return q.w && q.w.length >= 2; }
  function ytLink(song) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(song[0] + ' ' + song[1] + ' official'); }

  /* ---------- tables for CSV / Google Sheets ---------- */
  function setRows(set) {
    const rows = [['Game', 'Round', 'No', 'Genre', 'Topic', 'Difficulty', 'Question', 'Correct answer', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct letter']];
    let no = 0;
    roundsOf(set).forEach((r, ri) => r.forEach(id => {
      const q = Qs.get(id); if (!q) return; no++;
      let o = ['', '', '', ''], L = '';
      if (hasMC(q)) { const m = mcOptions(q); o = m.opts.concat(['', '', '']).slice(0, 4); L = m.letter; }
      rows.push([set.title, 'Round ' + (ri + 1), no, GENRES[q.g] || q.g, q.t, DIFF[q.d], q.q, q.a].concat(o, [L]));
    }));
    (set.rebus || []).forEach((i, k) => { const p = REBUS[i]; if (p) rows.push([set.title, 'Picture puzzles', 'P' + (k + 1), p[2], 'Picture puzzle', '', 'Decode the emoji: ' + p[0], p[1], '', '', '', '', '']); });
    (set.songs || []).forEach((i, k) => { const s = SONGS[i]; if (s) rows.push([set.title, 'Music round', 'M' + (k + 1), s[2], 'Name the artist', '', 'Name the artist who recorded "' + s[0] + '"', s[1], '', '', '', '', '']); });
    if (set.tb && Qs.get(set.tb)) { const q = Qs.get(set.tb); rows.push([set.title, 'Tiebreaker', 'TB', GENRES[q.g] || q.g, q.t, DIFF[q.d], q.q + ' (closest wins)', q.a, '', '', '', '', '']); }
    return rows;
  }
  function bankRows(list) {
    const rows = [['ID', 'Genre', 'Topic', 'Difficulty', 'Question', 'Correct answer', 'Wrong 1', 'Wrong 2', 'Wrong 3']];
    list.forEach(q => rows.push([q.id, GENRES[q.g] || q.g, q.t, DIFF[q.d], q.q, q.a].concat(q.w.concat(['', '', '']).slice(0, 3))));
    return rows;
  }
  const esc = v => { v = String(v == null ? '' : v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const toCSV = rows => '﻿' + rows.map(r => r.map(esc).join(',')).join('\r\n');
  const toTSV = rows => rows.map(r => r.map(v => String(v == null ? '' : v).replace(/[\t\r\n]+/g, ' ')).join('\t')).join('\n');

  function download(name, data, type) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: type || 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }

  /* ---------- search ---------- */
  function searchBank(f) {
    const text = (f.text || '').toLowerCase().trim();
    const words = text.split(/\s+/).filter(Boolean);
    const out = [];
    Qs.forEach(q => {
      if (f.scope === 'mine' && !q.mine) return;
      if (f.genres && f.genres.size && !f.genres.has(q.g)) return;
      if (f.topic && q.t !== f.topic) return;
      if (f.diffs && !f.diffs.has(q.d)) return;
      if (f.mc && !hasMC(q)) return;
      if (words.length) { const hay = (q.q + ' ' + q.a + ' ' + q.t + ' ' + (GENRES[q.g] || '')).toLowerCase(); for (const w of words) if (hay.indexOf(w) < 0) return; }
      out.push(q);
    });
    return out;
  }

  /* ---------- random set builder ---------- */
  function buildRandom(opts) {
    const pool = searchBank(opts.filter);
    const n = Math.min(opts.count, pool.length);
    const seed = opts.seed || String(Date.now());
    const r = rng(seed);
    const by = {};
    pool.forEach(q => (by[q.g] = by[q.g] || []).push(q));
    const gl = Object.keys(by);
    gl.forEach(g => { by[g] = shuffled(by[g], seed + g); });
    const mix = { easy: [.45, .40, .15], balanced: [.20, .55, .25], hard: [.05, .40, .55], any: null }[opts.mix || 'balanced'];
    const picked = []; const taken = new Set();
    const want = [];
    // per-genre targets, evenly spread
    for (let i = 0; i < n; i++) want.push(gl[i % gl.length]);
    const order = shuffled(want, seed + 'o');
    const diffPlan = [];
    for (let i = 0; i < n; i++) { const x = r(); diffPlan.push(!mix ? 0 : (x < mix[0] ? 1 : (x < mix[0] + mix[1] ? 2 : 3))); }
    order.forEach((g, i) => {
      const list = by[g]; let best = null;
      for (const q of list) { if (taken.has(q.id)) continue; if (!diffPlan[i] || q.d === diffPlan[i]) { best = q; break; } if (!best) best = q; }
      if (!best) { for (const k of gl) for (const q of by[k]) { if (!taken.has(q.id)) { best = q; break; } if (best) break; } }
      if (best) { taken.add(best.id); picked.push(best); }
    });
    picked.sort((a, b) => a.d - b.d);   // easy -> hard so the night builds
    return picked.map(q => q.id);
  }
  function pickExtras(seed) {
    const r = rng(seed || String(Date.now()));
    const rb = []; while (rb.length < 2) { const i = Math.floor(r() * REBUS.length); if (rb.indexOf(i) < 0) rb.push(i); }
    const decs = ['Oldies', '1980s', '1990s', '2000s', '2010s+'], ms = [];
    decs.forEach(d => { const c = []; SONGS.forEach((s, i) => { if (s[2] === d) c.push(i); }); ms.push(c[Math.floor(r() * c.length)]); });
    return { rebus: rb, songs: ms };
  }

  window.CAD = { META, GENRES, GCODES, DIFF, Qs, store, GAMES, REBUS, SONGS, pad, gameSet, gameIndex, roundsOf, shuffled, rng, mcOptions, hasMC,
    ytLink, setRows, bankRows, toCSV, toTSV, download, searchBank, buildRandom, pickExtras, addCustom, removeCustom,
    get custom() { return custom; } };
})();
