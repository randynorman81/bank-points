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

/* More Arduino demos: servo, button, ultrasonic, motor, temperature */
(function () {
  "use strict";
  var A = window.ARD;
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var K = /\b(int|void|const|byte|boolean|long|float|if|else|for|while|return|true|false|HIGH|LOW|OUTPUT|INPUT|INPUT_PULLUP)\b/g, F = /\b(pinMode|digitalWrite|digitalRead|analogWrite|analogRead|delay|millis|map|Serial|begin|print|println|setup|loop|attach|write|pulseIn|tone|noTone|include)\b(?=[.(<])/g;
  function hl(line) { return esc(line).replace(/(\/\/.*)$/, '<span class="cm">$1</span>').replace(K, '<span class="kw">$1</span>').replace(F, '<span class="fn">$1</span>'); }
  function codeBox(el, lines) { el.innerHTML = ""; lines.forEach(function (l) { var r = h("div", "ln"); r.innerHTML = "<span>" + (hl(l) || "&nbsp;") + "</span>"; el.appendChild(r); }); return el.querySelectorAll(".ln"); }
  function uid(p) { return p + Math.random().toString(36).slice(2, 6); }

  A.servo = function (root, o) {
    var id = uid("sv"), step = 30, ang = 90, rows, timer = null;
    root.innerHTML = '<div class="trace"><div class="lines" id="' + id + 'k"></div><div class="stage"><svg viewBox="0 0 220 130" width="240" role="img" aria-label="servo motor with a horn"><path d="M55 70 A55 55 0 0 1 165 70" fill="none" stroke="#3A4658" stroke-dasharray="4 4"/><text x="40" y="82" font-size="11" fill="#8B9AAE">0</text><text x="162" y="82" font-size="11" fill="#8B9AAE">180</text><rect x="45" y="72" width="130" height="50" rx="6" fill="#151A24" stroke="#5FD8DF" stroke-width="2"/><line id="' + id + 'h" x1="110" y1="72" x2="110" y2="17" stroke="#FDD877" stroke-width="7" stroke-linecap="round"/><circle cx="110" cy="72" r="9" fill="#05070B" stroke="#FDD877" stroke-width="3"/></svg><div class="state" id="' + id + 's"></div></div></div>' +
      '<div class="wrow" style="margin-top:12px"><label>myServo.write( <b id="' + id + 'v"></b> )</label><input type="range" id="' + id + 'a" min="0" max="180" step="5" value="90" style="max-width:260px"></div><div class="wrow"><label>sweep step <b id="' + id + 'tv"></b></label><input type="range" id="' + id + 'st" min="10" max="90" step="10" value="30" style="max-width:200px"><button class="btn on" type="button" id="' + id + 'r">Run the for loop</button></div>';
    function draw() { var lines = ["#include <Servo.h>", "Servo myServo;", "", "void setup() {", "  myServo.attach(9);", "}", "", "void loop() {", "  for (int angle = 0; angle <= 180; angle += " + step + ") {", "    myServo.write(angle);", "    delay(300);", "  }", "}"]; rows = codeBox(root.querySelector("#" + id + "k"), lines); root.querySelector("#" + id + "tv").textContent = step; }
    function setAng(a) { ang = a; var r = a * Math.PI / 180; var hn = root.querySelector("#" + id + "h"); hn.setAttribute("x2", 110 - 55 * Math.cos(r)); hn.setAttribute("y2", 72 - 55 * Math.sin(r)); root.querySelector("#" + id + "s").textContent = "angle = " + a + " degrees"; root.querySelector("#" + id + "v").textContent = a; root.querySelector("#" + id + "a").value = a; }
    root.querySelector("#" + id + "a").oninput = function () { setAng(+this.value); };
    root.querySelector("#" + id + "st").oninput = function () { step = +this.value; draw(); };
    root.querySelector("#" + id + "r").onclick = function () { if (timer) clearInterval(timer); var a = 0; timer = setInterval(function () { if (!document.body.contains(root) || a > 180) { clearInterval(timer); timer = null; [].forEach.call(rows, function (r) { r.classList.remove("run"); }); return; } setAng(a); [].forEach.call(rows, function (r, i) { r.classList.toggle("run", i === 9); }); a += step; }, 300); };
    draw(); setAng(90);
  };

  A.button = function (root, o) {
    var id = uid("bt"), pressed = false, rows;
    root.innerHTML = '<div class="trace"><div class="lines" id="' + id + 'k"></div><div class="stage"><svg viewBox="0 0 220 150" width="220" role="img" aria-label="pushbutton and LED"><circle id="' + id + 'g" cx="165" cy="52" r="34" fill="#EF4444" opacity="0"/><circle id="' + id + 'l" cx="165" cy="52" r="20" fill="#4B1D1D" stroke="#94A3B8" stroke-width="3"/><text x="165" y="96" font-size="11" fill="#8B9AAE" text-anchor="middle">LED pin 13</text><rect id="' + id + 'b" x="25" y="35" width="70" height="36" rx="8" fill="#1F2937" stroke="#5FD8DF" stroke-width="3" style="cursor:pointer"/><text x="60" y="58" font-size="12" fill="#EAEFF6" text-anchor="middle" pointer-events="none">PRESS</text><text x="60" y="96" font-size="11" fill="#8B9AAE" text-anchor="middle">button on pin 2</text></svg><div class="state" id="' + id + 's"></div></div></div><div class="btns" style="justify-content:flex-start"><button class="btn" type="button" id="' + id + 't">Toggle press</button><span class="small">Or press and hold the button in the picture.</span></div>';
    var lines = ["void setup() {", "  pinMode(2, INPUT_PULLUP);", "  pinMode(13, OUTPUT);", "}", "", "void loop() {", "  int state = digitalRead(2);", "  if (state == LOW) {", "    digitalWrite(13, HIGH);", "  } else {", "    digitalWrite(13, LOW);", "  }", "}"];
    rows = codeBox(root.querySelector("#" + id + "k"), lines);
    function up() { var low = pressed; root.querySelector("#" + id + "l").setAttribute("fill", low ? "#EF4444" : "#4B1D1D"); root.querySelector("#" + id + "g").setAttribute("opacity", low ? ".35" : "0"); root.querySelector("#" + id + "b").setAttribute("fill", low ? "#5FD8DF" : "#1F2937"); root.querySelector("#" + id + "s").textContent = "digitalRead(2) = " + (low ? "LOW (pressed)" : "HIGH (not pressed)"); [].forEach.call(rows, function (r, i) { r.classList.toggle("run", low ? i === 8 : i === 10); }); }
    var b = root.querySelector("#" + id + "b"); b.onpointerdown = function () { pressed = true; up(); }; b.onpointerup = b.onpointerleave = function () { pressed = false; up(); };
    root.querySelector("#" + id + "t").onclick = function () { pressed = !pressed; up(); }; up();
  };

  A.ultra = function (root, o) {
    var id = uid("us");
    root.innerHTML = '<div class="fig" style="margin:0"><svg viewBox="0 0 560 130" id="' + id + 'v" role="img" aria-label="ultrasonic sensor and obstacle"></svg></div><div class="wrow"><label>obstacle distance <b id="' + id + 'dv"></b> cm</label><input type="range" id="' + id + 'd" min="2" max="200" value="60" style="max-width:260px"></div><div class="wrow"><label>stop if closer than <b id="' + id + 'tv"></b> cm</label><input type="range" id="' + id + 't" min="5" max="100" value="30" style="max-width:260px"></div><div class="wout" id="' + id + 'o"></div>';
    function up() { var d = +root.querySelector("#" + id + "d").value, th = +root.querySelector("#" + id + "t").value, dur = d * 58, stop = d < th, x = 70 + d * 2.2, s = "";
      s += '<rect x="10" y="40" width="50" height="50" rx="6" fill="#151A24" stroke="#5FD8DF" stroke-width="2"/><circle cx="26" cy="65" r="9" fill="#05070B" stroke="#8B9AAE"/><circle cx="46" cy="65" r="9" fill="#05070B" stroke="#8B9AAE"/>';
      for (var k = 1; k <= 3; k++) s += '<path d="M' + (62 + k * 26) + " " + (65 - k * 12) + " Q" + (72 + k * 26) + " 65 " + (62 + k * 26) + " " + (65 + k * 12) + '" fill="none" stroke="#5FD8DF" stroke-opacity="' + (0.9 - k * 0.2) + '" stroke-width="2"/>';
      s += '<rect x="' + x + '" y="30" width="16" height="70" rx="3" fill="' + (stop ? "#EF4444" : "#FDD877") + '"/><path d="M' + (70 + th * 2.2) + ' 20 V110" stroke="#FCA5A5" stroke-dasharray="4 3"/><text x="' + (70 + th * 2.2) + '" y="14" font-size="11" fill="#FCA5A5" text-anchor="middle">stop line</text>';
      root.querySelector("#" + id + "v").innerHTML = s; root.querySelector("#" + id + "dv").textContent = d; root.querySelector("#" + id + "tv").textContent = th;
      root.querySelector("#" + id + "o").innerHTML = "long duration = pulseIn(echoPin, HIGH);  // " + dur + " microseconds<br>int distance = duration / 58;       // " + d + " cm<br>if (distance < " + th + ") { stopMotor(); }  // <b>" + (stop ? "TRUE: stop" : "FALSE: keep going") + "</b>"; }
    root.querySelector("#" + id + "d").oninput = up; root.querySelector("#" + id + "t").oninput = up; up();
  };

  A.motor = function (root, o) {
    var id = uid("mt"), dir = 1, spd = 150, rot = 0, raf = null;
    root.innerHTML = '<div class="trace"><div><div class="chips2" id="' + id + 'c"></div><div class="wrow"><label>enable pin: analogWrite( <b id="' + id + 'sv"></b> )</label></div><input type="range" id="' + id + 's" min="0" max="255" value="150" style="max-width:300px"><div class="tblwrap" style="margin-top:12px"><table><tr><th>in1</th><th>in2</th><th>enable</th><th>motor</th></tr><tr><td id="' + id + 't1"></td><td id="' + id + 't2"></td><td id="' + id + 't3"></td><td id="' + id + 't4"></td></tr></table></div></div><div class="stage"><svg viewBox="0 0 160 160" width="170" role="img" aria-label="DC motor spinning"><circle cx="80" cy="80" r="62" fill="#151A24" stroke="#5FD8DF" stroke-width="3"/><g id="' + id + 'r"><rect x="76" y="26" width="8" height="54" rx="4" fill="#FDD877"/><rect x="76" y="80" width="8" height="54" rx="4" fill="#3A4658"/></g><circle cx="80" cy="80" r="8" fill="#05070B"/></svg><div class="state" id="' + id + 'st"></div></div></div>';
    var modes = [["Forward", 1], ["Reverse", -1], ["Stop", 0]], cur = 0, box = root.querySelector("#" + id + "c");
    modes.forEach(function (m, i) { var b = h("button", "chip" + (i === 0 ? " on" : ""), m[0]); b.type = "button"; b.onclick = function () { cur = i; dir = m[1]; [].forEach.call(box.children, function (c, k) { c.classList.toggle("on", k === i); }); up(); }; box.appendChild(b); });
    function up() { spd = +root.querySelector("#" + id + "s").value; root.querySelector("#" + id + "sv").textContent = spd; var a = dir === 1 ? "HIGH" : "LOW", b = dir === -1 ? "HIGH" : "LOW", on = dir !== 0 && spd > 0; root.querySelector("#" + id + "t1").textContent = dir === 0 ? "LOW" : a; root.querySelector("#" + id + "t2").textContent = dir === 0 ? "LOW" : b; root.querySelector("#" + id + "t3").textContent = spd; root.querySelector("#" + id + "t4").textContent = on ? (dir === 1 ? "forward" : "reverse") + " at " + Math.round(spd / 255 * 100) + "%" : "stopped"; root.querySelector("#" + id + "st").textContent = on ? (dir === 1 ? "spinning forward" : "spinning in reverse") : "stopped"; }
    function frame() { if (!document.body.contains(root)) return; rot += dir * spd / 255 * 12; root.querySelector("#" + id + "r").setAttribute("transform", "rotate(" + rot + " 80 80)"); raf = requestAnimationFrame(frame); }
    root.querySelector("#" + id + "s").oninput = up; up(); frame();
  };

  A.temp = function (root, o) {
    var id = uid("tp");
    root.innerHTML = '<div class="trace"><div><div class="wrow"><label>analogRead(A0) = <b id="' + id + 'rv"></b></label></div><input type="range" id="' + id + 'r" min="100" max="400" value="170" style="max-width:300px"><div class="wout" id="' + id + 'o"></div></div><div class="stage"><svg viewBox="0 0 80 190" width="90" role="img" aria-label="thermometer"><rect x="30" y="10" width="20" height="130" rx="10" fill="#10141C" stroke="#8B9AAE" stroke-width="2"/><rect id="' + id + 'f" x="34" y="100" width="12" height="40" rx="6" fill="#EF4444"/><circle cx="40" cy="152" r="22" fill="#EF4444" stroke="#8B9AAE" stroke-width="2"/></svg><div class="state" id="' + id + 's"></div></div></div>';
    function up() { var r = +root.querySelector("#" + id + "r").value, v = r * 5 / 1024, c = (v - 0.5) * 100, f = c * 9 / 5 + 32, fh = Math.max(4, Math.min(120, (c + 10) / 60 * 120));
      root.querySelector("#" + id + "rv").textContent = r; root.querySelector("#" + id + "f").setAttribute("y", 140 - fh); root.querySelector("#" + id + "f").setAttribute("height", fh); root.querySelector("#" + id + "s").textContent = c.toFixed(1) + " C";
      root.querySelector("#" + id + "o").innerHTML = "float voltage = reading * 5.0 / 1024;  // " + v.toFixed(3) + " V<br>float tempC = (voltage - 0.5) * 100;  // " + c.toFixed(1) + " C<br>float tempF = tempC * 9.0 / 5.0 + 32;  // " + f.toFixed(1) + " F"; }
    root.querySelector("#" + id + "r").oninput = up; up();
  };
})();
