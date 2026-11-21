/* The five Mission GAMES (no coding). One per Walkthrough. The games themselves live in python/games/ and netlify/functions/gamebank.js. */
"use strict";
const M = require("./core.js");
const U10 = "Unit 10: The Internet", U7 = "Unit 7: Basic Data Structures";

M.addGame("a102", {
  title: "Mission 10.3: Defuse the House", game: "bomb",
  story: ["**A bomb is ticking in the middle of the house!** The only way to defuse it is to solve its panels, and every panel is about **Internet addresses**.", "Flip switches to build numbers in **binary**, spot **valid and invalid** IP addresses, and tell **private, public and loopback** addresses apart. Beat the clock or the house goes up."],
  how: ["**Build panels:** flip the eight switches (128, 64, 32, 16, 8, 4, 2, 1) until the total matches the target number, then **CUT THE WIRE**.", "**Choice panels:** tap the right answer (or press 1, 2 or 3).", "A wrong answer or an empty clock costs a life. **Three lives** and the house explodes."],
  practice: ["Binary and place values (why an octet stops at 255)", "What makes an IPv4 address valid", "Private, public and loopback addresses", "IPv4 versus IPv6 (32 bits versus 128 bits)"]
}, { unit: U10, num: 1, points: 100, seq: 3.5, passMin: 90 });

M.addGame("a104", {
  title: "Mission 10.5: DNS Cliff Road", game: "dns",
  story: ["**You are a packet racing down a mountain road**, trying to find a website. At every gate there are three lanes, and only one is right. Pick wrong and the road simply ends at the **cliff**.", "Every question is about how **DNS** works: the root, TLD and domain servers, caching, subdomains, and what happens when a name does not exist."],
  how: ["Read the question and the signs under the road, then pick a lane: **press 1, 2 or 3**, or click a lane.", "A right lane keeps you driving. A wrong lane sends your car **off the cliff**.", "**Three trips off the cliff** and the road closes."],
  practice: ["What DNS does and why it exists", "Reading a domain name (TLD, domain, subdomain)", "The DNS hierarchy: root, TLD, then the domain's own server", "Caching, NXDOMAIN and DNS spoofing"]
}, { unit: U10, num: 2, points: 100, seq: 5.5, passMin: 90 });

M.addGame("a106", {
  title: "Mission 10.6: Storm Dash", game: "storm",
  story: ["**A storm is rolling over the network.** Lightning is knocking out routers one by one, and packets still have to get through. Your job is to find a path **around the damage**, fast.", "Click routers to draw a route from the start to the finish. Some rounds ask for **any** route, some for the route with the **fewest hops**, and one is a trap: sometimes there is **no route at all**."],
  how: ["**Click the routers** one after another. They must be connected by a cable. Click the last router again to undo.", "**Never click a router with lightning on it.** It is down. Then press **SEND PACKET**.", "Other rounds are questions about hops and redundancy. **Three lost packets** and the network goes dark."],
  practice: ["Routers, hops and paths", "Reading a network as nodes and links", "Redundancy and fault tolerance (many paths)", "Finding the shortest route around failures"]
}, { unit: U10, num: 3, points: 100, seq: 6.5, passMin: 90 });

M.addGame("a108", {
  title: "Mission 10.7: Packet Post Office Rush", game: "packets",
  story: ["**Welcome to the busiest post office on the Internet.** Packets are pouring in out of order, some are getting lost, and it is up to you to rebuild each message and keep the conveyor belt moving.", "Put packets back in order using their **sequence numbers**, find the packet that went missing (and request a **resend**, like TCP), and pick the right **protocol** for the job."],
  how: ["**Sorting rounds:** click the packets in the order they belong, left to right, then **SEND THE MESSAGE**.", "**Missing rounds:** pick the number(s) that never arrived. **Protocol rounds:** tap TCP or UDP.", "**Three mistakes** and the mail piles up."],
  practice: ["Packets, headers and payloads", "Packet switching and reassembly with sequence numbers", "TCP (reliable) versus UDP (fast)", "Protocols and open standards"]
}, { unit: U10, num: 4, points: 100, seq: 7.5, passMin: 90 });

M.addGame("a110", {
  title: "Mission 7.1: Cartoon Cast Director", game: "cast",
  story: ["**You are the director of a cartoon, and your cast lives in a Python list.** Answer questions about the list to keep the show going. Every right answer adds a frame to your film strip!", "Tap the character at an index, predict what a **slice** or a **negative index** gives, and fix the cast with list **operations** (append, insert, remove and pop) until it matches the target."],
  how: ["**Remember:** the first item is at **index 0**, and `-1` is the last item.", "**Edit rounds:** tap operation cards in order, then **RUN THE EDITS**. The cast changes live so you can see it.", "**Three mistakes** and the show is cancelled."],
  practice: ["Indexes, negative indexes and len", "Slices", "append, insert, remove and pop", "Looping through a list and data abstraction"]
}, { unit: U7, num: 7, points: 100, seq: 7.5, passMin: 90 });
