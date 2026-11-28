// Lesson 2.11: If and If/Else Statements (CodeHS 2.11 + 2.12).  Notes: ist/karel/if-statements-and-conditionals.html, ist/karel/if-else-statements.html
import { world } from "../karel_helpers.mjs";
const NI = { label: "Open the If Statements notes", href: "../karel/if-statements-and-conditionals.html" }, NE = { label: "Open the If/Else notes", href: "../karel/if-else-statements.html" };
export default {
  id: "2.11", title: "If and If/Else Statements", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the If Statements and If/Else notes, then write programs that make decisions. Your programs are also run on a second world with different balls, so they must really decide. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Conditions", links: [NI],
        read: "<p>Open the If Statements notes and read the top of the page and <b>00: What Is a Condition?</b></p>",
        items: [
          { t: "mc", q: "What is a condition, according to the notes?", c: "A yes-or-no question: true or false", w: ["A command that moves Karel one square forward", "A comment about what is in the world", "A special kind of function with a name"], hint: "The first sentence of part 00." },
          { t: "match", q: "Match each condition to the question it answers.", pairs: [["frontIsClear()", "Is there NOT a wall directly in front of Karel?"], ["frontIsBlocked()", "Is there a wall directly in front of Karel?"], ["ballsPresent()", "Is there a ball on Karel's current corner?"], ["noBallsPresent()", "Is Karel's current corner empty?"]], hint: "The table in part 00." },
          { t: "mc", q: "Does asking frontIsClear() move Karel?", c: "No, it only checks", w: ["Yes, it moves Karel one square", "Yes, it turns Karel left", "Only if there is a ball"], hint: "The paragraph under the table." }
        ] },
      { h: "The if statement", links: [NI],
        read: "<p>Read <b>01: The If Statement</b>, <b>02: A More Useful Example</b> and <b>03: Common Mistakes</b>.</p>",
        items: [
          { t: "mc", q: "If the front is blocked and you write if (frontIsClear()) { move(); }, what happens?", c: "move(); is skipped and the program goes on", w: ["Karel crashes into the wall in front of it", "Karel turns around and walks the other way", "The program stops forever and never finishes"], hint: "The paragraph under the first code example." },
          { t: "mc", q: "What does the notes say about mixing up frontIsClear() and frontIsBlocked()?", c: "They are opposites, so mixing them flips your logic", w: ["They mean exactly the same thing in Karel", "Only one of the two of them really exists", "It does not matter which one you pick"], hint: "Mistake 2." },
          { t: "karel", w: 3, q: "Use a for loop that runs 5 times with an if statement inside: if there is a ball on the corner, take it; then move. Karel starts at avenue 1, street 1, facing East. This world has balls on some corners, and your program is also tested on another world.",
            starter: "function main() {\n  // for loop with an if inside\n}\n", world: world(8, 3, 1, 1, "E", [[1, 1, 1], [3, 1, 1], [4, 1, 1], [7, 1, 1]]), hidden: [world(9, 3, 1, 1, "E", [[2, 1, 1], [5, 1, 1], [8, 1, 1]])],
            rules: { mustUse: ["for", "if"], requireMain: true, maxLines: 12 },
            solution: "function main() {\n  for (var i = 0; i < 5; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 5; i++) {\n    move();\n    if (ballsPresent()) {\n      takeBall();\n    }\n  }\n}\n", "function main() {\n  for (var i = 0; i < 5; i++) {\n    takeBall();\n    move();\n  }\n}\n"], hint: "Check for a ball first, then move; and use if so takeBall(); never crashes." }
        ] },
      { h: "If / else", links: [NE],
        read: "<p>Open the If/Else notes and read all of it, parts 00 to 03.</p>",
        items: [
          { t: "mc", q: "Read this: if (ballsPresent()) { takeBall(); } else { putBall(); } On a corner with no ball, what happens?", c: "Karel puts a ball down", w: ["Karel takes a ball", "Karel crashes", "Nothing happens"], hint: "The else block runs when the condition is false." },
          { t: "mc", q: "How many of the two blocks in an if/else run each time?", c: "Exactly one", w: ["Both", "Neither", "It depends on the order"], hint: "Part 00, the paragraph under the example." },
          { t: "mc", q: "What is wrong with else (ballsPresent()) { ... }?", c: "else never takes a condition of its own", w: ["It needs a semicolon at the end of the line", "It must be written in capital letters only", "It must always come before the if statement"], hint: "Mistake 1." },
          { t: "karel", w: 3, q: "Use a for loop that runs 6 times. On each corner, if there is a ball take it, else put one down; then move. Karel starts at avenue 1, street 1, facing East. It is also tested on another world.",
            starter: "function main() {\n  // for loop with if / else\n}\n", world: world(8, 3, 1, 1, "E", [[2, 1, 1], [3, 1, 1]]), hidden: [world(9, 3, 1, 1, "E", [[1, 1, 1], [4, 1, 1], [6, 1, 1]])],
            rules: { mustUse: ["for", "if", "else"], requireMain: true, maxLines: 14 },
            solution: "function main() {\n  for (var i = 0; i < 6; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    } else {\n      putBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 6; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n"], hint: "if (ballsPresent()) { takeBall(); } else { putBall(); } then move();." }
        ] },
      { h: "In your own words", links: [NE],
        read: "<p>Read the last box of the If/Else notes.</p>",
        items: [{ t: "write", q: "In your own words, explain the difference between an if statement and an if/else statement. Use ballsPresent() in your example. (2 to 3 sentences)", min: 25, kw: [["if"], ["else"], ["true", "false", "otherwise", "either", "one or the other", "other case"], ["ballsPresent", "ball"]], need: 3, hint: "Say that if handles only the true case and else automatically handles the opposite case." }] }
    ]
  },
  a: {
    pts: 100, company: "Roomba", color: "#E31937",
    tagline: "You are a cleaning-robot intern. The robot decides what to do from what it finds on each square.",
    from: "Harper Lin, Cleaning Algorithms", subject: "Three decision programs for the cleaning robot",
    email: "<p>Hi, our robot walks along a hallway and has to react to what it finds: balls are crumbs, and an empty square may need a marker. Use if and if/else so the same program works on any hallway layout.</p><p>This is a classroom simulation. Your programs are tested on more than one layout.</p>",
    steps: [
      { h: "Job 1: Clean the hallway", read: "<p>Pick up every crumb on the first 6 squares.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Use a for loop that runs 6 times: if there is a ball, take it; then move. All balls on avenues 1 to 6 must be gone and Karel ends on avenue 7.",
          starter: "function main() {\n  \n}\n", world: world(9, 3, 1, 1, "E", [[1, 1, 1], [2, 1, 1], [5, 1, 1], [6, 1, 1]]), hidden: [world(8, 3, 1, 1, "E", [[3, 1, 1], [4, 1, 1]]), world(10, 3, 1, 1, "E", [[1, 1, 1], [6, 1, 1]])],
          rules: { mustUse: ["for", "if"], requireMain: true, maxLines: 12 },
          solution: "function main() {\n  for (var i = 0; i < 6; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 6; i++) {\n    move();\n    if (ballsPresent()) {\n      takeBall();\n    }\n  }\n}\n"], why: "Check for a ball first, then move, so the starting square is cleaned too." }] },
      { h: "Job 2: Mark the empty squares", read: "<p>Put a marker on every empty square.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Use a for loop that runs 7 times: if the corner has no ball, put one there; then move. Every corner on avenues 1 to 7 must end with exactly one ball.",
          starter: "function main() {\n  \n}\n", world: world(9, 3, 1, 1, "E", [[2, 1, 1], [5, 1, 1]]), hidden: [world(10, 3, 1, 1, "E", [[1, 1, 1], [4, 1, 1], [7, 1, 1]])],
          rules: { mustUse: ["for", "if"], requireMain: true, maxLines: 12 },
          solution: "function main() {\n  for (var i = 0; i < 7; i++) {\n    if (noBallsPresent()) {\n      putBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 7; i++) {\n    putBall();\n    move();\n  }\n}\n"], why: "Only put a ball down when the corner is empty, so a corner that already has one still ends with exactly one." }] },
      { h: "Job 3: Flip every square", read: "<p>Swap each square: a crumb becomes clean, a clean square gets a marker.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Use a for loop that runs 8 times: if there is a ball take it, else put one down; then move. Every corner on avenues 1 to 8 must be flipped.",
          starter: "function main() {\n  \n}\n", world: world(10, 3, 1, 1, "E", [[3, 1, 1], [4, 1, 1], [8, 1, 1]]), hidden: [world(11, 3, 1, 1, "E", [[1, 1, 1], [2, 1, 1]])],
          rules: { mustUse: ["for", "if", "else"], requireMain: true, maxLines: 14 },
          solution: "function main() {\n  for (var i = 0; i < 8; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    } else {\n      putBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 8; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    if (noBallsPresent()) {\n      putBall();\n    }\n    move();\n  }\n}\n"], why: "The two-if version flips a ball to empty and then right back to a ball. An if/else makes it exactly one of the two." }] },
      { h: "Explain it", read: "<p>Write a note for the team.</p>",
        items: [{ t: "write", q: "Explain why Job 3 needs an if/else instead of two separate if statements. (2 to 3 sentences)", min: 30, kw: [["else", "if/else", "if / else"], ["one", "either", "only one", "exactly one", "never both"], ["two", "both", "again", "back", "twice", "separate"]], need: 3, why: "With two ifs, the second can undo the first; if/else runs exactly one of the two blocks." }] }
    ]
  }
};
