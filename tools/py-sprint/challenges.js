    /* =========================================================================
       1. COMPLETE APCSP PYTHON CURRICULUM BANK (7 UNITS • 25 CODING CHALLENGES)
       ========================================================================= */
    const APCSP_CATEGORIES = [
      { id: 'variables', name: 'Variables, Data Types & Math', color: 'sky' },
      { id: 'strings', name: 'Strings & Output (print / slicing)', color: 'cyan' },
      { id: 'conditionals', name: 'Conditionals & Boolean Logic', color: 'amber' },
      { id: 'loops', name: 'Loops & Iteration (for / while)', color: 'emerald' },
      { id: 'lists', name: 'Lists & List Procedures (append / pop)', color: 'violet' },
      { id: 'functions', name: 'Procedures & Functions (return / print)', color: 'pink' },
      { id: 'algorithms', name: 'AP Algorithms, Traversals & Random', color: 'rose' }
    ];

    const DEFAULT_CHALLENGES = [
      {
        id: 'var_five_profile', category: 'variables', title: 'Create 5 Student Profile Variables', difficulty: 'Core',
        prompt: 'Create 5 variables with exact names and types: name (string), age (int), gpa (float), is_enrolled (bool), and school (string).',
        checklist: ['name (str)', 'age (int)', 'gpa (float)', 'is_enrolled (bool)', 'school (str)'],
        starter: '# Create all 5 variables below\n',
        solution: 'name = "Jordan"\nage = 17\ngpa = 3.85\nis_enrolled = True\nschool = "SCHS"',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('name' in globals() and isinstance(name, str) and len(name) > 0, "name is a non-empty string", "Example: name = 'Jordan'")
_chk('age' in globals() and type(age) is int, "age is an integer (int)", "Example: age = 17")
_chk('gpa' in globals() and type(gpa) is float, "gpa is a float", "Example: gpa = 3.8")
_chk('is_enrolled' in globals() and type(is_enrolled) is bool, "is_enrolled is a boolean (True/False)", "Example: is_enrolled = True")
_chk('school' in globals() and isinstance(school, str) and len(school) > 0, "school is a non-empty string", "Example: school = 'SCHS'")
`
      },
      {
        id: 'var_five_game', category: 'variables', title: 'Create 5 Game State Variables', difficulty: 'Core',
        prompt: 'Set up 5 game variables: player (any string), lives = 3, score = 0, speed = 2.5, and game_over = False.',
        checklist: ['player (str)', 'lives == 3', 'score == 0', 'speed == 2.5', 'game_over == False'],
        starter: '# Initialize the 5 game variables\n',
        solution: 'player = "Nova"\nlives = 3\nscore = 0\nspeed = 2.5\ngame_over = False',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('player' in globals() and isinstance(player, str) and len(player) > 0, "player is a string", "Assign any string to player")
_chk('lives' in globals() and lives == 3 and type(lives) is int, "lives equals 3", "Set lives = 3")
_chk('score' in globals() and score == 0 and type(score) is int, "score equals 0", "Set score = 0")
_chk('speed' in globals() and speed == 2.5, "speed equals 2.5", "Set speed = 2.5")
_chk('game_over' in globals() and game_over is False, "game_over is False", "Use capital False: game_over = False")
`
      },
      {
        id: 'var_mod_div', category: 'variables', title: 'Integer Division (//) & Remainder (MOD %)', difficulty: 'Core',
        prompt: 'Given slices = 23 and people = 5, create per_person using integer division (//) and leftover using modulo (%).',
        checklist: ['per_person == 4', 'leftover == 3'],
        starter: 'slices = 23\npeople = 5\n# Calculate per_person and leftover\n',
        solution: 'slices = 23\npeople = 5\nper_person = slices // people\nleftover = slices % people',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('per_person' in globals() and per_person == 4 and type(per_person) is int, "per_person is 4 (int)", "Use slices // people")
_chk('leftover' in globals() and leftover == 3, "leftover is 3", "Use slices % people")
`
      },
      {
        id: 'var_update_exp', category: 'variables', title: 'Compound Assignment & Exponents (**)', difficulty: 'Standard',
        prompt: 'Start with pts = 4. Add 6 to pts, then multiply pts by 2, and finally store pts squared (pts ** 2) in a variable named power.',
        checklist: ['pts == 20', 'power == 400'],
        starter: 'pts = 4\n# Update pts and compute power\n',
        solution: 'pts = 4\npts += 6\npts *= 2\npower = pts ** 2',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('pts' in globals() and pts == 20, "pts equals 20", "4 + 6 = 10, then 10 * 2 = 20")
_chk('power' in globals() and power == 400, "power equals 400", "Use power = pts ** 2")
`
      },
      {
        id: 'str_print_greeting', category: 'strings', title: 'String Concatenation & Print', difficulty: 'Core',
        prompt: 'Create variables course = "APCSP" and year = 2026. Then print the exact text: Welcome to APCSP 2026',
        checklist: ['course == "APCSP"', 'year == 2026', 'prints "Welcome to APCSP 2026"'],
        starter: '# Define course and year, then print the message\n',
        solution: 'course = "APCSP"\nyear = 2026\nprint("Welcome to " + course + " " + str(year))',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('course' in globals() and course == "APCSP", 'course == "APCSP"', 'Set course = "APCSP"')
_chk('year' in globals() and year == 2026, "year == 2026", "Set year = 2026")
`,
        checkStdout: (stdout) => [
          {
            pass: stdout.trim() === 'Welcome to APCSP 2026',
            label: 'Prints "Welcome to APCSP 2026"',
            hint: `Your output was "${stdout.trim() || '(empty)'}" — expected "Welcome to APCSP 2026"`
          }
        ]
      },
      {
        id: 'str_index_len', category: 'strings', title: 'String Indexing & len()', difficulty: 'Core',
        prompt: 'Given word = "Python", store the first character in first, the last character in last, and the character count in length.',
        checklist: ['first == "P"', 'last == "n"', 'length == 6'],
        starter: 'word = "Python"\n# Set first, last, and length\n',
        solution: 'word = "Python"\nfirst = word[0]\nlast = word[-1]\nlength = len(word)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('first' in globals() and first == "P", 'first == "P"', "Use word[0]")
_chk('last' in globals() and last == "n", 'last == "n"', "Use word[-1] or word[5]")
_chk('length' in globals() and length == 6, "length == 6", "Use len(word)")
`
      },
      {
        id: 'str_slice_upper', category: 'strings', title: 'String Slicing & .upper()', difficulty: 'Standard',
        prompt: 'Given tag = "apcsp_exam", slice out the first 5 characters and convert them to uppercase, storing the result in code.',
        checklist: ['code == "APCSP"'],
        starter: 'tag = "apcsp_exam"\n# Slice and uppercase into code\n',
        solution: 'tag = "apcsp_exam"\ncode = tag[0:5].upper()',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('code' in globals() and code == "APCSP", 'code == "APCSP"', "Use tag[0:5].upper()")
`
      },
      {
        id: 'cond_grade', category: 'conditionals', title: 'If / Elif / Else Letter Grade', difficulty: 'Standard',
        prompt: 'Write a function get_grade(score) that returns "A" for 90+, "B" for 80-89, "C" for 70-79, and "F" below 70.',
        checklist: ['def get_grade(score):', '95 and 90 -> "A"', '84 and 80 -> "B"', '70 -> "C"', '69 and 62 -> "F"'],
        starter: 'def get_grade(score):\n    # Write your if/elif/else logic\n    pass\n',
        solution: 'def get_grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    elif score >= 70:\n        return "C"\n    else:\n        return "F"',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'get_grade' not in globals() or not callable(get_grade):
    _chk(False, "Function get_grade exists", "Define def get_grade(score):")
else:
    _chk(get_grade(95) == "A", 'get_grade(95) == "A"', "Check score >= 90")
    _chk(get_grade(90) == "A", 'get_grade(90) == "A"', "90 counts as an A: use >= 90, not > 90")
    _chk(get_grade(84) == "B", 'get_grade(84) == "B"', "Check elif score >= 80")
    _chk(get_grade(80) == "B", 'get_grade(80) == "B"', "80 counts as a B: use >= 80")
    _chk(get_grade(70) == "C", 'get_grade(70) == "C"', "Check elif score >= 70")
    _chk(get_grade(69) == "F", 'get_grade(69) == "F"', "Below 70 is an F")
    _chk(get_grade(62) == "F", 'get_grade(62) == "F"', "Return 'F' in else")
`
      },
      {
        id: 'cond_and_logic', category: 'conditionals', title: 'Boolean AND Eligibility Check', difficulty: 'Core',
        prompt: 'Write a function can_ride(height, has_pass) that returns True if height >= 48 and has_pass is True, otherwise returns False.',
        checklist: ['can_ride(50, True) -> True', 'can_ride(50, False) -> False', 'can_ride(44, True) -> False'],
        starter: 'def can_ride(height, has_pass):\n    \n',
        solution: 'def can_ride(height, has_pass):\n    if height >= 48 and has_pass:\n        return True\n    return False',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'can_ride' not in globals() or not callable(can_ride):
    _chk(False, "Function can_ride exists", "Define def can_ride(height, has_pass):")
else:
    _chk(can_ride(50, True) is True, "can_ride(50, True) is True", "Check height >= 48 and has_pass")
    _chk(can_ride(48, True) is True, "can_ride(48, True) is True", "Use >= 48 (inclusive)")
    _chk(can_ride(50, False) is False, "can_ride(50, False) is False", "Both conditions must be True")
    _chk(can_ride(44, True) is False, "can_ride(44, True) is False", "Height below 48 returns False")
`
      },
      {
        id: 'cond_even_pos', category: 'conditionals', title: 'Positive & Even (MOD + AND)', difficulty: 'Standard',
        prompt: 'Write a function is_pos_even(n) that returns True only if n is greater than 0 AND divisible by 2 (n % 2 == 0).',
        checklist: ['is_pos_even(8) -> True', 'is_pos_even(7) -> False', 'is_pos_even(-4) -> False'],
        starter: 'def is_pos_even(n):\n    \n',
        solution: 'def is_pos_even(n):\n    return n > 0 and n % 2 == 0',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'is_pos_even' not in globals() or not callable(is_pos_even):
    _chk(False, "Function is_pos_even exists", "Define def is_pos_even(n):")
else:
    _chk(is_pos_even(8) is True, "is_pos_even(8) is True", "8 is > 0 and even")
    _chk(is_pos_even(7) is False, "is_pos_even(7) is False", "7 is odd")
    _chk(is_pos_even(-4) is False, "is_pos_even(-4) is False", "-4 is not > 0")
    _chk(is_pos_even(0) is False, "is_pos_even(0) is False", "0 is not > 0")
`
      },
      {
        id: 'loop_range_print', category: 'loops', title: 'For Loop: Print 1 Through 5', difficulty: 'Core',
        prompt: 'Use a for loop with range() to print the numbers 1, 2, 3, 4, 5 (each on its own line).',
        checklist: ['Prints 1, 2, 3, 4, 5 on separate lines'],
        starter: '# Use a for loop to print 1 to 5\n',
        solution: 'for i in range(1, 6):\n    print(i)',
        pyTest: `print("__PASS__|Code executed without errors")`,
        checkStdout: (stdout) => {
          const lines = stdout.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
          const ok = lines.length === 5 && lines.join(',') === '1,2,3,4,5';
          return [{ pass: ok, label: 'Printed 1, 2, 3, 4, 5', hint: `Expected lines 1..5, got: [${lines.join(', ')}]` }];
        }
      },
      {
        id: 'loop_sum_evens', category: 'loops', title: 'Accumulator Loop: Sum Even Numbers', difficulty: 'Standard',
        prompt: 'Use a loop to compute the sum of all even numbers from 2 to 20 inclusive (2 + 4 + ... + 20) and store it in total.',
        checklist: ['total == 110'],
        starter: 'total = 0\n# Loop through even numbers 2..20 and add to total\n',
        solution: 'total = 0\nfor n in range(2, 21, 2):\n    total += n',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('total' in globals() and total == 110, "total equals 110", "Use range(2, 21, 2) and total += n")
`
      },
      {
        id: 'loop_while_countdown', category: 'loops', title: 'While Loop Rocket Countdown', difficulty: 'Standard',
        prompt: 'Write a while loop starting at n = 3 that prints 3, 2, 1 (one per line) and after the loop prints "Go!"',
        checklist: ['Prints 3, 2, 1, then Go!'],
        starter: 'n = 3\n# Write your while loop below\n',
        solution: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("Go!")',
        pyTest: `print("__PASS__|While loop finished safely")`,
        checkStdout: (stdout) => {
          const lines = stdout.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
          const ok = lines.join('|') === '3|2|1|Go!';
          return [{ pass: ok, label: 'Printed 3, 2, 1, Go!', hint: `Expected 3, 2, 1, Go! — got [${lines.join(', ')}]` }];
        }
      },
      {
        id: 'list_append_pop', category: 'lists', title: 'Create a List, Append & Pop', difficulty: 'Core',
        prompt: 'Create a list items = ["pen", "book", "laptop"]. Append "charger" to the end, then pop() the item at index 0 and store it in removed.',
        checklist: ['items == ["book", "laptop", "charger"]', 'removed == "pen"'],
        starter: '# Create items, append "charger", pop index 0 into removed\n',
        solution: 'items = ["pen", "book", "laptop"]\nitems.append("charger")\nremoved = items.pop(0)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('items' in globals() and items == ["book", "laptop", "charger"], 'items == ["book", "laptop", "charger"]', "Append 'charger' then pop(0)")
_chk('removed' in globals() and removed == "pen", 'removed == "pen"', "Capture removed = items.pop(0)")
`
      },
      {
        id: 'list_insert_update', category: 'lists', title: 'List Insert, Update & Length', difficulty: 'Standard',
        prompt: 'Start with scores = [80, 90, 100]. Insert 85 at index 1, change the last element to 99, and store the list length in count.',
        checklist: ['scores == [80, 85, 90, 99]', 'count == 4'],
        starter: 'scores = [80, 90, 100]\n# Insert 85 at index 1, update last item to 99, set count\n',
        solution: 'scores = [80, 90, 100]\nscores.insert(1, 85)\nscores[-1] = 99\ncount = len(scores)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('scores' in globals() and scores == [80, 85, 90, 99], "scores == [80, 85, 90, 99]", "Use scores.insert(1, 85) and scores[-1] = 99")
_chk('count' in globals() and count == 4, "count == 4", "Use count = len(scores)")
`
      },
      {
        id: 'list_index_ends', category: 'lists', title: 'List Indexing: First, Last & Sum', difficulty: 'Core',
        prompt: 'Given nums = [12, 24, 36, 48, 60], store the first item in first, the last item in last, and their sum in edge_sum.',
        checklist: ['first == 12', 'last == 60', 'edge_sum == 72'],
        starter: 'nums = [12, 24, 36, 48, 60]\n# Set first, last, and edge_sum\n',
        solution: 'nums = [12, 24, 36, 48, 60]\nfirst = nums[0]\nlast = nums[-1]\nedge_sum = first + last',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('first' in globals() and first == 12, "first == 12", "Use nums[0]")
_chk('last' in globals() and last == 60, "last == 60", "Use nums[-1]")
_chk('edge_sum' in globals() and edge_sum == 72, "edge_sum == 72", "Set edge_sum = first + last")
`
      },
      {
        id: 'list_build_squares', category: 'lists', title: 'Build a List Using a Loop & Append', difficulty: 'Standard',
        prompt: 'Create an empty list squares = [] and use a loop to append the squares of 1 through 5 so squares equals [1, 4, 9, 16, 25].',
        checklist: ['squares == [1, 4, 9, 16, 25]'],
        starter: 'squares = []\n# Append 1*1 through 5*5\n',
        solution: 'squares = []\nfor n in range(1, 6):\n    squares.append(n * n)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('squares' in globals() and squares == [1, 4, 9, 16, 25], "squares == [1, 4, 9, 16, 25]", "Loop range(1, 6) and append(n ** 2)")
`
      },
      {
        id: 'fn_add_return', category: 'functions', title: 'Function: Add Two Numbers (Return)', difficulty: 'Core',
        prompt: 'Write a function named add_nums(a, b) that takes two numbers as parameters and returns their sum.',
        checklist: ['def add_nums(a, b):', 'add_nums(4, 9) -> 13', 'add_nums(-2, 7) -> 5'],
        starter: '# Define add_nums(a, b) below\n',
        solution: 'def add_nums(a, b):\n    return a + b',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'add_nums' not in globals() or not callable(add_nums):
    _chk(False, "Function add_nums exists", "Write def add_nums(a, b):")
else:
    _chk(add_nums(4, 9) == 13, "add_nums(4, 9) returns 13", "Use return a + b (not print)")
    _chk(add_nums(-2, 7) == 5, "add_nums(-2, 7) returns 5", "Ensure parameters a and b are summed")
    _chk(add_nums(0, 0) == 0, "add_nums(0, 0) returns 0", "Return a + b")
`
      },
      {
        id: 'fn_mult_print', category: 'functions', title: 'Function: Multiply Two Numbers (Print)', difficulty: 'Core',
        prompt: 'Write a function named show_product(x, y) that takes two numbers and prints their product (x * y).',
        checklist: ['def show_product(x, y):', 'show_product(6, 7) prints 42', 'show_product(3, 9) prints 27'],
        starter: '# Define show_product(x, y) to print x * y\n',
        solution: 'def show_product(x, y):\n    print(x * y)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'show_product' not in globals() or not callable(show_product):
    _chk(False, "Function show_product exists", "Write def show_product(x, y):")
else:
    _chk(True, "Function show_product defined", "")
    print("__CAP__|p1|START")
    show_product(6, 7)
    print("__CAP__|p1|END")
    print("__CAP__|p2|START")
    show_product(3, 9)
    print("__CAP__|p2|END")
`,
        checkStdout: (_stdout, captures) => {
          if (captures.p1 === undefined && captures.p2 === undefined) return [{ pass: false, label: 'show_product prints its result', hint: 'The function must print the product (use print, not return).' }];
          return [
            { pass: (captures.p1 || '').trim() === '42', label: 'show_product(6, 7) prints 42', hint: `Expected printed "42", got "${(captures.p1 || '').trim() || '(nothing printed)'}"` },
            { pass: (captures.p2 || '').trim() === '27', label: 'show_product(3, 9) prints 27', hint: `Expected printed "27", got "${(captures.p2 || '').trim() || '(nothing printed)'}"` }
          ];
        }
      },
      {
        id: 'fn_rect_area', category: 'functions', title: 'Function Definition & Function Call', difficulty: 'Core',
        prompt: 'Write a function rect_area(w, h) that returns w * h. Then call it to store rect_area(6, 4) in a variable named box.',
        checklist: ['rect_area(6, 4) -> 24', 'rect_area(5, 10) -> 50', 'box == 24'],
        starter: '# Define rect_area(w, h) and call it to set box\n',
        solution: 'def rect_area(w, h):\n    return w * h\n\nbox = rect_area(6, 4)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'rect_area' not in globals() or not callable(rect_area):
    _chk(False, "Function rect_area exists", "Write def rect_area(w, h):")
else:
    _chk(rect_area(6, 4) == 24, "rect_area(6, 4) == 24", "Return w * h")
    _chk(rect_area(5, 10) == 50, "rect_area(5, 10) == 50", "Return w * h")
_chk('box' in globals() and box == 24, "box equals 24", "Call box = rect_area(6, 4)")
`
      },
      {
        id: 'fn_greet', category: 'functions', title: 'String Return Procedure', difficulty: 'Core',
        prompt: 'Write a function greet(name) that takes a string parameter and returns "Hello, " + name + "!" (for example, greet("Ada") returns "Hello, Ada!").',
        checklist: ['greet("Ada") -> "Hello, Ada!"', 'greet("Sam") -> "Hello, Sam!"'],
        starter: 'def greet(name):\n    \n',
        solution: 'def greet(name):\n    return "Hello, " + name + "!"',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'greet' not in globals() or not callable(greet):
    _chk(False, "Function greet exists", "Write def greet(name):")
else:
    _chk(greet("Ada") == "Hello, Ada!", 'greet("Ada") == "Hello, Ada!"', 'Return "Hello, " + name + "!"')
    _chk(greet("Sam") == "Hello, Sam!", 'greet("Sam") == "Hello, Sam!"', "Include the comma, space, and !")
`
      },
      {
        id: 'alg_find_max', category: 'algorithms', title: 'AP Algorithm: Find Maximum in a List', difficulty: 'AP Exam',
        prompt: 'Write a function find_max(nums) that takes a non-empty list of numbers and returns the largest value.',
        checklist: ['find_max([3, 19, 7, 2]) -> 19', 'find_max([-10, -3, -25]) -> -3'],
        starter: 'def find_max(nums):\n    # Traverse nums to find the max value\n    pass\n',
        solution: 'def find_max(nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'find_max' not in globals() or not callable(find_max):
    _chk(False, "Function find_max exists", "Define def find_max(nums):")
else:
    _chk(find_max([3, 19, 7, 2]) == 19, "find_max([3, 19, 7, 2]) == 19", "Track best = nums[0] and update when n > best")
    _chk(find_max([-10, -3, -25]) == -3, "find_max([-10, -3, -25]) == -3", "Start best at nums[0], not 0, so negative lists work!")
`
      },
      {
        id: 'alg_average', category: 'algorithms', title: 'AP Algorithm: Compute List Average', difficulty: 'AP Exam',
        prompt: 'Write a function get_avg(vals) that takes a non-empty list of numbers and returns their average (sum divided by length).',
        checklist: ['get_avg([10, 20, 30]) -> 20', 'get_avg([80, 90]) -> 85'],
        starter: 'def get_avg(vals):\n    \n',
        solution: 'def get_avg(vals):\n    return sum(vals) / len(vals)',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'get_avg' not in globals() or not callable(get_avg):
    _chk(False, "Function get_avg exists", "Define def get_avg(vals):")
else:
    _chk(get_avg([10, 20, 30]) == 20, "get_avg([10, 20, 30]) == 20", "Divide sum by len(vals)")
    _chk(get_avg([80, 90]) == 85, "get_avg([80, 90]) == 85", "Use / for true average")
`
      },
      {
        id: 'alg_count_passing', category: 'algorithms', title: 'AP List Traversal: Count Passing Scores', difficulty: 'AP Exam',
        prompt: 'Write a function count_pass(grades) that traverses a list of scores and returns how many scores are >= 70.',
        checklist: ['count_pass([55, 70, 88, 92, 64]) -> 3', 'count_pass([40, 50]) -> 0'],
        starter: 'def count_pass(grades):\n    \n',
        solution: 'def count_pass(grades):\n    total = 0\n    for g in grades:\n        if g >= 70:\n            total += 1\n    return total',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
if 'count_pass' not in globals() or not callable(count_pass):
    _chk(False, "Function count_pass exists", "Define def count_pass(grades):")
else:
    _chk(count_pass([55, 70, 88, 92, 64]) == 3, "count_pass([55,70,88,92,64]) == 3", "Count scores >= 70")
    _chk(count_pass([40, 50]) == 0, "count_pass([40,50]) == 0", "Return 0 when none pass")
`
      },
      {
        id: 'alg_binary_random', category: 'algorithms', title: 'Random Simulation & Binary Search Midpoint', difficulty: 'AP Exam',
        prompt: 'Import random, set roll = random.randint(1, 6), AND write a function mid_index(low, high) that returns the integer midpoint (low + high) // 2.',
        checklist: ['roll is int between 1 and 6', 'mid_index(0, 9) -> 4', 'mid_index(4, 10) -> 7'],
        starter: 'import random\n# Set roll and define mid_index(low, high)\n',
        solution: 'import random\nroll = random.randint(1, 6)\n\ndef mid_index(low, high):\n    return (low + high) // 2',
        pyTest: `
def _chk(cond, lbl, hint):
    print(("__PASS__|" + lbl) if cond else ("__FAIL__|" + lbl + "|" + hint))
_chk('roll' in globals() and type(roll) is int and 1 <= roll <= 6, "roll is an int from 1 to 6", "Use roll = random.randint(1, 6)")
if 'mid_index' not in globals() or not callable(mid_index):
    _chk(False, "Function mid_index exists", "Write def mid_index(low, high):")
else:
    _chk(mid_index(0, 9) == 4 and type(mid_index(0, 9)) is int, "mid_index(0, 9) == 4 (int)", "Use integer division // 2")
    _chk(mid_index(4, 10) == 7, "mid_index(4, 10) == 7", "Return (low + high) // 2")
`
      }
    ];
