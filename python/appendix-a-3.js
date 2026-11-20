/* APPENDIX A, PART 3: more complete games (walkthroughs 13 to 20): Pong, Snake, Space Shooter and Flappy Bird. */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  function bring(n, code) { return { title: "I did not finish Walkthrough " + n, sections: [{ p: "Type your Walkthrough " + n + " program. This is what it should look like:" }, { ex: code.replace(/\n+$/, "").split("\n") }] }; }
  var HEAD = function (title, imports, fonts) { return ["import asyncio"].concat(imports || []).concat(["import pygame", "", "pygame.init()", "screen = pygame.display.set_mode((480, 320))", "pygame.display.set_caption(\"" + title + "\")", "clock = pygame.time.Clock()"]).concat(fonts || []); };
  var TAIL = ["", "    pygame.display.flip()", "    clock.tick(60)", "    await asyncio.sleep(0)", "", "pygame.quit()", ""];
  var LOOPTOP = ["", "running = True", "while running:", "    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False"];

  /* ================================================================= PONG ================ */
  /* o.move / o.ball / o.wall / o.paddle / o.score (scoring + reset) / o.rand (random serve) / o.win (first to 5 + restart) / o.fast (ball speeds up) */
  function pong(o) {
    var s = HEAD("Pong", o.rand ? ["import random"] : [], o.score ? ["font = pygame.font.Font(None, 48)"].concat(o.win ? ["big_font = pygame.font.Font(None, 56)", "small_font = pygame.font.Font(None, 28)"] : []) : []);
    s.push("", "left = pygame.Rect(20, 130, 12, 60)", "right = pygame.Rect(448, 130, 12, 60)", "ball = pygame.Rect(233, 153, 14, 14)");
    if (o.ball) s.push("ball_vx = 4", "ball_vy = 3");
    if (o.score) s.push("left_score = 0", "right_score = 0");
    if (o.win) s.push("winner = \"\"");
    s = s.concat(LOOPTOP);
    if (o.win) s.push("        if event.type == pygame.KEYDOWN and winner != \"\":", "            if event.key == pygame.K_SPACE:", "                left_score = 0", "                right_score = 0", "                winner = \"\"", "                ball.center = (240, 160)");
    s.push("");
    var u = [];
    if (o.move) u.push("keys = pygame.key.get_pressed()", "if keys[pygame.K_w]:", "    left.y -= 6", "if keys[pygame.K_s]:", "    left.y += 6", "if keys[pygame.K_UP]:", "    right.y -= 6", "if keys[pygame.K_DOWN]:", "    right.y += 6", "left.clamp_ip(screen.get_rect())", "right.clamp_ip(screen.get_rect())", "");
    if (o.ball) u.push("ball.x += ball_vx", "ball.y += ball_vy", "");
    if (o.wall) u.push("if ball.top <= 0 or ball.bottom >= 320:", "    ball_vy = -ball_vy", "");
    if (o.paddle) {
      if (o.fast) u.push("if ball.colliderect(left) and ball_vx < 0:", "    ball_vx = min(-ball_vx + 1, 10)", "if ball.colliderect(right) and ball_vx > 0:", "    ball_vx = max(-ball_vx - 1, -10)", "");
      else u.push("if ball.colliderect(left) and ball_vx < 0:", "    ball_vx = -ball_vx", "if ball.colliderect(right) and ball_vx > 0:", "    ball_vx = -ball_vx", "");
    }
    if (o.score) {
      var serve = o.rand ? ["    ball_vx = random.choice([-4, 4])", "    ball_vy = random.choice([-3, 3])"] : ["    ball_vx = 4", "    ball_vy = 3"];
      u.push("if ball.left < 0:", "    right_score += 1", "    ball.center = (240, 160)");
      u.push.apply(u, serve); u.push("if ball.right > 480:", "    left_score += 1", "    ball.center = (240, 160)"); u.push.apply(u, serve); u.push("");
    }
    if (o.win) u.push("if left_score >= 5:", "    winner = \"Left player\"", "if right_score >= 5:", "    winner = \"Right player\"", "");
    if (o.win) { s.push("    if winner == \"\":"); u.forEach(function (l) { s.push(l ? "        " + l : ""); }); }
    else u.forEach(function (l) { s.push(l ? "    " + l : ""); });
    s.push("    screen.fill((0, 0, 0))", "    for y in range(0, 320, 20):", "        pygame.draw.rect(screen, (90, 90, 90), (238, y, 4, 10))", "    pygame.draw.rect(screen, (255, 255, 255), left)", "    pygame.draw.rect(screen, (255, 255, 255), right)", "    pygame.draw.rect(screen, (255, 255, 255), ball)");
    if (o.score) s.push("    left_text = font.render(str(left_score), True, (255, 255, 255))", "    right_text = font.render(str(right_score), True, (255, 255, 255))", "    screen.blit(left_text, (190, 10))", "    screen.blit(right_text, (270, 10))");
    if (o.win) s.push("", "    if winner != \"\":", "        msg = big_font.render(winner + \" wins!\", True, (255, 255, 0))", "        screen.blit(msg, msg.get_rect(center=(240, 130)))", "        again = small_font.render(\"Press SPACE to play again\", True, (255, 255, 255))", "        screen.blit(again, again.get_rect(center=(240, 180)))");
    return s.concat(TAIL).join("\n");
  }
  var PG = [pong({}), pong({ move: 1 }), pong({ move: 1, ball: 1 }), pong({ move: 1, ball: 1, wall: 1 }), pong({ move: 1, ball: 1, wall: 1, paddle: 1 })];
  P.add({
    num: 13, title: "Pong 1: Paddles and a Ball",
    intro: ["**Pong** was one of the first video games ever made, in 1972. Two players each control a paddle and bounce a ball back and forth. If you miss, the other player scores.",
      "You will build it in two walkthroughs. In this first one you make the court, move **two paddles with different keys**, and get the ball bouncing off the walls and paddles."],
    learn: ["two players on one keyboard", "moving a ball with velocity variables", "bouncing off walls", "bouncing off paddles with colliderect", "drawing a dashed line with a loop"],
    firstTips: ["loop", "rectobj"],
    stages: [
      { title: "Draw the court", say: ["The court has three Rects: a **left** paddle, a **right** paddle, and a **ball**. All of them are white on a black background.", "The dashed center line is a small loop: `range(0, 320, 20)` counts `0, 20, 40, ... 300`. It draws a small rectangle at each of those heights."], help: ["loop", "rectobj"], code: PG[0],
        type: "Type the game loop, the three Rects, and the drawing code.", chk: [["a left and a right paddle", /left\s*=\s*pygame\.Rect\([\s\S]*right\s*=\s*pygame\.Rect\(/], ["a ball Rect", /ball\s*=\s*pygame\.Rect\(/], ["the dashed line loop", /for\s+y\s+in\s+range\(\s*0\s*,\s*320\s*,\s*20\s*\)\s*:/], ["the three Rects are drawn", /pygame\.draw\.rect\(\s*screen\s*,[^\n]*,\s*left\s*\)[\s\S]*pygame\.draw\.rect\(\s*screen\s*,[^\n]*,\s*right\s*\)[\s\S]*pygame\.draw\.rect\(\s*screen\s*,[^\n]*,\s*ball\s*\)/]],
        run: "A black court with a dashed middle line, two white paddles and a ball in the center." },
      { title: "Move two paddles", say: ["Two players, one keyboard. The **left** player uses **W** and **S**. The **right** player uses the **Up** and **Down** arrows.", "`clamp_ip` keeps each paddle inside the window. You used it for the player in Walkthrough 6."], help: ["held", "rectobj"], code: PG[1],
        type: "Type the key code before `screen.fill`.", chk: [["key.get_pressed()", /keys\s*=\s*pygame\.key\.get_pressed\(\)/], ["the left paddle moves with W and S", /pygame\.K_w[\s\S]*left\.y\s*-=\s*\d+[\s\S]*pygame\.K_s[\s\S]*left\.y\s*\+=\s*\d+/], ["the right paddle moves with Up and Down", /pygame\.K_UP[\s\S]*right\.y\s*-=\s*\d+[\s\S]*pygame\.K_DOWN[\s\S]*right\.y\s*\+=\s*\d+/], ["both paddles are clamped", /left\.clamp_ip[\s\S]*right\.clamp_ip/]],
        run: "Click the game screen. Move the left paddle with **W / S** and the right paddle with the **arrow keys**, at the same time." },
      { title: "Make the ball move", say: ["The ball has **velocity**: how far it moves each frame in `x` and in `y`. `ball_vx = 4` means 4 pixels to the right every frame. `ball_vy = 3` means 3 pixels down.", "Add them to the ball's position each frame. The ball goes at an angle."], code: PG[2],
        type: "Add `ball_vx = 4` and `ball_vy = 3` with the Rects. Type the two `ball.` lines after the paddle code.", chk: [["ball_vx = 4 and ball_vy = 3", /ball_vx\s*=\s*4[\s\S]*ball_vy\s*=\s*3/], ["ball.x += ball_vx", /ball\.x\s*\+=\s*ball_vx/], ["ball.y += ball_vy", /ball\.y\s*\+=\s*ball_vy/]],
        run: "The ball slides down and to the right, and flies off the screen." },
      { title: "Bounce off the top and bottom", say: ["When the ball touches the top (`ball.top <= 0`) or bottom (`ball.bottom >= 320`), **flip its vertical velocity**: `ball_vy = -ball_vy`. You did exactly this in Walkthrough 5."], code: PG[3],
        type: "Type the `if` block after the two `ball.` lines.", chk: [["if ball.top <= 0 or ball.bottom >= 320:", /if\s+ball\.top\s*<=\s*0\s+or\s+ball\.bottom\s*>=\s*320\s*:/], ["ball_vy = -ball_vy", /ball_vy\s*=\s*-\s*ball_vy/]],
        run: "The ball zigzags up and down until it leaves through the left or right side." },
      { title: "Bounce off the paddles", say: ["When the ball hits a paddle, flip its **horizontal** velocity: `ball_vx = -ball_vx`.", "Why the extra `and ball_vx < 0`? Without it, the ball can overlap a paddle for two frames, flip twice, and get **stuck inside** the paddle. This check says \"only bounce off the left paddle if the ball is moving left\" (negative velocity).", "The right paddle is the mirror image: only bounce if the ball is moving right (`ball_vx > 0`)."], help: ["collide"], code: PG[4],
        type: "Type the two `if` blocks after the wall bounce.", chk: [["a bounce off the left paddle", /if\s+ball\.colliderect\(\s*left\s*\)\s+and\s+ball_vx\s*<\s*0\s*:/], ["a bounce off the right paddle", /if\s+ball\.colliderect\(\s*right\s*\)\s+and\s+ball_vx\s*>\s*0\s*:/], ["flip ball_vx", /ball_vx\s*=\s*-\s*ball_vx[\s\S]*ball_vx\s*=\s*-\s*ball_vx/]],
        run: "Rally with a friend. The ball bounces off both paddles. (If you miss, the ball just leaves the screen. We fix that next time.)" }
    ],
    finish: ["Rally with a friend for 20 seconds. Can you keep the ball in play?", "Try making the paddles faster or slower by changing `6`."],
    challenges: ["Make the ball bigger or smaller by changing its width and height.", "Make the paddles taller. Does the game get easier?", "When the ball hits a paddle, change `ball_vy` depending on **where** it hit. (Hint: compare `ball.centery` with `left.centery`.)", "Make the left paddle controlled by the computer: move it toward `ball.centery`."],
    tips: {},
    recap: "A ball has a position and a **velocity**. Walls flip one velocity, paddles flip the other. Checking the direction (`ball_vx < 0`) stops the ball from getting stuck.",
    next: "**Next:** Walkthrough 14 adds **scoring**, a random **serve**, and a **winner**."
  });

  var PG2 = [pong({ move: 1, ball: 1, wall: 1, paddle: 1 }), pong({ move: 1, ball: 1, wall: 1, paddle: 1, score: 1 }), pong({ move: 1, ball: 1, wall: 1, paddle: 1, score: 1, rand: 1 }), pong({ move: 1, ball: 1, wall: 1, paddle: 1, score: 1, rand: 1, win: 1 }), pong({ move: 1, ball: 1, wall: 1, paddle: 1, score: 1, rand: 1, win: 1, fast: 1 })];
  P.add({
    num: 14, title: "Pong 2: Scoring and a Winner",
    intro: ["Right now when the ball leaves the screen, the game is over for good. A real game needs **scoring**: when the ball gets past a paddle, the other player gets a point and the ball starts again.",
      "You will add scores, a random **serve**, a **winner** at 5 points with a play-again key, and a ball that **speeds up** during a rally."],
    learn: ["detecting a point", "resetting the ball", "random.choice", "a winner string and the if winner == \"\" pattern", "speeding up with min and max"],
    firstTips: ["fonts", "states"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 13** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring13"], code: PG2[0], bring: true,
        type: "Paste your finished Walkthrough 13 code into this code box.", chk: [["both paddles", /left\s*=\s*pygame\.Rect\([\s\S]*right\s*=\s*pygame\.Rect\(/], ["the ball velocity", /ball_vx\s*=\s*4/], ["paddle bounces", /ball\.colliderect\(\s*left\s*\)/]],
        run: "Two paddles and a bouncing ball." },
      { title: "Score a point", say: ["If the ball goes past the **left** edge (`ball.left < 0`), the **right** player scored. If it passes the right edge (`ball.right > 480`), the **left** player scored.", "After a point, put the ball back in the middle (`ball.center = (240, 160)`) and reset its speed.", "Show both scores near the top of the screen with a font."], help: ["fonts"], code: PG2[1],
        type: "Add `font`, `left_score` and `right_score`. Type the two scoring `if` blocks. Type the text drawing lines at the end of the drawing.", chk: [["left_score = 0 and right_score = 0", /left_score\s*=\s*0[\s\S]*right_score\s*=\s*0/], ["if ball.left < 0: right scores", /if\s+ball\.left\s*<\s*0\s*:\s*\n\s+right_score\s*\+=\s*1/], ["if ball.right > 480: left scores", /if\s+ball\.right\s*>\s*480\s*:\s*\n\s+left_score\s*\+=\s*1/], ["the ball goes back to the middle", /ball\.center\s*=\s*\(\s*240\s*,\s*160\s*\)/, 2], ["both scores are shown", /font\.render\(\s*str\(\s*left_score\s*\)[\s\S]*font\.render\(\s*str\(\s*right_score\s*\)/]],
        run: "Miss the ball. The other player's score goes up, and the ball starts again from the middle." },
      { title: "Serve in a random direction", say: ["Serving the same way every time is predictable. `random.choice([-4, 4])` picks **one item from a list** at random: either `-4` or `4`. Do the same for the vertical velocity.", "You need `import random` at the top."], help: ["randomtips", "lists"], code: PG2[2],
        type: "Add `import random`. In both scoring blocks, change the serve lines to use `random.choice`.", chk: [["import random", /^import random\s*$/m], ["a random horizontal serve", /ball_vx\s*=\s*random\.choice\(\s*\[\s*-4\s*,\s*4\s*\]\s*\)/, 2], ["a random vertical serve", /ball_vy\s*=\s*random\.choice\(\s*\[\s*-3\s*,\s*3\s*\]\s*\)/, 2]],
        run: "After each point, the ball is served left or right, up or down, at random." },
      { title: "First to 5 wins", say: ["Make a `winner` variable that is `\"\"` (nothing) until someone wins. When a score reaches 5, store a name in it.", "Wrap the **update** code in `if winner == \"\":` so everything freezes when there is a winner. Then draw the winner message and ask to play again.", "To restart: listen for the **space bar** when there is a winner, and reset the scores and the winner."], help: ["states", "events"], code: PG2[3], reindent: true,
        type: "Add `big_font`, `small_font` and `winner = \"\"`. Add the KEYDOWN restart block. Put the update code inside `if winner == \"\":` (select it, then press Tab). Type the winner checks at the end of that block, and the message at the end of the drawing.", chk: [["winner = \"\"", /winner\s*=\s*""/], ["if winner == \"\":", /if\s+winner\s*==\s*""\s*:/], ["a left winner at 5", /if\s+left_score\s*>=\s*5\s*:\s*\n\s+winner\s*=/], ["a right winner at 5", /if\s+right_score\s*>=\s*5\s*:\s*\n\s+winner\s*=/], ["the wins message", /render\(\s*winner\s*\+\s*"\s*wins!"/], ["restart with SPACE when there is a winner", /event\.type\s*==\s*pygame\.KEYDOWN\s+and\s+winner\s*!=\s*""/]],
        run: "Play to 5. The winner is announced and the game freezes. Press **SPACE** to play again." },
      { title: "Speed up during a rally", say: ["Long rallies get boring when the ball never speeds up. Each paddle hit, make the ball **one pixel faster** in its direction. `-ball_vx + 1` flips the direction and adds 1 to the speed.", "`min(..., 10)` stops it from getting faster than 10, because a really fast ball could skip **through** a paddle between frames. `max(..., -10)` does the same going left."], help: ["clocktime"], code: PG2[4],
        type: "Change the two `ball_vx = -ball_vx` lines inside the paddle bounces, as shown in green.", chk: [["the left paddle speeds the ball up", /ball_vx\s*=\s*min\(\s*-\s*ball_vx\s*\+\s*1\s*,\s*10\s*\)/], ["the right paddle speeds the ball up", /ball_vx\s*=\s*max\(\s*-\s*ball_vx\s*-\s*1\s*,\s*-\s*10\s*\)/]],
        run: "Rallies get faster and faster until someone misses. After a point, the serve starts slow again." }
    ],
    finish: ["Play a full game to 5 with a friend.", "Change `5` to `3` for a quicker game."],
    challenges: ["Add a **one-player mode**: make the right paddle follow the ball automatically.", "Make the AI imperfect so you can beat it: only let it move 4 pixels per frame.", "Show **\"Get ready...\"** for one second before every serve using a timer.", "Add a **pause** key: press **P** to freeze the game, and again to resume."],
    tips: { bring13: bring(13, PG2[0]) },
    recap: "Detecting a point is just comparing the ball's position to the edges. `random.choice` picks from a list. A variable like `winner` (or `game_over`) acts like a switch: `if winner == \"\":` runs the game, and the end screen runs when the switch flips.",
    next: "**Next game:** **Snake**, which you build on a **grid**."
  });

  /* ================================================================= SNAKE ================ */
  /* o.draw (1 one block, 2 the snake list) / o.move / o.steer / o.food (1 draw, 2 eat and grow + score) / o.crash / o.over (1 text, 2 + restart) / o.fast */
  function snake(o) {
    var s = HEAD("Snake", o.food >= 2 ? ["import random"] : [], (o.steer ? ["font = pygame.font.Font(None, 30)"] : []).concat(o.over ? ["big_font = pygame.font.Font(None, 60)"] : []));
    s.push("", "CELL = 20", "COLS = 24", "ROWS = 16", "");
    if (o.draw === 1) s.push("col = 10", "row = 8");
    if (o.draw >= 2) s.push("snake = [(10, 8), (9, 8), (8, 8)]");
    if (o.move) s.push("dx = 1", "dy = 0");
    if (o.steer) s.push("next_dx = 1", "next_dy = 0", "moving = False");
    if (o.food) s.push("food = (15, 8)");
    if (o.food >= 2) s.push("score = 0");
    if (o.move) s.push("move_delay = 120", "last_move = pygame.time.get_ticks()");
    if (o.crash) s.push("game_over = False");
    s.push("", "running = True", "while running:");
    if (o.move) s.push("    now = pygame.time.get_ticks()");
    s.push("    for event in pygame.event.get():", "        if event.type == pygame.QUIT:", "            running = False");
    if (o.steer || o.over >= 2) {
      s.push("        if event.type == pygame.KEYDOWN:");
      if (o.steer) s.push("            if event.key == pygame.K_UP and dy == 0:", "                next_dx, next_dy = 0, -1", "            if event.key == pygame.K_DOWN and dy == 0:", "                next_dx, next_dy = 0, 1", "            if event.key == pygame.K_LEFT and dx == 0:", "                next_dx, next_dy = -1, 0", "            if event.key == pygame.K_RIGHT and dx == 0:", "                next_dx, next_dy = 1, 0", "            if event.key in (pygame.K_UP, pygame.K_DOWN, pygame.K_LEFT, pygame.K_RIGHT):", "                moving = True");
      if (o.over >= 2) s.push("            if event.key == pygame.K_SPACE and game_over:", "                snake = [(10, 8), (9, 8), (8, 8)]", "                dx, dy = 1, 0", "                next_dx, next_dy = 1, 0", "                moving = False", "                score = 0", "                move_delay = 120", "                food = (15, 8)", "                game_over = False");
    }
    s.push("");
    if (o.move) {
      s.push(o.crash ? "    if moving and not game_over and now - last_move >= move_delay:" : (o.steer ? "    if moving and now - last_move >= move_delay:" : "    if now - last_move >= move_delay:"), "        last_move = now");
      if (o.steer) s.push("        dx, dy = next_dx, next_dy");
      s.push("        head = (snake[0][0] + dx, snake[0][1] + dy)");
      var I = "        ";
      if (o.crash) { s.push("        if head[0] < 0 or head[0] >= COLS or head[1] < 0 or head[1] >= ROWS or head in snake:", "            game_over = True", "        else:"); I = "            "; }
      s.push(I + "snake.insert(0, head)");
      if (o.food >= 2) {
        s.push(I + "if head == food:", I + "    score += 1", I + "    food = (random.randint(0, COLS - 1), random.randint(0, ROWS - 1))", I + "    while food in snake:", I + "        food = (random.randint(0, COLS - 1), random.randint(0, ROWS - 1))");
        if (o.fast) s.push(I + "    move_delay = max(60, 120 - score * 4)");
        s.push(I + "else:", I + "    snake.pop()");
      } else s.push(I + "snake.pop()");
      s.push("");
    }
    s.push("    screen.fill((20, 40, 20))");
    if (o.draw === 1) s.push("    pygame.draw.rect(screen, (60, 200, 80), (col * CELL, row * CELL, CELL - 1, CELL - 1))");
    if (o.draw >= 2) s.push("    for col, row in snake:", "        pygame.draw.rect(screen, (60, 200, 80), (col * CELL, row * CELL, CELL - 1, CELL - 1))");
    if (o.food) s.push("    pygame.draw.rect(screen, (230, 70, 70), (food[0] * CELL, food[1] * CELL, CELL - 1, CELL - 1))");
    if (o.food >= 2) s.push("    text = font.render(\"Score: \" + str(score), True, (255, 255, 255))", "    screen.blit(text, (10, 8))");
    if (o.steer) s.push("", "    if not moving:", "        hint = font.render(\"Press an arrow key to start\", True, (255, 255, 255))", "        screen.blit(hint, hint.get_rect(center=(240, 100)))");
    if (o.over) {
      s.push("", "    if game_over:", "        over = big_font.render(\"GAME OVER\", True, (255, 255, 255))", "        screen.blit(over, over.get_rect(center=(240, 140)))");
      if (o.over >= 2) s.push("        again = font.render(\"Press SPACE to play again\", True, (255, 255, 255))", "        screen.blit(again, again.get_rect(center=(240, 190)))");
    }
    return s.concat(TAIL).join("\n");
  }
  var SN1 = [snake({ draw: 1 }), snake({ draw: 2 }), snake({ draw: 2, move: 1 }), snake({ draw: 2, move: 1, steer: 1 })];
  P.add({
    num: 15, title: "Snake 1: The Grid and a Moving Snake",
    intro: ["**Snake** is one of the most famous games ever. You steer a snake that never stops moving. You eat food to grow longer, and you lose if you hit a wall or your own tail.",
      "Snake works on a **grid**. Instead of pixels, positions are `(column, row)` cells. In this walkthrough you build the grid, the snake as a **list of cells**, and make it crawl and turn."],
    learn: ["grid coordinates (column, row) and converting to pixels", "a list of tuples", "tuple unpacking in a for loop", "moving by inserting a new head and popping the tail", "timers with get_ticks", "storing the next direction", "waiting for the player to start"],
    firstTips: ["lists", "clocktime"],
    stages: [
      { title: "A grid and one block", say: ["Our window is 480 by 320. Each grid **cell** is `20` pixels square, so the grid has `24` columns (480 / 20) and `16` rows (320 / 20). Constants (capital letters) at the top keep this clear.", "To draw a cell at `(col, row)`, multiply by `CELL`: `col * CELL` is the x in pixels and `row * CELL` is the y. We make the square `CELL - 1` wide so there is a tiny gap between blocks."], help: ["loop", "coords"], code: SN1[0],
        type: "Type the loop, the constants, and draw one green block at column 10, row 8.", chk: [["CELL, COLS and ROWS constants", /CELL\s*=\s*20[\s\S]*COLS\s*=\s*24[\s\S]*ROWS\s*=\s*16/], ["a cell converted to pixels", /pygame\.draw\.rect\(\s*screen\s*,[^\n]*col\s*\*\s*CELL\s*,\s*row\s*\*\s*CELL/]],
        run: "A single green block sits near the middle of a dark green field." },
      { title: "The snake is a list of cells", say: ["The snake is a **list of `(col, row)` tuples**. The **first** item is the head, and the rest are the body, trailing behind to the left.", "`for col, row in snake:` goes through the list and **unpacks** each tuple into two variables. Draw one block per cell."], help: ["lists"], code: SN1[1],
        type: "Delete `col` and `row`. Add `snake = [...]`. Replace the single `rect` with a `for` loop that draws every cell.", chk: [["snake = [(10, 8), (9, 8), (8, 8)]", /snake\s*=\s*\[\s*\(\s*10\s*,\s*8\s*\)\s*,\s*\(\s*9\s*,\s*8\s*\)\s*,\s*\(\s*8\s*,\s*8\s*\)\s*\]/], ["for col, row in snake:", /for\s+col\s*,\s*row\s+in\s+snake\s*:/]],
        run: "A snake three blocks long, facing right." },
      { title: "Make it crawl", say: ["The snake moves one cell every 120 milliseconds, not every frame. We use `pygame.time.get_ticks()` to ask the time, like in Whack-a-Mole.", "To move a snake in a list: add a **new head** one cell ahead (`snake.insert(0, head)`) and remove the **old tail** (`snake.pop()`). The snake looks like it slides forward. `insert(0, ...)` adds at the **front** of a list. `pop()` removes the **last** item.", "`dx` and `dy` say which way the snake is going: `dx = 1` means right. The new head is the old head plus `dx` and `dy`."], help: ["clocktime", "lists"], code: SN1[2],
        type: "Add `dx`, `dy`, `move_delay` and `last_move` to the setup. Add `now = ...` at the top of the loop. Type the `if now - last_move >= move_delay:` block.", chk: [["dx = 1 and dy = 0", /dx\s*=\s*1[\s\S]*dy\s*=\s*0/], ["now = pygame.time.get_ticks()", /now\s*=\s*pygame\.time\.get_ticks\(\)/], ["the move timer: now - last_move >= move_delay", /if\s+(moving\s+and\s+)?(not\s+game_over\s+and\s+)?now\s*-\s*last_move\s*>=\s*move_delay\s*:/], ["a new head one cell ahead", /head\s*=\s*\(\s*snake\[\s*0\s*\]\[\s*0\s*\]\s*\+\s*dx\s*,\s*snake\[\s*0\s*\]\[\s*1\s*\]\s*\+\s*dy\s*\)/], ["snake.insert(0, head) and snake.pop()", /snake\.insert\(\s*0\s*,\s*head\s*\)[\s\S]*snake\.pop\(\)/]],
        run: "The snake crawls to the right and leaves the screen. (Walls come next time.)" },
      { title: "Steer it", say: ["Pressing an arrow key changes the direction. Use `KEYDOWN` events because one press is one turn.", "Two rules: a snake can't turn **straight back** into itself, and it should only turn when it actually moves. So we store the **wanted** direction in `next_dx, next_dy`, and only copy it into `dx, dy` just before moving.", "The check `and dy == 0` means \"you can only turn **up or down** if you are currently moving left or right\", and the other way around for left and right.", "`next_dx, next_dy = 0, -1` sets **both** variables on one line.", "One more thing: the snake should **wait for you**. A variable `moving` starts as `False`, and the first arrow key press makes it `True`. The snake only moves `if moving`. Until then, show a hint (this needs a font, like in earlier walkthroughs). `event.key in (...)` asks \"is the key one of these four?\"."], help: ["events", "held", "fonts"], code: SN1[3], reindent: true,
        type: "Add `font`, `next_dx`, `next_dy` and `moving = False`. Type the whole `KEYDOWN` block in the events. Change the move `if` to start with `moving and`. Add the `dx, dy = next_dx, next_dy` line at the start of the move block. Type the `if not moving:` hint at the end of the drawing.", chk: [["next_dx = 1 and next_dy = 0", /next_dx\s*=\s*1[\s\S]*next_dy\s*=\s*0/], ["a turn for each arrow key", /event\.key\s*==\s*pygame\.K_UP[\s\S]*event\.key\s*==\s*pygame\.K_DOWN[\s\S]*event\.key\s*==\s*pygame\.K_LEFT[\s\S]*event\.key\s*==\s*pygame\.K_RIGHT/], ["dx, dy = next_dx, next_dy", /dx\s*,\s*dy\s*=\s*next_dx\s*,\s*next_dy/], ["the snake waits for the first key", /moving\s*=\s*False[\s\S]*if\s+moving\s+and\s+now\s*-\s*last_move/], ["a hint while waiting", /if\s+not\s+moving\s*:\s*\n\s+hint\s*=\s*font\.render\(/]],
        run: "The snake waits. Press an arrow key and it starts. Try to turn left when you are going right. The snake won't. (It still leaves the screen if you let it.)" }
    ],
    finish: ["Steer the snake around the screen in a big rectangle.", "Try turning twice very fast (up then left). The snake should never fold back into itself."],
    challenges: ["Make the snake start longer by adding more cells to the list.", "Make the snake **blue with a yellow head**: draw the first cell (`snake[0]`) in a different color.", "Change `move_delay` to `60`. Is the snake easier or harder to control?", "Add WASD controls too, using `or` like in Walkthrough 6."],
    tips: {},
    recap: "A grid game stores positions as `(col, row)` and converts to pixels by multiplying by the cell size. A snake is a list of cells: **insert a head, pop a tail** to move. A timer from `get_ticks` makes it step at a steady pace.",
    next: "**Next:** Walkthrough 16 adds **food**, **growth**, **crashes** and **Game Over**."
  });

  var SN2 = [snake({ draw: 2, move: 1, steer: 1 }), snake({ draw: 2, move: 1, steer: 1, food: 1 }), snake({ draw: 2, move: 1, steer: 1, food: 2 }), snake({ draw: 2, move: 1, steer: 1, food: 2, crash: 1 }), snake({ draw: 2, move: 1, steer: 1, food: 2, crash: 1, over: 1 }), snake({ draw: 2, move: 1, steer: 1, food: 2, crash: 1, over: 2 }), snake({ draw: 2, move: 1, steer: 1, food: 2, crash: 1, over: 2, fast: 1 })];
  P.add({
    num: 16, title: "Snake 2: Food, Growing and Game Over",
    intro: ["Your snake crawls and turns, but there is nothing to eat and nothing to avoid. In this walkthrough you add **food**, make the snake **grow**, count a **score**, detect **crashes** into walls and into itself, and add **Game Over** and **restart**.",
      "At the end, the game also gets **faster** as the snake grows."],
    learn: ["random food that never lands on the snake (a while loop)", "growing by skipping pop()", "if x in list", "wall checks with or", "end screen and restart", "difficulty from the score"],
    firstTips: ["lists", "states"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 15** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring15"], code: SN2[0], bring: true,
        type: "Paste your finished Walkthrough 15 code into this code box.", chk: [["the snake list", /snake\s*=\s*\[/], ["next_dx and next_dy", /next_dx/], ["the move timer", /move_delay/]],
        run: "A snake that crawls and turns." },
      { title: "Put some food on the grid", say: ["Food is just a `(col, row)` tuple, like one cell of the snake. Start it at `(15, 8)` and draw it as a red cell. `food[0]` is its column and `food[1]` is its row."], code: SN2[1],
        type: "Add `food = (15, 8)` to the setup. Type the red `pygame.draw.rect` line after the snake is drawn.", chk: [["food = (15, 8)", /food\s*=\s*\(\s*15\s*,\s*8\s*\)/], ["draw the food", /pygame\.draw\.rect\(\s*screen\s*,[^\n]*food\[\s*0\s*\]\s*\*\s*CELL\s*,\s*food\[\s*1\s*\]\s*\*\s*CELL/]],
        run: "A red block sits in front of the snake." },
      { title: "Eat, grow and score", say: ["After the move, ask: did the new head land on the food? `head == food` compares two tuples.", "**To grow:** if the snake ate, **skip** the `pop()`. The snake got one cell longer because we added a head but didn't remove a tail. Otherwise, pop the tail like before.", "Put the food somewhere new and random. A `while food in snake:` loop keeps picking new spots until the food is **not** on the snake's body.", "Add a score variable and show it."], help: ["randomtips", "lists", "fonts"], code: SN2[2],
        type: "Add `import random` and `score = 0`. In the move block, type the `if head == food:` ... `else:` block (replacing the lone `snake.pop()`). Type the score text at the end of the drawing.", chk: [["import random", /^import random\s*$/m], ["score = 0", /score\s*=\s*0/], ["if head == food:", /if\s+head\s*==\s*food\s*:/], ["a new random food cell", /food\s*=\s*\(\s*random\.randint\(\s*0\s*,\s*COLS\s*-\s*1\s*\)\s*,\s*random\.randint\(\s*0\s*,\s*ROWS\s*-\s*1\s*\)\s*\)/, 2], ["while food in snake:", /while\s+food\s+in\s+snake\s*:/], ["pop() only in the else", /else\s*:\s*\n\s+snake\.pop\(\)/], ["the score text", /font\.render\(\s*"Score: "/]],
        run: "Steer into the red food. The snake gets longer, the food jumps, and the score goes up." },
      { title: "Crash!", say: ["There are two ways to lose: hit a **wall** (the new head is outside the grid) or hit **yourself** (`head in snake`, which asks whether the head's cell is already part of the body).", "If we crash, set `game_over = True` and **don't** move. Otherwise do the normal move. Only move while `not game_over`.", "All the lines inside the move block get indented one more level because of the new `else:`."], help: ["states"], code: SN2[3], reindent: true,
        type: "Add `game_over = False` to the setup. Change the move `if` to also check `not game_over`, right after `moving and`. Type the `if head[0] < 0 ...` block, and put the rest of the move code in its `else:`.", chk: [["game_over = False", /game_over\s*=\s*False/], ["if moving and not game_over and ...:", /if\s+moving\s+and\s+not\s+game_over\s+and\s+now\s*-\s*last_move\s*>=\s*move_delay\s*:/], ["a wall or self crash check", /if\s+head\[\s*0\s*\]\s*<\s*0\s+or\s+head\[\s*0\s*\]\s*>=\s*COLS[\s\S]*head\s+in\s+snake\s*:/], ["game_over = True", /game_over\s*=\s*True/]],
        run: "Hit a wall, or turn into your own body. The snake stops. (No message yet.)" },
      { title: "Say Game Over", say: ["Make a big font and draw **GAME OVER** when `game_over` is `True`. This is the same pattern you used in Meteor Dodge."], help: ["fonts"], code: SN2[4],
        type: "Add `big_font` with your fonts. Type the `if game_over:` block at the end of the drawing.", chk: [["a big font", /big_font\s*=\s*pygame\.font\.Font\(/], ["the GAME OVER text", /big_font\.render\(\s*"GAME OVER"/]],
        run: "Crash and **GAME OVER** appears over the frozen snake." },
      { title: "Play again", say: ["Pressing **space** after a crash should reset everything: the snake, its direction, the score, the speed, the food, and `game_over`.", "This is the same idea as the **R** to restart in Meteor Dodge: restarting is just setting every variable back to how it started."], help: ["states", "events"], code: SN2[5],
        type: "Add the `if event.key == pygame.K_SPACE and game_over:` block inside the `KEYDOWN` block. Add the second line of text under GAME OVER.", chk: [["restart on SPACE after game over", /event\.key\s*==\s*pygame\.K_SPACE\s+and\s+game_over/], ["the snake is reset and waits for a key again", /^ {16}snake\s*=\s*\[\s*\([\s\S]*^ {16}moving\s*=\s*False[\s\S]*^ {16}score\s*=\s*0[\s\S]*^ {16}game_over\s*=\s*False/m], ["the Press SPACE message", /Press SPACE to play again/]],
        run: "Crash, press **SPACE**, then an arrow key, and play again without clicking Run." },
      { title: "Get faster as you grow", say: ["The more food you eat, the shorter the delay between moves. `max(60, 120 - score * 4)` lowers the delay by 4 ms for each food, but never below 60 ms.", "Put it inside the `if head == food:` block."], code: SN2[6],
        type: "Type the `move_delay = ...` line at the end of the `if head == food:` block.", chk: [["move_delay = max(60, 120 - score * 4)", /move_delay\s*=\s*max\(\s*60\s*,\s*120\s*-\s*score\s*\*\s*4\s*\)/]],
        run: "Eat 10 pieces of food. The snake is much faster." }
    ],
    finish: ["Play until you crash. What is your best score?", "Compare scores with a friend."],
    challenges: ["Add a **high score** that survives restarts.", "Make walls **wrap around** instead of killing you: `head = (head[0] % COLS, head[1] % ROWS)`.", "Add **bonus food** that appears for 5 seconds and is worth 3 points.", "Draw the snake's head with two small eyes. (Hint: the head is `snake[0]`.)"],
    tips: { bring15: bring(15, SN2[0]) },
    recap: "Snake is a **list** game. Growing means skipping `pop()`. Collisions are `in` checks on a list. A restart is a reset of every variable, and difficulty can depend on the score.",
    next: "**Next game:** a **Space Shooter**."
  });

  /* ================================================================= SPACE SHOOTER ================ */
  /* o.move / o.shoot / o.enemies / o.hit (bullets kill enemies, score) / o.lives (enemies that get through hurt) / o.over (1 text) / o.restart / o.hard */
  function shooter(o) {
    var s = HEAD("Space Shooter", o.enemies ? ["import random"] : [], o.hit || o.lives ? ["font = pygame.font.Font(None, 30)", "big_font = pygame.font.Font(None, 60)"] : []);
    s.push("", "ship = pygame.Rect(220, 285, 40, 24)"); if (o.move) s.push("speed = 6"); if (o.shoot) s.push("bullets = []");
    if (o.enemies) s.push("enemies = []", "spawn_timer = 0");
    if (o.hit) s.push("score = 0");
    if (o.lives) s.push("lives = 3", "game_over = False");
    s = s.concat(LOOPTOP);
    if (o.shoot || o.restart) {
      s.push("        if event.type == pygame.KEYDOWN:");
      if (o.shoot) s.push("            if event.key == pygame.K_SPACE" + (o.over ? " and not game_over" : "") + ":", "                bullets.append(pygame.Rect(ship.centerx - 2, ship.top - 12, 4, 12))");
      if (o.restart) s.push("            if event.key == pygame.K_r and game_over:", "                bullets = []", "                enemies = []", "                score = 0", "                lives = 3", "                ship.x = 220", "                game_over = False");
    }
    s.push("");
    var u = [];
    if (o.move) u.push("keys = pygame.key.get_pressed()", "if keys[pygame.K_LEFT] or keys[pygame.K_a]:", "    ship.x -= speed", "if keys[pygame.K_RIGHT] or keys[pygame.K_d]:", "    ship.x += speed", "ship.clamp_ip(screen.get_rect())", "");
    if (o.enemies) u.push("spawn_timer += 1", (o.hard ? "spawn_delay = max(15, 50 - score // 20)" : null), "if spawn_timer >= " + (o.hard ? "spawn_delay" : "50") + ":", "    spawn_timer = 0", "    enemies.append(pygame.Rect(random.randint(0, 450), -30, 30, 24))", "");
    u = u.filter(function (x) { return x !== null; });
    if (o.shoot) u.push("for b in bullets[:]:", "    b.y -= 9", "    if b.bottom < 0:", "        bullets.remove(b)", "");
    if (o.enemies) {
      u.push("for e in enemies[:]:", "    e.y += " + (o.hard ? "2 + score // 150" : "2"));
      if (o.lives) u.push("    if e.top > 320:", "        enemies.remove(e)", "        lives -= 1", "    elif e.colliderect(ship):", "        enemies.remove(e)", "        lives -= 1");
      else u.push("    if e.top > 320:", "        enemies.remove(e)");
      u.push("");
    }
    if (o.hit) u.push("for b in bullets[:]:", "    for e in enemies[:]:", "        if b.colliderect(e):", "            bullets.remove(b)", "            enemies.remove(e)", "            score += 10", "            break", "");
    if (o.lives) u.push("if lives <= 0:", "    game_over = True", "");
    if (o.lives) { s.push("    if not game_over:"); u.forEach(function (l) { s.push(l ? "        " + l : ""); }); }
    else u.forEach(function (l) { s.push(l ? "    " + l : ""); });
    s.push("    screen.fill((5, 5, 25))", "    pygame.draw.polygon(screen, (80, 220, 255), [ship.midtop, ship.bottomleft, ship.bottomright])");
    if (o.shoot) s.push("    for b in bullets:", "        pygame.draw.rect(screen, (255, 255, 100), b)");
    if (o.enemies) s.push("    for e in enemies:", "        pygame.draw.rect(screen, (230, 70, 70), e)");
    if (o.hit || o.lives) s.push("    text = font.render(\"Score: \" + str(score)" + (o.lives ? " + \"   Lives: \" + str(lives)" : "") + ", True, (255, 255, 255))", "    screen.blit(text, (10, 8))");
    if (o.over) s.push("", "    if game_over:", "        over = big_font.render(\"GAME OVER\", True, (255, 80, 80))", "        screen.blit(over, over.get_rect(center=(240, 140)))", "        again = font.render(\"Press R to play again\", True, (255, 255, 255))", "        screen.blit(again, again.get_rect(center=(240, 190)))");
    return s.concat(TAIL).join("\n");
  }
  var SH1 = [shooter({}), shooter({ move: 1 }), shooter({ move: 1, shoot: 1 })];
  P.add({
    num: 17, title: "Space Shooter 1: Ship and Bullets",
    intro: ["Time for a classic shoot-'em-up. In this walkthrough you build the player's **ship** and its **bullets**. Press the space bar to fire. In the next one you will add the aliens.",
      "Bullets are a great use of **lists**: you can have as many in the air at once as the player fires."],
    learn: ["drawing a polygon from a Rect's corner points", "a bullets list", "creating a bullet at the ship's position", "moving every bullet up", "removing bullets that leave the screen"],
    firstTips: ["lists", "removebug"],
    stages: [
      { title: "A ship made of a triangle", say: ["A `Rect` has handy corner points: `ship.midtop` is the middle of the top edge, and `ship.bottomleft` and `ship.bottomright` are the bottom corners. Three points make a triangle: a ship!", "The Rect is still the ship's **collision box**. The triangle is just its picture."], help: ["loop", "draw", "rectobj"], code: SH1[0],
        type: "Type the loop. Make the `ship` Rect. Draw the ship as a triangle polygon.", chk: [["a ship Rect", /ship\s*=\s*pygame\.Rect\(/], ["a polygon from the ship's corners", /pygame\.draw\.polygon\(\s*screen\s*,[^\n]*ship\.midtop\s*,\s*ship\.bottomleft\s*,\s*ship\.bottomright/]],
        run: "A light blue triangle ship sits at the bottom of a dark blue sky." },
      { title: "Fly the ship", say: ["You have done this before: left and right with the arrow keys or A and D, and `clamp_ip` to stay on the screen. Type it without peeking at the help if you can."], help: ["held"], code: SH1[1],
        type: "Add `speed = 6` under the ship, and type the key code before `screen.fill`.", chk: [["speed = 6", /speed\s*=\s*6/], ["key.get_pressed()", /pygame\.key\.get_pressed\(\)/], ["the ship moves with ship.x", /ship\.x\s*-=\s*speed[\s\S]*ship\.x\s*\+=\s*speed/], ["ship.clamp_ip(...)", /ship\.clamp_ip\(\s*screen\.get_rect\(\)\s*\)/]],
        run: "Fly the ship left and right along the bottom." },
      { title: "Fire bullets", say: ["Shooting is a **single press**, so use a `KEYDOWN` event, not `get_pressed`. (If you used `get_pressed`, one press would fire 60 bullets a second.)", "A bullet is a thin `Rect` that starts at the ship's nose: `ship.centerx - 2` (half the bullet's width so it's centered) and `ship.top - 12`. `.append` it to the list.", "Every frame, move every bullet **up** (`b.y -= 9`). When its **bottom** goes above the top of the screen (`b.bottom < 0`), remove it. Loop over a **copy** (`bullets[:]`) because you remove while looping.", "Draw every bullet in the list."], help: ["events", "removebug"], code: SH1[2],
        type: "Add `bullets = []` under `speed`. Type the `KEYDOWN` block in the events. Type the bullet `for` loop after the ship code. Type the bullet drawing loop.", chk: [["a bullets list", /bullets\s*=\s*\[\s*\]/], ["if event.key == pygame.K_SPACE:", /event\.key\s*==\s*pygame\.K_SPACE/], ["a bullet is added to the list", /bullets\.append\(\s*pygame\.Rect\(\s*ship\.centerx\s*-\s*2\s*,\s*ship\.top\s*-\s*12\s*,\s*4\s*,\s*12\s*\)\s*\)/], ["for b in bullets[:]:", /for\s+b\s+in\s+bullets\[\s*:\s*\]\s*:/], ["b.y -= 9 and bullets.remove(b)", /b\.y\s*-=\s*9[\s\S]*bullets\.remove\(\s*b\s*\)/], ["bullets are drawn", /for\s+b\s+in\s+bullets\s*:\s*\n\s+pygame\.draw\.rect\(/]],
        run: "Press the **space bar** to shoot. Each press fires one yellow bullet that flies to the top of the screen." }
    ],
    finish: ["Fire 20 bullets as fast as you can.", "Temporarily add `print(len(bullets))` in the loop. Does the number go back down? (Delete the print.)"],
    challenges: ["Make the bullets faster or slower.", "Fire **two** bullets at once, one from each side of the ship.", "Limit the player to **3 bullets on the screen** at a time: `if len(bullets) < 3:`.", "Let the player **hold** the space bar to autofire, but with a cooldown: store `last_shot = pygame.time.get_ticks()` and only fire if 250 ms have passed."],
    tips: {},
    recap: "Bullets are Rects in a list. Create one on a `KEYDOWN`, move all of them each frame, and remove the ones that leave the screen (looping over a copy).",
    next: "**Next:** Walkthrough 18 adds the **aliens**."
  });

  var SH2 = [shooter({ move: 1, shoot: 1 }), shooter({ move: 1, shoot: 1, enemies: 1 }), shooter({ move: 1, shoot: 1, enemies: 1, hit: 1 }), shooter({ move: 1, shoot: 1, enemies: 1, hit: 1, lives: 1 }), shooter({ move: 1, shoot: 1, enemies: 1, hit: 1, lives: 1, over: 1, restart: 1 }), shooter({ move: 1, shoot: 1, enemies: 1, hit: 1, lives: 1, over: 1, restart: 1, hard: 1 })];
  P.add({
    num: 18, title: "Space Shooter 2: Aliens, Hits and Lives",
    intro: ["Now for the enemies. Aliens will drop from the top of the screen. Your bullets destroy them for points, but if one reaches the bottom **or hits your ship**, you lose a life. When your lives run out, it's **Game Over**.",
      "The new idea is **checking every bullet against every alien**, which is a loop inside a loop."],
    learn: ["spawning enemies on a timer", "a nested loop that compares every bullet with every enemy", "break", "elif", "a lives counter", "difficulty that depends on the score"],
    firstTips: ["lists", "collide"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 17** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring17"], code: SH2[0], bring: true,
        type: "Paste your finished Walkthrough 17 code into this code box.", chk: [["the ship", /ship\s*=\s*pygame\.Rect\(/], ["the bullets", /bullets\.append\(/], ["bullet movement", /b\.y\s*-=\s*9/]],
        run: "Your ship flies and fires." },
      { title: "Drop some aliens", say: ["Aliens work just like the meteors in Meteor Dodge: a list of Rects, spawned on a timer at a random `x`, moved down every frame, and removed when they are below the screen.", "Add `import random` at the top."], help: ["lists", "randomtips", "removebug"], code: SH2[1],
        type: "Add `import random`, `enemies = []` and `spawn_timer = 0`. Type the spawn block and the enemy `for` loop after the key code. Draw the enemies.", chk: [["import random", /^import random\s*$/m], ["enemies = []", /enemies\s*=\s*\[\s*\]/], ["enemies.append(pygame.Rect(...))", /enemies\.append\(\s*pygame\.Rect\(\s*random\.randint\(/], ["for e in enemies[:]:", /for\s+e\s+in\s+enemies\[\s*:\s*\]\s*:/], ["enemies are drawn", /for\s+e\s+in\s+enemies\s*:\s*\n\s+pygame\.draw\.rect\(/]],
        run: "Red aliens drop from the sky. Your bullets pass right through them. Fix that next." },
      { title: "Shoot them down", say: ["To find which bullet hit which alien, check **every bullet against every alien**. That is a `for` inside a `for`: **a nested loop**.", "When a bullet and an alien overlap, remove **both** and add 10 points. Then `break` to leave the inner loop. That bullet is gone, so it must not hit a second alien.", "Both loops go over **copies** (`[:]`) because you remove from the lists."], help: ["collide", "removebug", "fonts"], code: SH2[2],
        type: "Add `font`, `big_font` and `score = 0`. Type the nested loops after the enemy loop. Type the score text at the end of the drawing.", chk: [["score = 0", /score\s*=\s*0/], ["a bullet loop with an enemy loop inside", /for\s+b\s+in\s+bullets\[\s*:\s*\]\s*:\s*\n\s+for\s+e\s+in\s+enemies\[\s*:\s*\]\s*:/], ["if b.colliderect(e):", /if\s+b\.colliderect\(\s*e\s*\)\s*:/], ["both are removed, 10 points", /bullets\.remove\(\s*b\s*\)\s*\n\s+enemies\.remove\(\s*e\s*\)\s*\n\s+score\s*\+=\s*10/], ["break", /^\s+break\s*$/m]],
        run: "Shoot an alien and it disappears. The score goes up by 10." },
      { title: "Lives", say: ["An alien hurts you in two ways: it **reaches the bottom** or it **crashes into your ship**. Both cost one life and remove the alien. Use `if` for the first and `elif` for the second.", "`elif` means \"otherwise, if...\". It only checks the second question when the first one was false.", "When `lives` is `0` or less, set `game_over = True`. Put your update code inside `if not game_over:` so the game freezes."], help: ["states"], code: SH2[3], reindent: true,
        type: "Add `lives = 3` and `game_over = False`. Put the update code in `if not game_over:`. Type the `if e.top > 320:` / `elif` block, replacing the old one. Type the `if lives <= 0:` check. Add Lives to your score text.", chk: [["lives = 3", /lives\s*=\s*3/], ["game_over = False", /game_over\s*=\s*False/], ["if not game_over:", /if\s+not\s+game_over\s*:/], ["an alien that reaches the bottom costs a life", /if\s+e\.top\s*>\s*320\s*:\s*\n\s+enemies\.remove\(\s*e\s*\)\s*\n\s+lives\s*-=\s*1/], ["elif e.colliderect(ship):", /elif\s+e\.colliderect\(\s*ship\s*\)\s*:/], ["if lives <= 0:", /if\s+lives\s*<=\s*0\s*:\s*\n\s+game_over\s*=\s*True/]],
        run: "Let three aliens through. The game freezes at 0 lives." },
      { title: "Game Over and restart", say: ["Add the **GAME OVER** message and let the player press **R** to start over.", "Also stop firing bullets when the game is over: `and not game_over` on the space bar check."], help: ["states", "events"], code: SH2[4],
        type: "Add `and not game_over` to the space bar check. Add the `K_r` restart block inside the `KEYDOWN` block. Type the `if game_over:` message at the end.", chk: [["no firing when the game is over", /K_SPACE\s+and\s+not\s+game_over/], ["restart with R", /event\.key\s*==\s*pygame\.K_r\s+and\s+game_over/], ["the lists and score are reset", /bullets\s*=\s*\[\s*\]\s*\n\s+enemies\s*=\s*\[\s*\]\s*\n\s+score\s*=\s*0\s*\n\s+lives\s*=\s*3/], ["the GAME OVER text", /big_font\.render\(\s*"GAME OVER"/]],
        run: "Lose, press **R**, and play again." },
      { title: "Make it harder", say: ["The more you score, the **faster** aliens fall, and the **faster** they spawn.", "`2 + score // 150` adds 1 to the fall speed every 150 points. `max(15, 50 - score // 20)` makes the spawn delay shorter as the score grows, but never lower than 15 frames."], code: SH2[5],
        type: "Add the `spawn_delay = ...` line before the spawn `if`, and change that `if` to use `spawn_delay`. Change `e.y += 2` into `e.y += 2 + score // 150`.", chk: [["spawn_delay = max(15, 50 - score // 20)", /spawn_delay\s*=\s*max\(\s*15\s*,\s*50\s*-\s*score\s*\/\/\s*20\s*\)/], ["if spawn_timer >= spawn_delay:", /if\s+spawn_timer\s*>=\s*spawn_delay\s*:/], ["e.y += 2 + score // 150", /e\.y\s*\+=\s*2\s*\+\s*score\s*\/\/\s*150/]],
        run: "Reach 300 points. The aliens are faster and there are more of them." }
    ],
    finish: ["Play until you run out of lives. What is your best score?", "Ask a friend to beat it."],
    challenges: ["Add an alien that takes **2 hits** to destroy. What do you need to store with each alien? (Hint: a list of lists, or a dictionary.)", "Make aliens **zigzag** by also changing `e.x`.", "Add **power-ups**: sometimes a destroyed alien drops a star. Catching it gives you a life.", "Draw the aliens as something better than a rectangle: combine a few `pygame.draw` calls."],
    tips: { bring17: bring(17, SH2[0]) },
    recap: "A nested loop checks every pair of items from two lists. Use `break` once the bullet is used. `elif` chooses between exclusive cases. A `lives` counter turns one mistake into a few.",
    next: "**Next game:** **Flappy Bird**, which uses **gravity**."
  });

  /* ================================================================= FLAPPY BIRD ================ */
  /* o.gravity / o.flap / o.limits (floor/ceiling) / o.over / o.restart / o.pipes (1 move, 2 collide, 3 score) / o.best */
  function flappy(o) {
    var fonts = [];
    if (o.flap || o.over || o.pipes >= 3) fonts.push("font = pygame.font.Font(None, 36)");
    if (o.over) fonts.push("big_font = pygame.font.Font(None, 60)");
    var s = HEAD("Flappy Bird", o.pipes ? ["import random"] : [], fonts);
    s.push("", "bird = pygame.Rect(80, 150, 28, 28)", "bird_y = 150.0", "bird_vy = 0.0");
    if (o.flap) s.push("started = False");
    if (o.pipes) s.push("pipes = []", "spawn_timer = 0");
    if (o.pipes >= 3) s.push("score = 0");
    if (o.best) s.push("best = 0");
    if (o.limits) s.push("game_over = False");
    s = s.concat(LOOPTOP);
    if (o.flap) {
      s.push("        if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:");
      if (o.restart) {
        s.push("            if game_over:", "                bird_y = 150.0", "                bird_vy = 0.0");
        if (o.pipes) s.push("                pipes = []", "                spawn_timer = 0");
        if (o.pipes >= 3) s.push("                score = 0");
        s.push("                game_over = False", "                started = False", "            else:", "                started = True", "                bird_vy = -7.5");
      } else s.push("            started = True", "            bird_vy = -7.5");
    }
    s.push("");
    var u = [];
    if (o.gravity) u.push("bird_vy += 0.45", "bird_y += bird_vy", "bird.y = int(bird_y)", "");
    if (o.pipes) {
      u.push("spawn_timer += 1", "if spawn_timer >= 90:", "    spawn_timer = 0", "    gap = random.randint(70, 190)", "    pipes.append({\"top\": pygame.Rect(480, 0, 50, gap - 55), \"bottom\": pygame.Rect(480, gap + 55, 50, 265 - gap), \"scored\": False})", "", "for p in pipes[:]:", "    p[\"top\"].x -= 3", "    p[\"bottom\"].x -= 3", "    if p[\"top\"].right < 0:", "        pipes.remove(p)");
      if (o.pipes >= 2) u.push("    if bird.colliderect(p[\"top\"]) or bird.colliderect(p[\"bottom\"]):", "        game_over = True");
      if (o.pipes >= 3) u.push("    if not p[\"scored\"] and p[\"top\"].right < bird.left:", "        p[\"scored\"] = True", "        score += 1");
      u.push("");
    }
    if (o.limits) u.push("if bird.top < 0 or bird.bottom > 320:", "    game_over = True", "");
    if (o.best) u.push("if game_over and score > best:", "    best = score", "");
    if (o.limits) { s.push("    if started and not game_over:"); u.forEach(function (l) { s.push(l ? "        " + l : ""); }); }
    else if (o.flap) { s.push("    if started:"); u.forEach(function (l) { s.push(l ? "        " + l : ""); }); }
    else u.forEach(function (l) { s.push(l ? "    " + l : ""); });
    s.push("    screen.fill((110, 190, 240))");
    if (o.pipes) s.push("    for p in pipes:", "        pygame.draw.rect(screen, (60, 170, 70), p[\"top\"])", "        pygame.draw.rect(screen, (60, 170, 70), p[\"bottom\"])");
    s.push("    pygame.draw.circle(screen, (255, 220, 0), bird.center, 14)", "    pygame.draw.circle(screen, (0, 0, 0), (bird.centerx + 6, bird.centery - 4), 3)");
    if (o.pipes >= 3) s.push("    text = font.render(\"Score: \" + str(score)" + (o.best ? " + \"   Best: \" + str(best)" : "") + ", True, (255, 255, 255))", "    screen.blit(text, (10, 8))");
    if (o.flap) s.push("", "    if not started:", "        hint = font.render(\"Press SPACE to flap\", True, (255, 255, 255))", "        screen.blit(hint, hint.get_rect(center=(240, 200)))");
    if (o.over) s.push("", "    if game_over:", "        over = big_font.render(\"GAME OVER\", True, (255, 80, 80))", "        screen.blit(over, over.get_rect(center=(240, 130)))", "        again = font.render(\"Press SPACE to play again\", True, (255, 255, 255))", "        screen.blit(again, again.get_rect(center=(240, 180)))");
    return s.concat(TAIL).join("\n");
  }
  var FL1 = [flappy({}), flappy({ gravity: 1 }), flappy({ gravity: 1, flap: 1 }), flappy({ gravity: 1, flap: 1, limits: 1 }), flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1 })];
  P.add({
    num: 19, title: "Flappy Bird 1: Gravity and Flapping",
    intro: ["**Flappy Bird** is simple, but its feel comes from **physics**. A bird falls faster and faster because of gravity, and each flap gives it a quick upward kick.",
      "In this walkthrough you make a bird that falls, flaps when you press the space bar, and loses when it hits the ground or the sky. The next walkthrough adds the pipes."],
    learn: ["gravity: velocity changes every frame, and position changes with velocity", "float variables and converting with int()", "a single-press jump", "waiting for the player to start", "game_over with the if not pattern", "restarting with the same key"],
    firstTips: ["clocktime", "states"],
    stages: [
      { title: "The bird", say: ["The bird is a 28 by 28 `Rect`, but we need extra precision. A Rect can only hold **whole numbers**, so movement like `0.45` would be lost. We keep a more precise number `bird_y` (a **float**) and a speed `bird_vy`, then copy `int(bird_y)` into the Rect.", "Draw the bird as a yellow circle with an eye, centered on the Rect: `bird.center`."], help: ["loop", "rectobj"], code: FL1[0],
        type: "Type the loop. Make `bird`, `bird_y` and `bird_vy`. Draw the circles.", chk: [["a bird Rect", /bird\s*=\s*pygame\.Rect\(/], ["bird_y = 150.0 and bird_vy = 0.0", /bird_y\s*=\s*150\.0[\s\S]*bird_vy\s*=\s*0\.0/], ["the bird is drawn at its center", /pygame\.draw\.circle\(\s*screen\s*,[^\n]*bird\.center\s*,\s*14\s*\)/]],
        run: "A yellow bird hangs in a blue sky." },
      { title: "Gravity", say: ["Gravity makes the speed **change** every frame, not the position. Each frame: (1) add a little to the downward speed `bird_vy += 0.45`, then (2) move the bird by that speed `bird_y += bird_vy`.", "That is why the bird falls **slowly at first and then faster and faster**, just like a real falling object."], help: ["coords"], code: FL1[1],
        type: "Type the three gravity lines before `screen.fill`.", chk: [["bird_vy += 0.45", /bird_vy\s*\+=\s*0\.45/], ["bird_y += bird_vy", /bird_y\s*\+=\s*bird_vy/], ["bird.y = int(bird_y)", /bird\.y\s*=\s*int\(\s*bird_y\s*\)/]],
        run: "The bird drops, speeding up, and falls off the bottom.",
        do: ["Change `0.45` to `0.2` and run it. Then to `1.0`. What does gravity do to the feel of the game? Set it back to `0.45`."] },
      { title: "Flap, and wait for the player", say: ["A flap is a single press, so use a `KEYDOWN` event. A flap **sets the speed** to a negative number (up): `bird_vy = -7.5`. Gravity then pulls it back down, so it rises, slows, and falls.", "You write `event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE` on one line using `and`.", "There is a problem: the bird starts falling the moment you press Run, before you are ready. Real games **wait for the player**. A variable `started` starts as `False`. The first flap turns it `True`. Gravity only works `if started:`. Until then, show a hint."], help: ["events", "held", "fonts"], code: FL1[2], reindent: true,
        type: "Add `font` and `started = False`. Type the `KEYDOWN` block in the events. Put the three gravity lines inside `if started:` (select them and press Tab). Type the `if not started:` hint at the end of the drawing.", chk: [["started = False", /started\s*=\s*False/], ["a flap on the space bar", /if\s+event\.type\s*==\s*pygame\.KEYDOWN\s+and\s+event\.key\s*==\s*pygame\.K_SPACE\s*:/], ["the flap starts the game", /started\s*=\s*True\s*\n\s+bird_vy\s*=\s*-\s*7\.5/], ["gravity only works once started", /if\s+started(\s+and\s+not\s+game_over)?\s*:/], ["a hint while waiting", /if\s+not\s+started\s*:\s*\n\s+hint\s*=\s*font\.render\(/]],
        run: "The bird waits for you. Tap the **space bar** to start, then keep tapping to stay in the air. It is harder than it looks!" },
      { title: "Hit the floor or ceiling", say: ["If the bird touches the top (`bird.top < 0`) or the bottom (`bird.bottom > 320`) of the screen, the game is over.", "Add `game_over = False`, and make the update block run only `if started and not game_over:` so the bird stops. You did the same thing in Meteor Dodge."], help: ["states"], code: FL1[3], reindent: true,
        type: "Add `game_over = False` to the setup. Change `if started:` to `if started and not game_over:`. Type the `if bird.top < 0 or ...` block inside it.", chk: [["game_over = False", /game_over\s*=\s*False/], ["if started and not game_over:", /if\s+started\s+and\s+not\s+game_over\s*:/], ["the floor and ceiling check", /if\s+bird\.top\s*<\s*0\s+or\s+bird\.bottom\s*>\s*320\s*:\s*\n\s+game_over\s*=\s*True/]],
        run: "Fall to the ground. The bird freezes there." },
      { title: "Game Over and flap again", say: ["Show **GAME OVER** when `game_over` is true. Then reuse the **space bar** for restarting: if the game is over, a press resets the bird; otherwise it flaps.", "`if game_over: ... else: ...` chooses what one key press does."], help: ["fonts", "states"], code: FL1[4],
        type: "Add `big_font`. Change the space bar block into the `if game_over:` / `else:` version. Type the GAME OVER block at the end.", chk: [["a big font", /big_font\s*=\s*pygame\.font\.Font\(/], ["restart branch resets the bird and waits again", /if\s+game_over\s*:\s*\n\s+bird_y\s*=\s*150\.0\s*\n\s+bird_vy\s*=\s*0\.0\s*\n\s+game_over\s*=\s*False\s*\n\s+started\s*=\s*False/], ["the else branch flaps", /else\s*:\s*\n\s+started\s*=\s*True\s*\n\s+bird_vy\s*=\s*-\s*7\.5/], ["the GAME OVER text", /big_font\.render\(\s*"GAME OVER"/]],
        run: "Crash. Press **space** to reset the bird, then press it again to start a new flight." }
    ],
    finish: ["Play 10 rounds. What is the longest you can stay in the air?", "Adjust gravity or the flap strength until it feels the way you like."],
    challenges: ["Make the bird **tilt**: draw an extra small triangle for the beak, and flip it up when the bird rises.", "Add a **ground** (a green rectangle at the bottom) and make hitting it the floor instead of the screen edge.", "Add a flap **cooldown** so spamming space doesn't help.", "Change the sky color as the game goes on."],
    tips: {},
    recap: "Physics in games is just two lines each frame: **change the speed, then change the position by the speed**. A flap sets the speed. The same `game_over` pattern works in every game.",
    next: "**Next:** Walkthrough 20 adds **pipes**, collisions and a **score**."
  });

  var FL2 = [flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1 }), flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1, pipes: 1 }), flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1, pipes: 2 }), flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1, pipes: 3 }), flappy({ gravity: 1, flap: 1, limits: 1, over: 1, restart: 1, pipes: 3, best: 1 })];
  P.add({
    num: 20, title: "Flappy Bird 2: Pipes and Score",
    intro: ["Finish Flappy Bird. You will add **pipes** that scroll toward the bird with a gap to fly through, **collisions**, a **score**, and a **best score**.",
      "Each pipe is made of **two Rects** (one on top, one on the bottom), and a flag that remembers if it has been scored. A **dictionary** keeps those three things together under labels."],
    learn: ["dictionaries: a label for each value", "a list of dictionaries", "spawning on a timer", "colliding with two Rects", "scoring when an object passes the player", "a best score"],
    firstTips: ["dicts", "lists"],
    stages: [
      { title: "Bring your code with you", say: ["Copy your finished program from **Walkthrough 19** (Ctrl + A, Ctrl + C) and paste it here (Ctrl + V)."], help: ["bring19"], code: FL2[0], bring: true,
        type: "Paste your finished Walkthrough 19 code into this code box.", chk: [["the bird", /bird\s*=\s*pygame\.Rect\(/], ["gravity", /bird_vy\s*\+=\s*0\.45/], ["game_over", /game_over\s*=\s*False/]],
        run: "A bird you can flap. No pipes yet." },
      { title: "Pipes that scroll", say: ["A pipe has a **top** part and a **bottom** part with a gap between them, and it needs to remember if it has been **scored**. Three things that belong together: a **dictionary**!", "`{\"top\": ..., \"bottom\": ..., \"scored\": False}` is a dictionary. Each value has a label. You read one with `p[\"top\"]`.", "Every 90 frames (1.5 seconds), make a new pipe at the right edge with a gap at a random height. Then move all the pipes left (`x -= 3`) and remove the ones that are off the left edge. Draw both Rects of every pipe.", "The gap is 110 pixels tall (55 above and 55 below `gap`). The top Rect ends at `gap - 55` and the bottom Rect starts at `gap + 55`."], help: ["dicts", "randomtips", "removebug"], code: FL2[1],
        type: "Add `import random`, `pipes = []` and `spawn_timer = 0`. Inside the update block, type the spawn code and the pipe `for` loop. Type the pipe drawing loop right after `screen.fill`.", chk: [["import random", /^import random\s*$/m], ["pipes = [] and spawn_timer = 0", /pipes\s*=\s*\[\s*\][\s\S]*spawn_timer\s*=\s*0/], ["a pipe dictionary with top, bottom and scored", /pipes\.append\(\s*\{\s*"top"\s*:[\s\S]*"bottom"\s*:[\s\S]*"scored"\s*:\s*False\s*\}\s*\)/], ["moving both parts of the pipe", /p\["top"\]\.x\s*-=\s*3\s*\n\s+p\["bottom"\]\.x\s*-=\s*3/], ["removing pipes that leave the screen", /if\s+p\["top"\]\.right\s*<\s*0\s*:\s*\n\s+pipes\.remove\(\s*p\s*\)/], ["drawing the pipes", /for\s+p\s+in\s+pipes\s*:\s*\n\s+pygame\.draw\.rect\([^\n]*p\["top"\]\s*\)[\s\S]*p\["bottom"\]/]],
        run: "Green pipes with gaps scroll left across the screen. The bird flies right through them for now." },
      { title: "Crash into a pipe", say: ["The bird loses if it touches the top **or** the bottom Rect of any pipe. Check inside the pipe loop:", "`if bird.colliderect(p[\"top\"]) or bird.colliderect(p[\"bottom\"]):`"], help: ["collide"], code: FL2[2],
        type: "Type the collision `if` at the end of the pipe `for` loop.", chk: [["a collision with either part of the pipe", /if\s+bird\.colliderect\(\s*p\["top"\]\s*\)\s+or\s+bird\.colliderect\(\s*p\["bottom"\]\s*\)\s*:\s*\n\s+game_over\s*=\s*True/]],
        run: "Fly into a pipe. The game freezes and says **GAME OVER**." },
      { title: "Score a point for each pipe", say: ["A pipe has been **passed** when its right edge is to the left of the bird's left edge: `p[\"top\"].right < bird.left`.", "Only score it **once**. Check `not p[\"scored\"]`, then set it to `True` so the same pipe can't score again.", "Add a `score` variable and show it. Also reset it when the game restarts."], help: ["dicts", "fonts"], code: FL2[3],
        type: "Add `score = 0`. Type the `if not p[\"scored\"] ...` block at the end of the pipe loop. Add `score = 0` to the restart. Type the score text.", chk: [["score = 0", /score\s*=\s*0/], ["scoring a pipe once", /if\s+not\s+p\["scored"\]\s+and\s+p\["top"\]\.right\s*<\s*bird\.left\s*:\s*\n\s+p\["scored"\]\s*=\s*True\s*\n\s+score\s*\+=\s*1/], ["the score text", /font\.render\(\s*"Score: "/]],
        run: "The score goes up each time you pass a pipe." },
      { title: "A best score", say: ["Add a `best` variable that is **not** reset when you restart. When the game ends, if `score > best`, save the new best.", "Show both numbers."], code: FL2[4],
        type: "Add `best = 0`. Type the `if game_over and score > best:` block at the end of the update. Add the best to your text.", chk: [["best = 0", /best\s*=\s*0/], ["saving a new best", /if\s+game_over\s+and\s+score\s*>\s*best\s*:\s*\n\s+best\s*=\s*score/], ["the best score is shown", /"   Best: "\s*\+\s*str\(\s*best\s*\)/]],
        run: "Play a few rounds. **Best** keeps your top score even after restarting." }
    ],
    finish: ["Play for 5 minutes. What is your best score?", "Pass 10 pipes in a row. Is it possible?"],
    challenges: ["Make the pipes **faster** or the gap **smaller** as the score increases.", "Add **two different pipe colors**: store a color in each pipe dictionary.", "Add **clouds** in the background that scroll slower than the pipes.", "Add a **medal**: show Bronze, Silver or Gold on the game over screen depending on the score."],
    tips: { bring19: bring(19, FL2[0]), dicts: { title: "Dictionaries", sections: [
      { p: "A **list** finds things by position (`items[0]`). A **dictionary** finds things by a **label** (called a key). Use a dictionary when one object has several different parts." },
      { ex: ["pipe = {\"top\": pygame.Rect(480, 0, 50, 100), \"scored\": False}", "print(pipe[\"scored\"])          # False", "pipe[\"scored\"] = True            # change a value", "pipe[\"top\"].x -= 3              # use a value (a Rect) and change it", "pipes = []                        # a list of dictionaries", "pipes.append(pipe)"] },
      { warn: "The labels are text, so they need quotes: `p[\"top\"]`. If you forget the quotes, Python thinks `top` is a variable and shows a NameError." }
    ] } },
    recap: "A **dictionary** groups labeled values for one object. A list of dictionaries is a list of objects. Games run physics by changing speeds and positions each frame, and spawn, move, collide and remove with the same pattern every time.",
    next: "**Next:** you have built six games. Now you will learn how to **organize** a bigger game: states, menus and **functions**."
  });
})(typeof window !== "undefined" ? window : globalThis);
