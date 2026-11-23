/* STRETCH (extra credit) steps for the Unit 3 workplace assignments 3.3 to 3.13 (3.1 and 3.2 are in asg-u3.js). Each assignment gets two optional steps worth 10 bonus points in all (every check is +1).
   They only use the variables the regular steps already made, so the student never has to answer a new question. */
"use strict";
const { V, note, X, ASG } = require("./asg-kit.js");
const PR = (s) => new RegExp("print\\(.*" + s);

/* 3.3 Chick-fil-A */
ASG.u3l3.stages.push(
  X("Read the order back", ["Daniel asks, if you have time: the screen should read the order back in one sentence. Print a line made by **joining text with +**: the customer's name, then ` ordered `, then the number of sandwiches (convert it to text first), then ` sandwiches`. Then print `Cents:` followed by the total times `100`, because the payment system works in cents."],
    "Write the two prints.", `print(customer + " ordered " + str(sandwiches) + " sandwiches")\nprint("Cents:", total * 100)`,
    [["joining the name with +", /print\(\s*customer\s*\+/], ["converting sandwiches with str()", /\+\s*str\(\s*sandwiches\s*\)/], ["the cents line using total times 100", /print\(\s*["']Cents:["']\s*,\s*(total\s*\*\s*100|100\s*\*\s*total)\s*\)/]],
    "Run it with the same answers.", [["the order sentence", /Maria ordered 3 sandwiches/], ["Cents: 1500", /Cents: 1500/]]),
  X("Pickup window and sauce math", ["Print `Pickup window:` followed by `pickup_minutes`, the word `to`, and `pickup_minutes` plus `10`. Then print `Sauce sum:` followed by the two sauce codes **added as numbers** (convert each one with int). Add a comment that starts with `# PLUS:` and says in at least eight words why the ticket code and the sauce sum are different."],
    "Write the two prints and the comment.", `print("Pickup window:", pickup_minutes, "to", pickup_minutes + 10)\nprint("Sauce sum:", int(code_one) + int(code_two))\n# PLUS: joining text sticks the digits together but adding numbers does real math on them`,
    [["the pickup window using pickup_minutes plus 10", /print\(\s*["']Pickup window:["']\s*,\s*pickup_minutes\s*,\s*["']to["']\s*,\s*pickup_minutes\s*\+\s*10\s*\)/], ["adding the two codes after int()", /int\(\s*code_one\s*\)\s*\+\s*int\(\s*code_two\s*\)/], ["a PLUS comment of eight or more words", note("PLUS", 8), 1, "comments"]],
    "Run it.", [["Pickup window: 10 to 20", /Pickup window: 10 to 20/], ["Sauce sum: 46", /Sauce sum: 46/]]));

/* 3.4 Steam */
ASG.u3l4.stages.push(
  X("Sale banner", ["Jordan asks, if you have time: build the sale banner. Make **`games_on_sale`** equal to `3` and **`sale_percent`** equal to `50`. Print one **joined** line like `3 games are 50% off` (use + and convert both numbers with str). Then print a row of stars by **repeating** `*` once for every game on sale."],
    "Add the variables and the two prints.", `games_on_sale = 3\nsale_percent = 50\nprint(str(games_on_sale) + " games are " + str(sale_percent) + "% off")\nprint("*" * games_on_sale)`,
    [["games_on_sale is 3", V("games_on_sale", "3\\s*$")], ["sale_percent is 50", V("sale_percent", "50\\s*$")], ["str() on both numbers in the banner", /str\(\s*games_on_sale\s*\).*str\(\s*sale_percent\s*\)/], ["repeating the star", /print\(\s*(["']\*["']\s*\*\s*games_on_sale|games_on_sale\s*\*\s*["']\*["'])\s*\)/]],
    "Run it.", [["the sale line", /3 games are 50% off/], ["three stars", /^\*\*\*$/m]]),
  X("Total as text", ["Make **`total_text`** by converting the price times the copies into text with `str`. Print `Total due: $` followed by it, joined with the + sign. Add a comment that starts with `# JOIN:` and says in at least ten words why `\"Copies: \" + copies` would crash when `copies` is a number."],
    "Write the variable, the print and the comment.", `total_text = str(price * copies)\nprint("Total due: $" + total_text)\n# JOIN: plus cannot join text with a whole number so the number has to be converted with str first`,
    [["total_text made with str()", /^\s*total_text\s*=\s*str\(\s*(price\s*\*\s*copies|copies\s*\*\s*price)\s*\)/m], ["joining Total due with total_text", /print\(\s*["']Total due: \$["']\s*\+\s*total_text\s*\)/], ["a JOIN comment of ten or more words", note("JOIN", 10), 1, "comments"]],
    "Run it.", [["Total due: $19.98", /Total due: \$19\.98/]]));

/* 3.5 TikTok */
ASG.u3l5.stages.push(
  X("Initials badge", ["Zoe asks, if you have time: add the badge text. Print `Badge:` followed by the **first and last** characters of the username joined together into one piece of text (like `cr`). Then print `Stars:` followed by a row of stars, **one star for every character** in the name (repeat the `*` by the length, do not type the stars)."],
    "Write the two prints.", `print("Badge:", username[0] + username[-1])\nprint("Stars:", "*" * len(username))`,
    [["printing Badge with a label", /print\(\s*["']Badge:["']/], ["joining the first and last characters", /username\s*\[\s*0\s*\]\s*\+\s*username\s*\[\s*-1\s*\]/], ["repeating the star by the length", /["']\*["']\s*\*\s*len\(\s*username\s*\)|len\(\s*username\s*\)\s*\*\s*["']\*["']/]],
    "Run it.", [["Badge: cr", /Badge: cr/], ["Stars: *******", /Stars: \*{7}(?!\*)/]]),
  X("Counting from both ends", ["Print `Fourth from the end:` followed by the fourth character counting from the end, and `Last two:` followed by the last two characters (join the second to last and the last). Add a comment that starts with `# COUNT:` and says in at least eight words why a seven letter name has no position 7."],
    "Write the two prints and the comment.", `print("Fourth from the end:", username[-4])\nprint("Last two:", username[-2] + username[-1])\n# COUNT: positions start at zero so a seven letter name only goes up to position six`,
    [["the fourth character from the end", /username\s*\[\s*-4\s*\]/], ["joining the last two characters", /username\s*\[\s*-2\s*\]\s*\+\s*username\s*\[\s*-1\s*\]/], ["a COUNT comment of eight or more words", note("COUNT", 8), 1, "comments"]],
    "Run it.", [["Fourth from the end: a", /Fourth from the end: a/], ["Last two: or", /Last two: or/]]));

/* 3.6 Airbnb */
ASG.u3l6.stages.push(
  X("Guest tag and masked phone", ["Print `Guest tag:` followed by the last five characters of the confirmation, a dash, then the first three characters (like `GUEST-ATL`). Then print `Phone:` followed by six stars (**repeat** `*`, do not type them) joined to the **last four digits** of the phone number."],
    "Write the two prints.", `print("Guest tag:", confirmation[-5:] + "-" + confirmation[:3])\nprint("Phone:", "*" * 6 + phone[6:])`,
    [["slicing the last five and joining a dash", /confirmation\s*\[\s*-5\s*:\s*\]\s*\+\s*["']-["']/], ["repeating the star six times", /["']\*["']\s*\*\s*6|6\s*\*\s*["']\*["']/], ["slicing the last four digits of the phone", /phone\s*\[\s*(-4|6)\s*:\s*\]/]],
    "Run it.", [["Guest tag: GUEST-ATL", /Guest tag: GUEST-ATL/], ["Phone: ******1234", /Phone: \*{6}1234/]]),
  X("Month and day", ["Print `Month:` followed by the two characters of the month and `Day:` followed by the two characters of the day (they are the two pieces inside the month and day). Add a comment that starts with `# SLICE:` and says in at least ten words why `confirmation[3:7]` gives four characters and not five."],
    "Write the two prints and the comment.", `print("Month:", confirmation[7:9])\nprint("Day:", confirmation[9:11])\n# SLICE: the stop number is not included so three up to seven gives four characters`,
    [["slicing the month", /confirmation\s*\[\s*7\s*:\s*9\s*\]/], ["slicing the day", /confirmation\s*\[\s*9\s*:\s*11\s*\]/], ["a SLICE comment of ten or more words", note("SLICE", 10), 1, "comments"]],
    "Run it.", [["Month: 11", /Month: 11/], ["Day: 25", /Day: 25/]]));

/* 3.7 Gmail */
ASG.u3l7.stages.push(
  X("Name length and extension", ["Print `Name length:` followed by how many characters are in the username part. Then print `Extension:` followed by what comes **after the dot** in the domain (the `com` part), using the position you already found in `dot`. Finish with `Domain length:` followed by how many characters the whole domain has."],
    "Write the two prints.", `print("Name length:", len(username))\nprint("Extension:", domain[dot + 1:])\nprint("Domain length:", len(domain))`,
    [["len(username) in a print", /print\(\s*["']Name length:["']\s*,\s*len\(\s*username\s*\)\s*\)/], ["slicing the domain from just after the dot", /domain\s*\[\s*dot\s*\+\s*1\s*:\s*\]/], ["len(domain) in a print", /print\(\s*["']Domain length:["']\s*,\s*len\(\s*domain\s*\)\s*\)/]],
    "Run it.", [["Name length: 9", /Name length: 9/], ["Extension: com", /Extension: com/]]),
  X("Is there an at sign", ["Make **`has_at`** by checking that the position of the `@` in `email` is **not** `-1` (let Python answer True or False), and **`bad_has_at`** the same way for `bad_email`. Print `Has @:` and `Bad has @:` followed by each. Add a comment that starts with `# FIND:` and says in at least eight words why -1 can never be a real position."],
    "Write the two variables, the prints and the comment.", `has_at = email.find("@") != -1\nbad_has_at = bad_email.find("@") != -1\nprint("Has @:", has_at)\nprint("Bad has @:", bad_has_at)\n# FIND: a real position starts at zero so minus one is a safe way to say not found`,
    [["has_at compares the position with -1", /^\s*has_at\s*=\s*email\.find\(\s*["']@["']\s*\)\s*!=\s*-1/m], ["bad_has_at does the same for bad_email", /^\s*bad_has_at\s*=\s*bad_email\.find\(\s*["']@["']\s*\)\s*!=\s*-1/m], ["a FIND comment of eight or more words", note("FIND", 8), 1, "comments"]],
    "Run it.", [["Has @: True", /Has @: True/], ["Bad has @: False", /Bad has @: False/]]));

/* 3.8 DoorDash */
ASG.u3l8.stages.push(
  X("Peak Pay", ["Sasha asks, if you have time: during Peak Pay a Dasher gets an extra bonus. Make **`peak_bonus`** equal to `2.50` and print `With Peak Pay:` followed by the Dasher pay from before **plus the bonus**. Then print `Per mile:` followed by what the miles earn on their own (`0.60` per mile)."],
    "Write the bonus and the two prints.", `peak_bonus = 2.50\nprint("With Peak Pay:", 1.50 + 0.60 * miles + tip + peak_bonus)\nprint("Per mile:", 0.60 * miles)`,
    [["peak_bonus is 2.50", V("peak_bonus", "2\\.5")], ["the pay plus peak_bonus", PR("peak_bonus")], ["the miles earnings", /print\(\s*["']Per mile:["']\s*,\s*(0?\.60?\s*\*\s*miles|miles\s*\*\s*0?\.60?)\s*\)/]],
    "Run it with the same answers.", [["With Peak Pay: 9.4", /With Peak Pay: 9\.4/], ["Per mile: 2.4", /Per mile: 2\.4/]]),
  X("Split the bill", ["Make **`friends`** equal to `4` and print `Each pays:` followed by the total divided by the number of friends. Make **`tip_text`** equal to the **text** `15` and print `Tip plus 5:` followed by that tip with `5` added (convert it first). Add a comment that starts with `# CONVERT:` and says in at least eight words what would happen without the conversion."],
    "Write the variables, the prints and the comment.", `friends = 4\nprint("Each pays:", total / friends)\ntip_text = "15"\nprint("Tip plus 5:", int(tip_text) + 5)\n# CONVERT: text and a number cannot be added so Python would stop with a TypeError`,
    [["total divided by friends", /print\(\s*["']Each pays:["']\s*,\s*total\s*\/\s*friends\s*\)/], ["tip_text converted with int() and 5 added", /int\(\s*tip_text\s*\)\s*\+\s*5/], ["a CONVERT comment of eight or more words", note("CONVERT", 8), 1, "comments"]],
    "Run it.", [["Each pays: 5.75", /Each pays: 5\.75/], ["Tip plus 5: 20", /Tip plus 5: 20\b/]]));

/* 3.9 YouTube */
ASG.u3l9.stages.push(
  X("Share of views and dislikes", ["Print `Total views:` followed by the three videos added up. Then print `Video 2 share:` followed by video 2's percent of all the views, **rounded to one decimal place**. Make **`dislikes`** equal to `5` and print `Dislike percent:` followed by the percent of `viewers` who disliked it."],
    "Write the three prints and the variable.", `print("Total views:", views_1 + views_2 + views_3)\nprint("Video 2 share:", round(views_2 / (views_1 + views_2 + views_3) * 100, 1))\ndislikes = 5\nprint("Dislike percent:", dislikes / viewers * 100)`,
    [["adding the three views for the total", /print\(\s*["']Total views:["']\s*,\s*views_1\s*\+\s*views_2\s*\+\s*views_3\s*\)/], ["round with one decimal on video 2's share", /round\(\s*views_2\s*\/.*,\s*1\s*\)/], ["dislikes divided by viewers times 100", /dislikes\s*\/\s*viewers\s*\*\s*100/]],
    "Run it.", [["Video 2 share: 41.7", /Video 2 share: 41\.7/], ["Dislike percent: 10.0", /Dislike percent: 10\.0/]]),
  X("Sponsorship split", ["A sponsor pays `2500` dollars to be split by `4` partners. Store those in **`sponsor`** and **`partners`**. Print `Per partner:` followed by the exact share, and `Whole dollars:` followed by the share with **round** and no decimal places."],
    "Write the variables and the two prints.", `sponsor = 2500\npartners = 4\nprint("Per partner:", sponsor / partners)\nprint("Whole dollars:", round(sponsor / partners))`,
    [["sponsor is 2500", V("sponsor", "2500")], ["the exact share", /print\(\s*["']Per partner:["']\s*,\s*sponsor\s*\/\s*partners\s*\)/], ["round with no decimal places", /round\(\s*sponsor\s*\/\s*partners\s*\)/]],
    "Run it.", [["Per partner: 625.0", /Per partner: 625\.0/], ["Whole dollars: 625", /Whole dollars: 625\b(?!\.)/]]));

/* 3.10 UPS */
ASG.u3l10.stages.push(
  X("Pallets and hours", ["A pallet holds `4` cartons. Store that in **`per_pallet`** and print `Full pallets:` followed by how many **full** pallets the full cartons make. Then print `Whole hours:` followed by how many whole hours the route takes (it is `3600` seconds to an hour)."],
    "Write the variable and the two prints.", `per_pallet = 4\nprint("Full pallets:", full_cartons // per_pallet)\nprint("Whole hours:", route_seconds // 3600)`,
    [["per_pallet is 4", V("per_pallet", "4\\s*$")], ["full pallets with //", /full_cartons\s*\/\/\s*per_pallet/], ["whole hours with // 3600", /route_seconds\s*\/\/\s*3600/]],
    "Run it.", [["Full pallets: 2", /Full pallets: 2\b/], ["Whole hours: 1", /Whole hours: 1\b/]]),
  X("Rounding up", ["Even a **partly** full carton has to ship. Print `Cartons needed:` followed by the number of cartons for all the packages, **rounding up**, using only `//` (hint from the dock: add one less than the carton size before dividing). Then print `Floor of -17 / 5:` followed by `-17` floor divided by `5`. Add a comment that starts with `# ROUND UP:` and says in at least ten words why adding one less than the carton size makes floor division round up."],
    "Write the two prints and the comment.", `print("Cartons needed:", (packages + per_carton - 1) // per_carton)\nprint("Floor of -17 / 5:", -17 // 5)\n# ROUND UP: adding almost a whole carton pushes any leftover packages over the line so the division counts one more carton`,
    [["adding per_carton minus 1 before dividing", /\(\s*packages\s*\+\s*per_carton\s*-\s*1\s*\)\s*\/\/\s*per_carton/], ["floor division of -17 by 5", /-17\s*\/\/\s*5/], ["a ROUND UP comment of ten or more words", note("ROUND UP", 10), 1, "comments"]],
    "Run it.", [["Cartons needed: 9", /Cartons needed: 9\b/], ["Floor of -17 / 5: -4", /Floor of -17 \/ 5: -4/]]));

/* 3.11 Delta */
ASG.u3l11.stages.push(
  X("Layover and last group", ["Store a layover of `95` minutes in **`layover`** and print `Layover:` followed by the hours, the word `hours`, the leftover minutes and the word `minutes`. Then print `Last group full:` followed by whether the passengers fit into full groups with **nothing left over** (let Python decide True or False)."],
    "Write the variable and the two prints.", `layover = 95\nprint("Layover:", layover // 60, "hours", layover % 60, "minutes")\nprint("Last group full:", passengers % group_size == 0)`,
    [["hours with // 60", /layover\s*\/\/\s*60/], ["minutes with % 60", /layover\s*%\s*60/], ["checking passengers % group_size == 0", /passengers\s*%\s*group_size\s*==\s*0/]],
    "Run it with the same answer.", [["Layover: 1 hours 35 minutes", /Layover: 1 hours 35 minutes/], ["Last group full: False", /Last group full: False/]]),
  X("Gates and divisibility", ["Gates are numbered `0` to `9` and wrap around. Store `8` in **`gate`** and print `Next gate:` followed by the gate **three** steps later, wrapping around. Print `Divisible by 5:` followed by whether `confirmation` divides evenly by `5`. Add a comment that starts with `# WRAP:` and says in at least eight words why the remainder wraps numbers around."],
    "Write the variable, the prints and the comment.", `gate = 8\nprint("Next gate:", (gate + 3) % 10)\nprint("Divisible by 5:", confirmation % 5 == 0)\n# WRAP: the remainder can never reach the size of the divisor so it starts again at zero`,
    [["gate plus 3 with % 10", /\(\s*gate\s*\+\s*3\s*\)\s*%\s*10/], ["confirmation % 5 == 0", /confirmation\s*%\s*5\s*==\s*0/], ["a WRAP comment of eight or more words", note("WRAP", 8), 1, "comments"]],
    "Run it.", [["Next gate: 1", /Next gate: 1\b/], ["Divisible by 5: False", /Divisible by 5: False/]]));

/* 3.12 Tesla */
ASG.u3l12.stages.push(
  X("Back to Fahrenheit and the range", ["Make **`celsius`** equal to `20` and print `Fahrenheit:` followed by the conversion back (multiply by 9, divide by 5, then add 32). Then print `Range in miles:` followed by a `75` kilowatt-hour battery (that is `75` times `1000` watt-hours) divided by `250` watt-hours per mile."],
    "Write the variable and the two prints.", `celsius = 20\nprint("Fahrenheit:", celsius * 9 / 5 + 32)\nprint("Range in miles:", 75 * 1000 / 250)`,
    [["celsius is 20", V("celsius", "20\\s*$")], ["celsius times 9 divided by 5 plus 32", /celsius\s*\*\s*9\s*\/\s*5\s*\+\s*32/], ["the range formula", /75\s*\*\s*1000\s*\/\s*250/]],
    "Run it.", [["Fahrenheit: 68.0", /Fahrenheit: 68\.0/], ["Range in miles: 300.0", /Range in miles: 300\.0/]]),
  X("Parentheses change the answer", ["Print `Without parentheses:` followed by `2 + 3 * 4`, and `With parentheses:` followed by `(2 + 3) * 4`. Add a comment that starts with `# PARENS:` and says in at least ten words why the two answers are different."],
    "Write the two prints and the comment.", `print("Without parentheses:", 2 + 3 * 4)\nprint("With parentheses:", (2 + 3) * 4)\n# PARENS: multiplication happens before addition unless the parentheses force the addition to go first`,
    [["2 + 3 * 4 with no parentheses", /print\(\s*["']Without parentheses:["']\s*,\s*2\s*\+\s*3\s*\*\s*4\s*\)/], ["(2 + 3) * 4 with parentheses", /print\(\s*["']With parentheses:["']\s*,\s*\(\s*2\s*\+\s*3\s*\)\s*\*\s*4\s*\)/], ["a PARENS comment of ten or more words", note("PARENS", 10), 1, "comments"]],
    "Run it.", [["Without parentheses: 14", /Without parentheses: 14\b/], ["With parentheses: 20", /With parentheses: 20\b/]]));

/* 3.13 Roblox */
ASG.u3l13.stages.push(
  X("Marketplace fee", ["Roblox keeps `60` Robux of the sale as a marketplace fee. Take it from the **same** `robux` variable (it is `240` at this point), print `After fee:` followed by the balance, and add a comment on that line that starts with `# TRACE:` and gives the number `robux` holds after it. Add a comment that starts with `# FEE:` and says in at least eight words why you changed the same variable instead of making a new one."],
    "Write the change, the print and the comments.", `robux = robux - 60   # TRACE: 180\nprint("After fee:", robux)\n# FEE: one variable always holds the current balance so a new one would be out of date`,
    [["robux reduced by 60", /^\s*robux\s*(=\s*robux\s*-\s*60|-=\s*60)/m], ["printing After fee with robux", /print\(\s*["']After fee:["']\s*,\s*robux\s*\)/], ["a TRACE comment with 180", /TRACE:.*\b180\b/, 1, "comments"], ["a FEE comment of eight or more words", note("FEE", 8), 1, "comments"]],
    "Run it.", [["After fee: 180", /After fee: 180/]]),
  X("Another trade", ["You buy a `25` Robux item from your friend. Change **both** `my_robux` and `friend_robux`, then print `Me now:` and `Friend now:` followed by each balance. Add a comment that starts with `# TRACE:` and gives both new balances."],
    "Write the two changes, the prints and the comment.", `my_robux = my_robux - 25\nfriend_robux = friend_robux + 25\nprint("Me now:", my_robux)\nprint("Friend now:", friend_robux)\n# TRACE: me 25 and friend 75`,
    [["my_robux reduced by 25", /^\s*my_robux\s*(=\s*my_robux\s*-\s*25|-=\s*25)/m], ["friend_robux raised by 25", /^\s*friend_robux\s*(=\s*friend_robux\s*\+\s*25|\+=\s*25)/m], ["a TRACE comment with 25 and 75", /TRACE:.*\b25\b.*\b75\b/, 1, "comments"]],
    "Run it.", [["Me now: 25", /Me now: 25\b/], ["Friend now: 75", /Friend now: 75\b/]]));

module.exports = {};
