# Lesson 3.5: Google Fonts (link tag in the head) and font-family
L = lambda *a: '\n'.join(a)
def P(title, story, code, dis): return (title, story, code, dis)
PRE1 = '<link rel="preconnect" href="https://fonts.googleapis.com">'
PRE2 = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
def FONT(name): return '<link href="https://fonts.googleapis.com/css2?family=%s&display=swap" rel="stylesheet">' % name
P35 = [
 P('Use a font family', 'Set the font of the heading Fancy Title to Georgia with font-family, and add a paragraph that says A classic look.',
   L('<h1 style="font-family: \'Georgia\';">Fancy Title</h1>', '<p>A classic look.</p>'),
   [(0, '<h1 style="font-family: Georgia;">Fancy Title</h1'), (0, '<h1 style="font-family: \'Georgia\'">Fancy Title</h1'), (0, '<h1 style="font-famly: \'Georgia\';">Fancy Title</h1>')]),
 P('A family and a backup', 'Set the paragraph A clean modern look. to Arial, and give it sans-serif as the backup font, using font-family.',
   L('<p style="font-family: Arial, sans-serif;">A clean modern look.</p>'),
   [(0, '<p style="font-family: Arial sans-serif;">A clean modern look.</p>'), (0, '<p style="font-family: Arial, sans-serif;">A clean modern look.</h1>'), (0, '<p style="font-family: Arial, ;">A clean modern look.</p>')]),
 P('The monospace family', 'Show the paragraph print("hi") in the monospace family, like typed code. Then add a normal paragraph that says That is code.',
   L('<p style="font-family: monospace;">print("hi")</p>', '<p>That is code.</p>'),
   [(0, '<p style="font-family: monospaced;">print("hi")</p>'), (0, '<p style="font-family: monospace;">print("hi")<p>'), (0, '<p style="font-style: monospace;">print("hi")</p>')]),
 P('Link one Google font', 'Build a small page. The html box has a head and a body. In the head, load the Google font Pacifico with the link tag. The body has a heading that says Hello.',
   L('<html>', '<head>', FONT('Pacifico'), '</head>', '<body>', '<h1>Hello</h1>', '</body>', '</html>'),
   [(2, '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet"'), (2, FONT('Pacifico')[:-1] + '</link>'), (3, '</hed>')]),
 P('Use the font you linked', 'The Google font Pacifico is already linked in the head. Now use it: make the level 2 heading Beach Party use Pacifico with font-family, and add a level 3 heading that says Bring a towel.',
   L('<h2 style="font-family: \'Pacifico\';">Beach Party</h2>', '<h3>Bring a towel.</h3>'),
   [(0, '<h2 style="font-family: Pacifco;">Beach Party</h2>'), (0, '<h2 style="font-family: \'Pacifico\';>Beach Party</h2>'), (1, '<h3>Bring a towel.</h2>')]),
 P('A font with a space in its name', 'Use the Google font Bebas Neue on the heading Game Night. The name has a space, so it goes in quotes inside the style. Under it write a level 2 heading Snacks provided. and a level 3 heading Bring a friend.',
   L('<h1 style="font-family: \'Bebas Neue\';">Game Night</h1>', '<h2>Snacks provided.</h2>', '<h3>Bring a friend.</h3>'),
   [(0, '<h1 style="font-family: \'Bebas Nue\';">Game Night</h1>'), (0, '<h1 style="font-family: \'Bebas Neue\'; ">Game Night<h1>'), (0, '<h1 style="font-family: \'Bebas Neue\' color: red;">Game Night</h1>')]),
 P('Two fonts, each with a job', 'Give the heading Quiet Lake a fancy display font (Lobster) and give the paragraph below it an easy-to-read font (Arial).',
   L('<h1 style="font-family: \'Lobster\';">Quiet Lake</h1>', '<p style="font-family: Arial;">Calm water at sunrise.</p>'),
   [(0, '<h1 style="font-family: \'Lobster\';">Quiet Lake</h2>'), (1, '<p style="font-family: Arial>Calm water at sunrise.</p>'), (1, '<p style="font-family: Arial;">Calm water at sunrise.</p style="font-family: Arial;">')]),
 P('A span with its own font', 'Write a paragraph that says Welcome to Pizza Town. Wrap only the word Pizza in a span that uses the font Pacifico.',
   L('<p>Welcome to <span style="font-family: \'Pacifico\';">Pizza</span> Town.</p>'),
   [(0, '<p>Welcome to <span style="font-family: \'Pacifico\';">Pizza</p></span> Town.'), (0, '<p style="font-family: \'Pacifico\';">Welcome to Pizza Town.</p>'), (0, '<p>Welcome to <span style="font-famly: \'Pacifico\';">Pizza</span> Town.</p>')]),
 P('A head with a Google font and a page', 'Build a full page titled Pizza Menu. In the head, load the Google font Pacifico. In the body, the heading Pizza Menu uses Pacifico.',
   L('<!DOCTYPE html>', '<html>', '<head>', '<title>Pizza Menu</title>', FONT('Pacifico'), '</head>', '<body>', '<h1 style="font-family: \'Pacifico\';">Pizza Menu</h1>', '</body>', '</html>'),
   [(4, FONT('Pacifico').replace('Pacifico', 'Pacifco')), (7, '<h1 style="font-family: Pacifico">Pizza Menu</h1'), (5, '</head')]),
 P('Load two Google fonts', 'Build a full page titled Fonts. In the head, load the Google font Lobster and then the Google font Roboto with two link lines. The heading Two Fonts uses Lobster, and the paragraph Easy to read. uses Roboto.',
   L('<!DOCTYPE html>', '<html>', '<head>', '<title>Fonts</title>', FONT('Lobster'), FONT('Roboto'), '</head>', '<body>', '<h1 style="font-family: \'Lobster\';">Two Fonts</h1>', '<p style="font-family: \'Roboto\';">Easy to read.</p>', '</body>', '</html>'),
   [(4, FONT('Lobster')[:-1] + '</link>'), (8, '<h1 style="font-family: \'Lobster\'">Two Fonts<h1>'), (9, '<p style="font-family: \'Rboto\';">Easy to read.</p>')]),
]
T35 = [
 L('<h1 style="font-family: \'Georgia\';">Old Book</h1>', '<p>Classic pages.</p>'),
 L('<p style="font-family: monospace;">code looks like this</p>', '<p style="font-family: Arial, sans-serif;">text looks like this</p>'),
 L('<body style="font-family: \'Verdana\';">', '<h1>Inherited font</h1>', '<p>Also Verdana.</p>', '</body>'),
 L('<h1 style="font-family: \'Pacifico\'; color: hotpink;">Sweet Shop</h1>', '<p>Open late.</p>'),
 L('<body style="font-family: Arial;">', '<h1 style="font-family: \'Lobster\';">Big Title</h1>', '<p>Body text stays Arial.</p>', '</body>'),
 L('<html>', '<head>', '<title>Fonts</title>', '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">', '</head>', '<body>', '<h1 style="font-family: \'Pacifico\';">Hello</h1>', '</body>', '</html>'),
 L('<p>The word <span style="font-family: \'Pacifico\';">fancy</span> looks fancy.</p>', '<p style="font-family: monospace;">This line is typed.</p>'),
 L('<body style="font-family: \'Roboto\'; color: navy;">', '<h1 style="text-transform: uppercase;">tech news</h1>', '<p>Read <span style="font-family: \'Lobster\'; color: red;">all</span> about it.</p>', '</body>'),
 L('<!DOCTYPE html>', '<html>', '<head>', '<title>Font Test</title>', '<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">', '</head>', '<body>', '<h1 style="font-family: \'Lobster\';">Font Test</h1>', '<p>Plain paragraph.</p>', '</body>', '</html>'),
 L('<!DOCTYPE html>', '<html>', '<head>', '<title>Two Fonts</title>', '<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">', '</head>', '<body style="font-family: Arial, sans-serif; color: teal;">', '<h1 style="font-family: \'Pacifico\'; color: coral;">Two Fonts</h1>', '<h2>Body font</h2>', '<p>This paragraph is Arial and teal.</p>', '</body>', '</html>'),
]
