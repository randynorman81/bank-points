// helpers for writing Karel worlds in the lesson files
export const world = (cols, rows, x = 1, y = 1, dir = "E", balls = [], walls = []) => ({ cols, rows, x, y, dir, balls, walls });
export const BOX = (w) => w;   // (kept so a lesson file can mark a world as shared)
// wall helpers: vertical wall on the east side of a corner, horizontal wall on the north side
export const wallE = (x, y) => [x, y, "E"], wallN = (x, y) => [x, y, "N"];
// a row of walls: hurdles, towers and so on
export const hurdles = (xs, y = 1) => xs.map((x) => [x, y, "E"]);
// a hurdle: a wall one square high on street 1, between avenue x and avenue x+1 (Karel goes up, over and back down)
export const hurdle = (x) => [[x, 1, "E"]];
export const hurdleWalls = (xs) => xs.flatMap(hurdle);
export const TURN_RIGHT = "function turnRight() {\n  turnLeft();\n  turnLeft();\n  turnLeft();\n}\n";
export const TURN_AROUND = "function turnAround() {\n  turnLeft();\n  turnLeft();\n}\n";
