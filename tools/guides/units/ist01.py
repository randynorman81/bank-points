"""IST Unit 1 (Digital Footprint and Cybersecurity) study guide: one chapter per lesson 1.1 - 1.9."""
import os, re, json
from ist_lib import *
import ist_lib
from units.ist01_a import C11, C12, C13
from units.ist01_b import C14, C15, C16
from units.ist01_c import C17, C18, C19
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))

BRAND = dict(kicker="INTRO TO SOFTWARE TECHNOLOGY  ·  STUDY GUIDE", doctitle="IST", series="Intro to Software Technology Study Guide Series", site="schscomputerscience.com/ist",
             legal="Spotify, Zillow, Discord, Apple, Netflix, Instagram, YouTube, Google and Ticketmaster are trademarks of their owners, who were not involved in this guide and do not endorse it. They are used only to give realistic examples; the jobs and incidents described for them are made up for practice. All other names are the property of their owners.",
             trace_legend="Follow an incident one step at a time and name the pillar, the attack or the rule at each step. Cover the right-hand columns, answer first, then check.",
             glance_legend="where the matching notes, walkthrough, assignment, and quiz game are on the site")

# ---- the lesson's walkthrough roadmap and assignment brief come from the real lab data (ist/lab/data.js), so the guide and the site never disagree
def _labdata():
    s = open(os.path.join(ROOT, "ist", "lab", "data.js"), encoding="utf-8").read()
    return json.loads(s[s.index("{"): s.rindex("}") + 1])["lessons"]
def _plain(h): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", h)).strip()
CHECK = {
 "1.1": ["Say the three pillars and the question each one asks", "Name the pillar that failed in a real incident, and say why", "Give an everyday example of each pillar", "Explain why ransomware and a DDoS are availability failures", "Explain a tradeoff between two pillars, such as the hospital records", "Decide by what happened to the information, not by who did it"],
 "1.2": ["Define OSINT and say why it is not hacking", "Name the five main sources of open information", "Say who uses OSINT for good and who uses it for harm", "Explain how five harmless posts add up to a profile", "Say which pillar OSINT strains and how", "Describe the difference between a police blotter, a registry and a data aggregator", "Make a plan to clean up my own footprint"],
 "1.3": ["Say what the 4th Amendment protects", "Say what police may and may not do in questioning in Georgia", "Explain why lying about facts is allowed but promises and threats are not", "Match the arenas (school, traffic stop, door, online, station) with their rules", "Say the exact words to invoke my rights, and why I then stop talking", "Explain how rights can be un-invoked"],
 "1.4": ["Name the three categories of phone data: location, habits and hidden data", "Tell the BTK, Kohberger and Golden State Killer cases and the data that mattered in each", "Explain why a phone that is off is not invisible", "Say how metadata, EXIF, printer dots and wearables give people away", "Explain how a digital trail can also clear an innocent person", "Audit my own phone with the five questions"],
 "1.5": ["Define entropy and say why length from randomness beats clever symbols", "Name the seven attacks and say how each one works", "Name the three defenses and what each one stops", "Explain why a keylogger beats any password", "Use the password lab to compare a random password and a passphrase", "Explain why layered defenses beat one clever trick"],
 "1.6": ["Name the three layers of tracking: hardware, software and the market", "Say what each of the five sensors is for and what it can be used for", "Explain how an ad auction sends my data to companies that lose", "Explain the warrant loophole in order", "List the settings that cut tracking, and what each one does", "Explain what Incognito does and does not hide"],
 "1.7": ["Say what copyright covers and what it does not", "Name the five exclusive rights of an owner", "Run the four-factor fair use test on a real post", "Tell public domain from Creative Commons and name the four CC licenses", "Explain why plagiarism and copyright are different problems", "Say what happens when you get it wrong"],
 "1.8": ["Say what makes the same skill a job or a crime", "Explain the levels of killing and theft and why categories change consequences", "Tell white, grey and black hats apart by one question", "Color a scenario green, amber or red", "Explain why good intentions do not make unauthorized access legal", "Say what a hacker with good intentions should do instead"],
 "1.9": ["Name the four locks: HTTPS, CAPTCHA, 2FA and OWASP", "Explain what the padlock proves and does not prove", "Name five kinds of CAPTCHA and what bots they stop", "Name the three factors and rank five kinds of 2FA", "Explain broken access control and injection", "Inspect a site and say which lock is missing, working or under attack"],
}
def _more(cid):
    def build(ctx):
        L = _labdata()[cid]; out = ""
        rows = []
        for i, s in enumerate(L["w"]["steps"], 1):
            rows.append(["%d" % i, _plain(s["h"]), _plain(s.get("read", "")), "%d" % len(s["items"])])
        out += sec("The walkthrough: what to do at each step", '<p class="lede">The walkthrough on the site makes you go through the notes. This table is the same route on paper: read the part, then be able to answer the questions about it. The site asks <b>%d questions</b> and you need 100%% to open the assignment.</p>%s' % (sum(len(s["items"]) for s in L["w"]["steps"]), tbl(["Step", "Part", "What to read and do", "Questions"], rows)), tag="WALKTHROUGH")
        a = L["a"]
        out += sec("The assignment: %s" % a["company"], '<p class="lede">%s</p>%s' % (_plain(a["tagline"]), tbl(["Task", "What you do"], [["%d" % i, _plain(s["h"]) + ": " + _plain(s.get("read", ""))] for i, s in enumerate(a["steps"], 1)])) + '<p class="lede">The assignment is worth %d points. It is a made-up job at a real company; nothing in it is a fact about the company.</p>' % a["pts"], tag="ASSIGNMENT")
        out += sec("I can...", chk(CHECK[cid]), tag="CHECKLIST")
        return out
    return build
CHS = [C11, C12, C13, C14, C15, C16, C17, C18, C19]
_seen = set(); CHS = [c for c in CHS if not (c['id'] in _seen or _seen.add(c['id']))]
if os.environ.get('IST1_ONLY'): CHS = [c for c in CHS if c['id'] in os.environ['IST1_ONLY'].split(',')]
for _c in CHS: _c["more"] = _more(_c["id"]); _c["noonline"] = True; _c["trace_intro"] = "Follow each incident one step at a time. Cover the right-hand columns, say what is happening and which pillar, attack or rule it shows, then check your answer."
UNIT = Unit(1, "Digital Footprint and Cybersecurity", "What your data says about you, who can see it, and how real investigators and real attackers use it. The CIA triad, OSINT, your rights, phones, passwords, tracking, copyright, hacking ethics and the four locks on every website.",
    "Unit 1: Digital Footprint", "#0F766E", "#0F766E", "#5EEAD4", "#CCFBF1", "network",
    ["Name which pillar of the CIA triad failed in a real incident", "Explain how open information adds up to a profile of a person", "Say what police may and may not do, and how to invoke your rights", "Explain how phones, files and wearables give people away, using real cases", "Compare password attacks and defenses and choose strong ones", "Explain how apps, sensors and data brokers track you", "Apply fair use, public domain and Creative Commons to real posts", "Tell authorized, grey area and unauthorized access apart", "Inspect a website for HTTPS, CAPTCHA, 2FA and OWASP problems"],
    CHS, glossary=[], brand=BRAND, seed=23)
