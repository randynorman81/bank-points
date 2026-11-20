/* APPENDIX B: GETTING DATA FROM THE WEB WITH requests (shared pieces for the walkthroughs).
   The walkthroughs are in appendix-b-1.js ... appendix-b-4.js. They reuse the engine in appendix-a-core.js.
   Works in the browser AND in Node (the tests use it). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var UNIT = "Appendix B: Getting Data from the Web with requests";
  var B = { UNIT: UNIT };

  /* one walkthrough of this appendix */
  B.add = function (w) { w.unit = UNIT; w.prefix = "pb"; P.add(w); };

  /* "I did not finish Walkthrough n" help popup that shows the program to type */
  B.bring = function (n, code) { return { title: "I did not finish Walkthrough " + n, sections: [{ p: "Type your Walkthrough " + n + " program. This is what it should look like:" }, { ex: String(code).replace(/\n+$/, "").split("\n") }] }; };

  /* Builds the whole program for every step. A step gives ONE of:
       code: "the whole program"            (used as written)
       add:  "lines to add at the bottom"   (the previous step's program plus these)
       edit: [[old, new], ...]              (change the previous program, then add anything in "add")
     The result also has .final, the last step's program. */
  B.seq = function (stages, start) {
    var prev = start || "", i, s, c, k;
    for (i = 0; i < stages.length; i++) {
      s = stages[i];
      if (s.code === undefined) {
        c = prev.replace(/\n+$/, "");
        if (s.edit) s.edit.forEach(function (e) { if (c.indexOf(e[0]) < 0) throw new Error("step " + (i + 1) + " (" + s.title + "): cannot find text to edit: " + e[0].slice(0, 50)); c = c.split(e[0]).join(e[1]); });
        if (s.add) c = (c ? c + "\n" + (/^\n/.test(s.add) ? "\n" : "") : "") + s.add.replace(/^\n+/, "").replace(/\n+$/, "");
        s.code = c + "\n";
      }
      prev = s.code;
    }
    stages.final = prev;
    return stages;
  };

  var T = P.TIPS;
  T.b_typing = { title: "Typing code tips", sections: [
    { list: ["**Quotes come in pairs.** If text starts with a `\"`, it must end with a `\"`. Use the same kind on both ends.", "**Brackets come in pairs too.** Every `(` needs a `)`, every `[` a `]`, every `{` a `}`. Most errors in this appendix are one missing bracket.", "**Lines that end in a colon** (`if`, `for`, `while`, `def`, `try`, `except`) must be followed by lines pushed in 4 spaces (press Tab).", "**Capital letters matter.** `True` works. `true` does not. `requests` works. `Requests` does not.", "Press **Ctrl + Enter** to run. Press **Ctrl + /** to turn the selected lines into comments."] }
  ] };
  T.b_api = { title: "What is an API?", sections: [
    { p: "An **API** (Application Programming Interface) is a way for one program to ask another program for information. A website like a weather service has a big pile of data. Its API is the **front door** that lets your code ask for just the part it needs." },
    { p: "Think of a restaurant. You do not walk into the kitchen. You tell the waiter what you want (a **request**), and the waiter brings back your food (a **response**)." },
    { ex: ["your program  ----- request: \"weather for Atlanta?\" ----->  weather service", "your program  <---- response: {\"temperature\": 61} ---------  weather service"] },
    { p: "Every API has a **URL** (a web address) that your code visits. The answer usually comes back as **JSON**, which is text that Python can turn into dictionaries and lists." },
    { good: "You already use APIs all the time. Every weather app, music app, map, and online store gets its information from APIs." }
  ] };
  T.b_request = { title: "requests cheat sheet", sections: [
    { ex: ["import requests", "", "response = requests.get(\"https://example.com/api\")             # ask for data", "response = requests.get(url, params={\"q\": \"cat\", \"limit\": 5})   # ask with extra settings", "", "print(response.status_code)   # 200 means success", "print(response.ok)            # True if the status is below 400", "print(response.url)           # the full address that was visited", "print(response.text)          # the answer as plain text", "data = response.json()        # the answer turned into dictionaries and lists"] },
    { rows: [["requests.get(url)", "a Response object", "visits the URL and brings back the answer"], ["requests.get(url, params=p)", "a Response object", "adds ?name=value to the URL for you"], ["response.status_code", "a number", "200 good, 404 not found, 429 slow down"], ["response.json()", "a dict or list", "only works if the answer really is JSON"], ["response.text", "a string", "always works, good for looking"], ["response.raise_for_status()", "nothing, or an error", "stops the program if the status was bad"]] }
  ] };
  T.b_status = { title: "Status codes: did it work?", sections: [
    { p: "Every response has a **status code**, a number that says how the request went. You always check it before you trust the data." },
    { rows: [["200", "OK", "it worked, the data is in the response"], ["201", "Created", "something new was made (common after POST)"], ["400", "Bad Request", "your request was wrong, like a missing or silly parameter"], ["401 / 403", "Not allowed", "you need a key or login, or you are blocked"], ["404", "Not Found", "no such page or item (a typo in the URL or name)"], ["429", "Too Many Requests", "you asked too fast, wait a minute"], ["500 / 503", "Server Error", "the problem is on their end, try again later"]] },
    { ex: ["response = requests.get(url)", "if response.status_code == 200:", "    data = response.json()", "else:", "    print(\"Problem! Status code:\", response.status_code)"] },
    { good: "Numbers starting with **2** are good, **4** means YOU made a mistake, **5** means THEY had a problem." }
  ] };
  T.b_json = { title: "JSON becomes Python", sections: [
    { p: "JSON is just text. When you call `response.json()`, Python turns it into things you already know:" },
    { rows: [["{ \"a\": 1 }", "dictionary", "curly brackets, keys and values"], ["[ 1, 2, 3 ]", "list", "square brackets, items in order"], ["\"hello\"", "string", ""], ["12  or  3.5", "int or float", ""], ["true / false", "True / False", "capital letters in Python"], ["null", "None", "means \"nothing here\""]] },
    { ex: ["{", "  \"city\": \"Atlanta\",", "  \"temps\": [61, 64, 59],", "  \"current\": { \"humidity\": 55 }", "}"] },
    { p: "That one block is a dictionary with three keys. `\"temps\"` holds a list. `\"current\"` holds another dictionary. Digging into it looks like this:" },
    { ex: ["data[\"city\"]                     # \"Atlanta\"", "data[\"temps\"][0]                 # 61", "data[\"current\"][\"humidity\"]      # 55"] }
  ] };
  T.b_dict = { title: "Dictionaries", sections: [
    { p: "A dictionary stores **pairs**: a **key** (the label) and a **value** (the data). You look up a value by its key, like looking up a word in a dictionary." },
    { ex: ["song = {\"title\": \"Hello\", \"artist\": \"Adele\", \"length\": 295}", "", "print(song[\"title\"])              # Hello", "song[\"length\"] = 300             # change a value", "song[\"year\"] = 2015              # add a new pair", "print(song.get(\"genre\", \"?\"))   # safe lookup: \"?\" if there is no genre", "print(\"title\" in song)           # True: is that key there?", "print(song.keys())               # all the keys", "for key, value in song.items():  # loop over every pair", "    print(key, value)"] },
    { rows: [["d[\"key\"]", "the value", "crashes with KeyError if the key is missing"], ["d.get(\"key\")", "the value or None", "never crashes"], ["d.get(\"key\", 0)", "the value or 0", "you pick the backup value"], ["\"key\" in d", "True / False", "checks without crashing"], ["d.keys()", "all the keys", "great for exploring new data"], ["len(d)", "number of pairs", ""]] },
    { warn: "Keys are exact. `data[\"Name\"]` is not `data[\"name\"]`. A missing key gives `KeyError`." }
  ] };
  T.b_list = { title: "Lists of data", sections: [
    { ex: ["songs = [\"Hello\", \"Skyfall\", \"Rolling in the Deep\"]", "", "print(songs[0])        # Hello (counting starts at 0)", "print(songs[-1])       # Rolling in the Deep (the last one)", "print(len(songs))      # 3", "print(songs[:2])       # the first two", "", "for song in songs:                     # each item", "    print(song)", "for number, song in enumerate(songs, 1):   # each item with a count: 1, 2, 3", "    print(number, song)", "for i in range(len(songs)):            # by position: 0, 1, 2", "    print(i, songs[i])"] },
    { rows: [["lst[0]", "the first item", ""], ["lst[-1]", "the last item", ""], ["lst[:5]", "the first five items", "a slice"], ["len(lst)", "how many", ""], ["lst.append(x)", "adds x at the end", ""], ["lst.pop(i)", "removes and returns item i", ""], ["for x in lst:", "loops over every item", ""], ["x in lst", "True / False", "is it in the list?"]] },
    { warn: "A list can be empty. `lst[0]` on an empty list gives `IndexError`. Check `if len(lst) > 0:` or `if lst:` first." }
  ] };
  T.b_nested = { title: "How to read nested data", sections: [
    { p: "Real API answers are dictionaries inside lists inside dictionaries. Do not guess the path. **Dig down one level at a time** and print each level." },
    { steps: ["`print(type(data))` tells you if it is a dict or a list.", "If it is a dict, `print(data.keys())` shows the keys. Pick one.", "`print(data[\"results\"])` shows what is inside. Is it a list or a dict?", "If it is a list, `print(len(...))` then look at one item with `[0]`.", "Repeat until you reach the value you want, then write the whole path."] },
    { ex: ["print(type(data))                          # <class 'dict'>", "print(data.keys())                         # dict_keys(['results', ...])", "print(data[\"results\"][0].keys())           # the keys of the first result", "print(data[\"results\"][0][\"name\"])          # the value we wanted"] },
    { good: "Read a path from left to right: `data[\"results\"][0][\"name\"]` means \"in data, the results, the first one, its name\"." },
    { p: "Or print the whole thing in a readable layout: `import json` then `print(json.dumps(data, indent=2))`." }
  ] };
  T.b_fstr = { title: "f-strings and formatting", sections: [
    { p: "Put an `f` before the quotes and you can place values right inside the text with `{ }`. No `str()` and no `+` needed." },
    { ex: ["name = \"Adele\"", "minutes = 4.5", "print(f\"{name} wrote a song that is {minutes} minutes long.\")", "print(f\"Half of that is {minutes / 2}\")        # math works inside { }"] },
    { rows: [["{price:.2f}", "2 decimal places", "5 becomes 5.00 (money!)"], ["{temp:.0f}", "no decimals", "61.4 becomes 61"], ["{count:,}", "commas", "1234567 becomes 1,234,567"], ["{secs:02d}", "at least 2 digits", "7 becomes 07 (for clocks)"], ["{name:<15}", "left, 15 wide", "lines up columns"], ["{score:>6}", "right, 6 wide", "lines up numbers"]] },
    { warn: "Inside an f-string, use the OTHER kind of quote for dictionary keys: `f\"{song['title']}\"`. If the f-string uses double quotes, the key uses single quotes." }
  ] };
  T.b_params = { title: "Parameters: asking for exactly what you want", sections: [
    { p: "Most APIs let you add **parameters**, settings written after a `?` in the URL, like `?city=Atlanta&units=metric`. You could build that text yourself, but `requests` does it for you if you give it a dictionary." },
    { ex: ["params = {\"term\": \"adele\", \"entity\": \"song\", \"limit\": 5}", "response = requests.get(\"https://itunes.apple.com/search\", params=params)", "print(response.url)", "# https://itunes.apple.com/search?term=adele&entity=song&limit=5"] },
    { good: "Always `print(response.url)` while you are learning. You will see exactly what `requests` sent. Spaces and special letters are fixed for you (a space becomes `+` or `%20`)." },
    { p: "The names (`term`, `entity`, `limit`) come from the API's **documentation**. They are different for every API, so the first job is always to read what that API lets you ask for." }
  ] };
  T.b_try = { title: "try and except", sections: [
    { p: "Some lines can fail even when your code is perfect: the Wi-Fi drops, the website is down, the user types something silly. `try` / `except` lets your program handle the problem instead of crashing." },
    { ex: ["try:", "    response = requests.get(url, timeout=10)", "    data = response.json()", "except requests.exceptions.RequestException:", "    print(\"Could not get the data. Try again later.\")", "else:", "    print(\"Got it!\")"] },
    { rows: [["try:", "", "the risky code goes here"], ["except SomeError:", "", "runs only if that error happened"], ["else:", "", "runs only if there was NO error"], ["requests.exceptions.RequestException", "", "catches every kind of requests problem"], ["response.raise_for_status()", "", "turns a bad status (404, 500) into an error you can catch"]] },
    { warn: "Only put the risky lines inside `try`. If you wrap your whole program, you will hide your own typos and never find them." }
  ] };
  T.b_errors = { title: "Errors and what they mean", sections: [
    { rows: [["KeyError: 'results'", "that key is not in the dictionary", "print(data.keys()) and check spelling; use .get() or `in`"], ["IndexError: list index out of range", "asked for an item that is not there", "the list is empty or shorter than you thought, print(len(lst))"], ["TypeError: list indices must be integers", "used a word on a list, like lst[\"name\"]", "lists use numbers, dictionaries use words"], ["TypeError: string indices must be integers", "treated text like a dictionary", "print(type(x)): it is a string, not a dict"], ["TypeError: 'NoneType' object is not subscriptable", "a variable is None", "a function forgot to return, or .get() found nothing"], ["TypeError: can only concatenate str", "joined text and a number with +", "use an f-string or str()"], ["ConnectionError", "the website could not be reached", "check the URL and try again in a minute"], ["JSONDecodeError", "the answer was not JSON", "print(response.status_code) and print(response.text)"], ["MissingSchema", "the URL has no https://", "start every URL with https://"], ["ValueError: invalid literal for int()", "int() on text that is not a number", "check the text with .isdigit() first"], ["NameError", "a name was never created", "typo, or the line that creates it comes later"]] }
  ] };
  T.b_debug = { title: "Debugging a data program", sections: [
    { steps: ["Read the red message. It tells you the line number and the kind of problem.", "Look up the error in the **Errors** help.", "`print(response.status_code)` and `print(response.url)`. Did the request even work?", "`print(type(data))` and `print(data.keys())`. Is the data shaped the way you think?", "`import json` and `print(json.dumps(data, indent=2))` shows the whole answer with a layout you can read.", "Comment out new lines (select them, press Ctrl + /) until the old part works again."] },
    { good: "When your path into the data fails, do not guess. Print one level at a time and look." }
  ] };
  T.b_limits = { title: "Rate limits and being polite", sections: [
    { p: "Free APIs are shared. If one computer asks too many times too quickly, the service says **429 Too Many Requests** (or sometimes 403) and makes you wait. At school, many computers share the same internet address, so this can happen to a whole class at once." },
    { list: ["**This editor remembers every successful answer for 10 minutes.** If you run the same request again, you get the saved answer instantly and nothing is sent. Change a parameter and it asks the website again.", "Save the answer in a variable (`data = response.json()`) and use the variable many times. Do not call `requests.get` again for the same thing.", "Do not put `requests.get` in a loop that runs hundreds of times.", "If you see 429 or 403, **wait a minute** and run again."] },
    { good: "Real programmers do the same: they save (cache) answers and ask only when they need new data." }
  ] };
  T.b_keys = { title: "API keys, Spotify and Amazon", sections: [
    { p: "Many APIs need a **key**, a secret password that says who is asking. Spotify, Amazon, Google Maps and most video game companies work this way. You register as a developer, they give you a key, and you send it with every request." },
    { ex: ["token = \"YOUR-SECRET-KEY-HERE\"", "headers = {\"Authorization\": \"Bearer \" + token}", "response = requests.get(url, headers=headers)"] },
    { warn: "**Never type a real key into this editor or any page other people can read.** A key is like a password. If it leaks, someone else can use your account. That is why this appendix uses free APIs that need no key." },
    { rows: [["Spotify Web API", "app login and a token", "same requests code, plus the headers line above"], ["Apple Music API", "a paid developer token", "so we use Apple's free iTunes Search instead"], ["Amazon", "affiliate account and signed requests", "so we use a free practice store with the same kind of data"]] },
    { good: "Everything you learn here (get, params, JSON, loops, error handling) works the same on those APIs. Only the first step, getting a key, is different." }
  ] };
  T.b_funcs = { title: "Functions for data", sections: [
    { p: "A **function** names a chunk of code. A **parameter** is a value you hand to it. `return` hands a value back. Functions keep your API code from being copied all over the place." },
    { ex: ["def get_temperature(lat, lon):", "    params = {\"latitude\": lat, \"longitude\": lon, \"current\": \"temperature_2m\"}", "    response = requests.get(URL, params=params)", "    return response.json()[\"current\"][\"temperature_2m\"]", "", "print(get_temperature(33.7, -84.4))      # call it", "t = get_temperature(40.7, -74.0)         # keep the answer"] },
    { list: ["Put every `def` ABOVE the lines that call it.", "A function with no `return` gives back `None`.", "A function can `return None` on purpose to say \"I found nothing\", and the caller checks `if result is None:`."] }
  ] };
  T.b_sort = { title: "Counting, min, max, sum and sorting", sections: [
    { ex: ["prices = [9.99, 4.5, 20, 3.25]", "print(sum(prices))               # 37.74", "print(len(prices))               # 4", "print(sum(prices) / len(prices))  # the average", "print(min(prices), max(prices))   # 3.25 20"] },
    { p: "For a list of **dictionaries**, tell Python what to compare with a small function and the word `key`:" },
    { ex: ["def get_price(item):", "    return item[\"price\"]", "", "cheapest = min(items, key=get_price)          # the whole cheapest dictionary", "priciest = max(items, key=get_price)", "by_price = sorted(items, key=get_price)       # a new list, cheapest first", "by_price = sorted(items, key=get_price, reverse=True)   # priciest first", "top3 = by_price[:3]                          # the first three"] },
    { good: "`sorted` makes a NEW list and leaves the original alone. `min` and `max` give you the item, not the number. Use `cheapest[\"price\"]` to get the number." }
  ] };
  T.b_tally = { title: "Counting things with a dictionary", sections: [
    { p: "A **tally** counts how many times each value shows up. The keys are the things you count, the values are the counts." },
    { ex: ["counts = {}", "for song in songs:", "    album = song[\"album\"]", "    counts[album] = counts.get(album, 0) + 1", "", "for album, number in counts.items():", "    print(album, number)"] },
    { p: "`counts.get(album, 0)` means \"the count so far, or 0 if this is the first time we have seen this album\". Then we add 1 and store it back." }
  ] };
  T.b_ms = { title: "Turning milliseconds into minutes", sections: [
    { p: "Music APIs give a song's length in **milliseconds** (1000 ms = 1 second). To show `3:45` you need `//` (whole-number divide) and `%` (remainder)." },
    { ex: ["ms = 225000", "total_seconds = ms // 1000         # 225", "minutes = total_seconds // 60      # 3", "seconds = total_seconds % 60       # 45", "print(f\"{minutes}:{seconds:02d}\")   # 3:45"] },
    { good: "`:02d` makes the seconds two digits, so 5 seconds shows as `3:05`, not `3:5`." }
  ] };
  T.b_menu = { title: "The menu loop", sections: [
    { p: "Interactive programs show choices again and again until the user quits. The pattern is the same every time:" },
    { ex: ["while True:", "    print(\"1) Search   2) View   q) Quit\")", "    choice = input(\"Choose: \").strip().lower()", "    if choice == \"1\":", "        print(\"searching...\")", "    elif choice == \"2\":", "        print(\"viewing...\")", "    elif choice == \"q\":", "        break", "    else:", "        print(\"Please choose 1, 2 or q.\")"] },
    { p: "`while True:` repeats forever. `break` jumps out. Always give the user a way to quit." }
  ] };
  T.b_input = { title: "input() gives text", sections: [
    { p: "`input()` always gives back a **string**, even if the user types a number." },
    { rows: [["name = input(\"Name: \")", "text", ""], ["n = int(input(\"How many? \"))", "a whole number", "crashes if they type a word"], ["choice = input(\"> \").strip().lower()", "clean text", "removes spaces and capitals"], ["choice.isdigit()", "True / False", "is it only digits? check BEFORE int()"]] },
    { ex: ["answer = input(\"Pick a number: \")", "if answer.isdigit():", "    number = int(answer)", "else:", "    print(\"That was not a number.\")"] }
  ] };
  T.b_codes = { title: "Weather codes", sections: [
    { p: "Open-Meteo describes the weather with a **WMO code**, a number. Your program turns the number into words with a dictionary." },
    { rows: [["0", "Clear sky", ""], ["1, 2, 3", "Mostly clear, partly cloudy, overcast", ""], ["45, 48", "Fog", ""], ["51, 53, 55", "Drizzle", "light, moderate, dense"], ["61, 63, 65", "Rain", "light, moderate, heavy"], ["71, 73, 75", "Snow", "light, moderate, heavy"], ["80, 81, 82", "Rain showers", ""], ["95, 96, 99", "Thunderstorm", ""]] }
  ] };
  T.b_dates = { title: "Dates and weekday names", sections: [
    { p: "APIs give dates as text like `\"2026-11-20\"`. Python's `datetime` can turn that into a weekday name." },
    { ex: ["import datetime", "", "day = \"2026-11-20\"", "d = datetime.date.fromisoformat(day)   # a real date object", "print(d.strftime(\"%A\"))             # Friday", "print(d.strftime(\"%b %d\"))          # Nov 20"] },
    { rows: [["%A", "Friday", "full weekday"], ["%a", "Fri", "short weekday"], ["%B", "November", "full month"], ["%b", "Nov", "short month"], ["%d", "20", "day of the month"], ["%Y", "2026", "year"]] }
  ] };
  T.b_headers = { title: "Headers (how keys are sent)", sections: [
    { p: "Besides `params`, a request can carry **headers**: extra information about who you are. Keyed APIs like Spotify use a header called `Authorization`. This code is for reading. You cannot run it without a real key, and you must never paste a real key here." },
    { ex: ["token = \"...your secret token...\"", "headers = {\"Authorization\": \"Bearer \" + token}", "params = {\"q\": \"adele\", \"type\": \"track\", \"limit\": 5}", "response = requests.get(\"https://api.spotify.com/v1/search\", headers=headers, params=params)", "data = response.json()", "print(data[\"tracks\"][\"items\"][0][\"name\"])"] },
    { p: "Notice that after the first two lines it is the **same code** you wrote in this appendix: `get`, `params`, `.json()`, then digging into the dictionaries." }
  ] };
  T.b_apmap = { title: "How this connects to AP CSP", sections: [
    { p: "Working with web data touches several big ideas on the AP CSP exam and Create Task." },
    { rows: [["Internet (Big Idea 4)", "a request goes to a server, a response comes back", "requests.get(url) is exactly this"], ["Data (Big Idea 3)", "data is collected, stored and processed", "an API answer is data you filter, count and sort"], ["Abstraction", "you use an API without knowing how it works inside", "you never see the weather service's code"], ["a list", "songs = [...], products = [...]", "stores many values in one variable"], ["a procedure with a parameter", "def get_forecast(city):", "named, reusable code you give an input to"], ["selection (if)", "if response.status_code == 200:", "the program makes a decision"], ["iteration (a loop)", "for song in songs:", "the program repeats"]] },
    { good: "The exam writes these in pseudocode (`FOR EACH`, `IF`, `PROCEDURE`). The ideas are the same as the Python you write here." }
  ] };

  root.PYB = B;
  if (typeof module !== "undefined" && module.exports) module.exports = B;
})(typeof window !== "undefined" ? window : globalThis);
