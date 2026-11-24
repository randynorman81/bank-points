from gl import *
import projects
UNIT = Unit(15, "Practice PT: Personal Data Tracker", "A third practice Create Task, built around a program that tracks personal data.",
    "Big Idea 3: Algorithms and Programming", "#0284C7", "#0369A1", "#38BDF8", "#E0F2FE", "pixels",
    ["Plan a tracker program in four comment lines", "Label every Create Task requirement in finished code", "Storyboard a 60-second video", "Draft the written responses"],
    [G("15.1", projects, "practice-pt-data-tracker", after=[see(timeline("The tracker video, second by second", [(0, 12, "INPUT", "Enter a number of minutes studied."), (12, 35, "FUNCTIONALITY", "The program adds it to the list and finds the weekly total."), (35, 50, "OUTPUT", "The total and a message appear."), (50, 60, "AGAIN", "Run it with a second value.")], 60, caption="Every Create Task video shows input, functionality, and output in about a minute."),
          annot_code("The heart of a tracker", "minutes = []\ndef add_day(m):\n    minutes.append(m)\n    return sum(minutes) / len(minutes)\nprint(add_day(45))",
          [(0, "minutes = []", "The LIST: it stores the data and must be used by the procedure."), (1, "def add_day(m)", "The PROCEDURE has a parameter m that changes the result."), (3, "sum(minutes) / len(minutes)", "The algorithm: sequencing, selection or iteration, and a calculation.")], output=["45.0"], caption="One list, one procedure with a parameter, and one call cover the core requirements."))])],
    glossary=[("List", "Stores related data. It must really be used."), ("Procedure", "A named block of code with a parameter that changes its behavior."), ("Parameter", "A variable a procedure receives when it is called."), ("Algorithm", "Steps that use sequencing, selection, and iteration."), ("Call", "A line that runs the procedure."), ("Reference sheet", "Code segments you may use on exam day."), ("Storyboard", "A plan of what the video shows and when.")],
    seed=15)


from lesson import *

DT = 'goal = int(input("Daily step goal: "))\nsteps = [4200, 8100, 6500, 9800, 7300]\n\ndef days_at_goal(data, target):\n    count = 0\n    for day in data:\n        if day >= target:\n            count = count + 1\n    return count\n\ndef average(data):\n    total = 0\n    for day in data:\n        total = total + day\n    return total / len(data)\n\nresult = days_at_goal(steps, goal)\navg = average(steps)'

def _dt(goal, hits):
    rows = ['1| goal=%d' % goal, '2| steps=[4200, 8100, 6500, 9800, 7300]', '4|', '11|', '17|', '5| data=[4200, 8100, 6500, 9800, 7300]; target=%d; count=0' % goal]
    n = 0
    for d in [4200, 8100, 6500, 9800, 7300]:
        rows.append('6| day=%d' % d)
        if d >= goal: n += 1; rows.append('8| count=%d' % n)
    rows.append('17| result=%d' % n)
    return rows

EXTRA15 = {
 "15.1": X("Plan, build, label, and prepare a third practice program: a personal data tracker with two procedures.",
   [("tracker", "a program that stores and reports your own data over time"), ("procedure with two parameters", "`days_at_goal(data, target)`: the list and the goal"), ("summary", "one number that describes many, like an average")],
   [T("Goal 7000", DT, _dt(7000, None), inp=["7000"], cap="With a goal of 7,000 steps, the days 8100, 9800, and 7300 reach it. The procedure returns 3."),
    T("Goal 10000", DT, _dt(10000, None), inp=["10000"], cap="No day reaches 10,000, so count never increases and the procedure returns 0."),
    T("The average procedure", 'def average(data):\n    total = 0\n    for day in data:\n        total = total + day\n    return total / len(data)\n\navg = average([4200, 8100, 6500, 9800, 7300])', ['1|', '7|', '2| data=[4200, 8100, 6500, 9800, 7300]; total=0', '3| day=4200', '4| total=4200', '3| day=8100', '4| total=12300', '3| day=6500', '4| total=18800', '3| day=9800', '4| total=28600', '3| day=7300', '4| total=35900', '7| avg=7180.0'], cap="The loop adds all five days to 35,900. Dividing by the 5 days gives an average of 7,180 steps."),
    T("The boundary: >=", 'day = 7000\ntarget = 7000\nhit = day >= target\nmiss = day > target', ['1| day=7000', '2| target=7000', '3| hit=True', '4| miss=False'], cap="A day that exactly equals the goal counts with >=. With > it would be missed.")],
   [("`if day > target:` when equal days should count", "The boundary day is left out.", "`>=`"), ("A procedure that prints instead of returning", "The call cannot be stored.", "`return count`"), ("`average` dividing by 5 instead of `len(data)`", "Breaks when days are added.", "`len(data)`"), ("`goal = input(...)` without `int()`", "TypeError when comparing.", "`int(input(...))`"),
    ("The `target` parameter never used", "The point is lost.", "Compare each day to `target`"), ("Only one procedure uses the list", "Two segments of the list help the PPR.", "Show where it is created and where it is used"), ("Personal data you should not share", "The video must not show personal information.", "Use made-up numbers"), ("Reusing the earlier practice programs", "Change the topic and the logic.", "A new idea each time")]),
}
apply(UNIT, EXTRA15)
