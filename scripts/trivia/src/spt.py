from lib import *

NFL = table("""
Arizona Cardinals|Glendale, Arizona|State Farm Stadium
Atlanta Falcons|Atlanta|Mercedes-Benz Stadium
Baltimore Ravens|Baltimore|M&T Bank Stadium
Buffalo Bills|Orchard Park, New York|Highmark Stadium
Carolina Panthers|Charlotte|Bank of America Stadium
Chicago Bears|Chicago|Soldier Field
Cincinnati Bengals|Cincinnati|Paycor Stadium
Cleveland Browns|Cleveland|Huntington Bank Field
Dallas Cowboys|Arlington, Texas|AT&T Stadium
Denver Broncos|Denver|Empower Field at Mile High
Detroit Lions|Detroit|Ford Field
Green Bay Packers|Green Bay, Wisconsin|Lambeau Field
Houston Texans|Houston|NRG Stadium
Indianapolis Colts|Indianapolis|Lucas Oil Stadium
Jacksonville Jaguars|Jacksonville|EverBank Stadium
Kansas City Chiefs|Kansas City, Missouri|Arrowhead Stadium
Las Vegas Raiders|Las Vegas|Allegiant Stadium
Miami Dolphins|Miami Gardens, Florida|Hard Rock Stadium
Minnesota Vikings|Minneapolis|U.S. Bank Stadium
New England Patriots|Foxborough, Massachusetts|Gillette Stadium
New Orleans Saints|New Orleans|Caesars Superdome
Philadelphia Eagles|Philadelphia|Lincoln Financial Field
Pittsburgh Steelers|Pittsburgh|Acrisure Stadium
San Francisco 49ers|Santa Clara, California|Levi's Stadium
Seattle Seahawks|Seattle|Lumen Field
Tampa Bay Buccaneers|Tampa, Florida|Raymond James Stadium
Tennessee Titans|Nashville|Nissan Stadium
Washington Commanders|Landover, Maryland|Northwest Stadium
""", 3)

# team|city  (for city questions)
CITIES = table("""
Atlanta Hawks|Atlanta
Boston Celtics|Boston
Brooklyn Nets|Brooklyn
Charlotte Hornets|Charlotte
Chicago Bulls|Chicago
Cleveland Cavaliers|Cleveland
Dallas Mavericks|Dallas
Denver Nuggets|Denver
Detroit Pistons|Detroit
Golden State Warriors|San Francisco
Houston Rockets|Houston
Indiana Pacers|Indianapolis
Memphis Grizzlies|Memphis
Miami Heat|Miami
Milwaukee Bucks|Milwaukee
Minnesota Timberwolves|Minneapolis
New Orleans Pelicans|New Orleans
New York Knicks|New York City
Oklahoma City Thunder|Oklahoma City
Orlando Magic|Orlando
Philadelphia 76ers|Philadelphia
Phoenix Suns|Phoenix
Portland Trail Blazers|Portland
Sacramento Kings|Sacramento
San Antonio Spurs|San Antonio
Toronto Raptors|Toronto
Utah Jazz|Salt Lake City
Washington Wizards|Washington, D.C.
Arizona Diamondbacks|Phoenix
Atlanta Braves|Atlanta
Baltimore Orioles|Baltimore
Boston Red Sox|Boston
Chicago Cubs|Chicago
Chicago White Sox|Chicago
Cincinnati Reds|Cincinnati
Cleveland Guardians|Cleveland
Colorado Rockies|Denver
Detroit Tigers|Detroit
Houston Astros|Houston
Kansas City Royals|Kansas City
Los Angeles Angels|Anaheim
Los Angeles Dodgers|Los Angeles
Miami Marlins|Miami
Milwaukee Brewers|Milwaukee
Minnesota Twins|Minneapolis
New York Mets|New York City
New York Yankees|New York City
Philadelphia Phillies|Philadelphia
Pittsburgh Pirates|Pittsburgh
San Diego Padres|San Diego
San Francisco Giants|San Francisco
Seattle Mariners|Seattle
St. Louis Cardinals|St. Louis
Tampa Bay Rays|St. Petersburg
Texas Rangers|Arlington
Toronto Blue Jays|Toronto
Washington Nationals|Washington, D.C.
Anaheim Ducks|Anaheim
Boston Bruins|Boston
Buffalo Sabres|Buffalo
Calgary Flames|Calgary
Carolina Hurricanes|Raleigh
Colorado Avalanche|Denver
Columbus Blue Jackets|Columbus
Dallas Stars|Dallas
Edmonton Oilers|Edmonton
Florida Panthers|Sunrise
Los Angeles Kings|Los Angeles
Montreal Canadiens|Montreal
Nashville Predators|Nashville
New Jersey Devils|Newark
Ottawa Senators|Ottawa
Pittsburgh Penguins|Pittsburgh
San Jose Sharks|San Jose
Seattle Kraken|Seattle
St. Louis Blues|St. Louis
Tampa Bay Lightning|Tampa
Toronto Maple Leafs|Toronto
Vancouver Canucks|Vancouver
Vegas Golden Knights|Las Vegas
Winnipeg Jets|Winnipeg
""", 2)
LEAGUE = {}
for t in "Hawks Celtics Nets Hornets Bulls Cavaliers Mavericks Nuggets Pistons Warriors Rockets Pacers Grizzlies Heat Bucks Timberwolves Pelicans Knicks Thunder Magic 76ers Suns Trail Blazers Kings Spurs Raptors Jazz Wizards".split():
    pass

COLLEGES = table("""
University of Georgia|Bulldogs
Georgia Tech|Yellow Jackets
Alabama|Crimson Tide
Auburn|Tigers
Florida|Gators
Tennessee|Volunteers
LSU|Tigers
Texas A&M|Aggies
Ole Miss|Rebels
Clemson|Tigers
Notre Dame|Fighting Irish
Michigan|Wolverines
Ohio State|Buckeyes
Duke|Blue Devils
North Carolina|Tar Heels
Kentucky|Wildcats
UConn|Huskies
Kansas|Jayhawks
Texas|Longhorns
Oregon|Ducks
Penn State|Nittany Lions
Nebraska|Cornhuskers
Oklahoma|Sooners
Florida State|Seminoles
Miami|Hurricanes
Virginia Tech|Hokies
UCLA|Bruins
USC|Trojans
Wisconsin|Badgers
Iowa|Hawkeyes
Michigan State|Spartans
Arkansas|Razorbacks
Missouri|Tigers
South Carolina|Gamecocks
Vanderbilt|Commodores
Mississippi State|Bulldogs
Syracuse|Orange
Villanova|Wildcats
Purdue|Boilermakers
Arizona|Wildcats
""", 2)

SUMMER = table("""
1948|London
1952|Helsinki
1956|Melbourne
1960|Rome
1964|Tokyo
1968|Mexico City
1972|Munich
1976|Montreal
1980|Moscow
1984|Los Angeles
1988|Seoul
1992|Barcelona
1996|Atlanta
2000|Sydney
2004|Athens
2008|Beijing
2012|London
2016|Rio de Janeiro
2020|Tokyo
2024|Paris
""", 2)
WINTER = table("""
1980|Lake Placid
1984|Sarajevo
1988|Calgary
1992|Albertville
1994|Lillehammer
1998|Nagano
2002|Salt Lake City
2006|Turin
2010|Vancouver
2014|Sochi
2018|PyeongChang
2022|Beijing
""", 2)

# year|winner|host
WORLDCUP = table("""
1930|Uruguay|Uruguay
1934|Italy|Italy
1938|Italy|France
1950|Uruguay|Brazil
1954|West Germany|Switzerland
1958|Brazil|Sweden
1962|Brazil|Chile
1966|England|England
1970|Brazil|Mexico
1974|West Germany|West Germany
1978|Argentina|Argentina
1982|Italy|Spain
1986|Argentina|Mexico
1990|West Germany|Italy
1994|Brazil|United States
1998|France|France
2002|Brazil|Japan and South Korea
2006|Italy|Germany
2010|Spain|South Africa
2014|Germany|Brazil
2018|France|Russia
2022|Argentina|Qatar
""", 3)

# roman|year|winner (year = game date)
SB = table("""
I|1967|Green Bay Packers
II|1968|Green Bay Packers
III|1969|New York Jets
IV|1970|Kansas City Chiefs
V|1971|Baltimore Colts
VI|1972|Dallas Cowboys
VII|1973|Miami Dolphins
VIII|1974|Miami Dolphins
IX|1975|Pittsburgh Steelers
X|1976|Pittsburgh Steelers
XI|1977|Oakland Raiders
XII|1978|Dallas Cowboys
XIII|1979|Pittsburgh Steelers
XIV|1980|Pittsburgh Steelers
XV|1981|Oakland Raiders
XVI|1982|San Francisco 49ers
XVII|1983|Washington Redskins
XVIII|1984|Los Angeles Raiders
XIX|1985|San Francisco 49ers
XX|1986|Chicago Bears
XXI|1987|New York Giants
XXII|1988|Washington Redskins
XXIII|1989|San Francisco 49ers
XXIV|1990|San Francisco 49ers
XXV|1991|New York Giants
XXVI|1992|Washington Redskins
XXVII|1993|Dallas Cowboys
XXVIII|1994|Dallas Cowboys
XXIX|1995|San Francisco 49ers
XXX|1996|Dallas Cowboys
XXXI|1997|Green Bay Packers
XXXII|1998|Denver Broncos
XXXIII|1999|Denver Broncos
XXXIV|2000|St. Louis Rams
XXXV|2001|Baltimore Ravens
XXXVI|2002|New England Patriots
XXXVII|2003|Tampa Bay Buccaneers
XXXVIII|2004|New England Patriots
XXXIX|2005|New England Patriots
XL|2006|Pittsburgh Steelers
XLI|2007|Indianapolis Colts
XLII|2008|New York Giants
XLIII|2009|Pittsburgh Steelers
XLIV|2010|New Orleans Saints
XLV|2011|Green Bay Packers
XLVI|2012|New York Giants
XLVII|2013|Baltimore Ravens
XLVIII|2014|Seattle Seahawks
XLIX|2015|New England Patriots
50|2016|Denver Broncos
LI|2017|New England Patriots
LII|2018|Philadelphia Eagles
LIII|2019|New England Patriots
LIV|2020|Kansas City Chiefs
LV|2021|Tampa Bay Buccaneers
LVI|2022|Los Angeles Rams
LVII|2023|Kansas City Chiefs
LVIII|2024|Kansas City Chiefs
LIX|2025|Philadelphia Eagles
""", 3)

WS = table("""
2000|New York Yankees
2001|Arizona Diamondbacks
2002|Anaheim Angels
2003|Florida Marlins
2004|Boston Red Sox
2005|Chicago White Sox
2006|St. Louis Cardinals
2007|Boston Red Sox
2008|Philadelphia Phillies
2009|New York Yankees
2010|San Francisco Giants
2011|St. Louis Cardinals
2012|San Francisco Giants
2013|Boston Red Sox
2014|San Francisco Giants
2015|Kansas City Royals
2016|Chicago Cubs
2017|Houston Astros
2018|Boston Red Sox
2019|Washington Nationals
2020|Los Angeles Dodgers
2021|Atlanta Braves
2022|Houston Astros
2023|Texas Rangers
2024|Los Angeles Dodgers
""", 2)

NBA = table("""
1991|Chicago Bulls
1992|Chicago Bulls
1993|Chicago Bulls
1994|Houston Rockets
1995|Houston Rockets
1996|Chicago Bulls
1997|Chicago Bulls
1998|Chicago Bulls
1999|San Antonio Spurs
2000|Los Angeles Lakers
2001|Los Angeles Lakers
2002|Los Angeles Lakers
2003|San Antonio Spurs
2004|Detroit Pistons
2005|San Antonio Spurs
2006|Miami Heat
2007|San Antonio Spurs
2008|Boston Celtics
2009|Los Angeles Lakers
2010|Los Angeles Lakers
2011|Dallas Mavericks
2012|Miami Heat
2013|Miami Heat
2014|San Antonio Spurs
2015|Golden State Warriors
2016|Cleveland Cavaliers
2017|Golden State Warriors
2018|Golden State Warriors
2019|Toronto Raptors
2020|Los Angeles Lakers
2021|Milwaukee Bucks
2022|Golden State Warriors
2023|Denver Nuggets
2024|Boston Celtics
2025|Oklahoma City Thunder
""", 2)

# athlete|sport|(team or country)
ATH = table("""
LeBron James|Basketball|Lakers
Michael Jordan|Basketball|Bulls
Stephen Curry|Basketball|Warriors
Kobe Bryant|Basketball|Lakers
Shaquille O'Neal|Basketball|Lakers
Tom Brady|Football|Patriots
Patrick Mahomes|Football|Chiefs
Peyton Manning|Football|Colts
Jerry Rice|Football|49ers
Deion Sanders|Football|Falcons
Derek Jeter|Baseball|Yankees
Babe Ruth|Baseball|Yankees
Hank Aaron|Baseball|Braves
Jackie Robinson|Baseball|Dodgers
Shohei Ohtani|Baseball|Dodgers
Wayne Gretzky|Hockey|Oilers
Tiger Woods|Golf|-
Serena Williams|Tennis|-
Roger Federer|Tennis|-
Usain Bolt|Track and field|-
Michael Phelps|Swimming|-
Simone Biles|Gymnastics|-
Lionel Messi|Soccer|-
Cristiano Ronaldo|Soccer|-
Pelé|Soccer|-
Muhammad Ali|Boxing|-
Mike Tyson|Boxing|-
Jack Nicklaus|Golf|-
Arnold Palmer|Golf|-
Tony Hawk|Skateboarding|-
Lindsey Vonn|Alpine skiing|-
Mia Hamm|Soccer|-
Venus Williams|Tennis|-
Rafael Nadal|Tennis|-
Novak Djokovic|Tennis|-
Dale Earnhardt|Auto racing|-
Jimmie Johnson|Auto racing|-
Lewis Hamilton|Auto racing|-
Katie Ledecky|Swimming|-
Caitlin Clark|Basketball|-
Dan Marino|Football|Dolphins
Joe Montana|Football|49ers
""", 3)

HAND = """
SPT|Football|1|How many points is a touchdown worth in American football?|6|7|3|8
SPT|Football|1|How many points is a field goal worth?|3|2|6|1
SPT|Football|2|How many players does each team have on the field in American football?|11|9|10|12
SPT|Football|2|How long is an American football field, excluding end zones?|100 yards|110 yards|90 yards|120 yards
SPT|Football|2|What is the name of the trophy awarded to the Super Bowl winner?|Vince Lombardi Trophy|Heisman Trophy|Stanley Cup|Larry O'Brien Trophy
SPT|Football|2|What is the name of the award given to the best college football player each year?|Heisman Trophy|Maxwell Award|Doak Walker Award|Lombardi Award
SPT|Football|2|Which college has won the most national championships in football history?|Alabama|Notre Dame|Ohio State|Georgia
SPT|Football|2|Which quarterback has won the most Super Bowls, with seven?|Tom Brady|Joe Montana|Patrick Mahomes|Peyton Manning
SPT|Football|2|Which team did Tom Brady win his sixth Super Bowl with?|Patriots|Buccaneers|Chiefs|Colts
SPT|Football|2|What city is home to the Pro Football Hall of Fame?|Canton, Ohio|Cleveland|Pittsburgh|Green Bay
SPT|Football|2|What is the term for the line on the field that the offense must cross to gain a first down?|Line to gain|Line of scrimmage|Goal line|Red zone
SPT|Football|2|How many yards must an offense gain in four downs to earn a new set of downs?|10|5|15|20
SPT|Football|2|What do you call a score of 2 points on a safety?|Safety|Conversion|Two-point try|Field goal
SPT|Football|2|Which NFL team is known as "America's Team"?|Dallas Cowboys|Green Bay Packers|Pittsburgh Steelers|San Francisco 49ers
SPT|Football|3|Which NFL team went 17-0 in 1972, the only perfect season in NFL history?|Miami Dolphins|Chicago Bears|New England Patriots|Pittsburgh Steelers
SPT|Football|2|Which football coach is known for winning six Super Bowls with the New England Patriots?|Bill Belichick|Vince Lombardi|Bill Walsh|Tom Landry
SPT|Football|2|Which SEC school is based in Athens, Georgia?|Georgia Bulldogs|Auburn Tigers|Florida Gators|Tennessee Volunteers
SPT|Football|2|What is the annual rivalry game between Georgia and Georgia Tech called?|Clean, Old-Fashioned Hate|The Iron Bowl|The Red River Showdown|The Egg Bowl
SPT|Football|2|What is the annual rivalry game between Alabama and Auburn called?|Iron Bowl|Egg Bowl|Red River Rivalry|Apple Cup
SPT|Football|2|What is the annual rivalry game between Georgia and Florida called?|World's Largest Outdoor Cocktail Party|Iron Bowl|Egg Bowl|The Game
SPT|Football|2|What is the name of the Georgia Bulldogs' mascot?|Uga|Hairy Dawg|Big Al|Albert
SPT|Football|2|Which stadium is nicknamed "Between the Hedges"?|Sanford Stadium|Bobby Dodd Stadium|Jordan-Hare Stadium|Ben Hill Griffin Stadium
SPT|Football|2|Which Georgia stadium is nicknamed "The Grove"? (hint: Not Georgia) skip|x|x|x|x
SPT|Basketball|1|How many players are on the court for each team in basketball?|5|6|7|4
SPT|Basketball|2|How many points is a shot from beyond the three-point line worth?|3|2|4|1
SPT|Basketball|2|What is the height of a standard basketball hoop in feet?|10|8|12|9
SPT|Basketball|2|What is the name of the trophy awarded to the NBA champions?|Larry O'Brien Trophy|Stanley Cup|Lombardi Trophy|Commissioner's Trophy
SPT|Basketball|2|Which NBA player is known as "King James"?|LeBron James|Kevin Durant|Stephen Curry|Giannis Antetokounmpo
SPT|Basketball|2|Which player scored 100 points in a single NBA game in 1962?|Wilt Chamberlain|Michael Jordan|Kobe Bryant|Bill Russell
SPT|Basketball|3|Which player has won the most NBA championships with 11?|Bill Russell|Michael Jordan|Kareem Abdul-Jabbar|Robert Horry
SPT|Basketball|2|Which team has won the most NBA championships along with the Lakers?|Boston Celtics|Chicago Bulls|San Antonio Spurs|Golden State Warriors
SPT|Basketball|2|Which player is nicknamed "Air Jordan"?|Michael Jordan|LeBron James|Dominique Wilkins|Julius Erving
SPT|Basketball|2|Which Atlanta Hawks star was nicknamed "The Human Highlight Film"?|Dominique Wilkins|Spud Webb|Pete Maravich|Dikembe Mutombo
SPT|Basketball|2|Which college team is the Duke Blue Devils' main rival in basketball?|North Carolina|Kentucky|Kansas|UConn
SPT|Basketball|2|What is the college basketball tournament held every March called?|March Madness|Final Four|Frozen Four|Rose Bowl
SPT|Basketball|2|Which coach led Duke basketball for 42 years, winning five national titles?|Mike Krzyzewski|Dean Smith|Roy Williams|John Wooden
SPT|Basketball|2|Which UCLA coach won ten NCAA championships in 12 years?|John Wooden|Bob Knight|Adolph Rupp|Dean Smith
SPT|Basketball|2|In which city does the WNBA's Atlanta team play?|Atlanta|Savannah|Macon|Athens
SPT|Baseball|1|How many strikes make an out in baseball?|3|4|2|5
SPT|Baseball|1|How many balls make a walk in baseball?|4|3|5|6
SPT|Baseball|1|How many innings are in a standard professional baseball game?|9|7|8|10
SPT|Baseball|2|How many players are on the field for the defense in baseball?|9|8|10|11
SPT|Baseball|2|What is the distance between bases in Major League Baseball?|90 feet|60 feet|100 feet|75 feet
SPT|Baseball|2|Which baseball player is known as "The Bambino"?|Babe Ruth|Lou Gehrig|Ty Cobb|Joe DiMaggio
SPT|Baseball|2|Which baseball player is known as "The Iron Horse"?|Lou Gehrig|Cal Ripken Jr.|Babe Ruth|Ty Cobb
SPT|Baseball|2|Which player holds the MLB career home run record with 762?|Barry Bonds|Hank Aaron|Babe Ruth|Alex Rodriguez
SPT|Baseball|2|Which Atlanta Braves legend broke Babe Ruth's career home run record in 1974?|Hank Aaron|Chipper Jones|Dale Murphy|Greg Maddux
SPT|Baseball|2|Which Atlanta Braves third baseman retired in 2012 and was inducted into the Hall of Fame in 2018?|Chipper Jones|Freddie Freeman|Andruw Jones|Brian McCann
SPT|Baseball|2|What is the name of the Atlanta Braves' stadium opened in 2017?|Truist Park|Turner Field|Fulton County Stadium|Mercedes-Benz Stadium
SPT|Baseball|2|What was the name of the Braves' home stadium from 1997 to 2016?|Turner Field|Truist Park|Fulton County Stadium|Georgia Dome
SPT|Baseball|2|What is the term for a perfect game in which no batter reaches base?|Perfect game|No-hitter|Shutout|Cycle
SPT|Baseball|2|Which baseball player played 2,632 consecutive games, a record broken by Cal Ripken Jr.?|Lou Gehrig|Pete Rose|Joe DiMaggio|Mickey Mantle
SPT|Baseball|2|Which player is MLB's all-time hits leader with 4,256 hits?|Pete Rose|Ty Cobb|Hank Aaron|Derek Jeter
SPT|Baseball|2|What number did Jackie Robinson wear, now retired across Major League Baseball?|42|24|44|21
SPT|Baseball|2|Which stadium is home to the Chicago Cubs and has ivy-covered outfield walls?|Wrigley Field|Fenway Park|Dodger Stadium|Yankee Stadium
SPT|Baseball|2|Which stadium is home to the Boston Red Sox and features the "Green Monster"?|Fenway Park|Wrigley Field|Camden Yards|Oracle Park
SPT|Baseball|2|Which city hosts the Little League World Series each August?|Williamsport, Pennsylvania|Cooperstown, New York|Cleveland, Ohio|Omaha, Nebraska
SPT|Baseball|2|Which small town in New York is home to the Baseball Hall of Fame?|Cooperstown|Canton|Springfield|Williamsport
SPT|Baseball|2|Which college baseball tournament takes place in Omaha, Nebraska?|College World Series|Little League World Series|World Baseball Classic|NCAA Frozen Four
SPT|Hockey|2|How many players does each team have on the ice, including the goalie?|6|5|7|4
SPT|Hockey|2|What is the NHL championship trophy called?|Stanley Cup|Lombardi Trophy|Larry O'Brien Trophy|Commissioner's Trophy
SPT|Hockey|2|Which player is nicknamed "The Great One"?|Wayne Gretzky|Mario Lemieux|Gordie Howe|Bobby Orr
SPT|Hockey|2|What is the hockey puck made of?|Vulcanized rubber|Plastic|Wood|Cork
SPT|Hockey|2|Which country has produced the most NHL players?|Canada|United States|Sweden|Russia
SPT|Hockey|2|In 1980, the U.S. hockey team's upset over the Soviet Union is known as the what?|Miracle on Ice|Cold War Cup|Lake Placid Gold|Frozen Fury
SPT|Soccer|1|How many players are on the field for one soccer team?|11|10|9|12
SPT|Soccer|2|Which country has won the most men's World Cups, with five titles?|Brazil|Germany|Italy|Argentina
SPT|Soccer|2|Which player scored the "Hand of God" goal in the 1986 World Cup?|Diego Maradona|Pelé|Lionel Messi|Zinedine Zidane
SPT|Soccer|2|Which player won the 2022 World Cup with Argentina?|Lionel Messi|Neymar|Kylian Mbappé|Cristiano Ronaldo
SPT|Soccer|2|Which soccer club is nicknamed the "Red Devils"?|Manchester United|Liverpool|Arsenal|Chelsea
SPT|Soccer|2|Which soccer club plays at Anfield?|Liverpool|Manchester City|Everton|Tottenham
SPT|Soccer|2|Which soccer club plays at Old Trafford?|Manchester United|Manchester City|Liverpool|Leeds United
SPT|Soccer|2|Which Spanish club is known as "Los Blancos"?|Real Madrid|Barcelona|Atlético Madrid|Valencia
SPT|Soccer|2|Which MLS team is based in Atlanta?|Atlanta United|Atlanta Dream|Atlanta Hawks|Atlanta Falcons
SPT|Soccer|2|In soccer, what color card means a player is sent off?|Red|Yellow|Green|Blue
SPT|Soccer|2|What is the term for three goals scored by one player in a game?|Hat trick|Triple play|Trifecta|Treble goal
SPT|Soccer|2|Which tournament is the top club competition in Europe?|UEFA Champions League|Copa Libertadores|Europa League|FA Cup
SPT|Soccer|2|Which U.S. woman's player has the record for most international goals, with 184?|Abby Wambach|Mia Hamm|Carli Lloyd|Alex Morgan
SPT|Golf|2|How many holes are played in a standard round of golf?|18|9|12|20
SPT|Golf|2|What is the term for one stroke under par on a hole?|Birdie|Eagle|Bogey|Albatross
SPT|Golf|2|What is the term for two strokes under par on a hole?|Eagle|Birdie|Albatross|Bogey
SPT|Golf|2|What is the term for one stroke over par on a hole?|Bogey|Birdie|Double bogey|Par
SPT|Golf|2|Which golf tournament awards a green jacket to its winner?|The Masters|U.S. Open|The Open Championship|PGA Championship
SPT|Golf|2|Which Georgia golf course hosts the Masters?|Augusta National|Sea Island|East Lake|TPC Sawgrass
SPT|Golf|2|Which Atlanta course hosts the Tour Championship?|East Lake Golf Club|Augusta National|Peachtree|Sea Island
SPT|Golf|3|Who is the youngest player to win the Masters, in 1997 at age 21?|Tiger Woods|Jordan Spieth|Rory McIlroy|Seve Ballesteros
SPT|Golf|2|Which golf tournament is the oldest of the four majors?|The Open Championship|The Masters|U.S. Open|PGA Championship
SPT|Golf|2|Which Scottish town is known as the "home of golf"?|St Andrews|Edinburgh|Glasgow|Aberdeen
SPT|Tennis|2|Which tennis tournament is played on grass in London?|Wimbledon|U.S. Open|French Open|Australian Open
SPT|Tennis|2|Which tennis tournament is played on clay in Paris?|French Open (Roland Garros)|Wimbledon|U.S. Open|Australian Open
SPT|Tennis|2|How many Grand Slam tournaments are there each year?|4|3|5|6
SPT|Tennis|2|What is a score of zero in tennis called?|Love|Nil|Zero|Duck
SPT|Tennis|2|Who has won the most men's Grand Slam singles titles with 24?|Novak Djokovic|Rafael Nadal|Roger Federer|Pete Sampras
SPT|Tennis|2|Who has won 23 Grand Slam singles titles in the Open Era?|Serena Williams|Steffi Graf|Margaret Court|Martina Navratilova
SPT|Olympics|1|How many rings are on the Olympic flag?|5|4|6|7
SPT|Olympics|2|Which athlete has won the most Olympic gold medals, with 23?|Michael Phelps|Usain Bolt|Carl Lewis|Mark Spitz
SPT|Olympics|2|Which sprinter holds the 100-meter world record of 9.58 seconds?|Usain Bolt|Justin Gatlin|Carl Lewis|Tyson Gay
SPT|Olympics|2|Which country hosted the first modern Olympic Games in 1896?|Greece|France|United States|England
SPT|Olympics|2|Which city hosted the first Winter Olympics in 1924?|Chamonix|Lake Placid|Oslo|St. Moritz
SPT|Olympics|2|Which ancient Greek city is the birthplace of the Olympic Games?|Olympia|Athens|Sparta|Corinth
SPT|Olympics|2|What do Olympic gold, silver and bronze medals represent?|1st, 2nd and 3rd place|Participation levels|Team sizes|Countries
SPT|Olympics|2|Which gymnast won four gold medals at the 2016 Rio Olympics?|Simone Biles|Gabby Douglas|Aly Raisman|Nastia Liukin
SPT|Olympics|2|Which famous 1996 Atlanta event drew attention to the Olympic Park bombing?|Centennial Olympic Park bombing|Dream Team|Torch relay|Muhammad Ali torch
SPT|Olympics|2|Who lit the Olympic cauldron at the 1996 Atlanta Games?|Muhammad Ali|Michael Johnson|Carl Lewis|Evander Holyfield
SPT|Olympics|2|What was the U.S. men's basketball team known as in the 1992 Barcelona Olympics?|The Dream Team|The Redeem Team|The Fab Five|The Avengers
SPT|Other|2|How many rings are in a standard dartboard's bullseye outer and inner... no skip|x|x|x|x
SPT|Other|2|In bowling, what is the term for knocking down all pins on the first roll?|Strike|Spare|Split|Gutter
SPT|Other|2|In bowling, what is the maximum score in a game?|300|200|250|400
SPT|Other|2|What is the term for 12 consecutive strikes in bowling?|Perfect game|Turkey|Hambone|Grand slam
SPT|Other|2|In which sport would you perform a slam dunk?|Basketball|Volleyball|Tennis|Handball
SPT|Other|2|In which sport would you perform a pommel horse routine?|Gymnastics|Equestrian|Diving|Wrestling
SPT|Other|2|In which sport do competitors use a "shuttlecock"?|Badminton|Tennis|Squash|Table tennis
SPT|Other|2|What sport is played at Wimbledon?|Tennis|Cricket|Badminton|Polo
SPT|Other|2|In which sport would you find a "scrum"?|Rugby|Soccer|Cricket|Lacrosse
SPT|Other|2|In which sport would you find a "wicket"?|Cricket|Rugby|Baseball|Croquet
SPT|Other|2|What is the term for a score of 100 in cricket?|Century|Hundred|Ton|Double
SPT|Other|2|What sport uses the terms "birdie," "bogey" and "par"?|Golf|Tennis|Bowling|Cricket
SPT|Other|2|In what sport is the "Tour de France" held?|Cycling|Running|Triathlon|Rowing
SPT|Other|2|What color jersey does the overall leader of the Tour de France wear?|Yellow|Green|Polka dot|White
SPT|Other|2|What is the name of the world's most famous marathon, held every April in Massachusetts?|Boston Marathon|New York City Marathon|Chicago Marathon|London Marathon
SPT|Other|2|How many miles long is a marathon?|26.2|24.2|20|30
SPT|Other|2|What is the NASCAR season's biggest race, held at Daytona in February?|Daytona 500|Indianapolis 500|Coca-Cola 600|Southern 500
SPT|Other|2|Which 500-mile race is held each May in Indiana?|Indianapolis 500|Daytona 500|Coca-Cola 600|Talladega 500
SPT|Other|2|Which Georgia NASCAR track is located south of Atlanta, in Hampton?|Atlanta Motor Speedway|Talladega|Daytona|Bristol
SPT|Other|2|Which Formula One driver has won the most world championships, tied at seven?|Lewis Hamilton and Michael Schumacher|Ayrton Senna|Max Verstappen|Sebastian Vettel
SPT|Other|2|In what sport do athletes compete for the America's Cup?|Sailing|Rowing|Surfing|Water polo
SPT|Other|2|What is the highest belt color in judo, traditionally?|Black|Red|Brown|White
SPT|Other|2|Which sport is the UFC associated with?|Mixed martial arts|Wrestling|Boxing|Kickboxing
SPT|Other|2|What is the traditional Japanese sport of sumo wrestling's ring called?|Dohyō|Tatami|Dojo|Mat
SPT|Other|2|Which sport features a "pitcher," "batter" and "catcher"?|Baseball|Cricket|Softball only|Kickball
"""

def build():
    # NFL
    teams = [t[0] for t in NFL]; stadia = [t[2] for t in NFL]; homes = [t[1] for t in NFL]
    for t, h, s in NFL:
        add("SPT", "NFL", 2, f"Which NFL team plays its home games at {s}?", t, pick(teams, t, "nfl" + s))
        add("SPT", "NFL", 2, f"Where do the {t} play their home games, by city or area?", h, pick(homes, h, "nflh" + t))
        add("SPT", "NFL", 3, f"What is the home stadium of the {t}?", s, pick(stadia, s, "nfls" + t))
    cities = sorted({c[1] for c in CITIES}); nicks = [c[0] for c in CITIES]
    for t, c in CITIES:
        add("SPT", "Pro Teams", 2, f"In which city do the {t} play their home games?", c, pick(cities, c, "ct" + t))
    nicknames = sorted({c[1] for c in COLLEGES})
    schools = [c[0] for c in COLLEGES]
    for s, n in COLLEGES:
        add("SPT", "College Sports", 2, f"What is the team nickname of {s}'s athletic teams?", n, pick(nicknames, n, "col" + s))
    sc = [c[1] for c in SUMMER]
    for y, c in SUMMER:
        add("SPT", "Olympics", 2 if int(y) >= 1992 else 3, f"Which city hosted the {y} Summer Olympics?", c, pick(sc, c, "su" + y))
    wc = [c[1] for c in WINTER]
    for y, c in WINTER:
        add("SPT", "Olympics", 3, f"Which city hosted the {y} Winter Olympics?", c, pick(wc, c, "wi" + y))
    nations = sorted({w[1] for w in WORLDCUP} | {w[2] for w in WORLDCUP})
    for y, w, h in WORLDCUP:
        add("SPT", "World Cup", 3, f"Which nation won the men's FIFA World Cup in {y}?", w, pick(nations, w, "wcw" + y))
        add("SPT", "World Cup", 3, f"Which country hosted the men's FIFA World Cup in {y}?", h, pick(nations, h, "wch" + y))
    sbt = sorted({s[2] for s in SB})
    for r, y, w in SB:
        add("SPT", "Super Bowl", 3 if int(y) < 2000 else 2, f"Which team won Super Bowl {r}, played in {y}?", w, pick(sbt, w, "sb" + r))
    wst = sorted({s[1] for s in WS})
    for y, t in WS:
        add("SPT", "World Series", 2, f"Which team won the {y} World Series?", t, pick(wst, t, "ws" + y))
    nbt = sorted({s[1] for s in NBA})
    for y, t in NBA:
        add("SPT", "NBA Champions", 2, f"Which team won the NBA championship in {y}?", t, pick(nbt, t, "nba" + y))
    sports = sorted({a[1] for a in ATH}); aths = [a[0] for a in ATH]
    for a, s, t in ATH:
        add("SPT", "Athletes", 1 if a in ("LeBron James", "Michael Jordan", "Tom Brady", "Serena Williams", "Tiger Woods", "Usain Bolt", "Lionel Messi", "Michael Phelps", "Simone Biles", "Muhammad Ali", "Babe Ruth", "Wayne Gretzky", "Cristiano Ronaldo") else 2,
            f"In which sport is {a} best known?", s, pick(sports, s, "at" + a))
    parse_hand(HAND)
