"""Study-guide engine: components, the notes-page converter, and the book assembler. See build.py for the renderer."""
import base64, html as _h, json, os, re, random, sys
from bs4 import BeautifulSoup, NavigableString

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "notes"))
PAL = ["#2563EB", "#059669", "#D97706", "#DB2777", "#7C3AED", "#EA580C"]
SITE = "schscomputerscience.com"


def esc(s):
    return _h.escape(str(s), quote=True)


def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()


# ============================================================================ code coloring
KW = set("def return if elif else for while in not and or import from as True False None break continue pass try except class lambda is del global with yield".split())
BI = set("print input len range int float str list append remove insert sorted max min abs round format ord chr sum bool type enumerate zip open random randint math sqrt pow split join strip lower upper replace count find index startswith endswith isdigit isalpha isupper islower".split())
PSEUDO = set("IF ELSE REPEAT TIMES UNTIL FOR EACH IN PROCEDURE RETURN DISPLAY INPUT MOD AND OR NOT APPEND INSERT REMOVE LENGTH RANDOM true false".split())
TOK = re.compile(r"""(?P<cm>\#[^\n]*)|(?P<str>[fF]?"(?:\\.|[^"\\\n])*"|[fF]?'(?:\\.|[^'\\\n])*')|(?P<num>\b\d+(?:\.\d+)?\b)|(?P<id>[A-Za-z_][A-Za-z_0-9]*)|(?P<ws>\s+)|(?P<op>.)""", re.S)


LANG = "py"   # "html" switches the code coloring to HTML (used by the IST guide)
HTML_PART = re.compile(r"<!--.*?-->|<[^<>]*>|[^<]+", re.S)
HTML_IN = re.compile(r"""(?P<str>"[^"]*"|'[^']*')|(?P<nm>[A-Za-z_:][-A-Za-z0-9_:.]*)(?=\s*=)|(?P<op>[=/!<>])|(?P<ws>\s+)|(?P<id>[^\s=/<>"']+)""")


def html_tokens(code):
    for m in HTML_PART.finditer(code):
        t = m.group()
        if t.startswith("<!--"): yield "cm", t
        elif t.startswith("<"):
            first = True
            for k in HTML_IN.finditer(t):
                g = k.lastgroup; x = k.group()
                if g == "str": yield "str", x
                elif g == "nm": yield "bi", x
                elif g == "ws": yield None, x
                elif g == "id": yield ("kw" if first or x.lower() == "doctype" else "bi"), x; first = False
                else: yield "kw", x
        else: yield None, t


def tokens(code):
    if LANG == "html":
        yield from html_tokens(code); return
    prev_def = False
    for m in TOK.finditer(code):
        k = m.lastgroup; t = m.group()
        if k == "id":
            cls = "kw" if (t in KW or t in PSEUDO) else ("fn" if prev_def else ("bi" if t in BI else None))
            prev_def = (t == "def")
            yield cls, t
        else:
            if k != "ws": prev_def = False
            yield {"cm": "cm", "str": "str", "num": "num", "op": "op"}.get(k), t


def hl_html(code):
    return "".join('<span class="tk-%s">%s</span>' % (c, esc(t)) if c else esc(t) for c, t in tokens(code))


TKFILL = {"kw": "#7C3AED", "bi": "#0D9488", "str": "#B45309", "num": "#C2410C", "cm": "#6B7280", "fn": "#2563EB", "op": "#475569"}


def hl_svg(code):
    out = ""
    for c, t in tokens(code):
        t = esc(t)
        if c:
            extra = ' font-weight="700"' if c in ("kw", "fn") else (' font-style="italic"' if c == "cm" else "")
            out += '<tspan fill="%s"%s>%s</tspan>' % (TKFILL[c], extra, t)
        else:
            out += '<tspan fill="#0F172A">%s</tspan>' % t
    return out


def code_block(code):
    return '<pre class="code">%s</pre>' % hl_html(code)


# ============================================================================ svg helpers
def wrap(text, n):
    words = str(text).split(); lines = []; cur = ""
    for w in words:
        if len(cur) + len(w) + (1 if cur else 0) > n and cur:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w) if cur else w
    if cur: lines.append(cur)
    return lines


def markers():
    return "".join('<marker id="am%s" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="%s"/></marker>' % (c[1:], c) for c in PAL)


def annot_code(title, code, notes, output=None, caption=None, lang="Python"):
    """Code on the left, caption boxes on the right, curved arrows from each caption to the exact piece of code it explains.
    notes = [(line_index, "fragment", "caption text"), ...]  (fragment must occur in that line)"""
    lines = code.strip("\n").split("\n")
    cw, lh, fs, W, top = 7.8, 25, 13, 680, 46
    maxc = max(len(l) for l in lines)
    limit = 40
    if lang == "HTML": cw, fs, limit = 6.6, 11.0, 56      # HTML lines are longer: a smaller code font keeps the arrows room
    assert maxc <= limit, "code line too long for annot_code: %r" % max(lines, key=len)
    code_w = maxc * cw + 40
    cap_x = max(code_w + 70, 340); cap_w = W - cap_x - 14
    wrap_n = max(18, int(cap_w / 6.55))
    x0 = 20
    body = ""
    # panel
    boxes = []; y_prev_bottom = top - 4
    for i, (li, frag, text) in enumerate(notes):
        color = PAL[i % len(PAL)]
        line = lines[li]; col = line.find(frag)
        assert col >= 0, "fragment %r not in line %r" % (frag, line)
        tl = wrap(text, wrap_n); bh = 14.5 * len(tl) + 13
        cy = top + li * lh + lh / 2
        ty = max(cy - bh / 2, y_prev_bottom + 9)
        boxes.append(dict(color=color, li=li, col=col, frag=frag, tl=tl, bh=bh, ty=ty, cy=cy))
        y_prev_bottom = ty + bh
    code_bottom = top + len(lines) * lh + 8
    out_h = 0
    if output:
        out_h = 26 + 17 * len(output)
    H = max(code_bottom + out_h, y_prev_bottom) + 20
    body += '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.4"/>' % (W - 4, H - 4)
    body += '<path d="M2 11 A9 9 0 0 1 11 2 H%d A9 9 0 0 1 %d 11 V34 H2 Z" fill="#F1F5F9"/>' % (W - 11, W - 2)
    body += '<rect x="2" y="33" width="%d" height="1" fill="#CBD5E1"/>' % (W - 4)
    body += '<rect x="16" y="11" width="%d" height="15" rx="3" fill="#0F172A"/><text x="%d" y="22" font-size="8.6" font-weight="800" letter-spacing="1.2" fill="#fff" text-anchor="middle">%s</text>' % (len(lang) * 7 + 14, 16 + (len(lang) * 7 + 14) / 2, esc(lang.upper()))
    body += '<text x="%d" y="23" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (16 + len(lang) * 7 + 26, esc(title))
    body += '<rect x="12" y="%d" width="%d" height="%d" rx="6" fill="#FBFCFE" stroke="#E2E8F0"/>' % (top - 6, code_w, len(lines) * lh + 14)
    # highlights + arrows first (under text)
    for b in boxes:
        x = x0 + b["col"] * cw; w = len(b["frag"]) * cw
        y = top + b["li"] * lh + 3
        body += '<rect x="%.1f" y="%.1f" width="%.1f" height="%d" rx="3" fill="%s" fill-opacity=".16"/>' % (x - 2, y, w + 4, lh - 6, b["color"])
        body += '<rect x="%.1f" y="%.1f" width="%.1f" height="2.4" rx="1.2" fill="%s"/>' % (x - 2, y + lh - 8.4, w + 4, b["color"])
        ex = x + w + 3; ey = b["cy"]; sx = cap_x; sy = b["ty"] + b["bh"] / 2
        body += '<path d="M%.1f %.1f C%.1f %.1f %.1f %.1f %.1f %.1f" fill="none" stroke="%s" stroke-width="1.9" marker-end="url(#am%s)"/>' % (sx, sy, sx - 46, sy, ex + 46, ey, ex + 2, ey, b["color"], b["color"][1:])
    # code text
    for i, l in enumerate(lines):
        body += '<text x="%d" y="%.1f" font-family="\'JetBrains Mono\', Menlo, monospace" font-size="%g" font-weight="500" xml:space="preserve" style="white-space:pre;font-variant-ligatures:none">%s</text>' % (x0, top + i * lh + lh / 2 + 4.6, fs, hl_svg(l))
        body += '<text x="%d" y="%.1f" font-size="8" fill="#B6BFCC" text-anchor="end" font-weight="700">%d</text>' % (x0 - 5 if False else 15, top + i * lh + lh / 2 + 3.2, i + 1) if False else ""
    # captions
    for b in boxes:
        body += '<rect x="%d" y="%.1f" width="%d" height="%.1f" rx="5" fill="#fff" stroke="%s" stroke-width="1.4"/>' % (cap_x, b["ty"], cap_w, b["bh"], b["color"])
        body += '<rect x="%d" y="%.1f" width="5" height="%.1f" rx="2" fill="%s"/>' % (cap_x, b["ty"], b["bh"], b["color"])
        for k, t in enumerate(b["tl"]):
            body += '<text x="%d" y="%.1f" font-size="11.3" fill="#1F2937" font-weight="600">%s</text>' % (cap_x + 14, b["ty"] + 15.5 + k * 14.5, esc(t))
    if output:
        oy = code_bottom + 6
        body += '<rect x="12" y="%d" width="%d" height="%d" rx="6" fill="#111827"/>' % (oy, code_w, out_h - 6)
        body += '<text x="22" y="%d" font-size="7.6" font-weight="800" letter-spacing="1.4" fill="#34D399">OUTPUT</text>' % (oy + 14)
        for k, l in enumerate(output):
            body += '<text x="22" y="%d" font-family="\'JetBrains Mono\', Menlo, monospace" font-size="12" fill="#E5E7EB" xml:space="preserve" style="white-space:pre;font-variant-ligatures:none">%s</text>' % (oy + 30 + k * 17, esc(l))
    svg = '<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif"><defs>%s</defs>%s</svg>' % (W, H, markers(), body)
    return fig(svg, caption)


def anatomy(title, segs, caption=None, size=25, mono=True, gap=3):
    """A string (URL, address, packet, number) split into colored pieces. Every piece has an arrow and a caption box.
    segs = [(text, "Caption heading", "caption body"), ...]"""
    W = 680; cw = size * 0.6 if mono else size * 0.55
    total = sum(len(t) * cw for t, _, _ in segs) + gap * (len(segs) - 1)
    x = (W - total) / 2
    n = len(segs); two = n >= 4
    rows = []
    for i, (t, ch, cb) in enumerate(segs):
        w = len(t) * cw; rows.append(dict(t=t, ch=ch, cb=cb, x=x, w=w, cx=x + w / 2, color=PAL[i % len(PAL)], up=(two and i % 2 == 1)))
        x += w + gap
    bw = 205
    def place(group):
        group.sort(key=lambda r: r["cx"]); prev = 8
        for r in group:
            r["bx"] = max(r["cx"] - bw / 2, prev); prev = r["bx"] + bw + 10
        limit = W - 8
        for r in reversed(group):
            r["bx"] = min(r["bx"], limit - bw); limit = r["bx"] - 10
    below = [r for r in rows if not r["up"]]; above = [r for r in rows if r["up"]]
    place(below); place(above)
    wrap_n = int((bw - 22) / 6.45)
    for r in rows:
        r["tl"] = wrap(r["cb"], wrap_n); r["bh"] = 17 + 14.2 * len(r["tl"]) + 10
    up_h = max([r["bh"] for r in above], default=0) + (34 if above else 0)
    ty = 44 + up_h                       # token baseline
    dn_h = max([r["bh"] for r in below], default=0)
    H = ty + 26 + 38 + dn_h + 14
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.4"/>' % (W - 4, H - 4)
    body += '<text x="18" y="22" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % esc(title)
    for r in rows:
        c = r["color"]
        body += '<rect x="%.1f" y="%.1f" width="%.1f" height="%d" rx="4" fill="%s" fill-opacity=".14"/>' % (r["x"] - 2, ty - size + 1, r["w"] + 4, size + 10, c)
        body += '<rect x="%.1f" y="%.1f" width="%.1f" height="3" rx="1.5" fill="%s"/>' % (r["x"] - 2, ty + 7, r["w"] + 4, c)
        body += '<text x="%.1f" y="%.1f" font-family="\'JetBrains Mono\', Menlo, monospace" font-size="%d" font-weight="600" fill="#0F172A" xml:space="preserve" style="white-space:pre;font-variant-ligatures:none">%s</text>' % (r["x"], ty, size, esc(r["t"]))
        if r["up"]:
            by = 34; sy = by + r["bh"]; ey = ty - size - 3
            body += '<path d="M%.1f %.1f V%.1f H%.1f V%.1f" fill="none" stroke="%s" stroke-width="1.9" marker-end="url(#am%s)"/>' % (r["bx"] + bw / 2 if False else r["cx"], ty - size - 3, 0, 0, 0, c, c[1:]) if False else ""
            ax = r["bx"] + bw / 2; midy = sy + 10
            body += '<path d="M%.1f %.1f V%.1f H%.1f V%.1f" fill="none" stroke="%s" stroke-width="1.9" marker-end="url(#am%s)"/>' % (ax, sy, midy, r["cx"], ty - size - 2, c, c[1:])
        else:
            by = ty + 26 + 24; ay = ty + 14
            ax = r["bx"] + bw / 2; midy = ay + 15
            body += '<path d="M%.1f %.1f V%.1f H%.1f V%.1f" fill="none" stroke="%s" stroke-width="1.9" marker-end="url(#am%s)"/>' % (ax, by - 1, midy, r["cx"], ay, c, c[1:])
            body += '<path d="M%.1f %.1f V%.1f" stroke="none"/>' % (0, 0, 0)
        r["by"] = by
    for r in rows:
        c = r["color"]; bx = r["bx"]; by = r["by"]
        body += '<rect x="%.1f" y="%.1f" width="%d" height="%.1f" rx="5" fill="#fff" stroke="%s" stroke-width="1.4"/><rect x="%.1f" y="%.1f" width="%d" height="4" rx="2" fill="%s"/>' % (bx, by, bw, r["bh"], c, bx, by, bw, c)
        body += '<text x="%.1f" y="%.1f" font-size="11.6" font-weight="800" fill="%s">%s</text>' % (bx + 11, by + 21, c, esc(r["ch"]))
        for k, t in enumerate(r["tl"]):
            body += '<text x="%.1f" y="%.1f" font-size="10.8" fill="#374151">%s</text>' % (bx + 11, by + 36 + k * 14.2, esc(t))
    svg = '<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif"><defs>%s</defs>%s</svg>' % (W, H, markers(), body)
    return fig(svg, caption)


FIGMARK = "@@FIGLABEL@@"


def fig(svg, caption=None):
    return '<figure class="fig">%s<figcaption>%s%s</figcaption></figure>' % (svg, FIGMARK, caption or "") if caption else '<figure class="fig">%s</figure>' % svg


def trace(title, code, vars_, rows, caption=None, output=None):
    """AP-style tracing: code on the left, a table of every variable after every line on the right. Changed values are highlighted.
    rows = [(line_no, {var: value}), ...]; values not given carry over from the previous row."""
    lines = code.strip("\n").split("\n")
    left = "".join('<div><span class="ln">%d</span><span>%s</span></div>' % (i + 1, hl_html(l) or "&nbsp;") for i, l in enumerate(lines))
    head = "<tr><th>Line run</th>%s</tr>" % "".join("<th>%s</th>" % esc(v) for v in vars_)
    prev = {}; body = ""
    for ln, vals in rows:
        cur = dict(prev); cur.update(vals)
        def cell(v):
            chg = v in vals and vals[v] != prev.get(v); val = str(cur.get(v, "-"))
            if not chg and len(val) > 13 and prev.get(v) == cur.get(v): return '<td class="dit" title="same as above">&#8593; same</td>'
            return '<td class="%s">%s</td>' % ("chg" if chg else "", esc(val))
        cells = "".join(cell(v) for v in vars_)
        body += '<tr><td class="ln2">%s</td>%s</tr>' % ("start" if ln == 0 else ln, cells); prev = cur
    if output: body += '<tr><td class="ln2">OUT</td><td class="out" colspan="%d">%s</td></tr>' % (len(vars_), esc(output))
    longest = max([len(str(v)) for _, vals in rows for v in vals.values()] + [0])
    stack = longest > 13 or len(vars_) > 4 or len(rows) > 15
    html_ = '<div class="trace%s"><div class="tcode">%s</div><table>%s%s</table></div>' % ((" stack" if stack else "") + (" dense" if len(rows) > 14 or len(lines) > 12 else "") + (" xdense" if len(rows) > 20 else ""), left, head, body)
    cap = ('<figcaption>%s%s</figcaption>' % (FIGMARK, caption)) if caption else ""
    t = '<div style="font:700 9.4pt Manrope;color:#1F2937;margin:0 0 5pt 2pt">%s</div>' % esc(title)
    return '<figure class="fig">%s%s%s</figure>' % (t, html_, cap)


def _n(v):
    return "{:,.0f}".format(v) if abs(v) >= 1000 else ("%g" % round(v, 1))


def bars(title, labels, values, caption=None, unit="", colors=None, ymax=None, ymin=0):
    W, H = 680, 250; n = len(values); ymax = ymax or max(values) * 1.18; span = ymax - ymin
    bw = min(70, (W - 120) / n * .62); gap = (W - 100 - n * bw) / max(n - 1, 1) if n > 1 else 0
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for k in range(5):
        y = 205 - k * 150 / 4; body += '<line x1="60" y1="%.1f" x2="%d" y2="%.1f" stroke="#E5E7EB"/><text x="52" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="end">%s</text>' % (y, W - 24, y, y + 3.4, _n(ymin + span * k / 4))
    for i, (l, v) in enumerate(zip(labels, values)):
        x = 70 + i * (bw + gap); h = 150 * (v - ymin) / span; col = (colors or PAL)[i % len(colors or PAL)]
        body += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="3" fill="%s"/><text x="%.1f" y="%.1f" font-size="11.5" font-weight="800" fill="#111827" text-anchor="middle">%s%s</text><text x="%.1f" y="224" font-size="10.5" fill="#374151" text-anchor="middle">%s</text>' % (x, 205 - h, bw, h, col, x + bw / 2, 199 - h, _n(v), esc(unit), x + bw / 2, esc(l))
    body += '<line x1="60" y1="205" x2="%d" y2="205" stroke="#6B7280" stroke-width="1.6"/>' % (W - 24)
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H, body), caption)


def flowchart(title, nodes, arrows, size=(680, 300), caption=None):
    """nodes = {id: (x, y, w, h, text, kind)} with kind in start|proc|dec|io ; arrows = [(points [(x,y),...], 'label' or None, color_index)]"""
    W, H = size
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for pts, lab, ci in arrows:
        col = PAL[ci % len(PAL)]; d = "M" + " L".join("%.1f %.1f" % p for p in pts)
        body += '<path d="%s" fill="none" stroke="%s" stroke-width="2" marker-end="url(#am%s)"/>' % (d, col, col[1:])
        if lab:
            mx = (pts[0][0] + pts[1][0]) / 2; my = (pts[0][1] + pts[1][1]) / 2
            body += '<rect x="%.1f" y="%.1f" width="%d" height="15" rx="7" fill="#fff"/><text x="%.1f" y="%.1f" font-size="10.5" font-weight="800" fill="%s" text-anchor="middle">%s</text>' % (mx - len(lab) * 3.6 - 4, my - 8, len(lab) * 7.2 + 8, mx, my + 3.6, col, esc(lab))
    for nid, (x, y, w, h, text, kind) in nodes.items():
        tl = wrap(text, max(8, int(w / 6.2)))
        if kind == "dec":
            body += '<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#FEF3C7" stroke="#D97706" stroke-width="1.8"/>' % (x, y - h / 2, x + w / 2, y, x, y + h / 2, x - w / 2, y)
            tcol = "#92400E"
        elif kind == "start":
            body += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f" fill="#111827"/>' % (x - w / 2, y - h / 2, w, h, h / 2); tcol = "#fff"
        elif kind == "io":
            body += '<polygon points="%.1f,%.1f %.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.8"/>' % (x - w / 2 + 12, y - h / 2, x + w / 2 + 12, y - h / 2, x + w / 2 - 12, y + h / 2, x - w / 2 - 12, y + h / 2); tcol = "#075985"
        else:
            body += '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="6" fill="#ECFDF5" stroke="#059669" stroke-width="1.8"/>' % (x - w / 2, y - h / 2, w, h); tcol = "#065F46"
        for k, t in enumerate(tl):
            body += '<text x="%.1f" y="%.1f" font-size="11" font-weight="700" fill="%s" text-anchor="middle">%s</text>' % (x, y - (len(tl) - 1) * 6.6 + k * 13.2 + 3.8, tcol, esc(t))
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif"><defs>%s</defs>%s</svg>' % (W, H, markers(), body), caption)


def see(*items):
    return sec_t("example", "Worked Examples", "".join(items), "EXAMPLE")


def gloss(*pairs):
    return list(pairs)


def timeline(title, segs, total, unit="s", caption=None):
    """segs = [(start, end, "Heading", "small text"), ...] along a time axis."""
    W, H = 680, 170; x0, x1 = 30, W - 30
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    sc = (x1 - x0) / total
    for i, (a, b, h, t) in enumerate(segs):
        col = PAL[i % len(PAL)]; xa = x0 + a * sc; xb = x0 + b * sc
        body += '<rect x="%.1f" y="52" width="%.1f" height="30" rx="5" fill="%s"/><text x="%.1f" y="72" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">%s</text>' % (xa + 1, xb - xa - 2, col, (xa + xb) / 2, esc(h))
        for k, ln in enumerate(wrap(t, max(10, int((xb - xa) / 5.6)))[:3]):
            body += '<text x="%.1f" y="%d" font-size="9.8" fill="#374151" text-anchor="middle">%s</text>' % ((xa + xb) / 2, 104 + k * 12, esc(ln))
        body += '<line x1="%.1f" y1="86" x2="%.1f" y2="94" stroke="%s" stroke-width="1.6"/><text x="%.1f" y="42" font-size="9.5" fill="#6B7280" text-anchor="middle">%g%s</text>' % ((xa + xb) / 2, (xa + xb) / 2, col, xa + 1, a, unit)
    body += '<text x="%.1f" y="42" font-size="9.5" fill="#6B7280" text-anchor="end">%g%s</text>' % (x1, total, unit)
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H, body), caption)


def matrix2x2(title, cols, rows, cells, caption=None):
    """cols = [col heading, col heading]; rows = [row heading, row heading]; cells = [[text, text], [text, text]]"""
    W, H = 680, 250; x0, y0, cw_, rh = 150, 56, 250, 88
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for j, c in enumerate(cols):
        body += '<rect x="%d" y="%d" width="%d" height="26" rx="5" fill="%s"/><text x="%d" y="%d" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">%s</text>' % (x0 + j * (cw_ + 8), y0 - 8, cw_, PAL[j * 2 % 6], x0 + j * (cw_ + 8) + cw_ / 2, y0 + 9, esc(c))
    for i, r in enumerate(rows):
        body += '<rect x="20" y="%d" width="124" height="%d" rx="5" fill="%s"/>' % (y0 + 26 + i * (rh + 6), rh, PAL[(i * 2 + 1) % 6])
        for k, ln in enumerate(wrap(r, 14)):
            body += '<text x="82" y="%d" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">%s</text>' % (y0 + 26 + i * (rh + 6) + rh / 2 - (len(wrap(r, 14)) - 1) * 7 + k * 14 + 4, esc(ln))
        for j in range(2):
            x = x0 + j * (cw_ + 8); y = y0 + 26 + i * (rh + 6)
            body += '<rect x="%d" y="%d" width="%d" height="%d" rx="5" fill="#F8FAFC" stroke="#E2E8F0"/>' % (x, y, cw_, rh)
            for k, ln in enumerate(wrap(cells[i][j], 40)[:5]):
                body += '<text x="%d" y="%d" font-size="10.6" fill="#1F2937">%s</text>' % (x + 12, y + 20 + k * 14.5, esc(ln))
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H + 60, body.replace('height="%d" rx="9"' % (H - 4), 'height="%d" rx="9"' % (H + 56))), caption)


def scatter(title, xs, ys, xlabel, ylabel, caption=None, note=None):
    W, H = 680, 300; L, R, T, B = 70, 24, 40, 56
    mx, my = max(xs) * 1.05, max(ys) * 1.05
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for k in range(5):
        y = H - B - k * (H - B - T) / 4; x = L + k * (W - L - R) / 4
        body += '<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#EEF0F3"/><text x="%d" y="%.1f" font-size="9.5" fill="#6B7280" text-anchor="end">%g</text>' % (L, y, W - R, y, L - 6, y + 3, round(my * k / 4))
        body += '<text x="%.1f" y="%d" font-size="9.5" fill="#6B7280" text-anchor="middle">%g</text>' % (x, H - B + 14, round(mx * k / 4))
    body += '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#6B7280" stroke-width="1.5"/><line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#6B7280" stroke-width="1.5"/>' % (L, H - B, W - R, H - B, L, T, L, H - B)
    pts = [(L + x / mx * (W - L - R), H - B - y / my * (H - B - T)) for x, y in zip(xs, ys)]
    n = len(xs); mxx = sum(xs) / n; myy = sum(ys) / n
    sxy = sum((a - mxx) * (b - myy) for a, b in zip(xs, ys)); sxx = sum((a - mxx) ** 2 for a in xs)
    slope = sxy / sxx; ic = myy - slope * mxx
    x_a, x_b = min(xs), max(xs)
    body += '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#DC2626" stroke-width="2" stroke-dasharray="6 5" stroke-opacity=".8"/>' % (L + x_a / mx * (W - L - R), H - B - (slope * x_a + ic) / my * (H - B - T), L + x_b / mx * (W - L - R), H - B - (slope * x_b + ic) / my * (H - B - T))
    for (px, py) in pts: body += '<circle cx="%.1f" cy="%.1f" r="5.5" fill="#2563EB" fill-opacity=".82" stroke="#fff" stroke-width="1.2"/>' % (px, py)
    body += '<text x="%d" y="%d" font-size="11" fill="#374151" text-anchor="middle" font-weight="700">%s</text><text x="16" y="%d" font-size="11" fill="#374151" text-anchor="middle" font-weight="700" transform="rotate(-90 16 %d)">%s</text>' % ((L + W - R) / 2, H - 12, esc(xlabel), (T + H - B) / 2, (T + H - B) / 2, esc(ylabel))
    if note: body += '<rect x="%d" y="%d" width="220" height="40" rx="5" fill="#FEF2F2" stroke="#DC2626"/><text x="%d" y="%d" font-size="10.5" fill="#991B1B" font-weight="700">%s</text>' % (L + 14, T + 6, L + 24, T + 24, esc(note))
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H, body), caption)


def pixel_grid(title, rows, palette=None, cell=30, caption=None, bits=True):
    """rows = ["0110", "1001", ...] of 0/1 (or palette keys). Shows the squares and the bits side by side."""
    palette = palette or {"1": "#111827", "0": "#FFFFFF"}
    n, m = len(rows), len(rows[0]); gw = m * cell; W = 680; H = n * cell + 78
    x0 = 120; x1 = x0 + gw + 150
    body = '<rect x="2" y="2" width="%d" height="%d" rx="9" fill="#fff" stroke="#CBD5E1" stroke-width="1.4"/><text x="18" y="24" font-size="12.5" font-weight="700" fill="#1F2937">%s</text>' % (W - 4, H - 4, esc(title))
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            body += '<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#94A3B8" stroke-width="1"/>' % (x0 + c * cell, 48 + r * cell, cell, cell, palette.get(ch, "#fff"))
            if bits: body += '<text x="%d" y="%d" font-size="12" font-weight="700" font-family="JetBrains Mono, monospace" fill="%s" text-anchor="middle">%s</text>' % (x1 + 20 + c * 22, 48 + r * cell + cell / 2 + 4.5, "#0F172A", ch)
    body += '<text x="%d" y="%d" font-size="10.5" fill="#6B7280" text-anchor="middle" font-weight="700">the picture</text>' % (x0 + gw / 2, 48 + n * cell + 20)
    if bits: body += '<text x="%d" y="%d" font-size="10.5" fill="#6B7280" text-anchor="middle" font-weight="700">the bits that describe it</text>' % (x1 + 20 + (m * 22 - 22) / 2, 48 + n * cell + 20)
    body += '<path d="M%d %d H%d" stroke="#DB2777" stroke-width="2" marker-end="url(#am%s)"/>' % (x0 + gw + 16, 48 + n * cell / 2, x1 - 10, "DB2777") if False else ""
    return fig('<svg viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" font-family="Manrope, sans-serif">%s</svg>' % (W, H, body), caption)


def tbl(headers, rows):
    th = "".join("<th>%s</th>" % h for h in headers)
    return '<div class="tblwrap"><table class="cmp"><tr>%s</tr>%s</table></div>' % (th, "".join("<tr>" + "".join("<td>%s</td>" % c for c in r) + "</tr>" for r in rows))


def callout(text, sub=""):
    return '<div class="callout">%s%s</div>' % (text, ("<span>%s</span>" % sub) if sub else "")


def example(t): return '<div class="example">%s</div>' % t
def warn(t): return '<div class="warn">%s</div>' % t
def tip(t): return '<div class="hint-panel">%s</div>' % t
def chk(items): return '<ul class="chk">%s</ul>' % "".join("<li>%s</li>" % i for i in items)
def sec(title, body, tag=None): return '<div class="sec"><h3>%s%s</h3>%s</div>' % (('<span class="tag">%s</span>' % tag) if tag else "", title, body)


# ============================================================================ light-theme color map for the (dark) notes diagrams
COLMAP = {
    "#151A24": "#FFFFFF", "#0B0F16": "#F8FAFC", "#05070B": "#F1F5F9", "#10141C": "#F8FAFC", "#0B0E14": "#FFFFFF", "#1B2330": "#E2E8F0", "#111418": "#F1F5F9",
    "#EAEFF6": "#111827", "#D5DDE8": "#1F2937", "#C4CDD8": "#1F2937", "#D8E1EC": "#1F2937", "#FFFFFF": "#111827",
    "#8B9AAE": "#6B7280", "#5D6B7A": "#6B7280", "#3A4658": "#94A3B8", "#2B3647": "#CBD5E1", "#232B38": "#CBD5E1",
    "#34D399": "#059669", "#60A5FA": "#2563EB", "#FBBF24": "#D97706", "#F472B6": "#DB2777", "#C084FC": "#7C3AED",
    "#FB923C": "#EA580C", "#F87171": "#DC2626", "#2DD4BF": "#0D9488", "#A3E635": "#4D7C0F", "#A78BFA": "#7C3AED", "#38BDF8": "#0284C7",
}


def lighten(svg_str):
    def rep(m):
        return COLMAP.get(m.group(0).upper(), m.group(0))
    out = re.sub(r"#[0-9A-Fa-f]{6}\b", rep, svg_str)
    out = re.sub(r"(fill|stroke)=\"#(?:fff|FFF)\"", lambda m: '%s="#111827"' % m.group(1), out)
    return out


# ============================================================================ source pages
def load_page(src):
    """src = ('file', 'apcsp/booleans.html') or ('gen', module, 'slug'). Returns dict(title, brief, deck, sections)."""
    if src[0] == "file":
        text = open(os.path.join(ROOT, src[1]), encoding="utf-8").read(); url = src[1].replace("apcsp/", "")
    else:
        text = src[1].PAGES[src[2]](); url = src[2] + ".html"
    soup = BeautifulSoup(text, "lxml")
    h1 = soup.find("h1"); brief = soup.select_one(".brief-no"); deck = soup.select_one(".deck")
    secs = [s for s in soup.select("section.part")]
    return dict(title=h1.get_text(" ", strip=True) if h1 else "", brief=brief.get_text(" ", strip=True) if brief else "", deck=deck.decode_contents() if deck else "", sections=secs, url=url, soup=soup)


class Ctx:
    """Per-unit counters (figures, practice questions) and the answer key being collected."""
    def __init__(self, unit):
        self.unit = unit; self.fig = 0; self.key = []; self.words = []   # key = [(chapter_id, [(qno, letters, why)])]


def label_figures(html_s, ctx):
    def rep(m):
        ctx.fig += 1
        return '<span class="fl">FIGURE %s.%d</span>' % (ctx.unit.n, ctx.fig)
    return html_s.replace(FIGMARK, "\x00").replace("\x00", "\x01").replace("\x01", "") if False else re.sub(re.escape(FIGMARK), rep, html_s)


def _inner(tag):
    return tag.decode_contents()


def convert_section(sec_tag, ch, ctx, soup, nohead=False):
    """One <section class="part"> from a notes page -> print HTML (also collects quizzes into ctx)."""
    head = sec_tag.select_one(".part-head")
    tag = head.select_one(".part-tag").get_text(strip=True) if head and head.select_one(".part-tag") else ""
    title = head.select_one("h2").decode_contents() if head and head.select_one("h2") else ""
    wrap_ = sec_tag.select_one(".wrap") or sec_tag
    if head: head.decompose()
    quizzes = []
    for q in wrap_.select(".qz"):
        quizzes.append(q.extract())
    for ex_ in wrap_.select(".example"):
        b0 = ex_.find("b")
        if b0 and b0.get_text(strip=True).rstrip(":").lower() in ("example", "examples") and ex_.get_text().lstrip().lower().startswith("example"):
            b0.decompose()
    for w in wrap_.select(".wg, script, .asgw, .assign-root, .assign-root8, style, .ctl, .lab, .filters, .cta, .tbtn, .done-msg, .score, .qh"):
        w.decompose()
    for st in wrap_.select(".stp"):
        t = st.find("p"); frames = st.select(".frame"); out = ['<div class="frames-title">%s</div><div class="frames">' % (t.decode_contents() if t else "")]
        for i, fr in enumerate(frames):
            sv = fr.find("svg"); say = fr.select_one(".say")
            out.append('<div class="fr"><div class="st">STEP %d OF %d</div>%s<div class="say">%s</div></div>' % (i + 1, len(frames), lighten(str(sv)) if sv else "", say.decode_contents() if say else ""))
        out.append("</div>")
        st.replace_with(BeautifulSoup("".join(out), "lxml").body)
    for fg in wrap_.select("figure.fig"):
        for sv in fg.select("svg"):
            sv.replace_with(BeautifulSoup(lighten(str(sv)), "lxml").svg)
        cap = fg.find("figcaption")
        if cap: cap.insert(0, NavigableString(FIGMARK))
    for sv in wrap_.select("svg"):
        if not sv.find_parent("figure"):
            sv.replace_with(BeautifulSoup(lighten(str(sv)), "lxml").svg)
    for cl in wrap_.select("code.line"):
        txt = cl.get_text()
        cl.clear(); cl.append(BeautifulSoup(hl_html(txt), "lxml").body)
    for cb in wrap_.select("div.code, pre.code"):
        if cb.select(".err"): continue
        cb.string = cb.get_text()
        cb.replace_with(BeautifulSoup(code_block(cb.get_text()), "lxml").pre)
    body = _inner(wrap_)
    is_exam = tag == "AP" or "AP Exam" in title or "on the ap exam" in title.lower()
    if nohead:
        h = '<div class="sec">%s</div>' % body
    else:
        h = '<div class="sec%s"><h3><span class="tag">%s</span>%s</h3>%s</div>' % (" exam" if is_exam else " t-learn", "AP EXAM" if is_exam else "LEARN", title, body)
    return h, quizzes


def quiz_to_practice(quizzes, ch, ctx):
    """Turn the notes' interactive quizzes into a printed 'Check yourself' block and add the answers to the unit's answer key."""
    qs = []
    for z in quizzes:
        qs.extend(z.select(".q"))
    if not qs: return ""
    items = ""; keys = []
    for i, q in enumerate(qs, 1):
        stem = q.select_one(".qs"); chip = stem.select_one(".chip")
        multi = "multi" in (q.get("class") or [])
        if chip: chip.decompose()
        opts = [b.decode_contents() for b in q.select(".opts button")]
        ans = [int(x) for x in str(q.get("data-a", "0")).split(",")]
        why = q.select_one(".why").decode_contents() if q.select_one(".why") else ""
        short = max(len(BeautifulSoup(o, "lxml").get_text()) for o in opts) < 34
        items += '<div class="pq"><div class="qn">%d</div><div class="qs">%s%s</div><ol%s>%s</ol></div>' % (i, stem.decode_contents(), '<span class="tagsel">SELECT TWO</span>' if multi else "", ' class="two"' if short else "", "".join("<li>%s</li>" % o for o in opts))
        keys.append((i, "".join("ABCDEFGH"[a] for a in ans), why))
    ctx.key.append((ch, keys))
    return '<div class="practice"><h3><span class="tag">CHECK YOURSELF</span>Practice questions</h3>%s</div>' % items


def practice_from_dicts(qs, ch, ctx, title="Practice questions"):
    """qs = [dict(s=stem html, o=[option html], a=[answer indexes], e=explanation html), ...]"""
    items = ""; keys = []
    for i, q in enumerate(qs, 1):
        multi = len(q["a"]) > 1
        stem = re.sub(r'<span class="sel2">.*?</span>', "", q["s"])
        if q.get("c"): stem += '<div class="qc">%s</div>' % hl_html(q["c"])
        short = max(len(BeautifulSoup(o, "lxml").get_text()) for o in q["o"]) < 34
        if LANG == "html" and q.get("c") and q["c"].count("\n") > 9: short = False        # a tall code box fills the page: its options stack in one column (two columns misplace the first option there)
        items += '<div class="pq"><div class="qn">%d</div><div class="qs">%s%s</div><ol%s>%s</ol></div>' % (i, stem, '<span class="tagsel">SELECT TWO</span>' if multi else "", ' class="two"' if short else "", "".join("<li>%s</li>" % o for o in q["o"]))
        keys.append((i, "".join("ABCDEFGH"[a] for a in q["a"]), q["e"]))
    ctx.key.append((ch, keys))
    return '<div class="practice"><h3><span class="tag">CHECK YOURSELF</span>%s</h3>%s</div>' % (title, items)


def js_array(path, var):
    """Read a JavaScript array literal (like the Unit 3 question bank) out of an HTML page."""
    import subprocess, json
    t = open(os.path.join(ROOT, path), encoding="utf-8").read()
    i = t.index("var %s = [" % var) + len("var %s = " % var); j = t.index("];", i) + 1
    js = "console.log(JSON.stringify(%s))" % t[i:j]
    return json.loads(subprocess.check_output(["node", "-e", js]))


def F(cid, file, **kw):
    return dict(id=cid, src=("file", "apcsp/" + file), **kw)


def G(cid, mod, slug, **kw):
    return dict(id=cid, src=("gen", mod, slug), **kw)



# ============================================================================ authoring helpers
LMAP = json.load(open(os.path.join(HERE, "lessons-map.json")))


def md(t):
    """Tiny markup for authored text: `code`, **bold**, blank line = new paragraph, '- ' bullets, '1. ' numbers, and !key:/!tip:/!warn:/!ex: callouts."""
    def inline(x):
        x = re.sub(r"`([^`]+)`", lambda m: "<code>%s</code>" % esc(m.group(1)), x)
        return re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", x)
    out = []
    for blk in re.split(r"\n\s*\n", t.strip("\n")):
        lines = [l for l in blk.split("\n") if l.strip()]
        if not lines: continue
        if blk.lstrip().startswith("!"):
            kind, _, rest = blk.strip()[1:].partition(":")
            body = inline(" ".join(l.strip() for l in rest.split("\n")).strip())
            out.append({"key": callout(body), "tip": tip(body), "warn": warn(body), "ex": example(body)}[kind.strip()])
        elif all(l.lstrip().startswith("|") for l in lines):
            rows = [[inline(c.strip()) for c in l.strip().strip("|").split("|")] for l in lines if not re.match(r"^\s*\|[\s:|-]+\|\s*$", l)]
            out.append(tbl(rows[0], rows[1:]))
        elif all(l.lstrip().startswith("- ") for l in lines):
            out.append("<ul>%s</ul>" % "".join("<li>%s</li>" % inline(l.lstrip()[2:]) for l in lines))
        elif all(re.match(r"\s*\d+\. ", l) for l in lines):
            out.append("<ol>%s</ol>" % "".join("<li>%s</li>" % inline(re.sub(r"^\s*\d+\. ", "", l)) for l in lines))
        else:
            out.append("<p>%s</p>" % inline(" ".join(l.strip() for l in lines)))
    return "".join(out)


def body_html(b):
    if isinstance(b, str): return md(b) if not b.lstrip().startswith("<") else b
    return "".join(body_html(x) for x in b)


def sec_t(kind, title, body, tag):
    return '<div class="sec t-%s"><h3><span class="tag">%s</span>%s</h3>%s</div>' % (kind, tag, title, body)


def watch(rows, intro=None, extra=""):
    """rows = [(what it looks like, what goes wrong, how to fix it)] with the same tiny markup as md()."""
    def cell(x): return md(x)[3:-4] if md(x).startswith("<p>") and md(x).count("<p>") == 1 else md(x)
    body = '<p class="lede">%s</p>' % md(intro)[3:-4] if intro else ""
    body += '<div class="tblwrap"><table class="cmp watch"><tr><th>What it looks like</th><th>What goes wrong</th><th>How to fix it</th></tr>%s</table></div>' % "".join(
        "<tr><td>%s</td><td>%s</td><td>%s</td></tr>" % (cell(a), cell(b), cell(c)) for a, b, c in rows)
    return body + extra


def glance_html(ch, words):
    m = LMAP.get(ch["id"]); bits = []
    if ch.get("site"): bits.append(ch["site"])
    elif m:
        if m["w"]: bits.append("<b>Walkthrough</b>")
        if m["p"]: bits.append("<b>Assignment:</b> %s" % esc(m["p"]["title"]))
        if m["g"]: bits.append("<b>%s:</b> %s" % ("Mission" if m["g"]["pts"] >= 100 else "Bonus game", esc(m["g"]["title"])))
    site = " &nbsp;·&nbsp; ".join(bits)
    wh = "".join('<div class="w"><b>%s</b> %s</div>' % (md(t)[3:-4], md(d)[3:-4]) for t, d in words)
    return ('<div class="glance">%s%s%s</div>' % (
        ('<div class="g1"><span>GOAL</span>%s</div>' % md(ch["goal"])[3:-4]) if ch.get("goal") else "",
        ('<div class="g2"><span>WORDS TO KNOW</span><div class="wl">%s</div></div>' % wh) if words else "",
        ('<div class="g3"><span>ON THE SITE</span>%s</div>' % site) if site else ""))


def chapter_html(ch, ctx, accent):
    """ch = dict(id, src?, title?, goal, words, learn, learn_after, after/ex, tr, bad, exam, questions, ...). Every lesson is laid out the same way:
    header, at-a-glance box, LEARN, EXAMPLE, TRACE IT, WATCH OUT, AP EXAM, the online bar, CHECK YOURSELF."""
    m = LMAP.get(ch["id"], {})
    page = load_page(ch["src"]) if ch.get("src") else None
    title = ch.get("title") or m.get("title") or (re.sub(r"\s*\(\d+\.\d+\)\s*$", "", page["title"]) if page else ch["id"])
    kick = ch.get("kick") or ch.get("kicker") or (page["deck"] if page else "")
    parts = []; quizzes = []
    if page:
        secs = list(enumerate(page["sections"]))
        if ch.get("sel") is not None: secs = [secs[i] for i in ch["sel"]]
        secs = [(i, s) for i, s in secs if i not in ch.get("skip", ())]
        for i, s in secs:
            h, qz = convert_section(s, ch, ctx, page["soup"], nohead=(i in ch.get("nohead", ())))
            parts.append(h); quizzes.extend(qz)
            for extra in ch.get("insert", {}).get(i, []): parts.append(extra)
    exam = [p for p in parts if 'class="sec exam"' in p]; rest = [p for p in parts if 'class="sec exam"' not in p]
    learn = "".join(sec_t("learn", esc(t), body_html(b), "LEARN") for t, b in ch.get("learn", []))
    learn_after = "".join(sec_t("learn", esc(t), body_html(b), "LEARN") for t, b in ch.get("learn_after", []))
    ex_items = []; after_other = []
    for a_ in ch.get("after", []):
        m_ = re.match(r'^<div class="sec t-example"><h3>.*?</h3>(.*)</div>$', a_, re.S)
        if m_: ex_items.append(m_.group(1))
        else: after_other.append(a_)
    ex_items += list(ch.get("ex", []))
    ex_html = sec_t("example", "Worked Examples", "".join(ex_items), "EXAMPLE") if ex_items else ""
    tr_html = ""
    if ch.get("tr"):
        lede = ch.get("trace_intro") or "Tracing means playing computer: go one line at a time and write down what every variable holds. Cover the table with a sheet of paper, trace the code yourself, then check."
        tr_html = sec_t("trace", "Trace It", '<div class="keep"><p class="lede">%s</p>%s</div>%s' % (md(lede)[3:-4], ch["tr"][0], "".join(ch["tr"][1:])), "TRACE IT")
    bad_html = sec_t("watch", "Watch Out: Common Mistakes", body_html(ch["bad"]), "WATCH OUT") if ch.get("bad") else ""
    exam_html = ""
    if ch.get("ap"): exam_html = '<div class="sec exam"><h3><span class="tag">AP EXAM</span>On the AP Exam</h3><ul class="chk">%s</ul></div>' % "".join("<li>%s</li>" % md(x)[3:-4] for x in ch["ap"])
    glance = glance_html(ch, ch.get("words", [])) if (ch.get("goal") or ch.get("words")) else ""
    ctx.words.extend(ch.get("words", []))
    body = "".join(ch.get("before", [])) + glance + learn + "".join(rest) + learn_after + "".join(after_other) + ex_html + tr_html + bad_html + "".join(exam) + exam_html
    if ch.get("online", True) and (m.get("notes") or (page and page.get("url"))) and not ch.get("noonline"):
        url = (m.get("notes") or page["url"]).replace("unit-", "unit-", 1)
        body += '<div class="online">Practice this lesson interactively, with walkthroughs, assignments, and games, at <b>%s/apcsp/%s</b></div>' % (SITE, url)
    more = ch.get("more")
    if more: body += more(ctx) if callable(more) else "".join(more)      # extra teaching sections (the IST guides add a guided build, paper exercises and a checklist)
    body += quiz_to_practice(quizzes, ch["id"], ctx)
    if ch.get("questions"): body += practice_from_dicts(ch["questions"], ch["id"], ctx)
    head = ('<div class="chead"><div class="badge"><small>LESSON</small><b>%s</b></div><h2>%s</h2><p class="kick">%s</p></div>'
            % (esc(ch["id"]), title, md(kick)[3:-4] if kick and not kick.lstrip().startswith("<") else kick))
    out = '<section class="chapter"><span class="mk" style="font-size:1pt;color:#fff;position:absolute">ZZC%sZZ</span>%s%s</section>' % (esc(ch["id"]), head, body)
    return label_figures(out, ctx), title


# ============================================================================ cover art
def cover_art(kind, accent_lt, seed=7):
    rnd = random.Random(seed); W, H = 612, 792; s = ""
    if kind == "network":
        pts = [(rnd.uniform(40, 580), rnd.uniform(40, 360)) for _ in range(26)]
        for i, a in enumerate(pts):
            near = sorted(pts, key=lambda b: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)[1:3]
            for b in near: s += '<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke="%s" stroke-opacity=".28" stroke-width="1.3"/>' % (a[0], a[1], b[0], b[1], accent_lt)
        for a in pts: s += '<circle cx="%.0f" cy="%.0f" r="%.1f" fill="%s" fill-opacity="%.2f"/>' % (a[0], a[1], rnd.choice([3, 4, 5, 7]), accent_lt, rnd.choice([.35, .55, .8]))
    elif kind == "binary":
        for r in range(28):
            row = "".join(rnd.choice("01") for _ in range(30))
            s += '<text x="20" y="%d" font-family="JetBrains Mono, monospace" font-size="15" letter-spacing="9" fill="%s" fill-opacity="%.2f">%s</text>' % (24 + r * 15, accent_lt, rnd.choice([.12, .2, .3, .45]) if r % 3 else .08, row)
    elif kind == "pixels":
        for r in range(22):
            for c in range(20):
                if rnd.random() < .55: s += '<rect x="%d" y="%d" width="26" height="26" rx="3" fill="%s" fill-opacity="%.2f"/>' % (14 + c * 29, 14 + r * 29, accent_lt, rnd.choice([.1, .18, .3, .5]))
    elif kind == "code":
        syms = ["{ }", "( )", "[ ]", "def", "for", "if", "==", "+=", "#", "return", "while", ":", "\"\"", "import"]
        for _ in range(60): s += '<text x="%d" y="%d" font-family="JetBrains Mono, monospace" font-size="%d" font-weight="700" fill="%s" fill-opacity="%.2f" transform="rotate(%d %d %d)">%s</text>' % (rnd.randint(10, 560), rnd.randint(30, 380), rnd.choice([18, 24, 34, 46]), accent_lt, rnd.choice([.1, .18, .28]), rnd.choice([-12, 0, 8, 0]), 0, 0, rnd.choice(syms))
    elif kind == "html":
        syms = ["<h1>", "</p>", "<p>", "style=", "href=", "<body>", "</h2>", "<li>", "<img>", "color:", "<a>", "<br>", "#", "px", "<ul>", "</html>"]
        for _ in range(60): s += '<text x="%d" y="%d" font-family="JetBrains Mono, monospace" font-size="%d" font-weight="700" fill="%s" fill-opacity="%.2f" transform="rotate(%d %d %d)">%s</text>' % (rnd.randint(10, 520), rnd.randint(30, 380), rnd.choice([18, 24, 34, 46]), accent_lt, rnd.choice([.1, .18, .28]), rnd.choice([-12, 0, 8, 0]), 0, 0, _h.escape(rnd.choice(syms)))
    elif kind == "bars":
        for i in range(18):
            h = rnd.randint(40, 340) * (0.4 + i / 24); s += '<rect x="%d" y="%.0f" width="24" height="%.0f" rx="4" fill="%s" fill-opacity="%.2f"/>' % (18 + i * 32, 400 - h, h, accent_lt, .18 + (i % 4) * .1)
        s += '<polyline points="%s" fill="none" stroke="%s" stroke-width="3" stroke-opacity=".7"/>' % (" ".join("%d,%d" % (30 + i * 32, 360 - i * 14 - rnd.randint(0, 40)) for i in range(18)), accent_lt)
    elif kind == "hex":
        import math
        for r in range(9):
            for c in range(10):
                cx = 40 + c * 58 + (29 if r % 2 else 0); cy = 40 + r * 50
                if rnd.random() < .62:
                    pts = " ".join("%.1f,%.1f" % (cx + 26 * math.cos(math.radians(60 * k + 30)), cy + 26 * math.sin(math.radians(60 * k + 30))) for k in range(6))
                    s += '<polygon points="%s" fill="%s" fill-opacity="%.2f" stroke="%s" stroke-opacity=".3"/>' % (pts, accent_lt, rnd.choice([.05, .12, .22]), accent_lt)
    elif kind == "waves":
        import math
        for k in range(14):
            pts = " ".join("%d,%.1f" % (x, 80 + k * 24 + 26 * math.sin(x / 55 + k * .5)) for x in range(0, 640, 8))
            s += '<polyline points="%s" fill="none" stroke="%s" stroke-opacity="%.2f" stroke-width="2"/>' % (pts, accent_lt, .12 + (k % 5) * .07)
    elif kind == "rings":
        for k in range(14):
            s += '<circle cx="470" cy="190" r="%d" fill="none" stroke="%s" stroke-opacity="%.2f" stroke-width="%d"/>' % (30 + k * 26, accent_lt, .08 + (k % 4) * .08, 2 + (k % 3))
    s += '<defs><radialGradient id="glow" cx="75%%" cy="22%%" r="70%%"><stop offset="0" stop-color="%s" stop-opacity=".35"/><stop offset="1" stop-color="%s" stop-opacity="0"/></radialGradient></defs><rect width="%d" height="%d" fill="url(#glow)"/>' % (accent_lt, accent_lt, W, H)
    return '<svg class="art" viewBox="0 0 %d %d" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg"><rect width="%d" height="%d" fill="#0B0F1A"/>%s</svg>' % (W, H, W, H, s)


def data_uri_png(path):
    return "data:image/png;base64," + b64(path)


def small_logo_svg_url():
    # an svg wrapper gives the image an explicit display size inside a @page margin box
    png = b64(os.path.join(HERE, "logo-small.png"))
    svg = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='30' height='24.6' viewBox='0 0 65 54'><image width='65' height='54' xlink:href='data:image/png;base64,%s'/></svg>" % png
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def font_css():
    f = open(os.path.join(HERE, "fonts", "fonts.css"), encoding="utf-8").read()
    return re.sub(r"url\((f\d+\.woff2)\)", lambda m: "url(file://%s)" % os.path.join(HERE, "fonts", m.group(1)), f)


def css_for(unit):
    css = open(os.path.join(HERE, "print.css"), encoding="utf-8").read()
    rep = {"__ACCENT_DK__": unit.dk, "__ACCENT_TINT__": unit.tint, "__ACCENT_LT__": unit.lt, "__ACCENT__": unit.accent,
           "__RUNNING_RIGHT__": ("UNIT %d   ·   %s" % (unit.n, unit.title)).upper(), "__LOGO_URL__": small_logo_svg_url()}
    if unit.brand: css = css.replace("AP® COMPUTER SCIENCE PRINCIPLES   ·   STUDY GUIDE", unit.brand["kicker"].replace("  ·  ", "   ·   "))
    for k in sorted(rep, key=len, reverse=True): css = css.replace(k, rep[k])
    return css


class Unit:
    def __init__(self, n, title, tagline, bigidea, accent, dk, lt, tint, art, objectives, chapters, glossary=None, cheat=None, front_extra="", seed=7, brand=None):
        self.brand = brand or {}
        self.n, self.title, self.tagline, self.bigidea = n, title, tagline, bigidea
        self.accent, self.dk, self.lt, self.tint, self.art = accent, dk, lt, tint, art
        self.objectives, self.chapters, self.glossary, self.cheat, self.seed = objectives, chapters, glossary or [], cheat or [], seed
        self.front_extra = front_extra


def build_html(unit, toc_pages=None, only=None):
    """Assemble the whole guide. toc_pages = {chapter_id or 'gloss'/'key'/'cheat': page number} (filled in on the second pass)."""
    toc_pages = toc_pages or {}
    ctx = Ctx(unit); chapters = []; titles = []
    chs = [c for c in unit.chapters if only is None or c["id"] == only]
    for ch in chs:
        h, t = chapter_html(ch, ctx, unit.accent); chapters.append(h); titles.append((ch["id"], t))
    seen = {}; 
    for t, d in (list(ctx.words) if only else list(unit.glossary) + list(ctx.words)):
        k = re.sub(r"[`*]", "", t).lower()
        if k not in seen: seen[k] = (re.sub(r"[`*]", "", t), d)
    glossary = list(seen.values())
    css = css_for(unit)
    logo = data_uri_png(os.path.join(HERE, "logo-cover.png"))
    cover = ('<section class="cover">%s<div class="band"></div><div class="kicker">AP® COMPUTER SCIENCE PRINCIPLES  ·  STUDY GUIDE</div><div class="num">%d</div>'
             '<div class="title">%s</div><div class="rule"></div><div class="tag">%s</div>'
             '<div class="foot"><img src="%s"><div class="school">Social Circle High School</div><div class="dept">Computer Science  ·  Mr. Norman</div>'
             '<div class="series">%s</div><div class="redbar"></div></div></section>'
             % (cover_art(unit.art, unit.lt, unit.seed), unit.n, unit.title, unit.tagline, logo, unit.bigidea.upper().replace(":", "<br>")))
    if only:
        ch0 = chs[0]; lt = titles[0][1]
        cover = (cover.replace('<div class="num">%d</div>' % unit.n, '<div class="num sm">%s</div>' % esc(only))
                      .replace('<div class="title">%s</div>' % unit.title, '<div class="title">%s</div>' % lt)
                      .replace('<div class="tag">%s</div>' % unit.tagline, '<div class="tag">%s</div>' % (md(ch0["goal"])[3:-4] if ch0.get("goal") else unit.tagline))
                      .replace('STUDY GUIDE</div>', 'STUDY GUIDE  ·  UNIT %d</div>' % unit.n))
    copy = ('<section class="copy"><div class="mark"><img src="%s"><div><h2>Social Circle High School Computer Science</h2><div>AP® Computer Science Principles Study Guide Series</div></div></div>'
            '<p><b>%s</b></p><p>© 2026 Social Circle High School Computer Science. All rights reserved. No part of this guide may be reproduced, shared, or posted online without written permission.</p>'
            '<p>AP® and Advanced Placement® are registered trademarks of the College Board, which was not involved in the production of, and does not endorse, this product. '
            'Python® is a trademark of the Python Software Foundation. All other names are the property of their owners. The company names used in examples are fictional or used only to illustrate ideas.</p>'
            '<p>Interactive notes, walkthroughs, and games that go with this guide are at <b>%s/apcsp</b>.</p></section>' % (logo, ("Lesson %s: %s (Unit %d: %s)" % (only, titles[0][1], unit.n, unit.title)) if only else ("Unit %d: %s" % (unit.n, unit.title)), SITE))
    how = ('<div class="legend"><p class="lg-intro">Every lesson in this book is laid out the same way, in the same order, so you always know where to look.</p>'
           '<div class="lgrow"><span class="lgt a">AT A GLANCE</span><div><b>The box under the lesson title.</b> The goal of the lesson, the words you need, and where the matching walkthrough, assignment, and game are on the site.</div></div>'
           '<div class="lgrow"><span class="lgt l">LEARN</span><div><b>The ideas, in plain words.</b> Every new word is explained before it is used.</div></div>'
           '<div class="lgrow"><span class="lgt e">EXAMPLE</span><div><b>Annotated code and diagrams.</b> Follow each colored arrow to the exact piece it explains.</div></div>'
           '<div class="lgrow"><span class="lgt t">TRACE IT</span><div><b>Play computer.</b> Step through code one line at a time and watch every variable change. There are several in every lesson.</div></div>'
           '<div class="lgrow"><span class="lgt w">WATCH OUT</span><div><b>The mistakes people really make,</b> why they happen, and how to fix them.</div></div>'
           '<div class="lgrow"><span class="lgt x">AP EXAM</span><div><b>What the exam asks</b> about the lesson.</div></div>'
           '<div class="lgrow"><span class="lgt c">CHECK YOURSELF</span><div><b>Practice questions.</b> Cover the answers, try them, then read the reason in the answer key at the back.</div></div></div>')
    B = unit.brand
    if B:   # a guide that is not AP CSP (the IST guides) swaps the AP wording for its own
        cover = cover.replace("AP® COMPUTER SCIENCE PRINCIPLES  ·  STUDY GUIDE", B["kicker"])
        copy = (copy.replace("AP® Computer Science Principles Study Guide Series", B["series"]).replace("%s/apcsp" % SITE, B["site"])
                    .replace("AP® and Advanced Placement® are registered trademarks of the College Board, which was not involved in the production of, and does not endorse, this product. Python® is a trademark of the Python Software Foundation. All other names are the property of their owners.", B["legal"]))
        how = re.sub(r'<div class="lgrow"><span class="lgt x">AP EXAM</span>.*?</div></div>', "", how, flags=re.S)
        how = how.replace("Step through code one line at a time and watch every variable change. There are several in every lesson.", B.get("trace_legend", ""))
        how = how.replace("where the matching walkthrough, assignment, and game are on the site", B.get("glance_legend", "where the matching walkthrough, assignment, and game are on the site"))
    objectives = '<ul class="objectives">%s</ul>' % "".join("<li>%s</li>" % o for o in unit.objectives)
    toc_rows = ""
    for cid, t in titles:
        toc_rows += '<li><span class="n">%s</span><span class="t">%s</span><span class="p">%s</span></li>' % (esc(cid), t, toc_pages.get(cid, "00"))
    extras = []
    if unit.cheat and not only: extras.append(("cheat", "Quick Reference"))
    if glossary: extras.append(("gloss", "Glossary"))
    if ctx.key: extras.append(("key", "Answer Key"))
    for k, t in extras:
        toc_rows += '<li class="sub"><span class="n">&#9656;</span><span class="t">%s</span><span class="p">%s</span></li>' % (t, toc_pages.get(k, "00"))
    front = ('<section class="front"><h2>What You Will Learn</h2>%s%s<h2 style="margin-top:.3in">How to Use This Guide</h2>%s</section>' % (unit.front_extra, objectives, how))
    toc = '<section class="front"><h2>Contents</h2><ul class="toc">%s</ul></section>' % toc_rows
    if only: front = toc = ""
    tail = ""
    if unit.cheat and not only:
        tail += '<section class="chapter cheat"><span class="mk" style="font-size:1pt;color:#fff;position:absolute">ZZCcheatZZ</span><div class="chead"><div class="badge"><small>UNIT</small><b>%d</b></div><h2>Quick Reference</h2><p class="kick">The whole unit on one or two pages. Tear it out and keep it beside you while you code.</p></div>%s</section>' % (unit.n, "".join(unit.cheat))
    if glossary:
        g = "".join('<div class="g"><b>%s</b>%s</div>' % (esc(t), (md(d)[3:-4] if unit.brand else d)) for t, d in sorted(glossary, key=lambda x: x[0].lower()))
        tail += '<section class="chapter"><span class="mk" style="font-size:1pt;color:#fff;position:absolute">ZZCglossZZ</span><div class="chead"><div class="badge"><small>UNIT</small><b>%d</b></div><h2>Glossary</h2><p class="kick">The vocabulary of this %s, in plain words.</p></div><div class="gloss">%s</div></section>' % (unit.n, "lesson" if only else "unit", g)
    if ctx.key:
        k = ""
        for cid, items in ctx.key:
            cm = [t for c, t in titles if c == cid][0]
            k += '<div class="keychap">Lesson %s  ·  %s</div><div class="ans">%s</div>' % (esc(cid), cm, "".join('<div class="a"><span class="k">%s</span><span class="l">%s</span>%s</div>' % (q, l, w) for q, l, w in (list(items) + list(getattr(ctx, "extra_key", {}).get(cid, [])))))
        tail += '<section class="chapter"><span class="mk" style="font-size:1pt;color:#fff;position:absolute">ZZCkeyZZ</span><div class="chead"><div class="badge"><small>UNIT</small><b>%d</b></div><h2>Answer Key</h2><p class="kick">Every practice question, with the reason behind the answer.</p></div>%s</section>' % (unit.n, k)
    doc = '<!doctype html><html><head><meta charset="utf-8"><title>%s Unit %d Study Guide: %s</title>' \
          '<style>%s</style><style>%s</style></head><body>%s%s%s%s%s</body></html>' % (unit.brand.get("doctitle", "AP CSP"), unit.n, unit.title, font_css(), css, cover, front, toc, "".join(chapters), tail)
    return doc, titles, [k for k, _ in extras]
