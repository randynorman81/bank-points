from lib import *

# show|character|actor|network|setting ("-" if none)
ROLES = table("""
Friends|Ross Geller|David Schwimmer|NBC|New York City
Friends|Chandler Bing|Matthew Perry|NBC|New York City
Friends|Phoebe Buffay|Lisa Kudrow|NBC|New York City
Friends|Joey Tribbiani|Matt LeBlanc|NBC|New York City
Friends|Monica Geller|Courteney Cox|NBC|New York City
Seinfeld|Kramer|Michael Richards|NBC|New York City
Seinfeld|George Costanza|Jason Alexander|NBC|New York City
Seinfeld|Elaine Benes|Julia Louis-Dreyfus|NBC|New York City
The Office|Michael Scott|Steve Carell|NBC|Scranton, Pennsylvania
The Office|Dwight Schrute|Rainn Wilson|NBC|Scranton, Pennsylvania
The Office|Jim Halpert|John Krasinski|NBC|Scranton, Pennsylvania
The Office|Pam Beesly|Jenna Fischer|NBC|Scranton, Pennsylvania
Parks and Recreation|Leslie Knope|Amy Poehler|NBC|Pawnee, Indiana
Parks and Recreation|Ron Swanson|Nick Offerman|NBC|Pawnee, Indiana
Cheers|Sam Malone|Ted Danson|NBC|Boston
Frasier|Frasier Crane|Kelsey Grammer|NBC|Seattle
Happy Days|Fonzie|Henry Winkler|ABC|Milwaukee
The Golden Girls|Dorothy Zbornak|Bea Arthur|NBC|Miami
I Love Lucy|Lucy Ricardo|Lucille Ball|CBS|New York City
The Andy Griffith Show|Sheriff Andy Taylor|Andy Griffith|CBS|Mayberry, North Carolina
Gilligan's Island|Gilligan|Bob Denver|CBS|-
The Brady Bunch|Mike Brady|Robert Reed|ABC|-
M*A*S*H|Hawkeye Pierce|Alan Alda|CBS|Korea
Modern Family|Phil Dunphy|Ty Burrell|ABC|Los Angeles
Modern Family|Gloria Pritchett|Sofía Vergara|ABC|Los Angeles
The Big Bang Theory|Sheldon Cooper|Jim Parsons|CBS|Pasadena, California
The Big Bang Theory|Penny|Kaley Cuoco|CBS|Pasadena, California
How I Met Your Mother|Barney Stinson|Neil Patrick Harris|CBS|New York City
Brooklyn Nine-Nine|Jake Peralta|Andy Samberg|Fox|Brooklyn
New Girl|Jess Day|Zooey Deschanel|Fox|Los Angeles
Community|Jeff Winger|Joel McHale|NBC|-
Arrested Development|Michael Bluth|Jason Bateman|Fox|Newport Beach, California
30 Rock|Liz Lemon|Tina Fey|NBC|New York City
The Fresh Prince of Bel-Air|Will Smith|Will Smith|NBC|Bel-Air
Saved by the Bell|Zack Morris|Mark-Paul Gosselaar|NBC|-
Full House|Danny Tanner|Bob Saget|ABC|San Francisco
Family Matters|Steve Urkel|Jaleel White|ABC|Chicago
Boy Meets World|Cory Matthews|Ben Savage|ABC|-
That '70s Show|Eric Forman|Topher Grace|Fox|Point Place, Wisconsin
Malcolm in the Middle|Malcolm|Frankie Muniz|Fox|-
Everybody Loves Raymond|Ray Barone|Ray Romano|CBS|Long Island
The Simpsons|Homer Simpson|Dan Castellaneta|Fox|Springfield
The Simpsons|Marge Simpson|Julie Kavner|Fox|Springfield
Breaking Bad|Walter White|Bryan Cranston|AMC|Albuquerque, New Mexico
Breaking Bad|Jesse Pinkman|Aaron Paul|AMC|Albuquerque, New Mexico
Better Call Saul|Jimmy McGill|Bob Odenkirk|AMC|Albuquerque, New Mexico
The Sopranos|Tony Soprano|James Gandolfini|HBO|New Jersey
The Wire|Jimmy McNulty|Dominic West|HBO|Baltimore
Game of Thrones|Tyrion Lannister|Peter Dinklage|HBO|-
Game of Thrones|Daenerys Targaryen|Emilia Clarke|HBO|-
Game of Thrones|Jon Snow|Kit Harington|HBO|-
Stranger Things|Eleven|Millie Bobby Brown|Netflix|Hawkins, Indiana
Stranger Things|Jim Hopper|David Harbour|Netflix|Hawkins, Indiana
The Walking Dead|Rick Grimes|Andrew Lincoln|AMC|Georgia
House|Dr. Gregory House|Hugh Laurie|Fox|New Jersey
Grey's Anatomy|Meredith Grey|Ellen Pompeo|ABC|Seattle
ER|Dr. Doug Ross|George Clooney|NBC|Chicago
Lost|Jack Shephard|Matthew Fox|ABC|-
24|Jack Bauer|Kiefer Sutherland|Fox|-
The X-Files|Fox Mulder|David Duchovny|Fox|-
The X-Files|Dana Scully|Gillian Anderson|Fox|-
Buffy the Vampire Slayer|Buffy Summers|Sarah Michelle Gellar|The WB|Sunnydale, California
Dawson's Creek|Dawson Leery|James Van Der Beek|The WB|Capeside, Massachusetts
Gilmore Girls|Lorelai Gilmore|Lauren Graham|The WB|Stars Hollow, Connecticut
Friday Night Lights|Coach Eric Taylor|Kyle Chandler|NBC|Dillon, Texas
Mad Men|Don Draper|Jon Hamm|AMC|New York City
Succession|Logan Roy|Brian Cox|HBO|New York City
The Crown|Queen Elizabeth II (early seasons)|Claire Foy|Netflix|London
Ted Lasso|Ted Lasso|Jason Sudeikis|Apple TV+|London
The Mandalorian|Din Djarin|Pedro Pascal|Disney+|-
The Last of Us|Joel Miller|Pedro Pascal|HBO|-
Wednesday|Wednesday Addams|Jenna Ortega|Netflix|-
Squid Game|Seong Gi-hun|Lee Jung-jae|Netflix|South Korea
The Bear|Carmy Berzatto|Jeremy Allen White|FX|Chicago
Abbott Elementary|Janine Teagues|Quinta Brunson|ABC|Philadelphia
Star Trek|Captain James T. Kirk|William Shatner|NBC|-
Star Trek: The Next Generation|Captain Jean-Luc Picard|Patrick Stewart|Syndication|-
Home Improvement|Tim Taylor|Tim Allen|ABC|Detroit
Roseanne|Roseanne Conner|Roseanne Barr|ABC|Lanford, Illinois
The Sopranos|Dr. Jennifer Melfi|Lorraine Bracco|HBO|New Jersey
Mr. Robot|Elliot Alderson|Rami Malek|USA Network|New York City
Euphoria|Rue Bennett|Zendaya|HBO|-
The Good Place|Eleanor Shellstrop|Kristen Bell|NBC|-
Veep|Selina Meyer|Julia Louis-Dreyfus|HBO|Washington, D.C.
Curb Your Enthusiasm|Larry David|Larry David|HBO|Los Angeles
Scrubs|J.D.|Zach Braff|NBC|-
Two and a Half Men|Charlie Harper|Charlie Sheen|CBS|Malibu, California
Everybody Hates Chris|Chris Rock (narrator)|Chris Rock|UPN|Brooklyn
The Cosby Mysteries skip|x|x|x|-
""", 5)
ROLES = [r for r in ROLES if r[0] != "The Cosby Mysteries skip"]

HAND = """
TV|Game Shows|1|Who was the longtime host of Jeopardy! until 2020?|Alex Trebek|Pat Sajak|Bob Barker|Regis Philbin
TV|Game Shows|2|Who hosted Wheel of Fortune for 40 seasons?|Pat Sajak|Alex Trebek|Drew Carey|Steve Harvey
TV|Game Shows|2|Who was the longtime host of The Price Is Right before Drew Carey?|Bob Barker|Pat Sajak|Monty Hall|Richard Dawson
TV|Game Shows|2|On Jeopardy!, what is the final round called?|Final Jeopardy|Double Jeopardy|Daily Double|Triple Stumper
TV|Game Shows|2|Who hosted Who Wants to Be a Millionaire? in the U.S. from 1999 to 2002?|Regis Philbin|Meredith Vieira|Chris Harrison|Jeff Probst
TV|Game Shows|2|Which game show features a big wheel and a bonus round with "R S T L N E"?|Wheel of Fortune|Jeopardy!|The Price Is Right|Family Feud
TV|Game Shows|2|Who has hosted Family Feud since 2010?|Steve Harvey|Richard Dawson|Ray Combs|Louie Anderson
TV|Game Shows|2|What phrase do contestants say to lock in their answer on Who Wants to Be a Millionaire?|Final answer|Lock it in|That's my choice|I'm sure
TV|Game Shows|2|Which game show has contestants choose among cases containing cash amounts, hosted by Howie Mandel?|Deal or No Deal|Let's Make a Deal|Press Your Luck|Card Sharks
TV|Game Shows|2|On Family Feud, how many strikes do you get before the other team can steal?|3|2|4|5
TV|Reality|2|Which reality show features contestants stranded on an island voting each other out?|Survivor|Big Brother|The Amazing Race|Love Island
TV|Reality|2|Who has hosted Survivor since 2000?|Jeff Probst|Ryan Seacrest|Chris Harrison|Phil Keoghan
TV|Reality|2|Who hosts The Amazing Race?|Phil Keoghan|Jeff Probst|Ryan Seacrest|Tom Bergeron
TV|Reality|2|Which singing competition was originally judged by Simon Cowell, Paula Abdul and Randy Jackson?|American Idol|The Voice|X Factor|America's Got Talent
TV|Reality|2|Which cooking competition show is hosted by Gordon Ramsay with red and blue teams?|Hell's Kitchen|Top Chef|MasterChef|Chopped
TV|Reality|2|On Shark Tank, what are the investors called?|Sharks|Dragons|Angels|Lions
TV|Reality|2|Which dancing show features celebrities paired with professional dancers?|Dancing with the Stars|So You Think You Can Dance|World of Dance|The Masked Dancer
TV|Reality|2|Which reality show asks "Will you accept this rose?"|The Bachelor|Love Island|Survivor|Big Brother
TV|Reality|3|In The Great British Bake Off, what is the baking tent famous for?|A grand tent on the grounds of an English estate|A studio kitchen|A beach|A castle
TV|Late Night|2|Who hosted The Tonight Show from 1962 to 1992?|Johnny Carson|Jay Leno|David Letterman|Conan O'Brien
TV|Late Night|2|Who has hosted The Tonight Show since 2014?|Jimmy Fallon|Jay Leno|Seth Meyers|Conan O'Brien
TV|Late Night|2|Who hosted The Daily Show before Trevor Noah?|Jon Stewart|Stephen Colbert|John Oliver|Craig Kilborn
TV|Late Night|2|Which comedy sketch show has been on NBC since 1975?|Saturday Night Live|MADtv|In Living Color|Mad TV
TV|Late Night|2|Who has hosted The Late Show on CBS since 2015?|Stephen Colbert|David Letterman|James Corden|Craig Ferguson
TV|Late Night|2|Which longtime talk show host's show was called "Oprah"?|Oprah Winfrey|Ellen DeGeneres|Rosie O'Donnell|Tyra Banks
TV|Kids|1|What is the name of the sponge who lives in a pineapple under the sea?|SpongeBob SquarePants|Patrick Star|Squidward|Plankton
TV|Kids|1|Which Nickelodeon cartoon follows a boy named Aang?|Avatar: The Last Airbender|Legend of Korra|Danny Phantom|Rugrats
TV|Kids|2|What is the name of the preschool dog who is cartoon royalty on Disney Junior? (He has a red coat and solves problems with "Handy Dandy" tools.)|Bluey|Clifford|Blue|Paw Patrol's Chase
TV|Kids|2|Which educational PBS show features Big Bird and Elmo?|Sesame Street|Barney & Friends|Mister Rogers' Neighborhood|The Electric Company
TV|Kids|2|Which show is hosted by a man in a cardigan who changes his shoes at the start?|Mister Rogers' Neighborhood|Captain Kangaroo|Pee-wee's Playhouse|Bill Nye the Science Guy
TV|Kids|2|Which kids show features a purple dinosaur who loves to sing?|Barney & Friends|Dino Dan|Dinosaur Train|Land Before Time
TV|Kids|2|Which science show host was famous for saying "Science rules!"?|Bill Nye|Beakman|Mr. Wizard|Steve Irwin
TV|Kids|2|Which animated series features a family named the Belchers?|Bob's Burgers|The Simpsons|Family Guy|American Dad!
TV|Kids|2|Which animated series features a talking dog named Brian?|Family Guy|The Simpsons|American Dad!|Futurama
TV|Kids|2|What is the name of the teenage turtles' pizza-loving martial arts master?|Splinter|Shredder|Leonardo|April O'Neil
TV|Kids|2|Which animated series stars a group of friends solving mysteries in the Mystery Machine?|Scooby-Doo|Johnny Quest|Josie and the Pussycats|The Funky Phantom
TV|Kids|2|Which Disney Channel show starred Miley Cyrus as a pop star with a secret identity?|Hannah Montana|Lizzie McGuire|That's So Raven|Sonny with a Chance
TV|Kids|2|Which show features a mouse named Mickey and his clubhouse?|Mickey Mouse Clubhouse|Bluey|Doc McStuffins|Handy Manny
TV|Kids|2|Which Australian animated series follows a family of Blue Heeler dogs?|Bluey|Paw Patrol|Peppa Pig|Dora the Explorer
TV|Kids|2|Which animated series features Finn the Human and Jake the Dog?|Adventure Time|Steven Universe|Regular Show|Gravity Falls
TV|Kids|2|Which animated series is set in the town of Bikini Bottom?|SpongeBob SquarePants|Fairly OddParents|Rocko's Modern Life|Rugrats
TV|Sitcoms|2|What is the name of the coffee shop in Friends?|Central Perk|Cheers|The Peach Pit|Monk's Café
TV|Sitcoms|2|What is the name of the bar in Cheers where everybody knows your name?|Cheers|Moe's Tavern|MacLaren's|Paddy's Pub
TV|Sitcoms|2|What is the name of the bar in How I Met Your Mother?|MacLaren's Pub|Cheers|Paddy's Pub|The Drunken Clam
TV|Sitcoms|2|In The Office, what is the name of the paper company?|Dunder Mifflin|Vance Refrigeration|Sabre|Prestige Paper
TV|Sitcoms|2|What is the name of the fictional city in Parks and Recreation?|Pawnee|Eagleton|Springfield|Pine Bluff
TV|Sitcoms|2|Which sitcom stars four older women living in Miami?|The Golden Girls|Designing Women|Murphy Brown|Cybill
TV|Sitcoms|2|Which sitcom features a bartender named Sam Malone?|Cheers|Frasier|Taxi|Wings
TV|Sitcoms|2|Which sitcom features a family in the Philadelphia suburb of... no: which sitcom stars a famous chef in 'The Bear'?|The Bear|Kitchen Nightmares|Top Chef|Chef's Table
TV|Sitcoms|2|Which sitcom follows the Bluth family?|Arrested Development|Modern Family|Schitt's Creek|The Middle
TV|Sitcoms|2|Which sitcom follows the Rose family who lose their fortune and move to a small town?|Schitt's Creek|Arrested Development|The Goldbergs|Black-ish
TV|Sitcoms|2|Which sitcom follows the Dunphy, Pritchett and Tucker families?|Modern Family|The Middle|Black-ish|Fresh Off the Boat
TV|Sitcoms|2|In The Big Bang Theory, which character says "Bazinga!"?|Sheldon|Leonard|Howard|Raj
TV|Sitcoms|2|In Friends, what is the name of Ross's pet monkey?|Marcel|Gunther|Emily|Ben
TV|Sitcoms|2|Which Friends character is a chef?|Monica|Rachel|Phoebe|Joey
TV|Sitcoms|2|In Seinfeld, which neighbor frequently bursts into Jerry's apartment?|Kramer|Newman|George|Puddy
TV|Sitcoms|2|In The Fresh Prince of Bel-Air, what is the name of the butler?|Geoffrey|Carlton|Alfred|Jeeves
TV|Sitcoms|2|In Full House, what's the name of the uncle who is a rock musician?|Jesse|Joey|Danny|Rick
TV|Sitcoms|2|Which sitcom features a gang who run a bar called Paddy's Pub?|It's Always Sunny in Philadelphia|Rules of Engagement|Barry|Archer
TV|Sitcoms|2|In Parks and Recreation, what is Ron Swanson's favorite breakfast?|Bacon and eggs|Pancakes|Waffles|Oatmeal
TV|Sitcoms|2|In The Office, what is the name of the regional manager's paper company branch?|Scranton|Stamford|Albany|Utica
TV|Drama|2|Which HBO series is based on George R.R. Martin's A Song of Ice and Fire?|Game of Thrones|The Witcher|Westworld|His Dark Materials
TV|Drama|2|In Breaking Bad, what is Walter White's occupation before he starts cooking meth?|High school chemistry teacher|Pharmacist|Lawyer|Professor of physics
TV|Drama|2|What is Walter White's alias in Breaking Bad?|Heisenberg|Moriarty|Gustavo|Dr. Jekyll
TV|Drama|2|In Stranger Things, what is the upside-down?|A dark parallel dimension|A video game|A lab|A town
TV|Drama|3|In which fictional town is Stranger Things set?|Hawkins|Haddonfield|Sunnydale|Riverdale
TV|Drama|2|In The Walking Dead, in which Georgia city does the story begin?|Atlanta region|Savannah|Macon|Athens
TV|Drama|2|Which series features Tony Soprano as a mob boss in therapy?|The Sopranos|The Wire|Goodfellas|Boardwalk Empire
TV|Drama|2|Which crime drama series is set in Baltimore and tracks drug dealing and the police?|The Wire|Homicide|Oz|The Shield
TV|Drama|2|Which medical drama features Dr. Meredith Grey?|Grey's Anatomy|ER|House|Chicago Med
TV|Drama|2|Which series features the Dallas Cowboys... no: which high school football series is set in Dillon, Texas?|Friday Night Lights|Varsity Blues|One Tree Hill|Hart of Dixie
TV|Drama|2|Which series follows Jack Shephard and survivors of a plane crash on an island?|Lost|Gilligan's Island|The Island|Survivor
TV|Drama|2|Which 2019 HBO miniseries dramatized a nuclear disaster in Ukraine?|Chernobyl|The Pacific|Band of Brothers|Generation Kill
TV|Drama|2|Which Netflix series follows the British royal family?|The Crown|Bridgerton|Downton Abbey|Victoria
TV|Drama|2|Which ITV series follows the Crawley family and their servants?|Downton Abbey|Upstairs Downstairs|Bridgerton|Victoria
TV|Drama|2|Which series follows an advertising agency in the 1960s?|Mad Men|Peaky Blinders|Boardwalk Empire|The Marvelous Mrs. Maisel
TV|Drama|2|In The Queen's Gambit, what game does Beth Harmon master?|Chess|Poker|Checkers|Go
TV|Drama|2|Which Korean survival drama has contestants in green tracksuits playing deadly childhood games?|Squid Game|All of Us Are Dead|Alice in Borderland|Kingdom
TV|Drama|2|Which series follows the Shelby family in post-WWI Birmingham?|Peaky Blinders|Downton Abbey|Vikings|Line of Duty
TV|Drama|2|Which cartoonish series is set in the Hellmouth town of Sunnydale?|Buffy the Vampire Slayer|Charmed|Angel|Supernatural
TV|Drama|2|Which show features brothers Sam and Dean Winchester hunting monsters?|Supernatural|Charmed|Teen Wolf|The Vampire Diaries
TV|Drama|2|Which show is set in the fictional Dutton Ranch in Montana?|Yellowstone|Longmire|Justified|Hell on Wheels
TV|Drama|2|Which series features Detective Olivia Benson?|Law & Order: SVU|NCIS|CSI|Criminal Minds
TV|Drama|2|In which TV franchise do agents work in a Navy-focused criminal investigative service?|NCIS|CSI|Bones|Criminal Minds
TV|Drama|2|Which crime drama franchise started in Las Vegas with forensic investigators?|CSI|NCIS|Bones|Castle
TV|Drama|3|Which long-running drama is the longest-running primetime scripted U.S. series (over 30 seasons)?|The Simpsons|Law & Order: SVU|Gunsmoke|Grey's Anatomy
TV|Sci-Fi|2|What is the name of the starship in the original Star Trek?|USS Enterprise|USS Voyager|Millennium Falcon|Nostromo
TV|Sci-Fi|2|Which sci-fi series features the Doctor traveling in a TARDIS?|Doctor Who|Star Trek|Red Dwarf|Blake's 7
TV|Sci-Fi|2|Which Star Trek character is known for pointed ears and logic?|Spock|Data|Worf|Kirk
TV|Sci-Fi|2|Which streaming series is set in the Star Wars universe and features a bounty hunter and "Baby Yoda"?|The Mandalorian|The Book of Boba Fett|Andor|Ahsoka
TV|Sci-Fi|2|Which Netflix series is based on a series of games and starring Henry Cavill as Geralt of Rivia?|The Witcher|Arcane|Castlevania|Cyberpunk
TV|Sci-Fi|2|Which Netflix animated series is set in Piltover and Zaun, based on League of Legends?|Arcane|Castlevania|Cyberpunk: Edgerunners|Blood of Zeus
TV|Sci-Fi|2|Which series is based on a post-apocalyptic game and stars Pedro Pascal and Bella Ramsey?|The Last of Us|Fallout|The Walking Dead|Silo
TV|Sci-Fi|2|Which series is set in a vault-dwelling postapocalyptic world and based on a video game franchise, released in 2024?|Fallout|Silo|Severance|Foundation
TV|Sci-Fi|2|Which Apple TV+ series follows employees whose work and personal memories are separated?|Severance|Black Mirror|Foundation|Dark Matter
TV|Sci-Fi|2|Which anthology series explores the dark side of technology?|Black Mirror|Love, Death & Robots|The Twilight Zone|Electric Dreams
TV|Sci-Fi|2|Which classic anthology series was hosted by Rod Serling?|The Twilight Zone|The Outer Limits|Night Gallery|Tales from the Crypt
TV|Sci-Fi|2|Who played Captain Kirk in the original Star Trek?|William Shatner|Chris Pine|Patrick Stewart|Leonard Nimoy
TV|Sci-Fi|2|Which series follows teenager Sabrina Spellman?|Sabrina the Teenage Witch|Charmed|Buffy|Wizards of Waverly Place
TV|Sports TV|2|Which network is the home of the Masters golf tournament coverage in the U.S.?|CBS|NBC|ESPN|Fox
TV|Sports TV|2|Which network is nicknamed "The Worldwide Leader in Sports"?|ESPN|Fox Sports|NBC Sports|CBS Sports
TV|Sports TV|2|Which show features Charles Barkley, Shaq and Ernie Johnson on a set?|Inside the NBA|Pardon the Interruption|College GameDay|First Take
TV|Sports TV|2|Which show travels to a different college campus each Saturday during football season?|College GameDay|Sunday NFL Countdown|Monday Night Football|SportsCenter
TV|TV Facts|2|What does HBO stand for?|Home Box Office|Hollywood Broadcasting Organization|Home Broadcast Operations|Hit Box Original
TV|TV Facts|2|What does PBS stand for?|Public Broadcasting Service|Public Business Station|Popular Broadcast Service|Primary Broadcast Station
TV|TV Facts|2|What does CNN stand for?|Cable News Network|Central News Network|Continental News Network|Capital National News
TV|TV Facts|3|Which Atlanta-based media mogul founded CNN in 1980?|Ted Turner|Rupert Murdoch|Oprah Winfrey|Michael Bloomberg
TV|TV Facts|2|In what city is CNN's headquarters located?|Atlanta|Washington, D.C.|New York City|Los Angeles
TV|TV Facts|2|What streaming service was launched by Disney in 2019?|Disney+|Hulu|Peacock|Paramount+
TV|TV Facts|2|Which streaming service originally mailed DVDs to customers?|Netflix|Hulu|Amazon Prime|Disney+
TV|TV Facts|2|What is the name of the TV award for excellence in television?|Emmy|Oscar|Tony|Grammy
TV|TV Facts|2|What is the name of the award for excellence in music?|Grammy|Emmy|Tony|Peabody
TV|TV Facts|2|What is the name of the award for excellence in theater?|Tony|Emmy|Obie|Pulitzer
TV|TV Facts|2|Which sitcom holds the record for the most Emmy wins for a comedy series?|Frasier|Cheers|Seinfeld|Modern Family
TV|TV Facts|3|Which TV series finale in 1983 was watched by more than 100 million Americans?|M*A*S*H|Cheers|Seinfeld|Friends
TV|TV Facts|2|Which long-running Sunday-night news program features a ticking stopwatch?|60 Minutes|Dateline|20/20|Nightline
TV|TV Facts|2|Which famous TV chef is known for catchphrases such as "BAM!"?|Emeril Lagasse|Rachael Ray|Bobby Flay|Guy Fieri
TV|TV Facts|2|Which Food Network host is known for his spiky blond hair and visiting diners?|Guy Fieri|Bobby Flay|Alton Brown|Anthony Bourdain
TV|TV Facts|2|Which TV chef hosted Kitchen Confidential's inspiration and travel show Parts Unknown?|Anthony Bourdain|Gordon Ramsay|Jamie Oliver|Wolfgang Puck
"""

def build():
    shows = sorted({r[0] for r in ROLES}); nets = sorted({r[3] for r in ROLES}); actors = sorted({r[2] for r in ROLES})
    sets = sorted({r[4] for r in ROLES if r[4] != "-"})
    for s, c, a, n, loc in ROLES:
        easy = s in ("Friends", "The Office", "Seinfeld", "The Simpsons", "Breaking Bad", "Stranger Things", "Game of Thrones", "The Big Bang Theory", "Modern Family", "Cheers", "Full House", "The Fresh Prince of Bel-Air", "I Love Lucy", "Gilligan's Island", "The Brady Bunch")
        add("TV", "TV Characters", 1 if easy else 2, f"Which actor played {c} on {s}?" if c != a else f"Who starred in the TV series {s}?", a, pick_g(actors, a, "tva" + s + c))
        add("TV", "TV Characters", 2 if easy else 3, f"Which TV show featured the character {c}?" if c != a else f"{a} starred in which TV series?", s, pick(shows, s, "tvs" + s + c))
        add("TV", "TV Networks", 2 if easy else 3, f"On which network did {s} originally air?", n, pick(nets, n, "tvn" + s))
        if loc != "-":
            add("TV", "TV Settings", 2 if easy else 3, f"In which location is the TV series {s} set?", loc, pick(sets, loc, "tvl" + s))
    parse_hand(HAND)
