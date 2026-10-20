// World 7's stage pieces (loaded after world6.js). The Giant's Shadow (1 Samuel 17:38-41): Saul's armor, the walk down
// the hill, five smooth stones from the stream, and the shield-bearer coming out ahead of the giant (DESIGN 5g).
//   7-1 Saul's Armor: David starts in the king's armor (17:38). In it he can only walk slowly (clank, clank), make a
//       tiny hop and land with a thud: no sling, no roll, no double jump (main.js asks ARMORED()). Every few seconds of
//       walking the helmet slips down over his eyes and the top of the screen goes dark. The armor's 3 grey hearts are
//       hit first. Stand still and press Select to take it off: "I cannot go in these" (17:39), and Saul nods.
//       It stays off for the rest of the stage (a respawn doesn't put it back on).
//   setPiece("saul7", c)  King Saul beside his tent (Glen's saul_armor poses), watching David try the armor.
// Stand-in art until Glen's: David is his own sprite with a bronze coat tinted over his body, a big bronze helmet and a
// sword dragging behind; the armor he takes off is drawn as a little pile.

const W7 = {
  ARMOR_SPEED: 0.42,     // x WALK_SPEED: no running in a coat of armor
  ARMOR_HOP: 0.55,       // x JUMP_SPEED: a hop about a third as high (a crate, never a wall)
  ARMOR_HEARTS: 3,       // grey hearts, hit before his own
  SLIP_EVERY: [3.5, 6],  // seconds of walking between the helmet slipping down
  SLIP_T: 1.1,           // seconds it covers his eyes
  CLANK_EVERY: 0.5,      // seconds between clanks while he walks
  STUCK_T: 1.4,          // seconds pushing against something before the "take it off" reminder
  SAUL_SIZE: 1.0,
};

const armor = { on: LEVEL_STAGE === "7-1", hearts: W7.ARMOR_HEARTS, walkT: 0, nextSlip: 4, slipT: 0, clankT: 0, stuckT: 0,
                told: false, stuckTold: false, wasGround: true, pile: null, offT: 0, bTold: false };
function inArmor() { return armor.on && WORLD === 7; }

// a little metal sound, made on the spot (there's no clank in the sound files): a noisy strike and two ringing partials
function clank(vol = 0.3, pitch = 1) {
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (chimeCtx.state === "suspended") chimeCtx.resume();
    const ac = chimeCtx, t0 = ac.currentTime, out = ac.createGain();
    out.gain.value = vol * sfxMul(); out.connect(ac.destination);
    const n = ac.createBufferSource(), buf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 3);
    const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600 * pitch; bp.Q.value = 1.4;
    n.buffer = buf; n.connect(bp).connect(out); n.start(t0);
    for (const [f, a, d] of [[1180, 0.35, 0.18], [2930, 0.2, 0.12]]) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "triangle"; o.frequency.value = f * pitch * (0.97 + Math.random() * 0.06);
      g.gain.setValueAtTime(a, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g).connect(out); o.start(t0); o.stop(t0 + d + 0.02);
    }
  } catch (e) {}
}
function thud(vol = 0.5) {   // landing in armor
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ac = chimeCtx, t0 = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(120, t0); o.frequency.exponentialRampToValueAtTime(45, t0 + 0.2);
    g.gain.setValueAtTime(vol * sfxMul(), t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
    o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + 0.3);
  } catch (e) {}
  clank(0.25, 0.8);
}

// Select, standing still: off it comes (main.js calls this instead of the harp while he's in the armor)
function armorOff() {
  const d = david;
  if (!armor.on) return false;
  armor.on = false; armor.slipT = 0; armor.offT = 0.001;
  armor.pile = { x: d.x - d.facing * 34, y: d.y, facing: d.facing };
  d.vx = 0; setState("idle");
  clank(0.35, 0.9); setTimeout(() => clank(0.3, 1.1), 180); setTimeout(() => thud(0.35), 420);
  sayLine("David", "I cannot go in these, because I am not used to them. (1 Samuel 17:39)");
  return true;
}
// a hit while he's in it: the armor takes it (a clank, a small shove) until its grey hearts are gone
function armorHit(fromX) {
  if (!armor.on || armor.hearts <= 0) return false;
  const d = david;
  armor.hearts--; d.inv = TUNE.HURT_INVINCIBLE;
  d.vx = Math.sign(d.x - fromX || -d.facing) * 160; d.vy = -260; d.onGround = false;
  clank(0.45, 0.85);
  if (armor.hearts === 0) toast("The armor's dented through. It isn't helping much now...");
  return true;
}
function drawArmorHearts(xRight) {   // grey hearts to the left of his own (main.js drawHearts)
  ctx.save(); ctx.filter = "grayscale(1) brightness(0.85)";
  for (let i = 0; i < W7.ARMOR_HEARTS; i++) hudIcon(i < armor.hearts ? "heart_full" : "heart_empty", xRight - (W7.ARMOR_HEARTS - 1 - i) * 36, 12, 32);
  ctx.restore();
}

function updateArmor(dt) {
  const d = david;
  if (armor.offT > 0) armor.offT += dt;
  if (!armor.on) return;
  const walking = d.onGround && Math.abs(d.vx) > 20;
  if (!armor.told && !dialogHeld() && dialog.t <= 0) { armor.told = true; toast("Saul's armor is heavy: slow, a little hop, and no sling. Stand still and press Select to take it off."); }
  if (pressed("b") && !armor.bTold && !d.harp) { armor.bTold = true; toast("You can't swing a sling in a coat of armor."); clank(0.2, 1.2); }
  if (walking) {
    armor.walkT += dt; armor.clankT += dt;
    if (armor.clankT > W7.CLANK_EVERY) { armor.clankT = 0; clank(0.14, 0.9 + Math.random() * 0.25); }
    if (armor.walkT > armor.nextSlip && armor.slipT <= 0) {
      armor.slipT = W7.SLIP_T; armor.walkT = 0;
      armor.nextSlip = W7.SLIP_EVERY[0] + Math.random() * (W7.SLIP_EVERY[1] - W7.SLIP_EVERY[0]);
      clank(0.22, 1.3);
    }
  }
  armor.slipT = Math.max(0, armor.slipT - dt);
  if (!armor.wasGround && d.onGround) thud(0.45);
  armor.wasGround = d.onGround;
  // pushing against something he can't get over: remind him once
  const pushing = (held("left") || held("right")) && d.onGround && Math.abs(d.vx) < 15;
  armor.stuckT = pushing ? armor.stuckT + dt : 0;
  if (armor.stuckT > W7.STUCK_T && !armor.stuckTold && !dialogHeld()) {
    armor.stuckTold = true;
    sayLine("David", "I can't get over that. Not in all this. (Stand still and press Select to take the armor off.)");
  }
}

// ---------------------------------------------------------------------------
// Drawing: David in the armor (stand-in), the pile he leaves, Saul
// ---------------------------------------------------------------------------
const armorCanvas = document.createElement("canvas");
function drawArmorDavid(d, x, y) {
  const t = d.t, H = TUNE.DAVID_HEIGHT;
  let nm, i, yy = y;
  if (!d.onGround) { nm = "david_jump_air"; i = 5; yy = y - d.h / 2 - 6; }
  else if (Math.abs(d.vx) > 15) { nm = "david_walk"; i = frameOf("david_walk", t * 0.55); }
  else { nm = "david_idle"; i = frameOf("david_idle", t); }
  // the sword, too long for him, its tip dragging in the dirt behind
  const hipX = x - d.facing * 6, hipY = y - H * 0.42, bob = d.onGround && Math.abs(d.vx) > 15 ? Math.sin(t * 11) * 2 : 0;
  ctx.save(); ctx.lineCap = "round";
  ctx.strokeStyle = "#5b3a1e"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(hipX - d.facing * 16, hipY + 14); ctx.stroke();   // the hilt
  ctx.strokeStyle = "#b9b4a6"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hipX - d.facing * 14, hipY + 12); ctx.lineTo(x - d.facing * 70, (d.onGround ? y - 2 : hipY + 40) + bob); ctx.stroke();
  ctx.restore();
  // the coat of armor: rows of bronze scales painted into his own outline, from the shoulders to the knees (far too long)
  const s = SPR[nm]; if (!s || !s.img.naturalWidth) return false;
  const sc = SCALE * (TUNE.SPRITE_SIZE[nm] || 1), cw = Math.ceil(s.w * sc), chh = Math.ceil(s.h * sc);
  const cv = armorCanvas, g = cv.getContext("2d");
  if (cv.width < cw || cv.height < chh) { cv.width = cw; cv.height = chh; }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, cv.width, cv.height);
  g.drawImage(s.img, i * s.w, 0, s.w, s.h, 0, 0, s.w * sc, s.h * sc);
  const feet = s.ay * sc, top = feet - H * (d.onGround ? 0.79 : 0.67), bot = feet - H * (d.onGround ? 0.2 : 0.14);
  g.globalCompositeOperation = "source-atop";
  const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, "#c98f3c"); gr.addColorStop(0.5, "#8f5a20"); gr.addColorStop(1, "#5a3510");
  g.fillStyle = gr; g.fillRect(0, top, cw, bot - top);
  g.strokeStyle = "rgba(255,214,140,0.45)"; g.lineWidth = 1.2;   // the scales: little arcs, row on row, each row offset
  for (let yy2 = top + 5, row = 0; yy2 < bot; yy2 += 5, row++) for (let xx = (row % 2) * 3; xx < cw; xx += 6) { g.beginPath(); g.arc(xx, yy2 - 2, 3, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
  g.fillStyle = "rgba(60,36,10,0.9)"; g.fillRect(0, bot - 3, cw, 3);   // the hem
  ctx.save(); ctx.translate(Math.round(x), Math.round(yy)); ctx.scale(d.facing, 1);
  ctx.drawImage(cv, 0, 0, cw, chh, -s.ax * sc, -s.ay * sc, cw, chh); ctx.restore();
  // the helmet: too big, sitting low; when it slips it covers his eyes
  const slip = armor.slipT > 0 ? Math.min(1, (W7.SLIP_T - armor.slipT) / 0.12, armor.slipT / 0.2) : 0;
  const hx = x + d.facing * 5, hy = (d.onGround ? yy - H * 0.8 : yy - H * 0.68) + slip * 12;
  drawHelmet(hx, hy, H * 0.2, d.facing);
  return true;
}
function drawHelmet(x, y, r, facing, lying = false) {
  ctx.save(); ctx.translate(x, y); if (lying) ctx.rotate(facing * 1.2);
  const g = ctx.createLinearGradient(0, -r, 0, r * 0.5);
  g.addColorStop(0, "#f1c46a"); g.addColorStop(0.45, "#b07a2a"); g.addColorStop(1, "#6b4316");
  ctx.fillStyle = g; ctx.strokeStyle = "#3d2408"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 0, r * 1.15, r, 0, Math.PI, 0); ctx.lineTo(r * 1.25, r * 0.28); ctx.lineTo(-r * 1.25, r * 0.28); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#8a5a1e"; ctx.fillRect(-r * 1.28, r * 0.12, r * 2.56, r * 0.3); ctx.strokeRect(-r * 1.28, r * 0.12, r * 2.56, r * 0.3);   // the rim
  ctx.fillStyle = "rgba(255,240,200,0.55)"; ctx.beginPath(); ctx.ellipse(-facing * r * 0.35, -r * 0.55, r * 0.22, r * 0.12, -0.5 * facing, 0, Math.PI * 2); ctx.fill();   // shine
  ctx.restore();
}
function drawArmorPile(camX) {
  const p = armor.pile; if (!p) return;
  const x = p.x - camX, y = p.y, H = TUNE.DAVID_HEIGHT;
  if (x < -100 || x > W + 100) return;
  ctx.save();
  const g = ctx.createLinearGradient(0, y - 30, 0, y);   // the coat, folded on the ground
  g.addColorStop(0, "#d7a24c"); g.addColorStop(1, "#6b4316");
  ctx.fillStyle = g; ctx.strokeStyle = "#3d2408"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 34, y); ctx.quadraticCurveTo(x - 30, y - 26, x, y - 28); ctx.quadraticCurveTo(x + 30, y - 26, x + 34, y); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "rgba(61,36,8,0.5)"; ctx.lineWidth = 1;
  for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 30 + k * 2, y - k * 7); ctx.lineTo(x + 30 - k * 2, y - k * 7); ctx.stroke(); }   // rows of scales
  ctx.strokeStyle = "#b9b4a6"; ctx.lineWidth = 5; ctx.lineCap = "round";   // the sword beside it
  ctx.beginPath(); ctx.moveTo(x + 30, y - 3); ctx.lineTo(x + 92, y - 3); ctx.stroke();
  ctx.strokeStyle = "#5b3a1e"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x + 22, y - 3); ctx.lineTo(x + 34, y - 3); ctx.stroke();
  ctx.restore();
  drawHelmet(x - 6, y - 38, H * 0.15, p.facing);
}
function drawSaul7(camX) {
  for (const p of setPieces) {
    if (p.kind !== "saul7") continue;
    const x = p.x - camX; if (x < -200 || x > W + 200) continue;
    const facing = david.x < p.x ? -1 : 1;
    // listening while David tries it on; surprised as it comes off, then a nod: he isn't offended
    let pose = 0;
    if (armor.offT > 0) pose = armor.offT < 1.2 ? 3 : 5;
    else if (Math.abs(david.x - p.x) < 4 * T) pose = 2;
    if (SPR.saul_armor) drawSprite("saul_armor", pose, x, p.y, facing, W7.SAUL_SIZE);
  }
}

// 7-1: the helmet over his eyes. The top of the screen goes dark down to the bronze rim, for a moment.
function drawWorld7Over() {
  if (!inArmor() || armor.slipT <= 0) return;
  const k = Math.min(1, (W7.SLIP_T - armor.slipT) / 0.12, armor.slipT / 0.25), edge = H * (0.18 + 0.5 * k);
  ctx.save();
  ctx.fillStyle = "rgba(14,8,2,0.94)";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, edge - 40); ctx.quadraticCurveTo(W / 2, edge + 40, 0, edge - 40); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, edge - 50, 0, edge + 10);   // the rim, lit from below
  g.addColorStop(0, "rgba(90,55,15,0)"); g.addColorStop(0.7, "rgba(176,122,42,0.95)"); g.addColorStop(1, "rgba(241,196,106,0.9)");
  ctx.strokeStyle = g; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(W, edge - 40); ctx.quadraticCurveTo(W / 2, edge + 40, 0, edge - 40); ctx.stroke();
  ctx.restore();
}

function updateWorld7(dt) {
  if (WORLD !== 7) return;
  updateArmor(dt);
}
function drawWorld7(camX) {
  if (WORLD !== 7) return;
  drawSaul7(camX);
  drawArmorPile(camX);
}
