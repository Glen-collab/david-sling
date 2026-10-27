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
  SPIKE_H: 100,          // (Glen's dark rock spikes, spike_rock) their height in a pit (px); tiled across it, every other one mirrored
  SPIKE_GLOW: 0.6,       // the dusty light at the bottom of a pit, behind the spikes (0 = none)
  SPIKE_SINK: 10,        // how far below the bottom of the screen their feet go (px): lower shows less of them
  LOAVES: 10, CHEESES: 10,
  DROP_LIFE: 7,          // seconds a dropped loaf or cheese lies there before it's gone (it blinks for the last 2)
  RAIDER_SEE: 11,        // tiles: he comes for David when David's this close
  RAIDER_RUN: 300, RAIDER_FLEE: 280,
  FATHER_SIZE: 1.2,
  RAIDER_SIZE: 1.2,      // a grown man: taller than David
  VULTURE_SIZE: 0.45,    // circling high up
  VULTURE_GROUND: 0.6,   // pecking by the road
  VULTURE_CRY: [6, 7],   // seconds between their cries while circling: at least this, plus up to this
  VULTURE_SPOOK: 5,      // tiles: they flap up when David comes this close
  VILLAGER_RUN: 250,     // px/s, fleeing past David toward Bethlehem
  VILLAGER_SIZE: { man: 1.2, staffman: 1.2, woman: 1.1, boy: 0.8, girl: 0.85, braidgirl: 0.8, capman: 1.2, wrapman: 1.2, scarfwoman: 1.1, basketgirl: 1.12 },
};
const PROV_NAMES = { bread: "a loaf", cheese: "a cheese" };
// what David is carrying: full at the start of 5-1, then whatever made it through the stage before
const prov = { bread: W5.LOAVES, cheese: W5.CHEESES, drops: [] };
if (WORLD === 5 && LEVEL_STAGE !== "5-1") {
  try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").prov; if (p) Object.assign(prov, { bread: p.bread, cheese: p.cheese }); } catch (e) {}
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
const vultures = setPieces.filter(p => p.kind === "vultures").map(p => ({ x: p.x, up: false, t: 0, cryT: 0,
  birds: [0, 1, 2].map(k => ({ dx: (k - 1) * 70, ph: k * 2.1, lift: 0 })) }));
function updateVultures(dt) {
  for (const v of vultures) {
    v.t += dt;
    if (!v.up && Math.abs(david.x - v.x) < W5.VULTURE_SPOOK * T && david.deadT <= 0) {
      v.up = true; v.t = 0; v.cryT = W5.VULTURE_CRY[0] + Math.random() * W5.VULTURE_CRY[1];
      sfx("vulture", v.x, 0.9, 0.95 + Math.random() * 0.1);   // (Glen's vulture) they shriek as they go up
      if (!W5.vultureTold) { W5.vultureTold = true; toast("Vultures. They follow armies, waiting. The Philistines can't be far."); }
    }
    if (v.up) for (const b of v.birds) b.lift = Math.min(1, b.lift + dt * (0.35 + b.ph * 0.05));
    if (v.up && (v.cryT -= dt) <= 0) {   // and now and then from up in their circle (quieter: they're high, and it carries only so far)
      v.cryT = W5.VULTURE_CRY[0] + Math.random() * W5.VULTURE_CRY[1];
      sfx("vulture", v.x, 0.45, 0.85 + Math.random() * 0.25);
    }
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
// (Glen, 2026-10-22: four more villagers so the same faces don't keep coming by) each group is 2-3 people, every face
// used once before any comes round again; a child always runs with a grown-up.
const VILLAGERS_BIG = ["man", "woman", "staffman", "capman", "wrapman", "scarfwoman", "basketgirl"], VILLAGERS_KID = ["boy", "girl", "braidgirl"];
const FAMILIES = (() => {
  const big = VILLAGERS_BIG.filter(w => SPR["villager_" + w + "_run"]), kid = VILLAGERS_KID.filter(w => SPR["villager_" + w + "_run"]);
  const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let B = shuf(big), K = shuf(kid); const out = [];
  for (let g = 0; g < 8; g++) {
    if (B.length < 2) B = B.concat(shuf(big)); if (!K.length) K = shuf(kid);
    const grp = [B.shift()]; if (g % 2 === 0) grp.push(B.shift()); grp.push(g % 3 === 2 ? B.shift() : K.shift());
    out.push(grp.filter(Boolean));
  }
  return out;
})();
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
  try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.tobiSecret = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
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
const tobiCave = setPieces.find(p => p.kind === "tobicave"), tobiStart = setPieces.find(p => p.kind === "tobistart");
const tobiX = tobiCave ? tobiCave.x + 5 * T : tobiStart ? tobiStart.x : 0;
const tobi = tobiCave || tobiStart ? { x: tobiX, y: GR * T, home: tobiX, y0: GR * T, vx: 0, vy: 0, onGround: true, facing: -1, state: "hide", t: 0, calmT: 0, kind: "tobi", alpha: 1 } : null;
if (tobi) critters.push(tobi);
if (tobi && tobiStart) Object.assign(tobi, { x: tobiStart.x, home: tobiStart.x, state: "follow", rescued: true });   // 5-3 on: he's with David
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
      let secret = false; try { secret = !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").tobiSecret; } catch (e) {}
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
  else if (k.state === "talk") { nm = "tobi_talk"; i = dialog.t > 0 && dialog.who === "Tobi" ? frameOf(nm, performance.now() / 1000) : 0; }   // (Glen's talking clip, played through)
  else if (k.state === "demo") { nm = "tobi_leap"; i = Math.min(5, Math.floor(k.t / 1.0 * 6)); }
  else if (k.state === "leap") { nm = "tobi_leap"; i = Math.min(4, 1 + Math.floor(k.t / 0.75 * 4)); }
  else if (k.moving) { nm = "tobi_run"; i = frameOf(nm, k.t); }
  else { nm = dialog.t > 0 && dialog.who === "Tobi" ? "tobi_talk" : "tobi_cave"; i = nm === "tobi_talk" ? frameOf(nm, performance.now() / 1000) : 5; }
  drawSprite(nm, i, x, k.y, k.facing, 1, k.alpha);
}
function tobiBlocking() { return tobi && tobiCave && !["follow", "leap", "demo"].includes(tobi.state) ? "There's a frightened scout back in the cave. You can't leave him there." : null; }
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
  if (tobiGear.length) return { found: tobiGear.filter(g => g.taken).length, total: tobiGear.length, things: "Tobi's things", icon: "gear" };
  if (cairns.length) return { found: cairns.filter(c => c.up).length, total: cairns.length, things: "scout markers", icon: "cairn" };
  return lostThings4();
};

// --- Glen's spiked crevice, drawn over a pit. (Glen, 2026-10-22) his dark rock spikes (spike_rock, cut from his
// green-screen picture) in every pit; the old blue crevice (spike_pit) is kept for somewhere like a palace later.
const spikePits = setPieces.filter(p => p.kind === "spikes");
function drawSpikePits(camX) {
  const rock = ITEM.spike_rock && ITEM.spike_rock.naturalWidth ? ITEM.spike_rock : null, img = ITEM.spike_pit;
  if (!rock && (!img || !img.naturalWidth)) return;
  for (const p of spikePits) {
    const x0 = p.c * T - camX, w = p.w * T; if (x0 > W || x0 + w < 0) continue;
    const y0 = GR * T + 0.6 * T, h = H - y0 + 40;
    if (rock) {   // tiled, not stretched: as many as fit, each mirrored from the last so the joins match
      const th = W5.SPIKE_H, n = Math.max(1, Math.round(w / (th * rock.naturalWidth / rock.naturalHeight))), tw = (w + 12) / n, ty = H + W5.SPIKE_SINK - th;
      const glow = ctx.createLinearGradient(0, ty + th * 0.25, 0, H);   // dust down there catching the light, so the dark spikes stand out against it
      glow.addColorStop(0, "rgba(120,82,50,0)"); glow.addColorStop(1, `rgba(120,82,50,${W5.SPIKE_GLOW})`);
      ctx.fillStyle = glow; ctx.fillRect(x0, ty + th * 0.25, w, H - ty);
      for (let i = 0; i < n; i++) {
        ctx.save(); ctx.translate(x0 - 6 + i * tw + (i % 2 ? tw : 0), ty); ctx.scale(i % 2 ? -1 : 1, 1);
        ctx.drawImage(rock, 0, 0, tw + 1, th); ctx.restore();
      }
      continue;
    }
    const W0 = img.naturalWidth, H0 = img.naturalHeight, sx0 = W0 * 0.39, sx1 = W0 * 0.61, sy0 = H0 * 0.55;   // the spikes between its two cliffs
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
// ===========================================================================
// 5-3 The Lookouts' Ridge (night): light stealth. Philistine lookouts with torches watch stretches of the ridge; their
// torchlight is a cone ahead of them. When the moon goes behind a cloud the light shrinks (Tobi: "that's your moment").
// Seen = he shades his eyes, points, shouts, and runs to light his signal fire, and a couple of raiders come. Never a
// fail state, just a harder few seconds. A quick stone knocks the torch out of his hand (no light, no fire). Get through
// unseen for the "Not seen" bonus. Knocked-over scout cairns are the lost things; gazelles bound across (leave them).
//   setPiece("lookout", c, r, { face: -1, patrol: 0, fire: c2 })  r = the row he stands on (GR - 1 = the ground);
//                         patrol = tiles he walks each way (Glen's second lookout); fire = the column of his signal fire
//   setPiece("tower", c, r)       a rough wooden lookout tower: a platform at row r on stilts (plat() is placed in main.js)
//   setPiece("cairn", c, r)       a knocked-over cairn: stand by it a moment and it's stacked again
//   critter("gazelle", c)          harmless: grazes, bounds away when David comes close
//   setPiece("tobistart", c)       Tobi, already with David, following
// ===========================================================================
Object.assign(W5, { CONE_LEN: 8, CONE_HALF: 0.42, CONE_CLOUD: 0.3, SPOT_T: 1.3, LOOK_TURN: 5, PATROL_WALK: 70, CAIRN_T: 0.6,
  LOOKOUT_SIZE: 1.15, GAZELLE_SPOOK: 6 });
for (const n of ["lookout_watch", "lookout_spot", "lookout_run", "lookout_walk"]) TUNE.SPRITE_SIZE[n] = W5.LOOKOUT_SIZE;
if (LEVEL_STAGE === "5-3") Object.assign(W1, { CLOUD_EVERY: 9, CLOUD_TIME: 3.5, CLOUD_DARK: 0.4 });   // clouds pass more often up here
const cloudNow = () => { const k = (performance.now() / 1000) % W1.CLOUD_EVERY; return k < W1.CLOUD_TIME ? Math.sin(Math.PI * k / W1.CLOUD_TIME) : 0; };
const fireAt = c => setPieces.find(p => p.kind === "signalfire" && p.c === c);
const lookouts = setPieces.filter(p => p.kind === "lookout").map(p => ({ hx: p.x, x: p.x, y: (p.r + 1) * T, face: p.face || -1, patrol: (p.patrol || 0) * T,
  fireX: p.fire ? p.fire * T + T / 2 : null, fireLit: false, fireT: 0, state: "watch", t: Math.random() * 3, turnT: 0, torch: true, seenOnce: false }));
let seenOnRidge = false;
const LOOKOUT_TORCH = [75, -277];   // the torch flame on lookout_watch, sheet px from his feet when he faces right
function torchPos(L) { const s = SCALE * W5.LOOKOUT_SIZE; return { x: L.x + L.face * LOOKOUT_TORCH[0] * s, y: L.y + LOOKOUT_TORCH[1] * s }; }
function coneDrop(L, tp) { return Math.max(0, GR * T - 50 - tp.y); }   // how far the beam falls over its length (to David's middle on the ground)
function coneLen(L) { return W5.CONE_LEN * T * (1 - (1 - W5.CONE_CLOUD) * cloudNow()); }
function inCone(L) {
  const d = david, tp = torchPos(L), dx = (d.x - tp.x) * L.face, len = coneLen(L) * (d.h < STAND_H ? 0.65 : 1);   // keeping low helps
  if (dx < 0 || dx > len) return false;
  const mid = tp.y + coneDrop(L, tp) * dx / coneLen(L), dy = (d.y - d.h / 2) - mid;   // the light slopes down onto the path
  return Math.abs(dy) < Math.tan(W5.CONE_HALF) * dx + 30;
}
function updateLookouts(dt) {
  for (const L of lookouts) {
    L.t += dt;
    if (L.fireLit) L.fireT += dt;
    if (!L.torch) continue;
    if (L.state === "watch") {
      if (L.patrol) {   // Glen's walking lookout: up and down his stretch
        L.x += L.face * W5.PATROL_WALK * dt;
        if (Math.abs(L.x - L.hx) > L.patrol) { L.x = L.hx + Math.sign(L.x - L.hx) * L.patrol; L.face = -L.face; }
      } else {
        L.turnT += dt;
        if (L.turnT > W5.LOOK_TURN) { L.turnT = 0; L.face = -L.face; }   // he looks the other way now and then
      }
      L.cool = Math.max(0, (L.cool || 0) - dt);
      if (!L.cool && inCone(L) && david.deadT <= 0) {
        L.state = "spot"; L.t = 0; L.seenOnce = true; seenOnRidge = true;
        toast(L.fireX && !L.fireLit ? "He's seen you! He's running for the signal fire!" : L.called ? "He's seen you again! Keep moving!" : "He's seen you! He's shouting for help!");
      }
    } else if (L.state === "spot") {   // shades his eyes, points, shouts
      L.face = Math.sign(david.x - L.x) || L.face;
      if (L.t > W5.SPOT_T) {
        if (L.fireX && !L.fireLit) { L.state = "run"; L.t = 0; }
        else { if (!L.called) { L.called = true; raidersCome(); } L.state = "watch"; L.t = 0; L.cool = 4; }   // one wave per lookout
      }
    } else if (L.state === "run") {   // to the brushwood pile, and lights it
      L.face = Math.sign(L.fireX - L.x) || 1; L.x += L.face * 300 * dt;
      if (Math.abs(L.fireX - L.x) < 24) {
        L.fireLit = true; L.fireT = 0; L.called = true; sfx("thunder_3", L.fireX, 0.25, 1.8); raidersCome();
        toast("The signal fire is lit! Raiders are coming. Stand your ground, or keep going.");
        L.state = "back"; L.t = 0;
      }
    } else if (L.state === "back") {
      L.face = Math.sign(L.hx - L.x) || 1; L.x += L.face * 160 * dt;
      if (Math.abs(L.hx - L.x) < 10) { L.x = L.hx; L.state = "watch"; L.t = 0; L.turnT = 0; L.face = -1; L.cool = 4; }
    }
  }
}
function raidersCome() {   // a couple of raiders, from ahead, for the provisions (world5.js raiders)
  for (let n = 0; n < 2; n++) {
    critter("raider", Math.floor(david.x / T) + 12 + n * 5);
    const k = critters[critters.length - 1]; k.home = david.x + (12 + n * 5) * T; k.x = k.home;
  }
}
function stoneHitsLookout(s) {
  for (const L of lookouts) {
    if (!L.torch) continue;
    const tp = torchPos(L), s2 = SCALE * W5.LOOKOUT_SIZE;
    const hitTorch = Math.hypot(s.x - tp.x, s.y - tp.y) < 34, hitBody = Math.abs(s.x - L.x) < 30 && s.y > L.y - 300 * s2 && s.y < L.y;
    if (!hitTorch && !hitBody) continue;
    L.torch = false; L.state = "dark"; L.t = 0; stoneHit(s, 0.6);
    for (let k = 0; k < 14; k++) bits.push({ x: tp.x, y: tp.y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 300, life: 0.7, color: k % 2 ? "#ffb040" : "#ffe08a" });
    toast(hitTorch ? "You knocked the torch right out of his hand! In the dark he can't see a thing." : "The stone knocks him off balance and his torch goes flying. He can't see a thing now.");
    return true;
  }
  return false;
}
function drawLookouts(camX) {
  const now = performance.now() / 1000;
  for (const p of setPieces) if (p.kind === "tower") drawTower(p, camX);
  for (const p of setPieces) if (p.kind === "signalfire") {
    const x = p.x - camX; if (x < -200 || x > W + 200) continue;
    const L = lookouts.find(q => q.fireX && Math.abs(q.fireX - p.x) < T);
    let i = 0; if (L && L.fireLit) i = L.fireT < 0.4 ? 1 : L.fireT < 0.9 ? 2 : 3 + Math.floor(now * 8) % 2;
    drawSprite("signal_fire", i, x, (p.r + 1) * T + 6, 1, 0.8);
  }
  for (const L of lookouts) {
    const x = L.x - camX; if (x < -300 || x > W + 300) continue;
    let nm = "lookout_watch", i = Math.floor(now * 0.6 + L.hx) % 2;
    if (!L.torch) { nm = "lookout_spot"; i = 1; }   // shading his eyes in the dark, no torch
    else if (L.state === "spot") { nm = "lookout_spot"; i = Math.min(3, 1 + Math.floor(L.t / W5.SPOT_T * 3)); }
    else if (L.state === "run" || L.state === "back") { nm = "lookout_run"; i = frameOf(nm, L.t); }
    else if (L.patrol) { nm = "lookout_walk"; i = frameOf(nm, L.t); }
    drawSprite(nm, i, x, L.y, L.face, 1, 1, L.torch ? "" : "brightness(0.6)");
  }
}
function drawLookoutLight(camX) {   // main.js, after the night tint: the torch cones and the signal fires glow
  const now = performance.now() / 1000;
  ctx.save(); ctx.globalCompositeOperation = "lighter";
  for (const L of lookouts) {
    if (L.fireLit) {
      const x = L.fireX - camX, y = L.y - 40, r = 260 + Math.sin(now * 9) * 14;
      if (x > -r && x < W + r) { const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, "rgba(255,150,50,0.5)"); g.addColorStop(1, "rgba(255,90,20,0)"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
    }
    if (!L.torch) continue;
    const tp = torchPos(L), x = tp.x - camX, y = tp.y; if (x < -500 || x > W + 500) continue;
    const len = coneLen(L), h = Math.tan(W5.CONE_HALF) * len, alert = L.state === "spot" ? 0.12 : 0, ey = y + coneDrop(L, tp);
    const g = ctx.createRadialGradient(x, y, 10, x, y, Math.hypot(len, ey - y) * 0.97);   // fades out by the far end
    g.addColorStop(0, `rgba(255,200,110,${0.34 + alert})`); g.addColorStop(0.6, `rgba(255,180,80,${0.14 + alert / 2})`); g.addColorStop(1, "rgba(255,170,70,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x + L.face * len, ey - h); ctx.lineTo(x + L.face * len, ey + h); ctx.lineTo(x, y + 8); ctx.closePath(); ctx.fill();
    const fg = ctx.createRadialGradient(x, y, 2, x, y, 60); fg.addColorStop(0, "rgba(255,190,90,0.55)"); fg.addColorStop(1, "rgba(255,140,40,0)");
    ctx.fillStyle = fg; ctx.fillRect(x - 60, y - 60, 120, 120);
  }
  ctx.restore();
}
function drawTower(p, camX) {   // rough poles and a plank floor, a ladder up the side
  const x0 = p.c * T - camX, w = 4 * T, top = p.r * T, bot = GR * T + 10;
  if (x0 > W + 50 || x0 + w < -50) return;
  if (ITEM.tw_frame_tower) { drawItem("tw_frame_tower", x0 + w / 2, bot, (bot - top + 12) / (900 * 0.82)); return; }   // Glen's trestle (World 6 art)
  ctx.save(); ctx.fillStyle = "#3b2c22"; ctx.strokeStyle = "#2a1f18"; ctx.lineWidth = 4;
  for (const px of [6, w / 2 - 4, w - 14]) ctx.fillRect(x0 + px, top, 9, bot - top);
  ctx.beginPath(); ctx.moveTo(x0 + 10, top + 20); ctx.lineTo(x0 + w - 10, bot - 20); ctx.moveTo(x0 + w - 10, top + 20); ctx.lineTo(x0 + 10, bot - 20); ctx.stroke();
  ctx.fillStyle = "#4e3a2b"; ctx.fillRect(x0 - 6, top - 6, w + 12, 14);
  ctx.fillStyle = "#5c4532"; for (let k = 0; k < 6; k++) ctx.fillRect(x0 - 6 + k * (w + 12) / 6, top - 8, (w + 12) / 6 - 3, 6);
  ctx.restore();
}

// --- the scout cairns (the lost things of 5-3)
const cairns = setPieces.filter(p => p.kind === "cairn").map(p => ({ x: p.x, y: p.y, up: false, still: 0, t: Math.random() * 5 }));
function updateCairns(dt) {
  for (const c of cairns) {
    c.t += dt; if (c.up) continue;
    const near = Math.abs(david.x - c.x) < 1.6 * T && Math.abs(david.y - c.y) < 60 && david.onGround && david.deadT <= 0;
    c.still = near ? c.still + dt : 0;
    if (c.still > W5.CAIRN_T) {
      c.up = true; sfx("stone_hit", c.x, 0.5, 0.8); setTimeout(() => sfx("stone_hit", c.x, 0.5, 1.0), 150); if (typeof chime === "function") chime(5);
      const n = cairns.filter(q => q.up).length;
      toast(n === cairns.length ? `All ${n} scout markers stand again. The next scout won't lose his way.` : `You stacked the stones: a scout's marker again. (${n} of ${cairns.length})`);
    }
  }
}
function drawCairns(camX) {
  for (const c of cairns) {
    const x = c.x - camX; if (x < -80 || x > W + 80) continue;
    if (!c.up) { goldGlow(x, c.y, c.t); drawItem("cairn_down", x, c.y + 4, 0.38); if (c.still > 0) { ctx.fillStyle = "rgba(255,230,140,0.9)"; ctx.fillRect(x - 20, c.y - 50, 40 * Math.min(1, c.still / W5.CAIRN_T), 4); } }
    else drawItem("cairn_up", x, c.y + 4, 0.4);
  }
}

// --- gazelles (harmless)
CRITTER_ART.gazelle = { box: k => ({ x0: k.x - 34, x1: k.x + 34, y0: k.y - 70, y1: k.y }) };
function updateGazelle(k, dx, sameLevel, dt) {
  if (k.state === "bound") { k.x += k.facing * 420 * dt; if (k.t > 2.2) { k.gone = true; k.vx = k.facing * 420; } return; }
  if (k.state === "idle") setCrit(k, "graze");
  k.facing = k.home % 2 ? 1 : -1;
  if (Math.abs(dx) < W5.GAZELLE_SPOOK * T && david.deadT <= 0) { setCrit(k, "bound"); k.facing = -Math.sign(dx) || 1; }
}
function stoneHitsGazelle(k, s) {
  setCrit(k, "bound"); k.facing = Math.sign(k.x - david.x) || 1;
  if (!W5.gazelleTold) { W5.gazelleTold = true; toast("A gazelle! It's no danger to anyone. Leave them be."); }
  return false;
}
function drawGazelle(k, x) {
  if (k.state === "bound") { const f = k.t * 7.7 % 4, hop = Math.sin(k.t * Math.PI * 1.9) * 0; drawSprite("gazelle_leap", Math.floor(f), x, k.y - hop, k.facing, 1, k.alpha); }
  else drawSprite("gazelle_stand", Math.floor(k.t / 2.5) % 2, x, k.y, k.facing, 1, k.alpha);
}

function stoneHitsWorld5(s) { return stoneHitsLeopard(s) || stoneHitsLookout(s) || stoneHitsChariot(s); }
function updateWorld53(dt) {
  updateLookouts(dt); updateCairns(dt);
  if (!W5.warnSaved && talks.some(k => k.done && k.who === "Tobi" && k.say.includes("chariot"))) {   // tier-1 counsel for the chariot (5-4)
    W5.warnSaved = true;
    try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.chariotWarn = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
  }
  if (LEVEL_STAGE === "5-3" && finish.active && finish.phase === "clear" && !W5.notSeenGiven) {
    W5.notSeenGiven = true;
    if (!seenOnRidge) { toast("Not seen! You crossed the whole ridge without a single lookout seeing you. +20 olives"); david.olives = (david.olives || 0) + 20; }
  }
}
function drawWorld53(camX) { drawLookouts(camX); drawCairns(camX); }

// ===========================================================================
// 5-4 Down to Elah (dawn) and BOSS: the Philistine Chariot (DESIGN 5e). Nobody is killed: the crew run back to their
// lines and the horses go free.
//   critter("packdonkey", c)   one of the camp's pack donkeys, run off when the giant shouted (the lost things): walk up
//                              to it and it follows; bring them to the fold
//   setPiece("chariot", c)      the arena: 35 columns from c (one screen). The fight starts when David walks in.
//   setPiece("rough", c, GR, {w}) rough rocky ground: a chariot can't turn on it (Tobi's warning, 5-3)
// Phase 1, the archer: the chariot drives back and forth; the archer raises his bow (a glint = the tell), draws, looses,
//   and ducks behind his shield. Hit him while he's drawing: 3 hits and he drops his bow.
// Phase 2, the wheel: no bow now, the chariot keeps driving back and forth at the same speed, trying to run David down
//   (jump the horses: the scout's leap). Don't hit the horses. A charged stone at the wheel as it passes (tier 2: any
//   stone) and it cracks and wobbles (Glen's damaged-wheel sprite).
// Phase 3, the damaged wheel: one more hit, or driving over the rough ground (Tobi's warning), and it breaks; the archer
//   is thrown off, the horses run on free and he runs home. (Glen, Oct 2026: steady speed, no whip stops, no turning in place.)
// ===========================================================================
Object.assign(W5, { CH_SIZE: 1.4, CH_PATROL: 230, CH_RAM: 420, CH_TELL: 0.85, CH_TELL2: 1.3, CH_ARCHER_HP: 3, CH_WHEEL_HP: 2,
  CH_WHIP: 2.4, CH_WHIP2: 3.2, CH_OVERRUN: 8,   // (unused since the chariot keeps a steady speed: the old ram / whip-stop phase)
  ARROW_SPEED: 620, CH_ARENA: 1.6, DONKEY_FOLLOW: 3,   // CH_ARENA: the fight's width, in screens (the camera follows inside it)
  ROUGH_FLASH: true });
for (const n of ["chariot_full_run", "chariot_full_run_without_bow", "chariot_draw_bow", "chariot_disarmed", "chariot_damaged_wheel", "chariot_fall_off", "chariot_no_rider", "charioteer_run_away", "chariot_crash", "chariot_horses_free", "chariot_archer_flee", "chariot_cart", "chariot_horses_run", "chariot_horses_rear", "chariot_crew_flee"]) TUNE.SPRITE_SIZE[n] = W5.CH_SIZE;

// --- the pack donkeys
CRITTER_ART.packdonkey = { box: k => ({ x0: k.x - 50, x1: k.x + 50, y0: k.y - 90, y1: k.y }) };
const packDonkeys = () => critters.filter(k => k.kind === "packdonkey");
function updatePackDonkey(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (!k.found) {
    if (k.state === "idle") setCrit(k, "graze");
    fall(); k.facing = k.home % 2 ? 1 : -1;
    if (Math.abs(dx) < 1.6 * T && Math.abs(david.y - k.y) < 80 && david.deadT <= 0) {
      k.found = true; setCrit(k, "follow"); sfx("olive_pickup", k.x, 0.8, 0.7);
      const n = packDonkeys().filter(q => q.found).length, all = packDonkeys().length;
      toast(n === all ? `All ${all} of the camp's pack donkeys found! Lead them down to the fold.` : `A pack donkey from the Israelite camp! It follows you. (${n} of ${all})`);
    }
    return;
  }
  if (k.state === "leap") {
    const f = Math.min(1, k.t / 0.75), base = k.ly0 + (k.ly1 - k.ly0) * f;
    k.x = k.lx0 + (k.lx1 - k.lx0) * f; k.y = base - Math.sin(f * Math.PI) * (Math.max(k.ly0, k.ly1) - k.ltop);
    if (f >= 1) { k.y = k.ly1; k.vy = 0; k.onGround = true; setCrit(k, "follow"); }
    return;
  }
  if (k.state === "idle") setCrit(k, "follow");   // (after a fall)
  if (chariot && chariot.on) { fall(); return; }  // they wait out the fight
  const idx = packDonkeys().filter(q => q.found).indexOf(k), want = (W5.DONKEY_FOLLOW + 1.8 * (idx + (tobi ? 1 : 0))) * T;
  if (david.deadT > 0) { fall(); return; }
  if (david.onGround && Math.abs(david.y - k.y) > 30 && Math.abs(dx) < 12 * T) { let tx = david.x - (Math.sign(dx) || 1) * want * 0.6; if (!standable(tx, david.y)) tx = david.x; goatLeap(k, tx, david.y); return; }
  if (Math.abs(dx) > 22 * T && david.onGround) { k.x = david.x - (david.facing || 1) * want; k.y = david.y; k.vy = 0; if (!standable(k.x, k.y)) k.x = david.x; }
  if (Math.abs(dx) > want) {
    k.facing = Math.sign(dx); k.moving = true;
    const sp = 190 + Math.min(260, Math.abs(dx) - want); k.fast = sp > W5.DONKEY2_GALLOP;   // (Glen's second donkey gallops to catch up)
    const moved = runCritter(k, sp, dt);
    if (!moved && k.onGround && groundAhead(k, k.facing)) k.vy = -hopFor(k, k.facing);
  } else { k.moving = false; fall(); }
}
function stoneHitsPackDonkey(k, s) { if (!W5.donkeyStoned) { W5.donkeyStoned = true; toast("Easy! That's one of our own pack donkeys."); } return false; }
// (Glen, 2026-10-22) for variety, every other pack donkey is his second donkey: stands, trots after David, gallops to catch up
Object.assign(W5, { DONKEY2_SIZE: 1.15, DONKEY2_GALLOP: 300 });
for (const n of ["donkey2_stand", "donkey2_graze", "donkey2_trot", "donkey2_gallop"]) TUNE.SPRITE_SIZE[n] = W5.DONKEY2_SIZE;
function drawPackDonkey(k, x) {
  const two = SPR.donkey2_trot && packDonkeys().indexOf(k) % 2 === 1, moving = k.found && (k.moving || k.state === "leap");
  const nm = two ? (moving ? (k.fast || k.state === "leap" ? "donkey2_gallop" : "donkey2_trot") : k.found || !SPR.donkey2_graze ? "donkey2_stand" : "donkey2_graze")
                 : !k.found ? "donkey_graze" : moving ? "donkey_walk" : "donkey_idle";
  drawSprite(nm, frameOf(nm, k.t), x, k.y, k.facing, 1, k.alpha);
  if (!k.found) goldGlow(x, k.y, k.t);
}

// --- the chariot
const chPiece = setPieces.find(p => p.kind === "chariot");
const roughs = setPieces.filter(p => p.kind === "rough").map(p => ({ x0: p.c * T, x1: (p.c + p.w) * T, c: p.c, w: p.w }));
const chariot = chPiece ? { a0: chPiece.c * T, a1: chPiece.c * T + Math.round(W * W5.CH_ARENA), on: false, beaten: false, phase: 1, x: 0, dir: 1, v: 0, state: "wait", t: 0,
  archer: "drive", at: 0, archerHits: 0, wheelHits: 0, wheelA: 0, flash: 0, arrows: [] } : null;
const chS = () => SCALE * W5.CH_SIZE;
const onRough = x => roughs.some(r => x > r.x0 && x < r.x1);
// where the pieces are (cart anchor at ch.x; the wheel under the box; the horses ahead on the pole)
function chParts(ch) {
  const s = chS(), gy = GR * T, cy = gy - 36 * s, dir = ch.dir;
  return { s, gy, cy, wx: ch.x + dir * 21 * s, wy: cy - 34 * s, wr: 70 * s, hx: ch.x + dir * 424 * s,
    cart: { x0: ch.x + Math.min(-73 * dir, 150 * dir) * s, x1: ch.x + Math.max(-73 * dir, 150 * dir) * s, y0: cy - 130 * s, y1: gy },
    horses: { x0: ch.x + dir * 424 * s + Math.min(-260 * dir, 83 * dir) * s, x1: ch.x + dir * 424 * s + Math.max(-260 * dir, 83 * dir) * s, y0: gy - 250 * s, y1: gy },
    archer: chFull(ch) ? { x0: ch.x + dir * 56 * s - 50 * s, x1: ch.x + dir * 56 * s + 50 * s, y0: gy - 330 * s, y1: gy - 190 * s }   // Glen's whole chariot: the archer stands higher, further forward
                       : { x0: ch.x + dir * 11 * s - 45 * s, x1: ch.x + dir * 11 * s + 45 * s, y0: cy - 270 * s, y1: cy - 110 * s } };
}
const chFull = ch => !!SPR.chariot_full_run;   // the chariot is Glen's one galloping picture (horses, cart and archer) the whole fight
const chFront = ch => ch.x + ch.dir * (424 + 83) * chS();   // the horses' front hooves
function chariotFight() { return !!(chariot && chariot.on && !chariot.beaten && david.deadT <= 0); }
function startChariot() {
  const ch = chariot; Object.assign(ch, { on: true, phase: 1, state: "drive", t: 0, archer: "drive", at: 0, archerHits: 0, wheelHits: 0, dir: -1, x: ch.a1 + 300, v: W5.CH_PATROL, arrows: [] });
  sfx("horses", undefined, 0.8);
  toast("Wheels thunder behind you: a Philistine chariot, hunting scouts on the road! Its archer is the danger first: hit him while he draws his bow.");
}
function chariotTurnX(ch) {   // where a charging chariot stops to turn: a few strides past David
  return Math.max(ch.a0 + 3 * T, Math.min(ch.a1 - 3 * T, david.x + ch.dir * W5.CH_OVERRUN * T));
}
function updateChariot(dt) {
  const ch = chariot; if (!ch) return;
  const d = david;
  if (!ch.on && !ch.beaten && d.x > ch.a0 + 3 * T && d.x < ch.a1 && d.deadT <= 0) startChariot();
  if (!ch.on) { ch.t += dt; updateArrows(dt); return; }
  if (d.deadT > 0 && !ch.beaten) {   // David fell: the chariot rides off; back to the fire, and Tobi's counsel
    ch.on = false; ch.arrows = [];
    if (!W5.counsel2 && !TRIAL) { W5.counsel2 = true; setTimeout(() => {   // tier-2 counsel (none in the Shepherd's Trial): a longer tell, a weaker wheel, +1 heart
      sayLine("Tobi", "Sit down. Tell me what happened. ... Watch the archer's bow: when it glints, he's about to draw. And that old wheel's weaker than it looks: jump the horses, turn, and even a quick stone will crack it.");
      d.hearts += 1; }, 2200); }
    return;
  }
  // keep David on the screen with it (the camera is locked to the arena, main.js camLimits)
  if (!ch.beaten) d.x = Math.max(ch.a0 + 20, Math.min(ch.a1 - 20, d.x));
  ch.t += dt; ch.flash = Math.max(0, ch.flash - dt);
  if (ch.state === "crash" || ch.state === "free") { updateChariotCrash(dt); updateArrows(dt); return; }
  const P = chParts(ch), speed = ch.state === "ram" ? W5.CH_RAM : W5.CH_PATROL;
  ch.wheelA += ch.dir * ch.v * dt / Math.max(10, P.wr);
  if (ch.state === "drive") {   // phase 1: up and down the road, the archer shooting
    ch.v = Math.min(speed, ch.v + 400 * dt); ch.x += ch.dir * ch.v * dt;
    if ((ch.dir > 0 && ch.x > ch.a1 + 250) || (ch.dir < 0 && ch.x < ch.a0 - 250)) { ch.dir = -ch.dir; }   // turns off the screen
    if (ch.phase === 1) updateArcher(dt, P);
    if (ch.phase === 3 && onRough(chFront(ch))) {   // the rocks: only if he's charging David standing on them; otherwise the driver eases over
      if (onRough(david.x) || onRough(david.x - T) || onRough(david.x + T)) { crashChariot(true); return; }
      if (!W5.easeTold && ch.x > ch.a0 && ch.x < ch.a1) { W5.easeTold = true; toast("The driver eases the cracked wheel carefully over the rocks. Stand on them, and he'll charge you without looking!"); }
    }
  } else if (ch.state === "whip") {   // phase 2/3 tell: at the edge, the driver whips the reins
    ch.v = 0;
    if (ch.phase === 2 && !W5.whipTold) { W5.whipTold = true; toast("He's stopped to whip the horses. Now! Hold B, and hit the wheel while it stands still."); }
    if (ch.t > (W5.counsel2 ? W5.CH_WHIP2 : W5.CH_WHIP)) { ch.state = "ram"; ch.t = 0; ch.turnX = chariotTurnX(ch); sfx("thunder_2", ch.x, 0.3, 2.2); }
  } else if (ch.state === "ram") {   // the charge: on past David, then it slows to turn
    ch.v = Math.min(speed, ch.v + 900 * dt); ch.x += ch.dir * ch.v * dt;
    if (ch.phase === 3 && onRough(chFront(ch))) { crashChariot(); return; }   // the horses balk at the rocks; the cracked wheel slews into them
    if ((ch.x - ch.turnX) * ch.dir > 0) { ch.state = "brake"; ch.t = 0; }
  } else if (ch.state === "brake") {
    ch.v = Math.max(0, ch.v - 1400 * dt); ch.x += ch.dir * ch.v * dt;
    if (ch.phase === 3 && onRough(chFront(ch))) { crashChariot(); return; }
    if (ch.v <= 0) {
      ch.dir = -ch.dir; ch.state = "whip"; ch.t = 0;   // wheels round on the smooth road
      if (ch.phase === 3 && !W5.roughTold) { W5.roughTold = true; toast(chariotWarned() ? "Tobi: \"The rocks, David! Stand on the rocks and let it charge you!\"" : "It wheels round on the smooth road. Could that cracked wheel take the rocks? Stand on them and let it charge."); }
    }
  }
  // the horses and the cart run you down; the horses never get hurt
  if (ch.state === "ram" || ch.state === "brake" || ch.state === "drive") {
    if (ch.v > 60 && (touchesDavid(P.horses) || touchesDavid(P.cart))) hurtDavid(ch.x + ch.dir * 200);
  }
  updateArrows(dt);
}
const chariotWarned = () => { if (TRIAL) return false; try { return !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").chariotWarn; } catch (e) { return false; } };
function updateArcher(dt, P) {
  const ch = chariot; ch.at += dt;
  const tell = W5.counsel2 ? W5.CH_TELL2 : W5.CH_TELL, onScreen = ch.x > ch.a0 - 100 && ch.x < ch.a1 + 100;
  if (ch.archer === "drive" && ch.at > 1.6 && onScreen) { ch.archer = "raise"; ch.at = 0; }
  else if (ch.archer === "raise" && ch.at > tell) { ch.archer = "draw"; ch.at = 0; }
  else if (ch.archer === "draw" && ch.at > 0.45) {
    ch.archer = "loose"; ch.at = 0;
    const sx = (P.archer.x0 + P.archer.x1) / 2, sy = P.archer.y0 + 40 * P.s, dx = david.x - sx, dy = david.y - 50 - sy, L = Math.hypot(dx, dy) || 1;
    ch.arrows.push({ x: sx, y: sy, vx: dx / L * W5.ARROW_SPEED, vy: dy / L * W5.ARROW_SPEED - 120, t: 0 }); sfx("sling_throw_quick", sx, 0.6, 1.4);
  } else if (ch.archer === "loose" && ch.at > 0.3) { ch.archer = "duck"; ch.at = 0; }
  else if (ch.archer === "duck" && ch.at > 1.1) { ch.archer = "drive"; ch.at = 0; }
}
function updateArrows(dt) {
  const ch = chariot;
  for (let i = ch.arrows.length - 1; i >= 0; i--) {
    const a = ch.arrows[i]; a.t += dt; a.vy += 500 * dt; a.x += a.vx * dt; a.y += a.vy * dt;
    if (Math.abs(a.x - david.x) < 22 && a.y > david.y - david.h && a.y < david.y) { hurtDavid(a.x - a.vx); ch.arrows.splice(i, 1); continue; }
    if (a.y > GR * T || a.t > 3) ch.arrows.splice(i, 1);
  }
}
function crashChariot(rocks) {
  const ch = chariot; ch.state = "crash"; ch.t = 0; ch.v = 0; ch.on = true;
  sfx("horses", ch.x, 0.9); sfx("stone_hit", ch.x, 0.9, 0.5);
  toast(rocks ? "The cracked wheel hits the rocks and breaks apart! The archer is thrown from the chariot!" : "The cracked wheel breaks apart, and the archer is thrown from the chariot!");
}
function updateChariotCrash(dt) {
  const ch = chariot;
  if (ch.state === "crash" && ch.t > 2.6) { ch.state = "free"; ch.t = 0; }
  if (ch.state === "free" && !ch.beaten) {
    ch.beaten = true; sfx("heal", undefined, 0.7);
    toast(SPR.chariot_fall_off ? "The archer picks himself up and runs back toward his own lines. The horses gallop off with the empty chariot. Nobody is hurt." : "The crew jump down and run back toward their own lines. The horses trot off, free. Nobody is hurt.");
    setTimeout(() => sayLine("", "Years later, David would write: \"Some trust in chariots, and some in horses, but we trust in the name of the LORD our God.\" (Psalm 20:7)"), 3500);
    setTimeout(() => sayLine("Tobi", "You did it! And the horses are fine. Come on, David. The camp's just over there."), 11000);
  }
}
function stoneHitsChariot(s) {
  const ch = chariot; if (!ch || !ch.on || ch.beaten || ch.state === "crash") return false;
  const P = chParts(ch), inB = b => s.x > b.x0 && s.x < b.x1 && s.y > b.y0 && s.y < b.y1;
  if (ch.phase === 1 && inB(P.archer)) {
    if (ch.archer === "raise" || ch.archer === "draw") {
      ch.archerHits++; ch.flash = 0.3; ch.archer = "duck"; ch.at = 0; stoneHit(s); sfx("lion_hit", ch.x, 0.6, 1.5);
      if (ch.archerHits >= W5.CH_ARCHER_HP) {
        ch.phase = 2; ch.disarmAt = performance.now() / 1000;   // Glen's disarm: the bow spins away; the chariot drives on at the same speed
        toast("You knocked his bow away! Now he'll try to run you down. Jump the horses (the scout's leap), and hit the wheel with a charged stone as it goes by.");
      } else toast(`Got him! (${ch.archerHits} of ${W5.CH_ARCHER_HP})`);
    } else { stoneHit(s, 0.4); if (!W5.shieldTold) { W5.shieldTold = true; toast("He's behind his shield. Wait for the glint of his bow: hit him while he draws."); } }
    return true;
  }
  // the wheel and the axle above it, up to the cart bed: a standing throw leaves David's hand about as high as the wheel's top
  if (Math.abs(s.x - P.wx) < P.wr * 1.4 && s.y > P.gy - P.wr * 2.6 && s.y < P.gy) {
    if (ch.phase === 1) { stoneHit(s, 0.4); return true; }
    if (!(s.charged || s.power) && !W5.counsel2) { stoneHit(s, 0.4); if (!W5.tapTold) { W5.tapTold = true; toast("A tap stone just bounces off the wheel. Hold B for a charged stone!"); } return true; }
    ch.wheelHits++; ch.flash = 0.3; stoneHit(s); sfx("stone_hit", P.wx, 1, 0.6);
    if (ch.wheelHits >= W5.CH_WHEEL_HP) crashChariot();
    else { ch.phase = 3; toast(chariotWarned() ? "The wheel cracks and wobbles! One more good hit, or remember Tobi: lead it onto the rough ground." : "The wheel cracks and wobbles! One more good hit. (Could that wheel take the rocks?)"); }
    return true;
  }
  if (inB(P.horses)) {
    if (!W5.horseTold) { W5.horseTold = true; toast("Not the horses! They're only pulling the cart. Aim for the wheel."); }
    return false;   // the stone flies on
  }
  if (inB(P.cart)) { stoneHit(s, 0.4); return true; }
  return false;
}
function drawChariot(camX) {
  for (const r of roughs) {   // the rough ground: rocks strewn across the road (it flashes once Tobi's warning matters)
    const x0 = r.x0 - camX; if (x0 > W || x0 + r.w * T < 0) continue;
    for (let k = 0, n = Math.ceil(r.w * T / 80); k < n; k++) {   // rubble and rock piles strewn across the road
      const x = x0 + (k + 0.5) * r.w * T / n + ((k * 37) % 13) - 6;
      drawItem(k % 2 ? "rock_pile_tan" : "rubble_stones", x, GR * T + 8, k % 2 ? 0.15 : 0.2);
    }
    if (chariot && chariot.phase === 3 && !chariot.beaten && Math.floor(performance.now() / 300) % 2) {
      ctx.fillStyle = "rgba(255,200,90,0.16)"; ctx.fillRect(x0, GR * T - 60, r.w * T, 66);
    }
  }
  const ch = chariot; if (!ch) return;
  for (const a of ch.arrows) { ctx.save(); ctx.translate(a.x - camX, a.y); ctx.rotate(Math.atan2(a.vy, a.vx)); drawItem("arrow", 0, 10, 0.5); ctx.restore(); }
  if (!ch.on && !ch.beaten) return;
  const P = chParts(ch), now = performance.now() / 1000, x = ch.x - camX;
  if (x < -700 || x > W + 700) return;
  const dir = ch.dir, flt = ch.flash > 0 ? "brightness(1.8)" : "";
  if ((ch.state === "crash" || ch.state === "free") && SPR.chariot_fall_off) {   // Glen's fall: the wheel gives, the archer is thrown off; then the horses run on with the empty chariot and he runs home
    if (ch.state === "crash") drawSprite("chariot_fall_off", Math.min(5, Math.floor(ch.t / 0.42)), x, P.gy, dir);
    else {
      const t = ch.t, inA = Math.min(1, t * 3), outA = 1;   // they run on until they're off the screen
      drawSprite("chariot_fall_off", 5, x, P.gy, dir, 1, Math.max(0, 1 - t / 0.5));
      drawSprite("chariot_no_rider", frameOf("chariot_no_rider", now), x + dir * t * 430, P.gy, dir, 1, inA * outA);   // the horses gallop on, free
      if (SPR.charioteer_run_away) drawSprite("charioteer_run_away", frameOf("charioteer_run_away", now), x + dir * (290 * P.s - Math.max(0, t - 0.4) * 280), P.gy, -dir, 1, inA * outA);   // up, and back to his own lines
    }
    return;
  }
  if ((ch.state === "crash" || ch.state === "free") && SPR.chariot_crash) {   // Glen's crash: the wheel cracks, shatters, the archer is thrown, the wreck drags to a stop
    if (ch.state === "crash") drawSprite("chariot_crash", Math.min(5, Math.floor(ch.t / 0.42)), x, P.gy, dir);
    else {   // he picks himself up: the wreck fades, and the crew run off back up the road (nobody hurt)
      const t = ch.t, inA = Math.min(1, t * 3), outA = Math.max(0, 1 - t / 4.5);
      drawSprite("chariot_crash", 5, x, P.gy, dir, 1, Math.max(0, 1 - t / 0.5));   // the wreck (horses, cart, the fallen archer) gives way to...
      if (SPR.chariot_horses_free) {   // ...the horses, free of the wreck, galloping back toward their own lines, and the archer up and running after them
        drawSprite("chariot_horses_free", frameOf("chariot_horses_free", now), x + dir * (334 * P.s - t * 430), P.gy, -dir, 1, inA * outA);   // wheeling round, back the way they came
        drawSprite("chariot_archer_flee", frameOf("chariot_archer_flee", now), x + dir * (300 * P.s - Math.max(0, t - 0.4) * 280), P.gy, -dir, 1, inA * outA);
      } else drawSprite("chariot_crew_flee", frameOf("chariot_crew_flee", now), x - t * 260, P.gy, 1, 0.85, inA * outA);
    }
    return;
  }
  if (ch.state === "crash" || ch.state === "free") {   // the broken chariot, tipped down on its axle; the wheel in pieces
    drawItem("chariot_wheel_broken", P.wx - camX, GR * T + 8, 0.42 * P.s / 0.65);
    const crewOut = ch.state === "free" || ch.t > 1.4;
    ctx.save(); ctx.translate(x, P.gy); ctx.rotate(-dir * 0.12); ctx.translate(-x, -P.gy);
    if (crewOut) { ctx.beginPath(); ctx.rect(x - 400, P.cy + 30 * P.s + (200 - 334) * P.s, 800, 400); ctx.clip(); }   // the crew have jumped down: just the empty car
    drawSprite("chariot_cart", 0, x, P.cy + 30 * P.s, dir);
    ctx.restore();
    const ht = ch.state === "free" ? ch.t : 0;
    if (ch.state === "crash") drawSprite("chariot_horses_rear", Math.min(3, Math.floor(ch.t / 0.6)), P.hx - camX, P.gy, dir);
    else drawSprite("chariot_horses_run", frameOf("chariot_horses_run", now), P.hx - camX + dir * ht * 160, P.gy, dir, 1, Math.max(0, 1 - ht / 4));   // free, trotting off
    if (crewOut) { const ct = ch.state === "free" ? ch.t + 1.2 : ch.t - 1.4; drawSprite("chariot_crew_flee", frameOf("chariot_crew_flee", now), x - ct * 260, P.gy, 1, 0.85, Math.max(0, 1 - ct / 4)); }
    return;
  }
  const moving = ch.v > 30;
  if (chFull(ch)) {   // Glen's whole chariot, galloping (standing still while the driver whips); the glint at the bow is phase 1's tell
    const has = n => SPR[n] ? n : "chariot_full_run", dA = now - (ch.disarmAt || -9);
    let nm = has(ch.phase === 1 ? (["raise", "draw", "loose"].includes(ch.archer) ? "chariot_draw_bow" : "chariot_full_run_without_bow")
                 : ch.wheelHits > 0 || ch.phase === 3 ? "chariot_damaged_wheel" : "chariot_full_run_without_bow");
    if (ch.phase === 1 && !SPR.chariot_draw_bow) nm = "chariot_full_run";
    if (ch.phase > 1 && SPR.chariot_disarmed && dA < 0.72) drawSprite("chariot_disarmed", Math.floor(dA / 0.12), x, P.gy, dir, 1, 1, flt);   // the bow knocked out of his hands
    else drawSprite(nm, frameOf(nm, now), x, P.gy, dir, 1, 1, flt);   // always the same gallop
    if (ch.phase === 3 && !SPR.chariot_damaged_wheel) {   // the cracked wheel, wobbling, over the painted one
      const wr = 66 * P.s, wob = Math.sin(now * 25) * 3;
      ctx.save(); ctx.translate(P.wx - camX, P.gy - wr + 6 + wob); ctx.rotate(ch.wheelA); drawItem("chariot_wheel_cracked", 0, wr * 1.04, wr * 2.08 / 260, 1); ctx.restore();
    }
    if (ch.phase === 1 && ch.archer === "raise") {
      const gx = x + dir * 162 * P.s, gy = P.gy - 290 * P.s, a = 0.5 + 0.5 * Math.sin(now * 20);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(gx, gy, 1, gx, gy, 30); g.addColorStop(0, `rgba(255,255,220,${a})`); g.addColorStop(1, "rgba(255,240,150,0)"); ctx.fillStyle = g; ctx.fillRect(gx - 30, gy - 30, 60, 60); ctx.restore();
    }
    return;
  }
  // the horses (galloping, or pawing while the driver whips them)
  drawSprite("chariot_horses_run", moving ? frameOf("chariot_horses_run", now * (ch.v / W5.CH_PATROL)) : Math.floor(now * 4) % 2, P.hx - camX, P.gy, dir);
  // the cart: the archer's pose, or the driver whipping
  let ci = 0;
  if (ch.phase === 1) ci = { drive: 0, raise: 1, draw: 2, loose: 3, duck: 4 }[ch.archer];
  else ci = ch.state === "whip" || ch.state === "ram" ? 5 : 0;
  drawSprite("chariot_cart", ci, x, P.cy, dir, 1, 1, flt);
  if (ch.phase === 1 && ch.archer === "raise") {   // the glint: the tell
    const gx = (P.archer.x0 + P.archer.x1) / 2 - camX + dir * 40 * P.s, gy = P.archer.y0 + 20 * P.s, a = 0.5 + 0.5 * Math.sin(now * 20);
    ctx.save(); ctx.globalCompositeOperation = "lighter"; const g = ctx.createRadialGradient(gx, gy, 1, gx, gy, 26); g.addColorStop(0, `rgba(255,255,220,${a})`); g.addColorStop(1, "rgba(255,240,150,0)"); ctx.fillStyle = g; ctx.fillRect(gx - 26, gy - 26, 52, 52); ctx.restore();
  }
  // the wheel, turning (cracked and wobbling in phase 3)
  const wob = ch.phase === 3 ? Math.sin(now * 25) * 3 : 0, img = ch.phase === 3 ? "chariot_wheel_cracked" : "chariot_wheel", ws = P.wr * 2 / 260;
  ctx.save(); ctx.translate(P.wx - camX, P.wy + wob); ctx.rotate(ch.wheelA); drawItem(img, 0, P.wr, ws, 1); ctx.restore();
}
// the camera stays on the arena while the chariot fight is on (caves.js camLimits asks)
function chariotCam() { return chariot && chariot.on && !chariot.beaten ? [chariot.a0, chariot.a1 - W] : null; }
function chariotBlocking() { return chariot && !chariot.beaten ? "The chariot! Deal with it first." : null; }
const lostThings5 = lostThingsTally;
lostThingsTally = function () {
  const pd = packDonkeys();
  if (pd.length) return { found: pd.filter(k => k.found).length, total: pd.length, things: "pack donkeys", icon: "donkey" };
  return lostThings5();
};
// a voice across the valley, now and then: you can't make out the words yet
let voiceT = 9;
function updateVoice(dt) {
  if (LEVEL_STAGE !== "5-4" || (chariot && chariot.on)) return;
  voiceT -= dt;
  if (voiceT <= 0) { voiceT = 26 + Math.random() * 12; sfx("lion_roar", undefined, 0.25, 0.55);
    toast(W5.voiceTold ? "The voice again, booming across the valley." : "A huge voice booms across the valley, too far off to make out the words. Tobi goes pale."); W5.voiceTold = true; }
}
// the chariot's gallop (Glen's horse-gallop, looped): louder the nearer it is to the middle of the screen, silent while
// it stands; after the crash it follows the horses running off free
const gallopLoop = loopAudio("horse-gallop", false); let gallopVol = 0;
function updateGallop(dt) {
  const ch = chariot; let want = 0;
  if (ch && (ch.on || ch.beaten) && david.deadT <= 0 && !finish.active && audioUnlocked) {
    const hx = ch.state === "free" ? ch.x + ch.dir * ch.t * 430 : ch.x, moving = ch.state === "free" ? ch.t < 8 : ch.state !== "crash" && ch.v > 30;
    if (moving) want = TUNE.SFX_VOLUME * 0.55 * Math.max(0, Math.min(1, 1.25 - Math.abs(hx - (camX + W / 2)) / (W * 0.9)));
  }
  gallopVol = fadeLoop(gallopLoop, gallopVol, want, dt, 3);
}
const hushLoops5 = hushLoops;
hushLoops = function (keepRain) { hushLoops5(keepRain); if (!gallopLoop.paused) gallopLoop.pause(); };
function updateWorld54(dt) { updateChariot(dt); updateVoice(dt); if (LEVEL_STAGE === "5-4") updateGallop(dt); }
function drawWorld54(camX) { drawChariot(camX); }

function updateWorld52(dt) { updateLeopards(dt); updateGear(dt); updateWorld53(dt); updateWorld54(dt); }
function drawWorld52(camX) { drawTobiCave(camX); drawSpikePits(camX); drawLeopards(camX); drawGear(camX); drawWorld53(camX); drawWorld54(camX); }

// ---------------------------------------------------------------------------
// Hooks: world1.js (critters), main.js (each frame, drawing, the HUD)
// ---------------------------------------------------------------------------
function updateWorld5(dt) {
  if (WORLD !== 5) return;
  updateProvisions(dt); updateFather(); updateVultures(dt); updateFleeing(dt); updateWorld52(dt);
  if (finish.active && finish.phase === "clear" && !W5.provSaved) {   // what's left goes on to the next stage, and to the camp at the end
    W5.provSaved = true;
    try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.prov = { bread: prov.bread, cheese: prov.cheese };
      localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
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
    try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.w5intro = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
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
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").w5intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w5intro"))   // (Glen) his film first: the giant at dawn over the Valley of Elah, 17:16
    preFilm.start({ src: "../assets/video/w5_film.mp4", words: [[0.8, 4.2, "The Valley of Elah"], [5.2, 9.9, "Forty days", "“The Philistine came near morning and evening, and presented himself forty days.” (1 Samuel 17:16)"]],
      loop: ["ambience_hills", 0.35, 0.35], cues: [[3.2, "goliath_tenu_li_ish", 0.8], [3.9, "phil_roar", 0.25], [7.4, "goliath_tenu_li_ish_2", 0.45]] }, () => w5intro.start());
}

// ---------------------------------------------------------------------------
// The end of World 5 (DESIGN "End of World 5 — the camp, and the giant"): the Israelite camp at Elah. Tobi's commander,
// the provisions left with the keeper of the baggage (17:22, however many made it), the brothers, and then the voice:
// the Philistine of Gath comes out of the ranks (17:23), shown only as a dark shape far off. The whole army runs
// (17:24); David doesn't. Tobi's gift: his scout's cloak (+1 heart, progress.cloak). Psalm 56:3. Then the Journal.
// Stand-ins until Glen's art: soldiers = the villagers' runs, darkened; the giant = a lookout's shape, blacked out.
// ---------------------------------------------------------------------------
const w5ending = {
  active: false,
  beats: [
    { at: "camp", who: "", text: "Down in the Valley of Elah: the camp of Israel. Tobi ran the last stretch, shouting.", walk: true },
    { at: "camp", who: "Tobi's commander", text: "Tobi?! We thought the Philistines had you! Two days, boy! Where have you been?", cmd: true },
    { at: "camp", who: "Tobi", text: "Hiding in a cave, sir. I'm ashamed of it. This shepherd boy found me, and brought me back.", cmd: true },
    { at: "camp", who: "", prov: true, cmd: true },
    { at: "line", who: "", text: "Israel and the Philistines put the battle in array, army against army. David... ran to the army, and came and greeted his brothers. (1 Samuel 17:21-22)" },
    { at: "line", who: "Shammah", text: "David?! What are you doing down here? ... Father sent bread? Ha! Bless him.", sham: "talk" },
    { at: "line", who: "Eliab", text: "You shouldn't be here.", eli: "talk" },
    { at: "line", who: "", text: "As he talked with them, behold, the champion, the Philistine of Gath, Goliath by name, came up out of the ranks of the Philistines, and said the same words; and David heard them. (1 Samuel 17:23)", giant: true },
    { at: "line", who: "", text: "All the men of Israel, when they saw the man, fled from him and were terrified. (1 Samuel 17:24)", giant: true, flee: true },
    { at: "line", who: "", text: "But David didn't move.", giant: true, flee: true, still: true },
    { at: "line", card: true, giant: true, still: true },
    { at: "line", who: "Tobi", text: "Everyone ran. Even me, again. You didn't. You walked toward it, David. I'll never forget that.", giant: true, still: true, tobi: true },
    { at: "line", who: "", text: "Years later, David would write: \"When I am afraid, I will put my trust in you.\" (Psalm 56:3)", giant: true, still: true, tobi: true },
    { at: "line", who: "", text: "To be continued in World 6: The Valley of Elah.", giant: true, still: true, tobi: true },
  ],
  start(done) { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, done, fade: 0, out: 0, davidX: -80, gave: false }); hushLoops(); dialog.t = 0; },
  provText() {
    let p = { bread: W5.LOAVES, cheese: W5.CHEESES }; try { p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}").prov || p; } catch (e) {}
    const all = p.bread >= W5.LOAVES && p.cheese >= W5.CHEESES;
    return `David left his baggage in the hand of the keeper of the baggage (1 Samuel 17:22): the parched grain, ${all ? "and every one of the ten loaves and ten cheeses" : `${p.bread} of the ten loaves and ${p.cheese} of the ten cheeses`}. The cheeses were for the captain of their thousand.`;
  },
  update(dt) {
    this.t += dt; this.bt += dt; this.fade = Math.min(1, this.t / 1.2);
    const B = this.beats[this.i];
    if (B && B.walk) this.davidX = Math.min(W * 0.3, this.davidX + TUNE.WALK_SPEED * 0.7 * dt);
    if (B && B.giant && !this.roared) { this.roared = true; sfx("lion_roar", undefined, 0.6, 0.5); this.shake = 1.2; }
    this.shake = Math.max(0, (this.shake || 0) - dt);
    if (B && B.card && this.bt < 0.05 && !this.gave) {
      this.gave = true; sfx("extra_life", undefined, 0.7);
      try { const p = JSON.parse(localStorage.getItem(slotKey("davidProgress")) || "{}"); p.cloak = true; localStorage.setItem(slotKey("davidProgress"), JSON.stringify(p)); } catch (e) {}
    }
    if (this.out > 0) {
      this.out += dt;
      if (this.out > 1.2) { this.active = false; const cb = this.done; this.done = null; cb && cb(); }
      return;
    }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) {
        const was = this.beats[this.i].at; this.i++; this.bt = 0;
        if (this.beats[this.i].at !== was) { this.t = 0; this.fade = 0; }
      } else this.out = 0.001;
    }
  },
  draw() {
    const B = this.beats[this.i], y = GR * T, now = performance.now() / 1000, keep = bgWorld;
    ctx.save(); if (this.shake > 0) ctx.translate(Math.sin(now * 60) * 6 * this.shake, Math.cos(now * 47) * 3 * this.shake);
    bgWorld = "w5_4"; drawBackground(0); bgWorld = keep; drawFlatGround(0);
    if (B.at === "camp") {   // the camp: tents, the keeper's stacks, Tobi and his commander
      for (let k = 0; k < 4; k++) drawItem("town_grain_baskets", W * 0.62 + k * 70, y + 4, 0.16);
      const walking = B.walk && this.davidX < W * 0.3;
      drawSprite(walking ? "david_walk" : "david_idle", frameOf(walking ? "david_walk" : "david_idle", now), B.walk ? this.davidX : W * 0.3, y, 1);
      if (SPR.tobi_talk) drawSprite(B.who === "Tobi" ? "tobi_talk" : "tobi_cave", B.who === "Tobi" ? frameOf("tobi_talk", now) : 5, W * 0.42, y, 1);
      if (B.cmd) drawCommander(W * 0.56, y, B.who === "Tobi's commander", now);
      if (B.prov) { drawItem("grain_sack", W * 0.68, y + 2, 0.3); drawProvision("bread", W * 0.73, y, 1.2); drawProvision("cheese", W * 0.77, y, 1.2); }
      if (SPR.baggage_keeper) {   // Glen's keeper of the baggage: 0 standing, 1 taking a sack, 2 counting, 3 pleased
        const kp = B.prov ? (this.bt < 2.5 ? 1 : this.bt < 5 ? 2 : 3) : 0;
        drawSprite("baggage_keeper", kp, W * 0.86, y, -1, 1.05);
      }
    } else {   // the battle line
      if (B.giant) drawGiant(now, this.bt, this.i);
      const fleeing = B.flee, ft = fleeing ? this.bt : 0;
      if (!fleeing && !B.still) {   // the brothers in their war gear
        drawSprite(B.eli ? "eliab_war_talk" : "eliab_war_idle", frameOf(B.eli ? "eliab_war_talk" : "eliab_war_idle", now), W * 0.62, y, -1);
        drawSprite("abinadab_war_idle", frameOf("abinadab_war_idle", now), W * 0.72, y, -1);
        drawSprite("shammah_war_ready", frameOf("shammah_war_ready", now), W * 0.52, y, -1);
      }
      if (fleeing) drawFleeingArmy(now, ft, this.i);
      drawSprite("david_idle", frameOf("david_idle", now), W * 0.34, y, 1);   // David, still
      if (B.tobi && SPR.tobi_talk) drawSprite(B.who === "Tobi" ? "tobi_talk" : "tobi_cave", B.who === "Tobi" ? frameOf("tobi_talk", now) : 5, W * 0.22, y, 1);
    }
    ctx.restore();
    if (B.card) {   // the gift
      const cy = 90, a = Math.min(1, this.bt * 2);
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(25,14,6,0.88)"; ctx.beginPath(); ctx.roundRect(W / 2 - 440, cy, 880, 170, 16); ctx.fill();
      ctx.strokeStyle = "rgba(255,214,120,0.6)"; ctx.lineWidth = 2; ctx.stroke();
      if (SPR.tobi_cave) { ctx.save(); ctx.beginPath(); ctx.arc(W / 2 - 360, cy + 85, 56, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = "#3a4a66"; ctx.fill(); drawSprite("tobi_cave", 5, W / 2 - 360, cy + 190, 1, 1.15); ctx.restore(); }
      ctx.fillStyle = "#ffe08a"; ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Tobi's Scout Cloak", W / 2 + 40, cy + 44);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "18px sans-serif"; ctx.fillText("Tobi wraps his blue-grey cloak around your shoulders.", W / 2 + 40, cy + 76);
      ctx.fillText("One more heart, for good.", W / 2 + 40, cy + 100);
      ctx.font = "italic 17px Georgia, serif"; ctx.fillText("\"Keep it. A scout's cloak is for the bravest one on the road.\"", W / 2 + 40, cy + 140);
      ctx.restore(); ctx.textAlign = "left";
    } else if (B.prov) drawStoryBox("", this.provText(), "A: next", true);
    else if (B.text) drawStoryBox(B.who, B.text, this.i === this.beats.length - 1 ? (JOURNAL_PAGES[5] ? "A: write in the Journal" : "A: continue") : "A: next", true);
    if (B.card) caption("A: next", 0.8, true);
    const a = Math.min(this.fade, 1 - Math.min(1, this.out / 1.2));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
function drawCommander(x, y, talking, now) {   // Glen's commander when he comes; until then a soldier's shape (Eliab's war gear, aged)
  // Glen's commander (commander_poses: 0 standing, 1 talking, 2 arms crossed, 3 laughing with relief). His running-
  // to-Tobi and gripping-his-shoulders poses come after Glen's Photoshop pass.
  if (SPR.commander_poses) { drawSprite("commander_poses", talking ? [1, 3][Math.floor(now * 0.9) % 2] : 0, x, y, -1, 1.05); return; }
  drawSprite(talking ? "eliab_war_talk" : "eliab_war_idle", frameOf("eliab_war_idle", now), x, y, -1, 1.05, 1, "saturate(0.5) brightness(0.85)");
}
function drawGiant(now, bt, beat) {   // far off on the Philistine hill, a huge dark shape; shown only in silhouette for now
  const a = Math.min(1, bt * 0.8 + 0.3), x = W * 0.84, y = GR * T - 215, nm = SPR.goliath_silhouette ? "goliath_silhouette" : "lookout_spot";
  drawPhilistineRanks(y, Math.min(1, bt * 0.8 + 0.5));
  ctx.save(); ctx.globalAlpha = a * 0.88;   // across the valley: twice the height of the men around him, even from here
  // Glen's silhouette: 0 standing, 1 shouting with the spear up, 2 pointing across the valley, 3 laughing
  const gp = beat <= 7 ? (bt < 1.2 ? 0 : 1) : beat === 8 ? 2 : 3;
  drawSprite(nm, nm === "lookout_spot" ? 3 : gp, x, y, -1, nm === "lookout_spot" ? 0.95 : 1.1, 1, "brightness(0) blur(0.8px)");
  ctx.restore();
}
// the Philistine army in array on its hill (Glen's silhouettes, cut to items, facing Israel): a back rank, a front rank,
// and a gap in the front where the champion has stepped out of the ranks (17:23)
const PHIL_RANKS = [
  ["squad", 0.655, 1], ["rider", 0.715, 1], ["spear3", 0.775, 1], ["shield3", 0.885, 1], ["small1", 0.93, 1], ["small2", 0.955, 1], ["small3", 0.98, 1],
  ["shield1", 0.685, 0], ["spear1", 0.725, 0], ["archer", 0.77, 0], ["spear2", 0.905, 0], ["shield2", 0.945, 0], ["chariot", 1.0, 0],
];
function drawPhilistineRanks(y, a) {
  if (!ITEM.phil_sil_spear1) {   // stand-in: little shapes
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "rgba(10,8,8,0.8)";
    for (let k = -6; k <= 6; k++) if (k) { const mx = W * 0.84 + k * 18, h = 26 + (k % 3) * 3; ctx.beginPath(); ctx.ellipse(mx, y - h, 5, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(mx - 5, y - h + 4, 10, h - 4); }
    ctx.restore(); return;
  }
  for (const [nm, fx, back] of PHIL_RANKS) ctx.filter = "blur(0.6px)", drawItem("phil_sil_" + nm, W * fx, y - back * 6, back ? 0.19 : 0.23, a * (back ? 0.7 : 0.9));
  ctx.filter = "none";
}
// (Glen, 2026-10-27: it looked like the same three men in waves of three) a mixed crowd: the soldier in different
// tints and sizes, two of the camp's men among them, each at his own speed and spacing; a new order on each beat.
const FLEE_TINTS = ["", "brightness(0.85) sepia(0.2)", "brightness(1.08) hue-rotate(-8deg)", "brightness(0.95) saturate(0.8)", "sepia(0.35) brightness(0.92)"];
function fleeCrowd(seed) {
  let r = seed * 9301 + 49297; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  // (Glen, 2026-10-27) his four soldiers (spear, two with axes, pitchfork), two or three of each, and the two camp men
  const who = ["soldier_run", "soldier_run", "soldier_run2", "soldier_run2", "soldier_run3", "soldier_run3", "soldier_run4", "soldier_run4", "soldier_run", "villager_capman_run", "villager_wrapman_run", "soldier_run3"].filter(n => SPR[n]);
  for (let i = who.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [who[i], who[j]] = [who[j], who[i]]; }
  let x = 60; const out = [];
  for (const nm of who) {
    const v = nm.startsWith("villager_");
    out.push({ nm, x0: x, sp: 380 + rnd() * 230, ph: rnd() * 2, dy: Math.round(-8 + rnd() * 16),
      sc: v ? W5.VILLAGER_SIZE[nm.slice(9, -4)] : 1.0 + rnd() * 0.18, f: v ? "sepia(0.15)" : FLEE_TINTS[Math.floor(rnd() * FLEE_TINTS.length)] });
    x += 50 + rnd() * 210;   // sometimes two together, sometimes a gap
  }
  return out.sort((p, q) => p.dy - q.dy);   // the ones further back drawn first
}
let fleeCrowdFor = -1, fleeCrowdNow = [];
function drawFleeingArmy(now, t, beat = 0) {   // soldiers running past David, away from the giant
  if (!SPR.soldier_run) {
    for (let k = 0; k < 9; k++) {
      const nm = ["villager_man_run", "villager_staffman_run"][k % 2], x = W + 100 + k * 130 - t * (420 + (k % 3) * 60);
      if (x > -150 && x < W + 150) drawSprite(nm, frameOf(nm, now + k * 0.13), x, GR * T + (k % 2 ? 6 : -4), -1, 1.15, 1, "sepia(0.4) brightness(0.8)");
    }
    return;
  }
  if (fleeCrowdFor !== beat) { fleeCrowdFor = beat; fleeCrowdNow = fleeCrowd(beat + 3); }
  for (const q of fleeCrowdNow) {
    const x = W + 100 + q.x0 - t * q.sp; if (x < -150 || x > W + 150) continue;
    drawSprite(q.nm, frameOf(q.nm, now * (q.sp / 470) + q.ph), x, GR * T + q.dy, -1, q.sc, 1, q.f);
  }
}
// "?w5end" plays the End of World 5 straight away (testing); "?w5end=8" starts at that beat
if (new URLSearchParams(location.search).has("w5end")) setTimeout(() => {
  w5ending.start(() => location.reload());
  const at = Number(new URLSearchParams(location.search).get("w5end")) || 0; if (at) Object.assign(w5ending, { i: at, fade: 1, t: 2, davidX: W * 0.3 });
}, 300);
