from ist_lib import *
from units.ist01_q import QS

# =============================================================================== 1.4
C14 = L("1.4", "Sort what a phone records into location, habits and hidden data, and explain how each one helped solve a real case.",
  [("digital footprint", "the data you leave behind when you use devices and accounts"), ("metadata", "data about a file, such as who last saved it, when and with what software"), ("EXIF data", "metadata stored inside a photo: camera, time and, if location is on, GPS"), ("cell-tower record", "the carrier's log of which towers a phone connected to and when"),
   ("genetic genealogy", "comparing a DNA profile with DNA that relatives uploaded to hobby genealogy sites"), ("wearable", "a device on your body, such as a fitness tracker, that records movement"), ("subpoena", "a legal demand to hand over records"), ("probable cause", "enough evidence for a judge to approve a warrant"), ("alibi", "evidence that a person was somewhere else")],
  [("Three kinds of phone data", """Most investigations today involve digital evidence: phones, cameras, cloud accounts, even step counters. The same invisible footprint that can catch a killer can also track an ordinary person's every move. The 1.4 notes sort what a phone gives away into **three categories**.

| Category | What it is | Examples |
| Location | Where the phone, and so you, has been | Cell-tower connections, GPS, Wi-Fi networks, photos with coordinates |
| Habits | What you do and when | Which apps you open at what time, step counts, sleep and wake times |
| Hidden data | Information stored inside files that you never typed | File metadata, photo EXIF, who last saved a document |

!key: The three categories are not separate. Investigators get their best results when location, habits and hidden data all point the same way, along with other evidence."""),
   ("BTK: caught by a floppy disk", """Between 1974 and 1991 a man who called himself BTK killed ten people in and around Wichita, Kansas, and mailed taunting letters to police and the news. He went quiet for years. In 2004 he started writing again. In early 2005 he asked whether a floppy disk could be traced. Police answered through a newspaper ad: "Rex, it will be OK." That was a lie, and a legal one, as lesson 1.3 showed. He sent a disk anyway.

Every file stores **metadata**: data about the file. A Word document can record the user account, the organization the software is registered to, and when and where it was last saved. A floppy disk holds the file, so the hidden data travels with it.

| Step | What happened |
| 1 | He asked whether a floppy disk could be traced; police replied it would be safe |
| 2 | A purple floppy disk with one file reached the TV station and police in mid-February 2005 |
| 3 | The file's hidden properties showed it was last saved by a user named Dennis, on software registered to Christ Lutheran Church in Park City, Kansas |
| 4 | The church website showed the president of the church council was Dennis Rader |
| 5 | DNA closed the case; news reports differ on exactly how the family-match step worked |
| 6 | He was arrested on February 25, 2005, pleaded guilty in June 2005 and received ten consecutive life sentences |

!key: He asked whether the disk could be traced and trusted the answer. He did not think about the hidden properties inside the file. Files carry metadata you never see, and police are allowed to lie to you."""),
   ("Bryan Kohberger: the gap is data too", """On November 13, 2022, four University of Idaho students were killed at an off-campus house in Moscow, Idaho: Kaylee Goncalves, Madison Mogen, Xana Kernodle and Ethan Chapin. For weeks there was no suspect. Investigators collected video, studied a white Hyundai Elantra seen near the house and found DNA on a knife sheath left at the scene. On December 30, 2022, Bryan Kohberger, a graduate student at nearby Washington State University, was arrested in Pennsylvania. He pleaded guilty in July 2025 and was sentenced to four consecutive life terms without parole.

A phone keeps checking in with cell towers, and the carrier keeps a log. Investigators can ask a court for the records for a place and time. **An absence is also data.** A phone that was connecting all day and then stops leaves a hole in the log.

| Step | Evidence |
| Before | According to the court's probable cause affidavit, records showed a phone registered to him near the victims' home at least a dozen times in earlier months |
| The night | His phone did not use cell towers in that area from about 3 a.m. to 5 a.m.; investigators suggested it was off or in airplane mode |
| After | The phone reappeared on the network around 4:48 a.m. at a tower south of Moscow, then moved back toward Pullman, where he lived |
| The car | Video showed a white Elantra near the house; a campus registration tied a white Elantra to him |
| DNA | DNA on the sheath was compared with DNA from trash at his parents' home; the affidavit said it matched. Later reports say genetic genealogy was used first, based on unnamed sources |

!key: Turning a phone off feels like disappearing. It is not. The carrier still logged the connections before and after, and the gap lined up with the crime. Digital evidence is strongest when it fits together with other evidence."""),
   ("Golden State Killer: your relatives' choices", """For decades a man committed dozens of rapes and at least a dozen murders across California in the 1970s and 1980s. Detectives had his DNA but no match, because police databases hold DNA only from people who were arrested, and he never had been.

**Genetic genealogy** compares a DNA profile with the DNA that ordinary people upload to hobby genealogy sites. You do not need to match the criminal. You only need a cousin who uploaded.

| Step | What happened |
| 1 | Crime-scene DNA matched nobody in the criminal databases |
| 2 | In early 2018 detectives uploaded the profile to GEDmatch, a public site |
| 3 | The site listed distant cousins who had never heard of the case |
| 4 | Genealogists built family trees and narrowed hundreds of people to a few |
| 5 | Detectives confirmed with DNA from items he had discarded |
| 6 | April 24, 2018: Joseph DeAngelo, a former police officer, was arrested; he pleaded guilty in 2020 and was sentenced to life without parole |

!key: He had never uploaded anything. Strangers who share a small amount of his DNA did, and that was enough. Some of your data is not only yours: DNA, contacts and group photos are shared with relatives and friends."""),
   ("Four more cases, four more kinds of data", """| Case | The data | What happened |
| Ross Ulbricht (Silk Road), 2013 | An old forum post and an email address | Early in 2011 a user named altoid promoted the site, and later asked for IT help using an email address with Ulbricht's full name; he was arrested October 1, 2013 in a San Francisco library while logged in to the site's admin controls. He was convicted, sentenced to life, and pardoned in January 2025 |
| John McAfee, 2012 | Photo EXIF GPS coordinates | VICE published a photo of him on December 3, 2012; the file's GPS coordinates pointed to Guatemala, not Belize, where he was wanted for questioning. He was detained December 5. Whether the data had been altered was never established |
| Reality Winner, 2017 | Printer tracking dots | Many color laser printers print nearly invisible dots that encode the printer's serial number and the print date and time. Six people had printed the document; only one had emailed the news site. She pleaded guilty and was sentenced to 63 months. People disagree about whether leaking was right; this case is about how she was found |
| Richard Dabate, 2015 to 2022 | A Fitbit step counter | He told police a masked intruder shot his wife Connie. Her Fitbit, according to state police, showed her moving for about an hour after the time he gave. A jury convicted him in 2022 and he was sentenced to 65 years; his lawyer argued the device was not built to be that accurate for court |

!tip: Each of these people did not think of the data as data. A photo, a printed page, a username and a wrist are all witnesses that nobody told to stay quiet."""),
   ("The digital trail can protect the innocent", """In October 2009, 19-year-old Rodney Bradford was arrested for an armed robbery in Brooklyn. He said he was at his father's apartment in Harlem, miles away. He had posted on Facebook from there at about the time of the robbery. Prosecutors subpoenaed Facebook's records, which showed the post was typed from a computer at the Harlem apartment, and the charges were dropped.

| What it shows | Why it matters |
| A server record of what account did what, when and from which internet address | It can prove where a computer was |
| It shows a computer, not a person | Courts weigh it together with other evidence |
| A casual, unthinking post became proof | A trail protects the innocent as well as catching the guilty |

!key: Data can also be wrong. A good investigation uses a tracker or a log as one clue, not the whole case."""),
   ("The fair warning: this is about you", """The same three categories apply to an ordinary person. Use the five audit questions from the case files on your own phone:

1. Does my phone add my location to every photo I take?
2. Which of my old accounts and usernames are still public?
3. Who else has my DNA, my contacts or group photos of me, and what do they do with them?
4. Does my school or home printer add hidden dots?
5. Which of my devices (watch, earbuds, car, laptop) keep a log of where I was and when?

!key: If everything on your phone could someday be pulled up in a courtroom, would you change anything about how you use it today? There is no answer that makes the footprint disappear. The goal is to know what you are leaving, and to choose it."""),
  ],
  [tbl(["Case", "Category", "The piece of data", "Why they did not think of it"], [
       ["BTK", "Hidden data", "File metadata on a floppy disk", "Nothing he typed; the computer wrote it"],
       ["Kohberger", "Location", "Cell-tower records, including the gap", "Turning off a phone feels like vanishing"],
       ["Golden State Killer", "Hidden data", "Relatives' DNA on a genealogy site", "He never uploaded anything"],
       ["Ulbricht", "Habits", "An old forum username and email", "An early post from before the site existed"],
       ["McAfee", "Hidden data", "Photo GPS coordinates", "Nobody thinks of a photo as a map"],
       ["Winner", "Hidden data", "Printer tracking dots", "A page of paper does not feel like data"],
       ["Dabate", "Habits", "A step counter on a wrist", "He was not thinking about his wife's wrist"],
       ["Bradford", "Habits", "A Facebook server record", "A casual status update cleared him"]])],
  [tbl(["Step", "BTK", "Kohberger"], [
        ["1", "Asks if a floppy disk can be traced", "Phone seen near the home at least a dozen times"],
        ["2", "Disk arrives with one file", "No tower connections about 3 a.m. to 5 a.m."],
        ["3", "Properties show Dennis and a church", "Reconnects around 4:48 a.m. south of town"],
        ["4", "Church website shows his name", "White Elantra tied to him"],
        ["5", "DNA confirms", "DNA on a knife sheath matches"],
        ["6", "Arrested February 25, 2005", "Arrested December 30, 2022"]]),
   tbl(["Question", "Answer"], [
        ["What did both cases use that you never type?", "Data created by a device or a file, not by the suspect"],
        ["What did police do in both cases besides use data?", "Compared several kinds of evidence, including DNA"],
        ["Why does \"off\" not make a phone invisible?", "The carrier logged connections before and after; the gap is a clue"],
        ["Is the data ever wrong?", "Yes, so it is one clue and must fit with other evidence"]])],
  [("Thinking turning a phone off hides you", "The carrier's records still show the gap and the pattern around it.", "Treat a missing signal as data."),
   ("Thinking only what you post is your footprint", "Metadata, photos, printers and relatives add more.", "Audit hidden data and shared data too."),
   ("Believing deleted files are gone", "Backups, copies and metadata travel with the file.", "Assume a file keeps its history."),
   ("Believing digital evidence is perfect", "Devices and logs can be wrong; Dabate's lawyer questioned the Fitbit.", "Use it as one clue with others."),
   ("Forgetting the trail can clear people", "You treat it only as a threat.", "Bradford shows a record can prove where you were.")],
  [], QS((4, 5)), title="Your Phone's Invisible Footprint", kick="The data a phone and a file give away without being asked, and the real cases it solved.",
  site="<b>Notes:</b> the 1.4 lesson page and the Caught by Their Own Data case files &nbsp;·&nbsp; <b>Walkthrough:</b> 1.4 &nbsp;·&nbsp; <b>Assignment:</b> Apple privacy guide &nbsp;·&nbsp; <b>Quiz game:</b> 1.4", noonline=True)

# =============================================================================== 1.5
C15 = L("1.5", "Explain how attackers crack passwords, which defenses stop them, and why a long random passphrase beats a short clever password.",
  [("entropy", "a measure of how unpredictable a password is"), ("brute force", "trying every possible combination until one works"), ("dictionary attack", "trying real words and leaked passwords with predictable tweaks"), ("leetspeak", "swapping look-alike characters such as @ for a"), ("hash", "a scrambled version of a password that a site stores instead of the password"),
   ("rainbow table", "a lookup chart of pre-computed hashes of common passwords"), ("credential stuffing", "trying one site's leaked login on many other sites"), ("keylogger", "software that secretly records every key you press"), ("MFA", "multi-factor authentication: a second proof of identity"), ("passphrase", "a string of random unrelated words"), ("password manager", "a tool that makes and remembers a unique password per site")],
  [("Ten terms, two sides", """The 1.5 notes split ten terms into two sides of the same coin: **seven ways in** and **three ways to stop them**. Notice the imbalance. That is why layering several defenses beats trying to out-clever any single attack.

| Side | Terms |
| How attackers crack passwords | Entropy, brute-force attack, dictionary attack, leetspeak substitution, hash and rainbow table, credential stuffing, keylogger |
| What actually defends you | MFA, passphrase, password manager |"""),
   ("Entropy and brute force", """**Entropy** measures how unpredictable a password is. More possible characters and more length both raise entropy. Entropy, not looking complicated, decides how many guesses an attacker needs.

A **brute-force attack** tries every possible combination, one at a time, until one works. Short passwords fall fast because there are not many combinations, and each extra character multiplies the total.

| Password | Rough entropy (bits) | What it means |
| 8 random characters from letters, digits and symbols, such as `Qx7#vLm2` | about 53 | Needs a very large number of guesses |
| 4 random words, such as `river-comet-anchor-maple` | about 52 | About as strong as 8 random characters, and easier to remember |
| 5 random words | about 65 | Far stronger than 8 random characters |
| An 8-letter lowercase word | about 38 | Small number of guesses |

!key: Each extra bit doubles the number of guesses. Length from randomness beats clever symbols. The numbers above are from the course's password lab, which assumes an attacker who stole a site's password file and can try 10 billion guesses a second."""),
   ("Dictionary attacks and leetspeak", """Instead of guessing randomly, a **dictionary attack** starts from real words and leaked password lists and applies predictable tweaks: a capital letter, 123 on the end, symbols swapped in. It is much faster than brute force against any password built on a real word.

**Leetspeak** swaps look-alike characters, like @ for a or 0 for o, so `P@ssw0rd!` looks complicated. Cracking tools check these swaps automatically, so it barely slows an attacker down. In the lab, `P@ssw0rd!` is "cracked instantly."

!warn: A password that looks clever to a person is not a password that is hard for a machine."""),
   ("Hashes and rainbow tables", """Sites do not store your actual password. They store a scrambled version called a **hash**. If your password is common, an attacker can pre-compute the hashes of common passwords into a lookup chart, a **rainbow table**, and find yours instantly.

| Idea | What it means for you |
| The site stores a hash, not your password | A breach of the site's list does not directly show your password |
| The hash of a common password is already known | If your password is common, the hash is no protection |
| A long random password is not in any table | Length and randomness protect you here too |"""),
   ("Credential stuffing and keyloggers", """**Credential stuffing:** when one site is breached, attackers try that same username and password on every other site they can think of. Reusing a password turns a single leak into access to all of your accounts.

A **keylogger** is software that secretly records every key you press, including passwords, and sends the log to an attacker. No password is strong enough to beat a keylogger, because the attacker never has to guess. They read what you typed.

| Attack | The only real answer |
| Credential stuffing | A different password for every site |
| Keylogger | Keep devices clean, and use MFA so a stolen password alone does not work |"""),
   ("The three defenses", """| Defense | What it is | What it stops |
| MFA (multi-factor authentication) | A second proof of identity beyond the password, usually a code on your phone or in an app | A stolen password alone, even if the attacker has the exact password |
| Passphrase | A string of random, unrelated words such as river-comet-anchor, instead of one word with substitutions | Brute force and dictionary attacks; longer than a typical password, easier to remember |
| Password manager | A tool that makes and remembers a unique random password for every site behind one master password you memorize | Credential stuffing, because nothing is reused |

!key: Use all three together. A passphrase for the master password, a password manager for every site, and MFA on every account that offers it."""),
   ("Using the password lab", """The 1.5 notes end with a lab. Use made-up passwords only, never a real one.

| Try this | What you should see |
| `P@ssw0rd!` | Cracked instantly: a common word with simple tricks |
| `kittycat` | A very small number of bits (about 38) |
| `Qx7#vLm2` | About 53 bits |
| `river-comet-anchor-maple` | About 52 bits |
| `river-comet-anchor-maple-tiger` | About 65 bits |

Think about what the numbers tell you: more words add more bits, symbol swaps add almost nothing, and randomness matters more than looking complicated."""),
  ],
  [tbl(["Situation", "Attack or defense", "Why"], [
       ["A gaming site is breached and the same login opens a streaming account", "Credential stuffing", "One leak, many accounts"],
       ["A program tries every four-character combination", "Brute force", "Short passwords have few combinations"],
       ["A program tries 5,000 real words with 123 on the end", "Dictionary attack", "Real words plus predictable tweaks"],
       ["Hidden software on a family computer sends everything you type to a stranger", "Keylogger", "The attacker reads, not guesses"],
       ["A leaked password cannot log in because the account asks for a phone code", "MFA", "A second proof"],
       ["A unique 20-character password for each site, remembered by one app", "Password manager", "Nothing is reused"]])],
  [tbl(["Step", "What happens", "Attack", "Defense that would have stopped it"], [
        ["1", "A forum site is breached; its list of usernames and hashes leaks", "Hash and rainbow table", "A long random password"],
        ["2", "Attackers crack the common passwords at once", "Dictionary attack", "A passphrase"],
        ["3", "They try each cracked login on email and shopping sites", "Credential stuffing", "A unique password per site"],
        ["4", "A login works on one site that has no second factor", "Account takeover", "MFA"]]),
   tbl(["Password", "Looks clever?", "Bits in the lab", "Verdict"], [
        ["P@ssw0rd!", "Yes", "Cracked instantly", "Weak: a common word with swaps"],
        ["kittycat", "No", "about 38", "Weak: short and a word"],
        ["Qx7#vLm2", "Yes", "about 53", "Fine if it is random, but hard to remember"],
        ["river-comet-anchor-maple-tiger", "No", "about 65", "Strongest, and easy to remember"]])],
  [("Believing symbols make a password strong", "Leetspeak swaps are checked automatically.", "Add length with random words instead."),
   ("Reusing a password because it is strong", "One breach opens every account.", "Use a password manager and a unique password per site."),
   ("Thinking a strong password beats a keylogger", "The attacker reads what you type.", "Keep devices clean and use MFA."),
   ("Choosing a password from your own life", "Names, pets and birthdays are in dictionaries and public posts.", "Use random words."),
   ("Relying on one defense", "Each defense stops a different attack.", "Layer a passphrase, a password manager and MFA.")],
  [], QS(6), title="How Strong Is Your Password?", kick="Seven ways in, three ways to stop them, and why length from randomness wins.",
  site="<b>Notes:</b> the Password Security notes &nbsp;·&nbsp; <b>Lab:</b> CipherLab &nbsp;·&nbsp; <b>Walkthrough:</b> 1.5 &nbsp;·&nbsp; <b>Assignment:</b> Netflix accounts &nbsp;·&nbsp; <b>Quiz game:</b> 1.5", noonline=True)

# =============================================================================== 1.6
C16 = L("1.6", "Explain the three layers of tracking, what each sensor can reveal, how ad auctions spread your data, and the settings that cut it down.",
  [("sensor", "a part of the phone that measures something about the world"), ("permission", "what you allow an app to use, such as location or the microphone"), ("data broker", "a company that buys, combines and resells data about people"), ("ad auction", "a split-second bidding process that sells a chance to show you an ad"), ("advertising ID", "a number that lets ad companies recognize your phone"),
   ("fingerprinting", "recognizing a browser by its many small traits, without cookies"), ("cookie", "a small file a site stores in your browser to remember you"), ("Incognito", "a mode that hides your history from other people using your device"), ("warrant loophole", "buying data from a broker instead of getting a judge's warrant")],
  [("Three layers", """Your phone is a microphone, a camera, a 3D scanner, an altitude gauge and a motion tracker. All of it runs whether or not you have an app open. The 1.6 notes organize tracking into three layers.

| Layer | What it is |
| 1. Hardware | Built-in sensors that are always on. The accelerometer can identify you by how you walk |
| 2. Software | The apps you install and the permissions you give them |
| 3. The market | Brokers who buy and resell you. Some federal agencies have bought location data instead of getting a warrant |

!key: Most people think only about the middle layer."""),
   ("Layer 1: the hardware", """Every sensor has two faces: the reason it is in the phone, and what an app can do with it once you tap Allow.

| Sensor | Why it is there | What it can be used for |
| LiDAR scanner | Focuses faster in the dark | Scans the 3D layout and furniture of your bedroom |
| Barometer | Tells 911 what floor you are on in a tall building | Estimates your family's income from the floor you live on |
| TrueDepth camera | Face ID, the hardest passcode to crack | Reads micro-expressions to see whether an ad made you happy |
| Ambient light sensor | Dims the screen to save your eyes and battery | Tells whether you are in bed or outside |
| Accelerometer | Detects a high-speed crash and calls for help | Identifies you by the rhythm of your walk, as individual as a fingerprint |

The notes say this is not a conspiracy theory: Apple's developer documentation describes LiDAR capturing 3D meshes of indoor spaces, peer-reviewed studies have shown that iPhone accelerometer data can identify a person by walking pattern, and the FCC's vertical-location rule requires phones to report height to first responders."""),
   ("Layer 2: the apps", """Social apps used to settle for your city. Now they want your room.

| App | What the notes say |
| TikTok | The U.S. privacy policy (updated 2021) says it may collect biometric identifiers, such as faceprints and voiceprints, from the videos you make, for effects, moderation and content and ad recommendations. The policy does not say exactly how or when. The app also wants precise GPS for its Nearby feed |
| Instagram | The Map feature can show friends where you are if you opt in. Check the setting, because location features are easy to leave on |

!tip: Read the privacy policy of any app before you hand it your face and voice. The real decision happens before you tap Get, because every app you install is one more exit door."""),
   ("Layer 3: the market and the ad auction", """Your data is not shared like a file. It is auctioned. When you open an app with ads, a packet of data, often including your location, can be broadcast to many ad companies in a split second so they can bid on you. A 2022 study estimated a typical American's data is exposed this way about **747 times a day**.

| Step | What happens |
| 1 | You open a weather app in a psychiatrist's waiting room |
| 2 | Your location and advertising ID go to dozens, even hundreds, of ad companies before the ad loads |
| 3 | A pharmacy pays the most and wins, and shows you an ad for vitamins |
| 4 | Everyone else lost, but received the packet and may keep it. Depending on their rules, they may know you were at a psychiatrist's office |

!key: One bidder wins. Every other bidder loses, but may keep the data."""),
   ("The warrant loophole", """Normally the government needs a judge to sign a warrant before it can track your movements. But this data is commercially available, and anyone with a credit card can buy it. So agencies argue no warrant is needed.

| Step | Who does what |
| 1 | Your app sells your location data to a broker |
| 2 | The government buys the data from the broker |
| 3 | No warrant was ever required |

The 4th Amendment from lesson 1.3 gets skipped, not because the law changed, but because a private company stood in the middle."""),
   ("Lock it down", """You cannot disappear. What you can do is make yourself expensive to follow. These take ten minutes and cost nothing.

| Setting | What it does |
| Turn off Precise Location for social apps | They still get your general area, not your room |
| Turn off Motion and Fitness for social apps | Shuts down identifying you by how you walk |
| Limit Precise Location for your carrier (newer iPhones and carriers only) | Blurs the position your phone company can estimate from cell towers; it does not change what apps see or what 911 sees |
| Turn off Allow Apps to Request to Track | Kills the advertising ID that feeds the auction, and every future tracking popup is denied |
| Audit every permission (camera, microphone, photos, contacts, Bluetooth) | Revoke anything an app does not need. If a flashlight app has microphone access, something is wrong |

!warn: These reduce how much leaks out. They do not stop it."""),
   ("See it yourself, and the Incognito myth", """The notes list nine free sites that prove tracking on your own device, including Cover Your Tracks (from the Electronic Frontier Foundation), AmIUnique, Webkay, Device Info, Clickclickclick, Nothing Private, Fingerprint.com's demo, BrowserLeaks and CreepJS. Everything these sites show you is information that every website you visit already has.

**Incognito** was never about hiding from websites. It hides your history from other people using your computer. Studies have found most browsers are unique enough that sites can recognize you through **fingerprinting**, even if you never log in.

!warn: Use the exact CreepJS address from the notes and no other. Copycat sites at other addresses run modified code and exist to capture the fingerprint data they pretend to show you."""),
  ],
  [tbl(["Sensor or setting", "What an app can learn", "What you can switch off"], [
       ["Accelerometer", "How you walk, which can identify you", "Motion and Fitness for social apps"],
       ["GPS and precise location", "Your exact room", "Precise Location for social apps"],
       ["Advertising ID", "A number that follows you between apps", "Allow Apps to Request to Track"],
       ["Camera and microphone permission", "Faces, voices, surroundings", "Permissions an app does not need"],
       ["Browser fingerprint", "Who you are without a login", "Nothing fully; use tracker-blocking and know the limits"]])],
  [tbl(["Step", "What happens", "Layer", "What it means"], [
        ["1", "You open a free game", "Software", "The app asks for location and you tap Allow"],
        ["2", "Your phone's sensors give the app your position and movement", "Hardware", "It can identify you by how you move"],
        ["3", "The app sells the data to a broker", "Market", "The broker resells it"],
        ["4", "An agency buys it", "Market", "No warrant was needed"]]),
   tbl(["Step", "Ad auction in the demo", "Result"], [
        ["1", "You press the button to open an app", "A packet with location and ad ID is sent"],
        ["2", "Eight companies receive it", "All eight see your data"],
        ["3", "Each company bids", "One bid is the highest"],
        ["4", "ShopSignal wins in the demo", "The seven losers keep the data they received"]])],
  [("Thinking tracking is only about apps", "Sensors and the data market are separate layers.", "Look at all three layers."),
   ("Thinking Incognito hides you from websites", "It only hides history from people on the same device.", "Use tracker blocking and know the limits."),
   ("Thinking only the winner of the auction gets your data", "All bidders receive the packet.", "Assume every bidder may keep it."),
   ("Thinking a warrant is always needed", "Buying data from a broker skips the judge.", "Cut the data before it leaves your phone."),
   ("Clicking Allow without reading", "A flashlight app with a microphone is a warning sign.", "Audit permissions, and revoke what an app does not need.")],
  [], QS(7), title="How Hackers Track You Online", kick="Three layers of tracking: the sensors, the apps and the market, and ten minutes to cut it down.",
  site="<b>Notes:</b> Who&#39;s Watching You &nbsp;·&nbsp; <b>Walkthrough:</b> 1.6 &nbsp;·&nbsp; <b>Assignment:</b> Instagram map review &nbsp;·&nbsp; <b>Quiz game:</b> 1.6", noonline=True)
