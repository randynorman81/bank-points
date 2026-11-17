/* BANK POINT AWARD RULES (teacher settings, kept in the code so they run without the PIN)
   The site checks these every 10 minutes. A rule runs ONCE, at the first check after "runAt",
   and never gives the same student the same award twice.
     editor:   "html" (IST HTML editor), "python" (AP CSP Python editor), "arduino" (Embedded Computing editor)
     lesson:   the assignment's id in that editor (HTML 3.5 Google Fonts = "6.35")
     period:   the class period on the bank roster
     minScore: lowest score that counts (100 = must be perfect)
     by:       the submission must be turned in at or before this time
     runAt:    when to check and give the points (usually the same as "by")
     amount / comment: what goes in the bank */
export const AWARDS = [
  { id: "ist-3b-google-fonts-1117", editor: "html", lesson: "6.35", period: "3B", minScore: 100,
    by: "2026-11-17T15:00:00-05:00", runAt: "2026-11-17T15:00:00-05:00",
    amount: 40, comment: "11/17, turned in before end of class" }
];
