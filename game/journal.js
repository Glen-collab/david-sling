// David's Journal: the pages he writes after every stage, and the world's spread at the end of each world.
// The words are in JOURNAL_PAGES below (locked text from JOURNAL_TEXT.md). The handwriting is the Caveat font,
// bent onto the book's curved pages using Glen's marks (assets/journal/journal_marks.png).
// Preview any page: press 4 in the game, then Left / Right.

const JTUNE = {
  WORD_TIME: 0.035,       // seconds per letter as a word is written (plus WORD_BASE per word)
  WORD_BASE: 0.03,
  REF_SPEED: 0.6,         // scripture references under an entry are written faster (lower = faster)
  STRIKE_TIME: 0.32,      // seconds to cross a word out
  STRIKE_PAUSE: 0.5,      // the pause after crossing out, before he writes the right word
  PAGE_PAUSE: 0.45,       // between the left page and the right page
  BLOCK_PAUSE: 0.2,       // between entries on the same page
  FLIP_TIME: 0.9,         // the page turn
  LEAN_TIME: 0.5,         // seconds to lean in to the book (Up) or step back (Down)
  INK: "rgba(40,24,12,0.92)", INK_REF: "rgba(92,62,36,0.85)",
  SIZE_ENTRY: 46, SIZE_REF: 32, SIZE_PSALM: 42, SIZE_SMALL: 36,
  MUSIC_VOLUME: 0.55,
  PEN_VOLUME: 0.5,
};

// ----------------------------------------------------------------------------
// The words. at = the step it's written (1-4 = after that stage, 5 = the world's end).
// strike = the step it gets crossed out. A block is one entry (it wraps); "\n" in segs starts a new line.
// ----------------------------------------------------------------------------
const E = (at, text, ref) => [{ at, size: "entry", segs: [{ text, at }] }, ...(ref ? [{ at, size: "ref", segs: [{ text: "— " + ref, at }] }] : [])];
const JOURNAL_PAGES = {
  1: {
    name: "The Shepherd's Fields",
    stages: ["The Hills of Bethlehem", "The Wandering Flock", "The Rocky Pastures", "The Lion's Territory"],
    draft: {
      left: [
        ...E(1, "Not everything that moves in the grass is my enemy. But the serpent is crafty, so I will look before I throw.", "Genesis 3:1"),
        ...E(2, "If my neighbor's sheep wanders, I must not look away. I bring it home, even when it isn't mine.", "Deuteronomy 22:1–3"),
        ...E(3, "The LORD is my Rock. Everything He does is right, and He does not move.", "Deuteronomy 32:4"),
        ...E(4, "I am of Judah, the lion's cub. The LORD goes ahead of me, so I will not be afraid.", "Genesis 49:9; Deuteronomy 31:8"),
      ],
      right: [
        { at: 1, size: "psalm", segs: [
          { text: "The Lord is my", at: 1 }, { text: "strength,", at: 1, strike: 2 }, { text: "shepherd,", at: 2 }, { text: "\n" },
          { text: "I will", at: 3 }, { text: "not be afraid.", at: 3, strike: 4 }, { text: "have everything I need.", at: 4 },
        ] },
      ],
    },
    end: {
      left: [
        { at: 5, size: "entry", note: "David told King Saul about this years later: 1 Samuel 17:34–35",
          segs: [{ text: "A lion came today and took a lamb from the flock. I went after it, struck it, and took the lamb out of its mouth. The Lord kept me safe.", at: 5 }] },
        ...E(5, "Samson met a lion too, and the LORD gave him strength. Tonight He gave me mine.", "Judges 14:5–6"),
        { at: 5, size: "small", stones: true, segs: [{ text: "Stones of remembrance: {stones} of 12", at: 5 }] },
        // The One: a line that changes once you've gone back for every lamb in this world
        { at: 5, size: "small", onlyIf: "missingOne", segs: [{ text: "There's still a lamb out there. I can hear it at night. I won't stop until I bring it home.", at: 5 }] },
        { at: 5, size: "small", onlyIf: "allOnes", segs: [{ text: "Every one of them is home. Not one was left behind.", at: 5 }] },
      ],
      right: [
        { at: 5, size: "psalm", segs: [{ text: "The Lord is my shepherd,", at: 5 }, { text: "\n" }, { text: "I have everything I need.", at: 5 }] },
      ],
    },
  },
  // World 2: the FIRST DRAFT from JOURNAL_TEXT.md (Glen hasn't locked it yet: change the words there, then here)
  2: {
    name: "The Wilderness",
    stages: ["The Forest Trail", "The Dry Riverbed", "The High Cliffs", "The Bear's Ravine"],
    draft: {
      left: [
        ...E(1, "Israel moved when the cloud moved, and waited when it stayed. I am learning to wait.", "Numbers 9:22–23"),
        ...E(2, "The LORD made a dry path through the sea for our people. Today He brought us through the flood.", "Exodus 14:29"),
        ...E(3, "In the dry land He brought water out of the hard rock.", "Deuteronomy 8:15"),
        ...E(4, "He watched over our journey through the wilderness, and we have not lacked anything.", "Deuteronomy 2:7"),
      ],
      right: [
        { at: 1, size: "psalm", segs: [
          { text: "He leads me", at: 1 }, { text: "through the wilderness,", at: 1, strike: 2 }, { text: "beside the waters,", at: 2 }, { text: "\n" },
          { text: "where the", at: 3 }, { text: "springs run clear.", at: 3, strike: 4 }, { text: "troubled waves grow still.", at: 4 },
        ] },
      ],
    },
    end: {
      left: [
        { at: 5, size: "entry", note: "David told King Saul about this years later: 1 Samuel 17:34–37",
          segs: [{ text: "A bear came for the flock tonight. The LORD who helped me with the lion helped me again.", at: 5 }] },
        { at: 5, size: "small", stones: true, segs: [{ text: "Stones of remembrance: {stones} of 12", at: 5 }] },
        { at: 5, size: "small", onlyIf: "missingOne", segs: [{ text: "There's still a lamb out there. I can hear it at night. I won't stop until I bring it home.", at: 5 }] },
        { at: 5, size: "small", onlyIf: "allOnes", segs: [{ text: "Every one of them is home. Not one was left behind.", at: 5 }] },
      ],
      right: [   // the finished lines so far: World 1's, then World 2's under it
        { at: 5, size: "psalm", segs: [{ text: "The Lord is my shepherd,", at: 5 }, { text: "\n" }, { text: "I have everything I need.", at: 5 }, { text: "\n" },
          { text: "He leads me beside the waters,", at: 5 }, { text: "\n" }, { text: "where the troubled waves grow still.", at: 5 }] },
      ],
    },
  },
  // World 3: JOURNAL_TEXT.md's first draft (2026-10-15), like World 2's, until Glen locks the words. (3-2's rip-out
  // isn't in yet: the page is just written.)
  3: {
    name: "The Anointing",
    stages: ["The Day Before", "The Far Pasture", "We Will Not Sit Down", "The Chosen Shepherd"],
    // a rip-out (JOURNAL_TEXT.md, rare on purpose): after 3-2 he starts this on the right page, stops, tears it out and
    // burns it, then writes the real lesson. The words struck at that step were on the torn page, so they're gone after.
    rip: { at: 2, text: "Nobody even remembered me. My brothers always..." },
    draft: {
      left: [
        ...E(1, "God put the first man in the garden to work it and take care of it. My work is the sheep.", "Genesis 2:15"),
        ...E(2, "Hagar was alone in the desert, and she called Him \"the God who sees me.\" He sees me out here too.", "Genesis 16:13"),
        ...E(3, "The LORD did not choose our people because we were many. We were the fewest of all.", "Deuteronomy 7:7"),
        ...E(4, "Gideon said he was the least in his family. The LORD said, \"I will be with you.\"", "Judges 6:15–16"),
      ],
      right: [
        { at: 1, size: "psalm", segs: [
          { text: "He", at: 1 }, { text: "gives me work to do,", at: 1, strike: 2 }, { text: "restores my soul again,", at: 2 }, { text: "\n" },
          { text: "and guides me where", at: 3 }, { text: "I want.", at: 3, strike: 4 }, { text: "He will.", at: 4 },
        ] },
      ],
    },
    end: {
      left: [
        { at: 5, size: "entry", note: "1 Samuel 16:6–13",
          segs: [{ text: "The prophet Samuel came to Bethlehem. All my brothers stood before him, and the LORD said no to each one. Then they sent for me.", at: 5 }] },
        { at: 5, size: "small", stones: true, segs: [{ text: "Stones of remembrance: {stones} of 12", at: 5 }] },
        { at: 5, size: "small", onlyIf: "missingOne", segs: [{ text: "There's still a lamb out there. I can hear it at night. I won't stop until I bring it home.", at: 5 }] },
        { at: 5, size: "small", onlyIf: "allOnes", segs: [{ text: "Every one of them is home. Not one was left behind.", at: 5 }] },
      ],
      right: [   // the finished lines so far: Worlds 1, 2 and 3
        { at: 5, size: "psalm", segs: [{ text: "The Lord is my shepherd,", at: 5 }, { text: "\n" }, { text: "I have everything I need.", at: 5 }, { text: "\n" },
          { text: "He leads me beside the waters,", at: 5 }, { text: "\n" }, { text: "where the troubled waves grow still.", at: 5 }, { text: "\n" },
          { text: "He restores my soul again,", at: 5 }, { text: "\n" }, { text: "and guides me where He will.", at: 5 }] },
      ],
    },
  },
  // World 4: JOURNAL_TEXT.md's first draft (2026-10-15), until Glen locks the words. The right page builds the song's
  // second verse ("You lead me down the right road ... Even when the shadows gather, You remain the same").
  4: {
    name: "The King's Court",
    stages: ["The Road to Gibeah", "The Training Yard", "The Broken String", "The King's Hall"],
    draft: {
      left: [
        ...E(1, "Father sent me with gifts for the king. I will honor him by bringing them safely.", "Exodus 20:12"),
        ...E(2, "The LORD filled Bezalel with skill to make beautiful things. My sling hand is His gift too.", "Exodus 31:3"),
        ...E(3, "Jubal was the father of all who play the harp. I am one of his children.", "Genesis 4:21"),
        ...E(4, "I asked the LORD to bless the king, keep him, and give him peace.", "Numbers 6:24–26"),
      ],
      right: [
        { at: 1, size: "psalm", segs: [
          { text: "You lead me down the", at: 1 }, { text: "king's", at: 1, strike: 2 }, { text: "right", at: 2 }, { text: "road...", at: 1 }, { text: "\n" },
          { text: "Even when the", at: 3 }, { text: "king rages,", at: 3, strike: 4 }, { text: "shadows gather,", at: 4 }, { text: "\n" },
          { text: "You remain the same.", at: 3 },
        ] },
      ],
    },
    end: {
      left: [
        { at: 5, size: "entry", note: "1 Samuel 16:23",
          segs: [{ text: "The king was troubled tonight. I played for him, and the shadows left him for a while.", at: 5 }] },
        { at: 5, size: "small", stones: true, segs: [{ text: "Stones of remembrance: {stones} of 12", at: 5 }] },
        { at: 5, size: "small", onlyIf: "missingOne", segs: [{ text: "There's still a lamb out there. I can hear it at night. I won't stop until I bring it home.", at: 5 }] },
        { at: 5, size: "small", onlyIf: "allOnes", segs: [{ text: "Every one of them is home. Not one was left behind.", at: 5 }] },
      ],
      right: [   // the song so far: verse 1 (Worlds 1-3), and the start of verse 2
        { at: 5, size: "psalm", segs: [{ text: "The Lord is my shepherd,", at: 5 }, { text: "\n" }, { text: "I have everything I need.", at: 5 }, { text: "\n" },
          { text: "He leads me beside the waters,", at: 5 }, { text: "\n" }, { text: "where the troubled waves grow still.", at: 5 }, { text: "\n" },
          { text: "He restores my soul again,", at: 5 }, { text: "\n" }, { text: "and guides me where He will.", at: 5 }, { text: "\n" },
          { text: "You lead me down the right road;", at: 5 }, { text: "\n" }, { text: "when the shadows gather, You remain the same.", at: 5 }] },
      ],
    },
  },
};

// ----------------------------------------------------------------------------
// The book and its pages. Points are on the 1536 x 1024 book image: three along the top edge, three along the bottom.
// ----------------------------------------------------------------------------
const BOOK = new Image(); BOOK.src = "../assets/items/davids_journal.png?v=" + (window.BUILD || 0);
const BOOK_RIPPED = new Image(); BOOK_RIPPED.src = "../assets/journal/davids_journal_page_ripped-out.png?v=" + (window.BUILD || 0);   // the stub of a torn-out page
const TEAR = Object.assign(new Image(), { src: "../assets/journal/journal_tear.png?v=" + (window.BUILD || 0) }), TEAR_N = 8, TEAR_MS = 110;
const TEAR_BOOK = [[16, 31, 251], [11, 27, 249], [11, 28, 249], [4, 27, 252], [13, 43, 250], [0, 45, 254], [6, 44, 258], [0, 43, 254]];   // the book's left half in each tear frame: left x, top, bottom (measured)
const BURN = Object.assign(new Image(), { src: "../assets/journal/journal_burn.png?v=" + (window.BUILD || 0) }), BURN_N = 7, BURN_MS = 160;
const BOOK_BOX = { x: 17, y: 58, w: 1493, h: 900 };   // the visible part of the image
const SPINE_X = 784;
const PAGE_EDGES = {
  left:  { top: [[234, 74], [516, 104], [714, 156]], bot: [[242, 822], [524, 836], [756, 864]], pad: [44, 56, 70, 50] },  // pad: left, right, top, bottom (flat px)
  right: { top: [[802, 158], [1016, 106], [1292, 80]], bot: [[852, 858], [1100, 828], [1374, 798]], pad: [60, 44, 90, 50] },
};
const FW = 520, FH = 780, RES = 2;   // each page is laid out flat at this size, then bent onto the book

let caveatReady = false;
try {
  const bin = atob(window.CAVEAT_TTF), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  const face = new FontFace("Caveat", buf.buffer);
  face.load().then(f => { document.fonts.add(f); caveatReady = true; }).catch(e => console.warn("Caveat font", e));
} catch (e) { console.warn("Caveat font", e); }

function curve(p, t) {   // a smooth curve through three points (t = 0 at the first, 1 at the last)
  const t1 = (p[1][0] - p[0][0]) / (p[2][0] - p[0][0]);
  const l0 = (t - t1) * (t - 1) / (t1), l1 = t * (t - 1) / (t1 * (t1 - 1)), l2 = t * (t - t1) / (1 - t1);
  return [l0 * p[0][0] + l1 * p[1][0] + l2 * p[2][0], l0 * p[0][1] + l1 * p[1][1] + l2 * p[2][1]];
}
// draw a flat page canvas onto the book, in thin vertical strips that follow the page's curve
function drawBent(g, flat, e, alpha = 1) {
  const N = 90, sw = flat.width / N;
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = alpha;
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N;
    const a = curve(e.top, u0), b = curve(e.top, u1), c = curve(e.bot, u0);
    g.setTransform((b[0] - a[0]) / sw, (b[1] - a[1]) / sw, (c[0] - a[0]) / flat.height, (c[1] - a[1]) / flat.height, a[0], a[1]);
    g.drawImage(flat, i * sw, 0, sw + 0.6, flat.height, 0, 0, sw + 0.6, flat.height);
  }
  g.restore();
}

// ----------------------------------------------------------------------------
// Layout: blocks -> words with positions (flat page coordinates)
// ----------------------------------------------------------------------------
const measureCtx = document.createElement("canvas").getContext("2d");
const fontPx = (kind, k) => Math.round({ entry: JTUNE.SIZE_ENTRY, ref: JTUNE.SIZE_REF, psalm: JTUNE.SIZE_PSALM, small: JTUNE.SIZE_SMALL, glyph: 120 }[kind] * k);   // glyph: an old letter copied big (letterNote)
const WRAP_INDENT = { ref: 16, psalm: 34 };   // a wrapped line of the song is indented, like poetry
// which conditional lines show (set when the Journal opens): "missingOne" or "allOnes" for this world's The One lambs
let journalFlags = {};
function onesFlags(world) {
  try {
    const p = JSON.parse(localStorage.getItem("davidProgress") || "{}");
    const all = [1, 2, 3, 4].every(k => p[`${world}-${k}`] && p[`${world}-${k}`].one);
    return { allOnes: all, missingOne: !all };
  } catch (e) { return { missingOne: true }; }
}
function layoutPage(blocks, side, step, stones) {
  const pad = PAGE_EDGES[side].pad, x0 = pad[0], x1 = FW - pad[1], maxY = FH - pad[3];
  for (let k = 1; k >= 0.6; k -= 0.05) {   // shrink the writing if a page gets too full
    const words = [], notes = [];
    let y = pad[2], prevKind = null, ok = true;
    for (const b of blocks) {
      if (b.at > step || (b.onlyIf && !journalFlags[b.onlyIf])) continue;
      const px = fontPx(b.size, k), lh = px * (b.size === "psalm" ? 1.35 : 1.12);
      y += prevKind === null ? 0 : b.size === "ref" ? px * 0.05 : px * 0.75;   // a gap between entries, none before a reference
      let x = x0 + (b.size === "ref" ? 16 * k : 0); y += px;
      measureCtx.font = `${px}px Caveat`;
      const space = measureCtx.measureText(" ").width;
      let first = true;
      for (const s of b.segs) {
        if (s.text === "\n") { x = x0; y += lh; first = true; continue; }
        if (s.at > step) continue;
        const text = b.stones ? s.text.replace("{stones}", stones) : s.text;
        measureCtx.font = s.glyph ? `bold ${px * 1.5}px "Segoe UI Historic"` : `${px}px Caveat`;   // an old Hebrew letter, copied in ink
        for (const w of text.split(" ")) {
          const ww = measureCtx.measureText(w).width;
          if (!first && x + ww > x1) { x = x0 + (WRAP_INDENT[b.size] || 0) * k; y += lh; }
          words.push({ text: w, x, y, w: ww, px, kind: b.size, at: s.at, strike: s.strike && s.strike <= step ? s.strike : 0, block: b, glyph: !!s.glyph });
          x += ww + space; first = false;
        }
      }
      if (b.note) notes.push({ block: b, text: b.note });
      prevKind = b.size;
      if (y > maxY) { ok = false; break; }
    }
    if (ok || k <= 0.6) return { words, notes };
  }
}

// the order things happen in on this step: left page words, a pause, then the right page (crossing out first)
function buildTimeline(spread, step) {
  const acts = []; let t = 0, lastBlock = null;
  const add = (a) => { a.t0 = t; t += a.dur; a.t1 = t; acts.push(a); };
  for (const side of ["left", "right"]) {
    const ws = spread[side].words;
    if (side === "right" && acts.length && ws.some(w => w.at === step || w.strike === step)) add({ type: "pause", dur: JTUNE.PAGE_PAUSE });
    for (let i = 0; i < ws.length; i++) {
      const w = ws[i];
      if (w.strike === step) {
        add({ type: "strike", w, dur: JTUNE.STRIKE_TIME });
        if (!(ws[i + 1] && ws[i + 1].strike === step)) add({ type: "pause", dur: JTUNE.STRIKE_PAUSE });
      }
      if (w.at === step) {
        if (lastBlock && w.block !== lastBlock && w.kind !== "ref") add({ type: "pause", dur: JTUNE.BLOCK_PAUSE });
        lastBlock = w.block;
        add({ type: "write", w, dur: (JTUNE.WORD_BASE + JTUNE.WORD_TIME * w.text.length) * (w.kind === "ref" ? JTUNE.REF_SPEED : 1) });
      }
    }
  }
  for (const a of acts) {
    if (a.type === "write") { a.w.r0 = a.t0; a.w.r1 = a.t1; }
    if (a.type === "strike") { a.w.s0 = a.t0; a.w.s1 = a.t1; }
  }
  return { acts, total: t };
}

// ----------------------------------------------------------------------------
// Drawing a spread at time t
// ----------------------------------------------------------------------------
const flatCanvas = { left: document.createElement("canvas"), right: document.createElement("canvas") };
for (const c of Object.values(flatCanvas)) { c.width = FW * RES; c.height = FH * RES; }
const spreadCanvas = [0, 1].map(() => { const c = document.createElement("canvas"); c.width = 1536; c.height = 1024; return c; });

function wobble(seed) { return Math.sin(seed * 12.9898) * 43758.5453 % 1; }
function drawFlatPage(side, page, step, t) {
  const c = flatCanvas[side], g = c.getContext("2d");
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, c.width, c.height);
  g.setTransform(RES, 0, 0, RES, 0, 0); g.textBaseline = "alphabetic";
  let pen = null;
  page.words.forEach((w, i) => {
    let f = w.at < step ? 1 : w.r1 === undefined ? 0 : Math.max(0, Math.min(1, (t - w.r0) / (w.r1 - w.r0)));
    if (f <= 0) return;
    g.font = w.glyph ? `bold ${w.px * 1.5}px "Segoe UI Historic"` : `${w.px}px Caveat`; g.fillStyle = w.kind === "ref" ? JTUNE.INK_REF : JTUNE.INK;
    if (f < 1) { g.save(); g.beginPath(); g.rect(w.x - 4, w.y - w.px * 1.2, (w.w + 8) * f, w.px * 1.7); g.clip(); pen = [w.x + w.w * f, w.y - w.px * 0.25]; }
    g.fillText(w.text, w.x, w.y);
    if (f < 1) g.restore();
    // crossed out: a quick, slightly uneven line through the word (joined to the next crossed-out word)
    if (w.strike) {
      const sf = w.strike < step ? 1 : Math.max(0, Math.min(1, (t - w.s0) / (w.s1 - w.s0)));
      if (sf > 0) {
        const next = page.words[i + 1], joined = next && next.strike === w.strike && next.y === w.y;
        const xa = w.x - 3, xb = (joined ? next.x : w.x + w.w + 3), y = w.y - w.px * 0.28;
        g.strokeStyle = JTUNE.INK; g.lineWidth = Math.max(2, w.px * 0.075); g.lineCap = "round";
        g.beginPath(); g.moveTo(xa, y + wobble(i) * 2);
        const xe = xa + (xb - xa) * sf; g.quadraticCurveTo((xa + xe) / 2, y - 2 + wobble(i + 3) * 3, xe, y + 1 + wobble(i + 7) * 2); g.stroke();
        if (sf < 1) pen = [xe, y];
      }
    }
  });
  return pen;
}
function tornStub(c) {   // a ragged brown strip along the binding edge of the right page (drawn flat, then bent onto the scene)
  const g = c.getContext("2d"); g.save(); g.setTransform(RES, 0, 0, RES, 0, 0);
  g.fillStyle = "rgb(150,110,70)"; g.beginPath(); g.moveTo(0, 0);
  for (let y = 0; y <= FH; y += 18) g.lineTo(26 + Math.abs(Math.sin(y * 0.37) * 14 + Math.sin(y * 0.11) * 9), y);
  g.lineTo(0, FH); g.closePath(); g.fill();
  g.strokeStyle = "rgb(110,75,45)"; g.lineWidth = 3; g.stroke(); g.restore();
}
function renderSpread(target, spread, step, t) {
  const g = target.getContext("2d");
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, target.width, target.height);
  const book = spread.book && spread.book.naturalWidth ? spread.book : BOOK;
  if (book.naturalWidth) g.drawImage(book, 0, 0);
  for (const side of ["left", "right"]) { drawFlatPage(side, spread[side], step, t); drawBent(g, flatCanvas[side], PAGE_EDGES[side]); }
}

// ----------------------------------------------------------------------------
// Sound: a soft pen scratch for each word, and the harp while he writes
// ----------------------------------------------------------------------------
let noiseBuf = null;
function penScratch(dur, loud = 1) {
  if (typeof audioUnlocked === "undefined" || !audioUnlocked) return;
  try {
    const ac = chimeCtx || (chimeCtx = new (window.AudioContext || window.webkitAudioContext)());
    if (!noiseBuf) { noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain(), t0 = ac.currentTime;
    src.buffer = noiseBuf; bp.type = "bandpass"; bp.frequency.value = 2600 + Math.random() * 1400; bp.Q.value = 0.9;
    const v = Math.max(0.0003, 0.05 * JTUNE.PEN_VOLUME * loud * sfxMul());
    g.gain.setValueAtTime(0.0001, t0);
    // little strokes inside the word, not one long hiss
    const n = Math.max(1, Math.round(dur / 0.07));
    for (let k = 0; k < n; k++) { const a = t0 + k * dur / n; g.gain.exponentialRampToValueAtTime(v * (0.6 + Math.random() * 0.5), a + 0.012); g.gain.exponentialRampToValueAtTime(0.0002, a + dur / n * 0.9); }
    src.connect(bp).connect(g).connect(ac.destination);
    src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
  } catch (e) {}
}
const journalMusic = new Audio(`../assets/audio/harp_loop.mp3?v=${window.BUILD || 0}`); journalMusic.loop = true; journalMusic._music = true; journalMusic.volume = 0;

// ----------------------------------------------------------------------------
// The Journal screen
//   Journal.open({ world, stage, onClose }) after a stage. Glen's scene: David reading by the lamp, the sheep
//   behind him, writing on the book in his hands. Up = lean in (the book fills the screen), Down = back.
//   Left / Right = page back through the spreads. At the world's end (stage 4) A turns to the world's spread.
// ----------------------------------------------------------------------------
const SCENES = {   // per world: the art, how far to shift it up on screen, the lamp flame, and the two pages' edges
  1: { src: "../assets/journal/w1_reading.jpg", y: -40, lamp: [1384, 712],
       left:  { top: [[645, 388], [790, 412], [903, 468]], bot: [[500, 690], [640, 752], [775, 800]] },
       right: { top: [[915, 470], [1060, 478], [1210, 515]], bot: [[787, 800], [950, 840], [1100, 870]] } },
  // Glen's scenes for Worlds 2-4 (2026-10-15): the same over-the-shoulder framing; page edges marked by hand
  2: { src: "../assets/journal/w2_reading.jpg", y: -40, lamp: [1368, 800],   // the wilderness camp, the fire and the pen
       left:  { top: [[672, 480], [772, 502], [876, 538]], bot: [[546, 758], [652, 784], [756, 804]] },
       right: { top: [[884, 536], [1012, 538], [1144, 560]], bot: [[764, 808], [896, 848], [1032, 872]] } },
  3: { src: "../assets/journal/w3_reading.jpg", y: -40, lamp: [1332, 800],   // the far pasture after the storm, Bethlehem's lights
       left:  { top: [[646, 462], [756, 486], [868, 532]], bot: [[526, 740], [636, 776], [748, 804]] },
       right: { top: [[872, 532], [1000, 544], [1136, 572]], bot: [[756, 808], [888, 848], [1028, 876]] } },
  4: { src: "../assets/journal/w4_reading.jpg", y: -40, lamp: [1392, 712],   // a servant's room in Saul's palace, the storm outside
       left:  { top: [[652, 462], [770, 482], [892, 520]], bot: [[556, 776], [660, 804], [772, 828]] },
       right: { top: [[900, 520], [1032, 532], [1168, 564]], bot: [[780, 832], [928, 868], [1080, 892]] } },
  // Glen's World 5 scene (2026-10-19): on the hillside over the Valley of Elah, the camps' fires below. Mirrored from the
  // others: the lamp on the left, David on the right
  5: { src: "../assets/journal/w5_reading.jpg", y: -40, lamp: [144, 848],
       left:  { top: [[350, 531], [455, 538], [557, 573]], bot: [[430, 820], [535, 826], [637, 832]] },
       right: { top: [[560, 570], [660, 532], [755, 519]], bot: [[640, 830], [740, 800], [850, 767]] } },
  // the letter note (Glen, 2026-10-18): David standing, looking down at the open book, the ground at his feet (his cut-out
  // over his ground pictures, put together in david-sling-art/journal_note). No lamp: it's out of doors (or the hall's own)
  note_road: { src: "../assets/journal/note_road.jpg", y: 0,
       left:  { top: [[180, 172], [380, 166], [584, 186]], bot: [[262, 800], [492, 780], [732, 748]] },
       right: { top: [[606, 184], [806, 134], [1000, 100]], bot: [[750, 744], [976, 702], [1192, 664]] } },
};
SCENES.note_hall = { ...SCENES.note_road, src: "../assets/journal/note_hall.jpg" };   // 4-4, the king's hall at night
SCENES.note_town = { ...SCENES.note_road, src: "../assets/journal/note_town.jpg" };   // 4-3, Gibeah's paved street
const noteScene = () => ({ "4-3": SCENES.note_town, "4-4": SCENES.note_hall })[LEVEL_STAGE] || SCENES.note_road;   // the ground at David's feet
for (const sc of Object.values(SCENES)) { sc.img = new Image(); sc.img.src = sc.src + "?v=" + (window.BUILD || 0); }
const newCanvas = () => Object.assign(document.createElement("canvas"), { width: 1536, height: 1024 });
const sceneCanvas = newCanvas(), pageCanvas = { left: newCanvas(), right: newCanvas() }, farCanvas = newCanvas();
// just the paper of one page (no cover), for the page that turns
function clipPage(src, dst, side) {
  const g = dst.getContext("2d"), e = PAGE_EDGES[side];
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 1536, 1024); g.save(); g.beginPath();
  for (let k = 0; k <= 20; k++) { const p = curve(e.top, k / 20); k ? g.lineTo(p[0], p[1] - 8) : g.moveTo(p[0], p[1] - 8); }
  for (let k = 20; k >= 0; k--) { const p = curve(e.bot, k / 20); g.lineTo(p[0], p[1] + 10); }
  g.closePath(); g.clip(); g.drawImage(src, 0, 0); g.restore();
}
const ease = f => f * f * (3 - 2 * f);

const Journal = {
  active: false, preview: false, previewStep: 1,
  open(opts) {
    const P = JOURNAL_PAGES[opts.world]; if (!P) { opts.onClose && opts.onClose(); return; }
    this.P = P; this.world = opts.world; this.onClose = opts.onClose || null; this.preview = !!opts.preview;
    this.stones = opts.stones ?? stonesFound(opts.world);
    journalFlags = onesFlags(opts.world);
    // the spreads, in order. After stage 4 there are two to write: the last lesson, then the world's spread.
    this.pages = [{ spread: "draft", step: Math.min(4, opts.stage) }];
    this.rip = null;
    if (P.rip && !opts.read && opts.stage === P.rip.at && !opts.preview) {
      let seen = false; try { seen = !!(JSON.parse(localStorage.getItem("davidProgress") || "{}").ripped || {})[opts.world]; } catch (e) {}
      if (!seen) this.pages[0].ripNow = true;
    }
    if (opts.stage >= 4 && !opts.noEnd) this.pages.push({ spread: "end", step: 5 });
    if (opts.read && opts.stage < 4) this.pages[0].step = opts.stage;
    // reading the Journal later: a page with the pieces of the throw Father has given you (DESIGN §4c)
    const learned = typeof throwLearned === "function" ? throwLearned() : 0;
    if (opts.read && learned > 0) { this.P = Object.assign({}, this.P, { throw: throwSpread(learned) }); this.pages.push({ spread: "throw", step: 5 }); }
    // and the old letters he's found (DESIGN 7-3, the Stones of the Name): copied down, with the ones still out there
    const lf = lettersFound();
    if (opts.read && lf.length) { this.P = Object.assign({}, this.P, { letters: lettersSpread(lf) }); this.pages.push({ spread: "letters", step: 5 }); }
    // and the Field Guide card he wrote down watching the giant in 6-2 (world6.js goliathNote)
    let gc = false; try { gc = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").goliathCard; } catch (e) {}
    if (opts.read && gc && typeof goliathNote === "function") { this.P = Object.assign({}, this.P, { goliath: goliathNote() }); this.pages.push({ spread: "goliath", step: 5 }); }
    this.note = false;
    this.read = !!opts.read;   // read = opened from the map: everything's already written, just page through
    this.layoutAll();
    this.cur = this.read ? this.pages.length - 1 : 0; this.phase = this.read ? "done" : "write"; this.doneT = 0; this.fade = 0; this.closing = false; this.time = 0;
    this.view = 0; this.viewWant = 0; this.turn = null;
    if (this.rip) this.view = this.viewWant = 1;   // leaned in close, to see it
    this.active = true;
    if (typeof audioUnlocked !== "undefined" && audioUnlocked) { journalMusic.currentTime = 0; journalMusic.play().catch(() => {}); }
  },
  // a quick note in the middle of a stage (Glen, 2026-10-18): David copies an old letter he's just found, with what it
  // pictured. Leaned in on the book (Glen's own looking-down-at-the-book scene, SCENES.note, when it comes); A closes it
  openNote(spread, onClose) {
    Object.assign(this, { P: { note: spread }, world: WORLD, onClose: onClose || null, preview: false, stones: 0, rip: null, read: false, note: true,
      pages: [{ spread: "note", step: 5 }] });
    journalFlags = {};
    this.layoutAll();
    const nk = noteScene(), lean = nk.img.naturalWidth ? 0 : 1;   // his own looking-down view, once it's loaded
    Object.assign(this, { cur: 0, phase: "write", doneT: 0, fade: 0, closing: false, time: 0, view: lean, viewWant: lean, turn: null, active: true });
    if (typeof audioUnlocked !== "undefined" && audioUnlocked) { journalMusic.currentTime = 0; journalMusic.play().catch(() => {}); }
  },
  openPreview(step, stones) {   // 1-4 = after that stage; 5 = the world's end (the 1-4 lesson, then the page turn)
    this.previewStep = step;
    this.open({ world: 1, stage: step === 5 ? 4 : step, preview: true, stones, noEnd: step === 4 });
  },
  layoutAll() {
    const R = this.P.rip;
    for (const pg of this.pages) {
      const S = this.P[pg.spread], torn = R && pg.spread === "draft" && pg.step >= R.at;
      const right = torn ? S.right.map(b => ({ ...b, segs: b.segs.filter(sg => !(sg.strike && sg.strike <= R.at)) })) : S.right;
      pg.lay = { left: layoutPage(S.left, "left", pg.step, this.stones), right: layoutPage(right, "right", pg.step, this.stones) };
      if (torn) pg.lay.book = BOOK_RIPPED;
      if (torn && pg.ripNow) for (const w of pg.lay.right.words) if (w.at < pg.step) w.at = pg.step;   // the fresh page: he writes it all again
      if (pg.ripNow) {   // first, the page he tears out: what was there before, and the bitter words he starts
        const before = S.right.map(b => ({ ...b, segs: b.segs.filter(sg => sg.at < R.at).map(sg => ({ ...sg, strike: 0 })) }));
        const lay = { left: layoutPage(S.left, "left", R.at - 1, this.stones),
                      right: layoutPage(before.concat([{ at: R.at, size: "entry", segs: [{ text: R.text, at: R.at }] }]), "right", R.at, this.stones) };
        this.rip = { phase: "write", t: 0, step: R.at, lay, tl: buildTimeline(lay, R.at), next: 0 };
      }
      pg.tl = buildTimeline(pg.lay, pg.step); pg.t = this.read ? pg.tl.total : 0; pg.nextAct = this.read ? pg.tl.acts.length : 0;
    }
    this.fontOk = caveatReady;   // laid out before the font arrived? do it again once it has
  },
  page() { return this.pages[this.cur]; },
  close() { this.closing = true; },
  turnTo(i) {
    if (i < 0 || i >= this.pages.length || i === this.cur || this.turn) return;
    const fwd = i > this.cur;
    this.turn = { from: this.cur, to: i, t: 0, fwd };
    renderSpread(spreadCanvas[0], this.page().lay, this.page().step, this.page().t);
    this.cur = i;
    renderSpread(spreadCanvas[1], this.page().lay, this.page().step, this.page().t);
    // the sheet that turns: going forward it's the old right page, landing as the new left page
    clipPage(spreadCanvas[fwd ? 0 : 1], pageCanvas.right, "right");
    clipPage(spreadCanvas[fwd ? 1 : 0], pageCanvas.left, "left");
    clipPage(spreadCanvas[1], farCanvas, fwd ? "right" : "left");   // the new page that's uncovered underneath
    sfxPageTurn();
  },
  update(dt) {
    if (JOURNAL_SIM && caveatReady && !this.simDone) { this.simDone = true; for (let i = 0; i < JOURNAL_SIM * 30; i++) this.update(1 / 30); this.frozen = JOURNAL_FREEZE; }
    if (this.frozen) return;   // &jfreeze: stop there (testing)   // ?jt=8: jump 8 seconds ahead (testing)
    journalMusic.volume = Math.max(0, Math.min(JTUNE.MUSIC_VOLUME, journalMusic.volume + (this.closing ? -dt * 0.8 : dt * 0.6)));
    if (this.closing) {
      this.fade -= dt * 1.5;
      if (this.fade <= 0) { this.active = false; journalMusic.pause(); const cb = this.onClose; this.onClose = null; cb && cb(); }
      return;
    }
    this.fade = Math.min(1, this.fade + dt * 1.5); this.time += dt;
    if (!caveatReady) return;
    if (!this.fontOk) this.layoutAll();
    if (JOURNAL_VIEW) this.viewWant = this.view = 1;
    if (pressed("up")) this.viewWant = 1;
    if (pressed("down")) this.viewWant = 0;
    this.view += Math.sign(this.viewWant - this.view) * Math.min(Math.abs(this.viewWant - this.view), dt / JTUNE.LEAN_TIME);
    if (this.preview && pressed("select")) { this.openPreview(this.previewStep % 5 + 1, this.stones); this.fade = 1; return; }
    if (this.turn) {
      this.turn.t += dt;
      if (this.turn.t >= JTUNE.FLIP_TIME) { this.turn = null; this.phase = this.page().t < this.page().tl.total ? "write" : "done"; this.doneT = 0; }
      return;
    }
    if (this.rip && this.rip.phase !== "done") { this.updateRip(dt); return; }
    const pg = this.page(), next = this.pages[this.cur + 1];
    const go = pressed("a") || pressed("start") || (JOURNAL_AUTO && this.phase === "done" && this.doneT > 0.8 && next && next.t === 0);   // ?jauto=1 (testing)
    if (this.phase === "write") {
      pg.t += dt;
      while (pg.nextAct < pg.tl.acts.length && pg.tl.acts[pg.nextAct].t0 <= pg.t) {
        const a = pg.tl.acts[pg.nextAct++];
        if (a.type === "write") penScratch(a.dur * 0.85);
        if (a.type === "strike") penScratch(a.dur * 0.7, 1.8);
      }
      if (go) { pg.t = pg.tl.total; pg.nextAct = pg.tl.acts.length; }
      if (pg.t >= pg.tl.total) { this.phase = "done"; this.doneT = 0; }
      return;
    }
    this.doneT += dt;
    // page back and forth through what's written (not ahead into a page he hasn't started)
    if (pressed("left")) this.turnTo(this.cur - 1);
    if (pressed("right") && next && next.t > 0) this.turnTo(this.cur + 1);
    if (go && this.doneT > 0.25) {
      const unwritten = this.pages.findIndex(p => p.t === 0);
      if (unwritten >= 0) this.turnTo(unwritten);
      else this.close();
    }
  },
  updateRip(dt) {   // write the bitter words, stop, tear the page out, burn it; then the real lesson
    const r = this.rip; r.t += dt;
    if (pressed("a") || pressed("start")) { r.phase = "done"; this.ripDone(); return; }
    if (r.phase === "write") {
      while (r.next < r.tl.acts.length && r.tl.acts[r.next].t0 <= r.t) { const a = r.tl.acts[r.next++]; if (a.type === "write") penScratch(a.dur * 0.85); }
      if (r.t >= r.tl.total + 1.3) { r.phase = SPR.david_rip_page ? "fire" : "tear"; r.t = 0; this.viewWant = this.view = 1; }   // he stops...
    } else if (r.phase === "fire") {   // the cutaway: by the campfire at night, he tears it out and throws it in (Glen's sheet)
      if (r.t >= 0.9 && !r.ripSnd) { r.ripSnd = true; if (typeof sfx === "function" && !(SFX.paper_rip || {}).missing) sfx("paper_rip", undefined, 1); else penScratch(0.55, 5); }   // Glen's paper rip, slowed for drama
      if (r.t >= 3.0 && !r.whoosh) { r.whoosh = true; if (typeof sfx === "function") sfx("jump", undefined, 0.3, 0.6); }
      if (r.t >= 6.2) { r.phase = "done"; this.ripDone(); }
    } else if (r.phase === "tear") {
      if (r.t >= TEAR_N * TEAR_MS / 1000 + 0.4) { r.phase = "burn"; r.t = 0; }
    } else if (r.phase === "burn") {
      if (r.t >= BURN_N * BURN_MS / 1000 + 0.7) { r.phase = "done"; this.ripDone(); }
    }
  },
  ripDone() {
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.ripped = p.ripped || {}; p.ripped[this.world] = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
    this.page().t = 0; this.page().nextAct = 0; this.phase = "write";
  },
  drawRipFire() {   // David by the fire at night (3-2's far pasture, dark), tearing the page out and throwing it in
    const r = this.rip, t = r.t, gy = H * 0.88, dx = W * 0.36, fx = W * 0.62, now = performance.now(), SZ = 2.3;
    const L = typeof BG !== "undefined" && BG.w3_2;
    ctx.fillStyle = "#0b1020"; ctx.fillRect(0, 0, W, H);
    if (L && L.far && L.far.naturalWidth) { ctx.save(); ctx.filter = "brightness(0.6) saturate(0.7)"; ctx.drawImage(L.far, 0, -H * 0.12, W, H); ctx.restore();
    }
    // the pasture's own hills and ground (3-2's layers and the stage's topsoil and earth), then all of it moonlit
    if (L && L.mid && L.mid.naturalWidth) drawLayerRepeating(L.mid, 0, 1, gy + 10, 360, true);
    if (L && L.near && L.near.naturalWidth) drawLayerRepeating(L.near, 0, 1, gy + 26, 150, true);
    ctx.fillStyle = (typeof terPattern === "function" && terPattern("sediment", TUNE.TER_FILL_SCALE)) || "#2a2418"; ctx.fillRect(0, gy - 2, W, H - gy + 2);
    if (typeof terStrip === "function") terStrip("topsoil", -4, W + 4, gy - TUNE.TER_GRASS_RISE, TUNE.TER_TOPSOIL_H);
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#33406e"; ctx.fillRect(0, 0, W, H); ctx.restore();   // moonlit blue
    ctx.fillStyle = "rgba(4,6,14,0.35)"; ctx.fillRect(0, 0, W, H);
    const fl = 0.85 + Math.sin(now / 70) * 0.08 + Math.sin(now / 23) * 0.05, burst = t > 3.3 && t < 4.6 ? 1.6 : 1;
    const gr = ctx.createRadialGradient(fx, gy - 40, 10, fx, gy - 40, 300 * burst);
    gr.addColorStop(0, `rgba(255,150,50,${0.42 * fl})`); gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (ITEM.campfire && ITEM.campfire.naturalWidth) drawItem("campfire", fx, gy + 6, 1.5);
    // David: reading (0), the tear (1-3), holding it out (4), the toss (5)
    const i = t < 0.9 ? 0 : t < 1.4 ? 1 : t < 1.9 ? 2 : t < 2.5 ? 3 : t < 3.0 ? 4 : 5;
    drawSprite("david_rip_page", i, dx, gy, 1, SZ);
    const h = 300 * SCALE * SZ;
    if (t >= 3.0 && t < 3.5) {   // the crumpled page arcing into the fire
      const f = (t - 3.0) / 0.5, x0 = dx + h * 0.62, y0 = gy - h * 0.62, x = x0 + (fx - x0) * f, y = y0 + (gy - 40 - y0) * f - Math.sin(f * Math.PI) * 60;
      ctx.save(); ctx.translate(x, y); ctx.rotate(f * 5); ctx.fillStyle = "#e9dcc0"; ctx.beginPath(); ctx.moveTo(-14, -10); ctx.lineTo(12, -14); ctx.lineTo(16, 8); ctx.lineTo(-10, 14); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (t >= 3.5 && BURN.naturalWidth) {   // it burns in the flames (Glen's burn sheet, small)
      const k = Math.min(BURN_N - 1, Math.floor((t - 3.5) * 1000 / BURN_MS)), fw = BURN.naturalWidth / BURN_N, fh = BURN.naturalHeight, bh = 130, bw = bh * fw / fh;
      ctx.drawImage(BURN, k * fw, 0, fw, fh, fx - bw / 2, gy - 75 - bh / 2, bw, bh);
    }
    const a = Math.min(1, t / 0.5, (6.2 - t) / 0.5); ctx.fillStyle = `rgba(0,0,0,${1 - Math.max(0, a)})`; ctx.fillRect(0, 0, W, H);   // fade in and out
  },
  drawRip(bx, by, s) {
    const r = this.rip, dw = 1536 * s, dh = 1024 * s;
    if (r.phase === "fire") { this.drawRipFire(); return; }
    if (r.phase === "write") { renderSpread(spreadCanvas[0], r.lay, r.step, r.t); ctx.drawImage(spreadCanvas[0], bx, by, dw, dh); return; }
    if (r.phase === "tear" && TEAR.naturalWidth) {   // Glen's tear sheet, scaled over the book
      const i = Math.min(TEAR_N - 1, Math.floor(r.t * 1000 / TEAR_MS)), fw = TEAR.naturalWidth / TEAR_N, fh = TEAR.naturalHeight;
      const [lx, ty, by2] = TEAR_BOOK[i], k = BOOK_BOX.h * s / (by2 - ty);   // each frame's book pinned to the real one (left edge, top, bottom)
      ctx.drawImage(TEAR, i * fw, 0, fw, fh, bx + BOOK_BOX.x * s - lx * k, by + BOOK_BOX.y * s - ty * k, fw * k, fh * k); return;
    }
    if (r.phase === "burn") {   // the torn book dim behind; the page burning to ash in the firelight
      if (BOOK_RIPPED.naturalWidth) { ctx.save(); ctx.globalAlpha *= 0.45; ctx.drawImage(BOOK_RIPPED, bx, by, dw, dh); ctx.restore(); }
      const cx = W / 2, cy = H / 2, fl = 0.8 + Math.sin(performance.now() / 60) * 0.1;
      const gl = ctx.createRadialGradient(cx, cy, 20, cx, cy, 380); gl.addColorStop(0, `rgba(255,140,40,${0.45 * fl})`); gl.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      if (BURN.naturalWidth) { const i = Math.min(BURN_N - 1, Math.floor(r.t * 1000 / BURN_MS)), fw = BURN.naturalWidth / BURN_N, fh = BURN.naturalHeight, h = H * 0.62, w = h * fw / fh;
        ctx.drawImage(BURN, i * fw, 0, fw, fh, cx - w / 2, cy - h / 2, w, h); }
    }
  },
  // ---- drawing ----
  draw() {
    const a = Math.max(0, this.fade), v = ease(this.view);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = a;
    if (v < 1) this.drawScene();
    if (v > 0) { ctx.globalAlpha = a * v; this.drawBook(0.94 + 0.06 * v); }
    ctx.globalAlpha = a;
    // the footnote (where the Bible records it later), once its entry is written
    const pg = this.page();
    if (!this.turn) {
      const words = pg.lay.left.words.concat(pg.lay.right.words);
      const notes = [...pg.lay.left.notes, ...pg.lay.right.notes].filter(n => words.filter(w => w.block === n.block).every(w => w.r1 === undefined || pg.t >= w.r1));
      ctx.textAlign = "center"; ctx.font = "italic 17px Georgia, serif";
      notes.forEach((n, i) => this.shadowText(n.text, W / 2, H - 34 - i * 22, "#efdcb8"));
    }
    // what to press
    ctx.font = "15px sans-serif"; ctx.textAlign = "right";
    const keys = [];
    if ((this.phase === "write" || (this.rip && this.rip.phase !== "done")) && !this.turn) keys.push("A: skip");
    if (this.phase === "done" && !this.turn) keys.push(this.pages.some(p => p.t === 0) ? "A: turn the page" : "A: continue");
    if (this.cur > 0 || this.pages[this.cur + 1]?.t > 0) keys.push("Left / Right: pages");
    keys.push(this.viewWant ? "Down: sit back" : "Up: lean in");
    this.shadowText(keys.join("     "), W - 16, H - 10, "rgba(255,240,215,0.85)");
    if (this.preview) {
      ctx.textAlign = "left";
      const label = this.previewStep === 5 ? `World ${this.world} end` : `after ${this.world}-${this.previewStep}`;
      this.shadowText(`Journal preview: ${label}  (Select: next, 4: close)`, 16, H - 10, "rgba(255,240,215,0.85)");
    }
    ctx.restore();
  },
  shadowText(t, x, y, color) { ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillText(t, x + 1, y + 1); ctx.fillStyle = color; ctx.fillText(t, x, y); },
  drawScene() {   // Glen's scene, with the words on the book in David's hands
    const nk = this.note && noteScene();
    const sc = (nk && nk.img.naturalWidth ? nk : null) || SCENES[this.world] || SCENES[1], img = sc.img;
    if (!img.naturalWidth) return;
    const g = sceneCanvas.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(img, 0, 0, 1536, 1024);
    const words = (pg, alpha) => {
      for (const side of ["left", "right"]) {
        drawFlatPage(side, pg.lay[side], pg.step, pg.t);
        if (side === "right" && pg.lay.book === BOOK_RIPPED) tornStub(flatCanvas.right);   // the stub of the page he tore out
        drawBent(g, flatCanvas[side], sc[side], alpha);
      }
    };
    if (this.turn) {   // the words fade over to the next page
      const f = Math.min(1, this.turn.t / JTUNE.FLIP_TIME);
      words(f < 0.5 ? this.pages[this.turn.from] : this.page(), Math.abs(1 - 2 * f));
    } else words(this.page(), 1);
    // the lamp flickers
    const now = performance.now(), fl = 0.8 + Math.sin(now / 83) * 0.08 + Math.sin(now / 31) * 0.05 + Math.sin(now / 211) * 0.07;
    if (sc.lamp) {
    g.globalCompositeOperation = "lighter";
    const gr = g.createRadialGradient(sc.lamp[0], sc.lamp[1], 10, sc.lamp[0], sc.lamp[1], 520);
    gr.addColorStop(0, `rgba(255,170,70,${0.16 * fl})`); gr.addColorStop(0.4, `rgba(255,140,50,${0.06 * fl})`); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 1536, 1024); g.globalCompositeOperation = "source-over";
    }
    // fill the screen, drifting very slowly in toward the book
    const z = 1 + 0.04 * ease(Math.min(1, this.time / 30)), s = Math.max(W / 1536, H / 1024) * z;
    const bookX = 850, bookY = 640, k = (z - 1) / 0.04;
    const x = Math.max(W - 1536 * s, Math.min(0, (W - 1536 * s) / 2 + (W / 2 - bookX * s - (W - 1536 * s) / 2) * k * 0.3));
    const y = Math.max(H - 1024 * s, Math.min(0, sc.y + (H / 2 - bookY * s - sc.y) * k * 0.3));
    ctx.drawImage(sceneCanvas, x, y, 1536 * s, 1024 * s);
  },
  drawBook(zoom) {   // leaning in: the book fills the screen
    ctx.fillStyle = "#0d0805"; ctx.fillRect(0, 0, W, H);
    const fl = 0.85 + Math.sin(performance.now() / 90) * 0.04 + Math.sin(performance.now() / 37) * 0.03;
    const glow = ctx.createRadialGradient(W * 0.5, H * 0.62, 40, W * 0.5, H * 0.55, W * 0.62);
    glow.addColorStop(0, `rgba(255,170,80,${0.32 * fl})`); glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    const s = Math.min((W - 40) / BOOK_BOX.w, (H - 60) / BOOK_BOX.h) * zoom;
    const bx = W / 2 - (BOOK_BOX.x + BOOK_BOX.w / 2) * s, by = (H - 52) / 2 + 4 - (BOOK_BOX.y + BOOK_BOX.h / 2) * s;
    if (this.rip && this.rip.phase !== "done") this.drawRip(bx, by, s);
    else if (this.turn) this.drawFlip(bx, by, s);
    else {
      const pg = this.page();
      renderSpread(spreadCanvas[0], pg.lay, pg.step, pg.t);
      ctx.drawImage(spreadCanvas[0], bx, by, 1536 * s, 1024 * s);
    }
    // a warm lamplight tint over the pages
    ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = `rgb(255,${226 + 8 * fl | 0},190)`;
    ctx.fillRect(bx + BOOK_BOX.x * s, by + BOOK_BOX.y * s, BOOK_BOX.w * s, BOOK_BOX.h * s); ctx.globalCompositeOperation = "source-over";
  },
  drawFlip(bx, by, s) {   // a page turning: forward = the right page lifts over to the left, back = the other way
    const T = this.turn, f = ease(Math.min(1, T.t / JTUNE.FLIP_TIME)), dw = 1536 * s, dh = 1024 * s, sx = bx + SPINE_X * s;
    // underneath: the spread we're leaving, with the new spread's far page already uncovered
    ctx.drawImage(spreadCanvas[0], bx, by, dw, dh);
    ctx.drawImage(farCanvas, bx, by, dw, dh);
    const lift = Math.abs(1 - 2 * f);            // 1 = lying flat, 0 = standing straight up over the spine
    const onRight = (f < 0.5) === T.fwd;          // which side of the spine the turning sheet is on right now
    ctx.save(); ctx.translate(sx, by - (1 - lift) * 16); ctx.scale(lift, 1);
    if (onRight) ctx.drawImage(pageCanvas.right, SPINE_X, 0, 1536 - SPINE_X, 1024, 0, 0, dw - SPINE_X * s, dh);
    else ctx.drawImage(pageCanvas.left, 0, 0, SPINE_X, 1024, -SPINE_X * s, 0, SPINE_X * s, dh);
    ctx.restore();
    // a soft shadow along the sheet as it lifts
    const w = (onRight ? dw - SPINE_X * s : SPINE_X * s) * lift;
    const gr = ctx.createLinearGradient(sx, 0, onRight ? sx + w : sx - w, 0);
    gr.addColorStop(0, `rgba(0,0,0,${0.3 * (1 - lift)})`); gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gr; ctx.fillRect(onRight ? sx : sx - w, by, w, dh);
  },
};
function sfxPageTurn() { penScratch(0.35, 2.5); }

// special stones found in each stage are saved by stage ("1-1": 3, ...); the world's spread shows the total
function stonesFound(world) {
  try { const s = JSON.parse(localStorage.getItem("davidStones") || "{}"); return [1, 2, 3, 4].reduce((n, k) => n + Math.min(3, s[`${world}-${k}`] || 0), 0); } catch (e) { return 0; }   // 3 a stage (2-3 once had 4)
}
function saveStones(stage, n) {
  try { const s = JSON.parse(localStorage.getItem("davidStones") || "{}"); s[stage] = Math.max(s[stage] || 0, n); localStorage.setItem("davidStones", JSON.stringify(s)); } catch (e) {}
}

// "?journal=3" in the address opens the Journal preview at that page (5 = the world's end)
const JOURNAL_AUTO = new URLSearchParams(location.search).has("jauto");
const JOURNAL_VIEW = new URLSearchParams(location.search).has("jbook");   // start leaned in (testing)
const JOURNAL_FREEZE = new URLSearchParams(location.search).has("jfreeze");
const JOURNAL_SIM = Number(new URLSearchParams(location.search).get("jt")) || 0;
const JOURNAL_AT = Number(new URLSearchParams(location.search).get("journal"));
if (JOURNAL_AT) Journal.openPreview(JOURNAL_AT);

// "The Throw": the pieces Jesse has given, in David's hand, in words (the handwriting font has no arrow signs)
const THROW_LINES = [
  "Up. Look up: the LORD goes ahead of me, as He did with the lion.",
  "Up again. The same help, again, with the bear.",
  "Down. Kneel: stay humble.",
  "Down again. Bow: I serve the king.",
  "Left, right. Steady steps on the road, even in the dark.",
  "Left, right again. In the valley, don't run either way.",
  "B. The sling my hands know.",
  "A. Faith: the battle is the LORD's.",
];
function throwSpread(n) {
  const left = [{ at: 5, size: "entry", segs: [{ text: "The throw, the way Father taught me:", at: 5 }] }];
  for (let k = 0; k < n; k++) left.push({ at: 5, size: "small", segs: [{ text: THROW_LINES[k], at: 5 }] });
  const right = [{ at: 5, size: "entry", segs: [{ text: n >= 8 ? "That's all of it. I know it by heart now." : "There's more to it. Father says I'll learn the rest on the way.", at: 5 }] },
                 { at: 5, size: "small", segs: [{ text: "When the giant's head is open, I will need every piece, in the right order, without stopping to think.", at: 5 }] }];
  return { left, right };
}

// "Old letters": the Paleo-Hebrew letters David has found carved in Worlds 4 and 5 (world4.js OLD_LETTERS, saved in
// progress.letters), copied into the Journal for the Stones of the Name in 7-3. A missing one gets an empty space and a
// hint of where it is. (Two He's are carved, in 4-2 and 4-4; either one counts.)
const LETTER_PAGE = [
  { k: "yod",   ch: "\u{10909}", name: "Yod",   pic: "a hand.",                       where: "on the road to Gibeah, somewhere hidden.", thought: "The first letter of a name worth remembering, the old ones say. Whose name?" },
  { k: "he",    ch: "\u{10904}", name: "He",    pic: "a man with his arms raised.",   where: "at the training yard, or in the king's hall.", thought: "Arms up, as if he's shouting for joy. Or praying." },
  { k: "waw",   ch: "\u{10905}", name: "Waw",   pic: "a tent peg. It means \"and\".", where: "in Gibeah's market, on a doorway.", thought: "A peg holds a tent together. So the word waw means \"and\": it joins things." },
  { k: "dalet", ch: "\u{10903}", name: "Dalet", pic: "a door.",                       where: "on the supply road, by the rocks.", thought: "Two Dalets with a Waw between them spell a shepherd boy's name. Mine!" },
];
function lettersFound() { try { return JSON.parse(localStorage.getItem("davidProgress") || "{}").letters || []; } catch (e) { return []; } }
function lettersSpread(found) {
  const left = [{ at: 5, size: "entry", segs: [{ text: "Old letters, carved in the rock here and there. I copied them down:", at: 5 }] }];
  for (const L of LETTER_PAGE) left.push(found.includes(L.k)
    ? { at: 5, size: "small", segs: [{ text: L.ch, at: 5, glyph: true }, { text: `${L.name}: ${L.pic}`, at: 5 }] }
    : { at: 5, size: "small", segs: [{ text: "( ? )  Not found yet. Maybe " + L.where, at: 5 }] });
  const all = LETTER_PAGE.every(L => found.includes(L.k)), dwd = found.includes("dalet") && found.includes("waw");
  const right = [{ at: 5, size: "entry", segs: [{ text: all ? "I have them all now." : "There are more out there. I'll keep looking.", at: 5 }] }];
  if (dwd) right.push({ at: 5, size: "small", segs: [{ text: "Dalet, Waw, Dalet: my own name.", at: 5 }] });
  right.push({ at: 5, size: "small", segs: [{ text: "Someday these letters will matter. I'll keep them close.", at: 5 }] });
  return { left, right };
}
// the note David writes when he finds an old letter (world4.js updateInscriptions): the letter, big, and what it pictured
function letterNote(k, where) {
  const L = LETTER_PAGE.find(q => q.k === k); if (!L) return null;
  const left = [{ at: 5, size: "entry", segs: [{ text: "Carved here, worn almost smooth:", at: 5 }] },
                { at: 5, size: "glyph", segs: [{ text: L.ch, at: 5, glyph: true }] },
                { at: 5, size: "entry", segs: [{ text: `${L.name}: ${L.pic}`, at: 5 }] }];
  const right = [{ at: 5, size: "entry", segs: [{ text: L.thought || where, at: 5 }] }];
  const n = lettersFound().length;
  right.push({ at: 5, size: "small", segs: [{ text: n >= LETTER_PAGE.length ? "That makes all of them. I wonder what they spell." : "There must be more of these. I'll copy down every one I find.", at: 5 }] });
  return { left, right };
}
