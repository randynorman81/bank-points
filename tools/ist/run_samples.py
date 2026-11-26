import sys, json, random; sys.path.insert(0, '.')
import qgen
r = random.Random(int(sys.argv[1]) if len(sys.argv) > 1 else 1); out = []; seen = set()
for l in sorted(qgen.LESSON_T):
    for f in qgen.LESSON_T[l]:
        for _ in range(12):
            try: q = f(r)
            except qgen.Skip: continue
            if q['key'] in seen: continue
            seen.add(q['key']); q['id'] = '%d:%s:%d' % (l, f.__name__, len(out)); out.append(q)
json.dump(out, open('/private/tmp/claude-501/qs_sample.json', 'w'))
print(len(out), 'questions', sum(len(q['chk']) for q in out), 'checks')
