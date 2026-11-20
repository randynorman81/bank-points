/* PYTHON EDITOR: WHICH WALKTHROUGHS ARE OPEN (teacher settings, kept in the code so they change without the PIN)
   Each line is a walkthrough's id in the editor. A setting here WINS over whatever the grading page saved.
     hold: true   = listed but locked ("your teacher will open this")      hold: false = open
     passMin: 90  = score a student needs before the NEXT walkthrough opens
     fresh: true  = starts a new unlock chain (opens even if earlier units are unfinished)
     live: false  = hidden from students completely
   Leave a walkthrough out to use what the grading page saved.
   Unit 4 ids: a16 Booleans, a17 Logical Operators, a18 Comparison Operators, a19 If Statements,
               a20 If/Elif/Else, a21 Key Events, a22 For Loops, a23 General For Loops */
export const PY_SETTINGS = {
  a16: { hold: false, fresh: true, passMin: 90 },   // Unit 4 Walkthrough 1: Booleans (opened 11/17)
  a17: { hold: false, passMin: 90 },                // Walkthrough 2: Logical Operators (opened 11/17)
  a18: { hold: false, passMin: 90 },                // Walkthrough 3: Comparison Operators (opened 11/17)
  a19: { hold: true, passMin: 90 },                 // Walkthrough 4: If Statements
  a20: { hold: true, passMin: 90 },                 // Walkthrough 5: If, Elif, and Else
  a21: { hold: true, passMin: 90 },                 // Walkthrough 6: Key Events
  a22: { hold: true, passMin: 90 },                 // Walkthrough 7: For Loops in Python
  a23: { hold: true, passMin: 90 },                 // Walkthrough 8: General For Loops
  a26: { live: true, hold: true, passMin: 90 },     // Walkthrough 9: While Loops (published, still locked for students)
  a28: { live: true, hold: true, passMin: 90 },     // Walkthrough 10: Random Numbers (published, still locked for students)
  /* Unit 5: Functions and Parameters (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a29: { live: true, hold: true, fresh: true, passMin: 90 },   // Unit 5 Walkthrough 1: Functions and Parameters
  a30: { live: true, hold: true, passMin: 90 },                // Walkthrough 2: Multiple Parameters
  a31: { live: true, hold: true, passMin: 90 },                // Walkthrough 3: Return Values
  a32: { live: true, hold: true, passMin: 90 },                // Walkthrough 4: Return Values with Decisions and Loops
  a33: { live: true, hold: true, passMin: 90 },                // Walkthrough 5: Libraries and APIs
  a34: { live: true, hold: true, passMin: 90 },                // Walkthrough 6: Procedures and the Create Task
  /* Unit 6: Practice Performance Task (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a35: { live: true, hold: true, fresh: true, passMin: 90 },   // Unit 6 Walkthrough 1: Spot the Requirements
  a36: { live: true, hold: true, passMin: 90 },                // Practice PT 1: Quiz Master
  /* Unit 7: Basic Data Structures (all published, all locked until you open them; Walkthrough 1 starts its own chain) */
  a39: { live: true, hold: true, needBoth: true, fresh: true, passMin: 90 },   // Unit 7 Walkthrough 1: Lists and Indexing
  a40: { live: true, hold: true, needBoth: true, passMin: 90 },                // Walkthrough 2: Adding and Removing Items
  a41: { live: true, hold: true, needBoth: true, passMin: 90 },                // Walkthrough 3: For Loops and Lists
  a42: { live: true, hold: true, needBoth: true, passMin: 90 },                // Walkthrough 4: Simulations
  a43: { live: true, hold: true, needBoth: true, passMin: 90 },                // Walkthrough 5: Searching and Efficiency
  a44: { live: true, hold: true, needBoth: true, passMin: 90 }                 // Walkthrough 6: Data Abstraction and the Create Task
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
  if (!rec) return rec;
  const s = PY_SETTINGS[slot];
  let out = s ? Object.assign({}, rec, s) : rec;
  if (PY_PATCHES[slot]) out = PY_PATCHES[slot](JSON.parse(JSON.stringify(out)));
  return out;
}
