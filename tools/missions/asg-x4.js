/* STRETCH (extra credit) steps for the Unit 4 workplace assignments 4.1 to 4.11 (4.12 is in asg-u4.js). Each assignment gets two optional steps worth 10 bonus points in all (every check is +1).
   They only use the variables the regular steps already made, so the student never has to answer a new question. */
"use strict";
const { V, FN, note, X, ASG } = require("./asg-kit.js");
const FOR = (hdr) => new RegExp("^\\s*for\\s+\\w+\\s+in\\s+" + hdr + "\\s*:", "m");

/* 4.1 Instagram */
ASG.u4l1.stages.push(
  X("Reach a goal", ["Maya asks, if you have time: creators like a goal. Make **`goal`** equal to `15000` and store in **`goal_reached`** whether `followers` has reached it (let Python decide). Print `Goal reached:` followed by it, and `Not yet:` followed by the **opposite**."],
    "Write the goal, the comparison and the two prints.", `goal = 15000\ngoal_reached = followers >= goal\nprint("Goal reached:", goal_reached)\nprint("Not yet:", not goal_reached)`,
    [["goal is 15000", V("goal", "15000")], ["goal_reached compares followers with goal", /^\s*goal_reached\s*=\s*followers\s*>=\s*goal/m], ["not applied to goal_reached", /print\(\s*["']Not yet:["']\s*,\s*not\s+goal_reached\s*\)/]],
    "Run it.", [["Goal reached: False", /Goal reached: False/], ["Not yet: True", /Not yet: True/]]),
  X("Not equal and the type", ["Print `Likes not 250:` followed by whether `likes` is **not equal** to 250, and `Type:` followed by the **type** of `can_go_live`. Add a comment that starts with `# BOOL:` and says in at least ten words why a Boolean is not the same as the text `\"True\"`."],
    "Write the two prints and the comment.", `print("Likes not 250:", likes != 250)\nprint("Type:", type(can_go_live))\n# BOOL: a Boolean is a real True or False value but quotes around True turn it into plain text`,
    [["likes compared with != 250", /print\(\s*["']Likes not 250:["']\s*,\s*likes\s*!=\s*250\s*\)/], ["the type of can_go_live", /print\(\s*["']Type:["']\s*,\s*type\(\s*can_go_live\s*\)\s*\)/], ["a BOOL comment of ten or more words", note("BOOL", 10), 1, "comments"]],
    "Run it.", [["Likes not 250: False", /Likes not 250: False/], ["Type: bool", /Type: <class 'bool'>/]]));

/* 4.2 Disney+ */
ASG.u4l2.stages.push(
  X("Downloads and ads", ["Grace asks, if you have time: add two more rules. **`can_download`** is True when the viewer **can stream and is at least 13**. **`show_ads`** is True when the viewer has **no subscription or** their payment failed (use `not`). Print `Can download:` and `Show ads:` followed by each."],
    "Write the two rules and the two prints.", `can_download = can_stream and age >= 13\nshow_ads = not has_subscription or payment_failed\nprint("Can download:", can_download)\nprint("Show ads:", show_ads)`,
    [["can_download combines can_stream and the age", /^\s*can_download\s*=\s*can_stream\s+and\s+age\s*>=\s*13/m], ["show_ads uses not and or", /^\s*show_ads\s*=\s*not\s+has_subscription\s+or\s+payment_failed/m], ["printing Can download", /print\(\s*["']Can download:["']\s*,\s*can_download\s*\)/]],
    "Run it with the same answer.", [["Can download: True", /Can download: True/], ["Show ads: False", /Show ads: False/]]),
  X("Both ends of a range", ["Print `Tall enough:` followed by whether `height` is at least `40`, and `Right size:` followed by whether `height` is **between 40 and 54 inclusive** (check both ends in one expression). Add a comment that starts with `# RANGE:` and says in at least ten words why a range check needs **and** and not **or**."],
    "Write the two prints and the comment.", `print("Tall enough:", height >= 40)\nprint("Right size:", height >= 40 and height <= 54)\n# RANGE: and needs both ends to be true but or would let almost any height through because one end is always true`,
    [["height compared with 40", /print\(\s*["']Tall enough:["']\s*,\s*height\s*>=\s*40\s*\)/], ["a range check with and", /print\(\s*["']Right size:["']\s*,\s*height\s*>=\s*40\s+and\s+height\s*<=\s*54\s*\)/], ["a RANGE comment of ten or more words", note("RANGE", 10), 1, "comments"]],
    "Run it.", [["Tall enough: True", /Tall enough: True/], ["Right size: True", /Right size: True/]]));

/* 4.3 Wordle */
ASG.u4l3.stages.push(
  X("Hard mode checks", ["Theo asks, if you have time: add hard-mode checks. Print `Last attempt:` followed by whether `attempts` equals `max_attempts` minus `1`. Print `Attempts left:` followed by `max_attempts` minus `attempts`. Print `Same first letter:` followed by whether the **first character** of `guess` equals the first character of `secret`."],
    "Write the three prints.", `print("Last attempt:", attempts == max_attempts - 1)\nprint("Attempts left:", max_attempts - attempts)\nprint("Same first letter:", guess[0] == secret[0])`,
    [["attempts compared with max_attempts - 1", /attempts\s*==\s*max_attempts\s*-\s*1/], ["max_attempts minus attempts", /max_attempts\s*-\s*attempts\s*\)/], ["comparing the first characters", /guess\s*\[\s*0\s*\]\s*==\s*secret\s*\[\s*0\s*\]/]],
    "Run it with the same answer.", [["Last attempt: False", /Last attempt: False/], ["Same first letter: True", /Same first letter: True/]]),
  X("Streak and length", ["Print `Century streak:` followed by whether `streak` is at least `100`, and `Longer than secret:` followed by whether `guess` is **longer than** `secret` (compare their lengths). Add a comment that starts with `# BOUNDARY:` and says in at least eight words why `>=` and `>` give different answers at exactly 100."],
    "Write the two prints and the comment.", `print("Century streak:", streak >= 100)\nprint("Longer than secret:", len(guess) > len(secret))\n# BOUNDARY: greater than or equal counts the number itself but greater than leaves it out`,
    [["streak compared with 100", /print\(\s*["']Century streak:["']\s*,\s*streak\s*>=\s*100\s*\)/], ["comparing the two lengths", /len\(\s*guess\s*\)\s*>\s*len\(\s*secret\s*\)/], ["a BOUNDARY comment of eight or more words", note("BOUNDARY", 8), 1, "comments"]],
    "Run it.", [["Century streak: False", /Century streak: False/], ["Longer than secret: False", /Longer than secret: False/]]));

/* 4.4 Peloton */
ASG.u4l4.stages.push(
  X("Resistance and bonus points", ["Dani asks, if you have time: add the resistance knob. Make **`resistance`** equal to `45`. **If** the resistance is at least `40` **and** the cadence is at least `80`, print `Hard interval`. Then **if** the heart rate is at least `170`, add `20` to the points, and print `Total points:` followed by the points."],
    "Write the variable, the two ifs and the print.", `resistance = 45\nif resistance >= 40 and cadence >= 80:\n    print("Hard interval")\nif heart_rate >= 170:\n    points = points + 20\nprint("Total points:", points)`,
    [["an if combining resistance and cadence", /^\s*if\s+resistance\s*>=\s*40\s+and\s+cadence\s*>=\s*80\s*:/m], ["an if on heart_rate at least 170", /^\s*if\s+heart_rate\s*>=\s*170\s*:/m], ["points go up by 20", /^\s+points\s*(=\s*points\s*\+\s*20|\+=\s*20)/m]],
    "Run it with 180.", [["Hard interval", /Hard interval/], ["Total points: 70", /Total points: 70/]]),
  X("A coach message", ["Add an **if inside an if**: when `has_monitor` is True, **and then inside that** the heart rate is over `175`, print `Coach says: ease off`. Finally print `Ride complete` so that it shows **every time**. Add a comment that starts with `# INDENT:` and says in at least ten words what the indentation of a print tells Python."],
    "Write the nested if, the last print and the comment.", `if has_monitor:\n    if heart_rate > 175:\n        print("Coach says: ease off")\nprint("Ride complete")\n# INDENT: the lines pushed in under an if only run when its condition is true while lines at the left edge always run`,
    [["an if on has_monitor", /^\s*if\s+has_monitor\s*:/m], ["an if inside an if on the heart rate", /^\s+if\s+heart_rate\s*>\s*175\s*:/m], ["an INDENT comment of ten or more words", note("INDENT", 10), 1, "comments"]],
    "Run it with 180.", [["Coach says: ease off", /Coach says: ease off/], ["Ride complete", /Ride complete/]]));

/* 4.5 Starbucks */
ASG.u4l5.stages.push(
  X("Price by cup size", ["Jamal asks, if you have time: the app also prices a drink by its size. Make **`cup_size`** equal to `grande`. With **one chain**, store **`drink_price`**: `2` for `short`, `3` for `tall`, `4` for `grande` and `5` for anything else. Print `Price:` followed by it."],
    "Write the variable, the chain and the print.", `cup_size = "grande"\nif cup_size == "short":\n    drink_price = 2\nelif cup_size == "tall":\n    drink_price = 3\nelif cup_size == "grande":\n    drink_price = 4\nelse:\n    drink_price = 5\nprint("Price:", drink_price)`,
    [["cup_size is grande", V("cup_size", "[\"']grande[\"']")], ["an if on the cup size", /^\s*if\s+cup_size\s*==\s*["']short["']\s*:/m], ["two elifs on the cup size", /^\s*elif\s+cup_size\s*==\s*["']\w+["']\s*:/m, 2], ["printing the price", /print\(\s*["']Price:["']\s*,\s*drink_price\s*\)/]],
    "Run it.", [["Price: 4", /Price: 4\b/]]),
  X("Two bonuses at once", ["Make **`is_morning`** equal to `True` and **`has_cup`** equal to `True`. A member gets **both** bonuses, so use **two separate ifs**: one prints `Morning bonus` and the other prints `Reusable cup bonus`. Add a comment that starts with `# SEPARATE:` and says in at least ten words why an elif would have been wrong here."],
    "Write the two variables, the two ifs and the comment.", `is_morning = True\nhas_cup = True\nif is_morning:\n    print("Morning bonus")\nif has_cup:\n    print("Reusable cup bonus")\n# SEPARATE: an elif would skip the second bonus once the first one matched but both bonuses should be allowed`,
    [["an if on is_morning", /^\s*if\s+is_morning\s*:/m], ["a separate if on has_cup", /^\s*if\s+has_cup\s*:/m], ["a SEPARATE comment of ten or more words", note("SEPARATE", 10), 1, "comments"]],
    "Run it.", [["Morning bonus", /Morning bonus/], ["Reusable cup bonus", /Reusable cup bonus/]]));

/* 4.6 Fortnite */
ASG.u4l6.stages.push(
  X("Emotes", ["Kai asks, if you have time: add emotes. Write a handler named **`emote`** with one `event` parameter: the key `1` prints `Dance`, the key `2` prints `Wave`, and any other key prints `No emote`. Call it with events for `1`, `2` and `9`."],
    "Write the handler and the three calls.", `def emote(event):\n    if event.key == "1":\n        print("Dance")\n    elif event.key == "2":\n        print("Wave")\n    else:\n        print("No emote")\n\nemote(Event("1"))\nemote(Event("2"))\nemote(Event("9"))`,
    [["a handler named emote", FN("emote", "event")], ["an if on the key 1", /^\s+if\s+event\.key\s*==\s*["']1["']\s*:/m], ["an elif on the key 2", /^\s+elif\s+event\.key\s*==\s*["']2["']\s*:/m]],
    "Run it.", [["Dance", /Dance/], ["Wave", /Wave/]]),
  X("Health", ["A player's **`health`** starts at `100`. Write a handler named **`hit`** that changes the **global** health: the key `h` takes away `25` and the key `m` (a medkit) adds `50`. Call it with `h`, `h`, `h` and then `m`, and print `Health:` followed by `health`."],
    "Write the variable, the handler, the four calls and the print.", `health = 100\n\ndef hit(event):\n    global health\n    if event.key == "h":\n        health = health - 25\n    elif event.key == "m":\n        health = health + 50\n\nhit(Event("h"))\nhit(Event("h"))\nhit(Event("h"))\nhit(Event("m"))\nprint("Health:", health)`,
    [["health starts at 100", V("health", "100")], ["a handler named hit", FN("hit", "event")], ["the handler uses global health", /^\s+global\s+health\s*$/m], ["four calls to hit", /^hit\(\s*Event\(/m, 4]],
    "Run it.", [["Health: 75", /Health: 75/]]));

/* 4.7 SpaceX */
ASG.u4l7.stages.push(
  X("Odd stages", ["Rohan asks, if you have time: the odd-numbered stages need their own check. With **one** for loop and a **step**, print `Stage` followed by each odd number from `1` to `9`. Add a comment that starts with `# STEP:` and says in at least eight words what the third number in `range` does."],
    "Write the stepped loop and the comment.", `for s in range(1, 10, 2):\n    print("Stage", s)\n# STEP: the third number tells range how much to add each time so two skips every other number`,
    [["a loop from 1 to 10 in steps of 2", FOR("range\\(\\s*1\\s*,\\s*10\\s*,\\s*2\\s*\\)")], ["printing Stage and the counter", /^\s+print\(\s*["']Stage["']\s*,\s*s\s*\)/m], ["a STEP comment of eight or more words", note("STEP", 8), 1, "comments"]],
    "Run it.", [["Stage 1", /Stage 1\b/], ["Stage 9", /Stage 9\b/]]),
  X("Squares and a slow countdown", ["Start **`sq_total`** at `0` and add up the **squares** of the numbers `1` through `5` in a loop (the counter times itself). Print `Sum of squares:` followed by it. Then count down from `30` to `10` **in steps of 10**, printing `T minus` followed by each number."],
    "Write both loops.", `sq_total = 0\nfor n in range(1, 6):\n    sq_total = sq_total + n * n\nprint("Sum of squares:", sq_total)\nfor t in range(30, 0, -10):\n    print("T minus", t)`,
    [["sq_total starts at 0", V("sq_total", "0\\s*$")], ["adding the counter times itself", /^\s+sq_total\s*=\s*sq_total\s*\+\s*n\s*\*\s*n/m], ["a countdown loop in steps of -10", FOR("range\\(\\s*30\\s*,\\s*0\\s*,\\s*-10\\s*\\)")]],
    "Run it.", [["Sum of squares: 55", /Sum of squares: 55/], ["T minus 30", /T minus 30\b/]]));

/* 4.8 Amazon */
ASG.u4l8.stages.push(
  X("Long names", ["Nina asks, if you have time: print `Items:` followed by how many items are in the cart (use the list's length). Then make **`long_names`** start at `0` and add `1` for every item whose **name is longer than 3 letters** (an if inside a loop, using `len`). Print `Long names:` followed by the count."],
    "Write the length print and the counting loop.", `print("Items:", len(items))\nlong_names = 0\nfor item in items:\n    if len(item) > 3:\n        long_names = long_names + 1\nprint("Long names:", long_names)`,
    [["the length of the items list", /print\(\s*["']Items:["']\s*,\s*len\(\s*items\s*\)\s*\)/], ["an if comparing the length of item with 3", /^\s+if\s+len\(\s*item\s*\)\s*>\s*3\s*:/m], ["adding 1 to long_names", /^\s+long_names\s*(=\s*long_names\s*\+\s*1|\+=\s*1)/m]],
    "Run it.", [["Items: 3", /Items: 3\b/], ["Long names: 2", /Long names: 2/]]),
  X("Cheapest and sale prices", ["Make **`cheapest`** start as the **first price in the list**, loop through the prices and replace it **whenever a price is lower**, and print `Cheapest:` followed by it. In a second loop print `Sale price:` followed by each price **minus 1**."],
    "Write both loops.", `cheapest = prices[0]\nfor price in prices:\n    if price < cheapest:\n        cheapest = price\nprint("Cheapest:", cheapest)\nfor price in prices:\n    print("Sale price:", price - 1)`,
    [["cheapest starts as the first price", /^\s*cheapest\s*=\s*prices\s*\[\s*0\s*\]/m], ["an if comparing price with cheapest", /^\s+if\s+price\s*<\s*cheapest\s*:/m], ["printing each price minus 1", /^\s+print\(\s*["']Sale price:["']\s*,\s*price\s*-\s*1\s*\)/m]],
    "Run it.", [["Cheapest: 4", /Cheapest: 4\b/], ["Sale price: 3", /Sale price: 3\b/]]));

/* 4.9 Twitch */
ASG.u4l9.stages.push(
  X("Lowest and range", ["Leo asks, if you have time: streamers also want their worst night. Make **`low`** start as the **first number in the list**, loop through the list and replace it **whenever a number is lower**, and print `Lowest viewers:` followed by it. Then print `Range:` followed by the peak minus the low."],
    "Write the loop and the two prints.", `low = viewers[0]\nfor v in viewers:\n    if v < low:\n        low = v\nprint("Lowest viewers:", low)\nprint("Range:", peak - low)`,
    [["low starts as the first viewer count", /^\s*low\s*=\s*viewers\s*\[\s*0\s*\]/m], ["an if comparing v with low", /^\s+if\s+v\s*<\s*low\s*:/m], ["the range from peak minus low", /print\(\s*["']Range:["']\s*,\s*peak\s*-\s*low\s*\)/]],
    "Run it.", [["Lowest viewers: 95", /Lowest viewers: 95/], ["Range: 315", /Range: 315/]]),
  X("Above average", ["Store the average in **`avg`** (the total divided by the number of streams), start **`above_avg`** at `0`, and add `1` for every stream **above the average**. Print `Above average:` followed by the count. Add a comment that starts with `# ACCUM:` and says in at least ten words why a counter has to start at zero before the loop."],
    "Write the average, the loop, the print and the comment.", `avg = total / len(viewers)\nabove_avg = 0\nfor v in viewers:\n    if v > avg:\n        above_avg = above_avg + 1\nprint("Above average:", above_avg)\n# ACCUM: the counter has to start at zero before the loop or it would have nothing to add to on the first pass`,
    [["avg is the total divided by the length", /^\s*avg\s*=\s*total\s*\/\s*len\(\s*viewers\s*\)/m], ["an if comparing v with avg", /^\s+if\s+v\s*>\s*avg\s*:/m], ["adding 1 to above_avg", /^\s+above_avg\s*(=\s*above_avg\s*\+\s*1|\+=\s*1)/m], ["an ACCUM comment of ten or more words", note("ACCUM", 10), 1, "comments"]],
    "Run it.", [["Above average: 2", /Above average: 2/]]));

/* 4.10 PlayStation */
ASG.u4l10.stages.push(
  X("The waiting line", ["Sam asks, if you have time: fans like to see their place in line. Make **`queue`** equal to `5`. **While the queue is above 0**, print `People ahead:` followed by it, then take `2` away. (It will print 5, 3 and 1.)"],
    "Write the loop.", `queue = 5\nwhile queue > 0:\n    print("People ahead:", queue)\n    queue = queue - 2`,
    [["queue starts at 5", V("queue", "5\\s*$")], ["a while loop while the queue is above 0", /^\s*while\s+queue\s*>\s*0\s*:/m], ["taking 2 away inside the loop", /^\s+queue\s*(=\s*queue\s*-\s*2|-=\s*2)/m]],
    "Run it.", [["People ahead: 5", /People ahead: 5\b/], ["People ahead: 1", /People ahead: 1\b/]]),
  X("Doubling prices", ["Scalpers double their price every day. Make **`bundle`** equal to `1` and **`doublings`** equal to `0`. **While the bundle is below 100**, double it and add 1 to `doublings`. Print `Doublings:` followed by the count and `Final price:` followed by the bundle. Add a comment that starts with `# STOP:` and says in at least ten words why the loop stops."],
    "Write the loop, the prints and the comment.", `bundle = 1\ndoublings = 0\nwhile bundle < 100:\n    bundle = bundle * 2\n    doublings = doublings + 1\nprint("Doublings:", doublings)\nprint("Final price:", bundle)\n# STOP: the condition is checked before every pass so the loop ends as soon as the bundle reaches one hundred or more`,
    [["a while loop while the bundle is below 100", /^\s*while\s+bundle\s*<\s*100\s*:/m], ["doubling the bundle in the loop", /^\s+bundle\s*(=\s*bundle\s*\*\s*2|\*=\s*2)/m], ["a STOP comment of ten or more words", note("STOP", 10), 1, "comments"]],
    "Run it.", [["Doublings: 7", /Doublings: 7\b/], ["Final price: 128", /Final price: 128\b/]]));

/* 4.11 Venmo */
ASG.u4l11.stages.push(
  X("First small payment", ["Tasha asks, if you have time: fraud reviewers also look for tiny test payments. Make **`checked`** start at `0`. Loop over `payments`; for each one add `1` to `checked`, then **if the payment is under 16**, print `First small:` followed by it and **break**. After the loop print `Checked:` followed by the count."],
    "Write the loop and the print.", `checked = 0\nfor p in payments:\n    checked = checked + 1\n    if p < 16:\n        print("First small:", p)\n        break\nprint("Checked:", checked)`,
    [["checked starts at 0", V("checked", "0\\s*$")], ["an if on a payment under 16", /^\s+if\s+p\s*<\s*16\s*:/m], ["a break after the print", /^\s+break\s*$/m, 5]],
    "Run it.", [["First small: 15", /First small: 15/], ["Checked: 2", /Checked: 2\b/]]),
  X("Daily limit", ["Venmo has a daily limit. Make **`daily_limit`** equal to `100` and **`spent`** equal to `0`. Loop over `payments`: **if** the spent amount **plus** the payment would go over the limit, print `Over limit at:` followed by the payment and **break**; otherwise add the payment to `spent`. After the loop print `Spent:` followed by it."],
    "Write the loop and the print.", `daily_limit = 100\nspent = 0\nfor p in payments:\n    if spent + p > daily_limit:\n        print("Over limit at:", p)\n        break\n    spent = spent + p\nprint("Spent:", spent)`,
    [["daily_limit is 100", V("daily_limit", "100")], ["an if on spent plus the payment over the limit", /^\s+if\s+spent\s*\+\s*p\s*>\s*daily_limit\s*:/m], ["adding the payment to spent", /^\s+spent\s*(=\s*spent\s*\+\s*p|\+=\s*p)/m]],
    "Run it.", [["Over limit at: 600", /Over limit at: 600/], ["Spent: 35", /Spent: 35\b/]]));

module.exports = {};
