/* APPENDIX C, PART 5: your own picture project (walkthroughs 16 to 18). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var C = root.PYC || (typeof require !== "undefined" ? require("./appendix-c-core.js") : null);

  var IDEAS = { title: "Project ideas", sections: [
    { p: "Pick **one** idea (or invent your own). It must make a picture that **depends on something the user chooses**, and it must use a **list**, a **function with a parameter**, an **if** and a **loop**." },
    { rows: [
      ["Meme or poster maker", "the user types the words and picks a photo or color", "text with outlines, fit-to-size, save the result"],
      ["Photo lab", "the user picks a photo and an effect from a menu", "a dictionary of filter functions, a contact sheet of all of them"],
      ["Trading card maker", "the user types a Pokemon (or another API name)", "sprite, name, stats drawn with bars, a colored border by type"],
      ["Data poster", "the user picks a city or a Pokemon", "a bar chart function fed by a live API, with a title and colors"],
      ["Pixel art studio", "the user picks a photo and a block size", "pixelate, reduce the colors with posterize, show before and after"],
      ["Animation studio", "the user picks a speed and a color", "a function that makes frames, saves a GIF, loops for many versions"],
      ["Badge or ID card maker", "the user types a name", "a round photo with a mask, the name centered, a border by role"],
      ["Collage or postcard", "the user types a message and picks photos", "a grid or strip of photos, a caption, a sticker"],
      ["Generative art", "the user picks a number or a seed", "a drawing function with parameters called many times in a loop with random colors"]
    ] },
    { good: "Picking a **small** idea and finishing it with care beats a big idea that does not run. You can always add one more feature at the end." },
    { warn: "Pictures from the web need `requests` and `io`. If the photo site is blocked, make your pictures with `Image.new` and drawing, or use **Add a picture**." }
  ] };

  var RECIPES = { title: "Recipes (patterns you can borrow)", sections: [
    { p: "These are small working programs. Do not copy one whole. Take the **pattern** and make it your own." },
    { h: "1. A trading card from an API" },
    { ex: ["import io", "import requests", "from PIL import Image, ImageDraw, ImageFont", "", "name = input(\"Pokemon: \").strip().lower()", "data = requests.get(\"https://pokeapi.co/api/v2/pokemon/\" + name).json()", "sprite_bytes = requests.get(data[\"sprites\"][\"front_default\"]).content", "sprite = Image.open(io.BytesIO(sprite_bytes)).convert(\"RGBA\").resize((192, 192), Image.Resampling.NEAREST)", "", "card = Image.new(\"RGB\", (260, 360), \"gold\")", "pen = ImageDraw.Draw(card)", "pen.rectangle((10, 10, 249, 349), fill=\"ivory\", outline=\"black\", width=3)", "title_font = ImageFont.load_default(size=26)", "small_font = ImageFont.load_default(size=16)", "pen.text((130, 28), data[\"name\"].title(), font=title_font, fill=\"black\", anchor=\"mm\")", "card.paste(sprite, (34, 50), sprite)", "y = 255", "for s in data[\"stats\"][:4]:", "    pen.text((24, y), f\"{s['stat']['name']}: {s['base_stat']}\", font=small_font, fill=\"black\")", "    y += 22", "card.show()"] },
    { h: "2. A photo booth strip (a list of versions)" },
    { ex: ["import io", "import requests", "from PIL import Image, ImageFilter, ImageOps", "", "photo = Image.open(io.BytesIO(requests.get(\"https://picsum.photos/id/237/400/300\").content))", "photo.thumbnail((200, 200))", "effects = [photo, ImageOps.grayscale(photo).convert(\"RGB\"), photo.filter(ImageFilter.EMBOSS), ImageOps.posterize(photo, 3)]", "strip = Image.new(\"RGB\", (220, len(effects) * 160 + 10), \"black\")", "for i in range(len(effects)):", "    strip.paste(effects[i], (10, 10 + i * 160))", "strip.show()"] },
    { h: "3. A badge with a round photo and a name" },
    { ex: ["import io", "import requests", "from PIL import Image, ImageDraw, ImageFont", "", "name = input(\"Name on the badge: \")", "photo = Image.open(io.BytesIO(requests.get(\"https://picsum.photos/id/1025/300/300\").content))", "photo = photo.resize((200, 200))", "mask = Image.new(\"L\", (200, 200), 0)", "ImageDraw.Draw(mask).ellipse((0, 0, 199, 199), fill=255)", "badge = Image.new(\"RGB\", (260, 340), \"navy\")", "badge.paste(photo, (30, 30), mask)", "pen = ImageDraw.Draw(badge)", "pen.text((130, 280), name, font=ImageFont.load_default(size=32), fill=\"white\", anchor=\"mm\")", "badge.show()"] },
    { h: "4. Pixel art (shrink, reduce the colors, enlarge)" },
    { ex: ["import io", "import requests", "from PIL import Image, ImageOps", "", "photo = Image.open(io.BytesIO(requests.get(\"https://picsum.photos/id/1074/400/300\").content))", "small = photo.resize((32, 24), Image.Resampling.NEAREST)", "small = ImageOps.posterize(small, 2)", "art = small.resize((320, 240), Image.Resampling.NEAREST)", "art.show()"] },
    { h: "5. Generative art: a function used in a loop" },
    { ex: ["import random", "from PIL import Image, ImageDraw", "", "def ring(pen, cx, cy, radius, color):", "    pen.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), outline=color, width=3)", "", "art = Image.new(\"RGB\", (400, 300), \"black\")", "pen = ImageDraw.Draw(art)", "for i in range(40):", "    color = (random.randint(80, 255), random.randint(80, 255), random.randint(80, 255))", "    ring(pen, random.randint(0, 400), random.randint(0, 300), random.randint(10, 80), color)", "art.show()"] },
    { h: "6. Before and after, side by side" },
    { ex: ["import io", "import requests", "from PIL import Image, ImageDraw, ImageFilter", "", "photo = Image.open(io.BytesIO(requests.get(\"https://picsum.photos/id/1015/400/300\").content))", "photo.thumbnail((200, 200))", "after = photo.filter(ImageFilter.CONTOUR)", "both = Image.new(\"RGB\", (photo.width * 2 + 30, photo.height + 50), \"white\")", "both.paste(photo, (10, 40))", "both.paste(after, (photo.width + 20, 40))", "pen = ImageDraw.Draw(both)", "pen.text((10, 10), \"Before\", fill=\"black\")", "pen.text((photo.width + 20, 10), \"After\", fill=\"black\")", "both.show()"] }
  ] };

  var SKEL = `from PIL import Image, ImageDraw, ImageFont\n\ndef make_picture(text):\n    # make your picture here and return it\n    picture = Image.new("RGB", (400, 300), "navy")\n    return picture\n\n# main program\ntext = input("Type something: ")\nresult = make_picture(text)\nresult.show()\n`;
  var EXPLORE = `import io\nimport requests\nfrom PIL import Image\n\nresponse = requests.get("https://picsum.photos/id/1015/600/400")\nphoto = Image.open(io.BytesIO(response.content))\nprint(photo.size, photo.mode)\nphoto.show()\n`;

  /* ================================================================= 16. Your Picture App 1: Plan It ================ */
  C.add({
    num: 16, title: "Your Picture App 1: Plan It",
    intro: ["Now you design a picture-making program of **your own**. This is the project that shows everything you learned, and it is great practice for the AP **Create Performance Task**, where you plan and build your own program.",
      "Never start typing without a plan. In this walkthrough you choose an idea, **try the pieces you will need**, write a short **plan** as comments, and set up your starting code. You **build** it in Walkthrough 17 and **polish** it in Walkthrough 18."],
    learn: ["choosing an idea that is the right size", "testing a risky piece first", "writing a plan as comments", "breaking a big job into milestones", "planning where the AP requirements will go"],
    firstTips: ["c_ideas", "c_apmap"],
    stages: [
      { title: "Pick your idea", say: ["Open the **Project ideas** help. Choose **one** idea that you can finish in a few days. **Small and working** beats big and broken.", "Rules for the project: it must be **your own idea** (not a copy of a walkthrough), it must run in this editor, it must make a picture that **changes depending on what the user chooses**, and it needs a **list**, a **function with a parameter**, an **if**, and a **loop**."], help: ["c_ideas", "c_recipes"],
        do: ["Read **Project ideas** and **Recipes**. Choose an idea (or invent one).", "Say your idea to a classmate or your teacher in one sentence: \"My program asks the user for ______ and makes a picture of ______.\" Does it sound like something you can build in a few days?"] },
      { title: "Try the risky piece first", say: ["What is the piece you are **least sure** will work? Getting a photo from the web? Drawing text where you want it? Try it **now**, before you plan around it.", "Type this short program (it loads and shows a photo). Change the photo number, or replace the loading lines with whatever risky piece your project needs. Run it and make sure it works."], help: ["c_open", "c_debug", "b_typing"], code: EXPLORE,
        type: "Type the program, or your own version of the risky piece.", chk: [["importing from PIL", /^\s*from\s+PIL\s+import\s+\w/m], ["opening or making a picture", /Image\.(open|new)\(/], ["showing the picture", /\.show\(\s*\)/]],
        run: "A picture appears. If it does not, read the red message and open the **Debugging** help." },
      { title: "Describe the finished picture", say: ["Write what your **finished picture** will look like, in one or two sentences, as a comment at the very bottom of your file. Be specific about what will be **in it** and what the **user chooses**."],
        code: "# FINAL: (what will the finished picture show?)",
        type: "Type the `# FINAL:` line and describe your finished picture.", chk: [["# FINAL: with a real description", /^#[ \t]*FINAL:[ \t]*\S+([ \t]+\S+){3,}/m, 1, "comments"]] },
      { title: "Write the plan as comments", say: ["Now the plan. Type these labels at the very top of your file and fill each one in with your own words. Keep each to a sentence.", "Use this exact layout so the auto-check can read it:"],
        code: "# APP: (the name of your program)\n# GOAL: (what it makes and who would use it)\n# INPUT: (what the user types or chooses)\n# OUTPUT: (what the picture shows)\n# PICTURES: (where the pictures come from: the web, drawn, or both)",
        type: "Type the five labels at the top and fill each one in.", chk: [["# APP: with a name", /^#[ \t]*APP:[ \t]*\S+/m, 1, "comments"], ["# GOAL: with text", /^#[ \t]*GOAL:[ \t]*\S+/m, 1, "comments"], ["# INPUT: with text", /^#[ \t]*INPUT:[ \t]*\S+/m, 1, "comments"], ["# OUTPUT: with text", /^#[ \t]*OUTPUT:[ \t]*\S+/m, 1, "comments"], ["# PICTURES: with text", /^#[ \t]*PICTURES:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Break it into milestones", say: ["Build in small pieces that each **work** before you move on. Write five milestones in the order you will build them. A good order: (1) make or open a picture and show it, (2) draw or change it, (3) the user's input changes the picture, (4) decisions and repeating, (5) save it and handle problems.", "Write **your** version of each. Be specific."],
        code: "# MILESTONE 1: (make or open a picture and show it)\n# MILESTONE 2: (draw on it or change it)\n# MILESTONE 3: (the user's input changes the picture)\n# MILESTONE 4: (decisions and repeating)\n# MILESTONE 5: (save it and handle problems)",
        type: "Type five milestone lines for your program.", chk: [["five # MILESTONE lines with text", /^#[ \t]*MILESTONE[ \t]*\d:[ \t]*\S+/m, 5, "comments"]] },
      { title: "Plan where the AP requirements go", say: ["Your project needs these things. Decide **now** where each one will be, so you do not forget. (Open the **AP** help for what each means.)", "You can change your mind later. The point is to think about it first."], help: ["c_apmap"],
        code: "# LIST: (what will you store in a list?)\n# FUNCTION: (what will your function do? what parameter will it take? what picture will it return?)\n# IF: (what decision will your program make?)\n# LOOP: (what will repeat?)\n# TRY: (what could go wrong, and what will you do about it?)",
        type: "Type the five lines and fill them in.", chk: [["# LIST: with text", /^#[ \t]*LIST:[ \t]*\S+/m, 1, "comments"], ["# FUNCTION: with text", /^#[ \t]*FUNCTION:[ \t]*\S+/m, 1, "comments"], ["# IF: with text", /^#[ \t]*IF:[ \t]*\S+/m, 1, "comments"], ["# LOOP: with text", /^#[ \t]*LOOP:[ \t]*\S+/m, 1, "comments"], ["# TRY: with text", /^#[ \t]*TRY:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Set up your starting code", say: ["Under your comments, type this skeleton. It already has the shape of a good program: an import, a **function with a parameter** that **returns a picture**, and a short main program that asks the user, makes the picture and shows it. Rename `make_picture` to something that describes **your** function.", "Run it. A navy rectangle appears. That is **Milestone 1** done. You will build the real thing in the next walkthrough."], help: ["b_funcs"], code: SKEL,
        type: "Type the skeleton under your plan. Rename `make_picture` to fit your program.", chk: [["importing from PIL", /^\s*from\s+PIL\s+import\s+\w/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["input(...)", /\binput\(/], ["calling your function", function (text) { return P.userFnCalls(text); }, 1]],
        run: "A navy rectangle. Your starting point is ready." }
    ],
    check: false,
    finish: [],
    challenges: ["Explain your plan to a friend. If they cannot tell what the picture will look like, make the **OUTPUT** and **FINAL** lines clearer.", "Sketch your finished picture **on paper** and label the parts.", "Plan a second feature you could add at the very end."],
    tips: { c_ideas: IDEAS, c_recipes: RECIPES },
    recap: "You chose an idea, **tested the risky piece first**, wrote a plan, broke the work into milestones, and decided where a **list**, a **function with a parameter**, an **if**, a **loop** and **error handling** will go.",
    next: "**Next:** Walkthrough 17 is where you **build** your program, one milestone at a time."
  });

  /* ================================================================= 17. Your Picture App 2: Build It ================ */
  C.add({
    num: 17, title: "Your Picture App 2: Build It",
    intro: ["Now you build the program you planned. Work on **one milestone at a time**, and make sure each one runs before you start the next. If you get stuck, use the **Debugging** help and the **Recipes**.",
      "Copy your finished code from **Walkthrough 16** and paste it here (Ctrl + A, Ctrl + C, then Ctrl + V). Keep your plan comments at the top. The checks below look for general building blocks, so there are many right ways to do each step."],
    learn: ["turning a plan into working code a milestone at a time", "a function that makes and returns a picture", "decisions, loops and error handling in one program"],
    firstTips: ["c_debug", "c_recipes", "c_errors"],
    stages: [
      { title: "Bring your plan and skeleton", say: ["Paste your finished Walkthrough 16 code into this code box and run it. A navy rectangle should appear."], help: ["c16"],
        type: "Paste your Walkthrough 16 code into this code box.", chk: [["importing from PIL", /^\s*from\s+PIL\s+import\s+\w/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["input(...)", /\binput\(/]], run: "It runs and shows a navy rectangle." },
      { title: "Milestone 1: get your picture", say: ["Inside your function, make the picture your program starts from. That might be `Image.new(...)` with a size and a color from the user, or `Image.open(...)` for a photo downloaded with `requests` (do not forget `import io` and `import requests`).", "Keep `return picture` at the end of the function, and `result.show()` in the main program."], help: ["c_open", "c_pil", "b_typing"],
        type: "Make your function create or open a picture and `return` it.", chk: [["making or opening a picture", /Image\.(new|open)\(/], ["returning the picture from the function", /^\s+return\s+\w+/m], ["showing the result", /\.show\(\s*\)/]], run: "Your starting picture appears." },
      { title: "Milestone 2: draw or change it", say: ["Now do something to the picture **inside your function**: draw shapes or text with a pen, or paste, resize, rotate, crop or filter it. Do **at least three things**.", "Each one is a line you already know from an earlier walkthrough. Add them one at a time and **run after each**."], help: ["c_draw", "c_text", "c_filters", "c_enhance", "c_geometry", "c_alpha"],
        type: "Add at least three drawing or editing steps inside your function.", chk: [["at least three drawing or editing steps", /(\b(pen|draw)\.\w+\(|\.filter\(|ImageEnhance\.|ImageOps\.|\.paste\(|\.rotate\(|\.resize\(|\.crop\(|\.convert\(|\.transpose\()/, 3]], run: "Your picture now has something done to it." },
      { title: "Milestone 3: the user's input changes the picture", say: ["Make what the user types **change the result**. The `text` parameter might be words to draw, a color, a number of shapes, a Pokemon name, a photo number or a size. Use `input` (and `int(...)` or `.isdigit()` for numbers) and pass the answer into your function.", "Run it **twice with different answers** and check that the picture is different."], help: ["b_input", "b_funcs"],
        type: "Use what the user types inside your function so the picture changes.", chk: [["asking the user with input", /\binput\(/], ["your function is called with what the user typed", function (text) { return P.userFnCalls(text); }, 1]], run: "Two different answers give two different pictures." },
      { title: "Milestone 4: a list and a loop", say: ["Use a **list** and a **loop** to repeat something: draw many shapes, paste many photos, make many frames or try many filters. A list might hold colors, positions, filter functions, photo numbers or text lines.", "A loop over a list is a good way to avoid typing the same drawing lines again and again."], help: ["b_list", "c_loops"],
        type: "Add a list and a `for` loop that repeats something in your program.", chk: [["a list", /^\s*\w+\s*=\s*\[/m], ["a for loop", /^\s*for\s+\w+(\s*,\s*\w+)?\s+in\s+/m]], run: "Your picture now repeats a pattern or a list of things." },
      { title: "Milestone 5: decisions", say: ["Make your program **decide** things with `if`, `elif` and `else`. Ideas: a different color or effect depending on the user's choice, a different border for a big number, a message when the input is empty, or a special case for something the user typed.", "You need at least **two decisions**, and one of them should use `else` or `elif`."], help: ["b_menu", "b_input"],
        type: "Add at least two `if` decisions, including one `elif` or `else`.", chk: [["at least two if / elif lines", /^\s*(if|elif)\s/m, 2], ["an else or elif", /^\s*(else\s*:|elif\s)/m]], run: "Test every branch: make the program go down **every** path at least once." },
      { title: "Milestone 6: save it and handle problems", say: ["Save the finished picture with `.save(\"name.png\")` so the user can download it. Then protect your program from trouble: check that numbers are digits (`isdigit()`) before `int(...)`, check `response.status_code` if you download anything, and use `try` / `except` for things that can fail.", "Test it with a silly answer: an empty line, a word where a number belongs, a long text."], help: ["b_try", "c_files", "c_errors"],
        type: "Add a `.save(...)`, and add `isdigit()`, `status_code`, or `try` / `except` to handle a problem.", chk: [["saving the picture", /\.save\(\s*[^)\s]/], ["handling a problem", /\.isdigit\(\s*\)|status_code|^\s*try\s*:/m]], run: "A silly answer should give a friendly message, not a red error." },
      { title: "Milestone 7: use your function twice and repeat", say: ["Call your function from **two different places** in your code, so it is clearly doing real work. For example: once for a \"featured\" picture at the start and once for the user's choice. Then wrap the main program in a `while` loop so the user can make **another** picture, with a way to **quit**.", "Remember: `break` leaves a loop."], help: ["b_menu", "b_funcs"],
        type: "Call your function in two places, and add a `while` loop with a way to quit.", chk: [["a while loop", /^\s*while\s/m], ["a way out with break", /\bbreak\b/], ["your function called from two places", function (text) { return P.userFnCalls(text); }, 2]], run: "Make three pictures in a row, then quit." }
    ],
    check: false,
    finish: [],
    challenges: ["Let the user pick **how big** the picture is.", "Add a second **function with a parameter** and use it inside the first.", "Combine **requests** data from Appendix B into your picture.", "Make the program **remember** each picture's name in a list and print them all when the user quits."],
    tips: { c16: C.bring(16, SKEL), c_recipes: RECIPES },
    recap: "You built a program from a plan, one milestone at a time. It has a **function with a parameter** that returns a picture, a **list and a loop**, **decisions**, **saving** and **error handling**. Those are the exact building blocks the AP Create Task looks for.",
    next: "**Next:** Walkthrough 18 is where you **test, fix, polish and reflect**."
  });

  /* ================================================================= 18. Your Picture App 3: Test, Polish and Share ================ */
  C.add({
    num: 18, title: "Your Picture App 3: Test, Polish and Share",
    intro: ["A program is not done when it first works. It is done when **other people can use it** without help. In this last walkthrough you **test** your program with real people, **fix** what breaks, **polish** it, and write a short **reflection**.",
      "Copy your finished code from **Walkthrough 17** and paste it here. Then work down the steps."],
    learn: ["testing with other people", "finding and fixing bugs", "polish: what makes a program feel finished", "reflecting on what you built"],
    firstTips: ["c_debug", "c_errors", "c_recipes"],
    stages: [
      { title: "Bring your program with you", say: ["Paste your finished Walkthrough 17 code into this code box and run it."],
        type: "Paste your Walkthrough 17 code into this code box.", chk: [["importing from PIL", /^\s*from\s+PIL\s+import\s+\w/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["a loop", /^\s*(for|while)\s/m]], run: "Your program runs." },
      { title: "Test it with other people", say: ["Find **two people** (not you!). Ask them to use your program **without** your help. Do not explain it. Watch, and write down what confuses them or what breaks.", "Things to look for: Did they know what to type? Did the picture look the way they expected? Did anything crash? What did they type that you never thought of (an empty answer, a number, very long text, capital letters)?"],
        do: ["Have **two different people** use your program for at least a minute each.", "Write down **three** things that confused them, broke, or looked wrong. (Keep your notes. You will type them in a minute.)"] },
      { title: "Write your test notes as comments", say: ["Type your three findings as comments at the very **bottom** of your file, and one more line saying what you changed to fix each one.", "Use this layout:"],
        code: "# TEST 1: (what the user found)\n# FIX 1: (what you changed)\n# TEST 2: (what the user found)\n# FIX 2: (what you changed)\n# TEST 3: (what the user found)\n# FIX 3: (what you changed)",
        type: "Type the six lines at the bottom of your file and fill them in.", chk: [["three # TEST notes", /^#[ \t]*TEST[ \t]*\d:[ \t]*\S+/m, 3, "comments"], ["three # FIX notes", /^#[ \t]*FIX[ \t]*\d:[ \t]*\S+/m, 3, "comments"]] },
      { title: "Fix the three problems", say: ["Now make each fix. Run your program after each one to make sure you fixed it and did not break something else.", "If you cannot fix one, write what you tried in the FIX comment."], help: ["c_debug", "c_errors"],
        do: ["Fix finding **1**. Run the program.", "Fix finding **2**. Run the program.", "Fix finding **3**. Run the program."] },
      { title: "Polish checklist", say: ["Polish is the difference between \"it works\" and \"it feels like a real program.\" Pick **at least four** from this list and add them:"],
        do: ["**Instructions** printed at the start: what is this program and what do I type?", "**Clean input**: use `.strip()` and `.lower()` so capital letters and extra spaces do not matter.", "A **friendly message** for every problem: bad number, empty answer, no internet, photo not found.", "**Sharper design**: consistent colors, text that is centered and easy to read (an outline or a shadow), a border or margin.", "A **label** on your picture with the choice that made it (a caption or a title).", "A **good default** when the user just presses Enter.", "A **goodbye message** and a **count** of how many pictures were made."] },
      { title: "Write your reflection", say: ["Reflecting is how you learn from a project. Type your answers as comments at the very **bottom** of your file. Write a full sentence or two for each.", "Use this layout:"],
        code: "# REFLECTION 1: (What part of your program are you proudest of, and why?)\n# REFLECTION 2: (What was the hardest bug, and how did you fix it?)\n# REFLECTION 3: (Name your list, your function and its parameter, an if, and a loop.)\n# REFLECTION 4: (What would you add if you had another week?)",
        type: "Type the four reflection lines and answer each one.", chk: [["four # REFLECTION answers", /^#[ \t]*REFLECTION[ \t]*\d:[ \t]*\S+([ \t]+\S+){4,}/m, 4, "comments"]] },
      { title: "Final check", say: ["Run your program one last time. Then read it from top to bottom like a stranger would. Is anything confusing? Are your comments clear? Then you are done."],
        chk: [["importing from PIL", /^\s*from\s+PIL\s+import\s+\w/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["a list", /^\s*\w+\s*=\s*\[/m], ["a loop", /^\s*(for|while)\s/m], ["at least two if statements", /^\s*if\s/m, 2], ["saving a picture", /\.save\(\s*[^)\s]/], ["showing a picture", /\.show\(\s*\)/], ["at least ten comments", /^\s*#\s*\S+/m, 10, "comments"]],
        type: "Your finished program uses Pillow, a list, a function with a parameter, a loop, at least two if statements, saves and shows a picture, and has at least ten comments.", run: "Use it one more time. You built this." }
    ],
    check: false,
    finish: [],
    challenges: ["Teach a friend how to build one piece of your program. Teaching is the best test of whether you understand it.", "Look at the AP CSP Create Task rubric. Which of your program's features would show each requirement?", "Show your best picture to the class and explain the **function** that made it.", "Start another project! Which recipe would you try next?"],
    tips: { c_recipes: RECIPES },
    recap: "You planned, built, tested, fixed and polished a picture program of your own, the same steps professional developers follow. You used the full toolkit: **Pillow**, drawing, filters, **a list**, **a function with a parameter**, **selection**, **iteration** and **error handling**.",
    next: "**Congratulations! You finished Appendix C.** You can now make and edit pictures with Python, from a single pixel to an animated GIF."
  });

  /* tip topics that the other walkthroughs open from their help lists */
  P.TIPS.c_ideas = IDEAS; P.TIPS.c_recipes = RECIPES;
})(typeof window !== "undefined" ? window : globalThis);
