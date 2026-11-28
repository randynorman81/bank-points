// Lesson 1.2: OSINT.  Notes: ist/unit-1/1-2-osint-guide.html (parts 00-07)
const NOTES = { label: "Open the 1.2 OSINT guide", href: "../unit-1/1-2-osint-guide.html" };
export default {
  id: "1.2", title: "OSINT: Open Source Intelligence",
  w: {
    pts: 50,
    intro: "You will go through the OSINT guide one part at a time. Every step names the part to open, then asks questions that only someone who read it can answer. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Part 00: What is OSINT?", links: [NOTES],
        read: "<p>Open the guide and read <b>00: What Is OSINT?</b> from the first paragraph to the end of the section, including \"The definition\" and \"What open source means.\"</p>",
        items: [
          { t: "mc", q: "What does OSINT stand for?", c: "Open Source Intelligence", w: ["Online Security Intelligence", "Open Systems Investigation", "Official Source Information"], hint: "It is the first line under \"The definition.\"" },
          { t: "mc", q: "What does \"open source\" mean in this guide?", c: "Available to anyone who knows where to look", w: ["Leaked from a company's private servers", "Hacked by a person with special tools", "Free to copy without any credit at all"], hint: "The guide says open source does not mean leaked or hacked." },
          { t: "mc", q: "What do hackers almost always do before they try to break into a system?", c: "OSINT, to learn about their target first", w: ["Delete the logs from the target system", "Buy a new computer and a new account", "Ask the target for permission to test it"], hint: "Last paragraph of Part 00." }
        ] },
      { h: "Part 01: The five main sources", links: [NOTES],
        read: "<p>Read <b>01: The Five Main Sources</b>. Notice the example sites named in each box.</p>",
        items: [
          { t: "match", q: "Match each source to the example the guide gives for it.", pairs: [["Search engines and the open web", "Shodan, which searches internet-connected devices"], ["Public records and government databases", "Court records, property deeds and voter rolls"], ["News, blogs and archives", "Old pages saved on the Wayback Machine"], ["Data aggregators and people-search sites", "FastPeopleSearch, Spokeo and BeenVerified"]], hint: "Each of the five boxes lists its own examples." },
          { t: "mc", q: "According to \"The combined effect,\" how long can it take a stranger to build a frighteningly complete picture of you?", c: "Under an hour, without hacking anything", w: ["About a week of careful, patient research work", "A full month of work using paid tools only", "It cannot be done without a large data breach"], hint: "It is the last paragraph of Part 01." }
        ] },
      { h: "Part 02: Who uses OSINT?", links: [NOTES],
        read: "<p>Read <b>02: Who Uses OSINT?</b>. It sorts people into three groups: the good guys, everyday users, and the concerning side.</p>",
        items: [
          { t: "match", q: "Match each user to what the guide says they do with OSINT.", pairs: [["Journalists", "Verify stories and uncover things people in power hide"], ["Cybersecurity professionals", "Find what an attacker would see first, then fix it"], ["Scammers", "Learn names and schedules to write a fake email that looks real"], ["Stalkers and doxxers", "Find a home address, school and family"]], hint: "Look at the three groups of boxes in Part 02." },
          { t: "text", q: "What is it called when a scammer uses OSINT to write a fake email that looks shockingly real to one specific person?", a: ["spear phishing", "spearphishing", "spear-phishing"], hint: "It is named in the Scammers and Social Engineers box.", ph: "Two words" },
          { t: "mc", q: "The guide says OSINT is like a kitchen knife. What changes between a journalist and a stalker?", c: "The intent, because the information is identical", w: ["The information, because the sources differ", "The law, because stalking is always legal", "The tools, because only experts own them"], hint: "First paragraph of Part 02." }
        ] },
      { h: "Part 03: Five public posts", links: [NOTES],
        read: "<p>Read <b>03: A Real Example</b> about Jordan's five public Instagram posts. For each post, notice what a stranger learns.</p>",
        items: [
          { t: "mc", q: "Why does the guide say a dog's name in a photo caption matters?", c: "Dog names are often used in passwords", w: ["The dog's name proves who owns the account", "Dogs have to be registered with the police", "Strangers can then see the dog's home address"], hint: "Look at post 2." },
          { t: "mc", q: "Why does a \"happy birthday Mom!\" post give away useful information?", c: "Mom's name and birthday are common security questions", w: ["Birthdays are always listed in public court records", "It shows exactly when the whole family is on vacation", "Instagram sells the birthday to the school district"], hint: "Post 3." },
          { t: "text", q: "The hidden data inside a photo file that can include the exact GPS coordinates has a four-letter name. What is it?", a: ["exif", "exif data"], hint: "It is mentioned in post 2.", ph: "Four letters" },
          { t: "num", q: "The guide says that with zero hacking a stranger learns all of this in under how many minutes?", a: 20, hint: "It is the last paragraph of Part 03." }
        ] },
      { h: "Part 04: OSINT and the CIA Triad", links: [NOTES],
        read: "<p>Read <b>04: OSINT and the CIA Triad</b>. Each pillar has a real example.</p>",
        items: [
          { t: "match", q: "Match each pillar to the real example the guide gives for how OSINT strains it.", pairs: [["Confidentiality", "A private thought you posted at 14 is still Googleable at 25"], ["Integrity", "A typo in a public arrest record names the wrong person"], ["Availability", "You delete a tweet but it was already screenshotted and archived"]], hint: "The three boxes of Part 04 each end with a Real example line." },
          { t: "mc", q: "In Part 04, why is availability a problem for privacy?", c: "Public data is too available: it is copied everywhere", w: ["Public data is never available when you need it most", "Sites go offline so often that nobody can rely on them", "Only the owner can ever reach the data again later"], hint: "Third box of Part 04." }
        ] },
      { h: "Part 05: Registries, blotters and aggregators", links: [NOTES],
        read: "<p>Read <b>05: Case Study: Registries and Blotters</b>, including the three \"Where Each Pillar Breaks\" boxes and the table.</p>",
        items: [
          { t: "mc", q: "What is a police blotter, according to the guide?", c: "A daily news feed of arrests and calls for service", w: ["A private file that is kept only by police detectives", "A national list of every person ever convicted of a crime", "A tool that quietly deletes old arrest records for you"], hint: "First box under the case study." },
          { t: "multi", q: "Which are the three ways data aggregators get your data?", c: ["Public records", "Social media scraping", "Buying and selling data"], w: ["Guessing your password", "Reading your private texts"], hint: "Read the box titled How Do They Get Your Data?" },
          { t: "mc", q: "The guide says a typo on a blotter lists the wrong name for an arrest. Which pillar failed?", c: "Integrity, because the data must be true to be fair", w: ["Confidentiality, because the arrest was secret", "Availability, because the blotter went offline", "None, because the data was public anyway"], hint: "See the Integrity Conflict box and the table." },
          { t: "mc", q: "Why might someone proven innocent still find their mugshot hard to remove?", c: "Some sites charge a fee, and archives keep copies", w: ["Courts are not allowed to delete any record at all", "Mugshots are protected by strict copyright law", "Search engines do not accept any removal requests"], hint: "Availability Conflict box." }
        ] },
      { h: "Part 07: Defend yourself", links: [NOTES],
        read: "<p>Read <b>07: Defend Yourself</b> and the closing paragraph about hygiene.</p>",
        items: [
          { t: "mc", q: "What is the goal of OSINT hygiene, according to the guide?", c: "Making sure what is out there is what you chose", w: ["Becoming completely invisible on the whole internet", "Deleting every account that you have ever made", "Hiding from every single person who might search you"], hint: "The guide says you cannot become invisible." },
          { t: "write", q: "In your own words, explain how five posts that each look harmless can still be risky. Use Jordan as your example. (2 to 3 sentences)", min: 25, kw: [["combine", "together", "add up", "all five", "piece"], ["school", "address", "neighborhood", "schedule", "birthday", "password", "dog", "car"], ["stranger", "someone", "scammer", "stalker", "anyone"]], need: 3, hint: "Say that the posts add up, name something a stranger learns, and say who could use it." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Zillow", color: "#006AFF",
    tagline: "You are a trust and safety intern. Your team checks what a stranger could learn from public information before a new feature launches.",
    from: "Dana Ortiz, Trust and Safety Manager", subject: "Review a sample profile before we launch the new seller page",
    email: "<p>Hi, we are adding a seller page that shows an agent's name, listings and a short bio. Before launch I want a safety review.</p><p>Use what you know about OSINT. Our test person is Riley, a 17-year-old who volunteers for a family friend who sells homes. All of Riley's posts are public. Work through the tasks in order.</p>",
    steps: [
      { h: "What does a stranger learn?",
        read: "<p>Riley posted: (1) a photo in a school hoodie at a Friday football game, (2) a selfie in the driveway with the house number visible, (3) \"Mom's birthday dinner on the 14th!\", (4) \"Heading to the lake all weekend with the whole family,\" (5) a story saying \"AP test Thursday 2nd period.\"</p>",
        items: [
          { t: "match", q: "Match each post to the main thing a stranger learns from it.", pairs: [["The school hoodie at the football game", "Riley's school and a day the team plays"], ["The driveway selfie with the house number", "Where Riley lives"], ["Mom's birthday dinner on the 14th", "A birthday and a family name"], ["Heading to the lake all weekend", "The house will be empty"], ["AP test Thursday 2nd period", "Where Riley will be at what time"]], why: "Every post is harmless alone. A stranger who combines them knows the school, the address, the family, when the house is empty and where Riley is on Thursday." },
          { t: "mc", q: "Post 4 (the weekend at the lake) is the riskiest of the five. Why?", c: "It tells everyone that nobody is home for a while", w: ["It shows Riley's face to the entire public", "It names a lake somewhere in the state of Georgia", "It reveals Riley's full legal name to strangers"], why: "A fact about your schedule can be more dangerous than a fact about your name." }
        ] },
      { h: "Where the information comes from",
        read: "<p>Sort the sources a researcher would use to build a profile of an agent or a seller.</p>",
        items: [
          { t: "match", q: "Match each source type to something Zillow's reviewers might find there.", pairs: [["Public records", "A property deed with the owner's name"], ["Social media", "Photos with a street sign in the background"], ["Data aggregators", "One profile that combines address, relatives and phone"], ["News and archives", "An old school newsletter on the Wayback Machine"]], why: "Aggregators take the other sources and combine them into one searchable file." },
          { t: "mc", q: "A reviewer finds that a seller's home address, age and relatives all appear on a people-search site. Which sentence is the most accurate?", c: "None of it was hacked; it was gathered from public sources", w: ["The site must have broken into private databases", "This is only possible for famous people", "It is illegal for anyone to gather this data"], why: "OSINT uses information that is available to anyone. Combining it is the part that creates the risk." }
        ] },
      { h: "Pillars and recommendations",
        read: "<p>Dana wants the team to name the pillar involved and suggest a fix.</p>",
        items: [
          { t: "mc", q: "A seller's page shows the wrong phone number because a scraper copied an old listing. Which pillar is the problem?", c: "Integrity, because the information is not accurate", w: ["Confidentiality, because the phone number was private", "Availability, because the page loaded far too slowly", "None, because a phone number is already public"], why: "The data was changed or out of date, so it cannot be trusted." },
          { t: "multi", q: "Which changes would reduce what a stranger can learn from the seller page? Pick all that apply.", c: ["Show a business phone number instead of a home number", "Hide the exact street address until a buyer is verified", "Strip hidden photo location data before upload"], w: ["Show the seller's daily schedule", "Add the names of the seller's children"], why: "Each good answer removes a piece a stranger could combine with others." }
        ] },
      { h: "Write the recommendation",
        read: "<p>Write a short note back to Dana (three or four sentences).</p>",
        items: [
          { t: "write", q: "Using Riley as the example, explain what OSINT is and give two specific changes Riley (or the seller page) should make before launch.", min: 40, kw: [["open source", "public", "publicly", "anyone can", "open"], ["post", "location", "address", "schedule", "birthday", "photo", "exif", "privacy", "private", "setting"], ["combine", "together", "add up", "stranger", "scammer", "stalker"]], need: 3, why: "A strong answer defines OSINT, names two real fixes, and explains why combining posts is the risk." }
        ] }
    ]
  }
};
