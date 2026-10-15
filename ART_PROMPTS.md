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
- **The neighbour shepherd ✦** (an old man) and **the shepherd girl ✦** with her goat: standing and talking.

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

**Save as** `david-sling-art-1 far.png`, `4-1 mid.png`, `4-1 near.png`.
