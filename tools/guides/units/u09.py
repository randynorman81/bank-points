from gl import *
UNIT = Unit(9, "Practice Performance Task: The Shopping List", "A second full practice program, this time with a different list and a different comparison.",
    "Big Idea 3: Algorithms and Programming", "#EA580C", "#C2410C", "#FB923C", "#FFEDD5", "pixels",
    ["Plan a Create Task program in four comment lines", "Label every requirement in a finished program", "Storyboard a 60-second video", "Build a reference sheet and answer the written prompts"],
    [F("9.1", "practice-pt-shopping-list.html", after=[see(timeline("The Shopping List video, second by second", [(0, 15, "INPUT", "Type a maximum price of 5."), (15, 35, "FUNCTIONALITY", "The program counts the affordable items."), (35, 50, "OUTPUT", "You can afford: 4 items stays on screen."), (50, 60, "AGAIN", "Run it with 2.")], 60, caption="The same four-part video plan works for any program."))])],
    glossary=[("Purpose", "The problem the program solves."), ("Input", "Data the user gives the program."), ("Output", "What the program shows because of the input and its work."), ("Functionality", "What the program does between input and output."), ("Procedure", "A named block of code. Yours must have a parameter that changes the result."), ("Call", "A line that runs the procedure."), ("List", "Stores related data, and must really be used."), ("Reference sheet", "Four segments of your code with no comments."), ("Written response", "A prompt about your own program, answered on exam day.")],
    seed=9)


from lesson import *

PS = 'def count_affordable(items, budget):\n    count = 0\n    for item in items:\n        if item <= budget:\n            count = count + 1\n    return count\n\nprices = [3, 8, 2, 5, 1, 9]\n'

def _run(limit, picks, extra=""):
    rows = ['1|', '8| prices=[3, 8, 2, 5, 1, 9]', '9| limit=%d' % limit, '10|', '2| items=[3, 8, 2, 5, 1, 9]; budget=%d; count=0' % limit]
    n = 0
    for p in [3, 8, 2, 5, 1, 9]:
        rows.append('3| item=%d' % p)
        if p <= limit: n += 1; rows.append('5| count=%d' % n)
    rows.append('10| result=%d' % n)
    return rows

def _t(limit, cap):
    code = PS + 'limit = int(input("Maximum price: "))\nresult = count_affordable(prices, limit)\nprint("You can afford:", result, "items")'
    return T("Maximum price %d" % limit, code, _run(limit, None), inp=[str(limit)], cap=cap)

EXTRA9 = {
 "9.1": X("Plan, build, label, and prepare a second full practice Create Task program.",
   [("budget", "the most the user can spend; the parameter that changes the answer"), ("<=", "less than or equal to: an item that costs exactly the budget IS affordable"), ("requirement label", "a note on a part of the code that shows which Create Task requirement it meets")],
   [_t(5, "With a budget of 5, the prices 3, 2, 5, and 1 are at or under the limit. The 5 counts because the test is <=. The result is 4."),
    _t(2, "With a budget of 2, only 2 and 1 pass. The result is 2."),
    _t(0, "With a budget of 0, nothing is affordable. The loop runs through every price and count stays 0, so the procedure returns 0."),
    T("The boundary: < versus <=", 'price = 5\nbudget = 5\nstrict = price < budget\ninclusive = price <= budget', ['1| price=5', '2| budget=5', '3| strict=False', '4| inclusive=True'], cap="A price exactly equal to the budget counts only with <=. A strict < would wrongly leave it out.")],
   [("`if item < budget:`", "A price equal to the budget is left out.", "`if item <= budget:`"), ("`limit = input(...)` with no `int()`", "TypeError: you cannot compare a number to text.", "`limit = int(input(...))`"), ("The `budget` parameter is never used", "Every call gives the same answer, so the parameter does not affect the result.", "Compare each item to `budget`"), ("Calling `count_affordable(prices)` with one argument", "TypeError: missing an argument.", "`count_affordable(prices, limit)`"),
    ("Printing inside the procedure and not returning", "The call has no value to store.", "`return count`"), ("`count = 0` inside the loop", "It resets on every price.", "Set it before the loop"), ("A comment in the PPR screenshot", "Zero on the whole task.", "Remove every `#`"), ("Copying the Color Counter exactly", "A practice program should change the topic and the logic.", "Change the topic, keep the structure")]),
}
apply(UNIT, EXTRA9)
