/* Model solutions for the IST Unit 3 walkthroughs (id "6.1w") and assignments ("6.1a"). Each must score 100. Pages are written the way a careful student would type them. */
export const MODELS = {};
/* text the student writes freely (any words): the checks only count the words, so changing it must not lower the score */
export const FREE = {};
/* lines the model has MORE of than the assignment asks for (deleting one may still score 100) */
export const SLACK = {};
const M = (id, html) => { MODELS[id] = html.replace(/^\n/, ""); };

M("6.1w", `
<!DOCTYPE html>
<html>
<head>
<title>Slice House</title>
</head>
<body>
<h1>Slice House</h1>
<h2>Our Story</h2>
<p>Slice House opened in 2019 with one oven and a big idea.</p>
<h2>Our Menu</h2>
<p>We bake cheese, pepperoni, and veggie pizza every day.</p>
</body>
</html>
`);
M("6.1a", `
<!DOCTYPE html>
<html>
<head>
<title>Netflix Help Center</title>
</head>
<body>
<h1>Help Center</h1>
<h2>Billing</h2>
<p>Open your account page to see your bill.</p>
<h2>Devices</h2>
<p>Watch on phones, tablets, laptops and smart TVs.</p>
</body>
</html>
`);

M("6.2w", `
<!DOCTYPE html>
<html>
<head>
<title>Pixel Arcade</title>
</head>
<body style="background-color: navy; color: white">
<h1 style="color: tomato">Pixel Arcade</h1>
<h2 style="color: white; background-color: black">Top Games</h2>
<p style="color: #003366; background-color: #FFEEAA">New games arrive every Friday.</p>
</body>
</html>
`);
M("6.2a", `
<!DOCTYPE html>
<html>
<head>
<title>Road Trip Mix</title>
</head>
<body style="background-color: black; color: white">
<h1 style="color: black; background-color: #1DB954">Road Trip Mix</h1>
<h2 style="color: yellow; background-color: purple">Highway Song</h2>
<p style="color: #222222; background-color: #EEEEEE">A great song for singing loudly with the windows down.</p>
<h2 style="color: black; background-color: orange">Sunset Drive</h2>
<p style="color: #FFFFFF; background-color: #333333">A calm song for the last hour before you arrive.</p>
</body>
</html>
`);

M("6.20w", `
<!DOCTYPE html>
<html>
<head>
<title>Skyline Cinema</title>
</head>
<body>
<h1 style="font-size: 48px; text-align: center; text-transform: uppercase">Skyline Cinema</h1>
<h2 style="text-align: center">Now Showing</h2>
<h3 style="font-size: 24px; text-transform: capitalize">friday night double feature</h3>
<p style="font-size: 18px; text-align: right; text-transform: lowercase">DOORS OPEN AT SIX. TICKETS ARE FIVE DOLLARS.</p>
</body>
</html>
`);
M("6.20a", `
<!DOCTYPE html>
<html>
<head>
<title>Nintendo Direct</title>
</head>
<body style="background-color: black; color: white">
<h1 style="font-size: 56px; text-align: center; text-transform: uppercase">Nintendo Direct</h1>
<h2 style="font-size: 32px; text-align: center">Super Mario Journey</h2>
<h3 style="font-size: 22px; text-transform: capitalize">coming this holiday season</h3>
<p style="font-size: 18px; text-align: right">Mario travels across new worlds in a game made for the whole family.</p>
</body>
</html>
`);

M("6.3w", `
<!DOCTYPE html>
<html>
<head>
<title>Beanstalk Coffee</title>
</head>
<body>
<h1>Beanstalk Coffee</h1>
<hr>
<p>We roast <strong>fresh</strong> beans every morning and serve them <em>hot</em>.</p>
<p>Open daily<br>7 AM to 5 PM</p>
<hr>
<p>Try the <span style="color: green">Green Giant</span> latte.</p>
</body>
</html>
`);
M("6.3a", `
<!DOCTYPE html>
<html>
<head>
<title>Chipotle Menu</title>
</head>
<body style="background-color: black; color: white">
<h1 style="text-align: center">Chipotle Menu</h1>
<hr>
<p><strong>Burrito Bowl</strong> <em>rice, beans, chicken and salsa</em> $9.50</p>
<p><strong>Tacos</strong> <em>three soft tacos with your choice of meat</em> $8.25</p>
<hr>
<p>Visit us at<br>100 Main Street</p>
<p>Try the <span style="color: orange">extra spicy</span> salsa.</p>
</body>
</html>
`);

M("6.35w", `
<!DOCTYPE html>
<html>
<head>
<title>Sweet Dreams Bakery</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
</head>
<body>
<h1 style="font-family: 'Pacifico'">Sweet Dreams Bakery</h1>
<p style="font-family: 'Open Sans'">Fresh bread and cakes every morning from our family oven.</p>
<p style="font-family: 'Open Sans'">Try our <span style="font-family: 'Pacifico'">famous</span> cinnamon rolls.</p>
</body>
</html>
`);
M("6.35a", `
<!DOCTYPE html>
<html>
<head>
<title>Airbnb Cabins</title>
<link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
</head>
<body style="background-color: #2b1d14; color: #f5e6d3">
<h1 style="font-family: 'Lobster'; text-align: center">Airbnb Cabins</h1>
<p style="font-family: 'Roboto'">Find a quiet cabin in the mountains and wake up to birdsong.</p>
<p style="font-family: 'Roboto'">Every cabin has a warm fireplace and a deck with a <span style="font-family: 'Lobster'">stunning</span> view.</p>
</body>
</html>
`);

M("6.4w", `
<!DOCTYPE html>
<html>
<head>
<title>Game Night</title>
</head>
<body>
<h1 style="border: 4px solid navy">Game Night</h1>
<h2 style="border-bottom: 3px dashed red">Friday at Six</h2>
<p style="border: 3px dotted green">Snacks are free all night.</p>
<p style="border: 6px double purple">Bring a friend.</p>
<p style="border: 5px groove orange">Everyone gets a prize.</p>
<p style="border: 5px ridge teal">Games start at seven.</p>
<p style="border-left: 8px solid black">See you Friday.</p>
</body>
</html>
`);
M("6.4a", `
<!DOCTYPE html>
<html>
<head>
<title>Pokemon Card</title>
</head>
<body style="background-color: gold; color: black">
<h1 style="font-size: 48px; text-align: center; border: 6px solid red">Pikachu</h1>
<h2 style="border-bottom: 4px dashed blue">Electric Type</h2>
<p style="border: 3px solid black">Height is 0.4 meters.</p>
<p style="border: 3px dashed brown">Weight is 6 kilograms.</p>
<p style="border: 4px dotted green">Attack: Thunder Shock.</p>
<p style="border: 6px double purple">Evolves from Pichu.</p>
<p style="border-right: 10px solid orange">Loves ketchup and sweet berries.</p>
</body>
</html>
`);

const LAB = "https://schscomputerscience.com/ist/unit-6/lab/";
M("6.7w", `
<!DOCTYPE html>
<html>
<head>
<title>Space Camp</title>
<link rel="icon" href="${LAB}rocket.svg">
</head>
<body>
<h1>Space Camp</h1>
<img src="${LAB}rocket.svg" alt="A red and white rocket flying through space" style="width: 200px">
<p>Blast off this summer.</p>
<img src="${LAB}planet.svg" alt="A purple planet with a yellow ring" style="width: 50%">
</body>
</html>
`);
M("6.7a", `
<!DOCTYPE html>
<html>
<head>
<title>Apple Store</title>
<link rel="icon" href="${LAB}moon.svg">
</head>
<body style="background-color: white; color: black">
<h1 style="text-align: center">Apple Store</h1>
<p>Find the newest phones, laptops and watches in one place.</p>
<img src="${LAB}rocket.svg" alt="A red and white rocket" style="width: 150px">
<img src="${LAB}planet.svg" alt="A purple ringed planet" style="width: 40%; border: 4px solid navy">
<p>Our team can help you choose the right product today.</p>
<img src="${LAB}moon.svg" alt="The gray moon with craters">
</body>
</html>
`);

M("6.75w", `
<!DOCTYPE html>
<html>
<head>
<title>Pizza Night</title>
</head>
<body>
<h1>Pizza Night 🍕</h1>
<p>Friday at 6 → bring friends!</p>
<p>Rating: <span style="color: gold; font-size: 30px">★★★★</span><span style="color: gray; font-size: 30px">★</span></p>
<p style="text-align: center; font-size: 14px">© 2027 Pizza Night™ ♥ Made with love</p>
</body>
</html>
`);
M("6.75a", `
<!DOCTYPE html>
<html>
<head>
<title>Taco Bell Menu</title>
</head>
<body style="background-color: purple; color: white">
<h1 style="text-align: center">Taco Bell 🌮</h1>
<p>🌮 Crunchy Taco $1.99</p>
<p>🌯 Bean Burrito $2.49</p>
<p>🧀 Cheesy Nachos $3.29</p>
<p>Rating: <span style="color: gold; font-size: 24px">★★★★☆</span></p>
<p style="text-align: center; font-size: 12px">© 2027 Taco Bell™ All rights reserved</p>
</body>
</html>
`);

M("6.6w", `
<!DOCTYPE html>
<html>
<head>
<title>Space Fan Club</title>
</head>
<body>
<h1>Space Fan Club</h1>
<a href="https://www.nasa.gov" target="_blank"><img src="${LAB}rocket.svg" alt="A red and white rocket flying through space" style="width: 150px"></a>
<p>Visit <a href="https://www.nasa.gov" target="_blank">NASA</a> to see real launches.</p>
<p><a href="https://www.nasa.gov/missions/" target="_blank"><strong>Join the mission</strong></a></p>
<h2><a href="https://en.wikipedia.org/wiki/Moon" target="_blank">Moon Facts</a></h2>
</body>
</html>
`);
M("6.6a", `
<!DOCTYPE html>
<html>
<head>
<title>YouTube Favorites</title>
</head>
<body style="background-color: #fff8e7; color: #222222">
<h1 style="text-align: center">YouTube Favorites</h1>
<h2><a href="https://www.youtube.com/@NASA" target="_blank">NASA Channel</a></h2>
<p>I watch rocket launches and space videos here every single week.</p>
<h2>Science</h2>
<p>Read how <a href="https://www.youtube.com/@veritasium" target="_blank"><strong>Veritasium</strong></a> explains hard ideas.</p>
<h2>Music</h2>
<p>Find new songs on <a href="https://www.youtube.com/@Vevo" target="_blank">Vevo</a> and the <a href="https://www.youtube.com/@NPR" target="_blank">NPR Tiny Desk</a> channel.</p>
<a href="https://www.youtube.com" target="_blank"><img src="${LAB}moon.svg" alt="The gray moon with craters" style="width: 120px"></a>
</body>
</html>
`);
M("6.5w", `
<!DOCTYPE html>
<html>
<head>
<title>Camping Trip</title>
</head>
<body>
<h1>Camping Trip</h1>
<h2>Pack These</h2>
<ul style="list-style-type: square">
<li>Tent</li>
<li>Sleeping bag</li>
<li>Flashlight</li>
</ul>
<h2>Cooking Steps</h2>
<ol style="list-style-type: upper-roman">
<li><strong>Build</strong> <em>a small fire</em></li>
<li>Roast the marshmallows</li>
<li>Eat</li>
</ol>
<h2>Menu</h2>
<ul style="list-style-type: none">
<li style="display: inline">Home</li>
<li style="display: inline">About</li>
<li style="display: inline">Contact</li>
</ul>
</body>
</html>
`);
M("6.5a", `
<!DOCTYPE html>
<html>
<head>
<title>Pizza Hut Specials</title>
</head>
<body style="background-color: #b30000; color: white">
<h1 style="text-align: center">Pizza Hut Specials</h1>
<h2>Deals</h2>
<ul style="list-style-type: square; border: 3px solid yellow">
<li><strong>Pepperoni Pan</strong> <em>the classic with lots of cheese</em></li>
<li><strong>Veggie Lovers</strong> <em>peppers, onions and mushrooms</em></li>
<li><strong>Meat Feast</strong> <em>sausage, ham and bacon</em></li>
<li><strong>Cheese Bites</strong> <em>a cheesy side for the whole table</em></li>
</ul>
<h2>How to Order</h2>
<ol style="list-style-type: upper-alpha">
<li>Pick your pizza</li>
<li>Choose a crust</li>
<li>Pay and wait for the doorbell</li>
</ol>
<h2>Menu</h2>
<ul style="list-style-type: none">
<li style="display: inline">Deals</li>
<li style="display: inline">Order</li>
<li style="display: inline">Contact</li>
</ul>
</body>
</html>
`);

FREE["6.1a"] = ["Open your account page to see your bill.", "Watch on phones, tablets, laptops and smart TVs."];
FREE["6.2a"] = ["Highway Song", "Sunset Drive", "A great song for singing loudly with the windows down.", "A calm song for the last hour before you arrive."];
FREE["6.20a"] = ["Super Mario Journey", "coming this holiday season", "Mario travels across new worlds in a game made for the whole family."];
FREE["6.3a"] = ["rice, beans, chicken and salsa", "three soft tacos with your choice of meat", "Burrito Bowl", "Tacos", "Visit us at", "100 Main Street", "extra spicy", "Try the "];
FREE["6.3a"].push("Try the", "salsa.");
SLACK["6.3a"] = ["Burrito Bowl", "<strong>Tacos"];
FREE["6.35a"] = ["Find a quiet cabin in the mountains and wake up to birdsong.", "Every cabin has a warm fireplace and a deck with a", "stunning", "view."];
FREE["6.4a"] = ["Electric Type", "Height is 0.4 meters.", "Weight is 6 kilograms.", "Attack: Thunder Shock.", "Evolves from Pichu.", "Loves ketchup and sweet berries."];
SLACK["6.35w"] = ["rel=\"preconnect\""];
FREE["6.7a"] = ["Find the newest phones, laptops and watches in one place.", "Our team can help you choose the right product today.", "A red and white rocket", "A purple ringed planet", "The gray moon with craters"];
FREE["6.75a"] = ["🌮 Crunchy Taco $1.99", "🌯 Bean Burrito $2.49", "🧀 Cheesy Nachos $3.29", "© 2027 Taco Bell™ All rights reserved"];
FREE["6.75a"].push("Rating:");
FREE["6.6a"] = ["NASA Channel", "I watch rocket launches and space videos here every single week.", "Science", "Read how", "explains hard ideas.", "Music", "Find new songs on", "and the", "channel.", "NPR Tiny Desk", "Vevo", "Veritasium", "The gray moon with craters"];
FREE["6.5a"] = ["Deals", "How to Order", "Menu", "Pepperoni Pan", "the classic with lots of cheese", "Veggie Lovers", "peppers, onions and mushrooms", "Meat Feast", "sausage, ham and bacon", "Cheese Bites", "a cheesy side for the whole table", "Pick your pizza", "Choose a crust", "Pay and wait for the doorbell", "Order", "Contact"];
SLACK["6.6a"] = ["I watch rocket launches"];
