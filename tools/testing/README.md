# Testing without playing

How every fix in Part One was checked. Part Two can copy this folder.

## A screenshot of one moment (cap.sh)
1. Make a throwaway test copy of the game (never edit the real one):
   `rm -rf simgame; cp -r game simgame; cat tools/testing/unlock_all.js game/sprites.js > simgame/sprites.js`
   (unlock_all.js marks every stage cleared and skips the intros, and records any script errors.)
2. Add a test to the end of the copy's menu.js: `cat tools/testing/example_test.js >> simgame/menu.js`.
   A test waits for loading, closes the menus, puts David where you want him, then after a few seconds saves
   the canvas into `data-img` and a one-line report into `data-r` on the page.
3. Run it: `VT=30000 TO=100 bash tools/testing/cap.sh shot "" 1-1` and look at `tools/testing/shot.jpg`.
4. Delete `simgame` and the .jpg files afterward; they're not part of the game.

Notes: file:// pages load all the art up front. World 6+ tests need `setTimeout(..., 12000)` and
`TS = Math.max(performance.now(), last)` so their timers line up.

## The live site, in real time (livetest.mjs)
`node tools/testing/livetest.mjs https://david-sling-8f3.pages.dev/ out '[{"name":"title","wait":2000}]'`
Opens a fresh headless Chrome (empty cache, muted), reports how many seconds and MB until the game is playable,
then runs each step (optional `js` to run, `report` to print) and saves `out_<name>.jpg`. Needs Node 22.
