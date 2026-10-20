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
  SLIP_MS: 130,           // 3-4's muddy slope: a hard landing slips (david_slip, ms per frame)
  SLIP_LOCK: 0.5,         // seconds he can't move or jump while he slides and catches his balance
  SLIP_SLIDE: 160,        // the least he slides forward on landing (px/s)
  SLIP_MUD: 420,          // how fast the slide slows (px/s per second; lower = slicker)
  CLIMB_SPEED: 230,       // ladders: px/s up or down (hold Up / Down)
  CLIMB_STRIDE: 26,       // px climbed per frame of david_climb
  RAIN_VOLUME: 0.35,      // the storm's rain loop (3-4)
  MUD_GRIP: 0.25,         // how much grip he has on 3-4's mud (1 = normal ground; lower = slides further)
  BUSH_SIZE: 0.32,        // the bushes the 3-4 foxes hide in (Glen's bush.png, 360 px wide)
  ROLL_SPEED: 520,
  ROLL_TIME: 0.55,        // seconds the roll lasts
  CRAWL_SPEED: 120,
  STONE_SPEED: 820,       // tap throw
  STONE_SPEED_CHARGED: 1250,
  CHARGE_TIME: 0.6,       // seconds holding B for a full charge
  STONE_GRAVITY: 900,     // lower = stones fly higher and farther
  AIM_GRACE: 0.2,         // seconds after letting go of Up/Left/Right that a throw still aims that way
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
  BG_FAR_DROP: { w1: -150, w2: 40, w1_2: 0, w1_3: 0, w1_4: 0, w2_1: 0, w2_2: 0, w2_3: 0, w2_4: 0, w3_1: 0, w3_2: -150, w3_3: -100, w3_4: 0, w4_1: 0, w4_2: 0, w4_3: 0, w4_4: 0, w5_1: 0, w5_2: 0, w5_3: -80, w5_4: -110, w6_1: 0, w6_2: 0, w6_3: 0, w6_4: 0 },   // per world: push the far layer down (positive) or up (negative)
  BG_LAYER_HEIGHTS: { w1_2: { mid: 380, near: 170 }, w1_3: { mid: 400, near: 170 }, w1_4: { mid: 380, near: 170 }, w2_1: { mid: 420, near: 683 }, w2_2: { mid: 400, near: 190 }, w2_3: { mid: 440, near: 210 }, w2_4: { mid: 440, near: 230 }, w3_1: { mid: 430, near: 190 }, w3_2: { mid: 400, near: 190 }, w3_3: { mid: 420, near: 190 }, w3_4: { mid: 440, near: 200 }, w4_1: { mid: 400, near: 190 }, w4_2: { mid: 420, near: 170 }, w4_3: { mid: 420, near: 170 }, w4_4: { mid: 440, near: 160 }, w5_1: { mid: 400, near: 180 }, w5_2: { mid: 440, near: 190 }, w5_3: { mid: 300, near: 110 }, w5_4: { mid: 270, near: 120 }, w6_1: { mid: 380, near: 200 }, w6_2: { mid: 250, near: 120 }, w6_3: { mid: 320, near: 120 }, w6_4: { mid: 260, near: 120 } },   // per world: mid / near heights on screen, if not BG_MID_HEIGHT / BG_NEAR_HEIGHT
  BG_MIRROR: { w1_2: true, w1_3: true, w1_4: true, w2_1: true, w2_2: true, w2_3: true, w2_4: true, w3_1: true, w3_2: true, w3_3: true, w3_4: true, w3_end: true, w4_1: true, w4_2: true, w4_3: true, w4_4: true, w5_1: true, w5_2: true, w5_3: true, w5_4: true, w6_1: true, w6_2: true, w6_3: true, w6_4: true },   // per world: every other copy of the mid/near layers is flipped, so pictures whose edges don't match still join cleanly
  HORNET_RANGE: 300,      // how close before a hornet dives at David
  HORNET_DIVE: 420,       // dive speed
  HARP_SETTLE_MS: 120,    // playing frames 1-8, once, after he sits down
  HARP_LOOP_MS: 190,      // the calm strumming loop (frames 9-12, back and forth)
  HARP_STANDUP: 0.75,     // seconds to put the harp away and stand up
  HARP_VOLUME: 0.8,       // volume of the harp music when David plays (0 to 1)
  SFX_VOLUME: 0.8,        // sound effects (0 to 1)
  STEPS_VOLUME: 0.5,      // David's running footsteps
  AMBIENCE_VOLUME: 0.35,  // birds in the hills
  DAY_MUSIC_VOLUME: 0.3,  // Glen's day themes (Cascading Harp, Harp's Dance), under the birds
  DARK_MUSIC_VOLUME: 0.4, // Glen's darker themes (Harp of Shadows): night stages and caves, like Mario's underground music
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
    david_slip: 0.8,      // Glen's slip strip draws him chunkier: matched to his head size on the other sprites
    lion_prowl_carry_lamb: 1.3, lion_sit_carry_lamb: 1.3, lion_set_lamb_down: 1.24,
    lion_run: 1.3, lion_pounce: 1.3, lion_prowl: 1.3, lion_roar: 1.3, lion_sit_roar: 1.3, lion_dazed: 1.3,
    cobra_hood: 1.5, snake_strike: 1.5,
    bee_fly: 0.6, hornet_fly: 1.0,
    david_play_harp: 0.66,       // the harp clip zoomed in as he sat down
    // lambs are about two-thirds the size of a grown sheep
    lamb_run: 0.75, lamb_hop: 0.75, lamb_walk: 0.75, lamb_stand: 0.75, lamb_graze: 0.75,
    lamb_bound: 0.75, lamb_bound2: 0.75, lamb_leap: 0.75, lambblack_stand: 0.75, lambblack_walk: 0.75, lambblack_leap: 0.75,
    ram_walk: 1, ram_stand: 1, ram_run: 1, ram_butt: 1, ram_leap: 1,   // Glen's ram clips (one shared sheet size: tools/uniform_sheets.py)
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
function toast(t) { toastText = keyText(t); toastTime = Math.max(4, t.split(" ").length * 0.4); }   // long enough to read every word
// "{ROLL}" / "{roll}" in what people say: the roll on the controller in use. A SNES pad has its own roll button (X); an
// NES pad only has Down + A. The controller picked in the settings, or the pad that's plugged in if it says keyboard.
function controllerKind() {
  const c = SETTINGS.controller;
  if (c !== "keyboard") return c;
  const p = readPad(); if (!p) return "keyboard";
  const m = mapFor(p); return m && !m.x ? "nes" : "snes";
}
function keyText(s) {
  if (!s || s.indexOf("{") < 0) return s;
  const roll = { keyboard: "press Down + Z, or V", nes: "hold Down, then press A", snes: "press X" }[controllerKind()];
  return s.replace(/\{ROLL\}/g, roll[0].toUpperCase() + roll.slice(1)).replace(/\{roll\}/g, roll);
}

// ============================================================================
// Levels: World 1's four stages ("#1-1" ... "#1-4" in the address), and "#test", the old movement test.
// Built from simple commands (columns/rows are tiles). Screen is 20 tiles tall; ground surface is row 17.
// ============================================================================
const STORY_HASH = location.hash === "#3-A" ? "3-A" : null;   // a story stop from the map (the Anointing): 3-3's ground, then the scene
const STAGE_HASH = (location.hash.match(/^#(\d-\d)$/) || [])[1] || (STORY_HASH && "3-3");
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
  "2-1": { cols: 240, bg: "w2_1", ter: "w2f", name: "The Forest Trail" },
  "2-2": { cols: 306, bg: "w2_2", ter: "w2s", name: "The Dry Riverbed" },
  "2-3": { cols: 196, bg: "w2_3", ter: "w2s", name: "The High Cliffs" },
  "2-4": { cols: 258, bg: "w2_4", ter: "w2f", name: "The Bear's Ravine" },   // ter: the stage's own ground set (assets/terrain/w2f)
  "3-1": { cols: 236, bg: "w3_1", ter: "w2s", name: "The Day Before" },   // dry, dusty ground: no grass in the village lanes
  "3-2": { cols: 236, bg: "w3_2", name: "The Far Pasture" },
  "3-3": { cols: 214, bg: "w3_3", name: "We Will Not Sit Down" },
  "4-4": { cols: 226, bg: "w4_4", ter: "w4p", name: "The King's Hall" },   // Glen's palace-at-night set
  "4-3": { cols: 214, bg: "w4_3", ter: "w2s", name: "The Broken String" },   // Glen's Gibeah market set
  "4-2": { cols: 232, bg: "w4_2", ter: "w2s", name: "The Training Yard" },   // Glen's fortress set; dusty ground
  "4-1": { cols: 316, bg: "w4_1", name: "The Road to Gibeah" },   // Glen's vineyards-and-Jebus layers
  "5-1": { cols: 250, bg: "w5_1", ter: "w2s", name: "The Supply Road" },
  "6-1": { cols: 246, bg: "w6_1", ter: "w2s", name: "The Camp of Fear" },   // Glen's camp morning
  "6-2": { cols: 230, bg: "w6_2", ter: "w2s", name: "No-Man's Land" },
  "6-3": { cols: 240, bg: "w6_3", ter: "w2s", name: "The Water Carriers" },
  "6-4": { cols: 230, bg: "w6_4", ter: "w2s", name: "The Tower's Shadow" },   // Glen's World 6 sets (6-1 to 6-4)
  "5-4": { cols: 316, bg: "w5_4", ter: "w2s", name: "Down to Elah" },   // Glen's dawn valley; 5-1's dusty ground
  "5-3": { cols: 248, bg: "w5_3", ter: "w5m", night: true, nightSky: true, name: "The Lookouts' Ridge" },   // Glen's ridge over the two camps
  "5-2": { cols: 252, bg: "w5_2", ter: "w5m", night: true, nightSky: true, name: "The Mountain Trail" },   // Glen's moonlit trail   // Glen's hot-afternoon road west
  "3-4": { cols: 310, bg: "w3_4", name: "The Chosen Shepherd", storm: true },   // Glen's storm layers (rain, dark and lightning drawn on top in world3.js)
}[LEVEL_NAME];
const WORLD = +LEVEL_STAGE.split("-")[0];
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
// a deadfall (material 8): dead branches piled across the trail, too tall to jump; a full charged stone breaks it (world2.js)
const deadfalls = [];
// World 2's set pieces, run by world2.js: the flood, the boy from Tekoa, the talk about the stones (see world2.js)
const setPieces = [];
// World 3: Bethlehem's flat-roofed houses (material 9, drawn in world3.js) and ladders up their walls (rungs you hop up)
const houses = [], ladders = [], stairs = [], GRANARY_BEAM_ROW = 12;
const stair = (c, h) => { for (let k = 0; k < h; k++) block(c + 2 * k, GR - k - 1, 2 * (h - k), 1, 9); stairs.push({ c, h }); };   // steps up to the right, 2 columns each   // (the granary's beam, where its whip snake lies)
const house = (c, w, r) => { block(c, r, w, GR - r, 9); houses.push({ c, w, r }); };
const stairTowers = [];
// Glen's tower with its own stone stair: you run past in front of the tower, climb the stair (steps up to the right), then
// jump up onto the tower top (a ledge you can jump up through, row 7: you stand behind the battlements). The tower's left edge is column c; its drawn top is row 6.
const STAIR_TOWER_STEPS = [[4, 1], [5, 2], [6, 3], [7, 6]];   // [column after c, rows high]: fitted to the drawn stair
const stairTower = (c) => { for (const [k, h] of STAIR_TOWER_STEPS) block(c + k, GR - h, 1, h, 9); plat(c, 7, 7); stairTowers.push({ c }); };
const ladder = (c, r) => { const rungs = []; for (let y = r; y <= GR - 2; y += 3) rungs.push(y); ladders.push({ c, r, rungs }); };
// the roof beside the top of a ladder: which side (0 = none) and the row of its top, which can be a row or two above the
// top rung (3-3's town wall). A side counts if its top is at the rung or up to 2 rows higher.
function ladderTop(l) {
  if (l.top !== undefined) return l.top;
  const topRow = c => { if (!isSolid(c, l.r)) return null; let r = l.r; while (r > l.r - 3 && isSolid(c, r - 1)) r--; return isSolid(c, r - 1) ? null : r; };
  const right = topRow(l.c + 2), left = topRow(l.c - 1);
  return (l.top = right !== null ? { dir: 1, y: right * T } : left !== null ? { dir: -1, y: left * T } : { dir: 0, y: l.r * T });
}
const ladderRoof = l => ladderTop(l).dir;   // which side its roof is on (0 = none)
// the top of a ladder (david_topout, Glen's two strips): hands up at the roof edge, pulling up, climbing over, on hands
// and knees, up and stepping off. Per frame: [px from the roof edge (toward the roof), px below the roof top] for his feet.
const TOPOUT_POS = () => [[-T, 238 * SCALE - 12], [-T, 192 * SCALE - 8], [-12, 42 * SCALE], [26, 0], [44, 0]];
const TOPOUT_FRAME = 0.2, TOPDOWN_FRAME = 0.15;   // seconds per frame going up, and going back down onto the ladder
const ladderAt = d => ladders.find(l => d.x > l.c * T - 4 && d.x < (l.c + 2) * T + 4 && d.y > l.r * T - 4 && d.y <= GR * T + 2);   // the ladder he's in front of
const setPiece = (kind, c, r = GR - 1, o = {}) => setPieces.push({ kind, c, r, x: c * T + T / 2, y: (r + 1) * T, ...o });
const deadfall = (c, r, w, h) => { block(c, r, w, h, 8); deadfalls.push({ c, r, w, h, broken: false, told: false }); };
const stepStone = c => { plat(c, GR, 1); setPiece("stepstone", c, GR); };   // a flat rock in a stream: a ledge level with the bank (drawn in world3.js)
// 3-3: a tall wooden fence, too high to jump, with a gap underneath to roll through (drawn in world3.js)
const fence = c => { block(c, 7, 1, 8, 9); setPiece("fence", c, GR - 1); };
// 3-3: where Shammah waits (in order) and what he calls out when David catches up (world3.js runs him along)
const guide = (c, r, line) => setPiece("guide", c, r, { line });
const thicket = (c, r, w, h) => { block(c, r, w, h, 8); deadfalls.push({ c, r, w, h, broken: false, told: false, thorns: true }); };   // thorns: a charged stone clears them
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
const raven = (c, r) => hornet(c, r, "raven");
const lostGifts = [];   // World 4's lost things (4-1: the extra gifts Father packed, shaken loose on the road; world4.js)
const lostGift = (name, c, r) => lostGifts.push({ name, x: c * T + T / 2, y: (r + 1) * T, taken: false, t: Math.random() * 6 });
const inscriptions = [];   // old letters carved here and there, a trail to the Cave of the Name (World 5): world4.js draws them
const inscription = (c, r, letter) => inscriptions.push({ letter, x: c * T + T / 2, y: (r + 0.5) * T, still: 0, read: false });
const questItem = (name, c, r) => { if (typeof questItems !== "undefined") questItems.push({ name, x: c * T + T / 2, y: (r + 1) * T, taken: false, t: Math.random() * 6 }); else pendingQuest.push([name, c, r]); };
const pendingQuest = [];   // (world4.js loads after the layout: it picks these up)
const ambushFox = c => { critter("fox", c); critters[critters.length - 1].ambush = true; };   // hiding in a bush until David's close (world1.js)   // ravens dive at you on open ground, like the hornets but bigger
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
//   aimUp: Abinadab, 1-1 · harpCall: Hanan, 1-2 (the harp gathers sheep) · roll: Shammah, 1-3 · charge: Hanan, 2-1
// The movement test (#test) and "?allskills" have everything.
const SKILL_NAMES = { aimUp: "Aim up: hold Up as you throw", harpCall: "The harp calls lost sheep to you", roll: "Roll: {roll}", charge: "Charged sling: hold B",
  quick: "Quick release: tap B twice, quick, for two stones",
  leap: "The scout's leap: press A again in the air to jump again" };   // leap: Tobi, 5-2   // quick: Gera, 4-2
const skills = new Set();
try { for (const k of JSON.parse(localStorage.getItem("davidProgress") || "{}").skills || []) skills.add(k); } catch (e) {}
const ALL_SKILLS = LEVEL_NAME === "test" || new URLSearchParams(location.search).has("allskills");
// Every stage after the one that teaches a skill has it, even if that talk was missed (or the save lost it)
const SKILL_STAGE = { aimUp: "1-1", harpCall: "1-2", roll: "1-3", charge: "2-1", quick: "4-2", leap: "5-2" };
const stageNum = st => { const m = /^(\d+)-(\d+)$/.exec(st || ""); return m ? +m[1] * 100 + +m[2] : 0; };
const hasSkill = k => ALL_SKILLS || skills.has(k) || (SKILL_STAGE[k] && stageNum(LEVEL_STAGE) > stageNum(SKILL_STAGE[k]));
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
// Glen's dry-stone wall pieces (assets/items), laid edge to edge: [width, height] of each picture, for spacing them
const WALL_PIECES = {
  fold_wall_end_l: [374, 216], fold_wall_mid_1: [334, 218], fold_wall_mid_2: [319, 220], fold_wall_post: [295, 294],
  fold_wall_mid_3: [335, 236], fold_wall_end_r: [349, 218],
  pen_pillar_l: [221, 402], pen_wall_1: [525, 390], pen_wall_2: [504, 392], pen_pillar_r: [224, 396], pen_post_tall: [273, 494], pen_wall_low: [251, 200],
};
// a run of wall pieces from x0 (px), each scaled by s, overlapping a little where the ferns meet; returns where it ends
const wallRow = (x0, names, s, r = 16, layer = "back") => {
  let x = x0;
  for (const n of names) { const w = WALL_PIECES[n][0] * s; deco(n, (x + w / 2 - T / 2) / T, r, s / 0.85, layer); x += w * 0.8; }   // (the ferns at the ends overlap)
  return x;
};
// A seamless dry-stone wall (Glen's idea): the same wall piece, every other one mirrored, so each join meets its own
// mirror image and the stones line up; a pillar at each end. Stone edges measured in the pictures (not their ferns).
// Returns the pieces to draw: { name, cx (centre, px), flip, w (px), h (px) }, pillars last (they sit in front).
const PEN_STONE = { pen_wall_1: [55, 484], pen_pillar_l: [52, 201], pen_pillar_r: [32, 149] };
function penWallLayout(x0, n, s) {
  const out = [], [W0] = WALL_PIECES.pen_wall_1, [L, R] = PEN_STONE.pen_wall_1;
  let x = x0;   // where the stone of the next piece starts
  for (let k = 0; k < n; k++) {
    const flip = k % 2 === 1, l = flip ? W0 - R : L, r = flip ? W0 - L : R;   // a mirrored piece has its stone edges swapped
    out.push({ name: "pen_wall_1", cx: x - l * s + W0 * s / 2, flip, w: W0 * s });
    x += (r - l) * s - 1;
  }
  const pl = PEN_STONE.pen_pillar_l, pr = PEN_STONE.pen_pillar_r, wl = WALL_PIECES.pen_pillar_l[0], wr = WALL_PIECES.pen_pillar_r[0];
  out.push({ name: "pen_pillar_l", cx: x0 + 14 * s - pl[1] * s + wl * s / 2, flip: false, w: wl * s });
  out.push({ name: "pen_pillar_r", cx: x - 14 * s - pr[0] * s + wr * s / 2, flip: false, w: wr * s, end: true });
  return out;
}
const penWall = (x0, n, s, r = 16, layer = "back") => {
  for (const p of penWallLayout(x0, n, s)) { deco(p.name, (p.cx - T / 2) / T, r, s / 0.85, layer); decor[decor.length - 1].flip = p.flip; }
};
const sheepfold = p => {
  ground(p - 12, MAIN_COLS - 1);
  penWall((p + 3.3) * T, 3, 0.26);   // Glen's dry-stone wall, seamless, a pillar at each end
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
  talk(36, "Abinadab", "Ignore him. Watch: hold Up and press B, and you can hit the high ones.", "aimUp");   // (pointing up: Glen's clip)
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
  rock(162, 13, 3, 4); lostSheep("sheep2", 167, 16);            // a sheep grazing behind the rock
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
  // ---- 1-2 The Wandering Flock: the harp gathers them, foxes go for your lamb, a cast sheep, a neighbor's ram ----
  ground(0, 40);
  campfire(6, GR - 1, "Hanan", "Count them every morning and every night. Sheep know their shepherd's voice, and they know your song. Play the harp (Select): the lost ones will come to it.", "harpCall");
  oliveRow(10, 16, 5);
  lostSheep("ram", 30, 16);                                    // a ram that isn't yours: the neighbor's (bring it home too)
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
  campfire(106, GR - 1, "The neighbor", "That's my ram you've got with yours. Most boys would keep him. If you find your neighbor's sheep, you bring it home.");
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
  talk(38, "Shammah", "Too low to walk through? Get low and tuck, like when we were kids rolling down the hill. ({ROLL})", "roll");
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
  lostSheep("sheep2", 56, 16);
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
} else if (LEVEL_NAME === "2-1") {
  // ---- 2-1 The Forest Trail: Hanan teaches the charged sling (a deadfall you can't get past without it), wild boars,
  //      branches to climb, a hornet nest by a honeybee hive, and The One up in the treetops ----
  ground(0, 34);
  talk(5, "Abinadab", "Wild pigs out here. Don't try to out-run them. They're faster than you look.");
  oliveRow(8, 16, 5);
  wall(14, 15, 3, 2); oliveArc(13, 14, 5);                     // a fallen log: hop over
  talk(22, "Abinadab", "There's a cave behind the falls up in the high cliffs. I found it when I was your age. Don't tell Eliab.");
  lostSheep("sheep", 27, 16);                                  // the first one: just walk up to it
  special(36, 12);                                             // over the first gap: grab it mid-jump
  ground(38, 100);
  campfire(44, GR - 1, "Hanan", "You throw like a boy in a hurry. Let it swing. Longer. Feel it pull. Hold B until the ring turns gold, then let go. Patience puts the power in the stone.", "charge");
  deadfall(52, 10, 2, 7);                                      // dead branches piled across the trail: too tall to jump, a tap stone bounces off
  oliveRow(57, 16, 4);
  critter("boar", 68, GR - 1, 14);                             // the first boar: it scrapes, then charges
  plat(72, 13, 4); plat(78, 10, 4); plat(84, 7, 3);           // up into the branches
  oliveRow(72, 12, 4); oliveRow(78, 9, 4);
  lostSheep("lambblack", 85, 6, "ledge");                      // up in the branches: climb, or play the harp below
  special(86, 2);                                              // above it: jump from the branch, then flip
  hornet(91, 11);                                              // the grey paper nest's hornets: sling them
  deco("beehive_tree", 96, 16, 1.2); food("honey", 98, 16);   // the golden comb: leave the bees be and the honey is yours
  for (let k = 0; k < 4; k++) bee(96, k);
  bridge(101, GR, 4);
  ground(105, 160);
  wall(110, 15, 4, 2); lostSheep("sheepblack", 112, 14, "ledge");   // standing on a fallen log
  oliveArc(116, 16, 5);
  critter("boar", 124, GR - 1, 12);
  lostSheep("sheep", 132, 16, "thorns");                       // caught in the thorns: sling the bush
  food("bread", 136, 16);
  // the trail runs under an overhang of rock, its mouth choked with dead branches: a charged stone again
  rock(146, 9, 11, 4); deadfall(146, 13, 1, 4);
  special(151, 16); food("fig_cake", 154, 16); oliveRow(148, 16, 3);
  ground(164, 240);
  campfire(168, GR - 1, "Hanan", "A boar won't turn once it starts. Step aside, or stop it. Don't stand and argue with it.");
  // The One: up in the treetops, branch by branch
  plat(175, 13, 3); plat(180, 10, 3); plat(185, 7, 3); plat(191, 4, 3);
  lostSheep("lamb", 192, 3, "one");
  oliveRow(175, 12, 3); oliveRow(180, 9, 3); oliveRow(185, 6, 3);
  critter("boar", 202, GR - 1, 10);
  lostSheep("sheep", 208, 16, "cast");                         // on its back: roll it over (Down)
  snake("viper", 213); oliveRow(196, 16, 4);
  sheepfold(218);
} else if (LEVEL_NAME === "2-2") {
  // ---- 2-2 The Dry Riverbed: a dry wadi of sandstone, Hanan's warning about flash floods, the boy's donkey bolting in
  //      a narrow way under the rock (the harp calms him); then the flash flood, and the boy from Tekoa on a rock ----
  ground(0, 38);
  oliveRow(6, 16, 5);
  rock(16, 15, 3, 2); oliveArc(15, 14, 5);                     // a boulder in the riverbed: hop over
  deco("boulder_tan", 9, 16, 0.22); deco("rubble_stones", 36, 16, 0.3); deco("rock_pile_tan", 63, 16, 0.3); deco("rubble_mound", 96, 16, 0.28);
  lostSheep("sheep", 25, 16);
  setPiece("oleander", 22); deco("oleander", 22, 16, 0.75);   // pink and poisonous: your lamb wanders over to nibble it
  rock(30, 13, 2, 4); special(31, 10);                         // a tall rock: the special stone on top
  ground(42, 130);
  campfire(46, GR - 1, "Hanan", "Rain in the hills miles away can fill this riverbed in moments. When you hear it, climb. Don't stop to look.");
  // a low gap under the rock (crawl through it) with scorpions in it, and a hedgehog that eats them: leave it be
  critter("hedgehog", 42);
  rock(50, 11, 8, 4);
  critter("scorpion", 52, GR - 1, 1.2); critter("scorpion", 55, GR - 1, 1.2);
  plat(60, 13, 4); plat(65, 10, 4);
  lostSheep("sheepblack", 67, 9, "ledge");                     // up on the rocks: climb, or play the harp below
  oliveRow(60, 12, 4);
  // the narrow way: under an overhang of rock, the boy's donkey bolting back and forth. Sit and play the harp for him.
  talk(68, "David", "Someone's donkey, wild with fear. He won't let me by. Maybe the harp will calm him.");
  rock(74, 3, 16, 10);                                         // too high to climb over
  critter("donkey", 82, GR - 1, 4);
  food("fig_cake", 92, 16);
  setPiece("oleander", 95); deco("oleander", 95, 16, 0.75);
  lostSheep("sheep", 100, 16, "thorns");                       // caught in the thorns: sling the bush
  // a pool too wide to jump, and a tortoise plodding along its bottom: ride across on its shell
  // (17 wide, Glen 2026-10-20: 11 could be jumped; a running jump carries ~9 tiles, so the shell is the only way over)
  for (let c = 104; c <= 120; c++) for (let r = GR; r < ROWS; r++) solid[r][c] = r >= 19 ? 1 : 0;
  setPiece("pool", 104, GR, { w: 17 });
  critter("tortoise", 112, 18, 8);
  oliveArc(104, 14, 5);
  // The One: high on the canyon wall, climbed from the far bank (no ledge over the pool: the shell is the only way across).
  // The first ledge is 6 tiles up, past a single jump (~5): come back for it with the double jump (5-2)
  plat(122, 11, 3); plat(118, 9, 3); plat(120, 6, 3); plat(125, 3, 3);
  lostSheep("lamb", 126, 2, "one");
  oliveRow(122, 10, 3); oliveRow(118, 8, 3);
  special(118, 16);
  bridge(131, GR, 4);
  ground(135, 168);
  lostSheep("sheep", 140, 16, "cast");                         // on its back: roll it over (Down)
  lostSheep("lambblack", 146, 16);
  setPiece("oleander", 137); deco("oleander", 137, 16, 0.75);
  campfire(151);                                               // the checkpoint before the flood
  // the flash flood: past column 156 a wall of water comes down the riverbed behind you. Keep moving.
  setPiece("flood", 156, GR - 1, { end: 268 });
  rock(161, 15, 2, 2); oliveRow(164, 16, 3);
  ground(172, 205);                                            // (a gap to jump at 169-171)
  rock(176, 14, 3, 3); oliveArc(175, 13, 4);
  rock(184, 13, 3, 4); setPiece("boy", 185, 12);              // the boy from Tekoa, stranded on a rock: jump up to him
  plat(190, 13, 3); special(191, 10);
  rock(195, 15, 2, 2); oliveRow(198, 16, 4);
  ground(209, 238);                                            // (a gap at 206-208)
  rock(213, 15, 2, 2); oliveRow(216, 16, 3);
  rock(220, 13, 2, 4); plat(224, 11, 3); rock(229, 14, 3, 3);    // up over a jumble of boulders and a ledge
  oliveArc(223, 10, 4);
  plat(239, 14, 3); plat(244, 14, 3);                          // stepping logs over a deep cut (238-248)
  ground(249, 306);
  oliveRow(250, 16, 3);
  rock(254, 14, 2, 3); rock(259, 14, 2, 3); rock(262, 12, 3, 5);   // up out of the riverbed
  // the bank: the water spreads out and drains. The boy's donkey is waiting, and the boy asks about the stones.
  setPiece("stones", 271);
  critter("donkey", 275); critters[critters.length - 1].calmed = critters[critters.length - 1].waits = true;
  sheepfold(284);
} else if (LEVEL_NAME === "2-3") {
  // ---- 2-3 The High Cliffs: up a cliffside of rock columns over deep drops, crumbling ledges, eagles that go for your
  //      lamb, ibex that know the safe paths (one leads to The One), wind on the heights, then down to a hidden spring ----
  ground(0, 21);
  campfire(6, GR - 1, "Hanan", "Watch the wild goats. They know every safe path on these cliffs. And keep your lamb close: eagles nest up here.");
  oliveRow(9, 16, 4);
  lostSheep("sheep", 15, 16); deco("rock_pile_tan", 3, 16, 0.3); deco("boulder_tan", 12, 16, 0.2);
  setPiece("ibex", 19, 16, { path: [[24, 13], [31, 10], [37, 10]] });   // the first ibex shows the way up
  pillar(22, 14, 5);
  pillar(29, 11, 4); oliveArc(27, 10, 3);
  pillar(35, 11, 6);
  lostSheep("sheepblack", 39, 10);
  crumble(42, 9, 3); crumble(46, 9, 2);                        // crumbling ledges over the drop
  special(45, 5);
  setPiece("eagle", 47, 2);
  pillar(49, 8, 8);
  // the secret: this ibex leaps up onto a high route only the goats use, to The One
  setPiece("ibex", 54, 7, { path: [[59, 3], [64, 1], [69, 1], [74, 1], [78, 2]] });
  plat(58, 4, 3); plat(63, 2, 3); plat(68, 2, 3); plat(73, 2, 3); plat(77, 3, 3);
  lostSheep("lamb", 78, 2, "one");
  oliveRow(58, 3, 3); oliveRow(63, 1, 3); oliveRow(73, 1, 3);
  // the main way: down a little, then on up
  pillar(59, 11, 5);
  plat(65, 9, 3); special(66, 6);
  pillar(69, 7, 6);
  campfire(71, 6);                                             // checkpoint
  crumble(76, 8, 2);
  // the heights: the wind gusts from the right
  setPiece("wind", 80, GR - 1, { end: 128 });
  pillar(80, 9, 5);
  crumble(86, 9, 3);
  pillar(90, 9, 3); oliveRow(90, 8, 3);
  pillar(95, 6, 5);
  lostSheep("sheep", 98, 5, "cast");                           // on its back up here: roll it over (Down)
  setPiece("eagle", 101, 1);
  pillar(102, 8, 4);
  plat(108, 7, 3); plat(113, 6, 3); oliveRow(108, 6, 3); oliveRow(113, 5, 3);
  pillar(118, 5, 8);                                           // the top of the cliffs
  campfire(120, 4);
  lostSheep("lambblack", 124, 4);
  // down into the hidden spring
  pillar(129, 7, 4);
  pillar(135, 9, 4); oliveArc(133, 8, 3);
  setPiece("eagle", 140, 3);
  pillar(141, 11, 4);
  special(146, 9);
  pillar(147, 13, 4);
  ground(151, 175);
  lostSheep("sheep", 157, 16, "thorns");                       // caught in the thorns by the water: sling the bush
  deco("rubble_mound", 153, 16, 0.28); deco("rock_pile_tan", 166, 16, 0.3);
  snake("viper", 162);
  sheepfold(175);
  setPiece("falls", 191, 4, { bottom: GR, dx: 110 });         // the spring: Glen's waterfall pours off the cliff behind the fold
} else if (LEVEL_NAME === "2-4") {
  // ---- 2-4 The Bear's Ravine, at dusk: wolves hunting in pairs, claw marks, a tree crashing down off in the trees,
  //      Hanan's last campfire, then the Bear at the pen wall ----
  const wolfPair = (c, gap = 3) => {   // a pack: two sitting in plain sight, a third that comes in from behind (world2.js updateWolf)
    const pack = { on: false, t: 0 };
    critter("wolf", c); critters[critters.length - 1].pack = pack;
    critter("wolf", c + gap); Object.assign(critters[critters.length - 1], { pack, delay: 0.6 });
    critter("wolf", c); Object.assign(critters[critters.length - 1], { pack, lurk: true }); pack.lurker = critters[critters.length - 1];
  };
  ground(0, 40);
  oliveRow(6, 16, 5);
  lostSheep("sheep2", 14, 16);
  rock(20, 13, 3, 4); setPiece("claws", 21, 13);               // claw marks on the rock: something big passed this way
  deco("stump_roots", 10, 16, 0.32); deco("log_broken", 27, 16, 0.4); deco("rubble_sticks", 38, 16, 0.3);   // torn-up logs, overturned rocks
  special(21, 9);
  wolfPair(32);
  ground(44, 110);                                             // (a gap at 41-43)
  plat(50, 13, 4); lostSheep("sheepblack", 51, 12, "ledge");  // up on the ledge: climb, or play the harp below
  deadfall(60, 10, 2, 7);                                      // a torn-up log pile: a full charged stone breaks it
  setPiece("claws", 64, 15); deco("rubble_dirt", 57, 16, 0.3); deco("rock_pile_grey", 70, 16, 0.3);
  oliveArc(66, 16, 5);
  wolfPair(79);                                                // (room behind for the pack's third wolf)
  // The One: up the ravine wall, ledge by ledge
  plat(80, 13, 3); plat(85, 10, 3); plat(90, 7, 3); plat(95, 4, 3);
  lostSheep("lamb", 96, 3, "one");
  oliveRow(80, 12, 3); oliveRow(85, 9, 3); special(91, 4);
  setPiece("crash", 102);                                      // CRACK: a tree comes down somewhere ahead
  deco("log_long", 106, 16, 0.38); deco("stump_cut", 118, 16, 0.26); deco("rubble_mound", 141, 16, 0.3);
  bridge(111, GR, 4);
  ground(115, 258);
  campfire(120, GR - 1, "Hanan", "A lion is quick. A bear is strong, and slow to turn. Never fight it up close. Keep your distance, and keep your stone charged.", "charge");   // (teaches the charge again, in case 2-1's was missed)
  talk(127, "Hanan", "When it rears up on its back legs and roars, that's your moment: a full charged stone. Then it comes down hard and the ground shakes. Be off the ground.");
  lostSheep("sheep", 133, 16, "cast");                         // on its back: roll it over (Down)
  rock(137, 14, 3, 3); setPiece("claws", 138, 14);
  lostSheep("sheep", 144, 16, "thorns");                       // caught in the thorns: sling the bush
  wolfPair(152);
  lostSheep("sheep", 164, 16);
  plat(172, 13, 4); special(174, 10); oliveRow(172, 12, 4);
  setPiece("claws", 184, 15); deco("boulder_grey", 162, 16, 0.24); deco("stump_roots", 180, 16, 0.3); deco("rubble_stones", 194, 16, 0.3);
  deco("log_broken", 208, 16, 0.34); deco("rubble_sticks", 221, 16, 0.32);
  // the arena in front of the pen: ledges to get above a charge
  plat(201, 13, 5); plat(213, 13, 5); plat(207, 9, 4);
  setPiece("bear", 226, GR - 1, { arena: 198 });               // at the pen wall, a sheep pinned under its paw
  wallRow(228.5 * T, ["pen_wall_2"], 0.27);                       // the pen's wall, cracked where the bear's been at it
  sheepfold(238);
} else if (LEVEL_NAME === "3-1") {
  // ---- 3-1 The Day Before: all Bethlehem is getting ready for the prophet, and David gets the jobs nobody wants.
  //      The chores are the level: crows out of the barley, rats out of the granary (or leave the whip snake on the
  //      beam alone and it does the job), flat roofs to run across, ladders up the walls, The One on the highest roof.
  //      At the end Jesse sends him out to the far pasture. Nobody thinks to invite him. ----
  ground(0, 236);
  talk(4, "Eliab", "Samuel the prophet is coming to Bethlehem. When he sees me, he'll know. Look at me.");
  talk(10, "Shammah", "Don't mind him. Somebody has to keep the sheep alive while he's being admired.");
  oliveRow(14, 16, 4);
  setPiece("barley", 19, GR - 1, { w: 15 });                   // the crows are at the barley: sling them off
  for (const c of [21, 25, 28, 32]) critter("crow", c, GR - 1);
  lostSheep("sheep", 27, 16);                                  // nibbling the barley with the crows
  deco("town_grain_baskets", 16, 16, 0.22); deco("town_clay_pots", 38, 16, 0.2);
  for (const c of [12, 15]) critter("hen", c, GR - 1);          // hens pecking by the baskets: they scatter as he runs through
  // the first houses: up the stone stairs, then roof to roof
  stair(36, 4); house(44, 6, 13); oliveRow(44, 12, 6);
  special(51, 9);                                              // over the gap between the roofs: jump for it
  house(53, 5, 11); lostSheep("lambblack", 55, 10, "ledge");   // up on a roof (it followed the ladder): the harp brings it down
  house(60, 6, 13); deco("town_side_fig_rack", 62, 12, 0.22); food("figs", 64, 12);   // figs drying on the roof
  house(68, 4, 15);                                            // a low shed: the way back down
  deco("town_side_log_stack", 80, 16, 0.2);
  critter("goat", 82);                                         // Father's goat, got out again: lead it home to Jesse (world3.js)
  campfire(76, GR - 1, "Hanan", "Every doorstep in Bethlehem swept for the prophet. The elders are trembling: when a prophet comes, it can mean trouble. Or it can mean the LORD is about to do something.");
  // the granary: rats in the grain, and the harmless green whip snake on the beam
  setPiece("granary", 86, GR - 1, { w: 11 });
  snake("whip", 91, GRANARY_BEAM_ROW);
  for (const c of [88, 91, 94, 96]) critter("rat", c, GR - 1, 2);
  deco("town_side_rock_heap", 101, 16, 0.18); deco("town_clay_pots", 130, 16, 0.18); deco("town_grain_baskets", 146, 16, 0.2);
  lostSheep("sheep", 102, 16, "cast");                         // on its back in the lane: roll it over (Down)
  // the lanes: a tall house in the way, so it's over the roofs
  house(108, 5, 12); ladder(106, 12); oliveRow(108, 11, 5);
  house(115, 6, 10); oliveArc(115, 8, 6);
  house(123, 5, 12); oliveRow(123, 11, 5);
  // the threshing floor, where Ruth gleaned in Boaz's fields, long ago (a Journal fact)
  setPiece("threshing", 132, GR - 1, { w: 7 }); food("bread", 135, 16);
  for (const c of [126, 129, 140]) critter("hen", c, GR - 1);   // and scratching for spilled grain round the threshing floor
  stairTower(139); special(141, 4);                            // up the tower's stair, then a flip onto its top
  lostSheep("sheepblack", 144, 16);
  setPiece("barley", 149, GR - 1, { w: 16 });                  // the second field: more crows
  for (const c of [151, 155, 159, 163]) critter("crow", c, GR - 1);
  lostSheep("sheep2", 157, 16);
  // The One: on the highest roof in Bethlehem, a long chain of roof jumps
  house(171, 4, 13); ladder(169, 13);
  house(177, 4, 11); house(183, 4, 9); special(184, 6); house(189, 4, 7); deco("town_side_fig_rack", 179, 10, 0.18);
  house(195, 5, 5); lostSheep("lamb", 197, 4, "one");
  oliveRow(171, 12, 4); oliveRow(177, 10, 4); oliveRow(183, 8, 4); oliveRow(189, 6, 4);
  oliveRow(204, 16, 6); deco("town_hut_round", 203, 16, 0.13);
  talk(214, "Jesse", "David, the flock still needs you. Take them out to the far pasture tomorrow. Your brothers will stay for the prophet.");
  sheepfold(222);
} else if (LEVEL_NAME === "3-2") {
  // ---- 3-2 The Far Pasture: the one who wasn't invited. Far from town, alone with the sheep, while his brothers pass
  // before Samuel (a scene at each campfire, world3.js). Flies to oil off the sheep, a stream, rustlers at the flock. ----
  ground(0, 44);
  campfire(8);                                                 // David's own fire: Hanan is in town for the gathering
  oliveRow(12, 16, 8);                                         // olives: oil in the flask (the flies need it)
  lostSheep("sheep", 24, 16, "flies");                         // flies at its eyes: oil its head (Down)
  critter("fox", 34); oliveArc(30, 16, 6);
  // the stream: stepping stones over the water
  setPiece("pool", 45, GR, { w: 12, say: "Splash! Into the stream. Hop the stepping stones." });
  stepStone(47); stepStone(50); stepStone(53);
  ground(57, 124);
  rock(63, 14, 6, 3); lostSheep("sheepblack", 66, 13, "ledge");   // up on the rocks: the harp brings it down
  special(66, 9);
  deco("olive_tree", 74, 16, 1.1, "back", "golden_olive");
  campfire(82); critter("rustler", 82);                         // a thief comes for the sheep at this fire once you've gone on
  oliveRow(86, 16, 6);
  lostSheep("sheep", 96, 16, "thorns");                        // caught in the thorns: sling the bush
  critter("jackal", 106);                                      // a stray after your lamb
  rock(112, 15, 3, 2); rock(115, 13, 4, 4); oliveRow(115, 12, 4);
  special(121, 8);
  ground(125, 154);
  lostSheep("sheep", 130, 16, "cast");                         // on its back: roll it over (Down)
  critter("fox", 140); oliveArc(134, 16, 8);
  campfire(146); critter("rustler", 146);
  // the second stream, and The One across it, deep in a thorny thicket: charged stones clear the way
  setPiece("pool", 155, GR, { w: 10, say: "Splash! Into the stream. Hop the stepping stones." });
  stepStone(157); stepStone(160); stepStone(162);
  ground(165, 235);
  thicket(169, 13, 2, 4); lostSheep("lamb", 172, 16, "one"); deco("thorn_bush", 174, 16, 0.6);
  lostSheep("sheep", 184, 16, "flies");
  oliveRow(180, 16, 6); critter("jackal", 194);
  rock(198, 14, 4, 3); rock(202, 12, 3, 5); special(203, 7);
  deco("olive_tree", 208, 16, 1.0);
  talk(214, "Shammah", "David! (gasp) Run... all the way here... The prophet sent for you! He won't sit down to eat until you come!");
  sheepfold(222);
} else if (LEVEL_NAME === "3-3") {
  // ---- 3-3 We Will Not Sit Down: "Send for him; we will not sit down until he arrives" (1 Samuel 16:11). Shammah has
  // run all the way out to fetch him, and now he runs ahead the quick way they took as boys: under the fences, over
  // the walls, through the barley and up over the rooftops into town. Everything is one jump or the roll. No timer. ----
  ground(0, 213);
  guide(5, GR - 1, "Remember rolling down the hills when we were little? Under the fences, not over them. Come on!");
  guide(22, GR - 1, "Fence! Get low and roll: {ROLL}.");
  setPiece("barley", 10, GR - 1, { w: 9 });
  fence(25); oliveRow(26, 16, 3);
  lostSheep("sheep", 33, 16);                                  // a straggler: the flock comes too
  wall(38, 15, 2, 2);
  guide(44, GR - 1, "Two more! Don't slow down!");
  fence(47); fence(53); oliveRow(48, 16, 4);
  special(51, 12);                                             // between the fences: a jump from the ground
  campfire(60);
  wall(66, 14, 3, 3); lostSheep("sheepblack", 67, 13);         // up on the wall: jump up to it
  guide(72, GR - 1, "Through the barley! Father's field: we cut through here every harvest.");
  setPiece("barley", 75, GR - 1, { w: 14 }); oliveArc(77, 16, 8);
  lostSheep("sheep", 85, 16, "cast");                          // on its back in the barley: roll it over (Down)
  fence(92); fence(96);
  guide(99, GR - 1, "Rock garden! Up and over.");
  rock(103, 15, 3, 2); rock(107, 13, 3, 4); rock(111, 15, 3, 2); oliveRow(107, 12, 3);
  special(108, 8);
  lostSheep("sheep", 116, 16, "thorns");
  campfire(122);
  setPiece("barley", 126, GR - 1, { w: 6 });
  // into town: up the stairs and over the roofs, the way they ran as boys
  guide(130, GR - 1, "Up the stairs! The roofs are faster than the lanes today, the whole town's in them.");
  stair(133, 4);
  house(141, 6, 12); house(147, 6, 10); house(153, 6, 9); house(159, 4, 9);   // shoulder to shoulder: no gaps to fall into
  oliveRow(141, 11, 5); lostSheep("sheep", 149, 9); oliveRow(153, 8, 5);
  special(156, 4);
  ladder(163, 9);                                              // the gap by the wall: a ladder back up
  // the town wall, thick enough to walk along the top, with a low drain under it: The One went in there
  rock(165, 8, 9, 7); rock(174, 8, 2, 9); setPiece("drain", 165, GR - 1, { w: 9 });
  lostSheep("lamb", 171, 16, "one");
  guide(166, 7, "Nearly there! I can see Father at the gate!");
  oliveRow(166, 7, 9);
  house(176, 5, 10); house(182, 4, 13);
  oliveArc(188, 16, 6);
  guide(196, GR - 1, "There he is! Go on, David. They're all waiting for you.");
  sheepfold(204);
} else if (LEVEL_NAME === "4-1") {
  // ---- 4-1 The Road to Gibeah: north with the king's gifts (1 Samuel 16:20). The donkey with the bread and the wine
  //      follows David, and Father's young goat. Village dogs spook the donkey (the harp calms him), bandits creep up
  //      behind for the gifts, boars in the vineyards (Psalm 80:13), doves on the road (leave them), crows in the vines.
  //      The lost things: five more gifts Father packed, shaken loose on the rough road, most of them hidden (Glen: NES
  //      false walls and Castlevania breakable walls): behind dead branches a charged stone breaks, inside rocks you can
  //      walk into, up on ledges. The One: a lamb from a village flock, on the highest vineyard terrace. ----
  ground(0, 315);
  campfire(6);
  critter("giftdonkey", 1); critter("goat", 0);                  // the king's gifts (world4.js; the goat is world3.js's)
  oliveRow(11, 16, 5); critter("dove", 14); critter("dove", 17);
  lostGift("figs", 23, 16);                                       // the first one, right on the road: so you know what to look for
  deco("town_hut_round", 29, 16, 0.14); deco("town_clay_pots", 33, 16, 0.2); critter("villagedog", 38);   // the first village
  rock(42, 15, 3, 2); rock(45, 13, 3, 4); oliveRow(45, 12, 3); special(46, 7);
  critter("bandit", 50);                                          // behind you, once you're past
  // gift: the bread, in a hollow under a rock shelf, dead branches across its mouth (a charged stone breaks them)
  rock(52, 15, 2, 2); rock(56, 12, 8, 2); deadfall(56, 14, 1, 3); rock(63, 14, 1, 3); lostGift("bread", 60, 16);
  rock(64, 15, 2, 2);
  campfire(70);
  talk(72, "The vineyard keeper", "Shalom, young man. Watch yourself in my vines. Wild boars came out of the woods and tore them up. \"The boar out of the wood ravages it\" (Psalm 80:13).");
  for (const c of [78, 82]) critter("crow", c, GR - 1);          // crows at the grapes: fair game
  critter("boar", 87, GR - 1, 8);
  // gift: the oil, inside an outcrop: its lower left end is only loose stone you can walk into
  rock(93, 13, 10, 4); fakeRock(93, 14, 2, 3); block(95, 14, 2, 3, 0); lostGift("oil", 95, 16);
  inscription(97, 15, "yod");                                     // carved on the wall inside: the first old letter
  critter("boar", 108, GR - 1, 8); oliveRow(110, 16, 5);
  deco("town_hut_round", 116, 16, 0.14); deco("town_grain_baskets", 119, 16, 0.2); critter("villagedog", 121); critter("dove", 124);
  campfire(127);
  critter("bandit", 131);
  // The One, on the highest vineyard terrace; and higher still, a ledge with the cheese (a long jump up)
  rock(136, 15, 3, 2); rock(139, 13, 3, 4); rock(142, 11, 5, 6); lostSheep("lamb", 145, 10, "one"); special(143, 7);
  rock(149, 7, 2, 1); lostGift("cheese", 149, 6);
  oliveRow(152, 16, 4); critter("dove", 156); critter("dove", 158);
  for (const c of [163, 167]) critter("crow", c, GR - 1);
  // gift: the honey, inside an outcrop whose loose stone is at the far (right) end: look back after you climb over
  rock(171, 15, 2, 2); rock(173, 12, 9, 5); fakeRock(180, 13, 2, 4); block(178, 13, 2, 4, 0); lostGift("honey", 178, 16);
  critter("boar", 188, GR - 1, 10);
  oliveArc(194, 16, 6);
  campfire(200);
  deco("town_hut_round", 205, 16, 0.14); deco("town_clay_pots", 208, 16, 0.18); critter("villagedog", 211);
  critter("bandit", 214);
  rock(222, 15, 2, 2); rock(225, 13, 3, 4); special(226, 8);
  oliveRow(231, 16, 6);
  deadfall(240, 10, 2, 7);                                       // a dead tree across the road: a charged stone, or no way on
  critter("boar", 250, GR - 1, 8); for (const c of [256, 259]) critter("crow", c, GR - 1);
  campfire(264);
  critter("bandit", 268);
  critter("villagedog", 276); critter("dove", 280);
  oliveRow(284, 16, 6);
  sheepfold(300);                                                // a village fold below Gibeah: the strays in, then up to the fortress
} else if (LEVEL_NAME === "5-4") {
  // ---- 5-4 Down to Elah, at dawn: the descent into the Valley of Elah. Terebinths (elah = terebinth), the dry
  //      streambed, chariot ruts; both camps on the hills across the valley, and now and then a huge voice booming
  //      across it. The camp's pack donkeys bolted when the giant shouted (the lost things). The One among the
  //      terebinths, behind a fallen trunk. Then wheels behind you: BOSS, the Philistine Chariot. Tobi is with you. ----
  ground(0, 315);
  campfire(4); setPiece("tobistart", 2);
  deco("oak", 10, 16, 0.5); critter("packdonkey", 16);
  talk(14, "Tobi", "Those are terebinths. That's why they call it the Valley of Elah: elah means terebinth. Our camp's on the far hill... and theirs is across from it.");
  oliveRow(20, 16, 5);
  rock(28, 15, 3, 2); rock(31, 13, 3, 4); plat(36, 10, 4); special(37, 6);
  snake("viper", 42);
  deco("oak", 48, 16, 0.45); critter("packdonkey", 52);
  critter("raider", 60);
  // the dry streambed: smooth stones, scorpions under them
  for (const c of [66, 70, 75, 79]) deco("boulder_grey", c, 16, 0.18);
  critter("scorpion", 72); critter("scorpion", 78);
  campfire(86);
  deco("oak", 92, 16, 0.55); oliveArc(94, 16, 6);
  // The One: behind a fallen terebinth trunk, among the trees
  deadfall(102, 13, 2, 4); deco("oak_fallen", 104, 16, 0.4); lostSheep("lamb", 107, 16, "one");
  deco("oak", 112, 16, 0.5); critter("packdonkey", 116);
  rock(122, 15, 3, 2); rock(125, 12, 3, 5); plat(129, 8, 4); critter("packdonkey", 130, 7);   // a donkey up on the rocks: jump to it
  snake("viper", 138); critter("raider", 146);
  campfire(154);
  deco("oak", 160, 16, 0.5); oliveRow(164, 16, 6);
  critter("scorpion", 172); deco("oak", 180, 16, 0.45);
  rock(186, 15, 2, 2); rock(188, 13, 2, 4); special(189, 8);
  critter("packdonkey", 196);
  talk(200, "Tobi", "Listen... wheels. David, that's the chariot. Remember: it can't turn on rough ground.");
  campfire(206);                                                 // the last fire before it (and where Tobi's counsel waits)
  // BOSS: the Philistine Chariot. The arena is W5.CH_ARENA screens from col 214 (to about 270); rough rocky ground near its right end, room to run past it.
  setPiece("chariot", 214);
  setPiece("rough", 251, GR, { w: 8 });
  oliveRow(272, 16, 4);
  sheepfold(280);                                                // a shepherds' fold at the edge of the camp
} else if (LEVEL_NAME === "5-3") {
  // ---- 5-3 The Lookouts' Ridge, at night: the high ridge above the Valley of Elah, both camps' fires far below.
  //      Philistine lookouts with torches watch stretches of it (their light is a cone; it shrinks when the moon goes
  //      behind a cloud: that's the moment to go). Seen = he runs to light his signal fire and raiders come; a quick stone
  //      knocks his torch away. High routes over the lookouts for the scout's leap. Scout cairns knocked over by the
  //      Philistines (the lost things); gazelles (leave them). The One in the hollow under a lookout's tower. Tobi is
  //      with David; at the end, his warning about the chariot (tier 1 counsel for 5-4). Psalm 27:1. ----
  ground(0, 247);
  campfire(4); setPiece("tobistart", 2);
  talk(7, "Tobi", "Keep low up here. The lookouts can see a long way by their torches. But watch the moon: when it goes behind a cloud, their light shrinks. That's your moment.");
  setPiece("cairn", 13, 16);
  talk(12, "Tobi", "See that pile of stones? It was a scout's marker, showing the safe path. They kicked it over. Stand by it a moment and stack it up again.");
  critter("gazelle", 20); critter("gazelle", 23);
  // lookout 1: on the ground, his signal fire behind him
  rock(28, 15, 2, 2);
  setPiece("lookout", 36, GR - 1, { face: -1, fire: 40 }); setPiece("signalfire", 40, GR - 1);
  plat(30, 10, 4); plat(36, 8, 4); plat(42, 10, 4); oliveRow(36, 7, 4);       // the high way over him (the scout's leap)
  rock(46, 14, 3, 3); setPiece("cairn", 47, 13);
  critter("gazelle", 54);
  // the patrolling lookout (Glen's second man)
  setPiece("lookout", 66, GR - 1, { face: 1, patrol: 6 });
  rock(58, 15, 2, 2); rock(74, 15, 2, 2); special(66, 6); plat(64, 9, 5);
  setPiece("cairn", 79, 16);
  campfire(84);
  // the tower: a lookout up on a platform, his fire beside it. The One is in the hollow under it.
  setPiece("tower", 100, 12); plat(100, 12, 4);
  setPiece("lookout", 102, 11, { face: -1, fire: 108 }); setPiece("signalfire", 108, GR - 1);
  lostSheep("lamb", 101, 16, "one");
  rock(112, 14, 3, 3); rock(115, 11, 3, 6); setPiece("cairn", 116, 10);
  critter("gazelle", 124); critter("gazelle", 127);
  setPiece("lookout", 140, GR - 1, { face: 1 });   // looking ahead: come up behind him (he turns now and then)
  rock(132, 15, 2, 2); plat(144, 10, 4); oliveArc(146, 16, 6);
  setPiece("cairn", 152, 16);
  campfire(160);
  setPiece("lookout", 178, GR - 1, { face: -1, fire: 183 }); setPiece("signalfire", 183, GR - 1);
  setPiece("lookout", 194, GR - 1, { face: -1, patrol: 4 });
  plat(172, 10, 4); plat(179, 7, 4); plat(186, 9, 4); plat(192, 7, 4); special(181, 3);   // the high way
  rock(200, 15, 3, 2); setPiece("cairn", 204, 16);
  critter("gazelle", 210);
  talk(214, "Tobi", "Listen. Down in the valley there's a Philistine chariot that hunts scouts on the road. If it comes for us, don't try to outrun it. A chariot can't turn on rough ground. Get to the rocks.");
  talk(218, "Tobi", "My father taught me the Law: \"When you go out to battle against your enemies, and see horses, chariots, and a people more numerous than you, you shall not be afraid of them; for the LORD your God... is with you\" (Deuteronomy 20:1).");
  oliveRow(220, 16, 5);
  talk(224, "Tobi", "Look down there, David. Those are our fires. We're nearly there.");
  talk(229, "", "Years later, David would write: \"The LORD is my light and my salvation. Whom shall I fear? The LORD is the strength of my life. Of whom shall I be afraid?\" (Psalm 27:1)");
  sheepfold(232);
} else if (LEVEL_NAME === "5-2") {
  // ---- 5-2 The Mountain Trail, at night: a narrow trail along the cliffs. Hyenas laugh before they lunge; the leopard
  //      waits in its tree. A frightened scout dropped his things all along the trail as he ran (the lost things), and
  //      he's hiding in a cave: light the fire, play the harp, and Tobi teaches the scout's leap (the double jump). The very
  //      next thing is a cliff you could never have climbed, and The One is up there. Spiked crevices; the last one is too
  //      wide for one jump. Psalm 4:8. ----
  ground(0, 20); ground(25, 101); ground(106, 157); ground(170, 251);
  campfire(4);
  oliveRow(8, 16, 4);
  setPiece("gear", 14, 16, { name: "waterskin" });               // the first of the scout's things, right on the trail
  setPiece("spikes", 21, GR, { w: 4 });                          // a crevice: one good jump
  rock(28, 15, 3, 2); rock(31, 13, 3, 4); plat(36, 11, 4); setPiece("gear", 37, 10, { name: "sandal" });
  critter("hyena", 42);
  rock(48, 15, 2, 2); oliveArc(50, 16, 5); special(52, 9);
  critter("hyena", 58); critter("hyena", 63);
  campfire(68);
  setPiece("leopard", 84);                                       // the leopard's tree, by the trail
  rock(92, 15, 3, 2); oliveRow(93, 14, 3);
  setPiece("gear", 99, 16, { name: "horn" });
  setPiece("spikes", 102, GR, { w: 4 });
  critter("hyena", 112);
  // Tobi's cave: an overhang over a cold fire
  rock(119, 11, 10, 3);
  setPiece("tobicave", 120); campfire(122, GR - 1);
  // the cliff behind the cave: only the scout's leap gets up it. The One is up top.
  rock(132, 10, 6, 7); rock(138, 8, 5, 9); plat(141, 4, 3); lostSheep("lamb", 142, 3, "one");
  oliveRow(132, 9, 5);
  rock(143, 12, 4, 5); setPiece("gear", 150, 16, { name: "pack" });
  setPiece("spikes", 158, GR, { w: 12 });                        // the wide crevice: one jump won't do it
  oliveArc(159, 12, 10);
  critter("hyena", 180); critter("hyena", 186);
  rock(192, 14, 3, 3); rock(195, 11, 3, 6); plat(199, 7, 3); setPiece("gear", 200, 6, { name: "staff" });
  campfire(206);
  special(214, 5); plat(212, 9, 4);
  oliveRow(220, 16, 6);
  talk(224, "Tobi", "There. Down the far side of this ridge is the road to the valley. I'm not afraid of the dark any more. \"Be strong and courageous. Don't be afraid... for the LORD your God himself is who goes with you\" (Deuteronomy 31:6).");
  talk(229, "", "Years later, David would write: \"In peace I will both lay myself down and sleep, for you alone, LORD, make me live in safety.\" (Psalm 4:8)");
  sheepfold(234);
} else if (LEVEL_NAME === "6-4") {
  // ---- 6-4 The Tower's Shadow: along the streambed toward the Philistine watchtower, its shadow lengthening over the
  //      level (world6.js). Tighter volleys; Philistine skirmishers charge out to block the way. The lost things: 5
  //      soldiers pinned in the forward trench; lifted, they're the ones throwing stones from the slope in the fight.
  //      BOSS: the Philistine Watchtower (arena from col 160; the tower at 183-188, its rope ladder at 181). The One:
  //      under the tower's ramp, at the very end. ----
  ground(0, 229);
  const bank = (c, w) => { rock(c, 13, w, 1); setPiece("bank", c, 13, { w }); };   // an overhang to duck under (the volleys come down nearly straight)
  campfire(3);
  talk(6, "A soldier", "The forward trench is round the bend. Five of ours are pinned down in it, and that tower keeps creeping closer. Every day its shadow's longer.");
  rock(11, 15, 3, 2);
  setPiece("volley", 16, GR, { to: 58 });
  bank(18, 6);
  setPiece("skirmisher", 30);
  bank(32, 6); special(34, 11);
  snake("viper", 42);
  bank(46, 7);
  setPiece("skirmisher", 56);
  // the forward trench: a low wall of rocks and shields, overhangs, five men pinned down behind them
  setPiece("volley", 62, GR, { to: 100 });
  rock(63, 16, 1, 1); bank(64, 8); setPiece("fearful", 66, GR - 1, { look: 0, dir: -1 }); setPiece("fearful", 69, GR - 1, { look: 1, dir: -1 });
  rock(73, 16, 1, 1); bank(74, 8); setPiece("fearful", 76, GR - 1, { look: 2, dir: -1 }); setPiece("fearful", 79, GR - 1, { look: 3, dir: -1 });
  critter("scorpion", 84);
  rock(86, 16, 1, 1); bank(87, 6); setPiece("fearful", 90, GR - 1, { look: 4, dir: -1 });
  setPiece("skirmisher", 98);
  campfire(104);
  rock(110, 15, 3, 2); rock(113, 13, 3, 4); special(114, 10);
  // closer under the tower: slingers' stones, and more skirmishers
  setPiece("volley", 120, GR, { to: 152, shot: "stones" });
  bank(122, 6); setPiece("skirmisher", 132);
  bank(136, 7); snake("viper", 144);
  bank(146, 6); setPiece("skirmisher", 151);
  campfire(156);
  // BOSS: the Philistine Watchtower. Its rope ladder down the left side; the rungs above row 12 are cut.
  setPiece("watchtower", 160);
  ladder(181, 12);
  // past it, where it stood: its ramp, and The One under it
  plat(206, 14, 4); lostSheep("lamb", 207, GR - 1, "one");
  special(208, 12);
  sheepfold(218);
} else if (LEVEL_NAME === "6-3") {
  // ---- 6-3 The Water Carriers: down into the streambed for water. The water carriers (and Shammah, with a jar of his
  //      own) follow David on his footsteps; the tower's archers on the far side fire volleys, and the carriers duck.
  //      On the way down the jars are empty and a hit costs nothing; they fill at the pool (Psalm 23:2), and from then
  //      on a hit spills a jar. Undercut banks are long enough to shelter the whole line. The lost things: 5 carriers
  //      who refused to go, hiding in the reeds; lifted, they pick up a jar and join the line. The One: on a reed
  //      ledge over the deepest pool (double jump from the rock in the middle). Abinadab by the path: the tower's
  //      wheel pins (counsel, tier 1). ----
  ground(0, 117); ground(132, 239);
  const bank = (c, w) => { rock(c, 13, w, 1); setPiece("bank", c, 13, { w }); };   // an undercut bank: the line walks in under it and ducks
  campfire(3);
  talk(5, "The water captain", "My men won't go down there. I don't blame them. The tower's archers shoot at anyone who goes near the water. ...But if you're going, they might follow you.");
  setPiece("carriers", 12, GR - 1, { n: 3 });
  rock(18, 15, 3, 2);
  // the way down: volleys, but the jars are still empty (learn to lead the line under the banks)
  setPiece("volley", 24, GR, { to: 66 });
  bank(26, 8);
  setPiece("fearful", 30, GR - 1, { look: 0, dir: -1 });       // in the reeds under the bank
  snake("viper", 38);
  bank(42, 10);
  rock(55, 15, 2, 2); special(56, 13);
  setPiece("fearful", 60, GR - 1, { look: 1, dir: -1 });
  bank(57, 8);
  // the first pool still holding water: fill the jars
  setPiece("fill", 70, GR, { w: 6 });
  critter("scorpion", 80);
  rock(84, 15, 3, 2); rock(87, 14, 2, 3);
  setPiece("brother", 92, GR - 1, { who: "abinadab" });        // Abinadab, by the path
  // full jars now: every hit spills one
  setPiece("volley", 96, GR, { to: 114 });
  bank(97, 12); setPiece("fearful", 99, GR - 1, { look: 2, dir: -1 });
  snake("viper", 112);
  // the deepest pool: stepping stones, a rock standing up in the middle, and The One on the reeds above it
  setPiece("pool", 118, GR, { w: 14, stream: true, say: "Splash! Into the deep pool. Hop the stones." });
  stepStone(120); stepStone(122); pillar(124, 13, 2); stepStone(127); stepStone(129);
  plat(124, 7, 2); lostSheep("lamb", 124, 6, "one");             // up on the reeds: double jump from the rock
  // a second pool to fill a spilled jar, then the long way back up
  setPiece("fill", 137, GR, { w: 5 });
  setPiece("fearful", 146, GR - 1, { look: 3, dir: -1 });
  campfire(150);
  setPiece("volley", 156, GR, { to: 214, shot: "stones" });
  bank(158, 11);
  critter("scorpion", 172);
  bank(176, 12); setPiece("fearful", 179, GR - 1, { look: 4, dir: -1 });
  snake("viper", 192); special(193, 12);
  bank(197, 12);
  rock(211, 15, 3, 2);
  setPiece("cistern", 220);                                      // the camp's water jars
  sheepfold(226);
} else if (LEVEL_NAME === "6-2") {
  // ---- 6-2 No-Man's Land: down the slope from the camp and out into the open ground between the armies. The archers
  //      and slingers on the far slope fire volleys (world6.js): a shout, shadows on the ground, then the rain; get
  //      behind a rock or into a gap. Halfway, on a rise, David watches the giant's morning shout (17:4-10) and the
  //      Field Guide card fills in. The lost things: 5 frightened soldiers pinned behind rocks; lifted, they run back up
  //      the hill. The One: a lamb wandered right out into the open. ----
  ground(0, 229);
  const shelter = (c, w) => { rock(c, 13, w, 1); setPiece("shelter", c, 13, { w }); };   // an overhanging rock: walk in under it (the volleys come down nearly straight)
  campfire(3);
  setPiece("standing", 8, GR - 1, { look: 1 });
  talk(7, "A soldier", "You're going down there? Their archers shoot at anything that moves. When you hear the shout, watch the ground for the shadows, and get in under one of the big overhanging rocks.");
  setPiece("tent", 11, GR, { w: 4 });
  rock(18, 15, 3, 2);
  // the open ground: arrows. The shelters are cover; the tall rocks are just in the way
  setPiece("volley", 24, GR, { to: 110 });
  rock(28, 14, 2, 3);
  shelter(33, 5); setPiece("fearful", 35, GR - 1, { look: 0, dir: -1 });   // pinned under the rock
  snake("viper", 42);
  shelter(47, 5);
  special(48, 11);
  shelter(55, 5); setPiece("fearful", 57, GR - 1, { look: 1, dir: -1 });
  critter("hedgehog", 63);
  rock(68, 15, 3, 2); rock(71, 13, 2, 4);
  shelter(79, 5); setPiece("fearful", 81, GR - 1, { look: 2, dir: -1 });
  lostSheep("lamb", 92, GR - 1, "one");                                      // right out in the open: between volleys
  shelter(96, 4);
  snake("viper", 102);
  rock(106, 14, 2, 3);
  // the rise: from the top of it David can see across to the Philistine lines (the scene)
  rock(113, 15, 3, 2); rock(116, 14, 9, 3);
  setPiece("giantview", 120, 13);
  rock(125, 15, 3, 2);
  campfire(128);                                                            // halfway: rest after watching the giant
  // the slingers' ground, closer under the far slope
  setPiece("volley", 130, GR, { to: 168, shot: "stones" });
  shelter(133, 4);
  shelter(141, 5); setPiece("fearful", 143, GR - 1, { look: 3, dir: -1 });
  critter("scorpion", 150);
  shelter(152, 4); special(153, 11);
  rock(161, 15, 3, 2); rock(164, 14, 2, 3);
  campfire(169);                                                            // between the slingers and the last arrows
  // and arrows again, the last stretch back toward the camp's edge
  setPiece("volley", 172, GR, { to: 214 });
  shelter(175, 4);
  snake("viper", 181);
  shelter(185, 5); setPiece("fearful", 187, GR - 1, { look: 4, dir: -1 });
  shelter(195, 5);
  critter("hedgehog", 204);
  shelter(207, 4); special(208, 11);
  sheepfold(222);
} else if (LEVEL_NAME === "6-1") {
  // ---- 6-1 The Camp of Fear: the Israelite camp on its hill above the Valley of Elah, forty days into the giant's
  //      shouting (1 Samuel 17:16). Tents to bounce on, supply wagons, the watch platform, cooking fires. The lost things:
  //      5 frightened soldiers hidden about the camp; play the harp beside each one (world6.js). David goes from man to
  //      man asking about the giant (17:25-27), and at the top of the camp Eliab hears him (17:28-30): a scene, not a
  //      fight. The One: a lamb from the army's food flock, loose on top of the supply wagons. ----
  ground(0, 245);
  campfire(4);
  setPiece("standing", 9, GR - 1, { look: 0 });
  talk(8, "A soldier", "You're Jesse's boy? Your brothers are up the hill. Keep your head down when he shouts. Everyone does.");
  setPiece("tent", 13, GR, { w: 4 }); setPiece("fearful", 18, GR - 1, { look: 0 });             // behind the first tents
  setPiece("tent", 21, GR, { w: 5 });
  critter("hen", 28);
  setPiece("wagon", 31, GR, { w: 4 }); special(33, 10);
  rock(38, 15, 3, 2); rock(41, 13, 3, 4);
  setPiece("standing", 47, GR - 1, { look: 1 }); setPiece("prop", 44, GR, { nm: "camp_shields", size: 0.14 });
  talk(46, "A soldier", "Have you seen this man who has come up? He has surely come up to defy Israel. (1 Samuel 17:25)");
  setPiece("tent", 51, GR, { w: 4 }); setPiece("tent", 56, GR, { w: 5 });
  setPiece("wagon", 63, GR, { w: 4 }); setPiece("fearful", 65, GR - 1, { look: 1, dir: -1 });  // under the wagon
  snake("viper", 71); setPiece("prop", 72, GR, { nm: "wagon_rails", size: 0.15 });
  campfire(76);
  // the rocks at the camp's edge, a man hiding up on top
  rock(82, 15, 4, 2); rock(86, 13, 4, 4); rock(90, 11, 5, 6); setPiece("fearful", 93, 10, { look: 2 });
  special(91, 6);
  setPiece("tent", 98, GR, { w: 5 });
  setPiece("standing", 106, GR - 1, { look: 2 });
  talk(105, "A soldier", "The king will give great riches to the man who kills him, and will give him his daughter, and will make his father's house tax-free in Israel. (1 Samuel 17:25)");
  // the watch platform: a man up there who won't look out over the valley any more
  setPiece("tower", 112, 11); plat(112, 11, 4); setPiece("fearful", 114, 10, { look: 3 });
  setPiece("wagon", 118, GR, { w: 4 });
  critter("scorpion", 125); critter("hen", 129); setPiece("prop", 127, GR, { nm: "wagon_arms_34", size: 0.12 });
  campfire(134);
  setPiece("tent", 139, GR, { w: 4 }); setPiece("tent", 144, GR, { w: 4 }); setPiece("tent", 149, GR, { w: 5 });
  setPiece("prop", 152, GR, { nm: "wagon_jars_34", size: 0.12 }); rock(155, 15, 3, 2); special(156, 10);
  setPiece("standing", 161, GR - 1, { look: 3 }); setPiece("prop", 163, GR, { nm: "camp_spears", size: 0.16 });
  talk(160, "A soldier", "Forty days. Morning and evening, he comes out and shouts, and we all go and stand in the line, and nobody moves.");
  setPiece("tent", 165, GR, { w: 5 }); setPiece("fearful", 171, GR - 1, { look: 4, dir: -1 });  // curled up behind the last tent
  snake("viper", 176);
  // the supply wagons, stacked high with sacks: The One got up on top
  setPiece("wagon", 182, GR, { w: 4 }); rock(186, 13, 3, 4); setPiece("wagon", 189, GR, { w: 4 });
  plat(185, 10, 3); plat(188, 7, 3);
  lostSheep("lamb", 189, 6, "one");
  campfire(196);
  setPiece("tent", 201, GR, { w: 4 });
  setPiece("standing", 207, GR - 1, { look: 4 });
  // the top of the camp, by the commanders' tents: David asks about the giant, and Eliab hears him
  setPiece("eliab", 212);
  setPiece("tent", 218, GR, { w: 5 });
  sheepfold(228);                                               // the pen of the army's food flock
} else if (LEVEL_NAME === "5-1") {
  // ---- 5-1 The Supply Road: west from Bethlehem with the provisions for the brothers (1 Samuel 17:17-18). Families
  //      coming the other way, running from the Philistines; raiders up in the hills after grain (they snatch a loaf or a
  //      cheese: hit them and they drop it); vultures circling (they follow armies); vipers and scorpions in the rocks.
  //      The lost things: the fleeing family's flock, scattered in their panic: bring them to the fold where the family
  //      waits, and the father tells you about the soldier in the cave (5-2). Dalet on a roadside rock. The One ran up
  //      into the abandoned watchtower: climb the broken stairs. Single jump only (the double jump is 5-2). ----
  ground(0, 249);
  campfire(5);
  oliveRow(10, 16, 5); setPiece("fleeing", 12);
  talk(16, "The fleeing father", "You're going that way? Boy, there's a giant in that valley. Turn around! The raiders scattered our sheep all over these hills. If you find any, we'll be at the fold down the road.");
  lostSheep("sheep", 27, 16);                                   // the first one, right by the road
  rock(32, 15, 3, 2); rock(35, 13, 3, 4); oliveRow(35, 12, 3); special(36, 8);
  snake("viper", 41);
  critter("raider", 48);                                        // down the road at you, for the provisions
  setPiece("vultures", 52);
  wall(56, 15, 4, 2);                                           // a dry-stone field wall
  rock(61, 13, 5, 4); lostSheep("sheep2", 64, 12, "ledge");     // up on the rocks: play the harp below
  oliveArc(68, 16, 5); setPiece("fleeing", 68);
  campfire(74);
  rock(79, 14, 4, 3); inscription(80, 15, "dalet");             // scratched on a roadside rock: the old letter Dalet
  critter("scorpion", 86);
  critter("raider", 92);
  lostSheep("sheepblack", 99, 16);
  // the olive terraces: up and up, a lamb at the top
  rock(103, 15, 6, 2); rock(109, 13, 6, 4); rock(115, 11, 6, 6); oliveRow(110, 12, 4); oliveRow(116, 10, 4);
  lostSheep("lamb", 119, 10, "ledge");
  special(117, 6);
  snake("viper", 125); critter("raider", 130); setPiece("fleeing", 132);
  campfire(138);
  // the abandoned watchtower: The One ran up the broken stairs
  stair(142, 4); plat(150, 9, 3);                               // the broken stairs, and a beam where a floor was
  house(153, 5, 7);                                             // the old watchtower (Glen's tall town house)
  lostSheep("lamb", 155, 6, "one"); oliveRow(153, 6, 2);
  setPiece("vultures", 162);
  critter("scorpion", 166);
  wall(170, 15, 3, 2); critter("raider", 176);
  lostSheep("sheep", 182, 16);
  rock(188, 15, 3, 2); rock(191, 13, 4, 4); special(192, 8);
  campfire(198);
  snake("viper", 204); critter("raider", 210);
  oliveRow(214, 16, 6); setPiece("fleeing", 206);
  talk(222, "The fleeing father", "Our sheep! Bring them into the fold, boy. We'll take them from there.");
  sheepfold(232);                                               // the fold by the road, where the family waits
} else if (LEVEL_NAME === "4-2") {
  // ---- 4-2 The Training Yard: David arrives at Gibeah and the captain of the yard wants to see what the shepherd can do
  //      (he's one of Saul's armor-bearers now, 1 Samuel 16:21). Gera, an old left-handed slinger of Benjamin (Judges
  //      20:16), teaches quick release. A sling course of targets (standing, on ropes, swinging) and clay jars on the
  //      walls; guard dogs; five of the king's goats have strayed; The One is the lamb meant for the king's table, in a feed
  //      shed up on the wall. The letter He is scratched on the wall behind a target. ----
  ground(0, 231);
  campfire(5);
  talk(9, "Gera", "So you're the shepherd with the sling. Benjamin's slingers are famous, you know. Seven hundred of us, left-handed, and \"every one of them could sling a stone at a hair and not miss\" (Judges 20:16).");
  talk(15, "Gera", "You throw well. But slow. Watch me: release, reload, release. Tap B twice, quick, and a second stone follows the first.", "quick");
  setPiece("target", 21, 14); setPiece("target", 25, 12); setPiece("target", 29, 15);   // the first targets: try two at once
  special(27, 8);
  critter("goat", 34);                                          // a stray from the king's flock
  setPiece("target", 40, 11, { move: "rope" }); setPiece("target", 45, 10, { move: "rope" });
  // the battlements: up the steps, clay jars along the top
  rock(50, 15, 2, 2); wall(52, 12, 10, 5); setPiece("jar", 54, 11); setPiece("jar", 57, 11); setPiece("jar", 60, 11);
  rock(62, 15, 2, 2);
  rock(68, 13, 3, 4); inscription(67, 14, "he"); setPiece("target", 67, 14);   // the target hides a letter scratched on the wall
  critter("guarddog", 74);
  campfire(80);
  rock(85, 14, 3, 3); critter("goat", 86, 13);                 // up on the woodpile
  setPiece("target", 93, 12, { move: "swing" }); setPiece("target", 99, 12, { move: "swing" });
  special(97, 6);
  rock(101, 14, 3, 3); rock(104, 11, 4, 6); setPiece("target", 111, 9);   // up the step and onto the rock: a target you can only reach from up there
  critter("goat", 114);
  // The One: the lamb meant for the king's table, in a feed shed up on the fortress wall
  ladder(117, 10); wall(119, 10, 9, 7); deco("town_grain_baskets", 122, 9, 0.2); lostSheep("lamb", 125, 9, "one");   // feed for the king's animals, and the lamb meant for his table
  oliveRow(119, 9, 4);
  critter("guarddog", 133);
  setPiece("target", 138, 13); setPiece("target", 141, 10, { move: "rope" }); special(140, 5);
  campfire(146);
  critter("goat", 151);
  setPiece("target", 157, 12, { move: "swing" }); setPiece("target", 162, 9, { move: "rope" }); setPiece("target", 166, 14);
  rock(172, 15, 2, 2); wall(174, 12, 9, 5); setPiece("jar", 176, 11); setPiece("jar", 179, 11); setPiece("jar", 181, 11);
  rock(183, 15, 2, 2);
  critter("goat", 189, GR - 1);
  critter("guarddog", 195);
  oliveRow(198, 16, 5);
  talk(204, "Gera", "Not bad, shepherd. Not bad at all. \"Do you see a man skilled in his work? He will serve kings\" (Proverbs 22:29). Go on, the steward is waiting for you.");
  sheepfold(215);                                                // the palace fold: the king's goats in
} else if (LEVEL_NAME === "4-3") {
  // ---- 4-3 The Broken String: David is called to play for the king for the first time, and a string on his harp snaps.
  //      The Steward (the one who tells the truth) sends him into Gibeah before nightfall: a gut string from the market,
  //      a tuning peg from the carpenter, beeswax from the beekeeper. Springy stall awnings, rooftops, a seller's runaway
  //      hens (the lost things: walk up slowly), the beekeeper's bees (leave them) and hornets in the old wall (not so
  //      harmless). The One hides under a cloth stall and only comes out to the harp, once it's mended. Waw on a doorpost. ----
  ground(0, 213);
  campfire(5);                                                  // the palace kitchen hearth
  talk(8, "The Steward", "So you're the shepherd boy with the harp. The king is not well. Everyone here pretends he is. I won't.");
  talk(13, "The Steward", "A string snapped? Then into town with you, before nightfall. A gut string from the market, a new tuning peg from the carpenter, and beeswax for the wood. Go.");
  // the market: stall awnings to bounce up on, the string seller's goods on the highest one
  oliveRow(16, 16, 4);
  setPiece("awning", 20, 14, { w: 3 }); deco("town_clay_pots", 21, 16, 0.18); critter("hen", 24);
  setPiece("awning", 26, 12, { w: 3 }); deco("town_grain_baskets", 27, 16, 0.18);
  setPiece("awning", 32, 10, { w: 3 }); questItem("string", 33, 5);   // bounce high off the third awning for it
  critter("hen", 30);
  rock(36, 14, 2, 3); house(38, 5, 12); inscription(38, 15, "waw");                 // a doorpost with an old letter cut into it
  house(44, 5, 10); house(50, 4, 12); special(51, 7);
  critter("dove", 56); critter("hen", 58);
  campfire(62);
  // the carpenter's yard: stacks of beams to climb, the peg on the tallest
  talk(64, "The carpenter", "A tuning peg? I made one this morning, and the boy put it up on the beams to dry. Up you go, if you can.");
  rock(68, 15, 3, 2); rock(72, 13, 3, 4); rock(76, 10, 3, 7); rock(80, 12, 2, 5); questItem("peg", 77, 9);
  deco("town_side_log_stack", 70, 16, 0.2); deco("town_log_stack", 84, 16, 0.2);
  critter("guarddog", 90);
  critter("hen", 94);
  campfire(100);
  // the beekeeper: his bees are calm if you leave them; the hornets in the old wall past them are not
  talk(103, "The beekeeper", "Beeswax for a harp? Take what's by the hive. My bees won't hurt you if you leave them be. But watch the old wall past them: hornets.");
  deco("beehive_tree", 108, 16, 1.2); for (let k = 0; k < 4; k++) bee(108, k); questItem("wax", 111, 16);
  rock(116, 15, 2, 2); rock(118, 13, 3, 4); for (const r of [12, 10]) hornet(120, r);   // a step, the old wall, and its hornets
  oliveRow(124, 16, 5); critter("hen", 128);
  rock(130, 14, 2, 3); house(132, 5, 12); house(138, 4, 9); ladder(136, 12); special(139, 4);
  critter("dove", 146);
  campfire(150);
  setPiece("clothstall", 158);                                  // The One is under it: play the mended harp beside it
  deco("town_clay_pots", 162, 16, 0.18);
  critter("guarddog", 168);
  house(174, 5, 13); special(176, 9);
  talk(184, "The Steward", "You found them all? Good. Now listen. When the dark comes on him, don't rush. Play steady. Rushing makes it worse.");
  sheepfold(196);                                               // back to the palace
} else if (LEVEL_NAME === "4-4") {
  // ---- 4-4 The King's Hall: night, a storm outside. The king is troubled again. Shadows drift through the halls (a cold
  //      touch stops David in his tracks); light the five hall lamps (the lost things) and the shadows near them melt.
  //      Palace dogs bark. The One wandered in out of the storm, under the great staircase. Then Saul's Torment. ----
  ground(0, 225);
  campfire(5, GR - 1, "The Steward", "The king is troubled again. Hear the storm? Light the hall lamps as you go: the dark keeps back from the light. Now, David.");
  setPiece("hall_lamp", 14); setPiece("wisp", 20, 13); setPiece("wisp", 27, 12);
  critter("guarddog", 32);
  plat(36, 13, 6); plat(43, 10, 5); special(45, 6); setPiece("wisp", 40, 9);   // up along the balconies
  setPiece("hall_lamp", 52);
  inscription(58, 12, "he");                                     // on a column: the second He
  setPiece("wisp", 62, 13); setPiece("wisp", 68, 11); setPiece("wisp", 74, 13);
  campfire(80, GR - 1, "The Steward", "Those old marks on the columns? Our fathers wrote from right to left, boy. Most people here have forgotten.");
  // the great staircase: The One is hiding underneath (a low gap: crawl in)
  stair(86, 5); wall(96, 11, 8, 4); lostSheep("lamb", 100, 16, "one");
  setPiece("hall_lamp", 106); setPiece("wisp", 110, 12);
  critter("guarddog", 116);
  plat(120, 12, 5); plat(127, 9, 5); plat(134, 12, 5); special(129, 5);
  setPiece("wisp", 125, 8); setPiece("wisp", 138, 11); setPiece("hall_lamp", 142);
  setPiece("wisp", 150, 13); setPiece("wisp", 156, 10); setPiece("wisp", 162, 13);
  campfire(166);                                                // the servants' fire: back here if the king sends you out
  setPiece("hall_lamp", 172); plat(174, 13, 5);
  talk(182, "The Steward", "There he is. Sit beside him and play. Steady, David. Steady.");
  setPiece("throne", 196);                                      // BOSS: Saul's Torment (world4.js)
  sheepfold(208);                                               // the palace door: out into the morning
} else if (LEVEL_NAME === "3-4") {
  // ---- 3-4 The Chosen Shepherd: the morning after the anointing, the new king goes back to the sheep (16:19). Open
  // grassland as a storm rolls in: wind, rain, lightning. At the end a wild ox charges out of the rain at the flock. ----
  ground(0, 309);
  campfire(6, GR - 1, "Hanan", "So. The prophet poured oil on your head. And tomorrow the sheep still need water. Kings are made in the small things, David.");
  talk(16, "Hanan", "Storm coming. In a storm the wild oxen panic and charge at anything that moves. If one charges you, roll ({roll}) under its horns. Sooner or later it'll run itself into a tree.");
  oliveRow(20, 16, 6);
  lostSheep("sheep", 30, 16);
  rock(38, 15, 3, 2); rock(41, 13, 3, 4); oliveRow(41, 12, 3); special(42, 7);
  critter("fox", 50); oliveArc(52, 16, 6);
  lostSheep("sheep", 62, 16, "cast");                          // on its back in the wet grass: roll it over (Down)
  campfire(72);
  setPiece("wind", 78, GR - 1, { end: 118 });                  // the gusts: wait them out, or lean into them
  rock(84, 15, 2, 2); rock(92, 14, 3, 3); lostSheep("sheepblack", 93, 13, "ledge");
  oliveRow(98, 16, 6); critter("jackal", 104);
  lostSheep("sheep", 112, 16, "thorns");
  special(116, 11);
  campfire(124);
  // The One: in a hollow under a fallen oak, lying on its root ball. Roll in under the trunk.
  rock(134, 14, 2, 3); block(136, 14, 8, 1, 9); setPiece("oak", 134, 14, { w: 10 }); lostSheep("lamb", 141, 16, "one");
  oliveRow(136, 13, 8);
  // the long wet stretch (Glen, 2026-10-15): mud slicks, drops that make you slip, foxes hiding in the bushes
  oliveArc(148, 16, 8);
  ambushFox(153);                                               // in a bush: out it comes as you pass
  setPiece("mud", 157, GR - 1, { w: 10 }); lostSheep("sheep2", 162, 16);   // a slick of mud: stop short and you slide
  rock(169, 15, 3, 2); rock(172, 13, 3, 4); rock(175, 11, 4, 6); oliveRow(175, 10, 4); special(177, 6);   // up onto the high ledge...
  setPiece("mud", 180, GR - 1, { w: 12 });                      // ...and off it, down into the mud
  oliveArc(184, 16, 6); ambushFox(189);
  campfire(196);                                                // halfway: rest and play
  setPiece("wind", 202, GR - 1, { end: 232 });                  // the wind again, harder out here
  rock(206, 15, 2, 2); rock(214, 14, 3, 3); oliveRow(214, 13, 3); oliveRow(220, 16, 5);
  ambushFox(224);
  rock(234, 15, 2, 2); rock(237, 13, 3, 4); oliveRow(237, 12, 3);
  campfire(244);                                                // the checkpoint before the ox
  // the arena: two big oaks, the flock huddled at the left, and the ox out of the rain
  setPiece("flockHuddle", 249);                                  // the flock, huddled behind the arena's first tree
  rock(252, 15, 2, 2); setPiece("oxtree", 255);                  // the arena: hop the rock in; an oak at each end, the ox in between
  setPiece("oxtree", 286); rock(288, 15, 2, 2);
  setPiece("ox", 270, GR - 1);
  sheepfold(299);
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
const aimAgo = { up: 9, left: 9, right: 9 };
const aimHeld = b => aimAgo[b] < TUNE.AIM_GRACE;   // held now, or a moment ago: a D-pad diagonal flickers, and a thumb comes off Up just before the stone leaves
function updateDavid(dt) {
  const d = david;
  d.t += dt;
  for (const b in aimAgo) aimAgo[b] = held(b) ? 0 : aimAgo[b] + dt;
  if (caveDavid(d, dt)) return;   // walking into or out of a cave (world1.js)
  if (updateCodeEntry(d, dt)) return;   // entering the throw at a carved wall (world1.js)
  if (typeof updateHarpDuel === "function" && updateHarpDuel(d, dt)) return;   // playing the harp for a frightened animal (world2.js)
  if (typeof updateSceneDavid === "function" && updateSceneDavid(d, dt)) return;   // a talk that holds the controls (world2.js)
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
  const busy = d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "standup" ||
               (d.state === "slip" && d.t < TUNE.SLIP_LOCK) || d.state === "climb" || d.state === "topout";

  // --- harp (Select): kneel and play while standing still
  if ((pressed("select") || pressed("y")) && d.onGround && !d.carrying && !busy && Math.abs(d.vx) < 30) {
    if (d.harp) { d.harp = false; setState("standup"); } else if (!(typeof harpBroken === "function" && harpBroken())) { d.harp = true; setState("kneel"); }   // (4-3: a broken string)
  }
  // Up, any direction, A or B: put the harp away and stand up
  if (d.harp && (dir !== 0 || pressed("up") || pressed("a") || pressed("b"))) { d.harp = false; setState("standup"); }

  // --- pick up / put down the lamb (Down, standing still, next to it)
  if (pressed("down") && d.onGround && !busy && !d.harp && d.throwT < 0 && Math.abs(d.vx) < 40) {   // (not mid-throw: Down while charging is a crouch)
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
    } else if ((CAN_DOUBLE_JUMP || hasSkill("leap")) && pressed("a") && !d.onGround && !d.flipUsed && d.coyote <= 0) {
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
    if (pressed("b") && d.throwT < 0) { d.charging = true; d.charge = 0; d.throwT = 0; d.thrown = false; d.quickUsed = false; d.quickQueued = false; }
    if (d.throwT >= 0 && !d.thrown) d.aimingUp = aimHeld("up") && hasSkill("aimUp");   // aim decided up to the moment the stone leaves
    if (d.charging) { d.charge += dt; if (released("b") || !held("b")) { d.charging = false; d.runThrow = d.onGround && Math.abs(d.vx) > TUNE.RUN_THROW_SPEED; } }
  }
  // a throw that hasn't left his hand is dropped if he picks up the lamb or the harp (or it would hang there, whirling, forever)
  if ((d.carrying || d.harp) && d.throwT >= 0 && !d.thrown) { d.charging = false; d.throwT = -1; d.runThrow = false; }
  if (d.throwT >= 0) {
    if (!d.charging) d.throwT += dt;
    const dur = d.runThrow ? TUNE.RUN_THROW_TIME : TUNE.THROW_TIME;
    const relAt = d.runThrow ? dur * 9.5 / 12 : d.aimingUp ? dur * 9.5 / 12 : dur * 7 / 12;   // running and upward throws: the stone leaves at frame 10
    if (!d.thrown && d.throwT >= relAt) {
      d.thrown = true;
      const full = hasSkill("charge") ? Math.min(1, d.charge / TUNE.CHARGE_TIME) : 0;   // full power is taught in World 2
      const sp = full >= 1 ? TUNE.STONE_SPEED_CHARGED : TUNE.STONE_SPEED;
      const aimUp = aimHeld("up") && hasSkill("aimUp"), straightUp = aimUp && !(aimHeld("left") || aimHeld("right"));
      const aimDown = held("down") && !d.onGround;   // Down + B in the air: throw diagonally down
      let ang = aimUp ? (straightUp ? -Math.PI / 2 + 0.04 : -Math.PI / 4) : aimDown ? Math.PI / 4 : -0.12;
      if (!aimUp && !aimDown && typeof towerAim === "function") { const a = towerAim(d.x + d.facing * 30, d.y - (d.h === LOW_H ? 40 : 78), sp, full >= 1, d.facing); if (a !== null) ang = a; }   // world6.js: a flat throw at an open tower window arcs up into it
      stones.push({ x: d.x + d.facing * (straightUp ? 6 : 30), y: d.y - (straightUp ? 100 : d.h === LOW_H ? 40 : 78), vx: Math.cos(ang) * sp * d.facing + d.vx * (straightUp ? 0 : 0.3),
                    vy: Math.sin(ang) * sp, charged: full >= 1, life: 2.5 });
      sfx("sling_throw", undefined, full >= 1 ? 0.95 : 0.8, 0.95 + Math.random() * 0.1);   // always the whip of the throw
    }
    if (hasSkill("quick") && !d.charging && pressed("b") && !d.carrying && !d.harp && d.throwT > 0.04) d.quickQueued = true;   // tapped again during the throw
    if (d.thrown && d.quickQueued && !d.quickUsed && d.throwT >= relAt + 0.07) {   // quick release (Gera, 4-2): the second stone, right behind the first
      d.quickUsed = true; const st = stones[stones.length - 1];
      if (st) { stones.push({ ...st, x: d.x + d.facing * 30, y: st.charged ? st.y : d.y - (d.h === LOW_H ? 40 : 78), vx: st.vx, vy: st.vy, charged: false, power: false, life: 2.5, trail: undefined, quick: true });
        sfx("sling_throw_quick", undefined, 0.9, 1.05); }
    }
    if (d.throwT >= dur) { d.throwT = -1; d.runThrow = false; d.quickUsed = false; d.quickQueued = false; }
  }

  // --- ladders: hold Up in front of one to climb it (Down from the top to climb down), A to jump off
  if (!busy && !d.harp && !d.carrying && d.throwT < 0) {
    const l = ladderAt(d), atTop = l && d.onGround && d.y <= l.r * T + 2;
    const lt = !l && d.onGround && pressed("down") &&   // on the roof right by the top of one: back over the edge and down it
      ladders.find(q => ladderRoof(q) && Math.abs(d.y - ladderTop(q).y) < 3 && Math.abs(d.x - ((q.c + 1) * T + ladderRoof(q) * T)) < 60);
    if (lt) { setState("topout"); Object.assign(d, { ladder: lt, topDir: ladderRoof(lt), topRev: true, vx: 0, vy: 0, onGround: false }); }
    else if (l && ((held("up") && !atTop && (d.onGround || d.vy > -200)) || (pressed("down") && atTop))) {
      setState("climb"); d.ladder = l; d.climbDist = 0; d.vx = 0; d.vy = 0; d.onGround = false; d.jumpBuf = 0;
      if (!d.ladderTold) { d.ladderTold = true; toast("Climbing! Hold Up or Down on the ladder. A jumps off."); }
    }
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
  } else if (d.state === "climb") {   // on a ladder: no gravity, Up/Down to climb, A to jump off
    const l = d.ladder, v = (held("down") ? 1 : 0) - (held("up") ? 1 : 0);
    d.vx = 0; d.vy = 0; d.onGround = false; d.x += ((l.c + 1) * T - d.x) * Math.min(1, dt * 14);
    d.y += v * TUNE.CLIMB_SPEED * dt; d.climbDist += Math.abs(v) * TUNE.CLIMB_SPEED * dt;
    if (v < 0 && ladderRoof(l) && d.y <= ladderTop(l).y + TOPOUT_POS()[0][1]) {   // hands at the roof edge: over the top
      setState("topout"); d.topDir = ladderRoof(l); d.topRev = false;
    }
    else if (d.y <= l.r * T) { d.y = l.r * T; d.onGround = true; d.ladder = null; setState("idle"); }   // up at the top: standing on the top rung
    else if (v > 0 && isSolid(Math.floor(d.x / T), Math.floor(d.y / T))) { d.y = Math.floor(d.y / T) * T; d.onGround = true; d.ladder = null; setState("idle"); }   // down at the bottom
    else if (pressed("a")) {   // jump off, the way he's pushing (or straight back down)
      if (dir) d.facing = dir;
      d.ladder = null; d.vy = -TUNE.JUMP_SPEED * 0.7; d.vx = dir * TUNE.WALK_SPEED; setState("jump"); sfx("jump", undefined, 0.5);
    }
  } else if (d.state === "topout") {   // over the top of a ladder onto the roof (or, topRev, back over the edge onto it)
    const l = d.ladder, P = TOPOUT_POS(), n = P.length, ft = d.topRev ? TOPDOWN_FRAME : TOPOUT_FRAME;
    const k = Math.min(n - 1, Math.floor(d.t / ft)), i = d.topRev ? n - 1 - k : k, edge = (l.c + 1) * T + d.topDir * T;
    d.topK = i; d.vx = 0; d.vy = 0; d.onGround = false;
    d.x = edge + d.topDir * P[i][0]; d.y = ladderTop(l).y + P[i][1];
    if (d.t >= n * ft) {
      if (d.topRev) { setState("climb"); d.climbDist = 0; d.x = (l.c + 1) * T; }
      else { d.onGround = true; d.ladder = null; d.facing = d.topDir; setState("idle"); }
    }
  } else if (d.state === "slip") {   // 3-4: slid on landing in the mud; arms out, then he stands
    d.vx = Math.sign(d.vx) * Math.max(0, Math.abs(d.vx) - TUNE.SLIP_MUD * dt);
    if (animDone("david_slip", d.t, TUNE.SLIP_MS) || (d.t > TUNE.SLIP_LOCK && dir !== 0)) setState("idle");
  } else if (d.state === "standup") {
    d.vx = 0;
    if (d.t > TUNE.HARP_STANDUP) setState("idle");
  } else if (d.shiverT > 0) {   // 4-4: a cold shadow touched him (world4.js)
    d.vx = 0;
  } else if (d.harp) {
    d.vx = 0;
  } else {
    const crouching = d.onGround && held("down") && !d.carrying;
    const stuckLow = d.onGround && !headroom(d, STAND_H);
    lowPose = crouching || stuckLow;
    // inside rock (no room even crouched: a respawn or a shove put him in it): after a moment, up onto the top of it
    d.inRockT = !headroom(d, LOW_H) ? (d.inRockT || 0) + dt : 0;
    if (d.inRockT > 0.5) { for (let k = 0; k < 8 && !headroom(d, STAND_H); k++) d.y = (Math.floor((d.y - 1) / T)) * T; d.vy = 0; d.inRockT = 0; }
    if (dir !== 0) { d.facing = dir; d.holdDirT += dt; } else d.holdDirT = 0;
    let target = dir * (d.holdDirT > TUNE.RUN_DELAY ? TUNE.RUN_SPEED : TUNE.WALK_SPEED);
    if (lowPose) target = dir * TUNE.CRAWL_SPEED;
    if (d.carrying) target *= 0.8;
    const mud = d.onGround && typeof onMud === "function" && onMud(d.x, d.y) ? TUNE.MUD_GRIP : 1;   // 3-4's mud slicks (world3.js)
    const acc = (d.onGround ? (dir !== 0 ? TUNE.ACCEL_GROUND : TUNE.FRICTION) : TUNE.ACCEL_AIR) * mud;
    if (d.vx < target) d.vx = Math.min(target, d.vx + acc * dt);
    else if (d.vx > target) d.vx = Math.max(target, d.vx - acc * dt);
  }
  d.h = lowPose ? LOW_H : STAND_H;
  if (d.state === "climb" || d.state === "topout") return;   // on a ladder: no gravity, no collisions (the ladder's in open air)

  // drop through a one-way platform: Down + A while standing on one
  d.dropThrough = false;
  if (d.onGround && held("down") && pressed("a")) {
    const r = Math.floor(d.y / T), c = Math.floor(d.x / T);
    if (isOneway(c, r) && Math.abs(d.vx) <= 60) { d.dropThrough = true; d.y += 2; }
  }
  if (d.onGround && pressed("down") && typeof onLadder === "function" && onLadder(d) && d.state !== "climb" && d.carrying) { d.dropThrough = true; d.y += 2; }   // carrying the lamb: Down steps down a rung (world3.js)

  // --- gravity + collisions
  d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt);
  const wasAir = !d.onGround, fallSpeed = d.vy;
  collideBody(d, BODY_W, d.h, dt);
  // remember the last solid ground he stood on (not a ledge that might crumble), for climbing back out of a pit
  if (d.onGround) {
    const r = Math.floor(d.y / T), cL = Math.floor((d.x - BODY_W) / T), cR = Math.floor((d.x + BODY_W) / T);
    if (isSolid(cL, r) && isSolid(cR, r) && !(typeof inTrap === "function" && inTrap(d.x, d.y))) d.safe = { x: d.x, y: d.y };   // (not down a lane between tall houses, world3.js)
  }

  // --- choose the animation
  if (d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "kneel" || d.state === "harp" || d.state === "standup" ||
      (d.state === "slip" && d.onGround)) {
    if (d.state === "kneel" && animDone("david_sit_harp", d.t, 95)) setState("harp");
    return;
  }
  if (!d.onGround) {
    if (d.carrying) setState("carry");
    else if (d.state !== "flip" || animDone("david_flip", d.t, 60)) setState("jump");
    return;
  }
  if (wasAir && d.onGround) {
    d.flipUsed = false;
    if (fallSpeed > 600 && !d.carrying && LEVEL_STAGE === "3-4") {   // the muddy slope: his feet go out from under him
      setState("slip"); d.vx = d.facing * Math.max(TUNE.SLIP_SLIDE, Math.abs(d.vx) * 0.8); d.jumpBuf = 0; return;
    }
    if (fallSpeed > 600 && !d.carrying) { setState("land"); return; }
  }
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
    const n0 = 2, n1 = 7, span = n1 - n0, HOLD = liftHold(d);
    if (t >= LIFT_DOWN && t < LIFT_DOWN + HOLD && d.helpSheep.how === "flies" && SPR.david_anoint_sheep) {   // kneeling, pouring oil on its head
      drawSprite("david_anoint_sheep", frameOf("david_anoint_sheep", t - LIFT_DOWN), x, y, d.facing); return;
    }
    const i = t < LIFT_DOWN ? n0 + Math.min(span, Math.floor(t / LIFT_DOWN * (span + 1)))
            : t < LIFT_DOWN + HOLD ? n1
            : Math.max(n0, n1 - Math.floor((t - LIFT_DOWN - HOLD) / LIFT_UP * (span + 1)));
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
    case "slip": drawSprite("david_slip", frameOf("david_slip", t, TUNE.SLIP_MS), x, y, d.facing); break;
    case "topout": drawSprite("david_topout", d.topK || 0, x, y, (d.topK || 0) < 2 ? 1 : d.topDir); break;   // back view, then from the side
    case "climb": drawSprite("david_climb", Math.floor((d.climbDist || 0) / TUNE.CLIMB_STRIDE) % SPR.david_climb.frames, x, y, 1); break;   // his back to us
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
  if (typeof lambDrop !== "undefined" && lambDrop.on) return;   // tumbling down after an eagle let go (world2.js)
  if (typeof lambDrift === "function" && lambDrift(dt)) return;   // wandering off to the oleander (world2.js)
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
    if (isSolid(Math.floor(s.x / T), Math.floor(s.y / T))) { s.life = 0; if (!(typeof stoneHitsDeadfall === "function" && stoneHitsDeadfall(s))) stoneHit(s); }
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
    if (s.life > 0 && typeof stoneHitsBear === "function" && stoneHitsBear(s)) s.life = 0;   // world2.js (2-4)
    if (s.life > 0 && typeof stoneHitsOx === "function" && stoneHitsOx(s)) s.life = 0;
    if (s.life > 0 && typeof stoneHitsWorld4 === "function" && stoneHitsWorld4(s)) s.life = 0;
    if (s.life > 0 && typeof stoneHitsWorld5 === "function" && stoneHitsWorld5(s)) s.life = 0;
    if (s.life > 0 && typeof stoneHitsWorld6 === "function" && stoneHitsWorld6(s)) s.life = 0;   // world6.js: the watchtower, the skirmishers   // world5.js: the leopard (5-2), the lookouts' torches (5-3)   // world4.js: 4-2's targets and jars       // world3.js (3-4)
    if (s.life > 0 && !s.power && stoneHitsTree(s)) { s.life = 0; stoneHit(s); }
    if (s.life > 0 && !finalBlow.on) watchForFinalStone(s);
    if (s.life > 0 && !finalBlow.on && typeof bear !== "undefined" && bear.on) watchBearFinal(s);
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
  const img = new Image(); img.onload = () => { loaded++; };
  // a stage's own ground set (STAGE_INFO.ter, e.g. "w2f" = World 2's forest) in its own folder; any piece it doesn't
  // have yet falls back to World 1's. (?ter=w2f in the address tries a set on any stage.)
  const dir = new URLSearchParams(location.search).get("ter") || STAGE_INFO.ter;
  img.onerror = () => { if (dir && !img._fallback) { img._fallback = true; img.src = `../assets/terrain/${n}.png?v=${window.BUILD || 0}`; } else loaded++; };
  img.src = `../assets/terrain/${dir ? dir + "/" : ""}${n}.png?v=${window.BUILD || 0}`; TER[n] = img;
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

// the empty margin at the top of each set's wall pictures (left, mid, right), as a share of the picture's height (measured)
const WALL_TOP = { w2s: [0.21, 0.15, 0.13], w2f: [0.15, 0.15, 0.14], w4p: [0.01, 0.05, 0.02] };
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
    const m = matAt(c, r); if (!m || m === 3 || m === 4 || m === 5 || m === 6 || m === 7 || m === 8 || m === 9) continue;
    const rockFill = c >= MAIN_COLS ? terPattern("cave_rock_tile", 0.45) || lim : lim;   // in a cave: damp cave rock
    ctx.fillStyle = (m === 2 ? rockFill : sed) || (m === 2 ? "#c9b48c" : "#8b6a3e");
    let fx = c * T, fw = T + 0.5;
    if (r >= GR && m === 1) {   // next to a pit: stop short so the soil doesn't show past the cliff face
      if (!isSolid(c + 1, GR)) fw -= TUNE.PIT_TRIM;
      if (!isSolid(c - 1, GR)) { fx += TUNE.PIT_TRIM; fw -= TUNE.PIT_TRIM; }
    }
    ctx.fillRect(fx, r * T, fw, T + 0.5);
  }
  // 3b) where limestone sits on earth, sink it into the soil (Glen's limestone base pieces). Not for 5-2's mountain set:
  //     its base pieces are whole cliff feet with rubble, too tall for this thin band, and the rock meets the gravel well.
  for (let r = 0; r < ROWS - 1 && STAGE_INFO.ter !== "w5m"; r++) {
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
    ctx.save(); ctx.filter = STAGE_INFO.ter ? "none" : TUNE.WALL_FILTER;   // World 1's stones are colour-matched to its limestone; other sets come as drawn
    ctx.beginPath(); ctx.rect(x0 - 200, -1000, x1 - x0 + 400, groundY + 1000); ctx.clip();
    const m = WALL_TOP[STAGE_INFO.ter];   // a stage's own set: lift each piece by the empty space at the top of its picture
    if (m) {
      const top = r * T + sink - 4, H2 = hh + 6;
      const lw = terPiece("wall_left", x0 - 4, top - m[0] * H2, H2);
      const rw = TER.wall_right.naturalWidth * H2 / (TER.wall_right.naturalHeight || 1);
      terStrip("wall_mid", x0 - 4 + lw * 0.7, x1 + 4 - rw * 0.7, top - m[1] * H2, H2);
      terPiece("wall_right", x1 + 4 - rw, top - m[2] * H2, H2);
    } else {
    const lw = terPiece("wall_left", x0 - 4, y, hh);
    const rw = TER.wall_right.naturalWidth * hh / (TER.wall_right.naturalHeight || 1);
    terStrip("wall_mid", x0 - 4 + lw * 0.7, x1 + 4 - rw * 0.7, y + hh * 0.13, hh * 0.87);
    terPiece("wall_right", x1 + 4 - rw, y, hh);
    }
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
function drawStoneItem(nm, x, y, px, s) {   // Glen's stone art (items/stone = David's, stone_enemy_* = the Philistines', stone_glow kept for Goliath's slow motion), tumbling as it flies
  const img = ITEM[nm];
  if (!img || !img.naturalWidth) { ctx.fillStyle = "#6d6a63"; ctx.beginPath(); ctx.arc(x, y, px * 0.4, 0, Math.PI * 2); ctx.fill(); return; }
  const h = px * img.naturalHeight / img.naturalWidth, a = s ? (s.spin = (s.spin || 0) + (s.vx || 0) * 0.0006) : 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.drawImage(img, -px / 2, -h / 2, px, h); ctx.restore();
}
function drawStones(camX) {
  for (const s of stones) if (s.power) {
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    s.trail.forEach(([tx, ty], k) => { ctx.fillStyle = `rgba(255,220,120,${(k + 1) / s.trail.length * 0.5})`; ctx.beginPath(); ctx.arc(tx - camX, ty, 4 + k, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = "rgba(255,240,180,0.9)"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    drawStoneItem("stone", s.x - camX, s.y, 17, s);
  }
  for (const s of stones) {
    if (s.power) continue;
    if (s.charged) {
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "rgba(255,200,80,0.45)"; ctx.beginPath(); ctx.arc(s.x - camX, s.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    drawStoneItem("stone", s.x - camX, s.y, 15, s);
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
  drawCodeEntry(); if (typeof drawHarpDuel === "function") drawHarpDuel();
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
  if (readPad()) {   // what the game hears right now (to check a D-pad's diagonals): the buttons held, and the raw axes
    const p = readPad(), on = BUTTONS.filter(b => held(b));
    lines.push("Pressing: " + (on.length ? on.join(" + ") : "nothing") + "     axes: " + [...p.axes].map(v => v.toFixed(2)).join("  "));
  }
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
  if (pr.staff) { david.maxHearts++; david.hearts++; }   // Hanan's staff (End of World 3): one more heart, for good
  if (pr.cloak) { david.maxHearts++; david.hearts++; }   // Tobi's scout cloak (End of World 5)
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
  if (typeof resetWorld2 === "function") resetWorld2(true);
  if (typeof resetOx === "function") resetOx();
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
  if (typeof resetWorld2 === "function") resetWorld2(false);
  if (typeof resetOx === "function") resetOx();
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
      if (SPR.whip_slither) {   // Glen's whip snake: coiled up, head raised when David is close, slithering off
        const near = Math.abs(david.x - s.x) < 300 && Math.abs(david.y - s.y) < 160;
        if (s.state === "hunt" && s.phase === "strike") drawSprite("whip_strike", Math.min(1, Math.floor(s.ht / (W3.SNAKE_STRIKE / 2))), x, s.y + 2, s.facing, 1, s.alpha);   // the lunge (world3.js)
        else if (s.state === "leave" || s.state === "hunt" || s.gone) drawSprite("whip_slither", frameOf("whip_slither", s.t), x, s.y + 2, s.facing, 1, s.alpha);
        else drawSprite("whip_coil", near ? 1 : 0, x, s.y + 2, s.facing, 1, s.alpha);
      } else drawSprite("snake_strike", s.state === "leave" ? [7, 6, 7, 0][Math.floor(s.t / 0.15) % 4] : 7, x, s.y, s.facing, 0.85, s.alpha, WHIP_FILTER);
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
    const passed = david.x > f.x + 70 && david.x < f.x + 8 * T && david.deadT <= 0 && !cave.room;   // jumped over it or ran past: it still counts
    if ((near || passed) && !f.lit) {
      f.lit = true; checkpoint = { x: f.x - 30, y: f.y };
      if (f.who) sayLine(f.who, f.say); else toast("Campfire: checkpoint. Play the harp here (Select) to rest.");
      if (typeof fireLit === "function") fireLit(f);   // world3.js: 3-2's scenes back in town
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
  sheep2:     { run: "sheep2_trot",    walk: "sheep2_walk",     stand: "sheep2_stand",     graze: "sheep2_graze" },   // Glen's curly, big-eyed sheep
  lamb:       { run: "lamb_hop",       walk: "lamb_walk",       stand: "lamb_stand",       graze: "lamb_graze" },
  lambblack:  { run: "lambblack_leap", walk: "lambblack_walk",  stand: "lambblack_stand",  graze: "lambblack_stand" },
  ram:        { run: "flockram_walk",  walk: "flockram_walk",   stand: "flockram_stand",   graze: "flockram_graze" },   // the flock's own woolly ram (the wild ram and the ibex use ram_*)
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
    freed: o.how !== "thorns" && o.how !== "cast" && o.how !== "flies", upright: false, oiled: false, stillT: 9, bleatT: Math.random() * 4, hinted: false, moved: 0 });
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
    if (sh.state === "helped" || sh.state === "stolen") continue;   // David is lifting it up (updateLiftSheep), or a thief has it (world3.js)
    if (!sh.freed) {
      if (sh.how === "cast" && Math.abs(dx) < 80 && Math.abs(dy) < 80) {
        if (!sh.hinted) { sh.hinted = true; toast("This sheep is cast, stuck on its back. Press Down to roll it back up."); }
        if (pressed("down") && d.onGround && !inCutscene()) {
          if (d.carrying || lamb.carried) { d.carrying = false; lamb.carried = false; lamb.x = d.x - d.facing * 50; lamb.y = d.y; }   // Down also means "pick up the lamb"
          sh.state = "helped"; sh.upright = false; d.helpSheep = sh; d.helpSide = Math.sign(sh.x - d.x) || d.facing;
          d.liftPhase = 0; d.harp = false; d.charging = false; d.throwT = -1; setState("liftSheep");
        }
      }
      if (sh.how === "flies" && typeof fliesSheep === "function") fliesSheep(sh, dx, dy);   // world3.js: oil its head
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
  // no closer for a while (boxed in, like The One under 3-4's fallen oak, whose root rock blocks the way left): head for the
  // campfire the other way instead; still stuck after that, it just turns up at its fire
  const gap = Math.abs(tx - sh.x);
  if (sh.bestD === undefined || gap < sh.bestD - 4) { sh.bestD = gap; sh.stuckT = 0; } else sh.stuckT += dt;
  if (sh.stuckT > 1.5) {
    const other = fires.filter(f => f !== sh.fire && Math.sign(f.x - sh.x) === -dir).sort((a, b) => Math.abs(a.x - sh.x) - Math.abs(b.x - sh.x))[0];
    if (other && !sh.turned) { sh.turned = true; sh.fire = other; sh.spot = restSpot(other, line.filter(o => o !== sh && o.fire === other).length); sh.bestD = undefined; sh.stuckT = 0; return; }
    sh.walkT = 99; return;   // (next frame: at its fire)
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
const GRAZE_EAT = { lamb_graze: 3, sheep_graze: 3, sheepblack_graze: 2, sheep2_graze: 5 };
Object.assign(TUNE.SPRITE_SIZE, { sheep2_walk: 1.2, sheep2_stand: 1.2, sheep2_graze: 0.92 });   // the curly sheep's sheets, matched to its trot
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
const oilingSheep = () => david.state === "liftSheep" && david.helpSheep && david.helpSheep.how === "flies";
function drawSheepOne(sh, camX, front) {
  if (!front && oilingSheep() && sh === david.helpSheep) return;   // drawn after David instead
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
  if (sh.how === "flies" && !sh.freed && !sh.oiled && typeof drawFlies === "function") drawFlies(x, y, sh.t);
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
  if (typeof drawProvisions === "function") drawProvisions();   // World 5: the loaves and cheeses (world5.js)
  if (typeof drawLostThings === "function" && drawLostThings()) return;   // World 4: the lost gifts (world4.js)
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
    if (typeof bearBlocking === "function" && bearBlocking()) {   // 2-4: the bear first (world2.js)
      d.x = px - 6 - BODY_W / 2; d.vx = Math.min(0, d.vx);
      if (finish.blocked <= 0) toast("The bear is between you and the pen!");
      finish.blocked = 3; return;
    }
    if (typeof oxBlocking === "function" && oxBlocking()) {   // 3-4: the ox first (world3.js)
      d.x = px - 6 - BODY_W / 2; d.vx = Math.min(0, d.vx);
      if (finish.blocked <= 0) toast("The ox is still loose! Drive it off before you bring the flock in.");
      finish.blocked = 3; return;
    }
    const gb = (typeof giftsBlocking === "function" ? giftsBlocking() : null) || (typeof questBlocking === "function" ? questBlocking() : null) || (typeof saulBlocking === "function" ? saulBlocking() : null) || (typeof tobiBlocking === "function" ? tobiBlocking() : null) || (typeof chariotBlocking === "function" ? chariotBlocking() : null) || (typeof towerBlocking === "function" ? towerBlocking() : null);   // 4-1 the king's gifts, 4-3 the harp's string (world4.js)
    if (gb) {
      d.x = px - 6 - BODY_W / 2; d.vx = Math.min(0, d.vx);
      if (finish.blocked <= 0) toast(gb);
      finish.blocked = 3; return;
    }
    if (typeof boyMissing === "function" && boyMissing()) {   // 2-2: not without the boy from Tekoa (world2.js)
      d.x = px - 6 - BODY_W / 2; d.vx = Math.min(0, d.vx);
      if (finish.blocked <= 0) toast("Not without the boy! He's still on the rock in the riverbed.");
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
    const LT = typeof lostThingsTally === "function" ? lostThingsTally() : null;   // World 4: gifts, goats... (world4.js)
    if (LT) { finish.found = LT.found; finish.total = LT.total; finish.things = LT.things; finish.icon = LT.icon; }
    if (finish.total && finish.found === finish.total) { d.lives++; sfx("extra_life"); toast(`All ${finish.total} lost ${finish.things || "sheep"} found: +1 life!`); }
    return;
  }
  finish.blocked = Math.max(0, finish.blocked - dt);
  finish.t += dt;
  const allIn = finish.flock.every(s => s.state === "in");
  if (finish.phase === "land" && d.onGround) { finish.phase = "open"; finish.t = 0; if (finish.flock.length > 1) sfx("flock_baa", undefined, 0.7); }
  if (finish.phase === "open") { finish.gateOpen = Math.min(1, finish.t / 0.7); if (allIn && finish.t > 1) { finish.phase = "close"; finish.t = 0; } }
  if (finish.phase === "close") { finish.gateOpen = Math.max(0, 1 - finish.t / 0.7); if (finish.t > 1.2) { finish.phase = "clear"; finish.t = 0; hushLoops(true); sfx(SFX.ending_jingle_levels && !SFX.ending_jingle_levels.missing ? "ending_jingle_levels" : "stage_clear", undefined, 0.9); } }   // the stage-clear jingle (Glen's ending_jingle_levels; the lyre stand-in if it's missing), the harp and hills quiet under it
  if (finish.phase === "clear" && finish.t > 1 && (pressed("a") || pressed("b") || pressed("start"))) {
    // David writes in his Journal, then the stage starts again (until the map exists)
    saveStones(LEVEL_STAGE, specials.filter(o => o.taken).length);
    stageCleared(LEVEL_STAGE, { sheep: finish.found, total: finish.total, one: finish.one, stones: specials.filter(o => o.taken).length, olives: david.olives, lampOil: david.lampOil, gathered: david.gathered });
    const journal = () => Journal.open({ world: WORLD, stage: STAGE_NUM, onClose: () => backToMap() });   // (no pages for a world yet: straight back to the map)
    if (LEVEL_STAGE === "2-4" && typeof ending !== "undefined") ending.start(journal);   // the end of World 2 first (world2.js)
    else if (LEVEL_STAGE === "3-4" && typeof w3ending !== "undefined") w3ending.start(journal);   // the end of World 3 (world3.js)
    else if (LEVEL_STAGE === "4-4" && typeof w4ending !== "undefined") w4ending.start(journal);
    else if (LEVEL_STAGE === "5-4" && typeof w5ending !== "undefined") w5ending.start(journal);
    else if (LEVEL_STAGE === "6-4" && typeof w6ending !== "undefined") w6ending.start(journal);   // the end of World 6: Saul's tent (world6.js)   // the end of World 5 (world5.js)   // the end of World 4 (world4.js)
    else journal();
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
// oiling a sheep plagued by flies (world3.js): he kneels a little closer and pours from his flask (Glen's clip) for longer
const ANOINT_REACH = 30, ANOINT_HOLD = 2.0, ANOINT_OIL_AT = 0.8;   // sheet px; seconds pouring; when the oil goes on
const liftHold = d => d.helpSheep && d.helpSheep.how === "flies" ? ANOINT_HOLD : LIFT_HOLD;
function updateLiftSheep(d, dt) {
  const sh = d.helpSheep, tx = sh.x - d.helpSide * (sh.how === "flies" ? ANOINT_REACH : CAST_REACH) * SCALE, HOLD = liftHold(d);
  if (!d.liftPhase) {                                // walk into place
    if (autoWalk(d, tx, dt) || d.t > 3) { d.x = tx; d.facing = d.helpSide; d.vx = 0; d.liftPhase = 1; d.t = 0; }
    return;
  }
  d.vx = 0; d.vy = Math.min(TUNE.MAX_FALL, d.vy + TUNE.GRAVITY * dt); collideBody(d, BODY_W, d.h, dt);
  if (!sh.upright && d.t > LIFT_DOWN + 0.05) {       // the flip happens out of sight, behind his arms
    sh.upright = true; sh.facing = d.helpSide; sh.stillT = 0;
    for (let k = 0; k < 10; k++) bits.push({ x: sh.x, y: sh.y - 6, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 220, life: 0.5, color: "#d8c9a4" });
  }
  if (sh.how === "flies" && !sh.oiled && d.t > LIFT_DOWN + ANOINT_OIL_AT) oilSheep(sh);   // world3.js
  if (d.t > LIFT_DOWN + HOLD + LIFT_UP) { d.liftPhase = 0; sh.freed = true; joinLine(sh); setState("idle"); }
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
const GATE_TOP = 34;   // (Glen) the posts stand this much taller than the olive's highest point, so it never rides above them
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
  gatePost(fx, fby, 13, ph * GATE_FAR.scale + GATE_TOP + 16, true);
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
  gatePost(nx, nby, 22, ph + 8 + GATE_TOP, false);
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
  const olive = !finish.caught ? "Golden olive: missed" : finish.life ? `Golden olive caught at the top: +${finish.bonus} olives. Third top catch: +1 life!` : finish.gold ? `Golden olive caught at the top: +${finish.bonus} olives (${gateTops} of ${TUNE.GATE_TOPS_FOR_LIFE} for a life)` : `Golden olive: +${finish.bonus} olives`;
  const next = `Next time: catch it at the very top for 25 (every ${TUNE.GATE_TOPS_FOR_LIFE} top catches = +1 life)`;
  ctx.font = "24px sans-serif"; let bw = ctx.measureText(olive).width;
  ctx.font = "18px sans-serif"; if (!finish.gold) bw = Math.max(bw, ctx.measureText(next).width);
  bw = Math.min(W - 40, Math.max(660, bw + 70));   // wide enough for the longest line
  ctx.fillStyle = "rgba(20,12,4,0.72)"; ctx.beginPath(); ctx.roundRect(W / 2 - bw / 2, 150, bw, 250, 18); ctx.fill();
  ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 44px sans-serif";
  ctx.fillText("Stage " + LEVEL_STAGE + " clear!", W / 2, 215);
  ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif";
  const lostLine = `Lost ${finish.things || "sheep"} found: ${finish.found} of ${finish.total}${finish.found === finish.total && finish.total ? "  (+1 life!)" : ""}`;
  ctx.fillText(lostLine, W / 2 + 20, 262);
  const ix = W / 2 + 20 - ctx.measureText(lostLine).width / 2 - 34, ic = finish.icon;   // the icon just left of the line, however long it is
  if (ic === "goat") drawSprite("goat_stand", 0, ix, 272, 1, 0.45);
  else if (ic === "hen") drawSprite("chicken_peck", 0, ix, 272, 1, 1.2);
  else if (ic === "gear") drawItem("tobi_sandal", ix, 274, 0.26);
  else if (ic === "cairn") drawItem("cairn_up", ix, 278, 0.17);
  else if (ic === "donkey") drawSprite("donkey_idle", 0, ix, 276, 1, 0.45);
  else if (ic === "soldier") drawSprite("soldier_run", 0, ix, 280, 1, 0.22);
  else if (ic === "lamp") drawItem("hall_lamp_lit", ix, 274, 0.17);
  else if (finish.things) drawItem("gift_honey", ix, 270, 0.26); else hudIcon("sheep", ix, 234, 38);
  ctx.fillText(finish.one ? "The One: found!" : "The One: still out there...", W / 2, 296);
  ctx.fillText(olive, W / 2, 330);
  if (!finish.gold) { ctx.fillStyle = "#ffd84a"; ctx.font = "18px sans-serif"; ctx.fillText(next, W / 2, 352); }
  ctx.fillStyle = "#ccc"; ctx.font = "18px sans-serif";
  if (finish.t > 1) ctx.fillText(typeof JOURNAL_PAGES !== "undefined" && JOURNAL_PAGES[WORLD] ? "Press A to write in the Journal" : "Press A to continue", W / 2, 385);   // (World 2's Journal pages aren't written yet)
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
      if (dist < TUNE.HORNET_RANGE && h.t > 1.2) { h.state = "dive"; h.t = 0; h.vx = dx / dist * TUNE.HORNET_DIVE; h.vy = dy / dist * TUNE.HORNET_DIVE; if (h.kind === "raven") sfxOne(["crow_1", "crow_2"], h.x, 0.6); }
    } else if (h.state === "dive") {
      h.x += h.vx * dt; h.y += h.vy * dt; h.facing = h.vx > 0 ? 1 : -1;
      if (h.t > 0.9) { h.state = "back"; h.t = 0; }
    } else {   // back to its spot
      h.x += (h.hx - h.x) * Math.min(1, dt * 1.8); h.y += (h.hy - h.y) * Math.min(1, dt * 1.8);
      if (h.t > 1.2) { h.state = "hover"; h.t = 0; }
    }
    if (Math.abs(dx) > 12) h.facing = dx > 0 ? 1 : -1;   // always watching David, even flying back to its spot or past him (Glen: no tail-first swoops)
    const reach = h.kind === "raven" ? 52 : 26;
    if (Math.abs(h.x - david.x) < reach && h.y > david.y - david.h - 10 && h.y < david.y) hurtDavid(h.x);
  }
}
function stoneHitsBugs(s) {
  if (typeof stoneHitsEagles === "function" && stoneHitsEagles(s)) return true;   // world2.js (2-3)
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
const SFX_FILES = ["ending_jingle_levels", "stage_clear", "sheep_baa_1", "sheep_baa_2", "sheep_baa_3", "sheep_baa_4", "sheep_baa_5", "sheep_baa_6", "sheep_baa_7",
  "flock_baa", "sling_throw", "sling_throw_quick", "sling_charge", "sling_power", "extra_life", "heal", "boss_intro",
  "jump", "olive_pickup", "fall_pit", "stone_hit", "final_stone", "final_stone_goliath", "lion_roar", "lion_hit", "lion_defeated",
  "thunder", "thunder_2", "thunder_3",   // 3-4's storm (Glen's lightning sounds)
  "eagle_1", "eagle_2", "crow_1", "crow_2", "jackal", "wolf_growl", "wolf_bark", "wolf_howl", "fox_1", "fox_2", "fox_3", "paper_rip",
  "hyena_1", "hyena_2", "hyena_3",   // Glen's animal sounds (2026-10-15); the hyenas laugh in 5-2
  "horses",   // the chariot horses whinnying (5-4)
  "phil_shout", "phil_shout_2", "phil_shout_3", "phil_hedad", "phil_hedad_2", "phil_nusu", "phil_nusu_1", "phil_roar",
  "goliath_tenu_li_ish", "goliath_tenu_li_ish_2", "goliath_cheirafti", "goliath_cheirafti_2", "goliath_halo_anochi", "goliath_halo_anochi_2",   // Goliath's Hebrew (Glen, pitched down)   // Glen's voice as the Philistines (tools/crowd.py)
  "arrow_single", "arrow_with_stick-to-target", "arrow_volley_1", "arrow_volley_2", "taunting_yells", "war_horn"];   // Glen's World 6 sounds (2026-10-19)
// (plain <audio> elements, not fetch + Web Audio: fetch is blocked when the game is opened straight from a file)
const SFX = {};
for (const n of SFX_FILES) { const a = new Audio(`../assets/sounds/${n}.mp3?v=${window.BUILD || 0}`); a.preload = "auto"; a.onerror = () => { a.missing = true; }; SFX[n] = a; }
function loadSfx() {}
// play a sound; x (optional) is where it happens in the level, so off-screen things are quieter
function sfx(name, x, vol = 1, rate = 1) {
  if (!audioUnlocked) return null;
  const base = SFX[name]; if (!base || base.missing) return null;
  let v = vol * TUNE.SFX_VOLUME;
  if (x !== undefined) { const off = Math.abs(x - (camX + W / 2)); v *= Math.max(0, Math.min(1, 1.25 - off / (W * 0.9))); }
  if (v <= 0.01) return null;
  // reuse a few players per sound: Chrome stops making new ones past ~75 (the 6-4 volleys ran it out, and the sling went quiet)
  const pool = base._pool || (base._pool = []);
  let a = pool.find(p => p.paused || p.ended);
  if (!a && pool.length < SFX_POOL) {
    a = base.cloneNode(); a._pool = pool; pool.push(a); sfxAll.push(a);
    while (sfxAll.length > SFX_MAX) {   // too many players in all: let go of the longest-idle one
      const k = sfxAll.findIndex(p => p !== a && (p.paused || p.ended)); if (k < 0) break;
      const old = sfxAll.splice(k, 1)[0]; old._pool.splice(old._pool.indexOf(old), 1); old.removeAttribute("src"); old.load();
    }
  }
  if (!a) { a = pool.shift(); pool.push(a); a.pause(); }   // all busy: cut off the oldest
  else { sfxAll.splice(sfxAll.indexOf(a), 1); sfxAll.push(a); }   // most recently used goes to the back
  a.loop = false; a.currentTime = 0; a.volume = Math.min(1, v); a.playbackRate = rate; a.preservesPitch = false;
  a.play().catch(() => {});
  return a;
}
const SFX_POOL = 4, SFX_MAX = 150, sfxAll = [];   // players per sound, and in all (the loops and music are separate, about 10)
const sfxOne = (names, x, vol = 1) => sfx(names[Math.floor(Math.random() * names.length)], x, vol, 0.94 + Math.random() * 0.12);   // one of a few, at random
const baa = (x, vol = 0.8) => sfx("sheep_baa_" + (1 + Math.floor(Math.random() * 7)), x, vol, 0.92 + Math.random() * 0.16);
// looping beds
function loopAudio(name, music = true) { const a = new Audio(`../assets/sounds/${name}.mp3?v=${window.BUILD || 0}`); a.loop = true; a._music = music; a.volume = 0; return a; }
const ambience = loopAudio("ambience_hills"), bossMusic = loopAudio("boss_loop");
const stepsRun = loopAudio("steps_run", false);
const rainLoop = loopAudio("rain", false);   // the storm stages (STAGE_INFO.storm: 3-4)
// the darker themes (Glen, 2026-10-20): one for night stages (STAGE_INFO.night, or dark: 2-4 at dusk, 4-4's night palace),
// one for inside caves. Not one song a stage: day stages keep the hills' birds.
const nightMusic = loopAudio("music_night"), caveMusic = loopAudio("music_cave");
const DARK_STAGES = ["2-4", "4-4"];
// the day themes: the fun early worlds get Glen's bouncy ones (1: 8-bit Harp Jump, 2: Harps' Bounce), then
// Cascading Harp (3, 5, 7) and Harp's Dance (4, 8); World 6, the army camp, has Rhythmic Harp (Glen took the words out)
const dayMusic = loopAudio({ 1: "music_day_w1", 2: "music_day_w2", 6: "music_day_w6" }[WORLD] || (WORLD % 2 ? "music_day_a" : "music_day_b"));
let dayVol = 0;
let nightVol = 0, caveVol = 0;
let ambVol = 0, bossVol = 0, bossIntroPlayed = false, runVol = 0, rainVol = 0;
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
  const fight = (lion && (lion.awake || inArena) && lion.state !== "defeated" && david.deadT <= 0) || (typeof bearFight === "function" && bearFight()) || (typeof oxFight === "function" && oxFight()) || (typeof chariotFight === "function" && chariotFight()) || (typeof towerFight === "function" && towerFight());
  if (fight && !bossIntroPlayed) { bossIntroPlayed = true; sfx("boss_intro", undefined, 0.8); bossMusic.currentTime = 0; }   // uh oh
  if (lion && !lion.awake && !inArena) bossIntroPlayed = false;
  if (!fight && typeof bear !== "undefined" && bear.on && bear.state === "pen") bossIntroPlayed = false;
  bossVol = fadeLoop(bossMusic, bossVol, fight ? TUNE.BOSS_MUSIC_VOLUME : 0, dt, fight ? 0.5 : 0.4);
  const calm = !fight && !(david.state === "harp") && !finish.active;
  ambVol = fadeLoop(ambience, ambVol, STAGE_INFO.night || DARK_STAGES.includes(LEVEL_STAGE) || cave.room ? 0 : calm ? TUNE.AMBIENCE_VOLUME : (finish.active ? TUNE.AMBIENCE_VOLUME * 0.5 : 0), dt, 0.3);
  const darkOn = !fight && !(david.state === "harp") && !(typeof passScene !== "undefined" && passScene.active) ? TUNE.DARK_MUSIC_VOLUME * (finish.active ? 0.5 : 1) : 0;
  dayVol = fadeLoop(dayMusic, dayVol, !cave.room && !STAGE_INFO.night && !DARK_STAGES.includes(LEVEL_STAGE) ? darkOn / TUNE.DARK_MUSIC_VOLUME * TUNE.DAY_MUSIC_VOLUME : 0, dt, 0.4);
  caveVol = fadeLoop(caveMusic, caveVol, cave.room ? darkOn : 0, dt, 0.4);
  nightVol = fadeLoop(nightMusic, nightVol, !cave.room && (STAGE_INFO.night || DARK_STAGES.includes(LEVEL_STAGE)) ? darkOn : 0, dt, 0.4);
  rainVol = fadeLoop(rainLoop, rainVol, STAGE_INFO.storm && !cave.room ? TUNE.RAIN_VOLUME : 0, dt, 0.4);
  const d = david;
  // footsteps: a running patter while he's running on the ground (walking is quiet)
  const scene = (typeof passScene !== "undefined" && passScene.active) || oneMoment.active || finish.active;   // a scene over the stage: no footsteps
  const spd = d.onGround && d.deadT <= 0 && !d.harp && !scene ? Math.abs(d.vx) : 0;
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
function hushLoops(keepRain = false) {
  for (const a of [stepsRun, ambience, bossMusic, harpMusic, nightMusic, caveMusic, dayMusic]) if (!a.paused) a.pause();
  if (typeof battleLoop !== "undefined" && !battleLoop.paused) { battleLoop.pause(); W6.battleVol = 0; }   // World 6's distant sword fight (world6.js)
  if (!keepRain && !rainLoop.paused) { rainLoop.pause(); rainVol = 0; }
  if (typeof duelAudio !== "undefined" && duelAudio && !duelAudio.paused) duelAudio.pause();   // the harp duel (world2.js)
  if (typeof hushFlood === "function") hushFlood();
  if (david.chargeSnd) { david.chargeSnd.pause(); david.chargeSnd = null; }
}
function updateHarpMusic(dt) {
  const sitting = david.harp && (david.state === "kneel" || david.state === "harp");
  harpHeldT = sitting ? harpHeldT + dt : 0;
  const duel = typeof harpDuel !== "undefined" && harpDuel.active;   // the harp duel plays its own song (world2.js)
  const want = sitting && !duel && harpHeldT >= TUNE.HARP_MUSIC_DELAY;   // wait for his hands, not the harp coming out
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
  if (typeof updateWorld2 === "function") updateWorld2(dt);   // the flood, the boy from Tekoa (world2.js)
  if (typeof updateWorld3 === "function") updateWorld3(dt);
  if (typeof updateWorld4 === "function") updateWorld4(dt);
  if (typeof updateWorld6 === "function") updateWorld6(dt);   // world6.js: the frightened soldiers, the tents, Eliab
  if (typeof updateWorld5 === "function") updateWorld5(dt);   // world5.js: the provisions, raiders, the fleeing father   // world4.js: gifts on the road, the vineyard keeper   // the crows in the barley, the rats in the granary (world3.js)
}

// background layers: Glen's art, three per world. far = sky + distant hills (slowest), mid = rolling hills, near = grass strip
const BG = {};
// a set can borrow layers it doesn't have yet from another set (1-4 night: its own sky, World 1's hills until Glen's arrive)
const BG_BORROW = {};   // e.g. { w1_2: { near: "w1" } } while a set is still missing a layer
for (const w of ["w1", "w2", "w1_2", "w1_3", "w1_4", "w2_1", "w2_2", "w2_3", "w2_4", "w3_1", "w3_2", "w3_3", "w3_4", "w3_end", "w4_1", "w4_2", "w4_3", "w4_4", "w5_1", "w5_2", "w5_3", "w5_4", "w6_1", "w6_2", "w6_3", "w6_4"]) {
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
    if (d.flip) { ctx.save(); ctx.translate(x, 0); ctx.scale(-1, 1); drawItem(d.name, 0, y, d.size * 0.85); ctx.restore(); continue; }   // mirrored (seamless walls)
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
    if (typeof battleLoop !== "undefined" && !battleLoop.paused) { battleLoop.pause(); W6.battleVol = 0; }   // no sword fight under the Journal's harp (world6.js)
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
  if (typeof afterAnoint !== "undefined" && afterAnoint.active) {   // back at the Anointing stop afterward (world3.js)
    pollInput(); afterAnoint.update(real); afterAnoint.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof anointing !== "undefined" && anointing.active) {   // the Anointing scene (world3.js) has the screen
    pollInput(); anointing.update(real); anointing.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w6intro !== "undefined" && w6intro.active) {   // the opening of World 6, the camp of fear (world6.js)
    pollInput(); w6intro.update(real); w6intro.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof goliathWatch !== "undefined" && goliathWatch.active) {   // 6-2: the giant, seen in full (world6.js)
    pollInput(); goliathWatch.update(real); goliathWatch.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof eliabScene !== "undefined" && eliabScene.active) {   // 6-1: Eliab hears David (world6.js)
    pollInput(); eliabScene.update(real); eliabScene.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w6ending !== "undefined" && w6ending.active) {   // the end of World 6 (world6.js) has the screen
    pollInput(); w6ending.update(real); w6ending.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w5ending !== "undefined" && w5ending.active) {   // the end of World 5 (world5.js) has the screen
    pollInput(); w5ending.update(real); w5ending.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w5intro !== "undefined" && w5intro.active) {   // the opening of World 5, at Jesse's house (world5.js)
    pollInput(); w5intro.update(real); w5intro.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w4intro !== "undefined" && w4intro.active) {   // the opening of World 4, at Jesse's door (world4.js)
    pollInput(); w4intro.update(real); w4intro.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w4ending !== "undefined" && w4ending.active) {   // the end of World 4 (world4.js) has the screen
    pollInput(); w4ending.update(real); w4ending.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof w3ending !== "undefined" && w3ending.active) {   // the end of World 3 (world3.js) has the screen
    pollInput(); w3ending.update(real); w3ending.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (typeof ending !== "undefined" && ending.active) {   // the end-of-world scene (world2.js) has the screen
    pollInput(); ending.update(real); ending.draw(); drawToastAndSetup(); requestAnimationFrame(frame); return;
  }
  if (setup.active) updateSetup(dt); else checkCombo(dt);
  pollInput();
  // Start in a stage: pause (resume, settings, back to the map)
  if (pressed("start") && !setup.active && !oneMoment.active && !(typeof passScene !== "undefined" && passScene.active) && !finish.active && !codeEntry.active && david.deadT <= 0) { hushLoops(); Menu.open("pause", true); requestAnimationFrame(frame); return; }
  if (oneMoment.active) { hushLoops(); updateOneMoment(real); }
  else if (typeof passScene !== "undefined" && passScene.active) { if (!stepsRun.paused) { stepsRun.pause(); runVol = 0; } updatePassScene(real); }   // world3.js: back in town, before Samuel (no footsteps under it)
  else if (dialogHeld()) { hushLoops(true); if (pressed("a") || pressed("b")) { dialog.hold = false; dialog.t = Math.min(dialog.t, 0.25); } }   // someone's talking: the stage waits until A (or B), so every line can be read
  else if (!setup.active) { if (david.deadT <= 0) updateDavid(dt); updateLamb(dt); updateStones(dt); updateWorld(dt); }
  const [camLo, camHi] = camLimits();   // the stage, or the cave David is in (world1.js)
  const targetCam = Math.max(camLo, Math.min(camHi, david.x - W * 0.4 + david.facing * 80));
  camX += (targetCam - camX) * Math.min(1, real * 6);
  const shake = finalBlow.shake * finalBlow.shake * 14 + (typeof w2Shake !== "undefined" ? w2Shake.v * w2Shake.v * 12 : 0);   // + the bear's slam (world2.js)
  ctx.save(); if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);

  if (cave.room) drawCaveBackdrop(camX); else drawBackground(camX);
  drawLionRidge(camX);
  drawDecor(camX, "back");
  drawCaveDark(camX);
  drawCaveDoors(camX);
  drawTiles(camX);
  drawCaveFeatures(camX);
  drawPlatforms(camX); if (typeof drawWorld3 === "function") drawWorld3(camX);
  if (typeof drawWorld4 === "function") drawWorld4(camX);
  if (typeof drawWorld6 === "function") drawWorld6(camX);   // world6.js
  if (typeof drawWorld5 === "function") drawWorld5(camX);   // world3.js: houses, ladders, barley, granary
  drawFold(camX);
  drawFires(camX); if (typeof drawCampfirePeople === "function") drawCampfirePeople(camX);   // world2.js
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
  drawLamb(camX); if (typeof drawBoy === "function") { drawClaws(camX); drawBoy(camX); drawIbexes(camX); drawBear(camX); }   // world2.js
  if (inCutscene() || !(david.inv > 0 && Math.floor(now / 70) % 2)) drawDavid(camX);
  if (oilingSheep()) drawSheepOne(david.helpSheep, camX, true);   // the sheep he's oiling stands in front of him, kneeling
  drawFoldFront(camX);
  if (typeof drawStreamFront === "function") drawStreamFront(camX);   // world6.js
  drawStones(camX); if (typeof drawFlood === "function") { drawPools(camX); drawFalls(camX); drawFlood(camX); drawEagles(camX); drawWind(); }   // world2.js
  drawDecor(camX, "front");
  drawFakeRock(camX);
  drawCodeWalls(camX); if (typeof drawDeadfalls === "function") drawDeadfalls(camX);
  ctx.restore();
  drawNight(camX);
  if (typeof drawLeopardEyes === "function") { drawLeopardEyes(camX); drawLookoutLight(camX); }   // world5.js: eyes in the branches (5-2), torchlight and signal fires (5-3)
  if (typeof drawStorm === "function") drawStorm(camX);   // 3-4: rain, the dark, lightning (world3.js)
  drawCaveDarkness(camX);
  drawFinalBlow();
  if (david.deadT > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(0.8, 1.2 - david.deadT)})`; ctx.fillRect(0, 0, W, H); }
  if (debug) {
    ctx.strokeStyle = "red"; ctx.strokeRect(david.x - camX - BODY_W / 2, david.y - david.h, BODY_W, david.h);
    ctx.fillStyle = "#fff"; ctx.fillText(`${david.state} vx ${david.vx | 0} vy ${david.vy | 0}`, 20, H - 20);
  }
  drawHUD();
  drawFinishBanner();
  drawOneMoment(); if (typeof drawPassScene === "function") drawPassScene();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
