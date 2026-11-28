shell = open('shell.html').read()
body = '<script>\n(function () {\n"use strict";\n' + open('challenges.js').read() + '\n' + open('app.js').read() + '\n})();\n</script>'
open('index.html', 'w').write(shell.replace('<!--APP-->', body))
print('built')
