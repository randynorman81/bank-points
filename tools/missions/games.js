/* The five Mission GAMES (no coding). One per Walkthrough. The games themselves live in python/games/ and netlify/functions/gamebank.js. */
"use strict";
const M = require("./core.js");
const U10 = "Unit 10: The Internet", U7 = "Unit 7: Basic Data Structures", U8 = "Unit 8: Digital Information";

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

/* EXAMPLE of a Unit 8 game assignment (no coding). Hidden. The Python walkthroughs a45 to a54 and their assignments a55 to a64 are not touched. */
M.addGame("a111", {
  title: "Vault 8: Final Unit Review (all lessons)", game: "vault",
  story: ["**You are a master thief with one night to crack the most secure vault in the city.** Its ten locks are all about **digital information**, the same ideas that show up on the AP Computer Science Principles exam.", "Flip bit switches to build binary numbers, decode a guard's ASCII note, **paint a picture from raw bits**, mix colors with RGB and hex, run filters on pixels, shrink data with run-length compression, and finish with a **cryptography boss**. Beat the clock and keep the alarm quiet."],
  how: ["**Bit switches:** each switch is a place value (128, 64, 32, 16, 8, 4, 2, 1). Lit means 1. Make the total match, then **CUT THE WIRE**.", "**Pixel painter:** the scanner sends a long string of bits. Cut it into rows, then click the squares that should be black.", "**Color mixer:** set red, green and blue. Some locks give you a hex code, so you have to convert it first.", "**Choice locks:** tap the right answer (or press 1, 2, 3 or 4). Read the explanation after every round, because it teaches the exact idea the exam asks about.", "**Three mistakes** (or an empty clock) set off the alarm and you are caught."],
  practice: ["Binary, place values, bits needed for a number of values, overflow and round-off error", "ASCII, Unicode and how text is stored as bits", "Pixels, bitmaps and how an image is just a grid of bits", "Hexadecimal and RGB colors", "Image filters (invert, grayscale, brighten) as math on pixel values", "Lossless versus lossy compression and run-length encoding", "Caesar ciphers, symmetric versus public-key encryption"]
}, { unit: U8, num: 12, points: 100, seq: 10.7, passMin: 0 });

/* THE LESSON VAULTS: a second assessment for each Unit 8 lesson, after its walkthrough (a45 to a54) and its Python assignment (a55 to a64).
   a112 to a121 = lessons 8.1 to 8.10. Not gating (passMin 0), like the Python assignments. */
const VAULT_LESSONS = [
  ["Intro to Digital Information", "bits and bytes, how many values n bits can hold, how many bits a list of things needs, analog versus digital, overflow and round-off error", ["Bits, bytes and binary numbers", "How many values n bits can make, and how many bits you need", "Analog versus digital data and sampling", "Overflow and round-off error", "Abstraction"]],
  ["Number Systems", "binary and decimal, place values, binary counting and binary addition", ["Converting binary to decimal and decimal to binary", "Place values", "Counting and adding in binary", "The biggest number n bits can hold"]],
  ["Encoding Text with Binary", "ASCII, Unicode and how letters become bits", ["ASCII codes and decoding a binary message", "How many bits a piece of text takes", "Uppercase versus lowercase codes", "ASCII versus Unicode"]],
  ["Pixel Images", "bitmaps, rows of bits, resolution and image file sizes", ["Reading a bitmap from a string of bits (and painting it)", "Turning a picture back into bits", "File size of black-and-white and color images", "Bits per pixel and resolution"]],
  ["Hexadecimal", "hex digits, hex and decimal, hex and binary", ["Hex digits A to F", "Converting hex to decimal and decimal to hex", "Converting between hex and binary (4 bits per hex digit)", "Counting and comparing in hex"]],
  ["Pixel Colors", "RGB light mixing, hex colors and how many colors a pixel can show", ["Mixing red, green and blue light", "Reading #RRGGBB hex colors", "Gray means equal red, green and blue", "24-bit color and how many colors it can make"]],
  ["Image Manipulation", "filters as math on pixel values: invert, grayscale, brighten, darken, black and white, mirror and swapping channels", ["Filters are math on red, green and blue numbers", "Why values stop at 0 and 255", "Combining two filters in order"]],
  ["Data Compression", "lossless compression and run-length encoding", ["Run-length encoding and decoding", "When run-length encoding helps and when it makes data longer", "Compression ratios", "Lossless compression in general"]],
  ["Lossy Compression", "lossy versus lossless, what gets thrown away and when each is the right choice", ["Lossy versus lossless", "Choosing the right compression for a situation", "Why lossy cannot be undone", "Reducing pixels and color depth"]],
  ["Cryptography", "Caesar ciphers, keys, breaking a cipher and public-key encryption", ["Encrypting and decrypting with a Caesar cipher", "Plaintext, ciphertext and keys", "Breaking a cipher by brute force and frequency analysis", "Symmetric versus public-key encryption"]]
];
VAULT_LESSONS.forEach((L, i) => {
  const n = i + 1;
  M.addGame("a" + (112 + i), {
    title: "Vault 8." + n + ": " + L[0], game: "vault" + n,
    story: ["**You are a master thief with one night to crack a vault whose ten locks are all about " + L[1] + ".** This is the second check for lesson 8." + n + ": the walkthrough taught you how to do it in Python, and now the vault tests whether you understand the idea itself.", "Beat the clock and keep the alarm quiet. Every lock is a puzzle: flip bit switches, paint pixels, mix colors, or pick the right answer."],
    how: ["**Bit switches:** each switch is a place value (128, 64, 32, 16, 8, 4, 2, 1). Lit means 1. Make the total match, then **CUT THE WIRE**.", "**Pixel painter and color mixer:** some locks ask you to paint pixels from bits or to set red, green and blue.", "**Choice locks:** tap the right answer (or press 1, 2, 3 or 4). Read the explanation after every round. It teaches the exact idea the AP exam asks about.", "**Three mistakes** (or an empty clock) set off the alarm and you are caught."],
    practice: L[2]
  }, { unit: U8, num: n, points: 100, seq: n + 0.7, passMin: 0 });
});
