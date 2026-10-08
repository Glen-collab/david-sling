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

## How it plays (planned)
At the end of each world David sits by the fire and opens the book. Earlier entries are already there; this world's new entries write themselves in one after another, the left page first, then the psalm line on the right, while the song's instrumental plays. The right page keeps every psalm line from earlier worlds, so the song builds page by page.

## Text to write
The exact sayings, verses and psalm lines are being settled world by world: see DESIGN.md §3h and the per-world tables.
