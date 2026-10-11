# David's Journal: handwriting layers

The book is `assets/items/davids_journal.png` (1536 × 1024). Glen hand-writes each entry as its own layer; the game reveals each layer stroke by stroke, left to right and line by line, so it looks like David writing it right then.

## Rules for each handwriting layer
- **Same canvas as the book: 1536 × 1024**, transparent everywhere except the ink. Don't crop or move it, so it lines up with the book exactly.
- **One PNG per entry** (one saying, one verse, or one psalm line). Export each layer separately.
- **Write inside the page areas** (pixels on the 1536 × 1024 canvas):
  - **Left page (Wisdom):** x 260 – 720, y 110 – 820
  - **Right page (the Psalm):** x 855 – 1320, y 110 – 820
- **Dark brown or black ink**, a little textured is fine. Thin, clean strokes reveal best.
- **Leave a small gap between lines** of writing so the game can find each line and write it in order.

## File names
`journal_w<world>_<page>_<n>.png`, for example:
- `journal_w1_left_1.png`: World 1, left page, first entry
- `journal_w1_left_2.png`: World 1, left page, second entry
- `journal_w1_right_1.png`: World 1, right page (the psalm line)

Put them in `assets/journal/`.

## How it plays (built 2026-10-11)
The handwriting is now the **Caveat font** (no hand-written layers needed), bent onto the pages with the page-edge points. Code: `game/journal.js`; the words are in `JOURNAL_PAGES` at its top (World 1 is locked and in).

- **After every stage**, Glen's scene `assets/journal/w1_reading.jpg` (David reading by the lamp at night, the flock behind him, Bethlehem in the distance) fades in. He writes that stage's lesson on the left page and works on the song line on the right, word by word with a soft pen scratch, while the harp plays. A = skip the writing, then A = continue.
- **Up = lean in:** the book fills the screen (`davids_journal.png`) so it's easy to read. **Down = sit back.** **Left / Right** page back through the spreads.
- **Two spreads per world:** the *draft* spread fills up stage by stage (the four lessons; the song line with its crossed-out words). After 1-4, A turns the page to the *world's* spread: "What happened", the Samson entry, the stone count, the clean song line. The 1 Samuel footnote shows under the book.
- **Preview:** press **4** in the game (Select = next preview page, 4 = close), or open `game/index.html?journal=1` … `?journal=5`.

### A scene per world
Each world can have its own reading scene (same pose, different place: World 2 by a wilderness fire, and so on). Add it to `SCENES` in `journal.js` with the six points along the top and bottom edges of each page (in the art's pixels) and where the lamp flame is. Same idea as the red and blue dots.

## Text to write
The exact sayings, verses and psalm lines are being settled world by world: see DESIGN.md §3h and the per-world tables.
