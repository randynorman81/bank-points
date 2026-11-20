/* APPENDIX A: MAKING GAMES WITH PYGAME (the engine behind the walkthroughs).
   The walkthroughs themselves are in appendix-a-1.js ... appendix-a-4.js. Each one calls PYA.add({...}).
   This file turns them into the same kind of record the Python editor already shows (blocks, tips, checks) and checks the student's code live.
   Works in the browser AND in Node (the tests use it). */
(function (root) {
  "use strict";
  var UNIT = "Appendix A: Making Games with pygame";
  var WALK = [];

  /* ------------------------------------------------------------------ help popups (shared by every walkthrough) ---- */
  var LOOP = ["import asyncio", "import pygame", "", "pygame.init()", "screen = pygame.display.set_mode((480, 320))", "pygame.display.set_caption(\"My Game\")", "clock = pygame.time.Clock()", "", "running = True", "while running:", "    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False", "", "    screen.fill((30, 30, 60))", "", "    pygame.display.flip()", "    clock.tick(60)", "    await asyncio.sleep(0)", "", "pygame.quit()"];
  var TIPS = {
    loop: { title: "The game loop (every game starts here)", sections: [
      { p: "Every pygame game has the same skeleton. Type it first, then add your game inside the loop." },
      { ex: LOOP },
      { p: "**Setup** (above the loop) runs once. **The loop** runs about 60 times every second. Each time around it does the same four jobs: check input, update the game, draw, and show the picture." },
      { warn: "Everything you draw must be INSIDE the `while` loop, lined up with `screen.fill(...)`. Code at the left edge of the file, below the loop, only runs after the game is over." }
    ] },
    whyasync: { title: "Why is there an await asyncio.sleep(0) line?", sections: [
      { p: "This editor runs pygame inside your web browser. A browser can only draw the screen when your program lets it breathe for a moment. `await asyncio.sleep(0)` is that moment." },
      { good: "Put it as the LAST line inside your game loop, lined up with `clock.tick(60)`. Also put `import asyncio` at the top." },
      { warn: "If you forget it, the Game screen freezes and nothing moves. If the page ever freezes, reload it." },
      { p: "On a normal computer (outside the browser) you would not need this line. Everything else you learn in this appendix works the same in regular pygame." }
    ] },
    stopgame: { title: "How do I stop my game?", sections: [
      { list: ["Click the **Stop game** button above the Game screen.", "Or write a way to quit in your game, like pressing Escape.", "When your window closes, the output says **Game over**."] },
      { p: "Click the Game screen once before you play. That gives it the keyboard, so the arrow keys move your game instead of the page." }
    ] },
    typing: { title: "Typing code tips", sections: [
      { list: ["**Indent with Tab.** Lines inside a `while`, `if`, or `for` are pushed in 4 spaces.", "**Capital letters matter.** `pygame.draw.rect` works. `Pygame.Draw.Rect` does not.", "**Every `(` needs a `)`** and every `[` needs a `]`. A rectangle's numbers have double brackets: `(x, y, w, h)` inside the call's own brackets.", "**Lines that end in a colon** (`while`, `if`, `for`, `def`) must be followed by an indented line.", "Press **Ctrl + Enter** to run. Press **Ctrl + /** to turn the selected lines into comments."] }
    ] },
    colors: { title: "Colors: RGB tuples", sections: [
      { p: "A color is three numbers from 0 to 255: how much **red**, **green** and **blue** light. `(0, 0, 0)` is black. `(255, 255, 255)` is white." },
      { rows: [["(255, 0, 0)", "red", "all red, no green, no blue"], ["(0, 255, 0)", "green", ""], ["(0, 0, 255)", "blue", ""], ["(255, 255, 0)", "yellow", "red + green light"], ["(255, 0, 255)", "magenta", "red + blue"], ["(0, 255, 255)", "cyan", "green + blue"], ["(128, 128, 128)", "gray", "equal amounts, half strength"], ["(255, 165, 0)", "orange", ""]] },
      { good: "Give colors a name at the top of your file, like `SKY = (135, 206, 235)`. Then use `SKY` everywhere. Your code is easier to read and you change a color in one place." }
    ] },
    coords: { title: "The coordinate system", sections: [
      { p: "Positions on the screen are `(x, y)`. **(0, 0) is the top-left corner.** x grows going RIGHT. **y grows going DOWN** (the opposite of a math graph)." },
      { ex: ["(0, 0) ------------------> x  (480 on the right edge)", "  |", "  |       (240, 160) = the middle", "  |", "  v", "  y   (320 on the bottom edge)"] },
      { rows: [["(0, 0)", "top-left", ""], ["(480, 0)", "top-right", "x is the width"], ["(0, 320)", "bottom-left", "y is the height"], ["(240, 160)", "center", "half of 480 and half of 320"]] },
      { warn: "To move something UP, make y smaller. To move it DOWN, make y bigger." }
    ] },
    draw: { title: "Drawing cheat sheet", sections: [
      { p: "Every drawing function starts with `screen` (where to draw) and a color." },
      { rows: [["pygame.draw.rect(screen, color, (x, y, w, h))", "a rectangle", "x, y is the top-left corner"], ["pygame.draw.rect(screen, color, (x, y, w, h), 3)", "a rectangle outline", "the last number is the line thickness"], ["pygame.draw.circle(screen, color, (x, y), radius)", "a circle", "x, y is the CENTER"], ["pygame.draw.line(screen, color, (x1, y1), (x2, y2), 4)", "a line", "4 is the thickness"], ["pygame.draw.ellipse(screen, color, (x, y, w, h))", "an oval", "fits inside the rectangle"], ["pygame.draw.polygon(screen, color, [(x1, y1), (x2, y2), (x3, y3)])", "any shape", "a list of corner points"]] },
      { good: "Things you draw LATER appear ON TOP of things you drew earlier. Draw the sky first and the sun after it." }
    ] },
    rectobj: { title: "pygame.Rect cheat sheet", sections: [
      { p: "A `Rect` remembers a rectangle's position and size. Games use Rects for players, enemies, bullets and walls." },
      { ex: ["player = pygame.Rect(220, 140, 40, 40)   # x, y, width, height", "player.x += 4                           # move right", "print(player.left, player.right, player.top, player.bottom)", "print(player.center)", "pygame.draw.rect(screen, (255, 200, 0), player)   # draw it"] },
      { rows: [["rect.x, rect.y", "top-left corner", "change these to move it"], ["rect.left / right / top / bottom", "the four edges", "great for bouncing and walls"], ["rect.center", "the middle point", "(x, y)"], ["rect.colliderect(other)", "True or False", "do two rectangles overlap?"], ["rect.collidepoint((x, y))", "True or False", "is this point inside? (mouse clicks!)"], ["rect.clamp_ip(screen.get_rect())", "keeps it on screen", "stops it leaving the window"]] }
    ] },
    fonts: { title: "Drawing text", sections: [
      { p: "Text takes two steps: make a picture of the words, then place that picture on the screen." },
      { ex: ["font = pygame.font.Font(None, 32)      # above the loop: None = default font, 32 = size", "text = font.render(\"Score: \" + str(score), True, (255, 255, 255))   # inside the loop", "screen.blit(text, (10, 10))               # top-left corner of the words"] },
      { p: "To center the words: `text_rect = text.get_rect(center=(240, 30))` and then `screen.blit(text, text_rect)`." },
      { warn: "`font.render` only takes TEXT. Turn a number into text with `str(score)`, then join with `+`." }
    ] },
    events: { title: "Events: things that happen once", sections: [
      { p: "pygame keeps a list of things that just happened. You read it with `for event in pygame.event.get():` once per frame." },
      { rows: [["event.type == pygame.QUIT", "the window was closed", "set running = False"], ["event.type == pygame.KEYDOWN", "a key was just pressed", "event.key tells you which one"], ["event.type == pygame.MOUSEBUTTONDOWN", "the mouse was just clicked", "event.pos is where"]] },
      { ex: ["for event in pygame.event.get():", "    if event.type == pygame.QUIT:", "        running = False", "    if event.type == pygame.KEYDOWN:", "        if event.key == pygame.K_SPACE:", "            print(\"space pressed\")"] }
    ] },
    held: { title: "Held keys or a single press?", sections: [
      { rows: [["pygame.key.get_pressed()", "True EVERY frame the key is held", "walking, steering"], ["event.type == pygame.KEYDOWN", "True ONE time when the key goes down", "shooting, jumping, pausing"]] },
      { ex: ["keys = pygame.key.get_pressed()", "if keys[pygame.K_LEFT]:", "    player.x -= 4          # keeps moving while held"] },
      { p: "Key names: `K_LEFT`, `K_RIGHT`, `K_UP`, `K_DOWN`, `K_SPACE`, `K_RETURN`, `K_ESCAPE`, `K_a` ... `K_z`, `K_0` ... `K_9`." }
    ] },
    clocktime: { title: "Frames, the clock and time", sections: [
      { p: "`clock.tick(60)` keeps your game at 60 frames per second (it waits if the computer is too fast). So a speed of 4 means 4 pixels per frame, or 240 pixels per second." },
      { p: "For things that happen on a timer, ask pygame for the time in **milliseconds** (1000 ms = 1 second):" },
      { ex: ["now = pygame.time.get_ticks()        # milliseconds since the game started", "if now - last_time > 500:            # more than half a second has passed", "    last_time = now"] },
      { good: "A frame counter also works: `frame += 1` every loop, then `if frame % 60 == 0:` is true once per second." }
    ] },
    randomtips: { title: "Random numbers", sections: [
      { ex: ["import random                     # at the top of the file", "x = random.randint(0, 440)       # a random whole number from 0 to 440", "color = random.choice(colors)    # a random item from a list"] },
      { warn: "`randint(0, 440)` includes BOTH 0 and 440. Subtract the object's width so it can't stick out of the window: a 40-wide object needs `randint(0, 480 - 40)`." }
    ] },
    lists: { title: "Lists in games", sections: [
      { p: "A list holds many things in one variable. Games use lists for enemies, bullets, coins, and snake segments." },
      { ex: ["enemies = []                          # an empty list", "enemies.append(pygame.Rect(100, 0, 30, 30))   # add one", "for enemy in enemies:                 # do something to every one", "    enemy.y += 3", "    pygame.draw.rect(screen, (255, 0, 0), enemy)", "print(len(enemies))                   # how many are there?"] },
      { rows: [["lst.append(item)", "add to the end", ""], ["lst.insert(0, item)", "add to the front", "snake heads"], ["lst.pop()", "remove the last one", "snake tails"], ["lst.remove(item)", "remove that item", "see the warning below"], ["len(lst)", "how many", ""], ["item in lst", "True/False", "is it in the list?"]] }
    ] },
    removebug: { title: "Why my list skips items", sections: [
      { p: "If you remove items from a list WHILE looping over it, Python skips the next item. That causes enemies that don't get drawn or bullets that don't disappear." },
      { warn: "Wrong: `for m in meteors:` ... `meteors.remove(m)`" },
      { good: "Right: loop over a COPY. The `[:]` after the name makes the copy: `for m in meteors[:]:` ... `meteors.remove(m)`" },
      { ex: ["for m in meteors[:]:          # [:] = loop over a copy", "    m.y += 5", "    if m.top > 320:          # fell off the bottom", "        meteors.remove(m)    # safe: we are looping over the copy"] }
    ] },
    collide: { title: "Collisions", sections: [
      { ex: ["if player.colliderect(coin):          # two Rects touch", "    score += 1", "", "if hole.collidepoint(event.pos):        # a click landed inside a Rect", "    print(\"hit!\")"] },
      { p: "Both objects need to be `Rect`s. If you only have `x` and `y` numbers, make a Rect from them: `pygame.Rect(x, y, 30, 30)`." },
      { good: "Not working? Draw the Rects (`pygame.draw.rect`) so you can SEE what the computer is checking." }
    ] },
    states: { title: "Game states", sections: [
      { p: "A game is usually in one of a few **states**: `\"menu\"`, `\"playing\"`, or `\"gameover\"`. Keep the state in one variable and use `if` to decide what to update and draw." },
      { ex: ["state = \"menu\"", "", "if state == \"menu\":", "    # draw the title, wait for SPACE", "elif state == \"playing\":", "    # update and draw the game", "elif state == \"gameover\":", "    # draw GAME OVER, wait for R"] }
    ] },
    funcs: { title: "Functions for games", sections: [
      { p: "A function lets you name a chunk of code and reuse it. A **parameter** is a value you hand to the function. `return` hands a value back." },
      { ex: ["def draw_text(text, size, color, x, y):", "    font = pygame.font.Font(None, size)", "    image = font.render(text, True, color)", "    screen.blit(image, (x, y))", "", "def new_star():", "    return pygame.Rect(random.randint(0, 450), -30, 24, 24)", "", "draw_text(\"Score: 5\", 32, (255, 255, 255), 10, 10)   # call it", "stars.append(new_star())                              # use the returned Rect"] },
      { warn: "Put your `def` blocks ABOVE the game loop. Python must read a function before it can run it. Don't put `await` inside a function in this editor; keep it in the loop." }
    ] },
    errors: { title: "Errors and what they mean", sections: [
      { rows: [["Game screen is black and frozen", "no `await asyncio.sleep(0)` in the loop", "add it as the last loop line"], ["NameError: name 'pygame' is not defined", "forgot `import pygame`", "add it at the top"], ["NameError: name 'random' is not defined", "forgot `import random`", "add it at the top"], ["pygame.error: video system not initialized", "forgot `pygame.init()`", "add it before `set_mode`"], ["TypeError: argument 1 must be pygame.Surface", "the first thing in a draw call isn't `screen`", "check the order: screen, color, shape"], ["TypeError: Invalid rect argument", "wrong number of numbers", "a rect needs 4: x, y, width, height"], ["TypeError: can only concatenate str (not \"int\")", "joined text and a number", "use `str(score)`"], ["IndentationError", "lines not lined up", "everything inside a loop is pushed in 4 spaces"], ["Nothing draws", "drawn before `screen.fill` or after `flip()`", "order: fill, draw, flip"]] }
    ] },
    debug: { title: "Debugging a game", sections: [
      { steps: ["Read the red message. It names the line number.", "Check the rows in the **Errors** help for that message.", "Add a `print()` to see a value: `print(player.x, score)`. The numbers appear in the Output box.", "Print inside an `if` to see if it is ever true: `print(\"hit!\")`.", "Draw the thing you can't see (a Rect outline) to check where it really is.", "Comment out new code (select it, press Ctrl + /) and see if the old part works again."] },
      { good: "A print inside the game loop runs 60 times a second. Print only when something happens, or the Output box fills up fast." }
    ] },
    apmap: { title: "How this connects to the AP Create Task", sections: [
      { p: "The AP CSP Create Task needs a program with these ideas. A game is a great way to show every one:" },
      { rows: [["a list", "enemies = [], bullets = [], snake = [...]", "stores many values in one variable"], ["a procedure with a parameter", "def draw_text(text, size, ...)", "named, reusable code you give inputs to"], ["selection (if)", "if player.colliderect(coin):", "the program makes a decision"], ["iteration (a loop)", "while running: / for m in meteors:", "the program repeats"], ["calling your procedure", "draw_text(\"Score\", 32, ...)", "your procedure is actually used"]] },
      { good: "The exam writes these in pseudocode (`FOR EACH`, `REPEAT UNTIL`). The ideas are identical to what you write here in Python." }
    ] }
  };

  /* ------------------------------------------------------------------ tiny line diff (which lines are NEW in this step) ---- */
  function diffMarks(prev, cur, ignoreIndent) {
    if (!prev) return cur.map(function (l, i) { return i + 1; });
    var norm = ignoreIndent ? function (l) { return l.trim(); } : function (l) { return l; };
    var a = prev.map(norm), b = cur.map(norm), n = a.length, m = b.length, i, j, t = [];
    for (i = 0; i <= n; i++) { t[i] = []; for (j = 0; j <= m; j++) t[i][j] = 0; }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    var keep = {}; i = 0; j = 0;
    while (i < n && j < m) { if (a[i] === b[j]) { keep[j] = 1; i++; j++; } else if (t[i + 1][j] >= t[i][j + 1]) i++; else j++; }
    var out = []; b.forEach(function (l, k) { if (!keep[k] && l.trim() !== "") out.push(k + 1); }); return out;
  }
  /* long programs: hide long runs of unchanged lines so the step shows only what matters */
  function windowed(lines, marks) {
    if (lines.length <= 26) return { code: lines.join("\n"), mark: marks };
    var near = {}, markSet = {}; marks.forEach(function (n) { markSet[n] = 1; for (var d = -3; d <= 3; d++) near[n + d] = 1; });
    var out = [], mk = [], gap = false;
    lines.forEach(function (l, idx) {
      var n = idx + 1;
      if (near[n] || n <= 2) { out.push(l); if (markSet[n]) mk.push(out.length); gap = false; }
      else if (!gap) { out.push("# ... (the rest of your code stays the same) ..."); gap = true; }
    });
    return { code: out.join("\n"), mark: mk };
  }

  /* ------------------------------------------------------------------ build one walkthrough record ---- */
  function build(w) {
    var blocks = [], checks = [], boxN = 0, prevLines = null, curStage = 0;
    function box(items) { return items.map(function (it) { var text = typeof it === "string" ? it : it.t; if (typeof it !== "string" && it.c) it.c.forEach(function (c) { checks.push({ label: c[0], re: (c[1] instanceof RegExp ? c[1].source : (typeof c[1] === "function" ? "" : c[1])), fn: (typeof c[1] === "function" ? c[1] : null), min: c[2] || 1, box: boxN, pts: 1, stage: curStage, where: c[3] || "code" }); }); boxN++; return text; }); }
    blocks.push({ h: "What you will make" });
    (Array.isArray(w.intro) ? w.intro : [w.intro]).forEach(function (p) { blocks.push({ p: p }); });
    if (w.learn && w.learn.length) blocks.push({ p: "**You will learn:** " + w.learn.join(", ") + "." });
    blocks.push({ p: "Type the code yourself. Lines that are **green** in the code boxes are the new ones for that step. The auto-check under each checkbox turns green when your code has what the step asks for." });
    if (w.firstTips) blocks.push({ tips: w.firstTips });
    w.stages.forEach(function (s, i) {
      var num = i + 1; curStage = num;
      blocks.push({ h: "Step " + num + ": " + s.title });
      (Array.isArray(s.say) ? s.say : [s.say]).forEach(function (p) { if (p) blocks.push({ p: p }); });
      if (s.help && s.help.length) blocks.push({ tips: s.help });
      if (s.code) {
        var lines = s.code.replace(/\n+$/, "").split("\n"), marks = s.bring ? [] : diffMarks(prevLines, lines, s.reindent), win = s.bring ? { code: lines.join("\n"), mark: [] } : windowed(lines, marks);
        if (!s.bring) blocks.push({ code: win.code, mark: win.mark });
        prevLines = lines;
      }
      var items = [];
      if (s.type) items.push({ t: s.type, c: s.chk || [] });
      (s.do || []).forEach(function (d) { items.push(d); });
      if (s.run) items.push("Press **Run** (or **Ctrl + Enter**). " + s.run);
      if (items.length) blocks.push({ make: box(items) });
    });
    var last = w.stages[w.stages.length - 1];
    if (w.check !== false && last && last.code) {
      blocks.push({ h: "Step " + (w.stages.length + 1) + ": Check your whole program" });
      blocks.push({ p: "This is the whole program at this point. Compare it with yours, line by line. If something doesn't work, the answer is almost always a missing colon, a missing bracket, or a line that is not indented the same as its neighbors." });
      blocks.push({ code: last.code.replace(/\n+$/, ""), mark: [] });
      blocks.push({ build: box(w.finish || ["Run your program and play it for at least 30 seconds.", "Press **Stop game** when you are done."]) });
    }
    if (w.challenges && w.challenges.length) {
      blocks.push({ h: "Try it yourself (optional)" });
      blocks.push({ p: "These are not checked. They are how you make the game yours. Change one thing, run it, and see what happens." });
      blocks.push({ build: box(w.challenges) });
    }
    if (w.recap) blocks.push({ h: "What you learned" }, { p: w.recap });
    if (w.next) blocks.push({ p: w.next });
    var tips = {}; (function collect(list) { list.forEach(function (id) { if (TIPS[id]) tips[id] = TIPS[id]; }); })(blocks.reduce(function (all, b) { return b.tips ? all.concat(b.tips) : all; }, []));
    /* custom tips written for just this walkthrough */
    if (w.tips) Object.keys(w.tips).forEach(function (k) { tips[k] = w.tips[k]; });
    return { title: w.title, unit: UNIT, num: w.num, part: "assignment", apx: true, live: true, blocks: blocks, tips: tips, checks: checks };
  }

  /* ------------------------------------------------------------------ live auto-check (the same idea the server uses for the other walkthroughs) ---- */
  function stripComments(code) { return String(code || "").replace(/\r/g, "").split("\n").map(function (l) { var inS = null, out = ""; for (var i = 0; i < l.length; i++) { var ch = l.charAt(i); if (inS) { out += ch; if (ch === inS) inS = null; } else if (ch === '"' || ch === "'") { inS = ch; out += ch; } else if (ch === "#") break; else out += ch; } return out; }).join("\n"); }
  /* how many times the program calls a function the student wrote (def name(...)), not counting the def line itself */
  function userFnCalls(text) {
    var names = [], re = /^\s*def\s+(\w+)\s*\(/gm, m, n = 0;
    while ((m = re.exec(text))) names.push(m[1]);
    names.forEach(function (nm) { var c = new RegExp("(^|[^.\\w])" + nm + "\\s*\\(", "gm"), k; while ((k = c.exec(text))) { var ls = text.lastIndexOf("\n", k.index), line = text.slice(ls + 1, text.indexOf("\n", k.index) < 0 ? text.length : text.indexOf("\n", k.index)); if (!/^\s*def\s/.test(line)) n++; } });
    return n;
  }
  function localScore(rec, code) {
    var text = stripComments(code), notes = String(code || "").replace(/\r/g, "").split("\n").filter(function (l) { return /^\s*#/.test(l); }).join("\n"), boxes = {}, missing = [], passed = 0;
    (rec.checks || []).forEach(function (c) {
      var n = 0; try { if (c.fn) n = c.fn(text); else { var m = (c.where === "comments" ? notes : text).match(new RegExp(c.re, "gm")); n = m ? m.length : 0; } } catch (e) { n = 0; }
      var b = boxes[c.box] || (boxes[c.box] = { m: 0, t: 0, f: 0 }); b.t++; b.f += Math.min(1, n / c.min);
      if (n >= c.min) { b.m++; passed++; } else missing.push({ label: c.label, box: c.box, have: Math.min(n, c.min - 1), need: c.min, pts: 1 });
    });
    var ids = Object.keys(boxes), sum = 0, done = 0; ids.forEach(function (id) { var v = boxes[id].f / boxes[id].t; sum += v; if (boxes[id].m === boxes[id].t) done++; });
    return { pct: ids.length ? Math.round(sum * 100 / ids.length) : null, boxes: boxes, missing: missing, passed: passed, total: (rec.checks || []).length, doneBoxes: done, totalBoxes: ids.length };
  }

  var api = {
    userFnCalls: userFnCalls, UNIT: UNIT, TIPS: TIPS, WALK: WALK, diffMarks: diffMarks, localScore: localScore, stripComments: stripComments, build: build,
    add: function (w) { WALK.push(w); },
    records: function () { var out = {}; WALK.slice().sort(function (a, b) { return a.num - b.num; }).forEach(function (w) { out["pg" + w.num] = build(w); }); return out; }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.PYA = api;
})(typeof window !== "undefined" ? window : globalThis);
