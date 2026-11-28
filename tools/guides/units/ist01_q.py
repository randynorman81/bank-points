"""Check-yourself questions for the Unit 1 guide: drawn from the same bank as the quiz games and the practice test (tools/comp8/bank_ist1.py), already fact-checked."""
import os, sys, random, re, html
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "tools", "comp8"))
import bank_ist1
def _e(s): return html.escape(s, quote=False)
def QS(n, count=20):
    """n = bank number 1..10 (lesson 1.1 .. 1.9 plus the extra); takes the 6 practice-test questions first, then spreads the rest across topics"""
    nums = n if isinstance(n, (list, tuple)) else (n,)
    if len(nums) > 1:
        out = []
        for k in nums: out += QS(k, count // len(nums) + (1 if k == nums[0] and count % len(nums) else 0))
        return out
    _, _, qs = bank_ist1.B[nums[0]]
    test, game = qs[-6:], qs[:-6]
    pick = list(test); seen = {q["t"] for q in test}
    for q in game:
        if len(pick) >= count: break
        if q["t"] not in seen: pick.append(q); seen.add(q["t"])
    for q in game:
        if len(pick) >= count: break
        if q not in pick: pick.append(q)
    rng = random.Random(7100 + n); rng.shuffle(pick)
    out = []; targets = [i % 4 for i in range(len(pick))]; rng.shuffle(targets)
    for q, t in zip(pick, targets):
        opts = [q["c"]] + list(q["w"])[:3]; rng.shuffle(opts); a = opts.index(q["c"]); opts[a], opts[t] = opts[t], opts[a]
        out.append(dict(s=_e(q["s"]), o=[_e(o) for o in opts], a=[t], e=_e(q["e"])))
    return out
