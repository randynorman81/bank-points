// Lesson 2.7: Commenting Your Code and Abstraction (CodeHS 2.7 + 2.8).  Notes: ist/karel/commenting-your-code.html, ist/karel/abstraction.html
import { world, TURN_RIGHT } from "../karel_helpers.mjs";
const NC = { label: "Open the Commenting notes", href: "../karel/commenting-your-code.html" }, NA = { label: "Open the Abstraction notes", href: "../karel/abstraction.html" };
const TOWER = "// Stack 3 balls on one corner\nfunction buildTower() {\n  putBall();\n  putBall();\n  putBall();\n}\n\n// Move two squares East\nfunction moveToNextSpot() {\n  move();\n  move();\n}\n\n";
export default {
  id: "2.7", title: "Commenting Your Code and Abstraction", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Commenting and Abstraction notes, then add comments and hide repeated code behind a function. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Comments", links: [NC],
        read: "<p>Open the Commenting notes and read all of it, parts 00 to 03.</p>",
        items: [
          { t: "text", q: "In CodeHS's Karel, which two characters start a comment on a line?", a: ["//", "two slashes", "two forward slashes"], hint: "Part 00, first paragraph.", ph: "Type the two characters" },
          { t: "mc", q: "What effect does a comment have on what Karel does?", c: "None at all; Karel skips right over it", w: ["It makes Karel move slower", "It tells Karel to repeat the line", "It turns the line into a function"], hint: "Part 00." },
          { t: "match", q: "Match each kind of comment to where it goes.", pairs: [["Comment on its own line", "Usually right above the code it explains"], ["Comment at the end of a line", "A short note about just that one line of code"]], hint: "Part 01, Two Ways to Write a Comment." },
          { t: "mc", q: "Which comment does the notes call genuinely useful?", c: "// skip the 2nd corner, it has a ball", w: ["// move forward one square here", "// this line is a comment about code", "// call the move command now"], hint: "Part 02, Good Comments vs. Bad Comments." },
          { t: "mc", q: "When should you write the comment for a function, according to the good habit box?", c: "At the same time you write the function", w: ["Days later, after you have finished testing", "Only at the moment when the program has a bug", "Never, because Karel does not read them anyway"], hint: "The Good habit box at the end of part 03." },
          { t: "karel", w: 3, q: "Add a comment on the line right above each function in this program. Do not change what the program does: Karel (avenue 1, street 1, facing East) builds a tower of 3 balls, moves 2 squares, and builds another.",
            starter: "function buildTower() {\n  putBall();\n  putBall();\n  putBall();\n}\n\nfunction moveToNextSpot() {\n  move();\n  move();\n}\n\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n", world: world(6, 3), rules: { requireMain: true, commentEachFunction: true, minComments: 3 },
            solution: TOWER + "// Start here: two towers\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n", wrong: ["function buildTower() {\n  putBall();\n  putBall();\n  putBall();\n}\n\nfunction moveToNextSpot() {\n  move();\n  move();\n}\n\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n"], hint: "Put a line starting with // directly above function buildTower, moveToNextSpot and main." }
        ] },
      { h: "Abstraction", links: [NA],
        read: "<p>Open the Abstraction notes and read all of it, parts 00 to 03.</p>",
        items: [
          { t: "mc", q: "What is abstraction, according to the notes?", c: "Hiding messy details behind a simple name", w: ["Deleting all of the code you do not need", "Making every comment in the program longer", "Writing every single command in the code twice"], hint: "The first sentence of the page." },
          { t: "match", q: "Match each real-life example to what it hides.", pairs: [["A car's gas pedal", "How fuel injection and the engine work"], ["A TV remote's power button", "The circuits that turn the TV on"], ["Ordering one burger", "Every step the kitchen takes to make it"]], hint: "Part 01 has three examples." },
          { t: "mc", q: "The notes say abstraction is NOT the same as deleting the detail. Why?", c: "The three turnLeft(); calls are still there, just hidden", w: ["Because the detail is stored on another computer far away", "Because the detail is copied into a comment above it", "Because Karel remembers the detail forever and ever"], hint: "Part 03, Mix-up 2." },
          { t: "karel", w: 3, q: "This program repeats the same three commands. Hide them behind one function called <code>dropAndStep</code> (put a ball, move, move) and call it three times in main(). Karel starts at avenue 1, street 1, facing East and drops a ball on avenues 1, 3 and 5.",
            starter: "function main() {\n  putBall();\n  move();\n  move();\n  putBall();\n  move();\n  move();\n  putBall();\n  move();\n  move();\n}\n", world: world(8, 3), rules: { mustDefine: ["dropAndStep"], mustCall: ["dropAndStep"], requireMain: true },
            solution: "function dropAndStep() {\n  putBall();\n  move();\n  move();\n}\n\nfunction main() {\n  dropAndStep();\n  dropAndStep();\n  dropAndStep();\n}\n", wrong: ["function main() {\n  putBall();\n  move();\n  move();\n}\n"], hint: "Move the three commands into function dropAndStep() and call it three times." },
          { t: "write", q: "In your own words, explain how comments and abstraction help the next programmer who reads your code. (2 to 3 sentences)", min: 25, kw: [["comment", "note", "explain"], ["abstraction", "function", "name", "hide", "hides", "hiding"], ["read", "understand", "reader", "programmer", "later", "future"]], need: 3, hint: "Say comments explain the why, and a function name hides the details behind a simple name." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "GitHub", color: "#24292F",
    tagline: "You are an intern on a code-review team. Every submission must be readable: comments above functions and repeated code hidden behind a clear name.",
    from: "Dev Patel, Code Review Lead", subject: "Three review tasks: comments and abstraction",
    email: "<p>Hi, before code is merged we ask that it be easy to read. That means a comment above every function and no repeated blocks. Use our standard Karel robot for the tests.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Task 1: Add the missing comments", read: "<p>Reviewers rejected a submission with no comments.</p>",
        items: [{ t: "karel", w: 3, q: "Add a comment line above every function in the submission below (including main). The program must keep doing the same thing: Karel (avenue 1, street 3, facing East) moves 1 square, turns right, and moves 1 square. It ends at avenue 2, street 2, facing South.",
          starter: "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  turnRight();\n  move();\n}\n", world: world(5, 4, 1, 3), rules: { requireMain: true, commentEachFunction: true },
          solution: "// Turn Karel 90 degrees to the right\nfunction turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\n// Move, turn right, move\nfunction main() {\n  move();\n  turnRight();\n  move();\n}\n", wrong: ["function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  turnRight();\n  move();\n}\n"], why: "A comment line goes right above each function and says what it is for." }] },
      { h: "Task 2: Hide the repetition", read: "<p>A submission repeats the same four commands. Abstract them.</p>",
        items: [{ t: "karel", w: 4, q: "The program below builds a staircase by repeating the same commands. Create a function <code>placeAndClimb</code> (put a ball, move, turn left, move, then turn right), call it three times from main(), and put a comment above every function. Karel starts at avenue 1, street 1, facing East and ends at avenue 4, street 4 facing East.",
          starter: "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n}\n", world: world(6, 6), rules: { mustDefine: ["turnRight", "placeAndClimb"], mustCall: ["placeAndClimb"], requireMain: true, commentEachFunction: true },
          solution: "// Turn right with three left turns\nfunction turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\n// Drop a ball and climb one step\nfunction placeAndClimb() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n}\n\n// Three steps\nfunction main() {\n  placeAndClimb();\n  placeAndClimb();\n  placeAndClimb();\n}\n", wrong: ["function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  putBall();\n}\n"], why: "main() now reads as three steps, and the detail is hidden inside placeAndClimb()." }] },
      { h: "Task 3: Two towers, fully documented", read: "<p>Write it from scratch with comments and abstraction.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Build two towers of 3 balls, on avenue 1 and avenue 4. Write <code>buildTower</code> and <code>moveToNextSpot</code> (3 moves), a comment above each function, and keep main() to three lines.",
          starter: "// write your functions here\n\nfunction main() {\n}\n", world: world(7, 3), rules: { mustDefine: ["buildTower", "moveToNextSpot"], mustCall: ["buildTower", "moveToNextSpot"], requireMain: true, commentEachFunction: true, maxLines: 30 },
          solution: "// Stack 3 balls on this corner\nfunction buildTower() {\n  putBall();\n  putBall();\n  putBall();\n}\n\n// Move three squares East\nfunction moveToNextSpot() {\n  move();\n  move();\n  move();\n}\n\n// Two towers, three squares apart\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n", wrong: ["function main() {\n  putBall();\n}\n"], why: "Comments say what each function is for; the function names hide the details." }] },
      { h: "Explain it", read: "<p>Write your review note.</p>",
        items: [{ t: "write", q: "Explain, in your own words, the difference between what a comment does and what abstraction does. (2 to 3 sentences)", min: 30, kw: [["comment", "note", "ignores", "ignored"], ["abstraction", "function", "name", "hides", "hide"], ["human", "reader", "read", "explain", "details", "why"]], need: 3, why: "A comment is a note for humans that Karel ignores; abstraction hides details behind a name so you can use them without thinking about them." }] }
    ]
  }
};
