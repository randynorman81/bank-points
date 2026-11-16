/* Robot grid interpreter for PACKET QUEST, following the AP CSP exam reference sheet rules:
   MOVE_FORWARD() moves one square in the direction the robot faces. If that square is blocked or off the grid,
   the robot stays where it is and the PROGRAM ENDS. ROTATE_LEFT/RIGHT turn 90 degrees. CAN_MOVE(dir) checks
   forward/left/right/backward relative to the robot. REPEAT UNTIL (GoalReached()) checks before each pass. */
(function () {
  var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
  var REL = { forward: 0, right: 1, backward: 2, left: 3 };
  var MAX_STEPS = 400;

  function open(grid, r, c) { return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && grid[r][c] !== "#"; }
  function goalOf(grid) { for (var r = 0; r < grid.length; r++) for (var c = 0; c < grid[r].length; c++) if (grid[r][c] === "G") return { r: r, c: c }; return null; }

  /* returns { frames: [{r,c,d,ev}], outcome: "goal" | "blocked" | "notgoal" | "loop" } */
  function run(program, grid, start) {
    var s = { r: start.r, c: start.c, d: start.d }, frames = [{ r: s.r, c: s.c, d: s.d, ev: "start" }], steps = 0, g = goalOf(grid);
    var STOP = {};
    function atGoal() { return g && s.r === g.r && s.c === g.c; }
    function tick() { if (++steps > MAX_STEPS) throw { stop: "loop" }; }
    function exec(list) {
      for (var i = 0; i < list.length; i++) {
        var st = list[i]; tick();
        if (st.op === "F") {
          var nr = s.r + DR[s.d], nc = s.c + DC[s.d];
          if (!open(grid, nr, nc)) { frames.push({ r: s.r, c: s.c, d: s.d, ev: "bump", br: nr, bc: nc }); throw { stop: "blocked" }; }
          s.r = nr; s.c = nc; frames.push({ r: s.r, c: s.c, d: s.d, ev: "move" });
        } else if (st.op === "L") { s.d = (s.d + 3) % 4; frames.push({ r: s.r, c: s.c, d: s.d, ev: "turn" }); }
        else if (st.op === "R") { s.d = (s.d + 1) % 4; frames.push({ r: s.r, c: s.c, d: s.d, ev: "turn" }); }
        else if (st.op === "REP") { for (var k = 0; k < st.n; k++) exec(st.body); }
        else if (st.op === "UNTIL") { while (!atGoal()) { tick(); exec(st.body); } }
        else if (st.op === "IF") {
          var dd = (s.d + REL[st.dir]) % 4;
          if (open(grid, s.r + DR[dd], s.c + DC[dd])) exec(st.then); else if (st.els) exec(st.els);
        }
      }
    }
    var outcome;
    try { exec(program); outcome = atGoal() ? "goal" : "notgoal"; }
    catch (e) { if (e && e.stop) outcome = e.stop; else throw e; }
    if (outcome === "loop") frames = frames.slice(0, 120);
    return { frames: frames, outcome: outcome };
  }

  function countBlocks(program) { var n = 0; program.forEach(function (st) { n++; if (st.body) n += countBlocks(st.body); if (st.then) n += countBlocks(st.then); if (st.els) n += countBlocks(st.els); }); return n; }

  /* AP-style pseudocode text */
  function toText(program, ind) {
    ind = ind || ""; var out = [], I = "   ";
    function block(list) { out.push(ind + "{"); out.push(toText(list, ind + I)); out.push(ind + "}"); }
    program.forEach(function (st) {
      if (st.op === "F") out.push(ind + "MOVE_FORWARD()");
      else if (st.op === "L") out.push(ind + "ROTATE_LEFT()");
      else if (st.op === "R") out.push(ind + "ROTATE_RIGHT()");
      else if (st.op === "REP") { out.push(ind + "REPEAT " + st.n + " TIMES"); block(st.body); }
      else if (st.op === "UNTIL") { out.push(ind + "REPEAT UNTIL (GoalReached())"); block(st.body); }
      else if (st.op === "IF") { out.push(ind + "IF (CAN_MOVE(" + st.dir + "))"); block(st.then); if (st.els) { out.push(ind + "ELSE"); block(st.els); } }
    });
    return out.filter(function (l) { return l !== ""; }).join("\n");
  }

  var api = { run: run, countBlocks: countBlocks, toText: toText, goalOf: goalOf };
  if (typeof window !== "undefined") window.PQRobot = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
