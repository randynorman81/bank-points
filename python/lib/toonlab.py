"""toonlab: the Cartoon Creator toolkit.

It comes with the Python editor. Your missions use it to draw characters, speech bubbles and
comic strips. You do not have to change anything in this file, but you are welcome to read it.

    import toonlab
"""
import builtins
import copy
import math
from PIL import Image, ImageDraw, ImageFont

KINDS = ["blob", "robot", "cat", "alien"]
MOODS = ["happy", "sad", "angry", "surprised", "sleepy"]
SCENES = ["day", "night", "space", "city", "beach"]
COLORS = ["gold", "tomato", "orchid", "limegreen", "deepskyblue", "orange", "hotpink", "white"]
INK = (30, 24, 50)


def _quiet():
    """True while the editor is grading your program in the background (it skips the drawing)."""
    return getattr(builtins, "PQ_QUIET", False)


def _font(size):
    return ImageFont.load_default(size=size)


def new_panel(scene="day", width=360, height=240):
    """Make an empty comic panel with a background scene: day, night, space, city or beach."""
    img = Image.new("RGB", (width, height), (135, 206, 235))
    pen = ImageDraw.Draw(img)
    ground = int(height * 0.78)
    if scene == "night":
        pen.rectangle((0, 0, width, height), fill=(18, 20, 60))
        for i in range(26):
            sx, sy = (i * 97) % width, (i * 53) % int(height * 0.7)
            pen.ellipse((sx, sy, sx + 3, sy + 3), fill=(255, 250, 210))
        pen.ellipse((width - 70, 18, width - 30, 58), fill=(250, 245, 215))
        pen.ellipse((width - 58, 14, width - 20, 54), fill=(18, 20, 60))
        pen.rectangle((0, ground, width, height), fill=(30, 70, 50))
    elif scene == "space":
        pen.rectangle((0, 0, width, height), fill=(8, 6, 30))
        for i in range(50):
            sx, sy = (i * 71) % width, (i * 37) % height
            pen.ellipse((sx, sy, sx + 2, sy + 2), fill=(255, 255, 255))
        pen.ellipse((width - 110, height - 90, width + 30, height + 50), fill=(180, 90, 70))
        pen.ellipse((20, 20, 52, 52), fill=(120, 170, 255))
    elif scene == "city":
        pen.rectangle((0, 0, width, height), fill=(250, 190, 120))
        for i, bh in enumerate((90, 130, 70, 150, 100, 120, 80)):
            left = i * (width // 6) - 10
            pen.rectangle((left, ground - bh, left + width // 6 - 8, ground), fill=(70, 70, 110))
            for wy in range(ground - bh + 10, ground - 10, 22):
                pen.rectangle((left + 8, wy, left + 18, wy + 10), fill=(255, 230, 140))
        pen.rectangle((0, ground, width, height), fill=(60, 60, 70))
    elif scene == "beach":
        pen.rectangle((0, 0, width, int(height * 0.5)), fill=(120, 200, 245))
        pen.rectangle((0, int(height * 0.5), width, ground), fill=(40, 150, 210))
        pen.ellipse((width - 80, 14, width - 30, 64), fill=(255, 225, 80))
        pen.rectangle((0, ground, width, height), fill=(240, 220, 160))
    else:
        pen.ellipse((width - 80, 14, width - 28, 66), fill=(255, 225, 80))
        for cx, cy in ((60, 40), (170, 28)):
            for ox in (-18, 0, 18):
                pen.ellipse((cx + ox - 20, cy - 12, cx + ox + 20, cy + 14), fill=(255, 255, 255))
        pen.rectangle((0, ground, width, height), fill=(90, 190, 90))
    return img


def draw_character(panel, kind, x, y, color="gold", mood="happy", size=60):
    """Draw a character. (x, y) is the middle of its head. kind: blob, robot, cat or alien.
    mood: happy, sad, angry, surprised or sleepy."""
    pen = ImageDraw.Draw(panel)
    r = size // 2
    pen.ellipse((x - r // 2, y + r - 4, x + r // 2, y + r + r + 8), fill=color, outline=INK, width=3)
    pen.line((x - r // 2, y + r + 10, x - r, y + r + 24), fill=INK, width=4)
    pen.line((x + r // 2, y + r + 10, x + r, y + r + 24), fill=INK, width=4)
    pen.line((x - r // 4, y + r + r + 8, x - r // 4 - 6, y + r + r + 24), fill=INK, width=4)
    pen.line((x + r // 4, y + r + r + 8, x + r // 4 + 6, y + r + r + 24), fill=INK, width=4)
    if kind == "robot":
        pen.line((x, y - r, x, y - r - 14), fill=INK, width=3)
        pen.ellipse((x - 5, y - r - 22, x + 5, y - r - 12), fill="red", outline=INK)
        pen.rounded_rectangle((x - r, y - r, x + r, y + r), radius=8, fill=color, outline=INK, width=3)
    elif kind == "cat":
        pen.polygon([(x - r, y - r // 3), (x - r // 2 - 4, y - r - 14), (x - 2, y - r + 2)], fill=color, outline=INK)
        pen.polygon([(x + r, y - r // 3), (x + r // 2 + 4, y - r - 14), (x + 2, y - r + 2)], fill=color, outline=INK)
        pen.ellipse((x - r, y - r, x + r, y + r), fill=color, outline=INK, width=3)
        for sy in (-3, 5):
            pen.line((x - r - 10, y + 8 + sy, x - r // 2, y + 8), fill=INK, width=2)
            pen.line((x + r + 10, y + 8 + sy, x + r // 2, y + 8), fill=INK, width=2)
    elif kind == "alien":
        pen.line((x - r // 2, y - r + 4, x - r // 2 - 6, y - r - 16), fill=INK, width=3)
        pen.line((x + r // 2, y - r + 4, x + r // 2 + 6, y - r - 16), fill=INK, width=3)
        pen.ellipse((x - r // 2 - 11, y - r - 22, x - r // 2 - 1, y - r - 12), fill="limegreen", outline=INK)
        pen.ellipse((x + r // 2 + 1, y - r - 22, x + r // 2 + 11, y - r - 12), fill="limegreen", outline=INK)
        pen.ellipse((x - r, y - r - 6, x + r, y + r), fill=color, outline=INK, width=3)
    else:
        pen.ellipse((x - r, y - r, x + r, y + r), fill=color, outline=INK, width=3)
    e = max(3, r // 6)
    for ex in (-r // 2, r // 2):
        if mood == "sleepy":
            pen.line((x + ex - e - 2, y - r // 5, x + ex + e + 2, y - r // 5), fill=INK, width=3)
        elif mood == "surprised":
            pen.ellipse((x + ex - e - 2, y - r // 3 - e - 2, x + ex + e + 2, y - r // 3 + e + 2), fill="white", outline=INK, width=2)
            pen.ellipse((x + ex - e // 2, y - r // 3 - e // 2, x + ex + e // 2, y - r // 3 + e // 2), fill=INK)
        else:
            pen.ellipse((x + ex - e, y - r // 3 - e, x + ex + e, y - r // 3 + e), fill=INK)
    if mood == "angry":
        pen.line((x - r // 2 - 8, y - r // 3 - 12, x - 4, y - r // 3 - 5), fill=INK, width=3)
        pen.line((x + r // 2 + 8, y - r // 3 - 12, x + 4, y - r // 3 - 5), fill=INK, width=3)
    my = y + r // 2
    if mood == "happy":
        pen.arc((x - r // 2, my - r // 3, x + r // 2, my + r // 3), 15, 165, fill=INK, width=3)
    elif mood == "sad":
        pen.arc((x - r // 2, my, x + r // 2, my + r // 2 + 4), 195, 345, fill=INK, width=3)
    elif mood == "surprised":
        pen.ellipse((x - 7, my - 6, x + 7, my + 10), fill=INK)
    elif mood == "angry":
        pen.line((x - r // 3, my + 2, x + r // 3, my + 2), fill=INK, width=3)
    else:
        pen.ellipse((x - 4, my - 2, x + 4, my + 6), outline=INK, width=2)
    return panel


def speech_bubble(panel, text, x, y, tail_x=None, tail_y=None):
    """Draw a speech bubble with its top-left corner at (x, y). The tail points at (tail_x, tail_y)."""
    pen = ImageDraw.Draw(panel)
    font = _font(15)
    words = str(text).split()
    lines, line = [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if pen.textlength(trial, font=font) > 170 and line:
            lines.append(line)
            line = word
        else:
            line = trial
    lines.append(line)
    w = int(max(pen.textlength(l, font=font) for l in lines)) + 20
    h = len(lines) * 19 + 14
    if tail_x is not None:
        bx = min(max(x + w // 2, x + 14), x + w - 14)
        pen.polygon([(bx - 9, y + h - 2), (bx + 9, y + h - 2), (tail_x, tail_y)], fill="white", outline=INK)
    pen.rounded_rectangle((x, y, x + w, y + h), radius=12, fill="white", outline=INK, width=2)
    if tail_x is not None:
        pen.polygon([(bx - 7, y + h - 3), (bx + 7, y + h - 3), (bx, y + h + 3)], fill="white")
    for i, l in enumerate(lines):
        pen.text((x + 10, y + 7 + i * 19), l, font=font, fill=INK)
    return panel


def caption(panel, text):
    """Add a caption box at the top of a panel."""
    pen = ImageDraw.Draw(panel)
    font = _font(14)
    w = int(pen.textlength(str(text), font=font)) + 16
    pen.rectangle((0, 0, w, 24), fill=(255, 236, 140), outline=INK, width=2)
    pen.text((8, 4), str(text), font=font, fill=INK)
    return panel


def comic_strip(panels, title="My Comic"):
    """Put the panels side by side (two per row), show the strip, and return it."""
    if _quiet():
        return None
    pw, ph = panels[0].size
    cols = 2 if len(panels) > 1 else 1
    rows = (len(panels) + cols - 1) // cols
    strip = Image.new("RGB", (cols * (pw + 12) + 12, rows * (ph + 12) + 52), (250, 245, 230))
    pen = ImageDraw.Draw(strip)
    pen.text((strip.width // 2, 26), title, font=_font(26), fill=INK, anchor="mm")
    for i, panel in enumerate(panels):
        px = 12 + (i % cols) * (pw + 12)
        py = 50 + (i // cols) * (ph + 12)
        strip.paste(panel, (px, py))
        pen.rectangle((px - 2, py - 2, px + pw + 1, py + ph + 1), outline=INK, width=3)
        pen.ellipse((px + pw - 26, py + ph - 26, px + pw - 4, py + ph - 4), fill=(255, 236, 140), outline=INK, width=2)
        pen.text((px + pw - 15, py + ph - 15), str(i + 1), font=_font(14), fill=INK, anchor="mm")
    strip.show()
    return strip


def animate(panels, filename="cartoon.gif", ms=900):
    """Save the panels as an animated GIF (one panel after another)."""
    if _quiet():
        return filename
    panels[0].save(filename, save_all=True, append_images=panels[1:], duration=ms, loop=0)
    return filename


# ------------------------------------------------------------------ mission helpers ------------------
def banner(title, subtitle=""):
    """Print a studio banner."""
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
        name = label + "(" + ", ".join(repr(a) for a in args) + ")"
        try:
            got = func(*args)
        except Exception as error:
            print("  FAIL  " + name)
            print("        your function crashed: " + type(error).__name__ + ": " + str(error))
            continue
        if check(name, got, expected):
            passed += 1
    return passed


def report(mission, passed, total):
    """Print the final report. Prints MISSION COMPLETE only when every test passed."""
    print()
    print("STUDIO REPORT: " + mission)
    print("Tests passed: " + str(passed) + " of " + str(total))
    if passed == total and total > 0:
        print("*** MISSION COMPLETE ***")
        ranks = ["Doodler", "Sketch Artist", "Cartoonist", "Lead Animator", "Studio Director"]
        print("Rank: " + ranks[min(len(ranks) - 1, total // 4)])
    else:
        print("Not yet. Read the FAIL lines above and fix your code.")


def _panel_test(func):
    passed = 0
    char = {"name": "Bolt", "kind": "robot", "color": "orange"}
    panel = func(char, "Hello there!", "night")
    passed += check("make_panel returns a picture", hasattr(panel, "size") and hasattr(panel, "paste"), True)
    passed += check("make_panel: the panel is 360 by 240", getattr(panel, "size", None), (360, 240))
    return passed


MISSIONS = {
    "7.1": [
        ("add_character", [(([], "Bolt", "robot", "orange"), 1), ((["x"], "Pixel", "cat", "gold"), 2)]),
        ("find_character", [(([{"name": "Bolt", "kind": "robot", "color": "orange"}, {"name": "Pixel", "kind": "cat", "color": "gold"}], "Pixel"), {"name": "Pixel", "kind": "cat", "color": "gold"}),
                            (([{"name": "Bolt", "kind": "robot", "color": "orange"}], "Zed"), None), (([], "Bolt"), None)]),
        ("remove_character", [(([{"name": "Bolt", "kind": "robot", "color": "orange"}], "Bolt"), True), (([{"name": "Bolt", "kind": "robot", "color": "orange"}], "Zed"), False)]),
        ("lines_by", [(([["Bolt", "Hi!"], ["Pixel", "Hello?"], ["Bolt", "Bye."]], "Bolt"), ["Hi!", "Bye."]), (([["Bolt", "Hi!"]], "Zed"), []), (([], "Bolt"), [])]),
        ("pick_mood", [("Hello?", "surprised"), ("Stop that!", "angry"), ("I am so sad...", "sad"), ("Nice day", "happy")]),
        ("make_panel", _panel_test, 2),
    ],
}


def run_mission(name, namespace):
    """Run the built-in tests for a mission against YOUR functions.  Use it like this:  toonlab.run_mission("7.1", globals())"""
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
        passed += test(func_name, func, cases)
    report("Mission " + name, passed, total)
    return passed == total
