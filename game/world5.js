// World 5's stage pieces (loaded after world4.js). The Road to the Valley (1 Samuel 17:1-24): Jesse sends David to the
// army at Elah with an ephah of parched grain and ten loaves for his brothers, and ten cheeses for their captain (17:17-18).
//   the provisions             David carries them through every stage. A hit knocks a loaf or a cheese loose: it bounces
//                              off and lies there a few seconds, so grab it back. What's left carries on to the next stage.
//                              Carrying never slows him (DESIGN rule 1): it's a score you protect, not a weight.
//   critter("raider", c)       a Philistine raider up in the hills for grain and livestock: he comes running down the road
//                              at David and snatches a loaf or a cheese. Hit him and he drops it and runs. (Glen's raider
//                              sheets.)
//   setPiece("vultures", c)    vultures pecking by the road; they flap up and circle when David comes. Scenery.
//   setPiece("fleeing", c)     a family running past, back toward Bethlehem. Scenery.
//   the fleeing father         talk(c, "The fleeing father", ...): a family running from the Philistines. (World 2's
//                              leatherworker stands in until his own sheet.) Bring his scattered flock to the fold and he
//                              tells you about the soldier hiding in a cave on the mountain trail (the Secret, for 5-2).
// The opening scene (w5intro): Jesse and the three empty places, the provisions, Hanan keeps the flock (17:20).

const W5 = {
  LOAVES: 10, CHEESES: 10,
  DROP_LIFE: 7,          // seconds a dropped loaf or cheese lies there before it's gone (it blinks for the last 2)
  RAIDER_SEE: 11,        // tiles: he comes for David when David's this close
  RAIDER_RUN: 300, RAIDER_FLEE: 280,
  FATHER_SIZE: 1.2,
  RAIDER_SIZE: 1.2,      // a grown man: taller than David
  VULTURE_SIZE: 0.45,    // circling high up
  VULTURE_GROUND: 0.6,   // pecking by the road
  VULTURE_SPOOK: 5,      // tiles: they flap up when David comes this close
  VILLAGER_RUN: 250,     // px/s, fleeing past David toward Bethlehem
  VILLAGER_SIZE: { man: 1.2, staffman: 1.2, woman: 1.1, boy: 0.8, girl: 0.85, braidgirl: 0.8 },
};
const PROV_NAMES = { bread: "a loaf", cheese: "a cheese" };
// what David is carrying: full at the start of 5-1, then whatever made it through the stage before
const prov = { bread: W5.LOAVES, cheese: W5.CHEESES, drops: [] };
if (WORLD === 5 && LEVEL_STAGE !== "5-1") {
  try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}").prov; if (p) Object.assign(prov, { bread: p.bread, cheese: p.cheese }); } catch (e) {}
}
const provCount = () => prov.bread + prov.cheese;
function loseProvision(x, y, why) {   // knocked loose: it bounces off and lies on the ground for a few seconds
  if (WORLD !== 5 || !provCount()) return null;
  const name = prov.bread >= prov.cheese ? "bread" : "cheese"; prov[name]--;
  const dir = Math.random() < 0.5 ? -1 : 1;
  const g = { name, x, y: y - 40, vx: dir * (120 + Math.random() * 80), vy: -420, t: 0, landed: false };
  prov.drops.push(g);
  if (why) toast(why);
  return g;
}
function updateProvisions(dt) {
  for (let i = prov.drops.length - 1; i >= 0; i--) {
    const g = prov.drops[i]; g.t += dt;
    if (!g.landed) {
      g.vy = Math.min(TUNE.MAX_FALL, g.vy + TUNE.GRAVITY * dt);
      const nx = g.x + g.vx * dt; if (!isSolid(Math.floor(nx / T), Math.floor((g.y - 10) / T))) g.x = nx; else g.vx = -g.vx * 0.4;
      g.y += g.vy * dt;
      if (g.vy > 0 && isSolid(Math.floor(g.x / T), Math.floor(g.y / T))) {
        g.y = Math.floor(g.y / T) * T;
        if (g.vy > 260) { g.vy = -g.vy * 0.35; g.vx *= 0.6; } else { g.vy = 0; g.vx = 0; g.landed = true; }   // one little bounce
      }
      if (g.y > ROWS * T) { prov.drops.splice(i, 1); continue; }   // down a pit: gone
    }
    if (g.t > 0.5 && Math.abs(david.x - g.x) < 44 && Math.abs(david.y - g.y) < 80 && david.deadT <= 0) {
      prov.drops.splice(i, 1); prov[g.name]++; sfx("olive_pickup", g.x, 0.8, 0.85);
      toast(`Got it back! (${prov.bread} loaves, ${prov.cheese} cheeses)`); continue;
    }
    if (g.t > W5.DROP_LIFE) prov.drops.splice(i, 1);
  }
}
function drawProvision(name, x, y, s = 1) { drawItem(name === "bread" ? "gift_bread" : "gift_cheese", x, y, 0.3 * s); }
function drawProvisionDrops(camX) {
  for (const g of prov.drops) {
    const x = g.x - camX; if (x < -60 || x > W + 60) continue;
    if (g.t > W5.DROP_LIFE - 2 && Math.floor(g.t * 8) % 2) continue;   // about to be gone: blinking
    if (g.landed) goldGlow(x, g.y, g.t);
    drawProvision(g.name, x, g.y);
  }
}
function drawProvisions() {   // main.js HUD: under the sheep count
  if (WORLD !== 5) return;
  drawProvision("bread", HUD_X + 14, 300, 0.75); hudText(`${prov.bread}`, HUD_X + 40, 292);
  drawProvision("cheese", HUD_X + 80, 300, 0.75); hudText(`${prov.cheese}`, HUD_X + 104, 292);
}
// a hit knocks one loose (main.js hurtDavid)
if (WORLD === 5) {
  const hurt0 = hurtDavid;
  hurtDavid = function (fromX) {
    const before = david.hearts; hurt0(fromX);
    if (david.hearts < before && david.deadT <= 0) {
      const g = loseProvision(david.x, david.y);
      if (g && !W5.dropTold) { W5.dropTold = true; toast(`You dropped ${PROV_NAMES[g.name]}! Grab it before it's gone.`); }
    }
  };
}

// ---------------------------------------------------------------------------
// Philistine raiders: down the road at David for the provisions. Hit him and he drops it.
// ---------------------------------------------------------------------------
CRITTER_ART.raider = { box: k => ({ x0: k.x - 34, x1: k.x + 34, y0: k.y - 290 * SCALE * W5.RAIDER_SIZE, y1: k.y }) };
for (const n of ["raider_run", "raider_grab", "raider_flee", "raider_hit"]) TUNE.SPRITE_SIZE[n] = W5.RAIDER_SIZE;
function updateRaider(k, dx, sameLevel, dt) {
  if (k.state === "idle") {   // waiting out of sight up the road
    k.alpha = 0;
    if (!k.done && dx < 0 && -dx < W5.RAIDER_SEE * T && david.deadT <= 0 && provCount()) {
      let sx = Math.max(k.home, camX + W + 80);   // just off the screen ahead, on open ground (not inside a rock)
      const clear = x => [-30, 0, 30].every(o => { const c = Math.floor((x + o) / T); return !isSolid(c, GR - 1) && !isSolid(c, GR - 2) && !isSolid(c, GR - 3) && !isSolid(c, GR - 4); });
      for (let n = 0; n < 16 && !clear(sx); n++) sx += T;
      k.done = true; Object.assign(k, { x: sx, y: GR * T, vy: 0, facing: -1, alpha: 1 }); setCrit(k, "run");
      if (!W5.raiderTold) { W5.raiderTold = true; toast("A Philistine raider! He's after the provisions. Stop him with a stone!"); }
    }
    return;
  }
  if (k.state === "run") {   // at David
    k.facing = Math.sign(dx) || -1;
    if (!runCritter(k, W5.RAIDER_RUN, dt) && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);
    if (touchesDavid(critterBox(k)) && david.deadT <= 0) {
      const g = provCount() ? (prov.bread >= prov.cheese ? "bread" : "cheese") : null;
      if (g) { prov[g]--; k.carry = g; toast(`He snatched ${PROV_NAMES[g]}! Hit him before he gets away!`); }
      setCrit(k, g ? "grab" : "flee"); k.vx = 0;   // a quick snatch, and off, away from David
    }
    if (k.t > 9) { k.gone = true; }
    return;
  }
  if (k.state === "grab") { k.vx = 0; if (k.t > 0.4) setCrit(k, "flee"); return; }
  if (k.state === "flee") {   // away from David; gone for good if he gets far enough
    k.facing = Math.sign(k.x - david.x) || 1;
    if (!runCritter(k, W5.RAIDER_FLEE, dt) && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);
    if (Math.abs(dx) > 16 * T) { k.gone = true; if (k.carry) toast(`The raider got away with ${PROV_NAMES[k.carry]}.`); k.carry = null; }
  }
}
function stoneHitsRaider(k, s) {
  if (k.state === "idle") return false;
  if (k.carry) { prov.drops.push({ name: k.carry, x: k.x, y: k.y - 60, vx: 0, vy: -300, t: 0, landed: false }); toast(`He dropped ${PROV_NAMES[k.carry]} and ran! Pick it up.`); k.carry = null; }
  else toast("The raider turned and ran.");
  setCrit(k, "hit"); k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * W5.RAIDER_FLEE * 1.5; stoneHit(s);
  return !s.power;
}
// Glen's raider (art faces right): raider_run coming at David, raider_grab the snatch, raider_flee running off scared
// (the loaf drawn in his arms), raider_hit arms up when the stone gets him, then the scared run as he fades away
function drawRaider(k, x) {
  if (!SPR.raider_run) return;
  let nm = "raider_run", i = frameOf(nm, k.t);
  if (k.state === "grab") { nm = "raider_grab"; i = Math.min(2, Math.floor(k.t / 0.4 * 3)); }
  else if (k.state === "flee" || (k.state === "hit" && k.alpha < 0.7)) { nm = "raider_flee"; i = frameOf(nm, k.t); }
  else if (k.state === "hit") { nm = "raider_hit"; i = 0; }
  drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
  if (k.carry && k.state === "flee") drawProvision(k.carry, x + k.facing * 30 * SCALE * W5.RAIDER_SIZE, k.y - 105 * SCALE * W5.RAIDER_SIZE, 0.55);   // hugged to his chest
}

// ---------------------------------------------------------------------------
// Vultures (scenery: they follow armies). setPiece("vultures", c): three pecking at something by the road (Glen's
// vulture_stand); when David comes close they flap up (vulture_fly) and circle high overhead from then on.
// ---------------------------------------------------------------------------
const vultures = setPieces.filter(p => p.kind === "vultures").map(p => ({ x: p.x, up: false, t: 0,
  birds: [0, 1, 2].map(k => ({ dx: (k - 1) * 70, ph: k * 2.1, lift: 0 })) }));
function updateVultures(dt) {
  for (const v of vultures) {
    v.t += dt;
    if (!v.up && Math.abs(david.x - v.x) < W5.VULTURE_SPOOK * T && david.deadT <= 0) {
      v.up = true; v.t = 0;
      if (!W5.vultureTold) { W5.vultureTold = true; toast("Vultures. They follow armies, waiting. The Philistines can't be far."); }
    }
    if (v.up) for (const b of v.birds) b.lift = Math.min(1, b.lift + dt * (0.35 + b.ph * 0.05));
  }
}
function drawVultures(camX) {
  if (!SPR.vulture_fly) return;
  const now = performance.now() / 1000;
  for (const v of vultures) {
    for (const b of v.birds) {
      if (!v.up) {   // on the ground, pecking
        const x = v.x + b.dx - camX; if (x < -150 || x > W + 150) continue;
        if (SPR.vulture_stand) drawSprite("vulture_stand", Math.floor((now + b.ph) * 3.2) % SPR.vulture_stand.frames, x, GR * T, b.dx < 0 ? 1 : -1, W5.VULTURE_GROUND);
        continue;
      }
      // up and away into a wide slow circle above the road
      const a = now * 0.25 + b.ph, cx = v.x + Math.cos(a) * 200, cy = 3.5 * T + Math.sin(a) * 40 + b.ph * 8;
      const f = b.lift, ease = f * f * (3 - 2 * f);
      const x = (v.x + b.dx) + (cx - v.x - b.dx) * ease - camX, y = (GR * T - 60) + (cy - GR * T + 60) * ease;
      if (x < -200 || x > W + 200) continue;
      const flap = f < 1 || Math.sin(now * 0.7 + b.ph) > 0.85 ? Math.floor(now * 9 + b.ph) % 6 : 2;   // soaring, a few wingbeats now and then
      drawSprite("vulture_fly", flap, x, y, f < 1 || -Math.sin(a) > 0 ? 1 : -1, W5.VULTURE_GROUND + (W5.VULTURE_SIZE - W5.VULTURE_GROUND) * ease);
    }
  }
}

// ---------------------------------------------------------------------------
// Families running from the Philistines, back toward Bethlehem (Glen's villager_*_run). setPiece("fleeing", c): when
// David gets near, a family comes running down the road from ahead and past him. They're no danger, and pass by.
// ---------------------------------------------------------------------------
const FAMILIES = [["man", "woman", "boy"], ["staffman", "girl"], ["woman", "braidgirl"], ["man", "boy"]];
const fleeGroups = setPieces.filter(p => p.kind === "fleeing").map((p, i) => ({ x: p.x, go: false, who: FAMILIES[i % FAMILIES.length], people: [] }));
const surfaceY = x => { const c = Math.floor(x / T); for (let r = 0; r < ROWS; r++) if (isSolid(c, r)) return r * T; return GR * T; };
function updateFleeing(dt) {
  for (const g of fleeGroups) {
    if (!g.go && david.x > g.x - 12 * T && david.x < g.x + 4 * T) {
      g.go = true;
      g.people = g.who.map((w, k) => ({ w, x: camX + W + 80 + k * 110 + Math.random() * 30, sp: W5.VILLAGER_RUN * (1 - k * 0.05), t: Math.random(), y: 0 }));
      if (!W5.fleeTold) { W5.fleeTold = true; toast("People running the other way, back toward Bethlehem. Everyone's running from the valley."); }
    }
    for (const q of g.people) { q.x -= q.sp * dt; q.t += dt; const sy = surfaceY(q.x); q.y = q.y ? q.y + (sy - q.y) * Math.min(1, dt * 10) : sy; }
    g.people = g.people.filter(q => q.x > camX - 300);
  }
}
function drawFleeing(camX) {
  for (const g of fleeGroups) for (const q of g.people) {
    const nm = "villager_" + q.w + "_run", x = q.x - camX; if (!SPR[nm] || x < -200 || x > W + 200) continue;
    drawSprite(nm, frameOf(nm, q.t), x, q.y, -1, W5.VILLAGER_SIZE[q.w]);
  }
}

// ---------------------------------------------------------------------------
// The fleeing father (made up): his family running from the Philistines, their flock scattered in the hills. At the
// fold he gets his sheep back and tells David about the soldier in the cave (the Secret that leads to Tobi in 5-2).
// ---------------------------------------------------------------------------
const fleeing = talks.filter(t => t.who === "The fleeing father");
function updateFather() {
  if (LEVEL_STAGE !== "5-1" || !finish.active || W5.secretGiven || finish.phase !== "clear") return;
  W5.secretGiven = true;
  const all = finish.total && finish.found === finish.total;
  sayLine("The fleeing father", all ? "You brought them all back? Every one! God bless you, boy. Listen: there's a cave up on the mountain trail. I saw a soldier hiding in it, one of ours. He looked half dead with fear. Maybe you can help him."
                                    : "You found some of them. Thank you, boy. Listen: there's a cave up on the mountain trail. I saw a soldier hiding in it, one of ours. Maybe you can help him.");
  try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.tobiSecret = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
}
// Glen's father_flee (faces right): 0 catching his breath, 1 talking, 2 pointing back down the road, 3 a tear, shaking
// his head, 4 hands together (thankful), 5 waving goodbye. At the fold his wife and the children wait with him.
function drawFather(camX) {
  if (!SPR.father_flee) return;
  const now = performance.now() / 1000;
  fleeing.forEach((f, n) => {
    const atFold = n === fleeing.length - 1, fx = f.x + 2 * T, x = fx - camX;
    if (x < -300 || x > W + 300) return;
    if (!atFold && david.x > fx + 40 * T) return;   // (he's gone on ahead to the fold)
    const talking = dialog.t > 0 && dialog.who === "The fleeing father" && Math.abs(david.x - fx) < 14 * T;
    let i = 0;
    if (talking) i = atFold && W5.secretGiven ? [1, 4][Math.floor(now * 0.8) % 2] : atFold ? 1 : [1, 2, 3][Math.floor(now * 0.7) % 3];
    else if (atFold && W5.secretGiven) i = 4;
    else if (!atFold && f.done) i = david.x > fx + 3 * T ? 5 : 0;
    const face = Math.sign(david.x - fx) || -1;
    if (atFold) for (const [w, dx] of [["woman", -1.6], ["braidgirl", -2.7], ["boy", -3.6]])   // his family, waiting
      drawSprite("villager_" + w + "_stand", 0, x + dx * T, GR * T, face, W5.VILLAGER_SIZE[w]);
    drawSprite("father_flee", i, x, GR * T, face, W5.FATHER_SIZE);
  });
}


// ===========================================================================
// 5-2 The Mountain Trail (night). Hyenas that laugh before they lunge, the leopard in the tree (a mini-boss), Tobi in
// his cave (light the fire, play the harp, and he teaches the scout's leap: the double jump), his dropped gear (the lost
// things), spiked crevices, and The One on a shelf only the new jump reaches.
//   critter("hyena", c)            prowls; when David comes near it LAUGHS (the warning), crouches, and lunges. A stone
//                                  sends it off for good.
//   setPiece("leopard", c)         a tree (Glen's oak) with the leopard in it: eyes shine in the branches, then it drops
//                                  on the spot where David stood. On the ground it stalks and swipes; 3 hits and it goes
//                                  back up its tree and away. It climbs back up after a while and drops again.
//   setPiece("tobicave", c)        the overhang where Tobi hides (rock + campfire placed in main.js); Tobi stands at c+5
//   setPiece("gear", c, r, {name}) one of Tobi's things: waterskin, sandal, horn, pack, staff
//   setPiece("spikes", c, GR, {w}) draws Glen's spiked crevice over a pit w columns wide
// ===========================================================================
Object.assign(W5, {
  HYENA_SEE: 9, HYENA_LAUGH: 1.1, HYENA_CROUCH: 0.45, HYENA_LUNGE: 640, HYENA_SIZE: 1.0,
  LEOPARD_SIZE: 1.35, LEOPARD_HP: 3, LEOPARD_SEE: 8, LEOPARD_WATCH: 1.3, LEOPARD_WALK: 150, LEOPARD_GROUND: 4.5,
  TOBI_CALM: 2.0, TOBI_FOLLOW: 3, TOBI_WALK: 200,
});
Object.assign(TUNE.SPRITE_SIZE, { leopard_walk: W5.LEOPARD_SIZE, leopard_run: W5.LEOPARD_SIZE, leopard_pounce: W5.LEOPARD_SIZE });

// --- hyenas
CRITTER_ART.hyena = { box: k => ({ x0: k.x - 50, x1: k.x + 50, y0: k.y - 60, y1: k.y }) };
function updateHyena(k, dx, sameLevel, dt) {
  const grav = () => { k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle" || k.state === "prowl") {   // pacing about its spot, nose down
    if (k.state === "idle") setCrit(k, "prowl");
    if (Math.abs(k.x - k.home) > 2.5 * T) k.facing = Math.sign(k.home - k.x);
    k.cool = Math.max(0, (k.cool || 0) - dt);
    if (!runCritter(k, 55, dt)) k.facing = -k.facing;
    if (!k.cool && sameLevel && Math.abs(dx) < W5.HYENA_SEE * T && david.deadT <= 0) {
      setCrit(k, "laugh"); k.facing = Math.sign(dx) || 1; k.vx = 0;
      sfx("hyena_" + (1 + Math.floor(Math.random() * 3)), k.x, 0.8);
      if (!W5.hyenaTold) { W5.hyenaTold = true; toast("A hyena! It laughs before it lunges: when you hear it, get ready to jump."); }
    }
    return;
  }
  if (k.state === "laugh") { k.vx = 0; grav(); if (k.t > W5.HYENA_LAUGH) setCrit(k, "crouch"); return; }
  if (k.state === "crouch") { k.vx = 0; grav(); k.facing = Math.sign(dx) || k.facing; if (k.t > W5.HYENA_CROUCH) { setCrit(k, "lunge"); k.vy = -520; k.onGround = false; } return; }
  if (k.state === "lunge") {
    k.vx = k.facing * W5.HYENA_LUNGE; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt);
    if (touchesDavid(critterBox(k))) hurtDavid(k.x);
    if (k.onGround && k.t > 0.25) setCrit(k, "run");
    return;
  }
  if (k.state === "run") {   // on past, then it turns and settles again
    if (!runCritter(k, 380, dt) || k.t > 1.1) { setCrit(k, "prowl"); k.home = k.x; k.cool = 2.2; k.facing = Math.sign(dx) || 1; }
  }
}
function stoneHitsHyena(k, s) {
  k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 460; stoneHit(s, 0.7);
  sfx("hyena_2", k.x, 0.6, 1.4);
  if (!W5.hyenaGone) { W5.hyenaGone = true; toast("The hyena slinks off into the dark."); }
  return !s.power;
}
function drawHyena(k, x) {
  const st = k.state, nm = st === "laugh" ? "hyena_laugh" : st === "crouch" ? "hyena_crouch" : st === "lunge" ? "hyena_lunge" : st === "run" || k.gone ? "hyena_run" : "hyena_stalk";
  let i = frameOf(nm, k.t);
  if (st === "crouch") i = Math.min(SPR[nm].frames - 1, Math.floor(k.t / W5.HYENA_CROUCH * SPR[nm].frames));
  if (st === "lunge") i = Math.min(SPR[nm].frames - 1, Math.floor(k.t / 0.5 * SPR[nm].frames));
  drawSprite(nm, i, x, k.y, k.facing, W5.HYENA_SIZE, k.alpha);
}

// --- the leopard (mini-boss)
const leopards = setPieces.filter(p => p.kind === "leopard").map(p => ({ tx: p.x, x: p.x, y: GR * T, perch: GR * T - 6.5 * T,
  state: "perch", t: 0, hp: W5.LEOPARD_HP, facing: -1, flash: 0, alpha: 1, gone: false }));
const leoBox = L => ({ x0: L.x - 60, x1: L.x + 60, y0: L.y - 70, y1: L.y });
function setLeo(L, s) { L.state = s; L.t = 0; }
function leoArc(L, tx, ty, dur, then) { Object.assign(L, { ax0: L.x, ay0: L.y, ax1: tx, ay1: ty, adur: dur, athen: then, facing: Math.sign(tx - L.x) || L.facing }); setLeo(L, "arc"); }
function updateLeopards(dt) {
  const d = david;
  for (const L of leopards) {
    if (L.gone) continue;
    L.t += dt; L.flash = Math.max(0, L.flash - dt);
    const dx = d.x - L.x;
    if (L.state === "perch") {   // up in the branches
      L.x = L.tx; L.y = L.perch;
      if (L.t > 1.5 && Math.abs(d.x - L.tx) < W5.LEOPARD_SEE * T && d.deadT <= 0) {
        setLeo(L, "watch"); sfx("wolf_growl", L.x, 0.5, 0.75);
        if (!W5.leoTold) { W5.leoTold = true; toast("Two eyes shine in the branches... a leopard! \"A leopard will watch against their cities\" (Jeremiah 5:6). Keep moving when it drops!"); }
      }
    } else if (L.state === "watch") {   // the eyes, the rustle... then it drops where David stood
      L.mark = L.mark || d.x;
      if (L.t > W5.LEOPARD_WATCH) { const tx = L.mark; L.mark = 0; leoArc(L, tx, GR * T, 0.7, "land"); }
      else if (L.t > W5.LEOPARD_WATCH - 0.5 && !L.mark2) { L.mark2 = 1; L.mark = d.x; }   // it picks its spot half a second before
    } else if (L.state === "arc") {
      const f = Math.min(1, L.t / L.adur), top = Math.min(L.ay0, L.ay1) - 60;
      L.x = L.ax0 + (L.ax1 - L.ax0) * f; L.y = L.ay0 + (L.ay1 - L.ay0) * f - Math.sin(f * Math.PI) * (Math.max(L.ay0, L.ay1) - top) * (L.ay1 > L.ay0 ? 0.3 : 1);
      if (L.athen === "land" && touchesDavid(leoBox(L))) hurtDavid(L.x);
      if (f >= 1) {
        L.mark2 = 0;
        if (L.athen === "land") { setLeo(L, "prowl"); L.ground = 0; sfx("stone_hit", L.x, 0.3, 0.6); }
        else if (L.athen === "perch") setLeo(L, "perch");
        else if (L.athen === "away") { L.gone = true; toast("The leopard slips away through the branches and is gone. You're safe."); sfx("heal", undefined, 0.5); }
      }
    } else if (L.state === "prowl") {   // stalking toward David; close in, then a swipe
      L.ground += dt; L.facing = Math.sign(dx) || L.facing;
      if (Math.abs(dx) > 70) L.x += L.facing * W5.LEOPARD_WALK * dt;
      if (Math.abs(dx) < 2.4 * T && Math.abs(d.y - L.y) < 80 && L.t > 0.6) { setLeo(L, "swipe"); L.sx = L.x; }
      if (touchesDavid(leoBox(L))) hurtDavid(L.x);
      if (L.ground > W5.LEOPARD_GROUND) setLeo(L, "toTree");
    } else if (L.state === "swipe") {   // a quick pounce forward
      const f = Math.min(1, L.t / 0.55); L.x = L.sx + L.facing * 2.4 * T * Math.sin(f * Math.PI / 2);
      if (L.t > 0.15 && touchesDavid(leoBox(L))) hurtDavid(L.x);
      if (f >= 1) setLeo(L, "prowl");
    } else if (L.state === "toTree" || L.state === "retreat") {   // back to its tree, and up
      L.facing = Math.sign(L.tx - L.x) || 1; L.x += L.facing * 420 * dt;
      if (Math.abs(L.tx - L.x) < 20) leoArc(L, L.tx, L.perch - (L.state === "retreat" ? 2 * T : 0), 0.6, L.state === "retreat" ? "away" : "perch");
    } else if (L.state === "stagger") {
      L.x -= L.facing * 120 * dt;
      if (L.t > 0.45) setLeo(L, L.hp <= 0 ? "retreat" : "prowl");
    }
    if (L.state === "retreat" || (L.state === "arc" && L.athen === "away")) L.alpha = L.state === "arc" ? Math.max(0, 1 - L.t / L.adur) : 1;
  }
}
function stoneHitsLeopard(s) {
  for (const L of leopards) {
    if (L.gone || !["prowl", "swipe", "toTree", "stagger"].includes(L.state)) continue;
    const b = leoBox(L);
    if (s.x < b.x0 || s.x > b.x1 || s.y < b.y0 - 10 || s.y > b.y1) continue;
    L.hp -= s.power ? 3 : s.charged ? 2 : 1; L.flash = 0.25; stoneHit(s); sfx("lion_hit", L.x, 0.6, 1.4);
    setLeo(L, "stagger");
    if (L.hp <= 0) toast("The leopard has had enough!");
    return true;
  }
  return false;
}
function drawLeopards(camX) {
  const now = performance.now() / 1000;
  for (const L of leopards) {
    const tx = L.tx - camX; if (tx < -500 || tx > W + 500) continue;
    drawItem("oak", tx + 20, GR * T + 8, 0.42);   // its tree
    if (L.gone) continue;
    const x = L.x - camX;
    if (L.state === "perch" || L.state === "watch") {   // hidden in the leaves: only the eyes (and only once it's watching)
      continue;   // (the eyes are drawn over the night: drawLeopardEyes)
    }
    let nm = "leopard_walk", i = frameOf(nm, L.t);
    if (L.state === "arc") { nm = "leopard_pounce"; i = Math.min(SPR[nm].frames - 1, Math.floor(L.t / L.adur * SPR[nm].frames)); }
    else if (L.state === "swipe") { nm = "leopard_pounce"; i = Math.min(SPR[nm].frames - 1, 3 + Math.floor(L.t / 0.55 * 7)); }
    else if (L.state === "toTree" || L.state === "retreat") { nm = "leopard_run"; i = frameOf(nm, L.t); }
    drawSprite(nm, i, x, L.y, L.facing, 1, L.alpha, L.flash > 0 ? "brightness(2)" : "");
  }
}

// --- Tobi
const tobiCave = setPieces.find(p => p.kind === "tobicave");
const tobi = tobiCave ? { x: tobiCave.x + 5 * T, y: GR * T, home: tobiCave.x + 5 * T, y0: GR * T, vx: 0, vy: 0, onGround: true, facing: -1, state: "hide", t: 0, calmT: 0, kind: "tobi", alpha: 1 } : null;
if (tobi) critters.push(tobi);
CRITTER_ART.tobi = { box: k => ({ x0: k.x - 20, x1: k.x + 20, y0: k.y - 90, y1: k.y }) };
const tobiQueue = [];
function tobiSay(lines) { tobiQueue.push(...lines); }
function updateTobi(k, dx, sameLevel, dt) {
  if (dialog.t <= 0.05 && tobiQueue.length) { const L = tobiQueue.shift(); if (typeof L === "function") L(); else sayLine(L[0], L[1]); }
  if (k.state === "idle") {   // (after a fall, the critters are reset: he's back in his cave, or right behind David)
    if (!k.rescued) setCrit(k, "hide");
    else { setCrit(k, "follow"); k.x = david.x - (david.facing || 1) * 2 * T; k.y = david.y; if (!standable(k.x, k.y)) k.x = david.x; }
  }
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 30, 80, dt); };
  if (k.state === "hide") {
    fall(); k.facing = Math.sign(dx) || -1;
    if (!k.seen && Math.abs(dx) < 9 * T && david.deadT <= 0) {
      k.seen = true;
      let secret = false; try { secret = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").tobiSecret; } catch (e) {}
      tobiSay([["Tobi", "Who's there?! ... You're not a Philistine. You're just a boy."],
               ["Tobi", "I'm a scout. I'm supposed to be fast. I heard him, the giant, shouting across the valley, and I just... ran. I've been hiding here two days."],
               ["", secret ? "The soldier the fleeing father saw. He's shaking. Light the fire, and play the harp for him (Select)." : "He's shaking with cold and fear. Light the fire, and play the harp for him (Select)."]]);
    }
    if (k.seen && david.state === "harp" && Math.abs(dx) < 8 * T) {
      k.calmT += dt;
      if (k.calmT > W5.TOBI_CALM) {
        setCrit(k, "talk");
        tobiSay([["Tobi", "That song... my mother sings that one. ... Thank you. My name is Tobi."],
                 ["Tobi", "You're taking bread to the army? Down there, toward him? ... Then I'm coming with you. I won't run this time."],
                 ["Tobi", "Here, let me show you something. Scouts learn to push off anything: a rock, a branch, even a bit of nothing. Jump, then jump again. Like this."],
                 () => { setCrit(k, "demo"); k.rescued = true; learnSkill("leap"); },
                 ["Tobi", "See? Now you. Jump, and press A again in the air. That cliff behind the cave? We'll go up it."]]);
      }
    }
    return;
  }
  if (k.state === "talk") { fall(); k.facing = Math.sign(dx) || 1; return; }
  if (k.state === "demo") {   // the scout's leap, in place
    fall(); if (k.t > 1.0) setCrit(k, "follow");
    return;
  }
  if (k.state === "leap") {
    const f = Math.min(1, k.t / 0.75), base = k.ly0 + (k.ly1 - k.ly0) * f;
    k.x = k.lx0 + (k.lx1 - k.lx0) * f; k.y = base - Math.sin(f * Math.PI) * (Math.max(k.ly0, k.ly1) - k.ltop);
    if (f >= 1) { k.y = k.ly1; k.vy = 0; k.onGround = true; setCrit(k, "follow"); k.stuckT = 0; }
    return;
  }
  // following David (like the gift donkey): up and down rocks in one bound, round anything he can't get past
  if (david.deadT > 0) { fall(); return; }
  if (david.onGround && k.onGround && Math.abs(david.y - k.y) > 30 && Math.abs(dx) < 10 * T) {
    let tx = david.x - (Math.sign(dx) || 1) * 60; if (!standable(tx, david.y)) tx = david.x;
    goatLeap(k, tx, david.y); return;
  }
  if (Math.abs(dx) > 16 * T && david.onGround) { k.x = david.x - (david.facing || 1) * 2 * T; k.y = david.y; k.vy = 0; if (!standable(k.x, k.y)) k.x = david.x; }
  if (Math.abs(dx) > W5.TOBI_FOLLOW * T) {
    k.facing = Math.sign(dx); k.moving = true;
    const moved = runCritter(k, W5.TOBI_WALK + Math.min(260, Math.abs(dx) - W5.TOBI_FOLLOW * T), dt);
    if (!moved && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);
    k.stuckT = moved ? 0 : (k.stuckT || 0) + dt;
    if (k.stuckT > 1.2 && david.onGround) { k.stuckT = 0; let tx = david.x - (Math.sign(dx) || 1) * 2 * T; if (!standable(tx, david.y)) tx = david.x; goatLeap(k, tx, david.y); }
  } else { k.moving = false; fall(); k.facing = Math.sign(dx) || k.facing; }
}
function stoneHitsTobi(k, s) { return false; }   // the stone flies on past him
function drawTobi(k, x) {
  let nm = "tobi_cave", i = 0;
  if (k.state === "hide") i = david.state === "harp" && k.seen ? 2 : k.seen ? 1 : 0;
  else if (k.state === "talk") { nm = "tobi_talk"; i = dialog.t > 0 && dialog.who === "Tobi" ? [0, 3, 1, 0][Math.floor(performance.now() / 700) % 4] : 0; }
  else if (k.state === "demo") { nm = "tobi_leap"; i = Math.min(5, Math.floor(k.t / 1.0 * 6)); }
  else if (k.state === "leap") { nm = "tobi_leap"; i = Math.min(4, 1 + Math.floor(k.t / 0.75 * 4)); }
  else if (k.moving) { nm = "tobi_run"; i = frameOf(nm, k.t); }
  else { nm = dialog.t > 0 && dialog.who === "Tobi" ? "tobi_talk" : "tobi_cave"; i = nm === "tobi_talk" ? [0, 4][Math.floor(performance.now() / 700) % 2] : 5; }
  drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
}
function tobiBlocking() { return tobi && !["follow", "leap", "demo"].includes(tobi.state) ? "There's a frightened scout back in the cave. You can't leave him there." : null; }
function drawTobiCave(camX) {   // the dark under the overhang
  if (!tobiCave) return;
  const x = tobiCave.x - camX; if (x < -400 || x > W + 600) return;
  const g = ctx.createLinearGradient(0, GR * T - 4 * T, 0, GR * T);
  g.addColorStop(0, "rgba(5,8,18,0.85)"); g.addColorStop(1, "rgba(5,8,18,0.35)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - T / 2, GR * T - 3.6 * T, 9 * T, 3.6 * T, [40, 40, 0, 0]); ctx.fill();
}

// --- Tobi's gear (the lost things of 5-2)
const GEAR_NAMES = { waterskin: "his waterskin", sandal: "his other sandal", horn: "his ram's horn", pack: "his scout's pack", staff: "his staff" };
const tobiGear = setPieces.filter(p => p.kind === "gear").map(p => ({ name: p.name, x: p.x, y: p.y, taken: false, t: Math.random() * 6 }));
function updateGear(dt) {
  for (const g of tobiGear) {
    g.t += dt; if (g.taken) continue;
    if (Math.abs(david.x - g.x) < 42 && Math.abs(david.y - g.y) < 80 && david.deadT <= 0) {
      g.taken = true; sfx("olive_pickup", g.x, 1, 0.9); if (typeof chime === "function") chime(6);
      const n = tobiGear.filter(q => q.taken).length, met = tobi && tobi.state !== "hide";
      toast(n === tobiGear.length ? `You found ${GEAR_NAMES[g.name]}! That's all five of the scout's things.` : met ? `You found ${GEAR_NAMES[g.name]}! (${n} of ${tobiGear.length})` : `Someone dropped this, running: a scout's ${g.name}. (${n} of ${tobiGear.length})`);
      if (met && tobi.state === "follow" && n === tobiGear.length) sayLine("Tobi", "My horn! My pack! You picked up everything I threw away. ... I'll never forget that.");
    }
  }
}
function drawGear(camX) {
  for (const g of tobiGear) {
    if (g.taken) continue; const x = g.x - camX; if (x < -80 || x > W + 80) continue;
    goldGlow(x, g.y, g.t); drawItem("tobi_" + g.name, x, g.y + 2 + Math.sin(g.t * 2) * 2, g.name === "staff" ? 0.5 : 0.36);
  }
}
const lostThings4 = lostThingsTally;
lostThingsTally = function () {
  if (tobiGear.length) return { found: tobiGear.filter(g => g.taken).length, total: tobiGear.length, things: "of Tobi's things", icon: "gear" };
  return lostThings4();
};

// --- Glen's spiked crevice, drawn over a pit
const spikePits = setPieces.filter(p => p.kind === "spikes");
function drawSpikePits(camX) {
  const img = ITEM.spike_pit; if (!img || !img.naturalWidth) return;
  const W0 = img.naturalWidth, H0 = img.naturalHeight, sx0 = W0 * 0.39, sx1 = W0 * 0.61, sy0 = H0 * 0.55;   // the spikes between its two cliffs
  for (const p of spikePits) {
    const x0 = p.c * T - camX, w = p.w * T; if (x0 > W || x0 + w < 0) continue;
    const y0 = GR * T + 0.6 * T, h = H - y0 + 40;
    ctx.drawImage(img, sx0, sy0, sx1 - sx0, H0 - sy0, x0 - 6, y0, w + 12, h);
  }
}

function drawLeopardEyes(camX) {   // main.js, after the night tint: two eyes shining in the dark branches
  const now = performance.now() / 1000;
  for (const L of leopards) {
    if (L.gone || L.state !== "watch") continue;
    const x = L.x - camX, y = L.y - 30, blink = Math.sin(now * 2.3) > 0.97 ? 0.15 : 1, a = (0.75 + Math.sin(now * 9) * 0.25) * blink;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (const ex of [-9, 9]) {
      const g = ctx.createRadialGradient(x + ex, y, 0.5, x + ex, y, 9); g.addColorStop(0, `rgba(255,250,200,${a})`); g.addColorStop(0.35, `rgba(255,215,70,${a * 0.85})`); g.addColorStop(1, "rgba(255,170,20,0)");
      ctx.fillStyle = g; ctx.fillRect(x + ex - 9, y - 9, 18, 18);
      ctx.fillStyle = `rgba(20,10,0,${0.8 * blink})`; ctx.fillRect(x + ex - 0.8, y - 3, 1.6, 6);   // the slit pupil
    }
    ctx.restore();
  }
}
function updateWorld52(dt) { updateLeopards(dt); updateGear(dt); }
function drawWorld52(camX) { drawTobiCave(camX); drawSpikePits(camX); drawLeopards(camX); drawGear(camX); }

// ---------------------------------------------------------------------------
// Hooks: world1.js (critters), main.js (each frame, drawing, the HUD)
// ---------------------------------------------------------------------------
function updateWorld5(dt) {
  if (WORLD !== 5) return;
  updateProvisions(dt); updateFather(); updateVultures(dt); updateFleeing(dt); updateWorld52(dt);
  if (finish.active && finish.phase === "clear" && !W5.provSaved) {   // what's left goes on to the next stage, and to the camp at the end
    W5.provSaved = true;
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.prov = { bread: prov.bread, cheese: prov.cheese };
      localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  }
}
function drawWorld5(camX) {
  if (WORLD !== 5) return;
  drawVultures(camX); drawWorld52(camX); drawFleeing(camX); drawFather(camX); drawProvisionDrops(camX);
}

// ---------------------------------------------------------------------------
// The opening of World 5 (DESIGN "World 5 — Opening scene"), before 5-1 the first time (or ?w5intro): Jesse's house.
// Forty days, three empty places at the table; Jesse gives David the provisions (17:17-18); Hanan keeps the flock (17:20).
// ---------------------------------------------------------------------------
const w5intro = {
  active: false, t: 0, step: 0, stepT: 0, SIZE: 1.5,
  lines: [
    ["", "Forty days. Every morning and every evening, word came from the Valley of Elah of a Philistine champion who shouted at the army of Israel. Eliab, Abinadab and Shammah had gone with Saul."],
    ["Jesse", "Forty days, and no word from your brothers."],
    ["", "Jesse said to David his son, \"Now take for your brothers an ephah of this parched grain and these ten loaves, and carry them quickly to the camp to your brothers; and bring these ten cheeses to the captain of their thousand; and see how your brothers are doing, and bring back news.\" (1 Samuel 17:17-18)"],
    ["Hanan", "Go. I've kept sheep longer than you've been alive. They'll be here when you get back."],
    ["", "David rose up early in the morning and left the sheep with a keeper, and took the provisions and went, as Jesse had commanded him. (1 Samuel 17:20)"],
    null,   // 5: the title card
  ],
  start() { Object.assign(this, { active: true, t: 0, step: 0, stepT: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.stepT += dt;
    const A = this.stepT > 0.8 && (pressed("a") || pressed("b") || pressed("start"));
    if (this.step === 5) { if (this.stepT > 3.2 || A) this.finish(); return; }
    if (A) this.step++, this.stepT = 0;
  },
  finish() {
    this.active = false;
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.w5intro = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  },
  draw() {
    const y = GR * T, s = this.SIZE, now = performance.now() / 1000, keep = bgWorld;
    bgWorld = "w3_1"; drawBackground(0); bgWorld = keep; drawTownGround(y);   // Bethlehem, Jesse's house, early morning
    ctx.fillStyle = "rgba(40,60,110,0.18)"; ctx.fillRect(0, 0, W, H);           // the grey-blue before sunrise
    const jx = W * 0.5, dx = W * 0.3;
    // the three empty places: the brothers' stools by the door
    for (let k = 0; k < 3; k++) { const sx = W * 0.6 + k * 62; ctx.fillStyle = "#6b4a2b"; ctx.fillRect(sx - 22, y - 34, 44, 8); ctx.fillStyle = "#4e3520"; ctx.fillRect(sx - 18, y - 26, 6, 26); ctx.fillRect(sx + 12, y - 26, 6, 26); }
    if (SPR.jesse_idle) { const nm = (this.step === 1 || this.step === 2) && SPR.jesse_talk ? "jesse_talk" : "jesse_idle"; drawSprite(nm, frameOf(nm, now), jx, y, -1, s); }
    drawSprite("david_idle", frameOf("david_idle", now), dx, y, 1, s);
    if (this.step >= 2) {   // the provisions, at David's feet
      drawItem("grain_sack", dx + 90, y, 0.3); drawProvision("bread", dx + 140, y, 1.1); drawProvision("cheese", dx + 185, y, 1.1);
    }
    if (this.step >= 3 && SPR.hanan_idle) drawSprite(this.step === 3 && SPR.hanan_talk ? "hanan_talk" : "hanan_idle", frameOf("hanan_idle", now), W * 0.14, y, 1, s);
    const a = Math.min(1, this.t / 1); ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(60,36,14,0.85)"; ctx.font = "italic 22px Georgia, serif"; ctx.fillText("Bethlehem, at Jesse's house", W / 2, 50);
    const L = this.lines[this.step];
    if (L) drawStoryBox(L[0], L[1], "A: next", true);
    if (this.step === 5) {
      const f = Math.min(1, this.stepT / 0.8); ctx.fillStyle = `rgba(10,6,2,${0.75 * f})`; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = f; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 54px Georgia, serif"; ctx.fillText("WORLD 5", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff6e2"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText("The Road to the Valley", W / 2, H / 2 + 30); ctx.globalAlpha = 1;
    }
    ctx.textAlign = "left";
  },
};
if (LEVEL_STAGE === "5-1" && !STORY_HASH) {
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").w5intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w5intro")) w5intro.start();
}
