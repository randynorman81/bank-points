"""Unit 10: The Internet. Seven notes pages (10.1, 10.3 to 10.8). Vocabulary and analogies follow the Unit 10 walkthroughs (highway, neighborhood, phone book)."""
from lib import *

UNIT_DIR = "unit-10"
UNIT_LABEL = "Unit 10: The Internet"
LESSONS = [
    ("internet-highway.html", "10.1 The Highway"),
    ("internet-addresses.html", "10.3 Addresses"),
    ("router-neighborhood.html", "10.4 Router and NAT"),
    ("dns.html", "10.5 DNS"),
    ("routing.html", "10.6 Routing"),
    ("packets-protocols.html", "10.7 Packets"),
    ("parallel-distributed.html", "10.8 Parallel"),
]
SUBS = {
    "internet-highway.html": ("The Internet Is a Highway (10.1 and 10.2)", "Network of networks, bandwidth, ISP, modem and router"),
    "internet-addresses.html": ("Internet Addresses (10.3)", "IP addresses, IPv4 and IPv6, binary, public and private"),
    "router-neighborhood.html": ("Your Router Is a Neighborhood (10.4)", "Private addresses, NAT, DHCP"),
    "dns.html": ("DNS: The Internet's Phone Book (10.5)", "Domain names, the DNS hierarchy, caching"),
    "routing.html": ("Routing and Fault Tolerance (10.6)", "Hops, paths, redundancy"),
    "packets-protocols.html": ("Packets and Protocols (10.7)", "Packets, TCP and UDP, open standards, the Web"),
    "parallel-distributed.html": ("Parallel and Distributed Computing (10.8)", "Speedup, the longest path, sharing the work"),
}
# walkthrough / assignment / game slots per page (the Python editor)
SLOTS = {
    "internet-highway.html": dict(walk="a124"),
    "internet-addresses.html": dict(walk="a101", game="a102"),
    "router-neighborhood.html": dict(walk="a125"),
    "dns.html": dict(walk="a103", game="a104"),
    "routing.html": dict(walk="a105", game="a106"),
    "packets-protocols.html": dict(walk="a107", game="a108"),
    "parallel-distributed.html": dict(walk="a194"),
}


def order(slug):
    names = [f for f, _ in LESSONS]
    i = names.index(slug + ".html")
    prev = (LESSONS[i - 1][0], SUBS[LESSONS[i - 1][0]][0]) if i > 0 else None
    nxt = (LESSONS[i + 1][0], SUBS[LESSONS[i + 1][0]][0]) if i < len(LESSONS) - 1 else None
    return prev, nxt


def mk(slug, title, subject, deck, parts, fh, fp):
    prev, nxt = order(slug)
    s = SLOTS[slug + ".html"]
    return page(slug, title, subject, deck, UNIT_DIR, UNIT_LABEL, LESSONS, "".join(parts), fh, fp, prev, nxt,
                walk=s.get("walk"), asg=s.get("asg"), game=s.get("game"), concept=SUBS[slug + ".html"][0])


# =====================================================================================================  10.1 THE HIGHWAY
def internet_highway():
    nets = svg(700, 250,
               sbox(20, 20, 150, 62, "Home", "your Wi-Fi", "teal") + sbox(20, 100, 150, 62, "School", "SCHS network", "blue") +
               sbox(20, 180, 150, 62, "Company", "its own network", "purple") +
               sarrow(172, 51, 270, 110, "gray") + sarrow(172, 131, 270, 131, "gray") + sarrow(172, 211, 270, 150, "gray") +
               sbox(272, 90, 150, 82, "Routers", "pass data along", "yellow") +
               sarrow(424, 131, 520, 131, "gray") +
               sbox(522, 50, 160, 62, "Other networks", "thousands more", "orange") + sbox(522, 150, 160, 62, "Servers", "websites and apps", "pink") +
               sarrow(520, 120, 600, 114, "gray") + sarrow(520, 140, 600, 148, "gray"), "networks joined by routers")
    house = svg(720, 150,
                sbox(10, 40, 110, 66, "ISP", "AT&T, Verizon", "orange") + sarrow(122, 73, 188, 73, "gray", "fiber", False) +
                sbox(190, 40, 110, 66, "Modem", "front door", "yellow") + sarrow(302, 73, 368, 73, "gray") +
                sbox(370, 40, 110, 66, "Router", "shares it", "teal") + sarrow(482, 73, 548, 52, "gray") + sarrow(482, 73, 548, 95, "gray") +
                sbox(550, 22, 160, 44, "Phones and laptops", "", "blue", "cp") + sbox(550, 82, 160, 44, "TVs and consoles", "", "purple", "cp"),
                "the path from the ISP into the house")

    traffic = widget("wgtraffic", "Try it: the traffic jam",
                     "Pick your plan (the number of lanes), then switch on what your house is doing at the same time.",
                     '<div class="row"><label>Plan: <input type="range" min="10" max="500" step="10" value="50"> <b class="mono"><span class="pv">50</span> Mbps</b></label></div><div class="acts"></div><div class="bar"><i style="width:0"></i></div><div class="out"></div>',
                     r"""
var acts=[["Browsing text pages",1,"motorcycle"],["Music streaming",1,"motorcycle"],["Video call",3,"car"],["HD video",5,"car"],["Online game",10,"car"],["4K movie",25,"semi-trailer"],["Big file download",50,"semi-trailer"]];
var box=root.querySelector(".acts"),rg=root.querySelector("input[type=range]"),pv=root.querySelector(".pv"),bar=root.querySelector(".bar i"),out=root.querySelector(".out");
box.innerHTML=acts.map(function(a,i){return '<label style="display:block;margin:4px 0"><input type="checkbox" data-i="'+i+'"> '+a[0]+' <span class="chip">'+a[1]+' Mbps &middot; '+a[2]+'</span></label>'}).join("");
function upd(){var plan=Number(rg.value),use=0;pv.textContent=plan;box.querySelectorAll("input").forEach(function(c){if(c.checked)use+=acts[c.dataset.i][1]});
 var pct=Math.min(100,use/plan*100);bar.style.width=pct+"%";bar.className=use>plan?"hot":"";
 out.innerHTML=use===0?"No traffic yet. Switch something on.":'Traffic: <b>'+use+' Mbps</b> on a <b>'+plan+' Mbps</b> highway. '+(use>plan?'<i>Traffic jam!</i> The traffic needs more lanes than you have, so everything slows down and videos buffer.':'There is still room: <b>'+(plan-use)+' Mbps</b> of free lanes.');}
box.addEventListener("change",upd);rg.addEventListener("input",upd);upd();
""")

    dl = widget("wgdl", "Try it: how long will the download take?",
                "Files are measured in <b>bytes</b>. Bandwidth is measured in <b>bits</b>. Multiply the file by 8 first.",
                '<div class="row"><label>File size <input type="number" value="600" min="1" style="width:9ch"></label> <select><option value="1">MB (megabytes)</option><option value="1000">GB (gigabytes)</option></select> <label>Speed <input type="number" value="100" min="1" style="width:9ch"> Mbps</label></div><div class="out"></div>',
                r"""
var ins=root.querySelectorAll("input"),sel=root.querySelector("select"),out=root.querySelector(".out");
function upd(){var size=Number(ins[0].value)||0,mb=size*Number(sel.value),megabits=mb*8,speed=Number(ins[1].value)||1,s=megabits/speed;
 var t=s<60?s.toFixed(1)+" seconds":(s<3600?(s/60).toFixed(1)+" minutes":(s/3600).toFixed(2)+" hours");
 out.innerHTML=mb+' MB &times; 8 = <b>'+megabits+' megabits</b><br>'+megabits+' megabits &divide; '+speed+' Mbps = <b>'+s.toFixed(1)+' seconds</b>'+(s>=60?' ('+t+')':'');}
root.addEventListener("input",upd);root.addEventListener("change",upd);upd();
""")

    parts = [
        part(0, "A Network of Networks",
             "The Internet is not one computer in one building. It is a <b>network of networks</b>: your home network, your school network, and thousands of company networks, all <b>connected</b> and all following the same rules, called <b>protocols</b>. <b>No one owns all of it.</b>",
             tbl(["Word", "Meaning", "Example"], [
                 ["<b>Computing device</b>", "A physical thing that can run a program", "laptop, phone, game console, smart sensor"],
                 ["<b>Computing system</b>", "Devices and programs working together for one purpose", "a school's network and its servers"],
                 ["<b>Network</b>", "A group of computing devices that can send and receive data", "your home Wi-Fi"],
                 ["<b>Path</b>", "The chain of connected devices a message travels, from the sender to the receiver", "laptop, router, router, server"],
                 ["<b>Bandwidth</b>", "The most data that can be sent in a fixed amount of time", "100 megabits per second"],
                 ["<b>Protocol</b>", "An agreed set of rules for how devices communicate", "IP, TCP, HTTP"],
                 ["<b>The Internet</b>", "A computer network that uses <b>open protocols</b> so any device can join", "the thing you are using right now"],
             ]),
             fig(nets, "Many separate networks are joined by <b>routers</b>. Together they are the Internet."),
             ),
        part(1, "The Internet Is Not the Web",
             "People say \"the Internet\" when they mean \"the Web\". They are <b>not the same thing</b>.",
             tbl(["", "The Internet", "The World Wide Web"], [
                 ["<b>What it is</b>", "The <b>network</b>: the cables, wireless links, routers, and the protocols", "A <b>service</b>: linked pages and apps that you open with a browser"],
                 ["<b>Rules it uses</b>", "IP, TCP, UDP", "HTTP and HTTPS (and it runs <i>on top of</i> the Internet)"],
                 ["<b>Examples</b>", "Everything that travels over it", "websites, web apps"],
                 ["<b>Other things that use the Internet</b>", "email, online games, video calls, streaming, texting apps", "(these are not the Web)"],
             ]),
             callout("The Web is just <b>one thing</b> that runs on the Internet.", "If your browser is closed, the Internet is still working: your phone can still get a text or play an online game.")),
        part(2, "Bandwidth: How Many Lanes?",
             "Picture the Internet as a giant <b>highway</b>. The roads are the cables and wireless links. Your data is the <b>traffic</b>. <b>Bandwidth</b> is the number of <b>lanes</b>: the most data that can travel at the same time. It is measured in <b>bits per second</b>: <b>Mbps</b> (millions) or <b>Gbps</b> (billions, so 1 Gbps is 1,000 Mbps).",
             tbl(["Vehicle", "Activity", "Roughly how many lanes it takes"], [
                 ["<b>Motorcycle</b>", "reading a text page, music, a text message", "1 Mbps or less"],
                 ["<b>Car</b>", "HD video, a video call, an online game", "3 to 10 Mbps"],
                 ["<b>Semi-trailer</b>", "a 4K movie, a huge download", "25 Mbps or more"],
             ]),
             "<p>The lanes are <b>shared by every device in the house</b>. When too many big vehicles are on the road at once, the lanes fill up, traffic backs up, and everything gets slow. That is the buffering circle on a video.</p>",
             traffic,
             hint("<b>More bandwidth = more lanes.</b> It lets more data move at the same time, but it does not make one trip shorter. See the next part.")),
        part(3, "Bandwidth Versus Latency",
             "These two ideas get mixed up all the time.",
             tbl(["", "Bandwidth", "Latency"], [
                 ["<b>It measures</b>", "How much data can move at once", "How long one trip takes (a delay)"],
                 ["<b>Highway picture</b>", "The number of lanes", "How long the road is, and the speed limit"],
                 ["<b>Units</b>", "bits per second (Mbps, Gbps)", "time (milliseconds, ms)"],
                 ["<b>Matters most for</b>", "big downloads, 4K video", "online games, video calls"],
             ]),
             ex("<b>Example:</b> Adding lanes (more bandwidth) lets more cars travel together, but a car still needs the same time to drive from one town to the other. A far-away server has more latency than a nearby one, even on a fast plan.")),
        part(4, "How the Internet Gets Into Your House",
             "A company called an <b>ISP</b> (Internet Service Provider, like AT&amp;T or Verizon) owns a huge network of cables. To get you online, the ISP runs a cable, often <b>fiber optic</b> (data sent as pulses of light), from the street into your home.",
             fig(house, "The cable from the ISP plugs into the <b>modem</b>. The <b>router</b> shares that one connection with all your devices."),
             two(box("Modem = the front door", "It brings the Internet <b>in</b> from the ISP's cable. It is the doorway between your house and the Internet.", "ok"),
                 box("Router = the streets inside", "It <b>shares</b> that one connection with every device, over Wi-Fi and cables. Like the streets inside a neighborhood.", "ok")),
             hint("Many home boxes are <b>both</b> a modem and a router in one case, but the two jobs are different: the modem brings the Internet in, the router shares it.")),
        part(5, "How Long Will It Take?",
             "Speed is bandwidth, and bandwidth is in <b>bits</b>. Files are measured in <b>bytes</b>. <b>1 byte = 8 bits.</b> So change the file to bits first, then divide by the speed.",
             ex("<b>Example:</b> a 200 MB game update. 200 &times; 8 = <b>1,600 megabits</b>. At 100 Mbps: 1,600 &divide; 100 = <b>16 seconds</b>."),
             dl,
             warn("<b>Watch the capital letters.</b> <code>Mbps</code> with a small <b>b</b> is megabits per second (the plan). <code>MB</code> with a capital <b>B</b> is megabytes (the file). That is a factor of 8."),
             quiz("qz1", [
                 ("Which statement describes the Internet best?", ["One very large computer run by a single company", "A network of networks that use open protocols", "The same thing as the World Wide Web", "A collection of websites"], 1,
                  "The Internet is a <b>network of networks</b> that follow open protocols. The Web is just one service that runs on it."),
                 ("A family has a 50 Mbps plan. At the same time they stream two 4K movies (25 Mbps each) and make a video call (3 Mbps). What is most likely?", ["Everything works perfectly", "The traffic needs 53 Mbps, which is more than 50, so things slow down", "The modem stops working", "The Web is no longer connected to the Internet"], 1,
                  "25 + 25 + 3 = 53 Mbps. That is more lanes than the plan gives, so traffic backs up."),
                 ("How long does a 600 MB file take to download at 100 Mbps?", ["6 seconds", "48 seconds", "480 seconds", "4,800 seconds"], 1,
                  "600 MB &times; 8 = 4,800 megabits. 4,800 &divide; 100 = <b>48 seconds</b>. (6 seconds forgets to multiply by 8.)"),
                 ("In the highway picture, which device is the <b>front door</b> that brings the Internet into your house?", ["The router", "The modem", "The browser", "The Wi-Fi password"], 1,
                  "The <b>modem</b> connects to the ISP's cable. The router shares the connection inside the house."),
                 ("Which is true about bandwidth and latency?", ["Bandwidth is how long a trip takes", "Latency is how much data can move at once", "Adding bandwidth does not shorten one trip", "They mean the same thing"], 2,
                  "Bandwidth is the number of lanes. Latency is the delay. More lanes does not make one car arrive sooner."),
             ])),
        exam([
            "The Internet is a <b>network of networks</b> that uses <b>open protocols</b>. No one owns it all.",
            "The <b>Web</b> is a service that runs on the Internet. They are not the same thing.",
            "A <b>path</b> is the sequence of connected devices between a sender and a receiver.",
            "<b>Bandwidth</b> is the most data that can be sent in a fixed amount of time, in <b>bits per second</b>.",
            "Download time = file size in <b>bits</b> &divide; bandwidth. 1 byte = 8 bits.",
            "An <b>ISP</b> connects your home to the Internet. The modem brings the connection in and the router shares it.",
        ]),
    ]
    return mk("internet-highway", "The Internet Is a Highway", "THE INTERNET AS A HIGHWAY",
              "The Internet is a giant <b>highway system</b>, and everything you do online is <b>traffic</b> on it. Once you can picture the lanes, the vehicles, and the front door to your house, bandwidth and speed make sense.",
              parts, "Picture the highway, and the rest is details.", "Next: every device on the highway needs an address, or no data could find it.")


# =====================================================================================================  10.3 ADDRESSES
def internet_addresses():
    chain = svg(720, 130,
                sbox(5, 30, 120, 66, "IANA", "global pool", "purple") + sarrow(127, 63, 160, 63, "gray") +
                sbox(162, 30, 120, 66, "Registries", "regional", "blue") + sarrow(284, 63, 317, 63, "gray") +
                sbox(319, 30, 120, 66, "ISP", "gets a block", "orange") + sarrow(441, 63, 474, 63, "gray") +
                sbox(476, 30, 112, 66, "Router", "1 public", "yellow") + sarrow(590, 63, 618, 63, "gray") +
                sbox(620, 30, 96, 66, "Devices", "private", "teal"), "who hands out addresses")

    inspector = widget("wgip", "Try it: the address inspector",
                       "Type an IPv4 address. It checks that it is valid, shows the 32 bits, and says whether it is private, public, or loopback.",
                       '<div class="row"><input type="text" value="192.168.1.10" style="width:20ch" maxlength="15" spellcheck="false"></div><div class="out"></div><div class="bits"></div>',
                       r"""
var inp=root.querySelector("input"),out=root.querySelector(".out"),bits=root.querySelector(".bits");
function bin8(n){var s=n.toString(2);while(s.length<8)s="0"+s;return s}
function kind(p){var a=p[0],b=p[1];if(a===127)return ["loopback","this computer itself (localhost). Data sent here never leaves the machine.","teal"];
 if(a===10||(a===172&&b>=16&&b<=31)||(a===192&&b===168))return ["private","only works inside a home or school network. Thousands of networks reuse these numbers.","blue"];
 if(a===169&&b===254)return ["link-local","a self-assigned address a device uses when no DHCP server answered.","orange"];
 return ["public","unique on the whole Internet. Your ISP gives your router one.","green"];}
function upd(){var t=inp.value.trim(),p=t.split(".");bits.innerHTML="";
 var ok=p.length===4&&p.every(function(x){return /^\d{1,3}$/.test(x)&&Number(x)<=255});
 if(!ok){var why=p.length!==4?"An IPv4 address has exactly <b>four</b> numbers separated by dots.":"Each number must be a whole number from <b>0 to 255</b> (one byte).";out.innerHTML='<i>Not a valid IPv4 address.</i> '+why;return}
 p=p.map(Number);var k=kind(p);
 out.innerHTML='<b>'+t+'</b> is a valid IPv4 address and it is <b style="color:'+({teal:"#34D399",blue:"#60A5FA",orange:"#FB923C",green:"#A3E635"})[k[2]]+'">'+k[0]+'</b>: '+k[1];
 bits.innerHTML=p.map(function(n){var b=bin8(n);return '<div style="display:inline-block;margin:6px 10px 0 0"><div class="mono" style="font-size:12px;color:#8B9AAE;text-align:center">'+n+'</div>'+b.split("").map(function(c){return '<span class="cell'+(c==="1"?" on":"")+'" style="width:20px;height:26px;cursor:default;margin-right:1px"></span>'}).join("")+'<div class="mono" style="text-align:center;font-size:13px">'+b+'</div></div>'}).join("")+'<div class="note">4 numbers &times; 8 bits = <b>32 bits</b>. A lit square is a 1.</div>';}
inp.addEventListener("input",upd);upd();
""")

    parts = [
        part(0, "What Is an IP Address?",
             "An <b>IP address</b> (Internet Protocol address) is a <b>unique number</b> that <b>identifies one device</b> on a network. It works like the address on a house: the post office needs it to know where to deliver. Phones, laptops, game consoles, and the school server each have one.",
             "<p>Every chunk of data you send carries <b>two addresses</b>: the <b>source</b> (who sent it) and the <b>destination</b> (where it is going). Routers read the destination to decide where to send it next.</p>",
             ex("<b>Example:</b> <code>192.168.1.10</code> is an IPv4 address. <code>2001:0db8:85a3::8a2e:0370:7334</code> is an IPv6 address.")),
        part(1, "IPv4: Four Numbers, 32 Bits",
             "An <b>IPv4</b> address has <b>four numbers</b> called <b>octets</b>, each from <b>0 to 255</b>. Each octet is <b>8 bits</b> (one byte), so the whole address is 4 &times; 8 = <b>32 bits</b>.",
             inspector,
             hint("Why 0 to 255? One byte is 8 bits, and 8 bits make 2<sup>8</sup> = 256 patterns, which count from 0 up to 255. This is the same idea as the Unit 8 notes.")),
        part(2, "Running Out of Addresses: IPv6",
             "With 32 bits there are 2<sup>32</sup> = <b>4,294,967,296</b> IPv4 addresses. That sounds like a lot, but there are <b>more devices than that</b>, so the world <b>ran out</b>.",
             tbl(["", "IPv4", "IPv6"], [
                 ["<b>Bits</b>", "32", "128"],
                 ["<b>Looks like</b>", "four numbers with dots: <code>192.168.1.20</code>", "eight groups of hex with colons: <code>2001:db8::1</code>"],
                 ["<b>How many</b>", "about 4.3 billion (2<sup>32</sup>)", "about 340 undecillion (2<sup>128</sup>)"],
                 ["<b>Why it exists</b>", "the original", "created because IPv4 <b>ran out</b>"],
             ]),
             ex("<b>The exam idea:</b> a longer address means <b>many more</b> possible addresses. Every extra bit <b>doubles</b> the count, so IPv6 is not four times bigger, it is <b>vastly</b> bigger.")),
        part(3, "Binary by Hand",
             "How does <code>192</code> become <code>11000000</code>? Each bit is worth a power of 2, from left to right: <b>128, 64, 32, 16, 8, 4, 2, 1</b>. A 1 means add that place value.",
             tbl(["128", "64", "32", "16", "8", "4", "2", "1", "Total"], [["1", "1", "0", "0", "0", "0", "0", "0", "128 + 64 = <b>192</b>"], ["1", "0", "1", "0", "1", "0", "0", "0", "128 + 32 + 8 = <b>168</b>"]]),
             "<p>Try the inspector above with <code>192.168.1.10</code>. The first octet is <code>11000000</code> and the second is <code>10101000</code>.</p>"),
        part(4, "Public, Private, and Loopback",
             "Not every address works the same way.",
             tbl(["Kind", "Which numbers", "What it means"], [
                 ["<b>Private</b>", "<code>10.x.x.x</code>, <code>172.16.x.x</code> to <code>172.31.x.x</code>, <code>192.168.x.x</code>", "Used <b>inside</b> a home or school. Not reachable from the Internet. Thousands of networks reuse the same ones."],
                 ["<b>Public</b>", "everything else, like <code>142.250.80.46</code>", "<b>Unique across the whole Internet.</b> Your ISP gives your router one."],
                 ["<b>Loopback</b>", "<code>127.0.0.1</code>", "Always means <b>this computer</b> (also called <code>localhost</code>). Data never leaves your machine."],
             ]),
             warn("Private addresses are not <i>secret</i>. They are just not <b>routable</b> from the Internet. The next lesson shows how a router lets private devices share one public address.")),
        part(5, "Who Hands Out Addresses?",
             "Addresses are given out in <b>layers</b>. A global group (<b>IANA</b>) hands big blocks to regional registries, which hand them to <b>ISPs</b>. Your ISP gives your router a public address.",
             fig(chain, "Inside your home, the router runs <b>DHCP</b>, which gives each device a temporary private address. That is why your phone's address can change."),
             quiz("qz2", [
                 ("How many bits are in an IPv4 address?", ["8", "16", "32", "128"], 2, "Four octets &times; 8 bits = <b>32 bits</b>. IPv6 has 128 bits."),
                 ("Which of these is a <b>private</b> IPv4 address?", ["8.8.8.8", "192.168.1.20", "142.250.80.46", "93.184.216.34"], 1, "<code>192.168.x.x</code> is one of the three private ranges. The others are public."),
                 ("Which could <b>not</b> be an IPv4 address?", ["172.16.0.1", "10.0.0.256", "192.0.2.1", "255.255.255.255"], 1, "Each octet is one byte, so the biggest is 255. <code>256</code> does not fit in 8 bits."),
                 ("Why was IPv6 created?", ["IPv4 was too slow", "IPv4 ran out of addresses", "IPv4 could not be encrypted", "IPv4 only worked in the United States"], 1, "32 bits give only about 4.3 billion addresses. IPv6 uses <b>128 bits</b>."),
                 ("What does the address <code>127.0.0.1</code> mean?", ["The router", "The ISP", "This computer itself", "A public website"], 2, "<b>Loopback</b> means \"this device\". Data sent there never leaves your machine."),
             ])),
        exam([
            "An <b>IP address</b> is a unique number that identifies a device. Data carries a <b>source</b> and a <b>destination</b> address.",
            "<b>IPv4</b> is 32 bits (four octets). <b>IPv6</b> is 128 bits. IPv6 exists because IPv4 <b>ran out</b>.",
            "n bits can make <b>2<sup>n</sup></b> different addresses.",
            "<b>Private</b> addresses work only inside a network. <b>Public</b> addresses are unique on the Internet.",
            "ISPs get blocks of addresses and give your router a public one.",
        ]),
    ]
    return mk("internet-addresses", "Internet Addresses", "EVERY DEVICE NEEDS AN ADDRESS",
              "Every device on the Internet needs an <b>address</b>, or no data could ever find it. Learn what an IP address is, why there are two kinds (IPv4 and IPv6), and how to read one in binary.",
              parts, "An address is a number, and a number is just bits.", "Next: how a home router lets many private devices share one public address.")


# =====================================================================================================  10.4 ROUTER NEIGHBORHOOD
def router_neighborhood():
    def nat(step):
        nodes = (sbox(10, 20, 150, 56, "Laptop", "192.168.1.20", "teal") + sbox(10, 120, 150, 56, "Phone", "192.168.1.21", "blue") +
                 sbox(270, 50, 170, 100, "Router", "private 192.168.1.1", "yellow") + stext(355, 176, "public 203.0.113.9", "yellow", 13) +
                 sbox(566, 60, 140, 80, "Web server", "93.184.216.34", "pink"))
        extra = ""
        if step == 0:
            extra = sarrow(162, 48, 268, 90, "teal", "", False) + stext(215, 40, "from 192.168.1.20", "teal", 12) + stext(150, 200, "1. The laptop asks for a web page.", "white", 14) + stext(150, 220, "Source: 192.168.1.20   Destination: 93.184.216.34", "teal", 13)
        elif step == 1:
            extra = (sarrow(442, 100, 564, 100, "yellow", "", False) + stext(503, 76, "from", "yellow", 12) + stext(503, 90, "203.0.113.9:6001", "yellow", 12) +
                     stext(355, 205, "2. The router swaps in its PUBLIC address and remembers who asked:", "white", 14) + stext(355, 226, "NAT table:  6001  =  192.168.1.20", "yellow", 14))
        elif step == 2:
            extra = (sarrow(564, 112, 442, 112, "pink", "", False) + stext(503, 130, "reply to", "pink", 12) + stext(503, 144, "203.0.113.9:6001", "pink", 12) +
                     stext(355, 205, "3. The server only ever saw the router's public address.", "white", 14) + stext(355, 226, "It replies to 203.0.113.9, port 6001.", "pink", 13))
        else:
            extra = (sarrow(268, 108, 162, 56, "teal", "", False) + stext(215, 110, "to the laptop", "teal", 12) +
                     stext(355, 205, "4. The router looks up 6001 in its table and delivers it to the laptop.", "white", 14) + stext(355, 226, "The phone never gets it.", "yellow", 13))
        return svg(710, 240, nodes + extra, "NAT step %d" % (step + 1))

    nat_stepper = stepper("stpnat", "Click through: how NAT sends a request out and brings the reply back",
                          [(nat(i), c) for i, c in enumerate([
                              "The laptop sends a request. It uses its <b>private</b> address as the source.",
                              "The router rewrites the source to its own <b>public</b> address and writes a note in the <b>NAT table</b> so it remembers who asked.",
                              "The server sends the reply to the router's <b>public</b> address. It has no idea the laptop exists.",
                              "The router checks its table and passes the reply to the <b>right house</b>."])])

    hood = svg(720, 200,
               sbox(10, 70, 130, 60, "Internet", "one road in", "orange") + sarrow(142, 100, 210, 100, "gray") +
               sbox(212, 56, 130, 88, "Router", "the gatehouse", "yellow") +
               sarrow(344, 80, 410, 44, "gray") + sarrow(344, 100, 410, 100, "gray") + sarrow(344, 120, 410, 158, "gray") +
               sbox(412, 20, 150, 46, "House: laptop", "", "teal", "cp") + sbox(412, 80, 150, 46, "House: phone", "", "blue", "cp") + sbox(412, 138, 150, 46, "House: console", "", "purple", "cp") +
               stext(640, 44, "192.168.1.20", "teal", 13) + stext(640, 104, "192.168.1.21", "blue", 13) + stext(640, 162, "192.168.1.22", "purple", 13),
               "a home network as a neighborhood")

    dhcp = widget("wgdhcp", "Try it: DHCP hands out house numbers",
                  "The router keeps a pool of private addresses. Click a device to make it join the Wi-Fi (it gets the next free address) or leave (the address goes back to the pool).",
                  '<div class="row devs"></div><div class="out"></div>',
                  r"""
var names=["Laptop","Phone","Smart TV","Game console","Tablet","Smart speaker"],lease={},devs=root.querySelector(".devs"),out=root.querySelector(".out");
devs.innerHTML=names.map(function(n){return '<button data-n="'+n+'">'+n+'</button>'}).join("");
function lowest(){var used={};for(var k in lease)used[lease[k]]=1;for(var i=2;i<255;i++)if(!used[i])return i}
function draw(){var rows=names.map(function(n){return '<tr><td>'+n+'</td><td>'+(lease[n]?'<b>192.168.1.'+lease[n]+'</b>':'<i>not connected</i>')+'</td></tr>'}).join("");
 out.innerHTML='<table><tr><th>Device</th><th>Address (lease)</th></tr>'+rows+'</table><div class="note">The router is <b>192.168.1.1</b>. Make a device leave and another join: it can get the <b>same number</b> the first one had. That is why a phone\'s address changes over time.</div>';
 devs.querySelectorAll("button").forEach(function(b){b.className=lease[b.dataset.n]?"bit on":"";b.style.cssText="width:auto;height:auto;padding:8px 12px;display:inline-block;font-size:14px"})}
devs.addEventListener("click",function(e){var n=e.target.dataset&&e.target.dataset.n;if(!n)return;if(lease[n])delete lease[n];else lease[n]=lowest();draw()});draw();
""")

    parts = [
        part(0, "Your Router Is a Neighborhood",
             "Picture your <b>router</b> as a <b>neighborhood</b>. <b>One road</b> leads in from the Internet. Inside, every device is a <b>house</b> with its own <b>private</b> house number. People driving past do <b>not</b> see which house is which.",
             fig(hood, "The router is the gatehouse. Outsiders see the neighborhood, not the individual houses."),
             warn("<b>But</b> the moment a device sends something <b>out</b>, it leaves the neighborhood and crosses networks you do not control. People along the way <b>could see it</b> unless it is <b>encrypted</b> (that is what HTTPS does).")),
        part(1, "Private and Public Addresses",
             "A <b>private</b> address only works <b>inside</b> your neighborhood. A <b>public</b> address is <b>unique on the whole Internet</b>.",
             tbl(["", "Private address", "Public address"], [
                 ["<b>Who can reach it</b>", "only devices on the same home or school network", "anyone on the Internet"],
                 ["<b>Where it comes from</b>", "your router (DHCP)", "your ISP"],
                 ["<b>How many your home has</b>", "one for each device", "usually <b>one</b> for the whole home (the router's)"],
                 ["<b>Can two homes use the same one?</b>", "<b>Yes.</b> House number 20 exists on many streets.", "<b>No.</b> It must be unique."],
             ])),
        part(2, "NAT: The Gatehouse",
             "<b>NAT</b> (<b>N</b>etwork <b>A</b>ddress <b>T</b>ranslation) lets a <b>whole home share one public address</b>. When a device sends something out, the router swaps its <b>private</b> address for the <b>public</b> one and <b>remembers who asked</b>. When the answer comes back, the router looks up who asked and delivers it to the <b>right house</b>.",
             nat_stepper,
             hint("The Internet only ever sees the <b>router</b>. This also helped slow the running-out of IPv4 addresses, because thousands of homes can reuse the same private numbers.")),
        part(3, "DHCP: The Moving Truck",
             "How does a new device get its house number? <b>DHCP</b> (Dynamic Host Configuration Protocol). When a device joins your Wi-Fi, the router <b>automatically assigns</b> it the next free <b>private</b> address, like a moving truck handing you the keys to the next empty house. You never type an address yourself.",
             dhcp,
             ex("<b>Lease:</b> the address is only <b>borrowed</b> for a while. When the lease ends or the device leaves, the address can go to someone else.")),
        part(4, "Putting It Together",
             "You now have every piece of the trip from your laptop to a website.",
             tbl(["Piece", "Its job", "Picture"], [
                 ["<b>Modem</b>", "brings the Internet in from the ISP", "the front door"],
                 ["<b>Router</b>", "shares the connection, runs DHCP and NAT", "the gatehouse"],
                 ["<b>DHCP</b>", "hands out private addresses", "the moving truck"],
                 ["<b>NAT</b>", "swaps private for public on the way out, and back on the way in", "the gatehouse translator"],
                 ["<b>Public address</b>", "the router's one address on the Internet", "the neighborhood's street address"],
             ]),
             quiz("qz3", [
                 ("What does NAT let a home do?", ["Make the Internet faster", "Share one public address among many devices", "Encrypt every message", "Hide the modem"], 1, "NAT swaps private addresses for the router's one public address, so many devices share it."),
                 ("What does DHCP do?", ["Translates names into addresses", "Automatically gives a joining device a private address", "Chops messages into packets", "Finds the fastest route"], 1, "DHCP <b>assigns</b> addresses. DNS (next lesson) is the one that translates names."),
                 ("Two different homes both have a laptop at <code>192.168.1.20</code>. Is that a problem?", ["Yes, addresses must be unique everywhere", "No, private addresses only work inside each network, so they can repeat", "Yes, the ISP will block them", "No, because both are public addresses"], 1, "Private addresses are <b>reused</b> by thousands of networks. Only <b>public</b> addresses must be unique."),
                 ("A server sends a reply to your home. Which address does it send the reply to?", ["The laptop's private address", "The router's public address", "The modem's serial number", "The DNS server"], 1, "The server never saw the private address. It replies to the router's <b>public</b> address, and NAT delivers it."),
             ])),
        exam([
            "A <b>router</b> connects a home network to the Internet and shares the connection.",
            "<b>Private</b> addresses work only inside a network and can be reused. A <b>public</b> address is unique on the Internet.",
            "<b>NAT</b> lets many private devices share one public address.",
            "<b>DHCP</b> automatically assigns a device a (temporary) private address.",
            "Data sent over a network you do not control can be seen unless it is <b>encrypted</b>.",
        ]),
    ]
    return mk("router-neighborhood", "Your Router Is a Neighborhood", "PRIVATE ADDRESSES, NAT, AND DHCP",
              "Every home network is a tiny <b>neighborhood</b>. Once you see it that way, <b>private addresses, public addresses, NAT, and DHCP</b> all make sense.",
              parts, "One road in, many houses inside.", "Next: people do not type numbers. They type names, and DNS turns the names into addresses.")


# =====================================================================================================  10.5 DNS
def dns():
    def tree(step):
        nodes = (sbox(10, 70, 130, 60, "Your device", "browser", "teal") + sbox(190, 70, 130, 60, "Resolver", "ISP or school", "yellow") +
                 sbox(400, 8, 150, 52, "Root server", "", "purple", "cp") + sbox(400, 74, 150, 52, "TLD server", "for .edu", "blue", "cp") + sbox(400, 140, 190, 52, "schs.edu name server", "", "pink", "cp"))
        rows = {0: (sarrow(142, 100, 188, 100, "teal") + stext(160, 60, "1", "teal", 15, weight=700) + stext(160, 168, "www.schs.edu?", "teal", 13)),
                1: (sarrow(322, 84, 398, 34, "yellow") + stext(360, 40, "2 where is .edu?", "yellow", 12, "end")),
                2: (sarrow(322, 100, 398, 100, "yellow") + stext(360, 90, "3 who runs schs.edu?", "yellow", 12, "end") + sarrow(398, 100, 322, 100, "blue", dash=True)),
                3: (sarrow(322, 116, 398, 160, "yellow") + stext(360, 150, "4 what is its IP?", "yellow", 12, "end") + stext(500, 208, "answer: 10.20.30.40", "pink", 14)),
                4: (sarrow(188, 108, 142, 108, "yellow") + stext(165, 128, "5 10.20.30.40", "yellow", 12) + stext(165, 150, "cached for next time", "gray", 12))}
        s = nodes + rows[step]
        return svg(620, 230, s, "DNS lookup step %d" % (step + 1))

    dns_step = stepper("stpdns", "Click through: looking up www.schs.edu",
                       [(tree(i), c) for i, c in enumerate([
                           "You type <code>www.schs.edu</code>. Your device asks its <b>resolver</b> (usually your ISP's or school's) for the IP address.",
                           "The resolver asks a <b>root server</b>. The root does not know the answer, but it knows who handles <code>.edu</code>.",
                           "The resolver asks the <b>.edu (TLD) server</b>. It does not know the IP either, but it knows which server handles <code>schs.edu</code>.",
                           "The resolver asks <b>schs.edu's own name server</b>. This one knows the real address: <code>10.20.30.40</code>.",
                           "The resolver gives the address back to your device and <b>remembers it</b> (a cache) for next time."])])

    splitter = widget("wgdom", "Try it: take apart a domain name",
                      "Read a domain name from <b>right to left</b>. The last label is the TLD, the one before it is the site you register, and anything further left is a subdomain.",
                      '<div class="row"><input type="text" value="www.schs.edu" style="width:26ch" spellcheck="false" maxlength="60"></div><div class="out"></div>',
                      r"""
var inp=root.querySelector("input"),out=root.querySelector(".out");
function upd(){var t=inp.value.trim().toLowerCase().replace(/^https?:\/\//,"").split("/")[0],L=t.split(".").filter(Boolean);
 if(L.length<2){out.innerHTML="<i>A domain name needs at least two labels, like schs.edu.</i>";return}
 var tld=L[L.length-1],site=L[L.length-2],sub=L.slice(0,-2);
 out.innerHTML=L.map(function(x,i){var role=i===L.length-1?"TLD":(i===L.length-2?"domain":"subdomain"),c=role==="TLD"?"#C084FC":(role==="domain"?"#FBBF24":"#34D399");return '<span class="seg" style="border-color:'+c+'"><span style="color:'+c+'">'+x+'</span></span>'+(i<L.length-1?'<b>.</b>':'')}).join("")+
 '<div style="margin-top:10px">TLD (top-level domain): <b style="color:#C084FC">.'+tld+'</b><br>Domain you register: <b style="color:#FBBF24">'+site+'.'+tld+'</b><br>Subdomain(s): <b style="color:#34D399">'+(sub.length?sub.join("."):"none")+'</b></div>';}
inp.addEventListener("input",upd);upd();
""")

    cache = widget("wgcache", "Try it: why a resolver keeps a cache",
                   "Look up the same site twice. The first time the resolver climbs the whole tree. The second time it answers from its memory.",
                   '<div class="row"><select><option>schs.edu</option><option>wikipedia.org</option><option>google.com</option></select> <button class="go">Look it up</button> <button class="clr">Clear the cache</button></div><div class="out"></div>',
                   r"""
var sel=root.querySelector("select"),out=root.querySelector(".out"),cache={},log=[];
var ips={"schs.edu":"10.20.30.40","wikipedia.org":"208.80.154.224","google.com":"142.250.80.46"};
root.querySelector(".go").onclick=function(){var d=sel.value,hit=!!cache[d];cache[d]=ips[d];log.unshift(hit?"<b>"+d+"</b> &rarr; "+ips[d]+" <span style='color:#A3E635'>cache hit, about 1 ms</span> (no servers asked)":"<b>"+d+"</b> &rarr; "+ips[d]+" <span style='color:#FBBF24'>cache miss, about 100 ms</span> (root, TLD, name server asked)");draw()};
root.querySelector(".clr").onclick=function(){cache={};log.unshift("<i>cache cleared</i>");draw()};
function draw(){out.innerHTML=log.slice(0,6).join("<br>")+'<div class="note">In the cache now: '+(Object.keys(cache).join(", ")||"nothing")+'. Each answer has a <b>TTL</b> (time to live) that says how long it may be kept, so changes still spread.</div>'}draw();
""")

    parts = [
        part(0, "The Internet's Phone Book",
             "Nobody types <code>142.250.80.46</code> to search the web. You type <code>google.com</code>. Something has to turn that <b>name</b> into the <b>number</b>. That is <b>DNS</b>, the <b>Domain Name System</b>.",
             ex("<b>Phone book:</b> you look up a <b>name</b> and get a <b>number</b>. DNS translates a <b>domain name</b> (google.com) into an <b>IP address</b> (142.250.80.46)."),
             "<p>Why bother? Names are easy to <b>remember</b>, and a site can <b>change its IP address</b> without anyone noticing, because DNS just updates the number next to the name.</p>"),
        part(1, "Anatomy of a Domain Name", "Read it from <b>right to left</b>.", splitter,
             tbl(["Piece", "In <code>www.schs.edu</code>", "What it is"], [
                 ["<b>TLD</b> (top-level domain)", "<code>edu</code>", "<code>com</code>, <code>edu</code>, <code>org</code>, or a country code like <code>uk</code>"],
                 ["<b>Domain</b>", "<code>schs.edu</code>", "the name an owner registers"],
                 ["<b>Subdomain</b>", "<code>www</code>", "anything the owner adds on the left (<code>mail</code>, <code>drive</code>)"],
                 ["<b>Label</b>", "<code>www</code>, <code>schs</code>, <code>edu</code>", "one piece between the dots"],
             ])),
        part(2, "The DNS Hierarchy",
             "There is <b>no single phone book</b> for the whole Internet. It would be too big, and one failure would break everything. Instead DNS is a <b>hierarchy</b> spread over thousands of servers. It is a <b>distributed</b> system.",
             tbl(["Level", "It knows", "Example"], [
                 ["<b>1. Root servers</b>", "which server handles each TLD", "\"For .edu, ask that server.\""],
                 ["<b>2. TLD servers</b>", "which server handles each domain", "\"For schs.edu, ask that one.\""],
                 ["<b>3. The domain's name server</b>", "the real IP address", "\"schs.edu is 10.20.30.40.\""],
             ]),
             dns_step),
        part(3, "Caching",
             "Climbing the whole tree for every web page would be slow. So the <b>resolver remembers</b> answers in a <b>cache</b>. The next time anyone asks for <code>schs.edu</code>, the answer comes back <b>instantly</b>.",
             cache,
             hint("A cache is a <b>saved copy</b> you check <b>before</b> doing the slow work. In Python it is a dictionary you look in first. You build one in the DNS walkthrough.")),
        part(4, "DNS and Security",
             "Every site visit starts with a DNS answer, so DNS is a target. In <b>DNS spoofing</b> (also called <b>cache poisoning</b>) an attacker sneaks a <b>fake</b> answer into a cache, so <code>yourbank.com</code> quietly points to the <b>attacker's</b> server and you land on a look-alike site.",
             two(box("Defenses", "<b>HTTPS</b> and its certificates (a fake site cannot prove it is the real one), <b>DNSSEC</b> (signed answers), and noticing warnings in your browser.", "ok"),
                 box("If DNS is down", "Names stop working, but typing the <b>IP address</b> directly still would. The roads are fine. The phone book is missing.", "bad")),
             quiz("qz4", [
                 ("What does DNS do?", ["Gives each device a private address", "Translates a domain name into an IP address", "Encrypts web pages", "Splits messages into packets"], 1, "DNS is the <b>phone book</b>: name in, IP address out."),
                 ("In <code>www.schs.edu</code>, which label is the TLD?", ["www", "schs", "edu", "schs.edu"], 2, "Read right to left. The last label, <code>edu</code>, is the <b>top-level domain</b>."),
                 ("Why does a resolver keep a cache?", ["So the Internet needs fewer cables", "So repeated lookups are answered quickly without asking the servers again", "So names never change", "So websites are encrypted"], 1, "A cache is a saved answer, so the slow climb through the hierarchy is skipped."),
                 ("Why is DNS a <b>hierarchy</b> of many servers rather than one big server?", ["One server could not hold every name, and one failure would break the whole Internet", "Names are random", "It is cheaper to buy small servers", "IPv6 requires it"], 0, "A <b>distributed</b> design scales and has <b>no single point of failure</b>."),
             ])),
        exam([
            "<b>DNS</b> translates <b>domain names</b> into <b>IP addresses</b>.",
            "DNS is a <b>hierarchy</b> (root, TLD, domain name server) spread over many servers, so it <b>scales</b> and is <b>fault tolerant</b>.",
            "A <b>cache</b> stores answers so the next lookup is faster. A <b>TTL</b> says how long an answer may be kept.",
            "<b>DNS spoofing</b> gives a fake address. <b>HTTPS certificates</b> help you notice.",
        ]),
    ]
    return mk("dns", "DNS: The Internet's Phone Book", "TURNING NAMES INTO NUMBERS",
              "People remember <b>names</b>, but computers need <b>numbers</b>. <b>DNS</b> is the Internet's phone book. Learn how a name travels down the DNS hierarchy and why answers get cached.",
              parts, "Names for people, numbers for machines.", "Next: once you have the address, how does a packet find its way there?")


# =====================================================================================================  10.6 ROUTING
def routing():
    graph = widget("wgroute", "Try it: break a router and watch the traffic reroute",
                   "Click a router to switch it <b>off</b> (a storm, a cut cable, a power outage). The packet finds a new path if one exists.",
                   '<svg class="net" viewBox="0 0 660 300" style="width:100%;max-width:660px;display:block;margin:0 auto;background:#0B0F16"></svg><div class="out"></div>',
                   r"""
var N={Laptop:[50,150],A:[170,150],B:[320,60],C:[320,240],D:[470,150],Server:[610,150]};
var E=[["Laptop","A"],["A","B"],["A","C"],["B","D"],["C","D"],["D","Server"],["B","Server"]];
var down={},svg=root.querySelector("svg"),out=root.querySelector(".out");
function adj(){var g={};Object.keys(N).forEach(function(k){g[k]=[]});E.forEach(function(e){if(down[e[0]]||down[e[1]])return;g[e[0]].push(e[1]);g[e[1]].push(e[0])});return g}
function bfs(){var g=adj(),q=[["Laptop"]],seen={Laptop:1};while(q.length){var p=q.shift(),last=p[p.length-1];if(last==="Server")return p;g[last].forEach(function(n){if(!seen[n]){seen[n]=1;q.push(p.concat(n))}})}return null}
function draw(){var path=bfs(),on={};if(path)for(var i=0;i<path.length-1;i++)on[path[i]+"-"+path[i+1]]=on[path[i+1]+"-"+path[i]]=1;
 var s="";E.forEach(function(e){var a=N[e[0]],b=N[e[1]],dead=down[e[0]]||down[e[1]],hot=on[e[0]+"-"+e[1]];s+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(hot?"#A3E635":(dead?"#3A2020":"#2B3647"))+'" stroke-width="'+(hot?5:3)+'" '+(dead?'stroke-dasharray="4 5"':'')+'/>'});
 Object.keys(N).forEach(function(k){var p=N[k],end=k==="Laptop"||k==="Server",isDown=down[k],inp=path&&path.indexOf(k)>-1;
  s+='<g data-k="'+k+'" style="cursor:'+(end?"default":"pointer")+'"><circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(end?30:24)+'" fill="'+(isDown?"#2A1414":"#151A24")+'" stroke="'+(isDown?"#F87171":(inp?"#A3E635":(end?"#60A5FA":"#8B9AAE")))+'" stroke-width="3"/><text x="'+p[0]+'" y="'+(p[1]+5)+'" text-anchor="middle" fill="'+(isDown?"#F87171":"#EAEFF6")+'" style="font:700 '+(end?12:15)+'px JetBrains Mono,monospace">'+(isDown?"X":(end?k:k))+'</text></g>'});
 svg.innerHTML=s;
 if(!path){var cut=Object.keys(down).filter(function(k){return down[k]});out.innerHTML='<b style="color:#F87171">No route!</b> With '+cut.join(" and ")+' off, the Laptop cannot reach the Server.'+(cut.length===1?' That router was a <b>single point of failure</b>.':'')}
 else out.innerHTML='Path: <b>'+path.join(" &rarr; ")+'</b><br>Hops (links): <b>'+(path.length-1)+'</b>'+(Object.keys(down).some(function(k){return down[k]})?'. The network <b>rerouted</b> around the damage.':'. This is the shortest path.')}
svg.addEventListener("click",function(e){var g=e.target.closest("g[data-k]");if(!g)return;var k=g.dataset.k;if(k==="Laptop"||k==="Server")return;down[k]=!down[k];draw()});draw();
""")

    parts = [
        part(0, "Routers and Hops",
             "A packet leaves your laptop and has to reach a server on the other side of the planet. Nobody hands it a map. A <b>router</b> is a device that <b>forwards packets</b> toward their destination. It reads the destination address and passes the packet to the <b>next</b> router that is closer. Each handoff is called a <b>hop</b>.",
             "<p>The <b>path</b> a packet takes is the list of devices it travels through. <b>No single router knows the whole path.</b> Every router just makes a good choice for the <b>next hop</b>, like asking for directions at every intersection.</p>",
             ex("<b>Example:</b> Laptop &rarr; A &rarr; B &rarr; Server is a path with <b>3 hops</b> (three links).")),
        part(1, "A Network Is a Graph",
             "Computer scientists draw a network as a <b>graph</b>: <b>nodes</b> (the devices) and <b>links</b> (the cables or wireless connections). Two nodes joined by a link are <b>neighbors</b>.",
             tbl(["Graph word", "Network meaning"], [["<b>Node</b>", "a device: laptop, router, server"], ["<b>Link</b> (edge)", "a cable or wireless connection"], ["<b>Neighbors</b>", "two nodes joined directly by a link"], ["<b>Path</b>", "a chain of links from one node to another"]]),
             "<p>In Python a graph is often stored as a <b>dictionary</b>: each device name points to the <b>list</b> of devices it connects to. You build this in the routing walkthrough.</p>"),
        part(2, "Finding a Path",
             "How does a computer find a route? One classic idea is <b>breadth-first search</b>: start at the source and explore <b>all its neighbors</b>, then <b>their</b> neighbors, ring by ring, like ripples in a pond. The <b>first</b> time you reach the destination, you have a route with the <b>fewest hops</b>.",
             "<p>The trick is a <b>queue</b> of paths (add at the end, take from the front) and a list of places you have already <b>seen</b>, so you never go in circles.</p>",
             graph),
        part(3, "Redundancy and Fault Tolerance",
             "The Internet has <b>many paths</b> between any two points. That is called <b>redundancy</b>. If a router or cable <b>fails</b>, packets are <b>rerouted</b> along a different path. A system that keeps working after a part fails is <b>fault tolerant</b>. It has <b>no single point of failure</b>.",
             two(box("Why it matters", "Storms, cut fiber, and power outages happen all the time. Because of redundancy, most people never notice.", "ok"),
                 box("The cost", "More redundancy means more cables and routers to buy. A network with <b>one</b> path is cheap but fragile.", "bad")),
             hint("In the graph above, switch off <b>A</b>. The laptop has only <b>one</b> link, so A is a <b>single point of failure</b>. Then switch off <b>B</b> instead: traffic reroutes through C and D.")),
        part(4, "Hops, Delay, and traceroute",
             "Every hop adds a little <b>delay</b> (<b>latency</b>) because a router has to read the packet and decide. Usually <b>fewer hops means a faster trip</b>, though a busy router or a slow link can matter too.",
             "<p>The <b>traceroute</b> tool lists every router between you and a website, in order. Each line is one hop:</p>",
             tbl(["Hop", "Router", "Time"], [["1", "home router (192.168.1.1)", "2 ms"], ["2", "ISP edge router", "9 ms"], ["3", "regional backbone router", "17 ms"], ["4", "cloud provider router", "24 ms"], ["5", "the web server", "26 ms"]]),
             quiz("qz5", [
                 ("What is one step of a packet from one router to the next called?", ["A hop", "A byte", "A cache", "A lease"], 0, "Each handoff from one device to the next is a <b>hop</b>."),
                 ("Devices A, B, C, and D are linked A-B, A-C, B-D, and C-D. How many different paths (without going back) lead from A to D?", ["1", "2", "3", "4"], 1, "A-B-D and A-C-D. Two paths means that if one link fails, the other still works."),
                 ("What do you call a network that keeps working when one part fails?", ["Encrypted", "Fault tolerant", "Compressed", "Private"], 1, "<b>Fault tolerant</b> systems have redundancy: more than one path."),
                 ("A network has exactly one router that connects the school to the rest of the Internet. What is true about that router?", ["It is a single point of failure", "It makes the network more redundant", "It is a DNS server", "It cannot fail"], 0, "If it fails, there is <b>no other path</b>. Adding a second connection removes the single point of failure."),
             ])),
        exam([
            "A <b>router</b> forwards packets toward their destination, one <b>hop</b> at a time. No router knows the whole path.",
            "A <b>path</b> is a sequence of connected devices. There can be <b>many paths</b> between two points.",
            "<b>Redundancy</b> (extra paths) makes the Internet <b>fault tolerant</b>.",
            "Be ready to <b>count paths and hops</b> in a diagram, and to say what happens when one device fails.",
        ]),
    ]
    return mk("routing", "Routing and Fault Tolerance", "HOW PACKETS FIND THEIR WAY",
              "A packet has to cross the planet in a fraction of a second, and nobody gives it a map. Learn how <b>routers</b> pass it along hop by hop, and why the Internet keeps working when parts of it break.",
              parts, "Many paths, no single point of failure.", "Next: what is actually inside the thing that travels? Packets.")


# =====================================================================================================  10.7 PACKETS
def packets_protocols():
    env = svg(710, 190,
              '<rect x="20" y="20" width="670" height="150" rx="12" fill="#151A24" stroke="#FBBF24" stroke-width="2.4"/>' +
              stext(110, 48, "HEADER (the outside of the envelope)", "yellow", 13, weight=700) +
              sbox(40, 62, 150, 50, "Source", "192.168.1.20", "teal", "cp") + sbox(204, 62, 150, 50, "Destination", "93.184.216.34", "blue", "cp") +
              sbox(368, 62, 150, 50, "Packet number", "2 of 3", "purple", "cp") + sbox(532, 62, 140, 50, "Protocol", "TCP", "orange", "cp") +
              stext(110, 138, "PAYLOAD (the piece of your message inside)", "green", 13, weight=700) + sbox(40, 120, 632, 40, "\"O WOR\"", "", "green", "cp"),
              "a packet with a header and a payload")

    lab = widget("wgpk", "Try it: send a message as packets",
                 "Type a message and choose how big each packet is. Then send it. Packets can arrive <b>out of order</b>, and one might get <b>lost</b>.",
                 '<div class="row"><input type="text" value="HELLO WORLD" style="width:22ch" maxlength="30" spellcheck="false"> <select><option value="3">3 letters per packet</option><option value="4" selected>4 letters per packet</option><option value="5">5 letters per packet</option></select> <label><input type="checkbox"> lose a packet</label> <button class="send">Send</button></div><div class="out"></div>',
                 r"""
var inp=root.querySelector("input[type=text]"),sel=root.querySelector("select"),lose=root.querySelector("input[type=checkbox]"),out=root.querySelector(".out"),state=null;
function pk(p){return '<span class="seg"><span style="color:#C084FC">#'+p.seq+' of '+p.total+'</span> <span style="color:#A3E635">'+(p.data.replace(/ /g,"&middot;"))+'</span></span>'}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function show(){var s=state,h='<div>1. The message is chopped into <b>'+s.packets.length+' packets</b>:</div>'+s.packets.map(pk).join("");
 h+='<div style="margin-top:8px">2. They take different routes and <b>arrive</b> in this order:</div>'+s.arrived.map(pk).join("");
 var got=s.arrived.map(function(p){return p.seq}),missing=s.packets.filter(function(p){return got.indexOf(p.seq)<0});
 if(missing.length){h+='<div style="margin-top:8px;color:#F87171"><b>Packet #'+missing[0].seq+' never arrived.</b> The receiver notices a gap in the sequence numbers.</div><div class="row"><button class="resend">TCP: ask the sender to resend #'+missing[0].seq+'</button></div>'}
 else{var sorted=s.arrived.slice().sort(function(a,b){return a.seq-b.seq});h+='<div style="margin-top:8px">3. The receiver uses the <b>sequence numbers</b> to put them in order:</div>'+sorted.map(pk).join("")+'<div class="out" style="margin-top:8px">Message: <b>'+sorted.map(function(p){return p.data}).join("")+'</b></div>'}
 out.innerHTML=h;var r=out.querySelector(".resend");if(r)r.onclick=function(){var m=missing[0];s.arrived.push(m);show()}}
root.querySelector(".send").onclick=function(){var m=inp.value||"HI",n=Number(sel.value),parts=[];for(var i=0;i<m.length;i+=n)parts.push(m.slice(i,i+n));
 var packets=parts.map(function(d,i){return{seq:i+1,total:parts.length,data:d}}),arr=shuffle(packets);if(lose.checked&&arr.length>1)arr.splice(Math.floor(Math.random()*arr.length),1);state={packets:packets,arrived:arr};show()};
""")

    parts = [
        part(0, "Why Packets?",
             "The Internet breaks every message into small chunks called <b>packets</b>. A photo you send to a friend is chopped up, sent in different directions, and put back together at the other end.",
             cards([("1", "Sharing", "Many people can <b>share</b> the same cables, because their packets take turns."),
                    ("2", "Resending", "If one piece is <b>lost</b>, only that piece is resent, not the whole file."),
                    ("3", "Detours", "Packets can travel by <b>different routes</b> around problems.")])),
        part(1, "Headers and Payloads",
             "A packet is more than a piece of data. It is like an <b>envelope</b>. The <b>payload</b> is the piece of your message inside. The <b>header</b> is the information written on the outside: the <b>source</b> and <b>destination</b> addresses and a <b>sequence number</b> (\"packet 2 of 3\") so the receiver can put things back in order.",
             fig(env, "The header tells the network where to send it and in what order. The payload is part of your message.")),
        part(2, "Packet Switching and Reassembly",
             "Packets from the same message can take <b>different routes</b> and arrive <b>out of order</b>. This is called <b>packet switching</b>. The receiver uses the <b>sequence numbers</b> to <b>reassemble</b> the message correctly.",
             lab),
        part(3, "TCP and UDP",
             "Sometimes a packet is <b>lost</b> because a busy router drops it. Different <b>protocols</b> handle that differently.",
             tbl(["", "TCP (Transmission Control Protocol)", "UDP (User Datagram Protocol)"], [
                 ["<b>Reliable?</b>", "<b>Yes.</b> The receiver acknowledges what arrived and the sender <b>resends</b> anything missing.", "<b>No.</b> It sends and does not check."],
                 ["<b>Speed</b>", "a little slower (the checking takes time)", "faster, less delay"],
                 ["<b>Good for</b>", "web pages, email, file downloads (everything must arrive)", "live video, voice calls, online games (a late packet is useless anyway)"],
             ])),
        part(4, "Protocols and Open Standards",
             "A <b>protocol</b> is a set of <b>agreed rules</b> that lets different devices communicate. Your phone, a school server, and a game console are made by different companies, but they all follow the same rules.",
             tbl(["Protocol", "Its job"], [
                 ["<b>IP</b>", "addresses and routing: gets each packet toward its destination"],
                 ["<b>TCP</b> / <b>UDP</b>", "how packets are delivered (reliable, or fast)"],
                 ["<b>HTTP</b> / <b>HTTPS</b>", "web pages (HTTPS is the encrypted version)"],
                 ["<b>SMTP</b>", "email"],
                 ["<b>DNS</b>", "turning names into IP addresses"],
                 ["<b>DHCP</b>", "giving devices an address when they join a network"],
             ]),
             callout("Internet protocols are <b>open standards</b>: published for anyone to use.", "That is why the Internet <b>scales</b> (grows without breaking): a new device or network only has to follow the rules.")),
        part(5, "Where the Web Fits",
             "The <b>Web</b> is built on top of all of this. When you open a page, your browser sends an <b>HTTP request</b> (\"give me this page\") inside TCP packets, and the server sends back an <b>HTTP response</b> (the page).",
             tbl(["Part of <code>https://www.schs.edu/news</code>", "Meaning"], [["<code>https</code>", "the protocol (encrypted HTTP)"], ["<code>www.schs.edu</code>", "the domain name (DNS turns it into an IP address)"], ["<code>/news</code>", "which page on that server"]]),
             quiz("qz6", [
                 ("What does the sequence number in a packet's header help the receiver do?", ["Find the sender's password", "Put the packets back in the correct order", "Encrypt the message", "Find the fastest router"], 1, "Packets can arrive out of order, so the receiver sorts them by sequence number."),
                 ("Which protocol <b>resends</b> lost packets?", ["TCP", "UDP", "DNS", "DHCP"], 0, "TCP is <b>reliable</b>: it acknowledges packets and resends missing ones."),
                 ("A game sends your position 60 times every second. Which is the better choice, and why?", ["TCP, because every old position must be resent", "UDP, because a late or lost position is out of date anyway and speed matters more", "DNS, because it uses names", "Neither works for games"], 1, "For live data, <b>speed beats perfection</b>. UDP does not wait for resends."),
                 ("Why do Internet protocols being <b>open standards</b> help the Internet grow?", ["Anyone can build devices that follow them, so new devices work with everything else", "They keep the protocols secret", "They make every device use the same company's router", "They remove the need for IP addresses"], 0, "Open standards let the Internet <b>scale</b>. A new device just follows the published rules."),
                 ("Why is a message split into packets?", ["So many people can share the same links, and only lost pieces need resending", "Because messages must be encrypted", "Because routers cannot read big messages", "Because packets are always faster than one big block"], 0, "Sharing, resending only what was lost, and using different routes are the three big reasons."),
             ])),
        exam([
            "Data is sent as <b>packets</b>. Each has a <b>header</b> (addresses, sequence number) and a <b>payload</b> (part of the data).",
            "Packets can take <b>different routes</b> and arrive <b>out of order</b>. The receiver <b>reassembles</b> them.",
            "<b>TCP</b> is reliable and resends. <b>UDP</b> is faster but does not check.",
            "A <b>protocol</b> is an agreed set of rules. Open standards let the Internet <b>scale</b>.",
            "<b>HTTP/HTTPS</b> is the protocol of the Web. The Web runs on the Internet, not the other way around.",
        ]),
    ]
    return mk("packets-protocols", "Packets and Protocols", "HOW DATA REALLY TRAVELS",
              "When you send a photo to a friend, it does not travel as one block. It is <b>chopped into packets</b>, sent by different routes, and <b>put back together</b>. Learn why, and why <b>protocols</b> keep the whole thing working.",
              parts, "Small pieces, shared roads, agreed rules.", "Next: what if one computer is not enough? Parallel and distributed computing.")


# =====================================================================================================  10.8 PARALLEL
def parallel_distributed():
    sched = widget("wgpar", "Try it: share the work between processors",
                   "Each number is how many seconds a task takes. Choose how many processors you have. Each task goes to the processor that frees up first.",
                   '<div class="row"><label>Tasks (seconds): <input type="text" value="40, 30, 60, 50, 20" style="width:24ch" spellcheck="false"></label> <label>Processors: <select><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option></select></label></div><div class="gantt"></div><div class="out"></div>',
                   r"""
var inp=root.querySelector("input"),sel=root.querySelector("select"),g=root.querySelector(".gantt"),out=root.querySelector(".out");
var cols=["#34D399","#60A5FA","#FBBF24","#F472B6","#C084FC","#FB923C"];
function upd(){var t=inp.value.split(/[ ,]+/).map(Number).filter(function(x){return x>0&&x<=999}).slice(0,8),n=Number(sel.value);if(!t.length){g.innerHTML="";out.innerHTML="<i>Type some task times, like 40, 30, 60.</i>";return}
 var free=[],rows=[];for(var i=0;i<n;i++){free.push(0);rows.push([])}
 t.forEach(function(d,k){var m=0;for(var i=1;i<n;i++)if(free[i]<free[m])m=i;rows[m].push({d:d,s:free[m],k:k});free[m]+=d});
 var seq=t.reduce(function(a,b){return a+b},0),par=Math.max.apply(null,free),sc=380/par;
 g.innerHTML=rows.map(function(r,i){return '<div style="display:flex;align-items:center;margin:4px 0"><span class="mono" style="width:52px;font-size:13px;color:#8B9AAE">CPU '+(i+1)+'</span><div style="position:relative;height:30px;width:380px;background:#1B2330;border-radius:6px">'+r.map(function(x){return '<div title="task '+(x.k+1)+'" style="position:absolute;left:'+x.s*sc+'px;width:'+Math.max(2,x.d*sc-2)+'px;height:30px;background:'+cols[x.k%6]+';color:#0B0E14;border-radius:5px;font:700 12px JetBrains Mono,monospace;display:flex;align-items:center;justify-content:center">'+x.d+'</div>'}).join("")+'</div></div>'}).join("");
 out.innerHTML='Sequential time (one after another): <b>'+seq+' s</b><br>Parallel time with '+n+' processor'+(n>1?"s":"")+': <b>'+par+' s</b><br>Speedup = '+seq+' &divide; '+par+' = <b>'+(seq/par).toFixed(2)+'</b>'+(n>1&&par===Math.max.apply(null,t)?'<br><i>The longest single task ('+par+' s) now limits the time, so more processors will not help.</i>':'');}
root.addEventListener("input",upd);root.addEventListener("change",upd);upd();
""")

    parts = [
        part(0, "Sequential and Parallel",
             "A normal program runs <b>sequentially</b>: one instruction after another, in order. <b>Parallel computing</b> splits a job into parts and runs <b>several parts at the same time</b>, each on its own processor. A <b>distributed</b> system does it with <b>many separate computers</b> connected by a network.",
             tbl(["", "Sequential", "Parallel", "Distributed"], [
                 ["<b>How it runs</b>", "one step at a time", "parts at the same time on several processors", "parts on many different computers over a network"],
                 ["<b>Time</b>", "the <b>sum</b> of all the tasks", "set by the <b>longest</b> chain of tasks", "like parallel, plus time to move data around"],
                 ["<b>Example</b>", "making breakfast alone, one dish at a time", "two cooks in one kitchen", "a restaurant chain cooking in many kitchens"],
             ])),
        part(1, "Speedup",
             "<b>Speedup</b> measures how much faster the parallel version is: <b>sequential time &divide; parallel time</b>.",
             ex("<b>Example:</b> A job takes 120 seconds sequentially and 40 seconds in parallel. Speedup = 120 &divide; 40 = <b>3</b>. It runs three times as fast."),
             sched,
             hint("Try <b>40, 30, 60, 50, 20</b> with 1, 2, 3, then 5 processors. At some point adding processors stops helping. The <b>longest task</b> sets the minimum time.")),
        part(2, "What Limits Parallel Computing?",
             "Splitting the work does not always make it faster.",
             cards([("1", "Tasks that must wait", "If task B needs the <b>result</b> of task A, B cannot start until A is done. Those tasks stay <b>sequential</b>."),
                    ("2", "The longest path", "The whole job takes at least as long as the <b>longest chain</b> of tasks that depend on each other."),
                    ("3", "Overhead", "Splitting the work, moving data, and combining the results all take time. Too many tiny pieces can be <b>slower</b>.")]),
             ex("<b>Worked example:</b> Task A takes 30 s and task B takes 30 s, and they are independent. Task C takes 20 s and needs <b>both</b> A and B. Sequentially: 30 + 30 + 20 = <b>80 s</b>. With 2 processors, A and B run together (30 s), then C (20 s): <b>50 s</b>. Speedup = 80 &divide; 50 = <b>1.6</b>.")),
        part(3, "Distributed Computing",
             "A <b>distributed computing</b> system uses <b>multiple devices</b>, often far apart, to solve one problem. Projects like Folding@home ask volunteers to donate spare computer time to study proteins. Companies do the same with huge data centers.",
             two(box("Benefits", "Can solve problems <b>too big</b> for one computer. Uses many cheap machines. If one machine fails, the others keep going (fault tolerance).", "ok"),
                 box("Challenges", "Computers must <b>coordinate</b> over a network, which is slower than one computer's memory. Results must be combined. Security and trust matter.", "bad")),
             quiz("qz7", [
                 ("A job takes 100 seconds on one processor and 40 seconds when run in parallel. What is the speedup?", ["0.4", "2.5", "4", "60"], 1, "Speedup = sequential &divide; parallel = 100 &divide; 40 = <b>2.5</b>."),
                 ("Tasks of 20 s and 30 s are independent. How long do they take on two processors?", ["50 seconds", "30 seconds", "25 seconds", "10 seconds"], 1, "Both run at the same time, so the time is set by the <b>longer</b> task: 30 seconds. (Sequentially it would be 50.)"),
                 ("Which is <b>most likely</b> to prevent a program from being sped up much by parallel computing?", ["It has many independent tasks", "Most of its tasks need the result of the previous task", "It runs on a fast computer", "It uses a loop"], 1, "Tasks that must wait for each other must run in order, which means a <b>long sequential path</b>."),
                 ("Which is an example of distributed computing?", ["One laptop running two programs", "Thousands of volunteers' computers each analyzing part of a data set over the Internet", "A single processor with a faster clock", "A program with a for loop"], 1, "Distributed computing spreads one problem across <b>many computers</b> connected by a network."),
             ])),
        exam([
            "<b>Sequential</b> runs one step at a time. <b>Parallel</b> runs parts at the same time. <b>Distributed</b> uses many computers.",
            "<b>Speedup = sequential time &divide; parallel time.</b>",
            "The parallel time is set by the <b>longest chain</b> of tasks that depend on each other.",
            "Parallel and distributed computing can solve bigger problems faster, but <b>not every program</b> can be sped up, and there is <b>overhead</b>.",
            "Distributed systems can keep working if one part fails (<b>fault tolerance</b>).",
        ]),
    ]
    return mk("parallel-distributed", "Parallel and Distributed Computing", "SHARING THE WORK",
              "One computer can only do so much. Learn what <b>sequential</b>, <b>parallel</b>, and <b>distributed</b> mean, how to calculate <b>speedup</b>, and why some jobs cannot be sped up at all.",
              parts, "Share the work, but mind the longest path.", "That is every idea in Unit 10. Next, how the Internet changes the world around it.")


PAGES = {
    "internet-highway": internet_highway,
    "internet-addresses": internet_addresses,
    "router-neighborhood": router_neighborhood,
    "dns": dns,
    "routing": routing,
    "packets-protocols": packets_protocols,
    "parallel-distributed": parallel_distributed,
}

INDEX_INTRO = ('<p>Everything in this unit is about <b>how the Internet works</b>: the highway, addresses, the router at home, DNS, routing, packets, and sharing the work between computers. Read the notes first, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>.</p>'
               '<a class="resource-link" href="../../python/editor.html" target="_blank" rel="noopener">&#128187; Open the Python Editor</a>'
               '<p style="font-size:14px;opacity:.8">Each lesson has the <b>notes</b> (with things to try), a <b>walkthrough</b> in the editor, and for most lessons a bonus <b>game</b>.')
INDEX_LESSONS = [(SUBS[f][0], f, "&#128214; Notes &nbsp;+&nbsp; &#128187; Walkthrough &nbsp;+&nbsp; check-yourself questions") for f, _ in LESSONS]


def _index():
    return unit_index(UNIT_LABEL, 10, INDEX_INTRO, INDEX_LESSONS)


INDEXES = {"unit-10": _index}
