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
if (LEVEL_STAGE === "4-1") {   // Father's young goat, for the king: it follows from the start, and is never "home"
  W3.GOAT_HOME = 1e6;
  for (const k of critters) if (k.kind === "goat") k.follow = true;
}

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
  // following: walks after David when he's more than a few tiles off, stands when he stops
  if (david.deadT > 0) { fall(); return; }
  const far = Math.abs(dx) > W4.DONKEY_LOST * T || (!sameLevel && Math.abs(dx) > 6 * T && david.onGround);
  if (far) { k.lostT = (k.lostT || 0) + dt; if (k.lostT > 1.2 && david.onGround) { k.lostT = 0; k.x = david.x - (david.facing || 1) * 3 * T; k.y = david.y; k.vy = 0; if (!standable(k.x, k.y)) k.x = david.x; } }
  else k.lostT = 0;
  if (Math.abs(dx) > W4.DONKEY_FOLLOW * T) {
    k.facing = Math.sign(dx); setCrit(k, "walk");
    const moved = runCritter(k, W4.DONKEY_WALK + Math.min(240, Math.abs(dx) - W4.DONKEY_FOLLOW * T), dt);
    if (!moved && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);   // a rock in the way: up he goes
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
    k.facing = Math.sign(don.x - k.x) || k.facing;
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
  if (!lostGifts.length) return false;
  drawItem("gift_honey", HUD_X + 14, 224, 0.24);
  hudText(`${lostGifts.filter(g => g.taken).length}/${lostGifts.length}`, HUD_X + 40, 220);
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
  waw:   { ch: "\u{10905}", clue: "A letter cut into the post: Waw, a tent peg. A peg joins things together, and the word waw means \"and\"." },
  dalet: { ch: "\u{10903}", clue: "A letter scratched here: Dalet, a door. Two Dalets with a Waw between them spell a shepherd boy's name." },
};
const letterFont = () => { try { return document.fonts.check('40px "Segoe UI Historic"'); } catch (e) { return true; } };
function updateInscriptions(dt) {
  for (const n of inscriptions) {
    const near = Math.abs(david.x - n.x) < 1.6 * T && Math.abs(david.y - n.y) < 3 * T && Math.abs(david.vx) < 20 && david.onGround && david.deadT <= 0;
    n.still = near ? n.still + dt : 0;
    if (n.still > 0.7 && !n.read) {
      n.read = true; sayLine("", OLD_LETTERS[n.letter].clue); if (typeof chime === "function") chime(3);
      try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.letters = p.letters || [];
        if (!p.letters.includes(n.letter)) { p.letters.push(n.letter); localStorage.setItem("davidProgress", JSON.stringify(p)); } } catch (e) {}
    }
  }
}
function drawInscriptions(camX) {
  if (!inscriptions.length || !letterFont()) return;
  ctx.save(); ctx.font = '34px "Segoe UI Historic"'; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const n of inscriptions) {
    const x = n.x - camX; if (x < -60 || x > W + 60) continue;
    const a = n.read ? 0.55 : 0.32 + 0.2 * Math.min(1, n.still / 0.7);   // faint until you stop and look
    ctx.fillStyle = `rgba(255,250,235,${a * 0.6})`; ctx.fillText(OLD_LETTERS[n.letter].ch, x, n.y + 2);   // the lit lower lip
    ctx.fillStyle = `rgba(40,34,30,${a})`; ctx.fillText(OLD_LETTERS[n.letter].ch, x, n.y);                // the groove
  }
  ctx.restore();
}
function updateWorld4(dt) {
  updateInscriptions(dt);
  if (WORLD !== 4) return;
  updateGiftDrops(); updateKeeper(); updateLostGifts(dt);
}
function drawWorld4(camX) {
  drawInscriptions(camX);
  if (WORLD !== 4) return;
  drawKeeper(camX); drawGiftDrops(camX); drawLostGifts(camX);
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
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.w4intro = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  },
  draw() {
    const y = GR * T, s = this.SIZE, now = performance.now() / 1000, keep = bgWorld;
    bgWorld = "w3_1"; drawBackground(0); bgWorld = keep; drawFlatGround(0);   // Bethlehem: Jesse's house in the morning
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
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").w4intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w4intro")) w4intro.start();
}
