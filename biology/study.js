(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuf(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var S = window.Study = {};

  /* flashcards: cards = [[front, back], ...] */
  S.flashcards = function (el, cards) {
    var deck, known, i, flip;
    function start() { deck = shuf(cards); known = 0; i = 0; flip = false; draw(); }
    function draw() {
      if (i >= deck.length) {
        el.innerHTML = '<div class="card"><b>Round finished!</b> You marked ' + known + ' of ' + deck.length + ' as "Got it".</div><div class="row"><button class="pri" id="fr">Study the ones I missed</button><button id="fa">Start over with all cards</button></div>';
        $("#fr", el).onclick = function () { var miss = deck.filter(function (c) { return !c._k; }); if (!miss.length) { start(); return; } deck = shuf(miss); known = 0; i = 0; flip = false; draw(); };
        $("#fa", el).onclick = function () { cards.forEach(function (c) { c._k = 0; }); start(); };
        return;
      }
      var c = deck[i];
      el.innerHTML = '<div class="mut">Card ' + (i + 1) + ' of ' + deck.length + ' &middot; tap the card to flip it</div><div class="fc' + (flip ? ' back' : '') + '" id="fc">' + (flip ? esc(c[1]) : '<b>' + esc(c[0]) + '</b>') + '</div><div class="row"><button id="no">Study again</button><button class="pri" id="yes">Got it</button><button id="sh">Shuffle</button></div>';
      $("#fc", el).onclick = function () { flip = !flip; draw(); };
      $("#yes", el).onclick = function () { c._k = 1; known++; i++; flip = false; draw(); };
      $("#no", el).onclick = function () { c._k = 0; i++; flip = false; draw(); };
      $("#sh", el).onclick = start;
    }
    cards.forEach(function (c) { c._k = 0; });
    start();
  };

  /* quiz: qs = [{q, o:[...], a:index, e:explanation}] */
  S.quiz = function (el, qs, n) {
    var list, i, score, miss;
    function start() { list = shuf(qs).slice(0, n || qs.length); i = 0; score = 0; miss = []; draw(); }
    function draw() {
      if (i >= list.length) {
        var pct = Math.round(100 * score / list.length);
        el.innerHTML = '<div class="card"><h3 style="margin-top:0">You got ' + score + ' of ' + list.length + ' (' + pct + '%)</h3><p>' + (pct >= 90 ? 'Excellent! You are ready.' : pct >= 70 ? 'Good work. Review the ones you missed below, then try again.' : 'Keep going. Read the matching part of the guide, then try again.') + '</p>' + (miss.length ? '<b>Review these:</b><ul>' + miss.map(function (m) { return '<li>' + esc(m.q) + '<br><span class="mut">Answer: ' + esc(m.o[m.a]) + '</span></li>'; }).join('') + '</ul>' : '') + '</div><div class="row"><button class="pri" id="again">Try again (new order)</button></div>';
        $("#again", el).onclick = start;
        return;
      }
      var q = list[i], order = shuf(q.o.map(function (_, k) { return k; }));
      el.innerHTML = '<div class="bar"><i style="width:' + (100 * i / list.length) + '%"></i></div><div class="mut" style="margin:6px 0">Question ' + (i + 1) + ' of ' + list.length + ' &middot; score ' + score + '</div><div class="card"><b>' + esc(q.q) + '</b>' + order.map(function (k) { return '<button class="opt" data-k="' + k + '">' + esc(q.o[k]) + '</button>'; }).join('') + '<div id="fb"></div></div>';
      var done = false;
      [].forEach.call(el.querySelectorAll(".opt"), function (b) {
        b.onclick = function () {
          if (done) return;
          done = true;
          var k = +b.dataset.k, ok = k === q.a;
          if (ok) score++; else miss.push(q);
          [].forEach.call(el.querySelectorAll(".opt"), function (x) { if (+x.dataset.k === q.a) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
          $("#fb", el).innerHTML = '<div class="fb ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? 'Correct!' : 'Not quite.') + '</b> ' + esc(q.e || '') + '</div><div class="row"><button class="pri" id="nx">' + (i + 1 >= list.length ? 'See my score' : 'Next question') + '</button></div>';
          $("#nx", el).onclick = function () { i++; draw(); };
        };
      });
    }
    start();
  };

  /* order: tap the steps in the right order */
  S.order = function (el, prompt, items) {
    var pick = [], sh = shuf(items);
    function draw(chk) {
      el.innerHTML = '<div class="card"><b>' + esc(prompt) + '</b><div class="mut">Tap the steps in the right order.</div><div class="chips">' + sh.map(function (t) { return '<span class="chip' + (pick.indexOf(t) > -1 ? ' used' : '') + '" data-t="' + esc(t) + '" style="cursor:pointer">' + esc(t) + '</span>'; }).join('') + '</div><div class="slot">' + pick.map(function (t, k) { return '<span class="chip' + (chk ? (t === items[k] ? ' ok' : ' bad') : '') + '">' + (k + 1) + '. ' + esc(t) + '</span>'; }).join('') + '</div><div class="row"><button class="pri" id="ck"' + (pick.length < items.length ? ' disabled' : '') + '>Check</button><button id="un">Undo</button><button id="rs">Reset</button></div><div id="msg" style="margin-top:8px"></div></div>';
      [].forEach.call(el.querySelectorAll(".chips .chip"), function (c) { c.onclick = function () { var t = c.dataset.t; if (pick.indexOf(t) < 0) { pick.push(t); draw(); } }; });
      $("#un", el).onclick = function () { pick.pop(); draw(); };
      $("#rs", el).onclick = function () { pick = []; sh = shuf(items); draw(); };
      $("#ck", el).onclick = function () {
        draw(true);
        var ok = pick.every(function (t, k) { return t === items[k]; });
        $("#msg", el).innerHTML = ok ? '<div class="fb ok"><b>Perfect order!</b></div>' : '<div class="fb no">Red ones are in the wrong spot. Tap Undo or Reset and try again. The right order is: <b>' + esc(items.join(' → ')) + '</b></div>';
      };
    }
    draw();
  };

  /* match: pairs = [[left, right], ...], 6 at a time */
  S.match = function (el, pairs) {
    function start() {
      var set = shuf(pairs).slice(0, 6), L = shuf(set.map(function (p, k) { return k; })), R = shuf(set.map(function (p, k) { return k; })), sel = null, left = set.length;
      el.innerHTML = '<div class="mut">Tap a term on the left, then its match on the right.</div><div class="mg">' + L.map(function (k, n) { return '<button data-s="l" data-k="' + k + '"><b>' + esc(set[k][0]) + '</b></button><button data-s="r" data-k="' + R[n] + '">' + esc(set[R[n]][1]) + '</button>'; }).join('') + '</div><div id="mm" style="margin-top:10px"></div><div class="row"><button id="nr">New round</button></div>';
      var btns = [].slice.call(el.querySelectorAll(".mg button"));
      btns.forEach(function (b) {
        b.onclick = function () {
          if (b.dataset.s === "l") { btns.forEach(function (x) { x.classList.remove("sel"); }); sel = b; b.classList.add("sel"); return; }
          if (!sel) return;
          if (sel.dataset.k === b.dataset.k) {
            sel.classList.remove("sel"); sel.classList.add("done"); b.classList.add("done"); sel = null; left--;
            if (!left) $("#mm", el).innerHTML = '<div class="fb ok"><b>All matched!</b> Tap New round for different ones.</div>';
          } else { b.classList.add("shake"); setTimeout(function () { b.classList.remove("shake"); }, 500); }
        };
      });
      $("#nr", el).onclick = start;
    }
    start();
  };

  /* osmosis / tonicity simulator */
  S.tonicity = function (el) {
    el.innerHTML = '<div class="card"><b>Try it: a red blood cell has a salt level of 50 inside.</b> Slide the salt level of the water outside.<input type="range" id="sl" min="0" max="100" value="50" aria-label="salt outside"><div class="cellbox"><svg id="sv" viewBox="0 0 320 200" width="100%" style="max-width:420px"></svg></div><div id="tx"></div></div>';
    var sl = $("#sl", el), sv = $("#sv", el), tx = $("#tx", el);
    function upd() {
      var v = +sl.value, r = 60 + (50 - v) * 0.55, state, arrow, col;
      if (v < 47) { state = "HYPOTONIC (less solute outside)"; arrow = "Water moves INTO the cell. The cell swells and may burst."; col = "#3b82f6"; }
      else if (v > 53) { state = "HYPERTONIC (more solute outside)"; arrow = "Water moves OUT of the cell. The cell shrinks."; col = "#f59e0b"; }
      else { state = "ISOTONIC (same solute)"; arrow = "Water moves both ways equally. No change."; col = "#22c55e"; }
      sv.innerHTML = '<rect width="320" height="200" fill="' + col + '" opacity=".15" rx="12"/>' + (v < 8 ? '<text x="160" y="105" text-anchor="middle" font-size="26" fill="#ef4444">BURST!</text>' : '<circle cx="160" cy="100" r="' + r + '" fill="#ef4444" opacity=".8" stroke="#7f1d1d" stroke-width="3"/><text x="160" y="106" text-anchor="middle" font-size="16" fill="#fff">salt in: 50</text>') + '<text x="10" y="22" font-size="14" fill="currentColor">salt outside: ' + v + '</text>';
      tx.innerHTML = '<p><b>' + state + '</b><br>' + arrow + '</p><p class="mut">Remember: it is the WATER that moves toward the saltier side.</p>';
    }
    sl.oninput = upd; upd();
  };
})();
