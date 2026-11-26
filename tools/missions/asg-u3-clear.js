/* THE CLEAR STEP LAYOUT for the Unit 3 assignments 3.2 to 3.13 (3.1 is written in this layout in asg-u3a.js).
   The checks, the hidden reference programs and the company stories stay exactly as they are in asg-u3a/b/c.js. This file only rewrites HOW EACH STEP IS TAUGHT:
   a one-line Goal, the facts in a table, every instruction as its own small checkbox task, and the exact output to expect. Each task lists WHICH of the step's existing checks belong to it
   (by position), and CLEAR() refuses to build unless every check is used exactly once, so no check can be lost or counted twice.
   "What you should see" comes from testkit/u3-see.json, made by running each hidden reference program (qa-dump.mjs + the python step in it). Regenerate it after changing a reference program. */
"use strict";
const { ASG, PURPOSE } = require("./asg-kit.js");
const SEE = Object.assign({}, require("./testkit/u3-see.json"), require("./testkit/u4-see.json"), require("./testkit/u5-see.json"));
const HOW = "**How each step works:** read the **Goal**, then do the tasks in order. Every task has its own checkbox, and the small line under it turns green when your code has what the task needs. After you press **Run**, compare your output with **What you should see**.";
const SCORE_T = "**Scoring:** worth **100 points**. There is no code to copy, so write it yourself. Use the names and values in the tables exactly. **100%** is full points.";
const SCORE_N = "**Scoring:** worth **100 points**. There is no code to copy, so write it yourself. Use the names in **bold** and the labels in `code` exactly. **100%** is full points.";
const NOTHING = ["Nothing prints in this step.", "You should see no red error."];
const T = (head, rows) => ({ head, rows });
const VT = (rows) => T(["Variable name", "Value", "Kind of value"], rows);      /* the facts table used in most steps */
function CLEAR(id, steps, o) {
  const a = ASG[id]; if (!a) throw new Error("no assignment " + id);
  if (steps.length !== a.stages.length) throw new Error(id + ": " + steps.length + " step specs for " + a.stages.length + " steps");
  const see = SEE[id]; let anyTable = false;
  a.stages.forEach((s, i) => {
    const c = steps[i], all = (s.chk || []).slice(), used = new Set();
    s.goal = c.goal; s.say = c.say ? [].concat(c.say) : []; if (c.table) { s.table = c.table; anyTable = true; }
    const parts = c.tasks.map((t) => { t[1].forEach((ix) => { if (!all[ix]) throw new Error(id + " step " + (i + 1) + ": no check #" + ix); if (used.has(ix)) throw new Error(id + " step " + (i + 1) + ": check #" + ix + " used twice"); used.add(ix); }); return [t[0], t[1].map((ix) => all[ix])]; });
    if (used.size !== all.length) throw new Error(id + " step " + (i + 1) + ": " + (all.length - used.size) + " check(s) not assigned to a task (checks: " + all.map((x, j) => j + ":" + x[0]).join(" | ") + ")");
    s.type = parts[0][0]; s.chk = parts[0][1]; s.do = parts.slice(1).map((x) => ({ t: x[0], c: x[1] }));
    s.run = c.run !== undefined ? c.run : s.run;
    const sl = c.see || (see.stages[i].length ? see.stages[i] : NOTHING); s.see = sl;
  });
  a.how = HOW; a.scoring = anyTable ? SCORE_T : SCORE_N;
  a.fin = { title: "Check your whole program", say: ["Press **Run** one last time" + (o && o.inputs ? " and answer the questions the same way (" + o.inputs + ")" : "") + ((o && o.fin) ? ". This program uses random numbers, so your numbers will differ every run. Your output should have the same kinds of lines as the box below" : ". Your output should match the box below, line for line") + ". (If you did the stretch steps, you will see their extra lines at the end.)"], see: (o && o.fin) || see.fin,
    do: ["Run the whole program and compare it with the output above.", "Look at the checklist above: every box should be green.", "Press **Submit** when your score says 100%."] };
}
module.exports = { CLEAR, VT, T, NOTHING };

/* ---------------------------------------------------------------- 3.2 */
CLEAR("u3l2", [
  { goal: "Set up the file and store the Battery page facts, each as the right kind of value.",
    say: ["A zip code is never used for math, so it is stored as **text**: put its value in quotes."],
    table: VT([["`model_name`", "iPhone 15", "text"], ["`battery_cycles`", "312", "whole number"], ["`battery_health`", "91.5", "decimal number"], ["`is_charging`", "True", "yes/no (True or False)"], ["`zip_code`", "30326", "text (in quotes)"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make the five variables in the table above. Use the exact names, and the kind of value shown in the last column.", [1, 2, 3, 4, 5]]] },
  { goal: "Prove to QA that every fact has the right type.",
    say: ["`type(x)` tells you what kind of value `x` holds. Printing it lets QA see the kind."],
    tasks: [["Under a heading comment, print the **type** of `model_name`, `battery_cycles` and `battery_health`: one `print` line for each.", [0, 1, 2]],
            ["Print the **type** of `is_charging` and `zip_code`: one `print` line for each.", [3, 4]]] },
  { goal: "Let Python decide the two service rules by comparing numbers.",
    say: ["The Battery page shows **Battery OK** when the health is at least `80`. A phone counts as **heavily used** at `500` cycles or more. Do **not** type True or False yourself: compare the numbers and let Python work it out."],
    tasks: [["Under a heading comment, make `battery_ok` by comparing `battery_health` with `80` (at least 80 is OK).", [0]],
            ["Make `heavy_use` by comparing `battery_cycles` with `500` (500 or more is heavy use).", [1]],
            ["Print the label `BATTERY OK`, then print `battery_ok`.", [2, 3]],
            ["Print the label `HEAVY USE`, then print `heavy_use`.", [4, 5]]] },
  { goal: "Handle a sensor failure: the same variable now holds text.",
    say: ["When the sensor fails, Apple replaces the cycle count with the text `Unknown`. Change the **same** variable. Do not make a new one."],
    tasks: [["Under a heading comment, change `battery_cycles` to the text `Unknown`.", [0]],
            ["Print the label `SENSOR DOWN`, then print the **type** of `battery_cycles`.", [1, 2]]] },
  { goal: "The Storage page needs the same kinds of facts.",
    table: VT([["`storage_gb`", "128", "whole number"], ["`free_gb`", "31.5", "decimal number"]]),
    tasks: [["Under a heading comment, make the two variables in the table above.", [0]],
            ["Make `storage_ok` by comparing `free_gb` with `10` (at least 10 is OK, and let Python decide).", [1]],
            ["Print the label `STORAGE OK`, then print `storage_ok`.", [2, 3]]] },
  { goal: "Work out a repair estimate and say what type it is.",
    table: VT([["`repair_cost`", "79.0", "decimal number"], ["`parts_needed`", "2", "whole number"]]),
    tasks: [["Under a heading comment, make the two variables in the table above.", [0, 1]],
            ["Store their product (the cost times the parts) in `estimate`, then print the label `ESTIMATE`, the estimate, and its **type**.", [2]],
            ["Add a comment that starts with `# TYPES:` and says, in at least eight words, why that type comes out.", [3]]] }
]);

/* ---------------------------------------------------------------- 3.3 */
CLEAR("u3l3", [
  { goal: "Ask the customer five questions and store each answer in its own variable.",
    say: ["Everything a customer types arrives as **text**, even digits. Type each question exactly as shown, including the colon and the space at the end."],
    table: T(["Question to ask", "Variable to store it in"], [["`Name for the order: `", "`customer`"], ["`Sandwich: `", "`sandwich`"], ["`Pickup minutes? `", "`pickup_text`"], ["`Sauce code 1: `", "`sauce_one`"], ["`Sauce code 2: `", "`sauce_two`"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Ask the five questions in the table with `input()`, one per line, each answer stored in the variable shown.", [1, 2, 3, 4, 5]]],
    see: ["The program stops and waits for your five answers.", "You should see no red error."] },
  { goal: "Print the kitchen ticket.",
    say: ["Every label and every value gets its own `print` line."],
    tasks: [["Under a heading comment, print the line `KITCHEN TICKET`.", [0]],
            ["Print the label `ORDER FOR` and then `customer`; the label `SANDWICH` and then `sandwich`; the label `PICKUP MINUTES` and then `pickup_text`. That is six `print` lines.", [1, 2, 3]],
            ["Print the label `PICKUP TYPE`, then print the **type** of `pickup_text`, so the kitchen sees what kind of value the app received.", [4]]] },
  { goal: "Make the ticket code from the two sauce codes.",
    say: ["The kitchen wants the two codes **stuck together**, so 12 and 34 make `1234`, not 46."],
    tasks: [["Under a heading comment, print the label `TICKET CODE`.", [0]],
            ["Print the two sauce codes stuck together into one piece of text. Join them with `+`.", [1]]] },
  { goal: "Read the order back in one sentence.",
    tasks: [["Under a heading comment, print the label `READ BACK`.", [0]],
            ["Print one line made by joining text with `+`: the customer's name, then ` ordered a ` (with a space on each side), then the sandwich.", [1, 2]]] },
  { goal: "Make a rewards code from the name and both sauce codes.",
    tasks: [["Under a heading comment, print the label `REWARDS CODE`.", [0]],
            ["Print the customer's name and both sauce codes joined together into one piece of text.", [1]],
            ["Add a comment that starts with `# PLUS:` and says, in at least eight words, why the sauce codes 12 and 34 come out as 1234 and not 46.", [2]]] }
], { inputs: "Maria, spicy chicken, 10, 12 and 34" });

/* ---------------------------------------------------------------- 3.4 */
CLEAR("u3l4", [
  { goal: "Set up the file and store the facts about one purchase.",
    table: VT([["`game_title`", "Portal 2", "text"], ["`price`", "9.99", "decimal number"], ["`copies`", "2", "whole number"], ["`is_gift`", "True", "yes/no (True or False)"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make the four variables in the table above. Use the exact names and values.", [1, 2, 3, 4]]] },
  { goal: "Print the receipt. Every line is ONE piece of text joined with `+`.",
    say: ["Python crashes if you join text with a number or a True/False value, so convert those with `str()` first. A **divider** is made by **repeating** a character, so you do not have to type all ten equal signs."],
    run: "Run it. A TypeError means a number or a True/False value was not converted.",
    tasks: [["Under a heading comment, print a divider of exactly **ten equal signs**, made by repeating `=` (do not type ten of them).", [0]],
            ["Print `Game: Portal 2`, built by joining the label `Game: ` and `game_title` with `+`.", [1]],
            ["Print `Price: $9.99`, joining the label `Price: $` and `price`. Convert `price` with `str()` first.", [2]],
            ["Print `Copies: 2` the same way. Convert `copies` with `str()`.", [3]],
            ["Print `Gift: True` the same way. Convert `is_gift` with `str()`.", [4]]] },
  { goal: "Print the total and close the receipt.",
    say: ["This time use a **comma** between the label and the math, not `+`. Python puts the space in for you."],
    tasks: [["Print `Total:` followed by the price times the number of copies, with a comma between the label and the math.", [0]],
            ["Print the same divider again to close the receipt.", [1]]] },
  { goal: "Build the sale banner.",
    table: VT([["`games_on_sale`", "3", "whole number"], ["`sale_percent`", "50", "whole number"]]),
    tasks: [["Under a heading comment, make the two variables in the table above.", [0, 1]],
            ["Print one joined line like `3 games are 50% off`. Use `+`, and convert both numbers with `str()`.", [2]],
            ["Print a row of stars by **repeating** `*` once for every game on sale.", [3]]] },
  { goal: "Show the total as joined text, and explain the crash.",
    tasks: [["Make `total_text` by converting the price times the copies into text with `str()`.", [0]],
            ["Print `Total due: $` joined to `total_text` with `+`.", [1]],
            ["Add a comment that starts with `# JOIN:` and says, in at least ten words, why `\"Copies: \" + copies` would crash when `copies` is a number.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.5 */
CLEAR("u3l5", [
  { goal: "Ask for a username and count its characters.",
    run: "Run it and type creator.",
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Ask the creator `Pick a username: ` with `input()` and store the answer in `username`.", [1]],
            ["Under a heading comment, print the label `LENGTH`, then the number of characters in `username` (use `len()`).", [2, 3]]] },
  { goal: "Print the first and the last character.",
    say: ["Count from the **end** to get the last character, so it works for a name of any length."],
    tasks: [["Print the label `FIRST`, then the first character of `username`.", [0, 1]],
            ["Print the label `LAST`, then the last character, counting from the end.", [2, 3]]] },
  { goal: "Print the middle, the third and the second-to-last character.",
    tasks: [["Print the label `MIDDLE`, then the middle character. Work the position out from the length (do not type a number), so it works for any name.", [0, 1]],
            ["Print the label `THIRD`, then the third character of the name.", [2]],
            ["Print the label `SECOND TO LAST`, then the character just before the last one, counting from the end.", [3]]] },
  { goal: "Find the highest position that really exists.",
    say: ["A junior engineer's badge code asked for the character at the position **equal to the length** of the name, and it crashed. The highest position that really exists is one less than the length."],
    tasks: [["Print the label `LAST INDEX`, then the highest position that really exists, worked out from the length.", [0, 1]],
            ["Add a comment that starts with `# IMMUTABLE:` and explains, in at least eight words, why changing the first character of a string with an equals sign would crash.", [2]]] },
  { goal: "Add the badge text.",
    tasks: [["Under a heading comment, print the label `BADGE`, then the first and last characters of the username **joined together** into one piece of text (like `cr`).", [0]],
            ["Print the label `STARS`, then a row of stars: **one star for every character** in the name. Repeat the `*` by the length; do not type the stars.", [1, 2]]] },
  { goal: "Count from both ends.",
    tasks: [["Print the label `FOURTH FROM THE END`, then the fourth character counting from the end.", [0]],
            ["Print the label `LAST TWO`, then the last two characters (join the second to last and the last).", [1]],
            ["Add a comment that starts with `# COUNT:` and says, in at least eight words, why a seven-letter name has no position 7.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.6 */
CLEAR("u3l6", [
  { goal: "Cut a confirmation code into its pieces with slices.",
    say: ["The code is `ATL20261125GUEST`. A slice `text[start:stop]` takes the characters from `start` up to, but **not** including, `stop`."],
    table: T(["Piece", "Where it is in the code", "Characters"], [["Airport", "the start", "the first 3"], ["Year", "right after the airport", "the next 4"], ["Month and day", "right after the year", "the next 4"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make `confirmation` equal to the text `ATL20261125GUEST`.", [1]],
            ["Under a heading comment, print the label `Airport:` followed by its piece: the first **three** characters, cut out with a slice.", [2]],
            ["Print `Year:` followed by the **next four** characters.", [3]],
            ["Print `Month and day:` followed by the **four after that**.", [4]]] },
  { goal: "Use negative numbers in slices to count from the end.",
    say: ["The last **five** characters of the code say who booked."],
    tasks: [["Print `Booked by:` followed by the last five characters (a slice that starts 5 from the end).", [0]],
            ["Print `Code only:` followed by everything **except** those last five (a slice that stops 5 from the end).", [1]]] },
  { goal: "Cut up a phone number and make a short preview.",
    say: ["The text message only has room for a short preview of the code."],
    table: VT([["`phone`", "7705551234", "text (a label, not a number to do math with)"]]),
    tasks: [["Make `phone` equal to the **text** `7705551234`.", [0]],
            ["Under a heading comment, print `Area code:` (the first three digits), `Prefix:` (the next three digits) and `Line:` (everything from the seventh digit to the end). That is three `print` lines.", [1, 2, 3]],
            ["Print `Preview:` followed by the **first eight** characters of the confirmation code, **followed by three dots**.", [4]]] },
  { goal: "Make a guest tag and hide most of the phone number.",
    tasks: [["Under a heading comment, print `Guest tag:` followed by the last five characters of the confirmation, a dash, then the first three characters (like `GUEST-ATL`).", [0]],
            ["Print `Phone:` followed by six stars, made by **repeating** `*` (do not type them), joined to the **last four digits** of the phone number.", [1, 2]]] },
  { goal: "Pull the month and the day out of the date.",
    tasks: [["Print `Month:` followed by the two characters of the month, and `Day:` followed by the two characters of the day. They are the two pieces inside the month and day.", [0, 1]],
            ["Add a comment that starts with `# SLICE:` and says, in at least ten words, why `confirmation[3:7]` gives four characters and not five.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.7 */
CLEAR("u3l7", [
  { goal: "Ask for an email address and find the position of the @ sign.",
    say: ["Let Python find the position with `.find()`. Do not count by hand."],
    run: "Run it and type ava.smith@gmail.com.",
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Ask `Email: ` with `input()` and store the answer in `email`.", [1]],
            ["Under a heading comment, store the position of the `@` sign in `at`.", [2]],
            ["Print `At position:` followed by that number.", [3]]] },
  { goal: "Split the address into the username, the domain and the provider.",
    say: ["Use the position you found to slice. The **provider** is the part of the domain that comes before its first dot (for `gmail.com` it is `gmail`)."],
    tasks: [["Store everything **before** the `@` in `username`, using the position you found.", [0]],
            ["Store everything **after** the `@` in `domain`.", [1]],
            ["Find the position of the first `.` **inside the domain** and store it in `dot`.", [2]],
            ["Print `Username:`, `Domain:` and `Provider:` (the part of the domain before the dot), each followed by its piece.", [3]]] },
  { goal: "See what `.find()` returns when the text is not there.",
    say: ["Some people forget the `@` sign. The team needs to see what Python gives back when something is not found."],
    tasks: [["Under a heading comment, make `bad_email` equal to `ava.smith.gmail.com` (it has no `@`).", [0]],
            ["Find the `@` in `bad_email` and print `Bad email position:` followed by the answer.", [1]],
            ["Print `Gmail starts at:` followed by the position where the text `gmail` begins inside the email the user typed.", [2]]] },
  { goal: "Measure the username and find the extension.",
    tasks: [["Under a heading comment, print `Name length:` followed by how many characters are in the username part.", [0]],
            ["Print `Extension:` followed by what comes **after the dot** in the domain (the `com` part), using the position you already found in `dot`.", [1]],
            ["Print `Domain length:` followed by how many characters are in the domain.", [2]]] },
  { goal: "Check whether an address has an @ sign at all.",
    tasks: [["Make `has_at` by checking that the position of the `@` in `email` is **at least 0** (let Python answer True or False), then print `Has @:` followed by it.", [0]],
            ["Make `bad_has_at` the same way for `bad_email`, then print `Bad has @:` followed by it.", [1]],
            ["Add a comment that starts with `# FIND:` and says, in at least eight words, why -1 can never be a real position.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.8 */
CLEAR("u3l8", [
  { goal: "Ask four questions and convert the numbers.",
    say: ["Whatever a customer types is **text**. Convert the numbers to decimal numbers before any math. Keep the phone number as text: it is only a label, and a number would lose a leading zero."],
    table: T(["Question to ask", "Variable", "Store it as"], [["`Subtotal: `", "`subtotal`", "a decimal number"], ["`Tip as a decimal: `", "`tip_rate`", "a decimal number (the customer types `0.15` for 15 percent)"], ["`Miles: `", "`miles`", "a decimal number"], ["`Phone: `", "`phone`", "text: do not convert it"]]),
    run: "Run it and answer: 20, 0.15, 4 and 7705551234.",
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Ask `Subtotal: ` and store the answer as a **decimal number** in `subtotal`.", [1]],
            ["Ask `Tip as a decimal: ` and store the answer as a decimal number in `tip_rate`.", [2]],
            ["Ask `Miles: ` and store the answer as a decimal number in `miles`.", [3]],
            ["Ask `Phone: ` and store the answer in `phone` **without converting it**.", [4]]],
    see: ["The program stops and waits for your four answers.", "You should see no red error."] },
  { goal: "Work out what the customer pays.",
    say: ["DoorDash adds a delivery fee of `3.50` to every order."],
    tasks: [["Under a heading comment, store the tip in `tip`: the subtotal times the tip rate.", [0]],
            ["Store the total in `total`: the subtotal plus the tip.", [1]],
            ["Make `fee` equal to `3.50`.", [2]],
            ["Print `Tip:` and `Total:` followed by each, and `Customer pays:` followed by the total **plus the fee**.", [3]]] },
  { goal: "Work out what the Dasher earns.",
    table: T(["Part of the pay", "Amount"], [["Base pay", "1.50"], ["For every mile", "0.60"], ["Tip", "the tip you already worked out"]]),
    tasks: [["Under a heading comment, print `Dasher pay:` followed by the pay: the base, plus `0.60` for every mile, plus the tip.", [0]]] },
  { goal: "Show that the phone number stays text.",
    say: ["The Dasher also needs the customer's phone number. The team wants to see that it was never converted."],
    tasks: [["Print `Phone:` followed by the phone number.", [0]],
            ["Print `Phone type:` followed by the **type** of `phone`.", [1]]] },
  { goal: "Add Peak Pay: an extra bonus for the Dasher.",
    table: VT([["`peak_bonus`", "2.50", "decimal number"]]),
    tasks: [["Under a heading comment, make `peak_bonus` equal to `2.50`.", [0]],
            ["Print `With Peak Pay:` followed by the Dasher pay from before **plus the bonus**.", [1]],
            ["Print `Per mile:` followed by what the miles earn on their own (`0.60` for every mile).", [2]]] },
  { goal: "Price an order for a team of friends.",
    tasks: [["Make `team_size` equal to `4`.", [0]],
            ["Print `Team total:` followed by the customer total times the team size.", [1, 2]],
            ["Add a comment that starts with `# CONVERT:` and says, in at least eight words, why the phone number was not converted but the subtotal was.", [3]]] }
], { inputs: "20, 0.15, 4 and 7705551234" });

/* ---------------------------------------------------------------- 3.9 */
CLEAR("u3l9", [
  { goal: "Store the numbers for one creator.",
    table: VT([["`views_1`", "1200", "whole number"], ["`views_2`", "1500", "whole number"], ["`views_3`", "900", "whole number"], ["`likes`", "45", "whole number"], ["`viewers`", "50", "whole number"], ["`pool`", "1000", "whole number (the revenue pool in dollars)"], ["`creators`", "3", "whole number"], ["`watch_minutes`", "1830", "whole number"], ["`videos`", "4", "whole number"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make the nine variables in the table above. Use the exact names and values.", [1, 2, 3, 4, 5, 6, 7, 8, 9]]] },
  { goal: "Work out the creator's average views.",
    say: ["An average is the numbers added up, then divided by how many there are. A `/` division always gives a decimal number (a float)."],
    tasks: [["Under a heading comment, print `Average views:` followed by the average of the three view counts.", [0]],
            ["Add a comment that starts with `# FLOAT:` and says, in at least eight words, why the answer shows a decimal point even though it divides evenly.", [1]]] },
  { goal: "Work out a percent and a fair share, and round them.",
    say: ["`round(number, 1)` rounds to one decimal place, and `round(number, 2)` rounds to two."],
    tasks: [["Under a heading comment, print `Like percent:` followed by the percent of the `viewers` who liked the video (`likes` out of `viewers`), **rounded to one decimal place**.", [0]],
            ["Print `Each creator gets:` followed by the revenue `pool` split between the `creators`, **rounded to two decimal places**.", [1]]] },
  { goal: "Find the average watch time, and learn what happens when you divide by zero.",
    tasks: [["Under a heading comment, print `Average minutes:` followed by `watch_minutes` divided by `videos`.", [0]],
            ["Add a comment that starts with `# CRASH:` and explains, in at least eight words, what Python does if you divide a number by zero, such as for a brand new channel with `0` videos.", [1]]] },
  { goal: "Find the total views and each share of them.",
    table: VT([["`dislikes`", "5", "whole number"]]),
    tasks: [["Under a heading comment, print `Total views:` followed by the three videos added up.", [0]],
            ["Print `Video 2 share:` followed by video 2's percent of all the views, **rounded to one decimal place**.", [1]],
            ["Make `dislikes` equal to `5`, then print `Dislike percent:` followed by the percent of `viewers` who disliked it.", [2]]] },
  { goal: "Split a sponsorship between partners.",
    table: VT([["`sponsor`", "2000", "whole number (dollars)"], ["`partners`", "3", "whole number"]]),
    tasks: [["Make `sponsor` and `partners` with the values in the table above.", [0]],
            ["Print `Per partner:` followed by the exact share (the sponsor money divided by the partners).", [1]],
            ["Print `To the cent:` followed by the share **rounded to two decimal places**.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.10 */
CLEAR("u3l10", [
  { goal: "Store today's dock numbers.",
    table: VT([["`packages`", "100", "whole number"], ["`per_carton`", "12", "whole number"], ["`trucks`", "17", "whole number"], ["`docks`", "5", "whole number"], ["`route_seconds`", "4000", "whole number"], ["`tracking`", "472", "whole number"], ["`scale_reading`", "-7", "whole number (a scale tared below zero)"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make the seven variables in the table above. Use the exact names and values.", [1, 2, 3, 4, 5, 6, 7]]] },
  { goal: "Compare the exact number of cartons with the number of FULL cartons.",
    say: ["`/` keeps the decimal part. `//` (floor division) throws it away. Operations wants to see both. Python prints a long decimal for the exact answer."],
    tasks: [["Under a heading comment, print `Exact cartons:` followed by `packages` divided by `per_carton` with the **normal** division `/`.", [0]],
            ["Store the number of **full** cartons in `full_cartons`, using floor division `//`.", [1]],
            ["Print `Full cartons:` followed by `full_cartons`.", [2]]] },
  { goal: "Use floor division for the docks and for the route.",
    tasks: [["Under a heading comment, print `Trucks per dock:` followed by how many **whole** trucks each dock gets (floor division).", [0]],
            ["Print `Whole minutes:` followed by how many **full minutes** the route takes. The route takes `route_seconds` seconds, and there are 60 seconds in a minute.", [1]]] },
  { goal: "Chop digits off a number, and see the trap with negative numbers.",
    say: ["Floor division by `10` chops off the last digit of a number, and by `100` it chops off the last two."],
    tasks: [["Under a heading comment, print `Hundreds:` followed by only the **first digit** of the tracking number (floor division by 100).", [0]],
            ["Print `Without last digit:` followed by the tracking number with its last digit chopped off (floor division by 10).", [1]],
            ["Print `Scale halves:` followed by the scale reading floor divided by `2`.", [2]],
            ["Add a comment that starts with `# NEGATIVE:` and explains, in at least ten words, why that answer surprises people.", [3]]] },
  { goal: "Count pallets and whole hours.",
    table: VT([["`per_pallet`", "4", "whole number"]]),
    tasks: [["Under a heading comment, make `per_pallet` equal to `4`.", [0]],
            ["Print `Full pallets:` followed by how many **full** pallets the full cartons make.", [1]],
            ["Print `Whole hours:` followed by how many whole hours the route takes (3600 seconds make an hour).", [2]]] },
  { goal: "Round up: even a partly full carton has to ship.",
    tasks: [["Print `Cartons needed:` followed by the number of cartons for **all** the packages, **rounding up**, using only `//`. Add one less than the carton size before you divide.", [0]],
            ["Print `Leftover packages:` followed by the packages that do not fill a full carton (the packages minus the full cartons times the carton size).", [1]],
            ["Add a comment that starts with `# ROUND UP:` and says, in at least ten words, why adding one less than the carton size makes floor division round up.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.11 */
CLEAR("u3l11", [
  { goal: "Ask for a seat row and store the flight facts.",
    table: VT([["`flight_minutes`", "135", "whole number"], ["`passengers`", "200", "whole number"], ["`group_size`", "6", "whole number"], ["`confirmation`", "4721", "whole number"], ["`depart_hour`", "22", "whole number"], ["`flight_hours`", "5", "whole number"]]),
    run: "Run it and type 14 for the seat row.",
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Ask `Seat row? ` with `input()` and store the answer as a **whole number** in `row`.", [1]],
            ["Make the six variables in the table above. Use the exact names and values.", [2, 3, 4, 5, 6, 7]]],
    see: ["The program stops and waits for the seat row.", "You should see no red error."] },
  { goal: "Work out the flight time and whether the seat row is even.",
    say: ["`//` gives how many whole times a number fits, and `%` gives what is left over. Even rows have the window seat on the left."],
    tasks: [["Under a heading comment, store the whole hours of the flight in `hours` (use `//`).", [0]],
            ["Store the leftover minutes in `minutes` (use `%`), then print one line exactly like `Flight time: 2 hours 15 minutes`, built from `hours` and `minutes`.", [1]],
            ["Store in `is_even` whether the seat row is even: let Python answer True or False from the remainder of dividing by 2.", [2]],
            ["Print `Even row:` followed by `is_even`.", [3]]] },
  { goal: "Work out the boarding groups, and pick digits out of the confirmation number.",
    tasks: [["Under a heading comment, print `Full groups:` followed by how many full boarding groups the passengers make.", [0]],
            ["Print `Left over:` followed by how many passengers do not fill a group.", [1]],
            ["Print `Last digit:` followed by the last digit of the confirmation number.", [2]],
            ["Print `Without last digit:` followed by the confirmation number with its last digit removed.", [3]]] },
  { goal: "Wrap an arrival time around the 24-hour clock.",
    say: ["The flight leaves at `depart_hour` on a 24-hour clock and lasts `flight_hours` hours. After hour 23 the clock wraps back around to 0."],
    tasks: [["Under a heading comment, print `Arrives at hour:` followed by the hour the plane lands, **wrapping around** after 23.", [0]]] },
  { goal: "Work out a layover time and check whether the last group is full.",
    table: VT([["`layover`", "95", "whole number (minutes)"]]),
    tasks: [["Under a heading comment, make `layover` equal to `95`, then print `Layover:` followed by the whole hours, the word `hours`, the leftover minutes and the word `minutes`.", [0, 1]],
            ["Print `Last group full:` followed by whether the passengers fit into full groups with **nothing left over** (let Python decide True or False).", [2]]] },
  { goal: "Wrap gate numbers around, and test whether a number divides evenly.",
    tasks: [["Under a heading comment, make `gate` equal to `8`, then print `Next gate:` followed by the gate **three** steps later. Gates are numbered 0 to 9 and wrap around.", [0]],
            ["Print `Divisible by 5:` followed by whether `confirmation` divides evenly by `5` (let Python decide True or False).", [1]],
            ["Add a comment that starts with `# WRAP:` and says, in at least eight words, why the remainder wraps numbers around.", [2]]] }
], { inputs: "14 for the seat row" });

/* ---------------------------------------------------------------- 3.12 */
CLEAR("u3l12", [
  { goal: "Store the car's sensor readings.",
    table: VT([["`fahrenheit`", "68", "whole number"], ["`trip_1`", "250", "whole number (watt-hours per mile)"], ["`trip_2`", "280", "whole number (watt-hours per mile)"], ["`trip_3`", "310", "whole number (watt-hours per mile)"], ["`speed`", "5", "whole number"], ["`charge_kwh`", "30", "whole number"], ["`cells`", "20", "whole number"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Make the seven variables in the table above. Use the exact names and values.", [1, 2, 3, 4, 5, 6, 7]]] },
  { goal: "Work out the cabin temperature and the average efficiency.",
    say: ["Python follows the order of operations: parentheses first, then powers, then multiplication and division from left to right, then addition and subtraction. Use parentheses to get the order you want."],
    tasks: [["Under a heading comment, print `Celsius:` followed by the temperature in Celsius: **subtract 32, then multiply by 5, then divide by 9**.", [0]],
            ["Print `Average:` followed by the average of the three trips: add them up, then divide by 3.", [1]]] },
  { goal: "Use powers for air drag and for the battery pack.",
    say: ["Air drag grows with the **square** of the speed, and the battery pack is a square of cells."],
    tasks: [["Under a heading comment, print `Drag:` followed by the speed **squared**, times `2`, plus `10`.", [0]],
            ["Print `Battery cells:` followed by `4` plus `2`, all **squared**.", [1]]] },
  { goal: "Put several operations in one expression.",
    table: T(["Part of a charging stop", "Amount"], [["Fee", "4 dollars"], ["For every kilowatt-hour of the charge", "0.25 dollars"], ["Coupon", "5 dollars off"]]),
    tasks: [["Under a heading comment, print `Cost:` followed by **one expression** that does it all: the fee, plus `0.25` for every kilowatt-hour in `charge_kwh`, minus the coupon.", [0]],
            ["Print `Cells that ship:` followed by how many of the `cells` go out in **full packs of 3 only**: floor division by 3, then multiply by 3.", [1]],
            ["Add a comment that starts with `# ORDER:` and lists, in at least ten words, the order Python follows: parentheses, powers, then what.", [2]]] },
  { goal: "Convert back to Fahrenheit and work out the range.",
    table: VT([["`celsius`", "20", "whole number"], ["`battery_kwh`", "75", "whole number"]]),
    tasks: [["Under a heading comment, make `celsius` equal to `20`, then print `Fahrenheit:` followed by the conversion back: multiply by 9, divide by 5, then add 32.", [0]],
            ["Make `battery_kwh` equal to `75`.", [1]],
            ["Print `Range in miles:` followed by the battery in watt-hours (kilowatt-hours times `1000`) divided by `250` watt-hours per mile.", [2]]] },
  { goal: "Reproduce the average bug that QA found.",
    tasks: [["Print `Wrong average:` followed by the three trips added with **no parentheses** and divided by 3. (This is the bug.)", [0]],
            ["Print `Right average:` followed by the correct average, with parentheses.", [1]],
            ["Add a comment that starts with `# PARENS:` and says, in at least ten words, why the two answers are different.", [2]]] }
]);

/* ---------------------------------------------------------------- 3.13 */
CLEAR("u3l13", [
  { goal: "Track a player's Robux balance one line at a time.",
    say: ["Change the **same** variable each time. A `# TRACE:` comment gives the number the variable holds right after that line, the way an auditor traces a program by hand."],
    table: T(["What happens", "What you do to `robux`"], [["The balance starts at", "`100`"], ["The player sells an item", "add `50`"], ["The player buys a hat", "take away `30`"], ["A sale event", "double the balance"]]),
    tasks: [["Make the **first line** of the file a comment that starts with `# PURPOSE:` and says, in at least five words, what this program is for.", [0]],
            ["Store the balance in `robux`, starting at `100`.", [1]],
            ["Add `50` to `robux`. At the **end of that line**, add a comment that starts with `# TRACE:` and gives the number `robux` holds after it.", [2, 5]],
            ["Take away `30` from `robux`, with a `# TRACE:` comment at the end of that line giving the new number.", [3, 6]],
            ["Double `robux`, with a `# TRACE:` comment at the end of that line giving the new number. Then print the label `Final balance:` followed by `robux`.", [4, 7]]] },
  { goal: "Trace a trade between two players.",
    table: VT([["`my_robux`", "80", "whole number"], ["`friend_robux`", "20", "whole number"]]),
    tasks: [["Under a heading comment, make `my_robux` and `friend_robux` with the values in the table above.", [0, 1]],
            ["You give your friend `30`: take it away from `my_robux`.", [2]],
            ["Add the same `30` to `friend_robux`, then print `Me:` followed by `my_robux`, and `Friend:` followed by `friend_robux`.", [3]]] },
  { goal: "A variable does not follow another one.",
    say: ["A classic trap in the audit: `cost` is worked out from `price` **once**. It does not change when `price` changes later."],
    table: VT([["`price`", "10", "whole number"]]),
    tasks: [["Under a heading comment, make `price` equal to `10`.", [0]],
            ["Make `cost` equal to `price` times `2`.", [1]],
            ["Change `price` to `15`, then print `Cost is still:` followed by `cost`.", [2]],
            ["Add a comment that starts with `# TRACE:` and explains, in at least eight words, why `cost` did not change when `price` did.", [3]]] },
  { goal: "Take the marketplace fee out of the balance.",
    say: ["Roblox keeps `60` Robux of the sale as a marketplace fee. The balance is `240` at this point."],
    tasks: [["Under a heading comment, take `60` away from the **same** `robux` variable.", [0]],
            ["Print `After fee:` followed by `robux`, and add a comment on that line that starts with `# TRACE:` and gives the number `robux` holds after it.", [1, 2]],
            ["Add a comment that starts with `# FEE:` and says, in at least eight words, why you changed the same variable instead of making a new one.", [3]]] },
  { goal: "Trace another trade.",
    say: ["You buy a `25` Robux item from your friend. Both balances change."],
    tasks: [["Under a heading comment, take `25` away from `my_robux`.", [0]],
            ["Add `25` to `friend_robux`.", [1]],
            ["Print `Me now:` followed by `my_robux`, and `Friend now:` followed by `friend_robux`. Add a comment that starts with `# TRACE:` and gives both new balances.", [2]]] }
]);
