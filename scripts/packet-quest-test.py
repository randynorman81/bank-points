"""Checks every Packet Quest coding level: each reference solution must pass every variant, and each wrong solution must fail.
Run from the repo root:  python3 scripts/packet-quest-test.py"""
import json, subprocess, sys, os
sys.path.insert(0, "apcsp/packet-quest")
import sim
levels = json.loads(subprocess.check_output(["node", "-e", "const W=require('./apcsp/packet-quest/levels.js').WORLDS;console.log(JSON.stringify(W.flatMap(w=>w.levels)))"]))
print(sum(1 for L in levels if L.get("ty") != "frq"), "coding levels,", sum(1 for L in levels if L.get("ty") == "frq"), "written responses")
sol = json.load(open("scripts/packet-quest-solutions.json"))
bad = 0
for L in levels:
    if L.get("ty") == "frq":
        continue
    s = sol.get(L["id"])
    if not s:
        print("NO SOLUTION", L["id"]); bad += 1; continue
    for code in s["ok"]:
        r = json.loads(sim.run_request(json.dumps({"code": code, "level": L})))
        if not r["passed"]:
            bad += 1
            print("FAIL (should pass)", L["id"], r.get("syntax"), r["static"], [(x["seed"], x["error"], x["ended"], [g for g in x["goals"] if not g["ok"]], x["printed"][-3:]) for x in r["runs"] if not x["ok"]])
    for code in s["bad"]:
        r = json.loads(sim.run_request(json.dumps({"code": code, "level": L})))
        if r["passed"]:
            bad += 1
            print("PASSED (should fail)", L["id"], repr(code[:60]))
    # starter code must not already pass
    r = json.loads(sim.run_request(json.dumps({"code": L.get("starter", ""), "level": L})))
    if r["passed"]:
        bad += 1; print("STARTER PASSES", L["id"])
print("checked:", bad, "problems")
