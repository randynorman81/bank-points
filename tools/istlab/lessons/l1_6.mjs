// Lesson 1.6: How Hackers Track You Online.  Notes: ist/unit-1/whos-watching-you.html (sections 1-5 plus the ad auction demo)
const NOTES = { label: "Open the 1.6 notes", href: "../unit-1/whos-watching-you.html" };
export default {
  id: "1.6", title: "How Hackers Track You Online",
  w: {
    pts: 50,
    intro: "You will go through the 1.6 notes, \"Who's Watching You,\" one section at a time. One step needs you to run the ad auction demo on the page. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The three layers", links: [NOTES],
        read: "<p>Open the notes and read the top of the page down to <b>1: The hardware</b>. The page splits tracking into three layers.</p>",
        items: [
          { t: "match", q: "Match each layer to what the notes says it is.", pairs: [["Layer 1: Hardware", "Built-in sensors that are always on"], ["Layer 2: Software", "The apps you install and the permissions you give them"], ["Layer 3: The market", "Brokers who buy and resell data about you"]], hint: "Three cards at the top of the page." },
          { t: "mc", q: "Which layer does the page say most people only think about?", c: "The middle one, the apps and their permissions", w: ["The first one, the phone's sensors", "The last one, the data market", "None of them, since people never think about it"], hint: "The line after the three cards." }
        ] },
      { h: "1: The hardware", links: [NOTES],
        read: "<p>Read section <b>1: The hardware</b>. Every sensor card has \"Why it's there\" and \"What it can do to you.\"</p>",
        items: [
          { t: "match", q: "Match each sensor to what the page says it can do to you.", pairs: [["LiDAR scanner", "Scans the 3D layout and furniture of your bedroom"], ["Barometer", "Estimates your family's income from the floor you live on"], ["TrueDepth camera", "Reads micro-expressions to see whether an ad made you happy"], ["Ambient light sensor", "Tells an app whether you are in bed or outside"], ["Accelerometer", "Identifies you by the rhythm of your walk"]], hint: "Read the second half of each sensor card." },
          { t: "mc", q: "What reason does the page give for the barometer being in the phone?", c: "It tells 911 what floor you are on inside a tall building", w: ["It measures how fast your phone is moving through the air", "It checks that your charger is a genuine one", "It helps your phone find free Wi-Fi inside a building"], hint: "Barometer card, Why it's there." },
          { t: "mc", q: "According to the notes, what does the accelerometer data let a researcher do?", c: "Identify a specific person from their walking pattern", w: ["Read the private messages that the person sends each day", "Tell exactly which apps the person has installed on it", "Find the password that the person types in at login"], hint: "The paragraph under the sensors cites peer-reviewed studies." }
        ] },
      { h: "2: The apps", links: [NOTES],
        read: "<p>Read section <b>2: The apps</b>. Notice what the page says the policy says, and what it admits the policy does not say.</p>",
        items: [
          { t: "mc", q: "What does the notes say TikTok's U.S. privacy policy says it may collect from the videos you make?", c: "Biometric identifiers such as faceprints and voiceprints", w: ["Your bank account number and your card number", "Your exact password for every one of your other apps", "Your contacts' private text messages and photos"], hint: "First paragraph under TikTok." },
          { t: "mc", q: "What does the page tell you to do before you hand an app your face and voice?", c: "Read the app's privacy policy", w: ["Delete your account first", "Turn on airplane mode first", "Ask a friend to try it first"], hint: "Last sentence of the first TikTok paragraph." },
          { t: "text", q: "What does the page say you should check on Instagram's map feature, because it is easy to leave on? Type one word.", a: ["setting", "settings", "the setting", "location"], hint: "Instagram section, last paragraph before the Why does it matter box.", ph: "One word" }
        ] },
      { h: "3: The market", links: [NOTES],
        read: "<p>Read section <b>3: The market</b>. Then scroll down to <b>Try it: watch an ad auction</b>, press the button and read the result.</p>",
        items: [
          { t: "num", q: "The page says a 2022 study estimated a typical American's data is exposed in ad auctions about how many times a day?", a: 747, hint: "First paragraph of section 3." },
          { t: "num", q: "In the ad auction demo, how many companies receive your location and ad ID?", a: 8, hint: "Press the button and count the rows." },
          { t: "text", q: "In the demo, which company wins the ad slot?", a: ["shopsignal", "shop signal"], hint: "The row that turns highlighted and the line under the list.", ph: "Company name" },
          { t: "mc", q: "In the pharmacy example, what happens to the bidders who lose the auction?", c: "They may keep the data they received", w: ["They have to delete the data at once", "They are fined by the government", "They are told whether they lost"], hint: "\"Everyone else lost, and may have kept everything.\"" },
          { t: "order", q: "Put the warrant loophole in order.", items: ["Your app sells your location data to a broker", "The government buys the data from the broker", "No warrant was ever required"], hint: "Three boxes with arrows between them." }
        ] },
      { h: "4 and 5: Lock it down and see it yourself", links: [NOTES],
        read: "<p>Read section <b>4: Lock it down</b>, then <b>5: See it yourself</b>, including the Incognito myth.</p>",
        items: [
          { t: "match", q: "Match each setting to what it switches off or limits.", pairs: [["Precise Location off for social apps", "Keeps apps from learning your exact room"], ["Motion and Fitness off for social apps", "Shuts down identifying you by your walk"], ["Allow Apps to Request to Track off", "Kills the advertising ID that feeds the auction"], ["Audit every permission", "Removes access an app does not need to work"]], hint: "Section 4 lists five settings. Each says what it does." },
          { t: "mc", q: "According to the notes, what was Incognito mode built to hide?", c: "Your history from other people using your computer", w: ["Your exact location from every website you visit", "Your identity from every one of the ad networks", "Your browser fingerprint from the trackers on a site"], hint: "The Incognito myth paragraph." },
          { t: "mc", q: "Why does the page warn you to use the exact CreepJS address and no other?", c: "Copycat sites run modified code to capture your fingerprint", w: ["The real address is the only one that loads fast", "Other addresses are blocked by every school", "The developer charges a fee at other addresses"], hint: "Last paragraph of the Go deeper box." },
          { t: "write", q: "In your own words, explain the idea behind \"If the app is free, the price is the map of your life.\" Use one example from the page. (2 to 3 sentences)", min: 25, kw: [["free", "price", "pay", "sell", "auction", "bid"], ["location", "data", "map", "where you are", "ad id", "advertising"], ["ad", "broker", "company", "companies", "app", "advertis"]], need: 3, hint: "Say that you pay with your data and give one example, such as the ad auction." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Instagram", color: "#C13584",
    tagline: "You are a product-safety intern. The team is reviewing a map feature that shows teens' friends where they are.",
    from: "Alex Rivera, Product Safety Manager", subject: "Review the new location sharing screen before it ships",
    email: "<p>Hi, our new map feature lets a teen share where they are with friends. Before launch I want you to look at the data it touches and how the settings should work.</p><p>Use what you learned about the three layers of tracking. This is a classroom simulation, so the details are made up.</p>",
    steps: [
      { h: "Which layer is it?",
        read: "<p>Sort each piece of the feature into the layer it belongs to.</p>",
        items: [
          { t: "match", q: "Match each part of the feature to its layer.", pairs: [["The phone's built-in sensors that detect where you are", "Hardware"], ["The permission screen that asks to turn on location", "Software"], ["A company that buys location data and resells it", "The market"]], why: "Hardware is the always-on sensors. Software is the apps and their permissions. The market is the brokers who buy and resell you." },
          { t: "mc", q: "A teen's phone says \"Precise Location: On\" for the map. What does precise location give the app?", c: "Your exact spot, not just your general area", w: ["Only the country that you live in", "Only the name of your cell carrier", "Nothing, because maps do not use location"], why: "Turning precise location off gives apps your general area but not your room." }
        ] },
      { h: "What can go wrong?",
        read: "<p>Alex wants three risks explained in plain words.</p>",
        items: [
          { t: "mc", q: "A teen opens the app in a doctor's waiting room, and the location goes into an ad auction. What may happen to the bidders who lose?", c: "They may keep the data, so more companies know where they were", w: ["The data is deleted the moment the auction ends", "Only the winner of the auction can ever see the data", "Nobody sees the data until a court orders that it be shared"], why: "In an ad auction every bidder receives the packet, even the ones who lose." },
          { t: "order", q: "A government agency wants a teen's location history. Put the steps of the warrant loophole in order.", items: ["An app sells location data to a broker", "The agency buys the data from the broker", "No warrant is ever required"], why: "The Fourth Amendment gets skipped because a private company stands in the middle." },
          { t: "mc", q: "Why is a phone's walking rhythm a privacy risk?", c: "It can identify a specific person, like a fingerprint", w: ["It shows the exact words that you speak out loud", "It reveals the passwords that you use for your accounts", "It always matches every person in exactly the same way"], why: "The accelerometer can identify people by their gait, which is why Motion and Fitness access matters." }
        ] },
      { h: "Set the defaults",
        read: "<p>Pick the safe default settings for the launch.</p>",
        items: [
          { t: "multi", q: "Which settings should be off by default for teens? Pick all that apply.", c: ["Precise location sharing with friends", "Motion and Fitness access", "Tracking across other apps"], w: ["The account password", "The ability to report a problem"], why: "Each good answer limits data the feature does not need to work." },
          { t: "write", q: "Write the launch recommendation (three or four sentences). Name two risks from the tracking layers, give one safe default setting, and say why \"the app is free\" matters.", min: 45, kw: [["hardware", "sensor", "software", "permission", "market", "broker", "auction", "location"], ["default", "off", "setting", "precise", "limit", "opt in", "turn off"], ["free", "price", "data", "sell", "pay"]], need: 3, why: "A strong answer names risks, a concrete safe default, and the point that free apps are paid for with data." }
        ] }
    ]
  }
};
