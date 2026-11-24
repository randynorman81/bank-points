"""Authoring shortcuts for the lesson-by-lesson guides. A lesson is: goal, words, learn, ex, tr, bad, ap, q (see gl.chapter_html for the fixed layout)."""
from gl import *


def _karel_env(g, balls=None, size=(8, 8)):
    """A tiny Karel world so Karel traces are checked by running them. Columns are avenues, rows are streets (1 at the bottom)."""
    W, H = size; b = dict(balls or {}); st = {"x": 1, "y": 1, "d": 0}
    names = ["East", "North", "West", "South"]; dx = [1, 0, -1, 0]; dy = [0, 1, 0, -1]
    def sync():
        g["avenue"] = st["x"]; g["street"] = st["y"]; g["facing"] = names[st["d"]]; g["balls_here"] = b.get((st["x"], st["y"]), 0)
    def ahead(d):
        return st["x"] + dx[d], st["y"] + dy[d]
    def clear(d):
        nx, ny = ahead(d % 4); return 1 <= nx <= W and 1 <= ny <= H
    def move():
        if not clear(st["d"]): raise RuntimeError("Karel hit a wall")
        st["x"], st["y"] = ahead(st["d"]); sync()
    def turn_left(): st["d"] = (st["d"] + 1) % 4; sync()
    def turn_right(): st["d"] = (st["d"] - 1) % 4; sync()
    def turn_around(): st["d"] = (st["d"] + 2) % 4; sync()
    def put_ball(): b[(st["x"], st["y"])] = b.get((st["x"], st["y"]), 0) + 1; sync()
    def take_ball():
        if b.get((st["x"], st["y"]), 0) < 1: raise RuntimeError("Karel tried to take a ball that is not there")
        b[(st["x"], st["y"])] -= 1; sync()
    env = dict(move=move, turn_left=turn_left, turn_right=turn_right, turn_around=turn_around, put_ball=put_ball, take_ball=take_ball,
               front_is_clear=lambda: clear(st["d"]), left_is_clear=lambda: clear(st["d"] + 1), right_is_clear=lambda: clear(st["d"] - 1),
               ball_present=lambda: b.get((st["x"], st["y"]), 0) > 0)
    sync(); return env

def _run_checked(code, rows, out, inp, title, karel=None):
    """Run the code for real and check the authored trace rows and printed output against what Python does."""
    import ast, io, sys, contextlib
    src = code.strip("\n"); events = []; buf = io.StringIO(); feed = list(inp or [])
    import copy
    def snap(frame):
        st = dict(frame.f_globals)
        if frame.f_code.co_name != "<module>": st.update(frame.f_locals)
        out = {}
        for k, v in st.items():
            if k.startswith("__") or callable(v) or isinstance(v, type(sys)): continue
            try: out[k] = copy.deepcopy(v)
            except Exception: out[k] = v
        return out
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<trace>": return tracer
        if len(events) > 50000: raise RuntimeError("too many steps (infinite loop?)")
        if event in ("line", "return"): events.append((frame.f_lineno if event == "line" else None, snap(frame), id(frame)))
        return tracer
    g = {"__name__": "__trace__", "input": lambda p="": (buf.write(str(p)), feed.pop(0))[1]}
    err = None
    if karel is not None: g.update(_karel_env(g, **karel))
    try:
        co = compile(src, "<trace>", "exec"); sys.settrace(tracer)
        with contextlib.redirect_stdout(buf): exec(co, g)
    except Exception as e: err = "%s: %s" % (type(e).__name__, e)
    finally: sys.settrace(None)
    final = {k: copy.deepcopy(v) for k, v in g.items() if not k.startswith('__') and not callable(v) and not isinstance(v, type(sys))}
    pos = 0; done = {}
    for ln, vals in rows:
        if ln == 0: continue
        p0 = pos
        while pos < len(events) and events[pos][0] != ln: pos += 1
        if pos >= len(events) and ln in done:
            pos = p0; after = done[ln]; adv = False       # a call line seen again after the function returned
        else:
            assert pos < len(events), "%s: line %d never ran in order" % (title, ln)
            fid = events[pos][2]; nxt = next((e for e in events[pos + 1:] if e[2] == fid), None)
            after = nxt[1] if nxt else final; done[ln] = after; adv = True
        for k, v in vals.items():
            try: want = ast.literal_eval(v)
            except Exception: continue
            assert k in after and after[k] == want and type(after[k]) == type(want), "%s: after line %d, %s should be %r but the trace says %s" % (title, ln, k, after.get(k), v)
        if adv: pos += 1
    if out is not None:
        got = buf.getvalue().strip(); want = out.strip()
        if err: assert want.startswith(err.split(":")[0]), "%s: expected %r, code raised %s" % (title, want, err)
        elif not inp: assert got == want, "%s: printed %r but the table says %r" % (title, got, want)

def T(title, code, rows, out=None, cap=None, vars=None, inp=None, check=True, karel=None):
    """Trace table. rows = ["1| name=\"Ana\"; age=15", "2| age=16", ...] (line number, then var=value pairs, values written as they should print)."""
    parsed = []; order = []
    for r in rows:
        ln, _, rest = r.partition("|"); vals = {}
        for pair in [p for p in rest.split(";") if p.strip()]:
            k, _, v = pair.strip().partition("=")
            vals[k.strip()] = v.strip()
            if k.strip() not in order: order.append(k.strip())
        parsed.append((int(ln), vals))
    import os
    if check or os.environ.get('FORCECHECK'):
        try: _run_checked(code, parsed, out, inp, title, karel)
        except AssertionError as e:
            if not check: print('UNCHECKED-FAIL:', e)
            else: raise
    return trace(title, code, vars or order, parsed, cap, out)

def _check_out(title, code, out):
    import io, contextlib
    if "input(" in code or "random" in code or "..." in code: return
    buf = io.StringIO(); g = {"__name__": "__ex__"}
    try:
        with contextlib.redirect_stdout(buf): exec(compile(code.strip("\n"), "<ex>", "exec"), g)
    except Exception as e:
        assert out.strip().startswith(type(e).__name__), "%s: code raised %s but out says %r" % (title, e, out)
        return
    assert buf.getvalue().strip() == out.strip(), "%s: example prints %r but out says %r" % (title, buf.getvalue().strip(), out.strip())

def A(title, code, notes, out=None, cap=None, check=True):
    if out and check: _check_out(title, code, out)
    return annot_code(title, code, notes, output=out.split("\n") if out else None, caption=cap)

def Q(s, o, a, e, c=None):
    d = dict(s=md(s)[3:-4], o=[md(x)[3:-4] for x in o], a=[a] if isinstance(a, int) else list(a), e=md(e)[3:-4])
    if c: d["c"] = c
    return d

def L(cid, goal, words, learn, ex, tr, bad, ap, q, **kw):
    """words = [(term, definition)], learn = [(title, md text or list)], ex/tr = lists of components, bad = [(looks like, goes wrong, fix)], ap = [bullets], q = [Q(...)]"""
    d = dict(id=cid, goal=goal, words=words, learn=learn, ex=ex, tr=tr, bad=watch(bad) if isinstance(bad, list) else bad, ap=ap, questions=q, online=True)
    d.update(kw); return d


def X(goal, words, tr, bad, ex=None, ap=None, q=None, **kw):
    """Extras for a lesson that already has a notes page: goal, words, extra examples, traces, and the watch-out table."""
    d = dict(goal=goal, words=words, tr=tr, bad=watch(bad))
    if ex: d["ex"] = ex
    if ap: d["ap"] = ap
    if q: d["questions"] = q
    d.update(kw); return d

def apply(unit, extras, renumber=None):
    """Merge extras into a unit's chapters (keyed by lesson id). renumber = {old id: new id}."""
    for ch in unit.chapters:
        if renumber and ch["id"] in renumber: ch["id"] = renumber[ch["id"]]
        if ch["id"] in extras: ch.update(extras[ch["id"]])
        for k in ("title", "kicker"):
            ch.pop(k, None) if k == "title" else None
    missing = [k for k in extras if k not in [c["id"] for c in unit.chapters]]
    assert not missing, "extras for unknown lessons: %s" % missing
    return unit


def K(title, code, rows, cap=None, out=None, balls=None, size=(8, 8)):
    """A Karel trace: the table shows Karel's avenue, street, facing, and the balls on its square after each line."""
    return T(title, code, rows, out=out, cap=cap, vars=["avenue", "street", "facing", "balls_here"], karel=dict(balls=balls, size=size))
