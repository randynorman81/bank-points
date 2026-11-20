/* APPENDIX A, PART 4: organizing a bigger game, and your own game project (walkthroughs 21 to 25). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  function bring(n, code) { return { title: "I did not finish Walkthrough " + n, sections: [{ p: "Type your Walkthrough " + n + " program. This is what it should look like:" }, { ex: code.replace(/\n+$/, "").split("\n") }] }; }

  /* ================================================================= STAR CATCHER: states and functions ================ */
  /* o.stars / o.play / o.over / o.pause     o.fn: 0 none, 1 draw_text, 2 + new_star, 3 + reset_game, 4 + move_basket, 5 + fall_speed */
  function sc(o) {
    var fn = o.fn || 0, s = [], L = [];
    function text(v, t, size, fontv, color, center, ind) {
      if (fn >= 1) return [ind + "draw_text(" + t + ", " + size + ", " + color + ", " + center + ")"];
      return [ind + v + " = " + fontv + ".render(" + t + ", True, " + color + ")", ind + "screen.blit(" + v + ", " + v + ".get_rect(center=" + center + "))"];
    }
    s.push("import asyncio"); if (o.stars) s.push("import random");
    s.push("import pygame", "", "pygame.init()", "screen = pygame.display.set_mode((480, 320))", "pygame.display.set_caption(\"Star Catcher\")", "clock = pygame.time.Clock()");
    if (fn === 0) s.push("font = pygame.font.Font(None, 32)", "big_font = pygame.font.Font(None, 64)");
    if (fn >= 1) s.push("", "def draw_text(text, size, color, center):", "    font = pygame.font.Font(None, size)", "    image = font.render(text, True, color)", "    screen.blit(image, image.get_rect(center=center))");
    if (fn >= 2) s.push("", "def new_star():", "    return pygame.Rect(random.randint(0, 456), -24, 24, 24)");
    if (fn >= 3) s.push("", "def reset_game():", "    return [], 0, 3");
    if (fn >= 4) s.push("", "def move_basket(basket, keys, speed):", "    if keys[pygame.K_LEFT] or keys[pygame.K_a]:", "        basket.x -= speed", "    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:", "        basket.x += speed", "    basket.clamp_ip(screen.get_rect())");
    if (fn >= 5) s.push("", "def fall_speed(score):", "    if score >= 30:", "        return 6", "    elif score >= 15:", "        return 5", "    elif score >= 5:", "        return 4", "    return 3");
    s.push("");
    if (o.play) s.push("basket = pygame.Rect(200, 285, 80, 20)");
    if (o.stars) { if (fn >= 3) s.push("stars, score, lives = reset_game()"); else s.push("stars = []", "score = 0", "lives = 3"); s.push("spawn_timer = 0"); }
    if (o.over) s.push("best = 0");
    s.push("state = \"menu\"", "", "running = True", "while running:", "    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False", "        if event.type == pygame.KEYDOWN:");
    s.push("            if event.key == pygame.K_SPACE and state " + (o.over ? "in (\"menu\", \"gameover\")" : "== \"menu\"") + ":");
    if (o.stars) { if (fn >= 3) s.push("                stars, score, lives = reset_game()"); else s.push("                stars = []", "                score = 0", "                lives = 3"); s.push("                spawn_timer = 0"); }
    s.push("                state = \"playing\"");
    if (o.pause) s.push("            if event.key == pygame.K_p:", "                if state == \"playing\":", "                    state = \"paused\"", "                elif state == \"paused\":", "                    state = \"playing\"");
    s.push("");
    if (o.play || o.stars) {
      s.push("    if state == \"playing\":");
      if (o.play) { if (fn >= 4) s.push("        move_basket(basket, pygame.key.get_pressed(), 6)"); else s.push("        keys = pygame.key.get_pressed()", "        if keys[pygame.K_LEFT] or keys[pygame.K_a]:", "            basket.x -= 6", "        if keys[pygame.K_RIGHT] or keys[pygame.K_d]:", "            basket.x += 6", "        basket.clamp_ip(screen.get_rect())"); }
      if (o.stars) {
        s.push("", "        spawn_timer += 1", "        if spawn_timer >= 40:", "            spawn_timer = 0", "            stars.append(" + (fn >= 2 ? "new_star()" : "pygame.Rect(random.randint(0, 456), -24, 24, 24)") + ")", "", "        for star in stars[:]:", "            star.y += " + (fn >= 5 ? "fall_speed(score)" : "3"), "            if star.colliderect(basket):", "                stars.remove(star)", "                score += 1", "            elif star.top > 320:", "                stars.remove(star)", "                lives -= 1");
        if (o.over) s.push("", "        if lives <= 0:", "            state = \"gameover\"", "            if score > best:", "                best = score");
      }
      s.push("");
    }
    s.push("    screen.fill((15, 15, 50))", "    if state == \"menu\":");
    s = s.concat(text("title", "\"STAR CATCHER\"", 64, "big_font", "(255, 230, 80)", "(240, 110)", "        "));
    s = s.concat(text("prompt", "\"Press SPACE to start\"", 32, "font", "(255, 255, 255)", "(240, 190)", "        "));
    s.push("    else:");
    if (!o.play) s = s.concat(text("msg", "\"Playing...\"", 32, "font", "(255, 255, 255)", "(240, 160)", "        "));
    if (o.play) s.push("        pygame.draw.rect(screen, (230, 170, 60), basket)");
    if (o.stars) {
      s.push("        for star in stars:", "            pygame.draw.circle(screen, (255, 230, 80), star.center, 12)");
      s = s.concat(text("hud", "\"Score: \" + str(score) + \"   Lives: \" + str(lives)", 32, "font", "(255, 255, 255)", "(100, 18)", "        "));
    }
    if (o.pause) { s.push("        if state == \"paused\":"); s = s.concat(text("paused", "\"PAUSED\"", 64, "big_font", "(255, 255, 255)", "(240, 140)", "            ")); }
    if (o.over) {
      s.push("        if state == \"gameover\":");
      s = s.concat(text("over", "\"GAME OVER\"", 64, "big_font", "(255, 80, 80)", "(240, 110)", "            "));
      s = s.concat(text("result", "\"Score: \" + str(score) + \"   Best: \" + str(best)", 32, "font", "(255, 255, 255)", "(240, 165)", "            "));
      s = s.concat(text("again", "\"Press SPACE to play again\"", 32, "font", "(255, 255, 255)", "(240, 205)", "            "));
    }
    s.push("", "    pygame.display.flip()", "    clock.tick(60)", "    await asyncio.sleep(0)", "", "pygame.quit()", "");
    return s.join("\n");
  }

  var ST = [sc({}), sc({ play: 1 }), sc({ play: 1, stars: 1 }), sc({ play: 1, stars: 1, over: 1 }), sc({ play: 1, stars: 1, over: 1, pause: 1 })];
  P.add({
    num: 21, title: "Game States: Menus and Pausing",
    intro: ["Every game you've built so far starts the moment you press Run, and ends in a fixed way. Real games have **screens**: a title **menu**, the **game** itself, a **pause** screen, and **Game Over**. Each of these is a **state**.",
      "In this walkthrough you build **Star Catcher**, a small game where you catch falling stars in a basket, using a variable called `state` that decides which screen the game is in."],
    learn: ["game states as strings: \"menu\", \"playing\", \"paused\", \"gameover\"", "if / elif / else to choose what runs in each state", "in with a tuple of values", "keeping one high score across rounds", "pause and resume"],
    firstTips: ["states"],
    stages: [
      { title: "The menu state", say: ["Make a variable `state` that starts as `\"menu\"`. It is just text, but it controls the whole game.", "In the drawing code, `if state == \"menu\":` shows the title and \"Press SPACE to start\". `else:` shows everything else (for now, a placeholder).", "Pressing **space** while in the menu changes `state` to `\"playing\"`."], help: ["states", "fonts", "loop"], code: ST[0],
        type: "Type the whole program. Draw the title and the prompt in the `menu` branch. In the `else`, draw `Playing...`.", chk: [["state = \"menu\"", /state\s*=\s*"menu"/], ["space starts the game", /event\.key\s*==\s*pygame\.K_SPACE\s+and\s+state\s*(==\s*"menu"|in\s*\([^)]*\))\s*:[\s\S]*?state\s*=\s*"playing"/], ["a menu branch and an else branch", /if\s+state\s*==\s*"menu"\s*:[\s\S]*\n\s+else\s*:/], ["the title is drawn", /STAR CATCHER/]],
        run: "You see the title. Press **space** and it changes to `Playing...`." },
      { title: "The playing state: a basket", say: ["Everything that only happens **while playing** goes under `if state == \"playing\":`. That way the basket can't move while you're on the menu.", "Make the basket (80 by 20) and move it with the arrow keys or A and D. This is the same movement code from before."], help: ["held", "rectobj"], code: ST[1],
        type: "Add the `basket` Rect. Type the `if state == \"playing\":` block with the movement code. Draw the basket in the `else`, replacing the placeholder.", chk: [["a basket Rect", /basket\s*=\s*pygame\.Rect\(/], ["if state == \"playing\":", /if\s+state\s*==\s*"playing"\s*:/], ["the basket moves", /basket\.x\s*-=\s*6[\s\S]*basket\.x\s*\+=\s*6/], ["the basket is drawn", /pygame\.draw\.rect\(\s*screen\s*,[^\n]*,\s*basket\s*\)/]],
        run: "Press **space**, then move the basket with the arrow keys. On the menu screen the keys do nothing." },
      { title: "Falling stars, score and lives", say: ["This is the same pattern as Meteor Dodge: a list of stars, a spawn timer, and a loop over a copy.", "Catching a star (`star.colliderect(basket)`) adds a point. If a star falls past the bottom, you lose a life. `elif` makes sure a star can't do both.", "Pressing space starts a **fresh** game, so reset `stars`, `score`, `lives` and `spawn_timer` there as well."], help: ["lists", "removebug", "collide", "randomtips"], code: ST[2],
        type: "Add `import random`. Add `stars`, `score`, `lives` and `spawn_timer` to the setup, and reset them when space is pressed. Type the spawn and star-loop code. Draw the stars and the score.", chk: [["import random", /^import random\s*$/m], ["stars, score, lives and spawn_timer", /stars\s*=\s*\[\s*\][\s\S]*score\s*=\s*0[\s\S]*lives\s*=\s*3[\s\S]*spawn_timer\s*=\s*0/], ["for star in stars[:]:", /for\s+star\s+in\s+stars\[\s*:\s*\]\s*:/], ["catching adds a point", /if\s+star\.colliderect\(\s*basket\s*\)\s*:\s*\n\s+stars\.remove\(\s*star\s*\)\s*\n\s+score\s*\+=\s*1/], ["missing costs a life", /elif\s+star\.top\s*>\s*320\s*:\s*\n\s+stars\.remove\(\s*star\s*\)\s*\n\s+lives\s*-=\s*1/]],
        run: "Catch the falling stars. Lose three and... nothing happens yet. The game just keeps going with negative lives." },
      { title: "The game over state", say: ["When `lives` reaches 0, change the state to `\"gameover\"`. Because everything in `if state == \"playing\":` stops running, the game freezes automatically.", "Remember the best score: if `score > best`, save it. `best` lives **outside** the reset so it survives restarts.", "Space now works in **two** states, the menu and game over. `state in (\"menu\", \"gameover\")` is a short way to say \"state is either of these\"."], help: ["states"], code: ST[3],
        type: "Add `best = 0`. Change the space check to use `in (\"menu\", \"gameover\")`. Type the `if lives <= 0:` block. Type the `gameover` drawing block.", chk: [["best = 0", /best\s*=\s*0/], ["space in menu or gameover", /pygame\.K_SPACE\s+and\s+state\s+in\s+\(\s*"menu"\s*,\s*"gameover"\s*\)/], ["lives running out ends the game", /if\s+lives\s*<=\s*0\s*:\s*\n\s+state\s*=\s*"gameover"/], ["saving a new best", /if\s+score\s*>\s*best\s*:\s*\n\s+best\s*=\s*score/], ["the game over screen", /if\s+state\s*==\s*"gameover"\s*:/]],
        run: "Lose all three lives. The game shows **GAME OVER** with your score and best. Press **space** to play again." },
      { title: "Pause with P", say: ["A pause is just one more state: `\"paused\"`. Pressing **P** flips between `\"playing\"` and `\"paused\"`.", "Nothing needs to be frozen specially. The update code only runs `if state == \"playing\":`, so it stops by itself. The draw code still runs, so you still see the game."], code: ST[4],
        type: "Type the `if event.key == pygame.K_p:` block in the events. Type the `paused` drawing block.", chk: [["pausing and resuming with P", /event\.key\s*==\s*pygame\.K_p\s*:\s*\n\s+if\s+state\s*==\s*"playing"\s*:\s*\n\s+state\s*=\s*"paused"\s*\n\s+elif\s+state\s*==\s*"paused"\s*:\s*\n\s+state\s*=\s*"playing"/], ["the PAUSED text", /if\s+state\s*==\s*"paused"\s*:/]],
        run: "While playing, press **P**. Everything freezes and shows **PAUSED**. Press **P** again to continue." }
    ],
    finish: ["Play three rounds. Does **Best** go up and stay up?", "Pause in the middle of a round. Does the star you're about to catch wait for you?"],
    challenges: ["Add a **level select** state: the menu has three choices (easy, medium, hard) that change the fall speed.", "Add a **\"how to play\"** state shown when you press **H** on the menu.", "Make a new state called `\"countdown\"` that shows 3, 2, 1 before a round begins.", "Draw a different background color for each state."],
    recap: "A **state** variable decides what the game does. `if / elif / else` on the state picks what to update and what to draw. Restarting means resetting variables, and a variable you leave alone (like `best`) remembers across rounds.",
    next: "**Next:** your Star Catcher code is getting long and repetitive. In Walkthrough 22 you learn to clean it up with **functions**."
  });

  var FN = [sc({ play: 1, stars: 1, over: 1, pause: 1 }), sc({ play: 1, stars: 1, over: 1, pause: 1, fn: 1 }), sc({ play: 1, stars: 1, over: 1, pause: 1, fn: 2 }), sc({ play: 1, stars: 1, over: 1, pause: 1, fn: 3 }), sc({ play: 1, stars: 1, over: 1, pause: 1, fn: 4 }), sc({ play: 1, stars: 1, over: 1, pause: 1, fn: 5 })];
  P.add({
    num: 22, title: "Functions: Clean Up Your Game",
    intro: ["Look at your Star Catcher code. The same three lines (make a font, render the text, blit it centered) appear **seven times**. When code repeats, we use a **function**: a named block of code you can run whenever you want.",
      "A function can take **parameters** (inputs) and **return** a result (an output). You will add five functions to Star Catcher. The game will look and play **exactly the same**, but the code will be shorter and easier to change. This is what programmers call **refactoring**.",
      "Writing your own functions with parameters is one of the things the AP Create Task asks for, so this walkthrough is a big deal."],
    learn: ["def", "parameters", "calling a function", "return", "returning more than one value", "selection inside a function"],
    firstTips: ["funcs", "apmap"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 21** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V). Run it to make sure it still works."], help: ["bring21"], code: FN[0], bring: true,
        type: "Paste your finished Walkthrough 21 code into this code box.", chk: [["the state variable", /state\s*=\s*"menu"/], ["the star loop", /for\s+star\s+in\s+stars\[\s*:\s*\]/], ["the pause", /"paused"/]],
        run: "Star Catcher works." },
      { title: "A function with parameters: draw_text", say: ["Here is the repeated code: make a font, render, blit centered. It changes in four ways: the **words**, the **size**, the **color** and the **center**. Those four things become the function's **parameters**.", "Put the `def` **above** the game loop. Then replace each group of three lines with one call, like `draw_text(\"STAR CATCHER\", 64, (255, 230, 80), (240, 110))`.", "You can now **delete** the `font` and `big_font` lines. The function makes its own font each time.", "This step changes many lines. Do the `def` first, then fix one text at a time and run it often."], help: ["funcs"], code: FN[1],
        type: "Delete the `font` and `big_font` lines. Add the `def draw_text(...)` above the loop. Replace every `render` / `blit` pair with a `draw_text(...)` call.", chk: [["def draw_text(text, size, color, center):", /^def\s+draw_text\(\s*text\s*,\s*size\s*,\s*color\s*,\s*center\s*\)\s*:/m], ["the function draws text", /def\s+draw_text[\s\S]*screen\.blit\(/], ["calling draw_text many times", /draw_text\(\s*"[^"]*"/, 6]],
        run: "Exactly the same game. But look how much shorter the drawing code is." },
      { title: "A function that returns a value: new_star", say: ["A function can **return** a value. `new_star()` has no parameters, but it **returns a new Rect** at a random position. `return` hands the value back to whoever called it.", "Use it by calling it where you used to build the Rect: `stars.append(new_star())`."], help: ["funcs", "randomtips"], code: FN[2],
        type: "Add `def new_star():` above the loop. In the spawn code, change the `.append(...)` to use `new_star()`.", chk: [["def new_star():", /^def\s+new_star\(\s*\)\s*:/m], ["new_star returns a Rect", /def\s+new_star\(\s*\)\s*:\s*\n\s+return\s+pygame\.Rect\(/], ["stars.append(new_star())", /stars\.append\(\s*new_star\(\)\s*\)/]],
        run: "The game plays the same." },
      { title: "Returning more than one value: reset_game", say: ["Restarting resets three variables: `stars`, `score` and `lives`. A function can **return several values** at once, separated by commas.", "`stars, score, lives = reset_game()` receives all three. Use it in both places that reset the game: once at the start, and once when space is pressed."], help: ["funcs"], code: FN[3],
        type: "Add `def reset_game():` above the loop. Replace the three lines that make `stars`, `score` and `lives` (in both places) with the single line.", chk: [["def reset_game():", /^def\s+reset_game\(\s*\)\s*:/m], ["returning three values", /return\s+\[\s*\]\s*,\s*0\s*,\s*3/], ["stars, score, lives = reset_game() twice", /stars\s*,\s*score\s*,\s*lives\s*=\s*reset_game\(\)/, 2]],
        run: "Lose and press space. The game restarts with fresh values, like before." },
      { title: "A function that changes an object: move_basket", say: ["Functions can take any value as a parameter, including a Rect. `move_basket(basket, keys, speed)` moves the Rect you give it. Because a Rect can be changed in place, the basket on the screen moves.", "Pass `pygame.key.get_pressed()` as the `keys` parameter, and `6` as the `speed`."], help: ["funcs", "held"], code: FN[4],
        type: "Add `def move_basket(basket, keys, speed):` above the loop and move the five lines of movement code into it. In the playing block, replace those lines with one call.", chk: [["def move_basket(basket, keys, speed):", /^def\s+move_basket\(\s*basket\s*,\s*keys\s*,\s*speed\s*\)\s*:/m], ["the function uses its parameters", /def\s+move_basket[\s\S]*basket\.x\s*-=\s*speed[\s\S]*basket\.clamp_ip/], ["calling it with three values", /move_basket\(\s*basket\s*,\s*pygame\.key\.get_pressed\(\)\s*,\s*6\s*\)/]],
        run: "The basket still moves. The playing block is now short and clear." },
      { title: "Selection inside a function: fall_speed", say: ["Let the game get harder: the more you score, the faster the stars fall. A function is a good place for the rule: `fall_speed(score)` takes the score and **returns** a speed.", "It uses `if / elif`. The function checks the biggest score first. Only one `return` runs.", "Use it for the star's speed: `star.y += fall_speed(score)`."], help: ["funcs", "apmap"], code: FN[5],
        type: "Add `def fall_speed(score):` above the loop. Change `star.y += 3` into `star.y += fall_speed(score)`.", chk: [["def fall_speed(score):", /^def\s+fall_speed\(\s*score\s*\)\s*:/m], ["selection inside the function", /def\s+fall_speed[\s\S]*if\s+score\s*>=\s*30\s*:[\s\S]*elif\s+score\s*>=\s*15\s*:[\s\S]*elif\s+score\s*>=\s*5\s*:/], ["star.y += fall_speed(score)", /star\.y\s*\+=\s*fall_speed\(\s*score\s*\)/]],
        run: "Catch 5 stars and the stars fall faster. Catch 15 and 30 for even faster. You wrote a rule once, in one place." }
    ],
    finish: ["Compare how long your program is now with Walkthrough 21.", "Change the star's size in `new_star()` from 24 to 40. How many places did you have to change it?"],
    challenges: ["Write a `draw_hud(score, lives)` function so the score line is in one place.", "Write a function `is_missed(star)` that returns `True` if the star is below the screen.", "Add a parameter to `new_star(size)` so you can make big and small stars.", "Make a function `random_color()` that returns a random `(r, g, b)` tuple, and use it for the stars."],
    tips: { bring21: bring(21, FN[0]) },
    recap: "A **function** names a chunk of code. **Parameters** are the inputs, and **return** gives back an output. Functions remove repeated code, so you only fix a bug or make a change in one place. A function can use `if` and loops inside.",
    next: "**You have the skills!** Next you design and build a game of your own: three walkthroughs, from **plan** to **polish**."
  });

  /* ================================================================= THE PROJECT ================ */
  var IDEAS = { title: "Game ideas (and where to start)", sections: [
    { p: "Pick a game you could finish in a few class periods. A **small** game that works beats a big game that doesn't. Each idea lists which walkthrough has the best starting pieces." },
    { rows: [["Breakout", "a paddle, a ball, and a grid of bricks (a list of Rects). Remove a brick when the ball hits it.", "Pong (13, 14)"], ["Frogger (lane dodger)", "cross lanes of cars that move at different speeds (a list of Rects for each lane).", "Meteor Dodge (8 to 10)"], ["Memory match", "a grid of cards. Click two. If they match, keep them.", "Whack-a-Mole (11, 12)"], ["Tic-tac-toe", "click a 3 by 3 grid. Alternate X and O. Check for three in a row.", "Whack-a-Mole (11, 12)"], ["Asteroids-lite", "a ship that turns and flies in a window that wraps around, shooting rocks.", "Space Shooter (17, 18)"], ["Runner / jumper", "a character that jumps over obstacles that scroll toward it.", "Flappy Bird (19, 20)"], ["Platformer-lite", "run and jump between platforms (Rects) with gravity.", "Flappy Bird + the Platform recipe"], ["Catch / collect", "collect good items and avoid bad ones in a time limit.", "Star Catcher (21, 22)"], ["Reaction tester", "wait a random time, then click as fast as you can. Show your time.", "Whack-a-Mole (get_ticks)"], ["Maze or collect-the-treasure", "walls are a list of Rects. The player can't walk through them.", "Treasure Hunt (7)"], ["Simon Says", "a pattern of colors (a list) that the player must repeat.", "Whack-a-Mole + lists"], ["Your own idea!", "Describe it to your teacher first. Make sure it needs a list, a function with a parameter, an if, and a loop.", "any"]] }
  ] };
  var RECIPES = { title: "How do I...? (code recipes)", sections: [
    { h: "Land on a platform (gravity + jumping)", p: "Keep a vertical speed `vy`. Gravity adds to it each frame. When the player's feet touch a platform from above, snap to the top and stop falling." },
    { ex: ["vy += 0.5", "player.y += vy", "on_ground = False", "for plat in platforms:", "    if player.colliderect(plat) and vy >= 0 and player.bottom <= plat.top + 12:", "        player.bottom = plat.top", "        vy = 0", "        on_ground = True", "", "# in the KEYDOWN events:", "if event.key == pygame.K_SPACE and on_ground:", "    vy = -11"] },
    { h: "Click on a grid cell", p: "Divide the click position by the cell size. Use `//` to throw away the remainder." },
    { ex: ["CELL = 100", "if event.type == pygame.MOUSEBUTTONDOWN:", "    col = event.pos[0] // CELL", "    row = event.pos[1] // CELL", "    board[row][col] = \"X\"           # board is a list of lists"] },
    { h: "A computer-controlled paddle (simple AI)", p: "Move a little toward the ball each frame." },
    { ex: ["if ball.centery < ai.centery:", "    ai.y -= 3", "elif ball.centery > ai.centery:", "    ai.y += 3"] },
    { h: "A grid of bricks", p: "Nested loops make the Rects. Keep them in one list, and remove a brick when it is hit." },
    { ex: ["bricks = []", "for row in range(4):", "    for col in range(8):", "        bricks.append(pygame.Rect(10 + col * 58, 40 + row * 24, 54, 20))"] },
    { h: "Things that wrap around the edges", p: "When something leaves one side, put it on the other. `%` does it in one line." },
    { ex: ["ship.x = ship.x % 480           # leaves the right, appears on the left", "if ship.right < 0:", "    ship.left = 480"] },
    { h: "Levels", p: "Keep data for each level in a list, and a `level` variable that is the index." },
    { ex: ["speeds = [3, 4, 6, 8]", "level = 0", "ball_speed = speeds[level]", "if score >= 10 and level < len(speeds) - 1:", "    level += 1"] },
    { h: "Simple animation (frames)", p: "Count frames and choose a picture from a list based on the count." },
    { ex: ["frame += 1", "step = (frame // 10) % 2           # 0, then 1, then 0, ...", "colors = [(255, 200, 0), (255, 120, 0)]", "pygame.draw.circle(screen, colors[step], player.center, 14)"] },
    { h: "Randomly choose between things", p: "`random.choice` picks from a list, and `random.randint(1, 100) < 20` is true about 20% of the time." },
    { ex: ["kind = random.choice([\"good\", \"bad\"])", "if random.randint(1, 100) < 20:", "    spawn_bonus()"] },
    { warn: "Sound and image files are not available in this editor. Make your game look great with shapes, colors and text." }
  ] };
  var PLAN_SKEL = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("My Game")
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((20, 20, 40))

    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`;
  P.add({
    num: 23, title: "Your Game 1: Plan It",
    intro: ["Now you design a game of **your own**. This is the project that shows everything you've learned. It is also great practice for the AP **Create Performance Task**, where you plan and build your own program.",
      "A big mistake programmers make is to start typing code without a plan. In this walkthrough you write a short **game plan** as comments at the top of your file and set up your starting code. You will **build** the game in Walkthrough 24 and **polish** it in Walkthrough 25."],
    learn: ["choosing a game that is the right size", "writing a plan as comments", "breaking a big job into milestones", "planning where the AP requirements will go"],
    firstTips: ["ideas", "apmap"],
    stages: [
      { title: "Pick your game", say: ["Open the **Game ideas** help below. Choose a game you can finish. Remember: **small and working** beats big and broken.", "Rules for the project: it must be **your own game** (not a copy of one you already built), it must run in this editor, and it needs a **list**, a **function with a parameter**, an **if**, and a **loop**."], help: ["ideas"],
        do: ["Read the **Game ideas** help and choose one (or your own).", "Tell a classmate or your teacher your idea in one sentence: \"My game is ______ where the player ______ to ______.\" Does it sound like something you can build in a few days?"] },
      { title: "Write the plan as comments", say: ["A **comment** starts with `#`. Python ignores it, but it is a great place for your plan. Type these labels at the very top of your file, and fill in each one with your own words. Keep each one to a sentence.", "Use this exact layout so the auto-check can read it:"],
        code: "# GAME: (the name of your game)\n# GOAL: (what the player is trying to do)\n# CONTROLS: (which keys or mouse actions)\n# OBJECTS: (what things are on the screen)\n# RULES: (what makes the score go up or down)\n# LOSE: (how the game ends)",
        type: "Type the six labels and fill each one in with **your** game.", chk: [["# GAME: with a name", /^#[ \t]*GAME:[ \t]*\S+/m, 1, "comments"], ["# GOAL: with text", /^#\s*GOAL:[ \t]*\S+/m, 1, "comments"], ["# CONTROLS: with text", /^#\s*CONTROLS:[ \t]*\S+/m, 1, "comments"], ["# OBJECTS: with text", /^#\s*OBJECTS:[ \t]*\S+/m, 1, "comments"], ["# RULES: with text", /^#\s*RULES:[ \t]*\S+/m, 1, "comments"], ["# LOSE: with text", /^#\s*LOSE:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Break it into milestones", say: ["A big game is built in small pieces that each **work** before you move on. Under your plan, write five milestones in the order you'll build them. A good order is: (1) window and loop, (2) the player moves, (3) one enemy, obstacle or target, (4) collisions and score, (5) game over and restart.", "Write **your** version for your game. Be specific."],
        code: "# MILESTONE 1: (window and game loop)\n# MILESTONE 2: (the player moves)\n# MILESTONE 3: (the first challenge appears)\n# MILESTONE 4: (hits, score, lives)\n# MILESTONE 5: (game over and restart)",
        type: "Type five milestone lines for your game.", chk: [["five # MILESTONE lines with text", /^#\s*MILESTONE\s*\d:[ \t]*\S+/m, 5, "comments"]] },
      { title: "Plan where the AP requirements go", say: ["Your project needs four things. Decide **now** where each one will be, so you don't forget. (Look at the **Create Task** help for what each means.)", "You can change your mind later. The point is to think about it before you start."], help: ["apmap"],
        code: "# LIST: (what will you store in a list?)\n# FUNCTION: (what will your function do? what parameter will it take?)\n# IF: (what decision will your game make?)\n# LOOP: (what will repeat?)",
        type: "Type the four lines and fill them in.", chk: [["# LIST: with text", /^#\s*LIST:[ \t]*\S+/m, 1, "comments"], ["# FUNCTION: with text", /^#\s*FUNCTION:[ \t]*\S+/m, 1, "comments"], ["# IF: with text", /^#\s*IF:[ \t]*\S+/m, 1, "comments"], ["# LOOP: with text", /^#\s*LOOP:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Set up your starting code", say: ["Under your comments, type the game loop skeleton. Change the window title to your game's name. Pick a background color that fits your game.", "Run it. A window with your color is **Milestone 1**. You will build everything else in the next walkthrough."], help: ["loop"], code: PLAN_SKEL,
        type: "Type the loop skeleton under your plan. Change `\"My Game\"` to your own game's name.", chk: [["the game loop", /while\s+running\s*:/], ["the QUIT check", /pygame\.QUIT/], ["flip, tick and sleep(0)", /flip\(\)[\s\S]*clock\.tick\(\s*60\s*\)[\s\S]*await\s+asyncio\.sleep\(\s*0\s*\)/]],
        run: "A window with your title and background color. You have finished **Milestone 1**." }
    ],
    check: false,
    finish: [],
    challenges: ["Sketch your game's screen on paper: where does the player start, where do enemies come from, and where does the score go?", "Show your plan to a classmate. Ask: \"Can you tell what my game is from just the comments?\"", "Cross out one thing from your plan that is too big. Can you save it for \"if I have time\"?"],
    tips: { ideas: IDEAS },
    recap: "A plan in comments tells you what to build and in what order. Milestones keep you from getting overwhelmed, because each one is small and testable.",
    next: "**Next:** in Walkthrough 24 you **build** your game, one milestone at a time."
  });

  P.add({
    num: 24, title: "Your Game 2: Build It",
    intro: ["This is the longest walkthrough. You build your game one milestone at a time, using your plan from Walkthrough 23.",
      "Open **Walkthrough 23**, copy your code (Ctrl + A, Ctrl + C), and paste it here (Ctrl + V). Then work down the steps. **Run your game after every milestone.** If it breaks, you only have a small amount of new code to look at."],
    learn: ["building a game in small working steps", "using what you already built as a starting point", "debugging your own code", "meeting the AP requirements: list, function with a parameter, if, loop"],
    firstTips: ["recipes", "debug", "apmap"],
    stages: [
      { title: "Bring your plan with you", say: ["Copy everything from **Walkthrough 23** and paste it here. Make sure your plan comments and the skeleton are there, and that it runs."],
        type: "Paste your Walkthrough 23 code into this code box.", chk: [["your plan comments", /^#\s*GAME:/m, 1, "comments"], ["the game loop", /while\s+running\s*:/], ["await asyncio.sleep(0)", /await\s+asyncio\.sleep\(\s*0\s*\)/]],
        run: "Your window opens with your color." },
      { title: "Milestone 2: the player", say: ["Make the thing the player controls. It is almost always a `Rect`. Draw it, and move it with the keyboard or the mouse.", "Look at Walkthroughs 6 to 8 if you need to."], help: ["held", "rectobj", "recipes"],
        chk: [["a player Rect (or position variables)", /^\s*(player|ship|bird|paddle|hero|basket|snake|\w+)\s*=\s*pygame\.Rect\(/m], ["keyboard or mouse input", /(get_pressed\(\)|MOUSEBUTTONDOWN|get_pos\(\)|KEYDOWN)/]],
        type: "Add your player: make it, move it, draw it.", run: "You can move your player." },
      { title: "Milestone 3: the first challenge", say: ["Add the thing the player has to deal with: enemies, obstacles, targets, or coins. If there will be **many**, this is where your **list** comes in: spawn them, move them, and remove them.", "Draw them, and make sure they move."], help: ["lists", "removebug", "randomtips", "recipes"],
        chk: [["a list", /^\s*\w+\s*=\s*\[/m], ["a loop over a list or a counter", /^\s*for\s+\w+\s+in\s+/m]],
        type: "Add your enemies, obstacles or targets (in a list if there are many).", run: "Things appear and move on the screen." },
      { title: "Milestone 4: hits, score and rules", say: ["Make the game **react**. Use `colliderect` or `collidepoint` to detect touching. Change a **score** or **lives** variable, and show it with text.", "This is where your **if** statements are. Make at least three."], help: ["collide", "fonts", "recipes"],
        chk: [["collision detection", /(colliderect|collidepoint|collidelist)/], ["a score or lives variable", /^\s*(score|lives|points|health)\w*\s*=\s*\d+/m], ["at least three if statements", /^\s*(if|elif)\s/m, 3], ["text on the screen", /\.render\(/]],
        type: "Add collisions, a score or lives, and show it on the screen.", run: "Something happens when the player touches things, and the score changes." },
      { title: "Milestone 5: game over and restart", say: ["A game needs an **end** and a way to **play again**. Use a `game_over` variable or a `state` variable (see Walkthrough 21).", "Don't forget to reset everything when the player restarts."], help: ["states", "recipes"],
        chk: [["a game over or state variable", /^\s*(game_over|state|playing|winner)\s*=/m], ["a restart key", /K_(r|SPACE|RETURN)/], ["GAME OVER or a similar message", /(GAME OVER|You win|YOU WIN|Game Over|Time's up|wins)/i]],
        type: "Add a game over screen and a key to restart.", run: "You can lose, see a message, and play again without pressing Run." },
      { title: "A function with a parameter", say: ["The AP Create Task needs a **function you wrote**, with **at least one parameter**, that is **called** in your program. A function also makes your game neater.", "Good choices: `draw_text(text, size, color, center)`, `make_enemy(speed)`, `reset_game(lives)`, `hit(a, b)`. Write it **above** your game loop, then use it.", "Look at Walkthrough 22 for examples."], help: ["funcs", "apmap"],
        chk: [["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["your function is called at least twice", function (text) { return P.userFnCalls(text); }, 2]],
        type: "Write a function that takes a parameter, and call it from your game.", run: "Your game still works, but is neater." },
      { title: "Comments that explain", say: ["Add comments **inside** your code to explain what each part does. A good comment says **why**, not just what. At least five comments, including one above your function that says what its parameter means."],
        chk: [["at least five comments", /^\s*#\s*\S+/m, 5, "comments"]],
        type: "Add at least five comments that explain your code.", run: "Run it again. Comments change nothing, which proves you typed them correctly." }
    ],
    check: false,
    finish: [],
    challenges: ["Ask a friend to play your game for two minutes **without telling them how**. Watch what they get stuck on. That is what to fix.", "Make the game a little harder or easier. Is the first minute fun?", "Add a title screen with the name of your game."],
    tips: { recipes: RECIPES, ideas: IDEAS },
    recap: "You built a game the way professionals do: a plan, then small working steps, testing each one. You used a **list**, a **function with a parameter**, **if** statements and a **loop**.",
    next: "**Next:** Walkthrough 25 is where you **test, fix, polish and reflect**."
  });

  P.add({
    num: 25, title: "Your Game 3: Test, Polish and Share",
    intro: ["A game isn't done when it first works. It's done when **other people can play it** and have fun. In this last walkthrough you **test** your game, **fix** bugs, **polish** it, and write a short **reflection**.",
      "Copy your finished code from **Walkthrough 24** and paste it here (Ctrl + A, Ctrl + C, then Ctrl + V). Then work down the steps."],
    learn: ["playtesting with other people", "finding and fixing bugs", "polish: what makes a game feel finished", "reflecting on what you built"],
    firstTips: ["debug", "recipes"],
    stages: [
      { title: "Bring your game with you", say: ["Paste your finished Walkthrough 24 code into this code box and run it."],
        type: "Paste your Walkthrough 24 code into this code box.", chk: [["the game loop", /while\s+running\s*:/], ["a function you wrote", /^def\s+\w+\(/m], ["a list", /^\s*\w+\s*=\s*\[/m]],
        run: "Your game runs." },
      { title: "Playtest it", say: ["Find **two people** (not you!). Ask them to play your game **without** your help. Do not explain it. Watch them, and write down what confuses them or what breaks.",
        "Things to look for: Did they know how to start? Did they know the controls? Did anything feel unfair? Did it ever crash?"],
        do: ["Have **two different people** play your game for at least a minute each.", "Write down **three** things that confused them, broke, or felt wrong. (Keep your notes. You will type them in a minute.)"] },
      { title: "Write your test notes as comments", say: ["Type your three findings as comments at the very **bottom** of your file, after `pygame.quit()`. Add one more line saying what you changed to fix each one.", "Use this layout:"],
        code: "# TEST 1: (what the player found)\n# FIX 1: (what you changed)\n# TEST 2: (what the player found)\n# FIX 2: (what you changed)\n# TEST 3: (what the player found)\n# FIX 3: (what you changed)",
        type: "Type the six lines at the bottom of your file and fill them in.", chk: [["three # TEST notes", /^#\s*TEST\s*\d:[ \t]*\S+/m, 3, "comments"], ["three # FIX notes", /^#\s*FIX\s*\d:[ \t]*\S+/m, 3, "comments"]] },
      { title: "Fix the three bugs", say: ["Now go and actually make each fix. Run your game after each one to make sure you fixed it and didn't break something else.", "If you can't fix one, write what you tried in the FIX comment."], help: ["debug"],
        do: ["Fix finding **1**. Run the game.", "Fix finding **2**. Run the game.", "Fix finding **3**. Run the game."] },
      { title: "Polish checklist", say: ["Polish is the difference between \"it works\" and \"it feels like a real game.\" Pick **at least four** from this list and add them:"],
        do: ["A **title screen** (a menu state) that names your game and says how to start.", "A **score** (and a **high score** that lasts while the game is running).", "**Instructions** on the screen: show the controls somewhere.", "**Difficulty** that changes as you play (faster, more enemies, smaller gaps).", "A **Game Over** message that shows the final score and how to restart.", "**Colors** that fit your game, with named color variables at the top.", "A **pause** key (P).", "Something that **moves or flashes** to make the screen feel alive."] },
      { title: "Write your reflection", say: ["Reflecting is how you learn from a project. Type your answers as comments at the very **bottom** of your file. Write a full sentence or two for each.", "Use this layout:"],
        code: "# REFLECTION 1: (What part of your game are you proudest of, and why?)\n# REFLECTION 2: (What was the hardest bug, and how did you fix it?)\n# REFLECTION 3: (Name your list, your function and its parameter, an if, and a loop.)\n# REFLECTION 4: (What would you add if you had another week?)",
        type: "Type the four reflection lines and answer each one.", chk: [["four # REFLECTION answers", /^#\s*REFLECTION\s*\d:[ \t]*\S+([ \t]+\S+){4,}/m, 4, "comments"]] },
      { title: "Final check", say: ["Run your game one last time. Then read it from top to bottom like a stranger would. Is anything confusing? Are your comments clear? Then you are done."],
        chk: [["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["a list", /^\s*\w+\s*=\s*\[/m], ["a loop", /^\s*(for|while)\s/m], ["an if statement", /^\s*if\s/m, 3], ["at least ten comments", /^\s*#\s*\S+/m, 10, "comments"]],
        type: "Your finished game has a list, a function with a parameter, at least three if statements, a loop, and at least ten comments.", run: "Play it one more time. You built this." }
    ],
    check: false,
    finish: [],
    challenges: ["Teach a friend how to build one piece of your game. Teaching is the best test of whether you understand it.", "Add a **second level** with a harder setup.", "Look at the AP CSP Create Task rubric. Which of your game's features would show each requirement?", "Start another game! Which of the games in this appendix would you change into something new?"],
    tips: { recipes: RECIPES },
    recap: "You planned, built, tested, fixed and polished a game of your own. Those are the same steps professional game developers follow. You also used every piece the AP Create Task looks for: a **list**, a **function with a parameter**, **selection** and **iteration**.",
    next: "**Congratulations! You finished Appendix A.** You can now build real games in Python. Keep making things."
  });
})(typeof window !== "undefined" ? window : globalThis);
