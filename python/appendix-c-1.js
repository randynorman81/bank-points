/* APPENDIX C, PART 1: making pictures from scratch (walkthroughs 1 to 4). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var C = root.PYC || (typeof require !== "undefined" ? require("./appendix-c-core.js") : null);

  /* ================================================================= 1. Your First Picture ================ */
  var S1 = C.seq([
    { title: "Bring in Pillow", add: `from PIL import Image`,
      say: ["**Pillow** is a Python library for working with pictures. It is named **PIL**, so you bring it in with `from PIL import Image`. `Image` is the part of the library that makes and opens pictures.",
        "The first time you run a program that uses Pillow, the editor downloads it. Give it a few seconds."],
      help: ["c_pil", "b_typing"], type: "Type this line:", chk: [["from PIL import Image", /^\s*from\s+PIL\s+import\s+Image\b/m]], run: "The first run loads Pillow. Nothing prints, and that is correct." },
    { title: "Make a blank picture", add: `\nimg = Image.new("RGB", (300, 200), "skyblue")`,
      say: ["`Image.new` makes a brand new picture. It needs three things: the **mode** (`\"RGB\"` means red, green and blue light), the **size** as `(width, height)` in pixels, and a **color**.", "Notice the size is its own pair of brackets inside the brackets of `Image.new`."],
      help: ["c_colors", "c_pixels"], type: "Type this line below your import:", chk: [["img = Image.new(\"RGB\", (width, height), color)", /\bimg\s*=\s*Image\.new\(\s*["']RGB["']\s*,\s*\(/]], run: "Still nothing on the screen. The picture exists, but you have not asked to see it." },
    { title: "Show it", add: `\nimg.show()`,
      say: ["`img.show()` displays the picture in the Output box. (On a normal computer it opens a picture viewer. This editor shows it right here.)", "Click the picture to make it bigger and click again to shrink it."],
      type: "Type this line at the bottom:", chk: [["img.show()", /\bimg\.show\(\s*\)/]], run: "A sky blue rectangle appears in the Output box.", img: 1 },
    { title: "Ask the picture about itself", edit: [["img.show()", "print(img.size)\nprint(img.width, img.height)\nprint(img.mode)\nimg.show()"]],
      say: ["A picture knows facts about itself: its `size` (a pair), its `width` and `height`, and its `mode`. Programmers call facts about data **metadata**.", "Add these three print lines **above** `img.show()` so the facts print first."],
      help: ["c_pixels", "c_modes"], type: "Add the three print lines above `img.show()`.", chk: [["print(img.size)", /print\(\s*img\.size\s*\)/], ["print(img.width, img.height)", /print\(\s*img\.width\s*,\s*img\.height\s*\)/], ["print(img.mode)", /print\(\s*img\.mode\s*\)/]], run: "You see `(300, 200)`, then `300 200`, then `RGB`.", img: 1 },
    { title: "Use variables and an RGB color", edit: [["img = Image.new(\"RGB\", (300, 200), \"skyblue\")", "width = 400\nheight = 250\ncolor = (255, 140, 0)\n\nimg = Image.new(\"RGB\", (width, height), color)"]],
      say: ["Put the settings in variables so they are easy to change. A color can also be three numbers `(red, green, blue)`, each from 0 to 255. `(255, 140, 0)` is a bright orange: all the red, some green, no blue.", "Replace your `Image.new` line with these five lines."],
      help: ["c_colors"], type: "Replace the `Image.new` line with the variables and the new `Image.new` line.", chk: [["width and height variables", /^\s*width\s*=\s*\d+[\s\S]*^\s*height\s*=\s*\d+/m], ["an RGB color tuple in a variable", /^\s*color\s*=\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/m], ["Image.new using the variables", /Image\.new\(\s*["']RGB["']\s*,\s*\(\s*width\s*,\s*height\s*\)\s*,\s*color\s*\)/]], run: "A bigger, orange picture. Try changing the three numbers in `color` and run again.", img: 1 },
    { title: "Save your picture", add: `img.save("my_picture.png")`,
      say: ["`img.save` writes the picture to a file. The **ending of the name** (`.png`) tells Pillow which kind of file to make. The editor shows a **Download it** link so you can keep the picture."],
      help: ["c_files"], type: "Type this line at the very bottom:", chk: [["img.save(\"...png\")", /\bimg\.save\(\s*["'][^"']+\.(png|jpg|jpeg|gif)["']\s*\)/]], run: "Under the picture you see `Saved my_picture.png` with a Download link.", img: 1 },
    { title: "Make many pictures with a loop", add: `\nfor name in ["crimson", "gold", "limegreen", "royalblue"]:\n    swatch = Image.new("RGB", (80, 80), name)\n    swatch.show()`,
      say: ["A loop can make a whole set of pictures. `name` becomes each color in the list in turn, and a new 80 by 80 swatch is made and shown each time."],
      help: ["b_list"], type: "Type these three lines at the very bottom:", chk: [["a loop over a list of colors", /for\s+name\s+in\s+\[[^\]]+\]\s*:/], ["Image.new(...) with name", /Image\.new\(\s*["']RGB["']\s*,\s*\(\s*\d+\s*,\s*\d+\s*\)\s*,\s*name\s*\)/], ["swatch.show()", /\bswatch\.show\(\s*\)/]], run: "Your orange picture, then four small color swatches.", img: 5 }
  ]);
  C.add({
    num: 1, title: "Your First Picture",
    intro: ["Every picture on a screen is made of numbers. In this walkthrough you will make pictures from nothing: pick a size, pick a color, and see it appear.", "This is your first step with **Pillow**, the Python library that powers photo tools. By the end of this appendix you will resize, filter, draw on, and animate pictures."],
    learn: ["bringing in Pillow", "Image.new", "show() and save()", "size, width, height and mode", "colors by name and by RGB"],
    firstTips: ["c_pil", "c_colors", "b_typing"],
    stages: S1,
    finish: ["Run the program. You should see the orange picture and four swatches.", "Change `color` to a color you made up with three numbers. Run again."],
    challenges: ["Make a picture that is exactly 100 pixels wide and 500 pixels tall. Does it look the way you expected?", "Use a hex color: `\"#ff00aa\"`. (Colors written in base 16 are how websites name colors.)", "Make the swatch loop use your own list of six colors."],
    recap: "A picture is a **grid of pixels**, each with a color. `Image.new(mode, (width, height), color)` makes one, `.show()` displays it, `.save(\"name.png\")` keeps it, and `.size`, `.width`, `.height` and `.mode` describe it.",
    next: "**Next:** Walkthrough 2 goes inside the picture and changes **one pixel at a time**."
  });

  /* ================================================================= 2. Pixels and Color ================ */
  var S2 = C.seq([
    { title: "Color one pixel", add: `from PIL import Image\n\nimg = Image.new("RGB", (100, 100), "black")\nimg.putpixel((50, 50), (255, 0, 0))\nimg.show()`,
      say: ["Every picture is a grid of **pixels**. `img.putpixel((x, y), color)` colors exactly one of them. The position `(50, 50)` is the middle of a 100 by 100 picture, and `(255, 0, 0)` is pure red.", "The picture is tiny, so the editor enlarges it for you. Look for the one red dot."],
      help: ["c_pixels", "c_colors", "b_typing"], type: "Type these five lines:", chk: [["a black 100 by 100 picture", /Image\.new\(\s*["']RGB["']\s*,\s*\(\s*100\s*,\s*100\s*\)\s*,\s*["']black["']\s*\)/], ["img.putpixel((50, 50), (255, 0, 0))", /\bimg\.putpixel\(\s*\(\s*50\s*,\s*50\s*\)\s*,\s*\(\s*255\s*,\s*0\s*,\s*0\s*\)\s*\)/]], run: "A black square with a single red pixel in the middle.", img: 1 },
    { title: "Read a pixel", edit: [["img.show()", "print(img.getpixel((50, 50)))\nprint(img.getpixel((0, 0)))\nimg.show()"]],
      say: ["`img.getpixel((x, y))` reads a pixel's color back as three numbers. Ask for the red dot and for the very first pixel, the top-left corner `(0, 0)`.", "Put the two print lines above `img.show()`."],
      help: ["c_pixels"], type: "Add the two print lines above `img.show()`.", chk: [["printing a pixel with getpixel", /print\(\s*img\.getpixel\(\s*\(\s*\d+\s*,\s*\d+\s*\)\s*\)\s*\)/, 2]], run: "You see `(255, 0, 0)` for the dot and `(0, 0, 0)` for black.", img: 1 },
    { title: "Paint a line with a loop", edit: [["img.putpixel((50, 50), (255, 0, 0))", "for x in range(100):\n    img.putpixel((x, 50), (255, 255, 0))\nimg.putpixel((50, 50), (255, 0, 0))"]],
      say: ["One pixel at a time is slow. A `for` loop can paint a whole row: `x` goes `0, 1, 2 ... 99` and each pass colors the pixel at `(x, 50)` yellow. The red dot is painted **after** the line so it stays on top. The last thing painted wins.", "Put the loop above the red `putpixel` line."],
      help: ["c_pixels"], type: "Add the yellow line loop above the red `putpixel` line.", chk: [["a loop over range(100)", /for\s+x\s+in\s+range\(\s*100\s*\)\s*:/], ["putpixel((x, 50), ...) inside it", /putpixel\(\s*\(\s*x\s*,\s*50\s*\)/]], run: "A yellow line across the middle, with the red dot on top.", img: 1 },
    { title: "Paint every pixel: a gradient", add: `\ngradient = Image.new("RGB", (200, 200))\nfor x in range(200):\n    for y in range(200):\n        gradient.putpixel((x, y), (x, y, 128))\ngradient.show()`,
      say: ["Put a loop **inside** a loop and you visit every pixel. The outer loop picks each `x` (each column), and for every `x` the inner loop picks each `y` (each row). That is 200 times 200 = 40,000 pixels.", "The color is `(x, y, 128)`: the **red** grows as you go right, the **green** grows as you go down, and blue stays at 128. Because the numbers come from the position, you get a smooth gradient with no extra work."],
      help: ["c_pixels", "c_colors"], type: "Type these five lines at the bottom:", chk: [["a nested loop over x and y", /for\s+x\s+in\s+range\(\s*200\s*\)\s*:\s*\n\s+for\s+y\s+in\s+range\(\s*200\s*\)\s*:/], ["a color made from x and y", /gradient\.putpixel\(\s*\(\s*x\s*,\s*y\s*\)\s*,\s*\(\s*x\s*,\s*y\s*,\s*\d+\s*\)\s*\)/]], run: "A square that is black in the top-left corner and blends to bright colors.", img: 2 },
    { title: "Decisions for every pixel: a flag", add: `\nwidth = 300\nheight = 200\nflag = Image.new("RGB", (width, height))\nfor x in range(width):\n    for y in range(height):\n        if x < 100:\n            color = (0, 146, 70)\n        elif x < 200:\n            color = (255, 255, 255)\n        else:\n            color = (206, 43, 55)\n        flag.putpixel((x, y), color)\nflag.show()`,
      say: ["Add an `if` inside the loops and the color can **depend on where the pixel is**. This paints a flag with three vertical stripes: pixels with `x` below 100 are green, below 200 are white, and the rest are red. It is the Italian flag.", "Be careful with the spacing. The `if` lines are indented under the inner `for`, and the `flag.putpixel` line lines up with the `if`."],
      help: ["b_typing", "c_colors"], type: "Type these 13 lines at the bottom:", chk: [["an if / elif / else choosing a color", /^\s+if\s+x\s*<\s*100\s*:[\s\S]*^\s+elif\s+x\s*<\s*200\s*:[\s\S]*^\s+else\s*:/m], ["flag.putpixel((x, y), color)", /flag\.putpixel\(\s*\(\s*x\s*,\s*y\s*\)\s*,\s*color\s*\)/]], run: "A flag with a green, white and red stripe.", img: 3 },
    { title: "Mix your own color", add: `\nred = int(input("Red (0 to 255): "))\ngreen = int(input("Green (0 to 255): "))\nblue = int(input("Blue (0 to 255): "))\nswatch = Image.new("RGB", (100, 100), (red, green, blue))\nswatch.show()\nprint("Your color is", (red, green, blue))`,
      say: ["Let the user be the artist. `input()` gives back text, so `int(...)` turns it into a whole number. Then the three numbers become the color of a new picture.", "Try `255, 128, 0` (orange), `0, 0, 0` (black), `255, 255, 255` (white), `128, 0, 128` (purple)."],
      help: ["b_input", "c_colors"], type: "Type these six lines at the bottom:", chk: [["asking for red, green and blue with int(input(...))", /int\(\s*input\(/, 3], ["a swatch colored (red, green, blue)", /Image\.new\(\s*["']RGB["']\s*,\s*\(\s*100\s*,\s*100\s*\)\s*,\s*\(\s*red\s*,\s*green\s*,\s*blue\s*\)\s*\)/]], run: "Type three numbers. A swatch of your color appears.", img: 4, inp: ["255", "128", "0"] },
    { title: "Count the data", add: `\npixels = flag.width * flag.height\nprint(f"The flag has {pixels} pixels.")\nprint(f"Each pixel uses 3 bytes, so that is {pixels * 3} bytes.")\nprint(len(flag.tobytes()))`,
      say: ["Here is the big idea of this walkthrough: a picture is **just data**. The flag has 300 times 200 pixels, and each pixel needs 3 bytes (one each for red, green and blue, because each number from 0 to 255 fits in exactly one byte). `flag.tobytes()` hands you all those bytes, and `len` counts them. The two numbers match.", "That is why photos make big files, and why file formats like JPEG try to **compress** the data."],
      help: ["c_apmap", "b_fstr"], type: "Type these four lines at the bottom:", chk: [["pixels = flag.width * flag.height", /\bpixels\s*=\s*flag\.width\s*\*\s*flag\.height/], ["an f-string with pixels * 3", /\{\s*pixels\s*\*\s*3\s*\}/], ["len(flag.tobytes())", /len\(\s*flag\.tobytes\(\s*\)\s*\)/]], run: "It prints 60000 pixels and 180000 bytes. Both ways of counting agree.", img: 4, inp: ["255", "128", "0"] }
  ]);
  C.add({
    num: 2, title: "Pixels and Color",
    intro: ["A picture on a screen is a **grid of colored dots** called pixels. In this walkthrough you will paint pictures one pixel at a time, then use **loops** to paint thousands of pixels with a few lines.",
      "You will also see why every picture is really **data**: just numbers."],
    learn: ["putpixel and getpixel", "(x, y) positions", "nested loops over every pixel", "choosing colors with if / elif / else", "bytes and pixels"],
    firstTips: ["c_pixels", "c_colors", "c_apmap"],
    stages: S2,
    finish: ["Run it and look at all four pictures.", "Look at the gradient. Where on the picture is the red the brightest? Where is the green the brightest?"],
    challenges: ["Change the flag to a flag you like with three **horizontal** stripes (use `y` instead of `x`).", "Make the gradient `(x * 255 // 200, 0, y * 255 // 200)` so the colors reach all the way to 255.", "Paint a **checkerboard**: color the pixel white if `(x // 20 + y // 20) % 2 == 0` and black if not."],
    recap: "`putpixel((x, y), color)` writes one pixel and `getpixel((x, y))` reads one. **Nested loops** visit every pixel, and the color can come from math on `x` and `y` or from an `if`. A 300 by 200 picture is 60,000 pixels, which is 180,000 bytes of data.",
    next: "**Next:** Walkthrough 3 uses **ImageDraw**, which draws shapes for you so you do not paint every pixel."
  });

  /* ================================================================= 3. Drawing Shapes ================ */
  var S3 = C.seq([
    { title: "Make a canvas and a pen", add: `from PIL import Image, ImageDraw\n\nimg = Image.new("RGB", (400, 300), "skyblue")\ndraw = ImageDraw.Draw(img)\n\nimg.show()`,
      say: ["Painting pixel by pixel is slow. **ImageDraw** is a tool that draws whole shapes. You make a \"pen\" for your picture with `ImageDraw.Draw(img)` and give it a name, usually `draw`.",
        "Notice the import now has two things: `from PIL import Image, ImageDraw`."],
      help: ["c_draw", "b_typing"], type: "Type these six lines:", chk: [["from PIL import Image, ImageDraw", /^\s*from\s+PIL\s+import\s+Image\s*,\s*ImageDraw\b/m], ["draw = ImageDraw.Draw(img)", /\bdraw\s*=\s*ImageDraw\.Draw\(\s*img\s*\)/]], run: "A plain sky blue picture. We will draw on it.", img: 1 },
    { title: "Grass and sun", edit: [["img.show()", "draw.rectangle((0, 220, 400, 300), fill=\"forestgreen\")\ndraw.ellipse((300, 30, 360, 90), fill=\"gold\")\nimg.show()"]],
      say: ["A **rectangle** is drawn from two corners: `(left, top, right, bottom)`. Here the grass runs from `(0, 220)` all the way to the bottom-right corner `(400, 300)`.",
        "An **ellipse** fits inside the box you give it. A box with equal sides gives a circle. This one is 60 wide and 60 tall, so it is a round sun.",
        "Add these two lines **above** `img.show()`."],
      help: ["c_draw", "c_pixels"], type: "Add the grass and the sun above `img.show()`.", chk: [["a rectangle for the grass", /draw\.rectangle\(\s*\(\s*0\s*,\s*220\s*,\s*400\s*,\s*300\s*\)/], ["an ellipse for the sun", /draw\.ellipse\(\s*\(/]], run: "Green grass along the bottom and a yellow sun in the corner.", img: 1 },
    { title: "The house", edit: [["img.show()", "draw.rectangle((120, 140, 260, 230), fill=\"firebrick\", outline=\"black\", width=3)\nimg.show()"]],
      say: ["Shapes can have a `fill` (the inside color), an `outline` (the border color) and a `width` (how thick the border is, in pixels).", "Add the house body above `img.show()`."],
      help: ["c_draw"], type: "Add the house rectangle above `img.show()`.", chk: [["a rectangle with fill, outline and width", /draw\.rectangle\([^)]*\)\s*,\s*fill\s*=\s*["']firebrick["']\s*,\s*outline\s*=\s*["']black["']\s*,\s*width\s*=\s*3\s*\)/]], run: "A red house sits on the grass.", img: 1 },
    { title: "The roof (a polygon)", edit: [["img.show()", "draw.polygon([(105, 145), (190, 80), (275, 145)], fill=\"saddlebrown\", outline=\"black\")\nimg.show()"]],
      say: ["A **polygon** takes a **list of corner points**. Python connects them in order and fills the shape. Three points make a triangle. Notice the square brackets around the list and the brackets around each point."],
      help: ["c_draw"], type: "Add the roof above `img.show()`.", chk: [["a polygon from a list of points", /draw\.polygon\(\s*\[\s*\(\s*\d+\s*,\s*\d+\s*\)\s*,\s*\(\s*\d+\s*,\s*\d+\s*\)\s*,\s*\(\s*\d+\s*,\s*\d+\s*\)\s*\]/]], run: "A brown triangle roof on top of the house.", img: 1 },
    { title: "Door and windows", edit: [["img.show()", "draw.rectangle((175, 175, 205, 230), fill=\"navy\")\ndraw.rectangle((140, 160, 165, 185), fill=\"lightyellow\", outline=\"black\")\ndraw.rectangle((215, 160, 240, 185), fill=\"lightyellow\", outline=\"black\")\nimg.show()"]],
      say: ["**Order matters.** Later shapes are drawn on top of earlier ones. The door and windows come after the house so that they show on top of it.", "Add a door and two windows."],
      type: "Add three more rectangles above `img.show()`.", chk: [["at least four rectangles in total", /draw\.rectangle\(/, 4]], run: "Your house has a door and two windows.", img: 1 },
    { title: "A tree, a path and a message", edit: [["img.show()", "draw.rectangle((50, 190, 62, 240), fill=\"sienna\")\ndraw.ellipse((25, 130, 90, 200), fill=\"darkgreen\")\ndraw.line((190, 230, 190, 300), fill=\"tan\", width=14)\ndraw.text((10, 10), \"My house\", fill=\"white\")\nimg.show()"]],
      say: ["Finish the scene. A `line` goes from one point to another. `draw.text` writes words at a position. The tree is a brown trunk rectangle with a green circle drawn on top of it.", "Add the four lines above `img.show()`."],
      help: ["c_draw", "c_text"], type: "Add the trunk, leaves, path and text above `img.show()`.", chk: [["a line for the path", /draw\.line\(\s*\(/], ["text drawn with draw.text", /draw\.text\(\s*\(/], ["at least two ellipses (sun and leaves)", /draw\.ellipse\(/, 2]], run: "A finished little scene. The text is tiny, and you will fix that in the next walkthrough.", img: 1 },
    { title: "Save it", add: `img.save("house.png")`,
      say: ["Save your drawing as a PNG. PNG is the best choice for drawings because it keeps every pixel exactly."],
      help: ["c_files"], type: "Type this line at the very bottom:", chk: [["img.save(\"house.png\")", /\bimg\.save\(\s*["'][^"']+\.png["']\s*\)/]], run: "A Download link appears under the picture.", img: 1 }
  ]);
  C.add({
    num: 3, title: "Drawing Shapes",
    intro: ["Now you will draw like an artist, with code. The **ImageDraw** tool gives you a pen that can draw rectangles, circles, lines, triangles and text at any position.", "You will build a picture one shape at a time, and see why **the order** you draw in matters."],
    learn: ["ImageDraw.Draw", "rectangle, ellipse, line and polygon", "fill, outline and width", "coordinates and boxes", "drawing order"],
    firstTips: ["c_draw", "c_pixels", "c_colors"],
    stages: S3,
    finish: ["Run the program and compare your picture with the code. Can you find the line that draws each part?", "Change the color of the roof and the door."],
    challenges: ["Add a second tree on the right side.", "Make a night version: a dark blue sky, a white moon, and yellow windows.", "Add a chimney with a small rectangle. Where in the code does it have to go so it shows up?", "Add `draw.ellipse` clouds made of three overlapping white circles."],
    recap: "`ImageDraw.Draw(img)` gives you a pen. Shapes take a **box or points** plus `fill`, `outline` and `width`. Everything draws **in order**, so background first and details last.",
    next: "**Next:** Walkthrough 4 teaches **text**: sizes, centering, shadows and a poster."
  });

  /* ================================================================= 4. Text and Posters ================ */
  var S4 = C.seq([
    { title: "Write some text", add: `from PIL import Image, ImageDraw, ImageFont\n\nimg = Image.new("RGB", (500, 300), "midnightblue")\ndraw = ImageDraw.Draw(img)\ndraw.text((20, 20), "Hello, Pillow!", fill="white")\nimg.show()`,
      say: ["`draw.text((x, y), \"words\", fill=color)` writes text. The position is where the **top-left** of the words goes. Notice we also import `ImageFont` for the next step.", "Run it and look closely for the text. The default size is very small."],
      help: ["c_text", "b_typing"], type: "Type these seven lines:", chk: [["from PIL import Image, ImageDraw, ImageFont", /^\s*from\s+PIL\s+import\s+Image\s*,\s*ImageDraw\s*,\s*ImageFont\b/m], ["a draw.text(...) call", /draw\.text\(\s*\(/]], run: "A navy picture with tiny white text in the corner.", img: 1 },
    { title: "Pick a font size", edit: [["draw = ImageDraw.Draw(img)", "draw = ImageDraw.Draw(img)\nfont = ImageFont.load_default(size=48)"], ["draw.text((20, 20), \"Hello, Pillow!\", fill=\"white\")", "draw.text((20, 20), \"Hello, Pillow!\", font=font, fill=\"white\")"]],
      say: ["`ImageFont.load_default(size=48)` makes a font 48 pixels tall. Make it once, name it `font`, and hand it to every `draw.text` with `font=font`."],
      help: ["c_text"], type: "Add the `font` line and add `font=font` to the `draw.text` line.", chk: [["font = ImageFont.load_default(size=...)", /\bfont\s*=\s*ImageFont\.load_default\(\s*size\s*=\s*\d+\s*\)/], ["font=font in draw.text", /draw\.text\([^\n]*font\s*=\s*font/]], run: "Now the words are big and easy to read.", img: 1 },
    { title: "Center the text", edit: [["draw.text((20, 20), \"Hello, Pillow!\", font=font, fill=\"white\")", "draw.text((250, 150), \"Hello, Pillow!\", font=font, fill=\"white\", anchor=\"mm\")"]],
      say: ["By default `(x, y)` is the top-left of the text. An **anchor** changes what the position means. `anchor=\"mm\"` means **m**iddle, **m**iddle, so the text is centered on the point. The point `(250, 150)` is the middle of a 500 by 300 picture.",
        "Edit your `draw.text` line."],
      help: ["c_text"], type: "Change the position to `(250, 150)` and add `anchor=\"mm\"`.", chk: [["centered text with anchor=\"mm\"", /draw\.text\(\s*\(\s*250\s*,\s*150\s*\)[^\n]*anchor\s*=\s*["']mm["']/]], run: "The words sit in the exact middle.", img: 1 },
    { title: "Measure the text", edit: [["draw.text((250, 150), \"Hello, Pillow!\", font=font, fill=\"white\", anchor=\"mm\")", "text = \"Hello, Pillow!\"\ndraw.text((250, 150), text, font=font, fill=\"white\", anchor=\"mm\")\nprint(draw.textlength(text, font=font))\nbox = draw.textbbox((0, 0), text, font=font)\nprint(box, \"width:\", box[2] - box[0], \"height:\", box[3] - box[1])"]],
      say: ["Your program can **measure** text before it draws it. `draw.textlength` gives the width in pixels. `draw.textbbox` gives the box around the text as `(left, top, right, bottom)`, so the width is `box[2] - box[0]`.", "We also move the words into a variable `text`. Then there is one place to change them."],
      help: ["c_text", "b_list"], type: "Replace the `draw.text` line with these five lines.", chk: [["text = \"...\" in a variable", /^\s*text\s*=\s*["']/m], ["draw.textlength(text, font=font)", /draw\.textlength\(\s*text\s*,\s*font\s*=\s*font\s*\)/], ["draw.textbbox(...)", /draw\.textbbox\(/]], run: "The text, and under it the measurements. How wide is the text in pixels?", img: 1 },
    { title: "Shadows", edit: [["text = \"Hello, Pillow!\"\ndraw.text((250, 150), text, font=font, fill=\"white\", anchor=\"mm\")", "text = \"Hello, Pillow!\"\ndraw.text((253, 153), text, font=font, fill=\"black\", anchor=\"mm\")\ndraw.text((250, 150), text, font=font, fill=\"gold\", anchor=\"mm\")"]],
      say: ["A **shadow** is just the same text drawn first, in a dark color, a few pixels over and down. Then the bright text goes on top. This makes text readable on any background, and is how memes are made.", "Replace the single `draw.text` line with two."],
      help: ["c_text"], type: "Draw a black copy at `(253, 153)` first, then the gold text at `(250, 150)`.", chk: [["two draw.text calls with the same text", /draw\.text\(\s*\(\s*253\s*,\s*153\s*\)\s*,\s*text[\s\S]*draw\.text\(\s*\(\s*250\s*,\s*150\s*\)\s*,\s*text/]], run: "Gold text with a black shadow.", img: 1 },
    { title: "A poster with several lines", add: `\nposter = Image.new("RGB", (400, 500), "crimson")\npen = ImageDraw.Draw(poster)\nlines = ["PILLOW", "Poster Night", "Friday at 7 PM"]\nsizes = [72, 44, 30]\ny = 120\nfor i in range(len(lines)):\n    big = ImageFont.load_default(size=sizes[i])\n    pen.text((200, y), lines[i], font=big, fill="white", anchor="mm")\n    y += sizes[i] + 40\nposter.show()`,
      say: ["Now a whole poster. Two **lists** go together: `lines` holds the words and `sizes` holds how big each line is. The loop uses position `i` to pick the matching line and size, draws it centered at x = 200 (the middle of a 400 wide poster), then moves `y` down by the size plus 40 so the next line does not overlap.",
        "A new picture and a new pen get new names (`poster` and `pen`), so they do not mix with the first one."],
      help: ["b_list", "c_text"], type: "Type these twelve lines at the bottom:", chk: [["two lists: lines and sizes", /^\s*lines\s*=\s*\[[\s\S]*^\s*sizes\s*=\s*\[/m], ["a loop over range(len(lines))", /for\s+i\s+in\s+range\(\s*len\(\s*lines\s*\)\s*\)\s*:/], ["a font made from sizes[i]", /ImageFont\.load_default\(\s*size\s*=\s*sizes\[\s*i\s*\]\s*\)/], ["y moving down each pass", /\by\s*\+=\s*sizes\[\s*i\s*\]/]], run: "A red poster with three centered lines of different sizes.", img: 2 },
    { title: "Border and save", edit: [["poster.show()", "pen.rectangle((10, 10, 389, 489), outline=\"gold\", width=6)\nposter.show()\nposter.save(\"poster.png\")"]],
      say: ["Finish with a gold border. The box `(10, 10, 389, 489)` is 10 pixels in from every edge of a 400 by 500 picture (the last pixel is 399 and 499). Then save the poster."],
      help: ["c_draw", "c_files"], type: "Add the border above `poster.show()` and save the poster after it.", chk: [["a border with outline and width", /pen\.rectangle\([^)]*\)\s*,\s*outline\s*=\s*["'][^"']+["']\s*,\s*width\s*=\s*\d+\s*\)/], ["poster.save(\"poster.png\")", /poster\.save\(\s*["'][^"']+\.png["']\s*\)/]], run: "A finished poster with a gold frame, and a Download link.", img: 2 }
  ]);
  C.add({
    num: 4, title: "Text and Posters",
    intro: ["Words are part of almost every picture: memes, posters, signs, thumbnails. Pillow can write text at any size and position, and it can **measure** the text so you can center it perfectly.", "You will make a message with a shadow, then a whole poster."],
    learn: ["ImageFont.load_default(size=...)", "anchors for centering", "measuring text", "shadows", "two lists used together"],
    firstTips: ["c_text", "c_draw", "b_list"],
    stages: S4,
    finish: ["Run it. You should see a centered message with a shadow, and a poster.", "Change the words and the sizes in the poster lists to advertise something real (a club, a game night)."],
    challenges: ["Add a fourth line to the poster. What two lists do you have to change?", "Add a thick **outline** to the message instead of a shadow: draw the black text 4 times, each offset by 2 pixels in a different direction.", "Make the poster's line colors a third list: `colors = [\"white\", \"gold\", \"lightblue\"]`.", "Use `draw.textlength` to print the width of every line of the poster."],
    recap: "Text needs a **font size** (`load_default(size=...)`), a **position**, and a color. `anchor=\"mm\"` centers text on a point, `textlength` and `textbbox` measure it, and drawing it twice makes a shadow. Parallel **lists** plus a loop can lay out many lines.",
    next: "**Next:** Walkthrough 5 makes **art with loops**: stripes, checkerboards, circles and flowers."
  });
})(typeof window !== "undefined" ? window : globalThis);
