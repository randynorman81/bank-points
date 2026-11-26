# Five MORE shapes per lesson (4.5-4.8).
SH = {}
def M(title, story, code, dis, ins=None, rnd=False):
    return dict(title=title, story=story, sol=code, dis=dis, keys=[], pool=[()], ins=ins or [], rnd=rnd, tr=None)
L = lambda *a: '\n'.join(a)

SH['u4l5'] = [
 M('Too hot or just right', 'Store 155 in temp. If temp is greater than 140, print Too hot. Otherwise, print Just right.',
   L('temp = 155', 'if temp > 140:', '    print("Too hot")', 'else:', '    print("Just right")'),
   [(1, 'if temp > 140'), (3, 'else'), (1, 'if temp => 140:')]),
 M('Low balance warning', 'Store 12 in balance. If balance is less than 5, print Add funds now. Otherwise, if balance is less than 20, print Add funds soon.',
   L('balance = 12', 'if balance < 5:', '    print("Add funds now")', 'elif balance < 20:', '    print("Add funds soon")'),
   [(3, 'else balance < 20:'), (3, 'elif balance < 20'), (3, 'elif balance > 20:')]),
 M('Discount with an else', 'Store 70 in order. If order is at least 50, store order * 0.1 in discount. Otherwise, store 0 in discount. Print the label Discount: followed by discount.',
   L('order = 70', 'if order >= 50:', '    discount = order * 0.1', 'else:', '    discount = 0', 'print("Discount:", discount)'),
   [(1, 'if order > 100'), (4, '    discount = '), (3, 'else if:')]),
 M('Typed drink', 'Ask Drink? and store the answer in drink. If drink is equal to tea, print Hot water ready. Otherwise, print Espresso machine on. (The user types latte.)',
   L('drink = input("Drink? ")', 'if drink == "tea":', '    print("Hot water ready")', 'else:', '    print("Espresso machine on")'),
   [(1, 'if drink = "tea":'), (1, 'if drink == tea:'), (2, 'print("Hot water ready")')], ins=['latte']),
 M('Member check inside an if', 'Store True in is_member and 30 in stars. If is_member is True, check inside it: if stars is at least 50, print Free drink, otherwise print Keep collecting.',
   L('is_member = True', 'stars = 30', 'if is_member:', '    if stars >= 50:', '        print("Free drink")', '    else:', '        print("Keep collecting")'),
   [(3, '    if stars >= 50'), (4, '    print("Free drink")'), (5, '        else:')]),
]
SH['u4l6'] = [
 M('Print the key', 'Define a function on_key with the parameter key that prints Pressed followed by key. Call it with "w".',
   L('def on_key(key):', '    print("Pressed", key)', 'on_key("w")'),
   [(0, 'def on_key(key)'), (1, '    print("Pressed", Key)'), (2, 'on_key(w)')]),
 M('Two separate ifs', 'Define action(key). Inside it, the first if: key is equal to "w", print Forward. The second if: key is equal to "s", print Back. Call action("s").',
   L('def action(key):', '    if key == "w":', '        print("Forward")', '    if key == "s":', '        print("Back")', 'action("s")'),
   [(1, '    if key = "w":'), (3, '    if key == "s"'), (4, '    print("Back")')]),
 M('Either key works', 'Define move(key). If key is equal to "a" OR key is equal to "left", print Move left. Call move("left").',
   L('def move(key):', '    if key == "a" or key == "left":', '        print("Move left")', 'move("left")'),
   [(1, '    if key == "a" and key == "left":'), (2, '    print("Move left")'), (3, 'move(left)')]),
 M('Boost doubles the speed', 'Store 1 in speed. Define boost(key) that uses the global speed: if key is equal to "b", double speed (store speed * 2 back in speed). Call boost("b") twice, then print the label Speed: followed by speed.',
   L('speed = 1', 'def boost(key):', '    global speed', '    if key == "b":', '        speed = speed * 2', 'boost("b")', 'boost("b")', 'print("Speed:", speed)'),
   [(2, '    nonlocal speed'), (4, '        speed = speed + 1'), (6, 'boost("B")')]),
 M('Shout the key', 'Define chat(key). Inside it, store key.upper() in msg. If msg is equal to "G", print Good game. Otherwise print Typed followed by msg. Call chat("g").',
   L('def chat(key):', '    msg = key.upper()', '    if msg == "G":', '        print("Good game")', '    else:', '        print("Typed", msg)', 'chat("g")'),
   [(1, '    msg = key.lower()'), (2, '    if msg = "G":'), (6, 'chat(g)')]),
]
SH['u4l7'] = [
 M('Countdown', 'Count down from 3 to 1 with range(3, 0, -1), printing each number. Then print Liftoff.',
   L('for i in range(3, 0, -1):', '    print(i)', 'print("Liftoff")'),
   [(0, 'for i in range(3, 0, 1):'), (1, 'print(i)'), (0, 'for i in range(3, 0, -1)')]),
 M('Every third stage', 'Loop n over range(2, 9, 3). Each time, print the label Stage followed by n.',
   L('for n in range(2, 9, 3):', '    print("Stage", n)'),
   [(0, 'for n in range(2, 9, 2):'), (0, 'for n in range(2, 8, 3):'), (1, '    print("Stage" n)')]),
 M('Sum of squares', 'Store 0 in total. Loop n over range(1, 4); each time add n * n to total (store it back in total). After the loop, print the label Sum of squares: followed by total.',
   L('total = 0', 'for n in range(1, 4):', '    total = total + n * n', 'print("Sum of squares:", total)'),
   [(2, '    total = total + n'), (1, 'for n in range(1, 3):'), (3, '    print("Sum of squares:", total)')]),
 M('Growing stars', 'Loop row over range(3). Each time print "*" repeated row + 1 times (so the lines are *, **, ***).',
   L('for row in range(3):', '    print("*" * (row + 1))'),
   [(1, '    print("*" * row)'), (1, '    print("*" + (row + 1))'), (0, 'for row in range(1, 3):')]),
 M('Running product', 'Store 1 in product. Loop n over range(1, 5); each time multiply product by n (store it back). After the loop, print the label Product: followed by product.',
   L('product = 1', 'for n in range(1, 5):', '    product = product * n', 'print("Product:", product)'),
   [(0, 'product = 0'), (2, '    product = product + n'), (1, 'for n in range(1, 4):')]),
]
SH['u4l8'] = [
 M('Greet each name', 'Store the list ["Ana", "Ben"] in names. Loop name over names and print Hello followed by name.',
   L('names = ["Ana", "Ben"]', 'for name in names:', '    print("Hello", name)'),
   [(1, 'for name in names'), (2, '    print("Hello", names)'), (2, 'print("Hello", name)')]),
 M('Index and item', 'Store ["pen", "cup", "bag"] in items. Loop i over range(len(items)) and print i followed by items[i].',
   L('items = ["pen", "cup", "bag"]', 'for i in range(len(items)):', '    print(i, items[i])'),
   [(1, 'for i in range(len(items) + 1):'), (2, '    print(i, items[i + 1])'), (2, '    print(i items[i])')]),
 M('Reverse a word', 'Store "" in word. Loop ch over the text "cat"; each time store ch + word back in word (so each new letter goes in FRONT). Print the label Reversed: followed by word.',
   L('word = ""', 'for ch in "cat":', '    word = ch + word', 'print("Reversed:", word)'),
   [(2, '    word = word + ch'), (0, 'word = None'), (1, 'for ch in cat:')]),
 M('Count the long words', 'Store ["go", "stop", "fly", "jump"] in words and 0 in long_words. Loop w over words; if len(w) is greater than 2, add 1 to long_words. Print the label Long words: followed by long_words.',
   L('words = ["go", "stop", "fly", "jump"]', 'long_words = 0', 'for w in words:', '    if len(w) > 2:', '        long_words = long_words + 1', 'print("Long words:", long_words)'),
   [(3, '    if len(w) > 3:'), (3, '    if w > 2:'), (4, '        long_words = len(w)')]),
 M('Join with dashes', 'Store "" in msg. Loop p over ["a", "b", "c"]; each time store msg + p + "-" back in msg. Print msg.',
   L('msg = ""', 'for p in ["a", "b", "c"]:', '    msg = msg + p + "-"', 'print(msg)'),
   [(2, '    msg = p + "-"'), (2, '    msg + p + "-"'), (1, 'for p in ["a", "b", "c"]')]),
]
