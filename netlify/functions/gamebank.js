/* GAME BANK: the questions, answers and rules for the Mission games (python/games/play.html).
   Everything about a game round is made HERE, on the server, from a random seed. The student's browser is only sent the PUBLIC question
   (never the answer), and every answer is checked here. So the answers cannot be read out of the page.
   A game is 10 rounds. Three wrong answers end it. The score is (right answers / 10) x 100, so 90 means one mistake is allowed.
   Pure functions only (no storage), so tools/missions/gametest.mjs can test every game offline. */

const ROUNDS = 10, STRIKES = 3;

/* ------------------------------------------------------------------ seeded random numbers ---- */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const R = (seed, i) => rng((Number(seed) ^ Math.imul(i + 1, 0x9E3779B1)) >>> 0);
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
const uniq = (arr) => arr.filter((x, i) => arr.indexOf(x) === i);

/* a multiple-choice round: the right answer is mixed in with the wrong ones, and only its position is kept secret */
function mc(r, prompt, right, wrong, why, extra, t) {
  const items = shuffle(r, [right].concat(uniq(wrong).filter((w) => w !== right)));
  return { q: Object.assign({ type: "choice", prompt, choices: items, t: t || 25 }, extra || {}), a: { idx: items.indexOf(right) }, why };
}
/* take a question from a small pool, never the same two in one run */
const poolPick = (r, pool, used) => { for (let k = 0; k < 30; k++) { const p = pick(r, pool); if (used.indexOf(p) < 0) return p; } return pool[0]; };

/* ================================================================== 1. BOMB: Internet addresses ==== */
const bits8 = (n) => n.toString(2).padStart(8, "0");
function makeIp(r, valid) {
  const o = () => int(r, 0, 255);
  if (valid) return { ip: [o(), o(), o(), o()].join("."), ok: true, why: "It has four numbers and every one is from 0 to 255, so it is valid." };
  const kind = int(r, 0, 3);
  if (kind === 0) { const bad = int(r, 256, 999), pos = int(r, 0, 3), parts = [o(), o(), o(), o()]; parts[pos] = bad; return { ip: parts.join("."), ok: false, why: bad + " is bigger than 255. One octet is 8 bits, so it can only hold 0 to 255." }; }
  if (kind === 1) return { ip: [o(), o(), o()].join("."), ok: false, why: "It only has 3 numbers. An IPv4 address needs exactly 4." };
  if (kind === 2) return { ip: [o(), o(), o(), o(), o()].join("."), ok: false, why: "It has 5 numbers. An IPv4 address needs exactly 4." };
  return { ip: o() + "." + o() + ".x." + o(), ok: false, why: "Letters are not allowed. Every part must be a number." };
}
function typedIp(r, kind, tricky) {
  const o = () => int(r, 0, 255), o1 = () => int(r, 1, 254);
  if (kind === "loopback") return { ip: "127." + o() + "." + o() + "." + o1(), why: "Anything that starts with 127 is loopback: it means THIS computer and never leaves it." };
  if (kind === "private") {
    const k = tricky ? pick(r, [1, 2]) : int(r, 0, 2);
    if (k === 0) return { ip: "10." + o() + "." + o() + "." + o1(), why: "Addresses that start with 10. are private (used inside a home or school)." };
    if (k === 1) return { ip: "172." + int(r, 16, 31) + "." + o() + "." + o1(), why: "172.16 through 172.31 is a private range." };
    return { ip: "192.168." + o() + "." + o1(), why: "Addresses that start with 192.168. are private." };
  }
  const k = tricky ? pick(r, [0, 1, 2]) : int(r, 0, 3);
  if (k === 0) return { ip: "172." + pick(r, [15, 32, 33, 40, 100]) + "." + o() + "." + o1(), why: "Only 172.16 to 172.31 are private. This one is outside that range, so it is public." };
  if (k === 1) return { ip: "192." + pick(r, [167, 169, 170, 0]) + "." + o() + "." + o1(), why: "Only 192.168 is private. This 192 address is public." };
  if (k === 2) return { ip: pick(r, [11, 8, 34, 52, 142, 151, 99]) + "." + o() + "." + o() + "." + o1(), why: "This address is not in a private range or loopback, so it is public (reachable on the Internet)." };
  return { ip: pick(r, [74, 104, 185, 203]) + "." + o() + "." + o() + "." + o1(), why: "Not private and not loopback, so it is public." };
}
const BOMB_FACTS = [
  { p: "How many bits are in an IPv4 address?", right: "32", wrong: ["8", "16", "64"], why: "Four octets of 8 bits each is 4 x 8 = 32 bits." },
  { p: "How many bits are in an IPv6 address?", right: "128", wrong: ["32", "64", "256"], why: "IPv6 uses 128 bits, so there are far more addresses." },
  { p: "How many bits are in ONE octet of an IPv4 address?", right: "8", wrong: ["4", "16", "32"], why: "An octet is 8 bits (one byte), which is why it goes from 0 to 255." },
  { p: "Why was IPv6 created?", right: "IPv4 was running out of addresses", wrong: ["IPv4 was too slow", "IPv4 had too many letters", "Nobody liked the dots"], why: "32 bits is only about 4.3 billion addresses, and the world ran out." },
  { p: "What is the highest number one octet can hold?", right: "255", wrong: ["256", "128", "100"], why: "8 bits can make 256 values, which is 0 through 255." }
];
function bombQ(seed, i) {
  const r = R(seed, i);
  if (i === 0 || i === 4) {
    const target = i === 0 ? int(r, 20, 120) : int(r, 170, 254);
    return { q: { type: "bits", target, prompt: "Flip the switches so the panel reads " + target + ".", t: 45 }, a: { value: target }, why: target + " in binary is " + bits8(target) + ". Add up the place values that are lit." };
  }
  if (i === 1 || i === 5) {
    const n = i === 1 ? int(r, 20, 120) : int(r, 170, 254);
    const d = uniq([n + 1, n - 1, n + 16, n - 16, n ^ 3, n ^ 64].filter((x) => x >= 0 && x <= 255 && x !== n));
    return mc(r, "The bomb's display shows " + bits8(n) + ". What is that in decimal?", String(n), shuffle(r, d).slice(0, 3).map(String), bits8(n) + " = " + n + ". Add the place values (128, 64, 32 ...) where there is a 1.", { code: bits8(n) }, 30);
  }
  if (i === 2 || i === 6) {
    const v = makeIp(r, int(r, 0, 1) === 1);
    return mc(r, "Is this a legal IPv4 address?", v.ok ? "VALID" : "INVALID", [v.ok ? "INVALID" : "VALID"], v.why, { code: v.ip, fixed: true }, 25);
  }
  if (i === 3 || i === 7) {
    const kind = pick(r, ["private", "public", "loopback", "private", "public"]);
    const v = typedIp(r, kind, i === 7);
    return mc(r, "What kind of address is this?", kind, ["private", "public", "loopback"].filter((k) => k !== kind), v.why, { code: v.ip, fixed: true }, 25);
  }
  if (i === 8) {
    const f = BOMB_FACTS[int(R(seed, 99), 0, BOMB_FACTS.length - 1)];
    return mc(r, f.p, f.right, f.wrong, f.why, {}, 25);
  }
  /* i === 9: the final wire panel: build a whole address */
  const targets = [192, 168, int(r, 0, 255), int(r, 1, 254)];
  return { q: { type: "bitsip", targets, prompt: "Last panel! Build the whole address " + targets.join(".") + ". Set all four octets.", t: 90 }, a: { values: targets }, why: targets.map((n) => n + " = " + bits8(n)).join(".  ") };
}
function bombCheck(a, ans) {
  if (!ans || ans.timeout) return false;
  if ("idx" in a) return ans.idx === a.idx;
  if ("value" in a) return Number(ans.value) === a.value;
  if (a.values) return Array.isArray(ans.values) && ans.values.length === a.values.length && a.values.every((v, k) => Number(ans.values[k]) === v);
  return false;
}

/* ================================================================== 2. CLIFF ROAD: DNS ============ */
const DNS_SITES = [["google.com", "142.250.80.46"], ["amazon.com", "205.251.242.103"], ["netflix.com", "52.3.144.142"], ["schs.edu", "10.20.30.40"], ["mit.edu", "18.9.22.69"], ["wikipedia.org", "208.80.154.224"], ["code.org", "99.84.190.17"]];
const SUBS = ["www", "mail", "games", "drive", "news"];
function dnsQ(seed, i) {
  const r = R(seed, i);
  const site = pick(r, DNS_SITES), name = site[0], tld = name.split(".")[1], sub = pick(r, SUBS), full = sub + "." + name;
  const TLDS = ["com", "edu", "org"];
  switch (i) {
    case 0: return mc(r, "A device wants a website. Which server does the resolver ask FIRST?", "The root server", ["The website's own server", "The .com server"], "The question starts at the top of the hierarchy: the root server points to the TLD server.", {}, 30);
    case 1: return mc(r, "The resolver is looking up " + full + ". The root server says to ask the ____ server.", "." + tld, TLDS.filter((x) => x !== tld).map((x) => "." + x), "Read a domain from right to left. The last label, ." + tld + ", is the top-level domain.", { code: full }, 30);
    case 2: { const others = shuffle(r, DNS_SITES.filter((s) => s[0] !== name)).slice(0, 3); const book = shuffle(r, [site].concat(others)); return mc(r, "Look at the phone book. What IP address does the resolver give for " + name + "?", site[1], others.slice(0, 2).map((s) => s[1]), name + " is listed with " + site[1] + ". DNS turns the name into that number.", { book: book.map((s) => s[0] + " = " + s[1]) }, 30); }
    case 3: { const labels = full.split("."); return mc(r, "In " + full + ", which label is the TLD (top-level domain)?", labels[2], [labels[0], labels[1]], "The TLD is always the LAST label: " + labels[2] + ". The first part (" + sub + ") is a subdomain.", { code: full }, 25); }
    case 4: return mc(r, "The resolver already has " + name + " saved in its cache. Someone asks for it again. What happens?", "It answers right away from the cache", ["It asks the root server all over again", "It gives an error"], "A cache remembers answers so repeat lookups are faster and the servers get fewer questions.", {}, 30);
    case 5: return mc(r, "Nobody has a record for faketown.xyz. What does the resolver finally say?", "NXDOMAIN: that name does not exist", ["0.0.0.0, the Internet is empty", "The IP address of google.com"], "NXDOMAIN means non-existent domain. DNS reports that no such name exists.", {}, 30);
    case 6: return mc(r, "Which part of " + full + " is the site domain you actually register?", name, [full, tld], "You register the last two labels: " + name + ". The owner can make up subdomains like " + sub + " for free.", { code: full }, 30);
    case 7: return mc(r, "An attacker plants a FAKE answer in a resolver's cache. What can happen?", "Visitors are sent to the attacker's website", ["The Internet gets faster", "Nothing. Caches can never be changed"], "This is DNS spoofing (cache poisoning). A fake answer can quietly redirect people to a look-alike site.", {}, 30);
    case 8: return mc(r, "Why does the Internet use DNS?", "Names are much easier to remember than IP addresses", ["Computers cannot use numbers", "To make Wi-Fi faster"], "People remember names. DNS translates them into the numbers computers use, like a phone book.", {}, 30);
    default: return mc(r, "DNS is down, but you type a website's IP address directly. What happens?", "The site can still load", ["Nothing on the Internet works at all", "Your device deletes the website"], "DNS only translates names. The IP address itself still works, but remembering numbers is hard.", {}, 30);
  }
}
const choiceCheck = (a, ans) => !!ans && !ans.timeout && ans.idx === a.idx;

/* ================================================================== 3. STORM DASH: routing ======== */
const NODES = { Home: [8, 50], R1: [24, 20], R2: [24, 50], R3: [24, 80], R4: [46, 20], R5: [46, 50], R6: [46, 80], R7: [68, 34], R8: [68, 66], School: [92, 30], Cloud: [92, 70] };
const EDGES = [["Home", "R1"], ["Home", "R2"], ["Home", "R3"], ["R1", "R2"], ["R2", "R3"], ["R1", "R4"], ["R2", "R5"], ["R3", "R6"], ["R4", "R5"], ["R5", "R6"], ["R4", "R7"], ["R5", "R7"], ["R5", "R8"], ["R6", "R8"], ["R7", "R8"], ["R7", "School"], ["R8", "Cloud"], ["R8", "School"]];
const linked = (a, b) => EDGES.some((e) => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a));
function neighbors(n) { const out = []; EDGES.forEach((e) => { if (e[0] === n) out.push(e[1]); if (e[1] === n) out.push(e[0]); }); return out; }
function shortestHops(src, dst, down) {
  if (down.indexOf(src) > -1 || down.indexOf(dst) > -1) return -1;
  const seen = { [src]: 0 }, queue = [src];
  while (queue.length) { const n = queue.shift(); if (n === dst) return seen[n]; neighbors(n).forEach((m) => { if (seen[m] === undefined && down.indexOf(m) < 0) { seen[m] = seen[n] + 1; queue.push(m); } }); }
  return -1;
}
const ROUTERS = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8"];
function stormDown(r, src, dst, count) {
  for (let k = 0; k < 60; k++) { const d = shuffle(r, ROUTERS).slice(0, count); if (shortestHops(src, dst, d) > 0) return d; }
  return [];
}
function routeRound(seed, i, cfg) {
  const r = R(seed, i);
  const pair = pick(r, [["Home", "School"], ["Home", "Cloud"], ["R1", "Cloud"], ["R3", "School"], ["Home", "School"], ["Home", "Cloud"]]);
  const down = cfg.cut ? cfg.cut(r, pair[0], pair[1]) : stormDown(r, pair[0], pair[1], cfg.down);
  const hops = shortestHops(pair[0], pair[1], down);
  const prompt = (cfg.down === 0 ? "Deliver the packet from " : "A storm knocked out " + (down.length > 1 ? "some routers" : "a router") + ". Deliver the packet from ") + pair[0] + " to " + pair[1] + (cfg.shortest ? " using the FEWEST hops." : ".");
  return { q: { type: "route", src: pair[0], dst: pair[1], down, prompt, shortest: !!cfg.shortest, canFail: !!cfg.canFail, t: cfg.t || 45 }, a: { src: pair[0], dst: pair[1], down, shortest: !!cfg.shortest, hops, none: hops < 0 }, why: hops < 0 ? "Every path to " + pair[1] + " was cut, so the right answer is NO ROUTE." : (cfg.shortest ? "The fewest hops from " + pair[0] + " to " + pair[1] + " is " + hops + ". Always avoid the red routers." : "Follow links from " + pair[0] + " to " + pair[1] + " and avoid the routers that are down.") };
}
function stormQ(seed, i) {
  const r = R(seed, i);
  switch (i) {
    case 0: return routeRound(seed, i, { down: 0 });
    case 1: return routeRound(seed, i, { down: 1 });
    case 2: return mc(r, "In networking, what is a HOP?", "One handoff from a router to the next router", ["A very fast packet", "A broken cable"], "Every time a packet is passed from one router to the next, that is one hop.", {}, 25);
    case 3: return routeRound(seed, i, { down: 1, shortest: true });
    case 4: return routeRound(seed, i, { down: 2 });
    case 5: { const pair = pick(r, [["Home", "School"], ["Home", "Cloud"]]), h = shortestHops(pair[0], pair[1], []); return mc(r, "With no storms, what is the FEWEST number of hops from " + pair[0] + " to " + pair[1] + "?", String(h), uniq([h + 1, h + 2, h - 1].filter((x) => x > 0)).map(String), "Count the links on the shortest route: " + h + " hops.", { map: true }, 40); }
    case 6: return routeRound(seed, i, { down: 2, shortest: true });
    case 7: return mc(r, "Why is it good that the Internet has MANY paths between two places?", "If one router fails, packets can be rerouted (it is fault tolerant)", ["It makes cables cheaper", "It lets every packet travel in a straight line"], "More than one path is called redundancy. When something fails, traffic goes around it.", {}, 30);
    case 8: return routeRound(seed, i, { canFail: true, t: 50, cut: (rr, s, d) => { const ns = neighbors(d); return ns.filter((n) => n !== s); } });
    default: return routeRound(seed, i, { down: 3, shortest: true, t: 60 });
  }
}
function routeCheck(a, ans) {
  if (!ans || ans.timeout) return false;
  if (a.none) return ans.none === true;
  if (ans.none) return false;
  const p = ans.path;
  if (!Array.isArray(p) || p.length < 2 || p.length > 12) return false;
  if (p[0] !== a.src || p[p.length - 1] !== a.dst || uniq(p).length !== p.length) return false;
  for (let k = 0; k < p.length; k++) { if (!NODES[p[k]] || a.down.indexOf(p[k]) > -1) return false; if (k > 0 && !linked(p[k - 1], p[k])) return false; }
  return a.shortest ? p.length - 1 === a.hops : true;
}

/* ================================================================== 4. PACKET POST OFFICE ========= */
const MESSAGES = ["PACKETS ROCK", "HELLO WORLD", "NETWORK NINJA", "SEND IT NOW", "ROUTERS ARE FUN", "OPEN STANDARDS", "KEEP IT MOVING", "LOL CAT VIDEO"];
function chunkText(text, n) { const size = Math.ceil(text.length / n), out = []; for (let k = 0; k < text.length; k += size) out.push(text.slice(k, k + size)); return out; }
function assembleQ(seed, i, n, t) {
  const r = R(seed, i), msg = pick(r, MESSAGES), chunks = chunkText(msg, n), total = chunks.length;
  const packets = chunks.map((d, k) => ({ seq: k + 1, data: d }));
  return { q: { type: "assemble", packets: shuffle(r, packets), total, prompt: "Packets arrived out of order! Put them back in the right order to rebuild the message.", t: t || 40 }, a: { total, msg }, why: "Sort by the sequence number in each header: 1, 2, 3 ... The message reads: " + msg };
}
function missingQ(seed, i, lost, t) {
  const r = R(seed, i), total = int(r, 5, 7), gone = shuffle(r, Array.from({ length: total }, (_, k) => k + 1)).slice(0, lost).sort((x, y) => x - y);
  const shown = Array.from({ length: total }, (_, k) => k + 1).filter((x) => gone.indexOf(x) < 0);
  return { q: { type: "missing", total, shown, multi: lost > 1, prompt: lost > 1 ? "The receiver got these packets. Select ALL the packet numbers it must ask to be resent (TCP)." : "The receiver got these packets. Which packet number is missing and must be resent (TCP)?", t: t || 35 }, a: { gone }, why: "The receiver compares what arrived with the total (" + total + "). Missing: " + gone.join(", ") + "." };
}
const SCENES = [
  { p: "A live video call with friends", right: "UDP", why: "Live video needs speed. An old frame is useless, so UDP does not wait to resend it." },
  { p: "Downloading your school project file", right: "TCP", why: "Every single piece must arrive and in order, so you use reliable TCP." },
  { p: "An online shooter game sending your position", right: "UDP", why: "Games want the newest data fast. UDP skips lost packets instead of waiting." },
  { p: "Sending an important email", right: "TCP", why: "Email must arrive complete and in order. That is TCP's job." },
  { p: "Loading a web page", right: "TCP", why: "A web page (HTTP) travels over TCP so nothing is missing." },
  { p: "A live radio stream", right: "UDP", why: "Live streams favor speed over perfect delivery, like UDP." }
];
function packetsQ(seed, i) {
  const r = R(seed, i);
  switch (i) {
    case 0: return assembleQ(seed, i, 3, 40);
    case 1: return assembleQ(seed, i, 4, 45);
    case 2: { const s = SCENES[int(r, 0, 2)]; return mc(r, "Which protocol fits best? " + s.p, s.right, [s.right === "TCP" ? "UDP" : "TCP"], s.why, { fixed: true }, 25); }
    case 3: return missingQ(seed, i, 1, 35);
    case 4: return assembleQ(seed, i, 5, 50);
    case 5: return mc(r, "What is the sequence number in a packet's header for?", "It lets the receiver put the packets back in order", ["It encrypts the message", "It tells the router how fast to go"], "Packets can arrive in any order. The sequence number tells the receiver how to reassemble them.", {}, 30);
    case 6: { const s = SCENES[int(r, 3, 5)]; return mc(r, "Which protocol fits best? " + s.p, s.right, [s.right === "TCP" ? "UDP" : "TCP"], s.why, { fixed: true }, 25); }
    case 7: return missingQ(seed, i, 2, 45);
    case 8: return assembleQ(seed, i, 6, 60);
    default: return mc(r, "A set of agreed rules that lets different devices communicate is called a...", "protocol", ["packet", "router", "firewall"], "A protocol (like TCP, UDP, HTTP or DNS) is an agreed set of rules everyone follows.", { fixed: true }, 25);
  }
}
function packetsCheck(a, ans) {
  if (!ans || ans.timeout) return false;
  if ("idx" in a) return ans.idx === a.idx;
  if (a.gone) { const m = Array.isArray(ans.missing) ? ans.missing.map(Number).sort((x, y) => x - y) : null; return !!m && m.length === a.gone.length && m.every((v, k) => v === a.gone[k]); }
  const o = ans.order; return Array.isArray(o) && o.length === a.total && o.every((v, k) => Number(v) === k + 1);
}

/* ================================================================== 5. CARTOON CAST: lists ======== */
const CAST = [["Bolt", "robot", "#fb923c"], ["Pixel", "cat", "#f472b6"], ["Zed", "alien", "#4ade80"], ["Mochi", "blob", "#fbbf24"], ["Nova", "robot", "#38bdf8"], ["Luna", "cat", "#c4b5fd"], ["Blip", "alien", "#a3e635"], ["Gus", "blob", "#f87171"]];
const hero = (name) => { const c = CAST.find((x) => x[0] === name); return { name: c[0], kind: c[1], color: c[2] }; };
const listText = (names) => "cast = [" + names.map((n) => '"' + n + '"').join(", ") + "]";
function castOps(start, ops) {
  const list = start.slice();
  for (const op of ops) {
    const [kind, a, b] = String(op).split(":");
    if (kind === "append") list.push(a);
    else if (kind === "insert") list.splice(Number(a), 0, b);
    else if (kind === "remove") { const k = list.indexOf(a); if (k < 0) return null; list.splice(k, 1); }
    else if (kind === "pop") { if (!list.length) return null; list.pop(); }
    else return null;
  }
  return list;
}
function opsRound(seed, i, steps) {
  for (let attempt = 0; attempt < 40; attempt++) { const x = opsRoundTry(seed, i, steps, attempt); if (x.q.target.join("|") !== x.q.start.join("|")) return x; }   /* never a puzzle whose steps cancel each other out */
  return opsRoundTry(seed, i, steps, 0);
}
function opsRoundTry(seed, i, steps, attempt) {
  const r = R(seed, i + 100 * attempt), names = shuffle(r, CAST.map((c) => c[0])), start = names.slice(0, 3 + int(r, 0, 1)), spare = names.slice(start.length), good = [];
  let cur = start.slice(), spareIdx = 0;
  for (let k = 0; k < steps; k++) {
    const kind = pick(r, cur.length > 2 ? ["append", "insert", "remove", "pop"] : ["append", "insert"]);
    let op;
    if (kind === "append") op = "append:" + spare[spareIdx++];
    else if (kind === "insert") op = "insert:" + int(r, 0, Math.min(cur.length, 2)) + ":" + spare[spareIdx++];
    else if (kind === "remove") op = "remove:" + pick(r, cur);
    else op = "pop";
    good.push(op); cur = castOps(cur, [op]);
  }
  const target = cur, palette = shuffle(r, uniq(good.concat([
    "append:" + spare[spareIdx % spare.length], "insert:0:" + spare[(spareIdx + 1) % spare.length], "remove:" + start[0], "remove:" + start[start.length - 1], "pop", "insert:1:" + spare[(spareIdx + 2) % spare.length]
  ])).slice(0, 8));
  good.forEach((g) => { if (palette.indexOf(g) < 0) palette.push(g); });
  return { q: { type: "ops", start, target, palette, max: steps + 1, prompt: "Edit the cast list so it matches the TARGET. Tap operations in order (they run top to bottom).", code: listText(start), t: 60 + steps * 15 }, a: { start, target }, why: "One way: " + good.map((o) => "cast." + o.replace(/^append:(.*)$/, 'append("$1")').replace(/^insert:(\d+):(.*)$/, 'insert($1, "$2")').replace(/^remove:(.*)$/, 'remove("$1")').replace(/^pop$/, "pop()")).join(", then ") + "." };
}
function castQ(seed, i) {
  const r = R(seed, i), names = shuffle(r, CAST.map((c) => c[0])), n = 4 + int(r, 0, 1), list = names.slice(0, n), spare = names.slice(n);
  const asHero = (arr) => arr.map(hero);
  switch (i) {
    case 0: { const k = int(r, 0, n - 1); return { q: { type: "pickindex", cast: asHero(list), code: listText(list), prompt: "Tap the character at index " + k + ".  (Count from 0!)", t: 30 }, a: { idx: k }, why: "Indexes start at 0, so index " + k + " is " + list[k] + "." }; }
    case 1: return mc(r, "What is cast[-1]?", list[n - 1], shuffle(r, list.slice(0, n - 1)).slice(0, 3), "A negative index counts from the end. -1 is the LAST item: " + list[n - 1] + ".", { code: listText(list), heroes: true }, 30);
    case 2: return mc(r, "What does len(cast) give?", String(n), uniq([n - 1, n + 1, n + 2].map(String)), "len counts the items. There are " + n + ".", { code: listText(list), cast: asHero(list) }, 30);
    case 3: return opsRound(seed, i, 1);
    case 4: return mc(r, "What is cast[1:3]?", "[" + [list[1], list[2]].map((x) => '"' + x + '"').join(", ") + "]", ["[" + [list[0], list[1]].map((x) => '"' + x + '"').join(", ") + "]", "[" + [list[2], list[3]].map((x) => '"' + x + '"').join(", ") + "]", "[" + [list[1], list[2], list[3]].map((x) => '"' + x + '"').join(", ") + "]"], "A slice starts at index 1 and stops BEFORE index 3, so it holds indexes 1 and 2.", { code: listText(list), cast: asHero(list) }, 40);
    case 5: return mc(r, "This loop draws a character for each item. How many characters get drawn?\nfor i in range(len(cast)):\n    draw(cast[i])", String(n), uniq([n - 1, n + 1, 1].map(String)), "range(len(cast)) gives one number per item, so the loop runs " + n + " times.", { code: listText(list), cast: asHero(list) }, 35);
    case 6: return opsRound(seed, i, 2);
    case 7: { const after = list.slice(0, n - 1); return mc(r, "After cast.pop(), which character is LAST in the list?", after[after.length - 1], uniq([list[n - 1], list[0], after[1]]).filter((x) => x !== after[after.length - 1]), "pop() removes the last item, so the new last item is " + after[after.length - 1] + ".", { code: listText(list), cast: asHero(list) }, 35); }
    case 8: { const nw = spare[0], after = [nw].concat(list), k = int(r, 1, 3); return mc(r, 'After cast.insert(0, "' + nw + '"), which character is at index ' + k + '?', after[k], uniq(after.filter((x, j) => j !== k)).slice(0, 3), 'insert(0, ...) pushes everyone one place to the right, so index ' + k + ' is now ' + after[k] + '.', { code: listText(list), cast: asHero(list) }, 40); }
    default: return opsRound(seed, i, 3);
  }
}
function castCheck(a, ans) {
  if (!ans || ans.timeout) return false;
  if ("idx" in a) return ans.idx === a.idx;
  if (a.target) { if (!Array.isArray(ans.ops) || ans.ops.length > 6) return false; const out = castOps(a.start, ans.ops); return !!out && out.length === a.target.length && out.every((x, k) => x === a.target[k]); }
  return false;
}


/* ================================================================== 6. VAULT BREAKER: digital information (Unit 8) ==== */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const caesar = (s, k) => s.split("").map((c) => { const i = ALPHA.indexOf(c); return i < 0 ? c : ALPHA[(((i + k) % 26) + 26) % 26]; }).join("");
const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, "0");
const rgbText = (p) => "(" + p.join(", ") + ")";
const clamp255 = (n) => Math.max(0, Math.min(255, n));
const WORD_GROUPS = [["CAT", "COT", "CUT", "CAB"], ["BAT", "BIT", "BUT", "BAG"], ["HAT", "HIT", "HOT", "HUT"], ["SIT", "SAT", "SET", "SIP"], ["MAP", "MAT", "MOP", "MUG"], ["PIG", "PEG", "PIT", "PAT"], ["DOG", "DIG", "DOT", "DUG"], ["RAT", "ROT", "RUT", "RAN"], ["FOX", "BOX", "FIX", "FAX"], ["JAM", "JAR", "JET", "JOB"], ["TIP", "TOP", "TAP", "TIN"], ["NET", "NUT", "NOT", "NAP"]];
const PICTURES = [
  { name: "plus", rows: ["00100", "00100", "11111", "00100", "00100"] },
  { name: "X", rows: ["10001", "01010", "00100", "01010", "10001"] },
  { name: "heart", rows: ["01010", "11111", "11111", "01110", "00100"] },
  { name: "arrow", rows: ["00100", "01110", "10101", "00100", "00100"] },
  { name: "smiley", rows: ["01010", "01010", "00000", "10001", "01110"] },
  { name: "house", rows: ["00100", "01110", "11111", "11111", "11011"] },
  { name: "L", rows: ["10000", "10000", "10000", "10000", "11111"] },
  { name: "T", rows: ["11111", "00100", "00100", "00100", "00100"] },
  { name: "diamond", rows: ["00100", "01110", "11111", "01110", "00100"] },
  { name: "Z", rows: ["11111", "00010", "00100", "01000", "11111"] }
];
const NAMED = { red: [255, 0, 0], green: [0, 255, 0], blue: [0, 0, 255], yellow: [255, 255, 0], cyan: [0, 255, 255], magenta: [255, 0, 255], white: [255, 255, 255], black: [0, 0, 0], orange: [255, 128, 0], purple: [128, 0, 128], gray: [128, 128, 128] };
const LOSSLESS = ["A ZIP file of your homework documents", "A medical X-ray where every tiny detail matters", "A text file. Every character must come back exactly", "The source code of a game you are building", "A spreadsheet of bank records", "A legal contract that must be identical after unzipping"];
const LOSSY = ["A concert video streamed to thousands of phones on slow Wi-Fi", "A vacation photo saved as a small JPEG to post online", "An MP3 of a song for a phone with little storage", "A video call that has to keep up in real time", "A profile picture shrunk so a web page loads fast"];
const VAULT_BIT_FACTS = [
  { p: "ASCII and Unicode are both ways to...", right: "store text characters as binary numbers", wrong: ["compress photos", "send packets across the Internet", "encrypt passwords"], why: "A character set gives every letter, digit and symbol its own number, which is stored in binary." },
  { p: "Why was Unicode created when ASCII already existed?", right: "ASCII does not have enough codes for every language and emoji", wrong: ["ASCII was too slow", "ASCII cannot store numbers", "Unicode uses fewer bits for everything"], why: "ASCII only has 128 codes. Unicode has room for characters from all the world's writing systems and emoji." },
  { p: "A text file stores 'HELLO' using one byte per character. How many bits is that?", right: "40", wrong: ["5", "8", "10"], why: "5 characters x 8 bits per byte = 40 bits." },
  { p: "What is a byte?", right: "a group of 8 bits", wrong: ["a group of 4 bits", "one single bit", "a group of 16 bits"], why: "A byte is 8 bits, enough for 256 different values (0 to 255)." }
];
const VAULT_HEX_FACTS = [
  { p: "How many bits does ONE hexadecimal digit stand for?", right: "4", wrong: ["2", "8", "16"], why: "A hex digit has 16 possible values (0 to F), and 4 bits make exactly 16 values." },
  { p: "What is the largest 2-digit hexadecimal number?", right: "FF", wrong: ["99", "F9", "100"], why: "FF is 15 x 16 + 15 = 255, the biggest value one byte can hold." },
  { p: "Why do programmers like hexadecimal for colors and addresses?", right: "It is a short way to write long binary numbers", wrong: ["Computers cannot read decimal", "It is encrypted", "It uses less memory than binary"], why: "Each hex digit replaces 4 bits, so 8 bits become just 2 hex digits." },
  { p: "In the hex color #FF0000, which color channel is turned all the way up?", right: "red", wrong: ["green", "blue", "none, it is black"], why: "Colors are written #RRGGBB. The first pair (FF = 255) is red, and the other two pairs are 00." }
];
const VAULT_COLOR_FACTS = [
  { p: "A pixel stores red, green and blue as one byte each. How many bits is ONE pixel?", right: "24", wrong: ["8", "3", "256"], why: "3 channels x 8 bits = 24 bits per pixel." },
  { p: "The color (0, 0, 0) is...", right: "black", wrong: ["white", "red", "transparent"], why: "With every channel at 0, no light is added, so the pixel is black." },
  { p: "What does a pixel with R, G and B all at 255 look like?", right: "white", wrong: ["black", "gray", "yellow"], why: "All three lights at full brightness make white." },
  { p: "A picture has more pixels packed into the same space. What happens to its resolution?", right: "It gets higher and shows more detail", wrong: ["It gets lower", "Nothing changes", "It turns black and white"], why: "More pixels means a higher resolution and a sharper picture." }
];
const VAULT_CRYPTO_FACTS = [
  { p: "Using PUBLIC-KEY encryption, which key do you use to lock a message to Ana so only she can read it?", right: "Ana's public key", wrong: ["Ana's private key", "Your own private key", "No key. It is just hidden"], why: "Anyone can lock with the public key, but only Ana's private key can unlock it." },
  { p: "What is the main weakness of a Caesar cipher?", right: "There are only 25 shifts, so it is easy to break by trying them all", wrong: ["It needs a quantum computer", "It cannot encrypt letters", "The message gets longer"], why: "Trying every shift is called brute force. With only 25 shifts it takes seconds." },
  { p: "Why is public-key encryption so useful on the Internet?", right: "Strangers can share secrets without first sharing a secret key", wrong: ["It makes downloads faster", "It deletes viruses", "It compresses files"], why: "The public key can be shared openly, so two people who have never met can still communicate securely." },
  { p: "In symmetric encryption, how many keys are used?", right: "One key that both sides share", wrong: ["Two different keys", "No keys", "A new key for every letter"], why: "Symmetric means the same secret key locks and unlocks. Public-key (asymmetric) uses a pair." }
];
const factRound = (r, pool, topic, t) => { const f = pick(r, pool); return mc(r, f.p, f.right, f.wrong, f.why, { topic }, t || 30); };
const withTopic = (x, topic) => { x.q.topic = topic; return x; };

function vaultQ(seed, i) {
  const r = R(seed, i);
  switch (i) {
    case 0: { const target = int(r, 37, 250); return { q: { type: "bits", target, topic: "Binary numbers", prompt: "The keypad wants the code " + target + ". Flip the switches (each one is a place value in binary) until the total matches.", t: 50 }, a: { value: target }, why: target + " in binary is " + bits8(target) + ". Add up the place values that are lit." }; }
    case 1: {
      const k = int(r, 0, 3), T = "Bits and numbers";
      if (k === 0) { const n = int(r, 3, 8), right = Math.pow(2, n); return mc(r, "A lock stores its code in " + n + " bits. How many different codes is that?", String(right), shuffle(r, uniq([n * 2, n * n, Math.pow(2, n - 1), right - 1, right * 2].filter((x) => x !== right))).slice(0, 3).map(String), n + " bits give 2 x 2 x ... (" + n + " times) = " + right + " different values.", { topic: T }, 35); }
      if (k === 1) { const N = pick(r, [20, 40, 70, 100, 150, 200]), need = Math.ceil(Math.log2(N)); return mc(r, "The vault has " + N + " different guards and each guard needs their own binary code. What is the FEWEST bits that can do it?", String(need), uniq([need - 1, need + 1, need + 2, N].map(String)).slice(0, 3), "With " + need + " bits you get " + Math.pow(2, need) + " codes, enough for " + N + ". With " + (need - 1) + " bits you only get " + Math.pow(2, need - 1) + ".", { topic: T }, 40); }
      if (k === 2) return mc(r, "A counter stores its number in 8 bits and shows 255. It tries to add 1 more. What is this problem called?", "Overflow", ["Round-off error", "Compression", "Encryption"], "8 bits can only hold up to 255. 256 does not fit, so the result is wrong. That is overflow.", { topic: T }, 30);
      return mc(r, "A computer stores 1/3 as 0.3333333 and loses a tiny bit of the true value. What is this called?", "Round-off error", ["Overflow", "Lossy compression", "A syntax error"], "Some numbers cannot be stored exactly in a fixed number of bits, so they are rounded. That small mistake is a round-off error.", { topic: T }, 30);
    }
    case 2: {
      const k = int(r, 0, 3), T = "Encoding text";
      if (k === 3) return factRound(r, VAULT_BIT_FACTS, T, 30);
      const g = pick(r, WORD_GROUPS), word = pick(r, g), codes = word.split("").map((c) => bits8(c.charCodeAt(0))).join(" ");
      return mc(r, "The guard's note is written in ASCII binary. Hint: A = 01000001 = 65, B = 66, C = 67 and so on. What does it say?", word, g.filter((w) => w !== word), "Each group of 8 bits is one letter. " + word.split("").map((c) => bits8(c.charCodeAt(0)) + " = " + c.charCodeAt(0) + " = " + c).join(", ") + ".", { topic: T, code: codes, fixed: true }, 60);
    }
    case 3: {
      const pic = pick(r, PICTURES), inv = r() < 0.4, flat = pic.rows.join("").split("").map((b) => (inv ? (b === "1" ? "0" : "1") : b)).join("");
      return { q: { type: "grid", w: 5, h: 5, topic: "Pixel images", prompt: "The scanner sent " + flat.length + " bits for a picture that is 5 pixels wide and 5 tall. Rows are sent one after another. " + (inv ? "Here 1 = WHITE and 0 = BLACK." : "Here 1 = BLACK and 0 = WHITE.") + " Paint the black pixels.", code: flat, t: 90 }, a: { rows: pic.rows }, why: "Cut the " + flat.length + " bits into rows of 5. " + (inv ? "Black pixels are the 0s." : "Black pixels are the 1s.") + " The picture is a " + pic.name + "." };
    }
    case 4: {
      const k = pick(r, [0, 0, 1, 1, 2]), T = "Hexadecimal";
      if (k === 2) return factRound(r, VAULT_HEX_FACTS, T, 30);
      const d1 = int(r, 1, 15), d2 = int(r, 0, 15), val = d1 * 16 + d2, hx = d1.toString(16).toUpperCase() + d2.toString(16).toUpperCase(), swap = d2 * 16 + d1, hint = "Hex digits: A=10  B=11  C=12  D=13  E=14  F=15";
      if (k === 0) return mc(r, "The vault door shows the hex code " + hx + ". What is that in decimal?", String(val), uniq([swap, val + 16, val - 16, val + 1, d1 * 10 + d2].filter((x) => x !== val && x >= 0)).slice(0, 3).map(String), hx + " = " + d1 + " x 16 + " + d2 + " = " + val + ". The left digit is worth 16 each.", { topic: T, code: hint, fixed: true }, 45);
      return mc(r, "The panel needs the decimal number " + val + " typed in hex. What is it?", hx, uniq([d2.toString(16).toUpperCase() + d1.toString(16).toUpperCase(), (val + 1).toString(16).toUpperCase().padStart(2, "0"), clamp255(val - 16).toString(16).toUpperCase().padStart(2, "0"), clamp255(val + 16).toString(16).toUpperCase().padStart(2, "0")].filter((x) => x !== hx)).slice(0, 3), val + " / 16 = " + d1 + " remainder " + d2 + ", so it is " + hx + ".", { topic: T, code: hint, fixed: true }, 50);
    }
    case 5: {
      const k = pick(r, [0, 1, 1, 2, 3]), T = "Pixel colors";
      if (k === 3) return factRound(r, VAULT_COLOR_FACTS, T, 30);
      if (k === 0) {
        const names = Object.keys(NAMED), nm = pick(r, names.filter((x) => x !== "gray"));
        return { q: { type: "rgb", levels: [0, 128, 255], topic: T, prompt: "Mix the paint to make " + nm.toUpperCase() + ". Set the red, green and blue light.", t: 45 }, a: { rgb: NAMED[nm] }, why: nm + " is " + rgbText(NAMED[nm]) + ". Light mixes by adding: red + green = yellow, green + blue = cyan, red + blue = magenta, all three = white." };
      }
      if (k === 1) {
        const lv = [0, 64, 128, 192, 255], rgb = [pick(r, lv), pick(r, lv), pick(r, lv)];
        if (rgb.every((x) => x === rgb[0])) rgb[2] = pick(r, lv.filter((x) => x !== rgb[0]));
        const hex = "#" + rgb.map(hex2).join("");
        return { q: { type: "rgb", levels: lv, topic: T, prompt: "The color lock wants the hex color " + hex + ". Set red, green and blue to the right decimal values. (Hex pairs: 00 = 0, 40 = 64, 80 = 128, C0 = 192, FF = 255.)", code: hex, t: 60 }, a: { rgb }, why: hex + " is split into pairs: " + rgb.map((x) => hex2(x) + " = " + x).join(", ") + ". Red is first, then green, then blue." };
      }
      const nm = pick(r, ["red", "green", "blue", "yellow", "cyan", "magenta", "white", "black"]), right = "#" + NAMED[nm].map(hex2).join(""), others = Object.keys(NAMED).filter((x) => "#" + NAMED[x].map(hex2).join("") !== right && ["red", "green", "blue", "yellow", "cyan", "magenta", "white", "black"].indexOf(x) > -1).map((x) => "#" + NAMED[x].map(hex2).join(""));
      return mc(r, "Which hex code makes the color " + nm.toUpperCase() + "?", right, shuffle(r, others).slice(0, 3), "Hex colors are #RRGGBB. " + nm + " is " + rgbText(NAMED[nm]) + ", which is " + right + ".", { topic: T }, 40);
    }
    case 6: {
      const k = int(r, 0, 3), T = "Image filters", a = int(r, 20, 230), p = [a, int(r, 20, 230), int(r, 20, 230)];
      if (k === 0) { const out = p.map((v) => 255 - v); return mc(r, "The INVERT filter turns every value v into 255 - v. What does the pixel " + rgbText(p) + " become?", rgbText(out), uniq([rgbText([out[0], p[1], out[2]]), rgbText([out[2], out[1], out[0]]), rgbText([255 - p[0], 255 - p[1], p[2]])].filter((x) => x !== rgbText(out))).slice(0, 3), "255 - " + p[0] + " = " + out[0] + ", 255 - " + p[1] + " = " + out[1] + ", 255 - " + p[2] + " = " + out[2] + ".", { topic: T }, 40); }
      if (k === 1) { const q2 = [int(r, 30, 220), int(r, 30, 220)]; let c = int(r, 30, 220); c -= (q2[0] + q2[1] + c) % 3; if (c < 0) c += 3; const px = [q2[0], q2[1], c], avg = (px[0] + px[1] + px[2]) / 3; return mc(r, "The GRAYSCALE filter sets all three values to the average of the three. What does " + rgbText(px) + " become?", rgbText([avg, avg, avg]), uniq([rgbText([px[0], px[0], px[0]]), rgbText([Math.max.apply(null, px), Math.max.apply(null, px), Math.max.apply(null, px)]), rgbText([avg + 30, avg + 30, avg + 30]), rgbText([px[2], px[2], px[2]])].filter((x) => x !== rgbText([avg, avg, avg]))).slice(0, 3), "(" + px.join(" + ") + ") / 3 = " + avg + ", and gray has the same value in all three channels.", { topic: T }, 50); }
      if (k === 2) { const ch = pick(r, [0, 1, 2]), name = ["RED", "GREEN", "BLUE"][ch], out = p.slice(); out[ch] = 0; const w1 = p.slice(); w1[ch] = 255; const w2 = p.map((v, j) => (j === ch ? v : 0)); return mc(r, "A filter sets the " + name + " value of every pixel to 0. What does " + rgbText(p) + " become?", rgbText(out), uniq([rgbText(w1), rgbText(w2), rgbText(p.map((v) => 0))].filter((x) => x !== rgbText(out))).slice(0, 3), "Only the " + name.toLowerCase() + " channel changes to 0. The other two stay as they were: " + rgbText(out) + ".", { topic: T }, 40); }
      const amt = pick(r, [30, 40, 50]), hi = [int(r, 215, 245), int(r, 40, 180), int(r, 10, 100)], out = hi.map((v) => Math.min(255, v + amt)), raw = hi.map((v) => v + amt);
      return mc(r, "A BRIGHTEN filter adds " + amt + " to every value, but a value can never go above 255. What does " + rgbText(hi) + " become?", rgbText(out), uniq([rgbText(raw), rgbText(hi), rgbText(hi.map((v) => Math.max(0, v - amt)))].filter((x) => x !== rgbText(out))).slice(0, 3), hi[0] + " + " + amt + " = " + raw[0] + ", but one byte tops out at 255, so it is capped at 255. The others are just added.", { topic: T }, 45);
    }
    case 7: {
      const k = pick(r, [0, 0, 1, 1, 2]), T = "Run-length compression", L = ["A", "B", "C", "W", "X", "Z"];
      const runs = () => { const out = []; let last = ""; for (let j = 0; j < 3; j++) { let c; do { c = pick(r, L); } while (c === last); last = c; out.push([int(r, 2, 5), c]); } return out; };
      const rl = (rs) => rs.map((x) => x[0] + x[1]).join(""), ex = (rs) => rs.map((x) => x[1].repeat(x[0])).join("");
      if (k === 0) { const rs = runs(); const alt = rs.map((x, j) => (j === 0 ? [x[0] + 1, x[1]] : x)), swapC = rs.map((x, j) => (j === 0 ? [x[0], rs[1][1]] : j === 1 ? [x[0], rs[0][1]] : x)); return mc(r, "Run-length encoding wrote this: " + rl(rs) + ". What was the ORIGINAL data?", ex(rs), uniq([ex(alt), ex(swapC), rs.map((x) => x[1]).join("")].filter((x) => x !== ex(rs))).slice(0, 3), "Read it as 'count then letter': " + rs.map((x) => x[0] + x[1] + " = " + x[1].repeat(x[0])).join(", ") + ".", { topic: T, fixed: true }, 45); }
      if (k === 1) { const rs = runs(); return mc(r, "Run-length encode this data: " + ex(rs), rl(rs), uniq([rs.map((x) => x[1] + x[0]).join(""), rl(rs.map((x, j) => (j === 0 ? [x[0] + 1, x[1]] : x))), rl(rs.slice(0, 2)), rl([[rs[0][0] + rs[1][0], rs[0][1]], rs[2]])].filter((x) => x !== rl(rs))).slice(0, 3), "Count each run of the same letter: " + rs.map((x) => x[1].repeat(x[0]) + " = " + x[0] + x[1]).join(", ") + ".", { topic: T, fixed: true }, 45); }
      const a1 = pick(r, L), b1 = pick(r, L.filter((x) => x !== a1)), good = a1.repeat(int(r, 7, 9)) + b1.repeat(int(r, 7, 9)), alt = (a1 + b1).repeat(8);
      const abc = ALPHA.slice(0, 16);
      return mc(r, "Which data would run-length encoding shrink the MOST?", good, [alt, abc], "Run-length encoding wins when the same value repeats in long runs. " + good + " is just two runs. The other strings change every character, so there is nothing to shorten.", { topic: T, fixed: true }, 35);
    }
    case 8: {
      const k = int(r, 0, 3), T = "Lossless vs lossy";
      if (k === 3) { const f = pick(r, [{ p: "What is TRUE about LOSSY compression?", right: "Some data is thrown away for good and cannot be restored", wrong: ["Every original bit can be rebuilt exactly", "It always makes a file bigger", "It only works on text"], why: "Lossy compression permanently removes details people are least likely to notice, so the original cannot be rebuilt." }, { p: "What is TRUE about LOSSLESS compression?", right: "The original data can be rebuilt perfectly", wrong: ["It throws away details nobody notices", "It makes files smaller than any lossy method", "It only works on photos"], why: "Lossless methods (like ZIP or run-length encoding) store the same information in fewer bits, so decompressing gives back the exact original." }]); return mc(r, f.p, f.right, f.wrong, f.why, { topic: T }, 30); }
      const lossy = r() < 0.5, text = lossy ? pick(r, LOSSY) : pick(r, LOSSLESS);
      return mc(r, "Which kind of compression is the BEST choice? " + text + ".", lossy ? "Lossy" : "Lossless", [lossy ? "Lossless" : "Lossy"], lossy ? "Lossy is best here: a smaller file and speed matter more than perfect detail, and people will not notice the missing data." : "Lossless is best here: every bit must come back exactly, so nothing can be thrown away.", { topic: T }, 30);
    }
    default: {
      const k = pick(r, [0, 1, 2]), T = "Cryptography BOSS";
      if (k === 2) return factRound(r, VAULT_CRYPTO_FACTS, T, 35);
      const words = ["VAULT", "SECRET", "CODE", "AGENT", "LOCK", "CIPHER", "BINARY", "GOLD", "SAFE", "BITS"], word = pick(r, words), s = int(r, 2, 9), strip = "Plain:  " + ALPHA + "\nShift:  " + caesar(ALPHA, s);
      if (k === 0) { const cipher = caesar(word, s); return mc(r, "BOSS! A Caesar cipher shifted every letter FORWARD by " + s + ". The intercepted message is " + cipher + ". What did it say?", word, uniq([caesar(cipher, s), caesar(word, 1), caesar(cipher, -(s + 1))].filter((x) => x !== word)).slice(0, 3), "To decrypt, shift every letter BACK by " + s + ": " + cipher + " becomes " + word + ".", { topic: T, code: "Alphabet: " + ALPHA }, 75); }
      const cipher = caesar(word, s); return mc(r, "BOSS! Encrypt the password " + word + " with a Caesar cipher that shifts every letter FORWARD by " + s + ".", cipher, uniq([caesar(word, -s), caesar(word, s + 1), caesar(word, s - 1)].filter((x) => x !== cipher)).slice(0, 3), "Move each letter forward " + s + " places (wrapping Z back to A): " + word + " becomes " + cipher + ".", { topic: T, code: "Alphabet: " + ALPHA }, 75);
    }
  }
}
function vaultCheck(a, ans) {
  if (!ans || ans.timeout) return false;
  if ("idx" in a) return ans.idx === a.idx;
  if ("value" in a) return Number(ans.value) === a.value;
  if (a.rows) return Array.isArray(ans.rows) && ans.rows.length === a.rows.length && a.rows.every((row, k) => typeof ans.rows[k] === "string" && ans.rows[k] === row);
  if (a.values) return Array.isArray(ans.values) && ans.values.length === a.values.length && a.values.every((v, k) => Number(ans.values[k]) === v);
  if (a.rgb) return Array.isArray(ans.rgb) && ans.rgb.length === 3 && a.rgb.every((v, k) => Number(ans.rgb[k]) === v);
  return false;
}


/* ================================================================== 7. LESSON VAULTS: one 10-round game for each Unit 8 lesson ==== */
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const bin4 = (n) => n.toString(2).padStart(4, "0");
const hd = (n) => n.toString(16).toUpperCase();
const hashKey = (k) => { let h = 7; for (let i = 0; i < k.length; i++) h = (Math.imul(h, 31) + k.charCodeAt(i)) >>> 0; return h; };
const M3 = (r, p, right, wrong, why, extra, t) => mc(r, p, right, uniq(wrong).filter((w) => w !== right).slice(0, 3), why, extra, t);
const G = (key, gen) => ({ key, gen });
/* a question taken from a pool of facts: the same fact never appears twice in one game */
const PG = (key, pool, t) => G(key, (r, n, seed) => { const f = shuffle(rng((Number(seed) ^ hashKey(key)) >>> 0), pool)[n % pool.length]; return M3(r, f.p, f.right, f.wrong, f.why, {}, t || 30); });
const PVALS = [128, 64, 32, 16, 8, 4, 2, 1];
const lit = (n) => PVALS.filter((v) => n & v).join(" + ") + " = " + n;
const NAMES8 = ["red", "green", "blue", "yellow", "cyan", "magenta", "white", "black"];
const hexOf = (rgb) => "#" + rgb.map(hex2).join("");
const WORD4 = [["GOLD", "GOLF", "COLD", "BOLD"], ["FISH", "DISH", "WISH", "FIST"], ["BARK", "DARK", "PARK", "BARN"], ["LAMP", "LAMB", "LIMP", "LIMB"], ["SAFE", "SALE", "SANE", "SAGE"], ["DOOR", "DOON", "POOR", "DOOM"]];

/* ---- fact pools ---- */
const ANALOG_FACTS = [
  { p: "Which of these is ANALOG data?", right: "The smooth, continuously changing groove of a vinyl record", wrong: ["A text message", "An MP3 file", "A bitmap picture"], why: "Analog data changes smoothly with no gaps. Digital data is stored as separate numbers." },
  { p: "A digital recording measures a sound wave at regular moments. Each measurement is called a...", right: "sample", wrong: ["pixel", "packet", "byte"], why: "One measurement of the signal at one moment is a sample." },
  { p: "What happens when the SAMPLING RATE of a recording is increased?", right: "The copy matches the original sound more closely, and the file gets bigger", wrong: ["The file gets smaller and sounds the same", "The sound turns into text", "The recording becomes analog"], why: "More samples per second capture more detail, but they also need more bits to store." },
  { p: "Why do computers store everything as 1s and 0s?", right: "The hardware has two clear states, like on and off, that stand for 1 and 0", wrong: ["Decimal numbers do not exist inside a computer", "1s and 0s take more space than letters", "It is only a rule for the Internet"], why: "Two states are easy and reliable to build in hardware, and any data can be written with them." },
  { p: "Showing a photo as a grid of numbers is an example of...", right: "abstraction", wrong: ["encryption", "overflow", "a protocol"], why: "Abstraction means representing something complex in a simpler form that hides the details." },
  { p: "Turning a smooth sound wave into samples creates...", right: "an approximation of the original", wrong: ["an exact copy that can never differ", "an analog signal", "an encrypted file"], why: "Sampling records separate moments, so the digital version is an approximation. More samples make it closer." }
];
const UNITS_FACTS = [
  { p: "Which is the BIGGEST amount of data?", right: "1 gigabyte", wrong: ["1 megabyte", "1 kilobyte", "1 byte"], why: "Each step up (byte, kilobyte, megabyte, gigabyte) holds about a thousand times more." },
  { p: "How many bits are in 2 bytes?", right: "16", wrong: ["2", "8", "32"], why: "1 byte = 8 bits, so 2 bytes = 16 bits." },
  { p: "Which is the SMALLEST unit of data?", right: "a bit", wrong: ["a byte", "a kilobyte", "a megabyte"], why: "A bit is a single 1 or 0. A byte is 8 bits." },
  { p: "A file is 4 bytes. How many bits does it hold?", right: "32", wrong: ["4", "8", "16"], why: "4 bytes x 8 bits = 32 bits." }
];
const TEXT_FACTS = VAULT_BIT_FACTS.concat([
  { p: "ASCII uses 7 bits for each character. How many different characters can it hold?", right: "128", wrong: ["64", "256", "7"], why: "7 bits give 2 x 2 x 2 x 2 x 2 x 2 x 2 = 128 different codes." },
  { p: "Which system can store emoji and letters from many languages?", right: "Unicode", wrong: ["ASCII", "Hexadecimal", "Run-length encoding"], why: "Unicode has room for over a million characters, including emoji." }
]);
const PIXEL_FACTS = [
  { p: "What is a PIXEL?", right: "the smallest single dot of color in a digital image", wrong: ["a unit of sound", "a type of compression", "a kind of network cable"], why: "A digital image is a grid of pixels, and each pixel has its own color value." },
  { p: "Two photos show the same scene. Photo B has twice as many pixels in the same space. Photo B has...", right: "a higher resolution and more detail", wrong: ["a lower resolution", "less detail but a smaller file", "fewer colors"], why: "More pixels in the same space means higher resolution and more detail." },
  { p: "In a bitmap image, what do the stored bits describe?", right: "the color of each pixel, row by row", wrong: ["the sound of the picture", "the name of the file", "only the number of rows"], why: "A bitmap is the color of every pixel written out as bits, one row after another." },
  { p: "Why do bigger images take more storage?", right: "They contain more pixels, and each pixel needs its own bits", wrong: ["Their pixels are heavier", "They always use lossy compression", "Large images use ASCII"], why: "Storage grows with the number of pixels times the bits for each pixel." }
];
const HEX_FACTS2 = VAULT_HEX_FACTS.concat([
  { p: "Which is a legal hexadecimal number?", right: "3F9", wrong: ["3G9", "3Z9", "3 9"], why: "Hex digits are 0 to 9 and A to F only. G and Z are not hex digits." }
]);
const COLOR_FACTS2 = VAULT_COLOR_FACTS.concat([
  { p: "In the hex color #RRGGBB, what does the MIDDLE pair control?", right: "the amount of green", wrong: ["the amount of red", "the amount of blue", "the brightness only"], why: "The pairs are in the order red, green, blue." },
  { p: "What color is the hex code #000000?", right: "black", wrong: ["white", "red", "transparent"], why: "Every channel is 00, so no light is added: black." }
]);
const FILTER_FACTS = [
  { p: "An image filter changes a picture by...", right: "doing math on each pixel's red, green and blue numbers", wrong: ["rewriting it in ASCII", "encrypting every pixel", "deleting every other row"], why: "A pixel is just three numbers, so a filter is just math on those numbers." },
  { p: "After a GRAYSCALE filter, what is true of every pixel?", right: "its red, green and blue values are all equal", wrong: ["its red value is 0", "its three values are all 255", "it uses more bits"], why: "Gray means equal amounts of red, green and blue." },
  { p: "Why do filters need to stop values at 0 and 255?", right: "One byte can only hold the numbers 0 to 255", wrong: ["Cameras can only see 255 pixels", "Gray is 255", "Hex only goes to 99"], why: "Each channel is stored in one byte, so anything outside 0 to 255 cannot be stored." }
];
const COMP_FACTS = [
  { p: "Why do we compress files?", right: "To use less storage space and send them faster", wrong: ["To make them secret", "To fix mistakes in them", "To turn them analog"], why: "Compression makes data smaller, which saves storage and transfer time." },
  { p: "A ZIP file is an example of which kind of compression?", right: "lossless", wrong: ["lossy", "encryption", "analog"], why: "ZIP keeps every bit, so unzipping rebuilds the exact original." },
  { p: "Lossless compression works by...", right: "finding patterns, like repeats, and describing them in fewer bits", wrong: ["throwing away details nobody notices", "making pixels bigger", "encrypting the data"], why: "Run-length encoding is one example: it replaces a long run with a count." },
  { p: "After lossless compression and decompression, you get...", right: "exactly the original data", wrong: ["a slightly worse copy", "a smaller picture", "an encrypted file"], why: "Lossless means nothing is lost." },
  { p: "Run-length encoding works best on data that has...", right: "long runs of the same value", wrong: ["no repeated values at all", "only letters", "only odd numbers"], why: "A long run becomes one short count and value, so lots of repeats means big savings." }
];
const LOSSY_FACTS = [
  { p: "What is TRUE about LOSSY compression?", right: "Some data is thrown away for good and cannot be restored", wrong: ["Every original bit can be rebuilt exactly", "It always makes a file bigger", "It only works on text"], why: "Lossy compression permanently removes details people are least likely to notice." },
  { p: "Which of these file types uses LOSSY compression?", right: "a JPEG photo", wrong: ["a ZIP archive", "a PNG screenshot", "a FLAC audio file"], why: "JPEG throws away detail to make photos small. ZIP, PNG and FLAC are lossless." },
  { p: "Which of these uses LOSSY compression?", right: "an MP3 song", wrong: ["a ZIP archive", "a PNG image", "a FLAC audio file"], why: "MP3 removes sounds people are unlikely to hear. ZIP, PNG and FLAC keep everything." },
  { p: "You open a JPEG, edit it, and save it as a JPEG again, over and over. What happens?", right: "The quality slowly gets worse each time", wrong: ["The quality improves", "Nothing changes", "The file turns lossless"], why: "Each lossy save throws away a little more detail, and it adds up." },
  { p: "A website lowers its image quality setting so pages load faster. What is the trade-off?", right: "A smaller file, but less detail and more visible flaws", wrong: ["A bigger file and a sharper image", "The same file, but encrypted", "There is no trade-off"], why: "Lossy compression trades quality for size." },
  { p: "Why does a lossy file usually look or sound slightly different from the original?", right: "Some detail was removed to make the file smaller", wrong: ["The file was encrypted", "It was converted to analog", "Its bits were reversed"], why: "Lossy methods drop detail people are least likely to notice, so the result is close but not identical." },
  { p: "Which is the best reason to choose lossy compression?", right: "Smaller files and faster sending matter more than perfect quality", wrong: ["You need every bit to come back exactly", "You want the file to be secret", "You are compressing source code"], why: "Lossy trades some quality for a much smaller file." },
  { p: "Can you get the exact original photo back from a lossy-compressed JPEG?", right: "No, the removed details are gone for good", wrong: ["Yes, always", "Yes, if you zip it", "Only if you rename it"], why: "Lossy compression is not reversible, which is why you keep the original if it matters." }
];
const CRYPTO_FACTS = VAULT_CRYPTO_FACTS.concat([
  { p: "The original, readable message is called the...", right: "plaintext", wrong: ["ciphertext", "key", "hash"], why: "Plaintext is the readable message. Encryption turns it into ciphertext." },
  { p: "The scrambled message produced by encryption is called the...", right: "ciphertext", wrong: ["plaintext", "public key", "protocol"], why: "Ciphertext is what an eavesdropper sees." },
  { p: "In a Caesar cipher, what is the KEY?", right: "the shift number", wrong: ["the first letter of the message", "the alphabet", "the length of the message"], why: "Anyone who knows the shift can decrypt. Without it, an attacker has to guess." },
  { p: "In public-key encryption, which key can you safely share with everyone?", right: "the public key", wrong: ["the private key", "both keys", "neither key"], why: "The public key only locks messages. The private key unlocks them, so it stays secret." }
]);

/* ---- number generators ---- */
const gBitsBuild = (lo, hi, key) => G(key || "bitsBuild", (r) => { const target = int(r, lo, hi); return { q: { type: "bits", target, prompt: "The panel needs the number " + target + ". Flip the switches (each is a place value) until the total matches.", t: 45 }, a: { value: target }, why: target + " in binary is " + bits8(target) + ". The lit place values are " + lit(target) + "." }; });
const gBin2Dec = (lo, hi) => G("bin2dec", (r) => { const n = int(r, lo, hi); return M3(r, "The panel shows " + bits8(n) + ". What is that in decimal?", String(n), shuffle(r, [n + 1, n - 1, n + 16, n - 16, n ^ 3, n ^ 64].filter((x) => x >= 0 && x <= 255 && x !== n)).map(String), bits8(n) + " = " + lit(n) + ".", { code: bits8(n) }, 35); });
const gDec2Bin = G("dec2bin", (r) => { const n = int(r, 20, 250); return M3(r, "Which 8-bit binary number equals " + n + " in decimal?", bits8(n), shuffle(r, [n ^ 1, n ^ 2, n ^ 8, n ^ 16, n ^ 64].filter((x) => x >= 0 && x <= 255)).map(bits8), "Find the place values that add up to " + n + ": " + lit(n) + ". Write 1 under those places and 0 under the others: " + bits8(n) + ".", {}, 45); });
const gNBitsValues = G("nvalues", (r) => { const n = int(r, 3, 9), right = Math.pow(2, n); return M3(r, "A lock stores its code in " + n + " bits. How many different codes is that?", String(right), shuffle(r, [n * 2, n * n, Math.pow(2, n - 1), right - 1, right * 2]).map(String), n + " bits give 2 x 2 x ... (" + n + " times) = " + right + " different values.", {}, 35); });
const gMaxValue = G("maxvalue", (r) => { const n = int(r, 3, 9), right = Math.pow(2, n) - 1; return M3(r, "What is the LARGEST number that fits in " + n + " bits?", String(right), [Math.pow(2, n), Math.pow(2, n - 1), n * n, right - 1].map(String), n + " bits can make " + Math.pow(2, n) + " values, and counting starts at 0, so the biggest is " + Math.pow(2, n) + " - 1 = " + right + ".", {}, 35); });
const gBitsNeeded = G("bitsneeded", (r) => { const N = pick(r, [20, 40, 70, 100, 150, 200, 300]), need = Math.ceil(Math.log2(N)); return M3(r, "The vault has " + N + " guards and each needs their own binary code. What is the FEWEST bits that can do it?", String(need), [need - 1, need + 1, need + 2, N].map(String), "With " + need + " bits you get " + Math.pow(2, need) + " codes, enough for " + N + ". With " + (need - 1) + " bits you only get " + Math.pow(2, need - 1) + ".", {}, 40); });
const gOverflow = G("overflow", (r) => { const k = int(r, 0, 2); if (k === 0) return mc(r, "A counter stores its number in 8 bits and shows 255. It tries to add 1 more. What is this problem called?", "Overflow", ["Round-off error", "Compression", "Encryption"], "8 bits can only hold up to 255. 256 does not fit, so the result is wrong. That is overflow.", {}, 30); const n = int(r, 4, 7), mx = Math.pow(2, n) - 1; if (k === 1) return M3(r, "A counter has only " + n + " bits and is showing its biggest value. What happens if the program adds 1?", "Overflow: the new number does not fit", ["It stores a bigger number with no problem", "The counter turns analog", "The extra 1 is compressed"], "The biggest number in " + n + " bits is " + mx + ". Adding 1 needs " + (n + 1) + " bits, which are not there.", {}, 30); return M3(r, "Which number would cause OVERFLOW in a " + n + "-bit counter?", String(mx + 1 + int(r, 0, 5)), [String(mx), String(mx - 1), "0"], "A " + n + "-bit counter holds 0 to " + mx + ". Anything bigger does not fit.", {}, 30); });
const gRoundoff = G("roundoff", (r) => { const k = int(r, 0, 1); if (k === 0) return mc(r, "A computer stores 1/3 as 0.3333333 and loses a tiny bit of the true value. What is this called?", "Round-off error", ["Overflow", "Lossy compression", "A syntax error"], "Some numbers cannot be stored exactly in a fixed number of bits, so they are rounded. That small mistake is a round-off error.", {}, 30); return mc(r, "Why can a computer get 0.1 + 0.2 slightly wrong, like 0.30000000000000004?", "Some decimals cannot be stored exactly in binary, so they are rounded", ["The computer forgot how to add", "The numbers overflowed", "The result was lossy compressed"], "Just like 1/3 cannot be written exactly in decimal, 0.1 cannot be written exactly in binary. That is round-off error.", {}, 35); });
const gNextBin = G("nextbin", (r) => { const n = int(r, 1, 12); return M3(r, "Counting in binary: what comes right after " + bin4(n) + "?", bin4(n + 1), [n + 2, n + 3, n - 1].map(bin4), bin4(n) + " is " + n + ". The next number is " + (n + 1) + ", which is " + bin4(n + 1) + ".", {}, 30); });
const gBinAdd = G("binadd", (r) => { const a = int(r, 1, 9), b = int(r, 1, 15 - a), s = a + b; return M3(r, "Add these binary numbers: " + bin4(a) + " + " + bin4(b), bin4(s), [s + 1, s - 1, s + 2].map(bin4), bin4(a) + " is " + a + " and " + bin4(b) + " is " + b + ". " + a + " + " + b + " = " + s + ", which is " + bin4(s) + ".", {}, 50); });
const gPlaceValue = G("placevalue", (r) => { const p = int(r, 3, 8); return M3(r, "In an 8-bit binary number, what is the place value of digit number " + p + " counting from the RIGHT? (The right-most digit is number 1.)", String(Math.pow(2, p - 1)), [p, Math.pow(2, p), Math.pow(2, p - 2), p * 2].map(String), "The place values from the right are 1, 2, 4, 8, 16, 32, 64, 128. Digit number " + p + " is worth " + Math.pow(2, p - 1) + ".", {}, 30); });
const gBitsIp = G("bitsip4", (r) => { const targets = [int(r, 16, 250), int(r, 16, 250), int(r, 16, 250), int(r, 16, 250)]; return { q: { type: "bitsip", targets, prompt: "BOSS! Four locks, four numbers. Set every row of switches to match " + targets.join(", ") + ".", t: 100 }, a: { values: targets }, why: targets.map((n) => n + " = " + bits8(n)).join(".  ") }; });

/* ---- text generators ---- */
const gAsciiBits = G("asciibits", (r) => { const k = int(r, 3, 25), L = ALPHA[k], target = 65 + k; return { q: { type: "bits", target, prompt: "The keypad wants the ASCII code for the letter " + L + ". (Hint: A = 65, B = 66, C = 67 and so on.) Flip the switches to build that number.", t: 60 }, a: { value: target }, why: L + " is " + k + " letters after A, so its code is 65 + " + k + " = " + target + ", which is " + bits8(target) + "." }; });
const gAsciiDecode = (groups, t, key) => G(key || "asciidec", (r) => { const g = pick(r, groups), word = pick(r, g), codes = word.split("").map((c) => bits8(c.charCodeAt(0))).join(" "); return mc(r, "The guard's note is in ASCII binary. Hint: A = 01000001 = 65, B = 66, C = 67 and so on. What does it say?", word, g.filter((w) => w !== word), "Each group of 8 bits is one letter. " + word.split("").map((c) => bits8(c.charCodeAt(0)) + " = " + c.charCodeAt(0) + " = " + c).join(", ") + ".", { code: codes }, t); });
const gAsciiEncode = G("asciienc", (r) => { const k = int(r, 2, 25), L = ALPHA[k], c = 65 + k; return M3(r, "Which binary code is the letter " + L + " in ASCII? (Hint: A = 01000001 = 65)", bits8(c), [c + 1, c - 1, c + 32, c - 2].map(bits8), L + " is " + k + " after A, so " + c + " = " + bits8(c) + ". (Lowercase letters are 32 higher.)", {}, 45); });
const gAsciiNumber = G("asciinum", (r) => { const k = int(r, 3, 25), L = ALPHA[k], c = 65 + k; if (r() < 0.5) return M3(r, "In ASCII, A = 65. What number is the letter " + L + "?", String(c), [c + 1, c - 1, c + 32, k].map(String), L + " is " + k + " letters after A: 65 + " + k + " = " + c + ".", {}, 30); return M3(r, "In ASCII, A = 65. Which letter has the code " + c + "?", L, [ALPHA[k + 1] || "A", ALPHA[k - 1], ALPHA[Math.max(0, k - 2)]].filter((x) => x), c + " - 65 = " + k + ", so it is the letter " + k + " places after A: " + L + ".", {}, 30); });
const gTextBits = G("textbits", (r) => { const ph = pick(r, ["HELLO WORLD", "GOOD LUCK", "BINARY", "OPEN SESAME", "SECRET CODE", "CRACK THE VAULT"]), n = ph.length; return M3(r, "A message \"" + ph + "\" is stored with ONE byte (8 bits) per character, spaces included. How many bits is that?", String(n * 8), [n, n * 7, (n - 1) * 8, n * 8 + 8].map(String), "There are " + n + " characters (spaces count). " + n + " x 8 = " + (n * 8) + " bits.", {}, 40); });
const gCaseDiff = G("casediff", (r) => { const k = int(r, 1, 9), l = String.fromCharCode(97 + k), c = 97 + k; return M3(r, "In ASCII, uppercase A = 65 and lowercase a = 97. What is the code for lowercase " + l + "?", String(c), [65 + k, c + 1, c - 1, c + 32].map(String), "Lowercase starts at 97 for a. " + l + " is " + k + " after a, so 97 + " + k + " = " + c + ".", {}, 35); });

/* ---- pixel generators ---- */
const flatBits = (rows, inv) => rows.join("").split("").map((b) => (inv ? (b === "1" ? "0" : "1") : b)).join("");
const gGrid = (invMode) => G("grid", (r) => { const pic = pick(r, PICTURES), inv = invMode === null || invMode === undefined ? r() < 0.4 : invMode, flat = flatBits(pic.rows, inv); return { q: { type: "grid", w: 5, h: 5, prompt: "The scanner sent " + flat.length + " bits for a picture that is 5 pixels wide and 5 tall. Rows are sent one after another. " + (inv ? "Here 1 = WHITE and 0 = BLACK." : "Here 1 = BLACK and 0 = WHITE.") + " Paint the black pixels.", code: flat, t: 90 }, a: { rows: pic.rows }, why: "Cut the " + flat.length + " bits into rows of 5. " + (inv ? "Black pixels are the 0s." : "Black pixels are the 1s.") + " The picture is a " + pic.name + "." }; });
const gGridRead = G("gridread", (r) => { const pic = pick(r, PICTURES), flat = pic.rows.join(""), show = pic.rows.map((row) => row.replace(/1/g, "#").replace(/0/g, ".")).join("\n"); const inv = flatBits(pic.rows, true), mir = pic.rows.map((row) => row.split("").reverse().join("")).join(""), flip = pic.rows.slice().reverse().join(""), one = flat.split("").map((b, k) => (k === 12 ? (b === "1" ? "0" : "1") : b)).join(""); return M3(r, "This 5 by 5 picture shows BLACK pixels as # (1) and WHITE pixels as . (0). Which bit string sends it, row by row from the top?", flat, [inv, mir, flip, one], "Read each row left to right, top to bottom, writing 1 for # and 0 for . gives " + flat + ".", { code: show }, 60); });
const gBmpSize = G("bmpsize", (r) => { const w = int(r, 4, 16), h = int(r, 4, 16); return M3(r, "A black-and-white image is " + w + " pixels wide and " + h + " pixels tall. Each pixel is 1 bit. How many bits is the image?", String(w * h), [w + h, w * h * 8, w * h * 3, (w - 1) * h].map(String), "The picture has " + w + " x " + h + " = " + (w * h) + " pixels, and each one needs 1 bit.", {}, 40); });
const gBitsPerPixel = G("bpp", (r) => { const bits = int(r, 1, 8), N = Math.pow(2, bits); return M3(r, "Each pixel must be able to show one of " + N + " different colors. What is the FEWEST bits per pixel that can do it?", String(bits), [bits - 1, bits + 1, N, bits * 2].map(String), bits + " bits give " + N + " different values, one for each color.", {}, 40); });
const gColorImgSize = G("colorsize", (r) => { const w = pick(r, [4, 5, 8, 10, 16, 20]), h = pick(r, [3, 6, 10, 12, 15]); return M3(r, "A color image is " + w + " by " + h + " pixels. Every pixel uses 24 bits (3 bytes). How many BYTES is the whole image?", String(w * h * 3), [w * h, w * h * 24, w * h * 8, w * h * 2].map(String), w + " x " + h + " = " + (w * h) + " pixels, and each pixel is 3 bytes: " + (w * h * 3) + " bytes.", {}, 45); });
const gGridRows = G("gridrows", (r) => { const w = int(r, 4, 8), h = pick(r, [3, 9, 10].filter((x) => x !== w).concat([w + 2])); return M3(r, "A bitmap has " + (w * h) + " bits and each row of the picture is " + w + " pixels wide. How many rows tall is it?", String(h), [w, w * h, h + 1, h - 1].map(String), (w * h) + " / " + w + " = " + h + " rows.", {}, 35); });

/* ---- hexadecimal generators ---- */
const HEXHINT = "Hex digits: A=10  B=11  C=12  D=13  E=14  F=15";
const hexPair = (r, lo) => { const d1 = int(r, lo, 15); let d2 = int(r, 0, 15); if (d1 < 10 && d2 < 10) d2 = int(r, 10, 15); return [d1, d2]; };
const gHexDigit = G("hexdigit", (r) => { const v = int(r, 10, 15); return M3(r, "What is the hexadecimal digit " + hd(v) + " worth in decimal?", String(v), [v - 1, v + 1, v + 10, 16].map(String), "Hex counts 0 to 9 and then A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.", {}, 25); });
const gHex2Dec = (lo) => G("hex2dec", (r) => { const p = hexPair(r, lo), val = p[0] * 16 + p[1], hx = hd(p[0]) + hd(p[1]); return M3(r, "The vault door shows the hex code " + hx + ". What is that in decimal?", String(val), [p[1] * 16 + p[0], val + 16, val - 16, val + 1].filter((x) => x >= 0).map(String), hx + " = " + p[0] + " x 16 + " + p[1] + " = " + val + ". The left digit is worth 16 each.", { code: HEXHINT }, 45); });
const gDec2Hex = G("dec2hex", (r) => { const p = hexPair(r, 1), val = p[0] * 16 + p[1], hx = hd(p[0]) + hd(p[1]); return M3(r, "The panel needs the decimal number " + val + " typed in hex. What is it?", hx, [hd(p[1]) + hd(p[0]), hex2(val + 1), hex2(Math.max(0, val - 16)), hex2(Math.min(255, val + 16))], val + " / 16 = " + p[0] + " remainder " + p[1] + ", so it is " + hx + ".", { code: HEXHINT }, 50); });
const gHexBits = (lo) => G("hexbits", (r) => { const p = hexPair(r, lo), val = p[0] * 16 + p[1], hx = hd(p[0]) + hd(p[1]); return { q: { type: "bits", target: val, prompt: "The safe's keypad shows the hex code " + hx + ". Flip the switches to enter the same number in binary.", code: HEXHINT, t: 70 }, a: { value: val }, why: hx + " = " + p[0] + " x 16 + " + p[1] + " = " + val + " = " + bits8(val) + ". (Each hex digit is 4 bits: " + bin4(p[0]) + " " + bin4(p[1]) + ".)" }; });
const gHexToBin = G("hex2bin", (r) => { const v = int(r, 1, 14); return M3(r, "Hex digit " + hd(v) + " is the same as which 4-bit binary number?", bin4(v), [15 - v, v ^ 1, v ^ 2, v ^ 4].map(bin4), hd(v) + " is " + v + ", and " + v + " in 4 bits is " + bin4(v) + ".", { code: HEXHINT }, 40); });
const gBinToHex = G("bin2hex", (r) => { const a = int(r, 1, 15), b = int(r, 0, 15), hx = hd(a) + hd(b); return M3(r, "Convert this byte to hex. Split it into two groups of 4 bits first: " + bin4(a) + " " + bin4(b), hx, [hd(b) + hd(a), hd(Math.min(15, a + 1)) + hd(b), hd(a) + hd(Math.max(0, b - 1)), String(a) + String(b)], bin4(a) + " = " + hd(a) + " and " + bin4(b) + " = " + hd(b) + ", so the hex is " + hx + ".", { code: HEXHINT }, 55); });
const gHexCount = G("hexcount", (r) => { const d1 = int(r, 1, 9), nine = r() < 0.5, d2 = nine ? 9 : 15, val = d1 * 16 + d2, here = hd(d1) + hd(d2); return M3(r, "Counting in hexadecimal: what comes right after " + here + "?", hex2(val + 1), nine ? ["" + (d1 + 1) + "0", hex2(val + 2), hex2(val - 1)] : [hd(d1) + "G", hex2(val + 2), "" + hd(d1) + "10"], nine ? here + " + 1 is " + hex2(val + 1) + ". After 9 comes A in hex, not 10." : here + " + 1 rolls over to " + hex2(val + 1) + ", because F is the biggest digit.", { code: HEXHINT }, 35); });
const gHexCompare = G("hexcmp", (r) => { const d1 = int(r, 1, 14), a = hd(d1) + "F", b = hd(d1 + 1) + "0"; return M3(r, "Which hexadecimal number is LARGER?", b, [a, "They are equal"], a + " = " + (d1 * 16 + 15) + " and " + b + " = " + ((d1 + 1) * 16) + ". The left digit is worth 16, so it matters most.", { code: a + "   or   " + b }, 40); });

/* ---- color generators ---- */
const gMixName = G("mixname", (r) => { const nm = pick(r, Object.keys(NAMED).filter((x) => x !== "gray")); return { q: { type: "rgb", levels: [0, 128, 255], prompt: "Mix the light to make " + nm.toUpperCase() + ". Set the red, green and blue.", t: 45 }, a: { rgb: NAMED[nm] }, why: nm + " is " + rgbText(NAMED[nm]) + ". Light mixes by adding: red + green = yellow, green + blue = cyan, red + blue = magenta, all three = white." }; });
const gMixHex = G("mixhex", (r) => { const lv = [0, 64, 128, 192, 255], rgb = [pick(r, lv), pick(r, lv), pick(r, lv)]; if (rgb.every((x) => x === rgb[0])) rgb[2] = pick(r, lv.filter((x) => x !== rgb[0])); const hex = hexOf(rgb); return { q: { type: "rgb", levels: lv, prompt: "The color lock wants the hex color " + hex + ". Set red, green and blue to the right decimal values. (Hex pairs: 00 = 0, 40 = 64, 80 = 128, C0 = 192, FF = 255.)", code: hex, t: 60 }, a: { rgb }, why: hex + " is split into pairs: " + rgb.map((x) => hex2(x) + " = " + x).join(", ") + ". Red is first, then green, then blue." }; });
const gMixDec = G("mixdec", (r) => { const lv = [0, 128, 255], rgb = [pick(r, lv), pick(r, lv), pick(r, lv)]; if (rgb.every((x) => x === rgb[0])) rgb[1] = pick(r, lv.filter((x) => x !== rgb[0])); return { q: { type: "rgb", levels: lv, prompt: "Set the light to exactly " + rgbText(rgb).replace("(", "rgb(") + ". The three numbers are red, green and blue in that order.", t: 40 }, a: { rgb }, why: "In rgb(R, G, B) the numbers are red, green, blue: R = " + rgb[0] + ", G = " + rgb[1] + ", B = " + rgb[2] + "." }; });
const gNameFromRgb = G("namergb", (r) => { const nm = pick(r, NAMES8); return M3(r, "Which color is " + rgbText(NAMED[nm]).replace("(", "rgb(") + "?", nm, shuffle(r, NAMES8.filter((x) => x !== nm)), nm + " is " + rgbText(NAMED[nm]) + ".", {}, 35); });
const gNameFromHex = G("namehex", (r) => { const nm = pick(r, NAMES8); return M3(r, "Which color is the hex code " + hexOf(NAMED[nm]) + "?", nm, shuffle(r, NAMES8.filter((x) => x !== nm)), hexOf(NAMED[nm]) + " splits into " + NAMED[nm].map(hex2).join(", ") + ", which is " + rgbText(NAMED[nm]) + ": " + nm + ".", {}, 40); });
const gHexFromName = G("hexname", (r) => { const nm = pick(r, NAMES8), right = hexOf(NAMED[nm]); return M3(r, "Which hex code makes the color " + nm.toUpperCase() + "?", right, shuffle(r, NAMES8.filter((x) => x !== nm).map((x) => hexOf(NAMED[x]))), "Hex colors are #RRGGBB. " + nm + " is " + rgbText(NAMED[nm]) + ", which is " + right + ".", {}, 40); });
const gGrayRule = G("grayrule", (r) => { const g = int(r, 40, 210); return M3(r, "Which of these colors is a shade of GRAY?", rgbText([g, g, g]), [rgbText([g, g, 0]), rgbText([g, 0, g]), rgbText([0, g, g])], "Gray has the SAME amount of red, green and blue. " + rgbText([g, g, g]) + " has all three equal.", {}, 30); });
const gColorCount = G("colorcount", (r) => { const k = int(r, 0, 2); if (k === 0) return mc(r, "How many different values can ONE color channel hold, from 0 up to 255?", "256", ["255", "100", "8"], "0 to 255 is 256 values (one byte, 8 bits).", {}, 30); if (k === 1) return mc(r, "How many different colors can 24-bit RGB make?", "16,777,216", ["16,777,215", "65,536", "768"], "Each of the 3 channels has 256 values: 256 x 256 x 256 = 16,777,216.", {}, 35); return mc(r, "A pixel uses one byte each for red, green and blue. How many bits is ONE pixel?", "24", ["8", "3", "256"], "3 channels x 8 bits = 24 bits per pixel.", {}, 30); });

/* ---- image filter generators ---- */
const gInvert = G("invert", (r) => { const p = [int(r, 20, 230), int(r, 20, 230), int(r, 20, 230)], out = p.map((v) => 255 - v); return M3(r, "The INVERT filter turns every value v into 255 - v. What does the pixel " + rgbText(p) + " become?", rgbText(out), [rgbText([out[0], p[1], out[2]]), rgbText([out[2], out[1], out[0]]), rgbText([out[0], out[1], p[2]])], "255 - " + p[0] + " = " + out[0] + ", 255 - " + p[1] + " = " + out[1] + ", 255 - " + p[2] + " = " + out[2] + ".", {}, 40); });
const gGray = G("gray", (r) => { const a = int(r, 30, 220), b = int(r, 30, 220); let c = int(r, 30, 220); c -= (a + b + c) % 3; const px = [a, b, c], avg = (a + b + c) / 3, mx = Math.max(a, b, c); return M3(r, "The GRAYSCALE filter sets all three values to the average of the three. What does " + rgbText(px) + " become?", rgbText([avg, avg, avg]), [rgbText([a, a, a]), rgbText([mx, mx, mx]), rgbText([avg + 30, avg + 30, avg + 30]), rgbText([c, c, c])], "(" + px.join(" + ") + ") / 3 = " + avg + ", and gray has the same value in all three channels.", {}, 50); });
const gChan = G("chan", (r) => { const p = [int(r, 20, 230), int(r, 20, 230), int(r, 20, 230)], ch = int(r, 0, 2), name = ["RED", "GREEN", "BLUE"][ch], out = p.slice(); out[ch] = 0; const w1 = p.slice(); w1[ch] = 255; return M3(r, "A filter sets the " + name + " value of every pixel to 0. What does " + rgbText(p) + " become?", rgbText(out), [rgbText(w1), rgbText(p.map((v, j) => (j === ch ? v : 0))), rgbText([0, 0, 0])], "Only the " + name.toLowerCase() + " channel changes to 0. The other two stay as they were: " + rgbText(out) + ".", {}, 40); });
const gBright = G("bright", (r) => { const amt = pick(r, [30, 40, 50]), hi = [int(r, 215, 245), int(r, 40, 180), int(r, 10, 100)], out = hi.map((v) => Math.min(255, v + amt)), raw = hi.map((v) => v + amt); return M3(r, "A BRIGHTEN filter adds " + amt + " to every value, but a value can never go above 255. What does " + rgbText(hi) + " become?", rgbText(out), [rgbText(raw), rgbText(hi), rgbText(hi.map((v) => Math.max(0, v - amt)))], hi[0] + " + " + amt + " = " + raw[0] + ", but one byte tops out at 255, so it is capped at 255. The others are just added.", {}, 45); });
const gDarken = G("darken", (r) => { const amt = pick(r, [30, 40, 60]), px = [int(r, 5, amt - 5), int(r, 100, 220), int(r, 100, 220)], out = px.map((v) => Math.max(0, v - amt)), raw = px.map((v) => v - amt); return M3(r, "A DARKEN filter subtracts " + amt + " from every value, but a value can never go below 0. What does " + rgbText(px) + " become?", rgbText(out), [rgbText(raw), rgbText(px), rgbText(px.map((v) => Math.min(255, v + amt)))], px[0] + " - " + amt + " = " + raw[0] + ", but one byte cannot go below 0, so it stops at 0. The others are just reduced.", {}, 45); });
const gThreshold = G("thresh", (r) => { const dark = r() < 0.5, px = [0, 0, 0].map(() => (dark ? int(r, 10, 110) : int(r, 150, 250))), avg = Math.round((px[0] + px[1] + px[2]) / 3); return M3(r, "A BLACK-AND-WHITE filter works like this: if the average of red, green and blue is above 127 the pixel becomes white (255, 255, 255), otherwise black (0, 0, 0). What does " + rgbText(px) + " become?", dark ? "(0, 0, 0)" : "(255, 255, 255)", [dark ? "(255, 255, 255)" : "(0, 0, 0)", rgbText(px), "(127, 127, 127)"], "The average is about " + avg + ", which is " + (dark ? "below" : "above") + " 127, so the pixel becomes " + (dark ? "black." : "white."), {}, 45); });
const gMirror = G("mirror", (r) => { const cols = shuffle(r, ["RED", "BLUE", "GREEN", "YELLOW", "PINK", "ORANGE", "WHITE", "BLACK"]).slice(0, 4), j = (a) => a.join("  "); return M3(r, "A row of pixels reads  " + j(cols) + ". A MIRROR filter flips the row left to right. What is the new row?", j(cols.slice().reverse()), [j(cols), j([cols[1], cols[2], cols[3], cols[0]]), j([cols[1], cols[0], cols[3], cols[2]])], "Mirroring reverses the order: the last pixel becomes the first.", {}, 35); });
const gSwapRB = G("swaprb", (r) => { const a = int(r, 10, 80), b = int(r, 90, 160), c = int(r, 170, 250), p = shuffle(r, [a, b, c]); return M3(r, "A filter SWAPS the red and blue values of every pixel. What does " + rgbText(p) + " become?", rgbText([p[2], p[1], p[0]]), [rgbText([p[1], p[0], p[2]]), rgbText([p[0], p[2], p[1]]), rgbText(p)], "Red and blue trade places, green stays: " + rgbText([p[2], p[1], p[0]]) + ".", {}, 40); });
const gTwoStep = G("twostep", (r) => { const a = int(r, 30, 220), b = int(r, 30, 220); let c = int(r, 30, 220); c -= (a + b + c) % 3; const p = [a, b, c], inv = p.map((v) => 255 - v), v = (inv[0] + inv[1] + inv[2]) / 3, avg = (a + b + c) / 3; return M3(r, "BOSS! Step 1: INVERT (v becomes 255 - v). Step 2: GRAYSCALE (all three become their average). What does " + rgbText(p) + " become after BOTH steps?", rgbText([v, v, v]), [rgbText([avg, avg, avg]), rgbText(inv), rgbText([255 - a, 255 - a, 255 - a])], "Invert gives " + rgbText(inv) + ". The average of those is " + v + ", so the pixel is " + rgbText([v, v, v]) + ".", {}, 80); });

/* ---- compression generators ---- */
const rlRuns = (r, k, lo, hi) => { const L = ["A", "B", "C", "W", "X", "Z"], out = []; let last = ""; for (let j = 0; j < k; j++) { let c; do { c = pick(r, L); } while (c === last); last = c; out.push([int(r, lo, hi), c]); } return out; };
const rlStr = (rs) => rs.map((x) => x[0] + x[1]).join(""), rlExp = (rs) => rs.map((x) => x[1].repeat(x[0])).join("");
const gRleDecode = (k, t) => G("rledec", (r) => { const rs = rlRuns(r, k, 2, 5), right = rlExp(rs); return M3(r, "Run-length encoding wrote this: " + rlStr(rs) + ". What was the ORIGINAL data?", right, [rlExp(rs.map((x, j) => (j === 0 ? [x[0] + 1, x[1]] : x))), rlExp(rs.map((x, j) => (j === 0 ? [x[0], rs[1][1]] : j === 1 ? [x[0], rs[0][1]] : x))), rlExp(rs.map((x) => [1, x[1]]))], "Read it as 'count then letter': " + rs.map((x) => x[0] + x[1] + " = " + x[1].repeat(x[0])).join(", ") + ".", {}, t); });
const gRleEncode = (k, t) => G("rleenc", (r) => { const rs = rlRuns(r, k, 2, 5); return M3(r, "Run-length encode this data (write the count, then the letter): " + rlExp(rs), rlStr(rs), [rs.map((x) => x[1] + x[0]).join(""), rlStr(rs.map((x, j) => (j === 0 ? [x[0] + 1, x[1]] : x))), rlStr(rs.slice(0, -1)), rlStr([[rs[0][0] + rs[1][0], rs[0][1]]].concat(rs.slice(2)))], "Count each run of the same letter: " + rs.map((x) => x[1].repeat(x[0]) + " = " + x[0] + x[1]).join(", ") + ".", {}, t); });
const gRleBest = G("rlebest", (r) => { const a1 = pick(r, ["A", "B", "C", "W", "X"]), b1 = pick(r, ["D", "E", "F", "Y", "Z"]), good = a1.repeat(int(r, 7, 9)) + b1.repeat(int(r, 7, 9)), o = int(r, 0, 9); return mc(r, "Which data would run-length encoding shrink the MOST?", good, [(a1 + b1).repeat(8), ALPHA.slice(o, o + 16)], "Run-length encoding wins when the same value repeats in long runs. " + good + " is just two runs. The other strings change almost every character, so there is nothing to shorten.", {}, 35); });
const gRatio = G("ratio", (r) => { const f = pick(r, [2, 4, 5, 10]), c = pick(r, [10, 20, 25]), o = f * c; return M3(r, "A file is " + o + " MB. After lossless compression it is " + c + " MB. How many times smaller is it?", f + " times", [(f + 1) + " times", (f * 2) + " times", (o - c) + " times"], o + " / " + c + " = " + f + ", so it is " + f + " times smaller.", {}, 35); });
const gRleSaved = G("rlesaved", (r) => { const rs = rlRuns(r, 3, 3, 6), L = rs.reduce((s, x) => s + x[0], 0), saved = L - 6; return M3(r, "The data " + rlExp(rs) + " is run-length encoded as " + rlStr(rs) + ". How many characters SHORTER is the encoded version?", String(saved), [L, 6, L - 3, L - 9].map(String), "The original has " + L + " characters and the encoded version has 6. " + L + " - 6 = " + saved + ".", {}, 40); });
const gRleWorst = G("rleworst", (r) => { const s = pick(r, ["ABCDEF", "QWERTY", "XYZ", "VAULT", "SECRET"]); return M3(r, "Run-length encode " + s + " (count, then letter). How does the result compare to the original?", "It is LONGER, because no letters repeat", ["It is much shorter, because RLE always shrinks data", "It is exactly the same, so nothing changes", "It cannot be encoded"], "Every letter becomes a count of 1 plus the letter (" + s.split("").map((c) => "1" + c).join("") + "), which doubles the length. RLE only helps when there are runs.", {}, 35); });

/* ---- lossy generators ---- */
const SCEN = LOSSLESS.map((s) => ({ s, lossy: false })).concat(LOSSY.map((s) => ({ s, lossy: true }))).concat([{ s: "A scanned birth certificate kept as a permanent record", lossy: false }, { s: "A short clip of a cat video you are sending to a friend over a slow connection", lossy: true }, { s: "A folder of tax records you are backing up for seven years", lossy: false }, { s: "A podcast episode that thousands of people stream on their phones", lossy: true }, { s: "A DNA sequence file used in a medical lab", lossy: false }, { s: "A photo gallery on a school website that needs to load quickly", lossy: true }, { s: "A program installer that must run exactly as written", lossy: false }, { s: "A live video of a basketball game sent to viewers", lossy: true }, { s: "A scanned page of a signed lease that may be needed in court", lossy: false }, { s: "A banner image on a web page that is only a background", lossy: true }, { s: "The text of a book you are emailing to a friend as a ZIP", lossy: false }, { s: "A game's sound effects stored on a phone with limited storage", lossy: true }]);
const gScenario = G("scen", (r, n, seed) => { const x = shuffle(rng((Number(seed) ^ hashKey("scen")) >>> 0), SCEN)[n % SCEN.length]; return mc(r, "Which kind of compression is the BEST choice? " + x.s + ".", x.lossy ? "Lossy" : "Lossless", [x.lossy ? "Lossless" : "Lossy"], x.lossy ? "Lossy is best here: a smaller file and speed matter more than perfect detail, and people will not notice the missing data." : "Lossless is best here: every bit must come back exactly, so nothing can be thrown away.", {}, 30); });
const gDownsample = G("downsample", (r) => { const w = pick(r, [240, 480, 600, 720, 960, 1200]), h = pick(r, [120, 180, 240, 360, 600]), d = pick(r, [2, 2, 3, 4]), nm = { 2: "HALF", 3: "ONE THIRD", 4: "ONE QUARTER" }[d], keep = (w / d) * (h / d); return M3(r, "An image is " + w + " by " + h + " pixels. A lossy method shrinks it to " + nm + " of the width and " + nm + " of the height. How many pixels are left?", fmt(keep), [fmt((w * h) / d), fmt(w / d + h / d), fmt(w * h)], "Shrinking both sides to 1/" + d + " keeps 1/" + (d * d) + " of the pixels: " + (w / d) + " x " + (h / d) + " = " + fmt(keep) + ". Those details are gone for good.", {}, 50); });
const gBitDepth = G("bitdepth", (r) => { const k = pick(r, [[24, 12, "one half"], [24, 8, "one third"], [24, 6, "one quarter"]]); return M3(r, "A lossy method cuts a photo from " + k[0] + " bits per pixel to " + k[1] + " bits per pixel. About how much of the original data is left?", k[2], ["one half", "one third", "one quarter", "two thirds"], k[1] + " / " + k[0] + " = " + k[2] + ". The photo is smaller, but the lost color detail cannot be restored.", {}, 40); });

/* ---- cryptography generators ---- */
const CRYWORDS = ["VAULT", "SECRET", "CODE", "AGENT", "LOCK", "CIPHER", "BINARY", "GOLD", "SAFE", "BITS", "SPY", "ALARM"];
const gCaesarEnc = (t, boss) => G("caesarenc", (r) => { const word = pick(r, CRYWORDS), s = int(r, 2, 9), c = caesar(word, s); return M3(r, (boss ? "BOSS! " : "") + "Encrypt the password " + word + " with a Caesar cipher that shifts every letter FORWARD by " + s + ".", c, [caesar(word, -s), caesar(word, s + 1), caesar(word, s - 1)], "Move each letter forward " + s + " places (wrapping Z back to A): " + word + " becomes " + c + ".", { code: "Alphabet: " + ALPHA }, t); });
const gCaesarDec = (t) => G("caesardec", (r) => { const word = pick(r, CRYWORDS), s = int(r, 2, 9), c = caesar(word, s); return M3(r, "A Caesar cipher shifted every letter FORWARD by " + s + ". The intercepted message is " + c + ". What did it say?", word, [caesar(c, s), caesar(word, 1), caesar(c, -(s + 1))], "To decrypt, shift every letter BACK by " + s + ": " + c + " becomes " + word + ".", { code: "Alphabet: " + ALPHA }, t); });
const gShiftFind = G("shiftfind", (r) => { const k = int(r, 0, 25), s = int(r, 2, 12), p = ALPHA[k], c = ALPHA[(k + s) % 26]; return M3(r, "A Caesar cipher turned the letter " + p + " into " + c + ". How far forward was every letter shifted?", String(s), [s - 1, s + 1, 26 - s].map(String), "Count forward from " + p + " to " + c + " (wrapping past Z if needed): that is " + s + " places.", { code: "Alphabet: " + ALPHA }, 45); });
const gDecryptShift = G("decshift", (r) => { const s = int(r, 3, 12); return M3(r, "A message was encrypted by shifting every letter FORWARD by " + s + ". To decrypt it you must shift every letter...", "BACKWARD by " + s, ["FORWARD by " + s, "BACKWARD by " + (s + 1), "FORWARD by " + (s + 1)], "Decryption undoes encryption, so go the opposite way by the same amount.", {}, 30); });
const gFreq = G("freq", (r) => { const s = int(r, 2, 9), top = caesar("E", s); return M3(r, "In English, the most common letter is E. In a long intercepted Caesar message the most common letter is " + top + ". What shift was probably used?", String(s), [s - 1, s + 1, 26 - s].map(String), "E probably became " + top + ", which is " + s + " places later. This is called frequency analysis, and it breaks simple ciphers.", { code: "Alphabet: " + ALPHA }, 50); });

/* ---- the ten lesson vaults ---- */
const LESSON_VAULTS = [
  { id: "vault1", lesson: "8.1", title: "Intro to Digital Information", plan: [gBitsBuild(20, 120), PG("analog", ANALOG_FACTS), gNBitsValues, gBin2Dec(20, 120), PG("units", UNITS_FACTS), gBitsNeeded, gOverflow, gRoundoff, PG("analog", ANALOG_FACTS), gBitsBuild(170, 255, "bitsBuild2")] },
  { id: "vault2", lesson: "8.2", title: "Number Systems", plan: [gBitsBuild(30, 120), gBin2Dec(20, 120), gDec2Bin, gNextBin, gBinAdd, gPlaceValue, gMaxValue, gBin2Dec(150, 255), gBitsBuild(150, 250, "bitsBuild2"), gBitsIp] },
  { id: "vault3", lesson: "8.3", title: "Encoding Text with Binary", plan: [gAsciiBits, gAsciiDecode(WORD_GROUPS, 60), gAsciiNumber, gTextBits, gAsciiEncode, gCaseDiff, PG("text", TEXT_FACTS), gAsciiDecode(WORD_GROUPS, 60, "asciidec2"), PG("text", TEXT_FACTS), gAsciiDecode(WORD4, 90, "asciidec4")] },
  { id: "vault4", lesson: "8.4", title: "Pixel Images", plan: [gGrid(false), gGridRead, gBmpSize, gGrid(true), gBitsPerPixel, gColorImgSize, gGridRead, PG("pixel", PIXEL_FACTS), gGridRows, gGrid(null)] },
  { id: "vault5", lesson: "8.5", title: "Hexadecimal", plan: [gHexDigit, gHex2Dec(1), gHexBits(1), gHexToBin, gBinToHex, gDec2Hex, PG("hex", HEX_FACTS2), gHexCount, gHexCompare, gHexBits(10)] },
  { id: "vault6", lesson: "8.6", title: "Pixel Colors", plan: [gMixName, gNameFromRgb, gHexFromName, gMixHex, gNameFromHex, gGrayRule, PG("color", COLOR_FACTS2), gMixDec, gColorCount, gMixHex] },
  { id: "vault7", lesson: "8.7", title: "Image Manipulation", plan: [gInvert, gGray, gChan, gBright, gDarken, gThreshold, gMirror, gSwapRB, PG("filter", FILTER_FACTS), gTwoStep] },
  { id: "vault8", lesson: "8.8", title: "Data Compression", plan: [gRleDecode(3, 45), gRleEncode(3, 45), gRleBest, gRatio, gRleSaved, gRleWorst, PG("comp", COMP_FACTS), gRleDecode(4, 60), gRleEncode(4, 60), PG("comp", COMP_FACTS)] },
  { id: "vault9", lesson: "8.9", title: "Lossy Compression", plan: [gScenario, gScenario, PG("lossy", LOSSY_FACTS), gDownsample, gScenario, PG("lossy", LOSSY_FACTS), gBitDepth, gScenario, PG("lossy", LOSSY_FACTS), gDownsample] },
  { id: "vault10", lesson: "8.10", title: "Cryptography", plan: [PG("crypto", CRYPTO_FACTS), gCaesarEnc(45), gCaesarDec(50), gShiftFind, gDecryptShift, PG("crypto", CRYPTO_FACTS), gFreq, PG("crypto", CRYPTO_FACTS), gCaesarDec(60), gCaesarEnc(75, true)] }
];
/* round i of a lesson vault. A question is made again (with a different random draw) if it would repeat one already asked in this game. */
const lessonMake = (plan, topic) => (seed, i) => {
  const used = new Set(); let out = null;
  for (let k = 0; k <= i; k++) {
    const g = plan[k]; let n = 0; for (let j = 0; j < k; j++) if (plan[j].key === g.key) n++;
    let x = null;
    for (let attempt = 0; attempt < 12; attempt++) { x = g.gen(R(seed, k + 100 * attempt), n, seed); const key = x.q.prompt + "|" + (x.q.code || ""); if (!used.has(key)) { used.add(key); break; } }
    if (k === i) { x.q.topic = x.q.topic || topic; out = x; }
  }
  return out;
};

/* ================================================================== the games ==================== */
const GAMES = {
  bomb: { id: "bomb", title: "Defuse the House", make: bombQ, check: bombCheck },
  dns: { id: "dns", title: "DNS Cliff Road", make: dnsQ, check: choiceCheck },
  storm: { id: "storm", title: "Storm Dash", make: stormQ, check: (a, ans) => ("idx" in a ? choiceCheck(a, ans) : routeCheck(a, ans)) },
  packets: { id: "packets", title: "Packet Post Office Rush", make: packetsQ, check: packetsCheck },
  vault: { id: "vault", title: "Vault Breaker", make: vaultQ, check: vaultCheck },
  cast: { id: "cast", title: "Cartoon Cast Director", make: castQ, check: (a, ans) => ("idx" in a && !a.target ? (ans && !ans.timeout && ans.idx === a.idx) : castCheck(a, ans)) }
};

LESSON_VAULTS.forEach((L) => { GAMES[L.id] = { id: L.id, title: "Vault " + L.lesson + ": " + L.title, make: lessonMake(L.plan, L.title), check: vaultCheck }; });

export { GAMES, LESSON_VAULTS, ROUNDS, STRIKES, NODES, EDGES };
export const hasGame = (id) => Object.prototype.hasOwnProperty.call(GAMES, id);
/* the question for round i of a run: { q: public, a: secret, why } */
export const makeQuestion = (game, seed, i) => GAMES[game].make(seed, i);
export const checkAnswer = (game, a, ans) => { try { return !!GAMES[game].check(a, ans); } catch (e) { return false; } };
