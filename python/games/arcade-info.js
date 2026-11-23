/* The 13 Unit 3 arcade games: names, stories and controls. Used by the game page (engine.js), the scenes (arcade.js, arcade2.js) and by tools/missions/u03-python-games.js
   (the game assignment records), so the words are written once. The questions themselves come from the server (netlify/functions/pybank3.js). */
(function (g) {
  var A = {
    u3l1: { name: "Flappy Variable", title: "FLAPPY VARIABLE", help: "SPACE, UP or a click flaps your wings. Fly through the window that shows the right answer. Hitting a pipe just knocks you back.",
      story: "A little bird has to fly through a wall of pipes. Each window in the wall shows a different answer to the question below. Read the code, work out the answer, and flap through the right window.", how: "Press SPACE (or click) to flap. Line up with the window you want while the pipes roll in." },
    u3l2: { name: "Type Crossing", title: "TYPE CROSSING", help: "Arrow keys hop the frog. Cross the traffic, then hop onto the lily pad that shows the right answer. Cars send you back to the start.",
      story: "A frog has to cross a busy road to reach the pond. The lily pads at the top show different answers to the question below. Dodge the cars and hop onto the right pad.", how: "Use the arrow keys to hop one square at a time. Choose your pad before you cross, because every square on the far bank counts." },
    u3l3: { name: "Input Claw Machine", title: "INPUT CLAW MACHINE", help: "LEFT and RIGHT (or the mouse) move the claw. SPACE, DOWN or a click drops it. Grab the capsule with the right answer.",
      story: "A claw machine is full of capsules, and each capsule hides a different answer to the question below. Work out the answer, line up the claw, and grab the right one.", how: "Move the claw over a capsule and drop it. A miss just lifts the claw back up." },
    u3l4: { name: "Asteroid Joiner", title: "ASTEROID JOINER", help: "LEFT and RIGHT move your ship. SPACE fires. Shoot the asteroid that carries the right answer.",
      story: "Asteroids are drifting toward your ship, and each one carries a different answer to the question below. Read the code, work out the answer, and blast the right asteroid.", how: "Move under an asteroid and press SPACE to fire. The first one you hit is your answer, so aim carefully." },
    u3l5: { name: "Index Snake", title: "INDEX SNAKE", help: "Arrow keys steer the snake. Eat the letter that matches the right answer in the list on the right. The edges wrap around.",
      story: "A hungry snake is looking for food, and every piece of food is a lettered answer to the question below. Work out the answer and eat the matching letter.", how: "Steer with the arrow keys. The list on the right tells you which letter is which answer. Crashing into yourself only shrinks you." },
    u3l6: { name: "Slice Ninja", title: "SLICE NINJA", help: "Drag the mouse (or your finger) across a fruit to slice it. Slice the fruit that shows the right answer.",
      story: "Fruit is flying through the air, and each fruit carries a different answer to the question below. Read the slice, work out the answer, and cut the right fruit in half.", how: "Swipe through a fruit while it is in the air. The first fruit you slice is your answer." },
    u3l7: { name: "Find It In The Dark", title: "FIND IT IN THE DARK", help: "Move the mouse (or use the arrow keys) to shine your flashlight. Click a chest (or press SPACE) to open the one with the right answer.",
      story: "The lights are out in the vault, and four chests hold four different answers to the question below. Search with your flashlight, read the labels, and open the chest with the right answer.", how: "Only things inside the circle of light can be read. Open one chest to give your answer." },
    u3l8: { name: "Math Platformer", title: "MATH PLATFORMER", help: "LEFT and RIGHT run, SPACE or UP jumps. Stand on the platform with the right answer until the lock-in ring fills.",
      story: "Four floating platforms each show a different answer to the question below. Run, jump, and land on the platform with the right answer, then hold still to lock it in.", how: "Stand still on a platform for about a second to lock it in. Jump away if you change your mind." },
    u3l9: { name: "Brick Divider", title: "BRICK DIVIDER", help: "LEFT and RIGHT (or the mouse) move the paddle. Bounce the ball into the brick that shows the right answer.",
      story: "A ball is bouncing around, and four big bricks each show a different answer to the question below. Work out the answer and send the ball into the right brick.", how: "Where the ball lands on your paddle decides which way it flies. Hit the right brick to answer." },
    u3l10: { name: "Floor Catch", title: "FLOOR CATCH", help: "LEFT and RIGHT (or the mouse) move the basket. Catch the falling sign that shows the right answer.",
      story: "Signs are falling from the ceiling, and each one shows a different answer to the question below. Work out the answer and catch the right sign in your basket.", how: "Slide the basket under the sign you want. The first sign you catch is your answer." },
    u3l11: { name: "Remainder Cannon", title: "REMAINDER CANNON", help: "Move the mouse to aim and click to fire (the farther the mouse, the more power). Or use UP/DOWN to aim, LEFT/RIGHT for power and SPACE to fire.",
      story: "A cannon faces four targets, and each target shows a different answer to the question below. Work out the answer and hit the right target.", how: "The dotted line shows your shot. Hit a target to give your answer. Missing is free, so take your time." },
    u3l12: { name: "Order Maze", title: "ORDER MAZE", help: "Arrow keys walk through the maze. Walk through the door that matches the right answer in the list on the right.",
      story: "You are lost in a maze with four exit doors, and each door is a lettered answer to the question below. Work out the answer, find the matching door and walk through it.", how: "The list on the right tells you which letter is which answer. Every door is reachable, so keep exploring." },
    u3l13: { name: "The Trace Mystery", title: "THE TRACE MYSTERY", help: "Click an evidence card (or press 1, 2, 3 or 4) to choose it. Right answers clear suspects and crack the case.",
      story: "Someone changed a variable and broke the school grade book, and four suspects are in the room. Trace each clue by hand, pick the evidence that matches, and clear the innocent until only the culprit is left.", how: "Each clue is a short program. Trace it, then pick the evidence card with the right answer. Wrong evidence lets the culprit get away." }
  };
  g.ArcadeInfo = A;
  if (typeof module !== "undefined" && module.exports) module.exports = A;
})(typeof window !== "undefined" ? window : globalThis);
