"""Makes ist/unit-6/practice-4.html (the Unit 6: Bootstrap Parsons / walkthrough hub) from practice.html, so all three units use exactly the same, tested page code. usage: python3 tools/bs6/mk_practice4.py"""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); D = os.path.join(ROOT, 'ist', 'unit-6')
s = open(os.path.join(D, 'practice.html'), encoding='utf-8').read()
def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b)
rep('window.IST3', 'window.IST9'); rep('practice-data.js', 'practice-data-4.js'); rep('ist3:', 'ist9:')
rep('Unit 3: Web Design (HTML)', 'Unit 6: Bootstrap'); rep('Back to Unit 3', 'Back to Unit 6: Bootstrap'); rep('id="backEd" href="index.html"', 'id="backEd" href="../unit-9/index.html"')
rep('"HTML Parsons problems"', '"Bootstrap Parsons problems"'); s = s.replace('HTML Parsons', 'Bootstrap Parsons')
s = s.replace('Put the lines of HTML in the right order to build the page.', 'Put the lines of HTML (the Bootstrap classes) in the right order.')
s = re.sub(r'var WLESS = \[.*?\];', 'var WLESS = [["9.1", "6.1", "Setting Up Bootstrap"], ["9.2", "6.2", "The Grid System"], ["9.3", "6.3", "Typography, Colors and Buttons"], ["9.4", "6.4", "Navbar"], ["9.5", "6.5", "Cards"], ["9.6", "6.6", "Forms"]];', s, flags=re.S)
s = s.replace('· Unit 3"', '· Unit 6: Bootstrap"')
open(os.path.join(D, 'practice-4.html'), 'w', encoding='utf-8').write(s)
print('practice-4.html written;', s.count('IST9'), 'IST9 references')
