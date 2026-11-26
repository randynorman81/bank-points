"""Re-checks every generated Unit 4 game question by running its code in Python (run tools/qa/game_dump_u4.mjs first).
 - a question with a py block: running the code must print exactly py.out (or fail with the shown error), and the marked answer must be that output
 - 'How many times does this program print X?': counted from a real run
 - questions with code but no py block, and the concept questions with no code, are listed once each for a human read
usage: node tools/qa/game_dump_u4.mjs && python3 tools/qa/game_audit_u4.py"""
import json, re, sys, os, io, contextlib, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'parsons'))
d = json.load(open('/private/tmp/claude-501/game_u4.json'))
def plain(code, ins):
    feed = iter(ins); buf = io.StringIO(); g = {'input': lambda p='': next(feed)}
    with contextlib.redirect_stdout(buf): exec(compile(code, 'q', 'exec'), g)
    return buf.getvalue().rstrip('\n')
ok = bad = 0; shown = collections.Counter(); concept = collections.OrderedDict(); codeonly = collections.OrderedDict()
for x in d:
    ch = x['choices']; ans = ch[x['a']['idx']] if ch else None
    py = x['py']
    if py:
        try: out = plain(py['code'], py['inp'] or []); err = ''
        except BaseException as e: out = ''; err = type(e).__name__
        want_err = py.get('err') or ''
        if err and not want_err: bad += 1; print('RUN FAILS', x['id'], x['prompt'][:60], '|', py['code'][:60].replace('\n', ' ; '), err); continue
        if not err and want_err: bad += 1; print('SHOULD FAIL', x['id'], x['prompt'][:60], '|', py['code'][:60].replace('\n', ' ; ')); continue
        if not err and out != py['out']: bad += 1; print('OUTPUT DIFFERS', x['id'], repr(out), 'vs', repr(py['out']), '|', py['code'][:60].replace('\n', ' ; ')); continue
        # the marked choice must be the output (a multi-line output may be written with 'then' or on one line)
        norm = lambda t: re.sub(r'\s+', ' ', str(t).replace(' then ', ' ').replace('\n', ' ')).strip()
        if err: good = bool(re.search('rror', str(ans)))
        elif out == '' and py['out'] == '': good = bool(re.match(r'(?i)nothing', str(ans)))
        else: good = norm(ans) == norm(py['out']) or norm(ans) == norm(out)
        if good: ok += 1
        else: bad += 1; (shown.update(['m']), shown['m'] < 6 and print('MARKED ANSWER DIFFERS', x['id'], x['prompt'][:60], '| marked', repr(ans), '| output', repr(out), '|', py['code'][:50].replace('\n', ' ; ')))
    elif x['code']:
        m = re.match(r'How many times does this program print (\w+)\?', x['prompt'])
        if m:
            try:
                out = plain(x['code'], []).split('\n'); n = sum(1 for l in out if l == m.group(1))
                if str(n) == str(ans): ok += 1
                else: bad += 1; print('COUNT DIFFERS', x['id'], x['code'][:50].replace('\n', ' ; '), 'run:', n, 'marked:', ans)
            except Exception as e: bad += 1; print('COUNT RUN FAILS', x['id'], e)
        else: codeonly.setdefault((x['id'], x['prompt'][:90], x['code'][:90]), (ans, x['why']))
    else:
        concept.setdefault((x['id'], x['prompt'][:110]), (ans, x['why']))
print('\nverified by running code: %d | wrong: %d' % (ok, bad))
print('\nCODE QUESTIONS WITHOUT A py BLOCK (%d distinct), human read:' % len(codeonly))
for k, v in list(codeonly.items())[:60]: print('  ', k[0], '|', k[1], '|', k[2].replace('\n', ' ; '), '=>', v[0], '|', v[1][:80])
print('\nCONCEPT QUESTIONS (%d distinct), human read:' % len(concept))
for k, v in concept.items(): print('  ', k[0], '|', k[1], '=>', v[0], '|', (v[1] or '')[:100])
