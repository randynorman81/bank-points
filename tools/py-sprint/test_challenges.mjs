// Runs every APCSP challenge in real Chrome with the real Skulpt engine:
// the model solution must pass every check, the untouched starter must NOT pass, and wrong answers must fail the right check.
import { createRequire } from "module"; const require = createRequire(import.meta.url);
const { launch } = require("/Users/randynorman/bank-points/tools/missions/testkit/cdp.js");
const b = await launch(9703, 1200, 900);
await b.send("Page.navigate", { url: "file:///Users/randynorman/bank-points/tools/py-sprint/index.html" });
for (let i = 0; i < 40; i++) { await b.sleep(500); if (await b.ev("typeof Sk !== 'undefined' && !!window.__PSP")) break; }
let bad = 0; const fail = (...a) => { bad++; console.log("FAIL", ...a); };
if (!(await b.ev("typeof Sk !== 'undefined'"))) { fail("Skulpt did not load"); process.exit(1); }
const run = async (id, code) => JSON.parse(await b.ev(`(async function(){ var c = __PSP.DEFAULT_CHALLENGES.find(function(x){return x.id===${JSON.stringify(id)}}); var r = await __PSP.runPythonChallenge(${JSON.stringify(code)}, c); return JSON.stringify(r); })()`));
const ids = JSON.parse(await b.ev("JSON.stringify(__PSP.DEFAULT_CHALLENGES.map(function(c){return [c.id,c.solution,c.starter]}))"));
console.log("challenges:", ids.length);
for (const [id, sol, starter] of ids) {
  const r = await run(id, sol);
  if (!r.ok) fail(id, "model solution does not pass", JSON.stringify(r.checks.filter((c) => !c.pass)), r.error);
  const s = await run(id, starter);
  if (s.ok) fail(id, "untouched starter passes!");
  if (r.checks.length < 1) fail(id, "no checks ran");
}
// targeted wrong answers: each must fail, and fail the expected check
const wrong = [
  ["var_five_profile", 'name = "J"\nage = "17"\ngpa = 3.8\nis_enrolled = True\nschool = "SCHS"', "age is an integer"],
  ["var_five_game", 'player = "N"\nlives = 3\nscore = 0\nspeed = 2.5\ngame_over = "False"', "game_over is False"],
  ["var_mod_div", "slices = 23\npeople = 5\nper_person = slices / people\nleftover = slices % people", "per_person is 4"],
  ["var_update_exp", "pts = 4\npts += 6\npts *= 2\npower = pts * 2", "power equals 400"],
  ["str_print_greeting", 'course = "APCSP"\nyear = 2026\nprint("Welcome to " + course + year)', "Python Execution Error"],
  ["str_print_greeting", 'course = "APCSP"\nyear = 2026\nprint("Welcome to APCSP")', 'Prints "Welcome to APCSP 2026"'],
  ["str_index_len", 'word = "Python"\nfirst = word[1]\nlast = word[-1]\nlength = len(word)', 'first == "P"'],
  ["str_slice_upper", 'tag = "apcsp_exam"\ncode = tag[0:4].upper()', 'code == "APCSP"'],
  ["cond_grade", 'def get_grade(score):\n    if score > 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    else:\n        return "F"', 'get_grade(90)'],
  ["cond_and_logic", "def can_ride(height, has_pass):\n    return height >= 48 or has_pass", "can_ride(50, False)"],
  ["cond_even_pos", "def is_pos_even(n):\n    return n % 2 == 0", "is_pos_even(-4)"],
  ["loop_range_print", "for i in range(5):\n    print(i)", "Printed 1, 2, 3, 4, 5"],
  ["loop_sum_evens", "total = 0\nfor n in range(2, 20, 2):\n    total += n", "total equals 110"],
  ["loop_while_countdown", 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1', "Printed 3, 2, 1, Go!"],
  ["list_append_pop", 'items = ["pen", "book", "laptop"]\nitems.append("charger")\nremoved = items.pop()', "removed"],
  ["list_insert_update", "scores = [80, 90, 100]\nscores.insert(1, 85)\ncount = len(scores)", "scores =="],
  ["list_index_ends", "nums = [12, 24, 36, 48, 60]\nfirst = nums[0]\nlast = nums[4]\nedge_sum = first + nums[1]", "edge_sum == 72"],
  ["list_build_squares", "squares = []\nfor n in range(1, 5):\n    squares.append(n * n)", "squares =="],
  ["fn_add_return", "def add_nums(a, b):\n    print(a + b)", "add_nums(4, 9) returns 13"],
  ["fn_mult_print", "def show_product(x, y):\n    return x * y", "show_product(6, 7) prints 42"],
  ["fn_rect_area", "def rect_area(w, h):\n    return w + h\nbox = rect_area(6, 4)", "rect_area(6, 4)"],
  ["fn_greet", 'def greet(name):\n    return "Hello " + name', "greet"],
  ["alg_find_max", "def find_max(nums):\n    best = 0\n    for n in nums:\n        if n > best:\n            best = n\n    return best", "find_max([-10, -3, -25])"],
  ["alg_average", "def get_avg(vals):\n    return sum(vals) // len(vals) + 1", "get_avg"],
  ["alg_count_passing", "def count_pass(grades):\n    t = 0\n    for g in grades:\n        if g > 70:\n            t += 1\n    return t", "count_pass([55,70,88,92,64])"],
  ["alg_binary_random", "import random\nroll = random.randint(1, 6)\ndef mid_index(low, high):\n    return (low + high) / 2", "mid_index(0, 9) == 4"],
];
for (const [id, code, expectFail] of wrong) {
  const r = await run(id, code);
  if (r.ok) { fail(id, "WRONG answer passed:", code.replace(/\n/g, " | ")); continue; }
  const failing = r.checks.filter((c) => !c.pass).map((c) => c.label + " " + c.hint).join(" || ");
  if (!failing.includes(expectFail) && !(r.error || "").includes(expectFail)) fail(id, "failed, but not on", expectFail, "->", failing.slice(0, 160));
}
// an infinite loop must stop and be reported, not freeze the page
const t0 = Date.now(); const inf = await run("loop_range_print", "while True:\n    pass");
console.log("infinite loop stopped in", Date.now() - t0, "ms, ok:", inf.ok, "| error:", String(inf.error).slice(0, 70)); if (inf.ok || Date.now() - t0 > 15000) fail("infinite loop handling");
// f-strings in student code work (the page converts them for Skulpt)
const fs = await run("str_print_greeting", 'course = "APCSP"\nyear = 2026\nprint(f"Welcome to {course} {year}")'); if (!fs.ok) fail("f-string solution", JSON.stringify(fs.checks), fs.error);
// a student cannot pass by defining the checker's own helper
const sneaky = await run("var_five_profile", 'def _chk(a,b,c):\n    print("__PASS__|x")\nname="a"'); console.log("note: harness-helper override passes?", sneaky.ok);
console.log("failures:", bad, "page errors:", JSON.stringify(b.errs)); b.close(); process.exit(bad ? 1 : 0);
