// Due dates for the teacher grade pages (IST web editor, Python, Arduino).
// Every assignment is due the FRIDAY of the week it was assigned, at 11:59 pm Eastern (12:00 am Saturday is late).
// "The week it was assigned" comes from the same calendars the Next Two Weeks pages use, so editing the calendar moves the deadline:
//   ist   -> /ist/pacing-guide.html   (a lesson like "3.4" is found in the first week whose list item starts with that number)
//   ec    -> /ec/pacing-guide.html    (same, for the Arduino slots: u2-5 = "2.5")
//   apcsp -> the calendar API         (a line containing "Python Assignment 5")
// A late flag is based on the LAST submission (the version being graded); the first submission time is shown too.
(function () {
  var MONTH = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  var cache = {};

  function yearFor(m) { return m >= 7 ? 2026 : 2027; } // Aug-Dec = first calendar year of the school year (same rule as next-two-weeks.js)
  function etParts(ms) {
    var f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(new Date(ms)), o = {};
    f.forEach(function (p) { o[p.type] = +p.value; }); return o;
  }
  // 11:59:59 pm Eastern on a calendar day, as a UTC millisecond value (handles daylight saving)
  function endOfDayET(y, m, d) {
    for (var off = 4; off <= 5; off++) {
      var t = Date.UTC(y, m, d, 23, 59, 59) + off * 3600000, p = etParts(t);
      if (p.year === y && p.month === m + 1 && p.day === d && p.hour === 23) return t;
    }
    return Date.UTC(y, m, d, 23, 59, 59) + 5 * 3600000;
  }
  function fridayDeadline(y, m, d) { // y,m,d = any day of the week (the calendar uses Mondays)
    var dow = new Date(Date.UTC(y, m, d)).getUTCDay(), toFri = (5 - dow + 7) % 7; if (dow === 6) toFri = 6; if (dow === 0) toFri = 5;
    var f = new Date(Date.UTC(y, m, d + toFri)); return endOfDayET(f.getUTCFullYear(), f.getUTCMonth(), f.getUTCDate());
  }
  function shortDate(text) {
    var m = /([A-Za-z]{3})\w*\s+(\d{1,2})/.exec(text || ""); if (!m) return null;
    var ab = m[1][0].toUpperCase() + m[1].slice(1, 3).toLowerCase(); if (!(ab in MONTH)) return null;
    return { y: yearFor(MONTH[ab]), m: MONTH[ab], d: +m[2] };
  }
  function fmtWeek(dt) { return new Date(Date.UTC(dt.y, dt.m, dt.d)).toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" }); }

  // one entry per week: { dt, weekLabel, items: [text...] } sorted by date
  function loadStatic(url) {
    return fetch(url, { cache: "no-store" }).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html"), weeks = [];
      Array.prototype.forEach.call(doc.querySelectorAll(".pace-row"), function (row) {
        var cell = row.querySelector(".pace-weeks"), hint = cell && cell.querySelector(".hint"), dt = hint && shortDate(hint.textContent); if (!dt) return;
        var items = Array.prototype.map.call(row.querySelectorAll("li"), function (li) { return li.textContent.replace(/\s+/g, " ").trim(); });
        weeks.push({ dt: dt, weekLabel: (cell.childNodes[0].textContent || "").trim(), items: items });
      });
      return weeks.sort(function (a, b) { return Date.UTC(a.dt.y, a.dt.m, a.dt.d) - Date.UTC(b.dt.y, b.dt.m, b.dt.d); });
    });
  }
  function loadApi(course) {
    return fetch("/api/announcements?action=calendar&course=" + encodeURIComponent(course), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      var weeks = [];
      (j.weeks || []).forEach(function (w) {
        var mo = /(\d{4})/.exec(w.month || ""), dt = shortDate(w.label); if (!mo || !dt) return; dt.y = +mo[1];
        weeks.push({ dt: dt, weekLabel: "Week of " + w.label, items: w.lines || [] });
      });
      return weeks.sort(function (a, b) { return Date.UTC(a.dt.y, a.dt.m, a.dt.d) - Date.UTC(b.dt.y, b.dt.m, b.dt.d); });
    });
  }
  function weeks(course) {
    if (!cache[course]) cache[course] = (course === "apcsp" ? loadApi("apcsp") : loadStatic(course === "ec" ? "/ec/pacing-guide.html" : "/ist/pacing-guide.html")).catch(function () { return []; });
    return cache[course];
  }
  // the list-item numbers at the start of a pacing line: "3.4 + 3.5 Editing Tags" -> ["3.4","3.5"]; "2.2A (addendum...)" -> ["2.2"]
  function leadingNumbers(text) {
    var m = /^(?:\d+\.\d+[A-Za-z]?\s*(?:\+|and|&)?\s*)+/.exec(text); return m ? (m[0].match(/\d+\.\d+/g) || []) : [];
  }
  function find(course, key, ws) {
    for (var i = 0; i < ws.length; i++) {
      var hit = ws[i].items.some(function (t) {
        if (course === "apcsp") { var re = /Python Assignment\s+(\d+)/gi, m; while ((m = re.exec(t))) if (+m[1] === +key) return true; return false; }
        return leadingNumbers(t).indexOf(key) > -1;
      });
      if (hit) return ws[i];
    }
    return null;
  }

  var DueDates = {
    // key: ist "3.4" (the label students see; "3.3 Part 2" counts as 3.3), ec "2.5" or an Arduino slot id like "u2-5b", apcsp the Python assignment number
    // returns a Promise of { due: ms, week: "Week 13 · Nov 2" } or null (no deadline: not on the calendar)
    deadline: function (course, key) {
      var k = String(key == null ? "" : key), m;
      if (course !== "apcsp") {
        if ((m = /^u(\d)-(\d+)/.exec(k))) k = m[1] + "." + m[2]; else if ((m = /^(\d+\.\d+)/.exec(k))) k = m[1]; else return Promise.resolve(null);
      } else if (!/^\d+$/.test(k)) return Promise.resolve(null);
      return weeks(course).then(function (ws) {
        var w = find(course, k, ws); if (!w) return null;
        return { due: fridayDeadline(w.dt.y, w.dt.m, w.dt.d), week: (w.weekLabel ? w.weekLabel + " · " : "") + fmtWeek(w.dt) };
      });
    },
    // d = result of deadline(); first/last = ISO strings (first may be missing for old records)
    status: function (d, first, last) {
      if (!d || !last) return null;
      var fMs = Date.parse(first || last), lMs = Date.parse(last);
      return { due: d.due, week: d.week, firstMs: fMs, lastMs: lMs, firstLate: fMs > d.due, late: lMs > d.due, lateBy: lMs - d.due };
    },
    span: function (ms) {
      var m = Math.round(ms / 60000), dd = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
      return dd ? dd + "d " + h + "h" : h ? h + "h " + mi + "m" : mi + "m";
    },
    fmt: function (ms) { return new Date(ms).toLocaleString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " ET"; },
    // a small pill for a list row
    pill: function (st) {
      if (!st) return "";
      return st.late ? '<span style="display:inline-block;margin-left:4px;padding:1px 6px;border-radius:9px;font-size:11px;font-weight:700;background:#7f1d1d;color:#fecaca" title="Last submission: ' + DueDates.fmt(st.lastMs) + ". Due " + DueDates.fmt(st.due) + '">LATE ' + DueDates.span(st.lateBy) + "</span>"
        : '<span style="display:inline-block;margin-left:4px;padding:1px 6px;border-radius:9px;font-size:11px;font-weight:700;background:#14532d;color:#bbf7d0" title="Due ' + DueDates.fmt(st.due) + '">On time</span>';
    },
    // a line for the detail header
    detail: function (st) {
      if (!st) return "";
      var firstTxt = st.firstMs === st.lastMs ? "" : "First submitted " + DueDates.fmt(st.firstMs) + (st.firstLate ? " (late)" : " (on time)") + ". ";
      return '<div style="margin:6px 0;font-size:13px">Due <b>' + DueDates.fmt(st.due) + "</b> <span style=\"opacity:.7\">(" + st.week + ")</span>. " + firstTxt + "Last submitted <b>" + DueDates.fmt(st.lastMs) + "</b>: " +
        (st.late ? '<b style="color:#fca5a5">LATE by ' + DueDates.span(st.lateBy) + "</b>" : '<b style="color:#86efac">on time</b>') + ".</div>";
    },
    csv: function (st) { return st ? [new Date(st.due).toISOString(), new Date(st.firstMs).toISOString(), new Date(st.lastMs).toISOString(), st.late ? "LATE" : "on time"] : ["", "", "", ""]; }
  };
  window.DueDates = DueDates;
})();
