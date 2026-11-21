"""netlab: the Network Engineer toolkit.

It comes with the Python editor. Your missions use it to draw network maps, send animated packets,
and check your work. You do not have to change anything in this file, but you are welcome to read it.

    import netlab
"""
import builtins
import copy
import io
import math
import random
from PIL import Image, ImageDraw, ImageFont

BG = (10, 18, 40)
GRID = (22, 34, 66)
LINK = (108, 122, 153)
GOOD = (46, 230, 166)
BAD = (255, 90, 95)
GOLD = (255, 209, 102)
KIND_COLOR = {
    "pc": (76, 201, 240), "laptop": (76, 201, 240), "phone": (181, 131, 255), "server": (247, 37, 133),
    "router": (255, 209, 102), "switch": (6, 214, 160), "cloud": (160, 190, 255), "dns": (255, 140, 66),
}


def _quiet():
    """True while the editor is grading your program in the background (it skips the drawing)."""
    return getattr(builtins, "PQ_QUIET", False)


def _font(size):
    return ImageFont.load_default(size=size)


# ------------------------------------------------------------------ printing helpers ----------------
def banner(title, subtitle=""):
    """Print a mission-control banner."""
    width = max(len(title), len(subtitle)) + 6
    print("+" + "=" * width + "+")
    print("|" + title.center(width) + "|")
    if subtitle:
        print("|" + subtitle.center(width) + "|")
    print("+" + "=" * width + "+")


def check(label, got, expected):
    """Compare what your function returned (got) with what it should return (expected). Returns True or False."""
    if got == expected:
        print("  PASS  " + label)
        return True
    print("  FAIL  " + label)
    print("        expected: " + repr(expected))
    print("        you gave: " + repr(got))
    return False


def test(label, func, cases):
    """Run your function on every test case. A case is (arguments, expected answer). Returns how many passed."""
    passed = 0
    for args, expected in cases:
        if not isinstance(args, tuple):
            args = (args,)
        try:
            got = func(*args)
        except Exception as error:
            print("  FAIL  " + label + "(" + ", ".join(repr(a) for a in args) + ")")
            print("        your function crashed: " + type(error).__name__ + ": " + str(error))
            continue
        if check(label + "(" + ", ".join(repr(a) for a in args) + ")", got, expected):
            passed += 1
    return passed


def report(mission, passed, total):
    """Print the final mission report. Prints MISSION COMPLETE only when every test passed."""
    print()
    print("MISSION REPORT: " + mission)
    print("Tests passed: " + str(passed) + " of " + str(total))
    if passed == total and total > 0:
        print("*** MISSION COMPLETE ***")
        ranks = ["Cable Intern", "Junior Engineer", "Network Engineer", "Senior Engineer", "Network Architect"]
        print("Rank: " + ranks[min(len(ranks) - 1, total // 3)])
    else:
        print("Not yet. Read the FAIL lines above and fix your code.")


# ------------------------------------------------------------------ built-in mission tests ----------
MISSIONS = {
    "10.3": [
        ("is_valid_ip", [("192.168.1.10", True), ("256.1.1.1", False), ("1.2.3", False), ("a.b.c.d", False),
                         ("0.0.0.0", True), ("1.2.3.4.5", False), ("", False), ("10.0.0.255", True)]),
        ("ip_to_binary", [("192.168.1.10", "11000000.10101000.00000001.00001010"), ("0.0.0.0", "00000000.00000000.00000000.00000000"),
                          ("255.255.255.255", "11111111.11111111.11111111.11111111"), ("10.0.0.1", "00001010.00000000.00000000.00000001")]),
        ("address_type", [("192.168.1.10", "private"), ("10.1.2.3", "private"), ("172.16.0.1", "private"), ("172.31.255.1", "private"),
                          ("172.32.0.1", "public"), ("127.0.0.1", "loopback"), ("8.8.8.8", "public"), ("151.101.1.69", "public")]),
        ("how_many_addresses", [(32, 4294967296), (8, 256), (1, 2), (128, 340282366920938463463374607431768211456)]),
    ],
}


def _wrap(func, norm):
    return lambda *args: norm(func(*args))


def run_mission(name, namespace):
    """Run the built-in tests for a mission against YOUR functions.  Use it like this:  netlab.run_mission("10.3", globals())"""
    print()
    print("RUNNING THE MISSION TESTS...")
    passed = 0
    total = 0
    for entry in MISSIONS[name]:
        func_name = entry[0]
        func = namespace.get(func_name)
        if callable(entry[1]):
            total += entry[2]
            if not callable(func):
                print("  MISSING  you have not written a function named " + func_name + " yet")
                continue
            try:
                passed += entry[1](func)
            except Exception as error:
                print("  FAIL  " + func_name + " crashed: " + type(error).__name__ + ": " + str(error))
            continue
        cases = copy.deepcopy(entry[1])   # fresh copies every run, so a function that changes its input cannot break the next run
        total += len(cases)
        if not callable(func):
            print("  MISSING  you have not written a function named " + func_name + " yet")
            continue
        passed += test(func_name, _wrap(func, entry[2]) if len(entry) > 2 else func, cases)
    report("Mission " + name, passed, total)
    return passed == total


# ---- 10.5 DNS ----
DNS_DATA = {
    "com": {"google.com": "142.250.80.46", "amazon.com": "205.251.242.103", "netflix.com": "52.3.144.142"},
    "edu": {"schs.edu": "10.20.30.40", "mit.edu": "18.9.22.69"},
    "org": {"wikipedia.org": "208.80.154.224", "code.org": "99.84.190.17"},
}


def _cache_test(func):
    """resolve_with_cache(domain, cache): looks in the cache first, and saves new answers in it."""
    passed = 0
    cache = {}
    first = func("google.com", cache)
    passed += check("resolve_with_cache('google.com', {})", first, "142.250.80.46")
    passed += check("the answer was saved in the cache", cache.get("google.com"), "142.250.80.46")
    cache2 = {"google.com": "1.1.1.1"}
    passed += check("a name already in the cache comes from the cache", func("google.com", cache2), "1.1.1.1")
    cache3 = {}
    func("fake.xyz", cache3)
    passed += check("a name that does not exist is NOT saved", len(cache3), 0)
    return passed


MISSIONS["10.5"] = [
    ("get_tld", [("www.google.com", "com"), ("schs.edu", "edu"), ("a.b.c.org", "org"), ("localhost", "localhost")]),
    ("get_site", [("www.google.com", "google.com"), ("google.com", "google.com"), ("mail.schs.edu", "schs.edu"), ("a.b.wikipedia.org", "wikipedia.org")]),
    ("resolve", [("google.com", "142.250.80.46"), ("www.google.com", "142.250.80.46"), ("code.org", "99.84.190.17"),
                 ("fake.xyz", None), ("nothere.com", None), ("mit.edu", "18.9.22.69")]),
    ("trace", [("www.google.com", ["root server", ".com server", "google.com server"]), ("schs.edu", ["root server", ".edu server", "schs.edu server"]),
               ("fake.xyz", ["root server"]), ("nothere.com", ["root server", ".com server"])]),
    ("resolve_with_cache", _cache_test, 4),
]


def dns_tree_for(domain):
    """Draw the DNS tree with the path a question for this domain follows."""
    parts = str(domain).split(".")
    tld = "." + parts[-1]
    site = ".".join(parts[-2:])
    path = ["Your PC", "Resolver", "Root (.)"]
    if tld in (".com", ".edu", ".org"):
        path.append(tld)
        if site in ("google.com", "schs.edu", "wikipedia.org"):
            path.append(site)
    return dns_tree(path, "Following " + str(domain))


# ---- 10.6 Routing ----
def _graph_norm(graph):
    return {key: sorted(graph[key]) for key in graph}


def _path_norm(path):
    if path is None:
        return None
    return (len(path), path[0], path[-1])


_SCHOOL_GRAPH = {
    "Laptop": ["Switch"], "Phone": ["Switch"], "Switch": ["Laptop", "Phone", "Router A", "Router B"],
    "Router A": ["Switch", "Router C", "ISP"], "Router B": ["Switch", "Router C", "Server"],
    "Router C": ["Router A", "Router B", "ISP", "Server"], "ISP": ["Router A", "Router C"], "Server": ["Router C", "Router B"],
}


def _remove_test(func):
    passed = 0
    graph = {key: list(value) for key, value in _SCHOOL_GRAPH.items()}
    smaller = func(graph, "Router A")
    passed += check("remove_router: the router is gone", "Router A" in smaller, False)
    passed += check("remove_router: nobody links to it any more", any("Router A" in smaller[k] for k in smaller), False)
    passed += check("remove_router: everything else is still there", len(smaller), 7)
    return passed


MISSIONS["10.6"] = [
    ("build_graph", [([("A", "B"), ("B", "C")], {"A": ["B"], "B": ["A", "C"], "C": ["B"]}),
                     ([("X", "Y")], {"X": ["Y"], "Y": ["X"]}), ([], {})], _graph_norm),
    ("find_path", [((_SCHOOL_GRAPH, "Laptop", "ISP"), (4, "Laptop", "ISP")), ((_SCHOOL_GRAPH, "Phone", "Server"), (4, "Phone", "Server")),
                   ((_SCHOOL_GRAPH, "Laptop", "Laptop"), (1, "Laptop", "Laptop")), (({"A": ["B"], "B": ["A"], "C": []}, "A", "C"), None),
                   (({"A": ["B"], "B": ["A", "C"], "C": ["B"]}, "A", "C"), (3, "A", "C"))], _path_norm),
    ("count_hops", [(["A", "B", "C", "D"], 3), (["A"], 0), (None, -1)]),
    ("remove_router", _remove_test, 3),
]


# ---- 10.7 Packets ----
def _missing_cases():
    p = lambda n: {"seq": n, "total": 4, "data": "x"}
    return [(([p(1), p(3)], 4), [2, 4]), (([p(1), p(2), p(3), p(4)], 4), []), (([], 3), [1, 2, 3]), (([p(4)], 4), [1, 2, 3])]


def _reliable_test(func):
    passed = 0
    for text, size, loss in (("HELLO WORLD", 3, 0.5), ("NETWORKS", 2, 0.3)):
        result = func(text, size, loss)
        ok = isinstance(result, dict) and result.get("text") == text and result.get("attempts", 0) >= 1
        passed += check("send_reliably(" + repr(text) + ", " + str(size) + ", " + str(loss) + ")", ok, True)
    return passed


MISSIONS["10.7"] = [
    ("make_packets", [(("HELLO WORLD", 4), [{"seq": 1, "total": 3, "data": "HELL"}, {"seq": 2, "total": 3, "data": "O WO"}, {"seq": 3, "total": 3, "data": "RLD"}]),
                      (("Hi", 5), [{"seq": 1, "total": 1, "data": "Hi"}]), (("", 3), []),
                      (("ABCDEF", 2), [{"seq": 1, "total": 3, "data": "AB"}, {"seq": 2, "total": 3, "data": "CD"}, {"seq": 3, "total": 3, "data": "EF"}])]),
    ("reassemble", [([{"seq": 3, "total": 3, "data": "RLD"}, {"seq": 1, "total": 3, "data": "HELL"}, {"seq": 2, "total": 3, "data": "O WO"}], "HELLO WORLD"),
                    ([{"seq": 2, "total": 2, "data": "!!"}, {"seq": 1, "total": 2, "data": "Hi"}], "Hi!!"), ([], "")]),
    ("find_missing", _missing_cases()),
    ("send_reliably", _reliable_test, 2),
]


# ------------------------------------------------------------------ the school network ----------------
def school_network():
    """Return (nodes, links) for the SCHS network, the map most missions use."""
    nodes = {
        "Laptop": (10, 22, "laptop"), "Phone": (10, 78, "phone"), "Switch": (30, 50, "switch"),
        "Router A": (50, 22, "router"), "Router B": (50, 78, "router"), "Router C": (70, 50, "router"),
        "ISP": (88, 22, "cloud"), "Server": (88, 78, "server"),
    }
    links = [("Laptop", "Switch"), ("Phone", "Switch"), ("Switch", "Router A"), ("Switch", "Router B"),
             ("Router A", "Router C"), ("Router B", "Router C"), ("Router A", "ISP"), ("Router C", "ISP"),
             ("Router C", "Server"), ("Router B", "Server")]
    return nodes, links


# ------------------------------------------------------------------ drawing ----------------------------
def _icon(pen, kind, cx, cy, color):
    s = 24
    dark = (int(color[0] * 0.35), int(color[1] * 0.35), int(color[2] * 0.35))
    if kind in ("pc", "laptop"):
        pen.rounded_rectangle((cx - s, cy - s + 2, cx + s, cy + s - 8), radius=4, fill=color)
        pen.rectangle((cx - s + 4, cy - s + 6, cx + s - 4, cy + s - 12), fill=dark)
        pen.rectangle((cx - 5, cy + s - 8, cx + 5, cy + s - 2), fill=color)
        pen.rectangle((cx - 14, cy + s - 2, cx + 14, cy + s + 2), fill=color)
    elif kind in ("server", "dns"):
        for i in range(3):
            top = cy - s + i * 17
            pen.rounded_rectangle((cx - s + 2, top, cx + s - 2, top + 14), radius=3, fill=color)
            pen.ellipse((cx + s - 14, top + 4, cx + s - 8, top + 10), fill=dark)
            pen.rectangle((cx - s + 8, top + 5, cx - s + 22, top + 9), fill=dark)
    elif kind == "router":
        pen.ellipse((cx - s, cy - s + 4, cx + s, cy + s + 4), fill=color)
        for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)):
            pen.line((cx + dx * 4, cy + 4 + dy * 4, cx + dx * 15, cy + 4 + dy * 15), fill=dark, width=4)
            pen.ellipse((cx + dx * 15 - 3, cy + 4 + dy * 15 - 3, cx + dx * 15 + 3, cy + 4 + dy * 15 + 3), fill=dark)
        pen.line((cx - 12, cy - s + 4, cx - 16, cy - s - 8), fill=color, width=3)
        pen.line((cx + 12, cy - s + 4, cx + 16, cy - s - 8), fill=color, width=3)
    elif kind == "switch":
        pen.rounded_rectangle((cx - s - 6, cy - 12, cx + s + 6, cy + 12), radius=5, fill=color)
        for i in range(5):
            pen.rectangle((cx - s + i * 11, cy - 5, cx - s + i * 11 + 7, cy + 5), fill=dark)
    elif kind == "phone":
        pen.rounded_rectangle((cx - 13, cy - s, cx + 13, cy + s), radius=6, fill=color)
        pen.rectangle((cx - 9, cy - s + 6, cx + 9, cy + s - 10), fill=dark)
        pen.ellipse((cx - 3, cy + s - 8, cx + 3, cy + s - 2), fill=dark)
    elif kind == "cloud":
        for ox, oy, r in ((-14, 4, 13), (0, -6, 16), (15, 4, 13), (0, 8, 14)):
            pen.ellipse((cx + ox - r, cy + oy - r, cx + ox + r, cy + oy + r), fill=color)
    else:
        pen.ellipse((cx - s, cy - s, cx + s, cy + s), fill=color)


def _position(nodes, size):
    w, h = size
    pos = {}
    for name in nodes:
        x, y, kind = nodes[name]
        pos[name] = (int(30 + (w - 60) * x / 100), int(50 + (h - 90) * y / 100))
    return pos


def _same_link(link, a, b):
    return (link[0] == a and link[1] == b) or (link[0] == b and link[1] == a)


def draw_network(nodes, links, path=None, down=None, title="", size=(580, 340), packet_at=None, packet_label=""):
    """Draw a network map and return the picture.

    nodes:  {"name": (x, y, kind)}   x and y are 0 to 100 (percent of the picture). kind is
            pc, laptop, phone, server, router, switch, cloud or dns.
    links:  [("A", "B"), ...]
    path:   a list of node names to light up in green.
    down:   a list of (a, b) links that are broken. They are drawn in red.
    """
    path = path or []
    down = down or []
    if _quiet():
        return Image.new("RGB", (2, 2))
    img = Image.new("RGB", size, BG)
    pen = ImageDraw.Draw(img)
    for gx in range(0, size[0], 40):
        pen.line((gx, 0, gx, size[1]), fill=GRID)
    for gy in range(0, size[1], 40):
        pen.line((0, gy, size[0], gy), fill=GRID)
    pos = _position(nodes, size)
    for a, b in links:
        if a not in pos or b not in pos:
            continue
        broken = any(_same_link(d, a, b) for d in down)
        lit = False
        for i in range(len(path) - 1):
            if _same_link((path[i], path[i + 1]), a, b):
                lit = True
        if broken:
            x1, y1 = pos[a]
            x2, y2 = pos[b]
            steps = 14
            for k in range(0, steps, 2):
                pen.line((x1 + (x2 - x1) * k / steps, y1 + (y2 - y1) * k / steps, x1 + (x2 - x1) * (k + 1) / steps, y1 + (y2 - y1) * (k + 1) / steps), fill=BAD, width=4)
            mx, my = (x1 + x2) // 2, (y1 + y2) // 2
            pen.line((mx - 8, my - 8, mx + 8, my + 8), fill=BAD, width=4)
            pen.line((mx - 8, my + 8, mx + 8, my - 8), fill=BAD, width=4)
        else:
            pen.line((pos[a], pos[b]), fill=GOOD if lit else LINK, width=7 if lit else 3)
    font = _font(14)
    for name in nodes:
        x, y = pos[name]
        kind = nodes[name][2]
        lit = name in path
        if lit:
            pen.ellipse((x - 36, y - 36, x + 36, y + 36), outline=GOOD, width=3)
        _icon(pen, kind, x, y, KIND_COLOR.get(kind, (200, 200, 200)))
        pen.text((x, y + 38), name, font=font, fill=(235, 240, 255), anchor="mm")
    if title:
        pen.text((14, 12), title, font=_font(18), fill=(235, 240, 255))
    if packet_at is not None:
        px, py = packet_at
        pen.rounded_rectangle((px - 14, py - 10, px + 14, py + 10), radius=4, fill=GOLD, outline=(120, 80, 0), width=2)
        pen.line((px - 14, py - 10, px, py + 2), fill=(120, 80, 0), width=2)
        pen.line((px + 14, py - 10, px, py + 2), fill=(120, 80, 0), width=2)
        if packet_label:
            pen.text((px, py - 22), packet_label, font=_font(13), fill=GOLD, anchor="mm")
    return img


def show_network(nodes, links, path=None, down=None, title=""):
    """Draw the network and show it in the Output box."""
    img = draw_network(nodes, links, path, down, title)
    img.show()
    return img


def animate_packet(nodes, links, path, down=None, filename="packet.gif", title="", label=""):
    """Send an animated packet along path (a list of node names) and save it as a GIF."""
    if _quiet():
        return []
    size = (580, 340)
    pos = _position(nodes, size)
    frames = []
    for i in range(len(path) - 1):
        x1, y1 = pos[path[i]]
        x2, y2 = pos[path[i + 1]]
        for k in range(7):
            t = k / 7
            frames.append(draw_network(nodes, links, path, down, title, size, (x1 + (x2 - x1) * t, y1 + (y2 - y1) * t), label))
    last = pos[path[-1]]
    for k in range(6):
        frames.append(draw_network(nodes, links, path, down, title or "Delivered!", size, (last[0], last[1] - 4 * (k % 2)), label))
    frames[0].save(filename, save_all=True, append_images=frames[1:], duration=70, loop=0)
    return frames


def dns_tree(visited=None, title="The DNS tree"):
    """Draw the DNS hierarchy. visited is a list of the server names the question went through."""
    nodes = {
        "Your PC": (8, 84, "pc"), "Resolver": (8, 42, "dns"), "Root (.)": (56, 4, "dns"),
        ".com": (32, 40, "dns"), ".edu": (56, 40, "dns"), ".org": (82, 40, "dns"),
        "google.com": (32, 80, "server"), "schs.edu": (56, 80, "server"), "wikipedia.org": (84, 80, "server"),
    }
    links = [("Your PC", "Resolver"), ("Resolver", "Root (.)"), ("Root (.)", ".com"), ("Root (.)", ".edu"), ("Root (.)", ".org"),
             (".com", "google.com"), (".edu", "schs.edu"), (".org", "wikipedia.org")]
    img = draw_network(nodes, links, visited or [], None, title)
    img.show()
    return img


def ip_card(ip, title="An IPv4 address is 32 bits"):
    """Draw an IPv4 address as four 8-bit octets. Lit squares are 1s and dark squares are 0s."""
    parts = str(ip).split(".")
    if _quiet():
        return None
    img = Image.new("RGB", (580, 230), BG)
    pen = ImageDraw.Draw(img)
    pen.text((14, 12), title, font=_font(18), fill=(235, 240, 255))
    for i in range(4):
        left = 14 + i * 140
        try:
            value = int(parts[i])
            ok = 0 <= value <= 255
        except (ValueError, IndexError):
            value = 0
            ok = False
        pen.rounded_rectangle((left, 50, left + 128, 215), radius=10, fill=(20, 34, 70), outline=GOOD if ok else BAD, width=3)
        pen.text((left + 64, 84), parts[i] if i < len(parts) else "?", font=_font(34), fill=(235, 240, 255) if ok else BAD, anchor="mm")
        bits = format(value, "08b") if ok else "????????"
        for b in range(8):
            cx = left + 14 + b * 14
            on = bits[b] == "1"
            pen.rectangle((cx, 120, cx + 11, 145), fill=GOLD if on else (40, 56, 100) if bits[b] == "0" else (90, 40, 40))
        pen.text((left + 64, 168), bits, font=_font(17), fill=(170, 190, 235), anchor="mm")
        pen.text((left + 64, 196), "8 bits", font=_font(12), fill=(120, 140, 190), anchor="mm")
    img.show()
    return img


# ------------------------------------------------------------------ packets ---------------------------
def deliver(packets, loss=0.0, seed=None):
    """Send packets across the network. They can arrive in ANY order, and some can be lost.

    packets: a list of dictionaries with "seq", "total" and "data" keys.
    loss:    the chance (0 to 1) that each packet is lost.
    Returns the list of packets that arrived, in the order they arrived.
    """
    rng = random.Random(seed)
    sent = list(packets)
    rng.shuffle(sent)
    arrived = []
    for p in sent:
        label = "Packet " + str(p["seq"]) + " of " + str(p["total"]) + " (" + repr(p["data"]) + ")"
        if rng.random() < loss:
            print("  LOST      " + label)
        else:
            print("  ARRIVED   " + label)
            arrived.append(p)
    return arrived


def packet_picture(packets, title="Packets on the wire"):
    """Draw the packets as numbered envelopes, in the order given."""
    if _quiet():
        return None
    width = max(580, 20 + len(packets) * 74)
    img = Image.new("RGB", (width, 150), BG)
    pen = ImageDraw.Draw(img)
    pen.text((14, 10), title, font=_font(17), fill=(235, 240, 255))
    for i, p in enumerate(packets):
        left = 14 + i * 74
        pen.rounded_rectangle((left, 46, left + 64, 108), radius=6, fill=GOLD, outline=(120, 80, 0), width=2)
        pen.line((left, 46, left + 32, 80), fill=(120, 80, 0), width=2)
        pen.line((left + 64, 46, left + 32, 80), fill=(120, 80, 0), width=2)
        pen.text((left + 32, 96), "#" + str(p["seq"]), font=_font(16), fill=(60, 40, 0), anchor="mm")
        pen.text((left + 32, 128), repr(p["data"])[:10], font=_font(12), fill=(170, 190, 235), anchor="mm")
    img.show()
    return img
