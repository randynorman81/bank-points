#!inputs:Sam|15|4|3|4|Sam|pizza|7|Atlanta
# Step 1: Ask a question
name = input("What is your name? ")
print("Nice to meet you,")
print(name)
# Step 2: Everything typed is a string
# name = input("What is your name? ")
# print("Nice to meet you,")
# print(name)
age = input("How old are you? ")
print(age)
print(type(age))  # input() always gives me a string, even when I type digits
# Step 3: See the problem
# age = input("How old are you? ")
# print(age)
# print(type(age))
number = input("Type a number: ")
# print(number + 1)  # this crashes because number is a string and 1 is an integer
# Step 4: Strings stick together
# number = input("Type a number: ")
first = input("First number: ")
second = input("Second number: ")
print(first + second)  # I got 34 and not 7 because input gives strings and + sticks strings together
# Step 5: Your interview program
# first = input("First number: ")
# second = input("Second number: ")
# print(first + second)
# Interview
name = input("What is your name? ")
favorite_food = input("What is your favorite food? ")
favorite_number = input("What is your favorite number? ")
city = input("What city do you live in? ")
print(name)
print(favorite_food)
print(favorite_number)
print(city)
print(type(favorite_number))  # it is a string, because input always gives a string even for a number
