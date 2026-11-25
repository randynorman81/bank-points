"""Picture-word (emoji) puzzles. emoji|answer|category"""
from lib import *
import lib

REB = table("""
🦁👑|The Lion King|Movie
❄️👸⛄|Frozen|Movie
🕷️🧑|Spider-Man|Movie
🦇🧑|Batman|Movie
🚢🧊|Titanic|Movie
🐠🔍|Finding Nemo|Movie
🦖🏝️|Jurassic Park|Movie
👽📞🏠|E.T. the Extra-Terrestrial|Movie
🧙‍♂️💍🌋|The Lord of the Rings|Movie
👻🚫|Ghostbusters|Movie
🦈🌊🩸|Jaws|Movie
🏠🎈👴|Up|Movie
🧸🤠🚀|Toy Story|Movie
🐀👨‍🍳|Ratatouille|Movie
🤖🌱🗑️|WALL-E|Movie
🧞‍♂️🪔|Aladdin|Movie
🌹👹👸|Beauty and the Beast|Movie
🚗⚡🏁|Cars|Movie
🐼🥋|Kung Fu Panda|Movie
🏠👦🎄🪤|Home Alone|Movie
🌪️👠🌈|The Wizard of Oz|Movie
🐟🐠🐡🌊🧜‍♀️|The Little Mermaid|Movie
👸🐸💋|The Princess and the Frog|Movie
🎃👻🍬|Halloween|Holiday
🦃🥧🍂|Thanksgiving|Holiday
🎄🎅🎁|Christmas|Holiday
💘🍫🌹|Valentine's Day|Holiday
🎆🇺🇸🌭|Fourth of July|Holiday
🐰🥚🌷|Easter|Holiday
🕎🔥🕯️|Hanukkah|Holiday
🌧️🐱🐶|Raining Cats and Dogs|Idiom
2️⃣🐦1️⃣🪨|Two Birds, One Stone|Idiom
🧊🔨|Break the Ice|Idiom
🐘🏠|The Elephant in the Room|Idiom
🌙🔵|Once in a Blue Moon|Idiom
🐟💧➡️🌊|Fish Out of Water|Idiom
🛒➡️🐴|Cart Before the Horse|Idiom
🐎🎁👄|Don't Look a Gift Horse in the Mouth|Idiom
🐦⏰🪱|The Early Bird Gets the Worm|Idiom
☂️💃|Umbrella|Song
👑💃|Dancing Queen|Song
🏨🌴☀️|Hotel California|Song
🚀👨|Rocket Man|Song
🟡🚕|Big Yellow Taxi|Song
🐯👁️|Eye of the Tiger|Song
🌈🌦️🎶|Somewhere Over the Rainbow|Song
🕺👑|Dancing Queen|Song
💎☁️🌤️|Lucy in the Sky with Diamonds|Song
🗽🍎|New York City|Place
🗼🥖|Paris|Place
🏛️🍝|Rome|Place
🎰🎲🌵|Las Vegas|Place
🍑🌳|Peachtree Street|Place
🌴☀️🏖️|Miami|Place
🎷⚜️|New Orleans|Place
🎸🤠|Nashville|Place
🌉🌫️|San Francisco|Place
🐨🦘🇦🇺|Australia|Place
🍁🛶🇨🇦|Canada|Place
🐳⚓|Moby-Dick|Book
🧙⚡📖|Harry Potter|Book
👑👦🌹|The Little Prince|Book
🐛🍎🦋|The Very Hungry Caterpillar|Book
👧🐇🕳️|Alice in Wonderland|Book
🐷🕸️|Charlotte's Web|Book
🐺🐖🏠|The Three Little Pigs|Book
🍞🏠🧙‍♀️|Hansel and Gretel|Book
🧪👨‍🏫|Breaking Bad|TV Show
🏝️✈️|Lost|TV Show
👑🐉🗡️|Game of Thrones|TV Show
🧒🚲🔦|Stranger Things|TV Show
🧽🍍|SpongeBob SquarePants|TV Show
🧟🚶|The Walking Dead|TV Show
🛸🖖|Star Trek|TV Show
💼📎🧑‍💼|The Office|TV Show
🛋️☕👫|Friends|TV Show
🌮🌶️|Tacos|Food
🍣🐟🍚|Sushi|Food
🌭🐕|Hot Dog|Food
🍔👑|Burger King|Brand
⭐☕|Starbucks|Brand
🐊🐢🦎|Reptiles|Nature
🐝🍯|Honey|Food
🔥🦅|Phoenix|Mythology
👁️🐍👩|Medusa|Mythology
🐴🪽|Pegasus|Mythology
⚡🔨👱‍♂️|Thor|Mythology
🏈🐶🔴|Georgia Bulldogs|Sports
🏀👑|LeBron James|Sports
⚾🥜🍿|Take Me Out to the Ball Game|Sports
🌍🕸️|World Wide Web|Tech
🖱️🐭|Computer Mouse|Tech
💾📀|Floppy Disk|Tech
""", 3)

def build():
    for e, a, c in REB:
        lib.REBUS.append((e, a, c))
