// Lesson 2.16: Control Structures (CodeHS 2.16 + 2.17 More Karel Examples).  Notes: ist/karel/control-structures-example.html
import { world, hurdleWalls, TURN_AROUND } from "../karel_helpers.mjs";
const N = { label: "Open the Control Structures notes", href: "../karel/control-structures-example.html" };
const JUMP = "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction jumpHurdle() {\n  turnLeft();\n  move();\n  turnRight();\n  move();\n  turnRight();\n  move();\n  turnLeft();\n}\n";
export default {
  id: "2.16", title: "Control Structures", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Control Structures notes, a review that combines functions, loops and conditions, and then write programs that use all of them. Your programs are also tested on worlds you cannot see. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "The goal in plain English", links: [N],
        read: "<p>Open the notes and read the top of the page, <b>00: The Goal</b> and <b>01: Breaking It Into Pieces</b>.</p>",
        items: [
          { t: "match", q: "Match each plain-English step to the control structure the notes uses for it.", pairs: [["Keep going until the wall", "A while loop checking frontIsClear()"], ["At each corner, check for a ball", "An if / else checking ballsPresent()"], ["Turn around at the end", "Your own turnAround() function (or Super Karel's)"]], hint: "The table in part 01." },
          { t: "mc", q: "The notes say the goal is written in plain English before any code. Which habit from an earlier lesson is that?", c: "Top-down design", w: ["Commenting your code", "Debugging", "Indenting"], hint: "The paragraph under the goal." }
        ] },
      { h: "The full program", links: [N],
        read: "<p>Read <b>02: The Full Program</b> and <b>03: Every Control Structure From This Unit</b>.</p>",
        items: [
          { t: "mc", q: "In the full program, what does the while loop control?", c: "How long the work repeats, until a wall", w: ["Which action happens each time through the loop", "Which way Karel is facing as it goes along", "How many balls Karel is carrying in its bag"], hint: "\"Notice what's doing what.\"" },
          { t: "mc", q: "In the full program, what does the if / else control?", c: "Which action happens each time: take or put", w: ["How long the loop keeps on running for", "Whether Karel turns left at the end of it", "Which function main() calls at the very start"], hint: "The same paragraph." },
          { t: "karel", w: 4, q: "Build the notes' program, but make it correct on the last corner too. Karel starts at avenue 1, street 1, facing East at one end of a street of unknown length. At every corner including the last: if there is a ball take it, else put one down. Then turn around at the wall. Define turnAround yourself.",
            starter: "// write turnAround here\n\nfunction main() {\n  // while loop with if / else, then the last corner, then turn around\n}\n", world: world(6, 3, 1, 1, "E", [[2, 1, 1], [3, 1, 1], [6, 1, 1]]), hidden: [world(8, 2, 1, 1, "E", [[1, 1, 1], [5, 1, 1]]), world(4, 3, 1, 1, "E", [[4, 1, 1]])],
            rules: { mustUse: ["while", "if", "else"], mustDefine: ["turnAround"], mustCall: ["turnAround"], requireMain: true },
            solution: TURN_AROUND + "\nfunction main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    } else {\n      putBall();\n    }\n    move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  } else {\n    putBall();\n  }\n  turnAround();\n}\n",
            wrong: [TURN_AROUND + "\nfunction main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    } else {\n      putBall();\n    }\n    move();\n  }\n  turnAround();\n}\n"], hint: "The loop ends before Karel handles the last corner, so repeat the if / else once after the loop." }
        ] },
      { h: "More Karel examples", links: [N],
        read: "<p>Hurdles are a classic Karel problem. A hurdle is a wall one square high. Karel goes up, over and down, and you do not know where the hurdles are in advance.</p>",
        items: [
          { t: "karel", w: 4, q: "Random Hurdles. Karel starts at avenue 1, street 1, facing East in a world 8 squares wide with hurdles in different places. Use a for loop that runs 7 times: if the front is clear move, else jump the hurdle. Write <code>turnRight</code> and <code>jumpHurdle</code> yourself. Karel finishes at avenue 8, street 1.",
            starter: "// write turnRight and jumpHurdle here\n\nfunction main() {\n  // for loop with if / else\n}\n", world: world(8, 4, 1, 1, "E", [], hurdleWalls([2, 5])), hidden: [world(8, 4, 1, 1, "E", [], hurdleWalls([1, 4, 6])), world(8, 4, 1, 1, "E", [], hurdleWalls([3])), world(8, 4)],
            rules: { mustUse: ["for", "if", "else"], mustDefine: ["turnRight", "jumpHurdle"], mustCall: ["jumpHurdle"], requireMain: true },
            solution: JUMP + "\nfunction main() {\n  for (var i = 0; i < 7; i++) {\n    if (frontIsClear()) {\n      move();\n    } else {\n      jumpHurdle();\n    }\n  }\n}\n", wrong: [JUMP + "\nfunction main() {\n  for (var i = 0; i < 7; i++) {\n    move();\n  }\n}\n"], hint: "Each pass of the loop either moves one square, or jumps a hurdle (which also moves forward one square)." }
        ] },
      { h: "Choosing the tool", links: [N],
        read: "<p>Read the last paragraphs of the notes.</p>",
        items: [
          { t: "match", q: "Match each job to the best tool.", pairs: [["Repeat exactly 7 times", "A for loop"], ["Repeat until Karel reaches a wall", "A while loop"], ["Do something only when a ball is here", "An if statement"], ["Choose between two actions each time", "An if / else statement"], ["Give a group of commands a reusable name", "A function"]], hint: "Part 03 summarizes each structure." },
          { t: "write", q: "In your own words, explain how a while loop and an if/else work together in the full program. (2 to 3 sentences)", min: 25, kw: [["while", "loop"], ["if", "else", "decide", "choose"], ["how long", "until", "each time", "which action", "different problems", "two problems"]], need: 3, hint: "Say the while loop controls how long and the if/else controls which action each time." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Waymo", color: "#00A0B0",
    tagline: "You are a self-driving software intern. The cleanup robot at the test track must handle streets and obstacles it has never seen.",
    from: "Robin Castillo, Test Track Software", subject: "Three programs that must work on layouts we have not shown you",
    email: "<p>Hi, the test track changes every day. Your programs must use functions, loops and conditions together and must work on layouts you cannot see. A cone is a ball.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: Cleanup Karel", read: "<p>Remove every cone from the street, whatever its length.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Take every ball on the street (at most one per corner) including the first and last corners, walking to the wall. It is tested on other streets.",
          starter: "function main() {\n  \n}\n", world: world(7, 3, 1, 1, "E", [[1, 1, 1], [3, 1, 1], [7, 1, 1]]), hidden: [world(5, 2, 1, 1, "E", [[2, 1, 1], [5, 1, 1]]), world(9, 3, 1, 1, "E", [[4, 1, 1], [6, 1, 1]])], rules: { mustUse: ["while", "if"], requireMain: true },
          solution: "function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n"], why: "The last corner is handled after the loop." }] },
      { h: "Job 2: Hurdle course", read: "<p>Random hurdles on the track.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East in a world 9 squares wide, with hurdles in places you cannot see. Cross the whole street with a for loop that runs 8 times: if the front is clear move, else jump the hurdle. Write <code>turnRight</code> and <code>jumpHurdle</code> and finish at avenue 9.",
          starter: "// write your functions here\n\nfunction main() {\n  \n}\n", world: world(9, 4, 1, 1, "E", [], hurdleWalls([3, 6])), hidden: [world(9, 4, 1, 1, "E", [], hurdleWalls([1, 2, 7])), world(9, 4, 1, 1, "E", [], hurdleWalls([5])), world(9, 4)],
          rules: { mustUse: ["for", "if", "else"], mustDefine: ["turnRight", "jumpHurdle"], mustCall: ["jumpHurdle"], requireMain: true },
          solution: JUMP + "\nfunction main() {\n  for (var i = 0; i < 8; i++) {\n    if (frontIsClear()) {\n      move();\n    } else {\n      jumpHurdle();\n    }\n  }\n}\n", wrong: [JUMP + "\nfunction main() {\n  for (var i = 0; i < 8; i++) {\n    move();\n  }\n}\n"], why: "Each loop pass either moves or jumps a hurdle, and both advance one square." }] },
      { h: "Job 3: Fill and return", read: "<p>Fill the street, then come back.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Put exactly one ball on every corner of the street, but only where there is none already (including the last corner). Then turn around and walk back to avenue 1. Write <code>turnAround</code> yourself. It is tested on other streets.",
          starter: "// write turnAround here\n\nfunction main() {\n  \n}\n", world: world(6, 3, 1, 1, "E", [[2, 1, 1], [6, 1, 1]]), hidden: [world(8, 2, 1, 1, "E", [[1, 1, 1], [4, 1, 1]]), world(4, 3)],
          rules: { mustUse: ["while", "if"], mustDefine: ["turnAround"], mustCall: ["turnAround"], requireMain: true },
          solution: TURN_AROUND + "\nfunction main() {\n  while (frontIsClear()) {\n    if (noBallsPresent()) {\n      putBall();\n    }\n    move();\n  }\n  if (noBallsPresent()) {\n    putBall();\n  }\n  turnAround();\n  while (frontIsClear()) {\n    move();\n  }\n}\n", wrong: [TURN_AROUND + "\nfunction main() {\n  while (frontIsClear()) {\n    if (noBallsPresent()) {\n      putBall();\n    }\n    move();\n  }\n  turnAround();\n  while (frontIsClear()) {\n    move();\n  }\n}\n"], why: "Fill the corners with a while loop and an if, handle the last corner after the loop, turn around, and walk back with a second while loop." }] },
      { h: "Explain your choices", read: "<p>Write a note for the track team.</p>",
        items: [{ t: "write", q: "Explain which control structure you used for each part of Job 3 (filling, checking each corner, turning around, walking back) and why. (3 to 4 sentences)", min: 40, kw: [["while"], ["if"], ["function", "turnAround"], ["don't know", "do not know", "unknown", "any length", "different", "until"]], need: 3, why: "A strong answer picks a while loop when the length is unknown, an if for the check, and a function for turning around." }] }
    ]
  }
};
