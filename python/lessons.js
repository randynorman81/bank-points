/* THE LESSON MAP behind the editor's "Lessons" picker (the big pop-up that replaced the long dropdown).
   One box per lesson. A lesson can have up to four parts:
     notes : the lesson notes page, a file inside /apcsp/ (leave it out if there is no page yet)
     w     : the walkthrough slot id, or a list of ids       (e.g. "a45")
     p     : the graded assignment (project) slot id           (e.g. "a55")
     g     : the game slot id                                  (e.g. "a112")
   A part that is not here, or that the student cannot see yet, shows as "Coming soon". Anything in the editor that is NOT named
   here (quizzes, unit-wide games like Castle Byte, new records you have not added yet) still shows up under "Quizzes and unit games"
   at the bottom of its unit, so nothing ever disappears from the picker.
   To add a lesson: add a line to that unit's list. To start a new unit: add a block to PY_LESSONS. */
window.PY_LESSONS = [
  { n: 3, name: "Programming with Python", notes: "unit-3/index.html", lessons: [
    { t: "Variable Names", w: "a1", p: "a126", g: "a160" },
    { t: "Storing Strings, Ints, Floats, and Booleans", w: "a2", p: "a127", g: "a161" },
    { t: "Getting Input From the User", w: "a3", p: "a128", g: "a162" },
    { t: "Joining Strings, Ints, Floats, and Booleans", w: "a4", p: "a129", g: "a163" },
    { t: "Indexing: Pulling One Character From a String", w: "a5", p: "a130", g: "a164" },
    { t: "Slicing: Pulling a Piece Out of a String", w: "a6", p: "a131", g: "a165" },
    { t: "Finding Text With .find()", w: "a7", p: "a132", g: "a166" },
    { t: "Math With Numbers From the User", w: "a8", p: "a133", g: "a167" },
    { t: "Division That Gives a Float ( / )", w: "a9", p: "a134", g: "a168" },
    { t: "Floor Division That Rounds Down ( // )", w: "a10", p: "a135", g: "a169" },
    { t: "Modulus: The Remainder ( % )", w: "a11", p: "a136", g: "a170" },
    { t: "Order of Operations", w: "a12", p: "a137", g: "a171" },
    { t: "Tracing Code by Hand", w: "a13", p: "a138", g: "a172" }
  ] },
  { n: 4, name: "Python Control Structures", notes: "unit-4/index.html", lessons: [
    { id: "4.1", t: "Booleans", notes: "booleans.html", w: "a16", p: "a139", g: "a173" },
    { id: "4.2", t: "Logical Operators", notes: "logical-operators.html", w: "a17", p: "a140", g: "a174" },
    { id: "4.3", t: "Comparison Operators", notes: "comparison-operators.html", w: "a18", p: "a141", g: "a175" },
    { id: "4.4", t: "If Statements", notes: "if-statements.html", w: "a19", p: "a142", g: "a176" },
    { id: "4.5", t: "If, Elif, and Else", notes: "if-elif-else.html", w: "a20", p: "a143", g: "a177" },
    { id: "4.6", t: "Key Events", notes: "key-events.html", w: "a21", p: "a144", g: "a178" },
    { id: "4.7", t: "For Loops", notes: "for-loops.html", w: "a22", p: "a145", g: "a179" },
    { id: "4.8", t: "General For Loops", notes: "general-for-loops.html", w: "a23", p: "a146", g: "a180" },
    { id: "4.9", t: "For Loop Practice", notes: "for-loop-practice.html", p: "a147", g: "a181" },
    { id: "4.10", t: "While Loops", notes: "while-loops.html", w: "a26", p: "a148", g: "a182" },
    { id: "", t: "Loop and a Half", notes: "loop-and-a-half.html", w: "a27", p: "a149", g: "a183" },
    { id: "4.11", t: "Random Numbers", notes: "random-numbers.html", w: "a28", p: "a150", g: "a184" }
  ] },
  { n: 5, name: "Functions and Parameters", notes: "unit-5/index.html", lessons: [
    { id: "5.1", t: "Functions and Parameters", notes: "functions-parameters.html", w: "a29", p: "a151", g: "a185" },
    { id: "5.2", t: "Multiple Parameters", notes: "multiple-parameters.html", w: "a30", p: "a152", g: "a186" },
    { id: "5.3", t: "Return Values", notes: "return-values.html", w: "a31", p: "a153", g: "a187" },
    { id: "5.4", t: "Return Values with Decisions and Loops", notes: "return-decisions-loops.html", w: "a32", p: "a154", g: "a188" },
    { id: "5.5", t: "Libraries and APIs", notes: "libraries-apis.html", w: "a33", p: "a155", g: "a189" },
    { id: "5.6", t: "Procedures and the Create Task", notes: "procedures-create-task.html", w: "a34", p: "a156", g: "a190" }
  ] },
  { n: 6, name: "Practice Performance Task", notes: "unit-6/index.html", lessons: [
    { id: "6.1", t: "The Create Task: Rules and Scoring", notes: "create-task-rules.html", w: "a35", p: "a157", g: "a191" },
    { id: "6.2", t: "Video, Reference Sheet, Written Responses", notes: "create-task-video-ppr.html", p: "a158", g: "a192" },
    { id: "6.3", t: "Practice PT 1: Color Counter", notes: "practice-pt-color-counter.html", w: "a36", p: "a159", g: "a193" }
  ] },
  { n: 7, name: "Basic Data Structures", notes: "unit-7/index.html", lessons: [
    { id: "7.1", t: "Lists and Indexing", notes: "lists-indexing.html", w: ["a39", "a109"], g: "a110" },
    { id: "7.2", t: "Adding and Removing Items", notes: "list-operations.html", w: "a40" },
    { id: "7.3", t: "For Loops and Lists", notes: "lists-for-loops.html", w: "a41" },
    { id: "7.4", t: "Simulations", notes: "simulations.html", w: "a42" },
    { id: "7.5", t: "Searching and Efficiency", notes: "searching-efficiency.html", w: "a43" },
    { id: "7.6", t: "Data Abstraction and the Create Task", notes: "data-abstraction.html", w: "a44" }
  ] },
  { n: 8, name: "Digital Information", notes: "unit-8/index.html", lessons: [
    { id: "8.1", t: "Intro to Digital Information", notes: "digital-info-intro.html", w: "a45", p: "a55", g: "a112" },
    { id: "8.2", t: "Number Systems", notes: "number-systems.html", w: "a46", p: "a56", g: "a113" },
    { id: "8.3", t: "Encoding Text with Binary", notes: "encoding-text.html", w: "a47", p: "a57", g: "a114" },
    { id: "8.4", t: "Pixel Images", notes: "pixel-images.html", w: "a48", p: "a58", g: "a115" },
    { id: "8.5", t: "Hexadecimal", notes: "hexadecimal.html", w: "a49", p: "a59", g: "a116" },
    { id: "8.6", t: "Pixel Colors", notes: "pixel-colors.html", w: "a50", p: "a60", g: "a117" },
    { id: "8.7", t: "Image Manipulation", notes: "image-manipulation.html", w: "a51", p: "a61", g: "a118" },
    { id: "8.8", t: "Data Compression", notes: "data-compression.html", w: "a52", p: "a62", g: "a119" },
    { id: "8.9", t: "Lossy Compression", notes: "lossy-compression.html", w: "a53", p: "a63", g: "a120" },
    { id: "8.10", t: "Cryptography", notes: "cryptography.html", w: "a54", p: "a64", g: "a121" }
  ] },
  { n: 9, name: "Practice Performance Task", notes: "unit-9/index.html", lessons: [
    { id: "9.1", t: "Practice PT 2: The Shopping List", notes: "practice-pt-shopping-list.html", w: "a66" }
  ] },
  { n: 10, name: "The Internet", notes: "unit-10/index.html", lessons: [
    { id: "10.1", t: "The Internet Is a Highway (10.1 and 10.2)", notes: "internet-highway.html", w: "a124" },
    { id: "10.3", t: "Internet Addresses", notes: "internet-addresses.html", w: "a101", g: "a102" },
    { id: "10.4", t: "Your Router Is a Neighborhood (NAT and DHCP)", notes: "router-neighborhood.html", w: "a125" },
    { id: "10.5", t: "DNS: The Internet's Phone Book", notes: "dns.html", w: "a103", g: "a104" },
    { id: "10.6", t: "Routing and Fault Tolerance", notes: "routing.html", w: "a105", g: "a106" },
    { id: "10.7", t: "Packets and Protocols", notes: "packets-protocols.html", w: "a107", g: "a108" },
    { id: "10.8", t: "Parallel and Distributed Computing", notes: "parallel-distributed.html", w: "a194" }
  ] },
  { n: 11, name: "Project: The Effects of the Internet", notes: "unit-11/index.html", lessons: [
    { id: "11.1", t: "Beneficial and Harmful Effects", notes: "beneficial-harmful.html", w: "a195" },
    { id: "11.2", t: "The Digital Divide", notes: "digital-divide.html", w: "a196" },
    { id: "11.3", t: "Crowdsourcing and Citizen Science", notes: "crowdsourcing.html", w: "a197" }
  ] },
  { n: 16, name: "Project: The Impact of Computing", notes: "unit-16/index.html", lessons: [
    { id: "16.1", t: "Computing Bias", notes: "computing-bias.html", w: "a198" },
    { id: "16.2", t: "Copyright, Creative Commons, and Open Source", notes: "copyright-open-source.html", w: "a199" },
    { id: "16.3", t: "Privacy and Personal Data", notes: "privacy-pii.html", w: "a200" },
    { id: "16.4", t: "Safe Computing: Passwords, Phishing, and Malware", notes: "safe-computing.html", w: "a201" }
  ] }
];
