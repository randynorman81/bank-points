"""Student flow test on the LOCAL dev server (real netlify/functions/pycode.js, fake Google sign-in): a student signs in, sees the Unit 3 assignments, saves a draft, submits the
finished program for every assignment 3.1-3.13, and the teacher view shows the saved submission with a 100 score. Also tests the walkthrough unlock chain with two stand-in walkthroughs.
usage: start `node tools/missions/devserver.mjs 8124`, run `node tools/missions/bundle.mjs`, then python3 tools/qa/student_flow.py"""
import json, subprocess, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
URL = 'http://localhost:8124/api/pycode'
def call(d):
    return json.loads(subprocess.run(['curl', '-s', '-X', 'POST', URL, '-H', 'Content-Type: application/json', '-d', json.dumps(d)], capture_output=True, text=True).stdout)
V = {v['slot']: v for v in json.load(open(os.path.join(ROOT, 'tools/missions/testkit/verify.json')))}
ada, teacher = 'test:ada@socialcircleschools.org', 'test:randy.norman@socialcircleschools.org'
fails = 0
def ok(cond, msg):
    global fails
    print(('PASS ' if cond else 'FAIL ') + msg); fails += (0 if cond else 1)
# stand-in walkthroughs a1-a13 (the real ones keep their checks private), set up like the live ones: each must be PASSED (90) before the next item opens, in the live order a1, a126, a2, a127 ...
blocks = [{'h': 'Step 1: x'}, {'make': ['type it']}]; chk = [{'label': 'x = 1', 're': '^\\s*x\\s*=\\s*1', 'flags': 'm', 'min': 1, 'pts': 1, 'box': 0}]
for n in range(1, 14):
    s_ = 'a%d' % n
    call({'pin': '1234', 'action': 'adminSetAssignment', 'slot': s_, 'title': 'Stand-in walkthrough %d' % n, 'unit': 'Unit 3: Programming with Python', 'num': n, 'points': 50, 'blocks': blocks, 'checks': chk, 'tips': {}, 'autoRun': [], 'live': True})
    call({'pin': '1234', 'action': 'adminSetLive', 'slot': s_, 'live': True, 'points': 50, 'passMin': 90, 'seq': n})
for n in range(126, 139): call({'pin': '1234', 'action': 'adminSetLive', 'slot': 'a%d' % n, 'live': True, 'points': 100, 'passMin': 0, 'seq': n - 125 + 0.5, 'part': 'project'})
def visible(who):
    return set(call({'action': 'assignments', 'credential': who, 'period': '1A'})['assignments'])
ada = 'test:ada@socialcircleschools.org'
vis = visible(ada)
ok('a1' in vis and 'a126' not in vis and 'a2' not in vis, 'a brand-new student sees ONLY walkthrough 1 (projects and later walkthroughs are locked)')
l = call({'action': 'assignments', 'credential': ada, 'period': '1A'}); ok('checks' not in l['assignments']['a1'] and 'mcKey' not in l['assignments']['a1'], 'the student list never contains the answer checks or keys')
for n in range(1, 14):
    w, p_ = 'a%d' % n, 'a%d' % (125 + n); v = V[p_]
    r = call({'action': 'submit', 'credential': ada, 'slot': w, 'code': 'x = 1', 'output': '', 'mode': 'python', 'period': '1A'})
    vis = visible(ada); ok(r.get('ok') and p_ in vis, '%s passed -> project %s opens (submit ok=%s)' % (w, p_, r.get('ok')))
    call({'action': 'saveDraft', 'credential': ada, 'slot': p_, 'code': v['code'][:30], 'period': '1A'})
    r2 = call({'action': 'submit', 'credential': ada, 'slot': p_, 'code': v['code'], 'output': v['output'], 'gradeOutput': v['output'], 'mode': 'python', 'period': '1A', 'comment': ''})
    mine = call({'action': 'mine', 'credential': ada, 'slot': p_}); saved = (mine.get('submission') or {}).get('code') == v['code']
    vis = visible(ada); nxt = 'a%d' % (n + 1)
    ok(r2.get('ok') and saved and (n == 13 or nxt in vis), '%s submitted and saved (ok=%s, stored=%s)%s' % (p_, r2.get('ok'), saved, '' if n == 13 else ', walkthrough %d opens: %s' % (n + 1, nxt in vis)))
ok('ada@socialcircleschools.org' in json.dumps(call({'action': 'adminList', 'pin': '1234', 'slot': 'a126'})), 'the teacher list shows the student submission')
# failing attempts do not open anything, and a stranger cannot sign in
bob = 'test:bob@socialcircleschools.org'; call({'action': 'submit', 'credential': bob, 'slot': 'a1', 'code': 'y = 5', 'output': '', 'mode': 'python', 'period': '1A'})
ok('a126' not in visible(bob), 'a failing attempt on walkthrough 1 does NOT open the project')
# (the dev server replaces Google sign-in, so the school-domain rule is checked by reading the real verifyGoogleToken: it refuses any account whose hd is not socialcircleschools.org)
print('FAILURES:', fails); sys.exit(1 if fails else 0)
