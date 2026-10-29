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
      "3 sections: a heading 2, then its 2 paragraphs, one section at a time"
    ] },
    { p: "Stuck? Read the notes: schscomputerscience.com/ist/unit-6/html-intro-notes.html" },

    { h: "Step 1: The skeleton" },
    { build: [
      "Type the **doctype line** as the very first line of the page, from memory: exactly **\"<!DOCTYPE html>\"** (with the exclamation point)",
      "Under it, open the **html** container: type the opening html tag (the editor adds the closing tag for you). Everything else goes **inside** the html tags",
      "Inside the html tags, type the **head** tags (an opening and a closing head tag). The editor puts your cursor on the line under the closing head tag",
      "Click on the empty line **between** the two head tags and add a **title** with your topic (pick a topic you can find good information about)",
      "Click on the line **under** the closing head tag, still inside the html tags, and type the **body** tags (an opening and a closing body tag). Everything you see on your page goes in the body"
    ] },

    { h: "Step 2: Main heading" },
    { build: [
      "Inside the body tags, type **one heading 1** with your topic's name"
    ] },

    { h: "Step 3: Section 1" },
    { build: [
      "Right under the heading 1, add your **first heading 2**: the title of your first section, like History. Use only **heading 1** and **heading 2** on this page (no heading 3 or smaller)",
      "**Right under that heading 2**, add **2 paragraphs**. Each one goes in its **own** paragraph, not inside a heading. Write about your topic, and make each paragraph **25 words or longer** (about two full sentences)"
    ] },

    { h: "Step 4: Section 2" },
    { build: [
      "Under your second paragraph, add your **second heading 2**: the title of your next section, like How It Works",
      "**Right under that heading 2**, add **2 paragraphs** about your topic, each **25 words or longer** (about two full sentences)"
    ] },

    { h: "Step 5: Section 3" },
    { build: [
      "Under your last paragraph, add your **third heading 2**: the title of your last section, like Why It Matters",
      "**Right under that heading 2**, add **2 paragraphs** about your topic. That makes **6 paragraphs** in all, 2 under every heading 2, and at least **5 of them 25 words or longer**"
    ] },

    { h: "Step 6: Check and submit" },
    { build: [
      "Fix anything in the **Problems** list (click a problem to jump to that line)",
      "Make sure **Checks** shows all green",
      "Choose your class period at the top, then click **Submit**"
    ] }
  ];

})(typeof window !== "undefined" ? window : globalThis);
