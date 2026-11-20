/* APPENDIX B, PART 4: your own project (walkthroughs 16 to 18). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var B = root.PYB || (typeof require !== "undefined" ? require("./appendix-b-core.js") : null);

  /* ------------------------------------------------------------------ project help topics ---- */
  var IDEAS = { title: "API ideas for your project", sections: [
    { p: "Pick **one** API. Every address below works in this editor with no key. Open the address in a new browser tab first to look at the data, or print it with `json.dumps(data, indent=2)`." },
    { rows: [
      ["Weather: api.open-meteo.com/v1/forecast", "temperature, rain, wind, a 7-day forecast", "an outfit adviser, a weekend planner, a city weather race"],
      ["Music: itunes.apple.com/search?term=...&entity=song", "songs, albums, prices, lengths", "a playlist maker, an artist quiz, a mood-based playlist"],
      ["Pokemon: pokeapi.co/api/v2/pokemon/NAME", "stats, types, abilities, moves", "a team builder, a type quiz, a battle simulator"],
      ["Free games: freetogame.com/api/games", "416 free games with genre and release date", "a game recommender, a genre statistics page"],
      ["Store: dummyjson.com/products/search?q=...", "products, prices, ratings, discounts", "a deal finder, a gift budget helper, a cart"],
      ["Recipes: themealdb.com/api/json/v1/1/search.php?s=pasta", "meals, categories, ingredients, instructions", "a meal planner, a \"what is for dinner\" picker"],
      ["Books: openlibrary.org/search.json?q=hobbit", "titles, authors, first publish year", "a reading list, an author timeline"],
      ["TV shows: api.tvmaze.com/search/shows?q=office", "shows, genres, ratings, premiere date", "a show picker, a ratings comparison"],
      ["Wikipedia: en.wikipedia.org/api/rest_v1/page/summary/TOPIC", "a short summary of any topic", "a mini encyclopedia, a topic of the day"],
      ["Rick and Morty: rickandmortyapi.com/api/character?name=rick", "characters, species, status, origin", "a character quiz, a species counter"],
      ["Art: api.artic.edu/api/v1/artworks/search?q=monet", "artworks and their artists (Art Institute of Chicago)", "an art tour, an artist timeline"],
      ["Dogs: dog.ceo/api/breeds/list/all", "every dog breed and sub-breed", "a breed lookup, a random dog name picker"],
      ["Star Wars: swapi.dev/api/people/?search=luke", "characters, planets, ships", "a character profile, a ship comparison"],
      ["Names: api.agify.io?name=michael", "the most likely age for a first name", "a guess-the-age game for your friends' names"],
      ["Sunrise and sunset: api.sunrise-sunset.org/json?lat=33.65&lng=-83.72", "sunrise and sunset times (in UTC)", "a daylight tracker"],
      ["Jokes: v2.jokeapi.dev/joke/Programming?type=twopart&safe-mode", "a setup and a punchline (turn safe mode on, see the recipe)", "a joke teller that waits for Enter before the punchline"],
      ["Trivia: opentdb.com/api.php?amount=5&type=multiple", "quiz questions with the right and wrong answers", "a quiz game with a score (see the recipe, the text needs cleaning)"]
    ] },
    { warn: "The trivia API allows only **one request every 5 seconds** for the whole school network. If its `response_code` is not 0, wait a few seconds and run again. Ask for all the questions you need in **one** request with `amount`." },
        { warn: "Different APIs name things differently, and some give a **list** while others give a **dictionary** at the top. Always explore first with `print(json.dumps(data, indent=2))` before you write the rest." },
    { good: "You may also **combine** two APIs. For example: look up the weather, then pick a music search term that matches it. Combining is great for the Create Task." }
  ] };

  var RECIPES = { title: "Recipes (patterns you can borrow)", sections: [
    { p: "These are small working programs. Do not copy one whole. Take the **pattern** and use it with your own API, your own fields and your own idea." },
    { h: "1. Search box to a list" },
    { ex: ["import requests", "", "term = input(\"Search for a book: \")", "params = {\"q\": term, \"limit\": 5, \"fields\": \"title,author_name,first_publish_year\"}", "response = requests.get(\"https://openlibrary.org/search.json\", params=params)", "for book in response.json()[\"docs\"]:", "    authors = \", \".join(book.get(\"author_name\", [\"unknown\"]))", "    print(f\"{book['title']} by {authors} ({book.get('first_publish_year', '?')})\")"] },
    { h: "2. Random pick, with a loop over numbered keys" },
    { ex: ["import requests", "", "meal = requests.get(\"https://www.themealdb.com/api/json/v1/1/random.php\").json()[\"meals\"][0]", "print(meal[\"strMeal\"], \"-\", meal[\"strCategory\"], \"-\", meal[\"strArea\"])", "for i in range(1, 21):", "    ingredient = meal[\"strIngredient\" + str(i)]", "    if ingredient:", "        print(\" \", meal[\"strMeasure\" + str(i)], ingredient)"] },
    { h: "3. An answer for a missing page (404)" },
    { ex: ["import requests", "", "topic = input(\"Topic: \").strip().replace(\" \", \"_\")", "response = requests.get(\"https://en.wikipedia.org/api/rest_v1/page/summary/\" + topic)", "if response.status_code == 404:", "    print(\"There is no article called \" + topic)", "else:", "    data = response.json()", "    print(data[\"title\"])", "    print(data[\"extract\"])"] },
    { h: "4. A function that returns a value, used twice (compare two things)" },
    { ex: ["import requests", "", "def get_rating(show_name):", "    results = requests.get(\"https://api.tvmaze.com/search/shows\", params={\"q\": show_name}).json()", "    if len(results) == 0:", "        return None", "    return results[0][\"show\"][\"rating\"][\"average\"]", "", "first = get_rating(\"The Office\")", "second = get_rating(\"Parks and Recreation\")", "if first is None or second is None:", "    print(\"One of those shows was not found.\")", "elif first > second:", "    print(\"The Office is rated higher.\")", "else:", "    print(\"Parks and Recreation is rated as high or higher.\")"] },
    { h: "5. A tiny game from an API" },
    { ex: ["import requests", "", "name = input(\"Type a first name: \")", "data = requests.get(\"https://api.agify.io\", params={\"name\": name}).json()", "guess = int(input(\"How old do you think the average \" + name + \" is? \"))", "actual = data[\"age\"]", "print(f\"The data says {actual}. You were off by {abs(guess - actual)} years.\")"] },
    { h: "6. A joke teller (turn on the safe mode filters)" },
    { ex: ["import requests", "", "params = {\"type\": \"twopart\", \"blacklistFlags\": \"nsfw,religious,political,racist,sexist,explicit\", \"safe-mode\": \"\"}", "data = requests.get(\"https://v2.jokeapi.dev/joke/Programming\", params=params).json()", "print(data[\"setup\"])", "input(\"Press Enter for the answer... \")", "print(data[\"delivery\"])"] },
    { h: "7. A trivia quiz (clean the text, shuffle the answers, check the response code)" },
    { p: "The trivia text arrives with codes like `&quot;` for a quotation mark. `html.unescape(...)` turns them back into normal characters." },
    { ex: ["import requests, random, html", "", "data = requests.get(\"https://opentdb.com/api.php\", params={\"amount\": 3, \"type\": \"multiple\", \"difficulty\": \"easy\"}).json()", "if data[\"response_code\"] != 0:", "    print(\"The trivia site said to slow down. Wait 5 seconds and try again.\")", "else:", "    score = 0", "    for q in data[\"results\"]:", "        answers = q[\"incorrect_answers\"] + [q[\"correct_answer\"]]", "        random.shuffle(answers)", "        print()", "        print(html.unescape(q[\"question\"]))", "        for number, answer in enumerate(answers, 1):", "            print(f\"  {number}. {html.unescape(answer)}\")", "        pick = input(\"Your answer (number): \")", "        if pick.isdigit() and 1 <= int(pick) <= len(answers) and answers[int(pick) - 1] == q[\"correct_answer\"]:", "            print(\"Correct!\")", "            score += 1", "        else:", "            print(\"Nope. It was \" + html.unescape(q[\"correct_answer\"]))", "    print(f\"You scored {score} out of {len(data['results'])}.\")"] },
    { h: "8. Combining two APIs" },
    { ex: ["import requests", "", "weather = requests.get(\"https://api.open-meteo.com/v1/forecast\", params={\"latitude\": 33.65, \"longitude\": -83.72, \"current\": \"temperature_2m\", \"temperature_unit\": \"fahrenheit\"}).json()", "temp = weather[\"current\"][\"temperature_2m\"]", "if temp < 50:", "    mood = \"cozy acoustic\"", "elif temp < 75:", "    mood = \"chill\"", "else:", "    mood = \"summer hits\"", "songs = requests.get(\"https://itunes.apple.com/search\", params={\"term\": mood, \"entity\": \"song\", \"limit\": 3}).json()[\"results\"]", "print(f\"It is {temp} F, so here is a {mood} playlist:\")", "for song in songs:", "    print(\" -\", song[\"trackName\"], \"by\", song[\"artistName\"])"] }
  ] };

  var PLAN_SKEL = `import requests\n\ndef get_data(term):\n    # ask the API about term and return what you need\n    return None\n\n# main program\nterm = input("Search for: ")\nresult = get_data(term)\nprint(result)\n`;
  var EXPLORE = `import requests\nimport json\n\nurl = "https://www.themealdb.com/api/json/v1/1/random.php"\nresponse = requests.get(url)\nprint(response.status_code)\nprint(json.dumps(response.json(), indent=2))\n`;

  /* ================================================================= 16. Your App 1: Plan It ================ */
  B.add({
    num: 16, title: "Your App 1: Plan It",
    intro: ["Now you design an app of **your own**. This is the project that shows everything you learned, and it is great practice for the AP **Create Performance Task**, where you plan and build your own program.",
      "Never start typing without a plan. In this walkthrough you choose an API, **explore** its data, write a short **plan** as comments, and set up your starting code. You **build** the app in Walkthrough 17 and **polish** it in Walkthrough 18."],
    learn: ["choosing an API and an idea that are the right size", "exploring unfamiliar data", "writing a plan as comments", "breaking a big job into milestones", "planning where the AP requirements will go"],
    firstTips: ["b_ideas", "b_apmap"],
    stages: [
      { title: "Pick your API and your idea", say: ["Open the **API ideas** help. Choose **one** API and an app idea that you can finish. **Small and working** beats big and broken.", "Rules for the project: it must be **your own idea** (not a copy of a walkthrough), it must run in this editor, and it needs a **list**, a **function with a parameter**, an **if**, a **loop**, and a way to **handle problems**."], help: ["b_ideas", "b_recipes"],
        do: ["Read **API ideas** and **Recipes**. Choose an API (or combine two).", "Say your idea to a classmate or your teacher in one sentence: \"My app asks the user for ______ and shows ______.\" Does it sound like something you can build in a few days?"] },
      { title: "Explore the data", say: ["Before you plan, **look at what the API really sends**. Type this short program. Replace the address in `url` with the address for **your** API (the example uses a random recipe). Run it and read the output slowly.", "If your API needs `params`, pass them: `requests.get(url, params={...})`."], help: ["b_nested", "b_debug", "b_typing"], code: EXPLORE,
        type: "Type the program, with the address of your own API in `url`.", chk: [["import requests and json", /^\s*import\s+requests\b[\s\S]*^\s*import\s+json\b/m], ["a url that starts with https://", /^\s*url\s*=\s*["']https:\/\//m], ["printing the status code", /print\(\s*response\.status_code\s*\)/], ["json.dumps(..., indent=2)", /json\.dumps\([^\n]*indent\s*=\s*2\s*\)/]],
        run: "You should see **200** and the data. If you see something else, check your address and read the **Errors** help." },
      { title: "Find your data", say: ["Read the output. Choose **three pieces of data** your app will show or use. For each one, work out the **path** to it, like `data[\"meals\"][0][\"strMeal\"]`.", "Type your three paths as comments at the bottom of your file. (Comments start with `#`.)"], help: ["b_nested"],
        code: "# PATH 1: (for example data[\"meals\"][0][\"strMeal\"])\n# PATH 2: (the path to another value)\n# PATH 3: (the path to a third value)",
        type: "Type three `# PATH` lines and fill them in with real paths from your data.", chk: [["three # PATH lines with text", /^#[ \t]*PATH[ \t]*\d:[ \t]*\S+/m, 3, "comments"]] },
      { title: "Write the plan as comments", say: ["Now the plan. Type these labels at the very top of your file and fill each one in with your own words. Keep each to a sentence.", "Use this exact layout so the auto-check can read it:"],
        code: "# APP: (the name of your app)\n# GOAL: (what the app does and who would use it)\n# API: (which API, and what a request asks for)\n# ASKS: (what the user types or chooses)\n# SHOWS: (what the program prints)",
        type: "Type the five labels at the top and fill each one in.", chk: [["# APP: with a name", /^#[ \t]*APP:[ \t]*\S+/m, 1, "comments"], ["# GOAL: with text", /^#[ \t]*GOAL:[ \t]*\S+/m, 1, "comments"], ["# API: with text", /^#[ \t]*API:[ \t]*\S+/m, 1, "comments"], ["# ASKS: with text", /^#[ \t]*ASKS:[ \t]*\S+/m, 1, "comments"], ["# SHOWS: with text", /^#[ \t]*SHOWS:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Break it into milestones", say: ["Build in small pieces that each **work** before you move on. Write five milestones in the order you will build them. A good order: (1) one request that prints the raw data, (2) pull out the pieces you need, (3) show them nicely, (4) the user's input and decisions, (5) problems and repeat.", "Write **your** version of each. Be specific."],
        code: "# MILESTONE 1: (one request, print the raw data)\n# MILESTONE 2: (pull out the pieces I need into a list)\n# MILESTONE 3: (show the results nicely)\n# MILESTONE 4: (the user's input and my program's decisions)\n# MILESTONE 5: (handle problems and let the user repeat)",
        type: "Type five milestone lines for your app.", chk: [["five # MILESTONE lines with text", /^#[ \t]*MILESTONE[ \t]*\d:[ \t]*\S+/m, 5, "comments"]] },
      { title: "Plan where the AP requirements go", say: ["Your project needs these things. Decide **now** where each one will be, so you do not forget. (Open the **AP** help for what each means.)", "You can change your mind later. The point is to think about it first."], help: ["b_apmap"],
        code: "# LIST: (what will you store in a list?)\n# FUNCTION: (what will your function do? what parameter will it take? what will it return?)\n# IF: (what decision will your app make?)\n# LOOP: (what will repeat?)\n# TRY: (what could go wrong, and what will you do about it?)",
        type: "Type the five lines and fill them in.", chk: [["# LIST: with text", /^#[ \t]*LIST:[ \t]*\S+/m, 1, "comments"], ["# FUNCTION: with text", /^#[ \t]*FUNCTION:[ \t]*\S+/m, 1, "comments"], ["# IF: with text", /^#[ \t]*IF:[ \t]*\S+/m, 1, "comments"], ["# LOOP: with text", /^#[ \t]*LOOP:[ \t]*\S+/m, 1, "comments"], ["# TRY: with text", /^#[ \t]*TRY:[ \t]*\S+/m, 1, "comments"]] },
      { title: "Set up your starting code", say: ["Under your comments, type this skeleton. It already has the shape of a good program: an import, a **function with a parameter** that will talk to the API, and a short main program. Rename `get_data` to something that describes **your** function.", "Run it. It prints `None`, and that is correct, because the function does nothing yet. That is **Milestone 0**. You will build the real thing in the next walkthrough."], help: ["b_funcs"], code: PLAN_SKEL,
        type: "Type the skeleton under your plan. Rename `get_data` to fit your app.", chk: [["import requests", /^\s*import\s+requests\b/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["input(...)", /\binput\(/], ["calling your function", function (text) { return P.userFnCalls(text); }, 1]],
        run: "It prints `None`. Your starting point is ready." }
    ],
    check: false,
    finish: [],
    challenges: ["Explain your plan to a friend. If they cannot tell what the app does, make the **APP**, **GOAL** and **SHOWS** lines clearer.", "Look up your API's own **documentation page** (search for its name and \"API docs\"). What else could you ask it for?", "Plan a second feature you could add at the very end."],
    tips: { b_ideas: IDEAS, b_recipes: RECIPES },
    recap: "You chose an API, **explored** its data before writing code, wrote a plan, broke the work into milestones, and decided where a **list**, a **function with a parameter**, an **if**, a **loop** and **error handling** will go.",
    next: "**Next:** Walkthrough 17 is where you **build** your app, one milestone at a time."
  });

  /* ================================================================= 17. Your App 2: Build It ================ */
  B.add({
    num: 17, title: "Your App 2: Build It",
    intro: ["Now you build the app you planned. Work on **one milestone at a time**, and make sure each one runs before you start the next. If you get stuck, use the **Debugging** help and your **Recipes**.",
      "Copy your finished code from **Walkthrough 16** and paste it here (Ctrl + A, Ctrl + C, then Ctrl + V). Keep your plan comments at the top. The checks below look for general building blocks, so there are many right ways to do each step."],
    learn: ["turning a plan into working code a milestone at a time", "a function that talks to an API and returns data", "building a list from the answer", "decisions, loops and error handling in one program"],
    firstTips: ["b_debug", "b_recipes", "b_errors"],
    stages: [
      { title: "Bring your plan and skeleton", say: ["Paste your finished Walkthrough 16 code into this code box and run it. It should print `None`."], help: ["b16"],
        type: "Paste your Walkthrough 16 code into this code box.", chk: [["import requests", /^\s*import\s+requests\b/m], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["input(...)", /\binput\(/]], run: "It runs and prints `None`." },
      { title: "Milestone 1: make the request", say: ["Fill in your function. Inside it, call `requests.get` with your address (and `params` if you need them), turn the answer into data with `.json()`, and **`return`** it. In the main program, print what comes back.", "Start by returning the whole answer so you can see it. Narrow it down in the next milestone."], help: ["b_request", "b_params", "b_nested"],
        type: "Make your function call `requests.get`, use `.json()`, and `return` the data. Print the result in the main program.", chk: [["calling requests.get(...)", /requests\.get\(/], ["turning the answer into data with .json()", /\.json\(\)/], ["a function that returns something", /^\s+return\s+\S+/m]], run: "Your real data prints. If it fails, read the red message and open **Debugging**." },
      { title: "Milestone 2: pull out what you need into a list", say: ["Now narrow it down. Inside your function, make an empty **list**, loop over the items in the answer, and `.append` just the pieces you need (a string, or a small dictionary like `{\"title\": ..., \"year\": ...}`). Return the list.", "Use the **paths** you wrote down in Walkthrough 16."], help: ["b_list", "b_nested", "b_dict"],
        type: "Build a list inside your function with a `for` loop and `.append(...)`, and return it.", chk: [["an empty list", /^\s*\w+\s*=\s*\[\s*\]/m], ["a for loop", /^\s*for\s+\w+(\s*,\s*\w+)?\s+in\s+/m], [".append(...)", /\.append\(/]], run: "The main program now prints your list of results." },
      { title: "Milestone 3: show the results nicely", say: ["Replace the plain `print(result)` with a **loop** that prints each item on its own line using an **f-string**. Add a heading and a count: `print(f\"Found {len(results)} results\")`."], help: ["b_fstr", "b_list"],
        type: "Print each result with an f-string in a loop, and print how many there are.", chk: [["at least two f-string prints", /print\(\s*f["']/, 2], ["using len(...)", /\blen\(/]], run: "A clean, readable list." },
      { title: "Milestone 4: decisions", say: ["Make your app **decide** things with `if`, `elif` and `else`. Ideas: say \"nothing found\" when the list is empty, filter the results (only show ones that match something the user chose), mark the best one, or give a different message for different values.", "You need at least **two decisions**, and one of them should use `else` or `elif`."], help: ["b_sort", "b_input"],
        type: "Add at least two `if` decisions, including one `elif` or `else`.", chk: [["at least two if / elif lines", /^\s*(if|elif)\s/m, 2], ["an else or elif", /^\s*(else\s*:|elif\s)/m]], run: "Test each branch: make the app go down **every** path at least once." },
      { title: "Milestone 5: handle problems", say: ["Real data and real users cause trouble: the user types something silly, the API finds nothing, the internet drops. Make your app handle them:", "Check `response.status_code` (or call `response.raise_for_status()`), and wrap your request in `try` / `except requests.exceptions.RequestException:` with a friendly message."], help: ["b_try", "b_status"],
        type: "Add a `try` / `except requests.exceptions.RequestException` and a status code check.", chk: [["a try block", /^\s*try\s*:/m], ["except requests.exceptions.RequestException", /^\s*except\s+requests\.exceptions\.RequestException/m], ["checking the status", /status_code|raise_for_status/]], run: "Test with something that should not be found, like `zzzzzz`." },
      { title: "Milestone 6: let the user repeat", say: ["Wrap the main program in a **`while` loop** so the user can search again and again, with a way to **quit** (for example typing `quit`).", "Also call your function from **two different places** in your code, so it is clearly doing real work. For example: once for a \"featured\" result shown at the start, and once for the user's search inside the loop. Remember: `break` leaves a loop."], help: ["b_menu"],
        type: "Add a `while` loop with a way to quit, so your function runs once per round.", chk: [["a while loop", /^\s*while\s/m], ["a quit that uses break", /\bbreak\b/], ["your function is called from two places", function (text) { return P.userFnCalls(text); }, 2]], run: "Use your app three times in a row, then quit." }
    ],
    check: false,
    finish: [],
    challenges: ["Let the user pick **how many** results to see (a `limit` param).", "Add a second **function with a parameter** that formats one result as a string, and use it in the loop.", "Combine a **second API** in your app.", "Make the app **remember** things the user liked in a list and show them at the end."],
    tips: { b16: B.bring(16, PLAN_SKEL), b_recipes: RECIPES },
    recap: "You built an app from a plan, one milestone at a time. It has a **list** built with a loop, a **function with a parameter** that returns data, **decisions**, **error handling** and a **repeat loop**. Those are the exact building blocks the AP Create Task looks for.",
    next: "**Next:** Walkthrough 18 is where you **test, fix, polish and reflect**."
  });

  /* ================================================================= 18. Your App 3: Test, Polish and Share ================ */
  B.add({
    num: 18, title: "Your App 3: Test, Polish and Share",
    intro: ["An app is not done when it first works. It is done when **other people can use it** without help. In this last walkthrough you **test** your app with real people, **fix** what breaks, **polish** it, and write a short **reflection**.",
      "Copy your finished code from **Walkthrough 17** and paste it here. Then work down the steps."],
    learn: ["testing with other people", "finding and fixing bugs", "polish: what makes an app feel finished", "reflecting on what you built"],
    firstTips: ["b_debug", "b_errors", "b_recipes"],
    stages: [
      { title: "Bring your app with you", say: ["Paste your finished Walkthrough 17 code into this code box and run it."],
        type: "Paste your Walkthrough 17 code into this code box.", chk: [["requests.get", /requests\.get\(/], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["a loop", /^\s*(for|while)\s/m]], run: "Your app runs." },
      { title: "Test it with other people", say: ["Find **two people** (not you!). Ask them to use your app **without** your help. Do not explain it. Watch, and write down what confuses them or what breaks.", "Things to look for: Did they know what to type? Did the output make sense? Did anything crash? What did they type that you never thought of (an empty answer, a number, a word with a typo, capital letters)?"],
        do: ["Have **two different people** use your app for at least a minute each.", "Write down **three** things that confused them, broke, or felt wrong. (Keep your notes. You will type them in a minute.)"] },
      { title: "Write your test notes as comments", say: ["Type your three findings as comments at the very **bottom** of your file, and one more line saying what you changed to fix each one.", "Use this layout:"],
        code: "# TEST 1: (what the user found)\n# FIX 1: (what you changed)\n# TEST 2: (what the user found)\n# FIX 2: (what you changed)\n# TEST 3: (what the user found)\n# FIX 3: (what you changed)",
        type: "Type the six lines at the bottom of your file and fill them in.", chk: [["three # TEST notes", /^#[ \t]*TEST[ \t]*\d:[ \t]*\S+/m, 3, "comments"], ["three # FIX notes", /^#[ \t]*FIX[ \t]*\d:[ \t]*\S+/m, 3, "comments"]] },
      { title: "Fix the three problems", say: ["Now make each fix. Run your app after each one to make sure you fixed it and did not break something else.", "If you cannot fix one, write what you tried in the FIX comment."], help: ["b_debug", "b_errors"],
        do: ["Fix finding **1**. Run the app.", "Fix finding **2**. Run the app.", "Fix finding **3**. Run the app."] },
      { title: "Polish checklist", say: ["Polish is the difference between \"it works\" and \"it feels like a real app.\" Pick **at least four** from this list and add them:"],
        do: ["A **title and instructions** printed at the start (what is this app and what do I type?).", "**Clean input**: use `.strip()` and `.lower()` so capital letters and extra spaces do not matter.", "A **friendly message** for every problem: nothing found, no internet, a bad number.", "**Neat output**: aligned columns with `:<20` and `:>8.2f`, blank lines between sections.", "A **summary** at the end: a count, a total, an average, the best or the biggest.", "**Limits** on how much is shown (use a slice like `results[:10]`), so the output is not a wall of text.", "A **goodbye message** when the user quits."] },
      { title: "Write your reflection", say: ["Reflecting is how you learn from a project. Type your answers as comments at the very **bottom** of your file. Write a full sentence or two for each.", "Use this layout:"],
        code: "# REFLECTION 1: (What part of your app are you proudest of, and why?)\n# REFLECTION 2: (What was the hardest bug, and how did you fix it?)\n# REFLECTION 3: (Name your list, your function and its parameter, an if, and a loop.)\n# REFLECTION 4: (What would you add if you had another week?)",
        type: "Type the four reflection lines and answer each one.", chk: [["four # REFLECTION answers", /^#[ \t]*REFLECTION[ \t]*\d:[ \t]*\S+([ \t]+\S+){4,}/m, 4, "comments"]] },
      { title: "Final check", say: ["Run your app one last time. Then read it from top to bottom like a stranger would. Is anything confusing? Are your comments clear? Then you are done."],
        chk: [["requests.get(...)", /requests\.get\(/], ["a function with a parameter", /^def\s+\w+\(\s*\w+/m], ["a list", /^\s*\w+\s*=\s*\[/m], ["a loop", /^\s*(for|while)\s/m], ["an if statement", /^\s*if\s/m, 3], ["try / except", /^\s*try\s*:[\s\S]*^\s*except\s/m], ["at least ten comments", /^\s*#\s*\S+/m, 10, "comments"]],
        type: "Your finished app has requests.get, a list, a function with a parameter, a loop, at least three if statements, try / except, and at least ten comments.", run: "Use it one more time. You built this." }
    ],
    check: false,
    finish: [],
    challenges: ["Teach a friend how to build one piece of your app. Teaching is the best test of whether you understand it.", "Look at the AP CSP Create Task rubric. Which of your app's features would show each requirement?", "Add a **second API** and combine the results.", "Start another app! Which API from the ideas list will you try next?"],
    tips: { b_recipes: RECIPES },
    recap: "You planned, built, tested, fixed and polished an app of your own, the same steps professional developers follow. You used the full toolkit: **requests**, **parameters**, **JSON**, a **list**, a **function with a parameter**, **selection**, **iteration** and **error handling**.",
    next: "**Congratulations! You finished Appendix B.** You can now get live data from the web with Python. Every app you use daily works the way yours does."
  });

  /* tip topics that other walkthroughs open from their help lists */
  B.projectTips = { b_ideas: IDEAS, b_recipes: RECIPES };
  P.TIPS.b_ideas = IDEAS; P.TIPS.b_recipes = RECIPES;
})(typeof window !== "undefined" ? window : globalThis);
