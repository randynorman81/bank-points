from lib import *

ELEMENTS = table("""
1|H|Hydrogen
2|He|Helium
3|Li|Lithium
4|Be|Beryllium
5|B|Boron
6|C|Carbon
7|N|Nitrogen
8|O|Oxygen
9|F|Fluorine
10|Ne|Neon
11|Na|Sodium
12|Mg|Magnesium
13|Al|Aluminum
14|Si|Silicon
15|P|Phosphorus
16|S|Sulfur
17|Cl|Chlorine
18|Ar|Argon
19|K|Potassium
20|Ca|Calcium
22|Ti|Titanium
24|Cr|Chromium
25|Mn|Manganese
26|Fe|Iron
27|Co|Cobalt
28|Ni|Nickel
29|Cu|Copper
30|Zn|Zinc
31|Ga|Gallium
33|As|Arsenic
34|Se|Selenium
35|Br|Bromine
36|Kr|Krypton
38|Sr|Strontium
47|Ag|Silver
48|Cd|Cadmium
50|Sn|Tin
51|Sb|Antimony
53|I|Iodine
54|Xe|Xenon
56|Ba|Barium
74|W|Tungsten
78|Pt|Platinum
79|Au|Gold
80|Hg|Mercury
82|Pb|Lead
83|Bi|Bismuth
86|Rn|Radon
88|Ra|Radium
92|U|Uranium
94|Pu|Plutonium
""", 3)
COMMON = {"H", "He", "C", "N", "O", "Na", "Fe", "Au", "Ag", "Cu", "Pb", "Hg", "Ne", "Cl", "Ca", "K", "Sn", "Al", "U", "S"}
TRICKY = {"Na": "sodium", "K": "potassium", "Fe": "iron", "Au": "gold", "Ag": "silver", "Pb": "lead", "Hg": "mercury", "Sn": "tin", "W": "tungsten", "Sb": "antimony"}

def build_elements():
    syms = [e[1] for e in ELEMENTS]; names = [e[2] for e in ELEMENTS]; nums = [int(e[0]) for e in ELEMENTS]
    for z, s, n in ELEMENTS:
        z = int(z)
        d = 1 if s in COMMON else 2
        if s in TRICKY: d = 2
        add("SCI", "Chemistry", d, f"What is the chemical symbol for {n.lower()}?", s, pick(syms, s, "sy" + n))
        add("SCI", "Chemistry", d, f"Which element has the chemical symbol {s}?", n, pick(names, n, "nm" + s))
        if z <= 30 or s in ("Au", "Ag", "U", "Hg", "Pb", "Sn"):
            add("SCI", "Chemistry", 2 if z <= 10 else 3, f"Which element has the atomic number {z}?", n, pick(names, n, "z" + str(z)))
            add("SCI", "Chemistry", 3 if z > 10 else 2, f"What is the atomic number of {n.lower()}?", z, near_nums(z, "an" + n, 1, 1))

HAND = """
SCI|Chemistry|1|What is the chemical formula for water?|H2O|CO2|O2|H2O2
SCI|Chemistry|1|What is the chemical formula for table salt?|NaCl|KCl|NaOH|CaCl2
SCI|Chemistry|1|What gas do plants absorb from the air during photosynthesis?|Carbon dioxide|Oxygen|Nitrogen|Hydrogen
SCI|Chemistry|2|What is the most abundant gas in Earth's atmosphere?|Nitrogen|Oxygen|Carbon dioxide|Argon
SCI|Chemistry|2|What is the lightest element?|Hydrogen|Helium|Lithium|Carbon
SCI|Chemistry|2|Which noble gas is used to fill balloons and makes your voice squeaky?|Helium|Neon|Argon|Hydrogen
SCI|Chemistry|2|What is the pH of pure water at room temperature?|7|1|10|14
SCI|Chemistry|2|Which scale measures how acidic or basic a substance is?|pH scale|Richter scale|Kelvin scale|Mohs scale
SCI|Chemistry|3|Which scale ranks mineral hardness from 1 to 10?|Mohs scale|Richter scale|Beaufort scale|Kelvin scale
SCI|Chemistry|2|What is the hardest natural substance on Earth?|Diamond|Quartz|Topaz|Graphite
SCI|Chemistry|2|Diamonds and pencil graphite are both made of which element?|Carbon|Silicon|Sulfur|Boron
SCI|Chemistry|2|Which metal is liquid at room temperature?|Mercury|Lead|Tin|Zinc
SCI|Chemistry|2|Rust is the common name for which compound's formation on iron?|Iron oxide|Iron sulfide|Iron chloride|Iron carbonate
SCI|Chemistry|2|What is dry ice?|Solid carbon dioxide|Frozen water|Solid nitrogen|Frozen ammonia
SCI|Chemistry|2|What is the chemical formula for carbon dioxide?|CO2|CO|C2O|CH4
SCI|Chemistry|2|What is the main component of natural gas?|Methane|Propane|Butane|Ethane
SCI|Chemistry|2|What is the chemical name for baking soda?|Sodium bicarbonate|Sodium chloride|Calcium carbonate|Potassium nitrate
SCI|Chemistry|3|Which element is the main component of stainless steel besides iron?|Chromium|Aluminum|Copper|Tin
SCI|Chemistry|3|Which two elements make up the alloy bronze?|Copper and tin|Copper and zinc|Iron and carbon|Tin and lead
SCI|Chemistry|3|Which two elements make up the alloy brass?|Copper and zinc|Copper and tin|Iron and nickel|Silver and tin
SCI|Chemistry|2|What is the term for a substance made of only one type of atom?|Element|Compound|Mixture|Molecule
SCI|Chemistry|2|What state of matter has a definite volume but takes the shape of its container?|Liquid|Solid|Gas|Plasma
SCI|Chemistry|2|What is the process of a solid turning directly into a gas?|Sublimation|Evaporation|Condensation|Deposition
SCI|Chemistry|2|At what temperature in degrees Celsius does water boil at sea level?|100|90|212|120
SCI|Chemistry|2|At what temperature in degrees Fahrenheit does water freeze?|32|0|212|-32
SCI|Chemistry|3|What is absolute zero in degrees Celsius?|-273.15|-459.67|-100|-373.15
SCI|Chemistry|2|What is the name for positively charged particles in an atom's nucleus?|Protons|Neutrons|Electrons|Quarks
SCI|Chemistry|2|Which subatomic particle has a negative charge?|Electron|Proton|Neutron|Positron
SCI|Chemistry|3|What are atoms of the same element with different numbers of neutrons called?|Isotopes|Ions|Isomers|Allotropes
SCI|Chemistry|3|Who created the first widely accepted periodic table in 1869?|Dmitri Mendeleev|Marie Curie|Antoine Lavoisier|John Dalton
SCI|Chemistry|2|What gas makes soda fizzy?|Carbon dioxide|Nitrogen|Oxygen|Helium
SCI|Chemistry|2|Which acid is found in lemons and oranges?|Citric acid|Acetic acid|Lactic acid|Malic acid
SCI|Chemistry|2|Which acid is found in vinegar?|Acetic acid|Citric acid|Sulfuric acid|Formic acid
SCI|Chemistry|3|What is the most abundant element in the universe?|Hydrogen|Helium|Oxygen|Carbon
SCI|Chemistry|3|What is the most abundant element in Earth's crust?|Oxygen|Silicon|Iron|Aluminum
SCI|Physics|1|What force pulls objects toward the center of the Earth?|Gravity|Magnetism|Friction|Inertia
SCI|Physics|2|What is the speed of light in a vacuum, approximately?|300,000 km per second|30,000 km per second|3,000,000 km per second|150,000 km per second
SCI|Physics|2|Who developed the theory of general relativity?|Albert Einstein|Isaac Newton|Niels Bohr|Galileo Galilei
SCI|Physics|2|Who formulated the three laws of motion?|Isaac Newton|Albert Einstein|Johannes Kepler|Michael Faraday
SCI|Physics|2|What is the unit of electrical resistance?|Ohm|Volt|Watt|Ampere
SCI|Physics|2|What is the unit of electric current?|Ampere|Volt|Ohm|Joule
SCI|Physics|2|What is the unit of power?|Watt|Joule|Newton|Pascal
SCI|Physics|2|What is the unit of force?|Newton|Joule|Pascal|Watt
SCI|Physics|2|What is the unit of frequency?|Hertz|Decibel|Tesla|Farad
SCI|Physics|3|What is the SI unit of magnetic flux density?|Tesla|Gauss|Weber|Henry
SCI|Physics|2|What is the unit used to measure the loudness of sound?|Decibel|Hertz|Watt|Lumen
SCI|Physics|2|What type of energy does a moving object have?|Kinetic energy|Potential energy|Thermal energy|Chemical energy
SCI|Physics|2|What type of energy is stored in a stretched rubber band?|Potential energy|Kinetic energy|Nuclear energy|Sound energy
SCI|Physics|3|What is the equation for mass-energy equivalence?|E = mc²|F = ma|V = IR|PV = nRT
SCI|Physics|3|Which law states that for every action there is an equal and opposite reaction?|Newton's third law|Newton's first law|Newton's second law|Law of gravitation
SCI|Physics|2|What does a Geiger counter measure?|Radiation|Temperature|Wind speed|Air pressure
SCI|Physics|2|Which color of visible light has the longest wavelength?|Red|Violet|Green|Blue
SCI|Physics|2|What is the term for bending of light as it passes from one medium to another?|Refraction|Reflection|Diffraction|Absorption
SCI|Physics|2|What is the name of the phenomenon that causes a rainbow to separate colors?|Dispersion|Reflection|Convection|Fusion
SCI|Physics|2|What instrument measures atmospheric pressure?|Barometer|Thermometer|Anemometer|Hygrometer
SCI|Physics|2|What instrument measures wind speed?|Anemometer|Barometer|Seismograph|Hygrometer
SCI|Physics|2|What instrument records earthquakes?|Seismograph|Barometer|Odometer|Altimeter
SCI|Physics|3|What is the SI base unit of mass?|Kilogram|Gram|Newton|Pound
SCI|Physics|2|What is the term for resistance to a change in motion?|Inertia|Momentum|Friction|Velocity
SCI|Physics|3|What type of wave is sound?|Longitudinal wave|Transverse wave|Electromagnetic wave|Surface wave
SCI|Physics|3|Which particle is the carrier of the electromagnetic force?|Photon|Gluon|Electron|Neutrino
SCI|Physics|3|What is the name of the particle often called the "God particle"?|Higgs boson|Neutrino|Quark|Muon
SCI|Physics|3|Where is the Large Hadron Collider located?|Near Geneva, on the France–Switzerland border|Near Chicago|Near Tokyo|Near Munich
SCI|Physics|2|What is the process that powers the Sun?|Nuclear fusion|Nuclear fission|Combustion|Chemical reaction
SCI|Physics|2|What is the process of splitting atoms called?|Nuclear fission|Nuclear fusion|Radioactive decay|Ionization
SCI|Physics|2|Which scientist is known for the theory of evolution by natural selection?|Charles Darwin|Gregor Mendel|Louis Pasteur|Alfred Wegener
SCI|Physics|2|Which scientist discovered radioactivity and won two Nobel Prizes in different sciences?|Marie Curie|Rosalind Franklin|Lise Meitner|Dorothy Hodgkin
SCI|Physics|3|Who discovered penicillin in 1928?|Alexander Fleming|Louis Pasteur|Joseph Lister|Jonas Salk
SCI|Physics|3|Who discovered the electron in 1897?|J.J. Thomson|Ernest Rutherford|Niels Bohr|James Chadwick
SCI|Physics|2|Which scientist is known for discovering that the Earth orbits the Sun, challenging the geocentric model, in 1543?|Nicolaus Copernicus|Galileo Galilei|Johannes Kepler|Tycho Brahe
SCI|Space|1|Which planet is known as the Red Planet?|Mars|Venus|Mercury|Jupiter
SCI|Space|1|Which is the largest planet in our solar system?|Jupiter|Saturn|Neptune|Uranus
SCI|Space|1|Which planet is closest to the Sun?|Mercury|Venus|Mars|Earth
SCI|Space|1|Which planet is known for its prominent rings?|Saturn|Jupiter|Uranus|Neptune
SCI|Space|2|Which planet rotates on its side, with an axial tilt of about 98 degrees?|Uranus|Neptune|Saturn|Jupiter
SCI|Space|2|Which planet is the hottest in our solar system?|Venus|Mercury|Mars|Jupiter
SCI|Space|2|What is the name of Earth's only natural satellite?|The Moon|Luna Two|Phobos|Titan
SCI|Space|2|What is the name of Mars's largest moon?|Phobos|Deimos|Europa|Titan
SCI|Space|2|Which moon of Jupiter is the largest in the solar system?|Ganymede|Europa|Io|Callisto
SCI|Space|3|Which moon of Saturn is the second largest in the solar system and has a thick atmosphere?|Titan|Enceladus|Rhea|Mimas
SCI|Space|2|What is the name of the galaxy that contains our solar system?|Milky Way|Andromeda|Whirlpool|Triangulum
SCI|Space|2|What is the nearest star to Earth, other than the Sun?|Proxima Centauri|Sirius|Betelgeuse|Alpha Andromedae
SCI|Space|2|What was the first artificial satellite launched into orbit?|Sputnik 1|Explorer 1|Vostok 1|Telstar
SCI|Space|2|Who was the first human in space?|Yuri Gagarin|Alan Shepard|John Glenn|Neil Armstrong
SCI|Space|1|Who was the first person to walk on the Moon?|Neil Armstrong|Buzz Aldrin|Alan Shepard|John Glenn
SCI|Space|2|Which Apollo mission first landed humans on the Moon?|Apollo 11|Apollo 8|Apollo 13|Apollo 17
SCI|Space|2|Which Apollo mission was famously nearly lost to an oxygen tank explosion?|Apollo 13|Apollo 1|Apollo 11|Apollo 15
SCI|Space|2|What was the name of the first American woman in space?|Sally Ride|Mae Jemison|Christa McAuliffe|Judith Resnik
SCI|Space|3|Who was the first African American woman in space?|Mae Jemison|Sally Ride|Guion Bluford|Ellen Ochoa
SCI|Space|2|What is the name of NASA's rover that landed on Mars in 2021?|Perseverance|Curiosity|Opportunity|Spirit
SCI|Space|2|What telescope launched in 1990 and orbits Earth?|Hubble Space Telescope|James Webb Space Telescope|Kepler|Spitzer
SCI|Space|2|What is the name of the telescope launched in December 2021 that observes in infrared?|James Webb Space Telescope|Hubble|Chandra|TESS
SCI|Space|2|What planet is known as Earth's "sister planet" because of its similar size?|Venus|Mars|Mercury|Neptune
SCI|Space|2|How many planets are in our solar system?|8|9|7|10
SCI|Space|2|Pluto was reclassified in 2006 as what type of object?|Dwarf planet|Asteroid|Comet|Moon
SCI|Space|3|What is the name of the belt between Mars and Jupiter?|Asteroid belt|Kuiper belt|Van Allen belt|Oort cloud
SCI|Space|3|Halley's Comet returns to Earth's skies about every how many years?|76|50|100|200
SCI|Space|2|What is the name of the boundary around a black hole beyond which nothing can escape?|Event horizon|Singularity|Photosphere|Corona
SCI|Space|2|What do we call a star that has exploded at the end of its life?|Supernova|Nova|Quasar|Pulsar
SCI|Space|2|What is the center of our solar system?|The Sun|Jupiter|The Milky Way|The asteroid belt
SCI|Space|3|About how long does it take light from the Sun to reach Earth?|About 8 minutes|About 8 seconds|About 8 hours|About 1 minute
SCI|Space|2|What is the name of the space station currently orbiting Earth that is a joint international project?|International Space Station|Mir|Skylab|Tiangong-1
SCI|Space|2|What is the name of the first space shuttle to fly in space?|Columbia|Challenger|Discovery|Atlantis
SCI|Space|3|Which space shuttle disintegrated on re-entry in 2003?|Columbia|Challenger|Discovery|Endeavour
SCI|Space|2|What phenomenon occurs when the Moon passes between the Sun and Earth?|Solar eclipse|Lunar eclipse|Transit|Equinox
SCI|Space|2|What causes the tides on Earth?|The Moon's gravity|The Sun's heat|Earth's rotation only|Ocean currents
SCI|Space|2|How long does it take Earth to orbit the Sun?|About 365 days|About 30 days|About 24 hours|About 7 days
SCI|Space|2|What is the term for the point in Earth's orbit closest to the Sun?|Perihelion|Aphelion|Apogee|Perigee
SCI|Earth|1|What type of rock is formed from cooled lava or magma?|Igneous|Sedimentary|Metamorphic|Fossil
SCI|Earth|2|What type of rock is formed by layers of sediment pressed together?|Sedimentary|Igneous|Metamorphic|Volcanic
SCI|Earth|2|Limestone changes into which metamorphic rock under heat and pressure?|Marble|Slate|Granite|Gneiss
SCI|Earth|2|What is the outermost layer of the Earth called?|Crust|Mantle|Outer core|Inner core
SCI|Earth|2|What is the Earth's inner core primarily made of?|Iron and nickel|Silicon|Granite|Magma
SCI|Earth|2|What is the scale used to measure earthquake magnitude, now commonly the moment magnitude scale, originally called?|Richter scale|Beaufort scale|Mohs scale|Fujita scale
SCI|Earth|2|What scale measures tornado intensity?|Enhanced Fujita scale|Saffir-Simpson scale|Richter scale|Beaufort scale
SCI|Earth|2|What scale measures hurricane strength?|Saffir-Simpson scale|Fujita scale|Richter scale|Kelvin scale
SCI|Earth|2|What is the name of the supercontinent that existed about 300 million years ago?|Pangaea|Gondwana|Laurasia|Rodinia
SCI|Earth|2|What is the term for the theory that Earth's crust is divided into moving slabs?|Plate tectonics|Continental drift only|Isostasy|Subduction
SCI|Earth|2|What is the layer of the atmosphere closest to Earth where weather occurs?|Troposphere|Stratosphere|Mesosphere|Thermosphere
SCI|Earth|2|In which layer of the atmosphere is the ozone layer found?|Stratosphere|Troposphere|Mesosphere|Exosphere
SCI|Earth|2|What type of cloud is tall, dark and associated with thunderstorms?|Cumulonimbus|Cirrus|Stratus|Altocumulus
SCI|Earth|2|What are thin, wispy high-altitude clouds called?|Cirrus|Cumulus|Stratus|Nimbus
SCI|Earth|3|What is the name for the boundary between two air masses of different temperatures?|Front|Jet stream|Isobar|Gradient
SCI|Earth|2|What is the term for a measure of how much water vapor is in the air?|Humidity|Dew point|Barometric pressure|Visibility
SCI|Earth|2|What is lightning followed by in a thunderstorm?|Thunder|Hail|Rainbow|Fog
SCI|Earth|3|What is the name for a long period of unusually dry weather?|Drought|Monsoon|El Niño|Blizzard
SCI|Earth|2|Which ocean current phenomenon warms the Pacific and disrupts weather worldwide?|El Niño|La Niña|Gulf Stream|Monsoon
SCI|Earth|2|What gas in the atmosphere is mostly responsible for trapping heat as part of the greenhouse effect, produced by burning fossil fuels?|Carbon dioxide|Argon|Helium|Neon
SCI|Earth|2|Which type of energy comes from the heat inside the Earth?|Geothermal|Solar|Hydroelectric|Wind
SCI|Earth|2|What is the name of the fossil fuel formed from ancient plants in swamps?|Coal|Natural gas|Uranium|Biodiesel
SCI|Earth|2|What is the name of the boundary where the Pacific Plate meets surrounding plates, known for volcanic and earthquake activity?|Ring of Fire|Great Rift|Mid-Atlantic Ridge|Pacific Rim
SCI|Biology|1|What is the powerhouse of the cell?|Mitochondria|Nucleus|Ribosome|Chloroplast
SCI|Biology|1|What is the basic unit of life?|Cell|Atom|Tissue|Organ
SCI|Biology|2|What molecule carries genetic information in cells?|DNA|ATP|RNA only|Glucose
SCI|Biology|2|What shape is the DNA molecule?|Double helix|Single strand|Triple helix|Spiral staircase of three sides
SCI|Biology|2|Who proposed the double helix model of DNA in 1953, along with Francis Crick?|James Watson|Gregor Mendel|Linus Pauling|Rosalind Franklin
SCI|Biology|2|What process do plants use to make food from sunlight?|Photosynthesis|Respiration|Fermentation|Digestion
SCI|Biology|2|What pigment makes plants green?|Chlorophyll|Carotene|Melanin|Xanthophyll
SCI|Biology|2|Who is known as the father of modern genetics for his pea plant experiments?|Gregor Mendel|Charles Darwin|Louis Pasteur|Francis Crick
SCI|Biology|3|What organelle is responsible for protein synthesis?|Ribosome|Lysosome|Golgi apparatus|Vacuole
SCI|Biology|3|What is the term for an organism that makes its own food?|Autotroph|Heterotroph|Decomposer|Parasite
SCI|Biology|2|What is the study of living things called?|Biology|Geology|Chemistry|Physics
SCI|Biology|2|What are the four bases found in DNA?|A, T, G, C|A, U, G, C|A, T, G, U|A, B, C, D
SCI|Biology|2|How many chromosomes are in a typical human cell?|46|23|44|48
SCI|Biology|2|What is the name of the process by which cells divide into two identical cells?|Mitosis|Meiosis|Osmosis|Diffusion
SCI|Biology|3|What is the term for water moving across a semipermeable membrane?|Osmosis|Diffusion|Transpiration|Filtration
SCI|Biology|2|What are the three main parts of a plant cell not found in animal cells?|Cell wall, chloroplasts, large vacuole|Nucleus, ribosomes, membrane|Mitochondria, lysosomes, cytoplasm|Centrioles, flagella, cilia
SCI|Biology|2|Which blood type is known as the universal donor?|O negative|AB positive|A positive|B negative
SCI|Biology|2|Which blood type is known as the universal recipient?|AB positive|O negative|A negative|B positive
SCI|Biology|2|What vitamin does the body produce when exposed to sunlight?|Vitamin D|Vitamin C|Vitamin A|Vitamin K
SCI|Biology|2|What vitamin is found in citrus fruits and prevents scurvy?|Vitamin C|Vitamin D|Vitamin B12|Vitamin A
SCI|Biology|2|What are the building blocks of proteins?|Amino acids|Fatty acids|Nucleotides|Sugars
SCI|Biology|3|What type of organism is yeast?|Fungus|Bacterium|Virus|Protozoan
SCI|Biology|2|Which scientist is credited with developing the first successful polio vaccine?|Jonas Salk|Louis Pasteur|Edward Jenner|Alexander Fleming
SCI|Biology|2|Which scientist developed the first smallpox vaccine?|Edward Jenner|Jonas Salk|Louis Pasteur|Robert Koch
SCI|Biology|2|Which scientist created the rabies vaccine and the process of pasteurization?|Louis Pasteur|Robert Hooke|Joseph Lister|Gregor Mendel
SCI|Body|1|How many bones are in the adult human body?|206|186|256|300
SCI|Body|1|What is the largest organ of the human body?|Skin|Liver|Brain|Heart
SCI|Body|1|What is the human body's largest internal organ?|Liver|Heart|Stomach|Lungs
SCI|Body|1|How many chambers does the human heart have?|4|2|3|5
SCI|Body|2|What is the longest bone in the human body?|Femur|Tibia|Humerus|Fibula
SCI|Body|2|What is the smallest bone in the human body?|Stapes|Hammer|Anvil|Hyoid
SCI|Body|2|Which organ produces insulin?|Pancreas|Liver|Kidney|Stomach
SCI|Body|2|Which blood cells carry oxygen?|Red blood cells|White blood cells|Platelets|Plasma
SCI|Body|2|Which blood cells help fight infection?|White blood cells|Red blood cells|Platelets|Hemoglobin
SCI|Body|2|What is the medical term for the voice box?|Larynx|Pharynx|Trachea|Esophagus
SCI|Body|2|What is the name of the muscle that separates the chest from the abdomen and helps breathing?|Diaphragm|Pectoralis|Trapezius|Abdominis
SCI|Body|2|What part of the eye controls the amount of light entering it?|Iris|Cornea|Retina|Lens
SCI|Body|2|What is the clear front surface of the eye called?|Cornea|Pupil|Sclera|Retina
SCI|Body|2|What part of the brain controls balance and coordination?|Cerebellum|Cerebrum|Brain stem|Hippocampus
SCI|Body|3|What part of the brain is most associated with forming new memories?|Hippocampus|Amygdala|Thalamus|Cerebellum
SCI|Body|2|What are the three bones of the middle ear called collectively?|Ossicles|Phalanges|Carpals|Vertebrae
SCI|Body|2|How many teeth does a typical adult human have?|32|28|30|36
SCI|Body|2|Where in the body is the thyroid gland located?|Neck|Abdomen|Chest|Skull
SCI|Body|2|What is the normal resting human body temperature in Fahrenheit?|98.6|96.8|100.4|99.9
SCI|Body|2|What is the hardest substance in the human body?|Tooth enamel|Bone|Cartilage|Nail
SCI|Body|2|Which part of the digestive system absorbs most nutrients?|Small intestine|Large intestine|Stomach|Esophagus
SCI|Body|2|What is the name for the body's system of tubes that carry blood?|Circulatory system|Lymphatic system|Respiratory system|Nervous system
SCI|Body|3|What are the tiny air sacs in the lungs where gas exchange occurs?|Alveoli|Bronchi|Capillaries|Villi
SCI|Body|2|What is the common name for the patella?|Kneecap|Collarbone|Shoulder blade|Breastbone
SCI|Body|2|What is the common name for the clavicle?|Collarbone|Kneecap|Shoulder blade|Tailbone
SCI|Body|2|What is the common name for the scapula?|Shoulder blade|Collarbone|Kneecap|Jawbone
SCI|Body|2|What is the common name for the sternum?|Breastbone|Tailbone|Collarbone|Rib
SCI|Body|2|What organ filters blood and produces urine?|Kidneys|Liver|Bladder|Spleen
SCI|Body|2|How many pairs of ribs does a typical human have?|12|10|14|8
SCI|Math|1|What is the value of pi rounded to two decimal places?|3.14|3.16|3.41|3.12
SCI|Math|1|What is the square root of 144?|12|14|16|10
SCI|Math|2|What is the sum of the interior angles of a triangle?|180 degrees|90 degrees|270 degrees|360 degrees
SCI|Math|2|How many sides does a hexagon have?|6|5|7|8
SCI|Math|2|How many sides does an octagon have?|8|6|10|9
SCI|Math|2|What is the name for a polygon with 10 sides?|Decagon|Nonagon|Dodecagon|Heptagon
SCI|Math|2|What is the Roman numeral for 50?|L|C|D|X
SCI|Math|2|What is the Roman numeral for 1,000?|M|D|C|L
SCI|Math|2|What is 15% of 200?|30|15|20|25
SCI|Math|3|What is the next number in the Fibonacci sequence: 1, 1, 2, 3, 5, 8, ...?|13|11|12|15
SCI|Math|2|What is the only even prime number?|2|0|4|6
SCI|Math|2|What is the name for a number that can only be divided by 1 and itself?|Prime number|Composite number|Even number|Perfect number
SCI|Math|3|What is the Pythagorean theorem?|a² + b² = c²|a + b = c|a² - b² = c²|a × b = c²
SCI|Math|2|How many degrees are in a circle?|360|180|270|400
SCI|Math|2|What is the name of the longest side of a right triangle?|Hypotenuse|Leg|Base|Altitude
SCI|Math|3|What is the name of a shape with four equal sides and no right angles?|Rhombus|Square|Rectangle|Trapezoid
SCI|Math|2|What is 7 times 8?|56|54|48|63
SCI|Math|3|What is 12 squared?|144|124|132|154
SCI|Math|3|What is 2 to the power of 10?|1,024|512|2,048|1,000
SCI|Math|3|What is the name for the number 10 to the 100th power?|Googol|Googolplex|Trillion|Centillion
SCI|Math|2|What is the mathematical term for the middle value in a set of ordered numbers?|Median|Mean|Mode|Range
SCI|Math|2|What is the mathematical term for the most frequent value in a set?|Mode|Median|Mean|Range
SCI|Math|3|Who is the Greek mathematician known as the "father of geometry"?|Euclid|Pythagoras|Archimedes|Thales
SCI|Math|3|Which Greek scholar is said to have shouted "Eureka!" in his bath?|Archimedes|Euclid|Aristotle|Socrates
SCI|Math|2|How many zeros are in one million?|6|5|7|9
SCI|Math|2|How many zeros are in one billion?|9|6|8|12
SCI|Math|3|What is the term for a triangle with all three sides equal?|Equilateral|Isosceles|Scalene|Right
SCI|Math|3|What is the term for a triangle with no equal sides?|Scalene|Isosceles|Equilateral|Obtuse
SCI|Math|2|What is the perimeter of a square with sides of 5 units?|20|25|10|15
SCI|Math|2|What is the area of a rectangle that is 6 units wide and 4 units tall?|24|20|10|48
SCI|Math|3|What is the value of 5 factorial (5!)?|120|25|60|720
SCI|Math|3|What is the binary number 1010 in decimal?|10|8|12|5
SCI|Math|2|What do we call the number that appears most in the equation's denominator position of a fraction?|Denominator|Numerator|Quotient|Divisor
SCI|Math|1|What is half of one quarter?|One eighth|One half|One sixth|One third
"""

def build():
    build_elements(); parse_hand(HAND)
