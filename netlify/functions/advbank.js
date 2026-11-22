/* ADVENTURE BANK: the questions for the two survival-horror point-and-click adventures (python/games/play.html, adventure mode).
     castle  = "Castle Byte: The Binary Baron"  (Unit 8, Digital Information)  24 rounds: 10 rooms x 2 locks + 4 boss rounds
     signal  = "Dead Signal: Restore the Net"   (Unit 10, The Internet)        26 rounds: 11 rooms x 2 locks + 4 boss rounds
   The rooms, clues and story are in python/games/adv-*.js. This file is only the puzzles: every question and answer is made and judged on the SERVER,
   exactly like the other games, so the answers never reach the browser. buildAdventures() gets the helpers from gamebank.js (no circular import). */

/* ------------------------------------------------------------------ Unit 10 fact pools ---- */
const HWY_FACTS = [
  { p: "Which sentence describes the Internet best?", right: "A huge network of networks that all follow shared rules called protocols", wrong: ["One giant computer in a secret building", "Exactly the same thing as the World Wide Web", "A single company's private cable"], why: "The Internet connects millions of separate networks (homes, schools, companies) that agree to use the same protocols." },
  { p: "What is the difference between the Internet and the World Wide Web?", right: "The Web is one service (websites you view in a browser) that runs ON the Internet", wrong: ["They are the exact same thing", "The Internet runs on top of the Web", "The Web is the cables under the ground"], why: "The Internet is the network. The Web, email and video calls are services that use it." },
  { p: "In the highway picture, what is BANDWIDTH?", right: "How many lanes you have: the most data that can travel at the same time", wrong: ["How far away a website is", "How long one trip takes", "The name of your Internet company"], why: "Bandwidth is the maximum amount of data per second your connection can carry. More lanes means more traffic at once." },
  { p: "What is LATENCY?", right: "How long it takes data to make one trip from one place to another", wrong: ["How much data fits on the road at once", "The price of your Internet plan", "How many devices you own"], why: "Latency is the delay of a trip. Bandwidth is how many lanes you have. They are different things." },
  { p: "Your family is streaming two 4K movies and the Internet crawls. In the highway picture, why?", right: "The big semi-trailers (4K streams) are using up your lanes", wrong: ["The cars are driving too fast", "The road ran out of signs", "The router deleted your lanes"], why: "Big streams need a lot of bandwidth. When your lanes are full, everything else has to wait in the traffic jam." },
  { p: "Which of these uses the MOST bandwidth, like a semi-trailer on the highway?", right: "Streaming a 4K movie", wrong: ["Sending a text message", "Loading a plain text web page", "Sending a one-line email"], why: "Video, and 4K video most of all, moves enormous amounts of data. Texts and plain pages are like motorcycles." },
  { p: "You pay your Internet company for a faster plan. In the highway picture, what did you buy?", right: "More lanes for your devices to share", wrong: ["A shorter road to every website", "Faster cars", "A bigger house"], why: "A bigger plan means more bandwidth, so more traffic can flow at the same time." },
  { p: "Bandwidth is measured in...", right: "bits per second, like Mbps or Gbps", wrong: ["pixels per inch", "websites per minute", "bytes per bit"], why: "Bandwidth is a data rate: how many bits can move each second. 1 Gbps is 1,000 Mbps." },
  { p: "Who owns the Internet?", right: "No one. Many companies, schools and governments own different parts of it", wrong: ["Google", "Microsoft", "One government alone"], why: "The Internet is a network of networks. Each part has its own owner, and they cooperate by following the same protocols." },
  { p: "A phone browsing a text page is a motorcycle and a game console downloading a huge update is a big truck. Which uses more of your lanes?", right: "The big truck, because it moves much more data", wrong: ["The motorcycle, because it is faster", "They always use the same amount", "Neither one uses any bandwidth"], why: "Different devices and activities need different amounts of bandwidth. Big downloads and video are heavy traffic." }
];
const HW_FACTS = [
  { p: "What does a MODEM do?", right: "Connects your home to your Internet company (ISP) and the wider Internet", wrong: ["Shares Wi-Fi with your devices", "Stores websites for you", "Gives every website a name"], why: "The modem is the front door. It talks to the cable or fiber line that your ISP ran to your house." },
  { p: "What does a ROUTER do?", right: "Connects your own devices into one network and passes their traffic to and from the modem", wrong: ["Creates the Internet", "Makes the cable thicker", "Reads your emails"], why: "The router is the traffic director inside your home. It shares the one Internet connection with all your devices." },
  { p: "Which sentence about modems and routers is TRUE?", right: "A modem brings the Internet in, and a router shares it with your devices", wrong: ["A router brings the Internet in, and a modem shares it", "They are two names for the same thing", "A modem is only needed for Wi-Fi"], why: "Many home boxes combine both, but the jobs are different: the modem connects to the ISP, the router runs your home network." },
  { p: "What is an ISP, like AT&T or Verizon?", right: "A company you pay to connect you to the Internet", wrong: ["A website that stores passwords", "A type of router", "The group that invents IP addresses"], why: "ISP stands for Internet Service Provider. They own the lines that reach your neighborhood and your house." },
  { p: "How does the Internet physically reach your house?", right: "The ISP runs a cable or fiber line from its network to a box in your home", wrong: ["It floats in through the air from satellites only", "Your router makes it from electricity", "It is stored on your computer"], why: "A technician connects your home to the ISP's network with a wire, often fiber-optic cable." },
  { p: "Which usually gives a steadier connection with lower latency?", right: "A wired Ethernet cable", wrong: ["Wi-Fi through two thick walls", "Bluetooth", "They are always identical"], why: "A cable is not affected by walls or other Wi-Fi networks, so it is usually faster and steadier." },
  { p: "A fiber-optic cable sends data as...", right: "pulses of light", wrong: ["pulses of sound", "paper packets", "magnetic tape"], why: "Fiber carries bits as flashes of light through glass, which is very fast and can carry a lot of data." },
  { p: "Why does the Internet slow down when everyone in the house is online?", right: "All the devices share the same limited bandwidth, so the lanes fill up", wrong: ["The modem runs out of IP addresses", "Wi-Fi permanently uses up the cable", "Routers get tired"], why: "Bandwidth is shared. The more big streams and downloads at once, the less each device gets." },
  { p: "Which device would you find BETWEEN your ISP's cable and your devices?", right: "A modem and a router", wrong: ["A printer", "A monitor", "A keyboard"], why: "The path is ISP line, then modem, then router, then your devices." }
];
const ADDR_FACTS = [
  { p: "How many bits long is an IPv4 address?", right: "32 bits (four numbers from 0 to 255)", wrong: ["8 bits", "64 bits", "128 bits"], why: "Four octets of 8 bits each make 32 bits, about 4.3 billion possible addresses." },
  { p: "How many bits long is an IPv6 address?", right: "128 bits", wrong: ["32 bits", "64 bits", "256 bits"], why: "IPv6 uses 128 bits, enough addresses for every device ever made and then some." },
  { p: "Why was IPv6 created?", right: "IPv4 was running out of addresses", wrong: ["IPv4 was too slow", "IPv4 could not carry video", "People disliked the dots"], why: "32 bits is only about 4.3 billion addresses, and the world has far more devices than that." },
  { p: "Which of these is an IPv6 address?", right: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", wrong: ["192.168.1.1", "255.255.255.0", "10.0.0.256"], why: "IPv6 is written as groups of hexadecimal digits separated by colons. IPv4 uses four numbers separated by dots." },
  { p: "What does NAT (Network Address Translation) let a home do?", right: "Share ONE public IP address among many devices", wrong: ["Give every device its own public address", "Turn website names into IP addresses", "Encrypt every message"], why: "The router rewrites private addresses to the one public address on the way out, and back again on the way in." },
  { p: "Your laptop is 192.168.1.20 and visits a website. Which address does the website see?", right: "Your router's public IP address", wrong: ["192.168.1.20", "127.0.0.1", "The website's own address"], why: "NAT hides the private address. The outside world only sees the router's public address." },
  { p: "Two different homes both have a device at 192.168.1.5. Is that a problem?", right: "No. Private addresses only mean something inside each home network", wrong: ["Yes, every IP address on Earth must be unique", "Yes, unless they use the same ISP", "Only with IPv6"], why: "Private addresses are reused in millions of homes. Like house numbers on different streets, they only need to be unique in their own neighborhood." },
  { p: "What does DHCP do?", right: "Automatically gives each device an IP address when it joins the network", wrong: ["Turns names into IP addresses", "Encrypts the Wi-Fi", "Chooses the shortest route for packets"], why: "DHCP is why you never type an address by hand when you join Wi-Fi. The router hands one out." },
  { p: "In the neighborhood picture, what is a PRIVATE IP address like?", right: "A house number that only makes sense inside your own neighborhood", wrong: ["The address of the whole city", "A secret password", "A road that leads outside"], why: "Private addresses stay inside your network. Only the router's one public address faces the outside world." },
  { p: "Which of these traffic stays inside your home network and never goes out to the Internet?", right: "A laptop printing to a printer on the same Wi-Fi", wrong: ["Searching on Google", "Streaming a movie", "Loading wikipedia.org"], why: "Traffic between two devices in the same neighborhood can stay local. Anything to a website must leave through the router." },
  { p: "What does the address 127.0.0.1 mean?", right: "This same computer (loopback). It never leaves the device", wrong: ["Your router", "Google", "Any device on your Wi-Fi"], why: "Loopback addresses start with 127 and point back at the computer you are using." },
  { p: "Which of these is a PRIVATE address range?", right: "192.168.0.0 to 192.168.255.255", wrong: ["8.8.8.8", "142.250.80.46", "74.125.0.1"], why: "10.x.x.x, 172.16 to 172.31, and 192.168.x.x are private ranges used inside homes and schools." }
];
const WEB_FACTS = [
  { p: "When you open a website, your browser is the ____ and the computer that sends the page is the ____.", right: "client, server", wrong: ["server, client", "router, modem", "packet, protocol"], why: "The client asks, the server answers. That is the client-server model." },
  { p: "What does a web browser do?", right: "Requests web pages from servers and displays them", wrong: ["Moves packets between routers", "Gives out IP addresses", "Encrypts your Wi-Fi"], why: "A browser sends requests and turns the HTML it gets back into the page you see." },
  { p: "What is HTML?", right: "The language that describes the structure and content of a web page", wrong: ["A protocol that routes packets", "A kind of encryption", "A type of Internet company"], why: "HTML tells the browser what is on the page: headings, text, images and links." },
  { p: "What does a browser send to ask a server for a page?", right: "An HTTP request", wrong: ["A DNS record", "A router", "A packet header only"], why: "HTTP (HyperText Transfer Protocol) is the set of rules for asking for and sending web pages." },
  { p: "What does the error 404 mean?", right: "The server could not find that page", wrong: ["Your Wi-Fi is off", "The page is encrypted", "Your computer has a virus"], why: "404 Not Found means the server is working but that page does not exist at that address." },
  { p: "What is the difference between HTTP and HTTPS?", right: "HTTPS adds encryption so other people cannot read the data in transit", wrong: ["HTTPS is faster", "HTTPS only works on phones", "HTTP is the newer one"], why: "The S stands for secure. HTTPS encrypts the connection between your browser and the server." },
  { p: "A site shows the padlock and HTTPS. What does that tell you?", right: "Your connection to it is encrypted, but it does not prove the site is honest", wrong: ["The site is definitely safe", "The site is run by the government", "The site has no ads"], why: "A scam site can also use HTTPS. The padlock protects the trip, not the trustworthiness of the owner." },
  { p: "What is a web server?", right: "A computer that stores websites and sends them when asked", wrong: ["A program that draws pages", "A cable under the street", "Another name for a modem"], why: "Web servers are always on, waiting for requests from clients." },
  { p: "A URL is...", right: "The address you type to find a page on the Web", wrong: ["A kind of virus", "A type of cable", "A wireless signal"], why: "A URL (Uniform Resource Locator) names where a page lives: the protocol, the domain and the path." }
];
const DNS_FACTS = [
  { p: "What does DNS do?", right: "Turns website names into IP addresses", wrong: ["Encrypts websites", "Chooses the fastest cable", "Gives each home a public address"], why: "DNS is the Internet's phone book: names for people, numbers for computers." },
  { p: "A DNS lookup starts at the ____ server first.", right: "root", wrong: ["website's own", "TLD only for .com", "printer"], why: "The lookup starts at the top of the hierarchy: root, then the TLD server, then the domain's own server." },
  { p: "What does NXDOMAIN mean?", right: "That name does not exist", wrong: ["The server is too fast", "The page is encrypted", "Your IP address changed"], why: "It stands for non-existent domain. DNS is saying no such name is registered." },
  { p: "Why do DNS resolvers keep a cache?", right: "So repeat lookups are answered right away", wrong: ["To block ads", "To encrypt websites", "To store your passwords"], why: "A cache remembers recent answers, which makes browsing faster and gives the servers less work." }
];
const PKT_FACTS = [
  { p: "Why is data on the Internet cut into packets?", right: "Small pieces can take different routes, and a lost piece is easy to resend", wrong: ["Packets make files bigger", "Cables can only carry letters", "It hides the data from the router"], why: "Packet switching splits a message into pieces. Each can travel its own path and be reassembled at the end." },
  { p: "What is in a packet's HEADER?", right: "Information like the source, destination and sequence number", wrong: ["Only the picture or video", "The password to the Wi-Fi", "Nothing at all"], why: "The header is the label on the envelope. The payload is the actual data." },
  { p: "What does TCP do if a packet is lost?", right: "The receiver asks for it to be sent again", wrong: ["Nothing, it ignores it", "It deletes the whole message", "It switches to Wi-Fi"], why: "TCP is reliable. It checks that everything arrived in order and asks for resends." },
  { p: "What is a protocol?", right: "An agreed set of rules that lets different devices communicate", wrong: ["A very fast cable", "A kind of router", "A type of virus"], why: "TCP, IP, HTTP and DNS are all protocols. Everyone following the same rules is what makes the Internet work." },
  { p: "Why are Internet protocols published as open standards?", right: "So any company can build devices that work with everyone else's", wrong: ["So they can be sold", "So hackers can read them", "So they are free to break"], why: "Open standards let a phone from one company talk to a router from another." },
  { p: "Which protocol is mainly responsible for addressing packets and routing them to the right destination?", right: "IP (Internet Protocol)", wrong: ["HTML", "HTTP", "Wi-Fi password"], why: "IP puts addresses on packets. TCP or UDP then handles how they are delivered." },
  { p: "Why can packets from the same message arrive out of order?", right: "They may take different routes with different delays", wrong: ["The sender mixed them up on purpose", "Cables sort data by size", "Routers shuffle for security"], why: "Different paths take different times, so the sequence numbers are used to put the message back together." }
];
const ROUTE_FACTS = [
  { p: "In networking, what is a HOP?", right: "One handoff from a router to the next router", wrong: ["A very fast packet", "A broken cable", "A type of virus"], why: "Each time a packet is passed to the next router, that is one hop." },
  { p: "Why is it good that the Internet has MANY paths between two places?", right: "If one router fails, packets can go a different way (fault tolerance)", wrong: ["It makes cables cheaper", "It lets every packet travel in a straight line", "It uses less electricity"], why: "More than one path is called redundancy. When something breaks, traffic goes around it." },
  { p: "What does a router do with a packet?", right: "Reads the destination address and passes it toward the next router", wrong: ["Opens it and fixes the typos", "Stores it forever", "Changes the data inside"], why: "Routers forward packets one hop at a time toward their destination." },
  { p: "Can two packets of the same message take different routes?", right: "Yes, and that is normal on the Internet", wrong: ["No, all packets must follow the first one", "Only if the message is a video", "Only on Wi-Fi"], why: "Each packet is routed on its own, then reassembled at the end." },
  { p: "What does it mean that the Internet is SCALABLE?", right: "It can keep working as more devices and networks join", wrong: ["It can be shrunk to fit one house", "It never has any errors", "It only works with fish"], why: "Scalability means the system can grow without a redesign." }
];
const PAR_FACTS = [
  { p: "What is SEQUENTIAL computing?", right: "Doing steps one after another, one at a time", wrong: ["Doing many steps at the same time", "Sharing steps among many computers", "Deleting steps"], why: "In sequential computing, each step waits for the one before it." },
  { p: "What is PARALLEL computing?", right: "Splitting a problem so parts run at the same time on multiple processors", wrong: ["Doing steps in a line", "Running the program twice", "Using two monitors"], why: "Parallel computing uses several processors on the same machine at once." },
  { p: "What is DISTRIBUTED computing?", right: "Using many separate computers connected by a network to work on a problem", wrong: ["Using one very fast computer", "Printing and distributing papers", "Copying a file many times"], why: "Distributed computing spreads work across multiple computers, like volunteers donating computer time." },
  { p: "What is the main benefit of parallel computing?", right: "Big problems can be finished faster", wrong: ["Programs need no code", "Files get smaller", "Computers use no power"], why: "If steps do not depend on each other, doing them at once saves time." },
  { p: "Which is a limit on how much faster parallel computing can make a program?", right: "Parts that must happen in order cannot be run at the same time", wrong: ["Monitors are too small", "Wi-Fi is too fast", "There are too many colors"], why: "The sequential part of a program stays slow no matter how many processors you add." },
  { p: "What is SPEEDUP?", right: "How many times faster the parallel solution is than the sequential one", wrong: ["The speed of the Internet", "The size of a file", "The number of processors only"], why: "Speedup is sequential time divided by parallel time." },
  { p: "Volunteers lend their home computers to help analyze science data. This is an example of...", right: "distributed computing", wrong: ["sequential computing", "run-length encoding", "a Caesar cipher"], why: "Many computers on a network share one big job." }
];
const CYB_FACTS = [
  { p: "An email says your account is locked and asks you to click a link and enter your password. This is probably...", right: "phishing", wrong: ["a router update", "a firewall test", "run-length encoding"], why: "Phishing tricks people into giving up passwords or personal data. Never use the link; go to the site yourself." },
  { p: "What is MALWARE?", right: "Software designed to harm a computer or steal data", wrong: ["Software that makes Wi-Fi faster", "A kind of router", "A backup copy"], why: "Viruses, ransomware and spyware are all malware." },
  { p: "What is a DDoS attack?", right: "Flooding a server with traffic from many devices so real users cannot get in", wrong: ["Stealing a password with a fake email", "Encrypting a file", "Updating software"], why: "Distributed Denial of Service uses many computers to overload one target. It is a traffic jam on purpose." },
  { p: "What is multi-factor authentication?", right: "Proving who you are with two or more different kinds of proof", wrong: ["Using the same password twice", "Writing a password down", "Using a very long username"], why: "A password plus a code on your phone is stronger than a password alone." },
  { p: "What is the job of a FIREWALL?", right: "Block unwanted network traffic and allow trusted traffic", wrong: ["Make files smaller", "Give out IP addresses", "Print web pages"], why: "A firewall checks traffic against rules and blocks what should not get through." },
  { p: "In SYMMETRIC encryption, how many keys are used?", right: "One shared secret key for both locking and unlocking", wrong: ["Two different keys", "No keys", "A new key for every letter"], why: "Both sides need the same key, so it has to be shared safely first." },
  { p: "In PUBLIC-KEY (asymmetric) encryption, which key do you use to lock a message to Ana?", right: "Ana's public key", wrong: ["Ana's private key", "Your private key", "No key at all"], why: "Anyone can lock with the public key, but only Ana's private key can unlock it." },
  { p: "Why is public-key encryption important for the Internet?", right: "Strangers can share secrets without first having to share a secret key", wrong: ["It makes files smaller", "It speeds up Wi-Fi", "It deletes viruses"], why: "It solves the problem of how to share a key with someone you have never met." },
  { p: "Which password is the STRONGEST?", right: "A long random mix of words, numbers and symbols", wrong: ["password123", "your pet's name", "12345678"], why: "Length and randomness make a password hard to guess, and guessing is how most passwords are broken." },
  { p: "Why should you install software updates?", right: "They fix security holes that attackers could use", wrong: ["They make the Wi-Fi password longer", "They delete your files", "They are only for looks"], why: "Updates patch known weaknesses." },
  { p: "What is a digital certificate used for on the Web?", right: "Proving that a website really belongs to who it says it does", wrong: ["Making a page load faster", "Giving a site a nicer color", "Counting visitors"], why: "A trusted certificate authority vouches for a website so your browser can trust it." },
  { p: "A stranger on public Wi-Fi might see your data if it is NOT encrypted. What protects you?", right: "Using HTTPS sites (and a VPN if possible)", wrong: ["Turning the screen brightness down", "Using a longer cable", "Closing the browser tabs"], why: "Encryption makes intercepted data unreadable." }
];
const IMP_FACTS = [
  { p: "The DIGITAL DIVIDE is...", right: "The gap between people who have good access to computers and the Internet and people who do not", wrong: ["A bug in a spreadsheet", "Splitting a file into packets", "A type of fiber cable"], why: "Money, location and age can all affect who has Internet access, and that affects school, jobs and services." },
  { p: "What is CROWDSOURCING?", right: "Getting ideas, work or data from a large group of people, usually online", wrong: ["Hiding data in a crowd", "Blocking a crowded website", "Compressing a video"], why: "Projects like Wikipedia and online maps use many contributors." },
  { p: "What is CITIZEN SCIENCE?", right: "Volunteers helping real scientific research, often by collecting or sorting data online", wrong: ["Scientists voting", "A school class for adults", "Hacking for fun"], why: "Everyday people can help with bird counts, galaxy sorting and more." },
  { p: "A hiring program learned from past decisions that were unfair, and now repeats them. This is...", right: "algorithmic bias", wrong: ["run-length encoding", "overflow", "a firewall"], why: "A program can copy the unfairness hidden in the data it was trained on." },
  { p: "A computing innovation can have effects its creators did NOT plan. Which is true?", right: "It can help some people and harm others at the same time", wrong: ["It only ever has good effects", "It only affects the creator", "Innovations never change society"], why: "Technology has both beneficial and harmful effects, and some are unexpected." },
  { p: "Your DIGITAL FOOTPRINT is...", right: "The trail of data about you left by what you do and post online", wrong: ["The size of your shoes in a game", "A virus", "The speed of your Wi-Fi"], why: "Posts, searches and photos can stay online a long time and be seen by others." },
  { p: "Which is PII (personally identifiable information)?", right: "Your full name together with your home address and birthday", wrong: ["The weather today", "A public song title", "The color blue"], why: "PII can be used to identify you or steal your identity, so share it carefully." },
  { p: "Why do some apps collect your location?", right: "To offer services like maps, but it also raises privacy concerns", wrong: ["To make the battery last longer", "It is required by every phone call", "Because GPS only works when sharing"], why: "Data helps services work, but the people who collect it can also misuse or leak it." }
];
const COPY_FACTS = [
  { p: "You find a photo online and put it in your presentation without saying who made it. This is...", right: "plagiarism if you present it as your own, and possibly copyright infringement", wrong: ["perfectly fine because it was online", "a form of encryption", "fair use always"], why: "Give credit to the creator, and check the license before you use someone else's work." },
  { p: "What does a Creative Commons license do?", right: "Lets creators say how others may use and share their work", wrong: ["Makes a file smaller", "Blocks all copying", "Gives the work to the government"], why: "Creative Commons licenses make it clear what you can do, like sharing with credit." },
  { p: "By default, new creative work like a song or a drawing is...", right: "protected by copyright automatically", wrong: ["free for everyone", "owned by the Internet", "protected only if registered with a password"], why: "Copyright protects work from the moment it is created." },
  { p: "What does OPEN SOURCE mean?", right: "The code is shared so others can read, use and improve it", wrong: ["The code is secret", "The code cannot be changed", "The code is only for the government"], why: "Many popular tools are open source, written by communities of volunteers." },
  { p: "What is FAIR USE?", right: "A limited way to use copyrighted work without permission, like for criticism, news or teaching", wrong: ["Using anything if you pay nothing", "Copying a whole movie", "Using anything on social media"], why: "Fair use depends on purpose, amount and effect. It is not a free pass to copy." },
  { p: "A work in the PUBLIC DOMAIN is...", right: "no longer protected, so anyone may use it freely", wrong: ["only for libraries", "owned by the person who found it", "illegal to copy"], why: "Old works and some government works are in the public domain." },
  { p: "Why is it important to credit the source of an image or idea?", right: "It respects the creator and lets others find the original", wrong: ["It makes the file smaller", "It is a Wi-Fi rule", "It prevents viruses"], why: "Attribution is part of using creative work fairly." },
  { p: "Which is the SAFEST way to use an image in a school project?", right: "Use one that is public domain or Creative Commons and give the credit it asks for", wrong: ["Right click and save anything", "Use whatever shows up first", "Crop out the artist's name"], why: "Check the license and follow its rules." }
];

/* ------------------------------------------------------------------ builder ---- */
export function buildAdventures(H) {
  const { R, int, pick, shuffle, uniq, mc, M3, G, PG, LESSON_VAULTS, vaultQ, dnsQ, assembleQ, missingQ, SCENES, typedIp, makeIp, vaultCheck, packetsCheck } = H;
  const sub = (r) => Math.floor(r() * 4294967296) >>> 0;
  const num = (n) => String(n);

  /* ---- Unit 10 computed rounds ---- */
  const RATES = [["a 4K movie stream (a semi-trailer)", 25], ["an HD movie stream (a pickup truck)", 5], ["a video call (a van)", 4]];
  const gStreams = G("streams", (r) => {
    const P = pick(r, [100, 200, 300, 500]), k = pick(r, RATES), ans = P / k[1];
    return M3(r, "Your Internet plan gives you " + P + " Mbps of bandwidth. Each " + k[0] + " uses " + k[1] + " Mbps. At most how many can run at the same time?", num(ans), [ans - 2, ans + 2, ans * 2, Math.round(ans / 2)].filter((x) => x > 0).map(num), P + " divided by " + k[1] + " is " + ans + ". After that your lanes are full and the next one slows everyone down.", {}, 50);
  });
  const gLeft = G("left", (r) => {
    const P = pick(r, [100, 150, 200]), A = int(r, 1, 3), B = int(r, 1, 6), left = P - 25 * A - 5 * B;
    return M3(r, "Your plan is " + P + " Mbps. Right now " + A + " 4K stream" + (A > 1 ? "s" : "") + " (25 Mbps each) and " + B + " HD stream" + (B > 1 ? "s" : "") + " (5 Mbps each) are running. How much bandwidth is left?", left + " Mbps", [left + 25, left - 5, left + 5, P - 25 * A].map((x) => x + " Mbps"), "The traffic uses " + A + " x 25 + " + B + " x 5 = " + (25 * A + 5 * B) + " Mbps. " + P + " minus " + (25 * A + 5 * B) + " leaves " + left + " Mbps.", {}, 60);
  });
  const gOver = G("over", (r) => {
    const P = pick(r, [50, 100]), A = int(r, 1, 4), B = int(r, 0, 5), need = 25 * A + 5 * B, enough = need <= P;
    return M3(r, "Your plan is " + P + " Mbps. You run " + A + " 4K stream" + (A > 1 ? "s" : "") + " (25 Mbps each) and " + B + " HD stream" + (B !== 1 ? "s" : "") + " (5 Mbps each). What happens?", enough ? "There is enough bandwidth, so everything runs smoothly" : "The lanes are full, so streams buffer and everything slows down", [enough ? "The lanes are full, so streams buffer and everything slows down" : "There is enough bandwidth, so everything runs smoothly", "The router creates more lanes by itself", "Only the 4K streams stop and nothing else changes"], "The traffic needs " + need + " Mbps and the plan has " + P + " Mbps. " + (enough ? "It fits." : "It does not fit, so the traffic jam slows everyone."), {}, 60);
  });
  const gDownload = G("download", (r) => {
    let S = 100, P = 100; for (let k = 0; k < 40; k++) { S = pick(r, [50, 100, 200, 250, 500]); P = pick(r, [50, 100, 200, 400, 500]); if ((S * 8) % P === 0) break; }
    const t = (S * 8) / P;
    return M3(r, "A game update is " + S + " megabytes (MB). Your connection runs at " + P + " megabits per second (Mbps). About how many seconds will the download take? (1 byte = 8 bits)", t + " seconds", [S / P, S * 8, (S * 8) / P + 10, S / 8].map((x) => (x === t ? x + 1 : x) + " seconds"), S + " MB x 8 = " + S * 8 + " megabits. " + S * 8 + " divided by " + P + " Mbps = " + t + " seconds.", {}, 70);
  });
  const gTypedIp = G("typedip", (r) => { const kind = pick(r, ["private", "public", "loopback", "private", "public"]), v = typedIp(r, kind, false); return M3(r, "Is this address private, public or loopback?", kind, ["private", "public", "loopback"].filter((k) => k !== kind), v.why, { code: v.ip, fixed: true }, 40); });
  const gValidIp = G("validip", (r) => { const v = makeIp(r, int(r, 0, 1) === 1); return M3(r, "Is this a legal IPv4 address?", v.ok ? "VALID" : "INVALID", [v.ok ? "INVALID" : "VALID"], v.why, { code: v.ip, fixed: true }, 40); });
  const gUrl = G("url", (r) => {
    const proto = pick(r, ["http", "https"]), site = pick(r, ["schs.edu", "recipes.com", "gamenews.org", "mit.edu"]), pathName = pick(r, ["news", "photos", "help", "about"]), file = pick(r, ["today.html", "index.html", "page2.html"]);
    const url = proto + "://www." + site + "/" + pathName + "/" + file, ask = pick(r, ["protocol", "domain", "path", "tld"]);
    const right = ask === "protocol" ? proto : ask === "domain" ? "www." + site : ask === "path" ? "/" + pathName + "/" + file : "." + site.split(".")[1];
    const wrongs = ask === "protocol" ? [proto === "http" ? "https" : "http", "www", "html"] : ask === "domain" ? [site.split(".")[1], proto, pathName + "/" + file] : ask === "path" ? ["www." + site, proto, "." + site.split(".")[1]] : [".html", "." + (site.indexOf("com") > -1 ? "edu" : "com"), "www"];
    const label = { protocol: "protocol", domain: "domain name (host)", path: "path to the page", tld: "top-level domain" }[ask];
    return M3(r, "In this URL, which part is the " + label + "?", right, wrongs, "A URL has a protocol (" + proto + "), then the domain (www." + site + "), then the path (/" + pathName + "/" + file + "). The top-level domain is the last label of the domain: ." + site.split(".")[1] + ".", { code: url }, 40);
  });
  const PATHS = [["Home", "R1", "R4", "R7", "School"], ["Home", "R2", "R5", "R7", "School"], ["Home", "R2", "R5", "R8", "School"], ["Home", "R3", "R6", "R8", "School"], ["Home", "R1", "R2", "R5", "R8", "School"]];
  const gPathDown = G("pathdown", (r) => {
    const routers = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8"];
    for (let k = 0; k < 80; k++) {
      const three = shuffle(r, PATHS).slice(0, 3), down = pick(r, routers), ok = three.filter((p) => p.indexOf(down) < 0);
      if (ok.length !== 1) continue;
      const txt = (p) => p.join(" > ") + " (" + (p.length - 1) + " hops)";
      return M3(r, "A storm knocks out router " + down + ". Which of these three routes from Home to School still WORKS?", txt(ok[0]), three.filter((p) => p !== ok[0]).map(txt), "Router " + down + " is on the other two routes, so a packet would get stuck. This is why the Internet keeps many paths (redundancy).", { code: three.map(txt).join("\n"), fixed: true }, 50);
    }
    return M3(r, "Why does the Internet keep MANY paths between two places?", "If one router fails, packets can go around it", ["It makes cables cheaper", "Every packet must travel in a straight line", "It uses less electricity"], "More than one path is called redundancy, and it makes the network fault tolerant.", {}, 30);
  });
  const gHopsCount = G("hopscount", (r) => {
    const p = pick(r, PATHS), h = p.length - 1;
    return M3(r, "A packet travels along this route. How many HOPS is that?", num(h), [h - 1, h + 1, h + 2].filter((x) => x > 0).map(num), "A hop is one handoff from router to router (or from the start to the first router). " + p.join(" > ") + " has " + h + " links, so " + h + " hops.", { code: p.join(" > "), fixed: true }, 40);
  });
  const gAssemble = (n) => G("assemble" + n, (r) => assembleQ(sub(r), 0, n, 60));
  const gMissing = (lost) => G("missing" + lost, (r) => missingQ(sub(r), 0, lost, 50));
  const gScene = G("scene", (r) => { const s = pick(r, SCENES); return mc(r, "Which protocol fits best? " + s.p, s.right, [s.right === "TCP" ? "UDP" : "TCP"], s.why, { fixed: true }, 30); });
  const gDnsPick = (idxs, key) => G(key, (r) => dnsQ(sub(r), pick(r, idxs)));
  const gSpeedup = (mode) => G("speedup" + mode, (r) => {
    const k = int(r, 2, 4), tasks = []; for (let j = 0; j < k; j++) tasks.push(pick(r, [10, 20, 30, 40, 50, 60]));
    const seq = tasks.reduce((a, b) => a + b, 0), par = Math.max.apply(null, tasks), list = tasks.join(", ");
    if (mode === "time") return M3(r, "A job has " + k + " tasks that do not depend on each other. They take " + list + " seconds. Running them one after another (sequential) takes how long? ", seq + " seconds", [par, seq + 10, seq - 10].map((x) => x + " seconds"), "Sequential time is the sum: " + tasks.join(" + ") + " = " + seq + " seconds.", { fixed: true }, 45);
    return M3(r, "A job has " + k + " tasks that do not depend on each other. They take " + list + " seconds. With " + k + " processors running them in PARALLEL, about how long does the whole job take?", par + " seconds", [seq, Math.round(seq / k), par + 10].map((x) => x + " seconds"), "In parallel, the job is done when the longest task finishes: " + par + " seconds. (Sequentially it would take " + seq + ".)", { fixed: true }, 45);
  });
  const gPool = (key, pool, t) => PG(key, pool, t);

  /* ---- Unit 10 lesson plans: two locks per room. A lock written as [a, b] is one of two kinds, chosen by the run's seed, so a replay is different. ---- */
  const SIGNAL_ROOMS = [
    { topic: "Room 1: The Highway (10.1)", plan: [gPool("hwy", HWY_FACTS, 45), [gStreams, gLeft]] },
    { topic: "Room 2: The Router Basement (10.2)", plan: [gPool("hw", HW_FACTS, 45), [gDownload, gOver]] },
    { topic: "Room 3: The Address Office (10.3)", plan: [gPool("addr", ADDR_FACTS, 45), [gTypedIp, gValidIp]] },
    { topic: "Room 4: The Browser Cafe (10.4)", plan: [gUrl, gPool("web", WEB_FACTS, 45)] },
    { topic: "Room 5: The Phone Book Archive (10.5)", plan: [gDnsPick([1, 3, 6, 2], "dnsA"), gDnsPick([0, 4, 5, 7, 8, 9], "dnsB")] },
    { topic: "Room 6: The Junction Tunnels (10.6)", plan: [[gPathDown, gHopsCount], gPool("route", ROUTE_FACTS, 45)] },
    { topic: "Room 7: The Sorting Hall (10.7)", plan: [[gAssemble(4), gMissing(1)], [gPool("pkt", PKT_FACTS, 45), gScene]] },
    { topic: "Room 8: The Server Farm (10.8)", plan: [[gSpeedup("par"), gSpeedup("time")], gPool("par", PAR_FACTS, 45)] },
    { topic: "Room 9: The Firewall Vault (10.9)", plan: [gPool("cyb", CYB_FACTS, 45), gPool("cyb", CYB_FACTS, 45)] },
    { topic: "Room 10: The Digital Divide Bridge (10.10)", plan: [gPool("imp", IMP_FACTS, 45), gPool("imp", IMP_FACTS, 45)] },
    { topic: "Room 11: The Copyright Courthouse (10.11)", plan: [gPool("copy", COPY_FACTS, 45), gPool("copy", COPY_FACTS, 45)] }
  ];
  const SIGNAL_BOSS = [[gLeft, gOver], gPool("addr", ADDR_FACTS, 60), [gValidIp, gTypedIp], gPool("cyb", CYB_FACTS, 60)];

  /* ---- Unit 8 lesson plans: two locks per room, picked from the lesson vaults ---- */
  const CASTLE_PICKS = [[1, 5], [0, 4], [1, 5], [0, 5], [2, 4], [0, 8], [0, 6], [1, 3], [0, 3], [1, 5]];
  const CASTLE_ROOMS = LESSON_VAULTS.map((L, k) => ({ topic: "Room " + (k + 1) + ": " + L.title + " (" + L.lesson + ")", plan: CASTLE_PICKS[k].map((j) => L.plan[j]) }));
  const BOSS_IDX = [3, 5, 7, 9];
  const CASTLE_BOSS = BOSS_IDX.map((j) => G("boss" + j, (r) => vaultQ(sub(r), j)));

  /* ---- one make() for an adventure ---- */
  function adventure(rooms, boss, bossTopic) {
    const slots = []; rooms.forEach((rm, k) => rm.plan.forEach((g, a) => slots.push({ g, room: k, topic: rm.topic, step: a }))); boss.forEach((g, a) => slots.push({ g, room: rooms.length, topic: bossTopic, step: a }));
    const make = (seed, i) => {
      const used = new Set(), gens = slots.map((e, k) => (Array.isArray(e.g) ? e.g[Math.floor(R(seed, 5000 + k)() * e.g.length)] : e.g)); let out = null;
      for (let k = 0; k <= i; k++) {
        const g = gens[k]; let n = 0; for (let j = 0; j < k; j++) if (gens[j].key === g.key) n++;
        let x = null;
        for (let attempt = 0; attempt < 14; attempt++) { x = g.gen(R(seed, k + 100 * attempt), n, seed); const key = x.q.prompt + "|" + (x.q.code || ""); if (!used.has(key)) { used.add(key); break; } }
        if (k === i) { x.q.topic = slots[k].topic; x.q.room = slots[k].room; x.q.step = slots[k].step; out = x; }
      }
      return out;
    };
    return { make, rounds: slots.length };
  }
  const advCheck = (a, ans) => {
    if (!ans || ans.timeout) return false;
    if ("idx" in a) return ans.idx === a.idx;
    if (a.gone) return packetsCheck(a, ans);
    if (a.total) return packetsCheck(a, ans);
    return vaultCheck(a, ans);
  };
  const cast = adventure(CASTLE_ROOMS, CASTLE_BOSS, "The Throne Room: the Binary Baron");
  const sig = adventure(SIGNAL_ROOMS, SIGNAL_BOSS, "The Core: the Static (10.12)");
  return {
    castle: { id: "castle", title: "Castle Byte: The Binary Baron", adventure: true, rounds: cast.rounds, strikes: { learn: 10, challenge: 6 }, make: cast.make, check: advCheck },
    signal: { id: "signal", title: "Dead Signal: Restore the Net", adventure: true, rounds: sig.rounds, strikes: { learn: 10, challenge: 6 }, make: sig.make, check: advCheck }
  };
}
