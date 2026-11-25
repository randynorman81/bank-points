#!inputs:135|7|589|10|5|87
# Step 1: Predict, then check
print(7 % 2)  # I think 1
print(10 % 2)  # I think 0
print(15 % 4)  # I think 3
print(2 % 5)  # I think 2
print(100 % 7)  # I think 2
# Step 2: // and % are partners
print(17 // 5)  # 3 * 5 + 2 = 17
print(17 % 5)  # 3 * 5 + 2 = 17
# Step 3: Minutes and seconds
# Clock time
seconds = int(input("Seconds? "))
minutes = seconds // 60
seconds_left = seconds % 60
print(str(minutes) + " minutes and " + str(seconds_left) + " seconds")
# Step 4: Even or odd
number = int(input("Type a whole number: "))
print(number % 2)  # 8 -> 0, 7 -> 1, 100 -> 0, 33 -> 1 (0 means even, 1 means odd)
is_even = number % 2 == 0
print(is_even)
# Step 5: Does it divide evenly?
# Divisible
divisible_by_3 = number % 3 == 0
print(divisible_by_3)
divisible_by_5 = number % 5 == 0
print(divisible_by_5)
# Step 6: Last digit
number = 472
print(number % 10)
last = int(input("A whole number? "))
print(last % 10)
print(last // 10)
# Step 7: Wrapping around a clock
# Clock
hour = int(input("Hour? "))
later = int(input("Hours later? "))
print((hour + later) % 12)  # 12 comes out as 0 here, and when I learn if I could change a 0 into 12
# Step 8: Make change
cents = int(input("Cents? "))
print("Quarters:", cents // 25)
print("Cents left:", cents % 25)
