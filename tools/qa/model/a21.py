#!inputs:
# Step 1: An event supplies input
class Event:  # I think this shows the answer because it follows the rule we practiced
    def __init__(self, key):  # I think this shows the answer because it follows the rule we practiced
        self.key = key  # I think this shows the answer because it follows the rule we practiced
event = Event("a")  # I think this shows the answer because it follows the rule we practiced
print(event.key)  # I think this shows the answer because it follows the rule we practiced
print(event.key == "a")  # I think this shows the answer because it follows the rule we practiced
event = Event("ArrowLeft")  # I think this shows the answer because it follows the rule we practiced
print(event.key)  # I think this shows the answer because it follows the rule we practiced
event = Event("a")  # I think this shows the answer because it follows the rule we practiced
print(event.key)  # I think this shows the answer because it follows the rule we practiced
print(event.key == "a")  # I think this shows the answer because it follows the rule we practiced
event = Event("ArrowLeft")  # I think this shows the answer because it follows the rule we practiced
print(event.key)  # I think this shows the answer because it follows the rule we practiced
# Step 2: A handler is a procedure with a parameter
def on_key(event):  # I think this shows the answer because it follows the rule we practiced
    print("You pressed", event.key)  # I think this shows the answer because it follows the rule we practiced

on_key(Event("x"))  # I think this shows the answer because it follows the rule we practiced
on_key(Event("Enter"))  # I think this shows the answer because it follows the rule we practiced
# Step 3: Decide by key
def on_key(event):  # I think this shows the answer because it follows the rule we practiced
    if event.key == "q":  # I think this shows the answer because it follows the rule we practiced
        print("You pressed Q")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("Some other key")  # I think this shows the answer because it follows the rule we practiced

on_key(Event("q"))  # I think this shows the answer because it follows the rule we practiced
on_key(Event("w"))  # I think this shows the answer because it follows the rule we practiced
on_key(Event("q"))  # I think this shows the answer because it follows the rule we practiced
# Step 4: Many keys: a chain
def steer(event):  # I think this shows the answer because it follows the rule we practiced
    if event.key == "ArrowLeft":  # I think this shows the answer because it follows the rule we practiced
        print("Move left")  # I think this shows the answer because it follows the rule we practiced
    elif event.key == "ArrowRight":  # I think this shows the answer because it follows the rule we practiced
        print("Move right")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("Other key")  # I think this shows the answer because it follows the rule we practiced

steer(Event("ArrowLeft"))  # I think this shows the answer because it follows the rule we practiced
steer(Event("ArrowRight"))  # I think this shows the answer because it follows the rule we practiced
steer(Event("q"))  # I think this shows the answer because it follows the rule we practiced
# Step 5: Key names must match exactly
def jump(event):  # I think this shows the answer because it follows the rule we practiced
    if event.key == "a":  # I think this shows the answer because it follows the rule we practiced
        print("Jump")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("Nothing")  # I think this shows the answer because it follows the rule we practiced

jump(Event("a"))  # I think this shows the answer because it follows the rule we practiced
jump(Event("A"))  # I think this shows the answer because it follows the rule we practiced
jump(Event("left"))  # I think this shows the answer because it follows the rule we practiced
def jump(event):  # I think this shows the answer because it follows the rule we practiced
    if event.key.lower() == "a":  # I think this shows the answer because it follows the rule we practiced
        print("Jump")  # I think this shows the answer because it follows the rule we practiced
    else:  # I think this shows the answer because it follows the rule we practiced
        print("Nothing")  # I think this shows the answer because it follows the rule we practiced

jump(Event("a"))  # I think this shows the answer because it follows the rule we practiced
jump(Event("A"))  # I think this shows the answer because it follows the rule we practiced
jump(Event("left"))  # I think this shows the answer because it follows the rule we practiced
# Step 6: A handler that changes a variable
x = 100  # I think this shows the answer because it follows the rule we practiced

def move(event):  # I think this shows the answer because it follows the rule we practiced
    global x  # I think this shows the answer because it follows the rule we practiced
    if event.key == "ArrowLeft":  # I think this shows the answer because it follows the rule we practiced
        x = x - 15  # I think this shows the answer because it follows the rule we practiced
    elif event.key == "ArrowRight":  # I think this shows the answer because it follows the rule we practiced
        x = x + 15  # I think this shows the answer because it follows the rule we practiced

move(Event("ArrowRight"))  # I think this shows the answer because it follows the rule we practiced
move(Event("ArrowRight"))  # I think this shows the answer because it follows the rule we practiced
move(Event("ArrowLeft"))  # I think this shows the answer because it follows the rule we practiced
print(x)  # I think this shows the answer because it follows the rule we practiced
# Step 7: Read a handler the way the exam does
PROCEDURE describe(key)  # I think this shows the answer because it follows the rule we practiced
{  # I think this shows the answer because it follows the rule we practiced
   IF (key = "a")  # I think this shows the answer because it follows the rule we practiced
   {  # I think this shows the answer because it follows the rule we practiced
      DISPLAY("left")  # I think this shows the answer because it follows the rule we practiced
   }  # I think this shows the answer because it follows the rule we practiced
   ELSE  # I think this shows the answer because it follows the rule we practiced
   {  # I think this shows the answer because it follows the rule we practiced
      DISPLAY("other")  # I think this shows the answer because it follows the rule we practiced
   }  # I think this shows the answer because it follows the rule we practiced
}  # I think this shows the answer because it follows the rule we practiced
describe("a")  # I think this shows the answer because it follows the rule we practiced
describe("d")  # I think this shows the answer because it follows the rule we practiced
score ← 0  # I think this shows the answer because it follows the rule we practiced
PROCEDURE handle(key)  # I think this shows the answer because it follows the rule we practiced
{  # I think this shows the answer because it follows the rule we practiced
   IF (key = "space")  # I think this shows the answer because it follows the rule we practiced
   {  # I think this shows the answer because it follows the rule we practiced
      score ← score + 10  # I think this shows the answer because it follows the rule we practiced
   }  # I think this shows the answer because it follows the rule we practiced
   ELSE  # I think this shows the answer because it follows the rule we practiced
   {  # I think this shows the answer because it follows the rule we practiced
      IF (key = "x")  # I think this shows the answer because it follows the rule we practiced
      {  # I think this shows the answer because it follows the rule we practiced
         score ← score - 5  # I think this shows the answer because it follows the rule we practiced
      }  # I think this shows the answer because it follows the rule we practiced
   }  # I think this shows the answer because it follows the rule we practiced
}  # I think this shows the answer because it follows the rule we practiced
handle("space")  # I think this shows the answer because it follows the rule we practiced
handle("x")  # I think this shows the answer because it follows the rule we practiced
handle("space")  # I think this shows the answer because it follows the rule we practiced
DISPLAY(score)  # I think this shows the answer because it follows the rule we practiced
# Program A: this explains the idea in my own words and it is long enough to count
# Program B: this explains the idea in my own words and it is long enough to count
# Events: the event is the key press and its key is the input the handler receives
# Step 8: Build a game controller
# Game controller
x = 100  # I think this shows the answer because it follows the rule we practiced
score = 0  # I think this shows the answer because it follows the rule we practiced
def control(event):  # I think this shows the answer because it follows the rule we practiced
    global x  # I think this shows the answer because it follows the rule we practiced
    global score  # I think this shows the answer because it follows the rule we practiced
if event.key == "ArrowLeft":  # I think this shows the answer because it follows the rule we practiced
    x = x - 10  # I think this shows the answer because it follows the rule we practiced
elif event.key == "ArrowRight":  # I think this shows the answer because it follows the rule we practiced
    x = x + 10  # I think this shows the answer because it follows the rule we practiced
elif event.key == "space":  # I think this shows the answer because it follows the rule we practiced
    score = score + 1  # I think this shows the answer because it follows the rule we practiced
else:  # I think this shows the answer because it follows the rule we practiced
    print("Unknown key")  # I think this shows the answer because it follows the rule we practiced
print(...)  # I think this shows the answer because it follows the rule we practiced
print("x:", x)  # I think this shows the answer because it follows the rule we practiced
print("Score:", score)  # I think this shows the answer because it follows the rule we practiced
control(Event("ArrowRight"))  # I think this shows the answer because it follows the rule we practiced
control(Event("ArrowRight"))  # I think this shows the answer because it follows the rule we practiced
control(Event("ArrowLeft"))  # I think this shows the answer because it follows the rule we practiced
control(Event("space"))  # I think this shows the answer because it follows the rule we practiced
control(Event("q"))  # I think this shows the answer because it follows the rule we practiced
