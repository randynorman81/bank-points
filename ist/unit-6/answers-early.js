/* "Setting up your page" steps for lesson 6.1 (lessons 6.2 and later live in answers-v2.js). Same rules as answers.js: SHORT, no typed planning boxes,
   what to add and where it goes in plain words, never copyable tags or code. */
(function (root) {
  var A = root.U7_ANSWERS = root.U7_ANSWERS || {};

  /* ===================== 6.1 ===================== */
  A["6.1"] = [
    { h: "What you are building" },
    { p: "Your first website: a plain, text-heavy page about a topic you know or want to learn about, like a mini encyclopedia article. It will look plain on purpose. Click **Checks** any time to see your score." },
    { map: [
      "The skeleton (typed by you, from memory)",
      "Heading 1: your topic",
      "3 or more section headings (heading 2), each with paragraphs",
      "A last paragraph that lists at least 2 sources"
    ] },
    { p: "**Rules:** write everything yourself in the editor, in your own words. Copying from Wikipedia, a website, or an AI tool takes 50% off. Stuck? Read the notes: schscomputerscience.com/ist/unit-6/html-intro-notes.html" },

    { h: "Step 1: The skeleton" },
    { build: [
      "Type the **doctype line** on line 1, from memory",
      "Open the **html** container. Everything else goes **inside** it",
      "Inside html, add the **head** first, then the **body**",
      "Inside the head, add a **title** with your topic (pick a topic you can find good information about)"
    ] },

    { h: "Step 2: Main heading" },
    { build: [
      "Inside the body, add **one heading 1** with your topic's name"
    ] },

    { h: "Step 3: Section headings" },
    { build: [
      "Under the heading 1, add at least **3 section headings** (heading 2), like History, How It Works, Why It Matters",
      "Use a heading 3 only **under** a heading 2. Do not skip levels"
    ] },

    { h: "Step 4: Paragraphs" },
    { build: [
      "Under each section heading, add **2 paragraphs**. Each one goes in its **own** paragraph, not inside a heading",
      "Write at least **10 paragraphs** in all, and make at least **8 of them 25 words or longer**",
      "Keep writing until your page has at least **300 words**"
    ] },

    { h: "Step 5: Sources" },
    { build: [
      "Make your **last paragraph** list at least **2 sources** (a book, an encyclopedia, or a trusted website)"
    ] },

    { h: "Step 6: Check and submit" },
    { build: [
      "Fix anything in the **Problems** list (click a problem to jump to that line)",
      "Make sure **Checks** shows 50 / 50",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

})(typeof window !== "undefined" ? window : globalThis);
