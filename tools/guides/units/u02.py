from lesson import *

S0 = '0| avenue=1; street=1; facing="East"; balls_here=0'

UNIT = Unit(2, "Paired Programming Project", "Work with a partner the way professional programmers do: two roles, honest credit, careful reflection, and a final audit.",
    "Big Idea 1: Creative Development", "#7C3AED", "#6D28D9", "#A78BFA", "#EDE9FE", "network",
    ["Describe the driver and navigator roles and switch them", "Explain how collaboration improves programs", "Reflect on what worked and what to change", "Use an audit checklist to verify your work before you submit"],
    [
    L("2.1.A", "Work as a driver and a navigator in pair programming, and see why collaboration makes programs better.",
      [("pair programming", "two people working together on one computer"), ("driver", "the partner who types the code"), ("navigator", "the partner who reads, plans ahead, and spots mistakes"), ("collaboration", "working with others toward one goal")],
      [("Two roles, one computer", """In **pair programming**, two people share one computer and one program. The **driver** types and says out loud what they are doing. The **navigator** watches, thinks ahead, asks questions, and catches mistakes. The two **switch roles** often, so both people understand every line."""),
       ("Why work together?", """Two minds see more than one. A partner notices a missing bracket, suggests a simpler idea, and asks *why* when something is unclear. Different people bring **different skills and viewpoints**, which makes the program stronger. Collaboration also means being fair: both partners work, and both get credit."""),
       ("How to be a good partner", """- Talk about the plan **before** typing.
- **Listen** and ask questions instead of grabbing the keyboard.
- Say what you are doing as you do it.
- Switch roles on a timer, such as every few minutes.
- Be kind about mistakes. Everyone makes them."""),
      ],
      [A("Two partners, two functions", 'def go_up():\n    turn_left()\n    move()\n\ndef go_right():\n    turn_right()\n    move()',
         [(0, "def go_up():", "Partner A writes this one."), (4, "def go_right():", "Partner B writes this one.")], cap="Each partner writes a small function. They test them together.", check=False)],
      [K("Partner A's function works alone", 'def go_up():\n    turn_left()\n    move()\n\ngo_up()', [S0, '1|', '5|', '2| facing="North"', '3| street=2'], cap="Partner A tests go_up on its own: Karel turns North and moves up one street."),
       K("Partner B's function works alone", 'def go_right():\n    turn_right()\n    move()\n\nturn_left()\ngo_right()', [S0, '1|', '5| facing="North"', '6|', '2| facing="East"', '3| avenue=2'], cap="Partner B tests go_right: from North, a right turn faces East, and Karel moves one avenue."),
       K("The pair combine the pieces", 'def go_up():\n    turn_left()\n    move()\n\ndef go_right():\n    turn_right()\n    move()\n\ngo_up()\ngo_right()', [S0, '1|', '5|', '9|', '2| facing="North"', '3| street=2', '10|', '6| facing="East"', '7| avenue=2'], cap="Together the functions make one step of a staircase: up, then right. Karel ends on avenue 2, street 2."),
       K("Navigator spots a bug", 'def go_up():\n    turn_left()\n    move()\n\ngo_up()\ngo_up()', [S0, '1|', '5|', '2| facing="North"', '3| street=2', '6|', '2| facing="West"', '3|'], out="RuntimeError: Karel hit a wall", cap="The driver calls go_up twice, but the second call turns left AGAIN (now West) and hits the wall. The navigator catches it: go_up should only turn once.")],
      [("One partner does everything", "The other learns nothing.", "Switch roles often"), ("The navigator stays silent", "Mistakes go unnoticed.", "Ask questions and give ideas"), ("The driver types without explaining", "The navigator cannot follow.", "Say what you are doing"), ("Arguing about who is right", "No progress.", "Test both ideas"),
       ("Starting to type before a plan", "You rewrite later.", "Plan together first"), ("Not crediting both partners", "It is not honest.", "Say who did what"), ("Splitting the work and never testing together", "The parts do not fit.", "Test the pieces together"), ("Staying on one role all period", "You miss half the skills.", "Use a timer")],
      ["Collaboration can produce better programs because of different perspectives and skills.", "Pair programming is one way programmers collaborate.", "Programs built with others should give credit to everyone who helped."],
      [Q("In pair programming, who types the code?", ["The driver", "The navigator", "The teacher", "Nobody"], 0, "The driver types, the navigator reviews."),
       Q("Why switch roles?", ["So both partners understand every line", "To go faster", "It is a rule with no reason", "To avoid talking"], 0, "Both people should understand the code."),
       Q("What does the navigator do?", ["Reads, plans, and spots mistakes", "Types everything", "Leaves", "Grades"], 0, "The navigator is the second set of eyes."),
       Q("Collaboration helps because...", ["Different people bring different ideas and skills", "It is slower", "It avoids testing", "It removes bugs automatically"], 0, "Different perspectives improve a program.")],
      site="<b>Unit 2:</b> Paired Programming Project, Day 1", title="Intro to Paired Programming and Collaboration"),

    L("2.1.B", "Create a program with a partner and reflect on what worked, what did not, and what you would change.",
      [("reflection", "thinking back about what worked and what to change"), ("iteration", "improving a program in rounds"), ("contribution", "the part each partner did"), ("feedback", "comments that help you improve")],
      [("Create together", """During the project you and your partner plan a program, build it in small pieces, and test as you go. Build one part at a time, run it, then add the next. Keep a short log of what each partner contributed, so credit stays fair."""),
       ("Reflect", """**Reflection** means looking back: *What worked? What was hard? What bug took the longest? What would we change?* Reflecting after each session helps you learn faster and write a better next version."""),
       ("Give and use feedback", """Ask another pair to try your program. Listen to what confuses them. Feedback is a gift: it shows problems you can no longer see. Each round of feedback and fixes is one **iteration**."""),
      ],
      [A("Build in small pieces", 'def step():\n    move()\n    put_ball()\n\nfor i in range(3):\n    step()',
         [(0, "def step():", "One tested piece."), (5, "step()", "Reused three times.")], cap="Small pieces are easier to test and to share.", check=False)],
      [K("Round 1", 'move()\nput_ball()\nmove()', [S0, '1| avenue=2', '2| balls_here=1', '3| avenue=3; balls_here=0'], cap="The first version puts one ball. The reflection: it needs a ball on every square."),
       K("Round 2 (after feedback)", 'def step():\n    put_ball()\n    move()\n\nfor i in range(3):\n    step()', [S0, '1|', '5|', '6|', '2| balls_here=1', '3| avenue=2; balls_here=0', '6|', '2| balls_here=1', '3| avenue=3; balls_here=0', '6|', '2| balls_here=1', '3| avenue=4; balls_here=0'], cap="After feedback the pair added a loop. Now a ball sits on avenues 1, 2, and 3."),
       K("Test a new world", 'def step():\n    put_ball()\n    move()\n\nfor i in range(3):\n    step()', [S0, '1|', '5|', '6|', '2| balls_here=1', '3| avenue=2; balls_here=0', '6|', '2| balls_here=1', '3| avenue=3; balls_here=0', '6|', '2| balls_here=1', '3| avenue=3'], size=(3, 8), out="RuntimeError: Karel hit a wall", cap="In a world only 3 wide, the third move hits the wall. Reflecting on this test shows the program needs a check with front_is_clear()."),
       ],
      [("Reflecting with only \"it was fine\"", "You learn nothing.", "Name something specific"), ("Not recording who did what", "Credit becomes unfair.", "Keep a short log"), ("Defending your idea instead of listening to feedback", "You miss the bug.", "Listen first"), ("Building everything before testing", "Bugs pile up.", "Test every small piece"),
       ("Ignoring a partner's idea", "It might be better.", "Try it"), ("Changing the program without telling your partner", "You break their part.", "Talk before changing"), ("Not saving versions", "You cannot go back.", "Save often"), ("Skipping the reflection at the end", "The next project repeats the same mistakes.", "Write 3 sentences every time")],
      ["Developing a program in small pieces and testing each one helps find errors.", "Feedback and reflection are part of an iterative development process.", "Programs should be documented and credit given to collaborators."],
      [Q("What is a reflection?", ["Thinking back on what worked and what to change", "A kind of loop", "A comment", "A bug"], 0, "It is looking back to improve."),
       Q("Why test each small piece?", ["Bugs are easier to find", "It is slower", "It is required", "To skip planning"], 0, "Small pieces are easier to fix."),
       Q("How should you treat feedback?", ["Listen and use it to improve", "Ignore it", "Argue", "Delete the program"], 0, "Feedback shows problems you cannot see."),
       Q("What keeps credit fair?", ["A log of what each partner did", "Hiding who wrote what", "Only one name", "No notes"], 0, "Record contributions.")],
      site="<b>Unit 2:</b> Paired Programming Project, Day 2", title="Creation and Reflection"),

    L("2.1.C", "Use an audit checklist to verify that your program works, is documented, and credits everyone.",
      [("audit", "a final careful check of the work"), ("checklist", "a list of things to confirm one by one"), ("verification", "testing that the program really does what it should"), ("documentation", "comments and notes that explain the program")],
      [("Why audit?", """Before you turn something in, you **audit** it: you check it against a list. An audit finds mistakes while you can still fix them, and it shows your work is honest."""),
       ("The audit checklist", """- **It runs.** Run the program from the start with no errors.
- **It does what it should.** Test normal inputs and one or two tricky ones.
- **It is documented.** Each function has a comment that says what it does.
- **It is your own work, with credit.** Anything from a teacher, a library, or a helper is named in a comment.
- **Both partners understand it.** Each of you can explain every part."""),
       ("Verify with tests", """Verification means **testing** the program on purpose. Write down what you expect, run it, and compare. Tick a box only when you could **show** it right now."""),
      ],
      [A("Verify what you expect", 'def go_up():\n    turn_left()\n    move()\n\ngo_up()',
         [(4, "go_up()", "Expected: Karel on street 2, facing North.")], cap="Write down what you expect, then run and check.", check=False)],
      [K("Test 1: normal case", 'def go_up():\n    turn_left()\n    move()\n\ngo_up()', [S0, '1|', '5|', '2| facing="North"', '3| street=2'], cap="Expected: street 2, facing North. Actual: street 2, facing North. The check passes."),
       T("Count the passed checks", 'checks = [True, True, False, True]\npassed = 0\nfor c in checks:\n    if c:\n        passed = passed + 1\nready = passed == len(checks)', ['1| checks=[True, True, False, True]', '2| passed=0', '3| c=True', '5| passed=1', '3| c=True', '5| passed=2', '3| c=False', '3| c=True', '5| passed=3', '6| ready=False'], cap="Three of four checks pass. One is not ready, so the audit says do not submit yet."),
       K("Test 2: a tricky case", 'def go_up():\n    turn_left()\n    move()\n\nmove()\ngo_up()\ngo_up()', [S0, '1|', '5| avenue=2', '6|', '2| facing="North"', '3| street=2', '7|', '2| facing="West"', '3| avenue=1'], cap="Called twice, the second go_up turns Karel West and moves it back to avenue 1. The audit caught a function that is not safe to reuse. Fix and test again."),
       T("Credit recorded", 'credit = ["starter code from teacher"]\nneeds_credit = len(credit) > 0', ['1| credit=["starter code from teacher"]', '2| needs_credit=True'], cap="Starter code was used, so a credit comment is required. Honest work names its sources.")],
      [("Skipping the audit", "Small mistakes are turned in.", "Always check before you submit"), ("Ticking a box without testing", "It may be wrong.", "Tick only what you can show"), ("Forgetting credit comments", "Plagiarism concerns.", "Name every source"), ("Only one partner understands it", "The other cannot explain it.", "Both partners explain every part"),
       ("Testing only one input", "A tricky input breaks it.", "Test a normal and a tricky case"), ("Leaving out comments", "Documentation is part of the audit.", "Comment each function"), ("Fixing a bug and not re-testing", "You may have broken something else.", "Run the whole checklist again"), ("Rushing at the last minute", "No time to fix.", "Audit early")],
      ["Documentation and credit for others' code or ideas are part of responsible programming.", "Testing and verifying a program should include different inputs.", "Both collaborators should understand and be able to explain the program."],
      [Q("What is an audit?", ["A careful final check against a list", "A kind of loop", "A bug", "A comment"], 0, "It verifies the work."),
       Q("What should you do when a check fails?", ["Fix it and run the checklist again", "Ignore it", "Delete the check", "Submit anyway"], 0, "Re-test after a fix."),
       Q("Why credit sources?", ["It is honest and required", "It slows the program", "Nobody checks", "It adds errors"], 0, "Credit is part of honest work."),
       Q("When may you tick a checklist box?", ["Only when you could show it right now", "Always", "Never", "When you feel like it"], 0, "Boxes mean verified.")],
      site="<b>Unit 2:</b> Paired Programming Project, Day 3", title="AP Audit Checklist and Verification"),
    ],
    glossary=[], seed=2)
