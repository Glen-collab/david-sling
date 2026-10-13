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

// ---------------------------------------------------------------------------
// The donkey (2-2): the boy from Tekoa's donkey, bolting back and forth in a narrow way, too frightened to let anyone
// by. Stones don't help. Sit and play the harp for it (the harp duel below) and it calms, grazes, then follows David.
// ---------------------------------------------------------------------------
Object.assign(W2, {
  DONKEY_SIZE: 1.1,      // next to David
  DONKEY_BOLT: 330,      // how fast it bolts when frightened (slows as it calms)
  DONKEY_HEAR: 10,       // how close (tiles) David sits for the donkey to hear the harp
  DONKEY_FOLLOW: 4,      // once calm, it walks after David when he's more than this many tiles away
  DONKEY_WALK: 170,
});
Object.assign(TUNE.SPRITE_SIZE, { donkey_idle: W2.DONKEY_SIZE, donkey_walk: W2.DONKEY_SIZE, donkey_graze: W2.DONKEY_SIZE, donkey_bolt: W2.DONKEY_SIZE });
CRITTER_ART.donkey = { idle: "donkey_idle", move: "donkey_walk", len: 120, h: 95 };
function updateDonkey(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle") { setCrit(k, k.calmed ? "graze" : "panic"); return; }
  if (k.state === "panic") {
    const duel = harpDuel.active && harpDuel.target === k ? harpDuel : null;
    const spook = duel && duel.state === "missed" ? 1.35 : 1;   // a sour note sets it off again
    const moved = runCritter(k, W2.DONKEY_BOLT * spook * (1 - 0.55 * (duel ? duel.calm : 0)), dt);
    if (!moved || (k.range && Math.abs(k.x - k.home) > k.range && Math.sign(k.x - k.home) === k.facing)) k.facing = -k.facing;
    const b = critterBox(k);
    if (touchesDavid(b) && david.deadT <= 0) {   // trampled: it hurts, he's knocked back the way he came, and it wheels round
      const side = david.x < k.home + k.range + 3 * T ? -1 : 1;   // back the way he came (from the left), never through
      if (david.inv <= 0) hurtDavid(k.x);
      david.x = side < 0 ? b.x0 - BODY_W / 2 - 2 : b.x1 + BODY_W / 2 + 2;   // never carried along, never let through
      k.facing = -side;
      if (!k.told) { k.told = true; toast("The donkey is wild with fear! Keep back, sit, and play the harp for him (Select)."); }
    }
    return;
  }
  if (k.state === "calm") { fall(); if (k.t > 2.4) setCrit(k, "graze"); return; }
  if (k.state === "graze" || k.state === "follow") {   // stays near David, grazing whenever he stops
    if (flood.on && !k.waits) {   // the water's coming: he bolts up the riverbed ahead of it (he's waiting on the bank)
      setCrit(k, "follow"); k.gone = true; k.facing = 1; k.vx = 480; return;
    }
    if (k.waits && david.x < k.x - 6 * T) { setCrit(k, "graze"); fall(); return; }   // on the bank: grazing till David's out
    if (Math.abs(dx) > W2.DONKEY_FOLLOW * T && sameLevel) { k.facing = Math.sign(dx); setCrit(k, "follow"); runCritter(k, W2.DONKEY_WALK + Math.min(220, Math.abs(dx) - W2.DONKEY_FOLLOW * T), dt); }
    else if (Math.abs(dx) < (W2.DONKEY_FOLLOW - 1) * T || !sameLevel) { setCrit(k, "graze"); fall(); }
    else runCritter(k, W2.DONKEY_WALK, dt);
  }
}
function stoneHitsDonkey(k, s) {
  stoneHit(s, 0.5);
  if (!k.stoneTold) { k.stoneTold = true; toast(k.calmed ? "Easy! He's calm now." : "Not the donkey! He's only frightened. Try the harp (Select)."); }
  return true;
}
function drawDonkey(k, x) {
  let name = "donkey_idle", i;
  if (k.state === "panic") { name = "donkey_bolt"; i = frameOf(name, k.t * 1.2); }
  else if (k.state === "follow") { name = "donkey_walk"; i = frameOf(name, k.t); }
  else if (k.state === "graze") { name = "donkey_graze"; i = frameOf(name, k.t); }
  else i = frameOf(name, k.t);
  drawSprite(name, i, x, k.y, k.facing, 1, k.alpha);
}

// ---------------------------------------------------------------------------
// The harp duel. David sits and plays (Select) near a frightened animal (later: King Saul). Glen's harp recording plays,
// and each pluck in it is a button (tools/make_harp_chart.py: low notes Down, high notes Up). The notes slide in from the
// right along six strings; press each one as it reaches the harp. A wrong or late note: the harp stops with a sour twang
// and that tune starts again. Finish every tune to calm it.
// ---------------------------------------------------------------------------
const HARP_DUEL = {
  donkey: { song: "donkey", window: 0.24, speed: 230, title: "Play for the frightened donkey" },   // window: how far off a note can be (s)
  // saul: { song: "saul", window: 0.13, speed: 340, ... }   (World 4: the calm/rage tug of war)
};
const HARP_STRINGS = ["up", "right", "a", "b", "left", "down"];   // top (high notes) to bottom (low)
const HARP_COLORS = { up: "#f2c84b", right: "#e06a4a", a: "#e48ac0", b: "#8fc8e8", left: "#7cc46a", down: "#5a86d8" };
const harpDuel = { active: false };
let duelAudio = null;
function harpTwang() {   // the sour note: two detuned strings, buzzing and falling flat
  try {
    chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = chimeCtx.currentTime, g = chimeCtx.createGain(), lp = chimeCtx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1400;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.22 * sfxMul()), t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    for (const f of [196, 207]) { const o = chimeCtx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(f, t0); o.frequency.exponentialRampToValueAtTime(f * 0.94, t0 + 0.5); o.connect(lp); o.start(t0); o.stop(t0 + 0.6); }
    lp.connect(g).connect(chimeCtx.destination);
  } catch (e) {}
}
function startHarpDuel(kind, target) {
  const opt = HARP_DUEL[kind], song = HARP_SONGS[opt.song];
  if (!duelAudio || duelAudio._song !== opt.song) {
    if (duelAudio) duelAudio.pause();
    duelAudio = new Audio(`../assets/audio/${song.file}?v=${window.BUILD || 0}`); duelAudio._music = true; duelAudio._song = opt.song;
  }
  duelAudio.volume = TUNE.HARP_VOLUME;
  Object.assign(harpDuel, { active: true, kind, opt, song, target, phrase: 0, next: 0, calm: 0, misses: 0, hits: [], state: "play", t: 0, songT: 0, missNote: null });
  duelPlayFrom(song.phrases[0].start);
}
function duelPlayFrom(t) {
  const g = harpDuel; g.state = "play"; g.songT = t; g.next = g.song.phrases[g.phrase].from;
  if (duelAudio.readyState < 1) {   // not loaded yet: wait for it, or it would start from the beginning
    g.loading = true;
    duelAudio.addEventListener("loadedmetadata", () => { g.loading = false; duelAudio.currentTime = g.songT; if (audioUnlocked) duelAudio.play().catch(() => {}); }, { once: true });
    duelAudio.load(); return;
  }
  duelAudio.currentTime = t; if (audioUnlocked) duelAudio.play().catch(() => {});
}
function endHarpDuel() { harpDuel.active = false; if (duelAudio) duelAudio.pause(); }
function harpDuelTarget(d) {
  return critters.find(k => k.kind === "donkey" && !k.gone && !k.calmed && Math.abs(k.x - d.x) < W2.DONKEY_HEAR * T && Math.abs(k.y - d.y) < 120);
}
function updateHarpDuel(d, dt) {   // called from updateDavid (main.js); true = the duel has the controls
  const g = harpDuel;
  if (!g.active) {
    if (d.harp && d.state === "harp" && d.deadT <= 0) { const k = harpDuelTarget(d); if (k) { startHarpDuel("donkey", k); return true; } }
    return false;
  }
  d.vx = 0;
  if (d.deadT > 0 || d.state !== "harp") { endHarpDuel(); return false; }   // knocked off his seat (trampled): the song stops
  for (const h of g.hits) h.t += dt;
  g.hits = g.hits.filter(h => h.t < 0.5);
  const stop = () => { endHarpDuel(); d.harp = false; setState("standup"); };
  if (g.state === "done") {   // the last tune: let the music ring out, then stand up
    g.t -= dt; duelAudio.volume = TUNE.HARP_VOLUME * Math.max(0, Math.min(1, g.t / 2));
    if (g.t <= 0 || pressed("select") || pressed("y")) stop();
    return true;
  }
  if (pressed("select") || pressed("y")) { stop(); toast("You put the harp away. Sit and play again when you're ready."); return true; }
  if (g.state === "missed") { g.t -= dt; if (g.t <= 0) duelPlayFrom(g.song.phrases[g.phrase].start); return true; }
  // playing: the recording is the clock (it's what you hear)
  if (g.loading) return true;
  if (duelAudio.paused && audioUnlocked) duelAudio.play().catch(() => {});   // back from the pause menu
  g.songT += dt;
  if (!duelAudio.paused && duelAudio.currentTime > 0 && Math.abs(duelAudio.currentTime - g.songT) > 0.08) g.songT = duelAudio.currentTime;
  const p = g.song.phrases[g.phrase], n = g.song.notes[g.next], w = g.opt.window;
  const miss = why => {
    g.state = "missed"; g.t = 1.3; g.misses++; g.missNote = { b: n.b, why }; duelAudio.pause(); harpTwang();
    if (g.target) g.target.t = 0;
  };
  const btn = ["up", "down", "left", "right", "a", "b"].find(b => pressed(b));
  if (btn && Math.abs(g.songT - n.t) <= w) {   // presses well before a note don't count (no penalty for being eager)
    if (btn !== n.b) { miss("wrong"); return true; }
    g.hits.push({ b: n.b, t: 0 }); g.next++;
    if (g.next >= p.to) {   // a whole tune
      g.phrase++; g.calm = g.phrase / g.song.phrases.length;
      if (g.phrase >= g.song.phrases.length) {
        g.state = "done"; g.t = 3.2;
        if (g.target) { g.target.calmed = true; g.target.vx = 0; setCrit(g.target, "calm"); }
        sfx("heal", undefined, 0.6); toast("The donkey is calm. He lowers his head and lets you by.");
      }
    }
  } else if (g.songT > n.t + w) miss("late");
  return true;
}
function drawHarpDuel() {
  const g = harpDuel; if (!g.active) return;
  const pw = 860, x0 = W / 2 - pw / 2, y0 = 56, lane = 21, top = y0 + 50, hitX = x0 + 110, right = x0 + pw - 24;
  const ph = 50 + lane * 6 + 46;
  ctx.save();
  ctx.fillStyle = "rgba(25,14,6,0.86)"; ctx.beginPath(); ctx.roundRect(x0, y0, pw, ph, 16); ctx.fill();
  ctx.textAlign = "left"; ctx.fillStyle = "#ffe08a"; ctx.font = "bold 20px sans-serif";
  ctx.fillText(`${g.opt.title}  ·  tune ${Math.min(g.phrase + 1, g.song.phrases.length)} of ${g.song.phrases.length}`, x0 + 22, y0 + 32);
  // the calm meter
  const mx = x0 + pw - 290, mw = 200;
  ctx.font = "13px sans-serif"; ctx.fillStyle = "#e9dcc4"; ctx.textAlign = "right"; ctx.fillText("Frightened", mx - 8, y0 + 31);
  ctx.textAlign = "left"; ctx.fillText("Calm", mx + mw + 8, y0 + 31);
  ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.beginPath(); ctx.roundRect(mx, y0 + 20, mw, 14, 7); ctx.fill();
  ctx.fillStyle = "#9fd27a"; ctx.beginPath(); ctx.roundRect(mx, y0 + 20, Math.max(14, mw * g.calm), 14, 7); ctx.fill();
  // the six strings (high notes on top) and the harp at the left, where notes are played
  for (let s = 0; s < 6; s++) {
    const y = top + s * lane + lane / 2;
    ctx.strokeStyle = "rgba(233,220,196,0.28)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hitX - 70, y); ctx.lineTo(right, y); ctx.stroke();
    ctx.fillStyle = HARP_COLORS[HARP_STRINGS[s]]; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(ARROWS[HARP_STRINGS[s]], hitX - 84, y + 5);
  }
  ctx.strokeStyle = g.state === "missed" ? "rgba(230,80,60,0.9)" : "rgba(255,216,74,0.9)";
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hitX, top - 6); ctx.lineTo(hitX, top + lane * 6 + 6); ctx.stroke();
  // the notes still to play, sliding in; a dashed line marks where each tune starts
  const songT = g.songT;
  ctx.save(); ctx.beginPath(); ctx.rect(hitX - 30, top - 14, right - hitX + 30, lane * 6 + 28); ctx.clip();
  for (let pi = g.phrase + 1; pi < g.song.phrases.length; pi++) {
    const x = hitX + (g.song.notes[g.song.phrases[pi].from].t - 0.6 - songT) * g.opt.speed;
    if (x > right) break;
    ctx.strokeStyle = "rgba(255,224,138,0.35)"; ctx.setLineDash([5, 6]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, top - 6); ctx.lineTo(x, top + lane * 6 + 6); ctx.stroke(); ctx.setLineDash([]);
  }
  for (let i = g.next; i < g.song.notes.length; i++) {
    const n = g.song.notes[i], x = hitX + (n.t - songT) * g.opt.speed;
    if (x > right + 20) break;
    const y = top + HARP_STRINGS.indexOf(n.b) * lane + lane / 2, missed = g.state === "missed" && i === g.next;
    ctx.fillStyle = missed ? "#c0392b" : HARP_COLORS[n.b]; ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(40,24,10,0.8)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#2a1808"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center"; ctx.fillText(ARROWS[n.b], x, y + 6);
  }
  ctx.restore();
  for (const h of g.hits) {   // a played note: a gold ring spreading from the harp
    const y = top + HARP_STRINGS.indexOf(h.b) * lane + lane / 2;
    ctx.globalAlpha = 1 - h.t / 0.5; ctx.strokeStyle = "#ffd84a"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hitX, y, 14 + h.t * 50, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.textAlign = "center"; ctx.font = "15px sans-serif"; ctx.fillStyle = "#e9dcc4";
  const msg = g.state === "missed" ? (g.missNote.why === "late" ? "Too late! The harp falls silent. Start the tune again." : "Wrong string! Start the tune again.")
            : g.state === "done" ? "He's calm." : "Press each note as it reaches the harp  ·  Select: stop";
  ctx.fillText(msg, W / 2, y0 + ph - 16);
  ctx.restore(); ctx.textAlign = "left";
}

// ---------------------------------------------------------------------------
// 2-2's second half: the flash flood, and the boy from Tekoa (DESIGN 2-2). Placed in the level with setPiece() (main.js):
//   setPiece("flood", c, r, { end })  past column c the riverbed floods: a wall of muddy water chases David from the
//                                     left until he's out of the riverbed at column `end`, where it spreads out and drains
//   setPiece("boy", c, r)             the boy, stranded on a rock: reach him and he follows in your footsteps
//   setPiece("stones", c)             on the bank after the flood: "Why do you carry those stones?"
// ---------------------------------------------------------------------------
Object.assign(W2, {
  FLOOD_SPEED: 250,      // px/s: a little slower than walking (270), so you stay ahead if you keep moving
  FLOOD_BEHIND: 13,      // tiles: it never falls further behind David than this (just inside the left of the screen)
  FLOOD_START: 18,       // tiles behind David where it appears
  FLOOD_HEIGHT: 9,       // tiles of water above the riverbed
  FLOOD_DRAIN: 4,        // seconds for it to spread out and drain once David is out of the riverbed
  BOY_GAP: 40,           // how far behind David the boy walks (px along his path; the lamb is at 70)
});
const piece = kind => setPieces.find(p => p.kind === kind);
const flood = { on: false, x: 0, level: 1, done: false, startT: 0, told: false };
let floodNoise = null;   // the roar: brown noise through a low filter (Web Audio)
function floodRoar(vol) {
  try {
    if (!floodNoise) {
      if (!audioUnlocked || vol <= 0) return;
      chimeCtx = chimeCtx || new (window.AudioContext || window.webkitAudioContext)();
      const n = chimeCtx.sampleRate * 3, buf = chimeCtx.createBuffer(1, n, chimeCtx.sampleRate), ch = buf.getChannelData(0);
      let last = 0; for (let i = 0; i < n; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; ch[i] = last * 3.5; }
      const src = chimeCtx.createBufferSource(); src.buffer = buf; src.loop = true;
      const lp = chimeCtx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
      const g = chimeCtx.createGain(); g.gain.value = 0;
      src.connect(lp).connect(g).connect(chimeCtx.destination); src.start();
      floodNoise = g;
    }
    floodNoise.gain.setTargetAtTime(Math.max(0, vol) * sfxMul(), chimeCtx.currentTime, 0.15);
  } catch (e) {}
}
function hushFlood() { if (floodNoise) try { floodNoise.gain.setValueAtTime(0, chimeCtx.currentTime); } catch (e) {} }
function floodTop(x) {   // the water's surface at x: full height behind the front, curling down to a foaming tip
  const base = GR * T - W2.FLOOD_HEIGHT * T * flood.level, back = flood.x - x;
  const nose = back < 170 ? (1 - back / 170) ** 2 * W2.FLOOD_HEIGHT * T * 0.75 * flood.level : 0;
  return base + nose + Math.sin(x * 0.02 + performance.now() / 260) * 9;
}
function updateFlood(dt) {
  const fp = piece("flood"); if (!fp) return;
  const d = david, endX = fp.end * T;
  if (!flood.on && !flood.done) {
    if (d.x > fp.x && d.deadT <= 0 && d.x < endX) {
      flood.startT += dt;
      if (!flood.told) { flood.told = true; toast("A rumble, far up the valley... The riverbed is flooding! Run!"); }
      floodRoar(0.25 * Math.min(1, flood.startT));
      if (flood.startT > 1.4) { flood.on = true; flood.level = 1; flood.x = d.x - W2.FLOOD_START * T; }
    }
    return;
  }
  if (flood.done) {   // out of the riverbed: the water spreads out and sinks away
    flood.level = Math.max(0, flood.level - dt / W2.FLOOD_DRAIN);
    floodRoar(0.4 * flood.level);
    if (flood.level <= 0) flood.on = false;
    return;
  }
  if (flood.lastX !== undefined && d.x < flood.lastX - 2 * T) flood.x = Math.min(flood.x, d.x - 10 * T);   // fell in a pit and was put back: a fair head start
  flood.lastX = d.x;
  flood.x = Math.min(endX - 3 * T, Math.max(flood.x + W2.FLOOD_SPEED * dt, d.x - W2.FLOOD_BEHIND * T));
  if (d.x > endX + 2 * T) { flood.done = true; toast("Out of the riverbed! The water spreads out and slows."); }
  const near = Math.max(0, 1 - (d.x - flood.x) / (W * 0.9));
  floodRoar(0.25 + 0.45 * near);
  for (let k = 0; k < 2; k++) bits.push({ x: flood.x - Math.random() * 40, y: floodTop(flood.x - 30) + Math.random() * 30, vx: 120 + Math.random() * 260, vy: -200 - Math.random() * 300, life: 0.5, color: k ? "#efe6d2" : "#b89a72" });
  // in the water: swept away (back to the campfire)
  if (d.deadT <= 0 && !inCutscene() && d.x - BODY_W / 2 < flood.x - 14 && d.y > floodTop(d.x) + 24) {
    d.hearts = 1; d.inv = 0; hurtDavid(d.x + 200);
    toast("The flood swept you away! Back to the campfire...");
  }
}
function drawFlood(camX) {
  if (!flood.on) return;
  const x1 = Math.min(W + 10, flood.x - camX); if (x1 < -10) return;
  ctx.save();
  const top = GR * T - W2.FLOOD_HEIGHT * T * flood.level;
  const g = ctx.createLinearGradient(0, top - 20, 0, H);
  g.addColorStop(0, "rgba(150,112,70,0.96)"); g.addColorStop(0.35, "rgba(110,80,48,0.97)"); g.addColorStop(1, "rgba(62,44,26,0.98)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-10, H);
  for (let sx = -10; sx <= x1; sx += 8) ctx.lineTo(sx, floodTop(sx + camX));
  ctx.lineTo(x1 + 18, GR * T + 6); ctx.lineTo(x1 + 18, H); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip();   // the current: pale streaks racing along inside the water
  const tnow = performance.now() / 1000;
  for (let k = 0; k < 16; k++) {
    const sy = top + 30 + k * ((H - top) / 16), len = 60 + (k * 37) % 90, sx0 = ((k * 173 + tnow * (260 + (k % 4) * 60)) % (x1 + 300)) - 150;
    ctx.strokeStyle = `rgba(225,205,170,${0.18 + (k % 3) * 0.07})`; ctx.lineWidth = 3; ctx.beginPath();
    for (let u = 0; u <= len; u += 10) ctx.lineTo(sx0 + u, sy + Math.sin((sx0 + u) * 0.03 + k) * 5);
    ctx.stroke();
  }
  ctx.restore();
  // foam along the top and the curling front
  const now = performance.now() / 1000;
  ctx.strokeStyle = "rgba(240,232,214,0.75)"; ctx.lineWidth = 5; ctx.lineCap = "round"; ctx.beginPath();
  for (let sx = -10; sx <= x1; sx += 8) { const y = floodTop(sx + camX) + 3; sx === -10 ? ctx.moveTo(sx, y) : ctx.lineTo(sx, y); }
  ctx.stroke();
  for (let k = 0; k < 14; k++) {   // churning foam at the tip
    const a = k * 2.4 + now * 3, fx = x1 - 20 - (k % 5) * 18 + Math.sin(a) * 8, fy = floodTop(flood.x - 20 - (k % 5) * 18) + 10 + (k * 13) % 60 + Math.cos(a) * 6;
    ctx.fillStyle = `rgba(245,238,222,${0.45 + 0.3 * Math.sin(a)})`; ctx.beginPath(); ctx.arc(fx, fy, 6 + (k % 3) * 3, 0, Math.PI * 2); ctx.fill();
  }
  for (let k = 0; k < 6; k++) {   // branches tumbling in the water
    const bx = ((k * 211 + now * 140) % (x1 + 200)) - 100, by = floodTop(bx + camX) + 30 + (k * 37) % 120;
    if (bx > x1 - 10) continue;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(now * (k % 2 ? 1.2 : -0.9) + k);
    ctx.fillStyle = "#4a3320"; ctx.fillRect(-26, -3, 52, 6); ctx.fillRect(4, -3, 4, -14); ctx.restore();
  }
  ctx.restore();
}

// --- the boy from Tekoa
const boy = { state: "none", x: 0, y: 0, t: 0, facing: -1, moved: 0, stillT: 0 };
function resetBoy() {
  const bp = piece("boy"); if (!bp) return;
  Object.assign(boy, { state: "stranded", x: bp.x, y: bp.y, t: 0, facing: -1, moved: 0, stillT: 0 });
}
resetBoy();
function updateBoy(dt) {
  if (boy.state === "none") return;
  const d = david; boy.t += dt;
  if (boy.state === "stranded") {
    boy.facing = Math.sign(d.x - boy.x) || -1;
    if (Math.abs(d.x - boy.x) < 60 && Math.abs(d.y - boy.y) < 50 && d.deadT <= 0) {
      boy.state = "follow"; boy.t = 0; sfx("heal", undefined, 0.5);
      sayLine("The boy", "I was taking our donkey to market and the water came out of nowhere! Please, don't leave me here!");
    }
    return;
  }
  if (boy.state === "follow") {   // in David's footsteps, like the lamb: he hops where David hopped
    const tgt = d.deadT > 0 ? null : trailAt(W2.BOY_GAP);
    if (!tgt) { boy.moved = 0; return; }
    const far = Math.hypot(tgt.x - boy.x, tgt.y - boy.y);
    if (far > 9 * T) { boy.x = tgt.x; boy.y = tgt.y; }   // left far behind: he catches up
    moveToward(boy, tgt.x, tgt.y, Math.min(900, Math.max(TUNE.WALK_SPEED * 1.1, far * 6)), dt);
  }
}
function drawBoy(camX) {
  if (boy.state === "none") return;
  const x = boy.x - camX; if (x < -200 || x > W + 200) return;
  let name, i;
  if (boy.state === "stranded") { name = "boy_scared"; i = frameOf(name, boy.t); }
  else if (boy.state === "stone") { name = "boy_stone"; i = Math.min(SPR[name].frames - 1, Math.floor(boy.t * 1000 / SPR[name].ms)); }
  else if (dialog.t > 0 && dialog.who === "The boy") { name = "boy_talk"; i = frameOf(name, boy.t); }
  else if (boy.moved > 25) { name = "boy_walk"; i = frameOf(name, boy.t * Math.max(0.8, boy.moved / 200)); }
  else { name = "boy_idle"; i = frameOf(name, boy.t); }
  drawSprite(name, i, x, boy.y, boy.facing);
}

// --- on the bank: "Why do you carry those stones?" (Joshua 4:6-7). The game holds the controls until it's said.
const stonesTalk = { step: -1, t: 0 };
const STONES_LINES = [
  ["The boy", "Look! Our donkey! He got out of the riverbed too!"],
  ["The boy", "Why do you carry those stones around?"],
  ["David", "Joshua stacked twelve of them by the Jordan, so that when children asked what they meant, someone would tell them what God did. Each of mine is a time He helped me. Like today."],
];
function updateStonesTalk(d, dt) {   // true = the scene has the controls
  const sp = piece("stones");
  if (!sp || boy.state === "none") return false;
  if (stonesTalk.step < 0) {
    if (boy.state !== "follow" || d.x < sp.x || !d.onGround || d.deadT > 0) return false;
    stonesTalk.step = 0; sayLine(...STONES_LINES[0]); d.vx = 0; setState("idle");
  }
  if (stonesTalk.step >= STONES_LINES.length + 1) return false;   // all said
  d.vx = 0; d.facing = Math.sign(boy.x - d.x) || -1; boy.facing = -d.facing;
  if (pressed("a") || pressed("b")) dialog.t = Math.min(dialog.t, 0.01);   // A or B: next line
  if (stonesTalk.step < STONES_LINES.length) {
    if (dialog.t > 0.01) return true;
    stonesTalk.step++;
    if (stonesTalk.step < STONES_LINES.length) sayLine(...STONES_LINES[stonesTalk.step]);
    else { boy.state = "stone"; boy.t = 0; toast("The boy picks up a smooth stone from the riverbed, and keeps it."); }
    return true;
  }
  if (boy.t > SPR.boy_stone.frames * SPR.boy_stone.ms / 1000 + 0.6) { boy.state = "follow"; stonesTalk.step++; }
  return true;
}

const boyMissing = () => boy.state === "stranded";   // the gate won't open without him (main.js updateFinish)
function updateWorld2(dt) {
  if (boy.state === "stranded" && david.x > boy.x + 4 * T && !boy.nagged) { boy.nagged = true; sayLine("The boy", "Wait! Don't leave me here! Please!"); }
  updateFlood(dt); updateBoy(dt);
  updateEagles(dt); updateIbexes(dt); updateWind(dt);   // 2-3 (below)
  updatePools();
  updateCrash(); updateBear(dt); w2Shake.v = Math.max(0, w2Shake.v - dt * 1.6);   // 2-4 (below)
}
function updateSceneDavid(d, dt) { return updateStonesTalk(d, dt); }
function resetWorld2(restart) {   // after a fall (restart: out of lives, back to the start of the stage)
  Object.assign(flood, { on: false, done: false, startT: 0, told: false, level: 1, lastX: undefined }); hushFlood();
  resetEagles();
  if (bear.on && bear.state !== "defeated") resetBear();
  if (restart) { resetBoy(); stonesTalk.step = -1; }
  else if (boy.state === "follow" || boy.state === "stone") { boy.x = david.x - 40; boy.y = david.y; boy.state = "follow"; }
}

// ---------------------------------------------------------------------------
// 2-3 The High Cliffs (DESIGN 2-3): eagles that snatch your lamb, ibex that show you the safe path, wind gusts on the
// heights, and the waterfall over the hidden spring. Placed with setPiece() in main.js:
//   setPiece("eagle", c, r)                  circles here; dives at your lamb (or at David if he's carrying it)
//   setPiece("ibex", c, r, { path })         waits on a ledge, leaps to the next spot on its path as David comes near
//   setPiece("wind", c, r, { end })          gusts blow from the right between these columns (crouch to brace)
//   setPiece("falls", c, r, { w, bottom })   a waterfall pouring from row r down to `bottom`, w tiles wide
// ---------------------------------------------------------------------------
Object.assign(W2, {
  EAGLE_SEE: 9,          // tiles: how close your lamb (or David) has to come before an eagle dives
  EAGLE_DIVE: 560,       // px/s
  EAGLE_REST: 2.6,       // seconds circling between dives
  EAGLE_SIZE: 0.9,
  IBEX_NEAR: 4.5,        // tiles: how close David comes before the ibex leaps on
  IBEX_LEAP: 0.9,        // seconds in the air
  WIND_CALM: 2.6, WIND_WARN: 0.8, WIND_GUST: 1.7,   // seconds: the gust cycle
  WIND_PUSH: 300,        // px/s pushing David back (walking is 270): crouch (hold Down) on the ground and it can't move him
});
Object.assign(TUNE.SPRITE_SIZE, { eagle_fly: W2.EAGLE_SIZE });
const eagles = setPieces.filter(p => p.kind === "eagle").map(p => ({ hx: p.x, hy: p.y, x: p.x, y: p.y, t: Math.random() * 6, state: "soar", vx: 0, vy: 0, facing: -1, carry: false, gone: false, alpha: 1 }));
function resetEagles() { for (const e of eagles) Object.assign(e, { x: e.hx, y: e.hy, state: "soar", t: Math.random() * 2, carry: false, gone: false, alpha: 1 }); }
const lambDrop = { on: false, vy: 0 };   // the lamb tumbling down after an eagle lets go
function updateLambDrop(dt) {
  if (!lambDrop.on) return;
  if (lamb.carried || lamb.stolen) { lambDrop.on = false; return; }
  lambDrop.vy = Math.min(1100, lambDrop.vy + TUNE.GRAVITY * 0.8 * dt);
  const y1 = lamb.y + lambDrop.vy * dt, c = Math.floor(lamb.x / T);
  for (let r = Math.floor(lamb.y / T); r <= Math.floor(y1 / T); r++)
    if (lambDrop.vy > 0 && r >= 0 && (isSolid(c, r) || isOneway(c, r)) && lamb.y <= r * T + 1) { lamb.y = r * T; lambDrop.on = false; trail.length = 0; return; }
  lamb.y = y1;
  if (lamb.y > ROWS * T) { lambDrop.on = false; lamb.x = david.x - david.facing * 50; lamb.y = david.y; trail.length = 0; toast("Your lamb scrambled back up to you."); }
}
function updateEagles(dt) {
  updateLambDrop(dt);
  const d = david;
  for (const e of eagles) {
    if (e.gone) { if (e.alpha > 0) { e.alpha -= dt * 0.8; e.x += e.vx * dt; e.y += e.vy * dt; } continue; }
    e.t += dt;
    const lambFree = !lamb.carried && !lamb.stolen && d.deadT <= 0;
    if (e.state === "soar" || e.state === "carry") {   // wide slow circles round its spot (higher, and slower, with the lamb)
      const k = e.state === "carry" ? 0.6 : 1;
      const tx = e.hx + Math.sin(e.t * 0.7 * k) * 160, ty = e.hy - (e.carry ? 30 : 0) + Math.cos(e.t * 1.4 * k) * 30;
      e.facing = tx > e.x ? 1 : -1;
      e.x += (tx - e.x) * Math.min(1, dt * 2); e.y += (ty - e.y) * Math.min(1, dt * 2);
      if (e.state === "carry") { lamb.x = e.x; lamb.y = e.y + 62; continue; }
      const tgt = lambFree ? { x: lamb.x, y: lamb.y - 20 } : { x: d.x, y: d.y - 60 };
      if (e.t > W2.EAGLE_REST && Math.abs(tgt.x - e.x) < W2.EAGLE_SEE * T && tgt.y > e.y + 40) {
        const dx = tgt.x - e.x, dy = tgt.y - e.y, n = Math.hypot(dx, dy);
        e.state = "dive"; e.t = 0; e.vx = dx / n * W2.EAGLE_DIVE; e.vy = dy / n * W2.EAGLE_DIVE; e.facing = Math.sign(dx) || 1;
        if (!e.screeched) { e.screeched = true; toast("An eagle! It's after your lamb. Hold Up and throw to hit it in the air."); }
      }
    } else if (e.state === "dive") {
      e.x += e.vx * dt; e.y += e.vy * dt;
      if (lambFree && Math.hypot(lamb.x - e.x, lamb.y - 20 - e.y) < 46) {   // got it: up and away with the lamb
        e.state = "carry"; e.carry = true; e.t = 0; lamb.stolen = true; baa(lamb.x, 1);
        toast("The eagle took your lamb! Hit it with a stone (hold Up to aim up) and it will let go.");
      } else if (Math.abs(e.x - d.x) < 44 && e.y > d.y - d.h - 10 && e.y < d.y) { hurtDavid(e.x); e.state = "climb"; e.t = 0; }
      else if (e.t > 1.3 || e.y > GR * T) { e.state = "climb"; e.t = 0; }
    } else {   // climbing back up to its spot
      e.x += (e.hx - e.x) * Math.min(1, dt * 1.5); e.y += (e.hy - e.y) * Math.min(1, dt * 1.5); e.facing = e.hx > e.x ? 1 : -1;
      if (e.t > 1.4) { e.state = "soar"; e.t = 0; }
    }
  }
}
function stoneHitsEagles(s) {   // called first in stoneHitsBugs (main.js)
  for (const e of eagles) if (!e.gone && Math.hypot(s.x - e.x, s.y - (e.y - 20)) < 62) {
    e.gone = true; e.vx = Math.sign(s.vx || 1) * 220; e.vy = -320;
    if (e.carry) {   // it lets go: the lamb tumbles down to you
      lamb.stolen = false; lamb.x = e.x; lamb.y = e.y + 60; trail.length = 0; baa(lamb.x, 1);
      lambDrop.on = true; lambDrop.vy = -200;
      for (let i = 0; i < 12; i++) bits.push({ x: e.x, y: e.y + 40, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 300, life: 0.7, color: "#fff7c2" });
      toast("The eagle let go! Your lamb is safe.");
    } else toast("Eagle driven off!");
    stoneHit(s); return !s.power;
  }
  return false;
}
function drawEagles(camX) {
  for (const e of eagles) {
    if (e.alpha <= 0) continue;
    const x = e.x - camX; if (x < -200 || x > W + 200) continue;
    if (e.carry && !e.gone) drawSprite("lamb_run", 2, x, e.y + 62, e.facing);   // dangling from its talons
    drawSprite("eagle_fly", frameOf("eagle_fly", e.t * (e.state === "dive" ? 0.6 : 1)), x, e.y, e.facing, 1, e.alpha);
  }
}

// --- ibex: the wild goats know every safe path (Hanan). Each one leaps ahead along its path as David comes near.
const ibexes = setPieces.filter(p => p.kind === "ibex").map(p => ({ path: [[p.c, p.r], ...(p.path || [])], i: 0, x: p.x, y: p.y, t: Math.random() * 3, leap: null, facing: 1 }));
const ibexSpot = ([c, r]) => ({ x: c * T + T / 2, y: (r + 1) * T });
function updateIbexes(dt) {
  for (const b of ibexes) {
    b.t += dt;
    if (b.leap) {
      const L = b.leap, k = Math.min(1, b.t / W2.IBEX_LEAP);
      b.x = L.x0 + (L.x1 - L.x0) * k; b.y = L.y0 + (L.y1 - L.y0) * k - Math.sin(k * Math.PI) * (110 + Math.max(0, L.y0 - L.y1) * 0.6);
      if (k >= 1) { b.leap = null; b.t = 0; }
      continue;
    }
    const near = Math.abs(david.x - b.x) < W2.IBEX_NEAR * T && Math.abs(david.y - b.y) < 6 * T;
    if (near && b.i < b.path.length - 1 && b.t > 0.8) {
      const a = ibexSpot(b.path[b.i]), z = ibexSpot(b.path[++b.i]);
      b.leap = { x0: a.x, y0: a.y, x1: z.x, y1: z.y }; b.t = 0; b.facing = Math.sign(z.x - a.x) || 1;
    } else b.facing = b.i < b.path.length - 1 ? Math.sign(ibexSpot(b.path[b.i + 1]).x - b.x) || 1 : b.facing;
  }
}
function drawIbexes(camX) {
  for (const b of ibexes) {
    const x = b.x - camX; if (x < -300 || x > W + 300) continue;
    if (b.leap) { const n = SPR.ram_leap.frames; drawSprite("ram_leap", Math.min(n - 1, 3 + Math.floor(b.t / W2.IBEX_LEAP * (n - 5))), x, b.y, b.facing); }
    else drawSprite("ram_stand", frameOf("ram_stand", b.t), x, b.y, b.facing);
  }
}

// --- wind on the heights: a gust every few seconds from the right. Streaks warn you first; crouch to brace.
const wind = { t: 0, phase: "calm", streaks: [], told: false };
function windZone() { const w = piece("wind"); return w && david.x > w.x && david.x < w.end * T ? w : null; }
function updateWind(dt) {
  if (!piece("wind")) return;
  const cyc = W2.WIND_CALM + W2.WIND_WARN + W2.WIND_GUST, t = (wind.t = (wind.t + dt) % cyc);
  wind.phase = t < W2.WIND_CALM ? "calm" : t < W2.WIND_CALM + W2.WIND_WARN ? "warn" : "gust";
  const on = windZone(), d = david;
  if (on && wind.phase !== "calm" && Math.random() < (wind.phase === "gust" ? 0.9 : 0.3))
    wind.streaks.push({ x: camX + W + 40, y: Math.random() * H * 0.8, len: 60 + Math.random() * 120, v: 900 + Math.random() * 500, life: 1.6 });
  for (const s of wind.streaks) { s.x -= s.v * dt; s.life -= dt; }
  wind.streaks = wind.streaks.filter(s => s.life > 0);
  if (!on || wind.phase !== "gust" || d.deadT > 0 || d.harp || inCutscene()) return;
  const braced = d.onGround && held("down");
  if (!wind.told) { wind.told = true; toast("Wind! When you see it coming, crouch (hold Down) to brace yourself."); }
  if (!braced) { const push = W2.WIND_PUSH * (d.onGround ? 1 : 0.8) * dt, x0 = d.x; d.x -= push; if (bumpsWall(d)) d.x = x0; }
}
function bumpsWall(d) {   // would standing here put him inside rock?
  const c = Math.floor((d.x - BODY_W / 2) / T);
  for (let r = Math.floor((d.y - d.h) / T); r <= Math.floor((d.y - 1) / T); r++) if (isSolid(c, r)) return true;
  return false;
}
function drawWind() {
  if (!wind.streaks.length) return;
  ctx.save(); ctx.strokeStyle = "rgba(255,250,235,0.55)"; ctx.lineWidth = 2; ctx.lineCap = "round";
  for (const s of wind.streaks) { const x = s.x - camX; ctx.globalAlpha = Math.min(1, s.life); ctx.beginPath(); ctx.moveTo(x, s.y); ctx.lineTo(x + s.len, s.y + 4); ctx.stroke(); }
  ctx.restore();
}

// --- the waterfall over the hidden spring: Glen's Grok clip (sprite "waterfall": its anchor is the lip at the top),
//     stretched to fall from row r to `bottom`. Without the sprite, a painted stand-in.
function drawFalls(camX) {
  for (const f of setPieces.filter(p => p.kind === "falls")) {
    if (SPR.waterfall && SPR.waterfall.img.naturalWidth) {
      const x = f.c * T - camX; if (x < -900 || x > W + 400) continue;
      const k = (f.bottom - f.r) * T / (SPR.waterfall.h * SCALE);
      drawSprite("waterfall", frameOf("waterfall", performance.now() / 1000), x + (f.dx || 0), f.r * T, 1, k);
      continue;
    }
    const x0 = f.c * T - camX, w = f.w * T, y0 = f.r * T, y1 = f.bottom * T; if (x0 > W + 50 || x0 + w < -50) continue;
    const now = performance.now() / 1000;
    ctx.save();
    const g = ctx.createLinearGradient(x0, 0, x0 + w, 0);
    g.addColorStop(0, "rgba(170,215,235,0.55)"); g.addColorStop(0.5, "rgba(225,245,252,0.8)"); g.addColorStop(1, "rgba(170,215,235,0.55)");
    ctx.fillStyle = g; ctx.fillRect(x0, y0, w, y1 - y0);
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 2;
    for (let k = 0; k < 9; k++) {   // falling streaks
      const sx = x0 + 6 + (k * 37) % (w - 10), len = 50 + (k * 23) % 60, sy = y0 + ((now * 520 + k * 97) % (y1 - y0 + len)) - len;
      ctx.beginPath(); ctx.moveTo(sx, Math.max(y0, sy)); ctx.lineTo(sx, Math.min(y1, sy + len)); ctx.stroke();
    }
    for (let k = 0; k < 10; k++) {   // white water where it lands
      const a = now * 4 + k * 1.7;
      ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.3 * Math.sin(a)})`;
      ctx.beginPath(); ctx.arc(x0 - 10 + (k / 9) * (w + 20), y1 - 4 - Math.abs(Math.sin(a)) * 14, 9 + (k % 3) * 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// 2-4 The Bear's Ravine (DESIGN 2-4): wolves that hunt in pairs, claw marks, a tree crashing down somewhere off in the
// dusk, and the Bear at the pen wall. Placed with setPiece() / critter() in main.js:
//   critter("wolf", c)               sits until David comes near, then runs at him; a stone drives it off
//   setPiece("claws", c, r)          claw marks gouged into rock or bark
//   setPiece("crash", c)             past here: a tree crashes down somewhere ahead
//   setPiece("bear", c, r, { arena }) the Bear, at the pen wall with a sheep pinned; the fight starts past `arena`
// ---------------------------------------------------------------------------
Object.assign(W2, {
  WOLF_SEE: 9, WOLF_RUN: 400, WOLF_SIZE: 1.25,
  BEAR_HP: 8,            // a stagger (full charged stone while it roars) = 2; while dazed: tap 1, charged 2, Power 3
  BEAR_SIZE: 1.7,
  BEAR_WALK: 120, BEAR_CHARGE: 540, BEAR_CHARGE_RUN: 11,   // px/s, and the most tiles one charge runs
  BEAR_TELL: 1.0,        // the scrape before a charge
  BEAR_ROAR: 1.5,        // it rears up on its hind legs and roars (the opening: a full charged stone now staggers it), then slams
  BEAR_SLAM_DROP: 0.4,   // seconds from the top of the rear to its paws hitting the ground
  BEAR_SLAM_SHAKE: 1.6,  // how hard the screen shakes when it lands
  BEAR_TURN: 0.9,        // slow to turn round
  BEAR_DAZED: 3.0, BEAR_REST: 1.2,
  BEAR_SLAM_REACH: 9,    // tiles: the slam shakes the ground this far; be in the air
  BEAR_THROW_SPEED: 0.9, // how fast the throws play (1 = the clip's own speed)
  BOULDER_ROLL: 1.6,     // seconds a thrown boulder rolls along the ground after it lands: jump it or roll under it
});
Object.assign(TUNE.SPRITE_SIZE, { wolf_run: W2.WOLF_SIZE, wolf_walk: W2.WOLF_SIZE, wolf_sit: W2.WOLF_SIZE, wolf_stand_up: W2.WOLF_SIZE,
  bear_rear_roar: W2.BEAR_SIZE, bear_rear_slam: W2.BEAR_SIZE, bear_growl: W2.BEAR_SIZE, bear_throw: W2.BEAR_SIZE, bear_throw_back: W2.BEAR_SIZE,
  bear_walk: W2.BEAR_SIZE, bear_charge: W2.BEAR_SIZE, bear_lunge: W2.BEAR_SIZE, bear_stand_roar: W2.BEAR_SIZE, bear_dazed: W2.BEAR_SIZE });
CRITTER_ART.wolf = { idle: "wolf_sit", move: "wolf_run", len: 120, h: 62 };
const w2Shake = { v: 0 };   // the ground shaking (main.js adds it to the camera)

// --- wolves
function updateWolf(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 50, 44, dt); };
  if (k.state === "idle") {
    fall(); k.facing = Math.sign(dx) || k.facing;
    if (sameLevel && Math.abs(dx) < W2.WOLF_SEE * T && david.deadT <= 0) { setCrit(k, "rise"); k.t = -(k.delay || 0); }
    return;
  }
  if (k.state === "rise") { fall(); if (k.t > 0.8) setCrit(k, "hunt"); return; }
  if (k.state === "hunt") {
    k.facing = Math.sign(dx) || k.facing;
    if (!runCritter(k, W2.WOLF_RUN, dt) && k.t > 0.3) { setCrit(k, "wait"); }
    if (touchesDavid(critterBox(k))) { hurtDavid(k.x); setCrit(k, "pass"); }
    return;
  }
  if (k.state === "pass") { runCritter(k, W2.WOLF_RUN, dt); if (k.t > 0.9) setCrit(k, "hunt"); return; }   // runs on past, then wheels round
  if (k.state === "wait") { fall(); k.facing = Math.sign(dx) || k.facing; if (k.t > 1.0) setCrit(k, "hunt"); }
}
function stoneHitsWolf(k, s) {
  k.gone = true; k.facing = Math.sign(k.x - david.x) || 1; k.vx = k.facing * 460; stoneHit(s);
  toast("Wolf driven off!"); return !s.power;
}
function drawWolf(k, x) {
  let name = "wolf_run", i;
  if (k.state === "idle") { name = "wolf_sit"; i = frameOf(name, k.t); }
  else if (k.state === "rise") { name = "wolf_stand_up"; i = Math.max(0, Math.min(SPR[name].frames - 1, Math.floor(k.t * 1000 / SPR[name].ms))); }
  else if (k.state === "wait") { name = "wolf_walk"; i = 0; }
  else i = frameOf(name, k.t);
  drawSprite(name, i, x, k.y, k.facing, 1, k.alpha);
}

// --- claw marks, and the tree that crashes down off in the dusk
function drawClaws(camX) {
  for (const p of setPieces) if (p.kind === "claws") {
    const x = p.x - camX, y = p.r * T; if (x < -80 || x > W + 80) continue;
    ctx.save(); ctx.strokeStyle = "rgba(35,20,10,0.75)"; ctx.lineWidth = 5; ctx.lineCap = "round";
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 24 + k * 14, y); ctx.quadraticCurveTo(x - 18 + k * 14, y + 34, x - 28 + k * 15, y + 64); ctx.stroke(); }
    ctx.strokeStyle = "rgba(240,215,170,0.35)"; ctx.lineWidth = 2;
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(x - 21 + k * 14, y + 4); ctx.quadraticCurveTo(x - 15 + k * 14, y + 36, x - 25 + k * 15, y + 62); ctx.stroke(); }
    ctx.restore();
  }
}
function updateCrash() {
  const p = piece("crash"); if (!p || p.done || david.x < p.x) return;
  p.done = true; w2Shake.v = 0.9;
  sfx("stone_hit", undefined, 1, 0.35); setTimeout(() => sfx("fall_pit", undefined, 0.8, 0.5), 250);
  toast("CRACK... a tree came crashing down somewhere ahead. Something big is out there.");
}

// --- the Bear
const bearPiece = piece("bear");
const bear = { on: !!bearPiece };
const fallingRocks = [];
function resetBear() {
  if (!bear.on) return;
  Object.assign(bear, { x: bearPiece.x, y: bearPiece.y, vx: 0, vy: 0, onGround: true, facing: 1, state: "pen", t: 0, hp: W2.BEAR_HP,
                        flash: 0, alpha: 1, atkT: 1.5, told: false, toldPen: false, sheepFreed: false, sheepX: bearPiece.x + 120, sheepT: 0 });
  fallingRocks.length = 0;
}
resetBear();
const bearFight = () => bear.on && bear.state !== "defeated" && (bear.state !== "pen" || david.x > bearPiece.arena * T - TUNE.BOSS_MUSIC_LEAD * T) && david.deadT <= 0;
const bearBlocking = () => bear.on && bear.state !== "defeated";
function setBear(s) { if (bear.state !== s) { bear.state = s; bear.t = 0; } }
function bearBox() {
  const tall = bear.state === "roar" ? 185 : bear.state === "dazed" || bear.state === "defeated" ? 150 : 100;   // reared up, it's taller than David
  return { x0: bear.x - 85, x1: bear.x + 85, y0: bear.y - tall, y1: bear.y };
}
function updateBear(dt) {
  if (!bear.on) return;
  const B = bear, d = david; B.t += dt; B.flash = Math.max(0, B.flash - dt);
  for (const r of fallingRocks) { r.vy += 1500 * dt; r.y += r.vy * dt; r.t += dt;
    if (r.kind === "boulder") {   // thrown: arcs over (crashing through the ledges), bounces once, rolls on along the ground
      r.x += r.vx * dt;
      const c = Math.floor(r.x / T), row = Math.floor(r.y / T);
      if (r.vy > 0 && isSolid(c, row) && r.y - r.vy * dt <= row * T + 2) { r.y = row * T; r.bounced = (r.bounced || 0) + 1; r.vy = r.bounced === 1 ? -320 : 0; r.vx *= 0.75; r.rollT = r.rollT || 0; w2Shake.v = Math.max(w2Shake.v, 0.4); }
      if (isSolid(Math.floor((r.x + Math.sign(r.vx) * r.r) / T), Math.floor((r.y - r.r) / T))) r.vx = 0;
      if (r.bounced >= 2) r.rollT += dt;
      if (!r.hit && Math.abs(r.x - d.x) < r.r + 14 && r.y - r.r * 2 < d.y && r.y > d.y - d.h) { r.hit = true; hurtDavid(r.x); }
      if (r.rollT > W2.BOULDER_ROLL || r.y > ROWS * T + 100) r.landed = true;
      continue;
    }
    if (!r.hit && Math.abs(r.x - d.x) < 26 && r.y > d.y - d.h && r.y < d.y + 10) { r.hit = true; hurtDavid(r.x); }
    if (r.y > GR * T && !r.landed) { r.landed = true; for (let k = 0; k < 6; k++) bits.push({ x: r.x, y: GR * T - 4, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 250, life: 0.5, color: "#8a8378" }); } }
  for (let i = fallingRocks.length - 1; i >= 0; i--) if (fallingRocks[i].landed) fallingRocks.splice(i, 1);
  if (B.sheepFreed) B.sheepT += dt;
  if (B.state === "defeated") { B.alpha = Math.max(0, B.alpha - dt * 0.4); return; }
  const dx = d.x - B.x, dist = Math.abs(dx), late = B.hp <= W2.BEAR_HP / 2;   // the last half: quicker
  const physics = () => { B.vy = Math.min(TUNE.MAX_FALL, B.vy + TUNE.GRAVITY * dt); collideBody(B, 120, 90, dt); };
  if (B.state === "pen") {   // clawing at the pen wall, a sheep pinned under its paw
    B.vx = 0; physics();
    if (!B.toldPen && d.x > bearPiece.arena * T) { B.toldPen = true; helpT = 0; toast("The bear has a sheep pinned at the pen wall! Tap stones won't turn it. A full charged stone will."); }
    return;
  }
  B.atkT -= dt; B.backCool = (B.backCool || 0) - dt;
  switch (B.state) {
    case "turn": B.vx = 0; if (B.t > W2.BEAR_TURN * (late ? 0.7 : 1)) { B.facing = Math.sign(dx) || B.facing; setBear("walk"); } break;
    case "walk": {
      if (Math.sign(dx) !== B.facing && dist > 30) {   // David got behind it (jumped over): slow to turn... or it grabs a rock and hurls it back over its shoulder
        setBear(dist < 9 * T && B.backCool <= 0 && Math.random() < 0.6 ? "throwBack" : "turn"); B.backCool = 5; break;
      }
      B.vx = B.facing * W2.BEAR_WALK * (late ? 1.25 : 1);
      if (B.atkT <= 0) {
        B.vx = 0;
        const r = Math.random();
        if (dist < 2.6 * T) setBear(r < 0.6 ? "lunge" : "roar");   // up close: a swipe, or it rears up to roar
        else if (dist < 13 * T) setBear(r < 0.4 ? "tell" : r < 0.7 ? "roar" : "throw");
        else setBear(r < 0.5 ? "throw" : "roar");   // far off: it hurls a boulder at you
      }
      break;
    }
    case "tell": B.vx = 0; if (B.t > W2.BEAR_TELL * (late ? 0.8 : 1)) { setBear("charge"); B.startX = B.x; } break;   // the scrape: get above it, or out of the way
    case "charge": {
      B.vx = B.facing * W2.BEAR_CHARGE;
      const x0 = B.x; physics();
      if (Math.abs(B.x - x0) < 0.2 * W2.BEAR_CHARGE * dt || Math.abs(B.x - B.startX) > W2.BEAR_CHARGE_RUN * T || !groundAhead(B, B.facing)) { B.vx = 0; setBear("rest"); w2Shake.v = Math.max(w2Shake.v, 0.3); }
      break;
    }
    case "roar": B.vx = 0; if (B.t > W2.BEAR_ROAR * (late ? 0.8 : 1)) { setBear("slam"); } break;   // the opening
    case "slam": {   // down on its front paws: the ground shakes, and rocks come down from the ravine walls
      B.vx = 0;
      if (!B.slammed && B.t > W2.BEAR_SLAM_DROP) {   // it comes down HARD
        B.slammed = true; w2Shake.v = W2.BEAR_SLAM_SHAKE; sfx("stone_hit", B.x, 1, 0.3); sfx("fall_pit", B.x, 0.9, 0.45);
        const px = B.x + B.facing * 60;
        for (let k = 0; k < 26; k++) bits.push({ x: px + (Math.random() - 0.5) * 120, y: B.y - 4, vx: (Math.random() - 0.5) * 520, vy: -Math.random() * 420, life: 0.8, color: k % 3 ? "#7a6248" : "#a48a68" });
        if (d.onGround && dist < W2.BEAR_SLAM_REACH * T) hurtDavid(B.x);
        for (let k = 0; k < (late ? 4 : 3); k++) fallingRocks.push({ x: d.x + (k - 1) * 2.2 * T + (Math.random() - 0.5) * T, y: -40 - k * 90, vy: 0, t: 0 });
      }
      if (B.t > 1.0) { B.slammed = false; setBear("rest"); }
      break;
    }
    case "lunge": B.vx = B.facing * (B.t < 0.5 ? 260 : 0); if (B.t > 1.1) setBear("rest"); break;
    case "throw": case "throwBack": {   // wind up with a boulder, then let it fly (back: over its shoulder, and it ends up facing you)
      B.vx = 0;
      if (B.t <= dt) B.throwItem = BEAR_THROWS[Math.floor(Math.random() * BEAR_THROWS.length)];   // a boulder, or a log
      const nm = B.state === "throw" ? "bear_throw" : "bear_throw_back", s = SPR[nm], len = s.frames * s.ms / 1000 / W2.BEAR_THROW_SPEED;
      const rel = B.state === "throw" ? 10 : 9, f = Math.floor(B.t / len * s.frames);
      if (!B.thrown && f >= rel) {
        B.thrown = true;
        const dir = B.state === "throw" ? B.facing : -B.facing, sx = B.x + dir * 70, sy = B.y - 150;
        const flight = Math.max(0.6, Math.min(1.2, Math.abs(d.x - sx) / 520));
        fallingRocks.push({ kind: "boulder", item: B.throwItem, x: sx, y: sy, vx: (d.x - sx) / flight, vy: (d.y - 40 - sy) / flight - 0.5 * 1500 * flight, t: 0, r: 26 });
        sfx("sling_throw_quick", B.x, 0.8, 0.5);
      }
      if (B.t >= len) { B.thrown = false; if (B.state === "throwBack") B.facing = -B.facing; setBear("rest"); }
      break;
    }
    case "rest": B.vx = 0; if (B.t > W2.BEAR_REST) { B.atkT = (late ? 1.2 : 1.8) + Math.random(); setBear("walk"); } break;
    case "dazed": B.vx = 0; if (B.t > W2.BEAR_DAZED) { B.atkT = 1.5; setBear("walk"); } break;
  }
  if (B.state !== "charge") physics();
  if (B.state !== "dazed" && B.state !== "turn" && d.deadT <= 0) {
    const b = bearBox();
    if (d.x + BODY_W / 2 > b.x0 && d.x - BODY_W / 2 < b.x1 && d.y > b.y0 && d.y - d.h < b.y1) hurtDavid(B.x);
  }
}
function bearDamage(s) {   // what this stone would do right now (0 = bounces off)
  const B = bear; if (!B.on || B.state === "defeated" || B.state === "pen") return 0;
  if (B.state === "dazed") return s.power ? 3 : s.charged ? 2 : 1;
  if (s.power || (s.charged && B.state === "roar")) return 2;
  return 0;
}
function stoneHitsBear(s) {   // called from updateStones (main.js)
  const B = bear; if (!B.on || B.state === "defeated") return false;
  const b = bearBox(); if (s.x < b.x0 || s.x > b.x1 || s.y < b.y0 || s.y > b.y1) return false;
  if (B.state === "pen") {
    if (s.charged || s.power) {   // it lets go of the sheep and turns on David
      stoneHit(s); B.sheepFreed = true; B.facing = -1; setBear("turn"); B.atkT = 2;
      toast("It let the sheep go! Keep your distance. Hit it with a full charged stone when it rears up to roar.");
    } else { stoneHit(s, 0.6); if (!B.told) { B.told = true; toast("The bear doesn't even notice a tap stone. Hold B until the ring turns gold."); } }
    return true;
  }
  const dmg = bearDamage(s);
  if (!dmg) { stoneHit(s, 0.6); if (!B.told) { B.told = true; toast("Stones bounce off its thick coat! Wait until it rears up to roar, then a full charged stone."); } return true; }
  B.hp -= dmg; B.flash = 0.3;
  if (B.state !== "dazed") { setBear("dazed"); toast(B.hp > 0 ? "It's staggered! Hit it again while it's down." : ""); }
  for (let k = 0; k < 8; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 300, life: 0.5, color: "#fff2b0" });
  if (B.hp <= 0) {
    setBear("defeated"); bearFinalHit(s);
    toast("The bear is beaten! \"God is our refuge and strength, an ever-present help in trouble.\" (Psalm 46:1)");
  } else { stoneHit(s); sfx("lion_hit", B.x, 0.9, 0.8); }
  return true;
}
function bearFinalHit(s) {   // the last stone: the same freeze, flash and slow-motion as the lion (main.js finalBlow)
  if (!finalBlow.on) {
    finalBlow.snd = sfx(finalBlow.sound, undefined, 1);
    if (finalBlow.snd) try { finalBlow.snd.currentTime = Math.max(0, FINAL_PEAK[finalBlow.sound] - 0.05); } catch (e) {}
  }
  Object.assign(finalBlow, { on: true, phase: "hit", t: 0, stone: null, flash: 1, shake: 1 });
  sfx("lion_defeated", bear.x, 1, 0.75);
  for (let k = 0; k < 16; k++) bits.push({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 700, vy: -Math.random() * 600, life: 0.9, color: k % 2 ? "#fff2b0" : "#ffffff" });
}
function watchBearFinal(s) {   // slow the world down if this stone is going to be the last one (like the lion)
  const dmg = bearDamage(s); if (!dmg || dmg < bear.hp) return;
  if (bear.state === "dazed" && bear.t > W2.BEAR_DAZED - TUNE.FINAL_LEAD - 0.05) return;
  if (bear.state === "roar" && bear.t > W2.BEAR_ROAR - TUNE.FINAL_LEAD) return;
  const b = bearBox(); let x = s.x, y = s.y, vy = s.vy;
  const g = TUNE.STONE_GRAVITY * (s.power ? 0.08 : s.charged ? 0.45 : 1), step = 1 / 120;
  for (let t = 0; t < TUNE.FINAL_LEAD; t += step) {
    vy += g * step; x += s.vx * step; y += vy * step;
    if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) {
      Object.assign(finalBlow, { on: true, phase: "fly", t: 0, stone: s });
      finalBlow.snd = sfx(finalBlow.sound, undefined, 1);
      if (finalBlow.snd) try { finalBlow.snd.currentTime = Math.max(0, FINAL_PEAK[finalBlow.sound] - TUNE.FINAL_LEAD / TUNE.FINAL_SLOWMO); } catch (e) {}
      return;
    }
  }
}
const BEAR_THROWS = ["boulder_tan", "boulder_grey", "log_short"];   // Glen's rocks-and-logs sheet (assets/items)
function drawBoulder(x, y, r, spin, item) {   // what the bear throws (it rolls: spin follows how far it's gone)
  const img = item && ITEM[item];
  if (img && img.naturalWidth) {
    const w = r * 2.5, h = w * img.naturalHeight / img.naturalWidth;
    ctx.save(); ctx.translate(x, y); ctx.rotate(spin); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore(); return;
  }
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
  ctx.fillStyle = "#857d71"; ctx.strokeStyle = "#4a443c"; ctx.lineWidth = 3;
  ctx.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2, rr = r * (0.86 + 0.14 * Math.sin(k * 2.3)); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.35, r * 0.2, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawBear(camX) {
  if (!bear.on || bear.alpha <= 0) return;
  const B = bear, x = B.x - camX; if (x < -400 || x > W + 400) return;
  if (!B.sheepFreed || B.sheepT < 2.5) {   // the pinned sheep: freed, it bolts for the pen and is gone
    const sx = B.sheepFreed ? B.sheepX + B.sheepT * 260 : B.sheepX, a = B.sheepFreed ? Math.max(0, 1 - B.sheepT / 2.5) : 1;
    if (B.sheepFreed) drawSprite("sheep_trot", frameOf("sheep_trot", B.sheepT), sx - camX, B.y, 1, 1, a);
    else drawSprite("sheep_cast", frameOf("sheep_cast", B.t), sx - camX, B.y, -1);
  }
  let name = "bear_walk", i, filter = "";
  switch (B.state) {
    case "pen": name = "bear_lunge"; i = frameOf(name, B.t * 0.8); break;   // clawing at the wall
    case "walk": i = frameOf(name, B.t); break;
    case "turn": case "rest": i = 0; break;
    case "tell": name = "bear_growl"; i = frameOf(name, B.t * 1.6); filter = "drop-shadow(0 0 10px rgba(255,200,60,0.95))"; break;   // head down, growling
    case "charge": name = "bear_charge"; i = frameOf(name, B.t); break;
    case "roar": name = "bear_rear_roar"; i = Math.min(SPR[name].frames - 1, Math.floor(B.t / (W2.BEAR_ROAR * (bear.hp <= W2.BEAR_HP / 2 ? 0.8 : 1)) * SPR[name].frames)); filter = "drop-shadow(0 0 12px rgba(255,200,60,0.95))"; break;
    case "slam": name = "bear_rear_slam"; i = Math.min(SPR[name].frames - 1, Math.floor(B.t / W2.BEAR_SLAM_DROP * (SPR[name].frames - 1))); break;
    case "lunge": name = "bear_lunge"; i = Math.min(SPR[name].frames - 1, Math.floor(B.t / 0.12)); break;
    case "throw": case "throwBack": name = B.state === "throw" ? "bear_throw" : "bear_throw_back";
      i = Math.min(SPR[name].frames - 1, Math.floor(B.t * W2.BEAR_THROW_SPEED * 1000 / SPR[name].ms)); break;
    case "dazed": case "defeated": name = "bear_dazed"; i = Math.min(SPR[name].frames - 1, Math.floor(B.t * 1000 / SPR[name].ms)); break;
  }
  const shake = B.state === "tell" ? Math.sin(B.t * 60) * 3 : 0;
  if (B.flash > 0) filter = "brightness(1.8)";
  drawSprite(name, i, x + shake, B.y, B.facing, 1, B.alpha, filter);
  if ((B.state === "throw" || B.state === "throwBack") && !B.thrown && i >= 3) drawBoulder(x + B.facing * 40, B.y - 165, 24, 0, B.throwItem);   // up in its paws
  for (const r of fallingRocks) {
    if (r.kind === "boulder") { drawBoulder(r.x - camX, r.y - r.r, r.r, r.x / r.r, r.item); continue; }
    ctx.fillStyle = "#8a8378"; ctx.strokeStyle = "#4e4840"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(r.x - camX, r.y, 16, 13, r.t * 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  if (B.state !== "pen" && B.state !== "defeated") {   // its strength, top of the screen
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(W / 2 - 162, 22, 324, 22);
    ctx.fillStyle = "#b5702e"; ctx.fillRect(W / 2 - 158, 26, 316 * Math.max(0, B.hp) / W2.BEAR_HP, 14);
    ctx.fillStyle = "#fff"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center"; ctx.fillText("THE BEAR", W / 2, 38); ctx.textAlign = "left";
  }
}

// ---------------------------------------------------------------------------
// 2-2's low passage: yellow scorpions in a gap under the rock you have to crawl through, and a hedgehog that eats them
// (DESIGN 2-2). Leave the hedgehog be and it trundles in and clears the nest; hit it and it runs off, and the
// scorpions are yours to deal with (crouch and throw: the stone flies low).
// ---------------------------------------------------------------------------
Object.assign(W2, { SCORPION_WALK: 40, HEDGEHOG_WALK: 95, HEDGEHOG_RUN: 320, HEDGEHOG_WAKE: 7, HEDGEHOG_GOES: 16,
  HEDGEHOG_TUCKED: 1.8 });   // seconds curled up in a ball after a stone, before it uncurls and runs
function spriteBox(k, name, h) {   // the body box from the sprite's own frame (for small animals whose anchor isn't the head)
  const s = SPR[name], sc = SCALE * (TUNE.SPRITE_SIZE[name] || 1);
  if (!s) return { x0: k.x - 30, x1: k.x + 30, y0: k.y - h, y1: k.y };
  const a = k.x - k.facing * s.ax * sc, b = k.x + k.facing * (s.w - s.ax) * sc;
  return { x0: Math.min(a, b) + 6, x1: Math.max(a, b) - 6, y0: k.y - h, y1: k.y };
}
CRITTER_ART.scorpion = { idle: "scorpion_walk", move: "scorpion_walk", len: 60, h: 30, box: k => spriteBox(k, "scorpion_walk", 30) };
CRITTER_ART.hedgehog = { idle: "hedgehog_walk", move: "hedgehog_walk", len: 60, h: 36, box: k => spriteBox(k, "hedgehog_walk", 36) };
function updateScorpion(k, dx, sameLevel, dt) {   // scuttles back and forth in its gap; touching it stings
  if (!runCritter(k, W2.SCORPION_WALK, dt) || (k.range && Math.abs(k.x - k.home) > k.range && Math.sign(k.x - k.home) === k.facing)) k.facing = -k.facing;
  if (touchesDavid(critterBox(k))) hurtDavid(k.x);
}
function stoneHitsScorpion(k, s) { k.gone = true; k.vx = 0; stoneHit(s, 0.5); toast("Scorpion squashed!"); return !s.power; }
function updateHedgehog(k, dx, sameLevel, dt) {
  const fall = () => { k.vx = 0; k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt); collideBody(k, 40, 30, dt); };
  const calm = k.state === "idle" || k.state === "walk" || k.state === "rest";
  if (calm && sameLevel && Math.abs(dx) < 2.6 * T && Math.abs(david.vx) > TUNE.WALK_SPEED * 1.05 && david.deadT <= 0) {   // startled: David came running
    k.after = k.state === "idle" ? "walk" : k.state; k.vx = 0; setCrit(k, "curl"); return;
  }
  if (k.state === "idle") { fall(); k.facing = 1; if (Math.abs(dx) < W2.HEDGEHOG_WAKE * T) setCrit(k, "walk"); return; }
  if (k.state === "walk") {   // trundles along, snapping up any scorpion it meets
    k.facing = 1; runCritter(k, W2.HEDGEHOG_WALK, dt);
    const b = critterBox(k);
    for (const s of critters) if (s.kind === "scorpion" && !s.gone) {
      const sb = critterBox(s);
      if (sb.x0 < b.x1 && sb.x1 > b.x0) { s.gone = true; s.vx = 0; s.alpha = 0.6; if (!k.ate) { k.ate = true; toast("The hedgehog snapped up a scorpion! Hedgehogs eat them."); } }
    }
    if (k.x > k.home + W2.HEDGEHOG_GOES * T) setCrit(k, "rest");
    return;
  }
  if (k.state === "curl") { fall(); if (k.t > SPR.hedgehog_curl.frames * SPR.hedgehog_curl.ms / 1000) setCrit(k, "ball"); return; }
  if (k.state === "ball") { fall(); if (k.t > W2.HEDGEHOG_TUCKED * (k.after ? 0.7 : 1) && (!k.after || Math.abs(dx) > 2 * T)) setCrit(k, "uncurl"); return; }   // startled: stays tucked while David's close
  if (k.state === "uncurl") {   // the curl played backwards. Hit: off it runs the way it came. Startled: back to what it was doing
    fall();
    if (k.t > SPR.hedgehog_curl.frames * SPR.hedgehog_curl.ms / 1000 * 0.6) {
      if (k.after) { setCrit(k, k.after); k.after = null; } else { k.gone = true; k.facing = -1; k.vx = -W2.HEDGEHOG_RUN; }
    }
    return;
  }
  fall();   // rest: done for the day, snuffling about
}
function stoneHitsHedgehog(k, s) {   // it curls up into a spiky ball; then it uncurls and runs off, and won't be back
  stoneHit(s, 0.4);
  if ((k.state === "curl" || k.state === "ball" || k.state === "uncurl") && !k.after) return true;
  k.vx = 0; k.after = null; setCrit(k, "curl");
  toast("You hit the hedgehog! It curled up into a ball... now it'll run. The scorpions are yours: crouch (Down) and throw, the stone flies low.");
  return true;
}
function drawSmallCritter(k, x, name) {
  if (k.kind === "hedgehog") {
    const c = SPR.hedgehog_curl, n = c ? c.frames : 1, curlT = n * (c ? c.ms : 100) / 1000;
    if (k.state === "curl" && !k.gone) { drawSprite("hedgehog_curl", Math.min(n - 1, Math.floor(k.t / curlT * n)), x, k.y, k.facing, 1, k.alpha); return; }
    if (k.state === "uncurl" && !k.gone) { drawSprite("hedgehog_curl", Math.max(0, n - 1 - Math.floor(k.t / (curlT * 0.6) * n)), x, k.y, k.facing, 1, k.alpha); return; }
    if (k.state === "ball" && !k.gone) { drawSprite("hedgehog_ball", frameOf("hedgehog_ball", k.t), x, k.y, k.facing, 1, k.alpha); return; }
    if (k.gone) { drawSprite(name, frameOf(name, performance.now() / 1000 * 3), x, k.y, k.facing, 1, k.alpha); return; }   // running: the walk, skipping frames
    drawSprite(name, k.state === "walk" ? frameOf(name, k.t * 1.5) : 0, x, k.y, k.facing, 1, k.alpha); return;
  }
  drawSprite(name, frameOf(name, k.t), x, k.y, k.facing, 1, k.alpha);
}

// ---------------------------------------------------------------------------
// 2-2's pool and the tortoise (DESIGN 2-2: "leave it and it becomes a stepping stone"). The pool is too wide to jump;
// the tortoise plods back and forth along its bottom with its shell at the waterline, and carries David across.
// Hit it with a stone and it pulls into its shell for a while (Glen's clip). Fall in the water: back to the bank, a heart.
//   setPiece("pool", c, GR, { w })   water over columns c..c+w-1 (the level clears the ground there, keeping a floor)
// ---------------------------------------------------------------------------
Object.assign(W2, { TORTOISE_WALK: 48, TORTOISE_HIDE: 3.2 });
CRITTER_ART.tortoise = { idle: "tortoise_walk", move: "tortoise_walk", len: 100, h: 70, box: k => spriteBox(k, "tortoise_walk", 70) };
function shellSpan(k) {   // the columns the shell covers (its back is a stepping stone)
  const b = critterBox(k), pad = (b.x1 - b.x0) * 0.16;
  return [Math.floor((b.x0 + pad) / T), Math.floor((b.x1 - pad) / T)];
}
function updateTortoise(k, dx, sameLevel, dt) {
  const x0 = k.x;
  k.vy = Math.min(TUNE.MAX_FALL, k.vy + TUNE.GRAVITY * dt);
  if (k.state === "idle") setCrit(k, "walk");
  if (k.state === "walk") {
    if (!runCritter(k, W2.TORTOISE_WALK, dt) || (k.range && Math.abs(k.x - k.home) > k.range && Math.sign(k.x - k.home) === k.facing)) k.facing = -k.facing;
  } else { k.vx = 0; collideBody(k, 40, 30, dt); if (k.state === "hide" && k.t > W2.TORTOISE_HIDE) setCrit(k, "peek"); if (k.state === "peek" && k.t > 1.2) setCrit(k, "walk"); }
  // the shell as a stepping stone: one-way tiles at the waterline under it, and David rides along
  const pool = setPieces.find(p => p.kind === "pool" && k.x > p.c * T && k.x < (p.c + p.w) * T);
  for (const c of k.tiles || []) oneway[GR][c] = false;
  k.tiles = [];
  if (pool) { const [c0, c1] = shellSpan(k); for (let c = Math.max(c0, pool.c); c <= Math.min(c1, pool.c + pool.w - 1); c++) { oneway[GR][c] = true; k.tiles.push(c); } }
  const d = david, ride = d.onGround && Math.abs(d.y - GR * T) < 3 && k.tiles.includes(Math.floor(d.x / T));
  if (ride) d.x += k.x - x0;
}
function stoneHitsTortoise(k, s) {
  stoneHit(s, 0.5);
  if (k.state !== "hide") { setCrit(k, "hide"); toast("The tortoise pulled into its shell. Leave it be, and it will carry you across."); }
  return true;
}
function drawTortoise(k, x) {
  const h = SPR.tortoise_hide, n = h ? h.frames : 1;
  if (k.state === "hide") drawSprite("tortoise_hide", Math.min(n - 1, Math.floor(k.t / 1.0 * n)), x, k.y, k.facing);
  else if (k.state === "peek") drawSprite("tortoise_hide", Math.max(0, n - 1 - Math.floor(k.t / 1.2 * n)), x, k.y, k.facing);
  else drawSprite("tortoise_walk", frameOf("tortoise_walk", k.t), x, k.y, k.facing);
}
function updatePools() {
  const d = david;
  for (const p of setPieces) if (p.kind === "pool" && d.deadT <= 0 && !inCutscene() && d.x > p.c * T && d.x < (p.c + p.w) * T && d.y > GR * T + 34) {
    pitFall(); toast("Splash! Into the pool. The tortoise will carry you, if you let it.");
  }
}
function drawPools(camX) {   // shallow green-brown water, in front of the tortoise's legs
  const now = performance.now() / 1000;
  for (const p of setPieces) if (p.kind === "pool") {
    const x0 = p.c * T - camX, w = p.w * T; if (x0 > W || x0 + w < 0) continue;
    const top = GR * T + 34;   // low enough that the top of the tortoise's shell shows
    ctx.save();
    const g = ctx.createLinearGradient(0, top, 0, ROWS * T);
    g.addColorStop(0, "rgba(96,140,130,0.6)"); g.addColorStop(1, "rgba(44,70,62,0.92)");
    ctx.fillStyle = g; ctx.fillRect(x0, top, w, ROWS * T - top);
    ctx.strokeStyle = "rgba(230,245,235,0.55)"; ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let sx = 0; sx <= w; sx += 8) ctx.lineTo(x0 + sx, top + 4 + k * 14 + Math.sin(sx * 0.05 + now * 2 + k) * 2.5); ctx.stroke(); }
    ctx.restore();
  }
}
