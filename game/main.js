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
  HORNET_RANGE: 300,      // how close before a hornet dives at David
  HORNET_DIVE: 420,       // dive speed
  HARP_SETTLE_MS: 120,    // playing frames 1-8, once, after he sits down
  HARP_LOOP_MS: 190,      // the calm strumming loop (frames 9-12, back and forth)
  HARP_STANDUP: 0.75,     // seconds to put the harp away and stand up
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
  COBRA_BITE_EXTRA: 0,    // + makes the cobra's bite reach farther, - shorter (pixels)
  LION_HP: 6,             // tap stone = 1, charged stone = 2 (only while it's dazed)
  LION_PROWL: 130, LION_RUN: 330,
  LION_POUNCE_RANGE: 360, // how close before it roars and pounces
  LION_TELL: 0.9,         // seconds of roar warning before the pounce
  LION_JUMP: 820,
  LION_DAZED: 1.8,        // seconds it stays dazed after landing (your window to hit it)
  // Per-sprite size nudges (1 = normal). Some clips came out a little bigger or smaller than the others.
  SPRITE_SIZE: {
    david_sling_throw: 1.15,
    david_crawl: 0.92,
    lion_run: 1.3, lion_pounce: 1.3, lion_prowl: 1.3, lion_roar: 1.3, lion_sit_roar: 1.3, lion_dazed: 1.3,
    cobra_hood: 1.5, snake_strike: 1.5,
    bee_fly: 0.6, hornet_fly: 1.0,
    david_play_harp: 0.66,       // the harp clip zoomed in as he sat down
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
const ROWS = 20, COLS = LEVEL_NAME === "test" ? 150 : 232, GR = 17;
const solid = [...Array(ROWS)].map(() => Array(COLS).fill(0));     // 0 empty, 1 earth, 2 stone
const oneway = [...Array(ROWS)].map(() => Array(COLS).fill(false));
const gourds = [], labels = [], decor = [], pickups = [], snakes = [], fires = [];
let lionSpawn = null, arenaX = Infinity;
const ground = (c0, c1) => { for (let c = c0; c <= c1; c++) for (let r = GR; r < ROWS; r++) solid[r][c] = 1; };
const block = (c, r, w, h, mat = 1) => { for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) solid[y][x] = mat; };
const rock = (c, r, w, h) => block(c, r, w, h, 2);
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

if (LEVEL_NAME === "test") {
  ground(0, 24);   label(2, 7, "Start: walk, then hold a direction to run");
  block(12, 15, 2, 2); block(16, 14, 2, 3);
  ground(28, 85);  label(26, 9, "small gap: jump");
  plat(32, 13, 4); plat(38, 10, 4); gourd(39, 9);
  block(46, 14, 3, 3); gourd(47, 13);               label(43, 10, "B: sling the gourds (hold B to charge, Up to aim up)");
  block(64, 12, 20, 3);                             label(64, 11, "low tunnel: Down + A while running = roll, or hold Down to crawl");
  ground(89, 145); label(87, 9, "gap");
  block(100, 10, 3, 7); gourd(101, 9);              label(95, 8, "tall wall: jump, then A again in the air = flip");
  plat(108, 13, 4); plat(114, 10, 4); gourd(115, 9);
  block(124, 15, 2, 2); block(127, 13, 2, 4); block(130, 11, 2, 6); gourd(131, 10);
  block(140, 9, 6, 8);                              label(133, 6, "end of the test. R = back to the start");
} else {
  // ---- 1-1 sample: The Hills of Bethlehem ----
  ground(0, 60);
  deco("olive_tree", 4, 16, 1.0); deco("date_palm", 15, 16, 1.1);
  label(2, 6, "World 1-1 sample. Eat food to heal, but look before you eat.");
  food("grapes", 10, 16); food("bread", 21, 16);
  special(16, 9);                                       // above the date palm: jump + flip
  special(87, 6);                                       // high above the fig platform: flip from the platform
  // the third special stone is hidden in the fig tree (col 114): jump into its branches
  oliveRow(6, 16, 6); oliveArc(22, 16, 5); oliveRow(26, 14, 3); oliveRow(30, 12, 3);
  oliveArc(35, 16, 6); oliveRow(50, 16, 4); oliveArc(64, 16, 4);
  oliveRow(80, 12, 4); oliveRow(86, 9, 3); oliveRow(95, 16, 4); oliveArc(103, 16, 5);
  oliveRow(126, 16, 6); oliveArc(133, 16, 5); oliveRow(144, 16, 3); oliveArc(158, 16, 6);
  rock(26, 15, 3, 2); rock(30, 13, 3, 4);
  gourd(28, 8, true); gourd(33, 7, true);             label(25, 6, "Sling down the hanging wild gourds");
  snake("cobra", 40);                                  label(37, 10, "Cobra! Sling it before it strikes");
  deco("thorn_bush", 43, 16, 0.8, "front");
  food("poison_berries", 45, 16); rock(47, 15, 3, 2); food("cheese", 48, 14);
  label(44, 11, "Berries or cheese? Look before you eat.");
  deco("olive_tree", 55, 16, 1.15, "back", "golden_olive");   // jump into it: a shower of olives, and a golden one
  ground(64, 122);
  campfire(68); deco("tent", 73, 16, 1.1);            label(64, 10, "Campfire: checkpoint. Sit and play the harp (Select) to rest.");
  plat(80, 13, 4); plat(86, 10, 4); food("figs", 87, 9);
  snake("viper", 93);
  deco("beehive_tree", 99, 16, 1.2); food("honey", 101, 16);
  for (let k = 0; k < 4; k++) bee(99, k);              // honeybees: harmless. Leave them be and the honey is yours.
  hornet(108, 11); hornet(131, 10);                     // hornets: they dive at you. Sling them.
  food("wild_gourds", 106, 16); food("dates", 109, 16);  label(104, 11, "Wild gourds are poison (2 Kings 4:39)");
  deco("fig_tree", 114, 16, 1.0, "back", "special");         // figs, and a hidden special stone
  rock(117, 14, 2, 3);
  ground(126, 232);
  deco("vineyard", 129, 16, 1.2); deco("crops", 135, 16, 1.1);
  rock(140, 10, 3, 7); food("fig_cake", 141, 9);      label(136, 8, "Flip up for the fig cake");
  snake("cobra", 147);
  campfire(155);                                      label(152, 10, "Last campfire before the lion");
  deco("stone_wall", 160, 16, 1.0, "back");
  deco("cave", 214, 16, 1.7);                         // the lion's den
  rock(226, 4, 6, 13);
  lionSpawn = { x: 205 * T, y: GR * T }; arenaX = 168 * T;
  label(170, 6, "The lion's territory");
}

const spawn = { x: 3 * T, y: GR * T }, lambSpawn = { x: 5 * T, y: GR * T };
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

function updateDavid(dt) {
  const d = david;
  d.t += dt;
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
      setState(d.carrying ? "carry" : "jump");
    } else if (pressed("a") && !d.onGround && !d.flipUsed && d.coyote <= 0) {
      d.flipUsed = true;
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
    toast(`Power Sling! (${d.specialStones} special stone${d.specialStones === 1 ? "" : "s"} left)`);
  }
  if (!d.carrying && !d.harp && !busy) {
    if (pressed("b") && d.throwT < 0) { d.charging = true; d.charge = 0; d.throwT = 0; d.thrown = false; }
    if (d.charging) { d.charge += dt; if (released("b") || !held("b")) { d.charging = false; d.runThrow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED; } }
  }
  if (d.throwT >= 0) {
    if (!d.charging) d.throwT += dt;
    const dur = d.runThrow ? TUNE.RUN_THROW_TIME : TUNE.THROW_TIME;
    const relAt = d.runThrow ? dur * 9.5 / 12 : dur * 7 / 12;   // running throw: the stone leaves at frame 10
    if (!d.thrown && d.throwT >= relAt) {
      d.thrown = true;
      const full = Math.min(1, d.charge / TUNE.CHARGE_TIME);
      const sp = full >= 1 ? TUNE.STONE_SPEED_CHARGED : TUNE.STONE_SPEED;
      const aimUp = held("up"), straightUp = aimUp && !(held("left") || held("right"));
      const aimDown = held("down") && !d.onGround;   // Down + B in the air: throw diagonally down
      const ang = aimUp ? (straightUp ? -Math.PI / 2 + 0.04 : -Math.PI / 4) : aimDown ? Math.PI / 4 : -0.12;
      stones.push({ x: d.x + d.facing * (straightUp ? 6 : 30), y: d.y - (straightUp ? 100 : 78), vx: Math.cos(ang) * sp * d.facing + d.vx * (straightUp ? 0 : 0.3),
                    vy: Math.sin(ang) * sp, charged: full >= 1, life: 2.5 });
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
      drawSprite("david_sling_throw", i, x, y, d.facing);
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
  const dx = david.x - david.facing * 70 - lamb.x;
  const target = Math.abs(dx) > 40 ? Math.sign(dx) * Math.min(TUNE.LAMB_SPEED, Math.abs(dx) * 3) : 0;
  lamb.vx += (target - lamb.vx) * Math.min(1, dt * 8);
  if (Math.abs(lamb.vx) > 10) lamb.facing = Math.sign(lamb.vx);
  // hop up ledges / gaps if David is above or the way is blocked
  if (lamb.onGround && (david.y < lamb.y - 40 || lamb.blocked) && Math.abs(dx) > 60) lamb.vy = -900;
  lamb.vy = Math.min(TUNE.MAX_FALL, lamb.vy + TUNE.GRAVITY * dt);
  const before = lamb.x;
  collideBody(lamb, 30, 40, dt);
  lamb.blocked = Math.abs(lamb.vx) < 5 && Math.abs(target) > 50 && Math.abs(lamb.x - before) < 0.5;
  // left behind (stuck under a ledge, fell in a pit, too far away): pop back next to David
  const far = Math.abs(lamb.x - david.x) > 260 || lamb.y - david.y > 110;
  lamb.lostT = far && david.onGround ? (lamb.lostT || 0) + dt : 0;
  if (lamb.lostT > TUNE.LAMB_CATCHUP || Math.abs(lamb.x - david.x) > 900 || lamb.y > ROWS * T + 100) popLamb();
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
    if (isSolid(Math.floor(s.x / T), Math.floor(s.y / T))) s.life = 0;
    for (const g of gourds) if (g.alive && Math.hypot(s.x - g.x, s.y - (g.y - 24)) < 30) {
      g.alive = false; if (!s.power) s.life = 0;
      for (let k = 0; k < 10; k++) bits.push({ x: g.x, y: g.y - 24, vx: (Math.random() - 0.5) * 500, vy: -Math.random() * 500, life: 0.8, color: "#c8c040" });
    }
    for (const sn of snakes) if (!sn.gone && s.life > 0 && Math.abs(s.x - snakeMid(sn)) < (sn.kind === "cobra" ? 48 : 34) && s.y > sn.y - 70 && s.y < sn.y + 6) {
      sn.gone = true; sn.vx = Math.sign(s.vx) * 220; sn.vy = -480; if (!s.power) s.life = 0; toast("Driven off!");
    }
    if (s.life > 0 && stoneHitsBugs(s)) s.life = 0;
    if (s.life > 0 && stoneHitsLion(s)) s.life = 0;
    if (s.life > 0 && !s.power && stoneHitsTree(s)) s.life = 0;
  }
  for (let i = stones.length - 1; i >= 0; i--) if (stones[i].life <= 0) stones.splice(i, 1);
  for (const b of bits) { b.life -= dt; b.vy += 1400 * dt; b.x += b.vx * dt; b.y += b.vy * dt; }
  for (let i = bits.length - 1; i >= 0; i--) if (bits[i].life <= 0) bits.splice(i, 1);
}

// ============================================================================
// Drawing the world
// ============================================================================
function drawTiles(camX) {
  const c0 = Math.floor(camX / T), c1 = Math.ceil((camX + W) / T);
  for (let r = 0; r < ROWS; r++) for (let c = c0; c <= c1; c++) {
    const x = c * T - camX, y = r * T;
    if (isSolid(c, r)) {
      const top = !isSolid(c, r - 1);
      if (solid[r][c] === 2) {   // limestone
        ctx.fillStyle = "#c9b48c"; ctx.fillRect(x, y, T, T);
        ctx.fillStyle = "#b39c74"; ctx.fillRect(x, y + T - 4, T, 4); ctx.fillRect(x + ((r % 2) ? 0 : T / 2), y, 3, T);
        if (top) { ctx.fillStyle = "#e0cfa8"; ctx.fillRect(x, y, T, 5); ctx.fillStyle = "#7fae4a"; if ((c * 7 + r) % 3 === 0) ctx.fillRect(x + 8, y - 4, 10, 6); }
        continue;
      }
      ctx.fillStyle = "#8b6a3e"; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = "#77592f"; ctx.fillRect(x + 5, y + 15, 8, 5); ctx.fillRect(x + 21, y + 25, 9, 5);
      if (top) { ctx.fillStyle = "#6fae3e"; ctx.fillRect(x, y, T, 10); ctx.fillStyle = "#86c650"; ctx.fillRect(x, y, T, 4); }
    } else if (isOneway(c, r)) {
      ctx.fillStyle = "#a07a46"; ctx.fillRect(x, y, T, 14);
      ctx.fillStyle = "#c39a5e"; ctx.fillRect(x, y, T, 4);
    }
  }
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
});

let helpT = 12;
function drawHUD() {
  drawHearts(); drawSpecialCount(); drawLivesAndOil();
  if (helpT <= 0) {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(10, 10, 300, 26);
    ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif";
    ctx.fillText("H = controls   1 = World 1-1   2 = movement test", 18, 28);
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
function hurtDavid(fromX) {
  const d = david;
  if (d.inv > 0 || d.deadT > 0) return;
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
}
function respawn() {
  const d = david;
  if (d.lives <= 0) restartStage();
  d.x = checkpoint.x; d.y = checkpoint.y; d.vx = d.vy = 0; d.hearts = d.maxHearts; d.inv = 1; d.deadT = 0; setState("idle");
  lamb.x = d.x - 50; lamb.y = d.y;
  if (lion) resetLion();
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
      if (v < 0) hurtDavid(p.x); else david.hearts = Math.min(david.maxHearts, david.hearts + v);
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
// where the tip of the cobra's head is in each frame, in sheet pixels (measured from Glen's sheet)
const COBRA_HEAD_X = [125, 127, 125, 127, 153, 203, 154, 131];
// the cobra turns around in place: it flips around the middle of its body, not the tip of its head
const COBRA_MID_X = 62;   // middle of the body in the sheet (frame 1 spans 0-125)
function cobraScale() { return SCALE * (TUNE.SPRITE_SIZE.cobra_hood || 1); }
function cobraMid(s) { return s.x + (COBRA_MID_X - SPR.cobra_hood.ax) * cobraScale(); }   // fixed spot in the level
function cobraDrawX(s) { return cobraMid(s) - s.facing * (COBRA_MID_X - SPR.cobra_hood.ax) * cobraScale(); }
function cobraHeadX(s, f) { return cobraDrawX(s) + s.facing * (COBRA_HEAD_X[f] - SPR.cobra_hood.ax) * cobraScale(); }
function snakeMid(s) { return s.kind === "cobra" && SPR.cobra_hood ? cobraMid(s) : s.x; }
function cobraStrikeFrame(t) { for (const [f, d] of COBRA_STRIKE) { if (t < d) return f; t -= d; } return 7; }
// snakes: "cobra" (hood up, sways, lunges when close) and "viper" (coiled, strikes when close)
function updateSnakes(dt) {
  for (const s of snakes) {
    if (s.gone) { if (s.alpha > 0) { s.alpha -= dt * 1.5; s.y += s.vy * dt; s.vy += 1600 * dt; s.x += s.vx * dt; } continue; }
    s.t += dt;
    const sameLevel = Math.abs(david.y - s.y) < 70;
    if (s.kind === "cobra") {
      if (s.state !== "strike") s.facing = Math.sign(david.x - cobraMid(s)) || s.facing;   // turn in place (never mid-strike)
      const dx = Math.abs(david.x - cobraHeadX(s, 0));
      if (s.state === "idle" && dx < TUNE.SNAKE_RANGE && sameLevel) { s.state = "strike"; s.t = 0; }
      const strikeLen = COBRA_STRIKE.reduce((a, f) => a + f[1], 0);
      if (s.state === "strike" && s.t > strikeLen) { s.state = "rest"; s.t = 0; }
      if (s.state === "rest" && s.t > 0.8) { s.state = "idle"; s.t = 0; }
      if (s.state === "strike") {   // the bite covers from where the head waits to where it is right now
        const a = cobraHeadX(s, 0), b = cobraHeadX(s, cobraStrikeFrame(s.t)) + s.facing * TUNE.COBRA_BITE_EXTRA;
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
    if (s.kind === "cobra") {
      // waiting: sway through frames 1-4; strike: Glen's frames 5, 6, 7, then 8 to settle
      const i = s.state === "strike" ? cobraStrikeFrame(s.t) : [0, 1, 2, 3, 2, 1][Math.floor(s.t / 0.16) % 6];
      drawSprite("cobra_hood", i, cobraDrawX(s) - camX, s.y, s.facing, 1, s.alpha);
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
      if (f.healT > 0.8) { f.healT = 0; david.hearts++; }
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
  Object.assign(lion, { x: lionSpawn.x, y: lionSpawn.y, vx: 0, vy: 0, onGround: true, state: "sit", t: 0, facing: -1,
                        hp: TUNE.LION_HP, flash: 0, alpha: 1, told: false, awake: false, pounceCool: 0 });
}
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
    if (david.x > arenaX) { L.awake = true; setLion("intro"); helpT = 0; toast("The lion! Watch for its roar, then dodge the pounce. Hit it while it's dazed."); }
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
      if (dist < TUNE.LION_POUNCE_RANGE && L.pounceCool <= 0) { L.vx = 0; setLion("tell"); }
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
function stoneHitsLion(s) {
  if (!lion || lion.state === "defeated" || !lion.awake) return false;
  const b = lionBox();
  if (s.x < b.x0 || s.x > b.x1 || s.y < b.y0 || s.y > b.y1) return false;
  if (s.power && lion.state !== "dazed") {   // the Power Sling knocks it dazed and hurts it
    lion.hp -= 2; lion.flash = 0.3; lion.vx = 0; setLion("dazed");
    toast("Power Sling! The lion is dazed. Hit it now!");
    if (lion.hp <= 0) { setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and the cobra\" (Psalm 91:13)"); }
  } else if (lion.state === "dazed") {
    lion.hp -= s.power ? 3 : s.charged ? 2 : 1; lion.flash = 0.25;
    if (lion.hp <= 0) {
      setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and the cobra\" (Psalm 91:13)");
    }
  } else if (!lion.told) { lion.told = true; toast("Stones bounce off! Wait until it's dazed after a pounce."); }
  for (let k = 0; k < 6; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 300, life: 0.4, color: lion.state === "dazed" || lion.state === "defeated" ? "#fff2b0" : "#bbb" });
  return true;
}
function drawLion(camX) {
  if (!lion || lion.alpha <= 0) return;
  const L = lion, x = L.x - camX, y = L.y;
  const map = { sit: "lion_sit_roar", intro: "lion_sit_roar", prowl: "lion_prowl", run: "lion_run", tell: "lion_roar", pounce: "lion_pounce", dazed: "lion_dazed", defeated: "lion_dazed" };
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
      toast(`Special stone! (${found} of ${specials.length} in this stage)  Save it for later, or A + B for a Power Sling.`);
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
      if (o.kind === "golden") { david.lives++; toast("A golden olive! A whole flask of oil: +1 life"); }
      else {
        david.olives++;
        if (david.olives >= TUNE.OLIVES_PER_LIFE) { david.olives -= TUNE.OLIVES_PER_LIFE; david.lives++; toast("The oil flask is full: +1 life!"); }
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

function updateWorld(dt) {
  updateBees(dt); updateHornets(dt);
  updateSpecials(dt); updateOlives(dt); updateTrees(dt);
  david.inv = Math.max(0, david.inv - dt);
  if (david.deadT > 0) { david.deadT -= dt; if (david.deadT <= 0) respawn(); }
  updatePickups(dt); updateSnakes(dt); updateFires(dt); updateLion(dt);
}

// background layers (stand-ins until there is real background art)
function drawBackground(camX) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#86b8e0"); g.addColorStop(0.55, "#d9e7ea"); g.addColorStop(1, "#f4e2bd");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // far ridges
  ctx.fillStyle = "#cdbf98";
  for (let i = -1; i < 7; i++) { const x = i * 420 - (camX * 0.12) % 420; ctx.beginPath(); ctx.ellipse(x + 210, 540, 300, 150, 0, Math.PI, 0); ctx.fill(); }
  // Bethlehem on its hill
  const bx = 980 - camX * 0.1;
  ctx.fillStyle = "#bfae82"; ctx.beginPath(); ctx.ellipse(bx, 500, 250, 120, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#ead9b2"; for (let k = 0; k < 8; k++) ctx.fillRect(bx - 120 + k * 30, 392 - (k % 3) * 10, 24, 20);
  // middle hills with faded trees
  const p2 = camX * 0.35;
  ctx.fillStyle = "#b5bf82";
  for (let i = -1; i < 7; i++) { const x = i * 380 - p2 % 380; ctx.beginPath(); ctx.ellipse(x + 190, 610, 260, 120, 0, Math.PI, 0); ctx.fill(); }
  const trees = ["olive_tree", "date_palm", "fig_tree", "olive_tree"];
  for (let i = -1; i < 9; i++) {
    const k = Math.floor((p2 + i * 300) / 300); const x = k * 300 - p2 + 80;
    drawItem(trees[((k % 4) + 4) % 4], x, 545 + (k % 2) * 12, 0.42, 0.55);
  }
  // near hills
  ctx.fillStyle = "#9fb86a";
  for (let i = -1; i < 7; i++) { const x = i * 360 - (camX * 0.6) % 360; ctx.beginPath(); ctx.ellipse(x + 180, 650, 240, 110, 0, Math.PI, 0); ctx.fill(); }
}
function drawDecor(camX, layer) {
  for (const d of decor) if (d.layer === layer && d.x - camX > -300 && d.x - camX < W + 300)
    drawItem(d.name, d.x - camX + Math.sin(performance.now() / 25) * 5 * d.shakeT, d.y + 6, d.size * 0.85);
}
function drawLivesAndOil() {
  // lives
  ctx.fillStyle = "#fff"; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 3; ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "#c98a4a"; ctx.beginPath(); ctx.arc(W - 72, 108, 10, 0, Math.PI * 2); ctx.fill();          // a little face
  ctx.fillStyle = "#4a2c18"; ctx.beginPath(); ctx.arc(W - 72, 103, 10, Math.PI, 0); ctx.fill();             // curly hair
  ctx.fillStyle = "#fff"; ctx.strokeText(`× ${david.lives}`, W - 60, 115); ctx.fillText(`× ${david.lives}`, W - 60, 115);
  // oil flask that fills with olives
  const x = W - 80, y = 132, h = 30, f = david.olives / TUNE.OLIVES_PER_LIFE;
  ctx.fillStyle = "#b9763e"; ctx.beginPath(); ctx.ellipse(x + 8, y + 18, 11, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x + 4, y, 8, 8);
  ctx.save(); ctx.beginPath(); ctx.ellipse(x + 8, y + 18, 8, 11, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = "#e9c84a"; ctx.fillRect(x - 4, y + 29 - 22 * f, 24, 22 * f); ctx.restore();
  ctx.fillStyle = "#fff"; ctx.font = "bold 16px sans-serif";
  ctx.strokeText(`${david.olives}`, W - 60, y + 24); ctx.fillText(`${david.olives}`, W - 60, y + 24);
}
function drawSpecialCount() {
  if (!specials.length && !david.specialStones) return;
  drawSpecialStone(W - 78, 72, 10, david.specialStones > 0);
  ctx.fillStyle = "#fff"; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.lineWidth = 3; ctx.font = "bold 20px sans-serif";
  ctx.strokeText(`× ${david.specialStones}`, W - 60, 79); ctx.fillText(`× ${david.specialStones}`, W - 60, 79);
}
function drawHearts() {
  for (let i = 0; i < david.maxHearts; i++) {
    const x = W - 40 - i * 34, y = 22, full = i < david.hearts;
    ctx.fillStyle = full ? "#e0383e" : "rgba(0,0,0,0.3)";
    ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.bezierCurveTo(x, y, x - 13, y, x - 13, y + 8); ctx.bezierCurveTo(x - 13, y + 16, x, y + 22, x, y + 26);
    ctx.bezierCurveTo(x, y + 22, x + 13, y + 16, x + 13, y + 8); ctx.bezierCurveTo(x + 13, y, x, y, x, y + 8); ctx.fill();
  }
}

// ============================================================================
// Main loop
// ============================================================================
let camX = 0, last = performance.now();
function frame(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
  if (toastTime > 0) toastTime -= dt;
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
  camX += (targetCam - camX) * Math.min(1, dt * 6);

  drawBackground(camX);
  drawDecor(camX, "back");
  drawTiles(camX);
  drawFires(camX);
  drawPickups(camX);
  drawOlives(camX);
  drawSpecials(camX);
  drawSnakes(camX);
  drawBugs(camX);
  drawLion(camX);
  drawLamb(camX);
  if (!(david.inv > 0 && Math.floor(now / 70) % 2)) drawDavid(camX);
  drawStones(camX);
  drawDecor(camX, "front");
  if (david.deadT > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, 1.2 - david.deadT)})`; ctx.fillRect(0, 0, W, H); }
  if (debug) {
    ctx.strokeStyle = "red"; ctx.strokeRect(david.x - camX - BODY_W / 2, david.y - david.h, BODY_W, david.h);
    ctx.fillStyle = "#fff"; ctx.fillText(`${david.state} vx ${david.vx | 0} vy ${david.vy | 0}`, 20, H - 20);
  }
  drawHUD();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
