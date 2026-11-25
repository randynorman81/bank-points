# Step 1: The slice rule
word = "Python"
print(word[0:2])  # I think Py
print(word[2:4])  # I think th
print(word[1:5])  # 5 - 1 = 4 characters
# Step 2: Leave out a number
word = "Python"
print(word[:3])  # the first 3 characters
print(word[2:])  # everything from index 2 to the end
print(word[:])  # a copy of the whole string
# Step 3: Negative numbers in slices
# P y t h o n
# -6 -5 -4 -3 -2 -1
word = "Python"
print(word[-3:])  # the last 3 characters, I think hon
print(word[:-1])  # everything except the last character, I think Pytho
print(word[-4:-1])  # from -4 up to but not including -1, I think tho
# Step 4: Take apart a phone number
phone = "7705551234"
area_code = phone[:3]
prefix = phone[3:6]
line = phone[6:]
print(area_code)
print(prefix)
print(line)
print("(" + area_code + ") " + prefix + "-" + line)
