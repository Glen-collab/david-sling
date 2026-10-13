// World 2's creatures and stage pieces (loaded after world1.js):
//   the wild boar (scrapes the ground, then charges: tap stones bounce off its thick head, a full charged stone stuns it
//   and it runs off), deadfalls (dead branches piled across the trail: only a full charged stone breaks them),
//   and Hanan sitting at his campfires.

const W2 = {
  BOAR_SEE: 520, BOAR_TELL: 0.9, BOAR_CHARGE: 600, BOAR_REST: 1.2,   // how close before it notices you; the scrape (warning) before it charges
  BOAR_RUN: 10,          // the most tiles it charges before it stops
  BOAR_STUN: 2.6,        // seconds dazed after a charged stone, then it runs off
  BOAR_SIZE: 1.1,        // next to David
  DEADFALL_LOG_H: 1.35,  // each log in a deadfall, in tiles
};
Object.assign(TUNE.SPRITE_SIZE, { boar_charge: W2.BOAR_SIZE, boar_scrape: W2.BOAR_SIZE, boar_stand: W2.BOAR_SIZE, boar_stunned: W2.BOAR_SIZE });
CRITTER_ART.boar = { idle: "boar_stand", move: "boar_charge", len: 120, h: 62 };

// ---------------------------------------------------------------------------
// The wild boar (Psalm 80:13, "the boar out of the wood"). It warns you (the scrape), then charges in a straight line.
// Jump over it, or stop it with a full charged stone. Tap stones just bounce off its head.
// ---------------------------------------------------------------------------
function updateBoar(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle") {
    fall();
    if (sameLevel && Math.abs(dx) < W2.BOAR_SEE && david.deadT <= 0) { k.facing = Math.sign(dx) || k.facing; setCrit(k, "tell"); }
    return;
  }
  if (k.state === "tell") { fall(); if (k.t > W2.BOAR_TELL) { setCrit(k, "charge"); k.startX = k.x; } return; }
  if (k.state === "charge") {
    const moved = runCritter(k, W2.BOAR_CHARGE, dt);
    const outOfRange = k.range && Math.abs(k.x - k.home) > k.range;
    if (touchesDavid(critterBox(k))) hurtDavid(k.x);
    if (!moved || outOfRange || Math.abs(k.x - k.startX) > W2.BOAR_RUN * T) {
      if (outOfRange) k.x = k.home + Math.sign(k.x - k.home) * k.range;
      setCrit(k, "rest");
    }
    return;
  }
  if (k.state === "rest") { fall(); if (k.t > W2.BOAR_REST) { k.facing = Math.sign(dx) || k.facing; setCrit(k, "idle"); } return; }
  if (k.state === "stunned") {   // dazed: harmless; then it turns tail and runs off into the trees
    fall();
    if (k.t > W2.BOAR_STUN) { k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 380; toast("The boar ran off into the trees!"); }
  }
}
function stoneHitsBoar(k, s) {   // called by stoneHitsCritters (world1.js)
  if (k.state === "stunned") { stoneHit(s, 0.5); return true; }
  if (s.charged || s.power) {
    stoneHit(s); setCrit(k, "stunned"); k.vx = 0;
    for (let i = 0; i < 10; i++) bits.push({ x: k.x, y: k.y - 50, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 380, life: 0.6, color: "#fff2b0" });
    if (!k.stunTold) { k.stunTold = true; toast("A full charged stone stopped it!"); }
    return true;
  }
  stoneHit(s, 0.6);   // a tap stone bounces off that thick head
  if (!k.told) {
    k.told = true;
    toast(hasSkill("charge") ? "Tap stones bounce off a boar's head! Hold B until the ring turns gold, then let go."
                             : "Tap stones bounce off a boar's head! Jump over its charge. Hanan will know what to do.");
  }
  return true;
}
function drawBoar(k, x) {
  let name, i, filter = "";
  if (k.gone) { name = "boar_charge"; i = frameOf(name, k.t * 1.3); }
  else if (k.state === "tell") { name = "boar_scrape"; i = frameOf(name, k.t * 1.6); filter = "drop-shadow(0 0 8px rgba(255,200,60,0.9))"; }
  else if (k.state === "charge") { name = "boar_charge"; i = frameOf(name, k.t); }
  else if (k.state === "stunned") { name = "boar_stunned"; i = frameOf(name, k.t); }
  else { name = "boar_stand"; i = frameOf(name, k.t); }
  drawSprite(name, i, x, k.y, k.facing, 1, k.alpha, filter);
}

// ---------------------------------------------------------------------------
// Deadfalls (material 8, built with deadfall() in main.js): dead branches and logs piled across the trail, too tall
// to jump. Tap stones bounce off; a full charged stone (taught by Hanan in 2-1) smashes the whole pile.
// ---------------------------------------------------------------------------
function stoneHitsDeadfall(s) {   // a stone hit a solid tile: was it a deadfall? (true = handled)
  const c = Math.floor(s.x / T), r = Math.floor(s.y / T);
  if (matAt(c, r) !== 8) return false;
  const d = deadfalls.find(d => !d.broken && c >= d.c && c < d.c + d.w && r >= d.r && r < d.r + d.h);
  if (!d) return false;
  if (s.charged || s.power) {
    d.broken = true;
    for (let x = d.c; x < d.c + d.w; x++) for (let y = d.r; y < d.r + d.h; y++) solid[y][x] = 0;
    for (let k = 0; k < 30; k++) bits.push({ x: (d.c + d.w / 2) * T, y: (d.r + Math.random() * d.h) * T, vx: (Math.random() - 0.5) * 700, vy: -Math.random() * 600, life: 1, color: k % 3 ? "#6b4a2a" : "#9a7a4a" });
    sfx("stone_hit", undefined, 1); if (typeof chime === "function") chime(5);
    toast("Crack! The dead branches gave way.");
  } else {
    stoneHit(s, 0.6);
    if (!d.told) { d.told = true; toast(hasSkill("charge") ? "Too thick for a tap stone. Hold B until the ring turns gold, then let go." : "Too thick to break with a tap stone. Too tall to climb."); }
  }
  return true;
}
function drawDeadfalls(camX) {   // logs stacked up the pile, a little crooked, with dead branches poking out
  if (!TER.wall_mid || !TER.wall_mid.naturalWidth) return;
  for (const d of deadfalls) {
    if (d.broken) continue;
    const x0 = d.c * T - camX, x1 = (d.c + d.w) * T - camX; if (x1 < -200 || x0 > W + 200) continue;
    const lh = W2.DEADFALL_LOG_H * T, n = Math.ceil(d.h * T / (lh * 0.8)), bottom = (d.r + d.h) * T;
    for (let k = 0; k < n; k++) {
      const y = bottom - lh - k * lh * 0.8, wob = Math.sin(d.c * 3.1 + k * 1.7), extra = 18 + 14 * Math.abs(wob);
      const name = k % 3 === 0 ? "wall_left" : k % 3 === 1 ? "wall_mid" : "wall_right";
      const img = TER[name], w = (x1 - x0) + extra * 2;
      ctx.save(); ctx.translate((x0 + x1) / 2 + wob * 10, y + lh / 2); ctx.rotate(wob * 0.06);
      ctx.drawImage(img, -w / 2, -lh / 2, w, lh); ctx.restore();
    }
  }
}

// ---------------------------------------------------------------------------
// Hanan at his campfires: sitting on a rock to the left of the fire, talking (Glen's Grok clips).
// ---------------------------------------------------------------------------
function drawCampfirePeople(camX) {
  for (const f of fires) {
    if (f.who !== "Hanan" || !SPR.hanan_sit) continue;
    const x = f.x - camX - 62; if (x < -200 || x > W + 200) continue;
    drawSprite("hanan_sit", frameOf("hanan_sit", performance.now() / 1000), x, f.y, 1);
  }
}
