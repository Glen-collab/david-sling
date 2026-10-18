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
        const n = fearful.filter(q => q.state !== "hide").length;
        sayLine("A soldier", LIFT_LINES[(n - 1) % LIFT_LINES.length]);
        if (n === fearful.length) setTimeout(() => toast(`All ${n} frightened soldiers are back at their posts.`), 4500);
      }
    } else if (s.state === "rise") { if (s.t > 2.4) { s.state = "go"; s.t = 0; } }
    else if (s.state === "go") { s.x += s.dir * W6.SOLDIER_RUN * dt; s.alpha = Math.max(0, 1 - s.t / 3); if (s.alpha <= 0) s.state = "posted"; }
  }
}
function drawFearful(camX) {
  const now = performance.now() / 1000;
  for (const s of fearful) {
    if (s.state === "posted") continue;
    const x = s.x - camX; if (x < -150 || x > W + 150) continue;
    const f = W6.LOOKS[s.look % W6.LOOKS.length];
    if (s.state === "go") { drawSprite(SPR.soldier_walk ? "soldier_walk" : "soldier_run", frameOf(SPR.soldier_walk ? "soldier_walk" : "soldier_run", now), x, s.y, s.dir, 1, s.alpha, f); continue; }
    if (SPR.soldier_fear) {   // Glen's frightened soldier: 0 curled up, 1 peeking, 2 listening, 3 standing up, 4 spear up, 5 a nod
      const fr = s.state === "rise" ? Math.min(5, 3 + Math.floor(s.t / 0.8)) : s.song > 0.2 ? 2 : Math.abs(david.x - s.x) < 5 * T ? 1 : 0;
      drawSprite("soldier_fear", fr, x + (fr === 0 ? Math.sin(now * 40) * 1.2 : 0), s.y, s.dir, 1, 1, f); continue;
    }
    // stand-in: Tobi's hiding poses (0 curled up, 1 peeking, 3 getting up, 4 standing scared, 5 standing)
    const fr = s.state === "rise" ? [3, 4, 5][Math.min(2, Math.floor(s.t / 0.8))] : s.song > 0.2 ? 2 : Math.abs(david.x - s.x) < 5 * T ? 1 : 0;
    drawSprite("tobi_cave", fr, x + (fr === 0 ? Math.sin(now * 40) * 1.2 : 0), s.y, s.dir, W6.SOLDIER_SIZE, 1, f);
    if (s.state === "hide" && s.song > 0) { ctx.fillStyle = "rgba(255,230,140,0.9)"; ctx.fillRect(x - 24, s.y - 130, 48 * Math.min(1, s.song / W6.LIFT_T), 4); }
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
      drawSprite(nm, frameOf(nm, now), this.eliX, y, walking ? 1 : -1, 1, 1, B.eli === "angry" ? "saturate(1.3) sepia(0.25) hue-rotate(-12deg)" : "");   // red in the face
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
const volley = { t: 0, n: 0, zone: null, shots: [], stuck: [], shout: 0, told: false };
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
      sfx("phil_shout", undefined, 0.6);
      if (!volley.told) { volley.told = true; sayLine("", z.kind === "stones" ? "A shout from the far slope: slingers! Watch the shadows on the ground. Get in under an overhanging rock, or into a gap." : "A shout from the far slope: archers! Watch the shadows on the ground. Get in under an overhanging rock, or into a gap."); }
    }
    if (volley.plan && volley.t >= W6.VOLLEY_WARN) { for (const s of volley.plan) volley.shots.push(s); volley.plan = null; sfx("arrow_volley", undefined, 0.7); sfx("sling_throw_quick", undefined, 0.4, 0.7); }
  }
  for (let i = volley.shots.length - 1; i >= 0; i--) {
    const s = volley.shots[i]; s.t += dt; if (s.t < 0) continue;
    s.x += s.vx * dt; s.y += s.vy * dt;
    if (d.deadT <= 0 && Math.abs(s.x - d.x) < 16 && s.y > d.y - d.h + 6 && s.y < d.y) { hurtDavid(s.x + 200); volley.shots.splice(i, 1); continue; }
    if (s.y >= s.ly) {
      if (s.kind === "arrows") volley.stuck.push({ x: s.lx, y: s.ly, a: Math.atan2(s.vy, s.vx), t: 0 });
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
    if (B.boom && this.boomed !== this.i) { this.boomed = this.i; this.shake = 0.9; sfx("lion_roar", undefined, 0.55, 0.45); }
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
      if (ITEM.phil_sil_shield1) drawItem("phil_sil_shield1", gx - 60, hy + 4, 0.2, a);   // the shield bearer, out in front
      drawSprite(nm, nm === "lookout_spot" ? 3 : frameOf(nm, now), gx, hy + 4, -1, nm === "lookout_spot" ? 1.3 : 0.62, 1, "brightness(0) blur(0.4px)");
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
function updateGiantSpot(dt) {
  if (giantSpot && !goliathWatch.done && !goliathWatch.active && david.x > giantSpot.x - T && david.onGround && david.deadT <= 0) goliathWatch.start();
  if (!goliathWatch.done) return;
  W6.boomT = (W6.boomT || 0) + dt;   // from now on, his voice booms across the valley every so often
  if (W6.boomT > W6.GIANT_BOOM) {
    W6.boomT = 0; W6.boomN = (W6.boomN || 0) + 1; sfx("lion_roar", undefined, 0.35, 0.45);
    toast(["The giant's voice booms across the valley: \"Give me a man, that we may fight together!\"", "\"I defy the armies of Israel today!\" The ground seems to shake.", "\"Am I not a Philistine, and you servants to Saul?\""][W6.boomN % 3]);
  }
}
function drawFarGiant(camX) {   // small on the far hill, after David has seen him
  if (!goliathWatch.done || !giantSpot) return;
  const now = performance.now() / 1000, gx = W * 0.86 - (camX - giantSpot.x + W * 0.3) * 0.06, gy = GR * T - 222;
  if (gx < -100 || gx > W + 100) return;
  const nm = SPR.goliath_silhouette ? "goliath_silhouette" : "lookout_spot";
  ctx.save(); ctx.globalAlpha = 0.55; drawSprite(nm, nm === "lookout_spot" ? 3 : frameOf(nm, now), gx, gy, -1, nm === "lookout_spot" ? 0.6 : 0.28, 1, "brightness(0) blur(0.8px)"); ctx.restore();
}
const drawBackground6 = drawBackground;
drawBackground = function (cx) { drawBackground6(cx); if (WORLD === 6) drawFarGiant(cx); };   // the giant, small on the far hill

// --- hooks: main.js (each frame, drawing)
function updateWorld6(dt) {
  if (WORLD !== 6) return;
  updateFearful(dt); updateTents(dt); updateEliabSpot(); updateVolleys(dt); updateGiantSpot(dt);
}
function drawWorld6(camX) {
  if (WORLD !== 6) return;
  drawTents(camX);
  for (const p of setPieces) if (p.kind === "tower") drawTower(p, camX);
  drawStanding(camX); drawFearful(camX); drawVolleys(camX);
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
    bgWorld = "w5_4"; drawBackground(0); bgWorld = keep; drawFlatGround(0);
    ctx.fillStyle = "rgba(255,200,120,0.08)"; ctx.fillRect(0, 0, W, H);
    drawItem("campfire", W * 0.55, y + 4, 0.3);   // the cooking fire
    for (const [k, fx, dir] of [[0, 0.45, 1], [1, 0.66, -1], [2, 0.74, -1]]) {
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
