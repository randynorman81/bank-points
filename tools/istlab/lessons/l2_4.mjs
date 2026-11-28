// Lesson 2.4: Functions in Karel.  Notes: ist/karel/functions-in-karel.html (parts 00 and 02)
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the Functions in Karel notes", href: "../karel/functions-in-karel.html" };
const TR = "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n";
export default {
  id: "2.4", title: "Functions in Karel", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Functions in Karel notes and write functions that run on the page. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "What is a function?", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: What Is a Function?</b></p>",
        items: [
          { t: "mc", q: "What is a function, according to the notes?", c: "A named group of commands you define once and reuse", w: ["A command that Karel already knows how to do", "A comment that explains what the code does", "A square somewhere in Karel's world"], hint: "The first sentence of part 00." },
          { t: "match", q: "Match each word with what it means in the notes.", pairs: [["Defining a function", "Describing a new command with the word function and curly braces"], ["Calling a function", "Using its name followed by () to run it"], ["camelCase", "No spaces, each new word capitalized after the first, like turnRight"]], hint: "The three boxes in part 00." },
          { t: "text", q: "What word starts a function definition in the notes? Type just that word.", a: ["function"], hint: "\"___ means I'm about to describe a new function.\"", ph: "One word" }
        ] },
      { h: "Why bother with functions?", links: [N],
        read: "<p>Read <b>02: Why Bother With Functions At All?</b></p>",
        items: [
          { t: "match", q: "Match each reason to its explanation.", pairs: [["Less typing", "Write the three turnLeft(); calls once and use the name a hundred times"], ["Fewer mistakes", "If there is a bug you fix it in exactly one place"], ["Easier to read", "turnRight(); reads like plain English"]], hint: "The three reason cards." },
          { t: "mc", q: "The notes compares a function to what in real life?", c: "A nickname for a whole routine, like \"get ready\"", w: ["A map of the whole neighborhood around school", "A broken tool that must be fixed by someone", "A new wall that gets added to Karel's world"], hint: "The Real-life comparison box." }
        ] },
      { h: "Write your own functions", links: [N],
        read: "<p>Now write functions yourself. The grader runs your whole program, so keep <code>function main()</code> at the bottom, as the notes show.</p>",
        items: [
          { t: "karel", w: 3, q: "Define a function called <code>turnRight</code> from three turnLeft(); calls. In main(), move 2 squares East, turn right, move 2 squares South and drop a ball. Karel starts at avenue 1, street 3, facing East.",
            starter: "// define turnRight here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(5, 4, 1, 3), rules: { mustDefine: ["turnRight"], mustCall: ["turnRight"], requireMain: true },
            solution: TR + "function main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  putBall();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n  move();\n  move();\n  putBall();\n}\n"], hint: "Define turnRight() above main(), then call it inside main()." },
          { t: "karel", w: 3, q: "Define a function called <code>turnAround</code> that turns Karel around. In main(), move 3 squares East, turnAround, and move 3 squares back. Karel starts at avenue 1, street 1, facing East.",
            starter: "// define turnAround here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(5, 3), rules: { mustDefine: ["turnAround"], mustCall: ["turnAround"], requireMain: true },
            solution: "function turnAround() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n  move();\n}\n", wrong: ["function turnAround() {\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n  move();\n}\n"], hint: "A turn around is two turnLeft(); calls." }
        ] },
      { h: "Common mistakes", links: [N],
        read: "<p>Read <b>03: Common Mistakes</b>.</p>",
        items: [
          { t: "multi", q: "Which of these are the three common mistakes the notes lists?", c: ["Forgetting the parentheses", "Writing commands outside of any function", "Forgetting a curly brace"], w: ["Using too many comments", "Naming a function in camelCase"], hint: "Part 03 has Mistake 1, 2 and 3." },
          { t: "mc", q: "If CodeHS says there is a problem but the line number looks fine, what does the notes say to check first?", c: "Count your curly braces", w: ["Delete the function", "Rename the world", "Restart the browser"], hint: "Mistake 3." },
          { t: "write", q: "In your own words, give two reasons a programmer writes turnRight() as a function instead of typing three turnLeft(); calls each time. (2 to 3 sentences)", min: 25, kw: [["less typing", "typing", "shorter", "repeat", "once"], ["mistake", "bug", "fix", "one place", "errors"], ["read", "plain english", "easier", "name", "understand"]], need: 2, hint: "Pick two of: less typing, fewer mistakes, easier to read." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Domino's", color: "#006491",
    tagline: "You are a kitchen-robotics intern. The pizza-box robot can move and turn left only, so you will build useful commands as functions.",
    from: "Casey Brandt, Kitchen Automation", subject: "Build two reusable commands and use them",
    email: "<p>Hi, our box-stacking robot only knows move, turnLeft, putBall and takeBall. To make our programs short and readable we want reusable commands, written as functions. A box is a ball.</p><p>Always put your functions above main(). This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: A reusable right turn", read: "<p>Write turnRight() once and use it.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 4, facing East. Define <code>turnRight</code>. In main(), move 3 East, turn right, move 3 South, turn right, move 2 West, and drop a ball. Karel ends at avenue 2, street 1, facing West.",
          starter: "// define turnRight here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(6, 5, 1, 4), rules: { mustDefine: ["turnRight"], mustCall: ["turnRight"], requireMain: true },
          solution: TR + "function main() {\n  move();\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  putBall();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n  move();\n  move();\n  move();\n  turnLeft();\n  turnLeft();\n  turnLeft();\n  move();\n  move();\n  putBall();\n}\n"], why: "The function is defined once and called twice; the grader checks that you defined and called it." }] },
      { h: "Job 2: Deliver and come back", read: "<p>Use a turnAround() function to deliver a box and come back.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Define <code>turnAround</code>. In main(): move 4 squares, drop a ball, turnAround, move 4 squares back. Karel finishes at avenue 1, street 1, facing West.",
          starter: "// define turnAround here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(6, 3), rules: { mustDefine: ["turnAround"], mustCall: ["turnAround"], requireMain: true },
          solution: "function turnAround() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  move();\n  putBall();\n  turnAround();\n  move();\n  move();\n  move();\n  move();\n}\n", wrong: ["function turnAround() {\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  move();\n  move();\n  putBall();\n  turnAround();\n  move();\n  move();\n  move();\n  move();\n}\n"], why: "turnAround() is two turnLeft() calls." }] },
      { h: "Job 3: Use both", read: "<p>A box must travel East, South and back.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 3, facing East. A box (ball) sits at avenue 3, street 3. Define <code>turnRight</code> and <code>turnAround</code>. In main(): move to the box and take it, turn right, move 2 South, drop the box, then turnAround and move 2 back North. Karel finishes at avenue 3, street 3, facing North.",
          starter: "// define turnRight and turnAround here\n\nfunction main() {\n  // your program goes here\n}\n", world: world(5, 4, 1, 3, "E", [[3, 3, 1]]), rules: { mustDefine: ["turnRight", "turnAround"], mustCall: ["turnRight", "turnAround"], requireMain: true },
          solution: TR + "function turnAround() {\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  move();\n  move();\n  takeBall();\n  turnRight();\n  move();\n  move();\n  putBall();\n  turnAround();\n  move();\n  move();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  takeBall();\n  move();\n  putBall();\n}\n"], why: "Both functions are used: turnRight() once and turnAround() once." }] },
      { h: "Explain why", read: "<p>Write a short note for the training guide.</p>",
        items: [{ t: "write", q: "Explain two reasons the team wants reusable commands written as functions. Use turnRight() or turnAround() as an example. (2 to 3 sentences)", min: 30, kw: [["less typing", "typing", "repeat", "once", "shorter", "again"], ["mistake", "bug", "fix", "one place", "easier to read", "read", "plain"], ["turnRight", "turnAround", "turnLeft"]], need: 3, why: "A strong answer names reasons from the notes (less typing, fewer mistakes, easier to read) with an example." }] }
    ]
  }
};
