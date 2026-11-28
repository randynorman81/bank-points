// Lesson 2.3: Karel Can't Turn Right.  Notes: ist/karel/karel-cant-turn-right.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the Karel Can't Turn Right notes", href: "../karel/karel-cant-turn-right.html" };
export default {
  id: "2.3", title: "Karel Can't Turn Right", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the Karel Can't Turn Right notes one part at a time, then write Karel programs that turn right using only turnLeft(). You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Three lefts make a right", links: [N],
        read: "<p>Open the notes and read the top of the page and <b>00: Wait... Karel Really Can't Turn Right?</b></p>",
        items: [
          { t: "mc", q: "Which turning command does Karel know?", c: "Only turnLeft();", w: ["Only turnRight();", "Both turnLeft(); and turnRight();", "Neither; Karel can only move"], hint: "The first sentence of part 00." },
          { t: "mc", q: "Why does turning left three times end up facing the same way as turning right once?", c: "Three quarter-turns left land where one right turn does", w: ["Each turnLeft(); is secretly a right turn in disguise", "Karel's turns always add up to exactly a full circle", "The third turnLeft(); is ignored by the program"], hint: "The notes use a clock face." },
          { t: "mc", q: "The notes call the three-line trick a mistake waiting to happen when it is typed over and over. What does the next lesson do about it?", c: "Wraps the three lines in your own turnRight();", w: ["Adds a built-in turnRight(); to every single world", "Removes the turnLeft(); command from Karel for good", "Makes Karel turn automatically whenever it meets walls"], hint: "Part 02, \"The fix, coming in Lesson 4.\"" }
        ] },
      { h: "How many turnLeft() calls?", links: [N],
        read: "<p>Read <b>01: How Many turnLeft(); Calls Do You Need?</b> and try the turn in real life as the notes suggest.</p>",
        items: [
          { t: "match", q: "Match what you want Karel to do with the number of turnLeft(); calls.", pairs: [["Turn right", "3 calls"], ["Turn around (face backward)", "2 calls"], ["Keep facing the same way", "4 calls (or 0)"]], hint: "The table in part 01." },
          { t: "mc", q: "A program uses two turnLeft(); calls hoping to turn right. Where does Karel end up facing relative to where it started?", c: "Backward, the opposite way", w: ["To the right of where it was", "To the left of where it was", "The same way it faced at the start"], hint: "Mistake 1 in part 03." },
          { t: "karel", w: 3, q: "Turn right once. Karel starts at avenue 1, street 3, facing East. Move 2 squares East, turn right using only turnLeft(), move 2 squares, and drop a ball. Karel should end at avenue 3, street 1, facing South.",
            starter: "// your program goes here\n", world: world(5, 4, 1, 3), solution: "move();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\n", rules: { allowLoose: true },
            wrong: ["move();\nmove();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\n", "move();\nmove();\nturnLeft();\nmove();\nmove();\nputBall();\n"], hint: "A right turn needs three turnLeft(); calls in a row." },
          { t: "karel", w: 3, q: "Turn around. Karel starts at avenue 1, street 1, facing East. Move 3 squares East, turn around, and walk back to avenue 1. Karel should end at avenue 1, street 1, facing West.",
            starter: "// your program goes here\n", world: world(5, 3), solution: "move();\nmove();\nmove();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\n", rules: { allowLoose: true },
            wrong: ["move();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\n"], hint: "Turning around takes exactly two turnLeft(); calls." }
        ] },
      { h: "Walk a rectangle clockwise", links: [N],
        read: "<p>Right turns let Karel walk clockwise. Use what you learned to walk a rectangle.</p>",
        items: [
          { t: "karel", w: 3, q: "Karel starts at avenue 1, street 3, facing East. Walk clockwise around a rectangle: move 2 East, turn right, move 2 South, turn right, move 2 West, turn right, move 2 North, and turn right. Karel should end where it began, facing East.",
            starter: "// your program goes here\n", world: world(5, 4, 1, 3), solution: "move();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\n", rules: { allowLoose: true },
            wrong: ["move();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\n"], hint: "There are four corners, and each one is a right turn: twelve turnLeft(); calls in all." }
        ] },
      { h: "Common mistakes", links: [N],
        read: "<p>Read <b>03: Common Mistakes</b>.</p>",
        items: [
          { t: "mc", q: "If Karel ends up facing the wrong way, what does the notes say is almost always the cause?", c: "A miscounted turnLeft();", w: ["A wall in the world", "A missing semicolon", "A ball on the corner"], hint: "Mistake 2." },
          { t: "write", q: "In your own words, explain why the notes says this lesson is \"setting up the single biggest idea in the unit.\" (2 to 3 sentences)", min: 25, kw: [["function", "your own command", "own new command", "turnRight"], ["three", "turnLeft", "repeat", "retype", "typing", "over and over"], ["name", "once", "reuse", "define", "later", "lesson"]], need: 2, hint: "Say that typing three turnLeft(); calls every time gets old, so you will wrap them in a function with a name." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "iRobot", color: "#E31937",
    tagline: "You are a robotics intern working on a home-cleaning robot. The test robot can only turn left, like Karel, so you must write right turns yourself.",
    from: "Taylor Nguyen, Robot Navigation Team", subject: "Three navigation jobs for the test robot",
    email: "<p>Thanks for joining. Our test robot has only move, turnLeft, putBall and takeBall, so it cannot turn right directly. Each job below needs a right turn or a U-turn.</p><p>This is a classroom simulation, so the layouts are made up. The robot starts facing East unless the job says otherwise.</p>",
    steps: [
      { h: "Job 1: Dock the robot", read: "<p>The robot starts upstairs and has to reach its charging dock, marked by a ball.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 4, facing East. A ball (the charger) sits at avenue 4, street 2. Move to it, pick it up, and finish on that corner. Use only the four commands.",
          starter: "// your program goes here\n", world: world(6, 5, 1, 4, "E", [[4, 2, 1]]), compare: ["pos", "balls"], solution: "move();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\ntakeBall();\n", rules: { allowLoose: true },
          wrong: ["move();\nmove();\nmove();\nmove();\ntakeBall();\n", "move();\nmove();\nmove();\nturnLeft();\nmove();\nmove();\ntakeBall();\n"], why: "East three squares, a right turn (three turnLeft() calls), then South two squares." }] },
      { h: "Job 2: Leave a marker and turn back", read: "<p>The robot leaves a marker ball and then goes back the way it came.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Move 4 squares, drop a ball, turn around, and move back to avenue 1. Karel should finish at avenue 1, street 1, facing West.",
          starter: "// your program goes here\n", world: world(6, 3), solution: "move();\nmove();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\nmove();\n", rules: { allowLoose: true },
          wrong: ["move();\nmove();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\nmove();\n"], why: "A U-turn is two turnLeft() calls." }] },
      { h: "Job 3: Circle a table clockwise", read: "<p>The robot must circle a table, keeping the table on its right, and drop a ball at each corner.</p>",
        items: [{ t: "karel", w: 4, q: "Karel starts at avenue 1, street 3, facing East. Walk clockwise around a rectangle: 2 squares East, turn right, 2 squares South, turn right, 2 squares West, turn right, 2 squares North, turn right. Drop a ball on each of the four corners as Karel reaches it (including the starting corner at the end). Karel should finish at the start facing East.",
          starter: "// your program goes here\n", world: world(5, 4, 1, 3), solution: "putBall();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\n", rules: { allowLoose: true },
          wrong: ["putBall();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\n"], why: "Each right turn is three turnLeft() calls; there are four of them, including the last one that points Karel East again." }] },
      { h: "Explain the trick", read: "<p>Write a short note for the next intern.</p>",
        items: [{ t: "write", q: "Explain how a robot that only turns left can turn right, and why that is annoying when it happens many times in a program. (2 to 3 sentences)", min: 30, kw: [["three", "3"], ["turnLeft", "left"], ["right", "turn right"], ["repeat", "over and over", "again", "every time", "annoying", "typing", "function"]], need: 3, why: "A good answer says three left turns equal one right turn and that repeating them is tedious, which a function will fix." }] }
    ]
  }
};
