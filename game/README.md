# Game (World 1-1 sample + movement test)

Double-click `index.html` to play in your browser (Chrome or Edge). No install needed.

**1** = World 1-1 sample (food, poison look-alikes, cobras, campfire checkpoints, the Lion). **2** = the old movement test. **H** = show/hide the controls.

**Keyboard:** arrows move (hold to run) · Z or Space = A (jump; again in the air = flip) · X = B (sling; hold to charge, hold Up to aim up) · Down = crouch/crawl · Down + A while moving = roll · Down next to the lamb = pick up / put down · Shift = Select (harp) · R = back to start · ` (backtick) = show hitboxes.

**NES controller:** plug it in and press any button on it. The setup starts by itself the first time; follow the prompts (Up, Down, Left, Right, A, B, Select, Start). To redo it: press **M** on the keyboard, or hold **Select + Start** on the controller for 2 seconds. The mapping is remembered.

**Sound:** click the game (or press a key) once after it opens. Browsers block sound until then, and controller buttons do not count.

**Tuning:** every speed and height is in the `TUNE` block at the top of `main.js`. Change one number, save, reload the page.

After adding new sprite sheets to `assets/sprites/`, run `python tools/make_manifest.py`.
