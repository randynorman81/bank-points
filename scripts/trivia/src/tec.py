from lib import *

ACRONYMS = table("""
HTML|HyperText Markup Language
CSS|Cascading Style Sheets
HTTP|HyperText Transfer Protocol
URL|Uniform Resource Locator
CPU|Central Processing Unit
RAM|Random Access Memory
ROM|Read-Only Memory
GPU|Graphics Processing Unit
USB|Universal Serial Bus
LAN|Local Area Network
WAN|Wide Area Network
DNS|Domain Name System
IP|Internet Protocol
SQL|Structured Query Language
AI|Artificial Intelligence
ASCII|American Standard Code for Information Interchange
PDF|Portable Document Format
JPEG|Joint Photographic Experts Group
GIF|Graphics Interchange Format
SSD|Solid State Drive
HDD|Hard Disk Drive
VPN|Virtual Private Network
GPS|Global Positioning System
PNG|Portable Network Graphics
API|Application Programming Interface
IDE|Integrated Development Environment
OS|Operating System
BIOS|Basic Input/Output System
ISP|Internet Service Provider
IoT|Internet of Things
VR|Virtual Reality
AR|Augmented Reality
NFC|Near Field Communication
LED|Light Emitting Diode
LCD|Liquid Crystal Display
HDMI|High-Definition Multimedia Interface
SMS|Short Message Service
QR|Quick Response
CAPTCHA|Completely Automated Public Turing test to tell Computers and Humans Apart
UI|User Interface
UX|User Experience
FTP|File Transfer Protocol
DDoS|Distributed Denial of Service
JSON|JavaScript Object Notation
CSV|Comma-Separated Values
GUI|Graphical User Interface
CLI|Command-Line Interface
RGB|Red, Green, Blue
PC|Personal Computer
SaaS|Software as a Service
""", 2)
ACR_EASY = {"HTML", "CPU", "RAM", "USB", "AI", "GPS", "PDF", "VPN", "LED", "PC", "OS", "URL", "HTTP", "VR"}

LANGS = table("""
Python|Guido van Rossum|1991
JavaScript|Brendan Eich|1995
Java|James Gosling|1995
C|Dennis Ritchie|1972
C++|Bjarne Stroustrup|1985
Ruby|Yukihiro Matsumoto|1995
PHP|Rasmus Lerdorf|1995
Perl|Larry Wall|1987
Pascal|Niklaus Wirth|1970
BASIC|John Kemeny and Thomas Kurtz|1964
FORTRAN|John Backus|1957
Lisp|John McCarthy|1958
Logo|Seymour Papert|1967
Scratch|MIT Media Lab|2007
TypeScript|Anders Hejlsberg|2012
Swift|Chris Lattner|2014
Go|Robert Griesemer, Rob Pike and Ken Thompson|2009
Rust|Graydon Hoare|2010
Kotlin|JetBrains|2011
SQL|Donald Chamberlin and Raymond Boyce|1974
""", 3)

COMPANIES = table("""
Apple|Steve Jobs and Steve Wozniak|1976|Cupertino, California
Microsoft|Bill Gates and Paul Allen|1975|Redmond, Washington
Google|Larry Page and Sergey Brin|1998|Mountain View, California
Amazon|Jeff Bezos|1994|Seattle
Meta (Facebook)|Mark Zuckerberg|2004|Menlo Park, California
Netflix|Reed Hastings and Marc Randolph|1997|Los Gatos, California
Intel|Gordon Moore and Robert Noyce|1968|Santa Clara, California
Nvidia|Jensen Huang, Chris Malachowsky and Curtis Priem|1993|Santa Clara, California
Dell|Michael Dell|1984|Round Rock, Texas
HP|Bill Hewlett and David Packard|1939|Palo Alto, California
Nintendo|Fusajiro Yamauchi|1889|Kyoto
Sony|Masaru Ibuka and Akio Morita|1946|Tokyo
Samsung|Lee Byung-chul|1938|Suwon
Spotify|Daniel Ek and Martin Lorentzon|2006|Stockholm
Uber|Travis Kalanick and Garrett Camp|2009|San Francisco
Airbnb|Brian Chesky, Joe Gebbia and Nathan Blecharczyk|2008|San Francisco
Twitter (X)|Jack Dorsey, Noah Glass, Biz Stone and Evan Williams|2006|San Francisco
""", 4)

GAMES = table("""
Super Mario Bros.|Nintendo|1985
The Legend of Zelda|Nintendo|1986
Pac-Man|Namco|1980
Space Invaders|Taito|1978
Donkey Kong|Nintendo|1981
Sonic the Hedgehog|Sega|1991
Minecraft|Mojang|2011
Fortnite|Epic Games|2017
Halo: Combat Evolved|Bungie|2001
Doom|id Software|1993
Half-Life|Valve|1998
World of Warcraft|Blizzard Entertainment|2004
The Sims|Maxis|2000
Grand Theft Auto V|Rockstar Games|2013
Among Us|Innersloth|2018
Animal Crossing: New Horizons|Nintendo|2020
Stardew Valley|ConcernedApe|2016
Roblox|Roblox Corporation|2006
Overwatch|Blizzard Entertainment|2016
League of Legends|Riot Games|2009
Portal|Valve|2007
Angry Birds|Rovio|2009
Candy Crush Saga|King|2012
Flappy Bird|Dong Nguyen|2013
Dark Souls|FromSoftware|2011
Elden Ring|FromSoftware|2022
Pokémon Red and Blue|Game Freak|1998
Mario Kart 8|Nintendo|2014
Tetris|Alexey Pajitnov|1984
Pong|Atari|1972
""", 3)

CONSOLES = table("""
Atari 2600|Atari|1977
Nintendo Entertainment System|Nintendo|1985
Sega Genesis|Sega|1989
Game Boy|Nintendo|1989
Super Nintendo|Nintendo|1991
PlayStation|Sony|1995
Nintendo 64|Nintendo|1996
Sega Dreamcast|Sega|1999
PlayStation 2|Sony|2000
Xbox|Microsoft|2001
GameCube|Nintendo|2001
Xbox 360|Microsoft|2005
Wii|Nintendo|2006
PlayStation 3|Sony|2006
PlayStation 4|Sony|2013
Xbox One|Microsoft|2013
Nintendo Switch|Nintendo|2017
PlayStation 5|Sony|2020
Xbox Series X|Microsoft|2020
""", 3)

INVENTIONS = table("""
the telephone|Alexander Graham Bell|1876
the practical electric light bulb|Thomas Edison|1879
the airplane|the Wright brothers|1903
the movable-type printing press in Europe|Johannes Gutenberg|1440
the cotton gin|Eli Whitney|1793
the telegraph|Samuel Morse|1837
the phonograph|Thomas Edison|1877
the dynamite|Alfred Nobel|1867
the World Wide Web|Tim Berners-Lee|1989
the sewing machine (practical lockstitch)|Elias Howe|1846
the safety elevator|Elisha Otis|1852
the radio (wireless telegraphy)|Guglielmo Marconi|1895
the steam engine (improved condenser)|James Watt|1769
the first vaccine (smallpox)|Edward Jenner|1796
the modern bicycle (safety bicycle)|John Kemp Starley|1885
the ENIAC computer|John Mauchly and J. Presper Eckert|1945
the Linux kernel|Linus Torvalds|1991
the first compiler|Grace Hopper|1952
the first mechanical computer design (Analytical Engine)|Charles Babbage|1837
the transistor|John Bardeen, Walter Brattain and William Shockley|1947
the integrated circuit|Jack Kilby|1958
the Apple II personal computer|Steve Wozniak|1977
the computer mouse|Douglas Engelbart|1964
the first email|Ray Tomlinson|1971
""", 3)

HAND = """
TEC|Computing|1|What do the letters "www" stand for in a website address?|World Wide Web|Wide World Web|World Web Wire|Web World Wide
TEC|Computing|1|Which company makes the iPhone?|Apple|Samsung|Google|Microsoft
TEC|Computing|1|Which company makes the Android operating system?|Google|Apple|Microsoft|Samsung
TEC|Computing|2|What is the name of Apple's voice assistant?|Siri|Alexa|Cortana|Bixby
TEC|Computing|2|What is the name of Amazon's voice assistant?|Alexa|Siri|Cortana|Google Assistant
TEC|Computing|2|What is the name of Microsoft's AI assistant, built into Windows 11 and Bing?|Copilot|Cortana|Siri|Clippy
TEC|Computing|2|What was the name of Microsoft Word's animated paperclip assistant?|Clippy|Bonzi Buddy|Rover|Merlin
TEC|Computing|2|What do we call a computer program designed to appear as another program but harm your computer?|Trojan horse|Worm|Spyware|Adware
TEC|Computing|2|What is a self-replicating malicious program that spreads across networks called?|Worm|Trojan|Spyware|Bug
TEC|Computing|2|What is the term for a fraudulent attempt to trick people into giving up passwords by email?|Phishing|Spoofing|Hacking|Spamming
TEC|Computing|2|What does a firewall do?|Blocks unauthorized network access|Cools the computer|Stores passwords|Speeds up downloads
TEC|Computing|2|What is the term for unsolicited junk email?|Spam|Phish|Cookie|Malware
TEC|Computing|2|What is the name for a small file a website stores in your browser?|Cookie|Cache|Plugin|Extension
TEC|Computing|2|What is the name of the web browser developed by Google?|Chrome|Firefox|Safari|Edge
TEC|Computing|2|What is the default web browser on Apple devices?|Safari|Chrome|Firefox|Edge
TEC|Computing|2|Which company makes the Windows operating system?|Microsoft|Apple|Google|IBM
TEC|Computing|2|Which operating system is open-source and uses a penguin mascot named Tux?|Linux|Windows|macOS|Unix
TEC|Computing|2|Which operating system powers iPhones?|iOS|Android|Windows Phone|Symbian
TEC|Computing|2|Which unit equals 1,024 bytes (traditionally)?|Kilobyte|Megabyte|Gigabyte|Terabyte
TEC|Computing|2|How many bits are in a byte?|8|4|16|2
TEC|Computing|2|What number system uses only 0s and 1s?|Binary|Decimal|Octal|Hexadecimal
TEC|Computing|3|What is the binary number 101 in decimal?|5|4|6|3
TEC|Computing|3|What is the hexadecimal digit for the decimal number 15?|F|E|A|9
TEC|Computing|3|What is the decimal number 8 in binary?|1000|0100|1100|0010
TEC|Computing|2|What do you call a set of step-by-step instructions to solve a problem?|Algorithm|Compiler|Variable|Function
TEC|Computing|2|What is the term for a named container that stores a value in a program?|Variable|Loop|Function|Class
TEC|Computing|2|What programming structure repeats code multiple times?|Loop|Variable|Comment|Operator
TEC|Computing|2|What do you call an error in a program?|Bug|Virus|Glitch|Crash only
TEC|Computing|3|Who is said to have found the first literal computer "bug" — a moth — in a Harvard computer?|Grace Hopper's team|Alan Turing|Charles Babbage|Ada Lovelace
TEC|Computing|2|Who is considered the first computer programmer, for her work on Babbage's Analytical Engine?|Ada Lovelace|Grace Hopper|Margaret Hamilton|Katherine Johnson
TEC|Computing|2|Which mathematician is known as the father of theoretical computer science and cracked the Enigma code?|Alan Turing|Charles Babbage|John von Neumann|Claude Shannon
TEC|Computing|2|Who is known as "Amazing Grace" and helped develop COBOL?|Grace Hopper|Ada Lovelace|Margaret Hamilton|Hedy Lamarr
TEC|Computing|2|Which NASA software engineer led the Apollo guidance software team?|Margaret Hamilton|Katherine Johnson|Dorothy Vaughan|Mary Jackson
TEC|Computing|2|Which Hollywood actress co-invented frequency hopping, a basis of Wi-Fi?|Hedy Lamarr|Marilyn Monroe|Audrey Hepburn|Grace Kelly
TEC|Computing|2|Who is known as the creator of the Linux kernel?|Linus Torvalds|Richard Stallman|Bill Gates|Steve Jobs
TEC|Computing|2|Who invented the World Wide Web in 1989?|Tim Berners-Lee|Vint Cerf|Marc Andreessen|Bill Gates
TEC|Computing|2|What was the first widely used graphical web browser, released in 1993?|Mosaic|Netscape Navigator|Internet Explorer|Opera
TEC|Computing|2|What was the first commercially successful search engine, before Google?|Yahoo! (as a directory) and AltaVista|Bing|Ask Jeeves only|DuckDuckGo
TEC|Computing|2|What is the world's most popular search engine?|Google|Bing|Yahoo|DuckDuckGo
TEC|Computing|2|What was the name of IBM's computer that beat chess champion Garry Kasparov in 1997?|Deep Blue|Watson|Big Blue|Deep Thought
TEC|Computing|2|What was the name of IBM's computer that won on Jeopardy! in 2011?|Watson|Deep Blue|Siri|Alexa
TEC|Computing|2|What was the name of the AI program from Google DeepMind that defeated a Go champion in 2016?|AlphaGo|Deep Blue|Watson|Stockfish
TEC|Computing|2|What company released ChatGPT in November 2022?|OpenAI|Google|Meta|Microsoft
TEC|Computing|2|What does GPT stand for in ChatGPT?|Generative Pre-trained Transformer|General Purpose Technology|Google Processing Tool|Generated Predictive Text
TEC|Computing|2|What is the name of Anthropic's AI assistant?|Claude|Gemini|Copilot|Llama
TEC|Computing|2|What is the name of Google's AI model family, previously called Bard?|Gemini|Claude|Llama|Grok
TEC|Computing|3|What is the name of the test proposed by Alan Turing to judge machine intelligence?|Turing test|Voight-Kampff test|Rorschach test|Bechdel test
TEC|Computing|2|What do we call a computer-controlled machine that can carry out tasks automatically?|Robot|Cyborg|Android only|Drone
TEC|Computing|2|What does a drone typically refer to?|Unmanned aerial vehicle|A robot dog|A VR headset|A smartwatch
TEC|Computing|2|Which device uses touch and was introduced by Apple in 2010, bridging phones and laptops?|iPad|iPod|iMac|MacBook
TEC|Computing|2|Which Apple product launched in 2001 with the slogan "1,000 songs in your pocket"?|iPod|iPhone|iPad|Apple Watch
TEC|Computing|2|In what year was the first iPhone released?|2007|2005|2009|2010
TEC|Computing|3|In what year was the first Apple Macintosh released?|1984|1976|1990|1980
TEC|Computing|3|Which video game company was founded by Nolan Bushnell?|Atari|Nintendo|Sega|Activision
TEC|Computing|2|What is the maximum number of players typically in a Minecraft... no skip|x|x|x|x
TEC|Computing|2|What is the name of the Atlanta-based company known for credit reporting that suffered a major data breach in 2017?|Equifax|Experian|TransUnion|Chase
TEC|Computing|2|Which Atlanta-based university is known for its engineering and computing programs?|Georgia Tech|Emory|Georgia State|Morehouse
TEC|Computing|2|What is Georgia Tech's mascot?|Yellow Jacket|Bulldog|Panther|Eagle
TEC|Computing|2|What coding language is used to style web pages?|CSS|HTML|SQL|Python
TEC|Computing|2|What coding language is used to structure web pages?|HTML|CSS|SQL|Java
TEC|Computing|2|What coding language is commonly used to add interactivity to web pages?|JavaScript|HTML|CSS|SQL
TEC|Computing|2|What coding language is used to manage databases?|SQL|HTML|CSS|JavaScript
TEC|Computing|3|What is the name of the AP exam in computer science that covers broad concepts like data and the internet?|AP Computer Science Principles|AP Computer Science A|AP Statistics|AP Physics C
TEC|Computing|3|What programming language is used in the AP Computer Science A course?|Java|Python|C++|JavaScript
TEC|Computing|2|What does the Python programming language get its name from?|Monty Python|A snake|Greek myth|A comic book
TEC|Computing|2|What is the name of the robot in Karel programming exercises?|Karel|Robo|Turtle|Beeper
TEC|Computing|2|Which programming language used a turtle to draw on screen for kids?|Logo|Scratch|BASIC|Pascal
TEC|Computing|2|Which block-based programming language was developed by MIT and has a cat mascot?|Scratch|Alice|Blockly|Snap!
TEC|Computing|2|What is the name for a graphical symbol that represents a file or program on a screen?|Icon|Cursor|Widget|Pixel
TEC|Computing|2|What is the smallest unit of a digital image called?|Pixel|Byte|Dot|Voxel
TEC|Computing|2|What does "HD" stand for in HD video?|High Definition|High Data|Hyper Digital|Hard Display
TEC|Computing|2|What is the common resolution known as 4K roughly?|3840 × 2160|1920 × 1080|1280 × 720|7680 × 4320
TEC|Computing|2|What do we call the physical parts of a computer?|Hardware|Software|Firmware|Middleware
TEC|Computing|2|What do we call the programs and operating systems that run on a computer?|Software|Hardware|Peripheral|Firmware
TEC|Computing|2|What is the brain of a computer commonly called?|CPU|GPU|RAM|SSD
TEC|Computing|2|What temporary storage is erased when a computer is turned off?|RAM|SSD|Hard drive|ROM
TEC|Computing|2|What kind of device is used to point and click on a computer screen?|Mouse|Keyboard|Monitor|Printer
TEC|Computing|2|What is the keyboard layout most commonly used in English called?|QWERTY|DVORAK|AZERTY|Colemak
TEC|Computing|2|What is the keyboard shortcut for copy on Windows?|Ctrl + C|Ctrl + V|Ctrl + X|Ctrl + Z
TEC|Computing|2|What is the keyboard shortcut for paste on Windows?|Ctrl + V|Ctrl + C|Ctrl + X|Ctrl + P
TEC|Computing|2|What is the keyboard shortcut for undo on most computers?|Ctrl/Cmd + Z|Ctrl/Cmd + Y|Ctrl/Cmd + U|Ctrl/Cmd + X
TEC|Computing|2|What does the "Esc" key stand for?|Escape|Escalate|Execute|Entry
TEC|Computing|3|What file extension is used for Microsoft Word documents?|.docx|.xlsx|.pptx|.txt
TEC|Computing|3|What file extension is used for Microsoft Excel spreadsheets?|.xlsx|.docx|.pptx|.csv
TEC|Computing|3|What file extension is used for Python scripts?|.py|.java|.js|.cpp
TEC|Computing|3|What file extension is used for web pages?|.html|.css|.js|.py
TEC|Computing|2|What does the "@" symbol separate in an email address?|Username and domain|First and last name|Subject and body|Sender and recipient
TEC|Computing|2|What does a "hashtag" symbol look like?|#|@|&|$
TEC|Computing|2|Which social platform popularized the hashtag?|Twitter|Facebook|Instagram|MySpace
"""

YEARS_OK = {"the telephone","the practical electric light bulb","the airplane","the telegraph","the phonograph","the dynamite","the World Wide Web","the transistor","the first email","the Linux kernel","the cotton gin"}

def build():
    meanings = [a[1] for a in ACRONYMS]
    for a, m in ACRONYMS:
        add("TEC", "Tech Acronyms", 1 if a in ACR_EASY else 2, f"What does the tech acronym {a} stand for?", m, pick(meanings, m, "ac" + a))
    creators = sorted({l[1] for l in LANGS})
    for l, c, y in LANGS:
        y = int(y)
        add("TEC", "Programming Languages", 3, f"Who created the {l} programming language?" if l not in ("Scratch", "Kotlin") else f"Which person or group developed the {l} programming language?", c, pick(creators, c, "pl" + l))
        add("TEC", "Programming Languages", 3, f"In what year did the {l} programming language first appear?", y, near_years(y, "ply" + l, 4))
    founders = sorted({c[1] for c in COMPANIES}); hqs = sorted({c[3] for c in COMPANIES})
    for n, f, y, hq in COMPANIES:
        y = int(y)
        add("TEC", "Tech Companies", 2, f"Who founded {n}?", f, pick(founders, f, "cf" + n))
        add("TEC", "Tech Companies", 3, f"In what year was {n} founded?", y, near_years(y, "cy" + n, 6 if y > 1950 else 30))
        add("TEC", "Tech Companies", 3, f"In which city is {n} headquartered or was it founded?", hq, pick(hqs, hq, "ch" + n))
    devs = sorted({g[1] for g in GAMES})
    for g, d, y in GAMES:
        y = int(y)
        add("TEC", "Video Games", 2, f"Which company or developer made the video game {g}?", d, pick(devs, d, "gd" + g))
        add("TEC", "Video Games", 3, f"In what year was {g} first released?", y, near_years(y, "gy" + g, 3))
    makers = ["Nintendo", "Sony", "Microsoft", "Sega", "Atari"]
    for c, m, y in CONSOLES:
        y = int(y)
        add("TEC", "Game Consoles", 2, f"Which company makes the {c} console?", m, pick(makers, m, "cm" + c))
        add("TEC", "Game Consoles", 3, f"In what year was the {c} console first released in North America?", y, near_years(y, "cny" + c, 2))
    inv = sorted({i[1] for i in INVENTIONS})
    for i, p, y in INVENTIONS:
        y = int(y)
        add("TEC", "Inventions", 2 if y < 1950 else 3, f"Who is credited with inventing or developing {i}?", p, pick(inv, p, "iv" + i))
        if i in YEARS_OK:
            add("TEC", "Inventions", 3, f"In what year was {i} invented or introduced?", y, near_years(y, "ivy" + i, 5 if y > 1800 else 20))
    parse_hand(HAND)
