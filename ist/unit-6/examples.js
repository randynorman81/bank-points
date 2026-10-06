/* "See an example" pictures for the Web Editor: for each assignment, a rendered sample page (never the code).
   U7_EXAMPLES["6.2"] = { variants: [ { name, html }, ... ] }  -- html is a full page shown in a sandboxed iframe.
   Lessons whose assignment has several themes get several variants (the editor shows a dropdown). */
(function (root) {
  var E = root.U7_EXAMPLES = root.U7_EXAMPLES || {};

  function doc(css, body, head) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + (head || "") + "<style>" + css + "</style></head><body>" + body + "</body></html>";
  }
  function svg(s) { return "data:image/svg+xml," + encodeURIComponent(s); }
  function face(bg, skin, extra, w) {
    return svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140"><rect width="120" height="140" fill="' + bg + '"/>' + extra + '<circle cx="60" cy="68" r="34" fill="' + skin + '"/><circle cx="48" cy="62" r="5" fill="#222"/><circle cx="72" cy="62" r="5" fill="#222"/><path d="M44 82 Q60 ' + (w || 94) + ' 76 82" stroke="#222" stroke-width="4" fill="none"/></svg>');
  }
  function scene(a, b, shape) {
    return svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="300" height="180" fill="url(#g)"/>' + shape + "</svg>");
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  /* ---------- 6.1 first website: plain, text-heavy ---------- */
  function plainPage(d) {
    var b = "<h1>" + d.title + "</h1><p><i>" + d.by + "</i></p><p>" + d.intro + "</p>";
    d.secs.forEach(function (s) { b += "<h2>" + s[0] + "</h2><p>" + s[1] + "</p>"; });
    b += "<hr><h2>Quick facts</h2><ul>" + d.facts.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul>";
    return doc("body{margin:14px 20px;font-family:'Times New Roman',serif;line-height:1.4}", b);
  }
  E["6.1"] = { variants: [
    { name: "Octopuses (an animal)", html: plainPage({ title: "All About Octopuses", by: "by a student writer", intro: "Octopuses are some of the smartest animals in the ocean. They have no bones, three hearts, and arms that can taste.", secs: [["Where they live", "Most octopuses live on the sea floor near rocky coasts and coral reefs. Some live in the deep sea."], ["How they hide", "They can change color and texture in less than a second to look like rocks, sand, or seaweed."]], facts: ["Three hearts", "Blue blood", "Eight arms"] }) },
    { name: "Basketball (a sport)", html: plainPage({ title: "How Basketball Works", by: "by a student writer", intro: "Basketball is a fast game where two teams try to score by throwing a ball through a hoop.", secs: [["The basic rules", "Players dribble the ball while they move. A shot from inside the arc is worth two points and from outside is worth three."], ["The positions", "Teams usually play five at a time: point guard, shooting guard, small forward, power forward, and center."]], facts: ["Invented in 1891", "Five players per team", "Hoop is 10 feet high"] }) },
    { name: "Minecraft (a video game)", html: plainPage({ title: "A Beginner's Guide to Minecraft", by: "by a student writer", intro: "Minecraft is a game where you gather blocks, build shelters, and survive the night.", secs: [["Your first day", "Punch a tree to get wood, make a crafting table, and build a few simple tools before the sun goes down."], ["Staying safe", "Monsters spawn in the dark, so build a small shelter or light up the area with torches."]], facts: ["Made of cubes", "Survival and Creative modes", "Released in 2011"] }) }
  ] };

  /* ---------- 6.2 epic poster ---------- */
  function poster(d) {
    var b = '<div style="text-align:center;padding:30px 10px"><p style="font-size:14px;letter-spacing:6px;color:' + d.c3 + '">' + d.pre + '</p><h1 style="font-size:54px;margin:8px 0;color:' + d.c1 + ";font-family:" + d.font + '">' + d.name + '</h1><h2 style="font-style:italic;color:' + d.c2 + ';font-weight:normal">' + d.tag + '</h2><p style="font-size:22px;color:#fff">Starting <span style="color:' + d.c1 + '">' + d.when + '</span><br>at <b style="color:' + d.c2 + '">' + d.where + '</b></p><p style="font-size:13px;color:' + d.c3 + '">' + d.fine + "</p></div>";
    return doc("body{margin:0;background:" + d.bg + ";font-family:Arial,sans-serif}", b);
  }
  E["6.2"] = { variants: [
    { name: "Band world tour", html: poster({ bg: "#120a2a", c1: "#ff3df2", c2: "#34e0ff", c3: "#a89bd8", font: "Impact,Arial", pre: "LIVE IN CONCERT", name: "NEON ECHO", tag: "The World Tour 2027", when: "March 3", where: "Madison Square Garden", fine: "Tickets on sale now. All ages." }) },
    { name: "Movie premiere", html: poster({ bg: "#0b0b0b", c1: "#ffd23f", c2: "#ff6b3d", c3: "#9aa0a6", font: "Georgia,serif", pre: "ONE NIGHT ONLY", name: "THE LAST LIGHTHOUSE", tag: "Some stories refuse to go dark", when: "Friday at 8 pm", where: "Grand Theater", fine: "Rated PG-13. Red carpet at 7." }) },
    { name: "Esports tournament", html: poster({ bg: "#06161f", c1: "#39ff88", c2: "#00c2ff", c3: "#7aa3b3", font: "Verdana,sans-serif", pre: "SEASON FINALS", name: "COBRA CUP", tag: "Sixteen teams. One champion.", when: "Saturday, 1 pm", where: "SCHS Gym", fine: "Free to watch. Prizes for the winners." }) },
    { name: "Made-up holiday", html: poster({ bg: "#fff4d6", c1: "#e8590c", c2: "#7048e8", c3: "#8a6d3b", font: "'Comic Sans MS',cursive", pre: "MARK YOUR CALENDAR", name: "NATIONAL NAP DAY", tag: "Rest is a human right", when: "the first Monday of spring", where: "every couch on earth", fine: "Pillows provided. No alarms." }) }
  ] };

  /* ---------- 6.3 restaurant menu ---------- */
  function menu(d) {
    var b = '<div class="w"><h1>' + d.name + "</h1><p class='t'><i>" + d.tag + "</i></p><hr>";
    d.secs.forEach(function (s) {
      b += "<h2>" + s[0] + "</h2>";
      s[1].forEach(function (i) { b += "<p><b><span class='n'>" + i[0] + "</span></b> &mdash; " + i[1] + "<br><i class='d'>" + i[2] + "</i></p>"; });
    });
    return doc("body{margin:0;background:" + d.bg + ";font-family:" + d.font + ";color:" + d.ink + "}.w{max-width:560px;margin:0 auto;padding:18px}h1{text-align:center;color:" + d.acc + ";font-size:38px;margin:6px 0}.t{text-align:center}h2{color:" + d.acc + ";border-bottom:2px solid " + d.acc + "}.n{color:" + d.acc + "}.d{font-size:13px}", b + "</div>");
  }
  E["6.3"] = { variants: [
    { name: "Taco truck", html: menu({ bg: "#fff6e0", ink: "#2b2118", acc: "#d9480f", font: "Verdana,sans-serif", name: "El Camino Tacos", tag: "Fresh off the truck since 2020", secs: [["Tacos", [["Carne Asada", "$4", "grilled steak, onion, cilantro"], ["Baja Fish", "$5", "crispy fish, cabbage, lime crema"]]], ["Sides", [["Chips and Salsa", "$3", "made every morning"], ["Street Corn", "$4", "chili, cheese, lime"]]]] }) },
    { name: "Bakery", html: menu({ bg: "#fff0f5", ink: "#4a2c3a", acc: "#c2185b", font: "Georgia,serif", name: "Sugar & Rise Bakery", tag: "Baked before the sun comes up", secs: [["Breads", [["Honey Oat Loaf", "$6", "soft, sweet, great toasted"], ["Garlic Knots", "$4", "a half dozen, still warm"]]], ["Sweets", [["Cinnamon Roll", "$4", "gooey, with cream cheese icing"], ["Lemon Tart", "$5", "bright and a little sour"]]]] }) },
    { name: "Cafe in space", html: menu({ bg: "#0e1230", ink: "#d9defa", acc: "#7ee8ff", font: "'Courier New',monospace", name: "The Orbit Cafe", tag: "Zero gravity. Maximum flavor.", secs: [["Drinks", [["Comet Cold Brew", "12 credits", "chilled in the ice rings of Saturn"], ["Nebula Latte", "10 credits", "swirled with purple vanilla"]]], ["Bites", [["Moon Cheese Toast", "9 credits", "aged 4 billion years"], ["Asteroid Cookies", "7 credits", "crunchy, chocolate chunks"]]]] }) }
  ] };

  /* ---------- 6.4 wanted poster (borders) ---------- */
  function wanted(d) {
    var b = '<div class="o"><div class="i"><h1>WANTED</h1><h2>' + d.name + '</h2><p><i>a.k.a.</i> <b><span class="r">' + d.alias + '</span></b></p><hr><h3>Crimes</h3><ul>' + d.crimes.map(function (c) { return "<li>" + c + "</li>"; }).join("") + '</ul><p class="rw">REWARD: <span class="r">' + d.reward + "</span></p><p class='f'>" + d.fine + "</p></div></div>";
    return doc("body{margin:0;background:" + d.bg + ";font-family:'Courier New',monospace}.o{margin:16px auto;max-width:480px;border:8px double " + d.line + ";padding:10px;background:" + d.paper + "}.i{border:3px dashed " + d.line + ";padding:8px 18px;text-align:center}h1{font-size:60px;margin:6px 0;color:" + d.line + ";font-family:Impact,Arial}h2{margin:4px 0;font-size:26px}ul{text-align:left;display:inline-block;margin:0}.r{color:" + d.red + "}.rw{font-size:22px;font-weight:bold;border:3px solid " + d.line + ";padding:6px}.f{font-size:12px}", b);
  }
  E["6.4"] = { variants: [
    { name: "A villain", html: wanted({ bg: "#3b2a1a", paper: "#f3e2b3", line: "#5b3a14", red: "#b3261e", name: "Dr. Gloom", alias: "The Shadow of Main Street", crimes: ["Stealing every clock in town", "Cackling in a library", "Escaping in a purple van"], reward: "$5,000", fine: "Approach with caution. Do not make eye contact." }) },
    { name: "A pet that stole the snacks", html: wanted({ bg: "#2d3a2d", paper: "#fdf1d0", line: "#7a4b12", red: "#c2410c", name: "Biscuit", alias: "The Pantry Bandit", crimes: ["Stealing a whole bag of chips", "Hiding crumbs under the couch", "Looking innocent"], reward: "One belly rub", fine: "Last seen next to the empty snack drawer." }) },
    { name: "A made-up criminal", html: wanted({ bg: "#1b1f3a", paper: "#e8e4ff", line: "#4b3bb0", red: "#d6249f", name: "Zorp the Cookie Thief", alias: "Captain Crumb", crimes: ["Beaming up 40 cookies from Earth", "Leaving glitter on the scene", "Speaking only in beeps"], reward: "500 space credits", fine: "Armed with a very large spoon." }) }
  ] };

  /* ---------- 6.5 ultimate guide page ---------- */
  function guide(d) {
    var b = '<div class="bn"><h1>' + d.title + '</h1></div><ul class="bar">' + d.bar.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul><div class='w'>";
    d.secs.forEach(function (s) {
      b += "<h2>" + s[0] + "</h2><h3>Top 3</h3><ol>" + s[1].map(function (x) { return "<li><b>" + x + "</b></li>"; }).join("") + "</ol><h3>Tips</h3><ul>" + s[2].map(function (x) { return "<li><i>" + x + "</i></li>"; }).join("") + "</ul>";
    });
    b += "</div><p class='ft'>" + d.foot + "</p>";
    return doc("body{margin:0;font-family:Arial,sans-serif;background:" + d.bg + ";color:#222}.bn{background:" + d.acc + ";color:#fff;padding:12px;text-align:center}.bn h1{margin:0;font-size:30px}.bar{list-style:none;margin:0;padding:8px;background:" + d.dark + ";text-align:center}.bar li{display:inline-block;color:#fff;margin:0 12px;font-weight:bold}.w{padding:4px 20px 10px}h2{border-bottom:3px solid " + d.acc + "}.ft{background:" + d.dark + ";color:#fff;text-align:center;padding:10px;margin:0;font-size:13px}", b);
  }
  E["6.5"] = { variants: [
    { name: "A game guide", html: guide({ bg: "#f4fbf4", acc: "#2e9e4f", dark: "#1b3b24", title: "The Ultimate Minecraft Survival Guide", bar: ["Home", "Day One", "Mining", "Build"], secs: [["Day One", ["Punch a tree", "Craft a table", "Build a shelter"], ["Never dig straight down", "Keep a bed nearby"]], ["Mining", ["Get iron first", "Find diamonds near lava level", "Always carry torches"], ["Mine in a staircase", "Listen for lava"]]], foot: "Guide by a student. Last updated this week." }) },
    { name: "A team guide", html: guide({ bg: "#fff8f0", acc: "#e8590c", dark: "#2a1608", title: "Wildcats Football: Fan Guide", bar: ["Home", "Schedule", "Players", "Snacks"], secs: [["Game Day", ["Wear the school colors", "Get there early", "Sit in the student section"], ["Bring a jacket", "Cheer loud, stay polite"]], ["Best Players", ["The quarterback", "The kicker with the golden leg", "The linebacker nobody can block"], ["Watch the second half", "Learn the fight song"]]], foot: "Go Wildcats! Made by a proud fan." }) },
    { name: "A road trip guide", html: guide({ bg: "#eef7ff", acc: "#1c7ed6", dark: "#0b2540", title: "The Ultimate Road Trip Guide", bar: ["Home", "Pack", "Stops", "Snacks"], secs: [["What to Pack", ["Phone charger", "A real map", "A playlist everyone agrees on"], ["Pack light", "Keep snacks in reach"]], ["Best Stops", ["Roadside diner", "Scenic overlook", "The giant ball of twine"], ["Stop every two hours", "Take pictures at every sign"]]], foot: "Buckle up! Made with an open mind." }) }
  ] };

  /* ---------- 6.6 link hub ---------- */
  function hub(d) {
    var b = "<h1>" + d.name + "</h1><p>" + d.tag + "</p><hr><h2>" + d.h1 + "</h2><h3>Opens in a new tab</h3><ul>" + d.a.map(function (x) { return "<li><a href='#'><b>" + x[0] + "</b></a> - <i>" + x[1] + "</i></li>"; }).join("") + "</ul><hr><h2>" + d.h2 + "</h2><h3>Opens in this tab</h3><ol>" + d.b.map(function (x) { return "<li><a href='#'><b>" + x[0] + "</b></a> - <i>" + x[1] + "</i></li>"; }).join("") + "</ol><p style='font-size:13px;color:#666'>" + d.foot + "</p>";
    return doc("body{margin:14px 20px;font-family:Arial,sans-serif;line-height:1.5}h1{color:" + d.c + "}", b);
  }
  E["6.6"] = { variants: [
    { name: "Games", html: hub({ c: "#7048e8", name: "The Game Vault", tag: "My favorite places to play, learn, and watch.", h1: "Play", h2: "Learn", a: [["Poki", "free browser games"], ["Scratch", "build your own game"], ["Itch.io", "tiny indie games"]], b: [["Khan Academy", "free practice"], ["Code.org", "start coding"], ["CodeHS", "our class site"]], foot: "Made in the Web Editor by a student." }) },
    { name: "Careers", html: hub({ c: "#0b7285", name: "Career Compass", tag: "Real sites for exploring jobs I might want.", h1: "Explore", h2: "Prepare", a: [["Bureau of Labor Statistics", "pay and growth"], ["CareerOneStop", "job quizzes"], ["O*NET", "what each job is like"]], b: [["Khan Academy", "test prep"], ["Indeed", "see real openings"], ["LinkedIn", "build a profile"]], foot: "Made in the Web Editor by a student." }) },
    { name: "Music", html: hub({ c: "#c2255c", name: "Sound Check", tag: "The best sites for finding and making music.", h1: "Listen", h2: "Make", a: [["Spotify", "streaming"], ["Bandcamp", "support small artists"], ["NPR Tiny Desk", "live sessions"]], b: [["Soundtrap", "record in your browser"], ["Chrome Music Lab", "play with sound"], ["Ultimate Guitar", "chords and tabs"]], foot: "Made in the Web Editor by a student." }) }
  ] };

  /* ---------- 6.7 wanted poster with pictures ---------- */
  function picPoster(d) {
    var b = '<div class="o"><h1>WANTED</h1><a href="#"><img src="' + d.main + '" width="170" alt=""></a><h2>' + d.name + "</h2><p>" + d.line + '</p><p><b>Also seen:</b></p><a href="#"><img src="' + d.s1 + '" width="80" alt=""></a> <a href="#"><img src="' + d.s2 + '" width="80" alt=""></a><p class="rw">REWARD: ' + d.reward + "</p></div>";
    return doc("body{margin:0;background:" + d.bg + ";font-family:'Courier New',monospace}.o{margin:14px auto;max-width:420px;border:6px solid " + d.line + ";padding:8px 16px;background:" + d.paper + ";text-align:center}h1{font-size:54px;margin:4px;color:" + d.line + ";font-family:Impact,Arial}img{border:3px solid " + d.line + "}h2{margin:6px 0}.rw{font-size:20px;font-weight:bold}", b);
  }
  E["6.7"] = { variants: [
    { name: "A villain", html: picPoster({ bg: "#3b2a1a", paper: "#f3e2b3", line: "#5b3a14", main: face("#8d6e63", "#f1c27d", '<path d="M20 40 L60 10 L100 40 Z" fill="#333"/>', 90), s1: face("#a1887f", "#e0ac69", "", 92), s2: face("#6d4c41", "#f1c27d", "", 90), name: "Dr. Gloom", line: "Wanted for stealing every clock in town.", reward: "$5,000" }) },
    { name: "A pet", html: picPoster({ bg: "#2d3a2d", paper: "#fdf1d0", line: "#7a4b12", main: face("#c8e6c9", "#ffcc80", '<polygon points="30,50 40,10 55,40" fill="#ffcc80"/><polygon points="90,50 80,10 65,40" fill="#ffcc80"/>', 96), s1: face("#dcedc8", "#ffe0b2", "", 96), s2: face("#f0f4c3", "#ffcc80", "", 94), name: "Biscuit", line: "Wanted for stealing the snack drawer.", reward: "A belly rub" }) },
    { name: "A made-up alien", html: picPoster({ bg: "#1b1f3a", paper: "#e8e4ff", line: "#4b3bb0", main: face("#4b3bb0", "#7ee0a0", '<circle cx="40" cy="34" r="5" fill="#7ee0a0"/><circle cx="80" cy="34" r="5" fill="#7ee0a0"/>', 90), s1: face("#5f3dc4", "#a5f3c0", "", 90), s2: face("#3b5bdb", "#7ee0a0", "", 92), name: "Zorp", line: "Wanted for beaming up 40 cookies.", reward: "500 space credits" }) }
  ] };

  /* ---------- 7.1 postcards (box model) ---------- */
  function postcards(d) {
    var b = "<h1>" + d.title + "</h1>";
    d.cards.forEach(function (c) { b += '<div class="pc" style="background:' + c[2] + '"><h2>' + c[0] + "</h2><p>" + c[1] + "</p><p class='s'>- A student</p></div>"; });
    return doc("body{margin:0;background:" + d.bg + ";font-family:Georgia,serif;text-align:center}h1{padding:14px;margin:0}.pc{width:360px;max-width:80%;margin:18px auto;padding:18px;border:6px solid " + d.line + ";text-align:left}.pc h2{margin-top:0}.s{text-align:right;font-style:italic}", b);
  }
  E["7.1"] = { variants: [
    { name: "Around the world", html: postcards({ bg: "#f0ead8", line: "#7a4b12", title: "Postcards From My Trip", cards: [["Greetings from Paris", "The tower is taller than it looks, and the croissants are even better. We climbed all the stairs!", "#ffe3e3"], ["Greetings from Tokyo", "So many lights! We rode a train that goes 200 mph and ate noodles at midnight.", "#e3f2ff"], ["Greetings from Cairo", "I rode a camel next to the pyramids. It was bumpy, loud, and the best day ever.", "#fff3d1"]] }) },
    { name: "National parks", html: postcards({ bg: "#e8f3e8", line: "#2e5f3a", title: "National Park Postcards", cards: [["Greetings from Yellowstone", "We saw a geyser erupt right on time and a bison walked past our car.", "#e6fcf5"], ["Greetings from Yosemite", "Waterfalls everywhere! The granite cliffs are bigger than any building.", "#fff9db"], ["Greetings from Zion", "We hiked a canyon with a river in it. My shoes are still wet.", "#ffe8cc"]] }) }
  ] };

  /* ---------- 7.2 mood board (colors) ---------- */
  function mood(d) {
    var b = '<div class="hd"><h1>' + d.title + "</h1><p>" + d.sub + '</p></div><div class="sw">' + d.cols.map(function (c) { return '<div class="c" style="background:' + c[1] + ";color:" + (c[2] || "#fff") + '">' + c[0] + "</div>"; }).join("") + '</div><div class="q"><p>' + d.quote + "</p></div>";
    return doc("body{margin:0;background:" + d.bg + ";color:" + d.ink + ";font-family:" + d.font + "}.hd{padding:24px;text-align:center}h1{margin:0;color:" + d.hl + ";font-size:38px}.sw{display:flex;flex-wrap:wrap;gap:0}.c{flex:1;min-width:110px;height:120px;display:flex;align-items:flex-end;padding:8px;font-size:13px;font-weight:bold}.q{padding:22px;text-align:center;font-style:italic;font-size:20px}", b);
  }
  E["7.2"] = { variants: [
    { name: "Spooky night", html: mood({ bg: "#140d1f", ink: "#e5dff2", hl: "#ff8a1f", font: "Georgia,serif", title: "Spooky Night", sub: "a moonlit walk through the haunted woods", cols: [["Midnight", "#1b1030"], ["Witch Purple", "#5b2a86"], ["Pumpkin", "#ff8a1f", "#222"], ["Fog", "#a99cc4", "#222"], ["Bone", "#efe9d8", "#222"]], quote: "Every shadow has a story to tell." }) },
    { name: "Beach day", html: mood({ bg: "#fff9ec", ink: "#2a4b57", hl: "#0aa6c2", font: "Verdana,sans-serif", title: "Beach Day", sub: "warm sand, cold lemonade", cols: [["Ocean", "#0aa6c2"], ["Seafoam", "#8fe3d4", "#144"], ["Sand", "#f3dca5", "#543"], ["Coral", "#ff7f6b"], ["Sunset", "#ffb347", "#543"]], quote: "The tide always comes back." }) },
    { name: "Neon city", html: mood({ bg: "#0b0b1e", ink: "#e4e4ff", hl: "#ff2bd6", font: "'Courier New',monospace", title: "NEON CITY", sub: "rain, signs, and midnight traffic", cols: [["Hot Pink", "#ff2bd6"], ["Electric Blue", "#22d3ee", "#022"], ["Violet", "#7c3aed"], ["Lime", "#a3ff12", "#222"], ["Asphalt", "#1a1a33"]], quote: "The city never switches off." }) },
    { name: "Cozy cabin", html: mood({ bg: "#2b1d12", ink: "#f6e7d1", hl: "#f2a65a", font: "Georgia,serif", title: "Cozy Cabin", sub: "a fire, a blanket, and snow outside", cols: [["Firelight", "#e8662a"], ["Cedar", "#7a4a2b"], ["Wool", "#d9c3a0", "#321"], ["Pine", "#2f5d3a"], ["Cocoa", "#4a2c1b"]], quote: "Stay in. It's snowing." }) }
  ] };

  /* ---------- 7.3 streaming app (display) ---------- */
  function stream(d) {
    var b = '<div class="nav"><span class="logo">' + d.brand + "</span>" + d.menu.map(function (m) { return '<span class="bt">' + m + "</span>"; }).join("") + '</div><div class="hero"><h1>' + d.line + '</h1><p>' + d.sub + '</p><div class="play">&#9654; PLAY</div></div>';
    return doc("body{margin:0;background:" + d.bg + ";color:#fff;font-family:Arial,sans-serif;text-align:center}.nav{background:rgba(0,0,0,.35);padding:10px 14px;text-align:left}.logo{display:inline-block;font-weight:bold;font-size:22px;color:" + d.acc + ";margin-right:18px}.bt{display:inline-block;padding:7px 14px;margin:0 4px;border:2px solid " + d.acc + ";border-radius:6px}.hero{padding:70px 16px}.hero h1{font-size:42px;margin:0}.play{display:block;width:260px;margin:24px auto 0;padding:24px;background:" + d.acc + ";color:#111;font-weight:bold;font-size:30px;border-radius:12px}", b);
  }
  E["7.3"] = { variants: [
    { name: "Movies", html: stream({ bg: "#1a0b0b", acc: "#ff3b3b", brand: "CineNest", menu: ["Home", "Movies", "My List"], line: "Tonight: The Last Lighthouse", sub: "A thriller you can watch in one sitting." }) },
    { name: "Music", html: stream({ bg: "#0d1b3a", acc: "#2dd4bf", brand: "WaveBox", menu: ["Home", "Playlists", "Artists"], line: "Your Daily Mix", sub: "40 songs picked just for you." }) },
    { name: "Games", html: stream({ bg: "#1b0d3a", acc: "#a3ff12", brand: "PlayVault", menu: ["Home", "Library", "Friends"], line: "Jump Back In: Cobra Cup", sub: "Your team is waiting in the lobby." }) }
  ] };

  /* ---------- 7.4 profile page (divs) ---------- */
  function profile(d) {
    var b = '<div class="top">' + d.site + '</div><div class="row"><div class="side"><img src="' + d.pic + '" width="110" alt=""><h2>' + d.name + "</h2><p class='h'>" + d.handle + "</p><p>" + d.bio + "</p>" + d.facts.map(function (f) { return "<p class='f'>" + f + "</p>"; }).join("") + '</div><div class="feed"><h3>Latest posts</h3>' + d.posts.map(function (p) { return '<div class="post"><b>' + d.name + "</b><p>" + p[0] + "</p><small>" + p[1] + "</small></div>"; }).join("") + "</div></div>";
    return doc("body{margin:0;background:" + d.bg + ";font-family:Arial,sans-serif;color:#222}.top{background:" + d.acc + ";color:#fff;padding:10px 16px;font-weight:bold}.row{display:flex;gap:16px;padding:16px;align-items:flex-start}.side{width:190px;flex:0 0 190px;background:#fff;border-radius:10px;padding:14px;text-align:center;border:1px solid #ddd}.side img{border-radius:50%;width:110px;height:110px;object-fit:cover}.h{color:#777;margin:0}.f{font-size:13px;margin:4px 0;background:" + d.bg + ";border-radius:6px;padding:4px}.feed{flex:1}.post{background:#fff;border:1px solid #ddd;border-radius:10px;padding:10px 14px;margin-bottom:12px}.post p{margin:6px 0}.post small{color:#888}", b);
  }
  E["7.4"] = { variants: [
    { name: "A character", html: profile({ bg: "#eaf1ff", acc: "#2f5bd6", site: "HeroNet", pic: face("#2f5bd6", "#f1c27d", '<path d="M20 50 Q60 0 100 50 L100 30 Q60 -20 20 30Z" fill="#c92a2a"/>', 90), name: "Captain Comet", handle: "@captaincomet", bio: "Saving the city one rooftop at a time.", facts: ["Lives in: Starlight City", "Power: Flight", "Sidekick: Sparky"], posts: [["Stopped a runaway ice cream truck today. No scoops were lost.", "2 hours ago"], ["Reminder: capes do not go in the dryer.", "Yesterday"], ["Anyone know a good dry cleaner?", "2 days ago"]] }) },
    { name: "A pet", html: profile({ bg: "#fff4e5", acc: "#e8590c", site: "PawBook", pic: face("#ffd8a8", "#ffcc80", '<polygon points="30,50 40,10 55,40" fill="#e0a84c"/><polygon points="90,50 80,10 65,40" fill="#e0a84c"/>', 96), name: "Biscuit the Dog", handle: "@biscuit_snacks", bio: "Professional treat inspector.", facts: ["Breed: Golden mix", "Age: 4", "Favorite: Anything off the counter"], posts: [["Walk time. I have been waiting by the door since breakfast.", "1 hour ago"], ["Found a stick. Best day ever.", "Yesterday"], ["Who left the sandwich unsupervised?", "3 days ago"]] }) },
    { name: "A made-up celebrity", html: profile({ bg: "#f3eaff", acc: "#9c36b5", site: "StarSpot", pic: face("#9c36b5", "#f3c9a5", '<path d="M18 60 Q60 -10 102 60 L102 40 Q60 -30 18 40Z" fill="#222"/>', 92), name: "Luna Vale", handle: "@lunavale", bio: "Singer. Dreamer. Collector of vintage sunglasses.", facts: ["Hometown: Savannah", "Genre: Dream pop", "Tour: Spring 2027"], posts: [["New song drops Friday. I cannot stop smiling.", "3 hours ago"], ["Soundcheck snacks: pretzels and honey.", "Yesterday"], ["Thank you for 1 million listeners!", "4 days ago"]] }) }
  ] };

  /* ---------- 7.5 leaderboard (table) ---------- */
  function board(d) {
    var b = "<h1>" + d.title + "</h1><p>" + d.sub + "</p><table><tr>" + d.cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr>" + d.rows.map(function (r, i) { return "<tr" + (i === 0 ? " class='g'" : "") + ">" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</table>";
    return doc("body{margin:0;padding:18px;background:" + d.bg + ";color:#fff;font-family:Arial,sans-serif;text-align:center}h1{color:" + d.acc + ";margin:0 0 4px}table{margin:14px auto;border-collapse:collapse;width:90%;max-width:520px}th{background:" + d.acc + ";color:#111;padding:10px}td{padding:10px;border-bottom:1px solid #ffffff33}.g td{font-weight:bold;color:" + d.acc + "}", b);
  }
  E["7.5"] = { variants: [
    { name: "A game", html: board({ bg: "#0f1330", acc: "#ffd43b", title: "Cobra Cup Leaderboard", sub: "Season 3 - top five players", cols: ["Rank", "Player", "Wins", "Points"], rows: [["1", "NightFang", "24", "1,980"], ["2", "ByteQueen", "21", "1,760"], ["3", "LagMonster", "19", "1,540"], ["4", "TacoTank", "17", "1,420"], ["5", "Pixel", "15", "1,300"]] }) },
    { name: "A sport", html: board({ bg: "#0b2a14", acc: "#8ce99a", title: "Wildcats Standings", sub: "Region play this season", cols: ["Rank", "Team", "Wins", "Losses"], rows: [["1", "Wildcats", "9", "1"], ["2", "Eagles", "8", "2"], ["3", "Rams", "6", "4"], ["4", "Hornets", "4", "6"], ["5", "Bulldogs", "2", "8"]] }) },
    { name: "A competition you invent", html: board({ bg: "#2a1030", acc: "#f783ac", title: "The Great Nap-Off", sub: "Who can nap the longest in class?", cols: ["Rank", "Napper", "Minutes", "Pillow Used"], rows: [["1", "Sleepy Sam", "47", "Giant"], ["2", "Dozy Dee", "41", "Neck"], ["3", "Yawning Yuri", "38", "Hoodie"], ["4", "Drowsy Dan", "30", "Backpack"], ["5", "Wide-Eyed Wes", "2", "None"]] }) }
  ] };

  /* ---------- 8.x CSS unit: the same website, a little more each lesson ---------- */
  var SITES = {
    cafe: { name: "Moonbeam Cafe", bg: "#fff8ee", ink: "#3b2a1a", acc: "#c2410c", hl: "#fde68a", font: "Georgia,serif", title: "Welcome to Moonbeam Cafe", p: ["We roast our coffee every morning and bake our pastries in small batches.", "Everything on the menu is made to order, so the line moves a little slower and tastes a lot better.", "Come say hi. The first cup is always warm, and the second one is half off."], row: ["Menu", "Hours", "Order"], tiles: [["Latte", "#d9a066"], ["Mocha", "#8a5a3c"], ["Scone", "#e9c46a"], ["Muffin", "#c97b84"]] },
    band: { name: "Static Neon", bg: "#110a25", ink: "#ece6ff", acc: "#ff3df2", hl: "#3b1d6e", font: "Verdana,sans-serif", title: "Static Neon: Official Site", p: ["We are four friends who write loud songs in a garage with bad wiring.", "Our new album comes out this spring, and we are going on tour with a van that barely starts.", "Join the mailing list so you never miss a show or a new song."], row: ["Music", "Shows", "Merch"], tiles: [["Album", "#6a2fd0"], ["Tour", "#e0289c"], ["Shirts", "#1ab6d8"], ["Stickers", "#e4a21c"]] }
  };
  function site(t, lvl) {
    var css = "body{margin:0;padding:22px;background:" + t.bg + ";color:" + t.ink + ";font-family:" + t.font + ";line-height:1.55}h1{color:" + t.acc + ";font-size:34px;margin:0 0 12px}p{font-size:16px}";
    var b = "<h1" + (lvl >= 2 ? ' id="pageTitle"' : "") + ">" + t.title + "</h1>";
    if (lvl >= 2) css += "#pageTitle{background:" + t.hl + ";padding:14px;border-radius:6px}";
    b += "<p" + (lvl >= 1 ? ' class="highlight"' : "") + ">" + t.p[0] + "</p>";
    if (lvl >= 1) css += ".highlight{background:" + t.hl + ";color:" + t.ink + ";padding:8px}";
    b += "<p" + (lvl >= 3 ? ' class="alt"' : "") + ">" + t.p[1] + "</p>";
    if (lvl >= 3) css += ".alt{color:" + t.acc + ";font-weight:bold}.shade{background:" + t.hl + "}.frame{border:3px solid " + t.acc + ";padding:8px}";
    b += "<p" + (lvl >= 3 ? ' class="shade frame"' : "") + ">" + t.p[2] + "</p>";
    if (lvl >= 4) {
      css += "a{display:inline-block;color:#fff;background:" + t.acc + ";padding:8px 16px;border-radius:6px;text-decoration:none;transition:all .35s}a:hover{background:" + t.ink + ";color:" + t.bg + "}";
      b += "<p><a href='#'>Visit the full site</a> (hover over me)</p>";
    }
    if (lvl >= 5) {
      css += ".row{display:flex;justify-content:space-between;align-items:center;margin:14px 0}.row div{background:" + t.hl + ";padding:14px 26px;border-radius:6px;font-weight:bold}";
      b += '<div class="row">' + t.row.map(function (r) { return "<div>" + r + "</div>"; }).join("") + "</div>";
    }
    if (lvl >= 6) {
      css += ".gal{display:grid;grid-template-columns:1fr 1fr;gap:10px}.gal div{height:70px;border-radius:6px;color:#fff;font-weight:bold;display:flex;align-items:center;justify-content:center}";
      b += '<div class="gal">' + t.tiles.map(function (x) { return '<div style="background:' + x[1] + '">' + x[0] + "</div>"; }).join("") + "</div>";
    }
    return doc(css, b);
  }
  [1, 2, 3, 4, 5, 6].forEach(function (n) {
    E["8." + n] = { note: n === 4 ? "Move your mouse over the button in the example to see the hover effect." : "", variants: [
      { name: "A cafe website", html: site(SITES.cafe, n) },
      { name: "A band website", html: site(SITES.band, n) }
    ] };
  });

  /* ---------- 9.x Bootstrap unit ---------- */
  var BS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">';
  function bsSite(t, lvl) {
    var dark = t === SITES.band;
    var b = "", css = "body{padding-bottom:20px}";
    if (lvl >= 4) b += '<nav class="navbar navbar-expand bg-dark navbar-dark px-3"><a class="navbar-brand" href="#">' + t.name + '</a><div class="navbar-nav flex-row gap-3 ms-3"><a class="nav-link text-white" href="#">Home</a><a class="nav-link text-white" href="#">About</a><a class="nav-link text-white" href="#">Contact</a></div></nav>';
    var h1 = "<h1" + (lvl >= 3 ? ' class="text-primary"' : "") + ">" + t.title + "</h1>";
    if (lvl < 2) {
      b += '<div style="padding:16px">' + h1 + "<p>" + t.p[0] + "</p><p>" + t.p[1] + "</p></div>";
    } else {
      b += '<div class="container my-3">' + h1 + '<div class="row"><div class="col"><h2>Our story</h2><p' + (lvl >= 3 ? ' class="bg-light p-2"' : "") + ">" + t.p[0] + '</p></div><div class="col"><h2' + (lvl >= 3 ? ' class="fw-bold"' : "") + ">Visit us</h2><p>" + t.p[1] + "</p>" + (lvl >= 3 ? '<a href="#" class="btn btn-primary">Learn more</a>' : "") + "</div></div>";
      if (lvl >= 5) {
        b += '<div class="row mt-4">' + t.tiles.slice(0, 3).map(function (x) {
          return '<div class="col"><div class="card"><a href="#"><img class="card-img-top" alt="" src="' + scene(x[1], "#ffffff55", '<circle cx="150" cy="90" r="46" fill="#ffffff66"/>') + '"></a><div class="card-body"><h5 class="card-title">' + x[0] + '</h5><p class="card-text">A short note about the ' + x[0].toLowerCase() + '.</p><a href="#" class="btn btn-primary">Details</a></div></div></div>';
        }).join("") + "</div>";
      }
      if (lvl >= 6) {
        b += '<form class="mt-4"><div class="mb-3"><label class="form-label">Name</label><input class="form-control" placeholder="Your name"></div><div class="mb-3"><label class="form-label">Email</label><input class="form-control" placeholder="you@school.org"></div><button type="submit" class="btn btn-success">Sign up</button></form>';
      }
      b += "</div>";
    }
    return doc(css, b, BS);
  }
  [1, 2, 3, 4, 5, 6].forEach(function (n) {
    E["9." + n] = { note: "This example loads Bootstrap from the internet, so it needs a connection.", variants: [
      { name: "A cafe website", html: bsSite(SITES.cafe, n) },
      { name: "A band website", html: bsSite(SITES.band, n) }
    ] };
  });
})(typeof window !== "undefined" ? window : globalThis);
