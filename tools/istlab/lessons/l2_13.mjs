// Lesson 2.13: While Loops.  Notes: ist/karel/while-loops.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the While Loops notes", href: "../karel/while-loops.html" };
export default {
  id: "2.13", title: "While Loops", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the While Loops notes, then write loops that work on streets of different lengths. Your programs are also run on worlds you cannot see. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "When you don't know how many", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: When You Don't Know \"How Many\"</b>.</p>",
        items: [
          { t: "mc", q: "When is a while loop the right tool?", c: "When you do not know how many repeats you need", w: ["When you know the exact count", "When you need to define a function", "When you want to change Karel's direction"], hint: "The first paragraph of part 00." },
          { t: "mc", q: "Read this: while (frontIsClear()) { move(); } What does Karel do?", c: "Keeps moving until it faces a wall", w: ["Moves exactly once and then stops moving", "Moves exactly four times and then stops", "Turns left at every corner it passes"], hint: "\"While the front is clear, keep moving.\"" }
        ] },
      { h: "For loop or while loop?", links: [N],
        read: "<p>Read <b>01: For Loop vs. While Loop</b> and <b>02: A Realistic Example</b>.</p>",
        items: [
          { t: "match", q: "Match each loop to when it stops.", pairs: [["for loop", "When the counter reaches its limit"], ["while loop", "When the condition becomes false"]], hint: "The table in part 01." },
          { t: "mc", q: "Which rule of thumb does the notes give?", c: "Known count: for loop. Depends on what Karel finds: while loop", w: ["Always use a while loop for every repeat", "Always use a for loop for every repeat", "Use whichever loop has the fewer letters"], hint: "The Rule of thumb box." },
          { t: "karel", w: 3, q: "Move Karel to the wall with a while loop. Karel starts at avenue 1, street 1, facing East and should end on the last avenue. It is tested on streets of different lengths, so do not count the squares.",
            starter: "function main() {\n  // your while loop goes here\n}\n", world: world(6, 3), hidden: [world(9, 2), world(4, 4), world(12, 3)], rules: { mustUse: ["while"], mustNotUse: ["for"], requireMain: true, maxLines: 7 },
            solution: "function main() {\n  while (frontIsClear()) {\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 5; i++) {\n    move();\n  }\n}\n", "function main() {\n  move();\n  move();\n  move();\n  move();\n  move();\n}\n"], hint: "while (frontIsClear()) { move(); }" }
        ] },
      { h: "Picking up along the way", links: [N],
        read: "<p>Look again at the realistic example: it picks up balls until it hits the wall. Think about the last corner.</p>",
        items: [
          { t: "karel", w: 4, q: "Pick up every ball on the street. Karel starts at avenue 1, street 1, facing East and walks to the wall. In this world there is also a ball on the last corner, where Karel stops. Every ball must be gone, and Karel must finish on the last avenue.",
            starter: "function main() {\n  // while loop, then think about the last corner\n}\n", world: world(7, 3, 1, 1, "E", [[1, 1, 1], [3, 1, 1], [7, 1, 1]]), hidden: [world(5, 2, 1, 1, "E", [[2, 1, 1], [5, 1, 1]]), world(9, 3, 1, 1, "E", [[4, 1, 1], [6, 1, 1]])],
            rules: { mustUse: ["while", "if"], requireMain: true, maxLines: 14 },
            solution: "function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n"], hint: "The loop stops when the front is blocked, before Karel checks the last corner. Check once more after the loop." },
          { t: "mc", q: "Why does the loop in the notes' realistic example leave a ball on the last corner?", c: "The loop ends when the front is blocked, before Karel checks the last corner", w: ["Karel cannot pick up the last ball", "takeBall(); does not work next to a wall", "The loop runs one extra time"], hint: "Look at the order: check, pick up, move; the loop test runs before each pass." }
        ] },
      { h: "Infinite loops", links: [N],
        read: "<p>Read <b>03: The Danger: Infinite Loops</b>.</p>",
        items: [
          { t: "mc", q: "What is an infinite loop?", c: "A loop whose condition never becomes false", w: ["A loop that runs exactly one single time", "A for loop that uses a counter variable", "A loop that is written with no braces at all"], hint: "The first paragraph of part 03." },
          { t: "mc", q: "What must every while loop have inside it?", c: "Something that eventually makes the condition false", w: ["A comment explaining what the loop does", "A for loop nested inside of the while loop", "A turnAround(); call at the end of the loop"], hint: "The two Fix boxes." },
          { t: "write", q: "In your own words, explain why this loop never ends: <code>while (frontIsClear()) { putBall(); }</code> and how to fix it. (2 to 3 sentences)", min: 25, kw: [["move", "never moves", "does not move", "doesn't move"], ["front", "frontIsClear", "condition", "wall"], ["forever", "infinite", "never stops", "never ends", "never"]], need: 3, hint: "Karel never moves, so the front is always clear. Add move(); inside the loop." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "DoorDash", color: "#FF3008",
    tagline: "You are a delivery-routing intern. The delivery robot walks a street of unknown length, so every program must use a while loop.",
    from: "Sam Odell, Route Engineering", subject: "Three street programs that work on any street",
    email: "<p>Hi, our streets are different lengths and we do not know them ahead of time. Every program below must use a while loop and must work on streets you cannot see. A package is a ball.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: Drive to the end", read: "<p>The robot starts at the first house and must reach the last one.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 2, facing East. Move to the wall using a while loop. It is tested on streets of different lengths.",
          starter: "function main() {\n  \n}\n", world: world(7, 3, 1, 2), hidden: [world(5, 2, 1, 2), world(11, 4, 1, 2)], rules: { mustUse: ["while"], mustNotUse: ["for"], requireMain: true, maxLines: 7 },
          solution: "function main() {\n  while (frontIsClear()) {\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 6; i++) {\n    move();\n  }\n}\n"], why: "The condition frontIsClear() lets the loop stop wherever the wall is." }] },
      { h: "Job 2: Leave a package at every house", read: "<p>Every house gets one package, including the last one.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Drop one ball on every corner of the street, including the last corner, then stop at the wall. It is tested on streets of different lengths.",
          starter: "function main() {\n  \n}\n", world: world(6, 3), hidden: [world(8, 2), world(4, 5)], rules: { mustUse: ["while"], requireMain: true, maxLines: 9 },
          solution: "function main() {\n  while (frontIsClear()) {\n    putBall();\n    move();\n  }\n  putBall();\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    putBall();\n    move();\n  }\n}\n"], why: "The loop ends before the last corner, so one more putBall(); is needed after the loop." }] },
      { h: "Job 3: Collect the returns", read: "<p>Some houses have a return package waiting.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Walk to the wall and take every ball on the way, including a ball on the first and the last corner. It is tested on layouts you cannot see.",
          starter: "function main() {\n  \n}\n", world: world(8, 3, 1, 1, "E", [[1, 1, 1], [4, 1, 2], [8, 1, 1]]), hidden: [world(6, 2, 1, 1, "E", [[2, 1, 1], [6, 1, 1]]), world(10, 3, 1, 1, "E", [[3, 1, 1], [5, 1, 1], [7, 1, 1]])],
          rules: { mustUse: ["while"], requireMain: true, maxLines: 14 },
          solution: "function main() {\n  while (frontIsClear()) {\n    while (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n  while (ballsPresent()) {\n    takeBall();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n"], why: "One corner can hold more than one ball, so use while (ballsPresent()) to keep taking, and check the last corner after the loop." }] },
      { h: "Explain it", read: "<p>Write a short note for the team.</p>",
        items: [{ t: "write", q: "Explain why these programs use a while loop instead of a for loop, and what happens at the last corner. (2 to 3 sentences)", min: 30, kw: [["don't know", "do not know", "unknown", "different length", "any length", "how many"], ["while", "condition", "frontIsClear"], ["last corner", "last", "stops before", "before the last", "after the loop"]], need: 3, why: "A while loop adapts to any street length; the loop stops before the last corner, so it needs one more step after the loop." }] }
    ]
  }
};
