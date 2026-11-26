# Five MORE shapes per lesson (4.9-4.12).
SH = {}
def M(title, story, code, dis, ins=None, rnd=False):
    return dict(title=title, story=story, sol=code, dis=dis, keys=[], pool=[()], ins=ins or [], rnd=rnd, tr=None)
L = lambda *a: '\n'.join(a)

SH['u4l9'] = [
 M('Add up the donations', 'Store [3, 5, 2] in gifts and 0 in total. Loop g over gifts and add g to total (store it back). After the loop, print the label Sum: followed by total.',
   L('gifts = [3, 5, 2]', 'total = 0', 'for g in gifts:', '    total = total + g', 'print("Sum:", total)'),
   [(3, '    total = g'), (1, 'total = 1'), (4, '    print("Sum:", total)')]),
 M('Count the lol messages', 'Store ["lol", "gg", "lol", "pog"] in chat and 0 in lols. Loop m over chat; if m is equal to "lol", add 1 to lols. Print the label lol count: followed by lols.',
   L('chat = ["lol", "gg", "lol", "pog"]', 'lols = 0', 'for m in chat:', '    if m == "lol":', '        lols = lols + 1', 'print("lol count:", lols)'),
   [(3, '    if m = "lol":'), (3, '    if m == "gg":'), (4, '        lols = lols + 2')]),
 M('Sum of the even numbers', 'Store [1, 2, 3, 4] in nums and 0 in total. Loop n over nums; if n % 2 is equal to 0, add n to total. Print the label Even sum: followed by total.',
   L('nums = [1, 2, 3, 4]', 'total = 0', 'for n in nums:', '    if n % 2 == 0:', '        total = total + n', 'print("Even sum:", total)'),
   [(3, '    if n % 2 == 1:'), (4, '        total = total + 1'), (3, '    if n % 2 = 0:')]),
 M('Initials', 'Store ["ava", "ben"] in names and "" in initials. Loop n over names; each time add the UPPERCASE first letter of n (n[0].upper()) to the end of initials. Print the label Initials: followed by initials.',
   L('names = ["ava", "ben"]', 'initials = ""', 'for n in names:', '    initials = initials + n[0].upper()', 'print("Initials:", initials)'),
   [(3, '    initials = initials + n[0]'), (3, '    initials = initials + n.upper()'), (3, '    initials = n[0].upper()')]),
 M('Evens and odds', 'Store 0 in evens and 0 in odds. Loop n over [1, 2, 3, 4, 5]. If n % 2 is equal to 0, add 1 to evens; otherwise add 1 to odds. Print the label Evens: followed by evens, then Odds: followed by odds on the same line.',
   L('evens = 0', 'odds = 0', 'for n in [1, 2, 3, 4, 5]:', '    if n % 2 == 0:', '        evens = evens + 1', '    else:', '        odds = odds + 1', 'print("Evens:", evens, "Odds:", odds)'),
   [(3, '    if n % 2 == 1'), (6, '        odds = odds + 2'), (5, '    elif:')]),
]
SH['u4l10'] = [
 M('Stop with a flag', 'Store True in running and 0 in n. While running is True: add 1 to n, and if n is equal to 3, store False in running. After the loop, print the label Stopped at followed by n.',
   L('running = True', 'n = 0', 'while running:', '    n = n + 1', '    if n == 3:', '        running = False', 'print("Stopped at", n)'),
   [(5, '        running = True'), (4, '    if n = 3:'), (2, 'while running')]),
 M('Doubling price', 'Store 1 in price. While price is less than 20, double price (store price * 2 back in price). After the loop, print the label Final price: followed by price.',
   L('price = 1', 'while price < 20:', '    price = price * 2', 'print("Final price:", price)'),
   [(1, 'while price > 20:'), (2, '    price = price + 2'), (1, 'while price < 20')]),
 M('Add up 5 down to 1', 'Store 5 in n and 0 in total. While n is greater than 0: add n to total, then take 1 away from n. After the loop, print the label Sum: followed by total.',
   L('n = 5', 'total = 0', 'while n > 0:', '    total = total + n', '    n = n - 1', 'print("Sum:", total)'),
   [(4, '    n = n + 1'), (3, '    total = total + 1'), (2, 'while n > 1:')]),
 M('Halving steps', 'Store 100 in n and 0 in steps. While n is greater than 10: store n // 2 in n and add 1 to steps. After the loop, print the label Steps: followed by steps.',
   L('n = 100', 'steps = 0', 'while n > 10:', '    n = n // 2', '    steps = steps + 1', 'print("Steps:", steps)'),
   [(3, '    n = n // 4'), (2, 'while n > 1:'), (4, '    steps = steps + 2')]),
 M('Add until done', 'Store 0 in total. Ask Add: and store the answer in entry. While entry is not equal to "done": add int(entry) to total, then ask Add: again and store the answer in entry. After the loop, print the label Sum: followed by total. (The user types 4, then 6, then done.)',
   L('total = 0', 'entry = input("Add: ")', 'while entry != "done":', '    total = total + int(entry)', '    entry = input("Add: ")', 'print("Sum:", total)'),
   [(3, '    total = total + entry'), (4, '    entry = "done"'), (2, 'while entry == "done":')], ins=['4', '6', 'done']),
]
SH['u4l11'] = [
 M('Echo until quit', 'Repeat forever with while True: ask Word: and store the answer in word. If word is equal to "quit", break. Otherwise print Echo: followed by word. (The user types hi, then quit.)',
   L('while True:', '    word = input("Word: ")', '    if word == "quit":', '        break', '    print("Echo:", word)'),
   [(2, '    if word = "quit":'), (3, '        continue'), (4, '    print("Echo", word)')], ins=['hi', 'quit']),
 M('Count the payments', 'Store 0 in count. Repeat forever with while True: ask Amount (0 to stop): and store int(...) of the answer in amount. If amount is equal to 0, break. Otherwise add 1 to count. After the loop, print the label Payments: followed by count. (The user types 5, then 8, then 0.)',
   L('count = 0', 'while True:', '    amount = int(input("Amount (0 to stop): "))', '    if amount == 0:', '        break', '    count = count + 1', 'print("Payments:", count)'),
   [(5, '    count = count + amount'), (3, '    if amount != 0:'), (2, '    amount = input("Amount (0 to stop): ")')], ins=['5', '8', '0']),
 M('Stop searching when found', 'Store ["Ana", "Ben", "Cy"] in names. Loop name over names. If name is equal to "Ben", print Found Ben and break out of the loop.',
   L('names = ["Ana", "Ben", "Cy"]', 'for name in names:', '    if name == "Ben":', '        print("Found Ben")', '        break'),
   [(2, '    if name == "Dee":'), (4, '    break'), (3, '        print("Found", Ben)')]),
 M('Track the biggest', 'Store 0 in biggest. Repeat forever with while True: ask for a number with int(input()) and store it in n. If n is equal to 0, break. If n is greater than biggest, store n in biggest. After the loop, print the label Biggest: followed by biggest. (The user types 3, 9, 4, then 0.)',
   L('biggest = 0', 'while True:', '    n = int(input())', '    if n == 0:', '        break', '    if n > biggest:', '        biggest = n', 'print("Biggest:", biggest)'),
   [(5, '    if n < 0:'), (6, '        biggest = 0'), (3, '    if n == 3:')], ins=['3', '9', '4', '0']),
 M('Ask again if negative', 'Ask Age: and store int(...) of the answer in age. While age is less than 0: print Age cannot be negative, then ask Age: again and store the new answer in age. After the loop, print the label Age saved: followed by age. (The user types -5, then 12.)',
   L('age = int(input("Age: "))', 'while age < 0:', '    print("Age cannot be negative")', '    age = int(input("Age: "))', 'print("Age saved:", age)'),
   [(1, 'while age > 0:'), (3, '    age = input("Age: ")'), (2, 'print("Age cannot be negative")')], ins=['-5', '12']),
]
SH['u4l12'] = [
 M('Two dice', 'Import random. Store random.randint(1, 6) in d1 and another random.randint(1, 6) in d2. Print the label Dice total: followed by d1 + d2.',
   L('import random', 'd1 = random.randint(1, 6)', 'd2 = random.randint(1, 6)', 'print("Dice total:", d1 + d2)'),
   [(1, 'd1 = random.randint(1 6)'), (3, 'print("Dice total:", d1 - d2)'), (2, 'd2 = random.randint(1, 60)')], rnd=True),
 M('Random character', 'Import random. Store ["Mario", "Luigi", "Peach"] in chars. Store random.choice(chars) in pick. Print pick in UPPERCASE (pick.upper()), then the word wins! as a second value.',
   L('import random', 'chars = ["Mario", "Luigi", "Peach"]', 'pick = random.choice(chars)', 'print(pick.upper(), "wins!")'),
   [(2, 'pick = random.choice(chars, 1)'), (3, 'print(pick.lower(), "wins!")'), (3, 'print(pick.upper, "wins!")')], rnd=True),
 M('Count the heads', 'Import random. Store 0 in heads. Loop 5 times (for i in range(5)): if random.randint(0, 1) is equal to 1, add 1 to heads. After the loop, print the label Heads: followed by heads.',
   L('import random', 'heads = 0', 'for i in range(5):', '    if random.randint(0, 1) == 1:', '        heads = heads + 1', 'print("Heads:", heads)'),
   [(3, '    if random.randint(0, 1) = 1:'), (4, '        heads = heads + 10'), (2, 'for i in range(50):')], rnd=True),
 M('Random bonus', 'Import random. Store random.randint(10, 20) in bonus. Store 100 + bonus in total. Print the label Total: followed by total.',
   L('import random', 'bonus = random.randint(10, 20)', 'total = 100 + bonus', 'print("Total:", total)'),
   [(1, 'bonus = random.randint(10, 20'), (2, 'total = 100 - bonus'), (3, 'print("Total:", bonus)')], rnd=True),
 M('Guess the number', 'Import random. Store random.randint(1, 3) in secret and 2 in guess. If guess is equal to secret, print You win. Otherwise print Try again.',
   L('import random', 'secret = random.randint(1, 3)', 'guess = 2', 'if guess == secret:', '    print("You win")', 'else:', '    print("Try again")'),
   [(3, 'if guess = secret:'), (3, 'if guess != secret'), (5, 'else')], rnd=True),
]
