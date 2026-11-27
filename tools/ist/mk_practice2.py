"""Makes ist/unit-6/practice-2.html (the Unit 4: Advanced HTML Parsons / tracing / walkthrough hub) from practice.html, so both parts use exactly the same, tested page code. usage: python3 tools/ist/mk_practice2.py"""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); D = os.path.join(ROOT, 'ist', 'unit-6')
s = open(os.path.join(D, 'practice.html'), encoding='utf-8').read()
def rep(a, b, count=None):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b) if count is None else s.replace(a, b, count)
rep('window.IST3', 'window.IST7'); rep('practice-data.js', 'practice-data-2.js'); rep('ist3:', 'ist7:')
rep('Unit 3: Web Design (HTML)', 'Unit 4: Advanced HTML'); rep('Back to Unit 3', 'Back to Unit 4: Advanced HTML'); rep('id="backEd" href="index.html"', 'id="backEd" href="../unit-7/index.html"')
s = re.sub(r'var WLESS = \[.*?\];', 'var WLESS = [["7.1", "4.1", "Box Model"], ["7.2", "4.2", "Colors (Names and Hex)"], ["7.3", "4.3", "Display (Block vs Inline)"], ["7.4", "4.4", "Div Tag"], ["7.5", "4.5", "Tables"]];', s, flags=re.S)
s = s.replace('· Unit 3"', '· Unit 4: Advanced HTML"')
open(os.path.join(D, 'practice-2.html'), 'w', encoding='utf-8').write(s)
print('practice-2.html written;', s.count('IST7'), 'IST7 references')
