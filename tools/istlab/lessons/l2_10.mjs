// Lesson 2.10: For Loops.  Notes: ist/karel/for-loops.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the For Loops notes", href: "../karel/for-loops.html" };
export default {
  id: "2.10", title: "For Loops", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the For Loops notes and write loops that run on the page. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Why not copy and paste?", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: Why Not Just Copy-Paste?</b></p>",
        items: [
          { t: "mc", q: "What does a for loop do, according to the notes?", c: "Repeats commands a fixed number of times", w: ["Repeats commands until a wall appears in front", "Runs commands only when a ball is present", "Defines a brand new command with a name"], hint: "The first sentence of the page." },
          { t: "mc", q: "If you need to change \"4\" to \"10\" later, how many places do you change in the loop version?", c: "Exactly one", w: ["Four", "Ten", "None; it changes itself"], hint: "The paragraph under Without a loop and With a loop." }
        ] },
      { h: "The three parts of the first line", links: [N],
        read: "<p>Read <b>01: Breaking Down the Loop's First Line</b> and <b>02: Watch It Run</b>.</p>",
        items: [
          { t: "match", q: "Match each part of <code>for (var i = 0; i &lt; 4; i++)</code> to what it means.", pairs: [["var i = 0", "Start counting at 0"], ["i < 4", "Keep looping as long as this is true"], ["i++", "After each pass, add 1 to i"]], hint: "The table in part 01." },
          { t: "num", q: "How many times does <code>for (var i = 0; i &lt; 4; i++)</code> run its body?", a: 4, hint: "i is 0, 1, 2 and 3. Once i reaches 4 the loop stops." },
          { t: "mc", q: "What is one trip through the loop's body called?", c: "An iteration", w: ["A function", "A condition", "A comment"], hint: "Part 02." }
        ] },
      { h: "Several commands in a loop", links: [N],
        read: "<p>Read <b>03: Putting Multiple Commands Inside a Loop</b>.</p>",
        items: [
          { t: "mc", q: "The loop <code>for (var i = 0; i &lt; 4; i++) { move(); putBall(); }</code> does what?", c: "Move, put a ball, move, put a ball, four times", w: ["Moves 4 times in a row, then drops 4 balls", "Drops 4 balls in a row, then moves 4 times", "Moves just once and then drops just one ball"], hint: "The two commands are repeated as a pair." },
          { t: "karel", w: 3, q: "Use a for loop that runs 4 times and does <code>move();</code> then <code>putBall();</code> each time. Karel starts at avenue 1, street 1, facing East. It ends at avenue 5 with a ball on avenues 2, 3, 4 and 5.",
            starter: "function main() {\n  // your loop goes here\n}\n", world: world(7, 3), hidden: [world(9, 4)], rules: { mustUse: ["for"], requireMain: true, maxLines: 8 },
            solution: "function main() {\n  for (var i = 0; i < 4; i++) {\n    move();\n    putBall();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 5; i++) {\n    move();\n    putBall();\n  }\n}\n", "function main() {\n  move();\n  putBall();\n  move();\n  putBall();\n  move();\n  putBall();\n  move();\n  putBall();\n}\n"], hint: "for (var i = 0; i < 4; i++) { ... } with move(); putBall(); inside the braces." },
          { t: "karel", w: 3, q: "Build a tower of 6 balls on one corner with a for loop. Karel starts at avenue 1, street 1, facing East and should end there with 6 balls on the corner.",
            starter: "function main() {\n  // your loop goes here\n}\n", world: world(4, 3), rules: { mustUse: ["for"], requireMain: true, maxLines: 6 },
            solution: "function main() {\n  for (var i = 0; i < 6; i++) {\n    putBall();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i <= 6; i++) {\n    putBall();\n  }\n}\n"], hint: "Six iterations means i < 6." }
        ] },
      { h: "Common mistakes", links: [N],
        read: "<p>Read <b>04: Common Mistakes</b>.</p>",
        items: [
          { t: "mc", q: "What happens if you write i <= 4 instead of i < 4 when starting from 0?", c: "The loop runs 5 times instead of 4", w: ["The loop runs only 3 times instead of 4", "The loop never runs even one single time", "The loop runs forever and never stops"], hint: "Mistake 1, off-by-one errors." },
          { t: "mc", q: "What separates the three parts of a for loop's first line?", c: "Semicolons, not commas", w: ["Commas, not semicolons", "Colons", "Spaces only"], hint: "Mistake 2." },
          { t: "mc", q: "If move(); would crash on its own, what happens inside a loop?", c: "It crashes inside the loop too; loops do not check", w: ["The loop skips that command safely and goes on", "The loop moves Karel backward to avoid the wall", "Karel turns left to get around the wall"], hint: "Mistake 3." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Minecraft", color: "#5B8731",
    tagline: "You are a world-builder intern. Your tools repeat the same block placements, so every build must use a for loop.",
    from: "Quinn Okoye, Build Tools Team", subject: "Three loop builds for the new builder bot",
    email: "<p>Hi, our builder bot places blocks (balls) while it walks. Every program below must use a for loop, so changing a number changes the build.</p><p>This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Build 1: A wall of blocks", read: "<p>Place a block on every square along a street.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Place a ball on avenue 1 and on every square it walks over for 6 more moves: use a for loop that runs 6 times with putBall(); then move();. Karel ends at avenue 7, street 1.",
          starter: "function main() {\n  \n}\n", world: world(8, 3), hidden: [world(10, 4)], rules: { mustUse: ["for"], requireMain: true, maxLines: 8 },
          solution: "function main() {\n  for (var i = 0; i < 6; i++) {\n    putBall();\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 7; i++) {\n    putBall();\n    move();\n  }\n}\n"], why: "Six iterations of put-then-move leave balls on avenues 1 to 6." }] },
      { h: "Build 2: Fence posts", read: "<p>A post every other square.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Use a for loop that runs 4 times: move 2 squares, then drop a ball. Karel ends at avenue 9, street 1 with a ball on avenues 3, 5, 7 and 9.",
          starter: "function main() {\n  \n}\n", world: world(10, 3), hidden: [world(12, 4)], rules: { mustUse: ["for"], requireMain: true, maxLines: 9 },
          solution: "function main() {\n  for (var i = 0; i < 4; i++) {\n    move();\n    move();\n    putBall();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 3; i++) {\n    move();\n    move();\n    putBall();\n  }\n}\n"], why: "Each iteration is move, move, putBall." }] },
      { h: "Build 3: A square frame", read: "<p>Mark the four corners of a square.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Walk a square with sides of 3 squares, counter-clockwise: use a for loop that runs 4 times, each time dropping a ball, moving 3 squares and turning left. Karel finishes where it started, facing East, with a ball on each of the four corners.",
          starter: "function main() {\n  \n}\n", world: world(6, 6), hidden: [world(7, 7)], rules: { mustUse: ["for"], requireMain: true, maxLines: 12 },
          solution: "function main() {\n  for (var i = 0; i < 4; i++) {\n    putBall();\n    move();\n    move();\n    move();\n    turnLeft();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 3; i++) {\n    putBall();\n    move();\n    move();\n    move();\n    turnLeft();\n  }\n}\n"], why: "One side of the square is put, three moves and a left turn, repeated four times." }] },
      { h: "Explain it", read: "<p>Write a short note for the builders.</p>",
        items: [{ t: "write", q: "Explain what the three parts of a for loop's first line do, using one of your builds as the example. (2 to 3 sentences)", min: 30, kw: [["start", "i = 0", "var i"], ["condition", "stop", "i <", "as long as", "keep"], ["add 1", "i++", "count", "each pass", "increase"]], need: 3, why: "A strong answer names start, stop condition and the add-one step." }] }
    ]
  }
};
