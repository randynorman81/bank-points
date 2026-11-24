from gl import *
import projects
UNIT = Unit(17, "Create Performance Task", "Your own Create Task: the work plan and the final checklist.",
    "Big Idea 3: Algorithms and Programming", "#CA8A04", "#A16207", "#FACC15", "#FEF9C3", "rings",
    ["Plan the work in order with deadlines", "Check every requirement before submitting", "Avoid the common ways students lose a point"],
    [G("17.1", projects, "create-task-work-plan", after=[see(timeline("A nine-hour work plan", [(0, 1, "Plan", "Purpose, input, output."), (1, 4, "Code", "List, procedure, algorithm."), (4, 6, "Test", "Two calls, two results."), (6, 7, "Video", "60 seconds."), (7, 9, "Write", "Responses.")], 9, unit=" hr", caption="Leave time to test and record. Most lost points come from rushing the last two steps."))])],
    glossary=[("Create Task", "The 30%-of-score project: a program, a video, and written responses."), ("Requirement", "Something the rubric checks for a point."), ("Reference sheet", "Code segments you can use on exam day."), ("Checklist", "A final list to confirm every requirement is met.")],
    seed=17)


from lesson import *

EXTRA17 = {
 "17.1": X("Plan your Create Task day by day, and check every requirement before you submit.",
   [("work plan", "a schedule that spends your time in the right order"), ("checklist", "a list you tick off only when you can show it"), ("requirement", "something the scoring rubric checks for a point")],
   [T("Add up your hours", 'hours = [1, 3, 2, 1, 1, 1]\ntotal = 0\nfor h in hours:\n    total = total + h\nleft = 9 - total', ['1| hours=[1, 3, 2, 1, 1, 1]', '2| total=0', '3| h=1', '4| total=1', '3| h=3', '4| total=4', '3| h=2', '4| total=6', '3| h=1', '4| total=7', '3| h=1', '4| total=8', '3| h=1', '4| total=9', '5| left=0'], cap="The plan uses 9 hours, which is the amount of class time you get. Nothing is left for surprises, so leave a spare half hour."),
    T("Count what is ready", 'checks = [True, True, False, True, False, True]\nready = 0\nfor c in checks:\n    if c:\n        ready = ready + 1', ['1| checks=[True, True, False, True, False, True]', '2| ready=0', '3| c=True', '5| ready=1', '3| c=True', '5| ready=2', '3| c=False', '3| c=True', '5| ready=3', '3| c=False', '3| c=True', '5| ready=4'], cap="Four of six checks pass. Two are not ready. Tick a box only when you could show it right now."),
    T("Is it ready to submit?", 'ready = 4\nneeded = 6\nsubmit = ready == needed\nmissing = needed - ready', ['1| ready=4', '2| needed=6', '3| submit=False', '4| missing=2'], cap="Only submit when every requirement is met. After you submit as final, you cannot change it."),
    T("Run your own program twice", 'def count_matches(items, target):\n    count = 0\n    for item in items:\n        if item == target:\n            count = count + 1\n    return count\n\nfirst = count_matches(["a", "b", "a"], "a")\nsecond = count_matches(["a", "b", "a"], "z")', ['1|', '8|', '2| items=["a", "b", "a"]; target="a"; count=0', '3| item="a"', '5| count=1', '3| item="b"', '3| item="a"', '5| count=2', '8| first=2', '9|', '2| target="z"; count=0', '3| item="a"', '3| item="b"', '3| item="a"', '9| second=0'], cap="Two calls with different arguments return different results: 2 and 0. This is the testing you need to show.")],
   [("Starting the video the night before", "No time to fix problems.", "Record after testing, with a day to spare"), ("Leaving the written responses for the end", "You may not be able to answer from your own code.", "Draft answers early, using real lines"), ("A parameter that does not change the result", "The procedure requirement fails.", "Test two different arguments"), ("No selection or iteration inside the procedure", "Requirement missing.", "Both must be in the procedure"),
    ("Comments in the PPR", "Zero for the whole task.", "Delete every `#` line"), ("Forgetting to credit code or AI help", "Plagiarism.", "Add a credit comment in the program PDF"), ("Submitting without checking the file types and sizes", "It may not be accepted.", "Check the video and the PDF"), ("Working with a partner on the video", "It must be your own.", "Work alone")]),
}
apply(UNIT, EXTRA17)
