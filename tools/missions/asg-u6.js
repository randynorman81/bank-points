/* UNIT 6 ASSIGNMENTS (6.1 to 6.3): the Create Task practice. One real program per assignment in the order the Create Task walkthroughs use: plan comments, input, list, procedure, call and output, then the notes a reviewer looks for. */
"use strict";
const { V, FN, note, S, X, WK, def, OUT, splice } = require("./asg-kit.js");

/* ---------------------------------------------------------------- 6.1 */
const PK_1 = `# INPUT: the program asks the trainer which type of Pokemon to count\nchoice = input("Pokemon type: ")\n\n# LIST: the list stores the type of every Pokemon the trainer has caught\ncaught = ["fire", "water", "fire", "grass", "fire", "water"]`;
const PK_2 = `\n\n# PROCEDURE: count_type counts how many items in the list match the target type and returns that number\ndef count_type(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count`;
const PK_3 = `\n\n# CALL: this call counts the trainers chosen type inside the caught list\nresult = count_type(caught, choice)\nprint("Caught:", result)\n# CHECK: the list is caught and the procedure count_type has a parameter and uses an if inside a for loop`;
def("u6l1", "Pokémon GO Create Task Rules", ["**You are on the Niantic team that makes Pokémon GO.** A trainer wants to know how many Pokémon of one type they have caught. You will build the smallest program that meets **every Create Task requirement**: input, a list, a procedure with a parameter, iteration, selection, a return value, a call and an output. Label each requirement in a comment as you go."],
  ["input", "a list", "a procedure with a parameter", "iteration", "selection", "a return value", "calling the procedure and showing the output"], [
  S("Input and the list", ["Ask the trainer `Pokemon type: ` and store the answer in **`choice`**. Add a comment on its own line above it that begins `# INPUT:` and says in at least five words what the program asks the user for. Then make a list named **`caught`** with these six types in order: `fire`, `water`, `fire`, `grass`, `fire`, `water`, with a comment above it that begins `# LIST:` and says in at least five words what the list stores."],
    "Write the two comments, the input and the list.", PK_1,
    [["a comment that begins INPUT", note("INPUT", 5), 1, "comments"], ["choice comes from input", /^\s*choice\s*=\s*input\(/m], ["a LIST comment", note("LIST", 5), 1, "comments"], ["caught holds the six types", V("caught", "\\[\\s*[\"']fire[\"']\\s*,\\s*[\"']water[\"']\\s*,\\s*[\"']fire[\"']\\s*,\\s*[\"']grass[\"']\\s*,\\s*[\"']fire[\"']\\s*,\\s*[\"']water[\"']\\s*\\]")]],
    "Run it and type fire."),
  S("The procedure", ["Write a procedure named **`count_type`** with **two parameters**, `items` and `target`. It must start a **count** at `0`, use a **for loop** to look at every item, use an **if** to compare each item with the target and add 1 on a match, and **return the count** after the loop. Add a comment above it that begins `# PROCEDURE:` and says in at least eight words what it does."],
    "Write the procedure and its comment.", PK_2,
    [["a PROCEDURE comment", note("PROCEDURE", 8), 1, "comments"], ["a procedure with two parameters", FN("count_type", "items\\s*,\\s*target")], ["a for loop over items (iteration)", /^\s+for\s+item\s+in\s+items\s*:/m], ["an if that compares with the target (selection)", /^\s+if\s+item\s*==\s*target\s*:/m], ["returning the count", /^\s+return\s+count\s*$/m]],
    "Run it. Nothing prints yet because the procedure is not called."),
  S("Call it and check the requirements", ["Call `count_type` with the list and the trainer's choice, store the answer in **`result`**, and print `Caught:` followed by `result`. Add a comment above the call that begins `# CALL:` and says in at least five words what the call does. Finish with a comment that begins `# CHECK:` and lists, in at least twelve words, the three requirements you can point at in your code: the **list**, the **procedure with a parameter** and the **selection inside the iteration**."],
    "Write the call, the print and the two comments.", PK_3,
    [["a CALL comment", note("CALL", 5), 1, "comments"], ["calling count_type with two arguments", /^\s*result\s*=\s*count_type\(\s*caught\s*,\s*choice\s*\)/m], ["printing the result", /print\(\s*["']Caught:["']\s*,\s*result\s*\)/], ["a CHECK comment of twelve or more words", note("CHECK", 12), 1, "comments"]],
    "Run it with fire.", [["Caught: 3", OUT("Caught: 3")]]),
  X("Other types", ["Ren asks, if you have time: trainers want to check the other types. Under the call, print `Water:` followed by `count_type(caught, \"water\")` and `Grass:` followed by `count_type(caught, \"grass\")`. Add a comment that begins `# TEST:` and says in at least eight words why calling the same procedure with different arguments is a good test."],
    "Write the two prints and the comment.", `\nprint("Water:", count_type(caught, "water"))\nprint("Grass:", count_type(caught, "grass"))\n# TEST: the same procedure should work for every type so each new argument is another test of the same code`,
    [["a call with water", /count_type\(\s*caught\s*,\s*["']water["']\s*\)/], ["a call with grass", /count_type\(\s*caught\s*,\s*["']grass["']\s*\)/], ["a TEST comment of eight or more words", note("TEST", 8), 1, "comments"]],
    "Run it with fire.", [["Water: 2", OUT("Water: 2")], ["Grass: 1", OUT("Grass: 1")]]),
  X("Share of the box", ["Print `Total caught:` followed by how many Pokemon are in the list (use `len`). Then print `Share of choice:` followed by the **percent** of the caught Pokemon that match the trainer's choice (the count times 100, divided by the length of the list). Add a comment that begins `# SHARE:` and says in at least eight words what the share tells the trainer."],
    "Write the two prints and the comment.", `print("Total caught:", len(caught))\nprint("Share of choice:", count_type(caught, choice) * 100 / len(caught))\n# SHARE: the share tells the trainer what part of the whole collection is the chosen type`,
    [["the length of the list", /print\(\s*["']Total caught:["']\s*,\s*len\(\s*caught\s*\)\s*\)/], ["the count times 100 divided by the length", /count_type\(\s*caught\s*,\s*choice\s*\)\s*\*\s*100\s*\/\s*len\(\s*caught\s*\)/], ["a SHARE comment of eight or more words", note("SHARE", 8), 1, "comments"]],
    "Run it with fire.", [["Total caught: 6", OUT("Total caught: 6")], ["Share of choice: 50.0", OUT("Share of choice: 50.0")]])],
  [{ answers: [["type", "fire"]] }]);
WK("u6l1", { brand: ["Pokémon GO", "#D9330D", "#ffffff", "#D9330D", "900 24px Arial,Helvetica,sans-serif", "-0.5px"], team: "Collection Team", boss: ["Ren Takahashi", "Collection Tools Engineer"], ticket: "COL-1170", file: "create_task.py",
  subject: "Counting caught Pokémon (a Create Task checklist)", hi: "Hi, welcome to the Collection team!",
  job: "A trainer wants to know how many Pokémon of one type they've caught. You'll build the smallest program that meets **every Create Task requirement**: input, a list, a procedure with a parameter, iteration, selection, a return value, a call and an output. Label each requirement in a comment as you go, so a reviewer can find it.",
  filesNote: "`caught_today.txt` lists what the trainer caught, and `requirements.md` is the Create Task checklist.",
  docs: [["caught_today.txt", "CAUGHT TODAY\n\n  fire, water, fire, grass, fire, water\n\nThe trainer types a type to count, for example fire.\n\nSTRETCH TASKS\n  the water and grass counts\n  the share of the collection that matches the choice"], ["requirements.md", "CREATE TASK CHECKLIST (in the order the file is written)\n\n  [ ] input from the user\n  [ ] a list\n  [ ] a procedure with a parameter\n  [ ] iteration (a loop)\n  [ ] selection (an if)\n  [ ] a return value\n  [ ] a call to the procedure\n  [ ] an output"]],
  open: "Thanks, I went through your program with the checklist.",
  rv: [["The input and the list are there and labeled.", "The input or the list isn't done yet: ask the trainer, store the six types, and label both."],
    ["count_type has the loop, the if and the return, and it's labeled.", "count_type isn't right yet: a count, a loop, an if and a return."],
    ["The call and the output show 3 for fire, and your CHECK comment names the list, the parameter and the selection inside the iteration.", "The call, the output or the CHECK comment isn't right yet."],
    ["Other types give the right counts, and your TEST note is good.", "Stretch: the other types aren't done yet. It's optional."],
    ["The share of the collection is right, and your SHARE note explains it.", "Stretch: the share isn't done yet. Also optional."]],
  approve: "Every Create Task requirement is in your program and labeled.", done: "Trainers will love the share stat.", points: 50 });

/* ---------------------------------------------------------------- 6.2 */
const TT_1 = `# PURPOSE: count how many videos in a feed come from one creator\n# INPUT: the user types the name of a creator\n# OUTPUT: the program prints how many videos that creator has\n# FUNCTIONALITY: a loop checks every video creator against the one the user picked`;
const TT_2 = `\n\nfeed = ["mia", "alex", "mia", "jo", "mia"]\nchoice = input("Which creator? ")\n\ndef count_videos(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count\n\nprint("Videos:", count_videos(feed, choice))`;
const TT_3 = `\n\n# VIDEO CAPTION 1: the user types the name mia as the input\n# VIDEO CAPTION 2: the loop checks each creator in the feed\n# VIDEO CAPTION 3: the program prints that mia has 3 videos\n# PPR PROCEDURE: the count_videos procedure with its loop and if\n# PPR LIST: the feed list of creator names`;
const TT_CORE = TT_1 + TT_2 + TT_3, TT_M = "# VIDEO CAPTION 1";
const TT_X1 = `print("Alex videos:", count_videos(feed, "alex"))\nprint("Zed videos:", count_videos(feed, "zed"))\n# EDGE: a creator who is not in the feed should give zero and not crash so that edge case is worth testing\n\n`;
const TT_X2 = `\n# PPR PARAMETER: the items parameter holds the whole feed list\n# PPR ITERATION: the for loop inside count_videos visits every creator\n# PPR SELECTION: the if inside the loop compares each creator with the target\n# PPR RETURN: the procedure returns the count of matching videos`;
def("u6l2", "TikTok Create Task Plan", ["**You are a creator on TikTok planning your Create Task submission.** The submission has a **video of your program running** (with text captions instead of narration) and a **program code PDF** with two special segments for the Personalized Project Reference (PPR). Plan it as comments, build a small program, then label the parts."],
  ["the written plan", "video captions with no narration", "PPR segments: a procedure and a list", "a complete small program"], [
  S("The plan", ["Write four comment lines at the top. Each one is a label, a colon, then at least three words: `# PURPOSE:`, `# INPUT:`, `# OUTPUT:` and `# FUNCTIONALITY:`. The program will count how many videos by one creator are in a feed of creators."],
    "Type the four plan comments.", TT_1,
    [["a PURPOSE note", note("PURPOSE"), 1, "comments"], ["an INPUT note", note("INPUT"), 1, "comments"], ["an OUTPUT note", note("OUTPUT"), 1, "comments"], ["a FUNCTIONALITY note", note("FUNCTIONALITY"), 1, "comments"]],
    "Run it. Nothing happens because it is only comments."),
  S("The program", ["Make a list **`feed`** with at least four creator names, with `mia` in it **three times** (such as `mia`, `alex`, `mia`, `jo`, `mia`). Ask `Which creator? ` and store the answer in **`choice`**. Then write a procedure named **`count_videos`** with two parameters, `items` and `target`. It loops over the items, uses an if to compare each one with the target, adds 1 for each match and **returns** the count. Print `Videos:` followed by `count_videos(feed, choice)`."],
    "Write the list, the input, the procedure and the print.", TT_2,
    [["a list of creators", /^\s*feed\s*=\s*\[/m], ["mia in the list three times", /["']mia["']/, 3], ["choice comes from input", /^\s*choice\s*=\s*input\(/m], ["a procedure with two parameters", FN("count_videos", "items\\s*,\\s*target")], ["a loop and an if inside", /^\s+if\s+item\s*==\s*target\s*:/m], ["calling count_videos in the print", /print\(.*count_videos\(\s*feed\s*,\s*choice\s*\)/]],
    "Run it with mia.", [["Videos: 3", OUT("Videos: 3")]]),
  S("Captions and PPR notes", ["The video cannot have voice narration, so you add **text captions**. Add three comments: `# VIDEO CAPTION 1:` shows the **input**, `# VIDEO CAPTION 2:` shows the **functionality**, and `# VIDEO CAPTION 3:` shows the **output**. The PPR needs two screenshots of your code, so also add `# PPR PROCEDURE:` naming the **procedure** you would screenshot and `# PPR LIST:` naming the **list** you would screenshot. Each one needs at least three words."],
    "Write the three captions and the two PPR notes.", TT_3,
    [["three video captions", note("VIDEO CAPTION \\d"), 3, "comments"], ["a PPR PROCEDURE note", note("PPR PROCEDURE"), 1, "comments"], ["a PPR LIST note", note("PPR LIST"), 1, "comments"]],
    "Run it one last time with mia.", [["Videos: 3", OUT("Videos: 3")]]),
  X("Other creators", ["Camila asks, if you have time: reviewers want to see more than one test. Add two prints **above the video captions**: `Alex videos:` followed by `count_videos(feed, \"alex\")` and `Zed videos:` followed by `count_videos(feed, \"zed\")` (a creator who is **not** in the feed). Add a comment that begins `# EDGE:` and says in at least eight words why testing a creator with zero videos matters."],
    "Write the two prints and the comment above the captions.", "",
    [["a call with alex", /count_videos\(\s*feed\s*,\s*["']alex["']\s*\)/], ["a call with zed", /count_videos\(\s*feed\s*,\s*["']zed["']\s*\)/], ["an EDGE comment of eight or more words", note("EDGE", 8), 1, "comments"]],
    "Run it with mia.", [["Alex videos: 1", OUT("Alex videos: 1")], ["Zed videos: 0", OUT("Zed videos: 0")]], splice(TT_CORE, TT_M, TT_X1)),
  X("More PPR notes", ["The scorers look for more than a procedure and a list. At the very end add four comments, each with at least three words: `# PPR PARAMETER:` names a **parameter** of your procedure, `# PPR ITERATION:` says where the **loop** is, `# PPR SELECTION:` says where the **if** is, and `# PPR RETURN:` says what the procedure **returns**."],
    "Write the four PPR notes.", "",
    [["a PPR PARAMETER note", note("PPR PARAMETER"), 1, "comments"], ["a PPR ITERATION note", note("PPR ITERATION"), 1, "comments"], ["a PPR SELECTION note", note("PPR SELECTION"), 1, "comments"], ["a PPR RETURN note", note("PPR RETURN"), 1, "comments"]],
    "Run it one last time with mia.", [["Videos: 3", OUT("Videos: 3")]], splice(TT_CORE, TT_M, TT_X1) + TT_X2)],
  [{ answers: [["creator", "mia"]] }]);
WK("u6l2", { brand: ["TikTok", "#FE2C55", "#010101", "#ffffff", "900 24px 'Helvetica Neue',Arial,sans-serif", "-1px"], team: "Creator Tools", boss: ["Camila Reyes", "Creator Tools Engineer"], ticket: "CRT-6202", file: "plan_and_build.py",
  subject: "Plan the submission, then build it (video captions and PPR notes)", hi: "Hi, welcome to Creator Tools!",
  job: "You're planning a Create Task submission: a **video of your program running** (with text captions instead of narration) and a **program code PDF** with two special segments for the Personalized Project Reference. Plan it as comments, build a small program that counts a creator's videos in a feed, then label the parts a reviewer will look for.",
  filesNote: "`feed_data.txt` has the sample feed, and `submission_checklist.md` lists what the reviewers want.",
  docs: [["feed_data.txt", "SAMPLE FEED\n\n  mia, alex, mia, jo, mia\n\nThe user types the creator to count, for example mia.\n\nSTRETCH TASKS\n  tests for alex and for a creator who isn't in the feed\n  four more PPR notes"], ["submission_checklist.md", "SUBMISSION CHECKLIST (in file order)\n\n  PLAN    purpose, input, output, functionality\n  CODE    the list, the input, the procedure, the output\n  VIDEO   captions, because there is no voice narration\n  PPR     a screenshot of the procedure and a screenshot of the list"]],
  open: "Thanks, I read through your plan and your program.",
  rv: [["The four plan comments are there.", "The plan isn't complete yet: purpose, input, output and functionality."],
    ["The feed has mia three times, count_videos returns the count, and the program prints 3 for mia.", "The program isn't right yet: the list, the input, and count_videos with a loop, an if and a return."],
    ["All three video captions and the two PPR notes are written.", "The video captions or the PPR notes aren't all there yet."],
    ["The extra tests cover a creator with one video and one with none. Reviewers like that.", "Stretch: the extra tests aren't done yet. It's optional."],
    ["The four extra PPR notes make the code easy to review.", "Stretch: the extra PPR notes aren't done yet. Also optional."]],
  approve: "The plan, the captions and the PPR notes are all ready.", done: "I'm using your PPR notes as the example for the next class.", points: 50 });

/* ---------------------------------------------------------------- 6.3 */
const CR_1 = `# PURPOSE: count how many crayons of one color are in a box of crayons\n# INPUT: the user picks one color by typing its name\n# OUTPUT: the program prints how many crayons match that color\n\ncolors = ["red", "blue", "red", "green", "red", "blue"]\nchoice = input("Pick a color: ")`;
const CR_2 = `\n\ndef count_matches(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count`;
const CR_3 = `\n\nprint("Matches:", count_matches(colors, choice))\nprint("Blue matches:", count_matches(colors, "blue"))\n\n# TEST 1: typing red prints Matches: 3 because red appears three times\n# TEST 2: typing green prints Matches: 1 because green appears one time`;
const CR_CORE = CR_1 + CR_2 + CR_3, CR_M = "# TEST 1:";
const CR_X1 = `print("Green matches:", count_matches(colors, "green"))\nprint("Purple matches:", count_matches(colors, "purple"))\n\n`, CR_X1T = `\n# TEST 3: purple is not in the box so the program prints Matches: 0`;
const CR_X2 = `total_crayons = len(colors)\nprint("Crayons in box:", total_crayons)\nprint("Percent:", count_matches(colors, choice) * 100 / total_crayons)\n# WHY: if the box ever gets more colors len updates by itself but a typed six would silently give wrong answers\n\n`;
def("u6l3", "Crayola Color Counter", ["**You are a developer at Crayola.** Every box of crayons has a list of colors, and the factory wants to know how many of a chosen color are in the box. **This is the practice Create Task program.** Build the Color Counter yourself and prove it with tests."],
  ["a complete Create Task program", "the plan", "the input and the list", "the procedure", "two calls with different arguments", "your own tests"], [
  S("Plan, input and list", ["Start with three comments: `# PURPOSE:`, `# INPUT:` and `# OUTPUT:`. Each one is a label, a colon, then at least five words about the program. Then make a list **`colors`** with exactly these six items in this order: `red`, `blue`, `red`, `green`, `red`, `blue`, and ask `Pick a color: ` and store the answer in **`choice`**."],
    "Write the three plan comments, the list and the input.", CR_1,
    [["a PURPOSE note", note("PURPOSE", 5), 1, "comments"], ["an INPUT note", note("INPUT", 5), 1, "comments"], ["an OUTPUT note", note("OUTPUT", 5), 1, "comments"], ["the colors list with the six items", /^\s*colors\s*=\s*\[(?:\s*["']\w+["']\s*,?){6}\s*\]/m], ["red in the list", /["']red["']/, 3], ["input from the user", /^\s*choice\s*=\s*input\(/m]],
    "Run it and type red."),
  S("The procedure", ["Write a procedure named **`count_matches`** with two parameters, `items` and `target`. It starts a count at `0`, uses a **for loop** over the items, uses an **if** to compare each item with the target and adds 1 on a match, and **returns the count**."],
    "Write the procedure.", CR_2,
    [["a procedure with two parameters", FN("count_matches", "items\\s*,\\s*target")], ["a for loop over items", /^\s+for\s+item\s+in\s+items\s*:/m], ["an if that compares with the target", /^\s+if\s+item\s*==\s*target\s*:/m], ["a return of the count", /^\s+return\s+count\s*$/m]],
    "Run it. Nothing prints yet."),
  S("Two calls and your tests", ["Print `Matches:` followed by `count_matches(colors, choice)`. Then print `Blue matches:` followed by `count_matches(colors, \"blue\")`. Two different arguments give two different answers. Real programmers write down their tests, so add two comments: `# TEST 1:` says what happens when you type `red` and `# TEST 2:` says what happens when you type `green`. Each one must include the **number** the program prints for that color."],
    "Write the two prints and the two test comments.", CR_3,
    [["a call with choice", /count_matches\(\s*colors\s*,\s*choice\s*\)/], ["a call with blue", /count_matches\(\s*colors\s*,\s*["']blue["']\s*\)/], ["TEST 1 with the answer 3", /TEST 1:.*\b3\b/, 1, "comments"], ["TEST 2 with the answer 1", /TEST 2:.*\b1\b/, 1, "comments"]],
    "Run it with red. Then try green and check your TEST 2.", [["Matches: 3", OUT("Matches: 3")], ["Blue matches: 2", OUT("Blue matches: 2")]]),
  X("More colors", ["Hannah asks, if you have time: add two more prints **above your test comments**: `Green matches:` followed by `count_matches(colors, \"green\")` and `Purple matches:` followed by `count_matches(colors, \"purple\")` (a color that is **not** in the box). At the very end add a third test comment that begins `# TEST 3:` and includes the **number** the purple test prints."],
    "Write the two prints above the tests and the test comment at the end.", "",
    [["a call with green", /count_matches\(\s*colors\s*,\s*["']green["']\s*\)/], ["a call with purple", /count_matches\(\s*colors\s*,\s*["']purple["']\s*\)/], ["TEST 3 with the answer 0", /TEST 3:.*\b0\b/, 1, "comments"]],
    "Run it with red.", [["Green matches: 1", OUT("Green matches: 1")], ["Purple matches: 0", OUT("Purple matches: 0")]], splice(CR_CORE, CR_M, CR_X1) + CR_X1T),
  X("Percent of the box", ["Above your test comments, store the number of crayons in the box in **`total_crayons`** (use `len`, do not type 6) and print `Crayons in box:` followed by it. Then print `Percent:` followed by the percent of the box that matches the chosen color (the count times 100, divided by `total_crayons`). Add a comment that begins `# WHY:` and says in at least ten words why it is better to use `len` than to type the number 6."],
    "Write the variable, the two prints and the comment above the tests.", "",
    [["total_crayons from len(colors)", /^\s*total_crayons\s*=\s*len\(\s*colors\s*\)/m], ["the count times 100 divided by total_crayons", /count_matches\(\s*colors\s*,\s*choice\s*\)\s*\*\s*100\s*\/\s*total_crayons/], ["a WHY comment of ten or more words", note("WHY", 10), 1, "comments"]],
    "Run it with red.", [["Crayons in box: 6", OUT("Crayons in box: 6")], ["Percent: 50.0", OUT("Percent: 50.0")]], splice(splice(CR_CORE, CR_M, CR_X1), CR_M, CR_X2) + CR_X1T)],
  [{ answers: [["color", "red"]] }]);
WK("u6l3", { brand: ["Crayola", "#D6211B", "#D6211B", "#FFD400", "900 italic 26px Georgia,serif", "0"], team: "Production Software", boss: ["Hannah Kowalski", "Production Software Engineer"], ticket: "PRD-3318", file: "color_counter.py",
  subject: "Color counter for the box packer (a practice Create Task)", hi: "Hi, welcome to Production Software!",
  job: "Every box of crayons has a list of colors, and the factory wants to know how many of a chosen color are in the box. This is also your **practice Create Task**: plan it, build the program yourself, and prove it with tests you write down.",
  filesNote: "`box_contents.txt` lists one box, and `test_plan.md` explains how we write tests.",
  docs: [["box_contents.txt", "ONE BOX\n\n  red, blue, red, green, red, blue\n\nThe packer types a color to count: red, blue or green.\n\nSTRETCH TASKS\n  green and purple counts, and a third test\n  the percent of the box"], ["test_plan.md", "TEST PLAN\n\n  - write each test as a comment at the end of the file: what you type and what the program prints\n  - include the number the program prints\n  - test a color that is in the box and one that is not"]],
  open: "Thanks, I counted a few boxes with your program.",
  rv: [["The plan is clear, and the list and the input are ready.", "The plan, the list or the input isn't right yet: purpose, input and output comments, then the six colors in order and the question."],
    ["count_matches has the loop, the if and the return.", "count_matches isn't right yet."],
    ["Two calls with two different arguments give two different answers, and your two tests have the correct numbers.", "The two calls or the test comments aren't right yet: each test needs the number the program prints."],
    ["Green and purple both give the right counts, including zero.", "Stretch: the extra colors aren't done yet. It's optional."],
    ["The percent of the box is right, and your WHY note is correct.", "Stretch: the percent isn't done yet. Also optional."]],
  approve: "The program and its tests all check out.", done: "The percent of the box is going into the packer screen." });

module.exports = {};
