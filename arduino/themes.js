/* Color themes for the Arduino editor.
   Pick any of the 140 HTML color names, then a style (Dark, Light or Full color).
   Every color in the editor (background, panels, text, buttons, code colors, tips) is worked out from the one color you pick,
   and the text is always chosen so it stays easy to read. The choice is remembered on this computer. */
(function (root) {
  "use strict";
  var COLORS = ("AliceBlue F0F8FF,AntiqueWhite FAEBD7,Aqua 00FFFF,Aquamarine 7FFFD4,Azure F0FFFF,Beige F5F5DC,Bisque FFE4C4,Black 000000,BlanchedAlmond FFEBCD,Blue 0000FF,BlueViolet 8A2BE2,Brown A52A2A,BurlyWood DEB887,CadetBlue 5F9EA0,Chartreuse 7FFF00,Chocolate D2691E,Coral FF7F50,CornflowerBlue 6495ED,Cornsilk FFF8DC,Crimson DC143C,Cyan 00FFFF,DarkBlue 00008B,DarkCyan 008B8B,DarkGoldenRod B8860B,DarkGray A9A9A9,DarkGreen 006400,DarkKhaki BDB76B,DarkMagenta 8B008B,DarkOliveGreen 556B2F,DarkOrange FF8C00,DarkOrchid 9932CC,DarkRed 8B0000,DarkSalmon E9967A,DarkSeaGreen 8FBC8F,DarkSlateBlue 483D8B,DarkSlateGray 2F4F4F,DarkTurquoise 00CED1,DarkViolet 9400D3,DeepPink FF1493,DeepSkyBlue 00BFFF,DimGray 696969,DodgerBlue 1E90FF,FireBrick B22222,FloralWhite FFFAF0,ForestGreen 228B22,Fuchsia FF00FF,Gainsboro DCDCDC,GhostWhite F8F8FF,Gold FFD700,GoldenRod DAA520,Gray 808080,Green 008000,GreenYellow ADFF2F,HoneyDew F0FFF0,HotPink FF69B4,IndianRed CD5C5C,Indigo 4B0082,Ivory FFFFF0,Khaki F0E68C,Lavender E6E6FA,LavenderBlush FFF0F5,LawnGreen 7CFC00,LemonChiffon FFFACD,LightBlue ADD8E6,LightCoral F08080,LightCyan E0FFFF,LightGoldenRodYellow FAFAD2,LightGray D3D3D3,LightGreen 90EE90,LightPink FFB6C1,LightSalmon FFA07A,LightSeaGreen 20B2AA,LightSkyBlue 87CEFA,LightSlateGray 778899,LightSteelBlue B0C4DE,LightYellow FFFFE0,Lime 00FF00,LimeGreen 32CD32,Linen FAF0E6,Magenta FF00FF,Maroon 800000,MediumAquaMarine 66CDAA,MediumBlue 0000CD,MediumOrchid BA55D3,MediumPurple 9370DB,MediumSeaGreen 3CB371,MediumSlateBlue 7B68EE,MediumSpringGreen 00FA9A,MediumTurquoise 48D1CC,MediumVioletRed C71585,MidnightBlue 191970,MintCream F5FFFA,MistyRose FFE4E1,Moccasin FFE4B5,NavajoWhite FFDEAD,Navy 000080,OldLace FDF5E6,Olive 808000,OliveDrab 6B8E23,Orange FFA500,OrangeRed FF4500,Orchid DA70D6,PaleGoldenRod EEE8AA,PaleGreen 98FB98,PaleTurquoise AFEEEE,PaleVioletRed DB7093,PapayaWhip FFEFD5,PeachPuff FFDAB9,Peru CD853F,Pink FFC0CB,Plum DDA0DD,PowderBlue B0E0E6,Purple 800080,Red FF0000,RosyBrown BC8F8F,RoyalBlue 4169E1,SaddleBrown 8B4513,Salmon FA8072,SandyBrown F4A460,SeaGreen 2E8B57,SeaShell FFF5EE,Sienna A0522D,Silver C0C0C0,SkyBlue 87CEEB,SlateBlue 6A5ACD,SlateGray 708090,Snow FFFAFA,SpringGreen 00FF7F,SteelBlue 4682B4,Tan D2B48C,Teal 008080,Thistle D8BFD8,Tomato FF6347,Turquoise 40E0D0,Violet EE82EE,Wheat F5DEB3,White FFFFFF,WhiteSmoke F5F5F5,Yellow FFFF00,YellowGreen 9ACD32").split(",").map(function (x) { var p = x.split(" "); return { name: p[0], hex: "#" + p[1] }; });

  /* ---------------- color math */
  function hex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgb2hex(c) { return "#" + c.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function rgb2hsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) { s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s, l];
  }
  function hsl(h, s, l) {
    h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return rgb2hex([(r + m) * 255, (g + m) * 255, (b + m) * 255]);
  }
  function lum(hx) { var c = hex2rgb(hx).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function mix(a, b, t) { var x = hex2rgb(a), y = hex2rgb(b); return rgb2hex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  /* nudge a color lighter or darker until it reads against every background in the list */
  function ensure(fg, bgs, min, preferLight) {
    bgs = [].concat(bgs); var h = rgb2hsl(hex2rgb(fg)), l = h[2], i, ok;
    for (i = 0; i < 60; i++) {
      var c = hsl(h[0], h[1], l); ok = bgs.every(function (b) { return contrast(c, b) >= min; }); if (ok) return c;
      l += preferLight ? 0.018 : -0.018; if (l > 1 || l < 0) break;
    }
    var w = bgs.every(function (b) { return contrast("#ffffff", b) >= min; }); return w ? "#ffffff" : "#000000";
  }
  function bestOn(bg) { return contrast("#ffffff", bg) >= contrast("#000000", bg) ? "#ffffff" : "#000000"; }

  /* ---------------- build the whole palette from one color */
  function build(hex, style) {
    var hs = rgb2hsl(hex2rgb(hex)), H = hs[0], S = hs[1], L = hs[2], gray = S < 0.12, bg, v = {};
    if (style === "light") bg = hsl(H, gray ? S : Math.min(S, 0.6) * 0.75, 0.95);
    else if (style === "rich") { bg = hex; var bh = rgb2hsl(hex2rgb(bg)), up = bh[2] >= 0.5, g = 0; while (Math.max(contrast("#ffffff", bg), contrast("#000000", bg)) < 11 && g++ < 60) { bh[2] += up ? 0.015 : -0.015; bg = hsl(bh[0], bh[1], bh[2]); } }
    else bg = hsl(H, gray ? S : Math.min(S, 0.55) * 0.7, 0.085);
    var dark = contrast("#ffffff", bg) >= contrast("#000000", bg), bl = rgb2hsl(hex2rgb(bg))[2], bs = rgb2hsl(hex2rgb(bg))[1];
    var sh = function (d, k) { return hsl(H, Math.min(1, bs * (k || 1)), bl + d); };
    var rr = style === "rich" ? 0.6 : 1, panel = dark ? sh(0.04 * rr) : sh(-0.04 * rr), card = dark ? sh(0.08 * rr) : sh(-0.02), rule = dark ? sh(0.17) : sh(-0.16), deep = dark ? sh(-0.05) : sh(0.05);
    if (style === "rich" && !dark) { card = sh(0.05); deep = sh(0.07); }
    var ink = ensure(dark ? hsl(H, gray ? 0.05 : 0.25, 0.94) : hsl(H, gray ? 0.05 : 0.35, 0.1), [bg, card, deep, panel], 7, dark);
    var hi = dark ? "#ffffff" : "#000000";
    if (contrast(hi, bg) < 7) hi = bestOn(bg);
    var base = [bg, panel, card, deep];
    var soft = ensure(mix(ink, bg, 0.42), base, 4.5, dark), ink2 = ensure(mix(ink, bg, 0.15), base, 6, dark), faint = ensure(mix(ink, bg, 0.55), [bg, deep], 3.2, dark);
    /* accent: the picked hue, or its opposite on a full-color theme (so buttons stand out); grays get a classic cyan */
    var aH = gray ? 190 : style === "rich" ? H + 180 : H, aS = gray ? 0.8 : 0.85;
    var acc = ensure(hsl(aH, aS, dark ? 0.62 : 0.36), [bg, panel, card], 4.5, dark);
    var onacc = bestOn(acc), accl = ensure(hsl(aH, 0.85, dark ? 0.78 : 0.28), [deep, bg, card, mix(bg, acc, 0.1), mix(card, acc, dark ? 0.16 : 0.14)], 5.5, dark);
    var acct = mix(card, acc, dark ? 0.16 : 0.14), acct2 = mix(bg, acc, 0.1), accb = mix(bg, acc, 0.5);
    function tone(hue, name) {
      var c = ensure(hsl(hue, 0.68, dark ? 0.55 : 0.3), [bg, panel, card], 4.5, dark), t = mix(bg, hsl(hue, 0.7, 0.5), dark ? 0.16 : 0.14), l2 = ensure(hsl(hue, 0.8, dark ? 0.82 : 0.2), [t, bg], 6, dark);
      v["--" + name] = c; v["--" + name + "t"] = t; v["--" + name + "l"] = l2; v["--" + name + "b"] = mix(bg, c, 0.55); return c;
    }
    var ok = tone(150, "ok"); tone(2, "bad"); var warn = tone(42, "warn");
    v["--onok"] = bestOn(ok);
    function syn(hue, l1) { return ensure(hsl(hue, 0.75, dark ? l1 : 0.3), [deep], 4.5, dark); }
    var vars = {
      "--bg": bg, "--panel": panel, "--card": card, "--rule": rule, "--ink": ink, "--soft": soft, "--acc": acc, "--acc2": syn(30, 0.65), "--deep": deep, "--deep2": mix(deep, bg, 0.5),
      "--bg2": mix(bg, deep, 0.5), "--panel2": mix(panel, bg, 0.5), "--panel3": mix(deep, bg, 0.6), "--canvas": deep, "--chip": card, "--line2": mix(rule, bg, 0.5),
      "--dots": mix(deep, ink, 0.1), "--pop": mix(card, bg, 0.3), "--acct": acct, "--acct2": acct2, "--accb": accb, "--accl": accl, "--onacc": onacc, "--hi": hi, "--ink2": ink2,
      "--gutx": ensure(mix(ink, deep, 0.6), [deep], 3, dark), "--faint": faint,
      "--sk": syn(280, 0.75), "--st": syn(200, 0.75), "--sf": syn(28, 0.72), "--sc": faint, "--ss": syn(140, 0.72), "--sn": syn(48, 0.72), "--sq": syn(330, 0.75)
    };
    Object.keys(v).forEach(function (k) { vars[k] = v[k]; });
    vars["--warn"] = warn; vars._dark = dark;
    return vars;
  }

  /* ---------------- apply, remember */
  var KEY = "ard:theme", cur = null;
  function apply(name, style) {
    var de = document.documentElement, i, c = null;
    if (!name || name === "default") { clear(); cur = null; try { localStorage.removeItem(KEY); } catch (e) { } return; }
    for (i = 0; i < COLORS.length; i++) if (COLORS[i].name === name) c = COLORS[i];
    if (!c) { clear(); return; }
    var p = build(c.hex, style);
    Object.keys(p).forEach(function (k) { if (k.charAt(0) === "-") de.style.setProperty(k, p[k]); });
    de.style.colorScheme = p._dark ? "dark" : "light"; de.setAttribute("data-theme", name + "-" + style);
    cur = { name: name, style: style }; try { localStorage.setItem(KEY, name + "|" + style); } catch (e) { }
  }
  function clear() {
    var de = document.documentElement, st = de.style, rm = [], i; for (i = 0; i < st.length; i++) if (st[i].indexOf("--") === 0) rm.push(st[i]);
    rm.forEach(function (k) { st.removeProperty(k); }); st.colorScheme = ""; de.removeAttribute("data-theme");
  }
  try { var saved = localStorage.getItem(KEY); if (saved) { var sp = saved.split("|"); apply(sp[0], sp[1] || "dark"); } } catch (e) { }

  /* ---------------- the picker window */
  function ui() {
    var btn = document.getElementById("themeBtn"); if (!btn) return;
    var css = document.createElement("style");
    css.textContent = "#themeModal .box{max-width:760px}#themeModal h3{margin:0 0 4px;font-size:16px}#themeModal p.sub{margin:0 0 10px;color:var(--soft);font-size:12.5px}" +
      ".thbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}.thstyle{display:inline-flex;border:1px solid var(--rule);border-radius:8px;overflow:hidden}" +
      ".thstyle button{background:var(--card);color:var(--ink);border:0;border-right:1px solid var(--rule);padding:5px 12px;font:700 12px Manrope,sans-serif;cursor:pointer}.thstyle button:last-child{border-right:0}" +
      ".thstyle button.on{background:var(--acc);color:var(--onacc)}#thSearch{flex:1;min-width:140px;background:var(--deep);color:var(--ink);border:1px solid var(--rule);border-radius:8px;padding:6px 10px;font:13px Manrope,sans-serif}" +
      "#thGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));gap:6px;max-height:46vh;overflow:auto;padding:2px}" +
      ".thsw{border:2px solid transparent;border-radius:9px;padding:0;cursor:pointer;text-align:left;overflow:hidden;font:700 11px Manrope,sans-serif}.thsw:hover{border-color:var(--acc)}.thsw.on{border-color:var(--hi);box-shadow:0 0 0 2px var(--acc)}" +
      ".thsw span{display:block;padding:7px 8px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.thsw i{display:block;height:7px;margin:3px 8px 8px;border-radius:4px}";
    document.head.appendChild(css);
    var m = document.createElement("div"); m.className = "modal"; m.id = "themeModal";
    m.innerHTML = '<div class="box" role="dialog" aria-label="Color themes"><h3>&#127912; Color themes</h3><p class="sub">Pick a color and a style. The background, buttons, text and code colors all change to match, and the text always stays easy to read.</p>' +
      '<div class="thbar"><div class="thstyle" id="thStyle"><button data-s="dark">Dark</button><button data-s="light">Light</button><button data-s="rich">Full color</button></div><input id="thSearch" type="search" placeholder="Search 140 colors..." aria-label="Search colors"><button class="btn" id="thDefault">Original theme</button></div>' +
      '<div id="thGrid"></div><div class="row"><button class="btn" id="thClose">Done</button></div></div>';
    document.body.appendChild(m);
    var style = (cur && cur.style) || "dark", grid = document.getElementById("thGrid");
    function draw() {
      var q = (document.getElementById("thSearch").value || "").toLowerCase().replace(/\s/g, "");
      grid.innerHTML = COLORS.filter(function (c) { return !q || c.name.toLowerCase().indexOf(q) > -1; }).map(function (c) {
        var p = build(c.hex, style), on = cur && cur.name === c.name && cur.style === style;
        return '<button class="thsw' + (on ? " on" : "") + '" data-n="' + c.name + '" style="background:' + p["--bg"] + ';color:' + p["--ink"] + '" title="' + c.name + '"><span>' + c.name + '</span><i style="background:' + p["--acc"] + '"></i></button>';
      }).join("") || '<p class="sub">No color has that name.</p>';
      Array.prototype.forEach.call(document.querySelectorAll("#thStyle button"), function (b) { b.className = b.getAttribute("data-s") === style ? "on" : ""; });
    }
    function open() { style = (cur && cur.style) || style; draw(); m.className = "modal show"; }
    btn.onclick = open; document.getElementById("thClose").onclick = function () { m.className = "modal"; };
    m.addEventListener("click", function (e) { if (e.target === m) m.className = "modal"; });
    document.getElementById("thStyle").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; style = b.getAttribute("data-s"); if (cur) apply(cur.name, style); draw(); };
    document.getElementById("thSearch").oninput = draw;
    document.getElementById("thDefault").onclick = function () { apply("default"); draw(); };
    grid.onclick = function (e) { var b = e.target.closest(".thsw"); if (!b) return; apply(b.getAttribute("data-n"), style); draw(); };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ui); else ui();
  root.ArduinoThemes = { COLORS: COLORS, build: build, apply: apply, contrast: contrast };
})(typeof window !== "undefined" ? window : this);
