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
  DECO_DROP: { stone_wall: 7, cave_1: 26, cave_2: 22 },   // push a decoration down into the grass (pixels)
  DECO_TILT: { cave_1: 5, cave_2: 5 },                    // lean a decoration to the right (degrees, about its foot)
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
  BG_FAR_DROP: { w1: -150, w2: 40, w1_2: 0, w1_3: 0, w1_4: 0, w2_1: 0, w2_2: 0, w2_3: 0, w2_4: 0 },   // per world: push the far layer down (positive) or up (negative)
  BG_LAYER_HEIGHTS: { w1_2: { mid: 380, near: 170 }, w1_3: { mid: 400, near: 170 }, w1_4: { mid: 380, near: 170 }, w2_1: { mid: 420, near: 560 }, w2_2: { mid: 400, near: 190 }, w2_3: { mid: 440, near: 210 }, w2_4: { mid: 440, near: 230 } },   // per world: mid / near heights on screen, if not BG_MID_HEIGHT / BG_NEAR_HEIGHT
  BG_MIRROR: { w1_2: true, w1_3: true, w1_4: true, w2_1: true, w2_2: true, w2_3: true, w2_4: true },   // per world: every other copy of the mid/near layers is flipped, so pictures whose edges don't match still join cleanly
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
  GATE_POST_TILES: 8,     // how tall the gatepost is: a full single jump just reaches the top (raise it once David has the double jump)
  GATE_OLIVE_TRIP: 1.3,   // seconds for the golden olive to slide from the bottom to the top (and the same back down)
  GATE_GOLD_AT: 0.9,      // catch it above this fraction of the way up = a top catch: the full 25 olives...
  GATE_TOPS_FOR_LIFE: 3,  // ...and every 3rd top catch (across stages) = +1 life
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
// Settings (menu.js): which controller's pictures to show, and the music / sound volumes (0-10).
const SETTINGS = Object.assign({ controller: "keyboard", music: 10, sfx: 10 }, (() => { try { return JSON.parse(localStorage.getItem("davidSettings")) || {}; } catch (e) { return {}; } })());
function saveSettings() { try { localStorage.setItem("davidSettings", JSON.stringify(SETTINGS)); } catch (e) {} applyVolumes(); }
const sfxMul = () => SETTINGS.sfx / 10, musicMul = () => SETTINGS.music / 10;
// Every <audio> keeps working with its own 0-1 volume; the setting scales what you actually hear.
// Music elements are marked with ._music (the harp, ambience, boss music, map and Journal music); the rest are sounds.
const volumed = new Set();
{
  const vd = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "volume");
  Object.defineProperty(HTMLMediaElement.prototype, "volume", {
    configurable: true,
    get() { return this._rawVol !== undefined ? this._rawVol : vd.get.call(this); },
    set(v) { this._rawVol = v; volumed.add(this); vd.set.call(this, Math.max(0, Math.min(1, v * (this._music ? musicMul() : sfxMul())))); },
  });
}
function applyVolumes() { for (const a of volumed) a.volume = a._rawVol; }
const keys = {};
addEventListener("keydown", e => {
  // playing on the keyboard: any key closes the controller setup (M or F2 opens it again)
  if (setup.active && e.code !== "KeyM" && e.code !== "F2") { setup.active = false; toast("Using the keyboard. Press M to set up a controller."); return; }
  keys[e.code] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault();
});
addEventListener("keyup", e => { keys[e.code] = false; });

// NES: the D-pad, A, B, Select, Start. A SNES controller adds X and Y as one-button shortcuts:
//   X = roll (same as Down + A)   Y = the harp (same as Select)
const BUTTONS = ["up", "down", "left", "right", "a", "b", "select", "start", "x", "y"];
const NES_BUTTONS = 8;   // the setup can stop after Start for a controller without X and Y
const KEYMAP = {
  up: ["ArrowUp", "KeyW"], down: ["ArrowDown", "KeyS"], left: ["ArrowLeft", "KeyA"], right: ["ArrowRight", "KeyD"],
  a: ["KeyZ", "Space", "KeyK"], b: ["KeyX", "KeyJ"], select: ["ShiftLeft", "ShiftRight", "KeyC"], start: ["Enter", "Escape"],
  x: ["KeyV"], y: [],
};
// each controller's buttons are remembered separately (an NES and a SNES controller can both be set up)
let padMaps = {};
try { padMaps = JSON.parse(localStorage.getItem("david-padmaps")) || {}; } catch (e) {}
let padMap = null;
try { localStorage.removeItem("david-padmap"); } catch (e) {}   // the old single setup: each controller is set up again
function mapFor(p) { return p ? padMaps[p.id] || null : null; }

function readPad() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  for (const p of pads) if (p && p.connected) return p;
  return null;
}
function padControl(p, m) {
  if (!m) return false;
  if (m.type === "button") return !!(p.buttons[m.index] && p.buttons[m.index].pressed);
  if (m.type === "axis") { const v = p.axes[m.index] || 0; return m.sign > 0 ? v > 0.5 : v < -0.5; }
  if (m.type === "hat") {   // a POV hat: 8 positions 2/7 apart; a diagonal counts for both of its directions
    const v = p.axes[m.index]; if (v === undefined) return false;
    const pos = Math.round((v + 1) * 3.5), want = Math.round((m.value + 1) * 3.5);
    if (pos < 0 || pos > 7 || Math.abs(v + 1 - pos / 3.5) > 0.12) return false;
    const gap = Math.abs(pos - want) % 8; return Math.min(gap, 8 - gap) <= 1;
  }
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
    b: !!(p.buttons[1] && p.buttons[1].pressed) || !!(p.buttons[2] && p.buttons[2].pressed),
    select: !!(p.buttons[8] && p.buttons[8].pressed),
    start: !!(p.buttons[9] && p.buttons[9].pressed),
    x: !!(p.buttons[3] && p.buttons[3].pressed),
    y: false,
  };
}

const input = { now: {}, prev: {} };
function pollInput() {
  input.prev = input.now;
  const s = {};
  for (const b of BUTTONS) s[b] = KEYMAP[b].some(k => keys[k]);
  const p = readPad();
  padMap = mapFor(p);
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
    // asked for X or Y and Start came again: an NES controller, so stop here
    const skip = setup.step >= NES_BUTTONS && JSON.stringify(got) === JSON.stringify(setup.map.start);
    // a button already given to something else doesn't count (pressing Up twice would make Down the same as Up)
    if (!skip && Object.values(setup.map).some(m => JSON.stringify(m) === JSON.stringify(got))) { setup.wait = 0.2; return; }
    if (!skip) setup.map[BUTTONS[setup.step]] = got;
    setup.step = skip ? BUTTONS.length : setup.step + 1;
    setup.wait = 0.35;
    if (setup.step >= BUTTONS.length) {
      padMaps[p.id] = padMap = setup.map; setup.active = false;
      try { localStorage.setItem("david-padmaps", JSON.stringify(padMaps)); } catch (e) {}
      toast(setup.map.x ? "Controller saved. X rolls, Y plays the harp." : "Controller saved.");
    }
  }
}
// Start the setup by itself the first time a controller shows up with no saved buttons.
addEventListener("gamepadconnected", e => { if (!padMaps[e.gamepad.id] && !setup.active) setTimeout(startSetup, 300); });
// Holding Select + Start on the controller (default layout) for 2 seconds also starts it.
let comboT = 0;
function checkCombo(dt) {
  const p = readPad(); if (!p || setup.active) { comboT = 0; return; }
  padMap = mapFor(p);
  const pressedCount = p.buttons.filter(b => b.pressed).length;
  const sel = padMap ? padControl(p, padMap.select) : !!(p.buttons[8] && p.buttons[8].pressed);
  const st = padMap ? padControl(p, padMap.start) : !!(p.buttons[9] && p.buttons[9].pressed);
  comboT = (sel && st) ? comboT + dt : 0;
  if (comboT > 2) { comboT = 0; startSetup(); }
}

let toastText = "", toastTime = 0;
function toast(t) { toastText = t; toastTime = 4; }

// ============================================================================
// Levels: World 1's four stages ("#1-1" ... "#1-4" in the address), and "#test", the old movement test.
// Built from simple commands (columns/rows are tiles). Screen is 20 tiles tall; ground surface is row 17.
// ============================================================================
const STAGE_HASH = (location.hash.match(/^#(\d-\d)$/) || [])[1];
const LEVEL_NAME = location.hash === "#test" ? "test" : STAGE_HASH || "1-1";
// the game opens on the World 1 map; a stage in the address ("#1-2") goes straight into it (key 1 = 1-1)
function backToMap() { history.replaceState(null, "", location.pathname + location.search); location.reload(); }
const LEVEL_STAGE = LEVEL_NAME === "test" ? "1-1" : LEVEL_NAME;   // which stage this is (for the Journal, the map and the saved stones)
const STAGE_NUM = +LEVEL_STAGE.split("-")[1];
// per stage: how long it is, which background, night or day
const STAGE_INFO = {
  test:  { cols: 150, bg: "w1" },
  "1-1": { cols: 228, bg: "w1", name: "The Hills of Bethlehem" },
  "1-2": { cols: 228, bg: "w1_2", name: "The Wandering Flock" },
  "1-3": { cols: 258, bg: "w1_3", name: "The Rocky Pastures" },
  "1-4": { cols: 322, bg: "w1_4", name: "The Lion's Territory", night: true, nightSky: true },   // nightSky: Glen's own night sky (not tinted)
}[LEVEL_NAME];
const T = TUNE.TILE;
const ROWS = 20, GR = 17;
const MAIN_COLS = STAGE_INFO.cols;          // the stage itself...
const COLS = MAIN_COLS + 120;               // ...and, past its end, space for its caves (separate rooms you go into)
const solid = [...Array(ROWS)].map(() => Array(COLS).fill(0));     // 0 empty, 1 earth, 2 stone, 3 wall, 4 boulder, 5 fake rock (walk through it)
const oneway = [...Array(ROWS)].map(() => Array(COLS).fill(false));
const gourds = [], labels = [], decor = [], pickups = [], snakes = [], fires = [];
let lionSpawn = null, arenaX = Infinity, fold = null;
const ground = (c0, c1) => { for (let c = c0; c <= c1; c++) for (let r = GR; r < ROWS; r++) solid[r][c] = 1; };
const block = (c, r, w, h, mat = 2) => { for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) solid[y][x] = mat; };
const rock = (c, r, w, h) => block(c, r, w, h, 2);
const pillar = (c, r, w) => block(c, r, w, ROWS - r, 2);   // a rock column standing up out of a pit
const wall = (c, r, w, h) => block(c, r, w, h, 3);   // dry-stone wall
const boulder = (c, r, w, h) => block(c, r, w, h, 4); // half-buried boulder
const fakeRock = (c, r, w, h) => block(c, r, w, h, 5); // looks like rock, but you can walk into it (a secret)
// a carved wall (material 7): solid until you enter the first `need` pieces of the throw at it (world1.js)
const codeWalls = [];
const codeWall = (c, r, w, h, need) => { block(c, r, w, h, 7); codeWalls.push({ c, r, w, h, need, open: false }); };
const darkZones = [];   // the dark inside of a cave (drawn behind everything in front)
const caveDark = (c, r, w, h) => darkZones.push({ c, r, w, h });
// Caves (like Mario's pipes): a cave-mouth picture in the stage, and a separate dark room built past the stage's end.
// Press Up at the mouth to go in; Up at the daylight inside to come back out.
const rooms = [], doors = [], caveBats = [];
let roomNext = MAIN_COLS + 6;
const caveRoom = w => {   // returns the room; build its insides with c0 + offsets. Floor is row 17, ceiling rows 0-2.
  const c0 = roomNext; roomNext += w + 8;
  rock(c0 - 3, 0, 3, ROWS); rock(c0 + w, 0, 3, ROWS); rock(c0, 0, w, 3); block(c0, GR, w, ROWS - GR, 2);
  const room = { c0, w, exitX: (c0 + 2) * T };
  rooms.push(room); return room;
};
// where the opening is in each cave picture (fraction of its width from the left), and the picture's width in pixels
const CAVE_MOUTH = { cave_1: { at: 0.69, w: 857 }, cave_2: { at: 0.76, w: 684 } };
const caveDoor = (name, c, size, room) => {
  deco(name, c, 16, size);
  const m = CAVE_MOUTH[name], x = c * T + T / 2 + (m.at - 0.5) * m.w * size * 0.85;
  const door = { x, y: GR * T, room }; room.door = door; doors.push(door); return door;
};
// rock inside a cave, drawn with Glen's art instead of square tiles (material 6: solid, but the tile drawing skips it)
const caveFeatures = [];
const hangRock = (c, r, w, h) => { block(c, r, w, h, 6); caveFeatures.push({ kind: "hang", c, r, w, h }); };    // stalactites
const slabRock = (c, r, w, h) => { block(c, r, w, h, 6); caveFeatures.push({ kind: "slabs", c, r, w, h }); };   // stacked cave ledges
const bat = (c, r = 3) => caveBats.push({ x: c * T + T / 2, y: r * T + 16, hx: c * T + T / 2, hy: r * T + 16, state: "hang", t: Math.random() * 2, vx: 0, vy: 0, alpha: 1, facing: 1 });
const plat = (c, r, w) => { for (let x = c; x < c + w; x++) oneway[r][x] = true; };
// crumbling ledges: shake when you land on them, then drop away (and come back a few seconds later)
const crumbles = [];
const crumble = (c, r, w) => { plat(c, r, w); crumbles.push({ c, r, w, state: "solid", t: 0 }); };
// rope bridges: planks on ropes across a gap (stand on them like a ledge)
const bridges = [];
const bridge = (c, r, w) => { plat(c, r, w); bridges.push({ c, r, w }); };
const gourd = (c, r, hanging = false) => gourds.push({ x: c * T + T / 2, y: (r + 1) * T, alive: true, hanging });
const label = (c, r, text) => labels.push({ x: c * T, y: r * T, text });
// decoration: an item image standing on row r (its bottom on the top of row r+1); layer "back" or "front"
const deco = (name, c, r, size = 1, layer = "back", surprise = null) => decor.push({ name, x: c * T + T / 2, y: (r + 1) * T, size, layer, surprise, shaken: false, shakeT: 0 });
const bees = [], hornets = [];
const bee = (c, k) => bees.push({ hx: c * T + T / 2, k, t: k * 1.6, x: 0, y: 0, facing: 1, gone: false, alpha: 1, vx: 0, vy: 0 });
const hornet = (c, r, kind = "hornet") => hornets.push({ kind, hx: c * T + T / 2, hy: (r + 1) * T, x: c * T + T / 2, y: (r + 1) * T, state: "hover", t: Math.random() * 3, facing: -1, gone: false, alpha: 1, vx: 0, vy: 0 });
const raven = (c, r) => hornet(c, r, "raven");   // ravens dive at you on open ground, like the hornets but bigger
let beesAngry = false;   // sling a honeybee and the honey is gone (Shepherd's Judgment)
const olives = [];   // the "coins"
const olive = (x, y, kind) => olives.push({ x, y, kind: kind || (Math.random() < 0.5 ? "green" : "purple"), taken: false, t: Math.random() * 6, vy: 0, falling: false, placed: true });
const oliveRow = (c0, r, n, step = 1) => { for (let k = 0; k < n; k++) olive(c0 * T + T / 2 + k * step * T, (r + 1) * T - 14); };
const oliveArc = (c0, r, n) => { for (let k = 0; k < n; k++) { const f = k / (n - 1); olive(c0 * T + T / 2 + k * T, (r + 1) * T - 14 - Math.sin(f * Math.PI) * 110); } };
const food = (name, c, r) => pickups.push({ name, x: c * T + T / 2, y: (r + 1) * T, t: Math.random() * 6, taken: false });
// snakes stand on row r (default: the ground). "whip" = the harmless green whip snake (leave it alone: it eats the rats)
const snake = (kind, c, r = GR - 1) => snakes.push({ kind, x: c * T + T / 2, y: (r + 1) * T, home: c * T + T / 2, state: "idle", t: 0, facing: -1, gone: false, alpha: 1 });
// campfires: the checkpoint. who/say: the person sitting there, and what they tell David
const campfire = (c, r = GR - 1, who = null, say = null, teach = null) => fires.push({ x: c * T + T / 2, y: (r + 1) * T, lit: false, who, say, teach });
// a word from someone along the way, shown when David reaches this column
const talks = [];
const talk = (c, who, say, teach = null) => talks.push({ x: c * T, who, say, teach, done: false });
// Moves are taught by people, never found (DESIGN §3c). Learned skills are kept in the save ("davidProgress".skills).
//   aimUp: Shammah, 1-1 · harpCall: Hanan, 1-2 (the harp gathers sheep) · roll: Shammah, 1-3 · charge: Hanan, 2-1
// The movement test (#test) and "?allskills" have everything.
const SKILL_NAMES = { aimUp: "Aim up: hold Up as you throw", harpCall: "The harp calls lost sheep to you", roll: "Roll: hold Down, then press A", charge: "Charged sling: hold B" };
const skills = new Set();
try { for (const k of JSON.parse(localStorage.getItem("davidProgress") || "{}").skills || []) skills.add(k); } catch (e) {}
const ALL_SKILLS = LEVEL_NAME === "test" || new URLSearchParams(location.search).has("allskills");
const hasSkill = k => ALL_SKILLS || skills.has(k);
function learnSkill(k) {
  if (!k || skills.has(k)) return;
  skills.add(k);
  try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.skills = [...skills]; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  setTimeout(() => { toast("New skill: " + SKILL_NAMES[k]); if (typeof chime === "function") { chime(4); setTimeout(() => chime(7), 150); } }, 2500);
}
// ground animals: "fox" (goes for your lamb), "jackal" (steals it and runs), "ram" (charges; roll under it)
const critters = [];
const critter = (kind, c, r = GR - 1, range = 0) => critters.push({ kind, x: c * T + T / 2, y: (r + 1) * T, y0: (r + 1) * T, home: c * T + T / 2, range: range * T, vx: 0, vy: 0, onGround: true,
  state: "idle", t: Math.random(), facing: -1, gone: false, alpha: 1 });
const specials = [];   // hidden special stones (like Mario's dragon coins); saved for the Power Sling
const special = (c, r) => specials.push({ x: c * T + T / 2, y: (r + 1) * T, taken: false, t: Math.random() * 6 });
// lost sheep. how: "graze" (just reach it), "ledge" (up somewhere), "cast" (on its back: press Down next to it),
// "thorns" (wool caught in a thorn bush: sling the bush), "one" (The One: the hardest to reach)
const lost = [];
const lostSheep = (kind, c, r, how = "graze") => lost.push({ kind, how, one: how === "one", hx: c * T + T / 2, hy: (r + 1) * T });
// the end of every stage: the family sheepfold, with the gatepost at column p (the fold's walls and the end of the level follow it)
const sheepfold = p => {
  ground(p - 12, MAIN_COLS - 1);
  for (let c = p + 4; c <= p + 14; c += 3.4) deco("stone_wall", c, 16, 1.15, "back");
  fold = { postC: p, endC: p + 15 };
  rock(p + 16, 4, MAIN_COLS - p - 16, 13);
};

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
} else if (LEVEL_NAME === "1-1") {
  // ---- 1-1 The Hills of Bethlehem: run, jump, the sling, aiming up, and "look before you throw" ----
  ground(0, 30);
  deco("olive_tree", 4, 16, 1.0); food("grapes", 10, 16);
  talk(6, "Eliab", "Still playing with that sling, little brother? Sheep don't need a warrior. They need a babysitter.");
  oliveRow(6, 16, 5); wall(14, 15, 3, 2); oliveArc(13, 14, 5);
  rock(20, 14, 3, 3); oliveRow(20, 13, 3);                     // a taller step: hold A for a higher jump
  lostSheep("sheepblack", 26, 16);                             // the first lost sheep: just walk up to it
  // a tiny gap you can't fail
  ground(33, 72);
  talk(36, "Shammah", "Ignore him. Watch: hold Up and press B, and you can hit the high ones.", "aimUp");
  rock(40, 13, 3, 4); gourd(41, 12);                           // a gourd on the rock: sling it
  gourd(46, 7, true); gourd(50, 6, true);                      // hanging gourds: aim up
  special(41, 6);                                              // high over the rock: jump from the top, then flip
  oliveArc(44, 16, 6);
  deco("date_palm", 55, 16, 1.1);                              // jump into the branches: dates
  snake("cobra", 64); food("bread", 68, 16);                   // the first snake: sling it from a distance
  oliveRow(58, 16, 4);
  // a wider gap
  ground(76, 140);
  campfire(80, GR - 1, "Hanan", "The brown one with the hood will strike you. The thin green one won't hurt a soul, and it eats the rats. Look before you throw, boy.");
  deco("tent", 85, 16, 1.0);
  snake("whip", 92);                                           // harmless: leave it be
  snake("viper", 99);                                          // this one bites
  lostSheep("sheep", 104, 16, "thorns");                       // caught in the thorns: sling the bush
  oliveRow(93, 16, 4); oliveArc(100, 16, 5);
  deco("beehive_tree", 110, 16, 1.2); food("honey", 112, 16);
  for (let k = 0; k < 4; k++) bee(110, k);                     // honeybees: harmless. Leave them be and the honey is yours.
  hornet(119, 11);                                             // hornets dive at you: sling them
  food("poison_berries", 123, 16); wall(125, 15, 3, 2); food("cheese", 126, 14);   // berries or cheese? look before you eat
  food("barley", 117, 16);                                     // Ruth gleaned barley in these fields
  plat(129, 13, 4); plat(135, 10, 4);
  lostSheep("lambblack", 136, 9, "ledge");                     // up on the ledge: climb to it, or play the harp below
  special(138, 4);                                             // high above the ledge: flip
  oliveRow(129, 12, 4); oliveRow(135, 9, 4);
  // gap
  ground(146, 200);
  deco("fig_tree", 150, 16, 1.0, "back", "special");           // jump into it: figs, and a stone of remembrance
  boulder(153, 14, 6, 3);
  rock(162, 13, 3, 4); lostSheep("sheep", 167, 16);            // a sheep grazing behind the rock
  snake("viper", 170);
  deco("olive_tree", 173, 16, 1.15, "back", "golden_olive");
  rock(178, 13, 2, 4); food("fig_cake", 179, 12);              // step up onto the rock
  plat(182, 5, 3);                                             // a shelf 8 tiles above the rock: out of reach of one jump (the double jump reaches ~9)
  lostSheep("lamb", 183, 4, "one");                            // The One, bleating up there. Come back with the double jump (World 5)
  talk(176, "David", "I can hear a lamb up there... It's too high to reach from here. Some day.");
  lostSheep("ram", 192, 16);                                   // the old ram, off by himself: the harp brings him
  oliveRow(186, 16, 6);
  sheepfold(206);
} else if (LEVEL_NAME === "1-2") {
  // ---- 1-2 The Wandering Flock: the harp gathers them, foxes go for your lamb, a cast sheep, a neighbour's ram ----
  ground(0, 40);
  campfire(6, GR - 1, "Hanan", "Count them every morning and every night. Sheep know their shepherd's voice, and they know your song. Play the harp (Select): the lost ones will come to it.", "harpCall");
  oliveRow(10, 16, 5);
  lostSheep("ram", 30, 16);                                    // a ram that isn't yours: the neighbour's (bring it home too)
  critter("fox", 37);
  ground(44, 98);
  rock(50, 14, 6, 3); rock(56, 12, 5, 5);
  lostSheep("sheepblack", 58, 11, "ledge");                    // up on the rocks: play the harp below and it comes down
  oliveRow(50, 13, 5);
  deco("olive_tree", 64, 16, 1.1, "back", "golden_olive");
  talk(66, "Hanan", "A sheep on its back can't get up by itself. Leave it and it dies. Roll it over.");
  lostSheep("sheep", 72, 16, "cast");                          // cast: press Down next to it
  critter("fox", 80); oliveArc(76, 16, 6);
  lostSheep("sheep", 90, 16, "thorns");                        // sling the thorn bush
  snake("viper", 95);
  // a gully
  ground(103, 170);
  campfire(106, GR - 1, "The neighbour", "That's my ram you've got with yours. Most boys would keep him. If you find your neighbour's sheep, you bring it home.");
  // a cave in the hillside: The One is somewhere at the back of it (press Up at the mouth)
  {
    const R = caveRoom(46), c = R.c0;
    caveDoor("cave_1", 121, 0.5, R);
    oliveRow(c + 5, 16, 6);                                     // olives: oil for the lamp
    bat(c + 9); bat(c + 17); bat(c + 26); bat(c + 34);
    hangRock(c + 11, 3, 2, 2); hangRock(c + 24, 3, 3, 3); hangRock(c + 36, 3, 2, 2);   // stalactites hang down from the ceiling
    slabRock(c + 14, 15, 3, 2); slabRock(c + 20, 13, 4, 4); plat(c + 27, 11, 4); oliveRow(c + 27, 10, 4);
    special(c + 29, 6);                                         // above the ledge: flip
    slabRock(c + 38, 12, 6, 5);
    lostSheep("lamb", c + 41, 11, "one");                       // The One, at the very back
    food("figs", c + 33, 16);
  }
  oliveRow(110, 16, 6);
  critter("fox", 140); critter("fox", 152);
  plat(145, 13, 4); lostSheep("lambblack", 146, 12, "ledge");   // 4 tiles up: a single jump (no double jump until World 5)
  special(147, 6);
  deco("fig_tree", 160, 16, 1.0, "back", "special");
  food("figs", 157, 16);
  // the gully again
  ground(175, 200);
  deco("pomegranate_tree", 196, 16, 0.75);                     // jump into it: pomegranates
  critter("fox", 190); oliveArc(178, 16, 8);
  sheepfold(206);
} else if (LEVEL_NAME === "1-3") {
  // ---- 1-3 The Rocky Pastures: the roll, crumbling ledges, rope bridges, a charging ram, ravens, a hidden cave ----
  ground(0, 22);
  rock(10, 15, 3, 2); rock(15, 13, 3, 4); oliveRow(15, 12, 3);
  crumble(24, 15, 3);                                          // it shakes when you land: keep moving
  ground(29, 60);
  raven(36, 7);
  talk(38, "Shammah", "Too low to walk through? Get low and tuck, like when we were kids rolling down the hill. (Hold Down, then press A)", "roll");
  rock(42, 11, 10, 4);                                         // a low passage: roll (or crawl) under
  oliveRow(42, 16, 10);
  lostSheep("sheep", 56, 16);                                  // on the far side of the passage
  bridge(61, GR, 6);                                           // a rope bridge over the drop
  ground(67, 100);
  rock(69, 15, 3, 2); rock(72, 13, 20, 4);                     // up onto a long rock shelf...
  critter("ram", 88, 12, 15);                                  // ...where a wild ram charges: roll under it
  lostSheep("sheepblack", 90, 12, "ledge");
  special(81, 7); oliveArc(74, 12, 7);
  // a run of crumbling ledges over a deep drop
  crumble(102, 14, 2); crumble(106, 12, 2); crumble(110, 14, 2);
  ground(114, 150);
  campfire(118, GR - 1, "The shepherd girl", "My grandmother says these rocks were here before anyone. Storms come and go, and they don't move. She says God is like that.");
  rock(124, 14, 3, 3); rock(128, 11, 3, 6); plat(133, 8, 3); lostSheep("lamb", 134, 7, "ledge");
  raven(130, 4);
  rock(134, 14, 2, 3);                                         // a step up, so the big rock can be climbed from the ground too (no one gets stuck below it)
  rock(138, 10, 13, 7); oliveRow(139, 9, 10);                   // a big rock to cross...
  for (let x = 139; x <= 146; x++) for (let r = 13; r <= 16; r++) solid[r][x] = 0;   // ...with a hollow inside it
  codeWall(138, 13, 1, 4, 2);                                  // sealed with a carving: the first two pieces of the throw (after World 2)
  olive(143 * T + T / 2, 16 * T + 4, "golden"); oliveRow(140, 16, 3); oliveRow(144, 16, 3);
  // rope bridge between two rock pillars
  pillar(151, 13, 2); bridge(153, 13, 6); pillar(159, 13, 2);
  raven(156, 6);
  ground(161, 205);
  // a tall cave in the limestone: a bigger cave with a drop inside, and The One at the back
  {
    const R = caveRoom(52), c = R.c0;
    caveDoor("cave_2", 167, 0.42, R);
    oliveRow(c + 4, 16, 5); bat(c + 8); bat(c + 15); bat(c + 22); bat(c + 31); bat(c + 40);
    hangRock(c + 10, 3, 2, 3); hangRock(c + 30, 3, 3, 2);
    slabRock(c + 10, 14, 3, 3);
    for (let k = c + 16; k <= c + 21; k++) for (let r = GR; r < ROWS; r++) solid[r][k] = 0;   // a drop in the cave floor...
    crumble(c + 17, 15, 2); oliveArc(c + 15, 14, 7);           // ...with a crumbling ledge over it
    slabRock(c + 25, 12, 4, 5); plat(c + 31, 9, 4); food("bread", c + 32, 8);
    special(c + 33, 4);
    slabRock(c + 38, 13, 3, 4); slabRock(c + 43, 10, 9, 7);
    lostSheep("lamb", c + 48, 9, "one");                        // The One, up at the back
  }
  critter("ram", 182, GR - 1, 14);                            // another ram, on open ground
  lostSheep("sheep", 190, 16, "thorns");
  snake("viper", 198); oliveArc(184, 16, 6);
  crumble(206, 15, 3);
  ground(211, 230);
  lostSheep("sheep", 214, 16, "cast");
  deco("olive_tree", 220, 16, 1.0, "back", "special");
  sheepfold(236);
} else if (LEVEL_NAME === "1-4") {
  // ---- 1-4 The Lion's Territory, at night: jackals steal lambs, vipers in the dark, then the lion ----
  ground(0, 45);
  oliveRow(8, 16, 5);
  critter("jackal", 30);
  snake("viper", 40);
  ground(48, 100);
  lostSheep("sheep", 56, 16);
  critter("jackal", 64); raven(70, 7);
  plat(75, 13, 4); lostSheep("sheepblack", 76, 12, "ledge"); special(78, 7);
  oliveArc(82, 16, 6); food("bread", 92, 16);
  crumble(102, 15, 2);
  ground(106, 200);
  campfire(110, GR - 1, "Hanan", "You hear it? He's been following the flock for three nights.");
  deco("fig_tree", 120, 16, 1.0, "back", "special");
  critter("jackal", 128); snake("viper", 134);
  lostSheep("sheep", 148, 16, "thorns");
  critter("jackal", 150);
  lostSheep("sheep", 157, 16, "cast");
  rock(170, 13, 3, 4); rock(174, 9, 3, 8); special(175, 3);
  // a little shelter of stone with a carving on its door: The One is inside. The first piece of the throw opens it,
  // which Jesse gives you for beating the lion, so you can come straight back for it.
  rock(185, 12, 8, 1); codeWall(185, 13, 1, 4, 1); rock(192, 13, 1, 4);
  lostSheep("lamb", 189, 16, "one");
  lostSheep("ram", 197, 16);
  oliveRow(178, 16, 6);
  ground(204, 300);
  campfire(215, GR - 1, "Hanan", "You're of Judah, and Judah's sign is the lion. Don't run from this one. Watch for the crouch, and the tail.");
  deco("stone_wall", 220, 16, 1.0, "back");
  deco("cave", 274, 16, 1.7);                                  // the lion's den
  rock(286, 15, 3, 2);                                         // the back of the den: hop over it on the way home
  lionSpawn = { x: 265 * T, y: GR * T }; arenaX = 228 * T;
  sheepfold(300);
}

// "?at=160" in the address starts David at column 160 (handy for checking a spot in a level)
const AT = Number(new URLSearchParams(location.search).get("at")) || 3;
const spawn = { x: AT * T, y: GR * T }, lambSpawn = { x: (AT + 2) * T, y: GR * T };
let checkpoint = { ...spawn };
const isSolid = (c, r) => r >= 0 && r < ROWS && c >= 0 && c < COLS && solid[r][c] > 0 && solid[r][c] !== 5;
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

// The second jump in the air (the flip) is Tobi's "scout's leap", taught in World 5 (DESIGN §5e, 5-2).
// Until then David has one jump, and World 1-4 must never need two. "?flip" in the address turns it on for testing.
const CAN_DOUBLE_JUMP = LEVEL_NAME === "test" || new URLSearchParams(location.search).has("flip");   // (the movement test keeps it)
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
  if (b.y > ROWS * T + 400) {   // fell in a pit
    if (b === david) pitFall();
    else { b.fell = true; b.vx = b.vy = 0; b.y = ROWS * T + 400; }
  }
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
  if (caveDavid(d, dt)) return;   // walking into or out of a cave (world1.js)
  if (updateCodeEntry(d, dt)) return;   // entering the throw at a carved wall (world1.js)
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
      toast("\"I went out after him, and struck him, and rescued it out of his mouth.\" (1 Samuel 17:35)");
    }
    return;
  }
  if (d.carryHop > 0) d.carryHop -= dt;
  const dir = (held("right") ? 1 : 0) - (held("left") ? 1 : 0);
  const busy = d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "standup";

  // --- harp (Select): kneel and play while standing still
  if ((pressed("select") || pressed("y")) && d.onGround && !d.carrying && !busy && Math.abs(d.vx) < 30) {
    if (d.harp) { d.harp = false; setState("standup"); } else { d.harp = true; setState("kneel"); }
  }
  // Up, any direction, A or B: put the harp away and stand up
  if (d.harp && (dir !== 0 || pressed("up") || pressed("a") || pressed("b"))) { d.harp = false; setState("standup"); }

  // --- pick up / put down the lamb (Down, standing still, next to it)
  if (pressed("down") && d.onGround && !busy && !d.harp && Math.abs(d.vx) < 40) {
    if (d.carrying) { setState("putdown"); }
    else if (!lamb.stolen && Math.abs(lamb.x - d.x) < 95 && Math.abs(lamb.y - d.y) < 70) { setState("pickup"); d.vx = 0; lamb.carried = true; d.facing = Math.sign(lamb.x - d.x) || d.facing; }
  }

  // --- roll: Down + A on the ground (running, or from a crouch: he rolls the way he's facing)
  if (hasSkill("roll") && !d.carrying && !d.harp && d.onGround && !busy && ((held("down") && pressed("a")) || pressed("x"))) {
    if (dir) d.facing = dir;
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
    } else if (CAN_DOUBLE_JUMP && pressed("a") && !d.onGround && !d.flipUsed && d.coyote <= 0) {
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
    const aimUp = held("up") && hasSkill("aimUp"), aimDown = held("down") && !d.onGround;   // Down only aims while in the air (on the ground it's crouch)
    const ang = aimUp ? (held("left") || held("right") ? -Math.PI / 4 : -Math.PI / 2 + 0.04) : aimDown ? Math.PI / 4 : 0;
    stones.push({ x: d.x + d.facing * 30, y: d.y - (d.onGround ? 70 : 50), vx: Math.cos(ang) * TUNE.POWER_SPEED * d.facing, vy: Math.sin(ang) * TUNE.POWER_SPEED,
                  charged: true, power: true, life: 1.6, trail: [] });
    sfx("sling_power");
    toast(`Power Sling! (${d.specialStones} stone${d.specialStones === 1 ? "" : "s"} of remembrance left)`);
  }
  if (!d.carrying && !d.harp && !busy) {
    if (pressed("b") && d.throwT < 0) { d.charging = true; d.charge = 0; d.throwT = 0; d.thrown = false; }
    if (d.throwT >= 0 && !d.thrown) d.aimingUp = held("up") && hasSkill("aimUp");   // aim decided up to the moment the stone leaves
    if (d.charging) { d.charge += dt; if (released("b") || !held("b")) { d.charging = false; d.runThrow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED; } }
  }
  if (d.throwT >= 0) {
    if (!d.charging) d.throwT += dt;
    const dur = d.runThrow ? TUNE.RUN_THROW_TIME : TUNE.THROW_TIME;
    const relAt = d.runThrow ? dur * 9.5 / 12 : d.aimingUp ? dur * 9.5 / 12 : dur * 7 / 12;   // running and upward throws: the stone leaves at frame 10
    if (!d.thrown && d.throwT >= relAt) {
      d.thrown = true;
      const full = hasSkill("charge") ? Math.min(1, d.charge / TUNE.CHARGE_TIME) : 0;   // full power is taught in World 2
      const sp = full >= 1 ? TUNE.STONE_SPEED_CHARGED : TUNE.STONE_SPEED;
      const aimUp = held("up") && hasSkill("aimUp"), straightUp = aimUp && !(held("left") || held("right"));
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
  // remember the last solid ground he stood on (not a ledge that might crumble), for climbing back out of a pit
  if (d.onGround) {
    const r = Math.floor(d.y / T), cL = Math.floor((d.x - BODY_W) / T), cR = Math.floor((d.x + BODY_W) / T);
    if (isSolid(cL, r) && isSolid(cR, r)) d.safe = { x: d.x, y: d.y };
  }

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
  if (drawCaveDavid(d, x, y)) return;
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
    if (d.charging && d.charge >= TUNE.CHARGE_TIME && hasSkill("charge")) { // golden glow when fully charged
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
    case "idle":
      if (cave.room) drawSprite("david_light_lamp", 15, x, y, d.facing);   // in a cave: holding up the lamp
      else drawSprite("david_idle", frameOf("david_idle", t), x, y, d.facing);
      break;
    case "walk": {
      const rate = Math.max(0.6, Math.abs(d.vx) / TUNE.WALK_SPEED), nm = cave.room ? "david_walk_lamp" : "david_walk";
      drawSprite(nm, frameOf(nm, t * rate), x, y, d.facing); break;
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
  if (lamb.stolen) return;   // a jackal has it (world1.js)
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
  if (lamb.carried || lamb.stolen) return;
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
    for (const sn of snakes) if (!sn.gone && s.life > 0 && Math.abs(s.x - (sn.kind === "whip" ? sn.x : snakeMid(sn))) < 48 && s.y > sn.y - 70 && s.y < sn.y + 6) {
      sn.gone = true; sn.vx = Math.sign(s.vx) * 220; sn.vy = -480; if (!s.power) s.life = 0; stoneHit(s);
      if (sn.kind === "whip") { david.care = (david.care || 0) + 1; toast("That was the harmless green whip snake! It eats the rats. Look before you throw."); }
      else toast("Driven off!");
    }
    if (s.life > 0 && stoneHitsCritters(s)) s.life = 0;
    if (s.life > 0 && stoneHitsBats(s)) { s.life = 0; stoneHit(s, 0.4); }
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
    const m = matAt(c, r); if (!m || m === 3 || m === 4 || m === 5 || m === 6 || m === 7) continue;
    const rockFill = c >= MAIN_COLS ? terPattern("cave_rock_tile", 0.45) || lim : lim;   // in a cave: damp cave rock
    ctx.fillStyle = (m === 2 ? rockFill : sed) || (m === 2 ? "#c9b48c" : "#8b6a3e");
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
          else terStrip(start >= MAIN_COLS && TER.cave_rock_top && TER.cave_rock_top.naturalWidth ? "cave_rock_top" : "limestone_top", start * T - 3, c * T + 3, r * T - TUNE.TER_ROCKTOP_RISE, TUNE.TER_ROCKTOP_H);
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
      const on = c <= c1 && isOneway(c, r) && !specialPlat.has(c + "," + r);   // crumbling ledges and bridges are drawn in world1.js
      if (on && start < 0) start = c;
      if (!on && start >= 0) { drawLedgeRun(start * T, c * T, r * T - 4); start = -1; }
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
// a rock ledge from x0 to x1 (world coordinates, already translated), its top at y
function drawLedgeRun(x0, x1, y) {
  const cl = ITEM.cave_ledge;
  if (x0 > MAIN_COLS * T && cl && cl.naturalWidth) {   // inside a cave: Glen's damp, mossy cave ledge, stretched to fit
    const w = x1 - x0 + 16, h = Math.min(90, cl.naturalHeight * w / cl.naturalWidth);
    ctx.drawImage(cl, x0 - 8, y - h * 0.1, w, h); return;
  }
  const h = TUNE.TER_LEDGE_H;
  const lw = TER.ledge_left.naturalWidth * h / (TER.ledge_left.naturalHeight || 1);
  const rw = TER.ledge_right.naturalWidth * h / (TER.ledge_right.naturalHeight || 1);
  terStrip("ledge_mid", x0 + lw * 0.6, x1 - rw * 0.6, y, h);
  terPiece("ledge_left", x0 - 6, y, h);
  terPiece("ledge_right", x1 + 6 - rw, y, h);
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
  if (e.code === "Digit1") { location.hash = "1-1"; location.reload(); }
  if (e.code === "Digit5") backToMap();
  if (e.code === "Digit6" && typeof WorldMap !== "undefined") { if (Journal.active) return; WorldMap.open("journey"); }
  if (e.code === "Digit2") { location.hash = "test"; location.reload(); }
  if (e.code === "Digit4") {   // preview the Journal pages
    if (Journal.active && Journal.preview) Journal.close();
    else if (!Journal.active) Journal.openPreview(1);
  }
  if (e.code === "Digit3") { bgWorld = bgWorld === "w1" ? "w2" : "w1"; toast(bgWorld === "w1" ? "World 1 background" : "World 2 background (preview)"); }
});

let helpT = 12;
function drawHUD() {
  drawHearts(); drawSpecialCount(); drawLivesAndOil(); drawSheepCount(); drawChargeRing();
  if (!audioUnlocked) {
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(W / 2 - 230, H - 40, 460, 30);
    ctx.fillStyle = "#ffe08a"; ctx.font = "15px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Click the game once to turn on sound (the controller can't)", W / 2, H - 20); ctx.textAlign = "left";
  }
  if (helpT <= 0) {
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(10, 10, 600, 26);
    ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif";
    ctx.fillText("H = controls   1 = World 1-1   2 = movement test   3 = swap background   4 = Journal   5 = map", 18, 28);
  } else drawHelp();
  drawDialog();
  drawCodeEntry();
  drawToastAndSetup();
}
function drawHelp() {
  ctx.font = "15px sans-serif";
  const lines = [
    "Arrows: move (hold to run)   Z / Space = A: jump" + (CAN_DOUBLE_JUMP ? ", again in the air = flip" : ""),
    "X = B: sling (hold to charge; Up = aim up, Up+forward = diagonal, Down in the air = aim down)   A + B: Power Sling",
    "Hold Down + A (or V, SNES X): roll   Down next to the lamb: pick up / put down   Jump into trees: they drop fruit",
    "Shift = Select (SNES Y): play the harp   R: back to the campfire   M: set up a controller (NES or SNES)   H: hide this",
    "Controller: " + (readPad() ? (padMap ? "set up ✓  (M or hold Select+Start to redo)" : "connected, not set up yet: press M") : "none (press a button on it so the browser sees it)"),
  ];
  ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(10, 10, Math.max(...lines.map(l => ctx.measureText(l).width)) + 22, 14 + lines.length * 21);   // as wide as the longest line
  ctx.fillStyle = "#fff";
  lines.forEach((l, i) => ctx.fillText(l, 20, 32 + i * 21));
}
function drawToastAndSetup() {
  if (toastTime > 0) {
    ctx.font = "18px sans-serif";   // wrapped like a subtitle, the box sized to the words
    const words = toastText.split(" "), tl = []; let cur = "";
    for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > 900) { tl.push(cur); cur = w; } else cur = t; }
    tl.push(cur);
    const bw = Math.max(660, Math.max(...tl.map(l => ctx.measureText(l).width)) + 48), bh = 20 + tl.length * 24;
    ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, H - 40 - bh, bw, bh, 8); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.textAlign = "center";
    tl.forEach((l, i) => ctx.fillText(l, W / 2, H - 40 - bh + 28 + i * 24)); ctx.textAlign = "left";
  }
  if (setup.active) {
    ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.font = "34px sans-serif";
    ctx.fillText("Controller setup", W / 2, H / 2 - 60);
    ctx.font = "28px sans-serif"; ctx.fillStyle = "#ffe08a";
    const names = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", a: "A", b: "B", select: "SELECT", start: "START", x: "X (roll)", y: "Y (harp)" };
    ctx.fillText("Press " + names[BUTTONS[setup.step]] + " on the controller", W / 2, H / 2);
    ctx.font = "18px sans-serif"; ctx.fillStyle = "#ccc";
    ctx.fillText(`(${setup.step + 1} of ${BUTTONS.length})   Esc on the keyboard to cancel`, W / 2, H / 2 + 40);
    if (setup.step >= NES_BUTTONS) ctx.fillText("No X or Y (an NES controller)? Press START to finish.", W / 2, H / 2 + 70);
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
TER.cave_rock_tile = ITEM.cave_rock_tile; TER.cave_rock_top = ITEM.cave_rock_top;   // Glen's damp cave rock, used inside caves
function drawItem(name, x, y, size, alpha = 1) {   // (x, y) = bottom-centre
  const img = ITEM[name]; if (!img || !img.naturalWidth) return;
  const w = img.naturalWidth * size, h = img.naturalHeight * size;
  ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(img, Math.round(x - w / 2), Math.round(y - h), w, h); ctx.restore();
}

const FOOD = {   // heal amount; negative = poison
  grapes: 1, olives: 1, dates: 1, figs: 1, raisins: 1, bread: 1, cheese: 1, roasted_grain: 1, lentils: 2,
  fig_cake: 3, honey: 99, poison_berries: -1, wild_gourds: -1, pomegranate: 1, barley: 1,
};
const FOOD_TEXT = {
  bread: "Bread", cheese: "Sheep's cheese", grapes: "Grapes", figs: "Figs", dates: "Dates", honey: "Honey: his eyes brightened (1 Samuel 14:27)",
  fig_cake: "Fig cake (1 Samuel 25:18)", poison_berries: "Poison berries!", wild_gourds: "Wild gourds: death in the pot! (2 Kings 4:39-40)",
  lentils: "Lentils", raisins: "Raisins", olives: "Olives", roasted_grain: "Roasted grain",
  pomegranate: "Pomegranate: the spies brought them back from the promised land (Numbers 13:23)",
  barley: "Barley: Ruth gleaned it in these very fields of Bethlehem (Ruth 2)",
};

// hearts
david.maxHearts = TUNE.HEARTS; david.hearts = TUNE.HEARTS; david.inv = 0; david.deadT = 0; david.specialStones = 0;
david.lives = TUNE.LIVES; david.olives = 0; david.lampOil = 0; david.gathered = 0;   // gathered: every olive picked up this stage (for the tithe, home.js)
// olives, lamp oil and a fig cake bought at the market carry over from the home base (map.js progress)
try {
  const pr = JSON.parse(localStorage.getItem("davidProgress") || "{}");
  david.olives = pr.olives || 0; david.lampOil = pr.lampOil || 0;
  if (pr.figCake > 0 && LEVEL_NAME !== "test") {   // eaten now: one extra heart for this stage
    david.maxHearts++; david.hearts++; pr.figCake--; localStorage.setItem("davidProgress", JSON.stringify(pr));
    setTimeout(() => toast("You ate the fig cake: an extra heart for this stage."), 1500);
  }
} catch (e) {}
// the game is driving David (walking to the lamb, the hug, the gate): nothing can hurt him, and no hurt-blink
const inCutscene = () => david.state === "toLamb" || david.state === "rescue" || david.state === "finish" || david.state === "liftSheep" || david.state === "cave";
function hurtDavid(fromX) {
  const d = david;
  if (d.inv > 0 || d.deadT > 0 || inCutscene()) return;
  d.hearts--; d.inv = TUNE.HURT_INVINCIBLE;
  d.vx = Math.sign(d.x - fromX || -d.facing) * 360; d.vy = -560; d.onGround = false;
  d.harp = false; d.charging = false; d.throwT = -1;
  if (d.state !== "carry") setState("jump");
  if (d.hearts <= 0) { d.deadT = 1.2; d.lives--; toast(d.lives > 0 ? `Ouch! Back to the campfire... (${d.lives} ${d.lives === 1 ? "life" : "lives"} left)` : "Out of lives. Back to the start of the stage."); }
}
// a pit costs a heart and puts him back on the last solid ground he stood on (it's never back to the start)
function pitFall() {
  const d = david;
  d.vx = d.vy = 0;
  if (d.hearts <= 1) { d.x = (d.safe || checkpoint).x; d.y = (d.safe || checkpoint).y; d.inv = 0; d.hearts = 1; hurtDavid(d.x); return; }
  d.hearts--; d.inv = TUNE.HURT_INVINCIBLE;
  const s = d.safe || checkpoint; d.x = s.x; d.y = s.y; setState("idle");
  lamb.x = d.x - d.facing * 50; lamb.y = d.y; trail.length = 0;
  toast("Ouch! Watch your step.");
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
  resetCritters(); resetCrumbles(); resetCaves(); resetCodeWalls();
  resetAllSheep();
}
function respawn() {
  const d = david;
  leaveCaveNow();
  if (d.lives <= 0) restartStage();
  d.x = checkpoint.x; d.y = checkpoint.y; d.vx = d.vy = 0; d.hearts = d.maxHearts; d.inv = 1; d.deadT = 0; setState("idle");
  lamb.x = d.x - 50; lamb.y = d.y;
  if (lamb.stolen) for (const k of critters) if (k.kind === "jackal" && (k.state === "flee" || k.state === "wait")) Object.assign(k, { x: k.home, state: "idle", t: 0 });
  lamb.stolen = false;
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
function updateGourds() {   // walking into a gourd picks it up, like food, and it's poison (2 Kings 4:39-40). Sling them instead.
  for (const g of gourds) if (g.alive && !g.hanging && Math.abs(g.x - david.x) < 34 && david.y > g.y - 50 && david.y - david.h < g.y && david.deadT <= 0 && david.inv <= 0) {
    g.alive = false; toast(FOOD_TEXT.wild_gourds); hurtDavid(g.x);   // (a hurt that ends a life puts its own message up)
    for (let k = 0; k < 10; k++) bits.push({ x: g.x, y: g.y - 20, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 380, life: 0.6, color: "#7a2" });
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
    if (s.kind === "whip") { updateWhipSnake(s, dt); continue; }
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
    if (s.kind === "whip") {   // slim, green, gliding: the harmless one
      drawSprite("snake_strike", s.state === "leave" ? [7, 6, 7, 0][Math.floor(s.t / 0.15) % 4] : 7, x, s.y, s.facing, 0.85, s.alpha, WHIP_FILTER);
      continue;
    }
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
    if (near && !f.lit) {
      f.lit = true; checkpoint = { x: f.x - 30, y: f.y };
      if (f.who) sayLine(f.who, f.say); else toast("Campfire: checkpoint. Play the harp here (Select) to rest.");
      learnSkill(f.teach);
    }
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
      if (david.x > arenaX && david.x < MAIN_COLS * T) { L.vx = 0; L.facing = Math.sign(david.x - L.x) || -1; setLion("sitTaunt"); helpT = 0;
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
  if (sh.one) startOneMoment();   // the game pauses for Jesus' words about the one (world1.js)
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
// the k-th resting place by a fire with unbroken ground between it and the fire (never over or across a pit or a gully)
function restSpot(fire, k) {
  const r = Math.round(fire.y / T), under = x => { const c = Math.floor((fire.x + x) / T); return isSolid(c, r) || isOneway(c, r); };
  const ok = x => { for (let o = 0; Math.abs(o) <= Math.abs(x) + 24; o += Math.sign(x) * 8) if (!under(o)) return false; return true; };
  for (let n = 0, found = -1; n < 40; n++) {
    const x = REST_SPOTS[n % REST_SPOTS.length] * (1 + Math.floor(n / REST_SPOTS.length) * 0.25);
    if (ok(x) && ++found === k) return x;
  }
  return 60;
}
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
      const spot = restSpot(fire, i);
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
    if (hasSkill("harpCall") && sh.state === "lost" && !sh.one && d.state === "harp" && Math.abs(dx) < TUNE.HARP_CALL_RANGE && Math.abs(dy) < 360) {
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
    sh.spot = restSpot(sh.fire, k);
    sh.state = "toFire"; sh.walkT = 0; sh.stuckT = 0;
  }
  if (sh.state === "atFire") { sh.moved = 0; sh.stillT += dt; return; }
  sh.walkT += dt;
  const tx = sh.fire.x + sh.spot, dir = Math.sign(tx - sh.x) || 1;
  const onScreen = sh.x > camX - 60 && sh.x < camX + W + 60;
  if (Math.abs(tx - sh.x) < 8 || !onScreen || sh.walkT > 10 || sh.y > GR * T + 60 || sh.x > MAIN_COLS * T) {
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
// top catches carry over from stage to stage (kept in the browser until the game has a real save)
let gateTops = 0;
try { gateTops = +localStorage.getItem("davidGateTops") || 0; } catch (e) {}
function saveGateTops() { try { localStorage.setItem("davidGateTops", gateTops); } catch (e) {} }
function gateOlive() {   // the golden olive on the gatepost: f = 0 at the bottom (head height) up to 1 at the top
  const k = (performance.now() / 1000 / TUNE.GATE_OLIVE_TRIP) % 2, f = k < 1 ? k : 2 - k;
  return { x: postX(), y: goalCordY(f), f };
}
let chimeCtx = null;
function chime(k) {   // a little bell for each sheep counted in
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (chimeCtx.state === "suspended") chimeCtx.resume();
    const t0 = chimeCtx.currentTime, o = chimeCtx.createOscillator(), g = chimeCtx.createGain();
    o.type = "sine"; o.frequency.value = 660 * Math.pow(2, [0, 2, 4, 7, 9, 12, 14, 16][k % 8] / 12);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.25 * sfxMul()), t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(g).connect(chimeCtx.destination); o.start(t0); o.stop(t0 + 0.65);
  } catch (e) {}
}
function updateFinish(dt) {
  if (!fold || (!finish.active && david.x > MAIN_COLS * T)) return;   // (past the stage's end = in a cave)
  const px = postX(), d = david;
  if (!finish.active) {
    // the closed gate blocks the way: jump over it (and go for the golden olive while you're up there)
    if (d.deadT <= 0 && d.y > gateTopAt() + 4 && d.x + BODY_W / 2 > px - 10 && d.x < px) { d.x = px - 10 - BODY_W / 2; d.vx = Math.min(0, d.vx); }
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
      finish.gold = go.f >= TUNE.GATE_GOLD_AT;
      finish.bonus = finish.gold ? TUNE.GATE_BONUS_MAX : TUNE.GATE_BONUS_MIN + Math.round(go.f * (TUNE.GATE_BONUS_MAX - TUNE.GATE_BONUS_MIN));
      finish.life = false;
      if (finish.gold) {
        gateTops++; finish.life = gateTops >= TUNE.GATE_TOPS_FOR_LIFE;
        if (finish.life) { gateTops = 0; d.lives++; }
        saveGateTops();
      }
      for (let i = 0; i < finish.bonus; i++) {
        d.olives++; d.gathered++;
        if (d.olives >= TUNE.OLIVES_PER_LIFE) { d.olives -= TUNE.OLIVES_PER_LIFE; d.lives++; }
      }
      finish.pop = { x: px, y: go.y, t: 0, text: `+${finish.bonus}` };
      for (let k = 0; k < 14; k++) bits.push({ x: go.x, y: go.y, vx: (Math.random() - 0.5) * 380, vy: -Math.random() * 380, life: 0.8, color: k % 2 ? "#ffd84a" : "#fff2b0" });
      if (finish.life) { sfx("extra_life"); toast(`Third top catch! +${finish.bonus} olives and +1 life`); }
      else if (finish.gold) { sfx("olive_pickup", undefined, 0.9, 1.2); toast(`Caught it at the top! +${finish.bonus} olives (${gateTops} of ${TUNE.GATE_TOPS_FOR_LIFE} toward an extra life)`); }
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
  if (finish.phase === "clear" && finish.t > 1 && (pressed("a") || pressed("b") || pressed("start"))) {
    // David writes in his Journal, then the stage starts again (until the map exists)
    saveStones(LEVEL_STAGE, specials.filter(o => o.taken).length);
    stageCleared(LEVEL_STAGE, { sheep: finish.found, total: finish.total, one: finish.one, stones: specials.filter(o => o.taken).length, olives: david.olives, lampOil: david.lampOil, gathered: david.gathered });
    Journal.open({ world: 1, stage: STAGE_NUM, onClose: () => backToMap() });
  }
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
  if (autoWalk(d, postX() + GOAL_GAP + 3.4 * T, dt)) d.facing = -1;   // inside the fold, past the swung-open gate
}
// a wooden post: (x, bottom) at the foot, w wide, h tall
function woodPost(x, bottom, w, h) {
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, "#4a2f18"); g.addColorStop(0.35, "#8a6038"); g.addColorStop(0.7, "#6e4a2a"); g.addColorStop(1, "#3c2512");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2, bottom - h, w, h + 6, [w / 2, w / 2, 2, 2]); ctx.fill();
  ctx.strokeStyle = "rgba(40,22,10,0.45)"; ctx.lineWidth = 1.5;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - w / 4 + k * w / 8, bottom - h + 10 + k * 7); ctx.lineTo(x - w / 4 + k * w / 8 + (k % 2 ? 2 : -2), bottom - 4); ctx.stroke(); }
}
// The goal is two tall posts like Super Mario World's: the far one on the LEFT (paler and hazier, behind David)
// and the near one on the RIGHT (bold, in front of him), so he passes between them heading right.
// The golden olive rides a cord strung between the posts, sliding up and down. The sheepfold gate hangs off the
// near post and reaches back to the far one; opening, it swings into the fold along the wall.
const GOAL_GAP = 1.5 * T;   // each post this far from the middle (far post to the left, near post to the right)
const GATE_FAR = { lift: 22, scale: 0.9, filter: "brightness(1.12) saturate(0.55) contrast(0.8)" };   // the far post: a little higher up the grass, smaller, hazier
// Glen's gate art, baked once with a shadow on its hinge end (the far post, further away from us)
let gateShaded = null;
function gateArt() {
  if (gateShaded) return gateShaded;
  const img = ITEM.gate_panel; if (!img || !img.naturalWidth) return null;
  const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0);
  g.globalCompositeOperation = "source-atop";   // the art's hinges are on its left, the far post's side
  const gr = g.createLinearGradient(0, 0, c.width, 0); gr.addColorStop(0, "rgba(20,10,0,0.38)"); gr.addColorStop(1, "rgba(20,10,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
  return (gateShaded = c);
}
// a post: Glen's rope-wrapped post if it's loaded (far = the hazy one), otherwise the drawn one
function gatePost(x, bottom, w, h, far) {
  const img = ITEM.gate_post;
  ctx.save(); if (far) ctx.filter = GATE_FAR.filter;
  if (!img || !img.naturalWidth) woodPost(x, bottom, w, h);
  else { const pw = img.naturalWidth * h / img.naturalHeight * 0.85; ctx.drawImage(img, x - pw / 2, bottom - h, pw, h + 4); }
  ctx.restore();
}
function goalCordY(f) { const by = GR * T; return by - 62 - (TUNE.GATE_POST_TILES * T - 66) * f; }
const GATE_H = 2.3 * T;   // the gate's height in the middle (David has to jump it)
// where everything stands, on screen
function goalSpots(camX) {
  const mx = postX() - camX, by = GR * T;
  return { mx, by, nx: mx + GOAL_GAP, nby: by + 6, fx: mx - GOAL_GAP, fby: by - GATE_FAR.lift };   // n = near post (right), f = far post (left)
}
// the gate: hinged on the far (left) post, its free end at the near (right) post when closed. It opens to the
// back, swinging away from us into the fold, so it's always drawn behind David and the sheep; the near post is in
// front of everything, so they pass between the posts.
function drawGate(camX) {
  const { nx, nby, fx, fby } = goalSpots(camX);
  const o = finish.gateOpen, k = o * o * (3 - 2 * o);
  // the free end: closed at the near post; open, swung back to stand edge-on, just behind and to the right of the hinge
  const ex = nx + (fx + 0.35 * T - nx) * k, ey = nby + (fby - 30 - nby) * k;
  const hh = GATE_H * 0.86, he = GATE_H * (1.14 - 0.38 * k);   // the far end is shorter (further away)
  const at = (u, v) => [fx + (ex - fx) * u, (fby - hh * v) + ((ey - he * v) - (fby - hh * v)) * u];   // u: hinge->free end, v: bottom->top
  const art = gateArt();
  ctx.save();
  if (k > 0) ctx.filter = `brightness(${1 - 0.25 * k})`;   // turning away from the light as it swings back
  if (art) {   // Glen's gate, bent between the posts in thin strips so it reads as a gate seen at an angle
    const N = 36, sw = art.width / N;
    for (let n = 0; n < N; n++) {
      const u0 = n / N, u1 = (n + 1) / N, [ax, ay] = at(u0, 1.04), [bx2, by2] = at(u1, 1.04), [cx, cy] = at(u0, -0.02);
      ctx.save(); ctx.transform((bx2 - ax) / sw, (by2 - ay) / sw, (cx - ax) / art.height, (cy - ay) / art.height, ax, ay);
      ctx.drawImage(art, n * sw, 0, sw + 0.8, art.height, 0, 0, sw + 0.8, art.height); ctx.restore();
    }
  } else {   // (until the art loads) three rails and two stiles
    ctx.lineCap = "round";
    for (const v of [0.18, 0.55, 0.92]) {
      const [x0, y0] = at(0.02, v), [x1, y1] = at(0.98, v);
      ctx.strokeStyle = "#3c2512"; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = "#7a5432"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    for (const u of [0.04, 0.96]) { const [x0, y0] = at(u, 0.05), [x1, y1] = at(u, 1.02); ctx.strokeStyle = "#5a3a1e"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  }
  ctx.restore();
}
function gateTopAt() { return GR * T - GATE_H; }   // where David must clear it, at the middle
function drawFold(camX) {   // behind David and the sheep: the far post and the gate
  if (!fold) return;
  const { mx, by, fx, fby } = goalSpots(camX), ph = TUNE.GATE_POST_TILES * T;
  if (mx < -400 || mx > W + 600) return;
  gatePost(fx, fby, 13, ph * GATE_FAR.scale, true);
  const sg = ctx.createRadialGradient(mx, by, 2, mx, by, GOAL_GAP * 1.6);   // a soft shadow on the grass between the posts
  sg.addColorStop(0, "rgba(40,28,10,0.3)"); sg.addColorStop(1, "rgba(40,28,10,0)");
  ctx.fillStyle = sg; ctx.fillRect(mx - GOAL_GAP * 1.7, by - 10, GOAL_GAP * 3.4, 18);
  drawGate(camX);
}
function drawFoldFront(camX) {   // in front of everything: the cord with the golden olive, and the near post
  if (!fold) return;
  const { mx, nx, nby, fx } = goalSpots(camX), ph = TUNE.GATE_POST_TILES * T;
  if (mx < -400 || mx > W + 600) return;
  ctx.save();
  // the cord and the olive on it, sliding up and down (gone once caught)
  if (!(finish.active && finish.caught)) {
    const go = gateOlive(), y = go.y;
    ctx.strokeStyle = "#e0b640"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(fx, y - 12); ctx.quadraticCurveTo(mx, y + 8, nx, y + 6); ctx.stroke();
    ctx.strokeStyle = "rgba(120,80,10,0.6)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(fx, y - 10); ctx.quadraticCurveTo(mx, y + 10, nx, y + 8); ctx.stroke();
    drawOlive(mx, y + 2, "golden", 1.6);
  }
  // the near post, plain: David passes behind it, so nothing on it should get in the way of the illusion
  gatePost(nx, nby, 22, ph + 8, false);
  ctx.restore();
  // the "+N" (or "Missed!") at the goal, floating up
  const pop = finish.pop;
  if (finish.active && pop && pop.t < 1.6) {
    pop.t += 1 / 60;
    ctx.save(); ctx.globalAlpha = Math.min(1, 2 * (1.6 - pop.t)); ctx.textAlign = "left";
    ctx.font = "bold 34px sans-serif"; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(40,24,10,0.9)";
    const ty = pop.y - pop.t * 40, tx = pop.x - camX + GOAL_GAP + 40;
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
  ctx.fillText("Stage " + LEVEL_STAGE + " clear!", W / 2, 215);
  ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif";
  ctx.fillText(`Lost sheep found: ${finish.found} of ${finish.total}${finish.found === finish.total && finish.total ? "  (+1 life!)" : ""}`, W / 2 + 20, 262);
  hudIcon("sheep", W / 2 - 200, 234, 38);
  ctx.fillText(finish.one ? "The One: found!" : "The One: still out there...", W / 2, 296);
  ctx.fillText(!finish.caught ? "Golden olive: missed" : finish.life ? `Golden olive caught at the top: +${finish.bonus} olives. Third top catch: +1 life!` : finish.gold ? `Golden olive caught at the top: +${finish.bonus} olives (${gateTops} of ${TUNE.GATE_TOPS_FOR_LIFE} for a life)` : `Golden olive: +${finish.bonus} olives`, W / 2, 330);
  if (!finish.gold) { ctx.fillStyle = "#ffd84a"; ctx.font = "18px sans-serif"; ctx.fillText(`Next time: catch it at the very top for 25 (every ${TUNE.GATE_TOPS_FOR_LIFE} top catches = +1 life)`, W / 2, 352); }
  ctx.fillStyle = "#ccc"; ctx.font = "18px sans-serif";
  if (finish.t > 1) ctx.fillText("Press A to write in the Journal", W / 2, 385);
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
    if (lion.hp <= 0) { setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and cobra\" (Psalm 91:13)"); }
  } else if (lion.state === "dazed") {
    lion.hp -= s.power ? 3 : s.charged ? 2 : 1; lion.flash = 0.25;
    if (lion.hp <= 0) finalHit(s); else { stoneHit(s); sfx("lion_hit", lion.x, 0.9, 0.95 + Math.random() * 0.1); }
    if (lion.hp <= 0) {
      setLion("defeated"); toast("The lion is beaten! \"You will tread on the lion and cobra\" (Psalm 91:13)");
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
  const img = ITEM.stone_remembrance;
  if (img && img.naturalWidth) { const w = r * 2.6, h = img.naturalHeight * w / img.naturalWidth; ctx.drawImage(img, x - w / 2, y - h / 2, w, h); return; }
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
        david.olives++; david.gathered++; sfx("olive_pickup", undefined, 0.45, 0.95 + Math.random() * 0.1);
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
  const img = ITEM["olive_" + (kind === "golden" ? "golden" : kind === "purple" ? "purple" : "green")];
  if (img && img.naturalWidth) { const h = 19 * size, w = img.naturalWidth * h / img.naturalHeight; ctx.drawImage(img, x - w / 2, y - h / 2, w, h); return; }
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
const TREE_DROPS = { olive_tree: "olives", fig_tree: "figs", date_palm: "dates", grape_vine: "grapes", beehive_tree: "honey", pomegranate_tree: "pomegranate" };
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
    const reach = h.kind === "raven" ? 52 : 26;
    if (Math.abs(h.x - david.x) < reach && h.y > david.y - david.h - 10 && h.y < david.y) hurtDavid(h.x);
  }
}
function stoneHitsBugs(s) {
  for (const h of hornets) if (!h.gone && Math.hypot(s.x - h.x, s.y - h.y) < (h.kind === "raven" ? 60 : 26)) {
    h.gone = true; h.vx = Math.sign(s.vx) * 160; h.vy = -260; toast(h.kind === "raven" ? "Raven driven off!" : "Hornet driven off!"); return !s.power;
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
  if (!SPR.bee_fly || !SPR.hornet_fly || !SPR.raven_fly) return;
  for (const b of bees) if (b.alpha > 0) drawSprite("bee_fly", frameOf("bee_fly", b.t * 2), b.x - camX, b.y, b.facing, 1, b.alpha);
  for (const h of hornets) if (h.alpha > 0) {
    const nm = h.kind === "raven" ? "raven_fly" : "hornet_fly";
    drawSprite(nm, frameOf(nm, h.t * (h.state === "dive" ? 3 : 1.5)), h.x - camX, h.y, h.facing, 1, h.alpha);
  }
}

// harp music: the first 15 seconds of "The Shepherd Leads Me", looping while David sits and plays
const harpMusic = new Audio("../assets/audio/harp_loop.mp3?v=" + (window.BUILD || 0));
harpMusic.loop = true; harpMusic._music = true; harpMusic.volume = 0;
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
unlockAudio();   // when the browser already allows sound (the "Play David" launcher), it's on from the start
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
function loopAudio(name, music = true) { const a = new Audio(`../assets/sounds/${name}.mp3?v=${window.BUILD || 0}`); a.loop = true; a._music = music; a.volume = 0; return a; }
const ambience = loopAudio("ambience_hills"), bossMusic = loopAudio("boss_loop");
const stepsRun = loopAudio("steps_run", false);
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
  const inArena = lion && david.x > arenaX - TUNE.BOSS_MUSIC_LEAD * T && david.x < MAIN_COLS * T;
  const fight = lion && (lion.awake || inArena) && lion.state !== "defeated" && david.deadT <= 0;
  if (fight && !bossIntroPlayed) { bossIntroPlayed = true; sfx("boss_intro", undefined, 0.8); bossMusic.currentTime = 0; }   // uh oh
  if (lion && !lion.awake && !inArena) bossIntroPlayed = false;
  bossVol = fadeLoop(bossMusic, bossVol, fight ? TUNE.BOSS_MUSIC_VOLUME : 0, dt, fight ? 0.5 : 0.4);
  const calm = !fight && !(david.state === "harp") && !finish.active;
  ambVol = fadeLoop(ambience, ambVol, STAGE_INFO.night || cave.room ? 0 : calm ? TUNE.AMBIENCE_VOLUME : (finish.active ? TUNE.AMBIENCE_VOLUME * 0.5 : 0), dt, 0.3);
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
// everything quiet: The One's card and the pause menu stop the footsteps, the hills, the lion music and the harp.
// They pick up again on their own when play goes on (fadeLoop restarts a loop that should be heard).
function hushLoops() {
  for (const a of [stepsRun, ambience, bossMusic, harpMusic]) if (!a.paused) a.pause();
  if (david.chargeSnd) { david.chargeSnd.pause(); david.chargeSnd = null; }
}
function updateHarpMusic(dt) {
  const sitting = david.harp && (david.state === "kneel" || david.state === "harp");
  harpHeldT = sitting ? harpHeldT + dt : 0;
  const want = sitting && harpHeldT >= TUNE.HARP_MUSIC_DELAY;   // wait for his hands, not the harp coming out
  if (harpVol > 0 && harpMusic.paused && !harpStarting && audioUnlocked) harpMusic.play().catch(() => {});   // back from a pause: carry on where it was
  else if (want && harpMusic.paused && !harpStarting && audioUnlocked) {
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
  updatePickups(dt); updateGourds(); updateSnakes(dt); updateFires(dt); updateLion(dt); updateTakenLamb(dt); updateSheep(dt); updateFinish(dt);
  updateCritters(dt); updateCrumbles(dt); updateTalks(dt); updateNight(dt); updateCave(dt);
}

// background layers: Glen's art, three per world. far = sky + distant hills (slowest), mid = rolling hills, near = grass strip
const BG = {};
// a set can borrow layers it doesn't have yet from another set (1-4 night: its own sky, World 1's hills until Glen's arrive)
const BG_BORROW = {};   // e.g. { w1_2: { near: "w1" } } while a set is still missing a layer
for (const w of ["w1", "w2", "w1_2", "w1_3", "w1_4", "w2_1", "w2_2", "w2_3", "w2_4"]) {
  BG[w] = {};
  for (const [layer, ext] of [["far", "jpg"], ["mid", "png"], ["near", "png"]]) {
    if (BG_BORROW[w] && BG_BORROW[w][layer]) { BG[w][layer] = BG[BG_BORROW[w][layer]][layer]; continue; }
    total++;
    const img = new Image(); img.onload = () => { loaded++; }; img.onerror = () => { loaded++; };
    img.src = `../assets/backgrounds/${w}_${layer}.${ext}?v=${window.BUILD || 0}`; BG[w][layer] = img;
  }
}
let bgWorld = STAGE_INFO.bg || "w1";   // press 3 to swap between World 1 and World 2 backgrounds (to compare)
function drawLayerRepeating(img, camX, factor, bottomY, height, mirror = false) {
  if (!img.naturalWidth) return;
  const w = img.naturalWidth * height / img.naturalHeight;
  const k0 = Math.floor(camX * factor / w);
  for (let k = k0, x = k0 * w - camX * factor; x < W; k++, x += w) {
    if (mirror && k % 2) { ctx.save(); ctx.translate(Math.floor(x) + Math.ceil(w) + 1, 0); ctx.scale(-1, 1); ctx.drawImage(img, 0, bottomY - height, Math.ceil(w) + 1, height); ctx.restore(); }
    else ctx.drawImage(img, Math.floor(x), bottomY - height, Math.ceil(w) + 1, height);
  }
}
// far: one image, scaled so it covers the screen plus all the scrolling it will do, bottom-aligned (no repeat)
function drawFarLayer(camX) {
  const far = BG[bgWorld].far;
  if (!far.naturalWidth) { ctx.fillStyle = "#cfe0ea"; ctx.fillRect(0, 0, W, H); return; }
  const scroll = Math.max(0, MAIN_COLS * T - W) * TUNE.BG_FAR_SPEED;
  let w = W + scroll, h = far.naturalHeight * w / far.naturalWidth;
  if (h < H + 40) { h = H + 40; w = far.naturalWidth * h / far.naturalHeight; }   // a very wide picture: fill the height instead
  ctx.drawImage(far, -camX * TUNE.BG_FAR_SPEED, H - h + (TUNE.BG_FAR_DROP[bgWorld] || 0), w, h);
}
function drawBackground(camX) {
  const L = BG[bgWorld];
  // a painted night sky goes in later, behind everything, so the night tint doesn't darken it again (world1.js drawNight)
  if (STAGE_INFO.nightSky) { ctx.clearRect(0, 0, W, H); drawMidNear(camX, true); return; }
  drawFarLayer(camX);
  drawMidNear(camX);
}
// the mid and near layers. A painted night set: borrowedOnly = the borrowed daytime layers (they get the night tint);
// its own night layers are drawn later, behind the tinted foreground, with the sky (world1.js drawNight)
function drawMidNear(camX, borrowedOnly = null) {
  const L = BG[bgWorld], LH = TUNE.BG_LAYER_HEIGHTS[bgWorld] || {}, B = BG_BORROW[bgWorld] || {};
  for (const [layer, speed, base, hDef] of [["mid", TUNE.BG_MID_SPEED, GR * T + 30, TUNE.BG_MID_HEIGHT], ["near", TUNE.BG_NEAR_SPEED, GR * T + 22, TUNE.BG_NEAR_HEIGHT]]) {
    if (borrowedOnly !== null && !!B[layer] !== borrowedOnly) continue;
    const from = B[layer] || bgWorld, lh = (TUNE.BG_LAYER_HEIGHTS[from] || {})[layer] || hDef;
    drawLayerRepeating(L[layer], camX, speed, base, lh, !!TUNE.BG_MIRROR[from]);
  }
}
function drawDecor(camX, layer) {
  for (const d of decor) if (d.layer === layer && d.x - camX > -300 && d.x - camX < W + 300)
  {
    const x = d.x - camX + Math.sin(performance.now() / 25) * 5 * d.shakeT, y = d.y + 6 + (TUNE.DECO_DROP[d.name] || 0), tilt = TUNE.DECO_TILT[d.name] || 0;
    if (!tilt) { drawItem(d.name, x, y, d.size * 0.85); continue; }
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt * Math.PI / 180); drawItem(d.name, 0, 0, d.size * 0.85); ctx.restore();
  }
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
  const d = david; if (!d.charging || !hasSkill("charge")) return;
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
  const real = Math.max(0, Math.min(1 / 30, (now - last) / 1000)); last = Math.max(last, now);   // never let time run backwards
  const dt = real * gameSpeed(real);   // the last stone on a boss slows the world down
  if (toastTime > 0) toastTime -= real;
  if (helpT > 0 && helpT < 9000) helpT -= dt;
  // (also wait for the other scripts: world1.js, the Journal and the map load after this one)
  if (loaded < total || typeof WorldMap === "undefined" || typeof Journal === "undefined" || typeof updateCritters === "undefined" || typeof camLimits === "undefined" || typeof Courtyard === "undefined" || typeof Menu === "undefined") {
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif"; ctx.fillText(`Loading sprites ${loaded} / ${total}`, 40, 60);
    requestAnimationFrame(frame); return;
  }
  if (Menu.active || Journal.active || WorldMap.active || Courtyard.active) {   // the menu, the Journal, a map or the home base covers the screen
    if (setup.active) updateSetup(real); else checkCombo(real);
    pollInput();
    if (setup.active) { input.now = {}; input.prev = {}; }   // the setup screen gets the buttons, not the map
    // Start on a map or in the courtyard: the pause menu (settings)
    if (!Menu.active && pressed("start") && ((WorldMap.active && !WorldMap.leaving) || (Courtyard.active && !Courtyard.leaving && !Courtyard.mode))) { Menu.open("pause"); Menu.draw(); requestAnimationFrame(frame); return; }
    updateTheme(real, Menu.active ? !Menu.snap : WorldMap.active && !WorldMap.leaving);   // the title screen has music; a pause is silent
    if (Menu.active) { Menu.update(real); Menu.draw(); }
    else if (Journal.active) { Journal.update(real); Journal.draw(); }
    else if (WorldMap.active) { WorldMap.update(real); WorldMap.draw(); }
    else { Courtyard.update(real); Courtyard.draw(); }
    drawToastAndSetup();
    requestAnimationFrame(frame); return;
  }
  if (setup.active) updateSetup(dt); else checkCombo(dt);
  pollInput();
  // Start in a stage: pause (resume, settings, back to the map)
  if (pressed("start") && !setup.active && !oneMoment.active && !finish.active && !codeEntry.active && david.deadT <= 0) { hushLoops(); Menu.open("pause", true); requestAnimationFrame(frame); return; }
  if (oneMoment.active) { hushLoops(); updateOneMoment(real); }
  else if (!setup.active) { if (david.deadT <= 0) updateDavid(dt); updateLamb(dt); updateStones(dt); updateWorld(dt); }
  const [camLo, camHi] = camLimits();   // the stage, or the cave David is in (world1.js)
  const targetCam = Math.max(camLo, Math.min(camHi, david.x - W * 0.4 + david.facing * 80));
  camX += (targetCam - camX) * Math.min(1, real * 6);
  const shake = finalBlow.shake * finalBlow.shake * 14;
  ctx.save(); if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  if (cave.room) drawCaveBackdrop(camX); else drawBackground(camX);
  drawLionRidge(camX);
  drawDecor(camX, "back");
  drawCaveDark(camX);
  drawCaveDoors(camX);
  drawTiles(camX);
  drawCaveFeatures(camX);
  drawPlatforms(camX);
  drawFold(camX);
  drawFires(camX);
  drawPickups(camX);
  drawOlives(camX);
  drawSpecials(camX);
  drawSnakes(camX);
  drawCritters(camX);
  drawBugs(camX);
  drawLion(camX);
  drawTakenLamb(camX);
  drawSheep(camX);
  drawFlock(camX);
  drawLamb(camX);
  if (inCutscene() || !(david.inv > 0 && Math.floor(now / 70) % 2)) drawDavid(camX);
  drawFoldFront(camX);
  drawStones(camX);
  drawDecor(camX, "front");
  drawFakeRock(camX);
  drawCodeWalls(camX);
  ctx.restore();
  drawNight(camX);
  drawCaveDarkness(camX);
  drawFinalBlow();
  if (david.deadT > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, 1.2 - david.deadT)})`; ctx.fillRect(0, 0, W, H); }
  if (debug) {
    ctx.strokeStyle = "red"; ctx.strokeRect(david.x - camX - BODY_W / 2, david.y - david.h, BODY_W, david.h);
    ctx.fillStyle = "#fff"; ctx.fillText(`${david.state} vx ${david.vx | 0} vy ${david.vy | 0}`, 20, H - 20);
  }
  drawHUD();
  drawFinishBanner();
  drawOneMoment();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
