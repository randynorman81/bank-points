#!inputs:10|10|10|10|10|10
# Step 1: Your first for loop
for i in range(5):  # I think this shows the answer because it follows the rule we practiced
    print(i)  # I think this shows the answer because it follows the rule we practiced
print("Done")  # I think this shows the answer because it follows the rule we practiced
# Step 2: Repeating without using the counter
for i in range(3):  # I think this shows the answer because it follows the rule we practiced
    print("Hello!")  # I think this shows the answer because it follows the rule we practiced
for i in range(6):  # I think this shows the answer because it follows the rule we practiced
    print("Go!")  # I think this shows the answer because it follows the rule we practiced
# Step 3: Choose where to start
for n in range(2, 7):  # I think this shows the answer because it follows the rule we practiced
    print(n)  # I think this shows the answer because it follows the rule we practiced
for k in range(1, 6):  # I think this shows the answer because it follows the rule we practiced
    print(k)  # I think this shows the answer because it follows the rule we practiced
# Step 4: Count by steps and count down
for n in range(0, 10, 2):  # I think this shows the answer because it follows the rule we practiced
    print(n)  # I think this shows the answer because it follows the rule we practiced
for n in range(5, 0, -1):  # I think this shows the answer because it follows the rule we practiced
    print(n)  # I think this shows the answer because it follows the rule we practiced
print("Liftoff!")  # I think this shows the answer because it follows the rule we practiced
for m in range(5, 51, 5):  # I think this shows the answer because it follows the rule we practiced
    print(m)  # I think this shows the answer because it follows the rule we practiced
# Step 5: Add things up
total = 0  # I think this shows the answer because it follows the rule we practiced
for i in range(1, 8):  # I think this shows the answer because it follows the rule we practiced
    total = total + i  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
product = 1  # I think this shows the answer because it follows the rule we practiced
for j in range(1, 5):  # I think this shows the answer because it follows the rule we practiced
    product = product * j  # I think this shows the answer because it follows the rule we practiced
print(product)  # I think this shows the answer because it follows the rule we practiced
# Step 6: An if inside a loop
evens = 0  # I think this shows the answer because it follows the rule we practiced
for n in range(1, 13):  # I think this shows the answer because it follows the rule we practiced
    if n % 2 == 0:  # I think this shows the answer because it follows the rule we practiced
        evens = evens + 1  # I think this shows the answer because it follows the rule we practiced
print(evens)  # I think this shows the answer because it follows the rule we practiced
for m in range(1, 21):  # I think this shows the answer because it follows the rule we practiced
    if m % 3 == 0:  # I think this shows the answer because it follows the rule we practiced
        print(m)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read loops the way the exam does
# count <- 0
# REPEAT 4 TIMES
# count <- count + 3
# DISPLAY(count)
# x <- 1
# REPEAT 7 TIMES
# IF (x MOD 2 = 0)
# DISPLAY(x)
# x <- x + 1
# count <- 0
# REPEAT 4 TIMES
# count <- count + 3
# DISPLAY(count)
count = 0  # I think this shows the answer because it follows the rule we practiced
for i in range(4):  # I think this shows the answer because it follows the rule we practiced
    count = count + 3  # I think this shows the answer because it follows the rule we practiced
print(count)  # shows 12
# x <- 1
# REPEAT 7 TIMES
# IF (x MOD 2 = 0)
# DISPLAY(x)
# x <- x + 1
x = 1  # I think this shows the answer because it follows the rule we practiced
for i in range(7):  # I think this shows the answer because it follows the rule we practiced
    if x % 2 == 0:  # I think this shows the answer because it follows the rule we practiced
        print(x)  # I think this shows the answer because it follows the rule we practiced
    x = x + 1  # shows 2, 4, and 6
# Step 8: Build a times table
# Times table
number = int(input("Number? "))  # I think this shows the answer because it follows the rule we practiced
total = 0  # I think this shows the answer because it follows the rule we practiced
for i in range(1, 11):  # I think this shows the answer because it follows the rule we practiced
    print(number, "x", i, "=", number * i)  # I think this shows the answer because it follows the rule we practiced
    total = total + number * i  # I think this shows the answer because it follows the rule we practiced
print("Total:", total)  # I think this shows the answer because it follows the rule we practiced
