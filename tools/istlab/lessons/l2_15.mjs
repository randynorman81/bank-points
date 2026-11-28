// Lesson 2.15: How to Indent Your Code.  Notes: ist/karel/how-to-indent-your-code.html
import { world } from "../karel_helpers.mjs";
const N = { label: "Open the How to Indent notes", href: "../karel/how-to-indent-your-code.html" };
export default {
  id: "2.15", title: "How to Indent Your Code", back: "../unit-2/index.html",
  w: {
    pts: 50,
    intro: "You will go through the How to Indent Your Code notes and then re-indent messy programs. The grader checks that your program still works AND that every line is indented the way the notes says. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Indentation is for humans", links: [N],
        read: "<p>Open the notes and read the top of the page, <b>00: An Important Difference From Some Languages</b> and <b>01: Same Code, Two Ways</b>.</p>",
        items: [
          { t: "mc", q: "In this version of Karel, what controls which commands belong to which function or loop?", c: "The curly braces { }, not the spacing", w: ["The indentation of each of the lines", "The comments written beside the code", "The line numbers shown on the left side"], hint: "The first paragraph of part 00." },
          { t: "mc", q: "If indentation does not change what the program does, why bother?", c: "Unindented code is nearly impossible for people to follow", w: ["Karel runs noticeably faster with indenting", "The program will not run at all without it", "Indenting is required by CodeHS to score the code"], hint: "The second paragraph of part 00." }
        ] },
      { h: "The rule", links: [N],
        read: "<p>Read <b>02: The Rule</b>, including the table of nesting levels.</p>",
        items: [
          { t: "mc", q: "What should a closing brace } do?", c: "Line up with the line that opened it", w: ["Sit at the far right", "Be indented one extra level", "Go on the same line as the next command"], hint: "The first paragraph of part 02." },
          { t: "match", q: "Match each nesting level to what is typically there.", pairs: [["Level 0 (no indent)", "function main() { and its closing }"], ["Level 1 (indented once)", "Commands directly inside main, such as a for loop's first line"], ["Level 2 (indented twice)", "Commands inside that for loop, such as an if statement's first line"], ["Level 3 (indented three times)", "Commands inside that if statement"]], hint: "The table in part 02." },
          { t: "karel", w: 3, q: "Re-indent this program using 2 spaces for each level. Do not change any command. Karel starts at avenue 1, street 1, facing East and ends at avenue 5 with a ball on avenues 2, 3, 4 and 5.",
            starter: "function main() {\nfor (var i = 0; i < 4; i++) {\nmove();\nputBall();\n}\n}\n", world: world(7, 3), rules: { requireMain: true, indent: true, mustUse: ["for"] },
            solution: "function main() {\n  for (var i = 0; i < 4; i++) {\n    move();\n    putBall();\n  }\n}\n", wrong: ["function main() {\nfor (var i = 0; i < 4; i++) {\nmove();\nputBall();\n}\n}\n"], hint: "main's contents go in 2 spaces; the loop's contents go in 4 spaces; each } lines up with its opening line." },
          { t: "karel", w: 3, q: "Re-indent this program with an if statement inside a for loop. Use 2 spaces per level. Karel starts at avenue 1, street 1, facing East. It takes a ball from any corner that has one, for 5 squares.",
            starter: "function main() {\nfor (var i = 0; i < 5; i++) {\nif (ballsPresent()) {\ntakeBall();\n}\nmove();\n}\n}\n", world: world(7, 3, 1, 1, "E", [[2, 1, 1], [4, 1, 1]]), rules: { requireMain: true, indent: true, mustUse: ["for", "if"] },
            solution: "function main() {\n  for (var i = 0; i < 5; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 5; i++) {\n    if (ballsPresent()) {\n    takeBall();\n    }\n    move();\n  }\n}\n"], hint: "takeBall(); is at level 3, so it is indented 6 spaces." }
        ] },
      { h: "Quick check", links: [N],
        read: "<p>Read the quick check box and the last line of the notes.</p>",
        items: [
          { t: "mc", q: "What is the quick check the notes gives?", c: "If you cannot match each } to its { by indentation, it is not consistent yet", w: ["If the program runs, then the indentation is fine", "If every line starts in column 1, then it is fine", "If there are no comments, then the indentation is fine"], hint: "The Quick check box." },
          { t: "write", q: "In your own words, explain why indentation is \"for humans, not the computer.\" (2 to 3 sentences)", min: 25, kw: [["human", "reader", "read", "person"], ["computer", "braces", "{", "doesn't care", "does not care", "runs"], ["shape", "glance", "follow", "understand", "blocks", "level"]], need: 3, hint: "Say braces tell Karel what belongs together, but indentation shows people the shape of the code." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "Slack", color: "#4A154B",
    tagline: "You are a developer-experience intern. Your team's style guide says every program must be indented consistently before it is shared.",
    from: "Ari Whitfield, Developer Experience", subject: "Clean up three programs before the review",
    email: "<p>Hi, three programs were written with no indentation. Please re-indent them using two spaces for each level and do not change what they do. Closing braces line up with the line that opened them.</p><p>This is a classroom simulation, so the layouts are made up. The grader checks both the behavior and the indentation.</p>",
    steps: [
      { h: "Program 1: Diagonal", read: "<p>Karel climbs a diagonal and drops a ball on each step.</p>",
        items: [{ t: "karel", w: 3, q: "Re-indent this program (2 spaces per level). Karel starts at avenue 1, street 1, facing East.",
          starter: "function turnRight() {\nturnLeft();\nturnLeft();\nturnLeft();\n}\n\nfunction main() {\nfor (var i = 0; i < 3; i++) {\nputBall();\nmove();\nturnLeft();\nmove();\nturnRight();\n}\n}\n", world: world(6, 6), rules: { requireMain: true, indent: true, mustDefine: ["turnRight"] },
          solution: "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n\nfunction main() {\n  for (var i = 0; i < 3; i++) {\n    putBall();\n    move();\n    turnLeft();\n    move();\n    turnRight();\n  }\n}\n", wrong: ["function turnRight() {\nturnLeft();\nturnLeft();\nturnLeft();\n}\n\nfunction main() {\nfor (var i = 0; i < 3; i++) {\nputBall();\nmove();\nturnLeft();\nmove();\nturnRight();\n}\n}\n"], why: "Each function's body is indented one level, and the loop's body is indented two levels." }] },
      { h: "Program 2: Pick up along the way", read: "<p>A while loop with an if inside it.</p>",
        items: [{ t: "karel", w: 3, q: "Re-indent this program (2 spaces per level). Karel starts at avenue 1, street 1, facing East and walks to the wall taking balls.",
          starter: "function main() {\nwhile (frontIsClear()) {\nif (ballsPresent()) {\ntakeBall();\n}\nmove();\n}\nif (ballsPresent()) {\ntakeBall();\n}\n}\n", world: world(7, 3, 1, 1, "E", [[1, 1, 1], [4, 1, 1], [7, 1, 1]]), hidden: [world(5, 2, 1, 1, "E", [[2, 1, 1], [5, 1, 1]])], rules: { requireMain: true, indent: true, mustUse: ["while", "if"] },
          solution: "function main() {\n  while (frontIsClear()) {\n    if (ballsPresent()) {\n      takeBall();\n    }\n    move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  }\n}\n", wrong: ["function main() {\n  while (frontIsClear()) {\n  if (ballsPresent()) {\n    takeBall();\n  }\n  move();\n  }\n  if (ballsPresent()) {\n    takeBall();\n  }\n}\n"], why: "The if inside the while is level 2, and takeBall(); inside that if is level 3." }] },
      { h: "Program 3: if/else in a loop", read: "<p>An else block adds another level to track.</p>",
        items: [{ t: "karel", w: 4, q: "Re-indent this program (2 spaces per level). Pay attention to the line <code>} else {</code>, which closes one block and opens another. Karel starts at avenue 1, street 1, facing East.",
          starter: "function main() {\nfor (var i = 0; i < 5; i++) {\nif (ballsPresent()) {\ntakeBall();\n} else {\nputBall();\n}\nmove();\n}\n}\n", world: world(7, 3, 1, 1, "E", [[2, 1, 1], [3, 1, 1]]), hidden: [world(8, 3, 1, 1, "E", [[1, 1, 1], [5, 1, 1]])], rules: { requireMain: true, indent: true, mustUse: ["for", "if", "else"] },
          solution: "function main() {\n  for (var i = 0; i < 5; i++) {\n    if (ballsPresent()) {\n      takeBall();\n    } else {\n      putBall();\n    }\n    move();\n  }\n}\n", wrong: ["function main() {\n  for (var i = 0; i < 5; i++) {\n    if (ballsPresent()) {\n      takeBall();\n      } else {\n      putBall();\n    }\n    move();\n  }\n}\n"], why: "} else { lines up with the if that it belongs to, and the lines inside each block are one level deeper." }] },
      { h: "Explain it", read: "<p>Write a note for the style guide.</p>",
        items: [{ t: "write", q: "Write the style-guide rule for indenting Karel code in your own words, with one example of what is at each level. (2 to 3 sentences)", min: 30, kw: [["{", "brace", "open"], ["indent", "level", "one more", "two spaces", "spaces"], ["closing", "}", "line up", "lines up", "lines back"]], need: 3, why: "A strong rule says to indent one more level after every opening brace and line the closing brace up with the line that opened it." }] }
    ]
  }
};
