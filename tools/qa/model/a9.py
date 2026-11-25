#!inputs:90|85|100|42|50|90|85|100|60|4
# Step 1: Predict, then check
print(7 / 2)  # I think 3.5, / always gives a float, even when it divides evenly
print(10 / 2)  # I think 5.0
print(1 / 4)  # I think 0.25
print(-7 / 2)  # I think -3.5
print(1 / 3)  # I think 0.3333333333333333
print(1 / 3)  # the same again
# Step 2: Check the type
answer = 8 / 2
print(answer)
print(type(answer))  # it is a float and prints 4.0 even though it divides evenly
# Step 3: Average of three test scores
# Average
score1 = int(input("Score 1? "))
score2 = int(input("Score 2? "))
score3 = int(input("Score 3? "))
average = (score1 + score2 + score3) / 3  # brackets make the addition happen first, because division goes before addition
print(average)
# Step 4: Percent
# points = 42
# possible = 50
points = 42
possible = 50
percent = points / possible * 100  # divide the points by what is possible and multiply by 100 to get a percent
print(percent)
# points = 42
# possible = 50
points = float(input("Points? "))
possible = float(input("Possible? "))
# Step 5: Rounding the answer
print(round(1 / 3, 2))
print(round(2 / 3, 3))
s1 = int(input("Score 1? "))
s2 = int(input("Score 2? "))
s3 = int(input("Score 3? "))
print(round((s1 + s2 + s3) / 3, 1))
# Step 6: Splitting a cost
# Split the bill
cost = float(input("Total cost? "))
people = int(input("How many people? "))
print("Each person pays $" + str(round(cost / people, 2)))
# Step 7: The one thing you cannot do
# print(5 / 0)  # you can never divide by zero
