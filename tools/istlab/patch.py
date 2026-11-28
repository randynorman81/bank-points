"""usage: python3 tools/istlab/patch.py FILE <<'EOF' ... EOF   each line: OLD ==> NEW   (exact text replacements, must match once)"""
import sys
p=sys.argv[1]; s=open(p).read()
for ln in sys.stdin.read().split("\n"):
    if "==>" not in ln: continue
    a,b=ln.split("==>",1); a=a.strip(); b=b.strip()
    if s.count(a)!=1: print("NOT ONCE (%d):"%s.count(a), a[:70]); continue
    s=s.replace(a,b)
open(p,'w').write(s)
