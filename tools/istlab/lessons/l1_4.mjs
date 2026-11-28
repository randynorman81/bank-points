// Lesson 1.4: Your Phone's Invisible Footprint.  Notes: the 1.4 lesson page and the interactive case files (ist/unit-1/caught-by-their-data.html)
const PAGE = { label: "Open the 1.4 lesson page", href: "../unit-1/1-4-your-phones-invisible-footprint.html" };
const CASES = { label: "Open the case files", href: "../unit-1/caught-by-their-data.html" };
export default {
  id: "1.4", title: "Your Phone's Invisible Footprint",
  w: {
    pts: 50,
    intro: "You will go through the 1.4 lesson page and the interactive case files. In the case files you open each case, step through its evidence, and play the match game. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The lesson page", links: [PAGE],
        read: "<p>Open the 1.4 lesson page. Read the bell ringer and the \"Notes and Examples\" box under it.</p>",
        items: [
          { t: "multi", q: "Which three categories does the 1.4 page use to organize what your phone gives away?", c: ["Location", "Habits", "Hidden data"], w: ["Battery life", "Screen size"], hint: "The Notes and Examples paragraph names all three." },
          { t: "mc", q: "How many people did BTK kill between 1974 and 1991, according to the bell ringer?", c: "Ten", w: ["Four", "Seven", "Fourteen"], hint: "First sentence of the bell ringer." },
          { t: "mc", q: "What mistake does the bell ringer say led to BTK's arrest in 2005?", c: "A floppy disk whose hidden file data pointed to him", w: ["A fingerprint left on a stolen car at a scene", "A confession that he made to a friend by phone", "A photo of him that ran in a local newspaper"], hint: "The same sentence says he mailed it to police." }
        ] },
      { h: "Case 1: BTK (Dennis Rader)", links: [CASES],
        read: "<p>Open the case files and choose <b>Dennis Rader (BTK)</b>. Step through all six steps on the <b>The evidence</b> tab and read the \"What he did not think about\" tab.</p>",
        items: [
          { t: "mc", q: "How did police answer BTK's question about whether a floppy disk could be traced?", c: "With a newspaper ad saying it would be OK", w: ["With a phone call to the TV station", "With a letter from a lawyer to his home", "By refusing to answer at all"], hint: "Step 1, The question. The ad was addressed to \"Rex.\"" },
          { t: "text", q: "The file's hidden properties named a church. Type the name of the church.", a: ["christ lutheran church", "christ lutheran"], hint: "Step 3, Open the file properties.", ph: "Name of the church" },
          { t: "text", q: "What word do we use for hidden data about a file, such as who last saved it?", a: ["metadata", "meta data", "meta-data"], hint: "It is in bold on the Tech tab.", ph: "One word" },
          { t: "order", q: "Put the BTK steps in order.", items: ["He asks whether a floppy disk can be traced", "The purple floppy disk arrives", "Investigators read the file's hidden properties", "A church website shows the council president is Dennis Rader", "DNA confirms the match", "He is arrested"], hint: "The steps are numbered on the evidence tab." },
          { t: "mc", q: "Why was it legal for police to tell him \"it will be OK\" when it was not true?", c: "Police may lie to suspects, as lesson 1.3 showed", w: ["The ad was a private message, not a statement", "He had already confessed on the phone", "The law only covers lies told in a courtroom"], hint: "Link back to the lesson about the interrogation room." }
        ] },
      { h: "Case 2: Bryan Kohberger", links: [CASES],
        read: "<p>Choose <b>Bryan Kohberger</b>. Step through the evidence and read the \"What he did not think about\" tab.</p>",
        items: [
          { t: "mc", q: "In which window of time did his phone not connect to cell towers near the home?", c: "About 3 a.m. to 5 a.m.", w: ["About 9 a.m. to 11 a.m.", "About noon to 2 p.m.", "About 7 p.m. to 9 p.m."], hint: "Step 2, The night of the crime." },
          { t: "mc", q: "What does the case file mean by \"an absence is also data\"?", c: "A phone that stops connecting leaves a gap in the log", w: ["A phone that is turned off cannot be traced by any means", "A missing text message can never be recovered by anyone", "A deleted app erases every one of its records for good"], hint: "It is in the Tech tab for Kohberger." },
          { t: "text", q: "In which month and year did the four University of Idaho students die? Type it as month and year.", a: ["november 2022", "nov 2022", "november 13, 2022"], hint: "The Kohberger story tab gives the date.", ph: "Month and year" },
          { t: "mc", q: "What did the phone data do on its own in the case?", c: "It fit together with the car, the DNA and earlier visits", w: ["It proved the whole case against him all by itself", "It was ignored by investigators because it was a gap", "It replaced the need for a warrant in every county"], hint: "Step 6 and the lesson line say it did not prove everything on its own." }
        ] },
      { h: "Match the evidence", links: [CASES],
        read: "<p>Open the other six case files and read each one. Then open the <b>Match the evidence</b> tab and play the game.</p>",
        items: [
          { t: "match", q: "Match each case to the data that caught or cleared the person.", pairs: [["BTK (Rader)", "Hidden file properties on a floppy disk"], ["Kohberger", "Cell-tower records: a gap and a pattern"], ["Golden State Killer", "A cousin's DNA on a genealogy site"], ["Ross Ulbricht", "An old forum post with an email address"], ["John McAfee", "GPS coordinates inside a photo"], ["Reality Winner", "Tracking dots printed on a page"], ["Richard Dabate", "A step counter on a wrist"], ["Rodney Bradford", "A Facebook server record"]], hint: "The match game on the page uses these exact pairs." },
          { t: "mc", q: "What two things do the printer tracking dots in the Reality Winner case encode?", c: "The printer's serial number and the date and time", w: ["The name of the user who printed it and her home address", "The text of the page and the name of the person who read it", "The paper brand and the price of the ink that was used"], hint: "Winner case, Tech tab." },
          { t: "mc", q: "What made the Rodney Bradford case different from the others?", c: "The data cleared an innocent person", w: ["The data was wrong and was thrown out", "Nobody was ever arrested", "It involved a printer and a laser"], hint: "The case file says it is \"the other direction.\"" }
        ] },
      { h: "The fair warning", links: [CASES],
        read: "<p>Read the last section, \"The fair-warning part: this is about you too,\" and the five audit questions.</p>",
        items: [
          { t: "write", q: "Pick one of the three categories (Location, Habits, Hidden data) and explain, in your own words, how it could be used against an ordinary person. Give one example from the case files. (2 to 3 sentences)", min: 25, kw: [["location", "habit", "hidden", "metadata", "gps", "tower"], ["btk", "kohberger", "mcafee", "winner", "dabate", "bradford", "floppy", "cell", "photo", "fitbit", "printer"], ["track", "track you", "used", "against", "evidence", "records", "trail"]], need: 3, hint: "Name the category, name a case, and say how the data is used." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Apple", color: "#1d1d1f",
    tagline: "You are a privacy-settings intern. The team is writing a short guide to help teens see what their iPhone quietly records.",
    from: "Jordan Lee, Privacy Education Team", subject: "Audit the three kinds of phone data for the teen guide",
    email: "<p>Hi, we need a clear, honest guide for teens about the information a phone keeps without being asked. We use three categories: <b>Location</b>, <b>Habits</b> and <b>Hidden data</b>.</p><p>First sort a list, then connect each category to a real case from class, then give advice. This is a classroom simulation, so the details are made up.</p>",
    steps: [
      { h: "Sort the data",
        read: "<p>Decide which of the three categories each item belongs to.</p>",
        items: [
          { t: "match", q: "Match each item to its category.", pairs: [["Cell-tower connections near a home", "Location"], ["The apps you open every night at 11 p.m.", "Habits"], ["GPS coordinates saved inside a photo file", "Hidden data"]], why: "Location is where you were. Habits are what you do and when. Hidden data is information stored inside files that you never typed." },
          { t: "mc", q: "A teen turns off location tagging for the camera app. Which category does this shrink?", c: "Hidden data in the photos, and the location in them", w: ["Only the habits category and never anything about photos", "Nothing at all, since photos never hold any locations", "Only the cell-tower records that the carrier keeps"], why: "The McAfee case shows how photo metadata can reveal where a photo was taken." }
        ] },
      { h: "Connect the cases",
        read: "<p>The guide uses real cases as warnings. Match each case to the lesson it teaches.</p>",
        items: [
          { t: "match", q: "Match each case to the lesson it teaches teens.", pairs: [["BTK", "Files carry hidden metadata you never type"], ["Kohberger", "A missing signal is also evidence"], ["Golden State Killer", "Relatives' choices can reveal your DNA"], ["Rodney Bradford", "A trail can protect the innocent"]], why: "Each case shows one way data you did not think about reached a real investigation." },
          { t: "mc", q: "A teen says: \"If I turn my phone off, I disappear.\" Which case shows the problem with that idea?", c: "Kohberger: the carrier logged the connections around it", w: ["BTK: a floppy disk with a hidden file was mailed in", "Winner: a color printer added tiny dots to the page", "Bradford: a post on a website proved he was at home"], why: "The gap in the log lined up with the crime. \"Off\" is not invisible." }
        ] },
      { h: "Advice to teens",
        read: "<p>Jordan wants two concrete tips and one honest warning.</p>",
        items: [
          { t: "multi", q: "Which tips belong in the guide? Pick all that fit what you learned.", c: ["Turn off location tagging for the camera", "Check what an app strips from photos before posting an original", "Search yourself the way an investigator would"], w: ["Delete the cell-phone plan to avoid logs", "Post the original file so nothing gets lost"], why: "Each good tip removes a trail or helps you see the one that exists." },
          { t: "write", q: "Write the guide's short warning (three or four sentences). Name the three categories, give one real case, and say why this matters even for people who did nothing wrong.", min: 45, kw: [["location", "habit", "hidden", "metadata"], ["btk", "kohberger", "bradford", "mcafee", "case", "floppy", "tower"], ["innocent", "ordinary", "anyone", "you too", "everyone", "protect", "nothing wrong"]], need: 3, why: "A good warning is honest that the same trail that catches criminals also records ordinary people, and can clear them too." }
        ] }
    ]
  }
};
