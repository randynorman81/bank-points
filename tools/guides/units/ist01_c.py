from ist_lib import *
from units.ist01_q import QS

# =============================================================================== 1.7
C17 = L("1.7", "Say what copyright covers, run the four-factor fair use test, tell public domain from Creative Commons, and tell plagiarism from infringement.",
  [("copyright", "the automatic legal protection for original creative work, from the moment it is made"), ("exclusive rights", "the things only the owner may do or approve: copy, share, display, perform and remix"), ("fair use", "a limited exception that lets you use a small piece of someone's work without asking"), ("transformative", "adds your own commentary, joke, review or lesson instead of just repeating the work"),
   ("public domain", "work nobody owns anymore, so anyone can use it"), ("Creative Commons (CC)", "licenses where the creator keeps the copyright but pre-approves certain reuse"), ("infringement", "using a copyrighted work in a way only the owner may allow, without permission"), ("plagiarism", "passing off someone else's work as your own, an academic and ethics problem"), ("DMCA takedown", "a request that makes a platform remove a post that infringes copyright")],
  [("What copyright covers", """You do not apply for copyright and you do not need a (c) symbol. The exact moment you make something, such as writing, filming, recording or saving it, it is automatically protected. No form, no fee and no waiting period.

| Protected | Not protected |
| A song you recorded | Facts (the sky is blue) |
| A photo you took | Ideas alone (a story idea about a superhero) |
| An essay, story or poem | Titles, names or short phrases |
| Fan art, digital art or a comic you drew | Methods or processes (how to bake bread) |
| Code you wrote for an app or game | Work whose copyright already ran out |
| A video, TikTok or Reel you filmed and edited | A dance move or trend, by itself |
| A Minecraft build or Roblox game you designed | A game's rules |

!key: Copyright protects the exact thing you made, the specific words, notes or pixels, not the idea behind it. Two people can each write their own story about a vampire falling in love. It becomes a problem only if one copies the other's exact sentences."""),
   ("The five exclusive rights", """Owning the copyright gives you a bundle of rights that only you can use, or say yes or no to when someone asks.

| Right | What it means |
| Copy it | Make more copies |
| Share it | Distribute or post it |
| Display it | Show it publicly |
| Perform it | Play or perform it out loud |
| Remix it | Change it into something new, called a derivative work |

Thousands of people post satisfying slime videos or get-ready-with-me videos. The idea and the format are free to copy. But if someone re-uploads your exact video, shot for shot and word for word, and pretends they made it, that is a real problem."""),
   ("The fair use test", """**Fair use** lets you use a piece of someone else's work without asking, but only if it passes a four-part test. Courts and platforms weigh all four together. No single one automatically wins.

| Factor | The question |
| 1. Why are you using it? | Is it transformative: your own commentary, joke, lesson or review? Or is it a plain repost for views? |
| 2. What kind of work is it? | Factual work (news, data) gets more leeway than highly creative work (a song, a movie) |
| 3. How much did you use? | A 5-second clip to make a point is much safer than the whole song, scene or article |
| 4. Does it hurt sales? | Could someone watch your version instead of paying for the real thing? This is the factor courts and platforms weigh heaviest |"""),
   ("Fair use on real posts", """| Post | How it usually plays out |
| A parody account joking over a few short clips of a trailer | Usually fair use |
| A review video: a few short clips and your own analysis | Usually fair use |
| Quoting two lines of song lyrics as a caption, with credit | Usually fair use |
| A movie reaction video that plays almost an entire 20-minute video | Usually not |
| A full song as background music, unedited | Usually not |
| A try-not-to-laugh compilation of ten 3-second clips | Grey area, usually tolerated |
| A meme: one cropped screenshot with a joke caption | Grey area, usually tolerated |

!tip: A grey area, usually tolerated does not mean allowed. It means nobody has complained yet."""),
   ("Public domain and Creative Commons", """Some work is free to use because the copyright expired. Other work is free because the creator chose to give some rights away.

**Public domain** means nobody owns the copyright. In the U.S. this usually happens automatically to very old work (in 2026, generally anything published in 1930 or earlier; the cutoff moves forward one year every January 1), or when a creator gives up all rights. Anything made by the U.S. federal government, like NASA photos, is public domain.

**Creative Commons (CC)** is different. The creator still owns the copyright but pre-approves certain reuse, as long as you follow the license.

| License | What you must do | Example |
| CC BY (Attribution) | Credit the creator by name; use it for anything, even to make money | A photographer says use my photo anywhere, just tag me |
| CC BY-SA (Share-Alike) | Credit the creator and license your remix under the same license | Wikipedia's text |
| CC BY-NC (Non-Commercial) | Credit the creator but do not sell it or use it to make money | Free for a personal video, not a paid ad |
| CC0 | Nothing; the creator waived every right on purpose | Same freedom as the public domain |

!warn: "Royalty-free" does not mean free to use. It usually means you pay once instead of every time. Read the actual license.

Legit free-to-use sources named in the notes: Unsplash and Pexels (photos), YouTube Audio Library, Wikimedia Commons, the NASA Image Library, Pixabay and Freesound.org."""),
   ("Where teens actually break the rules", """| Scenario | Verdict | Why |
| A trending song used in a public post | Platform-licensed only | TikTok and Instagram pay for a license inside their app; it does not travel when you download and repost elsewhere |
| An image from Google Images in a school poster | Risky habit | Usually fine for a private class assignment; a problem when posted publicly |
| Reposting art with no credit, or claiming it | Infringement | Claiming it as your own adds plagiarism on top |
| Fan art and fan fiction | Technically infringement, usually tolerated | Tolerance disappears fast if someone sells it |
| A movie or show edit with added music and captions | Usually infringement | Music and captions do not automatically make it transformative; many edit accounts stay up only because nobody has reported them |
| AI art "in the style of" a living artist | Unsettled and contested | Many tools were trained on real artists' work without asking, and artists are suing. The U.S. Copyright Office says a fully AI-generated image cannot be copyrighted by anyone |"""),
   ("Plagiarism and copyright are different crimes", """They usually happen together, but they are judged by different people for different reasons.

| | Copyright infringement | Plagiarism |
| What it is | A legal issue between the creator and the person using the work | An ethics and academic issue between you and your school |
| Credit fixes it? | No: it applies even if you fully credit the source | Yes: citing your source solves it |
| Consequence | Takedowns, demonetization or lawsuits | A zero, a discipline referral or worse |

Copying three paragraphs of Wikipedia into an essay with no citation is plagiarism at your school, whether or not Wikipedia's text was free to reuse. If the source was not free to reuse, you could have both problems at once."""),
   ("What happens if you get it wrong", """| Consequence | What it is |
| DMCA takedown | The platform removes your post after a claim, with no lawsuit, sometimes within hours |
| Demonetized or muted | The video stays up but loses ad money, or just the audio is muted |
| Account strikes | Repeated claims can get an account suspended or permanently banned |
| Academic consequences | Plagiarism is a zero and a conduct issue, separate from any copyright claim |
| Legal action | Rare for typical teen use; almost always for large-scale or repeated commercial infringement |

!key: Most creators are not trying to catch you. The takedown, the mute and the zero happen automatically, whether you meant to break the rule or not. Copyright is the deal that lets creators get paid for their work."""),
  ],
  [tbl(["Use", "Factor that matters most", "Verdict"], [
       ["Ten seconds of a game with your own commentary", "1 and 3: transformative and small", "Usually fair use"],
       ["Full song as background music", "3 and 4: all of it, and a stand-in for buying it", "Usually not"],
       ["A parody with your own jokes", "1: transformative", "Usually fair use"],
       ["Almost all of a 20-minute video with a few comments", "3 and 4", "Usually not"],
       ["Quoting two lines of lyrics with credit", "3: tiny amount", "Usually fair use"]])],
  [tbl(["Step", "What happens", "Problem"], [
        ["1", "A student copies three paragraphs of Wikipedia into an essay with no citation", "Plagiarism"],
        ["2", "The student adds a citation", "Plagiarism solved"],
        ["3", "The same text is posted on a public website for money", "Copyright question remains"],
        ["4", "A license check: Wikipedia text is CC BY-SA", "Allowed only with credit and the same license"]]),
   tbl(["Step", "A teen's video", "Result"], [
        ["1", "Uses a trending song inside the app", "Covered by the platform's license in the app"],
        ["2", "Downloads the video and reposts it on another site", "The license does not travel"],
        ["3", "The copyright holder files a DMCA claim", "The post is removed"],
        ["4", "Repeated claims on the same account", "Strikes and a possible ban"]])],
  [("Thinking a copyright symbol is required", "People think unmarked work is free.", "Work is protected the moment it is made."),
   ("Thinking credit makes it legal", "Credit does not remove copyright.", "You need permission, a license or a fair use argument."),
   ("Thinking royalty-free means free", "You may still need a license and have to follow terms.", "Read the license."),
   ("Thinking fair use is a rule you can claim", "It is a test of four factors.", "Weigh all four together."),
   ("Mixing up plagiarism and copyright", "You fix one and think you fixed both.", "Cite for plagiarism, license for copyright.")],
  [], QS(8), title="Copyright and Ethics", kick="Whose work is it, and exactly how to use other people's work without getting it wrong.",
  site="<b>Notes:</b> the Copyright Case File &nbsp;·&nbsp; <b>Walkthrough:</b> 1.7 &nbsp;·&nbsp; <b>Assignment:</b> YouTube creator support &nbsp;·&nbsp; <b>Quiz game:</b> 1.7", noonline=True)

# =============================================================================== 1.8
C18 = L("1.8", "Explain why the same computer skill can be a job or a crime, and sort any situation into authorized, grey area or unauthorized by asking who said yes.",
  [("authorized", "someone with real authority said yes, in writing, before it started"), ("unauthorized", "nobody said yes, whatever the reason"), ("white hat", "hired or invited to find weaknesses, who reports them"), ("grey hat", "breaks in without asking but says they meant well"), ("black hat", "breaks in to steal, damage, spy or make illegal money"),
   ("intent", "what a person meant to do"), ("felony", "a serious crime, with sentences that can run for years"), ("misdemeanor", "a less serious crime, usually a fine or under a year in jail"), ("category", "the level a crime falls into; it changes the penalty")],
  [("One piece of paper", """The same computer skill can be a paid job or a federal crime. The only thing that decides which it is: did somebody with real authority say yes first?

| Same skill | Authorized | Unauthorized |
| Testing a company's website for weaknesses | A signed agreement for two weeks | No agreement |
| Reading someone's account | The owner asks you to help recover it | Guessing a friend's password to look around |

!key: The skill does not make it legal or illegal. Permission does."""),
   ("Every crime has a category", """Almost no crime is one single charge. The law breaks crimes into **categories** based on intent, planning and harm, and the category changes the penalty. Killing someone is not automatically murder. Stealing something is not automatically grand theft.

**Categories of killing**

| Category | Description |
| First-degree murder | Intentional and planned in advance; usually the harshest penalty, up to life in prison |
| Second-degree murder | Intentional but not planned; the intent formed in the moment |
| Voluntary manslaughter | Intentional, in the heat of the moment, after real provocation |
| Involuntary manslaughter | No intent to kill, caused by reckless or seriously careless behavior |

**Categories of stealing**

| Category | Description |
| Petty theft | Taking property below a state's dollar cutoff; a misdemeanor |
| Grand theft | Taking property above that same cutoff; a felony |
| Robbery | Taking property from a person with force or the threat of force; a felony |
| Burglary | Unlawfully entering a building with intent to commit a crime, even if nothing is taken; a felony |

Exact definitions and sentences vary by state. These are the general categories most U.S. legal systems use."""),
   ("Green, amber and red", """Unauthorized computer access works the same way. Three colors sort it.

| Color | Category | Meaning | Example |
| Green | Authorized | Someone said yes, in writing, before anything started: legal hacking, a real job | A company signs papers saying try to break into our app for two weeks |
| Amber | Grey area | Nobody meant harm but nobody officially said yes. Risky, even with a good goal | Finding a real problem by accident and not knowing whether you may mention it |
| Red | Unauthorized | Nobody said yes, whatever the reason. Illegal | Guessing a friend's password just to look around, even if you change nothing |"""),
   ("White hat, grey hat, black hat", """The word hacker does not tell you whether someone broke the law. The color of the hat answers one question: **did they have permission?**

| Hat | Permission | Description | Example |
| White hat | Authorized | Hired or invited to find weak spots. They only look where they are allowed and report what they find | A company pays someone to try to break into its website for two weeks and gets a full report |
| Grey hat | Legally risky | Breaks in without asking but says they meant well | Finding a way into a school website without permission, then emailing to say it can be done |
| Black hat | Unauthorized | Breaks in to steal, damage, spy or make illegal money | Breaking into a store's system to steal credit card numbers |"""),
   ("Why intent barely changes anything", """Here is the part that surprises most people. Why someone did it barely changes anything, legally. A grey hat with good intentions and a black hat with bad intentions can both be charged under the same law, because the law cares whether you had **permission** to be there, not how good your reason sounded.

| Claim | Why it does not help |
| "I only looked" | Looking without permission is still unauthorized access |
| "I meant well" | Intent does not replace permission |
| "I emailed them afterward" | Telling the owner later does not undo entering without asking |
| "Nothing was changed" | Access, not damage, is the line |"""),
   ("What to do instead", """If you find a weakness, there is a safe path.

1. Stop. Do not go further to confirm it.
2. Write down what you saw and how, without exploring more.
3. Find the owner's official way to report problems, such as a security contact or a program that invites researchers.
4. If there is no official way, report it to a teacher or another responsible adult.
5. Do not share the weakness publicly or try it on other sites.

!tip: Real security work is built on the opposite habit from curiosity: ask first, in writing, then test only what you were allowed to test."""),
  ],
  [tbl(["Situation", "Color", "Why"], [
       ["A contractor with a signed agreement tests an app for two weeks", "Green", "Authorized in writing"],
       ["A user stumbles on a real problem by accident and is unsure what to do", "Amber", "No one said yes, but no one meant harm"],
       ["A student guesses a classmate's password just to look", "Red", "No permission"],
       ["A person breaks into a store's system to steal card numbers", "Red", "Black hat: no permission, and a harmful goal"],
       ["A company invites researchers to attack a test server for a week", "Green", "Invited and authorized"],
       ["Someone tests a school site without asking, then emails to say it can be done", "Amber (still unauthorized)", "A grey hat: intent does not give permission"]])],
  [tbl(["Step", "What happens", "Category", "Why"], [
        ["1", "A researcher finds a login page that looks weak", "Nothing yet", "Looking at a public page is not entering"],
        ["2", "They try a password they guessed", "Unauthorized", "They did not have permission to try"],
        ["3", "They email the company to report it", "Still a risk", "Telling afterward does not undo it"],
        ["4", "The company has a program that invites reports", "Authorized path", "Next time, use it before testing"]]),
   tbl(["Pair", "Same skill", "Different category", "Result"], [
        ["Paid tester and black hat", "Breaking into a site", "Authorized and unauthorized", "A job and a crime"],
        ["First and second degree", "A killing", "Planned and unplanned", "Different penalties"],
        ["Petty theft and grand theft", "Taking property", "Below and above a cutoff", "Misdemeanor and felony"]])],
  [("Thinking skill decides legality", "People think only experts are criminals.", "Permission decides it."),
   ("Thinking good intentions protect you", "The law checks permission, not the reason.", "Ask first, in writing."),
   ("Thinking you must change something to be guilty", "Access alone can be unauthorized.", "Do not go in without permission."),
   ("Thinking emailing afterward fixes it", "It does not undo the access.", "Use an official way to report before testing."),
   ("Treating every hacker as the same", "White, grey and black hats differ by permission.", "Ask: did they have permission?")],
  [], QS(9), title="Hacking Ethics", kick="Same skill, different category: one piece of paper decides whether it is a paid job or a felony.",
  site="<b>Notes:</b> the Rules of Engagement briefing &nbsp;·&nbsp; <b>Walkthrough:</b> 1.8 &nbsp;·&nbsp; <b>Assignment:</b> Google security outreach &nbsp;·&nbsp; <b>Quiz game:</b> 1.8", noonline=True)

# =============================================================================== 1.9
C19 = L("1.9", "Explain what HTTPS, CAPTCHA, 2FA and OWASP each do, and inspect a site to say which lock is missing, working or under attack.",
  [("HTTPS", "the secure version of the web protocol; it encrypts your connection"), ("TLS", "the technology that scrambles data in transit for HTTPS"), ("certificate", "proof that you are talking to the real site in the address bar"), ("CAPTCHA", "a test to tell computers and humans apart"), ("bot", "an automated program"),
   ("2FA", "two-factor authentication: two different kinds of proof"), ("SIM-swapping", "tricking a carrier into moving your number to an attacker's phone"), ("OWASP", "Open Web Application Security Project, the group that lists the most common website flaws"), ("injection", "a site obeys a trick command typed into a box")],
  [("Four locks on every website", """Think of every website as a building with strangers walking up all day. Four things stand between them and whatever is inside.

| Lock | Job | Building picture |
| HTTPS | Scrambles what you send so nobody along the way can read it | The lock on the connection |
| CAPTCHA | Checks that whoever is knocking is a person, not a program | The doorman |
| 2FA | A second proof, so a stolen key is not enough | The second deadbolt |
| OWASP | A list of the ways buildings like this usually fail | The building code |

!key: None of these locks were built to stop a person. They were built to stop everything else. And none of them covers for the other three."""),
   ("HTTPS: the lock on the connection", """Plain HTTP, with no S, sends everything you type, such as your password, your messages and your searches, as plain readable text, like writing on a postcard. Anyone else on the same network can read it as it travels. HTTPS is the same thing locked in a sealed envelope first.

| What the padlock checks | What it does |
| Encryption (using TLS) | Scrambles your data so it is unreadable to anyone spying in transit, even on the same public Wi-Fi |
| Certificate identity | Confirms you are talking to the real website in the address bar, not a fake server pretending to be it |

| Address | What a snooper on the same Wi-Fi sees |
| `http://coolgame-freebies.net/login` (Not Secure) | `username=jayden22&password=Fluffy123` in plain text |
| `https://coolgame-freebies.net/login` (Secure) | A string of scrambled characters |

!warn: **The padlock is not a "trust me" badge.** HTTPS only proves nobody in the middle can read your connection. It says nothing about whether the site is honest. A scammer can build a perfect copy of your bank's login page at a look-alike address, and it can have a valid padlock too."""),
   ("CAPTCHA: the doorman", """CAPTCHA stands for **Completely Automated Public Turing test to tell Computers and Humans Apart**. Its entire job is to slow down computer programs pretending to be a person.

| What bots can do that a human cannot | Example |
| Credential stuffing | Try millions of stolen username and password pairs in minutes |
| Ticket and sneaker bots | Buy out a whole concert or sneaker drop in the first second |
| Spam and fake reviews | Flood comment sections and review pages faster than any moderator can read |

**Five kinds of CAPTCHA**

| Kind | How it works |
| Distorted text | Type the wavy, stretched letters and numbers exactly as shown; the oldest kind |
| Image grid | Click every square with a traffic light or crosswalk; bots are still bad at messy real photos |
| Checkbox (I am not a robot) | One click, while it quietly watches how your mouse moved |
| Invisible | No visible test; it scores your behavior and only tests you if something looks suspicious |
| Slider or puzzle piece | Drag a piece into the missing spot with a smooth, human-like motion |

Most sites also have an audio version for people who cannot see well."""),
   ("2FA: the second deadbolt", """People who study security sort every way of proving this is really you into three **factors**. Two-factor authentication (2FA) means using two of them together, so a leaked password alone is not enough.

| Factor | Example | Note |
| Something you know | Password or PIN | The weakest factor on its own: it can be guessed, leaked or phished |
| Something you have | Phone or security key | An attacker would also have to steal it |
| Something you are | Fingerprint or face | Tied to your body; you cannot memorize or hand it off |

**Five examples, from weakest to strongest**

| Rank | Type | Note |
| 1 (weakest) | SMS text code | Can be stolen through SIM-swapping |
| 2 | Email verification code | If your email password is weak or reused it adds almost nothing |
| 3 | Authenticator app | Makes a rotating code on your device, with no text for an attacker to intercept |
| 4 | Push notification approval | Fast, but do not approve one you do not recognize |
| 5 (strongest) | Security key, fingerprint or Face ID | Extremely hard to steal remotely |

Two people have their passwords leaked in the same breach. One has only a password and the attacker logs in. The other uses an authenticator app, and the attacker is stuck because they do not have that person's phone."""),
   ("OWASP: the building code", """**OWASP** stands for Open Web Application Security Project: a group of computer safety experts who write down the most common mistakes that get websites hacked and hand the list to anyone building a site. If burglars kept breaking into houses the same three ways, a home inspector would write those ways down for every builder. OWASP does that for websites. It is not a company and not the government.

The most famous list is the **OWASP Top 10**, the ten biggest, most common mistakes, ranked.

| Rank | Flaw | What it means |
| #1 | Broken access control | A user can see or change things they were never allowed to touch, often by changing one number in a web address |
| #3 | Injection | A site asks for something normal, like a name, but never checks it, so a trick phrase gets obeyed like a command |

**Example (broken access control).** Your grades live at school.com/grades/1042, where 1042 is your student ID. If the site never checks whose grades you are allowed to see, typing 1043 shows another student's grades. The course demo shows this: with the check off you see someone else's record, and with the check on the site answers with error 403.

**Example (injection).** A website is like a genie that grants whatever you type in a box. A safe site always checks what you typed first, instead of obeying it."""),
   ("Inspect the building", """Six example sites. Decide which lock is missing, working or under attack.

| Site | What you see | Finding |
| A | A shopping site with http:// asking for a credit card number | No HTTPS: the card number travels as readable text |
| B | A login page that allows ten thousand password guesses in one second | No bot protection: a CAPTCHA or a speed limit would stop it |
| C | A leaked password cannot log in because the account also asks for a phone code | 2FA working as designed |
| D | A search box that runs raw commands | Injection, an OWASP flaw |
| E | A text asking you to confirm a 2FA code for a login you never made | A live attack: someone has the password and wants the second lock |
| F | A padlock and https://, but the address is a near-perfect misspelling of a real bank | HTTPS is present but the site is fake |

!key: Four locks, four different jobs. A website can pass three inspections perfectly and still fail badly on the fourth."""),
  ],
  [tbl(["Problem", "Lock", "Why"], [
       ["A fake bank page with a padlock", "HTTPS (it protects only the connection)", "The padlock does not prove the site is honest"],
       ["Ten thousand guesses a second on a login page", "CAPTCHA or a speed limit", "Stops bots"],
       ["A stolen password that cannot log in", "2FA", "The attacker lacks the second factor"],
       ["A student changes a number in the address and sees another record", "OWASP: broken access control", "The site did not check who was asking"],
       ["A box that obeys any command typed in", "OWASP: injection", "The site did not check what was typed"]])],
  [tbl(["Step", "What happens", "Lock", "Result"], [
        ["1", "A fan opens a ticket site on public Wi-Fi", "HTTPS", "The connection is scrambled; the snooper sees junk"],
        ["2", "A bot tries to buy 5,000 tickets in a second", "CAPTCHA", "The doorman slows the bot"],
        ["3", "A scammer logs in with a leaked password", "2FA", "The scammer needs the phone code too"],
        ["4", "A fan changes the order number in the address", "OWASP", "Broken access control: the site must check who is asking"]]),
   tbl(["2FA type", "How an attacker gets around it", "Strength"], [
        ["SMS code", "SIM-swapping: move the phone number to their phone", "Weakest"],
        ["Email code", "Takes over a weak or reused email password", "Weak"],
        ["Authenticator app", "Needs the device itself", "Better"],
        ["Push approval", "Tricks you into approving one you do not recognize", "Better"],
        ["Security key or fingerprint", "Has to steal the physical key or your body", "Strongest"]])],
  [("Believing the padlock means the site is safe", "A fake site can have a valid padlock.", "Check the address, then decide if the site is honest."),
   ("Thinking a CAPTCHA protects data", "It only slows bots.", "It is one lock of four."),
   ("Using SMS as the only second factor", "SIM-swapping can steal it.", "Use an authenticator app or a security key."),
   ("Thinking OWASP is a company", "It is a group that publishes a list.", "Build against the list."),
   ("Thinking one lock covers the rest", "Each lock has a different job.", "Check all four.")],
  [], QS(10), title="Common Security Problems", kick="Four locks on every website, four different jobs, and how to tell which one is missing.",
  site="<b>Notes:</b> The Front Door &nbsp;·&nbsp; <b>Walkthrough:</b> 1.9 &nbsp;·&nbsp; <b>Assignment:</b> Ticketmaster inspection &nbsp;·&nbsp; <b>Quiz game:</b> 1.9", noonline=True)
