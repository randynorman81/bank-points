"""Shared helpers for building the Clark After Dark trivia bank.

Every question is stored as:
  cat, topic, difficulty(1 easy .. 3 hard), question, answer, [3 wrong answers]
so any question can be used as free-response OR multiple choice.
"""
import random, re, zlib

CATS = {
    "MOV": "Movies", "TV": "Television", "MUS": "Music", "SPT": "Sports",
    "LIT": "Literature", "GEO": "Geography", "SCI": "Science",
    "NAT": "Nature & Animals", "FOOD": "Food & Drink", "HIS": "History",
    "POP": "Pop Culture", "TEC": "Tech & Games", "WRD": "Words & Language",
    "ART": "Art & Mythology",
}
CODES = list(CATS)

ROWS = []          # finished questions
SEEN = set()       # normalised question text, for de-duplication
REJECTS = []       # (reason, text) for anything refused
MUSIC_ROUND = []   # (song, artist, decade) for the music round pool
REBUS = []         # (emoji string, answer, hint, category)


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def rnd_for(key):
    return random.Random(zlib.crc32(key.encode("utf-8")))


def add(cat, topic, diff, q, a, wrong):
    """Add one question. Rejects bad ones instead of silently keeping them."""
    q = q.strip(); a = str(a).strip()
    wrong = [str(w).strip() for w in wrong if str(w).strip()]
    # unique, not equal to answer
    seen = {norm(a)}; w2 = []
    for w in wrong:
        if norm(w) not in seen:
            seen.add(norm(w)); w2.append(w)
    if cat not in CATS: REJECTS.append(("badcat", q)); return False
    if diff not in (1, 2, 3): REJECTS.append(("baddiff", q)); return False
    if len(w2) < 3: REJECTS.append(("fewwrong", q + " => " + a)); return False
    k = norm(q)
    if k in SEEN: REJECTS.append(("dupe", q)); return False
    SEEN.add(k)
    ROWS.append([cat, topic.strip(), diff, q, a, w2[:3]])
    return True


def pick(pool, answer, key, n=3, avoid=()):
    """Pick n distractors from pool (deterministic), excluding the answer."""
    r = rnd_for(key)
    a = norm(answer)
    bad = {norm(x) for x in avoid}
    cand = [p for p in dict.fromkeys(pool) if norm(p) != a and norm(p) not in bad]
    r.shuffle(cand)
    return cand[:n]


def near_years(y, key, span=6):
    """Three plausible wrong years near y."""
    r = rnd_for("yr" + key + str(y))
    opts = [y + d for d in range(-span, span + 1) if d != 0]
    r.shuffle(opts)
    return opts[:3]


def near_nums(n, key, step=1, lo=None):
    r = rnd_for("nm" + key + str(n))
    base = [n + step * d for d in (-3, -2, -1, 1, 2, 3, 4)]
    base = [b for b in base if b != n and (lo is None or b >= lo)]
    r.shuffle(base)
    return base[:3]


def parse_hand(text, default_topic=""):
    """Hand-written lines:  CAT|Topic|d|Question|Answer|W1|W2|W3"""
    for ln, line in enumerate(text.strip().splitlines(), 1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        p = [x.strip() for x in line.split("|")]
        if len(p) != 8:
            REJECTS.append(("fields%d" % len(p), line[:90])); continue
        cat, topic, d, q, a, w1, w2, w3 = p
        try:
            d = int(d)
        except ValueError:
            REJECTS.append(("baddiff", line[:90])); continue
        add(cat, topic or default_topic, d, q, a, [w1, w2, w3])


def table(text, ncols=None):
    """Parse 'a|b|c' rows into lists (comments with # ignored)."""
    out = []
    for line in text.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        p = [x.strip() for x in line.split("|")]
        if ncols and len(p) != ncols:
            REJECTS.append(("tablecols%d" % len(p), line[:90])); continue
        out.append(p)
    return out


FEM_FIRST = set("""Sigourney Linda Uma Jodie Alicia Reese Kristen Lindsay Gal Julia Meg Vivien Judy Gloria Audrey Julie Fay Helen Margot Saoirse Emily Charlize Sandra Taraji Geena Frances Anne Meryl Jennifer Idina Ellen Amy Auli'i Paige Jodi Courteney Lisa Bea Lucille Sofía Kaley Zooey Tina Sarah Lauren Gillian Millie Claire Jenna Quinta Roseanne Zendaya Catherine Emilia Lorraine Marilyn Whoopi Angelina Cameron Nicole Scarlett Natalie Emma Halle Viola Octavia Michelle Queen Lupita Elizabeth Susan Diane Goldie Cher""".split())

def is_fem(name):
    return name.split()[0] in FEM_FIRST

def pick_g(pool, answer, key, n=3, avoid=()):
    """Like pick(), but keeps distractors the same gender as the answer (for people names)."""
    f = is_fem(answer)
    same = [x for x in pool if is_fem(x) == f]
    res = pick(same, answer, key, n, avoid)
    if len(res) < n:
        res = pick(pool, answer, key, n, avoid)
    return res
