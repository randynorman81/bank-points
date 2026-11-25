from lib import *

VOCAB = table("""
ephemeral|lasting a very short time
ubiquitous|found everywhere at once
benevolent|kind and generous
meticulous|extremely careful about details
gregarious|sociable and fond of company
taciturn|reserved and saying very little
verbose|using more words than necessary
pragmatic|practical rather than idealistic
ambiguous|open to more than one meaning
candid|frank and honest
frugal|careful about spending money
lethargic|sluggish and lacking energy
resilient|able to recover quickly
reluctant|unwilling or hesitant
obsolete|no longer in use
eloquent|fluent and persuasive in speaking
indigenous|native to a particular place
melancholy|a gentle, thoughtful sadness
nostalgia|sentimental longing for the past
obstinate|stubbornly refusing to change
pensive|engaged in deep thought
serene|calm and peaceful
tenacious|persistent and determined
zealous|very enthusiastic or devoted
altruistic|selfless concern for others
ambivalent|having mixed feelings
arduous|difficult and tiring
austere|severe or plain
belligerent|hostile and aggressive
cacophony|a harsh mixture of sounds
clandestine|kept secret
copious|abundant
cryptic|having a hidden meaning
diligent|hardworking and careful
docile|easy to manage or teach
elusive|hard to find or catch
exuberant|full of energy and excitement
fastidious|very attentive to detail and cleanliness
futile|pointless
gullible|easily fooled
haughty|arrogant and proud
impartial|fair and unbiased
incessant|never-ending
inevitable|certain to happen
jubilant|joyful and triumphant
lucid|clear and easy to understand
loquacious|very talkative
mundane|ordinary and dull
nefarious|wicked
nonchalant|casually calm and unconcerned
ominous|suggesting something bad will happen
ostentatious|showy to impress
paramount|most important
placid|calm and not easily upset
prudent|wise and careful
quaint|charmingly old-fashioned
sagacious|wise and shrewd
scrutinize|to examine closely
sporadic|occurring at irregular intervals
stoic|enduring hardship without complaint
superfluous|more than needed
tangible|able to be touched
tranquil|calm and quiet
unanimous|agreed on by everyone
volatile|likely to change suddenly
wary|cautious about possible danger
whimsical|playfully quaint or fanciful
zenith|the highest point
ambiguity|uncertainty of meaning
benign|harmless
callous|insensitive
daunting|intimidating
empathy|understanding another's feelings
fickle|changing often
hindrance|an obstacle
innovate|to introduce something new
juxtapose|to place side by side for contrast
mediocre|of average or only fair quality
novice|a beginner
pinnacle|the peak
rhetoric|persuasive speaking or writing
solitary|alone
trivial|of little importance
vindicate|to clear of blame
""", 2)
EASY_V = {"reluctant", "obsolete", "candid", "frugal", "serene", "vivid", "novice", "solitary", "trivial", "benign", "pinnacle", "zenith"}

IDIOMS = table("""
break the ice|start a conversation in an awkward situation
spill the beans|reveal a secret
hit the sack|go to bed
a piece of cake|something very easy
under the weather|feeling sick
cost an arm and a leg|be very expensive
once in a blue moon|very rarely
the ball is in your court|it's your turn to act
bite the bullet|endure something unpleasant
let the cat out of the bag|accidentally reveal a secret
kick the bucket|die
beat around the bush|avoid the main point
burn the midnight oil|work late into the night
get cold feet|become nervous before an event
hit the nail on the head|be exactly right
jump on the bandwagon|join a popular trend
pull someone's leg|joke with someone
raining cats and dogs|raining very heavily
the whole nine yards|everything
throw in the towel|give up
add insult to injury|make a bad situation worse
barking up the wrong tree|pursuing the wrong idea
the elephant in the room|an obvious problem no one mentions
back to square one|start over
bury the hatchet|make peace
a wild goose chase|a pointless search
the last straw|the final problem that makes you lose patience
steal someone's thunder|take credit for another's moment
on the fence|undecided
cry over spilled milk|be upset about something that can't be changed
the early bird catches the worm|those who start early get the advantage
don't count your chickens|don't assume success before it happens
speak of the devil|the person you were just talking about arrives
better late than never|doing something late is better than not at all
a blessing in disguise|something good that seemed bad at first
cut corners|do something cheaply or carelessly
go the extra mile|make additional effort
miss the boat|miss an opportunity
let sleeping dogs lie|avoid stirring up trouble
""", 2)

LANG = table("""
hello|hola|bonjour
goodbye|adiós|au revoir
thank you|gracias|merci
please|por favor|s'il vous plaît
yes|sí|oui
water|agua|eau
house|casa|maison
dog|perro|chien
cat|gato|chat
book|libro|livre
friend|amigo|ami
red|rojo|rouge
blue|azul|bleu
green|verde|vert
white|blanco|blanc
black|negro|noir
bread|pan|pain
milk|leche|lait
cheese|queso|fromage
apple|manzana|pomme
school|escuela|école
sun|sol|soleil
moon|luna|lune
love|amor|amour
good|bueno|bon
one|uno|un
two|dos|deux
three|tres|trois
four|cuatro|quatre
five|cinco|cinq
ten|diez|dix
Monday|lunes|lundi
Friday|viernes|vendredi
cheers|salud|santé
welcome|bienvenido|bienvenue
""", 3)

ABBR = table("""
e.g.|for example (exempli gratia)
i.e.|that is (id est)
etc.|and so forth (et cetera)
a.m.|before noon (ante meridiem)
p.m.|after noon (post meridiem)
P.S.|postscript
R.S.V.P.|please reply (répondez s'il vous plaît)
vs.|versus
AKA|also known as
ASAP|as soon as possible
DIY|do it yourself
FYI|for your information
ETA|estimated time of arrival
CEO|chief executive officer
NASA|National Aeronautics and Space Administration
FBI|Federal Bureau of Investigation
UNESCO|United Nations Educational, Scientific and Cultural Organization
NATO|North Atlantic Treaty Organization
NASDAQ|National Association of Securities Dealers Automated Quotations
SCUBA|self-contained underwater breathing apparatus
RADAR|radio detection and ranging
LASER|light amplification by stimulated emission of radiation
POTUS|President of the United States
VIP|very important person
SOS|a distress signal (no official expansion)
""", 2)
ABBR = [a for a in ABBR if a[0] != "SOS"]


SPELL = table("""
Necessary|Neccessary|Necesary|Neccesary|required or needed
Definitely|Definately|Definitly|Defanitely|without any doubt
Separate|Seperate|Separete|Seprate|to divide or keep apart
Accommodate|Acommodate|Accomodate|Acommodete|to provide room for
Occurrence|Occurence|Occurrance|Ocurrence|something that happens
Rhythm|Rythm|Rhythem|Rhythym|a repeating pattern of beats
Embarrass|Embarass|Embarras|Embaras|to make someone feel awkward
Conscience|Conscence|Consciense|Concience|your inner sense of right and wrong
Millennium|Millenium|Milennium|Millenniem|a period of 1,000 years
Questionnaire|Questionaire|Questionnare|Questionnair|a written list of survey questions
Maintenance|Maintainance|Maintenence|Maintanance|upkeep and repair
Privilege|Priviledge|Privelege|Privilige|a special right or advantage
Colonel|Collonel|Colenel|Kolonel|an army rank pronounced "kernel"
Pharaoh|Pharoah|Pharoh|Pharaoh'|an ancient Egyptian ruler
Mischievous|Mischievious|Mischevious|Mischeivous|playfully naughty
Vacuum|Vaccum|Vacume|Vacuume|a space with no air in it
Guarantee|Garantee|Guarentee|Guarrantee|a firm promise or assurance
Weird|Wierd|Wired|Weerd|strange or odd
Receive|Recieve|Receve|Reseive|to get something given to you
Calendar|Calender|Calandar|Callendar|a chart of the days and months
Existence|Existance|Existense|Exsistence|the state of being
Occasionally|Occasionaly|Ocasionally|Occassionally|now and then
Restaurant|Restaraunt|Resturant|Restaurent|a place to eat out
Library|Libary|Librery|Liberry|a place to borrow books
February|Febuary|Februery|Febuarry|the second month of the year
Government|Goverment|Govermment|Governmant|the group that runs a country
Beginning|Begining|Beggining|Beginnning|the start of something
Rhyme|Rime (variant)|Rhime|Ryhme|words that end with the same sound
Tomorrow|Tommorow|Tomorow|Tommorrow|the day after today
Pronunciation|Pronounciation|Pronuncation|Pronunciashun|how a word is said aloud
""", 5)

HAND = """
WRD|Grammar|1|What part of speech is the word "quickly" in "She ran quickly"?|Adverb|Adjective|Noun|Verb
WRD|Grammar|2|What is the plural of "mouse" (the animal)?|Mice|Mouses|Mices|Mousen
WRD|Grammar|2|What is the plural of "goose"?|Geese|Gooses|Geeses|Goosen
WRD|Grammar|2|What is the plural of "child"?|Children|Childs|Childes|Childrens
WRD|Grammar|2|What is the plural of "cactus"?|Cacti|Cactuses only|Cactae|Cactis
WRD|Grammar|2|What is the plural of "phenomenon"?|Phenomena|Phenomenons|Phenomenae|Phenomenes
WRD|Grammar|2|What is the plural of "criterion"?|Criteria|Criterions|Criterias|Criterium
WRD|Grammar|2|What is the plural of "bacterium"?|Bacteria|Bacteriums|Bacterii|Bacterias
WRD|Grammar|2|What is the plural of "analysis"?|Analyses|Analysises|Analysi|Analysis's
WRD|Grammar|2|What is the plural of "leaf"?|Leaves|Leafs|Leaves'|Leafes
WRD|Grammar|2|What is the plural of "wolf"?|Wolves|Wolfs|Wolfes|Wolvs
WRD|Grammar|2|Which word is a homophone of "their"?|There|Thier|Theyre|Thare
WRD|Grammar|2|Which word means the opposite of "ancient"?|Modern|Old|Antique|Historic
WRD|Grammar|2|Which sentence uses "its" correctly?|The dog wagged its tail.|The dog wagged it's tail.|Its a sunny day, isn't it'?|The cat licked it's paw.
WRD|Grammar|2|What punctuation mark ends a sentence that asks a question?|Question mark|Period|Exclamation point|Comma
WRD|Grammar|2|What is the punctuation mark (;) called?|Semicolon|Colon|Comma|Apostrophe
WRD|Grammar|2|What is the punctuation mark (—) typically called?|Em dash|Hyphen|En dash|Underscore
WRD|Grammar|2|What is a word that means the same as another word called?|Synonym|Antonym|Homonym|Acronym
WRD|Grammar|2|What is a word that means the opposite of another word called?|Antonym|Synonym|Homophone|Palindrome
WRD|Grammar|2|What is a word that reads the same backward as forward called?|Palindrome|Anagram|Acronym|Homophone
WRD|Grammar|2|What is a word formed by rearranging the letters of another called?|Anagram|Palindrome|Acronym|Portmanteau
WRD|Grammar|2|What is a word blending two words, like "brunch," called?|Portmanteau|Acronym|Anagram|Compound
WRD|Grammar|2|What do we call a word formed from the initial letters of a phrase, like NASA?|Acronym|Initialism|Anagram|Portmanteau
WRD|Grammar|2|"Brunch" is a blend of which two words?|Breakfast and lunch|Brewed and lunch|Bread and lunch|Breakfast and munch
WRD|Grammar|2|"Smog" is a blend of which two words?|Smoke and fog|Smell and fog|Smoke and mud|Soot and fog
WRD|Grammar|2|"Motel" is a blend of which two words?|Motor and hotel|Mother and hotel|Moat and hotel|Motion and hotel
WRD|Grammar|2|"Spork" is a blend of which two utensils?|Spoon and fork|Spoon and knife|Soup and fork|Stick and fork
WRD|Grammar|2|"Podcast" is a blend of "iPod" and which other word?|Broadcast|Forecast|Outcast|Typecast
WRD|Grammar|2|How many letters are in the English alphabet?|26|24|27|25
WRD|Grammar|2|Which letter is the most common in English words?|E|A|T|S
WRD|Grammar|2|Which is the only English word with three consecutive double letters, as in "bookkeeper"?|Bookkeeper|Committee|Mississippi|Possess
WRD|Grammar|3|Which letter is the least common in English?|Z|Q|X|J
WRD|Grammar|2|What is the longest word in the English language that appears in major dictionaries, a lung disease?|Pneumonoultramicroscopic... (pneumoconiosis variant)|Antidisestablishmentarianism|Supercalifragilisticexpialidocious|Floccinaucinihilipilification
WRD|Grammar|2|Which word in the English language is spelled the same upside down as it reads?|SWIMS|BOOK|NOON|CHOICE
WRD|Grammar|2|Which of these words is always spelled the same when rotated 180 degrees?|SWIMS|DOG|BOX|LEVEL
WRD|Grammar|2|How do you spell the word for the sound a hungry cat might make? skip|x|x|x|x
WRD|Origins|2|What language does the word "ketchup" originally come from?|Chinese (Hokkien)|Italian|French|Spanish
WRD|Origins|2|What language does the word "algebra" come from?|Arabic|Greek|Latin|Persian
WRD|Origins|2|From which language did English borrow "kindergarten"?|German|French|Dutch|Swedish
WRD|Origins|2|From which language did English borrow "pizza"?|Italian|Greek|Latin|Spanish
WRD|Origins|2|From which language did English borrow "tycoon"?|Japanese|Chinese|Korean|Hindi
WRD|Origins|2|From which language did English borrow "shampoo"?|Hindi|Arabic|Persian|Turkish
WRD|Origins|2|From which language did English borrow "robot"?|Czech|Russian|Polish|German
WRD|Origins|2|The word "tsunami" comes from which language?|Japanese|Chinese|Korean|Hawaiian
WRD|Origins|2|The word "safari" comes from which language?|Swahili|Arabic|Zulu|Afrikaans
WRD|Origins|2|The word "boondocks" comes from which language?|Tagalog|Spanish|Hindi|Malay
WRD|Origins|3|The word "quarantine" comes from an Italian term meaning how many days?|Forty|Thirty|Fourteen|Sixty
WRD|Origins|3|The word "salary" is derived from the Latin word for what?|Salt|Silver|Service|Skill
WRD|Origins|2|What does the Latin phrase "carpe diem" mean?|Seize the day|Live and learn|Time flies|Hold your tongue
WRD|Origins|2|What does the Latin phrase "et cetera" mean?|And so forth|And so on and on|Everything|The rest
WRD|Origins|2|What does the Latin phrase "ad hoc" mean?|For this purpose|At home|After the fact|About half
WRD|Origins|2|What does the Latin phrase "per capita" mean?|Per head|Per case|Per year|Per mile
WRD|Origins|2|What does the Latin phrase "bona fide" mean?|In good faith / genuine|Good luck|Fine dining|Bold face
WRD|Origins|2|What does the French phrase "déjà vu" mean?|Already seen|Never seen|Seen once|Remembered
WRD|Origins|2|What does the French phrase "faux pas" mean?|False step|Fake name|Mock exam|False start
WRD|Origins|2|What does the French phrase "c'est la vie" mean?|That's life|It's alive|That's a lie|I see the view
WRD|Origins|2|What does the Spanish phrase "hasta la vista" mean?|Until we see each other|Welcome home|Good luck|Never again
WRD|Origins|2|What does the Spanish phrase "mi casa es su casa" mean?|My house is your house|My house is for sale|Where is the house|Your house is mine
WRD|Origins|2|What does the Italian word "ciao" mean?|Hello and goodbye|Thank you|Please|Good night
WRD|Origins|2|What does the Hawaiian word "aloha" mean?|Hello, goodbye and love|Thank you|Beach|Welcome only
WRD|Origins|2|What does the Hawaiian word "ohana" mean?|Family|Friend|Ocean|Home
WRD|Origins|2|What does the Swahili phrase "hakuna matata" mean?|No worries|Welcome home|Good morning|Be strong
WRD|Origins|2|What does the Japanese word "sayonara" mean?|Goodbye|Hello|Thank you|Please
WRD|Origins|2|What does the German word "kindergarten" literally mean?|Children's garden|Small school|Little class|Playground
WRD|Origins|2|What does the German word "wanderlust" mean?|A strong desire to travel|Love of nature|Fear of heights|A hiking trail
WRD|Origins|2|What does the German word "schadenfreude" mean?|Pleasure at another's misfortune|Fear of losing|A sad story|Friendly rivalry
WRD|Origins|2|What does the Spanish word "siesta" mean?|An afternoon nap|A fiesta|A late dinner|A midday meal
WRD|Origins|2|What does the Spanish word "fiesta" mean?|Party|Parade|Dinner|Dance
WRD|Wordplay|2|Which month's name comes from the Roman emperor Augustus?|August|July|September|October
WRD|Wordplay|2|Which month's name comes from Julius Caesar?|July|June|August|May
WRD|Wordplay|2|Which day of the week is named after the Norse god Thor?|Thursday|Tuesday|Wednesday|Friday
WRD|Wordplay|2|Which day of the week is named after the Norse god Odin (Woden)?|Wednesday|Tuesday|Thursday|Saturday
WRD|Wordplay|2|Which day of the week is named after the Roman god Saturn?|Saturday|Sunday|Friday|Thursday
WRD|Wordplay|2|The word "September" is derived from the Latin word for which number?|Seven|Nine|Ten|Six
WRD|Wordplay|2|Which word means "to eat" and is a Latin word like "edible"?|Comedere (to eat)|Bibere|Videre|Audire
WRD|Wordplay|2|What do we call a phrase such as "Mississippi" that includes multiple repeated letters? skip|x|x|x|x
WRD|Wordplay|2|Which of these is a tongue twister?|She sells seashells by the seashore|Mary had a little lamb|Twinkle twinkle little star|Humpty Dumpty sat on a wall
WRD|Wordplay|2|How many words are in "Peter Piper picked a peck of pickled peppers"? (Count carefully.)|8|7|9|10
WRD|Wordplay|2|What word becomes shorter when you add two letters to it?|Short|Brief|Small|Little
WRD|Wordplay|2|What is the name of the game where you guess letters to fill in a blank phrase before a hangman figure is drawn?|Hangman|Scrabble|Boggle|Wordle
WRD|Wordplay|2|What is the five-letter word puzzle game popularized in 2021 that was bought by The New York Times?|Wordle|Boggle|Scrabble|Quordle
WRD|Wordplay|2|How many guesses do you get in standard Wordle?|6|5|7|4
WRD|Wordplay|2|How many letters are in a standard Wordle answer?|5|4|6|7
"""

def build():
    defs = [v[1] for v in VOCAB]; words = [v[0] for v in VOCAB]
    for w, d in VOCAB:
        add("WRD", "Vocabulary", 1 if w in EASY_V else 2, f"What does the word \"{w}\" mean?", d, pick(defs, d, "vo" + w))
        add("WRD", "Vocabulary", 2 if w in EASY_V else 3, f"Which word means \"{d}\"?", w, pick(words, w, "rvo" + w))
    meanings = [i[1] for i in IDIOMS]
    for i, m in IDIOMS:
        add("WRD", "Idioms", 2, f"What does the idiom \"{i}\" mean?", m, pick(meanings, m, "id" + i))
    es = [l[1] for l in LANG]; fr = [l[2] for l in LANG]
    for e, s, f in LANG:
        d = 1 if e in ("hello", "goodbye", "thank you", "yes", "water", "one", "two", "three", "red", "blue", "dog", "cat") else 2
        add("WRD", "Spanish", d, f"How do you say \"{e}\" in Spanish?", s, pick(es, s, "es" + e))
        add("WRD", "French", d, f"How do you say \"{e}\" in French?", f, pick(fr, f, "fr" + e))
    ab = [a[1] for a in ABBR]
    for a, m in ABBR:
        add("WRD", "Abbreviations", 2, f"What does the abbreviation {a} stand for?", m, pick(ab, m, "ab" + a))
    for r, w1, w2, w3, h in SPELL:
        add("WRD", "Spelling", 2, f"Which is the correct spelling of the word meaning \"{h}\"?", r, [w1, w2, w3])
    parse_hand(HAND)
