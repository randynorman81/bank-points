from gl import *
import review18
UNIT = Unit(18, "AP Exam Review", "Exam format, the pseudocode reference sheet, and a review of all five Big Ideas with practice.",
    "All Big Ideas", "#E81820", "#B91C1C", "#F87171", "#FEE2E2", "hex",
    ["Know the format and scoring of the AP exam", "Read the AP pseudocode reference sheet fluently", "Review every Big Idea and practice exam-style questions"],
    [G("18.1", review18, "exam-strategies", after=[see(trace("Tracing AP pseudocode", "x ← 2\nREPEAT 3 TIMES\n{\n    x ← x * 2\n}\nDISPLAY(x)", ["x"], [(1, {"x": 2}), (3, {"x": 4}), (3, {"x": 8}), (3, {"x": 16})], "The block runs three times, doubling each time: 2, 4, 8, 16.", output="16"))]),
     G("18.2", review18, "review-big-idea-1"), G("18.3", review18, "review-big-idea-2"), G("18.4", review18, "review-big-idea-3"), G("18.5", review18, "review-big-idea-4"), G("18.6", review18, "review-big-idea-5")],
    glossary=[("Pseudocode", "Language-neutral code used on the AP exam."), ("←", "Assignment arrow in AP pseudocode."), ("MOD", "The remainder operator in AP pseudocode."), ("Selection", "Choosing code with IF."), ("Iteration", "Repeating code with REPEAT or FOR EACH."), ("Algorithm", "A finite set of instructions that accomplishes a task."), ("Abstraction", "Hiding details to manage complexity."), ("Big idea", "One of the five themes of the course.")],
    seed=18)
