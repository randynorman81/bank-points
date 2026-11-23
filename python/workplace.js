/* THE WORKPLACE SKIN for the lesson assignments (a126 and up). When an assignment has an entry here AND its saved record has the matching title, the editor shows it as a job at a real company:
   a company-colored header, an email from the boss, a files panel, a "Send to <boss>" button that answers with a review written from the student's actual results, and the stretch (extra credit) steps.
   Everything here is made up for a classroom simulation: the company did not write or endorse it, the people are invented, and no official logos are used (just the company name set in its colors).
   To add one: copy an entry, set `match` to the record title (title.includes), and write `stages` lines in the same order as the steps (regular steps first, then stretch steps). */
(function (g) {
  var W = {};

  W.a126 = {
    match: "Spotify Track Card", core: 5,
    brand: { name: "Spotify", color: "#1DB954", head: "#121212", ink: "#ffffff", team: "Content Platform", font: "800 22px 'Segoe UI',Helvetica,Arial,sans-serif", spacing: "-0.5px" },
    boss: { name: "Priya Nair", title: "Senior Backend Engineer", initials: "PN" },
    ticket: "CP-1042", file: "track_card.py",
    email: { subject: "Track card for Blinding Lights (needed before tomorrow's demo)", paras: [
      "Hi, and welcome to the Content Platform team! I'm glad you're here.",
      "Every song in the app has an info card, and the code behind the card keeps each fact in a variable. The Charts team is demoing tomorrow with **Blinding Lights**, and the card script still isn't done. Can you build it?",
      "The facts are in `track_data.txt`. Please follow the naming rules in `style_guide.md`: our review bot bounces anything that breaks them, and I'd rather not be the one who bounces yours.",
      "Work through the steps below in order. When you have a version that runs, click **Send to Priya** and I'll look it over and reply.",
      "If you finish early and want to take on more, there are two stretch tasks at the bottom. They're optional, but I notice the people who go the extra mile."], sign: "Thanks, Priya" },
    files: [
      { name: "track_data.txt", text: "title:     Blinding Lights\nartist:    The Weeknd\nplays:     4,000,000\nlength:    200 seconds\nexplicit:  no\n\nalbum:     After Hours   (stretch task)\nyear:      2020          (stretch task)" },
      { name: "style_guide.md", text: "BACKEND STYLE GUIDE (excerpt)\n\nVariable names\n  - lowercase words joined by underscores\n  - describe what the variable holds\n  - never start with a number\n  - no spaces and no dashes\n  - never reuse a word Python already owns (class, if, for, and so on)\n  - capital letters count: Play_Count and play_count are two different variables\n\nCards\n  - every printed line starts with a label that ends in a colon\n  - print the variable, never a typed-in copy of its value" }],
    review: {
      open: "Thanks for sending this over. I read through your track card script.",
      stages: [
        { ok: "All five variables are there, and the names follow our style guide. Clean and readable.", todo: "The facts aren't all stored yet. I need the five variables from the ticket with the exact names, holding the right kind of value." },
        { ok: "The card prints every fact with its label, straight from the variables. That's what I wanted.", todo: "The card isn't printing right yet. Check each label, and print the variable, not a typed copy." },
        { ok: "You updated the same play_count variable when the listener pressed play instead of making a new one. Good instinct.", todo: "The play count isn't updating the way I asked. It should change the same variable by one, then print Plays now." },
        { ok: "The top two songs are on the card, which the Charts team will like.", todo: "The top two songs aren't finished: two text variables and the #1 and #2 lines." },
        { ok: "And thank you for writing up the naming rules. That comment will save the next new hire a trip through the review bot.", todo: "The code review part still needs your NAME RULES comment and the Play_Count demo." },
        { ok: "Album and year on the card: that's a real improvement. Thank you for the extra.", todo: "Stretch: the album and year part isn't done yet. It's optional, so only if you have time." },
        { ok: "The Wrapped counter works, and your comment shows you understand why we reuse one variable. That's the thinking I'm looking for.", todo: "Stretch: the Wrapped counter isn't done yet. Also optional." }],
      approve: "That's everything I asked for. The card is ready for the demo.",
      moreStretch: "If you have time, there are stretch tasks at the bottom. I'll happily look at those too.",
      allDone: "I'm putting you down for the Charts demo prep next week. Great work.",
      changes: "Fix those and send it back, and I'll take another look." } };

  W.a127 = {
    match: "Apple Battery Health", core: 5,
    brand: { name: "Apple", color: "#0071E3", head: "#F5F5F7", ink: "#1D1D1F", team: "Settings Engineering", font: "600 22px 'Helvetica Neue',Helvetica,Arial,sans-serif", spacing: "0" },
    boss: { name: "Marcus Lee", title: "Settings Engineering Manager", initials: "ML" },
    ticket: "SET-3318", file: "battery_page.py",
    email: { subject: "Battery page data types (QA wants proof before Friday)", paras: [
      "Hi, thanks for picking this up.",
      "The Battery page in Settings shows a handful of facts that are all different kinds of data: a model name, a cycle count, a health percentage and a charging flag. QA found that a past build stored one of them as the wrong type, and I'd like proof that this version gets every one right.",
      "The sample values are in `battery_spec.txt`. Please store each fact, print its type for QA, add the service rule, and handle the sensor failure case in the steps below.",
      "When it runs, click **Send to Marcus** and I'll review it.",
      "There are two optional stretch tasks at the bottom if you want to go further."], sign: "Marcus" },
    files: [
      { name: "battery_spec.txt", text: "BATTERY PAGE FACTS\n\nmodel_name       text      iPhone 15\nbattery_cycles   whole     312\nbattery_health   decimal   91.5   (percent)\nis_charging      yes/no    True\n\nRULES\n  Service recommended  when health is below 80\n  Heavy use            at 500 cycles or more\n\nSENSOR FAILURE\n  the cycle count is replaced by the text: Unknown\n\nREPAIR ORDERS\n  zip_code      30326 (Lenox Square store)\n  repair_cost   79.0\n  parts_needed  2" },
      { name: "qa_notes.md", text: "QA NOTES\n\n- a zip code is not a number you do math with, so it is stored as text\n- every fact must print its type so we can check it\n- do not type True or False for a rule: compare the numbers and let the program decide" }],
    review: {
      open: "Thanks, I read through the Battery page script.",
      stages: [
        { ok: "All four facts are stored as the right kinds of values. That's the foundation of the page.", todo: "The four facts aren't all stored with the right types yet: text, whole number, decimal and True or False." },
        { ok: "The type printout gives QA exactly the proof they asked for: str, int, float and bool.", todo: "QA still needs the type of all four printed, one line each." },
        { ok: "The service rule is calculated by comparing the numbers, not typed in. That's the correct approach.", todo: "The service rule isn't right yet. Compare the numbers and let Python decide; don't type True or False." },
        { ok: "You changed the same variable to Unknown and printed its new type. That's what happens when the sensor fails, and you handled it.", todo: "The sensor failure case isn't done yet: change the same variable and print its type." },
        { ok: "The repair order facts are stored with the right types, including the zip code as text. QA will be happy.", todo: "The repair order facts still need the right types. Remember the zip code is text." },
        { ok: "The storage check works. Thanks for going beyond the ticket.", todo: "Stretch: the storage check isn't done yet. Optional." },
        { ok: "The repair estimate is clear, and your note about decimals and whole numbers is correct.", todo: "Stretch: the repair estimate isn't done yet. Also optional." }],
      approve: "Everything on the ticket is done and QA can sign off.",
      moreStretch: "There are two stretch tasks at the bottom if you want to take them on.",
      allDone: "This is above and beyond what I asked for. I'll mention it in the team update.",
      changes: "Fix those and send it back, and I'll take another look." } };

  W.a150 = {
    match: "Mario Kart Item Box", core: 5,
    brand: { name: "NINTENDO", color: "#E60012", head: "#E60012", ink: "#ffffff", team: "Kart Gameplay", font: "900 20px 'Arial Black',Arial,Helvetica,sans-serif", spacing: "3px" },
    boss: { name: "Hana Mori", title: "Gameplay Programmer", initials: "HM" },
    ticket: "KART-0207", file: "item_box.py",
    email: { subject: "Item box prototype, please try random numbers", paras: [
      "Hello! Thanks for joining the Kart Gameplay team.",
      "When a racer drives through an item box, the game rolls random numbers to decide what they get. I need a small prototype that shows the random library doing the jobs we use it for, so the designers can see how it behaves.",
      "The item list and the rules are in `item_table.txt`. Please build the prototype in the steps below.",
      "When it runs, click **Send to Hana** for my review.",
      "There are two stretch tasks at the bottom for people who want more."], sign: "Hana" },
    files: [
      { name: "item_table.txt", text: "ITEM BOX PROTOTYPE\n\nboost roll      a six-sided die (1 to 6)\nstart side      coin flip: 0 is Heads, 1 is Tails\nitems           banana, mushroom, star\nrace length     5 item boxes, total the dice\nre-roll rule    roll until a 6 comes up, count the rolls\n\nSTRETCH\n  three laps: one random item per lap\n  blue shell: 1 out of 10" },
      { name: "random_notes.md", text: "NOTES ON RANDOM\n\n  import random first\n  randint(a, b) includes both a and b\n  choice(list) picks one item from a list\n  a loop that must stop on a special roll is a while loop" }],
    review: {
      open: "Thanks, I ran through your item box prototype.",
      stages: [
        { ok: "The boost roll works and your five-to-five test shows you understand that both ends count.", todo: "The boost roll isn't right yet: import random, roll a six-sided die, and print the always-five test." },
        { ok: "The coin flip picks Heads or Tails correctly. The designers can use it as is.", todo: "The coin flip isn't done yet: a random 0 or 1, then an if and an else." },
        { ok: "Picking an item from the list works.", todo: "The item pick isn't done yet: the list of three items and a random choice from it." },
        { ok: "The five-roll total is correct: a loop, a random roll each time, and one total at the end.", todo: "The five-roll total isn't done yet: a loop that runs five times, adding a roll each time." },
        { ok: "Rolling until a six works, and the roll counter is correct. That's the trickiest piece and you got it.", todo: "The roll-until-six part isn't done yet: a while loop that stops on a 6 and counts the rolls." },
        { ok: "The three-lap race is great: one item per lap. I'm going to show the designers.", todo: "Stretch: the three-lap race isn't done yet. Optional." },
        { ok: "The blue shell odds are correct, 1 out of 10, with Safe otherwise. Thank you for taking the extra task.", todo: "Stretch: the blue shell isn't done yet. Also optional." }],
      approve: "That covers everything the prototype needed. Nice work.",
      moreStretch: "There are two stretch tasks at the bottom if you want a challenge.",
      allDone: "You did the stretch tasks too. The designers will be using your loop in the race demo.",
      changes: "Fix those and send it back, and I'll run it again." } };

  /* A compact builder for the rest of the assignments (workplace2.js, workplace3.js, workplace4.js). Fields:
     match, core (regular steps), points, brand [name, accent, headBg, headInk, font, spacing], team, boss [name, title], ticket, file, subject,
     hi / job / filesNote (the three email paragraphs), docs [[name, text], ...], open, rv [[ok, todo], ...] (one per step, regular first, then the two stretch steps), approve, done, sign */
  g.PYW_MK = function (o) {
    var first = o.boss[0].split(" ")[0];
    return { match: o.match, core: o.core, points: o.points || 100,
      brand: { name: o.brand[0], color: o.brand[1], head: o.brand[2], ink: o.brand[3], team: o.team, font: o.brand[4], spacing: o.brand[5] || "0" },
      boss: { name: o.boss[0], title: o.boss[1], initials: o.boss[0].split(" ").map(function (w) { return w.charAt(0); }).join("") },
      ticket: o.ticket, file: o.file,
      email: { subject: o.subject, paras: [o.hi, o.job, o.filesNote, "Work through the steps below in order. When you have a version that runs, click **Send to " + first + "** and I'll look it over and reply.", "If you finish early and want to take on more, there are two stretch tasks at the bottom. They're optional, but I notice the people who go the extra mile."], sign: o.sign || "Thanks, " + first },
      files: o.docs.map(function (d) { return { name: d[0], text: d[1] }; }),
      review: { open: o.open, stages: o.rv.map(function (r) { return { ok: r[0], todo: r[1] }; }), approve: o.approve, moreStretch: "There are two stretch tasks at the bottom if you want to take them on.", allDone: o.done, changes: "Fix those and send it back, and I'll take another look." } };
  };
  g.PY_WORK = Object.assign(g.PY_WORK || {}, W);
})(window);
