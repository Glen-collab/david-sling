# Finished sprite sheets

Made with `tools/vid2sprite.py` from Glen's Grok clips. Each PNG is one row of frames on a transparent background; the matching `.json` has frame size, timing and the anchor point.

| Sheet | Frames | Frame size | ms/frame | Plays | Anchor | From clip |
|---|---|---|---|---|---|---|
| `bear_charge.png` | 10 | 342×159 | 79 | loop | feet | z3_6.mp4 |
| `bear_dazed.png` | 7 | 235×224 | 226 | once | feet | z4_2.mp4 |
| `bear_lunge.png` | 8 | 390×187 | 146 | once | feet | z3_6.mp4 |
| `bear_stand_roar.png` | 8 | 265×195 | 208 | back-and-forth | feet | z3_5.mp4 |
| `bear_walk.png` | 12 | 319×158 | 101 | loop | feet | z3_1.mp4 |
| `cobra_hood.png` | 8 | 212×86 | 219 | back-and-forth | feet | z4_4.mov |
| `david_arm_raised.png` | 8 | 217×269 | 120 | once | feet | c3_3.mp4 |
| `david_arms_crossed.png` | 8 | 161×268 | 62 | loop | feet | c3_3.mp4 |
| `david_carry_lamb_walk.png` | 12 | 148×248 | 80 | loop | feet | c2_1.mp4 |
| `david_crawl.png` | 10 | 218×162 | 88 | loop | feet | c3_2.mp4 |
| `david_crouch.png` | 8 | 164×238 | 83 | once | feet | c3_2.mp4 |
| `david_flip.png` | 10 | 215×208 | 112 | once | center | hf_1.mp4 |
| `david_flip_takeoff.png` | 6 | 221×235 | 153 | once | feet | hf_1.mp4 |
| `david_guard.png` | 6 | 208×258 | 90 | once | feet | c3_3.mp4 |
| `david_idle.png` | 10 | 93×248 | 140 | back-and-forth | feet | jump.mp4 |
| `david_jump_air.png` | 10 | 157×254 | 158 | once | center | jump.mp4 |
| `david_jump_crouch.png` | 5 | 147×243 | 133 | once | feet | jump.mp4 |
| `david_jump_land.png` | 6 | 149×238 | 167 | once | feet | jump.mp4 |
| `david_land.png` | 6 | 264×222 | 139 | once | feet | hf_1.mp4 |
| `david_pickup_lamb.png` | 16 | 182×247 | 159 | once | feet | c2_1.mp4 |
| `david_play_harp.png` | 12 | 187×250 | 150 | back-and-forth | feet | harp.mp4 |
| `david_roll.png` | 12 | 210×222 | 139 | once | ground | d_roll.mp4 |
| `david_roll_getup.png` | 7 | 225×233 | 131 | once | feet | d_roll.mp4 |
| `david_run.png` | 12 | 182×248 | 56 | loop | feet | c1_3.mp4 |
| `david_sit_harp.png` | 14 | 189×251 | 152 | once | feet | harp.mp4 |
| `david_sling_throw.png` | 12 | 222×247 | 108 | once | feet | c1_2.mp4 |
| `david_slow_to_stop.png` | 8 | 166×263 | 104 | once | feet | hf_2.mp4 |
| `david_stop.png` | 6 | 197×256 | 76 | once | feet | c3_3.mp4 |
| `david_walk.png` | 12 | 150×247 | 87 | loop | feet | david_walking.MP4 |
| `lamb_run.png` | 10 | 106×92 | 96 | loop | feet | c3_1.mp4 |
| `leopard_pounce.png` | 12 | 295×113 | 170 | once | feet | z2_1.mp4 |
| `leopard_run.png` | 10 | 286×108 | 58 | loop | feet | z2_4.mov |
| `leopard_walk.png` | 12 | 210×101 | 181 | loop | feet | z2_3.mp4 |
| `lion_dazed.png` | 10 | 232×184 | 50 | loop | feet | z4_1.mp4 |
| `lion_pounce.png` | 12 | 422×267 | 101 | once | feet | z3_2.mp4 |
| `lion_prowl.png` | 12 | 291×158 | 52 | loop | feet | z3_3.mp4 |
| `lion_roar.png` | 10 | 311×189 | 154 | once | feet | z3_4.mp4 |
| `lion_run.png` | 10 | 268×156 | 54 | loop | feet | z2_2.mp4 |
| `lion_sit_roar.png` | 8 | 271×184 | 208 | back-and-forth | feet | z3_3.mp4 |
| `snake_strike.png` | 8 | 145×75 | 156 | back-and-forth | feet | z4_3.mov |

**How they're used:**
- `david_idle`: standing still, side-on; plays forward then backward (a slow breath)
- `david_jump_crouch + david_jump_air + david_jump_land`: the normal jump in three parts; the game moves him, the frames stay centred
- `david_guard`: block / brace (fists up)
- `david_arm_raised`: 8-1: raising his arm as he answers Goliath
- `david_stop`: skid to a stop from a run
- `david_slow_to_stop`: run slowing to a walk and a stop
- `david_arms_crossed`: standing still, confident (cutscenes)
- `david_flip_takeoff + david_flip + david_land`: the aerial flip, in three parts so the game controls the height
- `david_roll + david_roll_getup`: the roll, then getting back up into a run
- `david_sit_harp + david_play_harp`: campfires: sit down, pull the harp from the satchel, play (back-and-forth)
- animals face right like David (clips were mirrored); the game flips them to face the player

**Notes:**
- `david_arms_crossed`: turned three-quarters toward the camera: cutscenes and waiting, not side-view gameplay
- `david_play_harp`: three-quarter view, kneeling: campfire and Saul scenes
