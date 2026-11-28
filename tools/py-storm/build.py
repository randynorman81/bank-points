import re, sys
src = open('../tag-storm/index.html').read()
def rep(old, new, n=1):
    global src
    c = src.count(old)
    if c != n: print("MISMATCH", c, "!=", n, old[:80]); sys.exit(1)
    src = src.replace(old, new)

# ---- data block
a = src.index('      /* ============================================================\n         1. HTML5 & CSS CURRICULUM PACKS')
b = src.index("      const TEACHER_CFG_STORAGE_KEY")
src = src[:a] + open('data.js.part').read() + src[b:]
src = src.replace('HTML_PACKS', 'PYTHON_PACKS')
rep("'tag_storm_teacher_cfg_v1'", "'py_storm_teacher_cfg_v1'")
rep("'tag_storm_arcade_v1'", "'py_storm_apcsp_v1'")
# ---- default config
a = src.index('        return {\n          title: \'TAG STORM\'')
b = src.index('        };\n      }', a) + len('        };\n')
src = src[:a] + """        return {
          title: 'PY STORM',
          section: 'SCHS APCSP',
          packs: ['variables', 'strings_io', 'conditionals', 'loops', 'lists', 'functions', 'algorithms_ap'],
          modes: { VALID: true, CATEGORY: true, BUILD: true, BOSS: true },
          customOnly: false,
          customValid: [],
          customBroken: [],
          theme: 'python',
          topColor: '#38bdf8',
          botColor: '#38bdf8',
          bgColor: '#060b18',
          speedMult: 1.0,
          diffLock: 'unlock',
          ecEnabled: true,
          ecRookieMax: 5,
          ecScholarMax: 10,
          ecFiveMax: 15
        };
""" + src[b:]
# ---- difficulty names / keys
for old, new in [("ecFreshmanMax","ecRookieMax"),("ecDeansMax","ecScholarMax"),("ecInsaneMax","ecFiveMax"),
                 ("tc-ec-freshman","tc-ec-rookie"),("tc-ec-deans","tc-ec-scholar"),("tc-ec-insane","tc-ec-five"),
                 ("DIFFICULTIES.deans","DIFFICULTIES.scholar"),("let selectedDifficulty = 'deans'","let selectedDifficulty = 'scholar'"),
                 ("diffKey === 'freshman'","diffKey === 'rookie'"),("diffKey === 'deans'","diffKey === 'scholar'"),
                 ("['freshman', 'deans', 'insane']","['rookie', 'scholar', 'five']")]:
    if old not in src: print("MISSING", old); sys.exit(1)
    src = src.replace(old, new)
rep('<option value="freshman">Lock to Freshman</option>','<option value="rookie">Lock to Script Rookie</option>')
rep('<option value="deans">Lock to Dean\'s List</option>','<option value="scholar">Lock to AP Scholar</option>')
rep('<option value="insane">Lock to 404 Insane</option>','<option value="five">Lock to Score a 5</option>')
rep('Freshman Max','Script Rookie Max'); rep('404 Insane Max','Score a 5 Max')
src = re.sub(r'(<span class="text-slate-400 text-\[10px\]">)Dean\'s List Max', r'\1AP Scholar Max', src)
# ---- text
rep("TAG STORM — HTML5 &amp; CSS Arcade","PY STORM — APCSP Python Arcade")
rep("PHRASE","") if False else None
src = src.replace("TAG STORM","PY STORM").replace("Tag Storm","Py Storm")
src = src.replace("'INTRO TO WEB'","'SCHS APCSP'").replace("INTRO TO WEB","SCHS APCSP")
src = src.replace("HTML / CSS Mistake Autopsy (Why Clicked Bugs Were Wrong)","Python Traceback Autopsy (Why Clicked Bugs Were Wrong)")
src = src.replace("Click ONLY valid HTML/CSS syntax — skip broken bugs!","Click ONLY valid Python syntax — skip broken bugs!")
src = src.replace("Active HTML5 &amp; CSS Curriculum Packs","Active APCSP Python Packs").replace("+ Add Valid HTML / CSS Snippet","+ Add Valid Python Snippet")
src = src.replace("Broken HTML/CSS syntax — skip bugs like this!","Broken Python syntax — skip bugs like this!")
src = src.replace("TAG_STORM_HTML_SALT_2026","PY_STORM_PYTHON_SALT_2026").replace("HTML5 LMS RECEIPT","Python LMS RECEIPT")
src = src.replace("'HTML Basics'","'Variables & Math'")
src = src.replace("'404-OVERLORD'","'SYNTAX-OVERLORD'").replace("'502-GATEWAY'","'TRACEBACK-GATE'")
src = src.replace("PURGE PULSE CLEARED","DEBUG PULSE CLEARED")
src = src.replace("⚡ PURGE +1","⚡ PULSE +1").replace("+1 PURGE!","+1 PULSE!").replace("&#9889; Purge","&#9889; Debug Pulse")
src = src.replace("wipe the broken code off the screen","wipe the broken Python off the screen")
# hasCss logic
src = src.replace("const hasCss = Array.isArray(teacherConfig.packs) && teacherConfig.packs.includes('css_styles');\n        const codeWord = hasCss ? 'HTML / CSS' : 'HTML5';","const codeWord = 'PYTHON';")
src = src.replace("(hasCss ? 'VALID HTML / CSS' : 'VALID HTML5')","'VALID PYTHON'")
src = re.sub(r"\n\s*const hasCss = Array.isArray\(teacherConfig.packs\) && teacherConfig.packs.includes\('css_styles'\);","",src)
# api + sign-in
src = src.replace("API: '/api/tagstorm'","API: '/api/pystorm'").replace("/api/pystorm'","/api/pystorm'")
src = src.replace("API: '/api/pystorm'","API: '/api/pystorm'")
src = src.replace('<option value="3A">3A</option><option value="3B">3B</option><option value="4A">4A</option>','<option value="1A">1A</option><option value="2B">2B</option>')
# field guide
a = src.index('<details class="text-xs text-slate-300">')
b = src.index('</details>', a) + len('</details>')
guide = '''<details class="text-xs text-slate-300">
        <summary class="cursor-pointer font-mono font-bold text-cyan-300 mb-2">Python cheat sheet</summary>
        <div class="space-y-3 mt-2">
          <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-3"><div class="font-mono font-bold text-sky-400 mb-1">1. VARIABLES, BOOLEANS &amp; STRINGS</div><p>Variable names cannot start with a digit (<code class="text-rose-300">1st_val</code> is invalid). Booleans are capitalized: <code class="text-emerald-300">True</code> / <code class="text-emerald-300">False</code>. Use <code class="text-emerald-300">len(word)</code> (not <code class="text-rose-300">.length</code>) and <code class="text-emerald-300">print()</code> (lowercase).</p></div>
          <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-3"><div class="font-mono font-bold text-emerald-400 mb-1">2. CONDITIONALS &amp; LOGIC</div><p>Python uses <code class="text-emerald-300">if</code>, <code class="text-emerald-300">elif</code> (not <code class="text-rose-300">else if</code>), <code class="text-emerald-300">else:</code>, and the words <code class="text-emerald-300">and</code>, <code class="text-emerald-300">or</code>, <code class="text-emerald-300">not</code> (never <code class="text-rose-300">&amp;&amp;</code> or <code class="text-rose-300">||</code>). End headers with a colon <code class="text-amber-300">:</code> and use <code class="text-emerald-300">==</code> to compare.</p></div>
          <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-3"><div class="font-mono font-bold text-cyan-400 mb-1">3. LISTS &amp; FUNCTIONS</div><p>Python lists are <strong>0-indexed</strong> with square brackets <code class="text-emerald-300">nums[0]</code>, <code class="text-emerald-300">nums[-1]</code>, and methods like <code class="text-emerald-300">.append(x)</code> (not <code class="text-rose-300">.push()</code>). Functions start with <code class="text-emerald-300">def name(param):</code> and return values with <code class="text-emerald-300">return val</code>.</p></div>
          <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-3"><div class="font-mono font-bold text-violet-400 mb-1">4. LOOPS, DIVISION &amp; RANDOM</div><p><code class="text-sky-300">range(5)</code> generates <code class="text-amber-300">0, 1, 2, 3, 4</code> (the stop value is exclusive). Use <code class="text-emerald-300">//</code> for integer division, <code class="text-emerald-300">%</code> for the remainder (MOD), and <code class="text-emerald-300">random.randint(a, b)</code> for random integers that include both ends.</p></div>
        </div>
      </details>'''
src = src[:a] + guide + src[b:]
for old, new in [('>VALID HTML5</span>','>VALID PYTHON</span>'),
  ('placeholder="e.g., <nav>...</nav> or gap: 1rem;"','placeholder="e.g., total += price"'),
  ("placeholder=\"e.g., <a herf='home.html'>\"",'placeholder="e.g., if x = 5:"'),
  ('Syntax error in HTML/CSS snippet.','Syntax error in Python snippet.'),
  ('Teacher Studio reset to HTML5 & CSS defaults.','Teacher Studio reset to Python defaults.'),
  ('Custom HTML/CSS lesson saved!','Custom Python lesson saved!'),
  ('<!-- HTML/CSS Mistake Autopsy -->','<!-- Python Traceback Autopsy -->'),
  ('HTML & CSS FIELD GUIDE MODAL','PYTHON FIELD GUIDE MODAL'),
  ('(/api/tagstorm)','(/api/pystorm)'),
  ('Python Mistake Autopsy','Python Traceback Autopsy')]:
    src = src.replace(old, new)
open('index.html','w').write(src)
print("built", len(src))
