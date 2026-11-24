"""Authoring shortcuts for the lesson-by-lesson guides. A lesson is: goal, words, learn, ex, tr, bad, ap, q (see gl.chapter_html for the fixed layout)."""
from gl import *

def _run_checked(code, rows, out, inp, title):
    """Run the code for real and check the authored trace rows and printed output against what Python does."""
    import ast, io, sys, contextlib
    src = code.strip("\n"); events = []; buf = io.StringIO(); feed = list(inp or [])
    def snap(frame):
        st = dict(frame.f_globals)
        if frame.f_code.co_name != "<module>": st.update(frame.f_locals)
        return st
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<trace>": return tracer
        if event in ("line", "return"): events.append((frame.f_lineno if event == "line" else None, snap(frame), id(frame)))
        return tracer
    g = {"__name__": "__trace__", "input": lambda p="": (buf.write(str(p)), feed.pop(0))[1]}
    err = None
    try:
        co = compile(src, "<trace>", "exec"); sys.settrace(tracer)
        with contextlib.redirect_stdout(buf): exec(co, g)
    except Exception as e: err = "%s: %s" % (type(e).__name__, e)
    finally: sys.settrace(None)
    final = dict(g)
    pos = 0; done = {}
    for ln, vals in rows:
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

def T(title, code, rows, out=None, cap=None, vars=None, inp=None, check=True):
    """Trace table. rows = ["1| name=\"Ana\"; age=15", "2| age=16", ...] (line number, then var=value pairs, values written as they should print)."""
    parsed = []; order = []
    for r in rows:
        ln, _, rest = r.partition("|"); vals = {}
        for pair in [p for p in rest.split(";") if p.strip()]:
            k, _, v = pair.strip().partition("=")
            vals[k.strip()] = v.strip()
            if k.strip() not in order: order.append(k.strip())
        parsed.append((int(ln), vals))
    if check: _run_checked(code, parsed, out, inp, title)
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
