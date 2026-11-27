"""Check-yourself questions for the IST guide: drawn from the same generator as the game bank and practice test (every answer is confirmed in a real browser)."""
import os, sys, random, json
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "ist"))
import qgen
GUIDE_QS = []     # every question that went into the guide, with its browser checks
def QS(l, nfacts=5, ntemp=9, seed=0):
    rng = random.Random(9000 + l * 10 + seed); out = []; seen = set()
    facts = list(qgen.LESSON_FACTS[l]); rng.shuffle(facts)
    for f in facts:
        q = qgen.fact_q(rng, l, f)
        if q["key"] not in seen: seen.add(q["key"]); out.append(q)
        if len(out) >= nfacts: break
    ts = list(qgen.LESSON_T[l]); k = 0; guard = 0
    while len(out) < nfacts + ntemp and guard < 500:
        guard += 1
        try: q = ts[k % len(ts)](rng)
        except qgen.Skip: continue
        if q["key"] in seen: continue
        seen.add(q["key"]); out.append(q); k += 1
    rng.shuffle(out)
    targets = [i % 4 for i in range(len(out))]; rng.shuffle(targets)    # the right answer is spread over A, B, C and D
    for q, t in zip(out, targets):
        o = q["o"]; a = q["a"]; o[a], o[t] = o[t], o[a]; q["a"] = t
    for q in out: q["id"] = "G%d:%d" % (l, len(GUIDE_QS)); GUIDE_QS.append(q)
    return [dict(s=q["s"], o=q["o"], a=[q["a"]], e=q["e"], **({"c": q["c"]} if q.get("c") else {})) for q in out]
