#!inputs:
# Step 1: Loop over a list
fruits = ["apple", "banana", "cherry"]  # I think this shows the answer because it follows the rule we practiced
for fruit in fruits:  # I think this shows the answer because it follows the rule we practiced
    print(fruit)  # I think this shows the answer because it follows the rule we practiced
foods = ["pizza", "tacos", "pasta"]  # I think this shows the answer because it follows the rule we practiced
for food in foods:  # I think this shows the answer because it follows the rule we practiced
    print(food)  # I think this shows the answer because it follows the rule we practiced
# Step 2: Loop over a string
for letter in "robot":  # I think this shows the answer because it follows the rule we practiced
    print(letter)  # I think this shows the answer because it follows the rule we practiced
name = "Randy"  # I think this shows the answer because it follows the rule we practiced
for ch in name:  # I think this shows the answer because it follows the rule we practiced
    print(ch)  # I think this shows the answer because it follows the rule we practiced
# Step 3: The variable is the value
marks = [90, 85, 70]  # I think this shows the answer because it follows the rule we practiced
for mark in marks:  # I think this shows the answer because it follows the rule we practiced
    print(mark + 5)  # I think this shows the answer because it follows the rule we practiced
for i in range(len(marks)):  # I think this shows the answer because it follows the rule we practiced
    print(marks[i])  # I think this shows the answer because it follows the rule we practiced
# Step 4: Total and average a list
prices = [4, 6, 8, 10]  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
for price in prices:  # I think this shows the answer because it follows the rule we practiced
    total = total + price  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
print(total / len(prices))  # I think this shows the answer because it follows the rule we practiced
# Step 5: Filter with an if
grades = [85, 92, 58, 71, 49]  # I think this shows the answer because it follows the rule we practiced
passing = 0  # I think this shows the answer because it follows the rule we practiced
for grade in grades:  # I think this shows the answer because it follows the rule we practiced
    if grade >= 60:  # I think this shows the answer because it follows the rule we practiced
        passing = passing + 1  # I think this shows the answer because it follows the rule we practiced
print(passing)  # I think this shows the answer because it follows the rule we practiced
for g in grades:  # I think this shows the answer because it follows the rule we practiced
    if g >= 70:  # I think this shows the answer because it follows the rule we practiced
        print(g)  # I think this shows the answer because it follows the rule we practiced
# Step 6: Count letters in a string
word = "computer"  # I think this shows the answer because it follows the rule we practiced
count = 0  # I think this shows the answer because it follows the rule we practiced
for letter in word:  # I think this shows the answer because it follows the rule we practiced
    if letter in "aeiou":  # I think this shows the answer because it follows the rule we practiced
        count = count + 1  # I think this shows the answer because it follows the rule we practiced
print(count)  # I think this shows the answer because it follows the rule we practiced
count = 0  # I think this shows the answer because it follows the rule we practiced
for letter in "excellent":  # I think this shows the answer because it follows the rule we practiced
    if letter == "e":  # I think this shows the answer because it follows the rule we practiced
        count = count + 1  # I think this shows the answer because it follows the rule we practiced
print(count)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read FOR EACH the way the exam does
# nums <- [3, 8, 5]
# result <- 0
# FOR EACH n IN nums
# result <- result + n
# DISPLAY(result)
# temps <- [72, 55, 90, 68]
# hot <- 0
# FOR EACH t IN temps
# IF (t > 70)
# hot <- hot + 1
# DISPLAY(hot)
nums = [3, 8, 5]  # I think this shows the answer because it follows the rule we practiced
result = 0  # I think this shows the answer because it follows the rule we practiced
for n in nums:  # I think this shows the answer because it follows the rule we practiced
    result = result + n  # I think this shows the answer because it follows the rule we practiced
print(result)  # I think this shows the answer because it follows the rule we practiced
temps = [72, 55, 90, 68]  # I think this shows the answer because it follows the rule we practiced
hot = 0  # I think this shows the answer because it follows the rule we practiced
for t in temps:  # I think this shows the answer because it follows the rule we practiced
    if t > 70:  # I think this shows the answer because it follows the rule we practiced
        hot = hot + 1  # I think this shows the answer because it follows the rule we practiced
print(hot)  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a grade report
# Grade report
scores = [88, 92, 79, 65, 95]  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
passing = 0  # I think this shows the answer because it follows the rule we practiced
highest = 0  # I think this shows the answer because it follows the rule we practiced
for score in scores:  # I think this shows the answer because it follows the rule we practiced
    total = total + score  # I think this shows the answer because it follows the rule we practiced
    if score >= 70:  # I think this shows the answer because it follows the rule we practiced
        passing = passing + 1  # I think this shows the answer because it follows the rule we practiced
        if score > highest:  # I think this shows the answer because it follows the rule we practiced
            highest = score  # I think this shows the answer because it follows the rule we practiced
print("Average:", total / len(scores))  # I think this shows the answer because it follows the rule we practiced
print("Passing:", passing)  # I think this shows the answer because it follows the rule we practiced
print("Highest:", highest)  # I think this shows the answer because it follows the rule we practiced
# Grade report
scores = [50, 60, 70]  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
passing = 0  # I think this shows the answer because it follows the rule we practiced
highest = 0  # I think this shows the answer because it follows the rule we practiced
for score in scores:  # I think this shows the answer because it follows the rule we practiced
    total = total + score  # I think this shows the answer because it follows the rule we practiced
    if score >= 70:  # I think this shows the answer because it follows the rule we practiced
        passing = passing + 1  # I think this shows the answer because it follows the rule we practiced
        if score > highest:  # I think this shows the answer because it follows the rule we practiced
            highest = score  # I think this shows the answer because it follows the rule we practiced
print("Average:", total / len(scores))  # I think this shows the answer because it follows the rule we practiced
print("Passing:", passing)  # I think this shows the answer because it follows the rule we practiced
print("Highest:", highest)  # I think this shows the answer because it follows the rule we practiced
