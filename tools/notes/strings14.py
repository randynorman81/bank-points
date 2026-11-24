"""Unit 14: Strings. String methods, looping through strings, and splitting / joining / formatting text."""
from lib import *

U = Unit("unit-14", "Unit 14: Strings", 14, [
    ("string-methods.html", "14.1 String Methods"),
    ("string-traversal.html", "14.2 Looping Through Strings"),
    ("split-join-format.html", "14.3 Split, Join, Format"),
], {
    "string-methods.html": "String Methods (14.1)",
    "string-traversal.html": "Looping Through Strings (14.2)",
    "split-join-format.html": "Splitting, Joining, and Formatting Text (14.3)",
}, {"string-methods.html": "a214", "string-traversal.html": "a215", "split-join-format.html": "a216"})


def qc(code):
    return '<div class="qc">%s</div>' % esc(code)


# ==========================================================================================  14.1 METHODS
def string_methods():
    lab = widget("wgstr", "Try it: the string lab",
                 "Type some text, pick a method, and see exactly what Python would give back.",
                 '<div class="row"><input type="text" value="  Hello, Social Circle!  " style="width:30ch" spellcheck="false"> <select></select></div><div class="out"></div>',
                 r"""
var inp=root.querySelector("input"),sel=root.querySelector("select"),out=root.querySelector(".out");
var M=[["len(text)",function(t){return t.length}],["text.upper()",function(t){return t.toUpperCase()}],["text.lower()",function(t){return t.toLowerCase()}],["text.title()",function(t){return t.toLowerCase().replace(/(^|[^a-z])([a-z])/g,function(m,a,b){return a+b.toUpperCase()})}],["text.strip()",function(t){return t.trim()}],['text.replace("l", "L")',function(t){return t.split("l").join("L")}],['text.count("l")',function(t){return t.split("l").length-1}],['text.find("Social")',function(t){return t.indexOf("Social")}],['text.find("xyz")',function(t){return t.indexOf("xyz")}],['text.strip().startswith("Hello")',function(t){return t.trim().indexOf("Hello")===0}],['text.strip().endswith("!")',function(t){return t.trim().slice(-1)==="!"}],["text.isdigit()",function(t){return /^[0-9]+$/.test(t)}],["text.isalpha()",function(t){return /^[A-Za-z]+$/.test(t)}]];
sel.innerHTML=M.map(function(m,i){return'<option value="'+i+'">'+m[0].replace(/</g,"&lt;")+'</option>'}).join("");
function show(v){if(typeof v==="boolean")return v?"True":"False";if(typeof v==="number")return String(v);return'"'+String(v).replace(/ /g,"&middot;")+'"'}
function upd(){var t=inp.value,m=M[Number(sel.value)];out.innerHTML='<span class="mono">'+m[0].replace(/</g,"&lt;")+'</span> gives <b>'+show(m[1](t))+'</b><div class="note">Spaces are shown as &middot;. The original <code>text</code> is <b>not changed</b>: a string method returns a <b>new</b> value.</div>'}
inp.addEventListener("input",upd);sel.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "A String Is a Sequence of Characters",
             "A string is text in quotes. Every character has a <b>position</b> (an index) that starts at <b>0</b>. You already know how to index, slice, and join strings from Unit 3. This unit adds the <b>methods</b> that do the real work.",
             tbl(["Idea", "Code", "Result"], [
                 ["length", "<code>len(\"robot\")</code>", "5"],
                 ["one character", "<code>\"robot\"[0]</code>", "<code>\"r\"</code>"],
                 ["a slice", "<code>\"robot\"[1:3]</code>", "<code>\"ob\"</code>"],
                 ["is it inside?", "<code>\"bo\" in \"robot\"</code>", "True"],
             ]),
             warn("<b>Strings cannot be changed in place.</b> <code>word[0] = \"R\"</code> is an error. A method gives you a <b>new</b> string, and you must <b>store it</b>: <code>word = word.upper()</code>.")),
        part(1, "String Methods",
             "A <b>method</b> is a function that belongs to a string. You call it with a dot after the string.",
             tbl(["Method", "What it gives back", "Example"], [
                 ["<code>upper()</code> / <code>lower()</code>", "all capitals / all lowercase", "<code>\"Hi\".upper()</code> is <code>\"HI\"</code>"],
                 ["<code>strip()</code>", "the text with spaces removed from both ends", "<code>\"  hi \".strip()</code> is <code>\"hi\"</code>"],
                 ["<code>replace(old, new)</code>", "every <code>old</code> swapped for <code>new</code>", "<code>\"banana\".replace(\"a\", \"o\")</code> is <code>\"bonono\"</code>"],
                 ["<code>count(sub)</code>", "how many times <code>sub</code> appears", "<code>\"banana\".count(\"a\")</code> is 3"],
                 ["<code>find(sub)</code>", "the index where <code>sub</code> first appears, or <b>-1</b>", "<code>\"banana\".find(\"n\")</code> is 2"],
                 ["<code>startswith(x)</code> / <code>endswith(x)</code>", "True or False", "<code>\"image.png\".endswith(\".png\")</code> is True"],
                 ["<code>isdigit()</code> / <code>isalpha()</code>", "True if every character is a digit / a letter", "<code>\"2026\".isdigit()</code> is True"],
             ]),
             lab),
        part(2, "Chaining Methods",
             "Because each method returns a string, you can call another method on the result. Read it <b>left to right</b>.",
             ex("<code>\"  Alice \".strip().lower()</code> &rarr; first <code>strip()</code> gives <code>\"Alice\"</code>, then <code>lower()</code> gives <code>\"alice\"</code>."),
             "<p>Chaining is how you <b>clean</b> text before comparing it: the user might type <code>\" YES\"</code>, <code>\"yes \"</code>, or <code>\"Yes\"</code>, and <code>answer.strip().lower() == \"yes\"</code> treats them all the same.</p>"),
        part(3, "Comparing Strings",
             "Strings are compared <b>character by character</b> using their ASCII (Unicode) numbers from Unit 8.",
             tbl(["Comparison", "Result", "Why"], [
                 ["<code>\"apple\" &lt; \"banana\"</code>", "True", "a (97) comes before b (98)"],
                 ["<code>\"Zebra\" &lt; \"apple\"</code>", "True", "capital Z (90) is smaller than lowercase a (97)"],
                 ["<code>\"cat\" == \"Cat\"</code>", "False", "capitals and lowercase are different characters"],
             ]),
             hint("To compare without caring about capitals, convert both with <code>.lower()</code> first."),
             quiz("qz14a", [
                 ("What does this code display?" + qc('word = "banana"\nprint(word.count("a"))'), ["2", "3", "6", "1"], 1, "<code>\"banana\"</code> has three <code>a</code>s."),
                 ("What does this code display?" + qc('text = "  hello  "\nprint(text.strip().upper())'), ["HELLO", "  HELLO  ", "hello", "Hello"], 0, "<code>strip()</code> removes the spaces, then <code>upper()</code> makes capitals."),
                 ("A student writes <code>name.upper()</code> on a line by itself, but <code>name</code> is still lowercase afterward. Why?", ["upper() is broken", "Strings cannot be changed. upper() returns a new string, which must be stored", "name must be a number", "upper() only works on the first letter"], 1, "Write <code>name = name.upper()</code> to keep the result."),
                 ("What does this code display?" + qc('print("python".find("t"))\nprint("python".find("z"))'), ["2 and -1", "3 and 0", "2 and 0", "-1 and -1"], 0, "<code>find</code> returns the index (counting from 0), or -1 if the text is not there."),
                 ("Which expression is True for the text <code>\"Report.PDF\"</code>, no matter how the capitals are typed?", ['text.endswith(".pdf")', 'text.lower().endswith(".pdf")', 'text.isdigit()', 'text.find("pdf") == -1'], 1, "Convert to lowercase first, then compare."),
             ])),
        exam([
            "Strings are <b>sequences of characters</b>, indexed from 0 (in pseudocode, from 1).",
            "String methods return <b>new strings</b>. The original is not changed.",
            "<code>find</code> returns <b>-1</b> when the text is missing. <code>count</code>, <code>replace</code>, <code>strip</code>, <code>upper</code>, <code>lower</code> are the common ones.",
            "Clean text with <b>chained methods</b> before comparing it.",
        ]),
    ]
    return U.mk("string-methods.html", "string-methods", "String Methods", "WHAT YOU CAN DO WITH TEXT",
                "Text is everywhere in programs: names, messages, search boxes. Learn the <b>methods</b> that change case, trim spaces, count, search, and test text, and why a method never changes the original string.",
                parts, "Methods return new strings. Store them.", "Next: use a loop to go through a string one character at a time.")


# ==========================================================================================  14.2 TRAVERSAL
def string_traversal():
    loop = widget("wgloop", "Try it: watch a loop go through a word",
                  "Type a word, pick a job, and watch what the loop does with each character.",
                  '<div class="row"><input type="text" value="education" style="width:20ch" maxlength="20" spellcheck="false"> <select><option value="vowels">count the vowels</option><option value="reverse">build the word backwards</option><option value="skip">remove the letter e</option><option value="alt">capitalize every other letter</option></select></div><div class="out"></div>',
                  r"""
var inp=root.querySelector("input"),sel=root.querySelector("select"),out=root.querySelector(".out");
function upd(){var t=inp.value.slice(0,20),mode=sel.value,rows=[],acc=mode==="vowels"?0:"";
 for(var i=0;i<t.length;i++){var ch=t[i],note="";
  if(mode==="vowels"){var v="aeiouAEIOU".indexOf(ch)>-1;if(v)acc++;note=v?"vowel, count becomes "+acc:"not a vowel"}
  else if(mode==="reverse"){acc=ch+acc;note='result = "'+ch+'" + result'}
  else if(mode==="skip"){if(ch.toLowerCase()!=="e"){acc+=ch;note="kept"}else note="skipped"}
  else{var c=i%2===0?ch.toUpperCase():ch.toLowerCase();acc+=c;note=(i%2===0?"even":"odd")+" position, so "+c}
  rows.push('<tr><td>'+i+'</td><td><b>'+ch+'</b></td><td style="text-align:left">'+note+'</td><td class="mono">'+(mode==="vowels"?acc:'"'+acc+'"')+'</td></tr>')}
 var code={vowels:'count = 0\nfor ch in word:\n    if ch in "aeiouAEIOU":\n        count = count + 1',reverse:'result = ""\nfor ch in word:\n    result = ch + result',skip:'result = ""\nfor ch in word:\n    if ch != "e":\n        result = result + ch',alt:'result = ""\nfor i in range(len(word)):\n    if i % 2 == 0:\n        result = result + word[i].upper()\n    else:\n        result = result + word[i].lower()'}[mode];
 out.innerHTML='<pre class="mono" style="background:#05070B;border:1px solid #232B38;border-radius:6px;padding:8px 12px;font-size:13px;margin:0 0 8px">'+code+'</pre><table><tr><th>i</th><th>ch</th><th>what the loop does</th><th>so far</th></tr>'+rows.join("")+'</table><div class="note">Final answer: <b>'+(mode==="vowels"?acc:'"'+acc+'"')+'</b></div>'}
inp.addEventListener("input",upd);sel.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "A Loop Over a String",
             "A string is a sequence, so a <code>for</code> loop can visit <b>every character</b>, one at a time, in order. This is the same <b>traversal</b> pattern you used for lists.",
             code("word = \"robot\"\nfor ch in word:\n    print(ch)"),
             "<p>The loop variable <code>ch</code> holds <b>one character</b> on each pass. The loop ends after the last character.</p>"),
        part(1, "Two Ways to Loop",
             "You can loop over the characters directly, or over the <b>positions</b>.",
             tbl(["", "Over the characters", "Over the positions"], [
                 ["<b>Code</b>", "<code>for ch in word:</code>", "<code>for i in range(len(word)):</code>"],
                 ["<b>Gives you</b>", "each character", "each index <code>i</code>; use <code>word[i]</code> for the character"],
                 ["<b>Use it when</b>", "you only need the characters", "you need the <b>position</b> too, or the character <b>before or after</b>"],
             ]),
             loop),
        part(2, "The Accumulator Pattern",
             "Most string jobs follow one recipe: <b>start with an empty result, loop, and add to the result</b>.",
             tbl(["Job", "Start", "Inside the loop"], [
                 ["<b>Count</b> something", "<code>count = 0</code>", "<code>if ch in \"aeiou\": count = count + 1</code>"],
                 ["<b>Copy / filter</b>", "<code>result = \"\"</code>", "<code>if ch != \" \": result = result + ch</code>"],
                 ["<b>Reverse</b>", "<code>result = \"\"</code>", "<code>result = ch + result</code> (new letter goes in <b>front</b>)"],
                 ["<b>Transform</b>", "<code>result = \"\"</code>", "<code>result = result + ch.upper()</code>"],
             ]),
             warn("<code>result + ch</code> and <code>ch + result</code> are different. The first appends to the end. The second puts the new letter at the front, which is how you reverse a word.")),
        part(3, "Using Traversal",
             "Put the pieces together and you can solve real text problems.",
             tbl(["Problem", "Idea"], [
                 ["<b>Palindrome</b> (reads the same backwards)", "build the reversed string, then check <code>word == reversed</code>"],
                 ["<b>Is it a strong password?</b>", "loop and track whether you saw a digit, a capital, and a symbol"],
                 ["<b>Caesar cipher</b> (Unit 8)", "loop over each letter, shift it with <code>ord</code> and <code>chr</code>, add it to the result"],
                 ["<b>Remove spaces / punctuation</b>", "loop and keep only the characters you want"],
             ]),
             quiz("qz14b", [
                 ("What does this code display?" + qc('count = 0\nfor ch in "banana":\n    if ch == "a":\n        count = count + 1\nprint(count)'), ["1", "3", "6", "0"], 1, "The loop checks every letter and counts the <code>a</code>s."),
                 ("What does this code display?" + qc('result = ""\nfor ch in "cat":\n    result = ch + result\nprint(result)'), ["cat", "tac", "act", "ttt"], 1, "Each new letter is put in front, so the word is reversed."),
                 ("Which loop header gives you both each character and its position?", ["for ch in word:", "for i in range(len(word)):", "for i in word:", "while word:"], 1, "Looping over <code>range(len(word))</code> gives the indexes, and <code>word[i]</code> gives the characters."),
                 ("What does this code display?" + qc('result = ""\nfor ch in "a b c":\n    if ch != " ":\n        result = result + ch\nprint(result)'), ["a b c", "abc", "a", "cba"], 1, "The loop keeps every character except spaces."),
                 ("A program should report whether a word reads the same forward and backward. Which approach works?", ["Count the vowels", "Build the reversed word with a loop, then compare it with the original", "Sort the letters", "Use <code>find</code> on the first letter"], 1, "Reverse it, then compare: that is a palindrome check."),
             ])),
        exam([
            "A <code>for</code> loop can <b>traverse a string</b> one character at a time.",
            "Use <code>range(len(s))</code> when you need the <b>index</b>.",
            "Build results with the <b>accumulator pattern</b>: start empty, add inside the loop. Putting the new letter in front <b>reverses</b>.",
            "Trace string loops <b>character by character</b>, keeping track of the result so far.",
        ]),
    ]
    return U.mk("string-traversal.html", "string-traversal", "Looping Through Strings", "ONE CHARACTER AT A TIME",
                "A loop can read a word letter by letter. Learn the two ways to loop over a string and the <b>accumulator pattern</b> that counts, filters, reverses, and transforms text.",
                parts, "Start empty. Loop. Add to the result.", "Next: break text into words, put words back together, and format the output.")


# ==========================================================================================  14.3 SPLIT / JOIN / FORMAT
def split_join_format():
    lab = widget("wgsent", "Try it: the sentence lab",
                 "Type a sentence. See it split into words, measured, and joined back together.",
                 '<div class="row"><input type="text" value="the quick brown fox jumps" style="width:36ch" spellcheck="false"></div><div class="out"></div>',
                 r"""
var inp=root.querySelector("input"),out=root.querySelector(".out");
function upd(){var t=inp.value,words=t.split(/\s+/).filter(Boolean),longest=words.reduce(function(a,b){return b.length>a.length?b:a},"");
 function q(a){return"["+a.map(function(w){return'"'+w+'"'}).join(", ")+"]"}
 out.innerHTML='<table style="text-align:left"><tr><th>Python</th><th>Result</th></tr>'+
 '<tr><td class="mono">words = text.split()</td><td class="mono" style="text-align:left">'+q(words)+'</td></tr>'+
 '<tr><td class="mono">len(words)</td><td style="text-align:left"><b>'+words.length+'</b> words</td></tr>'+
 '<tr><td class="mono">"-".join(words)</td><td class="mono" style="text-align:left">"'+words.join("-")+'"</td></tr>'+
 '<tr><td class="mono">" ".join(reversed order)</td><td class="mono" style="text-align:left">"'+words.slice().reverse().join(" ")+'"</td></tr>'+
 '<tr><td class="mono">longest word</td><td style="text-align:left"><b>'+(longest||"(none)")+'</b> ('+longest.length+' letters)</td></tr>'+
 '<tr><td class="mono">first letters</td><td class="mono" style="text-align:left">"'+words.map(function(w){return w[0]}).join("")+'"</td></tr></table>'}
inp.addEventListener("input",upd);upd();
""")
    fmt = widget("wgfmt", "Try it: format a receipt line",
                 "Change the numbers and see how an f-string lines everything up.",
                 '<div class="row"><label>Item <input type="text" value="Notebook" style="width:12ch"></label> <label>Price <input type="number" value="3.5" step="0.25" style="width:8ch"></label> <label>Quantity <input type="number" value="4" style="width:6ch"></label></div><div class="out"></div>',
                 r"""
var ins=root.querySelectorAll("input"),out=root.querySelector(".out");
function pad(s,n,right){s=String(s);while(s.length<n)s=right?" "+s:s+" ";return s}
function upd(){var name=ins[0].value||"item",price=Number(ins[1].value)||0,q=Math.floor(Number(ins[2].value))||0,total=price*q;
 var line=pad(name,12)+pad(price.toFixed(2),8,true)+pad("x"+q,5,true)+pad(total.toFixed(2),9,true);
 out.innerHTML='<pre class="mono" style="background:#05070B;border:1px solid #232B38;border-radius:6px;padding:10px 14px;margin:0;font-size:14px">f"{item:&lt;12}{price:&gt;8.2f}{\'x\'+str(qty):&gt;5}{total:&gt;9.2f}"\n'+line.replace(/ /g,"&nbsp;").replace(/\n/g,"")+'</pre><div class="note"><code>{price:>8.2f}</code> means: right-align in 8 spaces, with 2 decimal places. <code>&lt;</code> left-aligns. <code>,</code> adds thousands commas.</div>'.replace(/&nbsp;/g," ")}
root.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "Split: Text Into a List",
             "<code>split()</code> breaks a string into a <b>list of words</b>. With no argument it splits on spaces. With an argument it splits on that text, which is perfect for data separated by commas.",
             tbl(["Code", "Result"], [
                 ["<code>\"the quick fox\".split()</code>", "<code>[\"the\", \"quick\", \"fox\"]</code>"],
                 ["<code>\"Ana,16,GA\".split(\",\")</code>", "<code>[\"Ana\", \"16\", \"GA\"]</code>"],
                 ["<code>len(\"the quick fox\".split())</code>", "<b>3</b> (a word count)"],
             ]),
             "<p>After splitting you have a normal <b>list</b>, so everything from Unit 7 works: indexing, loops, <code>len</code>, <code>append</code>.</p>",
             warn("Everything that comes out of <code>split</code> is still <b>text</b>. <code>\"16\"</code> is not the number 16. Use <code>int(parts[1])</code> before doing math.")),
        part(1, "Join: A List Into Text",
             "<code>join</code> is the opposite. It glues a list of strings together with a <b>separator</b> you choose. The separator comes <b>first</b>.",
             code("words = [\"red\", \"green\", \"blue\"]\nprint(\"-\".join(words))     # red-green-blue\nprint(\", \".join(words))    # red, green, blue\nprint(\"\".join(words))      # redgreenblue"),
             lab),
        part(2, "Formatting Output",
             "An <b>f-string</b> (a string with an <code>f</code> in front) puts values straight into text. Add a <b>format code</b> after a colon to control how it looks.",
             tbl(["Format", "Meaning", "Example"], [
                 ["<code>{x}</code>", "insert the value", "<code>f\"Score: {x}\"</code>"],
                 ["<code>{x:.2f}</code>", "2 decimal places", "3.14159 becomes <code>3.14</code>"],
                 ["<code>{x:&gt;8}</code>", "right-align in 8 spaces", "good for columns of numbers"],
                 ["<code>{x:&lt;12}</code>", "left-align in 12 spaces", "good for names"],
                 ["<code>{x:,}</code>", "thousands commas", "1234567 becomes <code>1,234,567</code>"],
             ]),
             fmt),
        part(3, "Text Processing Recipes",
             "Splitting and joining solve many real problems.",
             tbl(["Problem", "Recipe"], [
                 ["<b>Count the words</b>", "<code>len(text.split())</code>"],
                 ["<b>Capitalize every word</b>", "split, loop and capitalize each word into a new list, then join with spaces"],
                 ["<b>Initials</b>", "split, take <code>word[0]</code> from each, join with <code>\"\"</code>"],
                 ["<b>Read a CSV line</b>", "<code>fields = line.split(\",\")</code>, then use <code>int()</code> on number fields"],
                 ["<b>Remove punctuation</b>", "<code>text.replace(\",\", \"\").replace(\".\", \"\")</code>"],
             ]),
             quiz("qz14c", [
                 ("What does this code display?" + qc('line = "red,green,blue"\nparts = line.split(",")\nprint(len(parts))\nprint(parts[1])'), ["3 and green", "2 and green", "3 and red", "1 and red,green,blue"], 0, "Splitting on commas gives a 3-item list. Index 1 is the second item."),
                 ("What does this code display?" + qc('words = ["a", "b", "c"]\nprint("+".join(words))'), ["a+b+c", "abc", "a b c", "+a+b+c"], 0, "<code>join</code> puts the separator <b>between</b> the items."),
                 ("A program reads <code>\"Ana,16\"</code> and splits it. The student writes <code>parts[1] + 1</code> and gets an error. Why?", ["split cannot make a list", "parts[1] is the text \"16\", not a number", "The index should be 2", "join must be used first"], 1, "Split gives <b>strings</b>. Convert with <code>int(parts[1])</code>."),
                 ("What does this code display?" + qc('x = 3.14159\nprint(f"{x:.2f}")'), ["3.14159", "3.14", "3.1", "3"], 1, "<code>.2f</code> keeps two decimal places."),
                 ("Which expression gives the number of words in <code>text</code>?", ["len(text)", "len(text.split())", "text.count(\" \")", "text.find(\" \")"], 1, "Split into words, then count the list items."),
             ])),
        exam([
            "<code>split()</code> turns text into a <b>list of strings</b>. <code>join()</code> turns a list of strings into text, with the <b>separator first</b>.",
            "Split items are still <b>strings</b>. Convert numbers with <code>int()</code> or <code>float()</code>.",
            "<b>f-strings</b> insert values and format them (<code>.2f</code>, alignment, commas).",
            "Text processing combines <b>split, loops, methods, and join</b>.",
        ]),
    ]
    return U.mk("split-join-format.html", "split-join-format", "Splitting, Joining, and Formatting Text", "FROM LINES OF TEXT TO USEFUL DATA",
                "Real text arrives as long lines. Learn to <b>split</b> it into words or fields, <b>join</b> pieces back together, and <b>format</b> output so numbers line up neatly.",
                parts, "Split it, work on the list, join it back.", "That is the end of Strings. Use the walkthroughs to practice each idea in Python.")


PAGES = {"string-methods": string_methods, "string-traversal": string_traversal, "split-join-format": split_join_format}
INDEXES = {"unit-14": lambda: U.index('<p>Text is the most common kind of data in programs. This unit goes deeper than Unit 3: the string <b>methods</b>, <b>looping</b> through text, and <b>splitting, joining, and formatting</b>. These also power text-processing questions on the exam.</p>'
                                       '<p style="font-size:14px;opacity:.8">Read the notes, try the activities, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>.</p>')}
