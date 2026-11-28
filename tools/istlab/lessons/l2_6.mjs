// Lesson 2.6: Top Down Design and Decomposition.  Notes: ist/karel/top-down-design-and-decomposition.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the Top Down Design notes", href: "../karel/top-down-design-and-decomposition.html" };
const TR = "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n";
const TOWER = "function buildTower() {\n  putBall();\n  putBall();\n  putBall();\n  putBall();\n}\n\nfunction moveToNextSpot() {\n  move();\n  move();\n}\n";
export default {
  id: "2.6", title: "Top Down Design and Decomposition", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Top Down Design notes and then plan and write bigger Karel programs by breaking them into functions. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Two big words", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: Two Big Words, One Simple Idea</b>.</p>",
        items: [
          { t: "match", q: "Match each word to its meaning in the notes.", pairs: [["Decomposition", "Breaking a big task into smaller sub-tasks"], ["Top down design", "Starting with the big goal and working down into smaller pieces, one layer at a time"]], hint: "The first paragraph of part 00." },
          { t: "mc", q: "The notes breaks \"clean my room\" into four smaller jobs. Which is one of them?", c: "Make the bed", w: ["Paint the walls", "Buy a new desk", "Move to a new house"], hint: "The non-Karel example in part 00." }
        ] },
      { h: "Decomposing a Karel task", links: [N],
        read: "<p>Read <b>01: Decomposing a Karel Task</b> and look at both code examples.</p>",
        items: [
          { t: "mc", q: "In the notes' bigger example (three towers in a row), what does main() look like?", c: "A short list of big steps: build, move, build", w: ["A long list of every move and every putBall", "One giant loop that has no functions in it", "An empty function that makes no calls at all"], hint: "The paragraph after the second code example." },
          { t: "num", q: "How many balls does buildTower() drop in the notes?", a: 4, hint: "Count the putBall(); lines in buildTower()." },
          { t: "num", q: "How many squares does moveToNextSpot() move Karel?", a: 2, hint: "Count the move(); lines in moveToNextSpot()." }
        ] },
      { h: "How to plan", links: [N],
        read: "<p>Read <b>02: How to Actually Plan This Way</b> and <b>03: Common Mistakes</b>.</p>",
        items: [
          { t: "order", q: "Put the four planning steps in the order the notes gives them.", items: ["Say the big goal in one sentence", "List the major steps in plain English", "Turn each step into a function", "Call the functions in order inside main()"], hint: "Steps 1 to 4 in part 02." },
          { t: "mc", q: "Why is a function named doStuff() a problem?", c: "The name tells you nothing about what it does", w: ["It has too many letters", "Functions cannot contain a capital letter", "It would run twice"], hint: "Mistake 2." }
        ] },
      { h: "Build it top down", links: [N],
        read: "<p>Now do what the notes do: write the helper functions, then main().</p>",
        items: [
          { t: "karel", w: 3, q: "Write one function, <code>buildTower</code>, that drops 4 balls on a corner, and call it from main(). Karel starts at avenue 1, street 1, facing East and should end there with a tower of 4 balls.",
            starter: "// write buildTower here\n\nfunction main() {\n  // call it here\n}\n", world: world(5, 3), rules: { mustDefine: ["buildTower"], mustCall: ["buildTower"], requireMain: true },
            solution: "function buildTower() {\n  putBall();\n  putBall();\n  putBall();\n  putBall();\n}\n\nfunction main() {\n  buildTower();\n}\n", wrong: ["function buildTower() {\n  putBall();\n  putBall();\n}\n\nfunction main() {\n  buildTower();\n}\n"], hint: "Four putBall(); calls inside buildTower()." },
          { t: "karel", w: 4, q: "Build 3 towers of 4 balls in a row, on avenues 1, 3 and 5 of street 1. Write <code>buildTower</code> and <code>moveToNextSpot</code> (two moves), and make main() read: build, move, build, move, build. Karel starts at avenue 1, street 1, facing East.",
            starter: "// write buildTower and moveToNextSpot here\n\nfunction main() {\n  // build, move, build, move, build\n}\n", world: world(7, 3), rules: { mustDefine: ["buildTower", "moveToNextSpot"], mustCall: ["buildTower", "moveToNextSpot"], requireMain: true },
            solution: TOWER + "\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n", wrong: [TOWER + "\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n"], hint: "main() has five lines: build, move, build, move, build." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "LEGO", color: "#D01012",
    tagline: "You are a play-experience intern. Your team prototypes building robots that stack bricks, and each program must be planned top down.",
    from: "Riley Santos, Build Robotics", subject: "Plan it top down: three building programs",
    email: "<p>Hi, before anyone types a line of code, our rule is to say the goal, list the steps and turn each step into a function. A brick is a ball.</p><p>Write each program with clearly named helper functions and a short main(). This is a classroom simulation, so the layouts are made up.</p>",
    steps: [
      { h: "Job 1: Two stacks", read: "<p>Two stacks of 3 bricks, two squares apart.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Build a stack of 3 bricks (balls) on avenue 1 and another stack of 3 on avenue 3. Write <code>buildStack</code> and <code>moveToNextSpot</code> (two moves), and keep main() short. Karel ends at avenue 3.",
          starter: "// write your helper functions here\n\nfunction main() {\n  // short and readable\n}\n", world: world(6, 3), rules: { mustDefine: ["buildStack", "moveToNextSpot"], mustCall: ["buildStack", "moveToNextSpot"], requireMain: true, maxLines: 24 },
          solution: "function buildStack() {\n  putBall();\n  putBall();\n  putBall();\n}\n\nfunction moveToNextSpot() {\n  move();\n  move();\n}\n\nfunction main() {\n  buildStack();\n  moveToNextSpot();\n  buildStack();\n}\n", wrong: ["function main() {\n  putBall();\n}\n"], why: "main() should read: build, move, build." }] },
      { h: "Job 2: A staircase wall", read: "<p>Each step needs a brick, a move and a climb.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Build a three-step staircase: put a brick on avenue 1, street 1, avenue 2, street 2 and avenue 3, street 3. Write <code>turnRight</code> and <code>placeAndClimb</code> (put a ball, move East, turn left, move North, turn right), and have main() call placeAndClimb three times. Karel ends at avenue 4, street 4 facing East.",
          starter: "// write your helper functions here\n\nfunction main() {\n  // call placeAndClimb three times\n}\n", world: world(6, 6), rules: { mustDefine: ["turnRight", "placeAndClimb"], mustCall: ["placeAndClimb"], requireMain: true },
          solution: TR + "\nfunction placeAndClimb() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n}\n\nfunction main() {\n  placeAndClimb();\n  placeAndClimb();\n  placeAndClimb();\n}\n", wrong: [TR + "\nfunction placeAndClimb() {\n  putBall();\n  move();\n  turnLeft();\n  move();\n  turnRight();\n}\n\nfunction main() {\n  placeAndClimb();\n  placeAndClimb();\n}\n"], why: "The pattern put, move East, turn left, move North, turn right repeats three times." }] },
      { h: "Job 3: Three towers", read: "<p>The full prototype from the training notes.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 1, facing East. Build three towers of 4 bricks on avenues 1, 3 and 5. Use <code>buildTower</code> and <code>moveToNextSpot</code>, and write main() as build, move, build, move, build. It must also work in a wider world.",
          starter: "// write your helper functions here\n\nfunction main() {\n  // build, move, build, move, build\n}\n", world: world(7, 3), hidden: [world(9, 4)], rules: { mustDefine: ["buildTower", "moveToNextSpot"], mustCall: ["buildTower", "moveToNextSpot"], requireMain: true },
          solution: TOWER + "\nfunction main() {\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n  moveToNextSpot();\n  buildTower();\n}\n", wrong: ["function main() {\n  putBall();\n}\n"], why: "The same program works in any world wide enough, because it only uses relative moves." }] },
      { h: "Explain your plan", read: "<p>Write a short note about how you planned.</p>",
        items: [{ t: "write", q: "Explain, in the order of the four planning steps, how you would plan the three-tower program before writing code. (3 sentences)", min: 35, kw: [["goal", "big goal", "one sentence"], ["steps", "list", "plain english"], ["function", "buildTower", "moveToNextSpot"], ["main", "call", "order"]], need: 3, why: "A strong answer follows the notes: say the goal, list the steps, turn each into a function, call them in main()." }] }
    ]
  }
};
