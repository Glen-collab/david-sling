# Where we left off

If a chat session closes, start here. Last updated 2026-10-11 (end of a long session).

## How to play and test

- **Play:** double-click `Play David.bat`: the game opens in its own Chrome window with sound on and no click needed, so a controller is enough. It opens on the **journey map** (or whichever map you were last on).
- **Getting around:** journey map → A at Bethlehem → World 1 map → A at the home stop (Jesse's courtyard) or a stage. B on a world map goes back out to the journey map.
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
  - **Jesse's sprites:** `jesse_idle`, and `jesse_cheer` (he points at the target and laughs; it plays on a centre hit). He's drawn facing left at `HOME.JESSE_SIZE` (1.2x David). The clips are in `david-sling-art/video/jesse_*`, and the reference image is `david-sling-art/jesse_ref.jpg`. Still to do: jesse_talk, and the trader.
  - **The practice throw:** Up at the spot by the bench (left of the target). David stands side on, like facing Goliath; enter the code and he slings a stone into the centre of the bullseye (too slow: it goes wide). `HOME.TARGET`, `THROW_FROM`, `STONE_FLIGHT`, `MISS_BY` in home.js.
  - The tenth of the flock (Lev 27:32) is saved for the end of the game.
  - **The shelf** opens the Journal.
  - **The market** sells lamp oil (20 olives → 30 oil) and a fig cake (15 olives → +1 heart next stage).
  - Olives and lamp oil carry over between stages (`gathered1`.. in the save counts every olive picked up per world, for the tithe); 100 olives still fills the flask for +1 life.
- **The throw code** (DESIGN §4c): the Konami code, one piece per world, for Goliath's final stone. "The Throw" is the last page of the Journal when read from the courtyard or a map.
- **Come-back secrets** (Castlevania-style):
  - **1-1:** The One is on a high shelf (needs the double jump, World 5).
  - **1-4:** The One is behind a one-mark carved wall (opens once Jesse gives ↑ for the lion).
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

- **People as Grok clips:** (Jesse done) the trader at the stall, Hanan, Shammah, Eliab, the shepherd girl, the neighbour. Today they're names over their lines.
- **The ram's charge** clip (it uses its walk, sped up).
- **World 2,** when Glen is ready: the bear, Hanan teaching the charged sling in 2-1, the bigger cave in 2-4.
- **Music:** "Hush Little Seed" (Glen's harp, first 23 s, `assets/audio/title_loop.mp3`) plays on the title and the maps; full song in `david-sling-art`.
- **Sounds still needed:** real hurt and death sounds, night crickets for 1-4, fox and jackal yelps, the ram's stamp, gate creak, campfire crackle, bees, snake, eagle.
- **Licenses:** fill in the blanks in `assets/sounds/SOURCES.md`.

## Other docs

| File | What it holds |
|---|---|
| `DESIGN.md` | The story and level bible, all 8 worlds. §4c: journey map, home base, olives, the throw code, the double jump plan |
| `JOURNAL.md` / `JOURNAL_TEXT.md` | How the Journal plays / its words |
| `SONG.md` | "The Shepherd Leads Me" (Glen's song; stays as is) |
| `SPRITES.md`, `VIDEO_SPRITES.md`, `ART_PROMPTS.md` | Sprite lists, the Grok-to-sprite pipeline, art prompts |
| `assets/sounds/SOURCES.md` | Where each sound came from |
