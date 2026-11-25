from lib import *

HEROES = table("""
Spider-Man|Peter Parker|Marvel
Iron Man|Tony Stark|Marvel
Captain America|Steve Rogers|Marvel
Thor|Thor Odinson|Marvel
The Hulk|Bruce Banner|Marvel
Black Widow|Natasha Romanoff|Marvel
Hawkeye|Clint Barton|Marvel
Black Panther|T'Challa|Marvel
Doctor Strange|Stephen Strange|Marvel
Ant-Man|Scott Lang|Marvel
Captain Marvel|Carol Danvers|Marvel
Scarlet Witch|Wanda Maximoff|Marvel
Daredevil|Matt Murdock|Marvel
Wolverine|Logan|Marvel
Deadpool|Wade Wilson|Marvel
Star-Lord|Peter Quill|Marvel
Professor X|Charles Xavier|Marvel
Cyclops|Scott Summers|Marvel
Storm|Ororo Munroe|Marvel
Batman|Bruce Wayne|DC
Superman|Clark Kent|DC
Wonder Woman|Diana Prince|DC
The Flash|Barry Allen|DC
Aquaman|Arthur Curry|DC
Green Lantern|Hal Jordan|DC
Robin|Dick Grayson|DC
Supergirl|Kara Danvers|DC
Cyborg|Victor Stone|DC
Batgirl|Barbara Gordon|DC
""", 3)

CHARS = table("""
Simba|The Lion King
Scar|The Lion King
Timon|The Lion King
Elsa|Frozen
Olaf|Frozen
Belle|Beauty and the Beast
Gaston|Beauty and the Beast
Ariel|The Little Mermaid
Ursula|The Little Mermaid
Aladdin|Aladdin
Jafar|Aladdin
Jasmine|Aladdin
Mulan|Mulan
Moana|Moana
Maui|Moana
Rapunzel|Tangled
Merida|Brave
Tiana|The Princess and the Frog
Cinderella|Cinderella
Snow White|Snow White and the Seven Dwarfs
Pocahontas|Pocahontas
Woody|Toy Story
Buzz Lightyear|Toy Story
Nemo|Finding Nemo
Dory|Finding Nemo
Sulley|Monsters, Inc.
Mike Wazowski|Monsters, Inc.
WALL-E|WALL-E
Remy|Ratatouille
Carl Fredricksen|Up
Lightning McQueen|Cars
Mater|Cars
Joy|Inside Out
Miguel|Coco
Mirabel|Encanto
Bambi|Bambi
Dumbo|Dumbo
Baloo|The Jungle Book
Mowgli|The Jungle Book
Pinocchio|Pinocchio
Peter Pan|Peter Pan
Captain Hook|Peter Pan
Stitch|Lilo & Stitch
Hercules|Hercules
Hades|Hercules
Tarzan|Tarzan
Maleficent|Sleeping Beauty
Cruella de Vil|101 Dalmatians
Mr. Incredible|The Incredibles
Edna Mode|The Incredibles
Bolt|Bolt
Genie|Aladdin
Sebastian|The Little Mermaid
Flynn Rider|Tangled
Kristoff|Frozen
Hiro Hamada|Big Hero 6
Baymax|Big Hero 6
Judy Hopps|Zootopia
Nick Wilde|Zootopia
Lumiere|Beauty and the Beast
Mushu|Mulan
Pumbaa|The Lion King
Rafiki|The Lion King
""", 2)
CHAR_AMBIG = {"Genie"}  # appears only in Aladdin anyway

SLOGANS = table("""
"Just Do It"|Nike
"I'm Lovin' It"|McDonald's
"Think Different"|Apple
"Have It Your Way"|Burger King
"Taste the Rainbow"|Skittles
"The Happiest Place on Earth"|Disneyland
"Finger Lickin' Good"|KFC
"Belong Anywhere"|Airbnb
"Eat Fresh"|Subway
"A Diamond Is Forever"|De Beers
"The Ultimate Driving Machine"|BMW
"Don't Leave Home Without It"|American Express
"Got Milk?"|California Milk Processor Board
"The King of Beers"|Budweiser
"Where's the beef?"|Wendy's
"Have a break, have a Kit Kat"|Kit Kat
"Impossible Is Nothing"|Adidas
"Open Happiness"|Coca-Cola
"Good to the last drop"|Maxwell House
"Because you're worth it"|L'Oréal
"Connecting people"|Nokia
"Snap! Crackle! Pop!"|Rice Krispies
"They're Gr-r-reat!"|Frosted Flakes
"Does she... or doesn't she?"|Clairol
"Maybe she's born with it"|Maybelline
"Easy breezy, beautiful"|CoverGirl
""", 2)
SLOGANS = [s for s in SLOGANS if s[1] not in ("Clairol", "Maybelline", "CoverGirl", "Rice Krispies", "Frosted Flakes")]

HAND = """
POP|Toys & Games|1|Which board game involves buying properties like Boardwalk and Park Place?|Monopoly|Clue|Risk|Life
POP|Toys & Games|2|In Monopoly, which are the two most expensive properties on the standard U.S. board?|Boardwalk and Park Place|Marvin Gardens and Ventnor|Pennsylvania and Pacific|Illinois and Indiana
POP|Toys & Games|2|In the game Clue, which character is Colonel?|Mustard|Scarlet|Plum|Peacock
POP|Toys & Games|2|In the game Clue, what is the victim's name?|Mr. Boddy|Dr. Black|Mr. Green|Professor Plum
POP|Toys & Games|2|Which game involves hitting the other player's ships with the call "You sunk my..."?|Battleship|Risk|Stratego|Sorry!
POP|Toys & Games|2|Which game uses tiles with letters and was invented by Alfred Butts?|Scrabble|Boggle|Upwords|Bananagrams
POP|Toys & Games|2|How many dice are used in a standard game of Yahtzee?|5|2|6|4
POP|Toys & Games|2|Which toy was invented in 1974 by Hungarian architect Ernő Rubik?|Rubik's Cube|Slinky|Etch A Sketch|Tetris
POP|Toys & Games|2|Which video game puzzle was created in 1984 by Alexey Pajitnov?|Tetris|Pac-Man|Dr. Mario|Bejeweled
POP|Toys & Games|2|Which Danish company makes interlocking plastic building bricks?|LEGO|Mega Bloks|K'NEX|Playmobil
POP|Toys & Games|2|Which company makes the Barbie doll?|Mattel|Hasbro|LEGO|Funko
POP|Toys & Games|2|Which company makes Monopoly, Nerf and Play-Doh?|Hasbro|Mattel|LEGO|Spin Master
POP|Toys & Games|2|Which doll line was introduced by Mattel in 1959 and named after the creator's daughter?|Barbie|Bratz|American Girl|Cabbage Patch Kids
POP|Toys & Games|2|What is the name of Barbie's boyfriend?|Ken|Allan|Skipper|Midge
POP|Toys & Games|2|What was the must-have toy of the 1996 holiday season, a furry tickle-me doll?|Tickle Me Elmo|Furby|Beanie Babies|Tamagotchi
POP|Toys & Games|2|Which virtual pet toy from 1996 was an egg-shaped device from Japan?|Tamagotchi|Furby|Giga Pet|Nintendogs
POP|Toys & Games|2|Which spring toy "walks" down stairs?|Slinky|Yo-yo|Pogo stick|Rubber band
POP|Toys & Games|2|Which wooden block-stacking game ends when the tower falls?|Jenga|Kerplunk|Operation|Connect Four
POP|Toys & Games|2|Which game has you drop discs into a grid to get four in a row?|Connect Four|Tic-Tac-Toe|Othello|Checkers
POP|Toys & Games|2|Which board game features the sentence "Do not pass Go, do not collect $200"?|Monopoly|Sorry!|Life|Clue
POP|Toys & Games|2|Which party game requires you to draw a word and guess it?|Pictionary|Charades|Taboo|Scattergories
POP|Toys & Games|2|Which popular card game features Skip, Reverse and Draw Two cards?|Uno|Go Fish|Crazy Eights|Old Maid
POP|Toys & Games|2|How many cards are in a standard deck, not counting jokers?|52|54|48|56
POP|Toys & Games|2|How many colors are on a standard Rubik's Cube?|6|4|8|5
POP|Toys & Games|2|What is the highest-scoring tile value in a standard English Scrabble set?|10 (Q and Z)|8|12|5
POP|Toys & Games|2|Which popular 2020 social deduction game features Crewmates and Impostors?|Among Us|Fall Guys|Fortnite|Minecraft
POP|Holidays|1|On which date is Christmas Day celebrated?|December 25|December 24|January 7|December 31
POP|Holidays|1|Which animal predicts six more weeks of winter if it sees its shadow?|Groundhog|Squirrel|Bear|Raccoon
POP|Holidays|2|In which Pennsylvania town does Phil the groundhog make his prediction?|Punxsutawney|Hershey|Gettysburg|Lancaster
POP|Holidays|2|On which Thursday of November is Thanksgiving celebrated in the U.S.?|Fourth|First|Second|Last
POP|Holidays|2|What is the name of the Mexican holiday celebrated on May 5th?|Cinco de Mayo|Día de los Muertos|Las Posadas|Independence Day
POP|Holidays|2|What is the Mexican holiday that honors the deceased, on November 1 and 2?|Día de los Muertos|Cinco de Mayo|Carnaval|Epiphany
POP|Holidays|2|How many candles are on a menorah used during Hanukkah, including the shamash?|9|8|7|10
POP|Holidays|2|How many nights does Hanukkah last?|8|7|9|10
POP|Holidays|2|What is the Hindu festival of lights called?|Diwali|Holi|Navratri|Raksha Bandhan
POP|Holidays|2|Which festival of colors in India celebrates spring?|Holi|Diwali|Eid|Onam
POP|Holidays|2|What does Mardi Gras mean in English?|Fat Tuesday|Happy Tuesday|Carnival time|Mask day
POP|Holidays|2|In which U.S. city is the most famous Mardi Gras celebration held?|New Orleans|Mobile|Galveston|Savannah
POP|Holidays|2|What is carved into a pumpkin at Halloween?|Jack-o'-lantern|Scarecrow|Gourd mask|Totem
POP|Holidays|2|From which tradition did jack-o'-lanterns originate?|Irish|Roman|Mexican|German
POP|Holidays|2|Which holiday falls on the third Monday in January in the U.S.?|Martin Luther King Jr. Day|Presidents' Day|Veterans Day|Labor Day
POP|Holidays|2|Which holiday falls on the last Monday in May in the U.S.?|Memorial Day|Labor Day|Veterans Day|Independence Day
POP|Holidays|2|Which holiday falls on the first Monday in September in the U.S.?|Labor Day|Memorial Day|Columbus Day|Veterans Day
POP|Holidays|2|Which holiday marks the end of Ramadan?|Eid al-Fitr|Eid al-Adha|Mawlid|Ashura
POP|Holidays|2|What do people in Japan traditionally eat on New Year's Eve, long noodles for long life?|Toshikoshi soba|Mochi|Sushi|Ramen
POP|Holidays|2|Which holiday celebrates African American heritage and culture from December 26 to January 1?|Kwanzaa|Juneteenth|Hanukkah|Black History Month
POP|Holidays|2|What day is Juneteenth observed?|June 19|July 4|January 1|June 1
POP|Holidays|2|What is the Chinese New Year animal for the year 2024?|Dragon|Snake|Rabbit|Horse
POP|Holidays|2|What is the Chinese New Year animal for the year 2025?|Snake|Dragon|Horse|Rabbit
POP|Holidays|2|Which animal is the Chinese zodiac sign that follows the Dragon?|Snake|Rabbit|Horse|Tiger
POP|Social Media|2|Which social media platform's logo is a ghost?|Snapchat|Instagram|TikTok|WhatsApp
POP|Social Media|2|Which short-video platform is owned by ByteDance?|TikTok|Instagram|Snapchat|Vine
POP|Social Media|2|Which platform has a character limit that started at 140 characters and was renamed X?|Twitter|Facebook|Threads|Tumblr
POP|Social Media|2|Which social network was created by Mark Zuckerberg at Harvard?|Facebook|MySpace|LinkedIn|Friendster
POP|Social Media|2|Which social network is aimed at professionals and job seekers?|LinkedIn|Facebook|Pinterest|Reddit
POP|Social Media|2|Which platform is used to pin images to "boards"?|Pinterest|Tumblr|Flickr|Instagram
POP|Social Media|2|Which platform's mascot is Snoo, an alien?|Reddit|Discord|Twitch|Tumblr
POP|Social Media|2|Which platform is used to live-stream video games, owned by Amazon?|Twitch|YouTube|Discord|Mixer
POP|Social Media|2|Which app owned by Meta is popular for messaging, with a green icon?|WhatsApp|Signal|Telegram|WeChat
POP|Social Media|2|What is the first video ever uploaded to YouTube titled?|Me at the zoo|Charlie bit my finger|Evolution of Dance|Gangnam Style
POP|Social Media|2|Which YouTuber is known for elaborate challenge videos and Beast Games?|MrBeast|PewDiePie|Markiplier|Ninja
POP|Social Media|2|Which singer's "Despacito" video was the first to reach 3 billion YouTube views?|Luis Fonsi|Ed Sheeran|PSY|Wiz Khalifa
POP|Social Media|2|Which internet cat became famous for its grumpy expression?|Grumpy Cat|Keyboard Cat|Nyan Cat|Lil Bub
POP|Social Media|2|Which phrase abbreviated "LOL" stands for?|Laughing out loud|Lots of love|Look out loud|Live on line
POP|Social Media|2|Which phrase abbreviated "FOMO" stands for?|Fear of missing out|Fun on my own|Fear of money outflow|Fine, okay, move on
POP|Social Media|2|What does the abbreviation "GOAT" stand for?|Greatest of all time|Good on any tier|Great old American tradition|Go on a trip
POP|Celebrity|2|Which reality TV family stars in "Keeping Up with the...?" |Kardashians|Osbournes|Jacksons|Hiltons
POP|Celebrity|2|Which former talk show host has a book club and a network called OWN?|Oprah Winfrey|Ellen DeGeneres|Rosie O'Donnell|Tyra Banks
POP|Celebrity|2|Which wrestler turned actor is known as "The Rock"?|Dwayne Johnson|John Cena|Hulk Hogan|Batista
POP|Celebrity|2|Which wrestler is known for the catchphrase "You can't see me"?|John Cena|The Rock|Triple H|Randy Orton
POP|Celebrity|2|Which famous wrestler is known for "Whatcha gonna do, brother?"|Hulk Hogan|Stone Cold Steve Austin|Ric Flair|Macho Man Randy Savage
POP|Celebrity|2|Which actor is known as "Mr. Beast"? skip|x|x|x|x
POP|Celebrity|2|Which Hollywood couple is nicknamed "Bennifer"?|Ben Affleck and Jennifer Lopez|Brad Pitt and Angelina Jolie|Tom Cruise and Katie Holmes|Kim Kardashian and Kanye West
POP|Celebrity|2|Which couple was nicknamed "Brangelina"?|Brad Pitt and Angelina Jolie|Ben Affleck and Jennifer Garner|Tom Cruise and Nicole Kidman|Justin Timberlake and Jessica Biel
POP|Celebrity|2|Which Beatles member is known as the "quiet one"?|George Harrison|Ringo Starr|John Lennon|Paul McCartney
POP|Celebrity|2|Which comedian hosted The Daily Show and then Last Week Tonight?|John Oliver (Last Week Tonight)|Jon Stewart|Trevor Noah|Stephen Colbert
POP|Celebrity|2|Which actor won an Oscar for playing Walt Disney in Saving Mr. Banks? skip|x|x|x|x
POP|Celebrity|2|Which celebrity chef founded the Hell's Kitchen brand and is from London?|Gordon Ramsay|Jamie Oliver|Bobby Flay|Wolfgang Puck
POP|Celebrity|2|Which celebrity chef is known as "The Naked Chef"?|Jamie Oliver|Gordon Ramsay|Anthony Bourdain|Rachael Ray
POP|Celebrity|2|Which billionaire founded Tesla, SpaceX and now owns X (formerly Twitter)?|Elon Musk|Jeff Bezos|Bill Gates|Mark Zuckerberg
POP|Celebrity|2|Which billionaire founded Amazon?|Jeff Bezos|Elon Musk|Jack Ma|Larry Page
POP|Celebrity|2|Which billionaire founded Microsoft?|Bill Gates|Steve Jobs|Larry Ellison|Mark Cuban
POP|Celebrity|2|Which man co-founded Apple with Steve Wozniak?|Steve Jobs|Bill Gates|Tim Cook|Larry Page
POP|Celebrity|2|Which Georgia native is the founder of Chick-fil-A?|S. Truett Cathy|Dave Thomas|Colonel Sanders|Ray Kroc
POP|Celebrity|2|Which Georgia native founded CNN and the Atlanta Braves ownership era?|Ted Turner|Arthur Blank|Bernie Marcus|Ray Kroc
POP|Celebrity|2|Which Atlanta rapper is known for "Mask Off" and "Bad and Boujee"? skip|x|x|x|x
POP|Celebrity|2|Which Georgia-born singer is known as the "Georgia Peach" and rose to fame with "Georgia on My Mind"?|Ray Charles|Otis Redding|James Brown|Little Richard
POP|Celebrity|2|Which Georgia native is known as "The Godfather of Soul"?|James Brown|Otis Redding|Ray Charles|Little Richard
POP|Celebrity|2|Which Georgia native is called "The Architect of Rock and Roll"?|Little Richard|Ray Charles|James Brown|Otis Redding
POP|Celebrity|2|Which Georgia city is the hometown of Ludacris and OutKast?|Atlanta|Savannah|Macon|Athens
POP|Celebrity|2|Which Georgia city is the hometown of R.E.M.?|Athens|Atlanta|Macon|Savannah
POP|Celebrity|2|Which actor from Georgia starred in "The Fast and the Furious" and "Guardians"? skip|x|x|x|x
POP|Celebrity|2|Which TV drama featuring zombies was filmed mainly in Georgia?|The Walking Dead|Game of Thrones|Stranger Things|True Blood
POP|Celebrity|2|Which Georgia city hosts the film studio complex Tyler Perry Studios?|Atlanta|Savannah|Macon|Athens
POP|Celebrity|2|Which Marvel film was shot in Atlanta and features a fictional African nation?|Black Panther|Thor|Doctor Strange|Iron Man
POP|Celebrity|2|Which Georgia-born peanut farmer became the 39th President?|Jimmy Carter|Bill Clinton|Lyndon Johnson|Harry Truman
POP|Gaming|1|Which Nintendo character is a plumber who wears a red hat?|Mario|Luigi|Link|Wario
POP|Gaming|1|Which video game franchise features a blue hedgehog?|Sonic|Crash Bandicoot|Spyro|Rayman
POP|Gaming|1|Which yellow Pokémon is the mascot of the franchise?|Pikachu|Jigglypuff|Eevee|Meowth
POP|Gaming|2|Which character is the princess in The Legend of Zelda?|Zelda|Peach|Daisy|Samus
POP|Gaming|2|In Mario games, who is the main villain?|Bowser|Wario|Donkey Kong|King Boo
POP|Gaming|2|What is the best-selling video game of all time?|Minecraft|Tetris|GTA V|Wii Sports
POP|Gaming|2|Which game involves building with blocks in a procedurally generated world?|Minecraft|Roblox|Terraria|Fortnite
POP|Gaming|2|Which battle royale game features the "Battle Bus"?|Fortnite|PUBG|Apex Legends|Call of Duty: Warzone
POP|Gaming|2|Which company makes the PlayStation?|Sony|Microsoft|Nintendo|Sega
POP|Gaming|2|Which company makes the Xbox?|Microsoft|Sony|Nintendo|Sega
POP|Gaming|2|Which company makes the Switch console?|Nintendo|Sony|Microsoft|Valve
POP|Gaming|2|Which character is the main protagonist of The Legend of Zelda?|Link|Zelda|Ganon|Epona
POP|Gaming|2|What is the name of the yellow, pellet-eating arcade character?|Pac-Man|Q*bert|Frogger|Dig Dug
POP|Gaming|2|Which 1980 arcade game features ghosts named Blinky, Pinky, Inky and Clyde?|Pac-Man|Galaga|Asteroids|Space Invaders
POP|Gaming|2|Which 1972 game by Atari is considered one of the first commercially successful arcade games?|Pong|Space Invaders|Asteroids|Breakout
POP|Gaming|2|Which game series features a protagonist named Master Chief?|Halo|Gears of War|Call of Duty|Destiny
POP|Gaming|2|Which game features a collection of "Pokémon" caught with Poké Balls?|Pokémon|Digimon|Yu-Gi-Oh|Monster Rancher
POP|Gaming|2|Which game series features a hero named Kratos?|God of War|Devil May Cry|Assassin's Creed|Ghost of Tsushima
POP|Gaming|2|Which game series is set in a city called Los Santos?|Grand Theft Auto V|Saints Row|Watch Dogs|Cyberpunk
POP|Gaming|2|Which game features a farm and a protagonist who inherits it from a grandfather?|Stardew Valley|Animal Crossing|Harvest Moon|Minecraft
POP|Gaming|2|Which Nintendo game has you running a town with animal villagers, led by Tom Nook?|Animal Crossing|Stardew Valley|The Sims|Splatoon
POP|Gaming|2|What is the name of the princess Mario often rescues?|Princess Peach|Princess Zelda|Princess Daisy|Princess Rosalina
POP|Gaming|2|What is the name of the in-game currency in Fortnite?|V-Bucks|Robux|Gems|Coins
POP|Gaming|2|What is the name of the in-game currency in Roblox?|Robux|V-Bucks|Gold|Gems
"""

def build():
    alter = [h[1] for h in HEROES]; names = [h[0] for h in HEROES]
    for h, a, pub in HEROES:
        add("POP", "Superheroes", 1 if h in ("Spider-Man", "Iron Man", "Batman", "Superman", "Captain America", "Wonder Woman", "The Hulk", "Thor") else 2, f"What is the secret identity of {h}?", a, pick(alter, a, "hr" + h))
        add("POP", "Superheroes", 2, f"Which {pub} superhero is also known as {a}?", h, pick([x[0] for x in HEROES if x[2] == pub], h, "rhr" + h))
    films = sorted({c[1] for c in CHARS}); chars = [c[0] for c in CHARS]
    for c, f in CHARS:
        add("POP", "Animated Films", 1 if c in ("Simba", "Elsa", "Woody", "Buzz Lightyear", "Nemo", "Belle", "Ariel", "Aladdin", "Moana", "Mulan", "Cinderella", "Snow White") else 2, f"In which animated film does the character {c} appear?", f, pick(films, f, "ch" + c))
    brands = sorted({s[1] for s in SLOGANS})
    for s, b in SLOGANS:
        add("POP", "Slogans", 2, f"Which brand used the slogan {s}?", b, pick(brands, b, "sl" + b))
    parse_hand(HAND)
