#!inputs:10|10|10|10|10|10
# Step 1: Return a value and store it
def double(number):  # I think this shows the answer because it follows the rule we practiced
    return number * 2  # I think this shows the answer because it follows the rule we practiced

result = double(4)  # I think this shows the answer because it follows the rule we practiced
print(result)  # I think this shows the answer because it follows the rule we practiced
def square(n):  # I think this shows the answer because it follows the rule we practiced
    return n * n  # I think this shows the answer because it follows the rule we practiced
answer = square(6)  # I think this shows the answer because it follows the rule we practiced
print(answer)  # I think this shows the answer because it follows the rule we practiced
# Step 2: Use a returned value in math
def double(number):  # I think this shows the answer because it follows the rule we practiced
    return number * 2  # I think this shows the answer because it follows the rule we practiced

total = double(3) + double(10)  # I think this shows the answer because it follows the rule we practiced
print(total)  # I think this shows the answer because it follows the rule we practiced
print(double(5) + 1)  # I think this shows the answer because it follows the rule we practiced
# Step 3: print inside versus return
def show_double(n):  # I think this shows the answer because it follows the rule we practiced
    print(n * 2)  # I think this shows the answer because it follows the rule we practiced

def get_double(n):  # I think this shows the answer because it follows the rule we practiced
    return n * 2  # I think this shows the answer because it follows the rule we practiced

a = show_double(4)  # I think this shows the answer because it follows the rule we practiced
b = get_double(4)  # I think this shows the answer because it follows the rule we practiced
print(a)  # I think this shows the answer because it follows the rule we practiced
print(b)  # I think this shows the answer because it follows the rule we practiced
# Step 4: A call inside a call
def double(n):  # I think this shows the answer because it follows the rule we practiced
    return n * 2  # I think this shows the answer because it follows the rule we practiced

print(double(double(3)))  # I think this shows the answer because it follows the rule we practiced
print(double(double(double(1))))  # I think this shows the answer because it follows the rule we practiced
# Step 5: Return ends the function
def test():  # I think this shows the answer because it follows the rule we practiced
    return 1  # I think this shows the answer because it follows the rule we practiced
    print("never runs")  # I think this shows the answer because it follows the rule we practiced

print(test())  # I think this shows the answer because it follows the rule we practiced
x = test()  # I think this shows the answer because it follows the rule we practiced
print(x)  # I think this shows the answer because it follows the rule we practiced
# Step 6: Return text
def make_username(first, last):  # I think this shows the answer because it follows the rule we practiced
    return first[0] + last  # I think this shows the answer because it follows the rule we practiced

name = make_username("Ana", "Lopez")  # I think this shows the answer because it follows the rule we practiced
print(name)  # I think this shows the answer because it follows the rule we practiced
def full_name(first, last):  # I think this shows the answer because it follows the rule we practiced
    return first + " " + last  # I think this shows the answer because it follows the rule we practiced
print(full_name("Ana", "Lopez"))  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read RETURN the way the exam does
def double(n):  # I think this shows the answer because it follows the rule we practiced
    return n * 2  # I think this shows the answer because it follows the rule we practiced
result = double(4)  # I think this shows the answer because it follows the rule we practiced
print(result)  # I think this shows the answer because it follows the rule we practiced
print(double(double(3)))  # I think this shows the answer because it follows the rule we practiced
def test(n):  # I think this shows the answer because it follows the rule we practiced
    return n + 1  # I think this shows the answer because it follows the rule we practiced
    print(n)  # I think this shows the answer because it follows the rule we practiced
print(test(5))  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a shop total
# Shop
def total_cost(price, quantity):  # I think this shows the answer because it follows the rule we practiced
    return price * quantity  # I think this shows the answer because it follows the rule we practiced
def add_tax(amount):  # I think this shows the answer because it follows the rule we practiced
    return amount + amount / 10  # I think this shows the answer because it follows the rule we practiced
subtotal = total_cost(5, 3)  # I think this shows the answer because it follows the rule we practiced
print("Subtotal:", subtotal)  # I think this shows the answer because it follows the rule we practiced
final = add_tax(subtotal)  # I think this shows the answer because it follows the rule we practiced
print("With tax:", final)  # I think this shows the answer because it follows the rule we practiced
print("Two shirts:", add_tax(total_cost(20, 2)))  # I think this shows the answer because it follows the rule we practiced
