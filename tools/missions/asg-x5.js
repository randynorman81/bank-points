/* STRETCH (extra credit) steps for the Unit 5 and Unit 6 workplace assignments 5.1 to 6.3. Each assignment gets two optional steps worth 10 bonus points in all (every check is +1).
   They build on the functions the regular steps already wrote, so the student never has to answer a new question. */
"use strict";
const { V, FN, note, X, ASG } = require("./asg-kit.js");
const FOR = (hdr) => new RegExp("^\\s*for\\s+\\w+\\s+in\\s+" + hdr + "\\s*:", "m");

/* 5.1 Uber Eats */
ASG.u5l1.stages.push(
  X("Delivery fees", ["Priyanka asks, if you have time: the app shows a delivery fee. Write a function named **`show_fee`** with one parameter, `miles`, that prints `Delivery fee:` followed by **2 dollars for every mile**. Call it with `3` and then with `8`."],
    "Write the function and the two calls.", `def show_fee(miles):\n    print("Delivery fee:", miles * 2)\n\nshow_fee(3)\nshow_fee(8)`,
    [["a function with the parameter miles", FN("show_fee", "miles")], ["math using miles inside the function", /^\s+print\(.*\bmiles\b\s*\*\s*2|^\s+print\(.*2\s*\*\s*miles\b/m], ["two calls to show_fee", /^show_fee\(\s*\d+\s*\)/m, 2]],
    "Run it.", [["Delivery fee: 6", /Delivery fee: 6\b/], ["Delivery fee: 16", /Delivery fee: 16\b/]]),
  X("A function that calls a function", ["Write a function named **`checkout`** that prints `Payment taken` and then **calls your `deliver` function**. Call `checkout` once. Add a comment that starts with `# FLOW:` and says in at least ten words in what order the lines run when `checkout` is called."],
    "Write the function, the call and the comment.", `def checkout():\n    print("Payment taken")\n    deliver()\n\ncheckout()\n# FLOW: python jumps into checkout prints payment taken then jumps into deliver and finally returns to the line after the call`,
    [["a function named checkout", FN("checkout")], ["calling deliver inside checkout", /^\s+deliver\(\s*\)/m], ["a FLOW comment of ten or more words", note("FLOW", 10), 1, "comments"]],
    "Run it.", [["Payment taken", /Payment taken/], ["Payment taken then Delivering", /Payment taken[\s\S]*Delivering/]]));

/* 5.2 Zillow */
ASG.u5l2.stages.push(
  X("Agent commission", ["Carmen asks, if you have time: agents are paid a percent of the sale. Write a function named **`commission`** with parameters `price` and `percent` that prints `Commission:` followed by that percent of the price. Call it for `300000` at `3` percent and for `500000` at `2` percent."],
    "Write the function and the two calls.", `def commission(price, percent):\n    print("Commission:", price * percent / 100)\n\ncommission(300000, 3)\ncommission(500000, 2)`,
    [["a function with price and percent", FN("commission", "price\\s*,\\s*percent")], ["the percent of the price", /^\s+print\(.*price\s*\*\s*percent\s*\/\s*100/m], ["two calls to commission", /^commission\(\s*\d+\s*,\s*\d+\s*\)/m, 2]],
    "Run it.", [["Commission: 9000.0", /Commission: 9000\.0/], ["Commission: 10000.0", /Commission: 10000\.0/]]),
  X("Describe a home", ["Write a function named **`describe`** with **three** parameters, `address`, `price` and `sqft`, that prints one line like `88 Main St costs $200.0 per sq ft`. Build it with + (convert the number with `str`). Call it with your `street` variable, `300000` and `1500`. Add a comment that starts with `# ARGS:` and says in at least ten words why the three arguments must go in the same order as the parameters."],
    "Write the function, the call and the comment.", `def describe(address, price, sqft):\n    print(address + " costs $" + str(price / sqft) + " per sq ft")\n\ndescribe(street, 300000, 1500)\n# ARGS: the first argument fills the first parameter and so on so a different order would put the wrong value in the wrong place`,
    [["a function with three parameters", FN("describe", "address\\s*,\\s*price\\s*,\\s*sqft")], ["str() around the division", /str\(\s*price\s*\/\s*sqft\s*\)/], ["calling describe with the street variable", /^describe\(\s*street\s*,\s*300000\s*,\s*1500\s*\)/m], ["an ARGS comment of ten or more words", note("ARGS", 10), 1, "comments"]],
    "Run it.", [["88 Main St costs $200.0 per sq ft", /88 Main St costs \$200\.0 per sq ft/]]));

/* 5.3 Walmart */
ASG.u5l3.stages.push(
  X("Coupons", ["Denise asks, if you have time: add coupons. Write a function named **`apply_coupon`** with parameters `amount` and `coupon` that **returns** the amount minus the coupon. Store `apply_coupon(grand, 5)` in **`final`** and print `After coupon:` followed by it. Then print `Gift:` followed by `apply_coupon` called with **`item_total(20, 2)`** as the amount and `10` as the coupon."],
    "Write the function, the stored call and the nested call.", `def apply_coupon(amount, coupon):\n    return amount - coupon\n\nfinal = apply_coupon(grand, 5)\nprint("After coupon:", final)\nprint("Gift:", apply_coupon(item_total(20, 2), 10))`,
    [["a return of the amount minus the coupon", /^\s+return\s+amount\s*-\s*coupon/m], ["storing apply_coupon(grand, 5) in final", /^\s*final\s*=\s*apply_coupon\(\s*grand\s*,\s*5\s*\)/m], ["a call inside a call", /apply_coupon\(\s*item_total\(\s*20\s*,\s*2\s*\)\s*,\s*10\s*\)/]],
    "Run it.", [["After coupon: 35", /After coupon: 35\b/], ["Gift: 30", /Gift: 30\b/]]),
  X("Tax you can reuse", ["Write a function named **`tax`** with one parameter, `amount`, that **returns** 10 percent of the amount. Print `Tax only:` followed by `tax(grand)` and `With tax:` followed by the grand total **plus** `tax(grand)`. Add a comment that starts with `# VALUE:` and says in at least ten words why `tax` had to return its answer instead of printing it."],
    "Write the function, the two prints and the comment.", `def tax(amount):\n    return amount * 10 / 100\n\nprint("Tax only:", tax(grand))\nprint("With tax:", grand + tax(grand))\n# VALUE: a returned answer can be added to other numbers but a printed answer is only shown and cannot be used again`,
    [["returning 10 percent of the amount", /^\s+return\s+(amount\s*\*\s*10\s*\/\s*100|amount\s*\/\s*10|amount\s*\*\s*0?\.1\b)/m], ["adding the grand total and tax(grand)", /print\(\s*["']With tax:["']\s*,\s*grand\s*\+\s*tax\(\s*grand\s*\)\s*\)/], ["a VALUE comment of ten or more words", note("VALUE", 10), 1, "comments"]],
    "Run it.", [["Tax only: 4.0", /Tax only: 4\.0/], ["With tax: 44.0", /With tax: 44\.0/]]));

/* 5.4 Duolingo */
ASG.u5l4.stages.push(
  X("Streak freeze", ["Hye-jin asks, if you have time: a streak freeze costs gems. Write a function named **`can_freeze`** with one parameter, `gems`, that **returns** whether the player has at least `10` gems. Print `Can freeze:` followed by `can_freeze(15)`. Then use it **in an if with `not`**: if the player **cannot** freeze with `5` gems, print `Earn more gems`."],
    "Write the function, the print and the if.", `def can_freeze(gems):\n    return gems >= 10\n\nprint("Can freeze:", can_freeze(15))\nif not can_freeze(5):\n    print("Earn more gems")`,
    [["a function with the parameter gems", FN("can_freeze", "gems")], ["returning the comparison", /^\s+return\s+gems\s*>=\s*10/m], ["using the function in an if with not", /^\s*if\s+not\s+can_freeze\(\s*5\s*\)\s*:/m]],
    "Run it.", [["Can freeze: True", /Can freeze: True/], ["Earn more gems", /Earn more gems/]]),
  X("Weekly XP", ["Every 7th day of a streak adds `10` XP. Write a function named **`weekly_xp`** with one parameter, `days`, that loops through the days `1` through `days`, adds `10` to a total **only on days that divide evenly by 7**, and **returns the total after the loop**. Print `Weekly XP:` followed by `weekly_xp(21)`. Add a comment that starts with `# AFTER:` and says in at least ten words why the return is placed after the loop."],
    "Write the function, the print and the comment.", `def weekly_xp(days):\n    total = 0\n    for d in range(1, days + 1):\n        if d % 7 == 0:\n            total = total + 10\n    return total\n\nprint("Weekly XP:", weekly_xp(21))\n# AFTER: a return inside the loop would end the function on the first day so it has to wait until the loop is finished`,
    [["a function with the parameter days", FN("weekly_xp", "days")], ["an if for every 7th day inside the loop", /^\s+if\s+\w+\s*%\s*7\s*==\s*0\s*:/m], ["returning total after the loop", /^    return\s+total\s*$/m, 2], ["an AFTER comment of ten or more words", note("AFTER", 10), 1, "comments"]],
    "Run it.", [["Weekly XP: 30", /Weekly XP: 30\b/]]));

/* 5.5 Google Maps */
ASG.u5l5.stages.push(
  X("Rounded routes", ["Ibrahim asks, if you have time: print `Rounded straight line:` followed by `hypotenuse(2, 3)` **rounded to 2 decimal places**. Print `Area:` followed by the **square** of `hypotenuse(3, 4)` using the library procedure for powers (not `*`). Print `Walking blocks:` followed by the distance from zero of `-4` **plus** the distance from zero of `3`."],
    "Write the three prints.", `print("Rounded straight line:", round(hypotenuse(2, 3), 2))\nprint("Area:", pow(hypotenuse(3, 4), 2))\nprint("Walking blocks:", abs(-4) + abs(3))`,
    [["round() around hypotenuse(2, 3)", /round\(\s*hypotenuse\(\s*2\s*,\s*3\s*\)\s*,\s*2\s*\)/], ["pow() around hypotenuse(3, 4)", /pow\(\s*hypotenuse\(\s*3\s*,\s*4\s*\)\s*,\s*2\s*\)/], ["adding the two abs() answers", /abs\(\s*-4\s*\)\s*\+\s*abs\(\s*3\s*\)/]],
    "Run it.", [["Rounded straight line: 3.61", /Rounded straight line: 3\.61/], ["Area: 25.0", /Area: 25\.0/]]),
  X("Walking with a detour", ["Write a function named **`walking`** with parameters `a` and `b` that **returns** the distance from zero of `a` plus the distance from zero of `b` (blocks walked on a grid). Then write **`detour_walk`** with the same parameters that returns `walking(a, b)` **plus a random whole number from 1 to 5**. Print `Walk 3 and -4:` followed by `walking(3, -4)` and `Walk with detour:` followed by `detour_walk(3, -4)`."],
    "Write both functions and the two prints.", `def walking(a, b):\n    return abs(a) + abs(b)\n\ndef detour_walk(a, b):\n    return walking(a, b) + random.randint(1, 5)\n\nprint("Walk 3 and -4:", walking(3, -4))\nprint("Walk with detour:", detour_walk(3, -4))`,
    [["a function named walking", FN("walking", "a\\s*,\\s*b")], ["returning two abs() answers added", /^\s+return\s+abs\(\s*a\s*\)\s*\+\s*abs\(\s*b\s*\)/m], ["detour_walk calling walking and random.randint", /^\s+return\s+walking\(\s*a\s*,\s*b\s*\)\s*\+\s*random\.randint\(\s*1\s*,\s*5\s*\)/m]],
    "Run it a few times.", [["Walk 3 and -4: 7", /Walk 3 and -4: 7\b/], ["a detour walk from 8 to 12", /Walk with detour: (8|9|10|11|12)\b/]]));

/* 5.6 Netflix */
ASG.u5l6.stages.push(
  X("Title cards", ["Olivia asks, if you have time: build a title card. Write a procedure named **`title_card`** with one parameter, `title`, that **calls `divider`**, prints the title, and **calls `divider` again**. Call it with `Squid Game`."],
    "Write the procedure and the call.", `def title_card(title):\n    divider()\n    print(title)\n    divider()\n\ntitle_card("Squid Game")`,
    [["a procedure with the parameter title", FN("title_card", "title")], ["two calls to divider inside it", /^\s+divider\(\s*\)/m, 2], ["printing the title between them", /^\s+print\(\s*title\s*\)/m], ["a call for Squid Game", /^title_card\(\s*["']Squid Game["']\s*\)/m]],
    "Run it.", [["Squid Game", /^Squid Game$/m], ["four dividers in all", /-{10}/, 4]]),
  X("Repeat a message", ["Write a procedure named **`repeat_message`** with parameters `text` and `times` that uses a **loop** to print the text that many times. Call it with `New episode!` and `3`. Add a comment that starts with `# REUSE:` and says in at least ten words how the same procedure could be used by a different screen."],
    "Write the procedure, the call and the comment.", `def repeat_message(text, times):\n    for i in range(times):\n        print(text)\n\nrepeat_message("New episode!", 3)\n# REUSE: any screen can call repeat_message with its own text and its own number so nobody has to copy the loop`,
    [["a procedure with text and times", FN("repeat_message", "text\\s*,\\s*times")], ["a loop controlled by times", FOR("range\\(\\s*times\\s*\\)")], ["a REUSE comment of ten or more words", note("REUSE", 10), 1, "comments"]],
    "Run it.", [["New episode! three times", /New episode!/, 3]]));

/* 6.1 Pokemon GO */
ASG.u6l1.stages.push(
  X("Other types", ["Ren asks, if you have time: trainers want to check the other types. Print `Water:` followed by `count_type(caught, \"water\")` and `Grass:` followed by `count_type(caught, \"grass\")`. Add a comment that starts with `# TEST:` and says in at least eight words why calling the same procedure with different arguments is a good test."],
    "Write the two prints and the comment.", `print("Water:", count_type(caught, "water"))\nprint("Grass:", count_type(caught, "grass"))\n# TEST: the same procedure should work for every type so each new argument is another test of the same code`,
    [["a call with water", /count_type\(\s*caught\s*,\s*["']water["']\s*\)/], ["a call with grass", /count_type\(\s*caught\s*,\s*["']grass["']\s*\)/], ["a TEST comment of eight or more words", note("TEST", 8), 1, "comments"]],
    "Run it with fire.", [["Water: 2", /Water: 2\b/], ["Grass: 1", /Grass: 1\b/]]),
  X("Share of the box", ["Print `Total caught:` followed by how many Pokemon are in the list (use `len`). Then print `Share of choice:` followed by the **percent** of the caught Pokemon that match the trainer's choice (the count times 100, divided by the length of the list). Add a comment that starts with `# SHARE:` and says in at least eight words what the share tells the trainer."],
    "Write the two prints.", `print("Total caught:", len(caught))\nprint("Share of choice:", count_type(caught, choice) * 100 / len(caught))\n# SHARE: the share tells the trainer what part of the whole collection is the chosen type`,
    [["the length of the list", /print\(\s*["']Total caught:["']\s*,\s*len\(\s*caught\s*\)\s*\)/], ["the count times 100 divided by the length", /count_type\(\s*caught\s*,\s*choice\s*\)\s*\*\s*100\s*\/\s*len\(\s*caught\s*\)/], ["a SHARE comment of eight or more words", note("SHARE", 8), 1, "comments"]],
    "Run it with fire.", [["Total caught: 6", /Total caught: 6\b/], ["Share of choice: 50.0", /Share of choice: 50\.0/]]));

/* 6.2 TikTok Create Task Plan */
ASG.u6l2.stages.push(
  X("Other creators", ["Camila asks, if you have time: reviewers want to see more than one test. Print `Alex videos:` followed by `count_videos(feed, \"alex\")` and `Zed videos:` followed by `count_videos(feed, \"zed\")` (a creator who is **not** in the feed). Add a comment that starts with `# EDGE:` and says in at least eight words why testing a creator with zero videos matters."],
    "Write the two prints and the comment.", `print("Alex videos:", count_videos(feed, "alex"))\nprint("Zed videos:", count_videos(feed, "zed"))\n# EDGE: a creator who is not in the feed should give zero and not crash so that edge case is worth testing`,
    [["a call with alex", /count_videos\(\s*feed\s*,\s*["']alex["']\s*\)/], ["a call with zed", /count_videos\(\s*feed\s*,\s*["']zed["']\s*\)/], ["an EDGE comment of eight or more words", note("EDGE", 8), 1, "comments"]],
    "Run it with mia.", [["Alex videos: 1", /Alex videos: 1\b/], ["Zed videos: 0", /Zed videos: 0\b/]]),
  X("More PPR notes", ["The scorers look for more than a procedure and a list. Add four comments, each with at least three words: `# PPR PARAMETER:` names a **parameter** of your procedure, `# PPR ITERATION:` says where the **loop** is, `# PPR SELECTION:` says where the **if** is, and `# PPR RETURN:` says what the procedure **returns**."],
    "Write the four PPR notes.", `# PPR PARAMETER: the items parameter holds the whole feed list\n# PPR ITERATION: the for loop inside count_videos visits every creator\n# PPR SELECTION: the if inside the loop compares each creator with the target\n# PPR RETURN: the procedure returns the count of matching videos`,
    [["a PPR PARAMETER note", note("PPR PARAMETER"), 1, "comments"], ["a PPR ITERATION note", note("PPR ITERATION"), 1, "comments"], ["a PPR SELECTION note", note("PPR SELECTION"), 1, "comments"], ["a PPR RETURN note", note("PPR RETURN"), 1, "comments"]],
    "Run it one last time with mia.", [["Videos: 3", /Videos: 3/]]));

/* 6.3 Crayola */
ASG.u6l3.stages.push(
  X("More colors", ["Hannah asks, if you have time: print `Green matches:` followed by `count_matches(colors, \"green\")` and `Purple matches:` followed by `count_matches(colors, \"purple\")` (a color that is **not** in the box). Add a third test comment that starts with `# TEST 3:` and includes the **number** the purple test prints."],
    "Write the two prints and the test comment.", `print("Green matches:", count_matches(colors, "green"))\nprint("Purple matches:", count_matches(colors, "purple"))\n# TEST 3: purple is not in the box so the program prints Matches: 0`,
    [["a call with green", /count_matches\(\s*colors\s*,\s*["']green["']\s*\)/], ["a call with purple", /count_matches\(\s*colors\s*,\s*["']purple["']\s*\)/], ["TEST 3 with the answer 0", /TEST 3:.*\b0\b/, 1, "comments"]],
    "Run it with red.", [["Green matches: 1", /Green matches: 1\b/], ["Purple matches: 0", /Purple matches: 0\b/]]),
  X("Percent of the box", ["Store the number of crayons in the box in **`total_crayons`** (use `len`, do not type 6) and print `Crayons in box:` followed by it. Then print `Percent:` followed by the percent of the box that matches the chosen color (the count times 100, divided by `total_crayons`). Add a comment that starts with `# WHY:` and says in at least ten words why it is better to use `len` than to type the number 6."],
    "Write the variable, the two prints and the comment.", `total_crayons = len(colors)\nprint("Crayons in box:", total_crayons)\nprint("Percent:", count_matches(colors, choice) * 100 / total_crayons)\n# WHY: if the box ever gets more colors len updates by itself but a typed six would silently give wrong answers`,
    [["total_crayons from len(colors)", /^\s*total_crayons\s*=\s*len\(\s*colors\s*\)/m], ["the count times 100 divided by total_crayons", /count_matches\(\s*colors\s*,\s*choice\s*\)\s*\*\s*100\s*\/\s*total_crayons/], ["a WHY comment of ten or more words", note("WHY", 10), 1, "comments"]],
    "Run it with red.", [["Crayons in box: 6", /Crayons in box: 6\b/], ["Percent: 50.0", /Percent: 50\.0/]]));

module.exports = {};
