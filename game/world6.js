// World 6's stage pieces (loaded after world5.js). The Valley of Elah (1 Samuel 17:25-37): forty days of the giant's
// shouting, and an army that has lost heart. The lost things of World 6 are FRIGHTENED SOLDIERS, five a stage: find each
// one and play the harp beside him, and he stands up, picks up his spear and goes back to his post (DESIGN 5f).
//   setPiece("fearful", c, r, { look })  a frightened soldier, hiding (behind a tent, under a wagon, up on the rocks...).
//                              Sit and play the harp (Select) near him: W6.LIFT_T seconds of song and he's lifted.
//                              Stand-in until Glen's soldiers: Tobi's hiding poses (tobi_cave), tinted per look.
//   setPiece("standing", c, r, { look })  a soldier standing about the camp (scenery, for the talk() lines beside him)
//   setPiece("tent", c, GR, { w })  an army tent, w tiles wide: land on the roof and it springs you up (like 4-3's awnings)
//   setPiece("wagon", c, GR, { w }) a supply wagon: a bed to stand on (plat), sacks and jars on it
//   setPiece("tower", c, r)    the watch platform (world5.js drawTower); place plat(c, r, 4) with it
//   setPiece("eliab", c)       6-1's end: Eliab hears David asking about the giant (17:28-30), a scene over the stage
//   setPiece("volley", c, GR, { to, shot })  6-2: open ground from c to `to` under the far slope's archers (shot "stones":
//                              slingers). A shout, shadows on the ground, then the volley; rocks are cover.
//   setPiece("skirmisher", c) a Philistine who charges with his shield up; setPiece("watchtower", c) 6-4's boss (below)
//   setPiece("carriers"/"fill"/"cistern"/"brother") 6-3: the water carriers on David's footsteps (see below)
//   setPiece("giantview", c, r) 6-2: on a rise, David watches the giant's morning shout (17:4-10); the Field Guide card
// The opening scene (w6intro): the soldiers at the cooking fire, "Forty days" (17:16, 17:25), the title card.

const W6 = {
  LIFT_T: 1.6,           // seconds of harp beside a frightened soldier to lift him
  LIFT_RANGE: 4,         // tiles
  SOLDIER_SIZE: 1.15,    // a grown man (Tobi's poses stand in, a little bigger)
  SOLDIER_RUN: 230,      // px/s, back to his post
  TENT_BOUNCE: 1.15,     // x JUMP_SPEED (x1.3 holding A)
  TENT_DRAW: 1.6,        // the tent picture is this much wider than the springy roof
  LOOKS: ["hue-rotate(-12deg) saturate(0.75) brightness(0.92)", "sepia(0.35) brightness(0.85)", "hue-rotate(18deg) saturate(0.6)", "brightness(0.8) contrast(1.1)", "sepia(0.2) saturate(0.7) brightness(1.02)"],
};
const LIFT_LINES = [
  "...My mother used to sing that. I'd forgotten. Thank you, boy. I'll go back to my post.",
  "I've been hiding back here two days. Listen to me, shaking like a lamb. Not any more.",
  "The LORD is still God, isn't He? Even with that... thing shouting at us. I'll stand my watch.",
  "You came all the way down here with a harp? Ha! All right. All right. Up I get.",
  "Forty days I've heard him. That's the first thing I've heard in forty days that wasn't him.",
];

const CARRY_LINES = [   // 6-3: the carriers who refused to go down
  "I told the captain I'd go tomorrow. I've told him that for a week. ...Give me a jar.",
  "That song... my father sang it at the well. All right. I'll carry.",
  "If a boy can walk down there, I can too. Wait for me!",
  "I dropped my jar and ran the first day. Is there a spare? I'll follow you.",
  "The camp is thirsty and I've been hiding in the reeds. No more. I'm coming.",
];

// --- the frightened soldiers (the lost things)
const fearful = setPieces.filter(p => p.kind === "fearful").map((p, i) => ({ x: p.x, y: p.y, look: p.look ?? i, state: "hide", t: 0, song: 0, dir: p.dir || 1, alpha: 1, told: false }));
function updateFearful(dt) {
  const d = david;
  for (const s of fearful) {
    s.t += dt;
    if (s.state === "hide") {
      const near = Math.abs(d.x - s.x) < W6.LIFT_RANGE * T && Math.abs(d.y - s.y) < 3 * T;
      if (near && !s.told && d.state !== "harp") {
        s.told = true;
        if (!W6.hinted) { W6.hinted = true; sayLine("", "A soldier, curled up and shaking. He doesn't even look up. Forty days of that voice... Maybe a song would help him (Select: play the harp)."); }
        else toast("Another frightened soldier. Play the harp for him (Select).");
      }
      s.song = near && d.state === "harp" && d.deadT <= 0 ? s.song + dt : Math.max(0, s.song - dt * 0.5);
      if (s.song >= W6.LIFT_T) {
        s.state = "rise"; s.t = 0; if (typeof chime === "function") chime(fearful.filter(q => q.state !== "hide").length + 3);
        const n = fearful.filter(q => q.state !== "hide").length; saveLift6();   // courage, for the watchtower fight
        sayLine(carrierSpots.length ? "A water carrier" : "A soldier", (carrierSpots.length ? CARRY_LINES : LIFT_LINES)[(n - 1) % LIFT_LINES.length]);
        if (n === fearful.length) setTimeout(() => toast(`All ${n} frightened soldiers are back at their posts.`), 4500);
      }
    } else if (s.state === "rise") { if (s.t > 2.4) { if (carrierSpots.length) { s.state = "posted"; carrierJoin(s.x, s.y, s.look); } else { s.state = "go"; s.t = 0; } } }   // 6-3: he picks up a jar and joins the line
    else if (s.state === "go") { s.x += s.dir * W6.SOLDIER_RUN * dt; s.alpha = Math.max(0, 1 - s.t / 3); if (s.alpha <= 0) s.state = "posted"; }
  }
}
function drawFearful(camX) {
  const now = performance.now() / 1000;
  for (const s of fearful) {
    if (s.state === "posted") continue;
    const x = s.x - camX; if (x < -150 || x > W + 150) continue;
    const f = W6.LOOKS[s.look % W6.LOOKS.length], man = "soldier" + (s.look % 5 + 1);
    if (s.state === "hide" && s.song > 0) { ctx.fillStyle = "rgba(255,230,140,0.9)"; ctx.fillRect(x - 24, s.y - 130, 48 * Math.min(1, s.song / W6.LIFT_T), 4); }
    if (SPR[man + "_fear"]) {   // Glen's five men, each his own clip: _fear 0 hiding ... 11 standing; _go walking back to his post
      if (s.state === "go") { drawSprite(man + "_go", frameOf(man + "_go", now), x, s.y, s.dir, 1, s.alpha); continue; }
      const fr = s.state === "rise" ? Math.min(11, 2 + Math.floor(s.t / 2.4 * 10)) : s.song > 0.2 ? 1 : 0;
      drawSprite(man + "_fear", fr, x + (fr === 0 && Math.abs(david.x - s.x) > 3 * T ? Math.sin(now * 40) * 1.2 : 0), s.y, s.dir, 1, 1); continue;
    }
    if (s.state === "go") { drawSprite(SPR.soldier_walk ? "soldier_walk" : "soldier_run", frameOf(SPR.soldier_walk ? "soldier_walk" : "soldier_run", now), x, s.y, s.dir, 1, s.alpha, f); continue; }
    if (SPR.soldier_fear) {   // Glen's frightened soldier: 0 curled up, 1 peeking, 2 listening, 3 standing up, 4 spear up, 5 a nod
      const fr = s.state === "rise" ? Math.min(5, 3 + Math.floor(s.t / 0.8)) : s.song > 0.2 ? 2 : Math.abs(david.x - s.x) < 5 * T ? 1 : 0;
      drawSprite("soldier_fear", fr, x + (fr === 0 ? Math.sin(now * 40) * 1.2 : 0), s.y, s.dir, 1, 1, f); continue;
    }
    // stand-in: Tobi's hiding poses (0 curled up, 1 peeking, 3 getting up, 4 standing scared, 5 standing)
    const fr = s.state === "rise" ? [3, 4, 5][Math.min(2, Math.floor(s.t / 0.8))] : s.song > 0.2 ? 2 : Math.abs(david.x - s.x) < 5 * T ? 1 : 0;
    drawSprite("tobi_cave", fr, x + (fr === 0 ? Math.sin(now * 40) * 1.2 : 0), s.y, s.dir, W6.SOLDIER_SIZE, 1, f);
  }
}
const lostThings6 = lostThingsTally;
lostThingsTally = function () {
  if (fearful.length) return { found: fearful.filter(s => s.state !== "hide").length, total: fearful.length, things: "frightened soldiers", icon: "soldier" };
  return lostThings6();
};

// --- soldiers standing about the camp (scenery beside the talk() lines)
function drawStanding(camX) {
  const now = performance.now() / 1000;
  for (const p of setPieces) if (p.kind === "standing") {
    const x = p.x - camX; if (x < -150 || x > W + 150) continue;
    const nm = p.look % 2 ? "abinadab_war_idle" : "eliab_war_idle";
    drawSprite(nm, frameOf(nm, now + p.c), x, p.y, p.dir || -1, 1.05, 1, W6.LOOKS[(p.look || 0) % W6.LOOKS.length] + " brightness(0.9)");
  }
}

// --- tents (springy roofs) and supply wagons
const tents6 = setPieces.filter(p => p.kind === "tent").map(p => {
  const s = (p.w || 4) * T * W6.TENT_DRAW / 211, h = 123 * s, r = Math.round((GR * T - h * 0.88) / T);   // drawn wider than the roof you land on (the item has a fence and pots either side)
  plat(p.c, r, p.w || 4); return { c: p.c, w: p.w || 4, r, s, boing: 0 };
});
const wagons6 = setPieces.filter(p => p.kind === "wagon").map(p => { plat(p.c, GR - 2, p.w || 4); return { c: p.c, w: p.w || 4 }; });
function updateTents(dt) {
  const d = david;
  if (d.onGround && d.vy >= 0 && !held("down") && d.deadT <= 0) for (const a of tents6) {
    if (d.x > a.c * T && d.x < (a.c + a.w) * T && Math.abs(d.y - a.r * T) < 3) {
      d.vy = -TUNE.JUMP_SPEED * W6.TENT_BOUNCE * (held("a") ? 1.13 : 1); d.onGround = false; a.boing = 1; sfx("jump", d.x, 0.5, 0.75);
      if (!W6.tentTold) { W6.tentTold = true; toast("Boing! The tent roofs are springy. Hold A on the bounce to go higher; hold Down to land on one."); }
      break;
    }
  }
  for (const a of tents6) a.boing = Math.max(0, a.boing - dt * 3);
}
function drawTents(camX) {
  for (const a of tents6) {
    const x = (a.c + a.w / 2) * T - camX; if (x < -300 || x > W + 300) continue;
    const sq = 1 - a.boing * 0.06;
    ctx.save(); ctx.translate(x, GR * T + 6); ctx.scale(1, sq); drawItem("tent", 0, 0, a.s); ctx.restore();
  }
  for (const g of wagons6) {
    const x0 = g.c * T - camX, w = g.w * T, top = (GR - 2) * T; if (x0 > W + 100 || x0 + w < -100) continue;
    ctx.fillStyle = "#6b4a2b"; ctx.fillRect(x0, top, w, 16); ctx.fillStyle = "#4e3520"; ctx.fillRect(x0, top + 16, w, 6);   // the bed
    ctx.fillStyle = "#5a3d22"; ctx.fillRect(x0 - 4, top - 18, 6, 34); ctx.fillRect(x0 + w - 2, top - 18, 6, 34);           // the side boards
    for (const k of [0.22, 0.78]) drawItem("chariot_wheel", x0 + w * k, GR * T + 4, 0.2);                                     // the wheels
    drawItem("grain_sack", x0 + w * 0.3, top + 2, 0.22); drawItem("town_clay_pots", x0 + w * 0.68, top + 2, 0.13);
  }
}

// --- 6-1's end: Eliab (1 Samuel 17:26-30), a scene over the stage, once, when David reaches him
const eliabSpot = setPieces.find(p => p.kind === "eliab");
const eliabScene = {
  active: false, done: false,
  beats: [
    { who: "David", text: "What shall be done to the man who kills this Philistine, and takes away the reproach from Israel? For who is this uncircumcised Philistine, that he should defy the armies of the living God? (1 Samuel 17:26)" },
    { who: "A soldier", text: "So shall it be done to the man who kills him. (1 Samuel 17:27)" },
    { who: "", text: "Eliab his oldest brother heard when he spoke to the men; and Eliab's anger burned against David. (1 Samuel 17:28)", eli: "angry" },
    { who: "Eliab", text: "Why have you come down? With whom have you left those few sheep in the wilderness? I know your pride and the evil of your heart; for you have come down that you might see the battle. (1 Samuel 17:28)", eli: "angry" },
    { who: "David", text: "What have I now done? Is there not a cause? (1 Samuel 17:29)", eli: "angry" },
    { who: "", text: "He turned away from him toward another, and spoke like that again. (1 Samuel 17:30) David didn't argue.", eli: "go" },
    { who: "Shammah", text: "He's afraid too, you know. He just shows it by being angry.", eli: "gone", sham: true },
    { who: "", text: "Years later, his son Solomon would write: \"A gentle answer turns away wrath, but a harsh word stirs up anger.\" (Proverbs 15:1)", eli: "gone", sham: true },
  ],
  start() { Object.assign(this, { active: true, i: 0, bt: 0, t: 0, eliX: W * 0.66, out: 0 }); hushLoops(); dialog.t = 0; david.vx = 0; },
  update(dt) {
    this.t += dt; this.bt += dt;
    const B = this.beats[this.i];
    if (B.eli === "go") this.eliX += 140 * dt;
    if (this.out > 0) { this.out += dt; if (this.out > 0.8) { this.active = false; this.done = true; } return; }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) { this.i++; this.bt = 0; } else this.out = 0.001;
    }
  },
  draw() {
    const B = this.beats[this.i], y = GR * T, now = performance.now() / 1000;
    drawBackground(camX); drawFlatGround(0);
    drawSprite("david_idle", frameOf("david_idle", now), W * 0.36, y, 1);
    for (const [k, fx] of [[0, 0.5], [1, 0.82]]) drawSprite(k ? "abinadab_war_idle" : "eliab_war_idle", frameOf("eliab_war_idle", now + k), W * fx, y, -1, 1.05, 1, W6.LOOKS[k + 2] + " brightness(0.85)");   // the men he asked
    if (B.eli !== "gone") {
      const walking = B.eli === "go", nm = walking ? "eliab_war_walk" : B.who === "Eliab" ? "eliab_war_talk" : "eliab_war_idle";
      if (B.eli === "angry" && SPR.eliab_angry) {   // Glen's clip: 0 arms crossed, glaring; 1-14 the rant (arms flung out, up); 15 glaring
        const fr = B.who === "Eliab" ? (this.bt < 6 ? Math.min(15, Math.floor(this.bt / 0.378)) : 4 + Math.floor((this.bt - 6) / 0.378) % 9) : B.who === "David" ? 15 : 0;
        drawSprite("eliab_angry", fr, this.eliX, y, -1);
      } else drawSprite(nm, frameOf(nm, now), this.eliX, y, walking ? 1 : -1, 1, 1, B.eli === "angry" ? "saturate(1.3) sepia(0.25) hue-rotate(-12deg)" : "");   // red in the face
    }
    if (B.sham) drawSprite("shammah_war_ready", frameOf("shammah_war_ready", now), W * 0.58, y, -1);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(60,36,14,0.85)"; ctx.font = "italic 22px Georgia, serif"; ctx.fillText("The camp of Israel", W / 2, 50); ctx.textAlign = "left";
    drawStoryBox(B.who, B.text, this.i === this.beats.length - 1 ? "A: go on" : "A: next", true);
    const a = Math.min(Math.min(1, this.t / 0.6), 1 - Math.min(1, this.out / 0.8));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
function updateEliabSpot() {
  if (!eliabSpot || eliabScene.done || eliabScene.active) return;
  if (david.x > eliabSpot.x - 2 * T && david.onGround && david.deadT <= 0) eliabScene.start();
}

// --- 6-2: the volleys from the far slope (DESIGN 6-2). setPiece("volley", c, GR, { to, kind }) marks open ground between
// columns c and `to`. While David is on it, the Philistine archers (kind "arrows") or slingers ("stones") on the far
// slope shout, and a beat later a volley comes down from the upper right. The shadows on the ground show where it
// will land, in bands with gaps; the next volley shifts the bands, so the gap you stood in last time gets hit. Rocks
// stop them: an overhanging rock (a shelter) is cover; so is a gap between the bands. Roll to cross a band fast.
Object.assign(W6, {
  VOLLEY_EVERY: 3.8,     // seconds from one shout to the next
  VOLLEY_WARN: 1.1,      // the shout, then this long before they loose (the shadows show from the shout)
  ARROW_VX: -230, ARROW_VY: 780,   // px/s: from the far slope, upper right, plunging nearly straight down (so the shadows are honest)
  BAND: 5, GAP: 3,       // tiles: arrows land in bands this wide, with gaps this wide between them
  ARROW_STEP: 26,        // px between arrows in a band (stones: twice this)
  GIANT_BOOM: 24,        // seconds between the giant's shouts across the valley (after David has seen him)
});
const volleyZones = setPieces.filter(p => p.kind === "volley").map(p => ({ x0: p.c * T, x1: (p.to || p.c + 20) * T, kind: p.shot || "arrows" }));
const volley = { t: 0, n: 0, zone: null, shots: [], stuck: [], shout: 0, told: false, sticks: 0 };
// Glen's sounds: a volley is a quick spread of single arrows (his full volley recordings are too much every few seconds;
// arrow_volley_1/2 are kept for the big moments), with now and then one sticking into wood. The war horn sounds when the
// archers first open up and when the watchtower's fight starts; the sword fight is far off under 6-2 to 6-4.
Object.assign(W6, { VOLLEY_ARROWS: 9, STICK_CHANCE: 0.12, BATTLE_VOL: 0.14, BATTLE_VOL_FIGHT: 0.3, battleVol: 0 });
function arrowFlurry(n, vol, spread = 0.5) {   // n single arrows, loosed over `spread` seconds, each a little different
  for (let k = 0; k < n; k++) setTimeout(() => sfx("arrow_single", undefined, vol * (0.6 + Math.random() * 0.4), 0.85 + Math.random() * 0.35), Math.random() * spread * 1000);
}
const battleLoop = loopAudio("ambience-sword-battle", false);
function updateBattleSound(dt) {   // the clash of a skirmish somewhere down the valley
  const want = /^6-[234]$/.test(LEVEL_STAGE) && david.deadT <= 0 ? (towerFight() ? W6.BATTLE_VOL_FIGHT : W6.BATTLE_VOL) : 0;
  if (audioUnlocked) W6.battleVol = fadeLoop(battleLoop, W6.battleVol, want * TUNE.SFX_VOLUME, dt, 0.2);
}
function arrowBlocked(x, y) {
  const c = Math.floor(x / T), r = Math.floor(y / T);
  if (c < 0 || c >= COLS || r < 0) return false;
  if (r >= ROWS) return true;
  const s = solid[r][c]; if (s && s !== 5) return true;
  return !!(oneway[r] && oneway[r][c] && y - r * T < 10);
}
function volleyLaunch(z) {
  const step = W6.ARROW_STEP * (z.kind === "stones" ? 2 : 1), L = W6.BAND + W6.GAP, phase = (volley.n % 2) * Math.ceil(L / 2);
  const vx = W6.ARROW_VX, vy = W6.ARROW_VY, sp = Math.hypot(vx, vy), ux = vx / sp, uy = vy / sp;
  const a = Math.max(z.x0, camX - 160), b = Math.min(z.x1, camX + W + 160);
  for (let tx = a; tx < b; tx += step) {
    if (((Math.floor(tx / T) + phase) % L + L) % L >= W6.BAND) continue;   // a gap
    const gx = tx + (Math.random() - 0.5) * step * 0.4, sy = -40, k = (GR * T - sy) / uy, sx = gx - ux * k;   // aimed at the ground line
    let lx = sx, ly = sy; for (let s = 0; s < 2000 && !arrowBlocked(lx, ly); s += 6) { lx += ux * 6; ly += uy * 6; }   // where it will really land
    volley.shots.push({ x: sx, y: sy, vx, vy, lx, ly, kind: z.kind, t: -Math.random() * 0.12, born: volley.t });
  }
}
function updateVolleys(dt) {
  const d = david;
  volley.shout = Math.max(0, volley.shout - dt);
  const z = volleyZones.find(q => d.x > q.x0 - 2 * T && d.x < q.x1);
  if (z !== volley.zone) { volley.zone = z; volley.t = z ? W6.VOLLEY_EVERY - 1.2 : 0; volley.plan = null; }
  if (z && d.deadT <= 0) {
    volley.t += dt;
    if (!volley.plan && volley.t >= W6.VOLLEY_EVERY) {   // the shout: plan the volley now so its shadows show
      volley.t = 0; volley.n++; volley.shout = 1; volley.pending = [];
      const keep = volley.shots; volley.shots = []; volleyLaunch(z); volley.plan = volley.shots; volley.shots = keep;
      sfxOne(["phil_shout", "phil_shout_2", "phil_shout_3"], undefined, 0.6);   // "Yeru!" (Shoot!), a dozen men on the far slope
      if (!W6.hornBlown) { W6.hornBlown = true; sfx("war_horn", undefined, 0.9); }   // the first time: the Philistine horn
      if (!volley.told) { volley.told = true; sayLine("", z.kind === "stones" ? "A shout from the far slope: slingers! Watch the shadows on the ground. Get in under an overhanging rock, or into a gap." : "A shout from the far slope: archers! Watch the shadows on the ground. Get in under an overhanging rock, or into a gap."); }
    }
    if (volley.plan && volley.t >= W6.VOLLEY_WARN) {
      for (const s of volley.plan) volley.shots.push(s); volley.plan = null; volley.sticks = 0;
      if (z.kind === "stones") sfx("sling_throw_quick", undefined, 0.4, 0.7);
      else arrowFlurry(W6.VOLLEY_ARROWS, 0.45);
    }
  }
  for (let i = volley.shots.length - 1; i >= 0; i--) {
    const s = volley.shots[i]; s.t += dt; if (s.t < 0) continue;
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (d.deadT <= 0 && Math.abs(s.x - d.x) < 16 && s.y > d.y - d.h + 6 && s.y < d.y) { hurtDavid(s.x + 200); volley.shots.splice(i, 1); continue; }
    if (s.y >= s.ly) {
      if (s.kind === "arrows") {
        volley.stuck.push({ x: s.lx, y: s.ly, a: Math.atan2(s.vy, s.vx), t: 0 });
        if (volley.sticks < 2 && Math.random() < W6.STICK_CHANCE) { volley.sticks++; sfx("arrow_with_stick-to-target", s.lx, 0.45, 0.9 + Math.random() * 0.2); }   // now and then one thunks in
      }
      else volley.stuck.push({ x: s.lx, y: s.ly, t: 0, stone: true });
      if (Math.random() < 0.15) sfx("stone_hit", s.lx, 0.25, 1.3);
      volley.shots.splice(i, 1);
    }
  }
  for (let i = volley.stuck.length - 1; i >= 0; i--) if ((volley.stuck[i].t += dt) > 2.5) volley.stuck.splice(i, 1);
}
function drawVolleys(camX) {
  const show = [...(volley.plan || []), ...volley.shots];   // shadows: from the shout until each one lands
  ctx.fillStyle = "rgba(25,8,2,0.7)";
  for (const s of show) {
    const x = s.lx - camX; if (x < -40 || x > W + 40) continue;
    const g = volley.plan && volley.plan.includes(s) ? 0.55 + 0.25 * Math.min(1, volley.t / W6.VOLLEY_WARN) : 0.8 + 0.2 * Math.min(1, Math.max(0, s.y) / Math.max(1, s.ly));
    ctx.beginPath(); ctx.ellipse(x, s.ly - 2, (s.kind === "stones" ? 18 : 14) * g, 6 * g, 0, 0, Math.PI * 2); ctx.fill();
  }
  for (const s of volley.shots) {
    if (s.t < 0) continue; const x = s.x - camX; if (x < -60 || x > W + 60) continue;
    if (s.kind === "stones") { ctx.fillStyle = "#6e6458"; ctx.beginPath(); ctx.arc(x, s.y, 6, 0, Math.PI * 2); ctx.fill(); continue; }
    ctx.save(); ctx.translate(x, s.y); ctx.rotate(Math.atan2(s.vy, s.vx)); drawItem("arrow", 0, 10, 0.5); ctx.restore();
  }
  for (const s of volley.stuck) {
    const x = s.x - camX; if (x < -60 || x > W + 60) continue;
    ctx.save(); ctx.globalAlpha = Math.min(1, (2.5 - s.t) / 0.6);
    if (s.stone) { ctx.fillStyle = "#6e6458"; ctx.beginPath(); ctx.ellipse(x, s.y - 3, 6, 4, 0, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.translate(x, s.y); ctx.rotate(s.a); drawItem("arrow", -14, 10, 0.5); }   // stuck in the ground, half in
    ctx.restore();
  }
  if (volley.shout > 0) {   // the shout from the far slope
    ctx.save(); ctx.globalAlpha = Math.min(1, volley.shout * 2); ctx.textAlign = "center"; ctx.font = "bold italic 34px Georgia, serif";
    ctx.fillStyle = "rgba(120,20,10,0.9)"; ctx.fillText(volley.zone && volley.zone.kind === "stones" ? "\"Sling!\"" : "\"Loose!\"", W * 0.78, 300 - (1 - volley.shout) * 14); ctx.restore();
  }
}

// --- 6-2: the giant, seen in full (DESIGN 6-2). setPiece("giantview", c): when David gets there, he stops on a rise and
// watches the morning shout (17:16) across the valley. The Field Guide card (17:4-7) fills in as he watches, and then he
// writes it in his Journal. From then on the giant stands small on the far hill, and every so often his voice booms.
// (Weights from the WEB's own footnotes: 5000 shekels about 110 pounds, 600 shekels about 13 pounds.)
const GOLIATH_CARD = [
  ["Name", "Goliath, of Gath. Their champion."],
  ["Height", "Six cubits and a span: about 9 feet 9 inches."],
  ["(Or...)", "Some old copies say four cubits and a span: about 6 feet 9."],
  ["Helmet", "Bronze."],
  ["Coat of mail", "Bronze scales: five thousand shekels, about 110 pounds."],
  ["Legs", "Bronze shin armor."],
  ["Javelin", "Bronze, slung between his shoulders."],
  ["Spear", "A shaft like a weaver's beam. The iron head: about 13 pounds."],
  ["Shield", "A man carries it for him, out in front."],
];
const giantSpot = setPieces.find(p => p.kind === "giantview");
const goliathWatch = {
  active: false, done: false,
  beats: [
    { who: "", text: "From the top of the rise, David could see all the way across the valley to the Philistine lines." },
    { who: "", text: "The Philistine came near morning and evening, and presented himself forty days. (1 Samuel 17:16)", giant: true },
    { who: "", text: "A champion out of the camp of the Philistines named Goliath of Gath, whose height was six cubits and a span went out. (1 Samuel 17:4)", giant: true, card: 3 },
    { who: "", text: "He had a helmet of bronze on his head, and he wore a coat of mail; and the weight of the coat was five thousand shekels of bronze. He had bronze shin armor on his legs and a bronze javelin between his shoulders. (1 Samuel 17:5-6)", giant: true, card: 7 },
    { who: "", text: "The staff of his spear was like a weaver's beam; and his spear's head weighed six hundred shekels of iron. His shield bearer went before him. (1 Samuel 17:7)", giant: true, card: 9 },
    { who: "Goliath", text: "Why have you come out to set your battle in array? Am I not a Philistine, and you servants to Saul? Choose a man for yourselves, and let him come down to me. (1 Samuel 17:8)", giant: true, card: 9, boom: true },
    { who: "Goliath", text: "If he is able to fight with me and kill me, then will we be your servants; but if I prevail against him and kill him, then you will be our servants and serve us. (1 Samuel 17:9)", giant: true, card: 9, boom: true },
    { who: "Goliath", text: "I defy the armies of Israel today! Give me a man, that we may fight together! (1 Samuel 17:10)", giant: true, card: 9, boom: true },
    { who: "David", text: "...He's not shouting at the army. He's shouting at the God of the army. Somebody has to answer him.", giant: true, card: 9 },
    { who: "", text: "Years later, David would write: \"I will not be afraid of tens of thousands of people who have set themselves against me on every side.\" (Psalm 3:6)", giant: true, card: 9 },
  ],
  start() { Object.assign(this, { active: true, i: 0, bt: 0, t: 0, out: 0, shake: 0, boomed: -1 }); hushLoops(); dialog.t = 0; david.vx = 0; volley.shots = []; volley.plan = null; },
  update(dt) {
    this.t += dt; this.bt += dt; this.shake = Math.max(0, this.shake - dt);
    const B = this.beats[this.i];
    if (B.boom && this.boomed !== this.i) {   // his own words in Hebrew (Glen's voice): 17:8 "Halo anochi ha-Plishti?", 17:10 "Cheirafti... tenu li ish!"; 17:9 his scream
      this.boomed = this.i; this.shake = 0.9;
      const v = B.text.includes("17:8") ? goliathSays("halo_anochi", 0.85) : B.text.includes("17:10") ? goliathSays("cheirafti", 0.85, "tenu_li_ish") : (sfx("taunting_yells", undefined, 0.8, 0.8), 2.6);
      setTimeout(() => this.active && sfx("phil_roar", undefined, 0.5), v * 1000);   // and his army roars and jeers
    }
    if (this.out > 0) {
      this.out += dt;
      if (this.out > 0.8) {
        this.active = false; this.done = true; W6.boomT = 0;
        try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.goliathCard = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
        if (typeof Journal !== "undefined" && Journal.openNote) Journal.openNote(goliathNote());   // David writes it down
      }
      return;
    }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) { this.i++; this.bt = 0; } else this.out = 0.001;
    }
  },
  draw() {
    const B = this.beats[this.i], y = GR * T, now = performance.now() / 1000;
    ctx.save(); if (this.shake > 0) ctx.translate(Math.sin(now * 60) * 5 * this.shake, Math.cos(now * 47) * 3 * this.shake);
    drawBackground(camX); drawFlatGround(0);
    // the far slope: the Philistine lines, and him in the middle of them, his shield bearer in front
    const hy = y - 150;
    drawPhilistineRanks(hy, 0.85);
    if (B.giant) {
      const a = Math.min(1, (this.i === 1 ? this.bt : 2) * 0.8), gx = W * 0.8, nm = SPR.goliath_silhouette ? "goliath_silhouette" : "lookout_spot";
      ctx.save(); ctx.globalAlpha = a;
      if (SPR.goliath_full) {
        const f = this.i === 7 ? 2 : B.boom ? 1 : 0;
        drawSprite("goliath_full", 3, gx - 110, hy + 4, -1, 0.9, 1, "brightness(0) blur(0.4px)");   // the shield bearer, out in front
        drawSprite("goliath_full", f, gx, hy + 4, -1, 0.9, 1, "brightness(0) blur(0.4px)");
      } else {
        if (ITEM.phil_sil_shield1) drawItem("phil_sil_shield1", gx - 60, hy + 4, 0.2, a);   // the shield bearer, out in front
        drawSprite(nm, nm === "lookout_spot" ? 3 : frameOf(nm, now), gx, hy + 4, -1, nm === "lookout_spot" ? 1.3 : 0.62, 1, "brightness(0) blur(0.4px)");
      }
      ctx.restore();
    }
    drawSprite("david_idle", frameOf("david_idle", now), W * 0.55, y, 1);
    ctx.restore();
    if (B.card) drawGoliathCard(B.card, this.bt);
    drawStoryBox(B.who, B.text, this.i === this.beats.length - 1 ? "A: write it down" : "A: next", true);
    const a = Math.min(Math.min(1, this.t / 0.6), 1 - Math.min(1, this.out / 0.8));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
function drawGoliathCard(n, bt) {   // the Field Guide card, filling in line by line (top left, over the scene)
  const x = 40, y = 175, w = 560, lh = 30;
  ctx.save(); ctx.fillStyle = "rgba(240,226,196,0.94)"; ctx.beginPath(); ctx.roundRect(x, y, w, 64 + GOLIATH_CARD.length * lh, 10); ctx.fill();
  ctx.strokeStyle = "rgba(90,58,24,0.8)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = "#5a2a10"; ctx.font = "bold 22px Georgia, serif"; ctx.fillText("Field Guide: the Philistine champion", x + 18, y + 34);
  ctx.font = "15px Georgia, serif";
  GOLIATH_CARD.forEach(([k, v], i) => {
    if (i >= n) return;
    ctx.globalAlpha = i >= n - 4 ? Math.min(1, bt * 2 - (i % 4) * 0.3) : 1; if (ctx.globalAlpha <= 0) return;
    ctx.fillStyle = "#5a2a10"; ctx.font = "bold 15px Georgia, serif"; ctx.fillText(k, x + 18, y + 64 + i * lh);
    ctx.fillStyle = "#2e1c0c"; ctx.font = "15px Georgia, serif"; ctx.fillText(v.length > 62 ? v.slice(0, v.lastIndexOf(" ", 62)) + "..." : v, x + 130, y + 64 + i * lh);
  });
  ctx.restore();
}
// the Journal note David writes after watching (and its page when the Journal's read from the map: journal.js)
function goliathNote() {
  const left = [{ at: 5, size: "entry", segs: [{ text: "The Philistine champion. Goliath, of Gath.", at: 5 }] }];
  const line = ([k, v]) => ({ at: 5, size: "small", segs: [{ text: `${k}: ${v}`, at: 5 }] });
  for (const r of GOLIATH_CARD.slice(1, 5)) left.push(line(r));          // height (both readings), helmet, coat
  const right = GOLIATH_CARD.slice(5).map(line);                           // legs, javelin, spear, shield
  right.push({ at: 5, size: "entry", segs: [{ text: "Bronze from his head to his shins. Everything covered. Almost.", at: 5 }] },
             { at: 5, size: "small", segs: [{ text: "He defies the armies of the living God. The lion and the bear were bigger than me too.", at: 5 }] });
  return { left, right };
}
// Goliath speaks (Glen's Hebrew, pitched down: assets/sounds/goliath_*.mp3, two takes each); then `then`, 2.2 s later.
// Returns about how many seconds it takes, so the army's roar can come after.
function goliathSays(line, vol, then) {
  const take = n => "goliath_" + n + (Math.random() < 0.5 ? "" : "_2");
  if ((SFX[take(line)] || {}).missing) { sfx("taunting_yells", undefined, vol, 0.8); return 2.6; }
  sfx(take(line), undefined, vol);
  if (then) { setTimeout(() => sfx(take(then), undefined, vol), 2200); return 5.2; }
  return 3.2;
}
function updateGiantSpot(dt) {
  if (giantSpot && !goliathWatch.done && !goliathWatch.active && david.x > giantSpot.x - T && david.onGround && david.deadT <= 0) goliathWatch.start();
  if (!goliathWatch.done) return;
  W6.boomT = (W6.boomT || 0) + dt; W6.shake = Math.max(0, (W6.shake || 0) - dt);   // from now on, his voice booms across the valley every so often (W6.shake: he's mid-shout)
  if (W6.boomT > W6.GIANT_BOOM) {
    W6.boomT = 0; W6.boomN = (W6.boomN || 0) + 1; W6.shake = 2.5;
    const v = goliathSays(["tenu_li_ish", "cheirafti", "halo_anochi"][W6.boomN % 3], 0.4); setTimeout(() => sfx("phil_roar", undefined, 0.22), v * 1000);   // far off (the same words as the line below); his army roars after him
    toast(["The giant's voice booms across the valley: \"Give me a man, that we may fight together!\"", "\"I defy the armies of Israel today!\" The ground seems to shake.", "\"Am I not a Philistine, and you servants to Saul?\""][W6.boomN % 3]);
  }
}
function drawFarGiant(camX) {   // small on the far hill, after David has seen him
  if (!goliathWatch.done || !giantSpot || w6ending.active) return;
  const now = performance.now() / 1000, gx = W * 0.86 - (camX - giantSpot.x + W * 0.3) * 0.06, gy = GR * T - 222;
  if (gx < -100 || gx > W + 100) return;
  const nm = SPR.goliath_full ? "goliath_full" : SPR.goliath_silhouette ? "goliath_silhouette" : "lookout_spot";
  ctx.save(); ctx.globalAlpha = 0.55; drawSprite(nm, nm === "goliath_full" ? (W6.shake > 0 ? 1 : 0) : nm === "lookout_spot" ? 3 : frameOf(nm, now), gx, gy, -1, nm === "lookout_spot" ? 0.6 : 0.24, 1, "brightness(0) blur(0.8px)"); ctx.restore();
}
const drawBackground6 = drawBackground;
drawBackground = function (cx) { drawBackground6(cx); if (WORLD === 6) { drawFarGiant(cx); drawFarTower(cx); } };   // the giant, small on the far hill

// --- 6-3: the water carriers (DESIGN 6-3). setPiece("carriers", c, GR - 1, { n }) n men with empty jars, waiting at the
// top of the path down; when David reaches them they fall in behind him (on his footsteps, like the sheep line).
// setPiece("fill", c, GR, { w }) a pool still holding water: a carrier with an empty jar who walks through it fills it.
// When the far side shouts, the carriers duck where they are; an arrow or stone that hits a man spills his jar (fill
// it again at the next pool). setPiece("cistern", c) the camp's water jars at the end: how many full jars get there.
// In 6-3 the frightened soldiers are the carriers who refused to go: lifted, they pick up a jar and join the line.
// Shammah comes along with a jar of his own; setPiece("brother", c, GR - 1, { who: "abinadab" }) Abinadab, by the
// path, with his counsel for the tower (progress.towerCounsel).
Object.assign(W6, {
  CARRIER_GAP: 74,       // px along David's path between carriers (behind the lamb and any sheep)
  CARRIER_SIZE: 1.0,
  DUCK_H: 50,            // a ducking carrier's height (arrows over that miss him)
});
const carriers = [];
const carrierSpots = setPieces.filter(p => p.kind === "carriers");
for (const p of carrierSpots) for (let k = 0; k < (p.n || 3); k++) carriers.push({ x: p.x - k * 46, y: p.y, jar: "empty", state: "wait", look: k + 2, t: Math.random(), who: "" });
const fills = setPieces.filter(p => p.kind === "fill").map(p => ({ x0: p.c * T, x1: (p.c + p.w) * T, c: p.c, w: p.w }));
const cisternSpot = setPieces.find(p => p.kind === "cistern");
const brothers6 = setPieces.filter(p => p.kind === "brother");
const water6 = { told: {}, reached: false };
if (LEVEL_STAGE === "6-3") carriers.push({ x: (carrierSpots[0] ? carrierSpots[0].x : 6 * T) + 70, y: GR * T, jar: "empty", state: "wait", look: 0, t: 0, who: "Shammah" });
function carrierJoin(x, y, look) { carriers.push({ x, y, jar: "empty", state: "follow", look, t: 0, who: "" }); }
function updateCarriers(dt) {
  if (!carriers.length) return;
  const d = david, nLine = line.filter(sh => sh.how === "rescued").length;
  const ducking = !!(volley.plan || volley.shots.length);
  let k = 0;
  for (const c of carriers) {
    c.t += dt; c.moved = 0;
    if (c.state === "wait") {
      if (Math.abs(d.x - c.x) < 4 * T && d.deadT <= 0) {
        for (const q of carriers) if (q.state === "wait") q.state = "follow";
        sayLine("A water carrier", "You're the shepherd boy who walked toward the giant? ...All right. We'll follow you down. Lead us to the water, and back.");
      }
      continue;
    }
    c.duckT = ducking ? (c.duck ? (c.duckT || 0) + dt : 0) : 0; c.upT = !ducking ? (c.duck ? 0 : (c.upT ?? 9) + dt) : 0;   // how long he's been down, or back up (Glen's carrier sheets)
    c.duck = ducking;
    const i = k++;
    if (ducking || d.deadT > 0) continue;   // heads down until the volley's over
    const tgt = trailAt(TUNE.LAMB_GAP + TUNE.SHEEP_GAP * nLine + W6.CARRIER_GAP * (i + 1));
    if (!tgt) continue;
    const x0 = c.x, far = Math.hypot(tgt.x - c.x, tgt.y - c.y);
    moveToward(c, tgt.x, tgt.y, Math.min(900, Math.max(TUNE.WALK_SPEED * 1.15, far * 5)), dt);
    c.moved = Math.abs(c.x - x0) / Math.max(dt, 1e-4); if (Math.abs(c.x - x0) > 0.3) c.facing = Math.sign(c.x - x0);
    if (c.jar === "empty") for (const f of fills) if (c.x > f.x0 && c.x < f.x1) {
      c.jar = "full"; c.splash = 0.6; sfx("heal", c.x, 0.35, 1.3);
      if (!water6.told.fill) { water6.told.fill = true; setTimeout(() => sayLine("", "Years later, David would write: \"He makes me lie down in green pastures. He leads me beside still waters.\" (Psalm 23:2)"), 1800); toast("The jars fill at the pool. Now get them back to the camp."); }
    }
    c.splash = Math.max(0, (c.splash || 0) - dt);
  }
  // arrows and stones from the far side: a hit spills his jar
  for (let i = volley.shots.length - 1; i >= 0; i--) {
    const s = volley.shots[i]; if (s.t < 0) continue;
    const c = carriers.find(q => q.state === "follow" && Math.abs(s.x - q.x) < 14 && s.y > q.y - (q.duck ? W6.DUCK_H : 90) && s.y < q.y);
    if (!c) continue;
    volley.shots.splice(i, 1); c.hit = 0.5;
    if (c.jar === "full") {
      c.jar = "empty"; c.splash = 0.8; sfx("stone_hit", c.x, 0.5, 0.8);
      toast(c.who ? "Shammah's jar is hit! The water's gone. He can fill it at the next pool." : "A jar is hit! The water's gone. He can fill it at the next pool.");
    }
  }
  for (const c of carriers) c.hit = Math.max(0, (c.hit || 0) - dt);
  // brothers by the path
  for (const b of brothers6) if (!b.told && Math.abs(d.x - b.x) < 3 * T) {
    b.told = true;
    sayLine("Abinadab", "Going for the tower, are you? Those towers are top-heavy. Knock the pins out of the front wheels and it'll lean. Lean it far enough and it goes over.");
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.towerCounsel = Math.max(1, p.towerCounsel || 0); localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  }
  // Shammah, once he's filled his jar at the first pool
  const sham = carriers.find(c => c.who === "Shammah");
  if (sham && sham.jar === "full" && !water6.told.stones) { water6.told.stones = true; setTimeout(() => sayLine("Shammah", "The streambed's full of good stones, you know. Round ones. Smooth. Just the kind you like."), 6000); }
  // the camp's water at the end
  if (cisternSpot && !water6.reached && d.x > cisternSpot.x - T) {
    water6.reached = true;
    const n = carriers.filter(c => c.state === "follow" && c.jar === "full").length, m = carriers.filter(c => c.state === "follow").length;
    toast(n === m && m ? `Every jar full: ${n} jars of water reach the camp!` : `${n} of ${m} jars of water reach the camp.`);
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.water6 = Math.max(n, p.water6 || 0); localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  }
}
function drawCarriers(camX) {
  const now = performance.now() / 1000;
  for (const c of carriers) {
    const x = c.x - camX; if (x < -150 || x > W + 150) continue;
    const dir = c.facing || 1, f = c.who ? "" : W6.LOOKS[c.look % W6.LOOKS.length];
    let top;   // where the jar sits
    if (c.who === "Shammah") {
      const nm = c.duck ? "shammah_war_ready" : c.moved > 20 ? "shammah_war_walk" : "shammah_war_ready";
      drawSprite(nm, frameOf(nm, now + 0.3), x, c.y + (c.duck ? 18 : 0), dir, 1, 1, c.hit > 0 ? "brightness(1.6)" : "");
      top = c.y - (c.duck ? 84 : 126);
    } else if (SPR.carrier_walk) {   // Glen's water carrier: walking with the jar up on his shoulder, ducking down hugging it, getting back up
      const hf = f + (c.hit > 0 ? " brightness(1.6)" : ""), sc = W6.CARRIER_SIZE;
      if (c.duck) drawSprite("carrier_duck", Math.min(7, Math.floor((c.duckT || 0) / 0.05)), x, c.y, dir, sc, 1, hf);
      else if ((c.upT ?? 9) < 0.45) drawSprite("carrier_rise", Math.min(7, Math.floor(c.upT / 0.055)), x, c.y, dir, sc, 1, hf);
      else drawSprite("carrier_walk", c.moved > 20 ? frameOf("carrier_walk", now + c.look * 0.37) : 0, x, c.y, dir, sc, 1, hf);
      const k = SCALE * sc, jx = x - dir * 11 * k, jy = c.y - 312 * k;   // the brim of his jar, walking
      if (c.jar === "full" && !c.duck && (c.upT ?? 9) >= 0.45) { ctx.fillStyle = "rgba(150,210,240,0.9)"; ctx.beginPath(); ctx.ellipse(jx, jy + 3, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill(); }
      if (c.splash > 0) {
        ctx.fillStyle = `rgba(160,215,245,${c.splash})`;
        for (let q = 0; q < 6; q++) { ctx.beginPath(); ctx.arc(jx + Math.cos(q + now * 9) * 16 * (1.2 - c.splash), jy + 6 + Math.sin(q * 2.1) * 10 * (1.2 - c.splash), 3, 0, Math.PI * 2); ctx.fill(); }
      }
      continue;
    } else if (c.duck) {
      drawSprite("tobi_cave", 0, x, c.y, dir, W6.SOLDIER_SIZE, 1, f + (c.hit > 0 ? " brightness(1.6)" : ""));   // stand-in: curled up
      top = c.y - 58;
    } else {
      const run = c.moved > 20, nm = SPR.soldier_run ? "soldier_run" : "villager_man_run";
      drawSprite(nm, run ? frameOf(nm, now * 0.7 + c.look) : 0, x, c.y, dir, W6.CARRIER_SIZE, 1, f + (c.hit > 0 ? " brightness(1.6)" : ""));
      top = c.y - 122;
    }
    // the jar on his shoulder: clay, and a glint of water when it's full
    const jx = x - dir * 20;
    ctx.fillStyle = "#9a5a32"; ctx.beginPath(); ctx.ellipse(jx, top, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#7a4424"; ctx.fillRect(jx - 5, top - 16, 10, 6);
    if (c.jar === "full") { ctx.fillStyle = "rgba(150,210,240,0.95)"; ctx.fillRect(jx - 4, top - 17, 8, 3); }
    if (c.splash > 0) {   // water flying (filling, or spilled)
      ctx.fillStyle = `rgba(160,215,245,${c.splash})`;
      for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(jx + Math.cos(k + now * 9) * 16 * (1.2 - c.splash), top - 8 + Math.sin(k * 2.1) * 10 * (1.2 - c.splash), 3, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  // the count, while the line is out
  const out = carriers.filter(c => c.state === "follow");
  if (out.length) {
    const full = out.filter(c => c.jar === "full").length;
    ctx.save(); ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.beginPath(); ctx.roundRect(W - 230, 250, 200, 40, 10); ctx.fill();
    ctx.fillStyle = "#cfe9f7"; ctx.font = "bold 20px sans-serif"; ctx.fillText(`Water jars: ${full} / ${out.length}`, W - 214, 277); ctx.restore();
  }
}
function drawFills(camX) {   // the pools still holding water: a shallow sheet over the streambed's floor, with reeds
  const now = performance.now() / 1000;
  for (const f of fills) {
    const x0 = f.x0 - camX, w = f.x1 - f.x0; if (x0 > W || x0 + w < 0) continue;
    if (ITEM.reed_pool) { drawItem("reed_pool", x0 + w / 2, GR * T + 16, w * 1.35 / 590); continue; }
    ctx.save(); ctx.fillStyle = "rgba(90,150,160,0.55)"; ctx.beginPath(); ctx.ellipse(x0 + w / 2, GR * T + 4, w / 2, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(230,245,250,0.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x0 + w / 2, GR * T + 3, w / 2.6 + Math.sin(now * 2) * 4, 4, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#5e7a34"; ctx.lineWidth = 3;   // reeds at each end
    for (const e of [x0 + 6, x0 + w - 6]) for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(e + k * 5, GR * T + 6); ctx.quadraticCurveTo(e + k * 7, GR * T - 30, e + k * 9 + Math.sin(now + k) * 3, GR * T - 56 - Math.abs(k) * 6); ctx.stroke(); }
    ctx.restore();
  }
  for (const b of brothers6) {
    const x = b.x - camX; if (x < -150 || x > W + 150) continue;
    const talk = dialog.t > 0 && dialog.who === "Abinadab" && SPR.abinadab_war_talk, nm = talk ? "abinadab_war_talk" : "abinadab_war_idle";   // his counsel: Glen's talking sheet
    drawSprite(nm, frameOf(nm, now), x, b.y, david.x > b.x ? 1 : -1);
  }
  if (cisternSpot) { const x = cisternSpot.x - camX; if (x > -200 && x < W + 200) for (let k = 0; k < 3; k++) drawItem("town_clay_pots", x + k * 60, GR * T + 4, 0.16); }
}

// --- Courage (DESIGN 5f): every frightened soldier lifted anywhere in World 6 is saved (progress.lift6[stage]); in the
// watchtower fight they throw stones from the Israelite slope to draw the archers' fire. More courage, more cover.
function saveLift6() {
  try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.lift6 = p.lift6 || {};
    p.lift6[LEVEL_STAGE] = Math.max(p.lift6[LEVEL_STAGE] || 0, fearful.filter(s => s.state !== "hide").length); localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
}
function courage6() { try { const l = JSON.parse(localStorage.getItem("davidProgress") || "{}").lift6 || {}; return Object.values(l).reduce((a, b) => a + b, 0); } catch (e) { return 0; } }

// --- Philistine skirmishers (6-4, and out of the tower in its fight). setPiece("skirmisher", c): he waits behind his
// shield; when David comes near he charges. Two stones (a charged one counts double) and he drops his shield and runs
// back to his own lines. Nobody dies. Glen's Philistine (phil_run far off, phil_charge shield-up when close, phil_drop,
// phil_flee); without them, the running soldier, darkened and reddened.
Object.assign(W6, { SKIRM_RANGE: 9, SKIRM_SPEED: 210, SKIRM_HP: 2, DROP_MS: 150, PHIL: "sepia(0.55) hue-rotate(-28deg) saturate(1.5) brightness(0.72)" });
const skirms = setPieces.filter(p => p.kind === "skirmisher").map(p => ({ x: p.x, y: p.y, home: p.x, state: "wait", hp: W6.SKIRM_HP, t: 0, alpha: 1, flash: 0 }));
function addSkirm(x) { sfxOne(["phil_hedad", "phil_hedad_2"], x, 0.55); skirms.push({ x, y: GR * T, home: x, state: "run", hp: W6.SKIRM_HP, t: 0, alpha: 1, flash: 0, spawned: true }); }
function updateSkirms(dt) {
  const d = david;
  for (let i = skirms.length - 1; i >= 0; i--) {
    const k = skirms[i]; k.t += dt; k.flash = Math.max(0, k.flash - dt);
    if (k.state === "wait" && Math.abs(d.x - k.x) < W6.SKIRM_RANGE * T && d.deadT <= 0) {
      k.state = "run"; k.t = 0; sfxOne(["phil_hedad", "phil_hedad_2"], k.x, 0.75);   // "Hedad!", his battle cry (Jeremiah 51:14)
      if (!W6.skirmTold) { W6.skirmTold = true; toast("A Philistine skirmisher, shield up, charging! Two stones (or one charged) and he'll run."); }
    }
    if (k.state === "run") {
      const dir = Math.sign(d.x - k.x) || -1; k.dir = dir;
      if (d.deadT <= 0) k.x += dir * W6.SKIRM_SPEED * dt;
      if (Math.abs(d.x - k.x) < 30 && d.y > k.y - 100 && d.deadT <= 0) hurtDavid(k.x);
    } else if (k.state === "drop") {   // he throws down his shield and spear and turns
      if (k.t * 1000 >= W6.DROP_MS * SPR.phil_drop.frames) { k.state = "flee"; k.t = 0; }
    } else if (k.state === "flee") {
      k.x += 320 * dt; k.alpha = Math.max(0, 1 - k.t / 2.5);
      if (k.alpha <= 0) { if (k.spawned) skirms.splice(i, 1); else k.state = "gone"; }
    }
  }
}
function stoneHitsSkirm(s) {
  for (const k of skirms) {
    if (k.state !== "run" && k.state !== "wait") continue;
    if (Math.abs(s.x - k.x) < 26 && s.y > k.y - 110 && s.y < k.y) {
      k.hp -= s.charged || s.power ? 2 : 1; k.flash = 0.25; stoneHit(s);
      if (k.hp <= 0) { k.state = SPR.phil_drop ? "drop" : "flee"; k.t = 0; k.dropX = k.x; setTimeout(() => sfx("phil_nusu_1", k.x, 0.7), 500); /* "Nusu!" (Run!) */ sfx("lion_hit", k.x, 0.4, 1.6); if (!W6.fleeTold) { W6.fleeTold = true; toast("He drops his shield and runs back to his own lines."); } }
      return true;
    }
  }
  return false;
}
function drawSkirms(camX) {
  const now = performance.now() / 1000, nm = SPR.soldier_run ? "soldier_run" : "villager_man_run";
  for (const k of skirms) {
    if (k.state === "gone") continue;
    const x = k.x - camX; if (x < -150 || x > W + 150) continue;
    const dir = k.state === "flee" ? 1 : k.dir || -1, moving = k.state !== "wait";
    if (SPR.phil_charge) {
      if (k.state === "flee" && k.dropX !== undefined) {   // his shield and spear, left lying where he dropped them
        const gx = k.dropX - camX, gy = GR * T; ctx.save(); ctx.globalAlpha = k.alpha;
        ctx.strokeStyle = "#5a3e20"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx - 50, gy - 3); ctx.lineTo(gx + 40, gy - 4); ctx.stroke();
        ctx.fillStyle = "#9a7440"; ctx.strokeStyle = "#5a3e20"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(gx - 22, gy - 5, 26, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      }
      const near = Math.abs(david.x - k.x) < 5 * T, fl = k.flash > 0 ? "brightness(2)" : "";
      if (k.state === "wait") drawSprite("phil_charge", 0, x, k.y, dir, 1, k.alpha, fl);
      else if (k.state === "run") { const nm = near ? "phil_charge" : "phil_run"; drawSprite(nm, frameOf(nm, now + k.home), x, k.y, dir, 1, k.alpha, fl); }
      else if (k.state === "drop") drawSprite("phil_drop", frameOf("phil_drop", k.t, W6.DROP_MS), x, k.y, -(k.dir || -1), 1, k.alpha, fl);   // (the sheet starts facing left)
      else drawSprite("phil_flee", frameOf("phil_flee", now + k.home), x, k.y, 1, 1, k.alpha);
      continue;
    }
    drawSprite(nm, moving ? frameOf(nm, now + k.home) : 0, x, k.y, dir, 1.05, k.alpha, W6.PHIL + (k.flash > 0 ? " brightness(2)" : ""));
    ctx.save(); ctx.globalAlpha = k.alpha;
    if (k.state !== "flee") {   // the shield, out in front; a feathered headdress (the Philistine look)
      ctx.fillStyle = "#8a6a3a"; ctx.strokeStyle = "#4a3418"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(x + dir * 20, k.y - 60, 13, 30, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else { ctx.fillStyle = "#8a6a3a"; ctx.beginPath(); ctx.ellipse(k.home - camX, GR * T - 6, 30, 8, 0, 0, Math.PI * 2); ctx.fill(); }   // dropped
    ctx.fillStyle = "#c9b48a"; for (let f = -2; f <= 2; f++) ctx.fillRect(x + f * 4 - 2, k.y - 128 - Math.abs(f) * -2, 3, 16);
    ctx.restore();
  }
}

// --- 6-4: the tower's shadow. The Philistine watchtower rolls slowly along the far edge of the valley as David comes on;
// its shadow lengthens over the level, darker the nearer the arena.
function drawTowerShadow(camX) {
  if (!twPiece || LEVEL_STAGE !== "6-4" || (tw && tw.state !== "wait")) return;
  const f = Math.max(0, Math.min(1, david.x / (twPiece.c * T))), now = performance.now() / 1000;
  const sx = W * (1.15 - 0.5 * f) + Math.sin(now * 0.2) * 10;   // the shadow's edge creeps in from the right
  ctx.save(); const g = ctx.createLinearGradient(sx - 300, 0, sx + 200, 0);
  g.addColorStop(0, "rgba(20,12,6,0)"); g.addColorStop(1, `rgba(20,12,6,${0.18 + 0.22 * f})`);
  ctx.fillStyle = g; ctx.fillRect(sx - 300, 0, W - sx + 300, H); ctx.restore();
}
function drawFarTower(cx) {   // the tower far off, small, rolling along the far edge (background)
  if (!twPiece || LEVEL_STAGE !== "6-4" || (tw && tw.state !== "wait") || w6ending.active) return;
  const f = Math.max(0, Math.min(1, david.x / (twPiece.c * T))), s = 0.2 + 0.18 * f, x = W * (0.8 - 0.2 * f), y = GR * T - 140;   // its wheels on the far bank
  ctx.save(); ctx.filter = "brightness(0.7) saturate(0.55) contrast(0.85) blur(0.6px)"; drawTowerShape(x, y, s, 0, false); ctx.restore();
}

// ---------------------------------------------------------------------------
// BOSS: the Philistine Watchtower (end of 6-4; DESIGN "BOSS · The Philistine Watchtower"). Made up, and nobody dies:
// when it goes over, the crew climb down the back and run. setPiece("watchtower", c): the arena is one screen from
// column c; the tower stands at its right, its rope ladder down the left side (ladder() in the layout).
// Phase 1, the archers: a shutter creaks open (the tell), an archer leans out, then looses. Two stones into the open
//   window while he's there (the quick release, Gera's) and his bow is knocked away. 4 windows.
// Phase 2, the wheel: the front wheel's pins (they glint if Abinadab told you, 6-3). Each takes a charged stone; the
//   tower jolts and leans. Skirmishers run out from behind it to block you.
// Phase 3, the top: up the rope ladder (its upper rungs are cut: the scout's leap the rest of the way) to the roof.
//   The slingers up there sling at you; a charged stone knocks theirs out of the air. Hit the top beam until it goes.
// Counsel tier 2 (Abinadab, after a fall in the fight): shutters stay open longer, the pins take 2, +1 heart.
// The lifted soldiers (courage6) throw stones from the Israelite slope: an archer sometimes shoots at them instead.
// ---------------------------------------------------------------------------
Object.assign(W6, {
  TW_TELL: 0.65,          // seconds the shutter takes to swing open (the tell)
  TW_OPEN: 1.4, TW_OPEN2: 2.1,   // seconds the archer stays out (counsel 2: longer)
  TW_GAP: 1.2,            // seconds between one window shutting and the next opening
  TW_WIN_HITS: 2,         // stones into an open window to knock his bow away (the quick release puts two in at once)
  TW_PIN_HP: 3, TW_PIN_HP2: 2,
  TW_BEAM_HP: 4,          // stones on the top beam (a charged one counts 2)
  TW_SLING_Y: 60, TW_ROOF_CLIP: 0,   // the roof slingers: feet this far below the roof line; hidden below roof + CLIP
  TW_SLING_EVERY: 2.3,    // seconds between the slingers' throws in phase 3
  TW_SKIRM_EVERY: 6.5,    // seconds between skirmishers out from behind the tower in phase 2
  TW_ARROW: 640,
  TW_W: 6, TW_ROOF: 6,    // the tower: 6 tiles wide; its roof at row 6
  // Glen's tower picture (tw_body, cut at half size from "world6/tower body.png"): measured in that picture's own
  // pixels. Its front wall is at x 225, the floor inside the wicker at y 600, the axle hubs at y 2055, so 0.246 puts
  // the roof on TW_ROOF and the hubs on the wheels' centres. TW_BODY: the body's width in the game (front to back wall).
  TW_PIC: 0.246, TW_BODY: 164,
});
const twPic = (ix, iy) => [(ix - 225) * W6.TW_PIC, (iy - 600) * W6.TW_PIC];   // a point in Glen's picture -> offset from (front, roof)
const twPiece = setPieces.find(p => p.kind === "watchtower");
const tw = twPiece ? (() => {
  const a0 = twPiece.c * T, x0 = a0 + 23 * T, w = W6.TW_BODY;
  return { a0, a1: a0 + W, x0, w, on: false, beaten: false, state: "wait", phase: 1, t: 0, lean: 0, leanTo: 0, jolt: 0,
    wins: [[452, 1671], [688, 1671], [452, 1163], [681, 1163]].map(([ix, iy]) => { const [dx, dy] = twPic(ix, iy);   // the holes in Glen's picture
      return { x: x0 + dx, y: W6.TW_ROOF * T + dy, state: "shut", t: 0, hits: 0 }; }),
    gapT: 0, arrows: [], slung: [], pins: 0, beam: 0, slingT: 0, skirmT: 0, coverT: 3, cover: [], dust: [] };
})() : null;
function towerFight() { return !!(tw && tw.on && !tw.beaten && david.deadT <= 0); }
function towerCam() { return tw && tw.on && !tw.beaten ? [tw.a0, tw.a0] : null; }
function towerBlocking() { return tw && !tw.beaten ? "The watchtower! Its archers cover the whole valley. Deal with it first." : null; }
const twPinHP = () => W6.counsel2 ? W6.TW_PIN_HP2 : W6.TW_PIN_HP;
const twCounsel = () => { try { return (JSON.parse(localStorage.getItem("davidProgress") || "{}").towerCounsel || 0) >= 1; } catch (e) { return false; } };
const twWheel = () => ({ x: tw.x0 + twPic(270, 0)[0], y: GR * T - 38, r: 38 });   // the front hub
const twBeam = () => ({ x0: tw.x0 + tw.w * 0.45, x1: tw.x0 + tw.w + 30, y0: W6.TW_ROOF * T - 130, y1: W6.TW_ROOF * T });   // the frame over the roof
function startTower() {
  sfx("war_horn", undefined, 1); setTimeout(() => arrowFlurry(5, 0.35, 0.3), 2200);   // the horn, and the archers try their bows
  Object.assign(tw, { on: true, state: "fight", phase: 1, t: 0, lean: 0, leanTo: 0, gapT: 0.8, arrows: [], slung: [], pins: 0, beam: 0, slingT: 0, skirmT: 2, coverT: 3, cover: [], dust: [] });
  for (const w of tw.wins) Object.assign(w, { state: "shut", t: 0, hits: 0 });
  for (let i = skirms.length - 1; i >= 0; i--) if (skirms[i].spawned) skirms.splice(i, 1);
  setRoof(false);
  toast(W6.towerSeen ? "The watchtower again. Watch the shutters." : "The Philistine watchtower! Archers behind every shutter. When one creaks open, put two stones in it: the quick release.");
  W6.towerSeen = true;
}
function setRoof(on) { for (let c = Math.floor(tw.x0 / T) - 2; c < Math.ceil((tw.x0 + tw.w) / T); c++) oneway[W6.TW_ROOF][c] = on; }
function updateTower(dt) {
  if (!tw) return;
  const d = david;
  tw.jolt = Math.max(0, tw.jolt - dt * 2); tw.lean += (tw.leanTo - tw.lean) * Math.min(1, dt * 4);
  if (!tw.on && !tw.beaten && d.x > tw.a0 + 3 * T && d.deadT <= 0) startTower();
  updateDust(dt);
  if (!tw.on) return;
  if (d.deadT > 0 && !tw.beaten) {   // David fell: the fight resets; back at the fire, Abinadab's second counsel
    tw.on = false; tw.state = "wait"; tw.arrows = []; tw.slung = []; tw.lean = tw.leanTo = 0; setRoof(false);
    if (!W6.counsel2) { W6.counsel2 = true; setTimeout(() => {
      sayLine("Abinadab", "Sit down. Tell me what happened. ... Those shutters: count to two after the creak, then throw. And that front wheel's rotten; two good stones will have the pins out. Here, have some of my bread first.");
      d.hearts += 1; }, 2200); }
    return;
  }
  tw.t += dt;
  // keep David on his side of it: in front of the tower, unless he's up on the roof
  const onRoof = d.y <= W6.TW_ROOF * T + 4 && tw.phase === 3;
  if (!tw.beaten && tw.state === "fight") d.x = Math.max(tw.a0 + 20, Math.min(onRoof ? tw.x0 + 1.6 * T : tw.x0 - 6, d.x));
  if (tw.state === "fall" || tw.state === "down") { updateTowerFall(dt); updateTwShots(dt); return; }
  if (tw.phase === 1) updateWindows(dt);
  else if (tw.phase === 2) {
    tw.skirmT -= dt; if (tw.skirmT <= 0) { tw.skirmT = W6.TW_SKIRM_EVERY; addSkirm(tw.x0 + tw.w * 0.5); }
    if (!twCounsel() && !W6.pinHint && tw.t > 9) { W6.pinHint = true; toast("The tower creaks and settles on its front wheel. That wheel's held on with wooden pins..."); }
  } else if (tw.phase === 3) {
    tw.slingT -= dt;
    if (tw.slingT <= 0 && d.deadT <= 0) {   // a slinger rises over the parapet and slings at David
      tw.slingT = W6.TW_SLING_EVERY; tw.slingUp = 0.5;
      const sx = tw.x0 + tw.w * (0.6 + Math.random() * 0.3), sy = W6.TW_ROOF * T - 80, tt = 0.9, g = 700;
      tw.slung.push({ x: sx, y: sy, vx: (d.x - sx) / tt, vy: (d.y - 50 - sy - 0.5 * g * tt * tt) / tt, g, t: 0 });
      sfx("sling_throw_quick", sx, 0.5, 1.2);
    }
    tw.slingUp = Math.max(0, (tw.slingUp || 0) - dt);
  }
  updateCover(dt); updateTwShots(dt);
}
function updateWindows(dt) {
  const open = tw.wins.find(w => w.state === "tell" || w.state === "open");
  if (!open) {
    tw.gapT -= dt;
    const left = tw.wins.filter(w => w.state !== "done");
    if (tw.gapT <= 0 && left.length) { const w = left[Math.floor(Math.random() * left.length)]; w.state = "tell"; w.t = 0; w.hits = 0; sfx("jump", w.x, 0.25, 0.5); }
    return;
  }
  const w = open; w.t += dt;
  if (w.state === "tell" && w.t > W6.TW_TELL) { w.state = "open"; w.t = 0; w.shot = false; w.atSlope = courage6() > 0 && Math.random() < Math.min(0.45, courage6() * 0.03); }
  else if (w.state === "open") {
    const stay = W6.counsel2 ? W6.TW_OPEN2 : W6.TW_OPEN;
    if (!w.shot && w.t > stay * 0.7) {   // he looses: at David, or at the stones coming from the slope
      w.shot = true;
      const tx = w.atSlope ? tw.a0 - 400 : david.x, ty = w.atSlope ? GR * T - 300 : david.y - 50, dx = tx - w.x, dy = ty - w.y, L = Math.hypot(dx, dy) || 1;
      tw.arrows.push({ x: w.x, y: w.y, vx: dx / L * W6.TW_ARROW, vy: dy / L * W6.TW_ARROW - 120, t: 0 }); sfx("arrow_single", w.x, 0.8, 0.95 + Math.random() * 0.1);
      if (w.atSlope && !W6.coverTold) { W6.coverTold = true; toast("He's shooting at the slope! The soldiers you lifted are throwing stones at the tower, drawing its fire."); }
    }
    if (w.t > stay) { w.state = "shut"; w.t = 0; tw.gapT = W6.TW_GAP; }
  }
}
function updateCover(dt) {   // stones from the Israelite slope: more lifted soldiers, more often
  const c = courage6(); if (!c) return;
  tw.coverT -= dt;
  if (tw.coverT <= 0) {
    tw.coverT = 2.5 + 30 / (c + 3);
    const w = tw.wins[Math.floor(Math.random() * tw.wins.length)], sx = tw.a0 - 40, sy = GR * T - 320, tt = 1.3, g = 600;
    tw.cover.push({ x: sx, y: sy, vx: (w.x - sx) / tt, vy: (w.y - sy - 0.5 * g * tt * tt) / tt, g, t: 0, tt, w });
  }
  for (let i = tw.cover.length - 1; i >= 0; i--) {
    const s = tw.cover[i]; s.t += dt; s.vy += s.g * dt; s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.t >= s.tt) {
      tw.cover.splice(i, 1); stoneHit(s, 0.3);
      if (s.w.state === "open" && !s.w.shot) { s.w.state = "shut"; s.w.t = 0; tw.gapT = W6.TW_GAP; }   // he ducks back in
    }
  }
}
function updateTwShots(dt) {
  const d = david;
  for (let i = tw.arrows.length - 1; i >= 0; i--) {
    const a = tw.arrows[i]; a.t += dt; a.vy += 500 * dt; a.x += a.vx * dt; a.y += a.vy * dt;
    if (Math.abs(a.x - d.x) < 22 && a.y > d.y - d.h && a.y < d.y) { hurtDavid(a.x - a.vx); tw.arrows.splice(i, 1); continue; }
    if (a.y > GR * T || a.t > 3) { if (a.y > GR * T && Math.random() < 0.3) sfx("arrow_with_stick-to-target", a.x, 0.4); tw.arrows.splice(i, 1); }
  }
  for (let i = tw.slung.length - 1; i >= 0; i--) {
    const s = tw.slung[i]; s.t += dt; s.vy += s.g * dt; s.x += s.vx * dt; s.y += s.vy * dt;
    if (Math.abs(s.x - d.x) < 20 && s.y > d.y - d.h && s.y < d.y) { hurtDavid(s.x - s.vx); tw.slung.splice(i, 1); continue; }
    if (s.y > GR * T + 20 || s.t > 3) tw.slung.splice(i, 1);
  }
}
function stoneHitsTower(s) {
  if (!tw || !tw.on || tw.beaten || tw.state !== "fight") return false;
  // phase 3: knock their stones out of the air (a charged one)
  for (let i = tw.slung.length - 1; i >= 0; i--) {
    const q = tw.slung[i];
    if (Math.hypot(q.x - s.x, q.y - s.y) < 22) {
      if (s.charged || s.power) { tw.slung.splice(i, 1); stoneHit(s, 0.7); if (!W6.knockTold) { W6.knockTold = true; toast("Knocked it out of the air!"); } return true; }
      return false;
    }
  }
  const inTower = false;   // (seen side-on: a stone that misses the windows flies on past the tower; only the targets stop it)
  if (tw.phase === 1) {
    const at = tw.wins.filter(w => w.state !== "done" && Math.abs(s.x - w.x) < 30 && Math.abs(s.y - w.y) < 40);   // a dark window lets a stone through
    const anyOpen = tw.wins.some(w => w.state === "open");   // seen side-on, a stone flies on past a shut shutter to the open window behind it
    for (const w of at.filter(w => w.state === "open" || !anyOpen).slice(0, 1)) {
      if (w.state === "open") {
        w.hits++; stoneHit(s); sfx("lion_hit", w.x, 0.5, 1.6); w.flash = 0.25;
        if (w.hits >= W6.TW_WIN_HITS) {
          w.state = "done"; w.t = 0; tw.gapT = W6.TW_GAP; tw.dust.push({ x: w.x, y: w.y, vx: -60, vy: -120, t: 0, bow: true });
          const left = tw.wins.filter(q => q.state !== "done").length;
          if (!left) { tw.phase = 2; tw.t = 0; tw.skirmT = 1.5; toast(twCounsel() ? "Every bow knocked away! Now Abinadab's counsel: the pins in the front wheel. Charged stones (hold B)!" : "Every bow knocked away! Skirmishers are coming out from behind the tower..."); }
          else toast(`His bow went flying! (${4 - left} of 4)`);
        } else if (!W6.oneTold) { W6.oneTold = true; toast("One! Quick, the second stone (tap B twice)!"); }
      } else { stoneHit(s, 0.4); if (!W6.shutTold) { W6.shutTold = true; toast("Thunk. The shutter's shut. Wait for one to creak open."); } }
      return true;
    }
    if (inTower) { stoneHit(s, 0.35); return true; }
    return false;
  }
  if (tw.phase === 2) {
    const wh = twWheel();
    if (Math.hypot(s.x - wh.x, s.y - wh.y) < wh.r + 10) {
      if (!(s.charged || s.power)) { stoneHit(s, 0.4); if (!W6.pinTapTold) { W6.pinTapTold = true; toast("A tap stone won't shift a wheel pin. Hold B for a charged stone!"); } return true; }
      tw.pins++; stoneHit(s); sfx("stone_hit", wh.x, 1, 0.55); tw.jolt = 1; tw.leanTo += 1.4; if (typeof w2Shake !== "undefined") w2Shake.v = 0.8;
      if (tw.pins >= twPinHP()) {
        tw.phase = 3; tw.t = 0; tw.slingT = 2.5; setRoof(true);
        for (const k of skirms) if (k.spawned && k.state === "run") { k.state = "flee"; k.t = 0; }
        toast("The pin's out! The tower lurches and leans on its broken wheel. Now the top: up the rope ladder. Its top rungs are cut, so leap the rest (A again in the air).");
      } else toast(`A pin knocked loose! The tower jolts. (${tw.pins} of ${twPinHP()})`);
      return true;
    }
    if (inTower) { stoneHit(s, 0.35); return true; }
    return false;
  }
  if (tw.phase === 3) {
    const b = twBeam();
    if (s.x > b.x0 && s.x < b.x1 && s.y > b.y0 && s.y < b.y1) {
      if (david.y > W6.TW_ROOF * T + 4) { stoneHit(s, 0.4); if (!W6.lowTold) { W6.lowTold = true; toast("From down here the stones just thunk off the planks. Get up on top!"); } return true; }
      tw.beam += s.charged || s.power ? 2 : 1; stoneHit(s); sfx("stone_hit", s.x, 1, 0.7); tw.jolt = 1; tw.leanTo += 1.2;
      if (tw.beam >= W6.TW_BEAM_HP) towerFall();
      else toast("The top beam cracks! The whole tower sways.");
      return true;
    }
    if (inTower) { stoneHit(s, 0.35); return true; }
  }
  return false;
}
function towerFall() {
  Object.assign(tw, { state: "fall", t: 0, slung: [], arrows: [] }); setRoof(false);
  const lc = Math.floor(tw.x0 / T) - 2, li = ladders.findIndex(l => l.c === lc);   // its rope ladder goes over with it
  if (li >= 0) { for (const r of ladders[li].rungs) for (let c = lc; c < lc + 2; c++) { oneway[r][c] = false; if (typeof ladderRungs !== "undefined") ladderRungs.delete(c + "," + r); } ladders.splice(li, 1); }
  const d = david;
  if (d.x > tw.x0 - 2.5 * T && d.y < GR * T - 10) { d.vx = -380; d.vy = -520; d.onGround = false; setState("jump"); }   // David leaps clear
  sfx("thunder_2", tw.x0, 0.6, 0.7);
  sfx("phil_nusu", tw.x0, 0.8);   // the crew: "Nusu! Nusu!"
  toast("The beam gives! The crew scramble down the back of the tower and run. Jump clear, David!");
}
function updateTowerFall(dt) {
  tw.t += dt;
  if (tw.state === "fall") {
    tw.lean = tw.leanTo = Math.min(90, tw.lean + (6 + tw.t * tw.t * 60) * dt * 5);
    if (tw.lean >= 90) {
      tw.state = "down"; tw.t = 0; tw.beaten = true; sfx("thunder", tw.x0, 0.9, 0.8); sfx("stone_hit", tw.x0, 1, 0.4);
      if (typeof w2Shake !== "undefined") w2Shake.v = 1.6;
      for (let k = 0; k < 40; k++) tw.dust.push({ x: tw.x0 + tw.w + Math.random() * 420, y: GR * T - Math.random() * 40, vx: (Math.random() - 0.3) * 160, vy: -40 - Math.random() * 120, t: 0, puff: 20 + Math.random() * 30 });
      for (let i = skirms.length - 1; i >= 0; i--) if (skirms[i].spawned) { skirms[i].state = "flee"; skirms[i].t = 0; }
      setTimeout(() => toast("The Philistine watchtower lies in the dust. Its crew are running for their own lines. Nobody is hurt."), 1500);
      setTimeout(() => sayLine("Abinadab", "Moses told our fathers: \"Be strong and courageous. Don't be afraid or scared of them, for the LORD your God himself is who goes with you. He will not fail you nor forsake you.\" (Deuteronomy 31:6)"), 6500);
      const c = courage6(); if (c) setTimeout(() => toast(`Up on the slope, ${c} soldiers who were hiding a day ago are cheering your name.`), 14000);
    }
  }
}
function updateDust(dt) {
  for (let i = tw.dust.length - 1; i >= 0; i--) { const p = tw.dust[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.bow) p.vy += 600 * dt; else p.vy *= 0.97; if (p.t > (p.bow ? 1.4 : 3)) tw.dust.splice(i, 1); }
}
function drawTwDust(camX) {
  for (const p of tw.dust) {
    if (p.bow) { ctx.save(); ctx.translate(p.x - camX, p.y); ctx.rotate(p.t * 9); ctx.strokeStyle = "#3a2410"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 20, -1.1, 1.1); ctx.stroke(); ctx.restore(); continue; }
    ctx.fillStyle = `rgba(200,170,120,${Math.max(0, 0.5 - p.t / 6)})`; ctx.beginPath(); ctx.arc(p.x - camX, p.y, p.puff * (1 + p.t), 0, Math.PI * 2); ctx.fill();
  }
}
// the tower, drawn (a stand-in until Glen's art): rough planks, a leather-covered front, three floors, a wicker parapet
// on top, four wheels (two show). (x, y) = its front-bottom corner on the ground; s = scale; lean in degrees.
function drawTowerShape(x, y, s, lean, far) {
  if (ITEM.tw_body && !far) {   // Glen's tower, its two wheels (Glen's too) on its hubs; the front one sags once its pins are out
    const k = W6.TW_PIC * s, roof = y - (GR - W6.TW_ROOF) * T * s, px = W6.TW_BODY * s;
    ctx.save(); ctx.translate(x + px, y); ctx.rotate(lean * Math.PI / 180); ctx.translate(-x - px, -y);
    drawItem("tw_body", x + (561 - 225) * k, roof + (2115 - 600) * k, k * 2);
    for (const ix of [270, 860]) {
      const sag = ix === 270 && tw && (tw.phase >= 3 || tw.state === "fall") && s === 1 ? 0.22 : 0;
      ctx.save(); ctx.translate(x + (ix - 225) * k, y); ctx.rotate(sag); drawItem("tw_wheel", 0, 4 * s, 84 * s / 320); ctx.restore();
    }
    ctx.restore(); return;
  }
  const w = W6.TW_W * T * s, top = y - (GR - W6.TW_ROOF) * T * s;
  ctx.save(); ctx.translate(x + w, y); ctx.rotate(lean * Math.PI / 180); ctx.translate(-x - w, -y);
  if (far) { ctx.fillStyle = "#3a2a1c"; ctx.fillRect(x, top - 50 * s, w, y - top + 50 * s); ctx.restore(); return; }
  ctx.fillStyle = "#6e4e30"; ctx.fillRect(x, top, w, y - 30 * s - top);                       // the plank body
  ctx.strokeStyle = "rgba(40,24,10,0.5)"; ctx.lineWidth = 2;
  for (let px = x + 18 * s; px < x + w; px += 18 * s) { ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, y - 30 * s); ctx.stroke(); }
  ctx.fillStyle = "#4a2e1a"; for (const r of [9, 13]) ctx.fillRect(x, r * T * s + (y - GR * T * s) - 6 * s, w, 12 * s);   // the floors' beams
  ctx.fillStyle = "#5a3a22"; ctx.fillRect(x - 6 * s, top, 16 * s, y - 30 * s - top);         // the leather-covered front
  ctx.fillStyle = "#8a6a40"; ctx.fillRect(x - 4, top - 60 * s, w + 8, 14 * s);                // the parapet rail
  ctx.strokeStyle = "#a07e4e"; ctx.lineWidth = 3;
  for (let px = x; px <= x + w; px += 14 * s) { ctx.beginPath(); ctx.moveTo(px, top); ctx.lineTo(px, top - 50 * s); ctx.stroke(); }   // wicker
  ctx.fillStyle = "#3e2614"; ctx.fillRect(x + w * 0.5, top - 110 * s, 14 * s, 110 * s); ctx.fillRect(x + w * 0.5, top - 110 * s, w * 0.5 + 10, 14 * s);   // the top beam
  for (const fx of [44, W6.TW_W * T - 44]) {   // the wheels (Glen's; the front one sags once its pins are out)
    const wx = x + fx * s, wy = y - 36 * s, r = 36 * s;
    if (ITEM.tw_wheel) {
      const sag = !far && fx === 44 && tw && (tw.phase >= 3 || tw.state === "fall") ? 0.22 : 0;
      ctx.save(); ctx.translate(wx, y); ctx.rotate(sag); drawItem("tw_wheel", 0, 4 * s, 84 * s / 320); ctx.restore(); continue;
    }
    ctx.fillStyle = "#4a3018"; ctx.beginPath(); ctx.arc(wx, wy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#7a5a34"; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.arc(wx, wy, r - 5 * s, 0, Math.PI * 2); ctx.stroke();
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); ctx.stroke(); }
  }
  ctx.restore();
}
function drawWatchtower(camX) {
  if (!tw) return;
  const now = performance.now() / 1000, x = tw.x0 - camX, y = GR * T, jx = tw.jolt * Math.sin(now * 50) * 4;
  if (x > W + 600 || x + tw.w + 500 < 0) return;
  ctx.save(); ctx.translate(jx, 0);
  if (tw.state === "down" && ITEM.tw_wreck) {   // Glen's wreck where it fell (backward, away from David), its broken wheel by the base
    drawItem("tw_wreck", x + tw.w + 170, y + 8, 0.46); if (ITEM.tw_wheel_broken) drawItem("tw_wheel_broken", x + 40, y + 6, 0.22);
    ctx.restore(); drawTwDust(camX); return;
  }
  drawTowerShape(x, y, 1, tw.lean, false);
  ctx.save(); ctx.translate(x + tw.w, y); ctx.rotate(tw.lean * Math.PI / 180); ctx.translate(-x - tw.w, -y);
  // the windows: shut, creaking open (the tell), open with an archer leaning out, or dark (his bow knocked away)
  for (const w of tw.wins) {
    const wx = w.x - camX, wy = w.y, open = w.state === "open" ? 1 : w.state === "tell" ? Math.min(1, w.t / W6.TW_TELL) * 0.5 : 0;
    if (!ITEM.tw_body) { ctx.fillStyle = "#1c120a"; ctx.fillRect(wx - 22, wy - 26, 44, 52); }   // (Glen's tower has its own dark holes)
    if (w.state === "open" && SPR.phil_bow) {   // Glen's archer, waist-up in the window, leaning out: he draws, aims, looses at 70%
      const u = w.t / (W6.counsel2 ? W6.TW_OPEN2 : W6.TW_OPEN), hh = ITEM.tw_body ? 21 : 28;
      const f = u < 0.7 ? [0, 1, 5, 6, 7, 8, 9, 10][Math.min(7, Math.floor(u / 0.7 * 8))] : 11;   // (frames 2-4 have an arrow already in flight)
      w.flash = Math.max(0, (w.flash || 0) - 1 / 60);
      ctx.save(); ctx.beginPath(); ctx.rect(wx - 80, wy - hh, 80 + hh, hh * 2); ctx.clip();
      drawSprite("phil_bow", f, wx + 4, wy - hh + 100, -1, 0.75, 1, w.flash > 0 ? "brightness(2)" : "");
      ctx.restore();
    } else if (w.state === "open") {   // the archer: a feathered headdress, a bow
      ctx.fillStyle = (w.flash = Math.max(0, (w.flash || 0) - 1 / 60)) > 0 ? "#fff" : "#a0704a"; ctx.beginPath(); ctx.arc(wx - 4, wy - 4, 11, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d8c49a"; for (let f = -2; f <= 2; f++) ctx.fillRect(wx - 4 + f * 4 - 1, wy - 26, 3, 12);
      ctx.strokeStyle = "#3a2410"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wx - 22, wy + 4, 20, -1.1, 1.1); ctx.stroke();
    }
    if (w.state !== "done" && ITEM.tw_shutter) {   // Glen's shutter: shut, edge-on as it creaks open, then swung out
      const hh = ITEM.tw_body ? 21 : 28, sc = hh * 2 / 260;   // half the hole's height; the shutter fits the hole
      if (w.state === "shut") drawItem("tw_shutter", wx, wy + hh, sc);
      else if (w.state === "tell") drawItem(open < 0.25 ? "tw_shutter" : "tw_shutter_edge", wx + (open < 0.25 ? 0 : hh * 0.8), wy + hh, sc);
      else drawItem("tw_shutter_open", wx + hh * 1.2, wy + hh, sc);
      if (w.state === "tell" && Math.floor(now * 10) % 2) { ctx.fillStyle = "rgba(255,220,140,0.35)"; ctx.fillRect(wx - hh * 0.85, wy - hh, hh * 1.7, hh * 2); }
    } else if (w.state !== "done") {   // the shutter, swinging out on its hinge
      ctx.save(); ctx.translate(wx + 22, wy - 26); ctx.scale(1 - open * 1.6, 1);
      ctx.fillStyle = "#7a5634"; ctx.fillRect(-44, 0, 44, 52); ctx.strokeStyle = "#3e2614"; ctx.lineWidth = 2; ctx.strokeRect(-44, 0, 44, 52); ctx.restore();
      if (w.state === "tell" && Math.floor(now * 10) % 2) { ctx.fillStyle = "rgba(255,220,140,0.35)"; ctx.fillRect(wx - 24, wy - 28, 48, 56); }
    }
  }
  // the rope ladder's upper half, cut: two frayed ends hanging from the roof (the ladder itself is main.js ladder())
  if ((tw.state === "fight" || tw.state === "wait") && ITEM.tw_ladder_cut) drawItem("tw_ladder_cut", x - T, W6.TW_ROOF * T + 78, 78 / 260);
  else if (tw.state === "fight" || tw.state === "wait") {
    ctx.strokeStyle = "#b08850"; ctx.lineWidth = 3;
    for (const rx of [x - 2 * T + 6, x - 6]) { ctx.beginPath(); ctx.moveTo(rx, W6.TW_ROOF * T); ctx.quadraticCurveTo(rx + 4, W6.TW_ROOF * T + 40, rx - 2 + Math.sin(now * 2) * 3, W6.TW_ROOF * T + 76); ctx.stroke(); }
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 2 * T + 6, W6.TW_ROOF * T + 30); ctx.lineTo(x - 6, W6.TW_ROOF * T + 30); ctx.stroke();
  }
  // the front wheel's pins (phase 2): they glint if Abinadab told you
  if (tw.phase === 2 && tw.state === "fight") {
    const wh = twWheel(), n = twPinHP() - tw.pins;
    for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * 0.9; ctx.fillStyle = "#c9a066"; ctx.fillRect(wh.x - camX + Math.cos(a) * 12 - 4, wh.y + Math.sin(a) * 12 - 4, 8, 8); }
    if (twCounsel() && Math.floor(now * 3) % 2) { ctx.fillStyle = "rgba(255,230,140,0.45)"; ctx.beginPath(); ctx.arc(wh.x - camX, wh.y, 20, 0, Math.PI * 2); ctx.fill(); }
  }
  // the slingers on the roof (phase 3): they rise over the parapet to throw
  if (tw.phase === 3 && tw.state === "fight") {
    if (SPR.phil_sling) {   // Glen's slinger, waist-up over the parapet: he whirls it up, then lets fly (frame 10) as the stone leaves
      const u = 1 - Math.max(0, tw.slingT) / W6.TW_SLING_EVERY;
      ctx.save(); ctx.beginPath(); ctx.rect(x, W6.TW_ROOF * T - 400, tw.w + 200, 400 + W6.TW_ROOF_CLIP); ctx.clip();
      [0.68, 0.88].forEach((fx, k) => {
        const f = tw.slingUp > 0 ? (tw.slingUp > 0.25 ? 10 : 11) : Math.max(0, Math.min(9, Math.floor(u * 10)) - k);
        drawSprite("phil_sling", f, x + tw.w * fx, W6.TW_ROOF * T + W6.TW_SLING_Y, -1, 0.95);
      });
      ctx.restore();
    } else {
    const nm = SPR.soldier_run ? "soldier_run" : "villager_man_run", up = tw.slingUp > 0 ? 40 : 0;
    for (const fx of [0.68, 0.88]) drawSprite(nm, up ? 3 : 0, x + tw.w * fx, W6.TW_ROOF * T + 50 - up, -1, 0.95, 1, W6.PHIL);
    }
  }
  ctx.restore();
  ctx.restore();
  // shots
  for (const a of tw.arrows) { ctx.save(); ctx.translate(a.x - camX, a.y); ctx.rotate(Math.atan2(a.vy, a.vx)); drawItem("arrow", 0, 10, 0.5); ctx.restore(); }
  ctx.fillStyle = "#6e6458"; for (const s of [...tw.slung, ...tw.cover]) { ctx.beginPath(); ctx.arc(s.x - camX, s.y, 6, 0, Math.PI * 2); ctx.fill(); }
  // the crew climbing down the back and running (as it falls), the knocked-away bows, the dust
  if (tw.state === "fall" || (tw.state === "down" && tw.t < 5)) {
    const t = tw.state === "fall" ? tw.t : tw.t + 1.5, nm = SPR.phil_flee ? "phil_flee" : SPR.soldier_run ? "soldier_run" : "villager_man_run";
    for (let k = 0; k < 6; k++) drawSprite(nm, frameOf(nm, now + k * 0.2), x + tw.w + 30 + k * 40 + t * 260, GR * T, 1, 0.95, Math.max(0, 1 - t / 4), nm === "phil_flee" ? "" : W6.PHIL);
  }
  drawTwDust(camX);
}
function stoneHitsWorld6(s) { return WORLD === 6 && (stoneHitsTower(s) || stoneHitsSkirm(s)); }   // main.js stone loop
if (LEVEL_STAGE === "6-4") Object.assign(W6, { VOLLEY_EVERY: 3.2 });   // tighter volleys under the tower

// --- hooks: main.js (each frame, drawing)
function updateWorld6(dt) {
  if (WORLD !== 6) return;
  updateBattleSound(dt); updateFearful(dt); updateTents(dt); updateEliabSpot(); updateVolleys(dt); updateGiantSpot(dt); updateCarriers(dt); updateSkirms(dt); updateTower(dt);
}
function drawCover(camX) {   // Glen's leaning rock (6-2) and undercut bank (6-3, 6-4), drawn over the slab you shelter under
  for (const p of setPieces) {
    if (p.kind !== "shelter" && p.kind !== "bank") continue;
    const x0 = p.c * T - camX, w = p.w * T; if (x0 > W + 200 || x0 + w < -200) continue;
    if (p.kind === "shelter" && ITEM.shelter_rock) drawItem("shelter_rock", x0 + w / 2, GR * T + 8, Math.max(0.38, w * 1.15 / 557));
    if (p.kind === "bank" && ITEM.undercut_bank) {
      const n = Math.max(1, Math.round(p.w / 6)), cw = w / n, s = cw * 1.12 / 475;
      for (let k = 0; k < n; k++) drawItem("undercut_bank", x0 + cw * (k + 0.5), 13 * T - 14 + 420 * s, s);   // the grass on top level with the slab's top
    }
  }
}
function drawWorld6(camX) {
  if (WORLD !== 6) return;
  drawCover(camX);
  drawTents(camX);
  for (const p of setPieces) if (p.kind === "tower") drawTower(p, camX);
  drawWatchtower(camX); drawFills(camX); drawStanding(camX); drawFearful(camX); drawCarriers(camX); drawSkirms(camX); drawVolleys(camX); drawTowerShadow(camX);
}

// ---------------------------------------------------------------------------
// The opening of World 6 (DESIGN "World 6 — Opening scene"), before 6-1 the first time (or ?w6intro): straight on from
// the end of World 5. The army has run back up the hill. Soldiers around a cooking fire, muttering. The title card.
// ---------------------------------------------------------------------------
const w6intro = {
  active: false,
  lines: [
    ["", "The army ran back up the hill. David stood alone on the slope a while. Then he walked up into the camp."],
    ["", "The Philistine came near morning and evening, and presented himself forty days. (1 Samuel 17:16)"],
    ["A soldier", "Forty days."],
    ["Another soldier", "Have you seen this man who has come up? He has surely come up to defy Israel. The king will give great riches to the man who kills him, and will give him his daughter, and will make his father's house tax-free in Israel. (1 Samuel 17:25)"],
    ["A soldier", "Riches. Ha. Nobody's going to do it."],
    null,   // the title card
  ],
  start() { Object.assign(this, { active: true, t: 0, step: 0, stepT: 0 }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.stepT += dt;
    const A = this.stepT > 0.8 && (pressed("a") || pressed("b") || pressed("start"));
    if (this.step === this.lines.length - 1) { if (this.stepT > 3.2 || A) this.finish(); return; }
    if (A) this.step++, this.stepT = 0;
  },
  finish() {
    this.active = false;
    try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.w6intro = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
  },
  draw() {
    const y = GR * T, now = performance.now() / 1000, keep = bgWorld;
    bgWorld = "w6_1"; drawBackground(0); bgWorld = keep; drawFlatGround(0);   // the camp
    ctx.fillStyle = "rgba(255,200,120,0.08)"; ctx.fillRect(0, 0, W, H);
    drawItem("campfire", W * 0.55, y + 4, 0.3);   // the cooking fire
    const POSE = [[0, 0, 0], [0, 0, 0], [2, 0, 0], [0, 1, 0], [2, 0, 3], [2, 2, 2]][this.step] || [0, 0, 0];   // who's talking, who looks up at David
    for (const [k, fx, dir] of [[0, 0.45, 1], [1, 0.66, -1], [2, 0.74, -1]]) {
      if (SPR.soldier_sit) { drawSprite("soldier_sit", POSE[k], W * fx, y, dir, 1.3, 1, W6.LOOKS[k] + " brightness(0.9)"); continue; }
      const nm = k === 1 ? "abinadab_war_idle" : "eliab_war_idle";
      drawSprite(nm, frameOf(nm, now + k * 0.7), W * fx, y, dir, 1.02, 1, W6.LOOKS[k] + " brightness(0.85)");
    }
    if (this.step >= 1) drawSprite("david_idle", frameOf("david_idle", now), W * 0.2, y, 1);
    const a = Math.min(1, this.t / 1); ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.fillStyle = "rgba(60,36,14,0.85)"; ctx.font = "italic 22px Georgia, serif"; ctx.fillText("The Valley of Elah, the camp of Israel", W / 2, 50);
    const L = this.lines[this.step];
    if (L) drawStoryBox(L[0], L[1], "A: next", true);
    if (this.step === this.lines.length - 1) {
      const f = Math.min(1, this.stepT / 0.8); ctx.fillStyle = `rgba(10,6,2,${0.75 * f})`; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = f; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 54px Georgia, serif"; ctx.fillText("WORLD 6", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff6e2"; ctx.font = "italic 34px Georgia, serif"; ctx.fillText("The Valley of Elah", W / 2, H / 2 + 30); ctx.globalAlpha = 1;
    }
    ctx.textAlign = "left";
  },
};
if (LEVEL_STAGE === "6-1" && !STORY_HASH) {
  let seen = false; try { seen = !!JSON.parse(localStorage.getItem("davidProgress") || "{}").w6intro; } catch (e) {}
  if (!seen || new URLSearchParams(location.search).has("w6intro")) w6intro.start();
}

// ---------------------------------------------------------------------------
// The End of World 6 (DESIGN "End of World 6 — before Saul"), after 6-4: word of what David has been saying reaches
// Saul (17:31). Saul's tent (Glen's tent and Saul in his war gear): 17:32-37, with David's lion and bear coming back
// as memories while he tells them (the World 1 and World 2 fights, sepia, in a frame), and Saul's "Go! The LORD will be
// with you." Outside, Shammah gives him a new shepherd's bag with a pouch for his stones (progress.bag; sets up 17:40).
// "?w6end" plays it straight away (testing); "?w6end=8" starts at that beat.
// ---------------------------------------------------------------------------
const TENT_BG = Object.assign(new Image(), { src: "../assets/backgrounds/saul_tent.jpg?v=" + (window.BUILD || 0) });
const w6ending = {
  active: false,
  beats: [
    { at: "camp", who: "", text: "The water carriers came up the hill with full jars, and the soldiers who had been hiding were on their feet again, cheering." },
    { at: "camp", who: "", text: "When the words were heard which David spoke, they rehearsed them before Saul; and he sent for him. (1 Samuel 17:31)" },
    { at: "tent", who: "David", text: "Let no man's heart fail because of him. Your servant will go and fight with this Philistine. (1 Samuel 17:32)", saul: 0, cmd: [0, 1] },
    { at: "tent", who: "King Saul", text: "You are not able to go against this Philistine to fight with him; for you are but a youth, and he a man of war from his youth. (1 Samuel 17:33)", saul: 1, cmd: [0, 1] },
    { at: "tent", who: "David", text: "Your servant was keeping his father's sheep; and when a lion or a bear came and took a lamb out of the flock, (1 Samuel 17:34)", saul: 2, cmd: [0, 1], flash: "lion" },
    { at: "tent", who: "David", text: "I went out after him, struck him, and rescued it out of his mouth. When he arose against me, I caught him by his beard, struck him, and killed him. (1 Samuel 17:35)", saul: 2, cmd: [0, 3], flash: "lion2" },
    { at: "tent", who: "David", text: "Your servant struck both the lion and the bear. This uncircumcised Philistine shall be as one of them, since he has defied the armies of the living God. (1 Samuel 17:36)", saul: 3, cmd: [2, 3], flash: "bear" },
    { at: "tent", who: "David", text: "The LORD, who delivered me out of the paw of the lion and out of the paw of the bear, will deliver me out of the hand of this Philistine. (1 Samuel 17:37)", saul: 3, cmd: [2, 3] },
    { at: "tent", who: "", text: "The king looked at the shepherd boy for a long time.", saul: 4, cmd: [2, 3] },
    { at: "tent", who: "King Saul", text: "Go! The LORD will be with you. (1 Samuel 17:37)", saul: 5, cmd: [2, 3], close: true },
    { at: "camp", who: "Shammah", text: "David! Wait. ...Here. I made you a new bag, with a pouch sewn on the front. For your stones.", sham: 0, night: true },
    { at: "camp", card: true, sham: 2, night: true },
    { at: "camp", who: "Shammah", text: "Father would be proud of you. ...Don't tell Eliab I said that.", sham: 1, night: true },
    { at: "camp", who: "", text: "That night David played his harp by the fire, and the men who had been afraid sat and listened.", harp: true, night: true },
    { at: "camp", who: "", text: "To be continued in World 7: The Giant's Shadow.", harp: true, night: true },
  ],
  start(done) { Object.assign(this, { active: true, t: 0, i: 0, bt: 0, done, fade: 0, out: 0, gave: false }); hushLoops(); dialog.t = 0; },
  update(dt) {
    this.t += dt; this.bt += dt; this.fade = Math.min(1, this.t / 1.2);
    const B = this.beats[this.i];
    if (B.card && !this.gave) {
      this.gave = true; sfx("extra_life", undefined, 0.7);
      try { const p = JSON.parse(localStorage.getItem("davidProgress") || "{}"); p.bag = true; localStorage.setItem("davidProgress", JSON.stringify(p)); } catch (e) {}
    }
    if (this.out > 0) { this.out += dt; if (this.out > 1.2) { this.active = false; const cb = this.done; this.done = null; cb && cb(); } return; }
    if (this.bt > 0.6 && (pressed("a") || pressed("b") || pressed("start"))) {
      if (this.i < this.beats.length - 1) {
        const was = this.beats[this.i].at; this.i++; this.bt = 0;
        if (this.beats[this.i].at !== was) { this.t = 0; this.fade = 0; }
      } else this.out = 0.001;
    }
  },
  draw() {
    const B = this.beats[this.i], y = GR * T, now = performance.now() / 1000;
    if (B.at === "tent") {
      if (TENT_BG.naturalWidth) { const s = Math.max(W / TENT_BG.naturalWidth, H / TENT_BG.naturalHeight); ctx.drawImage(TENT_BG, (W - TENT_BG.naturalWidth * s) / 2, (H - TENT_BG.naturalHeight * s) / 2, TENT_BG.naturalWidth * s, TENT_BG.naturalHeight * s); }
      else { ctx.fillStyle = "#2a1c10"; ctx.fillRect(0, 0, W, H); }
      const fy = H - 6, dx = B.close ? W * 0.42 : W * 0.22, z = 1.9;   // close to the camera: bigger than in a stage
      if (B.cmd) for (const [k, fx] of [[0, 0.79], [1, 0.92]]) drawSprite("commander_tent", B.cmd[k], W * fx, fy - 10, -1, z * 0.92);
      drawSprite(SPR.saul_armor ? "saul_armor" : "saul", SPR.saul_armor ? B.saul : 0, W * 0.6, fy, -1, z);
      drawSprite("david_idle", frameOf("david_idle", now), dx, fy, 1, z);
      if (B.flash) drawMemory(B.flash, this.bt, now);
    } else {
      const keep = bgWorld; bgWorld = "w6_1"; drawBackground(0); bgWorld = keep; drawFlatGround(0);   // the camp
      if (B.night) { ctx.fillStyle = "rgba(10,14,40,0.55)"; ctx.fillRect(0, 0, W, H); drawItem("campfire", W * 0.46, y + 4, 0.3); ctx.fillStyle = "rgba(255,170,80,0.12)"; ctx.fillRect(0, 0, W, H); }
      if (B.harp) drawSprite("david_play_harp", frameOf("david_play_harp", now), W * 0.36, y, 1);
      else drawSprite("david_idle", frameOf("david_idle", now), W * 0.34, y, 1);
      if (B.sham !== undefined) drawSprite(SPR.shammah_bag ? "shammah_bag" : "shammah_idle", SPR.shammah_bag ? B.sham : 0, W * 0.52, y, -1);
      if (B.harp) for (const [k, fx] of [[0, 0.58], [1, 0.68], [2, 0.8]]) drawSprite(k === 1 ? "abinadab_war_idle" : "eliab_war_idle", frameOf("eliab_war_idle", now + k), W * fx, y, -1, 1.02, 1, W6.LOOKS[k] + " brightness(0.75)");
      if (!B.night) for (let k = 0; k < 3; k++) drawSprite(SPR.soldier_run ? "soldier_run" : "villager_man_run", 0, W * (0.6 + k * 0.1), y, -1, 1, 1, W6.LOOKS[k]);
    }
    if (B.card) {   // the gift
      const cy = 80, a = Math.min(1, this.bt * 2);
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(25,14,6,0.9)"; ctx.beginPath(); ctx.roundRect(W / 2 - 440, cy, 880, 180, 16); ctx.fill();
      ctx.strokeStyle = "rgba(255,214,120,0.6)"; ctx.lineWidth = 2; ctx.stroke();
      drawItem("shepherd_bag", W / 2 - 350, cy + 162, 0.33, a);
      ctx.textAlign = "center"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 26px sans-serif"; ctx.fillText("Shammah's Shepherd's Bag", W / 2 + 60, cy + 46);
      ctx.fillStyle = "#e9dcc4"; ctx.font = "18px sans-serif"; ctx.fillText("A new leather bag, with a pouch sewn on the front.", W / 2 + 60, cy + 80);
      ctx.fillText("It will hold the special stones you find from now on.", W / 2 + 60, cy + 104);
      ctx.font = "italic 17px Georgia, serif"; ctx.fillText("\"You'll want somewhere to keep your stones.\"", W / 2 + 60, cy + 146);
      ctx.restore(); ctx.textAlign = "left"; caption("A: next", 0.8, true);
    } else drawStoryBox(B.who, B.text, this.i === this.beats.length - 1 ? "A: continue" : "A: next", true);
    const a = Math.min(this.fade, 1 - Math.min(1, this.out / 1.2));
    ctx.fillStyle = `rgba(0,0,0,${1 - a})`; ctx.fillRect(0, 0, W, H);
  },
};
// a memory, while David tells it (17:34-36): his lion (World 1) and his bear (World 2), sepia, in a soft frame
function drawMemory(kind, bt, now) {
  const w = 640, h = 250, x = W / 2 - w / 2, y = 168, a = Math.min(1, bt * 1.5);
  ctx.save(); ctx.globalAlpha = a;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.clip();
  const sky = ctx.createLinearGradient(0, y, 0, y + h); sky.addColorStop(0, "#e8d2a8"); sky.addColorStop(1, "#c9a878");
  ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#b39062"; ctx.beginPath(); ctx.ellipse(x + w * 0.3, y + h - 20, w * 0.5, 60, 0, Math.PI, 0); ctx.fill();   // the hills he kept the sheep on
  ctx.filter = "sepia(0.85) brightness(1.05) contrast(0.95)";
  const gy = y + h - 18;
  ctx.fillStyle = "#9c7a4e"; ctx.fillRect(x, gy, w, 18);
  const beast = kind === "bear" ? "bear_rear_roar" : kind === "lion" ? "lion_carry_lamb" : "lion_leap";
  drawSprite(beast, frameOf(beast, now), x + w * 0.68, gy, -1, kind === "bear" ? 0.95 : 0.9);
  drawSprite("david_sling_throw", frameOf("david_sling_throw", now), x + w * 0.22, gy, 1, 1);
  ctx.filter = "none"; ctx.restore();
  ctx.save(); ctx.globalAlpha = a * 0.8; ctx.strokeStyle = "rgba(255,230,180,0.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 18); ctx.stroke(); ctx.restore();
}
if (new URLSearchParams(location.search).has("w6end")) setTimeout(() => {
  w6ending.start(() => location.reload());
  const at = Number(new URLSearchParams(location.search).get("w6end")) || 0; if (at) Object.assign(w6ending, { i: at, fade: 1, t: 2 });
}, 300);
