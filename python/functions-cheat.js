/* Python editor cheat sheet: Unit 5, functions and parameters (the AP exam calls them procedures).
   Same shape as the entries in codewords.js. Loaded after codewords.js, which defines L() and CODEWORDS. */
CODEWORDS.push(

{ id: "f-def", cls: "c-def", name: "function: define and call", sample: "def name():", title: "Functions: define them, then call them",
  intro: "A function is a named group of instructions. DEFINING it with def teaches Python the instructions and gives them a name, but does not run them. CALLING it, by writing its name with brackets, runs them. The AP exam calls a function a PROCEDURE.",
  sections: [
    { h: "The shape", ex: L(`
def welcome():                       # define: teach Python, nothing runs yet
    print("Welcome to the game!")    # the body is indented

welcome()                            # call: run it now
welcome()                            # call it again
`) },
    { h: "Define it ABOVE the line that calls it", rows: [["def greet(): ...  then  greet()", "works", "defined first, called after"], ["greet()  then  def greet(): ...", "NameError: name 'greet' is not defined", "Python reads top to bottom"], ["def greet(): ...  and no call", "nothing happens", "a def on its own does not run"]] },
    { h: "What happens at a call", list: ["Python jumps into the function and runs the body from the top.", "When the body ends (or a return runs), Python jumps back to the line right after the call.", "Calling it again runs the body again, so you write the instructions once and use them many times."] },
    { h: "On the AP exam", rows: [["PROCEDURE welcome() { DISPLAY(\"Hi\") }", "def welcome(): print(\"Hi\")", "the exam uses curly braces instead of a colon"], ["welcome()", "welcome()", "a call looks the same"]] },
    { h: "Why functions help", list: ["Less repeated code.", "Change the instructions in one place and every call changes.", "Easier to read, because the name says what the group of lines does.", "Easier to test in small pieces."] },
    { h: "Practice (click to see the answer)", quiz: [["You wrote def hello(): but nothing prints. What is missing?", "A call: hello() on a line after the def."], ["Which runs the instructions: the def line or the call?", "The call."], ["What does the exam call a function?", "A procedure."]] }
  ] },

{ id: "f-param", cls: "c-def", name: "parameters and arguments", sample: "def f(a, b):", title: "Parameters and arguments: giving a function data",
  intro: "A PARAMETER is a variable in the def line that receives data. An ARGUMENT is the actual value you pass in when you call the function. Arguments are matched to parameters BY POSITION: the first argument goes into the first parameter, the second into the second.",
  sections: [
    { h: "The shape", ex: L(`
def describe(name, age):       # name and age are the PARAMETERS
    print(name, "is", age)

describe("Ana", 16)            # "Ana" and 16 are the ARGUMENTS
describe("Ben", 15)
`) },
    { h: "Which is which", rows: [["name, age in the def line", "parameters", "the variables that receive data"], ["\"Ana\", 16 in the call", "arguments", "the values that go in"], ["describe(\"Ana\", 16)", "name is \"Ana\", age is 16", "matched by position"]] },
    { h: "Order and count matter", rows: [["subtract(10, 3)", "a is 10, b is 3", "for a - b the answer is 7"], ["subtract(3, 10)", "a is 3, b is 10", "for a - b the answer is -7"], ["add(5)", "TypeError: missing 1 required argument", "too few arguments"], ["add(1, 2, 3)", "TypeError: takes 2 arguments but 3 were given", "too many arguments"]] },
    { h: "Good to know", list: ["The names in the call do not have to match the parameter names. Position decides.", "A parameter only exists while the function runs.", "Swapped arguments often give a wrong answer with NO error message, so always check the order.", "The argument can be a value, a variable, or any expression: greet(player), double(2 + 3)."] },
    { h: "On the AP exam", rows: [["PROCEDURE showSum(a, b) { DISPLAY(a + b) }", "def show_sum(a, b): print(a + b)", "parameters in brackets"], ["showSum(2, 3)", "show_sum(2, 3)", "a is 2, b is 3"]] },
    { h: "Practice (click to see the answer)", quiz: [["In def area(w, h): which are the parameters?", "w and h"], ["In area(4, 5) which are the arguments?", "4 and 5"], ["With def subtract(a, b): return a - b, what is subtract(2, 9)?", "-7"]] }
  ] },

{ id: "f-return", cls: "c-def", name: "return", sample: "return value", title: "return: handing an answer back",
  intro: "print only shows something on the screen. return sends a value BACK to the line that called the function, so the rest of the program can store it, calculate with it, or print it. As soon as a return runs, the function ENDS.",
  sections: [
    { h: "The shape", ex: L(`
def double(number):
    return number * 2

result = double(4)            # the call becomes 8, which is stored
print(result)                 # 8
print(double(5) + 1)          # double(5) becomes 10, then + 1 is 11
print(double(double(3)))      # inside out: double(3) is 6, then double(6) is 12
`) },
    { h: "print versus return", rows: [["print(n * 2)", "shows it, gives nothing back", "the call has no value (it is None)"], ["return n * 2", "gives it back, shows nothing", "store it or use it in math"]] },
    { h: "return ends the function", ex: L(`
def test():
    return 1
    print("never runs")      # skipped: return already ended the function

print(test())                # 1
`) },
    { h: "Return in decisions and loops", ex: L(`
def bigger(a, b):
    if a > b:
        return a             # only one return runs
    return b

def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total             # AFTER the loop, not inside it

def is_even(n):
    return n % 2 == 0        # a comparison is already True or False
`) },
    { h: "On the AP exam", rows: [["RETURN(n * 2)", "return n * 2", "send a value back, and end the procedure"], ["result ← double(4)", "result = double(4)", "store what comes back"], ["DISPLAY(double(4))", "print(double(4))", "show what comes back"]] },
    { h: "Watch out", list: ["No return means the call gives back None.", "A return inside a loop ends the whole function on the first pass.", "If no return runs on some path, the function gives back None for that path.", "return True sends back the Boolean. return \"True\" sends back the word."] },
    { h: "Practice (click to see the answer)", quiz: [["With def f(n): return n + 1, what does print(f(f(1))) show?", "3"], ["What does a function with no return give back?", "None"], ["Does print(\"x\") after a return run?", "No. The function has already ended."]] }
  ] },

{ id: "f-lib", cls: "c-builtin", name: "import, libraries and APIs", sample: "import math", title: "Libraries and APIs: using procedures other people wrote",
  intro: "A LIBRARY is a collection of ready-made procedures. An API (application program interface) is the description of how to use them: each procedure's name, its parameters, and what it returns. The DOCUMENTATION is where you read it. You do not need to know how a library procedure works inside, only how to call it.",
  sections: [
    { h: "How to use one", ex: L(`
import math                      # load the library (once, at the top)

print(math.sqrt(16))             # 4.0   library name, a dot, the procedure
print(abs(-7))                   # 7     built in: no import needed
print(round(3.14159, 2))         # 3.14
print(pow(2, 3))                 # 8     pow(base, exponent)
print(max(3, 9, 5))              # 9
`) },
    { h: "Reading documentation", rows: [["name", "round", "what to call"], ["parameters", "number, digits", "what to pass in, and in what ORDER"], ["returns", "a rounded number", "what comes back"], ["what it does", "keeps digits places after the decimal point", "the behavior in plain words"]] },
    { h: "On the AP exam", list: ["Libraries make programs easier to build, because you reuse tested code.", "An API specifies how the procedures in a library behave and how to use them.", "Documentation is necessary to understand what an API's procedures do.", "You may see documentation for a procedure you have never met. Match the arguments to the parameters by position, then work out what comes back.", "The exam has one library procedure you know already: RANDOM(a, b), the same as random.randint(a, b)."] },
    { h: "Common errors", rows: [["print(math.sqrt(9))  (no import)", "NameError: name 'math' is not defined", "add import math at the top"], ["pow(3, 2) when you meant 2 to the power of 3", "9 instead of 8", "arguments in the wrong order: check the documentation"], ["math.sqroot(9)", "AttributeError", "a typo in the procedure name"]] },
    { h: "Practice (click to see the answer)", quiz: [["What line loads the math library?", "import math"], ["Why do programmers use libraries?", "To reuse tested code instead of rewriting it, which makes complex programs easier to build."], ["What does the documentation tell you?", "The procedure's name, its parameters (and their order), and what it returns."]] }
  ] }

);
