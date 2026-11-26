"""Authoring helpers for the IST study guides: annotated HTML examples with a picture of the page, and page traces.
Every picture is taken in a real browser (work/ist/shots.mjs) and every trace row is confirmed against the browser's own text (the same script)."""
import os, sys, json, re, base64, subprocess, hashlib, html as _html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "ist"))
import gl
from gl import *            # md, annot_code, trace, tbl, watch, Q-style helpers ...
from lesson import L, A, Q, X   # noqa  (L builds a chapter)
from html_model import parse, HtmlError, page_lines_noimg, full_page
from ist_core import describe_line

WORK = os.path.join(HERE, "work", "ist"); os.makedirs(WORK, exist_ok=True)
LAB = "https://schscomputerscience.com/ist/unit-6/lab/"
SHOTS = {}      # id -> html to photograph
TRACES = []     # {id, html, expect} browser checks
gl.LANG = "html"

def local_images(h):
    """the pictures used in examples are the site's own practice pictures; for the photograph they are read from this folder"""
    def rep(m):
        name = m.group(1); p = os.path.join(ROOT, "ist", "unit-6", "lab", name)
        return "data:image/svg+xml;base64," + base64.b64encode(open(p, "rb").read()).decode()
    return re.sub(re.escape(LAB) + r"([a-z]+\.svg)", rep, h)

def shot_id(page): return "s" + hashlib.md5(page.encode()).hexdigest()[:10]
def page_of(code):
    """an example may be just the body lines: wrap it in the skeleton so a browser can show it"""
    return full_page(code.strip("\n"))

def picture(title, code, caption=None, width=560):
    """the page the code makes, photographed in a real browser (the picture file is made by shots.mjs before the book is built)"""
    page = page_of(code); sid = shot_id(page); SHOTS[sid] = local_images(page)
    path = os.path.join(WORK, sid + ".png")
    src = "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode() if os.path.exists(path) else ""
    t = '<div style="font:700 9.4pt Manrope;color:#1F2937;margin:0 0 5pt 2pt">%s</div>' % esc(title)
    frame = ('<div style="border:1.2pt solid #CBD5E1;border-radius:7pt;overflow:hidden;background:#fff;max-width:%dpx">'
             '<div style="background:#F1F5F9;border-bottom:1pt solid #CBD5E1;padding:4pt 8pt;font:700 7.4pt Manrope;letter-spacing:.1em;color:#64748B">WHAT THE BROWSER SHOWS</div>'
             '<img src="%s" style="display:block;width:100%%"></div>' % (width, src))
    cap = ('<figcaption>%s%s</figcaption>' % (gl.FIGMARK, caption)) if caption else ""
    return '<figure class="fig">%s%s%s</figure>' % (t, frame, cap)

def HX(title, code, notes, cap=None, shot=True, shot_cap=None, render=None):
    """annotated HTML (arrows from each note to the exact piece of code) and, under it, the page the code makes.
    render = the code to photograph when the code shown had to be wrapped over several lines to fit"""
    snippet = code.strip("\n")
    out = annot_code(title, snippet, notes, caption=cap, lang="HTML")
    if shot: out += picture("The page this code makes", render if render is not None else snippet, shot_cap)
    return out

def TX(title, code, cap=None, names=("The browser does", "The page so far")):
    """a page trace: one row per line of code, what the browser does with that line and the page it has built so far (the rows are checked in a real browser)"""
    lines = code.strip("\n").split("\n"); rows = []; checks = []
    for i, ln in enumerate(lines):
        prefix = "\n".join(lines[:i + 1])
        try: root = parse(prefix, partial=True); shown = page_lines_noimg(root)
        except HtmlError: shown = []
        what = describe_line(ln)
        rows.append((i + 1, {names[0]: what, names[1]: " / ".join(shown) if shown else "nothing yet"}))
        checks.append(dict(html=local_images(full_prefix(prefix)), expect=shown))
    TRACES.append(dict(id=title, checks=checks))
    return trace(title, "\n".join(lines), list(names), rows, cap)

def full_prefix(prefix):
    """the lines so far, as a browser would receive them (an unfinished page is fine: the browser closes what is open)"""
    if re.search(r"<html[\s>]", prefix, re.I): return prefix
    return "<!DOCTYPE html>\n<html>\n<head>\n<title>t</title>\n</head>\n<body>\n" + prefix + "\n</body>\n</html>"

def save_jobs():
    json.dump(dict(shots=SHOTS, traces=TRACES), open(os.path.join(WORK, "jobs.json"), "w"))
