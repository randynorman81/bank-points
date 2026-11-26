#!inputs:10|10|10|10|10|10
# Step 1: Two parameters
def add(a, b):  # I think this shows the answer because it follows the rule we practiced
    print(a + b)  # I think this shows the answer because it follows the rule we practiced

add(2, 3)  # I think this shows the answer because it follows the rule we practiced
add(10, 25)  # I think this shows the answer because it follows the rule we practiced
def multiply(x, y):  # I think this shows the answer because it follows the rule we practiced
    print(x * y)  # I think this shows the answer because it follows the rule we practiced
multiply(4, 5)  # I think this shows the answer because it follows the rule we practiced
multiply(6, 7)  # I think this shows the answer because it follows the rule we practiced
# Step 2: The order matters
def subtract(a, b):  # I think this shows the answer because it follows the rule we practiced
    print(a - b)  # I think this shows the answer because it follows the rule we practiced

subtract(10, 3)  # I think this shows the answer because it follows the rule we practiced
subtract(3, 10)  # I think this shows the answer because it follows the rule we practiced
subtract(100, 1)  # I think this shows the answer because it follows the rule we practiced
# Step 3: Area of a triangle
def triangle_area(base, height):  # I think this shows the answer because it follows the rule we practiced
    print(base * height / 2)  # I think this shows the answer because it follows the rule we practiced

triangle_area(6, 4)  # I think this shows the answer because it follows the rule we practiced
triangle_area(10, 3)  # I think this shows the answer because it follows the rule we practiced
def rectangle_area(width, height):  # I think this shows the answer because it follows the rule we practiced
    print(width * height)  # I think this shows the answer because it follows the rule we practiced
rectangle_area(5, 8)  # I think this shows the answer because it follows the rule we practiced
rectangle_area(3, 3)  # I think this shows the answer because it follows the rule we practiced
# Step 4: Mixed types and a swapped call
def contact(name, phone):  # I think this shows the answer because it follows the rule we practiced
    print(name + ": " + phone)  # I think this shows the answer because it follows the rule we practiced

contact("Mom", "555-0100")  # I think this shows the answer because it follows the rule we practiced
contact("555-0100", "Mom")  # I think this shows the answer because it follows the rule we practiced
contact("Dad", "555-0199")  # I think this shows the answer because it follows the rule we practiced
# Step 5: Three parameters, and the wrong count
def average(a, b, c):  # I think this shows the answer because it follows the rule we practiced
    print((a + b + c) / 3)  # I think this shows the answer because it follows the rule we practiced

average(80, 90, 100)  # I think this shows the answer because it follows the rule we practiced
average(60, 70, 80)  # I think this shows the answer because it follows the rule we practiced
# average(80, 90)  # this call would crash because average needs three arguments and only two were given
# Step 6: Variables as arguments
def label(first, second):  # I think this shows the answer because it follows the rule we practiced
    print(first, "then", second)  # I think this shows the answer because it follows the rule we practiced

x = "A"  # I think this shows the answer because it follows the rule we practiced
y = "B"  # I think this shows the answer because it follows the rule we practiced
label(x, y)  # I think this shows the answer because it follows the rule we practiced
label(y, x)  # I think this shows the answer because it follows the rule we practiced
label(x, x)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read two parameters the way the exam does
def show_difference(a, b):  # I think this shows the answer because it follows the rule we practiced
    print(a - b)  # I think this shows the answer because it follows the rule we practiced
show_difference(9, 4)  # I think this shows the answer because it follows the rule we practiced
show_difference(4, 9)  # I think this shows the answer because it follows the rule we practiced
def introduce(name, age):  # I think this shows the answer because it follows the rule we practiced
    print(name)  # I think this shows the answer because it follows the rule we practiced
    print(age)  # I think this shows the answer because it follows the rule we practiced
introduce("Ana", 16)  # I think this shows the answer because it follows the rule we practiced
# Step 8: Build a rectangle report
# Rectangle
def rectangle(width, height):  # I think this shows the answer because it follows the rule we practiced
    area = width * height  # I think this shows the answer because it follows the rule we practiced
    perimeter = 2 * (width + height)  # I think this shows the answer because it follows the rule we practiced
    print("Area:", area)  # I think this shows the answer because it follows the rule we practiced
    print("Perimeter:", perimeter)  # I think this shows the answer because it follows the rule we practiced
rectangle(5, 3)  # I think this shows the answer because it follows the rule we practiced
rectangle(10, 2)  # I think this shows the answer because it follows the rule we practiced
w = int(input("Width? "))  # I think this shows the answer because it follows the rule we practiced
h = int(input("Height? "))  # I think this shows the answer because it follows the rule we practiced
rectangle(w, h)  # I think this shows the answer because it follows the rule we practiced
