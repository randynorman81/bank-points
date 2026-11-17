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
  a23: { hold: true, passMin: 90 }                  // Walkthrough 8: General For Loops
};
export function withPySettings(slot, rec) {
  const s = PY_SETTINGS[slot];
  if (!rec || !s) return rec;
  return Object.assign({}, rec, s);
}
