// Lesson 1.9: Common Security Problems.  Notes: ist/unit-1/the-front-door.html (HTTPS, CAPTCHA, 2FA, OWASP, Inspect the building)
const NOTES = { label: "Open the 1.9 notes", href: "../unit-1/the-front-door.html" };
export default {
  id: "1.9", title: "Common Security Problems",
  w: {
    pts: 50,
    intro: "You will go through \"The Front Door\" one lock at a time. One step needs you to use the \"change one number\" demo on the page. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The four locks", links: [NOTES],
        read: "<p>Open the notes and read the top of the page, down to <b>01: HTTPS</b>. Four cards name the four locks.</p>",
        items: [
          { t: "match", q: "Match each lock to the building picture the notes uses.", pairs: [["HTTPS", "The lock on the connection itself"], ["CAPTCHA", "The doorman who checks you are a person"], ["2FA", "The second deadbolt"], ["OWASP", "The building code"]], hint: "The four cards at the top of the page." }
        ] },
      { h: "01: HTTPS", links: [NOTES],
        read: "<p>Read <b>01: HTTPS</b>, including the two address-bar examples and the warning about the padlock.</p>",
        items: [
          { t: "mc", q: "According to the notes, what does plain HTTP (no S) send as readable text?", c: "Everything you type, like passwords and messages", w: ["Only your username and nothing else at all", "Nothing at all, because HTTP is always private", "Only the pictures that appear on the page"], hint: "First paragraph of Part 01, the postcard comparison." },
          { t: "match", q: "Match each thing the padlock checks to what it does.", pairs: [["Encryption", "Scrambles data so nobody spying in transit can read it"], ["Certificate identity", "Confirms you are talking to the real website in the address bar"]], hint: "The two cards under What that little padlock icon actually checks." },
          { t: "mc", q: "What does the notes say a valid padlock does NOT prove?", c: "That the website itself is honest", w: ["That your connection is private", "That the page loaded at all", "That the address is spelled correctly"], hint: "The warning box: the padlock is not a trust me badge." }
        ] },
      { h: "02: CAPTCHA", links: [NOTES],
        read: "<p>Read <b>02: CAPTCHA</b>, including the five kinds.</p>",
        items: [
          { t: "mc", q: "What is a CAPTCHA's entire job, according to the notes?", c: "To slow down programs pretending to be a real person", w: ["To scramble your password while it is in transit", "To tell websites exactly who your friends are", "To store your login so it is ready for the next visit"], hint: "First paragraph of Part 02." },
          { t: "match", q: "Match each kind of CAPTCHA to what it asks.", pairs: [["Distorted text", "Type the wavy, stretched-out letters and numbers"], ["Image grid", "Click every square with a traffic light or crosswalk"], ["Checkbox", "Click I am not a robot while your mouse movement is watched"], ["Invisible", "No test unless your behavior looks suspicious"], ["Slider or puzzle", "Drag a piece into the missing spot with a smooth motion"]], hint: "The five numbered kinds." },
          { t: "multi", q: "Which of these does the notes say bots can do that a human cannot? Pick all that apply.", c: ["Try millions of stolen username and password pairs in minutes", "Buy out a whole concert or sneaker drop in the first second", "Flood comment sections with fake posts faster than any moderator can read"], w: ["Write a school essay from memory", "Hold a long face-to-face conversation"], hint: "Three cards under What bots can do." }
        ] },
      { h: "03: 2FA", links: [NOTES],
        read: "<p>Read <b>03: 2FA</b>, the three factors and the five examples ranked from weakest to strongest.</p>",
        items: [
          { t: "match", q: "Match each factor to its example.", pairs: [["Something you know", "A password or PIN"], ["Something you have", "A phone or a security key"], ["Something you are", "A fingerprint or your face"]], hint: "The three factor cards." },
          { t: "order", q: "Put these 2FA examples in order from weakest to strongest, as the notes ranks them.", items: ["SMS text code", "Email verification code", "Authenticator app", "Push notification approval", "Security key or fingerprint"], hint: "The five examples are numbered 1 to 5 from weakest to strongest." },
          { t: "text", q: "What name does the notes give to the attack where someone tricks your carrier into moving your phone number onto their phone?", a: ["sim-swapping", "sim swapping", "sim swap", "simswapping", "sim-swap"], hint: "It is under the SMS text code.", ph: "Two words" }
        ] },
      { h: "04: OWASP and the demo", links: [NOTES],
        read: "<p>Read <b>04: OWASP</b>. Then scroll to <b>Try it</b>, use the demo that changes the number at the end of the web address, and try it with the check on and off.</p>",
        items: [
          { t: "mc", q: "What does OWASP stand for?", c: "Open Web Application Security Project", w: ["Open World Access Security Plan", "Online Web Attack Safety Program", "Official Website Authorization System"], hint: "First sentence of Part 04." },
          { t: "match", q: "Match each OWASP Top 10 item to its description.", pairs: [["#1 Broken access control", "A user can see or change things they were never allowed to touch"], ["#3 Injection", "A site never checks what you typed and obeys a trick phrase"]], hint: "The two cards under the Top 10." },
          { t: "text", q: "In the demo, you are student 1042. Change the number to 1043. Whose grades appear?", a: ["riley"], hint: "Click /1043 with the check turned off.", ph: "A first name" },
          { t: "text", q: "In the demo, turn the check on and open /1043. What error code appears?", a: ["403", "403 not allowed", "403: not allowed"], hint: "The green box when the site checks who is asking.", ph: "A three-digit code" },
          { t: "write", q: "In your own words, explain why none of the four locks can cover for the other three. Use one example from the notes. (2 to 3 sentences)", min: 25, kw: [["https", "captcha", "2fa", "owasp", "lock"], ["different", "job", "separate", "only", "one"], ["padlock", "fake", "leak", "bot", "password", "breach", "injection", "access"]], need: 3, hint: "Say each lock has a different job and give an example, such as a fake site with a padlock." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Ticketmaster", color: "#026CDF",
    tagline: "You are a web-security intern. Your team is inspecting a ticket site before a big on-sale.",
    from: "Chris Vance, Web Security Lead", subject: "Inspect four test pages before the on-sale starts",
    email: "<p>Hi, tickets for a very popular show go on sale Friday. Before then I want you to inspect the site and tell me which of the four locks is missing, working, or being attacked.</p><p>The four locks are HTTPS, CAPTCHA, 2FA and OWASP. This is a classroom simulation, so the pages and findings are made up.</p>",
    steps: [
      { h: "Inspect the pages",
        read: "<p>For each test page, pick the lock that is missing, working or under attack.</p>",
        items: [
          { t: "match", q: "Match each finding to the lock it is about.", pairs: [["The checkout page uses http:// and asks for a credit card number", "HTTPS"], ["A script tries ten thousand password guesses in a second with no slowdown", "CAPTCHA"], ["A leaked password cannot log in because the account also asks for a phone code", "2FA"], ["A search box runs whatever commands visitors type into it", "OWASP (injection)"]], why: "Each finding points at a different lock. A site can pass three inspections and still fail the fourth." },
          { t: "mc", q: "A test page shows a padlock and https://, but the address is a near-perfect misspelling of a real ticket seller. What is the right finding?", c: "HTTPS is present, but the site can still be fake", w: ["The site is safe because of the padlock", "The padlock is fake, so https:// is broken", "CAPTCHA is missing on the page"], why: "The padlock only proves nobody in the middle can read the connection. It says nothing about whether the site is honest." }
        ] },
      { h: "On-sale day problems",
        read: "<p>Chris wants to know which lock handles each on-sale problem.</p>",
        items: [
          { t: "mc", q: "Bots buy out the first 5,000 tickets in two seconds. Which lock is meant to slow them down?", c: "CAPTCHA, the doorman", w: ["HTTPS, the lock on the connection", "OWASP, the building code", "2FA, the second deadbolt"], why: "Ticket bots are one of the things CAPTCHA is built for." },
          { t: "order", q: "Rank these 2FA options for the team's fans from weakest to strongest.", items: ["Text message code", "Email code", "Authenticator app", "Push approval", "Security key"], why: "SMS can be stolen with SIM-swapping. Security keys are extremely hard to steal remotely." },
          { t: "mc", q: "A fan changes the number at the end of an order address and sees a stranger's tickets. Which OWASP flaw is that?", c: "Broken access control", w: ["Injection", "A missing certificate", "A CAPTCHA failure"], why: "The site never checked whether the fan was allowed to see that order. It is #1 on the OWASP Top 10." }
        ] },
      { h: "Write the summary",
        read: "<p>Chris needs a short summary for the launch meeting (three or four sentences).</p>",
        items: [
          { t: "write", q: "Write the summary. Name the four locks, say what each one protects, and give one reason a fake site can still have a padlock.", min: 45, kw: [["https", "captcha", "2fa", "owasp"], ["bot", "encrypt", "password", "second", "factor", "access", "injection", "scramble", "connection"], ["honest", "fake", "not prove", "doesn't prove", "does not prove", "look-alike", "misspell", "padlock"]], need: 3, why: "A strong summary names all four locks with one job each and says HTTPS only protects the connection, not the site's honesty." }
        ] }
    ]
  }
};
