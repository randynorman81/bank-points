from lib import *

# name|capital|continent|difficulty(of capital question)
COUNTRIES = table("""
Egypt|Cairo|Africa|1
Nigeria|Abuja|Africa|2
Kenya|Nairobi|Africa|2
Ethiopia|Addis Ababa|Africa|3
Ghana|Accra|Africa|2
Morocco|Rabat|Africa|2
Algeria|Algiers|Africa|3
Tunisia|Tunis|Africa|3
Libya|Tripoli|Africa|3
Sudan|Khartoum|Africa|3
Tanzania|Dodoma|Africa|3
Uganda|Kampala|Africa|3
Senegal|Dakar|Africa|3
Zimbabwe|Harare|Africa|3
Zambia|Lusaka|Africa|3
Angola|Luanda|Africa|3
Mozambique|Maputo|Africa|3
Madagascar|Antananarivo|Africa|3
Namibia|Windhoek|Africa|3
Botswana|Gaborone|Africa|3
Rwanda|Kigali|Africa|3
Mali|Bamako|Africa|3
Cameroon|Yaoundé|Africa|3
Somalia|Mogadishu|Africa|3
Japan|Tokyo|Asia|1
China|Beijing|Asia|1
India|New Delhi|Asia|1
South Korea|Seoul|Asia|1
North Korea|Pyongyang|Asia|2
Thailand|Bangkok|Asia|1
Vietnam|Hanoi|Asia|2
Philippines|Manila|Asia|2
Malaysia|Kuala Lumpur|Asia|2
Pakistan|Islamabad|Asia|2
Bangladesh|Dhaka|Asia|2
Nepal|Kathmandu|Asia|2
Afghanistan|Kabul|Asia|2
Iran|Tehran|Asia|2
Iraq|Baghdad|Asia|2
Saudi Arabia|Riyadh|Asia|2
Jordan|Amman|Asia|2
Lebanon|Beirut|Asia|2
Syria|Damascus|Asia|2
United Arab Emirates|Abu Dhabi|Asia|3
Qatar|Doha|Asia|3
Kuwait|Kuwait City|Asia|3
Mongolia|Ulaanbaatar|Asia|3
Myanmar|Naypyidaw|Asia|3
Cambodia|Phnom Penh|Asia|3
Laos|Vientiane|Asia|3
Bhutan|Thimphu|Asia|3
Uzbekistan|Tashkent|Asia|3
Oman|Muscat|Asia|3
Yemen|Sanaa|Asia|3
France|Paris|Europe|1
Germany|Berlin|Europe|1
Italy|Rome|Europe|1
Spain|Madrid|Europe|1
Portugal|Lisbon|Europe|1
United Kingdom|London|Europe|1
Ireland|Dublin|Europe|1
Netherlands|Amsterdam|Europe|1
Belgium|Brussels|Europe|2
Switzerland|Bern|Europe|2
Austria|Vienna|Europe|1
Poland|Warsaw|Europe|2
Czech Republic|Prague|Europe|2
Hungary|Budapest|Europe|2
Greece|Athens|Europe|1
Sweden|Stockholm|Europe|1
Norway|Oslo|Europe|1
Denmark|Copenhagen|Europe|1
Finland|Helsinki|Europe|2
Iceland|Reykjavik|Europe|2
Ukraine|Kyiv|Europe|2
Romania|Bucharest|Europe|2
Bulgaria|Sofia|Europe|3
Serbia|Belgrade|Europe|3
Croatia|Zagreb|Europe|3
Slovakia|Bratislava|Europe|3
Slovenia|Ljubljana|Europe|3
Estonia|Tallinn|Europe|3
Latvia|Riga|Europe|3
Lithuania|Vilnius|Europe|3
Malta|Valletta|Europe|3
Albania|Tirana|Europe|3
Belarus|Minsk|Europe|3
Canada|Ottawa|North America|1
Mexico|Mexico City|North America|1
Cuba|Havana|North America|1
Jamaica|Kingston|North America|2
Guatemala|Guatemala City|North America|3
Costa Rica|San José|North America|2
Panama|Panama City|North America|2
Honduras|Tegucigalpa|North America|3
Haiti|Port-au-Prince|North America|3
Dominican Republic|Santo Domingo|North America|3
Nicaragua|Managua|North America|3
El Salvador|San Salvador|North America|3
Bahamas|Nassau|North America|2
Brazil|Brasília|South America|2
Argentina|Buenos Aires|South America|1
Chile|Santiago|South America|2
Peru|Lima|South America|2
Colombia|Bogotá|South America|2
Venezuela|Caracas|South America|2
Ecuador|Quito|South America|2
Uruguay|Montevideo|South America|3
Paraguay|Asunción|South America|3
Guyana|Georgetown|South America|3
Suriname|Paramaribo|South America|3
Australia|Canberra|Oceania|2
New Zealand|Wellington|Oceania|2
Fiji|Suva|Oceania|3
Papua New Guinea|Port Moresby|Oceania|3
Samoa|Apia|Oceania|3
""", 4)
# country that straddles continents or is otherwise ambiguous -> only asked as capital questions
CONT = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"]
EXTRA_CAPS = [("Russia", "Moscow", 1), ("Turkey", "Ankara", 2), ("Kazakhstan", "Astana", 3)]

THE = {"Philippines","Bahamas","United Kingdom","United Arab Emirates","Netherlands","Czech Republic","Dominican Republic","United States"}

def the(n):
    return "the " + n if n in THE else n

def build_countries():
    caps_by_cont = {}
    for n, c, k, d in COUNTRIES:
        caps_by_cont.setdefault(k, []).append(c)
    allcaps = [c for _, c, _, _ in COUNTRIES]
    allnames = [n for n, _, _, _ in COUNTRIES]
    for n, c, k, d in COUNTRIES:
        d = int(d)
        pool = caps_by_cont[k] + (allcaps if len(caps_by_cont[k]) < 6 else [])
        add("GEO", "World Capitals", d, f"What is the capital of {the(n)}?", c, pick(pool, c, "cap" + n))
        add("GEO", "World Capitals", min(3, d + 1), f"{c} is the capital of which country?", n,
            pick([x for x, _, kk, _ in COUNTRIES if kk == k] or allnames, n, "rcap" + n))
        if d <= 2:
            add("GEO", "Continents", 1, f"On which continent would you find {the(n)}?", k, pick(CONT, k, "cont" + n))
    for n, c, d in EXTRA_CAPS:
        add("GEO", "World Capitals", d, f"What is the capital of {the(n)}?", c, pick(allcaps, c, "cap" + n))

# state|abbr|capital|nickname|largest city (or -)
STATES = table("""
Alabama|AL|Montgomery|Yellowhammer State|-
Alaska|AK|Juneau|The Last Frontier|Anchorage
Arizona|AZ|Phoenix|Grand Canyon State|Phoenix
Arkansas|AR|Little Rock|The Natural State|Little Rock
California|CA|Sacramento|Golden State|Los Angeles
Colorado|CO|Denver|Centennial State|Denver
Connecticut|CT|Hartford|Constitution State|Bridgeport
Delaware|DE|Dover|The First State|Wilmington
Florida|FL|Tallahassee|Sunshine State|Jacksonville
Georgia|GA|Atlanta|Peach State|Atlanta
Hawaii|HI|Honolulu|Aloha State|Honolulu
Idaho|ID|Boise|Gem State|Boise
Illinois|IL|Springfield|Prairie State|Chicago
Indiana|IN|Indianapolis|Hoosier State|Indianapolis
Iowa|IA|Des Moines|Hawkeye State|Des Moines
Kansas|KS|Topeka|Sunflower State|Wichita
Kentucky|KY|Frankfort|Bluegrass State|Louisville
Louisiana|LA|Baton Rouge|Pelican State|New Orleans
Maine|ME|Augusta|Pine Tree State|Portland
Maryland|MD|Annapolis|Old Line State|Baltimore
Massachusetts|MA|Boston|Bay State|Boston
Michigan|MI|Lansing|Great Lakes State|Detroit
Minnesota|MN|Saint Paul|North Star State|Minneapolis
Mississippi|MS|Jackson|Magnolia State|Jackson
Missouri|MO|Jefferson City|Show-Me State|Kansas City
Montana|MT|Helena|Treasure State|Billings
Nebraska|NE|Lincoln|Cornhusker State|Omaha
Nevada|NV|Carson City|Silver State|Las Vegas
New Hampshire|NH|Concord|Granite State|Manchester
New Jersey|NJ|Trenton|Garden State|Newark
New Mexico|NM|Santa Fe|Land of Enchantment|Albuquerque
New York|NY|Albany|Empire State|New York City
North Carolina|NC|Raleigh|Tar Heel State|Charlotte
North Dakota|ND|Bismarck|Peace Garden State|Fargo
Ohio|OH|Columbus|Buckeye State|Columbus
Oklahoma|OK|Oklahoma City|Sooner State|Oklahoma City
Oregon|OR|Salem|Beaver State|Portland
Pennsylvania|PA|Harrisburg|Keystone State|Philadelphia
Rhode Island|RI|Providence|Ocean State|Providence
South Carolina|SC|Columbia|Palmetto State|-
South Dakota|SD|Pierre|Mount Rushmore State|Sioux Falls
Tennessee|TN|Nashville|Volunteer State|Nashville
Texas|TX|Austin|Lone Star State|Houston
Utah|UT|Salt Lake City|Beehive State|Salt Lake City
Vermont|VT|Montpelier|Green Mountain State|Burlington
Virginia|VA|Richmond|Old Dominion|Virginia Beach
Washington|WA|Olympia|Evergreen State|Seattle
West Virginia|WV|Charleston|Mountain State|Charleston
Wisconsin|WI|Madison|Badger State|Milwaukee
Wyoming|WY|Cheyenne|Equality State|Cheyenne
""", 5)

def build_states():
    names = [s[0] for s in STATES]; caps = [s[2] for s in STATES]
    nicks = [s[3] for s in STATES]; abbrs = [s[1] for s in STATES]
    big = [s[4] for s in STATES if s[4] != "-"]
    easy = {"California", "Texas", "Florida", "New York", "Georgia", "Hawaii", "Alaska", "Colorado", "Arizona",
            "Washington", "Illinois", "Ohio", "Massachusetts", "Nevada", "Louisiana", "Tennessee", "Michigan", "Oregon"}
    for n, ab, cap, nick, lg in STATES:
        add("GEO", "U.S. States", 1 if n in easy else 2, f"What is the capital of {the(n)}?", cap, pick(caps, cap, "st" + n))
        add("GEO", "U.S. States", 2, f"{cap} is the capital of which U.S. state?", n, pick(names, n, "rst" + n))
        add("GEO", "U.S. States", 1 if n in easy else 2, f"Which U.S. state has the postal abbreviation {ab}?", n, pick(names, n, "ab" + n))
        add("GEO", "U.S. States", 2 if n in easy else 3, f"Which U.S. state is nicknamed the \"{nick.replace('The ', '')}\"?", n, pick(names, n, "nk" + n))
        add("GEO", "U.S. States", 3, f"What is the nickname of {n}?", nick, pick(nicks, nick, "nn" + n))
        if lg not in ("-",) and lg != cap:
            add("GEO", "U.S. States", 2, f"What is the most populous city in {n}?", lg, pick(big, lg, "lg" + n))

# landmark|city|country
LANDMARKS = table("""
Eiffel Tower|Paris|France
Colosseum|Rome|Italy
Big Ben|London|United Kingdom
Sagrada Família|Barcelona|Spain
Brandenburg Gate|Berlin|Germany
Acropolis|Athens|Greece
Taj Mahal|Agra|India
Forbidden City|Beijing|China
Sydney Opera House|Sydney|Australia
Christ the Redeemer|Rio de Janeiro|Brazil
Machu Picchu|Cusco region|Peru
Petra|Ma'an Governorate|Jordan
Angkor Wat|Siem Reap|Cambodia
Burj Khalifa|Dubai|United Arab Emirates
Blue Mosque|Istanbul|Turkey
Hagia Sophia|Istanbul|Turkey
Leaning Tower|Pisa|Italy
Neuschwanstein Castle|Bavaria|Germany
Louvre|Paris|France
Kremlin|Moscow|Russia
Great Pyramid of Giza|Giza|Egypt
Table Mountain|Cape Town|South Africa
CN Tower|Toronto|Canada
Chichén Itzá|Yucatán|Mexico
Alhambra|Granada|Spain
Stonehenge|Wiltshire|United Kingdom
Atomium|Brussels|Belgium
Little Mermaid statue|Copenhagen|Denmark
Charles Bridge|Prague|Czech Republic
Marina Bay Sands|Singapore|Singapore
Mount Fuji|Honshu|Japan
Petronas Towers|Kuala Lumpur|Malaysia
Golden Gate Bridge|San Francisco|United States
Gateway Arch|St. Louis|United States
Space Needle|Seattle|United States
Statue of Liberty|New York City|United States
Alamo|San Antonio|United States
Mount Rushmore|Keystone|United States
Hoover Dam|Black Canyon|United States
Lincoln Memorial|Washington, D.C.|United States
Stone Mountain|Stone Mountain|United States
""", 3)

NOART = {"Mount Fuji","Table Mountain","Stonehenge","Machu Picchu","Petra","Angkor Wat","Chichén Itzá","Hagia Sophia","Neuschwanstein Castle","Stone Mountain","Burj Khalifa","Sagrada Família","Taj Mahal","Acropolis","Louvre","Kremlin","Mount Rushmore","Marina Bay Sands","Brandenburg Gate"}

def build_landmarks():
    countries = sorted({c for _, _, c in LANDMARKS})
    for lm, city, co in LANDMARKS:
        if co == "Singapore" or lm in ("Mount Fuji", "Stone Mountain", "Hoover Dam", "Mount Rushmore", "Petra", "Machu Picchu", "Chichén Itzá", "Alhambra", "Stonehenge", "Neuschwanstein Castle", "Table Mountain", "Great Pyramid of Giza"):
            pass
        add("GEO", "Landmarks", 1 if lm in ("Eiffel Tower", "Big Ben", "Taj Mahal", "Colosseum", "Statue of Liberty", "Great Pyramid of Giza", "Sydney Opera House", "Golden Gate Bridge") else 2,
            f"In which country is {'' if lm in NOART else 'the '}{lm} located?",
            co, pick(countries, co, "lm" + lm))
    cities = ["Paris", "Rome", "London", "Barcelona", "Berlin", "Athens", "Sydney", "Dubai", "Istanbul", "Moscow", "Toronto", "Brussels",
              "Copenhagen", "Prague", "Seattle", "San Francisco", "St. Louis", "San Antonio", "Cape Town", "Kuala Lumpur", "Pisa", "Rio de Janeiro", "Beijing"]
    for lm, city, co in LANDMARKS:
        if city in cities:
            add("GEO", "Landmarks", 2, f"In which city would you find {'' if lm in NOART else 'the '}{lm}?",
                city, pick(cities, city, "lc" + lm))

HAND = """
GEO|Rivers & Lakes|1|What is the longest river in Africa?|Nile|Congo|Niger|Zambezi
GEO|Rivers & Lakes|2|Which South American river carries the greatest volume of water in the world?|Amazon|Orinoco|Paraná|Magdalena
GEO|Rivers & Lakes|1|The Mississippi River empties into which body of water?|Gulf of Mexico|Atlantic Ocean|Gulf of California|Caribbean Sea
GEO|Rivers & Lakes|2|Which river flows through Baghdad?|Tigris|Euphrates|Jordan|Nile
GEO|Rivers & Lakes|2|Which river runs through London?|Thames|Severn|Mersey|Avon
GEO|Rivers & Lakes|2|Which European river flows through Vienna, Budapest and Belgrade?|Danube|Rhine|Elbe|Seine
GEO|Rivers & Lakes|2|The Rhine River forms part of the border between France and which country?|Germany|Belgium|Spain|Italy
GEO|Rivers & Lakes|1|Which Great Lake is the only one located entirely within the United States?|Lake Michigan|Lake Superior|Lake Erie|Lake Huron
GEO|Rivers & Lakes|2|Which Great Lake is the largest by surface area?|Superior|Michigan|Huron|Ontario
GEO|Rivers & Lakes|3|Which lake is the deepest in the world?|Baikal|Tanganyika|Superior|Victoria
GEO|Rivers & Lakes|2|Which African lake is the largest by area?|Victoria|Chad|Malawi|Tanganyika
GEO|Rivers & Lakes|1|Niagara Falls lies on the border of the U.S. and which country?|Canada|Mexico|Greenland|Cuba
GEO|Rivers & Lakes|2|Which river forms much of the border between Texas and Mexico?|Rio Grande|Colorado|Pecos|Brazos
GEO|Rivers & Lakes|2|The Colorado River carved which famous natural wonder?|Grand Canyon|Bryce Canyon|Monument Valley|Carlsbad Caverns
GEO|Rivers & Lakes|3|Which river is the longest in Europe?|Volga|Danube|Rhine|Dnieper
GEO|Rivers & Lakes|2|The Ganges River is considered sacred in which religion?|Hinduism|Buddhism|Islam|Sikhism
GEO|Rivers & Lakes|2|Which river runs through Paris?|Seine|Loire|Rhône|Garonne
GEO|Rivers & Lakes|2|Which river runs through Rome?|Tiber|Po|Arno|Adige
GEO|Rivers & Lakes|2|Which river runs through Cairo?|Nile|Tigris|Jordan|Niger
GEO|Rivers & Lakes|3|The Yangtze River is the longest river in which country?|China|India|Russia|Mongolia
GEO|Rivers & Lakes|2|Lake Tahoe straddles the border of California and which state?|Nevada|Oregon|Arizona|Utah
GEO|Rivers & Lakes|2|Which Georgia river is known for the Atlanta stretch through the Chattahoochee National Recreation Area?|Chattahoochee|Savannah|Ocmulgee|Altamaha
GEO|Mountains & Deserts|1|What is the tallest mountain above sea level on Earth?|Mount Everest|K2|Kilimanjaro|Denali
GEO|Mountains & Deserts|2|What is the tallest mountain in Africa?|Kilimanjaro|Mount Kenya|Mount Stanley|Toubkal
GEO|Mountains & Deserts|2|What is the tallest mountain in North America?|Denali|Mount Whitney|Mount Logan|Mount Elbert
GEO|Mountains & Deserts|2|Which mountain range separates Europe from Asia in Russia?|Ural Mountains|Alps|Carpathians|Caucasus
GEO|Mountains & Deserts|1|Which is the largest hot desert in the world?|Sahara|Gobi|Kalahari|Arabian
GEO|Mountains & Deserts|2|The Atacama Desert is located primarily in which country?|Chile|Peru|Bolivia|Argentina
GEO|Mountains & Deserts|2|Which desert covers much of Mongolia and northern China?|Gobi|Thar|Mojave|Negev
GEO|Mountains & Deserts|2|The Matterhorn is a famous peak in which mountain range?|Alps|Pyrenees|Dolomites|Carpathians
GEO|Mountains & Deserts|3|K2, the second-tallest mountain on Earth, is part of which range?|Karakoram|Himalayas|Hindu Kush|Pamirs
GEO|Mountains & Deserts|2|What is the highest point in the contiguous United States?|Mount Whitney|Mount Elbert|Pikes Peak|Mount Rainier
GEO|Mountains & Deserts|2|Which mountain range runs along the western edge of South America?|Andes|Rockies|Sierra Madre|Alps
GEO|Mountains & Deserts|2|The Appalachian Trail ends at Springer Mountain in which state?|Georgia|Tennessee|North Carolina|Virginia
GEO|Mountains & Deserts|2|Which Georgia mountain features a famous carving of Confederate figures?|Stone Mountain|Kennesaw Mountain|Brasstown Bald|Lookout Mountain
GEO|Mountains & Deserts|3|What is the highest point in Georgia?|Brasstown Bald|Springer Mountain|Pine Mountain|Blood Mountain
GEO|Mountains & Deserts|2|Mount Fuji is located on which Japanese island?|Honshu|Hokkaido|Kyushu|Shikoku
GEO|Mountains & Deserts|2|Which desert in southern California and Nevada contains Death Valley?|Mojave|Sonoran|Chihuahuan|Great Basin
GEO|Mountains & Deserts|2|Which volcano buried the Roman city of Pompeii?|Mount Vesuvius|Mount Etna|Stromboli|Mount Olympus
GEO|Mountains & Deserts|2|Mount St. Helens erupted in 1980 in which state?|Washington|Oregon|California|Idaho
GEO|Oceans & Islands|1|Which is the largest ocean on Earth?|Pacific Ocean|Atlantic Ocean|Indian Ocean|Arctic Ocean
GEO|Oceans & Islands|1|Which is the smallest ocean?|Arctic Ocean|Indian Ocean|Southern Ocean|Atlantic Ocean
GEO|Oceans & Islands|1|What is the largest island in the world (not counting continents)?|Greenland|New Guinea|Borneo|Madagascar
GEO|Oceans & Islands|2|The Galápagos Islands belong to which country?|Ecuador|Chile|Peru|Colombia
GEO|Oceans & Islands|2|Easter Island, famous for its moai statues, belongs to which country?|Chile|Peru|New Zealand|Australia
GEO|Oceans & Islands|1|Which U.S. state is made up entirely of islands?|Hawaii|Alaska|Maine|Florida
GEO|Oceans & Islands|2|Which island nation lies off the southeast coast of Africa?|Madagascar|Sri Lanka|Cuba|Iceland
GEO|Oceans & Islands|2|Which sea separates Europe from North Africa?|Mediterranean Sea|Black Sea|Red Sea|Caspian Sea
GEO|Oceans & Islands|2|Which Italian island is the largest in the Mediterranean Sea?|Sicily|Sardinia|Corsica|Crete
GEO|Oceans & Islands|2|The Great Barrier Reef lies off the coast of which Australian state?|Queensland|New South Wales|Victoria|Western Australia
GEO|Oceans & Islands|3|Which strait separates Alaska from Russia?|Bering Strait|Davis Strait|Strait of Magellan|Cook Strait
GEO|Oceans & Islands|2|Which canal connects the Atlantic and Pacific Oceans through Central America?|Panama Canal|Suez Canal|Erie Canal|Kiel Canal
GEO|Oceans & Islands|2|Which canal connects the Mediterranean Sea and the Red Sea?|Suez Canal|Panama Canal|Corinth Canal|Welland Canal
GEO|Oceans & Islands|2|Tasmania is an island state of which country?|Australia|New Zealand|Chile|Canada
GEO|Oceans & Islands|2|What is the largest of the Hawaiian Islands?|Hawaiʻi (the Big Island)|Maui|Oʻahu|Kauaʻi
GEO|Oceans & Islands|1|Which body of water is the saltiest large lake in the Middle East, famous for floating?|Dead Sea|Sea of Galilee|Caspian Sea|Red Sea
GEO|Oceans & Islands|3|The Bahamas are an archipelago in which ocean?|Atlantic Ocean|Pacific Ocean|Indian Ocean|Gulf of Mexico
GEO|Oceans & Islands|2|Which island is home to Puerto Rico's capital, San Juan?|Puerto Rico|Cuba|Hispaniola|Jamaica
GEO|Oceans & Islands|2|Which country is both an island and a continent?|Australia|Greenland|Iceland|Madagascar
GEO|Oceans & Islands|3|The Maldives archipelago lies in which ocean?|Indian Ocean|Pacific Ocean|Atlantic Ocean|Arctic Ocean
GEO|Superlatives|1|What is the largest country in the world by area?|Russia|Canada|China|United States
GEO|Superlatives|2|What is the smallest country in the world by area?|Vatican City|Monaco|San Marino|Liechtenstein
GEO|Superlatives|1|Which continent has the most countries?|Africa|Asia|Europe|South America
GEO|Superlatives|2|Which country has the largest population as of the mid-2020s?|India|China|United States|Indonesia
GEO|Superlatives|2|Which is the smallest continent by land area?|Australia (Oceania)|Europe|Antarctica|South America
GEO|Superlatives|1|Which is the largest continent by area?|Asia|Africa|North America|Europe
GEO|Superlatives|2|Which country has the most time zones, counting overseas territories?|France|Russia|United States|United Kingdom
GEO|Superlatives|2|Which country has the longest coastline in the world?|Canada|Russia|Indonesia|Australia
GEO|Superlatives|2|What is the most populous city in the United States?|New York City|Los Angeles|Chicago|Houston
GEO|Superlatives|3|Which is the lowest point on land on Earth's surface?|Dead Sea shore|Death Valley|Lake Assal|Qattara Depression
GEO|Superlatives|2|Which U.S. state has the longest coastline?|Alaska|Florida|California|Hawaii
GEO|Superlatives|2|Which U.S. state is the largest by area?|Alaska|Texas|California|Montana
GEO|Superlatives|1|Which U.S. state is the smallest by area?|Rhode Island|Delaware|Connecticut|Hawaii
GEO|Superlatives|2|Which U.S. state has the most people?|California|Texas|Florida|New York
GEO|Superlatives|2|Which country has the most official languages in the world?|Zimbabwe|India|South Africa|Switzerland
GEO|Superlatives|2|Which African country is the most populous?|Nigeria|Ethiopia|Egypt|South Africa
GEO|Superlatives|2|Which South American country is the largest by area?|Brazil|Argentina|Peru|Colombia
GEO|Borders|2|Which is the only country in the world to have a flag that is not rectangular or square?|Nepal|Switzerland|Bhutan|Vatican City
GEO|Borders|2|Which two countries share the longest international border in the world?|Canada and the United States|Russia and China|Argentina and Chile|India and Pakistan
GEO|Borders|2|Which country borders both France and Portugal?|Spain|Andorra|Italy|Morocco
GEO|Borders|2|Which country completely surrounds the country of Lesotho?|South Africa|Botswana|Namibia|Mozambique
GEO|Borders|2|Which country lies to the east of Pakistan?|India|Iran|Afghanistan|China
GEO|Borders|2|Vatican City is entirely surrounded by which country?|Italy|France|Switzerland|Austria
GEO|Borders|2|Which two South American countries are landlocked?|Bolivia and Paraguay|Peru and Chile|Ecuador and Colombia|Uruguay and Guyana
GEO|Borders|1|Which country is directly south of the United States?|Mexico|Cuba|Panama|Guatemala
GEO|Borders|2|Which Scandinavian country is NOT part of the European Union?|Norway|Sweden|Denmark|Finland
GEO|Borders|2|The Strait of Gibraltar separates Spain from which African country?|Morocco|Algeria|Tunisia|Libya
GEO|Borders|2|Which country includes the territory of Corsica?|France|Italy|Spain|Greece
GEO|Borders|2|The Falkland Islands are a territory of which country?|United Kingdom|Argentina|Chile|Spain
"""
# (last line above intentionally malformed -> counted as reject; keep lines tidy below)

HAND2 = """
GEO|Georgia & the South|1|Which Georgia city is the state's oldest and was planned by James Oglethorpe in 1733?|Savannah|Augusta|Macon|Columbus
GEO|Georgia & the South|2|Which Georgia swamp is one of the largest blackwater swamps in North America?|Okefenokee|Everglades|Great Dismal|Atchafalaya
GEO|Georgia & the South|1|What fruit is Georgia nicknamed for?|Peach|Pecan|Apple|Orange
GEO|Georgia & the South|2|Which Georgia city is home to the Masters Tournament each April?|Augusta|Savannah|Athens|Macon
GEO|Georgia & the South|2|Which Georgia city is home to the University of Georgia?|Athens|Macon|Valdosta|Statesboro
GEO|Georgia & the South|3|Which U.S. president was born in Plains, Georgia?|Jimmy Carter|Bill Clinton|Lyndon Johnson|Harry Truman
GEO|Georgia & the South|2|Hartsfield-Jackson is an international airport in which city?|Atlanta|Savannah|Augusta|Birmingham
GEO|Georgia & the South|2|Georgia borders Florida to the south. Which state borders it to the northeast?|South Carolina|North Carolina|Alabama|Tennessee
GEO|Georgia & the South|2|Which sea island chain along the Georgia coast includes Jekyll and St. Simons?|Golden Isles|Outer Banks|Florida Keys|Sea Islands of Texas
GEO|Georgia & the South|3|Which Georgia city is called the "Hostess City of the South"?|Savannah|Macon|Columbus|Atlanta
GEO|Georgia & the South|2|Which river forms much of Georgia's border with South Carolina?|Savannah River|Chattahoochee River|Altamaha River|Ocmulgee River
GEO|Georgia & the South|2|Georgia became a state in 1788 as which number of the original thirteen to ratify the Constitution?|Fourth|First|Ninth|Thirteenth
GEO|Georgia & the South|2|What is Georgia's state bird?|Brown thrasher|Mockingbird|Cardinal|Northern bobwhite
GEO|Georgia & the South|2|What is Georgia's official state tree?|Live oak|Southern pine|Magnolia|Dogwood
GEO|Georgia & the South|1|What city hosted the 1996 Summer Olympic Games?|Atlanta|Los Angeles|Barcelona|Sydney
GEO|Georgia & the South|2|Which Gulf state lies directly west of Georgia?|Alabama|Mississippi|Louisiana|Tennessee
GEO|Georgia & the South|3|Which north Georgia lake was created by Buford Dam on the Chattahoochee River?|Lake Lanier|Lake Hartwell|Lake Sinclair|Lake Oconee
GEO|Georgia & the South|2|Which Georgia city is known as the home of the Allman Brothers Band and Otis Redding?|Macon|Valdosta|Rome|Albany
"""

def build():
    build_countries(); build_states(); build_landmarks()
    parse_hand(HAND); parse_hand(HAND2)
