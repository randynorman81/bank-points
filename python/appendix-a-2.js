/* APPENDIX A, PART 2: your first complete games (walkthroughs 8 to 12): Meteor Dodge and Whack-a-Mole. */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);

  /* ================================================================= Meteor Dodge: one program, built up step by step ================ */
  /* o.move: arrow keys    o.mm: 0 none, 1 one meteor falls, 2 it resets, 3 a list spawns meteors, 4 list + removal, 5 list + random sizes
     o.hit / o.freeze / o.over (1 = GAME OVER, 2 = + Press R) / o.score / o.restart / o.hard */
  function md(o) {
    var s = [], I = o.freeze ? "        " : "    ", mm = o.mm || 0, list = mm >= 3, fonts = !!(o.over || o.score);
    s.push("import asyncio"); if (mm >= 1) s.push("import random");
    s.push("import pygame", "", "pygame.init()", "screen = pygame.display.set_mode((480, 320))", "pygame.display.set_caption(\"Meteor Dodge\")", "clock = pygame.time.Clock()");
    if (fonts) s.push("font = pygame.font.Font(None, 30)", "big_font = pygame.font.Font(None, 64)");
    s.push("", "player = pygame.Rect(220, 280, 40, 24)"); if (o.move) s.push("speed = 6");
    if (mm === 1 || mm === 2) s.push("meteor = pygame.Rect(random.randint(0, 450), -30, 30, 30)", "meteor_speed = 4");
    if (list) { s.push("meteors = []"); if (!o.hard) s.push("meteor_speed = 4"); s.push("spawn_timer = 0"); }
    if (o.score) s.push("score = 0");
    if (o.hit) s.push("game_over = False");
    s.push("", "running = True", "while running:", "    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False");
    if (o.restart) s.push("        if event.type == pygame.KEYDOWN:", "            if event.key == pygame.K_r and game_over:", "                meteors = []", "                score = 0", "                spawn_timer = 0", "                player.x = 220", "                game_over = False");
    s.push("");
    var u = [];
    if (o.move) u.push("keys = pygame.key.get_pressed()", "if keys[pygame.K_LEFT] or keys[pygame.K_a]:", "    player.x -= speed", "if keys[pygame.K_RIGHT] or keys[pygame.K_d]:", "    player.x += speed", "player.clamp_ip(screen.get_rect())", "");
    if (mm === 1) u.push("meteor.y += meteor_speed", "");
    if (mm === 2) u.push("meteor.y += meteor_speed", "if meteor.top > 320:", "    meteor.y = -30", "    meteor.x = random.randint(0, 450)", "");
    if (list) {
      if (o.score) u.push("score += 1");
      if (o.hard) u.push("meteor_speed = 4 + score // 600", "spawn_delay = max(12, 30 - score // 300)");
      u.push("spawn_timer += 1", "if spawn_timer >= " + (o.hard ? "spawn_delay" : "30") + ":", "    spawn_timer = 0");
      if (mm >= 5) u.push("    size = random.randint(20, 45)", "    meteors.append(pygame.Rect(random.randint(0, 480 - size), -size, size, size))");
      else u.push("    meteors.append(pygame.Rect(random.randint(0, 450), -30, 30, 30))");
      u.push("", "for m in meteors" + (mm >= 4 ? "[:]" : "") + ":", "    m.y += meteor_speed");
      if (mm >= 4) u.push("    if m.top > 320:", "        meteors.remove(m)");
      if (o.hit) u.push("    if player.colliderect(m):", "        game_over = True");
      u.push("");
    }
    if (o.freeze) { s.push("    if not game_over:"); u.forEach(function (l) { s.push(l ? I + l : ""); }); }
    else u.forEach(function (l) { s.push(l ? I + l : ""); });
    s.push("    screen.fill((10, 10, 30))", "    pygame.draw.rect(screen, (80, 200, 255), player)");
    if (mm === 1 || mm === 2) s.push("    pygame.draw.rect(screen, (200, 120, 60), meteor)");
    if (list) s.push("    for m in meteors:", "        pygame.draw.rect(screen, (200, 120, 60), m)");
    if (o.score) s.push("    text = font.render(\"Time: \" + str(score // 60), True, (255, 255, 255))", "    screen.blit(text, (10, 10))");
    if (o.over) {
      s.push("", "    if game_over:", "        over = big_font.render(\"GAME OVER\", True, (255, 80, 80))", "        screen.blit(over, over.get_rect(center=(240, 140)))");
      if (o.over >= 2) s.push("        again = font.render(\"Press R to play again\", True, (255, 255, 255))", "        screen.blit(again, again.get_rect(center=(240, 190)))");
    }
    s.push("", "    pygame.display.flip()", "    clock.tick(60)", "    await asyncio.sleep(0)", "", "pygame.quit()", "");
    return s.join("\n");
  }
  var M = md;

  /* ----------------------------------------------------------------- 8. Meteor Dodge 1 ---- */
  var A8 = [md({}), md({ move: 1 }), md({ move: 1, mm: 1 }), md({ move: 1, mm: 2 })];
  P.add({
    num: 8, title: "Meteor Dodge 1: Player and a Meteor",
    intro: ["You are going to build a complete game called **Meteor Dodge**. You steer a little ship along the bottom of the screen while meteors fall from the sky. Don't get hit! The longer you survive, the higher your score.",
      "That is a lot of game, so you will build it in **three walkthroughs**. In this first one you make the ship and one falling meteor."],
    learn: ["moving a player left and right", "keeping a Rect on screen", "a falling object", "resetting an object to the top at a random spot"],
    firstTips: ["loop", "rectobj"],
    stages: [
      { title: "The ship", say: ["Type the game loop. Then make the player: a `Rect` that is 40 wide and 24 tall, near the bottom (`y = 280`, because the window is 320 tall).", "This is the same loop you have typed before, so see if you can do it without looking at the help."], help: ["loop", "rectobj"], code: A8[0],
        type: "Type the whole program. Draw the player as a light blue rectangle.", chk: [["a player Rect", /player\s*=\s*pygame\.Rect\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/], ["the game loop", /while\s+running\s*:/], ["await asyncio.sleep(0)", /await\s+asyncio\.sleep\(\s*0\s*\)/], ["the player is drawn", /draw\.rect\(\s*screen\s*,[^\n]*,\s*player\s*\)/]],
        run: "A small blue ship sits at the bottom of a dark screen." },
      { title: "Steer left and right", say: ["Meteor Dodge only needs **left and right**, so you only need two `if` checks. Allow both the arrow keys and **A / D**.", "`clamp_ip` keeps the ship from sliding out of the window."], help: ["held", "rectobj"], code: A8[1],
        type: "Add `speed = 6` with the player. Type the key code before `screen.fill`.", chk: [["speed = 6", /speed\s*=\s*6/], ["key.get_pressed()", /pygame\.key\.get_pressed\(\)/], ["moving the player's x", /player\.x\s*[-+]=\s*speed[\s\S]*player\.x\s*[-+]=\s*speed/], ["clamp_ip", /player\.clamp_ip\(\s*screen\.get_rect\(\)\s*\)/]],
        run: "Click the game screen. Steer the ship left and right with the arrow keys or A and D." },
      { title: "Make a meteor", say: ["A meteor is just another `Rect`. It starts **above** the screen (a negative `y` such as `-30`) at a random `x`.", "Each frame we add `meteor_speed` to its `y`. Positive `y` is **down**, so it falls.", "You need `import random` at the top for `random.randint`."], help: ["randomtips", "coords"], code: A8[2],
        type: "Add `import random` at the top. Add `meteor` and `meteor_speed` after `speed`. Add the `meteor.y +=` line in the loop, and draw the meteor.", chk: [["import random", /^import random\s*$/m], ["a meteor Rect that starts at a random x", /meteor\s*=\s*pygame\.Rect\(\s*random\.randint\(/], ["meteor.y += meteor_speed", /meteor\.y\s*\+=\s*meteor_speed/], ["the meteor is drawn", /draw\.rect\(\s*screen\s*,[^\n]*,\s*meteor\s*\)/]],
        run: "An orange meteor falls from the top and drops off the bottom. Then there is nothing left to dodge. We'll fix that." },
      { title: "Send the meteor back to the top", say: ["When the meteor's **top edge** goes past the bottom of the screen (`meteor.top > 320`), put it back above the screen at a new random `x`.", "Notice that the new `x` is at most `450`. The meteor is 30 wide, so 450 + 30 = 480 keeps it fully on screen."], help: ["randomtips"], code: A8[3],
        type: "Type the `if meteor.top > 320:` block under the `meteor.y +=` line.", chk: [["if meteor.top > 320:", /if\s+meteor\.top\s*>\s*320\s*:/], ["meteor.y = -30", /meteor\.y\s*=\s*-\s*30/], ["a new random x for the meteor", /meteor\.x\s*=\s*random\.randint\(/]],
        run: "A meteor falls over and over from random spots. Try to dodge it." }
    ],
    finish: ["Dodge the meteor 10 times in a row.", "Change `meteor_speed` to `8`. Is it still fair?"],
    challenges: ["Make the ship a triangle using `pygame.draw.polygon` and the player's corners (`player.midtop`, `player.bottomleft`, `player.bottomright`).", "Make the meteor a circle with `pygame.draw.circle(screen, color, meteor.center, 15)`.", "Make the meteor fall at a random speed each time it resets.", "Make the ship move faster when you hold Shift."],
    recap: "A falling object is a Rect whose `y` goes up by a speed every frame. When it leaves the screen, you send it back to the top at a new random `x`.",
    next: "**Next:** one meteor is easy. In Walkthrough 9 you will use a **list** to make a whole sky full of them."
  });

  /* ----------------------------------------------------------------- 9. Meteor Dodge 2 ---- */
  var A9 = [md({ move: 1, mm: 2 }), md({ move: 1, mm: 3 }), md({ move: 1, mm: 4 }), md({ move: 1, mm: 5 })];
  P.add({
    num: 9, title: "Meteor Dodge 2: A Sky Full of Meteors",
    intro: ["One meteor is boring. A real game needs a **whole sky** of them. The way to hold \"as many as we need\" is a **list**.",
      "In this walkthrough you replace the single `meteor` with a list called `meteors`. You will make new meteors on a timer, move every one of them with a `for` loop, and remove the ones that fall off the screen."],
    learn: ["lists and .append()", "for loops over a list", "a spawn timer", "removing from a list safely (the [:] copy)", "random sizes"],
    firstTips: ["lists", "removebug"],
    stages: [
      { title: "Bring your code with you", say: ["Open **Walkthrough 8**. Click the code box, press **Ctrl + A**, then **Ctrl + C**.", "Come back here, click the empty code box, and press **Ctrl + V**."], help: ["bring8"], code: A9[0], bring: true,
        type: "Paste your finished Walkthrough 8 code into this code box.", chk: [["the player Rect", /player\s*=\s*pygame\.Rect\(/], ["the meteor falling at meteor_speed", /meteor_speed\s*=\s*4/], ["clamp_ip", /clamp_ip/]],
        run: "Your ship steers and one meteor falls." },
      { title: "From one meteor to a list", say: ["Delete the single `meteor = ...` line, and the whole `if meteor.top > 320:` block. Delete the `meteor.y += meteor_speed` line and the line that draws `meteor`, too.", "Now add an **empty list** called `meteors`, and a `spawn_timer`. Every frame we add 1 to `spawn_timer`. When it reaches 30 (half a second), we make a new meteor with `.append(...)` and start the timer over.", "Then use a `for` loop to move and draw **every** meteor in the list."], help: ["lists", "bring8"], code: A9[1],
        type: "Make the changes described above. This is the biggest change so far, so go slowly and compare with the green lines.", chk: [["meteors = [] (an empty list)", /meteors\s*=\s*\[\s*\]/], ["spawn_timer = 0", /spawn_timer\s*=\s*0/], ["meteors.append(pygame.Rect(...))", /meteors\.append\(\s*pygame\.Rect\(/], ["for m in meteors:", /for\s+m\s+in\s+meteors\s*(\[\s*:\s*\])?\s*:/, 2]],
        run: "Meteors rain down every half second. But they never go away. They keep falling below the screen forever (that is a problem called a **memory leak**).",
        do: ["Add a line `print(len(meteors))` right after `meteors.append(...)`. Run it for 10 seconds and watch the Output box. What happens to the number? Then **delete** that print line."] },
      { title: "Remove meteors that have fallen off", say: ["A meteor that is below the screen is useless. Remove it from the list so the list doesn't grow forever.", "There is a trap: if you remove an item from a list **while looping over that same list**, Python skips the next item. The fix is to loop over a **copy**. Adding `[:]` after the name makes a copy: `for m in meteors[:]:`.", "Read the **Why my list skips items** help if you want the details."], help: ["removebug", "lists"], code: A9[2],
        type: "Change the first `for` line to loop over `meteors[:]`. Add the `if m.top > 320:` block under `m.y += meteor_speed`.", chk: [["for m in meteors[:]:", /for\s+m\s+in\s+meteors\[\s*:\s*\]\s*:/], ["if m.top > 320:", /if\s+m\.top\s*>\s*320\s*:/], ["meteors.remove(m)", /meteors\.remove\(\s*m\s*\)/]],
        run: "Same as before, but now `len(meteors)` stays small. (If you add a print again, it stays around 10.)" },
      { title: "Meteors of different sizes", say: ["Let's make some meteors big and some small. Make a variable `size` with a random number, and use it for the Rect's width, height, and starting height.", "`-size` starts the meteor just above the screen, whatever its size. `480 - size` keeps it fully on the screen on the right."], help: ["randomtips"], code: A9[3],
        type: "Change the `meteors.append` line into the two lines using `size`.", chk: [["size = random.randint(20, 45)", /size\s*=\s*random\.randint\(\s*\d+\s*,\s*\d+\s*\)/], ["a meteor that uses size for its width and height", /pygame\.Rect\(\s*random\.randint\(\s*0\s*,\s*480\s*-\s*size\s*\)\s*,\s*-\s*size\s*,\s*size\s*,\s*size\s*\)/]],
        run: "Meteors come in all sizes. Dodging gets more interesting." }
    ],
    finish: ["Play it for a minute. Is it still possible to dodge them all?", "Press **Stop game** when you are done."],
    challenges: ["Make the meteors spawn **faster** by changing `30` to `15`. Make them spawn slower. Which feels best?", "Give each meteor its own random color. (Hint: a list of Rects can't hold colors. Look up how to store a **list of lists**, like `[rect, color]`, or ask your teacher.)", "Make meteors fall at a random speed instead of the same `meteor_speed`. What would you need to store with each meteor?", "Draw the meteors as circles: `pygame.draw.circle(screen, color, m.center, m.width // 2)`."],
    tips: { bring8: { title: "I did not finish Walkthrough 8", sections: [
      { p: "Type your Walkthrough 8 program. This is what it should look like:" },
      { ex: A8[3].replace(/\n+$/, "").split("\n") }
    ] } },
    recap: "A **list** holds many values in one variable. `.append()` adds to it, `for` goes through it, and `.remove()` takes one out. Loop over `meteors[:]` (a copy) when you remove from the list inside the loop.",
    next: "**Next:** the meteors can't hurt you yet. In Walkthrough 10 you add **collisions, a score, and Game Over**."
  });

  /* ----------------------------------------------------------------- 10. Meteor Dodge 3 ---- */
  var B = [
    md({ move: 1, mm: 5 }),
    md({ move: 1, mm: 5, hit: 1 }),
    md({ move: 1, mm: 5, hit: 1, freeze: 1 }),
    md({ move: 1, mm: 5, hit: 1, freeze: 1, over: 1 }),
    md({ move: 1, mm: 5, hit: 1, freeze: 1, over: 1, score: 1 }),
    md({ move: 1, mm: 5, hit: 1, freeze: 1, over: 2, score: 1, restart: 1 }),
    md({ move: 1, mm: 5, hit: 1, freeze: 1, over: 2, score: 1, restart: 1, hard: 1 })
  ];
  P.add({
    num: 10, title: "Meteor Dodge 3: Hits, Score and Game Over",
    intro: ["Time to finish the game. You will make the ship **get hit**, freeze the game with a **Game Over** message, count a **score**, let the player **restart**, and make the game get **harder** the longer you survive.",
      "These are exactly the pieces every game needs, so the same ideas will come back in the next games."],
    learn: ["colliderect with every item in a list", "a game_over variable (a boolean)", "if not game_over:", "text on screen", "restarting by resetting variables", "difficulty that grows"],
    firstTips: ["collide", "states"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 9** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring9"], code: B[0], bring: true,
        type: "Paste your finished Walkthrough 9 code into this code box.", chk: [["the meteors list", /meteors\s*=\s*\[\s*\]/], ["the spawn timer", /spawn_timer/], ["random sizes", /size\s*=\s*random\.randint/]],
        run: "Your ship steers, and meteors of different sizes fall past it." },
      { title: "Detect a hit", say: ["We already loop over every meteor. Inside that loop, ask: is this meteor touching the player? `player.colliderect(m)` is `True` when they overlap.", "A variable that is either `True` or `False` is called a **boolean**. We'll use `game_over = False` to remember whether the game has ended."], help: ["collide"], code: B[1],
        type: "Add `game_over = False` with your setup. Type the `if player.colliderect(m):` block at the end of the `for m` loop.", chk: [["game_over = False", /game_over\s*=\s*False/], ["if player.colliderect(m):", /if\s+player\.colliderect\(\s*m\s*\)\s*:/], ["game_over = True", /game_over\s*=\s*True/]],
        run: "Nothing looks different when you are hit, but the variable changed. Next you'll make that matter." },
      { title: "Freeze the game when you lose", say: ["When `game_over` is `True`, the ship and meteors should stop. Put all of the **update code** (steering, spawning, moving meteors) inside `if not game_over:`.", "Don't change the drawing code. It still runs every frame, so you can see the frozen game.", "To indent many lines at once: select them with the mouse, then press **Tab**."], help: ["typing", "states"], code: B[2], reindent: true,
        type: "Add `if not game_over:` above `keys = ...`. Then select every line from `keys = ...` through the end of the `for m` loop, and press **Tab** to indent them one level.", chk: [["if not game_over:", /if\s+not\s+game_over\s*:/]],
        run: "Hit a meteor. The whole game freezes with the meteors where they were." },
      { title: "Say GAME OVER", say: ["Make two fonts above the loop: a normal one (30) and a big one (64). After you draw everything, add `if game_over:` and draw a big red **GAME OVER** in the middle.", "`over.get_rect(center=(240, 140))` centers the text. You saw that in Walkthrough 4."], help: ["fonts"], code: B[3],
        type: "Add the two fonts above `player`. Type the `if game_over:` block after the meteors are drawn.", chk: [["a big font", /big_font\s*=\s*pygame\.font\.Font\(\s*None\s*,\s*\d+\s*\)/], ["if game_over: (drawing the message)", /if\s+game_over\s*:\s*\n\s+over\s*=\s*big_font\.render\(/], ["the GAME OVER text is centered", /get_rect\(\s*center\s*=\s*\(/]],
        run: "Hit a meteor. The words **GAME OVER** appear over the frozen game." },
      { title: "Keep score", say: ["Your score is how long you have survived. Add 1 to `score` every frame (inside `if not game_over:`, so it stops when you lose). 60 frames is one second, so show `score // 60`.", "`//` is **floor division**: it divides and throws away the decimal part. `185 // 60` is `3`."], help: ["fonts", "clocktime"], code: B[4],
        type: "Add `score = 0` with your setup. Add `score += 1` at the top of the `if not game_over:` block. Type the two lines that draw the time.", chk: [["score = 0", /score\s*=\s*0/], ["score += 1", /score\s*\+=\s*1/], ["Time text uses score // 60", /str\(\s*score\s*\/\/\s*60\s*\)/]],
        run: "A timer counts the seconds in the top left, and stops when the game is over." },
      { title: "Press R to play again", say: ["Restarting just means **setting everything back** to how it was at the start: no meteors, score 0, timer 0, the ship in the middle, and `game_over = False`.", "Detect the key press with a `KEYDOWN` event. Only restart if `game_over` is `True`, or pressing R during play would wipe your game.", "Also add a second line of text so players know to press R."], help: ["events", "states"], code: B[5],
        type: "Add the `KEYDOWN` block inside the `for event` loop. Add the `Press R to play again` text lines inside `if game_over:`.", chk: [["if event.type == pygame.KEYDOWN:", /if\s+event\.type\s*==\s*pygame\.KEYDOWN\s*:/], ["pressing R while game_over", /event\.key\s*==\s*pygame\.K_r\s+and\s+game_over/], ["meteors = [] to clear the list", /^\s+meteors\s*=\s*\[\s*\]\s*$/m], ["game_over = False to start again", /game_over\s*=\s*False[\s\S]*game_over\s*=\s*False/], ["the Press R message", /Press R to play again/]],
        run: "Get hit, press **R**, and play again without pressing Run." },
      { title: "Make it get harder", say: ["A good game gets harder as you play. The longer you survive, the faster the meteors fall **and** the faster they spawn.", "`score // 600` goes up by 1 every 10 seconds. So the speed starts at 4, then 5 after 10 seconds, then 6... `max(12, ...)` makes sure the spawn delay never drops below 12 frames.", "`meteor_speed` is now calculated every frame, so **delete** the `meteor_speed = 4` line from your setup."], help: ["clocktime"], code: B[6],
        type: "Delete `meteor_speed = 4` from the setup. Add the `meteor_speed = ...` and `spawn_delay = ...` lines after `score += 1`. Change the `if spawn_timer >= 30:` line to use `spawn_delay`.", chk: [["meteor_speed = 4 + score // 600", /meteor_speed\s*=\s*4\s*\+\s*score\s*\/\/\s*600/], ["spawn_delay = max(12, ...)", /spawn_delay\s*=\s*max\(\s*12\s*,/], ["if spawn_timer >= spawn_delay:", /if\s+spawn_timer\s*>=\s*spawn_delay\s*:/]],
        run: "Survive for 30 seconds. Notice that the meteors fall faster and faster." }
    ],
    finish: ["Play for at least two minutes. What is your best time?", "Ask a friend to try. Can they beat you?"],
    challenges: ["Add a **high score**: a variable `best` that keeps the biggest `score // 60` across restarts. Show it under the time.", "Add **3 lives**: instead of ending the game on the first hit, remove the meteor, subtract 1 from `lives`, and end the game when `lives` is `0`.", "Make the ship flash or shake when it's hit.", "Add a second kind of falling object: a **star** that gives bonus points when you catch it."],
    tips: { bring9: { title: "I did not finish Walkthrough 9", sections: [
      { p: "Type your Walkthrough 9 program. This is what it should look like:" },
      { ex: B[0].replace(/\n+$/, "").split("\n") }
    ] } },
    recap: "A game needs **detect, react, show, restart**. You detect a hit with `colliderect`, react by setting `game_over = True`, show a message, and restart by resetting every variable. Difficulty can grow by making speeds depend on the score.",
    next: "**You finished Meteor Dodge!** Next you will build **Whack-a-Mole**, which uses the **mouse**."
  });

  /* ================================================================= Whack-a-Mole ================ */
  /* o.click / o.timer (mole moves on its own) / o.clock (game timer + game over) / o.restart */
  function wm(o) {
    var s = [], fonts = o.click;
    s.push("import asyncio", "import random", "import pygame", "", "pygame.init()", "screen = pygame.display.set_mode((480, 320))", "pygame.display.set_caption(\"Whack-a-Mole\")", "clock = pygame.time.Clock()");
    if (fonts) s.push("font = pygame.font.Font(None, 32)");
    if (o.clock) s.push("big_font = pygame.font.Font(None, 56)");
    s.push("", "GRASS = (70, 150, 70)", "HOLE = (60, 40, 20)", "MOLE = (150, 100, 60)", "", "holes = []", "for row in range(3):", "    for col in range(3):", "        holes.append((120 + col * 120, 90 + row * 80))", "", "mole = random.randint(0, 8)");
    if (o.timer) s.push("mole_time = pygame.time.get_ticks()");
    if (o.clock) s.push("game_start = pygame.time.get_ticks()");
    if (o.click) s.push("score = 0");
    if (o.restart) s.push("high_score = 0");
    if (o.clock) s.push("playing = True");
    s.push("", "running = True", "while running:");
    if (o.timer || o.clock) s.push("    now = pygame.time.get_ticks()");
    s.push("    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False");
    if (o.click) {
      s.push("        if event.type == pygame.MOUSEBUTTONDOWN" + (o.clock ? " and playing" : "") + ":", "            mole_rect = pygame.Rect(0, 0, 52, 52)", "            mole_rect.center = holes[mole]", "            if mole_rect.collidepoint(event.pos):", "                score += 1", "                mole = random.randint(0, 8)");
      if (o.timer) s.push("                mole_time = now");
    }
    if (o.restart) s.push("        if event.type == pygame.KEYDOWN and not playing:", "            if event.key == pygame.K_SPACE:", "                score = 0", "                game_start = now", "                mole_time = now", "                playing = True");
    s.push("");
    if (o.clock) s.push("    time_left = 30 - (now - game_start) // 1000");
    if (o.timer || o.clock) {
      var ind = o.clock ? "        " : "    ";
      if (o.clock) s.push("    if playing:");
      if (o.timer) s.push(ind + "if now - mole_time > 900:", ind + "    mole = random.randint(0, 8)", ind + "    mole_time = now");
      if (o.clock) { s.push("        if time_left <= 0:", "            playing = False"); if (o.restart) s.push("            if score > high_score:", "                high_score = score"); }
      s.push("");
    }
    s.push("    screen.fill(GRASS)", "    for hole in holes:", "        pygame.draw.circle(screen, HOLE, hole, 32)");
    s.push((o.clock ? "    if playing:\n        x, y = holes[mole]\n        pygame.draw.circle(screen, MOLE, (x, y), 26)\n        pygame.draw.circle(screen, (0, 0, 0), (x - 9, y - 6), 4)\n        pygame.draw.circle(screen, (0, 0, 0), (x + 9, y - 6), 4)\n        pygame.draw.circle(screen, (255, 150, 150), (x, y + 6), 6)" : "    x, y = holes[mole]\n    pygame.draw.circle(screen, MOLE, (x, y), 26)\n    pygame.draw.circle(screen, (0, 0, 0), (x - 9, y - 6), 4)\n    pygame.draw.circle(screen, (0, 0, 0), (x + 9, y - 6), 4)\n    pygame.draw.circle(screen, (255, 150, 150), (x, y + 6), 6)"));
    if (o.click) { s.push(""); s.push(o.clock ? "    text = font.render(\"Score: \" + str(score) + \"   Time: \" + str(max(0, time_left)), True, (255, 255, 255))" : "    text = font.render(\"Score: \" + str(score), True, (255, 255, 255))"); s.push("    screen.blit(text, (10, 10))"); }
    if (o.clock) {
      s.push("", "    if not playing:", "        over = big_font.render(\"Time's up!\", True, (255, 255, 255))", "        screen.blit(over, over.get_rect(center=(240, 130)))", "        final = font.render(\"You hit \" + str(score) + \" moles\", True, (255, 255, 255))", "        screen.blit(final, final.get_rect(center=(240, 175)))");
      if (o.restart) s.push("        best = font.render(\"Best: \" + str(high_score) + \"   Press SPACE to play again\", True, (255, 255, 255))", "        screen.blit(best, best.get_rect(center=(240, 215)))");
    }
    s.push("", "    pygame.display.flip()", "    clock.tick(60)", "    await asyncio.sleep(0)", "", "pygame.quit()", "");
    return s.join("\n");
  }

  var C1 = [
    "import asyncio\nimport random\nimport pygame\n\npygame.init()\nscreen = pygame.display.set_mode((480, 320))\npygame.display.set_caption(\"Whack-a-Mole\")\nclock = pygame.time.Clock()\n\nGRASS = (70, 150, 70)\nHOLE = (60, 40, 20)\n\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    screen.fill(GRASS)\n\n    pygame.display.flip()\n    clock.tick(60)\n    await asyncio.sleep(0)\n\npygame.quit()\n",
    "import asyncio\nimport random\nimport pygame\n\npygame.init()\nscreen = pygame.display.set_mode((480, 320))\npygame.display.set_caption(\"Whack-a-Mole\")\nclock = pygame.time.Clock()\n\nGRASS = (70, 150, 70)\nHOLE = (60, 40, 20)\n\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    screen.fill(GRASS)\n    for row in range(3):\n        for col in range(3):\n            x = 120 + col * 120\n            y = 90 + row * 80\n            pygame.draw.circle(screen, HOLE, (x, y), 32)\n\n    pygame.display.flip()\n    clock.tick(60)\n    await asyncio.sleep(0)\n\npygame.quit()\n",
    "import asyncio\nimport random\nimport pygame\n\npygame.init()\nscreen = pygame.display.set_mode((480, 320))\npygame.display.set_caption(\"Whack-a-Mole\")\nclock = pygame.time.Clock()\n\nGRASS = (70, 150, 70)\nHOLE = (60, 40, 20)\n\nholes = []\nfor row in range(3):\n    for col in range(3):\n        holes.append((120 + col * 120, 90 + row * 80))\n\nrunning = True\nwhile running:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            running = False\n\n    screen.fill(GRASS)\n    for hole in holes:\n        pygame.draw.circle(screen, HOLE, hole, 32)\n\n    pygame.display.flip()\n    clock.tick(60)\n    await asyncio.sleep(0)\n\npygame.quit()\n",
    wm({})
  ];
  P.add({
    num: 11, title: "Whack-a-Mole 1: The Board",
    intro: ["Next game: **Whack-a-Mole**. Moles pop up from a 3 by 3 grid of holes and you click them with the **mouse** before they hide.",
      "In this first walkthrough you build the board: nine holes laid out by **loops inside loops**, a **list** that remembers where each hole is, and a mole that pops up in a random one."],
    learn: ["nested for loops with range()", "a list of (x, y) tuples", "indexing a list", "unpacking x, y = ...", "building a face from shapes"],
    firstTips: ["loop", "lists"],
    stages: [
      { title: "Set up the field", say: ["Type the game loop. This time we will fill the screen with grass green. Notice that `import random` is at the top. We will need it later in this walkthrough.", "Give the colors names at the top, like you did in Walkthrough 3."], help: ["loop", "colors"], code: C1[0],
        type: "Type the whole program. Fill the screen with `GRASS` inside the loop.", chk: [["import random", /^import random\s*$/m], ["GRASS and HOLE colors", /GRASS\s*=\s*\([\s\S]*HOLE\s*=\s*\(/], ["the game loop", /while\s+running\s*:/], ["screen.fill(GRASS)", /screen\.fill\(\s*GRASS\s*\)/]],
        run: "A green field." },
      { title: "Draw nine holes with loops inside loops", say: ["We want a 3 by 3 grid. **`for row in range(3):`** repeats its body 3 times with `row` being `0`, `1`, `2`. Putting a second `for col in range(3):` **inside** it makes the inner loop run 3 times for **every** row, so 9 times in total.", "Compute each hole's spot: `x = 120 + col * 120` gives `120, 240, 360`. `y = 90 + row * 80` gives `90, 170, 250`.", "Draw it **inside the game loop**, after `screen.fill`."], help: ["draw", "coords"], code: C1[1],
        type: "Type the two `for` loops, the two position lines and the `pygame.draw.circle` line, after `screen.fill(GRASS)`. Be careful with the indentation: each loop is pushed in one more level.", chk: [["for row in range(3):", /for\s+row\s+in\s+range\(\s*3\s*\)\s*:/], ["for col in range(3):", /for\s+col\s+in\s+range\(\s*3\s*\)\s*:/], ["pygame.draw.circle(screen, HOLE, ...)", /pygame\.draw\.circle\(\s*screen\s*,\s*HOLE\s*,/]],
        run: "Nine dark holes in a 3 by 3 grid." },
      { title: "Remember the holes in a list", say: ["Right now we re-do the math 60 times a second. A better idea is to work out the positions **once** and save them in a list.", "Make an empty list `holes` above the game loop. Use the same two loops to `.append` a **tuple** `(x, y)` for each hole. Then, in the game loop, `for hole in holes:` draws one circle for each saved position.", "The two loops now run **once**, above the game loop. The drawing loop is inside the game loop."], help: ["lists"], code: C1[2],
        type: "Move the two `for` loops above the game loop and change what's inside to `holes.append(...)`. Replace the drawing code with the short `for hole in holes:` loop.", chk: [["holes = []", /holes\s*=\s*\[\s*\]/], ["holes.append((x, y))", /holes\.append\(\s*\(/], ["for hole in holes:", /for\s+hole\s+in\s+holes\s*:/], ["pygame.draw.circle(screen, HOLE, hole, ...)", /pygame\.draw\.circle\(\s*screen\s*,\s*HOLE\s*,\s*hole\s*,/]],
        run: "The same nine holes, but now the positions live in a list we can use for the mole." },
      { title: "Pop up a mole", say: ["The mole picks a random hole: `mole = random.randint(0, 8)` is a number from 0 to 8, because there are 9 holes and lists start at 0.", "`holes[mole]` is that hole's `(x, y)`. Writing `x, y = holes[mole]` splits the pair into two variables.", "Build a face out of circles: a brown body, two black eyes, and a pink nose, using offsets from `x, y`."], help: ["randomtips", "lists"], code: C1[3],
        type: "Add the `MOLE` color and `mole = random.randint(0, 8)` above the loop. Type the mole drawing code after the holes.", chk: [["MOLE color", /MOLE\s*=\s*\(/], ["mole = random.randint(0, 8)", /mole\s*=\s*random\.randint\(\s*0\s*,\s*8\s*\)/], ["x, y = holes[mole]", /x\s*,\s*y\s*=\s*holes\[\s*mole\s*\]/], ["draw the mole body", /pygame\.draw\.circle\(\s*screen\s*,\s*MOLE\s*,/]],
        run: "A mole with a pink nose peeks out of one hole. Run it again and it picks a different hole." }
    ],
    finish: ["Run it five times. Does the mole appear in different holes?", "Change `range(3)` to `range(4)` in both loops. What happens? (Why does the grid go off the screen?) Change it back."],
    challenges: ["Make it a 4 by 4 grid by changing the loops and the spacing numbers. Use `randint(0, 15)`. What do you need to change so the mole still picks a valid hole?", "Give the mole ears (two small circles on top).", "Make a **different mole color** each time using `random.randint` for each of red, green and blue.", "Draw a small mound of dirt (an ellipse) in front of each hole."],
    recap: "A `for` loop inside a `for` loop makes a grid. A list of `(x, y)` tuples remembers positions. A list index like `holes[mole]` picks one of them, and `x, y = holes[mole]` unpacks the pair.",
    next: "**Next:** in Walkthrough 12 you will **click** the mole with the mouse, add a **timer**, and keep **score**."
  });

  var D = [
    wm({}),
    wm({ click: 1 }),
    wm({ click: 1, timer: 1 }),
    wm({ click: 1, timer: 1, clock: 1 }),
    wm({ click: 1, timer: 1, clock: 1, restart: 1 })
  ];
  P.add({
    num: 12, title: "Whack-a-Mole 2: Clicks, Timer and Score",
    intro: ["Now make it a real game. You will whack the mole with a **mouse click**, keep **score**, make the mole **hide and pop up** on a timer, and give the player **30 seconds** to score as many hits as they can.",
      "You will also keep a **high score** and let the player play again by pressing the space bar."],
    learn: ["MOUSEBUTTONDOWN and event.pos", "collidepoint", "pygame.time.get_ticks() timers", "a playing / not playing flag", "keeping a high score across rounds"],
    firstTips: ["events", "clocktime"],
    stages: [
      { title: "Bring your board with you", say: ["Copy your finished program from **Walkthrough 11** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring11"], code: D[0], bring: true,
        type: "Paste your finished Walkthrough 11 code into this code box.", chk: [["the holes list", /holes\s*=\s*\[\s*\]/], ["the mole", /mole\s*=\s*random\.randint\(\s*0\s*,\s*8\s*\)/], ["x, y = holes[mole]", /x\s*,\s*y\s*=\s*holes\[\s*mole\s*\]/]],
        run: "Nine holes and one mole." },
      { title: "Whack the mole", say: ["`pygame.MOUSEBUTTONDOWN` is the event for a mouse click, and **`event.pos`** is where the click happened.", "To know if the click hit the mole, make a `Rect` around the mole, center it on the mole's hole, and ask `collidepoint(event.pos)`.", "A hit adds 1 to `score` and moves the mole to a **new** random hole. Show the score at the top left."], help: ["events", "collide", "fonts"], code: D[1],
        type: "Add `font` and `score = 0`. Type the `MOUSEBUTTONDOWN` block inside the `for event` loop. Type the score text at the end of the drawing.", chk: [["font = pygame.font.Font(...)", /font\s*=\s*pygame\.font\.Font\(/], ["score = 0", /score\s*=\s*0/], ["if event.type == pygame.MOUSEBUTTONDOWN", /event\.type\s*==\s*pygame\.MOUSEBUTTONDOWN/], ["mole_rect.collidepoint(event.pos)", /mole_rect\.collidepoint\(\s*event\.pos\s*\)/], ["score += 1", /score\s*\+=\s*1/], ["the score text", /font\.render\(\s*["']Score: ["']/]],
        run: "Click the mole. The score goes up and the mole jumps to a new hole. Click empty ground and nothing happens." },
      { title: "Make the mole hide", say: ["A mole who stays put forever is no challenge. We want it to move every 0.9 seconds even if you don't click it.", "`pygame.time.get_ticks()` is the number of **milliseconds** since the game started. Save the time when the mole appeared in `mole_time`. If more than 900 ms have passed (`now - mole_time > 900`), pick a new hole and save the new time.", "Also set `mole_time = now` when you hit it, so the new mole gets a full 0.9 seconds."], help: ["clocktime"], code: D[2],
        type: "Add `mole_time = ...` above the loop. Add `now = ...` as the first line in the loop. Type the `if now - mole_time > 900:` block after the events. Add `mole_time = now` inside the hit block.", chk: [["mole_time = pygame.time.get_ticks()", /mole_time\s*=\s*pygame\.time\.get_ticks\(\)/], ["now = pygame.time.get_ticks()", /now\s*=\s*pygame\.time\.get_ticks\(\)/], ["if now - mole_time > 900:", /if\s+now\s*-\s*mole_time\s*>\s*900\s*:/], ["mole_time = now (twice)", /mole_time\s*=\s*now/, 2]],
        run: "The mole hops around by itself. Now you have to be quick." },
      { title: "A 30 second game", say: ["`game_start` remembers when the round began. `time_left = 30 - (now - game_start) // 1000` is the number of seconds left (milliseconds divided by 1000).", "A variable `playing` is `True` while the round is on. When `time_left` reaches 0, set `playing = False`.", "When the game isn't being played: clicks must do nothing, the mole should be hidden, the update code must stop, and we show **Time's up!** and the final score.", "This step changes a lot of lines. Take it one green block at a time."], help: ["states", "clocktime"], code: D[3], reindent: true,
        type: "Add `big_font`, `game_start` and `playing` above the loop. Add `and playing` to the click check. Put the mole timer inside `if playing:`, then add the time_left lines, the `Time's up!` block, and the `if playing:` around the mole drawing.", chk: [["game_start = pygame.time.get_ticks()", /game_start\s*=\s*pygame\.time\.get_ticks\(\)/], ["playing = True", /playing\s*=\s*True/], ["time_left = 30 - (now - game_start) // 1000", /time_left\s*=\s*30\s*-\s*\(\s*now\s*-\s*game_start\s*\)\s*\/\/\s*1000/], ["playing = False when time is up", /playing\s*=\s*False/], ["Time's up! message", /Time's up!/]],
        run: "Play for 30 seconds. The timer counts down, and then the screen says **Time's up!** with your score." },
      { title: "Play again, and beat your high score", say: ["Make a `high_score` variable that **outlives each round**. When time is up, if `score > high_score`, save it.", "To restart, listen for a `KEYDOWN` when `not playing`. Reset `score`, `game_start`, `mole_time`, and set `playing = True`. Do **not** reset `high_score`. That is the whole point.", "Add a line to the end screen telling the player what to press."], help: ["events", "states"], code: D[4],
        type: "Add `high_score = 0` above the loop. Type the `KEYDOWN` restart block in the events. Add the `if score > high_score:` lines in the time-is-up block. Add the `Best:` text.", chk: [["high_score = 0", /high_score\s*=\s*0/], ["if score > high_score:", /if\s+score\s*>\s*high_score\s*:/], ["high_score = score", /high_score\s*=\s*score/], ["restart on SPACE when not playing", /event\.type\s*==\s*pygame\.KEYDOWN\s+and\s+not\s+playing/], ["the Best: message", /Best: /]],
        run: "Finish a round, press **SPACE**, and play again. Your **Best** score stays until you stop the game." }
    ],
    finish: ["Play three rounds. Did your high score go up?", "Ask a friend to play. Who has the higher score?"],
    challenges: ["Make the game **harder** as the round goes on: shorten the 900 ms delay as the time runs down.", "Add a **miss penalty**: if a click does not hit the mole, subtract 1 from the score (but never below 0).", "Add a second kind of mole that is worth 5 points but only stays for half a second.", "Show a small flash (an extra circle) where you clicked, using `event.pos`."],
    tips: { bring11: { title: "I did not finish Walkthrough 11", sections: [
      { p: "Type your Walkthrough 11 program. This is what it should look like:" },
      { ex: C1[3].replace(/\n+$/, "").split("\n") }
    ] } },
    recap: "`MOUSEBUTTONDOWN` with `event.pos` and `collidepoint` handle clicks. `pygame.time.get_ticks()` gives milliseconds for timers. A `playing` flag switches between the game and the end screen. A variable that you don't reset keeps a high score.",
    next: "**Next game:** **Pong**, two paddles and a bouncing ball."
  });
})(typeof window !== "undefined" ? window : globalThis);
