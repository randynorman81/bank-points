// Lesson 2.5: The Main Function.  Notes: ist/karel/functions-in-karel.html (part 01, The Main Function)
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the Functions in Karel notes", href: "../karel/functions-in-karel.html" };
const TR = "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n";
export default {
  id: "2.5", title: "The Main Function", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the part of the Functions in Karel notes about main(), then write and repair programs that start in main(). You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Where every program starts", links: [N],
        read: "<p>Open the notes and read <b>01: The Main Function: Where Your Program Actually Starts</b>, the code example under it and the rule box.</p>",
        items: [
          { t: "mc", q: "What does the notes compare main() to?", c: "The start button of the program", w: ["The finish line of the program", "A comment about the program", "A second copy of Karel"], hint: "The first paragraph of part 01." },
          { t: "mc", q: "In the example, turnRight() is defined above main(). When does it actually run?", c: "Only when main() calls it", w: ["As soon as the file is read", "Before main() starts", "Never; functions above main() are ignored"], hint: "The paragraph under the example." },
          { t: "mc", q: "What is the rule to remember about a command that is not inside a function main() eventually calls?", c: "It never runs, wherever it is written in the file", w: ["It runs once before main() ever starts", "It runs once after main() finishes", "It runs only when Karel is on the first corner"], hint: "The Rule to remember box." },
          { t: "mc", q: "How does CodeHS read your file, according to the notes?", c: "Top to bottom, but it only starts acting at main()", w: ["Bottom to top, starting with the very last line", "Only the first ten lines and then it stops", "Only the commands that are written inside comments"], hint: "The sentence after the example code." }
        ] },
      { h: "Finish main()", links: [N],
        read: "<p>These programs already define functions. Your job is to write main() so the right things happen in the right order.</p>",
        items: [
          { t: "karel", w: 3, q: "turnRight() is already written. Fill in main(): Karel starts at avenue 1, street 3, facing East. Move 1, turn right, move 1, then drop a ball. Karel finishes at avenue 2, street 2, facing South.",
            starter: TR + "\nfunction main() {\n  // write main here\n}\n", world: world(4, 4, 1, 3), rules: { mustCall: ["turnRight"], requireMain: true },
            solution: TR + "\nfunction main() {\n  move();\n  turnRight();\n  move();\n  putBall();\n}\n", wrong: [TR + "\nfunction main() {\n  move();\n  move();\n  putBall();\n}\n"], hint: "Call turnRight() between the two moves." },
          { t: "karel", w: 3, q: "A helper function <code>stepUp</code> is written for you. Fill in main() so Karel builds a three-step staircase by calling stepUp() three times. Karel starts at avenue 1, street 1, facing East. The goal picture shows a ball on avenue 1 street 1, avenue 2 street 2 and avenue 3 street 3, with Karel ending at avenue 4, street 4 facing East.",
            starter: "function stepUp() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  // call stepUp three times\n}\n", world: world(5, 5), rules: { mustCall: ["stepUp"], requireMain: true },
            solution: "function stepUp() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  stepUp();\n  stepUp();\n  stepUp();\n}\n", wrong: ["function stepUp() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  stepUp();\n}\n"], hint: "main() only needs three lines: stepUp(); three times." }
        ] },
      { h: "Fix the broken program", links: [N],
        read: "<p>Read <b>03: Common Mistakes</b> in the Functions notes, then fix the program below.</p>",
        items: [
          { t: "karel", w: 3, q: "This program has a command outside every function, so it does not run. Fix it so Karel moves 1 East, turns right, moves 1, and drops a ball. Karel starts at avenue 1, street 3, facing East and should finish at avenue 2, street 2, facing South with a ball there.",
            starter: TR + "\nmove();\n\nfunction main() {\n  turnRight();\n  move();\n  putBall();\n}\n", world: world(4, 4, 1, 3), rules: { requireMain: true, mustCall: ["turnRight"] },
            solution: TR + "\nfunction main() {\n  move();\n  turnRight();\n  move();\n  putBall();\n}\n", wrong: [TR + "\nmove();\n\nfunction main() {\n  turnRight();\n  move();\n  putBall();\n}\n"], hint: "A command outside every function is an error. Move it inside main(), before turnRight();." },
          { t: "mc", q: "In which function should a command live if you want Karel to run it?", c: "In main(), or in a function that main() calls", w: ["Anywhere in the file, as long as it ends with a semicolon", "Only at the top of the file", "Only inside a comment"], hint: "Mistake 2 in part 03." },
          { t: "write", q: "In your own words, explain why every program needs a main() function. (2 to 3 sentences)", min: 25, kw: [["start", "begin", "first", "start button"], ["main"], ["function", "calls", "call", "runs", "run"]], need: 3, hint: "Say that Karel starts at main() and only runs other functions when main() calls them." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "FedEx", color: "#4D148C",
    tagline: "You are a logistics-software intern. The sorting robot's programs must start in main() and call small helper functions.",
    from: "Morgan Reese, Sorting Systems", subject: "Three programs for the sorting robot: all must start in main()",
    email: "<p>Hi, our sorting robot needs three small programs. All of them must start in <code>main()</code> and use helper functions. A package is a ball.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: Drop two packages", read: "<p>Two drop-off corners, two squares apart.</p>",
        items: [{ t: "karel", w: 3, q: "A helper function <code>dropOff</code> is already written: it drops a package and moves 2 squares. Write main() so Karel (avenue 1, street 1, facing East) calls dropOff three times. Karel ends at avenue 7, street 1, with a package on avenue 1, 3 and 5.",
          starter: "function dropOff() {\n  putBall();\n  move();\n  move();\n}\n\nfunction main() {\n  // write main here\n}\n", world: world(8, 3), rules: { mustCall: ["dropOff"], requireMain: true },
          solution: "function dropOff() {\n  putBall();\n  move();\n  move();\n}\n\nfunction main() {\n  dropOff();\n  dropOff();\n  dropOff();\n}\n", wrong: ["function dropOff() {\n  putBall();\n  move();\n  move();\n}\n\nfunction main() {\n  dropOff();\n  dropOff();\n}\n"], why: "main() reads like plain English: drop off, drop off, drop off." }] },
      { h: "Job 2: Corner delivery", read: "<p>A package must go around a corner using a right turn.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 4, facing East, and there is a package at avenue 3, street 4. Write turnRight() yourself. In main(): move to the package, take it, turn right, move 3 squares, and drop it. Karel finishes at avenue 3, street 1, facing South.",
          starter: "// define turnRight here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(5, 5, 1, 4, "E", [[3, 4, 1]]), rules: { mustDefine: ["turnRight"], mustCall: ["turnRight"], requireMain: true },
          solution: TR + "function main() {\n  move();\n  move();\n  takeBall();\n  turnRight();\n  move();\n  move();\n  move();\n  putBall();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  takeBall();\n  move();\n  putBall();\n}\n"], why: "Define turnRight() above main() and call it between the two walking parts." }] },
      { h: "Job 3: Repair this program", read: "<p>A teammate left a bug in the script.</p>",
        items: [{ t: "karel", w: 4, q: "This program does nothing useful because of where two commands are written. Fix it so Karel (avenue 1, street 3, facing East) moves 2 squares, turns right with turnRight(), and moves 2 squares. Karel should finish at avenue 3, street 1, facing South.",
          starter: TR + "\nmove();\nmove();\n\nfunction main() {\n  turnRight();\n  move();\n  move();\n}\n", world: world(5, 4, 1, 3), rules: { requireMain: true, mustCall: ["turnRight"] },
          solution: TR + "\nfunction main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n}\n", wrong: [TR + "\nmove();\nmove();\n\nfunction main() {\n  turnRight();\n  move();\n  move();\n}\n"], why: "The two move() lines were outside main(). Move them inside, before turnRight();." }] },
      { h: "Explain why", read: "<p>Write a short note for the new hire.</p>",
        items: [{ t: "write", q: "Explain what main() is for and why helper functions like dropOff() make main() easier to read. (2 to 3 sentences)", min: 30, kw: [["start", "begin", "first"], ["main"], ["read", "plain", "easier", "names", "name", "understand"], ["function", "dropOff", "helper"]], need: 3, why: "A strong answer says main() is where the program starts and that function names make it read like plain English." }] }
    ]
  }
};
