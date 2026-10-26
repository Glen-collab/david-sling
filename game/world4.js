// World 4's stage pieces (loaded after world3.js). 4-1 The Road to Gibeah: David takes the king's gifts north
// (1 Samuel 16:20): the donkey with the bread and the wine follows him, and Father's young goat trots along too.
//   critter("giftdonkey", c)   the donkey (Glen's donkey_packs_walk / donkey_packs_scared). Must reach the end with both gifts.
//   critter("villagedog", c)   a village dog: barks, runs at the donkey and spooks it. The donkey won't budge until David
//                              sits and plays the harp near it. A stone sends the dog off yelping.
//   critter("bandit", c)       once David's gone past, a bandit creeps up behind the donkey and steals a gift (Glen's thief
//                              sheets). Hit him and he drops it; walk over it to load it back on.
//   critter("dove", c)         doves on the road: harmless (Shepherd's Judgment). Crows in the vines are fair game.
//   the vineyard keeper        talk(c, "The vineyard keeper", ...): Glen's 6-pose sheet, drawn here.
// The opening scene (w4intro): the king's messenger at Jesse's door, Eliab, the donkey loaded, Hanan's farewell.

const W4 = {
  DONKEY_SIZE: 1.1, DONKEY_FOLLOW: 3.5, DONKEY_WALK: 170, DONKEY_LOST: 18,   // tiles behind before he catches up on his own
  CALM_TIME: 1.6,       // seconds of harp near the spooked donkey to calm him
  CALM_NEAR: 6,         // tiles
  DOG_SEE: 7, DOG_RUN: 300, DOG_BARK: 3.2,   // tiles; px/s; seconds it barks around the donkey before it loses interest
  BANDIT_AFTER: 7, BANDIT_SNEAK: 130, BANDIT_RUN: 240,
  DOVE_SIZE: 0.55, DOVE_SPOOK: 2.5,
  KEEPER_SIZE: 1.05,
};
Object.assign(TUNE.SPRITE_SIZE, { donkey_packs_walk: W4.DONKEY_SIZE, donkey_packs_scared: W4.DONKEY_SIZE, donkey_bare_walk: W4.DONKEY_SIZE });
const DONKEY_BACK = [-74, -105];   // the middle of his back on donkey_bare_walk (sheet px from the anchor): where a gift that's left rides
const giftDonkey = () => critters.find(k => k.kind === "giftdonkey");
const GIFT_NAMES = { bread: "the bread", wine: "the skin of wine" };
const giftDrops = [];   // gifts lying on the road (a bandit dropped them): walk over one to load it back on
for (const k of critters) if (k.kind === "giftdonkey") Object.assign(k, { gifts: ["bread", "wine"], facing: 1 });
if (WORLD === 4) W3.GOAT_HOME = 1e6;   // goats in World 4 are never "home" (that's 3-1's Jesse)
if (LEVEL_STAGE === "4-1") for (const k of critters) if (k.kind === "goat") k.follow = true;   // Father's young goat, for the king

// ---------------------------------------------------------------------------
// The gift donkey
// ---------------------------------------------------------------------------
CRITTER_ART.giftdonkey = { box: k => ({ x0: k.x - 60, x1: k.x + 60, y0: k.y - 90, y1: k.y }) };
function updateGiftDonkey(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle") setCrit(k, "stand");
  if (k.state === "spooked" || k.state === "balk") {   // rearing, then planted and trembling until the harp calms him
    fall();
    if (k.state === "spooked" && k.t > 0.9) setCrit(k, "balk");
    const near = Math.abs(david.x - k.x) < W4.CALM_NEAR * T && Math.abs(david.y - k.y) < 100;
    if (k.state === "balk" && david.state === "harp" && near) {
      k.calmT = (k.calmT || 0) + dt;
      if (k.calmT > W4.CALM_TIME) { k.calmT = 0; setCrit(k, "stand"); toast("He's calm again. On we go."); }
    } else if (k.state === "balk" && !near && !k.toldFar && Math.abs(dx) > 10 * T) { k.toldFar = true; toast("The donkey won't move! Go back and play the harp for him (Select)."); }
    return;
  }
  if (k.state === "leap") {   // up (or down) after David in one bound, like the goat (world3.js goatLeap)
    const f = Math.min(1, k.t / 0.75), base = k.ly0 + (k.ly1 - k.ly0) * f;
    k.x = k.lx0 + (k.lx1 - k.lx0) * f; k.y = base - Math.sin(f * Math.PI) * (Math.max(k.ly0, k.ly1) - k.ltop);
    if (f >= 1) { k.y = k.ly1; k.vy = 0; k.onGround = true; setCrit(k, "walk"); k.stuckT = 0; }
    return;
  }
  // following: walks after David when he's more than a few tiles off, stands when he stops
  if (david.deadT > 0) { fall(); return; }
  if (david.onGround && k.onGround && Math.abs(david.y - k.y) > 30 && Math.abs(dx) < 9 * T) {   // David's up on a rock (or down off one)
    let tx = david.x - (Math.sign(dx) || 1) * 70; if (!standable(tx, david.y)) tx = david.x;
    goatLeap(k, tx, david.y); return;
  }
  const far = Math.abs(dx) > W4.DONKEY_LOST * T || (!sameLevel && Math.abs(dx) > 6 * T && david.onGround);
  if (far) { k.lostT = (k.lostT || 0) + dt; if (k.lostT > 1.2 && david.onGround) { k.lostT = 0; k.x = david.x - (david.facing || 1) * 3 * T; k.y = david.y; k.vy = 0; if (!standable(k.x, k.y)) k.x = david.x; } }
  else k.lostT = 0;
  if (Math.abs(dx) > W4.DONKEY_FOLLOW * T) {
    k.facing = Math.sign(dx); setCrit(k, "walk");
    const moved = runCritter(k, W4.DONKEY_WALK + Math.min(240, Math.abs(dx) - W4.DONKEY_FOLLOW * T), dt);
    if (!moved && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);   // a rock in the way: up he goes
    k.stuckT = moved ? 0 : (k.stuckT || 0) + dt;
    if (k.stuckT > 1.5 && david.onGround) {   // still stuck (under a shelf, in the rocks): he finds his own way round to David
      k.stuckT = 0; let tx = david.x - (Math.sign(dx) || 1) * 2 * T; if (!standable(tx, david.y)) tx = david.x;
      Object.assign(k, { x: tx, y: david.y, vy: 0, onGround: true });
    }
  } else { setCrit(k, "stand"); fall(); }
}
function spookDonkey(k, why) {
  if (k.state === "spooked" || k.state === "balk") return;
  setCrit(k, "spooked"); k.calmT = 0; k.toldFar = false; sfx("lion_hit", k.x, 0.5, 1.5);
  toast(why);
}
function stoneHitsGiftDonkey(k, s) {
  stoneHit(s, 0.5);
  if (!W4.donkeyStoned) { W4.donkeyStoned = true; toast("Not the donkey! He's carrying the king's gifts."); }
  return true;
}
function drawGiftDonkey(k, x) {
  const bare = k.gifts.length < 2 && SPR.donkey_bare_walk;   // a gift stolen: Glen's bare donkey, with what's left drawn on
  let nm = bare ? "donkey_bare_walk" : "donkey_packs_walk", i = 0;
  if (k.state === "walk") i = frameOf(nm, k.t);
  else if (k.state === "spooked" && SPR.donkey_packs_scared) { nm = "donkey_packs_scared"; i = Math.min(SPR[nm].frames - 1, Math.floor(k.t / 0.9 * SPR[nm].frames)); }
  else if (k.state === "leap") i = 2;
  else if (k.state === "balk" && SPR.donkey_packs_scared) { nm = "donkey_packs_scared"; i = 3; x += Math.sin(performance.now() / 40) * 1.5; }   // trembling
  drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
  if (bare && nm === "donkey_bare_walk") {
    const sc = SCALE * W4.DONKEY_SIZE, bob = k.state === "walk" ? Math.abs(Math.sin(k.t * 6)) * 2 : 0;
    for (const g of k.gifts) drawGift(g, x + k.facing * DONKEY_BACK[0] * sc, k.y + DONKEY_BACK[1] * sc + 10 - bob, g === "wine" ? 0.9 : 0.85);
  }
  if (k.state === "balk") {   // calming: a little ring of notes fills while David plays
    const f = Math.min(1, (k.calmT || 0) / W4.CALM_TIME);
    if (f > 0) { ctx.save(); ctx.strokeStyle = "rgba(255,230,140,0.9)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, k.y - 120, 16, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); ctx.stroke(); ctx.restore(); }
  }
}
// main.js: not through the gate without the king's gifts
function giftsBlocking() {
  const k = giftDonkey(); if (!k) return null;
  if (k.gifts.length < 2) return `The king's gifts! The donkey's still missing ${["bread", "wine"].filter(g => !k.gifts.includes(g)).map(g => GIFT_NAMES[g]).join(" and ")}.`;
  if (k.state === "balk" || k.state === "spooked") return "The donkey's frightened back there! Calm him with the harp first.";
  return null;
}
function updateGiftDrops() {
  const k = giftDonkey(); if (!k) return;
  for (let i = giftDrops.length - 1; i >= 0; i--) {
    const g = giftDrops[i];
    if (Math.abs(david.x - g.x) < 40 && Math.abs(david.y - g.y) < 60 && david.deadT <= 0) {
      giftDrops.splice(i, 1); if (!k.gifts.includes(g.name)) k.gifts.push(g.name);
      sfx("olive_pickup", g.x, 0.8, 0.8); toast(`You loaded ${GIFT_NAMES[g.name]} back on the donkey.`);
    }
  }
}
function drawGift(name, x, y, s = 1) {   // the wineskin (Glen's), or a sack of bread
  if (name === "wine" && ITEM.wineskin && ITEM.wineskin.naturalWidth) drawItem("wineskin", x, y, 0.28 * s);
  else if (ITEM.bread && ITEM.bread.naturalWidth) drawItem("bread", x, y, 0.2 * s);
  else { ctx.fillStyle = "#d8c08a"; ctx.beginPath(); ctx.ellipse(x, y - 14 * s, 22 * s, 14 * s, 0, 0, Math.PI * 2); ctx.fill(); }
}
function drawGiftDrops(camX) {
  for (const g of giftDrops) { const x = g.x - camX; if (x > -60 && x < W + 60) { drawGift(g.name, x, g.y + Math.sin(performance.now() / 300) * 2); } }
}

// ---------------------------------------------------------------------------
// Village dogs: bark at the donkey and spook him; a stone sends them off
// ---------------------------------------------------------------------------
CRITTER_ART.villagedog = { box: k => ({ x0: k.x - 50, x1: k.x + 50, y0: k.y - 60, y1: k.y }) };
function updateVillageDog(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  const don = giftDonkey();
  if (k.state === "idle") {
    fall(); k.facing = Math.sign(dx) || k.facing;
    if (sameLevel && Math.abs(dx) < W4.DOG_SEE * T && david.deadT <= 0 && don) { setCrit(k, "run"); sfx("wolf_bark", k.x, 0.8); }
    return;
  }
  if (k.state === "run") {   // for the donkey
    if (Math.abs(don.x - k.x) > 30) k.facing = Math.sign(don.x - k.x);
    if (!runCritter(k, W4.DOG_RUN, dt) && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);   // over a rock
    if (Math.abs(don.x - k.x) < 2 * T) { setCrit(k, "bark"); spookDonkey(don, "A dog's barking at the donkey! He's spooked. Sit and play the harp to calm him (Select)."); }
    if (k.t > 6) setCrit(k, "bark");
    return;
  }
  if (k.state === "bark") {   // darting round him, yapping, then it loses interest and trots off
    k.facing = Math.sign(don.x - k.x) || k.facing; fall();
    if (Math.floor(k.t * 2.2) !== Math.floor((k.t - dt) * 2.2)) sfx("wolf_bark", k.x, 0.5, 1.15);
    if (k.t > W4.DOG_BARK) { k.gone = true; k.facing = -1; k.vx = -W4.DOG_RUN; }
  }
}
function stoneHitsVillageDog(k, s) {
  k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 420; stoneHit(s, 0.6);
  toast("The dog ran off, yelping."); return !s.power;
}
function drawVillageDog(k, x) {
  let nm = "dog_run", i = frameOf("dog_run", k.t);
  if (k.state === "idle") { nm = "dog_sit"; i = frameOf(nm, k.t); }
  else if (k.state === "bark") { nm = "dog_sit"; i = Math.floor(k.t * 4.4) % 2 ? 0 : (SPR.dog_sit ? SPR.dog_sit.frames - 1 : 0); }
  if (SPR[nm]) drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
}

// ---------------------------------------------------------------------------
// Bandits: they come from behind for a gift off the donkey
// ---------------------------------------------------------------------------
CRITTER_ART.bandit = { box: k => ({ x0: k.x - 34, x1: k.x + 34, y0: k.y - (k.carry ? W3.THIEF_HAND * SCALE + 70 : rustlerH()) - 30, y1: k.y }) };
function updateBandit(k, dx, sameLevel, dt) {
  const don = giftDonkey(); if (!don) { k.gone = true; return; }
  if (k.state === "idle") {   // out of sight (after a fall, whatever he had is back on the donkey)
    k.alpha = 0;
    if (k.carry) { if (!don.gifts.includes(k.carry)) don.gifts.push(k.carry); k.carry = null; }
    if (!k.done && david.x > k.home + W4.BANDIT_AFTER * T && don.gifts.length && david.deadT <= 0) {
      k.done = true;
      Object.assign(k, { x: Math.min(don.x - 6 * T, camX - 80), y: don.y, vy: 0, facing: 1, alpha: 1 }); setCrit(k, "sneak");
      toast("Behind you! A bandit is creeping up on the donkey!");
    }
    return;
  }
  if (k.state === "sneak") {
    k.facing = Math.sign(don.x - k.x) || 1;
    if (!runCritter(k, W4.BANDIT_SNEAK, dt) && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);   // over a rock
    if (touchesDavid(critterBox(k))) { k.gone = true; k.vx = -W4.BANDIT_RUN * 1.4; toast("The bandit saw you coming and ran off."); return; }
    if (Math.abs(don.x - k.x) < 40) {
      if (!don.gifts.length) { k.gone = true; k.vx = -W4.BANDIT_RUN; return; }
      k.carry = don.gifts.includes("wine") ? "wine" : don.gifts[0]; don.gifts.splice(don.gifts.indexOf(k.carry), 1);
      setCrit(k, "grab"); toast(`He's grabbed ${GIFT_NAMES[k.carry]}! Hit him with a stone!`);
    }
    return;
  }
  if (k.state === "grab") { k.vx = 0; if (k.t > W3.THIEF_GRAB) setCrit(k, "flee"); return; }
  if (k.state === "flee") {   // off with it, away from David; stops to look back, runs again when he comes close
    k.facing = -Math.sign(dx) || -1;
    const moved = runCritter(k, W4.BANDIT_RUN, dt);
    if (!moved && k.onGround && groundAhead(k, k.facing) && k.x > 2 * T) k.vy = -hopFor(k, k.facing);
    else if (!moved && k.onGround) setCrit(k, "wait");
    if (k.t > 2.5) setCrit(k, "wait");
  } else if (k.state === "wait") {
    k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 40, 150, dt);
    k.facing = Math.sign(dx) || k.facing;
    if (Math.abs(dx) < 260 && k.t > 0.6) setCrit(k, "flee");
  }
}
function stoneHitsBandit(k, s) {
  if (k.state === "idle") return false;
  if (k.carry) { giftDrops.push({ name: k.carry, x: k.x, y: GR * T }); toast(`He dropped ${GIFT_NAMES[k.carry]} and ran! Pick it up.`); k.carry = null; }
  else toast("The bandit ran off.");
  k.gone = true; k.facing = Math.sign(k.x - david.x) || -1; k.vx = k.facing * W4.BANDIT_RUN * 1.6; stoneHit(s);
  return !s.power;
}
function drawBandit(k, x) {
  if (!thiefArt()) return;
  let nm = "thief_run", i = frameOf(nm, k.t);
  if (k.state === "sneak" && SPR.thief_sneak) { nm = "thief_sneak"; i = frameOf(nm, k.t); }
  else if (k.state === "grab") { nm = "thief_pickup"; i = Math.min(4, Math.floor(k.t / W3.THIEF_GRAB * 5)); }
  else if (k.state === "wait") { nm = "thief_stand"; i = frameOf(nm, k.t); }
  drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
  if (k.carry) {   // up in his raised hand while he runs; at his side while he looks back
    const up = k.state === "flee", sc = SCALE * (TUNE.SPRITE_SIZE.thief_run || 1);
    drawGift(k.carry, x - k.facing * (up ? 4 * sc : 12), k.y - (up ? W3.THIEF_HAND * sc - 10 : rustlerH() * 0.35), 0.8);
  }
}

// ---------------------------------------------------------------------------
// Doves on the road (harmless): they walk about, and flutter off when David runs at them
// ---------------------------------------------------------------------------
CRITTER_ART.dove = { box: k => ({ x0: k.x - 18, x1: k.x + 18, y0: k.y - 30, y1: k.y }) };
for (const k of critters) if (k.kind === "dove") { k.facing = k.home % 2 ? 1 : -1; k.t = (k.home % 7) * 0.4; }
function updateDove(k, dx, sameLevel, dt) {
  if (k.state === "fly") {   // up and away
    k.x += k.facing * 220 * dt; k.y -= (k.t < 0.3 ? 40 : 180) * dt; if (k.t > 2.5) { k.gone = true; k.vx = k.facing * 220; }
    return;
  }
  if (k.t > 2.2 + (k.home % 3) * 0.6) { k.facing = -k.facing; k.t = 0; }
  if (Math.abs(k.x - k.home) > 1.5 * T) k.facing = Math.sign(k.home - k.x);
  k.x += k.facing * 22 * dt;
  const fast = Math.abs(david.vx) > TUNE.WALK_SPEED * 0.6;
  if (sameLevel && Math.abs(dx) < W4.DOVE_SPOOK * T * (fast ? 1.6 : 1) && david.deadT <= 0) { k.facing = -Math.sign(dx) || 1; setCrit(k, "fly"); }
}
function stoneHitsDove(k, s) {
  setCrit(k, "fly"); k.facing = Math.sign(k.x - david.x) || 1;
  if (!W4.doveTold) { W4.doveTold = true; toast("A dove! They do no harm. Save your stones for the crows in the vines."); }
  return false;   // the stone flies on
}
function drawDove(k, x) {
  if (k.state === "fly" && SPR.dove_fly) { const i = k.t < 0.3 ? Math.min(2, Math.floor(k.t / 0.1)) : 3 + Math.floor(k.t * 11) % 3; drawSprite("dove_fly", i, x, k.y, k.facing, W4.DOVE_SIZE, k.alpha); }
  else if (SPR.dove_walk) drawSprite("dove_walk", frameOf("dove_walk", k.t), x, k.y, k.facing, W4.DOVE_SIZE, k.alpha);
}

// ---------------------------------------------------------------------------
// The vineyard keeper (made up): his vines torn up by the boars (Psalm 80:13). Drive off the boars in his vineyard and
// he thanks you with grapes. Glen's sheet: 0 standing, 1 talking, 2 pointing back, 3 head-shake, 4 laughing, 5 waving.
// ---------------------------------------------------------------------------
const keeper = { talk: talks.find(t => t.who === "The vineyard keeper"), thanked: false };
if (keeper.talk) keeper.boars = critters.filter(k => k.kind === "boar" && k.home > keeper.talk.x && k.home < keeper.talk.x + 40 * T);
function updateKeeper() {
  if (!keeper.talk || keeper.thanked || !keeper.boars.length || !keeper.boars.every(b => b.gone)) return;
  keeper.thanked = true;
  sayLine("The vineyard keeper", "You drove the boars out of my vines! Bless you, young man. Take some grapes for the road. Gibeah is straight on, up the hill.");
  for (let n = 0; n < 3; n++) pickups.push({ name: "grapes", x: david.x + (n + 1) * 46 * (david.facing || 1), y: david.y, t: Math.random() * 6, taken: false });
}
function drawKeeper(camX) {
  if (!keeper.talk || !SPR.vineyard_keeper) return;
  const kx = keeper.talk.x + 2 * T, x = kx - camX; if (x < -200 || x > W + 200) return;
  const talking = dialog.t > 0 && dialog.who === "The vineyard keeper", now = performance.now() / 1000;
  let i = 0;
  if (talking) i = keeper.thanked ? (Math.floor(now * 1.5) % 2 ? 4 : 1) : (Math.floor(now * 1.2) % 3 === 2 ? 3 : 1);
  else if (keeper.thanked) i = david.x > kx + 4 * T ? 5 : 0;
  drawSprite("vineyard_keeper", i, x, GR * T, -(Math.sign(david.x - kx) || -1), W4.KEEPER_SIZE);   // his art faces left
}

// ---------------------------------------------------------------------------
// Hooks: called from world1.js (critters), main.js (each frame and drawing)
// ---------------------------------------------------------------------------
// The lost things of 4-1: five more gifts Father packed (lostGift(name, c, r) in main.js), shaken loose on the road
const LOST_GIFT_NAMES = { bread: "a bundle of loaves", oil: "the jar of olive oil", figs: "the string of dried figs", cheese: "the cheese wrapped in leaves", honey: "the jar of honey" };
function updateLostGifts(dt) {
  if (!lostGifts.length) return;
  if (!W4.giftsTold && david.x > 12 * T) { W4.giftsTold = true; toast("Father packed more gifts for the king, and five shook loose on the rough road. Some are well hidden."); }
  for (const g of lostGifts) {
    g.t += dt; if (g.taken) continue;
    if (Math.abs(david.x - g.x) < 42 && Math.abs(david.y - g.y) < 80 && david.deadT <= 0) {
      g.taken = true; sfx("olive_pickup", g.x, 1, 0.9); if (typeof chime === "function") chime(6);
      const n = lostGifts.filter(q => q.taken).length;
      toast(n === lostGifts.length ? `You found ${LOST_GIFT_NAMES[g.name]}! All ${n} of Father's gifts.` : `You found ${LOST_GIFT_NAMES[g.name]}! (${n} of ${lostGifts.length})`);
      for (let k = 0; k < 12; k++) bits.push({ x: g.x, y: g.y - 30, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 400, life: 0.8, color: k % 2 ? "#ffd84a" : "#fff2b0" });
    }
  }
}
function drawLostGifts(camX) {
  for (const g of lostGifts) {
    if (g.taken) continue; const x = g.x - camX; if (x < -80 || x > W + 80) continue;
    goldGlow(x, g.y, g.t);
    drawItem("gift_" + g.name, x, g.y + 2 + Math.sin(g.t * 2) * 2, 0.36);
  }
}
function drawLostThings() {   // main.js drawSheepCount: World 4's counter (true = drawn instead of the sheep)
  const L = lostThingsTally(); if (!L) return false;
  if (L.icon === "goat") drawSprite("goat_stand", 0, HUD_X + 14, 224, 1, 0.42);
  else if (L.icon === "hen") drawSprite("chicken_peck", 0, HUD_X + 14, 224, 1, 1.2);
  else if (L.icon === "gear") drawItem("tobi_sandal", HUD_X + 14, 228, 0.24);
  else if (L.icon === "cairn") drawItem("cairn_up", HUD_X + 14, 232, 0.16);
  else if (L.icon === "donkey") drawSprite("donkey_idle", 0, HUD_X + 14, 230, 1, 0.42);
  else if (L.icon === "soldier") drawSprite("soldier_run", 0, HUD_X + 14, 236, 1, 0.2);
  else if (L.icon === "stone") hudIcon("stone", HUD_X, 198, 32);   // (7-3's smooth stones)
  else if (L.icon === "sheep") hudIcon("sheep", HUD_X, 200, 32);   // (7-2's remembered sheep)
  else if (L.icon === "lamp") drawItem("hall_lamp_lit", HUD_X + 14, 228, 0.16); else drawItem("gift_honey", HUD_X + 14, 224, 0.24);
  hudText(`${L.found}/${L.total}`, HUD_X + 40, 220);
  questItems.forEach((q, i) => { ctx.save(); ctx.globalAlpha = q.taken ? 1 : 0.35; drawQuestIcon(q.name, HUD_X + 6 + i * 44, 290, 0.8); ctx.restore(); });   // 4-3: the harp's three things
  if (lost.some(sh => sh.one)) hudIcon("sheep_one", HUD_X + 92, 190, 42, line.some(sh => sh.one) ? 1 : 0.3);
  return true;
}
// ---------------------------------------------------------------------------
// Old letters (Glen): Paleo-Hebrew letters carved faintly on rocks and walls in World 4 and 5, a trail to the Cave of
// the Name (DESIGN 5-2). Stand still beside one and a clue comes up; found letters are kept (progress.letters).
// The letter shapes are the Phoenician block of Unicode (the same script), in the font "Segoe UI Historic".
// ---------------------------------------------------------------------------
const OLD_LETTERS = {
  yod:   { ch: "\u{10909}", clue: "Old letters carved in the rock, worn almost smooth. This one is Yod: it was drawn as a hand. The first letter of a name worth remembering." },
  he:    { ch: "\u{10904}", clue: "A letter carved here long ago: He. It was drawn as a man with his arms raised, as if shouting for joy." },
  waw:   { ch: "\u{10905}", clue: "A letter cut into the rock: Waw, a tent peg. A peg joins things together, and the word waw means \"and\"." },
  dalet: { ch: "\u{10903}", clue: "A letter scratched here: Dalet, a door. Two Dalets with a Waw between them spell a shepherd boy's name." },
};
W4.LETTER_H = 60;   // px tall, Glen's gold letters (name_letter_*) where the old letters are carved
const letterFont = () => { try { return document.fonts.check('40px "Segoe UI Historic"'); } catch (e) { return true; } };
function updateInscriptions(dt) {
  for (const n of inscriptions) {
    const near = Math.abs(david.x - n.x) < 2.3 * T && Math.abs(david.y - n.y) < 3 * T && Math.abs(david.vx) < 20 && david.onGround && david.deadT <= 0;
    n.still = near ? n.still + dt : 0;
    if (n.still > 0.7 && !n.read) {
      n.read = true; if (typeof chime === "function") chime(3);
      let isNew = false;
      try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.letters = p.letters || [];
        if (!p.letters.includes(n.letter)) { isNew = true; p.letters.push(n.letter); localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } } catch (e) {}
      // a new one: he sits and copies it into his Journal, with what it pictured (Glen, 2026-10-18)
      const note = isNew && typeof letterNote === "function" && caveatReady ? letterNote(n.letter, OLD_LETTERS[n.letter].clue) : null;
      if (note) { david.vx = 0; hushLoops(); Journal.openNote(note); }
      else sayLine("", OLD_LETTERS[n.letter].clue + (isNew ? "" : " (It's already in your Journal.)"));
    }
  }
}
function drawInscriptions(camX) {
  if (!inscriptions.length) return;
  const now = performance.now() / 1000;
  if (inscriptions.every(n => ITEM["name_letter_" + n.letter] && ITEM["name_letter_" + n.letter].naturalWidth)) {   // Glen's gold letters, burning in the rock
    for (const n of inscriptions) {
      const x = n.x - camX; if (x < -60 || x > W + 60) continue;
      const img = ITEM["name_letter_" + n.letter], h = W4.LETTER_H, w = img.naturalWidth * h / img.naturalHeight;
      const flick = 0.06 * Math.sin(now * 7.3 + n.x) + 0.04 * Math.sin(now * 13.1 + n.y);
      const a = Math.min(1, 0.9 + flick);
      ctx.save(); ctx.globalCompositeOperation = "lighter";   // a warm halo behind it
      const g = ctx.createRadialGradient(x, n.y, 4, x, n.y, h * 0.9); g.addColorStop(0, `rgba(255,200,80,${0.32 * a})`); g.addColorStop(1, "rgba(255,170,40,0)");
      ctx.fillStyle = g; ctx.fillRect(x - h, n.y - h, h * 2, h * 2); ctx.restore();
      ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = "rgba(255,140,20,0.95)"; ctx.shadowBlur = 16 + 6 * flick * 10;   // burning: an orange glow
      ctx.drawImage(img, x - w / 2, n.y - h / 2, w, h);
      ctx.shadowBlur = 0; ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.35 + flick; ctx.drawImage(img, x - w / 2, n.y - h / 2, w, h); ctx.restore();
    }
    return;
  }
  if (!letterFont()) return;
  ctx.save(); ctx.font = '34px "Segoe UI Historic"'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const n of inscriptions) {
    const x = n.x - camX; if (x < -60 || x > W + 60) continue;
    const a = n.read ? 0.55 : 0.32 + 0.2 * Math.min(1, n.still / 0.7);   // faint until you stop and look
    ctx.fillStyle = `rgba(255,250,235,${a * 0.6})`; ctx.fillText(OLD_LETTERS[n.letter].ch, x, n.y + 2);   // the lit lower lip
    ctx.fillStyle = `rgba(40,34,30,${a})`; ctx.fillText(OLD_LETTERS[n.letter].ch, x, n.y);                // the groove
  }
  ctx.restore();
}
// ---------------------------------------------------------------------------
// 4-2 The Training Yard: Gera's sling course. Targets (setPiece "target", { move: "rope" | "swing" }), clay jars on the
// battlements (setPiece "jar"), a guard dog that chases David (critter "guarddog"), and five stray palace goats
// (critter "goat" with .stray: they follow once found, and count as the stage's lost things).
// ---------------------------------------------------------------------------
Object.assign(W4, { TARGET_R: 24, ROPE_AMP: 2.2, SWING_AMP: 0.9, GUARD_RUN: 330, GUARD_GIVEUP: 4.5 });
const targets = setPieces.filter(p => p.kind === "target" || p.kind === "jar").map(p => ({ ...p, hit: false, fallT: 0, ph: (p.c % 7) * 0.9 }));
function targetPos(t, now) {   // where a target is right now (rope targets bob up and down, swinging ones swing)
  if (t.kind === "jar") return { x: t.x, y: t.y - 30 };
  const cy = t.r * T + T / 2;
  if (t.move === "rope") return { x: t.x, y: cy + Math.sin(now * 1.4 + t.ph) * W4.ROPE_AMP * T };
  if (t.move === "swing") { const a = Math.sin(now * 1.7 + t.ph) * W4.SWING_AMP, L = 3 * T; return { x: t.x + Math.sin(a) * L, y: cy - 3 * T + Math.cos(a) * L, a }; }
  return { x: t.x, y: cy };
}
function stoneHitsWorld4(s) {   // main.js stone loop
  if (!targets.length) return false;
  const now = performance.now() / 1000;
  for (const t of targets) {
    if (t.hit) continue;
    const p = targetPos(t, now), r = t.kind === "jar" ? 26 : W4.TARGET_R;
    if (Math.hypot(s.x - p.x, s.y - p.y) > r + 6) continue;
    t.hit = true; t.hx = p.x; t.hy = p.y; stoneHit(s, 0.5);
    for (let k = 0; k < (t.kind === "jar" ? 16 : 10); k++) bits.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 420, vy: -Math.random() * 420, life: 0.8, color: t.kind === "jar" ? (k % 2 ? "#b8693a" : "#8a4a26") : (k % 2 ? "#c0392b" : "#e8d3a8") });
    david.olives++; david.gathered++;
    const left = targets.filter(q => !q.hit).length, n = targets.length - left;
    if (!left) { toast(`Every target and jar in the yard! "Do you see a man skilled in his work? He will serve kings." (Proverbs 22:29)`); david.lives++; sfx("extra_life"); }
    else if (n === 1 || n % 4 === 0) toast(`${t.kind === "jar" ? "Smash!" : "Thwack!"} ${n} of ${targets.length} in the yard. (An olive for each.)`);
    return !s.power;
  }
  return false;
}
function drawTargets(camX) {
  const now = performance.now() / 1000;
  for (const t of targets) {
    const p = t.hit ? { x: t.hx, y: t.hy + Math.min(400, t.fallT * t.fallT * 900) } : targetPos(t, now);
    if (t.hit) { t.fallT += 1 / 60; if (t.fallT > 1.2) continue; }
    const x = p.x - camX; if (x < -150 || x > W + 150) continue;
    ctx.save();
    if (!t.hit && t.move === "rope") { ctx.strokeStyle = "#7a5a32"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, p.y - 8 * T); ctx.lineTo(x, p.y - W4.TARGET_R); ctx.stroke(); }
    if (!t.hit && t.move === "swing") { const top = t.r * T + T / 2 - 3 * T; ctx.strokeStyle = "#7a5a32"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(t.x - camX, top); ctx.lineTo(x, p.y - W4.TARGET_R); ctx.stroke(); ctx.fillStyle = "#5a3e22"; ctx.fillRect(t.x - camX - 30, top - 6, 60, 8); }
    if (t.kind === "jar") { ctx.globalAlpha = t.hit ? Math.max(0, 1 - t.fallT) : 1; drawItem("gift_oil", x, p.y + 30, 0.36); ctx.restore(); continue; }
    if (!t.hit && !t.move) { ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x - 4, p.y, 8, t.y - p.y); }   // its post
    ctx.translate(x, p.y); if (t.hit) { ctx.rotate(t.fallT * 6); ctx.globalAlpha = Math.max(0, 1 - t.fallT); }
    const R = W4.TARGET_R;   // a straw-and-wood target, painted rings
    ctx.fillStyle = "#c9a56a"; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#6b4a2a"; ctx.lineWidth = 3; ctx.stroke();
    if (!t.hit) { ctx.strokeStyle = `rgba(255,216,74,${0.55 + 0.3 * Math.sin(performance.now() / 300 + t.ph)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, R + 4, 0, Math.PI * 2); ctx.stroke(); }   // a gold rim: these are the ones to hit (the painted yard has targets too)
    for (const [rr, col] of [[R * 0.72, "#a8322a"], [R * 0.48, "#efe3c4"], [R * 0.24, "#a8322a"]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, rr, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
}
// the guard dog: runs at David barking, snaps once, then loses interest and trots off. A stone sends it off.
CRITTER_ART.guarddog = { box: k => ({ x0: k.x - 50, x1: k.x + 50, y0: k.y - 60, y1: k.y }) };
function updateGuardDog(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle") {
    fall(); k.facing = Math.sign(dx) || k.facing;
    if (sameLevel && Math.abs(dx) < W4.DOG_SEE * T && david.deadT <= 0) { setCrit(k, "run"); sfx("wolf_bark", k.x, 0.9); if (!W4.guardTold) { W4.guardTold = true; toast("A guard dog! It'll chase you for a while. Outrun it, or a stone sends it off."); } }
    return;
  }
  if (k.state === "run") {
    if (!sameLevel || Math.abs(dx) < 36) {   // David's up out of reach (or right on top of it): it stands its ground, barking
      fall(); if (Math.abs(dx) > 50) k.facing = Math.sign(dx);
    } else {
      k.facing = Math.sign(dx);
      if (!runCritter(k, W4.GUARD_RUN, dt) && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);
    }
    if (Math.floor(k.t * 1.6) !== Math.floor((k.t - dt) * 1.6)) sfx("wolf_bark", k.x, 0.6, 1.1);
    if (touchesDavid(critterBox(k)) && !k.bit) { k.bit = true; hurtDavid(k.x); }
    if (k.t > W4.GUARD_GIVEUP) { k.gone = true; k.facing = -k.facing; k.vx = k.facing * 200; toast("The guard dog lost interest and trotted off."); }
  }
}
function stoneHitsGuardDog(k, s) { k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 420; stoneHit(s, 0.6); toast("The guard dog ran off, yelping."); return !s.power; }
// stray palace goats (4-2's lost things): world3.js's goat, with other words
if (LEVEL_STAGE === "4-2") for (const k of critters) if (k.kind === "goat") k.stray = true;
// Gera (Glen's sheet, facing left): 0 standing, 1 talking, 2 whirling the sling, 3 letting fly, 4 laughing, 5 arms crossed.
// He waits at his next line not yet said; teaching quick release he shows it (2-3), and at the end he laughs.
TUNE.SPRITE_SIZE.gera = 1.12;   // a grown man, a head taller than David
function drawGera(camX) {
  const mine = talks.filter(t => t.who === "Gera"); if (!mine.length || !SPR.gera) return;
  const k = mine.findIndex(t => !t.done), cur = k < 0 ? mine.length - 1 : Math.max(0, k - (dialog.t > 0 && dialog.who === "Gera" ? 1 : 0));
  let at = cur; while (at > 0 && mine[at].x - mine[at - 1].x <= 4 * T) at--;   // lines a few tiles apart are one stop: he stays put
  const gx = mine[at].x + 2 * T, x = gx - camX; if (x < -200 || x > W + 200) return;
  const talking = dialog.t > 0 && dialog.who === "Gera", now = performance.now() / 1000;
  let i = 0;
  if (talking) i = cur === 1 ? (Math.floor(now * 2.2) % 2 ? 3 : 2) : cur === mine.length - 1 ? (Math.floor(now * 1.4) % 2 ? 4 : 1) : 1;
  else if (k < 0) i = 5;
  drawSprite("gera", i, x, GR * T, -(Math.sign(david.x - gx) || -1));
}
// ---------------------------------------------------------------------------
// 4-3 The Broken String (DESIGN): a string on David's harp snaps; the Steward sends him into Gibeah before nightfall for a
// gut string (the market, up on the stall awnings), a tuning peg (the carpenter's beam stacks) and beeswax (past the
// beekeeper's hives; the hornets in the old wall are another matter). Until all three are found the harp can't be played.
//   questItem(name, c, r)           "string" | "peg" | "wax"
//   setPiece("awning", c, r, { w })  a market stall's cloth awning: springy, it bounces David up (hold Down to land)
//   setPiece("clothstall", c)        The One hides under it; it comes out when David plays the mended harp beside it
//   critter("hen", c) in 4-3 = a seller's runaway hens (the lost things): walk up to one slowly to catch it
// ---------------------------------------------------------------------------
const QUEST_NAMES = { string: "a gut string for the harp", peg: "a new tuning peg", wax: "a lump of beeswax" };
const questItems = pendingQuest.map(([name, c, r]) => ({ name, x: c * T + T / 2, y: (r + 1) * T, taken: false, t: Math.random() * 6 }));   // main.js questItem()
const awnings = setPieces.filter(p => p.kind === "awning");
for (const a of awnings) plat(a.c, a.r, a.w);   // you land on the cloth (and bounce: updateTown)
const clothStall = setPieces.find(p => p.kind === "clothstall");
if (LEVEL_STAGE === "4-3") for (const k of critters) if (k.kind === "hen") k.lostHen = true;
const harpMended = () => !questItems.length || questItems.every(q => q.taken);
function harpBroken() {   // main.js: the harp can't be played until the string, the peg and the wax are found
  if (harpMended()) return false;
  if (!W4.harpTold || W4.harpTold < performance.now() - 6000) { W4.harpTold = performance.now(); toast(`The broken string! Still to find: ${questItems.filter(q => !q.taken).map(q => QUEST_NAMES[q.name]).join(", ")}.`); }
  return true;
}
function questBlocking() {   // main.js: back to the Steward only with all three
  if (!questItems.length || harpMended()) return null;
  return `The Steward needs you to bring ${questItems.filter(q => !q.taken).map(q => QUEST_NAMES[q.name]).join(" and ")} first.`;
}
function updateTown(dt) {
  for (const q of questItems) {
    q.t += dt; if (q.taken) continue;
    if (Math.abs(david.x - q.x) < 40 && Math.abs(david.y - q.y) < 80 && david.deadT <= 0) {
      q.taken = true; sfx("olive_pickup", q.x, 1, 1.1); if (typeof chime === "function") { chime(5); setTimeout(() => chime(8), 150); }
      const left = questItems.filter(o => !o.taken).length;
      toast(left ? `You found ${QUEST_NAMES[q.name]}! ${left} more for the harp.` : `${QUEST_NAMES[q.name][0].toUpperCase() + QUEST_NAMES[q.name].slice(1)}! That's everything. David restrings his harp: it can be played again.`);
    }
  }
  // the awnings: land on one and it springs you up
  const d = david;
  if (d.onGround && d.vy >= 0 && !held("down") && d.deadT <= 0) for (const a of awnings) {
    if (d.x > a.c * T && d.x < (a.c + a.w) * T && Math.abs(d.y - a.r * T) < 3) {
      d.vy = -TUNE.JUMP_SPEED * (held("a") ? 1.3 : 1.1); d.onGround = false; a.boing = 1; sfx("jump", d.x, 0.5, 0.75);
      if (!W4.awningTold) { W4.awningTold = true; toast("Boing! The awnings are springy. Hold A on the bounce to go higher; hold Down to land on one."); }
      break;
    }
  }
  for (const a of awnings) a.boing = Math.max(0, (a.boing || 0) - dt * 3);
  // The One: under the cloth stall; out it comes when the mended harp is played beside it
  if (clothStall && !clothStall.out && harpMended() && d.state === "harp" && Math.abs(d.x - clothStall.x) < 4 * T) {
    clothStall.out = true;
    const o = newSheep({ kind: "lamb", how: "one", one: true, hx: clothStall.x + T, hy: GR * T }); lost.push(o);
    toast("Something moved under the cloth stall... a lamb! It came out to the sound of the harp.");
  }
  if (clothStall && !clothStall.hinted && Math.abs(d.x - clothStall.x) < 2 * T && !clothStall.out) { clothStall.hinted = true; sayLine("", harpMended() ? "A faint bleat from under the cloth stall. Something's hiding there, too frightened to come out. Maybe a song would coax it out (Select)." : "A faint bleat from under the cloth stall. Something's too frightened to come out. Once your harp is mended, a song might coax it out."); }
}
function updateLostHen(k, dt) {   // world3.js updateHen: a runaway hen lets you scoop her up if you walk, not run
  if (!k.lostHen || k.gone) return false;
  const near = Math.abs(david.x - k.x) < 1.3 * T && Math.abs(david.y - k.y) < 60 && david.deadT <= 0;
  if (near && Math.abs(david.vx) <= TUNE.WALK_SPEED * 1.1) {   // walking (or standing), not running
    k.gone = true; k.caught = true; k.alpha = 0; sfx("olive_pickup", k.x, 0.7, 1.3);
    const n = critters.filter(h => h.lostHen && h.caught).length, all = critters.filter(h => h.lostHen).length;
    toast(n === all ? `All ${all} of the poultry seller's hens caught!` : `Caught one of the seller's runaway hens! (${n} of ${all}) Walk up slowly: running scares them.`);
    return true;
  }
  return false;
}
function drawQuestIcon(name, x, y, s = 1) {   // Glen's items (quest_string/peg/wax), or drawn ones
  const art = ITEM["quest_" + name]; if (art && art.naturalWidth) { drawItem("quest_" + name, x, y, 0.26 * s); return; }
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (name === "string") { ctx.strokeStyle = "#e9dcc0"; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(0, -16, 14 - k * 3, 9 - k * 2, 0, 0, Math.PI * 2); ctx.stroke(); } }
  else if (name === "peg") { ctx.fillStyle = "#8a5a2e"; ctx.fillRect(-4, -34, 8, 30); ctx.fillStyle = "#a8743e"; ctx.beginPath(); ctx.ellipse(0, -36, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.fillStyle = "#e8b83a"; ctx.beginPath(); ctx.ellipse(0, -12, 16, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "rgba(255,240,170,0.8)"; ctx.beginPath(); ctx.ellipse(-5, -16, 5, 3, -0.4, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function drawTown(camX) {
  const now = performance.now() / 1000;
  for (const a of awnings) {   // striped cloth over a stall: poles, a sagging striped top that dips when bounced on
    const x0 = a.c * T - camX, x1 = (a.c + a.w) * T - camX, y = a.r * T; if (x1 < -40 || x0 > W + 40) continue;
    const sag = 6 + (a.boing || 0) * 14, cols = ["#b5352d", "#efe0c0", "#2f6f8a", "#efe0c0"], ci = a.c % 2 ? 2 : 0;
    ctx.save(); ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x0 + 2, y, 6, GR * T - y); ctx.fillRect(x1 - 8, y, 6, GR * T - y);
    const n = Math.max(4, a.w * 2);
    for (let k = 0; k < n; k++) {
      const xa = x0 + (x1 - x0) * k / n, xb = x0 + (x1 - x0) * (k + 1) / n, sa = Math.sin(Math.PI * k / n) * sag, sb = Math.sin(Math.PI * (k + 1) / n) * sag;
      ctx.fillStyle = cols[(ci + k % 2) % 4]; ctx.beginPath(); ctx.moveTo(xa, y - 4 + sa); ctx.lineTo(xb, y - 4 + sb); ctx.lineTo(xb, y + 12 + sb); ctx.lineTo(xa, y + 12 + sa); ctx.fill();
    }
    ctx.restore();
  }
  if (clothStall) {   // a low table draped with cloth to the ground (The One under it)
    const x = clothStall.x - camX, y = GR * T;
    if (x > -150 && x < W + 150 && ITEM.cloth_stall && ITEM.cloth_stall.naturalWidth) {   // Glen's draped stall
      const w = !clothStall.out && Math.sin(now * 0.7) > 0.6 ? Math.sin(now * 9) * 1.5 : 0;   // a little shiver now and then
      drawItem("cloth_stall", x + w, y + 4, 0.42);
    } else if (x > -150 && x < W + 150) {
      ctx.save(); ctx.fillStyle = "#7d4a8a"; ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.lineTo(x - 52, y - 54); ctx.lineTo(x + 52, y - 54); ctx.lineTo(x + 60, y); ctx.fill();
      ctx.fillStyle = "#e6c96a"; ctx.fillRect(x - 52, y - 58, 104, 8);
      if (!clothStall.out) { const w = Math.sin(now * 9) * (Math.sin(now * 0.7) > 0.6 ? 2 : 0); ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x - 40 + w, y - 14, 80, 14); }   // a little shiver
      ctx.restore();
    }
  }
  for (const q of questItems) {
    if (q.taken) continue; const x = q.x - camX; if (x < -60 || x > W + 60) continue;
    goldGlow(x, q.y, q.t);
    const art = ITEM["quest_" + q.name];
    if (art && art.naturalWidth) drawItem("quest_" + q.name, x, q.y + Math.sin(q.t * 2) * 2, 0.36); else drawQuestIcon(q.name, x, q.y + Math.sin(q.t * 2) * 2);
  }
}
// the Steward (made up): the palace's old head servant, "the one who tells you the truth" (Hanan, World 4's opening).
// Glen's sheet, facing left: 0 standing, 1 talking, 2 pointing, 3 hands folded, 4 shaking his head, 5 a small smile.
TUNE.SPRITE_SIZE.steward = 1.15;
const STEWARD_POSE = [[1, 4], [2, 1], [1, 3]];   // per line: the two poses he moves between while he says it
const STEWARD_AT_FIRE = 1.6;   // tiles right of his campfire's middle that he stands
function drawSteward(camX) {
  if (!SPR.steward) return;
  for (const f of fires) {   // (Glen, 2026-10-26) at his fire too (4-4's first), standing just past it, facing David
    if (f.who !== "The Steward") continue;
    const fx = f.x + STEWARD_AT_FIRE * T, x = fx - camX; if (x < -200 || x > W + 200) continue;
    const talking = dialog.t > 0 && dialog.who === "The Steward" && Math.abs(david.x - f.x) < 6 * T;
    drawSprite("steward", talking ? [1, 2][Math.floor(performance.now() / 1000 * 1.1) % 2] : 3, x, f.y, -(Math.sign(david.x - fx) || -1));
  }
  const mine = talks.filter(t => t.who === "The Steward"); if (!mine.length) return;
  const talking = dialog.t > 0 && dialog.who === "The Steward", k = mine.findIndex(t => !t.done);
  const cur = k < 0 ? mine.length - 1 : Math.max(0, k - (talking ? 1 : 0));
  const sx = mine[cur].x + 2 * T, x = sx - camX; if (x < -200 || x > W + 200) return;
  const P = STEWARD_POSE[Math.min(cur, STEWARD_POSE.length - 1)], now = performance.now() / 1000;
  const i = talking ? P[Math.floor(now * 1.1) % 2] : k < 0 && harpMended() ? 5 : 3;
  drawSprite("steward", i, x, GR * T, -(Math.sign(david.x - sx) || -1));
}
// ---------------------------------------------------------------------------
// 4-4 The King's Hall (DESIGN): the palace at night, a storm outside. Shadows drift through the halls (setPiece "wisp"):
// they don't hurt, but touching one makes David shiver to a stop. The hall lamps (setPiece "hall_lamp") are the lost
// things: walk up to one and it's lit, and the shadows near it melt away. The One hides under the great staircase.
// At the end, BOSS Saul's Torment (setPiece "throne"): won with music, not the sling. Sit by the king and play (the harp
// duel, world2.js, kind "saul"): David's notes from Glen's Morning Meditation 1 over the dark Harp of the Deep. Steady
// tunes push the shadows back; misses let them creep in; rushing (pressing early) makes them surge (the Steward's
// warning). If the shadows reach the king, he sends David out: back to the servants' fire, where the Steward's tier-2
// counsel makes it gentler. The tunes go in three parts: the quiet part, the storm, the new part. Then he sleeps (16:23).
// ---------------------------------------------------------------------------
Object.assign(W4, { WISP_DRIFT: 55, WISP_SHIVER: 0.8, LAMP_REACH: 1.4, LAMP_CLEAR: 7,
  SAUL_SIZE: 1.25, THRONE_SIZE: 0.44, SAUL_MISS: 0.3, SAUL_RUSH: 0.12, SAUL_TUNE: 0.15, SAUL_ARENA: 9 });
Object.assign(TUNE.SPRITE_SIZE, { saul: W4.SAUL_SIZE, saul_torment: W4.SAUL_SIZE, saul_joy: W4.SAUL_SIZE, saul_sad: W4.SAUL_SIZE });
// Glen's other Saul sheets: saul_torment (0 lurching, 1 head in hands, 2 fists, 3 shouting, 4 arms flung out, 5 clutching
// his robe), saul_joy (arms raised, for the End of World 4), saul_sad (head bowed).
const wisps = setPieces.filter(p => p.kind === "wisp").map(p => ({ hx: p.x, hy: p.r * T, x: p.x, y: p.r * T, ph: (p.c % 9) * 0.7, alpha: 1, gone: false }));
const hallLamps = setPieces.filter(p => p.kind === "hall_lamp").map(p => ({ x: p.x, y: GR * T, lit: false, t: 0 }));
const throne = setPieces.find(p => p.kind === "throne");
const saul = { calm: false, darkVol: 0 };
const darkSong = Object.assign(new Audio(`../assets/audio/saul_dark.mp3?v=${window.BUILD || 0}`), { loop: true, volume: 0, _music: true });
function updateHall(dt) {
  const d = david;
  if (d.shiverT > 0) d.shiverT -= dt;
  for (const L of hallLamps) {
    L.t += dt; if (L.lit) continue;
    if (Math.abs(d.x - L.x) < W4.LAMP_REACH * T && Math.abs(d.y - L.y) < 90 && d.deadT <= 0) {
      L.lit = true; sfx("heal", L.x, 0.5, 1.2); if (typeof chime === "function") chime(7);
      const n = hallLamps.filter(q => q.lit).length;
      toast(n === hallLamps.length ? `All ${n} hall lamps are lit. "The LORD is near to those who have a broken heart" (Psalm 34:18).` : `You lit a hall lamp, and the shadows near it melt away. (${n} of ${hallLamps.length})`);
    }
  }
  for (const w of wisps) {
    if (w.gone) { w.alpha = Math.max(0, w.alpha - dt * 1.2); continue; }
    if (hallLamps.some(L => L.lit && Math.abs(L.x - w.x) < W4.LAMP_CLEAR * T)) { w.gone = true; continue; }   // the light drives it off
    const dx = d.x - w.x, dy = d.y - 60 - w.y, dist = Math.hypot(dx, dy);
    if (dist < 7 * T) { w.x += dx / dist * W4.WISP_DRIFT * dt; w.y += dy / dist * W4.WISP_DRIFT * 0.5 * dt; }   // slowly after him
    else { w.x += (w.hx - w.x) * dt * 0.3; w.y += (w.hy - w.y) * dt * 0.3; }
    if (dist < 52 && !(d.shiverT > 0) && d.deadT <= 0) {
      d.shiverT = W4.WISP_SHIVER; d.vx = 0;
      if (!W4.shiverTold) { W4.shiverTold = true; toast("Brr... a cold shadow. It doesn't hurt, but it stops you in your tracks. Light the lamps: the dark keeps back from the light."); }
    }
  }
  updateSaul(dt);
}
// --- Saul's Torment
const saulPhase = () => { const g = harpDuel; if (!g.active || g.kind !== "saul") return saul.calm ? 3 : 0; return g.phrase < 2 ? 0 : g.phrase < 4 ? 1 : 2; };
function saulDuelTarget(d) {   // world2.js harpDuelTarget: sitting by the troubled king
  if (!throne || saul.calm || Math.abs(d.x - throne.x) > 6 * T) return null;
  return { duelKind: "saul" };
}
function inThroneRoom() { return throne && !saul.calm && david.x > throne.x - W4.SAUL_ARENA * T && david.deadT <= 0; }
function updateSaul(dt) {
  if (!throne) return;
  const d = david, g = harpDuel, duel = g.active && g.kind === "saul";
  if (inThroneRoom() && !W4.throneTold) { W4.throneTold = true; toast("King Saul, troubled on his throne. Sit beside him and play (Select)."); }
  if (duel) {
    g.dark = g.dark || 0;
    if (dialog.t > 0 && dialog.who !== "King Saul") dialog.t = 0;   // nobody talks over the song
    const ph = saulPhase();
    if (ph !== g.lastPh) {   // a new part of the song
      if (ph === 1) { toast("Thunder outside... the king cries out. Steady, David. Don't rush."); sfx("thunder", undefined, 0.9); saul.flash = 1; }
      if (ph === 2) toast("The new part of the song. The shadows begin to thin.");
      g.lastPh = ph;
    }
    if (g.dark >= 1) saulSendsOut();
  }
  saul.flash = Math.max(0, (saul.flash || 0) - dt * 2);
  saul.t = (saul.t || 0) + dt;
  if (saul.outT > 0) saul.outT -= dt;
  // the dark song: under everything in the throne room, louder as the shadows grow, fading as he's calmed
  const want = saul.calm || !inThroneRoom() ? 0 : duel ? Math.max(0.05, 0.22 + 0.5 * g.dark - 0.18 * g.calm + (saulPhase() === 1 ? 0.15 : 0)) : 0.32;
  saul.darkVol += (want - saul.darkVol) * Math.min(1, dt * 1.5);
  darkSong.volume = Math.max(0, Math.min(1, saul.darkVol * TUNE.SFX_VOLUME * 1.6));
  if (saul.darkVol > 0.01 && darkSong.paused && audioUnlocked) darkSong.play().catch(() => {});
  if (saul.darkVol <= 0.01 && !darkSong.paused) darkSong.pause();
}
function saulMiss(rushed) {   // world2.js: a missed or rushed note
  const g = harpDuel; g.dark = (g.dark || 0) + (rushed ? W4.SAUL_RUSH : W4.SAUL_MISS) * (W4.counsel2 ? 0.6 : 1);
  if (rushed && !W4.rushTold) { W4.rushTold = true; toast("Too soon! Rushing makes it worse. Play steady: wait for each note to reach the harp."); }
}
function saulTune() { const g = harpDuel; g.dark = Math.max(0, (g.dark || 0) - W4.SAUL_TUNE); }   // a whole tune: the shadows draw back
function saulCalmed() {
  saul.calm = true; sfx("heal", undefined, 0.7);
  toast("The hall goes quiet. King Saul leans back... and sleeps. \"Saul was refreshed and was well\" (1 Samuel 16:23).");
}
function saulSendsOut() {
  endHarpDuel(); const d = david; d.harp = false; harpDuel.dark = 0;
  sayLine("King Saul", "Leave me! Get out, all of you!"); saul.outT = 2.5;
  setTimeout(() => {
    Object.assign(d, { x: checkpoint.x, y: checkpoint.y, vx: 0, vy: 0 }); setState("idle"); camX = Math.max(0, d.x - W / 2);
    if (!W4.counsel2 && !TRIAL) { W4.counsel2 = true; HARP_DUEL.saul.window = 0.32 * DIFF.open;   // (none in the Shepherd's Trial)
      sayLine("The Steward", "Sit down. Tell me what happened. ... It's not your fault, boy. Go back. Slower this time: let each note come to you."); }
    else toast("Back by the servants' fire. Go back to him when you're ready.");
  }, 1600);
}
function drawThrone(x) {   // the empty throne while he's up: Glen's item (assets/items/throne.png), when there is one
  if (ITEM.throne && ITEM.throne.naturalWidth) drawItem("throne", x + 60 * SCALE * W4.SAUL_SIZE, GR * T + 2, W4.THRONE_SIZE);   // where the chair is in his seated frames
}
function saulBlocking() { return throne && !saul.calm ? "The king is still troubled. Sit by him and play first." : null; }
function drawHall(camX) {
  const now = performance.now() / 1000;
  for (const L of hallLamps) {
    const x = L.x - camX; if (x < -100 || x > W + 100) continue;
    if (L.lit) { ctx.save(); ctx.globalCompositeOperation = "lighter"; const r = 130 + Math.sin(now * 7 + L.x) * 6, g = ctx.createRadialGradient(x + 20, L.y - 140, 6, x + 20, L.y - 140, r);
      g.addColorStop(0, "rgba(255,190,90,0.45)"); g.addColorStop(1, "rgba(255,150,60,0)"); ctx.fillStyle = g; ctx.fillRect(x + 20 - r, L.y - 140 - r, r * 2, r * 2); ctx.restore(); }
    else goldGlow(x, L.y, L.t);
    drawItem(L.lit ? "hall_lamp_lit" : "hall_lamp_unlit", x, L.y + 4, 0.48);   // (both cut at the same scale: lighting it doesn't change its size)
  }
  for (const w of wisps) {
    if (w.alpha <= 0) continue; const x = w.x - camX + Math.sin(now * 0.9 + w.ph) * 14, y = w.y + Math.sin(now * 1.3 + w.ph) * 10;
    if (x < -200 || x > W + 200) continue;
    drawSprite("shadow_wisp", frameOf("shadow_wisp", now + w.ph), x, y, Math.sin(now * 0.4 + w.ph) > 0 ? 1 : -1, 0.9, 0.85 * w.alpha);
  }
  if (!throne) return;
  const x = throne.x - camX; if (x < -400 || x > W + 400) return;
  const g = harpDuel, duel = g.active && g.kind === "saul", dark = duel ? g.dark || 0 : saul.calm ? 0 : 0.7, ph = saulPhase();
  const pose = saul.calm ? 3 : duel ? [0, 1, 2][ph] : 0;
  const up = !saul.calm && SPR.saul_torment && (saul.outT > 0 || !duel || ph === 1);   // on his feet: pacing before you play, in the storm, sending you out
  if (up) {
    const seq = saul.outT > 0 ? [4] : ph === 1 && duel ? [1, 5, 2, 5] : [1, 2, 5, 3, 1, 0];
    const i = seq[Math.floor(saul.t / (duel ? 0.45 : 0.6)) % seq.length], pace = duel || saul.outT > 0 ? 0 : Math.sin(saul.t * 0.5) * 2.5 * T;
    drawThrone(x);
    drawSprite("saul_torment", i, x - 1.5 * T + pace, GR * T, pace && Math.cos(saul.t * 0.5) < 0 ? -1 : 1);
  } else drawSprite("saul", pose, x, GR * T, 1);
  if (!saul.calm || dark > 0) {   // the shadows round his chair: closer and thicker as the dark grows; thinning in the new part
    const n = 7, fade = saul.calm ? 0 : Math.min(1, 0.35 + dark * 0.8 - (duel ? g.calm * 0.35 : 0));
    for (let k = 0; k < n; k++) {
      const a = now * 0.35 + k * Math.PI * 2 / n, rad = 230 - 120 * dark;
      drawSprite("shadow_wisp", (k + Math.floor(now * 2)) % 4, x + Math.cos(a) * rad, GR * T - 150 + Math.sin(a) * rad * 0.45, k % 2 ? 1 : -1, 0.75, fade * 0.8);
    }
  }
  if (saul.flash > 0) { ctx.fillStyle = `rgba(220,230,255,${saul.flash * 0.35})`; ctx.fillRect(0, 0, W, H); }   // lightning in the windows
}
function lostThingsTally() {   // World 4's lost things for the HUD and the clear card (null = it's sheep, as usual)
  if (lostGifts.length) return { found: lostGifts.filter(g => g.taken).length, total: lostGifts.length, things: "gifts", icon: "gift" };
  if (hallLamps.length) return { found: hallLamps.filter(L => L.lit).length, total: hallLamps.length, things: "lamps", icon: "lamp" };
  const hens = critters.filter(k => k.lostHen);
  if (hens.length) return { found: hens.filter(k => k.caught).length, total: hens.length, things: "hens", icon: "hen" };
  const goats = critters.filter(k => k.stray);
  if (goats.length) return { found: goats.filter(k => k.follow).length, total: goats.length, things: "goats", icon: "goat" };
  return null;
}
function updateWorld4(dt) {
  updateInscriptions(dt);
  if (WORLD !== 4) return;
  updateGiftDrops(); updateKeeper(); updateLostGifts(dt); updateTown(dt); updateHall(dt);
}
function drawWorld4(camX) {
  drawInscriptions(camX);
  if (WORLD !== 4) return;
  drawTown(camX); drawHall(camX); drawSteward(camX); drawKeeper(camX); drawGera(camX); drawGiftDrops(camX); drawLostGifts(camX); drawTargets(camX);
}

// ---------------------------------------------------------------------------
// The opening of World 4 (DESIGN "World 4 — Opening scene"), before 4-1 the first time (or ?w4intro): at Jesse's door in
// Bethlehem. The king's messenger rides up and asks for David (1 Samuel 16:19); Eliab can't believe it; Jesse loads the
// donkey (16:20); Hanan at the gate says goodbye. Then the title card, and the road.
// ---------------------------------------------------------------------------
const w4intro = {
  active: false, t: 0, step: 0, stepT: 0, SIZE: 1.5,
  lines: [
    null,   // 0: the messenger rides up, stops and gets down
    ["The king's messenger", "King Saul sends word to Jesse: \"Send me David your son, who is with the sheep.\" (1 Samuel 16:19)"],
    ["Eliab", "Him? For the king?"],
    ["", "Jesse took a donkey loaded with bread, a container of wine, and a young goat, and sent them by David his son to Saul. (1 Samuel 16:20)"],
    ["Hanan", "You're going where I can't follow, David. Palaces are full of people who will tell you what you want to hear. Find the one who tells you the truth, and listen to him."],
    ["Hanan", "I'll be here when you come home."],
    null,   // 6: the title card
  ],
  start() { Object.assign(this, { active: true, t: 0, step: 0, stepT: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.stepT += dt;
    const A = this.stepT > 0.8 && (pressed("a") || pressed("b") || pressed("start"));
    if (this.step === 0) { if (this.stepT > 6.2 || (A && this.stepT > 2)) this.next(); return; }
    if (this.step === 6) { if (this.stepT > 3.2 || A) this.finish(); return; }
    if (A) this.next();
  },
  next() { this.step++; this.stepT = 0; },
  finish() {
    this.active = false;
    try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.w4intro = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
  },
  draw() {
    const y = GR * T, s = this.SIZE, now = performance.now() / 1000, keep = bgWorld;
    bgWorld = "w3_1"; drawBackground(0); bgWorld = keep; drawTownGround(y);   // Bethlehem: Jesse's house in the morning, on the town's dusty ground
    const dx = W * 0.28, jx = W * 0.39, ex = W * 0.49, mx = W * 0.8;
    // the family at the door
    if (SPR.jesse_idle) drawSprite(this.step === 3 && SPR.jesse_talk ? "jesse_talk" : "jesse_idle", frameOf("jesse_idle", now), jx, y, 1, s);
    if (SPR.eliab_arms_crossed) drawSprite("eliab_arms_crossed", frameOf("eliab_arms_crossed", now), ex, y, this.step === 2 ? -1 : 1, s);
    drawSprite("david_idle", frameOf("david_idle", now), dx, y, 1, s);
    // the donkey and the goat, from step 3: led up beside David
    if (this.step >= 3) {
      const f = Math.min(1, this.stepT / 2.2 + (this.step > 3 ? 1 : 0)), donX = -120 + (W * 0.17 + 120) * f;
      drawSprite("donkey_packs_walk", f < 1 ? frameOf("donkey_packs_walk", now) : 0, donX, y, 1, s * 0.9);
      if (SPR.goat_walk) drawSprite(f < 1 ? "goat_walk" : "goat_stand", frameOf(f < 1 ? "goat_walk" : "goat_stand", now), donX - 125, y, 1, s * 0.75);
    }
    // the messenger: rides in from the right, pulls up, gets down, and gives the king's word
    if (this.step >= 0 && SPR.messenger_gallop) {
      const t = this.step === 0 ? this.stepT : 99;
      let nm = "messenger_talk", i = frameOf("messenger_talk", now), x = mx;
      if (t < 2.4) { nm = "messenger_gallop"; i = frameOf(nm, now); x = W + 200 - (W + 200 - mx) * (t / 2.4); }
      else if (t < 4.2 && SPR.messenger_stop) { nm = "messenger_stop"; i = Math.min(SPR[nm].frames - 1, Math.floor((t - 2.4) / 1.8 * SPR[nm].frames)); }
      else if (t < 6.2 && SPR.messenger_dismount) { nm = "messenger_dismount"; i = Math.min(SPR[nm].frames - 1, Math.floor((t - 4.2) / 2 * SPR[nm].frames)); }
      else if (this.step !== 1) { nm = "messenger_dismount"; i = SPR[nm] ? SPR[nm].frames - 1 : 0; }   // standing by his horse
      if (SPR[nm]) drawSprite(nm, i, x, y, -1, s * 0.82);
    }
    // Hanan at the gate, for his goodbye
    if (this.step >= 4 && SPR.hanan_idle_nostaff) drawSprite("hanan_idle_nostaff", frameOf("hanan_idle_nostaff", now), W * 0.62, y, -1, s);
    const a = Math.min(1, this.t / 1); ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(60,36,14,0.85)"; ctx.font = "italic 22px Georgia, serif"; ctx.fillText("Bethlehem, at Jesse's door", W / 2, 50);
    const L = this.lines[this.step];
    if (L) drawStoryBox(L[0], L[1], "A: next", true);
    if (this.step === 6) {   // the title card
      const f = Math.min(1, this.stepT / 0.8); ctx.fillStyle = `rgba(10,6,2,${0.75 * f})`; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = f; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 54px Georgia, serif"; ctx.fillText("WORLD 4", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff6e2"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText("The King's Court", W / 2, H / 2 + 30); ctx.globalAlpha = 1;
    }
  },
};
if (LEVEL_STAGE === "4-1" && !STORY_HASH) {
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").w4intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w4intro"))   // (Glen) his film first: the messenger riding for Bethlehem
    preFilm.start({ src: "../assets/video/w4_film.mp4", words: [[1.0, 5.2, "The road from Gibeah"], [6.6, 9.8, "Bethlehem"]], loop: ["horse-gallop", 0.7, 0.25] }, () => w4intro.start());
}

// ---------------------------------------------------------------------------
// The end of World 4 (DESIGN "End of World 4 — reflection scene"): morning at Gibeah after the storm. Saul, rested,
// thanks David and sends word to Jesse (1 Samuel 16:22). The gift: the King's Favor (David may come and go between the
// king's house and his father's, 17:15) = faster travel on the Journey map (progress.favor). The Steward's words,
// 16:23, and then home to the sheep: Hanan at the Bethlehem gate, as he promised. Then the Journal.
// Glen's art: saul (5 standing talking, 6 smiling), saul_joy (arms raised), steward, hanan_idle_nostaff, david_walk.
// ---------------------------------------------------------------------------
const TOWN_GROUND = {};   // the dusty ground pieces, loaded for the gate scene
for (const n of ["topsoil", "sediment"]) TOWN_GROUND[n] = Object.assign(new Image(), { src: `../assets/terrain/w2s/${n}.png?v=${window.BUILD || 0}` });
function drawTownGround(y) {
  const sed = TOWN_GROUND.sediment, top = TOWN_GROUND.topsoil, k = TUNE.TER_FILL_SCALE;
  if (sed.naturalWidth) { const w = sed.naturalWidth * k, h = sed.naturalHeight * k; for (let gy = y - 2; gy < H; gy += h - 1) for (let x = 0; x < W; x += w - 1) ctx.drawImage(sed, x, gy, w, h); }
  else { ctx.fillStyle = "#8a6a44"; ctx.fillRect(0, y - 2, W, H - y + 2); }
  if (top.naturalWidth) { const h = TUNE.TER_TOPSOIL_H, w = top.naturalWidth * h / top.naturalHeight; for (let x = -4; x < W; x += w - 1) ctx.drawImage(top, x, y - TUNE.TER_GRASS_RISE, w, h); }
}
const w4ending = {
  active: false,
  beats: [
    { at: "hall", who: "", text: "Morning in Gibeah. The storm had passed in the night, and the palace was quiet." },
    { at: "hall", who: "King Saul", text: "David. I slept the whole night through. I can't remember the last time I slept like that.", saul: "joy" },
    { at: "hall", who: "King Saul", text: "Stay with me. I'll send word to your father today.", saul: "talk" },
    { at: "hall", who: "", text: "Saul sent to Jesse, saying, \"Please let David stand before me, for he has found favor in my sight.\" (1 Samuel 16:22)", saul: "smile" },
    { at: "hall", card: true, saul: "smile" },
    { at: "hall", who: "The Steward", text: "You didn't fix him, boy. Only God can. But you gave him rest tonight. That's a gift too.", steward: "talk" },
    { at: "hall", who: "", text: "When the spirit from God was on Saul, David took the harp and played with his hand; so Saul was refreshed and was well. (1 Samuel 16:23)", steward: "smile" },
    { at: "gate", who: "", text: "And David went home to the sheep, as he would again and again.", walk: true },
    { at: "gate", who: "Hanan", text: "There you are. I told you I'd be here when you came home." },
    { at: "gate", who: "Hanan", text: "So. Did you find the one who tells you the truth?" },
  ],
  start(done) { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, done, fade: 0, out: 0, davidX: -80 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt; this.fade = Math.min(1, this.t / 1.2);
    const B = this.beats[this.i];
    if (B && B.walk) this.davidX = Math.min(W * 0.4, this.davidX + TUNE.WALK_SPEED * 0.7 * dt);
    if (B && B.card && this.bt < 0.05 && !this.gave) {
      this.gave = true; sfx("extra_life", undefined, 0.7);
      try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.favor = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
    }
    if (this.out > 0) {
      this.out += dt;
      if (this.out > 1.2) { this.active = false; const cb = this.done; this.done = null; cb && cb(); }
      return;
    }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) {
        const was = this.beats[this.i].at; this.i++; this.bt = 0;
        if (this.beats[this.i].at !== was) { this.t = 0; this.fade = 0; }   // a new place: fade in
      } else this.out = 0.001;
    }
  },
  draw() {
    const B = this.beats[this.i], y = GR * T, now = performance.now() / 1000, keep = bgWorld;
    if (B.at === "hall") {   // the king's hall in the morning: Glen's night hall, warmed and brightened
      bgWorld = "w4_4"; drawBackground(0); bgWorld = keep; drawFlatGround(0);
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.fillStyle = "rgba(150,110,60,0.55)"; ctx.fillRect(0, 0, W, H); ctx.restore();   // morning: lift the night
      ctx.save(); ctx.globalCompositeOperation = "lighter";   // sunlight through the high windows
      const g = ctx.createLinearGradient(W * 0.7, 0, W * 0.4, H); g.addColorStop(0, "rgba(255,210,140,0.22)"); g.addColorStop(1, "rgba(255,210,140,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
      const sx = W * 0.64;
      if (B.saul === "joy" && SPR.saul_joy) drawSprite("saul_joy", 2 + (Math.floor(now * 1.5) % 2), sx, y, -1);
      else if (SPR.saul) drawSprite("saul", B.saul === "talk" ? 4 : 5, sx, y, -1);
      if (SPR.steward && this.i >= 5) drawSprite("steward", B.steward === "talk" ? [1, 4][Math.floor(now * 0.9) % 2] : 5, W * 0.18, y, 1);
      drawSprite("david_idle", frameOf("david_idle", now), W * 0.36, y, 1);
    } else {   // the Bethlehem gate: Hanan waiting
      bgWorld = "w3_1"; drawBackground(0); bgWorld = keep;
      drawTownGround(y);   // Bethlehem's own dusty ground (the w2s set 3-1 uses), not the palace stone this stage loaded
      if (SPR.hanan_idle_nostaff) drawSprite("hanan_idle_nostaff", frameOf("hanan_idle_nostaff", now), W * 0.62, y, -1);   // (his staff is David's now)
      const walking = B.walk && this.davidX < W * 0.4;
      const dx = B.walk ? this.davidX : W * 0.4, nm = typeof SPR.david_walk_staff !== "undefined" && (JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").staff) ? "david_walk_staff" : "david_walk";
      drawSprite(walking ? nm : "david_idle", frameOf(walking ? nm : "david_idle", now), dx, y, 1);
    }
    if (B.card) {   // the gift
      const cy = 90, a = Math.min(1, this.bt * 2);
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(25,14,6,0.88)"; ctx.beginPath(); ctx.roundRect(W / 2 - 440, cy, 880, 170, 16); ctx.fill();
      ctx.strokeStyle = "rgba(255,214,120,0.6)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "#c9a227"; ctx.beginPath(); ctx.arc(W / 2 - 360, cy + 85, 46, 0, Math.PI * 2); ctx.fill();   // the king's seal
      ctx.fillStyle = "#7a1f2b"; ctx.beginPath(); ctx.arc(W / 2 - 360, cy + 85, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f3d27a"; ctx.font = "bold 30px Georgia, serif"; ctx.textAlign = "center"; ctx.fillText("♛", W / 2 - 360, cy + 96);
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 26px sans-serif"; ctx.fillText("The King's Favor", W / 2 + 40, cy + 44);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "18px sans-serif"; ctx.fillText("Come and go between the king's house and your father's:", W / 2 + 40, cy + 76);
      ctx.fillText("you travel much faster on the Journey map now.", W / 2 + 40, cy + 100);
      ctx.font = "italic 17px Georgia, serif"; ctx.fillText("\"David went back and forth from Saul to feed his father's sheep at Bethlehem.\"  1 Samuel 17:15", W / 2 + 40, cy + 140);
      ctx.restore(); ctx.textAlign = "left";
    } else if (B.text) drawStoryBox(B.who, B.text, this.i === this.beats.length - 1 ? (JOURNAL_PAGES[4] ? "A: write in the Journal" : "A: continue") : "A: next", true);
    if (B.card) caption("A: next", 0.8, true);
    const a = Math.min(this.fade, 1 - Math.min(1, this.out / 1.2));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
// "?w4end" plays the End of World 4 straight away (testing); "?w4end=7" starts at the beat that number
if (new URLSearchParams(location.search).has("w4end")) setTimeout(() => {
  w4ending.start(() => location.reload());
  const at = Number(new URLSearchParams(location.search).get("w4end")) || 0; if (at) Object.assign(w4ending, { i: at, fade: 1, t: 2, davidX: W * 0.4 });
}, 300);
