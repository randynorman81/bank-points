/* THE CODE VAULT GAMES for Units 3 to 6 (the "game" part of every lesson: notes, walkthrough, assignment, GAME).
   One 10-round game per lesson, made on the server by netlify/functions/pybank.js. Slots and points come from py-table.js. OPTIONAL BONUS: never gates the next lesson (optional: true). */
"use strict";
const M = require("./core.js");
const T = require("./py-table.js");
const { ASG } = require("./u03-python-assign.js");
const ARC = require("../../python/games/arcade-info.js");   /* the Unit 3 games are real arcade games: their names, stories and controls are written once in arcade-info.js */
T.rows.forEach((row) => {
  const learn = (ASG[row.id] && ASG[row.id].learn) || [row.t], per = row.pts[1] / 10;
  const arc = ARC[row.id];
  M.addGame(row.game, arc ? {
    title: "Bonus Game " + row.n + ": " + arc.name, game: row.id,
    story: ["**" + arc.story + "**", "Every round is a short **Python question** (often a program to read). The four answers are in the game, and you answer by **playing**. This is lesson " + row.n + ": " + row.t + "."],
    how: [arc.how, "**Controls:** " + arc.help, "**3 mistakes** (or the clock hitting zero) end the game. Your score is the rounds you got right."],
    scoring: ["**This game is optional.** It is **bonus points** that go on top of your grade: up to **" + row.pts[1] + " bonus points**, with no coding. You play a 10-round game, and each right answer is worth " + per + " bonus point" + (per === 1 ? "" : "s") + ".", "Skipping it costs you nothing and it does **not** hold up the next lesson. You can play as many times as you like and **your best run counts**. The questions change every time, so reading the explanation after each round really helps."],
    practice: learn.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
  } : {
    title: "Bonus Code Vault " + row.n + ": " + row.t, game: row.id,
    story: ["**You are a master thief with one night to crack a vault whose ten locks are all about " + row.t + ".** This is the game for lesson " + row.n + ": the walkthrough taught you how it works and the assignment made you build it. Now the vault tests whether you can **read** the code and know exactly what it does.",
      "Every lock is a short **Python program** or a question about it. Work out what happens, line by line, and pick the right answer before the alarm goes off."],
    how: ["Each lock shows a short **Python program** (or a question). Read it slowly, one line at a time.", "**Trace the code in your head:** work out what each line does to the variables, then tap the answer. The explanation after each lock shows how it works.", "**3 mistakes** (or the clock hitting zero) set off the alarm and you are caught. Your score is the locks you cracked."],
    scoring: ["**This game is optional.** It is **bonus points** that go on top of your grade: up to **" + row.pts[1] + " bonus points**, with no coding. You play a 10-round game, and each right answer is worth " + per + " bonus point" + (per === 1 ? "" : "s") + ".", "Skipping it costs you nothing and it does **not** hold up the next lesson. You can play as many times as you like and **your best run counts**. The questions change every time, so reading the explanation after each lock really helps."],
    practice: learn.map((x) => x.charAt(0).toUpperCase() + x.slice(1))
  }, { unit: row.UNIT, num: Math.floor(row.wt), points: row.pts[1], seq: row.wt + (row.wt % 1 ? 0.1 : 0.7), passMin: 0, optional: true });
});
