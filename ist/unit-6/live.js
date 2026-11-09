/* WHICH UNIT 3 ASSIGNMENTS ARE OPEN TO STUDENTS.
   An assignment that has step checks (3.1 to 3.7 = lessons "6.1" to "6.7") is closed until its lesson number is listed here.
   The teacher account can always open any lesson to check it. This one list is used by the editor AND the server (netlify/functions/code.js).
   To open an assignment, add its lesson number, then deploy. Lessons 7.x to 9.x are not controlled by this list. */
(function (root) { root.U7_LIVE = ["6.1", "6.2", "6.20", "6.21", "6.3"];
  /* a lesson that needs an earlier one first: it stays locked until the student has SUBMITTED the earlier one (any score can be submitted, so this only means "turned in").
     3.3 Part 2 (6.21) is open to students with no prerequisite. Part 3 (6.22) waits for Part 2 and still needs to be added to the list above to open. */
  root.U7_PREREQ = { "6.22": "6.21" }; })(typeof window !== "undefined" ? window : globalThis);
