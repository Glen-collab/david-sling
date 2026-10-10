# Where we left off

If a chat session closes, start here. Last updated 2026-10-10 (commit 681cfec and this file).

## How to play and test

- **Play:** open `Desktop\david-sling\game\index.html` directly. Keys: 1 = 1-1 sample, 2 = movement test, 3 = swap backgrounds, H = help.
- **Update the Desktop copy:** run `git pull` in `Desktop\david-sling`. First run `git status` there in case you edited art inside it. Untracked files with the same name block the pull.
- **Tuning:** the numbers are in the `TUNE` block at the top of `game/main.js`.
- **Art drop folder:** `Desktop\david-sling-art`. Duplicate "copy" sprites went to `my_edits\old_copies`.

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
