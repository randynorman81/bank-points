from gl import *
import projects
UNIT = Unit(17, "Create Performance Task", "Your own Create Task: the work plan and the final checklist.",
    "Big Idea 3: Algorithms and Programming", "#CA8A04", "#A16207", "#FACC15", "#FEF9C3", "rings",
    ["Plan the work in order with deadlines", "Check every requirement before submitting", "Avoid the common ways students lose a point"],
    [G("17.1", projects, "create-task-work-plan", after=[see(timeline("A nine-hour work plan", [(0, 1, "Plan", "Purpose, input, output."), (1, 4, "Code", "List, procedure, algorithm."), (4, 6, "Test", "Two calls, two results."), (6, 7, "Video", "60 seconds."), (7, 9, "Write", "Responses.")], 9, unit=" hr", caption="Leave time to test and record. Most lost points come from rushing the last two steps."))])],
    glossary=[("Create Task", "The 30%-of-score project: a program, a video, and written responses."), ("Requirement", "Something the rubric checks for a point."), ("Reference sheet", "Code segments you can use on exam day."), ("Checklist", "A final list to confirm every requirement is met.")],
    seed=17)
