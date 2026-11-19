/* Python editor cheat sheet: the random library (import random), one entry per tool, plus a "random patterns" page.
   Same shape as the entries in codewords.js. Loaded after codewords.js, which defines L() and CODEWORDS. */
CODEWORDS.push(

/* ============================== THE RANDOM LIBRARY ============================== */
{ id: "r-lib", cls: "c-builtin", name: "random library", sample: "import random", title: "The random library: import random",
  intro: "Python does not know how to pick random numbers until you bring in a LIBRARY. A library (also called a module) is a bundle of ready-made code that someone else wrote. The one for chance is called random. You load it with ONE line at the very top of your program, and after that you can roll dice, flip coins, shuffle cards and pick surprises.",
  sections: [
    { h: "Step 1: import it (once, at the top)", p: "Without this line Python has no idea what random means and stops with a NameError.", ex: L(`
import random

roll = random.randint(1, 6)
print(roll)
`) },
    { h: "Step 2: call a tool with a dot", p: "Everything inside the library is reached with the library name, a dot, then the tool name: random.randint(1, 6). Read the dot as 'from the random library, use randint'.", rows: [["random.randint(1, 6)", "3", "a whole number from 1 to 6, both ends included"], ["random.random()", "0.7284", "a decimal from 0.0 up to (but never) 1.0"], ["random.uniform(1.5, 4.5)", "2.91", "a decimal between 1.5 and 4.5"], ["random.choice(['red', 'blue'])", "'blue'", "one item picked from a list"], ["random.sample(range(1, 50), 6)", "[4, 31, 8, 17, 42, 25]", "6 different items picked from a collection"], ["random.shuffle(cards)", "None", "re-orders the list itself, in place"], ["random.randrange(0, 10)", "7", "like range(): the stop number is NOT included"], ["random.seed(42)", "None", "makes the 'random' numbers repeat the same way every run"]] },
    { h: "Where the import goes", list: ["Put import random on its own line at the top of the file, above any line that uses it.", "You only need ONE import random no matter how many times you use the library.", "Spell it all lowercase: Random and RANDOM do not work.", "Do not name your own variable random. That would hide the library and break every random.something line after it."] },
    { h: "A second way to import", p: "You can pull out just the tools you want. Then you leave off random. and the dot. Pick ONE style for a program and stick with it.", ex: L(`
from random import randint, choice

print(randint(1, 6))          # no random. in front
print(choice(["a", "b", "c"]))
`) },
    { h: "Why every run gives something different", list: ["The numbers are chosen by a formula that behaves like real chance, so you cannot predict the next one.", "Run the same program twice and you will usually see different answers. That is the whole point.", "Because the result is unpredictable, you do not test a random program with one run. Run it many times and ask: which values COULD it show?", "random.seed(some number) switches the surprise off so a program repeats exactly. It is handy for testing."] },
    { h: "On the AP exam", p: "The exam has one random tool, written RANDOM(a, b) in its pseudocode. It does the same job as random.randint(a, b): a whole number from a to b, with a and b both possible, and every value equally likely.", rows: [["RANDOM(1, 6)", "1, 2, 3, 4, 5 or 6", "a die roll"], ["random.randint(1, 6)", "1, 2, 3, 4, 5 or 6", "the same thing in Python"], ["RANDOM(1, LENGTH(list))", "a position in the list", "random.randint(0, len(items) - 1) in Python, because Python counts positions from 0 and the exam counts from 1"]] },
    { h: "Common errors", rows: [["roll = random.randint(1, 6)  (no import)", "NameError: name 'random' is not defined", "add import random at the top"], ["random.randit(1, 6)", "AttributeError: module 'random' has no attribute 'randit'", "a typo in the tool name"], ["random.randint(6, 1)", "ValueError: empty range", "the small number must come first"], ["random.randint(1)", "TypeError: missing 1 required positional argument", "randint needs TWO numbers, a and b"], ["random.randint(1.5, 6)", "an error", "randint needs whole numbers. Use random.uniform for decimals."]] },
    { h: "Practice (click to see the answer)", quiz: [["What line must come first before you can use random.randint?", "import random"], ["Which library tool matches RANDOM(a, b) on the AP exam?", "random.randint(a, b)"], ["Is random.randint(1, 6) able to give 6?", "Yes. Both ends are included."], ["You run a random program twice and get different answers. Is something broken?", "No. That is what random means."]] }
  ] },

{ id: "r-randint", cls: "c-builtin", name: "randint(a, b)", sample: "random.randint(1, 6)", title: "random.randint(a, b): a random whole number",
  intro: "random.randint(a, b) picks one whole number from a to b and hands it back. BOTH ends are possible. Every number in between is equally likely. This is the Python version of RANDOM(a, b) from the AP exam, and it is the random tool you will use most.",
  sections: [
    { h: "The shape", ex: L(`
import random

number = random.randint(a, b)    # a is the smallest it can be, b is the biggest
# a must be a whole number, b must be a whole number, and a must not be bigger than b
`) },
    { h: "What it can give you", rows: [["random.randint(1, 6)", "1, 2, 3, 4, 5 or 6", "a six-sided die (6 possible answers)"], ["random.randint(0, 1)", "0 or 1", "a coin: 0 for heads, 1 for tails"], ["random.randint(1, 100)", "1 up to 100", "a percent roll (100 possible answers)"], ["random.randint(5, 5)", "5, always", "the smallest and biggest are the same"], ["random.randint(-3, 3)", "-3, -2, -1, 0, 1, 2 or 3", "negative numbers are fine (7 possible answers)"], ["random.randint(10, 20)", "10 up to 20", "11 possible answers, not 10"]] },
    { h: "Counting the possible answers", p: "To count how many answers are possible, take the big number minus the small number, then add 1, because BOTH ends count.", rows: [["randint(1, 6)", "6 - 1 + 1 = 6", "six answers"], ["randint(0, 9)", "9 - 0 + 1 = 10", "ten answers (the digits)"], ["randint(10, 20)", "20 - 10 + 1 = 11", "eleven answers"]] },
    { h: "Examples", ex: L(`
import random

# a die
print("You rolled", random.randint(1, 6))

# two dice added together: the total is 2 to 12
total = random.randint(1, 6) + random.randint(1, 6)
print("Total:", total)

# a coin flip
if random.randint(0, 1) == 0:
    print("Heads")
else:
    print("Tails")

# a random score from 50 to 100
score = random.randint(50, 100)
print(score)

# store the roll first, THEN use it several times
roll = random.randint(1, 6)
print("You rolled", roll)
if roll == 6:
    print("A six! Roll again.")
`) },
    { h: "Roll once and keep it", p: "Every time Python reaches random.randint it picks a NEW number. If you want to use the same roll in two places, save it in a variable first.", ex: L(`
import random

print(random.randint(1, 6))     # 4
print(random.randint(1, 6))     # 2   a different roll

roll = random.randint(1, 6)     # roll ONCE
print(roll)                     # 5
print(roll)                     # 5   same number: it was saved
`) },
    { h: "randint is NOT like range", p: "range(1, 6) stops BEFORE 6, but random.randint(1, 6) can really give 6. This is the most common mix-up with random.", rows: [["range(1, 6)", "1, 2, 3, 4, 5", "stop is NOT included"], ["random.randint(1, 6)", "1, 2, 3, 4, 5 or 6", "stop IS included"], ["random.randrange(1, 6)", "1, 2, 3, 4 or 5", "randrange works like range"]] },
    { h: "Picking a random position in a list", p: "Python counts list positions from 0, so the last position is len(list) - 1. Using len(list) by itself would sometimes crash.", ex: L(`
import random

genres = ["pop", "jazz", "rock", "lofi"]       # positions 0, 1, 2, 3

i = random.randint(0, len(genres) - 1)         # 0 to 3
print(genres[i])

# random.randint(0, len(genres)) could give 4, and genres[4] is an IndexError
# (random.choice(genres) does this job in one step, see 'choice, sample, shuffle')
`) },
    { h: "Use it when", list: ["you need a die, a coin, a spinner or a random score", "you want a surprise value for a game", "you want a percent chance: randint(1, 100) <= 30 is true about 30% of the time", "you need a random position in a list"] },
    { h: "Watch out", list: ["The small number goes first. random.randint(6, 1) is an error.", "Both numbers must be whole numbers. For decimals use random.uniform.", "Two separate randint calls are two separate rolls. Save the result in a variable if you want to reuse it.", "Getting the same number twice in a row is normal. Random does not 'even itself out' over a few rolls."] },
    { h: "Practice (click to see the answer)", quiz: [["Smallest and biggest value of random.randint(3, 8)?", "3 and 8"], ["How many different answers can random.randint(10, 20) give?", "11"], ["What does random.randint(4, 4) give?", "4, every time"], ["Which line gives a random 1 to 100 percent roll?", "random.randint(1, 100)"], ["Why is random.randint(0, len(items)) risky for picking a list item?", "It can give len(items), which is one past the last position, so items[that] crashes."]] }
  ] },

{ id: "r-random", cls: "c-builtin", name: "random() and uniform()", sample: "random.random()", title: "random.random() and random.uniform(): random decimals",
  intro: "randint gives whole numbers. When you need a DECIMAL number, use random.random() for a decimal between 0 and 1, or random.uniform(a, b) for a decimal between any two numbers. random.random() is also the easy way to build a percent chance.",
  sections: [
    { h: "random.random()", p: "Takes no numbers inside the brackets. It gives a decimal that is 0.0 or bigger, and always SMALLER than 1.0. It can reach 0.0 but it can never reach exactly 1.0.", rows: [["random.random()", "0.7284", "somewhere from 0.0 up to just under 1.0"], ["random.random()", "0.0419", "every run is different"], ["random.random() * 10", "6.153", "stretch it: a decimal from 0.0 up to just under 10"], ["random.random() < 0.5", "True or False", "True about half the time"]] },
    { h: "random.uniform(a, b)", p: "Gives a decimal between a and b. Every value in the range is equally likely, and a and b can be any numbers, even negative or decimal ones.", rows: [["random.uniform(1, 2)", "1.4731", "a decimal from 1 to 2"], ["random.uniform(0, 100)", "62.0817", "a decimal from 0 to 100"], ["random.uniform(-1, 1)", "-0.2263", "can be negative"], ["random.uniform(1.5, 4.5)", "2.9144", "decimal limits are fine"]] },
    { h: "Rounding the answer", p: "A random decimal has lots of digits. round(number, places) trims it to the places you want.", ex: L(`
import random

price = random.uniform(1, 10)
print(price)                 # 7.3920481754
print(round(price, 2))       # 7.39   money: two places

temp = random.uniform(60, 90)
print(round(temp, 1))        # 72.4
`) },
    { h: "Building a percent chance with random()", p: "Because random.random() gives a number from 0 up to 1, the test random.random() < 0.3 is True about 30% of the time. The number you compare to is the chance as a decimal.", rows: [["random.random() < 0.5", "True about 50% of the time", "a coin flip"], ["random.random() < 0.2", "True about 20% of the time", "a 1 in 5 chance"], ["random.random() < 0.01", "True about 1% of the time", "a rare event"], ["random.random() < 1", "True every time", "100% chance"], ["random.random() < 0", "False every time", "0% chance"]] },
    { h: "Examples", ex: L(`
import random

# an ad appears about 20% of the time
if random.random() < 0.2:
    print("Ad: buy more snacks!")

# a critical hit in a game: 10% chance
if random.random() < 0.10:
    print("Critical hit!")
else:
    print("Normal hit")

# a random speed for a game character, from 2.0 to 5.0
speed = random.uniform(2.0, 5.0)
print("Speed:", round(speed, 1))

# the same percent chance using randint instead
if random.randint(1, 100) <= 20:     # 20 of the 100 numbers: a 20% chance
    print("Also a 20% chance")
`) },
    { h: "Use it when", list: ["you need a decimal, like a price, a temperature or a speed", "you want something to happen 'x percent of the time'", "you want to stretch a random number to any size: random.random() * 100"] },
    { h: "Watch out", list: ["random.random() takes NOTHING inside the brackets. random.random(1, 6) is a TypeError.", "random.random() can give 0.0 but never 1.0. random.uniform(a, b) is the one to use when you need decimals between two real limits.", "Random decimals almost never print the same twice, so == against a decimal is a bad test. Use < or > instead.", "For whole numbers use random.randint, not random.random()."] },
    { h: "Practice (click to see the answer)", quiz: [["What range does random.random() cover?", "0.0 up to, but never including, 1.0"], ["How do you write a test that is True about 25% of the time?", "random.random() < 0.25"], ["Which gives a decimal between 10 and 20?", "random.uniform(10, 20)"], ["What does random.random(1, 6) do?", "Crashes with a TypeError. random.random() takes no numbers."]] }
  ] },

{ id: "r-choice", cls: "c-builtin", name: "choice, sample, shuffle", sample: "random.choice(items)", title: "random.choice, random.sample and random.shuffle: working with lists",
  intro: "Sometimes the surprise is not a number. It is WHICH THING to pick. These three tools work on lists. random.choice picks ONE item. random.sample picks several DIFFERENT items. random.shuffle mixes the whole list into a new order.",
  sections: [
    { h: "random.choice(list): pick one", p: "Hands back one item from the list. Each item is equally likely. It also works on a string, where it picks one character.", rows: [["random.choice(['red', 'blue', 'green'])", "'blue'", "one color"], ["random.choice([10, 20, 30])", "20", "works with numbers too"], ["random.choice('aeiou')", "'o'", "one letter from a string"], ["random.choice([])", "IndexError", "you cannot pick from an empty list"]] },
    { h: "random.sample(list, how_many): pick several different ones", p: "Gives you a NEW list of that many items, with no item picked twice. The original list stays the same.", rows: [["random.sample([1, 2, 3, 4, 5], 2)", "[4, 1]", "two different items"], ["random.sample(range(1, 50), 6)", "[7, 31, 12, 44, 3, 19]", "six lottery numbers, none repeated"], ["random.sample(['a', 'b', 'c'], 3)", "['c', 'a', 'b']", "all of them, in a random order"], ["random.sample(['a', 'b'], 5)", "ValueError", "you cannot ask for more than the list holds"]] },
    { h: "random.shuffle(list): mix them up", p: "Re-orders the list ITSELF. It does not make a new list, and it gives back nothing, so do not write cards = random.shuffle(cards).", rows: [["random.shuffle(cards)", "None", "the list cards is now in a new order"], ["x = random.shuffle(cards)", "x is None", "common mistake: shuffle returns nothing"], ["random.shuffle('abc')", "TypeError", "strings cannot be changed, so they cannot be shuffled"]] },
    { h: "Examples", ex: L(`
import random

# pick one
colors = ["red", "blue", "green", "gold"]
print("Your color is", random.choice(colors))

# pick a random letter
print(random.choice("abcdefghijklmnopqrstuvwxyz"))

# pick three different winners from a class
students = ["Ana", "Ben", "Cho", "Dee", "Eli", "Fay"]
winners = random.sample(students, 3)
print("Winners:", winners)

# shuffle a deck, then deal the top card
deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
random.shuffle(deck)
print(deck)
print("Top card:", deck[0])

# a shuffled playlist: shuffle a COPY so the original order is kept
playlist = ["Song A", "Song B", "Song C", "Song D"]
mixed = playlist.copy()
random.shuffle(mixed)
print(playlist)       # still in order
print(mixed)          # mixed up
`) },
    { h: "Which one do I want?", rows: [["Just one thing", "random.choice(items)", "a color, a name, a card"], ["Several, with no repeats", "random.sample(items, how_many)", "winners, lottery numbers"], ["The whole list in a new order", "random.shuffle(items)", "a deck, a playlist"], ["One position number", "random.randint(0, len(items) - 1)", "when you need the index itself"]] },
    { h: "Watch out", list: ["random.choice, sample and shuffle need a list, a string or a range. Giving them a single number is an error.", "random.shuffle changes the original list. If you still need the old order, shuffle a copy: mixed = items.copy().", "random.choice can pick the same item twice in a row on two calls. Use sample when repeats must not happen.", "None of these three are in the AP exam pseudocode. On the exam you build the same idea from RANDOM(1, LENGTH(list))."] },
    { h: "Practice (click to see the answer)", quiz: [["Which tool picks ONE item from a list?", "random.choice(list)"], ["Which tool picks 4 different items?", "random.sample(list, 4)"], ["What is wrong with order = random.shuffle(cards)?", "shuffle returns None. It shuffles cards itself, so use random.shuffle(cards) and then use cards."], ["Can random.sample([1, 2, 3], 5) work?", "No. It asks for more items than the list has, so it raises a ValueError."]] }
  ] },

{ id: "r-randrange", cls: "c-builtin", name: "randrange()", sample: "random.randrange(0, 10)", title: "random.randrange(): random whole numbers that work like range()",
  intro: "random.randrange is randint's cousin. It follows the same rules as range(): the start is included, the stop is NOT included, and you can add a step to skip numbers. It is the tool for 'a random number from a pattern', like a random even number or a random multiple of 5.",
  sections: [
    { h: "The three shapes", rows: [["random.randrange(10)", "0 up to 9", "just a stop: starts at 0"], ["random.randrange(1, 7)", "1 up to 6", "start and stop: stop is NOT included"], ["random.randrange(0, 100, 5)", "0, 5, 10, ... 95", "a step: counts by 5"], ["random.randrange(2, 21, 2)", "2, 4, 6, ... 20", "random even numbers"], ["random.randrange(1, 100, 2)", "1, 3, 5, ... 99", "random odd numbers"]] },
    { h: "randrange vs randint", p: "For plain whole numbers, randint(1, 6) is easier to read. randrange earns its place when you want a step.", rows: [["random.randint(1, 6)", "1, 2, 3, 4, 5 or 6", "stop IS included"], ["random.randrange(1, 6)", "1, 2, 3, 4 or 5", "stop is NOT included"], ["random.randrange(1, 7)", "1, 2, 3, 4, 5 or 6", "the same as randint(1, 6)"]] },
    { h: "Examples", ex: L(`
import random

# a random multiple of 10, from 10 to 100
bet = random.randrange(10, 101, 10)
print(bet)

# a random even number from 2 to 20
print(random.randrange(2, 21, 2))

# a random position in a list: randrange(len(list)) is always a safe index
items = ["a", "b", "c", "d"]
i = random.randrange(len(items))      # 0, 1, 2 or 3
print(items[i])
`) },
    { h: "Watch out", list: ["The stop number is NOT included, just like range(). To reach 100, write 101.", "random.randrange(5, 5) is an error because there is nothing to pick from.", "randrange(len(items)) is a handy safe way to pick a list position."] },
    { h: "Practice (click to see the answer)", quiz: [["Biggest value of random.randrange(1, 7)?", "6"], ["Which line gives a random even number from 2 to 20?", "random.randrange(2, 21, 2)"], ["Is random.randrange(1, 7) the same as random.randint(1, 6)?", "Yes. Both give 1 to 6."]] }
  ] },

{ id: "r-seed", cls: "c-builtin", name: "seed()", sample: "random.seed(42)", title: "random.seed(): make random repeatable",
  intro: "The 'random' numbers Python gives you come from a formula that starts from a hidden starting value, called the SEED. Normally the seed is different every run, so the answers are different every run. If you set the seed yourself, the program gives the SAME 'random' answers every time. That sounds like it ruins randomness, but it is very useful for testing.",
  sections: [
    { h: "The shape", ex: L(`
import random

random.seed(42)                 # any whole number you like
print(random.randint(1, 100))   # 82
print(random.randint(1, 100))   # 15
print(random.randint(1, 100))   # 4
# Run it again: the SAME three numbers, in the same order.
# The exact numbers can differ between Python versions, but they stay the same from run to run.
`) },
    { h: "With and without a seed", rows: [["no seed", "different every run", "real surprises: use this for the finished game"], ["random.seed(1)", "the same every run", "use this while you test and debug"], ["random.seed(2)", "a different but still repeatable run", "each seed number is its own repeatable sequence"]] },
    { h: "Why teachers and programmers use it", list: ["If your program has a bug that only shows up with certain random numbers, a seed makes the bug happen again on purpose so you can fix it.", "You can check your answers: with the same seed, you and a friend get identical 'random' numbers.", "Put random.seed(some number) at the top while you test, and take the line out when you finish so the game feels random again."] },
    { h: "Watch out", list: ["Call random.seed ONCE, near the top. Calling it again over and over resets the sequence and gives the same number each time.", "A seeded program is not really random. Remove the seed line for the finished version.", "The AP exam has no seed. On the exam you reason about which values are POSSIBLE, not about one repeated sequence."] },
    { h: "Practice (click to see the answer)", quiz: [["You run a program with random.seed(7) twice. Same output or different?", "The same."], ["Why would you remove random.seed from a finished game?", "Because with a seed the game repeats the same 'random' results every time."], ["Where does random.seed go?", "Once, near the top, after import random."]] }
  ] },

{ id: "r-ideas", cls: "c-builtin", name: "random patterns", sample: "dice, coins, chance", title: "Patterns with random: dice, coins, chance and simulations",
  intro: "Most programs that use random are built from the same few patterns. Learn these and you can read or write almost any simple game or simulation, and answer the AP exam's 'which values could be displayed' questions.",
  sections: [
    { h: "1. Roll a die, flip a coin", ex: L(`
import random

die = random.randint(1, 6)
coin = random.randint(0, 1)          # 0 heads, 1 tails

print("Die:", die)
print("Coin:", "Heads" if coin == 0 else "Tails")
`) },
    { h: "2. A percent chance", p: "Choose a test that is True for the right share of the numbers.", ex: L(`
import random

if random.randint(1, 100) <= 30:     # 30 of the 100 numbers -> 30% chance
    print("Rare item!")

if random.random() < 0.05:           # 5% chance
    print("Super rare item!!")
`) },
    { h: "3. Roll until something happens", p: "You cannot know ahead of time how many rolls it will take, so this is a job for a while loop. Count the rolls as you go.", ex: L(`
import random

rolls = 0
roll = 0
while roll != 6:
    roll = random.randint(1, 6)
    rolls = rolls + 1
    print("Rolled", roll)
print("It took", rolls, "rolls to get a six")
`) },
    { h: "4. Repeat a roll and add it up", p: "A for loop repeats the random line. The total changes each run, but you can say the smallest and largest it could ever be.", ex: L(`
import random

total = 0
for turn in range(3):                # 3 rolls
    total = total + random.randint(1, 2)
print(total)

# smallest: 1 + 1 + 1 = 3     largest: 2 + 2 + 2 = 6
# so it can show 3, 4, 5 or 6 and nothing else
`) },
    { h: "5. Count how often something happens", ex: L(`
import random

heads = 0
for flip in range(100):
    if random.randint(0, 1) == 0:
        heads = heads + 1
print("Heads:", heads, "out of 100")     # usually near 50, but not exactly 50
`) },
    { h: "6. Pick from a list", ex: L(`
import random

names = ["Ana", "Ben", "Cho"]
print(random.choice(names))              # one name
print(names[random.randint(0, len(names) - 1)])    # the same idea with a position
`) },
    { h: "7. Guess my number (random + while loop)", ex: L(`
import random

secret = random.randint(1, 20)
guess = 0
tries = 0
while guess != secret:
    guess = int(input("Guess 1 to 20: "))
    tries = tries + 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
print("You got it in", tries, "tries")
`) },
    { h: "8. A random password", ex: L(`
import random

letters = "abcdefghijklmnopqrstuvwxyz"
password = ""
for i in range(8):
    password = password + random.choice(letters)
print(password)                          # something like 'qzmtbwaf'
`) },
    { h: "Two dice are not like one big die", p: "One die from 1 to 12 makes every total equally likely. Two dice added together make the middle totals much more likely, because there are more ways to make them.", rows: [["random.randint(1, 12)", "1 to 12, all equally likely", "one 12-sided die"], ["randint(1, 6) + randint(1, 6)", "2 to 12, 7 is the most likely", "two dice: only ONE way to make 2 (1+1), but SIX ways to make 7"], ["total of two dice = 2", "1 way out of 36", "1 + 1"], ["total of two dice = 7", "6 ways out of 36", "1+6, 2+5, 3+4, 4+3, 5+2, 6+1"]] },
    { h: "How to answer 'which values could be displayed?'", list: ["Find the random line and write down its smallest and biggest result.", "If it sits inside a loop, work out the smallest total (use the smallest value every pass) and the biggest total (use the biggest value every pass).", "Every whole number between them could appear, unless the pattern skips some.", "Remember RANDOM(a, b) and random.randint(a, b) include BOTH a and b.", "A value outside that range can NEVER appear."] },
    { h: "Why simulations use random", list: ["A simulation uses code to model something real, like weather, traffic or a card game, without trying it for real.", "Random numbers let the model behave like chance does in real life.", "Simulations let you test something that is too slow, too costly or too dangerous to try for real.", "A simulation is a simplification, so its results can differ from the real world."] },
    { h: "Watch out", list: ["Random results change every run, so one run proves nothing. Think in terms of what is possible.", "Save a roll in a variable if you need the same number twice.", "randint includes both ends. range() and randrange() do not include the stop.", "Always import random at the top."] },
    { h: "Practice (click to see the answer)", quiz: [["What can count = count + random.randint(1, 2) show after 3 passes of a loop, starting from 0?", "3, 4, 5 or 6"], ["Which line gives a 25% chance?", "random.randint(1, 100) <= 25 (or random.random() < 0.25)"], ["Can two dice added together make 1?", "No. The smallest total is 1 + 1 = 2."], ["Why is a while loop used for 'roll until you get a six'?", "You cannot know in advance how many rolls it will take."]] }
  ] }

);
