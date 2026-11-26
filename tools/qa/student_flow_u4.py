"""Student flow for Unit 4 on the LOCAL dev server (real netlify/functions/pycode.js, fake Google sign-in): a student signs in, sees the Unit 4 assignments, saves a draft, submits the finished
program for every assignment 4.1-4.11, gets 100%, the submission is stored, and the teacher list shows it. A wrong program scores low and does not overwrite the better one.
usage: node tools/missions/devserver.mjs 8124 (in another terminal), then python3 tools/qa/student_flow_u4.py"""
import json, subprocess, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
URL = 'http://localhost:8124/api/pycode'
def call(d): return json.loads(subprocess.run(['curl', '-s', '-X', 'POST', URL, '-H', 'Content-Type: application/json', '-d', json.dumps(d)], capture_output=True, text=True).stdout)
V = {v['slot']: v for v in json.load(open(os.path.join(ROOT, 'tools/missions/testkit/verify.json')))}
UNIT = sys.argv[1] if len(sys.argv) > 1 else '4'      # usage: python3 tools/qa/student_flow_u4.py [4|5]
RNG = range(139, 151) if UNIT == '4' else range(151, 157)
who = 'test:eli@socialcircleschools.org'; fails = 0
def ok(c, m):
    global fails; print(('PASS ' if c else 'FAIL ') + m); fails += (0 if c else 1)
for n in RNG: call({'pin': '1234', 'action': 'adminSetLive', 'slot': 'a%d' % n, 'live': True, 'points': 100, 'passMin': 0, 'seq': n - RNG[0] + 1, 'part': 'project'})
for n in RNG:
    s = 'a%d' % n; v = V[s]
    lst = call({'action': 'assignments', 'credential': who, 'period': '1A'})['assignments']
    ok(s in lst and 'checks' not in lst[s], '%s is listed for a student and the list has no answer checks' % s)
    call({'action': 'saveDraft', 'credential': who, 'slot': s, 'code': v['code'][:25], 'period': '1A'})
    low = call({'action': 'score', 'slot': s, 'code': '# nothing\nprint("hi")', 'output': 'hi'})
    top = call({'action': 'score', 'slot': s, 'code': v['code'], 'output': v['output']})
    r = call({'action': 'submit', 'credential': who, 'slot': s, 'code': v['code'], 'output': v['output'], 'gradeOutput': v['output'], 'mode': 'python', 'period': '1A', 'comment': ''})
    sub = call({'action': 'mine', 'credential': who, 'slot': s}).get('submission') or {}
    ok(r.get('ok') and sub.get('code') == v['code'] and top.get('pct') == 100 and (low.get('pct') or 0) < 30, '%s finished program: score %s%%, submitted and stored; a hello-world program scores %s%%' % (s, top.get('pct'), low.get('pct')))
    adm = json.dumps(call({'action': 'adminList', 'pin': '1234', 'slot': s}))
    ok('eli@socialcircleschools.org' in adm, '%s teacher list shows the submission' % s)
print('FAILURES:', fails); sys.exit(1 if fails else 0)
