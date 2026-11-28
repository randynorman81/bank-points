// Lesson 1.7: Copyright and Ethics.  Notes: ist/unit-1/copyright-case-file.html (cases 01-06)
const NOTES = { label: "Open the 1.7 case file", href: "../unit-1/copyright-case-file.html" };
export default {
  id: "1.7", title: "Copyright and Ethics",
  w: {
    pts: 50,
    intro: "You will go through the Copyright Case File one case at a time. Every step names the case to open, then asks questions that only someone who read it can answer. You need 100% to open the assignment, and you can check as many times as you like.",
    steps: [
      { h: "Case 01: What copyright covers", links: [NOTES],
        read: "<p>Open the case file and read the top of the page and <b>Case 01: What copyright actually covers</b>.</p>",
        items: [
          { t: "mc", q: "When does your work become protected by copyright?", c: "The moment you make it, with no paperwork or fee", w: ["After you register it with a government office", "After you put the copyright symbol on it", "After one year of public use of the work"], hint: "First paragraph of Case 01." },
          { t: "multi", q: "Which of these does the notes say are NOT protected by copyright?", c: ["Facts such as the sky is blue", "An idea alone, like a story idea about a superhero", "Titles, names or short phrases"], w: ["A photo you took", "Code you wrote for a game"], hint: "Use the Not protected list." },
          { t: "mc", q: "What exactly does copyright protect?", c: "The exact words, notes or pixels, not the idea behind them", w: ["The idea behind your work, in any form that it takes", "Any other work that is about the same general subject", "Only work that has already been sold to the public"], hint: "The paragraph that begins \"Here's the part that trips people up.\"" },
          { t: "match", q: "Match each exclusive right to what it means.", pairs: [["Copy it", "Make more copies"], ["Share it", "Distribute or post it"], ["Display it", "Show it publicly"], ["Perform it", "Play or perform it out loud"], ["Remix it", "Change it into something new (a derivative work)"]], hint: "The five cards at the end of Case 01." }
        ] },
      { h: "Case 02: The fair use test", links: [NOTES],
        read: "<p>Read <b>Case 02: The fair use test</b>, the four factors and the table of real posts.</p>",
        items: [
          { t: "match", q: "Match each fair use factor to the question it asks.", pairs: [["Factor 1", "Why are you using it? Is it transformative?"], ["Factor 2", "What kind of work is it, factual or creative?"], ["Factor 3", "How much of the work did you use?"], ["Factor 4", "Does your use hurt sales of the original?"]], hint: "The four numbered boxes." },
          { t: "mc", q: "Which factor does the notes say courts and platforms weigh the heaviest?", c: "Factor 4: does it hurt sales", w: ["Factor 1: why you are using it", "Factor 2: what kind of work it is", "Factor 3: how much you used"], hint: "The last sentence of Factor 4." },
          { t: "mc", q: "How does the notes rate a movie reaction video that plays almost an entire 20-minute video?", c: "Usually not fair use", w: ["Usually fair use", "Always fair use", "Public domain"], hint: "See the table of real posts." },
          { t: "mc", q: "Which is usually fair use, according to the table?", c: "A review with a few short clips and your own analysis", w: ["A full song used as background music, completely unedited", "Posting someone else's whole video and calling it your own", "Reposting an artist's picture online without giving any credit"], hint: "Look for the rows marked Usually fair use." }
        ] },
      { h: "Case 03: Public domain and Creative Commons", links: [NOTES],
        read: "<p>Read <b>Case 03: Public domain and Creative Commons</b>, including the four license cards.</p>",
        items: [
          { t: "mc", q: "Why can you use any NASA image for free?", c: "U.S. federal government work is public domain", w: ["NASA owns every image but promises it never sues anyone", "All images taken in outer space are public domain", "NASA images all use the CC BY-NC license"], hint: "Second part of the first paragraph of Case 03." },
          { t: "match", q: "Match each Creative Commons license to what it requires.", pairs: [["CC BY", "Credit the creator by name"], ["CC BY-SA", "Credit the creator and share your remix under the same license"], ["CC BY-NC", "Credit the creator and do not use it to make money"], ["CC0", "The creator gives up every right; use it however you want"]], hint: "The four license cards." },
          { t: "mc", q: "What does \"royalty-free\" usually mean, according to the notes?", c: "You pay once instead of paying every time", w: ["The work is free to use for anything", "The work is in the public domain", "The creator cannot ever be paid"], hint: "The paragraph that starts \"Watch out for this trap.\"" },
          { t: "mc", q: "Which of these is a legit free-to-use source named in the notes?", c: "Wikimedia Commons", w: ["Google Images", "A random fan page", "A friend's camera roll"], hint: "The list of legit free-to-use sources." }
        ] },
      { h: "Cases 04 to 06: Mistakes, plagiarism and consequences", links: [NOTES],
        read: "<p>Read <b>Case 04: Where teens actually break the rules</b>, <b>Case 05: Plagiarism vs. copyright</b> and <b>Case 06: What happens if you get it wrong</b>.</p>",
        items: [
          { t: "mc", q: "A teen posts a video with a trending song from TikTok. They then download the video and repost it elsewhere. Why is the music no longer covered?", c: "The platform's license does not travel with the video", w: ["Music licenses on every app expire after exactly one day", "Songs are in the public domain on all other sites", "The teen must pay the platform a fee to reuse the song"], hint: "Scenario: social video." },
          { t: "mc", q: "How does the notes rate fan art and fan fiction?", c: "Technically infringement, but usually tolerated until it is sold", w: ["Always fully legal, because it is covered by fair use", "Never tolerated by any creator or any studio at all", "Public domain automatically after exactly one full year"], hint: "Scenario: fan art and fan fiction." },
          { t: "mc", q: "What does the U.S. Copyright Office say about a fully AI-generated image?", c: "It cannot be copyrighted by anyone", w: ["It belongs to the person who typed the prompt", "It belongs to the company that made the tool", "It is protected for 95 years"], hint: "Scenario: AI-generated art." },
          { t: "match", q: "Match each problem to what solves it.", pairs: [["Plagiarism", "Citing your source"], ["Copyright infringement", "Permission, a license, or a fair use argument"], ["Takedown on a platform", "The copyright holder files a DMCA claim"]], hint: "Case 05 and the first card of Case 06." },
          { t: "write", q: "In your own words, explain why citing a source stops plagiarism but does not stop copyright infringement. (2 to 3 sentences)", min: 25, kw: [["plagiar", "school", "ethics", "academic", "cite", "citing"], ["copyright", "infring", "legal", "owner", "creator", "permission", "license"], ["different", "separate", "two", "both", "still"]], need: 3, hint: "Plagiarism is between you and your school. Copyright is between the creator and the person using their work." }
        ] }
    ]
  },
  a: {
    pts: 100, company: "YouTube", color: "#FF0000",
    tagline: "You are a creator-support intern. Your team helps young creators avoid takedowns, mutes and strikes.",
    from: "Marcus Bell, Creator Support Lead", subject: "Four creator questions for this week's help article",
    email: "<p>Hi, I am writing a short help article for teen creators. Each question below came from a real kind of post. I need you to give the right answer so the article is accurate.</p><p>This is a classroom simulation, so the posts are made up.</p>",
    steps: [
      { h: "Fair use check",
        read: "<p>Use the four factors: why you used it, what kind of work it is, how much you used, and whether it hurts sales.</p>",
        items: [
          { t: "match", q: "Match each post to the likely verdict from the notes.", pairs: [["A short parody over a few clips with your own jokes", "Usually fair use"], ["Almost an entire 20-minute video with a few comments", "Usually not fair use"], ["A cropped movie screenshot with a joke caption", "A grey area, usually tolerated"]], why: "Transformative uses with small pieces are the safest. Copying nearly all of a work, or the whole song, is the least safe." },
          { t: "mc", q: "A creator uses a full song, unedited, as background music in a public video. Which factor hurts them most?", c: "Factor 3, because they used the whole thing", w: ["Factor 2, because songs are always facts", "Factor 1, because music is never transformative", "None, because the song is popular"], why: "Using the whole track is the opposite of a short clip, and it can be a stand-in for buying the song." }
        ] },
      { h: "Which license?",
        read: "<p>Marcus has four photos that creators want to reuse.</p>",
        items: [
          { t: "match", q: "Match each situation to the right license or status.", pairs: [["A photo you may use if you credit the photographer, even for a paid ad", "CC BY"], ["A photo free for a school video but not for a paid ad", "CC BY-NC"], ["A photo made by a NASA employee as part of their job", "Public domain (U.S. government work)"], ["A photo the creator waived every right on, on purpose", "CC0"]], why: "NC means non-commercial. CC0 and public domain need no permission. CC BY needs credit." },
          { t: "mc", q: "A stock site says \"royalty-free.\" What should a creator do?", c: "Read the actual license, because royalty-free is not free", w: ["Use it anywhere at all with no limits on it", "Assume that it is in the public domain already", "Credit the site and then ignore the license terms"], why: "Royalty-free usually means you pay once instead of every time." }
        ] },
      { h: "Plagiarism or copyright?",
        read: "<p>One help-article section explains the difference. Marcus wants the cases sorted.</p>",
        items: [
          { t: "match", q: "Match each case to the problem it creates.", pairs: [["A student copies three paragraphs of a Wikipedia article into an essay without a citation", "Plagiarism at school"], ["A creator reposts another artist's work with a credit but no permission", "Copyright infringement"], ["A creator reposts another artist's work and says it is theirs", "Both problems at once"]], why: "Citing a source solves plagiarism but not copyright. Claiming someone else's work is both." },
          { t: "multi", q: "Which are real consequences a platform can apply to a creator who gets copyright wrong?", c: ["A DMCA takedown of the post", "Demonetization or a muted audio track", "Account strikes and a possible ban"], w: ["The platform sends a bill to the creator's school", "The platform deletes the creator's family photos"], why: "These happen automatically, even when the creator did not mean to break a rule." }
        ] },
      { h: "Write the answer",
        read: "<p>Marcus needs a short answer to publish (three or four sentences).</p>",
        items: [
          { t: "write", q: "A teen asks: \"Can I use a clip of my favorite show in my video?\" Answer using at least two fair use factors, and mention one safer option.", min: 45, kw: [["fair use", "factor", "transform", "how much", "short", "sales", "kind of work"], ["clip", "show", "movie", "video", "episode"], ["license", "creative commons", "public domain", "permission", "ask", "cc", "free to use", "original"]], need: 3, why: "A strong answer weighs at least two factors and offers a safer path such as permission or CC-licensed material." }
        ] }
    ]
  }
};
