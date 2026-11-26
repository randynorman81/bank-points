#!inputs:10|10|10|10|10|10
# Step 1: Import a library
import math  # I think this shows the answer because it follows the rule we practiced
print(math.sqrt(16))  # I think this shows the answer because it follows the rule we practiced
print(math.sqrt(81))  # I think this shows the answer because it follows the rule we practiced
print(math.sqrt(100))  # I think this shows the answer because it follows the rule we practiced
# Step 2: Procedures that come with Python
print(len("robot"))  # I think this shows the answer because it follows the rule we practiced
print(abs(-7))  # I think this shows the answer because it follows the rule we practiced
print(round(3.67))  # I think this shows the answer because it follows the rule we practiced
print(min(4, 2, 8))  # I think this shows the answer because it follows the rule we practiced
print(max(4, 2, 8))  # I think this shows the answer because it follows the rule we practiced
# Step 3: Read the documentation
print(round(3.14159, 2))  # I think this shows the answer because it follows the rule we practiced
print(round(7.891, 1))  # I think this shows the answer because it follows the rule we practiced
print(round(9.876, 1))  # I think this shows the answer because it follows the rule we practiced
# Step 4: The random library
import random  # I think this shows the answer because it follows the rule we practiced
roll = random.randint(1, 6)  # I think this shows the answer because it follows the rule we practiced
print(roll)  # I think this shows the answer because it follows the rule we practiced
print(random.randint(5, 5))  # I think this shows the answer because it follows the rule we practiced
# Step 5: Match the order in the documentation
print(pow(2, 3))  # I think this shows the answer because it follows the rule we practiced
print(pow(3, 2))  # I think this shows the answer because it follows the rule we practiced
print(pow(10, 2))  # I think this shows the answer because it follows the rule we practiced
# Step 6: A procedure that calls a library procedure
import math  # I think this shows the answer because it follows the rule we practiced

def hypotenuse(a, b):  # I think this shows the answer because it follows the rule we practiced
    return math.sqrt(a * a + b * b)  # I think this shows the answer because it follows the rule we practiced

print(hypotenuse(3, 4))  # I think this shows the answer because it follows the rule we practiced
print(hypotenuse(5, 12))  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read documentation the way the exam does
def clamp(value, low, high):  # I think this shows the answer because it follows the rule we practiced
    if value < low:  # I think this shows the answer because it follows the rule we practiced
        return low  # I think this shows the answer because it follows the rule we practiced
    if value > high:  # I think this shows the answer because it follows the rule we practiced
        return high  # I think this shows the answer because it follows the rule we practiced
    return value  # I think this shows the answer because it follows the rule we practiced
print(clamp(15, 0, 10))  # I think this shows the answer because it follows the rule we practiced
print(clamp(-3, 0, 10))  # I think this shows the answer because it follows the rule we practiced
print(clamp(7, 0, 10))  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a distance finder
# Distance
import math  # I think this shows the answer because it follows the rule we practiced
def distance(x1, y1, x2, y2):  # I think this shows the answer because it follows the rule we practiced
    dx = x2 - x1  # I think this shows the answer because it follows the rule we practiced
    dy = y2 - y1  # I think this shows the answer because it follows the rule we practiced
    return math.sqrt(dx * dx + dy * dy)  # I think this shows the answer because it follows the rule we practiced
print(distance(0, 0, 3, 4))  # I think this shows the answer because it follows the rule we practiced
print(distance(1, 1, 4, 5))  # I think this shows the answer because it follows the rule we practiced
print(round(distance(0, 0, 1, 1), 2))  # I think this shows the answer because it follows the rule we practiced
