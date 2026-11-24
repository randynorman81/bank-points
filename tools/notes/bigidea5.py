"""AP CSP Big Idea 5: Impact of Computing. Seven notes pages in two units that follow the CodeHS outline:
   Unit 11 "Project: The Effects of the Internet": beneficial and harmful effects, the digital divide, crowdsourcing
   Unit 16 "Project: The Impact of Computing":     computing bias, copyright and open source, privacy and PII, safe computing."""
from lib import *

U11 = dict(dir="unit-11", label="Unit 11: Project: The Effects of the Internet", n=11, pages=[
    ("beneficial-harmful.html", "11.1 Good and Bad Effects"),
    ("digital-divide.html", "11.2 Digital Divide"),
    ("crowdsourcing.html", "11.3 Crowdsourcing"),
])
U16 = dict(dir="unit-16", label="Unit 16: Project: The Impact of Computing", n=16, pages=[
    ("computing-bias.html", "16.1 Bias"),
    ("copyright-open-source.html", "16.2 Copyright"),
    ("privacy-pii.html", "16.3 Privacy"),
    ("safe-computing.html", "16.4 Safe Computing"),
])
TITLES = {
    "beneficial-harmful.html": "Beneficial and Harmful Effects (11.1)",
    "digital-divide.html": "The Digital Divide (11.2)",
    "crowdsourcing.html": "Crowdsourcing and Citizen Science (11.3)",
    "computing-bias.html": "Computing Bias (16.1)",
    "copyright-open-source.html": "Copyright, Creative Commons, and Open Source (16.2)",
    "privacy-pii.html": "Privacy and Personal Data (16.3)",
    "safe-computing.html": "Safe Computing: Passwords, Phishing, and Malware (16.4)",
}
SUBLINE = {
    "beneficial-harmful.html": "Intended and unintended effects, who benefits, who is harmed",
    "digital-divide.html": "Who has access, who does not, and what it costs them",
    "crowdsourcing.html": "Wikipedia, citizen science, crowdfunding, and their limits",
    "computing-bias.html": "How bias gets into data and algorithms, and what to do about it",
    "copyright-open-source.html": "Intellectual property, fair use, Creative Commons, open source",
    "privacy-pii.html": "PII, cookies, metadata, and what your data reveals",
    "safe-computing.html": "Authentication, MFA, phishing, malware, and rogue Wi-Fi",
}
# walkthrough slots (python editor)
SLOT = {
    "beneficial-harmful.html": "a195", "digital-divide.html": "a196", "crowdsourcing.html": "a197",
    "computing-bias.html": "a198", "copyright-open-source.html": "a199", "privacy-pii.html": "a200", "safe-computing.html": "a201",
}


def mk(U, f, slug, title, subject, deck, parts, fh, fp):
    names = [p[0] for p in U["pages"]]
    i = names.index(f)
    prev = (names[i - 1], TITLES[names[i - 1]]) if i > 0 else None
    nxt = (names[i + 1], TITLES[names[i + 1]]) if i < len(names) - 1 else None
    return page(slug, title, subject, deck, U["dir"], U["label"], U["pages"], "".join(parts), fh, fp, prev, nxt, walk=SLOT[f], concept=TITLES[f])


# =============================================================================================  11.1 BENEFICIAL AND HARMFUL
def beneficial_harmful():
    both = widget("wgboth", "Try it: every innovation has two sides",
                  "Pick a computing innovation. See a benefit, a harm, an effect nobody planned, and who gets which.",
                  '<div class="row"><select></select></div><div class="grid2 out"></div>',
                  r"""
var D={
"Social media":{good:"Keeps friends and family connected, lets anyone share ideas, helps causes organize quickly.",bad:"Spreads false information fast, can hurt mental health, and rewards outrage over accuracy.",un:"Nobody planned for it to change how people get their news, or for algorithms to keep people scrolling.",who:"Helps people far from family. Can harm teens who compare themselves to everyone else."},
"GPS and location sharing":{good:"Get directions anywhere, find a lost phone, call help to your exact spot.",bad:"Apps can track where you go and when. Stalkers and advertisers can misuse location data.",un:"Shared location from a fitness app revealed the locations of secret military bases.",who:"Helps drivers and emergency crews. Can harm someone being followed."},
"Streaming video":{good:"Watch almost anything any time, and new creators can reach audiences without a studio.",bad:"Huge energy use in data centers, and recommendation systems can trap people in a narrow view.",un:"Cable TV schedules and local video stores nearly disappeared.",who:"Helps viewers and independent creators. Can harm workers whose industries shrank."},
"Self-driving cars":{good:"Could cut crashes caused by tired or distracted drivers, and give mobility to people who cannot drive.",bad:"Drivers could lose jobs. A software mistake or a hacked car could cause a crash.",un:"Cars collect huge amounts of data about where people go.",who:"Helps people who cannot drive. Can harm truck and taxi drivers."},
"Online shopping":{good:"Compare prices, shop from home, find things small stores never stock.",bad:"Local shops can close, delivery uses fuel, and sites track what you browse.",un:"Empty downtown stores and a flood of packaging waste.",who:"Helps people in remote areas. Can harm small local businesses."},
"Facial recognition":{good:"Unlock your phone, find missing children, speed up airport lines.",bad:"Can misidentify people, enables mass surveillance, and can be used without consent.",un:"Systems worked worse on some groups of faces, leading to wrongful accusations.",who:"Helps investigators and travelers. Can harm people who are misidentified or watched."}};
var sel=root.querySelector("select"),out=root.querySelector(".out");sel.innerHTML=Object.keys(D).map(function(k){return"<option>"+k+"</option>"}).join("");
function upd(){var d=D[sel.value];out.innerHTML=[["Beneficial","#34D399",d.good],["Harmful","#F87171",d.bad],["Unintended","#FBBF24",d.un],["Who it affects","#60A5FA",d.who]].map(function(x){return'<div style="border:1px solid '+x[1]+';border-radius:8px;padding:10px 12px"><div class="mono" style="font-size:12px;color:'+x[1]+';text-transform:uppercase;letter-spacing:.05em">'+x[0]+'</div><div style="margin-top:4px;font-size:14.5px">'+x[2]+'</div></div>'}).join("")}
sel.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Every Innovation Has Two Sides",
             "A <b>computing innovation</b> is a new program, device, or system that changes how people do things: social media, GPS, streaming, smart speakers. Almost every one has <b>both beneficial and harmful effects</b>, and often <b>at the same time</b>.",
             both,
             hint("The exam never asks \"is technology good?\" It asks you to <b>name a specific effect</b> and explain <b>who</b> it helps or harms and <b>why</b>.")),
        part(1, "Intended and Unintended Effects",
             "The people who build an innovation have an <b>intended</b> purpose. But once millions of people use it, <b>effects nobody planned</b> appear.",
             tbl(["", "Intended effect", "Unintended effect"], [
                 ["<b>What it is</b>", "what the creators meant it to do", "a result nobody planned or predicted"],
                 ["<b>Example: social media</b>", "let friends stay in touch", "changed how people get news; spreads misinformation"],
                 ["<b>Example: GPS in a phone</b>", "give directions", "apps tracking your movements for ads"],
                 ["<b>Can it be good?</b>", "usually", "yes <b>or</b> no. Unintended does not mean bad."],
             ]),
             warn("<b>Developers cannot predict every effect.</b> That is why computing innovations are tested, studied, and sometimes changed after they are released.")),
        part(2, "It Depends Who You Ask",
             "The same innovation can <b>help one group</b> and <b>harm another</b>. A good answer on the exam names the group.",
             tbl(["Innovation", "Who benefits", "Who may be harmed"], [
                 ["Automated checkout", "shoppers who want speed, stores that save money", "cashiers whose jobs shrink"],
                 ["Streaming music", "listeners; artists with no record label", "record stores; artists paid tiny amounts per play"],
                 ["Remote work tools", "workers in rural areas, parents, people with disabilities", "people without reliable Internet (see the digital divide)"],
                 ["Targeted ads", "businesses that reach the right customers", "people whose personal data is collected and sold"],
             ])),
        part(3, "How Computing Changes the World",
             "Computing has made huge changes in <b>creativity</b>, <b>communication</b>, <b>business</b>, <b>health</b>, and <b>education</b>.",
             cards([("1", "Creativity", "Anyone can make and share music, video, and art, and remix other people's work to create something new."),
                    ("2", "Communication", "People can talk instantly across the world, but also spread rumors just as fast."),
                    ("3", "Health", "Phone apps and sensors track health, and doctors share records. Data can also be leaked or misused."),
                    ("4", "Jobs", "New jobs appear (app developers, data analysts) while others are automated away.")]),
             quiz("qz11a", [
                 ("A fitness app was built to help people track their runs. It also publicly showed where people ran, which revealed the location of private places. What kind of effect is this?", ["An intended beneficial effect", "An unintended harmful effect", "An effect that only happens on old phones", "Not an effect of computing"], 1, "The creators never <b>intended</b> to show private places, and it caused harm. That is an <b>unintended harmful effect</b>."),
                 ("Which statement is <b>most accurate</b> about computing innovations?", ["They are always beneficial", "They are always harmful", "They can have both beneficial and harmful effects, sometimes at the same time", "Their effects can always be predicted before release"], 2, "Most innovations have <b>both</b> kinds of effects, and many effects are unpredicted."),
                 ("A store replaces most cashiers with self-checkout kiosks. Which is a <b>harmful</b> effect?", ["Customers check out faster", "The store saves money", "Some cashiers lose their jobs", "Fewer lines form"], 2, "The others are benefits. Job loss is a harm to a particular group."),
                 ("Which is an example of an <b>unintended beneficial</b> effect?", ["A cooking video site becomes a place where people learn to repair appliances", "A social network is designed to connect friends", "A map app gives directions", "A camera takes photos"], 0, "Nobody planned for the cooking site to become a repair school, but it helps people. That is an <b>unplanned benefit</b>."),
             ])),
        exam([
            "Computing innovations can have <b>both beneficial and harmful effects</b>, sometimes at the same time.",
            "Effects can be <b>intended</b> (what the creators planned) or <b>unintended</b>. Unintended does not always mean harmful.",
            "An effect can help <b>one group</b> and harm <b>another</b>. Name the group.",
            "Developers <b>cannot always predict</b> the effects of what they create.",
            "Computing has changed <b>creativity, communication, business, health, and jobs</b>.",
        ]),
    ]
    return mk(U11, "beneficial-harmful.html", "beneficial-harmful", "Beneficial and Harmful Effects", "THE TWO SIDES OF EVERY INNOVATION",
              "Every new computing tool changes the world, and almost every one changes it in <b>good and bad ways at once</b>. Learn to name the effects, who they reach, and which ones nobody planned.",
              parts, "Name the effect, name the group, name the why.", "Next: not everyone gets to use these innovations equally.")


# =============================================================================================  11.2 DIGITAL DIVIDE
def digital_divide():
    wait = widget("wgdiv", "Try it: how long does a school task take on different connections?",
                  "Pick a connection and a task. The same task is quick for one student and nearly impossible for another.",
                  '<div class="row"><label>Connection: <select class="c"><option value="1000">Fiber at home (1,000 Mbps)</option><option value="100" selected>Typical home Wi-Fi (100 Mbps)</option><option value="10">Slow rural DSL (10 Mbps)</option><option value="3">Phone hotspot with weak signal (3 Mbps)</option><option value="1">Shared connection, 30 students (1 Mbps each)</option></select></label></div><div class="row"><label>Task: <select class="t"><option value="40">Download a 5 MB assignment PDF</option><option value="400" selected>Upload a 50 MB class video</option><option value="4000">Watch a 500 MB recorded lesson</option></select></label></div><div class="out"></div>',
                  r"""
var c=root.querySelector(".c"),t=root.querySelector(".t"),out=root.querySelector(".out");
function fmt(s){return s<1?"under a second":(s<60?s.toFixed(0)+" seconds":(s<3600?(s/60).toFixed(1)+" minutes":(s/3600).toFixed(1)+" hours"))}
function upd(){var mbits=Number(t.value),speed=Number(c.value),s=mbits/speed;
 out.innerHTML='<b>'+(t.options[t.selectedIndex].text)+'</b> on <b>'+speed+' Mbps</b>:<br>'+(mbits)+' megabits &divide; '+speed+' Mbps = <b style="color:'+(s>600?"#F87171":(s>60?"#FBBF24":"#A3E635"))+'">'+fmt(s)+'</b>'+(s>600?'<br><i>This student will probably give up, or finish at a library or a fast-food restaurant.</i>':'');}
root.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "What Is the Digital Divide?",
             "The <b>digital divide</b> is the <b>gap</b> between people who have <b>access</b> to computers and the Internet and people who do not. It is not just \"has Internet or not\". The quality of the connection, the devices, and the skills to use them matter too.",
             ex("<b>Exam wording:</b> access to computing devices and the Internet is <b>not equal</b> across different <b>socioeconomic</b>, <b>geographic</b>, and <b>demographic</b> groups."),
             tbl(["Kind of gap", "What it means", "Example"], [
                 ["<b>Socioeconomic</b>", "differences in income and education", "a family that cannot afford a laptop or a monthly plan"],
                 ["<b>Geographic</b>", "where you live", "rural areas where no company has run fiber"],
                 ["<b>Demographic</b>", "age, disability, language, and other groups", "older adults, people who use screen readers, speakers of other languages"],
             ])),
        part(1, "Why Does It Happen?",
             "Several things pile up.",
             cards([("COST", "Money", "Devices, home plans, and repairs cost money many families do not have."),
                    ("PLACE", "Infrastructure", "Companies build fast networks where many customers live, so rural and remote areas get slower service or none."),
                    ("SKILLS", "Digital literacy", "Having a device is not enough if no one has shown you how to use it safely and well."),
                    ("DESIGN", "Accessibility", "Websites that do not work with screen readers, or are only in one language, leave people out.")])),
        part(2, "What Does It Cost People?",
             "Because so much of life moved online, a gap in access becomes a gap in <b>opportunity</b>.",
             wait,
             tbl(["Area", "Effect of lacking access"], [
                 ["<b>Education</b>", "the \"homework gap\": students who cannot do online assignments or research at home"],
                 ["<b>Jobs</b>", "most applications and many jobs require the Internet; remote work is out of reach"],
                 ["<b>Health</b>", "no telehealth visits, no online test results"],
                 ["<b>Civic life</b>", "harder to find information about voting, government services, and news"],
             ])),
        part(3, "How Can the Gap Be Reduced?",
             "No single fix works. These are some of the approaches.",
             tbl(["Approach", "How it helps", "Limit"], [
                 ["Public Wi-Fi and library computers", "free access for people without home plans", "you must travel there, with limited hours"],
                 ["Low-cost plans and subsidies", "lowers the cost of home Internet", "still needs a device and skills"],
                 ["Building networks in rural areas", "closes the geographic gap", "expensive; takes years"],
                 ["Low-bandwidth, accessible design", "pages that load on slow connections and work with screen readers", "needs developers to care"],
                 ["Teaching digital skills", "helps people use what they have", "does not fix a missing connection"],
             ]),
             quiz("qz11b", [
                 ("Which best describes the digital divide?", ["The difference between fast and slow computers", "The gap in access to computers and the Internet between different groups of people", "The split between hardware and software", "The difference between public and private IP addresses"], 1, "It is a gap in <b>access</b> that follows socioeconomic, geographic, and demographic lines."),
                 ("A student has no Internet at home and cannot do online homework. Which is the most likely <b>effect</b>?", ["Their grades may fall behind students who have access", "Their school gets more bandwidth", "Their device encrypts more data", "Nothing changes"], 0, "This is the <b>homework gap</b>: a lack of access becomes a gap in opportunity."),
                 ("Which would <b>best reduce</b> the geographic part of the digital divide?", ["Making a new video game", "Building high-speed Internet service in rural areas", "Adding more ads to websites", "Making websites use more images"], 1, "Rural areas often lack infrastructure. Building networks there directly closes the <b>geographic</b> gap."),
                 ("A website only works with a mouse and has no text alternatives for images. Who is most likely to be left out?", ["Everyone equally", "Users who rely on a screen reader", "Users with fast Internet", "Only people in cities"], 1, "Poor accessibility widens the <b>demographic</b> divide. Designing for accessibility is part of the fix."),
             ])),
        exam([
            "The <b>digital divide</b> is the gap in access to computing devices and the Internet across <b>socioeconomic, geographic, and demographic</b> groups.",
            "It affects <b>education, jobs, health care, and civic life</b>.",
            "Access is more than a device: it includes the <b>connection quality</b>, <b>skills</b>, and <b>accessible design</b>.",
            "Ways to reduce it include public access, lower costs, building infrastructure, and accessible design.",
        ]),
    ]
    return mk(U11, "digital-divide.html", "digital-divide", "The Digital Divide", "WHO CAN GET ONLINE, AND WHO CANNOT",
              "Computing only helps the people who can use it. The <b>digital divide</b> is the gap between those who have devices and Internet and those who do not, and it grows into a gap in opportunity.",
              parts, "An invention only helps the people who can reach it.", "Next: when many people do share the Internet, they can solve problems together. Crowdsourcing.")


# =============================================================================================  11.3 CROWDSOURCING
def crowdsourcing():
    crowd = widget("wgcrowd", "Try it: the wisdom of the crowd",
                   "The jar below holds <b>500</b> jelly beans. A crowd of people each guess. A single guess can be far off, but what happens to the <b>average</b> of many guesses?",
                   '<div class="row"><label>Crowd size: <input type="range" min="1" max="200" value="5"> <b class="mono n">5</b></label> <label><input type="checkbox" class="bias"> everyone sees the same misleading sign that says "about 300"</label> <button class="again">New crowd</button></div><div class="out"></div>',
                   r"""
var TRUE=500,rg=root.querySelector("input[type=range]"),nn=root.querySelector(".n"),bias=root.querySelector(".bias"),out=root.querySelector(".out"),seed=1;
function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
function norm(){var u=rnd()||.5,v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function upd(){var n=Number(rg.value);nn.textContent=n;seed=1+Math.floor(Number(root.dataset.s||7))*977;var g=[],sum=0,worst=0,wv=TRUE;
 for(var i=0;i<n;i++){var v=Math.max(50,Math.round(TRUE+norm()*180+(bias.checked?-190:0)));g.push(v);sum+=v;if(Math.abs(v-TRUE)>worst){worst=Math.abs(v-TRUE);wv=v}}
 var avg=Math.round(sum/n),err=Math.abs(avg-TRUE);
 out.innerHTML='First guess: <b>'+g[0]+'</b> (off by '+Math.abs(g[0]-TRUE)+')<br>Most-wrong guess: <b>'+wv+'</b> (off by '+worst+')<br>Average of all '+n+' guesses: <b style="color:'+(err<40?"#A3E635":"#FBBF24")+'">'+avg+'</b> (off by <b>'+err+'</b>)'+
 (bias.checked?'<div class="note">When everyone is nudged the <b>same</b> way, the errors do not cancel out. A crowd is only wise when its members think <b>independently</b>.</div>':(n>30?'<div class="note">With many <b>independent</b> guesses, the high and low mistakes cancel out and the average gets close to the truth.</div>':''))}
root.addEventListener("input",upd);root.addEventListener("change",upd);root.querySelector(".again").onclick=function(){root.dataset.s=Math.floor(Math.random()*1000);upd()};upd();
""")
    parts = [
        part(0, "What Is Crowdsourcing?",
             "<b>Crowdsourcing</b> means getting <b>ideas, work, data, or money from a large group of people</b>, usually over the Internet. The Internet makes it possible to reach thousands or millions of people who each give a small piece.",
             tbl(["Kind", "What the crowd gives", "Examples"], [
                 ["<b>Knowledge</b>", "articles, answers, reviews", "Wikipedia, Stack Overflow, restaurant reviews"],
                 ["<b>Data and labor</b>", "small tasks done by many people", "reCAPTCHA (reading text for digitizing books), Waze traffic reports"],
                 ["<b>Citizen science</b>", "observations and analysis for real research", "eBird (bird sightings), Galaxy Zoo (sorting galaxy photos), Foldit (protein puzzles)"],
                 ["<b>Money</b> (crowdfunding)", "small amounts of money from many people", "Kickstarter, GoFundMe"],
                 ["<b>Open-source code</b>", "programs built by many volunteers", "Linux, Firefox"],
             ])),
        part(1, "Citizen Science",
             "In <b>citizen science</b>, ordinary people help scientists collect or analyze data. A scientist could never watch every bird in the country, but a million bird watchers with phones can report what they see.",
             ex("<b>Example:</b> A scientist wants to know where a bird species is moving as the climate changes. Thousands of volunteers report sightings in an app. The researcher gets data that would take one team a lifetime to collect.")),
        part(2, "Why Crowds Can Be Wise",
             "Each person's guess is off in a different direction. When you combine many <b>independent</b> guesses, the errors tend to <b>cancel out</b>.",
             crowd,
             hint("Slide to 1, then to 200. A single guess is often far off. The average of many is usually close. Then tick the box: a shared bias <b>cannot</b> cancel out.")),
        part(3, "Benefits and Concerns",
             "Crowdsourcing is powerful, but it has real problems.",
             two(box("Benefits", "<b>Scale</b>: huge amounts of work or data. <b>Variety</b>: many viewpoints and skills. <b>Speed</b> and <b>low cost</b>. It can solve problems too big for one team.", "ok"),
                 box("Concerns", "<b>Quality</b>: anyone can be wrong or add vandalism. <b>Bias</b>: the crowd may not represent everyone. <b>Manipulation</b>: fake reviews and bots. <b>Fairness</b>: who gets credit or pay? <b>Privacy</b> of contributors.", "bad")),
             tbl(["Problem", "Example", "How people fight it"], [
                 ["Wrong or fake information", "a vandalized web page edit; fake product reviews", "editors and moderators, edit history, reporting tools"],
                 ["Unrepresentative crowd", "a map app has detailed data for rich neighborhoods only", "reach out to under-represented groups"],
                 ["Unpaid labor", "volunteers do work a company profits from", "be clear about how contributions are used"],
             ]),
             quiz("qz11c", [
                 ("Which is an example of <b>crowdsourcing</b>?", ["A company's engineers writing all the code for a program", "Thousands of volunteers reporting bird sightings in an app so scientists can map where birds live", "A computer encrypting a message", "A student writing a program alone"], 1, "Crowdsourcing means getting contributions from a <b>large group of people</b>, usually online."),
                 ("A scientist uses an app where volunteers label photos of galaxies. This is best described as…", ["Citizen science", "Packet switching", "A distributed denial of service", "Lossy compression"], 0, "<b>Citizen science</b> is a kind of crowdsourcing where the public helps with real research."),
                 ("Which is a <b>concern</b> about crowdsourced information?", ["It always comes from experts", "Some contributions may be wrong, biased, or manipulated", "It costs too much to collect", "It cannot be shared online"], 1, "Open contribution means <b>quality control</b> and <b>bias</b> become the main worries."),
                 ("Why does the average of many <b>independent</b> guesses tend to be close to the true value?", ["Because computers calculate it", "Because errors in different directions tend to cancel each other out", "Because everyone copies the same guess", "Because the first guess is always right"], 1, "Independent errors cancel out. If everyone is nudged the same way, they do not."),
             ])),
        exam([
            "<b>Crowdsourcing</b> gets input (ideas, data, work, money) from a <b>large group</b> of people, usually online. <b>Citizen science</b> is one kind.",
            "Benefits: <b>scale, variety, speed, low cost</b>. Concerns: <b>quality, bias, manipulation, fairness, privacy</b>.",
            "Crowds are wisest when contributions are <b>independent</b> and the crowd is <b>diverse</b>.",
            "Be ready to give an example and say one benefit and one concern.",
        ]),
    ]
    return mk(U11, "crowdsourcing.html", "crowdsourcing", "Crowdsourcing and Citizen Science", "A LITTLE HELP FROM EVERYONE",
              "The Internet lets thousands of people each give a small piece: a sighting, an answer, a few dollars. Learn how <b>crowdsourcing</b> works, why crowds can be wise, and where it goes wrong.",
              parts, "Many small pieces, one big answer.", "Next: the Impact of Computing, starting with a problem that hides inside the data: bias.")


# =============================================================================================  16.1 BIAS
def computing_bias():
    model = widget("wgbias", "Try it: train a model on unbalanced data",
                   "A program learns to recognize faces (or approve loans, or sort resumes) from examples. Group A and Group B both use it. Change how much of the training data comes from Group A.",
                   '<div class="row"><label>Training examples from Group A: <input type="range" min="50" max="95" step="5" value="90"> <b class="mono pa">90</b>%</label></div><div class="grid2"><div><div class="mono" style="font-size:13px">Group A accuracy: <b class="aa"></b></div><div class="bar"><i class="ba" style="width:0"></i></div></div><div><div class="mono" style="font-size:13px">Group B accuracy: <b class="ab"></b></div><div class="bar"><i class="bb" style="width:0"></i></div></div></div><div class="out"></div>',
                   r"""
var rg=root.querySelector("input"),pa=root.querySelector(".pa"),aa=root.querySelector(".aa"),ab=root.querySelector(".ab"),ba=root.querySelector(".ba"),bb=root.querySelector(".bb"),out=root.querySelector(".out");
function upd(){var a=Number(rg.value)/100,b=1-a;pa.textContent=rg.value;
 var accA=95-2*Math.max(0,0.5-a)*40,accB=95-Math.max(0,0.5-b)/0.5*30;accA=Math.min(accA,97);var overall=a*accA+b*accB;
 aa.textContent=accA.toFixed(0)+"%";ab.textContent=accB.toFixed(0)+"%";ba.style.width=accA+"%";bb.style.width=accB+"%";bb.className=accB<85?"hot":"";ba.className=accA<85?"hot":"";
 out.innerHTML='Overall accuracy: <b>'+overall.toFixed(1)+'%</b>'+(a>=.7?'<br><i>Looks great overall, but the model is much worse for Group B. A single high accuracy number can <b>hide bias</b>.</i>':'<br>With more balanced training data, the two groups get closer to equal results.');}
rg.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "What Is Computing Bias?",
             "<b>Bias</b> means a computer system gives <b>systematically unfair results</b> to some people or groups. Computers do exactly what they are told, so it is tempting to think they cannot be biased. But <b>people</b> choose the data, write the rules, and decide what counts as success, and their <b>assumptions and blind spots</b> can end up inside the program.",
             ex("<b>Exam idea:</b> computing innovations can <b>reflect existing human biases</b> because of the data used to build them. Bias can be <b>unintentional</b>, and it can <b>repeat or increase</b> unfairness that already exists.")),
        part(1, "Where Does Bias Come From?",
             "Bias gets in at several points.",
             cards([("DATA", "Biased training data", "A face-recognition program trained mostly on light-skinned faces works worse on dark-skinned faces."),
                    ("PAST", "Historical bias", "A hiring program trained on past hires copies the unfair patterns in who got hired before."),
                    ("DESIGN", "Design choices", "A designer picks what to measure. A \"risk score\" that uses zip code can stand in for race."),
                    ("TEAM", "Lack of diversity", "If everyone on the team is alike, nobody notices who the product fails.")]),
             model),
        part(2, "Real Examples",
             "These happened in real systems.",
             tbl(["System", "What went wrong", "Why"], [
                 ["Face recognition", "more errors for women and for people with darker skin", "training photos were not diverse"],
                 ["Resume screening", "ranked men's resumes higher for technical jobs", "learned from a company's past hiring"],
                 ["Voice assistants", "understood some accents far less well", "mostly trained on a few accents"],
                 ["Loan or insurance scoring", "charged some neighborhoods more", "used zip code as a stand-in for race or income"],
             ]),
             warn("<b>Feedback loops:</b> if a biased program decides where police patrol or who gets a loan, the results become <b>new data</b>, which trains the next version to be <b>even more biased</b>.")),
        part(3, "What Can Be Done?",
             "Bias cannot be removed by good intentions alone. Teams use <b>specific steps</b>.",
             tbl(["Step", "What it does"], [
                 ["<b>Diverse, representative data</b>", "make sure every group appears in the training data"],
                 ["<b>Test on every group</b>", "measure accuracy for each group separately, not just overall"],
                 ["<b>Diverse teams</b>", "more people who notice problems early"],
                 ["<b>Human review and appeals</b>", "a person can check and fix a decision"],
                 ["<b>Be open</b>", "explain how the system decides, so outsiders can check it"],
             ]),
             quiz("qz16a", [
                 ("A hiring program trained on a company's past hires keeps favoring candidates who look like previous employees. What is the <b>most likely cause</b>?", ["The computer chose to be unfair", "The training data reflected past human bias", "The program ran too slowly", "The candidates' resumes were too long"], 1, "The program <b>learned the pattern</b> in its data. Computers copy human bias in the data they are given."),
                 ("A face-recognition program works well on most people but often fails for a small group. Which action would <b>best</b> address this?", ["Use fewer photos", "Add many more training photos of the group it fails on, and test on each group", "Hide the failures", "Make the program run faster"], 1, "Fix the <b>data</b> and <b>test every group</b>, not just the overall score."),
                 ("A program is 92% accurate overall. Why might that number be <b>misleading</b>?", ["Accuracy is never useful", "It may hide much worse accuracy for a smaller group", "92 is too low", "It means the program is slow"], 1, "A big majority group can make the overall number high while a minority group gets poor results."),
                 ("Which is an example of bias that was <b>not intended</b> by the programmers?", ["A programmer writes a rule to reject one group", "A model built on data that left out a group performs poorly for that group", "A program crashes", "A user chooses a weak password"], 1, "Bias is often <b>unintentional</b>: no one wrote an unfair rule, but the data did the damage."),
             ])),
        exam([
            "<b>Bias</b> in computing means systematically unfair results for some people. It can come from <b>data</b>, <b>design choices</b>, and <b>team makeup</b>.",
            "Computing innovations can <b>reflect and even increase</b> existing human bias. The bias is often <b>unintentional</b>.",
            "Using <b>diverse, representative data</b> and <b>testing every group</b> helps reduce bias.",
            "A high <b>overall</b> accuracy can hide poor results for a smaller group.",
        ]),
    ]
    return mk(U16, "computing-bias.html", "computing-bias", "Computing Bias", "WHEN A PROGRAM IS UNFAIR",
              "A program does exactly what it is told, so how can it be unfair? <b>Bias</b> hides in the <b>data</b> a program learns from and the <b>choices</b> its builders make. Learn where it comes from and how to reduce it.",
              parts, "Computers copy the world they are shown.", "Next: who owns the things people create with computers? Copyright and open source.")


# =============================================================================================  16.2 COPYRIGHT
def copyright_open_source():
    chooser = widget("wgcc", "Try it: pick a Creative Commons license",
                     "You made a photo, a song, or a program. Decide what other people may do with it and see which license fits.",
                     '<div class="row"><label><input type="checkbox" class="cr" checked> People must <b>credit</b> me</label></div><div class="row"><label><input type="checkbox" class="mod" checked> People may <b>change</b> my work (remix it)</label></div><div class="row"><label><input type="checkbox" class="com" checked> People may use it to <b>make money</b></label></div><div class="row"><label><input type="checkbox" class="sa"> Remixes must use the <b>same license</b> (share alike)</label></div><div class="out"></div>',
                     r"""
var q=function(c){return root.querySelector("."+c)},out=root.querySelector(".out");
function upd(){var cr=q("cr").checked,mod=q("mod").checked,com=q("com").checked,sa=q("sa").checked;q("sa").disabled=!mod;if(!mod)q("sa").checked=false;sa=q("sa").checked;
 var name,txt;
 if(!cr&&mod&&com&&!sa){name="CC0";txt="You give up all rights. The work goes to the <b>public domain</b>. Credit is not required."}
 else{var s="CC BY";if(!com)s+="-NC";if(!mod)s+="-ND";if(mod&&sa)s+="-SA";name=s;txt="Every Creative Commons license (except CC0) <b>requires credit</b>."+(!cr?" <i>You unchecked credit, so use CC0 only if you also allow every other use.</i>":"")+(" People may "+(mod?"remix it":"share it unchanged")+", "+(com?"including for money":"for non-commercial uses only")+(mod&&sa?", and must share remixes under the same license":"")+".");}
 out.innerHTML='Your license: <b style="font-size:20px;color:#A3E635">'+name+'</b><br>'+txt;}
root.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Who Owns a Creation?",
             "<b>Intellectual property</b> is something a person creates with their mind: a song, a photo, a story, a program. Creators have legal rights over it. <b>Copyright</b> is the legal protection that gives the creator the right to say who may <b>copy, share, and change</b> the work. It applies <b>automatically</b> the moment the work is created.",
             tbl(["Word", "Meaning"], [
                 ["<b>Copyright</b>", "legal ownership of a creative work. Others need <b>permission</b> to copy or share it."],
                 ["<b>License</b>", "the permission the owner gives. It states what others may do."],
                 ["<b>Fair use</b>", "limited use without permission for things like criticism, news, teaching, or research. It depends on how much, and why."],
                 ["<b>Plagiarism</b>", "presenting someone else's work as your own. It is an <b>ethics</b> rule, even when no law is broken."],
                 ["<b>Piracy</b>", "copying or sharing protected work (movies, music, software) without permission."],
                 ["<b>Public domain</b>", "works with no copyright left. Anyone may use them."],
             ])),
        part(1, "Computing Makes Copying Easy",
             "A digital copy is perfect, free, and takes a second. That makes it very easy to break copyright by accident, and very hard for creators to stop it.",
             two(box("Legal and ethical", "Something can be <b>legal but unethical</b> (copying an idea so closely that it takes credit) or <b>ethical but illegal</b> (sharing a file to help a friend). The exam asks you to think about <b>both</b>.", "ok"),
                 box("Citing your sources", "Give credit when you use someone else's work: images, code, and ideas. In the Create Task you must <b>credit any code you did not write</b> in a comment.", "ok"))),
        part(2, "Creative Commons",
             "Creators who <b>want</b> people to share their work can give permission in advance with a <b>Creative Commons (CC)</b> license. It is still copyrighted, but it tells everyone <b>exactly what they may do</b>.",
             tbl(["License", "Credit?", "Remix?", "Commercial use?", "Meaning"], [
                 ["<b>CC BY</b>", "yes", "yes", "yes", "do anything if you credit the creator"],
                 ["<b>CC BY-SA</b>", "yes", "yes", "yes", "remixes must use the same license"],
                 ["<b>CC BY-NC</b>", "yes", "yes", "no", "no commercial use"],
                 ["<b>CC BY-ND</b>", "yes", "no", "yes", "share it unchanged only"],
                 ["<b>CC BY-NC-ND</b>", "yes", "no", "no", "the most restrictive: share it, unchanged, for free"],
                 ["<b>CC0</b>", "no", "yes", "yes", "creator gives up all rights (public domain)"],
             ]),
             chooser),
        part(3, "Open Source and Open Access",
             "<b>Open-source</b> software has its <b>source code</b> published so anyone can read it, use it, change it, and share it, under a license. <b>Open access</b> means research and content is free to read.",
             tbl(["", "Proprietary software", "Open-source software"], [
                 ["<b>Source code</b>", "kept secret by the company", "published for anyone to read"],
                 ["<b>Who can change it</b>", "only the company", "anyone (under the license)"],
                 ["<b>Examples</b>", "Microsoft Office, most phone apps", "Linux, Firefox, Python"],
                 ["<b>Pros</b>", "company support, a single plan", "free to use, many eyes find bugs, anyone can improve it"],
                 ["<b>Cons</b>", "cost; you cannot fix it yourself", "may have less support; the license still has rules"],
             ]),
             warn("<b>Open source is not \"no rules\".</b> Each project has a license. Some (like the GPL) require your changes to be shared under the same license. Others (like MIT) only require you to credit the original author."),
             quiz("qz16b", [
                 ("A student copies a photo from a website into a presentation without credit or permission. What is the <b>main problem</b>?", ["Photos cannot be used in presentations", "It may violate the photographer's copyright, and not crediting is also an ethics problem", "The photo is too large", "The photographer owns the student's computer"], 1, "Copyright protects the photo automatically. Using it without permission or credit is a legal and ethical problem."),
                 ("A musician publishes a song with a <b>CC BY-NC</b> license. Which use is allowed?", ["A company uses it in a paid commercial", "A student uses it in a free school video and credits the musician", "Someone sells the song as their own", "Anyone may use it with no credit"], 1, "BY-NC requires <b>credit</b> and allows <b>non-commercial</b> use only."),
                 ("What does it mean for software to be <b>open source</b>?", ["It is free of bugs", "Its source code is published so anyone can read and (under the license) change it", "It only runs on the Internet", "It cannot be copied"], 1, "The <b>source code</b> is available. A license still sets rules for use."),
                 ("Which is the <b>best</b> example of fair use?", ["Copying a whole new movie and posting it", "Quoting a short passage from a book in a school report, with a citation", "Selling copies of someone else's app", "Claiming a classmate's program as your own"], 1, "Fair use is limited: a small amount, for something like criticism or education."),
                 ("Which statement about copyright is true?", ["Copyright protects a work only after it is registered", "Copyright applies automatically when a work is created", "Anything on the Internet is in the public domain", "Giving credit means you never need permission"], 1, "Creators get copyright <b>automatically</b>. Being online does not make a work free to use."),
             ])),
        exam([
            "<b>Copyright</b> gives creators rights over their work automatically. Using it without permission can be illegal and unethical.",
            "<b>Creative Commons</b> licenses let creators allow certain uses in advance. Know BY (credit), NC (no commercial), ND (no changes), and SA (share alike).",
            "<b>Open-source</b> software has public source code. <b>Open access</b> content is free to read. Both still have licenses.",
            "<b>Plagiarism</b> is presenting someone else's work as yours. Always <b>credit</b> the code, images, and ideas you did not create.",
            "Digital copying is easy, so <b>legal</b> and <b>ethical</b> questions come up constantly.",
        ]),
    ]
    return mk(U16, "copyright-open-source.html", "copyright-open-source", "Copyright, Creative Commons, and Open Source", "WHO OWNS A CREATION, AND WHAT YOU MAY DO WITH IT",
              "Copying a file takes a second, but it can be against the law, and almost always raises questions of fairness. Learn what <b>copyright</b> protects, how <b>Creative Commons</b> and <b>open source</b> let creators share on purpose, and what <b>plagiarism</b> is.",
              parts, "Make it, credit it, and read the license.", "Next: the most personal thing computers collect is information about you.")


# =============================================================================================  16.3 PRIVACY
def privacy_pii():
    foot = widget("wgfoot", "Try it: what can a stranger learn from your posts?",
                  "Tick what a person has posted publicly. Then read what someone could work out, and what it could be used for.",
                  '<div class="row foot"></div><div class="out"></div>',
                  r"""
var items=[["Full birthday",3,"Their birth date, which is one of the most common security questions and part of identity theft."],
["Photo with the school logo",2,"Which school they attend, where they are on weekdays."],
["Name of a pet",2,"A very common password and security-question answer."],
["Location tag on every photo",4,"Their home, their routine, and when they are away."],
["Phone number on a profile",3,"A way to contact, spam, or impersonate them."],
["Mother's maiden name",3,"Another common security-question answer."],
["Favorite team and hobbies",1,"What ads to show, and what a scammer could talk about to seem friendly."]];
var f=root.querySelector(".foot"),out=root.querySelector(".out");
f.innerHTML=items.map(function(x,i){return '<label style="display:block;margin:3px 0"><input type="checkbox" data-i="'+i+'"> '+x[0]+'</label>'}).join("");
function upd(){var on=[],risk=0;f.querySelectorAll("input").forEach(function(c){if(c.checked){on.push(items[c.dataset.i]);risk+=items[c.dataset.i][1]}});
 var lvl=risk===0?"none":(risk<5?"low":(risk<9?"medium":"high")),col=({none:"#8B9AAE",low:"#A3E635",medium:"#FBBF24",high:"#F87171"})[lvl];
 out.innerHTML='Privacy risk: <b style="color:'+col+'">'+lvl.toUpperCase()+'</b><div class="bar"><i class="'+(lvl==="high"?"hot":"")+'" style="width:'+Math.min(100,risk/19*100)+'%"></i></div>'+(on.length?on.map(function(x){return '<div style="margin:6px 0"><b>'+x[0]+':</b> '+x[2]+'</div>'}).join("")+(on.length>2?'<div class="note"><b>Together</b> these facts are more dangerous than any one alone. Combining small pieces of data is how identities get stolen.</div>':''):'<div class="note">Nothing shared yet.</div>')}
f.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "What Is Personal Data?",
             "<b>Personally identifiable information (PII)</b> is information that can be used to <b>identify, contact, or locate</b> one person, alone or combined with other information.",
             tbl(["PII (identifies a person)", "Not PII on its own"], [
                 ["full name, home address, phone number", "your favorite color"],
                 ["Social Security number, passport number", "your age range (\"teen\")"],
                 ["birth date, photo of your face, fingerprint", "a general location like \"United States\""],
                 ["email address, account usernames, IP address (in some cases)", "an anonymous count, like \"30 students visited\""],
             ]),
             hint("The key phrase is <b>identify a specific person</b>. Even facts that are harmless alone can become PII when combined.")),
        part(1, "What Gets Collected, and How",
             "Almost everything you do online is recorded by someone.",
             tbl(["Data", "Collected by", "Why"], [
                 ["<b>Searches and clicks</b>", "search engines, websites", "to rank results and show ads"],
                 ["<b>Location</b>", "phone apps, photos (GPS tags)", "maps, weather, ads, sometimes selling it"],
                 ["<b>Cookies</b>", "websites and ad networks", "small files that remember you and follow you across sites"],
                 ["<b>Metadata</b>", "photos, messages, files", "data <b>about</b> data: the time, device, and place of a photo"],
                 ["<b>Purchases and accounts</b>", "stores, apps", "to personalize, and to build a profile"],
             ]),
             "<p>Your collection of data trails is your <b>digital footprint</b>. Some you leave on purpose (a post), some are collected without you noticing (location, browsing).</p>"),
        part(2, "Small Pieces Add Up",
             "A single fact may be harmless. <b>Combined</b>, the facts can identify you, locate you, or answer your security questions.",
             foot,
             warn("<b>Re-identification:</b> data sold as \"anonymous\" can often be matched with another data set to find out who it belongs to. Removing a name does not always remove the person.")),
        part(3, "Why Privacy Matters",
             "Personal data can be <b>useful</b> and <b>dangerous</b> at the same time.",
             two(box("Benefits of sharing data", "Better directions, personalized help, safer cars, medical research that finds cures. Many services are free because of data.", "ok"),
                 box("Risks", "<b>Identity theft</b>, <b>stalking</b>, <b>targeted manipulation</b> by ads or scams, <b>discrimination</b> based on a profile, and <b>permanent records</b>: things posted can be copied and kept.", "bad")),
             "<p><b>Targeted advertising</b> uses what is known about you to choose which ads you see. It can be helpful, but it also means companies keep detailed profiles and sometimes sell them to <b>data brokers</b>.</p>"),
        part(4, "How to Protect Your Privacy",
             "No one step is perfect, but together they help a lot.",
             tbl(["Step", "What it does"], [
                 ["Share <b>less</b>: ask whether a site really needs your data", "less data to leak or sell"],
                 ["Review <b>privacy settings</b> and app permissions (location, camera, contacts)", "stops apps collecting what they do not need"],
                 ["Turn off <b>location tags</b> on photos", "hides where you live and go"],
                 ["Read what a service says it will do with your data (the <b>privacy policy</b>)", "so you know what you agreed to"],
                 ["Use <b>different</b> strong passwords and <b>multifactor authentication</b>", "see the next lesson"],
             ]),
             quiz("qz16c", [
                 ("Which is <b>most clearly</b> PII?", ["A person's favorite song", "A person's name together with their home address", "The number of visitors to a website", "The name of a country"], 1, "A name <b>plus</b> an address identifies and locates a specific person."),
                 ("A photo posted online includes a hidden GPS location in its <b>metadata</b>. What is the main privacy risk?", ["The photo will be slower to load", "People can learn where the photo was taken, perhaps the person's home", "The photo will be deleted", "The photo's colors will change"], 1, "Metadata is <b>data about data</b>, and location metadata can reveal where someone lives or goes."),
                 ("A company sells a data set with names removed, but with birth dates, zip codes, and genders. Why might this still be a privacy problem?", ["Names are never removed", "Combining those details with another data set can re-identify people", "Zip codes are encrypted", "It makes the data too large"], 1, "<b>Re-identification</b>: small facts together can point to one person."),
                 ("Which action <b>best</b> reduces how much personal data an app collects?", ["Accepting all permissions", "Turning off location and contacts permissions the app does not need", "Using the same password everywhere", "Posting more"], 1, "Limit what an app can access. <b>Less data collected</b> means less to leak or sell."),
             ])),
        exam([
            "<b>PII</b> is information that can identify, contact, or locate a specific person, alone or when combined.",
            "<b>Cookies</b>, <b>location</b>, <b>search history</b>, and <b>metadata</b> are common ways data is collected.",
            "Small pieces of data can be <b>combined</b> to identify someone. Anonymous data can sometimes be <b>re-identified</b>.",
            "Collecting data has <b>benefits</b> (personalization, research) and <b>risks</b> (identity theft, tracking, discrimination).",
            "Protect privacy by sharing less, checking permissions and settings, and using strong, unique authentication.",
        ]),
    ]
    return mk(U16, "privacy-pii.html", "privacy-pii", "Privacy and Personal Data", "WHAT YOUR DATA GIVES AWAY",
              "Every search, tap, and photo leaves a trail. Learn what <b>personally identifiable information</b> is, how it is collected, and how small, harmless facts can add up to a very clear picture of you.",
              parts, "Small facts add up.", "Next: how to lock the doors. Passwords, multifactor authentication, phishing, and malware.")


# =============================================================================================  16.4 SAFE COMPUTING
def safe_computing():
    pw = widget("wgpw", "Try it: how long to guess a password?",
                "Type a <b>made-up</b> password (do not use a real one). A program that guesses <b>10 billion times a second</b> tries every combination. Nothing you type here leaves this page.",
                '<div class="row"><input type="text" value="Tiger7" style="width:26ch" autocomplete="off" spellcheck="false" maxlength="40"></div><div class="out"></div>',
                r"""
var inp=root.querySelector("input"),out=root.querySelector(".out");
var common=["password","123456","12345678","qwerty","letmein","iloveyou","admin","welcome","monkey","dragon","football","abc123","password1","11111111"];
function fmt(s){if(s<1)return"instantly";if(s<60)return s.toFixed(0)+" seconds";if(s<3600)return(s/60).toFixed(0)+" minutes";if(s<86400)return(s/3600).toFixed(0)+" hours";if(s<31536000)return(s/86400).toFixed(0)+" days";var y=s/31536000;return y>1e9?"billions of years":(y>1e6?(y/1e6).toFixed(0)+" million years":y.toFixed(0)+" years")}
function upd(){var p=inp.value,n=p.length;if(!n){out.innerHTML="<i>Type a password.</i>";return}
 var set=0;if(/[a-z]/.test(p))set+=26;if(/[A-Z]/.test(p))set+=26;if(/\d/.test(p))set+=10;if(/[^A-Za-z0-9]/.test(p))set+=32;
 if(common.indexOf(p.toLowerCase())>-1){out.innerHTML='<b style="color:#F87171">Cracked instantly.</b> This is on every attacker\'s list of the most common passwords. They try these <b>first</b>.';return}
 var combos=Math.pow(set,n),secs=combos/1e10/2;
 out.innerHTML='Character types give <b>'+set+'</b> possible symbols for each of <b>'+n+'</b> places.<br>'+set+'<sup>'+n+'</sup> = <b>'+(combos>1e15?combos.toExponential(2):Math.round(combos).toLocaleString())+'</b> combinations.<br>Time to try about half of them: <b style="color:'+(secs<3600?"#F87171":(secs<31536000?"#FBBF24":"#A3E635"))+'">'+fmt(secs)+'</b><div class="note"><b>Length beats cleverness.</b> Each extra character multiplies the work. A long phrase of random words is stronger and easier to remember than a short, complicated one.</div>';}
inp.addEventListener("input",upd);upd();
""")
    spot = widget("wgphish", "Try it: spot the red flags",
                  "Here is a fake message. Click every part that should make you suspicious.",
                  '<div style="border:1px solid #232B38;border-radius:8px;padding:14px 16px;background:#10141C;line-height:1.9" class="mail"></div><div class="out" style="margin-top:8px"></div>',
                  r"""
var parts=[["From: <b>support@paypa1-security.com</b>","The sender's domain is <b>paypa1</b> (a number 1), not paypal. A look-alike address."],
["Subject: <b>URGENT: your account will be CLOSED in 24 hours!</b>","<b>Urgency and threats</b> are how scammers rush you into not thinking."],
["Dear customer,","A real company usually uses <b>your name</b>. A generic greeting means a mass message."],
["We noticed suspicious activity. <b>Click here to verify</b> your password and card number now.","A real company will <b>never ask for your password</b> by email. This is the <b>phishing</b> goal."],
["<b>http://paypal.account-verify.xyz/login</b>","The link's real domain is <b>account-verify.xyz</b>. Anything before the last two labels is just a subdomain a scammer chose."],
["Attachment: <b>invoice_scan.exe</b>","An <b>.exe</b> file is a program. Opening it could install <b>malware</b>."]];
var m=root.querySelector(".mail"),out=root.querySelector(".out"),found={};
m.innerHTML=parts.map(function(p,i){return'<div data-i="'+i+'" style="cursor:pointer;padding:2px 8px;border-radius:5px;border:1px dashed transparent">'+p[0]+'</div>'}).join("");
m.addEventListener("click",function(e){var d=e.target.closest("div[data-i]");if(!d)return;var i=d.dataset.i;found[i]=1;d.style.borderColor="#F87171";d.style.background="rgba(248,113,113,.12)";
 var n=Object.keys(found).length;out.innerHTML=Object.keys(found).map(function(k){return'<div style="margin:5px 0">&#9873; '+parts[k][1]+'</div>'}).join("")+'<div class="note">'+n+' of '+parts.length+' red flags found'+(n===parts.length?" - nothing left in this message you can trust.":"")+'</div>'});
""")
    mfa = svg(720, 170,
              sbox(10, 50, 130, 70, "Step 1", "password", "blue") + sarrow(142, 85, 190, 85, "gray") +
              sbox(192, 50, 140, 70, "Step 2", "code sent to your phone", "yellow") + sarrow(334, 85, 382, 85, "gray") +
              sbox(384, 50, 130, 70, "Logged in", "both proved", "green") +
              stext(600, 70, "A thief with only", "red", 13) + stext(600, 88, "your password is", "red", 13) + stext(600, 106, "stopped at step 2.", "red", 13), "multifactor authentication")
    parts_ = [
        part(0, "Authentication: Proving It Is You",
             "<b>Authentication</b> is how a system checks that you are who you say you are. There are three kinds of evidence, and the strongest security uses <b>more than one</b>.",
             tbl(["Factor", "Something you…", "Example"], [
                 ["<b>Knowledge</b>", "<b>know</b>", "a password or PIN"],
                 ["<b>Possession</b>", "<b>have</b>", "your phone (a code is sent), a security key"],
                 ["<b>Inherence</b>", "<b>are</b>", "a fingerprint or face scan"],
             ]),
             fig(mfa, "<b>Multifactor authentication (MFA)</b> needs <b>two or more</b> kinds of proof. A stolen password alone is not enough."),
             pw,
             hint("Use a <b>different</b> password for every account, so one leak does not open everything. A <b>password manager</b> remembers them for you.")),
        part(1, "Phishing",
             "<b>Phishing</b> is a fake message that tricks you into giving away private information (a password, a card number) or clicking something harmful. <b>Spear phishing</b> is aimed at one person and uses details about them.",
             spot,
             tbl(["Red flag", "What to do"], [
                 ["urgent or scary wording", "slow down, and contact the company yourself using its real website"],
                 ["a link whose real domain looks wrong", "do not click. Type the website address yourself."],
                 ["a request for a password or code", "real companies do not ask by email or text"],
                 ["an unexpected attachment", "do not open it"],
             ])),
        part(2, "Malware",
             "<b>Malware</b> (malicious software) is any program designed to harm you or steal from you. It usually gets in when you <b>install or open</b> something you should not have.",
             tbl(["Type", "What it does"], [
                 ["<b>Virus</b>", "attaches to a program and spreads when it runs"],
                 ["<b>Worm</b>", "spreads on its own across a network"],
                 ["<b>Ransomware</b>", "locks your files and demands money to unlock them"],
                 ["<b>Spyware</b>", "secretly watches what you do"],
                 ["<b>Keylogger</b>", "records every key you type, to steal passwords and card numbers"],
             ]),
             two(box("How it gets in", "Phishing attachments, fake downloads, infected websites, USB drives, or out-of-date software.", "bad"),
                 box("How to defend", "<b>Update</b> your software, use antivirus, download only from trusted places, and <b>back up</b> your files (so ransomware has nothing to hold hostage).", "ok"))),
        part(3, "Attacks on Networks",
             "Some attacks are on the network, not on you.",
             tbl(["Attack", "What happens", "Defense"], [
                 ["<b>Rogue access point</b>", "a fake Wi-Fi network (\"Free Airport WiFi\") set up by an attacker. Everything you send goes through them.", "avoid unknown Wi-Fi, use <b>HTTPS</b> and a VPN, never log in to important accounts on public Wi-Fi"],
                 ["<b>DDoS</b> (distributed denial of service)", "thousands of infected devices (a <b>botnet</b>) all send requests at once so a website is overwhelmed and crashes", "traffic filtering, extra servers; keep your own devices updated so they do not join a botnet"],
                 ["<b>Man-in-the-middle</b>", "an attacker sits between you and a site, reading or changing the messages", "<b>encryption</b> (HTTPS) so what they see is nonsense"],
             ]),
             hint("<b>Encryption</b> from Unit 8 is the main defense on the road. HTTPS and its lock icon mean the traffic is encrypted and the certificate says whose website it is."),
             quiz("qz16d", [
                 ("A website needs both your password <b>and</b> a code sent to your phone. This is called…", ["Phishing", "Multifactor authentication", "A rogue access point", "Lossy compression"], 1, "Two <b>different kinds of proof</b> (something you know and something you have) is MFA."),
                 ("A message says \"Your account will close today! Click here to enter your password.\" The link goes to a look-alike site. This is…", ["Phishing", "A DDoS attack", "Encryption", "A cache"], 0, "A fake message tricking you into giving up information is <b>phishing</b>."),
                 ("Which program secretly records everything a user types?", ["Ransomware", "Keylogger", "Worm", "Firewall"], 1, "A <b>keylogger</b> records keystrokes to steal passwords and card numbers."),
                 ("A hacker makes a Wi-Fi network named \"Free Airport WiFi\" so travelers connect and the hacker can see their traffic. This is a…", ["Rogue access point", "Citizen science project", "Packet switch", "Digital divide"], 0, "A fake access point that captures traffic is a <b>rogue access point</b>."),
                 ("Which would be the <b>strongest</b> password choice, and why?", ["Tiger7, because it has a capital and a number", "A long phrase of several random words, because length makes it far harder to guess", "123456, because it is easy to remember", "The user's birthday"], 1, "Each added character multiplies the guesses needed. Long random phrases are both strong and memorable."),
                 ("Thousands of infected devices all send requests to one website until it crashes. This is…", ["A DDoS attack", "A phishing email", "Open source", "Metadata"], 0, "A <b>distributed denial of service</b> attack uses many devices (a botnet) to overwhelm a site."),
             ])),
        exam([
            "<b>Authentication</b> proves who you are. <b>Multifactor authentication</b> uses two or more kinds of proof (know, have, are).",
            "<b>Phishing</b> tricks people into giving up private information. Know its red flags.",
            "<b>Malware</b> includes viruses, worms, ransomware, spyware, and <b>keyloggers</b>.",
            "A <b>rogue access point</b> is a fake Wi-Fi network. A <b>DDoS</b> attack uses many devices to overwhelm a site.",
            "<b>Encryption</b> (HTTPS), software updates, strong unique passwords, and backups are the main defenses.",
        ]),
    ]
    return mk(U16, "safe-computing.html", "safe-computing", "Safe Computing", "LOCKING THE DOORS",
              "Strong passwords, a second step to log in, and a suspicious eye for messages stop most attacks. Learn <b>authentication</b>, <b>phishing</b>, <b>malware</b>, <b>rogue Wi-Fi</b>, and <b>DDoS</b>, and what actually protects you.",
              parts_, "Most attacks start with a person, not a program.", "That is every idea in the Impact of Computing. Use the walkthroughs to put the ideas in your own words.")


PAGES = {
    "beneficial-harmful": beneficial_harmful,
    "digital-divide": digital_divide,
    "crowdsourcing": crowdsourcing,
    "computing-bias": computing_bias,
    "copyright-open-source": copyright_open_source,
    "privacy-pii": privacy_pii,
    "safe-computing": safe_computing,
}


def _idx(U, intro):
    lessons = [(TITLES[f], f, "&#128214; Notes &nbsp;+&nbsp; &#128187; Walkthrough &nbsp;+&nbsp; check-yourself questions") for f, _ in U["pages"]]
    return unit_index(U["label"], U["n"], intro, lessons)


INDEXES = {
    "unit-11": lambda: _idx(U11, '<p>The Internet changed who can share ideas, work, and data. This unit is about <b>what that change does to people</b>: the good and bad effects, who gets left out, and how crowds solve problems. These pages cover Big Idea 5 on the AP exam (Impact of Computing).</p>'
                          '<p style="font-size:14px;opacity:.8">Read the notes, try the activities, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>. In the walkthrough you write what you learned as notes and test it with small programs.</p>'),
    "unit-16": lambda: _idx(U16, '<p>Computing does not just do what it is told. It copies human bias, raises questions about who owns what, collects personal data, and can be attacked. These pages cover Big Idea 5 on the AP exam (Impact of Computing), plus how to protect yourself.</p>'
                          '<p style="font-size:14px;opacity:.8">Read the notes, try the activities, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>.</p>'),
}
