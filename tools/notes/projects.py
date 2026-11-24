"""Units 13, 15, 17: the project units.
13 Project: Present a Data-Driven Insight (a guide), 15 Practice PT 3: Personal Data Tracker (same layout as the other practice-task notes),
17 Create Performance Task (the work plan and final checklist; the rules and scoring pages already exist)."""
from lib import *

U13 = Unit("unit-13", "Unit 13: Project: Present a Data-Driven Insight", 13,
           [("data-insight-project.html", "13.1 Data Insight Project")],
           {"data-insight-project.html": "Present a Data-Driven Insight: Project Guide (13.1)"},
           {"data-insight-project.html": "a217"})
U15 = Unit("unit-15", "Unit 15: Practice PT: Personal Data Tracker", 15,
           [("practice-pt-data-tracker.html", "15.1 Practice PT 3")],
           {"practice-pt-data-tracker.html": "Practice PT 3: Personal Data Tracker (15.1)"},
           {"practice-pt-data-tracker.html": "a218"})
U17 = Unit("unit-17", "Unit 17: Create Performance Task", 17,
           [("create-task-work-plan.html", "17.1 Work Plan and Final Checklist")],
           {"create-task-work-plan.html": "Create Task Work Plan and Final Checklist (17.1)"})


# ==========================================================================================  13.1 DATA INSIGHT PROJECT
def data_insight_project():
    check = widget("wginsight", "Try it: is it a strong insight statement?",
                   "An insight is a claim the data supports. Fill in the three parts and see what a reviewer would say.",
                   '<div class="row"><label style="width:100%">The question you asked <input type="text" class="q" value="Do students who sleep more score higher on tests?" style="width:100%"></label></div><div class="row"><label style="width:100%">What the data shows (use a number) <input type="text" class="f" value="Students who slept 8 or more hours averaged 89.6, about 17 points higher than the others." style="width:100%"></label></div><div class="row"><label style="width:100%">A limit of the data <input type="text" class="l" value="This is only 10 students, and sleep may not be the cause." style="width:100%"></label></div><div class="out"></div>',
                   r"""
var q=root.querySelector(".q"),f=root.querySelector(".f"),l=root.querySelector(".l"),out=root.querySelector(".out");
function ok(b,t){return'<div style="margin:5px 0;color:'+(b?"#A3E635":"#FBBF24")+'">'+(b?"&#10003; ":"&#9873; ")+t+'</div>'}
function upd(){var fq=q.value.trim(),ff=f.value.trim(),fl=l.value.trim();
 var hasNum=/\d/.test(ff),compare=/(more|less|higher|lower|than|increase|decrease|rose|fell|compared|average|averaged|percent|%)/i.test(ff),causal=/(cause|causes|caused|because of|leads to|makes)/i.test(ff),lim=/(only|small|sample|may not|might|not prove|correlat|limit|but|however|bias|missing|unknown)/i.test(fl);
 out.innerHTML=ok(/\?\s*$/.test(fq),"The question ends with a question mark and can be answered with data.")+ok(hasNum,"The finding includes a <b>specific number</b>.")+ok(compare,"The finding <b>compares</b> two things or describes a change.")+ok(!causal,"It does not claim <b>causation</b> from a correlation.")+ok(lim&&fl.length>15,"It states a <b>limit</b> of the data (small sample, possible bias, or correlation).")+
 '<div class="note">'+((/\?\s*$/.test(fq)&&hasNum&&compare&&!causal&&lim)?"<b>Strong.</b> A reviewer could check every part against your chart.":"Fix the flagged items. A good insight is specific, supported by a number, honest about its limits, and does not overclaim.")+'</div>'}
root.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "What Is a Data-Driven Insight?",
             "An <b>insight</b> is something you learned from data that was not obvious before, stated clearly and backed up by <b>evidence</b>. \"Students who slept 8 or more hours averaged 17 points higher on the test\" is an insight. \"Sleep is important\" is just an opinion.",
             tbl(["Part", "What it is", "Example"], [
                 ["<b>Question</b>", "what you wanted to find out", "Do students who sleep more score higher?"],
                 ["<b>Data</b>", "where the evidence came from", "a survey of 120 students, with sleep and test scores"],
                 ["<b>Finding</b>", "what the numbers show", "the 8-hour group averaged 89.6, the others 73.0"],
                 ["<b>Visual</b>", "a chart that shows the finding at a glance", "a bar chart of the two averages"],
                 ["<b>Limit</b>", "what the data cannot tell you", "it shows a link, not that sleep causes higher scores"],
             ])),
        part(1, "The Seven Steps",
             "Follow the same process every time. Each step uses something from the Data unit.",
             tbl(["Step", "What you do", "Notes to review"], [
                 ["<b>1. Ask</b>", "choose one clear question that data can answer", "Extracting Information (12.1)"],
                 ["<b>2. Find data</b>", "pick a credible source with enough rows", "Big Data and Metadata (12.2)"],
                 ["<b>3. Clean</b>", "fix missing, duplicate, and impossible values; keep the original", "Cleaning Data (12.3)"],
                 ["<b>4. Analyze</b>", "filter, summarize, and compare with loops in Python", "Filtering and Transforming (12.4)"],
                 ["<b>5. Visualize</b>", "choose the right chart, start bars at zero, label everything", "Visualizing Data (12.5)"],
                 ["<b>6. Tell the story</b>", "state the insight, the evidence, and the limits", "Bias and Sampling (12.6)"],
                 ["<b>7. Cite</b>", "credit the data source and any code you borrowed", "Copyright and Open Source (16.2)"],
             ])),
        part(2, "Choosing a Data Set",
             "A good data set makes the project easy. A bad one makes it impossible.",
             two(box("Look for", "A <b>credible source</b> (a government agency, a university, a respected organization). <b>Enough rows</b> to see a pattern (dozens at least). <b>Clear columns</b> with units. A date or version. Permission or an open license to use it.", "ok"),
                 box("Avoid", "Data with <b>names or other PII</b> about real people. Unknown sources. Tiny samples. Data that <b>cannot answer your question</b>. Data collected in a way that is obviously biased.", "bad")),
             tbl(["Kind", "Examples"], [["Government and science", "weather and climate data, census and public health numbers"], ["Sports and games", "season statistics, scores, player records"], ["School and community", "a survey you collect yourself, with consent and no names"], ["Technology", "app usage numbers, public data about the Internet"]])),
        part(3, "Write the Insight",
             "Before you build any slides, write the insight as <b>one or two sentences</b> and check it.",
             check,
             warn("<b>Correlation is not causation.</b> If your data only shows two things move together, say <i>\"are linked\"</i> or <i>\"go together\"</i>, not <i>\"causes\"</i>.")),
        part(4, "The Presentation",
             "Keep it short. Every slide earns its place.",
             tbl(["Slide", "What it says"], [
                 ["<b>1. The question</b>", "what you asked and why it matters"],
                 ["<b>2. The data</b>", "where it came from, how many rows, and how you cleaned it"],
                 ["<b>3. The method</b>", "what you calculated (a short Python snippet or a plain-words description)"],
                 ["<b>4. The chart</b>", "one honest chart with a title, labels, and units"],
                 ["<b>5. The insight</b>", "your one-sentence finding, with the number"],
                 ["<b>6. Limits and next steps</b>", "what the data cannot show, and what you would do next"],
                 ["<b>Sources</b>", "credit for the data and any code you borrowed"],
             ]),
             quiz("qz13a", [
                 ("Which is the best example of a <b>data-driven insight</b>?", ["Sleep is important for students.", "In a survey of 120 students, those who slept 8 or more hours averaged 17 points higher on the test than those who slept less.", "Everyone should get more sleep.", "I like to sleep."], 1, "It is specific, uses numbers, compares two groups, and comes from data."),
                 ("A student finds that students who play more video games have higher test scores and writes, \"Video games make students smarter.\" What is the main problem?", ["Video games are never useful", "The data shows a link, but the claim says it is the cause", "The chart should be a pie chart", "The sample is too large"], 1, "That is a causation claim made from a correlation."),
                 ("Which data set is the <b>best</b> choice for the project?", ["A list of 12 classmates' favorite colors", "A government data set of 5,000 weather readings with dates and units", "A spreadsheet with no source", "A file with students' names and home addresses"], 1, "A credible source, enough rows, and clear columns. Personal information should be avoided."),
                 ("Which step should come <b>before</b> making the chart?", ["Cleaning the data", "Writing the sources slide", "Picking the font", "Printing the data"], 0, "Charts of dirty data give wrong pictures."),
             ])),
        exam([
            "An <b>insight</b> is a specific, evidence-backed finding that answers a question.",
            "The process: <b>ask, find data, clean, analyze, visualize, tell the story, cite</b>.",
            "State the <b>limits</b> of the data and do not claim <b>causation</b> from a correlation.",
            "Choose <b>credible, sufficient, non-personal</b> data, and credit your sources.",
        ]),
    ]
    return U13.mk("data-insight-project.html", "data-insight-project", "Present a Data-Driven Insight: Project Guide", "FROM A QUESTION TO A CLAIM YOU CAN DEFEND",
                  "This project pulls the Data unit together. Pick a question, find and clean real data, analyze it with Python, draw an honest chart, and <b>present one insight</b> you can back up with a number.",
                  parts, "One question, one number, one honest chart.", "The walkthrough builds a small version of the whole analysis in Python.")


# ==========================================================================================  15.1 PRACTICE PT 3
def practice_pt_tracker():
    program = ('# PURPOSE: track daily steps and report how many days reached a goal\n'
               '# INPUT: the daily step goal the user types\n'
               '# OUTPUT: the number of days at the goal and the average steps\n'
               '# FUNCTIONALITY: loops through a list of daily steps and counts the days that reach the goal\n\n'
               'goal = int(input("Daily step goal: "))\n'
               'steps = [4200, 8100, 6500, 9800, 7300]\n\n'
               'def days_at_goal(data, target):\n    count = 0\n    for day in data:\n        if day >= target:\n            count = count + 1\n    return count\n\n'
               'def average(data):\n    total = 0\n    for day in data:\n        total = total + day\n    return total / len(data)\n\n'
               'print("Days at goal:", days_at_goal(steps, goal))\nprint("Average steps:", average(steps))')

    def resp(label, text, why):
        return '<div class="resp"><div class="rl">%s</div><p>%s</p><p><b>Why it earns the point:</b> %s</p></div>' % (label, text, why)

    parts = [
        part(0, "What We Are Building",
             "Start every Create Task with a <b>plan in words</b>. These four lines are written as comments at the top of the program, and they also give you the story for your video and your written responses.",
             tbl(["Plan part", "This program"], [
                 ["<b>Purpose</b>", "track daily steps and report how many days reached a goal"],
                 ["<b>Input</b>", "the daily step goal the user types"],
                 ["<b>Output</b>", "the number of days at the goal, and the average steps"],
                 ["<b>Functionality</b>", "loops through a list of daily steps and counts the days that reach the goal"],
             ]),
             "<p>Compare it to the earlier practice tasks. Color Counter and Shopping List <b>counted matches</b>. This one also <b>summarizes data</b> (an average), which fits a personal data tracker. Change the topic, keep the structure.</p>"),
        part(1, "The Finished Program, Every Requirement Labeled",
             "This is the program you build in the walkthrough.",
             code(program),
             tbl(["Requirement", "Where it is"], [
                 ["<b>Input</b>", "<code>input(...)</code> for the goal"],
                 ["<b>List</b>", "<code>steps</code>, with several items"],
                 ["<b>Student-developed procedure</b>", "<code>days_at_goal(data, target)</code>, two parameters"],
                 ["<b>Sequencing, selection, iteration</b>", "<code>count = 0</code>, the <code>if</code>, and the <code>for</code>, all inside <code>days_at_goal</code>"],
                 ["<b>Use of the list</b>", "<code>for day in data:</code> reads every day"],
                 ["<b>Call</b>", "<code>days_at_goal(steps, goal)</code>, two arguments"],
                 ["<b>Output</b>", "the two print lines"],
             ]),
             warn("The <code>target</code> parameter must <b>really change the result</b>. Typing a different goal gives a different count, so it does. A parameter the procedure never used would lose the point.")),
        part(2, "The Video Storyboard",
             "Sixty seconds is short. Plan what the viewer will see, then record it once, slowly.",
             tbl(["Time", "Shows", "What the viewer sees", "Caption to add"], [
                 ["0:00 to 0:15", "INPUT", "the program starts and you type 7000", "Typing a daily goal"],
                 ["0:15 to 0:35", "FUNCTIONALITY", "the program counts the days and finds the average", "Counting days at the goal"],
                 ["0:35 to 0:50", "OUTPUT", "<code>Days at goal: 3</code> and <code>Average steps: 7180.0</code> stay on screen", "The results"],
                 ["0:50 to 1:00", "AGAIN", "run it with 9000 and show <code>Days at goal: 1</code>", "A different goal, a different result"],
             ]),
             chk(["No voice. Use captions instead.", "Made-up numbers only. Never type real health or personal data.", "Under 60 seconds and 30 MB.", "Play it back. Can you read the input, see the program work, and see the output?"])),
        part(3, "The Personalized Project Reference",
             "Four segments from your program, with <b>every comment removed</b>.",
             "<p><b>Procedure (i): the procedure</b></p>" + code("def days_at_goal(data, target):\n    count = 0\n    for day in data:\n        if day >= target:\n            count = count + 1\n    return count"),
             "<p><b>Procedure (ii): the call</b></p>" + code("print(\"Days at goal:\", days_at_goal(steps, goal))"),
             "<p><b>List (i): where the data is stored</b></p>" + code("steps = [4200, 8100, 6500, 9800, 7300]"),
             "<p><b>List (ii): where the list is used</b></p>" + code("    for day in data:\n        if day >= target:\n            count = count + 1"),
             warn("No comments and no course words in the reference. Check every segment for a <code>#</code> before you take the screenshots.")),
        part(4, "Sample Written Responses",
             "Both wordings of each prompt, answered about this program. Use them as a model for the <b>shape</b> of a good answer, never to copy.",
             resp("Written Response 1 (2026): documentation", "I would put a comment above <code>days_at_goal</code> saying it loops through the list of daily steps and counts how many days are at or above the target. Another programmer could read it to understand the loop and the <code>if</code> without tracing the code.", "It describes a real comment for a real segment, and says how another programmer would use it."),
             resp("Written Response 1 (2025): output", "One output is the line <code>Days at goal: 3</code>. It shows the functionality because it reports how many days in the list reached the goal the user typed.", "It names one real output and ties it to what the program does."),
             resp("Written Response 2(a) (2026): the loop", "The loop stops when the variable <code>day</code> has been every value in <code>steps</code>, so after the fifth day, because a <code>for</code> loop over a list ends when it runs out of items.", "It names the variable and the point where it stops, and says why."),
             resp("Written Response 2(a) (2025): the Boolean expression", "The Boolean expression is <code>day &gt;= target</code>. It is true when <code>day</code> is 8100 and <code>target</code> is 7000, because 8100 is greater than or equal to 7000.", "It names the expression, gives specific values that make it true, and says why."),
             resp("Written Response 2(b) (2026): a call that behaves incorrectly", "If I call <code>days_at_goal(goal, steps)</code> with the arguments swapped, the program stops with an error, because <code>data</code> would be a number and a <code>for</code> loop cannot go through a number.", "It gives the real call, the wrong behavior, and why."),
             resp("Written Response 2(b) (2025): a change that causes an error", "A programmer could change <code>&gt;=</code> to <code>&gt;</code> in the <code>if</code> statement. Then a day exactly equal to the goal would not be counted, and the count would be too low.", "It names a specific change and what the procedure does afterward."),
             resp("Written Response 2(c): managing complexity", "The <code>steps</code> list manages complexity because one loop can count and average any number of days. Without the list I would need a separate variable for every day and a separate <code>if</code> for each one, and I would have to rewrite the code whenever a day was added.", "It says how the list helps and what the code would need without it."),
             quiz("qz15a", [
                 ("In the program above, what makes <code>days_at_goal</code> a procedure whose parameter <b>matters</b>?", ["It has a name", "The <code>target</code> changes the count it returns", "It has a for loop", "It is written before the list"], 1, "A parameter must affect the result. A different <code>target</code> gives a different count."),
                 ("Which segment would you put under <b>List (ii)</b> on the reference sheet?", ["<code>steps = [4200, 8100]</code>", "The lines that loop over <code>data</code> and test each day", "The <code>print</code> line", "The <code>input</code> line"], 1, "List (ii) shows where the list is <b>used</b>."),
                 ("What is wrong with putting <code># counts the days</code> in the reference sheet?", ["Nothing, comments help the reader", "Any comment in the reference sheet can earn a 0 on the whole task", "It is too short", "Comments belong only in the video"], 1, "The reference sheet must have no comments and no course content."),
             ])),
        exam([
            "Plan with four comment lines: <b>purpose, input, output, functionality</b>.",
            "The program needs <b>input, a list, a procedure with a parameter that matters, selection, iteration, a call, and output</b>.",
            "The reference sheet has <b>four segments</b> and <b>no comments</b>.",
            "Prepare a good answer for <b>each written prompt</b> while you write the code.",
        ]),
    ]
    return U15.mk("practice-pt-data-tracker.html", "practice-pt-data-tracker", "Practice PT 3: Personal Data Tracker", "THE THIRD PRACTICE CREATE TASK",
                  "A <b>personal data tracker</b> is a perfect Create Task: a list of numbers, a procedure with a parameter, and a result the user can understand. Plan it, build it, and prepare the video, reference sheet, and written responses.",
                  parts, "Same pattern, new topic.", "Use the walkthrough to build this program step by step, then practice the written responses on your own program.")


# ==========================================================================================  17.1 CREATE TASK WORK PLAN
def create_task_work_plan():
    ready = widget("wgready", "Try it: how many of the six points are you ready for?",
                   "Tick each one only when you could <b>show</b> it right now. This is a self-check, not a score.",
                   '<div class="rows"></div><div class="out"></div>',
                   r"""
var R=[["Video","The video (60 seconds or less, no voice) shows the program running with <b>input</b>, <b>one piece of functionality</b>, and <b>output</b>."],
["Program requirements","The code has a <b>student-developed procedure</b>, a <b>call</b> to it, a <b>list</b> with several items that is <b>really used</b>, <b>selection</b>, and <b>iteration</b>."],
["Written Response 1","I can describe <b>documentation</b> (a comment I would write) and how another programmer could use it."],
["Written Response 2(a)","I can name the <b>variables and values that stop my loop</b> (or the Boolean expression) and explain why."],
["Written Response 2(b)","I can give a <b>specific call</b> that makes my procedure behave incorrectly, say what happens, and say why."],
["Written Response 2(c)","I can explain how my <b>list manages complexity</b> and what I would have to change without it."]];
var box=root.querySelector(".rows"),out=root.querySelector(".out");
box.innerHTML=R.map(function(r,i){return'<label style="display:block;margin:8px 0"><input type="checkbox" data-i="'+i+'"> <b>'+r[0]+':</b> '+r[1]+'</label>'}).join("");
function upd(){var n=box.querySelectorAll("input:checked").length,miss=[];box.querySelectorAll("input").forEach(function(c){if(!c.checked)miss.push(R[c.dataset.i][0])});
 out.innerHTML='<div class="bar"><i style="width:'+n/6*100+'%"></i></div><b>'+n+' of 6</b> points ready.'+(n===6?'<div class="note">Everything is ready. Do the final checks below, then submit.</div>':'<div class="note">Still to do: '+miss.join(", ")+'.</div>')}
box.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Where You Are Now",
             "You have practiced the Create Task three times. Now you build <b>your own</b>. The rules and the scoring are in the earlier notes (<a href=\"create-task-rules.html\">The Create Task: Rules and Scoring</a>). This page is the <b>work plan</b>: how to spend your time and how to know you are done.",
             callout("Six points. One each for the <b>video</b>, the <b>program requirements</b>, and the <b>four written responses</b>.", "You earn each point only by meeting <b>every part</b> of its row.")),
        part(1, "A Work Plan",
             "Adjust the days to the schedule your teacher gives you. The <b>order</b> is what matters.",
             tbl(["When", "Finish", "Check yourself"], [
                 ["<b>Day 1</b>", "Choose your idea. Write the four plan comments (purpose, input, output, functionality).", "Could a friend tell what the program does from those four lines?"],
                 ["<b>Days 2 to 3</b>", "Write the <b>list</b>, the <b>input</b>, and the <b>procedure</b> with at least one parameter that changes the result.", "Run it with two different inputs and get two different outputs."],
                 ["<b>Day 4</b>", "Add <b>selection</b> and <b>iteration</b> inside the procedure. Call it. Show the output.", "Is there an <code>if</code> and a loop inside your procedure?"],
                 ["<b>Day 5</b>", "<b>Test</b>: two different calls, plus a call that could break it. Fix bugs.", "Can you say what each call returns and why?"],
                 ["<b>Day 6</b>", "Record the <b>video</b>. Make the <b>reference sheet</b> (four segments, no comments).", "Play the video with the sound off. Is it clear?"],
                 ["<b>Day 7</b>", "Draft answers to all six <b>written prompts</b> about <b>your</b> program. Add credit comments.", "Does every answer name a real line or value from your code?"],
                 ["<b>Last day</b>", "Final checks. Export the program PDF. Upload the files.", "Everything below is ticked."],
             ])),
        part(2, "Are You Ready?",
             "Be honest. If you cannot show it, it is not ready.",
             ready),
        part(3, "The Final Checks",
             "Do these <b>after</b> you think you are finished.",
             two(box("Program code PDF", "<b>All</b> of the code is in one document. Comments explain each part. Any code you did not write is <b>credited</b> in a comment. It is the <b>same program</b> as in the video.", "ok"),
                 box("Video", "60 seconds or less. 30 MB or less. An allowed file type. <b>No voice</b>, no real names. Input, functionality, and output are all visible and readable.", "ok")),
             two(box("Reference sheet", "Four segments: procedure (i), the call (ii), list (i), and list (ii). <b>Delete every comment.</b> No course words. Text at least 10 point and sharp.", "ok"),
                 box("Honesty", "Only the program code may be done with a partner. The video and the reference sheet are yours. Credit any code from a teacher, a tutorial, or an AI tool.", "bad"))),
        part(4, "Common Ways to Lose a Point",
             "These are the most common mistakes, and how to avoid them.",
             tbl(["Mistake", "How to avoid it"], [
                 ["The list has <b>one item</b>, or the loop does not read it", "Put several items in the list and read <b>every one</b> inside the procedure"],
                 ["The <b>parameter does nothing</b>", "Use it in the <code>if</code> or in a calculation so a different argument changes the result"],
                 ["A <b>comment left in</b> the reference sheet", "Search the screenshots for <code>#</code> before you submit"],
                 ["The video <b>shows code, not the program running</b>", "Record the program <b>running</b> with a visible input and output"],
                 ["A written answer <b>describes the program in general</b>", "Name a specific line, variable, and value from <b>your</b> code"],
                 ["The video and the code <b>do not match</b>", "Record the final version last, after the last code change"],
             ]),
             quiz("qz17a", [
                 ("Which is <b>required</b> in the program code you submit?", ["A student-developed procedure with a parameter, a call to it, a list that is used, selection, and iteration", "At least 500 lines", "Three different programming languages", "A graphical user interface"], 0, "Those are the program requirements. Length and style are not required."),
                 ("Which would <b>lose</b> a point on the reference sheet?", ["Showing four code segments", "Leaving a comment in one of the segments", "Using a screenshot", "Showing the call to the procedure"], 1, "The reference sheet must not contain comments."),
                 ("For the video, which is allowed?", ["A voice-over explaining the code", "Text captions that explain what is on screen", "Your name and school at the start", "A recording of only the code"], 1, "No voice, and nothing that identifies you. Text captions are encouraged."),
             ])),
        exam([
            "Plan the work in order: <b>idea, list/input/procedure, selection and iteration, testing, video and reference sheet, written responses, final checks</b>.",
            "Each of the six points needs <b>every part</b> of its row.",
            "The <b>program code</b> may be done with a partner. The <b>video, reference sheet, and responses</b> are yours.",
            "<b>Credit</b> any code you did not write. Plagiarism can earn a 0 on the whole task.",
        ]),
    ]
    return U17.mk("create-task-work-plan.html", "create-task-work-plan", "Create Task Work Plan and Final Checklist", "FINISH IT, CHECK IT, SUBMIT IT",
                  "Time to build your own program. Use this <b>work plan</b> to spend your days well and this <b>checklist</b> to know when each of the six points is truly ready.",
                  parts, "If you can show it, it is ready.", "Good luck. The rules and scoring pages from Unit 6 are your reference.")


PAGES = {"data-insight-project": data_insight_project, "practice-pt-data-tracker": practice_pt_tracker, "create-task-work-plan": create_task_work_plan}
INDEXES = {
    "unit-13": lambda: U13.index('<p>This project pulls the <b>Data unit</b> together. You ask a question, find and clean real data, analyze it with Python, draw an honest chart, and present one insight.</p>'),
    "unit-15": lambda: U15.index('<p>A third practice Create Task, this time built around a <b>personal data tracker</b>. Plan it, build it, and prepare the video, reference sheet, and written responses.</p>'),
    "unit-17": lambda: U17.index('<p>Your own Create Performance Task. The rules and scoring are in Unit 6. This unit is the <b>work plan and final checklist</b>.</p>'),
}
