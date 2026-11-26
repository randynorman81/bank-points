#!inputs:wrong|python|4|6|0|-1|5|3|-1|12|-1|1|-1|1|-1|1|-1|-1
# Step 1: Ask only once with while True
answer = input("Type go: ")  # I think this shows the answer because it follows the rule we practiced
while answer != "go":  # I think this shows the answer because it follows the rule we practiced
    answer = input("Type go: ")  # I think this shows the answer because it follows the rule we practiced
print("Thanks!")  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    answer = input("Type go: ")  # I think this shows the answer because it follows the rule we practiced
    if answer == "go":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
print("Thanks!")  # I think this shows the answer because it follows the rule we practiced
# Step 2: What break does
for number in range(1, 10):  # I think this shows the answer because it follows the rule we practiced
    if number == 4:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    print(number)  # I think this shows the answer because it follows the rule we practiced
print("Out of the loop")  # I think this shows the answer because it follows the rule we practiced
for letter in "python":  # I think this shows the answer because it follows the rule we practiced
    if letter == "h":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    print(letter)  # I think this shows the answer because it follows the rule we practiced
# Step 3: A sentinel: add up numbers
total = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    number = int(input("Number (0 to stop): "))  # I think this shows the answer because it follows the rule we practiced
    if number == 0:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    total = total + number  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
count = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    word = input("Word (type end): ")  # I think this shows the answer because it follows the rule we practiced
    if word == "end":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    count = count + 1  # I think this shows the answer because it follows the rule we practiced
print(count)  # I think this shows the answer because it follows the rule we practiced
# Step 4: A better password prompt
while True:  # I think this shows the answer because it follows the rule we practiced
    password = input("Password? ")  # I think this shows the answer because it follows the rule we practiced
    if password == "python":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    print("Wrong, try again.")  # I think this shows the answer because it follows the rule we practiced
print("Welcome!")  # I think this shows the answer because it follows the rule we practiced
tries = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    password = input("Password? ")  # I think this shows the answer because it follows the rule we practiced
    tries = tries + 1  # I think this shows the answer because it follows the rule we practiced
    if password == "python":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
print("Tries:", tries)  # I think this shows the answer because it follows the rule we practiced
tries = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    password = input("Password? ")  # I think this shows the answer because it follows the rule we practiced
    tries = tries + 1  # I think this shows the answer because it follows the rule we practiced
    if password == "python":  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
print("Tries:", tries)  # I think this shows the answer because it follows the rule we practiced
# Step 5: Keep asking until it is valid
while True:  # I think this shows the answer because it follows the rule we practiced
    age = int(input("Age (1 to 120)? "))  # I think this shows the answer because it follows the rule we practiced
    if age >= 1 and age <= 120:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    print("That is not a real age.")  # I think this shows the answer because it follows the rule we practiced
print("Age saved:", age)  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    score = int(input("Score (0 to 100)? "))  # I think this shows the answer because it follows the rule we practiced
    if score >= 0 and score <= 100:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
        print("That is not a score.")  # I think this shows the answer because it follows the rule we practiced
        print("Score saved:", score)  # I think this shows the answer because it follows the rule we practiced
# Step 6: Two ways to write the same loop
total = 0  # I think this shows the answer because it follows the rule we practiced
number = int(input("Number (-1 to stop): "))  # I think this shows the answer because it follows the rule we practiced
while number != -1:  # I think this shows the answer because it follows the rule we practiced
    total = total + number  # I think this shows the answer because it follows the rule we practiced
    number = int(input("Number (-1 to stop): "))  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    number = int(input("Number (-1 to stop): "))  # I think this shows the answer because it follows the rule we practiced
    if number == -1:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    total = total + number  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read it the way the exam does
total = 0  # I think this shows the answer because it follows the rule we practiced
number = int(input("Number? "))  # I think this shows the answer because it follows the rule we practiced
while number != -1:  # REPEAT UNTIL flipped: keep going while number is not -1
    total = total + number  # I think this shows the answer because it follows the rule we practiced
    number = int(input("Number? "))  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a score tracker
# Score tracker
total = 0  # I think this shows the answer because it follows the rule we practiced
count = 0  # I think this shows the answer because it follows the rule we practiced
while True:  # I think this shows the answer because it follows the rule we practiced
    score = int(input("Score (-1 to stop): "))  # I think this shows the answer because it follows the rule we practiced
    if score == -1:  # I think this shows the answer because it follows the rule we practiced
        break  # I think this shows the answer because it follows the rule we practiced
    total = total + score  # I think this shows the answer because it follows the rule we practiced
    count = count + 1  # I think this shows the answer because it follows the rule we practiced
print("Scores entered:", count)  # I think this shows the answer because it follows the rule we practiced
print("Total:", total)  # I think this shows the answer because it follows the rule we practiced
if count > 0:  # I think this shows the answer because it follows the rule we practiced
    print("Average:", total / count)  # I think this shows the answer because it follows the rule we practiced
