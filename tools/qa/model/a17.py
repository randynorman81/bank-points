#!inputs:10|10|10|10|10|10
# Step 1: and needs both
print(True and True)  # I think this shows the answer because it follows the rule we practiced
print(True and False)  # I think this shows the answer because it follows the rule we practiced
print(False and True)  # I think this shows the answer because it follows the rule we practiced
print(False and False)  # I think this shows the answer because it follows the rule we practiced
# Step 2: or needs just one
print(True or True)  # I think this shows the answer because it follows the rule we practiced
print(True or False)  # I think this shows the answer because it follows the rule we practiced
print(False or True)  # I think this shows the answer because it follows the rule we practiced
print(False or False)  # I think this shows the answer because it follows the rule we practiced
# Step 3: not flips, and brackets group
print(not True)  # I think this shows the answer because it follows the rule we practiced
print(not False)  # I think this shows the answer because it follows the rule we practiced
print(not (True and False))  # I think this shows the answer because it follows the rule we practiced
print(not (False or False))  # I think this shows the answer because it follows the rule we practiced
# Step 4: Combine comparisons
age = 15  # I think this shows the answer because it follows the rule we practiced
has_ticket = True  # I think this shows the answer because it follows the rule we practiced
print(age > 12 and has_ticket)  # I think this shows the answer because it follows the rule we practiced
print(age > 18 and has_ticket)  # I think this shows the answer because it follows the rule we practiced
print(age > 18 or has_ticket)  # I think this shows the answer because it follows the rule we practiced
can_enter = age > 12 and has_ticket  # I think this shows the answer because it follows the rule we practiced
print(can_enter)  # I think this shows the answer because it follows the rule we practiced
is_adult_with_ticket = age > 17 and has_ticket  # I think this shows the answer because it follows the rule we practiced
print(is_adult_with_ticket)  # I think this shows the answer because it follows the rule we practiced
# Step 5: Is it in a range?
x = 7  # I think this shows the answer because it follows the rule we practiced
print(x > 5 and x < 10)  # I think this shows the answer because it follows the rule we practiced
print(x < 5 or x > 10)  # I think this shows the answer because it follows the rule we practiced
print(x > 5 and x < 7)  # I think this shows the answer because it follows the rule we practiced
print(x == 7 or x == 8)  # I think this shows the answer because it follows the rule we practiced
# Step 6: Which one goes first?
print(True or False and False)  # I think this shows the answer because it follows the rule we practiced
print((True or False) and False)  # I think this shows the answer because it follows the rule we practiced
print(not True or True)  # I think this shows the answer because it follows the rule we practiced
print(not (True or True))  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read logic the way the exam does
a = 6  # I think this shows the answer because it follows the rule we practiced
b = 10  # I think this shows the answer because it follows the rule we practiced
print(a > 5 and b > 5)  # I think this shows the answer because it follows the rule we practiced
print(a > 5 and b < 5)  # I think this shows the answer because it follows the rule we practiced
print(a < 5 or b > 5)  # I think this shows the answer because it follows the rule we practiced
print(not (a > 5 and b > 5))  # I think this shows the answer because it follows the rule we practiced
print(a == 6 and not (b == 6))  # I think this shows the answer because it follows the rule we practiced
print(a > b or a == 6)  # I think this shows the answer because it follows the rule we practiced
score ← 82  # I think this shows the answer because it follows the rule we practiced
passed ← score > 70 AND score < 90  # I think this shows the answer because it follows the rule we practiced
DISPLAY(passed)  # I think this shows the answer because it follows the rule we practiced
DISPLAY(score < 60 OR score > 80)  # I think this shows the answer because it follows the rule we practiced
DISPLAY(NOT (score = 82))  # I think this shows the answer because it follows the rule we practiced
# score <- 82
# passed <- score > 70 AND score < 90
# DISPLAY(passed)
# DISPLAY(score < 60 OR score > 80)
# DISPLAY(NOT (score = 82))
# Step 8: Build a theme park gate
# Theme park gate
age = int(input("Age? "))  # I think this shows the answer because it follows the rule we practiced
height = int(input("Height in inches? "))  # I think this shows the answer because it follows the rule we practiced
can_ride = age > 11 and height > 47  # I think this shows the answer because it follows the rule we practiced
gets_discount = age < 6 or age > 64  # I think this shows the answer because it follows the rule we practiced
must_wait = not can_ride  # I think this shows the answer because it follows the rule we practiced
print(...)  # I think this shows the answer because it follows the rule we practiced
print("Can ride:", can_ride)  # I think this shows the answer because it follows the rule we practiced
print("Gets discount:", gets_discount)  # I think this shows the answer because it follows the rule we practiced
print("Must wait:", must_wait)  # I think this shows the answer because it follows the rule we practiced
