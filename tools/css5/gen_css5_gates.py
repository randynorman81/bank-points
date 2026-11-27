import re
GATES = [  # (regex over the css/html lines, concept, rank)
    (r'(^|[\s,])#[A-Za-z]', 'id selector', 17), (r'\bid="', 'id attribute', 17),
    (r'class="[^"]*\s[^"]*"', 'two classes on one tag', 18), (r'^\s*[A-Za-z0-9.#]+[.#][A-Za-z]|^\s*[.#A-Za-z0-9]+\s+[.#A-Za-z]+\s*\{', 'combined or descendant selector', 18), (r'style="', 'inline style', 2),
    (r':hover|:focus|:active', 'pseudo-class', 19), (r'\btransition\b', 'transition', 19),
    (r'display:\s*flex|justify-content|align-items|flex-direction|\bgap\b', 'flexbox', 20),
    (r'display:\s*grid|grid-template-columns|\bfr\b', 'grid', 21),
    (r'#[0-9A-Fa-f]{3,8}\b(?![^<]*>)', 'hex colors', 11),
    (r'\bflexbox\b|\bflex (container|item)s?\b', 'flexbox (words)', 20), (r'\bgrids?\b(?! of)|\bfr unit', 'grid (words)', 21), (r'\bhover(ed|ing)?\b|\bfocus\b|\bpseudo-class|\btransitions?\b', 'hover/transition (words)', 19), (r'\bspecificity\b|\bdescendant\b', 'specificity (words)', 18),
    (r'border-radius|box-shadow|text-decoration|font-weight|line-height|opacity|position|float|overflow|@media|repeat\(|nth-child|grid-template-rows|flex-wrap|flex:\s|calc\(|rem\b|\bem\b|vh\b|vw\b|justify-items|place-|grid-area|!important|border-color|<style', 'something never taught', 99),
]

RANKS = {16: 16, 17: 17, 18: 18, 19: 19, 20: 20, 21: 21}
def audit(text, lesson):
    t = text
    out = []
    for rx, name, r in GATES:
        if r > RANKS[lesson] and re.search(rx, t, re.M): out.append('%s (taught at %d, this lesson is %d)' % (name, r, RANKS[lesson]))
    return out
