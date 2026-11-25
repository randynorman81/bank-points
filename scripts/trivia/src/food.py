from lib import *

DISHES = table("""
Sushi|Japan
Ramen|Japan
Tempura|Japan
Takoyaki|Japan
Tacos|Mexico
Tamales|Mexico
Guacamole|Mexico
Mole poblano|Mexico
Churros|Spain
Paella|Spain
Gazpacho|Spain
Pizza Margherita|Italy
Risotto|Italy
Lasagna|Italy
Tiramisu|Italy
Gelato|Italy
Spaghetti alla carbonara|Italy
Osso buco|Italy
Croissant|France
Ratatouille|France
Bouillabaisse|France
Crêpes|France
Escargot|France
Quiche Lorraine|France
Coq au vin|France
Crème brûlée|France
Pad Thai|Thailand
Tom yum soup|Thailand
Green curry|Thailand
Pho|Vietnam
Banh mi|Vietnam
Kimchi|South Korea
Bibimbap|South Korea
Bulgogi|South Korea
Biryani|India
Tandoori chicken|India
Naan|India
Samosa|India
Butter chicken|India
Dim sum|China
Peking duck|China
Kung pao chicken|China
Moussaka|Greece
Souvlaki|Greece
Tzatziki|Greece
Pierogi|Poland
Borscht|Ukraine
Goulash|Hungary
Wiener schnitzel|Austria
Bratwurst|Germany
Sauerkraut|Germany
Fish and chips|England
Shepherd's pie|England
Haggis|Scotland
Poutine|Canada
Feijoada|Brazil
Ceviche|Peru
Empanadas|Argentina
Jerk chicken|Jamaica
Injera|Ethiopia
Tagine|Morocco
Köttbullar|Sweden
Pasta primavera|United States
Smørrebrød|Denmark
Raclette|Switzerland
Stroopwafel|Netherlands
Pavlova|Australia and New Zealand
Satay|Indonesia
Nasi goreng|Indonesia
Adobo|Philippines
Laksa|Malaysia
Pasteis de nata|Portugal
Bacalhau|Portugal
Fondue|Switzerland
Moules-frites|Belgium
Belgian waffles|Belgium
Tortilla española|Spain
Arepas|Venezuela and Colombia
Pupusas|El Salvador
""", 2)

US_FOODS = table("""
Cheesesteak|Philadelphia
Deep-dish pizza|Chicago
Buffalo wings|Buffalo, New York
Key lime pie|Florida
Gumbo|Louisiana
Beignets|New Orleans
Clam chowder|New England
Lobster roll|Maine
Hot chicken|Nashville
Peach cobbler|Georgia
Shrimp and grits|South Carolina
Boston cream pie|Massachusetts
Kansas City barbecue|Kansas City
Pimento cheese|the American South
Chili con carne|Texas
Philly cheesesteak|Philadelphia
""", 2)
US_FOODS = [u for u in US_FOODS if u[0] != "Philly cheesesteak"]

COCKTAILS = table("""
Mojito|rum
Daiquiri|rum
Piña colada|rum
Margarita|tequila
Tequila Sunrise|tequila
Martini|gin
Negroni|gin
Gin and tonic|gin
Moscow Mule|vodka
Cosmopolitan|vodka
Bloody Mary|vodka
Screwdriver|vodka
Old Fashioned|whiskey
Manhattan|whiskey
Mint julep|bourbon
Whiskey sour|whiskey
Mimosa|sparkling wine
Aperol Spritz|prosecco
Sangria|wine
Irish coffee|Irish whiskey
""", 2)

CHEESES = table("""
Parmigiano-Reggiano|Italy
Mozzarella|Italy
Gorgonzola|Italy
Brie|France
Camembert|France
Roquefort|France
Feta|Greece
Halloumi|Cyprus
Gouda|Netherlands
Edam|Netherlands
Swiss Emmental|Switzerland
Gruyère|Switzerland
Manchego|Spain
Cheddar|England
Stilton|England
Havarti|Denmark
Jarlsberg|Norway
Cotija|Mexico
Paneer|India
""", 2)

PASTA = table("""
Farfalle|butterflies
Penne|quills or pens
Orecchiette|little ears
Vermicelli|little worms
Linguine|little tongues
Fusilli|spindles
Spaghetti|little strings
Capellini|little hairs
Rigatoni|ridged
Conchiglie|shells
""", 2)

HAND = """
FOOD|Basics|1|What is the main ingredient in guacamole?|Avocado|Tomato|Lime|Cilantro
FOOD|Basics|1|What is the main ingredient in hummus?|Chickpeas|Lentils|Black beans|Eggplant
FOOD|Basics|2|What is the main ingredient in traditional pesto?|Basil|Parsley|Spinach|Mint
FOOD|Basics|2|What is the main ingredient in sauerkraut?|Cabbage|Cucumber|Beets|Onion
FOOD|Basics|2|What is the main ingredient in tofu?|Soybeans|Rice|Wheat|Chickpeas
FOOD|Basics|2|What is the main ingredient in a traditional Caesar salad dressing?|Egg, anchovy and Parmesan|Mayonnaise and mustard|Ranch and bacon|Olive oil and vinegar
FOOD|Basics|2|What is the main ingredient in sushi rice seasoning?|Vinegar|Soy sauce|Mirin only|Sake
FOOD|Basics|2|What is the green paste served with sushi?|Wasabi|Pesto|Matcha|Guacamole
FOOD|Basics|2|What is the Japanese rice wine called?|Sake|Soju|Shochu|Baijiu
FOOD|Basics|2|What type of pepper is used to make Tabasco sauce?|Tabasco pepper|Habanero|Jalapeño|Cayenne
FOOD|Basics|2|What is the hottest chili pepper by the Scoville scale, as of recent records?|Pepper X|Carolina Reaper|Ghost pepper|Habanero
FOOD|Basics|2|What scale measures the heat of chili peppers?|Scoville scale|Richter scale|Mohs scale|Kelvin scale
FOOD|Basics|2|Which vegetable is the base of a traditional French onion soup?|Onion|Leek|Shallot|Garlic
FOOD|Basics|2|Which spice comes from the dried stigmas of the crocus flower and is the most expensive by weight?|Saffron|Vanilla|Cardamom|Turmeric
FOOD|Basics|2|Which spice gives curry its yellow color?|Turmeric|Cumin|Paprika|Saffron
FOOD|Basics|2|Which spice is derived from the bark of a tree and used in cinnamon rolls?|Cinnamon|Nutmeg|Clove|Cardamom
FOOD|Basics|2|Which nut is used to make marzipan?|Almond|Walnut|Pistachio|Cashew
FOOD|Basics|2|Which fruit is dried to make raisins?|Grapes|Plums|Cherries|Figs
FOOD|Basics|2|Which fruit is dried to make prunes?|Plums|Apricots|Grapes|Peaches
FOOD|Basics|2|Which fruit is known as the "king of fruits" in Southeast Asia and has a strong smell?|Durian|Jackfruit|Mangosteen|Lychee
FOOD|Basics|2|Which fruit is the largest tree-borne fruit?|Jackfruit|Durian|Breadfruit|Papaya
FOOD|Basics|2|Botanically speaking, which of these is a fruit: tomato, carrot, potato or onion?|Tomato|Carrot|Potato|Onion
FOOD|Basics|2|Which U.S. state is famous for peaches in the Fall Line region and is nicknamed for them?|Georgia|South Carolina|California|Alabama
FOOD|Basics|2|Which Georgia town is known for sweet onions?|Vidalia|Dalton|Cordele|Valdosta
FOOD|Basics|2|Which Georgia city is known for pecans and for hosting the Pecan Festival?|Albany|Athens|Rome|Gainesville
FOOD|Basics|3|Which nut is also known as a goober or ground nut?|Peanut|Pecan|Walnut|Hazelnut
FOOD|Basics|2|Which president was a peanut farmer from Georgia?|Jimmy Carter|Bill Clinton|Lyndon Johnson|Harry Truman
FOOD|Basics|2|What is the name of the traditional Southern bread made with cornmeal?|Cornbread|Soda bread|Sourdough|Brioche
FOOD|Basics|2|What is the name of the traditional Southern dish of ground hominy served as a breakfast side?|Grits|Polenta|Hush puppies|Biscuits
FOOD|Basics|2|What are fried balls of cornmeal batter called, often served with fish?|Hush puppies|Beignets|Fritters|Dumplings
FOOD|Basics|2|What Southern drink is sweetened and served over ice?|Sweet tea|Lemonade|Arnold Palmer|Cold brew
FOOD|Basics|2|What is half sweet tea and half lemonade called?|Arnold Palmer|Shirley Temple|Lime rickey|Spritzer
FOOD|Basics|2|What drink is a mix of ginger ale and grenadine with a cherry?|Shirley Temple|Roy Rogers|Arnold Palmer|Mocktail mojito
FOOD|Basics|2|What drink is a mix of cola and grenadine with a cherry?|Roy Rogers|Shirley Temple|Arnold Palmer|Cherry Coke
FOOD|Drinks|1|Which soft drink was invented in Atlanta by John Pemberton in 1886?|Coca-Cola|Pepsi|Dr Pepper|Sprite
FOOD|Drinks|2|Which soft drink was invented in New Bern, North Carolina?|Pepsi|Coca-Cola|Dr Pepper|Mountain Dew
FOOD|Drinks|2|Which soft drink was invented in Waco, Texas?|Dr Pepper|Pepsi|Mountain Dew|RC Cola
FOOD|Drinks|2|Which Atlanta museum is dedicated to a famous soft drink?|World of Coca-Cola|Georgia Aquarium|High Museum|Fernbank
FOOD|Drinks|2|Which energy drink brand uses the slogan "gives you wings"?|Red Bull|Monster|Rockstar|Bang
FOOD|Drinks|2|What is the main ingredient in root beer's traditional flavor?|Sassafras|Ginger|Licorice|Vanilla
FOOD|Drinks|2|Which grape is used to make champagne alongside Pinot Noir and Chardonnay?|Pinot Meunier|Merlot|Riesling|Malbec
FOOD|Drinks|2|Which French region is the only place that can legally produce Champagne?|Champagne|Bordeaux|Burgundy|Provence
FOOD|Drinks|2|Which grape is Napa Valley most famous for?|Cabernet Sauvignon|Riesling|Malbec|Tempranillo
FOOD|Drinks|2|Which white wine grape is used to make Chablis?|Chardonnay|Sauvignon Blanc|Riesling|Pinot Grigio
FOOD|Drinks|2|What is the process of fermenting grapes into wine called in the first stage?|Fermentation|Distillation|Pasteurization|Carbonation
FOOD|Drinks|2|Which spirit is made from fermented agave?|Tequila|Rum|Vodka|Gin
FOOD|Drinks|2|Which spirit is made from sugarcane or molasses?|Rum|Tequila|Gin|Whiskey
FOOD|Drinks|2|Which spirit is flavored primarily with juniper berries?|Gin|Vodka|Brandy|Rum
FOOD|Drinks|2|What is the main grain used in bourbon?|Corn|Barley|Rye|Wheat
FOOD|Drinks|2|Which U.S. state is known for bourbon production?|Kentucky|Georgia|Texas|Colorado
FOOD|Drinks|2|Which beverage is made from fermented honey?|Mead|Cider|Sake|Perry
FOOD|Drinks|2|Which beverage is made from fermented apples?|Cider|Mead|Perry|Kvass
FOOD|Drinks|2|Which tea is fermented and aged in China, named after a province?|Pu-erh|Matcha|Earl Grey|Darjeeling
FOOD|Drinks|2|Which tea is flavored with bergamot oil?|Earl Grey|Darjeeling|Oolong|Assam
FOOD|Drinks|2|Which Japanese tea is a powdered green tea used in tea ceremonies?|Matcha|Sencha|Genmaicha|Hojicha
FOOD|Drinks|2|What is an Italian coffee with equal parts espresso, steamed milk and foam called?|Cappuccino|Latte|Macchiato|Americano
FOOD|Drinks|2|What is an espresso with hot water added called?|Americano|Cortado|Macchiato|Ristretto
FOOD|Drinks|2|What is the term for a single shot of espresso in Italian?|Espresso|Doppio|Lungo|Ristretto
FOOD|Drinks|2|Where did coffee originate, according to legend?|Ethiopia|Colombia|Brazil|Yemen
FOOD|Drinks|2|Which country is the largest producer of coffee beans?|Brazil|Colombia|Vietnam|Ethiopia
FOOD|Drinks|2|Which country is the largest producer of cocoa beans?|Ivory Coast|Ghana|Brazil|Indonesia
FOOD|Brands|2|Which fast-food chain is known for the "Golden Arches"?|McDonald's|Burger King|Wendy's|Hardee's
FOOD|Brands|2|Which fast-food chain was founded by Colonel Harland Sanders?|KFC|Popeyes|Chick-fil-A|Bojangles
FOOD|Brands|2|Which chicken chain was founded in Georgia by S. Truett Cathy?|Chick-fil-A|Popeyes|Zaxby's|Bojangles
FOOD|Brands|2|Which diner chain was founded in Avondale Estates, Georgia in 1955?|Waffle House|Cracker Barrel|IHOP|Denny's
FOOD|Brands|2|Which Georgia-based chain is famous for home cooking and a "Cracker Barrel Old Country Store"? skip|x|x|x|x
FOOD|Brands|2|Which donut chain, headquartered in Winston-Salem, NC, is known for its "Hot Now" sign?|Krispy Kreme|Dunkin'|Tim Hortons|Duck Donuts
FOOD|Brands|2|Which coffee chain was founded in Seattle in 1971?|Starbucks|Dunkin'|Peet's|Tim Hortons
FOOD|Brands|2|Which pizza chain began in Wichita, Kansas, in 1958?|Pizza Hut|Domino's|Papa John's|Little Caesars
FOOD|Brands|2|Which pizza chain was founded in Ypsilanti, Michigan?|Domino's|Pizza Hut|Papa John's|Little Caesars
FOOD|Brands|2|Which burger chain is known for its square patties and the founder's red-haired daughter logo?|Wendy's|Burger King|White Castle|Whataburger
FOOD|Brands|2|Which Texas burger chain is known for its orange-and-white striped A-frame buildings?|Whataburger|Five Guys|Fatburger|Culver's
FOOD|Brands|2|Which sandwich chain says "Eat Fresh"?|Subway|Jimmy John's|Jersey Mike's|Firehouse Subs
FOOD|Brands|2|Which cereal mascot is a tiger who says "They're Gr-r-reat!"?|Tony the Tiger|Toucan Sam|Cap'n Crunch|Trix Rabbit
FOOD|Brands|2|Which cereal mascot is a toucan?|Toucan Sam|Tony the Tiger|Snap, Crackle and Pop|Lucky the Leprechaun
FOOD|Brands|2|Which candy bar has the slogan "Melts in your mouth, not in your hand"?|M&M's|Snickers|Hershey's|Reese's
FOOD|Brands|2|Which Pennsylvania town is home to Hershey's chocolate?|Hershey|Lancaster|Scranton|Allentown
FOOD|Brands|2|Which cookie is the best-selling cookie in the U.S. with a creme filling?|Oreo|Chips Ahoy!|Nutter Butter|Fig Newtons
FOOD|Brands|2|Which snack is a cheese-flavored cracker shaped like a fish?|Goldfish|Cheez-It|Ritz|Wheat Thins
FOOD|Brands|2|Which brand makes the Whopper?|Burger King|McDonald's|Wendy's|Sonic
FOOD|Brands|2|Which fast-food burger chain's mascot is a clown named Ronald?|McDonald's|Wendy's|Burger King|Jack in the Box
FOOD|Brands|2|Which burger chain is known for its "secret menu" and a west coast fan base, with "Animal Style"?|In-N-Out|Five Guys|Shake Shack|Culver's
FOOD|Brands|2|Which grocery chain based in Atlanta is Georgia's largest?|Publix|Kroger|Walmart|Food Lion
FOOD|Brands|2|Which Florida-based supermarket chain says "Where shopping is a pleasure"?|Publix|Winn-Dixie|Harris Teeter|Piggly Wiggly
FOOD|Brands|2|Which grocery store's mascot is a pig and was founded in Memphis in 1916?|Piggly Wiggly|Winn-Dixie|Publix|Ingles
FOOD|Brands|2|Which cheese brand makes "Kraft Singles"?|Kraft|Velveeta|Sargento|Tillamook
FOOD|Brands|2|Which canned soup brand's red-and-white can was made famous in Andy Warhol's art?|Campbell's|Progresso|Heinz|Lipton
FOOD|Brands|2|Which ketchup brand is known for its slow pour and 57 varieties slogan?|Heinz|Hunt's|French's|Del Monte
FOOD|Brands|2|Which mustard brand is known as "yellow mustard" and sponsors a baseball tradition?|French's|Grey Poupon|Gulden's|Heinz
FOOD|Brands|2|Which hot sauce brand has a rooster logo and "Cock Sauce" nickname?|Sriracha (Huy Fong)|Tabasco|Cholula|Frank's RedHot
FOOD|Brands|2|Which candy company makes Skittles and Starburst?|Mars Wrigley|Hershey|Nestlé|Mondelez
FOOD|Brands|2|Which candy is shaped like a small teddy bear and made of gelatin?|Gummy bears|Jelly beans|Skittles|Starburst
FOOD|Brands|2|Which candy bar contains peanuts, caramel, nougat and chocolate?|Snickers|Milky Way|3 Musketeers|Twix
FOOD|Cooking|2|What is the term for cooking food in simmering liquid?|Poaching|Searing|Roasting|Grilling
FOOD|Cooking|2|What is the term for quickly cooking food in very hot oil with constant stirring?|Stir-frying|Braising|Poaching|Baking
FOOD|Cooking|2|What is the term for cooking meat slowly in a covered pot with liquid?|Braising|Searing|Broiling|Grilling
FOOD|Cooking|2|What is the term for cooking food by exposing it directly to a high heat from above?|Broiling|Baking|Poaching|Steaming
FOOD|Cooking|2|What is the French term for "everything in its place" in cooking prep?|Mise en place|Sous vide|Bouquet garni|Roux
FOOD|Cooking|3|What is a mixture of flour and fat used to thicken sauces called?|Roux|Slurry|Béchamel|Reduction
FOOD|Cooking|3|What are the five French "mother sauces" counting béchamel, velouté, espagnole, hollandaise and which other?|Tomato|Mayonnaise|Pesto|Aioli
FOOD|Cooking|2|What is the term for cooking vacuum-sealed food in a water bath at a low temperature?|Sous vide|Poaching|Confit|Braising
FOOD|Cooking|2|What temperature in Fahrenheit does water boil at sea level?|212|200|180|250
FOOD|Cooking|2|What internal temperature in Fahrenheit is recommended for cooked chicken?|165|145|180|130
FOOD|Cooking|2|What do you call the white part of a citrus peel that is bitter?|Pith|Zest|Rind|Flesh
FOOD|Cooking|2|What do you call the colored outer part of citrus peel used for flavor?|Zest|Pith|Rind|Segment
FOOD|Cooking|2|What is the term for egg whites beaten until they stand up in peaks?|Meringue|Soufflé|Custard|Mousse
FOOD|Cooking|2|Which ingredient makes bread rise?|Yeast|Salt|Sugar|Flour
FOOD|Cooking|2|What is the main ingredient in a traditional French baguette?|Flour|Rice flour|Cornmeal|Potato starch
FOOD|Cooking|2|What do you call baking soda and baking powder collectively?|Leavening agents|Thickeners|Emulsifiers|Binders
FOOD|Cooking|2|What is the common name for sodium chloride?|Table salt|Baking soda|Sugar|Borax
FOOD|Cooking|2|What is a "BLT" sandwich made of?|Bacon, lettuce, tomato|Beef, lettuce, tomato|Bread, lettuce, turkey|Brisket, lettuce, tomato
FOOD|Cooking|2|What is the main ingredient of a Reuben sandwich besides corned beef and Swiss?|Sauerkraut|Coleslaw|Pickles|Mustard
FOOD|Cooking|2|What is the meat in a Philadelphia cheesesteak?|Thinly sliced beef|Pork|Chicken|Lamb
FOOD|Cooking|2|What is a "po' boy"?|A New Orleans sandwich on French bread|A hot dog|A burrito|A pasta dish
FOOD|Cooking|2|What is a "croque monsieur"?|A grilled ham and cheese sandwich|A French pastry|A kind of soup|A fish dish
FOOD|Cooking|2|What is the name of the Italian cured ham that is often wrapped around melon?|Prosciutto|Salami|Mortadella|Pancetta
FOOD|Cooking|2|What is the Spanish cured ham called?|Jamón ibérico|Prosciutto|Speck|Bresaola
FOOD|Cooking|2|What does "al dente" mean when cooking pasta?|Firm to the bite|Very soft|Overcooked|Cold
FOOD|Cooking|2|What is a traditional Italian dessert made with espresso-soaked ladyfingers?|Tiramisu|Panna cotta|Cannoli|Zabaglione
FOOD|Cooking|2|What is the filling in a traditional cannoli?|Sweetened ricotta|Chocolate custard|Whipped cream|Mascarpone only
FOOD|Cooking|2|What is the traditional topping on an Italian pizza Margherita?|Tomato, mozzarella and basil|Pepperoni and onions|Ham and pineapple|Mushrooms and olives
FOOD|Cooking|2|Which country gave us the sandwich, named after a nobleman?|England|France|Germany|Italy
FOOD|Cooking|2|Which fruit is the main ingredient in a traditional Waldorf salad?|Apples|Pears|Oranges|Grapes
FOOD|Cooking|2|What is the main ingredient in traditional coleslaw?|Cabbage|Lettuce|Spinach|Kale
FOOD|Cooking|2|What is the type of bread used for Cuban sandwiches?|Cuban bread|Rye|Ciabatta|Brioche
"""

def build():
    ctry = sorted({d[1] for d in DISHES}); dn = [d[0] for d in DISHES]
    for d, c in DISHES:
        add("FOOD", "Dishes of the World", 2, f"Which country is the dish {d} most associated with?", c, pick(ctry, c, "fd" + d))
        add("FOOD", "Dishes of the World", 3, f"Which of these dishes comes from {c}?", d, pick([x[0] for x in DISHES if x[1] != c], d, "rfd" + d)) if sum(1 for x in DISHES if x[1] == c) == 1 else None
    pl = sorted({u[1] for u in US_FOODS})
    for f, p in US_FOODS:
        add("FOOD", "American Foods", 2, f"{f} is most closely associated with which place?", p, pick(pl, p, "uf" + f))
    spirits = sorted({c[1] for c in COCKTAILS})
    for c, s in COCKTAILS:
        add("FOOD", "Cocktails", 2, f"What is the base spirit or main alcohol in a {c}?", s, pick(spirits, s, "ck" + c))
    cc = sorted({c[1] for c in CHEESES})
    for c, k in CHEESES:
        add("FOOD", "Cheese", 2, f"In which country did {c} cheese originate?", k, pick(cc, k, "ch" + c))
    meanings = [p[1] for p in PASTA]
    for p, m in PASTA:
        add("FOOD", "Pasta", 3, f"What does the Italian pasta name {p.lower()} roughly mean?", m, pick(meanings, m, "pm" + p))
    parse_hand(HAND)
