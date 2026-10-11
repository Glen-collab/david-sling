# Where we left off

If a chat session closes, start here. Last updated 2026-10-11.

## How to play and test

- **Play:** open `Desktop\david-sling\game\index.html` directly. Keys: 1 = 1-1 sample, 2 = movement test, 3 = swap backgrounds, 4 = Journal preview, H = help.
- **Update the Desktop copy:** run `git pull` in `Desktop\david-sling`. First run `git status` there in case you edited art inside it. Untracked files with the same name block the pull.
- **Tuning:** the numbers are in the `TUNE` block at the top of `game/main.js`.
- **Art drop folder:** `Desktop\david-sling-art`. Duplicate "copy" sprites went to `my_edits\old_copies`.

## Done 2026-10-11: the Journal screen

- World 1 Journal text **locked** by Glen.
- `game/journal.js`: after the 1-1 sample's gate, A opens the Journal. See JOURNAL.md "How it plays".
- Glen's night scene (David reading by the lamp, the flock, Bethlehem) is the Journal's main view; Up leans in to the full-screen book.
- Two spreads per world (draft, then the world's spread after 1-4), with a page turn between them.
- Test switches in the address: `?journal=1..5`, `&jbook` (start leaned in), `&jt=6&jfreeze` (jump 6 s ahead and hold), `&jauto` (turn pages by itself).

**Glen's new art, saved but not wired in yet** (`Desktop\david-sling-art`):
- `gate_front.png`: the straight-on sheepfold gate with two posts. Its edges have a red fringe from the background removal; clean it in code.
- `gate_posts_green.png`: two posts with a crossbar, on green.

## World 1 map (built 2026-10-11)

- `game/map.js`. **The game now opens on the map.** Key 1 still goes straight into the stage, and 5 brings the map back.
- **Stops:** the sheepfold (home), 1-1 the campfire, 1-2 the flower meadow, 1-3 the goat's rock, 1-4 the cave. The trail coordinates are in `MAP_WORLDS`, in the painting's pixels.
- **On the map:**
  - Left/Right walks David (and the lamb) between stops. He shrinks walking into the distance and shows his back when he walks up into the picture.
  - The next stage flashes. A cleared stage turns green with a sheep (a gold-star sheep if The One was found).
  - The map turns to night on the walk to the cave.
  - A plays the stop (only 1-1 is built). Select reads the Journal so far.
- **Clearing a stage** saves its sheep, The One and stones (`localStorage` `davidProgress`), writes the Journal, then returns to the map, where the next stretch of trail draws itself in.
- **Testing:** `index.html?cheat` lets B on the map mark a stage cleared.

## World 1 stages 1-1 to 1-4 (built 2026-10-11)

All four stages are playable from the map. Each has 5 lost sheep, The One and 3 stones of remembrance. Layouts are in `main.js` (the `LEVEL_NAME === "1-x"` blocks). The new creatures and pieces are in `game/world1.js`, with their numbers in its `W1` block. `#1-2` in the address opens a stage directly.

- **1-1 The Hills of Bethlehem:**
  - Teaching: walls, gaps, the gourd rock, hanging gourds (aim up), the date palm.
  - Snakes: the cobra, then the harmless green **whip snake** next to the viper (Shepherd's Judgment: sling the whip snake and you're told off).
  - Bees and a hornet, then berries or cheese.
  - **Eliab and Shammah** speak along the way; **Hanan** is at the campfire.
- **1-2 The Wandering Flock:**
  - Hanan's harp lesson at the first fire; the neighbour at the middle fire (his ram is one of your 5).
  - **Foxes** go for your lamb, a cast sheep, thorns.
  - **The One is at the back of a low cave** (crawl or roll in; the cave hides its inside until you're in it).
- **1-3 The Rocky Pastures:** World 2's rocky backgrounds stand in until the new art arrives. It has:
  - **Crumbling ledges** (they shake, drop, and come back).
  - **Rope bridges.**
  - A low passage that teaches the roll.
  - **Wild rams** that stamp, then charge (stones bounce off; roll under them).
  - **Ravens.**
  - A **secret cave behind a crack in the rock** with The One, bread and a stone.
  - The shepherd girl at the fire.
- **1-4 The Lion's Territory:**
  - **Night** (a blue tint, the moon, a cloud now and then).
  - The **lion pads along the far ridge** and roars in the distance.
  - **Jackals steal your lamb and run**: sling them to get it back.
  - Hanan at both fires, then the lion fight and the fold.

**Caves (Mario-pipe style, `game/caves.js`, numbers in its `CAVE` block):**
- A cave mouth (Glen's `cave_1` mound in 1-2, the tall `cave_2` in 1-3) shows an ↑ when David is near.
- Up: he turns his back, walks in, and the screen fades into a separate dark room. The rooms are built past the stage's end with `caveRoom()` / `caveDoor()`.
- The first time inside, he lights his oil lamp. Only a circle around him is lit, and it burns 1 olive every 4 s; with no oil the light shrinks but never goes out. The olives inside top it up.
- Bats flutter off when he passes. Sling one and you're told they're harmless.
- The way out glows with daylight: Up there takes him back to the mouth.
- The One for 1-2 and for 1-3 is in these caves. (The old "crack in the rock" secret is gone from 1-3; the fake-rock code is still there for later.)

**Rules changed:**
- **Falling into a pit** now costs a heart and puts David back on the last solid ground. It used to send him to the start of the stage.
- **People's lines** show in a box at the top of the screen.

**Stand-ins until art arrives:**
- **People:** shown only as a name in the box.
- **The ram's charge:** its walk clip, sped up.
- **1-3:** has its own backgrounds now (Glen, 2026-10-11).
- **1-2:** uses World 1's. **1-4:** has Glen's own night set (2026-10-11); the night tint only darkens what's in front of it.

**Sounds still needed:** night crickets (1-4 is silent apart from the lion), fox/jackal yelps, the ram's stamp.

## Next
- Glen plays all four stages and says what to tune (jump gaps, creature speeds, the night darkness).
- Swap in the new backgrounds when they arrive: `STAGE_INFO` in `main.js` names each stage's set.
- Gate and post art from `david-sling-art` (`gate_front.png`, `gate_posts_green.png`).

## Done in the last session (2026-10-09 to 2026-10-10)

### Sounds

All sound files are in `assets/sounds`, credited in `SOURCES.md`.

- **Sling:** a build-up loop plays while B is held. Release plays the whip.
- **Jump:** taken from the unicorn game. The double jump is the same sound, pitched up.
- **Pickups and falls:** olive pickup, and a pit-fall sound.
- **Removed:** the cartoony hurt and death sounds.
- **Stone impacts:** stones hitting walls, gourds, snakes, bugs, thorns, trees and the lion make an impact sound.
- **Lion:**
  - The boss music starts 4 tiles before the arena, before you see him (the "uh oh").
  - He roars the moment he sets the lamb down, and again at his tell.
  - Each stone that hits him plays a hit sound.
  - The final stone plays his wounded cry.
  - The growl was removed.
- **Final blow (Mortal Kombat style):**
  - The game checks in advance when the next stone will finish a boss.
  - Slow motion and the `final_stone` sound start just before that stone lands.
  - On impact: a short freeze, a white flash, letterbox bars and screen shake, then the speed eases back to normal.
  - `final_stone_goliath` is saved for Goliath.
  - Tune it with `FINAL_*` in TUNE.
- **Footsteps:** running footsteps only. Walking steps were removed.
- **Saved for later** in `assets/sounds/later/`: river, horse, woods and crunchy footsteps, wolf growls, bear growl.

### Fixes

- **Boulder by the fig tree:** David and the lamb now stand on its flat top instead of floating. A tiny gap remains at the far left edge. Tune it with the `BOULDER` numbers.

### Sheepfold goal (Super Mario World style)

- **Layout:** two posts, one behind David and one in front, so he walks between them.
- **The gate:** a wooden gate stands between the posts at an angle, like the olive's cord. David has to jump it. It swings open along the fold wall for the sheep.
- **The golden olive:** it slides up and down a gold cord between the posts.
  - Catch it low for 2 olives, up to 25 at the top.
  - Miss it and you get no bonus, but the stage still ends.
- **Extra life:** every 3 top catches (any stages, not in a row) gives +1 life. The count is saved in the browser (`davidGateTops`).
- **Showing the player:** a sign before the goal, plus notches on the front post with olives that grow toward the top.
- **Placeholder art:** the gate and posts are drawn shapes for now.

## Glen's to-dos

- **Real gate art (optional):** a sheepfold gate drawn flat and straight-on with rails and a brace, plus one tall wooden post, both on transparent backgrounds. Claude angles them in the game and uses the post for both posts.
- **Licenses:** fill in the blanks in `SOURCES.md`.
- **Sounds still needed:** real hurt and death sounds, jackal, eagle, snake, bees, gate creak, campfire crackle.
- **Unknown file:** what is the untracked `assets/items/Bethlethem_art.png` in the Desktop clone for? A copy is already in the repo as `assets/maps/world1_map.png`.

## Next big pieces (pick one)

1. **Journal screen:**
   - Caveat font warped to the page using Glen's marks, with ink writing, strike-throughs and rip-out/burn pages.
   - Words are drafted in `JOURNAL_TEXT.md`, the plan is in `JOURNAL.md`, the song is in `SONG.md`.
2. **Real World 1 stages 1-1 to 1-4:**
   - Lay out the real stages from DESIGN.md. The lion boss moves to 1-4.
   - Then place jackals, sheep, caves and the rest.
3. **Later:** wire up the stored river, horse, wolf and bear sounds when those levels exist.

## Other docs

| File | What it holds |
|------|---------------|
| `DESIGN.md` | The story and level bible, all 8 worlds |
| `SPRITES.md` | Sprite lists per world |
| `VIDEO_SPRITES.md` | The Grok video to sprite sheet pipeline |
| `ART_PROMPTS.md` | Background and cave art prompts |
| `JOURNAL.md` | The Journal screen plan |
| `JOURNAL_TEXT.md` | The Journal's words |
| `SONG.md` | The song "The Shepherd Leads Me" |
| `assets/sounds/SOURCES.md` | Where each sound came from |
