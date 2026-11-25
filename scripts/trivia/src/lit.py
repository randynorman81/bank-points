from lib import *

# book|author|year|protagonist ("-" if none worth asking)
BOOKS = table("""
To Kill a Mockingbird|Harper Lee|1960|Scout Finch
1984|George Orwell|1949|Winston Smith
Animal Farm|George Orwell|1945|-
The Great Gatsby|F. Scott Fitzgerald|1925|Jay Gatsby
Pride and Prejudice|Jane Austen|1813|Elizabeth Bennet
Emma|Jane Austen|1815|Emma Woodhouse
Sense and Sensibility|Jane Austen|1811|Elinor Dashwood
Moby-Dick|Herman Melville|1851|Ishmael
The Catcher in the Rye|J.D. Salinger|1951|Holden Caulfield
Of Mice and Men|John Steinbeck|1937|George Milton
The Grapes of Wrath|John Steinbeck|1939|Tom Joad
Lord of the Flies|William Golding|1954|Ralph
Brave New World|Aldous Huxley|1932|Bernard Marx
Fahrenheit 451|Ray Bradbury|1953|Guy Montag
The Hobbit|J.R.R. Tolkien|1937|Bilbo Baggins
The Fellowship of the Ring|J.R.R. Tolkien|1954|Frodo Baggins
The Lion, the Witch and the Wardrobe|C.S. Lewis|1950|Lucy Pevensie
Harry Potter and the Philosopher's Stone|J.K. Rowling|1997|Harry Potter
The Hunger Games|Suzanne Collins|2008|Katniss Everdeen
Divergent|Veronica Roth|2011|Tris Prior
The Fault in Our Stars|John Green|2012|Hazel Grace Lancaster
Twilight|Stephenie Meyer|2005|Bella Swan
The Lightning Thief|Rick Riordan|2005|Percy Jackson
Charlotte's Web|E.B. White|1952|Wilbur
Where the Wild Things Are|Maurice Sendak|1963|Max
The Cat in the Hat|Dr. Seuss|1957|-
Green Eggs and Ham|Dr. Seuss|1960|-
The Lorax|Dr. Seuss|1971|-
Matilda|Roald Dahl|1988|Matilda Wormwood
Charlie and the Chocolate Factory|Roald Dahl|1964|Charlie Bucket
James and the Giant Peach|Roald Dahl|1961|James Henry Trotter
The BFG|Roald Dahl|1982|Sophie
Alice's Adventures in Wonderland|Lewis Carroll|1865|Alice
The Wonderful Wizard of Oz|L. Frank Baum|1900|Dorothy Gale
Little Women|Louisa May Alcott|1868|Jo March
Anne of Green Gables|L.M. Montgomery|1908|Anne Shirley
The Secret Garden|Frances Hodgson Burnett|1911|Mary Lennox
Jane Eyre|Charlotte Brontë|1847|Jane Eyre
Wuthering Heights|Emily Brontë|1847|Heathcliff
Great Expectations|Charles Dickens|1861|Pip
A Christmas Carol|Charles Dickens|1843|Ebenezer Scrooge
Oliver Twist|Charles Dickens|1838|Oliver Twist
A Tale of Two Cities|Charles Dickens|1859|Sydney Carton
Frankenstein|Mary Shelley|1818|Victor Frankenstein
Dracula|Bram Stoker|1897|Jonathan Harker
Strange Case of Dr Jekyll and Mr Hyde|Robert Louis Stevenson|1886|Dr. Jekyll
Treasure Island|Robert Louis Stevenson|1883|Jim Hawkins
The Adventures of Tom Sawyer|Mark Twain|1876|Tom Sawyer
Adventures of Huckleberry Finn|Mark Twain|1884|Huckleberry Finn
The Call of the Wild|Jack London|1903|Buck
The Old Man and the Sea|Ernest Hemingway|1952|Santiago
A Farewell to Arms|Ernest Hemingway|1929|Frederic Henry
For Whom the Bell Tolls|Ernest Hemingway|1940|Robert Jordan
The Scarlet Letter|Nathaniel Hawthorne|1850|Hester Prynne
The Adventures of Sherlock Holmes|Arthur Conan Doyle|1892|Sherlock Holmes
The Hound of the Baskervilles|Arthur Conan Doyle|1902|Sherlock Holmes
Murder on the Orient Express|Agatha Christie|1934|Hercule Poirot
Don Quixote|Miguel de Cervantes|1605|Don Quixote
The Count of Monte Cristo|Alexandre Dumas|1844|Edmond Dantès
The Three Musketeers|Alexandre Dumas|1844|D'Artagnan
Les Misérables|Victor Hugo|1862|Jean Valjean
The Hunchback of Notre-Dame|Victor Hugo|1831|Quasimodo
Crime and Punishment|Fyodor Dostoevsky|1866|Raskolnikov
War and Peace|Leo Tolstoy|1869|Pierre Bezukhov
Anna Karenina|Leo Tolstoy|1878|Anna Karenina
The Little Prince|Antoine de Saint-Exupéry|1943|The Little Prince
The Alchemist|Paulo Coelho|1988|Santiago
One Hundred Years of Solitude|Gabriel García Márquez|1967|José Arcadio Buendía
The Kite Runner|Khaled Hosseini|2003|Amir
Life of Pi|Yann Martel|2001|Pi Patel
The Giver|Lois Lowry|1993|Jonas
Hatchet|Gary Paulsen|1987|Brian Robeson
Holes|Louis Sachar|1998|Stanley Yelnats
Bridge to Terabithia|Katherine Paterson|1977|Jess Aarons
Wonder|R.J. Palacio|2012|Auggie Pullman
Diary of a Wimpy Kid|Jeff Kinney|2007|Greg Heffley
Number the Stars|Lois Lowry|1989|Annemarie Johansen
The Outsiders|S.E. Hinton|1967|Ponyboy Curtis
Dune|Frank Herbert|1965|Paul Atreides
Ender's Game|Orson Scott Card|1985|Ender Wiggin
The Handmaid's Tale|Margaret Atwood|1985|Offred
Beloved|Toni Morrison|1987|Sethe
The Color Purple|Alice Walker|1982|Celie
Their Eyes Were Watching God|Zora Neale Hurston|1937|Janie Crawford
Gone with the Wind|Margaret Mitchell|1936|Scarlett O'Hara
Jurassic Park|Michael Crichton|1990|Alan Grant
The Shining|Stephen King|1977|Jack Torrance
The Da Vinci Code|Dan Brown|2003|Robert Langdon
Gone Girl|Gillian Flynn|2012|Amy Dunne
The Help|Kathryn Stockett|2009|Aibileen Clark
Where the Crawdads Sing|Delia Owens|2018|Kya Clark
Goodnight Moon|Margaret Wise Brown|1947|-
The Very Hungry Caterpillar|Eric Carle|1969|-
Winnie-the-Pooh|A.A. Milne|1926|Winnie-the-Pooh
The Wind in the Willows|Kenneth Grahame|1908|Mr. Toad
Black Beauty|Anna Sewell|1877|Black Beauty
Heidi|Johanna Spyri|1881|Heidi
Pinocchio|Carlo Collodi|1883|Pinocchio
Robinson Crusoe|Daniel Defoe|1719|Robinson Crusoe
Gulliver's Travels|Jonathan Swift|1726|Lemuel Gulliver
Around the World in Eighty Days|Jules Verne|1872|Phileas Fogg
Twenty Thousand Leagues Under the Seas|Jules Verne|1870|Captain Nemo
The War of the Worlds|H.G. Wells|1898|-
The Time Machine|H.G. Wells|1895|-
Catch-22|Joseph Heller|1961|Yossarian
Slaughterhouse-Five|Kurt Vonnegut|1969|Billy Pilgrim
On the Road|Jack Kerouac|1957|Sal Paradise
The Bell Jar|Sylvia Plath|1963|Esther Greenwood
A Wrinkle in Time|Madeleine L'Engle|1962|Meg Murry
Hitchhiker's Guide to the Galaxy|Douglas Adams|1979|Arthur Dent
Frankenstein's Monster skip|x|x|x
Percy Jackson skip|x|x|x
The Maze Runner|James Dashner|2009|Thomas
Eragon|Christopher Paolini|2002|Eragon
Artemis Fowl|Eoin Colfer|2001|Artemis Fowl
Island of the Blue Dolphins|Scott O'Dell|1960|Karana
Roll of Thunder, Hear My Cry|Mildred D. Taylor|1976|Cassie Logan
Because of Winn-Dixie|Kate DiCamillo|2000|India Opal Buloni
Tuck Everlasting|Natalie Babbitt|1975|Winnie Foster
Sarah, Plain and Tall|Patricia MacLachlan|1985|Anna
Walk Two Moons|Sharon Creech|1994|Sal
""", 4)
BOOKS = [b for b in BOOKS if "skip" not in b[0]]

AUTHORS_HAND = """
LIT|Authors|1|Who wrote the Harry Potter series?|J.K. Rowling|Stephenie Meyer|Suzanne Collins|Roald Dahl
LIT|Authors|1|Who wrote the plays Romeo and Juliet and Hamlet?|William Shakespeare|Christopher Marlowe|Ben Jonson|Charles Dickens
LIT|Authors|2|Which author created the character Sherlock Holmes?|Arthur Conan Doyle|Agatha Christie|Edgar Allan Poe|Charles Dickens
LIT|Authors|2|Which author wrote "The Raven"?|Edgar Allan Poe|Walt Whitman|Robert Frost|Emily Dickinson
LIT|Authors|2|Which poet wrote "The Road Not Taken"?|Robert Frost|Walt Whitman|Langston Hughes|Carl Sandburg
LIT|Authors|2|Which poet wrote "I, Too" and "The Negro Speaks of Rivers"?|Langston Hughes|Maya Angelou|Paul Laurence Dunbar|Countee Cullen
LIT|Authors|2|Which author wrote "I Know Why the Caged Bird Sings"?|Maya Angelou|Toni Morrison|Alice Walker|Zora Neale Hurston
LIT|Authors|2|Which author wrote "Leaves of Grass"?|Walt Whitman|Emily Dickinson|Ralph Waldo Emerson|Robert Frost
LIT|Authors|2|Which author wrote "The Cat in the Hat" under a pen name?|Dr. Seuss (Theodor Geisel)|Roald Dahl|Shel Silverstein|Maurice Sendak
LIT|Authors|2|Which author wrote "Where the Sidewalk Ends"?|Shel Silverstein|Dr. Seuss|Roald Dahl|Jack Prelutsky
LIT|Authors|2|Which author wrote "The Giving Tree"?|Shel Silverstein|Dr. Seuss|Eric Carle|Mo Willems
LIT|Authors|2|Which author wrote "A Series of Unfortunate Events" under the name Lemony Snicket?|Daniel Handler|Rick Riordan|Eoin Colfer|Neil Gaiman
LIT|Authors|2|Which author wrote "Coraline" and "American Gods"?|Neil Gaiman|Terry Pratchett|Philip Pullman|Stephen King
LIT|Authors|2|Which author wrote "Misery" and "It"?|Stephen King|Dean Koontz|Clive Barker|Anne Rice
LIT|Authors|2|Which author wrote "Game of Thrones" book series A Song of Ice and Fire?|George R.R. Martin|Brandon Sanderson|Patrick Rothfuss|Robert Jordan
LIT|Authors|2|Which author wrote "The Lord of the Rings"?|J.R.R. Tolkien|C.S. Lewis|T.H. White|Terry Pratchett
LIT|Authors|2|Which author wrote "Narnia"?|C.S. Lewis|J.R.R. Tolkien|Lewis Carroll|Roald Dahl
LIT|Authors|3|Which author wrote "Things Fall Apart"?|Chinua Achebe|Wole Soyinka|Ngũgĩ wa Thiong'o|Chimamanda Ngozi Adichie
LIT|Authors|3|Which author wrote "Pride and Prejudice" and "Persuasion"?|Jane Austen|Charlotte Brontë|George Eliot|Virginia Woolf
LIT|Authors|3|Which author wrote "Mrs. Dalloway"?|Virginia Woolf|Jane Austen|George Eliot|Edith Wharton
LIT|Authors|3|Which Georgia-born author wrote "Gone with the Wind"?|Margaret Mitchell|Flannery O'Connor|Carson McCullers|Alice Walker
LIT|Authors|3|Which Georgia-born author wrote "A Good Man Is Hard to Find"?|Flannery O'Connor|Margaret Mitchell|Carson McCullers|Eudora Welty
LIT|Authors|3|Which Georgia-born author wrote "The Heart Is a Lonely Hunter"?|Carson McCullers|Flannery O'Connor|Alice Walker|Margaret Mitchell
LIT|Authors|3|Which Georgia-born author wrote "The Color Purple"?|Alice Walker|Toni Morrison|Maya Angelou|Zora Neale Hurston
LIT|Authors|3|Which Georgia author created the "Uncle Remus" stories?|Joel Chandler Harris|Mark Twain|Erskine Caldwell|Sidney Lanier
LIT|Authors|3|Which Georgia author wrote "Midnight in the Garden of Good and Evil"?|John Berendt|Pat Conroy|Conrad Aiken|Terry Kay
LIT|Authors|2|Which author wrote "The Sound and the Fury"?|William Faulkner|Ernest Hemingway|F. Scott Fitzgerald|John Steinbeck
LIT|Authors|2|Which Southern author wrote "To Kill a Mockingbird" and was friends with Truman Capote?|Harper Lee|Eudora Welty|Flannery O'Connor|Zora Neale Hurston
LIT|Authors|3|Which author wrote "In Cold Blood" and "Breakfast at Tiffany's"?|Truman Capote|Harper Lee|Norman Mailer|Tennessee Williams
LIT|Authors|3|Which playwright wrote "A Streetcar Named Desire"?|Tennessee Williams|Arthur Miller|Eugene O'Neill|Edward Albee
LIT|Authors|3|Which playwright wrote "Death of a Salesman" and "The Crucible"?|Arthur Miller|Tennessee Williams|Eugene O'Neill|August Wilson
LIT|Authors|3|Which playwright wrote "Our Town"?|Thornton Wilder|Arthur Miller|Eugene O'Neill|Neil Simon
LIT|Authors|3|Which playwright wrote "A Raisin in the Sun"?|Lorraine Hansberry|August Wilson|Ntozake Shange|Alice Childress
LIT|Awards|2|What is the prestigious American award for fiction, journalism and music called?|Pulitzer Prize|Booker Prize|National Book Award|Hugo Award
LIT|Awards|2|Which award is given annually for the best children's book in the U.S.?|Newbery Medal|Caldecott Medal|Pulitzer Prize|Hugo Award
LIT|Awards|2|Which medal is given for the best American picture book illustration?|Caldecott Medal|Newbery Medal|Printz Award|Coretta Scott King Award
LIT|Awards|3|Which British literary prize is awarded annually for the best English-language novel?|Booker Prize|Pulitzer Prize|Hugo Award|Nebula Award
LIT|Awards|3|Which award is given for the best science fiction or fantasy work?|Hugo Award|Pulitzer Prize|Newbery Medal|Edgar Award
LIT|Awards|3|Which award honors the best mystery fiction?|Edgar Award|Hugo Award|Nebula Award|Booker Prize
LIT|Awards|2|Which Nobel Prize category do authors compete for?|Literature|Peace|Physics|Chemistry
LIT|Awards|3|Which musician won the Nobel Prize in Literature in 2016?|Bob Dylan|Leonard Cohen|Paul Simon|Bruce Springsteen
LIT|Shakespeare|1|In which Shakespeare play do the "star-cross'd lovers" Romeo and Juliet appear?|Romeo and Juliet|Othello|Macbeth|Hamlet
LIT|Shakespeare|2|In which Shakespeare play does a prince seek revenge for his father's murder by Claudius?|Hamlet|Macbeth|King Lear|Othello
LIT|Shakespeare|2|Which Shakespeare play features three witches and a Scottish king?|Macbeth|Hamlet|King Lear|The Tempest
LIT|Shakespeare|2|Which Shakespeare play features a sorcerer on an island named Prospero?|The Tempest|A Midsummer Night's Dream|Twelfth Night|The Winter's Tale
LIT|Shakespeare|2|Which Shakespeare comedy features fairies including Puck and Titania?|A Midsummer Night's Dream|Much Ado About Nothing|As You Like It|The Merchant of Venice
LIT|Shakespeare|2|Which Shakespeare play features the villain Iago?|Othello|Macbeth|Hamlet|King Lear
LIT|Shakespeare|3|Which Shakespeare play features Shylock?|The Merchant of Venice|Othello|Twelfth Night|The Tempest
LIT|Shakespeare|2|Which Shakespeare character says "To be, or not to be"?|Hamlet|Macbeth|Othello|Romeo
LIT|Shakespeare|3|What is the name of the theater where many of Shakespeare's plays were performed in London?|The Globe|The Rose|The Old Vic|The Royal Albert Hall
LIT|Shakespeare|2|In what English town was Shakespeare born?|Stratford-upon-Avon|London|Oxford|Canterbury
LIT|Shakespeare|3|How many lines are in a Shakespearean sonnet?|14|12|16|10
LIT|Shakespeare|3|What is the term for a verse of ten syllables with five stressed beats used by Shakespeare?|Iambic pentameter|Dactylic hexameter|Trochaic tetrameter|Free verse
LIT|Shakespeare|2|Which Shakespeare play is set in Verona, Italy?|Romeo and Juliet|Othello|The Taming of the Shrew|Julius Caesar
LIT|Shakespeare|2|Which Roman leader was betrayed by his friend Brutus in Shakespeare's play?|Julius Caesar|Augustus|Mark Antony|Cicero
LIT|Shakespeare|3|Which Shakespeare play inspired the musical West Side Story?|Romeo and Juliet|Hamlet|Othello|Macbeth
LIT|Shakespeare|3|Which Shakespeare play inspired the movie "10 Things I Hate About You"?|The Taming of the Shrew|Much Ado About Nothing|Twelfth Night|As You Like It
LIT|Shakespeare|3|Which Shakespeare play inspired Disney's The Lion King?|Hamlet|Macbeth|King Lear|The Tempest
LIT|Genre|2|What is a story that uses characters and events to represent deeper meanings called?|Allegory|Satire|Parody|Fable
LIT|Genre|2|What is the term for a short story with a moral, often featuring animals?|Fable|Epic|Sonnet|Memoir
LIT|Genre|2|What is the term for a 14-line poem?|Sonnet|Haiku|Limerick|Ode
LIT|Genre|2|How many syllables are in a traditional haiku?|17|14|12|20
LIT|Genre|2|How many lines are in a limerick?|5|4|6|3
LIT|Genre|2|What is the term for a long narrative poem about a hero, like The Odyssey?|Epic|Ode|Elegy|Ballad
LIT|Genre|2|What is the term for the main character who opposes the protagonist?|Antagonist|Foil|Narrator|Mentor
LIT|Genre|2|What is the term for the turning point or highest tension in a story?|Climax|Exposition|Resolution|Conflict
LIT|Genre|2|What is the term for repeating the same consonant sounds at the start of nearby words?|Alliteration|Assonance|Onomatopoeia|Hyperbole
LIT|Genre|2|What is the term for a word that imitates a sound, such as "buzz"?|Onomatopoeia|Alliteration|Metaphor|Simile
LIT|Genre|2|What is the term for a comparison using "like" or "as"?|Simile|Metaphor|Personification|Hyperbole
LIT|Genre|2|What is the term for an extreme exaggeration for effect?|Hyperbole|Irony|Understatement|Oxymoron
LIT|Genre|2|What is the term for a phrase that combines contradictory terms, like "deafening silence"?|Oxymoron|Paradox|Irony|Metaphor
LIT|Genre|2|What is the term for giving human qualities to non-human things?|Personification|Metaphor|Simile|Allegory
LIT|Genre|3|What is the narrative point of view that uses "I"?|First person|Second person|Third person limited|Omniscient
LIT|Genre|3|What do we call a hint or clue about what will happen later in a story?|Foreshadowing|Flashback|Irony|Symbolism
LIT|Genre|2|What is the term for a nonfiction account of someone's life written by that person?|Autobiography|Biography|Memoir only|Diary
LIT|Genre|2|Which genre includes works like Dune, Foundation and 2001: A Space Odyssey?|Science fiction|Fantasy|Mystery|Romance
LIT|Genre|2|What does "YA" stand for in book categories?|Young Adult|Yearly Annual|Youth Archive|Young Author
LIT|Genre|2|What decimal system is used by many libraries to organize nonfiction books?|Dewey Decimal System|Library of Congress only|Zip code system|Alphabetic system
LIT|Genre|3|What is the name of the largest library in the world by collection, located in Washington, D.C.?|Library of Congress|New York Public Library|British Library|National Archives
LIT|Genre|2|What is the first book of the Bible?|Genesis|Exodus|Matthew|Psalms
LIT|Genre|2|What is the first book of the New Testament?|Matthew|Genesis|John|Acts
LIT|Genre|2|Who wrote the epic poems The Iliad and The Odyssey, according to tradition?|Homer|Virgil|Sophocles|Aesop
LIT|Genre|2|Who wrote the epic poem Inferno, part of the Divine Comedy?|Dante Alighieri|Petrarch|Boccaccio|Virgil
LIT|Genre|2|Who wrote the epic poem Paradise Lost?|John Milton|John Donne|Alexander Pope|Geoffrey Chaucer
LIT|Genre|3|Who wrote The Canterbury Tales?|Geoffrey Chaucer|William Langland|John Milton|Edmund Spenser
LIT|Genre|2|Which Greek storyteller is credited with fables such as "The Tortoise and the Hare"?|Aesop|Homer|Plato|Herodotus
LIT|Genre|2|Which two brothers collected fairy tales including "Hansel and Gretel"?|The Brothers Grimm|The Wright Brothers|The Brothers Karamazov|The Brothers Hardy
LIT|Genre|2|Which Danish author wrote "The Little Mermaid" and "The Ugly Duckling"?|Hans Christian Andersen|The Brothers Grimm|Charles Perrault|Aesop
LIT|Genre|2|Which French author wrote Cinderella and Sleeping Beauty versions in the 1600s?|Charles Perrault|Victor Hugo|Jules Verne|Alexandre Dumas
LIT|Genre|2|Which book series follows the Boxcar Children?|The Boxcar Children|Nancy Drew|The Hardy Boys|Goosebumps
LIT|Genre|2|Which book series features the girl detective Nancy Drew?|Nancy Drew|Hardy Boys|Babysitters Club|Magic Tree House
LIT|Genre|2|Which children's series features siblings Jack and Annie traveling in a tree house?|Magic Tree House|Boxcar Children|Junie B. Jones|Percy Jackson
LIT|Genre|2|Which horror book series for kids was written by R.L. Stine?|Goosebumps|Scary Stories to Tell in the Dark|Fear Street only|Animorphs
LIT|Genre|2|Which graphic novel by Art Spiegelman depicts the Holocaust with mice and cats?|Maus|Persepolis|Watchmen|Fun Home
LIT|Genre|2|Which comic book creator co-created Spider-Man and the X-Men?|Stan Lee|Jack Kirby|Steve Ditko|Bob Kane
LIT|Genre|2|Which comic strip features a boy named Charlie Brown and a dog named Snoopy?|Peanuts|Garfield|Calvin and Hobbes|Dilbert
LIT|Genre|2|Which comic strip features a lasagna-loving orange cat?|Garfield|Heathcliff|Peanuts|Marmaduke
LIT|Genre|2|Which comic strip features a boy and his tiger?|Calvin and Hobbes|Peanuts|Garfield|Zits
LIT|Genre|2|Who wrote the comic strip Peanuts?|Charles M. Schulz|Jim Davis|Bill Watterson|Gary Larson
LIT|Genre|2|Which Dr. Seuss character hates Christmas and steals presents in Whoville?|The Grinch|The Lorax|Horton|Sam-I-Am
LIT|Genre|2|Which Dr. Seuss character speaks for the trees?|The Lorax|The Grinch|Horton|Yertle
"""

def build():
    authors = sorted({b[1] for b in BOOKS}); titles = [b[0] for b in BOOKS]
    prots = sorted({b[3] for b in BOOKS if b[3] != "-"})
    famous = {"To Kill a Mockingbird", "1984", "The Great Gatsby", "Pride and Prejudice", "The Hobbit", "Harry Potter and the Philosopher's Stone", "The Hunger Games", "Charlotte's Web", "Matilda", "Charlie and the Chocolate Factory", "Alice's Adventures in Wonderland", "The Wonderful Wizard of Oz", "Little Women", "Frankenstein", "Dracula", "Moby-Dick", "A Christmas Carol", "The Cat in the Hat", "Green Eggs and Ham", "The Lorax", "Twilight", "Animal Farm", "Romeo and Juliet", "The Adventures of Tom Sawyer", "Adventures of Huckleberry Finn"}
    import collections
    pc = collections.Counter(b[3] for b in BOOKS)
    for t, a, y, p in BOOKS:
        y = int(y)
        d = 1 if t in famous else 2
        add("LIT", "Authors", d, f"Who wrote the book {t}?", a, pick(authors, a, "la" + t))
        add("LIT", "Book Years", 3, f"In what year was {a}'s {t} first published?", y, near_years(y, "ly" + t, 5 if y > 1800 else 30))
        if p != "-" and pc[p] == 1:
            add("LIT", "Characters", d + 1 if d < 3 else 3, f"Which novel features the main character {p}?" if t != p else f"{p} is the title character of which author's novel?", t if t != p else a, pick(titles if t != p else authors, t if t != p else a, "lp" + t))
    parse_hand(AUTHORS_HAND)
