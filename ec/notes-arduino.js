/* Reusable Arduino demo widgets for the notes pages. Used through the "ard" block: ["ard", "blink", {...}] */
(function () {
  "use strict";
  var A = (window.ARD = {});
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var K = /\b(int|void|const|byte|boolean|long|float|if|else|for|while|return|true|false|HIGH|LOW|OUTPUT|INPUT|INPUT_PULLUP)\b/g, F = /\b(pinMode|digitalWrite|digitalRead|analogWrite|analogRead|delay|millis|map|Serial|begin|print|println|setup|loop|attach|write|pulseIn|tone|noTone)\b(?=[.(])/g;
  function hl(line) { return esc(line).replace(/(\/\/.*)$/, '<span class="cm">$1</span>').replace(K, '<span class="kw">$1</span>').replace(F, '<span class="fn">$1</span>'); }
  function codeLines(lines) { var d = h("div", "lines"); lines.forEach(function (l) { var r = h("div", "ln"); r.innerHTML = "<span>" + (hl(l) || "&nbsp;") + "</span>"; d.appendChild(r); }); return d; }
  function led(color, id) { return '<svg viewBox="0 0 120 150" width="120" role="img" aria-label="LED"><circle id="' + id + 'g" cx="60" cy="58" r="46" fill="' + color + '" opacity="0"/><path d="M38 100 V60 a22 22 0 0 1 44 0 V100 Z" id="' + id + 'b" fill="#4B1D1D" stroke="#94A3B8" stroke-width="3"/><path d="M48 100 V140 M72 100 V128" stroke="#94A3B8" stroke-width="4"/></svg>'; }
  function setLed(root, id, color, lvl) { root.querySelector("#" + id + "b").setAttribute("fill", lvl > 0.02 ? color : "#4B1D1D"); root.querySelector("#" + id + "b").setAttribute("fill-opacity", lvl > 0.02 ? (0.35 + 0.65 * lvl) : 1); root.querySelector("#" + id + "g").setAttribute("opacity", lvl * 0.45); }

  /* Blink: digitalWrite + delay with adjustable delays */
  A.blink = function (root, o) {
    o = o || {}; var pin = o.pin || 13, onMs = o.on || 1000, offMs = o.off || 1000, id = "bl" + Math.random().toString(36).slice(2, 6);
    root.innerHTML = '<div class="trace"><div class="lines" id="' + id + 'c"></div><div class="stage">' + led("#EF4444", id) + '<div class="state" id="' + id + 's">LED off</div></div></div>' +
      '<div class="wrow" style="margin-top:12px"><label>first delay(): <b id="' + id + 'a"></b> ms</label><input type="range" id="' + id + 'i1" min="100" max="2000" step="100" value="' + onMs + '" style="max-width:260px"></div>' +
      '<div class="wrow"><label>second delay(): <b id="' + id + 'b2"></b> ms</label><input type="range" id="' + id + 'i2" min="100" max="2000" step="100" value="' + offMs + '" style="max-width:260px"></div>';
    var lines = ["void setup() {", "  pinMode(" + pin + ", OUTPUT);", "}", "", "void loop() {", "  digitalWrite(" + pin + ", HIGH);", "  delay(" + onMs + ");", "  digitalWrite(" + pin + ", LOW);", "  delay(" + offMs + ");", "}"];
    var box = root.querySelector("#" + id + "c"), rows;
    function paint() { lines[6] = "  delay(" + root.querySelector("#" + id + "i1").value + ");"; lines[8] = "  delay(" + root.querySelector("#" + id + "i2").value + ");"; box.innerHTML = ""; var cl = codeLines(lines); while (cl.firstChild) box.appendChild(cl.firstChild); rows = box.querySelectorAll(".ln"); root.querySelector("#" + id + "a").textContent = root.querySelector("#" + id + "i1").value; root.querySelector("#" + id + "b2").textContent = root.querySelector("#" + id + "i2").value; }
    paint(); root.querySelector("#" + id + "i1").oninput = paint; root.querySelector("#" + id + "i2").oninput = paint;
    var phase = 0, t0 = Date.now(), timer = setInterval(function () {
      if (!document.body.contains(root)) { clearInterval(timer); return; }
      var d1 = +root.querySelector("#" + id + "i1").value, d2 = +root.querySelector("#" + id + "i2").value, t = (Date.now() - t0) % (d1 + d2), on = t < d1;
      setLed(root, id, "#EF4444", on ? 1 : 0); root.querySelector("#" + id + "s").textContent = on ? "pin " + pin + " is HIGH: LED on" : "pin " + pin + " is LOW: LED off";
      [].forEach.call(rows, function (r, i) { r.classList.toggle("run", on ? i === 6 : i === 8); });
    }, 60);
  };

  /* PWM: analogWrite brightness and duty cycle */
  A.pwm = function (root, o) {
    o = o || {}; var pin = o.pin || 9, id = "pw" + Math.random().toString(36).slice(2, 6);
    root.innerHTML = '<div class="trace"><div><div class="code" id="' + id + 'k" style="margin:0"></div><div class="wrow" style="margin-top:12px"><label>value</label><input type="range" id="' + id + 'i" min="0" max="255" step="5" value="128" style="max-width:300px"></div></div><div class="stage">' + led("#FBBF24", id) + '<div class="state" id="' + id + 's"></div></div></div><div class="fig" style="margin-top:12px"><svg viewBox="0 0 560 110" id="' + id + 'w" role="img" aria-label="PWM signal"></svg><p class="cap">The pin switches on and off very fast. The longer it stays on in each cycle, the brighter the LED looks.</p></div>';
    function up() {
      var v = +root.querySelector("#" + id + "i").value, d = v / 255, w = d * 120, s = "";
      root.querySelector("#" + id + "k").innerHTML = hl("analogWrite(" + pin + ", " + v + ");");
      root.querySelector("#" + id + "s").textContent = "duty cycle " + Math.round(d * 100) + "%";
      setLed(root, id, "#FBBF24", d);
      for (var i = 0; i < 4; i++) { var x = 20 + i * 135; s += '<path d="M' + x + " 90 V30 H" + (x + w) + " V90 H" + (x + 125) + '" fill="none" stroke="#5FD8DF" stroke-width="3"/>'; }
      root.querySelector("#" + id + "w").innerHTML = s + '<text x="20" y="108" font-size="11" fill="#8B9AAE">HIGH</text>';
    }
    root.querySelector("#" + id + "i").oninput = up; up();
  };

  /* map(): a dial rescaled into another range */
  A.map = function (root, o) {
    o = o || {}; var inL = o.inLow == null ? 0 : o.inLow, inH = o.inHigh == null ? 1023 : o.inHigh, outL = o.outLow == null ? 0 : o.outLow, outH = o.outHigh == null ? 255 : o.outHigh, id = "mp" + Math.random().toString(36).slice(2, 6), lab = o.out || "analogWrite(9, brightness)";
    root.innerHTML = '<div class="trace"><div><div class="wrow"><label>Turn the dial</label><input type="range" id="' + id + 'i" min="' + inL + '" max="' + inH + '" step="1" value="' + Math.round((inL + inH) / 2) + '" style="max-width:300px"></div><div class="wout" id="' + id + 'o"></div></div><div class="stage"><svg viewBox="0 0 160 160" width="150" role="img" aria-label="potentiometer"><circle cx="80" cy="80" r="56" fill="#1F2937" stroke="#94A3B8" stroke-width="3"/><g id="' + id + 'k"><rect x="76" y="30" width="8" height="42" rx="4" fill="#FDD877"/></g></svg><div class="state" id="' + id + 's"></div></div></div>' +
      '<div class="fig" style="margin-top:12px"><svg viewBox="0 0 560 90" id="' + id + 'b" role="img" aria-label="bars comparing input and output"></svg></div>';
    function up() {
      var v = +root.querySelector("#" + id + "i").value, m = Math.floor((v - inL) * (outH - outL) / (inH - inL) + outL), fi = (v - inL) / (inH - inL), fo = (m - outL) / (outH - outL || 1);
      root.querySelector("#" + id + "o").innerHTML = "int reading = analogRead(A0);  // " + v + "<br>int out = map(reading, " + inL + ", " + inH + ", " + outL + ", " + outH + ");  // " + m;
      root.querySelector("#" + id + "s").textContent = lab.replace(/brightness|out/, m);
      root.querySelector("#" + id + "k").setAttribute("transform", "rotate(" + (-135 + fi * 270) + " 80 80)");
      root.querySelector("#" + id + "b").innerHTML = '<text x="0" y="16" font-size="12" fill="#8B9AAE">reading ' + inL + " to " + inH + '</text><rect x="0" y="22" width="540" height="16" rx="4" fill="#10141C" stroke="#3A4658"/><rect x="0" y="22" width="' + (540 * fi) + '" height="16" rx="4" fill="#5FD8DF"/><text x="0" y="62" font-size="12" fill="#8B9AAE">output ' + outL + " to " + outH + '</text><rect x="0" y="68" width="540" height="16" rx="4" fill="#10141C" stroke="#3A4658"/><rect x="0" y="68" width="' + (540 * fo) + '" height="16" rx="4" fill="#FDD877"/>';
    }
    root.querySelector("#" + id + "i").oninput = up; up();
  };

  /* Serial Monitor: print vs println */
  A.serial = function (root, o) {
    var id = "sr" + Math.random().toString(36).slice(2, 6), variants = o && o.variants || [["println only", ["Serial.println(reading);"]], ["print + println", ["Serial.print(\"Reading: \");", "Serial.println(reading);"]], ["print only", ["Serial.print(reading);", "Serial.print(\" \");"]]], cur = 0, val = 512, out = "";
    root.innerHTML = '<div class="chips2" id="' + id + 'c"></div><div class="trace"><div class="lines" id="' + id + 'k"></div><div class="side"><h4>Serial Monitor</h4><div class="console" id="' + id + 'o" style="margin-top:0;min-height:130px"></div></div></div><div class="btns" style="justify-content:flex-start"><button class="btn on" type="button" id="' + id + 'r">Run loop() once</button><button class="btn" type="button" id="' + id + 'x">Clear</button></div>';
    var chips = root.querySelector("#" + id + "c");
    variants.forEach(function (v, i) { var b = h("button", "chip" + (i === 0 ? " on" : ""), v[0]); b.type = "button"; b.onclick = function () { cur = i; out = ""; [].forEach.call(chips.children, function (c, k) { c.classList.toggle("on", k === i); }); draw(); }; chips.appendChild(b); });
    function draw() { var lines = ["void loop() {", "  int reading = analogRead(A0);"].concat(variants[cur][1].map(function (l) { return "  " + l; })).concat(["  delay(500);", "}"]); var k = root.querySelector("#" + id + "k"); k.innerHTML = ""; var cl = codeLines(lines); while (cl.firstChild) k.appendChild(cl.firstChild); root.querySelector("#" + id + "o").textContent = out; }
    root.querySelector("#" + id + "r").onclick = function () { val = (val + 137) % 1024; variants[cur][1].forEach(function (l) { var m = l.match(/Serial\.(print|println)\((.*)\);/); var a = m[2].replace(/reading/, val), isStr = /^".*"$/.test(a); out += (isStr ? a.slice(1, -1) : a) + (m[1] === "println" ? "\n" : ""); }); root.querySelector("#" + id + "o").textContent = out; };
    root.querySelector("#" + id + "x").onclick = function () { out = ""; draw(); };
    draw();
  };
})();
