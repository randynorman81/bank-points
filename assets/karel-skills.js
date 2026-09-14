// Cumulative catalog of what Karel can do, connected to real Python syntax.
// Each Unit 2 lesson page sets a numeric KAREL_STEP (matching its position in
// UNIT_LESSONS, with "Meet Karel" = 0) before including this script. Skills
// with skill.step <= KAREL_STEP are shown; skills with skill.step === KAREL_STEP
// are tagged "New".

const KAREL_SKILLS = [
  { step: 0, code: "move()", desc: "Moves Karel forward one block.", note: "A function call &mdash; same rules as any Python function." },
  { step: 0, code: "turnLeft()", desc: "Turns Karel 90&deg; to the left.", note: "Another function call." },
  { step: 0, code: "putBeeper()", desc: "Drops a beeper where Karel is standing.", note: "Another function call." },
  { step: 0, code: "pickBeeper()", desc: "Picks up a beeper where Karel is standing.", note: "Another function call." },
  { step: 2, code: "turnLeft(); turnLeft(); turnLeft();", desc: "Karel's trick for faking a right turn, since turnRight() doesn't exist yet.", note: "Not a new command &mdash; the same function, called three times in a row." },
  { step: 3, code: "def turnRight():", desc: "Write a function once, then call it (with <code>()</code>) as many times as you need.", note: "Real Python <code>def</code> syntax &mdash; this is exactly how Python defines a function." },
  { step: 4, code: "def main():", desc: "The function that runs first and calls your other functions, in order.", note: "Still real Python <code>def</code> syntax." },
  { step: 6, code: "# like this", desc: "Anything after <code>#</code> is ignored by the computer &mdash; it's a note for humans reading the code.", note: "Real Python comment syntax." },
  { step: 7, code: "turnRight() &nbsp; / &nbsp; turnAround()", desc: "\"Super Karel\" comes with these built in, so you don't have to write them yourself.", note: "Two more pre-built function calls." },
  { step: 8, code: "for i in range(4):", desc: "Repeats the indented block a set number of times.", note: "Real Python for-loop syntax." },
  { step: 9, code: "if condition: / else:", desc: "Runs one block if something is true, a different block if it's false.", note: "Real Python if/else syntax." },
  { step: 10, code: "while condition:", desc: "Repeats the indented block for as long as the condition stays true.", note: "Real Python while-loop syntax." },
  { step: 12, code: "(indent with 4 spaces)", desc: "Python uses indentation, not curly braces, to show which lines belong inside a function, loop, or if statement.", note: "Not a symbol &mdash; a real Python rule." }
];

function renderKarelSkills() {
  const root = document.getElementById("karel-skills-root");
  if (!root || typeof KAREL_STEP === "undefined") return;

  const visible = KAREL_SKILLS.filter(s => s.step <= KAREL_STEP);

  if (visible.length === 0) {
    root.innerHTML = `
      <h4>Karel's Toolbox</h4>
      <p class="karel-skills-hint">Nothing new yet &mdash; check back after 2.1.</p>
    `;
    return;
  }

  const items = visible.map(s => {
    const isNew = s.step === KAREL_STEP;
    return `
      <li>
        <code>${s.code}</code>${isNew ? ' <span class="badge new-badge">New</span>' : ""}
        <p>${s.desc} <span style="color:var(--gray-500);">${s.note}</span></p>
      </li>
    `;
  }).join("");

  root.innerHTML = `
    <h4>Karel's Toolbox So Far</h4>
    <p class="karel-skills-hint">Every one of these is real Python underneath &mdash; see <a href="meet-karel.html">Meet Karel</a> for why.</p>
    <ul>${items}</ul>
  `;
}

document.addEventListener("DOMContentLoaded", renderKarelSkills);
