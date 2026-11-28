"""Extra teaching sections that turn the IST lesson guides into a book people can learn from on paper:
  GUIDED BUILD   the lesson's walkthrough, step by step, with the code to type and what the page shows (text comes from ist/unit-6/answers-w*.js, exported by work/ist/export_lab.mjs)
  ON PAPER       write-the-code exercises taken from the lesson's Parsons problems (the answers are the checked solutions; they are in the answer key)
  CHECKLIST      "I can ..." statements for the lesson
Everything is generated from material that is already tested, so nothing here is new, untested teaching."""
import os, re, json, html as _html
import gl
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
LAB = {"3.1": "6.1", "3.2": "6.2", "3.3": "6.20", "3.4": "6.3", "3.5": "6.35", "3.6": "6.4", "3.7": "6.7", "3.8": "6.75", "3.9": "6.6", "3.10": "6.5", "4.1": "7.1", "4.2": "7.2", "4.3": "7.3", "4.4": "7.4", "4.5": "7.5", "5.1": "8.1", "5.2": "8.2", "5.3": "8.3", "5.4": "8.4", "5.5": "8.5", "5.6": "8.6", "6.1": "9.1", "6.2": "9.2", "6.3": "9.3", "6.4": "9.4", "6.5": "9.5", "6.6": "9.6"}
PARSONS = {"3.%d" % n: "i3l%d" % n for n in range(1, 11)}; PARSONS.update({"4.%d" % n: "i7l%d" % n for n in range(1, 6)}); PARSONS.update({"5.%d" % n: "i8l%d" % n for n in range(1, 7)}); PARSONS.update({"6.%d" % n: "i9l%d" % n for n in range(1, 7)})
CHECK = {
 "3.1": ["Type the HTML skeleton from memory: doctype, html, head with a title, and body", "Say what goes in the head and what goes in the body", "Explain why the title shows on the browser tab and the heading 1 shows on the page", "Close every tag I open, using the same name", "Put a heading 1, heading 2 and paragraphs in the body"],
 "3.2": ["Write a style attribute with the pattern property: value", "Use color and background-color together, separated by a semicolon", "Use any of the 140 color names, written as one word with no spaces", "Say which tags use the body's colors and which keep their own", "Pick a text color that is easy to read on its background"],
 "3.3": ["Set a size with font-size in pixels", "Align text left, center or right with text-align", "Change letter case with text-transform", "Use a heading 3 and explain how it differs from heading 1 and heading 2", "Put several styles in one style attribute"],
 "3.4": ["Make words bold with strong and italic with em", "Use br and hr, which have no closing tag", "Style just a few words with span", "Close nested tags in the right order, last opened closed first", "Know when to use a paragraph and when to use br"],
 "3.5": ["Add a Google Fonts link inside the head", "Use font-family to apply the font I loaded", "Explain why the link goes in the head, not the body", "Choose a font that fits the page", "Use a different font on different tags"],
 "3.6": ["Write a border with thickness, style and color in that order", "Name the six border styles and what each looks like", "Put a border on only one side", "Give different borders to different tags", "Fix a border that is missing its style or its unit"],
 "3.7": ["Add a picture with img, src and alt", "Write alt text that describes the picture", "Size a picture with width only, in pixels or percent", "Explain why setting both width and height can squish a picture", "Add a favicon with a link tag in the head"],
 "3.8": ["Paste an emoji or symbol into my text", "Explain why an emoji is text and not a picture", "Style one symbol with a span", "Put an emoji in a heading and in a paragraph", "Check that the page still reads well without the emoji"],
 "3.9": ["Make a link with the a tag and an href that starts with https://", "Choose between opening in a new tab and the same tab with target", "Make words, a heading or a picture into a link", "Close the a tag and any tags inside it in the right order", "Write link text that tells the reader where it goes"],
 "3.10": ["Build a bulleted list with ul and a numbered list with ol", "Put every item in its own li inside the list", "Change the marker with list-style-type", "Make list items sit in a row to build a menu", "Tell block tags from inline tags"],
 "4.1": ["Name the four layers of a box: content, padding, border and margin", "Say which layer takes the background color", "Add up the real width of a box including padding and border", "Write padding and margin with one, two or four values", "Tell what changes when I raise the padding and what changes when I raise the margin"],
 "4.2": ["Use a color name or a hex code after color and background-color", "Read a hex code as three pairs: red, green and blue", "Turn a pair into a number from 0 to 255", "Write the rules for a valid hex code: # and six characters from 0 to F", "Find a hex code with a color picker and build my own"],
 "4.3": ["Tell block, inline and inline-block apart", "Say which tags are block and which are inline by default", "Use display to change how a tag sits on the page", "Know that inline ignores width and height but inline-block keeps them", "Build a row of buttons or a menu with display"],
 "4.4": ["Group tags with a div and style the group once", "Explain that a div has no style of its own", "Build two columns with inline-block, a width and vertical-align top", "Apply the 98% rule so columns do not wrap", "Nest a div inside another div"],
 "4.5": ["Build a table from table, tr, th and td", "Keep every row the same number of cells", "Say the difference between th and td", "Put other tags, like strong or a picture, inside a cell", "Close every table, row and cell tag"],
 "5.1": ["Write a rule: a selector, curly braces, and property: value; lines", "Link style.css in the head with rel=\"stylesheet\" and the exact file name", "Say why the link tag has no closing tag and why it goes in the head", "Write a class rule with a dot, and the class attribute with no dot", "Tell a tag rule from a class rule and use both together"],
 "5.2": ["Write an id rule with a hash and an id attribute with no hash", "Explain why an id may be used only once on a page", "Choose between a class and an id for a given job", "Put a class and an id on the same element and say what it gets", "Spot an id used twice or a dot where a hash belongs"],
 "5.3": ["Rank tag, class, id and inline style from weakest to strongest", "Say which of two rules wins, whatever order they are written in", "Put two classes on one element in a single class attribute", "Write p.warning (no space) and ul li (a space) and say what each reaches", "Explain why inline styles are avoided"],
 "5.4": ["Write a :hover, :focus and :active rule with no spaces", "Say when each pseudo-class applies", "Write a transition with a property and a time in seconds", "Put the transition on the normal rule so the change glides both ways", "Explain why a pseudo-class cannot go in a style attribute"],
 "5.5": ["Put display: flex on the container, not on the items", "Use justify-content to spread items along the row", "Use align-items with a height to move items up and down", "Stack items with flex-direction: column and space them with gap", "Center something both ways with two properties"],
 "5.6": ["Make a grid with display: grid and grid-template-columns", "Read 1fr 1fr 1fr, 1fr 2fr and 1fr 100px", "Work out a column width from the container width, the gap and the fr values", "Put the column sizes on the container and never widths on the items", "Choose between flexbox and grid for a given layout"],
 "6.1": ["Link Bootstrap in the head with rel=\"stylesheet\" and the exact address", "Say why the Bootstrap link has no closing tag", "Put my own style.css link under the Bootstrap link so my rules win", "Explain why classes seem to do nothing when the link is missing", "Name what changes the moment the link is added"],
 "6.2": ["Nest a container, a row and columns in the right order", "Add up column numbers to 12 and say what happens above 12", "Use col, col-N and col-md-N and say how each behaves on a phone", "Say what the container and the row do", "Predict how many lines a set of columns makes"],
 "6.3": ["Use text-center, text-muted and fw-bold", "Color text and backgrounds with the six theme colors", "Add text-white on a dark background", "Make a button with btn and a color class on a button tag and a link", "Use mb-3, mt-3 and p-3 for spacing"],
 "6.4": ["Build a navbar from nav, container, navbar-brand, navbar-nav and nav-link", "Say what navbar-dark and bg-dark do together", "Explain what navbar-expand-lg does on wide and narrow screens", "Change the navbar color with a bg- class", "Put page content under the navbar in its own container"],
 "6.5": ["Build a card from card, card-body, card-title and card-text", "Add a picture at the top with card-img-top", "Put a button inside a card-body", "Lay out a row of cards with columns", "Predict how a row of cards stacks on a phone"],
 "6.6": ["Build a field from a div mb-3, a label form-label and an input form-control", "Use a textarea for long messages", "Link a label to its field with for and id", "Add a submit button with btn and a color", "Say what happens to a field without form-control"],
}
_LAB = None; _PARS = None
def lab():
    global _LAB
    if _LAB is None: _LAB = json.load(open(os.path.join(ROOT, "tools", "guides", "work", "ist", "lab_steps.json"), encoding="utf-8"))
    return _LAB
def parsons():
    global _PARS
    if _PARS is None:
        _PARS = {}
        for f in ("practice-data.js", "practice-data-2.js", "practice-data-3.js", "practice-data-4.js"):
            s = open(os.path.join(ROOT, "ist", "unit-6", f), encoding="utf-8").read(); _PARS.update(json.loads(s[s.index("{"):s.rindex("}") + 1])["lessons"])
    return _PARS
def esc(s): return _html.escape(s, quote=False)
def md(t): return gl.md(t)[3:-4] if gl.md(t).count("<p>") == 1 and gl.md(t).startswith("<p>") else gl.md(t)

def guided(cid):
    items = lab().get(LAB[cid]) or []
    if not items: return ""
    out = ""; started = False; intro = False; seen_h = False
    for it in items:
        if "h" in it and it["h"].startswith("Step"): started = True; out += '<h4 class="gs">%s</h4>' % esc(it["h"])
        elif not started:
            if "h" in it and it["h"] == "What you are building": seen_h = True
            elif seen_h and not intro and "p" in it:
                out += '<p class="lede">%s</p>' % md(re.sub(r"\s*\*\*Type it yourself.*$", "", it["p"])); intro = True
        elif "p" in it: out += "<p>%s</p>" % md(it["p"])
        elif "code" in it: out += '<pre class="code">%s</pre>' % esc(it["code"]).replace("\n", "<br>")
        elif "build" in it: out += '<div class="dothis"><span>YOU DO</span><ol>%s</ol></div>' % "".join("<li>%s</li>" % md(b) for b in it["build"])
    if not out: return ""
    return gl.sec_t("learn", "Guided Build: Make It Yourself", '<p class="lede">Follow the steps in order. Type every line yourself: typing is how the tags stick. Check your page against what the browser should show.</p>' + out, "BUILD IT")

def paper(cid, ctx):
    L = parsons().get(PARSONS[cid]);
    if not L: return ""
    ps = L["problems"]; pick = [i for i in (1, 3, 5, 7, 8, 9) if i < len(ps)]
    body = '<p class="lede">Write the code for each page on paper or in the HTML sandbox. Use the exact words from the story. Check your code against the answer key at the back.</p>'
    keys = []
    for n, i in enumerate(pick, 1):
        p = ps[i]; given = ('<pre class="code" style="margin:3pt 0 0"><b>%s</b><br>%s</pre>' % (esc(p['givenName']), esc(p['given']).replace('\n', '<br>'))) if p.get('given') else ''; body += '<div class="pq"><div class="qn">%s</div><div class="qs"><b>%s.</b> %s%s</div></div>' % ("P%d" % n, esc(p["title"]), esc(p["story"]), given)
        keys.append(("P%d" % n, "&#9998;", '<span style="display:block;font-family:\'JetBrains Mono\',monospace;font-size:8pt;white-space:pre-wrap;line-height:1.35">%s</span>' % esc("\n".join(p["sol"]))))
    ctx.extra_key = getattr(ctx, "extra_key", {}); ctx.extra_key.setdefault(cid, []).extend(keys)
    return gl.sec_t("trace", "Write It on Paper", body, "ON PAPER")

def checklist(cid):
    items = CHECK.get(cid)
    if not items: return ""
    return gl.sec_t("watch", "I Can&hellip; (Lesson Checklist)", '<ul class="chk">%s</ul><p class="lede" style="margin-top:6pt">Tick each one only when you can do it without looking. If you cannot, read that part of the lesson again.</p>' % "".join("<li>%s</li>" % esc(x) for x in items), "CHECKLIST")

def enrich(unit):
    for ch in unit.chapters:
        cid = ch["id"]
        ch["more"] = (lambda cid_: (lambda ctx: guided(cid_) + paper(cid_, ctx) + checklist(cid_)))(cid)
