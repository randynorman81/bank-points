#!inputs:135|50|20|100|40
# Step 1: Predict, then check
print(7 // 2)  # I think 3
print(10 // 2)  # I think 5
print(1 // 4)  # I think 0
print(7.5 // 2)  # I think 3.0
print(100 // 7)  # I think 14
# Step 2: Compare / and //
print(17 / 5)  # a single / gives a float, it keeps the decimal part
print(17 // 5)  # // gives the whole number only, it throws the decimal part away
# Step 3: Seconds to minutes
# Minutes
seconds = int(input("Seconds? "))
minutes = seconds // 60
print("Whole minutes:", minutes)
# Step 4: Boxes
# Boxes
cookies = int(input("Cookies? "))
print("Full boxes:", cookies // 12)
# Step 5: Chopping off digits
number = 472
print(number // 100)
print(number // 10)
print(number // 1000)  # // 10 chops off one digit, // 100 chops two, and // 1000 chops all three
# Step 6: Negative numbers (a trap)
print(-7 // 2)  # // rounds down toward negative infinity so this is -4
print(int(-7 / 2))  # int() chops off the decimal so this is -3, which is why they are different
# Step 7: Your turn
# Weeks
days = int(input("Days? "))
print(days // 7)
# Quarters
cents = int(input("Cents? "))
print(cents // 25)
# Feet
inches = int(input("Inches? "))
print(inches // 12)
