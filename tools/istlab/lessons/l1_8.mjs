// Lesson 1.8: Hacking Ethics.  Notes: ist/unit-1/hacking-ethics-briefing.html (parts 00-01 and the color game)
const NOTES = { label: "Open the 1.8 briefing", href: "../unit-1/hacking-ethics-briefing.html" };
export default {
  id: "1.8", title: "Hacking Ethics",
  w: {
    pts: 50,
    intro: "You will go through the Rules of Engagement briefing one part at a time. One step needs you to play the color game on the page. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The big idea", links: [NOTES],
        read: "<p>Open the briefing and read the top of the page, down to \"Every Crime Has a Category.\"</p>",
        items: [
          { t: "mc", q: "According to the briefing, what decides whether the same computer skill is a paid job or a federal crime?", c: "Whether someone with real authority said yes first", w: ["How advanced the technical skill is", "Whether the person works for a big company", "Whether anything was actually damaged or taken"], hint: "The deck under the title mentions one piece of paper." }
        ] },
      { h: "Part 00: Every crime has a category", links: [NOTES],
        read: "<p>Read <b>00: Every Crime Has a Category</b>. It uses killing and stealing as examples, then connects them to hacking.</p>",
        items: [
          { t: "match", q: "Match each degree of killing to its description.", pairs: [["First-degree murder", "Intentional and planned out in advance"], ["Second-degree murder", "Intentional but formed in the moment, not planned"], ["Voluntary manslaughter", "Intentional in the heat of the moment after real provocation"], ["Involuntary manslaughter", "No intent to kill, caused by reckless or careless behavior"]], hint: "The four boxes under Categories of killing someone." },
          { t: "match", q: "Match each type of theft to its description.", pairs: [["Petty theft", "Taking property below a state's dollar cutoff"], ["Grand theft", "Taking property above that same cutoff"], ["Robbery", "Taking property from a person using force or the threat of force"], ["Burglary", "Entering a building with intent to commit a crime, even if nothing is taken"]], hint: "Categories of stealing." },
          { t: "match", q: "Match each color to the access it describes.", pairs: [["Green", "Authorized: somebody said yes in writing before anything started"], ["Amber", "Grey area: nobody meant harm but nobody officially said yes"], ["Red", "Unauthorized: nobody said yes, whatever the reason"]], hint: "The three color cards near the end of Part 00." },
          { t: "mc", q: "The briefing says unauthorized computer access works \"exactly the same way\" as what?", c: "Homicide and theft, where category changes the penalty", w: ["Traffic tickets, where every single case is the same", "Contracts, where the signature is always optional", "Copyright, where giving credit changes the law itself"], hint: "The paragraph that begins \"Same pattern.\"" }
        ] },
      { h: "Part 01: White, grey and black hats", links: [NOTES],
        read: "<p>Read <b>01: White hat, grey hat, black hat</b>.</p>",
        items: [
          { t: "match", q: "Match each hat to its description.", pairs: [["White hat", "Hired or invited to find weak spots, and reports them"], ["Grey hat", "Breaks in without asking but says they meant well"], ["Black hat", "Breaks in to steal, damage, spy or make illegal money"]], hint: "The three hat cards." },
          { t: "mc", q: "What single question does the color of the hat answer?", c: "Did they have permission?", w: ["Did they succeed?", "Did they get paid?", "Did they use a famous tool?"], hint: "The first paragraph of Part 01." },
          { t: "mc", q: "Why can a grey hat with good intentions and a black hat with bad ones be charged under the same law?", c: "The law cares about permission, not how good your reason was", w: ["Good intentions are only ever a defense in a school", "Grey hats always cause exactly the same damage", "Judges treat every hacker in exactly the same way"], hint: "The paragraph that begins \"Here's the part that surprises most people.\"" },
          { t: "mc", q: "In the briefing's example, a grey hat finds a way into a school website and then does what?", c: "Emails the school to say they found a way in afterward", w: ["Sells the way in to a stranger on the internet", "Deletes the school's grade records without telling anyone", "Asks the school for permission before getting in"], hint: "Grey hat card, Example." }
        ] },
      { h: "Try it: what color is the access?", links: [NOTES],
        read: "<p>Scroll to <b>Try it: what color is the access?</b> and classify all eight situations. Then answer based on what you did.</p>",
        items: [
          { t: "num", q: "How many situations are in the color game?", a: 8, hint: "The subtitle of the game says how many you classify." },
          { t: "text", q: "In the briefing's example of the Red category, what do you do to a friend's account \"just to look around\"? Type the one-word action.", a: ["guess", "guessing", "guess their password", "guessing their password", "guessing a password"], re: "guess", hint: "Red card example: guessing a friend's ____.", ph: "One or two words" },
          { t: "write", q: "In your own words, explain why a person who \"only looked\" and \"meant well\" can still be breaking the law. (2 to 3 sentences)", min: 25, kw: [["permission", "authorized", "authority", "said yes", "authorization"], ["intent", "reason", "meant well", "good", "intentions"], ["law", "charged", "illegal", "crime", "federal"]], need: 3, hint: "Say that permission is what matters, not the reason." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Google", color: "#4285F4",
    tagline: "You are an intern on a security-research outreach team. Your lead handles messages from people who say they found a problem.",
    from: "Lena Okafor, Security Outreach Lead", subject: "Sort this week's four security reports by permission",
    email: "<p>Hi, we got four messages from people who say they found weaknesses in our products. Before anyone replies, I need you to sort each one by permission, because that is what decides how we handle it.</p><p>This is a classroom simulation, so the reports are made up.</p>",
    steps: [
      { h: "Color each report",
        read: "<p>Use the three colors: green is authorized, amber is a grey area, red is unauthorized.</p>",
        items: [
          { t: "match", q: "Match each report to its color.", pairs: [["A contractor with a signed agreement tests a new app for two weeks and files a full report", "Green: authorized"], ["A user stumbles onto a real problem on a website by accident and is not sure whether to mention it", "Amber: a grey area"], ["A student guesses a classmate's password \"just to look around\" and changes nothing", "Red: unauthorized"]], why: "The line is permission. Signed permission is green; a mistake or a good-faith entry without a yes is amber at best; no permission is red." }
        ] },
      { h: "Name the hat",
        read: "<p>Lena also wants the hat for each person.</p>",
        items: [
          { t: "match", q: "Match each person to the hat.", pairs: [["Paid to try to break into a company's website, then hands over a report", "White hat"], ["Enters a school site without asking, then emails to say it can be done", "Grey hat"], ["Breaks into a store's system to steal credit card numbers", "Black hat"]], why: "The hat answers one question: did they have permission?" },
          { t: "mc", q: "A researcher says: \"I never changed anything, so I did nothing wrong.\" What is the best reply?", c: "The law cares about permission, not how good your reason was", w: ["That is fine, because no change at all means no crime", "That is a defense only if they emailed the school afterward", "That only matters if the website was a very small one"], why: "Even good intentions without permission can break the same law." }
        ] },
      { h: "Same skill, different category",
        read: "<p>The reply template will use the idea that categories change consequences.</p>",
        items: [
          { t: "mc", q: "Which pair is the best match for how the law treats categories?", c: "Two kinds of killing can carry very different penalties", w: ["Petty theft and grand theft are always exactly the same crime", "Every killing carries exactly the same prison sentence", "Burglary only counts when something is actually taken"], why: "Burglary is entering with intent even if nothing is taken, and category (intent, planning, harm) changes the penalty." },
          { t: "write", q: "Write a short reply (three or four sentences) to a person who found a real weakness and tested it without asking. Explain what category they are in, why good intentions do not change that, and what safer step they could take next time.", min: 45, kw: [["permission", "authorized", "authority", "said yes", "unauthorized", "grey hat", "grey area"], ["intent", "reason", "meant well", "good", "intentions"], ["report", "ask", "invite", "program", "contact", "email", "written"]], need: 3, why: "A strong reply says permission is the line, intent does not change it, and next time ask or use an official program before testing." }
        ] }
    ]
  }
};
