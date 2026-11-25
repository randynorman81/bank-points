from lib import *

# film|year|director|role|actor
FILMS = table("""
Jaws|1975|Steven Spielberg|Police Chief Martin Brody|Roy Scheider
E.T. the Extra-Terrestrial|1982|Steven Spielberg|Elliott|Henry Thomas
Jurassic Park|1993|Steven Spielberg|Dr. Alan Grant|Sam Neill
Raiders of the Lost Ark|1981|Steven Spielberg|Indiana Jones|Harrison Ford
Schindler's List|1993|Steven Spielberg|Oskar Schindler|Liam Neeson
Saving Private Ryan|1998|Steven Spielberg|Captain John Miller|Tom Hanks
Star Wars: A New Hope|1977|George Lucas|Luke Skywalker|Mark Hamill
The Empire Strikes Back|1980|Irvin Kershner|Han Solo|Harrison Ford
Alien|1979|Ridley Scott|Ellen Ripley|Sigourney Weaver
Blade Runner|1982|Ridley Scott|Rick Deckard|Harrison Ford
Gladiator|2000|Ridley Scott|Maximus|Russell Crowe
Titanic|1997|James Cameron|Jack Dawson|Leonardo DiCaprio
Avatar|2009|James Cameron|Jake Sully|Sam Worthington
Terminator 2: Judgment Day|1991|James Cameron|The T-800|Arnold Schwarzenegger
The Terminator|1984|James Cameron|Sarah Connor|Linda Hamilton
Back to the Future|1985|Robert Zemeckis|Marty McFly|Michael J. Fox
Forrest Gump|1994|Robert Zemeckis|Forrest Gump|Tom Hanks
Who Framed Roger Rabbit|1988|Robert Zemeckis|Eddie Valiant|Bob Hoskins
The Godfather|1972|Francis Ford Coppola|Vito Corleone|Marlon Brando
The Godfather Part II|1974|Francis Ford Coppola|Michael Corleone|Al Pacino
Apocalypse Now|1979|Francis Ford Coppola|Captain Willard|Martin Sheen
Goodfellas|1990|Martin Scorsese|Henry Hill|Ray Liotta
Taxi Driver|1976|Martin Scorsese|Travis Bickle|Robert De Niro
The Departed|2006|Martin Scorsese|Billy Costigan|Leonardo DiCaprio
Raging Bull|1980|Martin Scorsese|Jake LaMotta|Robert De Niro
Pulp Fiction|1994|Quentin Tarantino|Vincent Vega|John Travolta
Kill Bill: Vol. 1|2003|Quentin Tarantino|The Bride|Uma Thurman
Django Unchained|2012|Quentin Tarantino|Django|Jamie Foxx
Inglourious Basterds|2009|Quentin Tarantino|Lt. Aldo Raine|Brad Pitt
The Shawshank Redemption|1994|Frank Darabont|Andy Dufresne|Tim Robbins
The Green Mile|1999|Frank Darabont|Paul Edgecomb|Tom Hanks
Fight Club|1999|David Fincher|The Narrator|Edward Norton
Se7en|1995|David Fincher|Detective Somerset|Morgan Freeman
The Social Network|2010|David Fincher|Mark Zuckerberg|Jesse Eisenberg
Inception|2010|Christopher Nolan|Dom Cobb|Leonardo DiCaprio
The Dark Knight|2008|Christopher Nolan|The Joker|Heath Ledger
Interstellar|2014|Christopher Nolan|Cooper|Matthew McConaughey
Memento|2000|Christopher Nolan|Leonard Shelby|Guy Pearce
Oppenheimer|2023|Christopher Nolan|J. Robert Oppenheimer|Cillian Murphy
The Matrix|1999|The Wachowskis|Neo|Keanu Reeves
Die Hard|1988|John McTiernan|John McClane|Bruce Willis
Predator|1987|John McTiernan|Dutch|Arnold Schwarzenegger
The Silence of the Lambs|1991|Jonathan Demme|Clarice Starling|Jodie Foster
Rocky|1976|John G. Avildsen|Rocky Balboa|Sylvester Stallone
The Karate Kid|1984|John G. Avildsen|Daniel LaRusso|Ralph Macchio
Ghostbusters|1984|Ivan Reitman|Dr. Peter Venkman|Bill Murray
The Breakfast Club|1985|John Hughes|John Bender|Judd Nelson
Ferris Bueller's Day Off|1986|John Hughes|Ferris Bueller|Matthew Broderick
Home Alone|1990|Chris Columbus|Kevin McCallister|Macaulay Culkin
Mrs. Doubtfire|1993|Chris Columbus|Daniel Hillard|Robin Williams
Harry Potter and the Sorcerer's Stone|2001|Chris Columbus|Harry Potter|Daniel Radcliffe
Toy Story|1995|John Lasseter|Woody (voice)|Tom Hanks
Finding Nemo|2003|Andrew Stanton|Marlin (voice)|Albert Brooks
The Lion King|1994|Roger Allers and Rob Minkoff|Adult Simba (voice)|Matthew Broderick
Shrek|2001|Andrew Adamson and Vicky Jenson|Shrek (voice)|Mike Myers
Frozen|2013|Chris Buck and Jennifer Lee|Elsa (voice)|Idina Menzel
The Incredibles|2004|Brad Bird|Mr. Incredible (voice)|Craig T. Nelson
Mean Girls|2004|Mark Waters|Cady Heron|Lindsay Lohan
Clueless|1995|Amy Heckerling|Cher Horowitz|Alicia Silverstone
Legally Blonde|2001|Robert Luketic|Elle Woods|Reese Witherspoon
Bridesmaids|2011|Paul Feig|Annie Walker|Kristen Wiig
Superbad|2007|Greg Mottola|Seth|Jonah Hill
The Hangover|2009|Todd Phillips|Phil Wenneck|Bradley Cooper
Anchorman|2004|Adam McKay|Ron Burgundy|Will Ferrell
Napoleon Dynamite|2004|Jared Hess|Napoleon Dynamite|Jon Heder
Groundhog Day|1993|Harold Ramis|Phil Connors|Bill Murray
Caddyshack|1980|Harold Ramis|Ty Webb|Chevy Chase
Dumb and Dumber|1994|Peter Farrelly|Lloyd Christmas|Jim Carrey
The Mask|1994|Chuck Russell|Stanley Ipkiss|Jim Carrey
Ace Ventura: Pet Detective|1994|Tom Shadyac|Ace Ventura|Jim Carrey
Black Panther|2018|Ryan Coogler|T'Challa|Chadwick Boseman
Iron Man|2008|Jon Favreau|Tony Stark|Robert Downey Jr.
The Avengers|2012|Joss Whedon|Tony Stark|Robert Downey Jr.
Guardians of the Galaxy|2014|James Gunn|Peter Quill|Chris Pratt
Wonder Woman|2017|Patty Jenkins|Diana Prince|Gal Gadot
Top Gun|1986|Tony Scott|Maverick|Tom Cruise
Top Gun: Maverick|2022|Joseph Kosinski|Maverick|Tom Cruise
Mission: Impossible|1996|Brian De Palma|Ethan Hunt|Tom Cruise
Jerry Maguire|1996|Cameron Crowe|Jerry Maguire|Tom Cruise
Dirty Dancing|1987|Emile Ardolino|Johnny Castle|Patrick Swayze
Ghost|1990|Jerry Zucker|Sam Wheat|Patrick Swayze
Pretty Woman|1990|Garry Marshall|Vivian Ward|Julia Roberts
When Harry Met Sally|1989|Rob Reiner|Sally Albright|Meg Ryan
The Princess Bride|1987|Rob Reiner|Westley|Cary Elwes
Stand by Me|1986|Rob Reiner|Gordie Lachance|Wil Wheaton
Rain Man|1988|Barry Levinson|Raymond Babbitt|Dustin Hoffman
The Graduate|1967|Mike Nichols|Benjamin Braddock|Dustin Hoffman
Psycho|1960|Alfred Hitchcock|Norman Bates|Anthony Perkins
Vertigo|1958|Alfred Hitchcock|Scottie Ferguson|James Stewart
Casablanca|1942|Michael Curtiz|Rick Blaine|Humphrey Bogart
Gone with the Wind|1939|Victor Fleming|Scarlett O'Hara|Vivien Leigh
The Wizard of Oz|1939|Victor Fleming|Dorothy|Judy Garland
It's a Wonderful Life|1946|Frank Capra|George Bailey|James Stewart
Singin' in the Rain|1952|Gene Kelly and Stanley Donen|Don Lockwood|Gene Kelly
Sunset Boulevard|1950|Billy Wilder|Norma Desmond|Gloria Swanson
Breakfast at Tiffany's|1961|Blake Edwards|Holly Golightly|Audrey Hepburn
Roman Holiday|1953|William Wyler|Princess Ann|Audrey Hepburn
To Kill a Mockingbird|1962|Robert Mulligan|Atticus Finch|Gregory Peck
The Sound of Music|1965|Robert Wise|Maria|Julie Andrews
Mary Poppins|1964|Robert Stevenson|Mary Poppins|Julie Andrews
Grease|1978|Randal Kleiser|Danny Zuko|John Travolta
Saturday Night Fever|1977|John Badham|Tony Manero|John Travolta
The Lord of the Rings: The Fellowship of the Ring|2001|Peter Jackson|Frodo Baggins|Elijah Wood
King Kong|1933|Merian C. Cooper and Ernest B. Schoedsack|Ann Darrow|Fay Wray
Beetlejuice|1988|Tim Burton|Beetlejuice|Michael Keaton
Edward Scissorhands|1990|Tim Burton|Edward|Johnny Depp
Pirates of the Caribbean: The Curse of the Black Pearl|2003|Gore Verbinski|Jack Sparrow|Johnny Depp
Spider-Man|2002|Sam Raimi|Peter Parker|Tobey Maguire
Batman|1989|Tim Burton|Batman|Michael Keaton
Superman|1978|Richard Donner|Superman|Christopher Reeve
The Goonies|1985|Richard Donner|Mikey Walsh|Sean Astin
Lethal Weapon|1987|Richard Donner|Martin Riggs|Mel Gibson
Speed|1994|Jan de Bont|Jack Traven|Keanu Reeves
Twister|1996|Jan de Bont|Jo Harding|Helen Hunt
Men in Black|1997|Barry Sonnenfeld|Agent J|Will Smith
Independence Day|1996|Roland Emmerich|Captain Steven Hiller|Will Smith
The Pursuit of Happyness|2006|Gabriele Muccino|Chris Gardner|Will Smith
Good Will Hunting|1997|Gus Van Sant|Will Hunting|Matt Damon
The Bourne Identity|2002|Doug Liman|Jason Bourne|Matt Damon
Ocean's Eleven|2001|Steven Soderbergh|Danny Ocean|George Clooney
Erin Brockovich|2000|Steven Soderbergh|Erin Brockovich|Julia Roberts
Crouching Tiger, Hidden Dragon|2000|Ang Lee|Li Mu Bai|Chow Yun-fat
Parasite|2019|Bong Joon-ho|Kim Ki-taek|Song Kang-ho
Joker|2019|Todd Phillips|Arthur Fleck|Joaquin Phoenix
La La Land|2016|Damien Chazelle|Sebastian|Ryan Gosling
Barbie|2023|Greta Gerwig|Barbie|Margot Robbie
Little Women|2019|Greta Gerwig|Jo March|Saoirse Ronan
Get Out|2017|Jordan Peele|Chris Washington|Daniel Kaluuya
A Quiet Place|2018|John Krasinski|Evelyn Abbott|Emily Blunt
Mad Max: Fury Road|2015|George Miller|Imperator Furiosa|Charlize Theron
The Revenant|2015|Alejandro G. Iñárritu|Hugh Glass|Leonardo DiCaprio
Gravity|2013|Alfonso Cuarón|Dr. Ryan Stone|Sandra Bullock
The Blind Side|2009|John Lee Hancock|Leigh Anne Tuohy|Sandra Bullock
Hidden Figures|2016|Theodore Melfi|Katherine Johnson|Taraji P. Henson
Glory|1989|Edward Zwick|Colonel Robert Gould Shaw|Matthew Broderick
Remember the Titans|2000|Boaz Yakin|Coach Herman Boone|Denzel Washington
Training Day|2001|Antoine Fuqua|Alonzo Harris|Denzel Washington
Moneyball|2011|Bennett Miller|Billy Beane|Brad Pitt
Rudy|1993|David Anspaugh|Rudy Ruettiger|Sean Astin
Field of Dreams|1989|Phil Alden Robinson|Ray Kinsella|Kevin Costner
Dances with Wolves|1990|Kevin Costner|Lt. John Dunbar|Kevin Costner
Finding Dory|2016|Andrew Stanton|Dory (voice)|Ellen DeGeneres
Coco|2017|Lee Unkrich|Miguel (voice)|Anthony Gonzalez
Inside Out|2015|Pete Docter|Joy (voice)|Amy Poehler
Moana|2016|Ron Clements and John Musker|Moana (voice)|Auliʻi Cravalho
Aladdin|1992|Ron Clements and John Musker|Genie (voice)|Robin Williams
Beauty and the Beast|1991|Gary Trousdale and Kirk Wise|Belle (voice)|Paige O'Hara
The Little Mermaid|1989|Ron Clements and John Musker|Ariel (voice)|Jodi Benson
Monsters, Inc.|2001|Pete Docter|Sulley (voice)|John Goodman
Cars|2006|John Lasseter|Lightning McQueen (voice)|Owen Wilson
Despicable Me|2010|Pierre Coffin and Chris Renaud|Gru (voice)|Steve Carell
Kung Fu Panda|2008|Mark Osborne and John Stevenson|Po (voice)|Jack Black
School of Rock|2003|Richard Linklater|Dewey Finn|Jack Black
Elf|2003|Jon Favreau|Buddy|Will Ferrell
Step Brothers|2008|Adam McKay|Brennan Huff|Will Ferrell
Talladega Nights|2006|Adam McKay|Ricky Bobby|Will Ferrell
The Wedding Singer|1998|Frank Coraci|Robbie Hart|Adam Sandler
Happy Gilmore|1996|Dennis Dugan|Happy Gilmore|Adam Sandler
Billy Madison|1995|Tamra Davis|Billy Madison|Adam Sandler
The Waterboy|1998|Frank Coraci|Bobby Boucher|Adam Sandler
Big|1988|Penny Marshall|Josh Baskin|Tom Hanks
A League of Their Own|1992|Penny Marshall|Dottie Hinson|Geena Davis
Sleepless in Seattle|1993|Nora Ephron|Sam Baldwin|Tom Hanks
You've Got Mail|1998|Nora Ephron|Joe Fox|Tom Hanks
Apollo 13|1995|Ron Howard|Jim Lovell|Tom Hanks
A Beautiful Mind|2001|Ron Howard|John Nash|Russell Crowe
Cast Away|2000|Robert Zemeckis|Chuck Noland|Tom Hanks
Rocky IV|1985|Sylvester Stallone|Ivan Drago|Dolph Lundgren
First Blood|1982|Ted Kotcheff|John Rambo|Sylvester Stallone
Total Recall|1990|Paul Verhoeven|Douglas Quaid|Arnold Schwarzenegger
RoboCop|1987|Paul Verhoeven|Alex Murphy|Peter Weller
Scarface|1983|Brian De Palma|Tony Montana|Al Pacino
The Big Lebowski|1998|Joel and Ethan Coen|The Dude|Jeff Bridges
Fargo|1996|Joel and Ethan Coen|Marge Gunderson|Frances McDormand
No Country for Old Men|2007|Joel and Ethan Coen|Anton Chigurh|Javier Bardem
The Sixth Sense|1999|M. Night Shyamalan|Dr. Malcolm Crowe|Bruce Willis
Signs|2002|M. Night Shyamalan|Graham Hess|Mel Gibson
The Princess Diaries|2001|Garry Marshall|Mia Thermopolis|Anne Hathaway
The Devil Wears Prada|2006|David Frankel|Miranda Priestly|Meryl Streep
Mamma Mia!|2008|Phyllida Lloyd|Donna Sheridan|Meryl Streep
Twilight|2008|Catherine Hardwicke|Bella Swan|Kristen Stewart
The Hunger Games|2012|Gary Ross|Katniss Everdeen|Jennifer Lawrence
Night at the Museum|2006|Shawn Levy|Larry Daley|Ben Stiller
Zoolander|2001|Ben Stiller|Derek Zoolander|Ben Stiller
Tropic Thunder|2008|Ben Stiller|Kirk Lazarus|Robert Downey Jr.
Wedding Crashers|2005|David Dobkin|John Beckwith|Owen Wilson
Dodgeball|2004|Rawson Marshall Thurber|Peter La Fleur|Vince Vaughn
Old School|2003|Todd Phillips|Mitch Martin|Luke Wilson
""", 5)

BEST_PICTURE = table("""
1991|Dances with Wolves
1992|The Silence of the Lambs
1993|Unforgiven
1994|Schindler's List
1995|Forrest Gump
1996|Braveheart
1997|The English Patient
1998|Titanic
1999|Shakespeare in Love
2000|American Beauty
2001|Gladiator
2002|A Beautiful Mind
2003|Chicago
2004|The Lord of the Rings: The Return of the King
2005|Million Dollar Baby
2006|Crash
2007|The Departed
2008|No Country for Old Men
2009|Slumdog Millionaire
2010|The Hurt Locker
2011|The King's Speech
2012|The Artist
2013|Argo
2014|12 Years a Slave
2015|Birdman
2016|Spotlight
2017|Moonlight
2018|The Shape of Water
2019|Green Book
2020|Parasite
2021|Nomadland
2022|CODA
2023|Everything Everywhere All at Once
2024|Oppenheimer
""", 2)

QUOTES = table("""
"Here's looking at you, kid."|Casablanca
"I'll be back."|The Terminator
"May the Force be with you."|Star Wars
"You're gonna need a bigger boat."|Jaws
"There's no place like home."|The Wizard of Oz
"Frankly, my dear, I don't give a damn."|Gone with the Wind
"E.T. phone home."|E.T. the Extra-Terrestrial
"Life is like a box of chocolates."|Forrest Gump
"I see dead people."|The Sixth Sense
"Show me the money!"|Jerry Maguire
"I'm the king of the world!"|Titanic
"Yippee-ki-yay."|Die Hard
"Why so serious?"|The Dark Knight
"To infinity and beyond!"|Toy Story
"Just keep swimming."|Finding Nemo
"Hasta la vista, baby."|Terminator 2: Judgment Day
"Great Scott!"|Back to the Future
"You can't handle the truth!"|A Few Good Men
"Nobody puts Baby in a corner."|Dirty Dancing
"Houston, we have a problem."|Apollo 13
"I feel the need—the need for speed!"|Top Gun
"Inconceivable!"|The Princess Bride
"As you wish."|The Princess Bride
"They call me Mister Tibbs!"|In the Heat of the Night
"Who you gonna call?"|Ghostbusters
"Say hello to my little friend!"|Scarface
"Bond. James Bond."|Dr. No
"Elementary, my dear Watson."|Sherlock Holmes (attributed, not in the books)
"I am your father."|The Empire Strikes Back
"My precious."|The Lord of the Rings
"You shall not pass!"|The Lord of the Rings: The Fellowship of the Ring
"I'm walking here!"|Midnight Cowboy
"Go ahead, make my day."|Sudden Impact
"Keep your friends close, but your enemies closer."|The Godfather Part II
"Roads? Where we're going, we don't need roads."|Back to the Future
""", 2)

HAND = """
MOV|Awards|2|Which film won the first Academy Award for Best Picture, held in 1929?|Wings|Sunrise|The Jazz Singer|Metropolis
MOV|Awards|2|Which actor has won the most Academy Awards for acting, with four?|Katharine Hepburn|Meryl Streep|Jack Nicholson|Daniel Day-Lewis
MOV|Awards|3|Which movie won 11 Oscars, tying the record, including Best Picture in 1998 (March ceremony)?|Titanic|Ben-Hur|The Return of the King|Gone with the Wind
MOV|Awards|2|Which director has won the most Best Director Oscars, with four?|John Ford|Steven Spielberg|Martin Scorsese|Frank Capra
MOV|Awards|2|What is the golden statuette given at the Academy Awards nicknamed?|Oscar|Emmy|Tony|Grammy
MOV|Awards|2|Which actor won Best Actor for playing the Joker in 2019's Joker?|Joaquin Phoenix|Heath Ledger|Jared Leto|Jack Nicholson
MOV|Awards|2|Which actress won Best Actress for Silence of the Lambs?|Jodie Foster|Meryl Streep|Sigourney Weaver|Susan Sarandon
MOV|Awards|2|Which film won Best Picture and was nominated in all 6 major categories in 2017's 'moonlight' ceremony mix-up?|La La Land was announced in error, Moonlight won|Hidden Figures|Arrival|Manchester by the Sea
MOV|Awards|2|Which film was the first non-English-language film to win Best Picture?|Parasite|Roma|Life Is Beautiful|Crouching Tiger, Hidden Dragon
MOV|Franchises|1|In the Star Wars series, what is the name of Han Solo's ship?|Millennium Falcon|X-Wing|Death Star|Slave I
MOV|Franchises|1|In Star Wars, who is Luke Skywalker's father?|Darth Vader (Anakin Skywalker)|Obi-Wan Kenobi|Emperor Palpatine|Yoda
MOV|Franchises|2|What is the name of the wizarding school in Harry Potter?|Hogwarts|Beauxbatons|Durmstrang|Ilvermorny
MOV|Franchises|1|What is the name of Harry Potter's owl?|Hedwig|Errol|Pigwidgeon|Fawkes
MOV|Franchises|2|Which Harry Potter house does Harry belong to?|Gryffindor|Slytherin|Ravenclaw|Hufflepuff
MOV|Franchises|2|In Lord of the Rings, what is the name of Gandalf's horse?|Shadowfax|Bill|Brego|Asfaloth
MOV|Franchises|1|In Toy Story, what is the name of the boy who owns Woody?|Andy|Sid|Bonnie|Al
MOV|Franchises|2|Which actor played Jack Sparrow in Pirates of the Caribbean?|Johnny Depp|Orlando Bloom|Geoffrey Rush|Keira Knightley
MOV|Franchises|2|What is the name of the fictional African nation in Black Panther?|Wakanda|Zamunda|Genovia|Sokovia
MOV|Franchises|2|What metal is Captain America's shield made of?|Vibranium|Adamantium|Titanium|Uru
MOV|Franchises|2|Which Infinity Stone is housed in Vision's forehead?|Mind Stone|Time Stone|Soul Stone|Power Stone
MOV|Franchises|2|Who is the villain who collects the Infinity Stones in Avengers: Infinity War?|Thanos|Loki|Ultron|Red Skull
MOV|Franchises|2|Which fictional metal makes up Wolverine's claws?|Adamantium|Vibranium|Mithril|Titanium
MOV|Franchises|1|Which superhero is also known as Peter Parker?|Spider-Man|Batman|Superman|Daredevil
MOV|Franchises|1|What is Batman's real name?|Bruce Wayne|Clark Kent|Dick Grayson|Tony Stark
MOV|Franchises|2|What is the name of the city Batman protects?|Gotham City|Metropolis|Central City|Star City
MOV|Franchises|2|What is Superman's home planet?|Krypton|Mars|Rao|Daxam
MOV|Franchises|2|How many Infinity Stones are there in the Marvel Cinematic Universe?|6|5|7|9
MOV|Franchises|2|Which franchise features the Xenomorph?|Alien|Predator|Terminator|The Thing
MOV|Franchises|2|Which franchise features the line "I'll be back"?|Terminator|Rambo|Die Hard|Predator
MOV|Franchises|2|Which movie series follows a hobbit named Bilbo and an adventure with thirteen dwarves?|The Hobbit|Eragon|Narnia|The Golden Compass
MOV|Franchises|2|Which film franchise features the character Dominic Toretto?|Fast & Furious|Transporter|Need for Speed|Italian Job
MOV|Franchises|2|In Jurassic Park, what insect trapped in amber provided dinosaur DNA?|Mosquito|Fly|Ant|Beetle
MOV|Franchises|2|In The Matrix, which pill does Neo take to learn the truth?|Red pill|Blue pill|Green pill|White pill
MOV|Franchises|2|What is the name of the hotel in The Shining?|Overlook Hotel|Bates Motel|Hotel California|Grand Budapest
MOV|Franchises|2|Who directed the horror classic The Shining?|Stanley Kubrick|John Carpenter|Wes Craven|Alfred Hitchcock
MOV|Franchises|2|Who directed Halloween (1978)?|John Carpenter|Wes Craven|Tobe Hooper|Sean Cunningham
MOV|Franchises|2|Which horror villain wears a hockey mask?|Jason Voorhees|Michael Myers|Freddy Krueger|Ghostface
MOV|Franchises|2|Which horror villain has razor-blade fingers and appears in dreams?|Freddy Krueger|Jason Voorhees|Leatherface|Pinhead
MOV|Franchises|2|Which 1980 film features the line "All work and no play makes Jack a dull boy"?|The Shining|Misery|Psycho|Carrie
MOV|Genre|1|Which animated film features a lion cub named Simba?|The Lion King|Madagascar|Tarzan|Bambi
MOV|Genre|1|Which Disney movie features the song "Let It Go"?|Frozen|Tangled|Moana|Encanto
MOV|Genre|2|Which Disney movie features the song "Remember Me" and the Day of the Dead?|Coco|Encanto|Moana|Soul
MOV|Genre|2|Which Pixar film features a rat who wants to be a chef?|Ratatouille|Flushed Away|Cars|Brave
MOV|Genre|2|Which Pixar film follows a robot left to clean up Earth?|WALL-E|Big Hero 6|Robots|Iron Giant
MOV|Genre|2|Which animated film features a talking donkey voiced by Eddie Murphy?|Shrek|Madagascar|Ice Age|Sing
MOV|Genre|2|Which animated studio made Spirited Away?|Studio Ghibli|Pixar|DreamWorks|Illumination
MOV|Genre|2|Who directed Spirited Away?|Hayao Miyazaki|Makoto Shinkai|Satoshi Kon|Mamoru Hosoda
MOV|Genre|2|Which Disney film features a character named Mushu?|Mulan|Pocahontas|Hercules|Aladdin
MOV|Genre|2|Which Disney princess has a pet tiger named Rajah in her story?|Jasmine|Belle|Ariel|Tiana
MOV|Genre|2|What is the name of the clownfish's father in Finding Nemo?|Marlin|Gill|Bruce|Crush
MOV|Genre|2|What is the name of the ice-age sloth voiced by John Leguizamo?|Sid|Manny|Diego|Scrat
MOV|Genre|2|Which movie features the characters Woody, Buzz and Jessie?|Toy Story|Cars|A Bug's Life|Monsters, Inc.
MOV|Genre|2|Which 1993 Tim Burton-produced film features Jack Skellington?|The Nightmare Before Christmas|Corpse Bride|Coraline|Frankenweenie
MOV|Genre|1|Which movie features a young girl who is swept to Oz by a tornado?|The Wizard of Oz|Alice in Wonderland|Peter Pan|Matilda
MOV|Genre|2|Which actor plays Mr. Incredible's wife Elastigirl in The Incredibles?|Holly Hunter|Julia Roberts|Kristen Wiig|Meryl Streep
MOV|Genre|2|Which film is the highest grossing of all time, as of the mid-2020s?|Avatar|Avengers: Endgame|Titanic|Star Wars: The Force Awakens
MOV|Genre|2|Which actor has played James Bond the most times in the official Eon series?|Roger Moore|Sean Connery|Daniel Craig|Pierce Brosnan
MOV|Genre|2|Who was the first actor to play James Bond in film?|Sean Connery|Roger Moore|George Lazenby|Timothy Dalton
MOV|Genre|2|Which Bond actor starred in Casino Royale (2006)?|Daniel Craig|Pierce Brosnan|Timothy Dalton|Roger Moore
MOV|Genre|2|Which Bond film features the song 'Skyfall' sung by Adele?|Skyfall|Spectre|Quantum of Solace|Casino Royale
MOV|Genre|2|What is the name of James Bond's license number prefix?|007|008|001|700
MOV|Genre|2|Which famous composer wrote the scores for Star Wars, Jaws and E.T.?|John Williams|Hans Zimmer|Danny Elfman|Ennio Morricone
MOV|Genre|2|Which composer wrote the score for The Dark Knight and Inception?|Hans Zimmer|John Williams|Alan Silvestri|Howard Shore
MOV|Genre|2|Which composer wrote the music for The Good, the Bad and the Ugly?|Ennio Morricone|John Williams|Bernard Herrmann|Elmer Bernstein
MOV|Genre|2|Which composer wrote the shrieking violin score for Psycho?|Bernard Herrmann|Henry Mancini|Jerry Goldsmith|Max Steiner
MOV|Genre|2|Which actor is known for voicing Mufasa in the animated The Lion King?|James Earl Jones|Morgan Freeman|Denzel Washington|Samuel L. Jackson
MOV|Genre|2|Which actor is the voice of Darth Vader in the original Star Wars trilogy?|James Earl Jones|David Prowse|Morgan Freeman|Laurence Fishburne
MOV|Genre|2|Which actor played Gandalf in Lord of the Rings?|Ian McKellen|Patrick Stewart|Christopher Lee|Ian Holm
MOV|Genre|2|Which actor played Hannibal Lecter in The Silence of the Lambs?|Anthony Hopkins|Brian Cox|Mads Mikkelsen|Gary Oldman
MOV|Genre|2|Which actor played Forrest Gump's love interest Jenny?|Robin Wright|Sally Field|Julia Roberts|Meg Ryan
MOV|Genre|2|Which actor won an Oscar for playing Winston Churchill in Darkest Hour?|Gary Oldman|Brendan Gleeson|Albert Finney|John Lithgow
MOV|Genre|2|Which actor has played both Batman and Beetlejuice in Tim Burton films?|Michael Keaton|Val Kilmer|Christian Bale|George Clooney
MOV|Genre|2|Who played the Joker in Joker (2019) and won an Oscar for it?|Joaquin Phoenix|Joker Leto|Jack Nicholson|Cesar Romero
MOV|Genre|2|Which comedic duo starred in Wayne's World?|Mike Myers and Dana Carvey|Dan Aykroyd and John Belushi|Chris Farley and David Spade|Bill Murray and Harold Ramis
MOV|Genre|2|Which duo starred in The Blues Brothers?|Dan Aykroyd and John Belushi|Cheech and Chong|Abbott and Costello|Laurel and Hardy
MOV|Genre|2|Which actress plays the lead in Pretty Woman?|Julia Roberts|Meg Ryan|Sandra Bullock|Demi Moore
MOV|Genre|2|Which film features a DeLorean as a time machine?|Back to the Future|Time Bandits|Bill & Ted's Excellent Adventure|Terminator
MOV|Genre|2|What is the name of the shark in Jaws's town?|Amity Island|Martha's Vineyard|Cape Cod|Nantucket
MOV|Genre|2|What was the speed the DeLorean had to reach in Back to the Future?|88 miles per hour|55 miles per hour|100 miles per hour|120 miles per hour
MOV|Genre|2|How many Rocky films star Sylvester Stallone as Rocky Balboa in the original Rocky series (I-V and Balboa)?|6|5|7|4
MOV|Genre|3|What is the name of the fictional company in Alien that employs the Nostromo crew?|Weyland-Yutani|Cyberdyne|Tyrell|Umbrella
MOV|Genre|3|What is the name of the AI that becomes self-aware in the Terminator films?|Skynet|HAL 9000|The Machine|Mother
MOV|Genre|3|What is the name of the AI in 2001: A Space Odyssey?|HAL 9000|Skynet|GLaDOS|Mother
MOV|Genre|3|Who directed 2001: A Space Odyssey?|Stanley Kubrick|Ridley Scott|George Lucas|Steven Spielberg
MOV|Genre|2|Which 1999 film made "bullet time" famous?|The Matrix|Fight Club|Blade|Wanted
MOV|Genre|2|Which 2009 film made use of groundbreaking motion capture to create the Na'vi?|Avatar|District 9|Alice in Wonderland|Tron Legacy
MOV|Genre|2|Which movie features an AI girlfriend named Samantha, voiced by Scarlett Johansson?|Her|Ex Machina|Lucy|Black Widow
MOV|Genre|2|Which movie features the quote "My name is Maximus Decimus Meridius"?|Gladiator|Troy|300|Ben-Hur
MOV|Genre|2|Which 1994 film is based on a Stephen King novella set in a prison?|The Shawshank Redemption|The Green Mile|Misery|Stand by Me
MOV|Genre|2|Which Stephen King novel features a clown named Pennywise?|It|Carrie|Cujo|Misery
MOV|Genre|2|Which 2018 movie centers on a family that must stay silent to survive?|A Quiet Place|Bird Box|Hush|Smile
MOV|Genre|2|Which 1990 film features Kevin McCallister defending his home?|Home Alone|Problem Child|Dennis the Menace|Richie Rich
MOV|Genre|2|In Home Alone, which city is the McCallister family flying to for Christmas?|Paris|London|Rome|Madrid
MOV|Genre|2|In Elf, what does Buddy eat on his spaghetti?|Maple syrup|Candy|Chocolate sauce|Gravy
MOV|Genre|2|In Mean Girls, what day of the week do they wear pink?|Wednesdays|Fridays|Mondays|Thursdays
MOV|Genre|2|In The Wizard of Oz, what are the color of Dorothy's slippers in the film version?|Ruby red|Silver|Gold|Emerald green
MOV|Genre|2|Which film features Maverick and Goose as Navy pilots?|Top Gun|Iron Eagle|Stealth|Pearl Harbor
MOV|Genre|2|Which 1985 movie features a trio of kids searching for pirate treasure in Astoria, Oregon?|The Goonies|Stand by Me|The Sandlot|Explorers
MOV|Genre|2|Which 1980s movie centers on a gang of boys playing baseball and a dog called The Beast?|The Sandlot|Stand by Me|Little Giants|Rookie of the Year
"""

def build():
    directors = sorted({f[2] for f in FILMS}); actors = sorted({f[4] for f in FILMS})
    titles = [f[0] for f in FILMS]
    for t, y, d, role, a in FILMS:
        y = int(y)
        fam = y >= 2005 or t in ("Jaws", "Titanic", "Home Alone", "Toy Story", "The Matrix", "Back to the Future", "Forrest Gump", "The Lion King", "Frozen", "Shrek", "Top Gun", "Ghostbusters", "Rocky", "Grease", "The Wizard of Oz", "Jurassic Park", "Finding Nemo", "Mean Girls", "Elf")
        add("MOV", "Directors", 2 if fam else 3, f"Who directed the film {t}?", d, pick(directors, d, "d" + t))
        add("MOV", "Casting", 1 if fam else 2, f"Which actor played {role} in the film {t}?", a, pick_g(actors, a, "a" + t, avoid=[d]))
        add("MOV", "Movie Years", 3 if y < 1990 else 2, f"In what year was the film {t} released?", y, near_years(y, "y" + t, 4))
    wins = [b[1] for b in BEST_PICTURE]
    for y, f in BEST_PICTURE:
        add("MOV", "Awards", 3, f"Which film won Best Picture at the {y} Academy Awards ceremony?", f, pick(wins, f, "bp" + y))
    qs = [q[1] for q in QUOTES if not q[1].startswith("Sherlock")]
    for q, f in QUOTES:
        if f.startswith("Sherlock"): continue
        add("MOV", "Movie Quotes", 2, f"Which film features the line {q}?", f, pick(qs, f, "q" + f + q))
    parse_hand(HAND)
