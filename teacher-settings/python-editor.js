/* PYTHON EDITOR: WHICH WALKTHROUGHS ARE OPEN (teacher settings, kept in the code so they change without the PIN)
   Each line is a walkthrough's id in the editor. A setting here WINS over whatever the grading page saved.
     hold: true   = listed but locked ("your teacher will open this")      hold: false = open
     passMin: 90  = score a student needs before the NEXT walkthrough opens
     fresh: true  = starts a new unlock chain (opens even if earlier units are unfinished)
     live: false  = hidden from students completely
     lock: true   = this slot ignores the master switch below and follows its own line (used to close Unit 3 for the year). To open it again: change hold: true to hold: false
                    (the unlock chain then works: pass a walkthrough with 90 and its assignment opens, and so on), or remove lock: true to make it open to everyone with no chain.
   Leave a walkthrough out to use what the grading page saved.
   Unit 4 ids: a16 Booleans, a17 Logical Operators, a18 Comparison Operators, a19 If Statements,
               a20 If/Elif/Else, a21 Key Events, a22 For Loops, a23 General For Loops */
import { PY_RECORDS } from "./python-records.js";
import { fixUiWords, fixA1, fixA5, fixA7, fixA13, fixA33, headingAtEdge, TAB_SLOTS } from "./python-fixes.js";
import { UNIT8 } from "./python-unit8.js";
import { CONCEPTS } from "./python-concepts.js";
const REPO = Object.assign({}, PY_RECORDS, CONCEPTS);   /* every record the repo carries: a101 to a193 (python-records.js) and the Unit 10.8, 11 and 16 walkthroughs a194 to a201 (python-concepts.js) */
/* THE MASTER SWITCH. While this is true EVERYTHING is open to everyone: every walkthrough, assignment, game and quiz is live, nothing is held, nothing is in an unlock chain,
   and games can be played as a guest with no sign-in (nothing is saved for a guest). When the curriculum is finished, set it to false and the per-slot lines below take over again. */
export const OPEN_EVERYTHING = true;
/* The assignment and game records for a101 to a193 live in python-records.js (generated from tools/missions by `node tools/missions/bundle.mjs`), so they go live with a deploy and need no PIN. */
export const repoSlots = () => Object.keys(REPO);
export const PY_SETTINGS = {
  /* UNIT 3 is CLOSED for the year (locked: students see the lessons but cannot open them). The unlock chain is set up for when it opens again:
     Walkthrough 1 starts the chain, each walkthrough needs 90 to open its assignment, and the assignment (then the next walkthrough) follows. */
  a1: { live: true, lock: true, hold: true, fresh: true, passMin: 90 },
  a2: { live: true, lock: true, hold: true, passMin: 90 },
  a3: { live: true, lock: true, hold: true, passMin: 90 },
  a4: { live: true, lock: true, hold: true, passMin: 90 },
  a5: { live: true, lock: true, hold: true, passMin: 90 },
  a6: { live: true, lock: true, hold: true, passMin: 90 },
  a7: { live: true, lock: true, hold: true, passMin: 90 },
  a8: { live: true, lock: true, hold: true, passMin: 90 },
  a9: { live: true, lock: true, hold: true, passMin: 90 },
  a10: { live: true, lock: true, hold: true, passMin: 90 },
  a11: { live: true, lock: true, hold: true, passMin: 90 },
  a12: { live: true, lock: true, hold: true, passMin: 90 },
  a13: { live: true, lock: true, hold: true, passMin: 90 },
  a16: { live: true, hold: false, fresh: true, passMin: 90, ungated: true },   // Unit 4 Walkthrough 1: Booleans (opened 11/17)
  a17: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 2: Logical Operators (opened 11/17)
  a18: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 3: Comparison Operators (opened 11/17)
  a19: { live: true, hold: false, passMin: 90, ungated: true },                 // Walkthrough 4: If Statements
  a20: { live: true, hold: false, passMin: 90, ungated: true },                 // Walkthrough 5: If, Elif, and Else
  a21: { live: true, hold: false, passMin: 90, ungated: true },                 // Walkthrough 6: Key Events
  a22: { live: true, hold: false, passMin: 90, ungated: true },                 // Walkthrough 7: For Loops in Python
  a23: { live: true, hold: false, passMin: 90, ungated: true },                 // Walkthrough 8: General For Loops
  a26: { live: true, hold: false, passMin: 90, ungated: true },     // Walkthrough 9: While Loops (published, still locked for students)
  a27: { live: true, hold: false, passMin: 90, num: 10, ungated: true },   // Walkthrough 10: Loop and a Half (live, still locked for students until you open it)
  a28: { live: true, hold: false, passMin: 90, num: 11, ungated: true },   // Walkthrough 11: Random Numbers (renumbered from 10 so it comes after Loop and a Half; published, still locked for students)
  /* Unit 5: Functions and Parameters (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a29: { live: true, hold: false, fresh: true, passMin: 90, ungated: true },   // Unit 5 Walkthrough 1: Functions and Parameters
  a30: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 2: Multiple Parameters
  a31: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 3: Return Values
  a32: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 4: Return Values with Decisions and Loops
  a33: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 5: Libraries and APIs
  a34: { live: true, hold: false, passMin: 90, ungated: true },                // Walkthrough 6: Procedures and the Create Task
  /* Unit 6: Practice Performance Task (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a35: { live: true, hold: false, fresh: true, passMin: 90, ungated: true },   // Unit 6 Walkthrough 1: Spot the Requirements
  a36: { live: true, hold: false, passMin: 90, ungated: true },                // Practice PT 1: Quiz Master
  /* Unit 7: Basic Data Structures (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a39: { live: true, hold: false, needBoth: true, fresh: true, passMin: 90, ungated: true },   // Unit 7 Walkthrough 1: Lists and Indexing
  a40: { live: true, hold: false, needBoth: true, passMin: 90, ungated: true },                // Walkthrough 2: Adding and Removing Items
  a41: { live: true, hold: false, needBoth: true, passMin: 90, ungated: true },                // Walkthrough 3: For Loops and Lists
  a42: { live: true, hold: false, needBoth: true, passMin: 90, ungated: true },                // Walkthrough 4: Simulations
  a43: { live: true, hold: false, needBoth: true, passMin: 90, ungated: true },                // Walkthrough 5: Searching and Efficiency
  a44: { live: true, hold: false, needBoth: true, passMin: 90, ungated: true },                // Walkthrough 6: Data Abstraction and the Create Task
  /* Unit 8: Digital Information (10 gate walkthroughs, each with a graded assignment under it, and a quiz) */
  a45: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", fresh: true, passMin: 100, ungated: true },   // Unit 8 Walkthrough 1: Intro to Digital Information (a gate: 100% opens the assignment under it)
  a46: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 2: Number Systems (a gate: 100% opens the assignment under it)
  a47: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 3: Encoding Text with Binary (a gate: 100% opens the assignment under it)
  a48: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 4: Pixel Images (a gate: 100% opens the assignment under it)
  a49: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 5: Hexadecimal (a gate: 100% opens the assignment under it)
  a50: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 6: Pixel Colors (a gate: 100% opens the assignment under it)
  a51: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 7: Image Manipulation (a gate: 100% opens the assignment under it)
  a52: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 8: Data Compression (a gate: 100% opens the assignment under it)
  a53: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 9: Lossy Compression (a gate: 100% opens the assignment under it)
  a54: { live: true, hold: false, needBoth: true, nextLabel: "the assignment under it", passMin: 100, ungated: true },   // Unit 8 Walkthrough 10: Cryptography (a gate: 100% opens the assignment under it)
  a55: { live: true, part: "project", seq: 1.5, passMin: 0, ungated: true },   // Unit 8 Assignment 1: graded work under Walkthrough 1
  a56: { live: true, part: "project", seq: 2.5, passMin: 0, ungated: true },   // Unit 8 Assignment 2: graded work under Walkthrough 2
  a57: { live: true, part: "project", seq: 3.5, passMin: 0, ungated: true },   // Unit 8 Assignment 3: graded work under Walkthrough 3
  a58: { live: true, part: "project", seq: 4.5, passMin: 0, ungated: true },   // Unit 8 Assignment 4: graded work under Walkthrough 4
  a59: { live: true, part: "project", seq: 5.5, passMin: 0, ungated: true },   // Unit 8 Assignment 5: graded work under Walkthrough 5
  a60: { live: true, part: "project", seq: 6.5, passMin: 0, ungated: true },   // Unit 8 Assignment 6: graded work under Walkthrough 6
  a61: { live: true, part: "project", seq: 7.5, passMin: 0, ungated: true },   // Unit 8 Assignment 7: graded work under Walkthrough 7
  a62: { live: true, part: "project", seq: 8.5, passMin: 0, ungated: true },   // Unit 8 Assignment 8: graded work under Walkthrough 8
  a63: { live: true, part: "project", seq: 9.5, passMin: 0, ungated: true },   // Unit 8 Assignment 9: graded work under Walkthrough 9
  a64: { live: true, part: "project", seq: 10.5, passMin: 0, ungated: true },   // Unit 8 Assignment 10: graded work under Walkthrough 10
  a65: { live: true, hold: true, passMin: 90 },  // Unit 8 Quiz: Digital Information (opens when you open it)
  /* Unit 9: Practice Performance Task (starts its own chain) */
  a66: { live: true, hold: false, fresh: true, passMin: 90, ungated: true },   // Unit 9 Practice PT 2: The Shopping List
  /* WALKTHROUGH + MISSION pilot (a101 and up). Each pair: a Walkthrough worth 50 points that must reach 100 on the auto-checker to open its Mission (100 points).
     A Mission at 90 opens the next Walkthrough. All hidden from students (live: false) until you change a line to live: true.
     To open the whole Unit 10 pilot, change live: false to live: true on a101 to a108. fresh: true starts a new chain at the first item of a unit. */
  a124: { live: true, fresh: true, passMin: 100, num: 1, ungated: true },   // Unit 10 Walkthrough 1: The Internet Is a Highway (10.1 and 10.2): lanes, vehicles, modem vs router
  a125: { live: true, fresh: true, passMin: 100, num: 2, ungated: true },   // Unit 10 Walkthrough 2: Your Router Is a Neighborhood: private IPs, NAT, DHCP, IPv6
  a101: { live: true, fresh: true, passMin: 100, num: 3, ungated: true },   // Unit 10 Walkthrough 1: Internet Addresses (10.3)
  a102: { live: true, passMin: 90, ungated: true },                 // Mission 10.3: The Network Club Bouncer
  a103: { live: true, passMin: 100, num: 4, ungated: true },                // Unit 10 Walkthrough 2: DNS (10.5)
  a104: { live: true, passMin: 90, ungated: true },                 // Mission 10.5: DNS Detective
  a105: { live: true, passMin: 100, num: 5, ungated: true },                // Unit 10 Walkthrough 3: Routing (10.6)
  a106: { live: true, passMin: 90, ungated: true },                 // Mission 10.6: Storm Warning
  a107: { live: true, passMin: 100, num: 6, ungated: true },                // Unit 10 Walkthrough 4: Packets and Protocols (10.7)
  a108: { live: true, passMin: 90, ungated: true },                 // Mission 10.7: Packet Post Office
  a109: { live: true, passMin: 100, ungated: true },                // Unit 7 Walkthrough 7 (after Walkthroughs 1 to 6): Lists, Meet the Cast
  a110: { live: true, passMin: 90, ungated: true },                 // Mission 7.1: Cartoon Creator Studio
  a111: { live: true, passMin: 0, ungated: true },                  // Unit 8 FINAL vault: a 10-round review of all lessons (hidden: only you can see and play it)
  /* Unit 8 lesson vaults: a game that is the SECOND assessment for each lesson (after the walkthrough and its Python assignment). Hidden for now. */
  a112: { live: true, passMin: 0, ungated: true },                  // Vault 8.1: Intro to Digital Information
  a113: { live: true, passMin: 0, ungated: true },                  // Vault 8.2: Number Systems
  a114: { live: true, passMin: 0, ungated: true },                  // Vault 8.3: Encoding Text with Binary
  a115: { live: true, passMin: 0, ungated: true },                  // Vault 8.4: Pixel Images
  a116: { live: true, passMin: 0, ungated: true },                  // Vault 8.5: Hexadecimal
  a117: { live: true, passMin: 0, ungated: true },                  // Vault 8.6: Pixel Colors
  a118: { live: true, passMin: 0, ungated: true },                  // Vault 8.7: Image Manipulation
  a119: { live: true, passMin: 0, ungated: true },                  // Vault 8.8: Data Compression
  a120: { live: true, passMin: 0, ungated: true },                  // Vault 8.9: Lossy Compression
  a121: { live: true, passMin: 0, ungated: true },                  // Vault 8.10: Cryptography
  a122: { live: true, fresh: true, passMin: 0, ungated: true },                  // Castle Byte: the Unit 8 survival horror adventure (learn or challenge mode)
  a123: { live: true, fresh: true, passMin: 0, ungated: true },                  // Dead Signal: the Unit 10 survival horror adventure (learn or challenge mode)
  /* UNITS 3 TO 6, the third and fourth part of every lesson: a graded ASSIGNMENT (a126 to a159) and a Code Vault GAME (a160 to a193). All hidden until you change a line to live: true. Not gating (passMin 0). */
  a126: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a127: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a128: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a129: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a130: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a131: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a132: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a133: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a134: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a135: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a136: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a137: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a138: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a139: { live: true, fresh: false, passMin: 0, ungated: true },
  a140: { live: true, fresh: false, passMin: 0, ungated: true },
  a141: { live: true, fresh: false, passMin: 0, ungated: true },
  a142: { live: true, fresh: false, passMin: 0, ungated: true },
  a143: { live: true, fresh: false, passMin: 0, ungated: true },
  a144: { live: true, fresh: false, passMin: 0, ungated: true },
  a145: { live: true, fresh: false, passMin: 0, ungated: true },
  a146: { live: true, fresh: false, passMin: 0, ungated: true },
  a147: { live: true, fresh: false, passMin: 0, ungated: true },
  a148: { live: true, fresh: false, passMin: 0, ungated: true },
  a149: { live: true, fresh: false, passMin: 0, ungated: true },
  a150: { live: true, fresh: false, passMin: 0, ungated: true },
  a151: { live: true, fresh: false, passMin: 0, ungated: true },
  a152: { live: true, fresh: false, passMin: 0, ungated: true },
  a153: { live: true, fresh: false, passMin: 0, ungated: true },
  a154: { live: true, fresh: false, passMin: 0, ungated: true },
  a155: { live: true, fresh: false, passMin: 0, ungated: true },
  a156: { live: true, fresh: false, passMin: 0, ungated: true },
  a157: { live: true, fresh: false, passMin: 0, ungated: true },
  a158: { live: true, fresh: false, passMin: 0, ungated: true },
  a159: { live: true, fresh: false, passMin: 0, ungated: true },
  a160: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a161: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a162: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a163: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a164: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a165: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a166: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a167: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a168: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a169: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a170: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a171: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a172: { live: true, lock: true, hold: true, fresh: false, passMin: 0 },
  a173: { live: true, fresh: false, passMin: 0, ungated: true },
  a174: { live: true, fresh: false, passMin: 0, ungated: true },
  a175: { live: true, fresh: false, passMin: 0, ungated: true },
  a176: { live: true, fresh: false, passMin: 0, ungated: true },
  a177: { live: true, fresh: false, passMin: 0, ungated: true },
  a178: { live: true, fresh: false, passMin: 0, ungated: true },
  a179: { live: true, fresh: false, passMin: 0, ungated: true },
  a180: { live: true, fresh: false, passMin: 0, ungated: true },
  a181: { live: true, fresh: false, passMin: 0, ungated: true },
  a182: { live: true, fresh: false, passMin: 0, ungated: true },
  a183: { live: true, fresh: false, passMin: 0, ungated: true },
  a184: { live: true, fresh: false, passMin: 0, ungated: true },
  a185: { live: true, fresh: false, passMin: 0, ungated: true },
  a186: { live: true, fresh: false, passMin: 0, ungated: true },
  a187: { live: true, fresh: false, passMin: 0, ungated: true },
  a188: { live: true, fresh: false, passMin: 0, ungated: true },
  a189: { live: true, fresh: false, passMin: 0, ungated: true },
  a190: { live: true, fresh: false, passMin: 0, ungated: true },
  a191: { live: true, fresh: false, passMin: 0, ungated: true },
  a192: { live: true, fresh: false, passMin: 0, ungated: true },
  a193: { live: true, fresh: false, passMin: 0, ungated: true },
  /* Unit 10.8, Unit 11 and Unit 16 walkthroughs (AP Big Idea 4 and 5): each is a stand-alone lesson, 100% on the code and on the questions, not part of an unlock chain */
  a194: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 10.8 Parallel and Distributed Computing
  a195: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 11.1 Beneficial and Harmful Effects
  a196: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 11.2 The Digital Divide
  a197: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 11.3 Crowdsourcing and Citizen Science
  a198: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 16.1 Computing Bias
  a199: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 16.2 Copyright, Creative Commons, and Open Source
  a200: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 16.3 Privacy and Personal Data
  a201: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 16.4 Safe Computing
  a202: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.1 Extracting Information from Data
  a203: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.2 Big Data, Metadata, and Scale
  a204: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.3 Cleaning Data
  a205: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.4 Filtering, Transforming, and Combining Data
  a206: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.5 Visualizing Data
  a207: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 12.6 Bias, Sampling, and Trust in Data
  a208: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 7.7 Developing Algorithms and Equivalent Algorithms
  a209: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 7.8 Efficiency, Reasonable Time, and Heuristics
  a210: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 7.9 Undecidable Problems
  a211: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 19.1 Collaboration, Purpose, and Function
  a212: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 19.2 The Development Process
  a213: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 19.3 Errors and Debugging
  a214: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 14.1 String Methods
  a215: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 14.2 Looping Through Strings
  a216: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 14.3 Splitting, Joining, and Formatting Text
  a217: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 13.1 Data-Driven Insight project
  a218: { live: true, fresh: true, passMin: 100, needBoth: true, ungated: true },   // 15.1 Practice PT 3: Personal Data Tracker
};
/* WORDING CHANGES to a walkthrough, kept in the code (no PIN). Each one gets a copy of the walkthrough and changes it. */
const STEP5_ODD = "Now test an odd number **without changing your code above**. Below your last line, type `number = 7`, then type the same four `print` lines again under it (you can copy and paste your own lines). Add an **end-of-line comment** at the end of your last print line with what the four answers were for 7. If that line already has a comment, add to it. [[How do I test 7?|oddtest]]";
export const PY_PATCHES = {
  a18: function (rec) {   /* Walkthrough 3, Comparison Operators: Step 5 adds the odd-number test below, instead of editing earlier lines */
    (rec.blocks || []).forEach(function (b) { if (b.make) b.make = b.make.map(function (t) { return /^Now test an odd number/.test(t) ? STEP5_ODD : t; }); });
    if (rec.tips) rec.tips.oddtest = { title: "How do I test 7?", sections: [
      { p: "Leave your code for 12 alone. Add the test for 7 **underneath** it:" },
      { ex: ["number = 7", "print(number % 2 == 0)", "print(number % 2 == 1)", "print(number % 3 == 0)", "print(number % 5 == 0)   # for 7 the answers were False, True, False, False"] },
      { p: "Because `number = 7` comes later, the new prints use 7 while the first four still use 12. Run it and read the last four answers." }
    ] };
    return rec;
  }
};
export function withPySettings(slot, rec) {
  if (REPO[slot]) rec = Object.assign({}, rec || {}, REPO[slot]);   /* the repo copy wins for the slots it has */
  if (!rec) return rec;
  const s = PY_SETTINGS[slot];
  let out = s ? Object.assign({}, rec, s) : rec;
  if (OPEN_EVERYTHING && !(s && s.lock)) out = Object.assign({}, out, { live: true, hold: false, ungated: true });   /* lock: true = this slot keeps ITS OWN line below even while everything else is open */
  if (PY_PATCHES[slot]) out = PY_PATCHES[slot](JSON.parse(JSON.stringify(out)));
  return out;
}
/* Walkthrough fixes from the 2026-11-23 audit (the code is in python-fixes.js): a5 introduces //, a7 and a13 get more steps, a33 gets its line breaks back, and the "# Step N" instruction says the left edge everywhere. */
function addPatch(slot, fn) { const prev = PY_PATCHES[slot]; PY_PATCHES[slot] = prev ? function (r) { return fn(prev(r)); } : fn; }
TAB_SLOTS.forEach(function (s) { addPatch(s, headingAtEdge); });
for (let u = 1; u <= 13; u++) addPatch("a" + u, fixUiWords);
addPatch("a1", fixA1); addPatch("a5", fixA5); addPatch("a7", fixA7); addPatch("a13", fixA13); addPatch("a33", fixA33);
/* Unit 8 walkthroughs a45 to a54: the long versions (7 to 9 steps each, generated from tools/missions/u8-walk.txt) replace the 2-step versions saved on the grading server. The saved questions, gating and settings are kept. */
Object.keys(UNIT8).forEach(function (s) {
  addPatch(s, function (r) { const u = UNIT8[s]; r.blocks = JSON.parse(JSON.stringify(u.blocks)); r.tips = Object.assign({}, r.tips || {}, JSON.parse(JSON.stringify(u.tips))); r.checks = JSON.parse(JSON.stringify(u.checks)); return r; });
});
