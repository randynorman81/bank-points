"""Prints some generated Unit 4 traces so a person can read them.  usage: python3 show_u4.py u4l6 3 4 8"""
import sys
sys.path.insert(0, '.')
import gen_u4pt as g
if __name__ == '__main__':
    lid = sys.argv[1]; idx = [int(x) for x in sys.argv[2:]] or [0]
    P, T = g.main([lid])
    for k in idx:
        t = T[lid]['traces'][k]
        print('=====', lid, t['title'], '|', t['intro'][:140], '| input:', t['ins']); print('\n'.join(t['code']))
        for st in t['steps']: print('  L%d' % (st[3] + 1), st[0], st[1], '|', st[2][:110], '| removed', st[4])
