from ist_lib import *
from units.ist03_a import CHAPTERS_A
try:
    from units.ist03_b import CHAPTERS_B
except ImportError: CHAPTERS_B = []
try:
    from units.ist03_c import CHAPTERS_C
except ImportError: CHAPTERS_C = []

BRAND = dict(kicker="INTRO TO SOFTWARE TECHNOLOGY  ·  STUDY GUIDE", doctitle="IST", series="Intro to Software Technology Study Guide Series", site="schscomputerscience.com/ist",
             legal="Netflix, Spotify, Nintendo, Chipotle, Airbnb, Pokémon, Apple, Taco Bell, YouTube, Pizza Hut, NASA and Wikipedia are trademarks of their owners, who were not involved in this guide and do not endorse it. They are used only to give realistic examples. All other names are the property of their owners.",
             trace_legend="Play browser. Step through the code one line at a time and watch the page being built. There are several in every lesson.",
             glance_legend="where the matching notes, walkthrough, assignment, and quiz game are on the site")
UNIT = Unit(3, "Web Design 1: HTML", "Build real web pages: the skeleton, headings and paragraphs, colors, text styles, fonts, borders, pictures, emojis, links and lists.",
    "Web Design: HTML Part 1", "#0D9488", "#0F766E", "#5EEAD4", "#CCFBF1", "html",
    ["Build a web page from the HTML skeleton: doctype, html, head, title and body", "Change colors, sizes, alignment and letter case with the style attribute", "Use strong, em, br, hr and span, and load Google fonts", "Draw borders, add pictures and a favicon, and use emojis and symbols", "Make links, including picture links, and build ordered, unordered and menu lists", "Read HTML like a browser: trace a page one line at a time"],
    CHAPTERS_A + CHAPTERS_B + CHAPTERS_C, glossary=[], brand=BRAND, seed=11)
