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
    if (touchesDavid(b) && david.deadT <= 0) {   // it won't let him by: shoved back the way he came
      david.x = david.x < (b.x0 + b.x1) / 2 ? b.x0 - BODY_W / 2 - 1 : b.x1 + BODY_W / 2 + 1;
      if (!k.told) { k.told = true; toast("The donkey is too frightened to let anyone by. Sit and play the harp for it (Select)."); }
    }
    return;
  }
  if (k.state === "calm") { fall(); if (k.t > 2.4) setCrit(k, "graze"); return; }
  if (k.state === "graze" || k.state === "follow") {   // stays near David, grazing whenever he stops
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
  if (d.deadT > 0) { endHarpDuel(); return false; }
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
