// Lesson 2.14: Debugging Strategies.  Notes: ist/karel/debugging-strategies.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the Debugging Strategies notes", href: "../karel/debugging-strategies.html" };
export default {
  id: "2.14", title: "Debugging Strategies", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Debugging Strategies notes, then fix three broken programs the way the notes says: say what should happen, find the exact line, and change one thing. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The debugging process", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: The Debugging Process</b>.</p>",
        items: [
          { t: "order", q: "Put the four debugging steps in the order the notes gives them.", items: ["Say what SHOULD happen", "Say what ACTUALLY happens", "Find the exact line", "Change ONE thing"], hint: "Step 1 to Step 4 in part 00." },
          { t: "mc", q: "What does the notes call the number-one mistake beginners make?", c: "Randomly changing code and re-running it", w: ["Writing far too many comments in the code", "Using a for loop where a while loop fits", "Naming a function too clearly for its job"], hint: "The highlighted box at the end of part 00." },
          { t: "mc", q: "Why should you change only one thing at a time?", c: "You will not know which of the changes fixed it", w: ["Karel can only read one single line at a time", "CodeHS only allows one change for each run", "It always makes the finished code much shorter"], hint: "Step 4." }
        ] },
      { h: "Two kinds of bugs and four techniques", links: [N],
        read: "<p>Read <b>01: Two Kinds of Bugs</b> and <b>02: Techniques That Actually Help</b>.</p>",
        items: [
          { t: "match", q: "Match each kind of bug to what it looks like.", pairs: [["Crash", "Karel runs into a wall or takes a ball that is not there, and the program stops"], ["Wrong result, no crash", "The program finishes but Karel ends in the wrong place or the balls are wrong"]], hint: "Part 01." },
          { t: "multi", q: "Which of these are techniques the notes lists? Pick all that apply.", c: ["Run it one function at a time", "Trace it on paper first", "Check your braces and parentheses", "Re-read the world before you code"], w: ["Delete the whole program and start over", "Add more turnLeft(); calls until it works"], hint: "Part 02 has four Technique boxes." }
        ] },
      { h: "Fix the bugs", links: [N],
        read: "<p>Each program below has one bug. Say what should happen, run it, find the line, and change one thing.</p>",
        items: [
          { t: "karel", w: 3, q: "Bug 1 (a crash). This program should move Karel 4 squares East and drop a ball. Karel starts at avenue 1, street 1, facing East in a world 5 squares wide. Fix the one bug so it ends on avenue 5 with a ball.",
            starter: "function main() {\n  for (var i = 0; i <= 4; i++) {\n    move();\n  }\n  putBall();\n}\n", world: world(5, 3), rules: { requireMain: true, mustUse: ["for"] },
            solution: "function main() {\n  for (var i = 0; i < 4; i++) {\n    move();\n  }\n  putBall();\n}\n", wrong: ["function main() {\n  for (var i = 0; i <= 4; i++) {\n    move();\n  }\n  putBall();\n}\n"], hint: "i <= 4 runs 5 times. Change it so it runs 4 times." },
          { t: "karel", w: 3, q: "Bug 2 (wrong result, no crash). Karel starts at avenue 1, street 3, facing East. The program should move 2 East, turn right, and move 2 South so that Karel ends at avenue 3, street 1 facing South. It ends in the wrong place. Fix it.",
            starter: "function turnRight() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n}\n", world: world(5, 4, 1, 3), rules: { requireMain: true, mustDefine: ["turnRight"] },
            solution: "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n}\n", wrong: ["function turnRight() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n}\n"], hint: "Read turnRight() line by line. A right turn needs three left turns." },
          { t: "karel", w: 3, q: "Bug 3 (a program that never ends). This should drop one ball on every corner from where Karel stands up to the wall (but not on the last corner). Karel starts at avenue 1, street 1, facing East. It is tested on several street lengths. Fix it.",
            starter: "function main() {\n  while (frontIsClear()) {\n    putBall();\n  }\n}\n", world: world(6, 3), hidden: [world(8, 2), world(4, 3)], rules: { requireMain: true, mustUse: ["while"] },
            solution: "function main() {\n  while (frontIsClear()) {\n    putBall();\n    move();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    putBall();\n  }\n}\n"], hint: "Nothing inside the loop ever changes whether the front is clear. Karel needs to move." }
        ] },
      { h: "Say it in words", links: [N],
        read: "<p>Think about how you found each bug.</p>",
        items: [{ t: "write", q: "Describe how you would debug a program where Karel finishes in the wrong place but nothing crashes. Use the steps from the notes. (3 sentences)", min: 30, kw: [["should", "supposed to"], ["actually", "watch", "run"], ["line", "trace", "paper", "one thing", "one change", "change one"]], need: 3, hint: "Say what should happen, say what actually happens, find the line, and change one thing." }]
      }
    ]
  },
  a: {
    pts: 100, company: "Netflix", color: "#E50914",
    tagline: "You are a quality-assurance intern. Test programs for the robot camera dolly came back broken, and you find and fix the bugs.",
    from: "Jamie Alvarez, QA Engineering", subject: "Three buggy robot programs to fix",
    email: "<p>Hi, three programs for the camera robot failed testing. For each one, say what should happen, find the exact line, and change one thing. A prop is a ball.</p><p>This is a classroom simulation, so the layouts are made up. Programs are tested on more than one layout.</p>",
    steps: [
      { h: "Bug A: The robot hits the wall", read: "<p>The dolly must slide 5 squares and place a prop, but it crashes.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East in a world 6 squares wide. It should slide 5 squares East and drop a prop. The program crashes. Fix the one bug.",
          starter: "function main() {\n  for (var i = 0; i <= 5; i++) {\n    move();\n  }\n  putBall();\n}\n", world: world(6, 3), hidden: [world(8, 2)], rules: { requireMain: true, mustUse: ["for"] },
          solution: "function main() {\n  for (var i = 0; i < 5; i++) {\n    move();\n  }\n  putBall();\n}\n", wrong: ["function main() {\n  for (var i = 0; i <= 5; i++) {\n    move();\n  }\n  putBall();\n}\n"], why: "i <= 5 runs six times, one move past the wall." }] },
      { h: "Bug B: The robot faces the wrong way", read: "<p>The dolly finishes pointing the wrong way.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. It should move 3 squares, turn around, and move back 3 squares, finishing on avenue 1 facing West. It finishes facing the wrong way. Fix the bug.",
          starter: "function turnAround() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n  move();\n}\n", world: world(5, 3), rules: { requireMain: true, mustDefine: ["turnAround"] },
          solution: "function turnAround() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n  move();\n}\n", wrong: ["function turnAround() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n  move();\n}\n"], why: "Three left turns make a right turn. Turning around is two." }] },
      { h: "Bug C: The robot never stops", read: "<p>The dolly keeps going and never finishes.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. It should pick up every ball along the street and stop at the wall, including a ball on the last corner. The program never ends. Fix it, so it also works on other streets.",
          starter: "function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n  }\n}\n", world: world(7, 3, 1, 1, "E", [[2, 1, 1], [7, 1, 1]]), hidden: [world(5, 2, 1, 1, "E", [[1, 1, 1], [3, 1, 1], [5, 1, 1]]), world(9, 3, 1, 1, "E", [[4, 1, 1]])],
          rules: { requireMain: true, mustUse: ["while"] },
          solution: "function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n"], why: "Nothing in the loop moved Karel, so the front was always clear. Once Karel moves, the last corner still needs a check after the loop." }] },
      { h: "Write the bug report", read: "<p>Write a short report for the QA board.</p>",
        items: [{ t: "write", q: "Pick one of the three bugs and write the report: what should happen, what actually happened, which line was wrong, and the one change you made. (3 to 4 sentences)", min: 40, kw: [["should", "supposed"], ["actually", "instead", "but"], ["line", "loop", "condition", "turnAround", "i <=", "move"], ["changed", "fix", "fixed", "change"]], need: 3, why: "A good report follows the steps: should, actually, exact line, one change." }]
      }
    ]
  }
};
