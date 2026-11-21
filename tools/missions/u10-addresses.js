/* UNIT 10: THE INTERNET. Pair 1: Internet Addresses (CodeHS 10.3).
   Walkthrough (50 points): notes + labs.  Mission (100 points): The Network Club Bouncer.  */
"use strict";
const M = require("./core.js");
const UNIT = "Unit 10: The Internet";

/* a note check: the line must start with the label and contain every group of key words (any word in a group counts) */
const note = (label, groups) => new RegExp("^\\s*" + label + ":" + groups.map((g) => "(?=.*(?:" + g + "))").join("") + ".*\\S", "i");

const BINARY_TIP = { title: "Binary place values", sections: [
      { p: "In **binary** every digit (bit) is 0 or 1, and each position is worth double the one to its right." },
      { ex: ["place value:  128  64  32  16   8   4   2   1", "192 is:         1   1   0   0   0   0   0   0     (128 + 64 = 192)", "10 is:          0   0   0   0   1   0   1   0     (8 + 2 = 10)", "255 is:         1   1   1   1   1   1   1   1     (all of them)"] },
      { rows: [["format(number, \"08b\")", "8-digit binary text", "pads with zeros on the left"], ["2 ** 8", "256", "how many values 8 bits can hold (0 to 255)"], ["2 ** 32", "4294967296", "IPv4 addresses"]] },
      { good: "Eight bits can make **256** different values, 0 through 255. That is exactly why each octet stops at 255." }
    ] };

/* ================================================================= WALKTHROUGH ================ */
M.addWalkthrough("a101", {
  num: 1, title: "Internet Addresses (10.3)",
  intro: ["**INCOMING TRANSMISSION from NetOps HQ:** Welcome aboard, rookie. Every device on the Internet needs an **address**, or no data could ever find it. Today you train as an **Address Analyst**.",
    "In about 25 minutes you will take **notes**, decode real addresses into **binary**, and write your first address tools. Hit **100%** on the auto-checker and **Mission 10.3: The Network Club Bouncer** unlocks.",
    "**How this works:** read each briefing, then type your notes as `#` comments. Type them in your own words, but keep the key words in bold. Run the labs and read what they print."],
  learn: ["what an IP address is", "IPv4 and IPv6", "binary and bits", "public, private and loopback addresses", "how addresses are handed out"],
  firstTips: ["notes", "b_typing"],
  stages: [
    { title: "Briefing 1: What is an IP address?",
      say: ["An **IP address** (Internet Protocol address) is a **unique number** that **identifies** one **device** on a network. It works like the address on a house: the post office needs it to know where to deliver. Phones, laptops, game consoles, the school server: every one has an address.",
        "Every chunk of data you send carries **two addresses**: the **source** (who sent it) and the **destination** (where it is going). Routers read the destination to decide where to send it next.",
        "**Type your first note.** Start the line with `# IP ADDRESS:` and mention that it is a unique number that identifies a device."],
      help: ["notes"],
      add: `# NOTES: Internet Addresses (10.3)\n# IP ADDRESS: a unique number that identifies each device on a network so data knows where to go`,
      type: "Type these two comment lines at the top of the code box. (You can reword the second one, but keep **device** and **unique**.)",
      chk: [["a # IP ADDRESS: note about a unique number that identifies a device", note("IP ADDRESS", ["device|computer|machine|phone|host", "unique|identif|label|number"]), 1, "comments"]] },
    { title: "Lab 1: Meet an address",
      say: ["Time to touch one. In Python an address is just **text** like `\"192.168.1.10\"`. The dots split it into four parts. `ip.split(\".\")` cuts the text at every dot and gives back a **list** of the parts.", "Type this lab under your notes and run it."],
      help: ["b_list"],
      add: `\nip = "192.168.1.10"\nprint("Address:", ip)\nparts = ip.split(".")\nprint("Parts:", parts)\nprint("How many parts?", len(parts))`,
      type: "Type the lab lines below your notes.",
      chk: [["an ip variable that holds an address", /^\s*ip\s*=\s*["'][\d.]+["']/m], ["splitting the address at the dots", /\.split\(\s*["']\.["']\s*\)/]],
      run: "You should see the four parts printed as a list.", runChk: [["the program counted 4 parts", /How many parts\? 4/]] },
    { title: "Briefing 2: IPv4 is 32 bits",
      say: ["The address you just split is an **IPv4** address. It has **four numbers** called **octets**, each from 0 to 255. Each octet is **8 bits** (one byte), so the whole address is 4 times 8 = **32 bits**.",
        "A **bit** is a single 0 or 1. Computers store everything in **binary** (base 2), so every number in an address is really a pattern of eight 0s and 1s.",
        "Type your note, then run the lab. It converts each octet to binary, and `netlab.ip_card` draws the 32 bits as little lights (a lit square is a 1)."],
      help: ["binary"],
      edit: [["ip = \"192.168.1.10\"", "import netlab\n\nip = \"192.168.1.10\""]],
      add: `\n# IPV4: an address has four numbers called octets and each octet is 8 bits so the address is 32 bits in all\nfor part in parts:\n    number = int(part)\n    print(number, "in binary is", format(number, "08b"))\nnetlab.ip_card(ip)`,
      type: "Add `import netlab` above the `ip = ...` line, then type the `# IPV4:` note and the loop at the bottom.",
      chk: [["import netlab", /^\s*import\s+netlab\b/m], ["a # IPV4: note that says 32 bits", note("IPV4", ["\\b32\\b", "octet|four|\\b4\\b|bit|\\b8\\b"]), 1, "comments"], ["a loop that prints each octet in binary", /format\(\s*number\s*,\s*["']08b["']\s*\)/]],
      run: "Four lines of binary and a picture of the 32 bits.", runChk: [["each octet printed as 8 binary digits (four lines)", /\d+ in binary is [01]{8}/, 4]] },
    { title: "Briefing 3: Running out of addresses",
      say: ["With 32 bits there are 2 to the power of 32 = **4,294,967,296** possible IPv4 addresses. That sounds like a lot, but there are more **devices** than that, so the world **ran out**.",
        "The fix is **IPv6**. It uses **128 bits**, written as eight groups of hexadecimal like `2001:0db8:85a3::8a2e:0370:7334`. That gives 2 to the power of 128, about 340 undecillion addresses. We will not run out of those.",
        "Type the note, then let Python calculate both numbers."],
      help: ["b_fstr"],
      add: `\n# IPV6: the newer version uses 128 bits so there are far more addresses and we will not run out\nprint("IPv4 addresses:", 2 ** 32)\nprint("IPv6 addresses:", 2 ** 128)`,
      type: "Type the `# IPV6:` note and the two print lines at the bottom.",
      chk: [["an # IPV6: note that says 128 bits", note("IPV6", ["\\b128\\b"]), 1, "comments"], ["calculating 2 ** 32 and 2 ** 128", /2\s*\*\*\s*32[\s\S]*2\s*\*\*\s*128/]],
      run: "Compare the two huge numbers.", runChk: [["the IPv4 count is 4294967296", /IPv4 addresses: 4294967296/], ["the IPv6 count is 340282366920938463463374607431768211456", /IPv6 addresses: 340282366920938463463374607431768211456/]] },
    { title: "Briefing 4: Binary by hand",
      say: ["How does `192` become `11000000`? Each bit position is worth a **power of 2**, from left to right: **128, 64, 32, 16, 8, 4, 2, 1**. A 1 means \"add this place value\". For 192: 128 + 64 = 192, so the first two bits are 1 and the rest are 0.",
        "You can do it with a loop: go through the place values from biggest to smallest. If the number is at least that big, write a 1 and **subtract** the place value. Otherwise write a 0."],
      help: ["binary"],
      add: `\n# BINARY: each bit is a place worth 128 64 32 16 8 4 2 or 1 and you add up the places that hold a 1\nnumber = 192\nbinary = ""\nfor place in [128, 64, 32, 16, 8, 4, 2, 1]:\n    if number >= place:\n        binary = binary + "1"\n        number = number - place\n    else:\n        binary = binary + "0"\nprint("192 by hand is", binary)`,
      type: "Type the `# BINARY:` note and the place-value loop at the bottom.",
      chk: [["a # BINARY: note about place values or powers of 2", note("BINARY", ["128|bit|place|power|\\btwo\\b|\\b2\\b"]), 1, "comments"], ["a loop over the place values 128 down to 1", /for\s+place\s+in\s+\[\s*128\s*,\s*64\s*,\s*32\s*,\s*16\s*,\s*8\s*,\s*4\s*,\s*2\s*,\s*1\s*\]\s*:/], ["an if / else that writes a 1 or a 0", /if\s+number\s*>=\s*place\s*:[\s\S]*else\s*:/]],
      run: "Your loop should get the same answer Python's format gave.", runChk: [["192 by hand is 11000000", /192 by hand is 11000000/]] },
    { title: "Briefing 5: Public, private and loopback",
      say: ["Not every address works the same way. **Private** addresses (starting with `10.`, `172.16` to `172.31`, or `192.168.`) are used **inside** a home or school network. They are **not** reachable from the Internet, and thousands of networks reuse the same ones.",
        "**Public** addresses are **unique across the whole Internet**. Your ISP gives your router one, and the router shares it with all your private devices (that trick is called **NAT**).",
        "The special address `127.0.0.1` is **loopback**: it always means **this computer** (also called `localhost`). Data sent there never leaves your machine.",
        "Type both notes. Then write a **function** that sorts addresses into these types."],
      help: ["b_funcs"],
      add: `\n# PRIVATE: addresses like 192.168.x.x are used inside a home or school network and are not reachable from the internet\n# PUBLIC: addresses that are unique across the whole internet and are given out by your ISP\ndef address_type(ip):\n    if ip.startswith("127."):\n        return "loopback"\n    elif ip.startswith("10.") or ip.startswith("192.168."):\n        return "private"\n    else:\n        return "public"\n\nprint(address_type("192.168.1.10"))\nprint(address_type("8.8.8.8"))\nprint(address_type("127.0.0.1"))`,
      type: "Type the two notes, then the `address_type` function and its three test prints.",
      chk: [["a # PRIVATE: note about addresses inside a network", note("PRIVATE", ["192\\.168|10\\.|172|inside|local|home|school|network|not"]), 1, "comments"], ["a # PUBLIC: note about unique internet addresses", note("PUBLIC", ["internet|unique|world|anywhere|isp|outside"]), 1, "comments"], ["a function named address_type", /^def\s+address_type\(\s*ip\s*\)\s*:/m], ["an if / elif / else that returns a type", /return\s+["']loopback["'][\s\S]*return\s+["']private["'][\s\S]*return\s+["']public["']/]],
      run: "Three lines: private, public, loopback.", runChk: [["192.168.1.10 is private", /^private$/], ["8.8.8.8 is public", /^public$/], ["127.0.0.1 is loopback", /^loopback$/]] },
    { title: "Briefing 6: Who hands out addresses?",
      say: ["Addresses are given out in layers. A global group (**IANA**) hands big blocks to regional registries, which hand them to **ISPs** (Internet Service Providers). Your ISP gives your router a public address.",
        "Inside your home, your router runs **DHCP** (Dynamic Host Configuration Protocol). When a device joins the Wi-Fi, DHCP **automatically assigns** it a **temporary** private address (a \"lease\"). That is why your phone's address can change.",
        "Type one more note."],
      add: `\n# DHCP: the router automatically assigns each device a temporary private address when it joins the network`,
      type: "Type the `# DHCP:` note at the bottom.",
      chk: [["a # DHCP: note about automatically assigning addresses", note("DHCP", ["assign|give|automatic|temporar|lease|router|hand"]), 1, "comments"]] },
    { title: "Check-in: three quick answers",
      say: ["Prove you were paying attention. Answer in short comments at the bottom. Use exactly this layout:",
        "**1.** How many bits are in ONE IPv4 octet?  **2.** What does the address `127.0.0.1` mean?  **3.** Why did the world need IPv6?"],
      add: `\n# ANSWER 1: 8\n# ANSWER 2: loopback it means this computer\n# ANSWER 3: the world ran out of IPv4 addresses`,
      type: "Type the three `# ANSWER` lines with your answers.",
      chk: [["answer 1 is 8", /^\s*ANSWER 1:.*\b8\b/i, 1, "comments"], ["answer 2 mentions loopback or this computer", /^\s*ANSWER 2:.*(?:loopback|this computer|localhost|itself|my computer|local)/i, 1, "comments"], ["answer 3 says we ran out of addresses", /^\s*ANSWER 3:.*(?:ran out|run out|not enough|too many|more devices|enough addresses|bigger|128)/i, 1, "comments"]] },
    { title: "Boss round: decode a new address",
      say: ["Your labs work for **any** address. Change the address at the top of Lab 1 to **`172.16.254.1`** and run your whole program again. Read the binary it prints. (`172.16.254.1` is a private address. Which range is it in?)"],
      edit: [["ip = \"192.168.1.10\"", "ip = \"172.16.254.1\""]],
      type: "Change the `ip = ...` line to `ip = \"172.16.254.1\"`.",
      chk: [["the ip variable is 172.16.254.1", /^\s*ip\s*=\s*["']172\.16\.254\.1["']/m]],
      run: "The same lab now decodes the new address.", runChk: [["172 is 10101100", /172 in binary is 10101100/], ["254 is 11111110", /254 in binary is 11111110/]] }
  ],
  finish: ["Run your whole file one more time and make sure nothing shows a red error.", "When every box is green and the checker says 100%, click **Submit**. That unlocks **Mission 10.3: The Network Club Bouncer**."],
  challenges: ["Add `print(address_type(\"172.20.0.5\"))`. Your function says `public`, but that address is **private**. Why? (Hint: `172.16` to `172.31`.) The Mission fixes this.", "Print how many bits are in 8 octets of IPv6: 8 groups of 16 bits.", "Change `number = 192` in the by-hand lab to `number = 255`. What binary do you get?"],
  tips: {
    notes: { title: "How to write good notes here", sections: [
      { p: "Each briefing tells you what to write. A note is a **comment**: a line that starts with `#`. Python ignores it, but the auto-checker reads it." },
      { list: ["Start with the label in capital letters and a colon, like `# IP ADDRESS:`.", "Then write the idea **in your own words**. The checker looks for the **key words** that are in bold in the briefing.", "Keep each note to one line.", "Your notes become a study guide for the AP exam. Make them useful to future you."] },
      { good: "If a box stays unchecked, open **still missing** under the score. It tells you which key idea your note left out." }
    ] },
    binary: BINARY_TIP
  }
}, { unit: UNIT, num: 1, points: 50, seq: 3, passMin: 100 });

/* ================================================================= MISSION ================ */
const FN = (name) => new RegExp("^def\\s+" + name + "\\(\\s*\\w+\\s*\\)\\s*:", "m");
M.addMission("a102", {
  num: 1, title: "Mission 10.3: The Network Club Bouncer",
  intro: ["**CLASSIFIED MISSION BRIEF.** The hottest spot on the Internet is **Network Club**, and its owner needs a bouncer. Guests do not show ID. They show an **IP address**, and only **valid** ones get in.",
    "You will write the bouncer's brain: **four functions** (checking, converting, classifying and counting addresses) and a **guest line** that decides who is admitted. Built-in tests give you **instant PASS or FAIL** feedback, like a real engineer.",
    "**Scoring:** this mission is worth **100 points**. Reach **90%** on the auto-checker to turn it in for 90 points and open the next training, or finish at **100%** for full points."],
  learn: ["functions with parameters and return values", "splitting and checking strings", "lists, loops and selection", "IPv4, binary and address types"],
  firstTips: ["m_howto", "b_debug"],
  autoRun: [{ answers: [["guest", "192.168.1.10"], ["guest", "300.1.1.1"], ["guest", "8.8.8.8"], ["guest", "done"]] }],
  stages: [
    { title: "Report for duty",
      say: ["Every mission starts the same way. Bring in the toolkit, print the mission banner, and add the **test line** that grades your work at the very bottom. You will write all your functions **above** that last line.",
        "Type these three lines. Run it right away: the tests will say **MISSING** for every function. That is your to-do list."],
      help: ["m_howto"],
      ref: `import netlab\n\nnetlab.banner("MISSION 10.3", "The Network Club Bouncer")\n\nnetlab.run_mission("10.3", globals())`,
      type: "Type the toolkit import, the banner, and the `netlab.run_mission(...)` line at the bottom.",
      chk: [["import netlab", /^\s*import\s+netlab\b/m], ["the mission banner", /netlab\.banner\(\s*["']MISSION 10\.3["']/], ["the mission test line", /netlab\.run_mission\(\s*["']10\.3["']\s*,\s*globals\(\s*\)\s*\)/]],
      run: "You should see the banner and a list of MISSING functions.", runChk: [["the banner printed", /MISSION 10\.3/], ["the tests ran", /RUNNING THE MISSION TESTS/]] },
    { title: "Task 1: Is this a valid address?",
      say: ["Write **`is_valid_ip(ip)`**. It takes the text of an address and returns **True** if it is a valid IPv4 address and **False** if not. A valid address has:",
        "**1.** exactly **four parts** when split at the dots, **2.** every part made only of **digits** (use `.isdigit()`), and **3.** every part a number from **0 to 255**.",
        "Examples: `\"192.168.1.10\"` is True. `\"256.1.1.1\"`, `\"1.2.3\"`, `\"a.b.c.d\"` and `\"\"` are all False.",
        "Put the function **above** the `netlab.run_mission` line, then run. The tests print PASS or FAIL for 8 addresses."],
      help: ["hint_valid", "b_funcs"],
      refEdit: [["netlab.run_mission(\"10.3\", globals())", `def is_valid_ip(ip):\n    parts = ip.split(".")\n    if len(parts) != 4:\n        return False\n    for part in parts:\n        if not part.isdigit():\n            return False\n        if int(part) > 255:\n            return False\n    return True\n\nnetlab.run_mission("10.3", globals())`]],
      type: "Write the `is_valid_ip(ip)` function above the last line.",
      chk: [["a function named is_valid_ip with one parameter", FN("is_valid_ip")], ["splitting the address at the dots", /\.split\(\s*["']\.["']\s*\)/], ["checking each part with isdigit()", /\.isdigit\(\s*\)/], ["checking the 255 limit", /\b255\b/], ["returning True or False", /return\s+True[\s\S]*return\s+False|return\s+False[\s\S]*return\s+True/]],
      run: "Aim for 8 PASS lines for is_valid_ip.", runChk: [["all 8 is_valid_ip tests pass", /PASS\s+is_valid_ip/, 8]] },
    { title: "Task 2: Show the bits",
      say: ["Write **`ip_to_binary(ip)`**. It returns the address as **four 8-bit groups** joined with dots. For example `ip_to_binary(\"192.168.1.10\")` returns the text `\"11000000.10101000.00000001.00001010\"`.",
        "Plan: make an empty **list**, **loop** through the parts, add each part's 8-bit binary to the list (remember `format(number, \"08b\")` and `int(...)`), then glue the list together with `\".\".join(your_list)`."],
      help: ["hint_binary", "binary"],
      refEdit: [["netlab.run_mission(\"10.3\", globals())", `def ip_to_binary(ip):\n    pieces = []\n    for part in ip.split("."):\n        pieces.append(format(int(part), "08b"))\n    return ".".join(pieces)\n\nnetlab.run_mission("10.3", globals())`]],
      type: "Write the `ip_to_binary(ip)` function above the last line.",
      chk: [["a function named ip_to_binary with one parameter", FN("ip_to_binary")], ["an 8-bit binary conversion", /["']08b["']|\b0?8b\b/], ["gluing the pieces with .join", /\.join\(/]],
      run: "Aim for 4 PASS lines for ip_to_binary.", runChk: [["all 4 ip_to_binary tests pass", /PASS\s+ip_to_binary/, 4]] },
    { title: "Task 3: Public, private or loopback?",
      say: ["Write **`address_type(ip)`**. It returns the text `\"loopback\"`, `\"private\"` or `\"public\"`.",
        "**loopback:** the first number is 127. **private:** the first number is 10, or the first number is 172 and the second is 16 to 31, or the first is 192 and the second is 168. **public:** everything else.",
        "Your walkthrough version missed the 172.16 to 172.31 range. Fix that this time. Hint: `int(parts[0])` gives the first number and `16 <= second <= 31` is a legal Python check."],
      help: ["hint_type", "b_funcs"],
      refEdit: [["netlab.run_mission(\"10.3\", globals())", `def address_type(ip):\n    parts = ip.split(".")\n    first = int(parts[0])\n    second = int(parts[1])\n    if first == 127:\n        return "loopback"\n    elif first == 10:\n        return "private"\n    elif first == 172 and 16 <= second <= 31:\n        return "private"\n    elif first == 192 and second == 168:\n        return "private"\n    else:\n        return "public"\n\nnetlab.run_mission("10.3", globals())`]],
      type: "Write the `address_type(ip)` function above the last line.",
      chk: [["a function named address_type with one parameter", FN("address_type")], ["an if / elif / else chain", /\bif\b[\s\S]*\belif\b[\s\S]*\belse\s*:/], ["returning loopback, private and public", /return\s+["']loopback["'][\s\S]*return\s+["']private["'][\s\S]*return\s+["']public["']/]],
      run: "Aim for 8 PASS lines for address_type.", runChk: [["all 8 address_type tests pass", /PASS\s+address_type/, 8]] },
    { title: "Task 4: How many addresses?",
      say: ["Write **`how_many_addresses(bits)`**. An address with that many bits can make **2 to the power of bits** different addresses. `how_many_addresses(32)` should return `4294967296` and `how_many_addresses(8)` should return `256`.",
        "This one is short. In Python the power operator is `**`."],
      refEdit: [["netlab.run_mission(\"10.3\", globals())", `def how_many_addresses(bits):\n    return 2 ** bits\n\nnetlab.run_mission("10.3", globals())`]],
      type: "Write the `how_many_addresses(bits)` function above the last line.",
      chk: [["a function named how_many_addresses with one parameter", FN("how_many_addresses")], ["using the ** power operator", /2\s*\*\*\s*\w+/]],
      run: "Aim for 4 PASS lines for how_many_addresses.", runChk: [["all 4 how_many_addresses tests pass", /PASS\s+how_many_addresses/, 4]] },
    { title: "Task 5: Open the door (the guest line)",
      say: ["Now put your functions to work. Guests arrive one at a time and type their address. The program keeps asking until the guest types `done`.",
        "For **every** guest: if the address is **valid**, print `ADMITTED: ` then the address, then the type in brackets, like `ADMITTED: 8.8.8.8 (public)`, and print the **binary** form on the next line, indented by two spaces. Show the picture with `netlab.ip_card(guest)`. If it is **not** valid, print `REJECTED: ` and the address.",
        "Keep two counters, `admitted` and `rejected`. After the line closes, print `Admitted: 2` and `Rejected: 1` (with the real counts). Put this loop **above** the `netlab.run_mission` line and **below** your four functions.",
        "The grader will send guests `192.168.1.10`, `300.1.1.1`, `8.8.8.8` and `done`."],
      help: ["hint_loop", "b_input", "b_menu"],
      refEdit: [["netlab.run_mission(\"10.3\", globals())", `admitted = 0\nrejected = 0\nwhile True:\n    entry = input("Next guest IP (or done): ")\n    if entry == "done":\n        break\n    if is_valid_ip(entry):\n        admitted = admitted + 1\n        print("ADMITTED: " + entry + " (" + address_type(entry) + ")")\n        print("  " + ip_to_binary(entry))\n        netlab.ip_card(entry)\n    else:\n        rejected = rejected + 1\n        print("REJECTED: " + entry)\nprint("Admitted: " + str(admitted))\nprint("Rejected: " + str(rejected))\n\nnetlab.run_mission("10.3", globals())`]],
      type: "Write the guest line (a `while` loop with `input`) above the last line.",
      chk: [["counters for admitted and rejected guests", /^\s*admitted\s*=\s*0[\s\S]*^\s*rejected\s*=\s*0/m], ["a while loop that keeps asking", /\bwhile\b[\s\S]*\binput\(/], ["stopping the loop when the guest types done", /["']done["'][\s\S]*\bbreak\b/], ["using is_valid_ip to decide who gets in", /if\s+is_valid_ip\(/], ["calling address_type and ip_to_binary for admitted guests", /address_type\([\s\S]*ip_to_binary\(|ip_to_binary\([\s\S]*address_type\(/]],
      run: "Type guests as you test. The grader will use its own guests.", runChk: [["a private guest was admitted", /ADMITTED:\s*192\.168\.1\.10\s*\(private\)/], ["a bad address was rejected", /REJECTED:\s*300\.1\.1\.1/], ["a public guest was admitted", /ADMITTED:\s*8\.8\.8\.8\s*\(public\)/], ["the counters printed", /Admitted:\s*2[\s\S]*Rejected:\s*1/]] },
    { title: "Mission complete?",
      say: ["Run the whole program. Read the **MISSION REPORT** at the bottom. When every test passes you will see **\\*\\*\\* MISSION COMPLETE \\*\\*\\***.",
        "If anything says FAIL, read what your function returned and what was expected, fix it, and run again. That loop (run, read, fix) is exactly how real engineers work."],
      type: "Run the whole program and fix anything that says FAIL.",
      chk: [],
      run: "Aim for the MISSION COMPLETE message.", runChk: [["all 24 tests passed", /Tests passed:\s*24 of 24/], ["MISSION COMPLETE", /MISSION COMPLETE/]] }
  ],
  challenges: ["Add a **VIP list**: a Python list of addresses that always get a special message.", "Count how many guests came from each address type with a dictionary.", "Make the club reject the **broadcast** address 255.255.255.255 too."],
  tips: {
    binary: BINARY_TIP,
    m_howto: { title: "How missions work", sections: [
      { p: "A **mission** is a small program you build yourself. Built-in tests check your work and print **PASS** or **FAIL** for every case, so you always know where you stand." },
      { steps: ["Read the task. Each task names the function you must write and what it must do.", "Write the function **above** the last line (`netlab.run_mission(...)`).", "Press **Run**. Read every FAIL: it shows what your function returned and what it should have returned.", "Fix and run again. Repeat until it says MISSION COMPLETE."] },
      { good: "The score bar tells you which tasks still need work. **90%** lets you turn it in and move on. **100%** is full points." },
      { warn: "Function names and parameter names must match the brief exactly, including capital letters and underscores." }
    ] },
    hint_valid: { title: "Hint: is_valid_ip", sections: [
      { p: "Stuck? Here is the plan as comments. Turn each comment into code." },
      { ex: ["def is_valid_ip(ip):", "    parts = ip.split(\".\")", "    # if there are not exactly 4 parts, return False", "    # loop through each part:", "    #     if the part is not all digits, return False", "    #     if int(part) is bigger than 255, return False", "    # if nothing was wrong, return True"] },
      { warn: "`\"abc\".isdigit()` is False, and `\"\".isdigit()` is False too. Check `isdigit()` BEFORE you call `int(...)`, or Python crashes on letters." }
    ] },
    hint_binary: { title: "Hint: ip_to_binary", sections: [
      { ex: ["def ip_to_binary(ip):", "    pieces = []                           # an empty list", "    for part in ip.split(\".\"):", "        # turn part into a number, then into 8-bit binary text", "        # add it to pieces with .append(...)", "    return \".\".join(pieces)               # glue with dots"] },
      { p: "`\".\".join([\"a\", \"b\"])` gives `\"a.b\"`. The text you join with goes BEFORE `.join`." }
    ] },
    hint_type: { title: "Hint: address_type", sections: [
      { ex: ["def address_type(ip):", "    parts = ip.split(\".\")", "    first = int(parts[0])", "    second = int(parts[1])", "    if first == 127:", "        return \"loopback\"", "    elif first == 10:", "        return \"private\"", "    elif first == 172 and 16 <= second <= 31:", "        return \"private\"", "    # keep going: the 192.168 rule, then everything else is public"] },
      { good: "`and` makes both sides true. `16 <= second <= 31` means second is between 16 and 31 inclusive." }
    ] },
    hint_loop: { title: "Hint: the guest line", sections: [
      { ex: ["admitted = 0", "rejected = 0", "while True:", "    entry = input(\"Next guest IP (or done): \")", "    if entry == \"done\":", "        break", "    if is_valid_ip(entry):", "        # admitted: add 1, print ADMITTED, print the binary, show the card", "    else:", "        # rejected: add 1, print REJECTED", "# after the loop: print the two counts"] },
      { p: "To print a number inside text, convert it: `\"Admitted: \" + str(admitted)`." }
    ] }
  }
}, { unit: UNIT, num: 1, points: 100, seq: 3.5, part: "mission", passMin: 90 });
