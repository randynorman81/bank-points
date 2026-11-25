#!inputs:15|15|4|6|3.5|30132|15|30132|7705551234|1.5|3|12345|95|22|20|2.5|4
# Step 1: Convert to an integer
age_text = input("How old are you? ")
age = int(age_text)  # int() changed the text into a number I can add to
print(age + 1)
print(type(age_text))
print(type(age))
# Step 2: A shortcut
age = int(input("How old are you? "))
print("Next year you will be", age + 1)
# Step 3: Add two numbers the right way
first = int(input("First number: "))
second = int(input("Second number: "))
print(first + second)
print(first - second)
print(first * second)
# Step 4: Decimals need float
# number = int(input("Type a number: "))  # ValueError: int() cannot turn 3.5 into a whole number
number = float(input("Type a number: "))  # you have to use the type of number you are asking for
# Step 5: When NOT to convert
zip_code = input("Zip code: ")
print(zip_code)
# print(int(zip_code))  # never convert a number I will not do math with
my_age = int(input("Age? "))
my_zip = input("Zip? ")
my_phone = input("Phone? ")
snack_price = float(input("Snack price? "))
snack_count = int(input("How many snacks? "))
student_id = input("Student ID? ")
test_score = float(input("Test score? "))
house_number = input("House number? ")  # my rule: convert it only if I will do math with it, and I will not do math with a house number
# Step 6: Tip calculator
# Tip calculator
bill = float(input("What was the bill? "))
tip = bill * 0.15
total = bill + tip
print("Tip: $" + str(tip))
print("Total: $" + str(total))
# Step 7: Snack bar
# Snack bar
price = float(input("Price of one snack? "))
quantity = int(input("How many snacks? "))
subtotal = price * quantity
tax = subtotal * 0.08
total = subtotal + tax
print("Subtotal: $" + str(subtotal))
print("Tax: $" + str(tax))
print("Total: $" + str(total))
