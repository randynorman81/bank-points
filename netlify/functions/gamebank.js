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
const WORD_GROUPS = [["CAT", "COT", "CUT", "CAB"], ["BAT", "BIT", "BUT", "BAG"], ["HAT", "HIT", "HOT", "HUT"], ["SIT", "SAT", "SET", "SIP"], ["MAP", "MAT", "MOP", "MUG"], ["PIG", "PEG", "PIT", "PAT"], ["DOG", "DIG", "DOT", "DUG"], ["RAT", "ROT", "RUT", "RAN"]];
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
  if (a.rgb) return Array.isArray(ans.rgb) && ans.rgb.length === 3 && a.rgb.every((v, k) => Number(ans.rgb[k]) === v);
  return false;
}

/* ================================================================== the games ==================== */
const GAMES = {
  bomb: { id: "bomb", title: "Defuse the House", make: bombQ, check: bombCheck },
  dns: { id: "dns", title: "DNS Cliff Road", make: dnsQ, check: choiceCheck },
  storm: { id: "storm", title: "Storm Dash", make: stormQ, check: (a, ans) => ("idx" in a ? choiceCheck(a, ans) : routeCheck(a, ans)) },
  packets: { id: "packets", title: "Packet Post Office Rush", make: packetsQ, check: packetsCheck },
  vault: { id: "vault", title: "Vault Breaker", make: vaultQ, check: vaultCheck },
  cast: { id: "cast", title: "Cartoon Cast Director", make: castQ, check: (a, ans) => ("idx" in a && !a.target ? (ans && !ans.timeout && ans.idx === a.idx) : castCheck(a, ans)) }
};

export { GAMES, ROUNDS, STRIKES, NODES, EDGES };
export const hasGame = (id) => Object.prototype.hasOwnProperty.call(GAMES, id);
/* the question for round i of a run: { q: public, a: secret, why } */
export const makeQuestion = (game, seed, i) => GAMES[game].make(seed, i);
export const checkAnswer = (game, a, ans) => { try { return !!GAMES[game].check(a, ans); } catch (e) { return false; } };
