#!inputs:10
# Step 1: Your first if statement
age = 16  # I think this shows the answer because it follows the rule we practiced
if age >= 16:  # I think this shows the answer because it follows the rule we practiced
    print("You can drive")  # I think this shows the answer because it follows the rule we practiced
print("Done")  # I think this shows the answer because it follows the rule we practiced
age = 15  # I think this shows the answer because it follows the rule we practiced
if age >= 16:  # I think this shows the answer because it follows the rule we practiced
    print("You can drive")  # I think this shows the answer because it follows the rule we practiced
print("Done")  # I think this shows the answer because it follows the rule we practiced
# Step 2: Indentation decides what belongs
temperature = 95  # I think this shows the answer because it follows the rule we practiced
if temperature > 90:  # I think this shows the answer because it follows the rule we practiced
    print("It is hot")  # I think this shows the answer because it follows the rule we practiced
    print("Drink water")  # I think this shows the answer because it follows the rule we practiced
print("Have a nice day")  # I think this shows the answer because it follows the rule we practiced
temperature = 70  # I think this shows the answer because it follows the rule we practiced
if temperature > 90:  # I think this shows the answer because it follows the rule we practiced
    print("It is hot")  # I think this shows the answer because it follows the rule we practiced
    print("Drink water")  # I think this shows the answer because it follows the rule we practiced
print("Have a nice day")  # I think this shows the answer because it follows the rule we practiced
# Step 3: Conditions can be Booleans and logic
has_ticket = True  # I think this shows the answer because it follows the rule we practiced
age = 15  # I think this shows the answer because it follows the rule we practiced
if has_ticket:  # I think this shows the answer because it follows the rule we practiced
    print("Ticket checked")  # I think this shows the answer because it follows the rule we practiced
if age > 12 and has_ticket:  # I think this shows the answer because it follows the rule we practiced
    print("Come on in")  # I think this shows the answer because it follows the rule we practiced
if not has_ticket:  # I think this shows the answer because it follows the rule we practiced
    print("Buy a ticket")  # I think this shows the answer because it follows the rule we practiced
# Step 4: An if can change a variable
points = 40  # I think this shows the answer because it follows the rule we practiced
if points >= 40:  # I think this shows the answer because it follows the rule we practiced
    points = points + 10  # I think this shows the answer because it follows the rule we practiced
if points >= 50:  # I think this shows the answer because it follows the rule we practiced
    points = points + 5  # I think this shows the answer because it follows the rule we practiced
print(points)  # I think this shows the answer because it follows the rule we practiced
# Step 5: Several ifs in a row
number = int(input("Number? "))  # I think this shows the answer because it follows the rule we practiced
if number > 0:  # I think this shows the answer because it follows the rule we practiced
    print("positive")  # I think this shows the answer because it follows the rule we practiced
if number % 2 == 0:  # I think this shows the answer because it follows the rule we practiced
    print("even")  # I think this shows the answer because it follows the rule we practiced
if number > 100:  # I think this shows the answer because it follows the rule we practiced
    print("big")  # I think this shows the answer because it follows the rule we practiced
# Step 6: An if inside an if
age = 20  # I think this shows the answer because it follows the rule we practiced
has_license = True  # I think this shows the answer because it follows the rule we practiced
if age >= 16:  # I think this shows the answer because it follows the rule we practiced
    print("Old enough")  # I think this shows the answer because it follows the rule we practiced
    if has_license:  # I think this shows the answer because it follows the rule we practiced
        print("You may drive")  # I think this shows the answer because it follows the rule we practiced
age = 20  # I think this shows the answer because it follows the rule we practiced
has_license = False  # I think this shows the answer because it follows the rule we practiced
if age >= 16:  # I think this shows the answer because it follows the rule we practiced
    print("Old enough")  # I think this shows the answer because it follows the rule we practiced
    if has_license:  # I think this shows the answer because it follows the rule we practiced
        print("You may drive")  # I think this shows the answer because it follows the rule we practiced
# Step 7: Build a ticket price program
# Ticket price
price = 10  # I think this shows the answer because it follows the rule we practiced
age = int(input("Age? "))  # I think this shows the answer because it follows the rule we practiced
member = input("Member (yes/no)? ")  # I think this shows the answer because it follows the rule we practiced
if age < 12:  # I think this shows the answer because it follows the rule we practiced
    price = price - 5  # I think this shows the answer because it follows the rule we practiced
if age > 64:  # I think this shows the answer because it follows the rule we practiced
    price = price - 3  # I think this shows the answer because it follows the rule we practiced
if member == "yes":  # I think this shows the answer because it follows the rule we practiced
    price = price - 2  # I think this shows the answer because it follows the rule we practiced
print("Price:", price)  # I think this shows the answer because it follows the rule we practiced
