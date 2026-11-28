"""Concept-order gates for Unit 6 (Bootstrap): 6.1-6.6 = ranks 22-27. Anything Bootstrap that is not listed here is never taught (rank 99)."""
import re
TAUGHT = [  # (rank, regex over a whole class token)
    (23, r'container|row|col|col-(?:[1-9]|1[0-2])|col-md-(?:[1-9]|1[0-2])'),
    (24, r'text-(?:center|muted|white|primary|secondary|success|danger|warning|info)|bg-(?:primary|secondary|success|danger|warning|info|light|dark)|fw-bold|btn|btn-(?:primary|secondary|success|danger|warning|info)|mb-3|mt-3|p-[0-5]'),
    (25, r'navbar|navbar-expand-lg|navbar-dark|navbar-brand|navbar-nav|nav-link'),
    (26, r'card|card-img-top|card-body|card-title|card-text'),
    (27, r'form-label|form-control'),
]
BSPREFIX = re.compile(r'^(?:container|row|col|btn|card|navbar|nav|form|text|bg|fw|fs|m[tbsexy]?|p[tbsexy]?|d|g|gap|justify|align|w|h|shadow|rounded|border|badge|alert|list|table|modal|carousel|collapse|dropdown|offset|order|position|float|visible|invisible|lead|display|small|mark|blockquote|img|figure|ratio|sticky|fixed|vstack|hstack|spinner|toast|progress|accordion|pagination|breadcrumb|input|row-cols)(?:-|$)')
def class_rank(tok):
    for r, rx in TAUGHT:
        if re.fullmatch(rx, tok): return r
    return 99 if BSPREFIX.match(tok) else 0     # 0 = a class the student invented (allowed anywhere)
OTHER = [  # (regex, concept, rank)
    (r'<\s*/?nav\b', 'nav tag', 25), (r'<\s*/?button\b', 'button tag', 24), (r'<\s*/?(?:form|label|input|textarea)\b', 'form tags', 27), (r'<\s*script\b|data-bs-|\.js\b|bootstrap\.bundle', 'Bootstrap JavaScript', 99),
    (r'\b(?:hamburger|toggler|collapse|modal|carousel|dropdown|offcanvas|gutter|offset)\b', 'a Bootstrap feature this course never teaches', 99),
    (r'\bbreakpoint|\bresponsive\b|\bcol-md', 'responsive columns', 23), (r'\bnavbar\b|\bnav-link', 'navbar', 25), (r'\bcard\b(?!s? game)|\bcards\b', 'cards (words)', 26), (r'\bform-(?:label|control)|\blabel for|\bplaceholder\b', 'forms (words)', 27),
    (r'\btext-(?:center|muted|white|primary|secondary|success|danger|warning|info)\b|\bbg-(?:primary|secondary|success|danger|warning|info|light|dark)\b|\bfw-bold\b|\bbtn\b|\butility class', 'utilities and buttons (words)', 24),
    (r'\bd-flex\b|\bjustify-content-|\bshadow\b|\brounded\b|\bbadge\b|\balert\b|\bcontainer-fluid\b|\bform-select\b|\bform-check\b|\bform-text\b|\bnavbar-light\b|\btext-bg-|\bbtn-light\b|\bbtn-dark\b|\bbtn-outline|\bw-100\b|\bfs-\d\b|\bms-\d\b|\bme-\d\b|\bmx-|\bmy-|\bg-\d\b|\brow-cols', 'a Bootstrap class this course never teaches', 99),
]
OTHER = [(re.compile(a, re.I), b, c) for a, b, c in OTHER]
def audit(text, lesson):
    out = []
    t = text
    for m in re.finditer(r'class="([^"]*)"', t):
        for tok in m.group(1).split():
            r = class_rank(tok)
            if r > lesson: out.append('class %s (taught at %s)' % (tok, r))
    for rx, name, r in OTHER:
        if r > lesson and rx.search(t): out.append('%s (taught at %s)' % (name, r))
    return out
