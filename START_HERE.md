# Start here: where David is now

If the chat with Claude is lost, open a new Claude Code session and say:
**"Read START_HERE.md and HANDOFF.md in Desktop\david-sling and pick up where we left off."**

Last updated 2026-11-02. This page is the short version; HANDOFF.md has the full history of every fix, file by file.

## The game

- **David: The Shepherd's Sling**: a Pixar-style side-scrolling platformer, 8 worlds, 32 stages, 8 bosses, from the
  sheep fields of Bethlehem to the Valley of Elah. Player 2 can play the lamb. For a computer or TV, with a keyboard
  or a controller.
- Built 2026-10-05 to now: about 700 commits over four weeks, with Claude (code), and ChatGPT, Grok and Meta (art,
  video, ideas). Songs by Glen with Suno.
- **Status: final polish.** All 8 worlds are built; Glen is play-testing stage by stage and sending fixes. It's live on the internet.

## Where it lives

| What | Where |
|---|---|
| Play it (share this link) | https://david-sling-8f3.pages.dev/ |
| Code and art (public repo) | https://github.com/Glen-collab/david-sling |
| Working copy | `Desktop\david-sling` (`Play David.bat` plays it locally, test keys on) |
| Hosting | Cloudflare Pages, free plan, connected to GitHub: every push to `main` is live in about 2 minutes |
| Preview screenshots for Glen | `Desktop\game previews` |
| Part Two | `Desktop\david-sling-2`: a separate game with its own session and its own START_HERE.md. Never mix the two. |

Everything is saved on GitHub, so the Desktop folder can be deleted and cloned again any time (check `git status`
first in case there are unsaved changes).

## Glen's rules for working on it

- US spelling. Scripture is the World English Bible (WEB), with "the LORD". Kid-clean.
- Don't trade quality for smaller files.
- Commit and push after every change, and add a HANDOFF.md entry for each fix.
- Never show Glen UI that hasn't been looked at (take a screenshot and check it first).
- Test with a throwaway copy (`simgame`), then delete it. Never leave test servers, tabs or headless Chrome running,
  and never leave muted or stubbed code in a browser tab Glen might play in.
- Previews go in `Desktop\game previews`; never hand Glen temp/AppData paths.
- Glen fills in sign-ups and contest forms himself; Claude writes the answers.

## How fixes get checked

`tools/testing/` (see its README): `cap.sh` takes a screenshot of any moment in any stage in headless Chrome,
`livetest.mjs` times the live site in a fresh browser. `unlock_all.js` marks every stage cleared for tests.
Test keys (1-6, `) only work on localhost, from the files, or with `?dev` in the address.

## What we did most recently (late October to 2 November)

**Glen's play-through fixes** (all pushed):
- 5-3: the tower lookout hops down to his fire instead of floating, and keeps watch from the tower; the signal fire
  flickers smoothly instead of skipping frames.
- 6-2: the frightened striped soldier no longer shrinks and grows as he stands up (head sizes measured per frame).
- 7-1: the lamb's helmet sits higher and a little bigger.
- 7-4 ending: real ground under the scene, and Goliath's shield is drawn as a shield (it looked like a health bar).
- 8-1: the "Answer him / A: next" prompt is a dark pill in the bottom-right corner.
- 8-4: the Steward and Gera face David from the start, not only after talking.

**Ready for the internet:**
- Test keys hidden from players; copyright line on the title screen; LICENSE (all rights reserved); README rewritten
  for players with the WEB credit (it wrongly said NIV).
- Hosted on Cloudflare Pages. The repo stays **public** (Glen's choice): the copyright notice protects it.
- Loads per stage instead of all ~800 images: about 3 seconds and 22-30 MB to start playing, instead of ~500 MB.
  The rest downloads in the background while you play. After adding new art, run
  `python tools/make_asset_sets.py` (art it misses still appears, just a moment later).

**Housekeeping (2 November):** test tools saved into `tools/testing/`; 1.1 GB of old temp test files deleted.
The computer's slowness was RAM (Chrome tabs and Photoshop), not this game.

## Contests and getting noticed (researched 2026-10-31 to 11-01)

- **Christian Game Developers Conference (CGDC):** the 2026 game jams are over (and jam games must be made during
  the jam; AI tools are allowed if AI art/audio is labeled). The conference is Nov 5-7, 2026, Aloma Church, Winter
  Park, FL. Demo sign-up: https://forms.gle/RVufQEb1x5YCBdyz8 . Game Clinic (feedback on your game):
  https://forms.gle/7Jatpepf9LbALs8f9 . Community Game program: cgdc.org/join-the-community-game, dawnmarie@cgdc.org.
- **Anthropic:** no official award or submission program found. Community galleries:
  https://claude-showcase.vercel.app/submit and https://github.com/rohitg00/awesome-claude-design .
  Best bet: post the story (gym owner and dad builds a family Bible game with AI) on X tagging @AnthropicAI /
  @claudeai and on r/ClaudeAI.
- **Gamer festivals:** BostonFIG (family-friendly; 2027 entries likely open around May; needs a gameplay video),
  Independent Games Festival (next deadline fall 2027). No faith-based game awards found.
- **Offered, not started:** write the CGDC form answers, a 60-90 second trailer shot list, an itch.io page, and the
  "how I made it" post.

## Still open (optional ideas from play-testing)

- Convert the ground tiles to lossless WebP (the biggest part of each stage's download; same quality, smaller).
- The bear stays lying down instead of fading; 1-4 roars should wait for the fire; quiet the 8-4 stage-clear sound.
- World 5 end-crowd legs; the 10-frame villagers; World 8 stones; 8-2 music and spear pace.
- Suno: Glen to check his Suno plan allows using the songs in a published game.
