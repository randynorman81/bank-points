#!inputs:10|10|10|10|10|10
# Step 1: Return True or False
def is_even(n):  # I think this shows the answer because it follows the rule we practiced
    return n % 2 == 0  # I think this shows the answer because it follows the rule we practiced

print(is_even(8))  # I think this shows the answer because it follows the rule we practiced
print(is_even(7))  # I think this shows the answer because it follows the rule we practiced
def is_big(n):  # I think this shows the answer because it follows the rule we practiced
    return n > 100  # I think this shows the answer because it follows the rule we practiced
print(is_big(500))  # I think this shows the answer because it follows the rule we practiced
print(is_big(5))  # I think this shows the answer because it follows the rule we practiced
# Step 2: Use a returned True or False in an if
def is_even(n):  # I think this shows the answer because it follows the rule we practiced
    return n % 2 == 0  # I think this shows the answer because it follows the rule we practiced

number = 9  # I think this shows the answer because it follows the rule we practiced
if is_even(number):  # I think this shows the answer because it follows the rule we practiced
    print("even")  # I think this shows the answer because it follows the rule we practiced
else:  # I think this shows the answer because it follows the rule we practiced
    print("odd")  # I think this shows the answer because it follows the rule we practiced
number = 12  # I think this shows the answer because it follows the rule we practiced
if is_even(number):  # I think this shows the answer because it follows the rule we practiced
    print("even")  # I think this shows the answer because it follows the rule we practiced
else:  # I think this shows the answer because it follows the rule we practiced
    print("odd")  # I think this shows the answer because it follows the rule we practiced
# Step 3: Return one of two values
def bigger(a, b):  # I think this shows the answer because it follows the rule we practiced
    if a > b:  # I think this shows the answer because it follows the rule we practiced
        return a  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        return b  # I think this shows the answer because it follows the rule we practiced

print(bigger(8, 3))  # I think this shows the answer because it follows the rule we practiced
print(bigger(2, 9))  # I think this shows the answer because it follows the rule we practiced
def smaller(a, b):  # I think this shows the answer because it follows the rule we practiced
    if a < b:  # I think this shows the answer because it follows the rule we practiced
        return a  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        return b  # I think this shows the answer because it follows the rule we practiced
print(smaller(4, 9))  # I think this shows the answer because it follows the rule we practiced
print(smaller(7, 2))  # I think this shows the answer because it follows the rule we practiced
# Step 4: Return early, with no else
def label(score):  # I think this shows the answer because it follows the rule we practiced
    if score >= 60:  # I think this shows the answer because it follows the rule we practiced
        return "pass"  # I think this shows the answer because it follows the rule we practiced
    return "fail"  # I think this shows the answer because it follows the rule we practiced

print(label(75))  # I think this shows the answer because it follows the rule we practiced
print(label(40))  # I think this shows the answer because it follows the rule we practiced
def sign(n):  # I think this shows the answer because it follows the rule we practiced
    if n < 0:  # I think this shows the answer because it follows the rule we practiced
        return "negative"  # I think this shows the answer because it follows the rule we practiced
    if n > 0:  # I think this shows the answer because it follows the rule we practiced
        return "positive"  # I think this shows the answer because it follows the rule we practiced
    return "zero"  # I think this shows the answer because it follows the rule we practiced
print(sign(-4))  # I think this shows the answer because it follows the rule we practiced
print(sign(0))  # I think this shows the answer because it follows the rule we practiced
# Step 5: Loop, then return
def sum_to(n):  # I think this shows the answer because it follows the rule we practiced
    total = 0  # I think this shows the answer because it follows the rule we practiced
    for i in range(1, n + 1):  # I think this shows the answer because it follows the rule we practiced
        total = total + i  # I think this shows the answer because it follows the rule we practiced
    return total  # I think this shows the answer because it follows the rule we practiced

print(sum_to(4))  # I think this shows the answer because it follows the rule we practiced
print(sum_to(10))  # I think this shows the answer because it follows the rule we practiced
# Step 6: A loop with a decision inside
def count_even(n):  # I think this shows the answer because it follows the rule we practiced
    count = 0  # I think this shows the answer because it follows the rule we practiced
    for i in range(1, n + 1):  # I think this shows the answer because it follows the rule we practiced
        if i % 2 == 0:  # I think this shows the answer because it follows the rule we practiced
            count = count + 1  # I think this shows the answer because it follows the rule we practiced
    return count  # I think this shows the answer because it follows the rule we practiced

print(count_even(10))  # I think this shows the answer because it follows the rule we practiced
print(count_even(7))  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read IF and RETURN the way the exam does
def bigger(a, b):  # I think this shows the answer because it follows the rule we practiced
    if a > b:  # I think this shows the answer because it follows the rule we practiced
        return a  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        return b  # I think this shows the answer because it follows the rule we practiced
print(bigger(8, 3))  # I think this shows the answer because it follows the rule we practiced
print(bigger(2, 9))  # I think this shows the answer because it follows the rule we practiced
def sum_to(n):  # I think this shows the answer because it follows the rule we practiced
    total = 0  # I think this shows the answer because it follows the rule we practiced
    i = 1  # I think this shows the answer because it follows the rule we practiced
    for turn in range(n):  # I think this shows the answer because it follows the rule we practiced
        total = total + i  # I think this shows the answer because it follows the rule we practiced
        i = i + 1  # I think this shows the answer because it follows the rule we practiced
    return total  # I think this shows the answer because it follows the rule we practiced
print(sum_to(4))  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a grade checker
# Grades
def letter(score):  # I think this shows the answer because it follows the rule we practiced
    if score >= 90:  # I think this shows the answer because it follows the rule we practiced
        return "A"  # I think this shows the answer because it follows the rule we practiced
    elif score >= 80:  # I think this shows the answer because it follows the rule we practiced
        return "B"  # I think this shows the answer because it follows the rule we practiced
    elif score >= 70:  # I think this shows the answer because it follows the rule we practiced
        return "C"  # I think this shows the answer because it follows the rule we practiced
    return "Keep working"  # I think this shows the answer because it follows the rule we practiced
def passed(score):  # I think this shows the answer because it follows the rule we practiced
    return score >= 70  # I think this shows the answer because it follows the rule we practiced
def average(a, b, c):  # I think this shows the answer because it follows the rule we practiced
    return (a + b + c) / 3  # I think this shows the answer because it follows the rule we practiced
avg = average(70, 80, 90)  # I think this shows the answer because it follows the rule we practiced
print("Average:", avg)  # I think this shows the answer because it follows the rule we practiced
print("Letter:", letter(avg))  # I think this shows the answer because it follows the rule we practiced
print("Passed:", passed(avg))  # I think this shows the answer because it follows the rule we practiced
