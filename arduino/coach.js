/* The "coach": friendly pop-up cards that appear when something happens in the circuit, so students learn as they go.
   Used by the editor and by the notes pages that embed the simulator.

   ArduinoCoach.attach(host, opts) -> { check(ctx), show(card), enabled(on) }
     host: the element the card slides into.   opts.openTopic(id): called when a "learn more" bubble is clicked.
     ctx = { res, io, project, sim, serial, slot }  (what the circuit and program are doing right now)
   Cards are shown once each (per page). A card is { id, title, html, help:[topic ids] }. */
(function (root) {
  "use strict";
  var EVENTS = [
    { id: "led-lit", when: function (c) { return anyLed(c, function (l) { return l.brightness > 0.2; }); },
      title: "It's glowing! 💡", help: ["ledhow", "ohmslaw", "polarity"],
      html: function (c) { var l = firstLed(c, function (x) { return x.brightness > 0.2; }); return "Electricity is flowing in a complete loop through your LED, about <b>" + (l ? l.current.toFixed(1) : "?") + " mA</b>. The resistor is what keeps that safe. Hover over the LED's legs to see which one is the <b>anode (+)</b> and which is the <b>cathode (&minus;)</b>."; } },
    { id: "led-burned", when: function (c) { return anyLed(c, function (l) { return l.blown; }); },
      title: "Your LED burned out! 🔥", help: ["ledburn", "ledresistor", "ohmslaw"],
      html: function () { return "Too much current went through it, so it is ruined (the black X). Real LEDs do this in a flash. Add a <b>220 &Omega; resistor</b> in series, then click <b>Reset</b> to put in a fresh LED."; } },
    { id: "led-reversed", when: function (c) { return anyLed(c, function (l) { return l.reversed; }); },
      title: "That LED is backwards", help: ["ledhow", "polarity"],
      html: function () { return "An LED is a <b>diode</b>, a one-way street for current. Current can only enter the <b>anode (+, long leg)</b> and leave the <b>cathode (&minus;, short leg)</b>. Backwards, it just blocks the current. Nothing is damaged. Swap its legs to fix it."; } },
    { id: "short", when: function (c) { return !!(c.res && c.res.short); },
      title: "Short circuit! ⚡", help: ["shortcircuit"],
      html: function () { return "You connected <b>5V straight to GND</b> (or to another power pin) with nothing in between to limit the current. In real life that gets hot fast. Find the wire that goes from + to &minus; and remove it."; } },
    { id: "pin-overload", when: function (c) { return !!(c.res && c.res.warnings.some(function (w) { return /supplying/.test(w.msg); })); },
      title: "That pin is working too hard", help: ["pins", "ledresistor"],
      html: function () { return "An Arduino pin can only give about <b>20 mA</b> safely. Something connected to this pin lets far more current through. Usually the cause is a <b>missing resistor</b> or a path straight to GND."; } },
    { id: "button-press", when: function (c) { return !!(c.sim && c.sim.running && c.io && Object.keys(c.io.pressed || {}).some(function (k) { return c.io.pressed[k]; })); },
      title: "Button pressed", help: ["pullup", "button"],
      html: function () { return "Pressing the button connects the pin to <b>GND</b>. With <code>INPUT_PULLUP</code>, a pin reads <b>HIGH</b> when nothing is pressed and <b>LOW</b> while the button is held. That is why the code checks for <code>== LOW</code>."; } },
    { id: "serial-first", when: function (c) { return !!(c.serial && c.serial.length > 0); },
      title: "That's the Serial Monitor", help: ["serialmon", "serial"],
      html: function () { return "Your Arduino just sent a message to your computer with <code>Serial.print</code>. This is the best way to see what your program is thinking. Look at the <b>Serial Monitor</b> panel."; } },
    { id: "pwm-on", when: function (c) { return !!(c.io && c.io.pins && Object.keys(c.io.pins).some(function (k) { var s = c.io.pins[k]; return s && s.pwm !== null && s.pwm !== undefined; })); },
      title: "That's PWM", help: ["pwm", "analogwrite"],
      html: function () { return "The pin is switching on and off about <b>490 times a second</b>. The more of each moment it is ON, the brighter the LED looks. Your eyes just see the average."; } },
    { id: "pwm-bad-pin", when: function (c) { return !!(c.sim && c.sim.history && c.sim.history.badPwm); },
      title: "That pin can't do PWM", help: ["pwm", "pins"],
      html: function () { return "Only the pins marked with a <b>~</b> (3, 5, 6, 9, 10, 11) can dim an LED with <code>analogWrite</code>. On any other pin the LED is just fully ON or fully OFF. Move your wire to a ~ pin."; } },
    { id: "floating", when: function (c) { return !!(c.sim && c.sim.history && c.sim.history.floatRead); },
      title: "A floating pin!", help: ["floating", "pullup"],
      html: function () { return "<code>digitalRead</code> was used on a pin that is not connected to anything solid. It picks up electrical noise and flickers between HIGH and LOW. <code>INPUT_PULLUP</code> fixes this by pulling the pin up to 5V."; } },
    { id: "buzzer-on", when: function (c) { return !!(c.res && Object.keys(c.res.buzzers || {}).some(function (k) { return c.res.buzzers[k].sounding; })); },
      title: "Listen! 🔊", help: ["buzzer", "tone"],
      html: function () { return "The buzzer vibrates at the frequency you gave <code>tone()</code>. A bigger number is a higher pitch."; } }
  ];
  function leds(c) { return c.res && c.res.leds ? Object.keys(c.res.leds).map(function (k) { return c.res.leds[k]; }) : []; }
  function anyLed(c, f) { return leds(c).some(f); }
  function firstLed(c, f) { return leds(c).filter(f)[0]; }

  function attach(host, opts) {
    opts = opts || {}; var shown = {}, queue = [], current = null, on = true, extra = opts.events || [];
    var card = document.createElement("div"); card.className = "coachcard"; card.setAttribute("role", "status"); host.appendChild(card);
    function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
    function render(c) {
      var h = '<div class="coachtop"><b>' + c.title + '</b><button type="button" class="coachx" aria-label="Close">&times;</button></div><div class="coachbody">' + (typeof c.html === "function" ? c.html(c.ctx || {}) : c.html) + "</div>";
      if (c.help && c.help.length && opts.topics) h += '<div class="coachhelp">' + c.help.filter(function (id) { return opts.topics[id]; }).map(function (id) { return '<button type="button" class="tipbtn" data-coachtip="' + id + '">&#128161; ' + esc(opts.topics[id].title) + "</button>"; }).join("") + "</div>";
      card.innerHTML = h; card.className = "coachcard show";
      card.querySelector(".coachx").onclick = close;
      card.querySelectorAll("[data-coachtip]").forEach(function (b) { b.onclick = function () { if (opts.openTopic) opts.openTopic(b.getAttribute("data-coachtip")); }; });
    }
    function close() { card.className = "coachcard"; current = null; setTimeout(next, 350); }
    function next() { if (current || !queue.length || !on) return; current = queue.shift(); render(current); clearTimeout(next.t); next.t = setTimeout(function () { if (current) close(); }, 14000); }
    function show(c) { if (shown[c.id]) return; shown[c.id] = true; queue.push(c); if (current) { clearTimeout(next.t); next.t = setTimeout(function () { if (current) close(); }, 4500); } else next(); }
    function check(ctx) {
      if (!on) return;
      EVENTS.concat(extra).forEach(function (e) { if (shown[e.id]) return; var ok = false; try { ok = !!e.when(ctx); } catch (x) { ok = false; } if (ok) show({ id: e.id, title: e.title, html: e.html, help: e.help, ctx: ctx }); });
    }
    return { check: check, show: show, setExtra: function (list) { extra = list || []; }, enabled: function (v) { on = !!v; if (!on) { card.className = "coachcard"; current = null; queue = []; } else next(); }, reset: function () { shown = {}; queue = []; current = null; card.className = "coachcard"; }, close: close };
  }
  root.ArduinoCoach = { attach: attach, EVENTS: EVENTS };
})(typeof window !== "undefined" ? window : globalThis);
