// Lesson 1.3: Police and the 4th Amendment.  Notes: ist/unit-1/1-3-notes.html (parts 00-03)
const NOTES = { label: "Open the 1.3 notes", href: "../unit-1/1-3-notes.html" };
export default {
  id: "1.3", title: "Police and the 4th Amendment",
  w: {
    pts: 50,
    intro: "You will go through the 1.3 notes one part at a time. Each step names the part to open, then asks questions that only someone who read it can answer. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Part 00: Deception is legal", links: [NOTES],
        read: "<p>Read the top of the page and <b>00: Core Reality: Deception Is Legal</b>.</p>",
        items: [
          { t: "mc", q: "What does the notes say the 4th Amendment protects you from?", c: "Unreasonable searches and seizures", w: ["Any question a police officer asks", "Being recorded by the police at all", "Every kind of arrest by an officer"], hint: "It is the first sentence under the title." },
          { t: "mc", q: "In Georgia and most of the U.S., what can police legally do during questioning?", c: "Use trickery, bluffing and even lies to get a confession", w: ["Only ask questions that are completely and fully true", "Only question you when a lawyer is in the room", "Only talk to you for ten minutes at a time at most"], hint: "Part 00, first paragraph." },
          { t: "mc", q: "What are interrogations designed to do, according to the notes?", c: "Secure a confession, not hold a casual, honest chat", w: ["Explain your rights to you step by step", "Help you decide whether you need an attorney", "Prove to the officer that you are innocent"], hint: "Part 00 says no one in the room is going to explain your rights as they go." }
        ] },
      { h: "Part 01: The \"voluntary\" standard", links: [NOTES],
        read: "<p>Read <b>01: The \"Voluntary\" Standard</b>, both lists and \"The pattern\" box.</p>",
        items: [
          { t: "text", q: "Which Georgia law draws the line between allowed tactics and an involuntary confession? Type the section number, like 12-3-456.", a: ["24-8-824", "o.c.g.a. 24-8-824", "ocga 24-8-824", "o.c.g.a. 24 8 824", "ocga 24 8 824"], hint: "It is in the first sentence of Part 01 and starts with O.C.G.A.", ph: "Section number" },
          { t: "multi", q: "Which of these tactics can police legally use, according to the notes?", c: ["Claiming your DNA or fingerprints were found at the scene when they were not", "Claiming a friend already blamed you when nobody said anything", "Posing as a peer, buyer or seller without saying they are police"], w: ["Offering a lighter sentence if you talk", "Threatening physical harm to get an answer"], hint: "Use the green What Police CAN Do list." },
          { t: "mc", q: "What is an illegal \"hope of benefit\"?", c: "Offering a lighter sentence in exchange for talking", w: ["Hoping that the suspect will tell the whole truth", "Telling the suspect the evidence is very strong now", "Letting the suspect call a parent to ask for help"], hint: "First item in the red What Police CANNOT Do list." },
          { t: "mc", q: "Which sentence matches \"The pattern\" in the notes?", c: "Lying about facts is allowed; lying about consequences is not", w: ["Lying about facts is never allowed in any interview room", "Lying about consequences is allowed if the lie is brief", "Police may lie about anything in the room except evidence"], hint: "Facts are evidence, witnesses and identity. Consequences are promises and threats." },
          { t: "mc", q: "Which action ends the line for police even though you have not confessed?", c: "Questioning you after you clearly invoke your rights", w: ["Asking you where you were on the night of last Friday", "Showing you a photograph of a person who is a suspect", "Telling you that the case against you is quite strong"], hint: "Third item in the red list." }
        ] },
      { h: "Part 02: Five common arenas", links: [NOTES],
        read: "<p>Read <b>02: Five Common Interrogation Arenas</b>. Each box has its own rule.</p>",
        items: [
          { t: "match", q: "Match each arena to the rule the notes gives for it.", pairs: [["On school grounds", "Administrators have lower search rules than police"], ["Traffic stop", "You owe only ID, registration and insurance"], ["At your door (knock and talk)", "You never have to let them in without a warrant"], ["Undercover or online", "Police do not have to say they are police, even if asked"], ["Station interrogation room", "The highest-stakes arena, with the full use of pressure tactics"]], hint: "Each arena has a short box of its own in Part 02." },
          { t: "mc", q: "At a knock and talk, what does the notes say about things officers see once they are inside?", c: "What they see in plain view can be used", w: ["Nothing they see can ever be used", "They must close their eyes until a warrant arrives", "It can only be used after you say yes"], hint: "Last sentence of the At Your Door box." }
        ] },
      { h: "Part 03: How to invoke your rights", links: [NOTES],
        read: "<p>Read <b>03: How to Invoke Your Rights</b>, the four steps and the paragraph under them.</p>",
        items: [
          { t: "order", q: "Put the four steps in the order the notes shows them.", items: ["Police questioning begins", "Say clearly that you invoke your right to remain silent and want a lawyer", "Stop talking: do not explain, guess or make small talk", "All legal questioning must stop"], hint: "The steps are numbered 1 to 4 in Part 03." },
          { t: "text", q: "Type the sentence the notes tells you to say. You can leave out punctuation.", a: ["I am invoking my right to remain silent and I want a lawyer"], re: "invok\\w* my right to remain silent.*(want|need).*(lawyer|attorney)", hint: "It is in quotation marks in Step 2.", ph: "The exact sentence" },
          { t: "mc", q: "What is \"the part almost everyone gets wrong\"?", c: "Talking again can un-invoke your rights", w: ["You can only invoke your rights once in your life", "You must say it in a loud voice to count", "You must wait until the officer finishes"], hint: "It is the paragraph after the four steps." },
          { t: "write", q: "In your own words, explain why the notes says the safest thing to say in an interrogation is also the shortest. (2 to 3 sentences)", min: 25, kw: [["short", "one sentence", "one clear", "simple"], ["explain", "argue", "talk", "clear", "answer"], ["material", "used", "against", "give", "evidence"]], need: 3, hint: "Think about what explaining or arguing gives the interrogation." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Discord", color: "#5865F2",
    tagline: "You are a safety-education intern. Your team is writing a short \"know your rights\" guide for teen users about police and online chats.",
    from: "Sam Reyes, Safety Education Lead", subject: "Draft the teen \"know your rights\" card (due Friday)",
    email: "<p>Hi, we are building a help-center card that explains what police can and cannot do when they talk to a teenager, online or in person. It is for Georgia, so use the Georgia rules from class.</p><p>First I need you to check our draft facts, then write the part teens will actually remember. This is a classroom simulation, so the details are made up.</p>",
    steps: [
      { h: "Check the draft facts",
        read: "<p>The draft card lists six police tactics. Decide which are legal.</p>",
        items: [
          { t: "multi", q: "Which of these tactics may police legally use in Georgia? Pick all that apply.", c: ["Telling a teen their fingerprints were found at the scene when they were not", "Telling a teen that a friend already named them", "Joining a chat as a \"new friend\" without saying they are police"], w: ["Promising a lighter sentence if the teen confesses", "Threatening to hurt the teen unless they answer", "Continuing to question after the teen asks for a lawyer"], why: "Lying about facts (evidence, witnesses, identity) is allowed. Promises, threats and ignoring a clear request for a lawyer are not." },
          { t: "mc", q: "A teen reads: \"If you talk, the officer can promise you will go home today.\" What is wrong with this line?", c: "Promising a benefit is an illegal \"hope of benefit\"", w: ["Nothing; officers may promise anything", "Officers may only promise freedom in writing", "It is true only at traffic stops"], why: "A promise of a lighter sentence or freedom makes a confession involuntary." }
        ] },
      { h: "Name the arena",
        read: "<p>The card has a short section for each place a teen might be questioned.</p>",
        items: [
          { t: "match", q: "Match each situation to the arena it belongs to.", pairs: [["An officer knocks on the front door and asks to come in", "Knock and talk"], ["A driver is pulled over for a broken tail light", "Traffic stop"], ["A \"fellow gamer\" in a chat turns out to be an officer", "Undercover or online"], ["An assistant principal looks through a backpack", "School grounds"]], why: "The rules change with the place: you never have to let officers in without a warrant, and at a traffic stop you owe only ID, registration and insurance." },
          { t: "mc", q: "In the driver's case, which items does the driver have to provide?", c: "ID, registration and insurance", w: ["Only the car keys", "A full written statement", "Permission to search the trunk"], why: "That is all the notes says you owe at a traffic stop." }
        ] },
      { h: "The script",
        read: "<p>The card's most important box is the script a teen should say. Sam wants the steps in order and the exact words.</p>",
        items: [
          { t: "order", q: "Put the four steps of the card in the right order.", items: ["Questioning begins", "Say clearly: I am invoking my right to remain silent, and I want a lawyer", "Stop talking and do not explain", "Legal questioning must stop"], why: "Say it clearly once, then stop talking. Explaining or small talk can be used later." },
          { t: "mc", q: "A teen says the script, then starts chatting with the officer to \"clear things up.\" What happens to the protection?", c: "The teen un-invoked their rights by talking again", w: ["Nothing at all, since the rights last for life once said", "The officer must stop asking questions forever anyway", "A lawyer arrives automatically and takes over the talk"], why: "Rights can be invoked at any point, but you can un-invoke them by choosing to keep answering." }
        ] },
      { h: "Write the card",
        read: "<p>Write the short text for the card (three or four sentences).</p>",
        items: [
          { t: "write", q: "Write the text of the card for teens. Say what lying is allowed, what is not, and give the exact sentence to say.", min: 40, kw: [["fact", "evidence", "lie", "bluff", "trick", "fake"], ["promise", "threat", "consequence", "benefit", "hurt"], ["remain silent", "lawyer", "attorney", "invoke"]], need: 3, why: "A strong card tells teens that facts can be faked but promises and threats cannot, then gives the sentence to say." }
        ] }
    ]
  }
};
