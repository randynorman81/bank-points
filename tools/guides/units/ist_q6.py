"""Check-yourself questions for the Unit 6 guide: drawn from the same generator as the game bank and practice test (tools/css5/qgen5*.py); every answer is confirmed in a real browser."""
import os, sys, random, json
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "bs6")); sys.path.insert(0, os.path.join(ROOT, "tools", "ist"))
import qgen6, qgen6b
from qgen6 import Skip
T = {22: qgen6.L22_T, 23: qgen6.L23_T, 24: qgen6.L24_T, 25: qgen6b.L25_T, 26: qgen6b.L26_T, 27: qgen6b.L27_T}
F = {22: qgen6.L22_FACTS, 23: qgen6.L23_FACTS, 24: qgen6.L24_FACTS, 25: qgen6b.L25_FACTS, 26: qgen6b.L26_FACTS, 27: qgen6b.L27_FACTS}
GUIDE_QS = []
import re, html
def code(s): return re.sub(r"`([^`]+)`", lambda m: "<code>%s</code>" % html.escape(m.group(1), quote=False), s)
def QS(l, nfacts=5, ntemp=9, seed=0):
    rng = random.Random(9700 + l * 10 + seed); out = []; seen = set()
    facts = list(F[l]); rng.shuffle(facts)
    for f in facts:
        q = qgen6.qgen.fact_q(rng, l, f)
        if q["key"] not in seen: seen.add(q["key"]); out.append(q)
        if len(out) >= nfacts: break
    ts = list(T[l]); k = 0; guard = 0
    while len(out) < nfacts + ntemp and guard < 800:
        guard += 1
        try: q = ts[k % len(ts)](rng)
        except Skip: continue
        if q["key"] in seen: continue
        seen.add(q["key"]); out.append(q); k += 1
    rng.shuffle(out)
    targets = [i % 4 for i in range(len(out))]; rng.shuffle(targets)
    for q, t in zip(out, targets):
        o = q["o"]; a = q["a"]; o[a], o[t] = o[t], o[a]; q["a"] = t
    for q in out: q["id"] = "G%d:%d" % (l, len(GUIDE_QS)); GUIDE_QS.append(q)
    return [dict(s=code(q["s"]), o=q["o"], a=[q["a"]], e=code(q["e"]), **({"c": q["c"]} if q.get("c") else {})) for q in out]
