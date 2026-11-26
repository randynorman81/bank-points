#!inputs:10|10|10|10|10|10
# Step 1: Code you keep repeating
print("----------")  # I think this shows the answer because it follows the rule we practiced
print("Level 1")  # I think this shows the answer because it follows the rule we practiced
print("----------")  # I think this shows the answer because it follows the rule we practiced
print("----------")  # I think this shows the answer because it follows the rule we practiced
print("Game over")  # I think this shows the answer because it follows the rule we practiced
print("----------")  # I think this shows the answer because it follows the rule we practiced
def banner(text):  # I think this shows the answer because it follows the rule we practiced
    print("----------")  # I think this shows the answer because it follows the rule we practiced
    print(text)  # I think this shows the answer because it follows the rule we practiced
    print("----------")  # I think this shows the answer because it follows the rule we practiced
banner("Level 1")  # I think this shows the answer because it follows the rule we practiced
banner("Game over")  # I think this shows the answer because it follows the rule we practiced
# Step 2: A parameter that changes what happens
def welcome(name, vip):  # I think this shows the answer because it follows the rule we practiced
    if vip:  # I think this shows the answer because it follows the rule we practiced
        print("Welcome back,", name)  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("Hello,", name)  # I think this shows the answer because it follows the rule we practiced

welcome("Ana", True)  # I think this shows the answer because it follows the rule we practiced
welcome("Ben", False)  # I think this shows the answer because it follows the rule we practiced
welcome("Cy", True)  # I think this shows the answer because it follows the rule we practiced
# Step 3: Iteration controlled by a parameter
def stars(count):  # I think this shows the answer because it follows the rule we practiced
    line = ""  # I think this shows the answer because it follows the rule we practiced
    for i in range(count):  # I think this shows the answer because it follows the rule we practiced
        line = line + "*"  # I think this shows the answer because it follows the rule we practiced
    print(line)  # I think this shows the answer because it follows the rule we practiced

stars(3)  # I think this shows the answer because it follows the rule we practiced
stars(6)  # I think this shows the answer because it follows the rule we practiced
stars(1)  # I think this shows the answer because it follows the rule we practiced
# Step 4: Sequencing, selection, and iteration together
def star_rating(score):  # I think this shows the answer because it follows the rule we practiced
    line = ""  # I think this shows the answer because it follows the rule we practiced
    for i in range(score):  # I think this shows the answer because it follows the rule we practiced
        line = line + "*"  # I think this shows the answer because it follows the rule we practiced
    if score >= 4:  # I think this shows the answer because it follows the rule we practiced
        line = line + " great!"  # I think this shows the answer because it follows the rule we practiced
    return line  # I think this shows the answer because it follows the rule we practiced

print(star_rating(2))  # I think this shows the answer because it follows the rule we practiced
print(star_rating(5))  # I think this shows the answer because it follows the rule we practiced
# Step 5: A procedure that calls another procedure
def double(n):  # I think this shows the answer because it follows the rule we practiced
    return n * 2  # I think this shows the answer because it follows the rule we practiced

def double_then_add(n, extra):  # I think this shows the answer because it follows the rule we practiced
    return double(n) + extra  # I think this shows the answer because it follows the rule we practiced

print(double_then_add(5, 1))  # I think this shows the answer because it follows the rule we practiced
# Step 6: Change it once, every call changes
def shout(word):  # I think this shows the answer because it follows the rule we practiced
    print(word + "!")  # I think this shows the answer because it follows the rule we practiced

shout("go")  # I think this shows the answer because it follows the rule we practiced

def shout(word):  # I think this shows the answer because it follows the rule we practiced
    print(word + "!!!")  # I think this shows the answer because it follows the rule we practiced

shout("go")  # I think this shows the answer because it follows the rule we practiced
shout("stop")  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read a procedure the way the exam does
def stars_line(count):  # I think this shows the answer because it follows the rule we practiced
    line = ""  # I think this shows the answer because it follows the rule we practiced
    for turn in range(count):  # I think this shows the answer because it follows the rule we practiced
        line = line + "*"  # I think this shows the answer because it follows the rule we practiced
    if count > 5:  # I think this shows the answer because it follows the rule we practiced
        line = line + "!"  # I think this shows the answer because it follows the rule we practiced
    return line  # I think this shows the answer because it follows the rule we practiced
print(stars_line(3))  # I think this shows the answer because it follows the rule we practiced
print(stars_line(7))  # I think this shows the answer because it follows the rule we practiced
def double(n):  # I think this shows the answer because it follows the rule we practiced
    return n * 2  # I think this shows the answer because it follows the rule we practiced
    def add_double(n, extra):  # I think this shows the answer because it follows the rule we practiced
        return double(n) + extra  # I think this shows the answer because it follows the rule we practiced
        print(add_double(5, 1))  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a fortune teller
# Fortune
import random  # I think this shows the answer because it follows the rule we practiced
def fortune(name, times):  # I think this shows the answer because it follows the rule we practiced
    for i in range(times):  # I think this shows the answer because it follows the rule we practiced
        number = random.randint(1, 3)  # I think this shows the answer because it follows the rule we practiced
    if number == 1:  # I think this shows the answer because it follows the rule we practiced
        print(name, "will have a great day")  # I think this shows the answer because it follows the rule we practiced
    elif number == 2:  # I think this shows the answer because it follows the rule we practiced
        print(name, "will learn something new")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print(name, "should try again tomorrow")  # I think this shows the answer because it follows the rule we practiced
fortune("Ana", 2)  # I think this shows the answer because it follows the rule we practiced
fortune("Ben", 3)  # I think this shows the answer because it follows the rule we practiced
