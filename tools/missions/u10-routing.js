/* UNIT 10: THE INTERNET. Pair 3: Routing (CodeHS 10.6).
   Walkthrough (50 points): notes + labs.  Mission (100 points): Storm Warning.  */
"use strict";
const M = require("./core.js");
const UNIT = "Unit 10: The Internet";
const note = (label, groups) => new RegExp("^\\s*" + label + ":" + groups.map((g) => "(?=.*(?:" + g + "))").join("") + ".*\\S", "i");
const FN = (name, args) => new RegExp("^def\\s+" + name + "\\(\\s*" + (args || "\\w+") + "\\s*\\)\\s*:", "m");

/* ================================================================= WALKTHROUGH ================ */
M.addWalkthrough("a105", {
  num: 3, title: "Routing: How Packets Find Their Way (10.6)",
  intro: ["**INCOMING TRANSMISSION from NetOps HQ:** A packet leaves your laptop and has to reach a server on the other side of the planet. Nobody hands it a map. Yet it **gets there in a fraction of a second**. Today you learn how, and you train as a **Route Engineer**.",
    "In about 25 minutes you will take **notes**, turn a network into a Python **graph**, write a **path-finding** function, and watch traffic **reroute around damage**. Hit **100%** and **Mission 10.6: Storm Warning** unlocks."],
  learn: ["routers and hops", "networks as graphs", "finding a path", "redundancy and fault tolerance", "latency and hops"],
  firstTips: ["notes", "b_list"],
  stages: [
    { title: "Briefing 1: Routers and hops",
      say: ["A **router** is a device that **forwards packets** toward their **destination**. It looks at the destination address and passes the packet to the **next** router that is closer. Each handoff is called a **hop**.",
        "The **path** a packet takes is the list of devices it travels through. No single router knows the whole path. Every router just makes a good choice for the **next hop** (like asking for directions at every intersection).",
        "Here is the SCHS network. Type your note, then draw a path through it and count the hops."],
      help: ["notes", "routerhelp"],
      add: `# NOTES: Routing (10.6)\n# ROUTER: a device that forwards each packet toward its destination one hop at a time\n\nimport netlab\n\nnodes, links = netlab.school_network()\npath = ["Laptop", "Switch", "Router A", "ISP"]\nprint("Path:", " > ".join(path))\nprint("Hops:", len(path) - 1)\nnetlab.show_network(nodes, links, path, title="A route to the ISP")`,
      type: "Type the note, then the lab that draws the path.",
      chk: [["a # ROUTER: note about forwarding packets toward the destination", note("ROUTER", ["forward|send|pass|move|direct", "packet|data", "destination|next|toward|hop"]), 1, "comments"], ["import netlab and load the school network", /^\s*import\s+netlab\b[\s\S]*nodes\s*,\s*links\s*=\s*netlab\.school_network\(\s*\)/m], ["a path list of device names", /^\s*path\s*=\s*\[\s*["'][^"']+["']\s*(?:,\s*["'][^"']+["']\s*)+\]/m], ["counting hops with len(path) - 1", /len\(\s*path\s*\)\s*-\s*1/]],
      run: "A map with the route lit up in green.", runChk: [["the path printed", /Path: Laptop > Switch > Router A > ISP/], ["3 hops", /Hops: 3/]] },
    { title: "Briefing 2: A network is a graph",
      say: ["Computer scientists draw a network as a **graph**: **nodes** (the devices) and **links** (the cables or wireless connections between them). Two nodes joined by a link are **neighbors**.",
        "In Python the neighbor list is a **dictionary**: each device name points to a **list** of the devices it connects to. The loop below builds that dictionary from the list of links."],
      help: ["b_dict", "b_list"],
      add: `\n# GRAPH: a network is made of nodes and links and each node keeps a list of the neighbors it connects to\ngraph = {}\nfor a, b in links:\n    if a not in graph:\n        graph[a] = []\n    if b not in graph:\n        graph[b] = []\n    graph[a].append(b)\n    graph[b].append(a)\nprint("Router A connects to:", graph["Router A"])\nprint("Router C connects to:", graph["Router C"])`,
      type: "Type the `# GRAPH:` note and the loop that builds the graph.",
      chk: [["a # GRAPH: note about nodes, links and neighbors", note("GRAPH", ["node|device|router|computer", "link|connect|neighbor|edge|cable"]), 1, "comments"], ["an empty graph dictionary", /^\s*graph\s*=\s*\{\s*\}/m], ["looping over the links", /for\s+a\s*,\s*b\s+in\s+links\s*:/], ["adding each end to the other's neighbor list", /graph\[\s*a\s*\]\.append\(\s*b\s*\)[\s\S]*graph\[\s*b\s*\]\.append\(\s*a\s*\)/]],
      run: "Each router lists its neighbors.", runChk: [["Router A's neighbors printed as a list", /Router A connects to: \[/], ["Router C's neighbors printed as a list", /Router C connects to: \[/]] },
    { title: "Briefing 3: Finding a path",
      say: ["How does a computer find a route? One classic idea is **breadth-first search**. Start at the source and explore **all its neighbors**, then **their** neighbors, ring by ring, like ripples in a pond. The **first** time you reach the destination you have found a route with the **fewest hops**.",
        "The trick is a **queue** (a list where you add at the end and take from the front) of **paths**, plus a list of places you have already **seen** so you never go in circles.",
        "Type this function carefully. Read each comment-free line and ask what it does. You will write your own version in the Mission."],
      help: ["bfs"],
      add: `\n# PATH: to find a route explore the neighbors of the start then their neighbors and stop at the first path that reaches the destination\ndef find_path(graph, start, end):\n    queue = [[start]]\n    seen = [start]\n    while len(queue) > 0:\n        path = queue.pop(0)\n        node = path[-1]\n        if node == end:\n            return path\n        for neighbor in graph[node]:\n            if neighbor not in seen:\n                seen.append(neighbor)\n                queue.append(path + [neighbor])\n    return None\n\nroute = find_path(graph, "Laptop", "ISP")\nprint("Route:", " > ".join(route))\nprint("Hops:", len(route) - 1)`,
      type: "Type the `# PATH:` note, the `find_path` function and the three lines that use it.",
      chk: [["a # PATH: note about exploring neighbors until the destination", note("PATH", ["neighbor|next|connect|explore|search|follow", "destination|end|target|goal|reach|find"]), 1, "comments"], ["a function find_path(graph, start, end)", FN("find_path", "graph\\s*,\\s*start\\s*,\\s*end")], ["a queue of paths and a seen list", /queue\s*=\s*\[\s*\[\s*start\s*\]\s*\][\s\S]*seen\s*=\s*\[\s*start\s*\]/], ["taking the first path off the front with pop(0)", /queue\.pop\(\s*0\s*\)/], ["returning the path when the end is reached", /if\s+node\s*==\s*end\s*:\s*\n\s+return\s+path/], ["returning None when there is no route", /return\s+None/]],
      run: "The route and its hop count.", runChk: [["the route was found", /Route: Laptop > Switch > Router A > ISP/], ["3 hops", /Hops: 3/, 2]] },
    { title: "Briefing 4: Redundancy and fault tolerance",
      say: ["The Internet has **many paths** between any two points. That is called **redundancy**. If one router or cable **fails** (a storm, a cut fiber, a power outage), packets are **rerouted** along a different path. A system that keeps working after a part fails is **fault tolerant**, and it has **no single point of failure**.",
        "More redundancy costs more cables and routers, but it is why the Internet is so reliable. Watch it happen: knock out **Router A** and find a detour."],
      help: ["b_list"],
      add: `\n# REDUNDANCY: the internet has more than one path between two points so when a router fails packets can be rerouted along another path\nbroken = "Router A"\nfor node in graph:\n    if broken in graph[node]:\n        graph[node].remove(broken)\ngraph[broken] = []\ndetour = find_path(graph, "Laptop", "ISP")\nprint("Detour:", " > ".join(detour))\nprint("Hops:", len(detour) - 1)\nnetlab.animate_packet(nodes, links, detour, down=[(a, b) for a, b in links if broken in (a, b)], title=broken + " is down")`,
      type: "Type the `# REDUNDANCY:` note and the lab that breaks a router and finds a detour.",
      chk: [["a # REDUNDANCY: note about backup paths and rerouting", note("REDUNDANCY", ["more than one|multiple|many|another|backup|alternate|several|extra|redundan", "fail|reroute|break|down|around|detour|still"]), 1, "comments"], ["removing the broken router from every neighbor list", /if\s+broken\s+in\s+graph\[\s*node\s*\]\s*:\s*\n\s+graph\[\s*node\s*\]\.remove\(\s*broken\s*\)/], ["finding a detour with find_path", /detour\s*=\s*find_path\(\s*graph\s*,/], ["animating the packet along the detour", /netlab\.animate_packet\(\s*nodes\s*,\s*links\s*,\s*detour/]],
      run: "A packet takes the long way around the broken router.", runChk: [["a detour was found", /Detour: [\w >]+/], ["the detour has a hop count", /Hops: \d+/, 3]] },
    { title: "Briefing 5: Hops, delay and traceroute",
      say: ["Every hop adds a little **delay** (called **latency**) because a router has to read the packet and decide. Usually, **fewer hops means a faster trip**, though a busy router or a slow link can matter too.",
        "You can see real routes with the **traceroute** tool, which lists every router between you and a website, in order. Your own mini traceroute below uses `enumerate` to number each hop."],
      add: `\n# LATENCY: each hop adds a little delay so a route with more hops is usually slower\nprint("TRACEROUTE")\nfor number, router in enumerate(detour, 1):\n    print(number, router)`,
      type: "Type the `# LATENCY:` note and the traceroute lab.",
      chk: [["a # LATENCY: note about delay and hops", note("LATENCY", ["delay|slow|time|wait|lag|speed", "hop|router|path|distance"]), 1, "comments"], ["numbering the hops with enumerate", /for\s+number\s*,\s*router\s+in\s+enumerate\(\s*detour\s*,\s*1\s*\)\s*:/]],
      run: "A numbered list of every hop on the detour.", runChk: [["TRACEROUTE printed", /^TRACEROUTE$/], ["hop number 1 printed", /^1 \w+/]] },
    { title: "Check-in: three quick answers",
      say: ["Short answers in comments at the bottom, exactly like this:", "**1.** What is one step a packet takes from router to router called?  **2.** What do you call a network that keeps working when one part fails?  **3.** In the school network, why did the detour have more hops?"],
      add: `\n# ANSWER 1: a hop\n# ANSWER 2: fault tolerant\n# ANSWER 3: router A was down so it had to go the long way around`,
      type: "Type the three `# ANSWER` lines.",
      chk: [["answer 1 is a hop", /^\s*ANSWER 1:.*\bhop/i, 1, "comments"], ["answer 2 says fault tolerant or redundant", /^\s*ANSWER 2:.*(?:fault|toleran|redundan|resilien|reliab)/i, 1, "comments"], ["answer 3 says the direct path was unavailable", /^\s*ANSWER 3:.*(?:down|broken|fail|long|around|other|different|another|detour|reroute)/i, 1, "comments"]] },
    { title: "Boss round: a different storm",
      say: ["Change the broken router and watch the network adapt. Change `broken = \"Router A\"` to **`\"Router B\"`** and run again. Router B was not on the first route, so what happens to the detour?"],
      edit: [["broken = \"Router A\"", "broken = \"Router B\""]],
      type: "Change the `broken = ...` line to `\"Router B\"`.",
      chk: [["broken is Router B", /^\s*broken\s*=\s*["']Router B["']/m]],
      run: "The packet still gets through.", runChk: [["a detour is still found", /Detour: Laptop[\w >]+ISP/]] }
  ],
  finish: ["Run everything once more. No red errors.", "When every box is green and the checker says 100%, click **Submit** to unlock **Mission 10.6: Storm Warning**."],
  challenges: ["Break **both** Router A and Router C. What does `find_path` return? What would a real router do?", "Add a new link of your own to `links` (for example Phone to Router B) and see if any route gets shorter.", "Print how many neighbors each router has using a loop over `graph`."],
  tips: {
    notes: { title: "How to write good notes here", sections: [
      { p: "A note is a **comment**: a line that starts with `#`. Python ignores it, but the auto-checker reads it." },
      { list: ["Start with the label in capital letters and a colon, like `# ROUTER:`.", "Write the idea **in your own words** and keep the **bold key words** from the briefing.", "One line per note.", "Your notes become your AP study guide."] },
      { good: "If a box stays unchecked, open **still missing** under the score to see which key idea your note left out." }
    ] },
    routerhelp: { title: "Routers, switches and hops", sections: [
      { rows: [["Switch", "connects devices inside one network", "like a local hallway"], ["Router", "connects different networks and picks the next hop", "like an intersection"], ["Hop", "one handoff from a router to the next", "Hops: 3 means 3 handoffs"], ["Path", "the list of devices a packet visits", "Laptop > Switch > Router A > ISP"]] }
    ] },
    bfs: { title: "How find_path works", sections: [
      { p: "`queue` holds **paths** to try. It starts with one path: just the start. Each time around the `while` loop:" },
      { steps: ["Take the **first** path off the queue (`pop(0)`).", "Look at its **last** node (`path[-1]`).", "If that node is the **destination**, you are done: return the path.", "Otherwise add a **longer path** for every neighbor not **seen** yet, and mark those neighbors seen."] },
      { good: "Because the shortest paths are tried first, the first route found has the **fewest hops**. If the queue empties, there is no route and the function returns `None`." }
    ] }
  }
}, { unit: UNIT, num: 3, points: 50, seq: 6, passMin: 100 });

/* ================================================================= MISSION ================ */
M.legacyMission("a106", {
  num: 3, title: "Mission 10.6: Storm Warning",
  intro: ["**EMERGENCY ALERT.** A giant storm is rolling over the school. Routers are about to go down one by one. As **Route Engineer** you must build the program that **finds the best route, reroutes around damage, and tells you when the school is cut off**.",
    "You will write **four functions** (build a graph, find a path, count hops, remove a router) and a live **storm simulator** that animates the packet's journey. Built-in tests give instant **PASS** or **FAIL** feedback.",
    "**Scoring:** worth **100 points**. **90%** lets you turn it in for 90 points, or finish at **100%** for full points."],
  learn: ["dictionaries of lists", "queues and loops", "graph search", "fault tolerance"],
  firstTips: ["m_howto", "b_debug"],
  autoRun: [{ answers: [["storm", "Router A"], ["storm", "Router C"], ["storm", "done"]] }],
  stages: [
    { title: "Report for duty",
      say: ["Bring in the toolkit, print the alert banner, and add the **test line** at the very bottom. Everything you write goes **above** that line."],
      help: ["m_howto"],
      ref: `import netlab\n\nnetlab.banner("MISSION 10.6", "Storm Warning")\n\nnetlab.run_mission("10.6", globals())`,
      type: "Type the import, the banner and the `netlab.run_mission(...)` line at the bottom.",
      chk: [["import netlab", /^\s*import\s+netlab\b/m], ["the mission banner", /netlab\.banner\(\s*["']MISSION 10\.6["']/], ["the mission test line", /netlab\.run_mission\(\s*["']10\.6["']\s*,\s*globals\(\s*\)\s*\)/]],
      run: "Every function shows as MISSING. That is your to-do list.", runChk: [["the banner printed", /MISSION 10\.6/], ["the tests ran", /RUNNING THE MISSION TESTS/]] },
    { title: "Task 1: Draw the graph",
      say: ["Write **`build_graph(links)`**. It takes a list of links like `[(\"A\", \"B\"), (\"B\", \"C\")]` and returns a **dictionary**: every device points to a **list of its neighbors**. For those two links the answer is `{\"A\": [\"B\"], \"B\": [\"A\", \"C\"], \"C\": [\"B\"]}`.",
        "Links go **both ways**: when you add `B` to `A`'s list, also add `A` to `B`'s list. Make sure a device has an empty list **before** you append to it. An empty list of links gives an empty dictionary."],
      help: ["hint_graph", "b_dict"],
      refEdit: [["netlab.run_mission(\"10.6\", globals())", `def build_graph(links):\n    graph = {}\n    for a, b in links:\n        if a not in graph:\n            graph[a] = []\n        if b not in graph:\n            graph[b] = []\n        graph[a].append(b)\n        graph[b].append(a)\n    return graph\n\nnetlab.run_mission("10.6", globals())`]],
      type: "Write `build_graph(links)` above the last line.",
      chk: [["a function named build_graph with one parameter", FN("build_graph")], ["looping over the links", /for\s+\w+\s*,\s*\w+\s+in\s+links\s*:/], ["adding neighbors with append", /\.append\([\s\S]*\.append\(/], ["returning the graph", /return\s+graph/]],
      run: "Aim for 3 PASS lines for build_graph.", runChk: [["all 3 build_graph tests pass", /PASS\s+build_graph/, 3]] },
    { title: "Task 2: Find the best route",
      say: ["Write **`find_path(graph, start, end)`**. It returns the route with the **fewest hops** as a **list of device names** (for example `[\"Laptop\", \"Switch\", \"Router A\", \"ISP\"]`), or **`None`** if there is no route at all.",
        "Use the breadth-first idea from your walkthrough: a **queue** of paths that starts as `[[start]]`, a **seen** list, and a `while` loop. If `start` equals `end` the route is just `[start]`.",
        "Be careful with devices that have no neighbors: use `graph.get(node, [])` instead of `graph[node]` so a missing name does not crash."],
      help: ["bfs2", "hint_path", "b_list"],
      refEdit: [["netlab.run_mission(\"10.6\", globals())", `def find_path(graph, start, end):\n    queue = [[start]]\n    seen = [start]\n    while len(queue) > 0:\n        path = queue.pop(0)\n        node = path[-1]\n        if node == end:\n            return path\n        for neighbor in graph.get(node, []):\n            if neighbor not in seen:\n                seen.append(neighbor)\n                queue.append(path + [neighbor])\n    return None\n\nnetlab.run_mission("10.6", globals())`]],
      type: "Write `find_path(graph, start, end)` above the last line.",
      chk: [["a function named find_path with three parameters", FN("find_path", "\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+")], ["a queue that starts with the start", /\[\s*\[\s*\w+\s*\]\s*\]/], ["a while loop and pop(0)", /while\b[\s\S]*\.pop\(\s*0\s*\)/], ["checking the neighbors of each node", /for\s+\w+\s+in\s+graph(?:\[\s*\w+\s*\]|\.get\()/], ["returning None when there is no route", /return\s+None/]],
      run: "Aim for 5 PASS lines for find_path.", runChk: [["all 5 find_path tests pass", /PASS\s+find_path/, 5]] },
    { title: "Task 3: Count the hops",
      say: ["Write **`count_hops(path)`**. A route with 4 devices has **3 hops**, so the answer is the number of devices minus 1. A route with one device has 0 hops. And if the path is **`None`** (no route), return **-1**.",
        "Use `if path is None:` for the special case."],
      refEdit: [["netlab.run_mission(\"10.6\", globals())", `def count_hops(path):\n    if path is None:\n        return -1\n    return len(path) - 1\n\nnetlab.run_mission("10.6", globals())`]],
      type: "Write `count_hops(path)` above the last line.",
      chk: [["a function named count_hops with one parameter", FN("count_hops")], ["handling None", /\bNone\b/], ["counting with len(path) - 1", /len\(\s*\w+\s*\)\s*-\s*1/]],
      run: "Aim for 3 PASS lines for count_hops.", runChk: [["all 3 count_hops tests pass", /PASS\s+count_hops/, 3]] },
    { title: "Task 4: Knock out a router",
      say: ["Write **`remove_router(graph, name)`**. It returns a **new** graph without that router: the router is **not a key** any more, and it is **removed from every other router's neighbor list**.",
        "Plan: start with an empty `new_graph = {}`. Loop over every `device` in the graph. Skip the broken one. For all the others, build a new neighbor list that leaves the broken router out, and store it."],
      help: ["hint_remove", "b_dict"],
      refEdit: [["netlab.run_mission(\"10.6\", globals())", `def remove_router(graph, name):\n    new_graph = {}\n    for device in graph:\n        if device != name:\n            neighbors = []\n            for other in graph[device]:\n                if other != name:\n                    neighbors.append(other)\n            new_graph[device] = neighbors\n    return new_graph\n\nnetlab.run_mission("10.6", globals())`]],
      type: "Write `remove_router(graph, name)` above the last line.",
      chk: [["a function named remove_router with two parameters", FN("remove_router", "\\w+\\s*,\\s*\\w+")], ["a new empty graph", /\w+\s*=\s*\{\s*\}/], ["looping over the devices and their neighbors", /for\s+\w+\s+in\s+graph\s*:[\s\S]*for\s+\w+\s+in\s+graph\[/], ["returning the new graph", /return\s+\w+/]],
      run: "Aim for 3 PASS lines for remove_router.", runChk: [["all 3 remove_router tests pass", /PASS\s+remove_router|PASS\s+the router is gone|PASS\s+nobody links|PASS\s+everything else/, 3]] },
    { title: "Task 5: The storm simulator",
      say: ["Put it together. Load the school map with `nodes, links = netlab.school_network()` and build the graph. Find the route from `\"Laptop\"` to `\"ISP\"` and print it as `ROUTE: Laptop > Switch > Router A > ISP (3 hops)` (join the path with `\" > \"` and use `count_hops`). Animate the packet with `netlab.animate_packet(nodes, links, path)`.",
        "Then start the storm. **Keep asking** `Which router does the storm hit (or done)? ` until the user types `done`. Each time: remove that router from the graph (`graph = remove_router(graph, victim)`) and find the route again. If there is **no route** (`None`), print `NO ROUTE: the Internet is cut off!`. Otherwise print `REROUTED: ` then the new route and hops, in the same style.",
        "The grader will hit `Router A`, then `Router C`, then `done`. Put this code **above** the `netlab.run_mission` line and **below** your four functions."],
      help: ["hint_storm", "b_menu"],
      refEdit: [["netlab.run_mission(\"10.6\", globals())", `nodes, links = netlab.school_network()\ngraph = build_graph(links)\npath = find_path(graph, "Laptop", "ISP")\nprint("ROUTE: " + " > ".join(path) + " (" + str(count_hops(path)) + " hops)")\nnetlab.animate_packet(nodes, links, path)\nwhile True:\n    victim = input("Which router does the storm hit (or done)? ")\n    if victim == "done":\n        break\n    graph = remove_router(graph, victim)\n    path = find_path(graph, "Laptop", "ISP")\n    if path is None:\n        print("NO ROUTE: the Internet is cut off!")\n    else:\n        print("REROUTED: " + " > ".join(path) + " (" + str(count_hops(path)) + " hops)")\n        netlab.animate_packet(nodes, links, path, title=victim + " is down")\n\nnetlab.run_mission("10.6", globals())`]],
      type: "Write the storm simulator above the last line.",
      chk: [["loading the school network and building the graph", /netlab\.school_network\(\s*\)[\s\S]*build_graph\(/], ["a while loop that asks which router the storm hits", /\bwhile\b[\s\S]*\binput\([\s\S]*["']done["'][\s\S]*\bbreak\b/], ["removing the router that was hit", /remove_router\(\s*graph\s*,\s*\w+\s*\)/], ["finding a new route after each storm", /find_path\([\s\S]*find_path\(/], ["handling the case where there is no route", /is\s+None|==\s*None/], ["animating the packet", /netlab\.animate_packet\(/]],
      run: "Hit a router or two while you test. The grader uses its own storm.", runChk: [["the first route was printed", /ROUTE: Laptop > Switch > Router A > ISP \(3 hops\)/], ["the packet was rerouted after Router A fell", /REROUTED: Laptop > Switch > Router B > Router C > ISP \(4 hops\)/], ["the Internet was cut off after Router C fell", /NO ROUTE: the Internet is cut off!/]] },
    { title: "All clear?",
      say: ["Run the whole program and read the **MISSION REPORT**. All **14 tests** should pass and you should see **\\*\\*\\* MISSION COMPLETE \\*\\*\\***. If something says FAIL, read what was expected, fix it, and run again."],
      type: "Run the whole program and fix anything that says FAIL.",
      chk: [],
      run: "Aim for MISSION COMPLETE.", runChk: [["all 14 tests passed", /Tests passed:\s*14 of 14/], ["MISSION COMPLETE", /MISSION COMPLETE/]] }
  ],
  challenges: ["Add a **Phone to Server** route report to the simulator.", "Add a function `all_neighbors_count(graph)` that returns the router with the most links.", "Let the user also **repair** a router (put it back) by rebuilding the graph from `links`."],
  tips: {
    m_howto: { title: "How missions work", sections: [
      { p: "A **mission** is a small program you build yourself. Built-in tests check your work and print **PASS** or **FAIL** for every case." },
      { steps: ["Read the task. It names the function you must write and what it returns.", "Write the function **above** the last line (`netlab.run_mission(...)`).", "Press **Run** and read every FAIL: it shows what you returned and what was expected.", "Fix and run again until you see MISSION COMPLETE."] },
      { good: "**90%** lets you turn it in and move on. **100%** is full points." },
      { warn: "Function and parameter names must match the brief exactly, with the same capital letters and underscores." }
    ] },
    bfs2: { title: "The queue idea (how find_path works)", sections: [
      { p: "`queue` holds **paths** to try. It starts with one path: just the start." },
      { steps: ["Take the **first** path off the queue (`queue.pop(0)`).", "Look at its **last** node (`path[-1]`).", "If that node is the destination, return the path.", "Otherwise, for every **neighbor not seen yet**: mark it seen and add a longer path (`path + [neighbor]`) to the queue.", "If the queue becomes empty, there is no route: return `None`."] }
    ] },
    hint_graph: { title: "Hint: build_graph", sections: [{ ex: ["def build_graph(links):", "    graph = {}", "    for a, b in links:", "        if a not in graph:", "            graph[a] = []", "        # do the same for b", "        graph[a].append(b)", "        # and add a to b's list too", "    return graph"] }] },
    hint_path: { title: "Hint: find_path", sections: [{ ex: ["def find_path(graph, start, end):", "    queue = [[start]]", "    seen = [start]", "    while len(queue) > 0:", "        path = queue.pop(0)", "        node = path[-1]", "        # if node is the end, return path", "        for neighbor in graph.get(node, []):", "            # if not seen: mark it seen and queue path + [neighbor]", "    return None"] }] },
    hint_remove: { title: "Hint: remove_router", sections: [{ ex: ["def remove_router(graph, name):", "    new_graph = {}", "    for device in graph:", "        if device != name:", "            neighbors = []", "            for other in graph[device]:", "                # keep other if it is not the broken router", "            new_graph[device] = neighbors", "    return new_graph"] }] },
    hint_storm: { title: "Hint: the storm simulator", sections: [{ ex: ["nodes, links = netlab.school_network()", "graph = build_graph(links)", "path = find_path(graph, \"Laptop\", \"ISP\")", "print(\"ROUTE: \" + \" > \".join(path) + \" (\" + str(count_hops(path)) + \" hops)\")", "netlab.animate_packet(nodes, links, path)", "while True:", "    victim = input(\"Which router does the storm hit (or done)? \")", "    # done? break.  Otherwise: graph = remove_router(graph, victim)", "    # find the path again; None means NO ROUTE, otherwise print REROUTED"] }] }
  }
}, { unit: UNIT, num: 3, points: 100, seq: 6.5, part: "mission", passMin: 90 });
