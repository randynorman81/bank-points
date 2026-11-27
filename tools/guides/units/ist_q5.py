"""Check-yourself questions for the Unit 5 guide: drawn from the same generator as the game bank and practice test (tools/css5/qgen5*.py); every answer is confirmed in a real browser."""
import os, sys, random, json
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "css5")); sys.path.insert(0, os.path.join(ROOT, "tools", "ist"))
import qgen5, qgen5b, qgen5c
from qgen5 import Skip
T = {16: qgen5.L16_T, 17: qgen5b.L17_T, 18: qgen5b.L18_T, 19: qgen5b.L19_T, 20: qgen5c.L20_T, 21: qgen5c.L21_T}
F = {16: qgen5.L16_FACTS, 17: qgen5b.L17_FACTS, 18: qgen5b.L18_FACTS, 19: qgen5b.L19_FACTS, 20: qgen5c.L20_FACTS, 21: qgen5c.L21_FACTS}
GUIDE_QS = []
import re, html
def code(s): return re.sub(r"`([^`]+)`", lambda m: "<code>%s</code>" % html.escape(m.group(1), quote=False), s)
def QS(l, nfacts=5, ntemp=9, seed=0):
    rng = random.Random(9500 + l * 10 + seed); out = []; seen = set()
    facts = list(F[l]); rng.shuffle(facts)
    for f in facts:
        q = qgen5.qgen.fact_q(rng, l, f)
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
