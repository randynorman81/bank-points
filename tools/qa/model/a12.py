#!inputs:212|10|3|90|85|100
# Step 1: Predict and check
print(2 + 3 * 4)  # 14
print((2 + 3) * 4)  # 20
print(10 - 4 - 3)  # 3
print(10 / 2 * 5)  # 25.0
print(10 / 2 * 5)  # 25.0 again
print(2 ** 3 * 2)  # 16
print(7 // 2 * 2)  # 6
print(17 % 5 * 2)  # 4
print(100 - 4 ** 2 // 2)  # 92
# Step 2: The classic mistake
a = 90
b = 85
c = 100
# average = a + b + c / 3  # bug: only c was divided by 3, because division is done before addition
average = (a + b + c) / 3
print(average)
# Step 3: Temperature converter
f = 98.6
c_wrong = f - 32 * 5 / 9  # wrong because multiplication and division happen before the subtraction
c_right = (f - 32) * 5 / 9
print(c_wrong)
print(c_right)
temp = float(input("Fahrenheit? "))
print(round((temp - 32) * 5 / 9, 1))
# Step 4: Left to right matters
print(10 / 2 * 5)  # left to right: 10 / 2 is 5.0 then times 5
print(10 / (2 * 5))  # brackets first: 2 * 5 is 10 then 10 / 10
print(20 // 3 * 3)  # left to right: 20 // 3 is 6 then times 3
print(20 // (3 * 3))  # brackets first: 3 * 3 is 9 then 20 // 9
# Step 5: Powers come first
print(2 + 3 ** 2)  # power first: 3 ** 2 is 9 then plus 2 is 11
print((2 + 3) ** 2)  # brackets first: 5 ** 2 is 25
print(-2 ** 2)  # power first: 2 ** 2 is 4 and then the minus sign makes -4
print((-2) ** 2)  # brackets first: the negative number is squared so it is 4
# Step 6: MOD with other operators
print(10 + 7 % 3)  # % first: 7 % 3 is 1 then plus 10 is 11
print((10 + 7) % 3)  # brackets first: 17 % 3 is 2
print(2 * 7 % 4)  # left to right: 2 * 7 is 14 then 14 % 4 is 2
print(2 * (7 % 4))  # brackets first: 7 % 4 is 3 then times 2 is 6
# Step 7: Your turn
price = float(input("Price? "))
quantity = int(input("How many? "))
total = price * quantity * 1.08
print(total)
# total = price * (quantity * 1.08)  # wrong: the brackets change the order of the tax math
a = int(input("First? "))
b = int(input("Second? "))
c = int(input("Third? "))
print(round((a + b + c) / 3, 2))
# print(round(a + b + c / 3, 2))  # wrong: without brackets only c is divided by 3
