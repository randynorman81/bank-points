import json,sys
D=json.load(open('/Users/randynorman/bank-points/tools/missions/testkit/u3-dump.json'))
for k in sys.argv[1:]:
    a=D[k]; print('=====',k,a['name'],'| answers',a['answers'])
    for i,s in enumerate(a['stages']):
        print('[%d] %s'%(i,s['title'])); print('   SAY:',' '.join(s['say'])[:int(__import__('os').environ.get('SAYN','700'))])
        print('   CHK:',' | '.join('%d:%s'%(j,c) for j,c in enumerate(s['chk']))); print('   RUN:',s['run'],'| RUNCHK:',s['runChk']); print('   NEW OUT:',s['new'])
