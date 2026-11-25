"""Build the Clark After Dark trivia bank + 1,000 games.

  python3 scripts/trivia/build.py            # builds everything and writes tools/trivia/data/*.js
  python3 scripts/trivia/build.py --check    # build only, print stats

Every question is generated from the tables and hand-written lines in scripts/trivia/src/*.py.
Anything listed in scripts/trivia/drop.txt is removed. The 5,000-question bank is a balanced cut:
no genre may exceed the water-fill cap so no single topic dominates.
"""
import sys, os, importlib, json, collections, random, re, zlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, "src"))
import lib

MODS = ["geo", "sci", "nat", "his", "mov", "tv", "mus", "spt", "lit", "food", "pop", "tec", "wrd", "art", "extras"]
TARGET = 5000
OUT = os.path.join(HERE, "..", "..", "tools", "trivia", "data")

for m in MODS:
    importlib.import_module(m).build()

drops = [l.strip() for l in open(os.path.join(HERE, "drop.txt")) if l.strip()]
rows = [r for r in lib.ROWS if not any(d in r[3] for d in drops)]

# --- quality filters ---
clean = []
for cat, topic, d, q, a, w in rows:
    if len(q) > 220 or len(str(a)) > 70 or any(len(str(x)) > 70 for x in w):
        continue
    if "skip" in q.lower().split("?")[-1]:
        continue
    na, nq = lib.norm(str(a)), lib.norm(q)
    if len(na) >= 4 and not na.isdigit() and (" " + na + " ") in (" " + nq + " "):
        continue   # the question gives the answer away
    clean.append([cat, topic, d, q, str(a), [str(x) for x in w]])
rows = clean

# --- water-fill to TARGET, stratified by topic ---
by_cat = collections.defaultdict(list)
for r in rows: by_cat[r[0]].append(r)
counts = {c: len(v) for c, v in by_cat.items()}
lo, hi = 1, max(counts.values())
while lo < hi:
    mid = (lo + hi) // 2
    if sum(min(n, mid) for n in counts.values()) >= TARGET: hi = mid
    else: lo = mid + 1
cap = lo
sel = []
rnd = random.Random(20260101)
for c in lib.CODES:
    items = by_cat[c]
    if len(items) <= cap:
        sel += items; continue
    by_topic = collections.defaultdict(list)
    for r in items: by_topic[r[1]].append(r)
    for v in by_topic.values(): rnd.shuffle(v)
    quota = {t: max(1, round(len(v) * cap / len(items))) for t, v in by_topic.items()}
    pick = []
    for t, v in by_topic.items(): pick += v[:quota[t]]
    # trim/extend to exactly cap
    rest = [r for t, v in by_topic.items() for r in v[quota[t]:]]
    rnd.shuffle(rest); rnd.shuffle(pick)
    while len(pick) > cap: pick.pop()
    while len(pick) < cap and rest: pick.append(rest.pop())
    sel += pick
# exact total
rnd.shuffle(sel)
extra = [r for c in lib.CODES for r in by_cat[c] if r not in sel]
rnd.shuffle(extra)
while len(sel) < TARGET and extra: sel.append(extra.pop())
while len(sel) > TARGET:
    big = collections.Counter(r[0] for r in sel).most_common(1)[0][0]
    for i in range(len(sel) - 1, -1, -1):
        if sel[i][0] == big: sel.pop(i); break

order = {c: i for i, c in enumerate(lib.CODES)}
sel.sort(key=lambda r: (order[r[0]], r[1], r[3]))
for i, r in enumerate(sel, 1): r.insert(0, i)  # id first

assert len(sel) == TARGET, len(sel)
topics = sorted({r[2] for r in sel})
tindex = {t: i for i, t in enumerate(topics)}
bank = [[r[0], r[1], tindex[r[2]], r[3], r[4], r[5], r[6]] for r in sel]  # id, cat, topicIdx, diff, q, a, wrong[3]

# sanity checks
ids = set()
for b in bank:
    assert b[0] not in ids; ids.add(b[0])
    assert b[5] not in b[6]
    assert len(set(b[6])) == 3
print("BANK", len(bank), "cap", cap)
print(" per genre", dict(collections.Counter(b[1] for b in bank)))
print(" difficulty", dict(collections.Counter(b[3] for b in bank)))
print(" topics", len(topics))

# --- extras ---
songs = []
for s, a, d in lib.MUSIC_ROUND: songs.append([s, a, d])
rebus = [list(r) for r in lib.REBUS]
print("music round pool", len(songs), "picture puzzles", len(rebus))

# --- 1,000 games ---
GAMES = 1000
NQ = 35
rng = random.Random(777)
use = collections.Counter()
by_c = {c: [b for b in bank if b[1] == c] for c in lib.CODES}
tb_pool = [b for b in bank if re.fullmatch(r"\d{1,6}", b[5].replace(",", "")) and b[4].lower().startswith(("how many", "how long", "how much", "how tall", "how old", "what is the speed", "at what temperature", "what is the atomic number"))]
tb_use = collections.Counter(); rb_use = collections.Counter(); sg_use = collections.Counter()
decs = ["Oldies", "1980s", "1990s", "2000s", "2010s+"]
songs_by = {d: [i for i, s in enumerate(songs) if s[2] == d] for d in decs}
games = []

def norm(s): return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()

STOP_ENT = set("U.S. American English French Spanish Greek Roman Italian Japanese German Chinese Norse Egyptian Christmas Halloween Olympics Georgia Super Bowl Academy Which What Who In The On A An How Name Complete At For This Each Where When Why Is Are Did Does Do Can Many Round Award Awards Cup Series World Hall Game Games United States Prize Day Great Man Woman Mount Lake River Fort Saint Island".split())
def ents(b):
    toks = re.findall(r"[A-Z][A-Za-z0-9'.\-]{3,}", b[4] + " " + b[5])
    return {t.strip(".'") for t in toks if t.strip(".'") not in STOP_ENT}
E = {b[0]: ents(b) for b in bank}

for g in range(GAMES):
    # which genres get 3 questions (7 of 14), rotating
    start = (g * 5) % len(lib.CODES)
    quota = {c: 2 for c in lib.CODES}
    ranked = lib.CODES[start:] + lib.CODES[:start]
    for c in ranked[:7]: quota[c] = 3
    chosen = []; used_ans = set(); used_ent = set()
    cat_order = lib.CODES[:]; rng.shuffle(cat_order)
    for c in cat_order:
        pool = by_c[c]
        want = quota[c]
        # difficulty targets per genre slot: easy, medium, (hard)
        diffs = [1, 2, 3] if want == 3 else ([1, 2] if g % 2 == 0 else [2, 3])
        rnd_order = list(range(len(pool))); rng.shuffle(rnd_order)
        picks = []
        topics_in = collections.Counter()
        for d in diffs:
            cands = sorted((pool[i] for i in rnd_order), key=lambda b: (use[b[0]], abs(b[3] - d)))
            ok = None
            for b in cands:
                if b in picks or norm(b[5]) in used_ans or topics_in[b[2]] >= 2: continue
                if E[b[0]] & used_ent: continue
                ok = b; break
            if ok is None:   # relax the same-subject rule only if nothing else fits
                for b in cands:
                    if b not in picks and norm(b[5]) not in used_ans: ok = b; break
            b = ok
            picks.append(b); used_ans.add(norm(b[5])); topics_in[b[2]] += 1; used_ent |= E[b[0]]
        chosen += picks
    # order: 5 rounds of 7, easy -> hard within a round, genres interleaved
    rng.shuffle(chosen)
    chosen.sort(key=lambda b: b[3])
    rounds = [[] for _ in range(5)]
    for i, b in enumerate(chosen):
        rounds[i % 5].append(b)
    for r in rounds: r.sort(key=lambda b: (b[3], b[1]))
    seq = [b for r in rounds for b in r]
    assert len(seq) == NQ and len({b[0] for b in seq}) == NQ, (g, len(seq))
    for b in seq: use[b[0]] += 1
    tb = min(tb_pool, key=lambda b: (tb_use[b[0]], rng.random()))
    tb_use[tb[0]] += 1
    rb = sorted(range(len(rebus)), key=lambda i: (rb_use[i], rng.random()))[:2]
    for i in rb: rb_use[i] += 1
    ms = []
    for d in decs:
        i = min(songs_by[d], key=lambda i: (sg_use[i], rng.random()))
        sg_use[i] += 1; ms.append(i)
    games.append([g + 1, [b[0] for b in seq], tb[0], rb, ms])

uses = list(use.values())
print("GAMES", len(games), "avg use", sum(uses) / len(uses), "min", min(uses), "max", max(uses), "unused", TARGET - len(use))
# max overlap sample between any consecutive games
ov = max(len(set(games[i][1]) & set(games[i + 1][1])) for i in range(len(games) - 1))
print("max overlap between consecutive games", ov)

if "--check" in sys.argv:
    sys.exit(0)

os.makedirs(OUT, exist_ok=True)
meta = {"genres": {c: lib.CATS[c] for c in lib.CODES}, "topics": topics}
with open(os.path.join(OUT, "bank.js"), "w") as f:
    f.write("/* Clark After Dark trivia bank: [id, genre, topicIndex, difficulty, question, answer, [3 wrong answers]] */\n")
    f.write("window.CAD_META=" + json.dumps(meta, ensure_ascii=False, separators=(",", ":")) + ";\n")
    f.write("window.CAD_BANK=" + json.dumps(bank, ensure_ascii=False, separators=(",", ":")) + ";\n")
with open(os.path.join(OUT, "games.js"), "w") as f:
    f.write("/* 1,000 ready-made games: [gameNo, [35 question ids], tiebreakerId, [2 picture-puzzle ids], [5 music-round song ids]] */\n")
    f.write("window.CAD_GAMES=" + json.dumps(games, separators=(",", ":")) + ";\n")
with open(os.path.join(OUT, "extras.js"), "w") as f:
    f.write("/* Picture-word puzzles [emoji, answer, category] and music-round songs [title, artist, decade] */\n")
    f.write("window.CAD_REBUS=" + json.dumps(rebus, ensure_ascii=False, separators=(",", ":")) + ";\n")
    f.write("window.CAD_SONGS=" + json.dumps(songs, ensure_ascii=False, separators=(",", ":")) + ";\n")
for n in ("bank.js", "games.js", "extras.js"):
    print(n, os.path.getsize(os.path.join(OUT, n)) // 1024, "KB")
