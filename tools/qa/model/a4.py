# Step 1: Join two strings
first_name = "Ada"
last_name = "Lovelace"
# print(first_name + last_name)
print(first_name + " " + last_name)  # the " " is needed because + joins exactly what is there
# Step 2: Text plus a number crashes
score = 95
# print("Your score is " + score)  # TypeError: cannot join text and a number
print("Your score is " + str(score))  # str() turns the number into text so + can join it
# Step 3: Floats and Booleans too
price = 4.99
in_stock = True
print("Price: $" + str(price))
print("In stock: " + str(in_stock))
# Step 4: Two ways to print mixed values
level = 7
print("Level:", level)  # prediction: Level: 7
print("Level: " + str(level))  # prediction: Level: 7
print("Level:" + str(level))  # prediction: Level:7 , the comma adds a space for you but with + you must put the space in the string yourself
# Step 5: Adding is not the same as joining
print(5 + 5)  # + adds two numbers so this is 10
print("5" + "5")  # + joins two strings so this is 55
print("5" * 3)  # * repeats the string three times so this is 555
# Step 6: Fix four broken lines
name = "Jordan"
points = 120
average = 8.5
passed = True
# print("Hello" + name)
print("Hello " + name)  # added a space after Hello
# print("Points: " + points)
print("Points: " + str(points))  # added str() so the number can be joined
# print("Average: " + average)
print("Average: " + str(average))  # added str() for the float
# print("Passed: " + passed)
print("Passed: " + str(passed))  # added str() for the Boolean
# Step 7: Your profile card
name = "Randy"
age = 45
height = 6.5
print("My name is " + name + ", I am " + str(age) + " years old and " + str(height) + " feet tall.")
