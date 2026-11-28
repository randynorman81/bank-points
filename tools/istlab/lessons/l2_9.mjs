// Lesson 2.9: Super Karel.  Notes: ist/karel/super-karel.html
import { world, hurdleWalls } from "../karel_helpers.mjs";
const N = { label: "Open the Super Karel notes", href: "../karel/super-karel.html" };
const HURDLE = "function jumpHurdle() {\n  turnLeft();\n  move();\n  turnRight();\n  move();\n  turnRight();\n  move();\n  turnLeft();\n}\n";
export default {
  id: "2.9", title: "Super Karel", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Super Karel notes and write programs that use the built-in turnRight() and turnAround(). You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "What is different about Super Karel?", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: What's Different About Super Karel?</b></p>",
        items: [
          { t: "mc", q: "Which two commands does Super Karel add that regular Karel does not have?", c: "turnRight(); and turnAround();", w: ["turnLeft(); and move();", "putBall(); and takeBall();", "jump(); and spin();"], hint: "The table in part 00." },
          { t: "mc", q: "What does the notes say about the two commands Super Karel adds?", c: "They are two functions you already know how to build", w: ["They are brand new ideas you could not build yourself", "They only work in the very last lesson of the unit", "They replace the turnLeft(); command completely"], hint: "The Notice box under the table." }
        ] },
      { h: "Same idea, less setup", links: [N],
        read: "<p>Read <b>01: Same Idea, Less Setup</b> and <b>02: Why Learn to Build It First</b>.</p>",
        items: [
          { t: "mc", q: "Why does the notes say you learned to build turnRight() before getting Super Karel?", c: "So you would learn what a function is and build your own", w: ["Because Super Karel did not even exist back then yet", "Because turnRight() is a very hard command to type", "Because the CodeHS company simply made a mistake"], hint: "Part 02." },
          { t: "karel", w: 3, q: "Use Super Karel's built-in commands. Do NOT define turnRight() yourself. Karel starts at avenue 1, street 3, facing East: move 2, turn right, move 2, turn around, and move 2 back. Karel finishes at avenue 3, street 3, facing North.",
            starter: "function main() {\n  // use turnRight() and turnAround() directly\n}\n", world: world(5, 4, 1, 3), rules: { superKarel: true, mustNotDefine: ["turnRight", "turnAround"], mustCall: ["turnRight", "turnAround"], requireMain: true },
            solution: "function main() {\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  turnAround();\n  move();\n  move();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  move();\n}\n"], hint: "turnRight(); and turnAround(); already exist here; just call them." },
          { t: "karel", w: 3, q: "Build the staircase with Super Karel: three steps, each is put a ball, move, turn left, move, turn right. Do not define turnRight(). Karel starts at avenue 1, street 1, facing East and ends at avenue 4, street 4 facing East.",
            starter: "function main() {\n  // three steps\n}\n", world: world(6, 6), rules: { superKarel: true, mustNotDefine: ["turnRight"], requireMain: true },
            solution: "function main() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n}\n", wrong: ["function main() {\n  putBall();\n  move();\n}\n"], hint: "Each step is: putBall(); move(); turnLeft(); move(); turnRight();" }
        ] },
      { h: "Common mix-ups", links: [N],
        read: "<p>Read <b>03: Common Mix-Ups</b>.</p>",
        items: [
          { t: "mc", q: "Super Karel adds turnRight(); and turnAround(). What does the notes say about other commands you might want?", c: "You still write your own function for them", w: ["Super Karel adds an unlimited set of commands", "They are never needed", "You must switch back to regular Karel"], hint: "Mix-up 1." },
          { t: "mc", q: "Even though turnRight() is built in, what is it still doing underneath?", c: "The same three turnLeft(); calls", w: ["A single secret turn that Karel hides", "Nothing at all, since it is only a comment", "Four moves forward and then one turn back"], hint: "Mix-up 2: abstraction at work." },
          { t: "write", q: "In your own words, explain why Super Karel is a \"reasonable shortcut, not a mystery.\" (2 to 3 sentences)", min: 25, kw: [["built", "already", "built in", "shortcut"], ["turnRight", "turnAround", "turnLeft", "three"], ["understand", "learned", "function", "yourself", "build"]], need: 3, hint: "Say you learned how turnRight works by building it, so using the built-in version is fine." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Tesla", color: "#CC0000",
    tagline: "You are a factory-automation intern. The assembly robots are Super Karel: turnRight() and turnAround() are built in.",
    from: "Avery Kim, Assembly Line Software", subject: "Three assembly programs for the Super Karel robots",
    email: "<p>Hi, our assembly robots come with turnRight and turnAround built in, so please do not define them again. A part is a ball.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: Part transfer", read: "<p>Move a part from one station to another.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. A part (ball) sits at avenue 4, street 1. Take it, turn around, bring it back and put it at avenue 1, street 1, facing West.",
          starter: "function main() {\n  \n}\n", world: world(6, 3, 1, 1, "E", [[4, 1, 1]]), rules: { superKarel: true, mustNotDefine: ["turnAround"], mustCall: ["turnAround"], requireMain: true },
          solution: "function main() {\n  move();\n  move();\n  move();\n  takeBall();\n  turnAround();\n  move();\n  move();\n  move();\n  putBall();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  move();\n  takeBall();\n}\n"], why: "turnAround() is built in; you only call it." }] },
      { h: "Job 2: Conveyor corner", read: "<p>A belt turns a corner twice.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 4, facing East. Move 3 squares East, turn right, move 3 squares South, turn right, and move 3 squares West. Finish at avenue 1, street 1, facing West. Do not define turnRight().",
          starter: "function main() {\n  \n}\n", world: world(6, 5, 1, 4), rules: { superKarel: true, mustNotDefine: ["turnRight"], mustCall: ["turnRight"], requireMain: true },
          solution: "function main() {\n  move();\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  move();\n  turnRight();\n  move();\n  move();\n  move();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  move();\n  turnLeft();\n  move();\n  move();\n  move();\n}\n"], why: "A right turn is one call to the built-in turnRight()." }] },
      { h: "Job 3: Hurdle line", read: "<p>Parts must pass over a one-square-high hurdle on the belt.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. There is a hurdle (a wall one square high) between avenue 2 and avenue 3. Move to the hurdle, then write a helper <code>jumpHurdle</code> that goes up, over and back down, and call it from main(), then move 1 more square. Do not define turnRight(). Karel should end at avenue 4, street 1, facing East.",
          starter: "// write jumpHurdle here\n\nfunction main() {\n  \n}\n", world: world(6, 4, 1, 1, "E", [], hurdleWalls([2])), rules: { superKarel: true, mustNotDefine: ["turnRight"], mustDefine: ["jumpHurdle"], mustCall: ["jumpHurdle"], requireMain: true },
          solution: HURDLE + "\nfunction main() {\n  move();\n  jumpHurdle();\n  move();\n}\n", wrong: ["function main() {\n  move();\n  move();\n  move();\n}\n"], why: "jumpHurdle(): turn left, move up, turn right, move over, turn right, move down, turn left." }] },
      { h: "Explain it", read: "<p>Write a note for the team.</p>",
        items: [{ t: "write", q: "Explain what Super Karel gives you and why you still need to know how turnRight() works underneath. (2 to 3 sentences)", min: 30, kw: [["turnRight", "turnAround", "built in", "built-in"], ["three", "turnLeft", "underneath", "inside"], ["function", "abstraction", "understand", "own", "build"]], need: 3, why: "Super Karel gives turnRight() and turnAround(), and it still runs three left turns underneath, so knowing how functions work matters." }] }
    ]
  }
};
