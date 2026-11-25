# Step 1: Store one of each
name = "Ana"
age = 15
height = 5.4
is_student = True
print(name)
print(age)
print(height)
print(is_student)
# Step 2: Ask Python for the type
name = "Ana"
age = 15
height = 5.4
is_student = True
print(type(name))  # type() tells me what kind of value a variable holds
print(type(age))
print(type(height))
print(type(is_student))
# Step 3: Predict, then check
print(type("7"))  # my guess: str
print(type(7))  # my guess: int
print(type(7.0))  # my guess: float
print(type("7.0"))  # my guess: str
print(type(True))  # my guess: bool
print(type("True"))  # my guess: str
print(type(-3))  # my guess: int
print(type(0.5))  # my guess: float
# Step 4: Variables can change type
thing = 10
print(type(thing))  # int, because 10 is a whole number
thing = "ten"
print(type(thing))  # str, because the new = replaced it with text
thing = 10.5
print(type(thing))  # float, because the new value has a decimal point
thing = False
print(type(thing))  # bool, because False is a Boolean
# Step 5: Booleans from comparisons
age = 15
is_teenager = age >= 13
can_drive = age >= 16
print(is_teenager)
print(can_drive)
is_adult = age >= 18
print(is_adult)
# Step 6: Fix the mistakes
price = "4.99"
quantity = 3.0
finished = "False"
zip_code = 30132.0
print(type(price))
print(type(quantity))
print(type(finished))
print(type(zip_code))
price = 4.99 # was a string, should be a float
quantity = 3 # was a float, should be a whole number
finished = False # was a string, should be a Boolean
zip_code = 30132 # was a float, should be a whole number
# Step 7: Your character card
character_name = "Zara"
character_class = "mage"
character_level = 12
character_health = 100
character_speed = 4.5
character_luck = 0.75
is_alive = True
has_sword = False
print(character_name)
print(character_class)
print(character_level)
print(character_health)
print(character_speed)
print(character_luck)
print(is_alive)
print(has_sword)
# strings
print(type(character_name))
print(type(character_class))
# integers
print(type(character_level))
print(type(character_health))
# floats
print(type(character_speed))
print(type(character_luck))
# booleans
print(type(is_alive))
print(type(has_sword))
