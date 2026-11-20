/* APPENDIX B, PART 1: requests basics and weather (walkthroughs 1 to 6). */
(function (root) {
  "use strict";
  var P = root.PYA || (typeof require !== "undefined" ? require("./appendix-a-core.js") : null);
  var B = root.PYB || (typeof require !== "undefined" ? require("./appendix-b-core.js") : null);
  var ind = function (t) { return t.replace(/\n+$/, "").split("\n").map(function (l) { return l === "" ? l : "    " + l; }).join("\n"); };

  /* ================================================================= 1. Your First Request ================ */
  var S1 = B.seq([
    { title: "Bring in the requests library", add: `import requests`,
      say: ["Python can talk to websites with a library called **requests**. A library is a toolbox somebody else built that you can borrow. You borrow it with `import`.",
        "The very first time you run a program with `import requests`, the editor downloads the library. Give it a few seconds."],
      help: ["b_api", "b_typing"], type: "Type this line:", chk: [["import requests", /^\s*import\s+requests\b/m]], run: "The first run loads the library. It prints nothing else, and that is correct." },
    { title: "Pick a web address (a URL)", add: `\nurl = "https://api.open-meteo.com/v1/forecast?latitude=33.65&longitude=-83.72&current=temperature_2m&temperature_unit=fahrenheit"`,
      say: ["Every API has a web address. This one belongs to **Open-Meteo**, a free weather service. Read the address from left to right:",
        "`api.open-meteo.com/v1/forecast` is the weather service. Everything after the `?` is a setting: `latitude=33.65` and `longitude=-83.72` is the spot on Earth (Social Circle, Georgia), `current=temperature_2m` asks for the temperature right now, and `temperature_unit=fahrenheit` says which units."],
      help: ["b_api"], type: "Type this line (it is long, so be careful with every letter):", chk: [["a url variable that holds the Open-Meteo address", /^\s*url\s*=\s*["']https:\/\/api\.open-meteo\.com\/v1\/forecast\?/m], ["asking for current=temperature_2m", /current=temperature_2m/]] },
    { title: "Send the request", add: `response = requests.get(url)`,
      say: ["`requests.get(url)` visits the address and brings back the answer. We keep the answer in a variable called `response`."],
      help: ["b_request"], type: "Type this line:", chk: [["response = requests.get(url)", /\bresponse\s*=\s*requests\.get\(\s*url\s*\)/]], run: "Nothing prints yet, but your program just talked to a computer somewhere else." },
    { title: "Was it successful?", add: `print(response.status_code)`,
      say: ["Every response has a **status code**, a number that says how it went. **200** means success. Print it."],
      help: ["b_status"], type: "Type this line:", chk: [["print(response.status_code)", /print\(\s*response\.status_code\s*\)/]], run: "You should see **200**. If you see another number, check the url for typos." },
    { title: "Look at the answer", add: `print(response.text)`,
      say: ["`response.text` is the answer as plain text. Print it and see what a weather service actually says."],
      type: "Type this line:", chk: [["print(response.text)", /print\(\s*response\.text\s*\)/]], run: "You will see one long line full of curly brackets and quotes. That is **JSON**. The temperature is in there. In the next step you will pull out just that one number." },
    { title: "Turn the answer into Python", add: `\ndata = response.json()\nprint(data["current"]["temperature_2m"])`,
      say: ["`response.json()` turns the JSON text into a Python **dictionary** you can dig into. Then `data[\"current\"][\"temperature_2m\"]` means: in data, find `current`, and inside that find `temperature_2m`."],
      help: ["b_json", "b_nested"], type: "Type these two lines:", chk: [["data = response.json()", /\bdata\s*=\s*response\.json\(\)/], ["digging down to temperature_2m", /\[\s*["']current["']\s*\]\s*\[\s*["']temperature_2m["']\s*\]/]], run: "A single number prints. That is the real temperature outside right now." },
    { title: "Say it in a sentence", add: `\ntemp = data["current"]["temperature_2m"]\nprint(f"It is {temp} degrees Fahrenheit in Social Circle right now.")`,
      say: ["Numbers are more fun in a sentence. Save the number in a variable, then use an **f-string**: put an `f` before the quotes and write the variable inside `{ }`."],
      help: ["b_fstr"], type: "Type these two lines:", chk: [["a variable named temp", /^\s*temp\s*=\s*data\[/m], ["an f-string that uses {temp}", /print\(\s*f["'][^"']*\{\s*temp\s*\}/]], run: "Your program now reports the weather. You just used an API." }
  ]);
  B.add({
    num: 1, title: "Your First Request",
    intro: ["Every weather app on your phone gets its numbers from somewhere. In this walkthrough you will write a program that asks a real weather service for the temperature **right now** and prints it.",
      "This is your first **API request**: your program sends a question over the internet and reads the answer."],
    learn: ["what an API is", "requests.get", "status codes", "JSON and response.json()", "f-strings"],
    firstTips: ["b_api", "b_request", "b_typing"],
    stages: S1,
    finish: ["Run the program. Does the temperature look realistic for outside?", "Change `latitude=33.65&longitude=-83.72` in the url to the location of another city (try 40.71 and -74.01 for New York). Run it again."],
    challenges: ["In the url, change `current=temperature_2m` to `current=wind_speed_10m` and update the two places that say `temperature_2m` so it prints the wind.", "Change `temperature_unit=fahrenheit` to `celsius` (or remove it). What happens to the number?", "Look at the weather in a city on the other side of the world. Is it daytime or night there?"],
    recap: "You used `requests.get` to ask a web service a question, checked the **status code**, and used `.json()` plus a path of keys to pull out one value. Every API program in this appendix repeats those same steps.",
    next: "**Next:** Walkthrough 2 teaches you to **read JSON** with dictionaries and lists, so you can find anything in an answer."
  });

  /* ================================================================= 2. Reading JSON ================ */
  var S2 = B.seq([
    { title: "Get some data to explore", add: `import requests\nimport json\n\nurl = "https://api.open-meteo.com/v1/forecast?latitude=33.65&longitude=-83.72&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&forecast_days=3"\nresponse = requests.get(url)\ndata = response.json()`,
      say: ["This time you will ask for more: the temperature, humidity and wind right now, plus the high and low for 3 days. Then we spend the whole walkthrough learning to **read** what comes back.", "We import `json` too. You will see why in a moment."],
      help: ["b_json", "b_typing"], type: "Type the whole program so far (6 lines, with the long url):", chk: [["import requests and json", /^\s*import\s+json\b/m], ["a url that asks for relative_humidity_2m", /relative_humidity_2m/], ["data = response.json()", /\bdata\s*=\s*response\.json\(\)/]], run: "Nothing prints yet. Next we look at what is in `data`." },
    { title: "Print it (and see why we need a better way)", add: `\nprint(data)`,
      say: ["Print `data` to see everything the service sent."],
      type: "Type this line at the bottom:", chk: [["print(data)", /print\(\s*(data|json\.dumps\(\s*data[^)]*\))\s*\)/, 1, "any"]], run: "That is one huge, messy line. It is correct, but nobody can read it." },
    { title: "Print it in a readable layout", edit: [["print(data)", "print(json.dumps(data, indent=2))"]],
      say: ["`json.dumps(data, indent=2)` turns the dictionary back into text, but with a neat layout: each level pushed in 2 spaces. Change your `print(data)` line to use it.",
        "Now you can see the **shape** of the data. Curly brackets `{ }` are dictionaries. Square brackets `[ ]` are lists."],
      help: ["b_nested"], type: "Change `print(data)` to `print(json.dumps(data, indent=2))`.", chk: [["print(json.dumps(data, indent=2))", /json\.dumps\(\s*data\s*,\s*indent\s*=\s*2\s*\)/, 1, "any"]], run: "Scroll the Output box and find the words `current`, `daily`, and `temperature_2m_max`." },
    { title: "Dictionaries: keys and values", add: `\nprint(type(data))\nprint(data.keys())\nprint(data["timezone"])\nprint(data["latitude"])`,
      say: ["`data` is a **dictionary**: a collection of `key: value` pairs. `data.keys()` lists every key. `data[\"timezone\"]` looks up one value by its key, like finding a word in a dictionary.", "`type(data)` tells you what kind of thing a variable holds. Use it whenever you are unsure."],
      help: ["b_dict"], type: "Type these four lines at the bottom:", chk: [["print(type(data))", /print\(\s*type\(\s*data\s*\)\s*\)/], ["print(data.keys())", /data\.keys\(\)/], ["looking up a key like data[\"timezone\"]", /data\[\s*["']timezone["']\s*\]/]], run: "You will see `<class 'dict'>`, the list of keys, a time zone name, and a number." },
    { title: "A dictionary inside a dictionary", add: `\ncurrent = data["current"]\nprint(current)\nprint(current["relative_humidity_2m"])\nprint(current["wind_speed_10m"])`,
      say: ["The value of `\"current\"` is **another dictionary**. Store it in its own variable so you do not have to type `data[\"current\"]` every time."],
      help: ["b_nested"], type: "Type these four lines at the bottom:", chk: [["current = data[\"current\"]", /\bcurrent\s*=\s*data\[\s*["']current["']\s*\]/], ["reading a value from current", /current\[\s*["']relative_humidity_2m["']\s*\]/]], run: "You see the whole `current` dictionary, then the humidity and the wind speed." },
    { title: "Lists: many values in order", add: `\ndaily = data["daily"]\nhighs = daily["temperature_2m_max"]\nprint(highs)\nprint(highs[0])\nprint(highs[-1])\nprint(len(highs))`,
      say: ["`daily` holds **lists**: one temperature for each day. A list keeps items in order. `highs[0]` is the first one (counting starts at 0). `highs[-1]` is the last. `len(highs)` is how many there are."],
      help: ["b_list"], type: "Type these six lines at the bottom:", chk: [["highs = daily[\"temperature_2m_max\"]", /\bhighs\s*=\s*daily\[\s*["']temperature_2m_max["']\s*\]/], ["highs[0] and highs[-1]", /highs\[\s*-?\d\s*\]/, 2], ["len(highs)", /len\(\s*highs\s*\)/]], run: "You see 3 numbers in a list, the first high, the last high, and the number 3." },
    { title: "Units come with the data", add: `\nunits = data["current_units"]\nprint(f"Wind: {current['wind_speed_10m']} {units['wind_speed_10m']}")\nprint(f"Humidity: {current['relative_humidity_2m']}{units['relative_humidity_2m']}")`,
      say: ["Good APIs tell you the units too. Look in your pretty-printed output: there is a `current_units` dictionary. Combine a value with its unit in an f-string.", "Notice the quotes: the f-string uses double quotes `\"`, so the keys inside it use single quotes `'`."],
      help: ["b_fstr"], type: "Type these three lines at the bottom:", chk: [["units = data[\"current_units\"]", /\bunits\s*=\s*data\[\s*["']current_units["']\s*\]/], ["an f-string that uses units", /print\(\s*f["'][^\n]*\{\s*units\[/]], run: "You see `Wind: ... mph` and `Humidity: ...%`." },
    { title: "When a key might be missing", add: `\nprint(data.get("rain", "there is no rain key"))\nprint("current" in data)`,
      say: ["`data[\"rain\"]` would crash with a **KeyError** because there is no `rain` key. `data.get(\"rain\", \"backup\")` never crashes: it gives you the backup value instead. `\"current\" in data` checks if a key exists.", "Real programs use `.get` and `in` whenever the data might not be there."],
      help: ["b_dict", "b_errors"], type: "Type these two lines at the bottom:", chk: [["data.get(...) with a backup value", /\.get\(\s*["'][^"']+["']\s*,\s*[^)]+\)/], ["checking a key with in", /["'][^"']+["']\s+in\s+data\b/]], run: "You see your backup message, then `True`." }
  ]);
  B.add({
    num: 2, title: "Reading JSON: Dictionaries and Lists",
    intro: ["API answers come back as **JSON**, a way of writing dictionaries and lists as plain text. The skill that matters most in this whole appendix is **reading** that data and finding the part you want.",
      "You will explore a real weather answer one layer at a time, the way programmers do."],
    learn: ["json.dumps for reading data", "dictionaries and keys", "nested dictionaries", "lists and indexes", "dict.get and in"],
    firstTips: ["b_json", "b_nested", "b_dict"],
    stages: S2,
    finish: ["Run the program. Scroll through the Output and find every value you printed.", "Without looking, write the path to the **low** temperature of the **second day**. (Hint: it uses `daily`, `temperature_2m_min`, and an index.) Print it and check."],
    challenges: ["Print the `elevation` of the spot you asked about.", "Print all three dates from `daily[\"time\"]` using a `for` loop.", "Change `forecast_days=3` in the url to `5`. What does `len(highs)` say now?"],
    recap: "Curly brackets `{ }` are **dictionaries** (look up by key). Square brackets `[ ]` are **lists** (look up by position). You can nest them as deep as you like, and you dig in one level at a time. `json.dumps(..., indent=2)` is how you look at data you have never seen before.",
    next: "**Next:** Walkthrough 3 teaches **parameters**, so you can change what you ask for without rewriting a giant url."
  });

  /* ================================================================= 3. Parameters and Units ================ */
  var S3 = B.seq([
    { title: "Start with only the base address", add: `import requests\n\nurl = "https://api.open-meteo.com/v1/forecast"`,
      say: ["In Walkthrough 1 you typed one giant url. That is hard to read and easy to break. A better way: keep the **base address** in one variable, and give the settings (called **parameters**) separately."],
      help: ["b_params", "b_typing"], type: "Type these three lines:", chk: [["import requests", /^\s*import\s+requests\b/m], ["a base url with no ? in it", /^\s*url\s*=\s*["']https:\/\/api\.open-meteo\.com\/v1\/forecast["']\s*$/m]] },
    { title: "A dictionary of parameters (with a mistake on purpose)", add: `\nparams = {\n    "latitude": 999,\n    "longitude": -83.72,\n    "current": "temperature_2m"\n}\nresponse = requests.get(url, params=params)\nprint(response.status_code)\nprint(response.json())`,
      say: ["Each parameter is a `name: value` pair in a dictionary. `requests` joins them onto the url for you. Pass them with `params=params`.", "We put `999` as the latitude on purpose. Latitude cannot be bigger than 90. We want to see how an API complains."],
      help: ["b_params", "b_status"], type: "Type these lines at the bottom (the dictionary is spread over 5 lines):", chk: [["a params dictionary", /^\s*params\s*=\s*\{/m], ["a latitude and a longitude in it", /["']latitude["']\s*:[\s\S]*["']longitude["']\s*:/], ["requests.get(url, params=params)", /requests\.get\(\s*url\s*,\s*params\s*=\s*params\s*\)/]], run: "You should see status **400** (a mistake in YOUR request) and a message that says why. Good APIs tell you what you did wrong." },
    { title: "Fix it and see the real address", edit: [["999", "33.65"]], add: `print(response.url)`,
      say: ["Change `999` to `33.65`. Then print `response.url`. That shows the exact address `requests` built from your dictionary."],
      help: ["b_params"], type: "Change 999 to 33.65, then add a line at the bottom: `print(response.url)`", chk: [["print(response.url)", /print\(\s*response\.url\s*\)/]], run: "Status **200** now, a temperature in the answer, and the long address. Compare it with the one you typed in Walkthrough 1." },
    { title: "Ask for more", edit: [["\"current\": \"temperature_2m\"\n}", "\"current\": \"temperature_2m,wind_speed_10m,relative_humidity_2m\",\n    \"temperature_unit\": \"fahrenheit\",\n    \"wind_speed_unit\": \"mph\"\n}"]],
      say: ["To ask for several things in one parameter, join them with commas (no spaces). Then add two more parameters for the units.", "Edit your dictionary so it looks like the code box. Mind the commas: every pair needs a comma after it **except the last one**."],
      help: ["b_params", "b_typing"], type: "Update the dictionary so it has 5 parameters.", chk: [["asking for wind speed and humidity", /["']current["']\s*:\s*["'][^"']*wind_speed_10m[^"']*relative_humidity_2m/], ["a temperature_unit parameter", /["']temperature_unit["']\s*:/], ["a wind_speed_unit parameter", /["']wind_speed_unit["']\s*:/]], run: "The answer now has three current values." },
    { title: "Use variables for the location", edit: [["params = {", "lat = 33.65\nlon = -83.72\n\nparams = {"], ["\"latitude\": 33.65,", "\"latitude\": lat,"], ["\"longitude\": -83.72,", "\"longitude\": lon,"]],
      say: ["Variables make your program easy to change. Put the location in `lat` and `lon`, then use them inside the dictionary.", "From now on, to look at another city you change **two numbers on top**."],
      type: "Add `lat` and `lon` variables above the dictionary and use them inside it.", chk: [["variables lat and lon", /^\s*lat\s*=\s*-?[\d.]+[\s\S]*^\s*lon\s*=\s*-?[\d.]+/m], ["using them in the dictionary", /["']latitude["']\s*:\s*lat\b[\s\S]*["']longitude["']\s*:\s*lon\b/]], run: "It prints exactly what it did before. That is the point: nothing changed except it is easier to change." },
    { title: "Print a short report", add: `\ndata = response.json()\ncurrent = data["current"]\nprint()\nprint("Weather report")\nprint(f"Temperature: {current['temperature_2m']} F")\nprint(f"Wind: {current['wind_speed_10m']} mph")\nprint(f"Humidity: {current['relative_humidity_2m']}%")`,
      say: ["Finish by turning the data into a report a person would want to read. Print a blank line with `print()` to space things out."],
      help: ["b_fstr"], type: "Type these lines at the bottom:", chk: [["data = response.json()", /\bdata\s*=\s*response\.json\(\)/], ["current = data[\"current\"]", /\bcurrent\s*=\s*data\[\s*["']current["']\s*\]/], ["at least three f-string lines", /print\(\s*f["']/, 3]], run: "You see a three-line weather report." }
  ]);
  B.add({
    num: 3, title: "Parameters and Units",
    intro: ["Typing a giant url is how mistakes happen. Professional programs keep the **base url** and the **settings** apart. The settings are called **parameters**, and `requests` makes it easy.", "You will also learn what an API says when you ask for something impossible."],
    learn: ["params dictionaries", "response.url", "reading an error from an API", "variables for settings"],
    firstTips: ["b_params", "b_status"],
    stages: S3,
    finish: ["Run the program. Check the status code is 200.", "Change `lat` and `lon` to a place you would like to visit (search for \"latitude longitude of\" and the city). Run it again."],
    challenges: ["Add `\"timezone\": \"auto\"` to the dictionary and print `data[\"timezone\"]`.", "Change the units to `celsius` and `kmh` (the wind unit for kilometers per hour).", "Try a wrong parameter name, like `\"curent\"`. What does the API say?"],
    recap: "A **parameters dictionary** keeps settings neat, and `requests` builds the url for you. Always `print(response.url)` when something surprises you. And when the status is 400, **read the message**: the API usually tells you exactly what you did wrong.",
    next: "**Next:** Walkthrough 4 builds a real **weather app**: you type any city, and the program finds it and reports its weather."
  });

  /* ================================================================= 4. Weather 1: Any City ================ */
  var S4 = B.seq([
    { title: "Ask for a city", add: `import requests\n\nGEO_URL = "https://geocoding-api.open-meteo.com/v1/search"\nWEATHER_URL = "https://api.open-meteo.com/v1/forecast"\n\ncity = input("Which city? ")`,
      say: ["The weather API needs **latitude and longitude**, but people think in city names. Open-Meteo has a second API, called **geocoding**, that turns a city name into coordinates. So this program makes **two requests**: first find the city, then get its weather.",
        "We store the two addresses at the top in variables with CAPITAL letters. That is the Python habit for values that never change (called constants).",
        "`input(\"Which city? \")` opens a box so the user can type."],
      help: ["b_api", "b_input", "b_typing"], type: "Type these six lines:", chk: [["import requests", /^\s*import\s+requests\b/m], ["GEO_URL and WEATHER_URL", /^\s*GEO_URL\s*=\s*["']https:[\s\S]*^\s*WEATHER_URL\s*=\s*["']https:/m], ["city = input(...)", /\bcity\s*=\s*input\(/]], run: "Type a city name in the box, such as Atlanta. Nothing else happens yet." , inp: ["Atlanta"] },
    { title: "Find the city", add: `\ngeo_response = requests.get(GEO_URL, params={"name": city, "count": 1})\nprint(geo_response.url)\ngeo = geo_response.json()\nplace = geo["results"][0]\nprint(place.keys())`,
      say: ["`count: 1` asks for just the best match. The answer has a list called `results`. We take the first item with `[0]` and call it `place`.",
        "Print `place.keys()` to see what the service knows about the city."],
      help: ["b_params", "b_nested"], type: "Type these five lines at the bottom:", chk: [["a request to GEO_URL with params", /requests\.get\(\s*GEO_URL\s*,\s*params\s*=/], ["place = geo[\"results\"][0]", /\bplace\s*=\s*\w+\[\s*["']results["']\s*\]\s*\[\s*0\s*\]/]], run: "You see the keys: `name`, `latitude`, `longitude`, `country`, `admin1` (the state) and more.", inp: ["Atlanta"] },
    { title: "Read the place", add: `print(place["name"], place.get("admin1", ""), place["country"])\nprint(place["latitude"], place["longitude"])`,
      say: ["Pull out the name, the state, the country and the coordinates. `admin1` is the state or region, but not every place has one, so we use `.get` with an empty backup."],
      help: ["b_dict"], type: "Type these two lines at the bottom:", chk: [["place[\"latitude\"] and place[\"longitude\"]", /place\[\s*["']latitude["']\s*\][\s\S]*place\[\s*["']longitude["']\s*\]/], ["place.get(\"admin1\", ...)", /place\.get\(\s*["']admin1["']/]], run: "You see something like `Atlanta Georgia United States` and two numbers.", inp: ["Atlanta"] },
    { title: "Ask for the weather there", add: `\nlat = place["latitude"]\nlon = place["longitude"]\n\nparams = {\n    "latitude": lat,\n    "longitude": lon,\n    "current": "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m",\n    "temperature_unit": "fahrenheit",\n    "wind_speed_unit": "mph"\n}\nweather_response = requests.get(WEATHER_URL, params=params)\nweather = weather_response.json()\ncurrent = weather["current"]`,
      say: ["Now use the coordinates you just found to ask the weather API. This is the same kind of parameters dictionary from Walkthrough 3, but `lat` and `lon` come from the **first request's answer**.",
        "`apparent_temperature` is the \"feels like\" temperature."],
      help: ["b_params", "b_typing"], type: "Type these lines at the bottom:", chk: [["lat and lon taken from place", /\blat\s*=\s*place\[[\s\S]*\blon\s*=\s*place\[/], ["a params dictionary using lat and lon", /["']latitude["']\s*:\s*lat\b[\s\S]*["']longitude["']\s*:\s*lon\b/], ["a request to WEATHER_URL", /requests\.get\(\s*WEATHER_URL\s*,\s*params\s*=\s*params\s*\)/], ["current = weather[\"current\"]", /\bcurrent\s*=\s*weather\[\s*["']current["']\s*\]/]], run: "Nothing new prints, but your program has now made two requests.", inp: ["Atlanta"] },
    { title: "Print the weather report", add: `\nprint()\nprint(f"Weather for {place['name']}")\nprint(f"Temperature: {current['temperature_2m']} F")\nprint(f"Feels like:  {current['apparent_temperature']} F")\nprint(f"Humidity:    {current['relative_humidity_2m']}%")\nprint(f"Wind:        {current['wind_speed_10m']} mph")`,
      say: ["Time for the report. Notice the extra spaces after `Feels like:` and `Humidity:`. They line the numbers up in a column."],
      help: ["b_fstr"], type: "Type these six lines at the bottom:", chk: [["at least five f-string prints", /print\(\s*f["']/, 5], ["the report uses current[\"apparent_temperature\"]", /current\[\s*["']apparent_temperature["']\s*\]/]], run: "Try Atlanta, then Tokyo, then your hometown.", inp: ["Atlanta"] },
    { title: "Add some advice", add: `\nfeels = current["apparent_temperature"]\nif feels < 40:\n    print("Advice: wear a heavy coat.")\nelif feels < 60:\n    print("Advice: bring a jacket.")\nelif feels < 85:\n    print("Advice: nice weather, enjoy it.")\nelse:\n    print("Advice: it is hot, drink water.")`,
      say: ["An app should help. Use an `if` / `elif` / `else` chain on the \"feels like\" temperature to give advice. Python checks the conditions from the top and uses the first one that is true."],
      type: "Type these lines at the bottom:", chk: [["an if / elif / else chain on the temperature", /^\s*if\s+feels\s*<[\s\S]*^\s*elif\s+feels\s*<[\s\S]*^\s*else\s*:/m]], run: "Try a very cold place (Reykjavik) and a very hot one (Dubai).", inp: ["Atlanta"] }
  ]);
  B.add({
    num: 4, title: "Weather 1: Any City",
    intro: ["Time to build a real weather app. You type **any city in the world** and the program tells you the weather there.", "It works in two steps: one request turns the **city name into coordinates**, and a second request uses those coordinates to get the **weather**. Programs often chain APIs together like this."],
    learn: ["input()", "chaining two API requests", "using one answer to build the next request", "if / elif / else on live data"],
    firstTips: ["b_input", "b_nested", "b_typing"],
    stages: S4,
    finish: ["Run it with 3 different cities, including one outside the United States.", "Run it with a city you made up and read what happens. (You will fix the crash in Walkthrough 6.)"],
    challenges: ["Add a line that prints the `country` of the place.", "Add a `wind` warning: if the wind is over 20 mph, print a message.", "Add `\"timezone\": \"auto\"` to the weather params and print `weather[\"timezone\"]`."],
    tips: {},
    recap: "You chained **two APIs**: the first one's answer (latitude and longitude) became part of the second one's request. You also turned raw numbers into advice with `if` / `elif` / `else`.",
    next: "**Next:** Walkthrough 5 adds a **7-day forecast** using loops."
  });

  /* ================================================================= 5. Weather 2: The 7-Day Forecast ================ */
  var F4 = S4.final;
  var S5 = B.seq([
    { title: "Bring your Weather 1 code", bring: true, code: F4,
      say: ["Open **Walkthrough 4**. Select all of your code (**Ctrl + A**), copy it (**Ctrl + C**), come back here and paste it into the code box (**Ctrl + V**).", "Run it once to make sure your weather report still works."],
      help: ["b4"], type: "Paste your finished Walkthrough 4 program into the code box.", chk: [["the city input", /\bcity\s*=\s*input\(/], ["both requests", /requests\.get\(\s*GEO_URL[\s\S]*requests\.get\(\s*WEATHER_URL/], ["the advice if / elif chain", /^\s*elif\s+feels/m]], run: "It reports the weather for the city you type.", inp: ["Atlanta"] },
    { title: "Ask for the daily forecast", edit: [["\"wind_speed_unit\": \"mph\"\n}", "\"wind_speed_unit\": \"mph\",\n    \"daily\": \"temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code\",\n    \"timezone\": \"auto\",\n    \"forecast_days\": 7\n}"]], add: `\ndaily = weather["daily"]\nprint(daily["time"])`,
      say: ["The same request can return the current weather **and** a forecast. Add three new parameters to your params dictionary (`daily`, `timezone`, `forecast_days`). Remember the comma after the line before them.",
        "Then, at the very bottom, store `weather[\"daily\"]` and print its dates."],
      help: ["b_params", "b_typing"], type: "Add the three parameters, and the two new lines at the bottom.", chk: [["a daily parameter", /["']daily["']\s*:\s*["'][^"']*temperature_2m_max/], ["forecast_days set to 7", /["']forecast_days["']\s*:\s*7/], ["daily = weather[\"daily\"]", /\bdaily\s*=\s*weather\[\s*["']daily["']\s*\]/]], run: "You see 7 dates. The daily numbers all come in **lists** that line up: the first date goes with the first high, and so on.", inp: ["Atlanta"] },
    { title: "Loop through the days", edit: [["print(daily[\"time\"])", "print()\nprint(\"7-Day Forecast\")\nfor i in range(len(daily[\"time\"])):\n    print(daily[\"time\"][i], daily[\"temperature_2m_max\"][i])"]],
      say: ["Replace the last `print` line with a loop. `range(len(daily[\"time\"]))` counts `0, 1, 2 ... 6`. Each time around, `i` is the position, and `daily[\"time\"][i]` and `daily[\"temperature_2m_max\"][i]` are the date and high temperature **for the same day**."],
      help: ["b_list"], type: "Replace the `print(daily[\"time\"])` line with the loop.", chk: [["a for loop using range(len(...))", /for\s+i\s+in\s+range\(\s*len\(\s*daily\[\s*["']time["']\s*\]\s*\)\s*\)\s*:/], ["indexing a daily list with [i]", /daily\[\s*["']temperature_2m_max["']\s*\]\s*\[\s*i\s*\]/]], run: "Seven lines, each with a date and a high temperature.", inp: ["Atlanta"] },
    { title: "Make each line nicer", edit: [["    print(daily[\"time\"][i], daily[\"temperature_2m_max\"][i])", "    day = daily[\"time\"][i]\n    high = daily[\"temperature_2m_max\"][i]\n    low = daily[\"temperature_2m_min\"][i]\n    print(f\"{day}  high {high:.0f}  low {low:.0f}\")"]],
      say: ["Give each value in the loop a name (`day`, `high`, `low`) so the print line is easy to read. `{high:.0f}` rounds to a whole number."],
      help: ["b_fstr"], type: "Replace the print line inside the loop with the four new lines.", chk: [["day, high and low variables", /^\s+day\s*=[\s\S]*^\s+high\s*=[\s\S]*^\s+low\s*=/m], ["{high:.0f} formatting", /\{\s*high\s*:\.0f\s*\}/]], run: "Clean lines like `2026-11-21  high 67  low 48`.", inp: ["Atlanta"] },
    { title: "Show weekday names", edit: [["import requests", "import requests\nimport datetime"], ["    print(f\"{day}  high {high:.0f}  low {low:.0f}\")", "    name = datetime.date.fromisoformat(day).strftime(\"%A\")\n    print(f\"{name:<10} high {high:.0f}  low {low:.0f}\")"]],
      say: ["People say \"Friday\", not \"2026-11-20\". The `datetime` library can turn the date text into a weekday name. `strftime(\"%A\")` means \"format it as a full weekday name\".", "`{name:<10}` pads the name to 10 letters so the columns line up."],
      help: ["b_dates"], type: "Add `import datetime` at the top and update the print line in the loop.", chk: [["import datetime", /^\s*import\s+datetime\b/m], ["strftime(\"%A\")", /strftime\(\s*["']%A["']\s*\)/]], run: "Now it says Friday, Saturday, Sunday...", inp: ["Atlanta"] },
    { title: "Describe the sky with a dictionary", edit: [["city = input(\"Which city? \")", "CODES = {\n    0: \"Clear sky\", 1: \"Mostly clear\", 2: \"Partly cloudy\", 3: \"Overcast\",\n    45: \"Fog\", 48: \"Fog\", 51: \"Light drizzle\", 53: \"Drizzle\", 55: \"Heavy drizzle\",\n    61: \"Light rain\", 63: \"Rain\", 65: \"Heavy rain\", 71: \"Light snow\", 73: \"Snow\", 75: \"Heavy snow\",\n    80: \"Rain showers\", 81: \"Rain showers\", 82: \"Heavy showers\", 95: \"Thunderstorm\"\n}\n\ncity = input(\"Which city? \")"], ["    name = datetime.date.fromisoformat(day).strftime(\"%A\")", "    code = daily[\"weather_code\"][i]\n    sky = CODES.get(code, \"Unknown\")\n    name = datetime.date.fromisoformat(day).strftime(\"%A\")"], ["    print(f\"{name:<10} high {high:.0f}  low {low:.0f}\")", "    print(f\"{name:<10} high {high:.0f}  low {low:.0f}  {sky}\")"]],
      say: ["The weather is a **code**, like 61 for light rain. A **dictionary** can translate codes into words: the code is the key and the words are the value. Add the `CODES` dictionary above the `city = input(...)` line. (Type it exactly. The help button has the table of what the numbers mean.)",
        "Inside the loop, look up the code with `CODES.get(code, \"Unknown\")`. The backup word is used when the code is not in your dictionary."],
      help: ["b_codes", "b_dict"], type: "Add the `CODES` dictionary, then add the `code` and `sky` lines in the loop and put `{sky}` at the end of the print line.", chk: [["a CODES dictionary", /^\s*CODES\s*=\s*\{/m], ["CODES.get(code, ...)", /CODES\.get\(\s*code\s*,/], ["{sky} in the output", /\{\s*sky\s*\}/]], run: "Each day now says things like Partly cloudy or Light rain.", inp: ["Atlanta"] },
    { title: "Rain alerts and a weekly summary", edit: [["for i in range(len(daily[\"time\"])):", "rainy_days = 0\nfor i in range(len(daily[\"time\"])):"], ["    sky = CODES.get(code, \"Unknown\")", "    sky = CODES.get(code, \"Unknown\")\n    rain = daily[\"precipitation_sum\"][i]\n    if rain > 1:\n        rainy_days += 1\n        sky = sky + \" (umbrella!)\""]], add: `\nhottest = max(daily["temperature_2m_max"])\nprint()\nprint(f"Hottest high this week: {hottest:.0f} F")\nprint(f"Days with rain: {rainy_days}")`,
      say: ["Finish with some smarts. Before the loop, make a counter `rainy_days = 0`. In the loop, if more than 1 millimeter of rain is forecast, add 1 to the counter and add \"(umbrella!)\" to the sky text.",
        "After the loop, `max(...)` finds the biggest number in a list. Print the hottest high and the number of rainy days."],
      help: ["b_sort"], type: "Make the three edits: the counter before the loop, the `rain` check inside the loop, and the summary at the bottom.", chk: [["rainy_days counter", /\brainy_days\s*=\s*0[\s\S]*\brainy_days\s*\+=\s*1/], ["an if rain check", /^\s+if\s+rain\s*>/m], ["max(...) of the daily highs", /\bmax\(\s*daily\[\s*["']temperature_2m_max["']\s*\]\s*\)/]], run: "Try a rainy city like Seattle or London. You will see the umbrella notes and the weekly numbers.", inp: ["Seattle"] }
  ], F4);
  B.add({
    num: 5, title: "Weather 2: The 7-Day Forecast",
    intro: ["Your weather app tells you what it is like right now. Now teach it to look **a week ahead**.", "The forecast comes back as **parallel lists**: one list of dates, one of high temperatures, one of low temperatures, one of weather codes. Position 0 in every list is the same day. A **loop** walks through them together.",
      "Copy your finished code from **Walkthrough 4** and paste it into the code box. Then work down the steps."],
    learn: ["parallel lists", "for loops with range(len(...))", "weekday names with datetime", "a dictionary that translates codes", "counters and max()"],
    firstTips: ["b_list", "b_dict", "b_typing"],
    stages: S5, tips: { b4: B.bring(4, F4) },
    finish: ["Run it for three cities. Does the forecast make sense for each one?", "Look at the loop. Find where `i` is used to line up the lists."],
    challenges: ["Print the **lowest** low of the week with `min`.", "Add the rain total: `sum(daily[\"precipitation_sum\"])`.", "Mark the **coldest** day by comparing each `low` with `min(daily[\"temperature_2m_min\"])` inside the loop.", "Switch the program to celsius (`\"temperature_unit\": \"celsius\"`) and change the `F` in the text to `C`."],
    recap: "**Parallel lists** share positions: `daily[\"time\"][i]` and `daily[\"temperature_2m_max\"][i]` describe the same day. A `for i in range(len(...))` loop visits each position. A **dictionary** (`CODES`) translates numbers into words. And a **counter** (`rainy_days += 1`) answers questions like \"how many days?\".",
    next: "**Next:** Walkthrough 6 makes your weather app **tough**: what happens when the city does not exist or the internet fails?"
  });

  /* ================================================================= 6. Weather 3: When Things Go Wrong ================ */
  var HEAD6 = `import requests\n\nGEO_URL = "https://geocoding-api.open-meteo.com/v1/search"\nWEATHER_URL = "https://api.open-meteo.com/v1/forecast"\n`;
  var FIND6 = `\ndef find_city(name):\n    response = requests.get(GEO_URL, params={"name": name, "count": 1})\n    data = response.json()\n    results = data.get("results")\n    if not results:\n        return None\n    return results[0]\n`;
  var FORE6 = `\ndef get_forecast(place):\n    params = {\n        "latitude": place["latitude"],\n        "longitude": place["longitude"],\n        "current": "temperature_2m,apparent_temperature",\n        "daily": "temperature_2m_max,temperature_2m_min",\n        "temperature_unit": "fahrenheit",\n        "timezone": "auto",\n        "forecast_days": 3\n    }\n    response = requests.get(WEATHER_URL, params=params, timeout=10)\n    if response.status_code != 200:\n        return None\n    return response.json()\n`;
  var REP6 = `\ndef show_report(place, forecast):\n    current = forecast["current"]\n    daily = forecast["daily"]\n    print()\n    print(f"Weather for {place['name']}, {place.get('admin1', '')}")\n    print(f"Now: {current['temperature_2m']:.0f} F (feels like {current['apparent_temperature']:.0f} F)")\n    for i in range(len(daily["time"])):\n        print(f"{daily['time'][i]}: high {daily['temperature_2m_max'][i]:.0f}, low {daily['temperature_2m_min'][i]:.0f}")\n`;
  var S6 = B.seq([
    { title: "Make it crash on purpose", code: HEAD6 + `\ncity = input("Which city? ")\nresponse = requests.get(GEO_URL, params={"name": city, "count": 1})\nplace = response.json()["results"][0]\nprint(place["name"])\n`,
      say: ["Real programs meet bad input all the time: a misspelled city, a user who hits Enter, a website that is down. A program that crashes is a bad program. First, let us **see** a crash.",
        "Type this short program. Run it with `Atlanta` (it works). Then run it again with nonsense like `zzzqqq`."],
      help: ["b_errors", "b_typing"], type: "Type the whole program.", chk: [["both url constants", /^\s*GEO_URL\s*=[\s\S]*^\s*WEATHER_URL\s*=/m], ["a request to GEO_URL", /requests\.get\(\s*GEO_URL/], ["city = input(...)", /\bcity\s*=\s*input\(/]], run: "With `zzzqqq` you get **KeyError: 'results'**. The service had no results, so the key was not in the answer.", inp: ["Atlanta"] },
    { title: "A function that can say \"not found\"", code: HEAD6 + FIND6 + `\ncity = input("Which city? ")\nplace = find_city(city)\nif place is None:\n    print("I could not find " + city + ". Check the spelling.")\nelse:\n    print("Found", place["name"], place.get("admin1", ""))\n`,
      say: ["Wrap the search in a **function**. It takes the city name (a **parameter**) and **returns** the place. If there are no results it returns `None`, Python's way of saying \"nothing\".",
        "`data.get(\"results\")` does not crash if the key is missing: it gives `None`. `if not results:` is true for `None` and for an empty list. Then the main program checks `if place is None:` and handles it politely."],
      help: ["b_funcs", "b_dict", "b_typing"], type: "Replace the last four lines of your program. Type the `find_city` function above `city = input(...)`, then the if / else below it.", chk: [["def find_city(name)", /^def\s+find_city\(\s*name\s*\)\s*:/m], ["return None", /\breturn\s+None\b/], ["place = find_city(city)", /\bplace\s*=\s*find_city\(\s*city\s*\)/], ["if place is None", /\bif\s+place\s+is\s+None\s*:/]], run: "Run it twice: `Atlanta` works, and `zzzqqq` prints your friendly message instead of crashing.", inp: ["zzzqqq"] },
    { title: "A function that gets the forecast", code: HEAD6 + FIND6 + FORE6 + `\ncity = input("Which city? ")\nplace = find_city(city)\nif place is None:\n    print("I could not find " + city + ". Check the spelling.")\nelse:\n    forecast = get_forecast(place)\n    if forecast is None:\n        print("The weather service had a problem. Try again later.")\n    else:\n        print(forecast["current"])\n`,
      say: ["Make a second function for the weather request. It takes the `place`, builds the params, and returns the answer. Before it trusts the answer it checks `response.status_code != 200`. If the service had a problem, it returns `None` again.",
        "`timeout=10` means \"give up if there is no answer in 10 seconds\"."],
      help: ["b_funcs", "b_status"], type: "Add `get_forecast` below `find_city`, and extend the main program as shown.", chk: [["def get_forecast(place)", /^def\s+get_forecast\(\s*place\s*\)\s*:/m], ["checking the status code", /status_code\s*!=\s*200/], ["forecast = get_forecast(place)", /\bforecast\s*=\s*get_forecast\(\s*place\s*\)/]], run: "For a real city it prints the current weather dictionary.", inp: ["Atlanta"] },
    { title: "A function that shows the report", code: HEAD6 + FIND6 + FORE6 + REP6 + `\ncity = input("Which city? ")\nplace = find_city(city)\nif place is None:\n    print("I could not find " + city + ". Check the spelling.")\nelse:\n    forecast = get_forecast(place)\n    if forecast is None:\n        print("The weather service had a problem. Try again later.")\n    else:\n        show_report(place, forecast)\n`,
      say: ["A third function, `show_report`, takes **two** parameters and prints the report. Now each function has **one job**: `find_city` finds, `get_forecast` fetches, `show_report` shows. That makes the program easy to read and easy to fix.", "Then change the last `print` in your main program to call `show_report(place, forecast)`."],
      help: ["b_funcs", "b_fstr"], type: "Add `show_report` and call it in the main program.", chk: [["def show_report(place, forecast)", /^def\s+show_report\(\s*place\s*,\s*forecast\s*\)\s*:/m], ["calling show_report(place, forecast)", /^\s+show_report\(\s*place\s*,\s*forecast\s*\)/m]], run: "A neat 3-day report prints.", inp: ["Atlanta"] },
    { title: "Handle a dead internet connection", code: HEAD6 + FIND6 + FORE6 + REP6 + `\ncity = input("Which city? ")\ntry:\n    place = find_city(city)\n    if place is None:\n        print("I could not find " + city + ". Check the spelling.")\n    else:\n        forecast = get_forecast(place)\n        if forecast is None:\n            print("The weather service had a problem. Try again later.")\n        else:\n            show_report(place, forecast)\nexcept requests.exceptions.RequestException:\n    print("Could not reach the internet. Try again in a minute.")\n`, reindent: true,
      say: ["Some failures are not about the data: the Wi-Fi drops or the site is down. `requests` then raises an **exception**, and the program stops. `try` / `except` catches it.",
        "Put the main program inside `try:` (push every line in one more level with the Tab key) and add an `except requests.exceptions.RequestException:` at the bottom. That one name catches **every** kind of requests problem."],
      help: ["b_try", "b_typing"], type: "Wrap the main program in `try:` and add the `except` at the bottom.", chk: [["a try block", /^\s*try\s*:/m], ["except requests.exceptions.RequestException", /^\s*except\s+requests\.exceptions\.RequestException\s*:/m]], run: "It still works as before. To test the new part for real you would turn off the Wi-Fi, so just make sure it still runs.", inp: ["Atlanta"] },
    { title: "Keep asking until it works", code: HEAD6 + FIND6 + FORE6 + REP6 + `\nwhile True:\n    city = input("Which city? (type quit to stop) ")\n    if city.lower() == "quit":\n        break\n    try:\n        place = find_city(city)\n        if place is None:\n            print("I could not find " + city + ". Check the spelling.")\n        else:\n            forecast = get_forecast(place)\n            if forecast is None:\n                print("The weather service had a problem. Try again later.")\n            else:\n                show_report(place, forecast)\n    except requests.exceptions.RequestException:\n        print("Could not reach the internet. Try again in a minute.")\n`, reindent: true,
      say: ["Last improvement: instead of ending after one city, **loop** so the user can look up as many cities as they like. Wrap everything from `city = input(...)` down in `while True:` and push it in one more level. Add a way out: if the user types `quit`, `break` leaves the loop.", "`city.lower()` makes the comparison ignore capital letters, so `QUIT` and `Quit` work too."],
      help: ["b_menu", "b_input"], type: "Wrap the main program in a `while True:` loop with a `quit` option.", chk: [["a while True loop", /^while\s+True\s*:/m], ["a quit that uses break", /\.lower\(\)\s*==\s*["']quit["']\s*:[\s\S]*\bbreak\b/]], run: "Try: `zzzqqq` (friendly error), then `Atlanta` (report), then `quit`.", inp: ["zzzqqq", "Atlanta", "quit"] }
  ]);
  B.add({
    num: 6, title: "Weather 3: When Things Go Wrong",
    intro: ["Everything works when the user types perfect input and the internet is fast. **Real programs have to survive the real world.** In this walkthrough you will take your weather app and make it tough.",
      "You will also reorganize the code into **functions**, so each part has one job."],
    learn: ["handling a missing key with .get", "functions with parameters and return values", "checking status codes", "try / except for network problems", "a loop that keeps asking"],
    firstTips: ["b_errors", "b_funcs", "b_try"],
    stages: S6,
    finish: ["Run it and try: a real city, a made-up city, the same city twice, and `quit`.", "Read your finished program from the bottom up. Can you find where each of these is handled: a city that does not exist, a bad status code, no internet?"],
    challenges: ["Make a blank entry (the user just presses Enter) print \"Please type a city.\" instead of searching.", "Add a `\"count\": 3` search and let the user choose between several matching places (there are many Springfields!).", "Print how long the request took using `response.elapsed.total_seconds()`."],
    recap: "A strong program expects trouble. `.get()` handles missing data, a function can `return None` to say \"nothing found\", the **status code** says whether the website was happy, and `try` / `except requests.exceptions.RequestException` catches network failures. Splitting the work into functions made each piece easy to test.",
    next: "**Next:** Walkthrough 7 starts the **music** unit: search Apple's music catalog."
  });
})(typeof window !== "undefined" ? window : globalThis);
