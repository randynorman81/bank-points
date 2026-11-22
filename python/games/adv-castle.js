/* CASTLE BYTE: The Binary Baron. Unit 8 (Digital Information). The story, the rooms and the lesson pages for the castle adventure.
   In LEARN mode the glowing objects teach the lesson (each page is a short lesson). In CHALLENGE mode the same objects are just spooky decoration. */
(function () {
  "use strict";
  var FL = 108;
  window.AdvContent = window.AdvContent || {};
  var STONE = ["#4a4560", "#3a3550", "#3b3550", "#2e2a40", "#c9a227"], WOOD = ["#5a3d28", "#3a2a1c", "#4a3220", "#3a2818", "#c9a227"], GREEN = ["#2f4a45", "#25403a", "#2c3a38", "#222f2e", "#6ee7b7"], RED = ["#4a2433", "#3a1c28", "#35202b", "#2a1620", "#c9a227"], GREY = ["#454a58", "#373b48", "#34384a", "#292c3a", "#a5b4fc"], DEEP = ["#2d2848", "#231f3a", "#2a2640", "#201c33", "#a78bfa"];

  window.AdvContent.castle = {
    id: "castle", title: "CASTLE BYTE", sub: "The Binary Baron", world: "castle", unit: "Unit 8: Digital Information", monsters: ["ghost", "bat", "skeleton"],
    intro: [
      { scene: "castle", text: "CASTLE BYTE. Midnight. Rain. The gates are open, and your little sister MINA is somewhere inside." },
      { scene: "castle", text: "A note was left in her bedroom: \"I have taken her to my castle. Come and get her, if you can read my locks. BARON VON BYTE.\"" },
      { scene: "castle", text: "The Baron has turned his whole castle into a computer. Every door is a lock made of binary, hex, pixels, colors and secret codes. Crack them, or the castle will not let you out." },
      { scene: "dark", learn: "Look around each room. Things that glow can be examined, and they will TEACH you what each lock needs. Your journal keeps every page you find.", challenge: "No notes. No help. No hints. The castle is not going to explain itself. What you already know is all you have." }
    ],
    win: [
      { scene: "castle", text: "The last lock shatters. The Baron lets out a scream and falls apart into a cloud of bats, and the whole castle goes quiet." },
      { scene: "dawn", text: "The cage door swings open. Mina runs straight into you. \"I knew you would come,\" she says. \"I could hear you counting in binary the whole way up.\"" },
      { scene: "dawn", text: "You walk out of the gates as the sun comes up. Behind you, Castle Byte is just an old ruin. You saved her. YOU ESCAPED." }
    ],
    lose: [{ scene: "dark", text: "The castle closes around you. The lights go out, one by one, and the Baron's laugh echoes down the hall." }],
    bossName: "BARON VON BYTE", bossLines: ["\"Foolish child. Show me how well you know your numbers.\"", "\"No! That is impossible!\"", "\"You cannot break my last lock!\"", "\"MY CASTLE... MY BITS...\""],
    rooms: [
      { name: "The Entrance Hall", lesson: "8.1", short: "Intro to Digital Information", wall: "stone", floor: "flag", pal: STONE, dark: 0.55, loot: "Silver Key",
        arrive: "The huge doors slam shut behind you. Somewhere above, a girl's voice is calling your name.",
        lights: [{ x: 18, y: 44, r: 50 }, { x: 222, y: 44, r: 40 }],
        props: [{ t: "torch", x: 18 }, { t: "window", x: 112, o: { sky: "#16204a" } }, { t: "painting", x: 56, y: 46, o: { variant: 0 }, hot: "clue0", label: "Portrait" }, { t: "armor", x: 92, hot: "clue1", label: "Suit of armor" }, { t: "table", x: 142, hot: "clue2", label: "Writing table" }, { t: "chest", x: 180, hot: "lockA", label: "Locked chest" }, { t: "door", x: 216, hot: "lockB", label: "Big door" }, { t: "cobweb", x: 6, y: 16 }],
        clues: [
          { title: "The Baron's Portrait", flavor: "A pale man in a crown. His painted eyes seem to follow you. You decide to stop looking at them.",
            text: "A brass plate under the portrait reads: THE BARON TURNED THE WORLD INTO NUMBERS. Computers store EVERYTHING as numbers made of just two digits: 1 and 0. Each 1 or 0 is a BIT (a binary digit). A group of 8 bits is a BYTE. Why only two digits? Hardware can easily be ON or OFF, like a light switch, and that is all a bit needs.",
            ex: "1 bit  = 0 or 1\n8 bits = 1 byte\nA byte can hold 256 different values (0 to 255)" },
          { title: "Armor With a Note", flavor: "An empty suit of armor. Nothing inside, thankfully. A cold draft blows out of the visor.",
            text: "A note is taped to the armor: ANALOG data changes smoothly with no gaps, like the groove of a vinyl record or the hands of a clock. DIGITAL data is stored as separate numbers. To turn a sound into digital data, a computer takes SAMPLES (measurements) many times a second. More samples per second makes a more accurate copy, but a bigger file. Between the samples some detail is lost. That small loss is called ROUND-OFF error.",
            ex: "Analog: smooth and continuous\nDigital: separate numbers (samples)\nMore samples = closer copy + bigger file" },
          { title: "Torn Diary Page", flavor: "A diary page. The ink has run, and the only words you can make out are \"help me\". You shiver.",
            text: "More bits means more possible patterns. With n bits you can make 2 x 2 x ... (n times) different patterns. Needed 100 different values? 6 bits only gives 64, but 7 bits gives 128, so you need 7. Also: a computer has a fixed number of bits for a number. If a calculation is too big to fit, you get OVERFLOW, and the number wraps around or is wrong.",
            ex: "1 bit = 2 patterns\n2 bits = 4\n3 bits = 8\n4 bits = 16\n8 bits = 256\nNeed N values? Find the smallest n where 2^n is at least N." }
        ],
        lockA: "The chest has a lock made of rules about bits.", lockB: "The big door has a second lock. It looks harder." },
      { name: "The Library of Zeros", lesson: "8.2", short: "Number Systems", wall: "wood", floor: "plank", pal: WOOD, dark: 0.55, loot: "Bone Key",
        arrive: "Thousands of books line the walls. Every spine has a number on it, and every number is made of just 1s and 0s.",
        lights: [{ x: 150, y: 70, r: 50 }, { x: 30, y: 60, r: 40 }],
        props: [{ t: "shelf", x: 40, hot: "clue0", label: "Bookshelf" }, { t: "desk", x: 96, hot: "clue1", label: "Reading desk" }, { t: "candelabra", x: 134 }, { t: "fireplace", x: 170, hot: "clue2", label: "Fireplace" }, { t: "clock", x: 206, hot: "lockA", label: "Grandfather clock" }, { t: "rug", x: 120, y: FL + 22, o: { col: "#6a1f2b" } }, { t: "door", x: 236, hot: "lockB", label: "Library door" }],
        clues: [
          { title: "A Book About Binary", flavor: "A thick book, but every page is covered in cobwebs. Only the first line is still readable: \"Chapter 1.\"",
            text: "We count in DECIMAL (base 10): ten digits, and each place is worth 10 times more than the one to its right. BINARY (base 2) has only two digits, and each place is worth 2 times the one to its right. From the right, the places are 1, 2, 4, 8, 16, 32, 64, 128. To read a binary number, add up the place values that have a 1.",
            ex: "Place values:  128 64 32 16  8  4  2  1\nBinary:          0  1  0  1  0  0  1  1\nValue: 64 + 16 + 2 + 1 = 83" },
          { title: "Scribbled Desk Notes", flavor: "Someone has scribbled all over the desk. Most of it is just the word HELP, over and over.",
            text: "To turn a decimal number into binary, find the biggest place value that fits, write a 1 there, subtract it, and repeat with what is left. Every place you skip gets a 0. Example: 100 is 64 + 32 + 4, so the places 64, 32 and 4 are 1s, which is 01100100. The biggest number 8 bits can hold is all ones: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255.",
            ex: "100 = 64 + 32 + 4\n    = 0 1 1 0 0 1 0 0\nMax 8 bit number: 11111111 = 255" },
          { title: "A Half Burned Page", flavor: "Most of the page has burned away. A small scorched corner says \"...and then the lights went out.\"",
            text: "Counting in binary works like an odometer: 0, 1, 10, 11, 100, 101, 110, 111, 1000. When a place hits 1 and you add 1, it turns to 0 and carries to the next place. Adding in binary uses the same rules: 0+0=0, 0+1=1, 1+1=10 (write 0, carry 1), and 1+1+1=11 (write 1, carry 1).",
            ex: "  0101  (5)\n+ 0111  (7)\n------\n  1100  (12)" }
        ],
        lockA: "The grandfather clock's hands are stuck. Its mechanism is a number lock.", lockB: "The library door is sealed with a lock made of numbers." },
      { name: "The Scriptorium", lesson: "8.3", short: "Encoding Text with Binary", wall: "wood", floor: "plank", pal: ["#4a3320", "#392818", "#3a2a1c", "#2e2014", "#c9a227"], dark: 0.6, loot: "Ink Key",
        arrive: "A monk's writing room. Candles burn on every desk, but nobody is here. A skeleton still holds a pen.",
        lights: [{ x: 40, y: 80, r: 44 }, { x: 150, y: 80, r: 50 }],
        props: [{ t: "desk", x: 36, hot: "clue0", label: "Monk's desk" }, { t: "shelf", x: 84, hot: "clue1", label: "Shelf of scrolls" }, { t: "skeleton", x: 132, hot: "clue2", label: "Skeleton scribe" }, { t: "candelabra", x: 160 }, { t: "statue", x: 184, hot: "lockA", label: "Stone statue" }, { t: "door", x: 224, hot: "lockB", label: "Scriptorium door" }, { t: "torch", x: 10 }],
        clues: [
          { title: "The Code Table", flavor: "A monk's desk, covered in ink blots. One page just says \"don't look behind you.\" You don't.",
            text: "Computers store LETTERS as numbers too. A CHARACTER ENCODING is a table that gives every character its own number. ASCII was one of the first: A is 65, B is 66, C is 67 and so on, and each code is stored in 8 bits (1 byte). So a text of 5 letters needs 5 bytes, which is 40 bits.",
            ex: "A = 65 = 01000001\nB = 66 = 01000010\nC = 67 = 01000011\n'CAB' = 01000011 01000001 01000010" },
          { title: "Upper and Lower", flavor: "A shelf of scrolls. They crumble to dust when you touch them. Not great.",
            text: "Uppercase and lowercase letters have DIFFERENT codes. Lowercase letters come 32 after their capitals: A is 65 and a is 97, B is 66 and b is 98. Numbers and symbols have codes as well, and so does the space. Read a message in binary by cutting it into groups of 8 bits, turning each group into a number, and looking up the letter.",
            ex: "A = 65    a = 97\nZ = 90    z = 122\nLowercase = uppercase + 32" },
          { title: "The Skeleton's Scroll", flavor: "The skeleton is holding a pen. It has been writing the same sentence for centuries. You do not read it.",
            text: "ASCII has only 128 standard codes, which is not enough for other languages, symbols and emoji. UNICODE is a much bigger table that gives every character in the world its own number, even emoji. Unicode can use more than one byte per character, so a text with lots of different symbols can need more bits than plain ASCII.",
            ex: "ASCII: 128 characters, 1 byte each\nUnicode: over 140,000 characters, all languages and emoji" }
        ],
        lockA: "The statue is holding a plate with a binary message carved into it.", lockB: "The door has a lock that wants a word." },
      { name: "The Pixel Gallery", lesson: "8.4", short: "Pixel Images", wall: "stone", floor: "tile", pal: GREY, dark: 0.55, loot: "Frame Key",
        arrive: "A long gallery of paintings. Every one is made of big square dots, as if the artist painted with a grid.",
        lights: [{ x: 60, y: 50, r: 48 }, { x: 150, y: 50, r: 48 }],
        props: [{ t: "painting", x: 36, y: 46, o: { variant: 2, seed: 0 }, hot: "clue0", label: "Pixel painting" }, { t: "painting", x: 76, y: 46, o: { variant: 2, seed: 2 }, hot: "clue1", label: "Painting of rows" }, { t: "painting", x: 116, y: 46, o: { variant: 2, seed: 3 }, hot: "clue2", label: "Huge painting" }, { t: "torch", x: 56 }, { t: "torch", x: 96 }, { t: "statue", x: 160 }, { t: "painting", x: 182, y: 60, o: { variant: 1 }, hot: "lockA", label: "Painting with a lock" }, { t: "door", x: 220, hot: "lockB", label: "Gallery door" }],
        clues: [
          { title: "Painting Made of Squares", flavor: "A painting of a face made of squares. Its mouth is smiling. You are fairly sure it was not smiling when you walked in.",
            text: "A digital picture is a grid of tiny squares called PIXELS. A simple black and white BITMAP uses one bit per pixel: 1 for black and 0 for white (or the reverse). The more pixels, the sharper the image. The number of pixels across and down is the RESOLUTION.",
            ex: "1 = black    0 = white\n0 1 1 1 0\n1 0 0 0 1\n0 1 1 1 0   <- a tiny circle" },
          { title: "Painting of Rows", flavor: "A painting of a corridor. It does not seem to be the corridor you are standing in. Probably.",
            text: "A picture is stored as ONE long list of bits, row after row. To draw it, you cut the list into rows. A 5 wide picture takes the first 5 bits for row 1, the next 5 for row 2, and so on. Count carefully: width times height gives the total number of pixels. A 5 by 5 picture is 25 bits.",
            ex: "Bits: 0111010001011101000101110\nCut into rows of 5:\n01110 / 10001 / 01110 / 10001 / 01110" },
          { title: "The Huge Painting", flavor: "An enormous painting, taller than the room. Up close, you can see it is made of thousands of tiny dots. Down the hall someone is giggling.",
            text: "File size depends on how many bits each pixel uses. A black and white pixel needs 1 bit. A COLOR pixel often needs 24 bits (3 bytes). So the number of bits in an image is width x height x bits per pixel. A bigger picture or more colors means a bigger file.",
            ex: "10 x 10 black and white = 100 bits\n10 x 10 in 24 bit color = 100 x 24 = 2,400 bits\nDivide by 8 to get bytes" }
        ],
        lockA: "The painting hides a small safe. Its lock is a grid of squares.", lockB: "The gallery door wants to know the size of a picture." },
      { name: "The Alchemy Lab", lesson: "8.5", short: "Hexadecimal", wall: "stone", floor: "flag", pal: GREEN, dark: 0.6, loot: "Glass Vial",
        arrive: "Green smoke curls from a cauldron. Shelves of bottles, each labeled with codes like 3F and B7, crowd the walls.",
        lights: [{ x: 60, y: 90, r: 50 }, { x: 200, y: 60, r: 40 }],
        props: [{ t: "cauldron", x: 52, hot: "clue0", label: "Bubbling cauldron" }, { t: "shelf", x: 104, hot: "clue1", label: "Potion shelf" }, { t: "table", x: 150, hot: "clue2", label: "Alchemist's table" }, { t: "skulls", x: 178 }, { t: "crate", x: 196, hot: "lockA", label: "Sealed crate" }, { t: "door", x: 226, hot: "lockB", label: "Lab door" }, { t: "torch", x: 10 }],
        clues: [
          { title: "The Bubbling Recipe", flavor: "A bubbling green potion. A bubble pops, and for a moment you hear a tiny voice say \"hello\". You step back.",
            text: "Long binary numbers are hard to read, so programmers use HEXADECIMAL (base 16). It has 16 digits: 0 to 9, then A=10, B=11, C=12, D=13, E=14, F=15. Each place is worth 16 times the one to its right. A two digit hex number is a first digit times 16, plus the second digit.",
            ex: "3F = 3 x 16 + 15 = 63\nB7 = 11 x 16 + 7 = 183\nFF = 15 x 16 + 15 = 255" },
          { title: "Labels on the Bottles", flavor: "Dusty bottles in neat rows. Some are labeled in a language you cannot read. One of them is moving.",
            text: "Here is why hex is so handy: ONE hex digit is exactly 4 bits. So a byte (8 bits) is exactly TWO hex digits. To convert binary to hex, cut the bits into groups of 4 from the right and turn each group into one digit. To go back, turn each hex digit into 4 bits.",
            ex: "1011 0110  ->  B 6\nB = 1011   6 = 0110\nSo B6 in hex = 10110110 in binary" },
          { title: "The Alchemist's Notebook", flavor: "A notebook filled with sketches of a monster. The monster looks a lot like you. You close the notebook.",
            text: "Hex is used for COLORS (#FF0000 is red) and for other computer values. The biggest 2 digit hex number is FF, which is 255, the biggest number a byte can hold. To compare hex numbers, compare the left digit first (it is worth 16 each). 9 is less than A, and A is less than F. Hex digits only go up to F: G is not a hex digit.",
            ex: "Digits: 0 1 2 3 4 5 6 7 8 9 A B C D E F\n2 hex digits = 1 byte\nCount: ... 8 9 A B C D E F 10 11" }
        ],
        lockA: "The crate is sealed with a hex lock.", lockB: "The lab door has a keypad that wants a hex code." },
      { name: "The Stained Glass Chapel", lesson: "8.6", short: "Pixel Colors", wall: "stone", floor: "flag", pal: DEEP, dark: 0.55, loot: "Rainbow Shard",
        arrive: "Moonlight pours through huge windows of red, green and blue glass. The chapel is silent, except for something whispering.",
        lights: [{ x: 120, y: 50, r: 70 }],
        props: [{ t: "stained", x: 36, hot: "clue0", label: "Red glass" }, { t: "stained", x: 76, hot: "clue1", label: "Green glass" }, { t: "stained", x: 116, hot: "clue2", label: "Blue glass" }, { t: "candelabra", x: 150 }, { t: "statue", x: 176, o: { glow: true }, hot: "lockA", label: "Statue with red eyes" }, { t: "door", x: 218, hot: "lockB", label: "Chapel door" }],
        clues: [
          { title: "The Red Window", flavor: "Red stained glass. When the light moves, it looks like the glass is breathing. You decide it is the wind.",
            text: "Every pixel on a screen is a mix of three lights: RED, GREEN and BLUE (RGB). Each light has a level from 0 (off) to 255 (full), which is one byte each, so a color pixel uses 3 bytes (24 bits). All three off is black. All three full is white. Red and green make yellow, green and blue make cyan, and red and blue make magenta.",
            ex: "(255, 0, 0) = red\n(0, 255, 0) = green\n(255, 255, 0) = yellow\n(0, 0, 0) = black     (255, 255, 255) = white" },
          { title: "The Green Window", flavor: "Green glass, covered in moss. The moss seems to be growing as you watch.",
            text: "With 256 levels for each of 3 colors, a pixel can show 256 x 256 x 256 = 16,777,216 different colors (about 16.7 million). When all three levels are EQUAL, the color is a shade of gray: (0,0,0) is black, (128,128,128) is gray, and (255,255,255) is white. Higher numbers mean brighter light.",
            ex: "3 bytes = 24 bits per pixel\n2^24 = 16,777,216 colors\nR = G = B  ->  a gray" },
          { title: "The Blue Window", flavor: "Blue glass. Through it, the moon looks wrong. It is almost like a giant eye. Probably a trick of the glass.",
            text: "Web designers write colors in HEX as #RRGGBB: two hex digits each for red, green and blue. #FF0000 is full red (FF = 255), #00FF00 is full green, #0000FF is full blue, #FFFFFF is white and #000000 is black. #FFFF00 is red + green = yellow. Learn to read a hex color pair by pair.",
            ex: "#FF8000 = (255, 128, 0) = orange\n#00FFFF = cyan\n#808080 = gray" }
        ],
        lockA: "The statue's red eyes flicker. Its lock mixes colors of light.", lockB: "The chapel door is locked with a color code." },
      { name: "The Hall of Mirrors", lesson: "8.7", short: "Image Manipulation", wall: "stone", floor: "tile", pal: ["#3a3d5c", "#2e3050", "#2a2c46", "#222438", "#a5b4fc"], dark: 0.6, loot: "Mirror Shard",
        arrive: "A hall of mirrors. Your reflection moves a little too slowly. Then, one of them does not move at all.",
        lights: [{ x: 70, y: 60, r: 54 }, { x: 170, y: 60, r: 54 }],
        props: [{ t: "mirror", x: 32, hot: "clue0", label: "Dark mirror" }, { t: "mirror", x: 76, hot: "clue1", label: "Gray mirror" }, { t: "mirror", x: 120, hot: "clue2", label: "Wavy mirror" }, { t: "torch", x: 100 }, { t: "candelabra", x: 150 }, { t: "mirror", x: 176, hot: "lockA", label: "Cracked mirror" }, { t: "door", x: 218, hot: "lockB", label: "Hall door" }],
        clues: [
          { title: "The Inverting Mirror", flavor: "A mirror showing the room with the colors swapped. White walls, black floor. You wave. It waves a half second late.",
            text: "A FILTER changes an image by doing math on every pixel. INVERT turns each color value into 255 minus the value: black (0) becomes white (255), and a bright red (255, 0, 0) becomes cyan (0, 255, 255). Brighten adds to every value and darken subtracts, and the result can never go below 0 or above 255.",
            ex: "invert: v becomes 255 - v\n(200, 50, 10) -> (55, 205, 245)\nbrighten +40: (200, 50, 10) -> (240, 90, 50)" },
          { title: "The Gray Mirror", flavor: "A mirror that shows everything in gray. Even the blood on your sleeve looks gray. You did not have blood on your sleeve earlier.",
            text: "GRAYSCALE makes R, G and B equal, usually by averaging them: (R + G + B) / 3. A pixel (30, 90, 60) averages 60, so it becomes (60, 60, 60). A THRESHOLD filter makes a black and white picture: if a pixel is brighter than the threshold it becomes white, and otherwise black.",
            ex: "grayscale: (30, 90, 60) -> (60, 60, 60)\nthreshold 128: value 200 -> white, value 90 -> black" },
          { title: "The Wavy Mirror", flavor: "A funhouse mirror. In it you are very tall, and the thing behind you is even taller. You do not turn around.",
            text: "Some filters move pixels instead of changing them. A MIRROR (flip) filter reverses the order of the pixels in each row, so the leftmost pixel swaps with the rightmost. Another filter swaps channels, like swapping red and blue, which turns (255, 0, 0) red into (0, 0, 255) blue. Filters can be combined: a picture gets changed one filter after another, in order.",
            ex: "Row: RED  GREEN  BLUE\nMirror: BLUE  GREEN  RED\nSwap R and B: (255, 100, 0) -> (0, 100, 255)" }
        ],
        lockA: "The cracked mirror shows a puzzle in its reflection.", lockB: "The hall door can only be opened by solving what the mirrors show." },
      { name: "The Cellar of Crates", lesson: "8.8", short: "Data Compression", wall: "stone", floor: "flag", pal: ["#3c3a44", "#2f2d38", "#2e2c36", "#24222c", "#d6a96a"], dark: 0.65, loot: "Iron Key",
        arrive: "A damp cellar crammed with barrels and crates, stacked too high. Something is rustling behind the boxes.",
        lights: [{ x: 60, y: 80, r: 46 }, { x: 180, y: 80, r: 46 }],
        props: [{ t: "barrel", x: 30, hot: "clue0", label: "Old barrel" }, { t: "crate", x: 64, hot: "clue1", label: "Stamped crate" }, { t: "barrel", x: 100, hot: "clue2", label: "Leaky barrel" }, { t: "torch", x: 130 }, { t: "crate", x: 150, o: { col: "#4a3a24" } }, { t: "chest", x: 180, hot: "lockA", label: "Iron chest" }, { t: "door", x: 220, hot: "lockB", label: "Cellar door" }, { t: "cobweb", x: 6, y: 16 }],
        clues: [
          { title: "Why Squeeze It?", flavor: "A barrel of rotten apples. It smells terrible. Your nose is full of apples and fear.",
            text: "COMPRESSION makes data take fewer bits so it uses less storage and is faster to send. LOSSLESS compression shrinks a file in a way that can be undone perfectly, so you get back EXACTLY the original. It works by finding patterns and repeats and writing them in a shorter way. It is used for text, programs and anything where every bit matters.",
            ex: "Lossless: original -> smaller -> EXACT original\nGood for: documents, code, spreadsheets" },
          { title: "Stamped Crate", flavor: "A crate stamped with a symbol you do not recognize. It rattles when you shake it. You stop shaking it.",
            text: "RUN-LENGTH ENCODING (RLE) is a simple lossless method: instead of writing a letter many times, write HOW MANY times, then the letter. AAAA becomes 4A. To decode, expand each count back into letters. RLE works great when data has long runs of the same value, like a picture with large areas of one color.",
            ex: "AAAABBBCC  ->  4A3B2C\n5X2Y  ->  XXXXXYY" },
          { title: "The Leaky Barrel", flavor: "A barrel that leaks something dark. It might be wine. It is almost certainly not wine.",
            text: "A COMPRESSION RATIO compares the sizes. A 100 MB file squeezed to 20 MB is 5 times smaller, a ratio of 5 to 1. But some data does not compress well. RLE on ABCDEF (no repeats) makes 1A1B1C1D1E1F, which is LONGER than the original. If the data has no patterns, there is nothing to squeeze.",
            ex: "100 MB -> 20 MB = 5 times smaller\nABC -> 1A1B1C (longer! no repeats)\nSaved = original size - new size" }
        ],
        lockA: "The iron chest is locked with a compression puzzle.", lockB: "The cellar door is locked with a smaller puzzle." },
      { name: "The Catacombs", lesson: "8.9", short: "Lossy Compression", wall: "stone", floor: "flag", pal: ["#3a3a3c", "#2d2d30", "#2c2c30", "#222226", "#e8e0c0"], dark: 0.7, loot: "Bone Crown",
        arrive: "Bones everywhere. The walls are stacked with skulls, and in the dark, something taps along to the sound of your footsteps.",
        lights: [{ x: 40, y: 80, r: 44 }, { x: 150, y: 80, r: 44 }],
        props: [{ t: "skeleton", x: 36, hot: "clue0", label: "Sitting skeleton" }, { t: "coffin", x: 84, hot: "clue1", label: "Open coffin" }, { t: "skulls", x: 128, hot: "clue2", label: "Pile of skulls" }, { t: "torch", x: 150 }, { t: "gargoyle", x: 176, y: 70, hot: "lockA", label: "Gargoyle" }, { t: "door", x: 218, hot: "lockB", label: "Crypt door" }],
        clues: [
          { title: "The Skeleton Who Forgot", flavor: "A skeleton, slumped against the wall. Its jaw is open. You are positive it was closed a moment ago.",
            text: "LOSSY compression gets much smaller files by THROWING AWAY details people will hardly notice, and the thrown away data can NOT be brought back. JPEG pictures, MP3 music and most streaming video are lossy. The more you compress, the smaller the file, but the lower the quality. You trade quality for size.",
            ex: "Lossy: original -> much smaller -> NOT exactly the original\nJPEG, MP3, streaming video" },
          { title: "The Open Coffin", flavor: "An open coffin. It is empty and still warm. Ah.",
            text: "WHEN to use which? Use LOSSLESS when every bit matters: tax records, code, documents, medical scans. Use LOSSY when small size matters more than perfect detail and people will not notice: photos for the web, music, video calls. Once a file is compressed in a lossy way and saved, the lost detail is gone for good.",
            ex: "Spreadsheet of grades -> lossless\nVacation video for the web -> lossy\nOriginal artwork master -> lossless" },
          { title: "A Pile of Skulls", flavor: "A neat pile of skulls. They are not as neat as they were when you walked in. One of them has moved.",
            text: "Two ways pictures get smaller: DOWNSAMPLING keeps fewer pixels (an image 600 x 300 shrunk to half in each direction becomes 300 x 150, a quarter of the pixels). Lower BIT DEPTH uses fewer bits per pixel: 24 bits is millions of colors, 8 bits is only 256 colors, and 1 bit is two colors. Both lose information, so both are lossy.",
            ex: "600 x 300 = 180,000 pixels\nhalf width + half height = 300 x 150 = 45,000\nbit depth 24 -> 8: fewer colors, 3 times smaller" }
        ],
        lockA: "The gargoyle's mouth is full of a lock.", lockB: "The crypt door has a lock that wants a decision." },
      { name: "The Cipher Tower", lesson: "8.10", short: "Cryptography", wall: "stone", floor: "flag", pal: ["#3a3558", "#2c2846", "#2e2a48", "#241f3a", "#c4b5fd"], dark: 0.6, loot: "Master Key",
        arrive: "A spiral tower room full of ancient devices. Letters are carved all over the walls, but none of them spell anything.",
        lights: [{ x: 120, y: 40, r: 70 }],
        props: [{ t: "desk", x: 36, hot: "clue0", label: "Code-breaker's desk" }, { t: "clock", x: 80, hot: "clue1", label: "Alphabet clock" }, { t: "scroll", x: 120, hot: "clue2", label: "Scroll of locks" }, { t: "candelabra", x: 150 }, { t: "chest", x: 180, hot: "lockA", label: "Cipher chest" }, { t: "door", x: 220, hot: "lockB", label: "Stairs to the throne room" }, { t: "torch", x: 10 }],
        clues: [
          { title: "The Code Breaker's Desk", flavor: "A desk covered in scribbles of letters. Someone has been scratching one phrase into the wood over and over: LET ME OUT.",
            text: "ENCRYPTION scrambles a message so only people with the right KEY can read it. The original message is PLAINTEXT, and the scrambled one is CIPHERTEXT. A CAESAR CIPHER shifts every letter forward by a fixed number, wrapping Z back to A. With a shift of 3, A becomes D and X becomes A. To DECRYPT, shift each letter back by the same amount.",
            ex: "Shift 3:  HELLO -> KHOOR\nDecrypt:  KHOOR -> shift back 3 -> HELLO" },
          { title: "The Alphabet Clock", flavor: "A clock with letters instead of numbers. It strikes a letter every hour. It is striking one now, and it is not a good one.",
            text: "A Caesar cipher is EASY to break. There are only 25 possible shifts, so you can just try them all. Or use FREQUENCY ANALYSIS: in English the letter E is the most common, so if the most common letter in a long ciphertext is H, the shift was probably 3. Because of this, real encryption needs far bigger keys.",
            ex: "E most common in English\nMost common ciphertext letter: H\nH - E = 3 places, so the shift is likely 3" },
          { title: "The Scroll of Locks", flavor: "A scroll with a drawing of a key. Under the key, in tiny letters: \"too late.\"",
            text: "SYMMETRIC encryption uses ONE shared secret key to lock and unlock. The problem: how do two strangers share the key safely? PUBLIC KEY (asymmetric) encryption solves it with a PAIR: a public key anyone can use to lock a message to you, and a private key that only you keep to unlock it. This is how browsers talk safely to websites you have never met.",
            ex: "Symmetric: 1 shared key\nPublic key: lock with Ana's PUBLIC key, only Ana's PRIVATE key unlocks" }
        ],
        lockA: "The chest is covered in a cipher.", lockB: "The stairs are sealed with the last cipher lock." }
    ],
    boss: { name: "The Throne Room", lesson: "Final", short: "Everything in Unit 8", wall: "stone", floor: "flag", pal: RED, dark: 0.55,
      arrive: "A huge throne room. The Baron sits on his throne, and beside him, in an iron cage, is Mina. She is alive.",
      lights: [{ x: 120, y: 60, r: 80 }],
      props: [{ t: "torch", x: 20 }, { t: "torch", x: 220 }, { t: "banner", x: 62, y: 44 }, { t: "banner", x: 178, y: 44 }, { t: "rug", x: 120, y: FL + 22, o: { col: "#6a1f2b" } }, { t: "throne", x: 120 }, { t: "cage", x: 36, hot: "cage", label: "Mina's cage" }] }
  };
})();
