// David: The Shepherd's Sling — movement test (World 1-1 rough block-out)
// Open game/index.html in a browser. Keyboard or a USB NES controller.

// ============================================================================
// TUNE — change one number, reload the page.
// ============================================================================
const TUNE = {
  DAVID_HEIGHT: 112,      // how tall David is drawn on screen, in pixels (screen is 1280 x 720)
  WALK_SPEED: 270,        // px per second
  RUN_SPEED: 450,         // top speed after holding a direction for RUN_DELAY
  RUN_DELAY: 0.55,        // seconds of holding a direction before he speeds up to a run
  ACCEL_GROUND: 1900,     // how fast he gets up to speed
  ACCEL_AIR: 1200,
  FRICTION: 2300,         // how fast he slows down when you let go
  GRAVITY: 2700,
  JUMP_SPEED: 1000,       // jump height ~ JUMP_SPEED² / (2 × GRAVITY) ≈ 185 px
  JUMP_CUT: 0.45,         // let go of A early = a shorter jump (lower = shorter)
  FLIP_SPEED: 860,        // the second jump (flip) in the air
  MAX_FALL: 1300,
  COYOTE: 0.09,           // seconds you can still jump after running off a ledge
  JUMP_BUFFER: 0.12,      // seconds a jump press is remembered before landing
  ROLL_SPEED: 520,
  ROLL_TIME: 0.55,        // seconds the roll lasts
  CRAWL_SPEED: 120,
  STONE_SPEED: 820,       // tap throw
  STONE_SPEED_CHARGED: 1250,
  CHARGE_TIME: 0.6,       // seconds holding B for a full charge
  STONE_GRAVITY: 900,     // lower = stones fly higher and farther
  POWER_SPEED: 1500,      // the Power Sling (A + B together, uses a special stone)
  THROW_TIME: 0.45,       // seconds for the whole throw animation
  RUN_THROW_TIME: 0.6,    // the throw while running (legs keep running)
  RUN_THROW_SPEED: 120,   // moving faster than this when the throw starts = running throw
  LAMB_SPEED: 380,
  TER_FILL_SCALE: 0.3,    // terrain art sizes (pixels on screen)
  TER_TOPSOIL_H: 46, TER_GRASS_RISE: 16,
  TER_ROCKTOP_H: 40, TER_ROCKTOP_RISE: 12,
  DECO_DROP: { stone_wall: 7 },   // push a decoration down into the grass (pixels)
  PIT_TRIM: 5,            // the ground's soil stops this many pixels short of a pit, so it never pokes past the cliff face
  BASE_DROP: 6,           // push the limestone base pieces down into the grass (pixels)
  WALL_SINK: 16,          // how far dry-stone walls sink into the grass (pixels)
  WALL_FILTER: "brightness(1.18) saturate(0.7) contrast(0.95)",   // lighter, greyer stones, closer to the limestone
  TER_LEDGE_H: 34, TER_PIT_EDGE_H: 150, TER_BASE_H: 84,
  BG_FAR_SPEED: 0.05,     // background scroll speeds (0 = still, 1 = moves with the ground)
  BG_MID_SPEED: 0.25,
  BG_NEAR_SPEED: 0.55,
  BG_MID_HEIGHT: 300,     // how tall each layer is drawn on screen (pixels)
  BG_NEAR_HEIGHT: 150,
  BG_FAR_DROP: { w1: -150, w2: 40 },   // per world: push the far layer down (positive) or up (negative)
  HORNET_RANGE: 300,      // how close before a hornet dives at David
  HORNET_DIVE: 420,       // dive speed
  HARP_SETTLE_MS: 120,    // playing frames 1-8, once, after he sits down
  HARP_LOOP_MS: 190,      // the calm strumming loop (frames 9-12, back and forth)
  HARP_STANDUP: 0.75,     // seconds to put the harp away and stand up
  HARP_VOLUME: 0.8,       // volume of the harp music when David plays (0 to 1)
  SFX_VOLUME: 0.8,        // sound effects (0 to 1)
  STEPS_VOLUME: 0.5,      // David's running footsteps
  AMBIENCE_VOLUME: 0.35,  // birds in the hills
  BOSS_MUSIC_VOLUME: 0.6, // the lion fight
  FINAL_SLOWMO: 0.18,     // the stone that beats a boss: game speed while it flies in (1 = normal)
  FINAL_LEAD: 0.12,       // game-seconds before that stone lands that slow motion starts
  FINAL_HOLD: 1.3,        // real seconds the world stays slow after the hit
  BOSS_MUSIC_LEAD: 4,     // tiles before the lion's arena that the boss music starts ("uh oh"), before you can see him
  HARP_MUSIC_DELAY: 1.7,  // seconds after pressing Select until his hands start playing; the music starts then
  // size of each of the 14 sit-down frames, measured so his head matches standing David (the clip's camera crept closer)
  SIT_HARP_SIZES: [0.89, 0.87, 0.86, 0.80, 0.75, 0.74, 0.74, 0.72, 0.72, 0.72, 0.71, 0.72, 0.72, 0.72],
  LAMB_CATCHUP: 1.2,      // seconds the lamb can be stuck or left behind before it pops back next to David
  CARRY_JUMP2: 0.95,      // second jump while carrying the lamb (1 = as strong as the flip)
  TILE: 36,
  HEARTS: 4,
  LIVES: 5,
  OLIVES_PER_LIFE: 100,   // olives to fill the oil flask = 1 extra life
  HURT_INVINCIBLE: 1.3,   // seconds of flashing after a hit
  ITEM_SIZE: 0.32,        // food pickups
  SNAKE_RANGE: 120,       // how close before a snake strikes
  COBRA_BITE_EXTRA: 0,    // + makes the snakes' bite reach farther, - shorter (pixels)
  LION_HP: 6,             // tap stone = 1, charged stone = 2 (only while it's dazed)
  LION_PROWL: 130, LION_RUN: 330,
  LION_POUNCE_RANGE: 360, // how close before it roars and pounces
  LION_TELL: 0.9,         // seconds of roar warning before the pounce
  LION_JUMP: 820,
  LION_DAZED: 1.8,        // seconds it stays dazed after landing (your window to hit it)
  LION_TAUNT_RANGE: 420,  // the lion lets the lamb go when David gets this close
  RESCUE_DELAY: 1.0,      // seconds after the lion is beaten before David walks over to the lamb
  RESCUE_PET: 2.0,        // seconds David kneels and pets the rescued lamb
  RESCUE_LIFT: 0.8,       // seconds to lift it into a hug (and the same to set it back down)
  RESCUE_HOLD: 1.8,       // seconds he hugs it, checking it over
  GATE_BONUS_MIN: 2,      // the golden olive slides up and down the gatepost (Super Mario World's goal tape):
  GATE_BONUS_MAX: 25,     //   catch it low = 2 olives, at the top = 25. Miss it = no bonus (the stage still ends)
  GATE_POST_TILES: 10,    // how tall the gatepost is (a plain jump reaches about 70% of it; the top needs the flip)
  GATE_OLIVE_TRIP: 1.3,   // seconds for the golden olive to slide from the bottom to the top (and the same back down)
  GATE_GOLD_AT: 0.9,      // catch it above this fraction of the way up = +1 life as well
  FLOCK_SPEED: 320,       // how fast the sheep trot home through the gate
  SHEEP_PER_STAGE: 5,     // lost sheep hidden in each stage (plus The One); find them all for an extra life
  SHEEP_GAP: 62,          // spacing of the line of sheep following David (px along his path)
  LAMB_GAP: 70,           // how far behind David your lamb walks (first in the line)
  HARP_CALL_RANGE: 650,   // how far away lost sheep can hear the harp and come to David (px)
  SHEEP_CALL_SPEED: 150,  // how fast a called sheep walks over
  // Per-sprite size nudges (1 = normal). Some clips came out a little bigger or smaller than the others.
  SPRITE_SIZE: {
    david_sling_throw: 1.15,
    david_sling_throw_up: 1.15,
    david_crawl: 0.92,
    lion_prowl_carry_lamb: 1.3, lion_sit_carry_lamb: 1.3, lion_set_lamb_down: 1.24,
    lion_run: 1.3, lion_pounce: 1.3, lion_prowl: 1.3, lion_roar: 1.3, lion_sit_roar: 1.3, lion_dazed: 1.3,
    cobra_hood: 1.5, snake_strike: 1.5,
    bee_fly: 0.6, hornet_fly: 1.0,
    david_play_harp: 0.66,       // the harp clip zoomed in as he sat down
    // lambs are about two-thirds the size of a grown sheep
    lamb_run: 0.75, lamb_hop: 0.75, lamb_walk: 0.75, lamb_stand: 0.75, lamb_graze: 0.75,
    lamb_bound: 0.75, lamb_bound2: 0.75, lamb_leap: 0.75, lambblack_stand: 0.75, lambblack_walk: 0.75, lambblack_leap: 0.75,
    ram_walk: 1.08, ram_stand: 1.08, ram_graze: 1.08,
  },
};

// ============================================================================
// Setup
// ============================================================================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

const SCALE = TUNE.DAVID_HEIGHT / 240;   // sprites are stored with David 240 px tall

// Load sprite sheets
const SPR = {};
let loaded = 0, total = 0;
for (const [name, d] of Object.entries(window.SPRITE_DATA)) {
  total++;
  const img = new Image();
  img.onload = () => { loaded++; };
  img.onerror = () => { loaded++; console.warn("missing sprite", d.src); };
  img.src = d.src + "?v=" + (window.BUILD || 0);
  SPR[name] = { ...d, img };
}

// ============================================================================
// Input: keyboard + gamepad (with a button-setup screen for NES controllers)
// ============================================================================
const keys = {};
addEventListener("keydown", e => {
  keys[e.code] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
});
addEventListener("keyup", e => { keys[e.code] = false; });

const BUTTONS = ["up", "down", "left", "right", "a", "b", "select", "start"];
const KEYMAP = {
  up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"], left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"],
  a: ["KeyZ", "Space", "KeyK"], b: ["KeyX", "KeyJ"], select: ["ShiftLeft", "ShiftRight", "KeyC"], start: ["Enter"],
};
let padMap = null;
try { padMap = JSON.parse(localStorage.getItem("david-padmap")); } catch (e) {}

function readPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) if (p && p.connected) return p;
  return null;
}
function padControl(p, m) {
  if (!m) return false;
  if (m.type === "button") return !!(p.buttons[m.index] && p.buttons[m.index].pressed);
  if (m.type === "axis") { const v = p.axes[m.index] || 0; return m.sign > 0 ? v > 0.5 : v < -0.5; }
  if (m.type === "hat") { const v = p.axes[m.index]; return v !== undefined && Math.abs(v - m.value) < 0.15; }
  return false;
}
function defaultPadState(p) {
  // Works for "standard" pads (Xbox-style numbering) and pads whose D-pad is axes 0/1.
  const ax = p.axes;
  return {
    up: (p.buttons[12] && p.buttons[12].pressed) || ax[1] < -0.5,
    down: (p.buttons[13] && p.buttons[13].pressed) || ax[1] > 0.5,
    left: (p.buttons[14] && p.buttons[14].pressed) || ax[0] < -0.5,
    right: (p.buttons[15] && p.buttons[15].pressed) || ax[0] > 0.5,
    a: !!(p.buttons[0] && p.buttons[0].pressed),
    b: !!(p.buttons[2] && p.buttons[2].pressed) || !!(p.buttons[1] && p.buttons[1].pressed && !p.buttons[0]),
    select: !!(p.buttons[8] && p.buttons[8].pressed),
    start: !!(p.buttons[9] && p.buttons[9].pressed),
  };
}

const input = { now: {}, prev: {} };
function pollInput() {
  input.prev = input.now;
  const s = {};
  for (const b of BUTTONS) s[b] = KEYMAP[b].some(k => keys[k]);
  const p = readPad();
  if (p && !setup.active) {
    const ps = padMap ? Object.fromEntries(BUTTONS.map(b => [b, padControl(p, padMap[b])])) : defaultPadState(p);
    for (const b of BUTTONS) s[b] = s[b] || ps[b];
  }
  input.now = s;
}
const held = b => !!input.now[b];
const pressed = b => !!input.now[b] && !input.prev[b];
const released = b => !input.now[b] && !!input.prev[b];

// Controller setup: press each button when asked. Captures buttons, axes or a POV hat.
const setup = { active: false, step: 0, rest: null, wait: 0, map: {} };
function startSetup() {
  const p = readPad();
  if (!p) { toast("No controller seen yet: press any button on the controller, then press M."); return; }
  setup.active = true; setup.step = 0; setup.map = {}; setup.wait = 0.4;
  setup.rest = { axes: [...p.axes], buttons: p.buttons.map(b => b.pressed) };
}
function updateSetup(dt) {
  const p = readPad();
  if (!p) { setup.active = false; return; }
  if (setup.wait > 0) {
    setup.wait -= dt;
    setup.rest = { axes: [...p.axes], buttons: p.buttons.map(b => b.pressed) };
    return;
  }
  let got = null;
  p.buttons.forEach((b, i) => { if (!got && b.pressed && !setup.rest.buttons[i]) got = { type: "button", index: i }; });
  if (!got) p.axes.forEach((v, i) => {
    if (got) return;
    const r = setup.rest.axes[i] || 0;
    if (Math.abs(v - r) > 0.5) {
      // a POV hat reports fixed in-between values; a stick/D-pad axis goes to ±1
      if (Math.abs(Math.abs(v) - 1) > 0.2 || Math.abs(r) > 0.9) got = { type: "hat", index: i, value: v };
      else got = { type: "axis", index: i, sign: Math.sign(v) };
    }
  });
  if (got) {
    setup.map[BUTTONS[setup.step]] = got;
    setup.step++;
    setup.wait = 0.35;
    if (setup.step >= BUTTONS.length) {
      padMap = setup.map; setup.active = false;
      try { localStorage.setItem("david-padmap", JSON.stringify(padMap)); } catch (e) {}
      toast("Controller saved.");
    }
  }
}
// Start the setup by itself the first time a controller shows up with no saved buttons.
addEventListener("gamepadconnected", () => { if (!padMap && !setup.active) setTimeout(startSetup, 300); });
// Holding Select + Start on the controller (default layout) for 2 seconds also starts it.
let comboT = 0;
function checkCombo(dt) {
  const p = readPad(); if (!p || setup.active) { comboT = 0; return; }
  const pressedCount = p.buttons.filter(b => b.pressed).length;
  const sel = padMap ? padControl(p, padMap.select) : !!(p.buttons[8] && p.buttons[8].pressed);
  const st = padMap ? padControl(p, padMap.start) : !!(p.buttons[9] && p.buttons[9].pressed);
  comboT = (sel && st) ? comboT + dt : 0;
  if (comboT > 2) { comboT = 0; startSetup(); }
}

let toastText = "", toastTime = 0;
function toast(t) { toastText = t; toastTime = 4; }

// ============================================================================
// Levels. "1-1" is the World 1 sample; "#test" in the address opens the old movement test.
// Built from simple commands (columns/rows are tiles). Screen is 20 tiles tall; ground surface is row 17.
// ============================================================================
const LEVEL_NAME = location.hash === "#test" ? "test" : "1-1";
const T = TUNE.TILE;
const ROWS = 20, COLS = LEVEL_NAME === "test" ? 150 : 262, GR = 17;
const solid = [...Array(ROWS)].map(() => Array(COLS).fill(0));     // 0 empty, 1 earth, 2 stone
const oneway = [...Array(ROWS)].map(() => Array(COLS).fill(false));
const gourds = [], labels = [], decor = [], pickups = [], snakes = [], fires = [];
let lionSpawn = null, arenaX = Infinity, fold = null;
const ground = (c0, c1) => { for (let c = c0; c <= c1; c++) for (let r = GR; r < ROWS; r++) solid[r][c] = 1; };
const block = (c, r, w, h, mat = 2) => { for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) solid[y][x] = mat; };
const rock = (c, r, w, h) => block(c, r, w, h, 2);
const wall = (c, r, w, h) => block(c, r, w, h, 3);   // dry-stone wall
const boulder = (c, r, w, h) => block(c, r, w, h, 4); // half-buried boulder
const plat = (c, r, w) => { for (let x = c; x < c + w; x++) oneway[r][x] = true; };
const gourd = (c, r, hanging = false) => gourds.push({ x: c * T + T / 2, y: (r + 1) * T, alive: true, hanging });
const label = (c, r, text) => labels.push({ x: c * T, y: r * T, text });
// decoration: an item image standing on row r (its bottom on the top of row r+1); layer "back" or "front"
const deco = (name, c, r, size = 1, layer = "back", surprise = null) => decor.push({ name, x: c * T + T / 2, y: (r + 1) * T, size, layer, surprise, shaken: false, shakeT: 0 });
const bees = [], hornets = [];
const bee = (c, k) => bees.push({ hx: c * T + T / 2, k, t: k * 1.6, x: 0, y: 0, facing: 1, gone: false, alpha: 1, vx: 0, vy: 0 });
const hornet = (c, r) => hornets.push({ hx: c * T + T / 2, hy: (r + 1) * T, x: c * T + T / 2, y: (r + 1) * T, state: "hover", t: Math.random() * 3, facing: -1, gone: false, alpha: 1, vx: 0, vy: 0 });
let beesAngry = false;   // sling a honeybee and the honey is gone (Shepherd's Judgment)
const olives = [];   // the "coins"
const olive = (x, y, kind) => olives.push({ x, y, kind: kind || (Math.random() < 0.5 ? "green" : "purple"), taken: false, t: Math.random() * 6, vy: 0, falling: false, placed: true });
const oliveRow = (c0, r, n, step = 1) => { for (let k = 0; k < n; k++) olive(c0 * T + T / 2 + k * step * T, (r + 1) * T - 14); };
const oliveArc = (c0, r, n) => { for (let k = 0; k < n; k++) { const f = k / (n - 1); olive(c0 * T + T / 2 + k * T, (r + 1) * T - 14 - Math.sin(f * Math.PI) * 110); } };
const food = (name, c, r) => pickups.push({ name, x: c * T + T / 2, y: (r + 1) * T, t: Math.random() * 6, taken: false });
const snake = (kind, c) => snakes.push({ kind, x: c * T + T / 2, y: GR * T, home: c * T + T / 2, state: "idle", t: 0, facing: -1, gone: false, alpha: 1 });
const campfire = (c, r = GR - 1) => fires.push({ x: c * T + T / 2, y: (r + 1) * T, lit: false });
const specials = [];   // hidden special stones (like Mario's dragon coins); saved for the Power Sling
const special = (c, r) => specials.push({ x: c * T + T / 2, y: (r + 1) * T, taken: false, t: Math.random() * 6 });
// lost sheep. how: "graze" (just reach it), "ledge" (up somewhere), "cast" (on its back: press Down next to it),
// "thorns" (wool caught in a thorn bush: sling the bush), "one" (The One: the hardest to reach)
const lost = [];
const lostSheep = (kind, c, r, how = "graze") => lost.push({ kind, how, one: how === "one", hx: c * T + T / 2, hy: (r + 1) * T });

if (LEVEL_NAME === "test") {
  ground(0, 24);   label(2, 7, "Start: walk, then hold a direction to run");
  block(12, 15, 2, 2, 3); block(16, 14, 2, 3);
  ground(28, 85);  label(26, 9, "small gap: jump");
  plat(32, 13, 4); plat(38, 10, 4); gourd(39, 9);
  block(46, 14, 3, 3); gourd(47, 13);               label(43, 10, "B: sling the gourds (hold B to charge, Up to aim up)");
  block(64, 12, 20, 3);                             label(64, 11, "low tunnel: Down + A while running = roll, or hold Down to crawl");
  ground(89, 145); label(87, 9, "gap");
  block(100, 10, 3, 7); gourd(101, 9);              label(95, 8, "tall wall: jump, then A again in the air = flip");
  plat(108, 13, 4); plat(114, 10, 4); gourd(115, 9);
  block(124, 15, 2, 2, 3); block(127, 13, 2, 4); block(130, 11, 2, 6); gourd(131, 10);
  block(140, 9, 6, 8);                              label(133, 6, "end of the test. R = back to the start");
} else {
  // ---- 1-1 sample: The Hills of Bethlehem ----
  ground(0, 60);
  deco("olive_tree", 4, 16, 1.0); deco("date_palm", 15, 16, 1.1);
  label(2, 6, "World 1-1 sample. Eat food to heal, but look before you eat.");
  food("grapes", 10, 16); food("bread", 21, 16);
  lostSheep("sheepblack", 19, 16);                      // the first lost sheep: just walk up to it
  special(16, 9);                                       // above the date palm: jump + flip
  special(87, 6);                                       // high above the fig platform: flip from the platform
  // the third special stone is hidden in the fig tree (col 114): jump into its branches
  oliveRow(6, 16, 6); oliveArc(22, 16, 5); oliveRow(26, 14, 3); oliveRow(30, 12, 3);
  oliveArc(35, 16, 6); oliveRow(50, 16, 4); oliveArc(64, 16, 4);
  oliveRow(80, 12, 4); oliveRow(86, 9, 3); oliveRow(95, 16, 4); oliveArc(103, 16, 5);
  oliveRow(126, 16, 6); oliveArc(133, 16, 5); oliveRow(144, 16, 3); oliveArc(158, 16, 6);
  wall(26, 15, 3, 2); rock(30, 13, 3, 4);
  gourd(28, 8, true); gourd(33, 7, true);             label(25, 6, "Sling down the hanging wild gourds");
  snake("cobra", 40);                                  label(37, 10, "Cobra! Sling it before it strikes");
  lostSheep("sheep", 43, 16, "thorns");                 // caught in the thorn bush: sling it free
  food("poison_berries", 45, 16); wall(47, 15, 3, 2); food("cheese", 48, 14);
  label(44, 11, "Berries or cheese? Look before you eat.");
  deco("olive_tree", 55, 16, 1.15, "back", "golden_olive");   // jump into it: a shower of olives, and a golden one
  ground(64, 122);
  campfire(68); deco("tent", 73, 16, 1.1);            label(64, 10, "Campfire: checkpoint. Sit and play the harp (Select) to rest.");
  lostSheep("sheep", 78, 16, "cast");              // on its back: press Down next to it
  plat(80, 13, 4); plat(86, 10, 4); food("figs", 87, 9);
  lostSheep("lambblack", 89, 9, "ledge");               // up on the ledge: climb to it, or play the harp below
  snake("viper", 93);
  deco("beehive_tree", 99, 16, 1.2); food("honey", 101, 16);
  for (let k = 0; k < 4; k++) bee(99, k);              // honeybees: harmless. Leave them be and the honey is yours.
  hornet(108, 11); hornet(131, 10);                     // hornets: they dive at you. Sling them.
  food("wild_gourds", 106, 16); food("dates", 109, 16);  label(104, 11, "Wild gourds are poison (2 Kings 4:39)");
  deco("fig_tree", 114, 16, 1.0, "back", "special");         // figs, and a hidden special stone
  boulder(115, 14, 6, 3);
  ground(126, 261);
  deco("vineyard", 129, 16, 1.2); deco("crops", 135, 16, 1.1);
  rock(140, 10, 3, 7); food("fig_cake", 141, 9);      label(136, 8, "Flip up for the fig cake");
  lostSheep("lamb", 142, 9, "one");                     // The One, up on the high rock
  snake("cobra", 147);
  campfire(155);                                      label(152, 10, "Last campfire before the lion");
  deco("stone_wall", 160, 16, 1.0, "back");
  lostSheep("ram", 164, 16);                            // the ram, off by the wall: play the harp and he'll come
  deco("cave", 214, 16, 1.7);                         // the lion's den
  rock(226, 15, 3, 2);                                // the back of the den: hop over it on the way home
  lionSpawn = { x: 205 * T, y: GR * T }; arenaX = 168 * T;
  label(170, 6, "The lion's territory");
  // the end of the stage: the family sheepfold (our flagpole). Jump and touch the gatepost.
  for (let c = 244; c <= 254; c += 3.4) deco("stone_wall", c, 16, 1.15, "back");
  fold = { postC: 240, endC: 255 };
  label(214, 6, "Catch the golden olive on the gatepost! The higher it is, the more olives. At the top = +1 life");
  rock(256, 4, 6, 13);
}

// "?at=160" in the address starts David at column 160 (handy for checking a spot in a level)
const AT = Number(new URLSearchParams(location.search).get("at")) || 3;
const spawn = { x: AT * T, y: GR * T }, lambSpawn = { x: (AT + 2) * T, y: GR * T };
let checkpoint = { ...spawn };
const isSolid = (c, r) => r >= 0 && r < ROWS && c >= 0 && c < COLS && solid[r][c] > 0;
const isOneway = (c, r) => r >= 0 && r < ROWS && c >= 0 && c < COLS && oneway[r][c];
const LEVEL_W = COLS * T;

// ============================================================================
// Animation helper
// ============================================================================
function frameOf(name, t, msOverride) {
  const s = SPR[name]; const ms = msOverride || s.ms; const n = s.frames;
  const i = Math.floor(t * 1000 / ms);
  if (s.pingpong) { const len = 2 * n - 2; const k = i % len; return k < n ? k : len - k; }
  if (s.loop) return i % n;
  return Math.min(i, n - 1);
}
function animDone(name, t, msOverride) {
  const s = SPR[name]; return t * 1000 >= (msOverride || s.ms) * s.frames;
}
// draw frame i of a sheet so its anchor sits at (x, y) on screen
function drawSprite(name, i, x, y, facing, extraScale = 1, alpha = 1, filter = "") {
  const s = SPR[name]; if (!s || !s.img.complete || !s.img.naturalWidth) return;
  const sc = SCALE * extraScale * (TUNE.SPRITE_SIZE[name] || 1);
  ctx.save();
  ctx.globalAlpha = alpha;
  if (filter) ctx.filter = filter;
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(facing * sc, sc);
  ctx.drawImage(s.img, i * s.w, 0, s.w, s.h, -s.ax, -s.ay, s.w, s.h);
  ctx.restore();
}

// ============================================================================
// David
// ============================================================================
const STAND_H = 96, LOW_H = 64, BODY_W = 34;
const david = {
  x: spawn.x, y: spawn.y, vx: 0, vy: 0, facing: 1, onGround: false, h: STAND_H,
  coyote: 0, jumpBuf: 0, flipUsed: false, holdDirT: 0,
  state: "idle", t: 0, // animation state + time in it
  rollT: 0, throwT: -1, charge: 0, charging: false, thrown: false,
  carrying: false, harp: false,
};
const stones = [];
const lamb = { x: lambSpawn.x, y: lambSpawn.y, vx: 0, vy: 0, facing: 1, onGround: false, t: 0, carried: false };

function setState(s) { if (david.state !== s) { david.state = s; david.t = 0; } }

function collideBody(b, w, h, dt) {
  // horizontal
  b.x += b.vx * dt;
  let top = b.y - h, bottom = b.y - 1;
  if (b.vx > 0) {
    const c = Math.floor((b.x + w / 2) / T);
    for (let r = Math.floor(top / T); r <= Math.floor(bottom / T); r++)
      if (isSolid(c, r)) { b.x = c * T - w / 2 - 0.01; b.vx = 0; break; }
  } else if (b.vx < 0) {
    const c = Math.floor((b.x - w / 2) / T);
    for (let r = Math.floor(top / T); r <= Math.floor(bottom / T); r++)
      if (isSolid(c, r)) { b.x = (c + 1) * T + w / 2 + 0.01; b.vx = 0; break; }
  }
  b.x = Math.max(w / 2, Math.min(LEVEL_W - w / 2, b.x));
  // vertical
  const prevY = b.y;
  b.y += b.vy * dt;
  b.onGround = false;
  const c0 = Math.floor((b.x - w / 2 + 2) / T), c1 = Math.floor((b.x + w / 2 - 2) / T);
  if (b.vy >= 0) {
    const r = Math.floor(b.y / T);
    for (let c = c0; c <= c1; c++) {
      const platTop = r * T;
      if (isSolid(c, r) || (isOneway(c, r) && prevY <= platTop + 1 && !b.dropThrough)) {
        b.y = platTop; b.vy = 0; b.onGround = true; break;
      }
    }
  } else {
    const r = Math.floor((b.y - h) / T);
    for (let c = c0; c <= c1; c++) if (isSolid(c, r)) { b.y = (r + 1) * T + h; b.vy = 0; break; }
  }
  if (b.y > ROWS * T + 400) { b.x = spawn.x; b.y = spawn.y; b.vx = b.vy = 0; } // fell in a pit: back to start
}
function headroom(b, h) { // can he stand up here?
  const c0 = Math.floor((b.x - BODY_W / 2 + 2) / T), c1 = Math.floor((b.x + BODY_W / 2 - 2) / T);
  for (let c = c0; c <= c1; c++) for (let r = Math.floor((b.y - h) / T); r <= Math.floor((b.y - 1) / T); r++) if (isSolid(c, r)) return false;
  return true;
}

// the rescue: the game walks David to the lamb; he kneels, pets it, lifts it into a hug to check it over,
// and sets it back down. Then it follows him home.
const LAMB_IN_PET = 47;   // how far in front of David the lamb is in the pet/lift sheets (sheet pixels)
const HUG_TOP = 5;        // lift-sheet frame where it's in his arms (after that he stands up, which we don't want)
function rescueTimes() {
  return { pet: TUNE.RESCUE_PET, lift: TUNE.RESCUE_LIFT, hold: TUNE.RESCUE_HOLD, down: TUNE.RESCUE_LIFT };
}
// walk (hopping over anything in the way) toward x; returns true when he's there
function autoWalk(d, tx, dt) {
  const dx = tx - d.x;
  d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt);
  if (Math.abs(dx) < 5 && d.onGround) { d.vx = 0; collideBody(d, BODY_W, d.h, dt); return true; }
  d.facing = Math.sign(dx) || d.facing;
  d.vx = d.facing * Math.min(TUNE.WALK_SPEED, Math.abs(dx) * 8 + 40);
  const x0 = d.x;
  collideBody(d, BODY_W, d.h, dt);
  if (d.onGround && Math.abs(d.x - x0) < 0.5 * Math.abs(d.vx) * dt) d.vy = -TUNE.JUMP_SPEED;   // blocked: hop up
  return false;
}
function updateDavid(dt) {
  const d = david;
  d.t += dt;
  if (d.state === "toLamb") {     // the game has the controls: walk over to the lamb
    const k = takenLamb, tx = k.x - d.rescueSide * LAMB_IN_PET * SCALE;
    if (autoWalk(d, tx, dt) || d.t > 8) {
      d.x = tx; d.facing = d.rescueSide; d.vx = 0; k.hidden = true; setState("rescue");
    }
    return;
  }
  if (d.state === "finish") { updateFinishDavid(d, dt); return; }
  if (d.state === "liftSheep") { updateLiftSheep(d, dt); return; }
  if (d.state === "rescue") {
    d.vx = 0; d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt); collideBody(d, BODY_W, d.h, dt);
    const rt = rescueTimes();
    if (d.t > rt.pet + rt.lift + rt.hold + rt.down) {
      takenLamb.active = false; rescuedLamb = true;
      joinLine(newSheep({ kind: "rescued", how: "rescued", hx: d.x + d.facing * LAMB_IN_PET * SCALE, hy: d.y }), true);
      setState("idle");
      toast("\"I went after it, struck it and rescued the sheep from its mouth.\" (1 Samuel 17:35)");
    }
    return;
  }
  if (d.carryHop > 0) d.carryHop -= dt;
  const dir = (held("right") ? 1 : 0) - (held("left") ? 1 : 0);
  const busy = d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "standup";

  // --- harp (Select): kneel and play while standing still
  if (pressed("select") && d.onGround && !d.carrying && !busy && Math.abs(d.vx) < 30) {
    if (d.harp) { d.harp = false; setState("standup"); } else { d.harp = true; setState("kneel"); }
  }
  // Up, any direction, A or B: put the harp away and stand up
  if (d.harp && (dir !== 0 || pressed("up") || pressed("a") || pressed("b"))) { d.harp = false; setState("standup"); }

  // --- pick up / put down the lamb (Down, standing still, next to it)
  if (pressed("down") && d.onGround && !busy && !d.harp && Math.abs(d.vx) < 40) {
    if (d.carrying) { setState("putdown"); }
    else if (Math.abs(lamb.x - d.x) < 95 && Math.abs(lamb.y - d.y) < 70) { setState("pickup"); d.vx = 0; lamb.carried = true; d.facing = Math.sign(lamb.x - d.x) || d.facing; }
  }

  // --- roll: Down + A while moving on the ground
  if (!d.carrying && !d.harp && d.onGround && !busy && held("down") && pressed("a") && (Math.abs(d.vx) > 60 || held("left") || held("right"))) {
    setState("roll"); d.rollT = 0; d.vx = d.facing * TUNE.ROLL_SPEED; d.jumpBuf = 0;
  }

  // --- jumping
  if (pressed("a") && !(held("down") && d.onGround)) d.jumpBuf = TUNE.JUMP_BUFFER;
  else d.jumpBuf = Math.max(0, d.jumpBuf - dt);
  d.coyote = d.onGround ? TUNE.COYOTE : Math.max(0, d.coyote - dt);

  if (!busy && !d.harp) {
    if (d.jumpBuf > 0 && d.coyote > 0 && headroom(d, STAND_H)) {
      d.vy = -TUNE.JUMP_SPEED; d.onGround = false; d.coyote = 0; d.jumpBuf = 0; d.flipUsed = false;
      setState(d.carrying ? "carry" : "jump"); sfx("jump", undefined, 0.5);
    } else if (pressed("a") && !d.onGround && !d.flipUsed && d.coyote <= 0) {
      d.flipUsed = true; sfx("jump", undefined, 0.5, 1.3);   // the second jump: same sound, higher
      if (d.carrying) { d.vy = -TUNE.FLIP_SPEED * TUNE.CARRY_JUMP2; d.carryHop = 0.25; }   // a second hop, lamb and all
      else { d.vy = -TUNE.FLIP_SPEED; setState("flip"); }
    }
    if (released("a") && d.vy < 0 && d.state !== "flip") d.vy *= TUNE.JUMP_CUT;
  }

  // --- sling (B): tap to throw, hold to charge
  // A + B together (either order, within a moment of each other) = Power Sling
  const justStarted = d.throwT < 0 || (d.charging && d.charge < 0.15);
  if (!d.carrying && !d.harp && !busy && d.specialStones > 0 && justStarted &&
      ((pressed("b") && held("a")) || (pressed("a") && held("b")))) {
    d.specialStones--;
    d.runThrow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED;
    d.throwT = d.runThrow ? TUNE.RUN_THROW_TIME * 9 / 12 : TUNE.THROW_TIME * 6 / 12; d.thrown = true; d.charging = false;   // jump straight to the release frames
    const aimUp = held("up"), aimDown = held("down") && !d.onGround;   // Down only aims while in the air (on the ground it's crouch)
    const ang = aimUp ? (held("left") || held("right") ? -Math.PI / 4 : -Math.PI / 2 + 0.04) : aimDown ? Math.PI / 4 : 0;
    stones.push({ x: d.x + d.facing * 30, y: d.y - (d.onGround ? 70 : 50), vx: Math.cos(ang) * TUNE.POWER_SPEED * d.facing, vy: Math.sin(ang) * TUNE.POWER_SPEED,
                  charged: true, power: true, life: 1.6, trail: [] });
    sfx("sling_power");
    toast(`Power Sling! (${d.specialStones} stone${d.specialStones === 1 ? "" : "s"} of remembrance left)`);
  }
  if (!d.carrying && !d.harp && !busy) {
    if (pressed("b") && d.throwT < 0) { d.charging = true; d.charge = 0; d.throwT = 0; d.thrown = false; }
    if (d.throwT >= 0 && !d.thrown) d.aimingUp = held("up");   // aim decided up to the moment the stone leaves
    if (d.charging) { d.charge += dt; if (released("b") || !held("b")) { d.charging = false; d.runThrow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED; } }
  }
  if (d.throwT >= 0) {
    if (!d.charging) d.throwT += dt;
    const dur = d.runThrow ? TUNE.RUN_THROW_TIME : TUNE.THROW_TIME;
    const relAt = d.runThrow ? dur * 9.5 / 12 : d.aimingUp ? dur * 9.5 / 12 : dur * 7 / 12;   // running and upward throws: the stone leaves at frame 10
    if (!d.thrown && d.throwT >= relAt) {
      d.thrown = true;
      const full = Math.min(1, d.charge / TUNE.CHARGE_TIME);
      const sp = full >= 1 ? TUNE.STONE_SPEED_CHARGED : TUNE.STONE_SPEED;
      const aimUp = held("up"), straightUp = aimUp && !(held("left") || held("right"));
      const aimDown = held("down") && !d.onGround;   // Down + B in the air: throw diagonally down
      const ang = aimUp ? (straightUp ? -Math.PI / 2 + 0.04 : -Math.PI / 4) : aimDown ? Math.PI / 4 : -0.12;
      stones.push({ x: d.x + d.facing * (straightUp ? 6 : 30), y: d.y - (straightUp ? 100 : 78), vx: Math.cos(ang) * sp * d.facing + d.vx * (straightUp ? 0 : 0.3),
                    vy: Math.sin(ang) * sp, charged: full >= 1, life: 2.5 });
      sfx("sling_throw", undefined, full >= 1 ? 0.95 : 0.8, 0.95 + Math.random() * 0.1);   // always the whip of the throw
    }
    if (d.throwT >= dur) { d.throwT = -1; d.runThrow = false; }
  }

  // --- horizontal movement
  let lowPose = false;
  if (d.state === "roll") {
    d.rollT += dt;
    d.vx = d.facing * TUNE.ROLL_SPEED * (1 - 0.5 * d.rollT / TUNE.ROLL_TIME);
    if (d.rollT >= TUNE.ROLL_TIME) setState(headroom(d, STAND_H) ? "getup" : "crawl");
    lowPose = true;
  } else if (d.state === "getup") {
    d.vx *= 0.9;
    if (d.t > 0.28 || (dir !== 0 && d.t > 0.12)) setState("idle");
  } else if (d.state === "pickup" || d.state === "putdown") {
    d.vx = 0;
    if (d.t > (d.state === "pickup" ? 0.6 : 0.4)) {
      if (d.state === "pickup") { d.carrying = true; lamb.carried = true; }
      else { d.carrying = false; lamb.carried = false; lamb.x = d.x + d.facing * 40; lamb.y = d.y; lamb.vy = 0; }
      setState("idle");
    }
  } else if (d.state === "standup") {
    d.vx = 0;
    if (d.t > TUNE.HARP_STANDUP) setState("idle");
  } else if (d.harp) {
    d.vx = 0;
  } else {
    const crouching = d.onGround && held("down") && !d.carrying;
    const stuckLow = d.onGround && !headroom(d, STAND_H);
    lowPose = crouching || stuckLow;
    if (dir !== 0) { d.facing = dir; d.holdDirT += dt; } else d.holdDirT = 0;
    let target = dir * (d.holdDirT > TUNE.RUN_DELAY ? TUNE.RUN_SPEED : TUNE.WALK_SPEED);
    if (lowPose) target = dir * TUNE.CRAWL_SPEED;
    if (d.carrying) target *= 0.8;
    const acc = d.onGround ? (dir !== 0 ? TUNE.ACCEL_GROUND : TUNE.FRICTION) : TUNE.ACCEL_AIR;
    if (d.vx < target) d.vx = Math.min(target, d.vx + acc * dt);
    else if (d.vx > target) d.vx = Math.max(target, d.vx - acc * dt);
  }
  d.h = lowPose ? LOW_H : STAND_H;

  // drop through a one-way platform: Down + A while standing on one
  d.dropThrough = false;
  if (d.onGround && held("down") && pressed("a")) {
    const r = Math.floor(d.y / T), c = Math.floor(d.x / T);
    if (isOneway(c, r) && Math.abs(d.vx) <= 60) { d.dropThrough = true; d.y += 2; }
  }

  // --- gravity + collisions
  d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt);
  const wasAir = !d.onGround, fallSpeed = d.vy;
  collideBody(d, BODY_W, d.h, dt);

  // --- choose the animation
  if (d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "kneel" || d.state === "harp" || d.state === "standup") {
    if (d.state === "kneel" && animDone("david_sit_harp", d.t, 95)) setState("harp");
    return;
  }
  if (!d.onGround) {
    if (d.carrying) setState("carry");
    else if (d.state !== "flip" || animDone("david_flip", d.t, 60)) setState("jump");
    return;
  }
  if (wasAir && d.onGround) { d.flipUsed = false; if (fallSpeed > 600 && !d.carrying) { setState("land"); return; } }
  if (d.state === "land" && d.t < 0.2 && dir === 0) return;
  if (d.carrying) { setState("carry"); return; }
  if (d.h === LOW_H) { setState(Math.abs(d.vx) > 20 ? "crawl" : "crouch"); return; }
  const sp = Math.abs(d.vx);
  if (d.state === "stop" && d.t < 0.36 && dir === 0) return;
  if (dir === 0 && sp > 200 && d.state === "run") { setState("stop"); return; }
  if (dir !== 0 && Math.sign(dir) !== Math.sign(d.vx) && sp > 250) { setState("stop"); return; }
  if (sp < 15) setState("idle");
  else if (sp > (TUNE.WALK_SPEED + TUNE.RUN_SPEED) / 2) setState("run");
  else setState("walk");
}

// where the sling stone is in each frame of david_run_sling (pixels from his feet: forward, up), so the charge glow follows it
const RUN_SLING_STONE = [[21, 232], [34, 279], [-28, 278], [-97, 285], [-135, 230], [-129, 171],
                         [-77, 187], [25, 234], [-31, 278], [-103, 286], [-138, 232], [-127, 185]];
// the harp clip's camera crept closer as he sat down, so shrink those frames back to his normal size
function sitHarpScale(i) { const a = TUNE.SIT_HARP_SIZES; return a[Math.min(i, a.length - 1)] ?? 1; }
function drawDavid(camX) {
  const d = david, x = d.x - camX, y = d.y;
  // the sling throw is drawn on top of whatever the legs are doing when standing; in the air we use the throw frames too
  if (d.throwT >= 0 && d.state !== "roll" && d.state !== "flip") {
    let i, gx, gy;
    const runningNow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED;
    if (d.charging && runningNow && SPR.david_run_sling) {
      // charging on the run: legs keep running, sling whirling overhead
      i = frameOf("david_run_sling", d.t * Math.max(0.7, Math.abs(d.vx) / TUNE.RUN_SPEED));
      drawSprite("david_run_sling", i, x, y, d.facing);
      const sc = SCALE * (TUNE.SPRITE_SIZE.david_run_sling || 1), sp = SPR.david_run_sling;
      const st = RUN_SLING_STONE[i] || RUN_SLING_STONE[0];                 // where the stone is in this frame
      gx = x + d.facing * st[0] * sc; gy = y - st[1] * sc;
    } else if (!d.charging && d.runThrow && SPR.david_run_sling_throw) {
      i = Math.min(11, Math.floor(d.throwT / TUNE.RUN_THROW_TIME * 12));
      drawSprite("david_run_sling_throw", i, x, y, d.facing);
    } else {
      if (d.charging) i = Math.floor(d.charge * 1000 / 70) % 6;
      else i = Math.min(11, Math.floor(d.throwT / TUNE.THROW_TIME * 12));
      const sheet = d.aimingUp && SPR.david_sling_throw_up ? "david_sling_throw_up" : "david_sling_throw";
      drawSprite(sheet, i, x, y, d.facing);
      gx = x - d.facing * 8; gy = y - 104 * (TUNE.SPRITE_SIZE.david_sling_throw || 1);   // the stone whirls just above and behind his head
    }
    if (d.charging && d.charge >= TUNE.CHARGE_TIME) { // golden glow when fully charged
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const g = ctx.createRadialGradient(gx, gy, 2, gx, gy, 30);
      g.addColorStop(0, "rgba(255,215,100,0.85)"); g.addColorStop(1, "rgba(255,180,40,0)");
      ctx.fillStyle = g; ctx.fillRect(gx - 34, gy - 34, 68, 68); ctx.restore();
    }
    return;
  }
  const t = d.t;
  if (d.state === "rescue") {
    const rt = rescueTimes(); let name = "david_lift_lamb", i;
    const n = HUG_TOP + 1, t2 = t - rt.pet, t3 = t2 - rt.lift, t4 = t3 - rt.hold;
    if (t < rt.pet) { name = "david_pet_lamb"; i = frameOf(name, t); }
    else if (t2 < rt.lift) i = Math.min(HUG_TOP, Math.floor(t2 / rt.lift * n));               // lift it into his arms
    else if (t3 < rt.hold) i = HUG_TOP - 1 + [0, 1, 2, 1][Math.floor(t3 / 0.3) % 4];          // hug: rock it gently, looking it over
    else i = Math.max(0, HUG_TOP - Math.floor(t4 / rt.down * n));                              // and set it back down
    drawSprite(name, i, x, y, d.facing); return;
  }
  if (d.state === "liftSheep" && d.liftPhase) {     // crouch frames 2..7 down, hold, and back up
    const n0 = 2, n1 = 7, span = n1 - n0;
    const i = t < LIFT_DOWN ? n0 + Math.min(span, Math.floor(t / LIFT_DOWN * (span + 1)))
            : t < LIFT_DOWN + LIFT_HOLD ? n1
            : Math.max(n0, n1 - Math.floor((t - LIFT_DOWN - LIFT_HOLD) / LIFT_UP * (span + 1)));
    drawSprite("david_crouch", i, x, y, d.facing); return;
  }
  if (d.state === "toLamb" || d.state === "finish" || d.state === "liftSheep") {
    if (!d.onGround) drawSprite("david_jump_air", 5, x, y - d.h / 2 - 6, d.facing);
    else if (Math.abs(d.vx) > 15) drawSprite("david_walk", frameOf("david_walk", t * Math.max(0.6, Math.abs(d.vx) / TUNE.WALK_SPEED)), x, y, d.facing);
    else drawSprite("david_idle", frameOf("david_idle", t), x, y, d.facing);
    return;
  }
  switch (d.state) {
    case "idle": drawSprite("david_idle", frameOf("david_idle", t), x, y, d.facing); break;
    case "walk": {
      const rate = Math.max(0.6, Math.abs(d.vx) / TUNE.WALK_SPEED);
      drawSprite("david_walk", frameOf("david_walk", t * rate), x, y, d.facing); break;
    }
    case "run": drawSprite("david_run", frameOf("david_run", t, 50), x, y, d.facing); break;
    case "stop": drawSprite("david_stop", frameOf("david_stop", t, 60), x, y, d.facing); break;
    case "jump": {
      // pick the in-air frame from vertical speed: rising -> apex -> falling
      const k = Math.max(0, Math.min(1, (d.vy + TUNE.JUMP_SPEED) / (2 * TUNE.JUMP_SPEED)));
      const i = 1 + Math.round(k * 8);
      drawSprite("david_jump_air", i, x, y - d.h / 2 - 6, d.facing); break;
    }
    case "flip": drawSprite("david_flip", frameOf("david_flip", t, 60), x, y - d.h / 2 - 6, d.facing); break;
    case "land": drawSprite("david_jump_land", frameOf("david_jump_land", t, 45), x, y, d.facing); break;
    case "roll": drawSprite("david_roll", Math.min(11, Math.floor(d.rollT / TUNE.ROLL_TIME * 12)), x, y, d.facing); break;
    case "getup": drawSprite("david_roll_getup", Math.min(6, 3 + Math.floor(d.t / 0.07)), x, y, d.facing); break;
    case "crouch": drawSprite("david_crouch", frameOf("david_crouch", t, 40), x, y, d.facing); break;
    case "crawl": drawSprite("david_crawl", frameOf("david_crawl", t), x, y, d.facing); break;
    case "kneel": { const i = frameOf("david_sit_harp", t, 95); drawSprite("david_sit_harp", i, x, y, d.facing, sitHarpScale(i)); break; }
    case "harp": {
      // frames 1-8 once (settling in), then loop the calm strumming frames 9-12 back and forth
      const settle = 8 * TUNE.HARP_SETTLE_MS / 1000;
      let i;
      if (t < settle) i = Math.floor(t * 1000 / TUNE.HARP_SETTLE_MS);
      else { const k = Math.floor((t - settle) * 1000 / TUNE.HARP_LOOP_MS) % 6; i = 8 + (k < 4 ? k : 6 - k); }
      drawSprite("david_play_harp", i, x, y, d.facing); break;
    }
    case "standup": {   // the sit-down played backwards: harp back in the satchel, stand up
      const n = SPR.david_sit_harp.frames;
      const i = Math.max(0, n - 1 - Math.floor(t / TUNE.HARP_STANDUP * n));
      drawSprite("david_sit_harp", i, x, y, d.facing, sitHarpScale(i)); break;
    }
    case "pickup": drawSprite("david_pickup_lamb", Math.min(15, 5 + Math.floor(d.t / 0.6 * 11)), x, y, d.facing); break;
    case "putdown": drawSprite("david_pickup_lamb", Math.min(5, Math.floor(d.t / 0.4 * 6)), x, y, d.facing); break;
    case "carry": {
      if (!d.onGround) {
        const hop = d.carryHop > 0 ? 6 : 3;   // a different stride pose for the second hop
        drawSprite("david_carry_lamb_walk", hop, x, y, d.facing);
      } else if (Math.abs(d.vx) > 15) drawSprite("david_carry_lamb_walk", frameOf("david_carry_lamb_walk", t * Math.max(0.6, Math.abs(d.vx) / TUNE.WALK_SPEED)), x, y, d.facing);
      else drawSprite("david_pickup_lamb", 15, x, y, d.facing);
      break;
    }
  }
}

// ============================================================================
// Lamb (follows David; P2 control comes later)
// ============================================================================
function updateLamb(dt) {
  if (lamb.carried) { lamb.x = david.x; lamb.y = david.y; return; }
  lamb.t += dt;
  // the lamb walks in David's footsteps, first in the line: it hops where he hopped, so it never falls in a pit.
  // (When a second player controls the lamb, it'll get its own physics again.)
  const tgt = david.deadT > 0 ? null : trailAt(TUNE.LAMB_GAP);
  if (!tgt) { lamb.vx = 0; lamb.onGround = true; return; }
  const y0 = lamb.y, far = Math.hypot(tgt.x - lamb.x, tgt.y - lamb.y);
  moveToward(lamb, tgt.x, tgt.y, Math.min(900, Math.max(TUNE.LAMB_SPEED, far * 5)), dt);
  lamb.vx = lamb.moved * lamb.facing; lamb.vy = 0;
  lamb.onGround = !tgt.hop && Math.abs(lamb.y - y0) < 0.5;
}
function popLamb() {
  lamb.x = david.x - david.facing * 55; lamb.y = david.y; lamb.vx = 0; lamb.vy = -300; lamb.lostT = 0;
  for (let k = 0; k < 14; k++) bits.push({ x: lamb.x, y: lamb.y - 20, vx: (Math.random() - 0.5) * 360, vy: -Math.random() * 420, life: 0.6, color: "#fff7c2" });
}
function drawLamb(camX) {
  if (lamb.carried) return;
  const moving = Math.abs(lamb.vx) > 20 || !lamb.onGround;
  drawSprite("lamb_run", moving ? frameOf("lamb_run", lamb.t) : 2, lamb.x - camX, lamb.y, lamb.facing);
}

// ============================================================================
// Stones + gourd targets
// ============================================================================
const bits = [];
function updateStones(dt) {
  for (const s of stones) {
    s.life -= dt; s.vy += TUNE.STONE_GRAVITY * dt * (s.power ? 0.08 : s.charged ? 0.45 : 1);
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.power) { s.trail.push([s.x, s.y]); if (s.trail.length > 10) s.trail.shift(); }
    if (isSolid(Math.floor(s.x / T), Math.floor(s.y / T))) { s.life = 0; stoneHit(s); }
    for (const g of gourds) if (g.alive && Math.hypot(s.x - g.x, s.y - (g.y - 24)) < 30) {
      g.alive = false; if (!s.power) s.life = 0; stoneHit(s);
      for (let k = 0; k < 10; k++) bits.push({ x: g.x, y: g.y - 24, vx: (Math.random() - 0.5) * 500, vy: -Math.random() * 500, life: 0.8, color: "#c8c040" });
    }
    for (const sn of snakes) if (!sn.gone && s.life > 0 && Math.abs(s.x - snakeMid(sn)) < 48 && s.y > sn.y - 70 && s.y < sn.y + 6) {
      sn.gone = true; sn.vx = Math.sign(s.vx) * 220; sn.vy = -480; if (!s.power) s.life = 0; stoneHit(s); toast("Driven off!");
    }
    if (s.life > 0 && stoneHitsBugs(s)) { s.life = 0; stoneHit(s); }
    if (s.life > 0 && stoneHitsThorns(s)) { s.life = 0; stoneHit(s); }
    if (s.life > 0 && stoneHitsLion(s)) s.life = 0;
    if (s.life > 0 && !s.power && stoneHitsTree(s)) { s.life = 0; stoneHit(s); }
    if (s.life > 0 && !finalBlow.on) watchForFinalStone(s);
  }
  for (let i = stones.length - 1; i >= 0; i--) if (stones[i].life <= 0) stones.splice(i, 1);
  for (const b of bits) { b.life -= dt; b.vy += 1400 * dt; b.x += b.vx * dt; b.y += b.vy * dt; }
  for (let i = bits.length - 1; i >= 0; i--) if (bits[i].life <= 0) bits.splice(i, 1);
}

// ============================================================================
// Drawing the world
// ============================================================================
// ---------------------------------------------------------------------------
// Terrain art (Glen's World 1 set): earth = sediment + topsoil edge, rock = limestone + limestone top,
// walls = dry-stone pieces, one-way ledges = rock ledge pieces, pits = dark drop with rock-cliff edges.
// ---------------------------------------------------------------------------
const TER = {};
for (const n of ["topsoil", "sediment", "limestone", "limestone_top", "ledge_left", "ledge_mid", "ledge_right",
                 "base_left", "base_mid", "base_right",
                 "wall_left", "wall_mid", "wall_right", "pit_left", "pit_right"]) {
  total++;
  const img = new Image(); img.onload = () => { loaded++; }; img.onerror = () => { loaded++; };
  img.src = `../assets/terrain/${n}.png?v=${window.BUILD || 0}`; TER[n] = img;
}
const terPatterns = {};
function terPattern(name, scale) {   // a repeating fill, cached, anchored to the level (not the screen)
  const key = name + scale;
  if (terPatterns[key]) return terPatterns[key];
  const img = TER[name]; if (!img || !img.naturalWidth) return null;
  const c = document.createElement("canvas");
  c.width = Math.round(img.naturalWidth * scale); c.height = Math.round(img.naturalHeight * scale);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return (terPatterns[key] = ctx.createPattern(c, "repeat-x" === name ? "repeat-x" : "repeat"));
}
// draw a strip image repeated along a run, height h, top at y (world coordinates; caller has translated by -camX)
function terStrip(name, x0, x1, y, h, inset = 0) {   // inset: trim this fraction off each side of the image (hides dark piece edges)
  const img = TER[name]; if (!img || !img.naturalWidth) return;
  const sx = img.naturalWidth * inset, sw = img.naturalWidth - 2 * sx;
  const w = sw * h / img.naturalHeight;
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y - 2, x1 - x0, h + 4); ctx.clip();
  for (let x = Math.floor(x0 / w) * w; x < x1; x += w) ctx.drawImage(img, sx, 0, sw, img.naturalHeight, x, y, w + 1, h);
  ctx.restore();
}
function terPiece(name, x, y, h, flip = false) {   // one piece scaled to height h, top-left at x,y; returns its width
  const img = TER[name]; if (!img || !img.naturalWidth) return 0;
  const w = img.naturalWidth * h / img.naturalHeight;
  if (flip) { ctx.save(); ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(img, 0, 0, w, h); ctx.restore(); }
  else ctx.drawImage(img, x, y, w, h);
  return w;
}
// Glen's boulder: measured on his image (pixels): where the rock is, and which row of the soil texture its soil starts on
const BOULDER = { rockCenterX: 487, grassRow: 320, soilOffset: 24, standRow: 42, widen: 1.15 };   // standRow: the middle of the rock's flat top, where feet land   // grassRow: where Glen's topsoil sits on the boulder image
const BASE_GRASS_FRAC = 0.64;   // where the grass band sits down Glen's base pieces
const TER_GRASS_CENTER = 3;     // the ground's grass sits this many pixels above the ground line
function boulderTopY(groundY) { return groundY - TER_GRASS_CENTER - BOULDER.grassRow * sedScale(); }
function sedScale() { return Math.round(664 * TUNE.TER_FILL_SCALE) / 664; }
// shift the ground's soil layers so they line up with the first boulder's soil
let sedimentPhase = null;
function getSedimentPhase() {
  if (sedimentPhase !== null) return sedimentPhase;
  const P = Math.round(664 * TUNE.TER_FILL_SCALE); sedimentPhase = 0;
  for (let r = 0; r < ROWS && !sedimentPhase; r++) for (let c = 0; c < COLS; c++) if (solid[r][c] === 4) {
    let h = 0; while (matAt(c, r + h) === 4) h++;
    const y0 = boulderTopY((r + h) * T);
    sedimentPhase = ((y0 - BOULDER.soilOffset * sedScale()) % P + P) % P; break;
  }
  return sedimentPhase;
}
const matAt = (c, r) => (r >= 0 && r < ROWS && c >= 0 && c < COLS) ? solid[r][c] : 0;

function drawTiles(camX) {
  const c0 = Math.max(0, Math.floor(camX / T) - 2), c1 = Math.min(COLS - 1, Math.ceil((camX + W) / T) + 2);
  ctx.save(); ctx.translate(-Math.round(camX), 0);
  // 1) pits: the gaps in the ground fall away into darkness
  for (let c = c0; c <= c1; c++) if (!isSolid(c, GR)) {
    const g = ctx.createLinearGradient(0, GR * T, 0, H);
    g.addColorStop(0, "#2a1d12"); g.addColorStop(0.5, "#0d0805"); g.addColorStop(1, "#000");
    ctx.fillStyle = g; ctx.fillRect(c * T, GR * T - 2, T + 1, H - GR * T + 2);
  }
  // 2) fills: earth and limestone (walls are drawn as pieces below)
  const sed = terPattern("sediment", TUNE.TER_FILL_SCALE), lim = terPattern("limestone", TUNE.TER_FILL_SCALE);
  if (sed && sed.setTransform) sed.setTransform(new DOMMatrix().translate(0, getSedimentPhase()));
  for (let r = 0; r < ROWS; r++) for (let c = c0; c <= c1; c++) {
    const m = matAt(c, r); if (!m || m === 3 || m === 4) continue;
    ctx.fillStyle = (m === 2 ? lim : sed) || (m === 2 ? "#c9b48c" : "#8b6a3e");
    let fx = c * T, fw = T + 0.5;
    if (r >= GR && m === 1) {   // next to a pit: stop short so the soil doesn't show past the cliff face
      if (!isSolid(c + 1, GR)) fw -= TUNE.PIT_TRIM;
      if (!isSolid(c - 1, GR)) { fx += TUNE.PIT_TRIM; fw -= TUNE.PIT_TRIM; }
    }
    ctx.fillRect(fx, r * T, fw, T + 0.5);
  }
  // 3b) where limestone sits on earth, sink it into the soil (Glen's limestone base pieces)
  for (let r = 0; r < ROWS - 1; r++) {
    let start = -1;
    for (let c = c0 - 4; c <= c1 + 1; c++) {
      const on = c <= c1 && matAt(c, r) === 2 && matAt(c, r + 1) === 1;
      if (on && start < 0) start = c;
      if (!on && start >= 0) {
        const h = TUNE.TER_BASE_H, y = (r + 1) * T - TER_GRASS_CENTER - h * BASE_GRASS_FRAC + TUNE.BASE_DROP, x0 = start * T, x1 = c * T;
        const lw = TER.base_left.naturalWidth * h / (TER.base_left.naturalHeight || 1);
        const rw = TER.base_right.naturalWidth * h / (TER.base_right.naturalHeight || 1);
        // only the ROCK part shows: cut the pieces off at the grass line so the ground's own soil runs straight through
        const gy = (r + 1) * T;
        ctx.save(); ctx.beginPath(); ctx.rect(x0 - lw, -1000, x1 - x0 + lw + rw, gy + 1000 - 2); ctx.clip();
        terStrip("base_mid", x0 + lw * 0.3, x1 - rw * 0.3, y, h, 0.06);
        terPiece("base_left", x0 - lw * 0.35, y, h);
        terPiece("base_right", x1 - rw * 0.65, y, h);
        ctx.restore();
        start = -1;
      }
    }
  }
  // boulders (material 4): Glen's half-buried boulder, drawn over the block it fills
  const seenB = new Set();
  for (let r = 0; r < ROWS; r++) for (let c = c0 - 6; c <= c1; c++) {
    if (matAt(c, r) !== 4 || seenB.has(c + "," + r) || matAt(c, r - 1) === 4 || matAt(c - 1, r) === 4) continue;
    let w = 0; while (matAt(c + w, r) === 4) w++;
    let h = 0; while (matAt(c, r + h) === 4) h++;
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) seenB.add((c + i) + "," + (r + j));
    const img = ITEM.boulder_mound; if (!img || !img.naturalWidth) continue;
    // drawn at the ground soil's own scale, rock centred on the block, its soil sunk into the ground (layers line up, see sedimentPhase)
    // the rock above the grass is stretched so the middle of its top face sits on the top of the block (where you stand), the soil below is left alone
    const sc = sedScale(), B = BOULDER, sx = sc * B.widen, groundY = (r + h) * T, grassY = groundY - TER_GRASS_CENTER;
    const ky = (h * T - TER_GRASS_CENTER) / ((B.grassRow - B.standRow) * sc), x0 = (c + w / 2) * T - B.rockCenterX * sx;
    ctx.drawImage(img, 0, 0, img.naturalWidth, B.grassRow, x0, grassY - B.grassRow * sc * ky, img.naturalWidth * sx, B.grassRow * sc * ky);
    ctx.drawImage(img, 0, B.grassRow, img.naturalWidth, img.naturalHeight - B.grassRow, x0, grassY, img.naturalWidth * sx, (img.naturalHeight - B.grassRow) * sc);
  }
  // 5) dry-stone walls (material 3): end caps + repeated middle, scaled to the wall's height
  const seen = new Set();
  for (let r = 0; r < ROWS; r++) for (let c = c0 - 8; c <= c1; c++) {
    if (matAt(c, r) !== 3 || seen.has(c + "," + r) || matAt(c, r - 1) === 3 || matAt(c - 1, r) === 3) continue;
    let w = 0; while (matAt(c + w, r) === 3) w++;
    let h = 0; while (matAt(c, r + h) === 3) h++;
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) seen.add((c + i) + "," + (r + j));
    const sink = TUNE.WALL_SINK;                               // bury the bottom stones a little in the soil
    const x0 = c * T, x1 = (c + w) * T, y = r * T - 6 + sink, hh = h * T + 8;
    const groundY = (r + h) * T;
    // soft contact shadow on the grass
    const sg = ctx.createRadialGradient((x0 + x1) / 2, groundY, 4, (x0 + x1) / 2, groundY, (x1 - x0) * 0.7);
    sg.addColorStop(0, "rgba(40,28,10,0.35)"); sg.addColorStop(1, "rgba(40,28,10,0)");
    ctx.fillStyle = sg; ctx.fillRect(x0 - 30, groundY - 14, x1 - x0 + 60, 24);
    // colour-match the stones to the limestone and the background walls
    ctx.save(); ctx.filter = TUNE.WALL_FILTER;
    ctx.beginPath(); ctx.rect(x0 - 200, -1000, x1 - x0 + 400, groundY + 1000); ctx.clip();
    const lw = terPiece("wall_left", x0 - 4, y, hh);
    const rw = TER.wall_right.naturalWidth * hh / (TER.wall_right.naturalHeight || 1);
    terStrip("wall_mid", x0 - 4 + lw * 0.7, x1 + 4 - rw * 0.7, y + hh * 0.13, hh * 0.87);
    terPiece("wall_right", x1 + 4 - rw, y, hh);
    ctx.restore();
  }
  // 3) top edges: grass on earth, weathered rock on limestone (one strip per run of exposed tops)
  for (let r = 0; r < ROWS; r++) {
    for (let m of [1, 2]) {
      let start = -1;
      for (let c = c0; c <= c1 + 1; c++) {
        // grass also runs under walls and under limestone sitting on the ground, so their feet stand IN the meadow
        const above = matAt(c, r - 1), covered = above && !(above === 3 || (m === 1 && above === 2));
        const top = c <= c1 && matAt(c, r) === m && !covered;
        if (top && start < 0) start = c;
        if (!top && start >= 0) {
          if (m === 1) {
            const lp = r === GR && !isSolid(start - 1, GR), rp = r === GR && !isSolid(c, GR);   // a pit on that side
            terStrip("topsoil", start * T + (lp ? TUNE.PIT_TRIM : -4), c * T + (rp ? -TUNE.PIT_TRIM : 4), r * T - TUNE.TER_GRASS_RISE, TUNE.TER_TOPSOIL_H);
          }
          else terStrip("limestone_top", start * T - 3, c * T + 3, r * T - TUNE.TER_ROCKTOP_RISE, TUNE.TER_ROCKTOP_H);
          start = -1;
        }
      }
    }
  }
  // 4) cliff edges where the ground meets a pit
  for (let c = c0; c <= c1; c++) {
    if (isSolid(c, GR) && !isSolid(c + 1, GR) && c + 1 < COLS) {         // ground ends, pit to the right
      const h = TUNE.TER_PIT_EDGE_H, w = TER.pit_left.naturalWidth * h / (TER.pit_left.naturalHeight || 1);
      terPiece("pit_left", (c + 1) * T - w * 0.92, GR * T - TUNE.TER_GRASS_RISE, h);
    }
    if (isSolid(c, GR) && !isSolid(c - 1, GR) && c > 0) {                // pit to the left, ground starts
      const h = TUNE.TER_PIT_EDGE_H, w = TER.pit_right.naturalWidth * h / (TER.pit_right.naturalHeight || 1);
      terPiece("pit_right", c * T - w * 0.08, GR * T - TUNE.TER_GRASS_RISE, h);
    }
  }
  // 6) one-way ledges: rock shelf pieces
  for (let r = 0; r < ROWS; r++) {
    let start = -1;
    for (let c = c0 - 6; c <= c1 + 1; c++) {
      const on = c <= c1 && isOneway(c, r);
      if (on && start < 0) start = c;
      if (!on && start >= 0) {
        const x0 = start * T, x1 = c * T, y = r * T - 4, h = TUNE.TER_LEDGE_H;
        const lw = TER.ledge_left.naturalWidth * h / (TER.ledge_left.naturalHeight || 1);
        const rw = TER.ledge_right.naturalWidth * h / (TER.ledge_right.naturalHeight || 1);
        terStrip("ledge_mid", x0 + lw * 0.6, x1 - rw * 0.6, y, h);
        terPiece("ledge_left", x0 - 6, y, h);
        terPiece("ledge_right", x1 + 6 - rw, y, h);
        start = -1;
      }
    }
  }
  ctx.restore();
  // gourds
  for (const g of gourds) if (g.alive) {
    const x = g.x - camX, y = g.y;
    if (g.hanging) { ctx.strokeStyle = "#4e7a2a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - 50); ctx.stroke(); }
    if (ITEM.wild_gourds && ITEM.wild_gourds.naturalWidth) drawItem("wild_gourds", x, y, 0.32);
    else { ctx.fillStyle = "#d9a441"; ctx.beginPath(); ctx.ellipse(x, y - 20, 16, 20, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  for (const b of bits) { ctx.fillStyle = b.color || "#d9a441"; ctx.fillRect(b.x - camX - 3, b.y - 3, 6, 6); }
  ctx.fillStyle = "rgba(60,40,20,0.85)"; ctx.font = "bold 16px sans-serif";
  for (const l of labels) ctx.fillText(l.text, l.x - camX, l.y);
}
function drawStones(camX) {
  for (const s of stones) if (s.power) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    s.trail.forEach(([tx, ty], k) => { ctx.fillStyle = `rgba(255,220,120,${(k + 1) / s.trail.length * 0.5})`; ctx.beginPath(); ctx.arc(tx - camX, ty, 4 + k, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "rgba(255,240,180,0.9)"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#fffbea"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 8, 0, Math.PI * 2); ctx.fill();
  }
  for (const s of stones) {
    if (s.power) continue;
    if (s.charged) {
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,200,80,0.45)"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = "#6d6a63"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 6, 0, Math.PI * 2); ctx.fill();
  }
}

let debug = false;
addEventListener("keydown", e => {
  if (e.code === "F2" || e.code === "KeyM") { e.preventDefault(); startSetup(); }
  if (e.code === "Backquote") debug = !debug;
  if (e.code === "Escape" && setup.active) { setup.active = false; toast("Controller setup cancelled."); }
  if (e.code === "KeyR") { respawn(); }
  if (e.code === "KeyH") helpT = helpT > 0 ? 0 : 9999;
  if (e.code === "Digit1") { location.hash = ""; location.reload(); }
  if (e.code === "Digit2") { location.hash = "test"; location.reload(); }
  if (e.code === "Digit3") { bgWorld = bgWorld === "w1" ? "w2" : "w1"; toast(bgWorld === "w1" ? "World 1 background" : "World 2 background (preview)"); }
});

let helpT = 12;
function drawHUD() {
  drawHearts(); drawSpecialCount(); drawLivesAndOil(); drawSheepCount(); drawChargeRing();
  if (!audioUnlocked) {
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(W / 2 - 230, H - 40, 460, 30);
    ctx.fillStyle = "#ffe08a"; ctx.font = "15px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Click the game (or press any key) once to turn on sound", W / 2, H - 20); ctx.textAlign = "left";
  }
  if (helpT <= 0) {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(10, 10, 450, 26);
    ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif";
    ctx.fillText("H = controls   1 = World 1-1   2 = movement test   3 = swap background", 18, 28);
  } else drawHelp();
  drawToastAndSetup();
}
function drawHelp() {
  ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(10, 10, 760, 118);
  ctx.fillStyle = "#fff"; ctx.font = "15px sans-serif";
  const lines = [
    "Arrows: move (hold to run)   Z / Space = A: jump, again in the air = flip",
    "X = B: sling (hold to charge; Up = aim up, Up+forward = diagonal, Down in the air = aim down)   A + B: Power Sling",
    "Down + A while moving: roll   Down next to the lamb: pick up / put down   Jump into trees: they drop fruit",
    "Shift = Select: play the harp   R: back to the campfire   M: set up the NES controller   H: hide this",
    "Controller: " + (readPad() ? (padMap ? "set up ✓  (M or hold Select+Start to redo)" : "connected, not set up yet: press M") : "none (press a button on it so the browser sees it)"),
  ];
  lines.forEach((l, i) => ctx.fillText(l, 20, 32 + i * 21));
}
function drawToastAndSetup() {
  if (toastTime > 0) {
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(W / 2 - 330, H - 70, 660, 44);
    ctx.fillStyle = "#ffe08a"; ctx.font = "18px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(toastText, W / 2, H - 42); ctx.textAlign = "left";
  }
  if (setup.active) {
    ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "34px sans-serif";
    ctx.fillText("Controller setup", W / 2, H / 2 - 60);
    ctx.font = "28px sans-serif"; ctx.fillStyle = "#ffe08a";
    const names = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", a: "A", b: "B", select: "SELECT", start: "START" };
    ctx.fillText("Press " + names[BUTTONS[setup.step]] + " on the controller", W / 2, H / 2);
    ctx.font = "18px sans-serif"; ctx.fillStyle = "#ccc";
    ctx.fillText(`(${setup.step + 1} of ${BUTTONS.length})   Esc on the keyboard to cancel`, W / 2, H / 2 + 40);
    ctx.textAlign = "left";
  }
}

// ============================================================================
// World: items, hearts and damage, food, snakes, campfires, the lion
// ============================================================================
const ITEM = {};
for (const name of window.ITEM_LIST || []) {
  total++;
  const img = new Image();
  img.onload = () => { loaded++; }; img.onerror = () => { loaded++; };
  img.src = `../assets/items/${name}.png?v=${window.BUILD || 0}`;
  ITEM[name] = img;
}
function drawItem(name, x, y, size, alpha = 1) {   // (x, y) = bottom-centre
  const img = ITEM[name]; if (!img || !img.naturalWidth) return;
  const w = img.naturalWidth * size, h = img.naturalHeight * size;
  ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, Math.round(x - w / 2), Math.round(y - h), w, h); ctx.restore();
}

const FOOD = {   // heal amount; negative = poison
  grapes: 1, olives: 1, dates: 1, figs: 1, raisins: 1, bread: 1, cheese: 1, roasted_grain: 1, lentils: 2,
  fig_cake: 3, honey: 99, poison_berries: -1, wild_gourds: -1,
};
const FOOD_TEXT = {
  bread: "Bread", cheese: "Sheep's cheese", grapes: "Grapes", figs: "Figs", dates: "Dates", honey: "Honey: his eyes brightened (1 Samuel 14:27)",
  fig_cake: "Fig cake (1 Samuel 25:18)", poison_berries: "Poison berries!", wild_gourds: "Wild gourds: death in the pot! (2 Kings 4:39-40)",
  lentils: "Lentils", raisins: "Raisins", olives: "Olives", roasted_grain: "Roasted grain",
};

// hearts
david.maxHearts = TUNE.HEARTS; david.hearts = TUNE.HEARTS; david.inv = 0; david.deadT = 0; david.specialStones = 0;
david.lives = TUNE.LIVES; david.olives = 0;
// the game is driving David (walking to the lamb, the hug, the gate): nothing can hurt him, and no hurt-blink
const inCutscene = () => david.state === "toLamb" || david.state === "rescue" || david.state === "finish" || david.state === "liftSheep";
function hurtDavid(fromX) {
  const d = david;
  if (d.inv > 0 || d.deadT > 0 || inCutscene()) return;
  d.hearts--; d.inv = TUNE.HURT_INVINCIBLE;
  d.vx = Math.sign(d.x - fromX || -d.facing) * 360; d.vy = -560; d.onGround = false;
  d.harp = false; d.charging = false; d.throwT = -1;
  if (d.state !== "carry") setState("jump");
  if (d.hearts <= 0) { d.deadT = 1.2; d.lives--; toast(d.lives > 0 ? `Ouch! Back to the campfire... (${d.lives} ${d.lives === 1 ? "life" : "lives"} left)` : "Out of lives. Back to the start of the stage."); }
}
function restartStage() {   // out of lives: back to the start of THIS stage; special stones you found are kept
  const d = david;
  d.lives = TUNE.LIVES; checkpoint = { ...spawn };
  for (const s of snakes) Object.assign(s, { gone: false, alpha: 1, x: s.home, state: "idle", t: 0 });
  for (let i = pickups.length - 1; i >= 0; i--) { if (pickups[i].dropped) pickups.splice(i, 1); else pickups[i].taken = false; }
  for (let i = olives.length - 1; i >= 0; i--) { if (!olives[i].placed) olives.splice(i, 1); else olives[i].taken = false; }
  for (const t of decor) { t.shaken = false; t.shakeT = 0; }
  for (const g of gourds) g.alive = true;
  for (const f of fires) f.lit = false;
  for (const b of bees) Object.assign(b, { gone: false, alpha: 1 });
  for (const h of hornets) Object.assign(h, { gone: false, alpha: 1, x: h.hx, y: h.hy, state: "hover", t: 0 });
  beesAngry = false;
  resetAllSheep();
}
function respawn() {
  const d = david;
  if (d.lives <= 0) restartStage();
  d.x = checkpoint.x; d.y = checkpoint.y; d.vx = d.vy = 0; d.hearts = d.maxHearts; d.inv = 1; d.deadT = 0; setState("idle");
  lamb.x = d.x - 50; lamb.y = d.y;
  if (lion && !rescuedLamb) resetLion();
  sheepToCheckpoint();
}

// food
function fall(o, dt) {   // simple fall-and-land for dropped things
  if (!o.falling) return;
  o.vy = Math.min(1200, o.vy + 1800 * dt); o.y += o.vy * dt; o.x += (o.vx || 0) * dt; o.vx = (o.vx || 0) * 0.98;
  const c = Math.floor(o.x / T), r = Math.floor(o.y / T);
  if (o.vy > 0 && (isSolid(c, r) || isOneway(c, r))) { o.y = r * T; o.falling = false; o.vy = 0; o.vx = 0; }
  if (o.y > ROWS * T + 200) o.taken = true;
}
function updatePickups(dt) {
  for (const p of pickups) {
    if (p.taken) continue;
    fall(p, dt);
    p.t += dt;
    if (Math.abs(p.x - david.x) < 40 && david.y > p.y - 60 && david.y - david.h < p.y + 10) {
      p.taken = true;
      const v = FOOD[p.name] ?? 1;
      if (v < 0) hurtDavid(p.x); else { david.hearts = Math.min(david.maxHearts, david.hearts + v); sfx("heal", undefined, 0.6); }
      toast((v < 0 ? "" : "+ ") + (FOOD_TEXT[p.name] || p.name));
      for (let k = 0; k < 10; k++) bits.push({ x: p.x, y: p.y - 20, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 380, life: 0.6, color: v < 0 ? "#7a2" : "#ffe9a0" });
    }
  }
}
function drawPickups(camX) {
  for (const p of pickups) if (!p.taken) drawItem(p.name, p.x - camX, p.y - 4 + Math.sin(p.t * 3) * 3, TUNE.ITEM_SIZE);
}

// the cobra's strike: [frame index, seconds shown]. Frames 5-7 are the strike, 8 settles back.
const COBRA_STRIKE = [[4, 0.07], [5, 0.16], [6, 0.08], [7, 0.12]];
// both snakes: sheet, where the tip of the head is in each frame, and the middle of the body (sheet pixels, measured from Glen's sheets)
const SNAKE_ART = {
  cobra: { sheet: "cobra_hood",   head: [125, 127, 125, 127, 153, 203, 154, 131], mid: 62 },
  viper: { sheet: "snake_strike", head: [85, 85, 84, 84, 111, 141, 108, 81],      mid: 43 },
};
// snakes turn around in place: they flip around the middle of the body, not the tip of the head
function snakeArt(s) { return SNAKE_ART[s.kind]; }
function snakeScale(s) { return SCALE * (TUNE.SPRITE_SIZE[snakeArt(s).sheet] || 1); }
function snakeMid(s) { const a = snakeArt(s), sp = SPR[a.sheet]; return sp ? s.x + (a.mid - sp.ax) * snakeScale(s) : s.x; }   // fixed spot in the level
function snakeDrawX(s) { const a = snakeArt(s); return snakeMid(s) - s.facing * (a.mid - SPR[a.sheet].ax) * snakeScale(s); }
function snakeHeadX(s, f) { const a = snakeArt(s); return snakeDrawX(s) + s.facing * (a.head[f] - SPR[a.sheet].ax) * snakeScale(s); }
function cobraStrikeFrame(t) { for (const [f, d] of COBRA_STRIKE) { if (t < d) return f; t -= d; } return 7; }
// snakes: "cobra" (hood up, sways, lunges when close) and "viper" (coiled, strikes when close)
function updateSnakes(dt) {
  for (const s of snakes) {
    if (s.gone) { if (s.alpha > 0) { s.alpha -= dt * 1.5; s.y += s.vy * dt; s.vy += 1600 * dt; s.x += s.vx * dt; } continue; }
    s.t += dt;
    const sameLevel = Math.abs(david.y - s.y) < 70;
    if (snakeArt(s)) {
      if (s.state !== "strike") s.facing = Math.sign(david.x - snakeMid(s)) || s.facing;   // turn in place (never mid-strike)
      const dx = Math.abs(david.x - snakeHeadX(s, 0));
      if (s.state === "idle" && dx < TUNE.SNAKE_RANGE && sameLevel) { s.state = "strike"; s.t = 0; }
      const strikeLen = COBRA_STRIKE.reduce((a, f) => a + f[1], 0);
      if (s.state === "strike" && s.t > strikeLen) { s.state = "rest"; s.t = 0; }
      if (s.state === "rest" && s.t > 0.8) { s.state = "idle"; s.t = 0; }
      if (s.state === "strike") {   // the bite covers from where the head waits to where it is right now
        const a = snakeHeadX(s, 0), b = snakeHeadX(s, cobraStrikeFrame(s.t)) + s.facing * TUNE.COBRA_BITE_EXTRA;
        const lo = Math.min(a, b), hi = Math.max(a, b);
        if (david.x + BODY_W / 2 > lo && david.x - BODY_W / 2 < hi && sameLevel && david.y - david.h < s.y) hurtDavid(snakeMid(s));
      }
      continue;
    }
    s.facing = Math.sign(david.x - s.x) || s.facing;
    const dx = Math.abs(david.x - s.x);
    if (s.state === "idle" && dx < TUNE.SNAKE_RANGE && sameLevel) { s.state = "strike"; s.t = 0; }
    const strikeLen = s.kind === "cobra" ? COBRA_STRIKE.reduce((a, f) => a + f[1], 0) : 0.7;
    if (s.state === "strike" && s.t > strikeLen) { s.state = "rest"; s.t = 0; }
    if (s.state === "rest" && s.t > 0.8) { s.state = "idle"; s.t = 0; }
    // how far the head reaches right now
    const lunge = s.state === "strike" ? Math.sin(Math.min(1, s.t / 0.7) * Math.PI) * 46 : 0;
    s.reach = 22 + lunge;
    if (dx < s.reach + BODY_W / 2 && Math.sign(david.x - s.x) === s.facing && sameLevel && david.y - david.h < s.y) hurtDavid(s.x);
  }
}
function drawSnakes(camX) {
  for (const s of snakes) {
    if (s.alpha <= 0) continue;
    const x = s.x - camX;
    if (snakeArt(s)) {
      // waiting: sway through frames 1-4; strike: Glen's frames 5, 6, 7, then 8 to settle
      const i = s.state === "strike" ? cobraStrikeFrame(s.t) : [0, 1, 2, 3, 2, 1][Math.floor(s.t / 0.16) % 6];
      drawSprite(snakeArt(s).sheet, i, snakeDrawX(s) - camX, s.y, s.facing, 1, s.alpha);
    } else {
      const n = SPR.snake_strike.frames;
      const i = s.state === "strike" ? Math.round(Math.abs(Math.cos(Math.min(1, s.t / 0.7) * Math.PI)) * (n - 1)) : n - 1;
      drawSprite("snake_strike", i, x, s.y, s.facing, 1, s.alpha);
    }
  }
}

// campfires: checkpoint; playing the harp next to one refills hearts
function updateFires(dt) {
  for (const f of fires) {
    const near = Math.abs(david.x - f.x) < 70 && Math.abs(david.y - f.y) < 40;
    if (near && !f.lit) { f.lit = true; checkpoint = { x: f.x - 30, y: f.y }; toast("Campfire: checkpoint. Play the harp here (Select) to rest."); }
    if (near && david.state === "harp" && david.hearts < david.maxHearts) {
      f.healT = (f.healT || 0) + dt;
      if (f.healT > 0.8) { f.healT = 0; david.hearts++; sfx("heal", undefined, 0.35); }
    }
  }
}
function drawFires(camX) {
  for (const f of fires) {
    drawItem("campfire", f.x - camX, f.y + 4, 0.55);
    if (f.lit) {   // warm flicker
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const r = 60 + Math.sin(performance.now() / 90) * 6;
      const g = ctx.createRadialGradient(f.x - camX, f.y - 34, 4, f.x - camX, f.y - 34, r);
      g.addColorStop(0, "rgba(255,170,60,0.35)"); g.addColorStop(1, "rgba(255,120,30,0)");
      ctx.fillStyle = g; ctx.fillRect(f.x - camX - r, f.y - 34 - r, r * 2, r * 2); ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// The Lion (World 1 boss, simple version): prowl -> roar (the warning) -> pounce -> dazed (hit it now)
// ---------------------------------------------------------------------------
let lion = lionSpawn ? { x: lionSpawn.x, y: lionSpawn.y } : null;
function resetLion() {
  Object.assign(lion, { x: lionSpawn.x, y: lionSpawn.y, vx: 0, vy: 0, onGround: true, state: "carry", t: 0, facing: -1,
                        hp: TUNE.LION_HP, flash: 0, alpha: 1, told: false, awake: false, pounceCool: 0 });
  Object.assign(takenLamb, { active: false, hidden: false, follow: false });
}
// the lamb the lion carries off (1 Samuel 17:34); once it's let go it runs to safety behind the lion
const takenLamb = { active: false, x: 0, y: 0, vx: 0, vy: 0, facing: 1, t: 0 };
if (lion) resetLion();
function lionBox() {   // body box in world coords
  const sz = TUNE.SPRITE_SIZE.lion_prowl || 1;
  const len = 120 * sz, hgt = 88 * sz, head = 26 * sz;   // the sprite's anchor is the lion's head
  const front = lion.x + lion.facing * head, back = lion.x - lion.facing * (len - head);
  return { x0: Math.min(front, back), x1: Math.max(front, back), y0: lion.y - hgt, y1: lion.y };
}
function setLion(s) { if (lion.state !== s) { lion.state = s; lion.t = 0; } }
function updateLion(dt) {
  if (!lion) return;
  const L = lion; L.t += dt; L.flash = Math.max(0, L.flash - dt);
  if (L.state === "defeated") { L.alpha = Math.max(0, L.alpha - dt * 0.5); return; }
  if (!L.awake) {
    const dist0 = Math.abs(david.x - L.x);
    if (L.state === "carry") {            // pacing near its den with the lamb in its mouth
      const home = lionSpawn.x, span = 4 * T;
      if (L.x > home + span) L.facing = -1; else if (L.x < home - span) L.facing = 1;
      L.vx = L.facing * TUNE.LION_PROWL * 0.7;
      if (david.x > arenaX) { L.vx = 0; L.facing = Math.sign(david.x - L.x) || -1; setLion("sitTaunt"); helpT = 0;
        toast("The lion has one of your lambs!"); }
    } else if (L.state === "sitTaunt") {   // sits and stares at David, lamb in its jaws
      L.vx = 0; L.facing = Math.sign(david.x - L.x) || L.facing;
      if (dist0 < TUNE.LION_TAUNT_RANGE) setLion("release");
    } else if (L.state === "release") {    // sets the lamb down to face David
      L.vx = 0;
      if (animDone("lion_set_lamb_down", L.t)) {
        Object.assign(takenLamb, { active: true, x: L.x + L.facing * 22 * SCALE * 1.24, y: L.y, vx: -L.facing * 260, vy: 0, facing: -L.facing, t: 0 });
        L.awake = true; setLion("intro"); sfx("lion_roar", L.x, 1);   // lamb down: he roars at David
        toast("It let the lamb go! Watch for its roar, then dodge the pounce. Hit it while it's dazed.");
      }
    }
    L.vy = Math.min(TUNE.MAX_FALL, (L.vy || 0) + TUNE.GRAVITY * dt);
    collideBody(L, 100, 60, dt);
    return;
  }
  const dx = david.x - L.x, dist = Math.abs(dx);
  L.pounceCool = Math.max(0, L.pounceCool - dt);
  switch (L.state) {
    case "intro": if (L.t > 1.6) setLion("prowl"); break;
    case "prowl": case "run": {
      L.facing = Math.sign(dx) || L.facing;
      const fast = dist > 520;
      setLion(fast ? "run" : "prowl");
      L.vx = L.facing * (fast ? TUNE.LION_RUN : TUNE.LION_PROWL);
      if (dist < TUNE.LION_POUNCE_RANGE && L.pounceCool <= 0) { L.vx = 0; setLion("tell"); sfx("lion_roar", L.x, 1); }
      break;
    }
    case "tell":   // the roar: this is the player's warning
      L.vx = 0; L.facing = Math.sign(dx) || L.facing;
      if (L.t > TUNE.LION_TELL) {
        setLion("pounce");
        L.vx = L.facing * Math.max(320, Math.min(760, dist * 1.5));
        L.vy = -TUNE.LION_JUMP; L.onGround = false;
      }
      break;
    case "pounce":
      if (L.onGround && L.t > 0.15) { L.vx = 0; setLion("dazed"); }
      break;
    case "dazed":
      L.vx = 0;
      if (L.t > TUNE.LION_DAZED) { setLion("prowl"); L.pounceCool = 0.9; }
      break;
  }
  // physics
  L.vy = Math.min(TUNE.MAX_FALL, (L.vy || 0) + TUNE.GRAVITY * dt);
  collideBody(L, 100, 60, dt);
  // touching the lion hurts, unless it's dazed
  if (L.state !== "dazed" && L.state !== "intro") {
    const b = lionBox();
    if (david.x + BODY_W / 2 > b.x0 && david.x - BODY_W / 2 < b.x1 && david.y > b.y0 && david.y - david.h < b.y1) hurtDavid(L.x);
  }
}
function updateTakenLamb(dt) {
  const k = takenLamb; if (!k.active) return;
  k.t += dt;
  const beaten = lion && lion.state === "defeated";
  if (beaten && !k.follow && !k.hidden) {
    k.vx *= 0.8;                                             // the lamb stands still and waits
    if (Math.abs(k.vx) < 5 && k.onGround) k.facing = Math.sign(david.x - k.x) || k.facing;
    if (lion.t > TUNE.RESCUE_DELAY && david.onGround && david.deadT <= 0 &&
        david.state !== "toLamb" && david.state !== "rescue") {
      david.rescueSide = Math.sign(k.x - david.x) || 1;      // come at it from whichever side he's on
      david.harp = false; david.charging = false; david.throwT = -1; david.carrying = false;
      setState("toLamb");
    }
  }
  if (k.hidden) return;
  if (k.t > 1.4 && !k.follow) k.vx *= 0.9;
  collideBody(k, 30, 40, dt);
  k.vy = Math.min(TUNE.MAX_FALL, (k.vy || 0) + TUNE.GRAVITY * dt);
}
function drawTakenLamb(camX) {
  const k = takenLamb; if (!k.active || k.hidden) return;
  const moving = Math.abs(k.vx) > 20;
  drawSprite("lamb_run", moving ? frameOf("lamb_run", k.t) : 2, k.x - camX, k.y, k.facing);
}
// ---------------------------------------------------------------------------
// The end of the stage: the sheepfold gate (our flagpole). Touch the post (higher = more olives),
// the gate swings open and the flock trots home, counted in one by one; the rescued lamb comes last.
// ---------------------------------------------------------------------------
const SHEEP_ART = {
  sheep:      { run: "sheep_trot",     walk: "sheep_walk",      stand: "sheep_stand",      graze: "sheep_graze" },
  sheepblack: { run: "sheepblack_run", walk: "sheepblack_walk", stand: "sheepblack_stand", graze: "sheepblack_graze" },
  lamb:       { run: "lamb_hop",       walk: "lamb_walk",       stand: "lamb_stand",       graze: "lamb_graze" },
  lambblack:  { run: "lambblack_leap", walk: "lambblack_walk",  stand: "lambblack_stand",  graze: "lambblack_stand" },
  ram:        { run: "ram_walk",       walk: "ram_walk",        stand: "ram_stand",        graze: "ram_graze" },
  rescued:    { run: "lamb_run",       walk: "lamb_run",        stand: null,               graze: null },
};

// ---------------------------------------------------------------------------
// Lost sheep. Reach one (or call it with the harp) and it joins the line behind David, walking his exact path,
// so it hops where he hopped. Sit and play at a campfire and the line settles round the fire to graze.
// If David dies they wait for him at the campfire. At the gate, the ones you brought are counted in.
// ---------------------------------------------------------------------------
const line = [];          // the sheep following David, in order
const trail = [];         // David's footsteps, newest last
let rescuedLamb = false;
function newSheep(o) {
  return Object.assign(o, { x: o.hx, y: o.hy, vx: 0, vy: 0, onGround: true, state: "lost", t: Math.random() * 3, facing: -1,
    freed: o.how !== "thorns" && o.how !== "cast", upright: false, stillT: 9, bleatT: Math.random() * 4, hinted: false, moved: 0 });
}
function resetAllSheep() {
  for (let i = lost.length - 1; i >= 0; i--) if (lost[i].how === "rescued") lost.splice(i, 1);
  for (const sh of lost) newSheep(sh);
  line.length = 0; trail.length = 0; rescuedLamb = false;
}
resetAllSheep();
const lostCount = () => lost.filter(sh => !sh.one && sh.how !== "rescued").length;
const foundCount = () => line.filter(sh => !sh.one && sh.how !== "rescued").length;
function joinLine(sh, quiet) {
  if (!lost.includes(sh)) lost.push(sh);
  sh.state = "follow"; sh.freed = true; sh.fire = null; line.push(sh);
  baa(sh.x, 0.9);
  if (quiet) return;
  chime(line.length + 2);
  if (sh.one) toast("You found The One! \"Rejoice with me; I have found my lost sheep\" (Luke 15:6)");
  else toast(`Found a lost sheep! (${foundCount()} of ${lostCount()})`);
}
// a point on David's path, this far behind him (null if he hasn't walked that far yet). While he's in the air
// it measures from where he took off. A long gap between footsteps was a jump, so the point hops along an arc.
function trailAt(dist) {
  let i = trail.length - 1, px, py;
  if (david.onGround && david.deadT <= 0) { px = david.x; py = david.y; }
  else { if (i < 0) return null; px = trail[i].x; py = trail[i].y; i--; }
  let left = dist;
  for (; i >= 0; i--) {
    const q = trail[i], seg = Math.hypot(px - q.x, py - q.y);
    if (seg >= left) {
      if (seg > 26 && Math.abs(david.vx) < 20) return { x: px, y: py, hop: false };   // David stopped: never wait mid-hop, land at the far side
      const f = left / seg, hop = seg > 26 ? Math.min(150, seg * 0.45 + Math.abs(py - q.y) * 0.4) * Math.sin(Math.PI * f) : 0;
      return { x: px + (q.x - px) * f, y: py + (q.y - py) * f - hop, hop: hop > 1 };
    }
    left -= seg; px = q.x; py = q.y;
  }
  return null;
}
function sheepToCheckpoint() {   // after a fall, the lamb you rescued is waiting at the campfire (the others are already there)
  trail.length = 0;
  line.filter(sh => sh.how === "rescued").forEach((sh, i) => {
    const back = checkpoint.x - 110 - i * TUNE.SHEEP_GAP * 0.8;      // behind him, or just ahead if he's at the very start
    sh.x = back > 40 ? back : checkpoint.x + 90 + i * TUNE.SHEEP_GAP * 0.8; sh.y = checkpoint.y; sh.vy = 0; sh.stillT = 9; sh.facing = 1;
  });
}
const REST_SPOTS = [-120, 120, -175, 175, -230, 230, -285, 285];
function moveToward(sh, tx, ty, speed, dt) {
  const dx = tx - sh.x, dy = ty - sh.y, dist = Math.hypot(dx, dy);
  const step = Math.min(dist, speed * dt);
  if (dist > 0.5) { sh.x += dx / dist * step; sh.y += dy / dist * step; }
  if (Math.abs(dx) > 2) sh.facing = Math.sign(dx);
  sh.moved = step / Math.max(dt, 1e-4);
  sh.stillT = sh.moved > 25 ? 0 : sh.stillT + dt;
}
function groundAhead(sh, dir) {   // is there something to stand on just ahead (not a pit)?
  const c = Math.floor((sh.x + dir * 26) / T);
  for (let r = Math.floor((sh.y - 1) / T) + 1; r < ROWS; r++) if (isSolid(c, r) || isOneway(c, r)) return true;
  return false;
}
function updateSheep(dt) {
  const d = david;
  // record David's footsteps
  const last = trail[trail.length - 1];
  // only where he's standing on something (not in the air, not dropping into a pit), so followers never hang in mid-air
  if (d.deadT <= 0 && d.onGround && d.y <= GR * T + 6 && (!last || Math.hypot(d.x - last.x, d.y - last.y) > 6)) { trail.push({ x: d.x, y: d.y }); if (trail.length > 800) trail.shift(); }
  const fire = d.state === "harp" ? fires.find(f => Math.abs(f.x - d.x) < 260 && Math.abs(f.y - d.y) < 80) : null;
  for (const sh of lost) updateLook(sh, dt);
  // found sheep head for the campfire; the rescued lamb follows David
  let fi = 0;
  line.forEach(sh => {
    sh.t += dt;
    if (finish.active) return;
    if (sh.how !== "rescued") { updateFireSheep(sh, dt); return; }
    const i = fi++;
    if (d.deadT > 0) return;                    // David fell: it waits where it is, then at the campfire
    if (fire) {                                 // settle round the campfire while David plays
      const spot = REST_SPOTS[i % REST_SPOTS.length] * (1 + Math.floor(i / REST_SPOTS.length) * 0.25);
      moveToward(sh, fire.x + spot, fire.y, TUNE.WALK_SPEED * 0.7, dt);
      if (sh.stillT > 0.2) sh.facing = Math.sign(fire.x - sh.x) || 1;
      return;
    }
    const tgt = trailAt(TUNE.LAMB_GAP + TUNE.SHEEP_GAP * (i + 1));
    if (!tgt) { sh.moved = 0; sh.stillT += dt; return; }
    const far = Math.hypot(tgt.x - sh.x, tgt.y - sh.y);
    moveToward(sh, tgt.x, tgt.y, Math.min(900, Math.max(TUNE.WALK_SPEED * 1.15, far * 5)), dt);
  });
  // lost sheep
  for (const sh of lost) {
    if (line.includes(sh)) continue;   // found: at the campfire, or following
    sh.t += dt; const b0 = sh.bleatT; sh.bleatT -= dt; if (sh.bleatT < -1) sh.bleatT = 3 + Math.random() * 2;
    if (b0 >= 0 && sh.bleatT < 0) baa(sh.x, sh.how === "thorns" || sh.how === "cast" ? 0.9 : 0.6);
    const dx = d.x - sh.x, dy = d.y - sh.y, near = Math.abs(dx) < 56 && Math.abs(dy) < 80;
    if (sh.state === "helped") continue;   // David is lifting it up (updateLiftSheep)
    if (!sh.freed) {
      if (sh.how === "cast" && Math.abs(dx) < 80 && Math.abs(dy) < 80) {
        if (!sh.hinted) { sh.hinted = true; toast("This sheep is cast, stuck on its back. Press Down to roll it back up."); }
        if (pressed("down") && d.onGround && !inCutscene()) {
          if (d.carrying || lamb.carried) { d.carrying = false; lamb.carried = false; lamb.x = d.x - d.facing * 50; lamb.y = d.y; }   // Down also means "pick up the lamb"
          sh.state = "helped"; sh.upright = false; d.helpSheep = sh; d.helpSide = Math.sign(sh.x - d.x) || d.facing;
          d.liftPhase = 0; d.harp = false; d.charging = false; d.throwT = -1; setState("liftSheep");
        }
      }
      if (sh.how === "thorns" && Math.abs(dx) < 140 && Math.abs(dy) < 80 && !sh.hinted) {
        sh.hinted = true; toast("Its wool is caught in the thorns. Sling the bush to cut it free!");
      }
      if (sh.how === "thorns" && Math.abs(dx) < 38 && Math.abs(dy) < 50) hurtDavid(sh.x);   // thorns hurt
      continue;
    }
    if (near && d.deadT <= 0) { joinLine(sh); continue; }
    // the harp: lost sheep within hearing come to David (The One has to be fetched)
    if (sh.state === "lost" && !sh.one && d.state === "harp" && Math.abs(dx) < TUNE.HARP_CALL_RANGE && Math.abs(dy) < 360) {
      sh.state = "called";
      if (!sh.hinted) { sh.hinted = true; toast("A sheep heard the harp and is coming!"); }
    }
    if (sh.state === "called") {
      const dir = Math.sign(dx) || 1;
      sh.facing = dir;
      sh.vx = sh.onGround && !groundAhead(sh, dir) ? 0 : dir * TUNE.SHEEP_CALL_SPEED;   // won't walk into a pit
      const x0 = sh.x;
      sh.vy = Math.min(TUNE.MAX_FALL, sh.vy + TUNE.GRAVITY * dt);
      collideBody(sh, 30, 40, dt);
      if (sh.onGround && sh.vx && Math.abs(sh.x - x0) < 0.3 * Math.abs(sh.vx) * dt) sh.vy = -760;   // hop up a step
      sh.moved = Math.abs(sh.x - x0) / Math.max(dt, 1e-4);
      if (Math.abs(dx) < 75 && Math.abs(dy) < 90) joinLine(sh);
    }
  }
}
// a found sheep trots off to the nearest campfire and grazes there (safe from whatever David is up to).
// If the walk is off-screen, blocked or too long, it's simply there.
// launch speed to clear the wall or rock just ahead of a sheep (a little over its height)
function hopFor(sh, dir) {
  const c = Math.floor((sh.x + dir * 30) / T);
  let r = Math.floor((sh.y - 1) / T), rise = 0;
  while (r >= 0 && isSolid(c, r) && rise < 8 * T) { rise += T; r--; }
  rise = Math.max(rise, T) + 28;
  return Math.sqrt(2 * TUNE.GRAVITY * rise);
}
function nearestFire(x) {
  let best = null;
  for (const f of fires) if (!best || Math.abs(f.x - x) < Math.abs(best.x - x)) best = f;
  return best || { x: spawn.x + 2 * T, y: spawn.y };
}
function updateFireSheep(sh, dt) {
  if (!sh.fire) {
    sh.fire = nearestFire(sh.x);
    const k = line.filter(o => o !== sh && o.fire === sh.fire).length;
    sh.spot = REST_SPOTS[k % REST_SPOTS.length] * (1 + Math.floor(k / REST_SPOTS.length) * 0.25);
    sh.state = "toFire"; sh.walkT = 0; sh.stuckT = 0;
  }
  if (sh.state === "atFire") { sh.moved = 0; sh.stillT += dt; return; }
  sh.walkT += dt;
  const tx = sh.fire.x + sh.spot, dir = Math.sign(tx - sh.x) || 1;
  const onScreen = sh.x > camX - 60 && sh.x < camX + W + 60;
  if (Math.abs(tx - sh.x) < 8 || !onScreen || sh.walkT > 10 || sh.y > GR * T + 60) {
    Object.assign(sh, { x: tx, y: sh.fire.y, vx: 0, vy: 0, state: "atFire", stillT: 9, t: Math.random() * 3, facing: Math.sign(sh.fire.x - tx) || 1 });
    return;
  }
  sh.facing = dir;
  sh.vx = dir * TUNE.RUN_SPEED * 0.85;                        // sprint
  if (sh.onGround && !groundAhead(sh, dir)) sh.vy = -980;      // leap the pit
  const x0 = sh.x;
  sh.vy = Math.min(TUNE.MAX_FALL, sh.vy + TUNE.GRAVITY * dt);
  collideBody(sh, 30, 40, dt);
  if (sh.onGround && Math.abs(sh.x - x0) < 0.3 * TUNE.RUN_SPEED * 0.85 * dt) {   // blocked (collideBody zeroes vx, so use the intended speed)
    sh.vy = -hopFor(sh, dir);                                    // jump just high enough to clear what's in front
    sh.x -= dir * 10;                                            // step back off the face so it rises clear of it
  }
  sh.moved = Math.abs(sh.x - x0) / Math.max(dt, 1e-4); sh.stillT = 0;
}
// a stone into the thorn bush cuts the sheep free
function stoneHitsThorns(st) {
  for (const sh of lost) if (sh.how === "thorns" && !sh.freed && Math.abs(st.x - sh.x) < 46 && st.y > sh.y - 80 && st.y < sh.y + 4) {
    sh.freed = true; sh.state = "lost";
    for (let k = 0; k < 14; k++) bits.push({ x: sh.x, y: sh.y - 30, vx: (Math.random() - 0.5) * 520, vy: -Math.random() * 520, life: 0.9, color: k % 2 ? "#5a6b2a" : "#7a5a32" });
    toast("The thorns are cut away. Go and get it!");
    return true;
  }
  return false;
}
// grazing: these first frames of each graze sheet are head-down eating; the rest raise the head
const GRAZE_EAT = { lamb_graze: 3, sheep_graze: 3, sheepblack_graze: 2, ram_graze: 7 };
function updateLook(sh, dt) {   // a grazing sheep looks up while David is close ("hey, how you doing?")
  const near = Math.abs(david.x - sh.x) < 170 && Math.abs(david.y - sh.y) < 120;
  sh.look = Math.max(0, Math.min(1, (sh.look || 0) + (near ? 2.5 : -2) * dt));
}
function sheepFrame(sh) {   // which sheet and frame to draw for a sheep right now
  const art = SHEEP_ART[sh.kind];
  if (sh.moved > 25) { const nm = sh.moved > TUNE.WALK_SPEED * 1.05 ? art.run : art.walk; return [nm, frameOf(nm, sh.t * Math.max(0.7, sh.moved / 260))]; }
  const idle = sh.stillT > 1.5 || sh.state === "lost" ? (art.graze || art.stand) : art.stand;
  if (!idle) return [art.run, 2];
  const k = GRAZE_EAT[idle];
  if (k !== undefined) {
    const last = SPR[idle].frames - 1;
    if ((sh.look || 0) > 0.01) return [idle, Math.min(last, k + Math.round(sh.look * (last - k)))];
    const n = Math.floor(sh.t * 1000 / 260) % (2 * k || 1);       // chewing: a slow nod among the head-down frames
    return [idle, n <= k ? n : 2 * k - n];
  }
  return [idle, frameOf(idle, sh.t)];
}
// the thorn bush round the tangled sheep: one behind it, and a low one over its legs, so its head and back peek out
let THORN_BUSH_X = 8, THORN_BUSH_SIZE = 0.42, THORN_FRONT = true, THORN_FRONT_X = 2, THORN_FRONT_SIZE = 0.22;
function drawSheepOne(sh, camX) {
  const x = sh.x - camX, y = sh.y;
  if (x < -150 || x > W + 150) return;
  if (sh.one || sh.how === "rescued") goldGlow(x, y, sh.t);
  if (sh.how === "cast" && sh.state === "lost") {          // on its back, legs kicking (Glen's clip)
    drawSprite("sheep_cast", frameOf("sheep_cast", sh.t), x, y, sh.facing);
  } else if (sh.how === "cast" && sh.state === "helped") {  // a bit of sleight of hand: on its back, then up while he's bent over it
    if (sh.upright) drawSprite(SHEEP_ART[sh.kind].stand, 0, x, y, sh.facing);
    else drawSprite("sheep_cast", frameOf("sheep_cast", sh.t), x, y, sh.facing);
  } else if (sh.how === "thorns" && !sh.freed) {           // tangled in the thorns, peeking out of the bush
    drawItem("thorn_bush", x + sh.facing * THORN_BUSH_X, y + 8, THORN_BUSH_SIZE);
    drawSprite("sheep_thorns", frameOf("sheep_thorns", sh.t), x, y, sh.facing);
    if (THORN_FRONT) drawItem("thorn_bush", x - sh.facing * THORN_FRONT_X, y + 10, THORN_FRONT_SIZE);
  } else {
    const [nm, i] = sheepFrame(sh);
    drawSprite(nm, i, x, y, sh.facing);
  }
  if (sh.one || sh.how === "rescued") sparkle(x, y, sh.t);
  if (!line.includes(sh) && sh.state !== "helped" && sh.bleatT < 0 && sh.bleatT > -1) {   // "baa!" now and then, so you can find them
    ctx.save(); ctx.globalAlpha = Math.min(1, -sh.bleatT * 4, (1 + sh.bleatT) * 4);
    ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.roundRect(x - 26, y - 84, 52, 24, 10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 4, y - 61); ctx.lineTo(x + 4, y - 61); ctx.lineTo(x, y - 54); ctx.fill();
    ctx.fillStyle = "#4a3a2a"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.fillText("baa!", x, y - 67);
    ctx.restore(); ctx.textAlign = "left";
  }
}
function goldGlow(x, y, t) {   // a soft golden glow behind The One and the rescued lamb
  const g = ctx.createRadialGradient(x, y - 20, 3, x, y - 20, 44);
  g.addColorStop(0, `rgba(255,200,60,${0.55 + 0.15 * Math.sin(t * 3)})`); g.addColorStop(1, "rgba(255,214,90,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y - 20, 46, 34, 0, 0, Math.PI * 2); ctx.fill();
}
function sparkle(x, y, t) {   // twinkling gold stars over them
  ctx.save(); ctx.fillStyle = "#ffd75e"; ctx.shadowColor = "#ffbf2e"; ctx.shadowBlur = 8;
  for (let k = 0; k < 3; k++) {
    const sz = Math.max(0, Math.sin(t * 1.8 + k * 2.1)) * 7; if (sz < 0.6) continue;
    const sx = x + [-24, 20, 2][k], sy = y - [40, 34, 54][k];
    ctx.beginPath(); ctx.moveTo(sx, sy - sz); ctx.lineTo(sx + sz * 0.25, sy - sz * 0.25); ctx.lineTo(sx + sz, sy); ctx.lineTo(sx + sz * 0.25, sy + sz * 0.25);
    ctx.lineTo(sx, sy + sz); ctx.lineTo(sx - sz * 0.25, sy + sz * 0.25); ctx.lineTo(sx - sz, sy); ctx.lineTo(sx - sz * 0.25, sy - sz * 0.25); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function drawSheep(camX) {
  if (finish.active) { for (const sh of lost) if (!line.includes(sh)) drawSheepOne(sh, camX); return; }
  for (const sh of lost) drawSheepOne(sh, camX);
}
function drawSheepCount() {
  if (!lostCount()) return;
  hudIcon("sheep", HUD_X - 4, 194, 36);
  hudText(`${foundCount()}/${lostCount()}`, HUD_X + 40, 220);
  if (lost.some(sh => sh.one)) hudIcon("sheep_one", HUD_X + 92, 190, 42, line.some(sh => sh.one) ? 1 : 0.3);
}
const finish = { active: false, phase: "", t: 0, gateOpen: 0, bonus: 0, count: 0, flock: [], blocked: 0 };
const postX = () => fold.postC * T + T / 2;
function gateOlive() {   // the golden olive on the gatepost: f = 0 at the bottom (head height) up to 1 at the top
  const low = GR * T - 62, high = GR * T - TUNE.GATE_POST_TILES * T + 4;
  const k = (performance.now() / 1000 / TUNE.GATE_OLIVE_TRIP) % 2, f = k < 1 ? k : 2 - k;
  return { x: postX(), y: low + (high - low) * f, f };
}
let chimeCtx = null;
function chime(k) {   // a little bell for each sheep counted in
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (chimeCtx.state === "suspended") chimeCtx.resume();
    const t0 = chimeCtx.currentTime, o = chimeCtx.createOscillator(), g = chimeCtx.createGain();
    o.type = "sine"; o.frequency.value = 660 * Math.pow(2, [0, 2, 4, 7, 9, 12, 14, 16][k % 8] / 12);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(g).connect(chimeCtx.destination); o.start(t0); o.stop(t0 + 0.65);
  } catch (e) {}
}
function updateFinish(dt) {
  if (!fold) return;
  const px = postX(), d = david;
  if (!finish.active) {
    if (d.x + BODY_W / 2 < px - 6 || d.deadT > 0) return;
    if (lion && lion.state !== "defeated") {          // the lamb first!
      d.x = px - 6 - BODY_W / 2; d.vx = Math.min(0, d.vx);
      if (finish.blocked <= 0) toast("Not without the lamb the lion took!");
      finish.blocked = 3; return;
    }
    // Super Mario World's goal tape: catch the golden olive as it slides up and down the post. Higher = more.
    const go = gateOlive(), caught = Math.abs(go.x - d.x) < BODY_W / 2 + 14 && go.y > d.y - d.h - 14 && go.y < d.y + 6;
    if (!caught && d.x < px) return;                    // not there yet (he can still snatch it just before the post)
    finish.caught = caught; finish.bonus = 0; finish.gold = false;
    if (caught) {
      finish.bonus = TUNE.GATE_BONUS_MIN + Math.round(go.f * (TUNE.GATE_BONUS_MAX - TUNE.GATE_BONUS_MIN));
      finish.gold = go.f >= TUNE.GATE_GOLD_AT;
      for (let i = 0; i < finish.bonus; i++) {
        d.olives++;
        if (d.olives >= TUNE.OLIVES_PER_LIFE) { d.olives -= TUNE.OLIVES_PER_LIFE; d.lives++; }
      }
      finish.pop = { x: px, y: go.y, t: 0, text: `+${finish.bonus}` };
      for (let k = 0; k < 14; k++) bits.push({ x: go.x, y: go.y, vx: (Math.random() - 0.5) * 380, vy: -Math.random() * 380, life: 0.8, color: k % 2 ? "#ffd84a" : "#fff2b0" });
      if (finish.gold) { d.lives++; sfx("extra_life"); toast(`Caught it at the top! +${finish.bonus} olives and +1 life`); }
      else { sfx("olive_pickup", undefined, 0.8, 0.8); toast(`Caught the golden olive: +${finish.bonus} olives`); }
    } else {
      finish.pop = { x: px, y: d.y - d.h, t: 0, text: "Missed!" };
      toast("Home! You missed the golden olive. Time your jump to catch it high!");
    }
    Object.assign(finish, { active: true, phase: "land", t: 0, count: 0 });
    d.harp = false; d.charging = false; d.throwT = -1; d.carrying = false; d.inv = 0; d.vx = 0;
    setState("finish");
    // the sheep you brought, in through the gate: the rescued lamb, then The One, go last
    const order = line.filter(sh => !sh.one && sh.how !== "rescued").concat(line.filter(sh => sh.how === "rescued"), line.filter(sh => sh.one));
    const n = Math.max(1, order.length);
    finish.flock = order.map((sh, i) => ({ kind: sh.kind, sparkle: sh.one || sh.how === "rescued", i,
      x: sh.how === "rescued" ? Math.min(sh.x, px - 2 * T) : camX - 120 - i * 50, y: GR * T,
      t: Math.random(), delay: 1.0 + i * 0.55, slot: px + 3.8 * T + ((i * 5) % n) * (10 * T / n), state: "wait", counted: false,
      depth: (i % 3) * 5, idleName: [SHEEP_ART[sh.kind].graze, SHEEP_ART[sh.kind].stand][i % 2] }));
    finish.found = foundCount(); finish.total = lostCount(); finish.one = line.some(sh => sh.one);
    if (finish.total && finish.found === finish.total) { d.lives++; sfx("extra_life"); toast(`All ${finish.total} lost sheep found: +1 life!`); }
    return;
  }
  finish.blocked = Math.max(0, finish.blocked - dt);
  finish.t += dt;
  const allIn = finish.flock.every(s => s.state === "in");
  if (finish.phase === "land" && d.onGround) { finish.phase = "open"; finish.t = 0; if (finish.flock.length > 1) sfx("flock_baa", undefined, 0.7); }
  if (finish.phase === "open") { finish.gateOpen = Math.min(1, finish.t / 0.7); if (allIn && finish.t > 1) { finish.phase = "close"; finish.t = 0; } }
  if (finish.phase === "close") { finish.gateOpen = Math.max(0, 1 - finish.t / 0.7); if (finish.t > 1.2) { finish.phase = "clear"; finish.t = 0; } }
  if (finish.phase === "clear" && finish.t > 1 && (pressed("a") || pressed("b") || pressed("start"))) location.reload();
  if (finish.phase === "open" || finish.phase === "close") for (const s of finish.flock) {
    s.t += dt;
    if (s.state === "wait" && finish.phase === "open" && finish.t > s.delay) s.state = "run";
    if (s.state === "run") {
      s.x += TUNE.FLOCK_SPEED * (s.kind === "ram" ? 0.8 : 1) * dt;
      if (!s.counted && s.x > px) { s.counted = true; finish.count++; chime(finish.count - 1); }
      if (s.x >= s.slot) { s.x = s.slot; s.state = "in"; s.t = Math.random() * 2; }
    }
  }
}
// cast sheep: David steps up, bends down to it, and as he straightens up it's back on its feet
const CAST_REACH = 58;                              // how far in front of him his hands are at the bottom of the crouch (sheet px)
const LIFT_DOWN = 0.45, LIFT_HOLD = 0.3, LIFT_UP = 0.45;
function updateLiftSheep(d, dt) {
  const sh = d.helpSheep, tx = sh.x - d.helpSide * CAST_REACH * SCALE;
  if (!d.liftPhase) {                                // walk into place
    if (autoWalk(d, tx, dt) || d.t > 3) { d.x = tx; d.facing = d.helpSide; d.vx = 0; d.liftPhase = 1; d.t = 0; }
    return;
  }
  d.vx = 0; d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt); collideBody(d, BODY_W, d.h, dt);
  if (!sh.upright && d.t > LIFT_DOWN + 0.05) {       // the flip happens out of sight, behind his arms
    sh.upright = true; sh.facing = d.helpSide; sh.stillT = 0;
    for (let k = 0; k < 10; k++) bits.push({ x: sh.x, y: sh.y - 6, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 220, life: 0.5, color: "#d8c9a4" });
  }
  if (d.t > LIFT_DOWN + LIFT_HOLD + LIFT_UP) { d.liftPhase = 0; sh.freed = true; joinLine(sh); setState("idle"); }
}
function updateFinishDavid(d, dt) {   // drop down, step back beside the post, turn to watch them come
  d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt);
  if (finish.phase === "land") { d.vx = 0; collideBody(d, BODY_W, d.h, dt); return; }
  if (autoWalk(d, postX() - 1.3 * T, dt)) d.facing = -1;
}
// a wooden post: (x, bottom) at the foot, w wide, h tall
function woodPost(x, bottom, w, h) {
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, "#4a2f18"); g.addColorStop(0.35, "#8a6038"); g.addColorStop(0.7, "#6e4a2a"); g.addColorStop(1, "#3c2512");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2, bottom - h, w, h + 6, [w / 2, w / 2, 2, 2]); ctx.fill();
  ctx.strokeStyle = "rgba(40,22,10,0.45)"; ctx.lineWidth = 1.5;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - w / 4 + k * w / 8, bottom - h + 10 + k * 7); ctx.lineTo(x - w / 4 + k * w / 8 + (k % 2 ? 2 : -2), bottom - 4); ctx.stroke(); }
}
function drawFold(camX) {
  if (!fold) return;
  const px = postX() - camX, by = GR * T;
  if (px < -400 || px > W + 600) return;
  ctx.save();
  // the far gatepost the gate latches to
  const gl = 3 * T;
  woodPost(px + gl, by, 12, 2.6 * T);
  // the gate: three rails and a brace, hinged on the tall post; it swings open toward us
  ctx.save(); ctx.translate(px, by); ctx.scale(1 - 0.82 * finish.gateOpen, 1);
  ctx.fillStyle = "#7a5432"; ctx.strokeStyle = "#3c2512"; ctx.lineWidth = 2;
  for (const yy of [-2.1 * T, -1.35 * T, -0.6 * T]) { ctx.beginPath(); ctx.roundRect(4, yy, gl - 8, 9, 3); ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(10, -0.6 * T + 6); ctx.lineTo(gl - 14, -2.1 * T + 4); ctx.lineWidth = 7; ctx.strokeStyle = "#6a4628"; ctx.stroke();
  ctx.fillStyle = "#6a4628"; ctx.fillRect(gl - 16, -2.25 * T, 9, 2.25 * T - 4);
  ctx.restore();
  // the tall gatepost (touch it as high as you can)
  const ph = TUNE.GATE_POST_TILES * T, low = by - STAND_H;   // David's head when he walks into it
  woodPost(px, by, 18, ph);
  // carved notches up the post, each with an olive that grows bigger toward the top: higher pays more
  for (let k = 1; k <= 4; k++) {
    const y = low - (low - (by - ph)) * k / 5;
    ctx.strokeStyle = "rgba(40,24,10,0.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px - 9, y); ctx.lineTo(px + 9, y); ctx.stroke();
    ctx.strokeStyle = "rgba(200,160,110,0.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px - 9, y + 2.5); ctx.lineTo(px + 9, y + 2.5); ctx.stroke();
    drawOlive(px - 20, y - 2, "green", 0.45 + k * 0.17);
  }
  ctx.fillStyle = "#c9a227"; ctx.beginPath(); ctx.arc(px, by - ph - 4, 9, 0, Math.PI * 2); ctx.fill();   // a brass knob on top
  if (!(finish.active && finish.caught)) { const go = gateOlive(); drawOlive(px, go.y, "golden", 1.6); }   // the prize, sliding up and down
  ctx.restore();
  // the "+N" where David touched it, floating up
  const pop = finish.pop;
  if (finish.active && pop && pop.t < 1.6) {
    pop.t += 1 / 60;
    ctx.save(); ctx.globalAlpha = Math.min(1, 2 * (1.6 - pop.t)); ctx.textAlign = "left";
    ctx.font = "bold 34px sans-serif"; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(40,24,10,0.9)";
    const ty = pop.y - pop.t * 40, tx = pop.x - camX + 22;
    ctx.strokeText(pop.text, tx, ty); ctx.fillStyle = !finish.caught ? "#f0d0c0" : finish.gold ? "#ffd84a" : "#eaf5b0"; ctx.fillText(pop.text, tx, ty);
    if (finish.caught) drawOlive(tx + ctx.measureText(pop.text).width + 16, ty - 11, "golden", 1.3);
    ctx.restore();
  }
}
function drawFlock(camX) {
  if (!finish.active) return;
  const list = finish.flock.slice().sort((a, b) => b.depth - a.depth);
  for (const s of list) {
    const art = SHEEP_ART[s.kind], x = s.x - camX, y = s.y - s.depth;
    if (s.sparkle) goldGlow(x, y, s.t);
    if (s.state === "run") drawSprite(art.run, frameOf(art.run, s.t), x, y, 1);
    else if (s.idleName) drawSprite(s.idleName, frameOf(s.idleName, s.t), x, y, s.state === "wait" ? 1 : 1);
    else drawSprite(art.run, 2, x, y, 1);
    if (s.sparkle) sparkle(x, y, s.t);
  }
}
function drawFinishBanner() {
  if (!finish.active) return;
  if (finish.count > 0 && finish.phase !== "clear") {   // the running tally
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.beginPath(); ctx.roundRect(W / 2 - 120, 54, 240, 56, 12); ctx.fill();
    hudIcon("sheep", W / 2 - 108, 58, 48);
    hudText(`Sheep home: ${finish.count}`, W / 2 - 52, 92, 24);
  }
  if (finish.phase !== "clear") return;
  const a = Math.min(1, finish.t * 2);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = "rgba(20,12,4,0.72)"; ctx.beginPath(); ctx.roundRect(W / 2 - 330, 150, 660, 250, 18); ctx.fill();
  ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 44px sans-serif";
  ctx.fillText("Stage 1-1 clear!", W / 2, 215);
  ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif";
  ctx.fillText(`Lost sheep found: ${finish.found} of ${finish.total}${finish.found === finish.total && finish.total ? "  (+1 life!)" : ""}`, W / 2 + 20, 262);
  hudIcon("sheep", W / 2 - 200, 234, 38);
  ctx.fillText(finish.one ? "The One: found!" : "The One: still out there...", W / 2, 296);
  ctx.fillText(!finish.caught ? "Golden olive: missed" : finish.gold ? `Golden olive caught at the top: +${finish.bonus} olives, +1 life!` : `Golden olive: +${finish.bonus} olives`, W / 2, 330);
  if (!finish.gold) { ctx.fillStyle = "#ffd84a"; ctx.font = "18px sans-serif"; ctx.fillText("Next time: catch it near the top of the post (the very top = +1 life)", W / 2, 352); }
  ctx.fillStyle = "#ccc"; ctx.font = "18px sans-serif";
  if (finish.t > 1) ctx.fillText("Press A to play again", W / 2, 385);
  ctx.restore();
}
// ---------------------------------------------------------------------------
// The last stone. When a stone is about to land the blow that beats a boss, the world slows right down
// so you watch it fly in, the impact lands with a flash and a shake, then everything eases back to normal.
// ---------------------------------------------------------------------------
const stoneHit = (s, vol = 0.7) => sfx("stone_hit", s.x, vol, 0.9 + Math.random() * 0.2);
const FINAL_PEAK = { final_stone: 0.8, final_stone_goliath: 1.7 };   // seconds into each sound where the impact is
const finalBlow = { on: false, phase: "", t: 0, stone: null, snd: null, flash: 0, shake: 0, sound: "final_stone" };
function lionDamage(s) {   // what this stone would do to the lion right now
  if (!lion || !lion.awake || lion.state === "defeated") return 0;
  if (s.power && lion.state !== "dazed") return 2;
  return lion.state === "dazed" ? (s.power ? 3 : s.charged ? 2 : 1) : 0;
}
function watchForFinalStone(s) {
  const dmg = lionDamage(s); if (!dmg || dmg < lion.hp) return;
  if (lion.state === "dazed" && lion.t > TUNE.LION_DAZED - TUNE.FINAL_LEAD - 0.05) return;   // it'll be up before the stone gets there
  const b = lionBox(); let x = s.x, y = s.y, vy = s.vy;
  const g = TUNE.STONE_GRAVITY * (s.power ? 0.08 : s.charged ? 0.45 : 1), step = 1 / 120;
  for (let t = 0; t < TUNE.FINAL_LEAD; t += step) {
    vy += g * step; x += s.vx * step; y += vy * step;
    if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) {
      Object.assign(finalBlow, { on: true, phase: "fly", t: 0, stone: s });
      const lead = TUNE.FINAL_LEAD / TUNE.FINAL_SLOWMO;            // real seconds until it lands
      finalBlow.snd = sfx(finalBlow.sound, undefined, 1);
      if (finalBlow.snd) try { finalBlow.snd.currentTime = Math.max(0, FINAL_PEAK[finalBlow.sound] - lead); } catch (e) {}
      return;
    }
  }
}
function finalHit(s) {
  if (!finalBlow.on) {   // no warning (thrown point-blank): straight to the impact
    finalBlow.snd = sfx(finalBlow.sound, undefined, 1);
    if (finalBlow.snd) try { finalBlow.snd.currentTime = Math.max(0, FINAL_PEAK[finalBlow.sound] - 0.05); } catch (e) {}
  }
  Object.assign(finalBlow, { on: true, phase: "hit", t: 0, stone: null, flash: 1, shake: 1 });
  sfx("lion_defeated", lion.x, 1);   // the wounded cry
  for (let k = 0; k < 16; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 700, vy: -Math.random() * 600, life: 0.9, color: k % 2 ? "#fff2b0" : "#ffffff" });
}
// how fast the game runs this frame (real seconds in, game seconds out)
function gameSpeed(real) {
  const f = finalBlow; if (!f.on) return 1;
  f.t += real; f.flash = Math.max(0, f.flash - real * 1.6); f.shake = Math.max(0, f.shake - real * 1.2);
  if (f.phase === "fly") {
    if (!f.stone || f.stone.life <= 0 || f.t > 3) { f.on = false; if (f.snd) f.snd.pause(); return 1; }   // it missed after all
    return TUNE.FINAL_SLOWMO;
  }
  if (f.t < 0.14) return 0;                                    // the hit freezes for a heartbeat
  if (f.t < 0.14 + TUNE.FINAL_HOLD) return TUNE.FINAL_SLOWMO;
  const k = (f.t - 0.14 - TUNE.FINAL_HOLD) / 0.6;              // then eases back up to full speed
  if (k >= 1) { f.on = false; return 1; }
  return TUNE.FINAL_SLOWMO + (1 - TUNE.FINAL_SLOWMO) * k * k;
}
function drawFinalBlow() {
  const f = finalBlow; if (!f.on && f.flash <= 0) return;
  // letterbox bars slide in while it's slow
  const slow = f.phase === "fly" ? Math.min(1, f.t * 5) : Math.max(0, 1 - Math.max(0, f.t - 0.14 - TUNE.FINAL_HOLD) / 0.6);
  if (f.flash > 0) { ctx.fillStyle = `rgba(255,250,230,${f.flash * 0.75})`; ctx.fillRect(0, 0, W, H); }
  if (f.on && slow > 0) { ctx.fillStyle = "#000"; const bh = 54 * slow; ctx.fillRect(0, 0, W, bh); ctx.fillRect(0, H - bh, W, bh); }
}
function stoneHitsLion(s) {
  if (!lion || lion.state === "defeated" || !lion.awake) return false;   // before the fight it's busy taunting
  const b = lionBox();
  if (s.x < b.x0 || s.x > b.x1 || s.y < b.y0 || s.y > b.y1) return false;
  if (s.power && lion.state !== "dazed") {   // the Power Sling knocks it dazed and hurts it
    lion.hp -= 2; lion.flash = 0.3; lion.vx = 0; setLion("dazed"); if (lion.hp <= 0) finalHit(s); else { stoneHit(s); sfx("lion_hit", lion.x, 0.9); }
    toast("Power Sling! The lion is dazed. Hit it now!");
    if (lion.hp <= 0) { setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and the cobra\" (Psalm 91:13)"); }
  } else if (lion.state === "dazed") {
    lion.hp -= s.power ? 3 : s.charged ? 2 : 1; lion.flash = 0.25;
    if (lion.hp <= 0) finalHit(s); else { stoneHit(s); sfx("lion_hit", lion.x, 0.9, 0.95 + Math.random() * 0.1); }
    if (lion.hp <= 0) {
      setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and the cobra\" (Psalm 91:13)");
    }
  } else { stoneHit(s, 0.6); if (!lion.told) { lion.told = true; toast("Stones bounce off! Wait until it's dazed after a pounce."); } }
  for (let k = 0; k < 6; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 300, life: 0.4, color: lion.state === "dazed" || lion.state === "defeated" ? "#fff2b0" : "#bbb" });
  return true;
}
function drawLion(camX) {
  if (!lion || lion.alpha <= 0) return;
  const L = lion, x = L.x - camX, y = L.y;
  const map = { carry: "lion_prowl_carry_lamb", sitTaunt: "lion_sit_carry_lamb", release: "lion_set_lamb_down", sit: "lion_sit_roar", intro: "lion_sit_roar", prowl: "lion_prowl", run: "lion_run", tell: "lion_roar", pounce: "lion_pounce", dazed: "lion_dazed", defeated: "lion_dazed" };
  const name = map[L.state];
  let i = frameOf(name, L.t);
  if (L.state === "pounce") i = Math.min(SPR.lion_pounce.frames - 1, 3 + Math.floor(L.t / 0.07));
  if (L.state === "tell") i = Math.min(SPR.lion_roar.frames - 1, Math.floor(L.t / TUNE.LION_TELL * 6));
  let filter = "";
  if (L.state === "tell") {   // gold warning glow around the lion's outline (the "counsel" tell)
    const a = (0.55 + 0.45 * Math.sin(L.t * 24)).toFixed(2);
    filter = `drop-shadow(0 0 10px rgba(255,200,60,${a})) drop-shadow(0 0 4px rgba(255,230,140,${a}))`;
  }
  if (L.flash > 0) filter = "brightness(2.2)";
  drawSprite(name, i, x, y, L.facing, 1, L.alpha, filter);
  if (L.awake && L.state !== "defeated") {   // boss health bar
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(W / 2 - 160, 24, 320, 18);
    ctx.fillStyle = "#e0a030"; ctx.fillRect(W / 2 - 158, 26, 316 * Math.max(0, L.hp) / TUNE.LION_HP, 14);
    ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center"; ctx.fillText("THE LION", W / 2, 20); ctx.textAlign = "left";
  }
}

function updateSpecials(dt) {
  for (const sp of specials) {
    if (sp.taken) continue;
    sp.t += dt;
    if (Math.abs(sp.x - david.x) < 34 && david.y > sp.y - 70 && david.y - david.h < sp.y + 10) {
      sp.taken = true; david.specialStones++;
      const found = specials.filter(q => q.taken).length;
      if (!window.firstStoneSeen) {
        window.firstStoneSeen = true;
        toast("A stone of remembrance! Joshua set up twelve stones so Israel would remember (Joshua 4). Keep it, or A + B for a Power Sling.");
      } else toast(`Stone of remembrance! (${found} of ${specials.length} in this stage)  Keep it, or A + B for a Power Sling.`);
      for (let k = 0; k < 16; k++) bits.push({ x: sp.x, y: sp.y - 20, vx: (Math.random() - 0.5) * 420, vy: -Math.random() * 480, life: 0.7, color: "#fff2b0" });
    }
  }
}
function drawSpecialStone(x, y, r, glow) {
  if (glow) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.6); g.addColorStop(0, "rgba(255,225,130,0.75)"); g.addColorStop(1, "rgba(255,200,80,0)");
    ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); ctx.restore();
  }
  ctx.fillStyle = "#e9e1cf"; ctx.beginPath(); ctx.ellipse(x, y, r * 1.15, r * 0.9, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#c7bca4"; ctx.beginPath(); ctx.ellipse(x + r * 0.25, y + r * 0.25, r * 0.8, r * 0.5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fffdf6"; ctx.beginPath(); ctx.ellipse(x - r * 0.4, y - r * 0.35, r * 0.35, r * 0.2, -0.3, 0, Math.PI * 2); ctx.fill();
}
function drawSpecials(camX) {
  for (const sp of specials) if (!sp.taken) drawSpecialStone(sp.x - camX, sp.y - 26 + Math.sin(sp.t * 3) * 4, 11, true);
}
// olives (the coins) fill the oil flask
function updateOlives(dt) {
  for (const o of olives) {
    if (o.taken) continue;
    fall(o, dt); o.t += dt;
    if (Math.abs(o.x - david.x) < 24 && o.y > david.y - david.h - 10 && o.y < david.y + 6) {
      o.taken = true;
      if (o.kind === "golden") { david.lives++; sfx("extra_life"); toast("A golden olive! A whole flask of oil: +1 life"); }
      else {
        david.olives++; sfx("olive_pickup", undefined, 0.45, 0.95 + Math.random() * 0.1);
        if (david.olives >= TUNE.OLIVES_PER_LIFE) { david.olives -= TUNE.OLIVES_PER_LIFE; david.lives++; sfx("extra_life"); toast("The oil flask is full: +1 life!"); }
      }
      for (let k = 0; k < 4; k++) bits.push({ x: o.x, y: o.y, vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 220, life: 0.35, color: o.kind === "golden" ? "#ffd84a" : "#d7e6a0" });
    }
  }
}
function drawOlive(x, y, kind, size = 1) {
  const col = kind === "golden" ? ["#f2c230", "#c8941a"] : kind === "purple" ? ["#5a2f5c", "#3c1d3e"] : ["#8aa83a", "#647d22"];
  if (kind === "golden") {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(x, y, 1, x, y, 20 * size); g.addColorStop(0, "rgba(255,220,90,0.7)"); g.addColorStop(1, "rgba(255,200,60,0)");
    ctx.fillStyle = g; ctx.fillRect(x - 22 * size, y - 22 * size, 44 * size, 44 * size); ctx.restore();
  }
  ctx.fillStyle = col[1]; ctx.beginPath(); ctx.ellipse(x + 1, y + 1, 6 * size, 8 * size, 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = col[0]; ctx.beginPath(); ctx.ellipse(x, y, 6 * size, 8 * size, 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.beginPath(); ctx.ellipse(x - 2 * size, y - 3 * size, 1.6 * size, 2.6 * size, 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#5d7a2a"; ctx.beginPath(); ctx.ellipse(x + 4 * size, y - 8 * size, 5 * size, 2 * size, -0.6, 0, Math.PI * 2); ctx.fill();
}
function drawOlives(camX) {
  for (const o of olives) if (!o.taken && o.x - camX > -20 && o.x - camX < W + 20)
    drawOlive(o.x - camX, o.y + (o.falling ? 0 : Math.sin(o.t * 3) * 2), o.kind, o.kind === "golden" ? 1.4 : 1);
}

// trees drop their fruit when you jump into the branches or sling a stone into them
const TREE_DROPS = { olive_tree: "olives", fig_tree: "figs", date_palm: "dates", grape_vine: "grapes", beehive_tree: "honey" };
function canopy(t) {   // the leafy top part of a tree, in world coordinates
  const img = ITEM[t.name]; if (!img || !img.naturalWidth) return null;
  const w = img.naturalWidth * t.size * 0.85, h = img.naturalHeight * t.size * 0.85, bottom = t.y + 6;
  return { x0: t.x - w * 0.42, x1: t.x + w * 0.42, y0: bottom - h, y1: bottom - h * 0.42 };
}
function shakeTree(t) {
  if (t.shaken) { t.shakeT = 0.25; return; }
  t.shaken = true; t.shakeT = 0.6;
  const b = canopy(t), cx = t.x, cy = (b.y0 + b.y1) / 2;
  const drop = TREE_DROPS[t.name];
  if (drop === "honey" && beesAngry) { toast("No honey: you hit the bees."); return; }
  if (drop === "olives") for (let k = 0; k < 8; k++) olives.push({ x: cx + (Math.random() - 0.5) * 60, y: cy, vx: (Math.random() - 0.5) * 260, vy: -200 - Math.random() * 200, falling: true, kind: Math.random() < 0.5 ? "green" : "purple", taken: false, t: 0, placed: false });
  else for (let k = 0; k < (drop === "honey" ? 1 : 2); k++) pickups.push({ name: drop, x: cx + (k ? 30 : -30), y: cy, vx: (k ? 1 : -1) * 120, vy: -250, falling: true, t: 0, taken: false, dropped: true });
  if (t.surprise === "golden_olive") olives.push({ x: cx, y: cy, vx: 60, vy: -380, falling: true, kind: "golden", taken: false, t: 0, placed: false });
  if (t.surprise === "special") {   // one time only: it stays found (or lying there) even after a stage restart
    specials.push({ x: cx - 10, y: cy, vx: -80, vy: -380, falling: true, taken: false, t: 0, dropped: true });
    t.surprise = null;
  }
  toast(t.surprise ? "Something fell out of the tree!" : `The ${t.name.replace("_", " ")} dropped ${drop}!`);
}
function updateTrees(dt) {
  for (const t of decor) {
    t.shakeT = Math.max(0, t.shakeT - dt);
    if (!TREE_DROPS[t.name]) continue;
    const b = canopy(t); if (!b) continue;
    const head = david.y - david.h;
    if (david.vy < -60 && head < b.y1 && head > b.y0 && david.x > b.x0 && david.x < b.x1 && !t.bumped) { t.bumped = true; shakeTree(t); }
    if (david.onGround) t.bumped = false;
  }
  for (const sp of specials) fall(sp, dt);
}
function stoneHitsTree(s) {
  for (const t of decor) {
    if (!TREE_DROPS[t.name]) continue;
    const b = canopy(t); if (!b) continue;
    if (s.x > b.x0 && s.x < b.x1 && s.y > b.y0 && s.y < b.y1) { shakeTree(t); return true; }
  }
  return false;
}

// honeybees circle the hive; hornets hover, then dive at David
function updateBees(dt) {
  for (const b of bees) {
    if (b.gone) { if (b.alpha > 0) { b.alpha -= dt * 1.5; b.vy += 900 * dt; b.x += b.vx * dt; b.y += b.vy * dt; } continue; }
    b.t += dt;
    const tree = decor.find(d => d.name === "beehive_tree"); const c = tree && canopy(tree);
    const cx = c ? c.x1 - 18 : b.hx, cy = c ? (c.y0 + c.y1) / 2 + 30 : 380;   // around the hive hanging on the right
    const nx = cx + Math.cos(b.t * 1.7 + b.k) * (34 + b.k * 9), ny = cy + Math.sin(b.t * 2.3 + b.k * 2) * (22 + b.k * 5);
    b.facing = nx > b.x ? 1 : -1; b.x = nx; b.y = ny;
  }
}
function updateHornets(dt) {
  for (const h of hornets) {
    if (h.gone) { if (h.alpha > 0) { h.alpha -= dt * 1.5; h.vy += 900 * dt; h.x += h.vx * dt; h.y += h.vy * dt; } continue; }
    h.t += dt;
    const dx = david.x - h.x, dy = (david.y - 60) - h.y, dist = Math.hypot(dx, dy);
    if (h.state === "hover") {
      h.x += ((h.hx + Math.sin(h.t * 1.3) * 50) - h.x) * Math.min(1, dt * 2);
      h.y += ((h.hy + Math.sin(h.t * 2.1) * 18) - h.y) * Math.min(1, dt * 2);
      h.facing = dx > 0 ? 1 : -1;
      if (dist < TUNE.HORNET_RANGE && h.t > 1.2) { h.state = "dive"; h.t = 0; h.vx = dx / dist * TUNE.HORNET_DIVE; h.vy = dy / dist * TUNE.HORNET_DIVE; }
    } else if (h.state === "dive") {
      h.x += h.vx * dt; h.y += h.vy * dt; h.facing = h.vx > 0 ? 1 : -1;
      if (h.t > 0.9) { h.state = "back"; h.t = 0; }
    } else {   // back to its spot
      h.x += (h.hx - h.x) * Math.min(1, dt * 1.8); h.y += (h.hy - h.y) * Math.min(1, dt * 1.8);
      if (h.t > 1.2) { h.state = "hover"; h.t = 0; }
    }
    if (Math.abs(h.x - david.x) < 26 && h.y > david.y - david.h - 10 && h.y < david.y) hurtDavid(h.x);
  }
}
function stoneHitsBugs(s) {
  for (const h of hornets) if (!h.gone && Math.hypot(s.x - h.x, s.y - h.y) < 26) {
    h.gone = true; h.vx = Math.sign(s.vx) * 160; h.vy = -260; toast("Hornet driven off!"); return !s.power;
  }
  for (const b of bees) if (!b.gone && Math.hypot(s.x - b.x, s.y - b.y) < 20) {
    b.gone = true; b.vx = Math.sign(s.vx) * 120; b.vy = -200;
    if (!beesAngry) {
      beesAngry = true;
      for (const p of pickups) if (p.name === "honey") p.taken = true;   // the honey is gone
      toast("You hit a honeybee! Bees are harmless... and now the honey is gone.");
    }
    return !s.power;
  }
  return false;
}
function drawBugs(camX) {
  if (!SPR.bee_fly || !SPR.hornet_fly) return;
  for (const b of bees) if (b.alpha > 0) drawSprite("bee_fly", frameOf("bee_fly", b.t * 2), b.x - camX, b.y, b.facing, 1, b.alpha);
  for (const h of hornets) if (h.alpha > 0) drawSprite("hornet_fly", frameOf("hornet_fly", h.t * (h.state === "dive" ? 3 : 1.5)), h.x - camX, h.y, h.facing, 1, h.alpha);
}

// harp music: the first 15 seconds of "The Shepherd Leads Me", looping while David sits and plays
const harpMusic = new Audio("../assets/audio/harp_loop.mp3?v=" + (window.BUILD || 0));
harpMusic.loop = true; harpMusic.volume = 0;
let harpVol = 0, harpStarting = false, harpHeldT = 0;
// Browsers only allow sound after the player clicks or presses a key on the page (controller buttons don't count),
// so the first click or keypress quietly "unlocks" audio.
let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  try { chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)(); chimeCtx.resume(); } catch (e) {}
  harpMusic.muted = true;
  harpMusic.play().then(() => { harpMusic.pause(); harpMusic.muted = false; audioUnlocked = true; }).catch(() => {});
}
addEventListener("keydown", unlockAudio); addEventListener("pointerdown", unlockAudio);
// ---------------------------------------------------------------------------
// Sound effects (Web Audio, so many can overlap) and the looping ambience / boss music.
// Files are in assets/sounds. Sounds far from the middle of the screen play quieter.
// ---------------------------------------------------------------------------
const SFX_FILES = ["sheep_baa_1", "sheep_baa_2", "sheep_baa_3", "sheep_baa_4", "sheep_baa_5", "sheep_baa_6", "sheep_baa_7",
  "flock_baa", "sling_throw", "sling_throw_quick", "sling_charge", "sling_power", "extra_life", "heal", "boss_intro",
  "jump", "olive_pickup", "fall_pit", "stone_hit", "final_stone", "final_stone_goliath", "lion_roar", "lion_hit", "lion_defeated"];
// (plain <audio> elements, not fetch + Web Audio: fetch is blocked when the game is opened straight from a file)
const SFX = {};
for (const n of SFX_FILES) { const a = new Audio(`../assets/sounds/${n}.mp3?v=${window.BUILD || 0}`); a.preload = "auto"; SFX[n] = a; }
function loadSfx() {}
// play a sound; x (optional) is where it happens in the level, so off-screen things are quieter
function sfx(name, x, vol = 1, rate = 1) {
  if (!audioUnlocked) return null;
  const base = SFX[name]; if (!base) return null;
  let v = vol * TUNE.SFX_VOLUME;
  if (x !== undefined) { const off = Math.abs(x - (camX + W / 2)); v *= Math.max(0, Math.min(1, 1.25 - off / (W * 0.9))); }
  if (v <= 0.01) return null;
  const a = base.cloneNode(); a.volume = Math.min(1, v); a.playbackRate = rate; a.preservesPitch = false;
  a.play().catch(() => {});
  return a;
}
const baa = (x, vol = 0.8) => sfx("sheep_baa_" + (1 + Math.floor(Math.random() * 7)), x, vol, 0.92 + Math.random() * 0.16);
// looping beds
function loopAudio(name) { const a = new Audio(`../assets/sounds/${name}.mp3?v=${window.BUILD || 0}`); a.loop = true; a.volume = 0; return a; }
const ambience = loopAudio("ambience_hills"), bossMusic = loopAudio("boss_loop");
const stepsRun = loopAudio("steps_run");
let ambVol = 0, bossVol = 0, bossIntroPlayed = false, runVol = 0;
function fadeLoop(a, cur, want, dt, speed) {
  const v = want > cur ? Math.min(want, cur + dt * speed) : Math.max(want, cur - dt * speed);
  a.volume = Math.max(0, Math.min(1, v));
  if (v > 0 && a.paused && audioUnlocked) a.play().catch(() => {});
  if (v <= 0 && !a.paused) a.pause();
  return v;
}
function updateSound(dt) {
  if (!audioUnlocked) return;
  loadSfx();
  const inArena = lion && david.x > arenaX - TUNE.BOSS_MUSIC_LEAD * T;
  const fight = lion && (lion.awake || inArena) && lion.state !== "defeated" && david.deadT <= 0;
  if (fight && !bossIntroPlayed) { bossIntroPlayed = true; sfx("boss_intro", undefined, 0.8); bossMusic.currentTime = 0; }   // uh oh
  if (lion && !lion.awake && !inArena) bossIntroPlayed = false;
  bossVol = fadeLoop(bossMusic, bossVol, fight ? TUNE.BOSS_MUSIC_VOLUME : 0, dt, fight ? 0.5 : 0.4);
  const calm = !fight && !(david.state === "harp") && !finish.active;
  ambVol = fadeLoop(ambience, ambVol, calm ? TUNE.AMBIENCE_VOLUME : (finish.active ? TUNE.AMBIENCE_VOLUME * 0.5 : 0), dt, 0.3);
  const d = david;
  // footsteps: a running patter while he's running on the ground (walking is quiet)
  const spd = d.onGround && d.deadT <= 0 && !d.harp ? Math.abs(d.vx) : 0;
  const running = spd > (TUNE.WALK_SPEED + TUNE.RUN_SPEED) / 2;
  runVol = fadeLoop(stepsRun, runVol, running ? TUNE.STEPS_VOLUME : 0, dt, 6);
  if (running) { stepsRun.playbackRate = Math.max(0.85, Math.min(1.2, spd / TUNE.RUN_SPEED)); }
  // the sling whirls while you charge it
  if (d.y > GR * T + 3 * T && d.deadT <= 0 && !d.fallSnd) { d.fallSnd = true; sfx("fall_pit", undefined, 0.8); }   // dropping into a pit
  if (d.onGround) d.fallSnd = false;
  if (d.charging && d.charge > 0.12 && !d.chargeSnd) { d.chargeSnd = sfx("sling_charge", undefined, 0.6); if (d.chargeSnd) d.chargeSnd.loop = true; }   // whirls as long as B is held
  if (!d.charging && d.chargeSnd) { d.chargeSnd.pause(); d.chargeSnd = null; }
}
function updateHarpMusic(dt) {
  const sitting = david.harp && (david.state === "kneel" || david.state === "harp");
  harpHeldT = sitting ? harpHeldT + dt : 0;
  const want = sitting && harpHeldT >= TUNE.HARP_MUSIC_DELAY;   // wait for his hands, not the harp coming out
  if (want && harpMusic.paused && !harpStarting && audioUnlocked) {
    harpStarting = true; harpMusic.currentTime = 0; harpVol = 0;
    harpMusic.play().then(() => { harpStarting = false; }).catch(() => { harpStarting = false; });
  }
  harpVol = want ? Math.min(TUNE.HARP_VOLUME, harpVol + dt * 6) : Math.max(0, harpVol - dt * 1.2);   // comes in with his first strum, fades out gently
  harpMusic.volume = harpVol;
  if (!want && harpVol <= 0 && !harpMusic.paused) harpMusic.pause();
}

function updateWorld(dt) {
  updateHarpMusic(dt); updateSound(dt);
  updateBees(dt); updateHornets(dt);
  updateSpecials(dt); updateOlives(dt); updateTrees(dt);
  david.inv = Math.max(0, david.inv - dt);
  if (david.deadT > 0) { david.deadT -= dt; if (david.deadT <= 0) respawn(); }
  updatePickups(dt); updateSnakes(dt); updateFires(dt); updateLion(dt); updateTakenLamb(dt); updateSheep(dt); updateFinish(dt);
}

// background layers: Glen's art, three per world. far = sky + distant hills (slowest), mid = rolling hills, near = grass strip
const BG = {};
for (const w of ["w1", "w2"]) {
  BG[w] = {};
  for (const [layer, ext] of [["far", "jpg"], ["mid", "png"], ["near", "png"]]) {
    total++;
    const img = new Image(); img.onload = () => { loaded++; }; img.onerror = () => { loaded++; };
    img.src = `../assets/backgrounds/${w}_${layer}.${ext}?v=${window.BUILD || 0}`; BG[w][layer] = img;
  }
}
let bgWorld = "w1";   // press 3 to swap between World 1 and World 2 backgrounds (to compare)
function drawLayerRepeating(img, camX, factor, bottomY, height) {
  if (!img.naturalWidth) return;
  const w = img.naturalWidth * height / img.naturalHeight;
  let x = -((camX * factor) % w); if (x > 0) x -= w;
  for (; x < W; x += w) ctx.drawImage(img, Math.floor(x), bottomY - height, Math.ceil(w) + 1, height);
}
function drawBackground(camX) {
  const L = BG[bgWorld];
  // far: one image, scaled so it covers the screen plus all the scrolling it will do, bottom-aligned (no repeat)
  const far = L.far;
  if (far.naturalWidth) {
    const scroll = Math.max(0, LEVEL_W - W) * TUNE.BG_FAR_SPEED;
    const w = W + scroll, h = far.naturalHeight * w / far.naturalWidth;
    ctx.drawImage(far, -camX * TUNE.BG_FAR_SPEED, H - h + (TUNE.BG_FAR_DROP[bgWorld] || 0), w, h);
  } else { ctx.fillStyle = "#cfe0ea"; ctx.fillRect(0, 0, W, H); }
  drawLayerRepeating(L.mid, camX, TUNE.BG_MID_SPEED, GR * T + 30, TUNE.BG_MID_HEIGHT);
  drawLayerRepeating(L.near, camX, TUNE.BG_NEAR_SPEED, GR * T + 22, TUNE.BG_NEAR_HEIGHT);
}
function drawDecor(camX, layer) {
  for (const d of decor) if (d.layer === layer && d.x - camX > -300 && d.x - camX < W + 300)
    drawItem(d.name, d.x - camX + Math.sin(performance.now() / 25) * 5 * d.shakeT, d.y + 6 + (TUNE.DECO_DROP[d.name] || 0), d.size * 0.85);
}
// HUD art (Glen's status-bar sheet, cut into assets/hud)
const HUD = {};
for (const n of ["heart_full", "heart_half", "heart_empty", "flask_empty", "flask_full", "olive", "face", "stone",
                 "ring_empty", "ring_full", "sheep", "sheep_one"]) {
  total++;
  const img = new Image(); img.onload = () => { loaded++; }; img.onerror = () => { loaded++; };
  img.src = `../assets/hud/${n}.png?v=${window.BUILD || 0}`; HUD[n] = img;
}
function hudIcon(name, x, y, h, alpha = 1) {   // top-left at x,y, scaled to height h; returns its width
  const img = HUD[name]; if (!img || !img.naturalWidth) return h;
  const w = img.naturalWidth * h / img.naturalHeight;
  ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, x, y, w, h); ctx.restore();
  return w;
}
function hudText(t, x, y, size = 20) {
  ctx.font = `bold ${size}px sans-serif`; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,0.65)"; ctx.fillStyle = "#fff";
  ctx.strokeText(t, x, y); ctx.fillText(t, x, y);
}
function drawHearts() {   // right to left; half hearts when it's x.5
  for (let i = 0; i < david.maxHearts; i++) {
    const v = david.hearts - i, name = v >= 1 ? "heart_full" : v >= 0.5 ? "heart_half" : "heart_empty";
    hudIcon(name, W - 50 - (david.maxHearts - 1 - i) * 36, 12, 32);
  }
}
const HUD_X = W - 150;   // the column under the hearts
function drawSpecialCount() {
  if (!specials.length && !david.specialStones) return;
  hudIcon("stone", HUD_X, 52, 34, david.specialStones > 0 ? 1 : 0.45);
  hudText(`× ${david.specialStones}`, HUD_X + 44, 77);
}
function drawLivesAndOil() {
  hudIcon("face", HUD_X, 92, 36);
  hudText(`× ${david.lives}`, HUD_X + 44, 118);
  // the oil flask fills as you pick olives; full = +1 life
  const f = Math.max(0, Math.min(1, david.olives / TUNE.OLIVES_PER_LIFE)), fh = 52, fy = 134;
  const fw = hudIcon("flask_empty", HUD_X, fy, fh);
  const img = HUD.flask_full;
  if (img && img.naturalWidth && f > 0) {
    const bot = 0.94, top = 0.42, cut = bot - (bot - top) * f;     // the oil rises from the bottom of the belly
    ctx.save(); ctx.beginPath(); ctx.rect(HUD_X - 2, fy + fh * cut, fw + 4, fh * (1 - cut) + 2); ctx.clip();
    ctx.drawImage(img, HUD_X, fy, img.naturalWidth * fh / img.naturalHeight, fh); ctx.restore();
  }
  hudIcon("olive", HUD_X + 40, fy + 14, 26);
  hudText(`${david.olives}`, HUD_X + 74, fy + 36, 18);
}
// the sling ring over David's head fills while you hold B; gold when the throw is fully charged
function drawChargeRing() {
  const d = david; if (!d.charging) return;
  const f = Math.min(1, d.charge / TUNE.CHARGE_TIME), s = 30;
  const x = d.x - camX - s / 2, y = d.y - d.h - s - 26;
  hudIcon("ring_empty", x, y, s, 0.85);
  const img = HUD.ring_full; if (!img || !img.naturalWidth) return;
  const w = img.naturalWidth * s / img.naturalHeight, cx = x + w / 2, cy = y + s / 2;
  ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, s, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); ctx.closePath(); ctx.clip();
  ctx.drawImage(img, x, y, w, s); ctx.restore();
}

// ============================================================================
// Main loop
// ============================================================================
let camX = 0, last = performance.now();
function frame(now) {
  const real = Math.min(1 / 30, (now - last) / 1000); last = now;
  const dt = real * gameSpeed(real);   // the last stone on a boss slows the world down
  if (toastTime > 0) toastTime -= real;
  if (helpT > 0 && helpT < 9000) helpT -= dt;
  if (loaded < total) {
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif"; ctx.fillText(`Loading sprites ${loaded} / ${total}`, 40, 60);
    requestAnimationFrame(frame); return;
  }
  if (setup.active) updateSetup(dt); else checkCombo(dt);
  pollInput();
  if (!setup.active) { if (david.deadT <= 0) updateDavid(dt); updateLamb(dt); updateStones(dt); updateWorld(dt); }
  const targetCam = Math.max(0, Math.min(LEVEL_W - W, david.x - W * 0.4 + david.facing * 80));
  camX += (targetCam - camX) * Math.min(1, real * 6);
  const shake = finalBlow.shake * finalBlow.shake * 14;
  ctx.save(); if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  drawBackground(camX);
  drawDecor(camX, "back");
  drawTiles(camX);
  drawFold(camX);
  drawFires(camX);
  drawPickups(camX);
  drawOlives(camX);
  drawSpecials(camX);
  drawSnakes(camX);
  drawBugs(camX);
  drawLion(camX);
  drawTakenLamb(camX);
  drawSheep(camX);
  drawFlock(camX);
  drawLamb(camX);
  if (inCutscene() || !(david.inv > 0 && Math.floor(now / 70) % 2)) drawDavid(camX);
  drawStones(camX);
  drawDecor(camX, "front");
  ctx.restore();
  drawFinalBlow();
  if (david.deadT > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, 1.2 - david.deadT)})`; ctx.fillRect(0, 0, W, H); }
  if (debug) {
    ctx.strokeStyle = "red"; ctx.strokeRect(david.x - camX - BODY_W / 2, david.y - david.h, BODY_W, david.h);
    ctx.fillStyle = "#fff"; ctx.fillText(`${david.state} vx ${david.vx | 0} vy ${david.vy | 0}`, 20, H - 20);
  }
  drawHUD();
  drawFinishBanner();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
