# Sprite list

A checklist of every sprite the game needs, world by world. Tick them off as you finish each sheet in Photoshop.
**Prompts** for most of these are in [ART_PROMPTS.md](ART_PROMPTS.md). **Sheet rules** are in DESIGN.md §8.

## Sizes
The look is **smooth, Pixar-style characters, like Rainbow Unicorn Quest** (not pixel art). Sprites are stored large and the game scales them down smoothly, so they stay sharp at any screen size.

| Kind | Height in the sprite sheet | Notes |
|---|---|---|
| David | 240 px | `tools/vid2sprite.py --height 240` (the default) |
| People (NPCs) | 240 px | Same scale as David |
| The lamb, sheep, small animals | about 110 px | |
| Big enemies (wolf, boar, leopard) | about 160 px | |
| Bosses | about 400 px | Goliath about 480 px (twice David's height) |
| Dialogue portraits | 256 × 256 | |

**Keep scale consistent:** ask Grok for the same framing every time ("full body, centred, same distance from camera"), and the converter sizes every clip to the same character height.

**How sprites are made:** Grok video clips run through `tools/vid2sprite.py`. See [VIDEO_SPRITES.md](VIDEO_SPRITES.md).

Frame counts are starting targets. Fewer frames is fine if the motion reads.

---

## Global (used in every world)

### David
| ☐ | Animation | Frames | Notes |
|---|---|---|---|
| ☐ | idle | 4 | breathing, sling at belt |
| ☐ | walk | 8 | |
| ☐ | run | 8 | |
| ☐ | jump (rising) | 2 | |
| ☐ | fall | 2 | |
| ☐ | land | 3 | |
| ☐ | sling throw | 6 | ready, wind-up, whirl, release, follow-through, recover. Also used for quick release (W4). |
| ☐ | sling charge (hold) | 3 | looping whirl; the golden glow is a separate effect |
| ☐ | sling throw up / diagonal | 6 each | aiming up and up-forward |
| ☐ | roll | 6 | crouch, tuck, roll, roll, untuck, run |
| ☐ | aerial flip | 6 | (W3) |
| ☐ | double jump | 6 | (W5) a sharp mid-air tuck-and-kick |
| ☐ | hurt | 2 | |
| ☐ | faint (lose a life) | 4 | sits down, dizzy. No death pose |
| ☐ | climb (vine / ladder) | 4 | |
| ☐ | swing (vine) | 3 | |
| ☐ | play harp, standing | 4 | |
| ☐ | play harp, sitting | 4 | campfires and the Saul fight |
| ☐ | carry lamb on shoulders, walk | 8 | end-of-world scenes |
| ☐ | kneel / help (right a cast sheep, oil a sheep) | 3 | |
| ☐ | talk | 2 | |
| ☐ | victory | 4 | |
| ☐ | portrait | 1–3 | neutral, happy, determined |

### The lamb (player 2, 32 × 32)
| ☐ | Animation | Frames |
|---|---|---|
| ☐ | idle (with an ear flick) | 4 |
| ☐ | trot | 6 |
| ☐ | hop | 3 |
| ☐ | headbutt | 4 |
| ☐ | bleat | 3 |
| ☐ | tumble when hit | 4 |
| ☐ | pop back in (sparkle) | 3 |
| ☐ | ears up / alert | 2 |
| ☐ | wiggle in the lion's mouth | 3 |
| ☐ | curled up asleep by the fire | 2 |
| ☐ | wearing Saul's helmet, walking | 4 |
| ☐ | riding on David's shoulders (David's carry sheet, with the lamb drawn in) | reuse 8 |
| ☐ | portrait (64 × 64) | 2 (happy, alert) |

### Sheep
| ☐ | Sprite | Frames |
|---|---|---|
| ☐ | sheep walk | 6 |
| ☐ | sheep idle / graze | 4 |
| ☐ | sheep scared (running) | 4 |
| ☐ | sheep stuck in thorns | 2 |
| ☐ | **cast sheep** (on its back, legs kicking) | 2 |
| ☐ | sheep shaking head (flies) | 3 |
| ☐ | lamb walk / idle | 6 / 2 |
| ☐ | **The One** lamb, with a soft sparkle | 4 |

### Effects
☐ stone · ☐ charged-glow (4) · ☐ dust puff (4) · ☐ splash (4) · ☐ hit spark (3) · ☐ sparkle (4) · ☐ music notes (3) · ☐ fly swarm (3) · ☐ shiver/scare lines (2)

### Items & pickups
☐ heart · ☐ scroll · ☐ Psalm page · ☐ oil flask · ☐ honey · ☐ water skin · ☐ campfire (4-frame loop) · ☐ checkpoint fire lit/unlit

### UI
☐ hearts (full/empty) · ☐ counsel card icons (📜 🗝️ 👁️ 🧭 🎓) · ☐ Journal page frame · ☐ talk box frame · ☐ ★ rating stars · ☐ sheep counter icon

### Map icons
☐ stage dot (open / cleared) · ☐ David on the map (walk 4) · ☐ 🏠 house · ☐ 🔥 campfire · ☐ 🙋 helper · ☐ ✨ bonus · ☐ path dots · ☐ boss icons: lion cave, bear ravine, ox, crown, chariot, tower, shield, Goliath

### Recurring people (portrait + idle 2 + talk 2 unless noted)
☐ **Hanan** (+ sit by fire 2) · ☐ **Jesse** · ☐ **Eliab** · ☐ **Abinadab** · ☐ **Shammah** (+ run 8 for 3-3) · ☐ four younger brothers (idle only, background)

---

## World 1 — The Shepherd's Fields
- **Enemies:** ☐ viper (coil, puff, strike: 6) · ☐ fox (run 6) · ☐ raven (fly 4, dive 2) · ☐ jackal (run 6, run with lamb 6) · ☐ wild ram (walk 4, charge 4)
- **Harmless:** ☐ whip snake (slide 4)
- **People:** ☐ shepherd girl + her goat on a rock
- **Boss — the Lion:** ☐ prowl 6 · ☐ run with lamb 6 · ☐ crouch / tail-flick 3 · ☐ pounce 4 · ☐ swipe 3 · ☐ roar 3 · ☐ dazed 3 · ☐ defeated 3 · ☐ background silhouette walking along the ridge (4)
- **Objects:** ☐ gourd on wall · ☐ thornbush · ☐ rope bridge · ☐ crumbling ledge (3) · ☐ cracked fake wall · ☐ sheepfold gate
- **Tiles/backgrounds:** ☐ grass hills tileset · ☐ limestone/cave tileset · ☐ night palette · ☐ parallax: sky, far hills, Bethlehem on its hill, near olive trees
- **Map:** ☐ World 1 map

## World 2 — The Wilderness
- **Enemies:** ☐ wild boar (run 6, stunned 2) · ☐ wolf (run 6, yelp-and-flee 4) · ☐ eagle (circle 4, dive 2, carry lamb 4) · ☐ yellow scorpion (walk 4, strike 3) · ☐ hornet nest (hang 2, falling 2) + hornets (2) · ☐ vulture (circle 4)
- **Harmless:** ☐ hedgehog (walk 4, eat 2) · ☐ honeybee hive (2) · ☐ tortoise (walk 4, tucked 1) · ☐ ibex (leap 4, stand 1) · ☐ rock hyrax (sit 2)
- **People:** ☐ boy from Tekoa (follow 6) · ☐ his donkey (walk 6, frozen-scared 2) · ☐ his father (leatherworker)
- **Boss — the Bear:** ☐ walk 6 · ☐ charge 6 · ☐ slow turn 3 · ☐ stand up 3 · ☐ slam 3 · ☐ pick up boulder 3 · ☐ throw 3 · ☐ knocked on back 3 · ☐ climb ledge 4 · ☐ defeated 3
- **Objects:** ☐ swinging vine · ☐ dead branch (breakable) · ☐ oleander bush · ☐ flood water edge (animated 4) · ☐ waterfall (4) · ☐ log bridge (whole / broken) · ☐ falling rocks
- **Tiles/backgrounds:** ☐ forest · ☐ dry wadi · ☐ desert cliffs · ☐ ravine at dusk · ☐ parallax layers for each
- **Map:** ☐ World 2 map

## World 3 — The Anointing
- **Enemies:** ☐ crow (fly 4, peck 2) · ☐ rat (run 4) · ☐ stray dog (run 6) · ☐ rustler (sneak 6, flee carrying nothing 6)
- **Harmless:** ☐ whip snake in rafters (reuse)
- **People:** ☐ **Samuel** (with horn of oil: idle 2, talk 2, pour 4) · ☐ town elders (idle) · ☐ old widow gleaning (2) · ☐ messenger on horseback (ride 4) · ☐ townsfolk crowd (3–4 types, idle)
- **Cut-in scenes:** ☐ each brother standing before Samuel (can reuse portraits + idle)
- **Boss — the Wild Ox:** ☐ paw ground 3 · ☐ charge 6 · ☐ horns stuck in tree 3 · ☐ skid 3 · ☐ shake head 3 · ☐ run away 6
- **Objects:** ☐ barley field (sway 3) · ☐ threshing floor · ☐ granary · ☐ flat roofs/ladders · ☐ oil flask · ☐ trees that split (3 states) · ☐ lightning (3) · ☐ rain overlay (3)
- **Tiles/backgrounds:** ☐ Bethlehem town · ☐ barley fields · ☐ storm grassland · ☐ parallax with the crowd on the town hill (3-2)
- **Map:** ☐ World 3 map

## World 4 — The King's Court
- **Enemies:** ☐ bandit (sneak 6, grab 3, flee 6) · ☐ palace guard dog (run 6, bark 2) · ☐ shadow wisp (drift 4) · reuse boar, crow, rat, hornets
- **Harmless:** ☐ dove (walk 2, fly 4) · ☐ sparrow · ☐ market goats · reuse bees
- **People:** ☐ **Saul** (seated troubled 3, seated calm 2, standing talk 2, asleep 2) · ☐ **the Steward** · ☐ **Gera the slinger** (+ throw demo 6) · ☐ vineyard keeper · ☐ royal messenger · ☐ palace guards (idle 2, walk 4) · ☐ servants with lamps (walk 4) · ☐ beekeeper · ☐ carpenter · ☐ market sellers
- **Boss — Saul's Torment:** ☐ Saul's chair close-up · ☐ shadow shapes ×3 sizes (4 each) · ☐ shadows fading (4) · ☐ rhythm note icons for ↑ ↓ A B · ☐ calm meter · ☐ David playing, close-up (4)
- **Objects:** ☐ donkey with packs (walk 6, scared 2) · ☐ dropped gifts (bread, wineskin, young goat) · ☐ targets (static, swinging, on ropes) · ☐ clay jars (whole / broken) · ☐ harp parts (string, peg, wax) · ☐ hall lamps (unlit / lit 3) · ☐ market awnings
- **Tiles/backgrounds:** ☐ vineyards & road · ☐ training yard & walls · ☐ Gibeah town · ☐ palace interior at night · ☐ Jebus/Jerusalem walls far in the background
- **Map:** ☐ World 4 map

## World 5 — The Road to the Valley
- **Enemies:** ☐ Philistine raider (run 6, grab 3, flee 6) · ☐ Philistine lookout with torch (idle 2, spot-and-shout 3) · ☐ striped hyena (prowl 6, laugh 3, lunge 3) · ☐ **leopard** mini-boss (crouch on branch 2, drop 3, run 6, swipe 3, retreat up tree 4) · reuse vulture, viper, scorpion
- **Harmless:** ☐ horses (the chariot's team: don't hit them) · ☐ gazelle (run 4) · reuse tortoise
- **People:** ☐ **Tobi the scout** (hide/cower 2, follow 6, demo leap 6) · ☐ fleeing villagers (walk 4, 2–3 types) · ☐ keeper of supplies · ☐ Israelite soldiers (idle 2, shout 2, run away scared 4) · ☐ commander of the thousand
- **Boss — the Philistine Chariot:** ☐ chariot galloping (6) · ☐ archer drawing/firing (4) · ☐ archer ducking behind shield (2) · ☐ wheel cracked / wobbling (3) · ☐ wheel broken, chariot stopped, horses rearing (4) · ☐ crew running away on foot (6) · ☐ arrow (2)
- **Objects:** ☐ provisions (grain sack, loaves, cheeses: dropped and carried) · ☐ signal fire (unlit / lit 4) · ☐ chariot wheel ruts · ☐ terebinth trees · ☐ rough-ground rocks
- **Tiles/backgrounds:** ☐ supply road · ☐ night mountain trail · ☐ ridge with lookouts · ☐ descent into the Valley of Elah, with both camps in the background
- **Map:** ☐ World 5 map
- **Ending scene:** ☐ Goliath in silhouette only, far away, shouting (a dark shape; his full sprite isn't seen until World 6)

## World 6 — The Valley of Elah
- **Enemies:** ☐ Philistine archer (lean out 2, draw 3, fire 2, bow knocked away 2) · ☐ Philistine slinger (whirl 4, release 2) · ☐ Philistine skirmisher (run 6, flee 6) · ☐ volley of arrows / stones (falling, 3) · reuse viper, scorpion, vulture
- **Harmless:** ☐ camp donkey · ☐ ox · ☐ soldiers' dog · reuse hedgehog
- **People:** ☐ frightened soldier (hiding/cowering 2, standing up with spear 4, back at post 2): 2–3 looks · ☐ soldiers at the fire (talk 2) · ☐ **Eliab angry** (portrait + 3-frame rant) · ☐ water captain · ☐ water carriers with jars (walk 6) · ☐ **Saul standing in his tent** (talk 2, long pause 1) · ☐ commanders (idle)
- **Goliath at a distance:** ☐ small far-off Goliath on the Philistine line (taunt 4, shout 2). His full-size sprite is World 8.
- **Boss — the Philistine Watchtower:** ☐ tower rolling (wheels 4) · ☐ window shutters open/closed · ☐ archer in window (3) · ☐ wheel pin glint (2) · ☐ tower leaning, 3 stages · ☐ crew climbing down the back (4) · ☐ tower falling (6) + big dust cloud (4) · ☐ rope ladder (whole / cut rungs)
- **Flashback frames:** ☐ sepia/tinted versions of the lion and bear fights (can reuse sprites with a palette swap)
- **Objects:** ☐ tents (bounce top) · ☐ supply wagons · ☐ water jars (full / empty) · ☐ reeds · ☐ deep pool · ☐ cover rocks · ☐ shepherd's bag (gift icon)
- **Tiles/backgrounds:** ☐ Israelite camp · ☐ no-man's land valley floor · ☐ streambed with pools · ☐ Philistine camp in the far background · ☐ Saul's tent interior
- **Map:** ☐ World 6 map

## World 7 — The Giant's Shadow
- **David in Saul's armor:** ☐ clanky walk 8 · ☐ tiny hop 3 · ☐ thud landing 2 · ☐ helmet slipping over the eyes 3 · ☐ sword catching 2 · ☐ taking the armor off 6 · ☐ armor pile on the ground (1) · ☐ grey "armor hearts" icon
- **David, other:** ☐ kneel at the stream and pick up a stone 4 · ☐ look at a stone (close-up hand, 2) · ☐ stand with staff + sling, bag at side (the 17:40 pose, 2)
- **People:** ☐ **Saul dressing David** (4) · ☐ Saul nodding (2) · ☐ soldiers lining the path, watching (2–3 looks) · ☐ **Eliab, arms crossed, apart** (1–2) · reuse Tobi, Shammah
- **Memory sections:** palette-shifted (warmer, softer) versions of World 1–3 tiles (no new art if the palette swap looks right)
- **Stones:** ☐ smooth round stone · ☐ rough/jagged stone · ☐ flat stone · ☐ close-up versions of each (32×32) · ☐ stone shine (2) · ☐ five-stones pouch counter (0–5)
- **Goliath:** ☐ approaching, full size, walking (6) · ☐ standing back, laughing (4) · ☐ his shadow on the ground (grows in 3 sizes)
- **Boss — the Shield-Bearer:** ☐ walk behind shield 6 · ☐ lift shield 3 · ☐ slam shield 3 + ground shockwave 4 · ☐ charge shield-first 6 · ☐ peek over the top 2 · ☐ shield tilted / knocked sideways 2 · ☐ shield knocked out of hands 4 · ☐ shield lying flat (1) · ☐ backing away 4
- **Gifts screen icons (32×32):** ☐ Jesse's sling · ☐ leather pouch · ☐ Hanan's staff · ☐ King's Favour (a seal) · ☐ scout's cloak · ☐ shepherd's bag · ☐ five stones
- **Tiles/backgrounds:** ☐ Saul's tent area · ☐ the slope down with crowds on both hills · ☐ the streambed close up · ☐ the open valley floor with a darkening right edge
- **Map:** ☐ World 7 map

## World 8 — David and Goliath
- **David:** ☐ run toward (forward lean, 8) · ☐ answer pose, arm raised (2) · ☐ reach into bag for a stone (3) · ☐ final throw, slow-motion (8, can reuse the sling throw with extra in-between frames) · ☐ walk home at sunset (reuse walk with palette) · ☐ stand at the fold looking back (2)
- **Goliath (128 × 192):** ☐ walk/advance 6 · ☐ taunt / laugh 4 · ☐ plant feet + draw spear back 3 · ☐ spear thrust 4 · ☐ lift spear high 2 · ☐ spear-butt slam 3 + shockwave 4 · ☐ reach for javelin 3 · ☐ javelin throw 3 · ☐ sword sweep 4 · ☐ roar at the sky, head back, forehead open 4 · ☐ stones clanging off bronze (spark, 3) · ☐ hit, sway 3 · ☐ fall face down 6 · ☐ lying still 1 · ☐ portrait (64 × 64)
- **Projectiles:** ☐ bronze javelin (spin 4) · ☐ javelin shadow on the ground
- **People:** ☐ **Abner** (portrait, idle 2, talk 2) · ☐ Israelite army charging downhill (run 6, 3 looks) · ☐ Philistines fleeing, dropping shields (run 6, 2 looks) · ☐ crowd versions of every named character (small, cheering 2): Hanan, Jesse, Eliab, Abinadab, Shammah, shepherd girl, boy from Tekoa & father, gleaner, Steward, Gera, Tobi, water captain
- **Objects:** ☐ ring of stones (arena edge) · ☐ dropped shields and spears · ☐ abandoned Philistine tents · ☐ stone counter (5 stones, full/empty)
- **Effects:** ☐ white flash · ☐ slow-motion streak on the stone · ☐ dust cloud when Goliath falls (6) · ☐ big text lines for David's answer (a title font)
- **Ending:** ☐ the fold at sunset · ☐ Hanan, older, with a new staff · ☐ credits scene art, one per world
- **Secret ending:** ☐ shepherds at night by a fire (3 looks: idle 2, cover eyes 2) · ☐ light filling the sky (6) · ☐ a figure of light (an angel shown simply as a bright shape, not a detailed character)
- **Tiles/backgrounds:** ☐ the duel ring with both armies on the hills · ☐ the road west with the Philistine camp · ☐ World 1 hills at sunset (palette swap) · ☐ World 1 hills at night, with a starry sky (secret ending)
- **Map:** ☐ World 8 map
