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
/* The practice Create Task walkthrough (a36) builds a COUNTER (colors in a list). This assignment is a different program with the same Create Task parts: a TOTAL that only adds the runs that are long enough. */
const ST_1 = `# PURPOSE: add up the kilometers of the runs that are at least as long as a chosen distance\n# INPUT: the user types the shortest run to count, in kilometers\n# OUTPUT: the program prints the total kilometers of the runs that count\n\nruns = [5, 12, 8, 3, 10, 7]\nminimum = int(input("Shortest run to count: "))`;
const ST_2 = `\n\ndef total_distance(distances, shortest):\n    total = 0\n    for distance in distances:\n        if distance >= shortest:\n            total = total + distance\n    return total`;
const ST_3 = `\n\nprint("Total km:", total_distance(runs, minimum))\nprint("Long runs km:", total_distance(runs, 10))\n\n# TEST 1: typing 8 prints Total km: 30 because the runs of 12 and 8 and 10 count\n# TEST 2: typing 1 prints Total km: 45 because every run counts`;
const ST_CORE = ST_1 + ST_2 + ST_3, ST_M = "# TEST 1:";
const ST_X1 = `print("All km:", total_distance(runs, 0))\nprint("Ultra km:", total_distance(runs, 50))\n\n`, ST_X1T = `\n# TEST 3: the minimum 50 is longer than every run so the program prints Ultra km: 0`;
const ST_X2 = `run_count = len(runs)\nprint("Runs:", run_count)\nprint("Average km:", total_distance(runs, 0) / run_count)\n# WHY: if the week ever gets more runs len updates by itself but a typed six would silently give wrong answers\n\n`;
def("u6l3", "Strava Weekly Distance", ["**You are a developer at Strava.** Every week an athlete logs a list of runs, and the app wants the total distance of only the runs that are long enough to count. **This is the practice Create Task program.** Build the Weekly Distance program yourself and prove it with tests."],
  ["a complete Create Task program", "the plan", "the input and the list", "the procedure", "two calls with different arguments", "your own tests"], [
  S("Plan, input and list", ["Start with three comments: `# PURPOSE:`, `# INPUT:` and `# OUTPUT:`. Each one is a label, a colon, then at least five words about the program. Then make a list **`runs`** with exactly these six distances in this order: `5`, `12`, `8`, `3`, `10`, `7`, and ask `Shortest run to count: ` and store the whole-number answer in **`minimum`**."],
    "Write the three plan comments, the list and the input.", ST_1,
    [["a PURPOSE note", note("PURPOSE", 5), 1, "comments"], ["an INPUT note", note("INPUT", 5), 1, "comments"], ["an OUTPUT note", note("OUTPUT", 5), 1, "comments"], ["the runs list with the six distances", /^\s*runs\s*=\s*\[\s*5\s*,\s*12\s*,\s*8\s*,\s*3\s*,\s*10\s*,\s*7\s*\]/m], ["a whole number from the user", /^\s*minimum\s*=\s*int\(\s*input\(/m]],
    "Run it and type 8."),
  S("The procedure", ["Write a procedure named **`total_distance`** with two parameters, `distances` and `shortest`. It starts a total at `0`, uses a **for loop** over the distances, uses an **if** to check that each distance is **at least** `shortest` and adds that distance to the total, and **returns the total**."],
    "Write the procedure.", ST_2,
    [["a procedure with two parameters", FN("total_distance", "distances\\s*,\\s*shortest")], ["a for loop over distances", /^\s+for\s+distance\s+in\s+distances\s*:/m], ["an if that compares with shortest", /^\s+if\s+distance\s*>=\s*shortest\s*:/m], ["adding the distance to the total", /^\s+total\s*=\s*total\s*\+\s*distance\s*$/m], ["a return of the total", /^\s+return\s+total\s*$/m]],
    "Run it. Nothing prints yet."),
  S("Two calls and your tests", ["Print `Total km:` followed by `total_distance(runs, minimum)`. Then print `Long runs km:` followed by `total_distance(runs, 10)`. Two different arguments give two different answers. Real programmers write down their tests, so add two comments: `# TEST 1:` says what happens when you type `8` and `# TEST 2:` says what happens when you type `1`. Each one must include the **number** the program prints."],
    "Write the two prints and the two test comments.", ST_3,
    [["a call with minimum", /total_distance\(\s*runs\s*,\s*minimum\s*\)/], ["a call with 10", /total_distance\(\s*runs\s*,\s*10\s*\)/], ["TEST 1 with the answer 30", /TEST 1:.*\b30\b/, 1, "comments"], ["TEST 2 with the answer 45", /TEST 2:.*\b45\b/, 1, "comments"]],
    "Run it with 8. Then try 1 and check your TEST 2.", [["Total km: 30", OUT("Total km: 30")], ["Long runs km: 22", OUT("Long runs km: 22")]]),
  X("More distances", ["Maya asks, if you have time: add two more prints **above your test comments**: `All km:` followed by `total_distance(runs, 0)` and `Ultra km:` followed by `total_distance(runs, 50)` (a minimum that **no** run reaches). At the very end add a third test comment that begins `# TEST 3:` and includes the **number** the ultra test prints."],
    "Write the two prints above the tests and the test comment at the end.", "",
    [["a call with 0", /total_distance\(\s*runs\s*,\s*0\s*\)/], ["a call with 50", /total_distance\(\s*runs\s*,\s*50\s*\)/], ["TEST 3 with the answer 0", /TEST 3:.*\b0\b/, 1, "comments"]],
    "Run it with 8.", [["All km: 45", OUT("All km: 45")], ["Ultra km: 0", OUT("Ultra km: 0")]], splice(ST_CORE, ST_M, ST_X1) + ST_X1T),
  X("Average run", ["Above your test comments, store the number of runs in **`run_count`** (use `len`, do not type 6) and print `Runs:` followed by it. Then print `Average km:` followed by the total of **all** the runs divided by `run_count`. Add a comment that begins `# WHY:` and says in at least ten words why it is better to use `len` than to type the number 6."],
    "Write the variable, the two prints and the comment above the tests.", "",
    [["run_count from len(runs)", /^\s*run_count\s*=\s*len\(\s*runs\s*\)/m], ["the total of all runs divided by run_count", /total_distance\(\s*runs\s*,\s*0\s*\)\s*\/\s*run_count/], ["a WHY comment of ten or more words", note("WHY", 10), 1, "comments"]],
    "Run it with 8.", [["Runs: 6", OUT("Runs: 6")], ["Average km: 7.5", OUT("Average km: 7.5")]], splice(splice(ST_CORE, ST_M, ST_X1), ST_M, ST_X2) + ST_X1T)],
  [{ answers: [["Shortest", "8"]] }]);
WK("u6l3", { brand: ["STRAVA", "#FC4C02", "#FC4C02", "#ffffff", "900 italic 24px Arial,Helvetica,sans-serif", "1px"], team: "Activity Features", boss: ["Maya Chen", "Activity Features Engineer"], ticket: "ACT-3318", file: "weekly_distance.py",
  subject: "Weekly distance for the athlete summary (a practice Create Task)", hi: "Hi, welcome to Activity Features!",
  job: "Every week an athlete logs a list of runs, and the summary screen shows the total distance of only the runs that are long enough to count. This is also your **practice Create Task**: plan it, build the program yourself, and prove it with tests you write down.",
  filesNote: "`week_log.txt` lists one athlete's week, and `test_plan.md` explains how we write tests.",
  docs: [["week_log.txt", "ONE WEEK (kilometers)\n\n  5, 12, 8, 3, 10, 7\n\nThe athlete types the shortest run to count, like 8 or 1.\n\nSTRETCH TASKS\n  the total of all runs and of a minimum nobody reaches, plus a third test\n  the average run"], ["test_plan.md", "TEST PLAN\n\n  - write each test as a comment at the end of the file: what you type and what the program prints\n  - include the number the program prints\n  - test a minimum that some runs reach and one that every run reaches"]],
  open: "Thanks, I added up a few weeks with your program.",
  rv: [["The plan is clear, and the list and the input are ready.", "The plan, the list or the input isn't right yet: purpose, input and output comments, then the six distances in order and the question."],
    ["total_distance has the loop, the if, the adding and the return.", "total_distance isn't right yet."],
    ["Two calls with two different arguments give two different answers, and your two tests have the correct numbers.", "The two calls or the test comments aren't right yet: each test needs the number the program prints."],
    ["The all-runs and ultra totals are right, including zero.", "Stretch: the extra totals aren't done yet. It's optional."],
    ["The average run is right, and your WHY note is correct.", "Stretch: the average isn't done yet. Also optional."]],
  approve: "The program and its tests all check out.", done: "The average run is going into the athlete summary." });

module.exports = {};
