from lib import *

PAINTINGS = table("""
Mona Lisa|Leonardo da Vinci|1503
The Last Supper|Leonardo da Vinci|1498
The Starry Night|Vincent van Gogh|1889
Sunflowers|Vincent van Gogh|1888
The Scream|Edvard Munch|1893
Guernica|Pablo Picasso|1937
The Persistence of Memory|Salvador Dalí|1931
Girl with a Pearl Earring|Johannes Vermeer|1665
The Birth of Venus|Sandro Botticelli|1485
The Night Watch|Rembrandt|1642
American Gothic|Grant Wood|1930
Nighthawks|Edward Hopper|1942
The Kiss|Gustav Klimt|1908
Impression, Sunrise|Claude Monet|1872
The Creation of Adam|Michelangelo|1512
Las Meninas|Diego Velázquez|1656
The Great Wave off Kanagawa|Hokusai|1831
A Sunday Afternoon on the Island of La Grande Jatte|Georges Seurat|1884
Campbell's Soup Cans|Andy Warhol|1962
The Treachery of Images|René Magritte|1929
Les Demoiselles d'Avignon|Pablo Picasso|1907
The Garden of Earthly Delights|Hieronymus Bosch|1500
Liberty Leading the People|Eugène Delacroix|1830
Washington Crossing the Delaware|Emanuel Leutze|1851
Christina's World|Andrew Wyeth|1948
Whaam!|Roy Lichtenstein|1963
The Son of Man|René Magritte|1964
Wanderer above the Sea of Fog|Caspar David Friedrich|1818
The Hay Wain|John Constable|1821
Water Lilies|Claude Monet|-
Self-Portrait with Bandaged Ear|Vincent van Gogh|1889
The Two Fridas|Frida Kahlo|1939
Primavera|Sandro Botticelli|1480
""", 3)

SCULPTURES = table("""
David|Michelangelo
The Thinker|Auguste Rodin
Pietà|Michelangelo
Venus de Milo|unknown (Alexandros of Antioch attributed)
Christ the Redeemer|Paul Landowski
The Statue of Liberty|Frédéric Auguste Bartholdi
Balloon Dog|Jeff Koons
Mount Rushmore|Gutzon Borglum
Cloud Gate (The Bean)|Anish Kapoor
The Kiss|Auguste Rodin
""", 2)

MOVEMENTS = table("""
Impressionism|Claude Monet
Cubism|Pablo Picasso
Surrealism|Salvador Dalí
Pop art|Andy Warhol
Abstract expressionism|Jackson Pollock
Post-Impressionism|Vincent van Gogh
Fauvism|Henri Matisse
Dada|Marcel Duchamp
Pointillism|Georges Seurat
Baroque|Caravaggio
""", 2)

MUSEUMS = table("""
The Louvre|Paris
Musée d'Orsay|Paris
The Prado|Madrid
The Uffizi Gallery|Florence
The Rijksmuseum|Amsterdam
The Van Gogh Museum|Amsterdam
The British Museum|London
Tate Modern|London
The Metropolitan Museum of Art|New York City
The Museum of Modern Art (MoMA)|New York City
The Guggenheim Museum|New York City
The Hermitage|Saint Petersburg
The Smithsonian Institution|Washington, D.C.
The Art Institute of Chicago|Chicago
The Getty Center|Los Angeles
The High Museum of Art|Atlanta
The Vatican Museums|Vatican City
The Acropolis Museum|Athens
The Telfair Museums|Savannah
""", 2)

BUILDINGS = table("""
Guggenheim Museum Bilbao|Frank Gehry
Fallingwater|Frank Lloyd Wright
Sydney Opera House|Jørn Utzon
The Eiffel Tower|Gustave Eiffel
Sagrada Família|Antoni Gaudí
The Louvre Pyramid|I. M. Pei
Farnsworth House|Ludwig Mies van der Rohe
Walt Disney Concert Hall|Frank Gehry
Monticello|Thomas Jefferson
Villa Savoye|Le Corbusier
Guggenheim Museum in New York City|Frank Lloyd Wright
The Parthenon|Ictinus and Callicrates
""", 2)

GODS = table("""
Zeus|king of the gods and sky|Jupiter
Hera|marriage and family|Juno
Poseidon|the sea|Neptune
Hades|the underworld|Pluto
Athena|wisdom and strategy|Minerva
Apollo|the sun, music and prophecy|Apollo
Artemis|the hunt and the moon|Diana
Ares|war|Mars
Aphrodite|love and beauty|Venus
Hephaestus|the forge and fire|Vulcan
Hermes|messages and travel|Mercury
Dionysus|wine and festivity|Bacchus
Demeter|the harvest|Ceres
Eros|desire and love|Cupid
""", 3)

NORSE_EGYPT = table("""
Odin|chief of the Norse gods
Thor|Norse god of thunder
Loki|Norse trickster god
Freya|Norse goddess of love and beauty
Heimdall|Norse guardian of the rainbow bridge
Ra|Egyptian sun god
Osiris|Egyptian god of the afterlife
Isis|Egyptian goddess of magic and motherhood
Anubis|Egyptian god of mummification, with a jackal head
Horus|Egyptian falcon-headed sky god
Thoth|Egyptian god of writing and wisdom
Bastet|Egyptian goddess depicted as a cat
""", 2)

MUSICALS = table("""
Les Misérables|Claude-Michel Schönberg
The Phantom of the Opera|Andrew Lloyd Webber
Cats|Andrew Lloyd Webber
Hamilton|Lin-Manuel Miranda
Wicked|Stephen Schwartz
West Side Story|Leonard Bernstein
Oklahoma!|Richard Rodgers
Chicago|John Kander
Rent|Jonathan Larson
Fiddler on the Roof|Jerry Bock
Annie|Charles Strouse
A Chorus Line|Marvin Hamlisch
Sweeney Todd|Stephen Sondheim
Into the Woods|Stephen Sondheim
Hadestown|Anaïs Mitchell
Hairspray|Marc Shaiman
Dear Evan Hansen|Benj Pasek and Justin Paul
The Lion King (stage musical)|Elton John
""", 2)

SONGS = table("""
"Memory"|Cats
"Defying Gravity"|Wicked
"Do-Re-Mi"|The Sound of Music
"Tomorrow"|Annie
"One Day More"|Les Misérables
"My Shot"|Hamilton
"Seasons of Love"|Rent
"Tradition"|Fiddler on the Roof
"Cell Block Tango"|Chicago
"Circle of Life"|The Lion King
"Summer Nights"|Grease
"Tonight"|West Side Story
"The Music of the Night"|The Phantom of the Opera
"Waving Through a Window"|Dear Evan Hansen
"Popular"|Wicked
"You Can't Stop the Beat"|Hairspray
"Master of the House"|Les Misérables
"Don't Cry for Me Argentina"|Evita
"The Sun Will Come Out"|Annie
"Satisfied"|Hamilton
""", 2)
SONGS = [s for s in SONGS if s[0] not in ('"The Sun Will Come Out"',)]

CLASSICAL = table("""
Symphony No. 5 (da-da-da-DUM)|Ludwig van Beethoven
The Four Seasons|Antonio Vivaldi
The Magic Flute|Wolfgang Amadeus Mozart
Swan Lake|Pyotr Tchaikovsky
The Nutcracker|Pyotr Tchaikovsky
1812 Overture|Pyotr Tchaikovsky
Carmen|Georges Bizet
The Blue Danube|Johann Strauss II
Moonlight Sonata|Ludwig van Beethoven
Für Elise|Ludwig van Beethoven
Clair de Lune|Claude Debussy
Boléro|Maurice Ravel
The Rite of Spring|Igor Stravinsky
Brandenburg Concertos|Johann Sebastian Bach
Messiah|George Frideric Handel
Eine kleine Nachtmusik|Wolfgang Amadeus Mozart
Peter and the Wolf|Sergei Prokofiev
Rhapsody in Blue|George Gershwin
Appalachian Spring|Aaron Copland
Ride of the Valkyries|Richard Wagner
Peer Gynt|Edvard Grieg
The Planets|Gustav Holst
La Traviata|Giuseppe Verdi
Madama Butterfly|Giacomo Puccini
Carmina Burana|Carl Orff
The Barber of Seville|Gioachino Rossini
Canon in D|Johann Pachelbel
""", 2)

HAND = """
ART|Art Basics|1|What are the three primary colors in traditional color theory (RYB)?|Red, yellow, blue|Red, green, blue|Cyan, magenta, yellow|Orange, green, purple
ART|Art Basics|2|What are the three primary colors of light (RGB)?|Red, green, blue|Red, yellow, blue|Cyan, magenta, yellow|Orange, green, violet
ART|Art Basics|2|What two colors mix to make green in traditional color theory?|Blue and yellow|Red and blue|Red and yellow|Blue and white
ART|Art Basics|2|What two colors mix to make purple?|Red and blue|Red and yellow|Blue and yellow|Red and green
ART|Art Basics|2|What color is the complement of red on the traditional color wheel?|Green|Blue|Orange|Purple
ART|Art Basics|2|What color is the complement of blue on the traditional color wheel?|Orange|Yellow|Red|Green
ART|Art Basics|2|What is the term for a light color made by adding white to a hue?|Tint|Shade|Tone|Value
ART|Art Basics|2|What is the term for a darker color made by adding black to a hue?|Shade|Tint|Tone|Chroma
ART|Art Basics|2|What is painting on wet plaster called?|Fresco|Tempera|Gouache|Encaustic
ART|Art Basics|2|What art medium uses pigment mixed with hot wax?|Encaustic|Tempera|Fresco|Pastel
ART|Art Basics|2|What is a painting on a plaster ceiling like the Sistine Chapel mostly done in?|Fresco|Oil on canvas|Watercolor|Acrylic
ART|Art Basics|2|What medium uses pigment suspended in egg yolk?|Tempera|Gouache|Acrylic|Oil
ART|Art Basics|2|What is the term for a picture of a person's face?|Portrait|Landscape|Still life|Mural
ART|Art Basics|2|What is the term for a painting of arranged inanimate objects such as fruit or flowers?|Still life|Landscape|Portrait|Abstract
ART|Art Basics|2|What is the term for a large painting applied directly to a wall?|Mural|Fresco only|Collage|Triptych
ART|Art Basics|2|What is an artwork made of three connected panels called?|Triptych|Diptych|Polyptych|Mural
ART|Art Basics|2|What is an artwork made by gluing materials together called?|Collage|Mosaic|Montage|Assemblage only
ART|Art Basics|2|What is an artwork made of small pieces of colored glass or stone called?|Mosaic|Collage|Fresco|Relief
ART|Art Basics|2|What is the art of beautiful handwriting called?|Calligraphy|Typography|Illumination|Lettering
ART|Art Basics|2|What Japanese art form involves folding paper into shapes?|Origami|Ikebana|Kirigami|Sumi-e
ART|Art Basics|2|What Japanese art form is flower arranging called?|Ikebana|Origami|Bonsai|Kintsugi
ART|Art Basics|2|What Japanese art form repairs broken pottery with gold?|Kintsugi|Ikebana|Raku|Sumi-e
ART|Art Basics|2|What is the term for the art of cutting paper designs, like Mexican papel picado?|Papercutting|Origami|Quilling|Decoupage
ART|Art Basics|2|What art form uses spray paint on walls in public spaces?|Graffiti|Fresco|Collage|Etching
ART|Art Basics|2|Which anonymous British street artist is famous for stenciled works?|Banksy|Shepard Fairey|Keith Haring|Jean-Michel Basquiat
ART|Art Basics|2|Which artist created the "Hope" poster for Barack Obama's 2008 campaign?|Shepard Fairey|Banksy|Keith Haring|Kaws
ART|Art Basics|2|Which artist is known for dripping and pouring paint onto canvases laid on the floor?|Jackson Pollock|Mark Rothko|Willem de Kooning|Franz Kline
ART|Art Basics|2|Which artist painted large fields of color, such as Orange and Yellow?|Mark Rothko|Jackson Pollock|Andy Warhol|Piet Mondrian
ART|Art Basics|2|Which artist is famous for geometric paintings using primary colors and black grid lines?|Piet Mondrian|Wassily Kandinsky|Paul Klee|Kazimir Malevich
ART|Art Basics|2|Which Mexican artist is famous for self-portraits and surreal paintings?|Frida Kahlo|Diego Rivera|José Clemente Orozco|David Siqueiros
ART|Art Basics|2|Which Spanish artist co-founded Cubism?|Pablo Picasso|Salvador Dalí|Joan Miró|Francisco Goya
ART|Art Basics|2|Which Dutch artist cut off part of his own ear?|Vincent van Gogh|Rembrandt|Vermeer|Piet Mondrian
ART|Art Basics|2|Which Italian artist painted the ceiling of the Sistine Chapel?|Michelangelo|Leonardo da Vinci|Raphael|Botticelli
ART|Art Basics|2|Which Renaissance polymath painted the Mona Lisa and designed flying machines?|Leonardo da Vinci|Michelangelo|Raphael|Donatello
ART|Art Basics|2|Which of the Teenage Mutant Ninja Turtles are named after Renaissance artists, except Raphael?|Leonardo, Donatello, Michelangelo|Leonardo, Botticelli, Titian|Donatello, Caravaggio, Titian|Michelangelo, Giotto, Raphael only
ART|Art Basics|2|Which American artist is known for painting giant flowers and desert landscapes in New Mexico?|Georgia O'Keeffe|Frida Kahlo|Mary Cassatt|Helen Frankenthaler
ART|Art Basics|2|Which American painter is known for pointillist-like paintings of everyday life in Norman Rockwell's style?|Norman Rockwell|Edward Hopper|Grant Wood|Andrew Wyeth
ART|Art Basics|2|Which illustrator painted covers for The Saturday Evening Post of small-town American life?|Norman Rockwell|Andy Warhol|Grant Wood|Edward Hopper
ART|Art Basics|2|Which photographer is known for black-and-white landscapes of Yosemite?|Ansel Adams|Dorothea Lange|Annie Leibovitz|Walker Evans
ART|Art Basics|2|Which photographer took the famous Depression-era "Migrant Mother" photograph?|Dorothea Lange|Ansel Adams|Walker Evans|Margaret Bourke-White
ART|Art Basics|2|Which photographer is known for celebrity portraits for Vanity Fair and Rolling Stone?|Annie Leibovitz|Ansel Adams|Diane Arbus|Cindy Sherman
ART|Art Basics|2|Which Atlanta-born painter is known for his portrait of... skip|x|x|x|x
ART|Art Basics|2|Which Georgia-born artist is known for her "Folk Art" and "Finster's Paradise Garden"? skip|x|x|x|x
ART|Mythology|1|Which Greek hero performed twelve labors?|Heracles (Hercules)|Perseus|Theseus|Achilles
ART|Mythology|2|Which Greek hero slayed Medusa?|Perseus|Theseus|Jason|Odysseus
ART|Mythology|2|Which Greek hero defeated the Minotaur in the labyrinth?|Theseus|Perseus|Heracles|Jason
ART|Mythology|2|Which Greek hero led the Argonauts in search of the Golden Fleece?|Jason|Perseus|Theseus|Odysseus
ART|Mythology|2|Which Greek hero's only weakness was his heel?|Achilles|Hector|Ajax|Odysseus
ART|Mythology|2|What did the Greeks use to sneak into Troy?|A wooden horse|A tunnel|A ship|A disguised army of merchants
ART|Mythology|2|Who is the Greek monster with snakes for hair whose gaze turns people to stone?|Medusa|Scylla|Charybdis|Hydra
ART|Mythology|2|What is the name of the three-headed dog guarding the entrance to the underworld?|Cerberus|Fenrir|Anubis|Garm
ART|Mythology|2|Which winged horse sprang from the blood of Medusa?|Pegasus|Sleipnir|Unicorn|Hippogriff
ART|Mythology|2|Which mythical creature is half-man, half-bull?|Minotaur|Centaur|Satyr|Cyclops
ART|Mythology|2|Which mythical creature is half-man, half-horse?|Centaur|Minotaur|Satyr|Faun
ART|Mythology|2|Which mythical creature has the head of a lion and the body of a human... no: The Sphinx asks what riddle in Greek myth?|What walks on four legs, then two, then three?|What has keys but no locks?|What is full of holes but holds water?|What gets wetter as it dries?
ART|Mythology|2|Which Greek mythic king turned everything he touched into gold?|Midas|Croesus|Priam|Minos
ART|Mythology|2|Which Greek youth fell in love with his own reflection?|Narcissus|Adonis|Orpheus|Apollo
ART|Mythology|2|Which Greek boy flew too close to the sun with wax wings?|Icarus|Daedalus|Phaethon|Bellerophon
ART|Mythology|2|Which Titan stole fire from the gods for humanity?|Prometheus|Atlas|Cronus|Epimetheus
ART|Mythology|2|Which Titan was condemned to hold up the sky?|Atlas|Prometheus|Cronus|Hyperion
ART|Mythology|2|Which Greek mortal was forced to roll a boulder uphill forever?|Sisyphus|Tantalus|Ixion|Prometheus
ART|Mythology|2|Which Greek woman opened a jar that released evils into the world?|Pandora|Helen|Persephone|Circe
ART|Mythology|2|Which Greek poet played the lyre so beautifully that he charmed Hades?|Orpheus|Homer|Apollo|Pan
ART|Mythology|2|Which Trojan War figure's face "launched a thousand ships"?|Helen of Troy|Cassandra|Penelope|Andromache
ART|Mythology|2|Which Greek hero spent ten years sailing home from Troy?|Odysseus|Achilles|Agamemnon|Hector
ART|Mythology|2|What is the name of Odysseus's faithful wife?|Penelope|Helen|Circe|Calypso
ART|Mythology|2|Which Norse hero's hammer is named Mjölnir?|Thor|Odin|Loki|Baldr
ART|Mythology|2|What is the name of Odin's eight-legged horse?|Sleipnir|Shadowfax|Pegasus|Bucephalus
ART|Mythology|2|What is the name of the Norse tree of life?|Yggdrasil|Asgard|Bifröst|Valhalla
ART|Mythology|2|What is the name of the Norse hall where slain warriors go?|Valhalla|Asgard|Midgard|Helheim
ART|Mythology|2|What is the name of the realm of humans in Norse mythology?|Midgard|Asgard|Jotunheim|Niflheim
ART|Mythology|2|What are the female warriors who choose the slain in Norse mythology called?|Valkyries|Norns|Sirens|Furies
ART|Mythology|2|Which Egyptian structures were built as tombs for pharaohs?|Pyramids|Obelisks|Ziggurats|Mastabas only
ART|Mythology|2|What is the Egyptian word for the writing system using pictures?|Hieroglyphics|Cuneiform|Runes|Linear B
ART|Mythology|2|Which stone helped scholars decode Egyptian hieroglyphs in 1822?|Rosetta Stone|Sphinx|Obelisk|Cartouche
ART|Mythology|2|What was the name of the Egyptian queen known for beauty and associated with the Bust in Berlin?|Nefertiti|Cleopatra|Hatshepsut|Tiye
ART|Mythology|2|In Roman mythology, who were the twin founders of Rome raised by a wolf?|Romulus and Remus|Castor and Pollux|Aeneas and Dido|Cain and Abel
ART|Mythology|2|In Hindu belief, who is the elephant-headed god?|Ganesha|Shiva|Vishnu|Hanuman
ART|Mythology|2|In Hindu belief, which god is the destroyer within the Trimurti?|Shiva|Vishnu|Brahma|Indra
ART|Mythology|2|In Arthurian legend, what is the name of King Arthur's sword?|Excalibur|Durendal|Joyeuse|Caliburn only
ART|Mythology|2|In Arthurian legend, what is the name of the wizard who advises King Arthur?|Merlin|Gandalf|Morgana|Mordred
ART|Mythology|2|In Arthurian legend, what was the name of King Arthur's court?|Camelot|Avalon|Lyonesse|Tintagel
ART|Mythology|2|In Arthurian legend, what were the knights' round furniture called?|Round Table|Holy Grail|Excalibur|Siege Perilous
ART|Mythology|2|In which legend is the hero Robin Hood based in Sherwood Forest?|Robin Hood|King Arthur|Beowulf|Gilgamesh
ART|Mythology|2|Which ancient epic features a hero named Gilgamesh?|Epic of Gilgamesh|The Odyssey|Beowulf|The Aeneid
ART|Mythology|2|Which Old English epic features a hero who fights a monster named Grendel?|Beowulf|Gilgamesh|The Iliad|The Aeneid
"""

def build():
    artists = sorted({p[1] for p in PAINTINGS}); titles = [p[0] for p in PAINTINGS]
    famous = {"Mona Lisa", "The Starry Night", "The Scream", "The Last Supper", "Sunflowers", "The Persistence of Memory", "Guernica", "The Creation of Adam", "American Gothic", "Girl with a Pearl Earring", "The Kiss", "Campbell's Soup Cans"}
    for t, a, y in PAINTINGS:
        d = 1 if t in famous else 2
        add("ART", "Famous Paintings", d, f"Which artist painted \"{t}\"?", a, pick(artists, a, "pa" + t))
        if y != "-" and t in {"The Starry Night","The Scream","Guernica","The Persistence of Memory","American Gothic","Nighthawks","The Kiss","Campbell's Soup Cans","The Last Supper","The Night Watch","Las Meninas"}:
            y = int(y)
            add("ART", "Famous Paintings", 3, f"In what year did {a} complete \"{t}\"?", y, near_years(y, "py" + t, 5 if y > 1700 else 25))
    sc = sorted({s[1] for s in SCULPTURES})
    for t, a in SCULPTURES:
        if a.startswith("unknown"): continue
        add("ART", "Sculpture", 2, f"Who created the sculpture or monument known as {t}?", a, pick(sc, a, "sc" + t))
    mv = [m[1] for m in MOVEMENTS]
    for m, a in MOVEMENTS:
        add("ART", "Art Movements", 3, f"Which artist is most associated with the {m} movement?" if m not in ("Dada",) else "Which artist is a leading figure of the Dada movement?", a, pick(mv, a, "mv" + m))
    cities = sorted({m[1] for m in MUSEUMS})
    for m, c in MUSEUMS:
        add("ART", "Museums", 2, f"In which city is {m} located?", c, pick(cities, c, "mu" + m))
    arch = sorted({b[1] for b in BUILDINGS})
    for b, a in BUILDINGS:
        add("ART", "Architecture", 3, f"Who designed {b}?", a, pick(arch, a, "ar" + b))
    domains = [g[1] for g in GODS]; romans = [g[2] for g in GODS if g[2] != g[0]]; names = [g[0] for g in GODS]
    for g, d, r in GODS:
        add("ART", "Greek Gods", 2, f"In Greek mythology, {g} is the god or goddess of what?", d, pick(domains, d, "gd" + g))
        add("ART", "Greek Gods", 2, f"Which Greek god or goddess is associated with {d}?", g, pick(names, g, "rgd" + g))
        if r != g:
            add("ART", "Roman Gods", 2, f"What is the Roman name for the Greek deity {g}?", r, pick(romans, r, "rm" + g))
    ne = [n[1] for n in NORSE_EGYPT]
    for n, d in NORSE_EGYPT:
        add("ART", "World Mythology", 2, f"Which deity is known as the {d[0].lower() + d[1:] if not d.startswith(('Norse','Egyptian')) else d}?" if False else f"Which of these best describes {n} in mythology?", d, pick(ne, d, "ne" + n))
    comps = sorted({m[1] for m in MUSICALS})
    for m, c in MUSICALS:
        add("ART", "Musicals", 3, f"Who composed the music for the musical {m}?", c, pick(comps, c, "mc" + m))
    mus = sorted({s[1] for s in SONGS})
    for s, m in SONGS:
        add("ART", "Musicals", 2, f"Which musical features the song {s}?", m, pick(mus, m, "ms" + s))
    cc = sorted({c[1] for c in CLASSICAL})
    for w, c in CLASSICAL:
        add("ART", "Classical Music", 3 if c not in ("Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Pyotr Tchaikovsky") else 2, f"Which composer wrote {w}?", c, pick(cc, c, "cl" + w))
    parse_hand(HAND)
