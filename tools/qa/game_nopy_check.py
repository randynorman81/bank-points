"""Game questions that carry code but no 'py' block (the answer is a sentence such as 'the program prints 42 and then 67'): run the code and check that every printed line appears, in order, in the marked answer.
usage: node tools/qa/game_dump_u4.mjs u3 && python3 tools/qa/game_nopy_check.py 3"""
import json, re, sys, io, contextlib
PRE = 'u' + (sys.argv[1] if len(sys.argv) > 1 else '3')
d = json.load(open('/private/tmp/claude-501/game_%s.json' % PRE))
ok = bad = skip = 0; seen = set()
for x in d:
    if x['py'] or not x['code'] or not x['choices']: continue
    ans = x['choices'][x['a']['idx']]; key = (x['id'], x['code'], ans)
    if key in seen: continue
    seen.add(key)
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf): exec(compile(x['code'], 'q', 'exec'), {'input': lambda p='': (_ for _ in ()).throw(EOFError())})
    except EOFError: skip += 1; continue
    except BaseException as e: out = 'ERR ' + type(e).__name__
    else: out = buf.getvalue().strip()
    lines = [l.strip() for l in out.split('\n') if l.strip()]
    pos = 0; good = True; low = ans.lower()
    if out.startswith('ERR'):
        good = bool(re.search(r'error|crash|fails|exception', low))
    else:
        for l in lines:
            i = low.find(l.lower(), pos)
            if i < 0: good = False; break
            pos = i + len(l)
    if good: ok += 1
    else: bad += 1; print('CHECK', x['id'], '|', x['prompt'][:60], '|', x['code'][:90].replace('\n', ' ; '), '| real:', out[:60].replace('\n', ' / '), '| marked:', ans[:80])
print('confirmed:', ok, '| to read:', bad, '| needs typed input (skipped):', skip)
# every question: the four choices are all different, and the marked index exists
dup = 0
for x in d:
    ch = x['choices']
    if not ch: continue
    if any(c is None for c in ch) or len(set(str(c).strip() for c in ch)) != len(ch) or not (0 <= x['a']['idx'] < len(ch)): dup += 1; print('DUPLICATE OR BAD INDEX', x['id'], x['prompt'][:60], ch)
print('questions with duplicate choices or a bad answer index:', dup, 'of', len(d))
