# Where we left off

If a chat session closes, start here. Last updated 2026-10-11 (end of a long session).

## How to play and test

- **Play:** double-click `Play David.bat`: the game opens in its own Chrome window with sound on and no click needed, so a controller is enough. It opens on the **journey map** (or whichever map you were last on).
- **Getting around:** journey map â†’ A at Bethlehem â†’ World 1 map â†’ A at the home stop (Jesse's courtyard) or a stage. B on a world map goes back out to the journey map.
- **Keys:** 1 = 1-1, 2 = movement test, 3 = swap backgrounds, 4 = Journal preview, 5 = World 1 map, 6 = journey map, H = help.
- **Address switches for testing:**

  | Switch | What it does |
  |---|---|
  | `#1-3` | Open a stage directly |
  | `?cheat` | B on a map marks a stage cleared |
  | `?flip` | Turn on the double jump |
  | `?allskills` | Every taught move |
  | `?journal=1..5` (with `&jbook`, `&jt=6&jfreeze`, `&jauto`) | Journal previews |

- **Progress** is saved in the browser: `localStorage` `davidProgress`. It holds cleared stages, sheep, The One, stones, olives, lamp oil, fig cake, skills, throw pieces given, and which map you're on. Clear it to start over. **Poison everywhere (2026-10-23):** main.js POISON places wild gourds (on ledges, sling them; on the ground where a stretch has no ledge) and poison berries in 15 outdoor stages by rule (the same every time, clear of fires/talks/sheep/food/set pieces). Gourds quote 2 Kings 4:40, berries Deuteronomy 32:32 (WEB); hurtDavid(x, why) keeps that verse in the message when the poison costs a life. **Three saved games (2026-10-23, like Super Mario World):** title > Choose a game lists them (menu.js files screen: name, world, stages, sheep, difficulty); an empty one asks for a name (a letter grid picked with the D-pad, NAME_GRID) and Easy/Medium/Hard, then starts; Erase a game empties one. main.js SLOT (localStorage davidSlot) and slotKey(): Game 1 keeps the old keys (davidProgress, davidStones, davidGateTops, davidTrial, davidDifficulty), Games 2 and 3 add @2 / @3; names in davidNames. Every read and write of those keys goes through slotKey, so a new per-game key must too (and goes in SLOT_KEYS so erase clears it). Choosing another game reloads the page (every game's numbers are read at load). The difficulty belongs to each game; the controller and volumes are shared. A game saved before names existed asks for one the first time it's picked.
- **Update the Desktop copy:** `git pull` in `Desktop\david-sling`. Run `git status` first in case art was edited there.
- **Tuning:** the `TUNE` block in `game/main.js`, `W1` in `game/world1.js`, `CAVE` in `game/caves.js`, `HOME` in `game/home.js`, `MTUNE` in `game/map.js`.
- **Art drop folder:** `Desktop\david-sling-art`.

## The code, file by file

| File | What's in it |
|---|---|
| `game/main.js` | Engine, David, the four World 1 stage layouts (`LEVEL_NAME === "1-x"`), the lion, sheep, the goal, the HUD |
| `game/world1.js` | Foxes, jackals, rams, ravens, crumbling ledges, rope bridges, carved walls (the throw code), the night, people's lines, The One's verse card |
| `game/caves.js` | Caves like Mario's pipes: lamp, oil, bats, cave art |
| `game/journal.js` | The Journal: words, layout, "The Throw" page |
| `game/map.js` | The journey map and the World 1 map |
| `game/home.js` | Jesse's courtyard: Jesse, the practice wall, the shelf, the market |
| `game/menu.js` | Title screen (Continue / New game / Settings), pause menu (Start), Settings: controller pictures, set up a controller, music and sound volume |

## Built 2026-10-11

- **Journal screen.** Glen's night scene of David reading by the lamp; Up leans in. World 1 text is locked.
  - The world spread says *"There's still a lamb out there..."* until all of that world's Ones are home, then *"Every one of them is home."*
- **Journey map** (Glen's painting, 8 stops) and the **World 1 map** (the Bethlehem painting, stone markers, cairn).
- **All four World 1 stages,** each with Glen's own backgrounds (1-1 afternoon, 1-2 morning, 1-3 rocky, 1-4 night).
- **Caves** in 1-2 and 1-3, with Glen's cave layers, stalactites and stacked-ledge towers.
- **Glen's asset sheets wired in:** cracked ledges that break into chunks, rope bridge and posts, olives, stones, lamp, pomegranate tree, barley.
- **Sheepfold goal,** Super Mario World style:
  - The far post (hazy) is on the left; the gate hangs on it and swings back into the fold.
  - The near post (bold, plain) is on the right, in front of everything.
  - The golden olive rides the cord between them. The posts are 8 tiles, so a full single jump just reaches the top.
- **Jesse's courtyard** (home base, Castlevania-town style):
  - **The tithe:** the first thing on coming home after a world, before the market, **David** offers the first tenth of the olives he gathered in that world (Set aside / Not this time). Nobody asks him; Jesse only receives it. Never forced, nothing paid back. David remembers Abraham (Gen 14:20) and Jacob (Gen 28:22) in turn.
  - **Jesse stands just right of the bullseye** with that world's piece of the throw.
  - **Jesse's sprites:** `jesse_idle`, `jesse_talk` (loops while his words are up), and `jesse_cheer` (he points at the target and laughs; it plays on a centre hit). He's drawn facing left at `HOME.JESSE_SIZE` (1.2x David). The clips are in `david-sling-art/video/jesse_*`, and the reference image is `david-sling-art/jesse_ref.jpg`. **The trader** stands at the right end of his stall (`HOME.TRADER_X`), facing David: `trader_idle` (cut from the start of the talk clip), `trader_talk` while his words are up, and `trader_offer` (an open-hand "look what I have", cut from frames 70-112 of the clip) when the market opens. While you browse, he holds up what's highlighted: `trader_lamp` for lamp oil (the lamp is in the clip), and `trader_palm` (the olives Grok gave him are keyed out with the green) plus the item from `assets/items` drawn on his palm, set by `holds:` in MARKET.
  - **The practice throw:** Up at the spot by the bench (left of the target). David stands side on, like facing Goliath; enter the code and he slings a stone into the centre of the bullseye (too slow: it goes wide). `HOME.TARGET`, `THROW_FROM`, `STONE_FLIGHT`, `MISS_BY` in home.js.
  - The tenth of the flock (Lev 27:32) is saved for the end of the game.
  - **The shelf** opens the Journal.
  - **The market** sells lamp oil (20 olives â†’ 30 oil) and a fig cake (15 olives â†’ +1 heart next stage).
  - Olives and lamp oil carry over between stages (`gathered1`.. in the save counts every olive picked up per world, for the tithe); 100 olives still fills the flask for +1 life.
- **The throw code** (DESIGN Â§4c): the Konami code, one piece per world, for Goliath's final stone. "The Throw" is the last page of the Journal when read from the courtyard or a map.
- **Come-back secrets** (Castlevania-style):
  - **1-1:** The One is on a high shelf (needs the double jump, World 5).
  - **1-4:** The One is behind a one-mark carved wall (opens once Jesse gives â†‘ for the lion).
  - **1-3:** a two-mark carved hollow with a golden olive (after World 2).
- **Finding The One** pauses the game for Luke 15:4.
- **Bible text:** the World English Bible (public domain) everywhere, not the NIV.
- **Moves are taught,** saved once learned:
  - aim up: Shammah, 1-1
  - the harp calling sheep: Hanan, 1-2 (playing and healing work from the start)
  - the roll: Shammah, 1-3
  - full charged sling: World 2
  - double jump: Tobi, World 5. There's no aerial flip any more; the World 3 ox fight uses the roll.
- **World 1 checked for single-jump reach:** every required sheep, stone and goal can be reached with one jump.

## Not checked by hand yet (Glen)

- A full play-through of each stage with a controller: the feel of jumps, creature speeds, the night, the cave oil burn rate (`CAVE.OIL_EVERY`).
- Whether the lion fight still feels right without the full-power charged sling (tap stones only, 6 HP).
- Olives carrying over from a real stage clear into the market.

## Next

- **World 6 backgrounds in (2026-10-18):** Glen's sets w6_1..w6_4 (tools/make_backgrounds.py, magenta, mirrored); layer heights in TUNE.BG_LAYER_HEIGHTS. The far layers have no tower or giant on purpose: world6.js draws those. The World 6 opening/ending camp scenes use w6_1.
- **World 6 started (2026-10-18): 6-1 The Camp of Fear is built** with stand-ins (game/world6.js, loaded by world1.js;
  layout in main.js). The opening scene (w6intro: the cooking fire, 17:16, 17:25, the title card); 5 frightened
  soldiers (setPiece "fearful": play the harp beside one for W6.LIFT_T s and he stands and goes to his post; Tobi's
  hiding poses stand in, tinted per look; Glen's `soldier_fear` sheet (0 curled .. 5 nod) and `soldier_walk` drop
  straight in); springy tents (setPiece "tent", the `tent` item); supply wagons; the watch platform (5-3's tower);
  soldiers standing about (Eliab/Abinadab war sprites, tinted) with 17:25 lines; the Eliab scene at col 212
  (eliabScene: 17:26-30, Shammah, Proverbs 15:1 as narration); The One on the stacked wagons; the food flock's fold.
  Background: 5-4's dawn valley until Glen's 6-1 set. Map: World 5's painting with World 6's stops until his World 6 map.
- **6-2 No-Man's Land is built** (2026-10-18; world6.js, layout in main.js before 6-1). Volleys (setPiece "volley",
  c, GR, { to, shot }): on that ground the far slope shouts ("Loose!" / "Sling!"), shadows mark where every arrow will
  land (traced against the tiles, so they show on roofs too), then it comes down nearly straight. The bands shift
  each volley. Cover = `shelter(c, w)` in the layout: an overhanging rock open on the camp side (tall rocks don't
  shade a standing boy at that angle; tested). Knobs: W6.VOLLEY_EVERY/WARN, ARROW_VX/VY, BAND/GAP. The rise at col
  120 (setPiece "giantview") plays goliathWatch: 17:16, 17:4-7 with the Field Guide card filling in, Goliath's
  17:8-10, David, Psalm 3:6 as narration; then David writes the card in his Journal (progress.goliathCard; also a
  page when the Journal's read from the map). After it, the giant stands small on the far hill and booms every
  W6.GIANT_BOOM s. Card weights are the WEB's footnotes (coat about 110 pounds, spearhead about 13). Sounds:
  Glen's own voice as the Philistines (his takes in david-sling-art/world6/voices, mixed into crowds by tools/crowd.py):
  phil_shout(_2,_3) "Yeru!" (Shoot!) before each volley, phil_hedad(_2) a skirmisher's charge, phil_nusu(_1) "Run!",
  phil_roar the army jeering after Goliath. Volleys are arrow_single x9 with the odd arrow_with_stick-to-target.
- **6-3 The Water Carriers is built** (2026-10-18). setPiece "carriers" (3 men + Shammah, start of stage) fall in
  behind David on his footsteps (trailAt, after the lamb and sheep). setPiece "fill": a pool still holding water,
  empty jars fill walking through (first fill: Psalm 23:2 as narration). Volleys reuse 6-2's; on the shout the line
  ducks (W6.DUCK_H), a hit on a full jar spills it. Cover is `bank(c, w)`: a long undercut bank (a rock slab, no
  post, so you walk under it; 6-2's shelters lost their posts too, the post was a wall). The 5 frightened soldiers
  are the carriers who refused: lifted, they join the line with a jar (CARRY_LINES). Abinadab (setPiece "brother")
  gives the tower counsel, tier 1 (progress.towerCounsel). The deepest pool: stepping stones, a rock in the middle,
  The One on a ledge a double jump above it. setPiece "cistern" at the end counts the full jars (progress.water6;
  not used for anything yet: the water captain's trust/shortcut could read it). HUD box "Water jars: n / m".
- **6-4 The Tower's Shadow + BOSS the Philistine Watchtower are built** (2026-10-18; world6.js). Stage: tighter
  volleys (VOLLEY_EVERY 3.2), skirmishers (setPiece "skirmisher": charge with shield up, 2 stones / 1 charged and
  he drops it and runs), the forward trench (5 frightened soldiers under overhangs), the tower small on the far hill
  and its shadow creeping in. Every lifted soldier in World 6 is saved (progress.lift6[stage]; courage6() sums it).
  The tower (setPiece "watchtower" 160: one-screen arena, tower body = Glen's picture `tw_body` (2026-10-19; W6.TW_PIC/TW_BODY map its pixels onto the roof row, hubs and window holes; stones fly past shut shutters to an open one; lower windows take a jump-throw, upper ones a throw from the ladder top), `ladder(181, 12)`
  in the layout, roof plat row 6 added only in phase 3):
  phase 1 four shutters (tell = creak open W6.TW_TELL, open TW_OPEN), 2 stones into an open window knock his bow
  away (quick stones now carry `quick: true` in main.js, not used yet); seen side-on, misses fly on past the tower.
  Lower windows: flat throw from 4-6 tiles; upper: aimed up close in, or a jump throw. Courage: stones from the
  slope; an archer sometimes shoots at them, and a stone arriving at an open window makes him duck.
  phase 2 front-wheel pins, charged only (glint if progress.towerCounsel from Abinadab in 6-3; else a hint after 9 s),
  TW_PIN_HP 3 (counsel 2: 2); skirmishers every TW_SKIRM_EVERY. phase 3 up the ladder, double jump to the roof
  (the cut upper rungs), slingers lob stones (a charged stone knocks one out of the air), top beam TW_BEAM_HP 4
  (charged = 2), only from the roof. Falls backward, David leaps clear, the ladder goes with it, dust, shake;
  Abinadab quotes Deuteronomy 31:6 (Moses' words, so a character may say them). A fall in the fight resets it and
  Abinadab's tier-2 counsel (+1 heart, longer shutters, 2 pins). Boss music, camera lock and the finish gate are hooked
  like the chariot (towerFight/towerCam/towerBlocking). The One: under the tower's ramp at col 207. Not built yet:
  the End of World 6 scene (Saul's tent, the lion/bear flashbacks, Shammah's bag).
- **Art in, 2026-10-20:** Glen's wagons (david-sling-art/world6/wagons) replace the drawn ones in 6-1: `wagon_jars` /
  `wagon_arms` alternate (or `{ load }`), rim = the GR-2 bed (W6.WAGONS = rim height as a fraction of the picture);
  scenery `setPiece("prop", c, GR, { nm, size })`: wagon_rails, wagon_jars_34, wagon_arms_34, camp_shields, camp_spears
  (camp_jar_small cut, unused). Stones (david-sling-art/stones.jpg): items `stone` (grey: David's, drawStoneItem in main.js,
  tumbles), `stone_enemy_a/b/c` (brown: 6-2 volleys' slingstones, the tower slingers), `stone_gray_big` (spare),
  `stone_glow` (gold sphere, kept for Goliath's slow-motion stone). Glen as a camp soldier: `guard_glen_idle`
  (GUARDS[4], 6-1 col 207). **World 7 Goliath sprites (cut, not wired):** `goliath_yell` (loop), `goliath_spear` (turn,
  throw, point; once), `goliath_fall` (24 frames from just after the clip's side-on stone left, so ours comes in from
  the front; for slow motion), `goliath_face_hit` (close-up 400x400, center anchor, 24 frames: shouting, the stone
  strikes the brow, helmet cracks, falls back). Clips in david-sling-art/world7/goliath.
  Glen's tents (world6/tents.png, no ground under them) replace the old `tent` item in World 6: w 5 = `tent_family`,
  w 4 alternates `tent_goat` / `tent_shepherd` (or `{ look }`); the roof row is unchanged (still computed from the old
  picture so no jump changed), each picture is scaled so W6.TENTS (how far up it you land) meets that row. Tent roofs and
  wagon beds are in `specialPlat` so no rock ledge is drawn over them.
  Glen's stream (world6/stream.png) cut into items `stream_back` (far bank + water), `stream_water`, `stream_near`:
  6-3's fill pools are now a stream sunk into the topsoil (feet W6.STREAM_SINK in the water; the near bank and a
  see-through layer of water drawn in front of David, `drawStreamFront`), replacing the reed_pool picture. The deep pool
  (setPiece "pool" with `stream: true`; world2's drawPools skips those) fills its pit with the water, the far bank's grass
  along the top, and its stepping stones drawn as `stone_gray_big` standing up out of it. The other pools (2-2's
  tortoise pool, 3-2's two streams; world2.js drawPools) use `stream_water` alone, no banks (the pit edges are the
  banks): with stepping stones the surface is GR*T+4 and the stones are redrawn in front with their feet in the water;
  the tortoise pool's is GR*T+30 and see-through so his shell shows. Not changed: 2-2's flash flood (muddy, drawn) and
  2-3's waterfall (Glen's sprite).
  Glen's mud (david-sling-art/mud_slab.png, mud_flow.png, mud_trench.png): 2-2's flash flood is `mud_flow` (the
  splashing wall) in copies side by side, every other one mirrored, rolling along, led by `mud_front` (his "coming in"
  picture, mud_front.png: solid mud reaches the deadly line, spray and rocks fly past it). Glen's mudslide clip, HD
  (david-sling-art/mud_flow_clip_hd.mp4, 1952x608; the 976 one is the first take): `mud_surge` (frames 46-81, every frame,
  crossfaded loop, grid 6 across) is the chase front (W2.FLOOD_SURGE; false = the still mud_front); `mud_settle` (its
  ending, frames 116-145) fades in and plays as the flood drains while the wall sinks and fades. Both ship as WebP
  (make_manifest.py uses a sprite's .webp when there is one) and are drawn from grids (cols = sheet width / frame width).
  (the drawn version is still the fallback); 3-4's mud slicks are `mud_slick` sunk into the topsoil (world3 drawMud);
  `mud_body` (mirrored, seamless) is spare. mud_trench (a 3D cross-section) is saved but not used.
- **Music themes (Glen, 2026-10-20), Mario-style, not one song a stage:** night stages (STAGE_INFO.night, plus
  DARK_STAGES 2-4, 3-4 (the storm) and 4-4) loop `music_night` (his "Harp of Shadows"), inside caves `music_cave` (the other take);
  TUNE.DARK_MUSIC_VOLUME 0.4; off in boss fights, while he plays the harp and in pass scenes, half at the finish; no birds
  on dark stages. Day stages, under the birds (TUNE.DAY_MUSIC_VOLUME 0.3): World 1 `music_day_w1` ("8-bit Harp
  Jump"), World 2 `music_day_w2` ("Harps' Bounce"), then `music_day_a` ("Cascading Harp", 3/5/7) and `music_day_b`
  ("Harp's Dance", 4/8); World 6 `music_day_w6` ("Rhythmic Harp (1)", words taken out). Next (Glen): the dark songs for bosses. Glen says one of his songs has singing in it: cut it out once he says where.
  Stage clear = his `ending_jingle_levels.mp3` (the lyre `stage_clear` is the fallback).
- **World 7 started (2026-10-20): 7-1 Saul's Armor is built** (`game/world7.js`, layout in main.js `LEVEL_NAME === "7-1"`).
  David starts in Saul's armor (17:38): `W7.ARMOR_SPEED` walk, no running, `W7.ARMOR_HOP` hop, no sling, roll or
  double jump (main.js asks `ARMORED()`), clanks and thuds (made in code, no sound files), the helmet slipping over
  his eyes every few seconds (`drawWorld7Over`), 3 grey armor hearts hit first. Select standing still takes it off
  ("I can't go with these; for I haven't tested them", 17:39, WEB), Saul (saul_armor poses) looks surprised, then nods; the armor stays on the ground.
  The course stops him at the wall at col 45 (a real jump). Then 6-1's camp pieces (world6.js now runs in World 7
  too): 5 frightened soldiers, The One on Saul's tent roof. Stand-ins: 6-1's backgrounds, World 6's map painting for
  the World 7 map (map.js). Armored David is Glen's clips (david-sling-art/world7/david_armor):
  `david_armor_idle/walk/hop/slip/off`, cut with 50 px headroom for Glen to paint the helmet tops back in (the frames
  where the video cut it off are listed in each .json as helmet_cut_frames); the pile is the off clip's last frame. Art requests: ART_PROMPTS.md "World 7". Journal pages
  for World 7 are in journal.js (JOURNAL_TEXT.md's draft). Not built yet (at the time): the opening scene (Saul dresses him), Tobi's
  and Shammah's stops, 7-2 to 7-4 and the shield-bearer.
- **The World 7 opening scene is built (2026-10-21):** `w7intro` (world7.js), before 7-1 the first time (progress.w7intro;
  `?w7intro` replays it, `?w7intro=3` starts at that beat). Saul's tent (TENT_BG, as in the World 6 ending): the armor laid out
  (the last frame of david_armor_off, clipped), Saul's line, 17:38 with a flash into david_armor_idle, 1 Samuel 9:2 and the
  helmet sliding down (david_armor_slip from W7.SLIP_FROM), the lamb in Saul's spare helmet (DESIGN's co-op moment, shown
  to everyone; W7.LAMB_SIZE / LAMB_HELM), 17:39a with David clanking a few steps, the title card. 7-1's take-off line is
  now WEB: "I can't go with these; for I haven't tested them."
  Glen's two-person tent clips (david-sling-art/world7/saul_tent, white key, mirrored): `saul_dress` plays on the 17:38 beat
  (Saul putting the helmet on him); `saul_off` is the 7-1 take-off: Select in the armor cuts to the tent (`w7off`: 17:39,
  "Then David took them off. The king watched him, and nodded."), then back to the stage with the pile where he stood
  (so david_armor_off is now only the pile's last frame, and the fallback). Both pair sheets line up by W7.PAIR_SAUL/PAIR_DAVID.
- **7-2 Remember the Hills is built (2026-10-20):** the walk down the slope (Glen's w7_2 layers), the giant's taunts
  (17:8-10, setPiece "taunt") between five memory sections (setPiece "memory": the old world's own background layers
  under a gold shimmer + warm wash + "David remembers..."; the ground set stays 7-2's): 1-3 rocky pastures (crumbles,
  rope bridge, ram), 2-1 forest (boars, a deadfall, hornets), 2-3 cliffs (crumbles over a drop), 3-3 rooftops (houses,
  ladder), 1-4 the night of the lion (STAGE_INFO.night switched on inside it: night music and tint). Lost things: a
  remembered sheep in each (setPiece "memsheep": reach it, a line, it fades into sparkles). The One on the lion's rocks.
  Backgrounds for 7-3 (w7_3) and 7-4 (w7_4, far layer raised so the giant's shadow shows) are in, stages not built.
- **7-3 the Stones of the Name clip (Glen, 2026-10-21):** `nameVision` (world7.js) plays assets/video/name_stones.mp4
  (Glen's clip, original in david-sling-art/world7/name_stones; muted, re-encoded 1152 wide) the first time David reaches
  the first carving (progress.nameVision), A skips. Then its last frame (name_stones_last.jpg) stays up with that
  crossing's letters drawn big (right to left; a letter he hasn't found is worn away) and the clue. After the first time
  it never pops up on its own: Select at either carving shows the still; Select there opens the Journal's old letters.
  (Headless Chrome draws video black: checked in real Chrome instead.)
- **7-3 missing letters (Glen, 2026-10-21):** a Stones-of-the-Name letter David never found (Dalet, Waw, He, Yod; Worlds
  4-5, progress.letters, read when the stage loads) isn't carved on any stone: those stones are blank (`s.blank`) and give
  way like a wrong one (a life; the blank stone stays). The first time, David says which letter and where it might be
  (journal.js LETTER_PAGE.where) and to go back from the map. Find it and it's on the stones next time. The decoys
  (Bet, Gimel, Kaf, Mem, Shin, Lamed) always show; the Yod decoy on the Name crossing (the "Oh wait" trap) only once Yod is found.
- **7-3 Five Smooth Stones is built (2026-10-21):** the streambed (w7_3). Shammah's three lines at the first fire. Stones
  lying in the streambed (setPiece "pickstone", world7.js) shine faintly when David is near; Down lifts one for a
  close-up drawn in code (the game waits): A keeps it, B puts it back. Only "smooth"/"egg" stones go in the bag; jagged,
  flat, cracked and lopsided ones wobble. Some have a scorpion or a viper under them. 5 smooth stones are the lost
  things (HUD stone icon) and the gate needs them; the fifth opens a Journal note ("Why five?", 2 Samuel 21:22).
  **The Stones of the Name:** nameStone(c, r, cross, k, letter, right) in main.js, causeways of Glen's bridge blocks
  (material 6 under them). Crossing 1 over the spikes (Dalet-Waw-Dalet), crossing 2 over the deepest pool (stepped He,
  Waw, He, Yod). A wrong stone locks the jump (main.js busy asks w7Busy), cracks (name_stone_crumble) and drops him in:
  a life; it stays broken until the stage restarts. A right letter stepped out of order doesn't hold either, and
  jumping clean past a letter onto the far causeway puts him back at the start ("every letter, in order"). The first
  time he steps on Yod first: "Oh wait..." (progress.nameOhWait). The boulder before each crossing shows only the
  letters he's found; Select there opens the Journal's old letters. Crossing the Name opens a Journal note (the LORD in
  small capitals, Psalm 20:7). The One on a ledge over the pool, a double jump up from the Waw.
- **7-4 The Giant's Shadow and the end of World 7 are built (2026-10-21):** STAGE_INFO.quiet (no day music): a slow
  drum and the giant's footsteps made in code, louder as he comes; the screen darkens from the right. Tobi's warning at
  the first fire (tier 1: the shield rim flashes on the tell). Dry cracks (setPiece "spikes"), loose rocks, vipers,
  World 5's vultures; Eliab small on the far hillside, arms crossed (setPiece "eliab7"). The One behind the last boulder
  (fake rock). **The Shield-Bearer** (world7.js, setPiece "shieldbearer", arena 35 cols, camera held by shieldCam):
  phase 1 slam + shockwave, back hits while he heaves the shield up (3); phase 2 shield-first charges (roll under or
  get high), stone to the top edge while he peeks (3); phase 3 one charged stone to the edge while it tips. Goliath
  (goliath_yell, facing left) watches, says 17:43 and 17:44 in Glen's Hebrew, laughs. Tier 2 after a fall: Shammah's
  counsel, longer tell and tilt, +1 heart. No sheepfold: clear74() saves the stage and starts w7ending (the shield in
  the dust, the gifts screen "Everything you need, you already have.", 17:40, "To be continued in World 8"), then the
  Journal. Glen's shield-bearer sheets (sb_push / sb_drop / sb_run, W7.SB_SPR; clips in david-sling-art/world7/shield_bearer); lift = the push sheet raised, peek = sb_drop's first frames; the flat shield after he runs is Glen's assets/items/sb_shield.png, fitted over sb_drop's last frame (W7.SB_SHIELD_AT). After the bearer runs, Goliath walks in (giantIn in world7.js: Glen's goliath_walk sheet, a low boss_intro sting, footfalls, "Come to me..." 17:44) with Glen's war horns (assets/sounds/goliath_theme.mp3, 3 min, looped, from the moment the bearer turns away; heavy footfalls W7.GIANT_STEP_VOL), and if they're missing giantDrone, a low dark drone made in code (W7.DRONE_*; it's also the stand-in if the horns are missing: Glen found the slowed boss loop too uplifting under his words); no cheerful jingle at the end of 7-4, his music carries on low (W7.GIANT_MUSIC_END) under the World 7 ending until the Journal opens; the fight itself is World 8 (Glen, 2026-10-21). **World 8 (world8.js, 2026-10-22): 8-1 and 8-2 built.** 8-1 The Valley (cols 72, the w7_4 set, quiet): The One on the valley floor; past col 44 (setPiece words8) Goliath taunts 17:43-44 in Glen's Hebrew, then David answers, one A press a line (17:45-47, W8.WORDS), the last earning the throw's last piece (progress.throwFaith), then straight into 8-2. 8-2 Goliath (setPiece goliath8; Glen redesigned it 2026-10-24): a long run at him (W8.ARENA 200 columns, stage cols 206, the camera follows; he walks at most W8.WALK_MAX tiles; the crowd stands at the end, just behind where David reaches him) under his spears, one at a time and fast (W8.SPEED, W8.TELL): flat ones from the lowered-spear pose (goliath_thrust tell frames), low (W8.LOW_Y: jump) or high (W8.HIGH_Y, shoulder height: roll under), and within W8.DIAG_RANGE one thrown down from over his head at where David stands (Glen's overhead throw, goliath_overhead, 2026-10-24: his clip david-sling-art/world8/goliath_overhead, cut with vid2sprite and painted by Glen (his save kept as goliath_overhead_glen.png); frames 0-14 the wind-up over the tell, it leaves his hand at 15 (W8.OVER_HAND), 15-17 the follow-through; TUNE.SPRITE_SIZE.goliath_overhead 0.64 to match his other sheets; goliath_spear 5-11 if it's missing); stand still W8.STILL s and he throws at once. Each tell shows a streak at the spear's height (an arrow at the screen edge while he's off it) or a red ring where it will land; spears trail a pale streak; the next throw starts once the last one has passed David (only one coming at a time). The people you met call each one (g8Call). Reach W8.REACH_AT tiles of him: he laughs (goliath_point, taunting_yells), taunts 17:44, throws a W8.VOLLEY (4) spear volley up close (pips at the top), then laughs at the sky (goliath_roar): forehead open, the throw code (g8Code: the pieces learned + A) within W8.CODE_TIME + 0.1 s a saved stone; no extra hearts (Glen: just the ones you came with; the saved stones only lengthen the code's time); a miss costs one of the five smooth stones (never below 1), he laughs and throws W8.VOLLEY_AGAIN (6) more, then opens up again; a loss starts the run over with Shammah's counsel (longer tells, twice the time for the code). Difficulty scales W8.TELL, CODE_TIME and VOLLEY. The spears' pace (their speed, the tells, the gaps, his walk) is g8Pace() = W8.PACE (the one knob to try it quicker or slower) times DIFFICULTY[].spear (Easy 0.85, Hard 1.2) (Glen, 2026-10-24: base made faster, SPEED 2000, TELL 0.42/0.34, GAP 0.22; no Settings row, the difficulty is the setting). Win = giantFall, then abnerScene (world8.js: Saul's tent, 17:55-58 in WEB; Glen's abner_talk/walk/present, W8.ABNER_*; Saul is Glen's saul_talk clip (2026-10-24: david-sling-art/world8/saul_talk, vid2sprite --once --white --frames 48, played as a loop from frame 0 on each of his lines, frame 0 while he listens); #abner plays it alone; kid-clean: the end of 17:57 is left out), then the map. World 8's map is the World 7 painting for now (map.js 8:). the map shows no sheep/One/stones line for 8-2 (map.js NO_FINDS). **8-3 The Rout** (world8.js rout8; it runs itself via autoRun8 in main.js's held(); piles of dropped gear to jump, nothing hurts; phil_run fleeing ahead, soldier_run alongside; 17:51 (kid-clean end), 17:52, Psalm 144:1; The One in the abandoned camp; setPiece rout8end = clear and the map. (Glen, 2026-10-23) now 600 columns, about a minute, and a collecting challenge: the spoils (world8.js W8.SPOIL_PTS / ROUT_SPOILS / ROUT_FORKS / ROUT_CAMP): olives, bread and figs they dropped, lambs they stole (touch one and it runs back); from column 230 their camp, where raised boards split the way (spoils up top, others underneath: choose); a tally at the top (drawRout8Over), and at the end The Spoils of the Camp with 1 Samuel 17:53 and the best (davidProgress.rout8Best); A goes on to the map. The end line is now the real 17:52 (WEB).) and **8-4 Home** (the w8_4 sunset set, 1-1's tune slowed; everyone on the path, one line each (World 8 ART in world2.js drawCampfirePeople; lines are Claude's drafts for Glen to review); Eliab follows behind (eliab8); The One on the first hill; the fold, then w8ending (Hanan: "I heard.", the World 1 flashback, his last words, "The battle is the LORD's."), then the Journal with Glen's whole song (journal.js opts.song, journalSong), then credits8 (W8.CREDITS, the final score; all 31 Ones, W8.ONES (8-2 has none; it was 32, which couldn't be reached) = the Luke 2 secret ending). #credits plays the credits alone. **The whole game is built.** **The crowd (2026-10-22):** everyone you met stands behind David in 8-1 and, in 8-2, at the end of the run where David reaches Goliath (world8.js W8.CROWD: who, the stage they were met in, their sprites; the soldiers lifted in World 6 in a back row; Eliab always, at the edge); they bounce at "The battle is the LORD's." and whoever calls a warning in the fight steps up with their name over them. The water captain is in (Glen's clip, david-sling-art/world8/captain: captain_idle/captain_talk) on the slope and the path home. The old gleaner too (Glen's clips, david-sling-art/world8/gleaner: gleaner_idle/gleaner_talk). Still open: the post-game (Shepherd's Trial, stats page). The end of World 8: giantFall in world8.js plays assets/video/giant_fall.mp4, Glen's clips (david-sling-art/world8 + world7/goliath/goliath_face_hit) cut like an old action film by tools/make_giant_fall.py: windup, the stone in slow motion, two replays with white flashes (the second take, then the green-screen close-up keyed over a blurred camp), the fall in half speed; the clip is muted and W8.FALL_CUES puts the sounds on it (re-cut the video -> the script prints the new cut times -> move the cues). Then its last frame with 17:49, 17:50, 17:47 and the horn. Music: Glen's evil-theme, assets/sounds/giant_fall_music.mp3 (boss_loop slowed if it's missing, W8.FALL_MUSIC_RATE), its loudness shaped by W8.FALL_MUSIC_ENV (silent on the hit, low under the replays, cut when he lands). Watch it alone at index.html#giantfall. (2026-10-22, Glen) the wind-up is his windup_goliath.mp4 (wind-up run smoothly into the throw; from 5.17 s it is throw_hit_fall 3.98 s later), so every cue moved 1.79 s later; the close-up has the game's smooth stone (pick_oval, tinted grey) painted over his jagged rock by tools/patch_face_stone.py (STONE_PATH = where the rock is, frame by frame; STONE_SIZE), painted on after the slow motion, since slowing the stone smeared it ("watery", Glen); then Glen's forehead take replaced it (goliath_face_hit_forehead.mp4, 17:49: "struck the Philistine in his forehead"; it already has a smooth stone, so PAINT_STONE is off), cut on the crack before the helmet bursts so it matches the fall; the landing plays slow to the last frame of his clip and holds there (HOLD_END) so the dust is seen going up, framed wider than the screen so his shoulders run off its edges. **Stage music (Glen, 2026-10-22):** his orchestral themes (assets/sounds/theme_*.mp3, leveled to the harps) replace the harp on the dramatic stages, one a stage, in STAGE_THEMES (main.js): 4-4 wishes, 5-1 explore, 5-2 dream, 5-3 sleuth, 5-4 arete, 6-1..6-3 search, 6-4 wraith, World 7 capital (7-4 stays quiet); caves keep the cave music; TUNE.THEME_MUSIC_VOLUME. Not built: Gera's sling range. **5-1 villagers (2026-10-22):** Glen's four extra runners (villager_capman/wrapman/scarfwoman/basketgirl_run, one stride each from david-sling-art/world5/villagers_new; scarfwoman needs --soft, her cream dress picks up green) join the six; world5.js FAMILIES now shuffles every face through before any repeats, a child always with a grown-up. **5-4 pack donkeys:** every other one is Glen's second donkey (donkey2_stand/trot/gallop from david-sling-art/world5/donkeys2; his clips had a white bar along the bottom, cropped at y 574 first, and face left: --mirror); it trots after David and gallops when it's behind (W5.DONKEY2_GALLOP). It grazes until found (donkey2_graze, Glen's graze clip cut whole with --once, frames re-lined on the back hoof since the cutter centres on the head, grass specks dropped). **World 1 opening (2026-10-22):** w1intro in world1.js, the first time 1-1 is played (or ?w1intro): Glen's Bethlehem flyover and breakfast clips (breakfast2.mp4, his second take with the brothers young) cut into assets/video/w1_opening.mp4 by tools/make_w1_opening.py (the breakfast keyed full width over courtyard_w1), Eliab and Jesse over its last frame (Claude's drafts), the hillside (David's harp, the flock, Hanan on his rock) with Glen's song from the start, 1 Samuel 16:11, the title card. The stage music is silent under it (updateMusic). **World 2 opening (2026-10-22):** w2intro in world2.js, the first time 2-1 is played (or ?w2intro): Glen's clip of Hanan, David and the flock walking into the wilderness (david-sling-art/world2/opening/wilderness_walk.mp4 -> assets/video/w2_opening.mp4, muted, a 1 s fade in; the last frame w2_opening_last.jpg), "Summer / The grass around Bethlehem has dried up" over it (W2_OPEN.WORDS), a few baas, Hanan's line from DESIGN over the last frame, the title card. **World 3 opening (2026-10-22):** w3intro in world3.js, the first time 3-1 is played (or ?w3intro): Glen's clips (david-sling-art/world3/opening: news_run, elders_gate, eliab_preens) cut by tools/make_w3_opening.py into assets/video/w3_opening.mp4; a boy runs up the street and the video stops on him for his shout; 16:4 over the elders trembling at the gate as Samuel comes up the road with the heifer, the video stops on him for 16:5 (the sacrifice: so 3-1 is the day before it), then Eliab smoothing his hair, his line (Claude's draft), the title card. W3_OPEN holds the stop times (re-cut the video -> the script prints where each clip starts -> move them). Every world now has an opening. **Films before the game's own openings (Glen, 2026-10-22):** main.js preFilm plays a world's film (place words, a sound under it, A skips) and then starts its scene in the same frame; World 4 has the messenger riding for Bethlehem (david-sling-art/world4/opening/messenger_ride.mp4 -> assets/video/w4_film.mp4, horse-gallop under it) before w4intro; World 5 the giant at dawn over the Valley of Elah (world5/opening/giant_dawn.mp4 -> w5_film.mp4; 17:16 as its subtitle, Glen's "tenu li ish" shouts as cues) before w5intro; World 6 the frightened camp at night (world6/opening/camp_fear.mp4 -> w6_film.mp4; 17:11 as its subtitle, the night music under it, the Philistines' taunts faint across the valley) before w6intro (its scene is in daylight; Glen is happy with that, 2026-10-22: the game has campfires). World 7 David led to the king's tent at dusk (world7/opening/saul_tent.mp4 -> w7_film.mp4; 17:31) before w7intro. World 8 had no opening: now Glen's film of David walking down into the valley alone (world8/opening/valley_walk.mp4 -> w8_film.mp4; 17:40) and a title card (world8.js w8intro, "WORLD 8 - David and Goliath") before 8-1. 17:40 is now quoted in the current WEB wording everywhere ("the pouch of his shepherd's bag which he had"). Opening videos now start on the first frame drawn, not while the sprites load. Voices: tools/voice.py makes Glen's recorded lines a boy, an old man or the giant (his first test, david-sling-art/voices/david_my_boy_raw.m4a); for now the films use subtitles. **Scenes (menu.js FILM_CLIPS):** every world's opening, whole (its film, words and scene, played by the game: the entry loads index.html?wNintro&scene#N-1, main.js SCENE_ONLY sends it back to index.html when the opening ends, and menu.js boot reopens Scenes from sessionStorage davidScenesBack; from a stage's pause menu an opening asks first (A twice), then comes back into the stage at the last campfire: ?at=, with sessionStorage davidScenesBack holding the URL), the Anointing, the Stones of the Name, the giant's fall (played with its cues and music). **Journal notes (Glen, 2026-10-22):** the notes David writes in the middle of a stage (the giant's Field Guide card in 6-2, the Name and the five smooth stones in 7-3) are kept in the Journal with their world's pages (journal.js journalNotes), so the Journal read from home or a map has everything he wrote once those stages are cleared; the old letters stay a page at the back; the torn-out pages stay gone (only the stub shows), on purpose. **Difficulty (Glen, 2026-10-22):** Settings > Difficulty, Easy / Medium / Hard (SETTINGS.difficulty; main.js DIFFICULTY, applyDifficulty, called at the end of menu.js once every world's table exists). Medium = the game as tuned. Easy: +2 hearts, 7 lives, a longer blink after a hit, boss warnings and openings x1.35, bosses x0.7 hits. Hard: a hit costs 2 hearts, 3 lives, a shorter blink, warnings and openings x0.75, bosses x1.35 hits. It takes hold at the next stage. **Shepherd's Trial (post-game, trial.js):** title screen > Shepherd's Trial once 8-2 is cleared (menu.js trialOpen); every boss (TRIAL_BOSSES: stage, start column, beaten test), loaded as index.html?trial&at=<last fire before the arena>#<stage>; no counsel (TRIAL guards on each world's tier-1 and tier-2 counsel, the stones of remembrance and fig cake; nobody talks at the fires), a clock bottom right, and once the boss is down the time and the best for that difficulty (localStorage davidTrial); A back to the list, B again; Goliath's fall film is skipped there. **Gera's sling range (range.js, #range):** a side stop on World 7's map, Down from 7-3, at the carved target by the stream (map.js MAP_WORLDS[7].sides; side stops are new: sideSeen/sideOpen, prog.side). Shown once 7-3 is cleared, open once every lost thing in 7-1..7-3 is found (DESIGN). A 60 s round (RANGE in range.js: posts, ropes, swings, jars on the far wall, small gourds; two hits within 0.6 s = Gera's +1); bronze/silver/gold 15/30/45, an olive per 5 points, best in davidProgress.rangeBest; the first gold gives Gera's verse, Psalm 18:34 (WEB), which goes in the Journal with World 7's notes (rangeNote). Gera's lines are Claude's drafts (RANGE_LINES). SCENES_ALL_OPEN also opens the Trial and the range for testing. SCENES_ALL_OPEN in menu.js is false again (2026-10-26, for Glen's level-by-level play-through): scenes, the Trial and the range unlock as they're reached; true opens them all for testing.
- **The End of World 6 is built** (2026-10-18; world6.js `w6ending`, after 6-4's finish; `?w6end=N` to test).
  Glen's art: `saul_tent.jpg` (backgrounds), `saul_armor` (6 poses: listening, "you are not able", leaning in,
  surprised, thinking, smiling/nodding; also for World 7's armor scene), `commander_tent` (old/young, arms folded,
  then impressed/surprised), `shammah_bag` (4: holding it out, laughing, patting it, a nod), item `shepherd_bag`.
  17:31-37 in WEB; David's lion and bear come back as sepia memories in a frame (stills of the World 1/2 sprites,
  not a replay of the player's own fight yet). Gift: progress.bag (no effect yet: meant to hold special stones).
- **Playtested by Glen (2026-10-18):** 5-2 (the leopard) and 5-3 (hiding from the lookouts) are good as they are; the
  lookouts who spot you may get tuned later. The 5-4 chariot is beaten and tuned. Next: World 6 (art requests for
  the map and 6-1 are in ART_PROMPTS.md; DESIGN 5f is still marked draft).
- **The Stones of the Name moved to 7-3** (Glen, 2026-10-18; DESIGN 7-3): no more side dot off 5-2. The letter trail
  stays in Worlds 4-5 (Yod 4-1, He 4-2, Waw 4-3, He 4-4, Dalet 5-1). Required to finish 7-3 but not a boss; a wrong
  stone costs a **life**. The Journal (read from a map) now has an "Old letters" page (journal.js `lettersSpread`):
  each found letter copied in ink, missing ones as "( ? )" with a hint of where. Build the pool itself with World 7.
- **People as Grok clips:** (Jesse and the trader done) at the stall, Hanan, Shammah, Eliab, the shepherd girl, the neighbor. Today they're names over their lines.
- **The ram's charge** clip (it uses its walk, sped up).
- **World 2 (started 2026-10-13):** `game/world2.js` (loaded from world1.js, not index.html, so a cached index.html can't miss it) has the wild boar (scrape = the warning, then a straight charge; tap stones bounce, a full charged stone stuns it and it runs off), deadfalls (material 8, `deadfall()` in main.js: piled logs too tall to jump, only a charged stone breaks them) and Hanan sitting at his campfires (`hanan_sit`).
  - **2-1 The Forest Trail is built** (main.js, `LEVEL_NAME === "2-1"`): Abinadab's two lines, Hanan's fire teaches the charged sling right before the first deadfall, three boars, branches up to a ledge lamb, hornets by a honeybee hive, a second deadfall under a rock overhang, The One at the top of a treetop climb. Ground set `assets/terrain/w2f` (forest), background `w2_1`.
  - **The World 2 map** is Glen's painting (`assets/maps/world2_map.jpg`): camp, woods + campfire, wadi, Tekoa, cliffs + spring, the bear's ravine and pen. Home is still Jesse's courtyard.
  - **No Journal pages for World 2 yet** (locked text needs Glen): clearing 2-1 goes straight back to the map.
  - **2-2 first half** is in: dry wadi (`w2_2` / `w2s`), Hanan's flood warning, the boy's donkey bolting under an overhang (col 74-89). Sit and play the harp near it â†’ **the harp duel** (world2.js): Glen's harp recording plays, notes slide in on six strings (low Down â€¦ high Up), a wrong/late note stops the harp and restarts that tune; 3 tunes calm the donkey, who then grazes and follows David.
  - Harp songs: `python tools/make_harp_chart.py <song.mp3> <name> --start S --end E --gap G --phrases 4,5,6` â†’ `assets/audio/harp_<name>.mp3` + `game/harp_songs.js`. Donkey = Morning Meditation 2, 28â€“62s, gap 1.0 (originals in david-sling-art/audio). Saul later: tighter `window`, faster `speed` in HARP_DUEL, plus the rage/peace meter. Plan agreed with Glen: Saul's torment = **Harp of the Deep** (david-sling-art/audio; dark, drums, builds at 75s) playing underneath; David's notes are charted from **Morning Meditation 1** (clean harp). Streaks crossfade David's harp up and the dark song down; misses let the dark song swell back; rage peaks = the spear.
  - **2-2 second half** is in: checkpoint campfire at 151; past col 156 the flash flood (world2.js `updateFlood`) chases from the left at 250 px/s, never more than 13 tiles behind; touching it = swept back to the campfire. The boy from Tekoa is stranded on a rock at 185 (jump up to him), then follows in David's footsteps (`trailAt`). Out of the riverbed at col 268 the water drains; on the bank his donkey waits, then "Why do you carry those stones?" (holds the controls; A skips a line) and the boy picks up a stone. The gate won't open without the boy. Fold at 284. The frightened donkey tramples (a heart, knocked back toward the left, never through). Tuning: W2.FLOOD_*. Placed with `setPiece()` in main.js.
  - **2-3 The High Cliffs** is in (cols 196, `w2_3` / `w2s`): rock columns (`pillar`) rising over deep drops, crumbling ledges, Hanan at the start, checkpoints at 71 and 120. **Eagles** (world2.js, `setPiece("eagle")`) circle and dive at your lamb, carry it up; any stone hit makes them let go and the lamb drops to the ledge below. **Ibex** (the ram sprites) leap ahead along a path as David comes near; the second one (col 54) shows the high goat route to The One (col 78). **Wind** between cols 80-128 gusts from the right every few seconds (streaks warn first); crouching braces. Down into the spring valley and the fold at 175.
  - **2-4 The Bear's Ravine** is in (cols 258, `w2_4` / `w2f`): wolves in pairs (`critter("wolf")`, world2.js: sit, rise, run at David, run past and wheel round; a stone drives one off), claw marks (`setPiece("claws")`), a tree crash at 102, the deadfall again, The One up the ravine wall, Hanan's last campfire (120) + talk (127). **The Bear** (`setPiece("bear", 226, ..., { arena: 198 })`, world2.js): at the pen wall with a sheep pinned; like the lion, it notices David entering the arena, turns and growls (`notice`, 1.3 s), lets the sheep go and comes for him (a charged stone to its back turns it sooner) → walks, slow to turn; scrape (gold glow) → charge; sits back and roars (gold glow: a full charged stone staggers it, 2) → slams (ground shake; be in the air) with rocks falling; close swipe (lunge). Dazed: tap 1, charged 2, Power 3. HP 8, quicker below half. Last stone = the lion's slow-motion finish. Gate blocked until it's beaten. Boss music via `bearFight()` in updateSound. It also hurls boulders (Glen's throw clip: wind-up then the same frames reversed = forward shove; the clip as-is = over its shoulder when David jumps over it, then it's facing him); boulders arc through the ledges, bounce once, roll ~1.6 s. Rear-up roar / come-down-hard slam / head-down growl are from Glen's rear-up clip (colour matched). Not built yet: the log bridge that breaks (phase 3), World 2's ending scene.
  - 2-2 has the low passage (rock 50-57, crawl height) with two scorpions (sting on touch) and a hedgehog (col 42) that wakes as David comes, trundles through and eats them; hit it and it runs off. Crouching throws now leave from 40px up (main.js), so the scorpions can be hit from a crouch. `spriteBox` gives small animals a body box from their sprite.
  - 2-2 pool (cols 104-114, floor at row 19) with the tortoise (`critter("tortoise")`): plods along the bottom, its shell is one-way tiles at the waterline that carry David; a stone makes it hide in its shell 3 s (Glen's clip). Water = pitFall. The hedgehog also balls up when David runs at/past it, then carries on.
  - 2-2 oleander (`setPiece("oleander")` + deco at 22, 95, 137): the lamb wanders to it (`lambDrift` in world2.js, from updateLamb); pick it up or play the harp to call it back; if it eats, -1 heart.
  - **End of World 2 scene** (`ending` in world2.js; main.js runs it after the 2-4 clear, before the Journal): night pen, the boy and his father (Glen's leatherworker clips: walk, talk, idle, give) bring the leather sling pouch (Glen's art, assets/items/sling_pouch.png), Hanan's line, Psalm 18:1-2, David plays. Gift saved as davidProgress.slingPouch: CHARGE_TIME x0.8.
  - Not yet in 2-2: the Psalm 18:16 scroll, World 2 Journal pages., 2-3 (cliffs, ibex), 2-4 (ravine, wolves, the bear). Sandstone ground set `w2s` is ready for 2-2 and 2-3; backgrounds `w2_2`..`w2_4` are in.
- **Music:** "Hush Little Seed" (Glen's harp, first 23 s, `assets/audio/title_loop.mp3`) plays on the title and the maps; full song in `david-sling-art`.
- **Sounds still needed:** real hurt and death sounds, night crickets for 1-4, fox and jackal yelps, the ram's stamp, gate creak, campfire crackle, bees, snake, eagle.
- **Licenses:** fill in the blanks in `assets/sounds/SOURCES.md`.

## Other docs

| File | What it holds |
|---|---|
| `DESIGN.md` | The story and level bible, all 8 worlds. Â§4c: journey map, home base, olives, the throw code, the double jump plan |
| `JOURNAL.md` / `JOURNAL_TEXT.md` | How the Journal plays / its words |
| `SONG.md` | "The Shepherd Leads Me" (Glen's song; stays as is) |
| `SPRITES.md`, `VIDEO_SPRITES.md`, `ART_PROMPTS.md` | Sprite lists, the Grok-to-sprite pipeline, art prompts |
| `assets/sounds/SOURCES.md` | Where each sound came from |

## War gear brothers (for the army camp / Valley of Elah)
Sprites `abinadab_war_walk/idle/talk`, `shammah_war_walk/ready/draw`, `eliab_war_walk/idle/talk` (clips in
david-sling-art/video/*_war.mp4, cut with `vid2sprite.py --white --thin 41`, which sizes on the body and ignores the
spear). Same height as each brother's everyday sprites. `abinadab_war_talk`, `shammah_war_draw` and `eliab_war_talk` have
40px of `--headroom` so Glen can paint in the spear/bow tips the video cut off. Not placed in any level yet.
`david-sling-art/video/samuel_anointing.mp4`: Samuel anointing, for the anointing scene later.
`david-sling-art/video/anointing_of_brothers.mp4`: all eight sons lined up (Eliab in war gear first, David last) for
1 Samuel 16:6-11, Jesse's sons passing before Samuel. Its background is a baked-in grey checkerboard (a fake
"transparent" pattern), not a flat screen, so it needs its own key (checker colors) before it can be cut.
USE `anointing_of_brothers_white.mp4` instead: the same lineup on clean white, tested with `vid2sprite.py --white`
(keys cleanly, all eight in one sheet; the brothers chat and David steps forward near the end).

## Later: brothers turning to make way (Glen wants to see the current version play first)
Courtyard brothers (home.js, `HOME.MAKE_WAY*`, `TURN_TIME`) step back up-screen behind David when he walks into them and
squeeze-turn to face him. Planned upgrade: a Grok clip per brother, "turns toward the camera, two small steps back,
nods, turns to face the other way", cut as `<name>_makeway` and played instead of the walk steps. Use the same
behavior for the war-gear brothers in the army camp.

## World 3 (started 2026-10-14)
3-1 The Day Before and 3-2 The Far Pasture are built and playable. World 3 map: Glen's Bethlehem painting
(assets/maps/world3_map.jpg); the trail to 3-4 passes the altar and the well (no stops there yet).
Code: game/world3.js (loaded from world1.js after world2.js). Level helpers in main.js: house(c, w, roofRow) = solid
material 9 drawn from Glen's side-view houses (town_house_shed/big/tower/fort, sliced so roof and door keep their shape,
picked by size); ladder(c, topRow) = Glen's ladder, rungs every 3 rows; stair(c, h); stairTower(c) = Glen's tower with
its own stair (climb the stair, jump onto the top at row 7); setPiece "barley" / "granary" / "threshing".
Creatures: critter("crow") (raven art, pecks, hops off when David runs at it, a stone sends it away; a cleared field
drops bread) and critter("rat") (drawn shapes until a rat clip; cleared granary drops cheese). The granary's whip snake
on the beam slides down when David walks in under it and the rats bolt (sling the snake = Care miss).
Backgrounds: w3_1 from Glen's "3-1 far/mid/near.png"; ground set ter "w2s" (dry, no grass).
3-2 (World 1's w1_2 background until Glen's 3-2 layers): lostSheep(..., "flies") = flies at its eyes, press Down to oil
its head (costs W3.OIL_COST olives from the HUD flask, Psalm 23:5); critter("rustler", c) beside campfire(c) = once you
go on past that fire with sheep resting there, a thief sneaks in from behind, grabs one and runs; a stone makes him drop
it (stand-in art: abinadab_walk darkened, until a rustler clip); stepStone(c) = a rock in a stream (one-way ledge,
drawn in world3.js) over setPiece("pool", c, GR, { w, say }); thicket(c, r, w, h) = a thorn thicket only a charged
stone clears (The One is behind it). Each campfire plays a scene in town (PASS_SCENES: Eliab; Abinadab and Shammah;
the other four; 1 Samuel 16:6-10), seen through Samuel's eyes, no Samuel on screen. Shammah runs in at the end.
3-3 (3-1's w3_1 background until Glen's 3-3 layers): fence(c) = rails at rows 13-14, open underneath (jump it or roll
under, drawn in world3.js); guide(c, r, line) = Shammah's stops: he waits, calls the line when David catches up, runs
to the next (resets to the checkpoint's spot after a fall); the town wall rock(165, 8, 9, 7) with setPiece("drain") under
it and The One inside. The stages have no music track, so "the music speeds up near town" isn't done.
The Anointing (world3.js `anointing`): a story stop on the World 3 map (id "3-A", `story: true`, a gold star at the
altar by the well). After 3-3, the map walks David there by himself and plays it ("#3-A" loads 3-3's ground and runs
the scene, then marks 3-A cleared and opens the trail to 3-4). A at the star replays it. Sprites from Glen's clips: brothers_line (all eight sons, David at the
end steps out) and samuel_anoint (walk in, raise the horn, pour). Positions in ANOINT (horn tip / David's head measured
from the sprites). Harp music plays for the Spirit (16:13); the last card explains "anointing" and "Messiah".
3-4 The Chosen Shepherd (STAGE_INFO storm: true; bg w3_2 until Glen's 3-4 storm layers): world3.js storm (dark
overlay, rain, lightning every W3.LIGHTNING s), the fallen oak over The One (setPiece "oak": roll in), wind gusts
(world2's setPiece "wind"). The Wild Ox (setPiece "ox", { arena, end }; setPiece "oxtree" x3; "flockHuddle"): phase 1
charges the flock, a charged stone turns it; phase 2 roll under its charge by a tree, horns stick (W3.OX_STUCK), any hit
splits that tree; lightning can drop a branch near David; phase 3 hit it while it skids (W3.OX_HITS3), then it runs off
(driven off, not killed). REDONE 2026-10-15 to Glen's design: an arena between two oaks (setPiece("oxtree", 183) and
214, a 2-tall rock outside each to hop in/out; flock huddle at 177). The ox stays between the trees and only fights while
David is inside (outside: it trots to the middle and waits, so you can't snipe it from the campfire). Tell (paw, facing
David) -> charge the length of the arena (roll under) -> at the far end it either rams the tree and sits dazed (OX_STUCK
2.6s; the only time a charged stone counts) or skids short and turns (OX_HIT_CHANCE 0.5, never more than OX_MISS_MAX 2
misses in a row). OX_HITS 3 -> shake -> flee. Each hit makes it OX_FAST 1.15x quicker. oxBox is tall now (stones from
across the arena rise a little; the old knee-high dazed box let them sail over). Art: Glen's four ox sheets cut with `sheet2sprite.py --blobs` (each figure by its own outline; sources in david-sling-art/world3/ox_*_sheet.png): ox_windup (the tell), ox_charge (charge/skid), ox_dazed (hits the tree, sits dizzy; shake = getting up), ox_gallop (flee). W3.OX_SIZE 1.6; anchors set at the nose (the hit box runs back from ox.x). Slippery landing: in 3-4 a hard landing (fall > 600) plays `david_slip` (Glen's 6-pose sheet on green, david-sling-art/world3/david_slip_sheet.png, keyed to magenta then sheet2sprite --blobs); he slides forward and can't move or jump for TUNE.SLIP_LOCK 0.5s (TUNE.SLIP_MS/SLIP_SLIDE/SLIP_MUD). Not done: counsel tiers.

**2026-10-15 (after the PC restart):**
- 3-4 backgrounds = Glen's storm set `w3_4`. Ox-fight trees = Glen's oak sheet (assets/items/oak, oak_gashed while the ox
  is stuck in it, oak_split after; W3.OAK_H). The One's hollow = `oak_fallen` (W3.OAK_FALLEN_*).
- **End of World 3 scene** (`w3ending` in world3.js; main.js runs it after the 3-4 clear, before the Journal; `?w3end=N#3-4`
  jumps to step N): Glen's sunset set `w3_end` (the storm layers fade off it), Hanan walks in, 3 lines, holds out the staff
  (hanan_give_staff), the two of them (hanan_staff_to_david, then hanan_david_raise_staff: two-person clips cut on one
  fixed frame, anchor 105 px left of David's feet so they line up), gift card = davidProgress.staff = +1 max heart for good
  (main.js), David walks back to the flock (david_walk_staff), 1 Samuel 16:7 (WEB), a rider far off (stand-in: a dark
  donkey + rider until a messenger clip), David plays by the fire with Hanan standing (hanan_idle_nostaff: he gave his
  staff away; his other sprites all hold one). drawStaff() uses assets/items/staff.png once Glen paints it.
- End of World 2: Hanan now walks in (hanan_walk); `?w2end=5#2-4` jumps there.
- 3-2: Glen's thief sheets (thief_stand/pickup/run): sneaks bent over (pickup frames 1-2: no sneak sheet yet), grabs,
  runs with the sheep held up in his raised hand (W3.THIEF_HAND), looks back. Glen's stray dog (dog_sit/walk/run) plays the
  jackal in World 3 (k.art = "dog"; the lamb drawn in its jaws, CRITTER_ART.dog.mouth).
- 3-1: hens (critter "hen": chicken_peck/run, W3.HEN_*), scatter when David runs at them; a stone is wasted on them.
- Cut but not placed: sheep2_walk (Glen's cuter sheep: ask where). Meta's sheepfold-with-shelter art: Glen said SKIP it
  (2026-10-15); the stage end stays the two-post gate.
- Headless testing: the game's update doesn't run under --virtual-time-budget, so set state by hand in a temporary
  appended script (and camX = david.x - W/2) and screenshot; restore the file after.
- 3-1: Father's stray goat (critter "goat" at col 82, by the woodpile; world3.js updateGoat). Walk up to it and it
  follows; it leaps after David onto roofs and ladders, jumps the gaps between roofs, and catches up if left far behind
  (W3.GOAT_LOST). Home = near Jesse (W3.GOAT_HOME 214), where it stays grazing. Glen's sheets (transparent PNGs in
  david-sling-art/world3/goat_*_sheet.png): goat_walk, goat_run (--blobs), goat_stand (cut by a scratch script lined up on
  the tail, since pose 5 grazes head-down and touches pose 6). Also meant for World 4 (Jesse's young goat for Saul, market
  and palace goats).
- Anointing stop (#3-A) revisited after it's cleared: `afterAnoint` (world3.js) instead of the scene. Samuel has gone
  home (16:13); one of the family sends David back to the sheep, a different one each visit (progress.afterAnoint):
  Jesse, Shammah (proud of him), Eliab (sour, sets up 17:28), Abinadab (well done; points to the pastures). A: back to
  the map, B: watch the anointing again. Lines in AFTER_ANOINT.
- Ladders are climbed now (main.js state "climb", ladderAt()): hold Up in front of one (or Down at its top) to grab on;
  Up/Down climb at TUNE.CLIMB_SPEED, no gravity; A jumps off; top = steps onto the roof, bottom = back on the ground.
  Getting hit knocks him off. The rungs are still one-way ledges (you can jump onto them; carrying the lamb, Down still
  drops a rung). Art: david_climb (Glen's back-view strip, david-sling-art/world3/david_climb_sheet.png, green keyed to
  magenta, sheet2sprite --blobs, height 270), 4 frames: right hand up, level, LEFT hand up (pose 4 of Glen's david_climb_left_sheet.png), level.
  Top of a ladder with a roof beside it (ladderRoof): state "topout" plays david_topout (tools/cut_topout.py: Glen's
  back strip poses 0-1 + side strip poses 1-3, david-sling-art/world3/david_topout_*_sheet.png): hands at the edge,
  pulling up, climbing over, hands and knees, stepping off onto the roof (TOPOUT_POS per-frame feet offsets). Down on the
  roof beside the ladder top plays it in reverse and puts him on the ladder.
Not done from the design: the Micah 5:2, Psalm 139:1 and Psalm 78:70 scrolls (no scroll system yet),
the harp phrase at 3-2's campfire.
- Messenger (Glen's clips, 2026-10-15): messenger_gallop rides across the far hills in the End of World 3 scene.
  Cut for World 4 (1 Samuel 16:19, at Jesse's door), not placed yet: messenger_stop (slows to a stand),
  messenger_dismount (hops down), messenger_talk (talking with his hands, loop).

## World 4 (started 2026-10-15)
- Map: Glen's painting (assets/maps/world4_map.jpg, 2048 x 1152; source david-sling-art/world 4 map.png), stops in
  map.js MAP_WORLDS[4]: home = Bethlehem gate, 4-1 on the vineyard road, 4-2 the training yard, 4-3 the market town
  (through the kitchen-fire gate), 4-4 the king's hall. BUILT_WORLDS includes 4 so the map opens; its stages say "not
  built yet" until they're in BUILT_STAGES. Landmarks painted but not stops yet: the vineyard keeper's watchtower
  (~660,690), the servants' kitchen fire (~790,350), the rooftop garden (~350,330), Jebus (right, off the path).
- The map card still says "Sheep found": World 4's lost things are gifts/goats/harp parts/lamps (DESIGN 5d).
- 4-1 backgrounds: set `w4_1` (Glen's 4-1 far/mid/near, magenta keyed; mirrored; mid 400 / near 190) is in the loader,
  ready for STAGE_INFO "4-1" bg w4_1 when the stage is built. make_backgrounds.py now skips a missing layer (borrow it).
- donkey_packs_walk (Glen's 5-pose sheet, david-sling-art/world4/donkey_packs_walk_sheet.png, green keyed, --blobs,
  height 200 like the World 2 donkey): the gift donkey for 4-1. Not placed yet.
- donkey_packs_scared (Glen's 4 poses: startled, half-rear, full rear, backing away; --once, scaled to match the walk).
- Doves (Glen's, white): dove_walk (6, loop, 110 px tall) and dove_fly (6: frames 0-2 = take-off from the ground, 3-5 = the
  flight loop, lined up on the beak; drawn at the same body size as the walk). For 4-1's road (harmless: Shepherd's Judgment).
- vineyard_keeper (Glen's 6 poses, facing left; one sheet, pick the frame: 0 standing, 1 talking, 2 pointing back over
  his shoulder, 3 shaking his head, 4 laughing, 5 waving goodbye). Keyed like the bush (his grape leaves are kept).
- wineskin (assets/items, 240 px): the gift that falls off the donkey in 4-1. All 4-1 art is in; next is building the stage.

## 2026-10-15 late: sounds, Journal, jackals
- Glen's animal/storm sounds are wired (assets/sounds/SOURCES.md has the map): thunder x3 (3-4), rain loop (TUNE.RAIN_VOLUME,
  STAGE_INFO.storm; fades in w3ending), eagles' dive, ravens/crows, jackals, wolves (howl/growl/bark). hyena_1-3 unused.
  sfx() now skips files that failed to load (SFX[n].missing); sfxOne(names, x, vol) picks one at random.
- World 3 Journal pages are in (JOURNAL_PAGES[3], from JOURNAL_TEXT.md's draft, like World 2's). 3-2's rip-out isn't.
- Stray-dog art plays the jackal ONLY in 3-2 (Glen: 3-4's jackal is a jackal).
- Testing: never append test code to game/*.js (Glen plays it live). Use the untracked copy david-sling/simgame/
  (cp game/*.js simgame/, excluded in .git/info/exclude) and wrap headless Chrome in `timeout 60`.
- 3-4 is longer (cols 310, 2026-10-15): after The One, mud slicks (setPiece "mud": TUNE.MUD_GRIP 0.25, world3.js onMud/
  drawMud), a rock climb to a high ledge and a drop into mud, three foxes hiding in bushes (ambushFox(c): hidden until
  David's 3.5 tiles off, then they leap out; thorn_bush art for now), a halfway campfire (196), a second wind stretch, the
  ox campfire at 244, the arena 255-286, the fold at 299. Still three special stones.
- Ox arena trees take three rams each (tr.rams; OX_TREE_RAMS): whole, then gashed (oak_gashed from 2 rams), then split ->
  "breakout": the ox gallops out, the flock scatters, and after OX_BREAKOUT the fight resets with David at the checkpoint.
- **4-1 The Road to Gibeah is built** (2026-10-15; game/world4.js, loaded by world1.js after world3.js; layout in main.js;
  STAGE_INFO "4-1" cols 262 bg w4_1; in BUILT_STAGES). Opening scene w4intro (first time only, progress.w4intro; ?w4intro
  replays): Bethlehem (w3_1 layers), messenger rides up/stops/dismounts, 1 Sam 16:19 and 16:20 (WEB, checked on ebible),
  Eliab "Him? For the king?", donkey and goat led in, Hanan's farewell (DESIGN), title card. The stage: gift donkey
  (critter "giftdonkey": follows, hops rocks, catches up if far; gifts ["bread","wine"]), Father's young goat follows
  (world3 goat, follow preset, W3.GOAT_HOME = 1e6), village dogs (bark, spook the donkey -> it balks until David plays the
  harp within 6 tiles for 1.6 s), bandits (thief art; steal the wine/bread; a stone drops it; walk over it to reload),
  doves (harmless), crows (fair game), 3 boars, the vineyard keeper (talk + Glen's sheet; thanks you with grapes when the
  two vineyard boars are gone). 5 lost sheep + The One on a terrace; 3 special stones; the finish gate is blocked until
  both gifts are on the donkey and it isn't balking (giftsBlocking). Ends at a village sheepfold (sheepfold(246)).
  donkey_bare_walk (Glen): once a gift is stolen the donkey switches to it and the gifts left ride on his back (DONKEY_BACK). Not yet: DESIGN's "5 dropped gifts as the lost things"
  (it uses 5 lost sheep from the villages for now); World 4 Journal pages; the Psalm 121:8 scroll.
- 4-1's lost things are Father's five extra gifts (Glen's sheet -> assets/items/gift_bread, gift_oil, gift_figs,
  gift_cheese, gift_honey): lostGift(name, c, r) in main.js, world4.js updateLostGifts/drawLostGifts/drawLostThings
  (the HUD counter and the clear card say "gifts"). Hidden NES/Castlevania style (Glen): figs on the road (so you know
  what to look for), bread in a hollow under a rock shelf behind a deadfall (charged stone), oil inside an outcrop whose
  left end is fakeRock (walk in), cheese on a high ledge above The One's terrace, honey inside an outcrop whose loose
  stone is at the far right (look back). A dead tree (deadfall) blocks the road at 240. 4-1 is now 316 cols, fold at 300.
- **4-2 The Training Yard is built** (2026-10-15; layout in main.js, pieces in world4.js; borrows w4_1 layers). Gera
  (made up, left-handed Benjamite, Judges 20:16 WEB) teaches skill "quick" (quick release: a second tap during a throw
  sends a second stone just after the first; main.js d.quickQueued/quickUsed). 20 targets and jars (setPiece "target"
  static / { move: "rope" } / { move: "swing" }, setPiece "jar" drawn with gift_oil): an olive each, all of them = +1 life
  and Proverbs 22:29 (WEB). Guard dogs (critter "guarddog": chase, snap once, give up after 4.5 s). Lost things = 5 stray
  king's goats (world3 goat with .stray; lostThingsTally in world4.js feeds the HUD and the clear card). The One in a feed
  shed on the wall (ladder up). Letter He behind a target at 67. Gera: Glen's 6-pose sheet (gera.png, cut keeping the loose sling loop), drawn by drawGera at his next line. Ends at a palace fold.
- **4-3 The Broken String is built** (2026-10-15; borrows Bethlehem's w3_1 layers). The harp can't be played until the
  three questItem()s are found (harpBroken in world4.js; main.js harp start): the gut string up on the third springy stall
  awning (setPiece "awning": a one-way ledge that bounces David, A = higher, Down = land), the peg on the carpenter's
  tallest beam stack, the wax by the beekeeper's hive (bees harmless; hornets on the old wall). The finish is blocked
  until all three (questBlocking). Lost things = 5 runaway hens (critter "hen" in 4-3 = lostHen: walk up to catch, run
  and they bolt). The One appears from under the cloth stall (setPiece "clothstall") when the mended harp is played
  beside it. The Steward (Glen's sheet, drawSteward: talks, points, shakes his head, smiles once the harp is mended) gives the tier-1 warning at the end ("Play steady"). Letter Waw on a
  doorpost at 38. HUD: hen counter + the three harp things (Glen's quest_string/peg/wax items).
- **4-4 The King's Hall + BOSS Saul's Torment are built** (2026-10-15; Glen's w4_4 palace-at-night set, forced magenta key
  in make_backgrounds MAGENTA_SETS). Shadows (setPiece "wisp", world4.js updateHall): drift after David, a touch =
  d.shiverT (main.js: stops him, no damage). Lost things = 5 hall lamps (setPiece "hall_lamp": walk up to light; a lit
  lamp melts wisps within 7 tiles; Psalm 34:18 WEB with "the LORD" when all are lit). The One under the staircase (crawl
  gap under wall 96-103). He on a column at 58; the Steward's right-to-left hint at the fire at 80. The servants' fire 166.
  BOSS (setPiece "throne" 196): sit by Saul and play = the World 2 harp duel with kind "saul" (HARP_DUEL.saul; world2.js
  calls saulMiss/saulTune/saulCalmed). Song: harp_saul.mp3 charted from Morning Meditation 1 (4-100s, gap 1.05, tunes
  4,5,5,6,6,7 = 33 notes); saul_dark.mp3 = Harp of the Deep underneath, louder as g.dark grows. Parts: tunes 1-2 quiet,
  3-4 the storm (thunder, Saul frightened), 5-6 the new part (calm). Miss = dark +0.3; rushing (a press up to 0.8 s before
  a note) = +0.12, no rewind; a whole tune = -0.15. dark >= 1: "Leave me!" -> back to the fire; first time the Steward's
  tier-2 counsel (window 0.26 -> 0.32, dark gains x0.6). Calmed: Saul asleep, 1 Sam 16:23 (WEB). Fold blocked till then.
  Not yet: End of World 4 scene (Saul's thanks 16:22, the King's Favor = fast travel, the Steward, Hanan at the gate),
  World 4 Journal pages, the Psalm 121:8 / 22:29 / 33:3 / 34:18 scrolls, a follow-the-beat easy assist.
- **The Journal rip-out is built** (2026-10-15, journal.js): JOURNAL_PAGES[w].rip = { at, text } (World 3: at 2, "Nobody even
  remembered me. My brothers always..."). The first time he writes after that stage (progress.ripped[w]), the Journal
  leans in, he writes the bitter words on the right page under what was there, stops, Glen's tear sheet plays (frames
  pinned to the book by TEAR_BOOK), then the burn sheet in firelight, then the real lesson; the fresh right page is
  rewritten without the words struck at that step (they were on the torn page). From then on the draft spread draws
  davids_journal_page_ripped-out.png (the torn stub). A skips. 6-1's rip-out: add rip: { at: 1, text: "Eliab thinks he's so..." }
  to World 6's pages when they exist. World 4 Journal pages are in too (draft text).
- **End of World 4 scene is built** (w4ending in world4.js; main.js starts it after the 4-4 clear, before the Journal;
  ?w4end=N jumps to beat N). Beats: morning in the hall (w4_4 lifted with a screen fill), Saul (saul_joy, then saul 4/5):
  thanks, 1 Sam 16:22 (WEB); the King's Favor card (US spelling; progress.favor = 3.5x walking on the Journey map; 1 Sam
  17:15 WEB); the Steward's line (DESIGN); 1 Sam 16:23; then the Bethlehem gate (w3_1, a drawn dusty road) and Hanan
  (no staff: he gave it to David) "I told you I'd be here" / "Did you find the one who tells you the truth?". A advances.


## World 5 (started 2026-10-15)
- `game/world5.js` (loaded from world1.js after world4.js): the provisions (10 loaves, 10 cheeses: a hit knocks one
  loose for `W5.DROP_LIFE` s; what's left is saved as progress.prov at the clear card and carried to the next stage),
  raiders (`critter("raider")`: run down the road at David, snatch one, a stone makes them drop it), vultures
  (`setPiece("vultures")`, scenery), the fleeing father (World 2's leatherworker stands in; gives the Tobi secret,
  progress.tobiSecret, at the clear), the opening scene `w5intro` (`?w5intro` replays it).
- **5-1 The Supply Road** (main.js): 250 cols, 5 of the family's sheep + The One on the old watchtower (Glen's tall town
  house), Dalet on a roadside rock. Stand-in art: World 2's `w2_2` backgrounds, the thief for raiders, the eagle for
  vultures. The World 5 map is the journey painting until Glen's World 5 map (MAP_WORLDS[5] in map.js).
- Art prompts for the map and 5-1: ART_PROMPTS.md, "World 5 — The Road to the Valley".
- **Glen's own music (2026-10-23):** Suno songs, WAV masters in david-sling-art/music (worldN_<name>.wav). World 1:
  "Morning on the Hills": take 1 under the opening film and table (music_w1_opening, W1_OPEN.FILM_MUSIC, fades out for
  his song on the hillside), take 2 as the World 1 stage music (music_w1_hills, dayMusic). Suno songs end in a fade-out,
  so stage loops go through tools/make_music_loop.py (cut on a beat before the ending, the tail crossfaded over the
  start: no gap). Loudness already matches the harps (about -16 LUFS). 8-3 and 8-4 still play the old 8-bit Harp Jump.
  World 2: "Beyond the Rocks" (MP3s: Glen's WAVs were too big to send): take 1 under the whole opening (music_w2_opening,
  W2_OPEN.FILM_MUSIC), take 2 the stage loop (music_w2_rocks; cut at 178 s, before its ending). Harps' Bounce
  (music_day_w2) is no longer played. Pick a loop's --end where the song is still full, not in its fade.
  World 3: "Dusty March": take 1 under the opening (music_w3_opening, W3_OPEN.FILM_MUSIC), take 2 the stage loop
  (music_w3_march, --end 174 --xfade 8: the song builds from quiet to loud, so the longer crossfade eases it back down).
  3-4 (the storm) keeps the night music.
  World 4: "The Shadow in the Gold" (one take) for 4-1 to 4-3 and, from the start, under the World 4 film and opening.
  World 6: "The Giant's Shout": take 1 under the film and opening (in place of the night music there), take 2 for 6-1
  to 6-3 (in place of theme_search; 6-4 keeps theme_wraith). OPENING_MUSIC in main.js plays a world's song from its
  film (preFilm) through its opening scene (wNintro). 8-2's fight: "The One Stone" (G8_MUSIC; the war horns stay in 7-4).
- **Openings wait for sound (2026-10-23):** a stage is a new page and can't play sound before a key or a tap, so the
  music came in on the A at the end of the film. soundGate/drawSoundGate (main.js) hold an opening (w1-3intro, preFilm)
  on black with "Press A to begin" until sound is on; on the Pi (sound allowed) it never shows.
- **World 1 opening:** Eliab's and Jesse's lines come up by themselves in the video as their lips move
  (W1_OPEN.ELIAB_AT 10.4 s, JESSE_AT 12.7 s), Jesse's stays over the last frame (JESSE_HOLD), then the hillside.
- **Two players: the lamb (2026-10-23):** the second controller is the lamb (readPads()[1], input2 / held2 / pressed2;
  the first controller and the keyboard stay David's). Press anything on it in a stage and she's player 2
  (lambP2.on, until that controller goes away). Only the D-pad and A matter (an NES pad is enough). updateLambP2: her own
  physics (LAMB_P2 in main.js: speed, jump, a short tap = a short hop); lambStomp: coming down on a scorpion, rat or
  snake (not the whip snake) squashes it through the stone code (stoneHitsScorpion/Rat), she stays down on it STOMP_T
  (Glen's lamb_stomp sheet, last frames) then hops up. Two-player only: a pit, or off the screen (FAR) for FAR_TIME s,
  costs David a heart (hurtDavid(x, why, still): no knock-back) and puts her back beside him. Carried by David she's
  safe. Not in cut scenes, the stage finish or 8-3 (she follows). A yellow arrow marks her (at the screen edge when off
  it; orange while she's left behind). Each controller can be set up on its own: a new one starts the setup for itself,
  and holding Select+Start on any controller sets up that one ("player 2, the lamb" on the setup screen).
  lamb_stomp: cut from Glen's clip (david-sling-art/lamb), the scorpion in it still to be painted out (he's cleaning
  lamb_stomp_sheet_TO_CLEAN.png); Glen cleaned it (assets/sprites/lamb_stomp.png, 2026-10-23). lamb_jump = the same
  frames with each one's feet on the anchor line (tools/align_feet.py lamb_stomp lamb_jump: the game lifts her itself):
  her jump everywhere, player 2 or following David (drawLamb: 2-7 by how fast she goes up or down, 8-11 the squash
  and a quick landing), at TUNE.SPRITE_SIZE 0.4 (lamb_jump, lamb_still) to match lamb_run (0.75). Re-run align_feet after any
  change to lamb_stomp.
- **The lamb standing and waiting patiently (2026-10-23):** lamb_still is Glen's sheet (david-sling-art/lamb/lamb_still.png):
  frame 0 is her standing pose whenever she isn't moving (player 2 or following David); still for WAIT_LOOK s, she
  turns her head to look at us (1-3, a blink), looks (4, LOOK_HOLD s), turns back (5-7, a blink) to frame 0; again
  every LOOK_EVERY s (LAMB_P2 in main.js, lambLookFrame). The head turn came from his clip (tools/keep_largest.py took
  the scorpion out), then he painted it onto his still.
  Glen's still is her standing pose everywhere David's lamb stands: stages, the world maps (map.js drawLambTok), Jesse's
  courtyard (home.js), the lamb the lion carries off (drawTakenLamb); on the map and at home she looks at us too.
- **The lamb gathers; bigger caves (2026-10-23):** player 2's lamb picks up olives, food (heals David: they share
  hearts) and poison by accident (gourds, berries: a heart, no knock-back, "Oh no, the lamb ate it!"); lambTouches()
  in updatePickups / updateGourds / updateOlives. GRAIN (main.js): 3 tufts of barley per POISON.STAGES stage, the
  lamb's (p.lamb: any lamb nibbles it, +½ heart; with one player David picks it up too, with two only player 2's lamb). Her stomp: scorpions and rats only; a hen
  gets a fright and runs (a neighbor's: "Leave her be"); no snakes, nothing bigger. The caves: 1-2's 46 -> 82 wide
  (a drop with a crumbling ledge, scorpions, a climb; The One at the back), 1-3's 52 -> 150 (a chasm on three
  crumbling ledges, a low tunnel to roll under, a climb with a wild gourd on top, another drop, a viper, scorpions).
  caveRoom(w, { back: true }) gives a crack of daylight at the back (room.backX) as a second way out to the same
  mouth; pitFloor(c, w) drops a cave floor. COLS = MAIN_COLS + 200 for the room space. The lamp without oil is
  smaller now (CAVE.LAMP_DIM 105, was 150) and says so once: the long caves are a real tax on the olives.
- **Hear someone again (2026-10-23):** standing by a person who's spoken (a talk, or a lit campfire's speaker), a "↑"
  shows over David; Up has them say it again, all of their lines in a row, A for each (world1.js talkAgainNear /
  updateTalkAgain / drawTalkHint, TALK_AGAIN.NEAR tiles). Not in caves or by a cave mouth. The lamb's barley is
  drawn at half size (drawPickups).
- **New raven (2026-10-23):** raven_fly is Glen's new strip (david-sling-art/raven/raven_fly_strip.png; the old sheet is
  raven_fly_old.png there), cut by tools/green_strip.py: each pose is its own shape (outlines may overlap), keyed,
  lined up on the body (eroded mask's middle) so it holds still while the wings beat, mirrored to face left like the
  old one (the code flips it), pose 9 dropped (the same as 1, for a clean loop). raven_fly2 = his second strip, the
  same way; Glen cleaned the doubled wing (raven_fly2_TO_CLEAN.png, copied in). Both are used: ravenArt() (main.js)
  gives each bird one of the two in turn (swooping ravens and the 3-x barley crows), so he can compare them in play.

## 2026-10-26: Glen's level-by-level play-through
- 1-2 cave: the second scorpion began inside a rock (c + 71) and spun in place; now at c + 63 on open floor.
- The World 3 lane trap (world3.js trapCols: a narrow gap between walls 5+ high counts as a pit) also caught 1-2's and 1-3's
  crack of daylight at the back of the cave ("Too high to climb out", a death on the way out); it now only scans the stage
  itself (columns below MAIN_COLS), never the caves. It still finds lanes in 2-3, 3-1, 4-3 and 7-2 (on purpose: no softlock).
- 1-4: the stone shelter round The One was a dead end without the code (its roof a 5-row jump from the floor); a step
  rock(182, 15, 2, 2) in front of it. Hanan speaks once, at the first fire, with both lines; the fire at 215 is just a fire.
- Hanan once a stage (Glen): 2-1's boar line joined his charged-sling lesson at the first fire (it came after two boars);
  the fire at 168 is just a fire. His talk() lines (1-2 col 66, 2-4 col 127, 3-4 col 16) only show words (Hanan isn't drawn
  for talks outside World 8), so they stay. 4-4: the Steward once too (Glen): the right-to-left hint joined his first fire (5); the fire at 80 is just a fire.
- Up (hear them again, world1.js updateTalkAgain) is off while David plays the harp: in the duel Up is a string, and by
  2-2's donkey it brought back David's line and held the stage, stopping the music.
- 2-4 wolves: the pack's third wolf now comes in from off the left of the screen (world2.js updateWolf looks back past
  the screen edge; where a wall stops it short, it fades in). The claw rocks that boxed it in moved: 20 -> 5, 137 -> 124.
- 2-4 bear: Glen's growl (assets/sounds/bear_growl.mp3, was in later/) on every attack: notice, tell (the scrape before a
  charge), roar, lunge, throw, throwBack (world2.js BEAR_GROWLS [volume, rate]); a hit (dazed/defeated) cuts it off.
- The homestead's Journal shelf (home.js useShelf) now opens the newest world with pages, like the map's Select: back home
  before clearing a World 3 stage, it said the Journal was empty.
- 4-2 Gera: his second line moved from 15 to 12 so the two are one stop (chained, Up hears both); drawGera (world4.js)
  stands at the first line of a group, like world2.js's people. He used to jump 6 tiles between lines.
- Sound gate (main.js soundGate): in a normal Chrome tab, a controller's A passed "Press A to begin" but can't turn sound
  on (browsers don't count it), so the film played silent and Glen's next A skipped it. Now if the sound isn't on
  GATE_HEAR (0.6 s) after A, it says "The sound is still off. Press any key on the keyboard, or click..." with "A: go on
  without sound". It also waits for the browser's answer (audioAsked) instead of a fixed 0.4 s, so a slow-loading .bat
  or Pi doesn't flash the gate. The .bat (and a Pi with --autoplay-policy=no-user-gesture-required) never shows it.
- 4-4: the Steward is drawn at his campfire (world4.js drawSteward, STEWARD_AT_FIRE); before, only his voice was there.
- 4-4: the second He (inscription 58) moved from row 12 to 14. Reading needs David standing still within 3 tiles up/down
  (updateInscriptions), and row 12 was 4.5 tiles over the floor with nothing to stand on.
- 4-4 Saul's Torment: walk past the Steward's last line (now col 188) and David sits and plays by himself
  (world4.js W4.SAUL_AUTO tiles past it, once per approach; d.harpAuto keeps a held Right from standing him back up).
  The song reaches W4.SAUL_REACH (8) tiles from the king, was 6. Faster presses (Glen: the song stays as it is, the
  notes were too far apart): re-charted with more of the recording's plucks, 63 notes (was 33), tunes 8,9,10,11,12,13:
  `python tools/make_harp_chart.py <david-sling-art/audio/Morning_Meditation_1.mp3> saul --start 4.0 --end 70.095
  --gap 0.5 --phrases 8,9,10,11,12,13`. Notes ~1 s apart (closest 0.5 s), was ~1.9 s. (A 1.5x playback try was undone.)
- 4-4 Saul (2026-10-27): a wrong or late note costs a heart and the song goes on (world2.js miss(): Saul skips the
  note, no rewind; the donkey still rewinds). The shadows (g.dark) only show how it's going; rushing fills them and a
  full meter is a heart. The last heart: "Leave me!", a life, back to the fire, and the Steward's counsel there
  (world4.js saulHurt / saulCounsel; saulSendsOut is gone). The pause menu now stops Saul's dark song (hushLoops).
- Journal tear-outs (3-2, 6-1): one stray A skipped the whole thing (and it's saved as seen). Now the first A shows
  "A again: skip" and a second A within RIP_ASK (2.5 s, journal.js) skips; otherwise it plays on.
- Journal, World 6 scene: the left page's bottom corner out from 680 to 620 (journal.js SCENES[6]); the page's outer
  edge widens toward his sleeve, so every line had drifted in (Glen: "indented").
- Poison/barley (main.js POISON) now stop POISON.CLEAR tiles before the sheepfold's posts (END), not 12 tiles before
  the stage end: gourds, berries and the lamb's barley had landed inside the fold. All 32 stages scanned: none inside.
- LIVES CARRY OVER, like Mario (Glen, 2026-10-27: "real risk in the game"). main.js LIVES_CARRY / saveLives /
  outOfLives / livesCard: lives are saved (progress.lives) whenever they change, and a stage starts with them, not
  DIFF.lives. Out of lives: a continue (progress.continues, CONTINUES = 3) restarts the stage with DIFF.lives lives.
  Out of continues: game over, back to the start of that world (its 4 stages un-cleared, p.at = "home"); skills, the
  Journal, Ones and stones are kept (Glen chose this over restarting the whole game). A world already finished only
  goes back to the map. Continues go back to 3 when a world's last stage is cleared (map.js stageCleared). Not in the
  Trial, the range, the test stage or the 3-A story stop. Pits are unchanged (a heart; the last heart costs a life).
- RUNNER ART (Glen, 2026-10-27): Glen redrew the goofy-legged runs: villager_{man,woman,staffman,wrapman,scarfwoman,
  boy,girl,braidgirl}_run (5-1's fleeing families), soldier1_go (World 6, walking back to his post) and soldier_run (the 17:24 crowd at the End of World 5, World 8's
  rout, the HUD soldier icon). Same sheet sizes and frame counts, so no frame data changed. capman and basketgirl kept.
- END OF WORLD 5 CROWD (Glen, 2026-10-27: "three of the same people in waves of three"): world5.js fleeCrowd /
  drawFleeingArmy: 11 runners (soldier_run in five tints and sizes, plus villager_capman_run and villager_wrapman_run),
  shuffled, each with his own speed (380-610 px/s), spacing, depth and stride; a new order on each flee beat.
- PAUSE STOPS EVERY SOUND (Glen, 2026-10-27: "paused on world 8 and i can still hear the birds"). main.js allAudio /
  holdAllAudio / releaseAllAudio: HTMLMediaElement.prototype.play is wrapped so every <audio> the game ever plays is
  remembered; Menu.open (any pause: stage, map, courtyard) stops all of them still going and keeps the list, nothing
  new starts while held (except a scene watched from the pause menu: Menu.playing), Resume (Menu.close) carries the
  held ones on, and Title screen drops them. So a sound no hush list knows about (a leaked loop) can't play under a
  pause. Tested headless with real audio (--autoplay-policy): all 32 stages, the map and the courtyard: silent at 2 s
  and 8 s paused, music and birds back on Resume. (Couldn't reproduce Glen's exact spot: the old code was also silent
  at each stage's start, so it was a sound started later that no list held.)
- 8-1 ANSWER READABLE (Glen, 2026-10-27: "I can barely read David's name and the press A is unreadable"). world8.js
  drawWords8Over: "David" and the prompt ("Answer him. Press A." / "A: next", was a bare faint "A") sit on dark pills in
  bold 22px; the band behind the words is darker (0.68) and the verse reference brighter (20px, #fff0d4).
- 8-2 THE WHOLE THROW FROM MEMORY (Glen, 2026-10-27: "I already know it... say it is my third or fourth time
  playing"). world8.js updateGoliath8 "open": the pieces Jesse has given you + A still work, and so does the whole
  throw (THROW_CODE, 10) whether he's taught it this time or not: going on past your pieces with the right button
  grows the boxes to ten and adds W8.CODE_FULL_EXTRA (0.5 s) a button once; a wrong press drops back to your pieces.
  Tested: 3 pieces (up up down A) works; the whole ten works (5.0 s became 7.8 s); a wrong press then the ten works.
- GOLIATH'S SPEAR WOOSHES (Glen, 2026-10-27): his two wooshes are assets/sounds/spear_woosh_1.mp3 (0.27 s, sharp) and
  spear_woosh_2.mp3 (1.5 s, long and softer), in SFX_FILES. world8.js g8Throw: the flat low/high spears play _1
  (0.75), the overhead one down at David plays _2 (1.0); they replace arrow_single + sling_throw_quick there.
- 8-3 ISRAEL'S MEN REALLY RUN (Glen, 2026-10-27: "they are just pulsing"; they were glued beside David at 1.2x the
  run's speed, running in place when he stood). world8.js rout8.isr: each has his own x and runs over the ground
  (W8.ROUT_ISR_PACE 330 px/s, held loosely to his place by David, never under 0.6 of it); his legs go with the ground
  covered (W8.ROUT_ISR_STRIDE 40 px a frame: ~8 frames/s at his pace, ~11 keeping up with David's run, was 15). When
  David stands they run on past, and one far ahead comes round again from behind.
- FOUR SOLDIER RUNS FROM GLEN'S VIDEOS (2026-10-27): soldier_run (spear and round shield; replaced the boy soldier
  sheet), soldier_run2 and soldier_run3 (axe, shield on his back; 3 has the quicker legs), soldier_run4 (pitchfork),
  each 12 frames cut with tools/vid2sprite.py --loop --height 290 (run3/run4 with --min-loop 0.42 --max-loop 0.9/1.1:
  the new --max-loop keeps it to one stride). End of World 5 crowd (world5.js fleeCrowd): all four mixed with the two
  camp men. 8-3 rout (world8.js rout8.isr): one look each in turn; ROUT_ISR_STRIDE is now 20 px a frame for a 66 ms
  sheet, scaled by each sheet's own ms. Everything else that uses soldier_run (World 6 fallbacks, the HUD icon) gets
  the spear man.
  + soldier_run5 (the young one with a sword and shield on his back, --height 280), in both crowds too: the 8-3 rout
  cycles spear, axe, sword, axe, pitchfork.
- **A farmer among the villagers** (Glen, 2026-10-27): Glen painted the axe out of soldier_run2's sheet (his
  farmer_run.png, renamed villager_farmer_run so it fits the villager_*_run names; the JSON is soldier_run2's, 12 x
  254x298, 87 ms). He's in VILLAGERS_BIG (5-1 fleeing families, W5.VILLAGER_SIZE.farmer 1.05) and replaces one spear
  man in the World 5 ending crowd. His legs were drawn for ~470 px/s, so in 5-1 (VILLAGER_RUN 250) W5.VILLAGER_PACE
  slows his cadence to the ground speed so his feet don't skate.
  + villager_farmer2_run (Glen's farmer_run2: same sheet, beard off too, a younger man; size 1.02, same pace). In
  VILLAGERS_BIG and in the end crowd in place of one axe soldier.
- **5-1 boy from video, quicker legs** (Glen, 2026-10-27): villager_boy_run is now 12 frames cut from Glen's Grok clip
  (vid2sprite --loop --green --height 320 --start 30). Glen: the smooth runs looked too slow-legged for how fast the
  families move, so drawFleeing no longer uses each sheet's own ms: W5.VILLAGER_STRIDE sets one full leg cycle per
  runner (grown-ups 0.46 s, kids 0.36 s), whatever the sheet. (This replaced VILLAGER_PACE, which had slowed the
  farmers' legs.) The World 5 ending crowd still paces legs by its own speed.
  + The village kids were taller than David (their sheets are ~320 px of body; at 0.8 that's ~120 px on screen vs
  David's 112). W5.VILLAGER_SIZE boy/girl/braidgirl now 0.62 (~92 px running; the boy and braidgirl standing at the
  fold ~100 px). Glen is redoing the other old 4-frame runs from video; cut them at --height 320 so these sizes hold.
  + Glen's Grok clips for girl, woman, man (the one with the bags) and braidgirl, each 12 frames, --loop --green
  --height 320. Man: --end 90 so the loop is before he turns to look back and switches the bag hand. Woman and
  braidgirl: --max-loop 0.8, because the loop search otherwise picks two strides, which would double their legs
  under VILLAGER_STRIDE (that assumes one stride per sheet). Still on old 4-frame sheets: staffman.
  + villager_staffman_run from Glen's clip (12 x 270x325, --max-loop 0.8). The staff leaves his hand in some frames;
  Glen cleaned that up in Photoshop on the sheet itself (same 12 x 270 frame grid, 2026-10-28). Every 5-1 villager is now from video.
- **5-1 end: floating sheep head; stage clear goes quiet** (Glen, 2026-10-28): the father's last line holds the
  "Stage clear!" panel at alpha 0 until A, and hudIcon set globalAlpha outright, so the panel's sheep icon showed
  alone in the sky. hudIcon now multiplies the current alpha. And "all sounds should stop like a pause screen" on the
  clear panel: clearHush() (main.js) is true on the clear phase (not 8-4, and not once the Journal/menu/map/credits are
  up); entering it pauses every audio but finish.jingle, and the play() gate refuses anything else while it holds.
  Tested with real audio: theme, birds and baas playing before; only the jingle 2 s into the clear, baas still being fired.
