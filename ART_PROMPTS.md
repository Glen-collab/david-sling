# Art prompts for GPT

Copy-paste prompts for the **8 world maps** and **8 bosses**.
How to use: paste the **Style block** first, then the prompt you want, in the same message. Same style block every time, so all the art matches.

Bosses for worlds 3–7 are **proposals** (see DESIGN.md §6). Draw them anyway if you like them. They're easy to swap.

---

## Style block (paste this first, every time)

```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing cartoon characters
with expressive faces and soft warm lighting. NOT pixel art. Bright, readable, cheerful but
not cartoon-silly; clear silhouettes that read well small. Setting: ancient Israel around 1000 BC (Judah, Iron Age): limestone hills,
olive trees, dry grass, stone sheepfolds, clay-brick villages.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
```
**The look is smooth Pixar-style characters, like the unicorn game.** Upload a frame from David's walk clip with every David request. **For animations, use Grok video**: see [VIDEO_SPRITES.md](VIDEO_SPRITES.md). These still-image prompts are for concept art, maps and one-off poses. (Map and background style may change to SNES-style later.)

### Extra lines for every **map** prompt
```
Format: one complete overworld map screen laid out like the Super Mario Bros. 3
world maps. Seen from above at a slight tilt. Wide landscape, 16:9.
A winding dotted path connects round "level dots" (plain empty circles) and a few small
landmark buildings. No characters on the map.
```

### Extra lines for every **boss** prompt
```
Format: a single game sprite, full body, seen from the side, FACING LEFT, standing on
nothing. Solid flat bright green background (#00FF00) everywhere around it: no checkerboard,
no floor, no shadow on the ground, no scenery, no text or numbers.
```
Green is on purpose: the converter removes it cleanly, the same way as in the video clips. A fake checkerboard can't be removed that way.

---

## World maps

### World 1 — The Shepherd's Fields
```
The hill country of Bethlehem at golden late afternoon. Rolling golden-green grass hills,
olive trees, low dry-stone walls, flocks of white sheep as tiny dots in the distance.
Top-left: a small walled village of clay-brick houses on a hill (Bethlehem) with one
house nearest the path having a stone sheepfold beside it. Along the path: a small
campfire with a stone ring; a big rock with a goat standing on top; a hidden green
meadow with wildflowers tucked behind trees (slightly off the path). The path ends
bottom-right at a dark cave mouth in a rocky outcrop, with two small glowing yellow eyes
inside it. Mood: peaceful, warm, a hint of danger at the cave.
```

### World 2 — The Wilderness
```
The wilderness of Judah in summer. Left side: green wooded hills of oak and pine. Middle:
a wide, dry, rocky riverbed (a wadi) winding through tan and ochre ravines, with scattered
boulders and dead trees, and dark rain clouds gathering far away in the hills. Right: tall
pale desert cliffs with a thin waterfall falling into a small green spring pool with palm
trees. End of the path (bottom-right): a dark wooded ravine with a stone sheep pen at its
mouth and big claw marks on a tree. A small tent camp with stone pens at the start of the
path, and a campfire near the riverbed. Mood: wild, hot and dry, rugged.
```

### World 3 — The Anointing
```
Bethlehem on its hill on a festival day, seen from above. Pale limestone and clay-brick
houses with flat roofs packed close together, narrow lanes, a stone watchtower with an
outside stair, a few round thatched huts, rooftops with figs and grain drying on them.
Golden barley fields and a round stone threshing floor on the slope below town.
The path, in order:
1. Bottom-left: Jesse's farmhouse with a stone sheepfold and an olive tree (the start).
2. Up into the town lanes and across the rooftops (first level dot).
3. Out of town, far away across open green-gold hills to a lonely pasture with a small
   campfire, a stream with stepping stones, and tiny white sheep dots. From here you can
   see the town far off on its hill (second level dot).
4. A fast path back toward town through fields with low stone walls and wooden fences
   (third level dot).
5. Just outside the town gate, on a small rise: a stone altar with a thin line of white
   smoke going straight up, and a glow of warm golden light around it. A special
   story spot, not a level dot: a small golden star circle instead of a plain one.
   Beside the gate, an old stone well (a small extra spot).
6. The path leaves town again into wide open grassland under dark grey storm clouds,
   with rain falling far off and a muddy trampled track (last level dot). At the very
   end, a big boulder cracked down the middle, and huge hoof prints in the mud.
Mood: warm, golden and sacred around the town and the altar; open and peaceful at the
far pasture; stormy and wild at the end.
```
Five plain level dots in all (Jesse's house, then the four stages), plus the golden star at the altar and the small well spot. When the picture comes in, the dots get placed on it in `map.js` (World 3 borrows World 1's map until then).

### World 4 — The King's Court (one message, ready to paste)
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft warm lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC (Judah and Benjamin, Iron Age): limestone hills, olive trees,
vineyards, clay-brick villages.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: one complete overworld map screen laid out like the Super Mario Bros. 3 world maps. Seen from
above at a slight tilt. Wide landscape, 16:9. A winding dotted path connects round "level dots" (plain
empty circles) and a few small landmark buildings. No characters on the map.

World 4: the road north from Bethlehem to King Saul's hilltop fortress at Gibeah, on a bright clear
morning that grows heavier and more shadowed toward the end. The path, in order:
1. Bottom-left: the stone gate of Bethlehem, small, pale limestone (the start).
2. A long road winding north through green vineyards on terraced hillsides, with low stone terrace
   walls and small villages (first level dot). Far off to one side, NOT on the path: a walled city on
   its own hill with tall pale walls and towers (Jebus, the city that will one day be Jerusalem).
3. Beside the road in the vineyards: a small round stone watchtower with a little hut (a landmark spot).
4. Up the big hill to Gibeah: outside the fortress walls, a dusty training yard with wooden targets,
   straw dummies and a low practice wall (second level dot).
5. Against the fortress wall: a low stone kitchen building with a warm glowing fire in its doorway
   and smoke rising (a landmark spot).
6. Inside the walls: the town of Gibeah, crowded flat roofs, a well, and a market with colorful cloth
   awnings (third level dot).
7. Tucked slightly off the path: a small hidden rooftop garden with potted plants and vines (a small
   extra spot).
8. At the very top: King Saul's great hall, a big rough-stone building with heavy wooden doors and
   deep red and royal purple banners (no symbols on them). It is darker than everything else, with
   storm clouds gathering over it and one warm lamp-lit doorway (the last level dot).
Rough-stone fortress walls with wooden gates and a few soldiers' tents outside them.
Mood: bright and hopeful on the road and in the vineyards; grand, a little heavy and shadowed up at
the fortress; the king's hall the darkest place on the map.
```
Four plain level dots (4-1 to 4-4), plus the Bethlehem gate, the vineyard watchtower, the kitchen fire and the hidden
garden. **Save as** `david-sling-art\world 4 map.png`.

### World 5 — The Road to the Valley
```
A long dusty road through dry brown hills heading west, with a donkey cart track, a
crumbling watchtower, a mountain trail along a cliff edge, and a narrow pass between two
high rocks. In the far distance at the right edge, a green valley opens up with two
camps of tents on opposite hillsides. Wheel ruts from a chariot cut across the road.
Mood: travel, adventure, growing tension.
```

### World 6 — The Valley of Elah
```
A wide valley with a dry streambed of smooth grey stones winding down the middle.
On the left hillside: the Israelite camp of brown and tan tents. On the right hillside:
the Philistine camp of different-colored tents (blues and dark reds) with a tall wooden
siege tower near its edge. Oak and terebinth trees along the valley floor. Mood: two armies
facing each other, tense, early morning light.
```

### World 7 — The Giant's Shadow
```
The same valley from World 6 but closer and more dramatic: late afternoon, long dark
shadows stretching across the ground. Israelite camp on the left with the king's larger
tent; the dry streambed in the middle glittering with smooth stones; the Philistine battle
line on the right as rows of tiny shields and spear points. A huge dark shadow of a giant
figure falls across the valley floor from the right edge (the giant himself is NOT shown).
Mood: dread, but with a warm light still on the streambed.
```

### World 8 — David and Goliath
```
The open floor of the Valley of Elah, between the two armies. Left hill: Israelite soldiers
as tiny figures watching. Right hill: Philistine soldiers as tiny figures watching. The
path is short and goes straight down the middle of the valley to one single open space
of flat ground marked by a ring of stones. Dramatic sky with sun breaking through clouds
onto that open ground. Mood: the final showdown, quiet before the battle.
```

---

## Bosses

### World 1 — The Lion
```
An Asiatic lion (the lion species that lived in ancient Israel: lean, sandy-gold coat,
a shorter and scruffier mane than an African lion, a fold of skin along its belly).
Powerful, crouched low as if about to pounce, tail raised with a dark tuft, mouth
open in a snarl showing fangs. Menacing but not gory. Size: about as long as two
grown men are tall.
```
Ask for these poses too (one image each, same lion): **crouched to pounce**, **mid-pounce in the air**, **paw raised to swipe**, **head thrown back roaring**, **dazed with stars around its head**, **running away with a small white lamb held gently in its mouth**.

### World 2 — The Bear
```
A Syrian brown bear (the bear that lived in ancient Israel: pale golden-brown fur,
lighter than a grizzly, with a hump of muscle on the shoulders and long claws). Huge,
heavy, standing up on its hind legs with front paws raised, mouth open in a roar.
Angry, powerful, slow-looking. Not gory.
```
Poses: **on all fours walking**, **charging on all fours**, **standing tall and roaring**, **slamming both front paws down on the ground**, **picking up a boulder to throw**, **dazed and sitting down**.

### World 3 — The Wild Ox *(proposed)*
```
An aurochs, the giant wild ox of the ancient world: much bigger than a farm cow, nearly
black coat with a pale stripe down its back, enormous forward-curving horns. Head down,
nostrils flaring, one hoof pawing the ground, ready to charge. Rain dripping off it.
```
Poses: **pawing the ground**, **charging head-down**, **horns stuck in a tree**, **shaking its head, dazed**.

### World 4 — Saul's Torment *(proposed; the only boss fought with music)*
```
King Saul of Israel seated on a heavy wooden throne in a dim stone hall: an older,
very tall, strong man with a dark beard, a simple gold circlet crown and a deep red
robe, holding his head in both hands in distress. Swirling dark purple-black shadow
shapes rise and twist around the throne like smoke. The shadows are abstract (like
storm clouds), NOT monsters or demons, no faces. Saul is a sad, troubled man, not a villain.
```
Also ask for: **the shadows alone, as 3 separate small smoke-shapes** (these are what you dodge), and **Saul calm and peaceful, the shadows gone** (the victory pose).

### World 5 — The Philistine Chariot *(proposed)*
```
A Philistine war chariot from about 1000 BC: a light two-wheeled wooden chariot with
six-spoked wheels, pulled by two horses at full gallop. Two Philistine warriors ride in it:
the driver holding the reins, and an archer drawing a bow. They wear the Philistine
"feathered" headdress (a band with a row of upright reeds or feathers) and short kilts,
with round shields hung on the side of the chariot.
```
Poses: **galloping**, **archer firing**, **one wheel broken and wobbling**, **chariot stopped, horses rearing**.

### World 6 — The Philistine Watchtower *(proposed)*
```
A tall wooden siege tower on four heavy wooden wheels, three floors high, built of rough
planks and lashed logs, with open windows on each floor. Philistine archers and slingers
in feathered headdresses lean out of the windows. A wide leather-covered front, rope
ladders hanging down the side, a small flag (no symbol) on top.
```
Ask also for: **a single Philistine archer**, **a single Philistine slinger** (small sprites), and **the tower damaged with a broken plank and leaning**.

### World 7 — Goliath's Shield-Bearer *(proposed; he's in 1 Samuel 17:7)*
```
A big, broad, heavily muscled Philistine soldier (the giant's shield-bearer) carrying an
enormous rectangular body shield almost as tall as he is, made of wood covered in
leather and rimmed with bronze. Bronze helmet, short kilt, bare arms with leather wrist
guards. He walks forward behind the shield like a moving wall. Big and tough, but
clearly a normal (if very large) man, smaller than a giant.
```
Poses: **walking behind the shield**, **slamming the shield down into the ground**, **peeking over the top**, **shield knocked aside, off balance**.

### World 8 — Goliath
Goliath is described in detail in **1 Samuel 17:4–7**, so the art should match the text:
```
Goliath of Gath, the Philistine champion: a giant warrior about twice as tall as a normal
man. Bronze helmet; a coat of bronze scale armor (overlapping small bronze plates) down
to his thighs; bronze greaves (shin guards) on his legs; a bronze javelin slung across his
back; and a massive spear in his hand with a thick wooden shaft as wide as a weaver's beam
and a heavy iron spearhead. Thick black beard, scowling, arrogant, confident. Not a
monster: a huge, terrifying human soldier. Standing tall, spear planted, looking down.
```
Poses: **standing tall, laughing / taunting**, **thrusting the spear forward**, **slamming the spear butt into the ground (shockwave)**, **throwing the javelin**, **helmet tilted back while he roars (his forehead open)**, **falling forward**.

---

## Creatures (small sprites)
Use the style block + the boss extra lines, then one of these. Dangerous/harmless pairs should be generated **in the same request** so they're drawn to the same scale and clearly different.

```
Pair 1: Left, a Palestine viper: thick body, wide triangular head, tan with a dark
zigzag stripe, coiled and puffed up, ready to strike. Right, a whip snake: long, very
slim, plain dark grey-black, small narrow head, stretched out sliding along. Same scale.
```
```
Pair 2: Left, a yellow scorpion: pale yellow, tail curled high with the stinger raised.
Right, a hedgehog: small, round, brown spines, cute face, walking. Same scale.
```
```
Pair 3: Left, a hornet nest: grey papery ball hanging from a branch, a few angry hornets.
Right, a honeybee hive in a hollow tree trunk: golden honeycomb visible, a few bees. Same scale.
```
```
A grey wolf, side view facing left, mid-run. Separately: the same wolf yelping and
running away.
```
```
A golden jackal, small and thin, sandy coat, side view facing left, running with a
small white lamb held gently in its mouth (not hurt).
```
```
A red fox, side view facing left, running low.
```
```
A large eagle diving, wings swept back, talons out, side view facing left.
```
```
A striped hyena (pale grey with dark stripes, sloped back, big ears), side view
facing left, head low, mouth open as if laughing.
```
```
An Arabian leopard, pale golden with dark rosettes, crouched on a tree branch, looking
down, side view facing left.
```
```
A white sheep lying stuck on its back with its legs in the air, looking helpless
("cast sheep"). Separately: the same sheep standing normally.
```
```
A rock hyrax (small, round, brown, like a guinea pig) sitting on a rock. A Nubian ibex
(wild goat with long curved ridged horns) standing on a ledge. A spur-thighed tortoise.
```

## Background layers (for the side-scrolling stages)
The game draws the background in **3 layers** that slide at different speeds as David runs (far moves slowest), which gives depth. Make each layer as its own image.

**Paste with every layer:** the style block, plus:
```
Format: a very wide side-scrolling game background, about 3 times wider than tall
(for example 3072 x 1024). Seen straight from the side, no perspective tilt. The left and
right edges must match so the image can repeat seamlessly. No characters, no animals,
no text.
```

### Layer 1: far (sky and distant hills). Full picture, no green.
```
World 1, the hills of Bethlehem in golden late afternoon. A soft blue sky fading to warm
gold near the horizon, a few gentle clouds. Along the bottom third: far-away pale tan and
lavender hills, very soft and hazy. On one hill, small and far away, the walled village of
Bethlehem with flat-roofed clay houses.
```

### Layer 2: middle (rolling hills with trees). Sky must be solid green.
```
World 1 middle distance: rolling golden-green hills covering the bottom half, dotted with
olive trees, a few date palms, low dry-stone walls and tiny white sheep far away. Slightly
hazy and softer than the foreground. EVERYTHING above the hills is solid flat bright green
(#00FF00), no sky, no clouds.
```

### Layer 3: near (foreground edge). Everything above it solid green.
```
World 1 foreground strip: the bottom quarter only, tall dry grass, wildflowers, small
rocks and a few thorn bushes, in full bright colour and sharp. EVERYTHING above it is
solid flat bright green (#00FF00).
```

**The green is on purpose:** I remove it so the layers stack on top of each other. Swap the description for other worlds: the wilderness ravines and cliffs (World 2), Bethlehem's rooftops (World 3), Gibeah's fortress (World 4), and so on (see the world map prompts above for each setting).

**Night versions** (1-4, the lion's territory): the same three prompts with "moonlit night, deep blue sky, stars, silver moonlight".

## World 2 stage backgrounds (one set of three layers per stage)
**World 2 uses MAGENTA (#FF00FF) instead of green** for the middle and near layers: the woods are full of green leaves, and a green key would eat them. Paste the style block first, then this, then the layer:
```
Format: a very wide side-scrolling game background, about 3 times wider than tall (for
example 3072 x 1024). Seen straight from the side, no perspective tilt. The left and right
edges must match so the image can repeat seamlessly. No characters, no animals, no text.
```

### 2-1 The Forest Trail (morning)
- **Far:** `World 2, the wilderness hills of Judah in fresh early morning light. A pale clear sky with soft pink and gold near the horizon. Along the bottom half: far-away wooded ridges of oak and pine, layer behind layer, misty blue-green and hazy, with pale limestone showing on the slopes.`
- **Middle:** `World 2 middle distance: steep hillsides covered in oak and pine trees, mossy limestone boulders, a few fallen logs, shafts of morning sunlight through the trees. Softer and a little hazy compared with the foreground. EVERYTHING above the treetops is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 2 foreground strip, the bottom quarter only: ferns, tree roots, pine needles, mossy stones and the trunks of two or three big oaks rising out of frame, full colour and sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`

### 2-2 The Dry Riverbed (hot midday)
- **Far:** `World 2, the Judean wilderness at hot midday. A wide pale-blue sky, bleached near the horizon, with dark grey storm clouds gathering far away on the left and faint rain falling from them onto distant hills. Along the bottom half: bare tan and ochre desert hills, very hazy.`
- **Middle:** `World 2 middle distance: the steep sandy-orange banks of a dry wadi (riverbed), layered rock walls, a few scrubby acacia trees and pink-flowered oleander bushes along the banks, dried mud cracked in the sun. EVERYTHING above the banks is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 2 foreground strip, the bottom quarter only: smooth round river stones, pebbles, dry driftwood and sun-bleached reeds, full colour and sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`

### 2-3 The High Cliffs (afternoon)
- **Far:** `World 2, high above the Judean wilderness in clear afternoon light. A deep blue sky with a few high white clouds. Along the bottom third: a vast view down over hazy tan desert canyons, and far in the distance a thin silver line of the Dead Sea with pale mountains beyond.`
- **Middle:** `World 2 middle distance: tall golden-tan limestone cliffs with ledges and caves, a tall white waterfall pouring down into a green spring pool fringed with palms and reeds, ibex-shaped dark crevices in the rock. EVERYTHING above the cliff tops is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 2 foreground strip, the bottom quarter only: rough cliff-edge rocks, wind-bent desert shrubs and a few tufts of dry grass, full colour and sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`

### 2-4 The Bear's Ravine (dusk)
- **Far:** `World 2, a deep wooded ravine at dusk. A sky glowing deep orange and purple, the first stars appearing at the top. Along the bottom half: dark silhouetted ridges of oak and pine, deep blue-purple shadow.`
- **Middle:** `World 2 middle distance at dusk: the steep sides of a dark ravine, twisted oaks and pines, big tree trunks with deep claw marks, a broken fallen tree, overturned rocks, long blue shadows with the last orange light on the treetops. EVERYTHING above the ravine edge is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 2 foreground strip at dusk, the bottom quarter only: dark tangled roots, torn-up logs, ferns and stones in deep shadow with a little orange rim light, sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`

**Save as** `david-sling-art\2-1 far.png`, `2-1 mid.png`, `2-1 near.png`, and the same for 2-2, 2-3, 2-4.

## World 3 stage backgrounds (one set of three layers per stage)
Same format as World 2 (paste the style block, then the format lines above, then the layer). **Green (#00FF00) is fine
again** for 3-1 and 3-3 (town: tan brick, little green). Use **magenta (#FF00FF)** for 3-2 and 3-4 (grassy hills).

### 3-1 The Day Before (Bethlehem, warm morning)
- **Far:** `World 3, the hill country around Bethlehem on a warm clear morning. A soft blue sky with a few white clouds. Along the bottom half: terraced hills with olive groves and golden barley fields, very hazy.`
- **Middle:** `World 3 middle distance: the village of Bethlehem seen from the side, a row of clay-brick and limestone houses with flat roofs, wooden ladders leaning on walls, laundry and drying figs on the roofs, a stone granary, a round stone threshing floor with barley piled on it, date palms. EVERYTHING above the rooftops is solid flat bright green (#00FF00), no sky.`
- **Near:** `World 3 foreground strip, the bottom quarter only: a dusty village lane, clay water jars, baskets of barley, a low stone wall and a few chickens' feathers, full colour and sharp. EVERYTHING above it is solid flat bright green (#00FF00).`

### 3-2 The Far Pasture (bright midday, lonely)
- **Far:** `World 3, wide open hills far from town at bright midday. A big blue sky. Along the bottom half, small and far away on the right: Bethlehem on its hilltop, with a crowd of tiny people gathered on the hill outside the town and a thin line of smoke rising from an altar.`
- **Middle:** `World 3 middle distance: long empty grassy hills with scattered boulders, a few lone oak trees and a stream winding between them. Peaceful and a little lonely. EVERYTHING above the hills is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 3 foreground strip, the bottom quarter only: long grass, wildflowers, thistles and flat stones, full colour and sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`

### 3-3 We Will Not Sit Down (afternoon, the run back to town)
- **Far:** `World 3, golden afternoon. A warm sky. Along the bottom half: Bethlehem on its hill getting closer, festive, with banners of cloth and a crowd at the town gate.`
- **Middle:** `World 3 middle distance: barley fields with wooden fences and dry-stone walls, an olive grove, the town wall of Bethlehem with its gate and the first flat-roofed houses rising behind it. EVERYTHING above it is solid flat bright magenta (#FF00FF), no sky.`
- **Near:** `World 3 foreground strip, the bottom quarter only: barley stalks, fence posts, stones and a dusty path, full colour and sharp. EVERYTHING above it is solid flat bright magenta (#FF00FF).`
  (3-3 switched to magenta: the fields and olive trees are green, and a green key would eat them.)

### 3-4 The Chosen Shepherd (the storm): one message per layer, ready to paste
The game adds its own darkness, rain and lightning flashes on top, so these layers stay **readable, not black**, and the
middle and near layers have **no painted rain streaks** (they'd double up with the game's rain). The big oaks you fight
around are game pieces (below), so the oaks in the middle layer stay small and far back.

**Far:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country of Judah near Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 3, a storm rolling over open grassy hills in the late afternoon. Heavy towering storm
clouds in dark slate blue and grey fill the sky, lit from inside in places, with one thin
band of pale gold light breaking through low near the horizon. Far away, grey curtains of rain
hang from the clouds onto the distant hills. Along the bottom half: dark rolling hills of
wind-flattened grass, layer behind layer, cooler and hazier the farther they are. Moody and
dramatic but still clear and readable, not black.
```

**Middle:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country of Judah near Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 3 middle distance in a storm: long grassy slopes with the grass bent hard to one side by
the wind, a few small far-off oak trees leaning in the wind, scattered grey boulders, a low
dry-stone wall running along a hillside, and silver puddles reflecting the stormy light. Cool
blue-grey storm light with dark wet greens. No rain streaks. Softer and a little hazy compared
with the foreground. EVERYTHING above the hills is solid flat bright magenta (#FF00FF), no sky,
no clouds.
```

**Near:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country of Judah near Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 3 foreground strip in a storm, the bottom quarter only: wet flattened grass, dark mud,
small puddles, torn leaves and a few broken oak branches, round wet stones, all glistening in
cool blue storm light, full colour and sharp. No rain streaks. EVERYTHING above it is solid
flat bright magenta (#FF00FF).
```

**Save as** `david-sling-art\3-4 far.png`, `3-4 mid.png`, `3-4 near.png`.

### 3-4 oaks (game pieces that replace the big olive tree stand-in): one message
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country of Judah near Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.

A set of separate side-view game pieces, all the same scale, with plenty of space between them,
on solid flat bright magenta (#FF00FF). Lit by cool blue-grey storm light, bark and leaves wet.
No rain streaks, no ground, no shadows on the background.
1. A huge old Palestine oak tree standing alone: a thick gnarled trunk, a wide spreading crown
   of dark green leaves, a few roots showing at the base.
2. The same oak with a deep gash in its trunk where something big rammed it, bark torn away.
3. The same oak split in half down the middle, one half leaning away, broken branches.
4. A big fallen oak lying on its side, its trunk resting on its own branches and roots so
   there is a low dark hollow underneath it, just big enough for a boy to roll into.
```
**Save as** `david-sling-art\world3\oaks_sheet.png`.

### End of World 3: the storm clears (far layer for the Hanan scene): one message
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country of Judah near Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 3, just after a storm, at sunset. The last dark storm clouds are breaking up and drifting
away at the top, their edges lit gold and pink; below them a clear, washed sky glowing orange
and gold, a faint rainbow on one side. Along the bottom half: wet green hills shining in the
low sun, and on a hill to the right, small and far away, the village of Bethlehem with
flat-roofed houses glowing warm in the sunset. Peaceful, calm and hopeful.
```
**Save as** `david-sling-art\3-4 end far.png` (the 3-4 middle and near layers are reused under it).

**Save as** `david-sling-art\3-1 far.png`, `3-1 mid.png`, `3-1 near.png`, and the same for 3-2, 3-3.

### World 3 pieces (one sheet, side view, on solid magenta #FF00FF)
`A set of separate side-view game pieces with space between them: three flat-roofed clay-brick house fronts of different widths (the flat roof is a walkable ledge), a short wooden ladder, a stone granary with a doorway, a wooden fence section low enough to roll under, a round stone threshing floor, a big old oak tree, the same oak split in half by lightning, and a cut log.`

### World 3 Grok clips (start from a picture, side view facing right, plain green screen, camera still)
- **Samuel:** an old prophet with a long white beard, plain dark robe and a ram's horn of oil. Clips: stand, talk, pour oil (arms raised, tipping the horn). (Glen's `samuel_anointing.mp4` may already cover the pour.)
- **The old widow gleaning:** bent over, picking up barley stalks into her apron; standing and talking.
- **Crow:** Grok's crows look like our raven, which is fine: we can reuse `raven_fly/peck`.
- **Rat:** a brown rat running; sniffing.
- **Stray dog:** a lean tan village dog: run, bark, slink away.
- **Rustler:** a sheep thief in a dark head cloth: sneak (crouched walk), run away.
- **Wild ox (aurochs, boss):** paw the ground, charge head down, stuck with horns in a tree trunk, skid, shake its head, run away.
- **Messenger on horseback** (end of World 3): a rider galloping.

## Big scenes (full-screen art for the ending)
Use the style block, plus: *"Format: one full-screen game scene, wide 16:9, no characters' faces in close-up."*

```
Ending: the hills of Bethlehem at golden sunset. A stone sheepfold with a flock of white sheep
inside. An old shepherd with a white beard leans on a staff at the gate. A young shepherd
boy with a sling at his belt and a small harp on his back stands looking back toward the hills,
seen from behind. Long warm shadows, a few olive trees, the village on its hill in the distance.
```
```
Secret ending: the same hills of Bethlehem at night under a deep blue sky full of stars.
Three shepherds sit around a small campfire beside a stone sheepfold with sleeping sheep.
High above them, the sky is opening with a great soft golden-white light shining down on
them; the shepherds are shielding their eyes. Peaceful and awe-filled, not scary.
```

## Walk and run cycles: make the legs alternate
GPT tends to draw the same leg forward in every frame. Add this to any walk or run request:
```
The legs MUST alternate. Frame 1: right foot forward. Frame 3: legs passing each other.
Frame 5: LEFT foot forward. Frame 7: legs passing again. Arms swing opposite to the legs.
Every frame the same size, feet on the same ground line, evenly spaced in one row.
No frame numbers, no titles.
```

## Items still needed (for the GPT asset sheet)
Use the same white-background asset-sheet style as the food & nature sheet:
- **Pomegranate tree** and **a pomegranate** (one of the seven foods of the land, Deuteronomy 8:8)
- **Barley** (a sheaf, and a few loose heads)
- **A single olive**, green and purple versions (the "coins"), and a **golden olive** (rare, worth an extra life)
- **A small clay oil flask / juglet** (the on-screen flask that fills with olives)
- **Honeybees** and **wasps**, a few flying poses each (or Grok clips, flying in place on green)

## NEXT BATCH (2026-10-08): what the levels need now, in priority order
Upload one of the finished item images (e.g. the olive tree) with each request as the style reference, and add: *"same Pixar-style look as the attached image, side-view game art."*

### 1. Ground, rock, walls and pits (most important). These replace the plain brown blocks.
No bricks anywhere: in David's time walls were **dry-stone** (stacked fieldstones, no mortar) and the land is **limestone**. I build every ground, ledge, wall and pit from these pieces in code, so each texture only has to **tile seamlessly**. Upload the World 1 near-layer grass image (image 7) as the style reference so everything matches. One prompt per image:

```
A) TOPSOIL / GRASS EDGE strip. Side-scrolling game terrain, seen straight from the side.
   A long horizontal strip, 2048 x 256: the top edge of the ground: golden-green pasture
   grass, a few wildflowers, little pebbles, and a thin lip of brown earth along the bottom.
   Seamless: the left edge must match the right edge exactly. Solid flat #00FF00 green
   above the grass. No objects, no text.

B) SEDIMENT / EARTH FILL. 1024 x 1024 square texture, the ground seen from the side as a
   cut-away: packed brown earth in soft layers, small stones, a few roots, warm tones.
   Seamless on ALL FOUR edges (tileable in every direction). Fills the whole image.

C) LIMESTONE ROCK FILL (for rock ledges, cliffs and the blocks you jump over).
   1024 x 1024, pale cream-and-tan Judean limestone seen from the side: natural cracked
   rock faces, weathered layers, a little moss. NOT bricks, NOT cut blocks.
   Seamless on all four edges.

D) LIMESTONE TOP EDGE strip. 2048 x 256: the weathered, rounded top surface of natural
   limestone rock, tufts of dry grass and moss on top. Seamless left-to-right.
   Solid #00FF00 above it.

E) ROCK LEDGE pieces (thin floating shelves you can stand on). One image on #00FF00:
   a natural limestone shelf seen from the side, about as thick as a person's arm: a LEFT
   end (rounded, broken-off rock), a MIDDLE piece that repeats seamlessly, and a RIGHT end.
   The three pieces side by side with a gap between them.

F) DRY-STONE WALL pieces (period-accurate field walls, no mortar). One image on #00FF00:
   a low wall of stacked rough fieldstones seen from the side: a LEFT end (tapered),
   a MIDDLE section that repeats seamlessly, and a RIGHT end. Side by side, with gaps.

G) PIT / CREVICE. One image on #00FF00: a deep crack in the ground seen from the side,
   as a cut-away: rough rock walls on the left and right going down into darkness, getting
   darker and darker to pure black at the bottom. The top edges have a grassy lip.
   Make the left wall and the right wall as separate pieces, side by side with a gap,
   each tall (256 wide x 1024 tall).
```
**Later (World 2):** the same set in **sandstone and dry desert soil** (swap "golden-green pasture grass" for "dry yellow grass and sand", and "pale limestone" for "orange-tan sandstone").

### 2. Background layers (World 1)
Use the three prompts in **Background layers** above (far, middle, near). Make them **3072 x 1024**.

### 3. The sheepfold gate (end of every stage)
```
A low round sheepfold built of stacked fieldstones, seen from the side, with an open gateway
and one TALL wooden gatepost beside the opening (about three times the wall's height, with a
small carved top). Solid #00FF00 background. No sheep, no people.
Separately: the same wooden gate, CLOSED, on its own.
```

### 4. The World 1 map, for the left page of David's journal
```
An illustrated map drawn in ink and soft watercolour on old parchment, like a page in a
traveller's journal. The hills of Bethlehem: the little town on its hill (top left), pasture,
olive trees, a stream, rocky outcrops, a cave with two glowing eyes (bottom right). A dotted
path winds from the town to the cave, passing five small empty circles (the stages) and a few
tiny landmarks (a campfire, a rock with a goat on it, a hidden meadow). Portrait, 2:3, about
1024 x 1536. No text, no labels.
```

### 5. Small items still missing
A single green olive, a single purple olive and a **golden olive** (glowing a little) · a small clay **oil flask** · a **pomegranate** and a **pomegranate tree** · a **barley** sheaf. All on #00FF00.

### 6. People and animals (Grok video, green screen, one clip each)
- **Lost sheep:** walking, grazing, and lying on its back with legs kicking (a cast sheep).
- **Hanan ✦**, an old shepherd in a grey robe with a white beard: standing and talking; sitting by a fire.
- **The neighbor shepherd ✦** (an old man) and **the shepherd girl ✦** with her goat: standing and talking.

### 6b. Jesse's courtyard people (Grok video, green screen)
Make one **reference image** of each person first, then upload it with every clip so they always match. Converter: `python tools/vid2sprite.py <clip> <out> --height 300` (adults stand taller than David's 240).
- **Jesse** (David's father, old, kind, a farmer; long grey-white beard, cream-and-brown wool robe, striped head cloth, rope belt with a sling tucked in). He waits by the bullseye wall and coaches the throw. Clips: `jesse_idle` (standing, breathing, small nod), `jesse_talk` (explaining with one hand, warm), `jesse_point` (points at the target, then at his eye: "watch it"), `jesse_throw` (whirls a sling once and lets go, slowly, like showing a child), `jesse_cheer` (claps once and laughs, proud).
- **The trader** (invented, a cheerful villager who sells olives, oil and fig cakes; Glen picks man or woman). Stands beside the stall. Clips: `trader_idle`, `trader_talk`, `trader_offer` (holds out a small clay oil flask).

### 7. Caves (for later; see DESIGN.md §3j)
- **Grok clip:** *"This exact boy, seen from BEHIND, walking away from the camera into a dark cave mouth, slowly, full body in frame, green background, locked camera."* And the reverse: walking out toward the camera.
- **Grok clip:** a bat flying in place (wings flapping), and a bat hanging upside down, on green.
- **Image:** a small clay oil lamp (an ancient Israelite saucer lamp with a pinched spout and a small flame), on green.
- **Images:** cave interior background layers (far: deep darkness with faint rock shapes; middle: rock columns and drips, on green; near: rocky floor rubble, on green), and a cave floor/wall terrain set (dark damp limestone, same pieces as the World 1 terrain).

### 8. Better dry-stone walls (optional upgrade)
Upload the World 1 middle background (image 6) so the stones match the field walls in it:
```
A low dry-stone field wall, the kind shepherds built around Bethlehem: pale grey-cream
limestone fieldstones of mixed sizes, stacked without mortar, with an UNEVEN, bumpy top line
(a few stones sticking up, one small gap). Tufts of grass and moss growing in the cracks and
around the base, a soft shadow on the ground. Seen straight from the side. Same stones and
colours as the walls in the attached background. Solid #00FF00 background.
Make 3 different walls side by side with gaps: SHORT (about 1.5x as wide as tall),
MEDIUM (3x), and LONG (5x).
```
Three whole walls look less repetitive than a stretched middle piece.

## Tips for getting clean results
- **Ask for one pose per image.** Then put the poses into a sheet yourself in Photoshop, one row per animation (see DESIGN.md §8).
- If a pose comes out a different size, ask GPT: *"same character, same size and same proportions as before, new pose: …"*
- If it adds text or a checkerboard, say *"no text, no numbers, solid #00FF00 green background only."*
- Keep the first good image of each boss as the "reference" and upload it with every later pose request.

## World 4 stage backgrounds (one set of three layers per stage)
Same format as World 3. **Magenta (#FF00FF)** for 4-1's middle and near layers (vineyards: green leaves).

### 4-1 The Road to Gibeah (bright morning, the road north): one message per layer, ready to paste
**Far:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country north of Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 4, a bright fresh morning on the road north. A clear soft blue sky with a few small white
clouds, warm gold near the horizon. Along the bottom half: rolling hills covered in terraced
vineyards and olive groves, layer behind layer, hazy and pale blue-green in the distance. Small
and far away, a little left of center, ONE walled city on its own hill: tall pale stone walls and
square towers catching the morning sun (Jebus). Calm, open and hopeful.
```

**Middle:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country north of Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 4 middle distance: terraced hillsides of grapevines, the vines low and bushy with broad
green leaves and purple grape clusters, held up by low dry-stone terrace walls in rows. A small
round stone watchtower standing in one vineyard, a few clay-brick village houses with flat roofs,
fig and olive trees, and a dusty road curving between the terraces. Morning sunlight. Softer and a
little hazy compared with the foreground. EVERYTHING above the hills is solid flat bright magenta
(#FF00FF), no sky, no clouds.
```

**Near:**
```
Style: a Pixar-style 3D animated movie look: smooth, rounded, appealing, soft lighting. NOT pixel art.
Setting: ancient Israel around 1000 BC, the hill country north of Bethlehem.
No text, no letters, no numbers, no logos, no UI anywhere in the image.
Format: a very wide side-scrolling game background, about 3 times wider than tall (for example
3072 x 1024). Seen straight from the side, no perspective tilt. The left and right edges must
match so the image can repeat seamlessly. No characters, no animals.

World 4 foreground strip, the bottom quarter only: the dusty edge of a country road, a low
dry-stone wall with grapevines spilling over it, broad vine leaves, a few fallen purple grapes,
small stones and tufts of dry grass, full colour and sharp in bright morning light. EVERYTHING
above it is solid flat bright magenta (#FF00FF).
```

**Save as** `david-sling-art\4-1 far.png`, `4-1 mid.png`, `4-1 near.png`.

## 4-1 sprites (one message each; paste the style block first)
Sheets are one row of poses on solid green, like the goat and the climbing strips. **Save in** `david-sling-art\world4\`.

**Donkey with packs, walking** (upload a frame of the World 2 donkey with it, so it's the same animal)
```
A sprite sheet: one row of 6 poses of the same small grey-brown donkey walking to the right, a full walk cycle, seen
straight from the side. Pixar-style 3D, soft lighting. Pale muzzle and belly, long ears, dark stripe down the back, a
short brushy tail. It carries a simple woven saddle blanket with two bulging cloth sacks of bread tied on either side, a
plump leather wineskin strapped on top, and a short rope lead hanging from its halter. Every pose the same size, hooves
on the same line, clear gaps between poses. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Donkey with packs, scared**
```
The same donkey with the same packs, same size and style: one row of 4 poses facing right. Spooked: ears pinned back,
eyes wide, head jerking up, then rearing back on its hind legs with its front hooves up, then landing and backing away.
Clear gaps between poses. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Doves**
```
A sprite sheet of the same small grey rock dove, Pixar-style 3D, soft lighting: soft blue-grey feathers, two dark bars
on each wing, a shimmer of green and purple on the neck, pink feet. Top row: 4 poses walking to the right, head bobbing
forward and back. Bottom row: 4 poses flying to the right, a full wingbeat (wings up, level, down, level). All poses the
same size, clear gaps between them. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Vineyard keeper** (made up: an old farmer whose vines the wild boars are wrecking)
```
A sprite sheet: one row of 6 poses of the same old vineyard keeper, full body, seen from the side, FACING LEFT.
Pixar-style 3D, soft lighting. A sturdy, kind, sunburned old farmer with a short grey beard, a faded striped headcloth,
a rough brown wool tunic with the sleeves rolled up, a leather belt with a small curved pruning knife in it, sandals.
Poses: standing; talking with one hand open; talking and pointing back over his shoulder; shaking his head sadly
(the boars ruined his vines); laughing with relief; waving goodbye. Same size, feet on the same line, clear gaps between
poses. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Wineskin** (one item: the gift that falls off the donkey)
```
A single game item: a plump goatskin wineskin, seen from the side, lying on its side: soft brown leather, stitched
seams, the neck tied shut with a leather cord and a little loop to carry it. Pixar-style 3D, soft lighting. Centered,
filling most of the picture. Background solid flat bright green (#00FF00). No shadow, no text.
```

## 4-3 The Broken String (Gibeah's market): art
**The Steward** (sprite sheet, green): one row of 6 poses, facing left, Pixar-style: the old head servant of Saul's
palace, tall and thin, very old but upright, neat short white beard, kind tired eyes, plain dark-blue wool robe with a
rope belt, a ring of iron keys at his belt, sandals. Poses: standing; talking, one hand open; pointing ahead; hands
folded, listening; shaking his head slowly; a small warm smile. Background #00FF00.

**Backgrounds** (style + format lines as for 4-1; save as 4-3 far/mid/near.png):
- Far: Gibeah in late-afternoon gold: the fortress and towers on the hilltop, flat-roofed houses down the slopes, date
  palms, the hazy hills of Benjamin, a sky turning gold and peach.
- Middle: the market street: stalls with striped red/cream/blue awnings, grain and fig baskets, clay jars, a stone well,
  flat roofs with ladders and laundry, a carpenter's yard with stacked beams. Everything above the rooftops #FF00FF.
- Near: a packed-earth market lane, straw, a dropped fig, stones, a crate, rope, wood shavings. Everything above #FF00FF.

**The three harp things** (one sheet, magenta): a coil of pale gut string; a carved wooden lyre tuning peg; a round lump
of golden beeswax with a honeycomb pattern. They replace the drawn icons as assets/items/quest_string, quest_peg, quest_wax.


## 4-4 The King's Hall + Saul's Torment: art
- **King Saul** (sheet, green, facing left): very tall, dark beard with grey, bronze circlet, deep red robe, purple
  mantle. Poses: seated head in hands (troubled); seated gripping the throne, frightened; seated leaning back, calm;
  asleep in the throne; standing talking kindly; standing, tired warm smile. Throne in the seated poses. Never a villain.
- **Shadow wisps** (4, green): dark indigo storm-smoke with a faint purple glow. NO faces, eyes or claws.
- **Hall lamp** (2, magenta): a clay oil lamp on a tall bronze stand, unlit and lit (4-4's five lost things).
- **Backgrounds** (save 4-4 far/mid/near.png): far = Saul's great hall at night (stone walls, beams, red/purple banners,
  stormy windows with lightning, lamplight, deep shadow); mid = columns, a great staircase, balconies, tapestries, #FF00FF
  above; near = polished stone floor, rug edge, cushion, bronze bowl, reed mats, #FF00FF above.


## World 5 — The Road to the Valley: map and 5-1 art (2026-10-15)
Paste the style block first, as always. Sheets are one row of poses on solid green (#00FF00); single items and
backgrounds' middle/near layers on magenta (#FF00FF). **Save in** `david-sling-art\world5\`.

### World 5 map (one message, ready to paste; add the map lines)
```
World 5: the road west from Bethlehem to the Valley of Elah, on the eve of war. The path, in order:
1. Bottom-left: Jesse's small stone house with a courtyard and a fig tree (the start).
2. A long dusty road west through dry brown hills, olive terraces and dry stone walls, with a crumbling
   round watchtower beside it (first level dot).
3. Beside the road: a family's camp of two small tents and a loaded donkey, as if they left home in a hurry
   (a landmark spot).
4. A narrow trail climbing along a cliff edge into rocky mountains, darker here, with a big moon above
   (second level dot).
5. Just off the trail, a dark cave mouth in the cliff with a faint glow of water inside (a small extra spot).
6. Higher up: a small cave with a warm campfire glowing in its mouth (a landmark spot).
7. A long high ridge with two or three small wooden lookout towers and an unlit signal-fire pile on top
   (third level dot).
8. Off to one side of the ridge: a grove of big spreading terebinth trees (a small extra spot).
9. The road winding down into a wide green valley with a dry streambed of pale stones and chariot wheel
   ruts in the dust (fourth level dot).
10. At the far right: two camps of tents on opposite hillsides facing each other across the valley, brown
    and tan tents on the left hill, blue and dark red tents on the right (the end).
Mood: travel and adventure at the start, growing tension toward the valley; the cliff trail and ridge at
night, the valley at dawn.
```
Four plain level dots (5-1 to 5-4) plus Jesse's house, the family's camp, the cave of the Name, Tobi's fire,
the terebinth grove and the two camps. **Save as** `david-sling-art\world 5 map.png`.

### 5-1 The Supply Road (hot dry afternoon): backgrounds
Use the same Format lines as 4-1 (very wide, about 3072 x 1024, seamless left/right edges, no characters).
**Far:**
```
World 5, a hot hazy afternoon on the road west. A pale dusty sky, white-gold near the horizon, a few thin
streaks of cloud. Along the bottom half: dry brown and tan hills rolling away layer behind layer, a few dark
olive trees, the hills paler and bluer in the distance. Far off on one hill, a thin column of smoke rising
(a village burned by raiders). Lonely, quiet, a little uneasy.
```
**Middle:**
```
World 5 middle distance: dry rocky hillsides with olive terraces held up by low dry-stone walls, sun-bleached
grass, scattered limestone boulders, a crumbling round stone watchtower with its top fallen in, a few
abandoned flat-roofed houses with dark doorways, and a dusty road curving between them. Hot afternoon light.
Softer and a little hazy compared with the foreground. EVERYTHING above the hills is solid flat bright
magenta (#FF00FF), no sky, no clouds.
```
**Near:**
```
World 5 foreground strip, the bottom quarter only: the dusty edge of a dry road with cart ruts, small
stones, tufts of dry yellow grass, a thistle, a dropped broken clay pot, full colour and sharp in hot
afternoon light. EVERYTHING above it is solid flat bright magenta (#FF00FF).
```
**Save as** `5-1 far.png`, `5-1 mid.png`, `5-1 near.png`.

### 5-1 sprites (one message each)
**Philistine raider** (stand-in until then: the thief)
```
A sprite sheet: one row of 6 poses of the same Philistine raider running to the right, a full run cycle,
full body, seen straight from the side. Pixar-style 3D, soft lighting. A lean young man, clean-shaven, a
headband with a short row of upright reeds (the Philistine headdress), a short patterned kilt with a
fringed hem, bare chest with a leather strap across it, a small round shield on his back, sandals. NO
weapon in his hands; he's after livestock and grain. Same size, feet on the same line, clear gaps between
poses. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Raider grabbing and fleeing** (same raider, same size): one row of 6: bending to grab a grain sack;
lifting it onto his shoulder; hit and stumbling, dropping the sack; then 3 poses running away to the LEFT,
arms up, scared. Green background.

**The fleeing father** (made up; facing left)
```
A sprite sheet: one row of 6 poses of the same village father, full body, seen from the side, FACING LEFT.
Pixar-style 3D, soft lighting. About forty, a dusty black beard, a sweat-stained brown headcloth, a plain
undyed wool tunic, a rolled blanket tied across his back, a shepherd's staff, sandals. Worried and
exhausted but kind. Poses: standing; talking with one hand open; pointing back down the road (warning);
shaking his head (turn around!); hands together, thankful; waving goodbye. Same size, feet on the same
line, clear gaps. Background solid flat bright green (#00FF00). No shadows, no text.
```
**Fleeing villagers walking** (two or three people, one sheet each): a mother carrying a bundle and leading
a little girl; an old man with a cane. One row of 6 walking poses each, walking to the LEFT, tired and
hurried. Green background.

**Grain sack** (single item, magenta): a small rough cloth sack of roasted grain, tied at the neck with
cord, a few toasted brown grains spilling out. Pixar-style. Saved as `assets\items\grain_sack`.

**Vulture** (stand-in until then: the eagle): one row of 4 poses of a big griffon vulture gliding to the
right, wings wide, a slow flap; pale ruff, bald pale head. Green background.

### End of World 5: the camp, and the giant (2026-10-16)
Paste the style block first. Sheets on green, save in `david-sling-art\world5\`. Until these come the game uses
stand-ins: Eliab's war gear (greyed) for the commander, the running villagers for the soldiers, and a lookout's shape
for the giant.
- **Tobi's commander** (`commander.png`), 6 poses facing LEFT: a weathered Israelite captain of a thousand, about 50, grey
  beard, a bronze helmet, a leather breastplate over a red-brown tunic, a sword at his belt. Poses: standing; running
  forward, arms out (Tobi's alive!); hugging/gripping someone's shoulders; talking, one hand open; stern, arms crossed;
  laughing with relief.
- **Israelite soldiers running away** (`soldier_run.png`), 6 poses running to the LEFT, a full run cycle, terrified: a
  young soldier in a plain tunic, leather cap, a spear held loosely, a small round shield, looking back over his
  shoulder. (A second sheet with an older bearded soldier makes the crowd look less copied, if you like.)
- **The keeper of the baggage** (`baggage_keeper.png`), 4 poses facing LEFT: a plump older man with a reed list-tally and
  a stylus, a big apron, among sacks: standing; taking a sack; counting on his fingers; nodding.
- **Goliath, in silhouette only** (`goliath_silhouette.png`), 4 poses FACING LEFT, a solid near-black silhouette (no face,
  no colours) of a giant warrior in bronze scale armor and a crested helmet, a huge spear like a weaver's beam (1 Samuel
  17:7), a shield-bearer tiny beside him: 1 standing; 2 shouting, spear raised; 3 pointing across the valley; 4 laughing,
  head back. Background solid flat bright green (#00FF00).

## World 6 — The Valley of Elah: map and 6-1 art (2026-10-18)
Paste the style block first, as always. Sheets are one row of poses on solid green (#00FF00); single items and
backgrounds' middle/near layers on magenta (#FF00FF). **Save in** `david-sling-art\world6\`.
Already in the game and reused: Eliab, Abinadab and Shammah in war gear, the running soldier, Tobi, the commander,
your Philistine silhouettes, vipers, scorpions, the vulture, the hedgehog, sheep.

### World 6 map (one message, ready to paste; add the map lines)
```
World 6: the Valley of Elah, two armies facing each other across a valley. The path, in order:
1. Bottom-left, on the Israelite hillside: a big camp of brown and tan tents, supply wagons, cooking smoke
   (the start).
2. Through the middle of the camp: tents, rope lines, a wooden watch platform (first level dot).
3. At the edge of the camp, above the valley: a few big clay water jars stacked by a path (a landmark spot).
4. Down the slope into the open ground between the armies: rocks and dips for cover, arrows stuck in the
   ground (second level dot).
5. A small campfire behind a big rock on the Israelite side (a landmark spot).
6. The valley floor: a winding streambed of smooth pale stones with a few deep blue pools and reeds
   (third level dot).
7. Off to one side of the streambed: a tiny hidden spring under a terebinth tree, glowing softly (a small
   extra spot).
8. On the right, at the edge of the Philistine side: a tall wooden siege tower on wheels with archers'
   windows, and its long shadow across the stream (fourth level dot).
9. Back up the Israelite hill at the top: one larger tent with a banner, the king's tent (the end).
Far right, on the opposite hillside: the Philistine camp, blue and dark red tents, rows of tiny shields and
spear points. Mood: two armies facing each other, tense, bright hard morning light.
```
Four plain level dots (6-1 to 6-4) plus the camp, the water jars, the brothers' fire, the quiet spring and Saul's
tent. **Save as** `david-sling-art\world 6 map.png`.

### 6-1 The Camp of Fear (bright morning, the Israelite camp): backgrounds
Same Format lines as before (very wide, about 3072 x 1024, seamless left/right edges, no characters).
**Far:**
```
World 6, a bright hard morning in the Valley of Elah. A clear pale blue sky. Along the bottom half: the far side of
the valley, a long brown hillside with the Philistine camp along its top, blue and dark red tents, tiny banners,
smoke rising, a tall wooden siege tower at one edge; the valley floor below it hazy, a pale winding streambed.
Tense and still.
```
**Middle:**
```
World 6 middle distance: the Israelite army camp on a dry hillside, rows of brown and tan goat-hair tents, tethered
donkeys, stacked shields and spears leaning together, cooking fires with thin smoke, a wooden watch platform on
poles, supply carts. Morning light. Softer and a little hazy compared with the foreground. EVERYTHING above the
hills is solid flat bright magenta (#FF00FF), no sky, no clouds.
```
**Near:**
```
World 6 foreground strip, the bottom quarter only: trampled dusty ground of an army camp, tent pegs and ropes, a
dropped water skin, a cooking pot on three stones, dry grass, full colour and sharp in morning light. EVERYTHING
above it is solid flat bright magenta (#FF00FF).
```
**Save as** `6-1 far.png`, `6-1 mid.png`, `6-1 near.png`.

### 6-1 sprites (one message each)
**The frightened soldier** (the lost things of World 6: five per stage; the harp lifts each one)
```
A sprite sheet: one row of 6 poses of the same young Israelite soldier, full body, seen from the side, facing
RIGHT. Pixar-style 3D, soft lighting. About twenty, a short dark beard, a leather cap, a plain brown tunic with a
leather belt, sandals, a spear and a small round shield. Poses: 1 curled up on the ground hugging his knees,
hiding, shaking; 2 peeking up over his arms, scared; 3 listening, his face softening; 4 standing up slowly; 5
picking up his spear and shield, standing tall; 6 a small nod of thanks, ready. Same size, feet on the same line,
clear gaps between poses. Background solid flat bright green (#00FF00). No shadows, no text.
```
A second sheet with an older soldier (grey beard, bald under the cap) makes the five look less copied, if you like.
Then one row of 6 **walking back to his post** to the right, spear on his shoulder, for both.

**Soldiers at the cooking fire** (the opening scene: "Forty days." "Nobody's going to do it.")
```
A sprite sheet: one row of 4 poses of an Israelite soldier sitting on a rock by a fire, seen from the side, facing
RIGHT. Pixar-style 3D. Tired and gloomy, a leather cap, a brown tunic, his spear leaning beside him. Poses: sitting,
staring at the fire; talking, one hand open; shaking his head; looking up at someone, surprised. Same size, clear
gaps. Background solid flat bright green (#00FF00). No shadows, no text.
```
Two or three different men if you can (one bearded, one young, one old), the same 4 poses each.

**Eliab, angry** (same Eliab in war gear as in the game now, facing LEFT): one row of 4 poses: red-faced, pointing at
someone; both hands thrown up; jabbing a finger back up the hill ("those few sheep"); turning away and stomping off.
Green background.

**Camp pieces** (single items, magenta; save to `world6\`): a goat-hair army tent seen from the side (David can
bounce on its roof); a wooden supply wagon with sacks and jars; a stack of shields and spears leaning together; a
big clay water jar; a wooden watch platform on poles with a ladder.

### World 6: five different frightened soldiers (2026-10-18)
One sheet per man, the same 6 poses, so each hidden soldier in a stage looks like his own person. Save as
`world6\soldier_fear_1.png` ... `soldier_fear_5.png`, and a walk sheet for each as `soldier_walk_1.png` ...
**The prompt (paste the style block first, then this, then ONE of the five men below):**
```
A sprite sheet: one row of 6 poses of the same Israelite soldier from about 1000 BC, full body, seen straight from
the side, facing RIGHT. Pixar-style 3D animation, soft warm lighting. He has been frightened for forty days by a
giant's shouting. Poses, left to right: 1 curled up on the ground hugging his knees, head down, shaking; 2 peeking
up over his arms, scared; 3 still sitting, listening to music, his face softening; 4 getting up on one knee; 5
standing tall, spear upright in one hand and his small round shield on the other arm, brave again; 6 a small nod of
thanks, smiling a little. Same size in every pose, feet on the same line, clear gaps between poses, nothing
overlapping. Background solid flat bright green (#00FF00). No shadows on the ground, no text, no other people.
```
**The five men (add one at the end):**
1. `A young soldier about eighteen, thin, no beard yet, curly black hair under a leather cap, a plain undyed tunic, a
   rope belt, bare feet.`
2. `A big broad-shouldered soldier about thirty, a thick black beard, a bald head with a dark headband, a brown tunic
   with a leather belt, sandals, a heavy spear.`
3. `An old soldier about fifty-five, a long grey beard, a lined kind face, a faded blue headcloth, a long tan tunic,
   a worn leather jerkin, sandals.`
4. `A short stocky soldier about twenty-five, a short reddish-brown beard, a round leather helmet, a rust-red tunic,
   leather bands on his wrists, sandals, a sling tucked in his belt as well as his spear.`
5. `A tall lanky soldier about thirty-five, a narrow face, a trimmed dark beard with a grey streak, a white headcloth
   tied with a cord, a striped brown-and-cream tunic, sandals.`
**The walk back to his post (same man, same size), one message each:**
```
A sprite sheet: one row of 6 poses of this same soldier walking to the RIGHT, a full walk cycle, spear resting on
his shoulder, shield on his arm, head up, calm and steady. Same size, feet on the same line, clear gaps. Background
solid flat bright green (#00FF00). No shadows, no text.
```

### The letter note: David standing, looking down at his Journal (2026-10-18)
Same over-the-shoulder framing as the Journal reading scenes, but David is STANDING where he found the letter, and the
ground at his feet shows where he is. 1536 x 1024. Save as `assets\journal\note_road.jpg`, `note_town.jpg`,
`note_hall.jpg`, `note_stream.jpg`. Paste the style block first:
```
Over-the-shoulder view from just behind and above a shepherd boy's right shoulder (David, about 15, curly dark hair,
a plain undyed tunic), standing and looking down at an open leather-bound journal held in both hands in front of
him. The two blank cream pages fill the middle of the picture, flat and clearly visible, nothing written on them,
nothing covering them. Below and around the book we see his sandaled feet and the ground he is standing on:
[GROUND]. Soft daylight, Pixar-style 3D, warm and calm, shallow depth of field so the ground is a little soft and
the book is sharp. No text anywhere.
```
Replace [GROUND] with one of:
- **road** (4-1, 4-2, 5-1): `a dusty dry road with small pale stones, a tuft of dry grass, the edge of a weathered
  limestone rock with old carving marks, hot afternoon light`
- **town** (4-3): `worn stone paving of a town street, the bottom of a wooden doorpost, a little straw and dust`
- **hall** (4-4): `a cool smooth stone palace floor at night, warm lamplight from one side, the foot of a stone column`
- **stream** (7-3): `smooth round pebbles of a dry streambed, a little water glinting at the edge, a few reeds`

## World 6 — 6-2 No-Man's Land (2026-10-18)
Built with stand-ins (5-4's dawn valley, the plain rock tiles, the goliath_silhouette). What would make it look right:

**Background** (three layers like the others; save as `6-2 far.png`, `6-2 mid.png`, `6-2 near.png`)
```
World 6, no-man's land in the Valley of Elah, a hard bright morning. Far: across the valley, the Philistine camp on
the opposite hillside, rows of dark tents and a long line of soldiers with spears and shields along the ridge, small
with distance. Middle: the open valley floor, dry yellow grass, scattered boulders, a few terebinth trees, the dry
streambed winding through. Near strip, the bottom quarter only: trampled dry ground, broken arrows stuck in the dirt,
stones, tufts of grass. Pixar-style 3D, wide panorama, no people in the foreground, no text.
```
**The shelter rock** (single item, magenta; save to `world6\`): `A big weathered sandstone boulder that leans over,
making a low overhang a boy could crouch under, open on the left side, seen from the side. Pixar-style 3D. Solid
magenta background (#FF00FF). No shadow, no text.` (About 5 tiles wide, 4 tall: the game will fit it over the shelter.)

**Goliath, far off, in full** (for the watching scene; one row of 4 poses, facing LEFT, green background): `the
Philistine champion, huge, bronze helmet, bronze scale coat, bronze shin guards, a javelin across his back, a
massive spear; 1 standing, spear grounded; 2 shouting, one fist raised; 3 spreading his arms wide, mocking; 4
laughing, head back.` Shown small and dark against the sky, so a strong clear outline matters more than detail.
A **shield bearer** (one pose, carrying a tall body shield, walking LEFT) to stand in front of him.

**Sounds** (mp3s in `assets/sounds/`): `phil_shout.mp3` (a rough shout of many men from far off, about a second),
`arrow_volley.mp3` (a whoosh of many arrows loosed at once, then the hiss of them coming down, about 1.5 s).

## World 6 — 6-3 The Water Carriers (2026-10-18)
Built with stand-ins (5-4's background; the carriers are Glen's running soldier, tinted, with a drawn clay jar).

**Background** (`6-3 far.png`, `6-3 mid.png`, `6-3 near.png`)
```
World 6, down in the dry streambed of the Valley of Elah. Far: the valley walls, the Israelite camp's tents high on
the left hill, and on the right far bank a tall wooden siege tower with archers, small with distance. Middle: the
streambed winding along, smooth round stones, cracked dry mud, a few pools still holding green water, reeds and
rushes, terebinth trees with roots showing along the undercut banks. Near strip, the bottom quarter only: smooth
pale stones of every size, sand, a few reeds. Pixar-style 3D, wide panorama, no people, no text.
```
**The water carrier** (one row of 6 walking poses, facing RIGHT, green background): `an Israelite man carrying a
big clay water jar on his shoulder, one hand steadying it, plain tunic, sandals; a calm walk cycle.` And one row of 2:
`the same man crouching with his arms over his head, the jar held tight against him.` (The game will tint him for
the different men; or make two or three different men if you like.)

**The undercut bank** (single item, magenta; save to `world6\`): `a long low earth-and-rock bank of a dry streambed,
undercut so it hangs out over a hollow a man could crouch in, roots hanging down from the overhang, seen from the
side. Pixar-style 3D. Solid magenta background (#FF00FF). No shadow, no text.`

**A pool still holding water** (single item, magenta): `a small shallow pool of clear green water among smooth
stones in a dry streambed, reeds at both ends, seen from the side and a little above.`

## World 6 — 6-4 The Tower's Shadow and the Philistine Watchtower (2026-10-18)
Built with stand-ins: the tower is drawn with plain shapes, the skirmishers and the tower crew are your running
soldier darkened and reddened, the archers are a head and a bow in the window.

**The watchtower** (the big one; a sheet of separate pieces on magenta so the game can animate them):
```
A Philistine siege watchtower from about 1000 BC, seen exactly side-on, Pixar-style 3D. Three floors of rough
wooden planks on four big solid wooden wheels (two show), the front face covered in stitched leather hides, a wicker
parapet around the open top floor, a heavy top crossbeam, rope ladders hanging down the left side. Each of the two
lower floors has two square window openings on the side facing us, each with a plank shutter on a hinge. About twice
as tall as it is wide. Solid magenta background (#FF00FF). No people, no shadow, no text.
```
Then, as separate pieces on magenta: one **shutter** (closed, and swung open), the **front wheel** on its own (and
the same wheel with its wooden pins knocked out, tilted), the **fallen tower** lying on its back with broken planks
and a dust cloud, and a **rope ladder** whose upper rungs have been cut.

**The archer in the window** (one row of 4, facing LEFT, green background): `a Philistine archer with a feathered
headdress, leaning out of a window frame from the chest up: 1 hidden, just eyes; 2 leaning out drawing his bow; 3
loosing; 4 his bow knocked out of his hands, surprised.`

**The skirmisher** (one row of 6 running, facing LEFT, plus one row of 3: dropping the shield, turning, running away
to the RIGHT; green background): `a Philistine skirmisher, feathered headdress, a short kilt and leather chest
straps, a round shield held up in front, a short spear.`

**The slingers on top** (one row of 4, facing LEFT): `a Philistine slinger behind a wicker parapet: ducking; rising;
whirling a sling over his head; the throw.` And the **crew running away** (one row of 6, facing RIGHT).

**6-4 background** (`6-4 far.png`, `6-4 mid.png`, `6-4 near.png`): `the far end of the Valley of Elah's
streambed, late afternoon, long shadows; on the right bank a tall wooden siege tower looms over the valley, its
shadow stretching across the stones; trenches and low walls of piled rocks and shields; arrows stuck in the ground.`

