/* APPENDIX A, PART 1: pygame basics (walkthroughs 1 to 7). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);

  /* ================================================================= 1. Your First Window ================ */
  var W1_1 = `import asyncio
import pygame

pygame.init()
`;
  var W1_2 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("My First Window")
`;
  var W1_3 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("My First Window")

screen.fill((30, 60, 120))
pygame.display.flip()

await asyncio.sleep(3)
pygame.quit()
`;
  var W1_4 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("My First Window")

background = (30, 60, 120)
screen.fill(background)
pygame.display.flip()

await asyncio.sleep(3)
pygame.quit()
`;
  var W1_5 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("My First Window")

background = (30, 60, 120)
screen.fill(background)
pygame.draw.circle(screen, (255, 200, 0), (240, 160), 50)
pygame.display.flip()

await asyncio.sleep(3)
pygame.quit()
`;
  P.add({
    num: 1, title: "Your First Window",
    intro: ["**Welcome to Appendix A.** You are going to build real video games with **pygame**, a Python library that draws graphics, reads the keyboard and mouse, and runs a game loop. Everything you build here runs right in this editor, in your browser.",
      "In this first walkthrough you will make a window, color it, and draw a circle in it. It is small, but every game you build in this appendix starts with these same lines.",
      "Here is where the whole appendix is going. You will build **Meteor Dodge**, **Whack-a-Mole**, **Pong**, **Snake**, a **Space Shooter**, and **Flappy Bird**, one small piece at a time. Then you will design your own game."],
    learn: ["import a library", "pygame.init()", "a display window", "filling the screen with an RGB color", "drawing a shape", "pygame.display.flip()"],
    firstTips: ["typing", "stopgame"],
    stages: [
      { title: "Bring in pygame", say: ["A **library** is code that someone else wrote so you don't have to. `import pygame` brings the pygame library into your program. `pygame.init()` starts it up.", "The `import asyncio` line is special to this editor. You will see why in the next walkthrough."], help: ["whyasync"], code: W1_1,
        type: "Type the **green** lines.", chk: [["import pygame", /^import pygame\s*$/], ["import asyncio", /^import asyncio\s*$/], ["pygame.init()", /pygame\.init\(\)/]],
        run: "The Output box prints a line like `pygame-ce 2.4.1`. That means pygame is loaded. Nothing is drawn yet." },
      { title: "Open a window", say: ["`pygame.display.set_mode` makes the game window. The two numbers are its **width** and **height** in pixels. We use `480` by `320` for every game in this appendix.", "The window is saved in a variable named `screen`. Everything you draw is drawn onto `screen`."], help: ["coords"], code: W1_2,
        type: "Type the two new **green** lines under `pygame.init()`.", chk: [["screen = pygame.display.set_mode((480, 320))", /screen\s*=\s*pygame\.display\.set_mode\(\s*\(\s*\d+\s*,\s*\d+\s*\)\s*\)/], ["a window title with set_caption", /pygame\.display\.set_caption\(\s*["'].*["']\s*\)/]],
        run: "A black game screen appears for an instant and closes. The program ended, so the window closed with it." },
      { title: "Color it and show it", say: ["`screen.fill((30, 60, 120))` paints the whole window one color. A color is three numbers from 0 to 255 for **red, green and blue**.", "Drawing happens on a hidden picture. `pygame.display.flip()` shows that picture on your screen. Think of it as turning the page.", "`await asyncio.sleep(3)` waits three seconds so you can see the window. `pygame.quit()` shuts pygame down."], help: ["colors", "whyasync"], code: W1_3,
        type: "Type the new **green** lines at the bottom.", chk: [["screen.fill with a color", /screen\.fill\(/], ["pygame.display.flip()", /pygame\.display\.flip\(\)/], ["await asyncio.sleep(...)", /await\s+asyncio\.sleep\(\s*\d+(\.\d+)?\s*\)/], ["pygame.quit()", /pygame\.quit\(\)/]],
        run: "You should see a **blue** window for 3 seconds. Then the output says **Game over**." },
      { title: "Give your color a name", say: ["Numbers like `(30, 60, 120)` are hard to remember. Store the color in a variable with a good name, then use the name.", "Notice that two lines changed. They are green again."], code: W1_4,
        type: "Add the `background` line, and change the `fill` line so it uses `background`.", chk: [["a variable named background", /background\s*=\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/], ["screen.fill(background)", /screen\.fill\(\s*background\s*\)/]],
        do: ["Change the three numbers in `background` and run it. Try `(200, 40, 40)`, then `(20, 160, 60)`, then `(255, 255, 255)`. **Which number controls how much red?**"],
        run: "The window is the color you chose." },
      { title: "Draw your first shape", say: ["`pygame.draw.circle(screen, color, (x, y), radius)` draws a circle. The `(x, y)` is the **center**. `(240, 160)` is the middle of a 480 by 320 window.", "Draw the circle **after** you fill the screen but **before** `flip()`. Order matters: fill, draw, flip."], help: ["draw", "coords"], code: W1_5,
        type: "Type the green `pygame.draw.circle` line.", chk: [["pygame.draw.circle(screen, ...)", /pygame\.draw\.circle\(\s*screen\s*,/]],
        run: "A yellow circle sits in the middle of a blue window." }
    ],
    finish: ["Run your finished program one more time.", "Change the `3` in `await asyncio.sleep(3)` to `6` and run it. How long does the window stay now?"],
    challenges: ["Make the window `640` by `400` by changing the two numbers in `set_mode`. Where is the center now? Move the circle there.", "Draw a second circle in a different color and a different spot.", "Change the window title to your own name.", "Move the circle to the top-left corner. What are its `(x, y)` numbers?"],
    recap: "You imported a library, opened a window, filled it with an RGB color, drew a circle, and used `flip()` to show your drawing. Every pygame game starts exactly like this.",
    next: "**Next:** your window disappears after 3 seconds. In Walkthrough 2 you will keep it open with the **game loop**, the heart of every video game."
  });

  /* ================================================================= 2. The Game Loop ================ */
  var W2_1 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()
`;
  var W2_2 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()

running = True
while running:
    screen.fill((30, 60, 120))
    pygame.display.flip()
    await asyncio.sleep(0)

pygame.quit()
`;
  var W2_3 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((30, 60, 120))
    pygame.display.flip()
    await asyncio.sleep(0)

pygame.quit()
`;
  var W2_4 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((30, 60, 120))
    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`;
  var W2_5 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()

shade = 0
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    shade = (shade + 1) % 256
    screen.fill((shade, 60, 120))

    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`;
  var W2_6 = `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Game Loop")
clock = pygame.time.Clock()

shade = 0
frame = 0
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    shade = (shade + 1) % 256
    screen.fill((shade, 60, 120))

    frame += 1
    if frame % 60 == 0:
        print(frame // 60, "seconds have passed")

    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`;
  P.add({
    num: 2, title: "The Game Loop",
    intro: ["A video game is a loop. It runs again and again, about **60 times every second**. Each time around it checks what the player did, updates the game, draws everything, and shows the picture. One trip around the loop is called a **frame**.",
      "In this walkthrough you will build that loop and prove to yourself that it really runs 60 times a second, by making a color change smoothly."],
    learn: ["the game loop", "events and pygame.QUIT", "frames and clock.tick(60)", "why games use await asyncio.sleep(0) here", "a counter variable"],
    firstTips: ["loop", "typing"],
    stages: [
      { title: "Set up", say: ["Start with the setup lines you know from Walkthrough 1. This time you add `clock`. The clock keeps your game running at a steady speed.", "You do not need `await asyncio.sleep(3)` or `pygame.quit()` yet. They go at the very bottom later."], code: W2_1,
        type: "Type the six **green** lines.", chk: [["import asyncio and pygame", /import asyncio[\s\S]*import pygame/], ["a screen", /set_mode\(/], ["clock = pygame.time.Clock()", /clock\s*=\s*pygame\.time\.Clock\(\)/]] },
      { title: "Make the loop", say: ["`while running:` repeats everything indented under it, over and over, until `running` becomes `False`.", "Inside the loop we fill, flip, and then `await asyncio.sleep(0)`. That last line gives the browser a moment to actually draw the frame. It must be the **last line inside the loop**.", "Don't forget the `pygame.quit()` after the loop. It is **not** indented. It runs once, when the loop ends."], help: ["whyasync", "loop"], code: W2_2,
        type: "Type the new **green** lines. Be careful: the three lines inside the loop are indented 4 spaces.", chk: [["running = True", /running\s*=\s*True/], ["while running:", /while\s+running\s*:/], ["await asyncio.sleep(0) inside the loop", /^[ \t]+await\s+asyncio\.sleep\(\s*0\s*\)/], ["pygame.quit() at the bottom", /^pygame\.quit\(\)/]],
        run: "A blue window appears and **stays open**. Click **Stop game** to close it. (The window can't close itself yet, because we haven't taught it how.)" },
      { title: "Let the player close the window", say: ["`pygame.event.get()` gives you everything that has happened since the last frame: keys pressed, the mouse moved, the window closed.", "The `for` loop looks at each event. If its type is `pygame.QUIT`, we set `running = False`, and the loop ends."], help: ["events"], code: W2_3,
        type: "Type the four new **green** lines, right under `while running:`.", chk: [["for event in pygame.event.get():", /for\s+event\s+in\s+pygame\.event\.get\(\)\s*:/], ["if event.type == pygame.QUIT:", /if\s+event\.type\s*==\s*pygame\.QUIT\s*:/], ["running = False", /running\s*=\s*False/]],
        run: "It looks the same, but now the game handles the close request. (In this editor, you will still use **Stop game**.)" },
      { title: "Keep a steady speed", say: ["`clock.tick(60)` tells pygame \"never run faster than 60 frames per second.\" Without it, a fast computer would run your game too fast, and a slow one too slow.", "From now on, every game loop in this appendix ends with `pygame.display.flip()`, `clock.tick(60)`, and `await asyncio.sleep(0)`, in that order."], help: ["clocktime"], code: W2_4,
        type: "Type the new **green** `clock.tick(60)` line.", chk: [["clock.tick(60)", /clock\.tick\(\s*60\s*\)/]],
        run: "No visible change. The speed is now steady." },
      { title: "Prove the loop is running", say: ["A loop that draws the same thing every time doesn't look alive. Let's make something change **every frame**.", "`shade` starts at 0. Each frame we add 1, and `% 256` wraps it back to 0 after 255. That is the **red** number in the color."], help: ["colors"], code: W2_5,
        type: "Add `shade = 0` above the loop, and the two **green** lines inside the loop. Remember that `screen.fill((30, 60, 120))` has changed.", chk: [["shade = 0", /shade\s*=\s*0/], ["shade = (shade + 1) % 256", /shade\s*=\s*\(\s*shade\s*\+\s*1\s*\)\s*%\s*256/], ["screen.fill uses shade", /screen\.fill\(\s*\(\s*shade\s*,/]],
        run: "The window glides from teal to purple to pink and starts over, smoothly. Your loop is changing the color 60 times a second." },
      { title: "Count seconds", say: ["`frame` counts the trips around the loop. `frame % 60 == 0` is true once every 60 frames, which is once every second. (`%` is the remainder, so `120 % 60` is `0`.)", "`frame // 60` is the number of whole seconds. The `print` writes to the **Output** box."], code: W2_6,
        type: "Type the new **green** lines.", chk: [["frame = 0", /frame\s*=\s*0/], ["frame += 1", /frame\s*\+=\s*1/], ["if frame % 60 == 0:", /if\s+frame\s*%\s*60\s*==\s*0\s*:/], ["print(...)", /print\(/]],
        run: "The Output box shows `1 seconds have passed`, then `2 seconds...` one per second. That proves your loop runs 60 times a second." }
    ],
    finish: ["Run it and watch for 10 seconds. Does the printed number match a real clock?", "Press **Stop game** when you are done."],
    challenges: ["Change `clock.tick(60)` to `clock.tick(10)`. What happens to the color? Change it back.", "Make the color change faster by changing `shade + 1` to `shade + 3`.", "Change which number in the color is the one that changes (`(30, shade, 120)`).", "Print `\"Half a second\"` when `frame % 30 == 0`."],
    recap: "A game loop does the same jobs every frame: handle events, update, draw, flip. It runs about 60 times a second. `clock.tick(60)` keeps it steady, and `await asyncio.sleep(0)` lets the browser draw.",
    next: "**Next:** you will draw lots of shapes: rectangles, lines, ovals and polygons."
  });

  /* ================================================================= 3. Drawing Shapes ================ */
  var SK = function (extra, colors) { return `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Sunny Day")
clock = pygame.time.Clock()
` + (colors || "") + `
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

` + extra + `
    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`; };
  var W3_1 = SK("    screen.fill((135, 206, 235))\n");
  var W3_2 = SK("    screen.fill((135, 206, 235))\n    pygame.draw.rect(screen, (60, 160, 60), (0, 240, 480, 80))\n");
  var W3_3 = SK("    screen.fill((135, 206, 235))\n    pygame.draw.rect(screen, (60, 160, 60), (0, 240, 480, 80))\n    pygame.draw.circle(screen, (255, 220, 0), (80, 70), 35)\n");
  var W3_4 = SK("    screen.fill((135, 206, 235))\n    pygame.draw.rect(screen, (60, 160, 60), (0, 240, 480, 80))\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (140, 30), 4)\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (150, 70), 4)\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (140, 110), 4)\n    pygame.draw.circle(screen, (255, 220, 0), (80, 70), 35)\n");
  var W3_5 = SK("    screen.fill((135, 206, 235))\n    pygame.draw.polygon(screen, (110, 110, 130), [(250, 240), (350, 110), (450, 240)])\n    pygame.draw.rect(screen, (60, 160, 60), (0, 240, 480, 80))\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (140, 30), 4)\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (150, 70), 4)\n    pygame.draw.line(screen, (255, 220, 0), (80, 70), (140, 110), 4)\n    pygame.draw.circle(screen, (255, 220, 0), (80, 70), 35)\n    pygame.draw.ellipse(screen, (255, 255, 255), (330, 30, 110, 40))\n");
  var W3_6 = SK("    screen.fill(SKY)\n    pygame.draw.polygon(screen, ROCK, [(250, 240), (350, 110), (450, 240)])\n    pygame.draw.rect(screen, GRASS, (0, 240, 480, 80))\n    pygame.draw.line(screen, SUN, (80, 70), (140, 30), 4)\n    pygame.draw.line(screen, SUN, (80, 70), (150, 70), 4)\n    pygame.draw.line(screen, SUN, (80, 70), (140, 110), 4)\n    pygame.draw.circle(screen, SUN, (80, 70), 35)\n    pygame.draw.ellipse(screen, WHITE, (330, 30, 110, 40))\n", "\nSKY = (135, 206, 235)\nGRASS = (60, 160, 60)\nSUN = (255, 220, 0)\nROCK = (110, 110, 130)\nWHITE = (255, 255, 255)\n");
  P.add({
    num: 3, title: "Drawing Shapes",
    intro: ["Games are made of shapes. In this walkthrough you will paint a **Sunny Day** scene using rectangles, circles, lines, ovals and polygons. You will also learn the pygame **coordinate system**, which is a little upside down compared to math class.",
      "You will also learn why the **order** you draw things in matters, and how to give colors names so your code is easy to read."],
    learn: ["x, y coordinates (y goes DOWN)", "pygame.draw.rect, circle, line, ellipse, polygon", "draw order", "named color variables"],
    firstTips: ["coords", "draw", "colors"],
    stages: [
      { title: "Type the game loop", say: ["Every program starts with the same skeleton. Type it again from memory if you can. (The **loop** help shows it if you get stuck.)", "The only new thing is the sky: `screen.fill((135, 206, 235))` is a light blue."], help: ["loop", "typing"], code: W3_1,
        type: "Type the whole program, with the sky fill inside the loop.", chk: [["while running:", /while\s+running\s*:/], ["the QUIT check", /pygame\.QUIT/], ["flip, tick and sleep(0) in the loop", /flip\(\)[\s\S]*clock\.tick\(\s*60\s*\)[\s\S]*await\s+asyncio\.sleep\(\s*0\s*\)/], ["a sky color", /screen\.fill\(/]],
        run: "A light blue window stays open." },
      { title: "Draw the grass (a rectangle)", say: ["`pygame.draw.rect(screen, color, (x, y, width, height))` draws a rectangle. `(x, y)` is its **top-left** corner.", "Our window is 320 tall. A rectangle that starts at `y = 240` and is 80 tall reaches the bottom exactly."], help: ["draw", "coords"], code: W3_2,
        type: "Type the new **green** line under `screen.fill`.", chk: [["pygame.draw.rect(screen, ...)", /pygame\.draw\.rect\(\s*screen\s*,/]],
        run: "A green strip of grass runs along the bottom." },
      { title: "Add the sun (a circle)", say: ["`pygame.draw.circle(screen, color, (x, y), radius)`. The `(x, y)` is the **center** of the circle, not the corner."], code: W3_3,
        type: "Type the new circle line.", chk: [["pygame.draw.circle(screen, ...)", /pygame\.draw\.circle\(\s*screen\s*,/]],
        run: "A yellow sun appears in the top-left." },
      { title: "Give the sun rays (lines)", say: ["`pygame.draw.line(screen, color, (x1, y1), (x2, y2), thickness)` draws a line between two points.", "All three rays start at the sun's center, `(80, 70)`. They are drawn **before** the circle, so the circle covers the starts of the lines. **Order matters!**"], help: ["draw"], code: W3_4,
        type: "Type the three `line` lines **above** the sun circle line.", chk: [["three pygame.draw.line calls", /pygame\.draw\.line\(\s*screen\s*,/, 3]],
        run: "Three rays stick out from the sun.",
        do: ["Move the `circle` line **above** the three `line` lines and run it. What changed? Why? (Then put it back.)"] },
      { title: "Add a mountain and a cloud", say: ["`pygame.draw.polygon(screen, color, [point, point, point])` draws any shape from a list of corner points. Three points make a triangle: a mountain.", "`pygame.draw.ellipse(screen, color, (x, y, w, h))` draws an oval that fits inside that rectangle.", "Type the mountain **before** the grass so the grass is drawn on top of its bottom edge."], help: ["draw", "colors"], code: W3_5,
        type: "Type the `polygon` line between `screen.fill` and the grass. Type the `ellipse` line at the end of the drawing lines.", chk: [["pygame.draw.polygon(...)", /pygame\.draw\.polygon\(\s*screen\s*,/], ["pygame.draw.ellipse(...)", /pygame\.draw\.ellipse\(\s*screen\s*,/]],
        run: "A gray mountain rises behind the grass, and a white cloud floats in the sky." },
      { title: "Name your colors", say: ["Your code now has the same color numbers in many places, like `(255, 220, 0)` for the sun. If you wanted a different sun color, you would have to change four lines.", "Programmers give colors names at the top and use the names. Capital letters mean \"this never changes\" (a **constant**).", "Many lines are green because many lines changed."], help: ["colors"], code: W3_6,
        type: "Add the five color variables above the loop. Then change every color number in your drawing lines to the matching name.", chk: [["a color named SKY", /SKY\s*=\s*\(/], ["a color named GRASS", /GRASS\s*=\s*\(/], ["a color named SUN", /SUN\s*=\s*\(/], ["screen.fill(SKY)", /screen\.fill\(\s*SKY\s*\)/], ["the sun uses SUN, 4 times", /,\s*SUN\s*,/, 4]],
        run: "The scene looks exactly the same. Only the code got neater." }
    ],
    finish: ["Run your scene. Does it look like a sunny day?", "Change `SUN` at the top to `(255, 120, 0)` and run it. How many lines did you have to change?"],
    challenges: ["Add a second cloud with another `ellipse`.", "Add a tree: a brown `rect` for the trunk and a green `circle` on top.", "Change `SKY` to a night color like `(10, 10, 50)`. Change the sun to a moon color. Add some white one-pixel stars with `pygame.draw.circle(screen, WHITE, (x, y), 2)`.", "Draw the grass **after** the sun. Does anything change? (Then change it back.)"],
    recap: "You can draw with `rect`, `circle`, `line`, `ellipse` and `polygon`. Positions are `(x, y)` with `(0, 0)` at the top-left and **y growing downward**. Things you draw later appear on top. Named colors make code readable.",
    next: "**Next:** you will add a house to this scene and put **text** on the screen."
  });

  /* ================================================================= 4. Text and a Scene ================ */
  var HOUSE_COLORS = "\nSKY = (135, 206, 235)\nGRASS = (60, 160, 60)\nSUN = (255, 220, 0)\nROCK = (110, 110, 130)\nWHITE = (255, 255, 255)\n";
  var BASE_DRAW = "    screen.fill(SKY)\n    pygame.draw.polygon(screen, ROCK, [(250, 240), (350, 110), (450, 240)])\n    pygame.draw.rect(screen, GRASS, (0, 240, 480, 80))\n";
  var SUNPART = "    pygame.draw.line(screen, SUN, (80, 70), (140, 30), 4)\n    pygame.draw.line(screen, SUN, (80, 70), (150, 70), 4)\n    pygame.draw.line(screen, SUN, (80, 70), (140, 110), 4)\n    pygame.draw.circle(screen, SUN, (80, 70), 35)\n    pygame.draw.ellipse(screen, WHITE, (330, 30, 110, 40))\n";
  var HOUSE1 = "    pygame.draw.rect(screen, WALL, (160, 130, 160, 110))\n    pygame.draw.polygon(screen, ROOF, [(145, 130), (240, 60), (335, 130)])\n";
  var HOUSE2 = "    pygame.draw.rect(screen, DOOR, (225, 175, 30, 65))\n    pygame.draw.rect(screen, GLASS, (180, 155, 30, 30))\n    pygame.draw.rect(screen, BLACK, (180, 155, 30, 30), 2)\n";
  var W4_0 = W3_6;
  var W4_1 = SK(BASE_DRAW + HOUSE1 + SUNPART, HOUSE_COLORS + "WALL = (230, 200, 150)\nROOF = (170, 50, 50)\n");
  var W4_2 = SK(BASE_DRAW + HOUSE1 + HOUSE2 + SUNPART, HOUSE_COLORS + "WALL = (230, 200, 150)\nROOF = (170, 50, 50)\nDOOR = (110, 70, 30)\nGLASS = (160, 220, 255)\nBLACK = (0, 0, 0)\n");
  var W4_3 = SK(BASE_DRAW + HOUSE1 + HOUSE2 + SUNPART + "\n    label = font.render(\"Home Sweet Home\", True, BLACK)\n    screen.blit(label, (20, 15))\n", HOUSE_COLORS + "WALL = (230, 200, 150)\nROOF = (170, 50, 50)\nDOOR = (110, 70, 30)\nGLASS = (160, 220, 255)\nBLACK = (0, 0, 0)\n\nfont = pygame.font.Font(None, 40)\n");
  var W4_4 = SK(BASE_DRAW + HOUSE1 + HOUSE2 + SUNPART + "\n    label = font.render(\"Home Sweet Home\", True, BLACK)\n    label_rect = label.get_rect(center=(240, 20))\n    screen.blit(label, label_rect)\n", HOUSE_COLORS + "WALL = (230, 200, 150)\nROOF = (170, 50, 50)\nDOOR = (110, 70, 30)\nGLASS = (160, 220, 255)\nBLACK = (0, 0, 0)\n\nfont = pygame.font.Font(None, 40)\n");
  P.add({
    num: 4, title: "Text and a Scene",
    intro: ["Time to add a house to your Sunny Day, and to learn how to write **text** on the game screen. Text is how a game shows a score, a title, and \"GAME OVER\".",
      "You will keep building on your finished scene from Walkthrough 3, so you don't have to retype it."],
    learn: ["building a bigger scene piece by piece", "rectangle outlines", "pygame.font and render()", "screen.blit()", "centering with get_rect"],
    firstTips: ["draw", "fonts"],
    stages: [
      { title: "Bring your Sunny Day with you", say: ["Open **Walkthrough 3** in the Assignment box. Click in the code box, press **Ctrl + A** to select everything, then **Ctrl + C** to copy.", "Switch back to **Walkthrough 4**, click in the empty code box, and press **Ctrl + V** to paste. (The editor only lets you paste your own code, which is exactly what this is.)", "If you didn't finish Walkthrough 3, the help button shows the finished program to type."], help: ["bring3"], code: W4_0, bring: true,
        type: "Paste your finished Walkthrough 3 code into this walkthrough's code box.", chk: [["the game loop", /while\s+running\s*:/], ["the SKY, GRASS and SUN colors", /SKY\s*=[\s\S]*GRASS\s*=[\s\S]*SUN\s*=/], ["the polygon, rect, circle and ellipse", /draw\.polygon[\s\S]*draw\.rect[\s\S]*draw\.circle[\s\S]*draw\.ellipse/]],
        run: "You should see your Sunny Day, the same as before." },
      { title: "Build the house", say: ["The house is two shapes: a **rectangle** for the walls and a **triangle polygon** for the roof.", "Add two new colors, `WALL` and `ROOF`, with your other colors. Then type the two drawing lines after the grass line, so the house is in front of the mountain."], help: ["draw", "colors"], code: W4_1,
        type: "Add the two colors above the loop. Add the two house lines after the grass.", chk: [["WALL and ROOF colors", /WALL\s*=\s*\([\s\S]*ROOF\s*=\s*\(/], ["a rect using WALL", /pygame\.draw\.rect\(\s*screen\s*,\s*WALL\s*,/], ["a polygon using ROOF", /pygame\.draw\.polygon\(\s*screen\s*,\s*ROOF\s*,/]],
        run: "A tan house with a red roof sits on the grass." },
      { title: "Add a door and a window", say: ["The window is **two** rectangles at the same spot: a light-blue filled one, then a black **outline** on top.", "To make an outline, add a number at the end of `pygame.draw.rect`. That number is the **line thickness**. A rectangle with no thickness is filled."], help: ["draw"], code: W4_2,
        type: "Add `DOOR`, `GLASS` and `BLACK` colors. Then type the three new rectangle lines under the roof line.", chk: [["DOOR, GLASS and BLACK colors", /DOOR\s*=[\s\S]*GLASS\s*=[\s\S]*BLACK\s*=/], ["a rectangle using DOOR", /draw\.rect\(\s*screen\s*,\s*DOOR\s*,/], ["an outline with a thickness number", /draw\.rect\(\s*screen\s*,\s*BLACK\s*,\s*\([^)]*\)\s*,\s*\d+\s*\)/]],
        run: "The house now has a door and a window with a black frame." },
      { title: "Write a title with text", say: ["Text takes two steps. First, `font.render(...)` makes a **picture of the words**. Then `screen.blit(picture, (x, y))` copies that picture onto the screen. (\"Blit\" means copy pixels.)", "Make the font **above the loop**, because you only need to make it once. Do the `render` and `blit` **inside the loop**, after the other drawing, so the words are on top.", "`True` makes the edges of the letters smooth. `BLACK` is the text color."], help: ["fonts"], code: W4_3,
        type: "Type the `font = ...` line above the loop. Type the two new lines at the end of the drawing, before `flip()`.", chk: [["font = pygame.font.Font(None, 40)", /font\s*=\s*pygame\.font\.Font\(\s*None\s*,\s*\d+\s*\)/], ["label = font.render(...)", /label\s*=\s*font\.render\(\s*["'].+["']\s*,\s*True\s*,/], ["screen.blit(label, ...)", /screen\.blit\(\s*label\s*,/]],
        run: "The words **Home Sweet Home** appear at the top left." },
      { title: "Center the text", say: ["Typing pixel positions to center text is hard. Let pygame do it. `label.get_rect(center=(240, 20))` makes a rectangle the size of the text whose **center** is at (240, 20). Then blit onto that rectangle.", "240 is half of 480, so the text is centered left to right."], help: ["fonts", "rectobj"], code: W4_4,
        type: "Add `label_rect = ...` and change the `blit` line so it uses `label_rect`.", chk: [["label_rect = label.get_rect(center=...)", /label_rect\s*=\s*label\.get_rect\(\s*center\s*=\s*\(/], ["screen.blit(label, label_rect)", /screen\.blit\(\s*label\s*,\s*label_rect\s*\)/]],
        run: "The title is centered across the top of the screen." }
    ],
    finish: ["Run your scene and check every piece: sky, mountain, grass, house, door, window, sun, cloud, title.", "Take a good look. You drew all of this with code."],
    challenges: ["Change the title to your own words and make the font bigger. Does it stay centered?", "Add a chimney (a small `rect`) behind the roof by drawing it **before** the roof polygon.", "Add a second house to the right with different colors. Which numbers did you change to move it?", "Add a line of smaller text under the title: your name. Use a second font: `small = pygame.font.Font(None, 24)`."],
    tips: { bring3: { title: "I did not finish Walkthrough 3", sections: [
      { p: "Type your Walkthrough 3 program from scratch. This is what it should look like:" },
      { ex: W3_6.replace(/\n+$/, "").split("\n") },
      { good: "You can also go back to Walkthrough 3 and finish it. Your work is saved in this browser." }
    ] } },
    recap: "`font.render(text, True, color)` makes a picture of text. `screen.blit(picture, position)` draws it. `get_rect(center=...)` centers it. A bigger scene is just more shapes, drawn in the right order.",
    next: "**Next:** in Walkthrough 5 your drawings finally **move**."
  });

  /* ================================================================= 5. Making Things Move ================ */
  var MV = function (vars, upd, draw) { return `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Bouncing Ball")
clock = pygame.time.Clock()
` + vars + `
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

` + upd + `    screen.fill((20, 20, 40))
` + draw + `
    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`; };
  var W5_1 = MV("\nx = 240\ny = 160\nradius = 20\n", "", "    pygame.draw.circle(screen, (255, 120, 0), (x, y), radius)\n");
  var W5_2 = MV("\nx = 240\ny = 160\nradius = 20\n", "    x += 3\n\n", "    pygame.draw.circle(screen, (255, 120, 0), (x, y), radius)\n");
  var W5_3 = MV("\nx = 240\ny = 160\nspeed_x = 3\nradius = 20\n", "    x += speed_x\n    if x > 480 - radius or x < radius:\n        speed_x = -speed_x\n\n", "    pygame.draw.circle(screen, (255, 120, 0), (x, y), radius)\n");
  var W5_4 = MV("\nx = 240\ny = 160\nspeed_x = 3\nspeed_y = 2\nradius = 20\n", "    x += speed_x\n    y += speed_y\n    if x > 480 - radius or x < radius:\n        speed_x = -speed_x\n    if y > 320 - radius or y < radius:\n        speed_y = -speed_y\n\n", "    pygame.draw.circle(screen, (255, 120, 0), (x, y), radius)\n");
  var W5_5 = MV("\nfont = pygame.font.Font(None, 30)\nx = 240\ny = 160\nspeed_x = 3\nspeed_y = 2\nradius = 20\nbounces = 0\n", "    x += speed_x\n    y += speed_y\n    if x > 480 - radius or x < radius:\n        speed_x = -speed_x\n        bounces += 1\n    if y > 320 - radius or y < radius:\n        speed_y = -speed_y\n        bounces += 1\n\n", "    pygame.draw.circle(screen, (255, 120, 0), (x, y), radius)\n    text = font.render(\"Bounces: \" + str(bounces), True, (255, 255, 255))\n    screen.blit(text, (10, 10))\n");
  var W5_6 = MV("\nfont = pygame.font.Font(None, 30)\nx = 240\ny = 160\nspeed_x = 3\nspeed_y = 2\nradius = 20\nbounces = 0\ncolors = [(255, 120, 0), (0, 200, 255), (120, 255, 120)]\ncolor_index = 0\n", "    x += speed_x\n    y += speed_y\n    if x > 480 - radius or x < radius:\n        speed_x = -speed_x\n        bounces += 1\n        color_index = (color_index + 1) % len(colors)\n    if y > 320 - radius or y < radius:\n        speed_y = -speed_y\n        bounces += 1\n        color_index = (color_index + 1) % len(colors)\n\n", "    pygame.draw.circle(screen, colors[color_index], (x, y), radius)\n    text = font.render(\"Bounces: \" + str(bounces), True, (255, 255, 255))\n    screen.blit(text, (10, 10))\n");
  P.add({
    num: 5, title: "Making Things Move",
    intro: ["How do things move in a game? **Variables.** Keep the ball's position in `x` and `y`. Each frame, change those numbers a little, and draw the ball in its new spot. Run that 60 times a second and the ball seems to move.",
      "In this walkthrough you will build a **bouncing ball** that counts its bounces and changes color each time it hits a wall."],
    learn: ["position and speed variables", "updating a variable every frame", "bouncing with if and negative speed", "a counter", "a list of colors and an index"],
    firstTips: ["coords", "clocktime"],
    stages: [
      { title: "A ball in a variable", say: ["Type the usual game loop. Put the ball's position in **variables** `x`, `y` and `radius`. Draw the circle using those variables instead of fixed numbers.", "The background color is filled **inside the loop** (more on that in a moment)."], help: ["loop"], code: W5_1,
        type: "Type the whole program. Draw the circle with `(x, y)` and `radius`.", chk: [["x, y and radius variables", /^x\s*=\s*\d+\s*$[\s\S]*^y\s*=\s*\d+\s*$[\s\S]*^radius\s*=\s*\d+\s*$/], ["the game loop", /while\s+running\s*:/], ["a circle drawn at (x, y)", /pygame\.draw\.circle\(\s*screen\s*,[^\n]*\(\s*x\s*,\s*y\s*\)\s*,\s*radius\s*\)/]],
        run: "An orange ball sits in the middle of a dark screen." },
      { title: "Make it move", say: ["`x += 3` means \"add 3 to x\". It is a shortcut for `x = x + 3`. Since the loop runs 60 times a second, the ball moves 180 pixels per second to the right.", "It will fly off the right side of the screen. That is OK for now."], code: W5_2,
        type: "Type `x += 3` inside the loop, before `screen.fill`.", chk: [["x += something, inside the loop", /^[ \t]+x\s*\+=\s*\w+/m]],
        run: "The ball slides right and leaves the screen.",
        do: ["Change `3` to `8`. Then to `-3`. Which way does the ball go with a negative number? (Then put it back to `3`.)"] },
      { title: "Bounce off the walls", say: ["A **speed variable** makes bouncing easy. Instead of adding 3 forever, add `speed_x`. To bounce, flip the sign: `speed_x = -speed_x` turns `3` into `-3` and `-3` into `3`.", "The right wall is at x = 480, but the **center** of the ball should turn around one `radius` early: `480 - radius`. The left wall check is `x < radius`.", "`or` means either one is enough."], help: ["clocktime"], code: W5_3,
        type: "Add `speed_x = 3` above the loop. Change `x += 3` into `x += speed_x`. Type the `if` and its line.", chk: [["speed_x = 3", /speed_x\s*=\s*3/], ["x += speed_x", /x\s*\+=\s*speed_x/], ["the if with or", /if\s+x\s*>\s*480\s*-\s*radius\s+or\s+x\s*<\s*radius\s*:/], ["speed_x = -speed_x", /speed_x\s*=\s*-\s*speed_x/]],
        run: "The ball bounces left and right forever." },
      { title: "Bounce up and down too", say: ["Do the same thing for `y`. The bottom wall is at y = 320.", "Notice that `speed_y` is `2`, not `3`. The ball now travels on a slant, so it doesn't just repeat the same path."], code: W5_4,
        type: "Add `speed_y = 2`, `y += speed_y`, and the second `if` with its line.", chk: [["speed_y = 2", /speed_y\s*=\s*2/], ["y += speed_y", /y\s*\+=\s*speed_y/], ["the y bounce if", /if\s+y\s*>\s*320\s*-\s*radius\s+or\s+y\s*<\s*radius\s*:/], ["speed_y = -speed_y", /speed_y\s*=\s*-\s*speed_y/]],
        run: "The ball bounces all around the screen like the DVD logo.",
        do: ["**Predict first:** what will happen if you move the `screen.fill((20, 20, 40))` line to just above the loop? Try it and see. (Then put it back.)"] },
      { title: "Count the bounces", say: ["A **counter** is a variable you add 1 to when something happens. Add 1 inside each `if` where the ball bounces.", "To show it: `str(bounces)` turns the number into text so you can join it with `\"Bounces: \"`. Then render and blit like in Walkthrough 4."], help: ["fonts"], code: W5_5,
        type: "Add `font` and `bounces = 0` above the loop. Add `bounces += 1` under each `speed_` flip. Type the `text` and `screen.blit` lines.", chk: [["bounces = 0", /bounces\s*=\s*0/], ["bounces += 1, in 2 places", /bounces\s*\+=\s*1/, 2], ["text = font.render(...)", /font\.render\(\s*["']Bounces: ["']\s*\+\s*str\(\s*bounces\s*\)/]],
        run: "The score at the top left goes up every time the ball hits a wall." },
      { title: "Change color on every bounce", say: ["A **list** holds several values in one variable. `colors` is a list of three colors. `colors[0]` is the first one. (Lists start counting at 0.)", "`color_index` says which color to use right now. Each bounce, move to the next one. `% len(colors)` wraps back to 0 after the last color."], help: ["lists"], code: W5_6,
        type: "Add the `colors` list and `color_index`. Add the `color_index = ...` line inside both `if`s. Change the circle so it uses `colors[color_index]`.", chk: [["colors = [...] a list of colors", /colors\s*=\s*\[\s*\(/], ["color_index = 0", /color_index\s*=\s*0/], ["color_index = (color_index + 1) % len(colors), twice", /color_index\s*=\s*\(\s*color_index\s*\+\s*1\s*\)\s*%\s*len\(\s*colors\s*\)/, 2], ["circle uses colors[color_index]", /draw\.circle\(\s*screen\s*,\s*colors\[\s*color_index\s*\]/]],
        run: "The ball changes color every time it bounces, and the bounce counter goes up." }
    ],
    finish: ["Run your finished bouncing ball. Watch the color and the counter.", "Add a fourth color to the `colors` list. Does it work without changing anything else? Why?"],
    challenges: ["Make a second ball. You will need new variables (`x2`, `y2`, ...). How much code did you copy? (In Walkthrough 10 you will learn a way that needs far less.)", "Change `speed_x` and `speed_y` so the ball moves very fast. Does it ever get stuck at an edge?", "Make the ball get a little **faster** each bounce: `speed_x = -speed_x` becomes a bounce that also adds 1 to the speed size.", "Make the ball start in a random spot with `random.randint`. (Look at the **Random numbers** help.)"],
    recap: "Moving things is just changing variables every frame. A negative speed moves the other way, so bouncing is `speed = -speed`. A counter variable counts events, and a list plus an index lets you cycle through values.",
    next: "**Next:** the player takes control. Walkthrough 6 is about **keyboard input**."
  });

  /* ================================================================= 6. Keyboard: Move a Player ================ */
  var PL = function (setup, events, update, draw) { return `import asyncio
import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Move the Player")
clock = pygame.time.Clock()
` + setup + `
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
` + events + `
` + update + `    screen.fill((20, 30, 50))
` + draw + `
    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`; };
  var W6_1 = PL("\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\n", "", "", "    pygame.draw.rect(screen, (255, 200, 0), player)\n");
  var KEYS1 = "    keys = pygame.key.get_pressed()\n    if keys[pygame.K_LEFT]:\n        player.x -= speed\n    if keys[pygame.K_RIGHT]:\n        player.x += speed\n    if keys[pygame.K_UP]:\n        player.y -= speed\n    if keys[pygame.K_DOWN]:\n        player.y += speed\n";
  var W6_2 = PL("\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\n", "", KEYS1 + "\n", "    pygame.draw.rect(screen, (255, 200, 0), player)\n");
  var W6_3 = PL("\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\n", "", KEYS1 + "    player.clamp_ip(screen.get_rect())\n\n", "    pygame.draw.rect(screen, (255, 200, 0), player)\n");
  var KEYS2 = "    keys = pygame.key.get_pressed()\n    if keys[pygame.K_LEFT] or keys[pygame.K_a]:\n        player.x -= speed\n    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:\n        player.x += speed\n    if keys[pygame.K_UP] or keys[pygame.K_w]:\n        player.y -= speed\n    if keys[pygame.K_DOWN] or keys[pygame.K_s]:\n        player.y += speed\n    player.clamp_ip(screen.get_rect())\n\n";
  var W6_4 = PL("\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\n", "", KEYS2, "    pygame.draw.rect(screen, (255, 200, 0), player)\n");
  var W6_5 = PL("\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\ncolors = [(255, 200, 0), (255, 80, 80), (80, 200, 255)]\ncolor_index = 0\n", "        if event.type == pygame.KEYDOWN:\n            if event.key == pygame.K_SPACE:\n                color_index = (color_index + 1) % len(colors)\n", KEYS2, "    pygame.draw.rect(screen, colors[color_index], player)\n");
  P.add({
    num: 6, title: "Keyboard: Move a Player",
    intro: ["A game isn't a game until the player can do something. In this walkthrough you will make a square that you move with the **arrow keys** (and **WASD**), keep it from leaving the window, and make it change color when you press the **space bar**.",
      "You will meet the `pygame.Rect`, the most useful object in pygame. You will use it in every game from here on."],
    learn: ["pygame.Rect", "pygame.key.get_pressed()", "if with or", "keeping an object on screen (clamp_ip)", "KEYDOWN events", "held keys vs single presses"],
    firstTips: ["rectobj", "held"],
    stages: [
      { title: "A player Rect", say: ["A `pygame.Rect(x, y, width, height)` remembers a rectangle. Our player is 40 pixels square and starts near the middle.", "You can pass a Rect straight to `pygame.draw.rect`. No need for four separate numbers."], help: ["loop", "rectobj"], code: W6_1,
        type: "Type the loop. Make `player` and `speed` above it, and draw the player inside the loop.", chk: [["a player Rect", /player\s*=\s*pygame\.Rect\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/], ["speed = 4", /speed\s*=\s*4/], ["draw the player", /pygame\.draw\.rect\(\s*screen\s*,[^\n]*,\s*player\s*\)/]],
        run: "A yellow square sits in the middle of the dark screen." },
      { title: "Move with the arrow keys", say: ["`pygame.key.get_pressed()` tells you which keys are held **right now**. `keys[pygame.K_LEFT]` is `True` while the left arrow is down.", "Each frame the key is held, we change the Rect's `x` or `y` by `speed`. Remember: **y goes down**, so up is `-=`.", "Click the **Game screen** once so it can hear your keyboard."], help: ["held", "stopgame"], code: W6_2,
        type: "Type the key code under the loop's events, before `screen.fill`.", chk: [["keys = pygame.key.get_pressed()", /keys\s*=\s*pygame\.key\.get_pressed\(\)/], ["four if keys[...] checks", /if\s+keys\[\s*pygame\.K_\w+\s*\][^\n]*:/, 4], ["player.x and player.y change", /player\.x\s*[-+]=\s*speed[\s\S]*player\.y\s*[-+]=\s*speed/]],
        run: "Click the game screen, then use the arrow keys. The square moves. (It can leave the window. We'll fix that.)" },
      { title: "Keep the player inside the window", say: ["Right now the player can wander off the screen. `player.clamp_ip(screen.get_rect())` pushes the Rect back inside a boundary.", "`screen.get_rect()` is a Rect the size of the whole window. `clamp_ip` means \"clamp it **i**n **p**lace\"."], help: ["rectobj"], code: W6_3,
        type: "Type the `clamp_ip` line after your four key checks.", chk: [["player.clamp_ip(screen.get_rect())", /player\.clamp_ip\(\s*screen\.get_rect\(\)\s*\)/]],
        run: "Push the square into every wall and corner. It stops at the edge." },
      { title: "Add WASD", say: ["Many players like **W A S D**. Use `or` so either key works: `if keys[pygame.K_LEFT] or keys[pygame.K_a]:`.", "All four `if` lines change, so they are green again."], code: W6_4,
        type: "Change each `if` so it also checks the matching WASD letter.", chk: [["four if lines that use or", /if\s+keys\[[^\]]+\]\s+or\s+keys\[[^\]]+\]\s*:/, 4], ["all four WASD letters", /K_a[\s\S]*K_d[\s\S]*K_w[\s\S]*K_s/]],
        run: "The square moves with either the arrow keys or WASD." },
      { title: "A key that only counts once (KEYDOWN)", say: ["Holding a key is one idea. **Pressing** a key once is another. For things like jumping or shooting you want \"one press = one action\".", "That's an **event**. When the key first goes down, pygame sends a `KEYDOWN` event, and `event.key` says which key. Type this **inside** the `for event` loop.", "Each press of the space bar moves to the next color in the list. You used the same list idea in Walkthrough 5."], help: ["events", "held", "lists"], code: W6_5,
        type: "Add `colors` and `color_index` above the loop. Add the KEYDOWN `if` inside the `for event` loop. Change the draw line to use `colors[color_index]`.", chk: [["a colors list", /colors\s*=\s*\[\s*\(/], ["if event.type == pygame.KEYDOWN:", /if\s+event\.type\s*==\s*pygame\.KEYDOWN\s*:/], ["if event.key == pygame.K_SPACE:", /if\s+event\.key\s*==\s*pygame\.K_SPACE\s*:/], ["the player is drawn with colors[color_index]", /pygame\.draw\.rect\(\s*screen\s*,\s*colors\[\s*color_index\s*\]\s*,\s*player\s*\)/]],
        run: "Press the space bar. The square changes color. Hold the space bar. It changes **once**, not 60 times a second." }
    ],
    finish: ["Drive your square around. Try going diagonally.", "Is it faster to move diagonally than straight? (Hint: yes! Why do you think that is?)"],
    challenges: ["Make a **Shift** key speed boost: `if keys[pygame.K_LSHIFT]:` makes the speed 8.", "Add a second player square controlled by a different set of keys (try `I J K L`).", "Press **R** to put the player back in the middle: `player.center = (240, 160)`.", "Add `print(player.x, player.y)` inside the loop for a moment. What do you notice? Why is it not a good idea to leave it in?"],
    recap: "`pygame.Rect` stores position and size. `key.get_pressed()` is for held keys (movement). `KEYDOWN` events are for single presses (jump, shoot). `clamp_ip` keeps a Rect on screen.",
    next: "**Next:** touching things. Walkthrough 7 adds **collisions** and a score, and you finish your first real game."
  });

  /* ================================================================= 7. Collisions: Treasure Hunt ================ */
  var TH = function (imports, setup, events, update, draw) { return `import asyncio
` + imports + `import pygame

pygame.init()
screen = pygame.display.set_mode((480, 320))
pygame.display.set_caption("Treasure Hunt")
clock = pygame.time.Clock()
` + setup + `
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
` + events + `
` + update + `    screen.fill((20, 30, 50))
` + draw + `
    pygame.display.flip()
    clock.tick(60)
    await asyncio.sleep(0)

pygame.quit()
`; };
  var TH_EV = "        if event.type == pygame.KEYDOWN:\n            if event.key == pygame.K_SPACE:\n                color_index = (color_index + 1) % len(colors)\n";
  var TH_SET0 = "\nplayer = pygame.Rect(220, 140, 40, 40)\nspeed = 4\ncolors = [(255, 200, 0), (255, 80, 80), (80, 200, 255)]\ncolor_index = 0\n";
  var TH_DRAW0 = "    pygame.draw.rect(screen, colors[color_index], player)\n";
  var W7_0 = TH("", TH_SET0, TH_EV, KEYS2, TH_DRAW0);
  var W7_1 = TH("", TH_SET0 + "coin = pygame.Rect(300, 100, 20, 20)\n", TH_EV, KEYS2, TH_DRAW0 + "    pygame.draw.circle(screen, (255, 220, 0), coin.center, 10)\n");
  var W7_2 = TH("import random\n", TH_SET0 + "coin = pygame.Rect(300, 100, 20, 20)\nscore = 0\n", TH_EV, KEYS2 + "    if player.colliderect(coin):\n        score += 1\n        coin.x = random.randint(0, 460)\n        coin.y = random.randint(40, 300)\n\n", TH_DRAW0 + "    pygame.draw.circle(screen, (255, 220, 0), coin.center, 10)\n");
  var W7_3 = TH("import random\n", TH_SET0 + "coin = pygame.Rect(300, 100, 20, 20)\nscore = 0\nfont = pygame.font.Font(None, 32)\n", TH_EV, KEYS2 + "    if player.colliderect(coin):\n        score += 1\n        coin.x = random.randint(0, 460)\n        coin.y = random.randint(40, 300)\n\n", TH_DRAW0 + "    pygame.draw.circle(screen, (255, 220, 0), coin.center, 10)\n    text = font.render(\"Treasure: \" + str(score), True, (255, 255, 255))\n    screen.blit(text, (10, 10))\n");
  P.add({
    num: 7, title: "Collisions: Treasure Hunt",
    intro: ["Your first complete game! You will chase a coin. Every time your square touches it, you score a point and the coin jumps to a **random** new spot.",
      "You will keep building on your finished player from Walkthrough 6. The new ideas are **collision detection**, **random numbers**, and showing a **score**."],
    learn: ["Rect.colliderect()", "import random and random.randint", "score variables", "drawing a circle at a Rect's center"],
    firstTips: ["collide", "randomtips"],
    stages: [
      { title: "Bring your player with you", say: ["Open **Walkthrough 6**. Click the code box, press **Ctrl + A** then **Ctrl + C** to copy your finished program.", "Come back to **Walkthrough 7**, click the empty code box, and press **Ctrl + V**.", "Check that the player still moves and changes color."], help: ["bring6"], code: W7_0, bring: true,
        type: "Paste your finished Walkthrough 6 code into this code box.", chk: [["the player Rect", /player\s*=\s*pygame\.Rect\(/], ["the movement keys", /keys\s*=\s*pygame\.key\.get_pressed\(\)/], ["clamp_ip", /clamp_ip/]],
        run: "Your yellow square moves with the arrow keys and WASD." },
      { title: "Put a coin on the screen", say: ["The coin is a Rect too (20 by 20). That's the **collision box**: the area the computer checks.", "We draw it as a circle with `pygame.draw.circle`. `coin.center` is the `(x, y)` middle of the Rect, so the circle sits right on top of it."], help: ["rectobj"], code: W7_1,
        type: "Make the `coin` Rect with your other setup. Draw the circle after the player.", chk: [["a coin Rect", /coin\s*=\s*pygame\.Rect\(/], ["the coin is drawn", /pygame\.draw\.circle\(\s*screen\s*,\s*\([^)]*\)\s*,\s*coin\.center\s*,\s*\d+\s*\)/]],
        run: "A gold coin sits on the screen. You can drive right through it, because nothing happens yet." },
      { title: "Collect the coin", say: ["`player.colliderect(coin)` is `True` when the two rectangles overlap. Check it every frame with an `if`.", "When it's true: add 1 to `score`, and move the coin to a new random spot. `random.randint(0, 460)` is a whole number from 0 to 460. (460 is 480 minus the coin's width of 20, so the coin never sticks out.)", "Add `import random` at the top with your other imports."], help: ["collide", "randomtips"], code: W7_2,
        type: "Add `import random` at the top. Add `score = 0` with your setup. Type the `if player.colliderect(coin):` block after the keyboard code.", chk: [["import random", /^import random\s*$/], ["score = 0", /score\s*=\s*0/], ["if player.colliderect(coin):", /if\s+player\.colliderect\(\s*coin\s*\)\s*:/], ["score += 1", /score\s*\+=\s*1/], ["random.randint for the coin's x and y", /coin\.(x|y)\s*=\s*random\.randint\(/, 2]],
        run: "Drive into the coin. It jumps somewhere new. (You can't see the score yet. Use the next step.)" },
      { title: "Show the score", say: ["Make a font above the loop. Then render the score as text and blit it, just like the \"Bounces\" counter in Walkthrough 5.", "Draw the text **last**, so nothing can cover it."], help: ["fonts"], code: W7_3,
        type: "Add `font = ...` above the loop. Type the `text = ...` and `screen.blit` lines after the coin is drawn.", chk: [["font = pygame.font.Font(...)", /font\s*=\s*pygame\.font\.Font\(\s*None\s*,\s*\d+\s*\)/], ["render the score text", /font\.render\(\s*["'][^"']*["']\s*\+\s*str\(\s*score\s*\)/], ["screen.blit the text", /screen\.blit\(\s*text\s*,/]],
        run: "**Treasure: 0** shows in the top left, and goes up every time you grab a coin. You made a game!" }
    ],
    finish: ["Play for 30 seconds. What is your best score?", "Show a friend. Do they find it fun? What would make it more fun?"],
    challenges: ["Make the coin **smaller** or the player **faster**. Which one makes the game harder?", "Add a second coin that is worth 5 points but is smaller.", "Add a timer: use `pygame.time.get_ticks()` and end the game after 20 seconds. (See the **Frames, the clock and time** help.)", "Make the player grow by 2 pixels each time you collect a coin. Hint: `player.width += 2`. Does `clamp_ip` still work?"],
    tips: { bring6: { title: "I did not finish Walkthrough 6", sections: [
      { p: "Type your Walkthrough 6 program. This is what it should look like:" },
      { ex: W6_5.replace(/\n+$/, "").split("\n") }
    ] } },
    recap: "A **collision** is two Rects overlapping, and `colliderect` finds it. `random.randint` puts things in new places. A **score** is a variable you add to when something happens, and you show it with `font.render` and `blit`.",
    next: "**Part 2 starts next:** you will build full games one piece at a time, starting with **Meteor Dodge**."
  });
})(typeof window !== "undefined" ? window : globalThis);
