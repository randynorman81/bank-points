"""Makes ist/unit-6/practice-2.html (the Unit 3 Part 2 Parsons / tracing / walkthrough hub) from practice.html, so both parts use exactly the same, tested page code. usage: python3 tools/ist/mk_practice2.py"""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')); D = os.path.join(ROOT, 'ist', 'unit-6')
s = open(os.path.join(D, 'practice.html'), encoding='utf-8').read()
def rep(a, b, count=None):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b) if count is None else s.replace(a, b, count)
rep('window.IST3', 'window.IST7'); rep('practice-data.js', 'practice-data-2.js'); rep('ist3:', 'ist7:')
rep('Unit 3: Web Design (HTML Part 1)', 'Unit 3: Web Design (HTML Part 2)'); rep('Back to Unit 3', 'Back to Unit 3 Part 2'); rep('id="backEd" href="index.html"', 'id="backEd" href="../unit-7/index.html"')
s = re.sub(r'var WLESS = \[.*?\];', 'var WLESS = [["7.1", "3.12", "Box Model"], ["7.2", "3.13", "Colors (Names and Hex)"], ["7.3", "3.14", "Display (Block vs Inline)"], ["7.4", "3.15", "Div Tag"], ["7.5", "3.16", "Tables"]];', s, flags=re.S)
s = s.replace('· Unit 3"', '· Unit 3 Part 2"')
open(os.path.join(D, 'practice-2.html'), 'w', encoding='utf-8').write(s)
print('practice-2.html written;', s.count('IST7'), 'IST7 references')
