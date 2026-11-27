"""Makes ist/unit-6/practice-3.html (the Unit 5: Intro to CSS Parsons / walkthrough hub) from practice.html, so all three units use exactly the same, tested page code. usage: python3 tools/css5/mk_practice3.py"""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); D = os.path.join(ROOT, 'ist', 'unit-6')
s = open(os.path.join(D, 'practice.html'), encoding='utf-8').read()
def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b)
rep('window.IST3', 'window.IST8'); rep('practice-data.js', 'practice-data-3.js'); rep('ist3:', 'ist8:')
rep('Unit 3: Web Design (HTML)', 'Unit 5: Intro to CSS'); rep('Back to Unit 3', 'Back to Unit 5: Intro to CSS'); rep('id="backEd" href="index.html"', 'id="backEd" href="../unit-8/index.html"')
rep('"HTML Parsons problems"', '"CSS Parsons problems"'); s = s.replace('HTML Parsons', 'CSS Parsons')
s = s.replace('Put the lines of HTML in the right order to build the page.', 'Put the lines of CSS (or the link in the HTML) in the right order.')
s = re.sub(r'var WLESS = \[.*?\];', 'var WLESS = [["8.1", "5.1", "External CSS and Classes"], ["8.2", "5.2", "CSS by ID"], ["8.3", "5.3", "Selectors and Specificity"], ["8.4", "5.4", "Pseudo-classes and Hover Effects"], ["8.5", "5.5", "Flexbox Basics"], ["8.6", "5.6", "CSS Grid Basics"]];', s, flags=re.S)
s = s.replace('· Unit 3"', '· Unit 5: Intro to CSS"')
open(os.path.join(D, 'practice-3.html'), 'w', encoding='utf-8').write(s)
print('practice-3.html written;', s.count('IST8'), 'IST8 references')
