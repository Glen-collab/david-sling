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
}
function updateSceneDavid(d, dt) { return updateStonesTalk(d, dt); }
function resetWorld2(restart) {   // after a fall (restart: out of lives, back to the start of the stage)
  Object.assign(flood, { on: false, done: false, startT: 0, told: false, level: 1, lastX: undefined }); hushFlood();
  resetEagles();
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
