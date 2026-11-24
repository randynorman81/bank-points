from lesson import *
import karel1
from karel1 import karel_world

S0 = '0| avenue=1; street=1; facing="East"; balls_here=0'

UNIT = Unit(1, "Introduction to Programming", "Meet Karel the dog, then learn sequencing, functions, loops, and decisions before you ever write Python.",
    "Big Idea 3: Algorithms and Programming", "#2563EB", "#1D4ED8", "#60A5FA", "#DBEAFE", "pixels",
    ["Write Karel programs that run in sequence and trace them square by square", "Define and call functions, and break a problem into smaller ones", "Use comments and abstraction to make programs readable", "Use for loops, while loops, if, and if/else with Karel's conditions", "Find and fix bugs and explain what an algorithm is"],
    [
    L("1.1", "Learn what AP Computer Science Principles covers, how you are scored, and how an algorithm works in everyday life.",
      [("computer science", "the study of how computers work and how we use them to solve problems"), ("algorithm", "a step-by-step set of instructions that solves a problem"), ("sequencing", "doing steps in order: the order changes the result"), ("Big Ideas", "the five themes of the AP CSP course")],
      [("What this course is", """AP Computer Science Principles is about how computing works and how it changes the world. You will write programs, but you will also study data, the Internet, and the effects of technology. The course is organized into **five Big Ideas**:

1. **Creative Development**: how programs are designed, built, and tested
2. **Data**: how information is stored, found, and processed
3. **Algorithms and Programming**: how to write code that solves problems
4. **Computer Systems and Networks**: how computers and the Internet work
5. **Impact of Computing**: how computing affects people and society"""),
       ("How you are scored", """Your AP score comes from two parts. About **70 percent** is a multiple-choice exam of 70 questions. About **30 percent** is the **Create Performance Task**, a program you design and write yourself. The Python and Karel work in this course builds the skills for both."""),
       ("An algorithm is a recipe", """An **algorithm** is a step-by-step set of instructions that solves a problem. A recipe is an algorithm, and so are the directions to your school. Computers follow algorithms **exactly**, in the order given. This is called **sequencing**, and the order matters: putting the jam on after closing the sandwich would not work."""),
       ("Your first programming language: Karel", """You start with **Karel**, a dog that lives in a grid world and obeys a few simple commands. Karel teaches the big ideas of programming (sequence, functions, loops, decisions) without the typing details of a full language. Everything you learn carries over to Python in Unit 3."""),
      ],
      [A("A sandwich algorithm", 'bread = 0\nfilling = 0\nbread = bread + 1\nfilling = filling + 1\nbread = bread + 1',
         [(2, "bread + 1", "Step 1: one slice."), (3, "filling + 1", "Step 2: the filling goes on."), (4, "bread + 1", "Step 3: the top slice. The order matters.")], cap="Three steps in the right order make a sandwich: bread, filling, bread."),
       karel_world("Karel's world", 6, 4, (1, 1, "E"), balls=[(4, 1, 1)], path=[(1, 1), (2, 1), (3, 1), (4, 1)], caption="Karel starts at the bottom-left corner (avenue 1, street 1) facing East. A program is a list of commands for Karel.")],
      [T("Order matters", 'bread = 0\nfilling = 0\nbread = bread + 1\nfilling = filling + 1\nbread = bread + 1', ['1| bread=0', '2| filling=0', '3| bread=1', '4| filling=1', '5| bread=2'], cap="Bread, filling, bread: two slices around one filling."),
       T("The wrong order", 'bread = 0\nfilling = 0\nbread = bread + 2\nfilling = filling + 1', ['1| bread=0', '2| filling=0', '3| bread=2', '4| filling=1'], cap="Both slices are used before the filling, so the filling is not between them. Same steps, wrong order, wrong result."),
       T("How your score is built", 'exam = 70\ncreate = 30\ntotal = exam + create', ['1| exam=70', '2| create=30', '3| total=100'], cap="The exam is about 70 percent and the Create Task about 30 percent, for 100 percent in all."),
       K("A first look at Karel", 'move()\nmove()\nturn_left()\nmove()', [S0, '1| avenue=2', '2| avenue=3', '3| facing="North"', '4| street=2'], cap="Karel moves East twice, turns left to face North, and moves one street up. Each line changes Karel by one small step.")],
      [("Thinking a computer understands what you mean", "It follows the exact steps, nothing more.", "Write every step"), ("Putting the steps in the wrong order", "A different order gives a different result.", "Trace the steps in order"), ("Skipping a step because it is obvious", "The computer has no common sense.", "Spell it out"), ("Thinking the course is only coding", "Four of the five Big Ideas are not coding.", "Learn all five"),
       ("Thinking the Create Task is optional", "It is about 30 percent of the score.", "Start early"), ("Memorizing without tracing", "The exam asks you to follow code.", "Practice tracing"), ("Treating Karel as a toy", "The ideas are the same as in Python.", "Learn the ideas"), ("Ignoring vocabulary", "The exam uses exact terms.", "Learn each word")],
      ["The exam has 70 multiple-choice questions, and the Create Task is about 30 percent of the score.", "The five Big Ideas are the topics the exam is organized around.", "An algorithm is a finite set of instructions that accomplishes a task. Sequencing means the order of the steps matters."],
      [Q("What is an algorithm?", ["A step-by-step set of instructions that solves a problem", "A kind of computer", "A programming error", "A picture"], 0, "An algorithm is the plan for solving a problem."),
       Q("Which is NOT one of the five Big Ideas?", ["Data", "Impact of Computing", "Computer Systems and Networks", "Typing Speed"], 3, "The five are Creative Development, Data, Algorithms and Programming, Computer Systems and Networks, and Impact of Computing."),
       Q("What does sequencing mean?", ["Steps run in order, and order matters", "Steps run at random", "Steps run twice", "Steps are skipped"], 0, "Sequencing is doing steps in order."),
       Q("About what part of the AP score is the Create Task?", ["10 percent", "30 percent", "50 percent", "70 percent"], 1, "It is about 30 percent.")],
      site="<b>CodeHS:</b> 1.1 Welcome to APCSP (video) · APCSP pretest", title="Welcome to AP CSP"),

    L("1.2", "Write your first Karel programs with `move()`, `turn_left()`, `put_ball()`, and `take_ball()`.",
      [("Karel", "a dog that follows your commands in a grid world"), ("command", "one instruction, like `move()`"), ("program", "a list of commands that run in order"), ("avenue / street", "the columns (left to right) and rows (bottom to top) of Karel's world")],
      [("Karel and the grid", """Karel lives on a grid. The columns are **avenues** (numbered left to right) and the rows are **streets** (numbered bottom to top). Karel starts at the bottom-left corner, facing East, and can carry tennis balls."""),
       ("Karel's four commands", """| Command | What Karel does |
|---|---|
| `move()` | steps forward one square |
| `turn_left()` | turns 90 degrees to the left without moving |
| `put_ball()` | puts one tennis ball on the current square |
| `take_ball()` | picks up one tennis ball from the current square |"""),
       ("Writing a program", """A program is a list of commands, **one per line**, in order. Karel does the first line, then the second, and so on. Commands are written in lowercase, with round brackets at the end. If you misspell a command or leave out the brackets, Karel does not understand and you get an error."""),
       ("When Karel cannot do it", """Karel cannot walk through a wall, and cannot pick up a ball that is not there. Either one causes an **error** and the program stops. Your first assignments are Our First Karel Program, Your First Karel Program, Short Stack, and Dancing Karel."""),
      ],
      [A("A first program", 'move()\nmove()\nput_ball()\nmove()\ntake_ball()',
         [(0, "move()", "One step forward."), (2, "put_ball()", "Drops a ball here."), (4, "take_ball()", "Picks up a ball. It must be there.")], cap="Commands run in order, top to bottom."),
       karel_world("Karel puts a ball down after two steps", 6, 3, (3, 1, "E"), balls=[(3, 1, 1)], path=[(1, 1), (2, 1), (3, 1)], caption="After move, move, put_ball, Karel is on avenue 3 and there is a ball on that square.")],
      [K("Move and put a ball", 'move()\nmove()\nput_ball()', [S0, '1| avenue=2', '2| avenue=3', '3| balls_here=1'], cap="Two moves East take Karel to avenue 3. put_ball leaves one ball on that square."),
       K("Put and take", 'put_ball()\nmove()\nput_ball()\nput_ball()\ntake_ball()', [S0, '1| balls_here=1', '2| avenue=2; balls_here=0', '3| balls_here=1', '4| balls_here=2', '5| balls_here=1'], cap="Karel can put several balls on one square. take_ball removes one at a time."),
       K("Dancing Karel", 'turn_left()\nturn_left()\nmove()', [S0, '1| facing="North"', '2| facing="West"'], out="RuntimeError: Karel hit a wall", cap="Karel turns left twice and now faces West, at the left edge of the world. move() has nowhere to go, so Karel hits a wall and the program stops."),
       K("A short stack", 'put_ball()\nturn_left()\nmove()\nput_ball()\nmove()\nput_ball()', [S0, '1| balls_here=1', '2| facing="North"', '3| street=2; balls_here=0', '4| balls_here=1', '5| street=3', '6| balls_here=1'], cap="Karel builds a stack of balls up a column: one on street 1, one on street 2, one on street 3.")],
      [("`Move()` or `move` with no brackets", "Karel does not understand: error.", "`move()` in lowercase with brackets"), ("Two commands on one line", "Each command goes on its own line.", "One command per line"), ("`move()` at a wall", "Karel hits the wall and the program stops.", "Turn first or check the world"), ("`take_ball()` on an empty square", "There is nothing to take: error.", "Make sure a ball is there"),
       ("Forgetting where Karel faces", "Karel starts facing East.", "Trace the direction each line"), ("Expecting `turn_left()` to move Karel", "It only turns.", "Add a `move()`"), ("Thinking Karel remembers old commands", "Karel only does what is written.", "Write every step"), ("Counting streets from the top", "Streets count from the bottom.", "Street 1 is the bottom row")],
      ["A program is a sequence of commands, and the order matters.", "Be able to trace where Karel is and which way it faces after each command.", "An error happens when a command cannot be carried out."],
      [Q("Karel starts at avenue 1 facing East. After `move()` `move()`, which avenue is Karel on?", ["1", "2", "3", "4"], 2, "Each move goes one avenue East."),
       Q("Which command picks up a tennis ball?", ["`put_ball()`", "`take_ball()`", "`move()`", "`turn_left()`"], 1, "take_ball picks it up."),
       Q("What happens if Karel calls `take_ball()` on an empty square?", ["Nothing", "An error", "Karel moves", "Karel turns"], 1, "There is no ball to take."),
       Q("Which way does Karel face after one `turn_left()` from East?", ["East", "North", "West", "South"], 1, "Turning left from East faces North.")],
      site="<b>CodeHS:</b> 1.2.3 Our First Karel Program · 1.2.4 Your First Karel Program · 1.2.5 Short Stack · 1.2.6 Dancing Karel", title="Intro to Programming with Karel"),

    L("1.3", "Track Karel's direction using the compass points and build shapes like towers, squares, and pyramids.",
      [("orientation", "the direction Karel is facing"), ("cardinal directions", "North, East, South, and West"), ("counterclockwise", "turning left: East to North to West to South"), ("pre/post position", "where Karel is before and after a program")],
      [("Karel's orientation", """Karel always **faces** one of the four **cardinal directions**: North (up), East (right), South (down), or West (left). Karel starts facing East. `move()` always goes in the direction Karel is facing, which is why tracking the direction matters."""),
       ("Turning left", """`turn_left()` rotates Karel a quarter turn **counterclockwise**: East, then North, then West, then South, then East again. Four left turns make a full circle and put Karel back where it started."""),
       ("Building shapes", """To build a shape, think about where Karel is and which way it faces before each command. A **tower** goes up a column, so Karel faces North. A **square** of balls needs Karel to turn at each corner. A **pyramid** is rows of balls that shrink as they go up. The assignments are Tennis Ball Square, Make a Tower, Pyramid of Karel, and Go Through the Door."""),
       ("Check before and after", """A good habit is to write down where Karel **starts** and where it should **end**. If you trace the program and Karel does not end there, you have found a bug."""),
      ],
      [A("A tower of three balls", 'turn_left()\nput_ball()\nmove()\nput_ball()\nmove()\nput_ball()',
         [(0, "turn_left()", "Face North to go up."), (1, "put_ball()", "Ball on street 1."), (3, "put_ball()", "Ball on street 2.")], cap="After turning North, move and put alternate to build upward."),
       karel_world("Four balls in a row going East then North", 4, 4, (4, 2, "N"), balls=[(1, 1, 1), (2, 1, 1), (3, 1, 1), (4, 1, 1)], path=[(1, 1), (2, 1), (3, 1), (4, 1), (4, 2)], caption="Karel walks East dropping balls, then turns and heads North.")],
      [K("All four directions", 'turn_left()\nturn_left()\nturn_left()\nturn_left()', [S0, '1| facing="North"', '2| facing="West"', '3| facing="South"', '4| facing="East"'], cap="Four left turns return Karel to facing East. This is why Karel's direction repeats every four turns."),
       K("A tower", 'turn_left()\nput_ball()\nmove()\nput_ball()\nmove()\nput_ball()', [S0, '1| facing="North"', '2| balls_here=1', '3| street=2; balls_here=0', '4| balls_here=1', '5| street=3; balls_here=0', '6| balls_here=1'], cap="Karel faces North, then drops a ball, moves up, and repeats. There is one ball on each of streets 1, 2, and 3."),
       K("Two sides of a square", 'put_ball()\nmove()\nput_ball()\nturn_left()\nmove()\nput_ball()', [S0, '1| balls_here=1', '2| avenue=2; balls_here=0', '3| balls_here=1', '4| facing="North"', '5| street=2; balls_here=0', '6| balls_here=1'], cap="Karel places balls along the bottom (East), turns left at the corner, and continues up (North)."),
       K("Where does Karel end up?", 'move()\nturn_left()\nmove()\nmove()\nturn_left()\nmove()', [S0, '1| avenue=2', '2| facing="North"', '3| street=2', '4| street=3', '5| facing="West"', '6| avenue=1'], cap="East one, then North two, then West one: Karel ends on avenue 1, street 3, facing West.")],
      [("Forgetting which way Karel faces", "move() goes the wrong way.", "Trace the direction every line"), ("Thinking `turn_left()` turns right", "It is always counterclockwise.", "East, North, West, South"), ("Counting only three left turns for a full circle", "It takes four.", "4 turns = back to the start"), ("Building a tower while facing East", "Karel builds a row instead.", "Turn North first"),
       ("Putting the ball after the last move twice", "One too many balls.", "Count the balls you need"), ("Ignoring the starting position", "Karel may not start at the corner.", "Read the world"), ("Not checking the end position", "A shape may be fine but Karel ends in the wrong place.", "Check where Karel should end"), ("Mixing up streets and avenues", "Avenues go across, streets go up.", "Avenue = column, street = row")],
      ["Karel's direction changes only with turns. Trace it line by line.", "Know which way Karel faces after a series of turns.", "Programs that build shapes depend on position and direction together."],
      [Q("Karel faces East and calls `turn_left()` three times. Which way does it face?", ["North", "West", "South", "East"], 2, "East, North, West, then South."),
       Q("Which turn sequence makes Karel face West from East?", ["One left turn", "Two left turns", "Three left turns", "Zero"], 1, "East to North to West."),
       Q("To build a tower going up, Karel must face...", ["East", "North", "South", "West"], 1, "North is up."),
       Q("How many left turns put Karel back in its starting direction?", ["1", "2", "3", "4"], 3, "Four quarter turns make a full circle.")],
      site="<b>CodeHS:</b> Karel Orientation and Movement · 1.3.3 Tennis Ball Square · 1.3.4 Make a Tower · 1.3.5 Pyramid of Karel · 1.3.6 Go Through the Door", title="More Basic Karel"),

    L("1.4", "Teach Karel a command it does not know, like `turn_right()`, by writing your own function.",
      [("function", "a named group of commands you write yourself"), ("`def`", "the word that starts a function definition"), ("define", "write the function (this does not run it)"), ("indent", "move lines in with spaces or a tab to show they belong to the function")],
      [("Karel cannot turn right", """Karel only knows `turn_left()`. To turn right, you can turn left **three times**. If you need to turn right often, writing three lines each time is tiring and easy to get wrong. A **function** lets you teach Karel a **new command** once.

```
def turn_right():
    turn_left()
    turn_left()
    turn_left()
```"""),
       ("How to write a function", """A function has four parts: the word `def`, a **name**, round brackets, and a **colon**. The commands that belong to it come on the next lines and are **indented**. Use a clear name that says what it does."""),
       ("Using your new command", """After you define `turn_right`, you use it like any other command: `turn_right()`. Python (and Karel) runs the three lines inside it. The assignments here are Tower and Turn Right, Fireman Karel, Slide Karel, and a reflection on teaching Karel new commands."""),
      ],
      [A("Teaching Karel to turn right", 'def turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\n\nmove()\nturn_right()\nmove()',
         [(0, "def turn_right():", "DEFINE: names the new command."), (1, "turn_left()", "Indented: part of turn_right."), (6, "turn_right()", "Now Karel knows it.")], cap="Define it once, then use it like a built-in command.")],
      [K("turn_right makes three turns", 'def turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\n\nturn_right()', [S0, '1|', '6|', '2| facing="North"', '3| facing="West"', '4| facing="South"', '6|'], cap="Calling turn_right runs the three turns inside it. Karel goes from East to North to West to South, which is a right turn from East."),
       K("Move, turn right, move", 'def turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\n\nmove()\nturn_right()\nmove()', [S0, '1|', '6| avenue=2', '7|', '2| facing="North"', '3| facing="West"', '4| facing="South"', '8| street=1'], out="RuntimeError: Karel hit a wall", cap="Karel moves East, turns right to face South, and tries to move. Street 1 is the bottom row, so Karel hits the wall. Always check where a turn will point Karel."),
       K("A tower and a turn", 'def turn_right():\n    turn_left()\n    turn_left()\n    turn_left()\n\nturn_left()\nmove()\nmove()\nturn_right()\nmove()', [S0, '1|', '6| facing="North"', '7| street=2', '8| street=3', '9|', '2| facing="West"', '3| facing="South"', '4| facing="East"', '10| avenue=2'], cap="Karel goes up two streets facing North, then turns right to face East and moves one avenue."),
       ],
      [("Defining a function but not calling it", "Nothing happens.", "Write `turn_right()` where you need it"), ("Forgetting the colon after `def turn_right()`", "SyntaxError.", "`def turn_right():`"), ("Not indenting the body", "IndentationError.", "Indent each line of the function"), ("Only two `turn_left()` lines", "That is a U-turn, not a right turn.", "Three left turns = one right turn"),
       ("Calling it before defining it", "Karel does not know it yet.", "Define above the call"), ("Misspelling the name when you call it", "Karel does not know the new name.", "Use exactly the same name"), ("Forgetting the brackets in the call", "`turn_right` alone does nothing.", "`turn_right()`"), ("A function name with spaces", "SyntaxError.", "Use an underscore")],
      ["A function (the exam calls it a procedure) is a named group of commands that you can use whenever you want.", "Defining a function does not run it. Calling it does.", "Functions let you reuse code and make programs shorter."],
      [Q("How many `turn_left()` commands make a right turn?", ["1", "2", "3", "4"], 2, "Three left turns equal one right turn."),
       Q("What word starts a function definition?", ["`function`", "`def`", "`make`", "`new`"], 1, "Functions start with `def`."),
       Q("What does defining `turn_right` do by itself?", ["Turns Karel right", "Teaches Karel the command without running it", "Moves Karel", "Ends the program"], 1, "It only defines the command."),
       Q("Why use a function?", ["To write the same steps once and reuse them", "To make Karel faster", "It is required", "To add walls"], 0, "It saves repeating the code.")],
      site="<b>CodeHS:</b> Introducing Functions · 1.4.3 Tower and Turn Right · 1.4.4 Fireman Karel · 1.4.5 Slide Karel · 1.4.6 Reflection: Teaching Karel New Commands", title="Karel Can't Turn Right"),

    L("1.5", "Tell defining a function from calling it, and use functions that call other functions.",
      [("define", "write the function with `def`; it does not run"), ("call", "run the function by writing its name with brackets"), ("main program", "the commands outside any function; they run in order"), ("order of definition", "a function must be defined before it is called")],
      [("Defining versus calling", """**Defining** a function is writing it with `def`. It is like writing down a recipe: nothing is cooked yet. **Calling** a function is using it, which runs its commands. You can define a function once and call it many times.

```
def turn_around():
    turn_left()
    turn_left()

turn_around()
```"""),
       ("The jump", """When Python reaches a call, it **jumps** into the function, runs its commands from top to bottom, and then **jumps back** to the line after the call. Tracing a program with functions means following these jumps."""),
       ("Functions that call functions", """A function can call another function. If `turn_around` already exists, a new function `backflip` can use it. This builds bigger commands from smaller ones. The assignments are Turn Around, Pancakes, Backflip, Digging Karel, and Build a Shelter (debug)."""),
       ("Define before you call", """Python reads the program from the top. If you call a function **before** it has been defined, Karel does not know it yet and you get an error. Put your function definitions at the top."""),
      ],
      [A("Define, then call twice", 'def turn_around():\n    turn_left()\n    turn_left()\n\nmove()\nturn_around()\nmove()',
         [(0, "def turn_around():", "DEFINE: nothing runs yet."), (5, "turn_around()", "CALL: jumps in and runs two turns."), (6, "move()", "Runs after the function returns.")], cap="The program jumps into the function and back."),
       A("A function that calls a function", 'def turn_around():\n    turn_left()\n    turn_left()\n\ndef go_back():\n    turn_around()\n    move()',
         [(5, "turn_around()", "go_back uses turn_around."), (4, "def go_back():", "Bigger command, built from smaller ones.")], cap="Small functions build bigger ones.", check=False)],
      [K("Follow the jumps", 'def turn_around():\n    turn_left()\n    turn_left()\n\nmove()\nturn_around()\nmove()', [S0, '1|', '5| avenue=2', '6|', '2| facing="North"', '3| facing="West"', '7| avenue=1'], cap="After the first move Karel is on avenue 2. turn_around jumps in, turns left twice (West), and jumps back. The last move goes West to avenue 1."),
       K("A function that calls a function", 'def turn_around():\n    turn_left()\n    turn_left()\n\ndef go_back():\n    turn_around()\n    move()\n\nmove()\ngo_back()', [S0, '1|', '5|', '9| avenue=2', '10|', '6|', '2| facing="North"', '3| facing="West"', '7| avenue=1'], cap="go_back calls turn_around (two turns) and then moves. Karel ends on avenue 1 facing West."),
       K("A called twice function", 'def step_up():\n    turn_left()\n    move()\n    turn_left()\n    turn_left()\n    turn_left()\n\nstep_up()\nstep_up()', [S0, '1|', '8|', '2| facing="North"', '3| street=2', '4| facing="West"', '5| facing="South"', '6| facing="East"', '9|', '2| facing="North"', '3| street=3', '4| facing="West"', '5| facing="South"', '6| facing="East"'], cap="Each call climbs one street and turns Karel back to face East, so calling it twice climbs two streets."),
       K("Forgot to call", 'def move_twice():\n    move()\n    move()\n\nmove()', [S0, '1|', '5| avenue=2'], cap="move_twice is defined but never called, so only the single move() runs. Karel ends on avenue 2 instead of 3.")],
      [("Defining a function and never calling it", "Nothing in it runs.", "Call it"), ("Calling it before defining it", "Karel does not know it yet.", "Define first"), ("Different names in the def and the call", "`turn_around` vs `turnaround` are different.", "Use the same name"), ("Putting the call inside the function", "It calls itself forever.", "Call from outside"),
       ("Putting commands that should run once inside the function", "They repeat with every call.", "Keep each function to one job"), ("Forgetting the indent", "The lines are not part of the function.", "Indent the body"), ("Expecting Karel to move during the def", "Defining does not run the code.", "Defining is only writing"), ("Calling a function with an extra `()` missing", "Without brackets nothing runs.", "`turn_around()`")],
      ["A procedure is defined once and called whenever it is needed.", "When a procedure is called, the program jumps into it and then returns to the next line.", "Procedures can call other procedures."],
      [Q("What happens when Karel reaches a function call?", ["It skips it", "It runs the function, then continues after the call", "It ends the program", "It runs it twice"], 1, "The program jumps in and back."),
       Q("If you define `turn_around()` but never call it, what happens?", ["Karel turns around once", "Nothing from it runs", "An error", "Karel turns twice"], 1, "Defining does not run."),
       Q("Where should function definitions go?", ["Above the calls", "After the calls", "Anywhere", "Nowhere"], 0, "Python reads top to bottom."),
       Q("A function that uses another function is...", ["Impossible", "Allowed and common", "An error", "Slow"], 1, "Functions can call functions.")],
      site="<b>CodeHS:</b> Defining vs. Calling Functions · 1.5.3 Turn Around · 1.5.4 Pancakes · 1.5.5 Backflip · 1.5.6 Digging Karel · 1.5.7 Build a Shelter (debug)", title="Functions in Karel"),

    L("1.6", "Solve a big problem by splitting it into smaller functions: top-down design and decomposition.",
      [("decomposition", "breaking a big problem into smaller parts"), ("top-down design", "start with the big goal, then split it into smaller steps until each is easy"), ("helper function", "a small function that does one job for a bigger one"), ("main program", "the short list of function calls that tells the whole story")],
      [("Start with the big picture", """**Top-down design** means you begin with the **big goal** and break it into smaller steps, then break those steps into even smaller ones, until each step is something Karel already knows. Splitting a problem into parts is called **decomposition**."""),
       ("Example: Hurdle Karel", """Karel must run along a row and jump over hurdles. The big goal is "go to the end". Split it: *move, jump a hurdle, move, jump a hurdle, move*. Now split "jump a hurdle" into the small Karel steps: *turn left, move, turn right, move, turn right, move, turn left*."""),
       ("Write a function for each part", """Each smaller part becomes a **function** with a clear name. The main program then reads like a plan: `move()`, `jump_hurdle()`, `move()`. If something is wrong, you only have to fix one small function. The assignments are Hurdle Karel, The Two Towers, and Make a Z."""),
       ("Test the pieces", """Test each small function by itself first. A program built from tested pieces is much easier to fix than one long list of commands."""),
      ],
      [A("A hurdle function", 'def jump_hurdle():\n    turn_left()\n    move()\n    turn_right()\n    move()\n    turn_right()\n    move()\n    turn_left()',
         [(0, "def jump_hurdle():", "One job: get over one hurdle."), (1, "turn_left()", "Face up."), (3, "turn_right()", "Face across."), (5, "turn_right()", "Face down."), (7, "turn_left()", "Face forward again.")], cap="The details are hidden inside the function.", check=False),
       A("The main program reads like a plan", 'move()\njump_hurdle()\nmove()\njump_hurdle()\nmove()',
         [(1, "jump_hurdle()", "A big step with a clear name.")], cap="The big picture first. The details live in the functions.", check=False)],
      [K("Jump one hurdle", 'def jump_hurdle():\n    turn_left()\n    move()\n    turn_right()\n    move()\n    turn_right()\n    move()\n    turn_left()\n\njump_hurdle()', [S0, '1|', '10|', '2| facing="North"', '3| street=2', '4| facing="East"', '5| avenue=2', '6| facing="South"', '7| street=1', '8| facing="East"', '10|'], cap="Karel climbs over: up, across, and down. It ends one avenue ahead on street 1, facing East again. (turn_right is the function you wrote in Lesson 1.4.)"),
       K("Run with two hurdles", 'def jump_hurdle():\n    turn_left()\n    move()\n    turn_right()\n    move()\n    turn_right()\n    move()\n    turn_left()\n\nmove()\njump_hurdle()\nmove()\njump_hurdle()', [S0, '1|', '10| avenue=2', '11|', '2| facing="North"', '3| street=2', '4| facing="East"', '5| avenue=3', '6| facing="South"', '7| street=1', '8| facing="East"', '12| avenue=4', '13|', '2| facing="North"', '3| street=2', '4| facing="East"', '5| avenue=5', '6| facing="South"', '7| street=1', '8| facing="East"'], size=(8, 8), cap="Karel moves, jumps, moves, and jumps. It ends on avenue 5, street 1, facing East."),
       K("A tower function", 'def build_tower():\n    turn_left()\n    put_ball()\n    move()\n    put_ball()\n    move()\n    put_ball()\n\nbuild_tower()', [S0, '1|', '9|', '2| facing="North"', '3| balls_here=1', '4| street=2; balls_here=0', '5| balls_here=1', '6| street=3; balls_here=0', '7| balls_here=1'], cap="build_tower is called once. Karel ends at the top of a three-ball tower facing North.")],
      [("Writing one long list of commands", "Hard to read and to fix.", "Split it into functions"), ("A function that does too many jobs", "It is hard to reuse and test.", "One job per function"), ("Vague names like `do_it()`", "Nobody knows what it does.", "Name it for its job: `jump_hurdle()`"), ("Not testing the small parts", "Bugs hide in a big program.", "Test each function alone"),
       ("Forgetting where Karel ends", "The next function starts in the wrong spot.", "Write where Karel starts and ends"), ("Splitting up too early without a plan", "Pieces do not fit.", "Start from the big goal"), ("Copying the same steps instead of a function", "Fixing one copy misses the others.", "Make a function"), ("Calling a function before its definition", "Not known yet.", "Define first")],
      ["Decomposition makes a big problem manageable by breaking it into smaller problems.", "Procedures (functions) let you reuse code and hide details.", "A well-named procedure makes a program easier to read."],
      [Q("What is top-down design?", ["Start with the big goal and split it into smaller steps", "Write the smallest steps first with no plan", "Write comments only", "Test first"], 0, "Top-down starts with the big picture."),
       Q("Why test each function by itself?", ["It makes bugs easier to find", "It is required", "It is faster to write", "It removes comments"], 0, "Small tested pieces make a reliable program."),
       Q("Which is a good function name?", ["`do_it`", "`jump_hurdle`", "`x`", "`f1`"], 1, "A clear name tells the reader what it does."),
       Q("What is decomposition?", ["Breaking a problem into smaller parts", "Deleting code", "Adding comments", "Running the program twice"], 0, "It means splitting the problem up.")],
      site="<b>CodeHS:</b> 1.6.3 Hurdle Karel · 1.6.4 The Two Towers · 1.6.5 Make a \"Z\" · 1.6.6 Reflection: Top Down Design", title="Top Down Design and Decomposition"),

    L("1.7", "Write comments that explain what a program and each function do.",
      [("comment", "a note for people that Python and Karel ignore"), ("`#`", "the symbol that starts a comment"), ("precondition", "what must be true BEFORE a function runs"), ("postcondition", "what is true AFTER it runs")],
      [("What a comment is", """A **comment** starts with `#`. The computer ignores everything after it on that line. Comments are notes for **people**: you, your teammates, and your teacher. Good comments explain **why** the code does something, not just what it says."""),
       ("Comment each function", """Write a comment at the top of every function that says what it does. Many programmers also write what must be true **before** the function runs (the **precondition**) and what is true **after** (the **postcondition**). For `jump_hurdle` that might be: *before: Karel faces East next to a hurdle. After: Karel is past the hurdle, facing East.*"""),
       ("Comments do not run", """Because comments are ignored, they never change what Karel does. When you trace a program, skip the comment lines. You can also **comment out** a line, adding `#` in front, to turn it off while you test."""),
       ("Do not over-comment", """A comment that repeats the code (`move()  # moves`) adds nothing. Explain the **idea**: why this step, what the function is for. The assignment here is The Two Towers with comments, plus a reflection on commenting."""),
      ],
      [A("A commented function", '# Jumps one hurdle.\n# Before: Karel faces East.\n# After: Karel faces East, past it.\ndef jump():\n    turn_left()\n    move()',
         [(0, "# Jumps one hurdle.", "What the function does."), (1, "# Before:", "The precondition."), (2, "# After:", "The postcondition.")], cap="Comments describe the function without changing it.", check=False),
       A("Commenting out a line", 'move()\n# turn_left()\nmove()',
         [(1, "# turn_left()", "Turned off: Karel skips it.")], cap="A # in front of a line turns it into a comment, so it does not run.", check=False)],
      [K("Comments are skipped", '# start of the program\nmove()\n# Karel is on avenue 2\nmove()', [S0, '2| avenue=2', '4| avenue=3'], cap="Lines 1 and 3 are comments, so they never run. Only lines 2 and 4 move Karel."),
       K("Commented out line", 'move()\n# turn_left()\nmove()', [S0, '1| avenue=2', '3| avenue=3'], cap="The turn is commented out, so Karel keeps going East instead of North."),
       K("Remove the # and it changes", 'move()\nturn_left()\nmove()', [S0, '1| avenue=2', '2| facing="North"', '3| street=2'], cap="With the # removed, Karel turns and goes North. This is how commenting out helps you test one change at a time."),
       K("A function with a comment", '# Goes up two streets.\ndef up_two():\n    turn_left()\n    move()\n    move()\n\nup_two()', [S0, '2|', '7|', '3| facing="North"', '4| street=2', '5| street=3'], cap="The comment explains the purpose. It is skipped when the program runs.")],
      [("Writing code but no comments", "You forget why you wrote it.", "Comment each function"), ("Comments that repeat the code", "They add no information.", "Explain why"), ("Leaving old commented-out code everywhere", "It clutters the file.", "Delete what you do not need"), ("Putting a comment before `#`", "A comment must start with #.", "Start the line with #"),
       ("A wrong comment", "Worse than none.", "Update comments when you change code"), ("Thinking comments run", "They are ignored.", "They are for people"), ("Forgetting the preconditions", "A function used in the wrong place fails.", "Say where Karel must be"), ("Too many comments on obvious lines", "Hard to read.", "Comment the important parts")],
      ["Comments are ignored when a program runs. In Python they start with `#`. On the exam, comments are written between `/*` and `*/`.", "Documentation helps other programmers (and you) understand what a program or procedure does.", "Preconditions and postconditions describe what is true before and after a procedure."],
      [Q("What symbol starts a comment in Karel (Python)?", ["`//`", "`#`", "`--`", "`;`"], 1, "A `#` starts a comment."),
       Q("What does Karel do with a comment line?", ["Runs it", "Ignores it", "Turns left", "Reports an error"], 1, "Comments are ignored."),
       Q("A precondition describes...", ["What is true before a function runs", "What is true after it runs", "A bug", "The function name"], 0, "Pre means before."),
       Q("Which comment is most useful?", ["`# move`", "`# Jumps one hurdle; Karel starts facing East`", "`# code`", "`# ok`"], 1, "It explains the purpose and the starting condition.")],
      site="<b>CodeHS:</b> 1.7.3 Hurdle Karel · 1.7.4 The Two Towers + Comments · 1.7.5 Reflection: Commenting", title="Commenting Your Code"),

    L("1.8", "Explain abstraction: using a name for a group of steps without thinking about the details inside.",
      [("abstraction", "hiding details behind a name so you can think at a higher level"), ("procedural abstraction", "using a function name for a group of commands"), ("detail", "the small steps inside a function"), ("reuse", "using the same function again and again")],
      [("What abstraction means", """**Abstraction** means hiding the details behind a **name**. You use `build_tower()` without thinking about each turn, move, and ball inside it. That frees your mind to think about the **big picture**. Cars work the same way: you press the gas pedal without thinking about the engine."""),
       ("Abstracting away build_tower", """Without abstraction, a program that builds two towers is a long list of turns, moves, and balls. With abstraction, it is two lines: `build_tower()` twice. If you improve `build_tower`, **both** towers improve."""),
       ("Abstracting your day", """You do this every day. "Get ready for school" hides brushing teeth, getting dressed, and packing a bag. A day described in a few big steps (get ready, travel, class, practice) is an abstraction of your day."""),
       ("Why it matters", """Abstraction **manages complexity**. Big programs have thousands of steps, and no one can hold them all in their head. Names let you work with a few ideas at a time. The assignments are Abstracting Away build_tower, Abstracting Your Day, and two reflections."""),
      ],
      [A("Two towers in two lines", 'def build_tower():\n    turn_left()\n    put_ball()\n    move()\n    put_ball()\n\nbuild_tower()',
         [(0, "def build_tower():", "The details live here."), (6, "build_tower()", "Use the name, not the details.")], cap="The caller does not need to know how a tower is built.", check=False)],
      [K("Using build_tower", 'def build_tower():\n    turn_left()\n    put_ball()\n    move()\n    put_ball()\n\nbuild_tower()', [S0, '1|', '7|', '2| facing="North"', '3| balls_here=1', '4| street=2; balls_here=0', '5| balls_here=1'], cap="One call hides four commands. Karel ends on street 2 with a ball under and at its feet."),
       K("Same function, a different place", 'def put_two():\n    put_ball()\n    put_ball()\n\nmove()\nput_two()\nmove()\nput_two()', [S0, '1|', '5| avenue=2', '6|', '2| balls_here=1', '3| balls_here=2', '7| avenue=3; balls_here=0', '8|', '2| balls_here=1', '3| balls_here=2'], cap="put_two is written once and used twice. Karel ends with two balls on avenue 2 and two on avenue 3."),
       K("Change the function, change every call", 'def put_two():\n    put_ball()\n    put_ball()\n    put_ball()\n\nput_two()\nmove()\nput_two()', [S0, '1|', '6|', '2| balls_here=1', '3| balls_here=2', '4| balls_here=3', '7| avenue=2; balls_here=0', '8|', '2| balls_here=1', '3| balls_here=2', '4| balls_here=3'], cap="One new put_ball inside the function makes BOTH calls put three balls. Abstraction means you change it in one place.")],
      [("Copying the same steps again and again", "A change must be made everywhere.", "Write a function"), ("A name that does not say what it does", "The abstraction is useless.", "Choose a clear name"), ("Thinking you must understand every detail to use a function", "You only need what it does.", "Trust the name and the comment"), ("Mixing up abstraction and shortening", "Abstraction hides detail, it is not only fewer lines.", "Hide what you do not need to see"),
       ("Putting unrelated steps in one function", "It is not a clean abstraction.", "One idea per function"), ("Forgetting to explain what it does", "Others cannot use it.", "Add a comment"), ("Using abstraction without testing", "A hidden bug is hard to find.", "Test the function"), ("Changing a function that others depend on without checking", "Other code may break.", "Check each call")],
      ["Procedural abstraction means using a named procedure without needing to know how it works inside.", "Abstraction manages complexity.", "Changing a procedure in one place changes it everywhere it is called."],
      [Q("What does abstraction do?", ["Hides details behind a name", "Makes code slower", "Deletes code", "Adds errors"], 0, "It hides details so you think about the big picture."),
       Q("If you change a function's code, what changes?", ["Only the first call", "Every call to it", "Nothing", "Only the next line"], 1, "All calls use the same function."),
       Q("Which is an example of abstraction in everyday life?", ["Pressing the gas pedal without knowing the engine", "Taking a test", "Typing fast", "Using a ruler"], 0, "You use the thing without the details."),
       Q("Why does abstraction help in big programs?", ["It manages complexity", "It makes them longer", "It hides errors forever", "It removes functions"], 0, "No one can keep thousands of steps in mind.")],
      site="<b>CodeHS:</b> 1.8.3 Abstracting Away build_tower · 1.8.4 Abstracting Your Day · 1.8.5 Reflection: Abstraction · 1.8.6 Reflection: Abstraction in Karel", title="Abstraction"),

    L("1.9", "Use Super Karel, which already knows `turn_right()` and `turn_around()`.",
      [("Super Karel", "Karel with the extra commands `turn_right()` and `turn_around()`"), ("built-in", "a command that already exists, so you do not define it")],
      [("Karel with more commands", """**Super Karel** is the same dog with a bigger vocabulary. It knows everything Karel does, plus **`turn_right()`** and **`turn_around()`**. You do not have to define them yourself, which makes programs shorter and easier to read."""),
       ("Why we learned the long way first", """You wrote `turn_right` yourself in Lesson 1.4 so you could see what a function really is. Super Karel simply includes that function for you. The assignments are Hurdle Karel (with Super Karel) and The Two Towers plus Super Karel."""),
       ("Same ideas, shorter code", """The jump over a hurdle shrinks from long turn lists to cleaner code. Remember: `turn_right()` is **three** left turns inside, and `turn_around()` is **two**. Tracing is the same: the direction changes by a quarter turn right, or a half turn."""),
      ],
      [A("The hurdle with Super Karel", 'def jump_hurdle():\n    turn_left()\n    move()\n    turn_right()\n    move()\n    turn_right()\n    move()\n    turn_left()',
         [(3, "turn_right()", "Built in: no def needed."), (7, "turn_left()", "Back to facing forward.")], cap="No helper function for turn_right is needed.", check=False)],
      [K("turn_right is one command", 'move()\nturn_right()\nmove()', [S0, '1| avenue=2', '2| facing="South"'], out="RuntimeError: Karel hit a wall", cap="turn_right from East faces South. Street 1 is the bottom row, so the move hits the wall."),
       K("turn_around is a U-turn", 'move()\nmove()\nturn_around()\nmove()', [S0, '1| avenue=2', '2| avenue=3', '3| facing="West"', '4| avenue=2'], cap="Karel goes East two, turns around, and comes back one square."),
       K("A short route with Super Karel", 'turn_left()\nmove()\nturn_right()\nmove()\nturn_right()\nmove()', [S0, '1| facing="North"', '2| street=2', '3| facing="East"', '4| avenue=2', '5| facing="South"', '6| street=1'], cap="Up, across, and down: a hop over a one-square obstacle.")],
      [("Defining `turn_right` when Super Karel has it", "It is not wrong but it is extra.", "Use the built-in one"), ("Using `turn_right()` in plain Karel with no definition", "Karel does not know it.", "Check which Karel you are using"), ("Thinking `turn_around()` is one left turn", "It is two.", "Half turn"), ("Mixing up `turn_right()` and `turn_left()`", "Karel goes the other way.", "Trace the direction"),
       ("Forgetting the brackets", "Nothing happens.", "`turn_right()`"), ("Using Super Karel commands in a task that needs plain Karel", "It may not be allowed.", "Read the assignment"), ("Assuming the world is bigger", "A move off the edge is an error.", "Check the size"), ("Overusing turns", "A cleaner path exists.", "Plan the route")],
      ["A procedure that already exists can be used without defining it, like `turn_right()` in Super Karel.", "Libraries and built-ins make programs easier to write.", "Know the direction after `turn_right()` and `turn_around()`."],
      [Q("What does Super Karel add?", ["`turn_right()` and `turn_around()`", "Speed", "More balls", "A bigger world"], 0, "Those two commands."),
       Q("Karel faces East and calls `turn_right()`. Which way does it face?", ["North", "South", "West", "East"], 1, "A right turn from East faces South."),
       Q("Karel faces East and calls `turn_around()`. Which way does it face?", ["North", "South", "West", "East"], 2, "A half turn from East faces West."),
       Q("Why use Super Karel?", ["Programs are shorter and clearer", "It adds errors", "It slows Karel", "It deletes functions"], 0, "Built-in commands save writing your own.")],
      site="<b>CodeHS:</b> 1.9.3 Hurdle Karel (with Super Karel) · 1.9.4 The Two Towers + Super Karel", title="Super Karel"),

    L("1.10", "Repeat commands a set number of times with a `for` loop.",
      [("loop", "code that repeats"), ("`for` loop", "repeats a block a fixed number of times"), ("`range(n)`", "makes n repeats"), ("body", "the indented lines that repeat")],
      [("Do it again and again", """Writing `move()` ten times is boring and easy to get wrong. A **for loop** repeats commands for you:

```
for i in range(10):
    move()
```
`range(10)` means **ten** repeats. The indented line is the **body**, and it runs once for each repeat."""),
       ("The parts of a for loop", """A `for` line has the word `for`, a counter name like `i`, the word `in`, `range(n)`, and a **colon**. The lines indented below it repeat. The first line that is **not** indented runs only **once**, after the loop is done."""),
       ("Loops with several commands", """The body can have more than one command. `for i in range(3): put_ball(); move()` repeats the whole pair three times. Loops work well with functions: `for i in range(3): jump_hurdle()`. The assignments are Repeated Move, Put Down Tennis Balls, Take 'Em All, Dizzy Karel, For Loop Square, and Lots of Hurdles."""),
      ],
      [A("A for loop", 'for i in range(4):\n    move()\nput_ball()',
         [(0, "range(4)", "Four repeats."), (1, "move()", "Indented: repeats four times."), (2, "put_ball()", "Not indented: runs once, at the end.")], cap="Karel moves four times, then drops one ball."),
       A("Two commands in the body", 'for i in range(3):\n    put_ball()\n    move()',
         [(1, "put_ball()", "Both lines repeat together."), (2, "move()", "Three balls on three squares.")], cap="Put and move, three times.")],
      [K("Four moves", 'for i in range(4):\n    move()\nput_ball()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4', '1|', '2| avenue=5', '3| balls_here=1'], cap="The body runs four times, so Karel ends on avenue 5. Then the unindented put_ball runs once."),
       K("A row of balls", 'for i in range(3):\n    put_ball()\n    move()', [S0, '1|', '2| balls_here=1', '3| avenue=2; balls_here=0', '1|', '2| balls_here=1', '3| avenue=3; balls_here=0', '1|', '2| balls_here=1', '3| avenue=4; balls_here=0'], cap="Each pass puts a ball and moves. Karel drops three balls on avenues 1, 2, and 3 and ends on avenue 4."),
       K("Dizzy Karel", 'for i in range(4):\n    turn_left()', [S0, '1|', '2| facing="North"', '1|', '2| facing="West"', '1|', '2| facing="South"', '1|', '2| facing="East"'], cap="Four left turns spin Karel all the way around."),
       K("A square", 'for i in range(4):\n    move()\n    turn_left()', [S0, '1|', '2| avenue=2', '3| facing="North"', '1|', '2| street=2', '3| facing="West"', '1|', '2| avenue=1', '3| facing="South"', '1|', '2| street=1', '3| facing="East"'], cap="Move and turn left, four times: Karel walks around a 1-by-1 square and ends where it started.")],
      [("`range(4)` and expecting 5 repeats", "It repeats exactly 4 times.", "Count the number you want"), ("Forgetting the colon after `range(4)`", "SyntaxError.", "`for i in range(4):`"), ("Not indenting the body", "The commands are outside the loop.", "Indent them"), ("Putting a command that should run once inside the loop", "It repeats too.", "Un-indent it"),
       ("An extra repeat that walks off the world", "Karel hits a wall.", "Count the squares"), ("Using `for` when you do not know the number", "You cannot say `range(?)`.", "Use a while loop (1.13)"), ("Thinking `i` is a Karel command", "`i` is just the counter.", "You may ignore it"), ("Mixing up the loop and a function call", "`move` without brackets does nothing.", "`move()`")],
      ["The exam's counted loop is `REPEAT n TIMES { }`. It does exactly what `for i in range(n)` does.", "Iteration repeats code, which makes programs shorter.", "Be able to count how many times a loop runs and where Karel ends."],
      [Q("How many times does `for i in range(5): move()` move Karel?", ["4", "5", "6", "1"], 1, "Five repeats."),
       Q("Which line is NOT repeated?", ["The indented lines", "The line that is not indented after the loop", "The first body line", "The second body line"], 1, "Un-indented lines run once after the loop."),
       Q("What spins Karel all the way around?", ["`for i in range(4): turn_left()`", "`for i in range(2): turn_left()`", "`move()`", "`turn_left()`"], 0, "Four quarter turns."),
       Q("Karel is at avenue 1 facing East. After `for i in range(3): move()`, which avenue?", ["2", "3", "4", "5"], 2, "Three moves East.")],
      site="<b>CodeHS:</b> 1.10.3 Repeated Move · 1.10.4 Put Down Tennis Balls · 1.10.5 Take 'Em All · 1.10.6 Dizzy Karel · 1.10.7 For Loop Square · 1.10.8 Lots of Hurdles", title="For Loops"),

    L("1.11", "Make Karel decide with an `if` statement and Karel's questions: `front_is_clear()`, `ball_present()`, and more.",
      [("condition", "a yes-or-no question Karel can ask, like `ball_present()`"), ("`if` statement", "runs its indented lines only when the condition is True"), ("True / False", "the two possible answers to a condition"), ("selection", "choosing which code runs")],
      [("Asking Karel questions", """So far Karel does exactly the same thing every time. With an **if statement**, Karel can **look at the world** and choose. The questions Karel can ask are called **conditions**, and each answers **True** or **False**:

| Condition | True when |
|---|---|
| `front_is_clear()` | there is no wall in front of Karel |
| `left_is_clear()` | there is no wall to Karel's left |
| `right_is_clear()` | there is no wall to Karel's right |
| `ball_present()` | there is a ball on Karel's square |"""),
       ("The if statement", """```
if ball_present():
    take_ball()
```
The `if` line ends with a **colon**. The indented lines run **only if the condition is True**. If it is False, Karel skips them and goes on. Asking a question costs nothing and does not move Karel."""),
       ("Why it matters", """Without `if`, `take_ball()` on an empty square is an **error**. With it, Karel only picks up a ball when one is there. This lets one program work in many different worlds, which is the idea behind real software."""),
       ("`not`", """You can flip a question with `not`: `if not front_is_clear():` means *if there is a wall in front*."""),
      ],
      [A("Take a ball only if there is one", 'if ball_present():\n    take_ball()\nmove()',
         [(0, "ball_present()", "The question: is a ball here?"), (1, "take_ball()", "Indented: only runs if True."), (2, "move()", "Not indented: always runs.")], cap="Karel looks first, then acts.", check=False),
       A("Move only if the way is clear", 'if front_is_clear():\n    move()',
         [(0, "front_is_clear()", "No wall ahead?"), (1, "move()", "Only then does Karel move.")], cap="This avoids the hit-a-wall error.", check=False)],
      [K("A ball is there (True)", 'if ball_present():\n    take_ball()\nmove()', [S0, '1|', '2| balls_here=0', '3| avenue=2'], balls={(1, 1): 1}, cap="The condition is True, so Karel takes the ball. Then move() runs."),
       K("No ball (False)", 'if ball_present():\n    take_ball()\nmove()', [S0, '1|', '3| avenue=2'], cap="There is no ball, so the condition is False. Karel skips line 2 (no error!) and moves."),
       K("A wall in front", 'move()\nif front_is_clear():\n    move()\nput_ball()', [S0, '1| avenue=2', '2|', '4| balls_here=1'], size=(2, 8), cap="The world is only 2 avenues wide. After one move Karel is at the wall, so front_is_clear() is False and the second move is skipped. The ball goes on avenue 2."),
       K("The same program, no wall", 'move()\nif front_is_clear():\n    move()\nput_ball()', [S0, '1| avenue=2', '2|', '3| avenue=3', '4| balls_here=1'], size=(5, 8), cap="In a wider world the way is clear, so Karel moves again. The same program behaves differently in a different world.")],
      [("`take_ball()` without checking", "Error if there is no ball.", "Wrap it in `if ball_present():`"), ("No colon after the `if` line", "SyntaxError.", "End with a colon"), ("Not indenting the body", "The commands are outside the if.", "Indent them"), ("`if ball_present:` with no brackets", "It never asks the question.", "`ball_present()`"),
       ("`if ball_present() = True:`", "Not needed, and `=` is not a comparison.", "`if ball_present():`"), ("Thinking the condition moves Karel", "Asking does not change Karel.", "Questions are free"), ("Expecting the if to repeat", "It checks once.", "Use a loop for repeating"), ("Forgetting the False case", "Nothing happens when False.", "Use else (1.12)")],
      ["Selection chooses which code runs, using a condition that is true or false.", "The exam writes `IF(condition) { }`. A condition evaluates to true or false.", "Trace which branch Karel takes in a given world."],
      [Q("What does `if ball_present():` ask?", ["Is a ball on Karel's square?", "Is there a wall?", "Is Karel facing North?", "How many balls are there?"], 0, "It checks the current square."),
       Q("When does the indented code of an `if` run?", ["Always", "Only when the condition is True", "Only when False", "Never"], 1, "It runs when True."),
       Q("What happens with `if ball_present(): take_ball()` on an empty square?", ["An error", "Nothing", "Karel moves", "Karel turns"], 1, "The condition is False, so the body is skipped."),
       Q("Which condition is True when there is no wall in front?", ["`front_is_clear()`", "`ball_present()`", "`left_is_clear()`", "`turn_left()`"], 0, "front_is_clear.")],
      site="<b>CodeHS:</b> If statements (Karel conditions)", title="If Statements"),

    L("1.12", "Choose between two paths with `if` and `else`.",
      [("`else`", "runs when the `if` condition is False"), ("two-way decision", "exactly one of two bodies runs"), ("branch", "one of the paths the program might take")],
      [("Two ways to go", """An `else` adds a **second path**. If the `if` condition is True, Karel does the first body. If it is False, Karel does the `else` body. **Exactly one** of the two runs, never both and never neither.

```
if ball_present():
    take_ball()
else:
    put_ball()
```
This program makes sure the square ends up the opposite of how it started."""),
       ("Writing it", """The `else` line is lined up with its `if` and also ends in a **colon**. It has **no condition** of its own: it simply means *otherwise*."""),
       ("Decisions inside functions and loops", """`if/else` works in functions and loops too. A loop can ask a question on **every** square: if there is a ball, take it, otherwise put one down."""),
      ],
      [A("If and else", 'if ball_present():\n    take_ball()\nelse:\n    put_ball()',
         [(0, "ball_present()", "The question."), (2, "else:", "Otherwise: no condition here."), (3, "put_ball()", "Runs only when there was no ball.")], cap="One path runs each time.", check=False)],
      [K("A ball is there", 'if ball_present():\n    take_ball()\nelse:\n    put_ball()', [S0, '1|', '2| balls_here=0'], balls={(1, 1): 1}, cap="True, so Karel takes the ball. The else part is skipped."),
       K("No ball", 'if ball_present():\n    take_ball()\nelse:\n    put_ball()', [S0, '1|', '4| balls_here=1'], cap="False, so Karel skips line 2 and runs the else part: it puts a ball down."),
       K("Flip every square in a row", 'for i in range(3):\n    if ball_present():\n        take_ball()\n    else:\n        put_ball()\n    move()', [S0, '1|', '2|', '3| balls_here=0', '6| avenue=2', '1|', '2|', '5| balls_here=1', '6| avenue=3', '1|', '2|', '3| balls_here=0', '6| avenue=4'], balls={(1, 1): 1, (3, 1): 1}, cap="Avenue 1 had a ball (taken). Avenue 2 had none (one placed). Avenue 3 had a ball (taken). Karel ends on avenue 4."),
       K("Decide at a wall", 'move()\nif front_is_clear():\n    move()\nelse:\n    put_ball()', [S0, '1| avenue=2', '2|', '5| balls_here=1'], size=(2, 8), cap="At the wall the condition is False, so the else puts a ball down instead of moving.")],
      [("`else` with a condition", "`else` takes no condition.", "Use `elif` in Python if you need another test"), ("No colon after `else`", "SyntaxError.", "`else:`"), ("`else` not lined up with `if`", "It does not belong to it.", "Line them up"), ("Writing two ifs and expecting one choice", "Both can run.", "Use if / else"),
       ("`else` with no `if` above", "SyntaxError.", "Start with an if"), ("Putting a command that must always run inside one branch", "It sometimes skips.", "Put it outside"), ("Thinking both branches run", "Exactly one runs.", "Trace the condition"), ("Forgetting that the condition is checked each pass in a loop", "Different squares give different results.", "Trace every pass")],
      ["The exam's `IF(condition) { } ELSE { }` runs exactly one of its two blocks.", "Trace which branch runs for given conditions.", "Selection lets one program handle different situations."],
      [Q("When does the `else` part run?", ["When the if condition is False", "When it is True", "Always", "Never"], 0, "else is the other path."),
       Q("How many bodies of an if/else run?", ["Exactly one", "Both", "None", "Two always"], 0, "One of the two."),
       Q("If Karel is on an empty square, what does `if ball_present(): take_ball() else: put_ball()` do?", ["Takes a ball", "Puts a ball", "Errors", "Moves"], 1, "False, so the else runs."),
       Q("Does `else` have a condition?", ["Yes, always", "No", "Sometimes", "Only in loops"], 1, "else is just otherwise.")],
      site="<b>CodeHS:</b> If/Else statements (Karel conditions)", title="If / Else Statements"),

    L("1.13", "Repeat while a condition is True with a `while` loop: go until Karel reaches a wall.",
      [("`while` loop", "repeats as long as its condition is True"), ("infinite loop", "a loop whose condition never becomes False"), ("loop condition", "the question asked before every pass"), ("unknown distance", "when you do not know how many repeats you need")],
      [("When you do not know how many", """A `for` loop is great when you know the number of repeats. But what if Karel has to walk to the wall and you do not know how far it is? A **while loop** repeats **as long as** a condition is True:

```
while front_is_clear():
    move()
```
Karel keeps moving **while** the way ahead is clear. When Karel reaches the wall, the condition is False and the loop ends."""),
       ("How a while loop works", """Karel asks the question **before every pass**. If the answer is True, the body runs and Karel asks again. If it is False, the loop stops and Karel goes to the next unindented line. If the condition is False the very first time, the body runs **zero** times."""),
       ("Infinite loops", """If nothing in the body can ever make the condition False, the loop never ends. This is an **infinite loop**. `while front_is_clear(): turn_left()` never ends, because Karel spins in place and the way ahead stays clear. Make sure the body moves Karel toward the end."""),
       ("Combining a while with other commands", """You can put more than one command in the body, or an `if`. A common job: *walk to the wall and drop a ball on every square*."""),
      ],
      [A("Walk to the wall", 'while front_is_clear():\n    move()',
         [(0, "front_is_clear()", "Asked before every pass."), (1, "move()", "Repeats until the wall.")], cap="The distance does not matter: the same program works in any world.", check=False),
       A("An infinite loop (do not run)", 'while front_is_clear():\n    turn_left()',
         [(1, "turn_left()", "Karel only turns in place, so the way is always clear.")], cap="Nothing in the body changes the condition.", check=False)],
      [K("Walk to the wall", 'while front_is_clear():\n    move()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4', '1|', '2| avenue=5', '1|'], size=(5, 8), cap="The world is 5 avenues wide. Karel moves four times. On avenue 5 the front is blocked, so the loop ends."),
       K("Drop a ball on every square", 'while front_is_clear():\n    put_ball()\n    move()\nput_ball()', [S0, '1|', '2| balls_here=1', '3| avenue=2; balls_here=0', '1|', '2| balls_here=1', '3| avenue=3; balls_here=0', '1|', '4| balls_here=1'], size=(3, 8), cap="The loop covers avenues 1 and 2. When Karel reaches the last avenue the loop stops, so the final put_ball after the loop covers that square. Three balls in all."),
       K("Pick up every ball here", 'while ball_present():\n    take_ball()', [S0, '1|', '2| balls_here=2', '1|', '2| balls_here=1', '1|', '2| balls_here=0', '1|'], balls={(1, 1): 3}, cap="Three balls are on the square. Each pass takes one: 3, 2, 1, 0. When none are left the condition is False."),
       K("A loop that never runs", 'while ball_present():\n    take_ball()\nmove()', [S0, '1|', '3| avenue=2'], cap="There is no ball at the start, so the condition is False the first time. The body runs zero times and Karel just moves.")],
      [("A loop that never changes the condition", "Infinite loop.", "Make the body move toward the end"), ("`while front_is_clear` with no brackets", "It never asks.", "`front_is_clear()`"), ("Forgetting the colon", "SyntaxError.", "`while ...:`"), ("Not indenting the body", "Nothing repeats.", "Indent"),
       ("Missing the last square", "The loop stops BEFORE the last square.", "Do the last square after the loop"), ("Using `for` for an unknown distance", "You cannot name the count.", "Use while"), ("Expecting `while` to run at least once", "It may run zero times.", "The test comes first"), ("`while ball_present(): move()`", "The ball never goes away: infinite loop.", "take_ball() inside")],
      ["The exam has no `while`. It has `REPEAT UNTIL(condition)`, which repeats until the condition is TRUE. That is the opposite question, so flip the condition when you translate.", "A loop condition is checked before each pass.", "Know what makes a loop end."],
      [Q("When does `while front_is_clear(): move()` stop?", ["When Karel reaches a wall", "After 10 moves", "Never", "After one move"], 0, "The condition becomes False at the wall."),
       Q("What is an infinite loop?", ["A loop whose condition never becomes False", "A very long loop", "A loop with no body", "A for loop"], 0, "It never ends."),
       Q("A while loop's condition is checked...", ["Before every pass", "Only at the end", "Once", "Never"], 0, "It is asked first."),
       Q("Which is best for walking to a wall of unknown distance?", ["A while loop", "A for loop with range(10)", "A function", "A comment"], 0, "While repeats until a condition changes.")],
      site="<b>CodeHS:</b> While Loops in Karel", title="While Loops in Karel"),

    L("1.14", "Combine loops, if statements, and functions in one program.",
      [("control structure", "a way to control the order code runs: sequence, selection, iteration"), ("sequencing / selection / iteration", "in order / choose with if / repeat with loops"), ("fencepost problem", "the last square needs special handling after a loop")],
      [("The three building blocks", """Every program is built from three **control structures**:

- **Sequencing**: commands run in order
- **Selection**: an `if` chooses what runs
- **Iteration**: a loop repeats

Real programs mix all three."""),
       ("Example: sweep a row", """Karel must walk to the wall and pick up every ball on the way. The loop repeats (iteration), the `if` only picks up when a ball is there (selection), and the commands run in order (sequence):

```
while front_is_clear():
    if ball_present():
        take_ball()
    move()
```"""),
       ("The last square", """The loop ends when the front is blocked, but Karel is standing on the **last** square, which the loop has not checked. A ball might be there! After the loop, add one more `if ball_present(): take_ball()`. This is a very common trap."""),
       ("Put it in a function", """Wrap the sweep in a function with a clear name (`clear_row()`) so the main program stays short. Functions, loops, and decisions together make powerful programs."""),
      ],
      [A("Sweep a row", 'while front_is_clear():\n    if ball_present():\n        take_ball()\n    move()\nif ball_present():\n    take_ball()',
         [(0, "front_is_clear()", "Iteration: until the wall."), (1, "ball_present()", "Selection: only when there is a ball."), (4, "if ball_present():", "The last square needs its own check.")], cap="Loop, decision, and the last square.", check=False)],
      [K("Sweep a row of 4", 'while front_is_clear():\n    if ball_present():\n        take_ball()\n    move()\nif ball_present():\n    take_ball()', [S0, '1|', '2|', '4| avenue=2', '1|', '2|', '3| balls_here=0', '4| avenue=3', '1|', '2|', '4| avenue=4', '1|', '5|', '6| balls_here=0'], balls={(2, 1): 1, (4, 1): 1}, size=(4, 8), cap="Karel takes the ball on avenue 2 inside the loop. The ball on the LAST square (avenue 4) is only found by the check after the loop."),
       K("Forgetting the last square", 'while front_is_clear():\n    if ball_present():\n        take_ball()\n    move()', [S0, '1|', '2|', '4| avenue=2', '1|', '2|', '3| balls_here=0', '4| avenue=3', '1|', '2|', '4| avenue=4', '1|'], balls={(2, 1): 1, (4, 1): 1}, size=(4, 8), cap="The same world without the final check. The ball on avenue 4 is left behind: a bug that only shows up in some worlds."),
       K("A function holds the sweep", 'def clear_row():\n    while front_is_clear():\n        if ball_present():\n            take_ball()\n        move()\n    if ball_present():\n        take_ball()\n\nclear_row()', [S0, '1|', '9|', '2|', '3|', '4| balls_here=0', '5| avenue=2', '2|', '3|', '5| avenue=3', '2|', '6|', '7| balls_here=0'], balls={(1, 1): 1, (3, 1): 1}, size=(3, 8), cap="Karel takes the ball on avenue 1, walks on, and finds the last ball on avenue 3 after the loop."),
       K("Count both blocks together", 'for i in range(2):\n    if ball_present():\n        take_ball()\n    move()', [S0, '1|', '2|', '3| balls_here=0', '4| avenue=2', '1|', '2|', '4| avenue=3'], balls={(1, 1): 1}, cap="A for loop with an if: Karel picks up the ball on avenue 1, skips avenue 2 (no ball), and ends on avenue 3.")],
      [("Missing the last square after a while loop", "A ball (or job) on the final square is skipped.", "Add a check after the loop"), ("Putting `move()` inside the `if`", "Karel only moves when a ball is there.", "Un-indent move()"), ("Taking without checking", "Error on an empty square.", "Use an if"), ("Testing only one world", "Bugs hide in other worlds.", "Test different sizes"),
       ("An infinite loop", "The body never changes the condition.", "Move inside the loop"), ("A long program with no functions", "Hard to read.", "Use functions"), ("Mixing up where the loop ends", "The loop ends BEFORE the last move.", "Trace the last pass"), ("Wrong indentation of the else", "It belongs to the wrong if.", "Line it up")],
      ["Programs combine sequencing, selection, and iteration.", "Trace carefully through loops with decisions inside.", "A program should work for different inputs, not only one."],
      [Q("Which three building blocks make up every algorithm?", ["Sequencing, selection, iteration", "Input, output, memory", "Loops, lists, numbers", "Comments, names, errors"], 0, "These are the control structures."),
       Q("Why add a check after a while loop that walks to a wall?", ["The last square was never checked", "It is required", "To loop twice", "To remove comments"], 0, "The loop stops before checking the final square."),
       Q("In the sweep program, what does the `if` do?", ["Takes a ball only when one is there", "Moves Karel", "Ends the loop", "Defines a function"], 0, "It avoids the error."),
       Q("A program should work...", ["In many different worlds", "Only in one world", "Only on Tuesdays", "Without a loop"], 0, "General programs are better.")],
      site="<b>CodeHS:</b> Control Structures Example", title="Control Structures Example"),

    L("1.15", "Find and fix bugs with a routine: read the error, trace the code, and test one change at a time.",
      [("bug", "a mistake in a program"), ("syntax error", "breaks the rules of the language, so the program will not run"), ("runtime error", "a crash while the program runs, like hitting a wall"), ("logic error", "the program runs but does the wrong thing")],
      [("Three kinds of bugs", """| Kind | What happens | Karel example |
|---|---|---|
| **Syntax error** | the program will not run | `move(` with a missing bracket |
| **Runtime error** | it crashes while running | Karel hits a wall, or takes a ball that is not there |
| **Logic error** | it runs but is wrong | the loop stops one square short |"""),
       ("A debugging routine", """1. **Read** the error message and the line number.
2. **Predict** what the program should do.
3. **Trace** it by hand and find where Karel's actual position differs.
4. **Change one thing** and test again.
5. **Test other worlds** to be sure it is really fixed."""),
       ("Strategies", """- Trace the program square by square with a table.
- Test small pieces (one function) by themselves.
- **Comment out** lines to find the one that causes the problem.
- Explain the code out loud, line by line. Often you spot the bug while explaining.

Do **not** change code at random: each change should test one idea."""),
      ],
      [A("A logic error: stops one short", 'for i in range(3):\n    move()',
         [(0, "range(3)", "Karel needs 4 moves to reach avenue 5, but this makes 3.")], cap="No error message. Karel just ends in the wrong place.", check=False),
       A("A runtime error", 'turn_left()\nturn_left()\nmove()',
         [(2, "move()", "Karel faces West at the edge: a wall.")], cap="The program starts fine and then crashes.", check=False)],
      [K("A logic error", 'for i in range(3):\n    move()\nput_ball()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4', '3| balls_here=1'], cap="The goal was a ball on avenue 5 but Karel is on avenue 4. Tracing shows the loop count is one short: use range(4)."),
       K("A runtime error", 'move()\nturn_left()\nturn_left()\nmove()\nmove()', [S0, '1| avenue=2', '2| facing="North"', '3| facing="West"', '4| avenue=1'], out="RuntimeError: Karel hit a wall", cap="Karel turned around and walked back, but one move too many hits the wall. The error message names the line."),
       K("Fix it with an if", 'move()\nturn_left()\nturn_left()\nmove()\nif front_is_clear():\n    move()', [S0, '1| avenue=2', '2| facing="North"', '3| facing="West"', '4| avenue=1', '5|'], cap="Checking first stops the crash: the condition is False at the wall, so the last move is skipped."),
       K("Turn a bug into a test", 'for i in range(4):\n    move()\nput_ball()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4', '1|', '2| avenue=5', '3| balls_here=1'], cap="After changing range(3) to range(4), Karel ends on avenue 5 with the ball. Always re-run to confirm the fix.")],
      [("Changing code at random", "New bugs appear.", "Change one thing at a time"), ("Reading only part of the error", "The line number helps.", "Read it all"), ("Fixing the wrong line", "The bug is earlier.", "Trace from the start"), ("Not testing again", "The bug may remain.", "Re-run after each change"),
       ("Testing in one world only", "It may break in another.", "Try different worlds"), ("Giving up on an error message", "It tells you what went wrong.", "Look it up"), ("Thinking a program that runs is correct", "A logic error runs fine.", "Compare with what you expect"), ("Deleting all the code and starting over", "You lose what works.", "Fix the part that fails")],
      ["Know the three kinds of errors: syntax, runtime, and logic. (The exam also mentions overflow errors.)", "Tracing code by hand is the best debugging tool.", "A logic error gives no message, so compare the result with what you expected."],
      [Q("Karel hits a wall while the program runs. What kind of error is this?", ["Syntax", "Runtime", "Logic", "Comment"], 1, "It happens while running."),
       Q("The program runs but stops one square short. What kind of error?", ["Syntax", "Runtime", "Logic", "None"], 2, "Wrong result, no crash."),
       Q("What is a good first step in debugging?", ["Read the error message", "Delete everything", "Guess", "Restart the computer"], 0, "The message points to the problem."),
       Q("Why change only one thing at a time?", ["You know which change helped", "It is required", "It is faster", "It removes comments"], 0, "Otherwise you cannot tell what worked.")],
      site="<b>CodeHS:</b> Debugging Strategies", title="Debugging Strategies"),

    L("1.16", "Explain what an algorithm is, compare two algorithms for the same job, and plan before you code.",
      [("algorithm", "a finite set of clear steps that solves a problem"), ("correct", "gives the right answer for every allowed input"), ("efficient", "uses few steps"), ("pseudocode", "plain-language steps written before the code")],
      [("What an algorithm is", """An **algorithm** is a clear, step-by-step method for solving a problem. It must be **precise** (no guessing), **finish** (it ends), and be **correct** (the right answer for every allowed input). Your Karel programs are algorithms."""),
       ("Different algorithms, same job", """Two algorithms can solve the same problem in different ways. To move Karel four squares you could write `move()` four times or use a loop. Both are correct, but one is shorter. Some algorithms use **fewer steps**: they are more **efficient**."""),
       ("Plan first", """Before writing code, plan in plain words (**pseudocode**): *walk to the wall; on every square, take a ball if there is one.* A good plan makes the code easy to write and easy to check."""),
       ("Algorithms use the three building blocks", """Sequencing, selection, and iteration are the building blocks of every algorithm. Every program in this unit used them."""),
      ],
      [A("Two algorithms, one result", 'move()\nmove()\nmove()\nfor i in range(3):\n    move()',
         [(0, "move()", "Algorithm A: three separate moves."), (3, "range(3)", "Algorithm B: a loop that does the same.")], cap="Same result, different algorithms.", check=False)],
      [T("Count the steps: moves only", 'steps = 0\nfor i in range(3):\n    move()\n    steps = steps + 1', ['0| avenue=1; steps=0', '1| steps=0', '2|', '3| avenue=2', '4| steps=1', '2|', '3| avenue=3', '4| steps=2', '2|', '3| avenue=4', '4| steps=3'], karel=dict(), vars=["avenue", "steps"], cap="The algorithm uses three moves, and the counter confirms it."),
       K("Algorithm A: three moves", 'move()\nmove()\nmove()', [S0, '1| avenue=2', '2| avenue=3', '3| avenue=4'], cap="Karel ends on avenue 4."),
       K("Algorithm B: a loop", 'for i in range(3):\n    move()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4'], cap="A different algorithm with the same result: avenue 4. A loop is shorter and easier to change."),
       K("Plan, then code", '# Plan: go to the wall, drop a ball at the end\nwhile front_is_clear():\n    move()\nput_ball()', [S0, '2|', '3| avenue=2', '2|', '3| avenue=3', '2|', '3| avenue=4', '2|', '4| balls_here=1'], size=(4, 8), cap="The comment is the plan. The code follows it: walk until the wall, then put a ball on the last square.")],
      [("Writing code before planning", "You may solve the wrong problem.", "Plan in words first"), ("An algorithm with a missing step", "It does not solve the problem.", "Check every case"), ("A step that is not precise", "A computer cannot guess.", "Be exact"), ("An algorithm that never ends", "It must finish.", "Make sure the loop can end"),
       ("Thinking there is only one way", "Many algorithms solve a problem.", "Compare them"), ("Choosing the shorter code without checking it works", "Shorter is not always correct.", "Test both"), ("Assuming it works because it worked once", "It must work for every input.", "Test many worlds"), ("Forgetting that sequencing matters", "Order changes results.", "Check the order")],
      ["An algorithm is a finite set of instructions that accomplishes a specific task.", "Algorithms can be written in different ways and still do the same thing. Two algorithms may differ in efficiency.", "Sequencing, selection, and iteration are the building blocks of algorithms."],
      [Q("What is an algorithm?", ["A step-by-step method that solves a problem", "A programming language", "An error", "A computer"], 0, "A finite set of instructions."),
       Q("Two algorithms give the same result. Which is more efficient?", ["The one with fewer steps", "The longer one", "Neither", "The one with more comments"], 0, "Efficiency is about the number of steps."),
       Q("What is pseudocode?", ["Plain-language steps written before code", "A kind of bug", "A type of loop", "A comment about errors"], 0, "It is a plan."),
       Q("Which is NOT a building block of algorithms?", ["Sequencing", "Selection", "Iteration", "Decoration"], 3, "The three are sequencing, selection, iteration.")],
      site="<b>CodeHS:</b> Algorithms", title="Algorithms"),

    L("1.17", "Put every Karel idea together: functions, loops, decisions, and Super Karel commands.",
      [("review", "using everything you know in one program"), ("generalize", "write a program that works in many worlds"), ("reuse", "calling the same function many times")],
      [("Everything together", """This lesson combines the whole unit. A strong Karel program uses **functions** for clear names, **loops** for repeats, **if statements** for decisions, and **comments** to explain. Your CodeHS lesson may introduce extra Karel commands, but the way you plan, write, and trace stays the same."""),
       ("A pattern to follow", """1. **Plan** the job in plain words and decide where Karel starts and ends.
2. **Decompose** it into functions with clear names.
3. **Loop** over the repeats and use `if` for the decisions.
4. **Test** in more than one world."""),
       ("Tracing a big program", """Trace a bigger program in pieces: trace each function by itself first, then trace the main program calling them."""),
      ],
      [A("Plan the main program", 'def pick_and_move():\n    if ball_present():\n        take_ball()\n    move()\n\nfor i in range(4):\n    pick_and_move()',
         [(0, "def pick_and_move():", "A small clear function."), (6, "pick_and_move()", "The loop reuses it four times.")], cap="Function, decision, and loop together.", check=False)],
      [K("pick_and_move four times", 'def pick_and_move():\n    if ball_present():\n        take_ball()\n    move()\n\nfor i in range(4):\n    pick_and_move()', [S0, '1|', '6|', '7|', '2|', '3| balls_here=0', '4| avenue=2', '6|', '7|', '2|', '4| avenue=3', '6|', '7|', '2|', '3| balls_here=0', '4| avenue=4', '6|', '7|', '2|', '4| avenue=5'], balls={(1, 1): 1, (3, 1): 1}, cap="Karel picks up the balls on avenues 1 and 3 and ends on avenue 5. The function is reused on every square."),
       K("Climb and drop", 'def step_up():\n    turn_left()\n    move()\n    turn_right()\n    move()\n\nfor i in range(2):\n    step_up()\n    put_ball()', [S0, '1|', '7|', '8|', '2| facing="North"', '3| street=2', '4| facing="East"', '5| avenue=2', '9| balls_here=1', '7|', '8|', '2| facing="North"', '3| street=3', '4| facing="East"', '5| avenue=3', '9| balls_here=1'], cap="Karel climbs two stairs, dropping a ball on each step. It ends at avenue 3, street 3."),
       K("Walk back with turn_around", 'while front_is_clear():\n    move()\nturn_around()\nwhile front_is_clear():\n    move()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '3| facing="West"', '4|', '5| avenue=2', '4|', '5| avenue=1', '4|'], size=(3, 8), cap="Karel walks to the East wall, turns around, and walks back to the West wall.")],
      [("Not planning", "The program does not fit the goal.", "Write the plan first"), ("Writing functions with unclear names", "The main program is hard to read.", "Name for the job"), ("Testing only one world", "A bug appears in another.", "Try more than one"), ("Forgetting the last square", "A while loop stops before the final step.", "Add a check after"),
       ("Copying code", "Changes must be repeated.", "Use a function"), ("Leaving Karel facing the wrong way", "The next step goes wrong.", "Write the end direction"), ("Mixing control structures wrongly", "Indentation matters.", "Check each indent"), ("Skipping comments", "You forget the plan.", "Comment each function")],
      ["Programs are built from sequencing, selection, and iteration.", "Procedures manage complexity.", "A program should be tested with several inputs."],
      [Q("Which makes a program easier to read?", ["Clear function names", "One long list of commands", "No comments", "Random order"], 0, "Names explain the idea."),
       Q("What should you do before writing code?", ["Plan in words", "Nothing", "Delete comments", "Run it"], 0, "A plan helps."),
       Q("Where does Karel end?", ["Avenue 3", "Avenue 4", "Avenue 2", "Avenue 1"], 0, "Three moves East from avenue 1.", 'for i in range(2):\n    move()'),
       Q("Why test in more than one world?", ["A program may only work in one", "It is required", "To add errors", "To remove loops"], 0, "General programs work in many.")],
      site="<b>CodeHS:</b> Ultra Karel", title="Ultra Karel"),

    L("1.18", "Solve Karel challenges by planning, splitting the problem into functions, and testing in different worlds.",
      [("challenge", "a bigger problem that uses many ideas at once"), ("generalize", "make the solution work for any size world"), ("edge case", "a tricky world, like the smallest or the largest")],
      [("A process for any challenge", """1. **Understand** the problem. Draw the starting world and the finished world.
2. **Plan** the steps in plain words.
3. **Decompose** into functions.
4. **Write** one function at a time and test it.
5. **Generalize**: make sure it works if the world is bigger or smaller.
6. **Check the edge cases**: the smallest world, an empty square, a wall right away."""),
       ("Think about all the worlds", """A challenge program should not be written for exactly one world. Use `while front_is_clear()` instead of a fixed count when the size could change. Check the last square. Ask: *what if there are no balls? what if the row is one square long?*"""),
       ("When you are stuck", """Trace what you have, shrink the problem (try a world with only two squares), and explain the plan aloud. Reflect on what each function does and whether its name tells the truth."""),
      ],
      [A("A general solution", 'while front_is_clear():\n    put_ball()\n    move()\nput_ball()',
         [(0, "front_is_clear()", "Works for any width."), (3, "put_ball()", "Covers the last square.")], cap="No number of squares is written anywhere.", check=False)],
      [K("A row of three", 'while front_is_clear():\n    put_ball()\n    move()\nput_ball()', [S0, '1|', '2| balls_here=1', '3| avenue=2; balls_here=0', '1|', '2| balls_here=1', '3| avenue=3; balls_here=0', '1|', '4| balls_here=1'], size=(3, 8), cap="Balls on all three avenues."),
       K("The smallest world", 'while front_is_clear():\n    put_ball()\n    move()\nput_ball()', [S0, '1|', '4| balls_here=1'], size=(1, 8), cap="In a world only one avenue wide, the loop never runs, and the last put_ball still covers the one square. Edge cases like this are worth testing."),
       K("A wider world", 'while front_is_clear():\n    put_ball()\n    move()\nput_ball()', [S0, '1|', '2| balls_here=1', '3| avenue=2; balls_here=0', '1|', '2| balls_here=1', '3| avenue=3; balls_here=0', '1|', '2| balls_here=1', '3| avenue=4; balls_here=0', '1|', '4| balls_here=1'], size=(4, 8), cap="The same code fills a wider row with no changes."),
       K("A fixed count fails", 'for i in range(2):\n    put_ball()\n    move()\nput_ball()', [S0, '1|', '2| balls_here=1', '3| avenue=2; balls_here=0', '1|', '2| balls_here=1', '3| avenue=3; balls_here=0', '1|', '4| balls_here=1'], size=(4, 8), cap="This worked for a 3-wide world, but in a 4-wide world the last avenue has no ball. A fixed number only works for one size.")],
      [("Solving only the example world", "It fails in others.", "Test different sizes"), ("Hard-coding numbers", "A different world breaks it.", "Use while and conditions"), ("Not checking the last square", "A ball is missed.", "Add a final step"), ("Writing everything at once", "Bugs are hard to find.", "One function at a time"),
       ("Ignoring the edge cases", "They break programs.", "Try the smallest and largest"), ("A function that does two jobs", "Hard to test.", "One job each"), ("Not drawing the world", "You lose track.", "Sketch it"), ("Giving up when stuck", "Smaller steps help.", "Shrink the problem")],
      ["A good program works for many inputs, not just the example.", "Test with edge cases such as empty or minimum input.", "Break complex problems into smaller procedures."],
      [Q("How do you make a program work in any size world?", ["Use a while loop with a condition", "Use a fixed count", "Use more comments", "Use only move()"], 0, "A condition adapts to the world."),
       Q("What is an edge case?", ["An unusual or extreme input", "A kind of loop", "A comment", "A correct answer"], 0, "Like the smallest world."),
       Q("What should you do first on a challenge?", ["Understand and plan", "Type fast", "Delete code", "Skip testing"], 0, "Plan before coding."),
       Q("Why write one function at a time?", ["You can test each one", "It is faster", "It is required", "It removes bugs automatically"], 0, "Small tested pieces are easier.")],
      site="<b>CodeHS:</b> Karel Challenges", title="Karel Challenges"),

    L("1.19", "Review every Karel idea from Unit 1 and practice reading code the way the quiz asks.",
      [("review", "going back over what you learned"), ("trace", "to follow code line by line and track Karel's square and direction"), ("quiz", "a quick check of Unit 1, lessons 1.1 to 1.18")],
      [("What the quiz covers", """The Introduction to Programming Quiz is a quick, low-stakes check on everything in Unit 1: Karel's world and commands, functions, top-down design, abstraction, control structures, debugging, and algorithms, including **reading real code**, not just vocabulary."""),
       ("The big ideas in one list", """- Karel's commands are `move()`, `turn_left()`, `put_ball()`, and `take_ball()`. Super Karel adds `turn_right()` and `turn_around()`.
- A program is a **sequence** of commands, and order matters.
- **Define** a function with `def`. **Call** it to run it.
- **Top-down design** splits a big problem into smaller functions. **Abstraction** hides details behind a name.
- **Comments** (`#`) are ignored by the computer.
- **For** repeats a set number of times. **While** repeats until a condition changes.
- **If** and **if/else** choose using conditions like `front_is_clear()` and `ball_present()`.
- Bugs are **syntax**, **runtime**, or **logic** errors. Debug by tracing and changing one thing at a time.
- An **algorithm** is a finite set of steps that solves a problem."""),
       ("How to read code questions", """For each question: write Karel's starting square and direction, then update after **every** line. Watch out for **indentation** (what is inside a loop or if) and for functions that are defined but never called."""),
      ],
      [A("A mixed quiz question", 'def jump():\n    turn_left()\n    move()\n\nmove()\njump()',
         [(5, "jump()", "A call: jumps into the function."), (0, "def jump():", "Only defines it.")], cap="Karel ends facing North, one avenue and one street from the start.", check=False)],
      [K("Where does Karel end?", 'def jump():\n    turn_left()\n    move()\n\nmove()\njump()', [S0, '1|', '5| avenue=2', '6|', '2| facing="North"', '3| street=2'], cap="move takes Karel to avenue 2. jump turns left (North) and moves up one street. Karel ends at avenue 2, street 2, facing North."),
       K("A loop and an if", 'for i in range(3):\n    if ball_present():\n        take_ball()\n    move()', [S0, '1|', '2|', '3| balls_here=0', '4| avenue=2', '1|', '2|', '4| avenue=3', '1|', '2|', '4| avenue=4'], balls={(1, 1): 1}, cap="Only the first square has a ball. Karel takes it and ends on avenue 4."),
       K("Which loop ends where?", 'while front_is_clear():\n    move()\nturn_left()\nmove()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '2| avenue=4', '1|', '3| facing="North"', '4| street=2'], size=(4, 8), cap="Karel walks to the East wall (avenue 4), turns left, and moves up one street."),
       K("A bug to spot", 'for i in range(2):\n    move()\nturn_left()\nmove()', [S0, '1|', '2| avenue=2', '1|', '2| avenue=3', '1|', '3| facing="North"', '4| street=2'], cap="The turn and last move are NOT in the loop (not indented), so they happen only once after the loop. Indentation decides what repeats.")],
      [("Not tracing the direction", "Wrong final square.", "Update direction every line"), ("Misreading indentation", "You count lines as part of a loop that are not.", "Look at the indents"), ("Forgetting that a function must be called", "A defined function that is never called does nothing.", "Look for the call"), ("Mixing up for and while", "For counts. While waits for a condition.", "Know which is which"),
       ("Thinking `else` has a condition", "It has none.", "Otherwise"), ("Confusing runtime and logic errors", "Runtime crashes. Logic runs wrong.", "Does it crash?"), ("Forgetting Karel starts facing East", "Every trace starts there.", "Write it down first"), ("Not reading all the options", "A close option may be wrong.", "Read each answer")],
      ["The exam includes questions that ask you to read and trace short programs.", "Know the building blocks: sequencing, selection, and iteration.", "Know the kinds of errors and what an algorithm is."],
      [Q("Karel faces East at avenue 1. After `move()`, `turn_left()`, `move()`, where is Karel?", ["Avenue 2, street 2", "Avenue 1, street 3", "Avenue 3, street 1", "Avenue 2, street 1"], 0, "East one, then North one."),
       Q("A function is defined but never called. What happens?", ["Nothing from it runs", "It runs once", "An error", "It runs twice"], 0, "Only calling runs it."),
       Q("In a loop, which lines repeat?", ["The indented lines", "All lines", "The last line only", "The first line only"], 0, "Indentation shows the body."),
       Q("Which is a runtime error?", ["Karel hits a wall", "A missing bracket", "The wrong answer", "A comment"], 0, "It happens while running.")],
      site="<b>CodeHS:</b> 1.19 Introduction to Programming Quiz (15 questions)", title="Introduction to Programming Quiz"),
    ],
    glossary=[], seed=1)
