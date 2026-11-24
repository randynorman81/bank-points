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
