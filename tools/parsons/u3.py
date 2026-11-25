"""Unit 3 Parsons problems + code-tracing problems. Every solution is RUN here; the generated data file only ships if all of them match.
usage: python3 tools/parsons/u3.py   ->  writes python/parsons-u3.js"""
import json,io,contextlib,sys,random,copy
# brand colors match python/workplace.js
B={'spotify':('Spotify','#1DB954','#121212'),'apple':('Apple','#0071E3','#1D1D1F'),'cfa':('Chick-fil-A','#E51636','#E51636'),'steam':('Steam','#1B6FA8','#171A21'),'tiktok':('TikTok','#FE2C55','#010101'),'airbnb':('Airbnb','#E0383E','#E0383E'),'gmail':('Gmail','#D93025','#D93025'),'dd':('DoorDash','#EB1700','#EB1700'),'yt':('YouTube','#CC0000','#0F0F0F'),'ups':('UPS','#351C15','#351C15'),'delta':('Delta','#C01933','#003366'),'tesla':('Tesla','#CC0000','#171A20'),'roblox':('Roblox','#E2231A','#232527')}
L=[]   # lessons
def lesson(id_,num,title,brand,probs): L.append(dict(id=id_,num=num,title=title,brand=B[brand],probs=probs))
def P(title,story,sol,distract,groups=None,ins=None):
    return dict(title=title,story=story,sol=sol.strip('\n').split('\n'),distract=distract,groups=groups or [],ins=ins or [])

lesson('u3l1','3.1','Variable Names','spotify',[
 P('Store the song facts','Spotify needs a script that stores three facts about ONE song: its title (Blinding Lights), its artist (The Weeknd), and its play count (4000000). Then it prints only the title. Name the variables the way the style guide says: lowercase words joined by underscores, no spaces, never starting with a digit.',
   'track_title = "Blinding Lights"\nartist_name = "The Weeknd"\nplay_count = 4000000\nprint(track_title)',
   ['print(Track_Title)','2nd_song = "As It Was"','top song = "Flowers"'],groups=[[0,1,2]]),
 P('Print two labeled facts','Spotify wants a card with two labeled facts. Store the song length in seconds (200) and the rating (4.8). Then print the label LENGTH IN SECONDS followed by the length, then the label RATING followed by the rating, each on its own line. Only legal variable names will work.',
   'length_seconds = 200\nrating = 4.8\nprint("LENGTH IN SECONDS")\nprint(length_seconds)\nprint("RATING")\nprint(rating)',
   ['print(length-seconds)','rating == 4.8'],groups=[[0,1]]),
])
lesson('u3l2','3.2','Storing Strings, Ints, Floats, and Booleans','apple',[
 P('Battery page facts','Apple\'s Battery Health page needs four facts about one phone: its model name (text), its charge cycles (a whole number), its battery health (a decimal number), and whether it is charging (True or False). Store all four, then print the model name, then the battery health.',
   'model_name = "iPhone 15"\nbattery_cycles = 312\nbattery_health = 91.5\nis_charging = True\nprint(model_name)\nprint(battery_health)',
   ['model_name = iPhone 15','is_charging = true'],groups=[[0,1,2,3]]),
 P('One more charge cycle','The phone just finished one more charge cycle. Start the cycle count at 312, add 1 to it, then print the label CYCLES and, on the next line, the new count.',
   'battery_cycles = 312\nbattery_cycles = battery_cycles + 1\nprint("CYCLES")\nprint(battery_cycles)',
   ['battery_cycles + 1 = battery_cycles','print("battery_cycles")']),
])
lesson('u3l3','3.3','Getting Input From the User','cfa',[
 P('Name on the order','The Chick-fil-A kiosk asks for a name. Ask the question Name for the order? , store the typed name in a variable, then print Order for followed by the name on one line. (In this example the customer types Sam.)',
   'name = input("Name for the order? ")\nprint("Order for " + name)',
   ['print("Order for " + Name)','input = name','name = input(Name for the order?)'],ins=['Sam']),
 P('Sandwich total','Each sandwich costs 5 dollars. Ask how many sandwiches the customer wants, turn the answer into a whole number, multiply it by 5 for the total, and print Total: followed by the amount. (The customer types 3.)',
   'count = int(input("How many sandwiches? "))\ntotal = count * 5\nprint("Total: " + str(total))',
   ['count = input("How many sandwiches? ")','print("Total: " + total)'],ins=['3']),
])
lesson('u3l4','3.4','Joining Strings, Ints, Floats, and Booleans','steam',[
 P('Purchase receipt line','Steam needs one receipt line. Store the game name (Hades) and its price (24.99), then print ONE line that reads: Bought Hades for $24.99 (join the pieces together; the price has to be turned into text first).',
   'game = "Hades"\nprice = 24.99\nprint("Bought " + game + " for $" + str(price))',
   ['print("Bought " + game + " for $" + price)'],groups=[[0,1]]),
 P('Full name','Steam shows full names. Store the first name (Gabe) and the last name (Newell), join them with a space between them, store the result in full, and print it.',
   'first = "Gabe"\nlast = "Newell"\nfull = first + " " + last\nprint(full)',
   ['full = first + last','print(Full)'],groups=[[0,1]]),
])
lesson('u3l5','3.5','Indexing: Pulling One Character From a String','tiktok',[
 P('First letter badge','TikTok makes a badge from the username dance_queen. Store the username, store its first character in first_letter, and print first_letter.',
   'username = "dance_queen"\nfirst_letter = username[0]\nprint(first_letter)',
   ['first_letter = username[1]','first_letter = username(0)']),
 P('First and last','Store the username dance_queen. Store its first character in first_letter and its last character in last_letter, then print Badge: followed by the two letters joined together.',
   'username = "dance_queen"\nfirst_letter = username[0]\nlast_letter = username[-1]\nprint("Badge: " + first_letter + last_letter)',
   ['last_letter = username[len(username)]','last_letter = username[-0]'],groups=[[1,2]]),
])
lesson('u3l6','3.6','Slicing: Pulling a Piece Out of a String','airbnb',[
 P('Code prefix','Airbnb confirmation codes start with a 3-character prefix. Store the code HMX7Q2R9, store its first three characters in prefix, and print the prefix.',
   'confirmation = "HMX7Q2R9"\nprefix = confirmation[:3]\nprint(prefix)',
   ['prefix = confirmation[3:]','prefix = confirmation(:3)']),
 P('Split the code','Store the code HMX7Q2R9. Store its first three characters in start, and the characters from index 4 to the end in end. Then print start, a dash, and end on one line.',
   'confirmation = "HMX7Q2R9"\nstart = confirmation[:3]\nend = confirmation[4:]\nprint(start + "-" + end)',
   ['end = confirmation[:4]','print(start + end)'],groups=[[1,2]]),
])
lesson('u3l7','3.7','Finding Text With .find()','gmail',[
 P('Where is the @?','Gmail needs to know where the @ sign is. Store the address sam@gmail.com, use .find to get the position of the @, and print that position.',
   'email = "sam@gmail.com"\nat = email.find("@")\nprint(at)',
   ['at = email.find[@]','print(email.at)']),
 P('Pull out the username','Store sam@gmail.com, find the position of the @, store everything BEFORE the @ in username, and print the username.',
   'email = "sam@gmail.com"\nat = email.find("@")\nusername = email[:at]\nprint(username)',
   ['username = email[at:]','at = email.find("@"']),
])
lesson('u3l8','3.8','Math With Numbers From the User','dd',[
 P('Tip calculator','DoorDash: ask for the bill, turn the answer into a decimal number, multiply it by 0.2 for a 20 percent tip, and print Tip: followed by the tip. (The customer types 20.)',
   'bill = float(input("Bill: "))\ntip = bill * 0.2\nprint("Tip: " + str(tip))',
   ['bill = input("Bill: ")','print("Tip: " + tip)'],ins=['20']),
 P('Bill plus tip','Ask for the bill (as a decimal number), work out the 20 percent tip, add the tip to the bill to get the total, and print Total: followed by the total. (The customer types 20.)',
   'bill = float(input("Bill: "))\ntip = bill * 0.2\ntotal = bill + tip\nprint("Total: " + str(total))',
   ['total = bill + 0.2','total = tip - bill'],ins=['20']),
])
lesson('u3l9','3.9','Division That Gives a Float ( / )','yt',[
 P('Average views','YouTube: store 1200 total views and 5 videos. Divide the views by the videos to get the average views per video (a decimal number) and print it.',
   'views = 1200\nvideos = 5\naverage = views / videos\nprint(average)',
   ['average = views // videos','average = views \\ videos'],groups=[[0,1]]),
 P('Hours watched','Store 150 minutes watched. Convert it to hours by dividing by 60, and print Hours watched: followed by the hours.',
   'minutes = 150\nhours = minutes / 60\nprint("Hours watched: " + str(hours))',
   ['print("Hours watched: " + hours)','hours = minutes * 60']),
])
lesson('u3l10','3.10','Floor Division That Rounds Down ( // )','ups',[
 P('Full boxes','UPS packs 10 packages to a box. Store 47 packages and 10 per box. Use floor division (//) to get the number of FULL boxes, and print it.',
   'packages = 47\nper_box = 10\nboxes = packages // per_box\nprint(boxes)',
   ['boxes = packages / per_box','boxes = packages % per_box'],groups=[[0,1]]),
 P('Pallets','A pallet holds 48 items. Store 250 items and the pallet size, use floor division (//) to get the number of full pallets, and print Pallets: followed by that number.',
   'items = 250\npallet_size = 48\npallets = items // pallet_size\nprint("Pallets: " + str(pallets))',
   ['pallets = items / pallet_size','print("Pallets: " + pallets)'],groups=[[0,1]]),
])
lesson('u3l11','3.11','Modulus: The Remainder ( % )','delta',[
 P('Flight time','Delta shows flight time as hours and minutes. Store 135 total minutes, use // 60 for the hours and % 60 for the leftover minutes, and print them like 2h 15m.',
   'total_minutes = 135\nhours = total_minutes // 60\nminutes = total_minutes % 60\nprint(str(hours) + "h " + str(minutes) + "m")',
   ['minutes = total_minutes / 60','print(hours + "h " + minutes + "m")'],groups=[[1,2]]),
 P('Odd or even gate','Store gate number 17, use % 2 to get the remainder after dividing by 2, and print Remainder: followed by the remainder. (A remainder of 1 means an odd gate.)',
   'gate = 17\nremainder = gate % 2\nprint("Remainder: " + str(remainder))',
   ['remainder = gate // 2','print("Remainder: " + remainder)']),
])
lesson('u3l12','3.12','Order of Operations','tesla',[
 P('Range estimate','Tesla\'s range estimate: store the battery percent (80), then compute range_miles as the battery times 3, plus 20. Print the range. (Multiplication happens before addition.)',
   'battery = 80\nrange_miles = battery * 3 + 20\nprint(range_miles)',
   ['range_miles = battery * (3 + 20)','range_miles = battery + 3 * 20']),
 P('Celsius to Fahrenheit','Store 20 degrees Celsius in temp_c. Convert it: multiply by 9, divide by 5, then add 32. Store the result in temp_f and print it.',
   'temp_c = 20\ntemp_f = temp_c * 9 / 5 + 32\nprint(temp_f)',
   ['temp_f = temp_c * 9 / (5 + 32)','temp_f = temp_c * (9 / 5 + 32)']),
])
lesson('u3l13','3.13','Tracing Code by Hand','roblox',[
 P('Robux after two changes','Roblox: start with 100 Robux, add 50, then spend 30 (subtract 30). Keep using the same variable the whole time, and print what is left.',
   'robux = 100\nrobux = robux + 50\nrobux = robux - 30\nprint(robux)',
   ['robux + 50 = robux','print("robux")'],groups=[[1,2]]),
 P('Buy, then double the price','Store robux (100) and price (40). Spend the price first (subtract it from robux), and THEN double the price. Print robux, then print the new price.',
   'robux = 100\nprice = 40\nrobux = robux - price\nprice = price * 2\nprint(robux)\nprint(price)',
   ['price = robux * 2','robux = robux + price'],groups=[[0,1]]),
])

TRACES=[
 dict(title='Two variables',intro='Variables change as the lines run. Fill in each value after the line runs.',code='x = 5\ny = x + 2\nx = y * 2\nprint(x, y)',ins=[]),
 dict(title='Strings and slices',intro='Strings are indexed from 0, and a slice stops before its end index.',code='word = "python"\nfirst = word[0]\nrest = word[1:]\nnew = rest + first\nprint(new)',ins=[]),
 dict(title='Division and remainder',intro='// keeps the whole part, and % keeps what is left over.',code='total = 47\npacks = total // 10\nleft = total % 10\ntotal = packs + left\nprint(total)',ins=[]),
 dict(title='Input and conversion',intro='input() gives text. int() turns it into a number. The user types 6.',code='n = int(input("n: "))\ndouble = n * 2\nn = double + n\nprint(n)',ins=['6']),
 dict(title='Order of operations',intro='Multiplication and division go before addition and subtraction. Parentheses go first.',code='a = 2 + 3 * 4\nb = (2 + 3) * 4\nc = b - a\nd = c / 4\nprint(d)',ins=[]),
]

def run(code,ins):
    feed=iter(ins); buf=io.StringIO()
    with contextlib.redirect_stdout(buf): exec(code,{'input':lambda p='':next(feed)})
    return buf.getvalue().rstrip('\n').split('\n')
def trace(code,ins):
    lines=code.split('\n'); feed=iter(ins); out=[]; steps=[]; g={'input':lambda p='':next(feed)}
    # run line by line with a shared namespace (these programs are straight-line code)
    prev={}
    for k,ln in enumerate(lines,1):
        buf=io.StringIO()
        with contextlib.redirect_stdout(buf): exec(ln,g)
        printed=buf.getvalue().rstrip('\n').split('\n') if buf.getvalue() else []
        cur={n:v for n,v in g.items() if n!='input' and not n.startswith('__')}
        changed={n:repr(v) for n,v in cur.items() if n not in prev or prev[n]!=v}
        steps.append(dict(line=k,changed=changed,vars={n:repr(v) for n,v in cur.items()},printed=printed))
        prev=copy.deepcopy(cur)
    return steps
rnd=random.Random(3)
data=dict(lessons={},traces={'3':[]})
for l in L:
    probs=[]
    for p in l['probs']:
        exp=run('\n'.join(p['sol']),p['ins'])
        # every distractor line must NOT be part of the solution, and a program built from the solution must work
        for d in p['distract']: assert d not in p['sol'],d
        pieces=[dict(t=t) for t in p['sol']]+[dict(t=t,d=1) for t in p['distract']]
        order=list(range(len(pieces))); rnd.shuffle(order)
        # never hand over the solved order
        while [pieces[i]['t'] for i in order][:len(p['sol'])]==p['sol']: rnd.shuffle(order)
        probs.append(dict(title=p['title'],story=p['story'],expect=exp,ins=p['ins'],pieces=[pieces[i] for i in order],sol=p['sol'],groups=p['groups']))
        # group sanity: any permutation inside a group must give the same output
        for gr in p['groups']:
            import itertools
            for perm in itertools.permutations(gr):
                s=list(p['sol']); 
                for dst,src in zip(sorted(gr),perm): s[dst]=p['sol'][src]
                assert run('\n'.join(s),p['ins'])==exp,('group not interchangeable',p['title'],gr)
    data['lessons'][l['id']]=dict(num=l['num'],title=l['title'],brand=dict(name=l['brand'][0],color=l['brand'][1],head=l['brand'][2]),problems=probs)
for t in TRACES:
    st=trace(t['code'],t['ins']); data['traces']['3'].append(dict(title=t['title'],intro=t['intro'],code=t['code'].split('\n'),ins=t['ins'],steps=st))
n=sum(len(v['problems']) for v in data['lessons'].values())
open('python/parsons-u3.js','w',encoding='utf-8').write('/* GENERATED by tools/parsons/u3.py. Do not edit by hand. */\nwindow.PARSONS = '+json.dumps(data,ensure_ascii=False,indent=0)+';\n')
print('lessons',len(data['lessons']),'problems',n,'traces',len(data['traces']['3']))
for t in data['traces']['3']: print(t['title'],'->',t['steps'][-1]['printed'] or [s['printed'] for s in t['steps'] if s['printed']])
for k,v in data['lessons'].items(): print(k,[p['expect'] for p in v['problems']])
