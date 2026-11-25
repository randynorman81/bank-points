from lib import *

BABIES = table("""
kangaroo|joey
koala|joey
cow|calf
whale|calf
elephant|calf
giraffe|calf
hippopotamus|calf
horse|foal
zebra|foal
donkey|foal
sheep|lamb
goat|kid
pig|piglet
duck|duckling
swan|cygnet
goose|gosling
deer|fawn
bear|cub
lion|cub
tiger|cub
fox|kit
rabbit|kit
beaver|kit
ferret|kit
frog|tadpole
seal|pup
bat|pup
otter|pup
wolf|pup
shark|pup
owl|owlet
eagle|eaglet
turkey|poult
hare|leveret
llama|cria
alpaca|cria
peacock|peachick
pigeon|squab
hedgehog|hoglet
platypus|puggle
cat|kitten
dog|puppy
chicken|chick
penguin|chick
salmon|fry
eel|elver
""", 2)
BABY_EASY = {"cow", "horse", "sheep", "pig", "cat", "dog", "bear", "lion", "duck", "kangaroo", "chicken", "goat", "deer", "frog"}

GROUPS = table("""
crows|murder
lions|pride
owls|parliament
ravens|unkindness
flamingos|flamboyance
giraffes|tower
zebras|dazzle
hippos|bloat
jellyfish|smack
whales|pod
wolves|pack
fish|school
cattle|herd
sharks|shiver
ferrets|business
porcupines|prickle
hyenas|cackle
kangaroos|mob
butterflies|kaleidoscope
peacocks|muster
rhinos|crash
starlings|murmuration
bats|colony
leopards|leap
otters|romp
badgers|cete
foxes|skulk
monkeys|troop
turtles|bale
cats|clowder
geese|gaggle
bees|swarm
""", 2)

CLASSES = table("""
bat|mammal
dolphin|mammal
whale|mammal
platypus|mammal
penguin|bird
ostrich|bird
kiwi|bird
Komodo dragon|reptile
crocodile|reptile
tortoise|reptile
gecko|reptile
frog|amphibian
salamander|amphibian
newt|amphibian
shark|fish
seahorse|fish
clownfish|fish
spider|arachnid
scorpion|arachnid
tick|arachnid
ant|insect
butterfly|insect
beetle|insect
dragonfly|insect
octopus|mollusk
snail|mollusk
squid|mollusk
lobster|crustacean
crab|crustacean
shrimp|crustacean
""", 2)

FOODS = table("""
koala|eucalyptus leaves
giant panda|bamboo
anteater|ants and termites
hummingbird|nectar
vampire bat|blood
manatee|seagrass
blue whale|krill
giraffe|acacia leaves
sloth|leaves
pelican|fish
walrus|clams and mollusks
cow|grass
rabbit|plants and vegetables
polar bear|seals
bald eagle|fish
silkworm|mulberry leaves
monarch caterpillar|milkweed
aardvark|termites
sea otter|sea urchins and shellfish
flamingo|shrimp and algae
""", 2)

NATIVE = table("""
kangaroo|Australia
koala|Australia
Tasmanian devil|Australia
emu|Australia
giant panda|Asia
Bengal tiger|Asia
orangutan|Asia
Komodo dragon|Asia
gorilla|Africa
lion|Africa
meerkat|Africa
zebra|Africa
cheetah|Africa
llama|South America
jaguar|South America
anaconda|South America
capybara|South America
bison|North America
bald eagle|North America
polar bear|North America
lemur|Madagascar
emperor penguin|Antarctica
kiwi|New Zealand
""", 2)

def build():
    babies = [b[1] for b in BABIES]
    for a, b in BABIES:
        add("NAT", "Animal Babies", 1 if a in BABY_EASY else 2, f"What is a baby {a} called?", b, pick(babies, b, "bb" + a))
    groups = [g[1] for g in GROUPS]
    for a, g in GROUPS:
        add("NAT", "Animal Groups", 2 if a in ("lions", "whales", "wolves", "fish", "cattle", "geese", "bees", "owls", "crows") else 3,
            f"What is a group of {a} called?", g, pick(groups, g, "gp" + a))
        add("NAT", "Animal Groups", 3, f"A \"{g}\" describes a group of which animal?", a, pick([x[0] for x in GROUPS], a, "rgp" + a))
    cls = ["mammal", "bird", "reptile", "amphibian", "fish", "insect", "arachnid"]
    for a, c in CLASSES:
        pool = cls + ["mollusk", "crustacean"] if c in ("mollusk", "crustacean") else cls
        add("NAT", "Animal Classes", 2, f"Which group of animals does the {a} belong to?", c, pick(pool, c, "cl" + a))
    foods = [f[1] for f in FOODS]
    for a, f in FOODS:
        add("NAT", "Animal Diets", 2, f"What is the main food of the {a}?", f, pick(foods, f, "fd" + a))
    regs = ["Australia", "Africa", "Asia", "South America", "North America", "Madagascar", "Antarctica", "New Zealand"]
    for a, r in NATIVE:
        add("NAT", "Animal Homes", 2, f"The {a} is native to which part of the world?", r, pick(regs, r, "nv" + a))
    parse_hand(HAND)

HAND = """
NAT|Records|1|What is the fastest land animal?|Cheetah|Lion|Pronghorn antelope|Greyhound
NAT|Records|1|What is the largest animal on Earth?|Blue whale|African elephant|Whale shark|Giraffe
NAT|Records|1|What is the tallest animal in the world?|Giraffe|Elephant|Ostrich|Camel
NAT|Records|2|What is the largest land animal?|African elephant|White rhino|Hippopotamus|Giraffe
NAT|Records|2|What is the largest species of fish?|Whale shark|Great white shark|Basking shark|Manta ray
NAT|Records|2|What is the fastest bird in a dive?|Peregrine falcon|Golden eagle|Swift|Bald eagle
NAT|Records|2|What is the largest living bird?|Ostrich|Emu|Albatross|Condor
NAT|Records|2|What is the largest reptile in the world?|Saltwater crocodile|Komodo dragon|Green anaconda|Leatherback turtle
NAT|Records|2|What is the largest living species of lizard?|Komodo dragon|Green iguana|Nile monitor|Gila monster
NAT|Records|2|What is the largest species of bear?|Polar bear|Grizzly bear|Kodiak bear|Brown bear
NAT|Records|2|Which animal has the longest lifespan of any mammal?|Bowhead whale|African elephant|Human|Blue whale
NAT|Records|3|What is the only mammal capable of true sustained flight?|Bat|Flying squirrel|Sugar glider|Colugo
NAT|Records|3|Which bird can fly backward?|Hummingbird|Sparrow|Swallow|Owl
NAT|Records|2|What is the largest cat species?|Tiger|Lion|Jaguar|Leopard
NAT|Records|2|What is the slowest-moving mammal?|Sloth|Koala|Tortoise|Armadillo
NAT|Records|2|Which animal has the loudest call of any land animal?|Howler monkey|Lion|Elephant|Hyena
NAT|Records|3|Which sea creature has three hearts?|Octopus|Jellyfish|Starfish|Dolphin
NAT|Records|3|Which animal has the highest blood pressure?|Giraffe|Elephant|Blue whale|Cheetah
NAT|Records|2|Which animal sleeps the most, up to 20 hours a day?|Koala|Cat|Sloth|Bat
NAT|Records|2|What is the only continent with no native reptiles or snakes?|Antarctica|Australia|Europe|Greenland
NAT|Facts|1|What animal is known as the "king of the jungle"?|Lion|Tiger|Elephant|Gorilla
NAT|Facts|1|How many legs does a spider have?|8|6|10|4
NAT|Facts|1|How many legs does an insect have?|6|8|4|10
NAT|Facts|2|What is the only bird that cannot fly but is known for swimming in Antarctica?|Penguin|Ostrich|Emu|Kiwi
NAT|Facts|2|What do bees collect to make honey?|Nectar|Pollen only|Sap|Water
NAT|Facts|2|What are the black-and-white stripes on a zebra thought to help with?|Deterring biting flies|Hiding from lions at night|Reflecting rain|Attracting mates only
NAT|Facts|2|What do camels store in their humps?|Fat|Water|Air|Muscle
NAT|Facts|2|What is the only mammal that lays eggs, along with the echidna?|Platypus|Armadillo|Opossum|Pangolin
NAT|Facts|2|What does a chameleon do to change color?|Adjusts nanocrystals in its skin cells|Absorbs food dye|Sheds layers of scales|Tilts toward the sun
NAT|Facts|3|What is the term for animals that are active at night?|Nocturnal|Diurnal|Crepuscular|Dormant
NAT|Facts|3|What is the term for animals that are active at dawn and dusk?|Crepuscular|Nocturnal|Diurnal|Aestivating
NAT|Facts|2|What is the process called when an animal hibernates through summer heat instead of winter cold?|Estivation|Migration|Torpor|Molting
NAT|Facts|2|What is the name for animals that eat both plants and meat?|Omnivores|Herbivores|Carnivores|Insectivores
NAT|Facts|2|What is the name for an animal that only eats meat?|Carnivore|Herbivore|Omnivore|Frugivore
NAT|Facts|2|Which animal can regrow its tail after losing it to a predator?|Lizard|Snake|Frog|Mouse
NAT|Facts|2|Which animal produces the most milk per day?|Dairy cow|Goat|Sheep|Buffalo
NAT|Facts|2|What is a male chicken called?|Rooster|Cob|Drake|Tom
NAT|Facts|2|What is a female horse called?|Mare|Filly|Dam only|Stallion
NAT|Facts|3|What is a young female horse under four years old called?|Filly|Mare|Colt|Foal
NAT|Facts|2|What is a male swan called?|Cob|Pen|Drake|Jack
NAT|Facts|2|What is a female deer called?|Doe|Buck|Hind|Stag
NAT|Facts|2|What is a female fox called?|Vixen|Doe|Jenny|Sow
NAT|Facts|2|What is a male duck called?|Drake|Cob|Gander|Tom
NAT|Facts|2|What is a male goose called?|Gander|Tom|Drake|Cob
NAT|Facts|2|What type of animal is a Gila monster?|Lizard|Snake|Frog|Turtle
NAT|Facts|2|What animal's milk is used to make traditional mozzarella di bufala?|Water buffalo|Cow|Goat|Sheep
NAT|Facts|2|What cheese is traditionally made from sheep's milk and aged in caves in Roquefort, France?|Roquefort|Brie|Camembert|Gruyère
NAT|Facts|2|What insect is known for building colonies with a queen and drones?|Honeybee|Mosquito|Fly|Beetle
NAT|Facts|2|What is the name for the stage between caterpillar and butterfly?|Chrysalis|Larva|Nymph|Egg
NAT|Facts|2|What gas do trees release during photosynthesis?|Oxygen|Carbon dioxide|Nitrogen|Methane
NAT|Facts|2|How many hearts does an earthworm have?|5 pairs of aortic arches (hearts)|1|2|3
NAT|Facts|2|What do dolphins use to navigate and find food?|Echolocation|Magnetism|Sonar from their fins|Smell
NAT|Facts|3|What are baby sea turtles called when they hatch?|Hatchlings|Calves|Pups|Fry
NAT|Facts|1|What color is a polar bear's skin?|Black|White|Pink|Gray
NAT|Facts|2|What is the national bird of the United States?|Bald eagle|Wild turkey|Red-tailed hawk|Osprey
NAT|Facts|2|Which animal did Benjamin Franklin famously suggest as the national bird?|Wild turkey|Golden eagle|Mockingbird|Cardinal
NAT|Facts|2|What is the name of a snake that is not venomous and squeezes its prey?|Constrictor|Viper|Cobra|Mamba
NAT|Facts|2|What is the most venomous snake family?|Elapids|Boas|Pythons|Colubrids
NAT|Facts|3|What is the largest species of snake by weight?|Green anaconda|Reticulated python|King cobra|Burmese python
NAT|Facts|2|Which animal is the mascot of the Georgia Bulldogs? (Uga is what breed of dog?)|English bulldog|Boxer|Mastiff|Pug
NAT|Dinosaurs|1|Which dinosaur is often called the "king of the tyrant lizards"?|Tyrannosaurus rex|Velociraptor|Stegosaurus|Allosaurus
NAT|Dinosaurs|2|Which dinosaur had three horns and a large bony frill?|Triceratops|Stegosaurus|Ankylosaurus|Brachiosaurus
NAT|Dinosaurs|2|Which dinosaur had large plates along its back and spikes on its tail?|Stegosaurus|Triceratops|Spinosaurus|Diplodocus
NAT|Dinosaurs|2|About how long ago did the non-avian dinosaurs go extinct?|66 million years ago|6 million years ago|250 million years ago|1 million years ago
NAT|Dinosaurs|3|Which period are the dinosaurs most associated with, along with Triassic and Cretaceous?|Jurassic|Cambrian|Devonian|Permian
NAT|Dinosaurs|3|What do we call scientists who study fossils and ancient life?|Paleontologists|Archaeologists|Geologists|Anthropologists
NAT|Dinosaurs|3|Which large predator was bigger than T. rex and is thought to have been semiaquatic?|Spinosaurus|Allosaurus|Giganotosaurus|Carnotaurus
NAT|Dinosaurs|2|Which prehistoric mammal with large tusks and thick fur lived during the Ice Age?|Woolly mammoth|Saber-toothed cat|Giant sloth|Mastodon
NAT|Plants|1|What do we call plants that lose their leaves in autumn?|Deciduous|Evergreen|Perennial|Annual
NAT|Plants|2|What is the tallest type of tree in the world?|Coast redwood|Giant sequoia|Douglas fir|Eucalyptus
NAT|Plants|2|Which tree produces acorns?|Oak|Maple|Pine|Birch
NAT|Plants|2|What kind of tree has "winged" seeds called samaras that spin like helicopters?|Maple|Oak|Pine|Cedar
NAT|Plants|2|Which flower is the national symbol of Japan, famous for its spring blossoms?|Cherry blossom|Lotus|Orchid|Chrysanthemum
NAT|Plants|2|Which plant is the main ingredient in making tequila?|Blue agave|Cactus|Sugarcane|Corn
NAT|Plants|2|Which plant does the panda eat almost exclusively?|Bamboo|Eucalyptus|Sugarcane|Moss
NAT|Plants|2|What is the world's largest flower, famous for smelling like rotting meat?|Rafflesia|Sunflower|Lotus|Titan arum
NAT|Plants|2|Which plant family includes the tomato, potato and eggplant?|Nightshade|Mint|Gourd|Mustard
NAT|Plants|2|Which fruit is also known as the "love apple" in some old texts?|Tomato|Pomegranate|Apple|Peach
NAT|Plants|2|What is the process by which plants lose water vapor through their leaves?|Transpiration|Respiration|Photosynthesis|Germination
NAT|Plants|3|What type of plant is a Venus flytrap?|Carnivorous plant|Parasitic plant|Succulent|Orchid
NAT|Plants|2|What part of the plant carries water up from the roots?|Xylem|Phloem|Stomata|Pistil
NAT|Plants|2|Which flower's name comes from the Greek word for "rainbow"?|Iris|Tulip|Daisy|Rose
NAT|Plants|2|What flower is associated with the Netherlands?|Tulip|Rose|Lily|Daffodil
NAT|Plants|2|What is the state flower of Georgia?|Cherokee rose|Magnolia|Peach blossom|Dogwood
NAT|Plants|2|Sequoias are native primarily to which U.S. state?|California|Oregon|Washington|Georgia
NAT|Environment|2|What is the term for the variety of life in a particular habitat?|Biodiversity|Ecosystem|Biome|Population
NAT|Environment|2|What is the largest rainforest in the world?|Amazon rainforest|Congo rainforest|Daintree Rainforest|Borneo rainforest
NAT|Environment|2|What is the term for an animal that hunts other animals?|Predator|Scavenger|Decomposer|Producer
NAT|Environment|2|What is the name for the process of becoming dormant in winter?|Hibernation|Migration|Molting|Metamorphosis
NAT|Environment|2|What is the term for organisms that break down dead plants and animals?|Decomposers|Producers|Predators|Herbivores
NAT|Environment|2|What is the largest coral reef system in the world?|Great Barrier Reef|Belize Barrier Reef|Red Sea reef|Florida Reef Tract
NAT|Environment|2|What is the term for the long-term average of weather in an area?|Climate|Season|Forecast|Humidity
NAT|Environment|2|Which bird migrates the farthest, flying from the Arctic to the Antarctic?|Arctic tern|Albatross|Canada goose|Swallow
NAT|Environment|2|Which animal is the symbol of the World Wildlife Fund?|Giant panda|Tiger|Elephant|Polar bear
NAT|Environment|2|Which insect pollinators are most associated with honey production?|Bees|Wasps|Moths|Beetles
"""
