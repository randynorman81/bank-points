/* Clark After Dark Trivia: PDF builders (jsPDF). Produces the team answer sheet (rules header +
   host bonus-points boxes), host answer key, question reader and host tally sheet. */
(function () {
  'use strict';
  const C = window.CAD;
  const PW = 612, PH = 792, M = 42, RW = PW - M * 2;
  const AMBER = [232, 148, 18], NAVY = [18, 22, 34], INK = [25, 28, 38], GREY = [110, 116, 130], LINE = [150, 156, 170], SOFT = [244, 246, 250];

  /* jsPDF's built-in fonts only know Latin-1: fold everything else down safely */
  function T(s) {
    return String(s == null ? '' : s)
      .replace(/[‘’ʼʻʽ]/g, "'").replace(/[“”]/g, '"').replace(/[–—−]/g, '-')
      .replace(/…/g, '...').replace(/×/g, 'x').replace(/²/g, '2').replace(/ /g, ' ')
      .replace(/[←-⇿]/g, '->').replace(/✓|✔/g, '*')
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, '');
  }

  function emojiImg(str) {
    try {
      const px = 120, c = document.createElement('canvas'), x = c.getContext('2d');
      x.font = px + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      const w = Math.ceil(x.measureText(str).width) + 12;
      c.width = w; c.height = Math.ceil(px * 1.35);
      x.font = px + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      x.textBaseline = 'middle'; x.fillText(str, 6, c.height / 2 + 4);
      return { url: c.toDataURL('image/png'), w: c.width, h: c.height };
    } catch (e) { return null; }
  }

  function pdfLib() {
    if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('The PDF library did not load. Check your internet connection and refresh the page.');
    return window.jspdf.jsPDF;
  }

  class Ctx {
    constructor(doc) { this.doc = doc; this.y = 0; this.page = 0; this.label = ''; this.title = ''; }
    newPage(first) {
      if (!first) this.doc.addPage();
      this.page++; this.y = this.band(); return this.y;
    }
    band() {
      const d = this.doc;
      d.setFillColor(...NAVY); d.rect(0, 0, PW, 52, 'F');
      d.setFillColor(...AMBER); d.rect(0, 52, PW, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(17); d.text('CLARK AFTER DARK TRIVIA', M, 26);
      d.setFontSize(8.5); d.setTextColor(205, 212, 226); d.setFont('helvetica', 'normal'); d.text(T(this.label), M, 41);
      d.setFont('helvetica', 'bold'); d.setFontSize(12); d.setTextColor(...AMBER); d.text(T(this.title), PW - M, 31, { align: 'right' });
      d.setTextColor(...INK);
      return 72;
    }
    need(h) { if (this.y + h > PH - 44) this.newPage(false); }
    footer() {
      const d = this.doc, n = d.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        d.setPage(i); d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(...GREY);
        d.text('Clark After Dark Trivia  |  Page ' + i + ' of ' + n, PW / 2, PH - 22, { align: 'center' });
      }
    }
  }

  function startDoc() { const J = pdfLib(); return new J({ unit: 'pt', format: 'letter', compress: true }); }
  function setTitleLabel(cx, set, what) {
    cx.title = what;
    cx.label = T(set.title + (set.date ? '   |   ' + set.date : '') + (set.venue ? '   |   ' + set.venue : ''));
  }
  const fmtDate = d => d || '';

  /* ---------- rules text (original wording) ---------- */
  const RULES = [
    'One answer sheet per team. Write clearly; the host\'s reading of your handwriting is final.',
    'No phones, tablets or smartwatches. Looking up an answer disqualifies that question.',
    'No shouting answers or sharing with other tables. Whisper-level table talk only.',
    'Each correct answer scores 1 point unless the host says a question is worth more.',
    'Spelling only counts when the host says so. A close phonetic answer is usually fine.',
    'The host may award BONUS POINTS during the night. Write them in the Host Bonus box.',
    'Ties are broken by the closest guess to the tiebreaker answer. The host\'s ruling is final.',
    'Be kind, have fun, tip your server and keep the table talk friendly.'
  ];

  /* ---------- TEAM ANSWER SHEET ---------- */
  function answerSheet(cx, set) {
    const d = cx.doc;
    setTitleLabel(cx, set, 'TEAM ANSWER SHEET');
    cx.newPage(!d._started); d._started = true;
    let y = cx.y;
    // team info + host bonus
    d.setTextColor(...INK); d.setFont('helvetica', 'bold'); d.setFontSize(9);
    d.text('TEAM NAME', M, y + 10); d.setDrawColor(...LINE); d.setLineWidth(0.8); d.line(M + 62, y + 12, 330, y + 12);
    d.text('TABLE', 342, y + 10); d.line(374, y + 12, 420, y + 12);
    d.setFillColor(255, 247, 224); d.setDrawColor(...AMBER); d.setLineWidth(1.4);
    d.roundedRect(436, y - 6, PW - M - 436, 50, 5, 5, 'FD');
    d.setFont('helvetica', 'bold'); d.setFontSize(7.5); d.setTextColor(150, 90, 0); d.text('HOST BONUS POINTS', 436 + (PW - M - 436) / 2, y + 4, { align: 'center' });
    d.setFontSize(7); d.setFont('helvetica', 'normal'); d.text('host writes here', 436 + (PW - M - 436) / 2, y + 40, { align: 'center' });
    d.setTextColor(...INK);
    d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('PLAYERS', M, y + 32); d.setDrawColor(...LINE); d.setLineWidth(0.8); d.line(M + 46, y + 34, 420, y + 34);
    y += 56;
    // rules header
    d.setFillColor(...SOFT); d.setDrawColor(...LINE); d.setLineWidth(0.6);
    const colW = (RW - 24) / 2; d.setFont('helvetica', 'normal'); d.setFontSize(7.6);
    const lines = RULES.map((r, i) => d.splitTextToSize((i + 1) + '.  ' + T(r), colW));
    const left = lines.slice(0, 4), right = lines.slice(4);
    const hL = left.reduce((s, l) => s + l.length * 9.2 + 2, 0), hR = right.reduce((s, l) => s + l.length * 9.2 + 2, 0);
    const bh = Math.max(hL, hR) + 24;
    d.roundedRect(M, y, RW, bh, 4, 4, 'FD');
    d.setFont('helvetica', 'bold'); d.setFontSize(8.5); d.setTextColor(...AMBER); d.text('HOUSE RULES', M + 10, y + 13);
    d.setTextColor(...INK); d.setFont('helvetica', 'normal'); d.setFontSize(7.6);
    let yl = y + 24, yr = y + 24;
    left.forEach(l => { d.text(l, M + 10, yl); yl += l.length * 9.2 + 2; });
    right.forEach(l => { d.text(l, M + 14 + colW, yr); yr += l.length * 9.2 + 2; });
    y += bh + 12; cx.y = y;

    const mc = set.mode === 'mc';
    const rounds = C.roundsOf(set);
    let qn = 0;
    rounds.forEach((r, ri) => {
      const rowH = mc ? 18 : 19;
      cx.need(24 + r.length * rowH + 8);
      let yy = cx.y;
      d.setFillColor(...NAVY); d.roundedRect(M, yy, RW, 16, 3, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9);
      d.text('ROUND ' + (ri + 1) + '   Questions ' + (qn + 1) + '-' + (qn + r.length), M + 8, yy + 11.2);
      d.setTextColor(235, 238, 246); d.setFont('helvetica', 'normal'); d.setFontSize(8);
      d.text('Round bonus ____   Round score ____', PW - M - 8, yy + 11.2, { align: 'right' });
      yy += 22;
      d.setTextColor(...INK);
      r.forEach(id => {
        qn++;
        d.setFont('helvetica', 'bold'); d.setFontSize(9.5); d.text(String(qn) + '.', M + 2, yy + 11);
        if (mc) {
          ['A', 'B', 'C', 'D'].forEach((L, i) => {
            const cxp = M + 60 + i * 74;
            d.setDrawColor(...LINE); d.setLineWidth(0.9); d.circle(cxp, yy + 7.5, 7, 'S');
            d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(...GREY); d.text(L, cxp, yy + 10.3, { align: 'center' }); d.setTextColor(...INK);
          });
        } else {
          d.setDrawColor(...LINE); d.setLineWidth(0.7); d.line(M + 24, yy + 13, PW - M, yy + 13);
        }
        yy += rowH;
      });
      cx.y = yy + 8;
    });

    // picture puzzles
    if (set.rebus && set.rebus.length) {
      cx.need(24 + set.rebus.length * 46);
      let yy = cx.y;
      d.setFillColor(...NAVY); d.roundedRect(M, yy, RW, 16, 3, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('PICTURE PUZZLES   Decode the pictures', M + 8, yy + 11.2);
      d.setTextColor(235, 238, 246); d.setFont('helvetica', 'normal'); d.setFontSize(8); d.text('Round bonus ____   Round score ____', PW - M - 8, yy + 11.2, { align: 'right' });
      yy += 22; d.setTextColor(...INK);
      set.rebus.forEach((i, k) => {
        const p = C.REBUS[i]; if (!p) return;
        d.setFont('helvetica', 'bold'); d.setFontSize(9.5); d.text('P' + (k + 1) + '.', M + 2, yy + 24);
        d.setDrawColor(...LINE); d.setFillColor(255, 255, 255); d.setLineWidth(0.8); d.roundedRect(M + 26, yy, 170, 38, 4, 4, 'S');
        const im = emojiImg(p[0]);
        if (im) { const s = Math.min(160 / im.w, 32 / im.h); const w = im.w * s, h = im.h * s; d.addImage(im.url, 'PNG', M + 26 + (170 - w) / 2, yy + (38 - h) / 2, w, h); }
        d.setFont('helvetica', 'italic'); d.setFontSize(8); d.setTextColor(...GREY); d.text('Category: ' + T(p[2]), M + 206, yy + 12); d.setTextColor(...INK);
        d.setDrawColor(...LINE); d.setLineWidth(0.7); d.line(M + 206, yy + 32, PW - M, yy + 32);
        yy += 46;
      });
      cx.y = yy + 4;
    }
    // music round
    if (set.songs && set.songs.length) {
      cx.need(24 + set.songs.length * 19 + 10);
      let yy = cx.y;
      d.setFillColor(...NAVY); d.roundedRect(M, yy, RW, 16, 3, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('MUSIC ROUND   Name the artist who recorded each song', M + 8, yy + 11.2);
      d.setTextColor(235, 238, 246); d.setFont('helvetica', 'normal'); d.setFontSize(8); d.text('Round bonus ____   Round score ____', PW - M - 8, yy + 11.2, { align: 'right' });
      yy += 22; d.setTextColor(...INK);
      set.songs.forEach((i, k) => {
        d.setFont('helvetica', 'bold'); d.setFontSize(9.5); d.text('M' + (k + 1) + '.', M + 2, yy + 11);
        d.setFont('helvetica', 'normal'); d.setFontSize(8); d.setTextColor(...GREY); d.text('Song ' + (k + 1), M + 26, yy + 11); d.setTextColor(...INK);
        d.setDrawColor(...LINE); d.setLineWidth(0.7); d.line(M + 66, yy + 13, PW - M, yy + 13);
        yy += 19;
      });
      cx.y = yy + 6;
    }
    // tiebreaker
    const tb = set.tb && C.Qs.get(set.tb);
    if (tb) {
      cx.need(40);
      let yy = cx.y;
      d.setFont('helvetica', 'bold'); d.setFontSize(9); d.setTextColor(...AMBER); d.text('TIEBREAKER', M, yy + 9); d.setTextColor(...INK);
      d.setFont('helvetica', 'normal'); d.setFontSize(8.5); d.text('Your closest guess wins ties (the host will read the question).', M + 64, yy + 9);
      d.setDrawColor(...LINE); d.setLineWidth(0.7); d.line(M, yy + 26, PW - M - 120, yy + 26);
      cx.y = yy + 34;
    }
    // totals
    cx.need(62);
    let yy = cx.y;
    const labels = rounds.map((_, i) => 'R' + (i + 1));
    if (set.rebus && set.rebus.length) labels.push('Puzzles');
    if (set.songs && set.songs.length) labels.push('Music');
    labels.push('Subtotal', '+ HOST BONUS', 'TOTAL');
    const cw = RW / labels.length;
    d.setLineWidth(0.9);
    labels.forEach((l, i) => {
      const x = M + i * cw, hi = i >= labels.length - 2;
      d.setFillColor(hi ? 255 : 240, hi ? 247 : 242, hi ? 224 : 246); d.setDrawColor(hi ? AMBER[0] : 170, hi ? AMBER[1] : 176, hi ? AMBER[2] : 190);
      d.rect(x, yy, cw, 14, 'FD'); d.rect(x, yy + 14, cw, 32, 'S');
      d.setFont('helvetica', 'bold'); d.setFontSize(7.2); d.setTextColor(...INK); d.text(l, x + cw / 2, yy + 10, { align: 'center' });
    });
    d.setFont('helvetica', 'italic'); d.setFontSize(7.5); d.setTextColor(...GREY);
    d.text('Total = rounds + puzzles + music + host bonus points. Tiebreaker only if tied.', M, yy + 57);
    cx.y = yy + 60;
  }

  /* ---------- HOST ANSWER KEY ---------- */
  function hostKey(cx, set) {
    const d = cx.doc;
    setTitleLabel(cx, set, 'HOST ANSWER KEY');
    cx.newPage(!d._started); d._started = true;
    let y = cx.y;
    d.setFont('helvetica', 'italic'); d.setFontSize(8.5); d.setTextColor(...GREY);
    d.text('Read each question twice. Mode: ' + (set.mode === 'mc' ? 'Multiple choice (letters shown; * marks the correct one)' : 'Free response') + '. Keep this page away from the tables.', M, y); y += 14;
    cx.y = y;
    let qn = 0;
    C.roundsOf(set).forEach((r, ri) => {
      cx.need(40);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 16, 3, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('ROUND ' + (ri + 1), M + 8, cx.y + 11.2);
      cx.y += 24;
      r.forEach(id => {
        const q = C.Qs.get(id); if (!q) return; qn++;
        d.setFont('helvetica', 'normal'); d.setFontSize(9.6);
        const ql = d.splitTextToSize(T(q.q), RW - 30);
        let opt = '';
        if (set.mode === 'mc' && C.hasMC(q)) { const m = C.mcOptions(q); opt = m.opts.map((o, i) => 'ABCD'[i] + ') ' + T(o) + (o === q.a ? ' *' : '')).join('     '); }
        const ol = opt ? d.splitTextToSize(opt, RW - 30) : [];
        const h = ql.length * 11.4 + ol.length * 10.6 + 15 + 7;
        cx.need(h);
        const yy = cx.y;
        d.setFont('helvetica', 'bold'); d.setFontSize(9.6); d.setTextColor(...INK); d.text(String(qn) + '.', M + 2, yy + 9);
        d.setFont('helvetica', 'normal'); ql.forEach((l, i) => d.text(l, M + 28, yy + 9 + i * 11.4));
        let y2 = yy + 9 + (ql.length - 1) * 11.4;
        if (ol.length) { d.setFontSize(8.6); d.setTextColor(...GREY); ol.forEach((l, i) => d.text(l, M + 28, y2 + 10.6 + i * 10.6)); y2 += ol.length * 10.6; }
        d.setFont('helvetica', 'bold'); d.setFontSize(9.8); d.setTextColor(176, 98, 0);
        d.text('ANSWER: ' + T(q.a), M + 28, y2 + 12.8);
        d.setFont('helvetica', 'normal'); d.setFontSize(7); d.setTextColor(...GREY);
        d.text(T((C.GENRES[q.g] || q.g) + ' / ' + q.t + ' / ' + C.DIFF[q.d] + (q.mine ? ' / mine' : '') + '   #' + q.id), PW - M, y2 + 12.8, { align: 'right' });
        d.setDrawColor(228, 231, 238); d.setLineWidth(0.4); d.line(M, y2 + 18.5, PW - M, y2 + 18.5);
        cx.y = y2 + 23;
        d.setTextColor(...INK);
      });
      cx.y += 4;
    });
    if (set.rebus && set.rebus.length) {
      cx.need(30 + set.rebus.length * 40);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 16, 3, 3, 'F'); d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('PICTURE PUZZLES', M + 8, cx.y + 11.2);
      cx.y += 24;
      set.rebus.forEach((i, k) => {
        const p = C.REBUS[i]; if (!p) return;
        const im = emojiImg(p[0]);
        if (im) { const s = Math.min(120 / im.w, 28 / im.h); d.addImage(im.url, 'PNG', M + 26, cx.y, im.w * s, im.h * s); }
        d.setFont('helvetica', 'bold'); d.setFontSize(9.6); d.setTextColor(...INK); d.text('P' + (k + 1) + '.', M + 2, cx.y + 16);
        d.setTextColor(176, 98, 0); d.text('ANSWER: ' + T(p[1]), M + 160, cx.y + 16);
        d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(...GREY); d.text('Category: ' + T(p[2]), PW - M, cx.y + 16, { align: 'right' });
        cx.y += 36;
      });
    }
    if (set.songs && set.songs.length) {
      cx.need(30 + set.songs.length * 18);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 16, 3, 3, 'F'); d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(9); d.text('MUSIC ROUND   play a clip, teams name the artist', M + 8, cx.y + 11.2);
      cx.y += 24;
      set.songs.forEach((i, k) => {
        const s = C.SONGS[i]; if (!s) return;
        d.setFont('helvetica', 'bold'); d.setFontSize(9.6); d.setTextColor(...INK); d.text('M' + (k + 1) + '.', M + 2, cx.y + 9);
        d.setFont('helvetica', 'normal'); d.text('"' + T(s[0]) + '"', M + 28, cx.y + 9);
        d.setFont('helvetica', 'bold'); d.setTextColor(176, 98, 0); d.text('ARTIST: ' + T(s[1]), M + 300, cx.y + 9);
        d.setFont('helvetica', 'normal'); d.setFontSize(7.5); d.setTextColor(...GREY); d.text(T(s[2]), PW - M, cx.y + 9, { align: 'right' });
        cx.y += 17;
      });
      cx.y += 6;
    }
    const tb = set.tb && C.Qs.get(set.tb);
    if (tb) {
      cx.need(40);
      d.setFont('helvetica', 'bold'); d.setFontSize(9); d.setTextColor(...AMBER); d.text('TIEBREAKER (closest guess wins)', M, cx.y + 9);
      d.setFont('helvetica', 'normal'); d.setFontSize(9.6); d.setTextColor(...INK);
      const l = d.splitTextToSize(T(tb.q), RW - 20); l.forEach((t, i) => d.text(t, M, cx.y + 22 + i * 11.4));
      d.setFont('helvetica', 'bold'); d.setTextColor(176, 98, 0); d.text('ANSWER: ' + T(tb.a), M, cx.y + 24 + l.length * 11.4);
      cx.y += 40 + l.length * 11.4;
    }
  }

  /* ---------- QUESTION READER (no answers) ---------- */
  function questionSheet(cx, set) {
    const d = cx.doc;
    setTitleLabel(cx, set, 'QUESTION SHEET');
    cx.newPage(!d._started); d._started = true;
    let qn = 0;
    C.roundsOf(set).forEach((r, ri) => {
      cx.need(60);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 20, 3, 3, 'F');
      d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(11); d.text('ROUND ' + (ri + 1), M + 10, cx.y + 14);
      cx.y += 32;
      r.forEach(id => {
        const q = C.Qs.get(id); if (!q) return; qn++;
        d.setFont('helvetica', 'normal'); d.setFontSize(12.5);
        const ql = d.splitTextToSize(T(q.q), RW - 36);
        let ol = [];
        if (set.mode === 'mc' && C.hasMC(q)) { const m = C.mcOptions(q); ol = m.opts.map((o, i) => 'ABCD'[i] + ')  ' + T(o)); }
        const h = ql.length * 15 + (ol.length ? Math.ceil(ol.length / 2) * 15 + 2 : 0) + 14;
        cx.need(h);
        d.setFont('helvetica', 'bold'); d.setFontSize(12.5); d.setTextColor(...AMBER); d.text(String(qn) + '.', M, cx.y + 11);
        d.setTextColor(...INK); d.setFont('helvetica', 'normal'); ql.forEach((l, i) => d.text(l, M + 30, cx.y + 11 + i * 15));
        let yy = cx.y + 11 + (ql.length - 1) * 15;
        if (ol.length) { d.setFontSize(11.5); ol.forEach((o, i) => { d.text(o, M + 44 + (i % 2) * 240, yy + 16 + Math.floor(i / 2) * 15); }); yy += Math.ceil(ol.length / 2) * 15; }
        cx.y = yy + 16;
      });
      cx.y += 6;
    });
    if (set.rebus && set.rebus.length) {
      cx.need(40);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 20, 3, 3, 'F'); d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(11); d.text('PICTURE PUZZLES', M + 10, cx.y + 14); cx.y += 32;
      set.rebus.forEach((i, k) => {
        const p = C.REBUS[i]; if (!p) return; cx.need(70);
        const im = emojiImg(p[0]);
        d.setFont('helvetica', 'bold'); d.setFontSize(12.5); d.setTextColor(...AMBER); d.text('P' + (k + 1) + '.', M, cx.y + 26);
        if (im) { const s = Math.min(260 / im.w, 54 / im.h); d.addImage(im.url, 'PNG', M + 30, cx.y, im.w * s, im.h * s); }
        d.setFont('helvetica', 'italic'); d.setFontSize(10); d.setTextColor(...GREY); d.text('Category: ' + T(p[2]), M + 330, cx.y + 28);
        cx.y += 66; d.setTextColor(...INK);
      });
    }
    if (set.songs && set.songs.length) {
      cx.need(30 + set.songs.length * 22);
      d.setFillColor(...NAVY); d.roundedRect(M, cx.y, RW, 20, 3, 3, 'F'); d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(11); d.text('MUSIC ROUND   (name the artist)', M + 10, cx.y + 14); cx.y += 32;
      set.songs.forEach((i, k) => {
        const s = C.SONGS[i]; if (!s) return;
        d.setFont('helvetica', 'bold'); d.setFontSize(12.5); d.setTextColor(...AMBER); d.text('M' + (k + 1) + '.', M, cx.y + 11);
        d.setTextColor(...INK); d.setFont('helvetica', 'normal'); d.text('Song title: "' + T(s[0]) + '"   (' + T(s[2]) + ')', M + 34, cx.y + 11);
        cx.y += 22;
      });
    }
  }

  /* ---------- HOST TALLY SHEET ---------- */
  function tallySheet(cx, set) {
    const d = cx.doc;
    setTitleLabel(cx, set, 'HOST TALLY SHEET');
    cx.newPage(!d._started); d._started = true;
    const rounds = C.roundsOf(set).length;
    const cols = ['Team'];
    for (let i = 1; i <= rounds; i++) cols.push('R' + i);
    if (set.rebus && set.rebus.length) cols.push('Pics');
    if (set.songs && set.songs.length) cols.push('Music');
    cols.push('Bonus', 'Total', 'Place');
    const teamW = 150, cw = (RW - teamW) / (cols.length - 1);
    let y = cx.y;
    d.setFont('helvetica', 'italic'); d.setFontSize(8.5); d.setTextColor(...GREY);
    d.text('Tick each round as you grade. Add host bonus points in the Bonus column, then Total = rounds + bonus.', M, y); y += 10;
    d.setFillColor(...NAVY); d.rect(M, y, RW, 18, 'F');
    d.setTextColor(...AMBER); d.setFont('helvetica', 'bold'); d.setFontSize(8.5);
    cols.forEach((c, i) => d.text(c, i === 0 ? M + 6 : M + teamW + (i - 1) * cw + cw / 2, y + 12, { align: i === 0 ? 'left' : 'center' }));
    y += 18;
    const rowH = Math.floor((PH - 60 - y) / 22);
    for (let r = 0; r < 22; r++) {
      d.setDrawColor(...LINE); d.setLineWidth(0.5);
      if (r % 2 === 0) { d.setFillColor(...SOFT); d.rect(M, y, RW, rowH, 'F'); }
      d.rect(M, y, RW, rowH, 'S');
      d.line(M + teamW, y, M + teamW, y + rowH);
      for (let c = 1; c < cols.length; c++) d.line(M + teamW + c * cw, y, M + teamW + c * cw, y + rowH);
      y += rowH;
    }
    // highlight bonus + total columns header marks
    const bi = cols.indexOf('Bonus');
    d.setDrawColor(...AMBER); d.setLineWidth(1.4); d.rect(M + teamW + (bi - 1) * cw, 72 + 10 + 18, cw, y - (72 + 10 + 18));
    cx.y = y;
  }

  const MAKERS = { sheet: answerSheet, host: hostKey, questions: questionSheet, tally: tallySheet };

  function makePdf(sets, kinds) {
    const doc = startDoc(); const cx = new Ctx(doc); doc._started = false;
    sets.forEach(set => kinds.forEach(k => MAKERS[k](cx, set)));
    cx.footer();
    return doc;
  }
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function savePdf(sets, kinds, name) {
    const doc = makePdf(sets, kinds);
    doc.save(name.endsWith('.pdf') ? name : name + '.pdf');
  }

  /* ---------- BANK LIST PDF ---------- */
  function bankPdf(list, title) {
    const doc = startDoc(); const cx = new Ctx(doc); doc._started = false;
    cx.title = 'QUESTION BANK'; cx.label = T(title + '   |   ' + list.length + ' questions');
    cx.newPage(true); doc._started = true; const d = doc;
    list.forEach((q, i) => {
      d.setFont('helvetica', 'normal'); d.setFontSize(9.2);
      const ql = d.splitTextToSize(T(q.q), RW - 30);
      const opts = q.w.length ? 'Wrong: ' + q.w.map(T).join('  |  ') : '';
      const ol = opts ? d.splitTextToSize(opts, RW - 30) : [];
      cx.need(ql.length * 11 + ol.length * 10 + 24);
      const yy = cx.y;
      d.setFont('helvetica', 'bold'); d.setTextColor(...AMBER); d.text('#' + q.id, M, yy + 9);
      d.setTextColor(...INK); d.setFont('helvetica', 'normal'); ql.forEach((l, j) => d.text(l, M + 30, yy + 9 + j * 11));
      let y2 = yy + 9 + (ql.length - 1) * 11;
      d.setFont('helvetica', 'bold'); d.setFontSize(9.2); d.setTextColor(176, 98, 0); d.text('ANSWER: ' + T(q.a), M + 30, y2 + 12);
      d.setFont('helvetica', 'normal'); d.setFontSize(7); d.setTextColor(...GREY); d.text(T((C.GENRES[q.g] || q.g) + ' / ' + q.t + ' / ' + C.DIFF[q.d]), PW - M, y2 + 12, { align: 'right' });
      d.setFontSize(8); ol.forEach((l, j) => d.text(l, M + 30, y2 + 22 + j * 10));
      y2 += ol.length * 10;
      d.setDrawColor(228, 231, 238); d.setLineWidth(0.4); d.line(M, y2 + 20, PW - M, y2 + 20);
      cx.y = y2 + 26;
    });
    cx.footer();
    return doc;
  }

  window.CADPDF = { makePdf, savePdf, bankPdf, slug };
})();
