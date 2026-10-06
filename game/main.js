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
  STONE_SPEED: 780,       // tap throw
  STONE_SPEED_CHARGED: 1250,
  CHARGE_TIME: 0.6,       // seconds holding B for a full charge
  STONE_GRAVITY: 1300,
  THROW_TIME: 0.45,       // seconds for the whole throw animation
  LAMB_SPEED: 380,
  LAMB_CATCHUP: 1.2,      // seconds the lamb can be stuck or left behind before it pops back next to David
  CARRY_JUMP2: 0.95,      // second jump while carrying the lamb (1 = as strong as the flip)
  TILE: 36,
  // Per-sprite size nudges (1 = normal). Some clips came out a little bigger or smaller than the others.
  SPRITE_SIZE: {
    david_sling_throw: 1.12,
    david_crawl: 0.92,
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
  img.src = d.src;
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
// Level: a rough 1-1 block-out, built from simple commands (columns/rows are tiles).
// Screen is 20 tiles tall; the ground surface is row 17.
// ============================================================================
const T = TUNE.TILE;
const ROWS = 20, COLS = 150, GR = 17;
const solid = [...Array(ROWS)].map(() => Array(COLS).fill(false));
const oneway = [...Array(ROWS)].map(() => Array(COLS).fill(false));
const gourds = [], labels = [];
const ground = (c0, c1) => { for (let c = c0; c <= c1; c++) for (let r = GR; r < ROWS; r++) solid[r][c] = true; };
const block = (c, r, w, h) => { for (let x = c; x < c + w; x++) for (let y = r; y < r + h; y++) solid[y][x] = true; };
const plat = (c, r, w) => { for (let x = c; x < c + w; x++) oneway[r][x] = true; };
const gourd = (c, r) => gourds.push({ x: c * T + T / 2, y: (r + 1) * T, alive: true });   // sits on top of row r+1
const label = (c, r, text) => labels.push({ x: c * T, y: r * T, text });

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

const spawn = { x: 3 * T, y: GR * T }, lambSpawn = { x: 5 * T, y: GR * T };
const isSolid = (c, r) => r >= 0 && r < ROWS && c >= 0 && c < COLS && solid[r][c];
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
function drawSprite(name, i, x, y, facing, extraScale = 1, alpha = 1) {
  const s = SPR[name]; if (!s || !s.img.complete || !s.img.naturalWidth) return;
  const sc = SCALE * extraScale * (TUNE.SPRITE_SIZE[name] || 1);
  ctx.save();
  ctx.globalAlpha = alpha;
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
  const busy = d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown";

  // --- harp (Select): kneel and play while standing still
  if (pressed("select") && d.onGround && !d.carrying && !busy && Math.abs(d.vx) < 30) {
    if (d.harp) { d.harp = false; setState("idle"); } else { d.harp = true; setState("kneel"); }
  }
  if (d.harp && (dir !== 0 || pressed("a") || pressed("b"))) { d.harp = false; setState("idle"); }

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
  if (!d.carrying && !d.harp && !busy) {
    if (pressed("b") && d.throwT < 0) { d.charging = true; d.charge = 0; d.throwT = 0; d.thrown = false; }
    if (d.charging) { d.charge += dt; if (released("b") || !held("b")) d.charging = false; }
  }
  if (d.throwT >= 0) {
    if (!d.charging) d.throwT += dt;
    const relAt = TUNE.THROW_TIME * 7 / 12;
    if (!d.thrown && d.throwT >= relAt) {
      d.thrown = true;
      const full = Math.min(1, d.charge / TUNE.CHARGE_TIME);
      const sp = full >= 1 ? TUNE.STONE_SPEED_CHARGED : TUNE.STONE_SPEED;
      const aimUp = held("up");
      const ang = aimUp ? (held("left") || held("right") ? -Math.PI / 4 : -Math.PI / 2 + 0.12) : -0.12;
      stones.push({ x: d.x + d.facing * 30, y: d.y - 78, vx: Math.cos(ang) * sp * d.facing + d.vx * 0.3,
                    vy: Math.sin(ang) * sp, charged: full >= 1, life: 2.5 });
    }
    if (d.throwT >= TUNE.THROW_TIME) d.throwT = -1;
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
  if (d.state === "roll" || d.state === "getup" || d.state === "pickup" || d.state === "putdown" || d.state === "kneel" || d.state === "harp") {
    if (d.state === "kneel" && animDone("david_kneel_harp", d.t, 70)) setState("harp");
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

function drawDavid(camX) {
  const d = david, x = d.x - camX, y = d.y;
  // the sling throw is drawn on top of whatever the legs are doing when standing; in the air we use the throw frames too
  if (d.throwT >= 0 && d.state !== "roll" && d.state !== "flip") {
    let i;
    if (d.charging) i = Math.floor(d.charge * 1000 / 70) % 6;
    else i = Math.min(11, Math.floor(d.throwT / TUNE.THROW_TIME * 12));
    drawSprite("david_sling_throw", i, x, y, d.facing);
    if (d.charging && d.charge >= TUNE.CHARGE_TIME) { // golden glow when fully charged
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      // centred on the sling stone, which whirls just above and behind his head
      const gx = x - d.facing * 8, gy = y - 104 * (TUNE.SPRITE_SIZE.david_sling_throw || 1);
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
    case "kneel": drawSprite("david_kneel_harp", frameOf("david_kneel_harp", t, 70), x, y, d.facing); break;
    case "harp": drawSprite("david_play_harp", frameOf("david_play_harp", t), x, y, d.facing); break;
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
    s.life -= dt; s.vy += TUNE.STONE_GRAVITY * dt * (s.charged ? 0.45 : 1);
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (isSolid(Math.floor(s.x / T), Math.floor(s.y / T))) s.life = 0;
    for (const g of gourds) if (g.alive && Math.hypot(s.x - g.x, s.y - (g.y - 24)) < 28) {
      g.alive = false; s.life = 0;
      for (let k = 0; k < 10; k++) bits.push({ x: g.x, y: g.y - 24, vx: (Math.random() - 0.5) * 500, vy: -Math.random() * 500, life: 0.8 });
    }
  }
  for (let i = stones.length - 1; i >= 0; i--) if (stones[i].life <= 0) stones.splice(i, 1);
  for (const b of bits) { b.life -= dt; b.vy += 1400 * dt; b.x += b.vx * dt; b.y += b.vy * dt; }
  for (let i = bits.length - 1; i >= 0; i--) if (bits[i].life <= 0) bits.splice(i, 1);
}

// ============================================================================
// Drawing the world
// ============================================================================
function drawBackground(camX) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#7fb6e8"); g.addColorStop(0.6, "#cfe6f2"); g.addColorStop(1, "#f3e3c0");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // far hills
  ctx.fillStyle = "#c9b98a";
  for (let i = -1; i < 6; i++) {
    const x = i * 420 - (camX * 0.2) % 420;
    ctx.beginPath(); ctx.ellipse(x + 210, 560, 300, 170, 0, Math.PI, 0); ctx.fill();
  }
  // Bethlehem on its hill (far)
  const bx = 900 - camX * 0.15;
  ctx.fillStyle = "#b9a678"; ctx.beginPath(); ctx.ellipse(bx, 520, 260, 130, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = "#e6d6b0";
  for (let k = 0; k < 7; k++) ctx.fillRect(bx - 110 + k * 32, 410 - (k % 3) * 10, 26, 22);
  // near hills
  ctx.fillStyle = "#9fb86a";
  for (let i = -1; i < 6; i++) {
    const x = i * 360 - (camX * 0.45) % 360;
    ctx.beginPath(); ctx.ellipse(x + 180, 640, 240, 120, 0, Math.PI, 0); ctx.fill();
  }
}
function drawTiles(camX) {
  const c0 = Math.floor(camX / T), c1 = Math.ceil((camX + W) / T);
  for (let r = 0; r < ROWS; r++) for (let c = c0; c <= c1; c++) {
    const x = c * T - camX, y = r * T;
    if (isSolid(c, r)) {
      const top = !isSolid(c, r - 1);
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
    ctx.fillStyle = "#d9a441"; ctx.beginPath(); ctx.ellipse(x, y - 20, 16, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5b7a2a"; ctx.fillRect(x - 2, y - 46, 4, 8);
  }
  for (const b of bits) { ctx.fillStyle = b.color || "#d9a441"; ctx.fillRect(b.x - camX - 3, b.y - 3, 6, 6); }
  ctx.fillStyle = "rgba(60,40,20,0.85)"; ctx.font = "bold 16px sans-serif";
  for (const l of labels) ctx.fillText(l.text, l.x - camX, l.y);
}
function drawStones(camX) {
  for (const s of stones) {
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
  if (e.code === "KeyR") { david.x = spawn.x; david.y = spawn.y; david.vx = david.vy = 0; for (const g of gourds) g.alive = true; }
});

function drawHUD() {
  ctx.fillStyle = "rgba(0,0,0,0.45)"; ctx.fillRect(10, 10, 560, 118);
  ctx.fillStyle = "#fff"; ctx.font = "15px sans-serif";
  const lines = [
    "Arrows: move (hold to run)   Z / Space = A: jump, again in the air = flip",
    "X = B: sling (hold to charge, Up to aim up)   Down: crouch / crawl",
    "Down + A while moving: roll   Down next to the lamb: pick up / put down",
    "Shift = Select: play the harp   R: reset   M: set up the NES controller",
    "Controller: " + (readPad() ? (padMap ? "set up ✓  (M or hold Select+Start to redo)" : "connected, not set up yet: press M") : "none (press a button on it so the browser sees it)"),
  ];
  lines.forEach((l, i) => ctx.fillText(l, 20, 32 + i * 21));
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
// Main loop
// ============================================================================
let camX = 0, last = performance.now();
function frame(now) {
  const dt = Math.min(1 / 30, (now - last) / 1000); last = now;
  if (toastTime > 0) toastTime -= dt;
  if (loaded < total) {
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#fff"; ctx.font = "24px sans-serif"; ctx.fillText(`Loading sprites ${loaded} / ${total}`, 40, 60);
    requestAnimationFrame(frame); return;
  }
  if (setup.active) updateSetup(dt); else checkCombo(dt);
  pollInput();
  if (!setup.active) { updateDavid(dt); updateLamb(dt); updateStones(dt); }
  const targetCam = Math.max(0, Math.min(LEVEL_W - W, david.x - W * 0.4 + david.facing * 80));
  camX += (targetCam - camX) * Math.min(1, dt * 6);

  drawBackground(camX);
  drawTiles(camX);
  drawLamb(camX);
  drawDavid(camX);
  drawStones(camX);
  if (debug) {
    ctx.strokeStyle = "red"; ctx.strokeRect(david.x - camX - BODY_W / 2, david.y - david.h, BODY_W, david.h);
    ctx.fillStyle = "#fff"; ctx.fillText(`${david.state} vx ${david.vx | 0} vy ${david.vy | 0}`, 20, H - 20);
  }
  drawHUD();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
