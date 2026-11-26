"""Hand-written additions to the automatic model answers for the Unit 4 walkthroughs: the parts the walkthrough asks the student to type that the builder cannot read out of the text.
Each entry is  slot -> {step number: text or function(step lines) -> text}  and is added at the end of that step."""
import re
def V(var, val):
    """a new copy of the step's program with one variable's value changed"""
    def f(L):
        code = '\n'.join(x for x in L if not x.startswith('# Step'))
        return re.sub(r'(?m)^%s = .*$' % re.escape(var), '%s = %s' % (var, val), code)
    return f
def COMMENTED(L):
    """the broken chain commented out (the first code block of the step), leaving the score line alone"""
    first = L[0].split('\n')
    return '\n'.join('# ' + l if l.strip() and not l.startswith('score =') else l for l in first)
OV = {
 'a30': {5: '# average(80, 90)  # this call would crash because average needs three arguments and only two were given'},
 'a16': {2: 'game_over = False\nprint(game_over)'},
 'a17': {7: '# score <- 82\n# passed <- score > 70 AND score < 90\n# DISPLAY(passed)\n# DISPLAY(score < 60 OR score > 80)\n# DISPLAY(NOT (score = 82))'},
 'a18': {5: lambda L: 'number = 7\n' + '\n'.join(x for x in L if x.startswith('print'))},
 'a19': {1: V('age', '15'), 2: V('temperature', '70'), 6: V('has_license', 'False')},
 'a20': {1: V('age', '15'), 2: V('number', '10'), 3: V('score', '95'),
         4: lambda L: COMMENTED(L) + '\nif score >= 90:\n    print("Honors")\nelif score >= 60:\n    print("Pass")\nelse:\n    print("Fail")',
         7: '# x <- 8\n# IF (x > 10)\n# DISPLAY("big")\n# ELSE\n# DISPLAY("small")\n# DISPLAY("end")\n# mark <- 58\n# IF (mark >= 60)\n# DISPLAY("pass")\n# ELSE\n# IF (mark >= 50)\n# DISPLAY("retake")\n# ELSE\n# DISPLAY("fail")\n'
            'x = 8\nif x > 10:\n    print("big")\nelse:\n    print("small")\nprint("end")\nmark = 58\nif mark >= 60:\n    print("pass")\nelif mark >= 50:\n    print("retake")\nelse:\n    print("fail")'},
 'a21': {3: 'on_key(Event("q"))', 5: lambda L: '\n'.join(x for x in L if not x.startswith('# Step')).replace('if event.key == "a":', 'if event.key.lower() == "a":'),
         7: '# Events: the event is the key press and its key is the input the handler receives',
         8: 'control(Event("ArrowRight"))\ncontrol(Event("ArrowRight"))\ncontrol(Event("ArrowLeft"))\ncontrol(Event("space"))\ncontrol(Event("q"))'},
 'a22': {7: '# count <- 0\n# REPEAT 4 TIMES\n# count <- count + 3\n# DISPLAY(count)\ncount = 0\nfor i in range(4):\n    count = count + 3\nprint(count)  # shows 12\n'
            '# x <- 1\n# REPEAT 7 TIMES\n# IF (x MOD 2 = 0)\n# DISPLAY(x)\n# x <- x + 1\nx = 1\nfor i in range(7):\n    if x % 2 == 0:\n        print(x)\n    x = x + 1  # shows 2, 4, and 6'},
 'a23': {7: 'nums = [3, 8, 5]\nresult = 0\nfor n in nums:\n    result = result + n\nprint(result)\ntemps = [72, 55, 90, 68]\nhot = 0\nfor t in temps:\n    if t > 70:\n        hot = hot + 1\nprint(hot)',
         8: V('scores', '[50, 60, 70]')},
 'a26': {5: 'count = 1\nwhile count <= 3:\n    print(count)\n    count = count + 1',
         7: 'n = 1\nwhile n <= 3:  # REPEAT UNTIL n > 3 was flipped to keep going while n <= 3\n    print(n)\n    n = n + 1\nlives = 3\nwhile lives != 0:  # REPEAT UNTIL lives = 0 was flipped to keep going while lives != 0\n    print(lives)\n    lives = lives - 1'},
 'a27': {4: 'tries = 0\nwhile True:\n    password = input("Password? ")\n    tries = tries + 1\n    if password == "python":\n        break\nprint("Tries:", tries)',
         7: 'total = 0\nnumber = int(input("Number? "))\nwhile number != -1:  # REPEAT UNTIL flipped: keep going while number is not -1\n    total = total + number\n    number = int(input("Number? "))\nprint(total)'},
 'a28': {7: 'import random\nroll = random.randint(1, 6)\nprint(roll)  # smallest 1 and largest 6\ncount = 0\nfor turn in range(3):\n    count = count + random.randint(1, 2)\nprint(count)  # smallest 3 and largest 6'},
}
INS = {'a19': ['10'], 'a21': [], 'a26': ['10'], 'a27': ['wrong', 'python', '4', '6', '0', '-1', '5', '3', '-1', '12', '-1', '1', '-1', '1', '-1', '1', '-1', '-1'], 'a20': ['40'], 'a23': []}
