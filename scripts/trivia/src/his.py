from lib import *

PRES = table("""
1|George Washington|1789
2|John Adams|1797
3|Thomas Jefferson|1801
4|James Madison|1809
5|James Monroe|1817
6|John Quincy Adams|1825
7|Andrew Jackson|1829
8|Martin Van Buren|1837
9|William Henry Harrison|1841
10|John Tyler|1841
11|James K. Polk|1845
12|Zachary Taylor|1849
13|Millard Fillmore|1850
14|Franklin Pierce|1853
15|James Buchanan|1857
16|Abraham Lincoln|1861
17|Andrew Johnson|1865
18|Ulysses S. Grant|1869
19|Rutherford B. Hayes|1877
20|James A. Garfield|1881
21|Chester A. Arthur|1881
23|Benjamin Harrison|1889
25|William McKinley|1897
26|Theodore Roosevelt|1901
27|William Howard Taft|1909
28|Woodrow Wilson|1913
29|Warren G. Harding|1921
30|Calvin Coolidge|1923
31|Herbert Hoover|1929
32|Franklin D. Roosevelt|1933
33|Harry S. Truman|1945
34|Dwight D. Eisenhower|1953
35|John F. Kennedy|1961
36|Lyndon B. Johnson|1963
37|Richard Nixon|1969
38|Gerald Ford|1974
39|Jimmy Carter|1977
40|Ronald Reagan|1981
41|George H. W. Bush|1989
42|Bill Clinton|1993
43|George W. Bush|2001
44|Barack Obama|2009
45|Donald Trump|2017
46|Joe Biden|2021
""", 3)

def ordinal(n):
    n = int(n)
    return "%d%s" % (n, "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th"))

# events: clause that completes "In what year did ..." | year
EVENTS = table("""
the Declaration of Independence get adopted|1776
the United States Constitution get signed|1787
the Louisiana Purchase take place|1803
the War of 1812 begin|1812
the California Gold Rush begin|1848
the American Civil War begin|1861
Abraham Lincoln give the Gettysburg Address|1863
the Civil War end|1865
President Lincoln get assassinated|1865
the Statue of Liberty get dedicated|1886
the Wright brothers make their first powered flight|1903
the Titanic sink|1912
World War I begin|1914
the United States enter World War I|1917
World War I end|1918
the 19th Amendment give women the right to vote|1920
the stock market crash that began the Great Depression happen|1929
Pearl Harbor get attacked|1941
D-Day take place|1944
World War II end|1945
the United Nations get founded|1945
India gain independence from Britain|1947
the Korean War begin|1950
Rosa Parks refuse to give up her bus seat|1955
the Soviet Union launch Sputnik|1957
the Cuban Missile Crisis take place|1962
President Kennedy get assassinated|1963
Martin Luther King Jr. give his "I Have a Dream" speech|1963
the Civil Rights Act get signed|1964
Martin Luther King Jr. get assassinated|1968
Apollo 11 land on the Moon|1969
the Watergate break-in happen|1972
the Vietnam War end for the United States|1975
the Berlin Wall fall|1989
the Soviet Union dissolve|1991
the September 11 attacks occur|2001
Barack Obama get elected president|2008
the first iPhone get released|2007
the Great Fire of London happen|1666
the Pilgrims land at Plymouth Rock|1620
Columbus first reach the Americas|1492
Jamestown get founded|1607
the Boston Tea Party take place|1773
the French Revolution begin|1789
Napoleon get defeated at Waterloo|1815
the Battle of Hastings take place|1066
the Magna Carta get sealed|1215
the Black Death reach Europe|1347
Gutenberg print his first Bible|1455
Martin Luther post his Ninety-Five Theses|1517
the Spanish Armada get defeated|1588
the Mayflower set sail|1620
the Great Chicago Fire occur|1871
the telephone get patented|1876
Thomas Edison demonstrate his practical light bulb|1879
the Panama Canal open|1914
the Russian Revolution take place|1917
the Treaty of Versailles get signed|1919
Hitler become Chancellor of Germany|1933
the atomic bomb get dropped on Hiroshima|1945
the State of Israel get established|1948
the People's Republic of China get founded|1949
the Suez Crisis occur|1956
the Berlin Wall go up|1961
the Beatles first appear on The Ed Sullivan Show|1964
the Woodstock festival take place|1969
the first email get sent by Ray Tomlinson|1971
Nixon resign the presidency|1974
the Iranian Revolution take place|1979
the Challenger space shuttle disaster happen|1986
the Chernobyl nuclear disaster occur|1986
Nelson Mandela get released from prison|1990
the Gulf War begin|1990
Nelson Mandela become president of South Africa|1994
the Euro currency get introduced as electronic money|1999
the Atlanta Olympics take place|1996
Hurricane Katrina hit the Gulf Coast|2005
the Great Recession begin with the housing crash|2008
the COVID-19 pandemic get declared by the WHO|2020
the January 6 attack on the U.S. Capitol happen|2021
the first Harry Potter book get published in the UK|1997
Facebook get launched|2004
YouTube get founded|2005
Twitter get launched|2006
Google get founded|1998
Amazon get founded|1994
Apple get founded|1976
Microsoft get founded|1975
the first Super Bowl get played|1967
Jackie Robinson break baseball's color barrier|1947
the first modern Olympic Games take place in Athens|1896
the Wall Street Crash of 1929 happen|1929
the Lewis and Clark expedition begin|1804
the Emancipation Proclamation take effect|1863
the Mexican–American War begin|1846
the Spanish–American War take place|1898
the Alaska Purchase happen|1867
the transcontinental railroad get completed|1869
Texas become part of the United States|1845
the Wright brothers' first flight happen at Kitty Hawk|1903
Lindbergh fly solo across the Atlantic|1927
the Hindenburg disaster happen|1937
Amelia Earhart disappear|1937
the Dust Bowl begin|1930
Brown v. Board of Education get decided|1954
the Montgomery bus boycott begin|1955
the March on Washington take place|1963
the Voting Rights Act get signed|1965
the first heart transplant get performed|1967
Neil Armstrong take his first step on the Moon|1969
the first test-tube baby get born|1978
the first Space Shuttle launch happen|1981
the Hubble Space Telescope launch|1990
Dolly the sheep get cloned|1996
the Human Genome Project finish|2003
the Space Shuttle Columbia disaster take place|2003
the Titanic's wreck get discovered|1985
the Eiffel Tower open|1889
the Brooklyn Bridge open|1883
the Golden Gate Bridge open|1937
the Empire State Building open|1931
the Hoover Dam get completed|1936
the Great Depression end with the start of World War II spending, by many accounts|1939
Ford introduce the Model T|1908
the first Academy Awards ceremony take place|1929
the first Star Wars movie premiere|1977
Elvis Presley die|1977
John Lennon get killed|1980
Princess Diana die|1997
the Berlin Wall get officially opened to the public|1989
the Rwandan genocide happen|1994
the Good Friday Agreement get signed|1998
the Brexit referendum take place|2016
""", 2)

HAND = """
HIS|U.S. History|1|Who was the first President of the United States?|George Washington|Thomas Jefferson|John Adams|Benjamin Franklin
HIS|U.S. History|1|Who wrote most of the Declaration of Independence?|Thomas Jefferson|Benjamin Franklin|John Adams|George Washington
HIS|U.S. History|2|Which president is on the $5 bill?|Abraham Lincoln|Alexander Hamilton|Ulysses S. Grant|Andrew Jackson
HIS|U.S. History|2|Which president is on the $20 bill?|Andrew Jackson|Ulysses S. Grant|Thomas Jefferson|Abraham Lincoln
HIS|U.S. History|2|Which president is on the $50 bill?|Ulysses S. Grant|Andrew Jackson|Benjamin Franklin|James Madison
HIS|U.S. History|2|Which founding father is on the $10 bill?|Alexander Hamilton|Benjamin Franklin|John Jay|James Madison
HIS|U.S. History|2|Which founding father is on the $100 bill?|Benjamin Franklin|Alexander Hamilton|John Adams|Thomas Jefferson
HIS|U.S. History|2|Who was the only U.S. president to serve more than two terms?|Franklin D. Roosevelt|Theodore Roosevelt|Ulysses S. Grant|Woodrow Wilson
HIS|U.S. History|2|Which president was known as the "Great Emancipator"?|Abraham Lincoln|Ulysses S. Grant|Andrew Johnson|Thomas Jefferson
HIS|U.S. History|3|Who was the only U.S. president to resign from office?|Richard Nixon|Andrew Johnson|Herbert Hoover|Gerald Ford
HIS|U.S. History|2|Which president created the New Deal?|Franklin D. Roosevelt|Herbert Hoover|Harry Truman|Woodrow Wilson
HIS|U.S. History|2|Which president dropped the atomic bombs to end World War II?|Harry S. Truman|Franklin D. Roosevelt|Dwight Eisenhower|Herbert Hoover
HIS|U.S. History|3|Which president is on Mount Rushmore besides Washington, Jefferson and Lincoln?|Theodore Roosevelt|Franklin Roosevelt|Ulysses S. Grant|Andrew Jackson
HIS|U.S. History|2|Who was the first president born in Georgia?|Jimmy Carter|Lyndon Johnson|Woodrow Wilson|Bill Clinton
HIS|U.S. History|2|Who was the first Black president of the United States?|Barack Obama|Colin Powell|Jesse Jackson|Bill Clinton
HIS|U.S. History|2|Who was the first woman to serve as Vice President of the United States?|Kamala Harris|Geraldine Ferraro|Hillary Clinton|Nancy Pelosi
HIS|U.S. History|2|Who was the first woman on the U.S. Supreme Court?|Sandra Day O'Connor|Ruth Bader Ginsburg|Sonia Sotomayor|Elena Kagan
HIS|U.S. History|2|Which document begins with "We the People"?|The Constitution|The Declaration of Independence|The Bill of Rights|The Gettysburg Address
HIS|U.S. History|2|How many amendments are in the Bill of Rights?|10|12|13|27
HIS|U.S. History|2|Which amendment guarantees freedom of speech?|First Amendment|Second Amendment|Fifth Amendment|Tenth Amendment
HIS|U.S. History|2|Which amendment gave women the right to vote?|19th Amendment|15th Amendment|13th Amendment|21st Amendment
HIS|U.S. History|2|Which amendment abolished slavery?|13th Amendment|14th Amendment|15th Amendment|19th Amendment
HIS|U.S. History|2|Which amendment ended Prohibition?|21st Amendment|18th Amendment|19th Amendment|22nd Amendment
HIS|U.S. History|2|Which amendment lowered the voting age to 18?|26th Amendment|19th Amendment|24th Amendment|21st Amendment
HIS|U.S. History|2|What was the first capital of the United States under the Constitution?|New York City|Philadelphia|Washington, D.C.|Boston
HIS|U.S. History|2|Who was the first Secretary of the Treasury?|Alexander Hamilton|Thomas Jefferson|Benjamin Franklin|John Jay
HIS|U.S. History|2|Which Native American woman helped guide Lewis and Clark?|Sacagawea|Pocahontas|Sitting Bull|Squanto
HIS|U.S. History|3|Which Native American leader led the Nez Perce on a famous retreat in 1877?|Chief Joseph|Geronimo|Crazy Horse|Sitting Bull
HIS|U.S. History|3|Which Native American leader defeated Custer at the Battle of Little Bighorn?|Sitting Bull and Crazy Horse|Geronimo|Cochise|Red Cloud
HIS|U.S. History|2|What was the name of the ship that carried the Pilgrims to America?|Mayflower|Santa Maria|Nina|Susan Constant
HIS|U.S. History|2|Who is known as the "Father of the Constitution"?|James Madison|Thomas Jefferson|George Washington|Alexander Hamilton
HIS|U.S. History|2|Who was the Confederate president during the Civil War?|Jefferson Davis|Robert E. Lee|Stonewall Jackson|P. G. T. Beauregard
HIS|U.S. History|2|Which battle is considered the turning point of the Civil War, in July 1863?|Gettysburg|Antietam|Bull Run|Vicksburg
HIS|U.S. History|2|Which Union general led the march to the sea through Georgia?|William T. Sherman|Ulysses S. Grant|George McClellan|George Meade
HIS|U.S. History|2|Which Georgia city did Sherman capture and burn in 1864?|Atlanta|Savannah|Macon|Augusta
HIS|U.S. History|2|Who escaped slavery and led others to freedom on the Underground Railroad?|Harriet Tubman|Sojourner Truth|Rosa Parks|Frederick Douglass
HIS|U.S. History|2|Who was the prominent abolitionist and author of the "Narrative of the Life of Frederick Douglass"?|Frederick Douglass|Booker T. Washington|W.E.B. Du Bois|Nat Turner
HIS|U.S. History|2|Which civil rights leader was born in Atlanta in 1929?|Martin Luther King Jr.|Malcolm X|John Lewis|Medgar Evers
HIS|U.S. History|2|Which civil rights activist was the first Black student to integrate Little Rock Central High School?|The Little Rock Nine|Ruby Bridges|Rosa Parks|Claudette Colvin
HIS|U.S. History|2|Who as a six-year-old integrated an all-white New Orleans elementary school in 1960?|Ruby Bridges|Rosa Parks|Claudette Colvin|Coretta Scott King
HIS|U.S. History|2|Which Supreme Court justice became the first Black justice in 1967?|Thurgood Marshall|Clarence Thomas|John Lewis|Earl Warren
HIS|U.S. History|2|Which U.S. city hosted the famous 1963 March on Washington?|Washington, D.C.|Atlanta|Montgomery|Selma
HIS|U.S. History|3|The 1965 marches for voting rights went from Selma to which Alabama city?|Montgomery|Birmingham|Mobile|Tuskegee
HIS|U.S. History|2|What was the name of the program that put Americans on the Moon from 1961 to 1972?|Apollo program|Gemini program|Mercury program|Artemis program
HIS|U.S. History|2|Who was the first American to orbit the Earth?|John Glenn|Alan Shepard|Neil Armstrong|Buzz Aldrin
HIS|U.S. History|2|What was the name of the 1862 act that gave settlers 160 acres of western land?|Homestead Act|Louisiana Purchase|Morrill Act|Pacific Railway Act
HIS|U.S. History|2|What was the economic hardship of the 1930s called?|Great Depression|Gilded Age|Panic of 1907|Roaring Twenties
HIS|U.S. History|2|What was the 1920s ban on alcohol called?|Prohibition|Temperance|Volstead|Repeal
HIS|U.S. History|3|Which gangster ran Chicago's bootlegging operations during Prohibition?|Al Capone|John Dillinger|Lucky Luciano|Bugsy Siegel
HIS|U.S. History|2|What was the code name for the U.S. program to build the first atomic bomb?|Manhattan Project|Apollo Project|Trinity Project|Overlord
HIS|U.S. History|2|What was the Allied invasion of Normandy known as?|D-Day|V-E Day|Blitz|Operation Torch
HIS|U.S. History|2|What was the name of the plane that dropped the atomic bomb on Hiroshima?|Enola Gay|Memphis Belle|Spirit of St. Louis|Bockscar
HIS|U.S. History|3|What was the name of the 1941 act that allowed the U.S. to supply Allies with war materials?|Lend-Lease Act|Marshall Plan|Truman Doctrine|Neutrality Act
HIS|U.S. History|2|What was the name of the U.S. plan to rebuild Western Europe after World War II?|Marshall Plan|New Deal|Fair Deal|Truman Doctrine
HIS|U.S. History|2|Which president sent troops to Little Rock in 1957 to enforce integration?|Dwight Eisenhower|John F. Kennedy|Harry Truman|Lyndon Johnson
HIS|U.S. History|2|Which president announced the Great Society programs?|Lyndon B. Johnson|John F. Kennedy|Richard Nixon|Jimmy Carter
HIS|U.S. History|2|Which president visited China in 1972?|Richard Nixon|Jimmy Carter|Gerald Ford|Ronald Reagan
HIS|U.S. History|2|Which president said "Mr. Gorbachev, tear down this wall!"?|Ronald Reagan|George H. W. Bush|Jimmy Carter|Gerald Ford
HIS|World History|1|Which ancient civilization built the pyramids at Giza?|Egyptians|Romans|Greeks|Mayans
HIS|World History|2|Which ancient civilization is credited with inventing democracy?|Greeks (Athens)|Romans|Egyptians|Persians
HIS|World History|2|Who was the first emperor of Rome?|Augustus|Julius Caesar|Nero|Caligula
HIS|World History|2|Who was famously assassinated on the Ides of March in 44 BC?|Julius Caesar|Augustus|Mark Antony|Cicero
HIS|World History|2|Which Carthaginian general crossed the Alps with elephants?|Hannibal|Scipio|Hamilcar|Hasdrubal
HIS|World History|2|Which Macedonian king conquered much of the known world by age 30?|Alexander the Great|Philip II|Darius III|Leonidas
HIS|World History|2|Which Egyptian queen allied with Julius Caesar and Mark Antony?|Cleopatra VII|Nefertiti|Hatshepsut|Ankhesenamun
HIS|World History|3|Which Egyptian pharaoh's tomb was discovered nearly intact in 1922?|Tutankhamun|Ramses II|Khufu|Akhenaten
HIS|World History|2|Which Chinese dynasty built much of the Great Wall that tourists see today?|Ming dynasty|Han dynasty|Qin dynasty|Tang dynasty
HIS|World History|3|Who was the first emperor to unify China in 221 BC?|Qin Shi Huang|Kublai Khan|Liu Bang|Sun Yat-sen
HIS|World History|2|Who founded the Mongol Empire?|Genghis Khan|Kublai Khan|Attila|Tamerlane
HIS|World History|2|Which explorer is credited with sailing around the southern tip of Africa to reach India for Portugal?|Vasco da Gama|Ferdinand Magellan|Bartolomeu Dias|Christopher Columbus
HIS|World History|2|Whose expedition was the first to circumnavigate the globe?|Ferdinand Magellan (completed by Elcano)|Christopher Columbus|Vasco da Gama|Francis Drake
HIS|World History|2|Which conquistador conquered the Aztec Empire?|Hernán Cortés|Francisco Pizarro|Ponce de León|Hernando de Soto
HIS|World History|2|Which conquistador conquered the Inca Empire?|Francisco Pizarro|Hernán Cortés|Vasco Núñez de Balboa|Juan Ponce de León
HIS|World History|2|Which explorer is credited with sailing under Spain to the Americas in 1492?|Christopher Columbus|Amerigo Vespucci|John Cabot|Leif Erikson
HIS|World History|2|Which Viking explorer is credited with reaching North America around the year 1000?|Leif Erikson|Erik the Red|Ragnar Lothbrok|Harald Hardrada
HIS|World History|2|Which queen of England defeated the Spanish Armada?|Elizabeth I|Victoria|Mary I|Anne
HIS|World History|2|Which English king had six wives?|Henry VIII|Edward VI|Richard III|Charles II
HIS|World History|2|Which British queen reigned for 63 years until 1901?|Victoria|Elizabeth II|Anne|Elizabeth I
HIS|World History|2|Who is the longest-reigning British monarch in history?|Elizabeth II|Victoria|George III|Henry VIII
HIS|World History|2|Which French leader crowned himself Emperor in 1804?|Napoleon Bonaparte|Louis XVI|Charles de Gaulle|Robespierre
HIS|World History|2|Which French queen is famously (and probably falsely) quoted as saying "Let them eat cake"?|Marie Antoinette|Catherine de' Medici|Joséphine|Eleanor of Aquitaine
HIS|World History|2|What was the name of the prison stormed on July 14, 1789?|The Bastille|Alcatraz|Tower of London|Château d'If
HIS|World History|2|Which Russian ruler was known as "the Great" and founded St. Petersburg?|Peter the Great|Ivan the Terrible|Nicholas II|Alexander II
HIS|World History|2|Who was the last Tsar of Russia?|Nicholas II|Alexander III|Peter III|Ivan VI
HIS|World History|2|Who led the Bolshevik Revolution?|Vladimir Lenin|Joseph Stalin|Leon Trotsky|Nikita Khrushchev
HIS|World History|2|Who led the Soviet Union during World War II?|Joseph Stalin|Vladimir Lenin|Nikita Khrushchev|Leonid Brezhnev
HIS|World History|2|Which British Prime Minister led the UK through most of World War II?|Winston Churchill|Neville Chamberlain|Clement Attlee|Margaret Thatcher
HIS|World History|2|Which German dictator led the Nazi Party?|Adolf Hitler|Otto von Bismarck|Erich Ludendorff|Wilhelm II
HIS|World History|2|What was the name for the Nazi program of systematic genocide of six million Jews?|The Holocaust|The Blitz|The Anschluss|The Reichstag fire
HIS|World History|2|Which girl's diary documents hiding from the Nazis in Amsterdam?|Anne Frank|Malala Yousafzai|Ruby Bridges|Helen Keller
HIS|World History|2|Who led India's nonviolent independence movement?|Mahatma Gandhi|Jawaharlal Nehru|Subhas Chandra Bose|Muhammad Ali Jinnah
HIS|World History|2|Who was South Africa's first Black president, elected in 1994?|Nelson Mandela|Desmond Tutu|Thabo Mbeki|Jacob Zuma
HIS|World History|2|What system of racial segregation was legally enforced in South Africa until the early 1990s?|Apartheid|Jim Crow|Colonialism|Segregation Act
HIS|World History|2|Who was the first woman to win a Nobel Prize?|Marie Curie|Mother Teresa|Jane Addams|Pearl Buck
HIS|World History|2|Which pandemic killed an estimated 25 to 50 million Europeans in the 14th century?|Black Death|Spanish flu|Cholera|Smallpox
HIS|World History|2|The medieval period is also known as the what?|Middle Ages|Renaissance|Enlightenment|Dark Ages only
HIS|World History|2|Which Italian city is considered the birthplace of the Renaissance?|Florence|Rome|Venice|Milan
HIS|World History|3|Which family were the powerful patrons of Renaissance Florence?|The Medici|The Borgia|The Sforza|The Este
HIS|World History|2|Which invention by Johannes Gutenberg helped spread the Renaissance and Reformation?|Printing press|Steam engine|Compass|Telescope
HIS|World History|2|Which event in 1914 sparked World War I?|Assassination of Archduke Franz Ferdinand|Sinking of the Lusitania|Invasion of Poland|Zimmermann Telegram
HIS|World History|2|Which treaty ended World War I?|Treaty of Versailles|Treaty of Paris|Treaty of Ghent|Treaty of Tordesillas
HIS|World History|2|Which wall divided East and West Berlin?|The Berlin Wall|Hadrian's Wall|The Great Wall|Atlantic Wall
HIS|World History|2|The Cold War was primarily a rivalry between the U.S. and which nation?|Soviet Union|China|Germany|Cuba
HIS|World History|2|What was the name of the ship on which the Declaration... no: What was the name of the "unsinkable" ship that sank in 1912?|Titanic|Lusitania|Britannic|Olympic
HIS|World History|2|The ancient city of Pompeii was destroyed in 79 AD by which volcano?|Mount Vesuvius|Mount Etna|Mount Olympus|Mount Pelée
HIS|World History|2|The Roman Colosseum was primarily used for what?|Gladiator games|Chariot races|Senate meetings|Markets
HIS|World History|2|Which wall did the Romans build across northern England?|Hadrian's Wall|Offa's Dyke|Antonine Wall|Great Wall
HIS|World History|2|Which ancient wonder was located in the city of Alexandria, Egypt?|Lighthouse of Alexandria (Pharos)|Hanging Gardens|Colossus of Rhodes|Temple of Artemis
HIS|World History|2|Which is the only ancient wonder of the world still largely standing?|Great Pyramid of Giza|Hanging Gardens of Babylon|Colossus of Rhodes|Lighthouse of Alexandria
HIS|World History|3|Which ancient people built the city of Machu Picchu?|Inca|Aztec|Maya|Olmec
HIS|World History|3|Which ancient people built Chichén Itzá?|Maya|Inca|Aztec|Toltec only
HIS|World History|3|Which Aztec capital stood where Mexico City is today?|Tenochtitlan|Cusco|Tikal|Teotihuacan
HIS|World History|2|The Industrial Revolution began in which country?|Great Britain|United States|Germany|France
HIS|World History|3|Which Greek city-state was known for its military discipline?|Sparta|Athens|Corinth|Thebes
HIS|World History|2|Who was the Greek philosopher who taught Alexander the Great?|Aristotle|Socrates|Plato|Pythagoras
HIS|World History|2|Who was the teacher of Plato?|Socrates|Aristotle|Pythagoras|Homer
HIS|World History|3|Which battle in 480 BC featured 300 Spartans holding off a vast Persian army?|Thermopylae|Marathon|Salamis|Plataea
"""

def build():
    names = [p[1] for p in PRES]
    for n, name, yr in PRES:
        n = int(n); yr = int(yr)
        early = n <= 3 or n in (16, 32, 35, 26, 40, 44, 7, 28, 33)
        add("HIS", "U.S. Presidents", 1 if n in (1, 16, 44, 16) else 2, f"Who was the {ordinal(n)} President of the United States?", name, pick(names, name, "pr" + name))
        add("HIS", "U.S. Presidents", 3, f"{name} was which number President of the United States?", ordinal(n), [ordinal(x) for x in near_nums(n, "pn" + name, 1, 1)])
        add("HIS", "U.S. Presidents", 3 if not early else 2, f"In what year did {name} first take office as President?", yr, near_years(yr, "py" + name, 6))
    allyears = []
    for e, y in EVENTS:
        y = int(y)
        span = 5 if y > 1900 else (12 if y > 1700 else (40 if y > 1200 else 120))
        d = 3 if y < 1700 else 2
        add("HIS", "Dates in History", d, f"In what year did {e}?", y, near_years(y, "ev" + e, span))
    parse_hand(HAND)
