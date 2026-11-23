/* THE LESSON TABLE for Units 3 to 6: one row per lesson, with the slot ids of its three NEW parts. (The walkthrough already exists.)
   asg  = the graded Python assignment (a project the student writes), game = the Code Vault game (netlify/functions/pybank.js).
   wt   = the position of the lesson's walkthrough in its unit (assignments sit just after it, games just after the assignment).
   pts  = [assignment points, game points]. Hidden (live: false) until the teacher opens them in teacher-settings/python-editor.js. */
const U = { 3: "Unit 3: Programming with Python", 4: "Unit 4: Python Control Structures", 5: "Unit 5: Functions and Parameters", 6: "Unit 6: Practice Performance Task" };
const rows = [];
let asg = 126;
const add = (unit, id, n, t, wt, pts) => rows.push({ unit, UNIT: U[unit], id, n, t, wt, pts: pts || [100, 10], asg: null, game: null });
[["Variable Names", 1], ["Storing Strings, Ints, Floats, and Booleans", 2], ["Getting Input From the User", 3], ["Joining Strings, Ints, Floats, and Booleans", 4], ["Indexing: Pulling One Character From a String", 5], ["Slicing: Pulling a Piece Out of a String", 6], ["Finding Text With .find()", 7], ["Math With Numbers From the User", 8], ["Division That Gives a Float ( / )", 9], ["Floor Division That Rounds Down ( // )", 10], ["Modulus: The Remainder ( % )", 11], ["Order of Operations", 12], ["Tracing Code by Hand", 13]].forEach((x, i) => add(3, "u3l" + (i + 1), "3." + (i + 1), x[0], x[1]));
[["4.1", "Booleans", 1], ["4.2", "Logical Operators", 2], ["4.3", "Comparison Operators", 3], ["4.4", "If Statements", 4], ["4.5", "If, Elif, and Else", 5], ["4.6", "Key Events", 6], ["4.7", "For Loops", 7], ["4.8", "General For Loops", 8], ["4.9", "For Loop Practice", 8.6], ["4.10", "While Loops", 9], ["4.10b", "Loop and a Half", 10], ["4.11", "Random Numbers", 11]].forEach((x, i) => add(4, "u4l" + (i + 1), x[0], x[1], x[2]));
[["Functions and Parameters", 1], ["Multiple Parameters", 2], ["Return Values", 3], ["Return Values with Decisions and Loops", 4], ["Libraries and APIs", 5], ["Procedures and the Create Task", 6]].forEach((x, i) => add(5, "u5l" + (i + 1), "5." + (i + 1), x[0], x[1]));
add(6, "u6l1", "6.1", "The Create Task: Rules and Scoring", 1, [50, 10]);
add(6, "u6l2", "6.2", "Video, Reference Sheet, Written Responses", 1.8, [50, 10]);
add(6, "u6l3", "6.3", "Practice PT 1: Color Counter", 2);
rows.forEach((r, i) => { r.asg = "a" + (126 + i); r.game = "a" + (126 + rows.length + i); });
module.exports = { rows, U, byId: Object.fromEntries(rows.map((r) => [r.id, r])) };
