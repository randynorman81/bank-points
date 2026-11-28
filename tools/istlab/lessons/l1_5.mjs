// Lesson 1.5: How Strong Is Your Password?  Notes: ist/unit-1/1-5-notes.html (ten terms plus the password lab)
const NOTES = { label: "Open the 1.5 notes", href: "../unit-1/1-5-notes.html" };
export default {
  id: "1.5", title: "How Strong Is Your Password?",
  w: {
    pts: 50,
    intro: "You will go through the 1.5 password notes: seven attack terms, three defenses and the password lab at the bottom of the page. The lab questions need you to actually type into it. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The attacks", links: [NOTES],
        read: "<p>Open the notes and read the left side, <b>How Attackers Crack Passwords</b>. Read every card.</p>",
        items: [
          { t: "match", q: "Match each attack term to what the notes says it is.", pairs: [["Brute-force attack", "Trying every possible combination, one by one, until one works"], ["Dictionary attack", "Starting from real words and leaked lists, then adding predictable tweaks"], ["Credential stuffing", "Trying one site's leaked username and password on many other sites"], ["Keylogger", "Software that secretly records every key you press"], ["Hash and rainbow table", "A lookup chart of pre-computed scrambled versions of common passwords"]], hint: "Each of the five has its own card on the left side." },
          { t: "mc", q: "According to the notes, what actually decides how many guesses an attacker needs?", c: "Entropy: how unpredictable the password is", w: ["How complicated the password looks to a person", "How many symbols the password happens to have", "How long ago the password was last changed"], hint: "The Entropy card says it is not about looking complicated." },
          { t: "mc", q: "Why does leetspeak (P@ssw0rd!) barely slow an attacker down?", c: "Cracking tools check those swaps automatically", w: ["Attackers cannot type symbols into login pages", "Sites reject passwords that contain an at-sign", "Hashes ignore any characters that are not letters"], hint: "Leetspeak Substitution card." },
          { t: "mc", q: "Why is no password \"strong enough\" to beat a keylogger?", c: "The attacker never has to guess; they read what you typed", w: ["Keyloggers can only be used on short passwords", "Keyloggers only work when a site has no hashing", "A strong password is blocked by the keylogger"], hint: "Keylogger card." },
          { t: "text", q: "Sites do not store your actual password. They store a scrambled version called a what?", a: ["hash", "a hash", "password hash"], hint: "Hash and Rainbow Table card.", ph: "One word" }
        ] },
      { h: "The defenses", links: [NOTES],
        read: "<p>Read the right side, <b>What Actually Defends You</b>, and the closing line about \"7 ways in, 3 ways to actually stop them.\"</p>",
        items: [
          { t: "match", q: "Match each defense to what the notes says it does.", pairs: [["MFA", "A second proof of identity beyond the password, such as a code on your phone"], ["Passphrase", "A string of random, unrelated words instead of one word with substitutions"], ["Password manager", "Makes and remembers a unique random password for every site"]], hint: "Three cards on the right side." },
          { t: "mc", q: "Which attack does a password manager solve, according to the notes?", c: "The reuse problem that makes credential stuffing possible", w: ["The problem of keyloggers that record every key you press", "The problem of rainbow tables being published on the internet", "The problem of sites that keep no passwords on file at all"], hint: "Password Manager card." },
          { t: "mc", q: "The notes count how many ways in and how many ways to stop them. What are the counts?", c: "7 ways in and 3 ways to stop them", w: ["3 ways in and 7 ways to stop them", "5 ways in and 5 ways to stop them", "10 ways in and 1 way to stop them"], hint: "The line under the cards starts with the numbers." },
          { t: "mc", q: "What does the notes say beats trying to out-clever any single attack?", c: "Layering a passphrase, a password manager and MFA together", w: ["Picking one very long and complex password for every site", "Changing your one password every single week of the year", "Hiding your username on every single site that you use"], hint: "End of the paragraph about the imbalance." }
        ] },
      { h: "The password lab", links: [NOTES],
        read: "<p>Scroll to <b>Try it: crack your own made-up password</b>. Use made-up passwords only, never a real one. Type each test password into the lab and read what it says.</p>",
        items: [
          { t: "mc", q: "Type <code>P@ssw0rd!</code> into the lab. What does it say?", c: "Cracked instantly: a common word with simple tricks", w: ["It needs about 4 days of nonstop guessing to crack", "It needs more than a billion years of guessing to crack", "It cannot be tested at all because it contains a symbol"], hint: "Type it exactly and read the red box." },
          { t: "num", q: "Type <code>Qx7#vLm2</code> into the lab. About how many bits does it report?", a: 53, ph: "A whole number", hint: "Read the number that comes right after the word About." },
          { t: "num", q: "Type <code>river-comet-anchor-maple</code> (four random words) into the lab. About how many bits does it report?", a: 52, ph: "A whole number", hint: "Words separated by dashes are counted as words." },
          { t: "mc", q: "What does comparing those two results show?", c: "Four random words are about as strong as 8 random characters", w: ["Symbols are always better than a string of random words", "Short passwords are always better than any long passwords", "Words can never be as strong as a group of symbols"], hint: "Compare the two bit numbers you just found." },
          { t: "write", q: "In your own words, explain why layering a passphrase, a password manager and MFA beats trying to make one clever password. (2 to 3 sentences)", min: 25, kw: [["layer", "together", "all three", "each", "more than one", "combine"], ["passphrase", "password manager", "mfa", "multi-factor", "second"], ["reuse", "stuffing", "stolen", "leak", "breach", "guess", "keylogger"]], need: 3, hint: "Say that each defense stops a different attack and name at least one attack." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Netflix", color: "#E50914",
    tagline: "You are a security intern on the accounts team. Your lead wants a plan to stop stolen passwords from turning into stolen accounts.",
    from: "Priya Natarajan, Accounts Security Lead", subject: "Why are accounts getting taken over? Review three incident reports",
    email: "<p>Hi, we are seeing viewers lose access to their accounts even though our own servers were never hacked. I need you to label what is happening and recommend defenses.</p><p>This is a classroom simulation, so the details are made up. Work in order.</p>",
    steps: [
      { h: "Name the attack",
        read: "<p>For each report, choose the attack that fits best.</p>",
        items: [
          { t: "match", q: "Match each report to the attack.", pairs: [["A viewer reused the same password on a gaming site that was breached, and criminals logged in to the streaming account with it.", "Credential stuffing"], ["A program tries thousands of real words, each with a capital letter and the number 123 added.", "Dictionary attack"], ["Hidden software on a family computer sends everything the viewer types to a stranger.", "Keylogger"], ["A program tries every possible combination of four characters.", "Brute-force attack"]], why: "Reuse turns one leak into many break-ins. Dictionary attacks use words and predictable tweaks. A keylogger reads what you type. Brute force tries everything." }
        ] },
      { h: "Choose the best defense",
        read: "<p>Priya wants the single best fix for each problem.</p>",
        items: [
          { t: "mc", q: "Viewers reuse one password on many sites. Which tool fixes that most directly?", c: "A password manager that makes a unique password per site", w: ["A longer password that is reused on every site", "A password with an at-sign swapped in for the letter a", "Changing the same password once every single year"], why: "A unique password for every site means one leak cannot open the other accounts." },
          { t: "mc", q: "An attacker already has a viewer's exact password. Which defense can still stop the login?", c: "MFA, a second proof such as a code on the phone", w: ["Adding a capital letter to the end of the password", "Replacing every letter o in the password with a zero", "Making the username much longer than before"], why: "MFA works even when the password is known." },
          { t: "mc", q: "A viewer thinks <code>P@ssw0rd!</code> is clever. What is the best response?", c: "Cracking tools check those swaps automatically, so it is weak", w: ["It is strong, because it has four kinds of characters", "It is strong, because it has a capital letter", "It is weak only if the viewer writes it down"], why: "Leetspeak looks complicated but barely slows an attacker down." }
        ] },
      { h: "Use the lab",
        read: "<p>Open the <a href=\"../unit-1/1-5-notes.html\" target=\"_blank\" rel=\"noopener\">password lab in the 1.5 notes</a> and test the four made-up passwords below. Use only these made-up passwords.</p>",
        items: [
          { t: "mc", q: "Test <code>P@ssw0rd!</code>, <code>kittycat</code>, <code>Qx7#vLm2</code> and <code>river-comet-anchor-maple-tiger</code>. Which one does the lab say takes the longest to crack?", c: "river-comet-anchor-maple-tiger", w: ["P@ssw0rd!", "kittycat", "Qx7#vLm2"], why: "Five random words come to about 65 bits, more than the 53 bits of 8 random characters. Length from randomness wins." },
          { t: "num", q: "How many bits does the lab report for <code>river-comet-anchor-maple-tiger</code>?", a: 65, ph: "A whole number", why: "Five words, each worth about 12.9 bits, makes about 65 bits." }
        ] },
      { h: "Write the recommendation",
        read: "<p>Write the plan Priya will send to viewers (three or four sentences).</p>",
        items: [
          { t: "write", q: "Write the advice for viewers. Name at least two defenses, say which attack each one stops, and say why a password with symbol swaps is not enough.", min: 45, kw: [["password manager", "unique", "mfa", "multi-factor", "passphrase", "two-factor", "2fa"], ["credential stuffing", "reuse", "stolen", "breach", "brute", "dictionary", "keylogger"], ["swap", "leet", "symbol", "@", "clever", "look-alike", "tools check"]], need: 3, why: "A strong answer pairs each defense with the attack it stops and says clever symbols are checked automatically." }
        ] }
    ]
  }
};
