// Lesson 1.1: The CIA Triad.  Notes: ist/unit-1/1-1-notes.html (parts 00-04) and the lesson page 1-1-intro-to-ist-and-dig-footprint-cia-triad.html
const NOTES = { label: "Open the 1.1 notes", href: "../unit-1/1-1-notes.html" };
export default {
  id: "1.1", title: "The CIA Triad",
  w: {
    pts: 50,
    intro: "You will go through the 1.1 notes one part at a time. Each step tells you which part to open, then asks questions that only someone who read that part can answer. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The three questions", links: [NOTES],
        read: "<p>Open the notes and read the top of the page, from the title down to the three cards: <b>Confidentiality</b>, <b>Integrity</b> and <b>Availability</b>. Each card asks one short question and gives an analogy.</p>",
        items: [
          { t: "match", q: "Match each pillar to the analogy the notes use for it.", pairs: [["Confidentiality", "A sealed letter or a diary with a lock"], ["Integrity", "A safety seal on a food container"], ["Availability", "The power and water at your house"]], hint: "Each card ends with a line that starts with Analogy." },
          { t: "mc", q: "Which of the three short questions on the cards goes with <b>Integrity</b>?", c: "Is it accurate?", w: ["Is it secret?", "Is it there when I need it?", "Is it free to use?"], hint: "Confidentiality asks if it is secret and Availability asks if it is there when you need it. Integrity is the one left." },
          { t: "multi", q: "The first paragraph says you already practice cybersecurity every day. Which three everyday things does it name?", c: ["Locking your phone", "Checking your bank balance", "Getting annoyed when Wi-Fi drops"], w: ["Changing your ringtone", "Charging your phone overnight"], hint: "Reread the paragraph right under the page title." }
        ] },
      { h: "Part 01: Confidentiality", links: [NOTES],
        read: "<p>Scroll to <b>01: C, Confidentiality</b>. Read all ten examples and the red <b>When it fails</b> paragraph under them.</p>",
        items: [
          { t: "mc", q: "Which example is described as \"confidentiality with a built-in expiration date\"?", c: "A disappearing Snapchat photo", w: ["A private Instagram account", "Two-factor authentication", "Incognito browsing"], hint: "Look for the photo that is designed to be seen once, by one specific person." },
          { t: "mc", q: "The notes call one thing \"the single fastest way confidentiality actually breaks for a teenager.\" What is it?", c: "A phone left unlocked, such as lending it to a friend", w: ["A hacker in another country guessing your password", "A site that loses its security certificate overnight", "A weak Wi-Fi signal in the school building"], hint: "It is example 10, and the notes say it is not a hacker." },
          { t: "mc", q: "According to the notes, who does Incognito or private browsing mode hide your search history from?", c: "Anyone else who uses the same shared device", w: ["Your school and everything on its network", "Your internet provider and its servers", "Every website you visit during the session"], hint: "Example 05. It protects you from the next person on the device, nobody else." },
          { t: "mc", q: "What does two-factor authentication (2FA) stop, according to the notes?", c: "Someone logging in with only your stolen password", w: ["Anyone from ever seeing your username online", "Your phone from running out of battery power", "A shared file from being edited by a teammate"], hint: "Example 06 says it uses a text code." }
        ] },
      { h: "Part 02: Integrity", links: [NOTES],
        read: "<p>Scroll to <b>02: I, Integrity</b>. Read all ten examples and the <b>When it fails</b> paragraph. This is the pillar the notes say most people forget about.</p>",
        items: [
          { t: "mc", q: "Why does Google Docs <b>version history</b> matter on a group project, according to the notes?", c: "It can catch someone quietly rewriting a teammate's paragraph", w: ["It keeps your document secret from every outsider", "It makes a long document load faster on slow Wi-Fi", "It keeps the document online during an outage"], hint: "Example 02 in the Integrity list." },
          { t: "mc", q: "A friend sends a screenshot as \"proof\" you said something. The notes say the image itself can be a problem for which pillar?", c: "Integrity, since screenshots can be edited before sending", w: ["Confidentiality, since the screenshot shows a private chat", "Availability, since a large image is slow to open", "None of the pillars, since a screenshot is only a picture"], hint: "Example 03." },
          { t: "multi", q: "Which of these does the notes' Integrity list include as examples of data being changed or faked? Pick all that apply.", c: ["A deepfaked video or Photoshopped photo", "Autocorrect changing what you typed", "A text thread forwarded without the rest of the conversation"], w: ["School Wi-Fi going down before a deadline", "A phone left unlocked at lunch"], hint: "Check examples 06, 07 and 08. The other two belong to different pillars." }
        ] },
      { h: "Part 03: Availability", links: [NOTES],
        read: "<p>Scroll to <b>03: A, Availability</b>. Read all ten examples and the <b>When it fails</b> paragraph.</p>",
        items: [
          { t: "mc", q: "The notes say a system can be \"perfectly private and perfectly accurate\" and still be useless. When?", c: "When it is down and you cannot reach it", w: ["When it has more users than expected", "When its password is much too long to type", "When it is stored in only one language"], hint: "It is the first sentence under the Availability heading." },
          { t: "mc", q: "Why does the notes list ransomware locking a school's computers under <b>Availability</b>?", c: "The files stay, but nobody can open them without paying", w: ["The attackers read every file on the system in secret", "The attackers quietly changed the grades in the portal", "The school forgot the password to its own Wi-Fi network"], hint: "Example 05. Nothing was stolen or edited, it was locked." },
          { t: "mc", q: "During a DDoS attack, the notes say the website is \"up\" but what?", c: "Unreachable, because fake traffic crowds out real visitors", w: ["Secretly copied onto the attacker's own server", "Showing visitors information that was changed by someone", "Turned into a private site that needs a login"], hint: "Example 06." }
        ] },
      { h: "Part 04: Putting it together", links: [NOTES],
        read: "<p>Scroll to <b>04: Putting It Together</b>. Read the table and the paragraph about the three pillars pulling against each other.</p>",
        items: [
          { t: "mc", q: "The notes use a hospital as an example of a tradeoff. What was traded away?", c: "Availability, to get more confidentiality", w: ["Confidentiality, to get more integrity", "Integrity, to get more availability", "Nothing, because the setup was perfect"], hint: "Records locked down so tightly a doctor cannot pull them up fast in an emergency." },
          { t: "num", q: "How many examples does the notes list for each pillar?", a: 10, hint: "Count the numbered items in any one of the three lists." },
          { t: "mc", q: "What does the notes say good security is about?", c: "Choosing the right balance for the situation", w: ["Getting a perfect score on every single pillar", "Protecting confidentiality above everything else", "Using as many different passwords as possible"], hint: "Last sentence of the paragraph about tradeoffs." },
          { t: "write", q: "In your own words, explain why pushing one pillar too hard can cost another. Use the hospital example from the notes. (2 to 3 sentences)", min: 25, kw: [["availab", "reach", "access"], ["confidential", "secure", "locked", "private"], ["hospital", "doctor", "emergency", "records"]], hint: "Mention the hospital, say which pillar got stronger, and which one got weaker." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Spotify", color: "#1DB954",
    tagline: "You are a summer security analyst on Spotify's trust team. Your manager sends you the week's incident reports.",
    from: "Maya Brooks, Security Team Lead", subject: "Monday triage: six incidents to label by pillar",
    email: "<p>Welcome to the team. Every incident that comes in gets labeled with the pillar of the CIA Triad that failed, so the right engineers see it first.</p><p>Below are this week's reports and a few decisions I need from you. Work through them in order. This is a classroom simulation, so the details are made up.</p>",
    steps: [
      { h: "Label the incidents",
        read: "<p>Match each incident report to the pillar that failed.</p>",
        items: [
          { t: "match", q: "Match each incident to the pillar that failed.", pairs: [
            ["A hacker reads the private playlists and listening history of 40,000 users.", "Confidentiality"],
            ["Someone edits the play counts on a song, so the artist is paid the wrong amount.", "Integrity"],
            ["A flood of fake traffic makes the app unreachable on release day.", "Availability"]], why: "Private data seen by the wrong people is confidentiality, changed data is integrity, and a service people cannot reach is availability." },
          { t: "match", q: "Now three more.", pairs: [
            ["Ransomware locks the internal tools the support team needs.", "Availability"],
            ["An employee emails a customer list to the wrong person.", "Confidentiality"],
            ["A fake \"verified\" artist account posts songs under a real artist's name.", "Integrity"]], why: "The ransomware files still exist but nobody can use them. The wrong inbox saw private data. The impostor account is untrustworthy information." }
        ] },
      { h: "Decide the fix",
        read: "<p>Pick the best response to each problem. Think about which pillar is at risk.</p>",
        items: [
          { t: "mc", q: "Royalty numbers keep getting changed by accident when two people edit the same spreadsheet. Which tool protects the <b>integrity</b> of that data?", c: "Version history that shows who changed what", w: ["A longer Wi-Fi password in the office", "A second internet provider for the building", "A private setting on every employee account"], why: "Version history is how you notice and undo a change nobody should have made." },
          { t: "mc", q: "Support agents need to read customer account details quickly during a live outage. Which change would protect <b>availability</b>?", c: "Keep working backups and a second way into the tools", w: ["Hide all customer data from every employee at once", "Turn off two-factor authentication for everyone", "Delete the oldest customer accounts to save space"], why: "A backup path means the tools are still there when something fails." },
          { t: "mc", q: "A manager wants a new rule: every change to payment data needs three approvals. What is the likely tradeoff?", c: "More protection, but slower access when it is urgent", w: ["More availability and a lot less integrity overall", "No tradeoff, because extra approvals never cost anything", "Less confidentiality and less integrity for the data"], why: "The pillars can pull against each other. Extra locks protect data but can slow down the people who need it." }
        ] },
      { h: "Write back to your lead",
        read: "<p>Maya wants a short note she can forward. Write two to three sentences that cover each part below.</p>",
        items: [
          { t: "write", q: "Pick one incident from the first task. Name the pillar that failed, say what it means in plain words, and give one thing Spotify could do to prevent it.", min: 30, kw: [["confidential", "integrity", "availab"], ["backup", "password", "2fa", "two-factor", "version", "encrypt", "approval", "lock", "private", "monitor", "limit"]], need: 2, why: "A good answer names the pillar, explains it in plain words, and gives a real control." }
        ] }
    ]
  }
};
