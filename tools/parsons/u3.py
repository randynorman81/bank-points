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
 P('Store the song facts','The Charts team needs the card script to store three facts and then show the title. Build it.',
   'track_title = "Blinding Lights"\nartist_name = "The Weeknd"\nplay_count = 4000000\nprint(track_title)',
   ['print(Track_Title)','2nd_song = "As It Was"','top song = "Flowers"'],groups=[[0,1,2]]),
 P('Print two labeled facts','Print the song length and the rating, each under its own label.',
   'length_seconds = 200\nrating = 4.8\nprint("LENGTH IN SECONDS")\nprint(length_seconds)\nprint("RATING")\nprint(rating)',
   ['print(length-seconds)','rating == 4.8'],groups=[[0,1]]),
])
lesson('u3l2','3.2','Storing Strings, Ints, Floats, and Booleans','apple',[
 P('Battery page facts','Store the phone facts using the right kind of value for each, then print two of them.',
   'model_name = "iPhone 15"\nbattery_cycles = 312\nbattery_health = 91.5\nis_charging = True\nprint(model_name)\nprint(battery_health)',
   ['model_name = iPhone 15','is_charging = true'],groups=[[0,1,2,3]]),
 P('One more charge cycle','The phone just finished another charge cycle. Update the count, then print it under a label.',
   'battery_cycles = 312\nbattery_cycles = battery_cycles + 1\nprint("CYCLES")\nprint(battery_cycles)',
   ['battery_cycles + 1 = battery_cycles','print("battery_cycles")']),
])
lesson('u3l3','3.3','Getting Input From the User','cfa',[
 P('Name on the order','Ask for a name, then print it on the ticket. (The customer types Sam.)',
   'name = input("Name for the order? ")\nprint("Order for " + name)',
   ['print("Order for " + Name)','input = name','name = input(Name for the order?)'],ins=['Sam']),
 P('Sandwich total','Each sandwich costs 5 dollars. Ask how many, work out the total, and print it. (The customer types 3.)',
   'count = int(input("How many sandwiches? "))\ntotal = count * 5\nprint("Total: " + str(total))',
   ['count = input("How many sandwiches? ")','print("Total: " + total)'],ins=['3']),
])
lesson('u3l4','3.4','Joining Strings, Ints, Floats, and Booleans','steam',[
 P('Purchase receipt line','Build one receipt line that joins the game name and the price.',
   'game = "Hades"\nprice = 24.99\nprint("Bought " + game + " for $" + str(price))',
   ['print("Bought " + game + " for $" + price)'],groups=[[0,1]]),
 P('Full name','Join the first and last name with a space between them and print it.',
   'first = "Gabe"\nlast = "Newell"\nfull = first + " " + last\nprint(full)',
   ['full = first + last','print(Full)'],groups=[[0,1]]),
])
lesson('u3l5','3.5','Indexing: Pulling One Character From a String','tiktok',[
 P('First letter badge','Pull the first character out of the username and print it.',
   'username = "dance_queen"\nfirst_letter = username[0]\nprint(first_letter)',
   ['first_letter = username[1]','first_letter = username(0)']),
 P('First and last','Build a badge from the first and the last character of the username.',
   'username = "dance_queen"\nfirst_letter = username[0]\nlast_letter = username[-1]\nprint("Badge: " + first_letter + last_letter)',
   ['last_letter = username[len(username)]','last_letter = username[-0]'],groups=[[1,2]]),
])
lesson('u3l6','3.6','Slicing: Pulling a Piece Out of a String','airbnb',[
 P('Code prefix','Print the first three characters of the confirmation code.',
   'confirmation = "HMX7Q2R9"\nprefix = confirmation[:3]\nprint(prefix)',
   ['prefix = confirmation[3:]','prefix = confirmation(:3)']),
 P('Split the code','Print the start and the end of the code with a dash between. The end begins at index 4.',
   'confirmation = "HMX7Q2R9"\nstart = confirmation[:3]\nend = confirmation[4:]\nprint(start + "-" + end)',
   ['end = confirmation[:4]','print(start + end)'],groups=[[1,2]]),
])
lesson('u3l7','3.7','Finding Text With .find()','gmail',[
 P('Where is the @?','Find the position of the @ sign in the address and print it.',
   'email = "sam@gmail.com"\nat = email.find("@")\nprint(at)',
   ['at = email.find[@]','print(email.at)']),
 P('Pull out the username','Use the position of the @ to print only the part before it.',
   'email = "sam@gmail.com"\nat = email.find("@")\nusername = email[:at]\nprint(username)',
   ['username = email[at:]','at = email.find("@"']),
])
lesson('u3l8','3.8','Math With Numbers From the User','dd',[
 P('Tip calculator','Ask for the bill, work out a 20 percent tip, and print it. (The customer types 20.)',
   'bill = float(input("Bill: "))\ntip = bill * 0.2\nprint("Tip: " + str(tip))',
   ['bill = input("Bill: ")','print("Tip: " + tip)'],ins=['20']),
 P('Bill plus tip','Print the total after adding the tip. (The customer types 20.)',
   'bill = float(input("Bill: "))\ntip = bill * 0.2\ntotal = bill + tip\nprint("Total: " + str(total))',
   ['total = bill + 0.2','total = tip - bill'],ins=['20']),
])
lesson('u3l9','3.9','Division That Gives a Float ( / )','yt',[
 P('Average views','Work out the average views per video and print it.',
   'views = 1200\nvideos = 5\naverage = views / videos\nprint(average)',
   ['average = views // videos','average = views \\ videos'],groups=[[0,1]]),
 P('Hours watched','Turn minutes watched into hours and print it under a label.',
   'minutes = 150\nhours = minutes / 60\nprint("Hours watched: " + str(hours))',
   ['print("Hours watched: " + hours)','hours = minutes * 60']),
])
lesson('u3l10','3.10','Floor Division That Rounds Down ( // )','ups',[
 P('Full boxes','Packages go 10 to a box. Print how many FULL boxes 47 packages make.',
   'packages = 47\nper_box = 10\nboxes = packages // per_box\nprint(boxes)',
   ['boxes = packages / per_box','boxes = packages % per_box'],groups=[[0,1]]),
 P('Pallets','A pallet holds 48 items. Print how many full pallets 250 items make.',
   'items = 250\npallet_size = 48\npallets = items // pallet_size\nprint("Pallets: " + str(pallets))',
   ['pallets = items / pallet_size','print("Pallets: " + pallets)'],groups=[[0,1]]),
])
lesson('u3l11','3.11','Modulus: The Remainder ( % )','delta',[
 P('Flight time','Turn 135 minutes into hours and minutes and print it like 2h 15m.',
   'total_minutes = 135\nhours = total_minutes // 60\nminutes = total_minutes % 60\nprint(str(hours) + "h " + str(minutes) + "m")',
   ['minutes = total_minutes / 60','print(hours + "h " + minutes + "m")'],groups=[[1,2]]),
 P('Odd or even gate','Print the remainder when gate 17 is divided by 2. A remainder of 1 means an odd gate.',
   'gate = 17\nremainder = gate % 2\nprint("Remainder: " + str(remainder))',
   ['remainder = gate // 2','print("Remainder: " + remainder)']),
])
lesson('u3l12','3.12','Order of Operations','tesla',[
 P('Range estimate','Range is battery times 3, plus 20. Print the result.',
   'battery = 80\nrange_miles = battery * 3 + 20\nprint(range_miles)',
   ['range_miles = battery * (3 + 20)','range_miles = battery + 3 * 20']),
 P('Celsius to Fahrenheit','Convert 20 degrees C to F with multiply by 9, divide by 5, then add 32.',
   'temp_c = 20\ntemp_f = temp_c * 9 / 5 + 32\nprint(temp_f)',
   ['temp_f = temp_c * 9 / (5 + 32)','temp_f = temp_c * (9 / 5 + 32)']),
])
lesson('u3l13','3.13','Tracing Code by Hand','roblox',[
 P('Robux after two changes','Start with 100 Robux, add 50, spend 30, then print what is left.',
   'robux = 100\nrobux = robux + 50\nrobux = robux - 30\nprint(robux)',
   ['robux + 50 = robux','print("robux")'],groups=[[1,2]]),
 P('Buy, then double the price','Spend the price first, and only then double the price. Print the Robux, then the new price.',
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
