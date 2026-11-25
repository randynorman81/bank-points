# Step 1: Trace variables that change
# line 1: x = 4
# line 2: y = 7
# line 3: x = 14
x = 4
y = x + 3
x = y * 2
print(x)
print(y)
x = x - 5
print(x)  # I predict 9
# Step 2: Trace text
# line 1: word = "robot"
# line 2: first = "r"
# line 3: rest = "obot"
word = "robot"
first = word[0]
rest = word[1:]
print(rest + first)
print(len(word) * 2)  # I predict 10
# Step 3: Trace // and %
# line 1: total = 17
# line 2: groups = 3
# line 3: left = 2
total = 17
groups = total // 5
left = total % 5
print(groups)
print(left)
total = total + 4
print(total // 5)  # I predict 4
