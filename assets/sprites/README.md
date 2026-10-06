# Finished sprite sheets

Made with `tools/vid2sprite.py` from Glen's Grok clips. Each PNG is one row of frames on a transparent background; the matching `.json` has frame size, timing and the anchor point.

| Sheet | Frames | Frame size | ms/frame | Plays | Anchor | From clip |
|---|---|---|---|---|---|---|
| `david_arm_raised.png` | 8 | 217×269 | 120 | once | feet | c3_3.mp4 |
| `david_arms_crossed.png` | 8 | 161×268 | 62 | loop | feet | c3_3.mp4 |
| `david_carry_lamb_walk.png` | 12 | 148×248 | 80 | loop | feet | c2_1.mp4 |
| `david_crawl.png` | 10 | 218×162 | 88 | loop | feet | c3_2.mp4 |
| `david_crouch.png` | 8 | 164×238 | 83 | once | feet | c3_2.mp4 |
| `david_flip.png` | 10 | 215×208 | 112 | once | center | hf_1.mp4 |
| `david_flip_takeoff.png` | 6 | 221×235 | 153 | once | feet | hf_1.mp4 |
| `david_guard.png` | 6 | 208×258 | 90 | once | feet | c3_3.mp4 |
| `david_kneel_harp.png` | 10 | 210×257 | 162 | once | feet | hf_2.mp4 |
| `david_land.png` | 6 | 264×222 | 139 | once | feet | hf_1.mp4 |
| `david_pickup_lamb.png` | 16 | 182×247 | 159 | once | feet | c2_1.mp4 |
| `david_play_harp.png` | 10 | 152×227 | 79 | loop | feet | hf_2.mp4 |
| `david_roll.png` | 12 | 210×222 | 139 | once | ground | d_roll.mp4 |
| `david_roll_getup.png` | 7 | 225×233 | 131 | once | feet | d_roll.mp4 |
| `david_run.png` | 12 | 182×248 | 56 | loop | feet | c1_3.mp4 |
| `david_sling_throw.png` | 12 | 222×247 | 108 | once | feet | c1_2.mp4 |
| `david_slow_to_stop.png` | 8 | 166×263 | 104 | once | feet | hf_2.mp4 |
| `david_stop.png` | 6 | 197×256 | 76 | once | feet | c3_3.mp4 |
| `david_walk.png` | 12 | 150×247 | 87 | loop | feet | david_walking.MP4 |
| `lamb_run.png` | 10 | 106×92 | 96 | loop | feet | c3_1.mp4 |

**How they're used:**
- `david_guard`: block / brace (fists up)
- `david_arm_raised`: 8-1: raising his arm as he answers Goliath
- `david_stop`: skid to a stop from a run
- `david_slow_to_stop`: run slowing to a walk and a stop
- `david_arms_crossed`: standing still, confident (cutscenes)
- `david_flip_takeoff + david_flip + david_land`: the aerial flip, in three parts so the game controls the height
- `david_roll + david_roll_getup`: the roll, then getting back up into a run
- `david_kneel_harp + david_play_harp`: campfires: kneel down with the harp, then play (loop)

**Notes:**
- `david_arms_crossed`: turned three-quarters toward the camera: cutscenes and waiting, not side-view gameplay
- `david_play_harp`: three-quarter view, kneeling: campfire and Saul scenes
