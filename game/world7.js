// World 7's stage pieces (loaded after world6.js). The Giant's Shadow (1 Samuel 17:38-41): Saul's armor, the walk down
// the hill, five smooth stones from the stream, and the shield-bearer coming out ahead of the giant (DESIGN 5g).
//   7-1 Saul's Armor: David starts in the king's armor (17:38). In it he can only walk slowly (clank, clank), make a
//       tiny hop and land with a thud: no sling, no roll, no double jump (main.js asks ARMORED()). Every few seconds of
//       walking the helmet slips down over his eyes and the top of the screen goes dark. The armor's 3 grey hearts are
//       hit first. Stand still and press Select to take it off: "I can't go with these" (17:39), and Saul nods.
//       It stays off for the rest of the stage (a respawn doesn't put it back on).
//   setPiece("saul7", c)  King Saul beside his tent (Glen's saul_armor poses), watching David try the armor.
// Glen's clips (2026-10-20): david_armor_idle / walk / hop / slip / off (world7/david_armor). The off clip ends with the
// armor in a pile beside him: that last frame, without David, stays on the ground.

const W7 = {
  ARMOR_SPEED: 0.42,     // x WALK_SPEED: no running in a coat of armor
  ARMOR_HOP: 0.55,       // x JUMP_SPEED: a hop about a third as high (a crate, never a wall)
  ARMOR_HEARTS: 3,       // grey hearts, hit before his own
  SLIP_EVERY: [3.5, 6],  // seconds of walking between the helmet slipping down
  SLIP_T: 1.6,           // seconds of the helmet slipping down and being pushed back (david_armor_slip from SLIP_FROM)
  HELM_HOLE_Y: 395,      // helmet_view.png: the top of its eye holes, px
  SLIP_FROM: 5,          // the slip sheet's first frames are him looking up at it, tipped back: start where he grabs it
  OFF_MS: 120,           // ms per frame taking the armor off (david_armor_off, 28 frames)
  CLANK_EVERY: 0.5,      // seconds between clanks while he walks
  STUCK_T: 1.4,          // seconds pushing against something before the "take it off" reminder
  SAUL_SIZE: 1.0,
  LAMB_SIZE: 1.5,        // the opening scene (w7intro): the lamb in Saul's spare helmet
  LAMB_HELM: [1, -43, 15],
  LAMB_HELM_IMG: [50, 62, 3.2],   // Glen's david_helmet on the lamb: the point of the image (px) that sits on LAMB_HELM, and its width x the helmet radius
  PAIR_SAUL: 40,         // saul_dress / saul_off (Glen's two-person tent clips): Saul's feet, sheet px right of the anchor,
  PAIR_DAVID: 105,       //   and David's, left of it // the helmet on its head: x, y from its feet and radius, in lamb_walk's own px
};

const armor = { on: LEVEL_STAGE === "7-1", removing: 0, hearts: W7.ARMOR_HEARTS, walkT: 0, nextSlip: 4, slipT: 0, clankT: 0, stuckT: 0,
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
  if (armor.removing > 0) return true;
  armor.slipT = 0; d.vx = 0; setState("idle");
  if (SPR.saul_off) { w7off.start(); return true; }   // Glen's clip with Saul: a cut to the tent (w7off), then back here
  if (!SPR.david_armor_off) { armorDone(); return true; }
  armor.removing = 0.001;   // Glen's clip: the helmet, the coat, the shin guards, one by one (updateArmor)
  return true;
}
function armorDone(said = false) {
  const d = david;
  armor.on = false; armor.removing = 0; armor.offT = 0.001;
  armor.pile = { x: d.x, y: d.y, facing: d.facing, drawn: !SPR.david_armor_off };
  if (!SPR.david_armor_off) { armor.pile.x -= d.facing * 34; clank(0.35, 0.9); setTimeout(() => thud(0.35), 420); }
  if (!said) sayLine("David", "I can't go with these; for I haven't tested them. (1 Samuel 17:39)");
}
const armorSpeed = () => (armor.removing > 0 || armor.slipT > 0 ? 0 : W7.ARMOR_SPEED);   // (he stops to fix the helmet)
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
  if (armor.removing > 0) {   // taking it off: he stands there; a clank as each piece comes down
    const f0 = Math.floor(armor.removing * 1000 / W7.OFF_MS); armor.removing += dt; d.vx = 0;
    const f1 = Math.floor(armor.removing * 1000 / W7.OFF_MS);
    if (f1 !== f0 && [4, 9, 14, 19, 24].includes(f1)) { clank(0.3, 0.8 + f1 * 0.02); if (f1 === 9) thud(0.3); }
    if (f1 >= SPR.david_armor_off.frames) armorDone();
    return;
  }
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
  if (!SPR.david_armor_walk || !SPR.david_armor_walk.img.naturalWidth) return drawArmorDavidDrawn(d, x, y);
  const t = d.t;
  if (armor.removing > 0) { drawSprite("david_armor_off", Math.min(SPR.david_armor_off.frames - 1, Math.floor(armor.removing * 1000 / W7.OFF_MS)), x, y, d.facing); return true; }
  if (armor.slipT > 0) {
    const n = SPR.david_armor_slip.frames, p = 1 - armor.slipT / W7.SLIP_T;
    drawSprite("david_armor_slip", Math.min(n - 1, W7.SLIP_FROM + Math.floor(p * (n - W7.SLIP_FROM))), x, y, d.facing); return true;
  }
  if (!d.onGround) {   // the hop: crouch, up, down, from how fast he's rising or falling
    const v0 = TUNE.JUMP_SPEED * W7.ARMOR_HOP, k = Math.max(0, Math.min(1, (d.vy + v0) / (2 * v0)));
    drawSprite("david_armor_hop", 3 + Math.round(k * 6), x, y, d.facing); return true;
  }
  if (Math.abs(d.vx) > 15) { drawSprite("david_armor_walk", frameOf("david_armor_walk", t * Math.max(0.5, Math.abs(d.vx) / (TUNE.WALK_SPEED * W7.ARMOR_SPEED))), x, y, d.facing); return true; }
  drawSprite("david_armor_idle", frameOf("david_armor_idle", t), x, y, d.facing);
  return true;
}
function drawArmorDavidDrawn(d, x, y) {   // (until the sheets load: drawn over his own sprite)
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
  if (x < -300 || x > W + 300) return;
  if (!p.drawn && SPR.david_armor_off) {   // the pile from the last frame of Glen's clip, without David
    const s = SPR.david_armor_off, sc = SCALE, edge = 39 * sc;
    ctx.save(); ctx.beginPath();
    if (p.facing > 0) ctx.rect(x + edge, y - s.h * sc, s.w * sc, s.h * sc + 4); else ctx.rect(x - edge - s.w * sc, y - s.h * sc, s.w * sc, s.h * sc + 4);
    ctx.clip(); drawSprite("david_armor_off", s.frames - 1, x, y, p.facing); ctx.restore();
    return;
  }
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
  if (WORLD === 7) { drawShadow74(); drawMemoryOver(); drawCloseup(); }
  if (!inArmor() || armor.slipT <= 0) return;
  const p = 1 - armor.slipT / W7.SLIP_T, k = Math.max(0, Math.min(1, (p - 0.2) / 0.1, (1 - p) / 0.12)), edge = H * (0.18 + 0.5 * k);
  const img = ITEM.helmet_view;
  if (img && img.naturalWidth) {   // Glen's clip from inside the helmet (assets/items/helmet_view.png, the eye holes cut out): it slides down over the view
    const s = W / img.naturalWidth, hole = W7.HELM_HOLE_Y * s, y = -40 - hole + (H * 0.5 + 40) * k;
    ctx.save(); ctx.fillStyle = `rgba(10,6,2,${0.28 * k})`; ctx.fillRect(0, 0, W, H);   // a little darker in there
    ctx.globalAlpha = Math.min(1, k * 3); ctx.drawImage(img, 0, Math.round(y), W, img.naturalHeight * s); ctx.restore();
    return;
  }
  ctx.save();
  ctx.fillStyle = "rgba(14,8,2,0.94)";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, edge - 40); ctx.quadraticCurveTo(W / 2, edge + 40, 0, edge - 40); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(0, edge - 50, 0, edge + 10);   // the rim, lit from below
  g.addColorStop(0, "rgba(90,55,15,0)"); g.addColorStop(0.7, "rgba(176,122,42,0.95)"); g.addColorStop(1, "rgba(241,196,106,0.9)");
  ctx.strokeStyle = g; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(W, edge - 40); ctx.quadraticCurveTo(W / 2, edge + 40, 0, edge - 40); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------------------
// 7-2 Remember the Hills: memory sections (DESIGN 5g). setPiece("memory", c, GR, { to, bg, name, night }) from column c
// to `to`: while David is in it the stage shows that old world's own background layers, under a warm wash, and (night)
// the lion's dark. Crossing in or out the air shimmers gold, and the switch happens under the shimmer. The ground stays
// 7-2's (one ground set a stage). setPiece("memsheep", c, r, { n }) a remembered sheep: reach it and it fades into
// sparkles (the lost things of 7-2). setPiece("taunt", c, r, { n }) the giant's shouting from across the valley.
// ---------------------------------------------------------------------------
Object.assign(W7, {
  SHIMMER_T: 0.9,        // seconds of the gold shimmer crossing into or out of a memory (the switch is at its brightest)
  MEM_WASH: "rgba(255,196,120,0.22)",   // the memory's warm wash (soft-light), over a gold vignette
  TITLE_T: 6.5,          // seconds "David remembers..." stays up (Glen: long enough to read without going back)
  MEMSHEEP_REACH: 60,    // px
});
const memZones = setPieces.filter(p => p.kind === "memory").map(p => ({ c0: p.c, c1: p.to, bg: p.bg, name: p.name, night: !!p.night }));
const memSheep = setPieces.filter(p => p.kind === "memsheep").map(p => ({ x: p.x, y: p.y, n: p.n, state: "wait", t: Math.random() * 3 }));
const taunts = setPieces.filter(p => p.kind === "taunt").map(p => ({ x: p.x, n: p.n, done: false }));
const mem = { shown: null, target: null, shT: -1, titleT: 0, title: "" };
const MEMSHEEP_LINES = [
  "The rocky pastures. I was so scared of that drop... and I went after her anyway.",
  "The forest. Hanan's fire, and the boar. The LORD was with me then, too.",
  "Up on the cliffs, by the spring. I thought I'd never get her down.",
  "The lamb on the rooftops of Bethlehem. The whole town laughed at me.",
  "The night of the lion. I can still hear it. And I can still feel how He held me.",
];
const TAUNTS = [   // 1 Samuel 17:8-10 (WEB), the giant's voice across the valley
  "\"Why have you come out to set your battle in array? Am I not a Philistine, and you servants to Saul?\" (1 Samuel 17:8)",
  "\"Choose a man for yourselves, and let him come down to me!\" (1 Samuel 17:8)",
  "\"If he is able to fight with me and kill me, then will we be your servants.\" (1 Samuel 17:9)",
  "\"I defy the ranks of Israel today! Give me a man, that we may fight together!\" (1 Samuel 17:10)",
];
const TAUNT_CLIPS = [["lamah", "avadim"], ["bru_lachem"], ["im_yuchal"], ["maarchot", "nilachamah"]];   // Glen's Hebrew, line by line with TAUNTS
const GOLIATH_LEN = { lamah: 6.9, avadim: 10.0, bru_lachem: 6.6, im_yuchal: 12.6, maarchot: 9.7, nilachamah: 6.8, hakelev: 8.9, lecha_elai: 15.6 };   // seconds (0.8 of echo tail each)
function goliathChain(names, vol) {   // one line after another, the next starting under the last one's echo
  let t = 0;
  for (const n of names) { setTimeout(() => sfx("goliath_" + n, undefined, vol), t * 1000); t += (GOLIATH_LEN[n] || 4) - 0.9; }
  return t;
}
const memZoneAt = x => memZones.find(z => x >= z.c0 * T && x < (z.c1 + 1) * T) || null;
const dayNight7 = !!STAGE_INFO.night;
if (memZones.length) {   // the background follows the memory David is in
  const drawBg7 = drawBackground;
  drawBackground = function (cx) { bgWorld = mem.shown ? mem.shown.bg : STAGE_INFO.bg; drawBg7(cx); };
}
function updateMemories(dt) {
  if (!memZones.length) return;
  const d = david, z = memZoneAt(d.x);
  if (z !== mem.target) { mem.target = z; if (mem.shT < 0) mem.shT = 0; }
  if (mem.shT >= 0) {
    const was = mem.shT; mem.shT += dt;
    if (was < W7.SHIMMER_T / 2 && mem.shT >= W7.SHIMMER_T / 2 && mem.shown !== mem.target) {   // under the brightest moment: switch
      mem.shown = mem.target; STAGE_INFO.night = mem.shown ? mem.shown.night : dayNight7;
      if (mem.shown) { mem.title = "David remembers... " + mem.shown.name; mem.titleT = W7.TITLE_T; }
    }
    if (mem.shT >= W7.SHIMMER_T) mem.shT = mem.shown !== mem.target ? 0 : -1;   // (he stepped back out mid-shimmer: once more)
  }
  mem.titleT = Math.max(0, mem.titleT - dt);
  for (const s of memSheep) {
    s.t += dt;
    if (s.state === "wait" && Math.abs(d.x - s.x) < W7.MEMSHEEP_REACH && Math.abs(d.y - s.y) < 70 && d.deadT <= 0) {
      s.state = "fade"; s.t = 0; if (typeof chime === "function") chime(memSheep.filter(q => q.state !== "wait").length + 2);
      sfx("sheep_baa_" + (1 + (s.n % 7)), s.x, 0.5);
      sayLine("David", MEMSHEEP_LINES[s.n % MEMSHEEP_LINES.length]);
      const n = memSheep.filter(q => q.state !== "wait").length;
      if (n === memSheep.length) setTimeout(() => toast(`All ${n} remembered sheep. He trained my hands, every one of those days.`), 4000);
    } else if (s.state === "fade" && s.t > 1.4) s.state = "gone";
  }
  for (const tn of taunts) if (!tn.done && d.x > tn.x) {
    tn.done = true;
    goliathChain(TAUNT_CLIPS[tn.n % TAUNT_CLIPS.length], 0.55);   // the very words of the caption
    toast("Across the valley, the giant: " + TAUNTS[tn.n % TAUNTS.length]);
  }
}
const lostThings7 = lostThingsTally;
lostThingsTally = function () {
  if (memSheep.length) return { found: memSheep.filter(s => s.state !== "wait").length, total: memSheep.length, things: "remembered sheep", icon: "sheep" };
  return lostThings7();
};
function drawMemSheep(camX) {
  for (const s of memSheep) {
    if (s.state === "gone") continue;
    const x = s.x - camX; if (x < -100 || x > W + 100) continue;
    const a = s.state === "fade" ? Math.max(0, 1 - s.t / 1.2) : 0.88;
    ctx.save(); ctx.globalCompositeOperation = "lighter";   // a soft gold glow: it's a memory
    const g = ctx.createRadialGradient(x, s.y - 26, 4, x, s.y - 26, 70);
    g.addColorStop(0, `rgba(255,220,140,${0.45 * a})`); g.addColorStop(1, "rgba(255,200,120,0)");
    ctx.fillStyle = g; ctx.fillRect(x - 70, s.y - 96, 140, 140); ctx.restore();
    const nm = s.state === "fade" ? "sheep_stand" : "sheep_graze";
    drawSprite(nm, frameOf(nm, s.t), x, s.y, s.n % 2 ? 1 : -1, 1, a, "sepia(0.35) brightness(1.08)");
    if (s.state === "fade") {   // sparkles rising off it
      ctx.save(); ctx.fillStyle = "#fff3c4";
      for (let k = 0; k < 14; k++) {
        const f = (s.t * 0.9 + k / 14) % 1, px = x + Math.sin(k * 7.3 + s.t * 3) * 34, py = s.y - 20 - f * 120;
        ctx.globalAlpha = Math.max(0, (1 - f) * Math.min(1, 2.4 - s.t)); ctx.beginPath(); ctx.arc(px, py, 2.5 + (k % 3), 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }
}
function drawMemoryOver() {   // the wash, the vignette, the shimmer and the title (after the night tint, before the HUD)
  if (!memZones.length) return;
  if (mem.shown) {
    ctx.save();
    ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = W7.MEM_WASH; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.7);
    v.addColorStop(0, "rgba(90,55,15,0)"); v.addColorStop(1, "rgba(90,55,15,0.5)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (mem.shT >= 0) {
    const k = Math.sin(Math.PI * Math.min(1, mem.shT / W7.SHIMMER_T));
    ctx.save();
    const g = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.75);
    g.addColorStop(0, `rgba(255,250,225,${0.95 * k})`); g.addColorStop(1, `rgba(255,214,140,${0.85 * k})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  if (mem.titleT > 0) {
    const a = Math.min(1, mem.titleT / 0.6, (W7.TITLE_T - mem.titleT) / 0.6);
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = "center"; ctx.font = "italic 30px Georgia, serif";
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillText(mem.title, W / 2 + 2, 112);
    ctx.fillStyle = "#ffe9b8"; ctx.fillText(mem.title, W / 2, 110); ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// 7-3 Five Smooth Stones (DESIGN 7-3): the streambed in the middle of the valley. Choosing stones is the gameplay.
//   setPiece("pickstone", c, GR - 1, { look, under })  a stone lying in the streambed. It shines faintly when David is
//       near; Down beside it lifts it for a close-up (the game waits): A keeps it, B puts it back. Only smooth, round
//       ones go in the bag (look "smooth", Glen: only the round ball); the egg-long, long, jagged, cracked, pitted or lopsided ones are rejects (PICK_IMG: his pictures for the close-up). under:
//       "scorpion" or "viper" comes out from under it (the last Shepherd's Judgment: look before you throw). Five smooth
//       stones are the lost things, and the gate won't open without them.
//   The Stones of the Name (DESIGN "The Stones of the Name"): two crossings on carved stepping stones, a low stone and
//   a high stone at each step. Only the right letters hold; a wrong one locks the jump, cracks and drops David in:
//   a life. nameStone(c, r, cross, k, letter, right) in main.js; setPiece("nameclue", c, GR - 1, { cross }) is the
//   carving on the boulder before each crossing (only the letters David has found are legible). Standing at it,
//   Select opens the Journal at the old letters.
//   Crossing 1 (over the spikes): Dalet-Waw-Dalet, David's own name. Crossing 2 (the deepest pool): the Name,
//   Yod-He-Waw-He, read from the right, so stepped He, Waw, He, Yod. The first time he steps on Yod first: "Oh wait."
// ---------------------------------------------------------------------------
Object.assign(W7, {
  PICK_REACH: 58,        // px: close enough to lift a stone
  PICK_SHINE: 190,       // px: stones start to shine faintly
  BAG: 5,                // smooth stones he needs (1 Samuel 17:40)
  NAME_LETTER: [0.5, 0.62],   // a Name stone's letter: its height x the stone's, and where its middle sits (x the stone's height, from the top)
  RIDDLE: [0.36, 44, 1.2],     // 7-3, the riddle over the bridge: its height (fraction of the screen), letter size, seconds per line to fade in
  CLUE_ARC: [62, 70, 6, 13],   // the scratches on the boulder: their top (px above the boulder's foot), the curve's radius, how many, the space between them
  PICK_GROUND: 40,       // px, the biggest side of a stone lying in the streambed (Glen's pictures)
  NAME_LOCK: 0.8,        // seconds stuck on a wrong stone while it cracks (no jumping off it)
  NAME_SINK: 1.5,        // seconds of falling in with the pieces, before the campfire
  NAME_W: 3,             // columns wide, each carved stone
});
const PICK_LOOKS = {
  smooth:  { keep: true,  say: "Smooth and round, and just the right weight. This one will fly true." },
  egg:     { keep: false, say: "Smooth, but long as an egg. It would turn over in the air." },
  jagged:  { keep: false, say: "Jagged edges. It would tumble and wobble in the air." },
  flat:    { keep: false, say: "Too long and thin. It would tumble end over end." },
  pitted:  { keep: false, say: "Full of holes, and light as bread. The wind would carry it off." },
  cracked: { keep: false, say: "There's a crack right through it. It could split apart in the sling." },
  lumpy:   { keep: false, say: "Lopsided: heavier on one side. It would pull off to the left." },
};
const PICK_IMG = { smooth: ["pick_round"], egg: ["pick_oval"], jagged: ["pick_jagged_grey", "pick_jagged_red"], cracked: ["pick_cracked"],
                   lumpy: ["pick_lumpy"], pitted: ["pick_pitted"], flat: ["pick_long"] };   // Glen's stones, for the close-up in his hand
const pickStones = setPieces.filter(p => p.kind === "pickstone").map(p => ({ x: p.x, y: p.y, c: p.c, look: p.look, under: p.under || null, state: "lie", t: Math.random() * 6 }));
const closeup = { open: false, s: null, t: 0, crawl: false };
const bagCount = () => pickStones.filter(s => s.state === "kept").length;
function w7Down() {   // main.js: Down beside a stone lifts it for a look (instead of picking up the lamb)
  if (!pickStones.length || closeup.open) return false;
  const d = david, s = pickStones.find(q => q.state === "lie" && Math.abs(q.x - d.x) < W7.PICK_REACH && Math.abs(q.y - d.y) < 40);
  if (!s) return false;
  Object.assign(closeup, { open: true, s, t: 0, crawl: !!s.under });
  d.vx = 0; d.facing = Math.sign(s.x - d.x) || d.facing; sfx("stone_hit", s.x, 0.25, 1.6);
  return true;
}
function w7Hold(real) {   // main.js frame: while he's looking at a stone the stage waits; A keeps it, B (or Down) puts it back
  if (!closeup.open) return false;
  closeup.t += real;
  if (closeup.t < 0.3) return true;
  if (pressed("a")) keepStone(); else if (pressed("b") || pressed("down") || pressed("select")) putBack();
  return true;
}
function keepStone() {
  const s = closeup.s, L = PICK_LOOKS[s.look];
  if (!L.keep) { putBack(); sayLine("David", "No. It would wobble. Only smooth, round ones go in the bag."); return; }
  if (bagCount() >= W7.BAG) { putBack(); toast("The bag already has five smooth stones. That's enough."); return; }
  closeup.open = false; s.state = "kept"; s.t = 0;
  const n = bagCount(); chime(n + 2); sfx("stone_hit", s.x, 0.3, 1.9);
  for (let k = 0; k < 10; k++) bits.push({ x: s.x, y: s.y - 10, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 300, life: 0.5, color: "#fff2b0" });
  if (n < W7.BAG) toast(`A smooth stone, into the shepherd's bag. (${n} of ${W7.BAG})`);
  else setTimeout(() => {   // the fifth: David writes it down
    david.vx = 0; hushLoops();
    if (typeof Journal !== "undefined" && Journal.openNote) Journal.openNote(fiveNote(), () => toast("Archaeologists have found many shaped sling stones in Israel from Bible times, some about the size of a tennis ball."));
    else toast("Five smooth stones. He chose five smooth stones out of the brook. (1 Samuel 17:40)");
  }, 600);
}
function putBack() {
  const s = closeup.s; closeup.open = false;
  if (!s.under) return;
  const c = Math.floor(s.x / T) + (david.x < s.x ? 1 : -1);   // it runs out the far side, away from David
  if (s.under === "viper") snake("viper", c); else critter(s.under, c);
  toast(s.under === "viper" ? "A viper was coiled under that one! Back away from it." : "A scorpion was under it! Look before you lift. Or before you throw.");
  s.under = null;
}
function fiveNote() {
  return {
    left: [{ at: 5, size: "entry", segs: [{ text: "Five smooth stones from the stream, in the bag Shammah gave me.", at: 5 }] },
           { at: 5, size: "small", segs: [{ text: "The round, smooth ones fly true. The rough ones wobble, and the flat ones sail off sideways.", at: 5 }] },
           { at: 5, size: "small", segs: [{ text: "He chose for himself five smooth stones out of the brook, and put them in the shepherd's bag. (1 Samuel 17:40)", at: 5 }] }],
    right: [{ at: 5, size: "entry", segs: [{ text: "Why five?", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "The Bible doesn't say. Some think he took extra, in case he missed. Others point out that Goliath had relatives in Gath who were giants too (2 Samuel 21:22).", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "Either way, he needed only one.", at: 5 }] }],
  };
}
// a stone, drawn: the close-up (big) and lying in the streambed (small). seed keeps each one's own shape.
function stoneShape(look, seed) {
  let h = seed * 9301 + 49297; const rnd = () => ((h = (h * 9301 + 49297) % 233280) / 233280);
  const pts = [], n = look === "jagged" ? 9 : 24;
  for (let k = 0; k < n; k++) {
    const a = k / n * Math.PI * 2;
    let rx = 1, ry = 0.82;
    if (look === "egg") { rx = 1.12; ry = 0.74; }
    if (look === "flat") { rx = 1.2; ry = 0.34; }
    let r = 1;
    if (look === "jagged") r = 0.62 + rnd() * 0.5;
    if (look === "lumpy") r = 1 + 0.22 * Math.sin(a * 2 + seed) + 0.12 * Math.sin(a * 3 + seed * 2);
    if (look === "cracked") r = 1 + (rnd() - 0.5) * 0.06;
    if (look === "smooth" || look === "egg") r = 1 + (rnd() - 0.5) * 0.025;
    pts.push([Math.cos(a) * rx * r, Math.sin(a) * ry * r]);
  }
  return pts;
}
function drawStoneShape(x, y, R, look, seed) {
  const pts = stoneShape(look, seed);
  ctx.save(); ctx.translate(x, y);
  ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px * R, py * R) : ctx.moveTo(px * R, py * R)); ctx.closePath();
  const smooth = look === "smooth" || look === "egg";
  const g = ctx.createRadialGradient(-R * 0.35, -R * 0.35, R * 0.1, 0, 0, R * 1.2);
  g.addColorStop(0, smooth ? "#efe6d2" : "#cfc2a8"); g.addColorStop(0.55, look === "egg" ? "#bba27c" : "#a89c86"); g.addColorStop(1, "#5e5446");
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = Math.max(1, R * 0.03); ctx.strokeStyle = "rgba(40,32,24,0.6)"; ctx.stroke();
  if (look === "jagged") {   // flat-cut faces
    ctx.save(); ctx.clip();
    for (let k = 0; k < pts.length; k += 2) { ctx.fillStyle = k % 4 ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.1)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(pts[k][0] * R, pts[k][1] * R); ctx.lineTo(pts[(k + 1) % pts.length][0] * R, pts[(k + 1) % pts.length][1] * R); ctx.fill(); }
    ctx.restore();
  }
  if (look === "cracked") { ctx.strokeStyle = "rgba(30,22,16,0.85)"; ctx.lineWidth = Math.max(1, R * 0.05); ctx.beginPath(); ctx.moveTo(-R * 0.7, -R * 0.5); ctx.lineTo(-R * 0.2, -R * 0.1); ctx.lineTo(-R * 0.35, R * 0.2); ctx.lineTo(R * 0.25, R * 0.45); ctx.lineTo(R * 0.4, R * 0.75); ctx.stroke(); }
  if (look === "flat") { ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(-R * 1.2, R * 0.05, R * 2.4, R * 0.3); }
  if (smooth) {   // a polished gleam
    ctx.fillStyle = "rgba(255,255,250,0.55)"; ctx.beginPath(); ctx.ellipse(-R * 0.38, -R * 0.36, R * 0.26, R * 0.13, -0.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
function drawPickStones(camX) {
  const d = david;
  for (const s of pickStones) {
    if (s.state === "kept") continue;
    const x = s.x - camX; if (x < -60 || x > W + 60) continue;
    if (closeup.open && closeup.s === s) continue;   // it's in his hand
    const near = Math.max(0, 1 - Math.abs(s.x - d.x) / W7.PICK_SHINE) * (Math.abs(s.y - d.y) < 120 ? 1 : 0);
    if (near > 0) {   // a faint shine when he's near
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const a = near * (0.35 + 0.15 * Math.sin(performance.now() / 300 + s.c));
      const g = ctx.createRadialGradient(x, s.y - 8, 2, x, s.y - 8, 34); g.addColorStop(0, `rgba(255,236,170,${a})`); g.addColorStop(1, "rgba(255,220,140,0)");
      ctx.fillStyle = g; ctx.fillRect(x - 36, s.y - 44, 72, 72); ctx.restore();
    }
    const imgs = PICK_IMG[s.look], img = imgs && ITEM[imgs[s.c % imgs.length]];
    if (img && img.naturalWidth) { const f = W7.PICK_GROUND / Math.max(img.naturalWidth, img.naturalHeight); ctx.drawImage(img, x - img.naturalWidth * f / 2, s.y + 2 - img.naturalHeight * f, img.naturalWidth * f, img.naturalHeight * f); }   // Glen's stones, lying in the streambed as they are
    else drawStoneShape(x, s.y - 8, 11, s.look, s.c);
    if (near > 0.75 && Math.abs(s.x - d.x) < W7.PICK_REACH && Math.abs(s.y - d.y) < 40) {
      ctx.save(); ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.fillStyle = "#fff6d8";
      const t = keyText("Down: look at it"); ctx.strokeText(t, x, s.y - 40); ctx.fillText(t, x, s.y - 40); ctx.restore();
    }
  }
}
function drawCloseup() {   // over everything: the stone in his hand, big
  if (!closeup.open) return;
  const s = closeup.s, L = PICK_LOOKS[s.look], k = Math.min(1, closeup.t / 0.25);
  ctx.save();
  ctx.fillStyle = `rgba(10,8,6,${0.55 * k})`; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2 - 50, R = 150 * (0.85 + 0.15 * k);
  const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, R * 1.6); g.addColorStop(0, `rgba(255,236,190,${0.35 * k})`); g.addColorStop(1, "rgba(255,220,160,0)");
  ctx.fillStyle = g; ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);
  ctx.globalAlpha = k;
  const imgs = PICK_IMG[s.look], img = imgs && ITEM[imgs[s.c % imgs.length]];
  if (img && img.naturalWidth) { const f = R * 1.55 / Math.max(img.naturalWidth, img.naturalHeight); ctx.drawImage(img, cx - img.naturalWidth * f / 2, cy - img.naturalHeight * f / 2, img.naturalWidth * f, img.naturalHeight * f); }
  else drawStoneShape(cx, cy, R * 0.62, s.look, s.c);
  ctx.textAlign = "center"; ctx.font = "italic 26px Georgia, serif"; ctx.fillStyle = "#ffe9b8";
  ctx.fillText(L.say, cx, cy + R * 0.8 + 20);
  if (closeup.crawl && s.under) { ctx.font = "bold 22px sans-serif"; ctx.fillStyle = "#ffb08a"; ctx.fillText("Something moved underneath it...", cx, cy - R * 0.85); }
  ctx.font = "bold 20px sans-serif"; ctx.fillStyle = "#fff";
  ctx.fillText(keyText(`A: keep it      B: put it back      (${bagCount()} of ${W7.BAG} in the bag)`), cx, cy + R * 0.8 + 62);
  ctx.restore();
}
function stonesBlocking() {   // main.js finish: not without five smooth stones
  if (!pickStones.length || bagCount() >= W7.BAG) return null;
  return `Not yet: ${bagCount()} of ${W7.BAG} smooth stones. Go back and look closer: Down beside a stone lifts it.`;
}
if (pickStones.length) {
  lostThingsTally = function () { return { found: bagCount(), total: W7.BAG, things: "smooth stones", icon: "stone" }; };
}

// --- the Stones of the Name
const NAME_LETTERS = { aleph: "\u{10900}", bet: "\u{10901}", gimel: "\u{10902}", dalet: "\u{10903}", he: "\u{10904}", waw: "\u{10905}", yod: "\u{10909}", kaf: "\u{1090A}", lamed: "\u{1090B}", mem: "\u{1090C}", shin: "\u{10914}" };
const NAME_CROSS = {   // (Glen) no letters on the boulder: reaching it, the riddle comes up over the bridge (like "Only the penitent man shall pass"), and the answer's in the Journal
  1: { word: ["dalet", "waw", "dalet"], riddle: ["Only the Beloved", "crosses sure-footed."],
       think: "The Beloved...? I've heard that somewhere. I wrote it in my Journal.",
       done: "Dalet, Waw, Dalet. David: beloved. My own name!" },
  2: { word: ["yod", "he", "waw", "he"], riddle: ["Walk in the Name of the LORD,", "as the fathers wrote it."],
       think: "The Name of the LORD. The old letters are in my Journal.",
       done: "" },
};
const NAME_NAMES = { dalet: "Dalet", waw: "Waw", he: "He", yod: "Yod" };
// (Glen) a letter David hasn't found (Worlds 4 and 5) isn't carved on any stone: those stones are blank, and blank stones
// give way, so without it there's no way across. Go back and find it, and it's there on the stones.
let namesFound = null;   // read on first use, once journal.js (lettersFound) has loaded: at this file's load it hasn't, and every stone came out blank
const nameStones = setPieces.filter(p => p.kind === "namestone").map(p => ({ c: p.c, r: p.r, cross: p.cross, k: p.k, letter: p.letter, right: !!p.right, state: "whole", t: 0, cracked: false,
                                                                             get blank() {
                                                                               if (!namesFound) namesFound = typeof lettersFound === "function" ? lettersFound() : [];
                                                                               return ["dalet", "waw", "he", "yod"].includes(this.letter) && !namesFound.includes(this.letter);
                                                                             } }));
for (const s of nameStones) for (let c = s.c; c < s.c + W7.NAME_W; c++) specialPlat.add(c + "," + s.r);   // the stone is the picture: no rock ledge drawn over it (and its letter)
const nameClues = setPieces.filter(p => p.kind === "nameclue").map(p => ({ x: p.x, y: p.y, cross: p.cross, told: false }));
const nameRun = { lock: null, fall: null, done: {}, saidRight: false };
let ohWaitDone = false;
try { ohWaitDone = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").nameOhWait; } catch (e) {}
const w7Busy = () => !!nameRun.lock;   // main.js: on a wrong stone, no jumping off it
const nameTop = s => s.r * T;
function setNamePlat(s, on) { for (let c = s.c; c < s.c + W7.NAME_W; c++) oneway[s.r][c] = on; }
function crossBank(cross) {   // where the near-miss puts him back: the near end of that crossing's causeway
  const first = nameStones.filter(s => s.cross === cross).reduce((a, s) => Math.min(a, s.c), 1e9);
  return { x: (first - 3.5) * T, y: 15 * T };
}
function updateNameStones(dt) {
  if (!nameStones.length) return;
  const d = david;
  for (const s of nameStones) s.t += dt;
  // he's falling in with the pieces (a life)
  if (nameRun.fall) {
    if (d.deadT > 0) { nameRun.fall.vy = Math.min(1200, nameRun.fall.vy + TUNE.GRAVITY * dt); d.y += nameRun.fall.vy * dt; d.state = "jump"; }
    else nameRun.fall = null;
    return;
  }
  if (nameRun.lock) {
    const L = nameRun.lock; L.t += dt; d.vx = 0;
    if (L.t >= W7.NAME_LOCK) {
      nameRun.lock = null;
      if (L.ohWait) {   // the scripted near-miss: he scrambles back to the bank
        L.s.state = "whole"; L.s.cracked = true; ohWaitDone = true;
        try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.nameOhWait = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
        const b = crossBank(L.s.cross); d.x = b.x; d.y = b.y; d.vy = 0; d.facing = 1; setState("idle");
        lamb.x = d.x - 50; lamb.y = d.y; trail.length = 0;
        sayLine("David", "Oh wait. Our fathers read from the right. Start at the end: He, Waw, He, Yod.");
      } else {          // it gives way: down he goes with the pieces
        if (L.order || L.blank) L.s.state = "whole";   // (the right letter stays, for when he comes back in order; a blank one stays blank)
        else { L.s.state = "gone"; L.s.t = 0; setNamePlat(L.s, false); }
        sfx("fall_pit", undefined, 0.7);
        d.lives--; d.hearts = 0; d.deadT = W7.NAME_SINK; nameRun.fall = { vy: 120 };
        if (L.blank) blankNote(L.s.letter);
        else toast(L.order ? "Out of order! The letters have to be stepped one by one." : d.lives > 0 ? `The stone gave way! Wrong letter. (${d.lives} ${d.lives === 1 ? "life" : "lives"} left)` : "The stone gave way! Out of lives: back to the start of the stage.");
      }
    }
    return;
  }
  if (!d.onGround || d.deadT > 0) return;
  // jumped clean past a letter onto the far bank: the Name has to be stepped out, every letter in order
  for (const cr of [1, 2]) {
    const st = nameStones.filter(q => q.cross === cr); if (!st.length || nameRun.done[cr]) continue;
    const far = Math.max(...st.map(q => q.c)) + W7.NAME_W;
    if (d.x > far * T && d.x < (far + 6) * T && d.y <= 15 * T + 2) {
      const b = crossBank(cr); d.x = b.x; d.y = b.y; d.vx = d.vy = 0; d.facing = 1; setState("idle"); lamb.x = d.x - 50; lamb.y = d.y; trail.length = 0;
      sayLine("David", "I jumped past a letter. The stones have to be stepped one by one, every letter, in order.");
      return;
    }
  }
  const s = nameStones.find(q => q.state === "whole" && Math.abs(d.y - nameTop(q)) < 3 && d.x > q.c * T - 4 && d.x < (q.c + W7.NAME_W) * T + 4);
  if (!s) return;
  const before = nameStones.find(q => q.cross === s.cross && q.k === s.k - 1 && q.right);
  const order = s.right && before && before.state !== "lit";   // the right letter, but out of order: it won't hold either
  if (s.right && !order && !s.blank) {
    s.state = "lit"; s.t = 0; chime(2 + s.k * 2); sfx("stone_hit", s.c * T, 0.35, 1.4);
    for (let k = 0; k < 14; k++) bits.push({ x: (s.c + W7.NAME_W / 2) * T, y: nameTop(s), vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 360, life: 0.6, color: "#ffe9a0" });
    if (s.cross === 2 && s.k === 0 && !ohWaitDone && !nameRun.saidRight) { nameRun.saidRight = true; ohWaitDone = true; sayLine("David", "From the right, as the fathers wrote it. He first."); }
    const all = nameStones.filter(q => q.cross === s.cross && q.right);
    if (all.every(q => q.state === "lit") && !nameRun.done[s.cross]) {
      nameRun.done[s.cross] = true;
      setTimeout(() => { chime(7); setTimeout(() => chime(9), 160); setTimeout(() => chime(12), 320); }, 300);
      if (s.cross === 1) setTimeout(() => sayLine("David", NAME_CROSS[1].done), 700);
      else setTimeout(() => { d.vx = 0; hushLoops(); if (typeof Journal !== "undefined" && Journal.openNote) Journal.openNote(nameNote()); }, 1400);
    }
    return;
  }
  // a wrong letter: the jump locks, it cracks
  s.state = "crack"; s.t = 0; sfx("stone_hit", s.c * T, 0.6, 0.6);
  nameRun.lock = { s, t: 0, ohWait: s.cross === 2 && s.k === 0 && !ohWaitDone && !s.blank, order: order && !s.blank, blank: s.right && s.blank };
  d.vx = 0; d.jumpBuf = 0; setState("slip");
}
function blankNote(letter) {   // he stepped where a letter should be, and it isn't carved: say which one, and where it might be
  const L = typeof LETTER_PAGE !== "undefined" ? LETTER_PAGE.find(q => q.k === letter) : null;
  toast(david.lives > 0 ? `Nothing carved on that stone, and it gave way. (${david.lives} ${david.lives === 1 ? "life" : "lives"} left)` : "Nothing carved on that stone. Out of lives: back to the start of the stage.");
  if (!nameRun.blankSaid) { nameRun.blankSaid = true; setTimeout(() => sayLine("David", `The ${NAME_NAMES[letter]} should be there, and it isn't. I never found it. ` + (L ? `Maybe it's still ${L.where} ` : "") + "I'll have to go back for it. (From the map: Worlds 4 and 5.)"), 1500); }
}
function resetNameStones() {
  for (const s of nameStones) { s.state = "whole"; s.t = 0; setNamePlat(s, true); }
  nameRun.done = {}; nameRun.lock = null; nameRun.fall = null;
}
if (nameStones.length) {   // out of lives: the stones are back as they were
  const respawn7 = respawn;
  respawn = function () { const out = david.lives <= 0; nameRun.lock = null; nameRun.fall = null; respawn7(); if (out) resetNameStones(); };
}
function nameNote() {
  return {
    left: [{ at: 5, size: "entry", segs: [{ text: "I crossed the deep pool on the Name.", at: 5 }] },
           { at: 5, size: "glyph", segs: [{ text: NAME_LETTERS.he + NAME_LETTERS.waw + NAME_LETTERS.he + NAME_LETTERS.yod, at: 5, glyph: true }] },
           { at: 5, size: "entry", segs: [{ text: "Yod, He, Waw, He, written from the right. I nearly started at the wrong end.", at: 5 }] }],
    right: [{ at: 5, size: "entry", segs: [{ text: "The name God told Moses at the burning bush (Exodus 3:15).", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "When an English Bible prints \"the LORD\" in small capitals, these four letters are what stands behind it.", at: 5 }] },
            { at: 5, size: "small", segs: [{ text: "\"Some trust in chariots, and some in horses, but we trust the name of the LORD our God.\" (Psalm 20:7)", at: 5 }] }],
  };
}
function nameClueNear() { const d = david; return nameClues.find(q => Math.abs(q.x - d.x) < 90 && Math.abs(q.y - d.y) < 60) || null; }
function w7Select() {   // main.js: Select at the carving opens the Journal at the old letters
  const q = nameClueNear(); if (!q || typeof Journal === "undefined" || !Journal.openNote || typeof lettersSpread !== "function") return false;
  david.vx = 0; nameVision.start(q.cross, false);   // the still of Glen's clip, with the riddle (Select again: the Journal)
  return true;
}
function nameRiddleAt() { return nameRun.riddle || 0; }   // journal.js: the last riddle he saw (the answer is only in the Journal)
function updateNameClues() {   // reaching the boulder: the bridge, and the riddle (the first time at the first one, Glen's clip first)
  const q = nameClueNear(); if (!q || q.told || david.deadT > 0) return;
  q.told = true;
  nameVision.start(q.cross, q.cross === 1 && !nameVisionSeen);
}
function drawNameStones(camX) {
  const sc = W7.NAME_W * T / 222;
  for (const s of nameStones) {
    const cx = (s.c + W7.NAME_W / 2) * T - camX, top = nameTop(s); if (cx < -120 || cx > W + 120) continue;
    if (s.state === "gone") { if (s.t < 0.6) drawSprite("name_stone_crumble", Math.min(4, 3 + Math.floor(s.t / 0.3)), cx, top + 95 * sc, 1, sc / SCALE); continue; }
    if (s.state === "crack") drawSprite("name_stone_crumble", Math.min(2, Math.floor(s.t / W7.NAME_LOCK * 3)), cx, top + 95 * sc, 1, sc / SCALE);
    else if (s.state === "lit") { const g = W7.NAME_W * T / 207; drawItem("name_stone_glow", cx, top + 95 * sc, g); }
    else if (s.cracked) drawSprite("name_stone_crumble", 1, cx, top + 95 * sc, 1, sc / SCALE);
    else drawItem("name_stone_plain", cx, top + 95 * sc, sc);
    // the letter on its face: every letter glows the same, so only reading tells them apart
    const L = ITEM["name_letter_" + s.letter]; if (!L || !L.naturalWidth || s.blank) continue;   // a letter he never found: a blank face
    const fh = 95 * sc, lh = fh * W7.NAME_LETTER[0], ls = lh / 140, a = 1, ly = top + fh * W7.NAME_LETTER[1] + lh / 2;   // on the stone's front face, never hanging off it (Glen)
    if (s.state === "lit") { ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(cx, top + 26, 2, cx, top + 26, 40); g.addColorStop(0, "rgba(255,230,140,0.55)"); g.addColorStop(1, "rgba(255,210,100,0)"); ctx.fillStyle = g; ctx.fillRect(cx - 40, top - 14, 80, 80); ctx.restore(); }
    ctx.save(); ctx.shadowColor = "rgba(255,140,20,0.9)"; ctx.shadowBlur = 12;   // burning gold, like the old letters in Worlds 4-5
    drawItem("name_letter_" + s.letter, cx, ly, ls, a);
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = "lighter"; drawItem("name_letter_" + s.letter, cx, ly, ls, 0.3); ctx.restore();
  }
}
function drawNameClues(camX) {
  const found = typeof lettersFound === "function" ? lettersFound() : [];
  for (const q of nameClues) {
    const x = q.x - camX; if (x < -150 || x > W + 150) continue;
    drawItem("boulder_grey", x, q.y + 8, 0.34);
    const n = W7.CLUE_ARC[2], R = W7.CLUE_ARC[1], step = W7.CLUE_ARC[3] / R, oy = q.y - W7.CLUE_ARC[0] + R;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 2.4;
    for (let i = 0; i < n; i++) {   // (Glen) worn scratches along the curve of the boulder, like writing too old to read
      const ang = ((n - 1) / 2 - i) * step, h = k => { const v = Math.sin((i + 1) * 12.9898 + k * 78.233 + q.cross * 3.1) * 43758.5; return v - Math.floor(v); };
      ctx.save(); ctx.translate(x + Math.sin(ang) * R, oy - Math.cos(ang) * R); ctx.rotate(ang);
      const pts = []; for (let k = 0; k < 4; k++) pts.push([(h(k) - 0.5) * 9, (k / 3 - 0.5) * 12 + (h(k + 9) - 0.5) * 3]);
      for (const [dy, col] of [[1.5, "rgba(255,250,235,0.45)"], [0, "rgba(30,24,20,0.95)"]]) {
        ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1] + dy); for (const [px, py] of pts.slice(1)) ctx.lineTo(px, py + dy); ctx.stroke();
        if (h(20) > 0.45) { ctx.beginPath(); ctx.moveTo(-4, (h(21) - 0.5) * 8 + dy); ctx.lineTo(4, (h(22) - 0.5) * 8 + dy); ctx.stroke(); }
      }
      ctx.restore();
    }
    ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
    if (nameClueNear() === q && !Journal.active) {
      ctx.font = "bold 16px sans-serif"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.fillStyle = "#fff6d8";
      const t = keyText("Select: the riddle again"); ctx.strokeText(t, x, q.y - 128); ctx.fillText(t, x, q.y - 128);
    }
    ctx.restore();
  }
}
// the causeways at each end of a crossing: Glen's sandstone bridge blocks over solid tiles that aren't drawn (material 6)
const causeways = setPieces.filter(p => p.kind === "causeway");
function drawCauseways(camX) {
  for (const p of causeways) {
    const x0 = p.c * T - camX, w = p.w * T; if (x0 > W + 50 || x0 + w < -50) continue;
    const img = ITEM.bridge_l_b; if (!img || !img.naturalWidth) continue;
    ctx.drawImage(img, x0 - 4, p.r * T - 6, w + 8, (GR - p.r) * T + 14);
  }
}
function updateStones73(dt) { updateNameStones(dt); updateNameClues(); for (const s of pickStones) s.t += dt; }
function drawStones73(camX) {
  if (typeof drawSpikePits === "function" && setPieces.some(p => p.kind === "spikes")) drawSpikePits(camX);
  drawCauseways(camX); drawNameClues(camX); drawNameStones(camX); drawPickStones(camX);
}

// ---------------------------------------------------------------------------
// 7-4 The Giant's Shadow (DESIGN 7-4): out across the open valley floor toward the Philistine line. No music
// (STAGE_INFO.quiet): a slow drum, the wind, the armies on the hills, the giant's footsteps getting louder. The screen
// darkens from the right as his shadow grows. setPiece("eliab7", c, r) Eliab far up the Israelite slope, arms crossed.
// BOSS: the Shield-Bearer (17:41), setPiece("shieldbearer", c): the arena is 35 columns from c (one screen). Goliath
// stands behind him the whole fight and never steps in. Nobody is killed: the shield falls, the man backs away.
//   Phase 1, the wall: he walks forward behind a shield as big as a door; stones bounce off it. He lifts it to slam it
//     down (tier-1 counsel, Tobi: the bronze rim flashes) and the slam sends a shockwave along the ground: be in the
//     air. While he heaves it up again he can't turn: get over him and hit his back. 3 hits.
//   Phase 2, the shove: he charges, shield first. Roll under its edge, or be up high. Then he peeks over the top and
//     the shield tips: a stone to its top edge knocks it sideways. 3 times.
//   Phase 3: he peeks and it tips again: one charged stone to the edge knocks it out of his hands.
//   Tier 2 (after a fall; Shammah from the slope): the slam tell and the tilt last longer, +1 heart.
// Stand-in art: Glen's Philistine (phil_run / phil_charge) drawn bigger, with the door-sized shield drawn in code
// (ART_PROMPTS.md "the shield-bearer"). Goliath: goliath_yell, facing left.
// ---------------------------------------------------------------------------
Object.assign(W7, {
  SB_SIZE: 2.0,          // the shield-bearer, x a Philistine's size: a huge man
  SB_WALK: 46,           // px/s, behind the shield
  SB_EVERY: 2.6,         // seconds walking between slams
  SB_TELL: 0.9,          // seconds lifting the shield before the slam (tier 2: SB_TELL2)
  SB_TELL2: 1.4,
  SB_RECOVER: 2.2,       // seconds heaving it back up after a slam (he can't turn: the window to get behind him)
  SB_TURN: 0.7,          // seconds to turn round once David's behind him
  SB_WAVE: 560,          // px/s, the shockwave along the ground
  SB_WAVE_T: 1.0,
  SB_CHARGE: 340,        // px/s, the shove
  SB_PEEK: 1.3,          // seconds peeking over the top, the shield tipped (tier 2: SB_PEEK2); phase 3 x1.5
  SB_PEEK2: 2.0,
  SB_HITS: 3,            // back hits (phase 1), edge hits (phase 2)
  SHIELD_W: 74, SHIELD_H: 168,
  GOLIATH_SIZE: 1.55,
  SB_SPR: 1.9,           // Glen's shield-bearer sheets (sb_push / sb_drop / sb_run), x David's scale
  SB_SHIELD_AT: [164, 266, 0.94],   // sb_shield (the dropped shield, alone): its bottom-centre in sb_drop's frame px, and its size there
  SB_EDGE: [70, 86],     // while he peeks, a stone counts on the shield's edge from this far above its top down to this high off the ground (px)
  ELIAB_AT: 0.33,        // 7-4: where Eliab stands on the far hills, as a fraction of the screen, when David reaches his line
  SB_CHARGE_SIZE: 1.08,  // Glen's sb_charge sheet next to sb_push (1 = same scale)
  SB_VOICE: 0.8,         // his battle cry's pitch and speed (1 = the other Philistines; lower = deeper and slower)
  SB_FRONT: 48,          // px from his feet to the shield's face
  DRUM_EVERY: 1.7,       // seconds between the slow drum's beats on the walk out
});
const sbPiece = setPieces.find(p => p.kind === "shieldbearer") || null;
const sb = sbPiece ? { a0: sbPiece.c * T, a1: (sbPiece.c + 35) * T, on: false, beaten: false } : null;
let w7Counsel2 = false;
function resetShieldBearer() {
  Object.assign(sb, { on: false, phase: 1, state: "walk", t: 0, x: sb.a1 - 9 * T, y: GR * T, dir: -1, hits: 0, tips: 0, waves: [], flash: 0, lift: 0, tilt: 0, behindT: 0, sinceSlam: 0, gx: sb.a1 - 3 * T, laugh: 0 });
}
if (sb) resetShieldBearer();
const shieldFight = () => !!(sb && sb.on && !sb.beaten && david.deadT <= 0);
function shieldCam() { return sb && (sb.on || sb.beaten) ? [sb.a0, sb.a0] : null; }   // caves.js camLimits: the camera holds on the arena
function shieldBlocking() { return sb && !sb.beaten ? "The shield-bearer stands in the way." : null; }
const sbTell = () => w7Counsel2 ? W7.SB_TELL2 : W7.SB_TELL;
const sbPeek = () => (w7Counsel2 ? W7.SB_PEEK2 : W7.SB_PEEK) * (sb.phase === 3 ? 1.5 : 1);
const tobiWarned = () => talks.some(k => k.done && k.who === "Tobi");
function sbSay(line, clip) { sayLine("Goliath", line); if (clip) goliathChain([clip], 0.75); }
function startShieldBearer() {
  sb.on = true; sb.t = 0; sb.state = "walk";
  sfx("war_horn", undefined, 0.5, 0.8);
  sbSay("Am I a dog, that you come to me with sticks? (1 Samuel 17:43)", "hakelev");
  setTimeout(() => toast("His shield-bearer comes on ahead of him, behind a shield as big as a door. Stones just bounce off it."), 600);
}
function sbHurt(fromX) { if (david.inv <= 0 && david.deadT <= 0) hurtDavid(fromX); }
function sbSetState(s) { sb.state = s; sb.t = 0; }
function updateShieldBearer(dt) {
  if (!sb) return;
  const d = david;
  if (!sb.on && !sb.beaten && d.x > sb.a0 + 3 * T && d.deadT <= 0) startShieldBearer();
  if (!sb.on) return;
  if (d.deadT > 0 && !sb.beaten) {   // David fell: the fight resets; Shammah's counsel from the slope
    resetShieldBearer();
    if (!w7Counsel2) { w7Counsel2 = true; setTimeout(() => {
      sayLine("Shammah", "Come here. Tell me what happened. ... Count when he lifts that shield: you've got longer than you think. And when he peeks over the top, it tips. Hit the edge.");
      david.hearts += 1; }, 2200); }
    return;
  }
  if (sb.beaten) { updateShieldFall(dt); return; }
  if (!sb.beaten) d.x = Math.max(sb.a0 + 20, Math.min(sb.a1 - 20, d.x));
  sb.t += dt; sb.flash = Math.max(0, sb.flash - dt); sb.laugh = Math.max(0, sb.laugh - dt);
  // the shockwaves
  for (let i = sb.waves.length - 1; i >= 0; i--) {
    const w = sb.waves[i]; w.t += dt; w.x += w.dir * W7.SB_WAVE * dt;
    if (w.t > W7.SB_WAVE_T) { sb.waves.splice(i, 1); continue; }
    if (d.onGround && Math.abs(d.x - w.x) < 26 && Math.abs(d.y - GR * T) < 8) { sbHurt(w.x - w.dir * 40); sb.waves.splice(i, 1); }
  }
  const toD = Math.sign(d.x - sb.x) || sb.dir, front = sb.x + sb.dir * W7.SB_FRONT;
  // the shield is a wall in front of him (on the ground): David can't walk through it
  const shieldUp = sb.state !== "peek";
  if (shieldUp && d.y > GR * T - W7.SHIELD_H + 10 && Math.abs(d.x - front) < 28 && toD === sb.dir && d.state !== "roll") {
    d.x = front + sb.dir * 28; d.vx = 0;
  }
  if (sb.phase === 1) {
    if (sb.state === "walk") {
      // he turns to face David (slowly) if David gets round behind him
      if (toD !== sb.dir) { sb.behindT += dt; if (sb.behindT > W7.SB_TURN) { sb.dir = toD; sb.behindT = 0; } } else sb.behindT = 0;
      if (Math.abs(d.x - sb.x) > 3 * T) sb.x += sb.dir * W7.SB_WALK * dt;
      sb.x = Math.max(sb.a0 + 3 * T, Math.min(sb.a1 - 5 * T, sb.x));
      sb.sinceSlam += dt;
      if (sb.sinceSlam > W7.SB_EVERY && toD === sb.dir) { sbSetState("lift"); sb.sinceSlam = 0; }
    } else if (sb.state === "lift") {
      sb.lift = Math.min(1, sb.t / sbTell());
      if (sb.t >= sbTell()) { sbSetState("slam"); }
    } else if (sb.state === "slam") {
      sb.lift = Math.max(0, 1 - sb.t / 0.12);
      if (sb.t >= 0.12 && !sb.slammed) {
        sb.slammed = true; thud(0.9); if (typeof w2Shake !== "undefined") w2Shake.v = 1;
        sb.waves.push({ x: front, dir: -1, t: 0 }, { x: front, dir: 1, t: 0 });
      }
      if (sb.t > 0.3) { sb.slammed = false; sbSetState("recover"); }
    } else if (sb.state === "recover") {   // heaving it back up: he can't turn now
      sb.lift = 0.15 * Math.sin(Math.min(1, sb.t / W7.SB_RECOVER) * Math.PI);
      if (sb.t >= W7.SB_RECOVER) sbSetState("walk");
    }
  } else {
    if (sb.state === "ready") {   // turns to face David, a breath, then the charge
      sb.dir = toD;
      if (sb.t > 0.9) { sbSetState("charge"); sb.chargeTo = Math.max(sb.a0 + 2 * T, Math.min(sb.a1 - 4 * T, d.x + sb.dir * 3 * T)); sfx(Math.random() < 0.5 ? "phil_hedad" : "phil_hedad_2", sb.x, 0.7, W7.SB_VOICE * (0.97 + Math.random() * 0.06)); }   // "Hedad!", deeper than the other Philistines (Glen)
    } else if (sb.state === "charge") {
      sb.x += sb.dir * W7.SB_CHARGE * dt;
      const over = d.y < GR * T - W7.SHIELD_H - 10;   // up high: over the top of it
      if (Math.abs(d.x - front) < 30 && !over && d.state !== "roll") { sbHurt(sb.x); d.vx = sb.dir * 420; }
      if ((sb.dir > 0 ? sb.x >= sb.chargeTo : sb.x <= sb.chargeTo) || sb.x <= sb.a0 + 2 * T || sb.x >= sb.a1 - 4 * T) { sbSetState("peek"); sb.dir = Math.sign(d.x - sb.x) || sb.dir; }
    } else if (sb.state === "peek") {   // he looks over the top for David: the shield tips
      sb.tilt = Math.min(1, sb.t / 0.25);
      if (sb.t > sbPeek()) { sb.tilt = 0; sbSetState("ready"); }
    } else if (sb.state === "knock") {   // knocked sideways: it wobbles back
      sb.tilt = Math.max(0, 1 - sb.t / 0.8) * 1.6;
      if (sb.t > 1.0) { sb.tilt = 0; sbSetState("ready"); }
    }
  }
}
function stoneHitsShield(s) {
  if (!sb || !sb.on || sb.beaten) return false;
  const front = sb.x + sb.dir * W7.SB_FRONT, top = GR * T - W7.SHIELD_H - sb.lift * 50;
  const fromBehind = Math.sign(s.vx) === sb.dir;   // flying the way he faces: it's coming at his back
  const body = Math.abs(s.x - sb.x) < 34 && s.y > sb.y - 230 && s.y < sb.y;
  if (sb.phase === 1 && fromBehind && body) {
    sb.hits++; sb.flash = 0.3; stoneHit(s); sfx("lion_hit", sb.x, 0.45, 1.3);
    if (sb.hits === 1) toast("Right in the back! He can't turn while he heaves that shield up.");
    if (sb.hits >= W7.SB_HITS) {
      sb.phase = 2; sbSetState("ready"); sb.hits = 0; sb.lift = 0; sb.waves = [];
      sb.laugh = 2.5; sfx("taunting_yells", undefined, 0.55, 0.7);
      setTimeout(() => toast("He charges, shield first! Roll under its edge, or get up high. When he stops to peek over the top, throw high at the top edge (Up + B, or jump and throw)."), 400);
    }
    return true;
  }
  // the shield
  // tipped back while he peeks, its top edge is the target: anything thrown high (Up + B, or from a jump) catches it,
  // even skimming over the top (Glen couldn't hit the old thin strip: a flat throw passes under it, and Up + B only hit it from one distance)
  const peekHit = sb.state === "peek" && Math.abs(s.x - front) < W7.SHIELD_W / 2 + 14 && s.y > top - W7.SB_EDGE[0] && s.y < GR * T - W7.SB_EDGE[1];
  const onShield = peekHit || (Math.abs(s.x - front) < W7.SHIELD_W / 2 + 10 && s.y > top - 10 && s.y < GR * T);
  if (!onShield) return false;
  const edge = peekHit;
  if (sb.state === "peek" && edge) {
    if (sb.phase === 2) {
      sb.tips++; sbSetState("knock"); sfx("stone_hit", sb.x, 0.7, 0.8); stoneHit(s);
      if (sb.tips === 1) toast("The edge! The shield swings and he staggers.");
      if (sb.tips >= W7.SB_HITS) {
        sb.phase = 3; sb.tips = 0;
        sbSay("Come to me, and I will give your flesh to the birds of the sky, and to the animals of the field. (1 Samuel 17:44)", "lecha_elai");
        setTimeout(() => toast("The shield's loose in his grip now. When it tips, one charged stone to its edge!"), 900);
      }
      return true;
    }
    if (sb.phase === 3) {
      if (s.charged || s.power) { stoneHit(s); shieldFalls(); return true; }
      if (!W7.tapTold) { W7.tapTold = true; toast("It rocks, but he holds on. Hold B: a charged stone!"); }
    }
  }
  stoneHit(s, 0.5); sfx("stone_hit", s.x, 0.35, 1.5);   // just bounces off the bronze
  if (!W7.bounceTold && sb.phase === 1) { W7.bounceTold = true; toast("It just bounces off the shield. Get round behind him!"); }
  return true;
}
function shieldFalls() {
  sb.beaten = true; sbSetState("fall"); sb.tilt = 0; sb.waves = []; sb.shieldX = sb.x + sb.dir * 5; sb.dropX = sb.x; sb.dropY = sb.y;   // (where it lies in the last frame of sb_drop)
  sfx("final_stone", sb.x, 0.8); setTimeout(() => { thud(1); if (typeof w2Shake !== "undefined") w2Shake.v = 1.2; sfx("stone_hit", sb.x, 0.9, 0.5); }, 600);
}
function updateShieldFall(dt) {
  sb.t += dt;
  if (sb.state === "fall" && sb.t > 1.6) { sbSetState("stare"); }
  else if (sb.state === "stare" && sb.t > 1.4) { sbSetState("back"); sb.laugh = 4; sfx("taunting_yells", undefined, 0.7, 0.6); toast("He stares at his shield in the dust, looks back at the giant, and backs away. The giant laughs at him."); }
  else if (sb.state === "back") { if (SPR.sb_run) sb.x += 330 * dt; else if (sb.x < sb.gx - 3 * T) sb.x += 60 * dt; if (sb.t > 4.5 && !sb.cleared) { sb.cleared = true; clear74(); } }
}
function clear74() {   // the end of 7-4: no sheepfold out here. Straight to the end of World 7, then the Journal.
  hushLoops(true); sfx(SFX.ending_jingle_levels && !SFX.ending_jingle_levels.missing ? "ending_jingle_levels" : "stage_clear", undefined, 0.9);
  const one = line.some(sh => sh.one);
  saveStones(LEVEL_STAGE, specials.filter(o => o.taken).length);
  stageCleared(LEVEL_STAGE, { sheep: foundCount(), total: lostCount(), one, stones: specials.filter(o => o.taken).length, olives: david.olives, lampOil: david.lampOil, gathered: david.gathered });
  setTimeout(() => w7ending.start(() => Journal.open({ world: WORLD, stage: STAGE_NUM, onClose: () => backToMap() })), 2500);
}
function drawDoorShield(x, y, dir, lift, tilt, flash, alpha = 1) {   // a shield as big as a door: bronze, studded, a rim that flashes on the tell
  const w = W7.SHIELD_W, h = W7.SHIELD_H;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.translate(x, y - lift * 50); ctx.rotate(-dir * tilt * 0.38);   // tips back toward him (its top edge away from David)
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  g.addColorStop(0, "#6e4a1e"); g.addColorStop(0.45, "#b8873e"); g.addColorStop(0.6, "#d6a858"); g.addColorStop(1, "#7a5222");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-w / 2, -h, w, h, 12); ctx.fill();
  ctx.lineWidth = 6; ctx.strokeStyle = flash ? `rgba(255,236,140,${0.6 + 0.4 * Math.sin(performance.now() / 50)})` : "#4a3010"; ctx.stroke();
  ctx.fillStyle = "rgba(60,36,10,0.55)"; for (let r = 0; r < 4; r++) for (const c of [-1, 1]) { ctx.beginPath(); ctx.arc(c * w * 0.3, -h * (0.15 + r * 0.23), 3.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = "rgba(255,240,200,0.25)"; ctx.fillRect(-w * 0.08, -h + 10, w * 0.12, h - 20);
  ctx.restore();
}
function drawFallenShield(sx, dir) {
  ctx.save(); ctx.fillStyle = "#9a7038"; ctx.strokeStyle = "#4a3010"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(dir > 0 ? sx : sx - W7.SHIELD_H, GR * T - 14, W7.SHIELD_H, 16, 6); ctx.fill(); ctx.stroke(); ctx.restore();
}
function drawShieldBearer(camX) {
  if (!sb) return;
  const now = performance.now() / 1000;
  // Goliath, behind him the whole fight (and through the walk out, waiting)
  const gx = sb.gx - camX;
  if (gx > -300 && gx < W + 300 && SPR.goliath_yell) {
    const yell = sb.laugh > 0 || (dialog.t > 0 && dialog.who === "Goliath");
    drawSprite("goliath_yell", yell ? frameOf("goliath_yell", now) : 0, gx, GR * T, -1, W7.GOLIATH_SIZE);
  }
  const x = sb.x - camX; if (x < -200 || x > W + 200) return;
  const fl = sb.flash > 0 ? "brightness(2)" : "";
  if (SPR.sb_push) {   // Glen's shield-bearer (world7/shield_bearer): pushing behind the shield, the shield dropped, running
    const k = W7.SB_SPR, warn = sb.state === "lift" && (tobiWarned() || w7Counsel2);
    if (sb.beaten && sb.state === "back") {   // the shield stays where it fell (Glen's flat shield when it comes)
      const sx = sb.shieldX - camX;
      if (ITEM.sb_shield && ITEM.sb_shield.naturalWidth) {   // Glen's shield on its own, laid exactly over the one in sb_drop's last frame
        const sc = SCALE * W7.SB_SPR * (TUNE.SPRITE_SIZE.sb_drop || 1), [fx, fy, fs] = W7.SB_SHIELD_AT;   // (fitted against that frame)
        ctx.save(); ctx.translate(Math.round(sb.dropX - camX), Math.round(sb.dropY)); ctx.scale(sb.dir, 1);
        drawItem("sb_shield", (fx - SPR.sb_drop.ax) * sc, (fy - SPR.sb_drop.ay) * sc, fs * sc); ctx.restore();
      }
      else drawFallenShield(sx, sb.dir);
    }
    if (sb.state === "fall" || sb.state === "stare") drawSprite("sb_drop", frameOf("sb_drop", sb.state === "fall" ? sb.t : 9), x, sb.y, sb.dir, k, 1, fl);
    else if (sb.state === "back") drawSprite("sb_run", frameOf("sb_run", sb.t), x, sb.y, 1, k, Math.max(0, 1 - Math.max(0, sb.t - 2.5) / 1.5));   // he runs, back to his own lines
    else if (sb.state === "peek") drawSprite("sb_drop", Math.min(2, Math.floor(sb.t / 0.08)), x, sb.y, sb.dir, k, 1, fl);   // the shield tips: he looks over it
    else if (sb.state === "knock") drawSprite("sb_drop", sb.t < 0.5 ? 3 : 1, x, sb.y, sb.dir, k, 1, fl);
    else if (sb.state === "charge" && SPR.sb_charge) drawSprite("sb_charge", frameOf("sb_charge", sb.t), x, sb.y, sb.dir, k * W7.SB_CHARGE_SIZE, 1, fl);   // Glen's charge: running, shield first
    else {
      const sp = sb.state === "charge" ? 2.2 : sb.state === "walk" || sb.state === "ready" ? 0.8 : 0.25;
      ctx.save(); ctx.translate(x, sb.y - sb.lift * 46); ctx.rotate(-sb.dir * sb.lift * 0.06);
      drawSprite("sb_push", frameOf("sb_push", now * sp), 0, 0, sb.dir, k, 1, fl + (warn ? ` drop-shadow(0 0 ${6 + 5 * Math.sin(now * 20)}px rgba(255,220,120,0.95))` : ""));   // tier 1: the bronze rim flashes as he lifts
      ctx.restore();
    }
  } else {
    if (sb.beaten && sb.shieldX !== undefined) {   // the shield, falling flat in the dust
      const sx = sb.shieldX - camX, f = sb.state === "fall" ? Math.min(1, sb.t / 0.45) : 1;
      if (f < 1) drawDoorShield(sx, GR * T, sb.dir, 0, -f * 4.13, 0);
      else drawFallenShield(sx, sb.dir);
    }
    const charging = sb.state === "charge", walking = sb.state === "walk" || sb.state === "back";
    const nm = charging ? "phil_charge" : "phil_run", fr = walking ? frameOf("phil_run", now * 0.5) : charging ? frameOf("phil_charge", now) : 0;
    const face = sb.state === "back" ? -1 : sb.dir;   // backing away: still facing David
    drawSprite(nm, fr, x, sb.y, face, W7.SB_SIZE, 1, fl || "brightness(0.9)");
    if (!sb.beaten) drawDoorShield(x + sb.dir * W7.SB_FRONT, sb.y + 2, sb.dir, sb.lift, sb.tilt, sb.state === "lift" && (tobiWarned() || w7Counsel2));
  }
  // the shockwaves: dust racing along the ground
  for (const w of sb.waves) {
    const wx = w.x - camX, a = 1 - w.t / W7.SB_WAVE_T;
    ctx.save(); ctx.fillStyle = `rgba(200,170,120,${0.7 * a})`;
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(wx - w.dir * k * 10, GR * T - 6 - k * 3, 16 - k * 2, 9 - k, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
}
// Eliab, far up the Israelite slope, apart from the others, arms crossed (Luke 15:28)
const eliab7 = setPieces.find(p => p.kind === "eliab7") || null;
function drawEliab7(camX) {
  if (!eliab7 || !SPR.eliab_arms_crossed) return;
  // (Glen) part of the far hills, not the ground: he moves with the far painting (TUNE.BG_FAR_SPEED), so he stands
  // still on the slope; where he stands is set for when David reaches his line (W7.ELIAB_AT: x on screen then).
  // He fades in as David comes near the line and stays there after.
  const c0 = eliab7.x - W * W7.ELIAB_AT, x = W * W7.ELIAB_AT - (camX - c0) * TUNE.BG_FAR_SPEED;
  const a = Math.max(0, Math.min(1, (david.x - (eliab7.x - 22 * T)) / (8 * T))); if (a <= 0) return;
  drawSprite("eliab_arms_crossed", 0, x, eliab7.y, 1, 0.4, 0.85 * a, "saturate(0.7) brightness(0.9) blur(0.4px)");
}
// the walk out: a slow drum, the giant's footsteps louder as he comes, the shadow from the right
const quiet74 = { drumT: 0, stepT: 0 };
function drum(vol = 0.35) {
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ac = chimeCtx, t0 = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(95, t0); o.frequency.exponentialRampToValueAtTime(48, t0 + 0.3);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol * sfxMul()), t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);
    o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + 0.65);
  } catch (e) {}
}
const shadowK = () => sb ? Math.max(0, Math.min(1, david.x / sb.a0)) : 0;
function updateQuiet74(dt) {
  if (!STAGE_INFO.quiet || !audioUnlocked || finish.active || (sb && sb.beaten)) return;
  quiet74.drumT -= dt; quiet74.stepT -= dt;
  if (quiet74.drumT <= 0) { quiet74.drumT = W7.DRUM_EVERY; drum(0.3); setTimeout(() => drum(0.18), 260); }
  if (quiet74.stepT <= 0) { quiet74.stepT = 2.3 - shadowK() * 0.9; thud(0.12 + shadowK() * 0.5); }   // his footsteps, louder as he comes
}
function drawShadow74() {   // after the world, before the HUD: his shadow grows across the ground from the right
  if (!STAGE_INFO.quiet) return;
  const k = shadowK() * (sb && sb.beaten ? 0.6 : 1); if (k <= 0) return;
  const g = ctx.createLinearGradient(W * (1 - 0.8 * k), 0, W, 0);
  g.addColorStop(0, "rgba(20,12,30,0)"); g.addColorStop(1, `rgba(20,12,30,${0.55 * k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function updateWorld74(dt) { if (sb || STAGE_INFO.quiet) { updateShieldBearer(dt); updateQuiet74(dt); if (typeof updateVultures === "function") updateVultures(dt); } }
function drawWorld74(camX) { if (sb || STAGE_INFO.quiet) { if (typeof drawVultures === "function") drawVultures(camX); drawEliab7(camX); drawShieldBearer(camX); } }
function stoneHitsWorld7(s) { return WORLD === 7 && stoneHitsShield(s); }

// ---------------------------------------------------------------------------
// The end of World 7 (DESIGN "End of World 7 — everything you need"): the shield in the dust, the valley quiet, David
// and the giant facing each other; the gifts screen; 1 Samuel 17:40.
// ---------------------------------------------------------------------------
const W7_GIFTS = [
  ["The sling (Jesse's old sling)", "Jesse, his father", "1"],
  ["The leather sling pouch", "The leatherworker of Tekoa", "2"],
  ["The shepherd's staff", "Hanan", "3"],
  ["The King's Favor", "King Saul", "4"],
  ["The scout's cloak", "Tobi", "5"],
  ["The shepherd's bag", "Shammah", "6"],
  ["Five smooth stones", "the stream", "7"],
  ["(and the moves)", "Hanan, Shammah, Gera, Tobi", "1-5"],
];
const w7ending = {
  active: false,
  beats: [
    { text: "The shield lay in the dust. The valley went quiet. For the first time, David and the giant faced each other across the open ground." },
    { card: true },
    { text: "He took his staff in his hand, and chose for himself five smooth stones out of the brook, and put them in the shepherd's bag which he had, even in his wallet. His sling was in his hand; and he came near to the Philistine. (1 Samuel 17:40)" },
    { text: "To be continued in World 8: David and Goliath." },
  ],
  start(done) { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, done, out: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt;
    if (this.out > 0) { this.out += dt; if (this.out > 1.2) { this.active = false; const cb = this.done; this.done = null; cb && cb(); } return; }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) { if (this.i < this.beats.length - 1) { this.i++; this.bt = 0; } else this.out = 0.001; }
  },
  draw() {
    const B = this.beats[this.i], now = performance.now() / 1000;
    drawBackground(sb ? sb.a0 : 0);
    ctx.fillStyle = "rgba(30,18,10,0.35)"; ctx.fillRect(0, 0, W, H);
    const y = GR * T;
    ctx.fillStyle = "rgba(70,52,34,0.9)"; ctx.fillRect(0, y, W, H - y);
    drawSprite("david_idle", frameOf("david_idle", now), W * 0.22, y, 1);
    if (SPR.goliath_yell) drawSprite("goliath_yell", 0, W * 0.8, y, -1, W7.GOLIATH_SIZE);
    drawFallenShield(W * 0.5, 1);
    if (B.card) {
      const pw = 900, ph = 470, px = (W - pw) / 2, py = 60;
      ctx.save(); ctx.fillStyle = "rgba(244,230,200,0.96)"; ctx.strokeStyle = "#6b4a24"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#3a2612"; ctx.textAlign = "center"; ctx.font = "bold 30px Georgia, serif"; ctx.fillText("Everything David carries", W / 2, py + 50);
      ctx.font = "20px Georgia, serif"; ctx.textAlign = "left";
      W7_GIFTS.forEach(([g, who, w], k) => {
        const ry = py + 100 + k * 40;
        ctx.fillStyle = "#3a2612"; ctx.fillText(g, px + 40, ry); ctx.fillStyle = "#6b4a24"; ctx.fillText(who, px + 380, ry); ctx.textAlign = "right"; ctx.fillText("World " + w, px + pw - 40, ry); ctx.textAlign = "left";
      });
      ctx.textAlign = "center"; ctx.font = "italic bold 26px Georgia, serif"; ctx.fillStyle = "#7a3a10"; ctx.fillText("Everything you need, you already have.", W / 2, py + ph - 26);
      ctx.restore();
    } else {
      ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.beginPath(); ctx.roundRect(120, 80, W - 240, 170, 14); ctx.fill();
      ctx.fillStyle = "#ffe9b8"; ctx.font = "italic 26px Georgia, serif"; ctx.textAlign = "center";
      const words = B.text.split(" "), lines = []; let ln = "";
      for (const w of words) { const tst = ln ? ln + " " + w : w; if (ctx.measureText(tst).width > W - 300) { lines.push(ln); ln = w; } else ln = tst; }
      lines.push(ln);
      lines.forEach((l, k) => ctx.fillText(l, W / 2, 80 + 85 - (lines.length - 1) * 17 + k * 34));
      ctx.restore();
    }
    ctx.save(); ctx.font = "bold 16px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.textAlign = "right"; ctx.fillText(keyText("A: next"), W - 30, H - 24); ctx.restore();
    if (this.t < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - this.t})`; ctx.fillRect(0, 0, W, H); }
    if (this.out > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, this.out / 1.2)})`; ctx.fillRect(0, 0, W, H); }
  },
};

function updateWorld7(dt) {
  if (WORLD !== 7) return;
  updateArmor(dt); updateMemories(dt); updateStones73(dt); updateWorld74(dt);
}
function drawWorld7(camX) {
  if (WORLD !== 7) return;
  drawSaul7(camX);
  drawArmorPile(camX);
  drawMemSheep(camX);
  drawStones73(camX);
  drawWorld74(camX);
}

// ---------------------------------------------------------------------------
// The opening of World 7 (DESIGN 5g "Opening scene"), before 7-1 the first time (or ?w7intro, ?w7intro=3 from that beat):
// Saul's tent, straight on from the end of World 6. The king's armor is brought out (the pile from Glen's david_armor_off
// clip, laid out), Saul dresses David in it himself (17:38), the helmet slides down over his eyes, the lamb finds Saul's
// spare helmet, David tries to walk (17:39, clank, clank). The title card. 7-1 then starts with him in it.
// ---------------------------------------------------------------------------
const w7intro = {
  active: false,
  beats: [
    { who: "", text: "In the king's tent, Saul's servants brought out his own armor: his tunic, his coat of mail, his bronze helmet, and his sword.", saul: 0, pile: true },
    { who: "King Saul", text: "If you're going out there, you're not going in a shepherd's tunic. You'll wear mine.", saul: 5, pile: true },
    { who: "", text: "Saul dressed David with his clothing. He put a helmet of brass on his head, and he clad him with a coat of mail. (1 Samuel 17:38)", dress: true, flash: true },
    { who: "", text: "From his shoulders and upward Saul was taller than any of the people (1 Samuel 9:2). On David, the helmet slid straight down over his eyes.", saul: 3, armor: "slip" },
    { who: "", text: "Behind them, the lamb found the king's spare helmet, put its head in it, and wandered off with it on.", saul: 4, armor: "idle", lamb: true },
    { who: "", text: "David strapped his sword on his clothing, and he tried to move; for he had not tested it. (1 Samuel 17:39)", saul: 2, armor: "walk" },
    { card: true, saul: 2, armor: "idle" },
  ],
  start() { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, fade: 0, out: 0, clankT: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt; this.fade = Math.min(1, this.t / 1.2);
    const B = this.beats[this.i];
    if (B.armor === "walk" && this.bt < 4) { this.clankT -= dt; if (this.clankT <= 0) { this.clankT = W7.CLANK_EVERY; clank(0.3, 0.9 + Math.random() * 0.2); } }
    if (this.out > 0) { this.out += dt; if (this.out > 1.2) this.finish(); return; }
    if (B.card && this.bt > 3.2) { this.out = 0.001; return; }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) { this.i++; this.bt = 0; if (this.beats[this.i].flash) clank(0.35, 1.1); }
      else this.out = 0.001;
    }
  },
  finish() {
    this.active = false;
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.w7intro = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  },
  draw() {
    const B = this.beats[this.i], now = performance.now() / 1000, fy = H - 6, z = 1.9;   // close to the camera, as in the World 6 ending
    if (TENT_BG.naturalWidth) { const s = Math.max(W / TENT_BG.naturalWidth, H / TENT_BG.naturalHeight); ctx.drawImage(TENT_BG, (W - TENT_BG.naturalWidth * s) / 2, (H - TENT_BG.naturalHeight * s) / 2, TENT_BG.naturalWidth * s, TENT_BG.naturalHeight * s); }
    else { ctx.fillStyle = "#2a1c10"; ctx.fillRect(0, 0, W, H); }
    for (const [k, fx] of [[2, 0.82], [3, 0.94]]) drawSprite("commander_tent", k, W * fx, fy - 10, -1, z * 0.92);
    const pair = B.dress && SPR.saul_dress;   // Glen's clip of Saul putting the helmet on him: the two of them in one sheet
    if (pair) drawSprite("saul_dress", Math.min(SPR.saul_dress.frames - 1, Math.floor(this.bt * 1000 / SPR.saul_dress.ms)), tentPairX(z), fy, 1, z);
    else drawSprite(SPR.saul_armor ? "saul_armor" : "saul", SPR.saul_armor ? B.saul || 0 : 0, W * 0.64, fy, -1, z);
    if (B.lamb) {   // the lamb, in Saul's spare helmet, bumping along the back of the tent
      const lx = W * (0.98 - 0.5 * Math.min(1, this.bt / 6)), ly = fy - 8, sc = SCALE * z * W7.LAMB_SIZE, [hx, hy, hr] = W7.LAMB_HELM;
      drawSprite("lamb_walk", frameOf("lamb_walk", now), lx, ly, -1, z * W7.LAMB_SIZE);
      const hpx = lx - hx * sc, hpy = ly + hy * sc + Math.sin(now * 9) * 2, img = ITEM.david_helmet;
      if (img && img.naturalWidth) {   // Glen's helmet (assets/items/david_helmet.png, drawn facing right): flipped to the way the lamb walks
        const [ox, oy, w] = W7.LAMB_HELM_IMG, k = w * hr * sc / img.naturalWidth;
        ctx.save(); ctx.translate(hpx, hpy); ctx.scale(-1, 1); ctx.drawImage(img, -ox * k, -oy * k, img.naturalWidth * k, img.naturalHeight * k); ctx.restore();
      } else drawHelmet(hpx, hpy, hr * sc, -1);
    }
    let dx = SPR.saul_dress ? tentPairX(z) - W7.PAIR_DAVID * SCALE * z : W * 0.24;   // where the clip leaves him, beside Saul
    if (pair) {}
    else if (B.pile) {
      drawIntroPile(W * 0.30, fy, z);   // laid out on the rug between them
      drawSprite("david_idle", frameOf("david_idle", now), W * 0.2, fy, 1, z);
    } else if (B.armor === "walk") {
      const go = Math.min(1, this.bt / 4), back = SPR.saul_dress ? -1 : 1; dx += back * W * 0.16 * go;   // a few clanking steps (away from Saul)
      drawSprite(go < 1 ? "david_armor_walk" : "david_armor_idle", frameOf(go < 1 ? "david_armor_walk" : "david_armor_idle", now), dx, fy, go < 1 ? back : 1, z);
    } else if (B.armor === "slip") {
      const n = SPR.david_armor_slip ? SPR.david_armor_slip.frames : 1;
      drawSprite("david_armor_slip", Math.min(n - 1, W7.SLIP_FROM + Math.floor(this.bt * 1000 / 150)), dx, fy, 1, z);
    } else drawSprite("david_armor_idle", frameOf("david_armor_idle", now), dx, fy, 1, z);
    if (B.flash) { const f = Math.max(0, 1 - this.bt / 0.7); ctx.fillStyle = `rgba(255,236,190,${f})`; ctx.fillRect(0, 0, W, H); }
    ctx.textAlign = "center";
    if (B.card) {
      const f = Math.min(1, this.bt / 0.8); ctx.fillStyle = `rgba(10,6,2,${0.75 * f})`; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = f; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 54px Georgia, serif"; ctx.fillText("WORLD 7", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff6e2"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText("The Giant's Shadow", W / 2, H / 2 + 30); ctx.globalAlpha = 1;
    } else drawStoryBox(B.who, B.text, "A: next", true);
    ctx.textAlign = "left";
    const a = Math.min(this.fade, 1 - Math.min(1, this.out / 1.2));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
const tentPairX = z => W * 0.64 - W7.PAIR_SAUL * SCALE * z;   // Glen's two-person clips: Saul's feet where his own sprite stands
function drawIntroPile(x, y, z) {   // the armor laid out: the last frame of Glen's off clip, cut off where David stood
  const s = SPR.david_armor_off;
  if (!s) { const keep = armor.pile; armor.pile = { x, y, facing: 1, drawn: true }; drawArmorPile(0); armor.pile = keep; return; }
  const sc = SCALE * z * (TUNE.SPRITE_SIZE.david_armor_off || 1), edge = 39 * sc;
  ctx.save(); ctx.beginPath(); ctx.rect(x + edge, y - s.h * sc, s.w * sc, s.h * sc + 4); ctx.clip();
  drawSprite("david_armor_off", s.frames - 1, x, y, 1, z); ctx.restore();
}
if (LEVEL_STAGE === "7-1" && !STORY_HASH) {
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").w7intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w7intro")) w7intro.start();
  const at = Number(new URLSearchParams(location.search).get("w7intro")) || 0; if (at && w7intro.active) Object.assign(w7intro, { i: at, t: 2, fade: 1 });
}

// 7-1, taking it off (17:39): a cut to Saul's tent, the two of them in Glen's clip (David's arms out, the helmet off, the
// coat off, Saul smiling), then straight back to the stage, the armor in a pile where he stood.
const w7off = {
  active: false,
  beats: [
    { who: "David", text: "I can't go with these; for I haven't tested them. (1 Samuel 17:39)" },
    { who: "", text: "Then David took them off. The king watched him, and nodded." },
  ],
  start() { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, out: 0, clanks: 0 }); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt;
    const f = Math.floor(this.t * 1000 / SPR.saul_off.ms);
    if (this.clanks < 3 && f >= [11, 15, 18][this.clanks]) { this.clanks++; clank(0.3, 0.85 + this.clanks * 0.05); if (this.clanks === 1) thud(0.25); }   // the helmet, the coat coming down
    if (this.out > 0) { this.out += dt; if (this.out > 0.8) { this.active = false; armorDone(true); armor.offT = 1.3; } return; }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) { this.i++; this.bt = 0; }
      else if (f >= SPR.saul_off.frames) this.out = 0.001;
    }
  },
  draw() {
    const now = performance.now() / 1000, fy = H - 6, z = 1.9, n = SPR.saul_off.frames;
    if (TENT_BG.naturalWidth) { const s = Math.max(W / TENT_BG.naturalWidth, H / TENT_BG.naturalHeight); ctx.drawImage(TENT_BG, (W - TENT_BG.naturalWidth * s) / 2, (H - TENT_BG.naturalHeight * s) / 2, TENT_BG.naturalWidth * s, TENT_BG.naturalHeight * s); }
    else { ctx.fillStyle = "#2a1c10"; ctx.fillRect(0, 0, W, H); }
    for (const [k, fx] of [[0, 0.82], [1, 0.94]]) drawSprite("commander_tent", k, W * fx, fy - 10, -1, z * 0.92);
    drawSprite("saul_off", Math.min(n - 1, Math.floor(this.t * 1000 / SPR.saul_off.ms)), tentPairX(z), fy, 1, z);
    const B = this.beats[this.i], last = this.i === this.beats.length - 1;
    ctx.textAlign = "center"; drawStoryBox(B.who, B.text, last ? (this.t * 1000 / SPR.saul_off.ms >= n ? "A: continue" : "") : "A: next", true); ctx.textAlign = "left";
    const a = Math.min(1, this.t / 0.5, 1 - this.out / 0.8);
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};

// 7-3, the Stones of the Name: Glen's clip (name_stones.mp4: David walks to a path of carved stones over a chasm and
// kneels to read them). It plays once, the first time he reaches the first carving (progress.nameVision). After that,
// Select at either carving shows its last frame as a still: the carving's letters, the clue, and Select for the Journal.
const NAME_CLIP = Object.assign(document.createElement("video"), { src: "../assets/video/name_stones.mp4?v=" + (window.BUILD || 0), muted: true, playsInline: true, preload: "auto" });
NAME_CLIP.onerror = () => { NAME_CLIP.missing = true; };
const NAME_STILL = Object.assign(new Image(), { src: "../assets/video/name_stones_last.jpg?v=" + (window.BUILD || 0) });
let nameVisionSeen = false;
try { nameVisionSeen = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").nameVision; } catch (e) {}
const nameVision = {
  active: false,
  start(cross, full) {
    full = full && !NAME_CLIP.missing;
    Object.assign(this, { active: true, cross, full, t: 0, still: full ? -1 : 0, out: 0 });
    nameRun.riddle = cross;   // the Journal, opened any way in 7-3, has this riddle on the letters page
    david.vx = 0; dialog.t = 0;
    if (full) { NAME_CLIP.currentTime = 0; NAME_CLIP.play().catch(() => { this.still = 0; }); }
    if (full && !nameVisionSeen) {
      nameVisionSeen = true;
      try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.nameVision = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
    }
  },
  update(dt) {
    this.t += dt;
    if (this.out > 0) { this.out += dt; if (this.out > 0.5) { this.active = false; NAME_CLIP.pause(); if (this.then) { const f = this.then; this.then = null; f(); } } return; }
    if (this.still < 0) {   // the clip: A skips to its end
      if (NAME_CLIP.ended || this.t > 12 || (this.t > 0.8 && (pressed("a") || pressed("start")))) { this.still = 0; NAME_CLIP.pause(); }
      return;
    }
    if (this.still === 0) chime(5);   // the riddle starts to come up
    this.still += dt;
    if (this.still < 0.5) return;
    if (pressed("a") || pressed("b") || pressed("start")) this.out = 0.001;
    else if (pressed("select") || pressed("y")) {   // straight to the Journal's old letters
      this.out = 0.001;
      this.then = () => { if (typeof Journal !== "undefined" && Journal.openNote && typeof lettersSpread === "function") { hushLoops(); Journal.openNote(lettersSpread(lettersFound(), this.cross)); } };
    }
  },
  draw() {
    const cover = (img, w, h) => { const s = Math.max(W / w, H / h); ctx.drawImage(img, (W - w * s) / 2, (H - h * s) / 2, w * s, h * s); };
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
    if (this.still < 0) { if (NAME_CLIP.videoWidth && NAME_CLIP.readyState >= 2) cover(NAME_CLIP, NAME_CLIP.videoWidth, NAME_CLIP.videoHeight); }
    else if (NAME_STILL.naturalWidth) cover(NAME_STILL, NAME_STILL.naturalWidth, NAME_STILL.naturalHeight);
    if (this.still >= 0) {
      const a = this.full ? Math.min(1, this.still / 0.6) : 1;
      ctx.save(); ctx.globalAlpha = a;
      // (Glen) the riddle comes up over the bridge, line by line, like a carving catching the light
      const C = NAME_CROSS[this.cross], [fy, fs, per] = W7.RIDDLE;
      ctx.restore(); ctx.save();
      const band = ctx.createLinearGradient(0, H * fy - fs * 2.2, 0, H * fy + fs * 2.4);
      band.addColorStop(0, "rgba(10,6,2,0)"); band.addColorStop(0.5, `rgba(10,6,2,${0.62 * a})`); band.addColorStop(1, "rgba(10,6,2,0)");
      ctx.fillStyle = band; ctx.fillRect(0, H * fy - fs * 2.2, W, fs * 4.6);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `italic ${fs}px Georgia, serif`;
      C.riddle.forEach((line, i) => {
        const f = Math.max(0, Math.min(1, (this.still - 0.3 - i * per) / per)), ly = H * fy + (i - (C.riddle.length - 1) / 2) * fs * 1.3;
        ctx.globalAlpha = f; ctx.shadowColor = "rgba(255,150,30,0.9)"; ctx.shadowBlur = 18 * f; ctx.fillStyle = "#ffe3a0"; ctx.fillText(line, W / 2, ly + (1 - f) * 6);
        ctx.shadowBlur = 0; ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.25 * f; ctx.fillText(line, W / 2, ly + (1 - f) * 6); ctx.globalCompositeOperation = "source-over";
      });
      ctx.restore();
      if (this.still > 0.3 + C.riddle.length * per) { ctx.textAlign = "center"; drawStoryBox("David", C.think, keyText("A: back to the stones    Select: open your Journal"), false); ctx.textAlign = "left"; }
    } else if (this.t > 1) caption("A: skip", 0.6, true);
    const f = Math.min(1, this.t / 0.5, 1 - this.out / 0.5); ctx.fillStyle = `rgba(0,0,0,${1 - f})`; ctx.fillRect(0, 0, W, H);
  },
};
