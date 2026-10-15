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

- **Progress** is saved in the browser: `localStorage` `davidProgress`. It holds cleared stages, sheep, The One, stones, olives, lamp oil, fig cake, skills, throw pieces given, and which map you're on. Clear it to start over.
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

- **People as Grok clips:** (Jesse and the trader done) at the stall, Hanan, Shammah, Eliab, the shepherd girl, the neighbour. Today they're names over their lines.
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
(driven off, not killed). Art: Glen's four ox sheets cut with `sheet2sprite.py --blobs` (each figure by its own outline; sources in david-sling-art/world3/ox_*_sheet.png): ox_windup (the tell), ox_charge (charge/skid), ox_dazed (hits the tree, sits dizzy; shake = getting up), ox_gallop (flee). W3.OX_SIZE 1.6; anchors set at the nose (the hit box runs back from ox.x). Slippery landing: in 3-4 a hard landing (fall > 600) plays `david_slip` (Glen's 6-pose sheet on green, david-sling-art/world3/david_slip_sheet.png, keyed to magenta then sheet2sprite --blobs); he slides forward and can't move or jump for TUNE.SLIP_LOCK 0.5s (TUNE.SLIP_MS/SLIP_SLIDE/SLIP_MUD). Not done: counsel tiers.

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
  magenta, sheet2sprite --blobs, height 270); all its reaching poses use the right hand (a left-hand version is optional).
Not done from the design: the Micah 5:2, Psalm 139:1 and Psalm 78:70 scrolls (no scroll system yet),
the harp phrase at 3-2's campfire.
- Messenger (Glen's clips, 2026-10-15): messenger_gallop rides across the far hills in the End of World 3 scene.
  Cut for World 4 (1 Samuel 16:19, at Jesse's door), not placed yet: messenger_stop (slows to a stand),
  messenger_dismount (hops down), messenger_talk (talking with his hands, loop).
