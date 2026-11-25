from lib import *
import lib

# song|artist|year
SONGS = table("""
Hound Dog|Elvis Presley|1956
Jailhouse Rock|Elvis Presley|1957
Johnny B. Goode|Chuck Berry|1958
Great Balls of Fire|Jerry Lee Lewis|1957
Peggy Sue|Buddy Holly|1957
Respect|Aretha Franklin|1967
My Girl|The Temptations|1964
I Heard It Through the Grapevine|Marvin Gaye|1968
Stand by Me|Ben E. King|1961
Be My Baby|The Ronettes|1963
Good Vibrations|The Beach Boys|1966
Surfin' U.S.A.|The Beach Boys|1963
Hey Jude|The Beatles|1968
Let It Be|The Beatles|1970
Yesterday|The Beatles|1965
Come Together|The Beatles|1969
(I Can't Get No) Satisfaction|The Rolling Stones|1965
Paint It Black|The Rolling Stones|1966
Like a Rolling Stone|Bob Dylan|1965
Light My Fire|The Doors|1967
Purple Haze|Jimi Hendrix|1967
Born to Be Wild|Steppenwolf|1968
Bridge over Troubled Water|Simon & Garfunkel|1970
Imagine|John Lennon|1971
Stairway to Heaven|Led Zeppelin|1971
Smoke on the Water|Deep Purple|1972
Bohemian Rhapsody|Queen|1975
Hotel California|Eagles|1976
Dancing Queen|ABBA|1976
Stayin' Alive|Bee Gees|1977
I Will Survive|Gloria Gaynor|1978
Le Freak|Chic|1978
Rocket Man|Elton John|1972
Superstition|Stevie Wonder|1972
Go Your Own Way|Fleetwood Mac|1977
Sweet Home Alabama|Lynyrd Skynyrd|1974
Free Bird|Lynyrd Skynyrd|1973
Take Me Home, Country Roads|John Denver|1971
American Pie|Don McLean|1971
Brown Eyed Girl|Van Morrison|1967
Jolene|Dolly Parton|1973
Ring of Fire|Johnny Cash|1963
Crazy|Patsy Cline|1961
Oh, Pretty Woman|Roy Orbison|1964
Georgia on My Mind|Ray Charles|1960
Hit the Road Jack|Ray Charles|1961
The Twist|Chubby Checker|1960
My Way|Frank Sinatra|1969
Thriller|Michael Jackson|1982
Billie Jean|Michael Jackson|1983
Beat It|Michael Jackson|1983
Like a Virgin|Madonna|1984
Material Girl|Madonna|1985
Purple Rain|Prince|1984
When Doves Cry|Prince|1984
Girls Just Want to Have Fun|Cyndi Lauper|1983
Time After Time|Cyndi Lauper|1984
Every Breath You Take|The Police|1983
Sweet Child o' Mine|Guns N' Roses|1987
Livin' on a Prayer|Bon Jovi|1986
Jump|Van Halen|1984
Eye of the Tiger|Survivor|1982
Africa|Toto|1982
Take On Me|a-ha|1985
Never Gonna Give You Up|Rick Astley|1987
Wake Me Up Before You Go-Go|Wham!|1984
Karma Chameleon|Culture Club|1983
Footloose|Kenny Loggins|1984
Danger Zone|Kenny Loggins|1986
Another One Bites the Dust|Queen|1980
Sweet Dreams (Are Made of This)|Eurythmics|1983
Walk Like an Egyptian|The Bangles|1986
Pour Some Sugar on Me|Def Leppard|1987
Money for Nothing|Dire Straits|1985
I Wanna Dance with Somebody|Whitney Houston|1987
Rock the Casbah|The Clash|1982
Rapper's Delight|The Sugarhill Gang|1979
Walk This Way|Run-DMC|1986
Born in the U.S.A.|Bruce Springsteen|1984
With or Without You|U2|1987
Faith|George Michael|1987
Hungry Like the Wolf|Duran Duran|1982
Total Eclipse of the Heart|Bonnie Tyler|1983
Come On Eileen|Dexys Midnight Runners|1982
Don't Stop Believin'|Journey|1981
Smells Like Teen Spirit|Nirvana|1991
Wonderwall|Oasis|1995
Losing My Religion|R.E.M.|1991
...Baby One More Time|Britney Spears|1998
Wannabe|Spice Girls|1996
I Want It That Way|Backstreet Boys|1999
Bye Bye Bye|*NSYNC|2000
Waterfalls|TLC|1994
No Scrubs|TLC|1999
I Will Always Love You|Whitney Houston|1992
My Heart Will Go On|Celine Dion|1997
Tubthumping|Chumbawamba|1997
Mambo No. 5|Lou Bega|1999
Macarena|Los del Río|1995
Gangsta's Paradise|Coolio|1995
Ice Ice Baby|Vanilla Ice|1990
U Can't Touch This|MC Hammer|1990
Creep|Radiohead|1992
Black Hole Sun|Soundgarden|1994
Enter Sandman|Metallica|1991
Under the Bridge|Red Hot Chili Peppers|1991
Jeremy|Pearl Jam|1991
Zombie|The Cranberries|1994
You Oughta Know|Alanis Morissette|1995
Ironic|Alanis Morissette|1996
Truly Madly Deeply|Savage Garden|1997
Semi-Charmed Life|Third Eye Blind|1997
Say My Name|Destiny's Child|1999
Genie in a Bottle|Christina Aguilera|1999
Believe|Cher|1998
Livin' la Vida Loca|Ricky Martin|1999
Smooth|Santana|1999
All Star|Smash Mouth|1999
Friends in Low Places|Garth Brooks|1990
Killing Me Softly|Fugees|1996
Juicy|The Notorious B.I.G.|1994
California Love|2Pac|1995
Crazy in Love|Beyoncé|2003
Single Ladies (Put a Ring on It)|Beyoncé|2008
Hey Ya!|Outkast|2003
Hips Don't Lie|Shakira|2006
Umbrella|Rihanna|2007
Mr. Brightside|The Killers|2003
Seven Nation Army|The White Stripes|2003
Yellow|Coldplay|2000
Clocks|Coldplay|2002
Lose Yourself|Eminem|2002
In da Club|50 Cent|2003
Toxic|Britney Spears|2003
Since U Been Gone|Kelly Clarkson|2004
Hollaback Girl|Gwen Stefani|2004
Boulevard of Broken Dreams|Green Day|2004
American Idiot|Green Day|2004
Viva la Vida|Coldplay|2008
Rehab|Amy Winehouse|2006
Poker Face|Lady Gaga|2008
Bad Romance|Lady Gaga|2009
I Gotta Feeling|The Black Eyed Peas|2009
Party in the U.S.A.|Miley Cyrus|2009
Halo|Beyoncé|2008
Chasing Cars|Snow Patrol|2006
Fireflies|Owl City|2009
Hey There Delilah|Plain White T's|2006
Dani California|Red Hot Chili Peppers|2006
Complicated|Avril Lavigne|2002
Love Story|Taylor Swift|2008
Rolling in the Deep|Adele|2010
Someone Like You|Adele|2011
Hello|Adele|2015
Firework|Katy Perry|2010
Roar|Katy Perry|2013
Shake It Off|Taylor Swift|2014
Blank Space|Taylor Swift|2014
Anti-Hero|Taylor Swift|2022
Uptown Funk|Mark Ronson|2014
Happy|Pharrell Williams|2013
Get Lucky|Daft Punk|2013
Royals|Lorde|2013
Thinking Out Loud|Ed Sheeran|2014
Shape of You|Ed Sheeran|2017
Despacito|Luis Fonsi|2017
Old Town Road|Lil Nas X|2019
Bad Guy|Billie Eilish|2019
Blinding Lights|The Weeknd|2019
Levitating|Dua Lipa|2020
Dynamite|BTS|2020
Drivers License|Olivia Rodrigo|2021
Good 4 U|Olivia Rodrigo|2021
As It Was|Harry Styles|2022
Flowers|Miley Cyrus|2023
Watermelon Sugar|Harry Styles|2019
Sunflower|Post Malone|2018
This Is America|Childish Gambino|2018
God's Plan|Drake|2018
Hotline Bling|Drake|2015
Can't Stop the Feeling!|Justin Timberlake|2016
Sorry|Justin Bieber|2015
Espresso|Sabrina Carpenter|2024
Not Like Us|Kendrick Lamar|2024
Thrift Shop|Macklemore & Ryan Lewis|2012
Gangnam Style|PSY|2012
Somebody That I Used to Know|Gotye|2011
Pumped Up Kicks|Foster the People|2010
Radioactive|Imagine Dragons|2012
Counting Stars|OneRepublic|2013
Chandelier|Sia|2014
Lose Control|Teddy Swims|2023
Last Christmas|Wham!|1984
All I Want for Christmas Is You|Mariah Carey|1994
Rockin' Around the Christmas Tree|Brenda Lee|1958
Jingle Bell Rock|Bobby Helms|1957
""", 3)

def decade(y):
    return "Oldies" if y < 1980 else ("1980s" if y < 1990 else ("1990s" if y < 2000 else ("2000s" if y < 2010 else "2010s+")))

ALBUMS = table("""
Thriller|Michael Jackson|1982
Rumours|Fleetwood Mac|1977
The Dark Side of the Moon|Pink Floyd|1973
Abbey Road|The Beatles|1969
Back in Black|AC/DC|1980
Nevermind|Nirvana|1991
Purple Rain|Prince|1984
Born to Run|Bruce Springsteen|1975
Songs in the Key of Life|Stevie Wonder|1976
Led Zeppelin IV|Led Zeppelin|1971
Appetite for Destruction|Guns N' Roses|1987
The Joshua Tree|U2|1987
OK Computer|Radiohead|1997
The Miseducation of Lauryn Hill|Lauryn Hill|1998
Illmatic|Nas|1994
The Chronic|Dr. Dre|1992
Blue|Joni Mitchell|1971
Tapestry|Carole King|1971
Hotel California|Eagles|1976
1989|Taylor Swift|2014
21|Adele|2011
Lemonade|Beyoncé|2016
Random Access Memories|Daft Punk|2013
Folklore|Taylor Swift|2020
Midnights|Taylor Swift|2022
Sour|Olivia Rodrigo|2021
Future Nostalgia|Dua Lipa|2020
After Hours|The Weeknd|2020
Graceland|Paul Simon|1986
Sgt. Pepper's Lonely Hearts Club Band|The Beatles|1967
Pet Sounds|The Beach Boys|1966
Exile on Main St.|The Rolling Stones|1972
Bad|Michael Jackson|1987
Like a Prayer|Madonna|1989
The Marshall Mathers LP|Eminem|2000
Blonde|Frank Ocean|2016
Hybrid Theory|Linkin Park|2000
Jagged Little Pill|Alanis Morissette|1995
Come Away with Me|Norah Jones|2002
Teenage Dream|Katy Perry|2010
Fearless|Taylor Swift|2008
Harry's House|Harry Styles|2022
Brat|Charli XCX|2024
Short n' Sweet|Sabrina Carpenter|2024
To Pimp a Butterfly|Kendrick Lamar|2015
Good Kid, M.A.A.D City|Kendrick Lamar|2012
Born This Way|Lady Gaga|2011
The Fame|Lady Gaga|2008
Dangerous Woman|Ariana Grande|2016
Positions|Ariana Grande|2020
Divide|Ed Sheeran|2017
The Slim Shady LP|Eminem|1999
Ready to Die|The Notorious B.I.G.|1994
""", 3)

SINGERS = table("""
Freddie Mercury|Queen
Mick Jagger|The Rolling Stones
Robert Plant|Led Zeppelin
Bono|U2
Steven Tyler|Aerosmith
Axl Rose|Guns N' Roses
Kurt Cobain|Nirvana
Eddie Vedder|Pearl Jam
Chris Martin|Coldplay
Brandon Flowers|The Killers
Debbie Harry|Blondie
Gwen Stefani|No Doubt
Sting|The Police
Jon Bon Jovi|Bon Jovi
Adam Levine|Maroon 5
Brian Johnson|AC/DC
Ozzy Osbourne|Black Sabbath
Roger Daltrey|The Who
Jim Morrison|The Doors
Michael Stipe|R.E.M.
Billie Joe Armstrong|Green Day
Anthony Kiedis|Red Hot Chili Peppers
Thom Yorke|Radiohead
Liam Gallagher|Oasis
Harry Styles|One Direction
Justin Timberlake|*NSYNC
Brian Wilson|The Beach Boys
Karen Carpenter|The Carpenters
Stevie Nicks|Fleetwood Mac
Dave Grohl|Foo Fighters
Chester Bennington|Linkin Park
Dan Reynolds|Imagine Dragons
Hayley Williams|Paramore
Lars Ulrich|Metallica
Ringo Starr|The Beatles
Mark Knopfler|Dire Straits
Neil Peart|Rush
Phil Collins|Genesis
Ronnie Van Zant|Lynyrd Skynyrd
Joe Elliott|Def Leppard
Gavin Rossdale|Bush
Scott Weiland|Stone Temple Pilots
Cherry? skip|x
""", 2)
SINGERS = [s for s in SINGERS if s[0] != "Cherry? skip"]

HAND = """
MUS|Instruments|1|How many strings does a standard guitar have?|6|4|5|7
MUS|Instruments|1|How many keys are on a standard piano?|88|76|66|100
MUS|Instruments|2|Which instrument has pedals, keys and pipes and is often found in churches?|Organ|Harpsichord|Accordion|Celesta
MUS|Instruments|2|Which woodwind instrument is the highest-pitched in the standard orchestra?|Piccolo|Flute|Oboe|Clarinet
MUS|Instruments|2|Which brass instrument has a slide?|Trombone|Trumpet|Tuba|French horn
MUS|Instruments|2|Which stringed instrument is the largest of the orchestral violin family?|Double bass|Cello|Viola|Harp
MUS|Instruments|2|Which instrument is Yo-Yo Ma famous for playing?|Cello|Violin|Piano|Viola
MUS|Instruments|2|Which instrument is Itzhak Perlman famous for playing?|Violin|Cello|Piano|Flute
MUS|Instruments|2|How many strings does a standard violin have?|4|5|6|3
MUS|Instruments|2|Which instrument family does the saxophone belong to?|Woodwind|Brass|Percussion|String
MUS|Instruments|3|Which instrument did Louis Armstrong famously play?|Trumpet|Saxophone|Trombone|Clarinet
MUS|Instruments|3|Which instrument did Miles Davis play?|Trumpet|Saxophone|Piano|Clarinet
MUS|Instruments|3|Which instrument did John Coltrane play?|Saxophone|Trumpet|Piano|Bass
MUS|Instruments|2|What does a metronome do?|Keeps steady tempo|Tunes an instrument|Amplifies sound|Records music
MUS|Instruments|2|What are the black and white bars on a piano called collectively?|Keys|Hammers|Strings|Pedals
MUS|Instruments|2|Which instrument is a ukulele most similar to?|Small guitar|Violin|Banjo|Mandolin
MUS|Instruments|2|Which Scottish instrument has bag and drones?|Bagpipes|Accordion|Fiddle|Harp
MUS|Instruments|2|Which instrument is the national instrument of Ireland, appearing on its coins?|Harp|Fiddle|Tin whistle|Bodhrán
MUS|Instruments|2|Which percussion instrument is struck with mallets and has metal bars arranged like a keyboard?|Xylophone|Snare drum|Timpani|Tambourine
MUS|Instruments|2|What is the term for the speed of a piece of music?|Tempo|Pitch|Timbre|Rhythm
MUS|Instruments|2|What is the term for how loud or soft music is played?|Dynamics|Tempo|Harmony|Timbre
MUS|Instruments|2|Which musical term means "gradually getting louder"?|Crescendo|Diminuendo|Staccato|Legato
MUS|Instruments|2|How many lines are in a musical staff?|5|4|6|3
MUS|Instruments|2|How many notes are in an octave scale (counting the repeat)?|8|7|12|10
MUS|Instruments|3|What are the seven natural notes in Western music?|A B C D E F G|C D E F G A B C|Do Re Mi Fa Sol La Ti Do|1 2 3 4 5 6 7 8
MUS|Instruments|3|What does the clef at the start of most piano right-hand music look like?|Treble clef|Bass clef|Alto clef|Tenor clef
MUS|History|1|Which band was known as the "Fab Four"?|The Beatles|The Rolling Stones|The Beach Boys|The Who
MUS|History|1|Who is known as the "King of Rock and Roll"?|Elvis Presley|Chuck Berry|Little Richard|Jerry Lee Lewis
MUS|History|1|Who is known as the "King of Pop"?|Michael Jackson|Prince|Elvis Presley|Justin Timberlake
MUS|History|2|Who is known as the "Queen of Soul"?|Aretha Franklin|Diana Ross|Tina Turner|Whitney Houston
MUS|History|2|Who is known as the "Godfather of Soul"?|James Brown|Ray Charles|Otis Redding|Sam Cooke
MUS|History|2|Who is known as the "Boss"?|Bruce Springsteen|Billy Joel|Bob Seger|Tom Petty
MUS|History|2|Who is known as the "Queen of Pop"?|Madonna|Beyoncé|Britney Spears|Cher
MUS|History|2|Who is known as the "Piano Man"?|Billy Joel|Elton John|Ben Folds|Bruce Hornsby
MUS|History|2|Who is known as "Slowhand"?|Eric Clapton|Jeff Beck|Jimmy Page|Mark Knopfler
MUS|History|2|Which band's members included John Lennon, Paul McCartney, George Harrison and Ringo Starr?|The Beatles|The Kinks|Herman's Hermits|The Monkees
MUS|History|2|Which city is known as the birthplace of Motown Records?|Detroit|Chicago|Memphis|Nashville
MUS|History|2|Which city is known as the home of the Grand Ole Opry?|Nashville|Memphis|Austin|Dallas
MUS|History|2|Which city is known as the birthplace of jazz?|New Orleans|Chicago|New York City|Kansas City
MUS|History|2|Which city is known as the home of the blues' "Beale Street"?|Memphis|New Orleans|St. Louis|Chicago
MUS|History|2|Which Georgia city is known for being the home of R.E.M. and the B-52s?|Athens|Macon|Savannah|Atlanta
MUS|History|2|Which Georgia city is where Otis Redding, Little Richard and the Allman Brothers launched their careers?|Macon|Valdosta|Rome|Albany
MUS|History|2|Which famous music festival took place in upstate New York in 1969?|Woodstock|Altamont|Monterey Pop|Isle of Wight
MUS|History|2|Which California music festival began in 1999 in Indio?|Coachella|Lollapalooza|Bonnaroo|Burning Man
MUS|History|2|Which annual festival is held in Manchester, Tennessee?|Bonnaroo|Coachella|Lollapalooza|Austin City Limits
MUS|History|2|Which Chicago festival has been held in Grant Park each August since 2005?|Lollapalooza|Pitchfork|Riot Fest|Chicago Blues Fest
MUS|History|2|Which music television channel launched on August 1, 1981?|MTV|VH1|CMT|BET
MUS|History|2|What was the first music video played on MTV?|Video Killed the Radio Star|Thriller|Take On Me|Girls on Film
MUS|History|2|Which duo were known as the "Everly Brothers" famous for harmonies?|Don and Phil Everly|Sam and Dave|Simon and Garfunkel|Hall and Oates
MUS|History|2|Which duo are known for "Rich Girl" and "Maneater"?|Hall & Oates|Simon & Garfunkel|Wham!|Sam & Dave
MUS|History|2|Which duo is Art Garfunkel part of?|Simon & Garfunkel|Hall & Oates|Sam & Dave|The Everly Brothers
MUS|History|2|Which band's members are Larry Mullen Jr., Adam Clayton, The Edge and Bono?|U2|The Police|R.E.M.|INXS
MUS|History|2|Which band's members were Freddie Mercury, Brian May, Roger Taylor and John Deacon?|Queen|Genesis|Led Zeppelin|The Who
MUS|History|2|Which band's members include Dave Grohl after Nirvana?|Foo Fighters|Pearl Jam|Soundgarden|Alice in Chains
MUS|History|2|Which British band includes Chris Martin?|Coldplay|Muse|Keane|Snow Patrol
MUS|History|2|Which girl group sang "Wannabe" and included Scary, Sporty, Baby, Ginger and Posh?|Spice Girls|Destiny's Child|TLC|Girls Aloud
MUS|History|2|Which boy band included Nick Carter, AJ McLean and Howie D.?|Backstreet Boys|*NSYNC|New Kids on the Block|98 Degrees
MUS|History|2|Which boy band launched Harry Styles, Niall Horan and Zayn Malik?|One Direction|The Wanted|JLS|Big Time Rush
MUS|History|2|Which South Korean group is known for "Dynamite" and "Butter"?|BTS|BLACKPINK|EXO|Stray Kids
MUS|History|2|Which girl group released "Pink Venom" and "Kill This Love"?|BLACKPINK|TWICE|Red Velvet|ITZY
MUS|History|2|Which artist is known as "Mr. Worldwide"?|Pitbull|Flo Rida|Usher|Akon
MUS|History|2|Which rapper's real name is Marshall Mathers?|Eminem|Jay-Z|Nelly|Drake
MUS|History|2|Which rapper's real name is Shawn Carter?|Jay-Z|Kanye West|Nas|Jay Rock
MUS|History|2|Which artist was formerly known by a symbol and as "The Artist Formerly Known as Prince"?|Prince|David Bowie|Sting|Lenny Kravitz
MUS|History|2|Which singer's alter ego is Ziggy Stardust?|David Bowie|Elton John|Prince|Freddie Mercury
MUS|History|2|Which singer's alter ego is Sasha Fierce?|Beyoncé|Rihanna|Lady Gaga|Nicki Minaj
MUS|History|2|Which singer's alter ego is Slim Shady?|Eminem|Jay-Z|Dr. Dre|50 Cent
MUS|History|2|Which singer started in the Disney Channel's The Mickey Mouse Club alongside Justin Timberlake and Britney Spears?|Christina Aguilera|Beyoncé|Selena Gomez|Hilary Duff
MUS|History|2|Which singer is nicknamed "Queen B"?|Beyoncé|Rihanna|Cardi B|Nicki Minaj
MUS|History|2|Which singer is nicknamed "Swifties" by fans?|Taylor Swift|Selena Gomez|Katy Perry|Ariana Grande
MUS|History|2|Which singer's fans are called the "Beliebers"?|Justin Bieber|Shawn Mendes|Harry Styles|Niall Horan
MUS|History|2|Which singer's fans are called "Little Monsters"?|Lady Gaga|Katy Perry|Rihanna|Ariana Grande
MUS|History|2|Which singer's fans are called the "Beyhive"?|Beyoncé|Rihanna|Nicki Minaj|Cardi B
MUS|History|2|Which singer's fans are called the "Navy"?|Rihanna|Beyoncé|Nicki Minaj|Cardi B
MUS|History|2|Which singer's fans are called "Directioners"?|One Direction|Backstreet Boys|Jonas Brothers|*NSYNC
MUS|Awards|2|Which artist has won the most Grammy Awards of all time?|Beyoncé|Taylor Swift|Quincy Jones|Stevie Wonder
MUS|Awards|2|Which artist became the first to win Album of the Year four times, as of 2024?|Taylor Swift|Stevie Wonder|Frank Sinatra|Paul Simon
MUS|Awards|2|Which song won Song of the Year at the 2020 Grammy Awards, performed by Billie Eilish?|Bad Guy won Record of the Year|Dynamite|Truth Hurts|Old Town Road
MUS|Awards|3|Which musician was the first to be inducted into the Rock and Roll Hall of Fame in 1986 alongside Chuck Berry and Elvis Presley?|James Brown|Led Zeppelin|The Beatles|Bob Dylan
MUS|Awards|2|Where is the Rock and Roll Hall of Fame located?|Cleveland, Ohio|Memphis, Tennessee|Nashville, Tennessee|Detroit, Michigan
MUS|Awards|2|Which popular streaming service was founded in Sweden in 2006?|Spotify|Apple Music|Tidal|Pandora
MUS|Awards|2|What is the best-selling album of all time worldwide, according to most counts?|Thriller|Back in Black|The Dark Side of the Moon|Rumours
MUS|Awards|2|What is the best-selling single of all time?|White Christmas (Bing Crosby)|Candle in the Wind 1997|Shape of You|Bohemian Rhapsody
MUS|Country|2|Which country singer is known as the "Man in Black"?|Johnny Cash|Willie Nelson|Waylon Jennings|Merle Haggard
MUS|Country|2|Which country singer is the "Queen of Country" with a theme park named Dollywood?|Dolly Parton|Reba McEntire|Loretta Lynn|Tammy Wynette
MUS|Country|2|Which country artist sang "Friends in Low Places"?|Garth Brooks|George Strait|Alan Jackson|Tim McGraw
MUS|Country|2|Which country artist is known as the "King of Country" with the song "Amarillo by Morning"?|George Strait|Willie Nelson|Alan Jackson|Merle Haggard
MUS|Country|2|Which country artist sang "Before He Cheats"?|Carrie Underwood|Miranda Lambert|Taylor Swift|Shania Twain
MUS|Country|2|Which country singer's song "Man! I Feel Like a Woman!" was a huge pop crossover hit?|Shania Twain|Faith Hill|Reba McEntire|LeAnn Rimes
MUS|Country|2|Which country star founded the Luke Bryan-style "Georgia Peach"? skip|x|x|x|x
"""

def build():
    for s, a, y in SONGS:
        y = int(y)
        lib.MUSIC_ROUND.append((s, a, decade(y)))
    artists = sorted({s[1] for s in SONGS}); titles = [s[0] for s in SONGS]
    for s, a, y in SONGS:
        y = int(y)
        hit = y >= 2000 or s in ("Thriller", "Billie Jean", "Bohemian Rhapsody", "Hey Jude", "Smells Like Teen Spirit", "Sweet Child o' Mine", "Don't Stop Believin'", "I Will Always Love You", "Hotel California", "Imagine", "Stayin' Alive", "Dancing Queen", "My Heart Will Go On", "Livin' on a Prayer", "Like a Virgin", "Purple Rain", "Respect", "Every Breath You Take", "Eye of the Tiger", "Wonderwall", "Let It Be", "Hound Dog")
        era = sorted({x[1] for x in SONGS if abs(int(x[2]) - y) <= 12}) 
        add("MUS", "Song to Artist", 1 if hit else 2, f"Which artist or group recorded the song \"{s}\"?", a, pick(era if len(era) >= 8 else artists, a, "ms" + s))
        add("MUS", "Song Years", 3, f"In what year was \"{s}\" by {a} released?", y, near_years(y, "my" + s, 3))
    albs = sorted({a[1] for a in ALBUMS})
    for t, a, y in ALBUMS:
        y = int(y)
        add("MUS", "Albums", 2, f"Which artist released the album {t}?", a, pick(albs, a, "al" + t))
        add("MUS", "Albums", 3, f"In what year was {a}'s album {t} released?", y, near_years(y, "aly" + t, 3))
    bands = sorted({s[1] for s in SINGERS}); sing = [s[0] for s in SINGERS]
    for s, b in SINGERS:
        add("MUS", "Bands", 2, f"{s} is a member of which band?", b, pick(bands, b, "sb" + s))
    parse_hand(HAND)
