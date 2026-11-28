// Lesson 2.1: Intro to Karel (CodeHS 2.1 + 2.2).  Notes: ist/unit-2/meet-karel.html, ist/karel/intro-to-programming-with-karel.html, ist/karel/more-basic-karel.html
import { world } from "../karel_helpers.mjs";
const MEET = { label: "Open Meet Karel", href: "../unit-2/meet-karel.html" }, N1 = { label: "Open the Intro to Karel notes", href: "../karel/intro-to-programming-with-karel.html" }, N2 = { label: "Open the More Basic Karel notes", href: "../karel/more-basic-karel.html" };
const BACK = "../unit-2/index.html";
export default {
  id: "2.1", title: "Intro to Karel", back: BACK,
  w: {
    pts: 50,
    intro: "You will go through the Karel notes one part at a time, and write real Karel programs that run on the page. Each step names what to read, then asks questions or sets a Karel task. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Meet Karel", links: [MEET, N1],
        read: "<p>Open <b>Meet Karel</b> and read it all. Then open the <b>Intro to Karel</b> notes and read parts <b>00: What Is Karel?</b> and <b>01: Karel's Four Starter Commands</b>.</p>",
        items: [
          { t: "mc", q: "What is Karel, according to Meet Karel?", c: "A virtual robot on a grid of streets and avenues", w: ["A real robot that cleans classroom floors", "A website that grades your typing speed", "A game character that plays all by itself"], hint: "The first paragraph of Meet Karel." },
          { t: "match", q: "Match each of Karel's four starter commands to what it does.", pairs: [["move();", "Moves Karel forward one square in the direction it faces"], ["turnLeft();", "Turns Karel 90 degrees to the left without moving"], ["putBall();", "Drops a ball on the corner Karel is standing on"], ["takeBall();", "Picks up a ball from the corner Karel is standing on"]], hint: "The table in part 01 of the Intro notes." },
          { t: "text", q: "What character ends almost every Karel command?", a: [";", "semicolon", "a semicolon", "the semicolon"], hint: "Part 01 says it is how Karel knows where one instruction ends and the next begins.", ph: "A symbol or its name" },
          { t: "mc", q: "According to Meet Karel, what do the parentheses after a command like move() do?", c: "They run the command, which is called calling it", w: ["They hold the number of squares to move", "They only make the code look neater", "They tell Karel to turn after the move"], hint: "The section \"Why does move() have ()?\" explains it." },
          { t: "mc", q: "The Intro notes say Karel has no built-in command for turning which way?", c: "Right, so turnRight() does not exist yet", w: ["Left, so turnLeft() does not exist", "Around, so Karel can never turn back", "Up, so Karel can never go north"], hint: "Part 01, the Important box." }
        ] },
      { h: "Your first program", links: [N1],
        read: "<p>In the Intro notes find <b>Your first program</b> (the five lines read out as directions). Type it in the box below: forward two squares, turn left, forward one square, drop a ball. Press Run to watch Karel do it, then check your answer at the bottom.</p>",
        items: [
          { t: "karel", w: 3, q: "Type the first program from the notes. Karel starts at avenue 1, street 1, facing East. Walk forward two squares, turn left, walk forward one more square, then drop a ball.",
            starter: "// your program goes here\n", world: world(5, 4), solution: "move();\nmove();\nturnLeft();\nmove();\nputBall();\n", rules: { allowLoose: true },
            wrong: ["move();\nturnLeft();\nmove();\nmove();\nputBall();\n", "move();\nmove();\nturnLeft();\nmove();\n"], hint: "Read your own program line by line, as directions: forward two, turn left, forward one, drop a ball." }
        ] },
      { h: "Order matters", links: [N1],
        read: "<p>Read <b>02: Order Matters, A Lot</b> in the Intro notes.</p>",
        items: [
          { t: "mc", q: "Karel starts at avenue 1, street 1, facing East. After move(); turnLeft(); move(); which corner is Karel on?", c: "Avenue 2, street 2", w: ["Avenue 1, street 3", "Avenue 3, street 1", "Avenue 2, street 1"], hint: "Trace it on paper: the first move goes East, the turn points Karel North, the second move goes North." },
          { t: "karel", w: 3, q: "Make Karel end at avenue 3, street 2, facing East, with a ball on that corner. Karel starts at avenue 1, street 1, facing East. Remember: the order of the commands matters.",
            starter: "// your program goes here\n", world: world(6, 4), solution: "move();\nturnLeft();\nmove();\nturnLeft();\nturnLeft();\nturnLeft();\nmove();\nmove();\nputBall();\n", rules: { allowLoose: true },
            wrong: ["move();\nmove();\nturnLeft();\nmove();\nputBall();\n"], hint: "Karel has to end facing East again, so think about how many times it turns in total." }
        ] },
      { h: "Reading a world and longer programs", links: [N2],
        read: "<p>Open the <b>More Basic Karel</b> notes and read <b>00: Reading a Karel World</b>, <b>01: Combining Commands</b> and <b>02: Karel Can Only Carry So Much Information</b>.</p>",
        items: [
          { t: "mc", q: "What does the notes say two turnLeft(); calls in a row do?", c: "Turn Karel a full 180 degrees around", w: ["Turn Karel to the right by 90 degrees", "Leave Karel facing the same way as before", "Turn Karel by only 45 degrees"], hint: "The Reading tip under the long example." },
          { t: "mc", q: "What habit does the notes tell you to build before typing a single command?", c: "Trace the path on the picture, counting every move", w: ["Type the whole program and fix it afterward", "Copy a program from the last lesson exactly", "Ask Karel to test the world on its own first"], hint: "The box at the end of part 00." },
          { t: "karel", w: 3, q: "Follow the longer example from the notes. Karel starts at avenue 1, street 1, facing East. Walk forward 3 squares, turn left, walk forward 1, drop a ball, walk forward 1 more, turn around, walk forward 1 back to the ball, and pick it up. Where does Karel end up?",
            starter: "// your program goes here\n", world: world(6, 5), solution: "move();\nmove();\nmove();\nturnLeft();\nmove();\nputBall();\nmove();\nturnLeft();\nturnLeft();\nmove();\ntakeBall();\n", rules: { allowLoose: true },
            wrong: ["move();\nmove();\nmove();\nturnLeft();\nmove();\nputBall();\nmove();\n"], hint: "After dropping the ball Karel goes forward one more, turns around with two turnLeft() calls, comes back one square and takes the ball." }
        ] },
      { h: "Common mistakes", links: [N1, N2],
        read: "<p>Read <b>03: Common Mistakes</b> in both sets of notes.</p>",
        items: [
          { t: "mc", q: "What happens if you call takeBall(); on a corner with no ball?", c: "The program crashes, like running into a wall", w: ["Karel quietly does nothing at all and goes on", "Karel puts a ball down on that corner instead", "Karel moves on to the next corner without it"], hint: "More Basic Karel, Mistake 1." },
          { t: "mc", q: "What does the notes advise about writing a long program?", c: "Test a few lines at a time", w: ["Write it all before running anything", "Never test until it is perfect", "Use only one turnLeft(); in a row"], hint: "More Basic Karel, Mistake 3." },
          { t: "write", q: "In your own words, explain why Karel needs every instruction spelled out in order. Use one example from the notes. (2 to 3 sentences)", min: 25, kw: [["exact", "order", "literal", "step", "one at a time", "every"], ["no common sense", "cannot guess", "does exactly", "only does", "nothing else", "what you tell"], ["move", "turnLeft", "turn", "ball", "example"]], need: 2, hint: "Say Karel does only what the code says, in the written order, and give one command example." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Amazon", color: "#FF9900",
    tagline: "You are a robotics intern at a fulfillment center. Your first job is to program a Karel-style robot to handle packages (the balls) with the four starter commands.",
    from: "Jordan Pierce, Robotics Floor Lead", subject: "Three package jobs for the new robot",
    email: "<p>Welcome to the floor. Our test robot understands four commands: move, turnLeft, putBall and takeBall. A package is a ball. The robot starts at avenue 1, street 1 facing East unless the map shows otherwise.</p><p>Write a program for each job. This is a classroom simulation, so the layout is made up.</p>",
    steps: [
      { h: "Job 1: Drop a package", read: "<p>The robot must deliver one package to the loading dock.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Move 4 squares East and drop a package (ball) there. Karel should end at avenue 5, street 1, facing East.",
          starter: "// your program goes here\n", world: world(6, 4), solution: "move();\nmove();\nmove();\nmove();\nputBall();\n", rules: { allowLoose: true }, wrong: ["move();\nmove();\nmove();\nputBall();\n"], why: "Count the squares on the map first: four moves East, then putBall()." }] },
      { h: "Job 2: Pick up and move a package", read: "<p>A package is waiting two squares North. Bring it to the corner two squares East of where the robot starts.</p>",
        items: [{ t: "karel", w: 3, q: "A package (ball) sits at avenue 1, street 3. Karel starts at avenue 1, street 1, facing East. Take the package and drop it at avenue 3, street 1. Karel can end facing any direction on avenue 3, street 1.",
          starter: "// your program goes here\n", world: world(5, 5, 1, 1, "E", [[1, 3, 1]]), compare: ["pos", "balls"], solution: "turnLeft();\nmove();\nmove();\ntakeBall();\nturnLeft();\nturnLeft();\nmove();\nmove();\nturnLeft();\nmove();\nmove();\nputBall();\n", rules: { allowLoose: true },
          wrong: ["move();\nmove();\ntakeBall();\nputBall();\n"], why: "Turn to face North with turnLeft(), take the ball, then use two turnLeft() calls to turn around and travel back down and across." }] },
      { h: "Job 3: Out and back", read: "<p>The robot must leave a package marker and return to its start, facing the way it began.</p>",
        items: [{ t: "karel", w: 3, q: "Karel starts at avenue 1, street 1, facing East. Move 3 squares East, drop a package (ball), then return to avenue 1, street 1 and face East again.",
          starter: "// your program goes here\n", world: world(6, 4), solution: "move();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\nturnLeft();\nturnLeft();\n", rules: { allowLoose: true },
          wrong: ["move();\nmove();\nmove();\nputBall();\nturnLeft();\nturnLeft();\nmove();\nmove();\nmove();\n"], why: "Two turnLeft() calls turn Karel around. You need to turn around again at the end to face East." }] },
      { h: "Explain it to the team", read: "<p>Write two or three sentences for the training guide.</p>",
        items: [{ t: "write", q: "Explain why the order of Karel's commands matters. Use one of your three jobs as the example.", min: 30, kw: [["order", "sequence", "first", "then", "step"], ["move", "turnLeft", "putBall", "takeBall", "turn", "package", "ball"], ["different", "wrong", "result", "ends", "end up", "instead"]], need: 3, why: "A good answer says the same commands in a different order give a different result, and shows it with a command from one job." }] }
    ]
  }
};
