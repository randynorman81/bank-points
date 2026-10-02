/* Notes content for Unit 7: Turtle Graphics (CodeHS Unit 1). Rendered by ../notes-engine.js */
(function () {
  var C = { acc: "#5FD8DF", amb: "#FDD877", red: "#FCA5A5", ok: "#34D399", soft: "#8B9AAE", ink: "#EAEFF6", bg: "#151A24" };
  function svg(w, h, inner, label) { return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '">' + inner + "</svg>"; }
  function t(x, y, s, size, fill, anchor) { return '<text x="' + x + '" y="' + y + '" font-size="' + (size || 13) + '" fill="' + (fill || C.ink) + '" text-anchor="' + (anchor || "start") + '">' + s + "</text>"; }
  function plane(points) {
    var o = "", i;
    for (i = -5; i <= 5; i++) o += '<line x1="' + (220 + i * 40) + '" y1="10" x2="' + (220 + i * 40) + '" y2="330" stroke="' + (i ? "#232B38" : "#8B9AAE") + '" stroke-width="' + (i ? 1 : 2) + '"/>';
    for (i = -4; i <= 4; i++) o += '<line x1="10" y1="' + (170 + i * 40) + '" x2="430" y2="' + (170 + i * 40) + '" stroke="' + (i ? "#232B38" : "#8B9AAE") + '" stroke-width="' + (i ? 1 : 2) + '"/>';
    o += t(424, 164, "x", 14, C.acc, "end") + t(228, 22, "y", 14, C.acc) + t(230, 186, "(0, 0)", 12, C.soft);
    points.forEach(function (p) { o += '<circle cx="' + (220 + p[0] * 40) + '" cy="' + (170 - p[1] * 40) + '" r="6" fill="' + C.amb + '"/>' + t(220 + p[0] * 40 + 10, 170 - p[1] * 40 - 8, "(" + p[0] + ", " + p[1] + ")", 13); });
    return svg(440, 340, o, "Coordinate plane with labeled points");
  }
  function compass() {
    var o = '<circle cx="220" cy="120" r="84" fill="#10141C" stroke="#3A4658" stroke-width="2"/>', d = [[0, "right (0)", 1, 0], [90, "up (90)", 0, -1], [180, "left (180)", -1, 0], [270, "down (270)", 0, 1]];
    d.forEach(function (a) { o += '<line x1="220" y1="120" x2="' + (220 + a[2] * 80) + '" y2="' + (120 + a[3] * 80) + '" stroke="' + C.acc + '" stroke-width="3"/>' + t(220 + a[2] * 118, 125 + a[3] * 100, a[1], 13, C.amb, "middle"); });
    o += '<circle cx="220" cy="120" r="6" fill="' + C.amb + '"/>' + t(220, 232, "left(90) adds 90 to the heading. right(90) subtracts 90.", 12, C.soft, "middle");
    return svg(440, 244, o, "Tracy headings measured in degrees");
  }
  function planeBlock(pts) { return ["svg", plane(pts), "Every spot on the canvas is one (x, y) pair. x says how far right (or left), y says how far up (or down)."]; }
  function turnSvg(a) {
    var rad = a * Math.PI / 180, x2 = 200 + 110 * Math.cos(rad), y2 = 150 - 110 * Math.sin(rad), o = '<line x1="60" y1="150" x2="200" y2="150" stroke="' + C.acc + '" stroke-width="4"/><line x1="200" y1="150" x2="270" y2="150" stroke="#3A4658" stroke-width="2" stroke-dasharray="5 5"/><line x1="200" y1="150" x2="' + x2 + '" y2="' + y2 + '" stroke="' + C.amb + '" stroke-width="4"/><circle cx="60" cy="150" r="6" fill="' + C.ink + '"/>';
    return svg(340, 250, o + t(70, 176, "forward(140)", 12, C.acc) + t(210, 242, "left(" + a + ") then forward(110)", 12, C.amb), "Path after turning by an angle");
  }
  function polySvg(n) {
    var pts = [], k, R = 85;
    for (k = 0; k < n; k++) pts.push((150 + R * Math.sin(2 * Math.PI * k / n)).toFixed(1) + "," + (110 - R * Math.cos(2 * Math.PI * k / n)).toFixed(1));
    return svg(300, 220, '<polygon points="' + pts.join(" ") + '" fill="rgba(95,216,223,.15)" stroke="' + C.acc + '" stroke-width="3"/>', n + "-sided regular polygon");
  }

  var D = (window.NOTES_DATA = window.NOTES_DATA || {});

  D["7.1"] = {
    id: "7.1", title: "Intro to Python with Tracy the Turtle", lessonFile: "7-1-intro-to-python-with-tracy-the-turtle.html", codehs: "CodeHS 1.1", tags: ["Python", "Tracy"],
    deck: "What a program really is, how Tracy follows commands one at a time, and why the order of your commands decides what gets drawn.",
    sections: [
      { h: "A Program Is a Recipe", f: "Section 1", story: "A recipe is a list of steps you follow in order. A program is the same idea for a computer: a list of commands carried out one at a time, top to bottom. The computer never improvises. It does exactly what you wrote, in exactly that order.",
        b: [["gfx", "flow", { steps: ["forward(100)|move 100 steps", "left(90)|turn left", "forward(100)|move again", "left(90)|turn left"], perRow: 4 }, "Each box is one command. Tracy runs them from left to right and never skips one."],
          ["cards", [["Program", "A list of commands the computer follows, in order."], ["Command", "One instruction, like forward(100). It ends with parentheses."], ["Sequence", "The order the commands run in. Change the order and you change the result."], ["Tracy", "CodeHS's turtle. She draws a line wherever she walks while her pen is down."]]]] },
      { h: "Make Tracy Draw", f: "Try it", story: "Reading about commands only gets you so far. Below is a mini Tracy. Edit the numbers, press Run, and see what changes.",
        b: [["turtle", { code: "forward(100)\nleft(90)\nforward(100)", presets: [["Corner", "forward(100)\nleft(90)\nforward(100)"], ["Staircase", "forward(40)\nleft(90)\nforward(40)\nright(90)\nforward(40)\nleft(90)\nforward(40)\nright(90)\nforward(40)"], ["Zigzag", "forward(60)\nleft(90)\nforward(60)\nright(90)\nforward(60)\nleft(90)\nforward(60)"]] }],
          ["hint", "<b>Try this:</b> change 100 to 50. The line gets shorter because the number inside the parentheses is how far Tracy walks."]] },
      { h: "Order Matters", f: "Sequence", story: "Swap two commands and you get a different drawing. Tracy never rearranges your code to be helpful.",
        b: [["order", { q: "Put these commands in order to draw an L: a long line, a turn, then a short line.", lines: ["forward(100)", "left(90)", "forward(40)"], why: "Walk, turn, walk. If the turn came first Tracy would set off in a different direction.", hint: "The turn goes between the two lines." }],
          ["predict", { code: "forward(50)\nleft(90)\nforward(50)", q: "Tracy starts in the middle facing right. After this program, where is she?", opts: ["Back where she started", "50 to the right and 50 up", "50 to the left and 50 down", "Only 50 to the right"], ans: 1, why: "She walks 50 to the right, turns left to face up, then walks 50 up." }]] }
    ],
    quiz: [["What is a program?", ["A random list of words", "A list of commands run in order", "Only a drawing", "A kind of turtle"], 1, "A program is a sequence of commands the computer follows exactly."], ["What does forward(100) do?", ["Turns Tracy 100 degrees", "Moves Tracy forward 100 steps", "Erases the canvas", "Nothing"], 1, "The number is how far she walks."], ["If you swap two lines of code, what happens?", ["The computer fixes it", "The program may do something different", "It always crashes", "Tracy draws faster"], 1, "Order matters: commands run top to bottom."], ["Which of these is a command?", ["left(90)", "drawing", "sequence", "line"], 0, "A command is an instruction with parentheses."]],
    end: ["Commands, in order. That is all a program is.", "Loops, functions, and sensors later in the course are smarter ways to organize commands like these."]
  };

  D["7.2"] = {
    id: "7.2", title: "Tracy's Grid World", lessonFile: "7-2-tracy-s-grid-world.html", codehs: "CodeHS 1.2", tags: ["Python", "Coordinates"],
    deck: "The coordinate plane Tracy lives on, how to read and write (x, y) pairs, and how penup() and pendown() decide whether moving draws a line.",
    sections: [
      { h: "The Coordinate Plane", f: "Section 1", story: "Tracy's canvas is the same x and y grid from math class. The middle is (0, 0). Moving right makes x bigger, moving up makes y bigger. Any spot on the canvas can be named with one pair of numbers.",
        b: [planeBlock([[2, 1], [-3, 2], [-2, -1], [3, -2]]), ["table", ["Where", "x", "y"], [["Right of center, above", "positive", "positive"], ["Left of center, above", "negative", "positive"], ["Left of center, below", "negative", "negative"], ["Right of center, below", "positive", "negative"]]],
          ["cards", [["Coordinate plane", "A grid made of an x-axis (left and right) and a y-axis (up and down)."], ["Coordinate pair (x, y)", "Two numbers that name one spot. x always comes first."]]]] },
      { h: "Click to Read a Coordinate", f: "Try it", story: "Click anywhere on the grid. You get the coordinate pair and the line of code that would send Tracy there.",
        b: [["widget", { html: '<svg id="cg" viewBox="-220 -220 440 440" style="width:100%;max-width:420px;display:block;margin:0 auto;background:#0E131B;border-radius:6px;cursor:crosshair"></svg><div class="wout" id="cgo">Click the grid.</div>', js: function (w) {
          var s = w.querySelector("#cg"), o = "", i; for (i = -10; i <= 10; i++) { o += '<line x1="' + i * 20 + '" y1="-200" x2="' + i * 20 + '" y2="200" stroke="' + (i ? "#1B2330" : "#8B9AAE") + '"/><line x1="-200" y1="' + i * 20 + '" x2="200" y2="' + i * 20 + '" stroke="' + (i ? "#1B2330" : "#8B9AAE") + '"/>'; } s.innerHTML = o + '<circle id="cgd" r="7" fill="#FDD877" cx="0" cy="0"/>';
          s.onclick = function (e) { var r = s.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 440 - 220, py = (e.clientY - r.top) / r.height * 440 - 220, x = Math.max(-10, Math.min(10, Math.round(px / 20))), y = -Math.max(-10, Math.min(10, Math.round(py / 20))); s.querySelector("#cgd").setAttribute("cx", x * 20); s.querySelector("#cgd").setAttribute("cy", -y * 20); w.querySelector("#cgo").textContent = "(" + x + ", " + y + ")   ->   setposition(" + x + ", " + y + ")"; };
        } }], ["hint", "Each square here is 1 unit. On the real canvas the units are bigger, but the signs work the same way."]] },
      { h: "Pen Up, Pen Down", f: "Section 2", story: "Tracy draws a line wherever she walks, but only while her pen is down. Lift the pen, and she can travel without leaving a mark. That is how you draw two separate shapes without a line between them.",
        b: [["turtle", { code: "forward(80)\npenup()\nforward(40)\npendown()\nforward(80)", presets: [["Gap in a line", "forward(80)\npenup()\nforward(40)\npendown()\nforward(80)"], ["Two lines", "penup()\ngoto(-100, -50)\npendown()\ngoto(100, -50)\npenup()\ngoto(-100, 50)\npendown()\ngoto(100, 50)"], ["backward", "forward(100)\nbackward(40)"]] }],
          ["predict", { code: "penup()\nforward(100)\nleft(90)\nforward(50)", q: "What will Tracy draw?", opts: ["An L shape", "A single straight line", "Nothing at all, but she ends up in a new spot", "A circle"], ans: 2, why: "The pen was up for the whole program. Tracy moved, but no line appeared." }],
          ["match", [["penup()", "Lifts the pen so moving does not draw"], ["pendown()", "Puts the pen back so moving draws"], ["backward(n)", "Walks backward without turning around"], ["(0, 0)", "The center of the canvas"]]]] }
    ],
    quiz: [["In (x, y), which number comes first?", ["y", "x", "Either one", "The bigger one"], 1, "x always comes first."], ["Where is (0, 0)?", ["Top left corner", "Bottom left corner", "The center of the canvas", "Off the screen"], 2, "The origin is the middle."], ["Which point is left of center and above it?", ["(3, 2)", "(-3, 2)", "(-3, -2)", "(3, -2)"], 1, "Negative x is left, positive y is up."], ["After penup(), what does forward(50) do?", ["Draws a line", "Moves Tracy without drawing", "Does nothing", "Erases the canvas"], 1, "No line while the pen is up."]],
    end: ["Every spot has an address.", "Coordinates reappear in graphics, games, and maps. The same (x, y) idea runs through all of them."]
  };

  D["7.3"] = {
    id: "7.3", title: "Turning Tracy", lessonFile: "7-3-turning-tracy.html", codehs: "CodeHS 1.3", tags: ["Python", "Heading"],
    deck: "How left() and right() change which way Tracy faces without moving her, and how turns and walks combine into shapes.",
    sections: [
      { h: "Heading: Which Way Is Tracy Facing?", f: "Section 1", story: "Tracy always faces some direction, called her heading. forward() walks in that direction. left() and right() spin her in place, so her position stays the same and only her heading changes.",
        b: [["svg", compass(), "Tracy starts facing right. Each left(90) rotates her a quarter turn counterclockwise."],
          ["trace", { code: ["forward(100)", "left(90)", "forward(100)", "left(90)", "forward(100)"], steps: [[0, { x: 100, y: 0, heading: "0 (right)" }, "", "forward(100) walks 100 to the right."], [1, { x: 100, y: 0, heading: "90 (up)" }, "", "left(90) spins her in place. x and y do not change."], [2, { x: 100, y: 100, heading: "90 (up)" }, "", "Now forward goes up."], [3, { x: 100, y: 100, heading: "180 (left)" }, "", "Another quarter turn: she faces left."], [4, { x: 0, y: 100, heading: "180 (left)" }, "", "Walking left brings x back to 0."]] }],
          ["cards", [["left() / right()", "Turn Tracy in place. left turns counterclockwise, right turns clockwise."], ["Heading", "The direction Tracy is currently facing."]]]] },
      { h: "Draw a Square", f: "Try it", story: "A square is four walks and four quarter turns. Press a preset, then change the number inside forward() to resize it.",
        b: [["turtle", { code: "forward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)", presets: [["Square", "forward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)"], ["Backwards square", "forward(100)\nright(90)\nforward(100)\nright(90)\nforward(100)\nright(90)\nforward(100)\nright(90)"], ["Plus sign", "forward(50)\nbackward(100)\nforward(50)\nleft(90)\nforward(50)\nbackward(100)"]] }],
          ["hint", "Notice that the square and the backwards square end up as the same shape. They are drawn in opposite directions, left versus right."]] },
      { h: "Left Then Right", f: "Check yourself", story: "Turns can cancel. Before you run anything, predict where Tracy ends up facing.",
        b: [["predict", { code: "left(90)\nright(90)", q: "After these two commands, which way is Tracy facing?", opts: ["Up", "The same way she started", "Left", "Down"], ans: 1, why: "left(90) adds 90 degrees and right(90) subtracts 90 degrees, so they cancel." }],
          ["predict", { code: "forward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)\nleft(90)", q: "Tracy has drawn three sides of a square. Which way is she facing now?", opts: ["Right", "Up", "Left", "Down"], ans: 3, why: "Three left turns is 270 degrees counterclockwise, which points down." }]] }
    ],
    quiz: [["What does left(90) change?", ["Tracy's position", "Tracy's heading", "The pen color", "The canvas size"], 1, "Turning changes heading only."], ["How many left(90) turns make a full circle?", ["2", "3", "4", "5"], 2, "4 times 90 is 360."], ["Which pair of commands cancels out?", ["left(90) then right(90)", "left(90) then left(90)", "forward(10) then forward(10)", "left(90) then forward(90)"], 0, "Equal turns in opposite directions return the heading."], ["A square needs how many forward() and left() commands?", ["2 and 2", "3 and 3", "4 and 4", "8 and 8"], 2, "Four sides, four corners."]],
    end: ["Walk, turn, walk, turn.", "Almost every shape you draw is built from those two moves repeated."]
  };

  D["7.4"] = {
    id: "7.4", title: "Turning Tracy Using Angles", lessonFile: "7-4-turning-tracy-using-angles.html", codehs: "CodeHS 1.5", tags: ["Python", "Angles"],
    deck: "Turning Tracy by any angle, why a full lap is 360 degrees, and the 360 divided by sides rule that draws any regular polygon.",
    sections: [
      { h: "Any Angle You Want", f: "Section 1", story: "Quarter turns are only the start. left() and right() accept any number of degrees, so Tracy can draw diagonals. Drag the slider to change the angle and see where the second line heads.",
        b: [["slider", { label: "left( ) angle", min: 0, max: 180, step: 5, val: 60, unit: "°", f: function (v) { return '<div class="fig" style="margin:0">' + turnSvg(v) + "</div>"; } }],
          ["cards", [["Angle (degrees)", "How much to turn. A full circle is 360 degrees."], ["Exterior angle", "The amount Tracy turns at a corner of a shape."]]]] },
      { h: "The 360 Rule", f: "Section 2", story: "To walk all the way around a shape and end up facing the way you started, your turns must add up to exactly 360 degrees. Split 360 evenly across the corners and you get a regular polygon.",
        b: [["slider", { label: "number of sides", min: 3, max: 12, step: 1, val: 5, f: function (n) { return '<div class="fig" style="margin:0">' + polySvg(n) + "</div>360 / " + n + " = " + Math.round(360 / n * 100) / 100 + " degrees at every corner"; } }],
          ["table", ["Shape", "Sides", "Turn at each corner"], [["Triangle", "3", "120"], ["Square", "4", "90"], ["Pentagon", "5", "72"], ["Hexagon", "6", "60"], ["Octagon", "8", "45"]]]] },
      { h: "Shapes in Code", f: "Try it", story: "These presets use a loop to repeat the walk and turn. Loops come up in a few lessons. For now, read the pattern and change the numbers.",
        b: [["turtle", { code: "for i in range(5):\n    forward(100)\n    left(72)", presets: [["Triangle", "for i in range(3):\n    forward(100)\n    left(120)"], ["Pentagon", "for i in range(5):\n    forward(100)\n    left(72)"], ["Hexagon", "for i in range(6):\n    forward(80)\n    left(60)"], ["Star", "for i in range(5):\n    forward(120)\n    right(144)"]] }],
          ["predict", { q: "Tracy draws a regular octagon (8 sides). How many degrees does she turn at each corner?", opts: ["30", "45", "60", "90"], ans: 1, why: "360 divided by 8 is 45." }]] }
    ],
    quiz: [["How many degrees is a full turn?", ["90", "180", "360", "720"], 2, "A full circle is 360 degrees."], ["What turn draws a regular hexagon?", ["30", "45", "60", "90"], 2, "360 / 6 = 60."], ["The turn at each corner of a regular polygon is...", ["360 times sides", "360 divided by sides", "180 divided by sides", "sides divided by 360"], 1, "360 split evenly across n corners."], ["What can left(45) draw that left(90) cannot?", ["Straight lines", "Diagonal lines", "Nothing", "Circles only"], 1, "Other angles make diagonals."]],
    end: ["360 divided by the number of sides.", "One rule, every regular shape."]
  };

  D["7.5"] = {
    id: "7.5", title: "Comments", lessonFile: "7-5-comments.html", codehs: "CodeHS 1.6", tags: ["Python", "Readability"],
    deck: "Notes the computer ignores, how # works in Python, and how to write comments that help the next reader instead of repeating the code.",
    sections: [
      { h: "Notes the Computer Skips", f: "Section 1", story: "A comment is text in your code that the computer skips entirely. It exists for people: teammates, your teacher, and you next month when you have forgotten why you wrote something. In Python a comment starts with #.",
        b: [["code", "py", "# draw the roof of the house\nleft(30)        # tilt up to start the slope\nforward(60)\n\n# forward(200)   <- commented out: this line does not run"],
          ["gfx", "compare", { left: { title: "Helpful comments", items: ["# turn 144 so the star points line up", "# start at the left edge of the canvas", "# pen up so we don't draw the move"] }, right: { title: "Weak comments", items: ["# forward 100", "# this is code", "# left 90 degrees"] } }, "Good comments explain why. Weak ones just repeat what the code already says."],
          ["cards", [["Comment", "Text the computer ignores, written for human readers."], ["# (single-line comment)", "Everything from the # to the end of the line is ignored."]]]] },
      { h: "Comment It Out", f: "Try it", story: "Programmers also use # to switch a line off without deleting it. Add a # at the start of a line below and press Run.",
        b: [["turtle", { code: "forward(100)\nleft(90)\n# forward(100)\nleft(90)\nforward(100)", presets: [["All lines on", "forward(100)\nleft(90)\nforward(100)\nleft(90)\nforward(100)"], ["Middle line off", "forward(100)\nleft(90)\n# forward(100)\nleft(90)\nforward(100)"], ["Explained", "# draw a corner\nforward(100)   # long side\nleft(90)       # turn up\nforward(50)    # short side"]] }],
          ["predict", { code: "forward(60)\n# left(90)\nforward(60)", q: "What does Tracy draw?", opts: ["An L shape", "One straight line 120 long", "Nothing", "A square"], ans: 1, why: "The left(90) line is commented out, so Tracy keeps walking straight." }]] },
      { h: "Writing a Comment Worth Reading", f: "Check yourself", story: "A comment should answer the question a reader will actually have, which is almost always why.",
        b: [["predict", { code: "left(144)", q: "Which comment is best for this line?", opts: ["# left 144", "# turn Tracy", "# 144 degrees makes a 5-point star", "# line 4"], ans: 2, why: "It tells the reader why the number is 144, which the code alone cannot say." }]] }
    ],
    quiz: [["What symbol starts a comment in Python?", ["//", "#", "/*", "--"], 1, "Python uses # for single-line comments."], ["What does the computer do with a comment?", ["Runs it", "Prints it", "Ignores it", "Fixes it"], 2, "Comments are for humans only."], ["Which comment is most useful?", ["# forward", "# draws a line", "# pen up so the move does not draw", "# code"], 2, "It explains why."], ["Putting # in front of a line of code...", ["Deletes it", "Turns it off without deleting it", "Makes it run twice", "Causes an error"], 1, "That is called commenting it out."]],
    end: ["Comments explain why.", "The code already says what."]
  };

  D["7.6"] = {
    id: "7.6", title: "Naming Guidelines", lessonFile: "7-6-naming-guidelines.html", codehs: "CodeHS 1.7", tags: ["Python", "Style"],
    deck: "The rules Python enforces for names, the snake_case style programmers follow, and how a good name makes code readable.",
    sections: [
      { h: "The Rules Python Enforces", f: "Section 1", story: "Python is strict about what counts as a name. Break a rule and the program will not run. A name for a variable or function is called an identifier.",
        b: [["table", ["Rule", "Fine", "Not allowed"], [["Start with a letter or underscore", "score, _temp", "2nd_place"], ["Only letters, digits, and underscores", "high_score2", "high-score, total$"], ["No spaces", "player_name", "player name"], ["Not a reserved word", "loop_count", "for, if, def"], ["Uppercase and lowercase differ", "Score and score are two names", ""]]],
          ["cards", [["Identifier", "The name you give a variable or function."], ["Naming convention", "An agreed style that makes code easy to read."], ["snake_case", "Lowercase words joined with underscores, like player_score."]]]] },
      { h: "Name Checker", f: "Try it", story: "Type a name and see whether Python would accept it, and whether it follows the usual style.",
        b: [["widget", { html: '<input class="inl" id="nm" value="player score" aria-label="name to check"><div class="wout" id="no"></div>', js: function (w) {
          var inp = w.querySelector("#nm"), out = w.querySelector("#no"), kw = ["for", "if", "else", "elif", "while", "def", "return", "in", "and", "or", "not", "import", "class", "True", "False", "None", "break", "continue", "pass", "try", "except"];
          function chk() { var v = inp.value, a = [];
            if (!v) a.push("Type a name."); else {
              if (/^\d/.test(v)) a.push("Not allowed: it starts with a number."); if (/\s/.test(v)) a.push("Not allowed: it has a space."); if (/[^\w\s]/.test(v)) a.push("Not allowed: it has a special character."); if (kw.indexOf(v) >= 0) a.push("Not allowed: it is a reserved word.");
              if (!a.length) { a.push("Python accepts this name."); if (v !== v.toLowerCase()) a.push("Style: Python names are usually lowercase (snake_case)."); if (v.length < 3) a.push("Style: a longer name says more about what it holds."); if (v === v.toLowerCase() && v.length >= 3) a.push("Style: looks good."); } }
            out.innerHTML = a.join("<br>"); }
          inp.oninput = chk; chk(); } }],
        ["match", [["my score", "Has a space"], ["2nd_place", "Starts with a number"], ["for", "Reserved word"], ["total$", "Special character"]]]] },
      { h: "Descriptive Names", f: "Section 2", story: "Both lines below do the same thing. Only one of them can be read at a glance.",
        b: [["code", "py", "# hard to read\nx = 3\nl = 7\nz = x * l\n\n# easy to read\nnumber_of_rows = 3\nseats_per_row = 7\ntotal_seats = number_of_rows * seats_per_row"],
          ["predict", { q: "Which is the best name for a variable that stores how many lives a player has?", opts: ["l", "x1", "lives_left", "LIVES LEFT"], ans: 2, why: "It is descriptive, lowercase, and uses underscores, with no spaces." }]] }
    ],
    quiz: [["Which name is not allowed in Python?", ["total_score", "2nd_place", "_hidden", "score2"], 1, "Names cannot start with a number."], ["What is snake_case?", ["Words joined with underscores, all lowercase", "Words with capital letters only", "Words with dashes", "Numbers only"], 0, "Like total_score."], ["Which is a reserved word you cannot use as a name?", ["score", "total", "for", "name"], 2, "for is part of the language."], ["Why use descriptive names?", ["They run faster", "They make code readable", "Python requires them", "They use less memory"], 1, "Readers understand them without guessing."]],
    end: ["Name things for the person reading.", "That person is often you, a month from now."]
  };

  D["7.7"] = {
    id: "7.7", title: "Artistic Effects", lessonFile: "7-7-artistic-effects.html", codehs: "CodeHS 1.9", tags: ["Python", "Color"],
    deck: "color(), pensize(), begin_fill() and end_fill(), and the extended circle() command that draws full circles and arcs.",
    sections: [
      { h: "Color and Thickness", f: "Section 1", story: "These commands do not change what shape Tracy can draw. They change how it looks. color() sets the pen color, and pensize() sets how thick the line is.",
        b: [["turtle", { code: 'color("red")\npensize(8)\nforward(100)\ncolor("blue")\npensize(2)\nleft(90)\nforward(100)', presets: [["Two lines", 'color("red")\npensize(8)\nforward(100)\ncolor("blue")\npensize(2)\nleft(90)\nforward(100)'], ["Rainbow square", 'pensize(6)\ncolor("red")\nforward(90)\nleft(90)\ncolor("orange")\nforward(90)\nleft(90)\ncolor("green")\nforward(90)\nleft(90)\ncolor("blue")\nforward(90)\nleft(90)'], ["Thick to thin", 'for i in range(6):\n    pensize(10 - i * 2)\n    forward(40)\n    left(60)']] }],
          ["cards", [["color()", "Sets the pen and fill color. Put the color name in quotes: color(\"red\")."], ["pensize()", "Sets how thick the line is. Bigger numbers are thicker."]]]] },
      { h: "Fill It In", f: "Section 2", story: "To fill a shape with color, wrap its drawing code between begin_fill() and end_fill(). Tracy fills everything she traced once end_fill() runs.",
        b: [["turtle", { code: 'color("orange")\nbegin_fill()\nfor i in range(4):\n    forward(90)\n    left(90)\nend_fill()', presets: [["Filled square", 'color("orange")\nbegin_fill()\nfor i in range(4):\n    forward(90)\n    left(90)\nend_fill()'], ["Filled triangle", 'color("green")\nbegin_fill()\nfor i in range(3):\n    forward(110)\n    left(120)\nend_fill()'], ["Forgot end_fill", 'color("purple")\nbegin_fill()\nfor i in range(4):\n    forward(90)\n    left(90)']] }],
          ["predict", { q: "What happens if you use begin_fill() but forget end_fill()?", opts: ["Nothing breaks and the shape is filled", "The shape is never filled in", "Tracy draws a circle instead", "The program crashes"], ans: 1, why: "The fill is applied when end_fill() runs. Without it, the shape stays empty." }],
          ["cards", [["begin_fill() / end_fill()", "Start and stop recording a shape to fill with color."]]]] },
      { h: "Circles and Arcs", f: "Section 3", story: "circle(radius) draws a full circle that starts and ends where Tracy is. Give it a second number and it draws only that many degrees of the circle, which makes arcs. A negative radius curves the other way.",
        b: [["turtle", { code: 'color("teal")\ncircle(50)', presets: [["Circle", 'color("teal")\ncircle(50)'], ["Half circle", 'pensize(5)\ncolor("red")\ncircle(60, 180)'], ["Smile", 'pensize(4)\npenup()\ngoto(-60, -10)\nright(90)\npendown()\ncircle(60, 180)'], ["Filled sun", 'color("gold")\nbegin_fill()\ncircle(55)\nend_fill()']] }],
          ["hint", "A positive radius curves left. Try a negative number and watch Tracy curve right."]] }
    ],
    quiz: [["How do you set the pen to red?", ["color(red)", "color(\"red\")", "pen = red", "red()"], 1, "Color names go in quotes."], ["What makes a line thicker?", ["color()", "pensize()", "circle()", "penup()"], 1, "pensize(n) sets the thickness."], ["Which commands wrap around a shape to fill it?", ["fill() and stop()", "begin_fill() and end_fill()", "color() and pensize()", "penup() and pendown()"], 1, "They mark the start and end of the shape."], ["circle(50, 180) draws...", ["A full circle", "A half circle", "A square", "Nothing"], 1, "The second number is how many degrees of circle to draw."]],
    end: ["Same shapes, more style.", "A few extra commands turn plain outlines into artwork."]
  };

  D["7.8"] = {
    id: "7.8", title: "Top Down Design", lessonFile: "7-8-top-down-design.html", codehs: "CodeHS 1.10", tags: ["Python", "Functions"],
    deck: "How to break a big drawing into small pieces, write each piece as its own function, and call them in order to build the whole picture.",
    sections: [
      { h: "Break the Big Goal Into Small Goals", f: "Section 1", story: "A house is too big to draw in one go, but a square, a triangle, and a rectangle are easy. Top down design means starting with the big goal and splitting it into smaller and smaller pieces until each piece is simple. Each piece becomes a function.",
        b: [["gfx", "tree", { parent: ["draw_house()", "the big goal"], children: [["draw_walls()", "a square"], ["draw_roof()", "a triangle"], ["draw_door()", "a rectangle"]] }, "Each child is small enough to write as one function."],
          ["cards", [["Top down design", "Start with the big goal, then break it into smaller and smaller pieces."], ["Decomposition", "Splitting a problem into smaller problems."], ["Function", "A named group of code you can run whenever you need it by calling its name."]]]] },
      { h: "Build the House", f: "Try it", story: "The code below defines three small functions, then calls them. Try the presets to see the house come together one piece at a time, then change a size.",
        b: [["turtle", { size: 360, code: "def draw_walls(size):\n    for i in range(4):\n        forward(size)\n        left(90)\n\ndef draw_roof(size):\n    penup()\n    goto(house_x, house_y + size)\n    pendown()\n    for i in range(3):\n        forward(size)\n        left(120)\n\ndef draw_door(size):\n    penup()\n    goto(house_x + size * 0.4, house_y)\n    pendown()\n    for i in range(2):\n        forward(size * 0.2)\n        left(90)\n        forward(size * 0.5)\n        left(90)\n\nhouse_x = -50\nhouse_y = -60\npenup()\ngoto(house_x, house_y)\npendown()\ndraw_walls(100)\ndraw_roof(100)\ndraw_door(100)", presets: [["Walls only", "def draw_walls(size):\n    for i in range(4):\n        forward(size)\n        left(90)\n\npenup()\ngoto(-50, -50)\npendown()\ndraw_walls(100)"], ["Walls and roof", "def draw_walls(size):\n    for i in range(4):\n        forward(size)\n        left(90)\n\ndef draw_roof(size):\n    penup()\n    goto(house_x, house_y + size)\n    pendown()\n    for i in range(3):\n        forward(size)\n        left(120)\n\nhouse_x = -80\nhouse_y = -90\npenup()\ngoto(house_x, house_y)\npendown()\ndraw_walls(160)\ndraw_roof(160)"]] }],
          ["hint", "Notice that the main program at the bottom reads like a to-do list: draw_walls, draw_roof, draw_door. That is the point of top down design."],
          ["order", { q: "Put the top down design steps in order.", lines: ["Decide the big goal: draw a house", "Break it into walls, roof, and door", "Write one function for each piece", "Call the functions in the main program"], why: "Big goal first, then pieces, then code, then the finished program.", hint: "Plan from the whole to the parts before writing code." }]] }
    ],
    quiz: [["Top down design starts with...", ["The smallest detail", "The big goal", "The first line of code", "The colors"], 1, "You begin with the whole and break it down."], ["Each small piece usually becomes a...", ["Comment", "Function", "Color", "Number"], 1, "One function per piece."], ["Why break a program into functions?", ["It runs faster", "It is easier to read, fix, and reuse", "Python requires it", "It uses fewer lines always"], 1, "Smaller pieces are easier to understand and test."], ["What does calling draw_roof(100) do?", ["Defines the function", "Runs the function with size 100", "Deletes the roof", "Colors the roof"], 1, "Calling a function runs its code."]],
    end: ["Solve a big problem by solving small ones.", "That idea works for programs, projects, and plenty of things that are not code."]
  };
})();
