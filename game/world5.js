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

// ---------------------------------------------------------------------------
// Hooks: world1.js (critters), main.js (each frame, drawing, the HUD)
// ---------------------------------------------------------------------------
function updateWorld5(dt) {
  if (WORLD !== 5) return;
  updateProvisions(dt); updateFather(); updateVultures(dt); updateFleeing(dt);
  if (finish.active && finish.phase === "clear" && !W5.provSaved) {   // what's left goes on to the next stage, and to the camp at the end
    W5.provSaved = true;
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.prov = { bread: prov.bread, cheese: prov.cheese };
      localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  }
}
function drawWorld5(camX) {
  if (WORLD !== 5) return;
  drawVultures(camX); drawFleeing(camX); drawFather(camX); drawProvisionDrops(camX);
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
