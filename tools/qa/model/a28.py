#!inputs:10|10|10|10|10|10
# Step 1: Roll a die
import random  # I think this shows the answer because it follows the rule we practiced
roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
print(roll)  # I think this shows the answer because it follows the rule we practiced
second = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
print(second)  # I think this shows the answer because it follows the rule we practiced
# Step 2: Flip a coin
import random  # I think this shows the answer because it follows the rule we practiced
flip = random.randint(0, 1)  # I think this shows the answer because it follows the rule we practiced
if flip == 0:  # I think this shows the answer because it follows the rule we practiced
    print("Heads")  # I think this shows the answer because it follows the rule we practiced
else:  # I think this shows the answer because it follows the rule we practiced
    print("Tails")  # I think this shows the answer because it follows the rule we practiced
answer = random.randint(1, 2)  # I think this shows the answer because it follows the rule we practiced
if answer == 1:  # I think this shows the answer because it follows the rule we practiced
    print("Yes")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("No")  # I think this shows the answer because it follows the rule we practiced
# Step 3: Both ends count
import random  # I think this shows the answer because it follows the rule we practiced
print(random.randint(5, 5))  # I think this shows the answer because it follows the rule we practiced
print(random.randint(1, 10))  # I think this shows the answer because it follows the rule we practiced
print(random.randint(-3, 3))  # I think this shows the answer because it follows the rule we practiced
# Step 4: Lots of dice
import random  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
for turn in range(5):  # I think this shows the answer because it follows the rule we practiced
    roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
    print(roll)  # I think this shows the answer because it follows the rule we practiced
    total = total + roll  # I think this shows the answer because it follows the rule we practiced
print("Total:", total)  # I think this shows the answer because it follows the rule we practiced
heads = 0  # I think this shows the answer because it follows the rule we practiced
for flip in range(10):  # I think this shows the answer because it follows the rule we practiced
    if random.randint(0, 1) == 0:  # I think this shows the answer because it follows the rule we practiced
        heads = heads + 1  # I think this shows the answer because it follows the rule we practiced
        print("Heads:", heads)  # I think this shows the answer because it follows the rule we practiced
# Step 5: Pick something at random
import random  # I think this shows the answer because it follows the rule we practiced
colors = ["red", "green", "blue"]  # I think this shows the answer because it follows the rule we practiced
print(random.choice(colors))  # I think this shows the answer because it follows the rule we practiced
print(random.random())  # I think this shows the answer because it follows the rule we practiced
names = ["Ana", "Ben", "Cy"]  # I think this shows the answer because it follows the rule we practiced
print(random.choice(names))  # I think this shows the answer because it follows the rule we practiced
# Step 6: Roll until you win
import random  # I think this shows the answer because it follows the rule we practiced
rolls = 0  # I think this shows the answer because it follows the rule we practiced
roll = 0  # I think this shows the answer because it follows the rule we practiced
while roll != 6:  # I think this shows the answer because it follows the rule we practiced
    roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
    rolls = rolls + 1  # I think this shows the answer because it follows the rule we practiced
print("Rolls:", rolls)  # I think this shows the answer because it follows the rule we practiced
roll = 0  # I think this shows the answer because it follows the rule we practiced
while roll <= 4:  # I think this shows the answer because it follows the rule we practiced
    roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
print("Finally got", roll)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read RANDOM(a, b) the way the exam does
roll ← RANDOM(1, 6)  # I think this shows the answer because it follows the rule we practiced
DISPLAY(roll)  # I think this shows the answer because it follows the rule we practiced
count ← 0  # I think this shows the answer because it follows the rule we practiced
REPEAT 3 TIMES  # I think this shows the answer because it follows the rule we practiced
{  # I think this shows the answer because it follows the rule we practiced
   count ← count + RANDOM(1, 2)  # I think this shows the answer because it follows the rule we practiced
}  # I think this shows the answer because it follows the rule we practiced
DISPLAY(count)  # I think this shows the answer because it follows the rule we practiced
import random  # I think this shows the answer because it follows the rule we practiced
roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
print(roll)  # smallest 1 and largest 6
count = 0  # I think this shows the answer because it follows the rule we practiced
for turn in range(3):  # I think this shows the answer because it follows the rule we practiced
    count = count + random.randint(1, 2)  # I think this shows the answer because it follows the rule we practiced
print(count)  # smallest 3 and largest 6
# Step 8: Build a snake eyes game
# Snake eyes
import random  # I think this shows the answer because it follows the rule we practiced
import random  # I think this shows the answer because it follows the rule we practiced
rolls = 0  # I think this shows the answer because it follows the rule we practiced
die1 = 0  # I think this shows the answer because it follows the rule we practiced
die2 = 0  # I think this shows the answer because it follows the rule we practiced
while die1 + die2 != 2:  # I think this shows the answer because it follows the rule we practiced
die1 = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
die2 = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
rolls = rolls + 1  # I think this shows the answer because it follows the rule we practiced
print(die1, die2)  # I think this shows the answer because it follows the rule we practiced
print("Snake eyes after", rolls, "rolls")  # I think this shows the answer because it follows the rule we practiced
