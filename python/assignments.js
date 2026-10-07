/* Assignment instructions for the Python editor's left column.
   Key = the assignment slot in the Assignment dropdown: "free" (practice) or "a1" ... "a30".
   Each entry is { title, blocks: [...] } and the blocks are shown top to bottom:
     { h: "Step 1: Ask a question" }          a heading
     { p: "Text. **bold** and `code` work." }  a paragraph
     { build: ["Do this.", "Then this."] }     a green checklist the student can tick off
     { make: ["Type..."] }  { where: ["In..."] }   blue "Make" / yellow "Where" boxes, also checkable
     { code: "x = 5\nprint(x)" }               a read-only code sample (colored like the editor)
   A slot with no entry shows "Your teacher has not posted instructions for this assignment yet."
   To add an assignment, add an entry below and push. Nothing else needs to change. */
window.PY_ASSIGN = {
  free: {
    title: "Practice",
    blocks: [
      { h: "How this editor works" },
      { p: "This is a free space to try Python. Nothing here is graded, and it saves for you as you type." },
      { build: [
        "Type your code in the middle box, then click **Run** (or press **Ctrl + Enter**). The output shows on the right.",
        "Click any chip in the **Key** above the code to learn what that color means. The **Math key** explains division, floor division, and modulus.",
        "If you get an error, read the 📘 and 💡 notes under it. They explain what kind of error it is and how to fix it.",
        "Switch the box at the top from **Python** to **Karel** to program Karel in her world.",
        "To turn in an assignment, sign in with Google, pick the assignment in the **Assignment** box, choose your period, and click **Submit**."
      ] }
    ]
  }
};
