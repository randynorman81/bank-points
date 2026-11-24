"""Unit 12: Data (AP Big Idea 2: extracting information from data, big data, cleaning, processing, visualizing, bias in data).
Six notes pages, written in the same style as the other notes (see lib.py)."""
from lib import *

UNIT_DIR = "unit-12"
UNIT_LABEL = "Unit 12: Data"
PAGES_LIST = [
    ("extracting-information.html", "12.1 Information"),
    ("big-data-metadata.html", "12.2 Big Data"),
    ("cleaning-data.html", "12.3 Cleaning"),
    ("filter-transform-data.html", "12.4 Processing"),
    ("visualizing-data.html", "12.5 Visualizing"),
    ("data-bias-sampling.html", "12.6 Bias in Data"),
]
TITLES = {
    "extracting-information.html": "Extracting Information from Data (12.1)",
    "big-data-metadata.html": "Big Data, Metadata, and Scale (12.2)",
    "cleaning-data.html": "Cleaning Data (12.3)",
    "filter-transform-data.html": "Filtering, Transforming, and Combining Data (12.4)",
    "visualizing-data.html": "Visualizing Data (12.5)",
    "data-bias-sampling.html": "Bias, Sampling, and Trust in Data (12.6)",
}
SLOT = {"extracting-information.html": "a202", "big-data-metadata.html": "a203", "cleaning-data.html": "a204",
        "filter-transform-data.html": "a205", "visualizing-data.html": "a206", "data-bias-sampling.html": "a207"}


def mk(f, slug, title, subject, deck, parts, fh, fp):
    names = [p[0] for p in PAGES_LIST]
    i = names.index(f)
    prev = (names[i - 1], TITLES[names[i - 1]]) if i > 0 else None
    nxt = (names[i + 1], TITLES[names[i + 1]]) if i < len(names) - 1 else None
    return page(slug, title, subject, deck, UNIT_DIR, UNIT_LABEL, PAGES_LIST, "".join(parts), fh, fp, prev, nxt, walk=SLOT[f], concept=TITLES[f])


# ==========================================================================================  12.1 EXTRACTING INFORMATION
def extracting_information():
    corr = widget("wgcorr", "Try it: do these two things move together?",
                  "Twelve months of made-up data for one town. Pick any two columns and see the pattern and the correlation number.",
                  '<div class="row"><label>X: <select class="x"></select></label> <label>Y: <select class="y"></select></label></div><svg viewBox="0 0 400 250" style="width:100%;max-width:400px;display:block;margin:6px 0;background:#0B0F16;border:1px solid #232B38;border-radius:8px"></svg><div class="out"></div>',
                  r"""
var D={"Temperature (F)":[35,38,48,58,68,78,85,83,74,60,47,38],"Ice cream sales":[120,135,190,240,310,380,430,415,350,260,170,130],"Sunburns treated":[2,3,6,10,16,24,30,28,20,11,5,3],"Pool visits":[10,12,25,60,130,260,340,320,200,70,20,12],"Library visits":[210,190,205,220,200,185,180,215,225,200,195,205]};
var names=Object.keys(D),sx=root.querySelector(".x"),sy=root.querySelector(".y"),svg=root.querySelector("svg"),out=root.querySelector(".out");
sx.innerHTML=names.map(function(n){return"<option>"+n+"</option>"}).join("");sy.innerHTML=sx.innerHTML;sx.value="Ice cream sales";sy.value="Sunburns treated";
function r(a,b){var n=a.length,ma=a.reduce(function(p,c){return p+c},0)/n,mb=b.reduce(function(p,c){return p+c},0)/n,sab=0,saa=0,sbb=0;for(var i=0;i<n;i++){sab+=(a[i]-ma)*(b[i]-mb);saa+=Math.pow(a[i]-ma,2);sbb+=Math.pow(b[i]-mb,2)}return sab/Math.sqrt(saa*sbb)}
function upd(){var a=D[sx.value],b=D[sy.value],mx=Math.max.apply(null,a),my=Math.max.apply(null,b),mnx=Math.min.apply(null,a),mny=Math.min.apply(null,b),s='<line x1="40" y1="215" x2="385" y2="215" stroke="#3A4658"/><line x1="40" y1="15" x2="40" y2="215" stroke="#3A4658"/>';
 a.forEach(function(v,i){var px=40+(v-mnx)/(mx-mnx||1)*335,py=215-(b[i]-mny)/(my-mny||1)*190;s+='<circle cx="'+px+'" cy="'+py+'" r="5" fill="#A3E635" opacity=".85"/>'});
 s+='<text x="212" y="240" fill="#8B9AAE" text-anchor="middle" style="font:13px Manrope,sans-serif">'+sx.value+'</text><text x="12" y="115" fill="#8B9AAE" text-anchor="middle" transform="rotate(-90 12 115)" style="font:13px Manrope,sans-serif">'+sy.value+'</text>';svg.innerHTML=s;
 if(sx.value===sy.value){out.innerHTML="Pick two different columns.";return}
 var c=r(a,b),ab=Math.abs(c),strength=ab>.8?"strong":(ab>.5?"moderate":"weak"),dir=c>0?"positive":"negative",t='Correlation <b>r = '+c.toFixed(2)+'</b>: a <b>'+strength+' '+(ab<.3?"(almost no)":dir)+'</b> relationship.';
 var hasT=sx.value.indexOf("Temp")===0||sy.value.indexOf("Temp")===0;
 if(ab>.8&&!hasT)t+='<div class="note"><b>They move together, but neither one causes the other.</b> A third thing, <b>warm weather</b>, drives both. It is called a <b>confounding variable</b>.</div>';
 else if(ab>.8)t+='<div class="note">Warm weather plausibly <i>does</i> cause more of these. But the numbers alone cannot prove it. It takes more evidence than a correlation.</div>';
 else t+='<div class="note">A weak correlation means the two things do not move together in a clear way.</div>';out.innerHTML=t}
sx.addEventListener("change",upd);sy.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Data Is Not the Same as Information",
             "<b>Data</b> is the raw values: numbers, text, measurements. <b>Information</b> is what you <b>learn</b> from the data. A list of 10,000 temperatures is data. \"It has been getting warmer every year\" is information.",
             tbl(["", "Data", "Information"], [
                 ["<b>What it is</b>", "raw facts and values", "a conclusion drawn from the facts"],
                 ["<b>Example</b>", "12 monthly sales totals", "sales are highest in July and lowest in January"],
                 ["<b>How you get it</b>", "sensors, forms, logs, surveys", "calculating, comparing, and looking for patterns"],
             ]),
             "<p>Computers are good at this because they can process <b>far more data</b> than a person can read, and they do it the same way every time. A <b>program</b> can sort, count, average, and compare the data to <b>extract information</b>.</p>"),
        part(1, "Patterns and Trends",
             "A <b>pattern</b> is something that repeats or goes together. A <b>trend</b> is a pattern over <b>time</b>: values that keep rising, keep falling, or rise and fall in a cycle.",
             tbl(["Kind of pattern", "Example", "What it can tell you"], [
                 ["<b>Rising trend</b>", "a town's average temperature each year", "the climate is warming"],
                 ["<b>Seasonal cycle</b>", "ice cream sales by month", "demand follows the seasons"],
                 ["<b>Group difference</b>", "test scores by hours of sleep", "students who sleep more score higher"],
                 ["<b>Outlier</b>", "one day with 10,000 website visitors", "a one-time event, or an error to check"],
             ]),
             "<p>Larger data sets give <b>more reliable</b> trends. Three data points can be a coincidence. Three million are much harder to dismiss.</p>"),
        part(2, "Correlation Is Not Causation",
             "Two things are <b>correlated</b> when they change <b>together</b>. That does <b>not</b> mean one <b>causes</b> the other. Often a third factor drives both: a <b>confounding variable</b>.",
             corr,
             warn("<b>The classic mistake:</b> \"Ice cream sales and sunburns rise together, so ice cream causes sunburns.\" Really, <b>hot weather</b> causes both."),
             tbl(["", "Correlation", "Causation"], [
                 ["<b>Means</b>", "two values move together", "a change in one <b>makes</b> the other change"],
                 ["<b>Can data alone prove it?</b>", "yes, you can measure it", "no, you need more evidence"],
                 ["<b>Number</b>", "r from -1 to 1 (close to either end is strong)", "(no single number)"],
             ])),
        part(3, "Outliers and Averages",
             "One extreme value can pull an average a long way. When data has an <b>outlier</b>, the <b>median</b> (the middle value) can describe it better than the <b>mean</b> (the average).",
             tbl(["Data", "Mean", "Median", "What happened"], [
                 ["10, 12, 11, 13, 14", "12", "12", "the two agree"],
                 ["10, 12, 11, 13, <b>500</b>", "109.2", "12", "the 500 pulls the mean up. The median stays put."],
             ]),
             hint("An outlier is either a <b>real, interesting</b> value (a record-breaking day) or an <b>error</b> (a typo). Look into it before you decide."),
             quiz("qz12a", [
                 ("What is the difference between data and information?", ["Nothing, they mean the same", "Data is raw values. Information is what you learn from them", "Information is stored in binary and data is not", "Data is always numbers and information is always text"], 1, "Data is the raw material. <b>Information</b> is the conclusion you draw by processing it."),
                 ("A study finds that cities with more ice cream shops have more drownings. Which conclusion is best supported?", ["Ice cream causes drowning", "The two are correlated, and a third factor (hot weather, more swimming) may explain both", "Drowning causes ice cream sales", "There is no relationship at all"], 1, "A correlation does not prove causation. A <b>confounding variable</b> is the likely cause of both."),
                 ("Which describes a <b>trend</b>?", ["The highest score in a class", "Monthly sales that rise a little every year for ten years", "A single typo in a data set", "The title of a spreadsheet"], 1, "A trend is a pattern of change over <b>time</b>."),
                 ("A data set of salaries includes one billionaire. Which value best describes a typical salary?", ["The mean, because it uses every value", "The median, because it is not pulled by the extreme value", "The maximum", "The sum"], 1, "The <b>median</b> resists outliers."),
             ])),
        exam([
            "<b>Information</b> is extracted from data by finding <b>patterns, trends, and relationships</b>. Programs can do this with far more data than a person could.",
            "A <b>trend</b> is a pattern over time. Bigger data sets give more reliable trends.",
            "<b>Correlation does not imply causation.</b> A <b>confounding variable</b> can drive both.",
            "<b>Outliers</b> can change an average. Decide if they are real or errors.",
        ]),
    ]
    return mk("extracting-information.html", "extracting-information", "Extracting Information from Data", "TURNING NUMBERS INTO MEANING",
              "A pile of numbers is not an answer. Learn how <b>patterns</b> and <b>trends</b> become <b>information</b>, why <b>correlation is not causation</b>, and how one odd value can fool an average.",
              parts, "Data is the question. Information is the answer.", "Next: what changes when the data is too big for one computer?")


# ==========================================================================================  12.2 BIG DATA
def big_data_metadata():
    size = widget("wgbig", "Try it: how much data is that?",
                  "A video app wants to record every tap and swipe. Change the numbers and see how fast the storage grows.",
                  '<div class="grid2"><label>Users (millions) <input type="number" value="50" min="1" style="width:9ch"></label><label>Events per user per day <input type="number" value="300" min="1" style="width:9ch"></label><label>Bytes per event <input type="number" value="200" min="1" style="width:9ch"></label></div><div class="out"></div>',
                  r"""
var ins=root.querySelectorAll("input"),out=root.querySelector(".out");
function fmt(b){var u=["bytes","KB","MB","GB","TB","PB","EB"],i=0;while(b>=1000&&i<u.length-1){b/=1000;i++}return b.toFixed(b<10?2:(b<100?1:0))+" "+u[i]}
function upd(){var users=(Number(ins[0].value)||0)*1e6,ev=Number(ins[1].value)||0,by=Number(ins[2].value)||0,day=users*ev*by,year=day*365;
 out.innerHTML='Per day: <b>'+fmt(day)+'</b><br>Per year: <b>'+fmt(year)+'</b><br>A 1 TB laptop drive holds '+fmt(1e12)+'. You would fill <b>'+Math.round(year/1e12).toLocaleString()+' laptop drives</b> a year.<div class="note">When the data no longer fits on one machine, or one machine takes too long to read it, it has to be <b>split across many computers</b>: parallel and distributed computing.</div>';}
root.addEventListener("input",upd);upd();
""")
    meta = widget("wgmeta", "Try it: find photos using only metadata",
                  "Each photo has <b>metadata</b>: the date, place, and camera. You can find photos without looking at a single pixel.",
                  '<div class="row"><label>Place <select class="p"><option>any</option><option>Atlanta</option><option>Savannah</option><option>Athens</option></select></label> <label>Year <select class="y"><option>any</option><option>2025</option><option>2026</option></select></label></div><div class="out"></div>',
                  r"""
var photos=[["IMG_0101","2025-06-14","Savannah","Phone A",4.2],["IMG_0102","2025-06-14","Savannah","Phone A",3.9],["IMG_0233","2025-10-31","Atlanta","Camera B",8.1],["IMG_0310","2026-01-02","Athens","Phone A",4.4],["IMG_0311","2026-01-02","Athens","Phone A",4.0],["IMG_0420","2026-03-19","Atlanta","Phone C",5.2],["IMG_0555","2026-07-04","Savannah","Camera B",9.0],["IMG_0560","2026-07-04","Savannah","Camera B",8.7]];
var p=root.querySelector(".p"),y=root.querySelector(".y"),out=root.querySelector(".out");
function upd(){var rows=photos.filter(function(r){return(p.value==="any"||r[2]===p.value)&&(y.value==="any"||r[1].indexOf(y.value)===0)});
 out.innerHTML='<table><tr><th>File</th><th>Date</th><th>Place</th><th>Camera</th><th>MB</th></tr>'+rows.map(function(r){return"<tr><td>"+r.join("</td><td>")+"</td></tr>"}).join("")+'</table><div class="note">'+rows.length+' of '+photos.length+' photos match. The computer searched the <b>metadata</b>, not the pictures.</div>'}
p.addEventListener("change",upd);y.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "What Is Big Data?",
             "<b>Big data</b> is data that is too large or too complex for one ordinary computer to store or process in a reasonable time. Every video watched, every purchase, every sensor reading, and every location ping adds to it.",
             tbl(["The \"three Vs\"", "Meaning", "Example"], [
                 ["<b>Volume</b>", "a huge amount", "billions of search queries each day"],
                 ["<b>Variety</b>", "many kinds: text, images, numbers, video", "a hospital's notes, scans, and sensor readings"],
                 ["<b>Velocity</b>", "it arrives fast and keeps coming", "traffic sensors reporting every second"],
             ]),
             size),
        part(1, "Scale: Why One Computer Is Not Enough",
             "<b>Scalability</b> is how well a system copes when the amount of data or number of users <b>grows</b>. A system that works for 100 users but falls over at 100,000 does not scale.",
             "<p>Big data is processed by splitting it across <b>many computers working at the same time</b>. This uses the ideas from Unit 10: <b>parallel</b> and <b>distributed</b> computing, and <b>speedup</b>.</p>",
             tbl(["Problem", "One computer", "Many computers"], [
                 ["Count words in a billion web pages", "weeks", "minutes (each machine counts a slice, then the totals are added)"],
                 ["Store 5 PB of photos", "impossible", "spread across thousands of drives, with copies in case one fails"],
             ])),
        part(2, "Metadata: Data About Data",
             "<b>Metadata</b> is data that describes other data: the date a photo was taken, who sent a message, how long a song is. Metadata makes big data <b>searchable and organized</b>, because it is much smaller than the data itself.",
             meta,
             warn("Metadata can also be <b>private</b>. A set of photos' dates and places could show where you live and when you travel, even if no one ever sees a picture.")),
        part(3, "More Insight From Combining Data",
             "Two data sets that mean little alone can mean a lot <b>together</b>.",
             tbl(["Combine…", "…with…", "…to learn"], [
                 ["a store's daily sales", "the weather report", "how rain changes what people buy"],
                 ["bus GPS positions", "ridership counts", "which routes need more buses"],
                 ["health records (names removed)", "air-quality readings by zip code", "whether pollution is linked to asthma"],
             ]),
             warn("<b>The same trick is a privacy risk.</b> Joining two \"anonymous\" data sets can <b>re-identify</b> people (see the privacy notes)."),
             quiz("qz12b", [
                 ("Which best describes <b>big data</b>?", ["Any file bigger than 1 MB", "Data so large or complex that one ordinary computer cannot process it in a reasonable time", "Data stored only in the cloud", "Data that has been compressed"], 1, "It is about <b>volume, variety, and velocity</b> that exceeds what one machine can handle."),
                 ("Why is a data set stored across many computers usually processed in <b>parallel</b>?", ["To make the data less accurate", "So each computer handles a slice and the total time shrinks", "Because computers cannot read large files", "To avoid using metadata"], 1, "Splitting the work lets many machines work at once, which gives a <b>speedup</b>."),
                 ("A photo's file records the date, GPS location, and camera model. This information is…", ["the photo's pixel data", "metadata", "an outlier", "a heuristic"], 1, "Data <b>about</b> the data is metadata."),
                 ("A company joins its sales records to a weather data set. What is the most likely goal?", ["To compress the sales records", "To find a pattern, such as how weather affects what customers buy", "To encrypt the weather data", "To delete duplicates"], 1, "Combining data sets is a way to <b>extract new information</b>."),
             ])),
        exam([
            "<b>Big data</b> is too large or complex for one computer. It is processed with <b>parallel and distributed</b> computing.",
            "<b>Scalability</b> means a system keeps working as the data or number of users grows.",
            "<b>Metadata</b> is data about data. It helps find and organize data, but can also reveal private information.",
            "<b>Combining</b> data sets can reveal new information, and can threaten privacy.",
        ]),
    ]
    return mk("big-data-metadata.html", "big-data-metadata", "Big Data, Metadata, and Scale", "WHEN DATA OUTGROWS ONE COMPUTER",
              "Some data sets are too big to open on one laptop. Learn what <b>big data</b> is, why it is split across many computers, and how <b>metadata</b> helps you find a needle in a haystack.",
              parts, "Big data needs many hands, and good labels.", "Next: real data is messy. Cleaning it comes before everything else.")


# ==========================================================================================  12.3 CLEANING
def cleaning_data():
    cl = widget("wgclean", "Try it: clean a messy survey",
                "These eight survey rows have real-world problems. Switch on each cleaning step and watch the row count and the average age change.",
                '<div class="steps"></div><div class="out"></div>',
                r"""
var raw=[["Ana",16,"GA"],["ben",17,"Georgia"],["Cara","","GA"],["Dev",16,"ga"],["Ana",16,"GA"],["Eli",200,"GA"],["Fay",15,"GA "],["Gus",17,"FL"]];
var steps=[["dups","Remove the duplicate row"],["case","Fix names and state codes (capital letters, spaces, Georgia = GA)"],["miss","Drop rows with a missing age"],["bad","Drop impossible ages (over 120)"]];
var box=root.querySelector(".steps"),out=root.querySelector(".out"),on={};
box.innerHTML=steps.map(function(s){return'<label style="display:block;margin:4px 0"><input type="checkbox" data-k="'+s[0]+'"> '+s[1]+'</label>'}).join("");
function upd(){var rows=raw.map(function(r){return r.slice()}),flag=[];
 if(on.case)rows=rows.map(function(r){var n=r[0].charAt(0).toUpperCase()+r[0].slice(1),s=String(r[2]).trim().toUpperCase();if(s==="GEORGIA")s="GA";return[n,r[1],s]});
 if(on.dups){var seen={};rows=rows.filter(function(r){var k=r.join("|");if(seen[k])return false;seen[k]=1;return true})}
 if(on.miss)rows=rows.filter(function(r){return r[1]!==""});
 if(on.bad)rows=rows.filter(function(r){return r[1]===""||r[1]<=120});
 var ages=rows.filter(function(r){return r[1]!==""}).map(function(r){return Number(r[1])}),avg=ages.length?ages.reduce(function(a,b){return a+b},0)/ages.length:0;
 var h='<table><tr><th>Name</th><th>Age</th><th>State</th></tr>'+rows.map(function(r){var bad=[];if(r[1]==="")bad.push(1);else if(r[1]>120)bad.push(1);var st=String(r[2]);if(st!==st.trim()||st!==st.toUpperCase()||st==="Georgia")bad.push(2);if(r[0]!==r[0].charAt(0).toUpperCase()+r[0].slice(1))bad.push(0);return'<tr>'+r.map(function(c,i){return'<td'+(bad.indexOf(i)>-1?' style="color:#F87171"':'')+'>'+(c===""?"(missing)":(typeof c==="string"?c.replace(/ /g,"&middot;"):c))+'</td>'}).join("")+'</tr>'}).join("")+'</table>';
 h+='Rows: <b>'+rows.length+'</b> &nbsp; Average age: <b>'+avg.toFixed(1)+'</b>';
 if(on.miss&&rows.length<raw.length)h+='<div class="note">Careful: dropping rows loses information, and if the missing rows are not random, the cleaned data can be <b>biased</b>.</div>';
 if(!on.bad&&!on.dups&&!on.miss)h+='<div class="note">One age of 200 drags the average far above what is typical. That is why data is cleaned <b>before</b> it is analyzed.</div>';
 out.innerHTML=h}
box.addEventListener("change",function(e){on[e.target.dataset.k]=e.target.checked;upd()});upd();
""")
    parts = [
        part(0, "Real Data Is Messy",
             "Data collected from people and sensors is rarely perfect. <b>Cleaning data</b> means finding and fixing (or removing) the problems <b>before</b> you analyze it. If you skip it, your answers can be wrong, a rule called <b>garbage in, garbage out</b>.",
             tbl(["Problem", "Example", "Usual fix"], [
                 ["<b>Missing values</b>", "a survey row with no age", "leave it out, or fill it in sensibly (and say so)"],
                 ["<b>Duplicates</b>", "the same sign-up entered twice", "keep one copy"],
                 ["<b>Inconsistent format</b>", "GA, ga, Georgia, \"GA \"", "pick one format and convert the rest"],
                 ["<b>Impossible values</b>", "an age of 200, a negative price", "check the source, then correct or remove"],
                 ["<b>Mixed units</b>", "some heights in inches, others in centimeters", "convert everything to one unit"],
             ])),
        part(1, "Clean It Yourself",
             "Here is the process in action.",
             cl,
             hint("In Python this is done with <b>loops and conditionals</b>: loop over every row, and <code>if</code> a row has a problem, fix it or skip it. The walkthrough has you write exactly that.")),
        part(2, "Cleaning Can Change the Answer",
             "Cleaning decisions are choices, and choices have consequences.",
             two(box("Keep the original", "Never overwrite the raw data. Work on a <b>copy</b> so you can check or redo your cleaning.", "ok"),
                 box("Write down what you did", "Record every rule (\"removed ages over 120\"). Others need to trust your result.", "ok")),
             warn("<b>Dropping rows can create bias.</b> If most of the missing ages come from one group (say, younger students who skipped the question), removing them changes who is represented."),
             quiz("qz12c", [
                 ("A survey data set lists the same state as \"GA\", \"ga\", and \"Georgia\". What should be done before counting responses by state?", ["Nothing, a computer will understand", "Convert them all to one consistent format", "Delete the whole column", "Sort by age"], 1, "Inconsistent formats make the same thing look like different things. <b>Standardize</b> them first."),
                 ("A list of student ages includes one value of 200. What is the best next step?", ["Include it, since it is in the data", "Investigate it. It is likely an error to fix or remove", "Double every age", "Use it as the average"], 1, "Impossible values usually mean a mistake. Check the source before deciding."),
                 ("Why can <b>removing every row with a missing value</b> be a problem?", ["It always makes the data bigger", "If the missing rows are mostly from one group, the remaining data may be biased", "Computers cannot delete rows", "It changes the file format"], 1, "Cleaning choices can bias the data."),
                 ("Which is the best practice when cleaning data?", ["Overwrite the original and forget what you changed", "Keep the original and document each cleaning step", "Delete any row that looks odd", "Round every number"], 1, "Keep the raw data and a record so your work can be checked."),
             ])),
        exam([
            "Data must often be <b>cleaned</b> before it is used: missing values, duplicates, inconsistent formats, and impossible values.",
            "<b>Garbage in, garbage out</b>: conclusions are only as good as the data.",
            "Cleaning decisions can <b>introduce bias</b>. Keep the original and document what you changed.",
            "Programs clean data with <b>loops and conditionals</b>.",
        ]),
    ]
    return mk("cleaning-data.html", "cleaning-data", "Cleaning Data", "FIX IT BEFORE YOU USE IT",
              "A survey with an age of 200 will give you a nonsense average. Learn the usual <b>problems in real data</b>, how a program <b>cleans</b> them, and how cleaning itself can change the answer.",
              parts, "Clean first, then count.", "Next: once the data is clean, how do you ask it questions? Filtering, transforming, and combining.")


# ==========================================================================================  12.4 PROCESSING
def filter_transform_data():
    q = widget("wgquery", "Try it: ask a data set a question",
               "Ten songs. Choose a filter, a sort, and a summary. The loop that would do the same job in Python is shown underneath.",
               '<div class="row"><label>Genre <select class="g"><option>all</option><option>pop</option><option>hip hop</option><option>rock</option></select></label> <label>At least <input type="range" class="m" min="0" max="120" step="10" value="0"> <b class="mv mono">0</b> M plays</label></div><div class="row"><label>Sort by <select class="s"><option value="none">original order</option><option value="plays">plays (most first)</option><option value="min">length (shortest first)</option></select></label> <label>Summary <select class="a"><option value="count">how many</option><option value="avg">average plays</option><option value="total">total minutes</option></select></label></div><div class="out"></div>',
               r"""
var songs=[["Neon Streets","pop",3.1,120],["Gravel Road","rock",4.2,45],["Midnight Run","hip hop",2.8,90],["Paper Planes","pop",3.4,150],["Static","rock",3.9,30],["Block Party","hip hop",3.0,60],["Glass Hearts","pop",2.9,80],["Thunder Hall","rock",5.0,25],["Cipher","hip hop",3.6,110],["Daydream","pop",3.3,40]];
var g=root.querySelector(".g"),m=root.querySelector(".m"),mv=root.querySelector(".mv"),s=root.querySelector(".s"),a=root.querySelector(".a"),out=root.querySelector(".out");
function upd(){mv.textContent=m.value;var rows=songs.filter(function(r){return(g.value==="all"||r[1]===g.value)&&r[3]>=Number(m.value)});
 if(s.value==="plays")rows=rows.slice().sort(function(x,y){return y[3]-x[3]});if(s.value==="min")rows=rows.slice().sort(function(x,y){return x[2]-y[2]});
 var sum=a.value==="count"?'<b>'+rows.length+'</b> songs match':(a.value==="avg"?'average plays: <b>'+(rows.length?(rows.reduce(function(t,r){return t+r[3]},0)/rows.length).toFixed(1):"n/a")+' M</b>':'total length: <b>'+rows.reduce(function(t,r){return t+r[2]},0).toFixed(1)+' minutes</b>');
 var code='matches = []\nfor song in songs:\n'+(g.value==="all"?'':'    if song.genre == "'+g.value+'" and song.plays >= '+m.value+':\n')+(g.value==="all"?'    if song.plays >= '+m.value+':\n':'')+'        matches.append(song)';
 out.innerHTML='<table><tr><th>Title</th><th>Genre</th><th>Min</th><th>Plays (M)</th></tr>'+rows.map(function(r){return"<tr><td>"+r.join("</td><td>")+"</td></tr>"}).join("")+'</table><div style="margin-top:6px">'+sum+'</div><pre class="mono" style="font-size:13px;color:#8B9AAE;margin:8px 0 0;white-space:pre-wrap">'+code+'</pre>'}
root.addEventListener("input",upd);root.addEventListener("change",upd);upd();
""")
    parts = [
        part(0, "Questions You Ask Data",
             "Most questions about data are built from a few small <b>operations</b>. A program does each one with a loop, and often an <code>if</code>.",
             tbl(["Operation", "What it does", "Example"], [
                 ["<b>Filter</b>", "keep only the items that match a condition", "songs longer than 4 minutes"],
                 ["<b>Transform</b>", "change each item, or add a new column", "convert minutes to seconds; compute a letter grade from a score"],
                 ["<b>Sort</b>", "put the items in order", "most-played first"],
                 ["<b>Summarize</b> (aggregate)", "boil many values down to one", "count, total, average, largest, smallest"],
                 ["<b>Combine</b>", "match two data sets on something they share", "join a list of students to a list of grades by student ID"],
             ])),
        part(1, "Filter, Sort, Summarize",
             "Try the operations on a small music data set.",
             q),
        part(2, "Transforming and Combining",
             "A <b>transformation</b> makes a new value from an old one. The same loop pattern as filtering, but it changes the item instead of just keeping or skipping it.",
             tbl(["Before", "Transformation", "After"], [
                 ["height in inches: 70", "multiply by 2.54", "height in cm: 177.8"],
                 ["score: 87", "if 90+ then A, elif 80+ then B ...", "grade: B"],
                 ["\"  Ana \"", "strip spaces, capitalize", "\"Ana\""],
             ]),
             "<p>To <b>combine</b> two data sets, find a <b>key</b> they share, like a student ID, and match rows with the same key.</p>",
             tbl(["Student ID", "Name (list 1)", "Score (list 2)", "Combined"], [["101", "Ana", "92", "Ana: 92"], ["102", "Ben", "78", "Ben: 78"]])),
        part(3, "Reading an Exam Question",
             "AP questions describe a program in words and ask what kind of processing it does. Name the operation.",
             tbl(["The program…", "That is…"], [
                 ["goes through a list of orders and keeps the ones over $50", "<b>filtering</b>"],
                 ["goes through a list of temperatures in Celsius and makes a list in Fahrenheit", "<b>transforming</b>"],
                 ["adds up every order and divides by the count", "<b>summarizing</b> (an average)"],
                 ["uses a customer ID to pull each customer's name into the order list", "<b>combining</b> data sets"],
             ]),
             quiz("qz12d", [
                 ("A program goes through a list of test scores and builds a new list containing only the scores above 70. This is…", ["Sorting", "Filtering", "Combining", "Compressing"], 1, "Keeping only the items that meet a <b>condition</b> is filtering."),
                 ("A program turns a list of prices in dollars into a list of prices in euros by multiplying each by 0.9. This is…", ["Filtering", "Transforming", "Summarizing", "Encrypting"], 1, "Each item is <b>changed</b> to a new value."),
                 ("Which code pattern finds the <b>total</b> of a list called <code>prices</code>?", ["A loop that adds each price to a running total", "A loop that removes every price", "A loop that sorts the list", "A loop that prints the first price"], 0, "<b>Summarizing</b> uses an accumulator, a variable that grows as the loop adds each value."),
                 ("A school has one list of student IDs with names and another list of student IDs with grades. How can the two be joined?", ["By matching rows that have the same student ID", "By adding the grades to the names", "By deleting duplicate names", "By sorting both lists alphabetically"], 0, "Combining data uses a shared <b>key</b>."),
             ])),
        exam([
            "Data is processed with <b>filtering, transforming, sorting, summarizing, and combining</b>.",
            "Programs do these with <b>loops, conditionals, and a variable that collects the result</b>.",
            "Know how to <b>name the operation</b> a described program is performing.",
            "<b>Combining</b> data sets uses a shared key and can reveal new information.",
        ]),
    ]
    return mk("filter-transform-data.html", "filter-transform-data", "Filtering, Transforming, and Combining Data", "ASKING DATA A QUESTION",
              "Almost every question you ask a data set is built from a few small steps: <b>filter</b>, <b>transform</b>, <b>sort</b>, <b>summarize</b>, and <b>combine</b>. Learn them, and learn to spot them in the loops you write.",
              parts, "Five small steps answer big questions.", "Next: a table of answers is hard to read. Visualizing data.")


# ==========================================================================================  12.5 VISUALIZING
def visualizing_data():
    axis = widget("wgaxis", "Try it: the same two bars, two stories",
                  "Sales were <b>52</b> in Plan A and <b>55</b> in Plan B. That is only a 6% difference. Drag the bottom of the chart axis up and see what the picture claims.",
                  '<div class="row"><label>The vertical axis starts at <input type="range" min="0" max="50" value="0"> <b class="mono av">0</b></label></div><svg viewBox="0 0 360 220" style="width:100%;max-width:360px;display:block;background:#0B0F16;border:1px solid #232B38;border-radius:8px"></svg><div class="out"></div>',
                  r"""
var rg=root.querySelector("input"),av=root.querySelector(".av"),svg=root.querySelector("svg"),out=root.querySelector(".out");
function upd(){var lo=Number(rg.value);av.textContent=lo;var top=60,H=170,hA=(52-lo)/(60-lo)*H,hB=(55-lo)/(60-lo)*H,s='<line x1="40" y1="195" x2="340" y2="195" stroke="#3A4658"/>';
 s+='<rect x="80" y="'+(195-hA)+'" width="80" height="'+hA+'" fill="#60A5FA"/><rect x="220" y="'+(195-hB)+'" width="80" height="'+hB+'" fill="#F472B6"/><text x="120" y="212" fill="#C4CDD8" text-anchor="middle" style="font:13px Manrope">Plan A: 52</text><text x="260" y="212" fill="#C4CDD8" text-anchor="middle" style="font:13px Manrope">Plan B: 55</text>';svg.innerHTML=s;
 var vis=(55-lo)/(52-lo);out.innerHTML='Plan B\'s bar looks <b style="color:'+(vis>1.4?"#F87171":"#A3E635")+'">'+vis.toFixed(2)+' times</b> as tall as Plan A\'s. The real ratio is <b>1.06</b>.'+(lo>0?'<div class="note"><b>A truncated axis exaggerates differences.</b> Bar lengths should be in proportion to the values, so a bar chart\'s axis should start at 0.</div>':'<div class="note">Starting at 0 shows the true size of the difference: small.</div>')}
rg.addEventListener("input",upd);upd();
""")
    parts = [
        part(0, "Why Visualize?",
             "A table of 1,000 numbers hides the pattern that one picture shows in a second. A <b>visualization</b> turns data into a chart or graph so people can see <b>patterns, trends, and outliers</b> quickly and share a finding with others.",
             "<p>A good chart <b>communicates</b>. A bad one can <b>mislead</b>, even when every number in it is correct.</p>"),
        part(1, "Choose the Right Chart",
             "The best chart depends on the question.",
             tbl(["Chart", "Best for", "Example"], [
                 ["<b>Line</b>", "how something <b>changes over time</b>", "a town's temperature each month"],
                 ["<b>Bar</b>", "<b>comparing</b> categories", "votes for each lunch option"],
                 ["<b>Pie</b>", "<b>parts of a whole</b> (that add to 100%)", "how a budget is divided"],
                 ["<b>Scatter plot</b>", "the <b>relationship between two numbers</b>", "hours studied and test score"],
                 ["<b>Histogram</b>", "how values are <b>spread out</b>", "how many students scored in each 10-point range"],
             ])),
        part(2, "Charts Can Mislead",
             "Because people trust pictures, the way a chart is drawn changes what it seems to say.",
             axis,
             tbl(["Trick", "What it does", "How to spot it"], [
                 ["<b>Truncated axis</b>", "makes a small difference look huge", "check where the axis starts"],
                 ["<b>Cherry-picked range</b>", "shows only the dates that tell one story", "ask what happened before and after"],
                 ["<b>Missing labels or units</b>", "hides what is being measured", "look for a title, axis labels, and units"],
                 ["<b>Different scales side by side</b>", "makes two charts look comparable when they are not", "compare the numbers, not the heights"],
             ])),
        part(3, "Making a Chart Well",
             "These habits make a visualization honest and easy to read.",
             chk(["Give it a <b>title</b> that says what it shows.", "<b>Label</b> both axes and include <b>units</b>.", "Start bar charts at <b>zero</b>.", "Use <b>color</b> with care. Many people cannot tell red from green, so add labels or patterns.", "Show <b>all</b> the data that matters. Do not hide the inconvenient part."]),
             "<p>In Python, libraries like <code>matplotlib</code> turn a list of numbers into a chart. Using a library to draw charts is exactly the library idea from Unit 5: someone else wrote the plotting procedures, and you call them with the right arguments.</p>",
             quiz("qz12e", [
                 ("A company wants to show how its website visits changed each month over two years. Which chart is the best choice?", ["Pie chart", "Line chart", "Scatter plot of ZIP codes", "A table with no chart"], 1, "A line chart shows <b>change over time</b>."),
                 ("A bar chart's vertical axis starts at 50 instead of 0. What is the most likely effect?", ["It hides the data", "It makes small differences between bars look much larger", "It makes the bars the same height", "It changes the data itself"], 1, "A truncated axis exaggerates differences."),
                 ("Which chart best shows whether students who study more earn higher scores?", ["Pie chart", "Scatter plot", "Line chart of one student", "Bar chart of the class names"], 1, "A scatter plot shows the <b>relationship between two numeric values</b>."),
                 ("A graph shows only the three warmest months to argue that the climate is not changing. What is the problem?", ["The graph used a line", "It cherry-picks a range of data that supports only one story", "It was drawn in color", "It has too many labels"], 1, "Choosing only convenient data misleads."),
             ])),
        exam([
            "<b>Visualizations</b> help people see patterns, trends, and outliers.",
            "Match the chart to the question: <b>line</b> (time), <b>bar</b> (compare), <b>pie</b> (parts of a whole), <b>scatter</b> (relationship).",
            "Charts can <b>mislead</b>: truncated axes, cherry-picked ranges, missing labels.",
            "Libraries can draw charts from data, just as they provide other procedures.",
        ]),
    ]
    return mk("visualizing-data.html", "visualizing-data", "Visualizing Data", "SEEING THE PATTERN",
              "A good chart shows a pattern in a second. A bad one can <b>lie without changing a single number</b>. Learn which chart answers which question, and how to spot a misleading one.",
              parts, "Draw it honestly.", "Next: the data itself can be biased before anyone draws anything.")


# ==========================================================================================  12.6 BIAS IN DATA
def data_bias_sampling():
    samp = widget("wgsamp", "Try it: ask 100 students a question",
                  "A school of 1,000 students: 500 eat first lunch (20% prefer online school) and 500 eat second lunch (70% prefer it). The truth for the whole school is about <b>45%</b>. How you pick who to ask changes what you find.",
                  '<div class="row"><label>How to choose <select class="m"><option value="random">Random sample of the whole school</option><option value="conv">Ask only the people at my lunch table (first lunch)</option><option value="vol">Voluntary online poll (people with strong opinions reply more)</option></select></label> <label>Sample size <input type="range" class="n" min="20" max="300" step="10" value="100"> <b class="nv mono">100</b></label> <button class="go">Take a sample</button></div><div class="out"></div>',
                  r"""
var pop=[];for(var i=0;i<1000;i++){var g=i<500?0:1;pop.push({g:g,p:Math.random()<(g?0.7:0.2)})}
var m=root.querySelector(".m"),n=root.querySelector(".n"),nv=root.querySelector(".nv"),out=root.querySelector(".out"),log=[];
function take(){var N=Number(n.value),s=[];
 if(m.value==="random"){for(var k=0;k<N;k++)s.push(pop[Math.floor(Math.random()*1000)])}
 else if(m.value==="conv"){for(var k=0;k<N;k++)s.push(pop[Math.floor(Math.random()*500)])}
 else{while(s.length<N){var c=pop[Math.floor(Math.random()*1000)];if(Math.random()<(c.p?0.8:0.15))s.push(c)}}
 var yes=s.filter(function(x){return x.p}).length,pct=yes/N*100;log.unshift({m:m.options[m.selectedIndex].text.split(" (")[0],pct:pct});log=log.slice(0,5);draw()}
function draw(){nv.textContent=n.value;var truth=pop.filter(function(x){return x.p}).length/10;out.innerHTML='True answer for the whole school: <b>'+truth.toFixed(0)+'%</b><br>'+log.map(function(l){var off=Math.abs(l.pct-truth);return l.m+': <b style="color:'+(off<8?"#A3E635":"#F87171")+'">'+l.pct.toFixed(0)+'%</b> (off by '+off.toFixed(0)+')'}).join("<br>")+(log.length?'<div class="note">A <b>random</b> sample is close to the truth and gets closer with more people. A biased way of picking people stays wrong <b>no matter how big the sample is</b>.</div>':'<div class="note">Click <b>Take a sample</b> a few times with each method.</div>')}
root.querySelector(".go").onclick=take;n.addEventListener("input",draw);draw();
""")
    parts = [
        part(0, "Who Is in the Data?",
             "Conclusions are only as good as the data behind them, and data is only as good as <b>how it was collected</b>. The <b>population</b> is everyone you want to learn about. The <b>sample</b> is the part you actually collect data from. If the sample does not <b>represent</b> the population, the conclusions can be wrong.",
             samp),
        part(1, "Common Ways Data Becomes Biased",
             "Bias can sneak in before any computer is involved.",
             tbl(["Kind", "What goes wrong", "Example"], [
                 ["<b>Sampling bias</b>", "the people asked are not typical of everyone", "polling only people who have landlines"],
                 ["<b>Self-selection bias</b>", "people choose whether to take part, and the choosers differ", "an online poll where angry people reply far more"],
                 ["<b>Survivorship bias</b>", "you only see what \"survived\"", "studying only the companies that still exist, then concluding all startups succeed"],
                 ["<b>Missing groups</b>", "some people cannot be reached at all", "an app-based survey misses people with no smartphone (the digital divide)"],
             ]),
             warn("<b>A bigger sample does not fix a biased method.</b> Asking 10,000 people at the same lunch table still tells you about that table.")),
        part(2, "Biased Data, Biased Results",
             "A system trained or tested on biased data gives biased results. This is how <b>computing bias</b> often begins, which is the next idea in the Impact of Computing notes.",
             cards([("1", "Ask who is missing", "Who might not be in this data? Who is over-represented?"),
                    ("2", "Ask how it was collected", "Random, voluntary, convenient? Was anyone pressured to answer?"),
                    ("3", "Ask what was measured", "Is the number really the thing you care about, or only something close to it?")])),
        part(3, "Trust, Consent, and Privacy",
             "Collecting data about people raises <b>ethical</b> questions as well as technical ones.",
             tbl(["Question", "Why it matters"], [
                 ["Did people <b>agree</b> (consent) to have their data collected?", "People have a right to know what is collected and why"],
                 ["Is the data <b>anonymous</b>, and is that really true?", "Small facts can combine to identify someone (see privacy and PII)"],
                 ["Who can <b>see and sell</b> it?", "Data can be sold, leaked, or used in ways no one expected"],
                 ["Will it be used <b>fairly</b>?", "Decisions about loans, jobs, or schools made from biased data can harm people"],
             ]),
             quiz("qz12f", [
                 ("To learn what all students at a school think about the lunch menu, a student surveys only the students sitting at one lunch table. What is the main problem?", ["The survey has too many questions", "The sample may not represent the whole school", "The data is stored in binary", "Lunch menus cannot be surveyed"], 1, "The people asked are not typical of everyone: <b>sampling bias</b>."),
                 ("A website runs an optional poll, and mostly people with strong opinions respond. This is an example of…", ["Self-selection bias", "Lossy compression", "A DDoS attack", "Parallel computing"], 0, "People choose whether to take part, and the choosers differ from everyone else."),
                 ("A researcher says: \"My biased survey is fine because I asked 50,000 people.\" What is wrong with that?", ["Nothing, large samples fix bias", "A large sample from a biased method is still biased", "50,000 is too many to count", "Surveys cannot be large"], 1, "<b>Method matters more than size.</b>"),
                 ("A study of successful companies concludes that quitting college makes you rich, because it only looked at famous founders who did. This is…", ["Survivorship bias", "Open-source licensing", "Metadata", "A heuristic"], 0, "It ignores everyone who did the same thing and did not succeed."),
             ])),
        exam([
            "A <b>sample</b> should <b>represent</b> the population. Biased sampling gives biased conclusions.",
            "Know <b>sampling bias</b>, <b>self-selection bias</b>, and <b>survivorship bias</b>. A bigger sample does not fix a biased method.",
            "Biased data leads to <b>biased results</b> from programs that use it.",
            "Data collection raises questions of <b>consent, privacy, and fairness</b>.",
        ]),
    ]
    return mk("data-bias-sampling.html", "data-bias-sampling", "Bias, Sampling, and Trust in Data", "WHO IS IN THE DATA?",
              "A perfect chart of biased data is still wrong. Learn how <b>samples</b> go wrong, why asking more people does not fix a biased method, and what to ask before you trust a data set.",
              parts, "Ask who is missing.", "That is the end of the Data unit. Use the walkthroughs to practice each idea in Python.")


PAGES = {
    "extracting-information": extracting_information,
    "big-data-metadata": big_data_metadata,
    "cleaning-data": cleaning_data,
    "filter-transform-data": filter_transform_data,
    "visualizing-data": visualizing_data,
    "data-bias-sampling": data_bias_sampling,
}


def _index():
    lessons = [(TITLES[f], f, "&#128214; Notes &nbsp;+&nbsp; &#128187; Walkthrough &nbsp;+&nbsp; check-yourself questions") for f, _ in PAGES_LIST]
    intro = ('<p>Data is everywhere, and the AP exam expects you to know how to <b>get information out of it</b>: finding patterns, cleaning it, asking it questions, drawing it honestly, and noticing when it is biased. These pages cover Big Idea 2 (Data).</p>'
             '<p style="font-size:14px;opacity:.8">Read the notes, try the activities, then open the lesson\'s walkthrough in the <a href="../../python/editor.html">Python Editor</a>.</p>')
    return unit_index(UNIT_LABEL, 12, intro, lessons)


INDEXES = {"unit-12": _index}
