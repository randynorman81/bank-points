/* PYTHON ANSWER-KEY CHECK. Every code question in the Python lesson vaults (Units 3 to 6) carries x.py = { code, out, inp, err }.
   This runs each program in REAL Python (python3) and proves the answer the game marks right is exactly what the program prints
   (or the error it raises). Questions that are only facts have nothing to run.
   usage: node tools/missions/pycheck.mjs [lessonId,lessonId] [seeds]   (needs python3) */
import { spawn } from "child_process";
import { PY_VAULTS, makeQuestion } from "../../netlify/functions/gamebank.js";
const only = process.argv[2] && process.argv[2] !== "all" ? process.argv[2].split(",") : null, SEEDS = Number(process.argv[3] || 60);
const WORKER = `
import sys, json, io, signal, builtins, contextlib
def run(code, inp):
    q = list(inp)
    def fake_input(prompt=""):
        if not q: raise EOFError("no more input")
        return q.pop(0)
    builtins.input = fake_input
    buf = io.StringIO(); err = ""
    def alarm(s, f): raise TimeoutError("took too long")
    signal.signal(signal.SIGALRM, alarm); signal.alarm(3)
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(code, "q", "exec"), {"__name__": "__main__"})
    except BaseException as e:
        err = type(e).__name__
    finally:
        signal.alarm(0)
    return buf.getvalue(), err
for line in sys.stdin:
    j = json.loads(line)
    out, err = run(j["code"], j.get("inp", []))
    sys.stdout.write(json.dumps({"out": out, "err": err}) + "\\n"); sys.stdout.flush()
`;
const py = spawn("python3", ["-I", "-c", WORKER], { stdio: ["pipe", "pipe", "inherit"] });
let buf = "", waiting = [];
py.stdout.on("data", (d) => { buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); const w = waiting.shift(); if (w) w(JSON.parse(line)); } });
const runPy = (code, inp) => new Promise((res) => { waiting.push(res); py.stdin.write(JSON.stringify({ code, inp }) + "\n"); });
let bad = 0, checked = 0, facts = 0;
const say = (m) => { bad++; if (bad <= 25) console.log("  PROBLEM: " + m); };
for (const L of PY_VAULTS) {
  if (only && !only.includes(L.id)) continue;
  let n = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const seed = (s * 2654435761) >>> 0;
    for (let i = 0; i < 10; i++) {
      const x = makeQuestion(L.id, seed, i);
      if (!x.py) { facts++; continue; }
      const got = await runPy(x.py.code, x.py.inp || []); checked++; n++;
      const shown = x.q.choices[x.a.idx];
      if (x.py.err) {
        if (got.err !== x.py.err) say(`${L.id} seed ${seed} r${i}: expected ${x.py.err} but Python gave ${got.err || "no error"}\n${x.py.code}`);
        if (shown !== x.py.err) say(`${L.id} seed ${seed} r${i}: the marked answer is "${shown}", not ${x.py.err}`);
        continue;
      }
      if (got.err) { say(`${L.id} seed ${seed} r${i}: Python raised ${got.err}\n${x.py.code}`); continue; }
      const out = got.out.replace(/\n$/, "");
      if (out !== x.py.out) say(`${L.id} seed ${seed} r${i}: the key says ${JSON.stringify(x.py.out)} but Python printed ${JSON.stringify(out)}\n${x.py.code}`);
      const want = out === "" ? "Nothing is printed" : out.split("\n").join(" then ");
      if (shown !== want) say(`${L.id} seed ${seed} r${i}: the marked choice is "${shown}" but the real output is "${want}"\n${x.py.code}`);
    }
  }
  console.log(`${L.id.padEnd(6)} ${String(n).padStart(4)} code questions run in real Python`);
}
py.stdin.end();
console.log(bad ? `\n${bad} PROBLEMS (${checked} programs run)` : `\nall ${checked} programs match their answer keys in real Python (${facts} fact questions have nothing to run)`);
process.exit(bad ? 1 : 0);
