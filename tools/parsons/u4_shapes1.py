# Unit 4 program shapes, lessons 4.1-4.6. Each shape: title, story, solution lines, distractors [(index of the line it spoils, text)], keys, pool of 4 rows
# (rows 0-1 become Parsons problems, rows 2-3 become code-tracing problems), typed inputs. {name} placeholders are filled from the row.
SH = {}
def L(*lines): return '\n'.join(lines)
def S(title, story, sol, dis, keys, pool, ins=None, rnd=False, tr=None):
    return dict(title=title, story=story, sol=sol, dis=dis, keys=keys.split(), pool=pool, ins=ins or [], rnd=rnd, tr=tr)

# ---------------------------------------------------------------- 4.1 Booleans (Instagram)
SH['u4l1'] = [
 S('Can {name} add a link?', 'Store {name}\'s follower count ({f}) in followers, and the limit for a link in the bio ({l}) in limit. Store in can_link whether followers is at least limit (greater than or equal). Print the label Link in bio: followed by can_link.',
   L('followers = {f}', 'limit = {l}', 'can_link = followers >= limit', 'print("Link in bio:", can_link)'),
   [(2, 'can_link = followers => limit'), (3, 'print("Link in bio:" can_link)'), (1, 'limit = "{l}"')],
   'name f l', [('Ava', '1200', '1000'), ('Ben', '850', '1000'), ('Cam', '5000', '10000'), ('Dee', '10000', '10000')]),
 S('Show posts when is_private is {p}', 'Store {p} in is_private. Store in show_posts the opposite of is_private (use not). Print the label Posts visible: followed by show_posts.',
   L('is_private = {p}', 'show_posts = not is_private', 'print("Posts visible:", show_posts)'),
   [(1, 'show_posts = is_private not'), (2, 'print("Posts visible:", is_private)'), (1, 'show_posts = !is_private')],
   'p', [('True',), ('False',), ('True',), ('False',)]),
 S('Did {name} reach the goal?', 'Store {name}\'s likes ({a}) in likes and the goal ({b}) in goal. Store in reached whether likes is EQUAL to goal (two equals signs). Print the label Reached: followed by reached.',
   L('likes = {a}', 'goal = {b}', 'reached = likes == goal', 'print("Reached:", reached)'),
   [(2, 'reached = likes = goal'), (3, 'print("Reached", reached)'), (2, 'reached = likes != goal')],
   'name a b', [('Eli', '500', '500'), ('Fay', '480', '500'), ('Gus', '1000', '999'), ('Hal', '250', '250')]),
 S('Flip is_online (starts {a})', 'Store {a} in is_online. Then flip it to the opposite value with not and store the new value back in is_online. Print the label Online now: followed by is_online.',
   L('is_online = {a}', 'is_online = not is_online', 'print("Online now:", is_online)'),
   [(1, 'is_online = not is_online ='), (2, 'print("Online now:" is_online)'), (1, 'is_online == not is_online')],
   'a', [('True',), ('False',), ('True',), ('False',)]),
 S('Two checks for {name}', 'Store followers ({f}) and following ({g}). Store in more whether followers is greater than following. Store in big whether followers is at least {t}. Print Has more followers: followed by more, then Big account: followed by big.',
   L('followers = {f}', 'following = {g}', 'more = followers > following', 'big = followers >= {t}', 'print("Has more followers:", more)', 'print("Big account:", big)'),
   [(2, 'more = followers < following'), (3, 'big = followers => {t}'), (5, 'print("Big account:", more)')],
   'name f g t', [('Ivy', '900', '300', '1000'), ('Jon', '2500', '3000', '2000'), ('Kit', '400', '400', '500'), ('Lia', '12000', '800', '10000')]),
]

# ---------------------------------------------------------------- 4.2 Logical operators (Disney+)
SH['u4l2'] = [
 S('Can the {who} watch?', 'The plan is active: {a}. The profile is a kid profile: {b}. Store them in plan_active and is_kid. Store in can_watch whether the plan is active AND the profile is NOT a kid profile. Print the label Can watch: followed by can_watch.',
   L('plan_active = {a}', 'is_kid = {b}', 'can_watch = plan_active and not is_kid', 'print("Can watch:", can_watch)'),
   [(2, 'can_watch = plan_active and is_kid or'), (3, 'print("Can watch", can_watch)'), (2, 'can_watch = plan_active andnot is_kid')],
   'who a b', [('parent', 'True', 'False'), ('child', 'True', 'True'), ('guest', 'False', 'False'), ('teen', 'True', 'False')]),
 S('Discount for age {a}', 'Store the age ({a}) in age and whether the viewer is a student ({s}) in is_student. Store in discount whether age is less than 13 OR the viewer is a student. Print the label Discount: followed by discount.',
   L('age = {a}', 'is_student = {s}', 'discount = age < 13 or is_student', 'print("Discount:", discount)'),
   [(2, 'discount = age < 13 and is_student'), (3, 'print("Discount:" discount)'), (2, 'discount = age < 13 or')],
   'a s', [('10', 'False'), ('30', 'True'), ('30', 'False'), ('65', 'True')]),
 S('Teen check for age {a}', 'Store the age ({a}) in age. Store in teen whether age is at least 13 AND at most 19. Print the label Teen profile: followed by teen.',
   L('age = {a}', 'teen = age >= 13 and age <= 19', 'print("Teen profile:", teen)'),
   [(1, 'teen = age >= 13 or age <= 19'), (1, 'teen = age >= 13 and <= 19'), (2, 'print("Teen profile:", age)')],
   'a', [('12',), ('25',), ('15',), ('19',)]),
 S('Blocked when neither is true ({a}, {b})', 'Store is_member ({a}) and has_code ({b}). Store in blocked the opposite of (is_member OR has_code): use not with brackets around the or. Print the label Blocked: followed by blocked.',
   L('is_member = {a}', 'has_code = {b}', 'blocked = not (is_member or has_code)', 'print("Blocked:", blocked)'),
   [(2, 'blocked = is_member or has_code'), (2, 'blocked = not (is_member or has_code'), (3, 'print("Blocked:", is_member)')],
   'a b', [('False', 'False'), ('True', 'False'), ('False', 'True'), ('True', 'True')]),
 S('Is the show allowed ({a}, rated {r})?', 'Store plan_ok ({a}) and the show\'s minimum age ({r}) in min_age. Store in age_ok whether 13 is at least min_age. Store in allowed whether plan_ok AND age_ok. Print the label Allowed: followed by allowed.',
   L('plan_ok = {a}', 'min_age = {r}', 'age_ok = 13 >= min_age', 'allowed = plan_ok and age_ok', 'print("Allowed:", allowed)'),
   [(2, 'age_ok = 13 =< min_age'), (3, 'allowed = plan_ok and'), (4, 'print("Allowed:", not allowed)')],
   'a r', [('True', '16'), ('True', '7'), ('False', '7'), ('False', '16')]),
]

# ---------------------------------------------------------------- 4.3 Comparison operators (Wordle)
SH['u4l3'] = [
 S('Check the guess {g}', 'Store the guess ({g}) in guess and the secret word ({s}) in secret. Print the label Correct: followed by whether guess is EQUAL to secret.',
   L('guess = "{g}"', 'secret = "{s}"', 'print("Correct:", guess == secret)'),
   [(2, 'print("Correct:", guess = secret)'), (2, 'print("Correct:", guess != secret)'), (1, 'secret = {s}')],
   'g s', [('crane', 'crane'), ('slate', 'crane'), ('CRANE', 'crane'), ('crane', 'crate')]),
 S('Tries left after {t}', 'Store the tries used ({t}) in tries and the limit (6) in limit. Store in left the limit minus the tries. Print Tries left: followed by left, then Out of tries: followed by whether tries is at least limit.',
   L('tries = {t}', 'limit = 6', 'left = limit - tries', 'print("Tries left:", left)', 'print("Out of tries:", tries >= limit)'),
   [(2, 'left = tries - limit'), (4, 'print("Out of tries:", tries < limit)'), (3, 'print("Tries left", left)')],
   't', [('2',), ('5',), ('6',), ('3',)]),
 S('Streak badge for {s} days', 'Store the streak ({s}) in streak. A badge needs at least 7 days. Print Badge: followed by whether streak is at least 7, then Over a week: followed by whether streak is greater than 7.',
   L('streak = {s}', 'print("Badge:", streak >= 7)', 'print("Over a week:", streak > 7)'),
   [(1, 'print("Badge:", streak < 7)'), (2, 'print("Over a week:", streak => 7)'), (1, 'print("Badge:" streak >= 7)')],
   's', [('7',), ('6',), ('10',), ('8',)]),
 S('Even or odd stars: {n}', 'Store the stars ({n}) in stars. Store in is_even whether the REMAINDER of stars divided by 2 equals 0. Print Even stars: followed by is_even, then Multiple of 5: followed by whether the remainder of stars divided by 5 equals 0.',
   L('stars = {n}', 'is_even = stars % 2 == 0', 'print("Even stars:", is_even)', 'print("Multiple of 5:", stars % 5 == 0)'),
   [(1, 'is_even = stars % 2 = 0'), (1, 'is_even = stars % 2 == 1'), (3, 'print("Multiple of 5:", stars % 5)')],
   'n', [('8',), ('15',), ('10',), ('7',)]),
 S('Length and first letter of {w}', 'Store the word ({w}) in word. Print Five letters: followed by whether the LENGTH of word equals 5, then Starts with c: followed by whether the first character of word equals c.',
   L('word = "{w}"', 'print("Five letters:", len(word) == 5)', 'print("Starts with c:", word[0] == "c")'),
   [(1, 'print("Five letters:", len(word))'), (2, 'print("Starts with c:", word[1] == "c")'), (1, 'print("Five letters:", len(word) = 5)')],
   'w', [('crane',), ('cat',), ('slate',), ('candy',)]),
]

# ---------------------------------------------------------------- 4.4 If statements (Peloton)
SH['u4l4'] = [
 S('Alert at heart rate {h}', 'Store the heart rate ({h}) in heart_rate. If heart_rate is over 170, print Slow down (indented under the if). After the if, always print Ride saved.',
   L('heart_rate = {h}', 'if heart_rate > 170:', '    print("Slow down")', 'print("Ride saved")'),
   [(1, 'if heart_rate > 170'), (2, 'print("Slow down")'), (1, 'if heart_rate = 170:')],
   'h', [('180',), ('150',), ('171',), ('120',)]),
 S('Two alerts at heart rate {h}', 'Store the heart rate ({h}) in heart_rate. If heart_rate is over 170, print Slow down and then print Drink water, both indented under the same if. After the if, always print Ride saved.',
   L('heart_rate = {h}', 'if heart_rate > 170:', '    print("Slow down")', '    print("Drink water")', 'print("Ride saved")'),
   [(1, 'if heart_rate > 170'), (3, '  print("Drink water")'), (2, '  print("Slow down")')],
   'h', [('175',), ('90',), ('171',), ('170',)]),
 S('Separate ifs at cadence {c}', 'Store the cadence ({c}) in cadence. Write one if that prints Fast pedaling when cadence is over 80. Then write a SEPARATE if that prints Good pedaling when cadence is over 60.',
   L('cadence = {c}', 'if cadence > 80:', '    print("Fast pedaling")', 'if cadence > 60:', '    print("Good pedaling")'),
   [(3, 'if cadence > 60'), (4, 'print("Good pedaling")'), (1, 'if cadence > 80')],
   'c', [('85',), ('70',), ('65',), ('81',)]),
 S('Peak interval at {h} and {c}', 'Store heart_rate ({h}) and cadence ({c}). If heart_rate is over 100, then check INSIDE that if whether cadence is over 80, and print Peak interval only when both are true. Afterwards, always print Ride saved.',
   L('heart_rate = {h}', 'cadence = {c}', 'if heart_rate > 100:', '    if cadence > 80:', '        print("Peak interval")', 'print("Ride saved")'),
   [(3, '    if cadence > 80'), (4, '    print("Peak interval")'), (2, 'if heart_rate > 100')],
   'h c', [('150', '90'), ('150', '60'), ('80', '95'), ('101', '81')]),
 S('Points after a {h} ride', 'Store the points ({p}) in points and the heart rate ({h}) in heart_rate. If heart_rate is at least 160, add 10 to points (inside the if). After the if, print Points: followed by points.',
   L('points = {p}', 'heart_rate = {h}', 'if heart_rate >= 160:', '    points = points + 10', 'print("Points:", points)'),
   [(3, 'points = points + 10'), (2, 'if heart_rate >= 160'), (4, 'print("Points", points)')],
   'p h', [('40', '165'), ('40', '120'), ('0', '160'), ('25', '159')]),
]

# ---------------------------------------------------------------- 4.5 if / elif / else (Starbucks)
SH['u4l5'] = [
 S('Free drink check for {s} stars', 'Store the stars ({s}) in stars. If stars is at least 50, print Free drink earned. Otherwise (else) print Keep collecting.',
   L('stars = {s}', 'if stars >= 50:', '    print("Free drink earned")', 'else:', '    print("Keep collecting")'),
   [(1, 'if stars >= 50'), (3, 'else'), (4, 'print("Keep collecting")')],
   's', [('60',), ('20',), ('50',), ('49',)]),
 S('Tier for {s} stars', 'Store the stars ({s}) in stars. Use ONE chain: if stars is at least 300 the tier is Gold, elif stars is at least 100 the tier is Green, else the tier is Welcome. Print Tier: followed by tier.',
   L('stars = {s}', 'if stars >= 300:', '    tier = "Gold"', 'elif stars >= 100:', '    tier = "Green"', 'else:', '    tier = "Welcome"', 'print("Tier:", tier)'),
   [(3, 'elif stars >= 100'), (5, 'else'), (7, 'print("Tier", tier)')],
   's', [('350',), ('150',), ('40',), ('100',)]),
 S('Bonus stars for {p} purchases', 'Store the purchases ({p}) in purchases. Use ONE chain: if purchases is at least 10 the bonus is 20, elif purchases is at least 5 the bonus is 10, else the bonus is 0. Print Bonus stars: followed by bonus.',
   L('purchases = {p}', 'if purchases >= 10:', '    bonus = 20', 'elif purchases >= 5:', '    bonus = 10', 'else:', '    bonus = 0', 'print("Bonus stars:", bonus)'),
   [(3, 'elif purchases >= 5'), (5, 'else'), (7, 'print("Bonus stars", bonus)')],
   'p', [('12',), ('7',), ('2',), ('5',)]),
 S('Two promos at {s} stars', 'Store the stars ({s}) in stars. Write one if that prints Promo A when stars is over 50. Then write a SEPARATE if that prints Promo B when stars is over 20. (They are not a chain, so both can print.)',
   L('stars = {s}', 'if stars > 50:', '    print("Promo A")', 'if stars > 20:', '    print("Promo B")'),
   [(3, 'if stars > 20'), (4, 'print("Promo B")'), (1, 'if stars > 50')],
   's', [('60',), ('30',), ('25',), ('51',)]),
 S('Price of a {c}', 'Store the cup size ({c}) in cup. Use ONE chain: if cup equals short the price is 2, elif cup equals tall the price is 3, else the price is 4. Print Price: followed by price.',
   L('cup = "{c}"', 'if cup == "short":', '    price = 2', 'elif cup == "tall":', '    price = 3', 'else:', '    price = 4', 'print("Price:", price)'),
   [(1, 'if cup = "short":'), (3, 'elif cup == "tall"'), (7, 'print("Price", price)')],
   'c', [('short',), ('tall',), ('grande',), ('venti',)]),
]

# ---------------------------------------------------------------- 4.6 Key events (Fortnite)
SH['u4l6'] = [
 S('Handle the {k} key', 'Write a function named control with one parameter, key. If key equals d, print Move right. Otherwise (else) print Unknown key. Then call control with the key {k}.',
   L('def control(key):', '    if key == "d":', '        print("Move right")', '    else:', '        print("Unknown key")', 'control("{k}")'),
   [(0, 'def control(key)'), (3, '    else'), (5, 'control({k})')],
   'k', [('d',), ('z',), ('D',), ('d',)]),
 S('Left or right for {k}', 'Write a function named control with one parameter, key. If key equals a, print Move left. Elif key equals d, print Move right. Else print Unknown key. Then call control with the key {k}.',
   L('def control(key):', '    if key == "a":', '        print("Move left")', '    elif key == "d":', '        print("Move right")', '    else:', '        print("Unknown key")', 'control("{k}")'),
   [(1, '    if key = "a":'), (3, '    elif key == "d"'), (7, 'control("{k}"')],
   'k', [('a',), ('d',), ('s',), ('A',)]),
 S('Move from x = {x}', 'Store {x} in x. Write a function named control with one parameter, key. Inside it, use global x so the change lasts, and if key equals d add 15 to x. Call control with the key {k}, then print X: followed by x.',
   L('x = {x}', 'def control(key):', '    global x', '    if key == "d":', '        x = x + 15', 'control("{k}")', 'print("X:", x)'),
   [(2, '    global'), (3, '    if key == "d"'), (4, '        x = x + 50')],
   'x k', [('100', 'd'), ('40', 'd'), ('100', 'a'), ('60', 'z')]),
 S('Health after {a} and {b}', 'Store {h} in health. Write a function named control with one parameter, key. Inside it, use global health, and if key equals h take 25 away from health. Call control with {a}, then call it with {b}. Print Health: followed by health.',
   L('health = {h}', 'def control(key):', '    global health', '    if key == "h":', '        health = health - 25', 'control("{a}")', 'control("{b}")', 'print("Health:", health)'),
   [(2, '    global health ='), (4, '        health = health + 25'), (3, '    if key = "h":')],
   'h a b', [('100', 'h', 'h'), ('100', 'h', 'z'), ('50', 'z', 'z'), ('75', 'h', 'h')]),
 S('Caps lock safe: {k}', 'Write a function named build with one parameter, key. If key.lower() equals q, print Build mode ready. Otherwise print Unknown key. Call build with the key {k}.',
   L('def build(key):', '    if key.lower() == "q":', '        print("Build mode ready")', '    else:', '        print("Unknown key")', 'build("{k}")'),
   [(1, '    if key.lower = "q":'), (1, '    if key.lower() == q:'), (4, '        print("Unknown key"')],
   'k', [('Q',), ('q',), ('z',), ('Z',)]),
]
