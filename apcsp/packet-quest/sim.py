# PACKET QUEST code engine.
# Runs a student's Python against a level (in Pyodide, inside a Web Worker) and records everything that happens
# as a list of events that the browser then animates. Nothing here is shown to students.
#
# Two kinds of levels:
#   api "karel" / "superkarel" / "ultrakarel"   CodeHS Karel commands: move(), turn_left(), put_ball(), front_is_clear() ...
#                                               (Ultra Karel adds paint(Color.red) and color_is(Color.red))
#   api "hero"                   hero.move_right(3), hero.attack(enemy), hero.find_nearest_enemy(), print(), input() ...
import sys, json, random, ast, copy

MAX_ACTIONS = 1500        # moves/turns/attacks per run
MAX_LINES = 400000        # lines of student code executed per run (catches infinite loops)
MAX_PRINTS = 400

HOSTILE = {"bug": (10, 5), "virus": (30, 10), "brute": (50, 20)}   # type: (health, damage per hit)
FRIENDLY = {"bot"}
SPOOKY = {"ghost"}
HERO_POWER = 10
COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white", "gray", "pink"]


class Color(object):
    """Ultra Karel colors, like CodeHS: Color.red, Color.blue ..."""
    red, orange, yellow, green, blue, purple, black, white, gray, pink = COLORS

DIRS = {"north": (0, -1), "east": (1, 0), "south": (0, 1), "west": (-1, 0)}
ORDER = ["north", "east", "south", "west"]
NAMED = {"up": "north", "right": "east", "down": "south", "left": "west", "north": "north", "east": "east", "south": "south", "west": "west"}


class LevelEnd(Exception):
    """The hero was defeated or did something the level forbids. The run stops; it is not a code error."""


class Crash(Exception):
    """Karel tried something impossible (move into a wall, take a ball that isn't there). Reported like an error."""


class TooLong(Exception):
    pass


def _num(v):
    try:
        return float(str(v).strip())
    except Exception:
        return None


class Unit(object):
    def __init__(self, world, d, i):
        self._w = world
        self.id = i
        self.type = d["type"]
        self.name = d.get("name") or d["type"].title()
        self.x = d["x"]
        self.y = d["y"]
        hp, dmg = HOSTILE.get(self.type, (10, 0))
        self.health = d.get("hp", hp)
        self.max_health = self.health
        self.damage = d.get("dmg", dmg)
        self.alive = True
        self._chase = d.get("chase", False)

    def __repr__(self):
        return "<%s at (%d, %d), health %d>" % (self.type, self.x, self.y, self.health)


class Hero(object):
    """The object students control in hero levels."""

    def __init__(self, world):
        self._w = world

    # ---- properties ----
    @property
    def x(self):
        return self._w.hx

    @property
    def y(self):
        return self._w.hy

    @property
    def health(self):
        return self._w.hp

    @property
    def gems(self):
        return self._w.gem_count

    @property
    def facing(self):
        return {"north": "up", "east": "right", "south": "down", "west": "left"}[self._w.hdir]

    def __repr__(self):
        return "<hero at (%d, %d), health %d>" % (self.x, self.y, self.health)

    # ---- moving ----
    def _steps(self, steps, name):
        if isinstance(steps, bool) or not isinstance(steps, int):
            if isinstance(steps, float) and steps == int(steps):
                steps = int(steps)
            else:
                raise TypeError("%s() needs a whole number of steps, like %s(3), but it got %r (a %s)." % (name, name, steps, type(steps).__name__))
        return steps

    def _move(self, d, steps, name):
        steps = self._steps(steps, name)
        for _ in range(max(0, steps)):
            if not self._w.step(d):
                break

    def move_right(self, steps=1):
        self._move("east", steps, "move_right")

    def move_left(self, steps=1):
        self._move("west", steps, "move_left")

    def move_up(self, steps=1):
        self._move("north", steps, "move_up")

    def move_down(self, steps=1):
        self._move("south", steps, "move_down")

    # ---- looking ----
    def is_path_clear(self, direction):
        d = NAMED.get(str(direction).lower())
        if not d:
            raise ValueError('is_path_clear() needs "right", "left", "up", or "down", not %r.' % (direction,))
        dx, dy = DIRS[d]
        return not self._w.blocked(self._w.hx + dx, self._w.hy + dy)

    def find_nearest_enemy(self):
        return self._w.nearest(lambda u: u.type in HOSTILE)

    def find_nearest_unit(self):
        return self._w.nearest(lambda u: True)

    def distance_to(self, target):
        if not isinstance(target, Unit):
            raise TypeError("distance_to() needs a unit, like hero.distance_to(enemy).")
        return abs(target.x - self.x) + abs(target.y - self.y)

    # ---- acting ----
    def attack(self, target):
        self._w.attack(target)

    def say(self, message):
        self._w.say(message)


class World(object):
    def __init__(self, L, seed):
        L = copy.deepcopy(L)
        self.rnd = random.Random(seed)
        if L.get("gen"):
            exec(L["gen"], {"rnd": self.rnd, "L": L, "seed": seed})
        self.L = L
        rows = L["map"]
        self.h = len(rows)
        self.w = max(len(r) for r in rows)
        self.walls, self.gems, self.spikes, self.markers = set(), set(), set(), set()
        self.balls = {}
        self.exit = None
        self.hx = self.hy = 0
        for y, row in enumerate(rows):
            for x, ch in enumerate(row):
                if ch == "#":
                    self.walls.add((x, y))
                elif ch == "H":
                    self.hx, self.hy = x, y
                elif ch == "X":
                    self.exit = (x, y)
                elif ch == "g":
                    self.gems.add((x, y))
                elif ch == "^":
                    self.spikes.add((x, y))
                elif ch == "m":
                    self.markers.add((x, y))
                elif ch in "123456789":
                    self.balls[(x, y)] = int(ch)
        if L.get("start"):
            self.hx, self.hy = L["start"]
        self.hdir = L.get("dir", "east")
        self.hp = L.get("hp", 100)
        self.doors = [{"x": d["x"], "y": d["y"], "pw": str(d.get("pw", "")), "open": False} for d in L.get("doors", [])]
        self.signs = [dict(s) for s in L.get("signs", [])]
        self.units = [Unit(self, d, i) for i, d in enumerate(L.get("units", []))]
        self.inputs = [str(v) for v in L.get("inputs", [])]
        self.input_i = 0
        self.frames, self.printed, self.said = [], [], []
        self.actions = 0
        self.gem_count = 0
        self.karel = L.get("api") in ("karel", "superkarel", "ultrakarel")
        self.paint = {}
        self.start = self.snapshot()

    # ---------- bookkeeping ----------
    def snapshot(self):
        return {
            "map": self.L["map"], "w": self.w, "h": self.h,
            "hero": {"x": self.hx, "y": self.hy, "dir": self.hdir, "hp": self.hp},
            "units": [{"id": u.id, "type": u.type, "name": u.name, "x": u.x, "y": u.y, "hp": u.health} for u in self.units],
            "doors": [{"x": d["x"], "y": d["y"], "open": d["open"]} for d in self.doors],
            "signs": [{"x": s["x"], "y": s["y"], "text": s.get("text", "")} for s in self.signs],
        }

    def ev(self, t, **kw):
        kw["t"] = t
        self.frames.append(kw)

    def act(self):
        self.actions += 1
        if self.actions > MAX_ACTIONS:
            raise TooLong("Your hero took more than %d actions. Is there a loop that never stops?" % MAX_ACTIONS)

    def unit_at(self, x, y):
        for u in self.units:
            if u.alive and u.x == x and u.y == y:
                return u
        return None

    def blocked(self, x, y):
        if x < 0 or y < 0 or x >= self.w or y >= self.h or (x, y) in self.walls:
            return True
        for d in self.doors:
            if not d["open"] and d["x"] == x and d["y"] == y:
                return True
        return self.unit_at(x, y) is not None

    def nearest(self, test):
        best, bd = None, None
        for u in self.units:
            if u.alive and test(u):
                dist = abs(u.x - self.hx) + abs(u.y - self.hy)
                if bd is None or dist < bd:
                    best, bd = u, dist
        return best

    # ---------- hero actions ----------
    def step(self, d):
        self.act()
        self.hdir = d
        dx, dy = DIRS[d]
        nx, ny = self.hx + dx, self.hy + dy
        if self.blocked(nx, ny):
            self.ev("bump", x=self.hx, y=self.hy, dir=d)
            self.enemies_turn()
            return False
        self.hx, self.hy = nx, ny
        self.ev("move", x=nx, y=ny, dir=d)
        self.arrive()
        self.enemies_turn()
        return True

    def arrive(self):
        p = (self.hx, self.hy)
        if p in self.gems:
            self.gems.discard(p)
            self.gem_count += 1
            self.ev("gem", x=p[0], y=p[1], n=self.gem_count)
        if p in self.spikes:
            self.hurt(20, "spikes")

    def hurt(self, dmg, by):
        self.hp -= dmg
        self.ev("hurt", dmg=dmg, hp=max(0, self.hp), by=by)
        if self.hp <= 0:
            self.ev("die")
            raise LevelEnd("Your hero was defeated by %s! Use your code to avoid it." % by)

    def enemies_turn(self):
        for u in self.units:
            if not u.alive or u.type not in HOSTILE:
                continue
            dist = abs(u.x - self.hx) + abs(u.y - self.hy)
            if dist == 1:
                self.ev("strike", u=u.id)
                self.hurt(u.damage, "a " + u.type)
            elif u._chase:
                self.chase(u)

    def chase(self, u):
        dx, dy = self.hx - u.x, self.hy - u.y
        tries = []
        if abs(dx) >= abs(dy):
            tries = [(1 if dx > 0 else -1, 0), (0, 1 if dy > 0 else -1) if dy else None]
        else:
            tries = [(0, 1 if dy > 0 else -1), (1 if dx > 0 else -1, 0) if dx else None]
        for t in tries:
            if not t:
                continue
            nx, ny = u.x + t[0], u.y + t[1]
            if (nx, ny) != (self.hx, self.hy) and not self.blocked(nx, ny) and (nx, ny) not in self.spikes:
                u.x, u.y = nx, ny
                self.ev("umove", u=u.id, x=nx, y=ny)
                return

    def find_target(self, target):
        if target is None:
            raise ValueError("attack() got None. There is no enemy there. Check that find_nearest_enemy() found one before you attack.")
        if isinstance(target, Unit):
            return target
        if isinstance(target, str):
            for u in self.units:
                if u.alive and (u.name.lower() == target.lower() or u.type == target.lower()):
                    return u
            raise ValueError("There is no unit named %r to attack." % target)
        raise TypeError("attack() needs an enemy, like hero.attack(enemy), not %r." % (target,))

    def attack(self, target):
        u = self.find_target(target)
        self.act()
        if not u.alive:
            self.ev("whiff", x=self.hx, y=self.hy)
            self.enemies_turn()
            return
        # like CodeCombat: the hero walks to the target, then strikes (each step is an action, and enemies get their turns)
        while abs(u.x - self.hx) + abs(u.y - self.hy) > 1:
            dx, dy = u.x - self.hx, u.y - self.hy
            order = ([("east" if dx > 0 else "west")] if dx else []) + ([("south" if dy > 0 else "north")] if dy else [])
            if abs(dy) > abs(dx):
                order.reverse()
            moved = False
            for d in order:
                ddx, ddy = DIRS[d]
                if not self.blocked(self.hx + ddx, self.hy + ddy):
                    self.hdir = d
                    self.hx += ddx
                    self.hy += ddy
                    self.ev("move", x=self.hx, y=self.hy, dir=d)
                    self.arrive()
                    self.enemies_turn()
                    moved = True
                    break
            if not moved:
                self.ev("bump", x=self.hx, y=self.hy, dir=order[0] if order else self.hdir)
                self.enemies_turn()
                return
            if not u.alive:
                return
            self.act()
        self.hdir = "east" if u.x > self.hx else "west" if u.x < self.hx else "south" if u.y > self.hy else "north"
        if u.type in FRIENDLY:
            self.ev("attack", u=u.id, dmg=0, hp=u.health, dir=self.hdir)
            raise LevelEnd("You attacked a friendly bot! Only attack enemies. Check the unit's type first.")
        if u.type in SPOOKY:
            self.ev("attack", u=u.id, dmg=0, hp=u.health, dir=self.hdir)
            self.ev("float", x=u.x, y=u.y, text="whoosh!")
            self.enemies_turn()
            return
        u.health -= HERO_POWER
        self.ev("attack", u=u.id, dmg=HERO_POWER, hp=max(0, u.health), dir=self.hdir)
        if u.health <= 0:
            u.alive = False
            self.ev("udie", u=u.id)
        self.enemies_turn()

    def say(self, message):
        self.act()
        text = str(message)
        self.said.append(text)
        self.ev("say", text=text)
        self.listen(text)
        self.enemies_turn()

    def listen(self, text):
        t = text.strip()
        for i, d in enumerate(self.doors):
            if not d["open"] and d["pw"] != "" and _same(t, d["pw"]):
                d["open"] = True
                self.ev("door", i=i)
        low = t.lower().strip("!. ")
        for u in self.units:
            if not u.alive:
                continue
            dist = abs(u.x - self.hx) + abs(u.y - self.hy)
            if u.type in SPOOKY and low == "boo" and dist <= 3:
                u.alive = False
                self.ev("udie", u=u.id, kind="vanish")
            elif u.type in FRIENDLY and low in ("hi", "hello") and dist <= 2:
                u.alive = False
                self.ev("udie", u=u.id, kind="leave")

    def do_print(self, *args, **kw):
        sep = kw.get("sep", " ")
        text = (" " if sep is None else str(sep)).join(str(a) for a in args)
        self.printed.append(text)
        if len(self.printed) > MAX_PRINTS:
            raise TooLong("Your program printed more than %d lines. Is there a loop that never stops?" % MAX_PRINTS)
        self.ev("print", text=text)
        self.listen(text)

    def do_input(self, prompt=""):
        if self.input_i >= len(self.inputs):
            raise EOFError("input() was called, but there are no more signs to read. You called input() too many times.")
        v = self.inputs[self.input_i]
        self.ev("input", prompt=str(prompt), value=v, i=self.input_i)
        self.input_i += 1
        return v

    # ---------- Karel ----------
    def k_front(self, rel=0):
        d = ORDER[(ORDER.index(self.hdir) + rel) % 4]
        dx, dy = DIRS[d]
        return not self.blocked(self.hx + dx, self.hy + dy)

    def k_move(self):
        self.act()
        dx, dy = DIRS[self.hdir]
        if self.blocked(self.hx + dx, self.hy + dy):
            self.ev("bump", x=self.hx, y=self.hy, dir=self.hdir)
            raise Crash("Karel crashed into a wall! Check front_is_clear() before you move().")
        self.hx += dx
        self.hy += dy
        self.ev("move", x=self.hx, y=self.hy, dir=self.hdir)
        self.arrive()

    def k_turn(self, n):
        self.act()
        self.hdir = ORDER[(ORDER.index(self.hdir) + n) % 4]
        self.ev("turn", dir=self.hdir)

    def k_put(self):
        self.act()
        p = (self.hx, self.hy)
        self.balls[p] = self.balls.get(p, 0) + 1
        self.ev("ball", x=p[0], y=p[1], n=self.balls[p])

    def k_paint(self, color):
        self.act()
        c = str(color)
        if c not in COLORS:
            raise ValueError("paint() needs a color like Color.red, not %r." % (color,))
        self.paint[(self.hx, self.hy)] = c
        self.ev("paint", x=self.hx, y=self.hy, color=c)

    def k_take(self):
        self.act()
        p = (self.hx, self.hy)
        if self.balls.get(p, 0) <= 0:
            self.ev("bump", x=self.hx, y=self.hy, dir=self.hdir)
            raise Crash("There's no ball here to take! Check balls_present() before you take_ball().")
        self.balls[p] -= 1
        if not self.balls[p]:
            del self.balls[p]
        self.ev("ball", x=p[0], y=p[1], n=self.balls.get(p, 0))

    # ---------- goals ----------
    def check(self):
        out = []
        for g in self.L.get("goals", []):
            t = g["type"]
            ok = False
            if t == "exit":
                ok = (self.hx, self.hy) == self.exit
            elif t == "gems":
                ok = not self.gems
            elif t == "enemies":
                ok = all(not u.alive for u in self.units if u.type in HOSTILE)
            elif t == "units":
                ok = all(not u.alive for u in self.units if u.type in g.get("types", []))
            elif t == "doors":
                ok = all(d["open"] for d in self.doors)
            elif t == "pos":
                ok = (self.hx, self.hy) == (g["x"], g["y"]) and (not g.get("dir") or g["dir"] == self.hdir)
            elif t == "balls":
                want = {}
                for k, v in self.L.get("ball_goal", {}).items():
                    x, y = [int(a) for a in k.split(",")]
                    if v:
                        want[(x, y)] = v
                if g.get("exact", True):
                    ok = want == {p: n for p, n in self.balls.items() if n}
                else:
                    ok = all(self.balls.get(p, 0) == n for p, n in want.items())
            elif t == "print":
                exp = [str(e) for e in self.L.get("expect_print", [])]
                got = [p.strip() for p in self.printed]
                if g.get("last"):
                    got = got[-len(exp):] if exp else []
                ok = len(got) == len(exp) and all(_same(a, b) for a, b in zip(got, exp))
            elif t == "paint":
                want = {}
                for k, v in self.L.get("paint_goal", {}).items():
                    x, y = [int(a) for a in k.split(",")]
                    want[(x, y)] = v
                ok = want == self.paint
            elif t == "print_check":
                ok = _print_check(g, self.printed)
            out.append({"label": g.get("label", t), "ok": bool(ok)})
        return out


def _same(got, exp):
    if got == exp.strip():
        return True
    a, b = _num(got), _num(exp)
    return a is not None and b is not None and abs(a - b) < 1e-6


def _print_check(g, printed):
    # e.g. {"type":"print_check","count":5,"int_range":[1,6]}
    lines = [p.strip() for p in printed]
    if "count" in g and len(lines) != g["count"]:
        return False
    if "int_range" in g:
        lo, hi = g["int_range"]
        for p in lines:
            try:
                v = int(p)
            except Exception:
                return False
            if v < lo or v > hi:
                return False
    return True


# ---------------- static checks on the student's code ----------------
REQ_LABEL = {
    "def": "define a function with def", "for": "use a for loop", "while": "use a while loop", "if": "use an if statement",
    "else": "use else", "elif": "use elif", "range": "use range()", "input": "use input()", "print": "use print()",
    "int": "convert with int()", "str": "convert with str()", "mod": "use the % operator", "floordiv": "use the // operator",
    "slice": "use slicing, like word[2:5]", "index": "use indexing, like word[0]", "find": "use .find()", "len": "use len()",
    "and": "use and", "or": "use or", "not": "use not", "compare": "use a comparison like == or >", "break": "use break",
    "whiletrue": "use a while True loop", "randint": "use random.randint()", "var": "store a value in a variable",
    "update": "update a variable (like steps = steps + 1 or steps += 1)", "comment": "write at least one # comment",
    "concat": "join strings with +", "andor": "combine comparisons with and / or",
    "def3": "define at least 3 functions", "mul": "use * (like word * 3)",
}


def static_check(code, reqs, max_lines, nolit):
    res = {"missing": [], "lines": 0, "over": False, "literal": False}
    lines = [l for l in code.split("\n") if l.strip() and not l.strip().startswith("#")]
    res["lines"] = len(lines)
    if max_lines and len(lines) > max_lines:
        res["over"] = True
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return res
    nodes = list(ast.walk(tree))

    def calls(name):
        for n in nodes:
            if isinstance(n, ast.Call):
                f = n.func
                if (isinstance(f, ast.Name) and f.id == name) or (isinstance(f, ast.Attribute) and f.attr == name):
                    return True
        return False

    def has(k):
        if k == "def":
            return any(isinstance(n, ast.FunctionDef) for n in nodes)
        if k == "for":
            return any(isinstance(n, ast.For) for n in nodes)
        if k == "while":
            return any(isinstance(n, ast.While) for n in nodes)
        if k == "whiletrue":
            return any(isinstance(n, ast.While) and isinstance(n.test, ast.Constant) and n.test.value is True for n in nodes)
        if k == "if":
            return any(isinstance(n, ast.If) for n in nodes)
        if k == "elif":
            return any(isinstance(n, ast.If) and len(n.orelse) == 1 and isinstance(n.orelse[0], ast.If) for n in nodes)
        if k == "else":
            return any(isinstance(n, ast.If) and n.orelse and not (len(n.orelse) == 1 and isinstance(n.orelse[0], ast.If)) for n in nodes)
        if k in ("range", "input", "print", "int", "str", "len", "find", "randint"):
            return calls(k)
        if k == "mod":
            return any(isinstance(n, ast.BinOp) and isinstance(n.op, ast.Mod) for n in nodes)
        if k == "floordiv":
            return any(isinstance(n, ast.BinOp) and isinstance(n.op, ast.FloorDiv) for n in nodes)
        if k == "slice":
            return any(isinstance(n, ast.Subscript) and isinstance(n.slice, ast.Slice) for n in nodes)
        if k == "index":
            return any(isinstance(n, ast.Subscript) and not isinstance(n.slice, ast.Slice) for n in nodes)
        if k == "and":
            return any(isinstance(n, ast.BoolOp) and isinstance(n.op, ast.And) for n in nodes)
        if k == "or":
            return any(isinstance(n, ast.BoolOp) and isinstance(n.op, ast.Or) for n in nodes)
        if k == "not":
            return any(isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.Not) for n in nodes) or any(isinstance(n, ast.Compare) and any(isinstance(o, (ast.NotEq, ast.NotIn)) for o in n.ops) for n in nodes)
        if k == "def3":
            return sum(1 for n in nodes if isinstance(n, ast.FunctionDef)) >= 3
        if k == "mul":
            return any(isinstance(n, ast.BinOp) and isinstance(n.op, ast.Mult) for n in nodes)
        if k == "andor":
            return any(isinstance(n, ast.BoolOp) for n in nodes)
        if k == "compare":
            return any(isinstance(n, ast.Compare) for n in nodes)
        if k == "break":
            return any(isinstance(n, ast.Break) for n in nodes)
        if k == "var":
            return any(isinstance(n, (ast.Assign, ast.AugAssign)) for n in nodes)
        if k == "update":
            if any(isinstance(n, ast.AugAssign) for n in nodes):
                return True
            for n in nodes:
                if isinstance(n, ast.Assign) and len(n.targets) == 1 and isinstance(n.targets[0], ast.Name):
                    nm = n.targets[0].id
                    if any(isinstance(m, ast.Name) and m.id == nm for m in ast.walk(n.value)):
                        return True
            return False
        if k == "comment":
            return any(l.strip().startswith("#") or " #" in l for l in code.split("\n"))
        if k == "concat":
            return any(isinstance(n, ast.BinOp) and isinstance(n.op, ast.Add) and (
                any(isinstance(s, ast.Constant) and isinstance(s.value, str) for s in (n.left, n.right)) or
                any(isinstance(s, ast.Call) and isinstance(s.func, ast.Name) and s.func.id in ("str", "input") for s in (n.left, n.right)) or
                any(isinstance(s, (ast.Subscript, ast.BinOp)) for s in (n.left, n.right))) for n in nodes)
        return True

    for k in reqs or []:
        if not has(k):
            res["missing"].append(REQ_LABEL.get(k, k))
    if nolit:
        for n in nodes:
            if isinstance(n, ast.Call) and isinstance(n.func, ast.Attribute) and n.func.attr in nolit:
                if any(isinstance(a, ast.Constant) and isinstance(a.value, (int, float)) for a in n.args):
                    res["literal"] = True
    return res


# ---------------- running ----------------
def _globals(W):
    g = {"__name__": "__main__", "print": W.do_print, "input": W.do_input}
    api = W.L.get("api", "hero")
    if api == "hero":
        g["hero"] = Hero(W)
    else:
        g.update({
            "move": W.k_move, "turn_left": lambda: W.k_turn(-1), "put_ball": W.k_put, "take_ball": W.k_take,
            "front_is_clear": lambda: W.k_front(0), "front_is_blocked": lambda: not W.k_front(0),
            "left_is_clear": lambda: W.k_front(-1), "left_is_blocked": lambda: not W.k_front(-1),
            "right_is_clear": lambda: W.k_front(1), "right_is_blocked": lambda: not W.k_front(1),
            "balls_present": lambda: W.balls.get((W.hx, W.hy), 0) > 0, "no_balls_present": lambda: W.balls.get((W.hx, W.hy), 0) == 0,
            "facing_north": lambda: W.hdir == "north", "facing_east": lambda: W.hdir == "east",
            "facing_south": lambda: W.hdir == "south", "facing_west": lambda: W.hdir == "west",
        })
        if api in ("superkarel", "ultrakarel"):
            g["turn_right"] = lambda: W.k_turn(1)
            g["turn_around"] = lambda: W.k_turn(2)
        if api == "ultrakarel":
            g["paint"] = W.k_paint
            g["color_is"] = lambda c: W.paint.get((W.hx, W.hy)) == str(c)
            g["Color"] = Color
    return g


def _line_of(tb):
    line = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == "<hero>":
            line = tb.tb_lineno
        tb = tb.tb_next
    return line


def run_one(compiled, L, seed):
    W = World(L, seed)
    g = _globals(W)
    count = [0]

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<hero>":
            return None
        if event == "line":
            count[0] += 1
            if count[0] > MAX_LINES:
                raise TooLong("Your code ran for too long. Is there a loop that never stops?")
        return tracer

    err, ended = None, None
    sys.settrace(tracer)
    try:
        exec(compiled, g)
    except LevelEnd as e:
        ended = str(e)
    except TooLong as e:
        err = {"type": "InfiniteLoop", "msg": str(e), "line": _line_of(sys.exc_info()[2])}
    except Crash as e:
        err = {"type": "Crash", "msg": str(e), "line": _line_of(sys.exc_info()[2])}
    except Exception as e:
        err = {"type": type(e).__name__, "msg": str(e), "line": _line_of(sys.exc_info()[2])}
    finally:
        sys.settrace(None)
    goals = W.check()
    ok = err is None and ended is None and all(x["ok"] for x in goals)
    return {"seed": seed, "ok": ok, "goals": goals, "frames": W.frames, "start": W.start, "printed": W.printed,
            "error": err, "ended": ended, "actions": W.actions}


def run_request(req_json):
    req = json.loads(req_json)
    code, L = req["code"], req["level"]
    seeds = L.get("seeds") or [0]
    st = static_check(code, L.get("require", []), L.get("maxLines"), L.get("nolit"))
    try:
        compiled = compile(code, "<hero>", "exec")
    except SyntaxError as e:
        return json.dumps({"syntax": {"msg": e.msg, "line": e.lineno, "text": (e.text or "").rstrip()}, "static": st, "runs": [], "passed": False})
    runs = [run_one(compiled, L, s) for s in seeds]
    passed = all(r["ok"] for r in runs) and not st["missing"] and not st["over"] and not st["literal"]
    return json.dumps({"static": st, "runs": runs, "passed": passed})


def start_state(level_json, seed=None):
    L = json.loads(level_json)
    s = (L.get("seeds") or [0])[0] if seed is None else seed
    return json.dumps(World(L, s).start)
