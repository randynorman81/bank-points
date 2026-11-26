from ist_lib import *
from units.ist03p2_a import CHAPTERS_A
from units.ist03p2_b import CHAPTERS_B
from units.ist03 import BRAND
UNIT = Unit(3, "HTML Layout and Tables", "Build real layouts: the box model, hex colors, block and inline display, the div, and tables.",
    "Web Design: HTML Part 2", "#0D9488", "#0F766E", "#5EEAD4", "#CCFBF1", "html",
    ["Describe every box with content, padding, border and margin, and add up its real size", "Name any color as a word or as a hex code, and read a hex code as red, green and blue", "Use block, inline and inline-block display to build menus and buttons", "Group tags with divs and build side-by-side columns and multi-row layouts", "Build tables from rows and cells and keep every row the same length"],
    CHAPTERS_A + CHAPTERS_B, glossary=[], brand=BRAND, seed=13)
