// Caves, like Mario's pipes (DESIGN.md §3j). Stand at a cave mouth and press Up: David turns his back, walks in,
// and the screen fades into a separate dark room built past the end of the stage. He lights his oil lamp; only a
// circle around him is lit. The lamp burns olive oil from the flask (Exodus 27:20), so olives in the cave top it up.
// Bats hang from the ceiling and flutter off when he passes (harmless: look before you throw).
// The way out glows with daylight: press Up there to come back out where he went in.

const CAVE = {
  LAMP: 270, LAMP_DIM: 150,      // light radius with oil in the flask, and with none (never total darkness)
  OIL_EVERY: 4,                  // seconds of lamplight per olive
  DARK: 0.93,                    // how dark the cave is outside the lamplight
  TURN: 0.88, WALK_IN: 0.6,      // going in: turning his back, then walking into the dark
  FADE: 0.45,                    // the screen fade, each way
  LIGHT: 1.9,                    // lighting the lamp (the first time only)
  AMBIENCE_VOLUME: 0.45,
};
const cave = { room: null, trans: null, lit: false, oilT: 0, R: CAVE.LAMP, fade: 0, told: false };
const caveAmbience = loopAudio("ambience_cave");
let caveAmbVol = 0;
const darkCanvas = document.createElement("canvas"); darkCanvas.width = W; darkCanvas.height = H;

function camLimits() {
  if (!cave.room) return [0, MAIN_COLS * T - W];
  const a = cave.room.c0 * T - 2 * T, b = (cave.room.c0 + cave.room.w) * T + 2 * T - W;
  return a > b ? [(a + b) / 2, (a + b) / 2] : [a, b];
}
function snapCamera() { const [lo, hi] = camLimits(); camX = Math.max(lo, Math.min(hi, david.x - W * 0.4)); }
function moveParty(x, y) {   // David, his lamb and the rescued lamb arrive together
  const d = david; d.x = x; d.y = y; d.vx = d.vy = 0; d.safe = { x, y };
  lamb.x = x - d.facing * 50; lamb.y = y; lamb.vx = lamb.vy = 0; trail.length = 0;
  for (const sh of line) if (sh.how === "rescued") { sh.x = x - d.facing * 110; sh.y = y; }
  snapCamera();
}
function leaveCaveNow() { if (cave.room) { cave.room = null; cave.trans = null; cave.fade = 0; } if (david.state === "cave") setState("idle"); }

// David's side: start going in or out when Up is pressed at a mouth; run the walk-in / fade while it plays
function caveDavid(d, dt) {
  if (d.state !== "cave") {
    if (!pressed("up") || !d.onGround || d.harp || d.throwT >= 0 || d.deadT > 0 || lamb.stolen) return false;
    if (!cave.room) {
      const door = doors.find(o => Math.abs(d.x - o.x) < 48 && Math.abs(d.y - o.y) < 40);
      if (!door) return false;
      cave.trans = { dir: "in", door, x0: d.x, t: 0 };
    } else if (Math.abs(d.x - cave.room.exitX) < 60) {
      cave.trans = { dir: "out", t: 0 };
    } else return false;
    d.vx = 0; d.charging = false; setState("cave");
    return true;
  }
  const tr = cave.trans; tr.t += dt;
  if (tr.dir === "in") {
    const walkEnd = CAVE.TURN + CAVE.WALK_IN;
    if (tr.t > CAVE.TURN && !tr.inside) d.x = tr.x0 + (tr.door.x - tr.x0) * Math.min(1, (tr.t - CAVE.TURN) / CAVE.WALK_IN);   // into the mouth
    cave.fade = Math.max(0, Math.min(1, (tr.t - (walkEnd - CAVE.FADE)) / CAVE.FADE));
    if (tr.t >= walkEnd && !tr.inside) {   // through: now he's in the cave
      tr.inside = true; tr.tIn = tr.t; cave.room = tr.door.room; d.facing = 1;
      moveParty((cave.room.c0 + 4) * T, GR * T);
      if (!cave.told) { cave.told = true; toast("The lamp burns olive oil from your flask. \"Pure oil of pressed olives for the light\" (Exodus 27:20)"); }
    }
    if (tr.inside) {
      const k = tr.t - tr.tIn;
      cave.fade = Math.max(0, 1 - k / CAVE.FADE);
      const lighting = !cave.lit;
      if (k >= (lighting ? CAVE.LIGHT : CAVE.FADE)) { cave.lit = true; cave.trans = null; setState("idle"); }
    }
    return true;
  }
  // out: he turns to the light and the screen fades; back outside at the mouth he went in by
  if (!tr.outside) {
    cave.fade = Math.min(1, tr.t / CAVE.FADE);
    if (tr.t >= CAVE.FADE) {
      tr.outside = true; tr.tOut = tr.t;
      const door = cave.room.door; cave.room = null; d.facing = 1;
      moveParty(door.x + 30, GR * T);
    }
  } else {
    cave.fade = Math.max(0, 1 - (tr.t - tr.tOut) / CAVE.FADE);
    if (cave.fade <= 0) { cave.trans = null; setState("idle"); }
  }
  return true;
}
function drawCaveDavid(d, x, y) {
  if (d.state !== "cave" || !cave.trans) return false;
  const tr = cave.trans;
  if (tr.dir === "in" && !tr.inside) {
    if (tr.t < CAVE.TURN) drawSprite("david_turn_away", Math.min(7, Math.floor(tr.t / CAVE.TURN * 8)), x, y, d.facing);
    else { const k = (tr.t - CAVE.TURN) / CAVE.WALK_IN; drawSprite("david_walk_away", frameOf("david_walk_away", tr.t), x, y - k * 10, 1, 1 - 0.15 * k, 1 - 0.6 * k); }
  } else if (tr.dir === "in") {   // inside: lighting the lamp the first time, otherwise just standing with it
    const k = tr.t - tr.tIn;
    drawSprite("david_light_lamp", cave.lit ? 15 : Math.min(15, Math.floor(k / CAVE.LIGHT * 16)), x, y, d.facing);
  } else drawSprite(tr.outside ? "david_idle" : "david_turn_away", tr.outside ? 0 : Math.min(7, Math.floor(tr.t / CAVE.FADE * 8)), x, y, tr.outside ? 1 : -1);
  return true;
}

// the lamp burns oil (olives) while you're in a cave; the cave's own sound
function updateCave(dt) {
  caveAmbVol = fadeLoop(caveAmbience, caveAmbVol, cave.room ? CAVE.AMBIENCE_VOLUME : 0, dt, 0.5);
  if (!cave.room) return;
  if (cave.lit && !cave.trans) {
    cave.oilT += dt;
    if (cave.oilT >= CAVE.OIL_EVERY) { cave.oilT = 0; if (david.olives > 0) david.olives--; }
  }
  const want = david.olives > 0 ? CAVE.LAMP : CAVE.LAMP_DIM;
  cave.R += (want - cave.R) * Math.min(1, dt * 1.5);
  // bats: hang until David passes under, then flutter off up and away
  for (const b of caveBats) {
    b.t += dt;
    if (b.state === "hang" && Math.abs(david.x - b.x) < 110 && david.y > b.y) { b.state = "fly"; b.t = 0; b.facing = Math.random() < 0.5 ? -1 : 1; b.vx = b.facing * (160 + Math.random() * 80); b.vy = -60; }
    if (b.state === "fly") {
      b.x += b.vx * dt; b.y += (b.vy + Math.sin(b.t * 14) * 120) * dt;
      if (b.t > 1.8) b.alpha = Math.max(0, b.alpha - dt * 1.2);
    }
  }
}
function stoneHitsBats(s) {
  for (const b of caveBats) if (b.alpha > 0.3 && Math.hypot(s.x - b.x, s.y - b.y) < 28) {
    if (b.state === "hang") { b.state = "fly"; b.t = 0; b.facing = Math.sign(s.vx) || 1; b.vx = b.facing * 220; b.vy = -80; }
    toast("Bats are harmless: they only eat insects. Look before you throw.");
    return true;
  }
  return false;
}
function resetCaves() { for (const b of caveBats) Object.assign(b, { x: b.hx, y: b.hy, state: "hang", alpha: 1, t: Math.random() * 2 }); }

// ---- drawing ----
function drawCaveBackdrop(camX) {   // deep dark rock, a little texture, and daylight at the way out
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#1c140d"); g.addColorStop(1, "#0b0705");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const lim = terPattern("limestone", TUNE.TER_FILL_SCALE);
  if (lim) {
    ctx.save(); ctx.globalAlpha = 0.18; ctx.translate(-Math.round(camX * 0.5), 0);
    ctx.fillStyle = lim; ctx.fillRect(Math.round(camX * 0.5) - 40, 0, W + 80, H); ctx.restore();
  }
  const ex = cave.room.exitX - camX;   // the way out: a warm patch of daylight on the left
  const lg = ctx.createRadialGradient(ex, GR * T - 60, 10, ex, GR * T - 60, 220);
  lg.addColorStop(0, "rgba(255,236,190,0.95)"); lg.addColorStop(0.35, "rgba(255,210,140,0.45)"); lg.addColorStop(1, "rgba(255,200,120,0)");
  ctx.fillStyle = lg; ctx.fillRect(ex - 240, GR * T - 300, 480, 320);
}
function drawCaveDoors(camX) {   // outside: a little "Up" sign over a cave mouth when David is near it
  const d = david;
  if (!cave.room) {
    for (const o of doors) if (Math.abs(d.x - o.x) < 140 && Math.abs(d.y - o.y) < 60 && d.state !== "cave") upHint(o.x - camX, o.y - 150);
  } else {
    for (const b of caveBats) if (b.alpha > 0) {
      if (b.state === "hang") drawSprite("bat_hang", frameOf("bat_hang", b.t), b.x - camX, b.y, 1, 1.5, b.alpha);
      else drawSprite("bat_fly", frameOf("bat_fly", b.t), b.x - camX, b.y, b.facing, 1.5, b.alpha);
    }
    if (Math.abs(d.x - cave.room.exitX) < 140 && d.state !== "cave") upHint(cave.room.exitX - camX, GR * T - 150);
  }
}
function upHint(x, y) {
  const bob = Math.sin(performance.now() / 180) * 4;
  ctx.save(); ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.beginPath(); ctx.roundRect(x - 22, y - 24 + bob, 44, 34, 10); ctx.fill();
  ctx.fillStyle = "#4a3a2a"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center"; ctx.fillText("↑", x, y + 2 + bob);
  ctx.restore();
}
function drawCaveDarkness(camX) {
  if (cave.room) {   // all dark, except the lamp's circle and the daylight at the way out
    const g = darkCanvas.getContext("2d");
    g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, W, H);
    g.fillStyle = `rgba(4,3,2,${CAVE.DARK})`; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = "destination-out";
    const lighting = cave.trans && cave.trans.dir === "in" && cave.trans.inside && !cave.lit;
    const flick = 1 + Math.sin(performance.now() / 70) * 0.025 + Math.sin(performance.now() / 23) * 0.015;
    const R = cave.R * flick * (lighting ? Math.min(1, 0.15 + (cave.trans.t - cave.trans.tIn) / CAVE.LIGHT) : 1);
    const lx = david.x - camX + david.facing * 18, ly = david.y - 86;
    const hole = (x, y, r) => { const rg = g.createRadialGradient(x, y, r * 0.1, x, y, r); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(0.55, "rgba(0,0,0,0.85)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(x - r, y - r, r * 2, r * 2); };
    hole(lx, ly, R);
    hole(cave.room.exitX - camX, GR * T - 70, 200);
    ctx.drawImage(darkCanvas, 0, 0);
    // the lamp's warm light
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    const wg = ctx.createRadialGradient(lx, ly, 4, lx, ly, R * 0.8);
    wg.addColorStop(0, "rgba(255,170,70,0.28)"); wg.addColorStop(1, "rgba(255,140,40,0)");
    ctx.fillStyle = wg; ctx.fillRect(lx - R, ly - R, R * 2, R * 2); ctx.restore();
  }
  if (cave.fade > 0) { ctx.fillStyle = `rgba(0,0,0,${cave.fade})`; ctx.fillRect(0, 0, W, H); }
}
