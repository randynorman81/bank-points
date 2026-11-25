#!inputs:Ada|Lovelace|candle
# Step 1: How long is a string?
word = "Python"
print(len(word))  # I think it shows 6
print(len("Hello there"))  # I think it shows 11, the space counts
# Step 2: Every character has an index
word = "Python"
print(word[0])  # I think P
print(word[3])  # I think h
print(word[5])  # I think n
print(type(word[0]))
# Step 3: Counting from the end
word = "Python"
print(word[-1])  # word[-1] is the last character, no matter how long the word is
print(word[-3])  # I think h
print(word[-6])  # I think P
# Step 4: Predict, then check
# w a t e r m e l o n
# 0 1 2 3 4 5 6 7 8 9
fruit = "watermelon"
print(fruit[0])  # I think w
print(fruit[4])  # I think r
print(fruit[-1])  # I think n
print(fruit[-2])  # I think o
print(fruit[len(fruit) - 1])  # I think n
# Step 5: The off-by-one trap
word = "Python"
# print(word[6])  # a string with 6 characters has indexes 0 to 5
print(word[5])
# Step 6: Strings cannot be changed in place
word = "Python"
# word[0] = "J"  # TypeError: you cannot overwrite a character
new_word = "J" + word[1] + word[2] + word[3] + word[4] + word[5]
print(new_word)
# Step 7: Use input
# Initials
first_name = input("First name? ")
last_name = input("Last name? ")
print(first_name[0] + last_name[0])
print(first_name[-1])
print(len(first_name))
# Step 8: The middle letter
word = "Python"
middle = len(word) // 2
print(middle)
print(word[middle])
word = "banana"
middle = len(word) // 2
print(middle)
print(word[middle])  # banana has 6 characters so the middle index is 3 and it shows a
word = "hello"
middle = len(word) // 2
print(middle)
print(word[middle])  # hello has 5 characters so the middle index is 2 and it shows l
word = input("Word? ")
middle = len(word) // 2
print(word[middle])
