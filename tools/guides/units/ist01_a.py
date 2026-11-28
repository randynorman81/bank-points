from ist_lib import *
from units.ist01_q import QS

# =============================================================================== 1.1
C11 = L("1.1", "Tell confidentiality, integrity and availability apart, and name which one failed in any situation you read about.",
  [("cybersecurity", "protecting information and the systems that hold it from people who should not have access, and keeping both working"), ("CIA triad", "three goals of security: confidentiality, integrity and availability"), ("confidentiality", "only the right people can see the information"), ("integrity", "the information is accurate and has not been changed by someone who should not touch it"),
   ("availability", "the information and the system are there and working when you need them"), ("breach", "an event where protected information is seen or taken by someone who should not have it"), ("ransomware", "malware that locks your files until you pay"), ("DDoS", "a flood of fake traffic that makes a website unreachable"), ("tradeoff", "gaining one good thing by giving up some of another")],
  [("You already do cybersecurity", """You lock your phone. You check your bank balance. You get annoyed when the school Wi-Fi drops before a deadline. Every one of those moments is really about one of three things, and security people call them the **CIA triad** (the CIA here has nothing to do with the spy agency). The three letters stand for three questions you can ask about any piece of information.

| Pillar | The question | An analogy |
| **C**onfidentiality | Is it secret? | A diary with a lock, or a sealed letter |
| **I**ntegrity | Is it accurate? | The safety seal on a food container |
| **A**vailability | Is it there when I need it? | The power and water at your house |

!key: Every security decision, from picking a stronger password to backing up your files, protects at least one of the three pillars. When you can name the pillar, you can reason about the tradeoff instead of just feeling that something online is unsafe."""),
   ("Confidentiality: only the right people", """**Confidentiality** means making sure only the right people can see your information. It is about **privacy**. You are the one who decides who counts as the right people.

| Control | How it protects confidentiality |
| Phone passcode or Face ID | Locks out parents, friends and strangers from your texts and photos |
| Private Instagram or TikTok account | Only approved followers see your posts |
| School portal login | Keeps your grades away from every other student |
| Disappearing Snapchat photo | Built to be seen once, by one person: confidentiality with an expiration date |
| Incognito (private) browsing | Hides your search history from the next person who uses the same shared device, and nobody else |
| Two-factor authentication (2FA) | A text code that stops someone from logging in with only your stolen password |
| Encrypted messaging (iMessage, Signal) | Scrambles a message so only the right device can read it |

Confidentiality is not only digital. What you tell a school counselor is protected by the same idea in a conversation instead of a login.

!warn: **When it fails:** a hacker guesses your password and reads your DMs, or a friend grabs your unlocked phone and screenshots a private chat. The notes name the second one as the fastest way confidentiality really breaks for a teenager: not a hacker, just a phone left unlocked in the wrong hands."""),
   ("Integrity: accurate and untouched", """**Integrity** means your data is accurate and nobody who should not touch it has changed it. It is about **trust**. It is the pillar people think about least, until it breaks.

| Example | Why it is an integrity question |
| Your grade in the school portal | It must match exactly what your teacher entered |
| Google Docs version history | Catches someone quietly deleting or rewriting a teammate's paragraph |
| A screenshot used as proof | The image itself can be edited before it is sent |
| A verified checkmark | Helps confirm the account really belongs to who it claims |
| Wikipedia edits | Anyone can change a page, which is why teachers tell you to check sources |
| A text thread forwarded without the rest | Even without editing one word, leaving out context changes what someone really said |
| Autocorrect | A harmless, accidental integrity problem: your message changed without your permission |
| A deepfake video or Photoshopped photo | A deliberate attack on what you believe is real |

!warn: **When it fails:** a hacker gets into an account and changes or deletes things, or someone edits a text before forwarding it to start a rumor. Either way you can no longer trust that what you are looking at is what was really there."""),
   ("Availability: there when you need it", """**Availability** means the data or service is there and working at the moment you need it. It is about **access**. A system can be perfectly private and perfectly accurate and still be useless if it is down.

| Example | What happened |
| School Wi-Fi down before a deadline | The network is not gone, just not there when you needed it |
| A streaming or social app outage | The app and your account are fine but unreachable |
| A game server crash mid-match | The service was not there at the moment it mattered |
| Ransomware on a school's computers | The files are not deleted, just locked until someone pays |
| A DDoS attack | So much fake traffic arrives that real visitors cannot get through, so the site is "up" but unreachable |
| Your phone dying with a QR ticket on it | The ticket exists but is not available to you right then |
| A power outage taking down your router | The oldest availability failure there is |

!warn: **When it fails:** a hospital system hit with ransomware cannot pull up patient records. The data still exists. It just is not reachable."""),
   ("Which pillar failed? A three-question method", """Use the same three questions every time you read about an incident. Ask what happened to the information itself, not how scary the story sounds.

1. **Did someone see it who should not have?** Then confidentiality failed.
2. **Was it changed, faked or wrong?** Then integrity failed.
3. **Could the right people not reach or use it?** Then availability failed.

An incident can break more than one pillar. Ransomware that also steals a copy of the files breaks availability (locked) and confidentiality (copied). Name every pillar that applies and say which one hurt most.

!tip: Do not decide by who did it or how clever the attack was. Decide by what happened to the information. A leaked database, a changed grade and a crashed site are three different failures even if the same hacker caused all three."""),
   ("The three pillars pull against each other", """A strong security setup balances all three pillars. Pushing one pillar too hard often costs another.

| Setting | What it gains | What it costs |
| Records locked so tightly that a doctor cannot open them in an emergency | Confidentiality | Availability |
| A single shared password for everyone so nobody gets locked out | Availability | Confidentiality and integrity |
| Three approvals before any change to payment data | Integrity and confidentiality | Speed, so some availability |

There is rarely a setup that maxes out all three at once. Good security is choosing the right balance for the situation, not chasing a perfect score on every pillar. A hospital should lean toward availability for emergency records. A bank vault should lean toward confidentiality.

!key: When someone proposes a new security rule, ask two questions: which pillar does it protect, and which pillar does it cost?"""),
   ("Real incidents, named by pillar", """Practice naming the pillar when you read the news.

| Incident | Pillar that failed | Why |
| 2017: Equifax exposed the personal data of about 147 million people | Confidentiality | Private data reached people who should not have it |
| 2021: ransomware forced Colonial Pipeline to halt its pipeline operations for several days | Availability | The system was locked, not stolen or changed |
| 2021: Facebook, Instagram and WhatsApp were unreachable for about six hours | Availability | A service was not there when billions of people needed it |
| A deepfake video of a person saying something they never said | Integrity | It makes something look real that was not |

The habit matters more than the details: whenever you read about a breach, try to name which pillar actually failed."""),
  ],
  [tbl(["Scenario", "Pillar", "Reason in one line"], [
       ["A hacker reads your private DMs", "Confidentiality", "Someone saw what they should not"],
       ["Someone secretly edits your grade in the portal", "Integrity", "The data was changed by someone who should not touch it"],
       ["A DDoS attack makes a website unreachable", "Availability", "Nothing was stolen or changed; it just could not be reached"],
       ["A school's records are locked by ransomware", "Availability", "The files exist but nobody can use them"],
       ["An edited screenshot is shown as proof you said something", "Integrity", "What you are looking at is not what was really there"],
       ["A phone left unlocked at lunch", "Confidentiality", "A private conversation was seen by the wrong person"],
       ["A disappearing Snapchat", "Confidentiality", "Privacy with a built-in expiration date"],
       ["Your phone dies when you need your QR ticket", "Availability", "The ticket exists but is not available to you at that moment"]])],
  [tbl(["Step", "What happened", "Pillar affected", "Why"], [
        ["1", "Ransomware locks every computer in a school office", "Availability", "Staff cannot open files they own"],
        ["2", "The attackers also copy student records before locking them", "Confidentiality", "Private data left the building"],
        ["3", "The school restores from a backup copy made last night", "Availability back, integrity checked", "A backup puts the files back, and the school checks they match"],
        ["4", "The school decides which pillar to protect first next time", "Tradeoff", "More backups cost money; tighter access slows staff"]]),
   tbl(["Step", "What happened", "Pillar affected", "Why"], [
        ["1", "A student shares a screenshot of a group chat", "None yet", "The screenshot is accurate"],
        ["2", "Another student crops out the first line and posts it", "Integrity", "Leaving out context changes what was said without editing a word"],
        ["3", "The post spreads to the whole grade", "Confidentiality", "A private chat is now public"],
        ["4", "The group chat is deleted to stop it", "Availability", "The original messages are now gone"]])],
  [("Saying confidentiality is the same as security", "You miss two of the three pillars.", "Confidentiality is only one of the three. Ask also whether it is accurate and whether it is there."),
   ("Thinking availability only means the internet is on", "Ransomware, a DDoS or a dead phone are availability failures too.", "Availability is about being able to use the thing at the moment you need it."),
   ("Calling every attack a confidentiality failure", "A deepfake or an edited grade does not leak anything; it changes it.", "Ask whether the information was seen, changed or unreachable."),
   ("Believing more locks are always better", "A system so locked down that the right person cannot use it fails availability.", "Look for the right balance for the situation."),
   ("Deciding by how scary the attacker sounds", "You label the pillar by the story, not the data.", "Name the pillar by what happened to the information.")],
  [], QS(1), title="The CIA Triad", kick="Three questions you can ask about any information: is it secret, is it accurate, is it there?",
  site="<b>Notes:</b> The CIA Triad notes &nbsp;·&nbsp; <b>Walkthrough:</b> 1.1 &nbsp;·&nbsp; <b>Assignment:</b> Spotify triage &nbsp;·&nbsp; <b>Quiz game:</b> 1.1", noonline=True)

# =============================================================================== 1.2
C12 = L("1.2", "Say what OSINT is, show how ordinary public information adds up to a profile of a person, and take the first steps to control your own footprint.",
  [("OSINT", "Open Source Intelligence: gathering information from publicly available sources"), ("open source", "available to anyone who knows where to look; not leaked and not hacked"), ("data aggregator", "a for-profit site that scrapes many sources into one profile of a person"), ("police blotter", "a daily feed of arrests and calls for service"),
   ("spear phishing", "a fake message written for one specific person using facts about them"), ("doxxing", "publishing someone's private information to harass them"), ("EXIF data", "hidden data inside a photo file that can include the camera, the time and the GPS location"), ("footprint", "the trail of information about you that exists online"), ("hygiene", "habits that keep your footprint small and under your control")],
  [("What is OSINT?", """When most people hear "intelligence" they picture spies. The reality is less dramatic and more interesting. **OSINT** stands for **Open Source Intelligence**: gathering information from publicly available sources, such as websites, social media, news, public records, photos and videos. Anything anyone can reach without hacking, stealing or breaking a rule counts.

**Open source** does not mean leaked or hacked. It means the information is available to anyone who knows where to look. A Google search is OSINT. Looking up someone's LinkedIn is OSINT. The skill is not finding the data. The skill is knowing what to do with it once you have it.

!key: Before a hacker tries to break into a system, they almost always do OSINT first. Once you understand OSINT you can use it on yourself: see what strangers can already find and clean up the footprint you did not know you had."""),
   ("The five main sources", """None of these need hacking. All of it is technically public.

| Source | What it is | Examples |
| Search engines and the open web | Google, Bing, DuckDuckGo, and engines like Shodan that search internet-connected devices | PDFs, employee names, forgotten pages |
| Social media | People post location, workplace, routine and family on their own | Instagram, TikTok, LinkedIn, X, Facebook, YouTube, Reddit, Discord |
| Public records and government databases | Most are public by law, many free to search by name | Court records, property deeds, marriage licenses, business filings, voter rolls, police blotters |
| News, blogs and archives | Old information that is still there | Local newspapers, school newsletters, obituaries, the Wayback Machine |
| Data aggregators and people-search sites | Scrape all of the above into one profile | FastPeopleSearch, Spokeo, BeenVerified, Whitepages |

!key: **The combined effect.** Any one source can look harmless. Put all five together and a stranger can build a very complete picture of you in under an hour, without hacking anything."""),
   ("Who uses OSINT, and why intent is the only difference", """OSINT is a tool, not a weapon, like a kitchen knife. The same techniques that help a journalist expose corruption can help a stalker find a home. The information is identical. The **intent** is what changes.

| Group | How they use it |
| Journalists | Verify stories and uncover things powerful people want hidden, from the Panama Papers to war-crime documentation |
| Law enforcement | Find missing persons and identify suspects in viral videos, often with no warrant because the data is already public |
| Cybersecurity professionals | Run OSINT on their own company to find what an attacker would see first, then fix it |
| Employers | Hiring managers Google candidates, so a post from 9th grade can affect a job offer |
| Friends, family and dates | A first date will probably Google you. This is OSINT even if nobody calls it that |
| Scammers | Learn a boss's name and schedule, then send a fake email that looks real: **spear phishing** |
| Stalkers and doxxers | Find a home address, school and family; **doxxing** is built almost entirely on OSINT |"""),
   ("Five public posts: how Jordan gets profiled", """Jordan has never been hacked and never had a data breach. Jordan just posts normally. Here is what a stranger can learn from five completely public Instagram posts.

| Post | What a stranger learns |
| "Friday night lights with my school's team!" | Jordan's school, which day the games are, and a tagged photo of friends |
| A dog photo with a street sign visible | The dog's name (often used in passwords), the neighborhood, and the exact GPS location if the original photo file is shared with its hidden EXIF data |
| "Happy birthday Mom!" | Mom's name, face and birthday, one of the most common bank security questions |
| A car selfie | The make, model, color and partial plate of the family car |
| "UGH I have a Java test 3rd period Tuesday" in a story | Jordan's schedule and classes |

In under twenty minutes, with zero hacking, a stranger knows Jordan's full name, school, neighborhood, family, schedule, car and common password material. None of it was stolen. All of it was given away.

!tip: Many apps strip EXIF data when you post, but sending the original photo file may not. Turn off location tagging for your camera if you do not want the coordinates saved at all."""),
   ("OSINT and the CIA triad", """OSINT pushes on all three pillars from lesson 1.1.

| Pillar | What happens | Real example |
| Confidentiality | Every piece of public data is by definition not confidential. OSINT is built on the slow erosion of privacy | A private thought you posted at 14 is still Googleable at 25 |
| Integrity | Public sources are full of errors, so an investigator can report something confidently wrong | A typo in a public arrest record names the wrong person |
| Availability | Once data is public it is too available: cached, mirrored and copied | You delete a tweet but it was already screenshotted and archived |

!key: OSINT is the biggest reason cybersecurity is hard in the modern world. Every post, public record and leaked email is a free clue for whoever looks. Security is not only firewalls. It is understanding the trail you leave behind."""),
   ("Registries, blotters and aggregators", """A large part of public data comes from three kinds of collection.

| Collection | What it is | Who runs it |
| Police blotter | A daily news feed of arrests and calls for service | Local police and small-town newspapers |
| Sex offender registry | A government database of the location and information of people convicted of specific crimes | State and federal agencies |
| Data aggregators | For-profit sites that scrape the internet into a digital folder on almost everyone; they make money from your data | Private companies |

**How they get your data**

| Method | How it works |
| Public records | Buying a house, getting married, voting or a speeding ticket each create a record; aggregators pull millions into searchable profiles |
| Social media scraping | Bots crawl bios, friends lists and geotagged posts; even private profiles leak through friends' public posts and tags |
| Buying and selling data | Everyday apps sell "anonymized" data to brokers, who connect it back to your real name and resell it |

You do not need to be famous, rich or important to have a file. If you have signed up for anything online, voted or had a public address, you have one."""),
   ("Where each pillar breaks for registries and blotters", """These collections show all three pillars pulling against each other.

| Pillar | The conflict | Real-life consequence |
| Confidentiality | Their whole purpose is to make private information public | Your home address can be found on a people-search site for free; a minor old offense can show up forever, even after charges were dropped |
| Integrity | The data must be true to be fair to the people listed, but it is scraped, copied and re-shared automatically, so errors spread | A typo lists the wrong name for an arrest; two people with similar names get mixed up and it takes years to fix |
| Availability | Society wants the data always online for safety, but individuals want the right to be forgotten when it is wrong | If a registry site crashes, parents cannot check their neighborhood; someone proven innocent finds a mugshot nearly impossible to remove, and some sites charge a fee |

There is no easy answer. **For:** blotters keep communities informed, registries help parents protect kids, records promote transparency. **Against:** errors ruin innocent people's lives, old mistakes follow people forever, and companies profit off your data without consent."""),
   ("Defend yourself: OSINT hygiene", """The best defense against OSINT is knowing what someone could already find. The tools cost nothing and take about an hour to learn.

1. Search your own name in quotes, and your username, on several search engines.
2. Check the social media accounts you have, including old ones, and tighten the privacy settings.
3. Look at what your photos reveal: street signs, house numbers, school logos and location tags.
4. Turn off location tagging for the camera.
5. Look for yourself on people-search sites, and use their opt-out pages where they exist.
6. Think before you post a schedule, a birthday or a vacation.

!key: You cannot become invisible, and that is fine. The goal of OSINT hygiene is to make sure that what is out there about you is something **you chose** to put there."""),
  ],
  [tbl(["If a stranger saw this post", "They could learn", "Safer version"], [
       ["Photo of your front door with the house number", "Where you live", "Crop the number or post it after you leave"],
       ["\"Away at the lake all weekend!\" posted today", "That the house is empty", "Post it when you are back"],
       ["Mom's birthday dinner photo with her full name", "A name and birthday for security questions", "Use a first name or a nickname"],
       ["Original photo file of a dog in front of your house", "EXIF GPS coordinates", "Turn off location tagging, or share a screenshot"],
       ["Class schedule screenshot", "Where you are at what time", "Share only with the people who need it"]])],
  [tbl(["Step", "What a researcher does", "Source", "What it adds to the profile"], [
        ["1", "Searches a student's username", "Search engine", "Their accounts on several sites"],
        ["2", "Reads the bios and tags", "Social media", "School, team, friends"],
        ["3", "Looks up the family name and address", "Public records", "Parents' names and property"],
        ["4", "Searches a people-search site", "Data aggregator", "Phone numbers and relatives in one page"],
        ["5", "Combines everything", "All five", "A near-complete profile in under an hour"]]),
   tbl(["Step", "What happens", "Pillar", "Why"], [
        ["1", "A police blotter prints a wrong name for an arrest", "Integrity", "A typo makes the record false"],
        ["2", "A scraper copies it to people-search sites", "Availability", "It is now everywhere, and is hard to remove"],
        ["3", "An employer sees the false record", "Confidentiality", "A private mistake of a clerk becomes public"],
        ["4", "The person asks each site to remove it", "Tradeoff", "The right to be forgotten against the public's right to know"]])],
  [("Thinking OSINT is hacking", "People assume it is illegal or special.", "OSINT uses only information anyone can reach. Hackers use it first."),
   ("Judging a single post by itself", "Each post is harmless, so you post more.", "A stranger combines posts. Ask what the five together reveal."),
   ("Believing deleted means gone", "Cached, mirrored and archived copies stay.", "Assume anything public can stay public."),
   ("Trusting every public record as true", "Scraped data spreads typos and mix-ups.", "Treat public data as a clue, not as proof."),
   ("Making everything private and stopping there", "Friends' public posts and tags still leak you.", "Check your tags and what friends post about you.")],
  [], QS(2), title="OSINT: Open Source Intelligence", kick="Everything a stranger can learn about you without hacking anything, and what to do about it.",
  site="<b>Notes:</b> the OSINT Guide &nbsp;·&nbsp; <b>Walkthrough:</b> 1.2 &nbsp;·&nbsp; <b>Assignment:</b> Zillow trust team &nbsp;·&nbsp; <b>Quiz game:</b> 1.2", noonline=True)

# =============================================================================== 1.3
C13 = L("1.3", "Say what police may and may not do when they question you, name the five places it happens, and know the exact words that stop the questions.",
  [("4th Amendment", "protects people from unreasonable searches and seizures"), ("interrogation", "questioning designed to get a confession"), ("voluntary", "a confession given freely, not caused by a promise or a threat"), ("hope of benefit", "a promise of a lighter sentence or freedom in return for talking; not allowed"), ("fear of injury", "a threat of harm to get someone to talk; not allowed"),
   ("invoke", "to say clearly that you are using a right"), ("warrant", "a judge's written permission for a search or arrest"), ("knock and talk", "officers knock like anyone else and ask to talk or come in"), ("plain view", "something an officer can see from where they are legally standing")],
  [("The 4th Amendment and the interrogation room", """The **4th Amendment** protects you from **unreasonable searches and seizures**, but it never defines what "unreasonable" means. What is legal for police to say and do during questioning surprises almost everyone the first time they learn it.

In Georgia, and most of the U.S., police may legally use trickery, bluffing and outright lies during questioning to get a confession. An **interrogation** is designed to secure a confession. It is not designed to be a casual, honest conversation. Officers build cases. That is their job in the room. It is not personal, and it is not necessarily unfair under the law.

!key: No one in the room is going to explain your rights as the questioning goes on. You need to know them before you walk in."""),
   ("The voluntary standard", """Georgia law (O.C.G.A. section 24-8-824) draws a line between what an officer may do and what makes a confession **involuntary**, which means it can be thrown out.

| Police CAN | Example |
| Fake evidence | Claim your DNA or fingerprints were found at the scene when they were not |
| False witnesses | Say a friend already blamed you when nobody said anything |
| Undercover identity | Pose as a peer, buyer or seller, online or in person, without saying they are police |

| Police CANNOT | Name |
| Make promises | Offer a lighter sentence or freedom for talking: an illegal **hope of benefit** |
| Threaten | Use physical harm or illegal consequences: a **fear of injury** |
| Ignore a clear invocation | Keep questioning after you clearly say you want to stay silent or want an attorney |

!key: **The pattern.** Lying about facts (evidence, witnesses, identity) is generally allowed. Lying about consequences (promising a benefit or threatening harm) is not."""),
   ("Five common interrogation arenas", """The same rules apply differently depending on where the questioning happens.

| Arena | The rule from the notes |
| On school grounds | Administrators have lower search rules than police, but police must still respect your right to remain silent |
| Traffic stops | Officers can stop you for a real, minor offense. You owe ID, registration and insurance. They cannot stop you just to check for drugs without a warrant |
| At your door (knock and talk) | Officers can knock like anyone else and, in many courts, can give a false reason for being there. You never have to let them in without a warrant. Once they are inside, what they see in plain view can be used |
| Undercover or online | Police do not have to identify themselves as police, even if you directly ask |
| The station interrogation room | The full use of bluffing and pressure happens here: the highest-stakes arena |"""),
   ("How to invoke your rights", """Knowing the rules does not help if you do not know the exact move that stops the questions. It is a learnable script.

1. Police questioning begins.
2. Say this clearly: **"I am invoking my right to remain silent, and I want a lawyer."**
3. Stop talking. Do not explain, guess or make small talk. Even small talk can be used later.
4. Once you have said it clearly, all legal questioning must stop.

!warn: **The part almost everyone gets wrong.** Saying it once does not protect you forever if you then start talking again. You can invoke your rights at any point, even mid-interrogation, but you can also **un-invoke** them by choosing to keep answering questions."""),
   ("Why short is safest", """Everything else, such as explaining, arguing or "just clearing things up," gives an interrogation more material to work with. One clear sentence gives it none.

| What you might do | What it gives the interrogation |
| Explain your side | New statements that can be compared with the evidence |
| Argue with the officer | Anger and details that can be used later |
| Make small talk | A relationship, and things said that can be quoted |
| Say the sentence and stop | Nothing |

!tip: This is not about being guilty or innocent. Innocent people can be tricked into saying things that sound bad. The sentence protects everyone the same way."""),
   ("Saying no to a search", """The same idea works for what you hand over. An officer asking politely is not a warrant. You can calmly say **"I do not consent to a search."** Saying it is not rude and it is not a sign of guilt. It keeps the question about whether the police have a warrant or another legal reason, and it is the right the 4th Amendment gives you.

!warn: Rules differ by state and situation, and this guide is a classroom introduction, not legal advice. If you are ever questioned for real, the safest steps are the ones in this lesson: stay calm, say the sentence, stop talking, and get a lawyer."""),
  ],
  [tbl(["Tactic", "Legal?", "Why"], [
       ["\"Your fingerprints were all over the room.\" (They were not.)", "Legal", "Lying about evidence is a lie about a fact"],
       ["\"Your friend already told us everything.\" (Nobody did.)", "Legal", "A false witness is a lie about a fact"],
       ["A message from a \"new friend\" in a chat who is an officer", "Legal", "Undercover identity is allowed"],
       ["\"Confess and you will go home tonight.\"", "Illegal", "A promise of a benefit"],
       ["\"Talk or something bad will happen to you.\"", "Illegal", "A threat or fear of injury"],
       ["Continuing to question after \"I want a lawyer\"", "Illegal", "Ignoring a clear invocation"]])],
  [tbl(["Step", "What happens", "Rule", "Result"], [
        ["1", "An officer says a friend already blamed you", "Facts may be faked", "Legal, but it is only pressure"],
        ["2", "You say \"I am invoking my right to remain silent, and I want a lawyer\"", "A clear invocation", "Legal questioning must stop"],
        ["3", "The officer is quiet for a minute, and you answer a question", "You started talking again", "You un-invoked the right"],
        ["4", "Anything you say can now be used", "No protection after un-invoking", "Say the sentence again and stop"]]),
   tbl(["Place", "Question", "What you owe", "What you can do"], [
        ["Traffic stop", "An officer asks to look in your trunk", "ID, registration and insurance", "Say you do not consent to a search"],
        ["Your front door", "Officers ask to come in", "Nothing", "Do not let them in without a warrant"],
        ["School office", "An administrator checks your bag", "Lower rules than police", "Stay calm; police must still respect silence"],
        ["Online chat", "A new friend asks about a crime", "Nothing", "Police need not identify themselves, so be careful"]])],
  [("Believing police cannot lie", "You trust a bluff about evidence.", "Lying about facts is legal. Do not decide based on what an officer says they have."),
   ("Thinking a promise from an officer is binding", "A promise of a lighter sentence is not allowed.", "Treat promises as pressure. Ask for a lawyer."),
   ("Explaining to \"clear things up\"", "You give the interrogation more material.", "Say the sentence and stop."),
   ("Saying it once and then chatting", "You un-invoke the right.", "After you invoke, stay silent."),
   ("Thinking you must let officers in at the door", "You do not need to without a warrant.", "You may politely refuse.")],
  [], QS(3), title="Police and the 4th Amendment", kick="What police can legally say and do in the room, and the one sentence that stops it.",
  site="<b>Notes:</b> the Police and the 4th Amendment notes &nbsp;·&nbsp; <b>Walkthrough:</b> 1.3 &nbsp;·&nbsp; <b>Assignment:</b> Discord safety card &nbsp;·&nbsp; <b>Quiz game:</b> 1.3", noonline=True)
