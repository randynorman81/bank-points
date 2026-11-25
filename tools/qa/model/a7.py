#!inputs:sam@school.org
# Step 1: Your first .find(), and what if it is not there
print("Python".find("th"))  # I think 2
print("Python".find("P"))  # I think 0
print("Python".find("TH"))  # I think -1 because capital letters are different
print("Python".find("z"))  # find() returns -1 when the text is not found
# Step 2: Slice around what .find() found
email = "sam@school.org"
at = email.find("@")  # at holds the index where the @ sits
print(at)
print(email[:at])
print(email[at + 1:])
email = "kim@mail.com"
at = email.find("@")
print(email[:at])
# Step 3: Split an address the user types
email = input("Email? ")
at = email.find("@")
dot = email.find(".")
print(email[:at])
print(email[at + 1:dot])  # the site name between the @ and the dot
print(email[dot + 1:])
print(email[at:])
